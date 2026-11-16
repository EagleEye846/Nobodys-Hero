import { TILE_SIZE as T } from '../config.js';

// How Chapter 6's Ash Road looks (area `ashroad`): the land north-east of the
// coast that burned about a hundred years ago and never quite went out. Soft
// grey ash lying like snow over everything, the old road's flagstones showing
// through it here and there, burnt stubble, black trees with no leaves, rock
// dusted grey, and cracks in the ground where it still smoulders. The first
// room is the bare seabed the sea pulled back from (rippled sand, the last
// pools). tileset.js calls installAshTiles at its very end; the soft edges
// between the grounds are drawn by tileBlend.js with ashBlendLook (below).
//
// Letters (each keeps the solidity it has everywhere else, except `*`, new):
//   .  ash (floor)                 :  the old road, flagstones under ash (floor)
//   ,  burnt stubble in ash (floor)  q  bare seabed sand, rippled (floor)
//   X  old cobbles, swept (floor)   ~  a pool the sea left behind (solid)
//   #  rock top (solid)  W  rock face (solid)  m / M  the same, for inner ridges
//   O  a charred boulder (solid)    R  burnt rubble (solid)   f  charred fence (solid)
//   T  a burnt tree (standing)      J  a burnt stump or a broken post (standing)
//   b / B  ash-topped rock ledges (12 / 24 high)
//   *  a hot crack: the ground split and still smouldering (solid, NEW). Ash
//      blown into it smothers it (ashRoad.js) and it can be walked on.

export const ASH_AREAS = new Set(['ashroad']);

