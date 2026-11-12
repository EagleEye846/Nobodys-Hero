import { TILE_SIZE as T, SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';
import { TILES } from './tileset.js';
import { COAST_AREAS } from './coastTiles.js';
import { daylight } from './daylight.js';
import { animationFrame } from '../engine/animations.js';
import { hash } from '../engine/noise.js';
import { SmallLife } from './smallLife.js';

// LIVELINESS: the world noticing you. Small things that answer to the party
// being there, wherever you are, without a room having to ask for them:
//
//   (the party mirrored in still water and on ice is reflections.js's)
//   - your friends in a standing mirror beside you, and glancing at it now and then
//   - footprints in soft sand, and your friends' prints in the snow beside yours
//   - wet prints for a few steps after you've waded out of the shallows or the bog
//   - wading: the shallows lap over your boots (the splashes are footfall.js's)
//   - tall flowers, ferns and dune grass round your ankles, rustling as you go
//   - birds pecking about outdoors that scatter when you come near (and come
//     back a while later, once you've gone)
//   - a moth or two drawn to your candle in the dark
//   - your friends' breath in the cold, as well as your own
//   - Bramble, left standing about long enough, sits down for a rest
//   (and skids, trodden grass, mice, frogs, fireflies, falling leaves and
//   glinting chests, in smallLife.js)
//
// None of it has a body or touches a puzzle: it's all drawn, and worked out
// from where everyone is. What's kept between frames is small (the birds,
// the moths, where each of you last put a foot down).

const seedOf = (text) => [...text].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 100003, 7);

// Prints: how far apart, how long each kind lasts, and their colour.
const PRINT_STRIDE = 7;
const MAX_PRINTS = 160;
const PRINTS = {
  snow: { seconds: 70, color: '96, 116, 160', alpha: 0.5 },
  sand: { seconds: 16, color: '160, 120, 64', alpha: 0.75, rim: '255, 250, 226' },
  wet: { seconds: 7, color: '70, 64, 52', alpha: 0.6 },
  mud: { seconds: 9, color: '58, 42, 26', alpha: 0.55 },
};
// Out of the water, this many wet steps before your boots are dry.
const WET_STEPS = 9;

// Tall growth you wade through (walkable, drawn round your ankles).
const OVERGROWTH = 'N';
// Ground birds peck about on.
const BIRD_GROUND = new Set([',', ':', '.', 'X', 'y', 'd', 'n', 'i', 'q']);

// Which birds live where, by region: body, head, breast, beak, legs.
const BIRDS = {
  // Snow buntings round the village and the stair.
  stair: { body: '#7c7a86', head: '#4e4a58', breast: '#e8e6ee', beak: '#e0a040', legs: '#3a3440' },
  rest: { body: '#8a6e52', head: '#4e3e30', breast: '#f0ece4', beak: '#e0a040', legs: '#3a3440' },
  // Robins in the scarlet wood.
  pinefall: { body: '#6e5a48', head: '#4a3c30', breast: '#e0582c', beak: '#e8b048', legs: '#3a2c20' },
  // Crows in the empty village and the dead city.
  hollin: { body: '#2a2632', head: '#1e1a26', breast: '#3a3446', beak: '#5e5866', legs: '#1a1620', crow: true },
  valley: { body: '#2a2632', head: '#1e1a26', breast: '#3a3446', beak: '#5e5866', legs: '#1a1620', crow: true },
  // Sparrows in the sunny fields.
  sunnyside: { body: '#8e5e36', head: '#6a4428', breast: '#e0caa0', beak: '#ecb848', legs: '#5a3a20' },
  // Sandpipers on the beach.
  gullrest: { body: '#b09a72', head: '#8a7656', breast: '#f6eedc', beak: '#2e2620', legs: '#2e2620', piper: true },
};
// How near you can come before they go (walking, running).
const SCARE = [34, 58];
// Gone for this long before they come back.
const AWAY = [22, 40];

// A moth round your candle: how far out it loops.
const MOTH_REACH = 13;

// Breath in the cold, for your friends (your own is the scene's).
const BREATH_EVERY = [2.4, 4];

// Stood about this long, Bramble sits down in the grass till you move.
const SIT_AFTER = 32;

const airborne = (b) => Boolean(b.isAirborne || b.leaping);
const moving = (b) => Boolean(b.walking ?? (b.moving && !b.isAirborne));

