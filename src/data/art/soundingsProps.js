// Props for the Soundings, the sea-cave dungeon under the cliffs (Chapter 5, "The Tide
// Held"). Drawn like saltcombeProps.js: rows of characters from the small painter below,
// 16 pixels to a tile, standing on the bottom edge and centred over their footprint. Every
// id starts `sd_`. Nothing here hangs in the air: every chart, chain and weight has its
// posts or its frame.
//
//   sd_chart               the sounders' chart of the caves, pinned under a lid on a board
//                          with two braced legs (2 wide): the map of the dungeon
//   sd_windlass            a well windlass: two posts, a crank and a rope down the well
//   sd_windlass_on         the same, wound up, the bucket at the top (a lever's on look)
//   sd_weight_frame        an oak gallows over the great sounding well, the brass weight
//                          hanging from its pulley on a knotted cord (2 wide)
//   sd_weight_frame_empty  the same frame once the weight is taken: the cord hangs slack
//   sd_counterweight       the gate's counterweight post: an iron frame, a chain over a
//                          wheel and an empty hook (2 wide)
//   sd_counterweight_full  the same with the brass weight on the hook, the chain taut
//   sd_diving_bell         an old brass diving bell sat on the floor of a dry pocket, its
//                          chain coiled beside it (2 wide)

import { CURRENT_DOWN_SPRITES, CURRENT_UP_SPRITES, CURRENT_LEFT_SPRITES, CURRENT_RIGHT_SPRITES } from './drains.js';
import { WATER_FLOW_SPRITES, WATER_FLOW_SIDE_SPRITES } from './hushwood.js';