function hash(tx, ty, salt = 0) {
  let h = (tx * 374761393 + ty * 668265263 + salt * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const pick = (list, roll) => list[Math.floor(roll * list.length) % list.length];
const px = (ctx, color, x, y, w = 1, h = 1) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };
const rnd = (tx, ty, salt, n) => Math.floor(hash(tx, ty, salt) * n);

// --- Palettes ---
const ASH = ['#8b8782', '#8d8984', '#8a8681', '#8c8883'];
const ASH_HI = '#a6a29b';
const ASH_LO = '#74706b';
const FLAKE = '#c9c5bd';
const CHAR = '#2c2826';
const STONE = ['#6c6660', '#68625c', '#716a64'];
const STONE_HI = '#7e7770';
const JOINT = '#55504b';
const STUBBLE = ['#6f6a64', '#716b65'];
const STALK = ['#2e2621', '#3d3027', '#4a3a2c', '#241e1a'];
const SAND = ['#a8916e', '#ab9471', '#a58e6b'];
const SAND_HI = '#c2ab86';
const SAND_LO = '#8c7656';
const ROCK = ['#4a4440', '#4d4743', '#47413d'];
const ROCK_LO = '#332e2b';
const ROCK_DUST = '#7e7a74';
const FACE = ['#3b3532', '#38322f', '#3e3835'];
const FACE_LO = '#26211f';
const FACE_HI = '#4f4844';

// A soft lumpy patch of another tone (never a plain square).
function mottle(ctx, color, x, y, tx, ty, salt, size = 6) {
  const mx = rnd(tx, ty, salt, T - size);
  const my = rnd(tx, ty, salt + 1, T - size);
  px(ctx, color, x + mx, y + my + 1, size, size - 2);
  px(ctx, color, x + mx + 1, y + my, size - 2, size);
}

// --- Floors ---
function ashFloor(ctx, x, y, tx, ty) {
  px(ctx, pick(ASH, hash(tx, ty, 1)), x, y, T, T);
  // Smudges a shade off the ground, long and thin like ash the wind has laid (never round blobs).
  for (let i = 0; i < 3; i++) {
    if (hash(tx, ty, 2 + i) > 0.55) continue;
    const sx = x + rnd(tx, ty, 12 + i, 10);
    const sy = y + rnd(tx, ty, 15 + i, 14);
    const w = 3 + rnd(tx, ty, 18 + i, 6);
    px(ctx, i % 2 ? '#93908a' : '#83807a', sx, sy, w, 1);
    if (w > 5) px(ctx, i % 2 ? '#93908a' : '#83807a', sx + 1, sy + 1, w - 3, 1);
  }
  // Soft wind ripples in the ash: short pale lines with a shadow under.
  if (hash(tx, ty, 8) < 0.35) {
    const ry = y + 3 + rnd(tx, ty, 9, 10);
    const rx = x + rnd(tx, ty, 10, 6);
    const len = 5 + rnd(tx, ty, 11, 6);
    px(ctx, ASH_HI, rx, ry, len, 1);
    px(ctx, ASH_LO, rx + 1, ry + 1, len - 1, 1);
  }
  // Flakes, and the odd black crumb of char.
  for (let i = 0; i < 3; i++) {
    const r = hash(tx, ty, 20 + i);
    if (r < 0.5) px(ctx, r < 0.12 ? CHAR : FLAKE, x + rnd(tx, ty, 30 + i, 15), y + rnd(tx, ty, 40 + i, 15));
  }
}

function roadFloor(ctx, x, y, tx, ty) {
  ashFloor(ctx, x, y, tx, ty);
  // Two or three flagstones showing through, the ash lying in their joints.
  const stones = 1 + rnd(tx, ty, 50, 2);
  for (let i = 0; i < stones; i++) {
    const w = 7 + rnd(tx, ty, 51 + i, 5);
    const h = 5 + rnd(tx, ty, 55 + i, 3);
    const sx = x + rnd(tx, ty, 60 + i, T - w);
    const sy = y + rnd(tx, ty, 65 + i, T - h);
    px(ctx, JOINT, sx, sy + h, w, 1);
    px(ctx, pick(STONE, hash(tx, ty, 70 + i)), sx, sy, w, h);
    px(ctx, STONE_HI, sx, sy, w - 1, 1);
    // Ash lying over part of it, so it never shows whole.
    const cover = rnd(tx, ty, 80 + i, w - 2);
    px(ctx, pick(ASH, hash(tx, ty, 81 + i)), sx + cover, sy + 1, w - cover, h - 1);
    px(ctx, ASH_HI, sx + cover, sy + 1, 1, h - 2);
    if (hash(tx, ty, 85 + i) < 0.3) px(ctx, JOINT, sx + rnd(tx, ty, 86 + i, w), sy + 1, 1, h - 2);
  }
}

function stubbleFloor(ctx, x, y, tx, ty) {
  px(ctx, pick(STUBBLE, hash(tx, ty, 1)), x, y, T, T);
  if (hash(tx, ty, 2) < 0.5) mottle(ctx, ASH_LO, x, y, tx, ty, 3, 6);
  if (hash(tx, ty, 4) < 0.4) mottle(ctx, '#605a54', x, y, tx, ty, 5, 4);
  // Burnt stalks standing up out of the ash, a few lying flat.
  const n = 5 + rnd(tx, ty, 6, 5);
  for (let i = 0; i < n; i++) {
    const sx = x + rnd(tx, ty, 10 + i, 15);
    const sy = y + 3 + rnd(tx, ty, 30 + i, 12);
    const c = pick(STALK, hash(tx, ty, 50 + i));
    const tall = 2 + rnd(tx, ty, 70 + i, 3);
    if (hash(tx, ty, 90 + i) < 0.25) px(ctx, c, sx, sy, 3, 1);
    else {
      px(ctx, c, sx, sy - tall, 1, tall);
      if (hash(tx, ty, 110 + i) < 0.3) px(ctx, c, sx + 1, sy - tall - 1, 1, 1);
    }
  }
  if (hash(tx, ty, 130) < 0.4) px(ctx, FLAKE, x + rnd(tx, ty, 131, 15), y + rnd(tx, ty, 132, 15));
}

function sandFloor(ctx, x, y, tx, ty) {
  px(ctx, pick(SAND, hash(tx, ty, 1)), x, y, T, T);
  if (hash(tx, ty, 2) < 0.45) mottle(ctx, SAND_LO, x, y, tx, ty, 3, 6);
  // The sea's ripples, long and running across tiles (worked out from the world position).
  for (let row = 0; row < T; row++) {
    const wy = ty * T + row;
    const phase = Math.sin((tx * T) * 0.09 + wy * 0.05);
    if ((wy + Math.round(phase * 2)) % 5 !== 0) continue;
    for (let col = 0; col < T; col += 1) {
      const wx = tx * T + col;
      if (Math.sin(wx * 0.2 + wy) > 0.85) continue;
      px(ctx, SAND_HI, x + col, y + row, 1, 1);
      if (row + 1 < T) px(ctx, SAND_LO, x + col, y + row + 1, 1, 1);
    }
  }
  if (hash(tx, ty, 9) < 0.2) px(ctx, '#d8d0c0', x + rnd(tx, ty, 10, 14), y + rnd(tx, ty, 11, 14), 2, 1);
  // A stranded strand of dried weed, now and then.
  if (hash(tx, ty, 12) < 0.12) {
    const wx = x + rnd(tx, ty, 13, 8);
    const wy = y + 4 + rnd(tx, ty, 14, 9);
    for (let i = 0; i < 7; i++) px(ctx, i % 2 ? '#3e4a2c' : '#4e5a34', wx + i, wy + (i % 3 === 1 ? 1 : 0));
  }
}

function cobbleFloor(ctx, x, y, tx, ty) {
  px(ctx, '#4a4541', x, y, T, T);
  for (let row = 0; row < 4; row++) {
    const off = (row + ty) % 2 ? 2 : 0;
    for (let col = -1; col < 4; col++) {
      const cx = x + col * 4 + off;
      const cy = y + row * 4;
      const c = pick(STONE, hash(tx * 7 + col, ty * 5 + row, 3));
      const left = Math.max(x, cx);
      const right = Math.min(x + T, cx + 3);
      if (right <= left) continue;
      px(ctx, c, left, cy, right - left, 3);
      px(ctx, STONE_HI, left, cy, Math.max(1, right - left - 1), 1);
    }
  }
  if (hash(tx, ty, 9) < 0.5) mottle(ctx, ASH, x, y, tx, ty, 10, 4);
}

function poolTile(ctx, x, y, tx, ty, room) {
  px(ctx, '#3e4e52', x, y, T, T);
  if (hash(tx, ty, 2) < 0.5) mottle(ctx, '#4a5c60', x, y, tx, ty, 3, 6);
  if (hash(tx, ty, 4) < 0.35) px(ctx, '#8aa0a0', x + rnd(tx, ty, 5, 12), y + rnd(tx, ty, 6, 12), 3, 1);
  // The rim where it meets the sand: wet and dark.
  if (room && room.tileAt(tx, ty - 1) !== '~') px(ctx, '#2e3a3c', x, y, T, 2);
}

// --- Rock ---
function rockTop(ctx, x, y, tx, ty, room) {
  px(ctx, pick(ROCK, hash(tx, ty, 1)), x, y, T, T);
  for (let i = 0; i < 6; i++) {
    const r = hash(tx, ty, 2 + i);
    px(ctx, r < 0.5 ? ROCK_LO : '#55504b', x + rnd(tx, ty, 20 + i, 14), y + rnd(tx, ty, 30 + i, 15), 2 + rnd(tx, ty, 40 + i, 3), 1);
  }
  // Ash settled along the top in soft streaks.
  for (let i = 0; i < 2; i++) if (hash(tx, ty, 50 + i) < 0.6) px(ctx, ROCK_DUST, x + rnd(tx, ty, 52 + i, 10), y + rnd(tx, ty, 54 + i, 14), 3 + rnd(tx, ty, 56 + i, 4), 1);
  if (hash(tx, ty, 8) < 0.3) px(ctx, CHAR, x + rnd(tx, ty, 9, 14), y + rnd(tx, ty, 10, 14), 2, 1);
  const face = room?.tileAt(tx, ty + 1);
  if (face === 'W' || face === 'M') px(ctx, ROCK_DUST, x, y + T - 2, T, 1);
}

function rockFace(ctx, x, y, tx, ty, room) {
  px(ctx, pick(FACE, hash(tx, ty, 1)), x, y, T, T);
  // Strata: the rock in bands, the odd crack running down.
  for (let i = 0; i < 3; i++) {
    const sy = y + 3 + i * 5 + rnd(tx, ty, 2 + i, 2);
    px(ctx, FACE_LO, x, sy, T, 1);
    if (hash(tx, ty, 6 + i) < 0.5) px(ctx, FACE_HI, x + rnd(tx, ty, 9 + i, 8), sy - 1, 4 + rnd(tx, ty, 12 + i, 5), 1);
  }
  if (hash(tx, ty, 15) < 0.35) {
    let cx = 3 + rnd(tx, ty, 16, 10);
    for (let cy = 1; cy < 14; cy++) { px(ctx, FACE_LO, x + cx, y + cy); if (hash(tx, ty, 17 + cy) < 0.3) cx += hash(tx, ty, 40 + cy) < 0.5 ? -1 : 1; }
  }
  // Soot streaks from the fire, running down.
  if (hash(tx, ty, 50) < 0.4) px(ctx, '#1e1a18', x + rnd(tx, ty, 51, 14), y, 2, 6 + rnd(tx, ty, 52, 8));
  // Ash caught on the ledges of the face.
  if (hash(tx, ty, 53) < 0.5) px(ctx, ROCK_DUST, x + rnd(tx, ty, 54, 10), y + 7 + rnd(tx, ty, 55, 3), 4, 1);
  const above = room?.tileAt(tx, ty - 1);
  if (above !== 'W' && above !== 'M') px(ctx, ROCK_DUST, x, y, T, 1);
  // Where the face meets the ground, ash has drifted up against it, ragged.
  const below = room?.tileAt(tx, ty + 1);
  if (below && !'#WMm'.includes(below)) {
    for (let col = 0; col < T; col++) {
      const wx = tx * T + col;
      const hgt = Math.max(0, Math.round(1.5 + Math.sin(wx * 0.37) * 1.6 + Math.sin(wx * 0.11 + 2) * 1.8));
      if (hgt) px(ctx, ASH[col % 4], x + col, y + T - hgt, 1, hgt);
      if (hgt) px(ctx, ASH_HI, x + col, y + T - hgt, 1, 1);
    }
  }
}

// --- Things on the floor ---
function boulder(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  px(ctx, 'rgba(0, 0, 0, 0.28)', x + 2, y + 12, 13, 3);
  px(ctx, '#2f2a28', x + 2, y + 4, 12, 10);
  px(ctx, '#2f2a28', x + 1, y + 6, 14, 6);
  px(ctx, '#3d3734', x + 3, y + 4, 9, 6);
  px(ctx, '#4a4440', x + 4, y + 4, 5, 2);
  px(ctx, ROCK_DUST, x + 4, y + 3, 6, 1);
  px(ctx, ASH_HI, x + 5, y + 3, 3, 1);
  px(ctx, '#1a1614', x + 8, y + 9, 4, 1);
}

function rubble(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  px(ctx, 'rgba(0, 0, 0, 0.28)', x + 1, y + 12, 14, 3);
  const bits = [[1, 8, 6, 5], [6, 5, 7, 8], [10, 9, 5, 4], [3, 3, 5, 4]];
  bits.forEach(([bx, by, w, h], i) => {
    if (i === 3 && hash(tx, ty, 1) < 0.5) return;
    px(ctx, i % 2 ? '#3a2e28' : '#2a2422', x + bx, y + by, w, h);
    px(ctx, i % 2 ? '#5a4a40' : '#4a4038', x + bx, y + by, w - 1, 1);
  });
  // A charred beam end and a scatter of ash over the heap.
  px(ctx, '#1a1412', x + 2, y + 10, 9, 2);
  px(ctx, '#3a2a20', x + 2, y + 10, 9, 1);
  px(ctx, ASH_HI, x + 7, y + 5, 3, 1);
  px(ctx, ASH, x + 4, y + 8, 2, 1);
}

function fence(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  const left = room?.tileAt(tx - 1, ty) === 'f';
  const right = room?.tileAt(tx + 1, ty) === 'f';
  px(ctx, 'rgba(0, 0, 0, 0.25)', x, y + 13, T, 2);
  // Posts, burnt to points; rails, one sagging, one broken.
  for (const postX of [2, 11]) {
    const h = 9 + rnd(tx, ty, postX, 3);
    px(ctx, '#1e1816', x + postX, y + 14 - h, 3, h);
    px(ctx, '#3a2c24', x + postX, y + 14 - h, 1, h);
    px(ctx, '#1e1816', x + postX + 1, y + 13 - h, 1, 1);
  }
  const railY = y + 7;
  px(ctx, '#2a201c', left ? x : x + 2, railY, (right ? T : 13) - (left ? 0 : 2), 2);
  px(ctx, '#4a3a2e', left ? x : x + 2, railY, (right ? T : 13) - (left ? 0 : 2), 1);
  if (hash(tx, ty, 9) < 0.6) {
    px(ctx, '#2a201c', x + 3, y + 11, 6, 1);
    px(ctx, '#2a201c', x + 9, y + 12, 4, 1);
  }
  px(ctx, ASH_HI, x + 3, railY - 1, 4, 1);
}

// A hot crack: the ground split open, black, with the fire still showing in
// the bottom of it. It is drawn dark here; the glow on it is live (ashRoad.js).
// A field of smouldering ground: a crust of black plates with the fire showing in the seams
// between them. The plates are worked out in world pixels (jittered cells), so they run across
// tiles and never line up with the grid; where the field meets plain ash its edge is ragged.
const CELL = 9;
function plateSeam(wx, wy) {
  const gx = Math.floor(wx / CELL);
  const gy = Math.floor(wy / CELL);
  let d1 = 1e9;
  let d2 = 1e9;
  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      const px0 = (gx + i) * CELL + hash(gx + i, gy + j, 501) * CELL;
      const py0 = (gy + j) * CELL + hash(gx + i, gy + j, 502) * CELL;
      const d = Math.hypot(wx - px0, (wy - py0) * 1.2);
      if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
    }
  }
  return d2 - d1;
}
function crackField(ctx, x, y, tx, ty, room) {
  ashFloor(ctx, x, y, tx, ty);
  const open = (dx, dy) => room?.tileAt(tx + dx, ty + dy) !== '*';
  for (let row = 0; row < T; row++) {
    for (let col = 0; col < T; col++) {
      const wx = tx * T + col;
      const wy = ty * T + row;
      // A ragged margin of ash where the field meets plain ground.
      const m = (s) => 2 + Math.round(Math.sin(s * 0.7) * 1.5 + Math.sin(s * 0.23 + 1) * 1.2);
      if ((open(-1, 0) && col < m(wy)) || (open(1, 0) && T - 1 - col < m(wy + 5)) || (open(0, -1) && row < m(wx)) || (open(0, 1) && T - 1 - row < m(wx + 9))) continue;
      const s = plateSeam(wx, wy);
      let c;
      if (s < 0.7) c = hash(wx, wy, 7) < 0.4 ? '#ffc04a' : '#e0601a';
      else if (s < 1.6) c = '#8a2a0c';
      else if (s < 2.4) c = '#1a1311';
      else c = hash(wx >> 1, wy >> 1, 9) < 0.12 ? '#4a423c' : (s > 4.5 ? '#2e2724' : '#262020');
      px(ctx, c, x + col, y + row);
    }
  }
}

