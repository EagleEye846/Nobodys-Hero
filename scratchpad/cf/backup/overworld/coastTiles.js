// Chapter 5's coast, drawn tile by tile like the rest of the world (see
// tileset.js): the sunny beach of Gullrest, then the green-storm shore from
// the Wrack Shore to the Last Light.
//
// Each area keeps the usual letters but draws them its own way. A room just
// says `area: 'wrack'` (and so on) and writes its map as any other room does;
// every letter keeps the solidity and height it has everywhere else (a `~` is
// water, an `O` blocks you, a `b` is a 12 px step). tileset.js calls
// installCoastTiles once, after brightTiles. The letter tables are in
// notes/docs/chapter-5-builders-guide.md ("Coast tiles, atmosphere and
// ambiences").
//
// How it is built: each area is a small CONFIG (a palette, and which kind of
// ground, wall, stone and so on each letter is) that buildLook() turns into
// the drawing functions. The green storm itself (the dark teal shade, the
// rain, the lightning) is not painted into the tiles: it is laid over the
// room by lamplight.js (AREA_AMBIENT) and atmosphere.js. So the tiles are
// painted in their own daylight colours, a little brighter than they should
// finally look, and the storm pulls them down.
//
// coastTileLights() says what glows in the tiles (lit windows, lamp niches,
// the sea-glass of the Soundings): lamplight.js adds them to the room's lights.

import { shipBoardsVertical } from './shipDecor.js';

const T = 16;

export const COAST_AREAS = new Set(['gullrest', 'wrack', 'saltcombe', 'lanes', 'wreck', 'ghostship', 'merrow', 'soundings', 'isles', 'haddock_light', 'reach', 'lastlight']);

// --- Little helpers (the same ones brightTiles.js has) ---
function hash(tx, ty, salt = 0) {
  let h = (tx * 374761393 + ty * 668265263 + salt * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const pick = (list, roll) => list[Math.floor(roll * list.length)];
const px = (ctx, color, x, y, w = 1, h = 1) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };
const rnd = (tx, ty, salt, n) => Math.floor(hash(tx, ty, salt) * n);
const at = (room, tx, ty, dx = 0, dy = 0) => room?.tileAt(tx + dx, ty + dy);
function mottle(ctx, color, x, y, tx, ty, salt, size = 6) {
  const mx = rnd(tx, ty, salt, T - size);
  const my = rnd(tx, ty, salt + 1, T - size);
  px(ctx, color, x + mx, y + my + 1, size, size - 2);
  px(ctx, color, x + mx + 1, y + my, size - 2, size);
}
function oval(ctx, color, cx, cy, rx, ry) {
  for (let dy = -ry; dy <= ry; dy++) {
    const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.25))));
    px(ctx, color, cx - w, cy + dy, w * 2 + 1, 1);
  }
}
function shade(ctx, x, y, w, h, alpha, rgb = '0, 0, 0') {
  ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
  ctx.fillRect(x, y, w, h);
}
// '#aabbcc' as 'r, g, b' (for a soft stroke).
// Smooth value noise, 0..1, and a 4x4 dither table.
function softNoise(x, y, s) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const u = (x - ix) * (x - ix) * (3 - 2 * (x - ix));
  const v = (y - iy) * (y - iy) * (3 - 2 * (y - iy));
  const a = hash(ix, iy, s);
  const b = hash(ix + 1, iy, s);
  const c = hash(ix, iy + 1, s);
  const d = hash(ix + 1, iy + 1, s);
  return (a + (b - a) * u) * (1 - v) + (c + (d - c) * u) * v;
}
const DITHER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
function hexRgb(hex) {
  const n = parseInt(hex.slice(1, 7), 16);
  return `${n >> 16}, ${(n >> 8) & 255}, ${n & 255}`;
}
const WALLISH = '#WVHKk5678awehM';
const isWallish = (c) => c != null && WALLISH.includes(c);
const isSea = (c) => c === '~' || c === '0';

// --- Things laid across tiles (deck plates, flagstones, boards) ---
// A row of pieces of uneven length laid end to end, in world pixels: where each piece of
// row `row` starts. Worked out as far as it is needed, then kept. So a plate or a slab can
// be any size and run over several tiles, and its seams don't line up with the tiles.
const SPANS = new Map();
function piecesIn(row, salt, min, max, a, b) {
  const key = `${row},${salt}`;
  let s = SPANS.get(key);
  if (!s) { s = [-1 - Math.floor(hash(row, salt, 1) * max)]; SPANS.set(key, s); }
  while (s[s.length - 1] < b) s.push(s[s.length - 1] + min + Math.floor(hash(row, s.length, salt + 100) * (max - min + 1)));
  const out = [];
  for (let i = 0; i < s.length - 1; i++) if (s[i + 1] > a && s[i] < b) out.push([i, s[i], s[i + 1]]);
  return out;
}
// A brush that paints in world pixels, clipped to one tile (drawn at x, y).
function tileBrush(ctx, x, y, tx, ty) {
  const X0 = tx * T;
  const Y0 = ty * T;
  return (color, wx, wy, w = 1, h = 1) => {
    if (!color) return;
    const a = Math.max(wx, X0);
    const b = Math.min(wx + w, X0 + T);
    const c = Math.max(wy, Y0);
    const d = Math.min(wy + h, Y0 + T);
    if (a >= b || c >= d) return;
    ctx.fillStyle = color;
    ctx.fillRect(x + a - X0, y + c - Y0, b - a, d - c);
  };
}
const rgba = (hex, a) => `rgba(${hexRgb(hex)}, ${a})`;
// The beds of a rock face, by world height: which bed (BED_I), how far into it (BED_K) and
// how thick it is (BED_N, 3 to 7 px).
const BED_SPAN = 4096;
const BED_I = new Int16Array(BED_SPAN);
const BED_K = new Uint8Array(BED_SPAN);
const BED_N = new Uint8Array(BED_SPAN);
for (let wy = 0, i = 0; wy < BED_SPAN; i++) {
  const n = 3 + Math.floor(hash(i, 0, 432) * 5);
  for (let k = 0; k < n && wy < BED_SPAN; k++, wy++) { BED_I[wy] = i; BED_K[wy] = k; BED_N[wy] = n; }
}

// --- Soft edges (see tileBlend.js) ---
// Outdoors on the coast, the room's picture gets a second pass after the tiles are
// painted: ragged, blended edges where one kind of ground meets another, blotches
// that run across tiles, little things lying about, rough wall feet. Where that pass
// draws an edge, the tiles below leave out their own straight one (the wet band, the
// bank's lip, the foam line) and their per-tile colour patches.
const NATURAL_GROUND = new Set(['sand', 'shingle', 'turf', 'path', 'rockfloor']);
// The kind of ground a letter is in this room, for the blend pass (null: not ground it blends).
function groundKind(room, char) {
  const cfg = AREAS[room?.tileLook ?? room?.area];
  if (!cfg || char == null) return null;
  if ('.,:qoX'.includes(char)) return cfg[char] ?? null;
  if (char === ';') return cfg.shallows === 'cobbles' ? 'clearShallows' : 'shallows';
  // Stepping stones stand in the sea: the same water round them, no shore of their own.
  if (char === '~' || char === 'j') return cfg.water === 'clear' ? 'clearWater' : 'water';
  if (char === '0') return cfg.water === 'clear' ? 'clearWater' : 'deep';
  return null;
}
// (Indoors only when the room asks for it: `softEdges: true`, as a sea cave with water in it does.)
const blendOn = (room) => Boolean(room && room.softEdges !== false && (!room.indoors || room.softEdges === true) && AREAS[room.tileLook ?? room.area]);
// Indoors the pass still softens the water's edges (a flooded deck, a chapel floor going under).
const indoorWetOn = (room) => Boolean(room && room.indoors && room.softEdges == null && AREAS[room.tileLook ?? room.area]);
const isLandKind = (k) => NATURAL_GROUND.has(k);
const isWaterKind = (k) => k === 'water' || k === 'deep';
const isWetKind = (k) => isWaterKind(k) || k === 'shallows';
// Built floors the water creeps over (iron plate, cobbles, flags): the shallows over all of
// them, the open water over plate and cobbles (a flooded hole, a drowned floor). Outdoors,
// boards and quays keep a straight edge; indoors a hole in the boards is broken and ragged.
const WET_OVER = { shallows: new Set(['plate', 'cobbles', 'flags']), water: new Set(['plate', 'cobbles']), deep: new Set(['plate', 'cobbles']) };
const BOARDS = new Set(['planks', 'planksV']);
export function wetOverBuilt(a, b, indoor = false) {
  if (WET_OVER[a]?.has(b) || WET_OVER[b]?.has(a)) return true;
  return indoor && ((isWetKind(a) && BOARDS.has(b)) || (isWetKind(b) && BOARDS.has(a)));
}
// A boulder, heap or standing thing has the floor round it under it (tileset.js floorUnder).
const ON_FLOOR = 'OFZNxfIJ^v';
let floorLetter = null;
const groundAt = (room, tx, ty) => {
  const c = room.tileAt(tx, ty);
  return groundKind(room, c != null && ON_FLOOR.includes(c) && floorLetter ? floorLetter(room, tx, ty) : c);
};
// Does the blend pass draw the edge between this tile and its neighbour (dx, dy)?
function softEdge(room, tx, ty, dx, dy) {
  const out = blendOn(room);
  if (!out && !indoorWetOn(room)) return false;
  const a = groundAt(room, tx, ty);
  const b = groundAt(room, tx + dx, ty + dy);
  if (!a || !b || a === b) return false;
  // (Indoors, only where water meets something.)
  if (!out && !isWetKind(a) && !isWetKind(b)) return (a === 'path' && ['flags', 'cobbles', 'plate'].includes(b)) || (b === 'path' && ['flags', 'cobbles', 'plate'].includes(a));
  const soft = (k) => isLandKind(k) || isWaterKind(k) || k === 'shallows';
  return (soft(a) && soft(b)) || townSoft(a, b) || wetOverBuilt(a, b, !out);
}
// Merrow (clear water over a drowned town): the flood's edges wander too. The line
// between the shallows and the deep water, and the waterline where the shallows creep
// up the dry street, are ragged both ways. Where the deep water meets dry paving it is
// a built quay edge and stays straight.
const TOWN_PAVED = new Set(['townCobbles', 'townFlags', 'setts']);
function townSoft(a, b) {
  if (a === b) return false;
  const wet = (k) => k === 'clearWater' || k === 'clearShallows';
  if (wet(a) && wet(b)) return true;
  return (a === 'clearShallows' && TOWN_PAVED.has(b)) || (b === 'clearShallows' && TOWN_PAVED.has(a));
}
// For tileBlend.js: this room's palette, the kind of ground each letter is, and which walls are natural rock.
export function coastBlendLook(room) {
  if (!blendOn(room)) return null;
  const cfg = AREAS[room.tileLook ?? room.area];
  const p = withDefaults(cfg.p);
  const naturalFace = cfg.wallFace === 'rockFace';
  const naturalWall = (c) => {
    if (c === '#' || c === 'k') return naturalFace;
    if (c === 'W' || c === 'G' || c === 'V') return naturalFace;
    if (c === 'K') return cfg.K === 'seaCliff' || (!cfg.K && naturalFace);
    if (c === 'h') return cfg.h === 'rockFace';
    return false;
  };
  const town = cfg.water === 'clear';
  return {
    p, kind: (c) => groundKind(room, c), naturalWall, isLand: isLandKind, isWater: isWaterKind,
    soften: town ? townSoft : null, town, paved: (k) => TOWN_PAVED.has(k),
    // A crag's clifftop (see cragTop): its broken edge reaches well out over the ground beside it.
    crag: room.crag ? { at: (tx, ty) => inCrag(room, tx, ty), top: (wx, wy) => cragTopColour(wx, wy, p) } : null,
  };
}
// Indoors on the coast the blend pass only lays faint wear over the floor and a soft
// shadow along the walls (no ragged edges, nothing lying about): this is its look.
export function coastIndoorLook(room) {
  if (!room || !room.indoors || room.softEdges === false) return null;
  const cfg = AREAS[room.tileLook ?? room.area];
  if (!cfg) return null;
  return {
    p: withDefaults(cfg.p), indoors: true, kind: (c) => groundKind(room, c), naturalWall: () => false,
    isLand: isLandKind, isWater: isWaterKind, wetOnly: true,
  };
}

// =====================================================================
// Ground. Every kind paints a whole tile, then the edges (a wall's shadow
// from above, the wet dark band where the sea reaches it).
// =====================================================================
function edges(ctx, x, y, tx, ty, room, p) {
  if (!room) return;
  if (isWallish(at(room, tx, ty, 0, -1))) { shade(ctx, x, y, T, 3, 0.4, p.shadow); shade(ctx, x, y + 3, T, 2, 0.18, p.shadow); }
  // Where the sea reaches the ground: a darker, wetter band and a bright wet line.
  const wet = (cond, bx, by, bw, bh, lx, ly, lw, lh) => {
    if (!cond) return;
    shade(ctx, x + bx, y + by, bw, bh, 0.28, p.wetShade ?? '10, 30, 40');
    px(ctx, p.wetLine, x + lx, y + ly, lw, lh);
  };
  // (Where the blend pass draws a ragged shore instead, the straight band is left out.)
  const sea = (dx, dy) => isSea(at(room, tx, ty, dx, dy)) && !softEdge(room, tx, ty, dx, dy);
  wet(sea(0, 1), 0, 11, T, 5, 0, 10, T, 1);
  wet(sea(-1, 0), 0, 0, 4, T, 4, 0, 1, T);
  wet(sea(1, 0), 12, 0, 4, T, 11, 0, 1, T);
  wet(sea(0, -1), 0, 0, T, 4, 0, 4, T, 1);
}
// The whole tile in one colour, and a patch or two. With the blend pass on, the colour
// is the same on every tile and the patches come from it instead (they run across tiles,
// so the ground doesn't read as a checkerboard).
function base(ctx, x, y, tx, ty, p, salt = 0, room = null) {
  if (blendOn(room)) {
    px(ctx, p.ground[0], x, y, T, T);
    if (hash(tx, ty, 6 + salt) < 0.35) mottle(ctx, pick([p.hi, p.lo], hash(tx, ty, 2 + salt)), x, y, tx, ty, 7 + salt, 3);
    return;
  }
  px(ctx, pick(p.ground, hash(tx, ty, 1 + salt)), x, y, T, T);
  mottle(ctx, pick([p.hi, p.lo, p.hi], hash(tx, ty, 2 + salt)), x, y, tx, ty, 3 + salt, 8);
  if (hash(tx, ty, 6 + salt) < 0.5) mottle(ctx, p.lo, x, y, tx, ty, 7 + salt, 5);
}
function glints(ctx, x, y, tx, ty, p, chance = 0.3) {
  if (!p.glint) return;
  if (hash(tx, ty, 90) < chance) px(ctx, p.glint, x + 2 + rnd(tx, ty, 91, 9), y + 3 + rnd(tx, ty, 92, 9), 3 + rnd(tx, ty, 93, 3), 1);
  if (hash(tx, ty, 94) < chance * 0.6) px(ctx, p.glint, x + 1 + rnd(tx, ty, 95, 9), y + 10 + rnd(tx, ty, 96, 4), 2, 1);
}

// A floor of boards (see GROUND.planks): rows 4 px apart, each board its own length and
// colour, butted end to end, two nails at each end, the odd knot, split or darker board.
function laidBoards(ctx, x, y, tx, ty, room, p, vertical) {
  if (p.ship) { shipStrakes(ctx, x, y, tx, ty, room, p, shipBoardsVertical(room, tx, ty)); return; }
  // Drawn as if lying sideways; a vertical floor swaps the axes.
  const f0 = tileBrush(ctx, x, y, tx, ty);
  const f = vertical ? (c, a, b, w = 1, h = 1) => f0(c, b, a, h, w) : f0;
  const A0 = (vertical ? ty : tx) * T;
  const B0 = (vertical ? tx : ty) * T;
  px(ctx, p.gap, x, y, T, T);
  for (let row = B0 / 4; row < B0 / 4 + 4; row++) {
    const by = row * 4;
    for (const [bi, a0, a1] of piecesIn(row, vertical ? 33 : 31, 18, 58, A0, A0 + T)) {
      const len = a1 - a0;
      const r = (salt) => hash(row, bi, salt);
      f(pick(p.plank, r(71)), a0 + 1, by, len - 1, 3);
      f(p.plankHi, a0 + 1, by, len - 1, 1);
      f(p.plankLo, a0 + 1, by + 2, len - 1, 1);
      f(p.nail, a0 + 2, by + 1, 1, 1);
      f(p.nail, a1 - 2, by + 1, 1, 1);
      const v = r(72);
      if (v < 0.12) f('rgba(0, 0, 0, 0.16)', a0 + 1, by, len - 1, 3);
      else if (v < 0.2) f(rgba(p.plankHi, 0.35), a0 + 1, by + 1, len - 1, 1);
      // Grain, a knot, or a split.
      if (r(73) < 0.5) f(p.plankLo, a0 + 4 + Math.floor(r(74) * Math.max(1, len - 12)), by + 1, 3 + Math.floor(r(75) * 5), 1);
      if (r(76) < 0.14) { const kx = a0 + 4 + Math.floor(r(77) * Math.max(1, len - 8)); f(p.gap, kx, by + 1, 2, 1); f(p.plankHi, kx, by, 2, 1); }
      if (r(78) < 0.08) f(p.gap, a0 + 3 + Math.floor(r(79) * Math.max(1, len - 10)), by + 1, 5 + Math.floor(r(80) * 4), 1);
    }
  }
  if (p.glint && hash(tx, ty, 75) < 0.35) {
    const gl = 1 + rnd(tx, ty, 77, 3) * 4;
    const ga = 1 + rnd(tx, ty, 76, 5);
    f0(p.glint, (vertical ? gl : ga) + tx * T, (vertical ? ga : gl) + ty * T, vertical ? 1 : 6 + rnd(tx, ty, 78, 6), vertical ? 6 + rnd(tx, ty, 78, 6) : 1);
  }
  edges(ctx, x, y, tx, ty, room, p);
}

// A ship's deck (the Fair Return): long strakes running fore and aft, 5 px of board and a 1 px
// tarred seam, each strake two or three tiles long with its butts staggered against the next
// (a shipwright's shift of butts), treenails in pairs at each butt, a long thin grain and the
// odd knot. The tones are kept close together on purpose: the weathering pass (shipDecor.js)
// lays the big patches of age across the deck, so the boards themselves stay quiet and read as
// one deck, not a wall of little bricks. Gangways (a narrow run of `o`) go the other way.
const STRAKE = 6;
function shipStrakes(ctx, x, y, tx, ty, room, p, vertical) {
  const f0 = tileBrush(ctx, x, y, tx, ty);
  const f = vertical ? (c, a, b, w = 1, h = 1) => f0(c, b, a, h, w) : f0;
  const A0 = (vertical ? ty : tx) * T;
  const B0 = (vertical ? tx : ty) * T;
  px(ctx, p.tar ?? p.gap, x, y, T, T);
  for (let row = Math.floor(B0 / STRAKE); row * STRAKE < B0 + T; row++) {
    const by = row * STRAKE;
    for (const [bi, a0, a1] of piecesIn(row, vertical ? 37 : 35, 56, 112, A0, A0 + T)) {
      const len = a1 - a0;
      const r = (salt) => hash(row, bi, salt);
      f(pick(p.plank, r(71)), a0 + 1, by, len - 1, 5);
      f(rgba(p.plankHi, 0.55), a0 + 1, by, len - 1, 1);
      f(rgba(p.plankLo, 0.6), a0 + 1, by + 4, len - 1, 1);
      // The butt: a hair of light on the end grain, and the treenails.
      f(rgba(p.plankHi, 0.35), a0 + 1, by + 1, 1, 3);
      f(p.nail, a0 + 3, by + 1, 1, 1);
      f(p.nail, a0 + 3, by + 3, 1, 1);
      f(p.nail, a1 - 3, by + 1, 1, 1);
      f(p.nail, a1 - 3, by + 3, 1, 1);
      // Long grain, a knot now and then, a check (a split along the grain).
      const g = r(73);
      if (g < 0.7) f(rgba(p.plankLo, 0.45), a0 + 6 + Math.floor(r(74) * Math.max(1, len - 30)), by + 2, 10 + Math.floor(r(75) * 18), 1);
      if (g < 0.3) f(rgba(p.plankHi, 0.25), a0 + 10 + Math.floor(r(81) * Math.max(1, len - 34)), by + 1, 8 + Math.floor(r(82) * 14), 1);
      if (r(76) < 0.12) { const kx = a0 + 8 + Math.floor(r(77) * Math.max(1, len - 16)); f(p.plankLo, kx, by + 2, 2, 1); f(rgba(p.plankLo, 0.5), kx - 1, by + 1, 4, 3); }
      if (r(78) < 0.06) f(p.tar ?? p.gap, a0 + 6 + Math.floor(r(79) * Math.max(1, len - 20)), by + 2, 6 + Math.floor(r(80) * 8), 1);
    }
  }
  edges(ctx, x, y, tx, ty, room, p);
}

// The Fair Return's cargo (the hold's `cargo` stacks): not one crate per tile in a grid, but
// a real stow, in little groups of a kind: crates (their lids run across two tiles as one
// crate), barrels on end (round heads, hooped), and sacks heaped up. The group is picked by
// the two-by-two block, so a stack reads as barrels here, crates there, sacks between.
function cargoKind(tx, ty) {
  const r = hash(tx >> 1, ty >> 1, 515);
  return r < 0.42 ? 'crate' : r < 0.74 ? 'barrel' : 'sack';
}
const SACK = ['#403b31', '#474135', '#3a362e'];
function shipCargoOf(raise, p) {
  const crate = crateBlockOf(raise, p);
  return (ctx, x, y, tx, ty, room, floor) => {
    const kind = cargoKind(tx, ty);
    if (kind === 'crate') {
      crate(ctx, x, y, tx, ty, room, floor);
      // A crate twice the width: the batten between two lids of one crate goes.
      const top = y - raise;
      if ((tx & 1) === 0 && inCargo(room, tx + 1, ty) && cargoKind(tx + 1, ty) === 'crate') {
        px(ctx, pick(p.plank, hash(tx, ty, 77)), x + T - 4, top + 2, 4, T - 4);
        for (let j = 0; j < 3; j++) px(ctx, p.plankLo, x + T - 4, top + 5 + j * 5, 4, 1);
      }
      if ((tx & 1) === 1 && inCargo(room, tx - 1, ty) && cargoKind(tx - 1, ty) === 'crate') {
        px(ctx, pick(p.plank, hash(tx, ty, 78)), x, top + 2, 4, T - 4);
        for (let j = 0; j < 3; j++) px(ctx, p.plankLo, x, top + 5 + j * 5, 4, 1);
      }
      return;
    }
    floor(ctx, x, y, tx, ty, room);
    const top = y - raise;
    const front = inCargo(room, tx, ty + 1) ? 0 : raise;
    if (kind === 'barrel') {
      // The gaps between the barrels: deep dark.
      px(ctx, p.stand0, x, top, T, T + raise);
      // Barrels never stand in rows like soldiers: each its own size, a little off true.
      const jx = rnd(tx, ty, 520, 5) - 2;
      const jy = rnd(tx, ty, 524, 3) - 1;
      const rr = 6 + rnd(tx, ty, 525, 2);
      const cx = x + 8 + jx;
      if (front) {
        // The barrel's side below its head: staves, two hoops, the bulge lit on the left.
        for (let s = 0; s < 14; s++) {
          const edge = s < 2 || s > 11;
          px(ctx, edge ? p.plankLo : pick(p.plank, hash(tx * 16 + s, ty, 521)), cx - 7 + s, top + 8, 1, raise + 6);
        }
        px(ctx, rgba(p.plankHi, 0.5), cx - 5, top + 8, 1, raise + 6);
        for (const hy of [top + 11, top + 8 + raise]) { px(ctx, p.hoop ?? p.stand1, cx - 7, hy, 14, 2); px(ctx, rgba(p.plankHi, 0.4), cx - 7, hy, 14, 1); }
        shade(ctx, cx - 7, top + 13 + raise, 14, 1, 0.5);
      }
      // The head: a ring of hoop, the head boards, a bung, wet at the near edge.
      const hy = top + 8 + jy;
      oval(ctx, p.hoop ?? p.stand1, cx, hy, rr, rr);
      oval(ctx, pick(p.plank, hash(tx, ty, 522)), cx, hy, rr - 2, rr - 2);
      px(ctx, p.plankLo, cx - rr + 2, hy - 2, rr * 2 - 3, 1);
      px(ctx, p.plankLo, cx - rr + 2, hy + 2, rr * 2 - 3, 1);
      px(ctx, rgba(p.plankHi, 0.5), cx - 3, hy - rr + 2, 5, 1);
      px(ctx, p.stand0, cx + 1 + rnd(tx, ty, 523, 2), hy, 2, 1);
      shade(ctx, cx - rr + 2, hy + rr - 3, rr * 2 - 3, 2, 0.25);
    } else {
      // Sacks heaped: lumpy canvas, a tie at the neck, each one sagging onto the next.
      px(ctx, p.stand0, x, top, T, T + raise);
      if (front) {
        // The near face of the heap: sacks lying one on another, each sagging, the lowest flattest.
        for (let j = 0; j * 7 < raise; j++) {
          const sy = top + T + j * 7 + 2;
          const sx = x + 8 + (j & 1 ? 2 : -1) + rnd(tx, ty, 545 + j, 2);
          oval(ctx, p.stand0, sx, sy + 1, 7, 4);
          oval(ctx, pick(SACK, hash(tx + j, ty, 546)), sx, sy, 7, 3);
          px(ctx, 'rgba(255, 250, 230, 0.1)', sx - 4, sy - 2, 6, 1);
        }
      }
      const n = 2 + rnd(tx, ty, 531, 2);
      for (let i = 0; i < n; i++) {
        const sx = x + 3 + rnd(tx, ty, 532 + i, 10);
        const sy = top + 3 + i * 4 + rnd(tx, ty, 536 + i, 3);
        oval(ctx, p.stand0, sx, sy + 1, 5, 4);
        oval(ctx, pick(SACK, hash(tx + i, ty, 540)), sx, sy, 5, 4);
        px(ctx, 'rgba(255, 250, 230, 0.08)', sx - 3, sy - 3, 4, 1);
        px(ctx, 'rgba(0, 0, 0, 0.22)', sx - 4, sy + 2, 9, 1);
        if (i === n - 1) { px(ctx, p.rope, sx + 3, sy - 3, 2, 1); px(ctx, p.rope, sx + 4, sy - 4, 1, 1); }
      }
    }
  };
}

