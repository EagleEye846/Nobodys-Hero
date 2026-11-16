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
//   sc_leak_bucket      a tin bucket under a leak, slopped over (pair it with a `drip` touch)
//   sc_runner           the town hall's rush matting, worn through, wet feet on it (2 wide, 6 tall, lies flat)
//   sc_chairs_stacked   three chairs stacked seat on seat
//   sc_herring_crans    the wicker herring measures stacked upside down and dry (2 wide)
//   sc_window_boarded   a window with its glass gone, two planks nailed across (wall row)
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
  // Ripples: only a broken ring hugging the body at the waterline, so the room's own
  // water shows round and under them (a solid band read as a box of different water).
  const last0 = out[out.length - 1];
  let minX = w, maxX = -1;
  last0.forEach((c, x) => { if (c !== '.') { minX = Math.min(minX, x); maxX = Math.max(maxX, x); } });
  const band = [];
  for (let r = 0; r < 2; r++) {
    const row = [];
    const reach = r === 0 ? 2 : 1;
    for (let x = 0; x < w; x++) {
      const inside = x >= minX - reach && x <= maxX + reach;
      const wave = (x + frame * 2 + r) % 5;
      if (!inside) row.push('.');
      else if (r === 0) row.push(wave < 2 ? ripple.foam : wave < 4 ? ripple.light : '.');
      else row.push(wave === 0 || x === minX - reach || x === maxX + reach ? ripple.light : '.');
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

// --- The lookout's headland and the town hall (second pass) ---------------
// Thrift and rocks for the cliff top, a fence the wind has had a go at, gulls sitting it out,
// gorse bent over flat; and for the town hall, a lectern and a model of the lifeboat.
const ROCK = ['#3a3e3c', '#565c58', '#767e78', '#9aa49c', '#6a7a50'];
const PINK = ['#c86a8a', '#e894b0', '#f4c4d4'];
const TURF = ['#2e4a2a', '#3e5e32', '#56783e'];

// Sea pinks: a cushion of thin leaves with pink heads on stalks, nodding (flat).
function thrift(w, n, seed) {
  const g = new Grid(w, 12);
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < n; i++) {
    const cx = 3 + Math.floor(rnd() * (w - 6)), cy = 8 + Math.floor(rnd() * 3);
    g.oval(cx, cy, 2 + Math.floor(rnd() * 2), 1, TURF[1]);
    g.set(cx - 1, cy - 1, TURF[2]); g.set(cx + 1, cy, TURF[0]);
    for (let k = 0; k < 2; k++) {
      const hx = cx - 1 + k * 2 + (rnd() < 0.5 ? 0 : 1), hy = cy - 3 - Math.floor(rnd() * 3);
      g.line(hx, hy + 1, cx, cy - 1, TURF[2]);
      g.set(hx, hy, PINK[1]); g.set(hx + 1, hy, PINK[0]); g.set(hx, hy - 1, PINK[2]); g.set(hx - 1, hy, PINK[0]);
    }
  }
  return g.rows();
}

// A knuckle of grey rock coming up through the turf, lichen on it, grass round its foot.
function rocks(w, h, seed) {
  const g = new Grid(w, h);
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const lumps = w > 20 ? [[w * 0.32, h - 6, w * 0.26, h * 0.42], [w * 0.66, h - 5, w * 0.24, h * 0.32], [w * 0.5, h - 9, w * 0.2, h * 0.3]] : [[w / 2, h - 5, w * 0.36, h * 0.42]];
  for (const [cx, cy, rx, ry] of lumps) {
    for (let y = Math.round(cy - ry); y <= cy + ry; y++) for (let x = Math.round(cx - rx); x <= cx + rx; x++) {
      const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
      if (d > 1) continue;
      // Lit from the top left.
      const lit = (cx - x) / rx * 0.6 + (cy - y) / ry * 0.8;
      g.set(x, y, lit > 0.6 ? ROCK[3] : lit > 0.05 ? ROCK[2] : lit > -0.5 ? ROCK[1] : ROCK[0]);
    }
  }
  // Cracks and lichen.
  for (let i = 0; i < w / 6; i++) {
    const x = 2 + Math.floor(rnd() * (w - 4)), y = 2 + Math.floor(rnd() * (h - 6));
    if (!g.get(x, y)) continue;
    if (i % 2) { g.set(x, y, ROCK[0]); g.set(x + 1, y + 1, ROCK[0]); } else { g.set(x, y, ROCK[4]); g.set(x + 1, y, '#8a9a60'); }
  }
  g.outline(OUT);
  for (let x = 1; x < w - 1; x++) if ((x * 7) % 3) { g.set(x, h - 1, TURF[x % 3]); if (x % 4 === 1) g.set(x, h - 2, TURF[2]); }
  return g.rows();
}

// The lookout's rail where the wind took it: a post leaning out, a rail snapped and hanging,
// the other rail still nailed to the next post.
const RAIL = ['#3a2a1e', '#5a4430', '#7a5e42', '#9a7c58'];
function fenceBroken() {
  const g = new Grid(32, 22);
  // Two posts, the left one leaning.
  g.line(5, 4, 4, 21, RAIL[2]); g.line(6, 4, 5, 21, RAIL[1]); g.set(5, 3, RAIL[3]);
  g.line(26, 2, 26, 21, RAIL[2]); g.line(27, 2, 27, 21, RAIL[1]); g.set(26, 1, RAIL[3]);
  // The top rail, whole.
  g.line(6, 7, 26, 5, RAIL[3]); g.line(6, 8, 26, 6, RAIL[1]);
  // The lower rail snapped in the middle: one end hanging down to the turf.
  g.line(6, 13, 15, 12, RAIL[2]); g.line(6, 14, 15, 13, RAIL[1]);
  g.line(17, 20, 26, 12, RAIL[2]); g.line(17, 21, 26, 13, RAIL[1]);
  g.set(16, 12, RAIL[3]); g.set(16, 19, RAIL[3]);
  g.outline(OUT);
  for (const x of [2, 3, 8, 9, 23, 24, 29, 30]) g.set(x, 21, TURF[x % 2 ? 1 : 2]);
  return g.rows();
}

// A gull hunched against the wind on the turf, its head turning (two frames).
const GULL = ['#e8ece8', '#b8c0c0', '#6a7478', '#2a2e30', '#e8b040'];
function gull(i) {
  const g = new Grid(16, 12);
  g.oval(7, 7, 4, 2, GULL[0]);
  g.rect(4, 6, 7, 2, GULL[1]);
  g.rect(4, 6, 6, 1, GULL[2]);
  g.set(3, 7, GULL[3]); g.set(2, 7, GULL[3]); g.set(3, 8, GULL[2]);
  // The head, turned one way then the other.
  const hx = i ? 10 : 11;
  g.oval(hx, 4, 2, 2, GULL[0]);
  g.set(hx + (i ? -1 : 1), 3, GULL[3]);
  g.set(i ? hx - 2 : hx + 2, 4, GULL[4]); g.set(i ? hx - 3 : hx + 3, 4, GULL[4]);
  g.set(6, 10, GULL[4]); g.set(8, 10, GULL[4]);
  g.outline(OUT);
  return g.rows();
}

// Gorse, combed flat by the wind toward the land, a few yellow flowers in it.
const GORSE = ['#24381e', '#34502a', '#4a6a34', '#e8c040'];
function gorse(w, seed) {
  const h = 18;
  const g = new Grid(w, h);
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let y = 4; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const cx = w / 2 + 2, top = 4 + Math.abs(x - cx) * 0.5 + (x < cx ? 0 : (x - cx) * 0.25);
    if (y < top) continue;
    const v = rnd();
    g.set(x, y, y < top + 2 ? GORSE[2] : v < 0.3 ? GORSE[0] : GORSE[1]);
  }
  // Swept tips leaning west.
  for (let x = 3; x < w - 2; x += 2) { const t = Math.round(4 + Math.abs(x - (w / 2 + 2)) * 0.5); g.set(x - 1, t - 1, GORSE[2]); g.set(x - 2, t - 1, GORSE[1]); }
  for (let i = 0; i < w / 3; i++) { const x = 2 + Math.floor(rnd() * (w - 4)), y = 6 + Math.floor(rnd() * 8); if (g.get(x, y)) g.set(x, y, GORSE[3]); }
  g.outline(OUT);
  return g.rows();
}

