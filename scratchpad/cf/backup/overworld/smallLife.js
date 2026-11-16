import { TILE_SIZE as T, SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';
import { TILES } from './tileset.js';
import { COAST_AREAS } from './coastTiles.js';
import { daylight } from './daylight.js';
import { glowSprite } from './lamplight.js';
import { groundUnder, skid } from './footfall.js';
import { ROOM_TOUCHES } from '../data/touches.js';
import { hash } from '../engine/noise.js';

// SMALL LIFE: more of the world noticing you, in every chapter, worked out
// from a room's tiles so no room has to ask for it. Liveliness (liveliness.js)
// makes one of these and passes on its update and draws.
//
//   - pulling up short from a run, or turning back on the spot, scuffs up
//     whatever's underfoot (dust, sand, grass, leaves, snow, a splash)
//   - a trodden trail: grass you walk through lies flat for a moment and
//     springs back, and leaf litter scuffs to the dark earth under it
//   - a blade or two of grass round your boots when you stand in it
//   - a mouse by a hole at the foot of a wall, indoors and underground; it
//     runs for the hole when you come near, peeps out, and comes back out
//   - a frog on the bank of a brook or fen pool; it plops in when you come
//     near, its eyes come up a while later, and it climbs back out
//   - fireflies at night in the woods, the fen and the fields, drifting off
//     when you walk into them
//   - leaves coming down off the scarlet trees, and lying a while where they
//     land (kicked up again if you run through them)
//   - standing still in the shallows or the bog, rings spread from your boots
//   - a chest you haven't opened glints now and then, and gives off a puff
//     and a few sparkles when you open it
//
// None of it has a body: nothing blocks you, a push, a cutscene walk or a
// monster. Everything is capped and kept in small fixed lists.

const seedOf = (text) => [...text].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 100003, 7);
const rand = (min, max) => min + Math.random() * (max - min);
const px = (ctx, color, x, y, w = 1, h = 1) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};
const airborne = (b) => Boolean(b.isAirborne || b.leaping);

// --- Tuning ---

// A skid: running at least this long first, and not twice in this long.
const SKID_AFTER_RUN = 0.22;
const SKID_GAP = 0.35;
// Trodden marks: one every this many pixels, this many at most, and how long each kind lasts.
const MARK_STRIDE = 6;
const MAX_MARKS = 48;
const MARK_SECONDS = { grass: 2.6, leaves: 11 };
// Mice and frogs: how near before they go (walking, running), and how long they stay hidden.
const MOUSE_SCARE = [34, 56];
const FROG_SCARE = [30, 50];
// Fireflies: how many at most, and how near you come before they drift off.
const FIREFLIES = 12;
const FIREFLY_SHY = 22;
// Falling leaves: at most this many at once (in the air and on the ground).
const MAX_LEAVES = 10;
// Standing in water: a ring every so often.
const WADE_RING = [1.1, 1.9];

// Ground a mouse runs along, and the wall faces it makes its hole in.
const MOUSE_FLOOR = new Set(['.', 'o', 'q', 'X', 'c', ':', 'j']);
const WALL_FACES = new Set(['W', 'h', 'K', 'a', '5', '1']);
// Water a frog jumps into, and the banks it sits on (away from the coast's salt water).
const FROG_WATER = new Set(['~', '$']);
const FROG_BANK = new Set([',', 'd', 'y', ';', ':', 'N']);
const FROG_AREAS = new Set(['pinefall', 'hushwood', 'hollin', 'marsh', 'valley', 'sunnyside']);
// Where fireflies come out at night.
const FIREFLY_AREAS = new Set(['pinefall', 'hushwood', 'hollin', 'marsh', 'valley', 'sunnyside', 'stair']);
const FIREFLY_GROUND = new Set([',', 'N', 'd', 'y', ';', '%', ':', '"']);
// The scarlet wood's leaves (the Hushwood's a little darker and older).
const LEAF_AREAS = new Set(['pinefall', 'hushwood', 'hollin']);
const LEAF_COLORS = {
  pinefall: ['#c8402e', '#e0702a', '#a82838', '#e8a03a'],
  hushwood: ['#8a2a24', '#a82838', '#6e2a22', '#c8402e'],
  hollin: ['#a82838', '#c8402e', '#8a5a2a', '#e0702a'],
};
const LEAF_TREES = new Set(['L']);
// Chests (and the like) worth a glint.
const CHESTS = /^(chest|c5_chest|old_pack)$/;

