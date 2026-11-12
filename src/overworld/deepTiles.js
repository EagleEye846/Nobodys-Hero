import { TILE_SIZE as T } from '../config.js';
import { caveSoftEdge } from './caveBlend.js';

// How Chapter 4's three underground regions look: the Diggings (the creature
// folk's mines), the Stillwater (the great black lake) and the Deep (the
// bottom of everything). Each redraws the tile letters rooms already use, so
// a room just says `area: 'diggings'` (and so on) and writes its map the
// same way as any other: `.` floor, `#` and `W` walls (top, face), `b` and
// `B` raised ledges, `~` water you can't enter, `O` a blocker, `I` and `J`
// standing props (a post, a pillar, a column). tileset.js calls
// installDeepTiles at its very end; the letter table is in
// notes/docs/chapter-4-builders-guide.md.
//
// The letters that mean something new here (every one keeps the same
// solidity it has elsewhere, so the engine behaves the same):
//   o  plank walkway (floor)         g  trestle: planks over a drop (floor)
//   ;  shallows / seep (floor)       q  loose gravel, shingle or ash (floor)
//   h  timber-framed wall (solid)    0  a drop into the dark (solid, NEW)
//   x  crystals (solid; they light a dark room)
//   v  stalactite (you walk under)   ^  stalagmite (solid)

export const DEEP_AREAS = new Set(['diggings', 'stillwater', 'deep']);

// --- Little helpers (the same ones tileset.js has, kept private). ---
function hash(tx, ty, salt = 0) {
  let h = (tx * 374761393 + ty * 668265263 + salt * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const pick = (list, roll) => list[Math.floor(roll * list.length)];
const px = (ctx, color, x, y, w = 1, h = 1) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };
const rnd = (tx, ty, salt, n) => Math.floor(hash(tx, ty, salt) * n);

// A soft, lumpy patch of a second tone (never a plain square).
function mottle(ctx, color, x, y, tx, ty, salt, size = 6) {
  const mx = rnd(tx, ty, salt, T - size);
  const my = rnd(tx, ty, salt + 1, T - size);
  px(ctx, color, x + mx, y + my + 1, size, size - 2);
  px(ctx, color, x + mx + 1, y + my, size - 2, size);
}
function shade(ctx, x, y, w, h, alpha, rgb = '0, 0, 0') {
  ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
  ctx.fillRect(x, y, w, h);
}
const WALLISH = new Set(['#', 'W', 'h', 'V', 'H']);
const wallish = (c) => WALLISH.has(c);

// ============================================================
// THE DIGGINGS: warm brown rock, timber, dust.
// ============================================================
// (Close shades: wider ones showed the tile grid as a faint checker.)
const DIG_DIRT = ['#3c3027', '#3e3228', '#3b2f26', '#3d3128'];
const DIG_ROCK = ['#4d4036', '#473a31', '#54463b', '#42362d'];

function digFloor(ctx, x, y, tx, ty, room) {
  px(ctx, pick(DIG_DIRT, hash(tx, ty, 1)), x, y, T, T);
  mottle(ctx, pick(DIG_DIRT, hash(tx, ty, 2)), x, y, tx, ty, 3, 8);
  if (hash(tx, ty, 6) < 0.5) mottle(ctx, '#33281f', x, y, tx, ty, 7, 5);
  // Pebbles, grit, the odd glint of ore.
  for (let i = 0; i < 4; i++) {
    const r = hash(tx, ty, 10 + i);
    if (r < 0.7) px(ctx, r < 0.3 ? '#5c4a3b' : '#2a2018', x + rnd(tx, ty, 20 + i, 14) + 1, y + rnd(tx, ty, 30 + i, 14) + 1, 1 + (r < 0.12 ? 1 : 0), 1);
  }
  if (hash(tx, ty, 40) < 0.1) px(ctx, '#a8703a', x + rnd(tx, ty, 41, 13) + 1, y + rnd(tx, ty, 42, 13) + 1, 1, 1);
  // Cart-wheel and boot scuffs: long pale streaks of dust.
  if (hash(tx, ty, 43) < 0.22) {
    const sy = y + 3 + rnd(tx, ty, 44, 10);
    px(ctx, '#4b3c30', x + rnd(tx, ty, 45, 4), sy, 7 + rnd(tx, ty, 46, 6), 1);
  }
  // A hairline crack.
  if (hash(tx, ty, 47) < 0.07) {
    let cx = 3 + rnd(tx, ty, 48, 9);
    for (let cy = 3; cy < 12; cy++) { px(ctx, '#241b14', x + cx, y + cy); cx = Math.max(1, Math.min(14, cx + (hash(tx, ty, 50 + cy) < 0.5 ? -1 : 1))); }
  }
  if (!room) return;
  const above = room.tileAt(tx, ty - 1);
  if (wallish(above)) { shade(ctx, x, y, T, 3, 0.55, '10, 6, 2'); shade(ctx, x, y + 3, T, 2, 0.25, '10, 6, 2'); }
  // Dropped edges: the chasm yawns just beyond.
  if (room.tileAt(tx, ty + 1) === '0') { px(ctx, '#2a2018', x, y + T - 2, T, 2); px(ctx, '#5c4a3b', x + 1, y + T - 3, T - 2, 1); }
}

function digGravel(ctx, x, y, tx, ty, room) {
  digFloor(ctx, x, y, tx, ty, room);
  // Spoil: chips of broken rock, lighter and sharper than the dirt.
  for (let i = 0; i < 9; i++) {
    const gx = x + rnd(tx, ty, 60 + i, 14);
    const gy = y + rnd(tx, ty, 70 + i, 14);
    const big = hash(tx, ty, 80 + i) < 0.3;
    px(ctx, pick(['#6a5a4a', '#7a6a58', '#55473a', '#8a7a66'], hash(tx, ty, 90 + i)), gx, gy, big ? 2 : 1, big ? 2 : 1);
    if (big) px(ctx, '#241a12', gx, gy + 2, 2, 1);
  }
}

function digWallTop(ctx, x, y, tx, ty, room) {
  px(ctx, '#17110d', x, y, T, T);
  if (hash(tx, ty, 1) < 0.6) px(ctx, '#1e1712', x + rnd(tx, ty, 2, 9), y + rnd(tx, ty, 3, 9), 6, 5);
  if (hash(tx, ty, 4) < 0.4) px(ctx, '#120d09', x + rnd(tx, ty, 5, 11), y + rnd(tx, ty, 6, 11), 4, 3);
  if (hash(tx, ty, 7) < 0.1) px(ctx, '#3a4a60', x + rnd(tx, ty, 8, 13) + 1, y + rnd(tx, ty, 9, 13) + 1, 1, 1);
  if (!room) return;
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && below !== '#') {
    px(ctx, '#3a2c20', x, y + T - 3, T, 2);
    px(ctx, '#5a4838', x, y + T - 3, T, 1);
    px(ctx, '#07040a', x, y + T - 1, T, 1);
  }
  const left = room.tileAt(tx - 1, ty);
  const right = room.tileAt(tx + 1, ty);
  if (left !== null && !wallish(left)) px(ctx, '#33271c', x, y, 1, T);
  if (right !== null && !wallish(right)) px(ctx, '#33271c', x + T - 1, y, 1, T);
}

function digWallFace(ctx, x, y, tx, ty, room) {
  for (let band = 0; band < 4; band++) {
    const by = y + band * 4;
    px(ctx, pick(DIG_ROCK, hash(tx, ty * 4 + band, 430)), x, by, T, 4);
    px(ctx, '#6a5848', x + rnd(tx, ty * 4 + band, 431, 7), by, 4 + rnd(tx, ty * 4 + band, 432, 8), 1);
    px(ctx, '#2f241c', x + rnd(tx, ty * 4 + band, 433, 9), by + 3, 3 + rnd(tx, ty * 4 + band, 434, 7), 1);
  }
  // Cracks.
  if (hash(tx, ty, 435) < 0.4) {
    const cx = x + 2 + rnd(tx, ty, 436, 11);
    px(ctx, '#251b14', cx, y + 1, 1, 6);
    px(ctx, '#251b14', cx + 1, y + 7, 1, 5);
  }
  // An ore seam running down through the rock: copper, a green stain, quartz.
  if (hash(tx, ty, 440) < 0.3) {
    let sy = rnd(tx, ty, 441, 6);
    const slope = hash(tx, ty, 442) < 0.5 ? 0.35 : -0.3;
    for (let i = 0; i < T; i++) {
      const yy = Math.max(0, Math.min(14, Math.round(sy + i * slope + (hash(tx, ty, 450 + i) < 0.3 ? 1 : 0))));
      const r = hash(tx, ty, 470 + i);
      if (r < 0.55) px(ctx, r < 0.2 ? '#7a4a28' : '#b8743a', x + i, y + yy, 1, 1 + (r < 0.12 ? 1 : 0));
      else if (r < 0.7) px(ctx, '#4c9a78', x + i, y + yy, 1, 1);
      else if (r < 0.78) px(ctx, '#e0d6c0', x + i, y + yy, 1, 1);
    }
  }
  // A dull crystal in the rock.
  if (hash(tx, ty, 490) < 0.09) {
    const cx = x + 3 + rnd(tx, ty, 491, 9);
    const cy = y + 3 + rnd(tx, ty, 492, 6);
    px(ctx, '#2a2a3a', cx - 1, cy + 4, 5, 1);
    px(ctx, '#48587a', cx, cy + 1, 3, 3);
    px(ctx, '#6a82a8', cx, cy, 2, 4);
    px(ctx, '#a8bcd8', cx, cy, 1, 1);
  }
  // A pick mark or two.
  if (hash(tx, ty, 495) < 0.25) { px(ctx, '#1f1610', x + 4 + rnd(tx, ty, 496, 8), y + 5 + rnd(tx, ty, 497, 6), 3, 1); }
  if (!room) return;
  if (wallish(room.tileAt(tx, ty - 1))) {
    px(ctx, '#2a1f18', x, y, T, 2);
    px(ctx, '#6a5848', x, y + 2, T, 1);
  }
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && !wallish(below)) {
    px(ctx, '#241a13', x, y + T - 2, T, 2);
    for (let i = 0; i < 4; i++) if (hash(tx, ty, 70 + i) < 0.4) px(ctx, '#6e5a48', x + i * 4 + rnd(tx, ty, 80 + i, 3), y + T - 3, 2, 1);
  }
}