// --- A tiny painter ---------------------------------------------------
const OUT = '#0e1214';

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xf700 + colors.size);
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

  ring(cx, cy, r, c) {
    for (let a = 0; a < 64; a++) this.set(cx + Math.cos((a / 64) * Math.PI * 2) * r, cy + Math.sin((a / 64) * Math.PI * 2) * r, c);
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
const WOOD = ['#2a2018', '#46382a', '#5e4c38', '#7a6650'];
const IRON = ['#161c1e', '#2e383c', '#4a585c', '#6a7a7e'];
const BRASS = ['#6a4a1a', '#a87a2a', '#d8a848', '#f4d888'];
const ROPE = ['#5a4a30', '#86704a', '#b09a6a'];
const PAPER = ['#6a7a74', '#a8b4a4', '#d0d8c4'];
const INK = '#1e2a30';
const SEA = ['#14303c', '#1e4654', '#3a6a74'];
const GLASS = ['#2ab0b0', '#8af4ec'];
const WEED = ['#1c3c30', '#2e5c48'];
const WATER = ['#0c2a3a', '#1e4a5a', '#6ab0b8'];

// A post (`w` wide) from y0 down to y1, dark on the left, with weed at its wet foot.
function post(g, x, y0, y1, w = 2) {
  g.rect(x, y0, w, y1 - y0 + 1, WOOD[1]);
  g.rect(x, y0, 1, y1 - y0 + 1, WOOD[0]);
  g.rect(x + w - 1, y0, 1, 1, WOOD[3]);
  g.set(x, y1, WEED[1]);
  g.set(x + w - 1, y1 - 1, WEED[0]);
}

// The brass weight itself: a long plumb with a brass eye on top, at (cx, top).
function weight(g, cx, top) {
  for (let y = 0; y < 13; y++) {
    const half = 1 + Math.floor(y / 3);
    g.rect(cx - half, top + 3 + y, half * 2 + 1, 1, BRASS[1]);
    g.set(cx - half, top + 3 + y, BRASS[0]);
    if (y > 1 && y < 11) g.set(cx - half + 1, top + 3 + y, BRASS[3]);
  }
  g.rect(cx - 5, top + 16, 11, 2, BRASS[0]);
  g.rect(cx - 3, top + 10, 7, 1, BRASS[2]);
  g.ring(cx, top + 1, 1.5, BRASS[2]);
  g.set(cx, top + 1, null);
}

// --- The chart of the caves (the map) ---------------------------------
function chart() {
  const g = new Grid(32, 36);
  post(g, 3, 20, 35);
  post(g, 27, 20, 35);
  g.line(5, 32, 27, 26, WOOD[0]);
  // The board, and the chart under a glass lid gone green at the edges.
  g.rect(0, 0, 32, 23, WOOD[1]);
  g.rect(0, 0, 32, 1, WOOD[3]);
  g.rect(0, 22, 32, 1, WOOD[0]);
  g.rect(2, 2, 28, 19, PAPER[1]);
  g.rect(2, 2, 28, 1, PAPER[2]);
  g.rect(2, 20, 28, 1, PAPER[0]);
  // The caves as chambers joined by passages: the Mouth on the left, the big Echo Hall,
  // the Stair and the Wells to the right, the Chapel and the Weight Room below, the Way Up on top.
  const cave = (x, y, w, h) => {
    g.rect(x, y, w, h, SEA[2]);
    g.rect(x, y, w, 1, SEA[1]);
  };
  cave(3, 9, 4, 3); // mouth
  cave(9, 7, 8, 6); // echo hall
  cave(19, 9, 3, 5); // tide stair
  cave(23, 5, 5, 3); // three wells
  cave(11, 15, 5, 2); // chapel
  cave(11, 18, 5, 2); // weight room
  cave(12, 3, 3, 2); // way up
  g.line(7, 10, 9, 10, INK);
  g.line(17, 10, 19, 10, INK);
  g.line(21, 9, 23, 7, INK);
  g.line(13, 13, 13, 15, INK);
  g.line(13, 17, 13, 18, INK);
  g.line(13, 5, 13, 7, INK);
  // The shortcut back down from the Wells, dotted.
  for (let i = 0; i < 6; i++) g.set(24 - i, 8 + i, i % 2 ? INK : null);
  // Soundings in fathoms: little numbers, and a red ring round the weight room.
  for (const [x, y] of [[4, 4], [8, 15], [20, 4], [26, 13], [6, 18], [24, 17]]) {
    g.rect(x, y, 2, 1, INK);
    g.set(x + 1, y + 1, INK);
  }
  g.ring(13, 19, 3, '#a8443c');
  // A compass rose in the corner.
  g.line(27, 15, 27, 19, INK);
  g.line(25, 17, 29, 17, INK);
  g.set(27, 14, '#a8443c');
  // The lid's sheen, and the pins.
  g.line(4, 3, 9, 3, '#e8f0e0');
  for (const [x, y] of [[2, 2], [29, 2], [2, 20], [29, 20]]) g.set(x, y, BRASS[2]);
  g.outline(OUT);
  return g.rows();
}

// --- The well windlass -------------------------------------------------
function windlass(up) {
  const g = new Grid(16, 30);
  post(g, 1, 8, 29);
  post(g, 13, 8, 29);
  // The drum across the top, with rope wound on it.
  g.rect(1, 9, 14, 4, WOOD[2]);
  g.rect(1, 9, 14, 1, WOOD[3]);
  const turns = up ? 7 : 2;
  for (let i = 0; i < turns; i++) g.rect(4 + i, 9, 1, 4, i % 2 ? ROPE[1] : ROPE[2]);
  // The crank on the right post.
  g.rect(14, 5, 1, 5, IRON[2]);
  g.rect(14, 4, 2, 2, WOOD[3]);
  if (up) {
    // The bucket wound right up under the drum, dripping.
    g.line(8, 13, 8, 15, ROPE[1]);
    g.rect(5, 16, 7, 6, WOOD[1]);
    g.rect(5, 16, 7, 1, IRON[3]);
    g.rect(5, 20, 7, 1, IRON[2]);
    g.rect(6, 17, 5, 2, WATER[1]);
    g.set(8, 23, WATER[2]);
    g.set(9, 26, WATER[2]);
  } else {
    // The rope runs down into the well.
    g.line(8, 13, 8, 29, ROPE[1]);
    g.line(9, 14, 9, 29, ROPE[0]);
  }
  g.outline(OUT);
  return g.rows();
}

// --- The weight on its gallows over the sounding well ------------------
function weightFrame(hung) {
  const g = new Grid(32, 46);
  post(g, 2, 4, 45, 3);
  post(g, 27, 4, 45, 3);
  // The beam across, with a pulley in the middle.
  g.rect(1, 3, 30, 4, WOOD[2]);
  g.rect(1, 3, 30, 1, WOOD[3]);
  g.rect(1, 6, 30, 1, WOOD[0]);
  g.line(5, 7, 9, 12, WOOD[1]);
  g.line(26, 7, 22, 12, WOOD[1]);
  g.oval(16, 9, 3, 3, IRON[2]);
  g.set(16, 9, IRON[0]);
  // The cord: knotted every fathom, round the pulley and off to a cleat on the left post.
  g.line(13, 9, 5, 26, ROPE[1]);
  g.rect(4, 26, 3, 2, IRON[3]);
  if (hung) {
    g.line(16, 12, 16, 22, ROPE[2]);
    for (let y = 14; y < 22; y += 3) g.set(16, y, ROPE[0]);
    weight(g, 16, 22);
  } else {
    // Taken: the cord hangs slack, its end tied in an empty loop.
    g.line(16, 12, 16, 30, ROPE[2]);
    for (let y = 14; y < 30; y += 3) g.set(16, y, ROPE[0]);
    g.ring(16, 32, 2, ROPE[1]);
  }
  // Sea-glass light catching the posts from the well below.
  g.set(5, 38, GLASS[0]);
  g.set(27, 40, GLASS[0]);
  g.outline(OUT);
  return g.rows();
}

// --- The gate's counterweight post --------------------------------------
function counterweight(full) {
  const g = new Grid(30, 46);
  // An iron frame: two uprights and a top bar, bolted to a stone foot.
  g.rect(3, 2, 3, 42, IRON[1]);
  g.rect(3, 2, 1, 42, IRON[0]);
  g.rect(24, 2, 3, 42, IRON[1]);
  g.rect(24, 2, 1, 42, IRON[0]);
  g.rect(2, 1, 26, 4, IRON[2]);
  g.rect(2, 1, 26, 1, IRON[3]);
  g.rect(1, 42, 28, 4, '#3a464c');
  g.rect(1, 42, 28, 1, '#566870');
  for (let x = 4; x < 27; x += 5) g.set(x, 3, IRON[3]);
  // The chain wheel under the top bar.
  g.oval(15, 8, 4, 4, IRON[2]);
  g.ring(15, 8, 4, IRON[0]);
  g.set(15, 8, IRON[3]);
  // The chain runs off the wheel to the right (to the gate) and down the middle.
  g.line(19, 8, 27, 8, IRON[3]);
  const bottom = full ? 22 : 30;
  for (let y = 12; y < bottom; y++) g.set(15, y, y % 2 ? IRON[3] : IRON[2]);
  if (full) {
    // The hook, and the brass weight hung on it, the chain taut.
    g.rect(14, 22, 3, 1, IRON[3]);
    weight(g, 15, 21);
  } else {
    // An empty hook, and a little brass plate bolted to the upright.
    g.rect(14, 30, 3, 1, IRON[3]);
    g.set(13, 29, IRON[3]);
    g.set(13, 28, IRON[3]);
    g.rect(7, 24, 6, 4, BRASS[1]);
    g.rect(7, 24, 6, 1, BRASS[3]);
    g.rect(8, 26, 4, 1, BRASS[0]);
  }
  g.outline(OUT);
  return g.rows();
}

// --- The diving bell -------------------------------------------------------
function divingBell() {
  const g = new Grid(32, 34);
  // The bell: brass, wide at the foot, with two portholes and rows of rivets.
  for (let y = 0; y < 24; y++) {
    const half = 6 + Math.round(y * 0.42);
    g.rect(16 - half, 6 + y, half * 2, 1, BRASS[1]);
    g.set(16 - half, 6 + y, BRASS[0]);
    g.set(16 - half + 1, 6 + y, BRASS[0]);
    g.set(16 + half - 1, 6 + y, BRASS[2]);
  }
  g.rect(4, 29, 24, 3, BRASS[0]);
  g.rect(4, 29, 24, 1, BRASS[2]);
  for (let x = 6; x < 27; x += 3) g.set(x, 30, BRASS[3]);
  for (let x = 11; x < 22; x += 3) g.set(x, 12, BRASS[3]);
  // Portholes, green and dark.
  for (const cx of [11, 21]) {
    g.oval(cx, 19, 3, 3, BRASS[2]);
    g.oval(cx, 19, 2, 2, SEA[0]);
    g.set(cx - 1, 18, GLASS[1]);
  }
  // The eye on top, and its chain coiled on the floor beside it.
  g.rect(14, 2, 4, 4, BRASS[2]);
  g.ring(16, 2, 2, BRASS[2]);
  g.set(16, 2, null);
  g.line(17, 1, 29, 26, IRON[2]);
  g.oval(28, 30, 3, 2, IRON[1]);
  g.ring(28, 30, 2, IRON[3]);
  // Barnacles and a weed beard at the foot.
  for (const [x, y] of [[7, 27], [9, 28], [24, 26], [22, 28], [5, 28]]) g.set(x, y, '#c8d0c8');
  g.rect(6, 32, 20, 2, WEED[0]);
  g.set(10, 31, WEED[1]);
  g.set(19, 31, WEED[1]);
  // Verdigris streaks.
  g.line(13, 8, 11, 26, '#4a8a70');
  g.line(20, 9, 23, 25, '#4a8a70');
  g.outline(OUT);
  return g.rows();
}

// --- Registry ----------------------------------------------------------
export const SD_PROP_SPRITES = {
  sd_chart: chart(),
  sd_windlass: windlass(false),
  sd_windlass_on: windlass(true),
  sd_weight_frame: weightFrame(true),
  sd_weight_frame_empty: weightFrame(false),
  sd_counterweight: counterweight(false),
  sd_counterweight_full: counterweight(true),
  sd_diving_bell: divingBell(),
};

export const SD_PALETTE_EXTRA = palette;

// How many tiles wide each big one stands.
export const SD_FOOTPRINTS = {
  sd_chart: 2,
  sd_weight_frame: 2,
  sd_weight_frame_empty: 2,
  sd_counterweight: 2,
  sd_counterweight_full: 2,
  sd_diving_bell: 2,
};

// --- The races: the drains' currents and the brook's still water, in the sea cave's colours ---
// The same frames (they tile the same way), with the Soundings' water: teal and black-green, not
// the drains' blue. As animations: 'sd_current_down' / _up / _left / _right (a race running, the
// way it's named), and 'sd_still' / 'sd_still_side' (a race lying still and deep). Give a prop the
// drains' `sprite` (current_right, water_flow...) and one of these as its `animation`.
export const SD_CURRENT_PALETTE = {
  J: '#1a4e5e', // the water
  G: '#2c7482', // streaks
  0: '#7ac8c8', // the wake
  z: '#c8f0ec', // foam on the chevrons
};
export const SD_CURRENT_DOWN_SPRITES = CURRENT_DOWN_SPRITES;
export const SD_CURRENT_UP_SPRITES = CURRENT_UP_SPRITES;
export const SD_CURRENT_LEFT_SPRITES = CURRENT_LEFT_SPRITES;
export const SD_CURRENT_RIGHT_SPRITES = CURRENT_RIGHT_SPRITES;

export const SD_STILL_PALETTE = {
  '>': '#0f3242', // deep, still water
  '~': '#164052', // slow ripples
  z: '#2c6a78', // a glint of the wave colour
  0: '#24586a',
};
export const SD_STILL_SPRITES = WATER_FLOW_SPRITES;
export const SD_STILL_SIDE_SPRITES = WATER_FLOW_SIDE_SPRITES;