// A worn path of flat stones set in the turf (flat, walkable), to break the turf up.
const FLAG = ['#6a6656', '#8a846e', '#4a463a'];
function flagstones(seed) {
  const g = new Grid(32, 16);
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (const [x, y, w, h] of [[2, 3, 7, 4], [11, 2, 6, 5], [19, 5, 8, 4], [6, 9, 6, 4], [15, 10, 7, 4], [25, 11, 5, 3]]) {
    const ox = Math.floor(rnd() * 2), oy = Math.floor(rnd() * 2);
    g.rect(x + ox, y + oy, w, h, FLAG[0]);
    g.rect(x + ox, y + oy, w, 1, FLAG[1]);
    g.rect(x + ox, y + oy + h, w, 1, FLAG[2]);
  }
  return g.rows();
}

// The town hall's lectern: a sloped stand on one leg, a book open on it.
function lectern() {
  const g = new Grid(16, 28);
  g.rect(7, 12, 2, 13, RAIL[2]); g.rect(9, 12, 1, 13, RAIL[1]);
  g.rect(4, 24, 8, 2, RAIL[1]); g.rect(4, 24, 8, 1, RAIL[3]);
  // The sloped top.
  for (let y = 4; y < 12; y++) g.rect(2 + Math.floor((12 - y) / 4), y, 12 - Math.floor((12 - y) / 2), 1, y < 6 ? RAIL[3] : RAIL[2]);
  g.rect(3, 11, 10, 1, RAIL[1]);
  // The book.
  g.rect(4, 5, 4, 4, '#e8e0c8'); g.rect(8, 5, 4, 4, '#d8d0b8'); g.rect(8, 5, 1, 4, '#8a7a60');
  g.rect(5, 6, 2, 1, '#8a8070'); g.rect(9, 7, 2, 1, '#8a8070');
  g.outline(OUT);
  return g.rows();
}

