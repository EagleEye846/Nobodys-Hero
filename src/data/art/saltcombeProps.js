// Props for Saltcombe, the stilt town inside the green storm (Chapter 5, "The
// Tide Held"). Drawn like coastProps.js and sunnyAutumn.js: rows of
// characters from the small painter below, 16 pixels to a tile, standing on
// the bottom edge and centred over their footprint. Every id starts `sc_`.
// Ones that move are also animations: put the prop's name in the object's
// `animation` too (and a `speed`, seconds a frame).
//
//   sc_bunk_tally       a child's bunk under the inn's stair, the rail notched
//                       in neat fives (2 wide)
//   sc_ledger_desk      the harbour clerk's sloped desk with the launch-ledger
//                       open on it, an inkpot and a quill (2 wide)
//   sc_coast_map        the big chart of the coast on a board with two legs (2 wide)
//   sc_winters_board    the town hall's board of winters on two posts (2 wide)
//   sc_summer_painting  "Saltcombe in Summer" on an easel: a blue sky, once
//   sc_rope_anchor      an iron ring bolted into a stone, the climbing rope
//                       knotted through it and running away over the edge
//   sc_bramble_swim*    Bramble up to his chin in the lagoon, paddling hard
//   sc_haddock_wade*    Haddock chest-deep in the lagoon (2 wide, like all his looks)
//
// The two in the water are cut from their standing sprites (bramble.js,
// coastFolk.js), so they always match them, with a ring of ripples drawn on.

import { BRAMBLE_PROP_SPRITES, BRAMBLE_PALETTE } from './bramble.js';
import { CF_HADDOCK_SPRITES, CF_PALETTE } from './coastFolk.js';

// --- A tiny painter ---------------------------------------------------
const OUT = '#1a1410';

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xf200 + colors.size);
    colors.set(hex, c);
    palette[c] = hex;
  }
  return colors.get(hex);
}

class Grid {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.cells = Array.from({ length: h }, () => Array(w).fill(null));
  }

  set(x, y, c) {
    x = Math.round(x);
    y = Math.round(y);
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.cells[y][x] = c || null;
  }

  get(x, y) {
    return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.cells[y][x] : null;
  }

  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
  }

  line(x0, y0, x1, y1, c) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) this.set(x0 + ((x1 - x0) * i) / steps, y0 + ((y1 - y0) * i) / steps, c);
  }

  oval(cx, cy, rx, ry, c) {
    for (let dy = -ry; dy <= ry; dy++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.25))));
      this.rect(cx - w, cy + dy, w * 2 + 1, 1, c);
    }
  }

  outline(c) {
    const edge = [];
    for (let y = -1; y <= this.h; y++) {
      for (let x = -1; x <= this.w; x++) {
        if (this.get(x, y)) continue;
        if (this.get(x - 1, y) || this.get(x + 1, y) || this.get(x, y - 1) || this.get(x, y + 1)) edge.push([x, y]);
      }
    }
    for (const [x, y] of edge) this.set(x, y, c);
  }

  rows() {
    return this.cells.map((row) => row.map((c) => (c ? char(c) : '.')).join(''));
  }
}

// [dark, mid, light, highlight]
const WOOD = ['#3a2818', '#5c4028', '#7e5a38', '#a07a4e'];
const PAINT = ['#2c4a4a', '#3e6a68', '#5a8a84'];
const IRON = ['#1e2224', '#3a4246', '#5e686c'];
const PAPER = ['#a89878', '#d8c8a0', '#f0e4c4'];
const INK = '#28201c';
const ROPE = ['#7a6038', '#a88a58', '#cdb07a'];
const QUILT = ['#6a2a2a', '#a8443c', '#d87a5a'];
const SEA = ['#2a4a58', '#3e6a78', '#6a9aa4'];
const LAND = ['#6a5a38', '#8a7a4e', '#a89a68'];
const LAMP = ['#c88a2a', '#ffc864', '#fff0b8'];
const STONE = ['#3a4442', '#5a6662', '#7e8a84'];

// A post (`w` wide) from y0 down to y1, dark on the left.
function post(g, x, y0, y1, w = 2) {
  g.rect(x, y0, w, y1 - y0 + 1, WOOD[1]);
  g.rect(x, y0, 1, y1 - y0 + 1, WOOD[0]);
  g.rect(x + w - 1, y0, 1, 1, WOOD[3]);
}

