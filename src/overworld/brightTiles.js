// Chapter 4's bright regions, drawn tile by tile like the rest of the world
// (see tileset.js): Sunnyside (sunny fields), the Glimmering (crystal caves)
// and Belowtown (the creature folk's town in the old buried city).
//
// Each region keeps the usual letters but draws them its own way: `.` is the
// floor, `#` and `W` the wall top and face, `b` and `B` the raised blocks, `~`
// the water, and so on. tileset.js calls installBrightTiles once, after its
// TILES table is built; every letter listed in LOOKS below then draws the
// region's version when the room is in that region, and the old one anywhere
// else. Solidity and height stay the letter's own (a `~` is water everywhere,
// an `O` always blocks you). The letter tables are in
// notes/docs/chapter-4-builders-guide.md ("Tiles and looks").
//
// brightTileLights() says what glows in the tiles (crystals, lit windows, the
// water of the pools): lamplight.js adds them to the room's lights.

import { caveBlendOn, caveSoftEdge } from './caveBlend.js';
import { inCrag, cragFace, CRAG_ROCK } from './cragRock.js';

const T = 16;

function hash(tx, ty, salt = 0) {
  let h = (tx * 374761393 + ty * 668265263 + salt * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const pick = (list, roll) => list[Math.floor(roll * list.length)];
const px = (ctx, color, x, y, w = 1, h = 1) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };
const rnd = (tx, ty, salt, n) => Math.floor(hash(tx, ty, salt) * n);

// A soft, lumpy patch of a second tone (see mottle in tileset.js).
function mottle(ctx, color, x, y, tx, ty, salt, size = 6) {
  const mx = Math.floor(hash(tx, ty, salt) * (T - size));
  const my = Math.floor(hash(tx, ty, salt + 1) * (T - size));
  const lean = Math.floor(hash(tx, ty, salt + 2) * 3) - 1;
  px(ctx, color, x + mx, y + my + 1, size, size - 2);
  px(ctx, color, x + mx + 1, y + my, size - 2, size);
  px(ctx, color, x + Math.max(0, Math.min(T - size - 1, mx + lean)), y + my + Math.floor(size / 2) - 1, size + 1, 2);
}
// Filled round shapes, drawn a row at a time.
function disc(ctx, color, cx, cy, r) {
  for (let dy = -r; dy <= r; dy++) {
    const w = Math.round(Math.sqrt(r * r - dy * dy + 0.25));
    px(ctx, color, cx - w, cy + dy, w * 2 + 1, 1);
  }
}
function oval(ctx, color, cx, cy, rx, ry) {
  for (let dy = -ry; dy <= ry; dy++) {
    const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.25))));
    px(ctx, color, cx - w, cy + dy, w * 2 + 1, 1);
  }
}
const at = (room, tx, ty, dx = 0, dy = 0) => room?.tileAt(tx + dx, ty + dy);
const sameAs = (room, tx, ty, dx, dy, set) => set.includes(at(room, tx, ty, dx, dy));

// Walls that throw a shadow on the floor in front of them.
const WALLISH = '#WVHKk5678awe';
function wallShadow(ctx, x, y, tx, ty, room, rgb = '10, 6, 20', a1 = 0.45, a2 = 0.2) {
  if (!room || !WALLISH.includes(at(room, tx, ty - 1) ?? ' ')) return;
  ctx.fillStyle = `rgba(${rgb}, ${a1})`;
  ctx.fillRect(x, y, T, 3);
  ctx.fillStyle = `rgba(${rgb}, ${a2})`;
  ctx.fillRect(x, y + 3, T, 2);
}
function groundShadow(ctx, x, y, w = 13) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.fillRect(x + (T - w) / 2, y + 12, w, 3);
}

// =====================================================================
// Raised blocks (`b` 12 px, `B` 24 px), the same shape in every region:
// a front face as tall as the block rises and a top face above it, lit,
// reaching up into the tile behind. `look` says how to paint them.
// =====================================================================
function blockOf(raise, look) {
  return (ctx, x, y, tx, ty, room, floor) => {
    floor(ctx, x, y, tx, ty, room);
    const top = y - raise;
    const raiseAt = (dx, dy) => (room ? ({ b: 12, B: 24 }[at(room, tx, ty, dx, dy)] ?? 0) : 0);
    look.face(ctx, x, top + T, tx, ty, raise);
    px(ctx, look.edge, x, y + T - 1, T, 1);
    look.top(ctx, x, top, tx, ty);
    if (raiseAt(0, 1) < raise) px(ctx, look.lit, x, top + T - 1, T, 1);
    if (raiseAt(0, -1) < raise) px(ctx, look.edge, x, top, T, 1);
    if (raiseAt(-1, 0) < raise) px(ctx, look.edge, x, top, 1, T + raise);
    if (raiseAt(1, 0) < raise) px(ctx, look.edge, x + T - 1, top, 1, T + raise);
    // Natural rock (the Glimmering): its outside corners worn round, the ground
    // showing where the square corner was, and a dark rim along the new curve.
    if (look.round && room) roundCorners(ctx, x, y, tx, ty, room, raise, raiseAt, floor, look.edge);
  };
}
// Cuts the outside corners of a raised block off in a curve. The ground there is
// painted again (clipped to the corner): above the block's top it's the tile
// behind's floor, at the foot it's this tile's own.
function roundCorners(ctx, x, y, tx, ty, room, raise, raiseAt, floor, edge) {
  const top = y - raise;
  const flat = (dx, dy) => raiseAt(dx, dy) === 0 && !WALLISH.includes(at(room, tx, ty, dx, dy) ?? '#');
  // How far in from the side row i (counted from the corner) is cut, for radius r.
  const bite = (r, i) => Math.round(r - Math.sqrt(Math.max(0, r * r - (r - i - 0.5) ** 2))) + (i === 0 ? 1 : 0);
  const cut = (cx, cy, sx, sy, groundY, groundTy) => {
    const r = 3 + Math.floor(hash(tx, ty, 77 + sx * 3 + sy) * 2);
    const rowY = (i) => (sy < 0 ? cy + i : cy - 1 - i);
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < r; i++) {
      const len = bite(r, i);
      if (len) ctx.rect(sx < 0 ? cx : cx - len, rowY(i), len, 1);
    }
    ctx.clip();
    floor(ctx, x, groundY, tx, groundTy, room);
    ctx.restore();
    // The rim along the curve.
    for (let i = 0; i < r; i++) {
      const len = bite(r, i);
      px(ctx, edge, sx < 0 ? cx + len : cx - len - 1, rowY(i), 1, 1);
    }
  };
  // The top's back corners, against the floor of the tile behind.
  // (A tall block's top reaches two tiles back: the floor there is that tile's.)
  const back = Math.floor(-raise / T);
  const behind = flat(0, -1) && flat(0, back);
  if (behind && flat(-1, 0)) cut(x, top, -1, -1, y + back * T, ty + back);
  if (behind && flat(1, 0)) cut(x + T, top, 1, -1, y + back * T, ty + back);
  // The face's foot corners, against this tile's own floor.
  if (flat(0, 1) && flat(-1, 0)) cut(x, y + T, -1, 1, y, ty);
  if (flat(0, 1) && flat(1, 0)) cut(x + T, y + T, 1, 1, y, ty);
  // The back edge of the top, worn: here and there a pixel or two of it gone, so a
  // long shelf's skyline isn't ruled straight.
  if (behind) {
    const notch = (X) => { const g = Math.floor(X / 3); const r = hash(g, ty, 91); return r < 0.45 ? 0 : r < 0.85 ? 1 : 2; };
    ctx.save();
    ctx.beginPath();
    let any = false;
    for (let i = 0; i < T; i++) { const n = notch(tx * T + i); if (n) { ctx.rect(x + i, top, 1, n); any = true; } }
    if (any) {
      ctx.clip();
      floor(ctx, x, y + back * T, tx, ty + back, room);
    }
    ctx.restore();
    for (let i = 0; i < T; i++) { const n = notch(tx * T + i); if (n) px(ctx, edge, x + i, top + n, 1, 1); }
  }
  // The sides, the same: the rock bulges and bites in a pixel or so.
  for (const side of [-1, 1]) {
    if (!flat(side, 0)) continue;
    const sx = side < 0 ? x : x + T - 1;
    for (let Y = top + 5; Y < y + T - 4; Y++) {
      const r = hash(Math.floor(Y / 3), tx * 2 + side, 93);
      if (r < 0.6) continue;
      const tileRow = ty + Math.floor((Y - y) / T);
      if (tileRow < ty && raiseAt(0, tileRow - ty) > 0) continue;
      ctx.save();
      ctx.beginPath();
      ctx.rect(sx, Y, 1, 1);
      ctx.clip();
      floor(ctx, x, y + (tileRow - ty) * T, tx, tileRow, room);
      ctx.restore();
      px(ctx, edge, sx - side, Y, 1, 1);
    }
  }
}

// =====================================================================
// SUNNYSIDE
// =====================================================================
const SUN_GRASS = ['#68bf47', '#6bc249', '#66bd45', '#6cc34a'];
const DAISY = '#fffdf2';

// --- Soft edges (tileBlend.js): Sunnyside's grass, lane and flagstones get ragged
// edges between them, patches that run across tiles and little things lying about,
// painted once into the room's picture. The grass and the lane then leave out their
// per-tile colour and patch. A room can opt out with `softEdges: false`.
const sunBlendOn = (room) => Boolean(room && room.area === 'sunnyside' && room.softEdges !== false && !room.indoors);
const SUN_KINDS = { ',': 'turf', ':': 'path', '.': 'flags', '~': 'water', j: 'water', g: 'water' };
const SUN_BLEND_P = {
  turf: SUN_GRASS, turfHi: '#7dd356', turfLo: '#58ac3c', flowers: ['#ffd62e', '#f08ab8', DAISY],
  hi: '#efe5ca', lo: '#c8964f', crack: '#9a7a52', speck: ['#b88442', '#f0d29a', '#9a7a52'],
  path: ['#dcae6c'], ground: ['#d9ccaa'], driftwood: '#b88442', weed: ['#5fb040', '#4c9a34'], weedHi: '#86d860',
  // The brook.
  water: '#4ab4e6', wave: '#9ee2fa', foam: '#ffffff', troughs: '#3a96c8',
};
export function sunnyBlendLook(room) {
  if (!sunBlendOn(room)) return null;
  return {
    p: SUN_BLEND_P,
    kind: (c) => SUN_KINDS[c] ?? null,
    naturalWall: () => false,
    isLand: (k) => k === 'turf' || k === 'path',
    isWater: (k) => k === 'water',
    // The stones and planks in the brook stand on plain brook (their own pixels are left alone).
    floorOf: { j: '~', g: '~' },
    // The brook's banks, and its water in soft lighter and darker swirls.
    brook: { fringe: '#4ea03a', fringeHi: '#62b842', earth: '#7a5434', shade: '#2f7ab0', edge: '#3a96c8' },
    patches: { water: ['#8edcf8', 0.35, '#3a9ad2', 0.3] },
    // The hedges' leaves.
    hedge: { dark: '#215a2a', mid: '#2f7a34', light: '#4aa84c', top: '#2f7634', topHi: '#3f9444', topLo: '#2a6a30' },
  };
}

function sunGrass(ctx, x, y, tx, ty, room) {
  if (sunBlendOn(room)) px(ctx, SUN_GRASS[0], x, y, T, T);
  else {
    px(ctx, pick(SUN_GRASS, hash(tx, ty, 1)), x, y, T, T);
    mottle(ctx, '#7dd356', x, y, tx, ty, 2, 8);
    if (hash(tx, ty, 4) < 0.6) mottle(ctx, '#58ac3c', x, y, tx, ty, 5, 5);
  }
  for (let i = 0; i < 7; i++) {
    const bx = x + rnd(tx, ty, 10 + i, 15);
    const by = y + rnd(tx, ty, 20 + i, 13);
    px(ctx, i % 2 ? '#4c9a34' : '#92e468', bx, by, 1, i % 2 ? 2 : 1);
    if (i % 3 === 0) px(ctx, '#92e468', bx + 1, by - 1, 1, 1);
  }
  if (hash(tx, ty, 30) < 0.1) {
    const cx = x + 2 + rnd(tx, ty, 31, 11);
    const cy = y + 2 + rnd(tx, ty, 32, 11);
    px(ctx, '#3f8a2e', cx, cy, 3, 2);
    px(ctx, '#7dd356', cx + 1, cy, 1, 1);
  }
  const roll = hash(tx, ty, 40);
  const fx = x + 3 + rnd(tx, ty, 41, 10);
  const fy = y + 3 + rnd(tx, ty, 42, 9);
  if (roll < 0.13) {
    // A daisy.
    px(ctx, DAISY, fx - 1, fy, 3, 1);
    px(ctx, DAISY, fx, fy - 1, 1, 3);
    px(ctx, '#ffd23c', fx, fy, 1, 1);
  } else if (roll < 0.28) {
    // A buttercup, with a second one close by.
    px(ctx, '#ffd62e', fx, fy, 2, 2);
    px(ctx, '#fff3a0', fx, fy, 1, 1);
    px(ctx, '#3f8a2e', fx, fy + 2, 1, 1);
    if (hash(tx, ty, 43) < 0.5) {
      px(ctx, '#ffd62e', fx + 4, fy + 2, 2, 2);
      px(ctx, '#fff3a0', fx + 4, fy + 2, 1, 1);
    }
  } else if (roll < 0.32) {
    px(ctx, '#f08ab8', fx, fy, 2, 2);
    px(ctx, '#ffd0e4', fx, fy, 1, 1);
  }
}

// Warm flagstones in the sun, grass pushing up through the joints.
const SUN_SLAB = ['#d9ccaa', '#d2c4a2', '#decfae', '#cfc29e'];
function sunFlags(ctx, x, y, tx, ty, room) {
  const layout = hash(tx, ty, 1);
  const slabs = layout < 0.45 ? [[0, 0, 16, 16]]
    : layout < 0.8 ? (hash(tx, ty, 2) < 0.5 ? [[0, 0, 16, 8], [0, 8, 16, 8]] : [[0, 0, 8, 16], [8, 0, 8, 16]])
      : [[0, 0, 8, 8], [8, 0, 8, 8], [0, 8, 8, 8], [8, 8, 8, 8]];
  slabs.forEach(([sx, sy, w, h], i) => {
    px(ctx, pick(SUN_SLAB, hash(tx, ty, 10 + i)), x + sx, y + sy, w, h);
    px(ctx, '#efe5ca', x + sx + 1, y + sy, w - 2, 1);
    px(ctx, '#a99a7a', x + sx, y + sy + h - 1, w, 1);
    px(ctx, '#a99a7a', x + sx + w - 1, y + sy, 1, h);
    if (hash(tx, ty, 20 + i) < 0.15) px(ctx, '#bcae8e', x + sx + w - 4, y + sy + h - 4, 2, 2);
  });
  for (let i = 0; i < 4; i++) {
    if (hash(tx, ty, 50 + i) < 0.5) {
      const gx = x + 1 + rnd(tx, ty, 54 + i, 14);
      const gy = y + 1 + rnd(tx, ty, 58 + i, 14);
      px(ctx, '#5fb040', gx, gy, 1, 2);
      px(ctx, '#86d860', gx + 1, gy, 1, 1);
    }
  }
  if (hash(tx, ty, 62) < 0.1) px(ctx, '#ffd62e', x + 3 + rnd(tx, ty, 63, 10), y + 3 + rnd(tx, ty, 64, 10), 2, 2);
  wallShadow(ctx, x, y, tx, ty, room, '30, 60, 20', 0.3, 0.14);
}