function hotCrack(ctx, x, y, tx, ty, room) {
  const hot = (dx, dy) => room?.tileAt(tx + dx, ty + dy) === '*';
  // Part of a field (cracks beside it both across and up or down): the crust of plates.
  if ((hot(-1, 0) || hot(1, 0)) && (hot(0, -1) || hot(0, 1))) {
    crackField(ctx, x, y, tx, ty, room);
    return;
  }
  ashFloor(ctx, x, y, tx, ty);
  // Scorch round the split: a ragged darker ring, not a square.
  for (let i = 0; i < 10; i++) {
    const sx = x + 2 + rnd(tx, ty, 60 + i, 12);
    const sy = y + 1 + rnd(tx, ty, 70 + i, 14);
    px(ctx, i % 2 ? '#6a645e' : '#5e5853', sx, sy, 2 + rnd(tx, ty, 80 + i, 3), 1);
  }
  const seam = (x0, y0, x1, y1, salt) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) {
      const wob = Math.round(Math.sin((i + salt) * 0.9 + tx * 1.7 + ty * 2.3) * 1.5);
      const sx = Math.round(x0 + ((x1 - x0) * i) / n) + (y1 !== y0 ? wob : 0);
      const sy = Math.round(y0 + ((y1 - y0) * i) / n) + (x1 !== x0 ? wob : 0);
      px(ctx, '#1a1311', x + sx - 1, y + sy - 1, 3, 3);
      px(ctx, '#8a2a0c', x + sx - 1, y + sy, 3, 1);
      px(ctx, '#e0601a', x + sx, y + sy, 1, 1);
      if (hash(tx * 31 + i, ty, salt) < 0.3) px(ctx, '#ffc04a', x + sx, y + sy, 1, 1);
    }
  };
  // From the middle out to each side that carries on into another crack (or a wall), else a short spur.
  const cx = 7 + rnd(tx, ty, 90, 3);
  const cy = 7 + rnd(tx, ty, 91, 3);
  const walled = (dx, dy) => { const c = room?.tileAt(tx + dx, ty + dy); return c === null || '#WMm'.includes(c); };
  let arms = 0;
  if (hot(0, -1) || walled(0, -1)) { seam(cx, cy, 8, 0, 1); arms++; }
  if (hot(0, 1) || walled(0, 1)) { seam(cx, cy, 8, 15, 2); arms++; }
  if (hot(-1, 0)) { seam(cx, cy, 0, 8, 3); arms++; }
  if (hot(1, 0)) { seam(cx, cy, 15, 8, 4); arms++; }
  if (arms < 2) { seam(cx, cy, 3 + rnd(tx, ty, 92, 3), 2, 5); seam(cx, cy, 10 + rnd(tx, ty, 93, 3), 13, 6); }
  // A few cinders lying beside it.
  for (let i = 0; i < 3; i++) if (hash(tx, ty, 20 + i) < 0.5) px(ctx, '#c84a14', x + 2 + rnd(tx, ty, 23 + i, 12), y + 2 + rnd(tx, ty, 26 + i, 12));
}