// Neat fives: four upright notches and one slash across them (the Deep's hand).
function fives(g, x, y, groups, h, c, slash) {
  let gx = x;
  for (let n = 0; n < groups; n++) {
    for (let s = 0; s < 4; s++) g.rect(gx + s * 2, y, 1, h, c);
    g.line(gx - 1, y + h - 1, gx + 7, y, slash);
    gx += 10;
  }
}

// --- The inn: a child's bunk under the stair --------------------------
function bunkTally() {
  const g = new Grid(32, 22);
  // Two short legs at each end, a low frame, a straw mattress, a red quilt.
  post(g, 1, 6, 21, 3);
  post(g, 28, 10, 21, 3);
  g.rect(4, 12, 24, 3, WOOD[2]);
  g.rect(4, 12, 24, 1, WOOD[3]);
  g.rect(4, 10, 24, 2, PAPER[0]);
  g.rect(12, 8, 16, 4, QUILT[1]);
  g.rect(12, 8, 16, 1, QUILT[2]);
  for (let x = 14; x < 28; x += 4) g.rect(x, 9, 1, 3, QUILT[0]);
  // The pillow, small and flat.
  g.rect(5, 7, 7, 4, PAPER[2]);
  g.rect(5, 10, 7, 1, PAPER[0]);
  // The front rail, low, and notched all along in neat fives.
  g.rect(4, 15, 24, 4, WOOD[1]);
  g.rect(4, 15, 24, 1, WOOD[2]);
  g.rect(4, 18, 24, 1, WOOD[0]);
  fives(g, 6, 15, 2, 3, WOOD[0], WOOD[0]);
  for (let s = 0; s < 3; s++) g.rect(26 - s * 2, 15, 1, 3, WOOD[0]);
  // A head-board with a little peg and nothing on it.
  g.rect(1, 4, 3, 3, WOOD[2]);
  g.rect(4, 7, 1, 1, WOOD[3]);
  g.outline(OUT);
  return g.rows();
}

// --- The harbour office: the clerk's desk and the launch-ledger --------
function ledgerDesk() {
  const g = new Grid(32, 24);
  // Four legs and a cross-bar.
  post(g, 3, 13, 23);
  post(g, 27, 13, 23);
  g.rect(5, 19, 22, 1, WOOD[0]);
  // The sloped top: higher at the back.
  for (let y = 7; y < 14; y++) g.rect(1, y, 30, 1, y < 9 ? WOOD[3] : WOOD[2]);
  g.rect(1, 13, 30, 1, WOOD[0]);
  // The ledger, open: two pages, ruled, a line of ink on the right one.
  g.rect(5, 4, 22, 8, PAPER[1]);
  g.rect(5, 4, 22, 1, PAPER[2]);
  g.rect(15, 4, 2, 8, PAPER[0]);
  for (let y = 6; y < 11; y += 2) {
    g.rect(7, y, 7, 1, PAPER[0]);
    g.rect(18, y, 7, 1, PAPER[0]);
  }
  g.rect(18, 8, 6, 1, INK);
  // A ribbon down the middle, an inkpot and a quill.
  g.rect(16, 11, 1, 3, '#8a2a2a');
  g.rect(27, 4, 3, 3, IRON[0]);
  g.rect(28, 4, 1, 1, IRON[2]);
  g.line(29, 3, 31, 0, PAPER[2]);
  g.line(28, 3, 30, 0, PAPER[1]);
  g.outline(OUT);
  return g.rows();
}

// --- The lookout: the chart of the coast --------------------------------
function coastMap() {
  const g = new Grid(32, 34);
  // Two legs, braced.
  post(g, 3, 18, 33);
  post(g, 27, 18, 33);
  g.line(5, 30, 27, 24, WOOD[0]);
  // The board and the chart pinned on it.
  g.rect(0, 0, 32, 22, WOOD[1]);
  g.rect(0, 0, 32, 1, WOOD[3]);
  g.rect(2, 2, 28, 18, SEA[1]);
  for (let x = 3; x < 30; x += 5) g.rect(x, 3 + (x % 3), 2, 1, SEA[2]);
  // The coast, running down the left and round to the right.
  g.rect(2, 2, 6, 18, LAND[1]);
  g.rect(8, 12, 6, 8, LAND[1]);
  g.rect(14, 16, 8, 4, LAND[1]);
  g.rect(7, 2, 1, 10, LAND[2]);
  g.rect(13, 12, 1, 4, LAND[2]);
  g.rect(21, 16, 1, 4, LAND[2]);
  // Gullrest (a sunny dot), Saltcombe (a lamp), the Lanes, the wrecks (masts).
  g.rect(4, 4, 2, 2, '#e8c040');
  g.rect(9, 13, 2, 2, LAMP[1]);
  g.set(9, 13, LAMP[2]);
  g.rect(16, 17, 3, 1, SEA[2]);
  g.rect(24, 12, 1, 3, INK);
  g.rect(26, 11, 1, 4, INK);
  g.line(23, 12, 27, 12, INK);
  // Little isles with little lights, and far out the black tower, ringed in red.
  for (const [x, y] of [[20, 6], [24, 5], [22, 9]]) {
    g.rect(x, y, 2, 2, LAND[0]);
    g.set(x, y - 1, LAMP[1]);
  }
  g.rect(28, 3, 1, 5, INK);
  g.set(27, 3, INK);
  g.set(29, 3, INK);
  for (const [x, y] of [[26, 3], [30, 3], [26, 7], [30, 7], [28, 1], [28, 9]]) g.set(x, y, '#c83a2a');
  // A dotted route from the town out to the wrecks.
  for (let i = 0; i < 6; i++) g.set(11 + i * 2, 13 - i, PAPER[2]);
  // Four pins at the corners.
  for (const [x, y] of [[2, 2], [29, 2], [2, 19], [29, 19]]) g.set(x, y, '#c8b890');
  g.outline(OUT);
  return g.rows();
}