// Timber-framed wall: posts and a beam holding back the rock-fill between them.
function digTimberWall(ctx, x, y, tx, ty, room) {
  px(ctx, '#3f3228', x, y, T, T);
  for (let i = 0; i < 3; i++) mottle(ctx, pick(['#4d3e32', '#463829', '#54443a'], hash(tx, ty, 520 + i)), x, y, tx, ty, 521 + i, 7);
  px(ctx, '#6e5c4c', x + 5 + rnd(tx, ty, 530, 6), y + 6 + rnd(tx, ty, 531, 6), 2, 1);
  px(ctx, '#2a1f17', x + 4 + rnd(tx, ty, 534, 6), y + 10 + rnd(tx, ty, 535, 4), 3, 1);
  // Posts at both edges, with a lit side.
  for (const px0 of [0, T - 3]) {
    px(ctx, '#4a3018', x + px0, y, 3, T);
    px(ctx, '#7a5630', x + px0 + (px0 ? 0 : 1), y, 2, T);
    px(ctx, '#96693a', x + px0 + (px0 ? 0 : 1), y, 1, T);
    for (let r = 2; r < T; r += 5 + rnd(tx, ty + px0, 532, 3)) px(ctx, '#4a3018', x + px0, y + r, 3, 1);
  }
  // A cross-brace on some.
  if (hash(tx, ty, 533) < 0.4) {
    for (let i = 0; i < 9; i++) {
      px(ctx, '#4a3018', x + 3 + i, y + 11 - i, 2, 2);
      px(ctx, '#7a5630', x + 3 + i, y + 11 - i, 1, 1);
    }
  }
  if (!room) return;
  // The beam across the top of a run of timber wall, with wedges.
  if (room.tileAt(tx, ty - 1) !== 'h') {
    px(ctx, '#4a3018', x, y, T, 5);
    px(ctx, '#8a6238', x, y + 1, T, 3);
    px(ctx, '#a77a48', x, y + 1, T, 1);
    px(ctx, '#5e4020', x, y + 4, T, 1);
    px(ctx, '#2a1c10', x + 3, y + 2, 1, 1);
    px(ctx, '#2a1c10', x + 12, y + 2, 1, 1);
  }
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && below !== 'h') { px(ctx, '#241a13', x, y + T - 2, T, 2); }
}

function digPlanks(ctx, x, y, tx, ty, room) {
  planks(ctx, x, y, tx, ty, room, ['#7a5630', '#70502c', '#85603a', '#6a4a28'], '#1c130c', '#a07040', '#2a1c10');
}
function digTrestle(ctx, x, y, tx, ty, room) {
  planks(ctx, x, y, tx, ty, room, ['#7a5630', '#70502c', '#85603a', '#6a4a28'], '#1c130c', '#a07040', '#2a1c10', true);
}
// Boards running across the tile, a thin dark gap between, nails at the ends.
// A trestle (over a drop) shows its stout beams under the near edge.
function planks(ctx, x, y, tx, ty, room, colors, gap, light, nail, trestle = false) {
  px(ctx, gap, x, y, T, T);
  for (let row = 0; row < 4; row++) {
    const by = y + row * 4;
    // One board the whole way across, a shade of its own; now and then a split.
    px(ctx, pick(colors, hash(tx, ty * 4 + row, 600)), x, by, T, 3);
    px(ctx, light, x, by, T, 1);
    if (hash(tx, ty * 4 + row, 601) < 0.12) px(ctx, gap, x + 4 + rnd(tx, ty * 4 + row, 605, 8), by + 1, 1, 2);
    // Grain.
    if (hash(tx, ty * 4 + row, 602) < 0.55) px(ctx, gap, x + rnd(tx, ty * 4 + row, 603, 9) + 1, by + 1, 3 + rnd(tx, ty * 4 + row, 604, 5), 1);
    px(ctx, nail, x + 1, by + 1, 1, 1);
    px(ctx, nail, x + T - 2, by + 1, 1, 1);
  }
  if (!room) return;
  const open = (dx, dy) => { const c = room.tileAt(tx + dx, ty + dy); return c !== 'o' && c !== 'g' && c !== null; };
  if (trestle && open(0, 1)) {
    px(ctx, '#3a2412', x, y + T - 4, T, 4);
    px(ctx, '#5e4020', x, y + T - 4, T, 1);
    px(ctx, '#0a0604', x, y + T - 1, T, 1);
    for (const sx of [1, T - 4]) px(ctx, '#2a1a0c', x + sx, y + T - 3, 3, 3);
  }
  if (trestle) {
    if (open(-1, 0) && room.tileAt(tx - 1, ty) === '0') px(ctx, '#2a1a0c', x, y, 2, T);
    if (open(1, 0) && room.tileAt(tx + 1, ty) === '0') px(ctx, '#2a1a0c', x + T - 2, y, 2, T);
    if (room.tileAt(tx, ty - 1) === '0') { px(ctx, '#2a1a0c', x, y, T, 1); }
  }
}

function digWater(ctx, x, y, tx, ty, room) {
  murkyWater(ctx, x, y, tx, ty, room, { base: '#1c2826', dark: '#16201f', ripple: '#2f4642', glint: '#7a9a8a', lip: '#4a3c2e', rim: '#0c1210' });
}

// The drop into the dark: striated rock face where the floor ends, then black.
function digChasm(ctx, x, y, tx, ty, room) {
  chasm(ctx, x, y, tx, ty, room, {
    void: '#070504', face: ['#3a2e26', '#33281f', '#3f322a'], lip: '#6a5848', faceShadow: '#14100c', edge: '#2a2018', specks: null, haze: '34, 18, 6',
  });
}

