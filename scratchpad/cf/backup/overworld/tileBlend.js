// Soft edges and variety for the coast (Chapter 5), painted once into the room's
// picture after its tiles (Room.renderBackground), so it costs nothing while you play.
//
// Tiles are painted one 16 px square at a time, so left alone a room reads as a grid:
// sand stops dead at the turf in a straight line, the shore is a staircase, every
// tile of sand has its own flat colour and its own blob, the foot of a cliff is a
// ruled line. This pass goes over the finished picture and:
//
//  - makes the edge between two kinds of natural ground ragged (sand, shingle, turf,
//    path, rock slabs, shallows, the sea): the line wanders a few pixels either way,
//    and the pixels on the far side of it show the other ground (mirrored across the
//    old edge, so its texture runs on). Outside corners are rounded off. Sand and turf
//    can also drift a little over boards and cobbles (never the other way);
//  - draws the edges themselves along that ragged line: a wet dark band and the line
//    the waves reach on the sand, foam on the water, a dark lip under a bank, a darker
//    rim to the turf;
//  - lays big soft patches of lighter and darker ground over the whole floor (dithered,
//    and running across tiles), so a big stretch of one tile never repeats;
//  - drops little things about: shells, pebbles, driftwood, weed, cracks, puddles, tufts;
//  - roughs up natural rock walls: a ragged overhang under the clifftop, a ragged foot
//    with fallen stones, rock jutting out at the sides, and a soft shadow (ambient
//    occlusion) on the ground along every wall and deepest in its inside corners.
//
// Only the drawing changes: no tile's solidity or height does. Which letters are which
// ground, and the palette, come from coastTiles.js (coastBlendLook); the tiles there
// leave out their own straight edges wherever this pass draws one. A room can turn it
// off with `softEdges: false`. Indoors only the water's edges are ragged (and drawn).
//
// Tide rooms paint both their pictures (high and low) through this too, so the tide
// needs nothing more while it plays.

import { TILE_SIZE as T } from '../config.js';
import { coastBlendLook, coastIndoorLook, wetOverBuilt } from './coastTiles.js';
import { sunnyBlendLook } from './brightTiles.js';
import { caveBlendLook } from './caveBlend.js';
import { ch3BlendLook } from './ch3Blend.js';
import { ashBlendLook } from './ashTiles.js';
import { TILES, floorUnder } from './tileset.js';

const WALL_LETTERS = '#WVHKkG5678awehM';
const FACE_LETTERS = 'WKGV';
const RAISE = { b: 12, B: 24 };
// Standing things drawn apart from the room's picture: their tile in the picture is just floor.
const STANDING = 'IJ^v';
// Things painted over a floor of their own in the tile (a boulder, a heap): their floor gets
// the same patches as the ground round it (found by painting the floor alone and comparing).
const ON_FLOOR = 'OFZNxf';