const GROUND = {
  // Soft sand: ripple lines, grains, the odd shell.
  sand(ctx, x, y, tx, ty, room, p) {
    base(ctx, x, y, tx, ty, p, 0, room);
    for (let i = 0; i < 2; i++) {
      const ry = y + 3 + i * 7 + rnd(tx, ty, 10 + i, 4);
      px(ctx, p.hi, x + rnd(tx, ty, 12 + i, 5), ry, 5 + rnd(tx, ty, 14 + i, 5), 1);
      px(ctx, p.lo, x + rnd(tx, ty, 16 + i, 5) + 1, ry + 1, 4 + rnd(tx, ty, 18 + i, 4), 1);
    }
    for (let i = 0; i < 6; i++) px(ctx, pick(p.speck, hash(tx, ty, 20 + i)), x + rnd(tx, ty, 26 + i, 15), y + rnd(tx, ty, 32 + i, 15));
    if (p.shells && hash(tx, ty, 40) < 0.08) {
      const sx = x + 3 + rnd(tx, ty, 41, 9);
      const sy = y + 3 + rnd(tx, ty, 42, 9);
      px(ctx, pick(p.shells, hash(tx, ty, 43)), sx, sy, 2, 2);
      px(ctx, '#ffffff', sx, sy, 1, 1);
    }
    glints(ctx, x, y, tx, ty, p, 0.15);
    edges(ctx, x, y, tx, ty, room, p);
  },
  // Pebbles and broken shell, sorted by the tide.
  shingle(ctx, x, y, tx, ty, room, p) {
    base(ctx, x, y, tx, ty, p, 0, room);
    for (let i = 0; i < 13; i++) {
      const cx = x + 1 + rnd(tx, ty, 50 + i, 14);
      const cy = y + 2 + rnd(tx, ty, 70 + i, 12);
      const rx = 1 + rnd(tx, ty, 90 + i, 2);
      oval(ctx, pick(p.speck, hash(tx, ty, 110 + i)), cx, cy, rx, 1);
      px(ctx, p.hi, cx - rx + 1, cy - 1, Math.max(1, rx), 1);
      if (i % 3 === 0) px(ctx, p.lo, cx - rx, cy + 1, rx * 2 + 1, 1);
    }
    glints(ctx, x, y, tx, ty, p, 0.35);
    edges(ctx, x, y, tx, ty, room, p);
  },
  // Flat slabs of rock, wet, with hairline cracks.
  rockfloor(ctx, x, y, tx, ty, room, p) {
    base(ctx, x, y, tx, ty, p, 0, room);
    // Hairline joints (fewer and shorter with the blend pass on, so they don't make a grid).
    const smooth = blendOn(room);
    if (hash(tx, ty, 11) < (smooth ? 0.4 : 0.7)) px(ctx, p.lo, x + rnd(tx, ty, 12, 10), y + rnd(tx, ty, 13, 14) + 1, (smooth ? 3 : 5) + rnd(tx, ty, 14, smooth ? 4 : 7), 1);
    if (hash(tx, ty, 15) < (smooth ? 0.2 : 0.4)) px(ctx, p.lo, x + rnd(tx, ty, 16, 14) + 1, y + 2 + (smooth ? rnd(tx, ty, 18, 5) : 0), 1, (smooth ? 3 : 5) + rnd(tx, ty, 17, smooth ? 4 : 8));
    for (let i = 0; i < 4; i++) px(ctx, pick(p.speck, hash(tx, ty, 20 + i)), x + rnd(tx, ty, 26 + i, 15), y + rnd(tx, ty, 32 + i, 15), 1 + (i % 2), 1);
    if (hash(tx, ty, 8) < 0.07) {
      let cx = 3 + rnd(tx, ty, 48, 9);
      for (let cy = 3; cy < 12; cy++) { px(ctx, p.crack, x + cx, y + cy); cx = Math.max(1, Math.min(14, cx + (hash(tx, ty, 50 + cy) < 0.5 ? -1 : 1))); }
    }
    glints(ctx, x, y, tx, ty, p, 0.4);
    edges(ctx, x, y, tx, ty, room, p);
  },
  // Cobbles, round and close, mud in the joints: rows of stones of uneven width (laid in
  // world pixels, so the joints don't repeat tile after tile), the odd one sunk or lifted.
  cobbles(ctx, x, y, tx, ty, room, p) {
    const f = tileBrush(ctx, x, y, tx, ty);
    px(ctx, p.gap, x, y, T, T);
    for (let row = ty * 2; row < ty * 2 + 2; row++) {
      const cy = row * 8;
      for (const [ci, c0, c1] of piecesIn(row, 61, 6, 11, tx * T, tx * T + T)) {
        const w = c1 - c0;
        const r = (salt) => hash(row, ci, salt);
        const col = pick(p.ground, r(61));
        const lift = r(63) < 0.18 ? 1 : 0;
        f(col, c0, cy + 1 + lift, w - 1, 6 - lift);
        f(col, c0 + 1, cy + lift, w - 3, 8 - lift);
        f(p.hi, c0 + 1, cy + 1 + lift, Math.max(1, w - 4), 1);
        f(p.lo, c0 + 1, cy + 6, Math.max(1, w - 3), 1);
        if (r(64) < 0.12) f(rgba(p.lo, 0.5), c0 + 1, cy + 2, w - 3, 3);
      }
    }
    if (hash(tx, ty, 63) < p.moss) mottle(ctx, p.mossColor, x, y, tx, ty, 64, 5);
    glints(ctx, x, y, tx, ty, p, 0.3);
    edges(ctx, x, y, tx, ty, room, p);
  },
  // Flagstones of every size, laid in courses that wander across the tiles (so the joints
  // never make a grid): some worn pale in the middle, some cracked, stained, sunk, chipped,
  // or holding a little rain in a dip.
  flags(ctx, x, y, tx, ty, room, p) {
    const f = tileBrush(ctx, x, y, tx, ty);
    const X0 = tx * T;
    const Y0 = ty * T;
    px(ctx, p.gap, x, y, T, T);
    for (const [ci, cy0, cy1] of piecesIn(-7, 21, 9, 22, Y0, Y0 + T)) {
      for (const [si, sx0, sx1] of piecesIn(ci, 23, 10, 32, X0, X0 + T)) {
        const w = sx1 - sx0;
        const h = cy1 - cy0;
        const r = (salt) => hash(ci * 131 + si, ci, salt);
        f(pick(p.ground, r(24)), sx0 + 1, cy0 + 1, w - 1, h - 1);
        f(p.hi, sx0 + 1, cy0 + 1, w - 2, 1);
        f(rgba(p.hi, 0.35), sx0 + 1, cy0 + 2, 1, h - 3);
        f(p.lo, sx0 + 2, cy1 - 1, w - 2, 1);
        const v = r(25);
        const ix = sx0 + 3 + Math.floor(r(26) * Math.max(1, w - 8));
        const iy = cy0 + 3 + Math.floor(r(27) * Math.max(1, h - 7));
        if (v < 0.14) {
          // Worn pale where feet go.
          f(rgba(p.hi, 0.3), sx0 + 3, cy0 + 3, w - 6, h - 6);
          f(rgba(p.hi, 0.25), sx0 + 4, cy0 + 2, w - 8, h - 4);
        } else if (v < 0.28) {
          // A crack across it.
          let cx = ix;
          const len = 5 + Math.floor(r(28) * 9);
          for (let k = 0; k < len; k++) {
            f(p.crack ?? p.lo, cx, cy0 + 2 + k, 1, 1);
            if (hash(ci + k, si, 29) < 0.45) cx += hash(ci, si + k, 30) < 0.5 ? -1 : 1;
            if (cy0 + 2 + k >= cy1 - 2) break;
          }
        } else if (v < 0.4) {
          // A stain.
          f(rgba(p.lo, 0.45), ix - 2, iy, 7, 3);
          f(rgba(p.lo, 0.45), ix - 1, iy - 1, 5, 5);
        } else if (v < 0.47) {
          // A dip with rain in it.
          f(rgba(p.lo, 0.5), ix - 3, iy, 8, 3);
          f(rgba(p.water ?? p.lo, 0.7), ix - 2, iy + 1, 6, 1);
          f(rgba(p.water ?? p.lo, 0.5), ix - 1, iy, 4, 1);
          f(p.glint ?? p.hi, ix - 1, iy + 1, 2, 1);
        } else if (v < 0.55) {
          // Sunk a little: darker, its top edge in shadow.
          f('rgba(0, 0, 0, 0.14)', sx0 + 1, cy0 + 1, w - 1, h - 1);
          f(p.lo, sx0 + 1, cy0 + 1, w - 1, 1);
        } else if (v < 0.62) {
          // A corner broken off.
          const right = r(31) < 0.5;
          const cx = right ? sx1 - 4 : sx0 + 1;
          f(p.gap, cx, cy0 + 1, 3, 2);
          f(p.gap, right ? cx + 1 : cx, cy0 + 3, 2, 1);
        } else if (v < 0.68 && w > 14) {
          // Split in two.
          const sx = sx0 + 5 + Math.floor(r(32) * (w - 10));
          f(p.gap, sx, cy0 + 1, 1, h - 1);
          f(p.hi, sx + 1, cy0 + 1, 1, h - 2);
        }
        if (r(33) < 0.5) f(pick(p.speck, r(34)), sx0 + 2 + Math.floor(r(35) * (w - 3)), cy0 + 2 + Math.floor(r(36) * (h - 3)));
        if (p.moss && r(37) < p.moss) f(p.mossColor, sx0, cy0 + 2 + Math.floor(r(38) * (h - 4)), 1, 2);
      }
    }
    glints(ctx, x, y, tx, ty, p, 0.2);
    edges(ctx, x, y, tx, ty, room, p);
  },
  // Boards: dark gaps, nails, the grain, rain-wet along the grain. On a floor the boards are
  // of uneven length, butted end to end at different places in each row (nailed only at their
  // ends); a bridge's boards run the whole width (no room: the old even boards).
  planks(ctx, x, y, tx, ty, room, p, vertical = false) {
    if (room) { laidBoards(ctx, x, y, tx, ty, room, p, vertical); return; }
    px(ctx, p.gap, x, y, T, T);
    for (let i = 0; i < 4; i++) {
      const colour = pick(p.plank, hash(tx * (vertical ? 4 : 1) + (vertical ? i : 0), ty * (vertical ? 1 : 4) + (vertical ? 0 : i), 71));
      const jx = rnd(tx, ty * 4 + i, 72, 8) + 3;
      if (vertical) {
        px(ctx, colour, x + i * 4, y, 3, T);
        px(ctx, p.plankHi, x + i * 4, y, 1, T);
        px(ctx, p.plankLo, x + i * 4 + 2, y, 1, T);
        if (hash(tx, ty * 4 + i, 74) < 0.8) { px(ctx, p.gap, x + i * 4, y + jx, 3, 1); }
        px(ctx, p.nail, x + i * 4 + 1, y + 1, 1, 1);
        px(ctx, p.nail, x + i * 4 + 1, y + T - 3, 1, 1);
      } else {
        px(ctx, colour, x, y + i * 4, T, 3);
        px(ctx, p.plankHi, x, y + i * 4, T, 1);
        px(ctx, p.plankLo, x, y + i * 4 + 2, T, 1);
        if (hash(tx, ty * 4 + i, 74) < 0.8) { px(ctx, p.gap, x + jx, y + i * 4, 1, 3); }
        px(ctx, p.nail, x + 1, y + i * 4 + 1, 1, 1);
        px(ctx, p.nail, x + T - 3, y + i * 4 + 1, 1, 1);
      }
    }
    // Wet along the boards, and the odd knot.
    if (p.glint && hash(tx, ty, 75) < 0.4) px(ctx, p.glint, x + 1 + rnd(tx, ty, 76, 5), y + 1 + rnd(tx, ty, 77, 3) * 4, 6 + rnd(tx, ty, 78, 6), 1);
    if (hash(tx, ty, 79) < 0.1) px(ctx, p.gap, x + 3 + rnd(tx, ty, 80, 9), y + 1 + rnd(tx, ty, 81, 3) * 4, 2, 1);
    edges(ctx, x, y, tx, ty, room, p);
  },
  // Iron deck plate: plates of every size in uneven courses, the seams riveted (not every
  // tile: the rivets go along each plate's own top and left seam, spaced its own way). Some
  // plates are worn bright, some patched with a smaller plate, streaked with rust, rusted
  // through and patched, buckled along a seam, dented, or have a board laid over them.
  plate(ctx, x, y, tx, ty, room, p) {
    const f = tileBrush(ctx, x, y, tx, ty);
    const X0 = tx * T;
    const Y0 = ty * T;
    const rivet = (rx, ry) => { f(p.hi, rx, ry, 1, 1); f(p.lo, rx, ry + 1, 1, 1); };
    for (const [ci, cy0, cy1] of piecesIn(-3, 41, 18, 38, Y0, Y0 + T)) {
      for (const [pi, sx0, sx1] of piecesIn(ci, 43, 20, 54, X0, X0 + T)) {
        const w = sx1 - sx0;
        const h = cy1 - cy0;
        const r = (salt) => hash(ci * 977 + pi, pi, salt);
        // The plate, its seams (dark, then a lit edge), and its lower edge a shade darker.
        f(pick(p.ground, r(44)), sx0, cy0, w, h);
        f(p.lo, sx0, cy0, w, 1);
        f(p.lo, sx0, cy0, 1, h);
        f(p.hi, sx0 + 1, cy0 + 1, w - 1, 1);
        f(rgba(p.hi, 0.5), sx0 + 1, cy0 + 2, 1, h - 2);
        f(rgba(p.lo, 0.45), sx0 + 2, cy1 - 1, w - 2, 1);
        // Rivets along the top seam, and (on most plates) down the left one.
        const sp = 4 + Math.floor(r(45) * 4);
        for (let rx = sx0 + 2 + Math.floor(r(46) * sp); rx < sx1 - 1; rx += sp) if (hash(rx, ci, 47) > 0.18) rivet(rx, cy0 + 3);
        if (r(48) < 0.7) for (let ry = cy0 + 3 + sp; ry < cy1 - 2; ry += sp) if (hash(ry, pi, 49) > 0.18) rivet(sx0 + 3, ry);
        const ix = sx0 + 5 + Math.floor(r(50) * Math.max(1, w - 14));
        const iy = cy0 + 6 + Math.floor(r(51) * Math.max(1, h - 14));
        const v = r(52);
        if (v < 0.12) {
          // Worn bright where feet and cargo went.
          f(rgba(p.hi, 0.22), sx0 + 4, cy0 + Math.floor(h / 2) - 3, w - 8, 6);
          f(rgba(p.hi, 0.3), sx0 + 6, cy0 + Math.floor(h / 2) - 1, w - 12, 2);
        } else if (v < 0.24) {
          // Patched with a smaller riveted plate.
          const pw = 8 + Math.floor(r(53) * 6);
          const ph = 6 + Math.floor(r(54) * 5);
          f(p.lo, ix - 1, iy - 1, pw + 2, ph + 2);
          f(pick(p.ground, r(55)), ix, iy, pw, ph);
          f(p.hi, ix, iy, pw, 1);
          for (const [qx, qy] of [[1, 2], [pw - 2, 2], [1, ph - 2], [pw - 2, ph - 2]]) f(p.hi, ix + qx, iy + qy, 1, 1);
          f(rgba(p.rust, 0.6), ix + 1, iy + ph, 1, 2 + Math.floor(r(56) * 3));
        } else if (v < 0.4) {
          // Rust weeping down from the seam.
          const n = 2 + Math.floor(r(57) * 3);
          f(rgba(p.rust, 0.4), sx0 + 2, cy0 + 2, w - 4, 2);
          for (let k = 0; k < n; k++) {
            const sx = sx0 + 2 + Math.floor(hash(ci, pi * 7 + k, 58) * (w - 4));
            f(rgba(p.rust, 0.75), sx, cy0 + 3, 1, 3 + Math.floor(hash(ci, pi * 7 + k, 59) * (h - 7)));
            f(rgba(p.rust, 0.35), sx + 1, cy0 + 3, 1, 2 + Math.floor(hash(ci, pi * 7 + k, 60) * 4));
          }
        } else if (v < 0.48) {
          // Rusted through: a ragged hole, and a plate bolted half over it.
          f(rgba(p.rust, 0.5), ix - 4, iy - 2, 10, 6);
          f(rgba(p.rust, 0.5), ix - 3, iy - 3, 8, 8);
          f(p.gap, ix - 2, iy, 4, 2);
          f(p.gap, ix - 1, iy - 1, 2, 4);
          f(p.lo, ix + 1, iy - 2, 7, 7);
          f(pick(p.ground, r(61)), ix + 2, iy - 1, 5, 5);
          f(p.hi, ix + 2, iy - 1, 5, 1);
          f(p.hi, ix + 3, iy + 1, 1, 1);
          f(p.hi, ix + 5, iy + 2, 1, 1);
        } else if (v < 0.56) {
          // A board or two laid over it.
          const n = 1 + Math.floor(r(62) * 2);
          const bx = sx0 + 2 + Math.floor(r(63) * 6);
          const len = Math.min(w - 4, 14 + Math.floor(r(64) * 16));
          for (let k = 0; k < n; k++) {
            const by = iy - 2 + k * 4;
            f('rgba(0, 0, 0, 0.3)', bx + 1, by + 3, len, 1);
            f(pick(p.plank, r(65 + k)), bx, by, len, 3);
            f(p.plankHi, bx, by, len, 1);
            f(p.plankLo, bx, by + 2, len, 1);
            f(p.nail, bx + 1, by + 1, 1, 1);
            f(p.nail, bx + len - 2, by + 1, 1, 1);
          }
        } else if (v < 0.64) {
          // Buckled: a ridge running slantwise across it.
          const len = Math.min(w - 4, 10 + Math.floor(r(67) * 14));
          const sx = sx0 + 2 + Math.floor(r(68) * Math.max(1, w - len - 3));
          const down = r(69) < 0.5;
          for (let k = 0; k < len; k++) {
            const ky = iy + Math.floor(k / 3) * (down ? 1 : -1);
            f(p.hi, sx + k, ky, 1, 1);
            f(p.lo, sx + k, ky + 1, 1, 1);
          }
        } else if (v < 0.7) {
          // A dent.
          f(rgba(p.lo, 0.45), ix - 3, iy - 1, 7, 3);
          f(rgba(p.lo, 0.45), ix - 2, iy - 2, 5, 5);
          f(p.hi, ix + 1, iy + 2, 2, 1);
        }
        // Now and then rust running from one rivet.
        if (r(70) < 0.3) f(rgba(p.rust, 0.8), sx0 + 2 + Math.floor(r(71) * (w - 4)), cy0 + 5, 1, 3 + Math.floor(r(72) * 5));
      }
    }
    glints(ctx, x, y, tx, ty, p, 0.22);
    edges(ctx, x, y, tx, ty, room, p);
  },
  // Turf and sea-grass: blades in tufts, flattened by the wind.
  turf(ctx, x, y, tx, ty, room, p) {
    if (blendOn(room)) px(ctx, p.turf[0], x, y, T, T);
    else {
      px(ctx, pick(p.turf, hash(tx, ty, 1)), x, y, T, T);
      mottle(ctx, pick(p.turf, hash(tx, ty, 2)), x, y, tx, ty, 3, 8);
      mottle(ctx, p.turfLo, x, y, tx, ty, 5, 6);
    }
    for (let i = 0; i < 8; i++) {
      const bx = x + rnd(tx, ty, 10 + i, 15);
      const by = y + 1 + rnd(tx, ty, 20 + i, 13);
      px(ctx, i % 2 ? p.turfLo : p.turfHi, bx, by, 1, 2);
      if (i % 3 === 0) px(ctx, p.turfHi, bx + 1, by - 1, 1, 1);
    }
    if (p.flowers && hash(tx, ty, 40) < 0.14) {
      const fx = x + 3 + rnd(tx, ty, 41, 10);
      const fy = y + 3 + rnd(tx, ty, 42, 9);
      px(ctx, pick(p.flowers, hash(tx, ty, 43)), fx, fy, 2, 2);
    }
    edges(ctx, x, y, tx, ty, room, p);
  },
  // A trodden way: bare ground, ruts and prints.
  path(ctx, x, y, tx, ty, room, p) {
    const smooth = blendOn(room) || indoorWetOn(room);
    px(ctx, smooth ? p.path[0] : pick(p.path, hash(tx, ty, 1)), x, y, T, T);
    if (!smooth) mottle(ctx, pick(p.path, hash(tx, ty, 2)), x, y, tx, ty, 3, 8);
    for (let i = 0; i < 7; i++) px(ctx, pick(p.speck, hash(tx, ty, 10 + i)), x + rnd(tx, ty, 20 + i, 15), y + rnd(tx, ty, 30 + i, 15));
    // Ruts (shorter with the blend pass on, so they don't line up tile after tile).
    if (hash(tx, ty, 40) < 0.3) px(ctx, p.lo, x + (smooth ? rnd(tx, ty, 44, 6) : 0), y + 4 + rnd(tx, ty, 41, 8), smooth ? 5 + rnd(tx, ty, 45, 6) : T, 1);
    if (hash(tx, ty, 42) < 0.3) px(ctx, p.hi, x + 2, y + 5 + rnd(tx, ty, 43, 8), 10, 1);
    glints(ctx, x, y, tx, ty, p, 0.3);
    edges(ctx, x, y, tx, ty, room, p);
  },
};

// =====================================================================
// Water. Static: the pictures are painted once, so the movement comes from
// atmosphere.js (foam creeping along the edges, glints, rain, spray).
// =====================================================================
function water(ctx, x, y, tx, ty, room, p, deep = false) {
  const w = deep ? p.deep : p.water;
  px(ctx, w, x, y, T, T);
  if (!blendOn(room)) mottle(ctx, deep ? p.water : p.deep, x, y, tx, ty, 3, 8);
  // Wave strokes: a lit crest over a dark trough.
  for (let i = 0; i < 3; i++) {
    const wy = y + 2 + i * 5 + rnd(tx, ty, 10 + i, 3);
    const wx = x + rnd(tx, ty, 14 + i, 9);
    const len = 3 + rnd(tx, ty, 18 + i, 5);
    px(ctx, p.wave, wx, wy, len, 1);
    px(ctx, p.troughs, wx + 1, wy + 1, len, 1);
  }
  if (hash(tx, ty, 30) < p.caps) {
    const cx = x + 2 + rnd(tx, ty, 31, 11);
    const cy = y + 3 + rnd(tx, ty, 32, 9);
    px(ctx, p.foam, cx, cy, 3, 1);
    px(ctx, p.foam, cx + 1, cy - 1, 1, 1);
  }
  waterBanks(ctx, x, y, tx, ty, room, p);
}
// The edges of a stretch of water: the bank above, calm strips at the sides, foam below.
function waterBanks(ctx, x, y, tx, ty, room, p) {
  if (!room) return;
  // (Stepping stones stand in the same water: no bank or foam against them.)
  const inSea = (c) => isSea(c) || c === 'j';
  const above = at(room, tx, ty, 0, -1);
  // (The blend pass draws the shore where water meets sand, turf, shallows and so on.)
  const soft = (dx, dy) => softEdge(room, tx, ty, dx, dy);
  if (!inSea(above) && !soft(0, -1)) {
    // The bank above: a dark lip and its reflection.
    px(ctx, p.lip, x, y, T, 2);
    shade(ctx, x, y + 2, T, 3, 0.3, p.shadow);
    if (isWallish(above)) shade(ctx, x, y + 5, T, 2, 0.15, p.shadow);
  }
  // Land to the sides: a calm, darker strip where the water laps it.
  if (!inSea(at(room, tx, ty, -1, 0)) && at(room, tx, ty, -1, 0) != null && !soft(-1, 0)) shade(ctx, x, y, 2, T, 0.25, p.shadow);
  if (!inSea(at(room, tx, ty, 1, 0)) && at(room, tx, ty, 1, 0) != null && !soft(1, 0)) shade(ctx, x + T - 2, y, 2, T, 0.25, p.shadow);
  // And foam where it breaks (atmosphere.js moves it).
  if (at(room, tx, ty, 0, 1) != null && !inSea(at(room, tx, ty, 0, 1)) && !soft(0, 1)) { px(ctx, p.foam, x, y + T - 2, T, 1); shade(ctx, x, y + T - 4, T, 2, 0.25, '255, 255, 255'); }
}

// Shallows you can wade: the bottom shows through, pale and rippled.
function shallows(ctx, x, y, tx, ty, room, p) {
  px(ctx, p.shallow, x, y, T, T);
  const smooth = blendOn(room);
  if (!smooth) mottle(ctx, p.shallowHi, x, y, tx, ty, 3, 9);
  for (let i = 0; i < 6; i++) px(ctx, pick(p.speck, hash(tx, ty, 10 + i)), x + rnd(tx, ty, 16 + i, 15), y + rnd(tx, ty, 22 + i, 15));
  for (let i = 0; i < 2; i++) {
    const wy = y + 3 + i * 7 + rnd(tx, ty, 30 + i, 3);
    px(ctx, p.wave, x + rnd(tx, ty, 34 + i, 8), wy, 4 + rnd(tx, ty, 36 + i, 4), 1);
  }
  if (hash(tx, ty, 40) < 0.2) px(ctx, p.foam, x + 2 + rnd(tx, ty, 41, 10), y + 2 + rnd(tx, ty, 42, 10), 2, 1);
  if (room && at(room, tx, ty, 0, -1) !== ';' && at(room, tx, ty, 0, -1) !== 'j' && !softEdge(room, tx, ty, 0, -1)) shade(ctx, x, y, T, 2, 0.2, p.shadow);
}

// Stepping stones through the water (you can walk them).
function stones(ctx, x, y, tx, ty, room, p) {
  // In the shallows (more shallows beside it than open sea), the stones stand in shallows.
  const near = room ? [[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dx, dy]) => at(room, tx, ty, dx, dy)) : [];
  const wade = near.filter((c) => c === ';').length;
  if (blendOn(room) && wade && wade >= near.filter(isSea).length) shallows(ctx, x, y, tx, ty, room, p);
  else water(ctx, x, y, tx, ty, room, p);
  const n = 1 + rnd(tx, ty, 1, 2);
  for (let i = 0; i < n; i++) {
    const cx = x + 4 + rnd(tx, ty, 2 + i, 8);
    const cy = y + 5 + rnd(tx, ty, 6 + i, 6);
    shade(ctx, cx - 5, cy + 2, 11, 2, 0.3, p.shadow);
    oval(ctx, p.stoneDark, cx, cy, 5, 3);
    oval(ctx, p.stone, cx, cy - 1, 4, 2);
    px(ctx, p.stoneHi, cx - 2, cy - 2, 3, 1);
    px(ctx, p.foam, cx - 5, cy + 3, 3, 1);
  }
}

