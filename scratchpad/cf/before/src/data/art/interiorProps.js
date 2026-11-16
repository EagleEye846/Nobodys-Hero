// Small things for Chapter 5's indoor rooms (the coast's houses, the inn, the harbour office,
// the chandlery, the lights and the wrecks): what makes a room look lived in. Drawn like
// saltcombeProps.js: rows of characters from the small painter below, 16 pixels to a tile,
// standing on the bottom edge and centred over their footprint. Every id starts `in_`.
//
// Hung on the wall: put these on the wall's lowest row (the row just above the floor). Each
// has its own nail, peg, bracket or screws drawn on, and its foot is a few pixels above the
// floor line, so it hangs on the wall rather than standing on the boards.
//   in_shelf_tins       a plank shelf on two iron brackets: tins, a jar, a stone bottle (2 wide)
//   in_shelf_neat       the same shelf, every tin the same, labels lined up (2 wide)
//   in_shelf_bottles    the same shelf with bottles and a cork jar (2 wide)
//   in_chart            a sea chart held up with four brass pins (2 wide)
//   in_tide_paper       a paper tide table on a nail, one corner curling
//   in_knot_board       a board of knots on a cord from a nail; the last knot not finished (2 wide)
//   in_oilskin_peg      a yellow oilskin and sou'wester on a wooden peg, wet
//   in_sketch_boat      a framed pencil sketch of a small boat, on a nail
//   in_sketch_light     a framed pencil sketch of a lighthouse, on a nail
//   in_bottle_ship      a ship in a bottle on a little bracket shelf
//   in_window_storm     a four-pane window, the green storm behind it
//   in_window_calm      the same window once the storm has gone
//   in_wall_lamp        an oil lamp on an iron arm screwed to the wall (lit: see IN_GLOWS)
//   in_mug_rail         a peg rail screwed up, a mug on every peg (2 wide)
//   in_mug_rail_one     the same rail with one mug and the other pegs bare (2 wide)
//   in_barometer        a barometer on a backboard, two screws, the needle on STORMY
//   in_pigeonholes      a rack of pigeonholes on two brackets: rolled charts, papers (2 wide)
//   in_calendar         a calendar on a nail, the days crossed off neatly
//   in_pans_rail        a rail of pans and a ladle on hooks (2 wide)
// On the floor:
//   in_net_mending      a net over a trestle, half mended: the needle and twine by it (2 wide)
//   in_boots            a pair of sea boots, a puddle under them
//   in_boots_dry        a pair of sea boots, side by side, dry
//   in_cat_bowl         a cat's bowl with a fish tail in it (lies flat)
//   in_rug_red          a round braided rag rug, reds (3 wide, lies flat)
//   in_rug_blue         the same rug in blues (3 wide, lies flat)
//   in_stool_mugs       a three-legged stool with two mugs on it
//   in_stool_mug        the same stool with one mug
//   in_tins_crate       a crate with tins stacked on it
//   in_stove_kettle     the iron stove (as `stove`) with a kettle on its top
//   in_sea_chest_small  a little sea chest with rope handles, a folded blanket on it
//   in_logbook_stand    a ship's log open on a slanted stand

// --- A tiny painter ---------------------------------------------------
const OUT = '#1a1410';

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0x4600 + colors.size);
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

// [dark, mid, light, highlight]
const WOOD = ['#3a2818', '#5c4028', '#7e5a38', '#a07a4e'];
const IRON = ['#1e2224', '#3a4246', '#5e686c', '#8a9498'];
const PAPER = ['#a89878', '#d8c8a0', '#f0e4c4'];
const INK = '#28201c';
const PENCIL = '#4a4440';
const ROPE = ['#7a6038', '#a88a58', '#cdb07a'];
const BRASS = ['#7a5a1a', '#c8962a', '#f0d070'];
const YELLOW = ['#a8801a', '#e0b028', '#f8dc68'];
const RED = ['#6a2a24', '#a8443c', '#d87a5a'];
const BLUE = ['#2a3a5a', '#3e5a88', '#7a9ac8'];
const GREEN = ['#2a4a32', '#3e6a48', '#6a9a6a'];
const CREAM = ['#a8a088', '#d8d0b8', '#f4eedc'];
const SEA = ['#2a4a58', '#3e6a78', '#7aa8b4'];
const LAND = ['#8a7a4e', '#b8a878'];
const GLASS = ['#3a5a5a', '#6a9a98', '#c8e8e0', '#ffffff'];
const BOOT = ['#141414', '#2a2a2c', '#4a4a50'];
const NET = ['#5a6a42', '#8a9a62'];
const CORK = ['#9a6c38', '#c89a58'];
const STOVE = { k: '#120c1c', M: '#8a8296', O: '#5a5468', w: '#c08a4e' };

// A nail (a dark dot and a glint).
function nail(g, x, y) {
  g.set(x, y, IRON[0]);
  g.set(x + 1, y, IRON[3]);
}

// An iron shelf bracket under (x, y): down and a brace back to the wall.
function bracket(g, x, y, h = 5) {
  g.rect(x, y, 1, h, IRON[1]);
  g.line(x + 1, y, x + 1 + Math.floor(h / 2), y, IRON[1]);
  g.line(x + 1, y + h - 1, x + 1 + Math.floor(h / 2), y + 1, IRON[2]);
  g.set(x, y + h - 1, IRON[3]);
}