// --- Noise ---
function h2(x, y, s = 0) {
  let h = (x * 374761393 + y * 668265263 + s * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const smooth = (t) => t * t * (3 - 2 * t);
// Smooth 1D noise, 0..1.
function n1(v, s, scale) {
  const f = v / scale;
  const i = Math.floor(f);
  const u = smooth(f - i);
  return h2(i, 0, s) * (1 - u) + h2(i + 1, 0, s) * u;
}
// The same noise over a whole picture, fast: the lattice and the weights for every
// column and row worked out once (the patch pass reads it at every pixel).
function noiseField(PW, PH, sx, sy, seed) {
  const gw = Math.ceil(PW / sx) + 2;
  const gh = Math.ceil(PH / sy) + 2;
  const g = new Float32Array(gw * gh);
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) g[j * gw + i] = h2(i, j, seed);
  const ix = new Int32Array(PW);
  const ux = new Float32Array(PW);
  for (let X = 0; X < PW; X++) { const f = X / sx; ix[X] = Math.floor(f); ux[X] = smooth(f - ix[X]); }
  const iy = new Int32Array(PH);
  const uy = new Float32Array(PH);
  for (let Y = 0; Y < PH; Y++) { const f = Y / sy; iy[Y] = Math.floor(f); uy[Y] = smooth(f - iy[Y]); }
  return (X, Y) => {
    const r = iy[Y] * gw + ix[X];
    const u = ux[X];
    const top = g[r] + (g[r + 1] - g[r]) * u;
    const bottom = g[r + gw] + (g[r + gw + 1] - g[r + gw]) * u;
    return top + (bottom - top) * uy[Y];
  };
}
// Blocks of rock hanging below a clifftop: in steps `size` px wide, most 0, some 2 to 7 px
// deep, a pixel shallower at each end of the block so its corners are rounded off.
function hangBlock(X, seed, size) {
  const i = Math.floor(X / size);
  const roll = h2(i, seed, 86);
  if (roll < 0.55) return 0;
  const deep = 2 + Math.floor(h2(i, seed, 87) * 6);
  const u = X - i * size;
  return u === 0 || u === size - 1 ? deep - 2 : u === 1 || u === size - 2 ? deep - 1 : deep;
}
// How far a ragged line wanders at this point along it, 0..1.
const wobble = (along, seed) => n1(along, seed, 7) * 0.62 + n1(along, seed + 31, 2.7) * 0.38;
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

// --- Which ground may spread over which ---
const isShallow = (k) => k === 'shallows';
// Merrow's flood: deep clear water, and the shallows over the drowned street.
const isTownWet = (k) => k === 'clearWater' || k === 'clearShallows';
const isWet = (look, k) => look.isWater(k) || isShallow(k) || isTownWet(k);
function softKind(look, k) {
  return look.isLand(k) || look.isWater(k) || isShallow(k);
}
// May `claimer` ground show over `victim` ground near their shared edge?
function allowed(look, claimer, victim) {
  if (!claimer || !victim || claimer === victim) return false;
  // (Indoors only the water's edges wander, and a trodden way's over the flags or cobbles.)
  if (look.wetOnly && !isWet(look, claimer) && !isWet(look, victim)) return claimer === 'path' && (victim === 'flags' || victim === 'cobbles' || victim === 'plate');
  if (look.soften?.(claimer, victim)) return true;
  // Water creeping over iron plate, cobbles or flags, and back: both ways.
  if (wetOverBuilt(claimer, victim, look.wetOnly)) return true;
  if (softKind(look, claimer) && softKind(look, victim)) return true;
  // Sand, turf and the like drift over boards, cobbles and flags; never water over them.
  return look.isLand(claimer) && !softKind(look, victim) && victim !== 'clearWater' && victim !== 'clearShallows';
}
function amplitude(look, a, b) {
  // (A look can let two walkable grounds wander further into each other: moss over cave floor.)
  const own = look.amplitude?.(a, b);
  if (own) return own;
  const wet = (k) => look.isWater(k) || isShallow(k);
  // (Kept small where one side is walkable and the other not, so the edge still says where you can go.)
  if (wet(a) && wet(b)) return 4;
  return 3;
}
// The offset of the line between two tiles at a point along it, in pixels: positive
// means it has moved into the second tile (right or below), negative into the first.
function lineOffset(look, vertical, line, along, first, second) {
  if (!first || !second || first === second) return 0;
  const intoSecond = allowed(look, first, second);
  const intoFirst = allowed(look, second, first);
  if (!intoSecond && !intoFirst) return 0;
  const r = amplitude(look, first, second);
  const w = wobble(along, vertical ? line * 7919 + 13 : line * 104729 + 7);
  if (intoSecond && intoFirst) return Math.round((w * 2 - 1) * r);
  return intoSecond ? Math.round(w * r) : -Math.round(w * r);
}

// For atmosphere.js: how far the visible shore of a water tile is moved from the tile's
// side at a point (i pixels along that side), so the moving foam stays on the shore.
// side is 'n', 's', 'w' or 'e'; the answer is in pixels, positive into the water.
export function shoreShift(room, tx, ty, side, i) {
  const look = coastBlendLook(room) ?? coastIndoorLook(room);
  if (!look) return 0;
  const k = look.kind(room.tileAt(tx, ty));
  if (side === 'n') return lineOffset(look, false, ty, tx * T + i, look.kind(room.tileAt(tx, ty - 1)), k);
  if (side === 's') return -lineOffset(look, false, ty + 1, tx * T + i, k, look.kind(room.tileAt(tx, ty + 1)));
  if (side === 'w') return lineOffset(look, true, tx, ty * T + i, look.kind(room.tileAt(tx - 1, ty)), k);
  return -lineOffset(look, true, tx + 1, ty * T + i, k, look.kind(room.tileAt(tx + 1, ty)));
}

// --- Colours ---
function rgb(hex) {
  if (!hex || hex[0] !== '#') return null;
  const n = parseInt(hex.slice(1, 7), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}
function mix(d, i, c, a) {
  if (!c) return;
  d[i] += (c[0] - d[i]) * a;
  d[i + 1] += (c[1] - d[i + 1]) * a;
  d[i + 2] += (c[2] - d[i + 2]) * a;
}
function dim(d, i, f) {
  d[i] *= f;
  d[i + 1] *= f;
  d[i + 2] *= f;
}
function put(d, i, c) {
  if (!c) return;
  d[i] = c[0];
  d[i + 1] = c[1];
  d[i + 2] = c[2];
}

// The coast's look, or Sunnyside's (its grass, lane, flagstones, brook and hedges), or
// indoors on the coast (faint wear on the floor and shadow along the walls only), or
// Chapter 4 underground (caveBlend.js), or Chapter 3's wood, drains, marsh and dead city (ch3Blend.js).
const blendLook = (room) => coastBlendLook(room) ?? sunnyBlendLook(room) ?? coastIndoorLook(room) ?? caveBlendLook(room) ?? ch3BlendLook(room) ?? ashBlendLook(room);

export function blendTiles(ctx, room) {
  const look = blendLook(room);
  if (!look) return;
  const { p } = look;
  // (A look can add letters to these: Chapter 3's trees stand like pillars, its cliffs
  // are M faces under m tops, its bramble hedges sit on the floor like a boulder.)
  const standingSet = STANDING + (look.standing ?? '');
  const wallSet = WALL_LETTERS + (look.walls ?? '');
  const onFloorSet = ON_FLOOR + (look.onFloor ?? '');
  const faceSet = FACE_LETTERS + (look.faces ?? '');
  const topSet = '#k' + (look.tops ?? '');
  const isTop = (c) => c != null && topSet.includes(c);
  const W = room.width;
  const H = room.height;
  const PW = W * T;
  const PH = H * T;
  if (!PW || !PH) return;
  const img = ctx.getImageData(0, 0, PW, PH);
  const d = img.data;
  const src = d.slice();

  // The kind of ground of every tile (an id; 0 is not ground this pass touches).
  const ids = new Map();
  const names = [null];
  const kindAt = new Int16Array(W * H);
  const wallAt = new Uint8Array(W * H); // 1 a wall, 2 a natural rock wall
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W; tx++) {
      const c = room.tiles[ty][tx];
      const k = look.kind(standingSet.includes(c) ? floorUnder(room, tx, ty) : c);
      if (k) {
        if (!ids.has(k)) { ids.set(k, names.length); names.push(k); }
        kindAt[ty * W + tx] = ids.get(k);
      }
      if (wallSet.includes(c)) wallAt[ty * W + tx] = look.naturalWall(c) ? 2 : 1;
    }
  }
  const kindId = (tx, ty) => (tx < 0 || ty < 0 || tx >= W || ty >= H ? 0 : kindAt[ty * W + tx]);
  const kindName = (tx, ty) => names[kindId(tx, ty)];
  const wallOf = (tx, ty) => (tx < 0 || ty < 0 || tx >= W || ty >= H ? 0 : wallAt[ty * W + tx]);
  const letter = (tx, ty) => (tx < 0 || ty < 0 || tx >= W || ty >= H ? null : room.tiles[ty][tx]);

  // Pixels a raised block's top reaches up over: never touched.
  const covered = new Uint8Array(PW * PH);
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W; tx++) {
      const raise = RAISE[room.tiles[ty][tx]];
      if (!raise) continue;
      for (let y = Math.max(0, ty * T - raise); y < ty * T + T; y++) covered.fill(1, y * PW + tx * T, y * PW + tx * T + T);
    }
  }

  // Under a boulder or a heap, the ground is the floor round it wherever the picture is
  // still just floor (found by painting the floor alone and comparing); the thing itself
  // is never touched.
  const scratch = document.createElement('canvas');
  scratch.width = T;
  scratch.height = T;
  const sctx = scratch.getContext('2d', { willReadFrequently: true });
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W; tx++) {
      // (A look can name more of them: Sunnyside's stepping stones and planks over the brook.)
      const own = look.floorOf?.[room.tiles[ty][tx]];
      if (!onFloorSet.includes(room.tiles[ty][tx]) && !own) continue;
      const under = own ?? floorUnder(room, tx, ty);
      const k = look.kind(under);
      if (!k || !TILES[under]) continue;
      if (!ids.has(k)) { ids.set(k, names.length); names.push(k); }
      kindAt[ty * W + tx] = ids.get(k);
      sctx.clearRect(0, 0, T, T);
      TILES[under].draw(sctx, 0, 0, tx, ty, room);
      const fl = sctx.getImageData(0, 0, T, T).data;
      for (let ly = 0; ly < T; ly++) for (let lx = 0; lx < T; lx++) {
        const i = (ty * T + ly) * PW + tx * T + lx;
        const f = (ly * T + lx) * 4;
        if (src[i * 4] !== fl[f] || src[i * 4 + 1] !== fl[f + 1] || src[i * 4 + 2] !== fl[f + 2]) covered[i] = 1;
      }
    }
  }

  // What each pixel shows now (a kind id).
  const vis = new Uint8Array(PW * PH);
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W; tx++) {
      const id = kindAt[ty * W + tx];
      if (!id) continue;
      for (let y = ty * T; y < ty * T + T; y++) vis.fill(id, y * PW + tx * T, y * PW + tx * T + T);
    }
  }

  // Indoors: ragged edges only where there is water, nothing lying about, faint wear and the walls' shadow.
  const indoor = Boolean(look.indoors);

  // --- 1. Ragged edges and rounded corners ---
  const boundary = new Uint8Array(W * H);
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W; tx++) {
      const a = kindId(tx, ty);
      if (!a) continue;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const b = kindId(tx + dx, ty + dy);
        if (b && b !== a && (!indoor || allowed(look, names[a], names[b]) || allowed(look, names[b], names[a]))) boundary[ty * W + tx] = 1;
      }
    }
  }
  const claim = (X, Y, sx, sy, id) => {
    const i = Y * PW + X;
    if (covered[i]) return false;
    if (sx < 0 || sy < 0 || sx >= PW || sy >= PH) return false;
    const j = sy * PW + sx;
    if (covered[j]) return false;
    d[i * 4] = src[j * 4];
    d[i * 4 + 1] = src[j * 4 + 1];
    d[i * 4 + 2] = src[j * 4 + 2];
    vis[i] = id;
    return true;
  };
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W; tx++) {
      if (!boundary[ty * W + tx]) continue;
      const kA = kindName(tx, ty);
      const kL = kindName(tx - 1, ty);
      const kR = kindName(tx + 1, ty);
      const kU = kindName(tx, ty - 1);
      const kD = kindName(tx, ty + 1);
      const left = tx * T;
      const top = ty * T;
      // Outside corners: both sides of the corner are other ground.
      const corners = [];
      for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        const kh = kindName(tx + sx, ty);
        const kv = kindName(tx, ty + sy);
        if (!kh || !kv || kh === kA || kv === kA) continue;
        const kd = kindName(tx + sx, ty + sy);
        const diag = kd && kd !== kA && (kd === kh || kd === kv);
        const claimer = diag ? kd : kh;
        if (!allowed(look, claimer, kA)) continue;
        const cx = sx < 0 ? left : left + T;
        const cy = sy < 0 ? top : top + T;
        const wet = (k) => look.isWater(k) || isShallow(k);
        const wide = look.amplitude?.(kA, claimer);
        const r = wide ? wide + 2 + Math.floor(h2(cx, cy, 71) * 4) : wet(kA) || wet(claimer) ? 4 + Math.floor(h2(cx, cy, 71) * 4) : 3 + Math.floor(h2(cx, cy, 71) * 4);
        corners.push({ sx, sy, cx, cy, diag, id: ids.get(claimer), r });
      }
      for (let ly = 0; ly < T; ly++) {
        const Y = top + ly;
        const oL = kL && kL !== kA ? lineOffset(look, true, tx, Y, kL, kA) : 0;
        const oR = kR && kR !== kA ? lineOffset(look, true, tx + 1, Y, kA, kR) : 0;
        for (let lx = 0; lx < T; lx++) {
          const X = left + lx;
          let done = false;
          for (const c of corners) {
            const dx = c.sx < 0 ? lx : T - 1 - lx;
            const dy = c.sy < 0 ? ly : T - 1 - ly;
            if (dx >= c.r || dy >= c.r) continue;
            const ex = c.r - dx - 0.5;
            const ey = c.r - dy - 0.5;
            if (ex * ex + ey * ey <= c.r * c.r) continue;
            const mx = 2 * c.cx - 1 - X;
            const my = c.diag ? 2 * c.cy - 1 - Y : Y;
            done = claim(X, Y, mx, my, c.id);
            if (done) break;
          }
          if (done) continue;
          if (oL > 0 && lx < oL) { claim(X, Y, 2 * left - 1 - X, Y, ids.get(kL)); continue; }
          if (oR < 0 && lx >= T + oR) { claim(X, Y, 2 * (left + T) - 1 - X, Y, ids.get(kR)); continue; }
          if (kU && kU !== kA) {
            const o = lineOffset(look, false, ty, X, kU, kA);
            if (o > 0 && ly < o) { claim(X, Y, X, 2 * top - 1 - Y, ids.get(kU)); continue; }
          }
          if (kD && kD !== kA) {
            const o = lineOffset(look, false, ty + 1, X, kA, kD);
            if (o < 0 && ly >= T + o) { claim(X, Y, X, 2 * (top + T) - 1 - Y, ids.get(kD)); continue; }
          }
        }
      }
    }
  }

  // --- 2. The edges themselves, along the ragged line ---
  const C = {
    wetLine: rgb(p.wetLine), foam: rgb(p.foam), lip: rgb(p.lip), turfLo: rgb(p.turfLo), shallowHi: rgb(p.shallowHi),
    underHi: rgb(p.underHi), wave: rgb(p.wave),
  };
  // Merrow: the dry street goes dark and damp where the shallows creep up it, the
  // waterline is a thin bright skin, and the drowned street's edge shows where the
  // shallows drop off into the deep water.
  const townEdge = (d, q, own, other, dist, up, checker, X, Y) => {
    if (look.paved(own) && other === 'clearShallows') {
      if (dist <= 3) dim(d, q, [0.8, 0.87, 0.93][dist - 1]);
      return true;
    }
    if (own === 'clearShallows' && look.paved(other)) {
      if (dist === 1) mix(d, q, C.foam, 0.42);
      else if (dist === 2 && checker) mix(d, q, C.shallowHi, 0.25);
      return true;
    }
    if (own === 'clearShallows' && other === 'clearWater') {
      if (dist <= 2) dim(d, q, dist === 1 ? 0.84 : 0.92);
      return true;
    }
    if (own === 'clearWater' && other === 'clearShallows') {
      if (up) {
        // The street's edge just under the surface, then its shadow going down.
        if (dist === 1) mix(d, q, C.underHi, 0.55);
        else if (dist === 2) mix(d, q, C.underHi, checker ? 0.3 : 0.15);
        else if (dist === 3) dim(d, q, 0.88);
      } else if (dist === 1) mix(d, q, C.wave, 0.35);
      else if (dist === 2 && checker) mix(d, q, C.wave, 0.15);
      return true;
    }
    return false;
  };
  // Sunnyside's brook: under a bank, a fringe of grass over a lip of earth, then the
  // water darker in its shade; where the bank is below or beside it, a darker edge;
  // the grass at the brink a shade darker.
  const B = look.brook ?? {};
  const brookCol = { fringe: rgb(B.fringe), fringeHi: rgb(B.fringeHi), earth: rgb(B.earth), shade: rgb(B.shade), edge: rgb(B.edge) };
  const brookEdge = (d, q, own, other, dist, up, checker, X, Y) => {
    const land = look.isLand(other);
    if (own === 'water' && land) {
      if (up) {
        if (dist === 1) put(d, q, h2(X >> 1, Y, 77) < 0.5 ? brookCol.fringe : brookCol.fringeHi);
        else if (dist === 2) put(d, q, h2(X, Y, 78) < 0.3 ? brookCol.fringe : brookCol.earth);
        else if (dist <= 4) mix(d, q, brookCol.shade, dist === 3 ? 0.85 : 0.45);
        else mix(d, q, brookCol.edge, 0.4);
      } else if (dist === 1) put(d, q, brookCol.edge);
      else if (dist === 2) mix(d, q, brookCol.edge, 0.45);
      return true;
    }
    if (look.isLand(own) && other === 'water') {
      if (dist === 1) dim(d, q, 0.84);
      else if (dist === 2 && checker) dim(d, q, 0.93);
      return true;
    }
    return false;
  };
  const kindOfId = (id) => names[id];
  const isLandId = (id) => look.isLand(kindOfId(id));
  const isWaterId = (id) => look.isWater(kindOfId(id));
  const isShallowId = (id) => kindOfId(id) === 'shallows';
  // The nearest other ground straight up, down, left or right of every pixel (up to
  // 5 px), found with one sweep each way along every row and column.
  const N = PW * PH;
  const best = new Uint8Array(N);
  const bestOther = new Uint8Array(N);
  const bestUp = new Uint8Array(N);
  const consider = (i, dist, other, up) => {
    if (dist <= 5 && (!best[i] || dist < best[i])) { best[i] = dist; bestOther[i] = other; bestUp[i] = up; }
  };
  const sweep = (start, step, count, up) => {
    let prev = 0;
    let prevAt = -100;
    for (let n = 0; n < count; n++) {
      const i = start + n * step;
      const v = vis[i];
      if (n > 0 && v !== vis[i - step]) { prev = vis[i - step]; prevAt = n - 1; }
      if (v && prev && prev !== v) consider(i, n - prevAt, prev, up);
    }
  };
  for (let X = 0; X < PW; X++) sweep(X, PW, PH, 1);
  for (let X = 0; X < PW; X++) sweep(X + (PH - 1) * PW, -PW, PH, 0);
  for (let Y = 0; Y < PH; Y++) sweep(Y * PW, 1, PW, 0);
  for (let Y = 0; Y < PH; Y++) sweep(Y * PW + PW - 1, -1, PW, 0);
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W; tx++) {
      if (!boundary[ty * W + tx]) continue;
      for (let Y = ty * T; Y < ty * T + T; Y++) {
        for (let X = tx * T; X < tx * T + T; X++) {
          const i = Y * PW + X;
          const own = vis[i];
          const dist = best[i];
          if (!own || !dist || covered[i]) continue;
          const other = bestOther[i];
          const up = bestUp[i] === 1;
          const q = i * 4;
          const checker = (X + Y) & 1;
          if (look.town && townEdge(d, q, kindOfId(own), kindOfId(other), dist, up, checker, X, Y)) continue;
          if (look.brook && brookEdge(d, q, kindOfId(own), kindOfId(other), dist, up, checker, X, Y)) continue;
          if (isLandId(own) && (isWaterId(other) || isShallowId(other))) {
            // Wet sand: a dark band, then the broken line the waves reach.
            const deep = isWaterId(other);
            if (dist <= 3) dim(d, q, deep ? [0.76, 0.8, 0.86][dist - 1] : [0.86, 0.9, 0.94][dist - 1]);
            else if (dist === 4 && deep && h2(X >> 1, Y, 81) < 0.6) mix(d, q, C.wetLine, 0.55);
          } else if (isWaterId(own) && isLandId(other)) {
            if (up) {
              // Under a bank: its dark lip on the water.
              if (dist <= 2) mix(d, q, C.lip, dist === 1 ? 0.85 : 0.5);
              else if (dist === 3) dim(d, q, 0.86);
            } else if (dist === 1) mix(d, q, C.foam, 0.8);
            else if (dist === 2 && checker) mix(d, q, C.foam, 0.45);
            else if (dist === 3 && h2(X, Y, 83) < 0.25) mix(d, q, C.foam, 0.3);
          } else if (isWaterId(own) && isShallowId(other)) {
            if (dist === 1) mix(d, q, up ? C.lip : C.foam, up ? 0.3 : 0.28);
            else if (dist === 2 && checker) mix(d, q, C.shallowHi, 0.15);
          } else if (isShallowId(own) && isLandId(other)) {
            if (dist === 1) mix(d, q, C.foam, 0.5);
            else if (dist === 2 && checker) mix(d, q, C.foam, 0.2);
          } else if (isShallowId(own) && isWaterId(other)) {
            if (dist === 1) dim(d, q, 0.88);
          } else if (kindOfId(own) === 'turf' && isLandId(other)) {
            if (dist === 1) mix(d, q, C.turfLo, 0.6);
            else if (dist === 2 && checker) mix(d, q, C.turfLo, 0.25);
          } else if (isLandId(own) && kindOfId(other) === 'turf') {
            if (dist === 1) dim(d, q, 0.9);
          } else if (isLandId(own) && isLandId(other)) {
            if (dist === 1 && checker) dim(d, q, 0.93);
          } else if (wetOverBuilt(kindOfId(own), kindOfId(other), indoor)) {
            // Water over a built floor: on the floor, a damp dark band going lighter as it
            // dries; on the water, a bright skin at the line (a dark lip under an edge above).
            const ko = kindOfId(own);
            if (isWet(look, ko)) {
              const deep = look.isWater(ko);
              if (dist === 1) mix(d, q, up && deep ? C.lip : C.foam, up && deep ? 0.6 : deep ? 0.45 : 0.4);
              else if (dist === 2) { if (up && deep) dim(d, q, 0.8); else if (checker) mix(d, q, C.shallowHi, 0.22); }
              else if (dist === 3 && up && deep) dim(d, q, 0.9);
            } else if (dist <= 4) {
              dim(d, q, [0.72, 0.8, 0.88, 0.94][dist - 1]);
              if (dist === 4 && h2(X >> 1, Y >> 1, 85) < 0.35) mix(d, q, C.wetLine, 0.3);
            }
          } else if (!softKind(look, kindOfId(own)) && isLandId(other)) {
            // Boards or cobbles with sand drifted on them: the drift's soft shadow.
            if (dist === 1) dim(d, q, 0.86);
          }
        }
      }
    }
  }

  // --- 3. Big soft patches over the natural ground ---
  const PATCH = {
    sand: [p.hi, 0.35, p.lo, 0.3], shingle: [p.hi, 0.25, p.lo, 0.28], rockfloor: [p.hi, 0.3, p.lo, 0.38],
    path: [p.hi, 0.25, p.lo, 0.3], turf: [p.turfHi, 0.2, p.turfLo, 0.38],
    water: [p.wave, 0.16, p.deep, 0.7], deep: [p.water, 0.3, p.troughs, 0.5], shallows: [p.shallowHi, 0.55, p.shallow, 0],
    // Boards, cobbles, flags and deck plate: fewer, fainter patches (wear and grime).
    planks: [p.plankHi, 0.15, p.gap, 0.2, true], planksV: [p.plankHi, 0.15, p.gap, 0.2, true],
    cobbles: [p.hi, 0.15, p.gap, 0.22, true], flags: [p.hi, 0.18, p.lo, 0.32, true], plate: [p.hi, 0.12, p.rust, 0.28, true],
    // Merrow: its street, square and setts worn like the cobbles; the flood in long soft
    // swells; the shallows lighter where the street rises, darker where it dips.
    townCobbles: [p.hi, 0.14, p.gap, 0.22, true], townFlags: [p.hi, 0.14, p.lo, 0.24, true],
    setts: [p.settHi ?? p.hi, 0.14, p.settGap ?? p.gap, 0.2, true],
    clearWater: [p.wave, 0.12, p.deep, 0.45], clearShallows: [p.shallowHi, 0.12, p.water, 0.28],
    ...(look.patches ?? {}),
  };
  const patch = names.map((k) => {
    const v = PATCH[k];
    if (!v) return null;
    // Indoors: only the floor, and only half as strong (gentle wear, no blotches).
    if (indoor && (look.isWater(k) || isShallow(k) || isTownWet(k))) return null;
    // (Flagstones and deck plate keep their full stains indoors: a big hall of them reads as a grid without.)
    const soft = indoor && k !== 'flags' && k !== 'plate' && k !== 'path' ? 0.5 : 1;
    const hard = Boolean(v[4]) || indoor;
    return { light: rgb(v[0]), la: v[1] * soft, dark: rgb(v[2]), da: v[3] * soft, water: look.isWater(k) || isShallow(k) || isTownWet(k), salt: k.length * 13, hi: hard ? 0.72 : 0.66, lo: hard ? 0.28 : 0.34 };
  });
  const fields = new Map();
  const fieldFor = (sx, sy, seed) => {
    const key = `${sx},${sy},${seed}`;
    if (!fields.has(key)) fields.set(key, noiseField(PW, PH, sx, sy, seed));
    return fields.get(key);
  };
  const bigField = fieldFor(72, 72, 5);
  for (const pt of patch) {
    if (!pt) continue;
    pt.a = pt.water ? fieldFor(30, 11, pt.salt) : fieldFor(22, 22, pt.salt);
    pt.b = pt.water ? fieldFor(10, 5, pt.salt + 1) : fieldFor(8, 8, pt.salt + 1);
    pt.wa = pt.water ? 0.65 : 0.62;
  }
  for (let Y = 0; Y < PH; Y++) {
    for (let X = 0; X < PW; X++) {
      const i = Y * PW + X;
      const pt = patch[vis[i]];
      if (!pt || covered[i]) continue;
      const n = pt.a(X, Y) * pt.wa + pt.b(X, Y) * (1 - pt.wa) + (bigField(X, Y) - 0.5) * 0.3;
      const t = n + (BAYER[(Y & 3) * 4 + (X & 3)] / 16 - 0.5) * 0.07;
      const q = i * 4;
      if (t > pt.hi) mix(d, q, pt.light, pt.la);
      else if (t < pt.lo) {
        if (pt.da) mix(d, q, pt.dark, pt.da);
        else dim(d, q, 0.93);
      }
    }
  }

  // Things blown over an edge from the ground beside it (Chapter 3: red leaves over the
  // path's edges), thinning out the further in they lie.
  for (const rule of look.edgeScatter ?? []) {
    const on = ids.get(rule.on);
    const from = ids.get(rule.from);
    if (!on || !from) continue;
    const cols = rule.colors.map(rgb);
    for (let Y = 0; Y < PH - 1; Y++) {
      for (let X = 0; X < PW - 1; X++) {
        const i = Y * PW + X;
        if (vis[i] !== on || bestOther[i] !== from || !best[i] || covered[i]) continue;
        if (h2(X, Y, 131) >= rule.chance[best[i] - 1]) continue;
        const c = cols[Math.floor(h2(X, Y, 132) * cols.length)];
        put(d, i * 4, c);
        if (vis[i + 1] === on && !covered[i + 1]) put(d, (i + 1) * 4, c);
        if (h2(X, Y, 133) < 0.3 && vis[i + PW] === on && !covered[i + PW]) dim(d, (i + PW) * 4, 0.8);
      }
    }
  }

  // Merrow's flood deepens away from the street: the drowned cobbles fade into the dark
  // the further the water is from anything standing out of it.
  if (look.town) {
    const far = new Float32Array(W * H).fill(99);
    const queue = [];
    for (let ty = 0; ty < H; ty++) for (let tx = 0; tx < W; tx++) {
      const k = kindName(tx, ty);
      const c = room.tiles[ty][tx];
      if ((k && k !== 'clearWater') || c === 'b' || c === 'B') { far[ty * W + tx] = 0; queue.push(ty * W + tx); }
    }
    for (let h = 0; h < queue.length; h++) {
      const i = queue[h];
      const tx = i % W;
      const ty = (i - tx) / W;
      for (const [dx, dy, step] of [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.4], [-1, 1, 1.4], [1, -1, 1.4], [-1, -1, 1.4]]) {
        const nx = tx + dx;
        const ny = ty + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const j = ny * W + nx;
        if (far[i] + step < far[j]) { far[j] = far[i] + step; queue.push(j); }
      }
    }
    const farAt = (fx, fy) => far[Math.min(H - 1, Math.max(0, fy)) * W + Math.min(W - 1, Math.max(0, fx))];
    const deepCol = rgb(p.deep);
    const wobbleField = fieldFor(26, 18, 63);
    const water = ids.get('clearWater');
    for (let Y = 0; Y < PH && water; Y++) {
      const gy = Y / T - 0.5;
      const iy = Math.floor(gy);
      const vy = gy - iy;
      for (let X = 0; X < PW; X++) {
        const i = Y * PW + X;
        if (vis[i] !== water || covered[i]) continue;
        const gx = X / T - 0.5;
        const ix = Math.floor(gx);
        const vx = gx - ix;
        const top = farAt(ix, iy) * (1 - vx) + farAt(ix + 1, iy) * vx;
        const bottom = farAt(ix, iy + 1) * (1 - vx) + farAt(ix + 1, iy + 1) * vx;
        const dist = Math.min(top * (1 - vy) + bottom * vy, 20);
        const a = Math.max(0, Math.min(1, (dist - 1.2) / 3.5)) * (0.75 + wobbleField(X, Y) * 0.5) * 0.55;
        if (a > 0.02) mix(d, i * 4, deepCol, a);
      }
    }
  }

  // The dark rock above the walls: patches too, instead of a block per tile.
  if (p.topRock && !indoor) {
    const light = rgb(p.topRock);
    const dark = rgb(p.deepRock2);
    const fa = fieldFor(14, 14, 61);
    const fb = fieldFor(5, 5, 62);
    for (let ty = 0; ty < H; ty++) {
      for (let tx = 0; tx < W; tx++) {
        const c = room.tiles[ty][tx];
        if (!isTop(c)) continue;
        const rim = letter(tx, ty + 1) != null && !isTop(letter(tx, ty + 1));
        for (let ly = 0; ly < (rim ? T - 3 : T); ly++) {
          const Y = ty * T + ly;
          for (let lx = 0; lx < T; lx++) {
            const X = tx * T + lx;
            const i = Y * PW + X;
            if (covered[i]) continue;
            const t = fa(X, Y) * 0.65 + fb(X, Y) * 0.35 + (BAYER[(Y & 3) * 4 + (X & 3)] / 16 - 0.5) * 0.08;
            if (t > 0.64) mix(d, i * 4, light, 0.6);
            else if (t < 0.32) mix(d, i * 4, dark, 0.5);
          }
        }
      }
    }
  }

  // --- 4. Walls: shadow on the ground along them, rough natural rock ---
  const rock = {
    deep: rgb(p.deepRock), deep2: rgb(p.deepRock2), lo: rgb(p.rockLo), rim: rgb(p.rim), stones: (p.rock ?? []).map(rgb),
  };
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W; tx++) {
      if (!kindAt[ty * W + tx]) continue;
      const wl = wallOf(tx - 1, ty);
      const wr = wallOf(tx + 1, ty);
      const wu = wallOf(tx, ty - 1);
      const wul = !wl && !wu && wallOf(tx - 1, ty - 1);
      const wur = !wr && !wu && wallOf(tx + 1, ty - 1);
      if (!wl && !wr && !wu && !wul && !wur) continue;
      for (let ly = 0; ly < T; ly++) {
        for (let lx = 0; lx < T; lx++) {
          let ao = 0;
          if (wl) ao += Math.max(0, 4 - lx) * 0.055;
          if (wr) ao += Math.max(0, 4 - (T - 1 - lx)) * 0.055;
          if (wu) ao += Math.max(0, 8 - ly) * 0.022;
          if (wul) ao += Math.max(0, 4 - Math.hypot(lx + 0.5, ly + 0.5)) * 0.06;
          if (wur) ao += Math.max(0, 4 - Math.hypot(T - lx - 0.5, ly + 0.5)) * 0.06;
          if (!ao) continue;
          const i = (ty * T + ly) * PW + tx * T + lx;
          if (covered[i]) continue;
          dim(d, i * 4, 1 - Math.min(0.42, ao) * (indoor ? 0.7 : 1));
        }
      }
    }
  }
  const ground = (X, Y) => X >= 0 && Y >= 0 && X < PW && Y < PH && vis[Y * PW + X] && !covered[Y * PW + X];
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W; tx++) {
      if (wallOf(tx, ty) !== 2) continue;
      const c = letter(tx, ty);
      const face = faceSet.includes(c);
      // The overhang under the clifftop: its lit rim comes down 0 to 2 px, wandering, and in
      // places the clifftop's rock hangs lower in blocks (up to 8 px), so a long face isn't a
      // ruled band of the same height all along.
      if (face && isTop(letter(tx, ty - 1)) && wallOf(tx, ty - 1) === 2) {
        for (let lx = 0; lx < T; lx++) {
          const X = tx * T + lx;
          const n = Math.round(wobble(X, ty * 31 + 5) * 2.6) + Math.max(hangBlock(X, ty * 29 + 3, 9), hangBlock(X + 5, ty * 29 + 4, 13));
          if (!n) continue;
          const y0 = ty * T - 3;
          for (let k = 0; k < n; k++) { const i = (y0 + k) * PW + X; if (!covered[i]) put(d, i * 4, rock.deep); }
          const prof = [rock.rim, rock.lo, rock.deep2];
          prof.forEach((col, k) => { const i = (y0 + n + k) * PW + X; if (y0 + n + k < PH && !covered[i]) put(d, i * 4, col); });
        }
      }
      // A clifftop straight onto ground (no face): its lit edge wanders down over the ground.
      if (isTop(c) && kindName(tx, ty + 1) && !look.isWater(kindName(tx, ty + 1))) {
        for (let lx = 0; lx < T; lx++) {
          const X = tx * T + lx;
          const n = Math.round(wobble(X, ty * 37 + 11) * 3) - 1;
          if (n <= 0) continue;
          const y0 = (ty + 1) * T - 3;
          for (let k = 0; k < n; k++) { const i = (y0 + k) * PW + X; if (!covered[i]) put(d, i * 4, rock.deep); }
          [rock.rim, rock.lo, rock.deep2].forEach((col, k) => { if (ground(X, y0 + n + k) || y0 + n + k < (ty + 1) * T) put(d, ((y0 + n + k) * PW + X) * 4, col); });
          if (ground(X, y0 + n + 3)) dim(d, ((y0 + n + 3) * PW + X) * 4, 0.8);
        }
      }
      // The foot of a rock face over ground: ragged, with a stone or two fallen from it.
      if (face && ground(tx * T, (ty + 1) * T) && !look.isWater(kindName(tx, ty + 1)) && kindName(tx, ty + 1) !== 'shallows') {
        const Y0 = (ty + 1) * T;
        for (let lx = 0; lx < T; lx++) {
          const X = tx * T + lx;
          const n = Math.round(wobble(X, ty * 53 + 9) * 4.2) - 1;
          if (n < 0) {
            // The face stops a pixel short: the ground shows (from just below).
            const i = (Y0 - 1) * PW + X;
            const j = (Y0 + 1) * PW + X;
            if (!covered[i] && !covered[j]) { d[i * 4] = d[j * 4]; d[i * 4 + 1] = d[j * 4 + 1]; d[i * 4 + 2] = d[j * 4 + 2]; }
            continue;
          }
          for (let k = 0; k < n; k++) if (ground(X, Y0 + k)) put(d, ((Y0 + k) * PW + X) * 4, k === n - 1 ? rock.deep2 : rock.lo);
          for (let k = 0; k < 2; k++) if (ground(X, Y0 + n + k)) dim(d, ((Y0 + n + k) * PW + X) * 4, k ? 0.88 : 0.74);
        }
        if (h2(tx, ty, 88) < 0.1) {
          // A block fallen from the face, lying at its foot with its shadow.
          const bw = 5 + Math.floor(h2(tx, ty, 89) * 3);
          const sx = tx * T + 1 + Math.floor(h2(tx, ty, 90) * (T - bw - 1));
          const sy = Y0 + 3;
          const col = rock.stones[Math.floor(h2(tx, ty, 87) * rock.stones.length)] ?? rock.lo;
          let fits = true;
          for (let dy = -1; dy <= 4 && fits; dy++) for (let dx = 0; dx <= bw; dx++) if (!ground(sx + dx, sy + dy)) { fits = false; break; }
          if (fits) {
            for (let dx = 0; dx <= bw; dx++) dim(d, ((sy + 4) * PW + sx + dx) * 4, 0.7);
            for (let dy = 0; dy < 4; dy++) for (let dx = 0; dx < bw; dx++) put(d, ((sy + dy) * PW + sx + dx) * 4, dy === 0 ? rock.rim : dy === 3 || dx === bw - 1 ? rock.deep2 : dx === 0 ? col : (dx + dy) % 4 === 0 ? rock.lo : col);
            put(d, ((sy - 1) * PW + sx + 1) * 4, rock.rim);
            put(d, ((sy - 1) * PW + sx + 2) * 4, rock.rim);
          }
        } else if (h2(tx, ty, 91) < 0.45) {
          const sx = tx * T + 2 + Math.floor(h2(tx, ty, 92) * 11);
          const sy = Y0 + 3 + Math.floor(h2(tx, ty, 93) * 3);
          const col = rock.stones[Math.floor(h2(tx, ty, 94) * rock.stones.length)] ?? rock.lo;
          const pix = [[0, 0, col], [1, 0, col], [2, 0, rock.lo], [0, -1, rock.rim], [1, -1, col], [0, 1, rock.deep2], [1, 1, rock.deep2], [2, 1, rock.deep2]];
          if (pix.every(([dx, dy]) => ground(sx + dx, sy + dy))) for (const [dx, dy, cl] of pix) put(d, ((sy + dy) * PW + sx + dx) * 4, cl);
        }
      }
      // A crag (coastTiles.js `crag`): its rock, top or face, reaches well out over the ground beside
      // it and below it in broken lumps (the rock's own picture, mirrored out across the edge), with a
      // lit or dark rim and its shadow on the ground.
      const crag = look.crag && look.crag.at(tx, ty) && (isTop(c) || face);
      const cragTop = crag && isTop(c);
      // Lumps along an edge: round bulges of 4 to 9 px, each its own size, over a slow wobble.
      const lumpy = (along, seed, max) => {
        const a = along + Math.floor(h2(seed, 0, 71) * 9);
        let at0 = 0;
        let i = 0;
        let len = 5;
        for (; ; i++) { len = 4 + Math.floor(h2(i, seed, 72) * 6); if (at0 + len > (a % 4096)) break; at0 += len; }
        const u = (a % 4096) - at0 + 0.5;
        const bulge = Math.sqrt(Math.max(0, 1 - ((u - len / 2) / (len / 2 + 0.4)) ** 2));
        return Math.round(wobble(along, seed) * 2.5 + h2(i, seed, 73) * (max - 2.5) * bulge);
      };
      const fromSrc = (X, Y) => { const j = (Y * PW + X) * 4; return [src[j], src[j + 1], src[j + 2]]; };
      if (crag) {
        for (const side of [-1, 1]) {
          const k = kindName(tx + side, ty);
          if (!k || look.isWater(k) || k === 'shallows') continue;
          for (let ly = 0; ly < T; ly++) {
            const Y = ty * T + ly;
            const n = Math.max(1, lumpy(Y, tx * 17 + (side > 0 ? 3 : 0), 8));
            for (let s = 0; s < n; s++) {
              const X = side < 0 ? tx * T - 1 - s : tx * T + T + s;
              if (!ground(X, Y)) continue;
              const inside = side < 0 ? tx * T + s : tx * T + T - 1 - s;
              const col = s === n - 1 ? (side > 0 ? rock.deep2 : rock.rim) : cragTop ? rgb(look.crag.top(X, Y)) : fromSrc(inside, Y);
              put(d, (Y * PW + X) * 4, col);
            }
            for (let s = 0; s < 3; s++) {
              const X = side < 0 ? tx * T - 1 - n - s : tx * T + T + n + s;
              if (ground(X, Y)) dim(d, (Y * PW + X) * 4, [0.62, 0.75, 0.88][s]);
            }
          }
        }
        // A clifftop with the ground just north of it (the far lip of a cleft): its broken edge rises
        // over the ground in lumps, lit along the top by the sky.
        const ku = kindName(tx, ty - 1);
        if (cragTop && ku && !look.isWater(ku) && ku !== 'shallows') {
          for (let lx = 0; lx < T; lx++) {
            const X = tx * T + lx;
            const n = Math.max(1, lumpy(X, ty * 67 + 5, 6));
            for (let k = 0; k < n; k++) {
              const Y = ty * T - 1 - k;
              if (ground(X, Y)) put(d, (Y * PW + X) * 4, k === n - 1 ? rock.rim : rgb(look.crag.top(X, Y)));
            }
            const Y = ty * T - 1 - n;
            if (ground(X, Y)) dim(d, (Y * PW + X) * 4, 0.8);
          }
        }
        // A face's foot on the ground: lumps of it coming down over the ground.
        const kd = kindName(tx, ty + 1);
        if (face && kd && !look.isWater(kd) && kd !== 'shallows') {
          const Y0 = (ty + 1) * T;
          for (let lx = 0; lx < T; lx++) {
            const X = tx * T + lx;
            const n = lumpy(X, ty * 61 + 7, 6);
            for (let k = 0; k < n; k++) if (ground(X, Y0 + k)) put(d, ((Y0 + k) * PW + X) * 4, k === n - 1 ? rock.deep2 : fromSrc(X, Y0 - 1 - k));
            for (let k = 0; k < 3; k++) if (ground(X, Y0 + n + k)) dim(d, ((Y0 + n + k) * PW + X) * 4, [0.66, 0.78, 0.9][k]);
          }
        }
      }
      // Rock jutting out over the ground or the water beside it (foam where the sea meets it).
      for (const side of [-1, 1]) {
        const k = kindName(tx + side, ty);
        if (!k || (crag && !look.isWater(k) && k !== 'shallows')) continue;
        const wet = look.isWater(k) || k === 'shallows';
        for (let ly = 0; ly < T; ly++) {
          const Y = ty * T + ly;
          const n = Math.round(wobble(Y, tx * 17 + (side > 0 ? 3 : 0)) * 3.6) - 1;
          for (let s = 0; s < n; s++) {
            const X = side < 0 ? tx * T - 1 - s : tx * T + T + s;
            if (ground(X, Y)) put(d, (Y * PW + X) * 4, s === n - 1 ? rock.deep2 : face ? rock.lo : rock.deep);
          }
          if (wet) {
            const X = side < 0 ? tx * T - 1 - Math.max(0, n) : tx * T + T + Math.max(0, n);
            if (ground(X, Y) && h2(X, Y, 97) < 0.6) mix(d, (Y * PW + X) * 4, C.foam, 0.55);
          }
        }
      }
      // Rock with open ground above it (a boulder of the cliff, a spur): its top edge is rough.
      if (isTop(c) && kindName(tx, ty - 1) && !look.isWater(kindName(tx, ty - 1)) && kindName(tx, ty - 1) !== 'shallows') {
        for (let lx = 0; lx < T; lx++) {
          const X = tx * T + lx;
          const n = Math.round(wobble(X, ty * 43 + 2) * 3.4) - 1;
          for (let k = 0; k < n; k++) {
            const Y = ty * T - 1 - k;
            if (ground(X, Y)) put(d, (Y * PW + X) * 4, k === n - 1 ? rock.deep2 : rock.deep);
          }
          const Y = ty * T - 1 - Math.max(0, n);
          if (ground(X, Y)) dim(d, (Y * PW + X) * 4, 0.85);
        }
      }
      // A rock face standing in the sea: its foot is ragged too, with foam along it.
      if (face && (look.isWater(kindName(tx, ty + 1)) || kindName(tx, ty + 1) === 'shallows')) {
        const Y0 = (ty + 1) * T;
        for (let lx = 0; lx < T; lx++) {
          const X = tx * T + lx;
          const n = Math.round(wobble(X, ty * 59 + 4) * 2.6);
          for (let k = 0; k < n; k++) if (ground(X, Y0 + k)) put(d, ((Y0 + k) * PW + X) * 4, rock.deep2);
          if (ground(X, Y0 + n) && h2(X, Y0, 98) < 0.7) mix(d, ((Y0 + n) * PW + X) * 4, C.foam, 0.6);
        }
      }
    }
  }

  // Sunnyside's hedges: leaves bulging past their straight edges, a shadow under them.
  if (look.hedge) roughHedges();
  function roughHedges() {
    const H2 = look.hedge;
    const col = { dark: rgb(H2.dark), mid: rgb(H2.mid), light: rgb(H2.light), top: rgb(H2.top), topHi: rgb(H2.topHi), topLo: rgb(H2.topLo) };
    // (A look can name its own hedge letters, and which of them show a face: Chapter 3's bramble.)
    const hedgeSet = H2.letters ?? '#WVH';
    const hedgeFaces = H2.faces ?? 'WVH';
    const isHedge = (c) => c != null && hedgeSet.includes(c);
    // Round clumps of leaves along an edge: how far the clump reaches past it at this point.
    const clump = (along, line, seed) => {
      const a = along + line * 3;
      const idx = Math.floor(a / 6);
      const u = a - idx * 6 + 0.5;
      const reach = 1 + Math.floor(h2(idx, line, seed) * 3);
      return Math.round(reach * Math.sqrt(Math.max(0, 1 - ((u - 3) / 3.3) ** 2)));
    };
    for (let ty = 0; ty < H; ty++) {
      for (let tx = 0; tx < W; tx++) {
        const c = letter(tx, ty);
        if (!isHedge(c)) continue;
        const face = hedgeFaces.includes(c);
        // The foot: clumps of leaves hanging down over the ground, and their shadow.
        if (kindName(tx, ty + 1) && (face || !isHedge(letter(tx, ty + 1)))) {
          const Y0 = (ty + 1) * T;
          for (let lx = 0; lx < T; lx++) {
            const X = tx * T + lx;
            const n = clump(X, ty, 7);
            for (let k = 0; k < n; k++) if (ground(X, Y0 + k)) put(d, ((Y0 + k) * PW + X) * 4, k === n - 1 ? col.dark : face ? col.mid : col.topLo);
            if (n && h2(X, ty, 8) < 0.12 && ground(X, Y0)) put(d, (Y0 * PW + X) * 4, face ? col.light : col.top);
            for (let k = 0; k < 2; k++) if (ground(X, Y0 + n + k)) dim(d, ((Y0 + n + k) * PW + X) * 4, k ? 0.88 : 0.76);
          }
        }
        // The top, where open ground lies beyond it: leaves poking up.
        if (!face && kindName(tx, ty - 1) && !isHedge(letter(tx, ty - 1))) {
          for (let lx = 0; lx < T; lx++) {
            const X = tx * T + lx;
            const n = clump(X, ty, 9);
            for (let k = 0; k < n; k++) {
              const Y = ty * T - 1 - k;
              if (ground(X, Y)) put(d, (Y * PW + X) * 4, k === n - 1 ? col.topHi : col.top);
            }
          }
        }
        // The sides: leaves jutting over the ground beside it.
        for (const side of [-1, 1]) {
          if (!kindName(tx + side, ty) || isHedge(letter(tx + side, ty))) continue;
          for (let ly = 0; ly < T; ly++) {
            const Y = ty * T + ly;
            const n = clump(Y, tx * 2 + (side > 0 ? 1 : 0), 11);
            for (let k = 0; k < n; k++) {
              const X = side < 0 ? tx * T - 1 - k : tx * T + T + k;
              if (ground(X, Y)) put(d, (Y * PW + X) * 4, k === n - 1 ? col.dark : face ? col.mid : col.topLo);
            }
            const X = side < 0 ? tx * T - 1 - n : tx * T + T + n;
            if (ground(X, Y)) dim(d, (Y * PW + X) * 4, 0.85);
          }
        }
      }
    }
  }

  ctx.putImageData(img, 0, 0);
  if (indoor) return;

  // --- 5. Little things lying about ---
  // (A look can add its own little things: leaves, toadstools, roots, rubble.)
  const STAMPS = { ...decalStamps(p), ...(look.stamps?.(p) ?? {}) };
  const LIST = {
    sand: ['shell', 'pebble', 'twig', 'weed', 'pebble', 'shell'],
    shingle: ['pebble', 'weed', 'shell', 'twig', 'stone'],
    rockfloor: ['crack', 'puddle', 'barnacles', 'weed', 'puddle', 'crack'],
    turf: ['tuft', 'flowers', 'clover', 'tuft', 'pebble'],
    path: ['pebble', 'pebble', 'tuft', 'puddle', 'twig'],
    shallows: ['ripple', 'weed', 'pebble', 'ripple'],
    water: ['fleck', 'weedFloat'],
    // (Boards, stones and iron plate get a dark wet patch, not a blue pool: on built floors a
    // pool of sea colour read as a stray blue dot.)
    planks: ['wet', 'weed', 'twig'], planksV: ['wet', 'weed', 'twig'],
    cobbles: ['weed', 'wet', 'pebble'], flags: ['crack', 'weed', 'wet'], plate: ['wet', 'crack'],
    townCobbles: ['weed', 'wet', 'pebble'], townFlags: ['crack', 'weed', 'wet'], setts: ['weed', 'wet'],
    clearShallows: ['ripple', 'weed', 'ripple'], clearWater: ['fleck', 'weedFloat'],

    // (A look can swap a kind's list: no shells down a mine.)
    ...(look.lists ?? {}),
  };
  const CHANCE = {
    sand: 0.32, shingle: 0.28, rockfloor: 0.3, turf: 0.34, path: 0.26, shallows: 0.24, water: 0.07,
    planks: 0.07, planksV: 0.07, cobbles: 0.07, flags: 0.1, plate: 0.08,
    townCobbles: 0.07, townFlags: 0.09, setts: 0.07, clearShallows: 0.2, clearWater: 0.05,

    ...(look.chance ?? {}),
  };
  // No rain puddles on the sunny beach.
  const sunny = ['gullrest', 'sunnyside'].includes(room.tileLook ?? room.area);
  const CELL = 19;
  for (let cy = 0; cy * CELL < PH; cy++) {
    for (let cx = 0; cx * CELL < PW; cx++) {
      const X = cx * CELL + 3 + Math.floor(h2(cx, cy, 101) * (CELL - 6));
      const Y = cy * CELL + 3 + Math.floor(h2(cx, cy, 102) * (CELL - 6));
      if (X >= PW - 3 || Y >= PH - 3) continue;
      const id = vis[Y * PW + X];
      const k = names[id];
      const list = LIST[k];
      if (!list || h2(cx, cy, 103) > CHANCE[k]) continue;
      // Only on open ground of one kind, away from walls and edges.
      let clear = true;
      for (let dy = -3; dy <= 3 && clear; dy++) for (let dx = -3; dx <= 3 && clear; dx++) {
        const j = (Y + dy) * PW + X + dx;
        if (vis[j] !== id || covered[j]) clear = false;
      }
      const tx = Math.floor(X / T);
      const ty = Math.floor(Y / T);
      if (!clear || wallOf(tx, ty - 1) || wallOf(tx - 1, ty) || wallOf(tx + 1, ty)) continue;
      const name = list[Math.floor(h2(cx, cy, 104) * list.length)];
      if (sunny && (name === 'puddle' || name === 'wet')) continue;
      STAMPS[name]?.(ctx, X, Y, h2(cx, cy, 105));
    }
  }
}