// The dirt lane: warm gold, trodden, pebbled, grass creeping in at its edges.
const LANE = ['#dcae6c', '#d4a460', '#e0b476'];
function sunLane(ctx, x, y, tx, ty, room) {
  const smooth = sunBlendOn(room);
  px(ctx, smooth ? LANE[0] : pick(LANE, hash(tx, ty, 100)), x, y, T, T);
  if (!smooth) mottle(ctx, hash(tx, ty, 101) < 0.5 ? '#c8964f' : '#e8c284', x, y, tx, ty, 102, 6);
  for (let i = 0; i < 7; i++) {
    px(ctx, i % 3 ? '#f0d29a' : '#b88442', x + rnd(tx, ty, 110 + i, 15), y + rnd(tx, ty, 120 + i, 15), i % 3 ? 1 : 2, 1);
  }
  if (hash(tx, ty, 130) < 0.3) {
    const sx = x + 2 + rnd(tx, ty, 131, 11);
    const sy = y + 2 + rnd(tx, ty, 132, 11);
    px(ctx, '#9a7a52', sx, sy + 1, 3, 1);
    px(ctx, '#f6e2b8', sx, sy, 2, 1);
  }
  const grassy = (dx, dy) => at(room, tx, ty, dx, dy) === ',';
  for (let i = 0; i < T; i += 2) {
    const tuft = hash(tx * 3 + i, ty, 99) < 0.6 ? 1 : 2;
    if (grassy(0, -1)) px(ctx, '#66bd45', x + i, y, 2, tuft);
    if (grassy(0, 1)) px(ctx, '#66bd45', x + i, y + T - tuft, 2, tuft);
    if (grassy(-1, 0)) px(ctx, '#66bd45', x, y + i, tuft, 2);
    if (grassy(1, 0)) px(ctx, '#66bd45', x + T - tuft, y + i, tuft, 2);
  }
}

// Leaves: round clumps in three greens, for hedges and treetops.
function leafClumps(ctx, x, y, tx, ty, salt, cols, count, r, box = T) {
  for (let i = 0; i < count; i++) {
    const cx = x + rnd(tx, ty, salt + i, box);
    const cy = y + rnd(tx, ty, salt + 20 + i, box);
    disc(ctx, pick(cols, hash(tx, ty, salt + 40 + i)), cx, cy, r);
  }
}
function hedgeTop(ctx, x, y, tx, ty, room) {
  px(ctx, '#2a6a30', x, y, T, T);
  leafClumps(ctx, x, y, tx, ty, 200, ['#2f7634', '#348038', '#3f9444'], 7, 3);
  for (let i = 0; i < 6; i++) px(ctx, '#5cb454', x + rnd(tx, ty, 260 + i, 15), y + rnd(tx, ty, 270 + i, 15), 2, 1);
  if (!room) return;
  const below = at(room, tx, ty + 1);
  if (below !== null && !WALLISH.includes(below)) px(ctx, '#1f5226', x, y + T - 2, T, 2);
}
function hedgeFace(ctx, x, y, tx, ty, room, blossoms = 0.07) {
  px(ctx, '#3c8f40', x, y, T, T);
  leafClumps(ctx, x, y, tx, ty, 300, ['#4aa84c', '#3c8f40', '#2f7a34'], 8, 3);
  for (let i = 0; i < 8; i++) px(ctx, '#7cd468', x + rnd(tx, ty, 330 + i, 15), y + rnd(tx, ty, 340 + i, 15), 2, 1);
  for (let i = 0; i < 5; i++) px(ctx, '#215a2a', x + rnd(tx, ty, 350 + i, 15), y + 2 + rnd(tx, ty, 360 + i, 13), 3, 1);
  for (let i = 0; i < 10; i++) {
    if (hash(tx, ty, 370 + i) < blossoms * 3) {
      const bx = x + rnd(tx, ty, 380 + i, 14);
      const by = y + rnd(tx, ty, 390 + i, 14);
      const c = hash(tx, ty, 400 + i) < 0.6 ? '#fffdf2' : '#ffb8d4';
      px(ctx, c, bx, by, 2, 2);
      px(ctx, '#ffd23c', bx, by, 1, 1);
    }
  }
  if (!room) return;
  if (at(room, tx, ty - 1) === '#') px(ctx, '#58b852', x, y, T, 2);
  const below = at(room, tx, ty + 1);
  if (below !== null && !WALLISH.includes(below)) {
    px(ctx, '#215a2a', x, y + T - 3, T, 3);
    px(ctx, '#2f7a34', x, y + T - 4, T, 1);
  }
}

// Banks: grass on top, earth in front with roots and stones, a fringe of grass
// hanging over the lip.
const sunBank = {
  edge: '#3a5a22',
  lit: '#a4ee74',
  face(ctx, x, y, tx, ty, raise) {
    px(ctx, '#7a5434', x, y, T, raise);
    for (let row = 0; row * 4 < raise; row++) {
      for (let bx = 0; bx < T; bx += 5) {
        const roll = hash(tx * 3 + bx, ty * 5 + row, 31);
        px(ctx, roll < 0.5 ? '#9a6c46' : '#8a6240', x + bx, y + row * 4 + 1, 5, 3);
        if (roll > 0.85) px(ctx, '#b8a890', x + bx + 1, y + row * 4 + 2, 2, 2);
        if (roll < 0.1) px(ctx, '#6a4a2c', x + bx + 1, y + row * 4 + 1, 3, 1);
      }
    }
    for (let i = 0; i < T; i += 2) {
      const drop = 1 + (hash(tx * 7 + i, ty, 32) < 0.5 ? 1 : 0) + (hash(tx * 7 + i, ty, 33) < 0.2 ? 1 : 0);
      px(ctx, i % 4 ? '#4ea03a' : '#62b842', x + i, y, 2, drop);
    }
    px(ctx, 'rgba(40, 24, 10, 0.3)', x, y + raise - 3, T, 3);
  },
  top(ctx, x, y, tx, ty) {
    sunGrass(ctx, x, y, tx, ty);
    px(ctx, '#9af06a', x, y + T - 3, T, 2);
  },
};

// The brook: clear, bright, rippled, with the sky in it.
const isWater = (c) => c === '~' || c === 'j' || c === 'g';
// With the blend pass on, it draws the brook's bank where it meets grass or the lane
// (ragged), so the tile leaves out its own straight one there.
const softBank = (room, tx, ty, dx, dy) => sunBlendOn(room) && [',', ':'].includes(at(room, tx + dx, ty + dy));
function brook(ctx, x, y, tx, ty, room, lip = true) {
  // (One blue for all of it, so the tiles don't show as squares; the mottle
  // and ripples give it its texture.)
  px(ctx, '#4ab4e6', x, y, T, T);
  mottle(ctx, '#6ccaf2', x, y, tx, ty, 141, 8);
  const shift = (tx * 7 + ty * 3) % 8;
  px(ctx, '#9ee2fa', x + shift, y + 5, 5, 1);
  px(ctx, '#9ee2fa', x + ((shift + 7) % 12), y + 11, 4, 1);
  px(ctx, '#3a96c8', x + ((shift + 3) % 10), y + 8, 3, 1);
  if (hash(tx, ty, 142) < 0.4) px(ctx, '#ffffff', x + 2 + rnd(tx, ty, 143, 12), y + 2 + rnd(tx, ty, 144, 12), 2, 1);
  if (hash(tx, ty, 145) < 0.07) {
    const lx = x + 3 + rnd(tx, ty, 146, 8);
    const ly = y + 4 + rnd(tx, ty, 147, 7);
    px(ctx, '#3f9a3a', lx, ly, 4, 3);
    px(ctx, '#62b842', lx, ly, 2, 1);
    px(ctx, '#4ab4e6', lx + 2, ly, 1, 1);
    if (hash(tx, ty, 148) < 0.5) px(ctx, '#ffd0e4', lx + 1, ly - 1, 2, 1);
  }
  if (!room) return;
  if (lip && !isWater(at(room, tx, ty - 1)) && !softBank(room, tx, ty, 0, -1)) {
    px(ctx, '#7a5434', x, y, T, 2);
    for (let i = 0; i < T; i += 2) px(ctx, i % 4 ? '#4ea03a' : '#62b842', x + i, y, 2, 1 + (hash(tx * 5 + i, ty, 149) < 0.4 ? 1 : 0));
    px(ctx, '#2f7ab0', x, y + 2, T, 2);
    px(ctx, '#3a96c8', x, y + 4, T, 1);
  }
  if (!isWater(at(room, tx, ty + 1)) && !softBank(room, tx, ty, 0, 1)) px(ctx, '#3a96c8', x, y + T - 2, T, 2);
  if (!isWater(at(room, tx - 1, ty)) && !softBank(room, tx, ty, -1, 0)) px(ctx, '#3a96c8', x, y, 1, T);
  if (!isWater(at(room, tx + 1, ty)) && !softBank(room, tx, ty, 1, 0)) px(ctx, '#3a96c8', x + T - 1, y, 1, T);
}
function brookStones(ctx, x, y, tx, ty, room) {
  // (With the bank's edge drawn like any water tile's, so the bank runs on
  // unbroken above a stone.)
  brook(ctx, x, y, tx, ty, room);
  const ox = rnd(tx, ty, 150, 3) - 1;
  oval(ctx, '#8fdcf8', x + 8 + ox, y + 9, 7, 5);
  oval(ctx, '#7a766e', x + 8 + ox, y + 9, 6, 4);
  oval(ctx, '#b9b3a9', x + 8 + ox, y + 8, 6, 4);
  oval(ctx, '#d8d2c6', x + 7 + ox, y + 7, 3, 2);
  px(ctx, '#62b842', x + 10 + ox, y + 8, 2, 1);
  px(ctx, '#8a857c', x + 5 + ox, y + 11, 6, 1);
}
function plankBridge(ctx, x, y, tx, ty, room) {
  const lr = isWater(at(room, tx, ty - 1)) || isWater(at(room, tx, ty + 1));
  // Water on the sides (left and right) means you cross it going up or down.
  const sides = (isWater(at(room, tx - 1, ty)) && isWater(at(room, tx + 1, ty))) || !lr;
  brook(ctx, x, y, tx, ty, room, false);
  const plank = ['#d8a868', '#cf9e5e', '#e0b274'];
  if (sides) {
    for (let r = 0; r < 4; r++) {
      px(ctx, '#6a4524', x + 1, y + r * 4 + 3, T - 2, 1);
      px(ctx, pick(plank, hash(tx, ty * 4 + r, 160)), x + 1, y + r * 4, T - 2, 3);
      px(ctx, '#f0cc90', x + 1, y + r * 4, T - 2, 1);
      px(ctx, '#7a5430', x + 3, y + r * 4 + 1, 1, 1);
      px(ctx, '#7a5430', x + T - 4, y + r * 4 + 1, 1, 1);
    }
    px(ctx, '#6a4524', x, y, 1, T);
    px(ctx, '#6a4524', x + T - 1, y, 1, T);
    px(ctx, '#8a5e34', x + 1, y, 1, T);
    px(ctx, '#8a5e34', x + T - 2, y, 1, T);
  } else {
    for (let r = 0; r < 4; r++) {
      px(ctx, '#6a4524', x + r * 4 + 3, y + 1, 1, T - 2);
      px(ctx, pick(plank, hash(tx * 4 + r, ty, 160)), x + r * 4, y + 1, 3, T - 2);
      px(ctx, '#f0cc90', x + r * 4, y + 1, 1, T - 2);
    }
    px(ctx, '#6a4524', x, y, T, 1);
    px(ctx, '#6a4524', x, y + T - 1, T, 1);
    px(ctx, '#8a5e34', x, y + 1, T, 1);
    px(ctx, '#8a5e34', x, y + T - 2, T, 1);
  }
}

function hayBale(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  groundShadow(ctx, x, y, 14);
  disc(ctx, '#6a4a14', x + 8, y + 8, 7);
  disc(ctx, '#e6c05a', x + 8, y + 8, 6);
  disc(ctx, '#f0d070', x + 8, y + 7, 5);
  disc(ctx, '#d8aa44', x + 8, y + 8, 3);
  disc(ctx, '#c89a38', x + 8, y + 8, 1);
  for (const [a, b, w] of [[3, 5, 2], [10, 4, 2], [4, 11, 3], [9, 12, 2], [7, 3, 1]]) px(ctx, '#fff0a0', x + a, y + b, w, 1);
  px(ctx, '#8a5a28', x + 2, y + 10, 12, 1);
  px(ctx, '#f6dc86', x + 1, y + 6, 1, 1);
  px(ctx, '#f6dc86', x + 14, y + 9, 1, 1);
  px(ctx, '#f6dc86', x + 5, y + 14, 2, 1);
}

// A round, bushy tree; `fruit` dots it with apples. Standing, so it draws
// upward from the foot of its tile and may spread a tile either side.
function leafyTree(ctx, x, y, { crown = 13, fruit = null, lift = 24, hues = null } = {}) {
  const cols = hues ?? { out: '#1e4a24', dark: '#2f7a34', mid: '#3f9a42', light: '#62c05a', hi: '#9ae07a' };
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(x - 2, y + 12, 20, 4);
  px(ctx, '#3a2412', x + 6, y - 6, 5, 21);
  px(ctx, '#6b4423', x + 7, y - 6, 3, 21);
  px(ctx, '#8a5a32', x + 7, y - 6, 1, 21);
  px(ctx, '#4a2e18', x + 5, y + 13, 7, 2);
  px(ctx, '#6b4423', x + 4, y + 14, 2, 1);
  px(ctx, '#6b4423', x + 11, y + 14, 2, 1);
  const cx = x + 8;
  const cy = y - lift;
  const lumps = [[0, 0, crown], [-8, 4, crown - 4], [8, 4, crown - 4], [-4, -6, crown - 4], [5, -6, crown - 5], [0, 7, crown - 4]];
  for (const [dx, dy, r] of lumps) disc(ctx, cols.out, cx + dx, cy + dy, r + 1);
  for (const [dx, dy, r] of lumps) disc(ctx, cols.dark, cx + dx, cy + dy, r);
  for (const [dx, dy, r] of lumps) disc(ctx, cols.mid, cx + dx - 1, cy + dy - 2, Math.max(2, r - 3));
  for (const [dx, dy, r] of lumps.slice(0, 5)) disc(ctx, cols.light, cx + dx - 2, cy + dy - 4, Math.max(1, r - 7));
  for (const [dx, dy] of [[-6, -8], [2, -11], [7, -4], [-9, 0], [-1, -4]]) px(ctx, cols.hi, cx + dx, cy + dy, 3, 1);
  for (const [dx, dy] of [[-5, 8], [3, 9], [-9, 5], [8, 6]]) px(ctx, cols.out, cx + dx, cy + dy, 3, 1);
  if (fruit) {
    for (const [dx, dy] of [[-7, -2], [-2, 3], [5, -3], [8, 3], [-5, 8], [2, -8], [0, 8]]) {
      px(ctx, '#7a1c1c', cx + dx, cy + dy, 3, 3);
      px(ctx, fruit, cx + dx, cy + dy, 2, 2);
      px(ctx, '#ffd0c0', cx + dx, cy + dy, 1, 1);
    }
  }
}