function digCrystals(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  const glow = ctx.createRadialGradient(x + 8, y + 8, 1, x + 8, y + 8, 12);
  glow.addColorStop(0, 'rgba(120, 150, 210, 0.2)');
  glow.addColorStop(1, 'rgba(120, 150, 210, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(x - 4, y - 4, 24, 24);
  px(ctx, 'rgba(0,0,0,0.3)', x + 2, y + 12, 12, 3);
  px(ctx, '#2c2420', x + 3, y + 10, 10, 4);
  px(ctx, '#3e342c', x + 4, y + 9, 8, 3);
  for (const [sx, sy, w, h] of [[7, 2, 3, 11], [3, 6, 3, 7], [11, 5, 3, 8]]) {
    px(ctx, '#2a3048', x + sx - 1, y + sy, w + 2, h + 1);
    px(ctx, '#4a5a82', x + sx, y + sy, w, h);
    px(ctx, '#6a82ae', x + sx, y + sy, 1, h);
    px(ctx, '#2e3a5a', x + sx + w - 1, y + sy + 1, 1, h - 1);
    px(ctx, '#b0c4e4', x + sx, y + sy, 1, 1);
  }
}

// A lump of ore-bearing rock; now and then a wrecked cart, splintered planks and a bent iron band.
function digBoulder(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  shade(ctx, x + 1, y + 12, 14, 3, 0.35);
  if (hash(tx, ty, 700) < 0.3) {
    // The wreck.
    px(ctx, '#1c130c', x + 1, y + 5, 14, 9);
    px(ctx, '#6a4a28', x + 2, y + 6, 12, 7);
    px(ctx, '#85603a', x + 2, y + 6, 12, 1);
    for (const sx of [4, 8, 12]) px(ctx, '#1c130c', x + sx, y + 6, 1, 7);
    px(ctx, '#7a7a86', x + 1, y + 9, 14, 2);
    px(ctx, '#a8a8b8', x + 1, y + 9, 14, 1);
    px(ctx, '#1c130c', x + 5, y + 3, 1, 3);
    px(ctx, '#6a4a28', x + 4, y + 2, 3, 2);
    px(ctx, '#2a2a30', x + 11, y + 11, 4, 4);
    px(ctx, '#55555f', x + 12, y + 12, 2, 2);
    return;
  }
  px(ctx, '#1a130e', x + 2, y + 3, 12, 11);
  px(ctx, '#1a130e', x + 1, y + 5, 14, 7);
  px(ctx, '#6a5848', x + 3, y + 4, 10, 9);
  px(ctx, '#6a5848', x + 2, y + 6, 12, 5);
  px(ctx, '#8a7660', x + 4, y + 5, 4, 2);
  px(ctx, '#4a3c30', x + 9, y + 10, 4, 2);
  px(ctx, '#b8743a', x + 5, y + 8, 2, 1);
  px(ctx, '#b8743a', x + 10, y + 6, 1, 2);
  px(ctx, '#4c9a78', x + 7, y + 10, 1, 1);
}

function digPost(ctx, x, y) {
  shade(ctx, x + 1, y + 13, 14, 3, 0.35);
  // Foot plate and chocks.
  px(ctx, '#1c130c', x + 2, y + 9, 12, 5);
  px(ctx, '#5a4c40', x + 3, y + 10, 10, 3);
  px(ctx, '#7a6a58', x + 3, y + 10, 10, 1);
  // The post.
  px(ctx, '#2a1c10', x + 4, y - 27, 8, 38);
  px(ctx, '#7a5630', x + 5, y - 27, 6, 38);
  px(ctx, '#a77a48', x + 5, y - 27, 2, 38);
  px(ctx, '#5e4020', x + 9, y - 27, 2, 38);
  for (let r = -22; r < 8; r += 9) px(ctx, '#3a2412', x + 5, y + r, 6, 1);
  px(ctx, '#2a1c10', x + 8, y - 12, 1, 4);
  // The cap plate, with wedges either side.
  px(ctx, '#2a1c10', x, y - 33, 16, 7);
  px(ctx, '#85603a', x + 1, y - 32, 14, 5);
  px(ctx, '#a77a48', x + 1, y - 32, 14, 1);
  px(ctx, '#5e4020', x + 1, y - 28, 14, 1);
  px(ctx, '#2a1c10', x + 3, y - 30, 1, 1);
  px(ctx, '#2a1c10', x + 12, y - 30, 1, 1);
  px(ctx, '#3a2412', x + 3, y - 25, 3, 2);
  px(ctx, '#3a2412', x + 10, y - 25, 3, 2);
}
function digBrokenPost(ctx, x, y) {
  shade(ctx, x + 1, y + 13, 14, 3, 0.35);
  px(ctx, '#1c130c', x + 2, y + 9, 12, 5);
  px(ctx, '#5a4c40', x + 3, y + 10, 10, 3);
  px(ctx, '#2a1c10', x + 4, y - 9, 8, 20);
  px(ctx, '#7a5630', x + 5, y - 8, 6, 19);
  px(ctx, '#a77a48', x + 5, y - 8, 2, 19);
  px(ctx, '#5e4020', x + 9, y - 8, 2, 19);
  // Splintered top.
  for (const [sx, h] of [[4, 2], [6, 5], [8, 3], [10, 6]]) { px(ctx, '#2a1c10', x + sx, y - 9 - h, 2, h + 1); px(ctx, '#a77a48', x + sx, y - 8 - h, 1, h); }
  // A fallen plank at the foot.
  px(ctx, '#2a1c10', x + 8, y + 11, 8, 4);
  px(ctx, '#85603a', x + 9, y + 12, 6, 2);
}

function digStalactite(ctx, x, y, tx, ty) {
  stalactite(ctx, x, y, tx, ty, ['#1a130e', '#4a3c30', '#6a5848'], '#9a8672', '#b89c78');
  // Grit trickling down, now and then.
  const t = performance.now() / 1000 + tx * 1.7 + ty;
  const k = (t % 3.5) / 3.5;
  if (k < 0.5) px(ctx, '#7a6652', x + 8, y + 2 + Math.floor(k * 30), 1, 1);
}
function digStalagmite(ctx, x, y, tx, ty, room, floor) {
  stalagmite(ctx, x, y, tx, ty, ['#1a130e', '#5a4a3c', '#7a6a58'], '#3a2e24');
}

// ============================================================
// THE STILLWATER: pale shores, black glass, cold light.
// ============================================================
const LAKE_STONE = ['#5b6882', '#5e6b85', '#586580', '#5f6c86'];
const LAKE_ROCK = ['#46547a', '#3f4c70', '#4c5a80', '#424f74'];

function lakeFloor(ctx, x, y, tx, ty, room) {
  px(ctx, pick(LAKE_STONE, hash(tx, ty, 1)), x, y, T, T);
  mottle(ctx, pick(['#64728c', '#52607a', '#617088'], hash(tx, ty, 2)), x, y, tx, ty, 3, 8);
  if (hash(tx, ty, 6) < 0.5) mottle(ctx, '#4a5670', x, y, tx, ty, 7, 5);
  // Smooth worn slabs: a joint or two.
  if (hash(tx, ty, 8) < 0.45) px(ctx, '#47536d', x, y + 5 + rnd(tx, ty, 9, 6), T, 1);
  if (hash(tx, ty, 10) < 0.35) px(ctx, '#47536d', x + 4 + rnd(tx, ty, 11, 8), y, 1, T);
  for (let i = 0; i < 3; i++) {
    const r = hash(tx, ty, 12 + i);
    if (r < 0.6) px(ctx, r < 0.25 ? '#8896ae' : '#3c4760', x + rnd(tx, ty, 20 + i, 14) + 1, y + rnd(tx, ty, 30 + i, 14) + 1, 1 + (r < 0.1 ? 1 : 0), 1);
  }
  if (!room) return;
  if (wallish(room.tileAt(tx, ty - 1))) { shade(ctx, x, y, T, 3, 0.5, '4, 8, 24'); shade(ctx, x, y + 3, T, 2, 0.22, '4, 8, 24'); }
  // Wet where the water laps it.
  // (Where the blend pass draws a ragged shore instead, the straight one is left out.)
  const wet = (dx, dy) => room.tileAt(tx + dx, ty + dy) === '~' && !caveSoftEdge(room, tx, ty, dx, dy);
  if (wet(0, -1)) { px(ctx, '#3c4964', x, y, T, 2); px(ctx, '#8aa0c0', x, y + 2, T, 1); }
  if (wet(0, 1)) { px(ctx, '#3c4964', x, y + T - 3, T, 3); px(ctx, '#8aa0c0', x + 1, y + T - 4, T - 2, 1); }
  if (wet(-1, 0)) { px(ctx, '#3c4964', x, y, 2, T); px(ctx, '#8aa0c0', x + 2, y + 1, 1, T - 2); }
  if (wet(1, 0)) { px(ctx, '#3c4964', x + T - 2, y, 2, T); px(ctx, '#8aa0c0', x + T - 3, y + 1, 1, T - 2); }
}

function lakeShingle(ctx, x, y, tx, ty, room) {
  // Between two rock walls it's a carved stair (the Stillwater's stair down):
  // a worn tread with a bright lip, and the dark drop of the step below it.
  const edge = (dx) => { let i = 1; while (room.tileAt(tx + dx * i, ty) === 'q') i++; return room.tileAt(tx + dx * i, ty); };
  if (room && edge(-1) === 'W' && edge(1) === 'W') {
    px(ctx, '#56647e', x, y, T, T);
    mottle(ctx, '#617088', x, y, tx, ty, 3, 8);
    px(ctx, '#b4c4de', x, y, T, 1);
    px(ctx, '#8fa0bc', x, y + 1, T, 2);
    px(ctx, '#6c7c98', x, y + 3, T, 3);
    px(ctx, '#323d56', x, y + 10, T, 2);
    px(ctx, '#1f2840', x, y + 12, T, 4);
    px(ctx, '#2a3550', x, y + 12, T, 1);
    for (let i = 0; i < 3; i++) px(ctx, '#47536d', x + 2 + rnd(tx, ty, 90 + i, 12), y + 3 + rnd(tx, ty, 95 + i, 6), 1, 1);
    return;
  }
  lakeFloor(ctx, x, y, tx, ty, room);
  // Wet shingle: rounded pale pebbles with a dark underside.
  for (let i = 0; i < 8; i++) {
    const gx = x + rnd(tx, ty, 60 + i, 13);
    const gy = y + rnd(tx, ty, 70 + i, 13);
    px(ctx, '#3a4560', gx, gy + 1, 3, 2);
    px(ctx, pick(['#9aa8c0', '#8896b0', '#aab6cc'], hash(tx, ty, 80 + i)), gx, gy, 3, 2);
    px(ctx, '#d0dcea', gx, gy, 1, 1);
  }
}

function lakeWallTop(ctx, x, y, tx, ty, room) {
  px(ctx, '#0b1018', x, y, T, T);
  if (hash(tx, ty, 1) < 0.6) px(ctx, '#111826', x + rnd(tx, ty, 2, 9), y + rnd(tx, ty, 3, 9), 6, 5);
  if (hash(tx, ty, 4) < 0.35) px(ctx, '#080c14', x + rnd(tx, ty, 5, 11), y + rnd(tx, ty, 6, 11), 4, 3);
  if (!room) return;
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && below !== '#') {
    px(ctx, '#2c3858', x, y + T - 3, T, 2);
    px(ctx, '#4a5a82', x, y + T - 3, T, 1);
    px(ctx, '#04060c', x, y + T - 1, T, 1);
  }
  const left = room.tileAt(tx - 1, ty);
  const right = room.tileAt(tx + 1, ty);
  if (left !== null && !wallish(left)) px(ctx, '#232e4a', x, y, 1, T);
  if (right !== null && !wallish(right)) px(ctx, '#232e4a', x + T - 1, y, 1, T);
}

