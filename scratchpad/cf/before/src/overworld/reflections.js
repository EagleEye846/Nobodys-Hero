import { TILE_SIZE as T, SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';
import { TILES } from './tileset.js';
import { COAST_AREAS } from './coastTiles.js';
import { STORM_AREAS } from '../data/areas.js';
import { animationFrame } from '../engine/animations.js';

// REFLECTIONS: still water giving back what stands over it.
//
//   - the party, the monsters and anyone strolling about, upside down and
//     faint under their feet when they stand at the edge of still water or
//     wade in it, wavering a pixel as the water moves
//   - lamps, lanterns, fires and lit windows laying a wobbly streak of their
//     light down the water below them (strongest at night and in the storm)
//   - what stands still at the water's edge (posts, lamps, boats, masts,
//     rails, the fronts of houses on the coast) mirrored faintly in it
//
// How still the water is decides how much shows. Away from the storm all
// water is still. In the storm (STORM_AREAS, until the room's `calmAfter`)
// the open sea is too rough to mirror anything and the rest is broken up by
// the rain: see STORM_STILLNESS. Lights still streak on rough water, but only
// as a scatter of glints. A room can set its own: `reflections: false` (none
// at all) or `reflections: { deep: 0.6, shallow: 0.8 }` (0 none, 1 a mirror).
//
// Cost: the water's stillness is worked out once a room (and again only for a
// row whose tiles the tide changes). Everything that doesn't move is drawn
// once into one picture (the "bake") and laid on each frame in thin bands,
// each nudged a pixel for the ripple, only where it's on screen. Moving
// things are drawn a row at a time, only near water, with every other row
// left out further down (the pixel-art fade). Light streaks are a few
// rectangles a lamp, and only for lamps with water below them.

// Which tiles are water: deep (`~`, `$`, never walked on) and shallows (`;`,
// walked through; on the coast only, where it means sea), and ice (`z`).
const DEEP = new Set(['~', '$']);
const ICE = 'z';
const SHALLOW = ';';

// How still each storm area's water lies: `deep` (open water, `~`) and
// `shallow` (`;`, the wading water). 0 shows nothing; under about 0.75 the
// picture breaks up (rows drop out, it shakes further).
const STORM_STILLNESS = {
  // The open shore and the sea out on the rocks: too rough.
  wrack: { deep: 0, shallow: 0.45 },
  isles: { deep: 0, shallow: 0.4 },
  haddock_light: { deep: 0, shallow: 0.45 },
  reach: { deep: 0, shallow: 0.35 },
  lastlight: { deep: 0, shallow: 0.3 },
  // Harbours, drowned streets and lagoons, out of the worst of the sea.
  saltcombe: { deep: 0.5, shallow: 0.6 },
  lanes: { deep: 0.45, shallow: 0.6 },
  merrow: { deep: 0.5, shallow: 0.6 },
  wreck: { deep: 0.35, shallow: 0.5 },
  ghostship: { deep: 0.3, shallow: 0.4 },
  // Under the cliffs, out of the rain: nearly still.
  soundings: { deep: 0.8, shallow: 0.9 },
};

// Tiles whose upright face (a wall, a house front, a rail) is mirrored in the
// water in front of it, on the coast. At most this many tiles of it.
const FACES = new Set(['W', 'h', 'V', 'H', '5', '6', '7', '8', 'a', 'w', 'e', 'f', 'k', 'K', 'G', 'x']);
const FACE_TILES = 3;

// How strong each kind of reflection is where the water is perfectly still.
const BODY_ALPHA = 0.32;
const PROP_ALPHA = 0.26;
const FACE_ALPHA = 0.2;
// A light's streak: how far down the water it runs (plus its bloom), and how bright.
const STREAK_LENGTH = 26;
const STREAK_ALPHA = 0.7;
// Gaits that keep a monster off the water (no reflection where its feet are).
const ALOFT = new Set(['fly', 'float', 'swing']);

const fract = (x) => x - Math.floor(x);
const hash = (n) => fract(Math.sin(n * 91.7 + 17.3) * 43758.5453);

export class Reflections {
  constructor(scene) {
    this.scene = scene;
    const data = scene.roomData;
    this.coast = COAST_AREAS.has(data.area);
    const stormy = STORM_AREAS.includes(data.area) && !scene.calm && !data.indoors;
    const own = data.reflections;
    this.off = own === false;
    this.still = { deep: 1, shallow: 1, ...(stormy ? STORM_STILLNESS[data.area] : null), ...(typeof own === 'object' ? own : null) };
    // Per tile: how still (0 to 1, 0 = no mirror), and whether it's water at all.
    this.level = null;
    this.wet = null;
    this.rows = [];
    // Where each light's streak meets the water (by the light's place), worked out once.
    this.streakTop = new Map();
    this.rects = [];
    this.bake = null;
    this.bakeKey = null;
  }

  get room() {
    return this.scene.room;
  }

  // The stillness of every tile, kept up to date row by row (the tide
  // rewrites a row's string when it turns a tile, so a changed row is a new string).
  grid() {
    const room = this.room;
    const n = room.width * room.height;
    if (!this.level || this.level.length !== n) {
      this.level = new Float32Array(n);
      this.wet = new Uint8Array(n);
      this.rows = [];
    }
    let changed = false;
    for (let ty = 0; ty < room.height; ty++) {
      const row = room.tiles[ty];
      if (this.rows[ty] === row) continue;
      this.rows[ty] = row;
      changed = true;
      for (let tx = 0; tx < room.width; tx++) {
        const c = row[tx];
        let level = 0;
        let wet = 0;
        if (DEEP.has(c)) { level = this.still.deep; wet = 1; }
        else if (c === SHALLOW && this.coast) { level = this.still.shallow; wet = 1; }
        else if (c === ICE) level = 1;
        this.level[ty * room.width + tx] = level;
        this.wet[ty * room.width + tx] = wet;
      }
    }
    if (changed) { this.bakeKey = null; this.sitterList = null; }
    return changed;
  }

  levelAt(tx, ty) {
    const room = this.room;
    if (tx < 0 || ty < 0 || tx >= room.width || ty >= room.height) return 0;
    if (room.bridged?.size && room.bridged.has(`${tx},${ty}`)) return 0;
    return this.level[ty * room.width + tx];
  }

  wetAt(tx, ty) {
    const room = this.room;
    if (tx < 0 || ty < 0 || tx >= room.width || ty >= room.height) return 0;
    return this.wet[ty * room.width + tx];
  }

  // --- On the floor, before anyone stands on it. ---

  drawFloor(ctx) {
    if (this.off) return;
    this.grid();
    const s = this.scene;
    if (s.spire) return;
    this.drawBake(ctx);
    if (s.ride || s.rope || s.hop || s.climb) return;
    this.drawBodies(ctx);
  }

  // Everyone who moves: the party, monsters, folk out for a stroll.
  movers() {
    const s = this.scene;
    const list = [];
    for (const b of [s.player, ...s.others, ...s.followers]) {
      if (!b || b.hidden || b.tucked || b.isAirborne || b.leaping || (b.ground ?? 0) > 0 || b.sinking > 0) continue;
      // (The hero on the ice is the scene's own: drawReflection.)
      const frame = s.life?.frameOf(b);
      if (frame) list.push({ frame, x: b.x, feet: b.y, hero: b === s.player });
    }
    for (const npc of s.npcs) {
      if (npc.lurking || npc.leap || npc.lunge || ALOFT.has(npc.gait)) continue;
      if (npc.cooldown > 0 && Math.floor(npc.cooldown * 10) % 2 === 0) continue;
      list.push({ frame: npc.sprite, x: npc.x, feet: npc.y - 2 });
    }
    for (const p of this.room.props) {
      if (!p.stroll || p.hidden || p.isOpen) continue;
      const frame = (p.animation && animationFrame(p.animation, performance.now() / 1000, p.speed)) || p.sprite;
      if (frame) list.push({ frame, x: p.x + p.width / 2, feet: p.y + T - (p.raise ?? 0), flip: p.walk?.dir === 'left' && p.stroll?.flip !== false });
    }
    return list;
  }

  drawBodies(ctx) {
    const s = this.scene;
    const cam = s.camera;
    const t = s.time;
    for (const b of this.movers()) {
      const { frame } = b;
      const tx = Math.floor(b.x / T);
      const ty = Math.floor((b.feet - 1) / T);
      if (b.hero && this.room.tileAt(tx, ty) === ICE) continue;
      const x = Math.round(b.x) - Math.floor(frame.width / 2) - cam.x;
      const feet = Math.round(b.feet) - cam.y;
      if (x > W || x + frame.width < 0 || feet > H || feet + frame.height < 0) continue;
      // The water below their feet (and under them, wading or on ice).
      const rects = this.rects;
      rects.length = 0;
      let level = 0;
      const rows = Math.ceil(frame.height / T) + 1;
      const add = (ax, ay) => {
        const l = this.levelAt(ax, ay);
        if (l <= 0) return;
        rects.push(ax, ay);
        level = Math.max(level, l);
      };
      add(tx, ty);
      for (let dy = 1; dy <= rows; dy++) for (let dx = -1; dx <= 1; dx++) add(tx + dx, ty + dy);
      if (!rects.length) continue;
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < rects.length; i += 2) ctx.rect(rects[i] * T - cam.x, rects[i + 1] * T - cam.y, T, T);
      ctx.clip();
      const ice = this.room.tileAt(tx, ty) === ICE;
      if (b.flip) {
        ctx.translate(2 * x + frame.width, 0);
        ctx.scale(-1, 1);
      }
      mirrorRows(ctx, frame, x, feet, ice ? 0.22 : BODY_ALPHA, ice ? 1 : level, ice ? 0 : t, b.x);
      ctx.restore();
    }
  }

  // --- What stands still at the water's edge, drawn once. ---

  // The props and standing tiles near water, and a key that changes when
  // any of them is taken, opened, moved or swapped.
  sitters() {
    if (this.sitterList) return this.sitterList;
    const room = this.room;
    const list = [];
    const nearWater = (x0, x1, top, bottom) => {
      for (let ty = top; ty <= bottom; ty++) for (let tx = x0; tx <= x1; tx++) if (this.levelAt(tx, ty) > 0) return true;
      return false;
    };
    for (const p of room.allProps ?? room.props) {
      if (p.stroll || p.walkable || p.flat || !p.sprite) continue;
      const h = p.sprite.height;
      const footRow = Math.floor((p.y + T - 1 - (p.raise ?? 0)) / T);
      if (nearWater(Math.floor(p.x / T), Math.floor((p.x + p.width - 1) / T), footRow, footRow + Math.ceil(h / T) + 1)) list.push({ prop: p });
    }
    if (this.coast) {
      for (let ty = 0; ty < room.height; ty++) for (let tx = 0; tx < room.width; tx++) {
        const tile = TILES[room.tileAt(tx, ty)];
        if (!tile?.standing) continue;
        const h = tile.height ?? T;
        if (nearWater(tx - 1, tx + 1, ty, ty + Math.ceil(h / T) + 1)) list.push({ tile, tx, ty });
      }
    }
    this.sitterList = list;
    return list;
  }

  keyOf(list) {
    let key = this.rows.length;
    for (const { prop } of list) {
      if (!prop) continue;
      key = (key * 31 + (prop.hidden || prop.isOpen || !this.room.props.includes(prop) ? 7 : 3) + prop.x * 13 + prop.y * 17) % 1000000007;
      key = (key * 31 + (prop.sprite?.width ?? 0) + (prop.sprite?.height ?? 0) * 97) % 1000000007;
    }
    return key;
  }

  // The picture of every still thing's reflection, over the room's water.
  // Remade only when the water or one of the things changes.
  makeBake() {
    const room = this.room;
    const list = this.sitters();
    // Where the mirrored water is, as one box.
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -1;
    let y1 = -1;
    for (let ty = 0; ty < room.height; ty++) for (let tx = 0; tx < room.width; tx++) {
      if (this.levelAt(tx, ty) <= 0) continue;
      x0 = Math.min(x0, tx); y0 = Math.min(y0, ty); x1 = Math.max(x1, tx); y1 = Math.max(y1, ty);
    }
    if (x1 < 0) return null;
    const box = { x: x0 * T, y: y0 * T, w: (x1 - x0 + 1) * T, h: (y1 - y0 + 1) * T };
    const canvas = Object.assign(document.createElement('canvas'), { width: box.w, height: box.h });
    const ctx = canvas.getContext('2d');
    let any = false;
    // The fronts of walls, houses and rails standing over the water, on the
    // coast: the room's own picture, mirrored at the waterline.
    const bg = room.background;
    if (this.coast && bg) {
      for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
        if (this.levelAt(tx, ty) <= 0 || this.levelAt(tx, ty - 1) > 0) continue;
        let run = 0;
        while (run < FACE_TILES && FACES.has(room.tileAt(tx, ty - 1 - run))) run++;
        if (!run) continue;
        const axis = ty * T;
        for (let d = 0; d < run * T; d++) {
          if (d > run * T * 0.45 && d & 1) continue;
          ctx.globalAlpha = FACE_ALPHA * (1 - (d / (run * T)) * 0.8);
          ctx.drawImage(bg, tx * T, axis - 1 - d, T, 1, tx * T - box.x, axis + d - box.y, T, 1);
        }
        any = true;
      }
    }
    // Props and standing tiles: upside down from their feet.
    const now = performance.now() / 1000;
    for (const item of list) {
      let frame;
      let left;
      let feet;
      if (item.prop) {
        const p = item.prop;
        if (p.hidden || p.isOpen || !room.props.includes(p)) continue;
        frame = (p.animation && animationFrame(p.animation, now, p.speed)) || p.sprite;
        left = p.x + Math.floor((p.width - frame.width) / 2);
        feet = p.y + T - (p.raise ?? 0);
      } else {
        const { tile, tx, ty } = item;
        if (tile.animated) continue;
        const h = tile.height ?? T;
        frame = Object.assign(document.createElement('canvas'), { width: T * 3, height: h + T });
        tile.draw(frame.getContext('2d'), T, h, tx, ty, room);
        left = tx * T - T;
        feet = (ty + 1) * T;
      }
      if (!frame) continue;
      mirrorRows(ctx, frame, left - box.x, feet - box.y, PROP_ALPHA, 1, 0, 0);
      any = true;
    }
    if (!any) return null;
    // Only on the water, and as faint as the water is rough.
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'destination-in';
    const mask = Object.assign(document.createElement('canvas'), { width: box.w, height: box.h });
    const m = mask.getContext('2d');
    for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
      const l = this.levelAt(tx, ty);
      if (l <= 0) continue;
      m.fillStyle = `rgba(0, 0, 0, ${l.toFixed(2)})`;
      m.fillRect(tx * T - box.x, ty * T - box.y, T, T);
    }
    ctx.drawImage(mask, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    // Which rows have anything in them at all (the rest are skipped each frame).
    const filled = new Uint8Array(box.h);
    const pixels = ctx.getImageData(0, 0, box.w, box.h).data;
    for (let y = 0; y < box.h; y++) {
      for (let i = y * box.w * 4 + 3, end = (y + 1) * box.w * 4; i < end; i += 4) {
        if (pixels[i]) { filled[y] = 1; break; }
      }
    }
    const calmest = Math.max(this.still.deep, this.still.shallow);
    return { canvas, box, filled, broken: calmest < 0.75 };
  }

  drawBake(ctx) {
    const list = this.sitters();
    const key = this.keyOf(list);
    if (this.bakeKey !== key) {
      this.bake = this.makeBake();
      this.bakeKey = key;
    }
    const bake = this.bake;
    if (!bake) return;
    const cam = this.scene.camera;
    const t = this.scene.time;
    const { canvas, box, filled, broken } = bake;
    // Laid on in bands two pixels high, each nudged sideways for the ripple
    // (and in the storm, now and then a band lost to the rain).
    const sx0 = Math.max(box.x, cam.x - 3);
    const sx1 = Math.min(box.x + box.w, cam.x + W + 3);
    const sy0 = Math.max(box.y, Math.floor(cam.y / 2) * 2);
    const sy1 = Math.min(box.y + box.h, cam.y + H);
    if (sx1 <= sx0 || sy1 <= sy0) return;
    const amp = broken ? 1.6 : 0.7;
    const tick = Math.floor(t * 5);
    for (let y = sy0; y < sy1; y += 2) {
      if (!filled[y - box.y] && !filled[y + 1 - box.y]) continue;
      if (broken && hash(y * 0.13 + tick * 7.1) < 0.22) continue;
      const shift = Math.round(Math.sin(t * 1.9 + y * 0.45) * amp);
      const hgt = Math.min(2, sy1 - y);
      ctx.drawImage(canvas, sx0 - box.x, y - box.y, sx1 - sx0, hgt, sx0 - cam.x + shift, y - cam.y, sx1 - sx0, hgt);
    }
  }

  // --- Lights on the water (drawn over the room's shade, so they show in the dark). ---

  // `lights` are the room's lights in world pixels (lamplight.js's roomLights),
  // `strengthOf` how bright each is just now.
  drawStreaks(ctx, lights, strengthOf) {
    if (this.off || !lights?.length || this.scene.spire) return;
    this.grid();
    const cam = this.scene.camera;
    const t = this.scene.time;
    const room = this.room;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const l of lights) {
      if (!l.bloom || l.sky) continue;
      const lx = Math.round(l.x);
      if (lx - cam.x < -12 || lx - cam.x > W + 12) continue;
      const key = lx * 8192 + Math.round(l.y);
      let top = this.streakTop.get(key);
      if (top === undefined) {
        // The first water straight below the light (within a few tiles).
        top = null;
        const tx = Math.floor(lx / T);
        for (let ty = Math.floor(l.y / T); ty <= Math.floor(l.y / T) + 4; ty++) {
          if (!this.wetAt(tx, ty) && room.tileAt(tx, ty) !== ICE) continue;
          top = Math.max(ty * T + 1, Math.round(l.y) + 4);
          break;
        }
        // Not over a boat or buoy the light sits on: from below its keel.
        if (top !== null) {
          for (const p of room.props) {
            if (p.walkable || p.hidden || lx < p.x || lx >= p.x + p.width) continue;
            const foot = p.y + T - (p.raise ?? 0);
            const head = foot - (p.sprite?.height ?? T);
            if (top >= head && top < foot) top = foot + 1;
          }
        }
        this.streakTop.set(key, top);
      }
      if (top === null) continue;
      const length = STREAK_LENGTH + l.bloom;
      if (top - cam.y > H || top + length - cam.y < 0) continue;
      const strength = Math.min(1, strengthOf(l));
      if (strength < 0.05) continue;
      ctx.fillStyle = `rgb(${l.color})`;
      const phase = l.phase ?? 0;
      const tx = Math.floor(lx / T);
      const rough = this.levelAt(tx, Math.floor(top / T)) < 0.3;
      const tick = Math.floor(t * 6);
      // Row by row, narrowing and fading as it comes down the water, swaying
      // a little, every other row a shorter dash (the ripples); on rough
      // water only a scatter of glints of it.
      for (let i = 0; i < length; i++) {
        const y = top + i;
        const ty = Math.floor(y / T);
        const wx = Math.floor((lx + Math.sin(t * 2.1 + i * 0.45 + phase) * 1.5) / T);
        if (!this.wetAt(wx, ty) && room.tileAt(wx, ty) !== ICE) continue;
        const along = i / length;
        if (rough && hash(i * 1.3 + tick * 3.7 + phase) < 0.5) continue;
        const sway = Math.round(Math.sin(t * 2.1 + i * 0.45 + phase) * (1 + along * 1.5) * (rough ? 2.2 : 1));
        const full = Math.max(2, Math.round(l.bloom * 0.42 * (1 - along * 0.6) * (0.7 + 0.3 * Math.sin(t * 3.3 + i * 0.8 + phase))));
        const width = i & 1 ? Math.max(1, full - 2) : full;
        ctx.globalAlpha = STREAK_ALPHA * strength * (1 - along) * (i & 1 ? 0.6 : 1) * (rough ? 0.8 : 1);
        ctx.fillRect(lx + sway - Math.floor(width / 2) - cam.x, y - cam.y, width, 1);
      }
    }
    ctx.restore();
  }
}