// --- Standing things ---
function standingShadow(ctx, x, y) {
  px(ctx, 'rgba(0, 0, 0, 0.32)', x + 1, y + 13, 14, 3);
}

// A burnt tree: a black trunk, split, with bare branches reaching up, and ash
// lying on every upward edge.
function burntTree(ctx, x, y, tx, ty) {
  standingShadow(ctx, x, y);
  const lean = hash(tx, ty, 1) < 0.5 ? -1 : 1;
  const dark = '#141010';
  const mid = '#241c18';
  const hi = '#3a2e28';
  // Trunk, a little wider at the foot.
  px(ctx, dark, x + 5, y - 20, 6, 35);
  px(ctx, mid, x + 6, y - 20, 3, 35);
  px(ctx, hi, x + 6, y - 14, 1, 24);
  px(ctx, dark, x + 3, y + 11, 10, 4);
  px(ctx, dark, x + 2, y + 13, 2, 2);
  px(ctx, dark, x + 12, y + 13, 2, 2);
  // Branches: two big forks and twigs, a different shape for each tree.
  const branch = (sx, sy, dx, len, salt) => {
    let bx = sx;
    let by = sy;
    for (let i = 0; i < len; i++) {
      px(ctx, dark, x + bx, y + by, 2, 1);
      if (i % 2 === 0) px(ctx, ASH_HI, x + bx, y + by - 1, 1, 1);
      bx += dx;
      by -= hash(tx, ty, salt + i) < 0.65 ? 1 : 0;
      if (i === Math.floor(len / 2)) {
        // A twig off it.
        let ux = bx;
        let uy = by;
        for (let j = 0; j < 4; j++) { px(ctx, mid, x + ux, y + uy, 1, 1); ux -= dx; uy -= 1; }
      }
    }
  };
  branch(5, -18, -1, 7 + rnd(tx, ty, 2, 4), 30);
  branch(10, -20, 1, 6 + rnd(tx, ty, 3, 4), 50);
  branch(7 + lean, -20, lean, 5, 70);
  px(ctx, dark, x + 7, y - 28, 2, 9);
  px(ctx, ASH_HI, x + 7, y - 29, 2, 1);
  // A scorched split down the trunk, an ember still in it now and then.
  px(ctx, '#0a0808', x + 8, y - 6, 1, 12);
  if (hash(tx, ty, 9) < 0.3) px(ctx, '#c04a14', x + 8, y + 1, 1, 2);
}