function lakeWallFace(ctx, x, y, tx, ty, room) {
  for (let band = 0; band < 4; band++) {
    const by = y + band * 4;
    px(ctx, pick(LAKE_ROCK, hash(tx, ty * 4 + band, 430)), x, by, T, 4);
    px(ctx, '#6a7ca8', x + rnd(tx, ty * 4 + band, 431, 7), by, 4 + rnd(tx, ty * 4 + band, 432, 8), 1);
    px(ctx, '#2e3a5c', x + rnd(tx, ty * 4 + band, 433, 9), by + 3, 3 + rnd(tx, ty * 4 + band, 434, 7), 1);
  }
  // Flowstone: long pale streaks where water has run down for ages.
  for (let i = 0; i < 2; i++) {
    if (hash(tx, ty, 440 + i) < 0.45) {
      const sx = x + 2 + rnd(tx, ty, 442 + i, 12);
      const len = 6 + rnd(tx, ty, 444 + i, 10);
      px(ctx, '#7f92b8', sx, y, 1, len);
      px(ctx, '#5a6a92', sx + 1, y + 2, 1, len - 3);
    }
  }
  if (hash(tx, ty, 450) < 0.15) px(ctx, '#bcd6ee', x + 2 + rnd(tx, ty, 451, 12), y + 2 + rnd(tx, ty, 452, 10), 1, 2);
  if (!room) return;
  if (wallish(room.tileAt(tx, ty - 1))) {
    px(ctx, '#222c48', x, y, T, 2);
    px(ctx, '#6a7ca8', x, y + 2, T, 1);
  }
  const below = room.tileAt(tx, ty + 1);
  if (below === '~') {
    // Standing in the lake: the water has darkened the foot of it.
    shade(ctx, x, y + 9, T, 7, 0.45, '4, 8, 24');
    px(ctx, '#2e5a58', x, y + 11, T, 1);
    px(ctx, '#070d19', x, y + T - 1, T, 1);
  } else if (below !== null && !wallish(below)) {
    px(ctx, '#222c48', x, y + T - 2, T, 2);
    for (let i = 0; i < 3; i++) if (hash(tx, ty, 70 + i) < 0.35) px(ctx, '#5f9a86', x + i * 5 + rnd(tx, ty, 80 + i, 3), y + T - 3, 2, 1);
  }
}

// The sunken hall's wall: pale dressed stone in neat courses, a green tide-line.
function lakeHallWall(ctx, x, y, tx, ty, room) {
  px(ctx, '#4a566e', x, y, T, T);
  for (let row = 0; row < 4; row++) {
    const rowY = y + row * 4;
    const off = (row + tx) % 2 ? 4 : 0;
    for (let bx = -off; bx < T; bx += 8) {
      const left = Math.max(0, bx);
      const width = Math.min(bx + 7, T) - left;
      if (width <= 0) continue;
      const r = hash(tx * 4 + Math.floor((bx + off) / 8), ty * 4 + row, 1);
      px(ctx, pick(['#8290a8', '#7a88a2', '#8896ae', '#76849e'], r), x + left, rowY, width, 3);
      px(ctx, '#a6b4ca', x + left, rowY, width, 1);
      if (r < 0.1) px(ctx, '#4a566e', x + left + 3, rowY + 1, 2, 2);
    }
  }
  // The tide-line: a band of green where the water stood, drips under it.
  px(ctx, '#3a6a64', x, y + 9, T, 2);
  px(ctx, '#2c5450', x, y + 11, T, 1);
  for (let i = 0; i < 5; i++) if (hash(tx, ty, 90 + i) < 0.6) px(ctx, '#2c5450', x + i * 3 + rnd(tx, ty, 100 + i, 2), y + 12, 1, 2 + rnd(tx, ty, 110 + i, 3));
  if (!room) return;
  if (!wallish(room.tileAt(tx, ty - 1)) && room.tileAt(tx, ty - 1) !== null) { px(ctx, '#cfdbea', x, y, T, 1); }
  if (wallish(room.tileAt(tx, ty - 1))) { px(ctx, '#3a465e', x, y, T, 2); px(ctx, '#a6b4ca', x, y + 2, T, 1); }
  const below = room.tileAt(tx, ty + 1);
  if (below === '~') { shade(ctx, x, y + 8, T, 8, 0.45, '4, 8, 24'); px(ctx, '#070d19', x, y + T - 1, T, 1); } else if (below !== null && !wallish(below)) px(ctx, '#2c3650', x, y + T - 2, T, 2);
}

function lakeWater(ctx, x, y, tx, ty, room) {
  murkyWater(ctx, x, y, tx, ty, room, { base: '#070d19', dark: '#050912', ripple: '#1d3050', glint: '#7fa8c8', lip: '#55688a', rim: '#02050b', reflect: true });
}

// A shallows you can wade: pale sand showing through clear cold water.
function lakeShallows(ctx, x, y, tx, ty, room) {
  px(ctx, '#2c5068', x, y, T, T);
  mottle(ctx, '#386078', x, y, tx, ty, 3, 9);
  mottle(ctx, '#4a7690', x, y, tx, ty, 5, 6);
  // Sand ripples under the surface.
  for (let r = 0; r < 3; r++) if (hash(tx, ty, 8 + r) < 0.6) px(ctx, '#6a9ab4', x + rnd(tx, ty, 12 + r, 10), y + 3 + r * 5, 4 + rnd(tx, ty, 16 + r, 5), 1);
  if (hash(tx, ty, 20) < 0.5) px(ctx, '#bcd6ee', x + 1 + rnd(tx, ty, 21, 13), y + 1 + rnd(tx, ty, 22, 13), 2, 1);
  if (hash(tx, ty, 23) < 0.12) { // a ring from a drip
    const rx = 3 + rnd(tx, ty, 24, 8);
    px(ctx, '#7aa4c0', x + rx, y + 6, 6, 1); px(ctx, '#7aa4c0', x + rx + 1, y + 9, 4, 1); px(ctx, '#7aa4c0', x + rx - 1, y + 7, 1, 2); px(ctx, '#7aa4c0', x + rx + 6, y + 7, 1, 2);
  }
  if (!room) return;
  const kind = (dx, dy) => room.tileAt(tx + dx, ty + dy);
  const soft = (dx, dy) => caveSoftEdge(room, tx, ty, dx, dy);
  const deep = (dx, dy) => kind(dx, dy) === '~' && !soft(dx, dy);
  const dry = (dx, dy) => { const c = kind(dx, dy); return c !== ';' && c !== '~' && c !== null && !soft(dx, dy); };
  if (deep(0, -1)) { shade(ctx, x, y, T, 5, 0.6, '2, 6, 16'); }
  if (deep(0, 1)) { shade(ctx, x, y + T - 5, T, 5, 0.6, '2, 6, 16'); }
  if (deep(-1, 0)) { shade(ctx, x, y, 5, T, 0.6, '2, 6, 16'); }
  if (deep(1, 0)) { shade(ctx, x + T - 5, y, 5, T, 0.6, '2, 6, 16'); }
  // Foam-edge where it meets the shore (the blend pass draws a ragged one where it can).
  if (dry(0, -1)) px(ctx, '#9ab4d0', x, y, T, 1);
  if (dry(0, 1)) px(ctx, '#9ab4d0', x, y + T - 1, T, 1);
  if (dry(-1, 0)) px(ctx, '#9ab4d0', x, y, 1, T);
  if (dry(1, 0)) px(ctx, '#9ab4d0', x + T - 1, y, 1, T);
}

function lakeChasmAsWater(ctx, x, y, tx, ty, room) { lakeWater(ctx, x, y, tx, ty, room); }

function lakePlanks(ctx, x, y, tx, ty, room) {
  planks(ctx, x, y, tx, ty, room, ['#7a766a', '#706c60', '#847f72', '#6a665a'], '#1c1a16', '#a8a496', '#2c2a24');
  // Algae at the damp ends.
  for (let i = 0; i < 3; i++) if (hash(tx, ty, 640 + i) < 0.5) px(ctx, '#3f6a58', x + rnd(tx, ty, 644 + i, 14), y + rnd(tx, ty, 648 + i, 14), 2, 1);
}
function lakeJetty(ctx, x, y, tx, ty, room) {
  planks(ctx, x, y, tx, ty, room, ['#7a766a', '#706c60', '#847f72', '#6a665a'], '#1c1a16', '#a8a496', '#2c2a24', true);
  for (let i = 0; i < 3; i++) if (hash(tx, ty, 640 + i) < 0.5) px(ctx, '#3f6a58', x + rnd(tx, ty, 644 + i, 14), y + rnd(tx, ty, 648 + i, 14), 2, 1);
}