function flowerBed(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  px(ctx, '#2f7a34', x + 1, y + 7, 14, 8);
  mottle(ctx, '#3f9a42', x, y + 3, tx, ty, 500, 9);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.fillRect(x + 1, y + 14, 14, 2);
  const kinds = [['#e84a3a', '#ffb0a0'], ['#5a8af0', '#c0d4ff'], ['#fffdf2', '#ffd23c'], ['#f08ab8', '#ffd0e4'], ['#ffd62e', '#fff3a0'], ['#a878e0', '#dcc4ff']];
  for (let i = 0; i < 11; i++) {
    const fx = x + 1 + rnd(tx, ty, 510 + i, 13);
    const fy = y + 2 + rnd(tx, ty, 530 + i, 9);
    const [c, hi] = pick(kinds, hash(tx, ty, 550 + i));
    px(ctx, '#3f8a2e', fx, fy + 2, 1, 3);
    px(ctx, c, fx - 1, fy, 3, 2);
    px(ctx, c, fx, fy - 1, 1, 4);
    px(ctx, hi, fx, fy, 1, 1);
  }
}
function meadowFlowers(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  for (let i = 0; i < 9; i++) {
    const fx = x + 1 + rnd(tx, ty, 600 + i, 13);
    const fy = y + 2 + rnd(tx, ty, 620 + i, 11);
    px(ctx, '#3f8a2e', fx, fy + 2, 1, 2);
    px(ctx, '#ffd62e', fx - 1, fy, 3, 2);
    px(ctx, '#ffd62e', fx, fy - 1, 1, 4);
    px(ctx, '#fff3a0', fx, fy, 1, 1);
  }
  for (let i = 0; i < 4; i++) px(ctx, '#92e468', x + rnd(tx, ty, 640 + i, 15), y + rnd(tx, ty, 650 + i, 12), 1, 3);
}
function blossomBush(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.fillRect(x + 1, y + 12, 14, 3);
  disc(ctx, '#215a2a', x + 8, y + 8, 7);
  disc(ctx, '#2f7a34', x + 8, y + 8, 6);
  disc(ctx, '#3f9a42', x + 7, y + 7, 4);
  for (let i = 0; i < 12; i++) {
    const bx = x + 2 + rnd(tx, ty, 700 + i, 11);
    const by = y + 2 + rnd(tx, ty, 720 + i, 11);
    px(ctx, hash(tx, ty, 740 + i) < 0.7 ? '#fffdf2' : '#ffd0e4', bx, by, 2, 2);
    px(ctx, '#ffd23c', bx, by, 1, 1);
  }
}
function whiteFence(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  ctx.fillStyle = 'rgba(20, 50, 20, 0.2)';
  ctx.fillRect(x, y + 13, T, 2);
  const across = room && (at(room, tx, ty, -1, 0) === 'f' || at(room, tx, ty, 1, 0) === 'f');
  const down = room && (at(room, tx, ty, 0, -1) === 'f' || at(room, tx, ty, 0, 1) === 'f');
  if (across || !down) {
    for (const ry of [5, 9]) {
      px(ctx, '#e8dcc0', x, y + ry, T, 2);
      px(ctx, '#fff8e4', x, y + ry, T, 1);
      px(ctx, '#b8a880', x, y + ry + 1, T, 1);
    }
    for (const fx of [2, 7, 12]) {
      px(ctx, '#d8cca8', x + fx, y + 3, 3, 11);
      px(ctx, '#fff8e4', x + fx, y + 3, 1, 11);
      px(ctx, '#b8a880', x + fx + 2, y + 3, 1, 11);
      px(ctx, '#fff8e4', x + fx + 1, y + 2, 1, 1);
    }
  }
  if (down && !across) {
    px(ctx, '#e8dcc0', x + 6, y, 3, T);
    px(ctx, '#fff8e4', x + 6, y, 1, T);
    px(ctx, '#b8a880', x + 8, y, 1, T);
    for (const fy of [2, 9]) {
      px(ctx, '#d8cca8', x + 4, y + fy, 7, 3);
      px(ctx, '#fff8e4', x + 4, y + fy, 7, 1);
    }
  }
}

// A whitewashed cottage in the fields: plaster, timber, flower boxes, thatch.
function sunCottageWall(ctx, x, y, tx, ty, room) {
  px(ctx, '#f6ecd4', x, y, T, 10);
  px(ctx, '#e6d8b8', x, y + 6, T, 4);
  px(ctx, '#7a5030', x, y, T, 1);
  px(ctx, '#7a5030', x, y + 9, T, 1);
  if (tx % 3 === 0) px(ctx, '#7a5030', x + 7, y, 2, 10);
  for (let i = 0; i < 3; i++) {
    px(ctx, i % 2 ? '#b8b0a0' : '#a8a090', x + i * 6 - (ty % 2 ? 2 : 0), y + 10, 6, 3);
    px(ctx, i % 2 ? '#a8a090' : '#b8b0a0', x + i * 6 - (ty % 2 ? 0 : 3), y + 13, 6, 3);
  }
  px(ctx, '#80786a', x, y + 12, T, 1);
  px(ctx, '#62b842', x, y + T - 2, T, 2);
  for (let i = 0; i < 4; i++) if (hash(tx, ty, 800 + i) < 0.5) px(ctx, '#ffd62e', x + 1 + i * 4, y + T - 3, 2, 1);
}
function sunCottageWindow(ctx, x, y, tx, ty, room) {
  sunCottageWall(ctx, x, y, tx, ty, room);
  px(ctx, '#7a5030', x + 2, y + 1, 12, 9);
  px(ctx, '#9ad4f0', x + 4, y + 2, 8, 7);
  px(ctx, '#d6f0fc', x + 4, y + 2, 3, 2);
  px(ctx, '#7a5030', x + 7, y + 2, 2, 7);
  px(ctx, '#7a5030', x + 4, y + 5, 8, 1);
  px(ctx, '#4a8ad0', x + 1, y + 1, 2, 9);
  px(ctx, '#4a8ad0', x + 13, y + 1, 2, 9);
  px(ctx, '#8a5a32', x + 2, y + 10, 12, 3);
  for (const [fx, c] of [[3, '#e84a3a'], [6, '#ffd62e'], [9, '#f08ab8'], [12, '#e84a3a']]) {
    px(ctx, '#3f8a2e', fx, y + 9, 1, 2);
    px(ctx, c, fx - 1, y + 8, 2, 2);
  }
}
function sunCottageDoor(ctx, x, y, tx, ty, room) {
  sunCottageWall(ctx, x, y, tx, ty, room);
  px(ctx, '#5a3a1e', x + 2, y, 12, T);
  px(ctx, '#3f8a58', x + 3, y + 1, 10, T - 1);
  px(ctx, '#56a872', x + 3, y + 1, 10, 1);
  for (const dx of [6, 9]) px(ctx, '#2f6a44', x + dx, y + 2, 1, T - 3);
  px(ctx, '#ffd23c', x + 10, y + 8, 2, 2);
  px(ctx, '#a8a090', x + 2, y + T - 2, 12, 2);
}
// The same door, standing open on a bright room inside.
function sunCottageDoorOpen(ctx, x, y, tx, ty, room) {
  sunCottageWall(ctx, x, y, tx, ty, room);
  px(ctx, '#5a3a1e', x + 2, y, 12, T);
  px(ctx, '#ffe9b0', x + 3, y + 1, 8, T - 1);
  px(ctx, '#f4c878', x + 3, y + 9, 8, 6);
  px(ctx, '#c88a4a', x + 3, y + 13, 8, 2);
  px(ctx, '#3f8a58', x + 11, y + 1, 3, T - 1);
  px(ctx, '#56a872', x + 11, y + 1, 1, T - 1);
  px(ctx, '#a8a090', x + 2, y + T - 2, 12, 2);
}
function sunThatch(ctx, x, y, tx, ty, room) {
  px(ctx, '#d4a44a', x, y, T, T);
  for (let row = 0; row < 8; row++) {
    px(ctx, row % 2 ? '#e4b860' : '#c89a40', x, y + row * 2, T, 1);
    for (let i = 0; i < T; i += 3) if (hash(tx * 5 + i, ty * 8 + row, 810) < 0.5) px(ctx, '#f0cc78', x + i + (row % 2), y + row * 2 + 1, 2, 1);
  }
  if (hash(tx, ty, 811) < 0.3) px(ctx, '#62b842', x + rnd(tx, ty, 812, 12), y + rnd(tx, ty, 813, 12), 3, 2);
  if (!room) return;
  if (at(room, tx, ty - 1) !== '7') { px(ctx, '#8a6420', x, y, T, 2); px(ctx, '#a87a30', x, y + 2, T, 1); }
  if (at(room, tx, ty + 1) !== '7') {
    px(ctx, '#a87a30', x, y + T - 4, T, 1);
    px(ctx, '#7a5a20', x, y + T - 3, T, 3);
    for (let i = 0; i < T; i += 2) px(ctx, '#d4a44a', x + i, y + T - 1 + (hash(tx * 3 + i, ty, 814) < 0.3 ? 0 : -1), 1, 1);
  }
  if (at(room, tx, ty, -1, 0) !== '7') px(ctx, '#8a6420', x, y, 1, T);
  if (at(room, tx, ty, 1, 0) !== '7') px(ctx, '#8a6420', x + T - 1, y, 1, T);
}

// =====================================================================
// THE GLIMMERING
// =====================================================================
// A crystal is [outline, dark face, light face, highlight, glint].
const HUES = [
  ['#0e3a4a', '#1f9ea8', '#4fe0d0', '#b8fff0', '#ffffff'], // teal
  ['#4a1048', '#b8309a', '#ff6ac8', '#ffc4ec', '#ffffff'], // pink
  ['#241058', '#6a40d0', '#a888ff', '#dccaff', '#ffffff'], // violet
  ['#4a2c08', '#d08a1c', '#ffd24a', '#fff0a0', '#ffffff'], // gold
];
const GLOW_COLORS = ['90, 240, 220', '255, 120, 200', '170, 130, 255', '255, 214, 110'];
const hueOf = (tx, ty, salt = 0) => Math.floor(hash(tx, ty, 900 + salt) * 4);

// One crystal: standing with its base centred on (bx, by), `w` wide (3, 5, 7
// or 9), `h` tall, tip leaning `lean` pixels. Left face light, right face
// dark, a bright edge down the middle, a glint near the tip.
function shard(ctx, bx, by, w, h, hue, lean = 0) {
  const c = HUES[hue];
  const rows = [];
  for (let r = 0; r < h; r++) {
    const cap = Math.min(w, 1 + 2 * r);
    const shift = Math.round(lean * (1 - r / Math.max(1, h - 1)));
    rows.push([bx - Math.floor(cap / 2) + shift, cap]);
  }
  const top = by - h + 1;
  rows.forEach(([x0, rw], r) => px(ctx, c[0], x0 - 1, top + r, rw + 2, 1));
  px(ctx, c[0], rows[0][0], top - 1, rows[0][1], 1);
  px(ctx, c[0], rows[h - 1][0], by + 1, rows[h - 1][1], 1);
  rows.forEach(([x0, rw], r) => {
    const half = Math.ceil(rw / 2);
    px(ctx, c[2], x0, top + r, half, 1);
    px(ctx, c[1], x0 + half, top + r, rw - half, 1);
    if (rw >= 3) px(ctx, c[3], x0 + Math.floor(rw / 2) - (rw >= 5 ? 1 : 0), top + r, 1, 1);
  });
  if (w >= 5) {
    px(ctx, c[4], rows[Math.min(h - 1, 3)][0] + 1, top + 3, 1, 2);
    px(ctx, c[3], rows[h - 1][0] + 1, by, w - 2, 1);
  }
  if (w >= 7 && h > 14) {
    for (let r = 8; r < h - 3; r += 9) px(ctx, c[1], rows[r][0], top + r, rows[r][1], 1);
  }
}
// The same hanging tip down from the cave roof.
function hangShard(ctx, bx, top, w, h, hue, lean = 0) {
  const c = HUES[hue];
  const rows = [];
  for (let r = 0; r < h; r++) {
    const fromTip = h - 1 - r;
    const cap = Math.min(w, 1 + 2 * fromTip);
    const shift = Math.round(lean * (r / Math.max(1, h - 1)));
    rows.push([bx - Math.floor(cap / 2) + shift, cap]);
  }
  rows.forEach(([x0, rw], r) => px(ctx, c[0], x0 - 1, top + r, rw + 2, 1));
  px(ctx, c[0], rows[h - 1][0], top + h, rows[h - 1][1], 1);
  rows.forEach(([x0, rw], r) => {
    const half = Math.ceil(rw / 2);
    px(ctx, c[2], x0, top + r, half, 1);
    px(ctx, c[1], x0 + half, top + r, rw - half, 1);
    if (rw >= 3) px(ctx, c[3], x0 + Math.floor(rw / 2) - (rw >= 5 ? 1 : 0), top + r, 1, 1);
  });
  px(ctx, c[4], rows[h - 1][0], top + h - 3, 1, 1);
}
function aura(ctx, cx, cy, r, hue, alpha = 0.3) {
  const [red, green, blue] = GLOW_COLORS[hue].split(',').map(Number);
  const g = ctx.createRadialGradient(cx, cy, 1, cx, cy, r);
  g.addColorStop(0, `rgba(${red}, ${green}, ${blue}, ${alpha})`);
  g.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
}