// A plank shelf on two brackets, 32 wide, the plank at row 11, nothing below row 17.
function shelf(kind) {
  const g = new Grid(32, 22);
  bracket(g, 4, 12, 5);
  bracket(g, 25, 12, 5);
  g.rect(1, 10, 30, 2, WOOD[2]);
  g.rect(1, 10, 30, 1, WOOD[3]);
  g.rect(1, 11, 30, 1, WOOD[1]);
  if (kind === 'tins') {
    // Odd tins, a jar of something pale, a stone bottle with a cork.
    const tins = [[2, 5, RED], [6, 4, BLUE], [10, 6, GREEN], [21, 5, YELLOW], [25, 3, RED]];
    for (const [x, h, c] of tins) {
      const w = 4;
      g.rect(x, 10 - h, w, h, IRON[2]);
      g.rect(x, 10 - h + 1, w, Math.max(1, h - 2), c[1]);
      g.rect(x, 10 - h + 1, 1, Math.max(1, h - 2), c[2]);
      g.rect(x, 10 - h, w, 1, IRON[3]);
    }
    g.rect(14, 3, 5, 7, GLASS[1]);
    g.rect(14, 5, 5, 5, CREAM[1]);
    g.rect(15, 4, 1, 5, GLASS[3]);
    g.rect(14, 2, 5, 1, CORK[0]);
    g.rect(29, 6, 2, 4, '#9a8a6a');
    g.rect(28, 7, 1, 3, '#7a6a4a');
    g.set(29, 5, CORK[1]);
  } else if (kind === 'neat') {
    // Six tins the same, the same height, the labels in a line: somebody tidy.
    for (let i = 0; i < 6; i++) {
      const x = 2 + i * 5;
      g.rect(x, 4, 4, 6, IRON[2]);
      g.rect(x, 4, 4, 1, IRON[3]);
      g.rect(x, 6, 4, 3, CREAM[2]);
      g.rect(x + 1, 7, 2, 1, INK);
      g.set(x, 5, IRON[3]);
    }
  } else {
    // Bottles: green, brown, a squat blue one; a cork jar.
    const bottles = [[2, GREEN], [6, '#6a4a22'], [10, GREEN], [20, BLUE], [24, '#6a4a22']];
    for (const [x, c] of bottles) {
      const col = Array.isArray(c) ? c : [c, c, '#a07a4e'];
      g.rect(x, 4, 3, 6, col[1]);
      g.rect(x + 1, 1, 1, 3, col[1]);
      g.set(x + 1, 0, CORK[1]);
      g.rect(x, 5, 1, 4, col[2]);
      g.rect(x, 6, 3, 2, CREAM[1]);
    }
    g.rect(14, 5, 4, 5, CORK[0]);
    g.rect(14, 5, 4, 1, CORK[1]);
    g.rect(28, 7, 2, 3, BRASS[1]);
  }
  g.outline(OUT);
  return g.rows();
}

// A sea chart, pinned at its corners.
function chart() {
  const g = new Grid(32, 22);
  g.rect(1, 1, 30, 15, SEA[2]);
  // The land down the left and along the top, a few soundings in the sea, a rhumb line.
  g.rect(1, 1, 6, 15, LAND[1]);
  g.rect(7, 1, 9, 3, LAND[1]);
  g.rect(7, 4, 3, 4, LAND[1]);
  g.line(7, 8, 9, 8, LAND[0]);
  g.line(10, 4, 15, 4, LAND[0]);
  for (const [x, y] of [[12, 7], [17, 9], [22, 6], [14, 12], [20, 13], [26, 10], [11, 10]]) g.set(x, y, SEA[0]);
  g.line(8, 14, 29, 3, SEA[1]);
  // A small compass rose.
  g.ring(25, 11, 3, INK, 12);
  g.line(25, 7, 25, 15, INK);
  g.line(21, 11, 29, 11, INK);
  g.set(25, 7, RED[1]);
  // The bottom corner curling up, and the four pins.
  g.set(30, 15, PAPER[0]);
  g.set(29, 15, PAPER[0]);
  g.set(30, 14, PAPER[0]);
  for (const [x, y] of [[2, 2], [29, 2], [2, 14], [28, 14]]) {
    g.set(x, y, BRASS[1]);
    g.set(x, y - 1, BRASS[2]);
  }
  g.outline(OUT);
  return g.rows();
}

// A paper tide table hung on a nail.
function tidePaper() {
  const g = new Grid(16, 20);
  g.rect(3, 2, 10, 14, PAPER[2]);
  g.rect(3, 2, 10, 2, SEA[1]);
  for (let y = 5; y < 15; y += 2) {
    g.rect(4, y, 3, 1, INK);
    g.rect(9, y, 3, 1, y % 4 === 1 ? INK : PENCIL);
  }
  g.rect(8, 5, 1, 10, PAPER[0]);
  // The bottom corner curls.
  g.set(12, 15, null);
  g.set(11, 15, PAPER[0]);
  g.set(12, 14, PAPER[0]);
  g.outline(OUT);
  nail(g, 7, 2);
  return g.rows();
}