function lakeCrystals(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  const glow = ctx.createRadialGradient(x + 8, y + 8, 1, x + 8, y + 8, 14);
  glow.addColorStop(0, 'rgba(150, 235, 235, 0.35)');
  glow.addColorStop(1, 'rgba(150, 235, 235, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(x - 6, y - 6, 28, 28);
  px(ctx, 'rgba(0,0,0,0.3)', x + 2, y + 12, 12, 3);
  for (const [sx, sy, w, h] of [[7, 1, 3, 12], [2, 6, 3, 7], [11, 4, 3, 9]]) {
    px(ctx, '#2a5a6a', x + sx - 1, y + sy, w + 2, h + 1);
    px(ctx, '#7acfd2', x + sx, y + sy, w, h);
    px(ctx, '#c8fafa', x + sx, y + sy, 1, h);
    px(ctx, '#4aa0b0', x + sx + w - 1, y + sy + 1, 1, h - 1);
    px(ctx, '#ffffff', x + sx, y + sy, 1, 1);
  }
}

function lakeBoulder(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  shade(ctx, x + 1, y + 12, 14, 3, 0.35, '2, 4, 14');
  px(ctx, '#1c2438', x + 2, y + 3, 12, 11);
  px(ctx, '#1c2438', x + 1, y + 5, 14, 7);
  px(ctx, '#8896b0', x + 3, y + 4, 10, 9);
  px(ctx, '#8896b0', x + 2, y + 6, 12, 5);
  px(ctx, '#b4c2d8', x + 4, y + 5, 4, 2);
  px(ctx, '#5f6e8c', x + 9, y + 10, 4, 2);
  px(ctx, '#3a6a64', x + 3, y + 11, 8, 1);
}

// A pale fluted column, standing up out of the water or the floor, a green tide-line round it.
function lakePillar(ctx, x, y, tx, ty, room) {
  waterFoot(ctx, x, y, tx, ty, room);
  px(ctx, '#222c48', x + 1, y + 8, 14, 7);
  px(ctx, '#222c48', x + 3, y - 26, 10, 36);
  px(ctx, '#222c48', x + 1, y - 31, 14, 6);
  px(ctx, '#7a88a2', x + 2, y + 9, 12, 5);
  px(ctx, '#8896ae', x + 4, y - 25, 8, 34);
  px(ctx, '#b4c2d8', x + 4, y - 25, 2, 34);
  px(ctx, '#5f6e8c', x + 10, y - 25, 2, 34);
  px(ctx, '#a6b4ca', x + 2, y + 9, 12, 1);
  px(ctx, '#9aa8c0', x + 2, y - 30, 12, 4);
  px(ctx, '#cfdbea', x + 2, y - 30, 12, 1);
  px(ctx, '#6a7894', x + 2, y - 27, 12, 1);
  for (let f = 7; f < 11; f += 3) px(ctx, '#6a7894', x + f, y - 24, 1, 32);
  // Tide-line and drips.
  px(ctx, '#3a6a64', x + 4, y + 1, 8, 3);
  px(ctx, '#2c5450', x + 4, y + 4, 8, 1);
  for (const sx of [5, 8, 10]) px(ctx, '#2c5450', x + sx, y + 5, 1, 3);
  waterRing(ctx, x, y, tx, ty, room);
}
function lakeBrokenPillar(ctx, x, y, tx, ty, room) {
  waterFoot(ctx, x, y, tx, ty, room);
  px(ctx, '#222c48', x + 1, y + 8, 14, 7);
  px(ctx, '#222c48', x + 3, y - 10, 10, 20);
  px(ctx, '#7a88a2', x + 2, y + 9, 12, 5);
  px(ctx, '#8896ae', x + 4, y - 9, 8, 18);
  px(ctx, '#b4c2d8', x + 4, y - 9, 2, 18);
  px(ctx, '#5f6e8c', x + 10, y - 9, 2, 18);
  for (const [sx, h] of [[4, 2], [7, 4], [10, 2]]) { px(ctx, '#222c48', x + sx - 1, y - 10 - h, 3, h + 1); px(ctx, '#8896ae', x + sx, y - 9 - h, 2, h); }
  px(ctx, '#3a6a64', x + 4, y + 2, 8, 3);
  px(ctx, '#2c5450', x + 4, y + 5, 8, 1);
  waterRing(ctx, x, y, tx, ty, room);
}

// A pillar's foot in the lake: the tile is water if any of its neighbours is.
function waterFoot(ctx, x, y, tx, ty, room) {
  if (!room) return;
  const near = [[-1, 0], [1, 0], [0, 1], [0, -1]].some(([dx, dy]) => room.tileAt(tx + dx, ty + dy) === '~');
  if (near) { px(ctx, '#070d19', x, y, T, T); mottle(ctx, '#050912', x, y, tx, ty, 3, 8); }
}
function waterRing(ctx, x, y, tx, ty, room) {
  if (!room) return;
  const near = [[-1, 0], [1, 0], [0, 1], [0, -1]].some(([dx, dy]) => room.tileAt(tx + dx, ty + dy) === '~');
  if (!near) return;
  px(ctx, '#2a4468', x + 1, y + T - 3, 14, 1);
  px(ctx, '#1d3050', x - 1, y + T - 1, 18, 1);
  px(ctx, '#3a5a84', x + 3, y + T - 4, 3, 1);
}

function lakeStalactite(ctx, x, y, tx, ty) {
  stalactite(ctx, x, y, tx, ty, ['#222c48', '#6a7ca8', '#8a9cc4'], '#cfdbea', '#ffffff');
  const t = performance.now() / 1000 + tx * 2.3 + ty;
  const k = (t % 5) / 5;
  if (k < 0.3) px(ctx, '#bcd6ee', x + 8, y + 2 + Math.floor(k / 0.3 * 26), 1, 2);
}
function lakeStalagmite(ctx, x, y, tx, ty) {
  stalagmite(ctx, x, y, tx, ty, ['#222c48', '#8896b0', '#b4c2d8'], '#5f6e8c');
}

// ============================================================
// THE DEEP: black rock, smooth, very old.
// ============================================================
const DEEP_FLOOR = ['#1b1923', '#1c1a25', '#19171f', '#1e1b27'];
const DEEP_ROCK = ['#14121b', '#181520', '#1c1926', '#16131d'];

function deepFloor(ctx, x, y, tx, ty, room) {
  px(ctx, pick(DEEP_FLOOR, hash(tx, ty, 1)), x, y, T, T);
  mottle(ctx, pick(['#1d1a26', '#1a1822', '#1c1925'], hash(tx, ty, 2)), x, y, tx, ty, 3, 9);
  // Odd smooth patches, polished by something, with a curved sheen.
  if (hash(tx, ty, 4) < 0.4) {
    const sx = rnd(tx, ty, 5, 6);
    const sy = rnd(tx, ty, 6, 6);
    px(ctx, '#27232f', x + sx + 1, y + sy, 8, 7);
    px(ctx, '#27232f', x + sx, y + sy + 1, 10, 5);
    px(ctx, '#3a3649', x + sx + 2, y + sy + 1, 4, 1);
    px(ctx, '#3a3649', x + sx + 1, y + sy + 2, 1, 2);
  }
  // Scratches: a few pale strokes, the way claws or a knife leave them.
  if (hash(tx, ty, 8) < 0.06) {
    // Long thin strokes at a slant, a few side by side.
    const n = 2 + rnd(tx, ty, 9, 2);
    for (let i = 0; i < n; i++) {
      const sx = x + 3 + i * 3 + rnd(tx, ty, 10 + i, 2);
      const sy = y + 3 + rnd(tx, ty, 14 + i, 3);
      for (let k = 0; k < 6; k++) px(ctx, '#34304a', sx + Math.floor(k / 3), sy + k);
    }
  }
  for (let i = 0; i < 3; i++) if (hash(tx, ty, 22 + i) < 0.5) px(ctx, hash(tx, ty, 26 + i) < 0.3 ? '#34304a' : '#0e0c14', x + rnd(tx, ty, 30 + i, 14) + 1, y + rnd(tx, ty, 34 + i, 14) + 1);
  if (hash(tx, ty, 40) < 0.05) px(ctx, '#3a6a86', x + rnd(tx, ty, 41, 13) + 1, y + rnd(tx, ty, 42, 13) + 1);
  if (!room) return;
  if (wallish(room.tileAt(tx, ty - 1))) { shade(ctx, x, y, T, 3, 0.6, '2, 2, 6'); shade(ctx, x, y + 3, T, 2, 0.3, '2, 2, 6'); }
  if (room.tileAt(tx, ty + 1) === '0') { px(ctx, '#0e0c14', x, y + T - 2, T, 2); px(ctx, '#2d2a3c', x + 1, y + T - 3, T - 2, 1); }
}

function deepAsh(ctx, x, y, tx, ty, room) {
  deepFloor(ctx, x, y, tx, ty, room);
  // Fine pale powder, old and undisturbed, in soft drifts.
  mottle(ctx, '#2a2736', x, y, tx, ty, 50, 10);
  for (let i = 0; i < 10; i++) px(ctx, pick(['#3a3648', '#2a2736', '#454058'], hash(tx, ty, 60 + i)), x + rnd(tx, ty, 70 + i, 15), y + rnd(tx, ty, 80 + i, 15));
}

function deepWallTop(ctx, x, y, tx, ty, room) {
  px(ctx, '#07060b', x, y, T, T);
  if (hash(tx, ty, 1) < 0.6) px(ctx, '#0d0b13', x + rnd(tx, ty, 2, 9), y + rnd(tx, ty, 3, 9), 6, 5);
  if (hash(tx, ty, 4) < 0.35) px(ctx, '#050409', x + rnd(tx, ty, 5, 11), y + rnd(tx, ty, 6, 11), 4, 3);
  if (!room) return;
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && below !== '#') {
    px(ctx, '#201d2c', x, y + T - 3, T, 2);
    px(ctx, '#34304a', x, y + T - 3, T, 1);
    px(ctx, '#020104', x, y + T - 1, T, 1);
  }
  const left = room.tileAt(tx - 1, ty);
  const right = room.tileAt(tx + 1, ty);
  if (left !== null && !wallish(left)) px(ctx, '#1a1826', x, y, 1, T);
  if (right !== null && !wallish(right)) px(ctx, '#1a1826', x + T - 1, y, 1, T);
}