// =====================================================================
// A crag (a room's `crag`: a list of { x, y, w, h } tile boxes). Inside them the
// rock is drawn as an open-air headland seen from above and to the south,
// instead of the dark mass and the banded face: the clifftop ('#') is broken
// slabs of weathered rock, lit by the sky along their upper edges, cracked
// between, with moss and thrift in the wet hollows; the face ('W') is fractured
// columns of rock of uneven width, leaning a little, each split across by
// joints with a lit lip and a shadowed underside, darker toward the foot, weed
// hanging off the ledges and a black wet band where the sea reaches. Where the
// clifftop stands beside a lower face, its broken edge reaches over it.
// (The Watch Rock's point: wreck_watch_rock.)
// =====================================================================
const inCrag = (room, tx, ty) => Boolean(room?.crag?.some((b) => tx >= b.x && ty >= b.y && tx < b.x + b.w && ty < b.y + b.h));
// Rock broken into lumps: the nearest of a scatter of points (one in each cell of an sx by sy
// grid, jittered) at a world pixel. [the lump's id, how far in from its edge, and where the
// pixel is from the lump's middle (-1..1 across, -1..1 down)].
function lumpAt(wx, wy, sx, sy, seed) {
  const gx = Math.floor(wx / sx);
  const gy = Math.floor(wy / sy);
  let d1 = 1e9;
  let d2 = 1e9;
  let best = null;
  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      const cx = gx + i;
      const cy = gy + j;
      const px0 = (cx + 0.15 + hash(cx, cy, seed) * 0.7) * sx;
      const py0 = (cy + 0.15 + hash(cx, cy, seed + 1) * 0.7) * sy;
      const d = Math.hypot((wx - px0) / sx, (wy - py0) / sy);
      if (d < d1) { d2 = d1; d1 = d; best = [cx, cy, px0, py0]; } else if (d < d2) d2 = d;
    }
  }
  const [cx, cy, px0, py0] = best;
  return { id: hash(cx, cy, seed + 2), cx, cy, edge: (d2 - d1) * Math.min(sx, sy) * 0.5, ux: (wx - px0) / (sx * 0.6), uy: (wy - py0) / (sy * 0.6) };
}
// The clifftop's colour at a world pixel: low weathered lumps of rock, lit by the sky on the
// sides that face up and left, cracked between, moss and thrift lying wet in the hollows.
function cragTopColour(wx, wy, p) {
  const L = lumpAt(wx, wy, 19, 12, 701);
  const dd = DITHER[(wy & 3) * 4 + (wx & 3)] / 16;
  const g = p.weed ?? p.weedFoot;
  const m = softNoise(wx / 12, wy / 9, 703) + (dd - 0.5) * 0.14;
  if (L.edge < 0.8) return m > 0.5 ? g[(wx + wy) % g.length] : p.deepRock2;
  if (m > 0.58) {
    if (hash(wx, wy, 704) < 0.015) return p.flowers?.[1] ?? '#d68aa4';
    if (m > 0.78 && dd < 0.5) return p.weedHi ?? g[0];
    return g[Math.floor(softNoise(wx / 3, wy / 3, 706) * g.length) % g.length];
  }
  const lit = -L.uy * 0.8 - L.ux * 0.35;
  if (L.edge < 2 && lit > 0.25) return p.rim;
  if (L.edge < 2 && lit < -0.3) return p.rockLo;
  const tones = [p.rock[3], p.rock[1], p.rock[0], p.rock[2]];
  let col = tones[Math.floor(L.id * tones.length)];
  if (lit < -0.45 && dd < 0.5) col = p.rockLo;
  else if (lit > 0.5 && dd < 0.35) col = p.rim;
  if (hash(wx >> 2, wy, 707) < 0.015) col = p.streak;
  return col;
}
function cragTop(ctx, x, y, tx, ty, room, p) {
  for (let r = 0; r < T; r++) for (let c = 0; c < T; c++) px(ctx, cragTopColour(tx * T + c, ty * T + r, p), x + c, y + r);
}
// A crag's face: big rough lumps of rock stacked up the cliff, each lit on its upper side by
// the sky and shadowed under; darker toward the foot; weed hanging off the lumps' tops, black
// and weedy at the foot where the sea reaches; rain running down.
function cragFace(ctx, x, y, tx, ty, room, p) {
  let up = 0;
  while (up < 6 && at(room, tx, ty, 0, -(up + 1)) === 'W') up++;
  let down = 0;
  while (down < 6 && at(room, tx, ty, 0, down + 1) === 'W') down++;
  const faceTop = (ty - up) * T;
  const faceH = (up + down + 1) * T;
  const footY = (ty + down + 1) * T;
  const below = at(room, tx, ty, 0, down + 1);
  const wetFoot = isSea(below) || below === ';';
  const g = p.weed ?? p.weedFoot;
  for (let r = 0; r < T; r++) {
    const wy = ty * T + r;
    const depth = (wy - faceTop) / faceH;
    for (let c = 0; c < T; c++) {
      const wx = tx * T + c;
      const dd = DITHER[(wy & 3) * 4 + (wx & 3)] / 16;
      // Big slabs in places, smaller broken lumps between.
      const L = softNoise(wx / 20, wy / 20, 740) > 0.52 ? lumpAt(wx, wy, 17, 19, 739) : lumpAt(wx, wy, 11, 13, 741);
      const lit = -L.uy * 0.9 - L.ux * 0.3;
      let col;
      if (L.edge < 0.9) col = lit < 0.1 ? p.deepRock2 : p.rim;
      else if (L.edge < 2.2 && lit > 0.2) col = p.rim;
      else if (L.edge < 2.4 && lit < -0.2) col = p.rockLo;
      else {
        col = pick(p.rock, L.id);
        if (lit > 0.45 && dd < 0.4) col = p.rim;
        else if (lit < -0.35 && dd < 0.6) col = p.rockLo;
      }
      // Weed growing on top of a lump and hanging over its face.
      if (hash(L.cx, L.cy, 748) < 0.3 && L.uy < -0.35 && L.edge > 0.9 && Math.abs(L.ux) < 0.7) {
        if (hash(wx, L.cy, 749) < 0.7) col = g[(wx + L.cy) % g.length];
      }
      // Darker toward the foot, out of the sky's light.
      if (depth > 0.5 && dd < (depth - 0.5) * 1.6 && col !== p.rim) col = col === p.rockLo ? p.deepRock2 : p.rockLo;
      // The foot: wet and black where the sea reaches it, weed on it.
      const toFoot = footY - wy;
      if (wetFoot && toFoot <= 4) col = hash(wx, wy, 751) < 0.5 ? g[(wx >> 1) % g.length] : p.deepRock2;
      else if (wetFoot && toFoot <= 7 && dd < 0.5) col = p.rockLo;
      // Rain running down it.
      if (hash(wx, 0, 752) < 0.05 && softNoise(wx, wy / 6, 753) > 0.62) col = p.streak;
      px(ctx, col, x + c, y + r, 1, 1);
    }
  }
  // Where the clifftop stands beside it, the top's broken edge reaches over its side.
  for (const side of [-1, 1]) {
    const n = at(room, tx, ty, side, 0);
    if ((n !== '#' && n !== 'k') || !inCrag(room, tx + side, ty)) continue;
    for (let r = 0; r < T; r++) {
      const wy = ty * T + r;
      const reach = 1 + Math.floor(softNoise(wy / 4, tx * 2 + (side > 0 ? 1 : 0), 760) * 5);
      for (let s = 0; s < reach; s++) {
        const c = side < 0 ? s : T - 1 - s;
        px(ctx, s === reach - 1 ? p.rockLo : cragTopColour(tx * T + c, wy, p), x + c, y + r, 1, 1);
      }
      const sc = side < 0 ? reach : T - 1 - reach;
      shade(ctx, x + sc, y + r, 1, 1, 0.4);
    }
  }
}

// =====================================================================
// Walls.
// =====================================================================
const WALLS = {
  // Cliff or cave rock. Top: the dark mass; face: banded strata.
  rockTop(ctx, x, y, tx, ty, room, p) {
    if (inCrag(room, tx, ty)) { cragTop(ctx, x, y, tx, ty, room, p); return; }
    px(ctx, p.deepRock, x, y, T, T);
    // (With the blend pass on, its patches run across the rock instead of a block per tile.)
    if (!blendOn(room)) {
      if (hash(tx, ty, 1) < 0.6) px(ctx, p.topRock, x + rnd(tx, ty, 2, 9), y + rnd(tx, ty, 3, 9), 6, 5);
      if (hash(tx, ty, 4) < 0.4) px(ctx, p.deepRock2, x + rnd(tx, ty, 5, 11), y + rnd(tx, ty, 6, 11), 4, 3);
    }
    if (hash(tx, ty, 7) < 0.12 && p.fleck) px(ctx, p.fleck, x + rnd(tx, ty, 8, 13) + 1, y + rnd(tx, ty, 9, 13) + 1, 1, 1);
    if (!room) return;
    const below = at(room, tx, ty, 0, 1);
    if (below != null && below !== '#') {
      px(ctx, p.rockLo, x, y + T - 3, T, 2);
      px(ctx, p.rim, x, y + T - 3, T, 1);
      px(ctx, p.deepRock2, x, y + T - 1, T, 1);
    }
    const left = at(room, tx, ty, -1, 0);
    const right = at(room, tx, ty, 1, 0);
    if (left != null && !isWallish(left)) px(ctx, p.rockLo, x, y, 1, T);
    if (right != null && !isWallish(right)) px(ctx, p.rockLo, x + T - 1, y, 1, T);
  },
  // A rock face: beds of uneven thickness that slant a little and run on from tile to tile
  // (picked in world pixels, so a long face is not one tile over and over), split into blocks
  // by joints, some beds wet and dark for a stretch. Now and then something on it: a ledge
  // with thrift or weed, a gull's nest, white gull streaks, a deep crack; rain running down.
  rockFace(ctx, x, y, tx, ty, room, p) {
    if (inCrag(room, tx, ty)) { cragFace(ctx, x, y, tx, ty, room, p); return; }
    const X0 = tx * T;
    const Y0 = ty * T;
    for (let c = 0; c < T; c++) {
      const wx = X0 + c;
      const off = Math.floor(softNoise(wx / 21, 0.5, 431) * 5) + ((wx >> 3) & 1);
      let run = null;
      let from = 0;
      for (let r = 0; r <= T; r++) {
        let col = null;
        if (r < T) {
          const wy = Math.max(0, Y0 + r + off) % BED_SPAN;
          const i = BED_I[wy];
          const k = BED_K[wy];
          const n = BED_N[wy];
          const cw = 9 + (i % 3) * 5;
          const chunk = Math.floor((wx + i * 13) / cw);
          col = pick(p.rock, hash(chunk, i, 433));
          const wet = hash(i, 0, 435) < 0.22 && softNoise(wx / 26, i, 436) > 0.45;
          if (k === 0) col = hash(wx >> 1, i, 434) < 0.65 ? p.rim : col;
          else if (k === n - 1) col = wet || hash(i, 0, 439) < 0.45 ? p.deepRock2 : p.rockLo;
          else if (wet) col = p.rockLo;
          else if ((wx + i * 13) % cw === 0 && hash(chunk, i, 437) < 0.3) col = p.rockLo;
        }
        if (col !== run) {
          if (run) px(ctx, run, x + c, y + from, 1, r - from);
          run = col;
          from = r;
        }
      }
    }
    // Things on the face (no gulls in a cave or indoors).
    const open = room && !room.indoors && (room.tileLook ?? room.area) !== 'soundings';
    const roll = hash(tx, ty, 438);
    const lx = x + 2 + rnd(tx, ty, 439, 8);
    const ly = y + 5 + rnd(tx, ty, 441, 6);
    const ledge = (len) => {
      px(ctx, p.rim, lx, ly, len, 1);
      px(ctx, p.rockLo, lx, ly + 1, len, 1);
      px(ctx, p.deepRock2, lx + 1, ly + 2, len - 1, 1);
    };
    if (roll < 0.11) {
      // A ledge with a tuft of thrift or weed on it.
      ledge(6);
      const g = p.weedFoot ?? p.weed ?? [p.turfLo];
      for (let i = 0; i < 4; i++) px(ctx, pick(g, hash(tx, ty, 448 + i)), lx + i + (i > 1 ? 1 : 0), ly - 1 - (i % 2), 1, 1 + (i % 2));
      if (open) { px(ctx, p.flowers?.[1] ?? '#e08aa8', lx + 1, ly - 2, 1, 1); px(ctx, p.flowers?.[1] ?? '#e08aa8', lx + 4, ly - 3, 1, 1); }
    } else if (roll < 0.15 && open) {
      // A gull's nest on a ledge, white streaks under it.
      ledge(7);
      px(ctx, p.driftwood ?? p.stand2, lx + 1, ly - 2, 5, 2);
      px(ctx, p.stand1 ?? p.rockLo, lx, ly - 1, 7, 1);
      px(ctx, '#e8e6da', lx + 3, ly - 2, 1, 1);
      px(ctx, '#dcdcd0', lx + 2, ly + 2, 1, 3 + rnd(tx, ty, 452, 4));
      px(ctx, '#c4c8be', lx + 5, ly + 2, 1, 2 + rnd(tx, ty, 453, 3));
    } else if (roll < 0.27 && open) {
      // Gull streaks.
      for (let i = 0; i < 1 + rnd(tx, ty, 454, 2); i++) {
        const gx = x + 2 + rnd(tx, ty, 455 + i, 12);
        const gy = y + rnd(tx, ty, 457 + i, 6);
        px(ctx, '#dcdcd0', gx, gy, 2, 1);
        px(ctx, '#c4c8be', gx, gy + 1, 1, 4 + rnd(tx, ty, 459 + i, 6));
      }
    } else if (roll < 0.42) {
      // A deep crack, lit on one side.
      let cx = x + 3 + rnd(tx, ty, 461, 10);
      const len = 7 + rnd(tx, ty, 462, 7);
      for (let cy = 0; cy < len; cy++) {
        px(ctx, p.deepRock2, cx, y + 1 + cy);
        px(ctx, p.rim, cx - 1, y + 1 + cy);
        if (hash(tx, ty * 16 + cy, 463) < 0.35) cx += hash(tx, ty * 16 + cy, 464) < 0.5 ? -1 : 1;
      }
    }
    // Wet: a pale streak of rain running down now and then, and weed or barnacles at the foot.
    if (hash(tx, ty, 440) < 0.4) shade(ctx, x + 2 + rnd(tx, ty, 442, 12), y + rnd(tx, ty, 444, 8), 1, 3 + rnd(tx, ty, 446, 10), 0.55, hexRgb(p.streak));
    if (p.weedFoot && isSea(at(room, tx, ty, 0, 1))) {
      for (let i = 0; i < 6; i++) px(ctx, pick(p.weedFoot, hash(tx, ty, 450 + i)), x + rnd(tx, ty, 456 + i, 15), y + 11 + rnd(tx, ty, 462 + i, 5), 1, 2 + (i % 2));
    }
    // (A face going on down into another face runs on without a line.)
    if (!'WKGVH'.includes(at(room, tx, ty, 0, 1) ?? '?')) px(ctx, p.deepRock2, x, y + T - 1, T, 1);
  },
  // A ship's hull: vertical iron strakes, rivets, rust.
  hullFace(ctx, x, y, tx, ty, room, p) {
    px(ctx, p.deepRock2, x, y, T, T);
    for (let s = 0; s < 2; s++) {
      px(ctx, pick(p.rock, hash(tx, ty, 500 + s)), x + s * 8, y, 7, T);
      px(ctx, p.rim, x + s * 8, y, 1, T);
      px(ctx, p.rockLo, x + s * 8 + 6, y, 1, T);
      for (let r = 1; r < T; r += 5) px(ctx, p.rivet, x + s * 8 + 3, y + r, 2, 1);
    }
    px(ctx, p.rockLo, x, y + 7, T, 1);
    for (let i = 0; i < 3; i++) if (hash(tx, ty, 510 + i) < 0.6) px(ctx, p.rust, x + rnd(tx, ty, 515 + i, 14) + 1, y + rnd(tx, ty, 520 + i, 5), 1, 5 + rnd(tx, ty, 525 + i, 9));
    if (hash(tx, ty, 530) < 0.2) mottle(ctx, p.rust, x, y, tx, ty, 531, 5);
    if (p.weedFoot && isSea(at(room, tx, ty, 0, 1))) for (let i = 0; i < 5; i++) px(ctx, pick(p.weedFoot, hash(tx, ty, 540 + i)), x + rnd(tx, ty, 545 + i, 15), y + 11 + rnd(tx, ty, 550 + i, 5), 1, 3);
    px(ctx, p.deepRock2, x, y + T - 1, T, 1);
  },
  // Whitewashed or plain stone brick, courses staggered; the tower curves, so the sides darken.
  brickFace(ctx, x, y, tx, ty, room, p) {
    px(ctx, p.gap, x, y, T, T);
    for (let r = 0; r < 4; r++) {
      const off = (r + tx) % 2 ? 4 : 0;
      for (let bx = -off; bx < T; bx += 8) {
        const sx = Math.max(0, bx);
        const w = Math.min(bx + 8, T) - sx;
        if (w < 2) continue;
        px(ctx, pick(p.rock, hash(tx * 3 + bx, ty * 5 + r, 600)), x + sx, y + r * 4, w - 1, 3);
        px(ctx, p.rim, x + sx, y + r * 4, w - 1, 1);
      }
    }
    for (let i = 0; i < 2; i++) if (hash(tx, ty, 610 + i) < 0.5) px(ctx, p.streak, x + 2 + rnd(tx, ty, 612 + i, 12), y + rnd(tx, ty, 614 + i, 5), 1, 5 + rnd(tx, ty, 616 + i, 8));
    if (p.curve) {
      const left = isWallish(at(room, tx, ty, -1, 0));
      const right = isWallish(at(room, tx, ty, 1, 0));
      if (!left) shade(ctx, x, y, 3, T, 0.28, p.shadow);
      if (!right) shade(ctx, x + T - 3, y, 3, T, 0.35, p.shadow);
    }
    px(ctx, p.deepRock2, x, y + T - 1, T, 1);
  },
  // Board walls (a stilt house, a hut, a ship's cabin): vertical boards.
  boardWall(ctx, x, y, tx, ty, room, p) {
    for (let i = 0; i < 4; i++) {
      px(ctx, pick(p.wall, hash(tx * 4 + i, ty, 700)), x + i * 4, y, 4, T);
      px(ctx, p.wallHi, x + i * 4, y, 1, T);
      px(ctx, p.wallLo, x + i * 4 + 3, y, 1, T);
    }
    px(ctx, p.trim, x, y, T, 2);
    px(ctx, p.wallLo, x, y + 2, T, 1);
    px(ctx, p.trim, x, y + T - 3, T, 3);
    for (const nx of [1, 5, 9, 13]) { px(ctx, p.nail, x + nx, y + 4); px(ctx, p.nail, x + nx, y + 11); }
    if (hash(tx, ty, 705) < 0.4) px(ctx, p.streak, x + 2 + rnd(tx, ty, 706, 12), y + 3, 1, 6 + rnd(tx, ty, 707, 5));
  },
  // A sea cliff (Saltcombe's K): the headland's rock face. Thick slanting beds
  // of dark wet stone, each with a lit lip and a shadowed underside, split by
  // joints; ledges with a tuft of thrift or a gull's white streak below them;
  // weed and a wet black band at the foot, and foam where the sea's below.
  seaCliff(ctx, x, y, tx, ty, room, p) {
    const up = at(room, tx, ty, 0, -1);
    const down = at(room, tx, ty, 0, 1);
    px(ctx, p.deepRock2, x, y, T, T);
    // The beds slant a little, and run on from tile to tile (picked by world height).
    for (let c = 0; c < T; c++) {
      const wx = tx * T + c;
      const off = Math.floor(wx / 6) % 2 + Math.floor(wx / 23) % 3;
      for (let r = 0; r < T; r++) {
        const wy = ty * T + r + off;
        const bed = Math.floor(wy / 5);
        const k = wy % 5;
        let col = pick(p.rock, hash(Math.floor(wx / 9), bed, 471));
        if (k === 0) col = p.rim;
        else if (k === 4) col = p.rockLo;
        px(ctx, col, x + c, y + r, 1, 1);
      }
    }
    // Joints: dark cracks running down through a bed or two.
    for (let i = 0; i < 2; i++) if (hash(tx, ty, 472 + i) < 0.5) {
      const cx = x + 2 + rnd(tx, ty, 474 + i, 12);
      const cy = y + rnd(tx, ty, 476 + i, 6);
      for (let j = 0; j < 6 + rnd(tx, ty, 478 + i, 5); j++) px(ctx, p.deepRock2, cx + (j > 4 ? 1 : 0), cy + j);
    }
    // A ledge with thrift, or a gull's white streak, now and then.
    const roll = hash(tx, ty, 480);
    if (roll < 0.2) {
      const lx = x + 2 + rnd(tx, ty, 481, 9);
      const ly = y + 3 + rnd(tx, ty, 482, 7);
      px(ctx, p.turf[0], lx, ly, 5, 2);
      px(ctx, p.turfHi, lx + 1, ly, 3, 1);
      px(ctx, '#e08aa8', lx + 1, ly - 1, 1, 1);
      px(ctx, '#e08aa8', lx + 3, ly - 1, 1, 1);
    } else if (roll < 0.34) {
      const gx = x + 3 + rnd(tx, ty, 483, 10);
      const gy = y + rnd(tx, ty, 484, 5);
      px(ctx, '#dcdcd0', gx, gy, 2, 1);
      px(ctx, '#c4c8be', gx, gy + 1, 1, 4 + rnd(tx, ty, 485, 4));
    }
    // Rain running down the face.
    for (let i = 0; i < 2; i++) if (hash(tx, ty, 486 + i) < 0.45) px(ctx, p.streak, x + 1 + rnd(tx, ty, 488 + i, 14), y + rnd(tx, ty, 490 + i, 6), 1, 4 + rnd(tx, ty, 492 + i, 7));
    // Under the clifftop: the turf's edge hanging over, roots in the first bed.
    if (up === '#' || up === 'k') {
      px(ctx, p.deepRock, x, y, T, 2);
      for (let c = 0; c < T; c += 2) if (hash(tx * 8 + c, ty, 494) < 0.6) px(ctx, p.turfLo, x + c, y + 2, 2, 1 + rnd(tx * 8 + c, ty, 495, 2));
    } else if (up != null && up !== 'K' && !isWallish(up)) {
      // Open ground above (a clifftop path or turf): its edge hangs over the face.
      px(ctx, p.deepRock, x, y, T, 1);
      for (let c = 0; c < T; c += 2) {
        const drop = 1 + rnd(tx * 8 + c, ty, 497, 3);
        px(ctx, up === ',' ? p.turf[0] : pick(p.path, hash(tx * 8 + c, ty, 498)), x + c, y, 2, drop);
        if (up === ',' && hash(tx * 8 + c, ty, 499) < 0.4) px(ctx, p.turfHi, x + c, y, 1, 1);
      }
    }
    // A face that ends beside open ground gets a lit or shadowed corner.
    const left = at(room, tx, ty, -1, 0);
    const right = at(room, tx, ty, 1, 0);
    if (left != null && left !== 'K' && !isWallish(left)) shade(ctx, x, y, 2, T, 0.25, hexRgb(p.rim));
    if (right != null && right !== 'K' && !isWallish(right)) shade(ctx, x + T - 3, y, 3, T, 0.4);
    // The foot: a wet black band, weed, and foam if the sea's below.
    if (down != null && down !== 'K') {
      px(ctx, p.deepRock, x, y + T - 4, T, 3);
      if (p.weedFoot) for (let i = 0; i < 6; i++) px(ctx, pick(p.weedFoot, hash(tx, ty, 496 + i)), x + rnd(tx, ty, 502 + i, 15), y + T - 5 + rnd(tx, ty, 508 + i, 3), 1, 2 + (i % 2));
      if (isSea(down)) for (let i = 0; i < 3; i++) px(ctx, p.foam, x + rnd(tx, ty, 514 + i, 13), y + T - 1, 2 + rnd(tx, ty, 517 + i, 3), 1);
      else px(ctx, p.deepRock2, x, y + T - 1, T, 1);
    }
  },
};

// =====================================================================
// Houses (5 wall, 6 window, 7 roof, 8 door), cabins (a w e), stilts.
// =====================================================================
function houseColour(p, tx, ty, room) {
  // One colour per house: walk to the left end of this run of wall.
  let ex = tx;
  while (ex > 0 && ['5', '6', '8', 'h'].includes(at(room, ex - 1, ty))) ex--;
  return p.houses[Math.floor(hash(ex, ty, 777) * p.houses.length)];
}
const HOUSES = {
  wall(ctx, x, y, tx, ty, room, p) {
    const c = houseColour(p, tx, ty, room);
    for (let i = 0; i < 4; i++) {
      px(ctx, c, x + i * 4, y, 4, T);
      px(ctx, p.boardHi, x + i * 4, y, 1, T);
      px(ctx, p.boardLo, x + i * 4 + 3, y, 1, T);
    }
    px(ctx, p.boardLo, x, y, T, 1);
    px(ctx, p.trim, x, y + T - 2, T, 2);
    if (hash(tx, ty, 780) < 0.35) px(ctx, p.streak, x + 2 + rnd(tx, ty, 781, 12), y + 2, 1, 7);
    shade(ctx, x, y + T - 5, T, 3, 0.18, p.shadow);
  },
  window(ctx, x, y, tx, ty, room, p) {
    HOUSES.wall(ctx, x, y, tx, ty, room, p);
    px(ctx, p.frame, x + 2, y + 2, 12, 11);
    px(ctx, p.glass, x + 3, y + 3, 10, 9);
    px(ctx, p.glassHi, x + 3, y + 3, 10, 3);
    px(ctx, p.frame, x + 8, y + 3, 1, 9);
    px(ctx, p.frame, x + 3, y + 7, 10, 1);
    px(ctx, p.sill, x + 1, y + 13, 14, 2);
    // A curtain, half drawn.
    if (hash(tx, ty, 790) < 0.5) px(ctx, p.curtain, x + 3, y + 3, 3, 9);
  },
  door(ctx, x, y, tx, ty, room, p) {
    HOUSES.wall(ctx, x, y, tx, ty, room, p);
    px(ctx, p.frame, x + 1, y + 1, 14, 15);
    for (let i = 0; i < 3; i++) {
      px(ctx, p.door, x + 2 + i * 4, y + 2, 4, 14);
      px(ctx, p.doorHi, x + 2 + i * 4, y + 2, 1, 14);
    }
    px(ctx, p.frame, x + 2, y + 8, 12, 1);
    px(ctx, p.knob, x + 11, y + 10, 2, 2);
    px(ctx, p.sill, x, y + 15, T, 1);
  },
  roof(ctx, x, y, tx, ty, room, p) {
    px(ctx, p.roofLo, x, y, T, T);
    for (let r = 0; r < 4; r++) {
      const off = (r + tx) % 2 ? 4 : 0;
      for (let bx = -off; bx < T; bx += 8) {
        const sx = Math.max(0, bx);
        const w = Math.min(bx + 8, T) - sx;
        if (w < 2) continue;
        px(ctx, pick(p.roof, hash(tx * 3 + bx, ty * 5 + r, 800)), x + sx, y + r * 4, w - 1, 3);
        px(ctx, p.roofHi, x + sx, y + r * 4, w - 1, 1);
      }
    }
    if (isWallish(at(room, tx, ty, 0, 1)) === false) { /* eaves */ px(ctx, p.roofLo, x, y + T - 2, T, 2); shade(ctx, x, y + T, T, 0, 0); }
    if (hash(tx, ty, 806) < 0.25) mottle(ctx, p.streak, x, y, tx, ty, 807, 4);
  },
  // Cabins, as a wreck's deckhouse: board wall, porthole, deck roof.
  cabinWall(ctx, x, y, tx, ty, room, p) { WALLS.boardWall(ctx, x, y, tx, ty, room, p); },
  cabinWindow(ctx, x, y, tx, ty, room, p) {
    WALLS.boardWall(ctx, x, y, tx, ty, room, p);
    oval(ctx, p.frame, x + 8, y + 7, 5, 5);
    oval(ctx, p.glass, x + 8, y + 7, 4, 4);
    px(ctx, p.glassHi, x + 6, y + 5, 3, 1);
    px(ctx, p.frame, x + 3, y + 7, 10, 1);
  },
  cabinRoof(ctx, x, y, tx, ty, room, p) {
    GROUND.planks(ctx, x, y, tx, ty, null, { ...p, glint: null }, false);
    shade(ctx, x, y, T, T, 0.12, p.shadow);
    px(ctx, p.gap, x, y + T - 2, T, 2);
  },
};