// A knot board on a cord from a nail: four knots done, the fifth not finished, its end hanging.
function knotBoard() {
  const g = new Grid(32, 20);
  g.line(15, 1, 4, 6, ROPE[1]);
  g.line(16, 1, 27, 6, ROPE[1]);
  g.rect(2, 6, 28, 9, WOOD[2]);
  g.rect(2, 6, 28, 1, WOOD[3]);
  g.rect(2, 14, 28, 1, WOOD[1]);
  const knot = (x) => {
    g.line(x - 2, 9, x + 2, 9, ROPE[1]);
    g.oval(x, 10, 1, 1, ROPE[2]);
    g.set(x, 10, ROPE[0]);
    g.line(x - 1, 11, x - 2, 13, ROPE[1]);
    g.line(x + 1, 11, x + 2, 13, ROPE[1]);
  };
  for (const x of [6, 11, 16, 21]) knot(x);
  // The last: a loop and a long loose end, down off the board.
  g.ring(26, 10, 2, ROPE[1], 10);
  g.line(26, 12, 27, 17, ROPE[1]);
  g.set(27, 17, ROPE[2]);
  g.outline(OUT);
  nail(g, 15, 0);
  return g.rows();
}

// A wet oilskin and its hat on a peg.
function oilskinPeg() {
  const g = new Grid(16, 28);
  // The sou'wester on top of the peg, the coat hanging down from it.
  g.rect(4, 2, 8, 2, YELLOW[1]);
  g.rect(2, 4, 12, 1, YELLOW[0]);
  g.rect(5, 1, 6, 1, YELLOW[2]);
  g.rect(4, 5, 8, 3, YELLOW[1]);
  g.rect(3, 8, 10, 15, YELLOW[1]);
  g.rect(2, 9, 2, 11, YELLOW[0]);
  g.rect(12, 9, 2, 11, YELLOW[0]);
  g.rect(4, 8, 1, 14, YELLOW[2]);
  g.rect(8, 8, 1, 15, YELLOW[0]);
  for (const y of [10, 14, 18]) g.set(9, y, INK);
  g.rect(3, 22, 10, 1, YELLOW[0]);
  // Wet: a few bright beads running down.
  for (const [x, y] of [[5, 12], [6, 17], [11, 15], [10, 21], [3, 19]]) g.set(x, y, '#fff8c8');
  g.outline(OUT);
  // The peg, poking out from under the hat's brim.
  g.rect(7, 4, 2, 1, WOOD[2]);
  return g.rows();
}

// A framed pencil sketch on a nail: a boat, or a lighthouse. No people in either.
function sketch(what) {
  const g = new Grid(16, 20);
  g.line(7, 0, 2, 5, IRON[1]);
  g.line(8, 0, 13, 5, IRON[1]);
  g.rect(1, 5, 14, 12, WOOD[1]);
  g.rect(1, 5, 14, 1, WOOD[3]);
  g.rect(3, 7, 10, 8, CREAM[2]);
  if (what === 'boat') {
    g.line(4, 12, 11, 12, PENCIL);
    g.line(5, 13, 10, 13, PENCIL);
    g.line(8, 8, 8, 12, PENCIL);
    g.line(8, 8, 10, 11, PENCIL);
    g.line(3, 14, 12, 14, '#7a7470');
  } else {
    g.rect(7, 9, 2, 5, PENCIL);
    g.rect(6, 8, 4, 1, PENCIL);
    g.set(7, 7, PENCIL);
    g.set(8, 7, PENCIL);
    g.line(4, 8, 5, 8, '#7a7470');
    g.line(10, 8, 12, 8, '#7a7470');
    g.line(3, 14, 12, 14, '#7a7470');
  }
  g.outline(OUT);
  nail(g, 7, 0);
  return g.rows();
}

// A ship in a bottle lying on a little shelf with two brackets.
function bottleShip() {
  const g = new Grid(16, 20);
  bracket(g, 3, 14, 3);
  bracket(g, 11, 14, 3);
  g.rect(1, 13, 14, 1, WOOD[2]);
  g.rect(1, 12, 14, 1, WOOD[3]);
  // The bottle on its side, neck to the right, a cork.
  g.rect(2, 6, 10, 6, GLASS[1]);
  g.rect(12, 8, 2, 2, GLASS[1]);
  g.set(14, 8, CORK[1]);
  g.set(14, 9, CORK[0]);
  g.rect(3, 6, 8, 1, GLASS[2]);
  // The ship inside.
  g.rect(4, 10, 6, 1, WOOD[1]);
  g.rect(5, 11, 4, 1, WOOD[0]);
  g.rect(6, 7, 1, 3, WOOD[0]);
  g.rect(5, 7, 1, 2, CREAM[2]);
  g.rect(7, 7, 2, 3, CREAM[2]);
  g.set(3, 7, GLASS[3]);
  g.outline(OUT);
  return g.rows();
}