const GLIM_FLOOR = ['#5b4f94', '#605498', '#574b8e', '#66599d'];
function glimFloor(ctx, x, y, tx, ty, room) {
  px(ctx, pick(GLIM_FLOOR, hash(tx, ty, 1)), x, y, T, T);
  mottle(ctx, '#7266ac', x, y, tx, ty, 2, 8);
  if (hash(tx, ty, 5) < 0.6) mottle(ctx, '#4a3f7e', x, y, tx, ty, 6, 5);
  // Worn slab joints, faint.
  if (hash(tx, ty, 8) < 0.5) px(ctx, '#4a3f7e', x, y + 7 + rnd(tx, ty, 9, 3), T, 1);
  if (hash(tx, ty, 10) < 0.4) px(ctx, '#4a3f7e', x + 5 + rnd(tx, ty, 11, 6), y, 1, T);
  for (let i = 0; i < 4; i++) px(ctx, i % 2 ? '#3e3470' : '#8678c4', x + rnd(tx, ty, 20 + i, 15), y + rnd(tx, ty, 30 + i, 15), 2, 1);
  if (hash(tx, ty, 40) < 0.35) px(ctx, '#d4c8ff', x + rnd(tx, ty, 41, 14), y + rnd(tx, ty, 42, 14), 1, 1);
  // A patch of glowing moss in a corner, and a tiny crystal seed.
  if (hash(tx, ty, 50) < 0.14) {
    mottle(ctx, '#2f9e8a', x, y, tx, ty, 51, 5);
    for (let i = 0; i < 3; i++) px(ctx, '#8affd8', x + rnd(tx, ty, 55 + i, 14), y + rnd(tx, ty, 58 + i, 14), 1, 1);
  } else if (hash(tx, ty, 60) < 0.06) {
    const hue = hueOf(tx, ty, 61);
    const sx = x + 3 + rnd(tx, ty, 62, 10);
    const sy = y + 6 + rnd(tx, ty, 63, 6);
    shard(ctx, sx, sy, 3, 4, hue);
  }
  wallShadow(ctx, x, y, tx, ty, room, '16, 6, 44', 0.5, 0.24);
}
// Floor carpeted in glowing moss.
// Patches laid on a different floor (moss, turf) shouldn't be neat squares:
// where one meets bare floor its edge goes ragged. Lays the floor down first,
// then clips what's drawn next to a notched shape. Returns true if it clipped,
// and then the caller must ctx.restore() when it's done.
function raggedPatch(ctx, x, y, tx, ty, room, bareChars, floor) {
  // (Where the blend pass softens the room, it draws the ragged edge itself.)
  if (caveBlendOn(room) && !room.indoors) return false;
  const bare = (dx, dy) => bareChars.includes(at(room, tx, ty, dx, dy) ?? '#');
  const soft = { l: bare(-1, 0), r: bare(1, 0), u: bare(0, -1), d: bare(0, 1) };
  if (!(soft.l || soft.r || soft.u || soft.d)) return false;
  floor(ctx, x, y, tx, ty, room);
  ctx.save();
  ctx.beginPath();
  const bite = (salt, i) => 1 + (hash(tx, ty, salt + i) < 0.35 ? 2 : hash(tx, ty, salt + i) < 0.7 ? 1 : 0);
  for (let j = 0; j < T; j++) {
    for (let i = 0; i < T; i++) {
      if (soft.l && i < bite(600, j)) continue;
      if (soft.r && T - 1 - i < bite(620, j)) continue;
      if (soft.u && j < bite(640, i)) continue;
      if (soft.d && T - 1 - j < bite(660, i)) continue;
      ctx.rect(x + i, y + j, 1, 1);
    }
  }
  ctx.clip();
  return true;
}
function glimMoss(ctx, x, y, tx, ty, room) {
  const clipped = raggedPatch(ctx, x, y, tx, ty, room, '.q', glimFloor);
  glimMossBody(ctx, x, y, tx, ty, room);
  if (clipped) ctx.restore();
}
function glimMossBody(ctx, x, y, tx, ty, room) {
  px(ctx, hash(tx, ty, 1) < 0.5 ? '#2c8a78' : '#319080', x, y, T, T);
  mottle(ctx, '#3cc4a0', x, y, tx, ty, 2, 8);
  mottle(ctx, '#58e0b8', x, y, tx, ty, 5, 4);
  if (hash(tx, ty, 8) < 0.6) mottle(ctx, '#1f6e66', x, y, tx, ty, 9, 5);
  for (let i = 0; i < 9; i++) {
    const bx = x + rnd(tx, ty, 20 + i, 15);
    const by = y + rnd(tx, ty, 30 + i, 13);
    px(ctx, i % 2 ? '#9affe0' : '#1f7a6e', bx, by, 1, 2);
  }
  for (let i = 0; i < 3; i++) if (hash(tx, ty, 50 + i) < 0.5) px(ctx, '#e8fff4', x + rnd(tx, ty, 54 + i, 14), y + rnd(tx, ty, 58 + i, 14), 1, 1);
  wallShadow(ctx, x, y, tx, ty, room, '10, 30, 40', 0.4, 0.2);
}
function glimWallTop(ctx, x, y, tx, ty, room) {
  px(ctx, '#1d1440', x, y, T, T);
  leafClumps(ctx, x, y, tx, ty, 100, ['#261a50', '#2c2058', '#21174a'], 5, 3);
  if (hash(tx, ty, 150) < 0.2) px(ctx, '#7a68c8', x + rnd(tx, ty, 151, 14), y + rnd(tx, ty, 152, 9), 1, 1);
  if (!room) return;
  const below = at(room, tx, ty + 1);
  if (below !== null && below !== '#' && below !== 'k') {
    px(ctx, '#3c2e78', x, y + T - 3, T, 2);
    px(ctx, '#8a74d4', x, y + T - 3, T, 1);
    px(ctx, '#0c0620', x, y + T - 1, T, 1);
  }
  const left = at(room, tx, ty, -1, 0);
  const right = at(room, tx, ty, 1, 0);
  if (left !== null && !WALLISH.includes(left)) px(ctx, '#3c2e78', x, y, 1, T);
  if (right !== null && !WALLISH.includes(right)) px(ctx, '#3c2e78', x + T - 1, y, 1, T);
}
function glimWallFace(ctx, x, y, tx, ty, room, nubs = true) {
  // A climbing face (a room's `crag`): broken rock, not courses (cragRock.js).
  if (room && inCrag(room, tx, ty)) { cragFace(ctx, x, y, tx, ty, room, CRAG_ROCK.glimmer, (c) => 'WKGVH'.includes(c ?? '#')); return; }
  px(ctx, '#43367c', x, y, T, T);
  for (let band = 0; band < 4; band++) {
    const by = y + band * 4;
    px(ctx, pick(['#4b3d86', '#52438f', '#473a80', '#4f4089'], hash(tx, ty * 4 + band, 160)), x, by, T, 3);
    px(ctx, '#6a5aaa', x + rnd(tx, ty * 4 + band, 161, 6), by, 5 + rnd(tx, ty * 4 + band, 162, 8), 1);
    px(ctx, '#2f2460', x, by + 3, T, 1);
  }
  if (hash(tx, ty, 163) < 0.5) px(ctx, '#2a2054', x + 2 + rnd(tx, ty, 164, 11), y, 1, 6 + rnd(tx, ty, 165, 8));
  // A thin vein of crystal across the stone, with a bright heart.
  if (hash(tx, ty, 166) < 0.55) {
    const hue = hueOf(tx, ty, 167);
    let vx = rnd(tx, ty, 168, 6);
    let vy = rnd(tx, ty, 169, 10);
    const dir = hash(tx, ty, 170) < 0.5 ? 1 : -1;
    if (dir < 0) vx = T - 1 - vx;
    for (let i = 0; i < 12; i++) {
      if (vx < 0 || vx >= T || vy >= T) break;
      px(ctx, HUES[hue][2], x + vx, y + vy);
      px(ctx, HUES[hue][3], x + vx, y + Math.max(0, vy - 1));
      vx += dir;
      vy += hash(tx, ty, 171 + i) < 0.5 ? 1 : 0;
    }
  }
  if (!room) return;
  if (at(room, tx, ty - 1) === '#' || at(room, tx, ty - 1) === 'k') {
    px(ctx, '#3c2e78', x, y, T, 2);
    px(ctx, '#8a74d4', x, y + 2, T, 1);
  }
  const below = at(room, tx, ty + 1);
  if (below !== null && !WALLISH.includes(below)) {
    px(ctx, '#2f2460', x, y + T - 2, T, 2);
    if (nubs) {
      for (let i = 0; i < 3; i++) {
        if (hash(tx, ty, 180 + i) < 0.35) {
          const hue = hueOf(tx, ty, 185 + i);
          const bx = x + 2 + i * 5 + rnd(tx, ty, 190 + i, 3);
          px(ctx, HUES[hue][2], bx, y + T - 5, 2, 3);
          px(ctx, HUES[hue][3], bx, y + T - 5, 1, 2);
          px(ctx, HUES[hue][0], bx, y + T - 6, 2, 1);
        }
      }
    }
  }
}
// A fat vein of crystal running down the wall, bright and glowing.
function glimVeinWall(ctx, x, y, tx, ty, room) {
  glimWallFace(ctx, x, y, tx, ty, room, false);
  const hue = hueOf(tx, ty, 0);
  const c = HUES[hue];
  let vx = 5 + rnd(tx, ty, 210, 6);
  for (let vy = 0; vy < T; vy++) {
    px(ctx, c[0], x + vx - 2, y + vy, 5, 1);
    px(ctx, c[1], x + vx - 1, y + vy, 3, 1);
    px(ctx, c[2], x + vx - 1, y + vy, 2, 1);
    px(ctx, c[3], x + vx - 1, y + vy, 1, 1);
    if (vy % 5 === 2) px(ctx, c[4], x + vx, y + vy, 1, 1);
    const roll = hash(tx, ty, 220 + vy);
    vx += roll < 0.25 ? -1 : roll > 0.75 ? 1 : 0;
    vx = Math.max(3, Math.min(12, vx));
  }
}
// Luminous moss hanging down the stone in strands.
function glimMossWall(ctx, x, y, tx, ty, room) {
  glimWallFace(ctx, x, y, tx, ty, room);
  for (let i = 0; i < 5; i++) {
    const sx = x + 1 + i * 3 + rnd(tx, ty, 240 + i, 2);
    const len = 4 + rnd(tx, ty, 250 + i, 9);
    px(ctx, '#1f7a6e', sx, y, 1, len);
    px(ctx, '#3cc4a0', sx, y, 1, len - 1);
    px(ctx, '#9affe0', sx, y + len - 1, 1, 1);
    if (hash(tx, ty, 260 + i) < 0.5) px(ctx, '#e8fff4', sx + 1, y + len - 3, 1, 1);
  }
}
// A raised shelf of the cave's own rock: no masonry, just beds of stone of
// uneven thickness, a thread of crystal in one, a lit lip; the top worn smooth
// with a crack or a tuft of moss. Its outside corners are worn round.
const GLIM_BEDS = ['#4b3d86', '#52438f', '#473a80', '#584a96', '#4f4089'];
const glimBlock = {
  edge: '#1e1442',
  lit: '#d4c8ff',
  round: true,
  face(ctx, x, y, tx, ty, raise) {
    px(ctx, '#43367c', x, y, T, raise);
    // Beds a world-height apart, so a long shelf's run on from tile to tile.
    let by = 0;
    for (let bed = 0; by < raise; bed++) {
      const n = 3 + Math.floor(hash(bed, ty, 31) * 4);
      const h = Math.min(n, raise - by);
      px(ctx, pick(GLIM_BEDS, hash(bed, ty, 32)), x, y + by, T, h);
      // A lighter top to each bed, broken, and a dark seam under it.
      const lx = rnd(tx, ty * 8 + bed, 33, 8);
      px(ctx, '#6a5aaa', x + lx, y + by, 3 + rnd(tx, ty * 8 + bed, 34, 9), 1);
      if (by + h < raise) px(ctx, '#2f2460', x, y + by + h - 1, T, 1);
      if (hash(tx, ty * 8 + bed, 35) < 0.35) px(ctx, '#2f2460', x + 1 + rnd(tx, ty * 8 + bed, 36, 13), y + by + h - 1, 2, 1);
      by += h;
    }
    // Light from the upper left: the face a shade brighter at its left.
    ctx.fillStyle = 'rgba(200, 180, 255, 0.07)';
    ctx.fillRect(x, y, 5, raise);
    // A thread of crystal along one bed, with a bright heart.
    const hue = hueOf(tx, ty, 300);
    if (raise > 12 || hash(tx, ty, 301) < 0.6) {
      const vy = y + 3 + rnd(tx, ty, 303, Math.max(1, raise - 6));
      let vx = 0;
      while (vx < T) {
        const len = 2 + rnd(tx, vx, 304, 4);
        px(ctx, HUES[hue][2], x + vx, vy + (hash(tx, vx, 305) < 0.3 ? 1 : 0), len, 1);
        vx += len + (hash(tx, vx, 306) < 0.3 ? 1 : 0);
      }
      px(ctx, HUES[hue][4], x + 3 + rnd(tx, ty, 302, 10), vy, 1, 1);
    }
    // A crack down the face.
    if (hash(tx, ty, 307) < 0.35) {
      let cx = 2 + rnd(tx, ty, 308, 12);
      for (let cy = 1; cy < raise - 2; cy++) { px(ctx, '#2a2054', x + cx, y + cy); if (hash(tx, cy, 309) < 0.3) cx += hash(tx, cy, 310) < 0.5 ? -1 : 1; }
    }
    // The foot, darker where it meets the ground.
    px(ctx, '#2f2460', x, y + raise - 2, T, 2);
  },
  top(ctx, x, y, tx, ty) {
    px(ctx, '#8a7acc', x, y, T, T);
    mottle(ctx, pick(['#9486d6', '#8272c4', '#9080d0'], hash(tx, ty, 33)), x, y, tx, ty, 34, 9);
    if (hash(tx, ty, 35) < 0.6) mottle(ctx, '#7a6abc', x, y, tx, ty, 36, 6);
    // A crack across the top, wandering.
    if (hash(tx, ty, 37) < 0.35) {
      let cy = 3 + rnd(tx, ty, 38, 9);
      for (let cx = 1; cx < T - 1; cx++) { px(ctx, '#6a5aa8', x + cx, y + cy); if (hash(tx, cx, 39) < 0.3) cy = Math.max(2, Math.min(13, cy + (hash(tx, cx, 41) < 0.5 ? -1 : 1))); }
    }
    px(ctx, '#d4c8ff', x + 2 + rnd(tx, ty, 42, 11), y + 2 + rnd(tx, ty, 43, 9), 1, 1);
    // A tuft of glowing moss in a hollow, or a seed of crystal.
    if (hash(tx, ty, 44) < 0.22) {
      const mx = x + 2 + rnd(tx, ty, 45, 10);
      const my = y + 3 + rnd(tx, ty, 46, 9);
      px(ctx, '#2c8a78', mx, my, 4, 2);
      px(ctx, '#3cc4a0', mx + 1, my, 2, 1);
      px(ctx, '#9affe0', mx + 1, my - 1, 1, 1);
    } else if (hash(tx, ty, 47) < 0.3) shard(ctx, x + 4 + rnd(tx, ty, 39, 8), y + 12, 3, 4, hueOf(tx, ty, 40));
  },
};
const isGlimWater = (c) => c === '~' || c === 'j';
function glimWater(ctx, x, y, tx, ty, room) {
  px(ctx, hash(tx, ty, 320) < 0.5 ? '#1b86a0' : '#1f90ac', x, y, T, T);
  mottle(ctx, '#2aa6c8', x, y, tx, ty, 321, 8);
  mottle(ctx, '#3c78c0', x, y, tx, ty, 324, 5);
  const shift = (tx * 5 + ty * 3) % 7;
  px(ctx, '#47d0e0', x + shift, y + 4, 6, 1);
  px(ctx, '#47d0e0', x + ((shift + 5) % 10), y + 9, 5, 1);
  px(ctx, '#b8f6ff', x + ((shift + 2) % 11), y + 13, 4, 1);
  px(ctx, '#1b6a8a', x + ((shift + 4) % 9), y + 7, 3, 1);
  for (let i = 0; i < 3; i++) if (hash(tx, ty, 330 + i) < 0.5) px(ctx, '#e8fdff', x + rnd(tx, ty, 334 + i, 14), y + rnd(tx, ty, 338 + i, 14), 1, 1);
  if (hash(tx, ty, 345) < 0.18) px(ctx, '#c070d8', x + 3 + rnd(tx, ty, 346, 8), y + 3 + rnd(tx, ty, 347, 8), 4, 2);
  if (!room) return;
  if (!isGlimWater(at(room, tx, ty - 1)) && !caveSoftEdge(room, tx, ty, 0, -1)) {
    px(ctx, '#7a68c0', x, y, T, 2);
    px(ctx, '#d4c8ff', x, y, T, 1);
    px(ctx, '#1e1442', x, y + 2, T, 1);
    px(ctx, '#46c8dc', x, y + 3, T, 1);
  }
}
function glimShallows(ctx, x, y, tx, ty, room) {
  glimFloor(ctx, x, y, tx, ty, room);
  ctx.fillStyle = 'rgba(60, 220, 230, 0.42)';
  ctx.fillRect(x, y, T, T);
  const shift = (tx * 5 + ty * 3) % 7;
  px(ctx, '#9af4ff', x + shift, y + 5, 5, 1);
  px(ctx, '#9af4ff', x + ((shift + 6) % 11), y + 11, 4, 1);
  if (hash(tx, ty, 350) < 0.4) px(ctx, '#ffffff', x + 2 + rnd(tx, ty, 351, 12), y + 2 + rnd(tx, ty, 352, 12), 1, 1);
}