// =====================================================================
// Standing things (drawn over the floor, sorted with the characters).
// =====================================================================
const STANDING = {
  // A mast: a tall bare pole with rope, a spar and a ragged sail.
  mast(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 13, 14, 3, 0.35);
    px(ctx, p.stand0, x + 3, y + 10, 10, 4);
    px(ctx, p.stand1, x + 4, y + 10, 8, 2);
    px(ctx, p.stand0, x + 5, y - 36, 6, 48);
    px(ctx, p.stand2, x + 6, y - 36, 4, 48);
    px(ctx, p.standHi, x + 6, y - 36, 1, 48);
    px(ctx, p.stand0, x + 9, y - 36, 1, 48);
    for (let r = -28; r < 8; r += 8) px(ctx, p.stand0, x + 5, y + r, 6, 1);
    // The spar and a tatter of sail.
    px(ctx, p.stand0, x - 3, y - 30, 22, 3);
    px(ctx, p.stand2, x - 2, y - 30, 20, 1);
    const sail = hash(tx, ty, 3);
    if (sail < 0.75) {
      for (let c = 0; c < 6; c++) px(ctx, p.sail, x - 1 + c * 3, y - 27, 3, 5 + ((c * 7 + tx) % 7));
      px(ctx, p.sailLo, x - 1, y - 27, 18, 1);
    }
    // Rope hanging, and a snapped end.
    px(ctx, p.rope, x + 15, y - 28, 1, 14);
    px(ctx, p.rope, x - 3, y - 28, 1, 9);
    px(ctx, p.rope, x + 4, y - 14, 1, 20);
  },
  // A tall iron or stone pillar: ribbed, with a broken crown (the Last Light's spikes).
  pillar(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 13, 14, 3, 0.35);
    px(ctx, p.deepRock2, x + 1, y + 8, 14, 7);
    px(ctx, p.rock[0], x + 2, y + 9, 12, 5);
    px(ctx, p.rim, x + 2, y + 9, 12, 1);
    px(ctx, p.deepRock2, x + 3, y - 26, 10, 36);
    px(ctx, p.rock[1], x + 4, y - 25, 8, 34);
    px(ctx, p.rim, x + 4, y - 25, 2, 34);
    px(ctx, p.rockLo, x + 10, y - 25, 2, 34);
    for (let band = y - 20; band < y + 8; band += 7) px(ctx, p.deepRock2, x + 4, band, 8, 1);
    // A crown of broken spikes.
    px(ctx, p.deepRock2, x + 1, y - 31, 14, 6);
    px(ctx, p.rock[2], x + 2, y - 30, 12, 4);
    for (const sx of [2, 6, 10, 13]) {
      px(ctx, p.deepRock2, x + sx, y - 37 - (sx % 3) * 2, 2, 7);
      px(ctx, p.rock[2], x + sx, y - 36 - (sx % 3) * 2, 1, 6);
    }
  },
  // A bollard or mooring post with a coil of rope (for the shore).
  post(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 13, 14, 3, 0.35);
    px(ctx, p.stand0, x + 4, y - 22, 8, 36);
    px(ctx, p.stand2, x + 5, y - 22, 6, 36);
    px(ctx, p.standHi, x + 5, y - 22, 2, 36);
    px(ctx, p.stand0, x + 9, y - 22, 2, 36);
    px(ctx, p.stand0, x + 3, y - 25, 10, 4);
    px(ctx, p.stand2, x + 4, y - 25, 8, 2);
    for (let r = -14; r < 4; r += 3) px(ctx, p.rope, x + 3, y + r, 10, 2);
    px(ctx, p.stand0, x + 3, y + 10, 10, 4);
  },
  // A natural stack of rock rising from the floor (a sea stack, cave pillar).
  rockpillar(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 13, 14, 3, 0.35);
    const tall = 34 + rnd(tx, ty, 470, 8);
    for (let row = 0; row <= tall; row++) {
      const w = Math.max(5, Math.round(12 - 3 * Math.abs(row / tall - 0.5) * 2 + (row > tall - 4 ? 2 : 0)));
      const left = x + 8 - Math.floor(w / 2);
      const py = y + 13 - tall + row;
      px(ctx, p.deepRock2, left - 1, py, w + 2, 1);
      px(ctx, pick(p.rock, hash(tx, row >> 2, 471)), left, py, w, 1);
      px(ctx, p.rim, left, py, Math.max(1, Math.floor(w / 4)), 1);
      if (row % 6 === 3) px(ctx, p.rockLo, left + 1, py, w - 2, 1);
    }
    if (p.weedFoot) for (let i = 0; i < 4; i++) px(ctx, pick(p.weedFoot, hash(tx, ty, 480 + i)), x + 3 + rnd(tx, ty, 485 + i, 10), y + 8 + (i % 3), 1, 4);
  },
  // Broken: a short stump of the same.
  stump(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 13, 14, 3, 0.35);
    px(ctx, p.stand0, x + 3, y + 10, 10, 4);
    px(ctx, p.stand0, x + 4, y - 9, 8, 20);
    px(ctx, p.stand2, x + 5, y - 8, 6, 19);
    px(ctx, p.standHi, x + 5, y - 8, 2, 19);
    px(ctx, p.stand0, x + 9, y - 8, 2, 19);
    px(ctx, p.stand2, x + 7, y - 12, 2, 4);
    px(ctx, p.rope, x + 11, y - 6, 1, 9);
    px(ctx, p.stand0, x + 11, y + 10, 5, 4);
    px(ctx, p.stand1, x + 12, y + 11, 3, 2);
  },
  jag(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 13, 14, 3, 0.35);
    px(ctx, p.deepRock2, x + 2, y + 6, 12, 8);
    px(ctx, p.deepRock2, x + 4, y - 8, 8, 16);
    px(ctx, p.deepRock2, x + 6, y - 13, 3, 6);
    px(ctx, p.rock[1], x + 3, y + 7, 10, 6);
    px(ctx, p.rock[2], x + 5, y - 7, 6, 15);
    px(ctx, p.rim, x + 5, y - 7, 2, 15);
    px(ctx, p.rock[2], x + 7, y - 12, 1, 5);
    px(ctx, p.rockLo, x + 10, y - 7, 1, 15);
  },
};

// A boulder / barrel / crate / cask / lobster pots, standing on the floor under it.
const BLOCKERS = {
  // Each one its own size and lean, sometimes with a smaller stone beside it, so a row
  // of them reads as a tumble of rocks, not a row of the same rock.
  boulder(ctx, x, y, tx, ty, room, p) {
    const rx = 5 + rnd(tx, ty, 700, 3);
    const ry = 3 + rnd(tx, ty, 701, 3);
    const cx = x + 8 + (rx < 7 ? rnd(tx, ty, 702, 3) - 1 : 0);
    const cy = y + 14 - ry - 1;
    shade(ctx, cx - rx, cy + ry - 1, rx * 2 + 1, 3, 0.3);
    oval(ctx, p.deepRock2, cx, cy, rx, ry);
    oval(ctx, pick(p.rock, hash(tx, ty, 703)), cx, cy - 1, rx - 1, ry - 1);
    px(ctx, p.rim, cx - rx + 2 + rnd(tx, ty, 704, 2), cy - ry + 1, 3 + rnd(tx, ty, 705, 3), 1);
    px(ctx, p.rim, cx - rx + 2, cy - ry + 2, 2, 1);
    px(ctx, p.rockLo, cx + 1, cy + ry - 2, rx - 1, 1);
    if (hash(tx, ty, 706) < 0.5) px(ctx, p.deepRock2, cx - 1 + rnd(tx, ty, 707, 3), cy - 1, 1, 2 + rnd(tx, ty, 708, 2));
    if (rx < 7 && hash(tx, ty, 709) < 0.6) {
      // A smaller stone fallen beside it.
      const sx = hash(tx, ty, 710) < 0.5 ? cx - rx - 1 : cx + rx + 1;
      const sy = y + 13;
      oval(ctx, p.deepRock2, sx, sy, 2, 1);
      px(ctx, pick(p.rock, hash(tx, ty, 711)), sx - 1, sy - 1, 3, 1);
    }
    if (p.weedFoot && hash(tx, ty, 712) < 0.7) {
      const wx = cx - rx + 2 + rnd(tx, ty, 713, rx);
      px(ctx, p.weedFoot[0], wx, cy - ry + 1, 3 + rnd(tx, ty, 714, 3), 2);
      px(ctx, p.weedFoot[1] ?? p.weedFoot[0], wx + 1, cy - ry + 1, 2, 1);
    }
  },
  barrel(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 12, 14, 3, 0.3);
    px(ctx, p.stand0, x + 3, y + 1, 10, 13);
    px(ctx, p.stand0, x + 2, y + 3, 12, 9);
    px(ctx, p.stand2, x + 4, y + 2, 8, 11);
    px(ctx, p.stand2, x + 3, y + 4, 10, 7);
    px(ctx, p.standHi, x + 4, y + 2, 2, 11);
    px(ctx, p.stand0, x + 9, y + 2, 1, 11);
    px(ctx, p.hoop, x + 2, y + 4, 12, 1);
    px(ctx, p.hoop, x + 2, y + 10, 12, 1);
  },
  crate(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 12, 14, 3, 0.3);
    px(ctx, p.stand0, x + 1, y + 2, 14, 12);
    px(ctx, p.stand2, x + 2, y + 3, 12, 10);
    px(ctx, p.standHi, x + 2, y + 3, 12, 1);
    px(ctx, p.stand0, x + 2, y + 7, 12, 1);
    px(ctx, p.stand0, x + 7, y + 3, 2, 10);
    px(ctx, p.hoop, x + 2, y + 3, 2, 2);
    px(ctx, p.hoop, x + 12, y + 11, 2, 2);
  },
  pots(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 12, 14, 3, 0.3);
    for (const [ox, oy] of [[1, 6], [8, 6], [4, 1]]) {
      px(ctx, p.stand0, x + ox, y + oy, 7, 7);
      px(ctx, p.stand2, x + ox + 1, y + oy + 1, 5, 5);
      for (let i = 1; i < 6; i += 2) px(ctx, p.stand0, x + ox + i, y + oy + 1, 1, 5);
      px(ctx, p.rope, x + ox + 1, y + oy, 5, 1);
    }
  },
};

// A bed or heap that blocks (F): a tangle of nets, weed, or pots.
const HEAPS = {
  weed(ctx, x, y, tx, ty, room, p, floor) {
    floor(ctx, x, y, tx, ty, room);
    shade(ctx, x + 1, y + 12, 14, 3, 0.25);
    for (let i = 0; i < 14; i++) {
      const bx = x + 1 + rnd(tx, ty, 10 + i, 14);
      const by = y + 3 + rnd(tx, ty, 30 + i, 9);
      px(ctx, pick(p.weed, hash(tx, ty, 50 + i)), bx, by, 2, 3 + rnd(tx, ty, 70 + i, 3));
    }
    px(ctx, p.weed[0], x + 2, y + 10, 12, 3);
    for (let i = 0; i < 3; i++) px(ctx, p.weedHi, x + 2 + rnd(tx, ty, 90 + i, 11), y + 4 + rnd(tx, ty, 94 + i, 6), 1, 1);
  },
  net(ctx, x, y, tx, ty, room, p, floor) {
    floor(ctx, x, y, tx, ty, room);
    shade(ctx, x + 1, y + 12, 14, 3, 0.25);
    px(ctx, p.stand0, x + 1, y + 4, 14, 9);
    px(ctx, p.net, x + 2, y + 5, 12, 7);
    for (let i = 0; i < 12; i += 3) { px(ctx, p.stand0, x + 2 + i, y + 5, 1, 7); px(ctx, p.stand0, x + 2, y + 5 + (i % 7), 12, 1); }
    px(ctx, p.float, x + 3, y + 3, 3, 3);
    px(ctx, p.float, x + 10, y + 5, 3, 3);
  },
  pots(ctx, x, y, tx, ty, room, p, floor) { floor(ctx, x, y, tx, ty, room); BLOCKERS.pots(ctx, x, y, tx, ty, room, p); },
};

// A walkable tangle of seaweed or beach grass (N), and a thorn heap of wrack (Z).
function seaGrass(ctx, x, y, tx, ty, room, p, floor) {
  floor(ctx, x, y, tx, ty, room);
  for (let i = 0; i < 7; i++) {
    const bx = x + 1 + rnd(tx, ty, 10 + i, 14);
    const by = y + 3 + rnd(tx, ty, 20 + i, 9);
    const lean = hash(tx, ty, 30 + i) < 0.5 ? -1 : 1;
    px(ctx, pick(p.weed, hash(tx, ty, 40 + i)), bx, by + 3, 1, 3);
    px(ctx, pick(p.weed, hash(tx, ty, 40 + i)), bx + lean * 0, by + 1, 1, 3);
    px(ctx, p.weedHi, bx + lean, by, 1, 2);
  }
}
function wrackHeap(ctx, x, y, tx, ty, room, p, floor) {
  floor(ctx, x, y, tx, ty, room);
  shade(ctx, x + 1, y + 12, 14, 3, 0.28);
  oval(ctx, p.deepRock2, x + 8, y + 8, 7, 5);
  for (let i = 0; i < 16; i++) {
    const bx = x + 2 + rnd(tx, ty, 10 + i, 12);
    const by = y + 3 + rnd(tx, ty, 30 + i, 9);
    px(ctx, pick(p.weed, hash(tx, ty, 50 + i)), bx, by, 2 + (i % 2), 2);
  }
  for (let i = 0; i < 5; i++) px(ctx, p.weedHi, x + 3 + rnd(tx, ty, 80 + i, 10), y + 4 + rnd(tx, ty, 90 + i, 6), 1, 1);
  // A bleached stick and a shell caught in it.
  px(ctx, p.driftwood, x + 3 + rnd(tx, ty, 100, 6), y + 5, 8, 1);
  if (hash(tx, ty, 101) < 0.5) px(ctx, '#e8d8c8', x + 5 + rnd(tx, ty, 102, 6), y + 8, 2, 2);
}

// A hedgerow gone wild (Z, in an area whose `Z` is 'hedge': the Sunken Lanes). It joins its Z
// neighbours into one long row, but nobody has clipped it in years: its top is a lumpy line of
// leaf clumps (the bumps run on from tile to tile, so a long row never repeats), its ends curl
// down round, sprigs stick up out of it, and weed is caught in its foot where the flood has been.
function hedgeRow(ctx, x, y, tx, ty, room, p, floor) {
  floor(ctx, x, y, tx, ty, room);
  const l = at(room, tx, ty, -1, 0) === 'Z';
  const r = at(room, tx, ty, 1, 0) === 'Z';
  const up = at(room, tx, ty, 0, -1) === 'Z';
  const down = at(room, tx, ty, 0, 1) === 'Z';
  const dark = p.hedgeLo ?? '#1a2e1c';
  const mid = p.hedge ?? '#2a4a28';
  // How far down the top sits at a pixel column: smooth bumps about 6 px apart and up to
  // 4 px deep, worked out from the column's place in the room so they run on across tiles.
  const bump = (wx, salt = 131, size = 7, depth = 6) => {
    const f = wx / size, i = Math.floor(f), u = f - i, s = u * u * (3 - 2 * u);
    const a = hash(i, ty, salt), b = hash(i + 1, ty, salt);
    return Math.round((a + (b - a) * s) * depth);
  };
  // The foot is ragged too: leaves hang lower in places.
  const feet = [];
  for (let i = 0; i < 16; i++) feet.push(down ? y + 16 : y + 12 + bump(tx * 16 + i, 133, 5, 2));
  const tops = [];
  for (let i = 0; i < 16; i++) {
    // Distance in from an open end of the row (9 if the row runs on that side).
    const end = Math.min(l ? 9 : i, r ? 9 : 15 - i);
    tops.push(end < 1 ? null : up ? y : y + 1 + bump(tx * 16 + i) + (end === 1 ? 5 : end === 2 ? 2 : end === 3 ? 1 : 0));
  }
  const bottom = down ? y + 16 : y + 14;
  if (!down) shade(ctx, x + (l ? 0 : 2), y + 13, 16 - (l ? 0 : 2) - (r ? 0 : 2), 3, 0.45);
  for (let i = 0; i < 16; i++) {
    const top = tops[i];
    if (top == null) continue;
    px(ctx, dark, x + i, top, 1, feet[i] - top);
    const body = up ? top : top + 3;
    px(ctx, mid, x + i, body, 1, Math.max(0, (down ? y + 16 : feet[i] - 2) - body));
    if (!up) {
      // The sunlit crown of each clump, and the shadow where it turns down into the face.
      px(ctx, p.weed[1], x + i, top, 1, 3);
      const crest = (tops[i - 1] ?? top + 1) >= top && (tops[i + 1] ?? top + 1) >= top;
      if (crest) px(ctx, p.weedHi, x + i, top, 1, 1);
      px(ctx, dark, x + i, top + 3, 1, 1);
      // Where two clumps meet, a dark cleft runs down between them.
      const wx = tx * 16 + i;
      if (wx % 7 === 0 && hash(wx / 7, ty, 131) > 0.55) px(ctx, dark, x + i, top, 1, 6);
    }
  }
  // Leaves: specks of light and dark down its face, and darker hollows between clumps.
  for (let i = 0; i < 14; i++) {
    const c = 1 + rnd(tx, ty, 10 + i, 13);
    const top = tops[c] ?? tops[8];
    const by = top + 4 + rnd(tx, ty, 30 + i, Math.max(1, y + 9 - top));
    if (by >= bottom - 2) continue;
    px(ctx, i % 3 ? p.weed[0] : p.weed[1], x + c, by, 2, 1);
    if (i % 4 === 0) px(ctx, p.turfLo, x + c, by + 1, 1, 1);
  }
  for (let i = 0; i < 2; i++) {
    const c = 2 + rnd(tx, ty, 140 + i, 10);
    const top = tops[c] ?? tops[8];
    px(ctx, dark, x + c, top + 6 + rnd(tx, ty, 142 + i, 3), 3, 1);
  }
  // Sprigs poking up out of the top.
  if (!up) {
    for (let i = 0; i < 2; i++) {
      if (hash(tx, ty, 150 + i) < 0.4) continue;
      const c = 2 + rnd(tx, ty, 152 + i, 12);
      if (tops[c] == null) continue;
      px(ctx, p.weed[0], x + c, tops[c] - 2, 1, 2);
      px(ctx, p.weedHi, x + c, tops[c] - 2, 1, 1);
    }
  }
  // Its foot, ragged with leaves, and a bit of weed the flood left in it.
  if (!down) {
    for (let i = 0; i < 16; i++) if (tops[i] != null) px(ctx, p.turfLo, x + i, feet[i], 1, 1);
    if (hash(tx, ty, 120) < 0.5) px(ctx, p.weedFoot?.[0] ?? p.weed[2], x + 3 + rnd(tx, ty, 121, 8), y + 12, 3, 2);
  }
}

// Barnacled rock mass (x, solid), coral on the beach, sea-glass in the Soundings.
const MASSES = {
  barnacle(ctx, x, y, tx, ty, room, p, floor) {
    floor(ctx, x, y, tx, ty, room);
    shade(ctx, x + 1, y + 12, 14, 3, 0.3);
    oval(ctx, p.deepRock2, x + 8, y + 7, 8, 7);
    oval(ctx, p.rock[0], x + 8, y + 7, 7, 6);
    mottle(ctx, p.rock[2], x, y, tx, ty, 3, 8);
    for (let i = 0; i < 12; i++) {
      const bx = x + 2 + rnd(tx, ty, 10 + i, 12);
      const by = y + 2 + rnd(tx, ty, 30 + i, 10);
      px(ctx, '#d8d6c8', bx, by, 2, 1);
      px(ctx, p.deepRock2, bx, by + 1, 2, 1);
    }
    px(ctx, p.rim, x + 4, y + 2, 5, 1);
  },
  coral(ctx, x, y, tx, ty, room, p, floor) {
    floor(ctx, x, y, tx, ty, room);
    shade(ctx, x + 1, y + 12, 14, 3, 0.25);
    const hue = pick(p.coral, hash(tx, ty, 1));
    for (let b = 0; b < 4; b++) {
      const bx = x + 2 + b * 3;
      const top = y + 1 + rnd(tx, ty, 10 + b, 6);
      px(ctx, hue[0], bx, top, 3, 13 - (top - y));
      px(ctx, hue[1], bx, top, 1, 13 - (top - y));
      px(ctx, hue[1], bx - 1, top + 2, 1, 2);
      px(ctx, hue[1], bx + 3, top + 4, 1, 2);
    }
  },
  glass(ctx, x, y, tx, ty, room, p, floor) {
    floor(ctx, x, y, tx, ty, room);
    shade(ctx, x + 1, y + 12, 14, 3, 0.3);
    oval(ctx, p.deepRock2, x + 8, y + 8, 7, 6);
    oval(ctx, p.rock[0], x + 8, y + 8, 6, 5);
    for (let i = 0; i < 4; i++) {
      const cx = x + 3 + rnd(tx, ty, 10 + i, 10);
      const h = 4 + rnd(tx, ty, 20 + i, 6);
      px(ctx, p.glow0, cx, y + 12 - h, 2, h);
      px(ctx, p.glow1, cx, y + 12 - h, 1, h);
      px(ctx, '#e8fffa', cx, y + 12 - h, 1, 1);
    }
  },
};

// A pit or open sea you can't enter (0): deep, dark, with whitecaps.
function drop(ctx, x, y, tx, ty, room, p) {
  water(ctx, x, y, tx, ty, room, p, true);
  shade(ctx, x, y, T, T, 0.22, p.shadow);
  if (hash(tx, ty, 200) < 0.2) px(ctx, p.foam, x + 2 + rnd(tx, ty, 201, 10), y + 4 + rnd(tx, ty, 202, 8), 4, 1);
}

// A walkway over water or a drop (g): boards on rope, shadowed, with posts.
function bridge(ctx, x, y, tx, ty, room, p) {
  const sideways = ['g', 'o'].includes(at(room, tx, ty, -1)) || ['g', 'o'].includes(at(room, tx, ty, 1));
  const under = at(room, tx, ty, 0, 1) === '0' || at(room, tx, ty, 0, -1) === '0' ? drop : water;
  under(ctx, x, y, tx, ty, room, p);
  const planks = p.bridge ?? p;
  GROUND.planks(ctx, x, y, tx, ty, null, planks, !sideways);
  if (sideways) {
    // Rails: a rope and its posts along the long edges, with shadow on the water.
    if (!['g', 'o'].includes(at(room, tx, ty, 0, -1))) { px(ctx, planks.gap, x, y, T, 2); px(ctx, planks.rope ?? planks.plankHi, x, y + 1, T, 1); }
    if (!['g', 'o'].includes(at(room, tx, ty, 0, 1))) { px(ctx, planks.gap, x, y + T - 2, T, 2); px(ctx, planks.rope ?? planks.plankHi, x, y + T - 3, T, 1); shade(ctx, x, y + T, T, 0, 0); }
  } else {
    if (!['g', 'o'].includes(at(room, tx, ty, -1))) { px(ctx, planks.gap, x, y, 2, T); px(ctx, planks.rope ?? planks.plankHi, x + 1, y, 1, T); }
    if (!['g', 'o'].includes(at(room, tx, ty, 1))) { px(ctx, planks.gap, x + T - 2, y, 2, T); px(ctx, planks.rope ?? planks.plankHi, x + T - 3, y, 1, T); }
  }
}

// Rope bridges on floats (an area with `floats: true`: the Beacon Isles). The long sides of a
// bridge (g) get a hand rope on short posts; the sea beside it (~) shows the cork floats that hold
// it up, every other tile, tied to its edge. At low tide the bridge lies slack on the bed (o): the
// rope lies in loops on the boards, the floats lie on their sides in the shingle (q) beside it, and
// where the bed is still sea the middle sags under the water, a rope and dark boards showing.
const BRIDGE_WALK = ['g', 'o'];
function bridgeSide(ctx, x, y, tx, ty, room, p, slack) {
  const sideways = BRIDGE_WALK.includes(at(room, tx, ty, -1)) || BRIDGE_WALK.includes(at(room, tx, ty, 1));
  if (!sideways) return;
  const rope = p.rope ?? p.plankHi;
  for (const top of [true, false]) {
    if (BRIDGE_WALK.includes(at(room, tx, ty, 0, top ? -1 : 1))) continue;
    if (slack) {
      // Lying in loops along the edge.
      const ey = top ? y + 2 : y + T - 4;
      for (let i = 0; i < T; i++) px(ctx, rope, x + i, ey + ((i + tx * 5) % 8 < 4 ? 0 : 1), 1, 1);
      if (tx % 3 === 0) { px(ctx, p.stand0, x + 5, ey - 1, 6, 3); px(ctx, p.stand2, x + 6, ey - 1, 4, 1); }
      continue;
    }
    // A short post every third tile, and the hand rope dipping between them.
    const post = tx % 3 === 0;
    const sag = [0, 1, 1][tx % 3];
    if (top) {
      if (post) { px(ctx, p.stand0, x + 6, y, 3, 6); px(ctx, p.stand2, x + 7, y, 1, 5); px(ctx, p.standHi ?? p.stand2, x + 6, y, 3, 1); }
      px(ctx, p.stand0, x, y + 2 + sag, T, 1);
      px(ctx, rope, x, y + 1 + sag, T, 1);
    } else {
      if (post) { px(ctx, p.stand0, x + 6, y + T - 8, 3, 8); px(ctx, p.stand2, x + 7, y + T - 8, 1, 7); px(ctx, p.standHi ?? p.stand2, x + 6, y + T - 8, 3, 1); }
      px(ctx, p.stand0, x, y + T - 5 + sag, T, 1);
      px(ctx, rope, x, y + T - 6 + sag, T, 1);
    }
  }
}
function bridgeFloat(ctx, x, y, tx, ty, room, p, lying) {
  const below = at(room, tx, ty, 0, 1);
  const above = at(room, tx, ty, 0, -1);
  const letter = lying ? 'o' : 'g';
  const top = below === letter;
  if (!top && above !== letter) return;
  // Only along a bridge's long side.
  const bx = top ? 1 : -1;
  const side = (dx) => at(room, tx + dx, ty + bx) === letter;
  if (!side(-1) && !side(1)) return;
  if (tx % 2) return;
  const cx = x + 8;
  const rope = p.rope ?? p.plankHi;
  const fl = p.float ?? '#d0562e';
  if (lying) {
    // On its side in the shingle, the tie slack.
    const cy = top ? y + T - 6 : y + 6;
    shade(ctx, cx - 5, cy + 2, 11, 2, 0.3, p.shadow);
    oval(ctx, p.stand0, cx, cy, 5, 2);
    oval(ctx, fl, cx, cy - 1, 4, 1);
    px(ctx, p.foam, cx - 1, cy - 2, 1, 3);
    px(ctx, rope, cx + 4, top ? cy + 2 : cy - 3, 1, 2);
    return;
  }
  // Afloat at the bridge's edge, half under, with a little foam.
  const cy = top ? y + T - 3 : y + 3;
  oval(ctx, p.stand0, cx, cy, 4, 3);
  oval(ctx, fl, cx, cy - 1, 3, 2);
  px(ctx, p.foam, cx - 1, cy - 3, 1, 4);
  px(ctx, '#ffffff60', cx - 2, cy - 2, 1, 1);
  px(ctx, rope, cx, top ? cy + 2 : cy - 4, 1, 2);
  px(ctx, p.foam, cx - 6, top ? cy - 1 : cy + 2, 3, 1);
  px(ctx, p.foam, cx + 4, top ? cy - 1 : cy + 2, 2, 1);
}
// The sea over a sunk stretch of a slack bridge: sea with boards on both sides of it in the row.
function sunkBridge(ctx, x, y, tx, ty, room, p) {
  const sunk = (sy) => at(room, tx, sy) === '~'
    && [1, 2, 3].some((k) => at(room, tx - k, sy) === 'o') && [1, 2, 3].some((k) => at(room, tx + k, sy) === 'o');
  if (!sunk(ty)) return;
  const shadowPlank = `rgba(${hexRgb(p.plankLo)}, 0.5)`;
  for (let i = 0; i < 4; i++) if ((i + tx) % 3 !== 0) px(ctx, shadowPlank, x, y + i * 4 + 1, T, 2);
  const rope = `rgba(${hexRgb(p.rope ?? p.plankHi)}, 0.65)`;
  if (!sunk(ty - 1)) px(ctx, rope, x, y + 2 + (tx % 2), T, 1);
  if (!sunk(ty + 1)) px(ctx, rope, x, y + T - 4 + (tx % 2), T, 1);
}

// A rail along a quay or a deck (f): posts and a rope or rail.
function rail(ctx, x, y, tx, ty, room, p, floor) {
  floor(ctx, x, y, tx, ty, room);
  const sideways = at(room, tx, ty, -1) === 'f' || at(room, tx, ty, 1) === 'f';
  shade(ctx, x, y + 12, T, 3, 0.25);
  if (sideways || (at(room, tx, ty, 0, -1) !== 'f' && at(room, tx, ty, 0, 1) !== 'f')) {
    px(ctx, p.stand0, x, y + 5, T, 3);
    px(ctx, p.stand2, x, y + 5, T, 1);
    for (const fx of [0, 11]) { px(ctx, p.stand0, x + fx, y + 2, 4, 12); px(ctx, p.stand2, x + fx + 1, y + 3, 2, 10); }
  } else {
    px(ctx, p.stand0, x + 6, y, 3, T);
    px(ctx, p.stand2, x + 7, y, 1, T);
    px(ctx, p.stand0, x + 5, y + 8, 5, 5);
  }
}