// A small four-pane window with a sill; the storm behind it, or a quiet sky.
function windowPanes(calm) {
  const g = new Grid(16, 24);
  g.rect(1, 2, 14, 16, WOOD[1]);
  g.rect(1, 2, 14, 1, WOOD[3]);
  const sky = calm ? ['#9ab4c4', '#c4d8e0', '#e8f0f0'] : ['#1a3a34', '#2c5a4c', '#5a8a74'];
  for (const [x, y] of [[3, 4], [8, 4], [3, 11], [8, 11]]) {
    g.rect(x, y, 5, 6, sky[1]);
    g.rect(x, y + 4, 5, 2, sky[0]);
    g.set(x, y, sky[2]);
  }
  if (calm) {
    g.rect(4, 6, 3, 1, sky[2]);
    g.rect(9, 5, 3, 1, sky[2]);
  } else {
    // Rain running down the glass.
    for (const [x, y] of [[4, 5], [6, 12], [10, 6], [11, 13], [9, 11], [5, 14]]) {
      g.set(x, y, sky[2]);
      g.set(x, y + 1, sky[2]);
    }
  }
  g.rect(0, 18, 16, 2, WOOD[2]);
  g.rect(0, 18, 16, 1, WOOD[3]);
  g.outline(OUT);
  return g.rows();
}

// An oil lamp on an iron arm, the arm's plate screwed to the wall.
function wallLamp() {
  const g = new Grid(16, 22);
  g.rect(3, 6, 3, 9, IRON[1]);
  g.set(4, 7, IRON[3]);
  g.set(4, 13, IRON[3]);
  g.line(6, 12, 10, 12, IRON[1]);
  g.line(6, 9, 10, 12, IRON[2]);
  // The lamp: a brass foot, a glass chimney, the flame.
  g.rect(8, 13, 5, 2, BRASS[1]);
  g.rect(8, 13, 5, 1, BRASS[2]);
  g.rect(9, 5, 3, 8, GLASS[2]);
  g.rect(10, 8, 1, 3, '#ffd870');
  g.set(10, 7, '#fff4c0');
  g.rect(9, 4, 3, 1, IRON[2]);
  g.outline(OUT);
  return g.rows();
}

// A peg rail with mugs: on every peg, or just one.
function mugRail(one) {
  const g = new Grid(32, 14);
  g.rect(1, 1, 30, 3, WOOD[2]);
  g.rect(1, 1, 30, 1, WOOD[3]);
  g.set(2, 2, IRON[3]);
  g.set(29, 2, IRON[3]);
  const mugs = [CREAM, BLUE, RED, GREEN];
  [6, 12, 18, 24].forEach((x, i) => {
    g.rect(x, 4, 1, 2, WOOD[1]);
    if (one && i > 0) return;
    const c = one ? BLUE : mugs[i];
    g.rect(x - 2, 6, 5, 6, c[1]);
    g.rect(x - 2, 6, 1, 6, c[2]);
    g.rect(x - 2, 11, 5, 1, c[0]);
    g.rect(x + 3, 7, 1, 3, c[1]);
  });
  g.outline(OUT);
  return g.rows();
}

// A barometer: a long backboard with two screws, the dial at the top, the needle hard over.
function barometer() {
  const g = new Grid(16, 22);
  g.rect(4, 1, 8, 17, WOOD[1]);
  g.rect(4, 1, 8, 1, WOOD[3]);
  g.oval(8, 6, 3, 3, CREAM[2]);
  g.ring(8, 6, 3, BRASS[1], 16);
  g.line(8, 6, 5, 5, INK);
  g.set(5, 5, RED[1]);
  g.rect(7, 11, 2, 5, CREAM[1]);
  g.rect(7, 13, 2, 3, RED[1]);
  g.set(8, 2, IRON[3]);
  g.set(8, 17, IRON[3]);
  g.outline(OUT);
  return g.rows();
}

// Pigeonholes on two brackets: rolled charts, folded papers, a bundle in red tape.
function pigeonholes() {
  const g = new Grid(32, 24);
  bracket(g, 4, 19, 3);
  bracket(g, 25, 19, 3);
  g.rect(1, 2, 30, 17, WOOD[1]);
  g.rect(1, 2, 30, 1, WOOD[3]);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      const x = 3 + c * 7;
      const y = 4 + r * 5;
      g.rect(x, y, 5, 4, WOOD[0]);
      const k = (r * 4 + c) % 4;
      if (k === 0) { g.oval(x + 1, y + 2, 1, 1, CREAM[2]); g.oval(x + 3, y + 2, 1, 1, CREAM[1]); }
      else if (k === 1) { g.rect(x, y + 1, 5, 3, PAPER[1]); g.rect(x, y + 1, 5, 1, PAPER[2]); }
      else if (k === 2) { g.rect(x, y + 1, 5, 3, PAPER[2]); g.rect(x + 2, y + 1, 1, 3, RED[1]); }
    }
  }
  g.outline(OUT);
  return g.rows();
}

// A calendar on a nail: a picture of the sea, a grid of days, neat crosses most of the way.
function calendar() {
  const g = new Grid(16, 20);
  g.rect(2, 2, 12, 15, CREAM[2]);
  g.rect(3, 3, 10, 4, SEA[1]);
  g.rect(3, 5, 10, 2, SEA[0]);
  g.set(9, 4, CREAM[2]);
  let n = 0;
  for (let y = 8; y < 16; y += 2) {
    for (let x = 3; x < 13; x += 2) {
      g.set(x, y, n < 17 ? INK : PAPER[0]);
      n++;
    }
  }
  g.outline(OUT);
  nail(g, 7, 2);
  return g.rows();
}