// A burnt stump, or a broken post of the old road.
function stumpOrPost(ctx, x, y, tx, ty) {
  standingShadow(ctx, x, y);
  if (hash(tx, ty, 1) < 0.5) {
    // Stump.
    px(ctx, '#141010', x + 3, y + 2, 10, 13);
    px(ctx, '#241c18', x + 4, y + 2, 8, 13);
    px(ctx, '#3a2e28', x + 4, y + 3, 2, 10);
    px(ctx, '#0a0808', x + 4, y + 1, 8, 2);
    px(ctx, '#5a4a40', x + 5, y + 1, 5, 1);
    px(ctx, ASH_HI, x + 4, y, 6, 1);
    px(ctx, '#141010', x + 1, y + 13, 3, 2);
    px(ctx, '#141010', x + 12, y + 12, 3, 3);
  } else {
    // A road post, charred to a point, leaning.
    px(ctx, '#141010', x + 6, y - 10, 4, 25);
    px(ctx, '#2e241e', x + 7, y - 10, 2, 25);
    px(ctx, '#141010', x + 7, y - 12, 2, 2);
    px(ctx, ASH_HI, x + 6, y - 11, 2, 1);
    px(ctx, '#3a2e28', x + 5, y - 2, 6, 2);
  }
}

// --- Ledges ---
function ledge(raise) {
  return (ctx, x, y, tx, ty, room, floor) => {
    floor(ctx, x, y, tx, ty, room);
    const top = y - raise;
    const same = (dx, dy) => room?.tileAt(tx + dx, ty + dy) === room?.tileAt(tx, ty);
    // The face from the floor up to the top, banded.
    px(ctx, FACE_LO, x, y + T - raise, T, raise);
    for (let i = 0; i < raise; i += 4) px(ctx, pick(FACE, hash(tx, ty, i)), x, y + T - raise + i, T, 3);
    if (!same(0, 1)) px(ctx, 'rgba(0, 0, 0, 0.3)', x, y + T, T, 2);
    // The top, ash-covered.
    // The top: ash settled thick on the rock, pale, streaked by the wind.
    px(ctx, '#86827c', x, top, T, T);
    for (let i = 0; i < 5; i++) {
      if (hash(tx, ty, 41 + i) > 0.7) continue;
      px(ctx, i % 2 ? '#99958e' : '#7a7671', x + rnd(tx, ty, 46 + i, 10), top + rnd(tx, ty, 51 + i, 15), 3 + rnd(tx, ty, 56 + i, 5), 1);
    }
    if (!same(0, -1)) px(ctx, ASH_HI, x, top, T, 1);
    if (!same(-1, 0)) px(ctx, FACE_LO, x, top, 1, T);
    if (!same(1, 0)) px(ctx, FACE_LO, x + T - 1, top, 1, T);
    if (!same(0, 1)) px(ctx, ROCK_DUST, x, top + T - 1, T, 1);
  };
}