export class SmallLife {
  constructor(scene, life) {
    this.scene = scene;
    this.life = life;
    const data = scene.roomData;
    this.data = data;
    this.seed = seedOf(data.id ?? 'room');
    this.coast = COAST_AREAS.has(data.area);
    this.runs = new Map();
    this.wades = new Map();
    this.feet = new Map();
    this.marks = [];
    this.markTones = new Map();
    this.leaves = [];
    this.leafWait = 1;
    this.sparkles = [];
    this.mice = this.placeMice();
    this.frogs = this.placeFrogs();
    this.fireflies = this.placeFireflies();
    this.trees = this.findTrees();
    this.chests = this.room.allProps.filter((p) => CHESTS.test(p.look ?? '')).map((p) => ({ prop: p, full: Boolean(p.gives || p.gold), phase: hash(p.x * 0.37 + p.y * 0.11) * 9 }));
    this.things = [
      ...this.mice.map((m) => ({ get sortY() { return m.y; }, draw: (ctx) => this.drawMouse(ctx, m) })),
      ...this.frogs.map((f) => ({ get sortY() { return f.y; }, draw: (ctx) => this.drawFrog(ctx, f) })),
    ];
  }

  get room() {
    return this.scene.room;
  }

  // Tiles near a spot that a room's doors, start or props are using.
  busy(tx, ty, pad = 1) {
    const data = this.data;
    const start = data.playerStart ?? { x: -99, y: -99 };
    if (Math.abs(tx - start.x) + Math.abs(ty - start.y) < 4) return true;
    if ((data.doors ?? []).some((d) => tx >= d.x - pad && tx < d.x + (d.w ?? 1) + pad && ty >= d.y - pad && ty < d.y + (d.h ?? 1) + pad)) return true;
    return this.room.allProps.some((p) => {
      const px0 = Math.floor(p.x / T);
      const py0 = Math.floor(p.y / T);
      const w = Math.max(1, Math.round((p.width ?? T) / T));
      return tx >= px0 - pad && tx < px0 + w + pad && ty >= py0 - pad && ty <= py0 + pad;
    });
  }

  update(dt, bodies) {
    const s = this.scene;
    if (bodies.length) {
      this.updateSkids(dt);
      this.updateMarks(bodies);
      this.updateWading(dt, bodies);
    }
    this.updateMice(dt, bodies);
    this.updateFrogs(dt, bodies);
    this.updateFireflies(dt, bodies);
    this.updateLeaves(dt, bodies);
    this.updateChests(dt);
    // Old marks go.
    while (this.marks.length && s.time - this.marks[0].at > MARK_SECONDS[this.marks[0].kind]) this.marks.shift();
  }

  // --- Skids: stopping dead, or turning back, from a run. ---

  updateSkids(dt) {
    const s = this.scene;
    for (const b of [s.player, ...s.others]) {
      if (!b || b.hidden) continue;
      let run = this.runs.get(b);
      if (!run) this.runs.set(b, (run = { for: 0, facing: b.facing, gap: 0 }));
      run.gap = Math.max(0, run.gap - dt);
      const running = b.running && b.moving && !airborne(b) && !b.isSliding;
      const way = b.facing === 'left' ? -1 : b.facing === 'right' ? 1 : 0;
      const back = { left: 'right', right: 'left', up: 'down', down: 'up' }[run.facing] === b.facing;
      if (run.for >= SKID_AFTER_RUN && run.gap <= 0 && !airborne(b) && (!b.moving || (running && back))) {
        // Stopping: thrown on the way you were going. Turning: the way you were going too.
        const was = run.facing === 'left' ? -1 : run.facing === 'right' ? 1 : 0;
        const ground = groundUnder(this.room, b);
        if (ground) skid(s.particles, ground, b, b.moving ? was : was || way);
        run.gap = SKID_GAP;
        run.for = running ? 0.01 : 0;
      }
      run.for = running ? run.for + dt : 0;
      run.facing = b.facing;
    }
  }

  // --- Trodden grass and scuffed leaves. ---

  updateMarks(bodies) {
    const s = this.scene;
    for (const b of bodies) {
      if (airborne(b) || (b.ground ?? 0) > 0 || !(b.walking ?? b.moving)) {
        this.feet.delete(b);
        continue;
      }
      const tx = Math.floor(b.x / T);
      const ty = Math.floor((b.y - 1) / T);
      const tile = this.room.tileAt(tx, ty);
      const kind = tile === ',' && groundUnder(this.room, b) === 'grass' ? 'grass' : tile === 'd' || tile === 'y' ? 'leaves' : null;
      let last = this.feet.get(b);
      if (!last) {
        this.feet.set(b, (last = { x: b.x, y: b.y, since: 0, side: 1 }));
        continue;
      }
      const dx = b.x - last.x;
      const dy = b.y - last.y;
      last.since += Math.hypot(dx, dy);
      last.x = b.x;
      last.y = b.y;
      if (last.since < MARK_STRIDE || !kind) continue;
      last.since = 0;
      last.side = -last.side;
      const across = Math.abs(dx) >= Math.abs(dy);
      const tone = this.markTone(tx, ty, kind);
      if (!tone) continue;
      this.marks.push({ kind, x: Math.round(b.x + (across ? 0 : last.side * 2)), y: Math.round(b.y - 1 + (across ? (last.side > 0 ? 1 : 0) : 0)), across, way: Math.sign(dx) || 1, tone, at: s.time });
      if (this.marks.length > MAX_MARKS) this.marks.shift();
    }
  }