// A rail of pans and a ladle hung on hooks, the rail screwed to the wall.
function pansRail() {
  const g = new Grid(32, 18);
  g.rect(1, 1, 30, 2, IRON[1]);
  g.rect(1, 1, 30, 1, IRON[2]);
  g.set(2, 1, IRON[3]);
  g.set(29, 1, IRON[3]);
  const hook = (x) => { g.set(x, 3, IRON[2]); g.set(x, 4, IRON[2]); };
  // A frying pan, a pot, a ladle, a little pan.
  hook(6); g.rect(6, 5, 1, 4, IRON[1]); g.oval(6, 11, 3, 3, IRON[1]); g.oval(6, 11, 2, 2, IRON[0]);
  hook(14); g.rect(11, 5, 7, 7, '#7a5a3a'); g.rect(11, 5, 1, 7, '#a07a50'); g.rect(10, 5, 9, 1, '#5a3a22');
  hook(21); g.rect(21, 5, 1, 7, IRON[2]); g.oval(21, 13, 2, 1, IRON[2]);
  hook(27); g.rect(27, 5, 1, 3, IRON[1]); g.rect(25, 8, 5, 4, IRON[1]); g.rect(25, 8, 1, 4, IRON[2]);
  g.outline(OUT);
  return g.rows();
}

// A net over a trestle, half mended; the netting needle and twine on the boards by it.
function netMending() {
  const g = new Grid(32, 24);
  // The trestle: two A-legs and a bar.
  g.line(5, 23, 8, 9, WOOD[1]);
  g.line(11, 23, 8, 9, WOOD[1]);
  g.line(20, 23, 23, 9, WOOD[1]);
  g.line(26, 23, 23, 9, WOOD[1]);
  g.rect(4, 8, 24, 2, WOOD[2]);
  g.rect(4, 8, 24, 1, WOOD[3]);
  // The net hangs down both sides of the bar in a mesh; on the right, a torn hole.
  for (let y = 10; y < 20; y++) {
    for (let x = 3; x < 29; x++) {
      if ((x + y) % 3 === 0 || (x - y + 30) % 3 === 0) g.set(x, y, (y + x) % 2 ? NET[0] : NET[1]);
    }
  }
  for (let y = 12; y < 17; y++) for (let x = 19; x < 24; x++) g.set(x, y, null);
  g.line(19, 12, 18, 16, NET[1]);
  // Corks along the top.
  for (const x of [6, 12, 18, 24]) g.rect(x, 7, 2, 2, CORK[1]);
  // The needle (a long wooden shuttle) and the ball of twine.
  g.rect(27, 21, 4, 1, WOOD[3]);
  g.oval(30, 18, 1, 1, ROPE[2]);
  g.outline(OUT);
  return g.rows();
}

// A pair of sea boots, the tops turned down; wet ones stand in a little puddle.
function boots(wet) {
  const g = new Grid(16, 16);
  if (wet) {
    g.oval(8, 14, 7, 1, '#4a6a7a');
    g.set(3, 14, '#9ac4d4');
    g.set(12, 14, '#9ac4d4');
  }
  for (const x of [2, 9]) {
    g.rect(x, 3, 5, 10, BOOT[1]);
    g.rect(x, 3, 5, 2, BOOT[2]);
    g.rect(x, 3, 1, 10, BOOT[2]);
    g.rect(x - 1, 12, 7, 2, BOOT[0]);
  }
  g.outline(OUT);
  if (wet) {
    // (The puddle has no hard edge.)
    for (let x = 0; x < 16; x++) if (g.get(x, 15) === OUT) g.set(x, 15, null);
  }
  return g.rows();
}

// A cat's bowl, with a fish tail in it.
function catBowl() {
  const g = new Grid(16, 16);
  g.oval(8, 12, 5, 2, BLUE[1]);
  g.rect(3, 11, 11, 1, BLUE[2]);
  g.rect(5, 10, 7, 1, CREAM[1]);
  g.line(8, 10, 11, 8, '#9aa2aa');
  g.set(12, 7, '#9aa2aa');
  g.set(12, 9, '#9aa2aa');
  g.outline(OUT);
  return g.rows();
}

// A round braided rag rug.
function rug(c) {
  const g = new Grid(48, 16);
  g.oval(24, 8, 21, 6, c[0]);
  g.oval(24, 8, 17, 5, c[1]);
  g.oval(24, 8, 12, 3, CREAM[1]);
  g.oval(24, 8, 7, 2, c[2]);
  for (let x = 6; x < 44; x += 3) { g.set(x, 8, c[2]); }
  g.outline(OUT);
  return g.rows();
}