function crystalBlocker(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  const hue = hueOf(tx, ty, 0);
  const other = (hue + 1 + rnd(tx, ty, 400, 3)) % 4;
  aura(ctx, x + 8, y + 9, 14, hue, 0.3);
  ctx.fillStyle = 'rgba(10, 4, 30, 0.35)';
  ctx.fillRect(x + 1, y + 13, 14, 3);
  shard(ctx, x + 4, y + 14, 3, 8, other, -1);
  shard(ctx, x + 12, y + 14, 3, 9, other, 1);
  shard(ctx, x + 8, y + 14, 5, 15, hue, 0);
  shard(ctx, x + 6, y + 15, 3, 6, hue, -1);
  shard(ctx, x + 11, y + 15, 3, 5, hue, 1);
}
function crystalWall(ctx, x, y, tx, ty, room, floor) {
  px(ctx, '#2c2058', x, y, T, T);
  mottle(ctx, '#3a2c70', x, y, tx, ty, 410, 8);
  const hue = hueOf(tx, ty, 0);
  const other = (hue + 1 + rnd(tx, ty, 411, 3)) % 4;
  aura(ctx, x + 8, y + 8, 14, hue, 0.35);
  shard(ctx, x + 3, y + 15, 3, 10, other, -1);
  shard(ctx, x + 13, y + 15, 3, 11, other, 1);
  shard(ctx, x + 8, y + 15, 7, 18, hue, 0);
  shard(ctx, x + 5, y + 15, 3, 7, hue, -1);
  shard(ctx, x + 11, y + 15, 3, 8, hue, 1);
}
// Standing crystals (drawn with the characters, rising from the foot of the tile).
function crystalColumn(ctx, x, y, tx, ty) {
  const hue = hueOf(tx, ty, 0);
  const other = (hue + 2) % 4;
  aura(ctx, x + 8, y - 14, 22, hue, 0.3);
  ctx.fillStyle = 'rgba(10, 4, 30, 0.35)';
  ctx.fillRect(x, y + 12, 16, 4);
  shard(ctx, x + 2, y + 14, 3, 9, other, -1);
  shard(ctx, x + 14, y + 14, 3, 11, other, 1);
  shard(ctx, x + 8, y + 15, 9, 46, hue, 0);
  shard(ctx, x + 4, y + 15, 3, 14, hue, -1);
  shard(ctx, x + 12, y + 15, 3, 16, hue, 1);
}
function crystalSpires(ctx, x, y, tx, ty) {
  const hue = hueOf(tx, ty, 0);
  aura(ctx, x + 8, y - 4, 16, hue, 0.3);
  ctx.fillStyle = 'rgba(10, 4, 30, 0.35)';
  ctx.fillRect(x, y + 12, 16, 4);
  shard(ctx, x + 3, y + 14, 5, 15, (hue + 1) % 4, -1);
  shard(ctx, x + 12, y + 14, 5, 12, (hue + 2) % 4, 1);
  shard(ctx, x + 8, y + 15, 7, 28, hue, 0);
}
function crystalSpike(ctx, x, y, tx, ty) {
  const hue = hueOf(tx, ty, 0);
  aura(ctx, x + 8, y + 2, 13, hue, 0.28);
  ctx.fillStyle = 'rgba(10, 4, 30, 0.35)';
  ctx.fillRect(x + 1, y + 12, 14, 3);
  shard(ctx, x + 4, y + 14, 3, 9 + rnd(tx, ty, 420, 4), (hue + 1) % 4, -1);
  shard(ctx, x + 10, y + 14, 3, 7 + rnd(tx, ty, 421, 4), (hue + 3) % 4, 1);
  shard(ctx, x + 7, y + 15, 5, 17 + rnd(tx, ty, 422, 6), hue, 0);
}
function crystalHang(ctx, x, y, tx, ty) {
  const hue = hueOf(tx, ty, 0);
  const top = y - T + 2;
  hangShard(ctx, x + 4, top, 3, 9 + rnd(tx, ty, 430, 5), (hue + 1) % 4, 1);
  hangShard(ctx, x + 11, top, 3, 7 + rnd(tx, ty, 431, 5), (hue + 2) % 4, -1);
  hangShard(ctx, x + 8, top, 5, 14 + rnd(tx, ty, 432, 7), hue, 0);
  // A twinkle that comes and goes.
  const beat = Math.floor(performance.now() / 380 + tx * 3 + ty * 7) % 7;
  if (beat === 0) px(ctx, '#ffffff', x + 7, top + 5, 1, 1);
  if (beat === 3) px(ctx, '#ffffff', x + 9, top + 9, 1, 1);
}
function glowMushrooms(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  const hue = hueOf(tx, ty, 0);
  aura(ctx, x + 8, y + 8, 12, hue, 0.28);
  ctx.fillStyle = 'rgba(10, 4, 30, 0.3)';
  ctx.fillRect(x + 2, y + 13, 12, 2);
  for (const [mx, base, r] of [[4, 14, 3], [11, 14, 3], [8, 15, 4]]) {
    const c = HUES[(hue + (mx === 11 ? 1 : 0)) % 4];
    px(ctx, '#e8ddd0', mx - 1 + x, y + base - 4, 2, 4);
    px(ctx, '#bfb0a0', mx + x, y + base - 4, 1, 4);
    oval(ctx, c[0], x + mx, y + base - 5 - r + 1, r + 1, r);
    oval(ctx, c[2], x + mx, y + base - 5 - r + 1, r, r - 1);
    px(ctx, c[3], x + mx - 1, y + base - 5 - r, 2, 1);
    px(ctx, c[4], x + mx + 1, y + base - 4 - r, 1, 1);
    px(ctx, c[1], x + mx - r + 1, y + base - 5, r * 2 - 1, 1);
  }
}
function mossMound(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  ctx.fillStyle = 'rgba(10, 4, 30, 0.3)';
  ctx.fillRect(x + 1, y + 13, 14, 3);
  oval(ctx, '#1f6e66', x + 8, y + 10, 7, 5);
  oval(ctx, '#2f9e8a', x + 8, y + 9, 6, 4);
  oval(ctx, '#58e0b8', x + 7, y + 8, 3, 2);
  for (let i = 0; i < 5; i++) px(ctx, '#e8fff4', x + 3 + rnd(tx, ty, 440 + i, 10), y + 5 + rnd(tx, ty, 450 + i, 7), 1, 1);
  const hue = hueOf(tx, ty, 0);
  shard(ctx, x + 6, y + 9, 3, 6, hue, -1);
  shard(ctx, x + 10, y + 9, 3, 4, (hue + 1) % 4, 1);
}
function shardRubble(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  ctx.fillStyle = 'rgba(10, 4, 30, 0.3)';
  ctx.fillRect(x + 1, y + 13, 14, 3);
  px(ctx, '#2c2058', x + 2, y + 11, 12, 3);
  px(ctx, '#4a3c84', x + 3, y + 10, 4, 2);
  px(ctx, '#4a3c84', x + 9, y + 11, 4, 2);
  shard(ctx, x + 4, y + 14, 3, 5 + rnd(tx, ty, 460, 3), hueOf(tx, ty, 1), -1);
  shard(ctx, x + 8, y + 13, 3, 7 + rnd(tx, ty, 461, 3), hueOf(tx, ty, 2), 0);
  shard(ctx, x + 12, y + 14, 3, 4 + rnd(tx, ty, 462, 3), hueOf(tx, ty, 3), 1);
}
function crystalThicket(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  ctx.fillStyle = 'rgba(10, 4, 30, 0.3)';
  ctx.fillRect(x + 1, y + 13, 14, 3);
  const order = [[3, 7], [13, 8], [8, 6], [5, 9], [11, 10], [8, 11]];
  order.forEach(([bx, h], i) => {
    const hue = i % 2 ? 1 : 2;
    shard(ctx, x + bx, y + 14 + (i % 2), 3, h + 4 + rnd(tx, ty, 470 + i, 3), hue, (i % 3) - 1);
  });
}
function glowFerns(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  for (let i = 0; i < 5; i++) {
    const bx = x + 2 + rnd(tx, ty, 480 + i, 12);
    const h = 4 + rnd(tx, ty, 490 + i, 5);
    const lean = i % 2 ? 1 : -1;
    for (let k = 0; k < h; k++) {
      px(ctx, k > h - 3 ? '#9affe0' : '#2fb894', bx + Math.round(lean * k * 0.4), y + 14 - k, 1, 1);
      if (k > 1 && k % 2) {
        px(ctx, '#58e0b8', bx + Math.round(lean * k * 0.4) - 1, y + 14 - k, 1, 1);
        px(ctx, '#58e0b8', bx + Math.round(lean * k * 0.4) + 1, y + 14 - k, 1, 1);
      }
    }
  }
}