// The little things, drawn at (x, y) with this area's colours; roll picks a variant.
function decalStamps(p) {
  const f = (ctx, c, x, y, w = 1, h = 1) => { if (!c) return; ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const one = (list, roll) => (list && list.length ? list[Math.floor(roll * list.length) % list.length] : null);
  const weed = p.weed ?? p.weedFoot ?? [p.turfLo];
  return {
    shell(ctx, x, y, r) {
      const c = one(p.shells ?? [p.hi], r);
      f(ctx, c, x, y, 2, 1);
      f(ctx, c, x, y + 1, 3, 1);
      f(ctx, '#ffffff', x, y, 1, 1);
      f(ctx, p.lo, x + 1, y + 2, 2, 1);
    },
    pebble(ctx, x, y, r) {
      const c = one(p.speck, r) ?? p.lo;
      f(ctx, c, x, y, 3, 2);
      f(ctx, p.hi, x, y, 2, 1);
      f(ctx, p.crack ?? p.lo, x + 1, y + 2, 3, 1);
      if (r > 0.5) { f(ctx, c, x + 4, y + 1, 2, 1); f(ctx, p.hi, x + 4, y + 1, 1, 1); }
    },
    stone(ctx, x, y, r) {
      f(ctx, p.crack ?? p.lo, x - 1, y + 2, 6, 1);
      f(ctx, p.lo, x - 1, y, 5, 2);
      f(ctx, one(p.speck, r) ?? p.lo, x, y - 1, 3, 1);
      f(ctx, p.hi, x, y - 1, 2, 1);
    },
    twig(ctx, x, y, r) {
      const c = p.driftwood ?? p.plankHi ?? p.hi;
      const up = r > 0.5 ? -1 : 1;
      f(ctx, c, x - 2, y, 3, 1);
      f(ctx, c, x + 1, y + up, 3, 1);
      f(ctx, p.lo, x - 2, y + 1, 3, 1);
      f(ctx, c, x + 3, y + up - (up < 0 ? 1 : -1), 1, 1);
    },
    weed(ctx, x, y, r) {
      f(ctx, one(weed, r), x - 1, y, 2, 1);
      f(ctx, one(weed, 1 - r), x, y + 1, 3, 1);
      f(ctx, one(weed, r * 0.5), x + 2, y, 1, 1);
      f(ctx, p.weedHi ?? p.turfHi, x, y, 1, 1);
    },
    crack(ctx, x, y, r) {
      let cx = x;
      const len = 4 + Math.floor(r * 4);
      for (let i = 0; i < len; i++) {
        f(ctx, p.crack ?? p.lo, cx, y + i - 2, 1, 1);
        if (i % 2) cx += r > 0.5 ? 1 : -1;
      }
      f(ctx, p.hi, x + 1, y - 2, 1, 2);
    },
    puddle(ctx, x, y, r) {
      const c = p.troughs ?? p.deep;
      f(ctx, c, x - 2, y, 6, 2);
      f(ctx, c, x - 1, y - 1, 4, 1);
      f(ctx, c, x - 1, y + 2, 4, 1);
      f(ctx, p.water, x - 1, y, 4, 1);
      f(ctx, p.glint ?? p.wave, x - 1, y, 2, 1);
      if (r > 0.6) f(ctx, p.glint ?? p.wave, x + 2, y + 1, 1, 1);
    },
    wet(ctx, x, y, r) {
      const c = p.crack ?? p.lo;
      f(ctx, p.lo, x - 2, y, 6, 2);
      f(ctx, p.lo, x - 1, y - 1, 4, 1);
      f(ctx, c, x - 1, y, 3, 1);
      if (r > 0.6) f(ctx, p.hi, x + 1, y + 1, 1, 1);
    },
    barnacles(ctx, x, y, r) {
      const c = p.fleck ?? p.hi;
      for (let i = 0; i < 4; i++) {
        const bx = x + ((i * 3 + Math.floor(r * 5)) % 5) - 2;
        const by = y + ((i * 2 + Math.floor(r * 3)) % 3) - 1;
        f(ctx, p.lo, bx, by + 1, 2, 1);
        f(ctx, c, bx, by, 1, 1);
      }
    },
    tuft(ctx, x, y, r) {
      f(ctx, p.turfLo, x - 1, y, 1, 2);
      f(ctx, p.turfHi, x, y - 1, 1, 3);
      f(ctx, p.turfLo, x + 1, y, 1, 2);
      if (r > 0.4) f(ctx, p.turfHi, x + 2, y - 1, 1, 2);
      f(ctx, p.turfLo, x - 1, y + 2, 4, 1);
    },
    flowers(ctx, x, y, r) {
      const c = one(p.flowers, r);
      if (!c) return this.tuft(ctx, x, y, r);
      f(ctx, p.turfHi, x, y + 1, 1, 2);
      f(ctx, c, x, y, 1, 1);
      f(ctx, c, x + 2, y + 1, 1, 1);
      f(ctx, p.turfHi, x + 2, y + 2, 1, 1);
      f(ctx, one(p.flowers, 1 - r), x - 2, y + 2, 1, 1);
    },
    clover(ctx, x, y, r) {
      const c = one(p.turf, r) ?? p.turfHi;
      f(ctx, p.turfHi, x - 1, y, 2, 1);
      f(ctx, c, x - 2, y + 1, 4, 1);
      f(ctx, p.turfHi, x + 1, y + 1, 2, 1);
      f(ctx, p.turfLo, x - 1, y + 2, 4, 1);
    },
    ripple(ctx, x, y) {
      f(ctx, p.shallowHi, x - 2, y, 5, 1);
      f(ctx, p.shallowHi, x - 3, y + 1, 1, 1);
      f(ctx, p.shallowHi, x + 3, y + 1, 1, 1);
    },
    fleck(ctx, x, y) {
      f(ctx, p.foam, x, y, 2, 1);
      f(ctx, p.wave, x - 1, y + 1, 4, 1);
    },
    weedFloat(ctx, x, y, r) {
      f(ctx, one(weed, r), x - 2, y, 4, 1);
      f(ctx, one(weed, 1 - r), x, y + 1, 3, 1);
      f(ctx, p.troughs, x - 2, y + 2, 5, 1);
    },
  };
}