export class Liveliness {
  constructor(scene) {
    this.scene = scene;
    const data = scene.roomData;
    this.area = data.area;
    this.coast = COAST_AREAS.has(data.area);
    this.feet = new Map();
    this.overlays = new Map();
    this.breathIn = new Map();
    // Pixels of the room's picture, worked out once a tile as they're needed.
    this.growth = new Map();
    this.waterTone = new Map();
    this.birds = this.placeBirds();
    this.birdThings = this.birds.map((bird) => ({
      get sortY() { return bird.y; },
      draw: (ctx) => this.drawGroundBird(ctx, bird),
    }));
    this.moths = data.dark ? [0, 1].map((i) => ({ x: 0, y: 0, vx: 0, vy: 0, phase: i * 3.1, ready: false })) : [];
    // Skids, trodden grass, mice, frogs, fireflies, falling leaves, chests (smallLife.js).
    this.small = new SmallLife(scene, this);
    this.birdThings.push(...this.small.things);
    this.things = this.birdThings;
  }

  get room() {
    return this.scene.room;
  }

  // Everyone of the party on the field just now.
  bodies() {
    const s = this.scene;
    const list = [s.player, ...s.others, ...s.followers];
    return list.filter((b) => b && !b.hidden && !b.tucked);
  }

  // Whether the scene is drawing everyone as themselves (not on a geyser
  // ride, a rope, a toss or a climb, which draw you their own way).
  get ordinary() {
    const s = this.scene;
    return !s.ride && !s.rope && !s.hop && !s.climb && !s.spire;
  }

  tileUnder(b) {
    return this.room.tileAt(Math.floor(b.x / T), Math.floor((b.y - 1) / T));
  }

  update(dt) {
    const bodies = this.ordinary ? this.bodies() : [];
    for (const b of bodies) this.stepFeet(b);
    this.breathe(dt, bodies);
    this.updateBirds(dt, bodies);
    this.updateMoths(dt);
    this.small.update(dt, bodies);
    this.restBramble();
    this.glanceAtMirrors();
    // Things drawn among everyone: the birds on the ground, and what's round
    // each of your ankles (it goes just in front of whoever it's round).
    // Made again only when who's about changes.
    const n = this.birdThings.length;
    if (this.things.length !== n + bodies.length || bodies.some((b, i) => this.things[n + i] !== this.overlays.get(b))) {
      this.things = [...this.birdThings, ...bodies.map((b) => this.overlayFor(b))];
    }
  }

  // --- Prints: sand, friends in the snow, and wet boots. ---

  stepFeet(b) {
    const s = this.scene;
    let foot = this.feet.get(b);
    if (!foot) this.feet.set(b, foot = { x: b.x, y: b.y, since: 0, side: 1, wet: 0, wetKind: 'wet' });
    const tile = this.tileUnder(b);
    const ground = b.ground ?? 0;
    // In the water or the bog: wet boots for the next few steps out of it.
    if (ground === 0 && !airborne(b)) {
      if (this.coast && tile === ';') { foot.wet = WET_STEPS; foot.wetKind = 'wet'; }
      if (tile === '%') { foot.wet = WET_STEPS; foot.wetKind = 'mud'; }
    }
    if (!moving(b) || airborne(b) || ground > 0) {
      foot.x = b.x;
      foot.y = b.y;
      return;
    }
    foot.since += Math.hypot(b.x - foot.x, b.y - foot.y);
    foot.x = b.x;
    foot.y = b.y;
    if (foot.since < PRINT_STRIDE) return;
    foot.since = 0;
    foot.side = -foot.side;
    // Pushing through tall flowers or ferns: now and then a petal or a bit
    // of leaf flicked up.
    if (tile === OVERGROWTH && Math.random() < (b.running ? 0.5 : 0.25)) {
      const bits = this.growthOf(Math.floor(b.x / T), Math.floor((b.y - 1) / T))?.bits;
      if (bits?.length) s.particles.push({ kind: 'bit', color: bits[Math.floor(Math.random() * bits.length)], x: b.x + (Math.random() - 0.5) * 6, y: b.y - 2, vx: (Math.random() - 0.5) * 20, vy: -18 - Math.random() * 14, life: 0.8, age: 0, flutter: true, phase: Math.random() * 6 });
    }
    let kind = null;
    // (Your own prints in the snow are the scene's: these are your friends'.)
    if ((tile === 'n' || tile === 'i') && b !== s.player) kind = 'snow';
    else if (this.area === 'gullrest' && tile === '.') kind = 'sand';
    else if (foot.wet > 0 && TILES[tile] && !TILES[tile].solid && !(this.coast && tile === ';') && tile !== '%' && tile !== 'n' && tile !== 'i') {
      kind = foot.wetKind;
      foot.wet -= 1;
    }
    if (!kind) return;
    const dir = b.dir ?? b.facing;
    const sideways = dir === 'left' || dir === 'right' || dir === 1 || dir === -1;
    this.addPrint(kind, b.x + (sideways ? 0 : foot.side * 3), b.y + (sideways ? foot.side * 2 : 0), foot.wet / WET_STEPS);
  }