// =====================================================================
// BELOWTOWN
// =====================================================================
const BT_STONE = ['#8a7b72', '#827369', '#92837a', '#7a6c64'];
const BT_SLAB = ['#8c7c6c', '#84746a', '#907f6e', '#7c6e62'];
function townFloor(ctx, x, y, tx, ty, room) {
  const layout = hash(tx, ty, 1);
  const slabs = layout < 0.4 ? [[0, 0, 16, 16]]
    : layout < 0.8 ? (hash(tx, ty, 2) < 0.5 ? [[0, 0, 16, 8], [0, 8, 16, 8]] : [[0, 0, 8, 16], [8, 0, 8, 16]])
      : [[0, 0, 8, 8], [8, 0, 8, 8], [0, 8, 8, 8], [8, 8, 8, 8]];
  slabs.forEach(([sx, sy, w, h], i) => {
    px(ctx, pick(BT_SLAB, hash(tx, ty, 10 + i)), x + sx, y + sy, w, h);
    px(ctx, '#a89880', x + sx + 1, y + sy, w - 2, 1);
    px(ctx, '#5a4c42', x + sx, y + sy + h - 1, w, 1);
    px(ctx, '#5a4c42', x + sx + w - 1, y + sy, 1, h);
    if (hash(tx, ty, 20 + i) < 0.12) px(ctx, '#6a5a50', x + sx + w - 4, y + sy + h - 4, 2, 2);
  });
  if (hash(tx, ty, 30) < 0.14) {
    mottle(ctx, '#5f7a4a', x, y, tx, ty, 31, 4);
    px(ctx, '#86a864', x + rnd(tx, ty, 34, 12), y + rnd(tx, ty, 35, 12), 2, 1);
  }
  // Now and then, a paw or a claw has been this way.
  if (hash(tx, ty, 36) < 0.04) {
    const pxx = x + 4 + rnd(tx, ty, 37, 7);
    const pyy = y + 4 + rnd(tx, ty, 38, 7);
    px(ctx, '#6a5a50', pxx, pyy + 1, 3, 2);
    px(ctx, '#6a5a50', pxx, pyy, 1, 1);
    px(ctx, '#6a5a50', pxx + 2, pyy, 1, 1);
  }
  wallShadow(ctx, x, y, tx, ty, room, '24, 12, 8', 0.5, 0.22);
}
function townCobbles(ctx, x, y, tx, ty, room) {
  px(ctx, '#5a4c42', x, y, T, T);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const sx = x + c * 4 - (r % 2 ? 2 : 0);
      const roll = hash(tx * 4 + c, ty * 4 + r, 60);
      const w = 4;
      if (sx < x - 1) continue;
      px(ctx, pick(BT_SLAB, roll), Math.max(x, sx), y + r * 4, Math.min(w, x + T - Math.max(x, sx)), 3);
      px(ctx, '#a89880', Math.max(x, sx), y + r * 4, Math.min(w - 1, x + T - Math.max(x, sx)), 1);
    }
    if (r % 2) px(ctx, pick(BT_SLAB, hash(tx, ty * 4 + r, 61)), x + T - 2, y + r * 4, 2, 3);
  }
  if (hash(tx, ty, 62) < 0.1) px(ctx, '#5f7a4a', x + rnd(tx, ty, 63, 12), y + rnd(tx, ty, 64, 12), 3, 1);
  wallShadow(ctx, x, y, tx, ty, room, '24, 12, 8', 0.45, 0.2);
}
function townTurf(ctx, x, y, tx, ty, room) {
  const clipped = raggedPatch(ctx, x, y, tx, ty, room, '.X', townFloor);
  px(ctx, hash(tx, ty, 1) < 0.5 ? '#4a7a40' : '#4f8044', x, y, T, T);
  mottle(ctx, '#5f9650', x, y, tx, ty, 2, 8);
  if (hash(tx, ty, 4) < 0.5) mottle(ctx, '#3c6634', x, y, tx, ty, 5, 5);
  for (let i = 0; i < 6; i++) px(ctx, i % 2 ? '#3c6634' : '#7ab868', x + rnd(tx, ty, 10 + i, 15), y + rnd(tx, ty, 20 + i, 13), 1, 2);
  if (hash(tx, ty, 30) < 0.12) {
    const mx = x + 3 + rnd(tx, ty, 31, 10);
    const my = y + 4 + rnd(tx, ty, 32, 8);
    px(ctx, '#f2e8d0', mx, my + 1, 1, 2);
    px(ctx, '#e8d8b8', mx - 1, my, 3, 1);
    px(ctx, '#fff8e8', mx, my, 1, 1);
  }
  if (hash(tx, ty, 40) < 0.05) px(ctx, '#a8f0c8', x + 2 + rnd(tx, ty, 41, 12), y + 2 + rnd(tx, ty, 42, 12), 1, 1);
  wallShadow(ctx, x, y, tx, ty, room, '14, 20, 10', 0.4, 0.2);
  if (clipped) ctx.restore();
}
function townEarth(ctx, x, y, tx, ty, room) {
  px(ctx, '#7a5c42', x, y, T, T);
  mottle(ctx, hash(tx, ty, 2) < 0.5 ? '#6c503a' : '#8a6a4c', x, y, tx, ty, 3, 7);
  for (let i = 0; i < 6; i++) px(ctx, i % 3 ? '#9a7a58' : '#5a4230', x + rnd(tx, ty, 10 + i, 15), y + rnd(tx, ty, 20 + i, 15), i % 3 ? 1 : 2, 1);
  if (hash(tx, ty, 30) < 0.25) {
    const sx = x + 2 + rnd(tx, ty, 31, 11);
    const sy = y + 2 + rnd(tx, ty, 32, 11);
    px(ctx, '#4a3a30', sx, sy + 1, 3, 1);
    px(ctx, '#b0a090', sx, sy, 2, 1);
  }
  const turf = (dx, dy) => at(room, tx, ty, dx, dy) === ',' && !caveSoftEdge(room, tx, ty, dx, dy);
  for (let i = 0; i < T; i += 2) {
    const tuft = hash(tx * 3 + i, ty, 99) < 0.6 ? 1 : 2;
    if (turf(0, -1)) px(ctx, '#4f8044', x + i, y, 2, tuft);
    if (turf(0, 1)) px(ctx, '#4f8044', x + i, y + T - tuft, 2, tuft);
    if (turf(-1, 0)) px(ctx, '#4f8044', x, y + i, tuft, 2);
    if (turf(1, 0)) px(ctx, '#4f8044', x + T - tuft, y + i, tuft, 2);
  }
  wallShadow(ctx, x, y, tx, ty, room, '24, 12, 8', 0.4, 0.18);
}
function townWallTop(ctx, x, y, tx, ty, room) {
  px(ctx, '#241c2a', x, y, T, T);
  leafClumps(ctx, x, y, tx, ty, 100, ['#2e2434', '#2a2030', '#322838'], 5, 3);
  if (!room) return;
  const below = at(room, tx, ty + 1);
  if (below !== null && below !== '#') {
    px(ctx, '#4a3a50', x, y + T - 3, T, 2);
    px(ctx, '#6a5670', x, y + T - 3, T, 1);
    px(ctx, '#120c14', x, y + T - 1, T, 1);
  }
  const left = at(room, tx, ty, -1, 0);
  const right = at(room, tx, ty, 1, 0);
  if (left !== null && !WALLISH.includes(left)) px(ctx, '#3c2e44', x, y, 1, T);
  if (right !== null && !WALLISH.includes(right)) px(ctx, '#3c2e44', x + T - 1, y, 1, T);
}
// Old carved stone from the buried city, here and there mended by the folk
// with whatever timber came to paw: patches of planks, lashed and nailed.
function townWallFace(ctx, x, y, tx, ty, room, extras = true) {
  px(ctx, '#4e4038', x, y, T, T);
  for (let row = 0; row < 3; row++) {
    const rowY = y + row * 5 + (row === 0 ? 0 : 1);
    const offset = (row + tx) % 2 ? 5 : 0;
    for (let bx = -offset; bx < T; bx += 10) {
      const left = Math.max(0, bx);
      const width = Math.min(bx + 9, T) - left;
      if (width <= 0) continue;
      const roll = hash(tx * 3 + Math.floor((bx + offset) / 10), ty * 3 + row, 1);
      px(ctx, pick(BT_STONE, roll), x + left, rowY, width, 4);
      px(ctx, '#a89888', x + left, rowY, width, 1);
      px(ctx, '#6a5c54', x + left, rowY + 3, width, 1);
      if (roll < 0.12) px(ctx, '#4e4038', x + left + 2, rowY + 1, 2, 2);
    }
  }
  if (hash(tx, ty, 7) < 0.3) {
    const mx = x + rnd(tx, ty, 8, 12);
    px(ctx, '#5f7a4a', mx, y, 3, 2 + rnd(tx, ty, 9, 3));
    px(ctx, '#86a864', mx, y, 1, 1);
  }
  if (extras && hash(tx, ty, 12) < 0.18) {
    // A wooden patch.
    const wx = x + 2 + rnd(tx, ty, 13, 6);
    px(ctx, '#2e1c10', wx - 1, y + 2, 9, 11);
    for (let i = 0; i < 3; i++) {
      px(ctx, pick(['#a8764a', '#9a6a40', '#b8845a'], hash(tx, ty, 14 + i)), wx + i * 3, y + 3, 2, 9);
      px(ctx, '#c89a64', wx + i * 3, y + 3, 1, 9);
    }
    px(ctx, '#d8c090', wx, y + 5, 8, 1);
    px(ctx, '#d8c090', wx, y + 10, 8, 1);
    px(ctx, '#e0d0b0', wx + 1, y + 4, 1, 1);
  }
  if (!room) return;
  if (at(room, tx, ty - 1) === '#') {
    px(ctx, '#3c2e44', x, y, T, 2);
    px(ctx, '#a89888', x, y + 2, T, 1);
  }
  const below = at(room, tx, ty + 1);
  if (below !== null && !WALLISH.includes(below)) {
    px(ctx, '#3a2c28', x, y + T - 2, T, 2);
    for (let i = 0; i < 4; i++) if (hash(tx, ty, 70 + i) < 0.3) px(ctx, '#5f7a4a', x + i * 4 + rnd(tx, ty, 80 + i, 3), y + T - 3, 2, 2);
  }
}
// A string of glow-worm lamps along the stone.
function townLampsWall(ctx, x, y, tx, ty, room) {
  townWallFace(ctx, x, y, tx, ty, room, false);
  px(ctx, '#2e1c10', x, y + 2, T, 1);
  for (let i = 0; i < 4; i++) {
    const lx = x + 1 + i * 4;
    const ly = y + 3 + (i % 2 ? 1 : 0) + (i === 1 || i === 2 ? 1 : 0);
    px(ctx, '#2e1c10', lx + 1, y + 2, 1, ly - y - 2);
    px(ctx, '#2e1c10', lx, ly - 1, 3, 1);
    px(ctx, '#ffc866', lx, ly, 3, 3);
    px(ctx, '#ffe9a8', lx + 1, ly, 1, 2);
    px(ctx, '#fff6d0', lx + 1, ly, 1, 1);
    px(ctx, '#8a5a24', lx, ly + 3, 3, 1);
  }
  // Where the rail stops it's pegged into the stone, so it never hangs from nothing.
  for (const side of [-1, 1]) {
    if (at(room, tx + side, ty) === 'V') continue;
    const bx = side < 0 ? x : x + T - 2;
    px(ctx, '#5a3e28', bx, y + 1, 2, 4);
    px(ctx, '#8a6a42', bx, y + 1, 1, 4);
    px(ctx, '#c8b890', bx + (side < 0 ? 0 : 1), y + 2, 1, 1);
  }
}
function townBannerWall(ctx, x, y, tx, ty, room) {
  townWallFace(ctx, x, y, tx, ty, room, false);
  px(ctx, '#2e1c10', x + 2, y, 12, 2);
  px(ctx, '#c8503a', x + 3, y + 2, 10, 12);
  px(ctx, '#e0705a', x + 3, y + 2, 2, 12);
  px(ctx, '#f0c050', x + 3, y + 2, 10, 1);
  px(ctx, '#f0c050', x + 3, y + 13, 10, 1);
  disc(ctx, '#f0c050', x + 8, y + 7, 3);
  disc(ctx, '#ffe9a8', x + 8, y + 7, 2);
  px(ctx, '#c8503a', x + 3, y + 14, 2, 1);
  px(ctx, '#c8503a', x + 7, y + 14, 2, 1);
  px(ctx, '#c8503a', x + 11, y + 14, 2, 1);
}
const BT_BUILD = '5678';
const isBuild = (c) => c !== null && c !== undefined && (BT_BUILD.includes(c) || c === 'a' || c === 'w');
function townHouseWall(ctx, x, y, tx, ty, room) {
  px(ctx, '#e0d0ae', x, y, T, 8);
  px(ctx, '#cdbb96', x, y + 5, T, 3);
  px(ctx, '#5a3e28', x, y, T, 1);
  px(ctx, '#5a3e28', x, y + 7, T, 1);
  if (tx % 3 === 0) px(ctx, '#5a3e28', x + 7, y, 2, 8);
  if (hash(tx, ty, 90) < 0.3) px(ctx, '#bfae88', x + 2 + rnd(tx, ty, 91, 10), y + 2, 3, 2);
  for (let i = 0; i < 3; i++) {
    px(ctx, i % 2 ? '#8a7b72' : '#7a6c64', x + i * 6 - (ty % 2 ? 2 : 0), y + 8, 6, 4);
    px(ctx, i % 2 ? '#7a6c64' : '#8a7b72', x + i * 6 - (ty % 2 ? 0 : 3), y + 12, 6, 4);
  }
  px(ctx, '#4e4038', x, y + 11, T, 1);
  px(ctx, '#3a2c28', x, y + T - 2, T, 2);
  for (let i = 0; i < 4; i++) if (hash(tx, ty, 95 + i) < 0.3) px(ctx, '#5f7a4a', x + i * 4 + rnd(tx, ty, 100 + i, 3), y + T - 3, 2, 2);
  if (!room) return;
  if (!isBuild(at(room, tx, ty, -1, 0))) px(ctx, '#3a2418', x, y, 2, T);
  if (!isBuild(at(room, tx, ty, 1, 0))) px(ctx, '#3a2418', x + T - 2, y, 2, T);
}
function townRoundWindow(ctx, x, y, tx, ty, room) {
  townHouseWall(ctx, x, y, tx, ty, room);
  disc(ctx, '#3a2418', x + 8, y + 7, 6);
  disc(ctx, '#ffc65c', x + 8, y + 7, 5);
  disc(ctx, '#ffdb8a', x + 8, y + 6, 3);
  px(ctx, '#5a3a1e', x + 8, y + 2, 1, 11);
  px(ctx, '#5a3a1e', x + 3, y + 7, 11, 1);
  px(ctx, '#fff4cc', x + 5, y + 4, 2, 1);
  px(ctx, '#c8503a', x + 3, y + 3, 2, 8);
  px(ctx, '#c8503a', x + 11, y + 3, 2, 8);
  px(ctx, '#8a5a32', x + 3, y + 13, 10, 2);
}
function townRoundDoor(ctx, x, y, tx, ty, room) {
  townHouseWall(ctx, x, y, tx, ty, room);
  disc(ctx, '#3a2c28', x + 8, y + 8, 7);
  px(ctx, '#3a2c28', x + 1, y + 8, 14, 8);
  disc(ctx, '#8a5a32', x + 8, y + 8, 6);
  px(ctx, '#8a5a32', x + 2, y + 8, 12, 7);
  for (const dx of [5, 8, 11]) px(ctx, '#6a4424', x + dx, y + 3, 1, 12);
  px(ctx, '#b8845a', x + 4, y + 4, 1, 10);
  px(ctx, '#4a4a52', x + 2, y + 6, 12, 1);
  px(ctx, '#4a4a52', x + 2, y + 11, 12, 1);
  disc(ctx, '#e0b050', x + 11, y + 9, 1);
  px(ctx, '#8a7b72', x, y + T - 2, T, 2);
}
function townRoofMoss(ctx, x, y, tx, ty, room) {
  px(ctx, '#3a5e34', x, y, T, T);
  for (let row = 0; row < 4; row++) {
    const offset = (row + tx) % 2 ? 3 : 0;
    for (let bx = -offset; bx < T; bx += 6) {
      const left = Math.max(0, bx);
      const width = Math.min(bx + 5, T) - left;
      if (width <= 0) continue;
      const roll = hash(tx * 3 + Math.floor((bx + offset) / 6), ty * 4 + row, 120);
      px(ctx, roll < 0.5 ? '#4f8046' : '#467a40', x + left, y + row * 4, width, 3);
      px(ctx, '#6aa058', x + left, y + row * 4, width, 1);
      px(ctx, '#2f4a2a', x + left, y + row * 4 + 3, width, 1);
    }
  }
  for (let i = 0; i < 3; i++) if (hash(tx, ty, 130 + i) < 0.5) px(ctx, '#86c070', x + rnd(tx, ty, 134 + i, 12), y + rnd(tx, ty, 138 + i, 12), 3, 2);
  if (hash(tx, ty, 141) < 0.12) {
    const mx = x + 3 + rnd(tx, ty, 142, 9);
    const my = y + 4 + rnd(tx, ty, 143, 7);
    px(ctx, '#f2e8d0', mx, my + 1, 1, 2);
    px(ctx, '#d8503a', mx - 1, my, 3, 1);
    px(ctx, '#f8ecd0', mx, my, 1, 1);
  }
  if (!room) return;
  if (at(room, tx, ty - 1) !== '7') { px(ctx, '#2f4a2a', x, y, T, 2); px(ctx, '#86c070', x, y + 2, T, 1); }
  if (at(room, tx, ty + 1) !== '7') {
    px(ctx, '#2f4a2a', x, y + T - 3, T, 3);
    px(ctx, '#6aa058', x, y + T - 4, T, 1);
    for (let i = 0; i < T; i += 3) if (hash(tx * 3 + i, ty, 144) < 0.5) px(ctx, '#86c070', x + i, y + T - 1, 1, 1);
  }
  if (at(room, tx, ty, -1, 0) !== '7') px(ctx, '#2f4a2a', x, y, 1, T);
  if (at(room, tx, ty, 1, 0) !== '7') px(ctx, '#2f4a2a', x + T - 1, y, 1, T);
}
// The creature folk's own building: mismatched planks lashed together.
function townPlankWall(ctx, x, y, tx, ty, room) {
  for (let c = 0; c < 4; c++) {
    px(ctx, pick(['#a8764a', '#9a6a40', '#b8845a', '#8a5e38'], hash(tx * 4 + c, ty, 150)), x + c * 4, y, 4, T);
    px(ctx, '#c89a64', x + c * 4, y, 1, T);
    px(ctx, '#5a3a22', x + c * 4 + 3, y, 1, T);
    if (hash(tx * 4 + c, ty, 151) < 0.2) px(ctx, '#6a4424', x + c * 4 + 1, y + 3 + rnd(tx * 4 + c, ty, 152, 8), 2, 1);
  }
  for (const ly of [3, 11]) {
    px(ctx, '#d8c090', x, y + ly, T, 1);
    px(ctx, '#8a7448', x, y + ly + 1, T, 1);
  }
  for (const nx of [3, 8, 13]) { px(ctx, '#3a2c20', x + nx, y + 3, 1, 1); px(ctx, '#3a2c20', x + nx, y + 11, 1, 1); }
  px(ctx, '#3a2c28', x, y + T - 2, T, 2);
  if (!room) return;
  if (!isBuild(at(room, tx, ty, -1, 0))) px(ctx, '#3a2418', x, y, 1, T);
  if (!isBuild(at(room, tx, ty, 1, 0))) px(ctx, '#3a2418', x + T - 1, y, 1, T);
}
function townPlankWindow(ctx, x, y, tx, ty, room) {
  townPlankWall(ctx, x, y, tx, ty, room);
  px(ctx, '#3a2418', x + 3, y + 3, 10, 9);
  px(ctx, '#ffc65c', x + 4, y + 4, 8, 7);
  px(ctx, '#ffdb8a', x + 4, y + 4, 8, 3);
  px(ctx, '#5a3a1e', x + 7, y + 4, 2, 7);
  px(ctx, '#5a3a1e', x + 4, y + 7, 8, 1);
  px(ctx, '#fff4cc', x + 4, y + 4, 2, 1);
  px(ctx, '#8a5a32', x + 2, y + 12, 12, 2);
}
// A mushroom-cap roof or awning: big spotted caps side by side.
const CAPS = [['#d8502e', '#f27a4a', '#9a3320'], ['#e0802e', '#f4a45a', '#a85a20'], ['#a8508a', '#c870aa', '#6e2c5a']];
function mushroomCap(ctx, x, y, tx, ty, room) {
  const cap = pick(CAPS, hash(tx >> 1, 0, 160));
  px(ctx, cap[0], x, y, T, T);
  mottle(ctx, cap[1], x, y, tx, ty, 161, 8);
  px(ctx, cap[2], x, y + T - 5, T, 5);
  for (const [sx, sy, r] of [[3, 3, 2], [11, 5, 2], [7, 10, 1], [14, 12, 1], [2, 11, 1]]) {
    if (hash(tx, ty, 162 + sx) < 0.8) { disc(ctx, '#f8ecd0', x + sx, y + sy, r); px(ctx, '#e0d0a8', x + sx, y + sy + r, r + 1, 1); }
  }
  if (!room) return;
  if (at(room, tx, ty + 1) !== 'e') {
    // Scalloped gills under the cap's lip.
    px(ctx, '#f0d8b0', x, y + T - 3, T, 2);
    for (let i = 0; i < T; i += 2) px(ctx, '#c8a878', x + i, y + T - 3, 1, 2);
    for (let i = 0; i < T; i += 4) { px(ctx, cap[2], x + i, y + T - 1, 4, 1); }
    px(ctx, '#3a2418', x, y + T - 1, T, 1);
  }
  if (at(room, tx, ty - 1) !== 'e') px(ctx, cap[1], x, y, T, 1);
}
const townBlock = {
  edge: '#2a1e1a',
  lit: '#c8b8a0',
  face(ctx, x, y, tx, ty, raise) {
    px(ctx, '#4e4038', x, y, T, raise);
    for (let row = 0; row * 4 < raise; row++) {
      const offset = (row + tx) % 2 ? 4 : 0;
      for (let bx = -offset; bx < T; bx += 8) {
        const left = Math.max(0, bx);
        const width = Math.min(bx + 7, T) - left;
        if (width > 0) px(ctx, pick(BT_STONE, hash(tx * 3 + bx, ty * 5 + row, 31)), x + left, y + row * 4 + 1, width, 3);
      }
    }
    if (hash(tx, ty, 32) < 0.4) px(ctx, '#5f7a4a', x + rnd(tx, ty, 33, 12), y, 3 + rnd(tx, ty, 34, 4), 2);
  },
  top(ctx, x, y, tx, ty) {
    px(ctx, pick(['#a89880', '#a09078', '#b0a088', '#9c8c74'], hash(tx, ty, 35)), x, y, T, T);
    if (hash(tx, ty, 36) < 0.5) px(ctx, '#8a7a64', x + 7, y + 1, 1, T - 2);
    if (hash(tx, ty, 37) < 0.4) px(ctx, '#8a7a64', x + 1, y + 9, T - 2, 1);
    if (hash(tx, ty, 38) < 0.3) px(ctx, '#86a864', x + 3 + rnd(tx, ty, 39, 9), y + 3 + rnd(tx, ty, 40, 8), 2, 1);
  },
};
function townCanal(ctx, x, y, tx, ty, room) {
  px(ctx, hash(tx, ty, 170) < 0.5 ? '#1c4a5a' : '#20525e', x, y, T, T);
  mottle(ctx, '#245c6c', x, y, tx, ty, 171, 8);
  const shift = (tx * 7 + ty * 3) % 8;
  px(ctx, '#4a8a9a', x + shift, y + 6, 5, 1);
  px(ctx, '#4a8a9a', x + ((shift + 6) % 12), y + 11, 4, 1);
  // Lamplight on the water: little streaks of gold.
  if (hash(tx, ty, 172) < 0.45) {
    const gx = x + 2 + rnd(tx, ty, 173, 12);
    px(ctx, '#ffd88a', gx, y + 3, 1, 2);
    px(ctx, '#c89a4a', gx, y + 5, 1, 1);
    px(ctx, '#ffd88a', gx + 1, y + 8, 1, 1);
  }
  if (!room) return;
  if (at(room, tx, ty - 1) !== '~') {
    px(ctx, '#8a7b72', x, y, T, 3);
    px(ctx, '#a89888', x, y, T, 1);
    px(ctx, '#120c14', x, y + 3, T, 1);
  }
}
function barrel(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  groundShadow(ctx, x, y, 14);
  oval(ctx, '#2e1c10', x + 8, y + 3, 6, 2);
  px(ctx, '#2e1c10', x + 2, y + 3, 12, 11);
  px(ctx, '#2e1c10', x + 3, y + 14, 10, 1);
  for (let c = 0; c < 6; c++) {
    px(ctx, c % 2 ? '#8a5a38' : '#a8764a', x + 3 + c * 2, y + 3, 2, 11);
  }
  px(ctx, '#c89a64', x + 3, y + 3, 1, 11);
  oval(ctx, '#c89a64', x + 8, y + 3, 5, 2);
  oval(ctx, '#e0b884', x + 8, y + 3, 3, 1);
  for (const hy of [6, 11]) {
    px(ctx, '#4a4a52', x + 2, y + hy, 12, 1);
    px(ctx, '#8a8a96', x + 3, y + hy, 4, 1);
  }
}
function townPillar(ctx, x, y, tx, ty) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(x + 1, y + 13, 14, 3);
  px(ctx, '#2e2420', x + 2, y + 10, 12, 5);
  px(ctx, '#2e2420', x + 3, y - 30, 10, 42);
  px(ctx, '#2e2420', x + 1, y - 35, 14, 6);
  px(ctx, '#8a7b72', x + 3, y + 11, 10, 3);
  px(ctx, '#8a7b72', x + 4, y - 29, 8, 40);
  px(ctx, '#a89888', x + 4, y - 29, 2, 40);
  px(ctx, '#6a5c54', x + 10, y - 29, 2, 40);
  px(ctx, '#a89888', x + 2, y - 34, 12, 4);
  px(ctx, '#6a5c54', x + 2, y - 31, 12, 1);
  for (let band = y - 22; band < y + 8; band += 9) px(ctx, '#6a5c54', x + 4, band, 8, 1);
  // Moss on one side, and a glow-worm lantern hung from a ring.
  px(ctx, '#5f7a4a', x + 4, y + 4, 3, 6);
  px(ctx, '#86a864', x + 4, y + 4, 1, 3);
  px(ctx, '#3a2c20', x + 8, y - 20, 1, 4);
  px(ctx, '#3a2c20', x + 6, y - 16, 5, 1);
  px(ctx, '#ffc866', x + 6, y - 15, 5, 5);
  px(ctx, '#ffe9a8', x + 7, y - 15, 3, 3);
  px(ctx, '#fff6d0', x + 8, y - 14, 1, 1);
  px(ctx, '#3a2c20', x + 6, y - 10, 5, 1);
}
function townBrokenPillar(ctx, x, y, tx, ty) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(x + 1, y + 13, 14, 3);
  px(ctx, '#2e2420', x + 2, y + 10, 12, 5);
  px(ctx, '#2e2420', x + 3, y - 10, 10, 22);
  px(ctx, '#8a7b72', x + 3, y + 11, 10, 3);
  px(ctx, '#8a7b72', x + 4, y - 9, 8, 20);
  px(ctx, '#a89888', x + 4, y - 9, 2, 20);
  px(ctx, '#6a5c54', x + 10, y - 9, 2, 20);
  px(ctx, '#6a5c54', x + 4, y - 1, 8, 1);
  // Mushrooms have taken the broken top.
  px(ctx, '#f2e8d0', x + 5, y - 13, 2, 4);
  oval(ctx, '#d8503a', x + 6, y - 14, 3, 2);
  px(ctx, '#f8ecd0', x + 5, y - 15, 1, 1);
  px(ctx, '#f2e8d0', x + 10, y - 12, 2, 3);
  oval(ctx, '#e0802e', x + 11, y - 13, 2, 2);
  px(ctx, '#5f7a4a', x + 4, y - 10, 8, 2);
}
function mushroomBed(ctx, x, y, tx, ty, room, floor) {
  floor(ctx, x, y, tx, ty, room);
  px(ctx, '#2e1c10', x + 1, y + 7, 14, 8);
  px(ctx, '#8a7b72', x + 1, y + 7, 14, 2);
  px(ctx, '#a89888', x + 1, y + 7, 14, 1);
  px(ctx, '#4a3224', x + 2, y + 9, 12, 5);
  px(ctx, '#5a4030', x + 4, y + 10, 4, 1);
  for (const [mx, mh, ci] of [[4, 4, 0], [8, 6, 1], [12, 3, 2]]) {
    const cap = CAPS[ci];
    px(ctx, '#f2e8d0', x + mx, y + 12 - mh, 2, mh);
    oval(ctx, cap[0], x + mx + 1, y + 11 - mh, 3, 2);
    px(ctx, cap[1], x + mx, y + 10 - mh, 2, 1);
    px(ctx, '#f8ecd0', x + mx + 1, y + 10 - mh, 1, 1);
  }
}
// A round open door in a house front, with firelight inside.
function townDoorOpen(ctx, x, y, tx, ty, room) {
  townHouseWall(ctx, x, y, tx, ty, room);
  disc(ctx, '#3a2c28', x + 8, y + 8, 7);
  px(ctx, '#3a2c28', x + 1, y + 8, 14, 8);
  disc(ctx, '#2a1810', x + 8, y + 8, 6);
  px(ctx, '#2a1810', x + 2, y + 8, 12, 7);
  px(ctx, '#7a4520', x + 3, y + 10, 10, 2);
  px(ctx, '#c8742c', x + 4, y + 12, 8, 2);
  px(ctx, '#ffc65c', x + 6, y + 13, 4, 1);
  px(ctx, '#8a7b72', x + 1, y + T - 2, 14, 2);
  px(ctx, '#a89888', x + 1, y + T - 2, 14, 1);
}