// A raised ledge (b 12 px, B 24 px): cut or fallen blocks of the area's stone.
function blockOf(raise, look) {
  return (ctx, x, y, tx, ty, room, floor) => {
    floor(ctx, x, y, tx, ty, room);
    const top = y - raise;
    const raiseAt = (dx, dy) => ({ b: 12, B: 24 }[at(room, tx, ty, dx, dy)] ?? 0);
    // Face.
    px(ctx, look.faceBase, x, top + T, T, raise);
    for (let row = 0; row * 4 < raise; row++) {
      const off = (row + tx) % 2 ? 4 : 0;
      for (let bx = -off; bx < T; bx += 8) {
        const left = Math.max(0, bx);
        const width = Math.min(bx + 7, T) - left;
        if (width > 0) {
          px(ctx, pick(look.bricks, hash(tx * 3 + bx, ty * 5 + row, 31)), x + left, top + T + row * 4 + 1, width, 3);
          px(ctx, look.brickHi, x + left, top + T + row * 4 + 1, width, 1);
        }
      }
    }
    if (look.weed && isSea(at(room, tx, ty, 0, 1))) for (let i = 0; i < 4; i++) px(ctx, look.weed, x + rnd(tx, ty, 80 + i, 15), top + T + raise - 4 + rnd(tx, ty, 84 + i, 3), 1, 3);
    px(ctx, look.outline, x, y + T - 1, T, 1);
    // Top (outdoors with the blend pass on: one colour per pair of tiles, so a long ledge isn't a checkerboard).
    px(ctx, pick(look.tops, blendOn(room) ? hash(tx >> 1, ty >> 1, 33) : hash(tx, ty, 33)), x, top, T, T);
    if (hash(tx, ty, 34) < 0.5) px(ctx, look.seam, x + 7, top + 1, 1, T - 2);
    if (hash(tx, ty, 35) < 0.4) px(ctx, look.seam, x + 1, top + 9, T - 2, 1);
    if (hash(tx, ty, 36) < 0.3) px(ctx, look.fleck, x + 3 + rnd(tx, ty, 37, 9), top + 3 + rnd(tx, ty, 38, 8), 2, 1);
    if (raiseAt(0, 1) < raise) px(ctx, look.lit, x, top + T - 1, T, 1);
    if (raiseAt(0, -1) < raise) px(ctx, look.outline, x, top, T, 1);
    if (raiseAt(-1, 0) < raise) px(ctx, look.outline, x, top, 1, T + raise);
    if (raiseAt(1, 0) < raise) px(ctx, look.outline, x + T - 1, top, 1, T + raise);
  };
}

// A raised ledge of natural rock (b 12 px, B 24 px), for a room with `ledges: 'rock'`
// (the Cliff Cave's shelf): the area's own rock, rough-edged, the top worn and pitted,
// the face in wavy beds of sandstone with cracks, weed at its foot and a shell or two.
// Same heights and solidity as any b or B; only the look. Edges are ragged only where
// the ledge ends (a lower neighbour), so a run of tiles reads as one shelf.
function rockLedgeOf(raise, p, smoothTop = false) {
  // The face in shadow (darker beds), the top in the light (paler, worn smooth).
  const beds = [p.rock[0], p.rock[3], p.rock[1], p.deepRock, p.rock[3], p.rock[2], p.deepRock];
  const tops = [p.rim, p.rock[2], p.rim, p.streak ?? p.rim];
  return (ctx, x, y, tx, ty, room, floor) => {
    floor(ctx, x, y, tx, ty, room);
    const top = y - raise;
    const H = T + raise;
    const raiseAt = (dx, dy) => ({ b: 12, B: 24 }[at(room, tx, ty, dx, dy)] ?? 0);
    const openL = raiseAt(-1, 0) < raise;
    const openR = raiseAt(1, 0) < raise;
    const openU = raiseAt(0, -1) < raise;
    const openD = raiseAt(0, 1) < raise;
    const wx0 = tx * T;
    const wy0 = ty * T - raise;
    // How far each ragged edge comes in: smooth bumps, not noise.
    const bump = (v, salt) => Math.max(0, Math.round(1.2 + Math.sin(v * 0.55 + salt) * 1.1 + Math.sin(v * 1.7 + salt * 2) * 0.6));
    // Against the cave wall the rock runs straight into it (nothing to see behind), in
    // a ragged band of shadow; only where it ends over open floor is its edge ragged.
    const wallL = isWallish(at(room, tx, ty, -1, 0));
    const wallR = isWallish(at(room, tx, ty, 1, 0));
    const wallU = isWallish(at(room, tx, ty, 0, -1));
    const inL = (r) => (openL && !wallL ? bump(wy0 + r, tx * 0.7 + 1) : 0);
    const inR = (r) => (openR && !wallR ? bump(wy0 + r, tx * 0.9 + 4) : 0);
    const inU = (c) => (openU && !wallU ? bump(wx0 + c, ty * 0.8 + 2) : 0);
    const dark = (c, r) => (openL && wallL && c <= bump(wy0 + r, tx * 0.7 + 1))
      || (openR && wallR && c >= T - 1 - bump(wy0 + r, tx * 0.9 + 4))
      || (openU && wallU && r <= 1 + bump(wx0 + c, ty * 0.8 + 2));
    // The front lip wanders a pixel up and down; the face starts under it.
    const lipAt = (c) => T - 1 + (openD ? Math.round(Math.sin((wx0 + c) * 0.45 + ty) * 0.9) : 1);
    // In the rock? Off this tile's sides it is the neighbour's rock unless the ledge ends there.
    const inside = (c, r) => {
      if (c < 0) return !openL;
      if (c >= T) return !openR;
      if (r < 0) return !openU;
      return r < H && c >= inL(r) && c <= T - 1 - inR(r) && r >= inU(c);
    };
    for (let r = 0; r < H; r++) {
      let runColor = null;
      let runStart = 0;
      const flush = (end) => { if (runColor) px(ctx, runColor, x + runStart, top + r, end - runStart, 1); };
      for (let c = 0; c <= T; c++) {
        let color = null;
        if (c < T && inside(c, r)) {
          const wx = wx0 + c;
          const wy = wy0 + r;
          const lip = lipAt(c);
          const edge = !inside(c - 1, r) || !inside(c + 1, r) || !inside(c, r - 1);
          if (edge) color = p.deepRock2;
          else if (r === H - 1 && openD) color = p.deepRock2;
          else if (dark(c, r)) color = (c + r) % 3 ? p.rockLo : p.deepRock;
          else if (r < lip) {
            // The top: worn patches, pits, a lit front edge.
            // Big soft patches (a wavy grain across the shelf), a few pits.
            if (smoothTop) {
              // Soft patches of three tones, dithered where they meet (no stripes down a long ledge).
              const n = softNoise(wx / 9, wy / 9, 955) * 0.7 + softNoise(wx / 4, wy / 4, 956) * 0.3 + (DITHER[(wy & 3) * 4 + (wx & 3)] / 16 - 0.5) * 0.08;
              color = n < 0.4 ? p.rock[2] : n < 0.62 ? p.rim : (p.streak ?? p.rim);
            } else {
              const grain = Math.floor((wy + Math.sin(wx * 0.21) * 3 + Math.sin(wx * 0.07 + wy * 0.1) * 4) / 5);
              color = tops[Math.floor(hash(grain, wx >> 3, 951) * tops.length)];
            }
            if (hash(wx >> 1, wy >> 1, 952) < 0.008) color = p.rockLo;
            if (openD && r === lip - 1) color = p.fleck;
          } else if (r === lip && openD) color = p.deepRock2;
          else if (r === lip + 1 && openD) color = p.rockLo; // the overhang's shadow
          else {
            // The face: beds of sandstone, wavy, darker toward the foot.
            const d = r - lip;
            const wave = Math.round(Math.sin(wx * 0.3 + ty * 1.3) * 1.2 + Math.sin(wx * 0.11) * 1.5);
            const bed = Math.floor((d + wave + 40) / 4);
            color = beds[(bed + tx * 3 + ty) % beds.length];
            if ((d + wave + 40) % 4 === 0 && hash(wx, bed, 953) < 0.6) color = p.rockLo;
            if (d > raise - 4) color = (d + c) % 2 ? p.deepRock : p.rockLo;
          }
        }
        if (color !== runColor) {
          flush(c);
          runColor = color;
          runStart = c;
        }
      }
      flush(T);
    }
    // A crack or two down the face, lit on one side.
    if (openD) {
      for (let k = 0; k < 2; k++) {
        if (hash(tx, ty, 960 + k) > 0.55) continue;
        const cx = 3 + rnd(tx, ty, 962 + k, 10);
        const len = 4 + rnd(tx, ty, 964 + k, raise - 6);
        const y0 = top + lipAt(cx) + 2;
        for (let i = 0; i < len; i++) {
          const jx = cx + (i > len / 2 ? (hash(tx, ty, 966 + k) < 0.5 ? -1 : 1) : 0);
          px(ctx, p.deepRock2, x + jx, y0 + i, 1, 1);
          px(ctx, p.rim, x + jx + 1, y0 + i, 1, 1);
        }
      }
    }
    // On top: a pebble, a shell, a scrap of dried weed.
    if (hash(tx, ty, 970) < 0.22) {
      const sx = x + 3 + rnd(tx, ty, 971, 9);
      const sy = top + 3 + rnd(tx, ty, 972, 8);
      px(ctx, pick(p.shells, hash(tx, ty, 973)), sx, sy, 2, 1);
      px(ctx, p.fleck, sx, sy - 1, 1, 1);
      px(ctx, p.rockLo, sx, sy + 1, 2, 1);
    }
    if (hash(tx, ty, 974) < 0.18) {
      const sx = x + 2 + rnd(tx, ty, 975, 11);
      const sy = top + 4 + rnd(tx, ty, 976, 8);
      px(ctx, p.rockLo, sx, sy + 1, 3, 1);
      px(ctx, pick(p.rock, hash(tx, ty, 977)), sx, sy, 3, 1);
    }
    // Weed and a shell in the damp at the foot of the face.
    if (openD) {
      const foot = top + H - 2;
      for (let i = 0; i < 3; i++) {
        if (hash(tx, ty, 980 + i) < 0.4) continue;
        const wx = x + 2 + rnd(tx, ty, 983 + i, 12);
        const tall = 2 + rnd(tx, ty, 986 + i, 3);
        px(ctx, pick(p.weed, hash(tx, ty, 989 + i)), wx, foot - tall + 1, 1, tall);
        if (tall > 2) px(ctx, p.weedHi, wx, foot - tall + 1, 1, 1);
      }
      if (hash(tx, ty, 992) < 0.35) {
        const sx = x + 4 + rnd(tx, ty, 993, 8);
        px(ctx, pick(p.shells, hash(tx, ty, 994)), sx, foot - 1, 2, 2);
        px(ctx, p.fleck, sx, foot - 1, 1, 1);
      }
    }
  };
}

// A hanging thing (v, you walk under): kelp-like ropes and weed in the storm, stalactites in the cave.
function hanging(ctx, x, y, tx, ty, room, p) {
  if (p.hangKind === 'rock') {
    const tall = 16 + rnd(tx, ty, 460, 10);
    const top = y - T + 2;
    const lean = hash(tx, ty, 461) < 0.5 ? -1 : 1;
    for (let row = 0; row < tall; row++) {
      const w = Math.max(1, Math.round(9 * (1 - row / tall)));
      const left = x + 8 - Math.floor(w / 2) + (row > tall * 0.6 ? lean : 0);
      px(ctx, p.deepRock2, left - 1, top + row, w + 2, 1);
      px(ctx, row > tall - 4 ? p.glow1 ?? p.rim : pick(p.rock, hash(tx, row, 462)), left, top + row, w, 1);
      if (w > 2) px(ctx, p.rim, left, top + row, 1, 1);
    }
    return;
  }
  // Ropes, nets and weed hung from a rail or a rafter.
  const top = y - T + 2;
  for (let i = 0; i < 4; i++) {
    const hx = x + 2 + i * 4 + rnd(tx, ty, 10 + i, 2);
    const len = 8 + rnd(tx, ty, 20 + i, 14);
    for (let r = 0; r < len; r++) px(ctx, r % 5 === 4 ? p.weedHi : pick(p.weed, hash(tx, ty, 30 + i)), hx + (r > len * 0.6 ? 1 : 0), top + r, 1 + (r % 6 === 0 ? 1 : 0), 1);
  }
}

// =====================================================================
// Merrow, the drowned town: dressed stone and cobbles under clear green
// water, limewashed houses with the tide's stain on them, slate roofs you
// jump across (b and B), chimneys, bollards and a spire. Its pieces are
// below; the config is AREAS.merrow.
// =====================================================================
// Cobbles with green weed growing in the joints.
GROUND.townCobbles = (ctx, x, y, tx, ty, room, p) => {
  GROUND.cobbles(ctx, x, y, tx, ty, null, p);
  // Weed in the joints between the cobbles (the same joints GROUND.cobbles laid).
  for (let row = ty * 2; row < ty * 2 + 2; row++) {
    for (const [ci, c0, c1] of piecesIn(row, 61, 6, 11, tx * T, tx * T + T)) {
      const jx = c1 - 1 - tx * T;
      if (jx < 0 || jx >= T || hash(row, ci, 300) > 0.55) continue;
      const jy = y + (row - ty * 2) * 8 + 1 + rnd(row, ci, 301, 4);
      px(ctx, pick(p.jointWeed, hash(row, ci, 302)), x + jx, jy, 1, 2 + rnd(row, ci, 303, 3));
      if (hash(row, ci, 304) < 0.4) px(ctx, p.jointWeedHi, x + jx, jy, 1, 1);
    }
  }
  if (hash(tx, ty, 305) < 0.35) px(ctx, p.jointWeed[0], x + rnd(tx, ty, 306, 14), y + 7, 3, 1);
  edges(ctx, x, y, tx, ty, room, p);
};
// Big squared flagstones, paler than the street.
GROUND.townFlags = (ctx, x, y, tx, ty, room, p) => {
  GROUND.flags(ctx, x, y, tx, ty, room, p.flagP);
  if (hash(tx, ty, 310) < 0.25) px(ctx, p.jointWeed[1], x + rnd(tx, ty, 311, 12), y + 7 + rnd(tx, ty, 312, 2) * 8 - 1, 2, 1);
};
// Granite setts: small oblong blocks in close rows, bluer than the cobbles.
GROUND.setts = (ctx, x, y, tx, ty, room, p) => {
  px(ctx, p.settGap, x, y, T, T);
  for (let r = 0; r < 4; r++) {
    const wy = ty * 4 + r;
    const start = -((tx * T + (wy % 2 ? 3 : 0)) % 6);
    for (let bx = start; bx < T; bx += 6) {
      const sx = Math.max(0, bx);
      const w = Math.min(bx + 6, T) - sx;
      if (w < 2) continue;
      const wx = tx * T + bx;
      px(ctx, pick(p.sett, hash(wx, wy, 341)), x + sx, y + r * 4, w - 1, 3);
      px(ctx, p.settHi, x + sx, y + r * 4, w - 1, 1);
    }
  }
  if (hash(tx, ty, 342) < 0.3) px(ctx, p.jointWeed[0], x + rnd(tx, ty, 343, 13), y + 3 + rnd(tx, ty, 344, 3) * 4, 2, 1);
  glints(ctx, x, y, tx, ty, p, 0.35);
  edges(ctx, x, y, tx, ty, room, p);
};

// Clear dark bottle-green water with the drowned street showing through it.
function clearWater(ctx, x, y, tx, ty, room, p) {
  px(ctx, p.water, x, y, T, T);
  // The drowned street: cobbles, a few gone, all of it fading in and out of the deep.
  const f = tileBrush(ctx, x, y, tx, ty);
  for (let row = ty * 2; row < ty * 2 + 2; row++) {
    for (const [ci, c0, c1] of piecesIn(row, 51, 6, 11, tx * T, tx * T + T)) {
      if (hash(row, ci, 350) < 0.12) continue;
      const lift = hash(row, ci, 349) < 0.3 ? 1 : 0;
      f(pick(p.under, hash(row, ci, 351)), c0 + 1, row * 8 + 1 + lift, c1 - c0 - 1, 6 - lift);
      f(p.underHi, c0 + 2, row * 8 + 1 + lift, Math.max(1, c1 - c0 - 3), 1);
    }
  }
  // Now and then a strand of weed standing up off the bottom, or a lost thing on it.
  const roll = hash(tx, ty, 352);
  if (roll < 0.14) {
    const wx = x + 3 + rnd(tx, ty, 353, 10);
    const wy = y + 4 + rnd(tx, ty, 354, 6);
    px(ctx, p.underWeed, wx, wy, 1, 5);
    px(ctx, p.underWeed, wx + 1, wy - 2, 1, 3);
  } else if (roll < 0.17) {
    px(ctx, p.underThing, x + 4 + rnd(tx, ty, 355, 8), y + 6 + rnd(tx, ty, 356, 6), 3, 2);
  }
  // Deeper and shallower in big soft stretches that run across the tiles (4 px at a time, dithered).
  const depthAt = (wx, wy) => softNoise(wx / 52, wy / 40, 371) * 0.7 + softNoise(wx / 17, wy / 13, 372) * 0.3;
  for (let by = 0; by < T; by += 4) for (let bx = 0; bx < T; bx += 4) {
    const dpt = depthAt(tx * T + bx + 2, ty * T + by + 2);
    const a = Math.max(0, Math.min(0.55, (dpt - 0.3) * 1.1 + (DITHER[((by >> 2) & 3) * 4 + ((bx >> 2) & 3)] / 16 - 0.5) * 0.06));
    if (a > 0.03) shade(ctx, x + bx, y + by, 4, 4, a.toFixed(2), p.deepRgb);
  }
  // Light through the surface: a net of bright lines where two slow swells cross, brightest in the shallow stretches.
  const lightRgb = hexRgb(p.shallowHi ?? p.wave);
  for (let ly = 0; ly < T; ly++) for (let lx = 0; lx < T; lx++) {
    const wx = tx * T + lx;
    const wy = ty * T + ly;
    const d = Math.abs(softNoise(wx / 9, wy / 7, 373) - softNoise(wx / 8 + 3.1, wy / 9 + 1.7, 374));
    if (d > 0.05) continue;
    const a = (0.05 - d) * 14 * (1.2 - depthAt(wx, wy));
    if (a > 0.06) shade(ctx, x + lx, y + ly, 1, 1, Math.min(0.5, a).toFixed(2), lightRgb);
  }
  // Weed torn loose, drifting just under the surface.
  if (hash(tx, ty, 375) < 0.08) {
    const wx = x + 1 + rnd(tx, ty, 376, 5);
    const wy = y + 3 + rnd(tx, ty, 377, 9);
    for (let k = 0; k < 9; k++) px(ctx, k % 4 === 3 ? p.jointWeedHi ?? p.underWeed : p.underWeed, wx + k, wy + Math.round(Math.sin((k + tx) * 0.9)), 1, 1);
  }
  for (let i = 0; i < 2; i++) {
    const wy = y + 3 + i * 7 + rnd(tx, ty, 360 + i, 3);
    const wx = x + rnd(tx, ty, 362 + i, 9);
    const len = 3 + rnd(tx, ty, 364 + i, 5);
    px(ctx, p.wave, wx, wy, len, 1);
    shade(ctx, wx + 1, wy + 1, len, 1, 0.5, p.deepRgb);
  }
  if (hash(tx, ty, 366) < p.caps) px(ctx, p.foam, x + 3 + rnd(tx, ty, 367, 10), y + 4 + rnd(tx, ty, 368, 8), 2, 1);
  waterBanks(ctx, x, y, tx, ty, room, p);
}

// Shallows over the cobbles: the street itself, under a skin of green water.
function shallowCobbles(ctx, x, y, tx, ty, room, p) {
  GROUND.cobbles(ctx, x, y, tx, ty, null, p);
  shade(ctx, x, y, T, T, 0.42, p.shallowTint);
  for (let i = 0; i < 2; i++) {
    const wy = y + 3 + i * 7 + rnd(tx, ty, 370 + i, 3);
    px(ctx, p.shallowHi, x + rnd(tx, ty, 372 + i, 8), wy, 4 + rnd(tx, ty, 374 + i, 4), 1);
  }
  if (hash(tx, ty, 376) < 0.2) px(ctx, p.foam, x + 2 + rnd(tx, ty, 377, 10), y + 2 + rnd(tx, ty, 378, 10), 2, 1);
  if (room && ![';', 'j'].includes(at(room, tx, ty, 0, -1)) && !softEdge(room, tx, ty, 0, -1)) shade(ctx, x, y, T, 2, 0.2, p.shadow);
}

// A stair of dressed stone (an area with `stair: 'dressed'`: Merrow and the Lanes), in the
// area's own stone instead of the mountain's pale steps. Two treads a tile; each tread is
// its own few blocks, joints staggered, worn hollow in the middle where feet went. Going up
// (a wall or more stair above the run's top) each tread shows its riser below it; going
// down into the water (water under the run's foot) each tread drops into the shadow of the
// next and the lower treads are wet, green and then under the water's skin. Low kerbs
// where the stair meets anything else.
function dressedStair(ctx, x, y, tx, ty, room, p) {
  const stones = p.ashlar ?? p.rock;
  const hi = p.ashlarHi ?? p.rim;
  const lo = p.ashlarLo ?? p.rockLo;
  let foot = ty;
  while (room && at(room, tx, foot, 0, 1) === 's') foot++;
  const below = room ? at(room, tx, foot, 0, 1) : null;
  const down = isSea(below) || below === ';';
  // How far down the run this tile is (0 at its top), for the wet lower treads.
  let head = ty;
  while (room && at(room, tx, head, 0, -1) === 's') head--;
  const run = foot - head + 1;
  px(ctx, p.mortar ?? p.deepRock2, x, y, T, T);
  for (let step = 0; step < 2; step++) {
    const sy = y + step * 8;
    const n = (ty - head) * 2 + step;
    const deep = down ? n / (run * 2 - 1) : 0;
    // The tread: blocks with staggered joints.
    const start = -(((tx * T) + (n % 2 ? 5 : 0)) % 10);
    for (let bx = start; bx < T; bx += 10) {
      const sx = Math.max(0, bx);
      const w = Math.min(bx + 10, T) - sx;
      if (w < 1) continue;
      px(ctx, pick(stones, hash(tx * T + bx, ty * 2 + step, 450)), x + sx, sy, w - 1, down ? 7 : 5);
    }
    // The worn nosing: lit, except where it's hollowed in the middle of the flight.
    for (let i = 0; i < T; i++) {
      const worn = Math.abs(((tx * T + i) % 48) - 24) < 6 && hash(tx * T + i, n, 451) < 0.7;
      px(ctx, worn ? lo : hi, x + i, sy, 1, 1);
    }
    if (down) {
      // The drop to the next tread down, in its shadow.
      px(ctx, p.deepRock2, x, sy + 7, T, 1);
      shade(ctx, x, sy + 5, T, 2, 0.25, p.shadow);
    } else {
      // The riser below the tread, darker, and a line of grime at its foot.
      px(ctx, lo, x, sy + 5, T, 3);
      px(ctx, p.deepRock2, x, sy + 7, T, 1);
      for (let i = 0; i < T; i += 5) if (hash(tx * 5 + i, n, 452) < 0.4) px(ctx, p.streak ?? hi, x + i + rnd(tx, n, 453 + i, 4), sy + 5, 1, 2);
    }
    // Weed in the joints, more of it the lower (and wetter) the tread.
    if (hash(tx, n, 454) < 0.3 + deep * 0.5) px(ctx, pick(p.weedFoot ?? p.weed, hash(tx, n, 455)), x + rnd(tx, n, 456, 13), sy + (down ? 6 : 4), 2 + rnd(tx, n, 457, 2), 1);
    // Down into the water: the lower treads go green, then under the water's skin.
    if (down && deep > 0.45) shade(ctx, x, sy, T, 8, Math.min(0.55, (deep - 0.45) * 1.1), p.tideStain ?? p.wetShade ?? p.shadow);
    if (down && deep > 0.8) {
      shade(ctx, x, sy, T, 8, 0.35, p.shallowTint ?? '40, 110, 90');
      px(ctx, p.shallowHi ?? p.wave, x + rnd(tx, n, 458, 8), sy + 2 + rnd(tx, n, 459, 3), 3 + rnd(tx, n, 460, 3), 1);
    }
  }
  if (!room) return;
  // Kerbs where the stair meets anything else.
  for (const side of [-1, 1]) {
    if (at(room, tx, ty, side, 0) === 's') continue;
    const kx = side < 0 ? x : x + T - 2;
    px(ctx, lo, kx, y, 2, T);
    px(ctx, side < 0 ? hi : p.deepRock2, side < 0 ? kx : kx + 1, y, 1, T);
  }
}

// Dressed stone: long blocks in courses, a lit top edge, the tide's green on the bottom course.
WALLS.ashlar = (ctx, x, y, tx, ty, room, p) => {
  px(ctx, p.mortar, x, y, T, T);
  for (let r = 0; r < 2; r++) {
    const wy = ty * 2 + r;
    const start = -((tx * T + (wy % 2 ? 6 : 0)) % 12);
    for (let bx = start; bx < T; bx += 12) {
      const sx = Math.max(0, bx);
      const w = Math.min(bx + 12, T) - sx;
      if (w < 1) continue;
      const by = y + r * 8;
      px(ctx, pick(p.ashlar, hash(tx * T + bx, wy, 380)), x + sx, by, w - 1, 7);
      px(ctx, p.ashlarHi, x + sx, by, w - 1, 1);
      if (bx >= 0) px(ctx, p.ashlarHi, x + sx, by, 1, 7);
      px(ctx, p.ashlarLo, x + sx, by + 6, w - 1, 1);
      // Tooling marks.
      if (hash(tx * T + bx, wy, 381) < 0.5) px(ctx, p.ashlarLo, x + sx + 2 + rnd(tx, wy, 382, Math.max(1, w - 4)), by + 3, 2, 1);
    }
  }
  for (let i = 0; i < 2; i++) if (hash(tx, ty, 383 + i) < 0.4) px(ctx, p.streak, x + 2 + rnd(tx, ty, 385 + i, 12), y + rnd(tx, ty, 387 + i, 6), 1, 4 + rnd(tx, ty, 389 + i, 6));
  if (!room) return;
  const down = at(room, tx, ty, 0, 1);
  if (down != null && !isWallish(down)) {
    shade(ctx, x, y + 9, T, 7, 0.35, p.tideStain);
    px(ctx, p.tideLine, x, y + 9, T, 1);
    if (isSea(down) && p.weedFoot) for (let i = 0; i < 6; i++) px(ctx, pick(p.weedFoot, hash(tx, ty, 391 + i)), x + rnd(tx, ty, 397 + i, 15), y + 12 + rnd(tx, ty, 403 + i, 3), 1, 2 + (i % 2));
  }
  const left = at(room, tx, ty, -1, 0);
  const right = at(room, tx, ty, 1, 0);
  if (left != null && !isWallish(left)) shade(ctx, x, y, 2, T, 0.3, hexRgb(p.ashlarHi));
  if (right != null && !isWallish(right)) shade(ctx, x + T - 2, y, 2, T, 0.4);
};

