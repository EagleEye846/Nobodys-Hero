import { TILE_SIZE as T, SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';
import { glowSprite, roomLights, isRelit } from './lamplight.js';
import { music } from '../audio/music.js';
import { drawLastLightNear, drawLastLightNearVeil, drawLastLightNearOver, drawLastLightNearSlit } from './lastLightNear.js';

// ATMOSPHERE: the small, living details of Chapter 4's places. Dust catching a
// beam, crystals winking, embers off the town's lamps, grit trickling down a
// mine wall, rings on the lake, glow-worm specks in the Deep, dandelion seeds
// and butterflies in the sun. None of it touches how a room plays: it's all
// drawn over the picture, faint, and worked out from the time alone, so there
// is nothing to update and nothing made fresh each frame (the same way
// weather.js draws snow).
//
// Every region has its own set (AREA_LAYERS below). A room can change it with
// an `atmosphere` field:
//
//   atmosphere: false                       none at all
//   atmosphere: { haze: 1, motes: 0 }       turn a layer on (how much, 0 to 2)
//                                           or off (0)
//
// The layers: motes (dust drifting in the air), beamDust (dust and glints
// where a light beam passes), twinkle (crystals pulse and wink), flicker
// (lamps waver), embers (sparks and a moth or two round the lamps), windows
// (far-off lit windows in the rock), grit (falling grit), shimmer (glints on
// water), rings (ripples on water), haze (slow mist over water), glowworms
// (specks on the walls), seeds (dandelion seeds), butterflies.
//
// Chapter 5's coast adds: gulls (gulls wheeling over the beach), rain
// (slanting rain; 1 is steady, 1.5 a downpour), lightning (a soft flash now
// and then, never more than every 8 seconds or so), fog (sea fog drifting),
// spray (white spray thrown up where waves hit the shore), foam (a white line
// that comes and goes along the water's edge) and drips (water falling in a
// cave). Rain, lightning, fog, spray and gulls are left out of any room that
// says `indoors: true`, so a lighthouse kitchen or an inn stays dry.
//
// A room can also be left WRECKED for a scene (`wreck`, drawn while that
// scene plays): cracks, fallen stones and crystal bits on the floor, and dust
// settling slowly.
//
//   wreck: { during: 'tuck_afterwards', piles: [[4, 9], ...], clear: { x, y, w, h } }
//
// `clear` is a box of tiles kept free of stones (where someone walks).

const AREA_LAYERS = {
  sunnyside: { seeds: 1, butterflies: 1, shimmer: 0.6 },
  glimmer: { motes: 1, twinkle: 1, beamDust: 1 },
  belowtown: { flicker: 1, embers: 1, windows: 1, shimmer: 0.5, beamDust: 1 },
  diggings: { grit: 1, beamDust: 1 },
  stillwater: { shimmer: 1, rings: 1, haze: 1, beamDust: 1 },
  deep: { glowworms: 1, beamDust: 1 },
  // Chapter 5. The storm gets heavier area by area.
  gullrest: { gulls: 1, shimmer: 1, foam: 1, spray: 0.5, motes: 0 },
  wrack: { rain: 0.6, lightning: 0.4, foam: 0.9, spray: 0.4 },
  saltcombe: { rain: 0.7, lightning: 0.4, foam: 0.6, flicker: 0.8 },
  lanes: { rain: 0.8, lightning: 0.5, foam: 0.6, fog: 0.4 },
  wreck: { rain: 0.9, lightning: 0.6, foam: 0.6, fog: 1, spray: 0.4 },
  merrow: { rain: 0.9, lightning: 0.5, foam: 0.6, fog: 0.6 },
  soundings: { drips: 1, foam: 0.5, rings: 0.6, haze: 0.5 },
  isles: { rain: 1, lightning: 0.7, foam: 1, spray: 1 },
  haddock_light: { rain: 0.9, lightning: 0.5, foam: 0.7, spray: 0.5, flicker: 0.6 },
  reach: { rain: 1.3, lightning: 0.9, foam: 1.2, spray: 1.2, fog: 0.7 },
  lastlight: { rain: 1.5, lightning: 1, foam: 0.9, spray: 0.9, fog: 0.3 },
};

// Layers that only make sense under the open sky.
const OUTSIDE_ONLY = ['rain', 'lightning', 'fog', 'spray', 'gulls'];

// The tiles that are crystal, in the Glimmering and the Deep.
const CRYSTAL_TILES = new Set([...'OxIJ^vZRVp']);

const fract = (x) => x - Math.floor(x);
const hash = (n) => fract(Math.sin(n * 91.7 + 17.3) * 43758.5453);
const hash2 = (x, y, k = 0) => hash(x * 12.9898 + y * 78.233 + k * 37.719);
const wrap = (v, span) => ((v % span) + span) % span;

export function makeAtmosphere(scene) {
  const data = scene.roomData;
  if (scene.spire || data.atmosphere === false) return null;
  const layers = {};
  // Once the town's relit, gold dust drifts in the light and the lamps' embers calm down.
  const relit = data.area === 'belowtown' && isRelit(data) ? { motes: 1.1, embers: 0.5 } : {};
  for (const [name, amount] of Object.entries({ ...AREA_LAYERS[data.area], ...relit, ...(data.atmosphere ?? {}) })) if (amount > 0) layers[name] = amount;
  if (data.indoors) for (const name of OUTSIDE_ONLY) delete layers[name];
  if (!Object.keys(layers).length && !data.wreck) return null;
  return new Atmosphere(scene, layers);
}

export class Atmosphere {
  constructor(scene, layers) {
    this.scene = scene;
    this.layers = layers;
    const { room } = scene;
    const rows = room.tiles;
    const at = (tx, ty) => (rows[ty]?.[tx] ?? null);
    const solid = (tx, ty) => at(tx, ty) === null || room.isSolidTile(tx, ty);

    // Lights that are small flames or crystals: where the sparkle goes.
    this.lights = layers.twinkle || layers.flicker || layers.embers
      ? roomLights(room, false).filter((l) => l.bloom && !l.sky)
      : [];
    this.lamps = this.lights.filter((l) => l.color?.startsWith('255'));

    this.water = [];
    this.grit = [];
    this.worms = [];
    this.windows = [];
    this.grass = [];
    this.foam = [];
    this.drips = [];
    // Each room's storm has its own timing.
    this.seed = [...(scene.roomData.id ?? 'room')].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 9973, 7) / 9973;
    rows.forEach((row, ty) => {
      for (let tx = 0; tx < row.length; tx++) {
        const ch = row[tx];
        if (ch === '~') this.water.push({ x: tx * T, y: ty * T, h: hash2(tx, ty) });
        if (layers.grit) {
          if (ch === 'v') this.grit.push({ x: tx * T + 4 + hash2(tx, ty, 1) * 8, y: ty * T + 8, h: hash2(tx, ty, 2) });
          else if (ch === 'W' && at(tx, ty - 1) === '#' && hash2(tx, ty, 3) < 0.22) this.grit.push({ x: tx * T + 3 + hash2(tx, ty, 1) * 10, y: ty * T + 2, h: hash2(tx, ty, 2) });
        }
        if (layers.glowworms) {
          if (ch === 'v') for (let k = 0; k < 2; k++) this.worms.push({ x: tx * T + 2 + hash2(tx, ty, 4 + k) * 12, y: ty * T + 1 + hash2(tx, ty, 6 + k) * 9, h: hash2(tx, ty, 8 + k) });
          else if (ch === 'W' && hash2(tx, ty, 10) < 0.45) this.worms.push({ x: tx * T + 1 + hash2(tx, ty, 11) * 14, y: ty * T + 2 + hash2(tx, ty, 12) * 10, h: hash2(tx, ty, 13) });
          else if (ch === '#' && hash2(tx, ty, 14) < 0.3 && [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => !solid(tx + dx, ty + dy))) this.worms.push({ x: tx * T + 1 + hash2(tx, ty, 15) * 14, y: ty * T + 1 + hash2(tx, ty, 16) * 14, h: hash2(tx, ty, 17) });
        }
        // Far-off windows: rock with rock all round it.
        if (layers.windows && ch === '#' && hash2(tx, ty, 20) < 0.16 && [[0, 1], [0, -1], [1, 0], [-1, 0]].every(([dx, dy]) => at(tx + dx, ty + dy) === '#')) {
          this.windows.push({ x: tx * T + 3 + Math.floor(hash2(tx, ty, 21) * 8), y: ty * T + 4 + Math.floor(hash2(tx, ty, 22) * 6), h: hash2(tx, ty, 23) });
        }
        // Where water meets land (for the coast's foam and spray): which sides have ground.
        if (ch === '~' && (layers.foam || layers.spray)) {
          const sides = [['n', 0, -1], ['s', 0, 1], ['w', -1, 0], ['e', 1, 0]].filter(([, dx, dy]) => {
            const c = at(tx + dx, ty + dy);
            return c !== null && c !== '~' && c !== '0' && c !== undefined && !'#WKkhM'.includes(c);
          }).map(([k]) => k);
          if (sides.length) this.foam.push({ x: tx * T, y: ty * T, sides, h: hash2(tx, ty, 50) });
        }
        if (layers.drips && (ch === 'v' || (ch === 'W' && at(tx, ty - 1) === '#' && hash2(tx, ty, 60) < 0.18))) this.drips.push({ x: tx * T + 4 + hash2(tx, ty, 61) * 8, y: ty * T + 10, h: hash2(tx, ty, 62) });
        if (layers.butterflies && (ch === ',' || ch === 'N' || ch === '.' || ch === ':') && hash2(tx, ty, 30) < 0.04) this.grass.push({ x: tx * T + 8, y: ty * T + 8, h: hash2(tx, ty, 31) });
      }
    });
    this.worms = thin(this.worms, 90);
    this.grit = thin(this.grit, 14);
    this.windows = thin(this.windows, 14);
    this.foam = thin(this.foam, 160);
    this.splash = thin(this.foam, layers.spray ? 22 : 0);
    this.drips = thin(this.drips, 16);
    this.grass = thin(this.grass, 6);
    this.water = this.water.length ? this.water : [];
    this.wreckCanvas = null;
    this.skyline = layers.rain && !scene.roomData.indoors ? buildSkyline(rows, scene.roomData, scene.roomData.tide?.low) : null;
    this.flashK = 0;
    this.flashN = -1;
  }

  get camera() {
    return this.scene.camera;
  }

  // Whether the room is wrecked right now (a scene is playing that wants it).
  get wrecked() {
    const wreck = this.scene.roomData.wreck;
    return Boolean(wreck) && this.scene.cutscene?.scene?.id === wreck.during;
  }

  // --- On the floor, under everyone ---

  drawFloor(ctx) {
    // The Last Light up close (`lastLightNear`, lastLightNear.js): under everyone standing in front of it.
    const near = this.scene.roomData.lastLightNear;
    if (near) drawLastLightNear(ctx, near, this.camera, this.scene.time);
    if (!this.wrecked) return;
    this.wreckCanvas ??= paintWreck(this.scene.room, this.scene.roomData.wreck);
    ctx.drawImage(this.wreckCanvas, -this.camera.x, -this.camera.y);
  }

  // --- Over the room, before the light and the dark go on ---

  drawUnder(ctx) {
    const { layers } = this;
    const t = this.scene.time;
    ctx.save();
    if (layers.grit) this.drawGrit(ctx, t, layers.grit);
    if (layers.foam) this.drawFoam(ctx, t, layers.foam);
    if (layers.drips) this.drawDrips(ctx, t, layers.drips);
    if (layers.windows) this.drawWindows(ctx, t, layers.windows);
    if (layers.seeds) this.drawSeeds(ctx, t, layers.seeds);
    if (layers.butterflies) this.drawButterflies(ctx, t, layers.butterflies);
    ctx.restore();
  }

  // --- Over everything in the room: the glints, glows and little lights ---

  drawOver(ctx) {
    const { layers } = this;
    const t = this.scene.time;
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    if (layers.haze) this.drawHaze(ctx, t, layers.haze);
    if (this.skyline) this.drawSkyline(ctx, t);
    if (layers.fog) this.drawSeaFog(ctx, t, layers.fog);
    if (this.scene.roomData.lastLightNear) drawLastLightNearVeil(ctx, this.scene.roomData.lastLightNear, this.camera);
    if (layers.spray) this.drawSpray(ctx, t, layers.spray);
    if (layers.gulls) this.drawGulls(ctx, t, layers.gulls);
    if (layers.rain) this.drawRain(ctx, t, layers.rain);
    if (layers.lightning) this.drawLightning(ctx, t, layers.lightning);
    if (this.scene.roomData.lastLightNear) drawLastLightNearOver(ctx, this.scene.roomData.lastLightNear, this.camera, t, this.flashK ?? 0);
    if (layers.motes) this.drawMotes(ctx, t, layers.motes);
    ctx.globalCompositeOperation = 'lighter';
    if (layers.twinkle) this.drawTwinkle(ctx, t, layers.twinkle);
    if (layers.flicker) this.drawFlicker(ctx, t, layers.flicker);
    if (layers.shimmer) this.drawShimmer(ctx, t, layers.shimmer);
    if (layers.rings) this.drawRings(ctx, t, layers.rings);
    if (layers.embers) this.drawEmbers(ctx, t, layers.embers);
    if (layers.beamDust && this.scene.beams?.active) this.drawBeamDust(ctx, t, layers.beamDust);
    ctx.globalCompositeOperation = 'source-over';
    if (layers.glowworms) this.drawWorms(ctx, t, layers.glowworms);
    if (this.wrecked) this.drawSettling(ctx, t);
    ctx.restore();
  }

  // --- On top of everything, a scene's wash too: the near Last Light's slit ---

  drawTop(ctx) {
    const near = this.scene.roomData.lastLightNear;
    if (near) drawLastLightNearSlit(ctx, near, this.camera, this.scene.time, this.flashK ?? 0);
  }

  // --- The coast (Chapter 5) ---

  // A white line along the water's edge that creeps in and slips back.
  drawFoam(ctx, t, amount) {
    const { x: cx, y: cy } = this.camera;
    const area = this.scene.roomData.area;
    const white = area === 'gullrest' ? '255, 255, 255' : '210, 240, 232';
    for (const f of this.foam) {
      const x = f.x - cx;
      const y = f.y - cy;
      if (x < -T || x > W || y < -T || y > H) continue;
      const wave = 0.5 + 0.5 * Math.sin(t * (0.9 + f.h * 0.5) + f.h * 40);
      ctx.fillStyle = `rgba(${white}, ${((0.22 + 0.34 * wave) * Math.min(1.2, amount)).toFixed(3)})`;
      const reach = Math.round(1 + wave * 3);
      for (const side of f.sides) {
        for (let i = 0; i < T; i += 2) {
          if (hash2(f.x + i, f.y, side.charCodeAt(0)) < 0.28 + 0.2 * (1 - wave)) continue;
          const r = reach + ((i >> 1) % 2);
          if (side === 'n') ctx.fillRect(x + i, y + r - 1, 2, 1);
          else if (side === 's') ctx.fillRect(x + i, y + T - r, 2, 1);
          else if (side === 'w') ctx.fillRect(x + r - 1, y + i, 1, 2);
          else ctx.fillRect(x + T - r, y + i, 1, 2);
        }
      }
    }
  }

  // Water falling from the cave roof, with a ring where it lands.
  drawDrips(ctx, t, amount) {
    const { x: cx, y: cy } = this.camera;
    for (const d of this.drips) {
      const period = 3 + d.h * 5;
      const local = (t + d.h * 50) % period;
      const x = d.x - cx;
      const y = d.y - cy;
      if (!this.onScreen(x, y, 20)) continue;
      const drop = 14 + d.h * 20;
      const fall = Math.sqrt(drop / 60);
      if (local < fall) {
        ctx.fillStyle = `rgba(180, 225, 235, ${(0.75 * amount).toFixed(3)})`;
        ctx.fillRect(Math.round(x), Math.round(y + 60 * local * local), 1, 2);
      } else if (local < fall + 0.6) {
        const k = (local - fall) / 0.6;
        ctx.strokeStyle = `rgba(180, 225, 235, ${(0.5 * (1 - k) * amount).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(Math.round(x), Math.round(y + drop) + 0.5, 1 + k * 5, 0.6 + k * 2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  // Slanting rain: lines falling fast, blown to the left. Two weights so it has depth.
  drawRain(ctx, t, amount) {
    const count = Math.min(220, Math.round(95 * amount));
    ctx.save();
    ctx.lineWidth = 1;
    for (const heavy of [false, true]) {
      ctx.strokeStyle = heavy ? 'rgba(205, 240, 228, 0.34)' : 'rgba(165, 210, 200, 0.2)';
      ctx.beginPath();
      for (let i = heavy ? 0 : 1; i < count; i += 2) {
        const speed = (heavy ? 380 : 270) + hash(i + 400) * 120;
        const slant = 0.32 + 0.1 * Math.sin(t * 0.3 + i * 0.01);
        const len = heavy ? 11 + hash(i + 500) * 6 : 6 + hash(i + 500) * 4;
        const y = wrap(hash(i + 600) * (H + 40) + t * speed, H + 40) - 20;
        const x = wrap(hash(i + 700) * (W + 120) - t * speed * slant * 0.5 - y * slant, W + 120) - 40;
        ctx.moveTo(Math.round(x) + 0.5, Math.round(y));
        ctx.lineTo(Math.round(x - len * slant) + 0.5, Math.round(y - len));
      }
      ctx.stroke();
    }
    // The odd drop splashing on the ground.
    ctx.fillStyle = 'rgba(205, 240, 228, 0.3)';
    for (let i = 0; i < count * 0.35; i++) {
      const life = (t * 3.1 + hash(i + 800) * 9) % 5;
      if (life > 0.25) continue;
      const x = hash(i + 810 + Math.floor((t * 3.1 + hash(i + 800) * 9) / 5) * 7) * W;
      const y = 20 + hash(i + 820 + Math.floor((t * 3.1 + hash(i + 800) * 9) / 5) * 11) * (H - 24);
      ctx.fillRect(Math.round(x) - 1, Math.round(y), 3, 1);
      ctx.fillRect(Math.round(x), Math.round(y) - 1, 1, 1);
    }
    ctx.restore();
  }

  // Lightning: one hard white-green frame, then a long fall-off and a fainter
  // second pulse, never two flashes closer than 8 seconds. Each flash cues a
  // roll of thunder (the sound arrives a moment after the light, as it should),
  // and the masts and hulls on the skyline go black against it.
  drawLightning(ctx, t, amount) {
    music.syncThunder();
    // One flash per period (12 to 15 seconds), and never two closer than 8 seconds apart.
    const period = 15 - 3 * Math.min(1, amount);
    const clock = t + this.seed * period;
    const n = Math.floor(clock / period);
    const local = clock - n * period;
    const start = 2 + hash(n * 7.3 + this.seed * 50) * (period - 8.5);
    const dt = local - start;
    this.flashK = 0;
    if (dt < 0 || dt > 0.9) return;
    if (this.flashN !== n) {
      this.flashN = n;
      music.thunderCue(0.35 + hash(n * 3.1) * 0.9, 0.55 + 0.5 * Math.min(1, amount));
    }
    const k = lightningLevel(dt);
    this.flashK = k;
    paintFlash(ctx, k);
  }

  // Black shapes standing out in the sea: snapped masts, leaning hulls and, far
  // off, the Last Light. They sit on the water, behind the fog, and the
  // lightning blacks them out.
  drawSkyline(ctx, t) {
    const { x: cx, y: cy } = this.camera;
    const flash = this.flashK;
    for (const s of this.skyline.things) {
      const x = s.x - cx;
      const y = s.y - cy;
      const big = s.scale ?? 1;
      if (x < -60 * big || x > W + 60 * big || y < -20 || y > H + 150 * big) continue;
      // The Last Light far off is a shape in the rain; drawn near (`scale`), it's solid.
      ctx.fillStyle = s.kind === 'light'
        ? `rgba(4, 18, 16, ${Math.min(1, (big > 1.5 ? 0.94 : 0.7) + 0.25 * flash).toFixed(3)})`
        : `rgba(3, 14, 13, ${(0.72 + 0.28 * flash).toFixed(3)})`;
      if (s.kind === 'mast') drawMast(ctx, Math.round(x), Math.round(y), s);
      else if (s.kind === 'hull') drawHull(ctx, Math.round(x), Math.round(y), s);
      else drawLastLight(ctx, Math.round(x), Math.round(y), t, s.scale);
    }
  }

  // Sea fog: soft pale banks sliding slowly across, a little behind the camera.
  drawSeaFog(ctx, t, amount) {
    const { x: cx, y: cy } = this.camera;
    const sprite = glowSprite('150, 196, 180');
    // Thick fog (over 1, like the Wreck Yard's fog deck) also lays a thin veil over everything.
    if (amount > 1) {
      ctx.fillStyle = `rgba(150, 196, 180, ${Math.min(0.13, 0.07 * (amount - 0.6)).toFixed(3)})`;
      ctx.fillRect(0, 0, W, H);
    }
    const count = Math.round(8 * Math.min(1.8, amount) + 2);
    for (let i = 0; i < count; i++) {
      const w = 190 + hash(i + 900) * 150;
      const h = 70 + hash(i + 910) * 60;
      const span = W + w * 2;
      const x = wrap(hash(i + 920) * span + t * (5 + hash(i + 930) * 9) - cx * 0.55, span) - w;
      const y = hash(i + 940) * (H - 20) + 20 + Math.sin(t * 0.06 + i * 2) * 8 - cy * 0.3;
      ctx.globalAlpha = Math.min(0.3, 0.11 * amount + 0.03 * Math.max(0, amount - 1)) * (0.65 + 0.35 * Math.sin(t * 0.13 + i * 1.7));
      ctx.drawImage(sprite, x - w / 2, y - h / 2, w, h);
    }
    ctx.globalAlpha = 1;
  }

  // Spray thrown up where a wave breaks on the shore.
  drawSpray(ctx, t, amount) {
    const { x: cx, y: cy } = this.camera;
    for (let n = 0; n < this.splash.length; n++) {
      const f = this.splash[n];
      const period = 2.4 + f.h * 3.5 / Math.max(0.5, amount);
      const local = (t + f.h * 20) % period;
      if (local > 0.9) continue;
      const bx = f.x - cx + 8;
      const by = f.y - cy + 8;
      if (!this.onScreen(bx, by, 24)) continue;
      for (let k = 0; k < 6; k++) {
        const vx = (hash(n * 9 + k) - 0.5) * 30;
        const vy = -(30 + hash(n * 13 + k) * 34 * Math.min(1.5, amount));
        const x = bx + vx * local;
        const y = by + vy * local + 70 * local * local;
        ctx.fillStyle = `rgba(240, 255, 250, ${(0.8 * (1 - local / 0.9)).toFixed(3)})`;
        ctx.fillRect(Math.round(x), Math.round(y), k % 3 === 0 ? 2 : 1, 1);
      }
    }
  }

  // Gulls wheeling high over the beach, white against the sky, wings beating.
  drawGulls(ctx, t, amount) {
    const count = Math.round(4 * Math.min(1.5, amount));
    for (let i = 0; i < count; i++) {
      const span = W + 160;
      const dir = i % 2 ? -1 : 1;
      const x = wrap(hash(i + 1000) * span + dir * t * (14 + hash(i + 1010) * 10), span) - 80;
      const y = 18 + hash(i + 1020) * 90 + Math.sin(t * 0.7 + i * 2.3) * 9;
      const flap = Math.sin(t * (4 + hash(i + 1030) * 2) + i * 5);
      const wing = flap > 0.3 ? -2 : flap < -0.3 ? 2 : 0;
      const px = Math.round(x);
      const py = Math.round(y);
      // Its shadow on the sand far below, then the bird: white above, grey beneath, dark wingtips.
      ctx.fillStyle = 'rgba(70, 90, 110, 0.3)';
      ctx.fillRect(px - 3, py + 26, 7, 2);
      for (const side of [-1, 1]) {
        for (let w = 1; w <= 5; w++) {
          const lift = Math.round((wing * w) / 3);
          ctx.fillStyle = '#6a7482';
          ctx.fillRect(px + side * w - (side > 0 ? 0 : 0), py + lift + 1, 1, 1);
          ctx.fillStyle = w >= 5 ? '#4a5260' : '#ffffff';
          ctx.fillRect(px + side * w, py + lift, 1, 1);
        }
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px - 1, py - 1, 3, 3);
      ctx.fillStyle = '#9aa4b0';
      ctx.fillRect(px - 1, py + 2, 3, 1);
      ctx.fillStyle = '#f0a030';
      ctx.fillRect(px + (dir > 0 ? 2 : -2), py, 1, 1);
    }
  }

  onScreen(x, y, pad = 6) {
    return x > -pad && x < W + pad && y > -pad && y < H + pad;
  }

  // Dust drifting in the air, faint, a little slower than the camera moves.
  drawMotes(ctx, t, amount) {
    const { x: cx, y: cy } = this.camera;
    const count = Math.round(26 * Math.min(1, amount));
    for (let i = 0; i < count; i++) {
      const x = wrap(hash(i) * (W + 32) + t * (2 + hash(i + 100) * 4) - cx * 0.9, W + 32) - 16;
      const y = wrap(hash(i + 50) * (H + 32) - t * (1 + hash(i + 200) * 2) + Math.sin(t * 0.5 + i) * 3 - cy * 0.9, H + 32) - 16;
      const a = 0.14 + 0.34 * (0.5 + 0.5 * Math.sin(t * 0.8 + i * 2.1));
      ctx.fillStyle = this.scene.roomData.area === 'belowtown' ? `rgba(255, 226, 150, ${(a * Math.min(1, amount) * 1.3).toFixed(3)})` : `rgba(232, 214, 255, ${(a * amount).toFixed(3)})`;
      const s = i % 6 === 0 ? 2 : 1;
      ctx.fillRect(Math.round(x), Math.round(y), s, s);
    }
  }

  // Crystals breathe, and now and then one winks a four-pointed star.
  drawTwinkle(ctx, t, amount) {
    const { x: cx, y: cy } = this.camera;
    for (const l of this.lights) {
      const x = l.x - cx;
      const y = l.y - cy;
      if (!this.onScreen(x, y, 24)) continue;
      const ph = l.phase ?? 0;
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.4 + ph * 2.3);
      const r = l.bloom * 1.7;
      ctx.globalAlpha = (0.05 + 0.08 * pulse) * amount;
      ctx.drawImage(glowSprite(l.color), x - r, y - r, r * 2, r * 2);
      ctx.globalAlpha = 1;
      const period = 3.4 + fract(ph * 3.7) * 4.5;
      const local = (t + ph * 2.9) % period;
      if (local > 0.45) continue;
      const k = Math.sin((local / 0.45) * Math.PI);
      const sx = Math.round(x + (hash(ph * 7.1) - 0.5) * 8);
      const sy = Math.round(y - 2 - hash(ph * 3.3) * 6);
      const arm = 1 + Math.round(2 * k);
      ctx.fillStyle = `rgba(255, 255, 250, ${(0.9 * k * amount).toFixed(3)})`;
      ctx.fillRect(sx, sy, 1, 1);
      ctx.fillStyle = `rgba(215, 245, 255, ${(0.6 * k * amount).toFixed(3)})`;
      ctx.fillRect(sx - arm, sy, arm, 1);
      ctx.fillRect(sx + 1, sy, arm, 1);
      ctx.fillRect(sx, sy - arm, 1, arm);
      ctx.fillRect(sx, sy + 1, 1, arm);
    }
  }

  // Lamps waver a little more than their light does, and now and then gutter.
  drawFlicker(ctx, t, amount) {
    const { x: cx, y: cy } = this.camera;
    for (const l of this.lamps) {
      const x = l.x - cx;
      const y = l.y - cy;
      if (!this.onScreen(x, y, 30)) continue;
      const ph = l.phase ?? 0;
      let wave = 0.5 + 0.5 * Math.sin(t * 7.3 + ph) * Math.sin(t * 2.9 + ph * 1.9);
      // Every so often the flame ducks.
      const duck = (t + ph * 5) % 7.5;
      if (duck < 0.25) wave *= 0.35 + 0.65 * Math.abs(duck - 0.125) / 0.125;
      const r = l.bloom * 2.4;
      ctx.globalAlpha = 0.11 * wave * amount;
      ctx.drawImage(glowSprite(l.color), x - r, y - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
  }

  // Sparks climbing off the lamps and fires, and a moth or two circling.
  drawEmbers(ctx, t, amount) {
    const { x: cx, y: cy } = this.camera;
    let moths = 0;
    for (let n = 0; n < this.lamps.length; n++) {
      const l = this.lamps[n];
      const x = l.x - cx;
      const y = l.y - cy;
      if (!this.onScreen(x, y, 24)) continue;
      const ph = l.phase ?? 0;
      for (let k = 0; k < 2; k++) {
        const life = 2.8 + k * 0.7;
        const p = fract(t / life + k * 0.47 + ph * 0.31);
        const a = Math.sin(Math.min(1, p * 1.15) * Math.PI) * 0.85 * amount;
        const ex = x + Math.sin(p * 7 + ph * 2 + k * 3) * 4 + (hash(ph + k) - 0.5) * 6;
        const ey = y - 2 - p * (20 + k * 7);
        ctx.fillStyle = `rgba(${p < 0.4 ? '255, 190, 90' : '255, 120, 50'}, ${a.toFixed(3)})`;
        ctx.fillRect(Math.round(ex), Math.round(ey), 1, 1);
      }
      if (n % 2 === 0 && moths < 4) {
        moths++;
        const a = t * (1.5 + hash(ph) * 0.9) + ph * 4;
        const r = 7 + 3 * Math.sin(t * 0.7 + ph);
        const mx = Math.round(x + Math.cos(a) * r);
        const my = Math.round(y - 3 + Math.sin(a * 1.3) * r * 0.55);
        ctx.fillStyle = `rgba(236, 226, 200, ${(0.8 * amount).toFixed(3)})`;
        if (Math.floor(t * 15 + ph * 9) % 2 === 0) ctx.fillRect(mx - 1, my, 3, 1);
        else ctx.fillRect(mx, my - 1, 1, 2);
      }
    }
  }

  // Far-off windows in the rock: a dull gold square that now and then goes out.
  drawWindows(ctx, t, amount) {
    const { x: cx, y: cy } = this.camera;
    for (const w of this.windows) {
      const x = w.x - cx;
      const y = w.y - cy;
      if (!this.onScreen(x, y, 8)) continue;
      const out = (t * 0.07 + w.h * 9) % 1 > 0.93;
      const lit = out ? 0.18 : 0.78 + 0.1 * Math.sin(t * 3 + w.h * 20);
      ctx.fillStyle = `rgba(255, 170, 80, ${(0.14 * lit * amount).toFixed(3)})`;
      ctx.fillRect(x - 1, y - 1, 5, 4);
      ctx.fillStyle = `rgba(255, 214, 130, ${(0.85 * lit * amount).toFixed(3)})`;
      ctx.fillRect(x, y, 3, 2);
      ctx.fillStyle = `rgba(120, 70, 30, ${(0.7 * amount).toFixed(3)})`;
      ctx.fillRect(x + 1, y, 1, 2);
    }
  }

  // Grit trickling off the roof and walls: a few specks, a small puff where
  // they land, every so often, never in the same place twice running.
  drawGrit(ctx, t, amount) {
    const { x: cx, y: cy } = this.camera;
    for (let n = 0; n < this.grit.length; n++) {
      const g = this.grit[n];
      const period = 6 + g.h * 9;
      const local = (t + g.h * 40) % period;
      if (local > 1.5) continue;
      const x = g.x - cx;
      const y = g.y - cy;
      if (!this.onScreen(x, y, 20)) continue;
      const drop = 12 + g.h * 12;
      for (let k = 0; k < 5; k++) {
        const born = k * 0.12;
        const age = local - born;
        if (age < 0) continue;
        const fall = Math.min(drop, 55 * age * age + 6 * age);
        const landed = fall >= drop;
        const ox = (hash(n * 5 + k) - 0.5) * 3;
        if (!landed) {
          ctx.fillStyle = `rgba(176, 146, 110, ${(0.8 * amount).toFixed(3)})`;
          ctx.fillRect(Math.round(x + ox), Math.round(y + fall), 1, 1 + (k % 2));
        } else {
          const since = Math.min(1, (age - Math.sqrt(drop / 55)) / 0.5);
          if (since < 0 || since > 1) continue;
          ctx.fillStyle = `rgba(160, 134, 104, ${(0.45 * (1 - since) * amount).toFixed(3)})`;
          const s = 2 + Math.round(since * 2);
          ctx.fillRect(Math.round(x + ox - s / 2), Math.round(y + drop - since * 3), s, 1);
        }
      }
    }
  }

  // Glints on water: a short pale dash that swells and goes.
  drawShimmer(ctx, t, amount) {
    const { x: cx, y: cy } = this.camera;
    const tone = this.scene.roomData.area === 'sunnyside' ? '255, 255, 236' : this.scene.roomData.area === 'belowtown' ? '255, 214, 150' : '196, 230, 255';
    for (const w of this.water) {
      const x = w.x - cx;
      const y = w.y - cy;
      if (x < -T || x > W || y < -T || y > H || w.h > 0.7) continue;
      const period = 2.4 + w.h * 4;
      const local = (t + w.h * 30) % period;
      if (local > 0.7) continue;
      const k = Math.sin((local / 0.7) * Math.PI);
      const gx = x + 2 + Math.floor(hash(w.h * 10) * 9);
      const gy = y + 3 + Math.floor(hash(w.h * 20) * 9);
      ctx.fillStyle = `rgba(${tone}, ${(0.6 * k * amount).toFixed(3)})`;
      ctx.fillRect(gx, gy, k > 0.6 ? 3 : 2, 1);
      if (k > 0.8) ctx.fillRect(gx + 1, gy - 1, 1, 3);
    }
  }

  // The odd ring spreading on the water.
  drawRings(ctx, t, amount) {
    if (!this.water.length) return;
    const { x: cx, y: cy } = this.camera;
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const period = 5.2 + i * 0.9;
      const cycle = Math.floor((t + i * 1.7) / period);
      const local = (t + i * 1.7) % period;
      if (local > 2.4) continue;
      const w = this.water[Math.floor(hash(i * 13.1 + cycle * 7.3) * this.water.length)];
      const x = w.x + 3 + hash(cycle + i) * 10 - cx;
      const y = w.y + 4 + hash(cycle * 3 + i) * 8 - cy;
      if (!this.onScreen(x, y, 14)) continue;
      const k = local / 2.4;
      for (let ring = 0; ring < 2; ring++) {
        const r = 1.5 + (k - ring * 0.18) * 9;
        if (r < 1.5) continue;
        ctx.strokeStyle = `rgba(190, 228, 255, ${(0.5 * (1 - k) * amount).toFixed(3)})`;
        ctx.beginPath();
        ctx.ellipse(Math.round(x) + 0.5, Math.round(y) + 0.5, r, r * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  // Mist, in slow banks over the water.
  drawHaze(ctx, t, amount) {
    if (!this.water.length) return;
    const { x: cx, y: cy } = this.camera;
    const sprite = glowSprite('176, 206, 230');
    for (let i = 0; i < 7; i++) {
      const base = this.water[Math.floor(hash(i * 3.1 + 5) * this.water.length)];
      const w = 100 + hash(i + 40) * 60;
      const h = 26 + hash(i + 60) * 14;
      const x = base.x + 8 + Math.sin(t * (0.05 + hash(i + 70) * 0.04) + i * 2) * 36 - cx;
      const y = base.y + 8 + Math.sin(t * 0.07 + i * 1.3) * 6 - cy;
      if (x < -w || x > W + w || y < -h || y > H + h) continue;
      ctx.globalAlpha = 0.15 * amount * (0.6 + 0.4 * Math.sin(t * 0.11 + i * 1.9));
      ctx.drawImage(sprite, x - w / 2, y - h / 2, w, h);
    }
    ctx.globalAlpha = 1;
  }

  // Dust along a beam of light: it hangs a few pixels either side of the line,
  // brightening and dimming, and where a beam lands there are flecks.
  drawBeamDust(ctx, t, amount) {
    const { x: cx, y: cy } = this.camera;
    let used = 0;
    for (const beam of this.scene.beams.beams) {
      for (let i = 1; i < beam.points.length && used < 64; i++) {
        const a = beam.points[i - 1];
        const b = beam.points[i];
        const length = Math.hypot(b.x - a.x, b.y - a.y);
        if (length < 4) continue;
        const ux = (b.x - a.x) / length;
        const uy = (b.y - a.y) / length;
        const slots = Math.min(12, Math.ceil(length / 11));
        for (let j = 0; j < slots && used < 64; j++, used++) {
          const seed = a.x * 7.1 + a.y * 3.3 + j * 13.7;
          const along = fract(hash(seed) + t * 0.012 * (0.5 + hash(seed + 1))) * length;
          const across = Math.sin(t * (0.4 + hash(seed + 2) * 0.6) + seed) * (3 + hash(seed + 3) * 5);
          const x = a.x + ux * along - uy * across - cx;
          const y = a.y + uy * along + ux * across - cy;
          if (!this.onScreen(x, y)) continue;
          const glint = 0.5 + 0.5 * Math.sin(t * (1.4 + hash(seed + 4) * 2) + seed);
          const near = 1 - Math.min(1, Math.abs(across) / 9);
          const alpha = (0.2 + 0.7 * glint * glint) * (0.35 + 0.65 * near) * amount;
          ctx.fillStyle = `rgba(255, 246, 210, ${alpha.toFixed(3)})`;
          ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
          if (glint > 0.92 && j % 3 === 0) {
            ctx.fillStyle = `rgba(255, 246, 210, ${(0.3 * amount).toFixed(3)})`;
            ctx.fillRect(Math.round(x) - 1, Math.round(y), 3, 1);
            ctx.fillRect(Math.round(x), Math.round(y) - 1, 1, 3);
          }
        }
      }
      for (const hit of beam.hits) {
        if (hit.kind === 'turn' || hit.kind === 'ves') continue;
        if (hit.kind !== 'eye' && !this.onCrystal(hit.x, hit.y)) continue;
        const x = hit.x - cx;
        const y = hit.y - cy;
        if (!this.onScreen(x, y, 14)) continue;
        // Flecks flung off the crystal where the light lands.
        for (let k = 0; k < 6; k++) {
          const p = fract(t * 1.3 + k / 6 + hit.x * 0.013);
          const angle = hash(k + hit.x * 0.1) * Math.PI * 2;
          const r = 2 + p * 9;
          ctx.fillStyle = `rgba(${k % 2 ? '255, 236, 160' : '170, 255, 235'}, ${((1 - p) * 0.9 * amount).toFixed(3)})`;
          ctx.fillRect(Math.round(x + Math.cos(angle) * r), Math.round(y + Math.sin(angle) * r + p * p * 3), 1, 1);
        }
      }
    }
  }

  // Whether a point is up against crystal.
  onCrystal(px, py) {
    const { room } = this.scene;
    return [[-3, 0], [3, 0], [0, -3], [0, 3], [0, 0]].some(([dx, dy]) => CRYSTAL_TILES.has(room.tileAt(Math.floor((px + dx) / T), Math.floor((py + dy) / T))));
  }

  // Glow-worm specks on the roof and walls: points that drift a hair and
  // blink, and give no light to see by.
  drawWorms(ctx, t, amount) {
    const { x: cx, y: cy } = this.camera;
    for (const w of this.worms) {
      const x = w.x + Math.sin(t * 0.25 + w.h * 40) * 1.5 - cx;
      const y = w.y + Math.sin(t * 0.19 + w.h * 17) * 1 - cy;
      if (!this.onScreen(x, y, 3)) continue;
      const blink = Math.sin(t * (0.5 + w.h * 0.9) + w.h * 60);
      if (blink < 0.15) continue;
      const a = Math.pow(blink, 3) * 0.9 * amount;
      const px = Math.round(x);
      const py = Math.round(y);
      ctx.fillStyle = `rgba(${w.h > 0.5 ? '140, 255, 205' : '170, 225, 255'}, ${(a * 0.16).toFixed(3)})`;
      ctx.fillRect(px - 1, py, 3, 1);
      ctx.fillRect(px, py - 1, 1, 3);
      ctx.fillStyle = `rgba(${w.h > 0.5 ? '170, 255, 220' : '200, 235, 255'}, ${a.toFixed(3)})`;
      ctx.fillRect(px, py, 1, 1);
    }
  }

  // Dandelion seeds sailing across the field, on a breeze.
  drawSeeds(ctx, t, amount) {
    const { x: cx, y: cy } = this.camera;
    const count = Math.round(14 * Math.min(1, amount));
    for (let i = 0; i < count; i++) {
      const x = wrap(hash(i + 400) * (W + 40) + t * (7 + hash(i + 410) * 7) - cx * 0.95, W + 40) - 20;
      const y = wrap(hash(i + 420) * (H + 40) - t * (1.5 + hash(i + 430) * 2.5) + Math.sin(t * 0.8 + i * 1.7) * 6 - cy * 0.95, H + 40) - 20;
      const px = Math.round(x);
      const py = Math.round(y);
      ctx.fillStyle = 'rgba(70, 60, 50, 0.35)';
      ctx.fillRect(px + 1, py + 2, 1, 1);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.fillRect(px, py, 2, 1);
      ctx.fillRect(px - 1, py + 1, 1, 1);
      ctx.fillRect(px + 2, py + 1, 1, 1);
      ctx.fillStyle = 'rgba(214, 210, 190, 0.8)';
      ctx.fillRect(px + 1, py + 1, 1, 1);
    }
  }

  // A few butterflies, wandering their own loops over the grass.
  drawButterflies(ctx, t, amount) {
    const { x: cx, y: cy } = this.camera;
    const colours = [['#f6d445', '#c98a1c'], ['#f4f0e6', '#b8b4c8'], ['#7cc4f0', '#3a78c0'], ['#f08ac0', '#b04a88']];
    for (let n = 0; n < this.grass.length; n++) {
      const g = this.grass[n];
      const a = n * 2.7 + g.h * 9;
      const x = g.x + Math.sin(t * 0.37 + a) * 38 + Math.sin(t * 0.93 + a * 1.7) * 12 - cx;
      const y = g.y + Math.sin(t * 0.29 + a * 1.3) * 20 + Math.sin(t * 1.3 + a) * 4 - cy;
      if (!this.onScreen(x, y, 8)) continue;
      const [wing, edge] = colours[n % colours.length];
      const px = Math.round(x);
      const py = Math.round(y);
      const open = Math.floor(t * 9 + a * 5) % 3;
      ctx.fillStyle = 'rgba(40, 30, 40, 0.28)';
      ctx.fillRect(px - 1, py + 6, 3, 1);
      ctx.fillStyle = '#3a2a34';
      ctx.fillRect(px, py, 1, 2);
      ctx.fillStyle = wing;
      if (open === 0) {
        ctx.fillRect(px - 2, py - 1, 2, 2);
        ctx.fillRect(px + 1, py - 1, 2, 2);
        ctx.fillStyle = edge;
        ctx.fillRect(px - 2, py + 1, 1, 1);
        ctx.fillRect(px + 2, py + 1, 1, 1);
      } else if (open === 1) {
        ctx.fillRect(px - 1, py - 1, 1, 2);
        ctx.fillRect(px + 1, py - 1, 1, 2);
      } else {
        ctx.fillRect(px - 1, py, 1, 1);
        ctx.fillRect(px + 1, py, 1, 1);
      }
    }
  }

  // The wrecked hall: dust coming slowly down, a few crystal bits winking.
  drawSettling(ctx, t) {
    const { x: cx, y: cy } = this.camera;
    for (let i = 0; i < 44; i++) {
      const x = wrap(hash(i + 700) * (W + 24) + Math.sin(t * 0.2 + i) * 6 - cx, W + 24) - 12;
      const y = wrap(hash(i + 710) * (H + 24) + t * (2.5 + hash(i + 720) * 3.5) - cy * 0.5, H + 24) - 12;
      const a = 0.16 + 0.22 * (0.5 + 0.5 * Math.sin(t * 0.6 + i * 2.3));
      ctx.fillStyle = `rgba(206, 190, 164, ${a.toFixed(3)})`;
      ctx.fillRect(Math.round(x), Math.round(y), i % 7 === 0 ? 2 : 1, 1);
    }
    const sprite = glowSprite('196, 176, 150');
    ctx.globalAlpha = 0.07;
    for (let i = 0; i < 4; i++) {
      const x = wrap(hash(i + 730) * (W + 200) + t * 3 - cx * 0.6, W + 200) - 100;
      const y = 60 + hash(i + 740) * (H - 100);
      ctx.drawImage(sprite, x - 70, y - 22, 140, 44);
    }
    ctx.globalAlpha = 1;
    for (const s of this.scene.roomData.wreck.shards ?? []) {
      const x = (s[0] + 0.5) * T - cx;
      const y = (s[1] + 0.5) * T - cy;
      if (!this.onScreen(x, y, 6)) continue;
      const local = (t * 0.6 + hash(s[0] * 3 + s[1])) % 1;
      if (local > 0.18) continue;
      ctx.fillStyle = `rgba(200, 240, 235, ${(0.6 * Math.sin((local / 0.18) * Math.PI)).toFixed(3)})`;
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    }
  }
}

// Keep at most `max` of a list, evenly spread.
function thin(list, max) {
  if (list.length <= max) return list;
  const step = list.length / max;
  return Array.from({ length: max }, (_, i) => list[Math.floor(i * step)]);
}

// The hall after the collapse, painted once onto a picture as big as the room:
// cracks across the flagstones and carpet, heaps of fallen stone about the
// pillars, scattered stones, and bits of crystal. Flat on the floor, so
// anyone walking about stands in front of it.
function paintWreck(room, wreck) {
  const canvas = Object.assign(document.createElement('canvas'), { width: room.pixelWidth, height: room.pixelHeight });
  const g = canvas.getContext('2d');
  const clear = wreck.clear ?? { x: 0, y: 0, w: 0, h: 0 };
  const inClear = (px, py) => px / T >= clear.x && px / T < clear.x + clear.w && py / T >= clear.y && py / T < clear.y + clear.h;
  const open = (px, py) => !room.isSolidTile(Math.floor(px / T), Math.floor(py / T));
  const stone = (px, py, size, k) => {
    px = Math.round(px);
    py = Math.round(py);
    if (!open(px, py) || inClear(px, py)) return;
    const tones = ['#6a5a52', '#8a7a6a', '#4a3e3a', '#a89a88', '#5a4a44'];
    g.fillStyle = 'rgba(8, 4, 12, 0.45)';
    g.fillRect(px + 1, py + size, size + 1, 1);
    g.fillStyle = '#1c1420';
    g.fillRect(px - 1, py - 1, size + 2, size + 1);
    g.fillStyle = tones[Math.floor(hash(k) * tones.length)];
    g.fillRect(px, py, size, size);
    g.fillStyle = 'rgba(255, 255, 255, 0.25)';
    g.fillRect(px, py, 1, 1);
  };
  // Heaps about the pillars.
  (wreck.piles ?? []).forEach(([tx, ty], n) => {
    for (let i = 0; i < 11; i++) {
      const k = n * 50 + i;
      stone((tx + 0.5) * T + (hash(k) - 0.5) * 30, (ty + 1) * T + (hash(k + 1) - 0.3) * 14, 2 + Math.floor(hash(k + 2) * 3), k + 3);
    }
  });
  // Stones strewn about.
  for (let i = 0; i < 46; i++) {
    stone(hash(i + 900) * room.pixelWidth, hash(i + 910) * room.pixelHeight, 1 + Math.floor(hash(i + 920) * 3), i + 930);
  }
  // Cracks: a wandering line, with a branch now and then.
  const crack = (px, py, angle, steps, k) => {
    for (let s = 0; s < steps; s++) {
      angle += (hash(k + s) - 0.5) * 1.3;
      const nx = px + Math.cos(angle) * (3 + hash(k + s + 40) * 4);
      const ny = py + Math.sin(angle) * (3 + hash(k + s + 80) * 4);
      if (open(px, py) && open(nx, ny)) {
        g.strokeStyle = '#120c18';
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(Math.round(px) + 0.5, Math.round(py) + 0.5);
        g.lineTo(Math.round(nx) + 0.5, Math.round(ny) + 0.5);
        g.stroke();
        g.strokeStyle = 'rgba(255, 255, 255, 0.07)';
        g.beginPath();
        g.moveTo(Math.round(px) + 0.5, Math.round(py) + 1.5);
        g.lineTo(Math.round(nx) + 0.5, Math.round(ny) + 1.5);
        g.stroke();
      }
      if (s === 2 && hash(k + 7) > 0.4 && steps > 4) crack(nx, ny, angle + 0.9 - hash(k + 8), steps - 3, k + 100);
      px = nx;
      py = ny;
    }
  };
  (wreck.piles ?? []).forEach(([tx, ty], n) => {
    for (let c = 0; c < 2; c++) crack((tx + 0.5) * T, (ty + 1) * T, hash(n * 7 + c) * Math.PI * 2, 6 + c * 2, n * 31 + c * 11);
  });
  for (let c = 0; c < (wreck.cracks ?? 6); c++) {
    crack(hash(c + 950) * room.pixelWidth, 3 * T + hash(c + 960) * (room.pixelHeight - 6 * T), hash(c + 970) * Math.PI * 2, 6 + Math.floor(hash(c + 980) * 4), c * 17);
  }
  // Bits of crystal that came down with the roof.
  const hues = [['#7ad8d0', '#d8fffa'], ['#c8a0ff', '#f0e0ff'], ['#ffe28a', '#fff6cc']];
  for (const [tx, ty] of wreck.shards ?? []) {
    for (let i = 0; i < 3; i++) {
      const k = tx * 9 + ty * 31 + i;
      const px = Math.round((tx + 0.5) * T + (hash(k) - 0.5) * 10);
      const py = Math.round((ty + 0.5) * T + (hash(k + 1) - 0.5) * 8);
      if (!open(px, py) || inClear(px, py)) continue;
      const [body, light] = hues[Math.floor(hash(k + 2) * hues.length)];
      g.fillStyle = '#1c1420';
      g.fillRect(px - 1, py - 1, 3, 4);
      g.fillStyle = body;
      g.fillRect(px, py, 1, 2);
      g.fillStyle = light;
      g.fillRect(px, py, 1, 1);
      if (i === 0) {
        g.fillStyle = body;
        g.fillRect(px + 1, py + 1, 1, 1);
      }
    }
  }
  return canvas;
}

// --- The storm's skyline -----------------------------------------------------

// Rain on its own, for scenes that bring the storm in (stageShow's `rain`).
export function drawRainLayer(ctx, t, amount) {
  Atmosphere.prototype.drawRain.call(null, ctx, t, amount);
}

// How bright a flash is `dt` seconds in: full on the first frame or two, falling
// away fast, with a fainter second pulse at 0.2 s.
export function lightningLevel(dt) {
  const first = Math.min(1, dt / 0.03) * Math.exp(-dt * 7);
  const second = dt > 0.2 ? Math.min(1, (dt - 0.2) / 0.04) * 0.6 * Math.exp(-(dt - 0.2) * 9) : 0;
  return Math.max(first, second);
}

export function paintFlash(ctx, k) {
  if (k < 0.01) return;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, `rgba(222, 255, 238, ${(0.5 * k).toFixed(3)})`);
  g.addColorStop(1, `rgba(160, 232, 206, ${(0.28 * k).toFixed(3)})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

// Where the silhouettes stand. They go on sea tiles with open sea above them, so
// nothing is ever drawn over ground. A room may name where the Last Light stands
// with `lastLight: { x, y }` (the tile of its foot, sea all the way up) and add
// its own with `skyline: [{ kind: 'mast' | 'hull', x, y }]` (`skyline: false` for none),
// and keep the placed ones out from the shore with `skylineClear: <tiles>`.
function buildSkyline(rows, data, low = null) {
  if (data.skyline === false) return null;
  // Sea at this spot at every tide (a bar or reef that shows at low tide is not sea).
  const sea = (tx, ty) => {
    const here = rows[ty]?.[tx];
    const other = low?.[ty]?.[tx];
    return (here === '~' || here === '0') && (!other || other === ' ' || other === '~' || other === '0');
  };
  // `skylineClear: n` keeps them out to sea: open sea for n tiles all round
  // (and above), so none stands close to a shore. Leave it out for the old placing.
  const reach = data.skylineClear ?? 0;
  const clear = (tx, ty) => {
    for (let dy = -Math.max(4, reach); dy <= reach; dy++) for (let dx = -reach; dx <= reach; dx++) if (!sea(tx + dx, ty + dy)) return false;
    return true;
  };
  const things = [];
  const free = [];
  rows.forEach((row, ty) => {
    for (let tx = 1; tx < row.length - 1; tx++) {
      if (ty >= 4 && sea(tx, ty) && sea(tx - 1, ty) && sea(tx + 1, ty) && sea(tx, ty - 1) && sea(tx, ty - 2) && sea(tx, ty - 3) && sea(tx, ty - 4) && clear(tx, ty)) free.push([tx, ty]);
    }
  });
  // Nothing stands in front of the near tower (`lastLightNear`): keep clear of it.
  const near = data.lastLightNear;
  if (near) for (let i = free.length - 1; i >= 0; i--) if (Math.abs(free[i][0] - near.x) <= 8 && free[i][1] <= near.y) free.splice(i, 1);
  const seedOf = [...(data.id ?? 'room')].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 9973, 7);
  const want = Math.min(10, Math.round(free.length / 20));
  const used = [];
  for (let k = 0; k < want * 6 && things.length < want; k++) {
    const [tx, ty] = free[Math.floor(hash(seedOf + k * 3.7) * free.length)];
    if (used.some(([ux, uy]) => Math.abs(ux - tx) < 5 && Math.abs(uy - ty) < 4)) continue;
    used.push([tx, ty]);
    const hh = hash(seedOf + k * 11.3);
    things.push({ kind: hh < 0.3 && sea(tx + 1, ty - 1) && sea(tx + 2, ty) ? 'hull' : 'mast', x: tx * T + 8, y: ty * T + 8, h: hh, lean: hh < 0.5 ? -1 : 1, tall: 30 + Math.round(hh * 34) });
  }
  for (const t of data.skyline ?? []) things.push({ kind: t.kind, x: t.x * T + 8, y: t.y * T + 8, h: hash(t.x * 7 + t.y), lean: t.lean ?? 1, tall: t.tall ?? 44 });
  // `scale` (default 1) draws it nearer and bigger: the Storm Reach's foot of the tower.
  if (data.lastLight) things.push({ kind: 'light', x: data.lastLight.x * T + 8, y: data.lastLight.y * T + 8, h: 0, scale: data.lastLight.scale ?? 1 });
  return { things };
}

function drawMast(ctx, x, y, s) {
  const { lean, tall } = s;
  // The pole, leaning a little, with a splintered top.
  for (let i = 0; i < tall; i++) ctx.fillRect(x + Math.round((lean * i) / 9), y - i, i < 6 ? 2 : 1, 1);
  const top = x + Math.round((lean * tall) / 9);
  ctx.fillRect(top - lean, y - tall - 3, 1, 3);
  ctx.fillRect(top + lean, y - tall - 2, 1, 2);
  // A spar across it, and a shred of sail hanging from the spar.
  const sy = y - Math.round(tall * 0.7);
  const sx = x + Math.round((lean * tall * 0.7) / 9);
  ctx.fillRect(sx - 8, sy - lean, 17, 1);
  ctx.fillRect(sx - 7, sy + 1, 2, 7);
  ctx.fillRect(sx - 6, sy + 8, 1, 4);
  ctx.fillRect(sx + 3, sy + 1, 3, 5);
  // The deck stub it stands in.
  ctx.fillRect(x - 5, y, 11, 2);
}

function drawHull(ctx, x, y, s) {
  const { lean } = s;
  // A hull heeled over: a rising slab with ribs showing, and a stump of mast.
  for (let i = 0; i < 12; i++) {
    const rise = Math.round((i * 7) / 11);
    const top = lean > 0 ? y - 4 - rise : y - 11 + rise;
    ctx.fillRect(x - 18 + i * 3, top, 4, 5 + (i % 3 === 0 ? 3 : 0));
  }
  ctx.fillRect(x - 16, y, 34, 2);
  ctx.fillRect(x + (lean < 0 ? -2 : 2), y - 24, 2, 14);
}

function drawLastLight(ctx, x, y, t, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(0.74 * scale, 0.74 * scale);
  x = 0;
  y = 0;
  // A tall tapering tower, a lantern room, and a crown of spikes and spars.
  for (let i = 0; i < 76; i++) {
    const w = Math.round(7 - (i / 76) * 3);
    ctx.fillRect(x - w, y - i, w * 2, 1);
  }
  ctx.fillRect(x - 6, y - 82, 12, 6);
  ctx.fillRect(x - 8, y - 77, 16, 2);
  for (const [dx, h] of [[-8, 9], [-5, 14], [-2, 8], [2, 13], [5, 8], [8, 11]]) ctx.fillRect(x + dx, y - 83 - h, 1, h);
  ctx.fillRect(x - 11, y - 91, 5, 1);
  ctx.fillRect(x + 6, y - 95, 6, 1);
  // The only light on it: a pale green slit that never quite goes out.
  const a = 0.55 + 0.25 * Math.sin(t * 0.7);
  ctx.fillStyle = `rgba(190, 255, 215, ${a.toFixed(3)})`;
  ctx.fillRect(x - 1, y - 80, 2, 2);
  ctx.restore();
}