// A model of the lifeboat on a little table, rigged, its name on the bow.
function modelBoat() {
  const g = new Grid(32, 30);
  // The table.
  g.rect(3, 18, 26, 3, RAIL[2]); g.rect(3, 18, 26, 1, RAIL[3]);
  g.rect(5, 21, 2, 8, RAIL[1]); g.rect(25, 21, 2, 8, RAIL[1]);
  // The hull, blue with a white band, in its cradle.
  for (let x = 6; x < 26; x++) {
    const d = Math.abs(x - 15.5) / 10;
    const bot = 17 - Math.round(d * d * 3);
    g.rect(x, 12 + Math.round(d * 2), 1, bot - 12 - Math.round(d * 2), '#2a4a7a');
    g.set(x, 12 + Math.round(d * 2), '#e8e8e0');
    g.set(x, 13 + Math.round(d * 2), '#c84030');
  }
  g.rect(9, 16, 2, 2, RAIL[1]); g.rect(21, 16, 2, 2, RAIL[1]);
  // The mast and a furled sail, the rigging.
  g.rect(15, 1, 1, 12, RAIL[3]);
  g.rect(12, 4, 7, 1, RAIL[2]);
  g.rect(13, 5, 5, 2, '#e8e0c8');
  g.line(15, 1, 7, 12, '#5a5048'); g.line(15, 1, 25, 12, '#5a5048');
  g.set(23, 13, '#f0d060');
  g.outline(OUT);
  return g.rows();
}

// --- Storm-battered indoor things (2026-11-09) -------------------------
const TIN = ['#3a4448', '#6a767a', '#9aa6a8', '#c8d0d0'];
const WET = ['#2a3a40', '#3e5660', '#7a98a0'];