// Narrow town houses: limewash gone green-grey where the water sat, quoins, slate, dark windows.
const isHouse = (c) => c != null && '5678'.includes(c);
function townHouse(room, tx, ty) {
  let ex = tx;
  while (ex > 0 && isHouse(at(room, ex - 1, ty))) ex--;
  let top = ty;
  while (top > 0 && isHouse(at(room, tx, top - 1)) && at(room, tx, top - 1) !== '7') top--;
  // Every three tiles of a terrace is its own house.
  const idx = Math.floor((tx - ex) / 3);
  return { ex, top, idx, first: (tx - ex) % 3 === 0 };
}
const TOWN = {
  wall(ctx, x, y, tx, ty, room, p) {
    const h = room ? townHouse(room, tx, ty) : { ex: tx, top: ty, idx: 0, first: false };
    const c = p.houses[Math.floor(hash(h.ex + h.idx * 3, h.top, 777) * p.houses.length)];
    px(ctx, c, x, y, T, T);
    mottle(ctx, p.plasterHi, x, y, tx, ty, 410, 6);
    if (hash(tx, ty, 412) < 0.6) mottle(ctx, p.plasterLo, x, y, tx, ty, 413, 4);
    // Hairline cracks, and here and there the plaster fallen off the stone.
    if (hash(tx, ty, 415) < 0.2) { let cx = 3 + rnd(tx, ty, 416, 9); for (let cy = 2; cy < 9; cy++) { px(ctx, p.plasterLo, x + cx, y + cy); cx += hash(tx, ty, 417 + cy) < 0.5 ? 1 : -1; } }
    if (hash(tx, ty, 425) < 0.12) { const bx = x + 2 + rnd(tx, ty, 426, 8); const by = y + 2 + rnd(tx, ty, 427, 6); px(ctx, p.ashlarLo, bx, by, 6, 4); px(ctx, p.ashlar[0], bx + 1, by + 1, 4, 1); px(ctx, p.ashlar[1], bx + 1, by + 3, 4, 1); }
    // Quoins up the corners of each house, and a downpipe between neighbours.
    const corner = (right) => { for (let q = 0; q < 4; q++) { const wide = (ty * 4 + q) % 2 ? 4 : 2; px(ctx, q % 2 ? p.quoin : p.quoinHi, x + (right ? T - wide : 0), y + q * 4, wide, 3); } };
    if (room && !isHouse(at(room, tx - 1, ty))) corner(false);
    if (room && !isHouse(at(room, tx + 1, ty))) corner(true);
    if (room && h.first && tx > h.ex) { px(ctx, p.pipe, x, y, 2, T); px(ctx, p.pipeHi, x, y, 1, T); if ((ty % 2) === 0) px(ctx, p.pipe, x, y + 6, 3, 1); }
    // The tide: the bottom of the wall stained green-grey, a hard line where it stood.
    const down = room ? at(room, tx, ty, 0, 1) : null;
    if (down != null && !isHouse(down)) {
      shade(ctx, x, y + 6, T, 10, 0.45, p.tideStain);
      px(ctx, p.tideLine, x, y + 6, T, 1);
      for (let i = 0; i < 3; i++) px(ctx, p.tideLine, x + rnd(tx, ty, 430 + i, 15), y + 7, 1, 2 + rnd(tx, ty, 433 + i, 4));
      if (isSea(down) && p.weedFoot) for (let i = 0; i < 6; i++) px(ctx, pick(p.weedFoot, hash(tx, ty, 436 + i)), x + rnd(tx, ty, 442 + i, 15), y + 12 + rnd(tx, ty, 448 + i, 3), 1, 2 + (i % 2));
      px(ctx, p.ashlarLo, x, y + T - 2, T, 2);
    } else if (hash(tx, ty, 450) < 0.4) {
      // Higher up: rain running down from the eaves.
      px(ctx, p.streak, x + 2 + rnd(tx, ty, 451, 12), y, 1, 5 + rnd(tx, ty, 452, 6));
    }
  },
  window(ctx, x, y, tx, ty, room, p) {
    TOWN.wall(ctx, x, y, tx, ty, room, p);
    // Stone dressings, a dark empty window: no light in it, only the storm's sky caught in the glass.
    px(ctx, p.dress, x + 3, y + 1, 10, 13);
    px(ctx, p.dressLo, x + 12, y + 1, 1, 13);
    px(ctx, p.glassDark, x + 4, y + 2, 8, 10);
    px(ctx, p.glassSky, x + 4, y + 2, 3, 1);
    px(ctx, p.glassSky, x + 4, y + 3, 1, 3);
    px(ctx, p.sash, x + 8, y + 2, 1, 10);
    px(ctx, p.sash, x + 4, y + 6, 8, 1);
    const k = hash(tx, ty, 460);
    if (k < 0.3) {
      // A pane gone: blacker, a shard left in the corner.
      px(ctx, '#040806', x + 9, y + 7, 3, 5);
      px(ctx, p.glassSky, x + 11, y + 7, 1, 2);
    } else if (k < 0.55) {
      // A drowned curtain hanging limp.
      px(ctx, p.curtainDark, x + 4, y + 2, 2, 10);
      px(ctx, p.curtainDark, x + 6, y + 2, 1, 6);
    }
    px(ctx, p.dressHi, x + 2, y + 13, 12, 2);
    px(ctx, p.dressLo, x + 2, y + 14, 12, 1);
    px(ctx, p.dressHi, x + 3, y + 1, 9, 1);
  },
  door(ctx, x, y, tx, ty, room, p) {
    TOWN.wall(ctx, x, y, tx, ty, room, p);
    const h = room ? townHouse(room, tx, ty) : { ex: tx, top: ty, idx: 0 };
    const colour = p.doors[Math.floor(hash(h.ex + h.idx * 3, h.top, 470) * p.doors.length)];
    px(ctx, p.dress, x + 2, y, 12, T);
    px(ctx, p.dressLo, x + 13, y, 1, T);
    // The fanlight, dark.
    px(ctx, p.glassDark, x + 4, y + 1, 8, 3);
    px(ctx, p.sash, x + 7, y + 1, 1, 3);
    px(ctx, p.dress, x + 4, y + 1, 1, 1); px(ctx, p.dress, x + 11, y + 1, 1, 1);
    // The door: paint faded, four panels, knocker, the bottom rotted green.
    px(ctx, colour, x + 4, y + 4, 8, 12);
    px(ctx, '#ffffff18', x + 4, y + 4, 1, 12);
    for (const [dx, dy] of [[5, 5], [8, 5], [5, 10], [8, 10]]) { px(ctx, '#00000040', x + dx, y + dy, 2, 4); px(ctx, '#ffffff14', x + dx, y + dy, 2, 1); }
    px(ctx, p.knob, x + 7, y + 8, 2, 1);
    px(ctx, p.knob, x + 10, y + 10, 1, 1);
    shade(ctx, x + 4, y + 12, 8, 4, 0.35, p.tideStain);
    px(ctx, p.dressHi, x + 1, y + T - 1, 14, 1);
  },
  roof(ctx, x, y, tx, ty, room, p) {
    slateCourses(ctx, x, y, T, tx, ty, p, p.slate, 0);
    if (!room) return;
    // The ridge where the roof stops above, the gutter where it stops below.
    if (!isHouse(at(room, tx, ty, 0, -1))) ridgeTiles(ctx, x, y, tx, p);
    if (at(room, tx, ty, 0, 1) !== '7') {
      px(ctx, p.gutter, x, y + T - 3, T, 3);
      px(ctx, p.gutterHi, x, y + T - 3, T, 1);
      if (tx % 3 === 1) px(ctx, p.gutter, x + 7, y + T - 1, 2, 1);
    }
  },
};
// Slates: 4 px courses of overlapping slates, staggered across the whole town: a dark lap line
// under each course, fine joints, each slate's bottom edge catching the light; lichen and the
// odd one slipped.
function slateCourses(ctx, x, y, h, tx, ty, p, tones, salt) {
  for (let r = 0; r * 4 < h; r++) {
    const wy = ty * 4 + r + salt;
    const cy = y + r * 4;
    const ch = Math.min(4, h - r * 4);
    const start = -((tx * T + (wy % 2 ? 4 : 0)) % 8);
    for (let bx = start; bx < T; bx += 8) {
      const sx = Math.max(0, bx);
      const w = Math.min(bx + 8, T) - sx;
      if (w < 1) continue;
      const wx = tx * T + bx;
      const roll = hash(wx, wy, 480 + salt);
      px(ctx, pick(tones, hash(wx, wy, 479 + salt)), x + sx, cy, w, ch);
      if (roll < 0.03) {
        // A slate gone: the dark under it and a batten across.
        px(ctx, p.slateGap, x + sx, cy, w, ch);
        px(ctx, p.batten, x + sx, cy + 2, w, 1);
        continue;
      }
      if (ch > 2) px(ctx, p.slateHi, x + sx, cy + ch - 1, w, 1);
      if (bx + 8 <= T) px(ctx, p.slateLo, x + bx + 7, cy, 1, ch - 1);
      if (hash(wx, wy, 481 + salt) < 0.06) px(ctx, pick(p.lichen, hash(wx, wy, 482)), x + sx + 2, cy + 1, 2, 2);
    }
    // The lap line: the course above casts its edge over this one.
    px(ctx, p.slateGap, x, cy, T, 1);
  }
}
// Half-round ridge tiles along the top of a roof.
function ridgeTiles(ctx, x, y, tx, p) {
  px(ctx, p.slateLo, x, y + 5, T, 1);
  shade(ctx, x, y + 6, T, 2, 0.35);
  for (let bx = -((tx * T) % 5); bx < T; bx += 5) {
    const sx = Math.max(0, bx);
    const w = Math.min(bx + 5, T) - sx;
    if (w < 1) continue;
    px(ctx, p.ridgeTile, x + sx, y, w, 5);
    px(ctx, p.ridgeHi, x + sx, y + 1, w, 1);
    px(ctx, p.ridgeLo, x + sx, y + 4, w, 1);
    px(ctx, p.slateLo, x + sx + w - 1, y, 1, 5);
  }
}

// Rooftops for the jumping rooms: a b is a lower roof slope, a B a roof with its ridge. The face is
// the slope coming down at you to the gutter; the top is the slates you land on.
function slateBlockOf(raise, p) {
  return (ctx, x, y, tx, ty, room, floor) => {
    floor(ctx, x, y, tx, ty, room);
    const top = y - raise;
    const raiseAt = (dx, dy) => ({ b: 12, B: 24 }[at(room, tx, ty, dx, dy)] ?? 0);
    // The face: slates, darker (it falls away from the light), down to the gutter.
    slateCourses(ctx, x, top + T, raise, tx, ty + 50, p, p.slate, 7);
    shade(ctx, x, top + T, T, raise, 0.4, p.shadow);
    px(ctx, p.gutter, x, y + T - 4, T, 3);
    px(ctx, p.gutterHi, x, y + T - 4, T, 1);
    if (tx % 3 === 0) px(ctx, p.gutterHi, x + 3, y + T - 5, 1, 2);
    if (isSea(at(room, tx, ty, 0, 1))) for (let i = 0; i < 3; i++) px(ctx, pick(p.weedFoot, hash(tx, ty, 490 + i)), x + rnd(tx, ty, 493 + i, 15), y + T - 2, 1, 2);
    px(ctx, p.slateOutline, x, y + T - 1, T, 1);
    // The top.
    slateCourses(ctx, x, top, T, tx, ty, p, p.slateTop, 0);
    if (raise > 12 && raiseAt(0, -1) < raise) ridgeTiles(ctx, x, top, tx, p);
    else if (raise <= 12 && raiseAt(0, -1) > raise) shade(ctx, x, top, T, 3, 0.35, p.shadow);
    if (raiseAt(0, 1) < raise) px(ctx, p.slateHi, x, top + T - 1, T, 1);
    if (raiseAt(0, -1) < raise) px(ctx, p.slateOutline, x, top, T, 1);
    // Bargeboards at the open ends.
    if (raiseAt(-1, 0) < raise) { px(ctx, p.slateOutline, x, top, 1, T + raise); px(ctx, p.barge, x + 1, top + 1, 1, T + raise - 2); }
    if (raiseAt(1, 0) < raise) { px(ctx, p.slateOutline, x + T - 1, top, 1, T + raise); px(ctx, p.barge, x + T - 2, top + 1, 1, T + raise - 2); }
  };
}

// Standing things in town: a chimney stack, an iron bollard, a church spire.
Object.assign(STANDING, {
  chimney(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 13, 14, 3, 0.35);
    px(ctx, p.deepRock2, x + 2, y - 24, 12, 38);
    for (let r = 0; r < 9; r++) {
      const by = y - 23 + r * 4;
      const off = r % 2 ? 3 : 0;
      for (let bx = 3 - off; bx < 13; bx += 6) {
        const sx = Math.max(3, bx);
        const w = Math.min(bx + 6, 13) - sx;
        if (w < 1) continue;
        px(ctx, pick(p.ashlar, hash(tx * 9 + bx, ty * 9 + r, 500)), x + sx, by, w - 1, 3);
        px(ctx, p.ashlarHi, x + sx, by, w - 1, 1);
      }
    }
    px(ctx, p.ashlarLo, x + 11, y - 23, 2, 36);
    // Soot from the pots, the cap, two clay pots, the tide's green at the foot.
    px(ctx, '#20242280', x + 5, y - 23, 1, 7);
    px(ctx, p.deepRock2, x + 1, y - 27, 14, 4);
    px(ctx, p.ashlarHi, x + 2, y - 27, 12, 1);
    px(ctx, p.ashlar[0], x + 2, y - 26, 12, 2);
    for (const [cx, hgt] of [[4, 6], [9, 5]]) {
      px(ctx, p.deepRock2, x + cx - 1, y - 27 - hgt, 5, hgt);
      px(ctx, p.pot, x + cx, y - 27 - hgt + 1, 3, hgt - 1);
      px(ctx, p.potHi, x + cx, y - 27 - hgt + 1, 1, hgt - 1);
      px(ctx, '#140e0c', x + cx + 1, y - 27 - hgt, 1, 1);
    }
    shade(ctx, x + 3, y + 4, 10, 9, 0.4, p.tideStain);
    px(ctx, p.tideLine, x + 3, y + 4, 10, 1);
  },
  bollard(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 2, y + 12, 12, 3, 0.35);
    px(ctx, p.ashlarLo, x + 3, y + 9, 10, 5);
    px(ctx, p.ashlar[0], x + 4, y + 9, 8, 1);
    px(ctx, p.stand0, x + 4, y - 7, 8, 17);
    px(ctx, p.stand1, x + 5, y - 6, 6, 15);
    px(ctx, p.stand2, x + 5, y - 6, 2, 15);
    px(ctx, p.standHi, x + 5, y - 6, 1, 15);
    // The domed cap with its lip, a band, rust weeping.
    px(ctx, p.stand0, x + 3, y - 9, 10, 3);
    px(ctx, p.stand2, x + 4, y - 9, 8, 1);
    px(ctx, p.stand0, x + 5, y - 11, 6, 2);
    px(ctx, p.standHi, x + 6, y - 11, 3, 1);
    px(ctx, p.stand0, x + 4, y - 1, 8, 1);
    px(ctx, p.rust, x + 9, y - 6, 1, 4 + rnd(tx, ty, 510, 5));
    if (hash(tx, ty, 511) < 0.5) for (let r = -4; r < 6; r += 3) px(ctx, p.rope, x + 4, y + r, 8, 1);
  },
  spire(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 13, 14, 3, 0.35);
    px(ctx, p.deepRock2, x + 1, y + 6, 14, 8);
    px(ctx, p.ashlar[1], x + 2, y + 7, 12, 6);
    px(ctx, p.ashlarHi, x + 2, y + 7, 12, 1);
    const tall = 34;
    for (let row = 0; row < tall; row++) {
      const w = Math.max(1, Math.round(10 * (1 - row / tall)));
      const left = x + 8 - Math.ceil(w / 2);
      const py = y + 6 - row;
      px(ctx, p.deepRock2, left - 1, py, w + 2, 1);
      px(ctx, row % 5 === 0 ? p.ashlarLo : p.ashlar[(row >> 2) % 2], left, py, w, 1);
      if (w > 2) px(ctx, p.ashlarHi, left, py, 1, 1);
      // Crockets up the edges.
      if (row % 6 === 3 && w > 3) { px(ctx, p.ashlar[2], left - 2, py, 1, 1); px(ctx, p.ashlarLo, left + w + 1, py, 1, 1); }
    }
    // The iron finial, gone to rust.
    px(ctx, p.stand0, x + 7, y - 34, 2, 7);
    px(ctx, p.stand0, x + 5, y - 32, 6, 1);
    px(ctx, p.rust, x + 7, y - 31, 1, 2);
    shade(ctx, x + 2, y + 2, 12, 11, 0.4, p.tideStain);
  },
});
// A fallen piece of dressed stone: a block with a moulding along it, lying askew, a chip beside.
BLOCKERS.fallenStone = (ctx, x, y, tx, ty, room, p) => {
  shade(ctx, x + 1, y + 12, 14, 3, 0.32);
  const flip = hash(tx, ty, 520) < 0.5;
  for (let r = 0; r < 9; r++) {
    const slant = Math.round((flip ? r : 8 - r) * 0.35);
    px(ctx, p.deepRock2, x + 1 + slant, y + 4 + r, 13, 1);
    px(ctx, r < 3 ? p.ashlarHi : r < 5 ? p.ashlar[0] : p.ashlar[1], x + 2 + slant, y + 4 + r, 11, 1);
  }
  px(ctx, p.ashlarLo, x + 2, y + 7, 13, 1);
  px(ctx, p.ashlarLo, x + 3, y + 10, 10, 1);
  px(ctx, p.deepRock2, x + 1, y + 13, 14, 1);
  px(ctx, p.ashlar[2], x + 12, y + 11, 3, 2);
  if (p.weedFoot) px(ctx, p.weedFoot[0], x + 3, y + 12, 6, 1);
};
// Stone thick with barnacles (x): a squared block, crusted.
MASSES.masonry = (ctx, x, y, tx, ty, room, p, floor) => {
  floor(ctx, x, y, tx, ty, room);
  shade(ctx, x + 1, y + 12, 14, 3, 0.3);
  px(ctx, p.deepRock2, x + 1, y + 1, 14, 13);
  px(ctx, p.ashlar[1], x + 2, y + 2, 12, 11);
  px(ctx, p.ashlarHi, x + 2, y + 2, 12, 1);
  px(ctx, p.ashlarLo, x + 2, y + 7, 12, 1);
  px(ctx, p.ashlarLo, x + 7 + rnd(tx, ty, 530, 3), y + 2, 1, 5);
  shade(ctx, x + 2, y + 8, 12, 5, 0.4, p.tideStain);
  for (let i = 0; i < 14; i++) {
    const bx = x + 2 + rnd(tx, ty, 531 + i, 11);
    const by = y + 3 + rnd(tx, ty, 551 + i, 9);
    px(ctx, '#d0d4c8', bx, by, 2, 1);
    px(ctx, p.deepRock2, bx, by + 1, 2, 1);
  }
};
// Old nets in a tangle (Z): mesh, floats, a rope's end, weed through it.
function netTangle(ctx, x, y, tx, ty, room, p, floor) {
  floor(ctx, x, y, tx, ty, room);
  shade(ctx, x + 1, y + 12, 14, 3, 0.3);
  oval(ctx, p.stand0, x + 8, y + 8, 7, 5);
  oval(ctx, p.netDark, x + 8, y + 8, 6, 4);
  for (let i = 0; i < 16; i += 2) {
    px(ctx, p.net, x + 2 + Math.round(i * 0.75), y + 4 + (i % 4), 1, 8 - (i % 4));
    px(ctx, p.net, x + 2, y + 5 + (i >> 2) * 2, 12, 1);
  }
  for (let i = 0; i < 5; i++) px(ctx, pick(p.weed, hash(tx, ty, 560 + i)), x + 2 + rnd(tx, ty, 565 + i, 11), y + 4 + rnd(tx, ty, 570 + i, 7), 2, 1);
  px(ctx, p.float, x + 3 + rnd(tx, ty, 575, 3), y + 4, 3, 2);
  if (hash(tx, ty, 576) < 0.6) px(ctx, p.float, x + 10, y + 8 + rnd(tx, ty, 577, 2), 3, 2);
  px(ctx, p.rope, x + 1, y + 11, 6, 1);
  px(ctx, p.rope, x + 6, y + 12, 5, 1);
}