  addPrint(kind, x, y, fresh = 1) {
    const s = this.scene;
    const look = PRINTS[kind];
    const born = s.time;
    // Wet prints fade as your boots dry: the last few are fainter.
    const strength = kind === 'wet' || kind === 'mud' ? 0.45 + 0.55 * fresh : 1;
    const print = {
      sortY: -1e9,
      draw(ctx, camera) {
        const age = (s.time - born) / look.seconds;
        if (age >= 1) return;
        const px = Math.round(x) - 1 - camera.x;
        const py = Math.round(y) - 3 - camera.y;
        const fade = look.alpha * strength * (1 - age);
        ctx.fillStyle = `rgba(${look.color}, ${fade.toFixed(3)})`;
        ctx.fillRect(px, py, 2, 3);
        // In sand, the edge pushed up round the heel catches the light.
        if (look.rim) {
          ctx.fillStyle = `rgba(${look.rim}, ${fade.toFixed(3)})`;
          ctx.fillRect(px, py + 3, 2, 1);
        }
      },
    };
    s.prints.push(print);
    if (s.prints.length > MAX_PRINTS) s.prints.shift();
  }

  // --- Round your ankles: the shallows, and tall flowers and ferns. ---

  overlayFor(b) {
    let thing = this.overlays.get(b);
    if (!thing) {
      thing = {
        get sortY() { return b.sortY + 0.01; },
        draw: (ctx, camera) => this.drawAnkles(ctx, camera, b),
      };
      this.overlays.set(b, thing);
    }
    return thing;
  }

  drawAnkles(ctx, camera, b) {
    if (!this.ordinary || b.hidden || b.tucked || airborne(b) || (b.ground ?? 0) > 0 || b.sinking > 0 || b.balancing) return;
    const tile = this.tileUnder(b);
    const x = Math.round(b.x) - camera.x;
    const feet = Math.round(b.y) + (b.sag ?? 0) - camera.y;
    if (this.coast && tile === ';') this.drawWading(ctx, b, x, feet);
    else if (tile === OVERGROWTH && !TILES[tile]?.solid) this.drawGrowth(ctx, camera, b, x, feet);
    else if (tile === ',' && !this.scene.cold) this.small.drawTufts(ctx, b, x, feet);
  }

  // Ankle-deep: the water over the boots, a bright line where it meets them
  // (broken and drifting, so it reads as moving water).
  drawWading(ctx, b, x, feet) {
    const tone = this.toneOf(Math.floor(b.x / T), Math.floor((b.y - 1) / T));
    if (!tone) return;
    // A room with `wadeSlow` (the cliff cave's pool) is deeper: shin-deep, the boots gone.
    const deep = this.room.wadeSlow ? 3 : 1;
    ctx.fillStyle = tone.water;
    ctx.fillRect(x - 4, feet - deep, 8, deep);
    ctx.fillStyle = tone.line;
    const shift = Math.floor(this.scene.time * 4) % 3;
    for (let i = -5; i < 5; i++) {
      if ((i + shift + 9) % 3 !== 0) ctx.fillRect(x + i, feet - deep, 1, 1);
    }
  }

  // The tall stuff in front of their boots: the very pixels of the tile
  // they're standing in (its flowers, fronds or blades, not the ground under
  // them), and a pixel's sway to either side as they push through.
  drawGrowth(ctx, camera, b, x, feet) {
    const wx = Math.round(b.x);
    const wy = Math.round(b.y);
    const sway = moving(b) ? (Math.floor(this.scene.time * 7 + wx * 0.1) % 2 ? 1 : -1) : 0;
    const left = wx - 6;
    const top = wy - 5;
    for (let ty = Math.floor(top / T); ty <= Math.floor((wy - 1) / T); ty++) {
      for (let tx = Math.floor(left / T); tx <= Math.floor((left + 11) / T); tx++) {
        if (this.room.tileAt(tx, ty) !== OVERGROWTH) continue;
        const mask = this.growthOf(tx, ty);
        if (!mask) continue;
        // The part of this tile inside the strip round their ankles.
        const sx0 = Math.max(left, tx * T);
        const sy0 = Math.max(top, ty * T);
        const sx1 = Math.min(left + 12, tx * T + T);
        const sy1 = Math.min(wy, ty * T + T);
        if (sx1 <= sx0 || sy1 <= sy0) continue;
        ctx.drawImage(mask, sx0 - tx * T, sy0 - ty * T, sx1 - sx0, sy1 - sy0, sx0 + sway - camera.x, sy0 - camera.y, sx1 - sx0, sy1 - sy0);
      }
    }
  }