// A burrow under the fields (Sunnyside's k, K and q, only in secret_sunny_burrow):
// k is the earth overhead (roots threading through dark soil, the odd stone),
// K the packed-earth wall, smooth as a plate, with roots coming through its top
// and, here and there, a tiny framed picture of a vegetable; q the swept earth
// floor.
function burrowTop(ctx, x, y, tx, ty, room) {
  px(ctx, '#3a2616', x, y, T, T);
  for (let i = 0; i < 5; i++) px(ctx, i % 2 ? '#4a321e' : '#2e1e10', x + rnd(tx, ty, 700 + i, 12), y + rnd(tx, ty, 710 + i, 13), 4, 3);
  // Roots wandering through.
  const ry = y + 3 + rnd(tx, ty, 720, 9);
  for (let i = 0; i < T; i++) px(ctx, '#6a4a2a', x + i, ry + Math.round(Math.sin((tx * T + i) / 3) * 1.5), 1, 1);
  if (hash(tx, ty, 721) < 0.5) for (let i = 0; i < 8; i++) px(ctx, '#5a3e22', x + 4 + Math.round(i / 2), y + 2 + i, 1, 1);
  if (hash(tx, ty, 722) < 0.35) { px(ctx, '#8a8070', x + 3 + rnd(tx, ty, 723, 9), y + 9, 3, 2); }
  if (!room) return;
  // A lip where the earth meets the room below it.
  const below = at(room, tx, ty + 1);
  if (below !== null && below !== 'k' && below !== 'K') { px(ctx, '#1e1208', x, y + T - 2, T, 2); px(ctx, '#5a3e22', x, y + T - 3, T, 1); }
  // Where it meets the floor beside it, a soft rounded shoulder.
  for (const [dx, sx] of [[-1, 0], [1, T - 2]]) {
    const side = at(room, tx + dx, ty);
    if (side !== null && side !== 'k' && side !== 'K') px(ctx, '#523822', x + sx, y, 2, T);
  }
}
function burrowWall(ctx, x, y, tx, ty, room) {
  const up = room ? at(room, tx, ty - 1) : 'k';
  const down = room ? at(room, tx, ty + 1) : null;
  const top = up === 'k' || up === '#';
  // Packed earth, darker up under the roof, smoothed and a shade lighter lower down.
  px(ctx, '#8a6240', x, y, T, T);
  px(ctx, '#7a5434', x, y, T, top ? 6 : 2);
  for (let i = 0; i < 4; i++) px(ctx, '#9a7048', x + rnd(tx, ty, 730 + i, 13), y + 6 + rnd(tx, ty, 735 + i, 8), 3, 1);
  for (let i = 0; i < 3; i++) px(ctx, '#6e4a2e', x + rnd(tx, ty, 740 + i, 14), y + 4 + rnd(tx, ty, 745 + i, 10), 2, 1);
  if (hash(tx, ty, 750) < 0.25) { px(ctx, '#b8a890', x + 2 + rnd(tx, ty, 751, 11), y + 10, 2, 2); px(ctx, '#8a8070', x + 3 + rnd(tx, ty, 751, 11), y + 11, 1, 1); }
  if (top) {
    // Roots coming through under the ceiling, a few hanging down.
    px(ctx, '#3a2616', x, y, T, 2);
    for (let i = 0; i < T; i++) if (hash(tx * T + i, ty, 752) < 0.4) px(ctx, '#5a3e22', x + i, y + 2, 1, 1);
    const hangs = 1 + rnd(tx, ty, 753, 2);
    for (let h = 0; h < hangs; h++) {
      const hx = x + 2 + rnd(tx, ty, 754 + h, 12);
      const len = 3 + rnd(tx, ty, 756 + h, 6);
      for (let j = 0; j < len; j++) px(ctx, j < len - 1 ? '#6a4a2a' : '#8a6a42', hx + (j > 3 ? 1 : 0), y + 2 + j, 1, 1);
    }
  }
  // Now and then a tiny picture in a frame, hung on a peg: a carrot, a turnip, a pea pod.
  if (!top && (tx * 5 + ty * 3) % 4 === 1) {
    const fx = x + 4;
    const fy = y + 2;
    px(ctx, '#3a2414', fx + 3, fy - 1, 2, 1);
    px(ctx, '#c49a50', fx, fy, 8, 8);
    px(ctx, '#f4ecd2', fx + 1, fy + 1, 6, 6);
    const kind = (tx + ty) % 3;
    if (kind === 0) { px(ctx, '#e87a2c', fx + 3, fy + 3, 2, 3); px(ctx, '#e87a2c', fx + 3, fy + 6, 1, 1); px(ctx, '#4a9a3a', fx + 3, fy + 1, 2, 2); }
    else if (kind === 1) { px(ctx, '#e8e0f0', fx + 2, fy + 3, 4, 3); px(ctx, '#a8508a', fx + 2, fy + 3, 4, 1); px(ctx, '#4a9a3a', fx + 3, fy + 1, 2, 2); }
    else { px(ctx, '#5aa83a', fx + 2, fy + 3, 4, 2); px(ctx, '#9ad868', fx + 2, fy + 3, 1, 1); px(ctx, '#9ad868', fx + 4, fy + 3, 1, 1); }
    px(ctx, '#3a2414', fx, fy + 8, 8, 1);
  }
  // The foot of the wall meets the floor: a dark seam and a little skirting of loose earth.
  if (down !== null && down !== 'K' && down !== 'k') {
    px(ctx, '#5a3e22', x, y + T - 3, T, 1);
    px(ctx, '#3a2616', x, y + T - 2, T, 2);
  }
}
function burrowFloor(ctx, x, y, tx, ty) {
  px(ctx, '#a07a50', x, y, T, T);
  mottle(ctx, '#ab855a', x, y, tx, ty, 760, 7);
  mottle(ctx, '#94704a', x, y, tx, ty, 763, 5);
  for (let i = 0; i < 3; i++) px(ctx, '#8a6640', x + rnd(tx, ty, 770 + i, 14), y + rnd(tx, ty, 775 + i, 15), 2, 1);
  // Swept in arcs, with the odd pebble.
  if (hash(tx, ty, 780) < 0.5) for (let i = 0; i < 6; i++) px(ctx, '#b48e62', x + 3 + i, y + 6 + Math.round(Math.abs(i - 2.5) * 0.6), 1, 1);
  if (hash(tx, ty, 781) < 0.2) { px(ctx, '#c8bca0', x + rnd(tx, ty, 782, 13), y + rnd(tx, ty, 783, 13), 2, 2); }
}