const FLOORS = { '.': ashFloor, ':': roadFloor, ',': stubbleFloor, q: sandFloor, X: cobbleFloor };
const LOOKS = {
  ...FLOORS,
  '~': poolTile,
  '#': rockTop, m: rockTop, W: rockFace, M: rockFace,
  O: boulder, R: rubble, f: fence,
  T: burntTree, J: stumpOrPost,
  b: ledge(12), B: ledge(24),
};
// The ones drawn over a floor of their own (the floor round them).
const ON_FLOOR = new Set(['O', 'R', 'f', 'b', 'B']);

export function installAshTiles(TILES, { floorUnder }) {
  TILES['*'] = { solid: true, draw: (ctx, x, y, tx, ty, room) => hotCrack(ctx, x, y, tx, ty, room) };
  for (const [char, look] of Object.entries(LOOKS)) {
    const tile = TILES[char];
    if (!tile) continue;
    const original = tile.draw;
    tile.draw = (ctx, x, y, tx, ty, room) => {
      if (!ASH_AREAS.has(room?.area)) return original(ctx, x, y, tx, ty, room);
      if (ON_FLOOR.has(char)) {
        const floor = (c, fx, fy, ftx, fty, froom) => (FLOORS[floorUnder(froom, ftx, fty)] ?? ashFloor)(c, fx, fy, ftx, fty, froom);
        return look(ctx, x, y, tx, ty, room, floor);
      }
      return look(ctx, x, y, tx, ty, room);
    };
  }
}