  // The growth on a tile, without its ground: every pixel well away from the
  // tile's commonest colour (its grass or earth) and its near shades.
  growthOf(tx, ty) {
    const key = tx + ty * 4096;
    if (this.growth.has(key)) return this.growth.get(key);
    const pixels = this.tilePixels(tx, ty);
    let mask = null;
    if (pixels) {
      const base = commonest(pixels.data);
      const d = pixels.data;
      for (let i = 0; i < d.length; i += 4) {
        const far = Math.abs(d[i] - base[0]) + Math.abs(d[i + 1] - base[1]) + Math.abs(d[i + 2] - base[2]);
        if (far < 40) d[i + 3] = 0;
      }
      mask = document.createElement('canvas');
      mask.width = T;
      mask.height = T;
      mask.getContext('2d').putImageData(pixels, 0, 0);
      // Bits of it to throw up as you push through (a few of its colours).
      mask.bits = [];
      for (let i = 0; i < d.length && mask.bits.length < 6; i += 4 * 23) if (d[i + 3]) mask.bits.push(`rgb(${d[i]}, ${d[i + 1]}, ${d[i + 2]})`);
    }
    this.growth.set(key, mask);
    return mask;
  }

  // The shallows' own colour on a tile, and a lighter one for the waterline.
  toneOf(tx, ty) {
    const key = tx + ty * 4096;
    if (this.waterTone.has(key)) return this.waterTone.get(key);
    const pixels = this.tilePixels(tx, ty);
    let tone = null;
    if (pixels) {
      const [r, g, b] = commonest(pixels.data);
      const mix = (c) => Math.round(c + (255 - c) * 0.5);
      tone = { water: `rgba(${r}, ${g}, ${b}, 0.85)`, line: `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})` };
    }
    this.waterTone.set(key, tone);
    return tone;
  }

  // A tile's pixels from the room's picture. The whole picture is read back
  // once, the first time any tile's needed (one read, not one a tile, which
  // would stall a frame each time you stepped somewhere new).
  tilePixels(tx, ty) {
    const bg = this.room.background;
    if (!bg || tx < 0 || ty < 0 || (tx + 1) * T > bg.width || (ty + 1) * T > bg.height) return null;
    if (this.picture === undefined) {
      try {
        this.picture = bg.getContext('2d').getImageData(0, 0, bg.width, bg.height);
      } catch {
        this.picture = null;
      }
    }
    if (!this.picture) return null;
    const out = new ImageData(T, T);
    const from = this.picture.data;
    for (let row = 0; row < T; row++) {
      const start = ((ty * T + row) * bg.width + tx * T) * 4;
      out.data.set(from.subarray(start, start + T * 4), row * T * 4);
    }
    return out;
  }

  // (Reflections in still water and on ice are reflections.js's.)

  // Called with the room's floor, before anyone stands on it.
  drawFloor(ctx) {
    if (!this.ordinary) return;
    this.drawBirdShadows(ctx);
    this.small.drawFloor(ctx);
  }

  frameOf(b) {
    if (b.animation) {
      const a = b.animation;
      const frame = animationFrame(a.name, performance.now() / 1000 - a.start, a.speed, true);
      if (frame) return frame;
    }
    if (typeof b.currentFrame === 'function') return b.currentFrame();
    return b.frame ?? null;
  }

  // --- Your friends in a standing mirror (see OverworldScene.drawMirrorImage). ---