// A tin bucket under a leak in the roof, nearly full, a ring on the water and a wet ring of
// boards round it where it has slopped over.
function leakBucket() {
  const g = new Grid(16, 16);
  g.oval(8, 13, 7, 2, WET[0]);
  g.oval(8, 13, 6, 1, WET[1]);
  // The bucket, wider at the top, two bands.
  for (let y = 4; y < 14; y++) {
    const w = 5 - Math.floor((y - 4) / 5);
    g.rect(8 - w, y, w * 2, 1, TIN[1]);
    g.set(8 - w, y, TIN[0]);
    g.set(8 + w - 1, y, TIN[2]);
  }
  g.rect(3, 6, 10, 1, TIN[0]);
  g.rect(4, 11, 8, 1, TIN[0]);
  // The water at the brim, a ring on it.
  g.rect(4, 4, 8, 2, WET[1]);
  g.rect(5, 4, 3, 1, WET[2]);
  g.set(10, 5, WET[2]);
  // The handle, flat over the back rim.
  g.line(3, 4, 5, 2, TIN[0]); g.rect(5, 2, 6, 1, TIN[0]); g.line(11, 2, 12, 4, TIN[0]);
  g.outline(OUT);
  // Splashes on the boards.
  g.set(1, 14, WET[2]); g.set(14, 12, WET[2]); g.set(13, 15, WET[1]);
  return g.rows();
}

// The hall's rush matting, laid down the middle for the meetings and worn through where
// everybody stands: frayed at both ends, wet footprints from the door. Lies flat (2 wide).
function rushRunner() {
  const RUSH = ['#3e3220', '#5a4c2e', '#685838', '#7a6a42'];
  const g = new Grid(32, 96);
  for (let y = 2; y < 94; y++) {
    const wob = (y * 7) % 5 === 0 ? 1 : 0;
    g.rect(3 + wob, y, 26 - wob, 1, y % 3 === 0 ? RUSH[1] : RUSH[2]);
    if (y % 6 === 0) g.rect(5, y, 22, 1, RUSH[3]);
  }
  // A darker border woven along each side.
  g.rect(4, 2, 2, 92, RUSH[0]); g.rect(26, 2, 2, 92, RUSH[0]);
  // Worn through in the middle, where the speakers stand.
  for (const [x, y, w, h] of [[10, 14, 12, 6], [12, 20, 8, 3], [11, 46, 9, 4]]) {
    g.rect(x, y, w, h, RUSH[0]);
    g.rect(x + 1, y + 1, w - 2, h - 2, null);
  }
  // Frayed ends.
  for (let x = 4; x < 28; x += 2) { g.set(x, 1, RUSH[1]); g.set(x + 1, 94, RUSH[1]); g.set(x, 95, RUSH[0]); }
  // Wet feet in from the door.
  for (let i = 0; i < 6; i++) {
    const x = i % 2 ? 18 : 12, y = 88 - i * 11;
    g.rect(x, y, 3, 4, '#4a4030');
  }
  return g.rows();
}

// Chairs stacked against the wall for a meeting nobody wants to sit through (three, seat on seat).
function chairsStacked() {
  const g = new Grid(16, 34);
  // The bottom chair, standing: back, seat, splayed legs.
  g.rect(3, 13, 1, 21, WOOD[1]); g.rect(12, 13, 1, 21, WOOD[1]);
  g.rect(3, 13, 10, 2, WOOD[2]); g.rect(3, 13, 10, 1, WOOD[3]);
  g.rect(3, 17, 10, 1, WOOD[1]);
  g.rect(2, 23, 12, 2, WOOD[2]); g.rect(2, 23, 12, 1, WOOD[3]);
  g.line(4, 25, 2, 33, WOOD[1]); g.line(11, 25, 13, 33, WOOD[1]);
  // A second one on its seat, a little askew.
  g.rect(2, 20, 12, 2, WOOD[2]); g.rect(2, 20, 12, 1, WOOD[3]);
  // The top one upside down, its legs in the air.
  g.rect(2, 10, 12, 2, WOOD[2]); g.rect(2, 11, 12, 1, WOOD[1]);
  g.line(4, 9, 3, 2, WOOD[1]); g.line(11, 9, 12, 2, WOOD[1]);
  g.set(3, 2, WOOD[3]); g.set(12, 2, WOOD[3]);
  g.outline(OUT);
  return g.rows();
}