// --- Soft edges (tileBlend.js) ---
const BLEND = {
  kinds: { '.': 'ash', ':': 'road', ',': 'stubble', q: 'sand', X: 'cobbles', '~': 'water' },
  standing: 'TJ',
  onFloor: 'ORf',
  walls: 'm',
  faces: 'M',
  tops: 'm',
  natural: 'MmW#',
  amplitude: { 'ash|road': 5, 'ash|stubble': 6, 'road|stubble': 5, 'ash|sand': 6, 'sand|stubble': 5, 'cobbles|road': 3, 'ash|cobbles': 3 },
  patches: { ash: ['#9a968f', 0.32, '#6a6661', 0.36], stubble: ['#7a746c', 0.3, '#4a4440', 0.38], sand: ['#bba27c', 0.3, '#8a7454', 0.36], road: ['#7a756f', 0.25, '#4a4541', 0.3] },
  p: {
    ground: ['#8b8782'], hi: '#a6a29b', lo: '#5e5a55', crack: '#3a3532', speck: ['#c9c5bd', '#2c2826', '#6e6a65'],
    turf: ['#6f6a64'], turfHi: '#8a847c', turfLo: '#4a4440', flowers: ['#c9c5bd'],
    water: '#3e4e52', wave: '#4a5c60', foam: '#8aa0a0', lip: '#2a2624', deep: '#2e3a3c', troughs: '#2e3a3c',
    shallow: '#4a5c60', shallowHi: '#6a7c7e', glint: '#a8b8b8', wetLine: '#6a5a44', underHi: '#6a7c7e',
    weed: ['#3e4a2c', '#4e5a34'], weedHi: '#5e6a3e', fleck: '#a8b8b8', driftwood: '#3a2e26',
    deepRock: '#2a2422', deepRock2: '#161210', rockLo: '#332e2b', rim: '#7e7a74', rock: ['#4a4440', '#4d4743', '#47413d'], topRock: '#4a4440',
    rubbleHi: '#6a625a', rubble: '#3e3632', rubbleLo: '#1e1a18',
  },
  lists: {
    ash: ['pebble', 'crack', 'cinder', 'twig', 'pebble', 'cinder', 'bone'],
    stubble: ['twig', 'cinder', 'pebble', 'twig'],
    road: ['crack', 'pebble', 'cinder', 'crack'],
    sand: ['shell', 'pebble', 'weed', 'shell', 'puddle'],
    cobbles: ['crack', 'cinder'],
  },
  chance: { ash: 0.26, stubble: 0.3, road: 0.24, sand: 0.22, cobbles: 0.12 },
  edgeScatter: [{ on: 'road', from: 'ash', colors: ['#a6a29b', '#8b8782', '#c9c5bd'], chance: [0.16, 0.1, 0.06, 0.03, 0.015] }],
};
const LAND = new Set(['ash', 'road', 'stubble', 'sand', 'cobbles']);