  // The frame a member shows in the glass: turned round (facing the glass,
  // you see their face), walking as they walk.
  mirrorFrame(b) {
    const turned = { up: 'down', down: 'up', left: 'left', right: 'right' };
    if (b.animation) return this.frameOf(b);
    // One of you split off and standing about (a Player in a friend's skin).
    if (typeof b.currentFrame === 'function') return b.currentFrame(turned[b.facing] ?? 'down');
    const dir = turned[(b.walking ? null : b.glanceDir) ?? b.dir] ?? 'down';
    if (!b.frames) return b.frameLooking?.(dir) ?? b.frame;
    const step = b.walking ? (Math.floor(b.time / 0.18) % 2 ? 'Step' : 'Idle') : 'Idle';
    return b.frames[`${dir}${step}`] ?? b.frames[`${dir}Idle`];
  }

  // Now and then a friend standing in front of a mirror glances at it.
  glanceAtMirrors() {
    this.mirrorProps ??= this.room.allProps.filter((p) => p.look === 'mirror');
    if (!this.mirrorProps.length) return;
    const mirrors = this.mirrorProps.filter((p) => !p.hidden && this.room.props.includes(p));
    for (const f of this.scene.followers) {
      if (f.walking) f.mirrorDue = null;
      if (f.walking || f.hidden || f.fidget || f.animation || f.glanceDir) continue;
      const near = mirrors.some((m) => Math.abs(f.x - (m.x + m.width / 2)) < 2 * T && f.y > m.y + T && f.y - (m.y + T) < 4 * T);
      if (!near) continue;
      f.mirrorDue ??= f.stillFor + 1.5 + Math.random() * 3;
      if (f.stillFor < f.mirrorDue) continue;
      f.glanceDir = 'up';
      f.glanceUntil = f.stillFor + 1.6;
      f.mirrorDue = f.stillFor + 7 + Math.random() * 6;
    }
  }

  // --- Breath in the cold. ---

  breathe(dt, bodies) {
    const s = this.scene;
    if (!s.cold) return;
    for (const b of bodies) {
      if (b === s.player || airborne(b)) continue;
      let left = this.breathIn.get(b) ?? 0.6 + Math.random() * 2;
      left -= dt;
      if (left <= 0) {
        left = BREATH_EVERY[0] + Math.random() * (BREATH_EVERY[1] - BREATH_EVERY[0]) - (b.running ? 1.2 : 0);
        const frame = this.frameOf(b);
        const dir = b.dir ?? b.facing;
        const way = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
        const mouth = Math.round((frame?.height ?? 24) * 0.55);
        s.particles.push({ kind: 'breath', x: b.x + way * 4, y: b.y - (b.ground ?? 0) - mouth, vx: way * 6 + (Math.random() - 0.5) * 4, vy: -7, life: b.running ? 1.3 : 1.1, age: 0 });
      }
      this.breathIn.set(b, left);
    }
  }

  // --- Birds on the ground, outdoors by day. ---

  placeBirds() {
    const s = this.scene;
    const data = s.roomData;
    const look = BIRDS[data.area];
    if (!look || !s.underSky || data.weather || data.dark || s.spire || daylight().night > 0.5) return [];
    const seed = seedOf(data.id);
    // Not every room: about two in three have a few about.
    if (hash(seed) > 0.66) return [];
    const room = this.room;
    const doors = data.doors ?? [];
    const taken = new Set(room.allProps.map((p) => `${Math.floor(p.x / T)},${Math.floor(p.y / T)}`));
    const open = (x, y) => BIRD_GROUND.has(room.tileAt(x, y)) && !TILES[room.tileAt(x, y)]?.solid && !taken.has(`${x},${y}`)
      && !doors.some((d) => x >= d.x - 1 && x < d.x + (d.w ?? 1) + 1 && y >= d.y - 1 && y < d.y + (d.h ?? 1) + 1);
    const spots = [];
    const start = data.playerStart ?? { x: -99, y: -99 };
    for (let y = 1; y < room.height - 1; y++) {
      for (let x = 1; x < room.width - 1; x++) {
        if (Math.abs(x - start.x) + Math.abs(y - start.y) < 6) continue;
        if (open(x, y) && open(x + 1, y) && open(x - 1, y) && open(x, y + 1) && open(x, y - 1)) spots.push([x, y]);
      }
    }
    if (!spots.length) return [];
    const [hx, hy] = spots[Math.floor(hash(seed + 1) * spots.length)];
    const count = 2 + Math.floor(hash(seed + 2) * 3);
    const birds = [];
    for (let i = 0; i < count; i++) {
      const x = hx * T + 8 + (i - (count - 1) / 2) * 9 + Math.round((hash(seed + 10 + i) - 0.5) * 4);
      const y = hy * T + 10 + (i % 2 ? 5 : -2) + Math.round((hash(seed + 20 + i) - 0.5) * 4);
      birds.push({ look, x, y, homeX: x, homeY: y, alt: 0, vx: 0, vy: 0, mode: 'peck', t: hash(seed + 30 + i) * 3, face: hash(seed + 40 + i) < 0.5 ? -1 : 1, next: 0.5 + hash(seed + 50 + i) * 2, peck: 0, hop: 0 });
    }
    return birds;
  }