// `frame` drawn upside down from `feet` (its bottom row first), a row at a
// time: fainter further down, every other row left out in the lower half
// (the fade, in whole pixels), each row slid a pixel now and then the way
// water moves (`t` 0: still, as on ice or in the bake). On broken water
// (`level` under 0.75) rows drop out as the rain hits and it sways further.
function mirrorRows(ctx, frame, x, feet, alpha, level, t, seed) {
  const h = frame.height;
  const broken = level < 0.75;
  const amp = broken ? 1.6 : 0.6;
  const tick = Math.floor(t * 6);
  for (let r = 0; r < h; r++) {
    const fade = r / h;
    if (fade > 0.45 && r & 1) continue;
    if (broken && t && hash(r * 0.71 + tick * 5.3 + seed * 0.01) < (0.75 - level) * 0.9) continue;
    ctx.globalAlpha = alpha * Math.min(1, level + 0.25) * (1 - fade * 0.75);
    const wave = t ? Math.round(Math.sin(t * 2.3 + (feet + r) * 0.6) * amp) : 0;
    ctx.drawImage(frame, 0, h - 1 - r, frame.width, 1, x + wave, feet + r, frame.width, 1);
  }
  ctx.globalAlpha = 1;
}

export function makeReflections(scene) {
  if (scene.spire) return null;
  return new Reflections(scene);
}