// =====================================================================
// Hooking in
// =====================================================================
export const BRIGHT_AREAS = new Set(['sunnyside', 'glimmer', 'belowtown']);

// Each region's draw functions by letter. A function gets (ctx, x, y, tx, ty,
// room, floor), where `floor` draws the ground such a tile stands on.
const LOOKS = {
  sunnyside: {
    '.': sunFlags, ',': sunGrass, ':': sunLane,
    '#': hedgeTop, W: hedgeFace,
    V: (ctx, x, y, tx, ty, room) => hedgeFace(ctx, x, y, tx, ty, room, 0.22),
    H: (ctx, x, y, tx, ty, room) => {
      hedgeFace(ctx, x, y, tx, ty, room);
      for (const [bx, c] of [[3, '#ffd62e'], [9, '#f08ab8']]) {
        px(ctx, '#6a4524', x + bx, y + 3, 1, 3);
        px(ctx, c, x + bx + 1, y + 3, 4, 3);
        px(ctx, c, x + bx + 1, y + 6, 2, 1);
      }
    },
    b: blockOf(12, sunBank), B: blockOf(24, sunBank),
    '~': brook, j: brookStones, g: plankBridge,
    O: hayBale, F: flowerBed, N: meadowFlowers, Z: blossomBush, f: whiteFence,
    I: (ctx, x, y) => leafyTree(ctx, x, y),
    T: (ctx, x, y) => leafyTree(ctx, x, y, { fruit: '#e03a3a', crown: 12, lift: 22 }),
    J: (ctx, x, y) => leafyTree(ctx, x, y, { crown: 9, lift: 12, hues: { out: '#a8486e', dark: '#d878a4', mid: '#f4a8c8', light: '#ffd0e4', hi: '#ffffff' } }),
    5: sunCottageWall, 6: sunCottageWindow, 7: sunThatch, 8: sunCottageDoor,
    k: burrowTop, K: burrowWall, q: burrowFloor,
    D: (ctx, x, y, tx, ty, room, floor, old) => {
      if (['5', '6', '8'].includes(at(room, tx, ty, -1, 0)) || ['5', '6', '8'].includes(at(room, tx, ty, 1, 0))) sunCottageDoorOpen(ctx, x, y, tx, ty, room);
      else old();
    },
  },
  glimmer: {
    '.': glimFloor, q: glimFloor, ',': glimMoss,
    '#': glimWallTop, k: glimWallTop,
    W: glimWallFace, K: glimWallFace, G: glimWallFace, V: glimVeinWall, H: glimMossWall,
    b: blockOf(12, glimBlock), B: blockOf(24, glimBlock),
    '~': glimWater, j: glimShallows,
    O: crystalBlocker, x: crystalWall, R: shardRubble, Z: crystalThicket, p: glowMushrooms, F: mossMound, N: glowFerns,
    I: crystalColumn, J: crystalSpires, '^': crystalSpike, v: crystalHang,
  },
  belowtown: {
    '.': townFloor, X: townCobbles, ',': townTurf, ':': townEarth,
    '#': townWallTop, W: townWallFace, V: townLampsWall, H: townBannerWall,
    b: blockOf(12, townBlock), B: blockOf(24, townBlock),
    '~': townCanal, O: barrel, F: mushroomBed,
    I: townPillar, J: townBrokenPillar,
    5: townHouseWall, 6: townRoundWindow, 7: townRoofMoss, 8: townRoundDoor,
    a: townPlankWall, w: townPlankWindow, e: mushroomCap,
    D: (ctx, x, y, tx, ty, room, floor, old) => {
      if (isBuild(at(room, tx, ty, -1, 0)) || isBuild(at(room, tx, ty, 1, 0))) townDoorOpen(ctx, x, y, tx, ty, room);
      else old();
    },
  },
};

// `helpers.drawBaseFloor(ctx, x, y, tx, ty, room)` draws whatever ground a
// tile stands on (tileset.js decides which letter that is).
export function installBrightTiles(TILES, helpers) {
  const letters = new Set(Object.values(LOOKS).flatMap((look) => Object.keys(look)));
  for (const letter of letters) {
    const tile = TILES[letter];
    if (!tile) continue;
    const old = tile.draw;
    tile.draw = (ctx, x, y, tx, ty, room) => {
      const draw = LOOKS[room?.area]?.[letter];
      if (!draw) return old(ctx, x, y, tx, ty, room);
      const floor = (c, fx, fy, ftx, fty, froom) => helpers.drawBaseFloor(c, fx, fy, ftx, fty, froom);
      return draw(ctx, x, y, tx, ty, room, floor, () => old(ctx, x, y, tx, ty, room));
    };
  }
}

// =====================================================================
// What glows in the tiles.
// =====================================================================
const WINDOW_LIGHT = '255, 190, 100';
const LAMP_LIGHT = '255, 200, 110';
const GLOW_TILES = {
  glimmer: {
    O: (tx, ty) => [{ dy: 0, bloom: 14, strength: 0.55, flicker: 0.25, color: GLOW_COLORS[hueOf(tx, ty)] }, { dy: 4, pool: 50, strength: 0.5, flicker: 0.12, color: GLOW_COLORS[hueOf(tx, ty)] }],
    x: (tx, ty) => [{ dy: -2, bloom: 16, strength: 0.6, flicker: 0.25, color: GLOW_COLORS[hueOf(tx, ty)] }, { dy: 2, pool: 56, strength: 0.52, flicker: 0.12, color: GLOW_COLORS[hueOf(tx, ty)] }],
    I: (tx, ty) => [{ dy: -16, bloom: 18, strength: 0.55, flicker: 0.2, color: GLOW_COLORS[hueOf(tx, ty)] }, { dy: 2, pool: 78, strength: 0.6, flicker: 0.1, color: GLOW_COLORS[hueOf(tx, ty)] }],
    J: (tx, ty) => [{ dy: -6, bloom: 14, strength: 0.5, flicker: 0.2, color: GLOW_COLORS[hueOf(tx, ty)] }, { dy: 2, pool: 56, strength: 0.5, flicker: 0.1, color: GLOW_COLORS[hueOf(tx, ty)] }],
    '^': (tx, ty) => [{ dy: -4, bloom: 11, strength: 0.45, flicker: 0.2, color: GLOW_COLORS[hueOf(tx, ty)] }, { dy: 2, pool: 40, strength: 0.4, flicker: 0.1, color: GLOW_COLORS[hueOf(tx, ty)] }],
    Z: (tx, ty) => [{ dy: 4, pool: 34, strength: 0.4, flicker: 0.1, color: GLOW_COLORS[1] }],
    R: (tx, ty) => (hash(tx, ty, 1) < 0.6 ? [{ dy: 4, pool: 30, strength: 0.35, flicker: 0.1, color: GLOW_COLORS[hueOf(tx, ty, 2)] }] : null),
    p: (tx, ty) => [{ dy: 2, bloom: 9, strength: 0.4, flicker: 0.2, color: GLOW_COLORS[hueOf(tx, ty)] }, { dy: 6, pool: 34, strength: 0.38, flicker: 0.1, color: GLOW_COLORS[hueOf(tx, ty)] }],
    F: () => [{ dy: 2, pool: 34, strength: 0.34, flicker: 0.1, color: GLOW_COLORS[0] }],
    V: (tx, ty) => [{ dy: 0, bloom: 14, strength: 0.5, flicker: 0.2, color: GLOW_COLORS[hueOf(tx, ty)] }, { dy: 8, pool: 52, strength: 0.4, flicker: 0.1, color: GLOW_COLORS[hueOf(tx, ty)] }],
    H: (tx, ty) => (hash(tx, ty, 3) < 0.7 ? [{ dy: 6, pool: 40, strength: 0.34, flicker: 0.1, color: GLOW_COLORS[0] }] : null),
    ',': (tx, ty) => (hash(tx, ty, 4) < 0.22 ? [{ dy: 0, pool: 34, strength: 0.28, flicker: 0.08, color: GLOW_COLORS[0] }] : null),
    N: (tx, ty) => (hash(tx, ty, 5) < 0.5 ? [{ dy: 0, pool: 30, strength: 0.3, flicker: 0.08, color: GLOW_COLORS[0] }] : null),
    '~': (tx, ty) => ((tx + ty * 2) % 4 === 0 ? [{ dy: 0, pool: 46, strength: 0.36, flicker: 0.1, color: '110, 220, 255' }] : null),
    j: (tx, ty) => ((tx + ty * 2) % 4 === 0 ? [{ dy: 0, pool: 40, strength: 0.28, flicker: 0.1, color: '110, 220, 255' }] : null),
    v: (tx, ty) => (hash(tx, ty, 6) < 0.5 ? [{ dy: -14, bloom: 9, strength: 0.4, flicker: 0.2, color: GLOW_COLORS[hueOf(tx, ty)] }] : null),
  },
  belowtown: {
    6: () => [{ dy: -1, bloom: 12, strength: 0.6, flicker: 0.15, color: WINDOW_LIGHT }, { dy: 16, pool: 44, strength: 0.5, flicker: 0.12, color: WINDOW_LIGHT }],
    w: () => [{ dy: -1, bloom: 11, strength: 0.58, flicker: 0.15, color: WINDOW_LIGHT }, { dy: 14, pool: 42, strength: 0.5, flicker: 0.12, color: WINDOW_LIGHT }],
    8: () => [{ dy: 2, pool: 30, strength: 0.3, flicker: 0.2, color: LAMP_LIGHT }],
    I: () => [{ dy: -22, bloom: 14, strength: 0.7, flicker: 0.25, color: LAMP_LIGHT }, { dy: 0, pool: 62, strength: 0.58, flicker: 0.15, color: LAMP_LIGHT }],
    J: () => [{ dy: -4, pool: 30, strength: 0.25, flicker: 0.1, color: '255, 160, 110' }],
    V: (tx, ty) => [{ dy: -3, bloom: 10, strength: 0.55, flicker: 0.3, color: LAMP_LIGHT }, ...(tx % 2 === 0 ? [{ dy: 8, pool: 48, strength: 0.42, flicker: 0.2, color: LAMP_LIGHT }] : [])],
    F: () => [{ dy: 4, pool: 28, strength: 0.25, flicker: 0.1, color: '255, 170, 120' }],
    '~': (tx, ty) => ((tx + ty * 3) % 5 === 0 ? [{ dy: 0, pool: 40, strength: 0.25, flicker: 0.15, color: LAMP_LIGHT }] : null),
  },
};
// A door standing open in a house front (Belowtown) spills firelight.
const DOOR_FIRE = [{ dy: 1, bloom: 10, strength: 0.4, flicker: 0.4, color: '255, 128, 48' }, { dy: 14, pool: 34, strength: 0.5, flicker: 0.4, color: '255, 128, 48' }];

// The lights of a room's tiles, in world pixels.
export function brightTileLights(room) {
  const table = GLOW_TILES[room?.area];
  if (!table) return [];
  const lights = [];
  room.tiles.forEach((row, ty) => [...row].forEach((char, tx) => {
    const make = table[char];
    let list = make ? make(tx, ty) : null;
    if (room.area === 'belowtown' && char === 'D' && (isBuild(at(room, tx, ty, -1, 0)) || isBuild(at(room, tx, ty, 1, 0)))) list = DOOR_FIRE;
    if (!list) return;
    const cx = tx * T + T / 2;
    const cy = ty * T + T / 2;
    // `dy` counts from the middle of the tile, up negative. (The Glimmering's
    // crystals and glowing water swell with its song: `sings`.)
    const sings = room.area === 'glimmer';
    for (const l of list) lights.push({ ...l, x: cx + (l.dx ?? 0), y: cy + (l.dy ?? 0), ...(sings ? { sings } : {}) });
  }));
  return lights;
}