// --- The town hall: the board of winters, and the painting -------------
function wintersBoard() {
  const g = new Grid(32, 28);
  post(g, 2, 14, 27);
  post(g, 28, 14, 27);
  g.rect(0, 0, 32, 18, PAINT[0]);
  g.rect(1, 1, 30, 16, PAINT[1]);
  g.rect(0, 0, 32, 1, PAINT[2]);
  // A painted heading, and rows of years in pale paint.
  g.rect(8, 2, 16, 2, PAPER[2]);
  for (let y = 6; y < 16; y += 2) {
    g.rect(3, y, 4, 1, PAPER[1]);
    g.rect(9, y, y === 12 ? 18 : 9 + ((y * 7) % 8), 1, PAPER[0]);
  }
  // One row with a heavy line ruled under it.
  g.rect(3, 13, 26, 1, '#c8603c');
  g.outline(OUT);
  return g.rows();
}

function summerPainting() {
  const g = new Grid(16, 28);
  // The easel: three legs.
  g.line(3, 27, 7, 4, WOOD[1]);
  g.line(12, 27, 8, 4, WOOD[1]);
  g.line(8, 27, 8, 14, WOOD[0]);
  g.rect(1, 17, 14, 1, WOOD[2]);
  // The frame and the picture: a blue sky, a sun, the harbour, red roofs.
  g.rect(0, 2, 16, 15, '#a8803a');
  g.rect(1, 3, 14, 13, '#7ab4d8');
  g.rect(1, 3, 14, 3, '#9ccce8');
  g.oval(11, 6, 1, 1, '#ffe070');
  g.rect(1, 12, 14, 4, '#3e8aa8');
  g.rect(1, 12, 14, 1, '#cfe8f0');
  g.rect(2, 9, 4, 3, '#e8d8b8');
  g.rect(2, 8, 4, 1, '#c8443c');
  g.rect(7, 10, 3, 2, '#e8c070');
  g.rect(7, 9, 3, 1, '#c8443c');
  g.rect(12, 13, 2, 1, '#f0e4c4');
  g.rect(0, 2, 16, 1, '#d8b060');
  g.outline(OUT);
  return g.rows();
}

// --- The rope at the top of the lagoon cliff ----------------------------
function ropeAnchor() {
  const g = new Grid(16, 16);
  // A squat stone with an iron ring bolted through it.
  g.rect(3, 9, 10, 6, STONE[1]);
  g.rect(3, 9, 10, 1, STONE[2]);
  g.rect(3, 14, 10, 1, STONE[0]);
  g.rect(7, 7, 2, 3, IRON[1]);
  g.oval(8, 5, 3, 3, IRON[1]);
  g.oval(8, 5, 1, 1, null);
  g.set(8, 5, null);
  g.rect(7, 2, 2, 1, IRON[2]);
  // The rope, knotted through the ring and away over the edge.
  g.rect(9, 5, 3, 2, ROPE[1]);
  g.rect(10, 7, 2, 9, ROPE[1]);
  for (let y = 7; y < 16; y += 2) g.set(11, y, ROPE[2]);
  g.set(10, 6, ROPE[2]);
  g.outline(OUT);
  return g.rows();
}

// --- In the water: Bramble paddling, Haddock wading ----------------------
const WATER = ['#2a5a6c', '#4a8a98cc', '#9ad0d0', '#e0f4f0'];
const ripple = {
  dark: char(WATER[0]),
  mid: char(WATER[1]),
  light: char(WATER[2]),
  foam: char(WATER[3]),
};