// =====================================================================
// The areas.
// =====================================================================
// A palette gives colours; `kinds` says which look each letter takes.
const AREAS = {
  // --- GULLREST: the sunny beach. ---
  gullrest: {
    p: {
      shadow: '60, 44, 20', wetShade: '30, 80, 90', wetLine: '#f6e9c0', glint: '#fff8dc',
      ground: ['#ecdaa8', '#e7d5a0', '#f1e0b0', '#e3d09a'], hi: '#f8eec8', lo: '#d3be88', crack: '#bba670',
      speck: ['#c4ae78', '#fff6d8', '#d8c48c', '#b09a62'], shells: ['#f2b8b0', '#fff2e0', '#e8c8f0'],
      turf: ['#88c45a', '#8dc95f', '#82bf54', '#92cd64'], turfHi: '#b4e87c', turfLo: '#5fa03e', flowers: ['#ffd62e', '#f08ab8', '#fffdf2'],
      path: ['#dcc790', '#d6c08a', '#e2cf9a'],
      water: '#34b8d4', deep: '#2a9ec2', wave: '#86e6f0', troughs: '#238eb0', foam: '#ffffff', lip: '#2a8aa6', caps: 0.16,
      shallow: '#8de6e2', shallowHi: '#b4f2ec', stone: '#d8d0b8', stoneDark: '#8a8068', stoneHi: '#f4ecd4',
      plank: ['#c9a068', '#bf965e', '#d2aa72'], plankHi: '#e2bf88', plankLo: '#9c7442', gap: '#6e4e2c', nail: '#5a3e22', rope: '#e8d8a8',
      deepRock2: '#6e5e48', topRock: '#a89678', deepRock: '#8a7a62', rim: '#d8c8a8', rockLo: '#7a6a52', fleck: '#fff0c8',
      rock: ['#b8a688', '#b0a082', '#c0ae90', '#a89878'], streak: '#d8c8a8', weedFoot: ['#4c8a46', '#3a7a3c'], rivet: '#6a5a48', rust: '#a8683c',
      houses: ['#f2efe4', '#9fd4e4', '#f4d6a0', '#f0b0a8'], boardHi: '#ffffff', boardLo: '#b8b09c', trim: '#2f86b0', frame: '#f6f2e2', glass: '#a8dcec', glassHi: '#d8f4fb',
      sill: '#2f86b0', curtain: '#e86868', door: '#3b8fb8', doorHi: '#5fb0d8', knob: '#ffd23c',
      roof: ['#d8503c', '#cc4632', '#e05c46'], roofHi: '#f08a74', roofLo: '#8a2c20',
      wall: ['#f0ecde', '#eae6d6', '#f5f1e4'], wallHi: '#ffffff', wallLo: '#c4bca8',
      stand0: '#4a3418', stand1: '#7a5630', stand2: '#a77a48', standHi: '#d8a870', rope: '#e8d8a8', sail: '#fffdf2', sailLo: '#c8c0b0', hoop: '#6a5638', net: '#d8c690', float: '#f26a4a',
      weed: ['#4f9a48', '#5ca850', '#438a3e'], weedHi: '#9ae070', driftwood: '#e8dcc0',
      coral: [['#f0788a', '#ffb4bc'], ['#f2a04a', '#ffd098'], ['#b878e0', '#e0b4ff']], glow0: '#4ad0c0', glow1: '#aef4e8', moss: 0, mossColor: '#6a9a4a',
      hangKind: 'rope',
    },
    '.': 'sand', ',': 'turf', ':': 'path', q: 'shingle', o: 'planks', X: 'cobbles',
    wallTop: 'rockTop', wallFace: 'rockFace', h: 'boardWall',
    houses: 'wall', stand: { I: 'post', J: 'stump', '^': 'rockpillar' }, block: 'sandstone',
    O: 'boulder', F: 'weed', Z: 'wrack', N: 'grass', x: 'coral', hang: 'rope',
  },
  // --- WRACK SHORE: the storm starts. Wet shingle, tidepool rock, weed. ---
  wrack: {
    p: {
      shadow: '4, 20, 26', wetShade: '4, 24, 34', wetLine: '#6a8e88', glint: '#aac8c0',
      ground: ['#8a8672', '#848070', '#908c78', '#7e7a68'], hi: '#a8a48e', lo: '#68665a', crack: '#4a4a40',
      speck: ['#5e5b4d', '#b3af98', '#4f5648', '#76806a'], shells: ['#d8b8b0', '#e8e0d0'],
      turf: ['#527c4c', '#4d7648', '#588450', '#487044'], turfHi: '#7aa66a', turfLo: '#37593a', flowers: ['#d8c870', '#b8a0c8'],
      path: ['#a49b80', '#9c9378', '#aca388'],
      water: '#2a5866', deep: '#224a58', wave: '#4a8c98', troughs: '#1a3e4c', foam: '#d4f0e8', lip: '#163440', caps: 0.2,
      shallow: '#4a8a88', shallowHi: '#68a8a0', stone: '#7a8480', stoneDark: '#323c40', stoneHi: '#a0aaa4',
      plank: ['#6e5a42', '#66523c', '#765f46'], plankHi: '#8c7658', plankLo: '#4a3a28', gap: '#2a2016', nail: '#20180e', rope: '#a8987a',
      deepRock: '#162224', deepRock2: '#0c1618', topRock: '#1c2c2e', rim: '#4a6870', rockLo: '#2a3c42', fleck: '#6a98a0',
      rock: ['#4e5e64', '#475860', '#566870', '#415158'], streak: '#6c8890', weedFoot: ['#3a5a30', '#4a7038', '#2e4a28'], rivet: '#7a8a8c', rust: '#7a4a30',
      stand0: '#1a1610', stand1: '#4a3e2e', stand2: '#6a5a44', standHi: '#8a7a5e', sail: '#a89c84', sailLo: '#6a6050', hoop: '#3a3226', net: '#8a7c5c', float: '#c4503a',
      weed: ['#3c5c2c', '#486a34', '#34502a'], weedHi: '#7ca058', driftwood: '#b0a488',
      coral: [['#a85a6a', '#d08a98']], glow0: '#2a9a98', glow1: '#80e8d8', moss: 0.2, mossColor: '#486a38',
    },
    '.': 'shingle', ',': 'turf', ':': 'path', q: 'shingle', o: 'planks', X: 'cobbles',
    wallTop: 'rockTop', wallFace: 'rockFace', h: 'boardWall',
    houses: 'wall', stand: { I: 'post', J: 'stump', '^': 'rockpillar' }, block: 'wetrock',
    O: 'boulder', F: 'weed', Z: 'wrack', N: 'grass', x: 'barnacle', hang: 'rope',
  },
  // --- SALTCOMBE: a stilt town of boards and ropes, lit from inside. ---
  saltcombe: {
    p: {
      shadow: '4, 14, 18', wetShade: '4, 20, 28', wetLine: '#7a9a98', glint: '#c8dcd0',
      ground: ['#7a6040', '#725a3c', '#82663f', '#6a5236'], hi: '#98784a', lo: '#4a3826', crack: '#2a2016',
      speck: ['#4a3a28', '#a89068', '#5a4a34'], shells: ['#d8c8b0'],
      turf: ['#4c7448', '#487046', '#527c4c', '#426a40'], turfHi: '#78a468', turfLo: '#34553a',
      path: ['#8e7e60', '#867658', '#968568'],
      water: '#21495a', deep: '#193c4c', wave: '#3e7a88', troughs: '#132f3e', foam: '#cce8e0', lip: '#10303c', caps: 0.1,
      shallow: '#3e7a7c', shallowHi: '#5a9894', stone: '#6a7470', stoneDark: '#2a3236', stoneHi: '#98a4a0',
      plank: ['#7a6040', '#72593a', '#826843', '#6a5236'], plankHi: '#9a7c52', plankLo: '#4a3826', gap: '#1e150c', nail: '#c8b890', rope: '#b8a47c',
      deepRock: '#14201f', deepRock2: '#0c1616', topRock: '#1c2a28', rim: '#5a766e', rockLo: '#2a3a38', fleck: '#d8c080',
      rock: ['#4a5652', '#44504c', '#505e5a', '#3e4a46'], streak: '#7a948c', weedFoot: ['#3a5a30', '#2e4a28'], rivet: '#9aa8a0', rust: '#7a4a30',
      houses: ['#3e7a7a', '#a8803a', '#9a4a4a', '#5a7a9a', '#7a8a4a'], boardHi: '#ffffff30', boardLo: '#1a2a2a', trim: '#2a2018', frame: '#2a2018', glass: '#ffd488', glassHi: '#fff0b8',
      sill: '#3a2c1c', curtain: '#c8603c', door: '#5a3c22', doorHi: '#7c5a38', knob: '#ffd23c',
      roof: ['#2c3a3e', '#26343a', '#323f44', '#202c30'], roofHi: '#4a5c60', roofLo: '#141c1e',
      wall: ['#6a5238', '#624b32', '#725940'], wallHi: '#8a6e4a', wallLo: '#3a2c1c', nail: '#c8b890',
      stand0: '#1e150c', stand1: '#4a3a28', stand2: '#6e5a3c', standHi: '#98805a', sail: '#9a9078', sailLo: '#5a5444', hoop: '#3a3226', net: '#8a7c5c', float: '#e0603a',
      weed: ['#3c5c2c', '#486a34'], weedHi: '#7ca058', driftwood: '#a89c80',
      coral: [['#a85a6a', '#d08a98']], glow0: '#2a9a98', glow1: '#80e8d8', moss: 0, mossColor: '#486a38',
    },
    '.': 'planks', ',': 'turf', ':': 'path', q: 'shingle', o: 'planksV', X: 'cobbles',
    wallTop: 'rockTop', wallFace: 'boardWall', h: 'boardWall',
    houses: 'wall', stand: { I: 'post', J: 'stump', '^': 'rockpillar' }, block: 'timber',
    O: 'barrel', F: 'pots', Z: 'wrack', N: 'grass', x: 'barnacle', hang: 'rope',
    // The headland's rock (the lagoon's and the lookout's cliffs): K is a sea-cliff face.
    K: 'seaCliff',
  },
  // --- THE SUNKEN LANES: drowned cobbles, mossy walls, brown-green water. ---
  lanes: {
    p: {
      shadow: '4, 22, 18', wetShade: '6, 28, 20', wetLine: '#7a9a80', glint: '#b8d0b8',
      ground: ['#6c6e60', '#666a5c', '#727464', '#60645a'], hi: '#8a8e78', lo: '#464a40', crack: '#2a2e26', gap: '#2c3a2c',
      speck: ['#4a4e42', '#98a088', '#3e4a38'], shells: ['#d8d0c0'],
      turf: ['#4a7040', '#456a3c', '#507848', '#3e6038'], turfHi: '#78a060', turfLo: '#30502e', flowers: ['#d8c870', '#c8a8d0'],
      path: ['#7a6e50', '#726648', '#847858'],
      water: '#2e5a48', deep: '#264c3c', wave: '#4e8a6c', troughs: '#1c3e30', foam: '#cce8d8', lip: '#162e24', caps: 0.08,
      shallow: '#4c8a6c', shallowHi: '#6aa888', stone: '#7a8478', stoneDark: '#2e3a30', stoneHi: '#a4b0a0',
      plank: ['#6c5c40', '#645438', '#74644a'], plankHi: '#8c7a58', plankLo: '#463a26', nail: '#a89870', rope: '#a89878',
      deepRock: '#142018', deepRock2: '#0a140e', topRock: '#1c2c20', rim: '#52705a', rockLo: '#2a4034', fleck: '#8ab898',
      rock: ['#4a5c4e', '#445648', '#506456', '#3e5044'], streak: '#7a9a84', weedFoot: ['#3a6a38', '#2e5a30', '#4e7a40'], rivet: '#88a090', rust: '#7a4a30',
      houses: ['#6a7a68', '#7a7468', '#687a80'], boardHi: '#ffffff25', boardLo: '#1c2a20', trim: '#2a3a2c', frame: '#2a3a2c', glass: '#a8b8a0', glassHi: '#d0dcc8',
      sill: '#3a4a3c', curtain: '#8a5a4a', door: '#4a3a26', doorHi: '#6a5238', knob: '#c8b068',
      roof: ['#3a4a44', '#344440', '#40504a', '#2e3c38'], roofHi: '#5a7068', roofLo: '#18241f',
      wall: ['#58604c', '#505844', '#626a54'], wallHi: '#7a8468', wallLo: '#2c3426',
      stand0: '#1a1610', stand1: '#4a3e2e', stand2: '#6a5a44', standHi: '#8a7a5e', sail: '#8a8a74', sailLo: '#585848', hoop: '#3a3226', net: '#7a7c5c', float: '#c4503a',
      weed: ['#3c6830', '#4a7a38', '#32582a'], weedHi: '#86b060', driftwood: '#a8a888',
      coral: [['#a85a6a', '#d08a98']], glow0: '#2a9a98', glow1: '#80e8d8', moss: 0.45, mossColor: '#4a7840',
    },
    '.': 'cobbles', ',': 'turf', ':': 'path', q: 'shingle', o: 'planks', X: 'cobbles',
    wallTop: 'rockTop', wallFace: 'rockFace', h: 'boardWall',
    houses: 'wall', stand: { I: 'post', J: 'jag', '^': 'rockpillar' }, block: 'wetrock',
    O: 'boulder', F: 'weed', Z: 'hedge', N: 'grass', x: 'barnacle', hang: 'rope',
  },
  // --- THE WRECK YARD: iron hulls, rust, deck timbers, snapped masts. ---
  wreck: {
    p: {
      shadow: '4, 22, 16', wetShade: '4, 24, 20', wetLine: '#78968c', glint: '#a8c4b8',
      ground: ['#6a5a4a', '#625244', '#72604e', '#5a4c3e'], hi: '#88745e', lo: '#3e3228', crack: '#241c14', gap: '#241a12',
      speck: ['#3e3228', '#8a7860', '#4a3c30'], shells: ['#d0c0b0'],
      turf: ['#46663c', '#426038', '#4c6e42', '#3a5832'], turfHi: '#76986a', turfLo: '#2c4828',
      path: ['#7a6a52', '#72624a', '#84745a'],
      water: '#1f4248', deep: '#193640', wave: '#3c747a', troughs: '#112c34', foam: '#c4e4d8', lip: '#102830', caps: 0.2,
      shallow: '#3c7274', shallowHi: '#58908c', stone: '#707a78', stoneDark: '#2a3434', stoneHi: '#9aa6a2',
      plank: ['#6a5640', '#62503a', '#725e46', '#5a4834'], plankHi: '#86705a', plankLo: '#3e3022', nail: '#8a8878', rope: '#9c8c6c',
      deepRock: '#101a18', deepRock2: '#080e0c', topRock: '#18241f', rim: '#5a7468', rockLo: '#26362f', fleck: '#a87850',
      rock: ['#5a4a42', '#52443c', '#645248', '#4a3c36'], streak: '#8a5a3e', weedFoot: ['#2e4a28', '#3a5a30'], rivet: '#98887a', rust: '#9a5a34',
      houses: ['#5a6a64', '#6a5a4c'], boardHi: '#ffffff20', boardLo: '#141c18', trim: '#2a2218', frame: '#2a2218', glass: '#a8c4a8', glassHi: '#d0e4cc',
      sill: '#3a3024', curtain: '#6a3a2a', door: '#4a3a28', doorHi: '#6a5238', knob: '#c8a850',
      roof: ['#4a3e34', '#42362e', '#524438', '#3a2e28'], roofHi: '#6a5848', roofLo: '#1e1610',
      wall: ['#5e4c3c', '#564434', '#685440', '#4e3e30'], wallHi: '#80684e', wallLo: '#2e2218',
      stand0: '#140e08', stand1: '#3e3226', stand2: '#5e4c3a', standHi: '#80684e', sail: '#a29a84', sailLo: '#605848', hoop: '#4a4036', net: '#74684c', float: '#b4482e',
      weed: ['#2e4e2a', '#3a5c32', '#264224'], weedHi: '#6c9450', driftwood: '#988c74',
      coral: [['#a85a6a', '#d08a98']], glow0: '#2a9a98', glow1: '#80e8d8', moss: 0, mossColor: '#3a5a30',
      bridge: null,
    },
    '.': 'plate', ',': 'turf', ':': 'planks', q: 'shingle', o: 'planks', X: 'plate',
    wallTop: 'rockTop', wallFace: 'hullFace', h: 'hullFace',
    houses: 'wall', stand: { I: 'mast', J: 'stump', '^': 'jag' }, block: 'iron',
    O: 'crate', F: 'net', Z: 'wrack', N: 'grass', x: 'barnacle', hang: 'rope', cabin: true, seaPorthole: true,
  },
  // --- THE SOUNDINGS: a sea cave. Wet slate, black water, sea-glass. ---
  soundings: {
    p: {
      shadow: '2, 10, 16', wetShade: '2, 12, 20', wetLine: '#4a7a88', glint: '#7aa8b4',
      ground: ['#3c474c', '#374248', '#424e54', '#333d43'], hi: '#566870', lo: '#222b30', crack: '#12181c', gap: '#161e22',
      speck: ['#222b30', '#6a8088', '#2c383e', '#4a8a90'], shells: ['#a8c0c0'],
      turf: ['#2c4c40', '#284838', '#30523f', '#244034'], turfHi: '#58846c', turfLo: '#1c3428',
      path: ['#4a5258', '#444c52', '#50585e'],
      water: '#12384a', deep: '#0c2a3a', wave: '#2c7482', troughs: '#081e2a', foam: '#a8d8d8', lip: '#06161e', caps: 0.1,
      shallow: '#245c68', shallowHi: '#347a84', stone: '#566870', stoneDark: '#1a242a', stoneHi: '#7a929a',
      plank: ['#4e4234', '#463c2e', '#564a3a'], plankHi: '#6a5c48', plankLo: '#2e261c', nail: '#8a9890', rope: '#8a7c60',
      deepRock: '#0c1216', deepRock2: '#06090c', topRock: '#141c20', rim: '#4a6670', rockLo: '#1e2a30', fleck: '#6ad0c8',
      rock: ['#3a464c', '#344046', '#404e55', '#2e3a40'], streak: '#5a808a', weedFoot: ['#24483c', '#2e5a48'], rivet: '#7a9096', rust: '#6a4a34',
      stand0: '#10161a', stand1: '#323c42', stand2: '#4a5860', standHi: '#6a808a', sail: '#80908c', sailLo: '#4a5654', hoop: '#2a3236', net: '#5a6a60', float: '#a8483a',
      weed: ['#244c3c', '#2e5c48', '#1c3c30'], weedHi: '#58a888', driftwood: '#7a8880',
      coral: [['#a85a6a', '#d08a98']], glow0: '#2ab0b0', glow1: '#8af4ec', moss: 0.2, mossColor: '#2e5a48',
      hangKind: 'rock',
    },
    '.': 'rockfloor', ',': 'turf', ':': 'path', q: 'shingle', o: 'planks', X: 'cobbles',
    wallTop: 'rockTop', wallFace: 'rockFace', h: 'rockFace',
    houses: 'wall', stand: { I: 'rockpillar', J: 'jag', '^': 'rockpillar' }, block: 'wetrock',
    O: 'boulder', F: 'weed', Z: 'wrack', N: 'grass', x: 'glass', hang: 'rock',
  },
  // --- THE BEACON ISLES: wind-bleached rock and turf, little lights. ---
  isles: {
    p: {
      shadow: '4, 22, 14', wetShade: '4, 26, 24', wetLine: '#7ca498', glint: '#b0d0c4',
      ground: ['#7a8470', '#747e6a', '#808a76', '#6e7864'], hi: '#98a28c', lo: '#515a48', crack: '#323a2c', gap: '#2e3628',
      speck: ['#515a48', '#aab4a0', '#68745c'], shells: ['#d8d0c0'],
      turf: ['#5a804c', '#547a48', '#608654', '#4e7442'], turfHi: '#86b070', turfLo: '#3a5a34', flowers: ['#e0d078', '#c8a8d8'],
      path: ['#9a9680', '#928e78', '#a29e88'],
      water: '#1f5560', deep: '#194656', wave: '#44909a', troughs: '#123a48', foam: '#dcf4ec', lip: '#103440', caps: 0.28,
      shallow: '#4a9490', shallowHi: '#68b0a8', stone: '#808a84', stoneDark: '#323c3c', stoneHi: '#aab6b0',
      plank: ['#7a6446', '#725c40', '#826c4c'], plankHi: '#9a8260', plankLo: '#4a3a28', gap: '#2a2016', nail: '#c8b890', rope: '#b0a07c',
      deepRock: '#141e1c', deepRock2: '#0a1210', topRock: '#1e2c2a', rim: '#58766e', rockLo: '#2c3e3a', fleck: '#e0d090',
      rock: ['#5a6a66', '#52625e', '#627270', '#4a5a56'], streak: '#86a49a', weedFoot: ['#3c643a', '#2e5030', '#4a7442'], rivet: '#98a8a0', rust: '#7a4a30',
      houses: ['#c8c4b0', '#b8c4c0', '#c4b8a4'], boardHi: '#ffffff30', boardLo: '#2a3030', trim: '#3a3a30', frame: '#2a2a22', glass: '#ffd488', glassHi: '#fff0b8',
      sill: '#4a4a3c', curtain: '#c8603c', door: '#5a3c22', doorHi: '#7c5a38', knob: '#ffd23c',
      roof: ['#3a4a50', '#344448', '#40545a', '#2c3c42'], roofHi: '#5c7680', roofLo: '#16222a',
      wall: ['#6a5a42', '#62523c', '#726248'], wallHi: '#8a7858', wallLo: '#3a2e20',
      stand0: '#14100a', stand1: '#3e3426', stand2: '#5c4e3a', standHi: '#7c6a50', sail: '#a8a08a', sailLo: '#605a48', hoop: '#3a3228', net: '#7a7458', float: '#d0562e',
      weed: ['#3c6a38', '#4a7a40', '#325a2e'], weedHi: '#86b468', driftwood: '#a8a48c',
      coral: [['#a85a6a', '#d08a98']], glow0: '#2ab0a0', glow1: '#8af4e0', moss: 0.2, mossColor: '#4a7840',
    },
    '.': 'rockfloor', ',': 'turf', ':': 'path', q: 'shingle', o: 'planks', X: 'cobbles',
    wallTop: 'rockTop', wallFace: 'rockFace', h: 'brickFace',
    houses: 'wall', stand: { I: 'pillar', J: 'jag', '^': 'rockpillar' }, block: 'wetrock',
    O: 'boulder', F: 'weed', Z: 'wrack', N: 'grass', x: 'barnacle', hang: 'rope',
    // The rope bridges ride on floats (bridgeSide); a free-standing brick wall has a coping.
    floats: true, coping: true,
  },
  // --- HADDOCK'S LIGHT: whitewashed lighthouse, warm boards, a windy garden. ---
  haddock_light: {
    p: {
      shadow: '8, 16, 14', wetShade: '4, 22, 26', wetLine: '#8aa8a0', glint: '#d0e4dc',
      ground: ['#b4ac98', '#aca490', '#bab29e', '#a69e8a'], hi: '#ccc4b0', lo: '#7a7462', crack: '#4a4638', gap: '#5a5646',
      speck: ['#7a7462', '#d8d0bc', '#8a846e'], shells: ['#e8e0d0'],
      turf: ['#58804c', '#527a48', '#5e8654', '#4c7442'], turfHi: '#86b070', turfLo: '#38583a', flowers: ['#f0d870', '#e8a0b8', '#f4f0e8'],
      path: ['#aaa088', '#a29880', '#b2a890'],
      water: '#1f5560', deep: '#194656', wave: '#44909a', troughs: '#123a48', foam: '#dcf4ec', lip: '#103440', caps: 0.2,
      shallow: '#4a9490', shallowHi: '#68b0a8', stone: '#808a84', stoneDark: '#323c3c', stoneHi: '#aab6b0',
      plank: ['#a07a4c', '#987244', '#a88256', '#926c40'], plankHi: '#c09a68', plankLo: '#6a4c2c', gap: '#3e2c18', nail: '#4a3620', rope: '#c8b88c',
      deepRock: '#141e1c', deepRock2: '#0a1210', topRock: '#1e2c2a', rim: '#58766e', rockLo: '#2c3e3a', fleck: '#e0d090',
      rock: ['#d2ccba', '#cac4b2', '#dad4c2', '#c2bcaa'], streak: '#a8a28c', weedFoot: ['#3c643a', '#2e5030'], rivet: '#98a8a0', rust: '#9a6a44',
      houses: ['#e4dfce', '#dcd6c4'], boardHi: '#ffffff', boardLo: '#9a9482', trim: '#b8452e', frame: '#6a4a2c', glass: '#ffd488', glassHi: '#fff0b8',
      sill: '#8a6a44', curtain: '#c8603c', door: '#8a4a30', doorHi: '#aa6a48', knob: '#ffd23c',
      roof: ['#a8452e', '#9e3e28', '#b04c34', '#963a26'], roofHi: '#cc6a50', roofLo: '#5a2216',
      wall: ['#cec8b4', '#c6c0ac', '#d6d0bc'], wallHi: '#f0ecdc', wallLo: '#8a8470', trim2: '#b8452e', nail: '#6a5a40',
      stand0: '#2a1c10', stand1: '#7a5630', stand2: '#a77a48', standHi: '#d8a870', sail: '#e8e0cc', sailLo: '#a8a090', hoop: '#6a5638', net: '#a89a74', float: '#d8503a',
      weed: ['#4a7a40', '#58884a', '#3e6c36'], weedHi: '#90c070', driftwood: '#c8c0a8',
      coral: [['#a85a6a', '#d08a98']], glow0: '#2ab0a0', glow1: '#8af4e0', moss: 0, mossColor: '#4a7840', curve: true,
    },
    '.': 'flags', ',': 'turf', ':': 'path', q: 'shingle', o: 'planks', X: 'cobbles',
    wallTop: 'rockTop', wallFace: 'brickFace', h: 'brickFace',
    houses: 'wall', stand: { I: 'pillar', J: 'stump', '^': 'rockpillar' }, block: 'lighthouse',
    O: 'barrel', F: 'pots', Z: 'wrack', N: 'grass', x: 'barnacle', hang: 'rope', curve: true,
  },
  // --- THE STORM REACH: open sea round Haddock's boat. Dark rock, deck, heavy water. ---
  reach: {
    p: {
      shadow: '2, 22, 14', wetShade: '2, 24, 20', wetLine: '#78a898', glint: '#b0d4c4',
      ground: ['#58625c', '#525c56', '#5e6862', '#4c5650'], hi: '#78857c', lo: '#363e3a', crack: '#1e2422', gap: '#222a26',
      speck: ['#363e3a', '#8a9a90', '#46524c'], shells: ['#c8d0c0'],
      turf: ['#3e6038', '#3a5a34', '#446840', '#34522e'], turfHi: '#6a9460', turfLo: '#284228',
      path: ['#6a6e5e', '#646858', '#727666'],
      water: '#183e48', deep: '#12323c', wave: '#3a7880', troughs: '#0c2830', foam: '#d4f0e4', lip: '#0c2a34', caps: 0.34,
      shallow: '#36767a', shallowHi: '#50908e', stone: '#667470', stoneDark: '#222c2c', stoneHi: '#8a9c96',
      plank: ['#6a5640', '#62503a', '#725e46', '#5a4834'], plankHi: '#86705a', plankLo: '#3e3022', nail: '#98988a', rope: '#a49474',
      deepRock: '#0e1816', deepRock2: '#060c0a', topRock: '#16221f', rim: '#4a6a60', rockLo: '#22322d', fleck: '#8ab8a0',
      rock: ['#3e4c48', '#384642', '#465450', '#32403c'], streak: '#6a9288', weedFoot: ['#2c4c28', '#3a5c30'], rivet: '#88988e', rust: '#8a5030',
      houses: ['#5a6a64'], boardHi: '#ffffff20', boardLo: '#141c18', trim: '#2a2218', frame: '#2a2218', glass: '#a8c4a8', glassHi: '#d0e4cc',
      sill: '#3a3024', curtain: '#6a3a2a', door: '#4a3a28', doorHi: '#6a5238', knob: '#c8a850',
      roof: ['#3a4a44'], roofHi: '#5a7068', roofLo: '#18241f',
      wall: ['#5e4c3c', '#564434', '#685440'], wallHi: '#80684e', wallLo: '#2e2218',
      stand0: '#120e08', stand1: '#3a2e22', stand2: '#584634', standHi: '#786248', sail: '#988f7a', sailLo: '#58503f', hoop: '#3a3226', net: '#6e6448', float: '#b4482e',
      weed: ['#2c4c28', '#385a30', '#244024'], weedHi: '#6c9450', driftwood: '#8a8470',
      coral: [['#a85a6a', '#d08a98']], glow0: '#2ab0a0', glow1: '#8af4e0', moss: 0, mossColor: '#3a5a30',
    },
    '.': 'rockfloor', ',': 'turf', ':': 'planks', q: 'shingle', o: 'planks', X: 'cobbles',
    wallTop: 'rockTop', wallFace: 'rockFace', h: 'hullFace',
    houses: 'wall', stand: { I: 'mast', J: 'stump', '^': 'rockpillar' }, block: 'wetrock',
    O: 'boulder', F: 'net', Z: 'wrack', N: 'grass', x: 'barnacle', hang: 'rope',
  },
  // --- THE LAST LIGHT: black stone, iron ribs, spikes. ---
  lastlight: {
    p: {
      shadow: '0, 14, 8', wetShade: '0, 16, 12', wetLine: '#70a090', glint: '#a0d0bc',
      ground: ['#3a4246', '#353d41', '#40484c', '#30383c'], hi: '#586468', lo: '#1e2428', crack: '#0e1214', gap: '#12181a',
      speck: ['#1e2428', '#6a787c', '#2a3236'], shells: ['#a8b8b0'],
      turf: ['#36563a', '#325234', '#3a5c3e', '#2c4a30'], turfHi: '#5e8660', turfLo: '#223a26',
      path: ['#4a5050', '#444a4a', '#505656'],
      water: '#103840', deep: '#0b2c34', wave: '#2e7478', troughs: '#07222a', foam: '#c8ecdc', lip: '#061c22', caps: 0.3,
      shallow: '#2a6a6a', shallowHi: '#408484', stone: '#586668', stoneDark: '#161e20', stoneHi: '#7a8e90',
      plank: ['#4e4034', '#463a2e', '#564838', '#3e3228'], plankHi: '#6a5a46', plankLo: '#2e241a', nail: '#8a9490', rope: '#7a6c54',
      deepRock: '#0a1012', deepRock2: '#04070a', topRock: '#12191c', rim: '#4a6a68', rockLo: '#1a262a', fleck: '#78c8b0',
      rock: ['#2e383c', '#283236', '#364246', '#242e32'], streak: '#4a7478', weedFoot: ['#1e3c26', '#2a4c30'], rivet: '#7a8e8e', rust: '#6a4630',
      houses: ['#3a4448'], boardHi: '#ffffff18', boardLo: '#0e1618', trim: '#1a2022', frame: '#1a2022', glass: '#ffd488', glassHi: '#fff0b8',
      sill: '#2a3234', curtain: '#6a3a2a', door: '#3a2c20', doorHi: '#564232', knob: '#c8a850',
      roof: ['#242e32'], roofHi: '#44585c', roofLo: '#0e1618',
      wall: ['#3a4448', '#343e42', '#404a4e'], wallHi: '#586468', wallLo: '#1a2224',
      stand0: '#0a0e10', stand1: '#2a3438', stand2: '#3e4a4e', standHi: '#5a6a6e', sail: '#7a8280', sailLo: '#434a48', hoop: '#2a3234', net: '#4e5a50', float: '#a8482e',
      weed: ['#1e3c26', '#2a4c30', '#16301e'], weedHi: '#5a9068', driftwood: '#6a7470',
      coral: [['#a85a6a', '#d08a98']], glow0: '#2ab0a0', glow1: '#8af4e0', moss: 0, mossColor: '#2e5a3a',
    },
    '.': 'flags', ',': 'turf', ':': 'path', q: 'shingle', o: 'planks', X: 'cobbles',
    wallTop: 'rockTop', wallFace: 'brickFace', h: 'brickFace',
    houses: 'wall', stand: { I: 'pillar', J: 'jag', '^': 'jag' }, block: 'iron',
    O: 'boulder', F: 'net', Z: 'wrack', N: 'grass', x: 'barnacle', hang: 'rope', curve: true,
  },
};
// --- MERROW: the drowned town. Dressed grey-green stone, cobbles with weed in the joints, clear
// bottle-green water with the street showing under it, limewashed houses stained where the tide
// stood, dark slate roofs (b and B are roof slopes and ridges to jump across), no lit windows. ---
const MERROW_P = {
  shadow: '4, 20, 18', wetShade: '4, 26, 22', wetLine: '#78a094', glint: '#b4d4c8',
  ground: ['#5e6a64', '#58645e', '#64706a', '#525e58'], hi: '#7e8a82', lo: '#3c4642', crack: '#222a26', gap: '#1a2a20',
  jointWeed: ['#3a6a3a', '#4e8048', '#2e5a32'], jointWeedHi: '#86b468',
  speck: ['#3c4642', '#8a968c', '#46524a'], shells: ['#d0d0c4'],
  sett: ['#4e5862', '#48525c', '#545e68', '#444e56'], settHi: '#6e7882', settGap: '#18221e',
  turf: ['#3e5e3a', '#3a5836', '#44643e', '#34502f'], turfHi: '#6a8a58', turfLo: '#283e26',
  path: ['#5a5a4a', '#545444', '#606050'],
  water: '#15433b', deep: '#0e322c', deepRgb: '6, 30, 26', wave: '#3a7a6a', troughs: '#0a2824', foam: '#bfe2d4', lip: '#0a2420', caps: 0.05,
  under: ['#1e5046', '#1c4c42', '#22564a'], underHi: '#2a5e52', underWeed: '#2e6a40', underThing: '#4a6e60',
  shallow: '#3a6e60', shallowHi: '#7ab4a0', shallowTint: '24, 84, 68',
  stone: '#76827a', stoneDark: '#2a3632', stoneHi: '#a0aca2',
  plank: ['#5a4c3a', '#544634', '#605240'], plankHi: '#7a6a52', plankLo: '#3a3024', nail: '#8a8a7a', rope: '#a09070',
  deepRock: '#161e1c', deepRock2: '#0a100e', topRock: '#1e2826', rim: '#6a7a72', rockLo: '#2e3a36', fleck: '#9ab0a4',
  rock: ['#5a6660', '#545e5a', '#606c66', '#4c5852'], streak: '#7e9088', weedFoot: ['#2e5a32', '#3a6a38', '#264a2a'], rivet: '#8a9890', rust: '#7a4a30',
  // Dressed stone.
  mortar: '#2a3430', ashlar: ['#66726a', '#606c64', '#6c786f', '#5a665e'], ashlarHi: '#8a968c', ashlarLo: '#3e4844',
  tideStain: '34, 66, 48', tideLine: '#5a7a5e',
  // Limewash, its quoins and downpipes; dark windows and faded doors.
  houses: ['#a8aea0', '#9ea69a', '#b0b2a2', '#a0a894', '#aaa49a'], plasterHi: '#bcc0b0', plasterLo: '#868c80',
  quoin: '#6e7a72', quoinHi: '#8a968c', pipe: '#1e2422', pipeHi: '#3a4442',
  dress: '#7e8880', dressHi: '#9aa49a', dressLo: '#4e5852', glassDark: '#0c1816', glassSky: '#2e5248', sash: '#3a423e', curtainDark: '#2a2a26',
  doors: ['#2e4a42', '#4a2e2a', '#2e3a4e', '#3e3a2a'], knob: '#8a8a6a',
  boardHi: '#ffffff18', boardLo: '#1c2622', trim: '#2a3430', frame: '#2a3430', glass: '#0c1816', glassHi: '#2e5248', sill: '#4e5852', curtain: '#2a2a26', door: '#2e4a42', doorHi: '#3e5a52',
  // Slate.
  slate: ['#2a343a', '#263036', '#2e3a40', '#222c32'], slateTop: ['#46545c', '#424f58', '#4a5862', '#3e4b54'], slateHi: '#4a5a64', slateLo: '#141c20',
  slateGap: '#10161a', slateOutline: '#0a0e10', ridgeTile: '#56646c', ridgeHi: '#7a8a92', ridgeLo: '#2e383e', gutter: '#161a1c', gutterHi: '#3e4648', barge: '#3a3026', batten: '#4a3a28',
  lichen: ['#7a8a4a', '#5a7040', '#8a9a60'],
  roof: ['#2a343a', '#263036'], roofHi: '#4a5a64', roofLo: '#141c20',
  wall: ['#58604c', '#505844', '#626a54'], wallHi: '#7a8468', wallLo: '#2c3426',
  pot: '#7a5038', potHi: '#9a6a4a',
  stand0: '#101412', stand1: '#2a3230', stand2: '#44504c', standHi: '#64726c', sail: '#8a8a74', sailLo: '#585848', hoop: '#2a3230',
  net: '#7a7a5e', netDark: '#2a2e24', float: '#b84a34',
  weed: ['#2e5a32', '#3a6a38', '#264a2a'], weedHi: '#78a65e', driftwood: '#9a9a86',
  coral: [['#a85a6a', '#d08a98']], glow0: '#2a9a98', glow1: '#80e8d8', moss: 0.3, mossColor: '#365a36',
};
MERROW_P.flagP = { ...MERROW_P, ground: ['#6e7872', '#68726c', '#747e78', '#626c66'], hi: '#8c968e', lo: '#4a544e', gap: '#24302a' };
AREAS.merrow = {
  p: MERROW_P,
  '.': 'townCobbles', ',': 'turf', ':': 'townFlags', q: 'shingle', o: 'planks', X: 'setts',
  wallTop: 'rockTop', wallFace: 'ashlar', h: 'ashlar', stair: 'dressed',
  houses: 'town', stand: { I: 'chimney', J: 'bollard', '^': 'spire' }, block: 'slate',
  O: 'fallenStone', F: 'weed', Z: 'nets', N: 'grass', x: 'masonry', hang: 'rope',
  water: 'clear', shallows: 'cobbles',
};