  // The colours of a mark on a tile: flattened blades catch the light (paler
  // than the grass), scuffed litter shows the earth (darker than the leaves).
  markTone(tx, ty, kind) {
    const key = `${tx},${ty},${kind}`;
    if (this.markTones.has(key)) return this.markTones.get(key);
    const pixels = this.life.tilePixels(tx, ty);
    let tone = null;
    if (pixels) {
      const [r, g, b] = commonest(pixels.data);
      const k = kind === 'grass' ? 1.22 : 0.52;
      const c = (v) => Math.max(0, Math.min(255, Math.round(v * k + (kind === 'grass' ? 10 : 0))));
      tone = `${c(r)}, ${c(g)}, ${c(b)}`;
      if (kind === 'grass') tone = { flat: tone, dark: `${Math.round(r * 0.72)}, ${Math.round(g * 0.72)}, ${Math.round(b * 0.72)}` };
    }
    this.markTones.set(key, tone);
    return tone;
  }

  drawMarks(ctx) {
    const cam = this.scene.camera;
    const t = this.scene.time;
    for (const m of this.marks) {
      const x = m.x - cam.x;
      const y = m.y - cam.y;
      if (x < -8 || x > W + 8 || y < -8 || y > H + 8) continue;
      const k = (t - m.at) / MARK_SECONDS[m.kind];
      if (m.kind === 'grass') {
        // Blades pressed flat the way you went, rising back as they fade.
        const a = 0.75 * (1 - k);
        ctx.fillStyle = `rgba(${m.tone.flat}, ${a.toFixed(3)})`;
        if (m.across) {
          ctx.fillRect(Math.round(x - 1 - m.way), Math.round(y - 1), 3, 1);
          ctx.fillRect(Math.round(x + m.way), Math.round(y), 2, 1);
        } else {
          ctx.fillRect(Math.round(x), Math.round(y - 2), 1, 3);
          ctx.fillRect(Math.round(x + 1), Math.round(y - 1), 1, 2);
        }
        ctx.fillStyle = `rgba(${m.tone.dark}, ${(a * 0.5).toFixed(3)})`;
        ctx.fillRect(Math.round(x - 1), Math.round(y + 1), 3, 1);
      } else {
        // Litter pushed aside: a little dark scuff, slowly covered over.
        const a = 0.5 * (1 - k * k);
        ctx.fillStyle = `rgba(${m.tone}, ${a.toFixed(3)})`;
        ctx.fillRect(Math.round(x - 1), Math.round(y - 1), 3, 2);
        ctx.fillRect(Math.round(x + (m.across ? -2 * m.way : 0)), Math.round(y - (m.across ? 0 : 2)), 1, 1);
      }
    }
  }

  // A blade or two of grass in front of someone's boots, standing in it
  // (called by Liveliness.drawAnkles). They lean out as you push through.
  drawTufts(ctx, b, x, feet) {
    const tx = Math.floor(b.x / T);
    const ty = Math.floor((b.y - 1) / T);
    const tone = this.markTone(tx, ty, 'grass');
    if (!tone) return;
    const going = b.walking ?? b.moving;
    const lean = going ? (Math.floor(this.scene.time * 7 + b.x * 0.1) % 2 ? 1 : 0) : 0;
    const blade = `rgb(${tone.dark})`;
    const tip = `rgb(${tone.flat})`;
    for (const side of [-1, 1]) {
      const bx = x + side * 4 - (side < 0 ? 1 : 0);
      ctx.fillStyle = blade;
      ctx.fillRect(bx, feet - 2, 1, 2);
      ctx.fillRect(bx + side * (1 + lean), feet - 3, 1, 1);
      ctx.fillStyle = tip;
      ctx.fillRect(bx - side, feet - 2, 1, 1);
    }
  }

  // --- Standing in the water: rings spreading from your boots. ---

  updateWading(dt, bodies) {
    const s = this.scene;
    for (const b of bodies) {
      const still = !(b.walking ?? b.moving) && !airborne(b);
      const ground = still ? groundUnder(this.room, b) : null;
      if (ground !== 'shallows' && ground !== 'bog') {
        this.wades.delete(b);
        continue;
      }
      let left = this.wades.get(b) ?? rand(0.3, 0.9);
      left -= dt;
      if (left <= 0) {
        left = rand(...WADE_RING);
        const color = ground === 'bog' ? '120, 110, 80' : '236, 252, 250';
        s.particles.push({ kind: 'ripple', color, x: b.x + rand(-1, 1), y: b.y - 1, vx: 0, vy: 0, life: 1.1, age: 0 });
      }
      this.wades.set(b, left);
    }
  }

  // --- Mice ---