// Herring crans (the old wicker measures) stacked upside down and dry: nobody has filled one
// since the herring. A chalked tally on the top one, years old (2 wide).
function herringCrans() {
  const WICK = ['#4a3820', '#6e5430', '#8e7040', '#b08e58'];
  const g = new Grid(32, 26);
  const cran = (cx, by, rw) => {
    for (let y = by - 9; y <= by; y++) {
      const w = rw - Math.floor((by - y) / 4);
      g.rect(cx - w, y, w * 2, 1, (y + cx) % 2 ? WICK[1] : WICK[2]);
    }
    for (let x = cx - rw + 1; x < cx + rw; x += 3) g.rect(x, by - 8, 1, 8, WICK[0]);
    g.rect(cx - rw, by - 9, rw * 2, 1, WICK[3]);
    g.rect(cx - rw, by, rw * 2, 1, WICK[0]);
  };
  cran(9, 24, 8); cran(23, 24, 8); cran(16, 14, 7);
  // The chalk: four strokes and a slash, long ago.
  for (let s = 0; s < 4; s++) g.rect(12 + s * 2, 7, 1, 4, '#d8d8c8');
  g.line(11, 10, 19, 7, '#d8d8c8');
  g.outline(OUT);
  return g.rows();
}

// A window with its glass gone in the storm: two planks nailed across, the green showing
// through the gaps, rain run down the wall under it.
function windowBoarded() {
  const g = new Grid(16, 24);
  g.rect(1, 2, 14, 16, WOOD[1]);
  g.rect(1, 2, 14, 1, WOOD[3]);
  for (const [x, y] of [[3, 4], [8, 4], [3, 11], [8, 11]]) {
    g.rect(x, y, 5, 6, '#2c5a4c');
    g.rect(x, y + 4, 5, 2, '#1a3a34');
  }
  // One pane cracked, one gone (dark).
  g.line(9, 4, 12, 9, '#8ab8a0');
  g.rect(3, 11, 5, 6, '#0e1e1a');
  // The planks, one level and one slanted, nails at the ends.
  g.rect(0, 7, 16, 3, '#8a7048'); g.rect(0, 7, 16, 1, '#a88a5a');
  g.line(0, 15, 15, 11, '#7a6040'); g.line(0, 16, 15, 12, '#8a7048'); g.line(0, 17, 15, 13, '#6a5034');
  for (const [x, y] of [[1, 8], [14, 8], [1, 16], [14, 12]]) g.set(x, y, '#c8b890');
  g.rect(0, 18, 16, 2, WOOD[2]);
  g.rect(0, 18, 16, 1, WOOD[3]);
  g.outline(OUT);
  // The wet run down the boards under the sill.
  g.rect(5, 21, 1, 3, '#2a3a40'); g.rect(10, 21, 1, 2, '#2a3a40');
  return g.rows();
}

export const SC_PROP_SPRITES = {
  sc_bunk_tally: bunkTally(),
  sc_ledger_desk: ledgerDesk(),
  sc_coast_map: coastMap(),
  sc_winters_board: wintersBoard(),
  sc_summer_painting: summerPainting(),
  sc_rope_anchor: ropeAnchor(),
  sc_bramble_swim: brambleSwim(0),
  sc_haddock_wade: haddockWade(0),
  sc_thrift: thrift(16, 2, 3),
  sc_thrift_b: thrift(16, 3, 19),
  sc_thrift_wide: thrift(32, 5, 7),
  sc_rocks: rocks(32, 20, 5),
  sc_rocks_b: rocks(32, 16, 29),
  sc_rock_small: rocks(16, 12, 13),
  sc_fence_broken: fenceBroken(),
  sc_gull: gull(0),
  sc_gorse: gorse(32, 11),
  sc_gorse_small: gorse(20, 37),
  sc_flagstones: flagstones(9),
  sc_lectern: lectern(),
  sc_model_boat: modelBoat(),
  sc_leak_bucket: leakBucket(),
  sc_runner: rushRunner(),
  sc_chairs_stacked: chairsStacked(),
  sc_herring_crans: herringCrans(),
  sc_window_boarded: windowBoarded(),
};

// The colours the rows above use (on private characters), for PROP_PALETTE.
export const SC_PALETTE_EXTRA = palette;
export const SC_GULL_PALETTE = palette;
export const SC_GULL_SPRITES = { f1: gull(0), f2: gull(0), f3: gull(1), f4: gull(0), f5: gull(1), f6: gull(1) };
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
  sc_thrift_wide: 2,
  sc_rocks: 2,
  sc_rocks_b: 2,
  sc_fence_broken: 2,
  sc_gorse: 2,
  sc_flagstones: 2,
  sc_model_boat: 2,
  sc_runner: 2,
  sc_herring_crans: 2,
};