// A three-legged stool with a mug or two on it.
function stoolMugs(n) {
  const g = new Grid(16, 18);
  g.line(4, 17, 6, 10, WOOD[1]);
  g.line(12, 17, 10, 10, WOOD[1]);
  g.rect(7, 12, 2, 6, WOOD[0]);
  g.rect(3, 9, 10, 2, WOOD[2]);
  g.rect(3, 9, 10, 1, WOOD[3]);
  const mug = (x, c) => {
    g.rect(x, 4, 4, 5, c[1]);
    g.rect(x, 4, 1, 5, c[2]);
    g.rect(x + 4, 5, 1, 2, c[1]);
    g.rect(x + 1, 4, 2, 1, '#5a3a22');
  };
  mug(n === 1 ? 6 : 3, BLUE);
  if (n > 1) mug(9, CREAM);
  g.outline(OUT);
  return g.rows();
}

// A crate with tins stacked on it.
function tinsCrate() {
  const g = new Grid(16, 22);
  g.rect(1, 12, 14, 10, WOOD[2]);
  g.rect(1, 12, 14, 1, WOOD[3]);
  g.line(1, 13, 14, 21, WOOD[1]);
  g.rect(1, 16, 14, 1, WOOD[1]);
  const tin = (x, y, c) => {
    g.rect(x, y, 4, 4, IRON[2]);
    g.rect(x, y + 1, 4, 2, c[1]);
    g.rect(x, y, 4, 1, IRON[3]);
  };
  tin(2, 8, RED); tin(6, 8, BLUE); tin(10, 8, RED);
  tin(4, 4, GREEN); tin(8, 4, YELLOW);
  tin(6, 0, BLUE);
  g.outline(OUT);
  return g.rows();
}

// The plain iron stove (props.js `stove`), with a kettle sat on its top.
const STOVE_ROWS = [
  '......kkkk......',
  '.....kMMMMk.....',
  '.....kOOOOk.....',
  '.....kOOOOk.....',
  '.....kOOOOk.....',
  '.kk..kOOOOk..kk.',
  'kMMkkkkMMkkkkMMk',
  'kMMMMMMMMMMMMMMk',
  'kOOOOOOOOOOOOOOk',
  'kOOOOOOOOOOOOOOk',
  'kOOOOOOOOOOOOOOk',
  'kOOMMwwwwwwMMOOk',
  'kOOMOOOOOOOOMOOk',
  'kOOMOOOOOOOOMOOk',
  'kOOMOOOOOOOOMOOk',
  'kOOMOOOOOOOOMOOk',
  'kOOMOOOOOOOOMOOk',
  'kOOMOOOOOOOOMOOk',
  'kOOMOOOOOOOOMOOk',
  'kOOMMMMMMMMMMOOk',
  'kOOOOOOOOOOOOOOk',
  'kOOOOOOOOOOOOOOk',
  'kOOOOOOOOOOOOOOk',
  '.kkkkkkkkkkkkkk.',
];
function stoveKettle() {
  const g = new Grid(16, 24);
  STOVE_ROWS.forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== '.') g.set(x, y, STOVE[ch]); }));
  // The kettle, on the right of the flue, its spout out to the right.
  const K = ['#3a3e44', '#6a7076', '#a8b0b4'];
  const kettle = new Grid(16, 24);
  kettle.rect(11, 3, 4, 3, K[1]);
  kettle.rect(11, 3, 1, 3, K[2]);
  kettle.rect(12, 2, 2, 1, K[0]);
  kettle.set(15, 3, K[1]);
  kettle.outline(STOVE.k);
  for (let y = 0; y < 6; y++) for (let x = 10; x < 16; x++) if (kettle.get(x, y)) g.set(x, y, kettle.get(x, y));
  return g.rows();
}

// A little sea chest with rope handles, a blanket folded on its lid.
function seaChestSmall() {
  const g = new Grid(16, 16);
  g.rect(1, 6, 14, 9, WOOD[1]);
  g.rect(1, 6, 14, 1, WOOD[3]);
  g.rect(1, 9, 14, 1, WOOD[0]);
  g.set(0, 11, ROPE[1]);
  g.set(15, 11, ROPE[1]);
  g.rect(7, 9, 2, 2, BRASS[1]);
  g.rect(2, 3, 12, 3, RED[1]);
  g.rect(2, 3, 12, 1, RED[2]);
  g.rect(2, 5, 12, 1, RED[0]);
  g.outline(OUT);
  return g.rows();
}

// A ship's log, open on a slanted stand.
function logbookStand() {
  const g = new Grid(16, 22);
  g.rect(7, 10, 2, 11, WOOD[1]);
  g.rect(4, 20, 8, 2, WOOD[0]);
  g.line(1, 10, 14, 6, WOOD[2]);
  g.line(1, 11, 14, 7, WOOD[1]);
  g.rect(2, 4, 12, 5, PAPER[1]);
  g.rect(2, 4, 12, 1, PAPER[2]);
  g.rect(7, 4, 1, 5, PAPER[0]);
  for (const y of [5, 7]) { g.rect(3, y, 3, 1, INK); g.rect(9, y, 4, 1, PENCIL); }
  g.outline(OUT);
  return g.rows();
}