  placeMice() {
    const s = this.scene;
    const data = this.data;
    if (s.underSky || data.dark || s.spire || data.weather || (this.coast && !data.indoors)) return [];
    if (hash(this.seed + 77) > 0.65) return [];
    const room = this.room;
    const spots = [];
    for (let ty = 2; ty < room.height - 1; ty++) {
      for (let tx = 2; tx < room.width - 2; tx++) {
        if (!MOUSE_FLOOR.has(room.tileAt(tx, ty)) || room.isSolidTile(tx, ty)) continue;
        if (![-1, 0, 1].every((dx) => WALL_FACES.has(room.tileAt(tx + dx, ty - 1)) && !room.isSolidTile(tx + dx, ty) && TILES[room.tileAt(tx + dx, ty)])) continue;
        if (this.busy(tx, ty, 1)) continue;
        spots.push([tx, ty]);
      }
    }
    if (!spots.length) return [];
    const [tx, ty] = spots[Math.floor(hash(this.seed + 78) * spots.length)];
    const hx = tx * T + 5 + Math.floor(hash(this.seed + 79) * 6);
    const y = ty * T + 3;
    const face = hash(this.seed + 80) < 0.5 ? -1 : 1;
    return [{ hx, hy: ty * T, x: hx + face * 7, y, home: hx + face * 7, face, mode: 'sit', t: 0, next: rand(1, 3), to: null }];
  }

  updateMice(dt, bodies) {
    for (const m of this.mice) {
      m.t += dt;
      const near = Math.min(Infinity, ...bodies.map((b) => Math.hypot(b.x - m.x, b.y - m.y) - (b.running ? MOUSE_SCARE[1] - MOUSE_SCARE[0] : 0)));
      if (m.mode === 'sit' || m.mode === 'trot') {
        if (near < MOUSE_SCARE[0]) {
          m.mode = 'dash';
          m.face = m.hx < m.x ? -1 : 1;
          continue;
        }
        if (m.mode === 'trot') {
          const step = 26 * dt;
          if (Math.abs(m.to - m.x) <= step) { m.x = m.to; m.mode = 'sit'; m.next = rand(1.2, 3.5); } else m.x += Math.sign(m.to - m.x) * step;
        } else if ((m.next -= dt) <= 0) {
          // Off a little way along the wall and back, or a turn about.
          if (Math.random() < 0.6) {
            m.to = Math.round(m.home + rand(-12, 12));
            m.face = m.to < m.x ? -1 : 1;
            m.mode = 'trot';
          } else {
            m.face = -m.face;
            m.next = rand(1, 3);
          }
        }
      } else if (m.mode === 'dash') {
        const step = 90 * dt;
        if (Math.abs(m.hx - m.x) <= step) { m.x = m.hx; m.mode = 'in'; m.t = 0; m.next = rand(6, 12); } else m.x += Math.sign(m.hx - m.x) * step;
      } else if (m.mode === 'in') {
        if (m.t > m.next && near > MOUSE_SCARE[1] + 10) { m.mode = 'peek'; m.t = 0; m.next = rand(1.4, 2.6); }
      } else if (m.mode === 'peek') {
        if (near < MOUSE_SCARE[0] + 8) { m.mode = 'in'; m.t = 0; m.next = rand(5, 9); } else if (m.t > m.next) {
          m.mode = 'trot';
          m.to = m.home;
          m.face = m.home < m.hx ? -1 : 1;
        }
      }
    }
  }

  // The hole at the foot of the wall (always there), on the floor layer.
  drawMouseHoles(ctx) {
    const cam = this.scene.camera;
    for (const m of this.mice) {
      const x = m.hx - cam.x;
      const y = m.hy - cam.y;
      if (x < -8 || x > W + 8 || y < -8 || y > H + 8) continue;
      px(ctx, 'rgba(8, 5, 12, 0.9)', x - 1, y - 4, 2, 1);
      px(ctx, 'rgba(8, 5, 12, 0.9)', x - 2, y - 3, 4, 3);
      px(ctx, 'rgba(255, 255, 255, 0.12)', x - 2, y - 5, 1, 1);
      px(ctx, 'rgba(255, 255, 255, 0.12)', x + 1, y - 5, 1, 1);
    }
  }

  // A little side-on mouse: grey-brown, a pink nose that twitches, a tail.
  drawMouse(ctx, m) {
    if (m.mode === 'in') return;
    const cam = this.scene.camera;
    const x = Math.round(m.x) - cam.x;
    const y = Math.round(m.y) - cam.y;
    if (x < -10 || x > W + 10 || y < -10 || y > H + 10) return;
    const f = m.face;
    const at = (lx, ly, color, w = 1) => px(ctx, color, f > 0 ? x + lx : x - lx - w + 1, y + ly, w, 1);
    if (m.mode === 'peek') {
      // Just the nose and an eye at the hole.
      at(-1, -2, '#6e6264', 2);
      at(1, -2, '#120c1c');
      at(1, -1, '#6e6264');
      if (Math.floor(m.t * 9) % 2) at(2, -1, '#e0a0a8');
      return;
    }
    const running = m.mode === 'dash' || m.mode === 'trot';
    const hop = running && Math.floor(m.t * (m.mode === 'dash' ? 24 : 14)) % 2 ? 1 : 0;
    px(ctx, 'rgba(0, 0, 0, 0.22)', x - 3, y, 6, 1);
    const yy = -hop;
    at(-2, -3 + yy, '#8a7476');
    at(-2, -2 + yy, '#6e6264', 4);
    at(-3, -1 + yy, '#6e6264', 5);
    at(-2, -1 + yy, '#9a8a8a', 3);
    at(1, -2 + yy, '#120c1c');
    at(2, -1 + yy, Math.floor(m.t * 7) % 2 && !running ? '#e0a0a8' : '#6e6264');
    // The tail: curled up sitting, out straight running.
    if (running) at(-6, -1 + yy, '#9a8486', 3);
    else { at(-4, -1, '#9a8486'); at(-5, -2, '#9a8486'); }
    // Feet.
    at(-2, 0 + yy, '#3a3034');
    at(1, 0 + yy, '#3a3034');
  }

