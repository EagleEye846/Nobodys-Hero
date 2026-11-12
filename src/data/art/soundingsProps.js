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

  poly(pts, c) {
    const ys = pts.map((p) => p[1]);
    for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) {
      const xs = [];
      for (let i = 0; i < pts.length; i++) {
        const [ax, ay] = pts[i];
        const [bx, by] = pts[(i + 1) % pts.length];
        if ((ay <= y + 0.5 && by > y + 0.5) || (by <= y + 0.5 && ay > y + 0.5)) xs.push(ax + ((y + 0.5 - ay) / (by - ay)) * (bx - ax));
      }
      xs.sort((a, b) => a - b);
      for (let i = 0; i + 1 < xs.length; i += 2) this.rect(Math.round(xs[i]), y, Math.max(1, Math.round(xs[i + 1]) - Math.round(xs[i])), 1, c);
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

// ===================== CAVE DRESSING =====================
// The cave's own rock and what the sea and the sounders left in it. Wet slate in the tiles'
// colours, lit from the top left. Anything that climbs a wall (a ladder, a chain, a weed ledge,
// a pit prop) stands on the floor at the wall's foot and reaches up into the rock face, so it
// is held by the wall it's against.
const ROCK = ['#1a2428', '#3a4a52', '#586a72', '#7e949c'];
const BARN = ['#8a9890', '#c8d0c8'];
const STONE = ['#2e383c', '#4e5a5e', '#6e7a7c', '#98a4a2'];
const STAIN = ['#a8443c', '#3a6aa8', '#d8a848', '#4a9a5a', '#8a5ab0'];
const GLASS_DEEP = '#1a7a80';

// A rough lump of rock round (cx, cy): light on its top left, dark on its lower right.
function lump(g, cx, cy, rx, ry) {
  for (let y = -ry; y <= ry; y++) {
    for (let x = -rx; x <= rx; x++) {
      if ((x * x) / (rx * rx + 0.5) + (y * y) / (ry * ry + 0.5) > 1) continue;
      const d = x / (rx + 0.5) + y / (ry + 0.5);
      g.set(cx + x, cy + y, d > 0.7 ? ROCK[0] : d < -0.8 ? ROCK[2] : ROCK[1]);
    }
  }
  g.set(cx - Math.ceil(rx / 2), cy - Math.ceil(ry / 2), ROCK[3]);
}

// A cone of dripstone standing at (cx, foot), `half` wide at the foot and `h` tall.
function cone(g, cx, foot, half, h) {
  for (let i = 0; i < h; i++) {
    const y = foot - i;
    const w = Math.max(0, Math.round(half * Math.pow(1 - i / h, 0.8)));
    g.rect(cx - w, y, w * 2 + 1, 1, ROCK[1]);
    g.set(cx - w, y, ROCK[2]);
    if (w > 1) g.set(cx - w + 1, y, i > h * 0.3 ? ROCK[3] : ROCK[2]);
    g.set(cx + w, y, ROCK[0]);
    if (w > 2) g.set(cx + w - 1, y, ROCK[0]);
    // Rings where it grew, a little darker.
    if (i % 5 === 3 && w > 1) for (let x = cx - w + 2; x < cx + w - 1; x += 2) g.set(x, y, ROCK[0]);
  }
  g.set(cx, foot - h, ROCK[3]);
}

// A glowing six-sided prism of sea-glass from (x, foot) up `h`, `w` wide.
function prism(g, x, foot, h, w = 3) {
  g.rect(x, foot - h + 1, w, h, GLASS[0]);
  g.rect(x, foot - h + 1, 1, h, GLASS[1]);
  g.rect(x + w - 1, foot - h + 1, 1, h, GLASS_DEEP);
  g.set(x + Math.floor(w / 2), foot - h, GLASS[1]);
}

// A thick beam from (x0, y0) to (x1, y1), `t` thick, with barnacles on it.
function beam(g, x0, y0, x1, y1, t, barnacles = []) {
  for (let i = 0; i < t; i++) g.line(x0, y0 + i, x1, y1 + i, i === 0 ? WOOD[3] : i === t - 1 ? WOOD[0] : WOOD[1 + (i % 2)]);
  g.rect(x1, y1, 1, t, WOOD[0]);
  for (const [x, y] of barnacles) {
    g.set(x, y, BARN[1]);
    g.set(x + 1, y, BARN[0]);
  }
}

function stalagmite() {
  const g = new Grid(16, 30);
  g.oval(8, 28, 7, 1, WATER[0]);
  g.set(3, 28, WATER[2]);
  cone(g, 8, 28, 5, 26);
  cone(g, 13, 28, 2, 9);
  g.line(6, 8, 6, 20, '#5a8a90');
  g.outline(OUT);
  return g.rows();
}

function stalagmites() {
  const g = new Grid(32, 32);
  g.oval(16, 30, 15, 1, WATER[0]);
  g.set(26, 30, WATER[2]);
  cone(g, 5, 30, 2, 9);
  cone(g, 11, 30, 6, 29);
  cone(g, 20, 30, 4, 18);
  cone(g, 26, 30, 3, 12);
  lump(g, 16, 29, 2, 1);
  g.line(9, 12, 9, 24, '#5a8a90');
  g.outline(OUT);
  return g.rows();
}

// A slab fallen from the roof, lying tilted, broken in two, weed at its foot.
function slab() {
  const g = new Grid(32, 18);
  g.poly([[5, 4], [27, 3], [24, 9], [1, 10]], ROCK[2]);
  g.line(5, 4, 27, 3, ROCK[3]);
  g.poly([[1, 10], [24, 9], [24, 15], [1, 15]], ROCK[1]);
  g.poly([[24, 9], [27, 3], [28, 9], [24, 15]], ROCK[0]);
  g.line(1, 15, 24, 15, ROCK[0]);
  g.line(14, 4, 11, 10, ROCK[0]);
  g.line(11, 10, 12, 15, ROCK[0]);
  for (const [x, y] of [[4, 8], [9, 6], [19, 7]]) g.set(x, y, ROCK[1]);
  lump(g, 29, 14, 2, 2);
  lump(g, 5, 16, 2, 1);
  for (const x of [3, 8, 16, 21]) g.set(x, 16, WEED[1 - (x % 2)]);
  g.set(17, 15, BARN[1]);
  g.set(20, 14, BARN[0]);
  g.outline(OUT);
  return g.rows();
}

// Stones down from the roof at a wall's foot (flat: you walk over the little ones).
function scree() {
  const g = new Grid(32, 12);
  for (const [cx, cy, rx, ry] of [[4, 8, 3, 2], [10, 9, 2, 1], [15, 7, 4, 3], [22, 9, 3, 2], [27, 8, 2, 2], [19, 10, 1, 1], [30, 10, 1, 1]]) lump(g, cx, cy, rx, ry);
  for (const [x, y] of [[1, 11], [7, 11], [12, 11], [25, 11], [17, 4], [29, 5]]) g.set(x, y, ROCK[2]);
  g.outline(OUT);
  return g.rows();
}

// A heap of fallen rock (solid).
function rockPile() {
  const g = new Grid(16, 16);
  lump(g, 6, 10, 5, 4);
  lump(g, 12, 12, 3, 3);
  lump(g, 3, 13, 2, 2);
  lump(g, 9, 5, 3, 2);
  g.set(5, 14, WEED[1]);
  g.set(13, 15, WEED[0]);
  g.outline(OUT);
  return g.rows();
}

// Rock standing up out of black water: wet and dark at the waterline, the water breaking
// round its foot in a ring of foam (drawn after the outline, so the foam has no edge).
function seaRock(wide) {
  const w = wide ? 32 : 16;
  const g = new Grid(w, wide ? 22 : 18);
  const foot = g.h - 4;
  if (wide) {
    lump(g, 10, foot - 7, 8, 8);
    lump(g, 22, foot - 4, 6, 5);
    lump(g, 28, foot - 1, 3, 2);
  } else {
    lump(g, 8, foot - 5, 6, 6);
    lump(g, 12, foot - 1, 3, 2);
  }
  for (let x = 0; x < w; x++) for (let y = foot - 1; y < g.h; y++) if (g.get(x, y)) g.set(x, y, y >= foot ? null : WEED[0]);
  for (let x = 0; x < w; x++) if (g.get(x, foot - 2)) g.set(x, foot - 2, ROCK[0]);
  g.outline(OUT);
  for (let x = 0; x < w; x++) if (g.get(x, foot - 1) || g.get(x, foot - 2)) { g.set(x, foot, WATER[2]); if (x % 3 !== 1) g.set(x, foot + 1, '#a8d8d8'); }
  const left = g.cells[foot].findIndex(Boolean);
  const right = g.cells[foot].length - 1 - [...g.cells[foot]].reverse().findIndex(Boolean);
  if (left > 1) { g.set(left - 2, foot + 1, WATER[2]); g.set(left - 1, foot + 2, WATER[2]); }
  if (right < w - 2) { g.set(right + 2, foot + 1, WATER[2]); g.set(right + 1, foot + 2, WATER[2]); }
  return g.rows();
}

// Sea-glass growing out of a wet rock: the cave's own lamps.
function glassRock() {
  const g = new Grid(16, 22);
  prism(g, 2, 17, 6, 2);
  prism(g, 5, 16, 12);
  prism(g, 9, 15, 15);
  prism(g, 12, 17, 7, 2);
  lump(g, 8, 18, 7, 3);
  g.set(5, 19, GLASS[0]);
  g.set(12, 20, GLASS[0]);
  g.outline(OUT);
  return g.rows();
}

// A big outcrop of it, two wide.
function glassOutcrop() {
  const g = new Grid(32, 30);
  prism(g, 4, 23, 9);
  prism(g, 8, 22, 18, 4);
  prism(g, 13, 21, 25, 4);
  prism(g, 18, 22, 15, 3);
  prism(g, 22, 24, 10);
  prism(g, 26, 25, 5, 2);
  lump(g, 10, 25, 9, 4);
  lump(g, 22, 26, 8, 3);
  lump(g, 28, 27, 3, 2);
  g.set(7, 27, GLASS[1]);
  g.set(19, 28, GLASS[0]);
  g.outline(OUT);
  return g.rows();
}

// A crack in the floor with little shards of sea-glass in it (flat).
function glassBed() {
  const g = new Grid(16, 10);
  g.line(1, 7, 6, 6, ROCK[0]);
  g.line(6, 6, 10, 8, ROCK[0]);
  g.line(10, 8, 15, 6, ROCK[0]);
  for (const [x, y, h] of [[4, 6, 2], [7, 5, 3], [8, 6, 2], [12, 6, 2]]) {
    g.rect(x, y - h + 1, 1, h, GLASS[0]);
    g.set(x, y - h, GLASS[1]);
  }
  g.outline(OUT);
  return g.rows();
}

// A shelf of rock out of the wall, weed hanging down off its lip into a pool at the foot.
function weedLedge() {
  const g = new Grid(32, 30);
  g.oval(16, 28, 12, 1, WATER[0]);
  g.set(8, 28, WATER[2]);
  // The shelf: a rough lip, pale on top, black under.
  g.poly([[0, 3], [31, 2], [30, 6], [24, 8], [14, 7], [5, 9], [0, 7]], ROCK[1]);
  g.line(0, 3, 31, 2, ROCK[3]);
  g.line(1, 4, 30, 3, ROCK[2]);
  g.line(5, 9, 14, 7, ROCK[0]);
  g.line(14, 7, 24, 8, ROCK[0]);
  g.line(24, 8, 30, 6, ROCK[0]);
  // The weed, in strands of different length off the lip.
  for (const [x, top, len] of [[3, 8, 12], [6, 9, 18], [9, 8, 9], [12, 8, 15], [16, 8, 11], [19, 8, 17], [23, 8, 8], [26, 7, 13]]) {
    for (let j = 0; j < len; j++) {
      const sx = x + Math.round(Math.sin(j * 0.55 + x) * 1);
      g.set(sx, top + j, j % 3 === 0 ? WEED[0] : WEED[1]);
      if (j < len - 3) g.set(sx + 1, top + j, WEED[0]);
    }
    g.set(x, top + len, '#58a888');
  }
  // What has fallen off it into the pool.
  g.rect(10, 27, 6, 1, WEED[1]);
  g.rect(19, 28, 4, 1, WEED[0]);
  g.outline(OUT);
  return g.rows();
}

// Old timbers, barnacled, fallen in a heap.
function timbers() {
  const g = new Grid(32, 18);
  beam(g, 1, 11, 28, 6, 4, [[8, 9], [19, 7], [24, 6]]);
  beam(g, 4, 6, 26, 14, 3, [[12, 9], [21, 12]]);
  beam(g, 13, 13, 31, 13, 3, [[27, 13]]);
  for (const x of [2, 9, 17, 25]) g.set(x, 17, WEED[1]);
  g.rect(0, 16, 32, 1, null);
  g.outline(OUT);
  return g.rows();
}

// A sounders' pit prop: an upright under a crossbeam, wedged against the rock.
function pitProp() {
  const g = new Grid(16, 38);
  g.rect(0, 2, 16, 4, WOOD[2]);
  g.rect(0, 2, 16, 1, WOOD[3]);
  g.rect(0, 5, 16, 1, WOOD[0]);
  post(g, 6, 6, 37, 3);
  g.line(3, 6, 6, 12, WOOD[1]);
  g.line(12, 6, 9, 12, WOOD[1]);
  for (const [x, y] of [[7, 28], [8, 31], [6, 33], [8, 35], [7, 24]]) g.set(x, y, BARN[y % 2]);
  g.rect(4, 37, 8, 1, WEED[0]);
  g.outline(OUT);
  return g.rows();
}

// A rope ladder down the rock from two iron pegs, its foot in a loose coil.
function ropeLadder() {
  const g = new Grid(16, 32);
  for (const x of [3, 12]) {
    g.rect(x - 1, 1, 3, 2, IRON[2]);
    g.set(x - 1, 1, IRON[3]);
    g.line(x, 3, x, 28, ROPE[1]);
  }
  for (let y = 6; y < 28; y += 5) {
    g.rect(4, y, 8, 1, WOOD[2]);
    g.set(4, y + 1, WOOD[0]);
  }
  g.oval(9, 29, 5, 1, ROPE[0]);
  g.ring(9, 29, 3, ROPE[2]);
  g.outline(OUT);
  return g.rows();
}

// An iron ring let into the rock, and a chain off it in a heap on the floor.
function wallChain() {
  const g = new Grid(16, 30);
  g.rect(6, 1, 4, 2, IRON[1]);
  g.ring(8, 5, 3, IRON[3]);
  for (let y = 8; y < 25; y++) g.set(8 + (y > 18 ? 1 : 0), y, y % 2 ? IRON[3] : IRON[1]);
  g.oval(8, 27, 6, 2, IRON[1]);
  g.ring(8, 27, 4, IRON[3]);
  g.ring(7, 27, 2, IRON[2]);
  g.set(13, 26, '#6a4a34');
  g.set(4, 28, '#6a4a34');
  g.outline(OUT);
  return g.rows();
}

// The divers' gear left where they sat: a brass helmet, lead boots and a coil of air hose.
function diverGear() {
  const g = new Grid(32, 20);
  // The hose, coiled flat.
  g.ring(24, 15, 5, '#3a3a34');
  g.ring(24, 15, 3, '#5a5a4c');
  g.line(14, 13, 19, 14, '#3a3a34');
  // The helmet: a brass dome, a front glass, a collar of bolts.
  g.oval(10, 9, 7, 7, BRASS[1]);
  g.oval(8, 7, 3, 3, BRASS[2]);
  g.set(6, 5, BRASS[3]);
  g.oval(10, 10, 3, 3, BRASS[0]);
  g.oval(10, 10, 2, 2, SEA[0]);
  g.set(9, 9, GLASS[1]);
  g.rect(3, 16, 15, 3, BRASS[0]);
  g.rect(3, 16, 15, 1, BRASS[2]);
  for (let x = 4; x < 18; x += 3) g.set(x, 17, BRASS[3]);
  g.line(15, 5, 16, 12, '#4a8a70');
  // A lead boot on its side.
  g.rect(26, 4, 5, 6, IRON[1]);
  g.rect(24, 8, 7, 3, IRON[2]);
  g.rect(24, 10, 7, 1, IRON[0]);
  g.set(27, 5, IRON[3]);
  g.outline(OUT);
  return g.rows();
}

// --- The drowned chapel's furniture ---------------------------------------
// A pew under the water, only its back rail and its ends above it (flat: the water's over it).
function pewSunk() {
  const g = new Grid(32, 16);
  // The back: a broad board under a capping rail, tilting down to the right as it settles.
  g.poly([[2, 4], [29, 7], [29, 12], [2, 10]], WOOD[1]);
  for (const x of [8, 14, 20, 26]) g.line(x, 5 + Math.round((x - 2) / 9), x, 10 + Math.round((x - 2) / 9), WOOD[0]);
  g.line(2, 3, 29, 6, WOOD[3]);
  g.line(2, 4, 29, 7, WOOD[2]);
  g.line(2, 5, 29, 8, WOOD[0]);
  // The ends, with their rounded tops.
  g.rect(0, 1, 4, 11, WOOD[1]);
  g.rect(0, 1, 4, 1, WOOD[3]);
  g.set(0, 0, WOOD[2]);
  g.set(1, 0, WOOD[3]);
  g.rect(0, 2, 1, 10, WOOD[2]);
  g.rect(27, 4, 4, 9, WOOD[1]);
  g.rect(27, 4, 4, 1, WOOD[3]);
  g.rect(27, 5, 1, 8, WOOD[2]);
  for (const [x, y] of [[12, 9], [13, 10], [22, 11], [5, 9]]) g.set(x, y, BARN[1]);
  g.outline(OUT);
  // The waterline across its foot, and rings where the ends break the surface.
  for (let x = 0; x < 32; x++) if (g.get(x, 12 + Math.floor(x / 16))) g.set(x, 12 + Math.floor(x / 16), WATER[2]);
  for (const [x, y, w] of [[0, 13, 5], [26, 14, 6], [10, 13, 4], [18, 14, 3]]) g.rect(x, y, w, 1, '#6ab0b8');
  return g.rows();
}

// The font: a stone bowl on a stem, still full, weed round its foot.
function font() {
  const g = new Grid(16, 24);
  g.rect(3, 20, 10, 4, STONE[1]);
  g.rect(3, 20, 10, 1, STONE[2]);
  g.rect(3, 23, 10, 1, STONE[0]);
  g.rect(6, 11, 4, 9, STONE[1]);
  g.rect(6, 11, 1, 9, STONE[2]);
  g.rect(9, 11, 1, 9, STONE[0]);
  g.poly([[0, 5], [15, 5], [12, 11], [3, 11]], STONE[2]);
  g.rect(0, 5, 16, 1, STONE[3]);
  g.rect(2, 6, 12, 2, WATER[1]);
  g.rect(3, 6, 4, 1, WATER[2]);
  g.line(3, 9, 12, 9, STONE[1]);
  for (const x of [4, 7, 10]) g.set(x, 9, STONE[0]);
  g.line(11, 6, 9, 11, STONE[0]);
  g.set(4, 23, WEED[1]);
  g.set(11, 23, WEED[0]);
  g.set(12, 22, WEED[1]);
  g.outline(OUT);
  return g.rows();
}

// A brass candlestick knocked over, its candle rolled away (flat).
function candlestickFallen() {
  const g = new Grid(16, 10);
  g.line(3, 7, 12, 3, BRASS[1]);
  g.line(3, 6, 12, 2, BRASS[2]);
  g.oval(3, 7, 2, 2, BRASS[0]);
  g.set(2, 6, BRASS[3]);
  g.rect(12, 1, 3, 3, BRASS[1]);
  g.rect(9, 8, 4, 2, PAPER[2]);
  g.set(12, 8, PAPER[1]);
  g.outline(OUT);
  return g.rows();
}

// A candlestick still standing, its candle drowned out long ago.
function candlestick() {
  const g = new Grid(16, 26);
  g.oval(8, 24, 4, 1, BRASS[0]);
  g.rect(5, 22, 7, 2, BRASS[1]);
  g.rect(7, 8, 2, 14, BRASS[1]);
  g.rect(7, 8, 1, 14, BRASS[2]);
  for (const y of [12, 17]) g.rect(6, y, 4, 1, BRASS[2]);
  g.rect(5, 6, 6, 2, BRASS[2]);
  g.rect(7, 1, 2, 5, PAPER[1]);
  g.set(7, 1, PAPER[2]);
  g.line(10, 8, 10, 12, '#4a8a70');
  g.outline(OUT);
  return g.rows();
}

// What's left of the rood screen: two carved posts, pointed arches between, the top broken off.
function roodScreen() {
  const g = new Grid(32, 40);
  // The panels at the foot, stained by the flood.
  g.rect(1, 26, 30, 13, WOOD[1]);
  g.rect(1, 26, 30, 1, WOOD[3]);
  for (let x = 4; x < 30; x += 7) g.rect(x, 28, 5, 9, WOOD[0]);
  g.rect(1, 31, 30, 8, '#3a3a2a');
  g.line(1, 31, 30, 31, '#5a6a50');
  // The posts.
  g.rect(1, 4, 3, 35, WOOD[1]);
  g.rect(1, 4, 1, 35, WOOD[3]);
  g.rect(28, 12, 3, 27, WOOD[1]);
  g.rect(28, 12, 1, 27, WOOD[2]);
  // The arches: three, the right one broken.
  for (const [x, top] of [[5, 8], [12, 8], [19, 10]]) {
    g.rect(x, top + 6, 1, 26 - top - 6, WOOD[2]);
    g.rect(x + 6, top + 6, 1, 26 - top - 6, WOOD[1]);
    g.line(x, top + 6, x + 3, top, WOOD[2]);
    g.line(x + 6, top + 6, x + 3, top, WOOD[1]);
  }
  // The top beam, snapped off past the middle.
  g.poly([[1, 3], [22, 4], [20, 7], [24, 8], [21, 9], [1, 8]], WOOD[2]);
  g.line(1, 3, 22, 4, WOOD[3]);
  g.line(1, 8, 21, 9, WOOD[0]);
  g.rect(26, 11, 5, 2, WOOD[0]);
  for (const [x, y] of [[3, 35], [9, 37], [17, 36], [26, 35], [29, 33]]) g.set(x, y, BARN[y % 2]);
  g.outline(OUT);
  return g.rows();
}

// Coloured glass from the chapel's windows, in bits on the floor with the lead between (flat).
function glassShards() {
  const g = new Grid(16, 10);
  for (const [x, y, c] of [[2, 6, 0], [5, 4, 1], [8, 7, 2], [11, 5, 3], [13, 8, 4], [6, 8, 1], [3, 8, 2]]) {
    g.poly([[x, y], [x + 3, y - 1], [x + 1, y + 2]], STAIN[c]);
    g.set(x + 1, y, '#e8f0e0');
  }
  g.line(4, 5, 7, 8, IRON[0]);
  g.line(10, 4, 12, 7, IRON[0]);
  g.outline(OUT);
  return g.rows();
}

// A pillar fallen in two drums, its carving still on them.
function columnFallen() {
  const g = new Grid(32, 16);
  const drum = (x, y, w, h) => {
    g.rect(x, y, w, h, STONE[1]);
    g.rect(x, y, w, 1, STONE[3]);
    g.rect(x, y + 1, w, 1, STONE[2]);
    g.rect(x, y + h - 1, w, 1, STONE[0]);
    for (let i = 3; i < w - 1; i += 4) g.line(x + i, y + 2, x + i, y + h - 2, STONE[0]);
    g.oval(x + w, y + Math.floor(h / 2), 2, Math.floor(h / 2), STONE[2]);
    g.set(x + w, y + Math.floor(h / 2), STONE[1]);
  };
  drum(2, 5, 12, 9);
  drum(16, 7, 11, 8);
  lump(g, 30, 14, 1, 1);
  g.set(6, 14, WEED[1]);
  g.set(20, 15, WEED[0]);
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
  // Cave dressing.
  sd_stalagmite: stalagmite(),
  sd_stalagmites: stalagmites(),
  sd_slab: slab(),
  sd_scree: scree(),
  sd_rock_pile: rockPile(),
  sd_sea_rock: seaRock(false),
  sd_sea_rocks: seaRock(true),
  sd_glass_rock: glassRock(),
  sd_glass_outcrop: glassOutcrop(),
  sd_glass_bed: glassBed(),
  sd_weed_ledge: weedLedge(),
  sd_timbers: timbers(),
  sd_pit_prop: pitProp(),
  sd_rope_ladder: ropeLadder(),
  sd_wall_chain: wallChain(),
  sd_diver_gear: diverGear(),
  // The drowned chapel.
  sd_pew_sunk: pewSunk(),
  sd_font: font(),
  sd_candlestick: candlestick(),
  sd_candlestick_fallen: candlestickFallen(),
  sd_rood_screen: roodScreen(),
  sd_glass_shards: glassShards(),
  sd_column_fallen: columnFallen(),
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
  sd_stalagmites: 2,
  sd_slab: 2,
  sd_sea_rocks: 2,
  sd_scree: 2,
  sd_glass_outcrop: 2,
  sd_weed_ledge: 2,
  sd_timbers: 2,
  sd_diver_gear: 2,
  sd_pew_sunk: 2,
  sd_rood_screen: 2,
  sd_column_fallen: 2,
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