export function ashBlendLook(room) {
  if (!room || !ASH_AREAS.has(room.area) || room.indoors || room.softEdges === false) return null;
  const worded = new Set(Object.keys(room.tileTexts ?? {}).map((c) => BLEND.kinds[c]).filter(Boolean));
  const lists = { ...BLEND.lists };
  for (const k of worded) lists[k] = [];
  return {
    p: BLEND.p,
    kind: (c) => (c == null ? null : BLEND.kinds[c] ?? null),
    naturalWall: (c) => BLEND.natural.includes(c),
    isLand: (k) => LAND.has(k),
    isWater: (k) => k === 'water',
    patches: BLEND.patches,
    lists,
    chance: BLEND.chance,
    standing: BLEND.standing,
    onFloor: BLEND.onFloor,
    walls: BLEND.walls,
    faces: BLEND.faces,
    tops: BLEND.tops,
    edgeScatter: BLEND.edgeScatter,
    amplitude: (a, b) => BLEND.amplitude[[a, b].sort().join('|')] ?? 0,
    stamps: ashStamps,
  };
}

function ashStamps(p) {
  const f = (ctx, c, x, y, w = 1, h = 1) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  return {
    // A cinder still glowing in the ash.
    cinder(ctx, x, y, r) {
      f(ctx, '#2c2826', x - 1, y, 3, 2);
      f(ctx, r > 0.5 ? '#c84a14' : '#8a2a0c', x, y, 1, 1);
      if (r > 0.75) f(ctx, '#ffa040', x, y, 1, 1);
    },
    // A small white bone, an animal's, long ago.
    bone(ctx, x, y, r) {
      f(ctx, '#5e5a55', x - 2, y + 1, 6, 1);
      f(ctx, '#d8d2c4', x - 2, y, 6, 1);
      f(ctx, '#d8d2c4', x - 3, y - 1, 1, 1);
      f(ctx, '#d8d2c4', x + 4, y - 1, 1, 1);
      if (r > 0.5) f(ctx, '#d8d2c4', x + 4, y + 1, 1, 1);
    },
  };
}