  // --- Frogs ---

  placeFrogs() {
    const s = this.scene;
    const data = this.data;
    if (!FROG_AREAS.has(data.area) || data.indoors || data.dark || s.cold || this.coast) return [];
    if (hash(this.seed + 91) > 0.7) return [];
    const room = this.room;
    const spots = [];
    for (let ty = 1; ty < room.height - 1; ty++) {
      for (let tx = 1; tx < room.width - 1; tx++) {
        if (!FROG_BANK.has(room.tileAt(tx, ty)) || room.isSolidTile(tx, ty) || this.busy(tx, ty, 1)) continue;
        for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
          if (FROG_WATER.has(room.tileAt(tx + dx, ty + dy)) && room.isSolidTile(tx + dx, ty + dy)) spots.push({ tx, ty, dx, dy });
        }
      }
    }
    if (!spots.length) return [];
    const frogs = [];
    const count = 1 + (hash(this.seed + 92) < 0.4 ? 1 : 0);
    for (let i = 0; i < count && spots.length; i++) {
      const at = Math.floor(hash(this.seed + 93 + i * 7) * spots.length);
      const { tx, ty, dx, dy } = spots[at];
      // (Never two on the same bit of bank.)
      for (let j = spots.length - 1; j >= 0; j--) if (Math.abs(spots[j].tx - tx) + Math.abs(spots[j].ty - ty) < 4) spots.splice(j, 1);
      const bx = tx * T + 8 + dx * 4;
      const by = ty * T + 11 + dy * 3;
      const wx = (tx + dx) * T + 8 + dx * 2;
      const wy = (ty + dy) * T + 9 + dy * 2;
      frogs.push({ bx, by, wx, wy, wtx: tx + dx, wty: ty + dy, x: bx, y: by, alt: 0, face: dx < 0 ? -1 : dx > 0 ? 1 : (hash(this.seed + i) < 0.5 ? -1 : 1), mode: 'sit', t: hash(this.seed + 94 + i) * 3, next: 0, ringIn: 0 });
    }
    return frogs;
  }

  updateFrogs(dt, bodies) {
    const s = this.scene;
    for (const f of this.frogs) {
      f.t += dt;
      const nearBank = Math.min(Infinity, ...bodies.map((b) => Math.hypot(b.x - f.bx, b.y - f.by) - (b.running ? FROG_SCARE[1] - FROG_SCARE[0] : 0)));
      const nearWater = Math.min(Infinity, ...bodies.map((b) => Math.hypot(b.x - f.wx, b.y - f.wy)));
      if (f.mode === 'sit') {
        if (nearBank < FROG_SCARE[0]) {
          // Still water to jump into (not a log sunk into it since)?
          if (!this.room.isSolidTile(f.wtx, f.wty)) { f.mode = 'gone'; continue; }
          f.mode = 'jump';
          f.t = 0;
          f.from = [f.bx, f.by];
          f.to = [f.wx, f.wy];
        }
      } else if (f.mode === 'jump' || f.mode === 'climb') {
        const k = Math.min(1, f.t / 0.42);
        f.x = f.from[0] + (f.to[0] - f.from[0]) * k;
        f.y = f.from[1] + (f.to[1] - f.from[1]) * k;
        f.alt = Math.sin(k * Math.PI) * (f.mode === 'jump' ? 9 : 6);
        if (f.to[0] !== f.from[0]) f.face = f.to[0] < f.from[0] ? -1 : 1;
        if (k >= 1) {
          f.alt = 0;
          if (f.mode === 'jump') {
            // Plop: a ring or two, and a few drops.
            s.particles.push({ kind: 'ripple', color: '210, 230, 220', x: f.wx, y: f.wy, vx: 0, vy: 0, life: 0.9, age: 0 });
            s.particles.push({ kind: 'ripple', color: '210, 230, 220', x: f.wx, y: f.wy, vx: 0, vy: 0, life: 1.4, age: -0.25 });
            for (let i = 0; i < 3; i++) s.particles.push({ kind: 'drop', x: f.wx + rand(-2, 2), y: f.wy - 1, vx: rand(-14, 14), vy: -rand(20, 32), life: 0.45, age: 0, floor: f.wy });
            f.mode = 'under';
            f.t = 0;
            f.next = rand(6, 11);
          } else {
            f.mode = 'sit';
            f.t = 0;
          }
        }
      } else if (f.mode === 'under') {
        if (f.t > f.next && nearWater > FROG_SCARE[1]) { f.mode = 'peek'; f.t = 0; f.next = rand(3, 6); f.ringIn = 0; }
      } else if (f.mode === 'peek') {
        f.ringIn -= dt;
        if (f.ringIn <= 0) {
          f.ringIn = 1.6;
          s.particles.push({ kind: 'ripple', color: '200, 220, 210', x: f.wx, y: f.wy, vx: 0, vy: 0, life: 1, age: 0 });
        }
        if (nearWater < FROG_SCARE[0] - 4) {
          s.particles.push({ kind: 'ripple', color: '210, 230, 220', x: f.wx, y: f.wy, vx: 0, vy: 0, life: 0.8, age: 0 });
          f.mode = 'under';
          f.t = 0;
          f.next = rand(5, 9);
        } else if (f.t > f.next && nearBank > FROG_SCARE[1] + 6) {
          f.mode = 'climb';
          f.t = 0;
          f.from = [f.wx, f.wy];
          f.to = [f.bx, f.by];
        }
      }
    }
  }

  // A little frog, side-on, its throat going; mid-jump, legs out behind.
  drawFrog(ctx, f) {
    if (f.mode === 'under' || f.mode === 'gone') return;
    const cam = this.scene.camera;
    const x = Math.round(f.x) - cam.x;
    const y = Math.round(f.y) - cam.y;
    if (x < -10 || x > W + 10 || y < -14 || y > H + 10) return;
    const fen = this.data.area === 'marsh' || this.data.area === 'hushwood';
    const body = fen ? '#4e6a34' : '#4f7d34';
    const back = fen ? '#3a5026' : '#3b5e26';
    const belly = fen ? '#a8b468' : '#b8c870';
    if (f.mode === 'peek') {
      // Just its eyes above the water.
      px(ctx, back, x - 2, y - 1, 1, 1);
      px(ctx, back, x + 1, y - 1, 1, 1);
      px(ctx, '#0e140a', x - 2, y - 2, 1, 1);
      px(ctx, '#0e140a', x + 1, y - 2, 1, 1);
      return;
    }
    const v = f.face;
    const at = (lx, ly, color, w = 1) => px(ctx, color, v > 0 ? x + lx : x - lx - w + 1, y + ly - Math.round(f.alt), w, 1);
    px(ctx, `rgba(0, 0, 0, ${(0.24 - f.alt * 0.015).toFixed(3)})`, x - 3, y, 6, 1);
    if (f.mode === 'jump' || f.mode === 'climb') {
      at(-1, -3, back, 3);
      at(-2, -2, body, 5);
      at(1, -3, '#0e140a');
      at(-4, -1, body, 2);
      at(-6, 0, body, 2);
      return;
    }
    const swell = Math.floor(f.t * 2.2) % 3 === 0 ? 1 : 0;
    at(1, -4, back);
    at(-2, -3, back, 3);
    at(1, -3, '#0e140a');
    at(2, -3, back);
    at(-3, -2, body, 6);
    at(-3, -1, back, 2);
    at(0, -1, belly, 2 + swell);
    at(-3, 0, body, 2);
    at(1, 0, body, 2);
  }

  // --- Fireflies ---

  placeFireflies() {
    const s = this.scene;
    const data = this.data;
    if (!s.underSky || s.cold || data.weather || this.coast || s.spire) return [];
    if (!FIREFLY_AREAS.has(data.area) && !data.leafy) return [];
    if ((ROOM_TOUCHES[data.id] ?? []).some((k) => k.kind === 'fireflies')) return [];
    const room = this.room;
    const spots = [];
    for (let ty = 1; ty < room.height - 1; ty++) {
      for (let tx = 1; tx < room.width - 1; tx++) {
        if (FIREFLY_GROUND.has(room.tileAt(tx, ty)) && hash(tx * 7.1 + ty * 13.7 + this.seed) < 0.12) spots.push([tx, ty]);
      }
    }
    // Spread through the room, a dozen at most.
    const step = Math.max(1, spots.length / FIREFLIES);
    const list = [];
    for (let i = 0; i < spots.length && list.length < FIREFLIES; i += step) {
      const [tx, ty] = spots[Math.floor(i)];
      list.push({ hx: tx * T + 8, hy: ty * T + 4, ox: 0, oy: 0, h: hash(tx * 3.3 + ty * 1.7) });
    }
    return list;
  }

  // How much the fireflies show: only once it's properly dark.
  get fireflyAmount() {
    if (!this.fireflies.length) return 0;
    return Math.max(0, Math.min(1, (daylight().night - 0.3) / 0.45));
  }

  updateFireflies(dt, bodies) {
    if (this.fireflyAmount <= 0) return;
    const t = this.scene.time;
    for (const f of this.fireflies) {
      const [x, y] = this.fireflyAt(f, t);
      // Drifting off from whoever walks into them, and back again slowly.
      let pushX = 0;
      let pushY = 0;
      for (const b of bodies) {
        const dx = x - b.x;
        const dy = y - (b.y - 10);
        const d = Math.hypot(dx, dy);
        if (d < FIREFLY_SHY && d > 0.01) {
          pushX += (dx / d) * (FIREFLY_SHY - d);
          pushY += (dy / d) * (FIREFLY_SHY - d);
        }
      }
      const k = Math.min(1, dt * (pushX || pushY ? 3 : 0.4));
      f.ox += (pushX * 1.2 - (pushX || pushY ? 0 : f.ox)) * k;
      f.oy += (pushY * 1.2 - (pushX || pushY ? 0 : f.oy)) * k;
      f.ox = Math.max(-30, Math.min(30, f.ox));
      f.oy = Math.max(-30, Math.min(30, f.oy));
    }
  }

  fireflyAt(f, t) {
    const a = t * (0.35 + f.h * 0.3) + f.h * 40;
    return [f.hx + Math.sin(a) * 18 + Math.sin(a * 2.3) * 5 + f.ox, f.hy + Math.cos(a * 0.8) * 9 + Math.sin(a * 3.1) * 3 + f.oy - 6];
  }

  drawFireflies(ctx) {
    const amount = this.fireflyAmount;
    if (amount <= 0) return;
    const cam = this.scene.camera;
    const t = this.scene.time;
    const color = '214, 255, 130';
    const sprite = glowSprite(color);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const f of this.fireflies) {
      const [wx, wy] = this.fireflyAt(f, t);
      const x = Math.round(wx - cam.x);
      const y = Math.round(wy - cam.y);
      if (x < -8 || x > W + 8 || y < -8 || y > H + 8) continue;
      // Each glows and goes dark on its own slow time.
      const glow = Math.max(0, Math.sin(t * (0.9 + f.h * 0.8) + f.h * 30));
      if (glow < 0.08) continue;
      ctx.globalAlpha = 0.5 * glow * amount;
      ctx.drawImage(sprite, x - 7, y - 7, 14, 14);
      ctx.globalAlpha = Math.min(1, glow * 1.2 * amount);
      ctx.fillStyle = `rgb(${color})`;
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.restore();
  }

  // --- Falling leaves ---

  findTrees() {
    const data = this.data;
    if (data.indoors || data.dark || this.scene.spire) return [];
    if (!LEAF_AREAS.has(data.area) && !data.leafy) return [];
    const list = [];
    this.room.tiles.forEach((row, ty) => {
      for (let tx = 0; tx < row.length; tx++) if (LEAF_TREES.has(row[tx]) && hash(tx * 5.3 + ty * 9.1) < 0.5) list.push([tx, ty]);
    });
    return list;
  }

  updateLeaves(dt, bodies) {
    if (!this.trees.length) return;
    const cam = this.scene.camera;
    // Now and then a new one comes off a tree on the screen.
    this.leafWait -= dt;
    if (this.leafWait <= 0 && this.leaves.length < MAX_LEAVES) {
      this.leafWait = rand(0.6, 1.5);
      for (let tries = 0; tries < 4; tries++) {
        const [tx, ty] = this.trees[Math.floor(Math.random() * this.trees.length)];
        const x = tx * T + 8 + rand(-10, 10);
        const top = ty * T + T - 44 + rand(4, 22);
        if (x < cam.x - 10 || x > cam.x + W + 10 || top < cam.y - 30 || top > cam.y + H) continue;
        const colors = LEAF_COLORS[this.data.area] ?? LEAF_COLORS.pinefall;
        this.leaves.push({ x, y: top, floor: ty * T + T + rand(2, 26), vy: rand(9, 14), sway: rand(4, 7), phase: rand(0, 6), age: 0, down: null, color: colors[Math.floor(Math.random() * colors.length)] });
        break;
      }
    }
    for (let i = this.leaves.length - 1; i >= 0; i--) {
      const leaf = this.leaves[i];
      leaf.age += dt;
      if (leaf.down === null) {
        leaf.y += leaf.vy * dt;
        leaf.x += (Math.sin(leaf.age * 2.2 + leaf.phase) * leaf.sway * 2.2 + 3) * dt;
        if (leaf.y >= leaf.floor) {
          leaf.y = leaf.floor;
          leaf.down = 0;
          // Landed on a tree or in water: gone quickly.
          const tile = this.room.tileAt(Math.floor(leaf.x / T), Math.floor(leaf.y / T));
          leaf.stay = !tile || this.room.isSolidTile(Math.floor(leaf.x / T), Math.floor(leaf.y / T)) ? 0.4 : rand(4, 7);
        }
      } else {
        leaf.down += dt;
        // Run through it and it's kicked up again.
        if (bodies.some((b) => b.running && Math.abs(b.x - leaf.x) < 5 && Math.abs(b.y - leaf.y) < 4)) {
          this.scene.particles.push({ kind: 'bit', color: leaf.color, x: leaf.x, y: leaf.y - 1, vx: rand(-16, 16), vy: -rand(26, 40), life: rand(0.9, 1.2), age: 0, flutter: true, phase: rand(0, 6) });
          this.leaves.splice(i, 1);
          continue;
        }
      }
      if (leaf.down !== null && leaf.down > leaf.stay + 1.5) this.leaves.splice(i, 1);
      else if (leaf.age > 30) this.leaves.splice(i, 1);
    }
  }

  // In the air (over everyone) or lying on the ground (under them).
  drawLeaves(ctx, lying) {
    if (!this.leaves.length) return;
    const cam = this.scene.camera;
    for (const leaf of this.leaves) {
      if ((leaf.down !== null) !== lying) continue;
      const x = Math.round(leaf.x - cam.x);
      const y = Math.round(leaf.y - cam.y);
      if (x < -4 || x > W + 4 || y < -4 || y > H + 4) continue;
      ctx.globalAlpha = lying ? Math.max(0, Math.min(1, 1 - (leaf.down - leaf.stay) / 1.5)) : Math.min(1, leaf.age * 3);
      ctx.fillStyle = leaf.color;
      // Turning over as it falls: wide, then edge-on.
      const wide = lying || Math.sin(leaf.age * 6 + leaf.phase) > -0.2;
      ctx.fillRect(x, y, wide ? 2 : 1, 1);
      if (lying) ctx.fillRect(x + 1, y - 1, 1, 1);
    }
    ctx.globalAlpha = 1;
  }

  // --- Chests: a glint till they're opened, and a puff when they are. ---

  updateChests(dt) {
    const s = this.scene;
    for (const c of this.chests) {
      const full = Boolean(c.prop.gives || c.prop.gold);
      if (c.full && !full) {
        const p = c.prop;
        const cx = p.x + p.width / 2;
        const top = p.y + T - (p.raise ?? 0) - (p.sprite?.height ?? T);
        for (let i = 0; i < 7; i++) this.sparkles.push({ x: cx + rand(-5, 5), y: top + rand(2, 6), vy: -rand(10, 22), vx: rand(-6, 6), age: 0, life: rand(0.6, 1.1) });
        for (let i = 0; i < 2; i++) s.particles.push({ kind: 'dust', color: '200, 184, 156', x: cx + (i ? 4 : -4), y: p.y + T - 1, vx: (i ? 1 : -1) * rand(8, 14), vy: -rand(2, 5), life: 0.5, age: 0, r: 1.5 });
      }
      c.full = full;
    }
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const sp = this.sparkles[i];
      sp.age += dt;
      sp.x += sp.vx * dt;
      sp.y += sp.vy * dt;
      sp.vy *= 1 - dt * 1.5;
      if (sp.age > sp.life) this.sparkles.splice(i, 1);
    }
  }

  drawChests(ctx) {
    const s = this.scene;
    const cam = s.camera;
    const t = s.time;
    for (const c of this.chests) {
      const p = c.prop;
      if (!c.full || p.hidden || !s.room.props.includes(p) || !s.inLight(p)) continue;
      const period = 3.4 + (c.phase % 1.5);
      const local = (t + c.phase) % period;
      if (local > 0.5) continue;
      const k = Math.sin((local / 0.5) * Math.PI);
      const w = p.sprite?.width ?? T;
      const h = p.sprite?.height ?? T;
      const left = p.x + Math.floor((p.width - w) / 2);
      const top = p.y + T - (p.raise ?? 0) - h;
      // A different corner of the lid each time.
      const n = Math.floor((t + c.phase) / period);
      const x = Math.round(left + 2 + hash(n * 3.7 + c.phase) * (w - 4) - cam.x);
      const y = Math.round(top + 1 + hash(n * 5.1 + c.phase) * Math.max(1, h * 0.35) - cam.y);
      ctx.fillStyle = `rgba(255, 250, 220, ${(0.95 * k).toFixed(3)})`;
      ctx.fillRect(x, y, 1, 1);
      if (k > 0.45) {
        ctx.fillStyle = `rgba(255, 236, 170, ${(0.7 * k).toFixed(3)})`;
        ctx.fillRect(x - 1, y, 1, 1);
        ctx.fillRect(x + 1, y, 1, 1);
        ctx.fillRect(x, y - 1, 1, 1);
        ctx.fillRect(x, y + 1, 1, 1);
      }
    }
    for (const sp of this.sparkles) {
      const k = sp.age / sp.life;
      const on = Math.floor(sp.age * 14 + sp.x) % 3 !== 0;
      if (!on) continue;
      ctx.fillStyle = `rgba(255, 240, 170, ${(1 - k).toFixed(3)})`;
      ctx.fillRect(Math.round(sp.x - cam.x), Math.round(sp.y - cam.y), 1, 1);
    }
  }

  // --- Drawing, called from Liveliness ---

  drawFloor(ctx) {
    this.drawMouseHoles(ctx);
    this.drawMarks(ctx);
    this.drawLeaves(ctx, true);
  }

  drawOver(ctx) {
    this.drawLeaves(ctx, false);
    this.drawChests(ctx);
  }

  drawTop(ctx) {
    this.drawFireflies(ctx);
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
