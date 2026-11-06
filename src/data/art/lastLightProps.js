// Props for the inside of Chapter 5's Last Light (the tower where Corrie waits). Drawn like
// islesProps.js: rows of characters from a small painter, 16 pixels to a tile, standing on the
// bottom edge and centred over their footprint. Every id starts `ll_`.
//
//   ll_big_oilskin     a yellow oilskin on a peg stand, far too big for any child: the sleeves
//                      hang past the hem of a boy and the hem drags in a puddle (1 wide, 46 high)
//   ll_chalk_circle    a spell circle chalked on the brick: rings, runes, wave marks, rubbed out
//                      and drawn again (2 wide, 32 high; stands on the wall row)
//   ll_scorch_circle   the same kind of circle, but burnt into the brick, black with an orange
//                      edge where it caught (2 wide, 32 high)
//   ll_chalk_sums      tide sums chalked on the wall in a child's hand: columns of numbers, arrows
//                      up and down, a wobbly wave (2 wide, 16 high)
//   ll_chalk_hand      a child's handwriting, big at the start and cramped at the end, with a
//                      drawn boat (2 wide, 16 high)
//   ll_floor_circle    a spell circle chalked on the floor with a paper boat at each point
//                      (3 wide, 3 high; lay it `flat, walkable`)
//   ll_dead_lamp       the Last Light's great lamp, dead: a drum of dark glass rings in a brass
//                      frame on its pedestal, the bulb black, a crack across, salt on the brass
//                      (4 wide, 68 high)

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xf900 + colors.size);
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

  oval(cx, cy, rx, ry, c) {
    for (let dy = -ry; dy <= ry; dy++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.25))));
      this.rect(cx - w, cy + dy, w * 2 + 1, 1, c);
    }
  }

  line(x0, y0, x1, y1, c) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) this.set(x0 + ((x1 - x0) * i) / steps, y0 + ((y1 - y0) * i) / steps, c);
  }

  ring(cx, cy, r, c, steps = 0) {
    const n = steps || Math.max(16, r * 8);
    for (let i = 0; i < n; i++) this.set(cx + Math.cos((i / n) * 6.2832) * r, cy + Math.sin((i / n) * 6.2832) * r, c);
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

const OUT = '#0a0e10';
const YELLOW = ['#8a6a14', '#c49a22', '#e8c040', '#f4d86a'];
const WOOD = ['#3a2a1c', '#5a4430', '#7a6046', '#9a7c5a'];
const IRON = ['#1c2026', '#2e343c', '#4a5260', '#6a7480'];
const CHALK = ['#7e857c', '#b4bab0', '#e4e8dc'];
const BURN = ['#0c0c0c', '#2a1c14', '#7a3a18', '#d8761c'];
const BRASS = ['#4a3a1c', '#7a6230', '#a88a44', '#d0b468'];
const GLASS = ['#0e1c20', '#16282e', '#22404a', '#3a6670'];
const WATER = ['#1a4048', '#2e6a70'];
const PAPER = ['#cfc6ae', '#e8e0c8', '#a8a088'];
const SALT = '#c8d8d0';

let seed = 5;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};

// --- The oilskin that is far too big ---------------------------------
function bigOilskin() {
  const g = new Grid(16, 46);
  // Two posts and a crossbar with one iron peg: a coat-stand.
  g.rect(0, 2, 2, 44, WOOD[1]);
  g.rect(14, 2, 2, 44, WOOD[1]);
  g.rect(0, 2, 1, 44, WOOD[2]);
  g.rect(0, 1, 16, 3, WOOD[2]);
  g.rect(0, 1, 16, 1, WOOD[3]);
  g.rect(0, 44, 3, 2, WOOD[0]);
  g.rect(13, 44, 3, 2, WOOD[0]);
  g.rect(7, 4, 2, 3, IRON[2]);
  g.rect(6, 6, 4, 1, IRON[3]);
  // The hood bunched over the peg, then the coat: broad shoulders, sleeves too long, a hem
  // that reaches the floor and puddles.
  g.rect(5, 6, 6, 4, YELLOW[2]);
  g.rect(6, 7, 4, 2, YELLOW[0]);
  g.rect(3, 10, 10, 3, YELLOW[2]);
  g.rect(3, 13, 10, 28, YELLOW[1]);
  g.rect(3, 13, 2, 28, YELLOW[2]);
  g.rect(11, 13, 2, 28, YELLOW[0]);
  // The sleeves, hanging down past the pockets, one cuff on the floor.
  g.rect(2, 13, 2, 26, YELLOW[1]);
  g.rect(12, 13, 2, 27, YELLOW[0]);
  g.rect(2, 36, 2, 5, YELLOW[3]);
  // The front: a seam, big wooden buttons, a pocket you could keep a cat in.
  g.rect(8, 13, 1, 28, YELLOW[0]);
  for (const y of [15, 21, 27, 33]) g.rect(9, y, 2, 2, WOOD[1]);
  g.rect(4, 26, 4, 1, YELLOW[0]);
  g.rect(4, 26, 1, 6, YELLOW[0]);
  g.rect(7, 26, 1, 6, YELLOW[0]);
  g.rect(4, 31, 4, 1, YELLOW[0]);
  // Dark water stains and a puddle on the floor under the hem.
  g.rect(3, 38, 10, 3, YELLOW[0]);
  g.rect(3, 41, 10, 1, YELLOW[0]);
  g.rect(2, 43, 12, 2, WATER[0]);
  g.rect(4, 43, 5, 1, WATER[1]);
  g.outline(OUT);
  return g.rows();
}