  updateBirds(dt, bodies) {
    for (const bird of this.birds) {
      bird.t += dt;
      if (bird.mode === 'peck') {
        // Startled: off and away from whoever came near.
        let threat = null;
        for (const b of bodies) {
          const reach = b.running ? SCARE[1] : SCARE[0];
          const d = Math.hypot(b.x - bird.x, b.y - bird.y);
          if (d < reach && (!threat || d < threat.d)) threat = { d, b };
        }
        if (threat) {
          const dx = bird.x - threat.b.x || (Math.random() - 0.5);
          const dy = bird.y - threat.b.y;
          const len = Math.hypot(dx, dy) || 1;
          const speed = 70 + Math.random() * 30;
          bird.vx = (dx / len) * speed + (Math.random() - 0.5) * 20;
          bird.vy = (dy / len) * speed * 0.5 - 10;
          bird.face = bird.vx < 0 ? -1 : 1;
          bird.mode = 'fly';
          bird.t = Math.random() * 0.2;
          continue;
        }
        // Pecking about: now a peck, now a hop, now a turn.
        bird.peck = Math.max(0, bird.peck - dt);
        bird.hop = Math.max(0, bird.hop - dt);
        bird.next -= dt;
        if (bird.next <= 0) {
          const roll = Math.random();
          if (roll < 0.5) bird.peck = 0.25;
          else if (roll < 0.8) {
            // A hop, never far from where they started.
            const nx = bird.x + (Math.random() < 0.5 ? -3 : 3);
            const ny = bird.y + Math.round((Math.random() - 0.5) * 4);
            if (Math.abs(nx - bird.homeX) < 14 && Math.abs(ny - bird.homeY) < 8) {
              bird.face = nx < bird.x ? -1 : 1;
              bird.x = nx;
              bird.y = ny;
              bird.hop = 0.12;
            }
          } else bird.face = -bird.face;
          bird.next = 0.4 + Math.random() * 1.6;
        }
      } else if (bird.mode === 'fly') {
        // Up and away, wings going, till it's off the screen.
        bird.alt += (bird.look.piper ? 22 : 38) * dt;
        bird.x += bird.vx * dt;
        bird.y += bird.vy * dt;
        bird.vx *= 1 + dt * 0.4;
        const sx = bird.x - this.scene.camera.x;
        const sy = bird.y - bird.alt - this.scene.camera.y;
        if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20 || bird.t > 6) {
          bird.mode = 'away';
          bird.t = AWAY[0] + Math.random() * (AWAY[1] - AWAY[0]);
        }
      } else if (bird.mode === 'away') {
        bird.t -= dt;
        if (bird.t > 0) continue;
        // Back when nobody's near where they were.
        if (bodies.some((b) => Math.hypot(b.x - bird.homeX, b.y - bird.homeY) < 90)) { bird.t = 4; continue; }
        bird.mode = 'land';
        bird.face = Math.random() < 0.5 ? -1 : 1;
        bird.x = bird.homeX - bird.face * 70;
        bird.y = bird.homeY;
        bird.alt = 46;
        bird.t = 0;
      } else if (bird.mode === 'land') {
        // Gliding down onto the spot again.
        const k = Math.min(1, dt * 1.6);
        bird.x += (bird.homeX - bird.x) * k;
        bird.alt += (0 - bird.alt) * k;
        if (Math.abs(bird.homeX - bird.x) < 1 && bird.alt < 1) {
          bird.x = bird.homeX;
          bird.alt = 0;
          bird.mode = 'peck';
          bird.next = 0.6;
        }
        if (bodies.some((b) => Math.hypot(b.x - bird.homeX, b.y - bird.homeY) < SCARE[1])) { bird.mode = 'fly'; bird.vx = bird.face * 80; bird.vy = -10; bird.t = 0; }
      }
    }
  }

  // Standing about, pecking: a little side-on bird, outlined like everyone
  // else in the game (see birdSprite).
  drawGroundBird(ctx, bird) {
    if (bird.mode !== 'peck') return;
    const cam = this.scene.camera;
    const x = Math.round(bird.x) - cam.x;
    const y = Math.round(bird.y) - cam.y - (bird.hop > 0 ? 1 : 0);
    if (x < -10 || x > W + 10 || y < -10 || y > H + 10) return;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(x - 3, y + (bird.hop > 0 ? 1 : 0), 6, 1);
    ctx.drawImage(birdSprite(bird.look, bird.peck > 0, bird.face), x - BIRD_X, y - BIRD_Y);
  }

  // Off the ground: wings beating, drawn over everything (a bird in the air).
  drawOver(ctx) {
    if (!this.ordinary) return;
    this.small.drawOver(ctx);
    const cam = this.scene.camera;
    for (const bird of this.birds) {
      if (bird.mode !== 'fly' && bird.mode !== 'land') continue;
      const x = Math.round(bird.x) - cam.x;
      const y = Math.round(bird.y - bird.alt) - cam.y - 3;
      if (x < -8 || x > W + 8 || y < -8 || y > H + 8) continue;
      const up = Math.floor(bird.t * (bird.mode === 'land' ? 8 : 16)) % 2 === 0;
      // A body of a few pixels with its head out front, and the wings, dark
      // against the ground, up in a V and then down level.
      ctx.fillStyle = '#1a1420';
      if (up) {
        ctx.fillRect(x - 3, y - 2, 1, 1);
        ctx.fillRect(x + 3, y - 2, 1, 1);
        ctx.fillRect(x - 2, y - 1, 1, 1);
        ctx.fillRect(x + 2, y - 1, 1, 1);
      } else {
        ctx.fillRect(x - 3, y + 1, 1, 1);
        ctx.fillRect(x + 3, y + 1, 1, 1);
        ctx.fillRect(x - 2, y, 1, 1);
        ctx.fillRect(x + 2, y, 1, 1);
      }
      ctx.fillRect(x - 1, y - 1, 3, 3);
      ctx.fillStyle = bird.look.body;
      ctx.fillRect(x - 1, y, 2, 1);
      ctx.fillStyle = bird.look.breast;
      ctx.fillRect(x + (bird.face > 0 ? 1 : -1), y, 1, 1);
    }
  }

  // Their shadows on the ground under them, smaller the higher they go.
  drawBirdShadows(ctx) {
    const cam = this.scene.camera;
    for (const bird of this.birds) {
      if ((bird.mode !== 'fly' && bird.mode !== 'land') || bird.alt > 60) continue;
      const w = bird.alt > 30 ? 1 : 2;
      ctx.fillStyle = `rgba(0, 0, 0, ${(0.18 * (1 - bird.alt / 60)).toFixed(3)})`;
      ctx.fillRect(Math.round(bird.x) - cam.x - 1, Math.round(bird.y) - cam.y, w + 1, 1);
    }
  }

  // --- Moths round your candle, in the dark. ---

  updateMoths(dt) {
    if (!this.moths.length) return;
    const s = this.scene;
    const reach = s.lightReach?.() ?? 0;
    const { x: lx, y: ly } = s.lightPoint;
    for (const m of this.moths) {
      m.lit = reach > 20;
      if (!m.lit) { m.ready = false; continue; }
      // Each loops round the flame on its own lopsided, jittery path, and
      // trails behind when you walk off with the light.
      const t = s.time * (1.6 + m.phase * 0.12) + m.phase;
      const tx = lx + Math.sin(t) * MOTH_REACH + Math.sin(t * 3.7) * 3;
      const ty = ly + Math.cos(t * 1.3) * MOTH_REACH * 0.6 + Math.sin(t * 5.1) * 2 - 2;
      if (!m.ready) { m.x = tx; m.y = ty; m.ready = true; }
      const k = Math.min(1, dt * 5);
      m.x += (tx - m.x) * k;
      m.y += (ty - m.y) * k;
    }
  }

  // Drawn over the dark (they're in the candle's light).
  drawTop(ctx) {
    if (this.ordinary) this.small.drawTop(ctx);
    if (!this.moths.length || !this.ordinary) return;
    const s = this.scene;
    const cam = s.camera;
    for (const m of this.moths) {
      if (!m.lit || !m.ready) continue;
      const x = Math.round(m.x) - cam.x;
      const y = Math.round(m.y) - cam.y;
      const open = Math.floor(s.time * 22 + m.phase * 5) % 2 === 0;
      ctx.fillStyle = '#f2e6c4';
      ctx.fillRect(x, y, 1, 1);
      ctx.fillStyle = 'rgba(230, 214, 176, 0.85)';
      if (open) {
        ctx.fillRect(x - 1, y - 1, 1, 1);
        ctx.fillRect(x + 1, y - 1, 1, 1);
      } else {
        ctx.fillRect(x - 1, y, 1, 1);
        ctx.fillRect(x + 1, y, 1, 1);
      }
    }
  }

  // --- Bramble, sat down for a rest. ---

  restBramble() {
    const s = this.scene;
    const bramble = s.followers.find((f) => f.id === 'bramble');
    if (!bramble) return;
    const sitting = bramble.animation?.lazing;
    const busy = s.cutscene || s.textbox?.isOpen || s.pauseMenu?.isOpen || !this.ordinary || s.others.length;
    if (sitting) {
      // Up again the moment you set off (or anything else happens).
      if (busy || s.idleTime < 0.05 || bramble.walking) {
        bramble.animation = null;
        if (!busy) bramble.perform('stand');
      }
      return;
    }
    if (busy || s.idleTime < SIT_AFTER || bramble.walking || bramble.hidden || bramble.act || bramble.animation || bramble.fidget || bramble.balancing || bramble.ground > 0) return;
    // Not in water, the bog or the snow: somewhere you'd sit.
    const tile = this.tileUnder(bramble);
    if (!TILES[tile] || TILES[tile].solid || ';%=$~nizg'.includes(tile)) return;
    bramble.animation = { name: 'bramble_sit', start: performance.now() / 1000, speed: 1.4, lazing: true };
  }

}