// Where a root of crystal runs up through the rock: a thin, winding line that
// carries on from tile to tile, faintly glowing, brighter at the odd node.
function rootVein(ctx, x, y, tx, ty, salt, bright = 1) {
  const base = 3 + hash(tx, 0, salt) * 9;
  const phase = hash(tx, 0, salt + 1) * 6.28;
  for (let vy = 0; vy < T; vy++) {
    const wy = ty * T + vy;
    const vx = Math.max(1, Math.min(14, Math.round(base + 2.6 * Math.sin(wy * 0.29 + phase) + 1.2 * Math.sin(wy * 0.71 + phase * 2))));
    px(ctx, '#1b2b36', x + vx - 1, y + vy, 3, 1);
    px(ctx, '#2f5a70', x + vx, y + vy);
    if (hash(wy, tx, salt + 2) < 0.35 * bright) px(ctx, '#56a4c4', x + vx, y + vy);
    if (hash(wy, tx, salt + 3) < 0.07 * bright) { px(ctx, '#a8e4f8', x + vx, y + vy); px(ctx, '#3e7a96', x + vx + 1, y + vy); px(ctx, '#3e7a96', x + vx - 1, y + vy); }
  }
}

function deepWallFace(ctx, x, y, tx, ty, room) {
  for (let band = 0; band < 4; band++) {
    const by = y + band * 4;
    px(ctx, pick(DEEP_ROCK, hash(tx, ty * 4 + band, 430)), x, by, T, 4);
    // Smooth, bulging forms: a curved highlight arcing along the band.
    const hx = rnd(tx, ty * 4 + band, 431, 6);
    px(ctx, '#2a2736', x + hx + 1, by, 8, 1);
    px(ctx, '#34304a', x + hx + 3, by, 3, 1);
    px(ctx, '#0b0911', x + rnd(tx, ty * 4 + band, 433, 9), by + 3, 4 + rnd(tx, ty * 4 + band, 434, 7), 1);
  }
  if (hash(tx, ty, 440) < 0.4) rootVein(ctx, x, y, tx, ty, 441);
  // Tally-like scratches, very old, here and there.
  if (hash(tx, ty, 450) < 0.08) {
    const n = 3 + rnd(tx, ty, 451, 3);
    for (let i = 0; i < n; i++) px(ctx, '#3e3a4e', x + 3 + i * 2, y + 4 + rnd(tx, ty, 452 + i, 2), 1, 4);
  }
  if (!room) return;
  if (wallish(room.tileAt(tx, ty - 1))) {
    px(ctx, '#0b0911', x, y, T, 2);
    px(ctx, '#34304a', x, y + 2, T, 1);
  }
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && !wallish(below)) {
    px(ctx, '#0a080f', x, y + T - 2, T, 2);
    for (let i = 0; i < 3; i++) if (hash(tx, ty, 70 + i) < 0.3) px(ctx, '#2a2736', x + i * 5 + rnd(tx, ty, 80 + i, 3), y + T - 3, 2, 1);
  }
}

// An odd smooth wall: rock that melted and set, in long soft folds like wax.
function deepSmoothWall(ctx, x, y, tx, ty, room) {
  px(ctx, '#15121d', x, y, T, T);
  for (let row = 0; row < 8; row++) {
    const wy = ty * T + y * 0 + row * 2;
    const curve = Math.round(Math.sin(wy * 0.5 + hash(0, ty, 500) * 6) * 2 + Math.sin((tx * T) * 0.2 + row) * 1);
    px(ctx, row % 2 ? '#1c1926' : '#211e2d', x + Math.max(0, curve), y + row * 2, T - Math.max(0, curve), 2);
    px(ctx, '#302c42', x + 3 + ((row * 5 + tx * 3) % 7), y + row * 2, 4, 1);
  }
  if (hash(tx, ty, 510) < 0.25) rootVein(ctx, x, y, tx, ty, 511, 0.6);
  if (!room) return;
  if (!wallish(room.tileAt(tx, ty - 1)) && room.tileAt(tx, ty - 1) !== null) px(ctx, '#3e3a56', x, y, T, 1);
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && !wallish(below)) px(ctx, '#0a080f', x, y + T - 2, T, 2);
}

function deepPlanks(ctx, x, y, tx, ty, room) {
  planks(ctx, x, y, tx, ty, room, ['#4a3d34', '#443830', '#52443a', '#3e332b'], '#0e0b0a', '#6a5a4c', '#1a1410');
}
function deepTrestle(ctx, x, y, tx, ty, room) {
  planks(ctx, x, y, tx, ty, room, ['#4a3d34', '#443830', '#52443a', '#3e332b'], '#0e0b0a', '#6a5a4c', '#1a1410', true);
}

function deepWater(ctx, x, y, tx, ty, room) {
  murkyWater(ctx, x, y, tx, ty, room, { base: '#04040a', dark: '#030307', ripple: '#14182a', glint: '#5a8ea8', lip: '#2d2a3c', rim: '#010103', sparse: true });
}

function deepSeep(ctx, x, y, tx, ty, room) {
  deepFloor(ctx, x, y, tx, ty, room);
  mottle(ctx, '#0c0b14', x, y, tx, ty, 3, 10);
  mottle(ctx, '#0a0912', x, y, tx, ty, 5, 7);
  if (hash(tx, ty, 8) < 0.4) px(ctx, '#2f4a5e', x + 3 + rnd(tx, ty, 9, 8), y + 3 + rnd(tx, ty, 10, 8), 3, 1);
  if (hash(tx, ty, 12) < 0.2) px(ctx, '#5a8ea8', x + 3 + rnd(tx, ty, 13, 9), y + 5 + rnd(tx, ty, 14, 6), 1, 1);
}

function deepChasm(ctx, x, y, tx, ty, room) {
  chasm(ctx, x, y, tx, ty, room, {
    void: '#020206', face: ['#14121b', '#181520', '#1a1724'], lip: '#34304a', faceShadow: '#050409', edge: '#0e0c14', specks: '#3e7a96', haze: '8, 20, 34',
  });
}