// --- Chalk and scorch on the brick -----------------------------------
function circle(burnt) {
  const g = new Grid(32, 32);
  const [a, b, c] = burnt ? [BURN[1], BURN[2], BURN[3]] : CHALK;
  const dark = burnt ? BURN[0] : CHALK[0];
  // A wide scrubbed patch for the burnt one, so it reads as scorching and not a line drawing.
  if (burnt) {
    g.oval(16, 16, 14, 14, BURN[1]);
    for (let i = 0; i < 70; i++) g.set(3 + rand() * 26, 3 + rand() * 26, BURN[0]);
    g.oval(16, 16, 11, 11, BURN[0]);
    g.oval(16, 16, 8, 8, BURN[1]);
  }
  // Two rings, the outer one drawn twice (the first try is smudged).
  g.ring(16, 16, 13, a);
  g.ring(16, 16, 12, b);
  g.ring(17, 16, 12, dark);
  g.ring(16, 16, 9, b);
  // Runes round the gap between the rings: ticks, little waves, small boats.
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * 6.2832;
    const x = 16 + Math.cos(ang) * 10.5;
    const y = 16 + Math.sin(ang) * 10.5;
    if (i % 3 === 0) { g.set(x, y, c); g.set(x + 1, y, c); g.set(x, y + 1, c); }
    else if (i % 3 === 1) { g.set(x - 1, y, b); g.set(x, y - 1, c); g.set(x + 1, y, b); }
    else g.line(x, y - 1, x, y + 1, c);
  }
  // A star of lines inside, a wave in the middle, and a tiny boat.
  for (let i = 0; i < 3; i++) {
    const ang = (i / 3) * 3.1416 + 0.3;
    g.line(16 + Math.cos(ang) * 9, 16 + Math.sin(ang) * 9, 16 - Math.cos(ang) * 9, 16 - Math.sin(ang) * 9, b);
  }
  for (let x = 11; x < 22; x++) g.set(x, 16 + Math.round(Math.sin(x * 0.9) * 1.4), c);
  g.line(14, 20, 18, 20, c);
  g.line(15, 19, 17, 19, c);
  g.set(16, 17, c);
  g.set(16, 18, c);
  // A rubbed-out arc where a hand went through it.
  if (!burnt) for (let i = 0; i < 9; i++) g.set(5 + i, 22 + (i >> 1), null);
  return g.rows();
}

// Tide sums: a column of numbers in a child's hand, arrows, a wobbly wave.
function sums() {
  const g = new Grid(32, 16);
  const [a, b, c] = CHALK;
  // Row of tiny digits as little strokes.
  const digit = (x, y, n) => {
    const shapes = [
      [[0, 0, 2, 0], [0, 0, 0, 3], [2, 0, 2, 3], [0, 3, 2, 3]],
      [[1, 0, 1, 3]],
      [[0, 0, 2, 0], [2, 0, 2, 1], [0, 2, 2, 1], [0, 2, 0, 3], [0, 3, 2, 3]],
      [[0, 0, 2, 0], [2, 0, 2, 3], [0, 3, 2, 3], [0, 1, 2, 1]],
      [[0, 0, 0, 1], [0, 1, 2, 1], [2, 0, 2, 3]],
    ][n % 5];
    for (const [x0, y0, x1, y1] of shapes) g.line(x + x0, y + y0, x + x1, y + y1, c);
  };
  for (let row = 0; row < 3; row++) {
    const y = 1 + row * 5;
    let x = 1 + (row === 1 ? 1 : 0);
    digit(x, y, row + 1);
    g.set(x + 4, y + 1, b); g.set(x + 5, y + 1, b);
    g.set(x + 4, y + 3, b); g.set(x + 5, y + 3, b);
    digit(x + 7, y, row * 2 + 2);
    g.line(x + 11, y + 2, x + 14, y + 2, b);
    digit(x + 16, y, row + 3);
  }
  // Arrows up and down, the wobbly wave, a crossed-out line.
  g.line(26, 2, 26, 8, c); g.line(24, 4, 26, 2, c); g.line(28, 4, 26, 2, c);
  g.line(29, 8, 29, 14, b); g.line(27, 12, 29, 14, b); g.line(31, 12, 29, 14, b);
  for (let x = 22; x < 31; x++) g.set(x, 12 + Math.round(Math.sin(x * 1.1) * 1.2), a);
  g.line(1, 14, 18, 14, a);
  return g.rows();
}