// The commonest colour in some pixels, as [r, g, b].
function commonest(d) {
  const counts = new Map();
  let best = 0;
  let bestKey = 0;
  for (let i = 0; i < d.length; i += 4) {
    if (!d[i + 3]) continue;
    const key = (d[i] << 16) | (d[i + 1] << 8) | d[i + 2];
    const n = (counts.get(key) ?? 0) + 1;
    counts.set(key, n);
    if (n > best) { best = n; bestKey = key; }
  }
  return [(bestKey >> 16) & 255, (bestKey >> 8) & 255, bestKey & 255];
}

// A ground bird's picture, made once for each kind, pose and way it faces:
// the shape in its colours, with a dark outline round it. Its feet are at
// (BIRD_X, BIRD_Y) in the picture.
const BIRD_X = 6;
const BIRD_Y = 9;
const birdSprites = new Map();
function birdSprite(look, pecking, face) {
  const key = `${look.body}${look.breast}${pecking}${face}`;
  let sprite = birdSprites.get(key);
  if (sprite) return sprite;
  const legs = look.piper ? 2 : 1;
  // [colour, x, y, w, h] from the feet, facing right.
  const parts = [
    [look.legs, -1, -legs, 1, legs], [look.legs, 1, -legs, 1, legs],
    [look.body, -4, -legs - 4, 2, 1],
    [look.body, -3, -legs - 3, 5, 3],
    [look.breast, 0, -legs - 2, 2, 2],
    ...(pecking
      ? [[look.head, 2, -legs - 2, 2, 2], [look.beak, 4, -legs - 1, look.piper ? 2 : 1, 1]]
      : [[look.head, 1, -legs - 5, 3, 3], [look.beak, 4, -legs - 4, look.piper ? 2 : 1, 1], ['#14101a', 2, -legs - 4, 1, 1]]),
  ];
  sprite = document.createElement('canvas');
  sprite.width = 14;
  sprite.height = 11;
  const c = sprite.getContext('2d');
  const at = (x, w) => (face > 0 ? BIRD_X + x : BIRD_X - x - w + 1);
  // The outline: every part, a pixel out each way, in the dark first.
  c.fillStyle = '#1a1420';
  for (const [, x, y, w, h] of parts) {
    if (w === 1 && h <= 2 && y >= -2) continue;
    c.fillRect(at(x, w) - 1, BIRD_Y + y, w + 2, h);
    c.fillRect(at(x, w), BIRD_Y + y - 1, w, h + 2);
  }
  for (const [color, x, y, w, h] of parts) {
    c.fillStyle = color;
    c.fillRect(at(x, w), BIRD_Y + y, w, h);
  }
  birdSprites.set(key, sprite);
  return sprite;
}

export function makeLiveliness(scene) {
  if (scene.spire) return null;
  return new Liveliness(scene);
}