// The top `keep` rows of a standing sprite, padded to `width`, then a band of
// water over the rest, with ripples and (on `splash` frames) a fling of drops.
function inWater(rows, keep, width, frame, { splash = false, arms = null } = {}) {
  const pad = (width - rows[0].length) / 2;
  const top = rows.slice(0, keep).map((row) => '.'.repeat(Math.floor(pad)) + row + '.'.repeat(Math.ceil(pad)));
  const out = top.map((row) => [...row]);
  const w = width;
  // Splashing arms either side (Bramble's paddle), drawn in his skin and sleeve.
  if (arms) {
    const y = keep - 2 - frame;
    const [skin, sleeve, line] = arms;
    for (const side of [-1, 1]) {
      const x = side < 0 ? Math.floor(pad) - 1 + frame : Math.floor(pad) + rows[0].length - frame;
      if (out[y]) out[y][x] = sleeve;
      if (out[y - 1]) out[y - 1][x] = skin;
      if (out[y + 1]) out[y + 1][x] = line;
    }
  }
  // Ripples: a wavy line across the waist, a lighter one, then the water.
  const band = [];
  for (let r = 0; r < 4; r++) {
    const row = [];
    for (let x = 0; x < w; x++) {
      const wave = (x + frame * 2 + r) % 6;
      if (r === 0) row.push(wave < 2 ? ripple.foam : wave < 4 ? ripple.light : '.');
      else if (r === 1) row.push(wave < 3 ? ripple.light : ripple.mid);
      else row.push(r === 3 && x % 5 === frame % 5 ? ripple.light : ripple.mid);
    }
    band.push(row);
  }
  // Drops thrown up on a splash frame.
  if (splash) {
    for (const [x, y] of [[1, keep - 4], [w - 2, keep - 5], [3, keep - 6], [w - 4, keep - 3]]) if (out[y]) out[y][x] = ripple.foam;
  }
  // The water cuts the last row of body a little uneven.
  const last = out[out.length - 1];
  for (let x = 0; x < w; x++) if ((x + frame) % 4 === 0 && last[x] !== '.') last[x] = ripple.light;
  return [...out, ...band].map((row) => row.join(''));
}

// His standing sprite with the hatchet taken off his shoulder (columns 0-3, and the
// blade's outline in column 4 above his hair): he left it on the boards to swim, so
// nothing pokes up out of the water beside his head.
const brambleRows = BRAMBLE_PROP_SPRITES.bramble_stand.map((row, y) => '.'.repeat(y <= 4 ? 5 : 4) + row.slice(y <= 4 ? 5 : 4));
// His arms: skin, red flannel, outline (the same letters as bramble.js).
const BRAMBLE_ARMS = ['C', '3', 'k'];
const brambleSwim = (frame) => inWater(brambleRows, 12, 22, frame, { splash: frame === 1, arms: BRAMBLE_ARMS });
const haddockWade = (frame) => inWater(CF_HADDOCK_SPRITES[frame ? 'b' : 'a'], 19, 32, frame);

export const SC_PROP_SPRITES = {
  sc_bunk_tally: bunkTally(),
  sc_ledger_desk: ledgerDesk(),
  sc_coast_map: coastMap(),
  sc_winters_board: wintersBoard(),
  sc_summer_painting: summerPainting(),
  sc_rope_anchor: ropeAnchor(),
  sc_bramble_swim: brambleSwim(0),
  sc_haddock_wade: haddockWade(0),
};

// The colours the rows above use (on private characters), for PROP_PALETTE.
export const SC_PALETTE_EXTRA = palette;
// Moving ones: frames of one size, played by `animation: '<same name>'`. Each
// carries the palette of the figure it was cut from, plus the water.
export const SC_BRAMBLE_SWIM_PALETTE = { ...BRAMBLE_PALETTE, ...palette };
export const SC_BRAMBLE_SWIM_SPRITES = { f1: brambleSwim(0), f2: brambleSwim(1) };
export const SC_HADDOCK_WADE_PALETTE = { ...CF_PALETTE, ...palette };
export const SC_HADDOCK_WADE_SPRITES = { f1: haddockWade(0), f2: haddockWade(1) };

// How many tiles wide each big one stands.
export const SC_FOOTPRINTS = {
  sc_bunk_tally: 2,
  sc_ledger_desk: 2,
  sc_coast_map: 2,
  sc_winters_board: 2,
  sc_haddock_wade: 2,
};