// A child's writing: big at first, then cramped; a small boat drawn at the end.
function hand() {
  const g = new Grid(32, 16);
  const [a, b, c] = CHALK;
  let x = 1;
  for (let row = 0; row < 4; row++) {
    const y = 1 + row * 3.6;
    const size = row < 2 ? 3 : 2;
    x = 1 + (row % 2);
    while (x < 24 - row * 2) {
      const len = 2 + Math.floor(rand() * 4);
      for (let i = 0; i < len; i++) {
        g.set(x + i, y + (i % 2 ? 0 : size - 1), c);
        g.set(x + i, y + Math.floor(size / 2), i % 3 ? b : a);
      }
      x += len + 2;
    }
  }
  // The boat at the end, drawn properly.
  g.line(25, 11, 30, 11, c); g.line(26, 12, 29, 12, b);
  g.line(27, 5, 27, 10, c); g.line(27, 5, 30, 9, b); g.line(27, 10, 30, 10, b);
  return g.rows();
}

// A circle on the floor with a paper boat at each point.
function floorCircle() {
  const g = new Grid(48, 48);
  const [a, b, c] = CHALK;
  g.ring(24, 24, 22, a);
  g.ring(24, 24, 21, b);
  g.ring(24, 24, 15, b);
  g.ring(24, 24, 14, a);
  // Eight ticks between the rings.
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * 6.2832 + 0.2;
    g.line(24 + Math.cos(ang) * 16, 24 + Math.sin(ang) * 16, 24 + Math.cos(ang) * 20, 24 + Math.sin(ang) * 20, c);
  }
  // A big wave at the centre, three sums beside it.
  for (let x = 14; x < 35; x++) { g.set(x, 24 + Math.round(Math.sin(x * 0.7) * 2), c); g.set(x, 26 + Math.round(Math.sin(x * 0.7 + 1) * 2), b); }
  // Four paper boats at the compass points.
  const boat = (cx, cy) => {
    g.rect(cx - 3, cy, 7, 2, PAPER[1]);
    g.rect(cx - 2, cy + 2, 5, 1, PAPER[2]);
    g.rect(cx - 1, cy - 3, 3, 3, PAPER[0]);
    g.set(cx, cy - 4, PAPER[1]);
    g.set(cx + 3, cy - 1, PAPER[1]);
  };
  boat(24, 5);
  boat(43, 25);
  boat(24, 45);
  boat(5, 25);
  return g.rows();
}

// --- The great lamp, dead --------------------------------------------
function deadLamp() {
  const g = new Grid(68, 68);
  // Brass pedestal and bottom ring, salted white at the edges.
  g.rect(14, 60, 40, 8, BRASS[1]);
  g.rect(14, 60, 40, 2, BRASS[2]);
  g.rect(14, 66, 40, 2, BRASS[0]);
  g.rect(24, 54, 20, 7, BRASS[0]);
  g.rect(26, 54, 3, 6, BRASS[1]);
  // The drum of dark glass rings, a cold bulb in the middle.
  g.oval(34, 30, 26, 26, BRASS[0]);
  g.oval(34, 30, 24, 24, GLASS[1]);
  for (const r of [22, 19, 16, 13, 10]) g.ring(34, 30, r, r % 2 ? GLASS[3] : GLASS[0], r * 8);
  g.oval(34, 30, 7, 7, GLASS[0]);
  g.oval(34, 30, 4, 4, '#1a1a1a');
  // Brass ribs.
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * 3.1416;
    g.line(34 - Math.cos(a) * 25, 30 - Math.sin(a) * 25, 34 + Math.cos(a) * 25, 30 + Math.sin(a) * 25, BRASS[1]);
  }
  g.rect(8, 28, 52, 3, BRASS[1]);
  g.rect(8, 28, 52, 1, BRASS[2]);
  // A crack across the glass, and a patch of salt.
  g.line(22, 14, 30, 24, '#04080a');
  g.line(30, 24, 28, 34, '#04080a');
  g.line(28, 34, 38, 44, '#04080a');
  for (let i = 0; i < 18; i++) g.set(44 + rand() * 9, 40 + rand() * 9, SALT);
  for (let x = 14; x < 54; x += 3) g.set(x, 60, SALT);
  g.oval(34, 6, 6, 3, BRASS[0]);
  g.rect(30, 0, 8, 4, BRASS[1]);
  g.outline(OUT);
  return g.rows();
}

export const LL_PROP_SPRITES = {
  ll_big_oilskin: bigOilskin(),
  ll_chalk_circle: circle(false),
  ll_scorch_circle: circle(true),
  ll_chalk_sums: sums(),
  ll_chalk_hand: hand(),
  ll_floor_circle: floorCircle(),
  ll_dead_lamp: deadLamp(),
};

export const LL_PALETTE_EXTRA = palette;

// How many tiles wide each big one stands.
export const LL_FOOTPRINTS = {
  ll_chalk_circle: 2,
  ll_scorch_circle: 2,
  ll_chalk_sums: 2,
  ll_chalk_hand: 2,
  ll_floor_circle: 3,
  ll_dead_lamp: 4,
};