function deepCrystals(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  const glow = ctx.createRadialGradient(x + 8, y + 8, 1, x + 8, y + 8, 16);
  glow.addColorStop(0, 'rgba(120, 200, 255, 0.38)');
  glow.addColorStop(1, 'rgba(120, 200, 255, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(x - 8, y - 8, 32, 32);
  px(ctx, 'rgba(0,0,0,0.35)', x + 2, y + 12, 12, 3);
  px(ctx, '#0e0c14', x + 3, y + 10, 10, 4);
  for (const [sx, sy, w, h] of [[7, 1, 3, 12], [3, 6, 3, 7], [11, 5, 3, 8]]) {
    px(ctx, '#0e2030', x + sx - 1, y + sy, w + 2, h + 1);
    px(ctx, '#3a82b4', x + sx, y + sy, w, h);
    px(ctx, '#8ad4f8', x + sx, y + sy, 1, h);
    px(ctx, '#2a5a86', x + sx + w - 1, y + sy + 1, 1, h - 1);
    px(ctx, '#e8fbff', x + sx, y + sy, 1, 1);
  }
}

function deepBoulder(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  shade(ctx, x + 1, y + 12, 14, 3, 0.45, '0, 0, 4');
  px(ctx, '#05040a', x + 2, y + 3, 12, 11);
  px(ctx, '#05040a', x + 1, y + 5, 14, 7);
  px(ctx, '#1c1926', x + 3, y + 4, 10, 9);
  px(ctx, '#1c1926', x + 2, y + 6, 12, 5);
  px(ctx, '#2d2a3c', x + 4, y + 5, 5, 2);
  px(ctx, '#4a4660', x + 5, y + 5, 2, 1);
  px(ctx, '#100e17', x + 9, y + 10, 4, 2);
}

// A column of smooth black stone that grew floor to ceiling, pinched in the
// middle like wax, a faint vein running up it.
function deepColumn(ctx, x, y, tx, ty) {
  shade(ctx, x + 1, y + 13, 14, 3, 0.45, '0, 0, 4');
  const top = y - 31;
  for (let r = 0; r < 46; r++) {
    const t = (r - 22) / 23;
    const half = 3.2 + 3.4 * t * t * t * t * 1.6 + 1.4 * Math.abs(t) ** 2;
    const w = Math.round(half * 2);
    const left = x + 8 - Math.round(half);
    px(ctx, '#05040a', left - 1, top + r, w + 2, 1);
    px(ctx, '#17141f', left, top + r, w, 1);
    px(ctx, '#252233', left, top + r, Math.max(1, Math.round(w / 3)), 1);
    px(ctx, '#0e0c14', left + w - Math.max(1, Math.round(w / 4)), top + r, Math.max(1, Math.round(w / 4)), 1);
    if (r % 11 === 5) px(ctx, '#3a3649', left + 1, top + r, 2, 1);
  }
  px(ctx, '#4a4660', x + 6, y - 10, 1, 3);
  for (let r = 4; r < 44; r++) if (hash(tx, r, 520) < 0.5) px(ctx, hash(tx, r, 521) < 0.3 ? '#56a4c4' : '#2f5a70', x + 8 + Math.round(Math.sin(r * 0.4) * 1.5), top + r);
}
function deepKnob(ctx, x, y) {
  shade(ctx, x + 1, y + 13, 14, 3, 0.45, '0, 0, 4');
  for (let r = 0; r < 24; r++) {
    const t = r / 23;
    const half = 2.4 + 5.2 * Math.sqrt(Math.max(0, 1 - ((1 - t) * 1.0) ** 2.4)) * (0.6 + 0.4 * t);
    const w = Math.round(half * 2);
    const left = x + 8 - Math.round(half);
    const py = y - 10 + r;
    px(ctx, '#05040a', left - 1, py, w + 2, 1);
    px(ctx, '#1c1926', left, py, w, 1);
    px(ctx, '#2d2a3c', left, py, Math.max(1, Math.round(w / 3)), 1);
  }
  px(ctx, '#4a4660', x + 5, y - 7, 3, 1);
  px(ctx, '#6a668a', x + 5, y - 7, 1, 1);
}

function deepStalactite(ctx, x, y, tx, ty) {
  stalactite(ctx, x, y, tx, ty, ['#05040a', '#1c1926', '#2d2a3c'], '#4a4660', '#6a668a');
  const t = performance.now() / 1000 + tx * 3.1 + ty;
  const k = (t % 9) / 9;
  if (k < 0.12) px(ctx, '#5a8ea8', x + 8, y + 2 + Math.floor(k / 0.12 * 28), 1, 2);
}
function deepStalagmite(ctx, x, y, tx, ty) {
  stalagmite(ctx, x, y, tx, ty, ['#05040a', '#1c1926', '#34304a'], '#0e0c14');
}

// ============================================================
// Shared drawing.
// ============================================================

// Water you can't walk on: dark and still, with faint reflections of what
// stands over it (walls, pillars), long glints, a ring where something moved,
// and a lit rim where the shore meets it.
function murkyWater(ctx, x, y, tx, ty, room, p) {
  px(ctx, p.base, x, y, T, T);
  mottle(ctx, p.dark, x, y, tx, ty, 120, 8);
  mottle(ctx, p.dark, x, y, tx, ty, 123, 6);
  // Long faint glints lying across the surface.
  const shift = (tx * 7 + ty * 3) % 8;
  px(ctx, p.ripple, x + shift, y + 5, 5 + rnd(tx, ty, 130, 3), 1);
  px(ctx, p.ripple, x + ((shift + 6) % 11), y + 11, 4 + rnd(tx, ty, 131, 3), 1);
  if (hash(tx, ty, 132) < (p.sparse ? 0.06 : 0.28)) {
    px(ctx, p.glint, x + 2 + rnd(tx, ty, 133, 11), y + 2 + rnd(tx, ty, 134, 11), 2, 1);
  }
  // A faint ring where something stirred.
  if (hash(tx, ty, 135) < (p.sparse ? 0.04 : 0.1)) {
    const rx = 2 + rnd(tx, ty, 136, 8);
    const ry = 4 + rnd(tx, ty, 137, 5);
    px(ctx, p.ripple, x + rx + 2, y + ry, 5, 1);
    px(ctx, p.ripple, x + rx, y + ry + 1, 1, 2);
    px(ctx, p.ripple, x + rx + 7, y + ry + 1, 1, 2);
    px(ctx, p.ripple, x + rx + 2, y + ry + 3, 5, 1);
  }
  if (!room) return;
  // Reflections: what stands in the next few tiles north is shown upside-down, wavering.
  if (p.reflect) {
    for (let k = 1; k <= 3; k++) {
      const c = room.tileAt(tx, ty - k);
      if (c === null) break;
      if (c === '~') continue;
      const standing = c === 'I' || c === 'J';
      if (c === 'W' || c === 'h' || standing || c === 'x') {
        const col = c === 'x' ? 'rgba(130, 235, 235, 0.32)' : standing ? 'rgba(150, 165, 195, 0.22)' : 'rgba(110, 130, 175, 0.16)';
        const strength = (4 - k) / 3;
        for (let i = 0; i < 6; i++) {
          const rx = standing ? 4 + i : 1 + i * 2 + rnd(tx, ty, 140 + i, 2);
          const wob = Math.round(Math.sin((performance.now ? 0 : 0) + i * 1.7 + ty) * 1);
          ctx.fillStyle = col;
          ctx.globalAlpha = strength;
          ctx.fillRect(x + rx + wob, y + (i % 3) * 5, standing ? 1 : 2, 3);
          ctx.globalAlpha = 1;
        }
      }
      break;
    }
  }
  const edge = (dx, dy) => { const c = room.tileAt(tx + dx, ty + dy); return c !== '~' && c !== null && c !== '0' && !caveSoftEdge(room, tx, ty, dx, dy); };
  // Where a wall stands in the water, it's dark right to its foot.
  const wallAbove = wallish(room.tileAt(tx, ty - 1));
  if (wallAbove) shade(ctx, x, y, T, 4, 0.5, '0, 2, 10');
  if (edge(0, -1) && !wallAbove) {
    px(ctx, p.lip, x, y, T, 2);
    px(ctx, p.rim, x, y + 2, T, 1);
  }
  if (edge(0, 1)) { px(ctx, p.rim, x, y + T - 2, T, 1); px(ctx, p.lip, x + 1, y + T - 1, T - 2, 1); }
  if (edge(-1, 0)) { px(ctx, p.lip, x, y, 2, T); px(ctx, p.rim, x + 2, y, 1, T); }
  if (edge(1, 0)) { px(ctx, p.lip, x + T - 2, y, 2, T); px(ctx, p.rim, x + T - 3, y, 1, T); }
}

// A drop into the dark. Where the floor ends, you see the far wall of the
// pit (striated rock, lit at its rim), then it falls away to black.
function chasm(ctx, x, y, tx, ty, room, p) {
  px(ctx, p.void, x, y, T, T);
  const isC = (dx, dy) => room?.tileAt(tx + dx, ty + dy) === '0' || room?.tileAt(tx + dx, ty + dy) === 'g';
  const top = !isC(0, -1);
  const faceH = top ? 8 : 0;
  if (top) {
    for (let r = 0; r < faceH; r++) {
      px(ctx, pick(p.face, hash(tx, r >> 1, 700)), x, y + r, T, 1);
      if (hash(tx, r, 701) < 0.3) px(ctx, p.edge, x + rnd(tx, r, 702, 12), y + r, 3 + rnd(tx, r, 703, 5), 1);
    }
    px(ctx, p.lip, x, y, T, 1);
    for (let i = 0; i < 4; i++) px(ctx, p.edge, x + 2 + i * 4 + rnd(tx, i, 704, 2), y + 1, 1, 5 + rnd(tx, i, 705, 3));
    px(ctx, p.faceShadow, x, y + faceH, T, 2);
  }
  // Fading down into black: faint haze up from the dark.
  const g = ctx.createLinearGradient(0, y + faceH, 0, y + T);
  g.addColorStop(0, `rgba(${p.haze}, 0.0)`);
  g.addColorStop(1, `rgba(${p.haze}, 0.14)`);
  ctx.fillStyle = g;
  ctx.fillRect(x, y + faceH, T, T - faceH);
  // Specks far below (the Deep: roots of crystal, a very long way down).
  if (p.specks) for (let i = 0; i < 3; i++) if (hash(tx, ty, 710 + i) < 0.4) {
    const sy = y + faceH + 1 + rnd(tx, ty, 714 + i, Math.max(1, T - faceH - 2));
    px(ctx, p.specks, x + 1 + rnd(tx, ty, 718 + i, 14), sy, 1, 1);
  }
  // The sides of the pit, where the floor runs along it.
  if (!isC(-1, 0) && room?.tileAt(tx - 1, ty) !== null) { px(ctx, p.edge, x, y + faceH, 2, T - faceH); px(ctx, p.lip, x, y + faceH, 1, T - faceH); }
  if (!isC(1, 0) && room?.tileAt(tx + 1, ty) !== null) { px(ctx, p.edge, x + T - 2, y + faceH, 2, T - faceH); px(ctx, p.lip, x + T - 1, y + faceH, 1, T - faceH); }
}

// Raised ledges: cut or fallen blocks of the region's rock you can jump onto.
function ledge(raise, theme) {
  return (ctx, x, y, tx, ty, room, floor, raiseAt) => {
    floor(ctx, x, y, tx, ty, room);
    const top = y - raise;
    px(ctx, theme.faceBase, x, top + T, T, raise);
    for (let row = 0; row * 4 < raise; row++) {
      const off = (row + tx) % 2 ? 4 : 0;
      for (let bx = -off; bx < T; bx += 8) {
        const left = Math.max(0, bx);
        const width = Math.min(bx + 7, T) - left;
        if (width > 0) {
          px(ctx, pick(theme.bricks, hash(tx * 3 + bx, ty * 5 + row, 31)), x + left, top + T + row * 4 + 1, width, 3);
          px(ctx, theme.brickHi, x + left, top + T + row * 4 + 1, width, 1);
        }
      }
    }
    px(ctx, theme.outline, x, y + T - 1, T, 1);
    px(ctx, pick(theme.tops, hash(tx, ty, 33)), x, top, T, T);
    if (hash(tx, ty, 34) < 0.5) px(ctx, theme.seam, x + 7, top + 1, 1, T - 2);
    if (hash(tx, ty, 35) < 0.4) px(ctx, theme.seam, x + 1, top + 9, T - 2, 1);
    if (hash(tx, ty, 36) < 0.3) px(ctx, theme.fleck, x + 3 + rnd(tx, ty, 37, 9), top + 3 + rnd(tx, ty, 38, 8), 2, 1);
    if (raiseAt(0, 1) < raise) px(ctx, theme.lit, x, top + T - 1, T, 1);
    if (raiseAt(0, -1) < raise) px(ctx, theme.outline, x, top, T, 1);
    if (raiseAt(-1, 0) < raise) px(ctx, theme.outline, x, top, 1, T + raise);
    if (raiseAt(1, 0) < raise) px(ctx, theme.outline, x + T - 1, top, 1, T + raise);
  };
}
const LEDGES = {
  diggings: {
    faceBase: '#241a13', bricks: ['#4d4036', '#473a31', '#54463b', '#42362d'], brickHi: '#6a5848', outline: '#120c08',
    tops: ['#6a5848', '#64523f', '#705e4c', '#5e4e3e'], seam: '#4a3c2e', fleck: '#8a7660', lit: '#a08a70',
  },
  stillwater: {
    faceBase: '#1c2438', bricks: ['#5b6a8c', '#55648a', '#62719a', '#506085'], brickHi: '#7f90b6', outline: '#070d19',
    tops: ['#8896b0', '#8290a8', '#8e9cb6', '#7c8aa4'], seam: '#5f6e8c', fleck: '#bcd6ee', lit: '#cfdbea',
  },
  deep: {
    faceBase: '#07060b', bricks: ['#1c1926', '#201d2c', '#181520', '#1e1b29'], brickHi: '#34304a', outline: '#020104',
    tops: ['#2b2838', '#2f2c3e', '#272434', '#322f44'], seam: '#1c1926', fleck: '#4a4660', lit: '#5a5678',
  },
};

// A stalactite hanging into the tile from the roof (walk under its point).
function stalactite(ctx, x, y, tx, ty, [outline, body, light], tip, tipLight) {
  const tall = 16 + rnd(tx, ty, 460, 10);
  const top = y - T + 2;
  const lean = hash(tx, ty, 461) < 0.5 ? -1 : 1;
  for (let row = 0; row < tall; row++) {
    const w = Math.max(1, Math.round(9 * (1 - row / tall)));
    const left = x + 8 - Math.floor(w / 2) + (row > tall * 0.6 ? lean : 0);
    px(ctx, outline, left - 1, top + row, w + 2, 1);
    px(ctx, row > tall - 4 ? tip : body, left, top + row, w, 1);
    if (w > 2) px(ctx, row > tall - 4 ? tipLight : light, left, top + row, 1, 1);
  }
}
// A stalagmite rising from the floor, solid, as tall as you.
function stalagmite(ctx, x, y, tx, ty, [outline, body, light], shadowTone) {
  shade(ctx, x + 1, y + 13, 14, 3, 0.35);
  const tall = 20 + rnd(tx, ty, 470, 6);
  for (let row = 0; row <= tall; row++) {
    const w = Math.max(1, Math.round(11 * (row / tall) ** 0.7));
    const left = x + 8 - Math.floor(w / 2);
    const py = y + 13 - tall + row;
    px(ctx, outline, left - 1, py, w + 2, 1);
    px(ctx, body, left, py, w, 1);
    px(ctx, light, left, py, Math.max(1, Math.floor(w / 3)), 1);
    if (w > 4 && row % 5 === 2) px(ctx, shadowTone, left + 1, py, w - 2, 1);
  }
}

// ============================================================
// The tables, and how they're hooked into tileset.js.
// ============================================================

// What stands under a block, boulder or crystal: the floor of the room's region.
const FLOORS = {
  diggings: { '.': digFloor, o: digPlanks, g: digTrestle, q: digGravel, ';': digWater },
  stillwater: { '.': lakeFloor, o: lakePlanks, g: lakeJetty, q: lakeShingle, ';': lakeShallows },
  deep: { '.': deepFloor, o: deepPlanks, g: deepTrestle, q: deepAsh, ';': deepSeep },
};
// For drawBaseFloor in tileset.js: the drawer for the floor `under` something, or null outside these regions.
export function deepBaseFloor(room, under) {
  const set = FLOORS[room?.area];
  if (!set) return null;
  return set[under] ?? set['.'];
}
const floorOf = (room, char = '.') => FLOORS[room.area][char] ?? FLOORS[room.area]['.'];

// letter -> { area: drawer }. A drawer that takes `floor` as its sixth
// argument draws on top of the floor beneath (called with it filled in).
const LOOKS = {
  '.': { diggings: digFloor, stillwater: lakeFloor, deep: deepFloor },
  '#': { diggings: digWallTop, stillwater: lakeWallTop, deep: deepWallTop },
  W: { diggings: digWallFace, stillwater: lakeWallFace, deep: deepWallFace },
  h: { diggings: digTimberWall, stillwater: lakeHallWall, deep: deepSmoothWall },
  o: { diggings: digPlanks, stillwater: lakePlanks, deep: deepPlanks },
  g: { diggings: digTrestle, stillwater: lakeJetty, deep: deepTrestle },
  q: { diggings: digGravel, stillwater: lakeShingle, deep: deepAsh },
  ';': { diggings: digWater, stillwater: lakeShallows, deep: deepSeep },
  '~': { diggings: digWater, stillwater: lakeWater, deep: deepWater },
  0: { diggings: digChasm, stillwater: lakeChasmAsWater, deep: deepChasm },
  x: { diggings: digCrystals, stillwater: lakeCrystals, deep: deepCrystals },
  O: { diggings: digBoulder, stillwater: lakeBoulder, deep: deepBoulder },
  I: { diggings: digPost, stillwater: lakePillar, deep: deepColumn },
  J: { diggings: digBrokenPost, stillwater: lakeBrokenPillar, deep: deepKnob },
  v: { diggings: digStalactite, stillwater: lakeStalactite, deep: deepStalactite },
  '^': { diggings: digStalagmite, stillwater: lakeStalagmite, deep: deepStalagmite },
};
// Drawers that stand on the floor under them.
const ON_FLOOR = new Set(['x', 'O']);

export function installDeepTiles(TILES) {
  // The one new letter: a drop into the dark. Solid, so nobody walks into it.
  // Light beams fly over it, like water and open sky.
  TILES['0'] = { solid: true, beamOver: true, draw: () => {} };
  for (const [char, looks] of Object.entries(LOOKS)) {
    const tile = TILES[char];
    if (!tile) continue;
    const original = tile.draw;
    tile.draw = (ctx, x, y, tx, ty, room) => {
      const look = looks[room?.area];
      if (!look) return original(ctx, x, y, tx, ty, room);
      if (ON_FLOOR.has(char)) return look(ctx, x, y, tx, ty, room, floorOf(room, '.'));
      return look(ctx, x, y, tx, ty, room);
    };
  }
  // Raised ledges.
  for (const [char, raise] of [['b', 12], ['B', 24]]) {
    const tile = TILES[char];
    const original = tile.draw;
    const makers = Object.fromEntries(Object.entries(LEDGES).map(([area, theme]) => [area, ledge(raise, theme)]));
    tile.draw = (ctx, x, y, tx, ty, room) => {
      const make = makers[room?.area];
      if (!make) return original(ctx, x, y, tx, ty, room);
      const raiseAt = (dx, dy) => TILES[room.tileAt(tx + dx, ty + dy)]?.raise ?? 0;
      // Planks and shingle round a ledge's foot are the floor under it.
      return make(ctx, x, y, tx, ty, room, floorOf(room, '.'), raiseAt);
    };
  }
}