// --- More of a keeper's home -------------------------------------------
//   in_cat_bed       a round wicker basket with a cushion, a ginger cat curled up asleep in it
//   in_plant_pot     a red geranium in a clay pot, a saucer under it, one leaf gone brown
//   in_rods_corner   three fishing rods and a landing net leant in a corner, a creel at their foot
//   in_book_pile     books in two leaning piles on the boards, a pair of spectacles on top
//   in_coat_pegs     a peg rail screwed to the wall: a navy coat, a red scarf, a sou'wester (2 wide)
//   in_lamp_stool    a stool with an oil lamp on it, lit, and a box of matches
function catBed() {
  const g = new Grid(16, 14);
  // Wicker: a round basket, banded.
  g.oval(8, 9, 7, 4, WOOD[1]);
  for (let x = 2; x < 15; x += 2) g.rect(x, 7, 1, 6, WOOD[2]);
  g.rect(1, 8, 15, 1, WOOD[3]);
  g.oval(8, 8, 6, 2, RED[1]);
  // The cat: ginger, curled, tail round its nose.
  g.oval(8, 6, 5, 3, '#c8783a');
  g.oval(7, 5, 3, 2, '#e09a58');
  g.rect(11, 4, 3, 3, '#c8783a');
  g.set(11, 3, '#c8783a');
  g.set(13, 3, '#c8783a');
  g.set(12, 5, '#3a2818');
  g.line(3, 8, 10, 8, '#a85a2a');
  g.set(5, 4, '#e09a58');
  g.outline(OUT);
  return g.rows();
}
function plantPot() {
  const g = new Grid(16, 18);
  g.rect(4, 15, 8, 2, RED[0]);
  g.rect(5, 10, 6, 5, '#a85a3a');
  g.rect(4, 9, 8, 2, '#c87a4a');
  g.rect(5, 11, 1, 4, '#c87a4a');
  for (const [x, y] of [[3, 6], [6, 4], [10, 5], [12, 7], [8, 7], [5, 8]]) g.oval(x, y, 2, 1, GREEN[1]);
  g.oval(12, 7, 2, 1, '#8a7a3a');
  g.line(8, 9, 7, 3, GREEN[0]);
  g.line(8, 9, 10, 2, GREEN[0]);
  for (const [x, y] of [[7, 2], [10, 1], [6, 3]]) { g.rect(x - 1, y, 3, 2, '#d83a3a'); g.set(x, y, '#f07a6a'); }
  g.outline(OUT);
  return g.rows();
}
function rodsCorner() {
  const g = new Grid(16, 40);
  // Three rods leaning, the landing net beside them, a creel at the foot.
  g.line(2, 38, 2, 1, WOOD[2]);
  g.line(6, 38, 8, 4, '#5a6a3a');
  g.rect(2, 24, 1, 3, IRON[2]);
  g.rect(7, 22, 1, 3, IRON[2]);
  g.line(11, 38, 12, 17, WOOD[1]);
  g.ring(12, 12, 3, WOOD[2], 20);
  g.set(11, 12, NET[0]);
  g.set(13, 12, NET[0]);
  g.set(12, 11, NET[0]);
  g.set(12, 13, NET[0]);
  g.rect(1, 32, 10, 7, WOOD[2]);
  for (let x = 2; x < 11; x += 2) g.rect(x, 32, 1, 7, WOOD[1]);
  g.rect(1, 32, 10, 1, WOOD[3]);
  g.line(1, 32, 6, 29, ROPE[1]);
  g.line(6, 29, 10, 32, ROPE[1]);
  g.outline(OUT);
  return g.rows();
}
function bookPile() {
  const g = new Grid(16, 16);
  const cols = [RED[1], BLUE[1], GREEN[1], '#8a6a3a', CREAM[0], RED[0], BLUE[0]];
  let y = 15;
  for (let i = 0; i < 5; i++) { const w = 6 + (i % 3); const x = 1 + (i % 2); g.rect(x, y - 2, w, 2, cols[i]); g.rect(x, y - 2, w, 1, PAPER[1]); g.set(x, y - 1, cols[i]); y -= 2; }
  y = 15;
  for (let i = 0; i < 3; i++) { g.rect(9 + (i % 2), y - 3, 6, 3, cols[(i + 4) % 7]); g.rect(14 + (i % 2), y - 3, 1, 3, PAPER[1]); y -= 3; }
  // Spectacles on the left pile.
  g.set(3, 4, IRON[3]); g.set(5, 4, IRON[3]); g.set(4, 4, IRON[2]);
  g.outline(OUT);
  return g.rows();
}
function coatPegs() {
  const g = new Grid(32, 30);
  g.rect(1, 2, 30, 3, WOOD[2]);
  g.rect(1, 2, 30, 1, WOOD[3]);
  nail(g, 3, 3);
  nail(g, 27, 3);
  for (const x of [7, 15, 23]) g.rect(x, 5, 2, 2, WOOD[1]);
  // A navy coat, long and heavy, brass buttons.
  g.rect(4, 6, 8, 3, BLUE[0]);
  g.rect(3, 9, 10, 18, BLUE[0]);
  g.rect(4, 9, 3, 18, BLUE[1]);
  g.rect(7, 9, 1, 18, '#1a2438');
  for (const y of [12, 16, 20]) g.set(8, y, BRASS[2]);
  // A red scarf over the middle peg, the ends uneven.
  g.rect(14, 6, 4, 3, RED[1]);
  g.rect(14, 9, 2, 12, RED[1]);
  g.rect(16, 9, 2, 8, RED[0]);
  for (const y of [11, 14, 17]) g.rect(14, y, 2, 1, RED[2]);
  // A yellow sou'wester on the last.
  g.oval(24, 9, 5, 2, YELLOW[0]);
  g.oval(24, 7, 3, 2, YELLOW[1]);
  g.rect(22, 6, 3, 1, YELLOW[2]);
  g.outline(OUT);
  return g.rows();
}
function lampStool() {
  const g = new Grid(16, 24);
  g.rect(2, 13, 12, 2, WOOD[2]);
  g.rect(2, 13, 12, 1, WOOD[3]);
  g.line(3, 15, 2, 23, WOOD[1]);
  g.line(12, 15, 13, 23, WOOD[1]);
  g.line(8, 15, 8, 22, WOOD[0]);
  // The lamp: brass foot, glass chimney, the flame.
  g.rect(4, 10, 6, 3, BRASS[1]);
  g.rect(5, 9, 4, 1, BRASS[2]);
  g.rect(5, 3, 4, 6, GLASS[1]);
  g.rect(6, 4, 2, 4, GLASS[2]);
  g.rect(6, 5, 2, 2, '#ffd070');
  g.set(6, 5, '#fff4c0');
  g.rect(4, 2, 6, 1, BRASS[1]);
  g.rect(11, 11, 3, 2, RED[1]);
  g.outline(OUT);
  return g.rows();
}