// Raised-ledge looks, from each area's palette.
function ledgeLook(p, kind) {
  const tones = {
    sandstone: { faceBase: '#8a7858', bricks: ['#c0ae90', '#b8a688', '#c8b698', '#b0a082'], brickHi: '#ddd0b0', outline: '#5a4a32', tops: ['#e0d0a8', '#dccca4', '#e6d6ae'], seam: '#b8a47c', fleck: '#fff0c8', lit: '#f4e8c4' },
    timber: { faceBase: p.gap, bricks: p.plank, brickHi: p.plankHi, outline: p.deepRock2, tops: p.plank, seam: p.plankLo, fleck: p.nail, lit: p.plankHi },
    iron: { faceBase: p.deepRock2, bricks: p.rock, brickHi: p.rim, outline: p.deepRock2, tops: [p.ground[0], p.ground[1], p.ground[2]], seam: p.lo, fleck: p.rust, lit: p.hi },
    lighthouse: { faceBase: p.wallLo, bricks: p.rock, brickHi: p.wallHi ?? p.rim, outline: p.wallLo, tops: p.ground, seam: p.lo, fleck: p.hi, lit: p.hi },
    wetrock: { faceBase: p.deepRock2, bricks: p.rock, brickHi: p.rim, outline: p.deepRock2, tops: [p.ground[0], p.ground[1], p.ground[2]], seam: p.lo, fleck: p.glint ?? p.hi, lit: p.hi, weed: p.weedFoot?.[0] },
  };
  return tones[kind] ?? tones.wetrock;
}

// Cargo (a room's `cargo` boxes: [{ x, y, w, h }] in tiles): the room's b and B
// tiles inside them draw as wooden crates instead of the area's stone, each tile
// its own crate. A b is one crate; a B is two stacked. Same heights and
// solidity as any b or B.
const inCargo = (room, tx, ty) => (room?.cargo ?? []).some((r) => tx >= r.x && ty >= r.y && tx < r.x + r.w && ty < r.y + r.h);
function crateFront(ctx, x, y, w, h, tx, ty, salt, p) {
  px(ctx, p.stand0, x, y, w, h);
  // Boards across, the frame round them, a brace corner to corner.
  for (let j = 1; j < h - 1; j += 3) px(ctx, pick(p.plank, hash(tx, ty * 7 + j, salt)), x + 1, y + j, w - 2, 2);
  px(ctx, p.plankHi, x + 1, y + 1, w - 2, 1);
  px(ctx, p.plankHi, x + 1, y + 1, 2, h - 2);
  px(ctx, p.plankLo, x + w - 3, y + 1, 2, h - 2);
  px(ctx, p.plankLo, x + 1, y + h - 2, w - 2, 1);
  const flip = hash(tx, ty, salt + 3) < 0.5;
  const span = w - 7;
  for (let i = 0; i <= span; i++) {
    const by = y + 2 + Math.round(((flip ? i : span - i) / span) * (h - 5));
    px(ctx, p.plankHi, x + 3 + i, by, 1, 1);
    px(ctx, p.plankLo, x + 3 + i, by + 1, 1, 1);
  }
  // Nails at the corners, and now and then a stencilled mark or a rope round it.
  for (const [nx, ny] of [[x + 1, y + 1], [x + w - 2, y + 1], [x + 1, y + h - 2], [x + w - 2, y + h - 2]]) px(ctx, p.nail, nx, ny, 1, 1);
  const r = hash(tx, ty, salt + 5);
  if (r < 0.3 && h >= 10) { px(ctx, '#c8bca0', x + 5, y + 5, 6, 1); px(ctx, '#c8bca0', x + 7, y + 3, 2, 5); }
  else if (r > 0.78) { px(ctx, p.rope, x + 5, y + 1, 2, h - 2); px(ctx, p.stand0, x + 7, y + 1, 1, h - 2); }
}
function crateLid(ctx, x, y, tx, ty, salt, p) {
  px(ctx, p.stand0, x, y, T, T);
  for (let j = 0; j < 3; j++) px(ctx, pick(p.plank, hash(tx, ty * 3 + j, salt)), x + 1, y + 1 + j * 5, T - 2, 4);
  px(ctx, p.plankHi, x + 1, y + 1, T - 2, 1);
  px(ctx, p.plankLo, x + 1, y + 5, T - 2, 1);
  px(ctx, p.plankLo, x + 1, y + 10, T - 2, 1);
  // The lid's battens at each end, nailed.
  px(ctx, p.plankHi, x + 2, y + 1, 2, T - 2);
  px(ctx, p.plankLo, x + T - 4, y + 1, 2, T - 2);
  for (const ny of [3, 8, 13]) { px(ctx, p.nail, x + 2, y + ny, 1, 1); px(ctx, p.nail, x + T - 3, y + ny, 1, 1); }
  if (hash(tx, ty, salt + 9) < 0.35) px(ctx, p.plankLo, x + 6 + rnd(tx, ty, salt + 10, 4), y + 7, 3, 1);
  // Damp along the near edge.
  if (hash(tx, ty, salt + 11) < 0.5) shade(ctx, x + 1, y + 12, T - 2, 3, 0.2);
}
function crateBlockOf(raise, p) {
  return (ctx, x, y, tx, ty, room, floor) => {
    floor(ctx, x, y, tx, ty, room);
    const top = y - raise;
    if (raise <= 12) crateFront(ctx, x, top + T, T, raise, tx, ty, 70, p);
    else {
      crateFront(ctx, x, top + T + 12, T, 12, tx, ty, 72, p);
      crateFront(ctx, x, top + T, T, 12, tx, ty + 99, 74, p);
      shade(ctx, x + 1, top + T + 12, T - 2, 1, 0.45);
    }
    crateLid(ctx, x, top, tx, ty, 76 + raise, p);
    // Its shadow on the deck at the foot.
    shade(ctx, x, y + T - 1, T, 1, 0.35);
  };
}

// A round porthole on a ship's wall, the glass dark with the storm outside:
// grey-green sky, the horizon, the swell with a white crest, rain on the glass.
function seaPorthole(ctx, x, y, tx, ty, room, p, cfg) {
  WALLS[cfg.wallFace](ctx, x, y, tx, ty, room, p);
  const cx = x + 8;
  const cy = y + 7;
  oval(ctx, p.stand0, cx, cy, 6, 6);
  oval(ctx, '#6a6656', cx, cy, 5, 5);
  oval(ctx, '#0c1c1a', cx, cy, 4, 4);
  // Sky, then the sea from the horizon down.
  oval(ctx, '#2a4440', cx, cy - 1, 3, 2);
  px(ctx, '#1e3a36', cx - 3, cy, 7, 1);
  px(ctx, '#9cbcb0', cx - 3, cy + 1, 7, 1);
  oval(ctx, '#123a34', cx, cy + 3, 3, 1);
  const crest = rnd(tx, ty, 61, 4);
  px(ctx, '#cfe6dc', cx - 2 + crest, cy + 2, 2, 1);
  px(ctx, '#3c6a62', cx - 3, cy + 2, 1, 1);
  // A glint on the glass and a run of rain down it.
  px(ctx, '#d4ecdf', cx - 3, cy - 3, 2, 1);
  px(ctx, '#d4ecdf', cx - 3, cy - 2, 1, 1);
  px(ctx, '#7aa69a', cx + 1 + rnd(tx, ty, 62, 2), cy - 2, 1, 3);
  // Rivets round the rim, rust weeping from the bottom one.
  for (const [dx, dy] of [[0, -5], [5, 0], [0, 5], [-5, 0]]) px(ctx, '#a89e7e', cx + dx, cy + dy, 1, 1);
  px(ctx, p.rust ?? '#9a5a34', cx, cy + 6, 1, 2);
}

// =====================================================================
// From a config to the drawing functions for every letter.
// =====================================================================
// Whatever a palette leaves out is worked out from what it has.
function withDefaults(p) {
  return {
    wall: p.plank, wallHi: p.plankHi, wallLo: p.plankLo, trim: p.gap ?? p.deepRock2, hoop: p.stand0,
    houses: [p.plank[0]], boardHi: '#ffffff20', boardLo: p.deepRock2, frame: p.stand0, glass: '#ffd488', glassHi: '#fff0b8',
    sill: p.plankLo, curtain: '#8a4a3a', door: p.plank[1], doorHi: p.plankHi, knob: '#d8b858',
    roof: [p.rock[1]], roofHi: p.rim, roofLo: p.deepRock2, ...p,
  };
}
function buildLook(cfg0) {
  const cfg = { ...cfg0, p: withDefaults(cfg0.p) };
  const { p } = cfg;
  const ground = (kind) => {
    if (kind === 'planksV') return (c, x, y, tx, ty, room) => GROUND.planks(c, x, y, tx, ty, room, p, true);
    return (c, x, y, tx, ty, room) => GROUND[kind](c, x, y, tx, ty, room, p);
  };
  const look = {};
  for (const letter of ['.', ',', ':', 'q', 'o', 'X']) look[letter] = ground(cfg[letter]);
  look['#'] = (c, x, y, tx, ty, room) => WALLS.rockTop(c, x, y, tx, ty, room, p);
  look.k = look['#'];
  const face = (c, x, y, tx, ty, room) => WALLS[cfg.wallFace](c, x, y, tx, ty, room, { ...p, curve: cfg.curve });
  look.W = face; look.K = face; look.G = face;
  // An area can give K a look of its own (Saltcombe's sea cliffs: `K: 'seaCliff'`).
  if (cfg.K) look.K = (c, x, y, tx, ty, room) => WALLS[cfg.K](c, x, y, tx, ty, room, p);
  look.h = (c, x, y, tx, ty, room) => WALLS[cfg.h](c, x, y, tx, ty, room, { ...p, curve: cfg.curve });
  // Walls hung with weed (V) or tattered sailcloth (H).
  look.V = (c, x, y, tx, ty, room) => {
    face(c, x, y, tx, ty, room);
    for (let i = 0; i < 9; i++) px(c, pick(p.weed, hash(tx, ty, 900 + i)), x + rnd(tx, ty, 910 + i, 15), y + rnd(tx, ty, 920 + i, 4), 1, 4 + rnd(tx, ty, 930 + i, 9));
  };
  look.H = (c, x, y, tx, ty, room) => {
    face(c, x, y, tx, ty, room);
    px(c, p.stand0, x + 2, y + 1, 12, 1);
    for (let i = 0; i < 4; i++) px(c, i % 2 ? p.sailLo : p.sail, x + 2 + i * 3, y + 2, 3, 6 + ((i * 5 + tx) % 5));
  };
  look['~'] = cfg.water === 'clear'
    ? (c, x, y, tx, ty, room) => clearWater(c, x, y, tx, ty, room, p)
    : (c, x, y, tx, ty, room) => water(c, x, y, tx, ty, room, p);
  look[';'] = cfg.shallows === 'cobbles'
    ? (c, x, y, tx, ty, room) => shallowCobbles(c, x, y, tx, ty, room, p)
    : (c, x, y, tx, ty, room) => shallows(c, x, y, tx, ty, room, p);
  look.j = (c, x, y, tx, ty, room) => stones(c, x, y, tx, ty, room, p);
  look.g = (c, x, y, tx, ty, room) => bridge(c, x, y, tx, ty, room, p);
  look['0'] = (c, x, y, tx, ty, room) => drop(c, x, y, tx, ty, room, p);
  // A free-standing wall of brick (an `h` with open ground above it, like the Isles' lamp-yard):
  // a coping of capstones along the top, and its shadow on the ground at its foot.
  if (cfg.coping) {
    const plainH = look.h;
    look.h = (c, x, y, tx, ty, room) => {
      plainH(c, x, y, tx, ty, room);
      const up = at(room, tx, ty, 0, -1);
      if (up == null || isWallish(up) || up === 'h') return;
      px(c, p.deepRock2, x, y + 4, T, 1);
      for (let sx = 0; sx < T; sx += 4) {
        px(c, pick(p.rock, hash(tx * 4 + sx, ty, 640)), x + sx, y, 4, 4);
        px(c, p.stoneHi ?? p.rim, x + sx, y, 3, 1);
        px(c, p.rockLo, x + sx + 3, y, 1, 4);
      }
      const down = at(room, tx, ty, 0, 1);
      if (down != null && !isWallish(down) && down !== 'h') shade(c, x, y + T - 1, T, 1, 0.35);
    };
  }
  // Rope bridges on floats (see bridgeSide): only where the area asks for them.
  if (cfg.floats) {
    const plain = { '~': look['~'], q: look.q, o: look.o, g: look.g };
    look.g = (c, x, y, tx, ty, room) => { plain.g(c, x, y, tx, ty, room); bridgeSide(c, x, y, tx, ty, room, p, false); };
    look['~'] = (c, x, y, tx, ty, room) => {
      plain['~'](c, x, y, tx, ty, room);
      bridgeFloat(c, x, y, tx, ty, room, p, false);
      sunkBridge(c, x, y, tx, ty, room, p);
    };
    look.q = (c, x, y, tx, ty, room) => { plain.q(c, x, y, tx, ty, room); bridgeFloat(c, x, y, tx, ty, room, p, true); };
    // Boards are a slack bridge only out on the bed (indoors they're a floor).
    look.o = (c, x, y, tx, ty, room) => {
      plain.o(c, x, y, tx, ty, room);
      if (['q', '~', ';'].includes(at(room, tx, ty, 0, -1)) || ['q', '~', ';'].includes(at(room, tx, ty, 0, 1))) bridgeSide(c, x, y, tx, ty, room, p, true);
    };
  }
  look.f = (c, x, y, tx, ty, room, floor) => rail(c, x, y, tx, ty, room, p, floor);
  if (cfg.stair === 'dressed') look.s = (c, x, y, tx, ty, room) => dressedStair(c, x, y, tx, ty, room, p);
  look.b = cfg.block === 'slate' ? slateBlockOf(12, p) : blockOf(12, ledgeLook(p, cfg.block));
  look.B = cfg.block === 'slate' ? slateBlockOf(24, p) : blockOf(24, ledgeLook(p, cfg.block));
  // A room's `cargo` boxes turn its b and B into crates (see crateBlockOf), and a room
  // with `ledges: 'rock'` draws them as natural rock (rockLedgeOf). Outdoors, the areas
  // whose ledges are the shore's own stone (sandstone, wet rock) are natural rock by
  // default, so they read as ledges and boulders, not cut blocks; `ledges: 'blocks'`
  // keeps the cut blocks in a room that wants them.
  const naturalLedges = cfg.block === 'sandstone' || cfg.block === 'wetrock';
  for (const [letter, raise] of [['b', 12], ['B', 24]]) {
    const stone = look[letter];
    const crate = p.ship ? shipCargoOf(raise, p) : crateBlockOf(raise, p);
    const rock = rockLedgeOf(raise, p);
    const shoreRock = rockLedgeOf(raise, p, true);
    const rocky = (room) => naturalLedges && room?.ledges !== 'blocks' && !room?.indoors;
    look[letter] = (c, x, y, tx, ty, room, floor) => (inCargo(room, tx, ty) ? crate : room?.ledges === 'rock' ? rock : rocky(room) ? shoreRock : stone)(c, x, y, tx, ty, room, floor);
  }
  look.O = (c, x, y, tx, ty, room, floor) => { floor(c, x, y, tx, ty, room); BLOCKERS[cfg.O](c, x, y, tx, ty, room, p); };
  look.F = (c, x, y, tx, ty, room, floor) => HEAPS[cfg.F](c, x, y, tx, ty, room, p, floor);
  look.Z = cfg.Z === 'nets'
    ? (c, x, y, tx, ty, room, floor) => netTangle(c, x, y, tx, ty, room, p, floor)
    : cfg.Z === 'hedge'
    ? (c, x, y, tx, ty, room, floor) => hedgeRow(c, x, y, tx, ty, room, p, floor)
    : (c, x, y, tx, ty, room, floor) => wrackHeap(c, x, y, tx, ty, room, p, floor);
  look.N = (c, x, y, tx, ty, room, floor) => seaGrass(c, x, y, tx, ty, room, p, floor);
  look.x = (c, x, y, tx, ty, room, floor) => MASSES[cfg.x](c, x, y, tx, ty, room, p, floor);
  look.I = (c, x, y, tx, ty, room) => STANDING[cfg.stand.I](c, x, y, tx, ty, room, p);
  look.J = (c, x, y, tx, ty, room) => STANDING[cfg.stand.J](c, x, y, tx, ty, room, p);
  look['^'] = (c, x, y, tx, ty, room) => STANDING[cfg.stand['^']](c, x, y, tx, ty, room, p);
  look.v = (c, x, y, tx, ty, room) => hanging(c, x, y, tx, ty, room, p);
  // Houses, and a ship's deckhouse.
  look[5] = (c, x, y, tx, ty, room) => HOUSES.wall(c, x, y, tx, ty, room, p);
  look[6] = (c, x, y, tx, ty, room) => HOUSES.window(c, x, y, tx, ty, room, p);
  look[7] = (c, x, y, tx, ty, room) => HOUSES.roof(c, x, y, tx, ty, room, p);
  look[8] = (c, x, y, tx, ty, room) => HOUSES.door(c, x, y, tx, ty, room, p);
  look.a = (c, x, y, tx, ty, room) => HOUSES.cabinWall(c, x, y, tx, ty, room, p);
  look.w = (c, x, y, tx, ty, room) => HOUSES.cabinWindow(c, x, y, tx, ty, room, p);
  // A ship's porthole looking out on the storm (the Wreck Yard): `seaPorthole` in the config.
  if (cfg.seaPorthole) look.w = (c, x, y, tx, ty, room) => seaPorthole(c, x, y, tx, ty, room, p, cfg);
  look.e = (c, x, y, tx, ty, room) => HOUSES.cabinRoof(c, x, y, tx, ty, room, p);
  // Town houses (Merrow): limewash, quoins, dark windows, slate.
  if (cfg.houses === 'town') {
    look[5] = (c, x, y, tx, ty, room) => TOWN.wall(c, x, y, tx, ty, room, p);
    look[6] = (c, x, y, tx, ty, room) => TOWN.window(c, x, y, tx, ty, room, p);
    look[7] = (c, x, y, tx, ty, room) => TOWN.roof(c, x, y, tx, ty, room, p);
    look[8] = (c, x, y, tx, ty, room) => TOWN.door(c, x, y, tx, ty, room, p);
  }
  return look;
}

// --- THE CLIFF CAVE (a `tileLook`, not an area): Gullrest's letters inside the cliff
// spur (sunny_cliff_cave, sunny_cliff_hollow), but in the cave's own damp gloom: the
// stone a darker grey-brown, the sand dull and grey, wet planks, and the pool a murky
// green-teal, the open water ('~') much darker than the shallows (';') round it so
// the edge where you can wade no further is plain. The rooms' shade does the rest.
AREAS.cliffcave = {
  ...AREAS.gullrest,
  p: {
    ...AREAS.gullrest.p,
    shadow: '14, 14, 12', wetShade: '6, 22, 22', wetLine: '#9aa898', glint: '#c8d0c0',
    ground: ['#9a8c72', '#94866c', '#a09278', '#8e8268'], hi: '#ac9e84', lo: '#7c705a', crack: '#625844',
    speck: ['#746a54', '#b4a88e', '#867a62', '#5e5644'], shells: ['#b49890', '#c4bcae'],
    path: ['#8a7c64', '#84765e', '#908268'],
    water: '#163c3a', deep: '#0e2c2c', wave: '#2c5a54', troughs: '#0a2222', foam: '#8ab4a6', lip: '#081c1c', caps: 0.03,
    shallow: '#3a6a5e', shallowHi: '#4e7e70', stone: '#7a7468', stoneDark: '#3a3630', stoneHi: '#9c9484',
    plank: ['#7a6448', '#725c40', '#806a4c'], plankHi: '#927c5a', plankLo: '#52402a', gap: '#2a1e12', nail: '#3a2c1a', rope: '#a89c80',
    deepRock2: '#2a2620', topRock: '#4a443a', deepRock: '#3a352c', rim: '#888070', rockLo: '#463f35', fleck: '#a8a08a',
    rock: ['#6a6256', '#645c50', '#70685c', '#5e564a'], streak: '#847c6e', weedFoot: ['#365638', '#2a462c'],
    weed: ['#365c3a', '#3e6842', '#2e5034'], weedHi: '#6a9060', driftwood: '#a49a86',
  },
};

// --- THE WRECK YARD'S BARE ROCK (a `tileLook`): the Wreck Yard's palette and storm, but the point's own rock
// instead of the yard's iron: the cliffs are natural rock faces (not riveted hull plate), the floor letters are
// shingle and sand, not plate and planks. For the way out to the Fair Return's bell: the cave under the point
// (wreck_under_point) and the Watch Rock (wreck_watch_rock). ---
AREAS.wreckrock = {
  ...AREAS.wreck,
  p: { ...AREAS.wreck.p, rock: ['#3e3a36', '#38342f', '#46413b', '#322e2a'], streak: '#5e6a62', rim: '#4e5e58', topRock: '#161d1b', fleck: '#7c8a80' },
  '.': 'shingle', ':': 'path', X: 'shingle',
  wallFace: 'rockFace', h: 'rockFace', block: 'wetrock', cabin: false, seaPorthole: false,
};

// --- THE FAIR RETURN (the ghost ship): the Wreck Yard's palette gone colder and darker, a brig
// that has stood a hundred years in fog. Decks are long laid boards (grey-brown, gaps black),
// bulkheads and the hull's side are board walls, the sea round her is the yard's black water.
// Every room of it says `area: 'ghostship'` (src/data/rooms/ship*.js). ---
AREAS.ghostship = {
  ...AREAS.wreck,
  p: {
    ...AREAS.wreck.p,
    shadow: '2, 10, 12', wetShade: '2, 12, 14',
    ground: ['#4a4038', '#42382f', '#52463c', '#3a3029'], hi: '#645649', lo: '#2a211b', crack: '#14100c', gap: '#120e0a',
    // The deck's boards: close tones of old grey-brown oak (shipStrakes); the age goes on top, in shipDecor.js.
    ship: true, tar: '#0e0c0a',
    plank: ['#4c463d', '#48423a', '#504a40', '#453f37', '#4a4540'], plankHi: '#6e6858', plankLo: '#29241e', nail: '#6c6a5e', hoop: '#22201c',
    wall: ['#3a3630', '#33302b', '#423c34', '#2c2a26'], wallHi: '#58554a', wallLo: '#18110c', trim: '#21170f', frame: '#21170f',
    water: '#142e34', deep: '#0e2429', wave: '#2c5a60', troughs: '#0a1e24', foam: '#9cbcb4', lip: '#0a1c22', caps: 0.1,
    streak: '#7a6a50', rust: '#6a3a24', glint: '#8ca8a0',
  },
  // (The poop deck and the gangways are `o`: fore-and-aft boards like the rest, except a narrow
  // gangway, whose boards run across it: see shipBoardsVertical in shipDecor.js.)
  '.': 'planks', ',': 'planks', ':': 'planks', o: 'planks', X: 'planks',
  wallTop: 'rockTop', wallFace: 'boardWall', h: 'boardWall', cabin: true,
};

const LOOKS = Object.fromEntries(Object.entries(AREAS).map(([area, cfg]) => [area, buildLook(cfg)]));

// =====================================================================
// Hooking in.
// =====================================================================
export function installCoastTiles(TILES, helpers) {
  floorLetter = helpers.floorUnder ?? null;
  const letters = new Set(Object.values(LOOKS).flatMap((look) => Object.keys(look)));
  // `0` (a drop) is made by deepTiles.js; if it is missing, make it here.
  if (!TILES['0']) TILES['0'] = { solid: true, beamOver: true, draw: () => {} };
  for (const letter of letters) {
    const tile = TILES[letter];
    if (!tile) continue;
    const old = tile.draw;
    tile.draw = (ctx, x, y, tx, ty, room) => {
      const draw = LOOKS[room?.tileLook ?? room?.area]?.[letter];
      if (!draw) return old(ctx, x, y, tx, ty, room);
      const floor = (c, fx, fy, ftx, fty, froom) => helpers.drawBaseFloor(c, fx, fy, ftx, fty, froom);
      return draw(ctx, x, y, tx, ty, room, floor, () => old(ctx, x, y, tx, ty, room));
    };
  }
}

// =====================================================================
// What glows in the tiles: lit windows and doors (Saltcombe, the lights,
// the Isles), the sea-glass in the Soundings' rock and its water.
// =====================================================================
const WINDOW_LIGHT = '255, 196, 108';
const GLASS_LIGHT = '120, 240, 220';
const windowGlow = (strength = 1) => [
  { dy: -1, bloom: 12, strength: 0.6 * strength, flicker: 0.15, color: WINDOW_LIGHT },
  { dy: 16, pool: 46, strength: 0.5 * strength, flicker: 0.12, color: WINDOW_LIGHT },
];
const doorGlow = (strength = 1) => [{ dy: 4, pool: 32, strength: 0.34 * strength, flicker: 0.2, color: WINDOW_LIGHT }];
const GLOW_TILES = {
  saltcombe: { 6: () => windowGlow(1.1), w: () => windowGlow(0.9), 8: () => doorGlow() },
  // Portholes on the storm: no lamp behind them, just a faint cold sea-light.
  wreck: { w: () => [{ dy: -1, bloom: 7, strength: 0.16, flicker: 0.05, color: '120, 196, 176' }] },
  isles: { 6: () => windowGlow(0.9), 8: () => doorGlow(0.8) },
  haddock_light: { 6: () => windowGlow(1.1), 8: () => doorGlow(), H: (tx, ty) => (hash(tx, ty, 3) < 0.5 ? [{ dy: 2, bloom: 10, strength: 0.5, flicker: 0.3, color: WINDOW_LIGHT }, { dy: 10, pool: 44, strength: 0.4, flicker: 0.2, color: WINDOW_LIGHT }] : null) },
  lastlight: { 6: () => windowGlow(0.7), H: (tx, ty) => [{ dy: 3, bloom: 9, strength: 0.4, flicker: 0.3, color: '170, 255, 210' }, { dy: 10, pool: 40, strength: 0.3, flicker: 0.2, color: '170, 255, 210' }] },
  soundings: {
    x: (tx, ty) => [{ dy: -2, bloom: 13, strength: 0.6, flicker: 0.2, color: GLASS_LIGHT }, { dy: 3, pool: 52, strength: 0.5, flicker: 0.1, color: GLASS_LIGHT }],
    '~': (tx, ty) => ((tx + ty * 2) % 5 === 0 ? [{ dy: 0, pool: 42, strength: 0.26, flicker: 0.1, color: '70, 200, 220' }] : null),
    v: (tx, ty) => (hash(tx, ty, 6) < 0.3 ? [{ dy: -12, bloom: 8, strength: 0.35, flicker: 0.2, color: GLASS_LIGHT }] : null),
  },
};

// The lights of a room's tiles, in world pixels.
export function coastTileLights(room) {
  const table = GLOW_TILES[room?.area];
  if (!table) return [];
  const lights = [];
  room.tiles.forEach((row, ty) => [...row].forEach((char, tx) => {
    const make = table[char];
    const list = make ? make(tx, ty) : null;
    if (!list) return;
    const cx = tx * T + T / 2;
    const cy = ty * T + T / 2;
    for (const l of list) lights.push({ ...l, x: cx + (l.dx ?? 0), y: cy + (l.dy ?? 0) });
  }));
  return lights;
}