export const IN_PROP_SPRITES = {
  in_shelf_tins: shelf('tins'),
  in_shelf_neat: shelf('neat'),
  in_shelf_bottles: shelf('bottles'),
  in_chart: chart(),
  in_tide_paper: tidePaper(),
  in_knot_board: knotBoard(),
  in_oilskin_peg: oilskinPeg(),
  in_sketch_boat: sketch('boat'),
  in_sketch_light: sketch('light'),
  in_bottle_ship: bottleShip(),
  in_window_storm: windowPanes(false),
  in_window_calm: windowPanes(true),
  in_wall_lamp: wallLamp(),
  in_mug_rail: mugRail(false),
  in_mug_rail_one: mugRail(true),
  in_barometer: barometer(),
  in_pigeonholes: pigeonholes(),
  in_calendar: calendar(),
  in_pans_rail: pansRail(),
  in_net_mending: netMending(),
  in_boots: boots(true),
  in_boots_dry: boots(false),
  in_cat_bowl: catBowl(),
  in_rug_red: rug(RED),
  in_rug_blue: rug(BLUE),
  in_stool_mugs: stoolMugs(2),
  in_stool_mug: stoolMugs(1),
  in_tins_crate: tinsCrate(),
  in_stove_kettle: stoveKettle(),
  in_sea_chest_small: seaChestSmall(),
  in_logbook_stand: logbookStand(),
  in_cat_bed: catBed(),
  in_plant_pot: plantPot(),
  in_rods_corner: rodsCorner(),
  in_book_pile: bookPile(),
  in_coat_pegs: coatPegs(),
  in_lamp_stool: lampStool(),
};

// The colours the rows above use (on private characters), for PROP_PALETTE.
export const IN_PALETTE_EXTRA = palette;

// How many tiles wide each big one stands.
export const IN_FOOTPRINTS = {
  in_shelf_tins: 2,
  in_shelf_neat: 2,
  in_shelf_bottles: 2,
  in_chart: 2,
  in_knot_board: 2,
  in_mug_rail: 2,
  in_mug_rail_one: 2,
  in_pigeonholes: 2,
  in_pans_rail: 2,
  in_net_mending: 2,
  in_rug_red: 3,
  in_rug_blue: 3,
  in_coat_pegs: 2,
};

// What glows (from the middle of the prop's foot, up is negative): the wall lamp, the stove,
// and the windows' light lying on the floor in front of them.
const LAMP = '255, 190, 100';
export const IN_GLOWS = {
  in_wall_lamp: [
    { dx: 2, dy: -24, bloom: 10, strength: 0.65, flicker: 0.3, color: LAMP },
    { dx: 2, dy: 12, pool: 52, strength: 0.45, flicker: 0.2, color: LAMP },
  ],
  in_lamp_stool: [
    { dx: 0, dy: -18, bloom: 9, strength: 0.6, flicker: 0.35, color: LAMP },
    { dx: 0, dy: 4, pool: 44, strength: 0.4, flicker: 0.25, color: LAMP },
  ],
  in_stove_kettle: [{ dy: -4, pool: 34, strength: 0.3, flicker: 0.5, color: '255, 128, 48' }],
  in_window_storm: [
    { dy: -12, bloom: 10, strength: 0.25, flicker: 0, color: '150, 210, 180' },
    { dy: 14, pool: 40, strength: 0.32, flicker: 0, color: '170, 220, 200' },
  ],
  in_window_calm: [
    { dy: -12, bloom: 10, strength: 0.3, flicker: 0, color: '230, 240, 240' },
    { dy: 14, pool: 46, strength: 0.42, flicker: 0, color: '240, 236, 220' },
  ],
};
