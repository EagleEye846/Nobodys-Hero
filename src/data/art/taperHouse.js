// Mother Taper's house (Chapter 1, up the stairs from the Flower Room): a gardener's and
// candlemaker's home, not a sitting room. Drawn like interiorProps.js: rows of characters
// from the small painter below, 16 pixels to a tile, standing on the bottom edge and
// centred over their footprint. Every id starts `th_`.
//
// Hung on the wall: put these on the wall's lowest row (the row just above the floor). Each
// has its own screws, nail, pegs or bracket drawn on.
//   th_drying_rail     a peg rail screwed up: bunches of flowers hung head-down, a hank of wick (2 wide)
//   th_herb_rail       the same rail with herbs, a ladle and a sieve on the pegs (2 wide)
//   th_sconce          a candle in a dish on an iron arm screwed to the wall (lit: see TH_GLOWS)
//   th_wick_board      a pegboard: spools of wick on pegs, shears on a hook (2 wide)
//   th_mould_shelf     a plank shelf on two brackets: tin candle moulds, cakes of wax (2 wide)
//   th_jar_shelf       the same shelf with jars of seed, each with a paper label (2 wide)
//   th_glass_panes     old glass panes in wooden glazing bars, pale light behind (2 wide)
//   th_frost_slate     a slate on a nail, chalked with a tally of cold nights
// Against the wall or on the floor:
//   th_hearth          a brick hearth, an iron crane over the fire with the wax pot on its hook (3 wide,
//                      animated: th_hearth)
//   th_hearth_cold     the same hearth gone out, the pot pushed back on its crane (3 wide)
//   th_seed_drawers    a chest of little drawers, every one labelled in ink (2 wide)
//   th_potting_bench   a bench of soil and pots, a trowel stuck in, a seedling half potted (2 wide)
//   th_wax_vat         a copper pot of wax on a little brick stove, embers under it (lit)
//   th_dipping_vats    a pot of hot wax and a tub of cold water side by side, for dipping (2 wide, lit)
//   th_dipping_rack    two posts and a crossbar, pegs along it, candles hung in pairs by their wicks (2 wide)
//   th_wax_crate       a crate of pale wax cakes
//   th_cot             a low cot built like a seedling tray, a quilt, a plant label at its head (2 wide)
//   th_stool           a three-legged stool
//   th_trug            a garden trug with gloves and a trowel (lies low)
//   th_sacks           two sacks, one rolled open on a heap of bulbs
//   th_cake_counter    a counter with a seed cake cooling on a rack, baked in a candle mould
//   th_sink            a stone sink on a cupboard, a pump spout over it, a pail beside
//   th_soup_stove      the iron stove with a soup pot on top (lit)
//   th_cold_frame      a low box with a glass lid propped on a stick, seedlings inside (2 wide)
//   th_staging         two tiers of slatted shelves of seedlings, six clean pots upturned at the end (2 wide)

// --- A tiny painter ---------------------------------------------------
const OUT = '#1a1410';

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0x4a00 + colors.size);
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
const PALE_WOOD = ['#6a5034', '#9a7a52', '#c0a070'];
const IRON = ['#1e2224', '#3a4246', '#5e686c', '#8a9498'];
const BRICK = ['#4a2420', '#7a3a30', '#9a5444'];
const COPPER = ['#5a2c16', '#a0562a', '#d0884a', '#f0b878'];
const TERRA = ['#6a3420', '#a85a3a', '#c87a4a', '#e09a6a'];
const SOIL = ['#22160e', '#3e2a1c', '#5a4030'];
const WAX = ['#bca878', '#e8dcb8', '#fff6e0'];
const PAPER = ['#a89878', '#d8c8a0', '#f0e4c4'];
const INK = '#28201c';
const GREEN = ['#24402a', '#3e6a48', '#6a9a6a', '#9ac87a'];
const LAV = ['#3a2e66', '#6a5aa8', '#9a8ad0'];
const GOLD = ['#9a7414', '#d8a828', '#f4d468'];
const ROSE = ['#7a2a3a', '#c05068', '#e888a0'];
const WHITE = ['#9a9488', '#d4d0c4', '#f4f2ea'];
const ROPE = ['#7a6038', '#a88a58', '#cdb07a'];
const SACK = ['#5a4a30', '#86704a', '#ac9468'];
const GLASS = ['#3a5050', '#6a8e8c', '#a8ccc6', '#e4f6f0'];
const SLATE = ['#22242c', '#34384a', '#4a5064'];
const CHALK = '#e8e6dc';
const QUILT = ['#3a5a3a', '#6a8a4a', '#c89a4a', '#a85a4a', '#e0d0a8'];
const STONE = ['#4a4656', '#6a6676', '#8a8696', '#a8a4b4'];
const FIRE = ['#a8301a', '#ff8c1a', '#ffcc66', '#fff2c0'];
const BRASS = ['#7a5a1a', '#c8962a', '#f0d070'];

// A screw (a dark dot with a glint).
function screw(g, x, y) {
  g.set(x, y, IRON[0]);
  g.set(x + 1, y, IRON[3]);
}

// An iron shelf bracket under (x, y): down and a brace back to the wall.
function bracket(g, x, y, h = 5) {
  g.rect(x, y, 1, h, IRON[1]);
  g.line(x + 1, y + h - 1, x + 1 + Math.floor(h / 2), y + 1, IRON[2]);
  g.set(x, y + h - 1, IRON[3]);
}

// A peg rail screwed to the wall (32 wide), four pegs, and what hangs from each peg.
function pegRail(hangs) {
  const g = new Grid(32, 24);
  g.rect(1, 1, 30, 3, WOOD[2]);
  g.rect(1, 1, 30, 1, WOOD[3]);
  g.rect(1, 3, 30, 1, WOOD[1]);
  const pegs = [5, 12, 19, 26];
  pegs.forEach((x, i) => {
    g.rect(x, 4, 1, 2, WOOD[0]);
    g.set(x, 6, WOOD[1]);
    hangs[i]?.(g, x);
  });
  g.outline(OUT);
  screw(g, 2, 2);
  screw(g, 28, 2);
  return g.rows();
}

// A bunch of flowers hung head-down from a peg: tied stems, then the heads below.
function bunch(c, stem = GREEN[0]) {
  return (g, x) => {
    g.line(x, 6, x, 8, ROPE[1]);
    g.rect(x - 1, 8, 3, 1, ROPE[2]);
    g.line(x - 1, 9, x - 3, 14, stem);
    g.line(x, 9, x, 15, stem);
    g.line(x + 1, 9, x + 3, 14, stem);
    for (const [dx, dy] of [[-3, 15], [-1, 17], [1, 16], [3, 15], [0, 18], [-2, 18], [2, 18]]) {
      g.oval(x + dx, dy, 1, 1, c[1]);
      g.set(x + dx, dy - 1, c[2]);
    }
    g.set(x - 1, 19, c[0]);
    g.set(x + 1, 19, c[0]);
  };
}

// A hank of wick looped over a peg.
function wickHank(g, x) {
  g.line(x - 1, 6, x - 3, 17, WAX[1]);
  g.line(x + 1, 6, x + 3, 17, WAX[1]);
  g.line(x, 6, x, 18, WAX[2]);
  g.line(x - 3, 17, x + 3, 17, WAX[0]);
  g.rect(x - 2, 9, 5, 1, ROPE[0]);
}

// Herbs: a long leafy bunch.
function herbs(g, x) {
  g.line(x, 6, x, 8, ROPE[1]);
  g.rect(x - 1, 8, 3, 1, ROPE[2]);
  for (let y = 9; y < 19; y++) {
    const w = Math.min(3, 1 + Math.floor((y - 9) / 3));
    g.rect(x - w, y, w * 2 + 1, 1, (y % 2) ? GREEN[1] : GREEN[2]);
  }
  g.set(x - 2, 14, GREEN[3]);
  g.set(x + 2, 16, GREEN[3]);
}

// A ladle on a peg.
function ladle(g, x) {
  g.rect(x, 5, 1, 9, IRON[2]);
  g.oval(x, 15, 2, 2, IRON[2]);
  g.rect(x - 1, 14, 3, 1, IRON[3]);
}

// A round sieve on a peg by a loop of string.
function sieve(g, x) {
  g.line(x, 6, x - 2, 9, ROPE[1]);
  g.line(x, 6, x + 2, 9, ROPE[1]);
  g.oval(x, 13, 4, 4, PALE_WOOD[1]);
  g.oval(x, 13, 3, 3, IRON[1]);
  for (let y = 11; y <= 15; y += 2) g.rect(x - 2, y, 5, 1, IRON[2]);
}

// A candle in a dish on an iron arm screwed to the wall.
function sconce() {
  const g = new Grid(16, 24);
  g.rect(6, 12, 4, 8, IRON[1]);
  g.line(8, 18, 8, 22, IRON[1]);
  g.line(8, 22, 12, 19, IRON[1]);
  g.rect(3, 18, 10, 1, IRON[2]);
  g.rect(4, 17, 8, 1, COPPER[2]);
  g.rect(6, 8, 4, 9, WAX[1]);
  g.rect(6, 8, 1, 9, WAX[2]);
  g.set(9, 9, WAX[2]);
  g.set(9, 10, WAX[2]);
  g.rect(7, 7, 1, 1, INK);
  g.outline(OUT);
  g.rect(7, 3, 2, 4, FIRE[2]);
  g.set(7, 2, FIRE[1]);
  g.rect(7, 5, 1, 2, FIRE[3]);
  screw(g, 6, 13);
  screw(g, 6, 18);
  return g.rows();
}

// A pegboard of spools of wick, and the shears on a hook.
function wickBoard() {
  const g = new Grid(32, 22);
  g.rect(1, 1, 30, 17, PALE_WOOD[1]);
  g.rect(1, 1, 30, 1, PALE_WOOD[2]);
  for (let y = 4; y < 17; y += 4) for (let x = 4; x < 30; x += 4) g.set(x, y, PALE_WOOD[0]);
  const spool = (x, y, c) => {
    g.rect(x - 2, y - 1, 5, 1, WOOD[1]);
    g.rect(x - 2, y + 4, 5, 1, WOOD[1]);
    g.rect(x - 1, y, 3, 4, c[1]);
    g.set(x - 1, y + 1, c[2]);
  };
  spool(5, 3, WAX);
  spool(11, 3, WAX);
  spool(17, 3, ROPE);
  spool(5, 10, ROPE);
  spool(11, 10, WAX);
  // A loose end of wick down from the last spool.
  g.line(12, 15, 13, 17, WAX[1]);
  // The shears on a hook.
  g.rect(24, 3, 1, 2, IRON[3]);
  g.line(22, 5, 26, 5, IRON[2]);
  g.line(23, 6, 21, 14, IRON[2]);
  g.line(25, 6, 27, 14, IRON[2]);
  g.oval(23, 6, 1, 1, WOOD[1]);
  g.oval(25, 6, 1, 1, WOOD[1]);
  g.outline(OUT);
  screw(g, 2, 2);
  screw(g, 28, 2);
  screw(g, 2, 16);
  screw(g, 28, 16);
  return g.rows();
}

// A plank shelf on two brackets, 32 wide, the plank at row 11; what's on it.
function plankShelf(kind) {
  const g = new Grid(32, 22);
  bracket(g, 4, 12, 5);
  bracket(g, 26, 12, 5);
  g.rect(1, 10, 30, 2, WOOD[2]);
  g.rect(1, 10, 30, 1, WOOD[3]);
  g.rect(1, 11, 30, 1, WOOD[1]);
  if (kind === 'moulds') {
    // Tin moulds standing in a row, a stack of wax cakes, a mould on its side.
    for (const x of [2, 6, 10]) {
      g.rect(x, 3, 3, 7, IRON[2]);
      g.rect(x, 3, 1, 7, IRON[3]);
      g.rect(x, 2, 3, 1, IRON[1]);
    }
    for (let i = 0; i < 3; i++) {
      g.rect(15, 8 - i * 2, 6, 2, WAX[1]);
      g.rect(15, 8 - i * 2, 6, 1, WAX[2]);
    }
    g.rect(23, 7, 7, 3, IRON[2]);
    g.rect(23, 7, 7, 1, IRON[3]);
    g.set(29, 8, IRON[0]);
  } else {
    // Jars of seed, each its own colour, each with a paper label and an ink scrawl.
    const jars = [[2, SOIL[2]], [7, GOLD[1]], [12, '#7a6a4a'], [17, ROSE[0]], [22, '#4a3a2a'], [27, GREEN[1]]];
    jars.forEach(([x, c], i) => {
      const h = i % 2 ? 6 : 7;
      g.rect(x, 10 - h, 4, h, GLASS[1]);
      g.rect(x, 10 - h + 2, 4, h - 2, c);
      g.rect(x, 10 - h, 4, 1, i % 3 ? WOOD[1] : IRON[2]);
      g.rect(x, 10 - h + 3, 4, 2, PAPER[2]);
      g.set(x + 1, 10 - h + 3, INK);
      g.set(x + 2, 10 - h + 4, INK);
      g.set(x + 3, 10 - h + 1, GLASS[3]);
    });
  }
  g.outline(OUT);
  return g.rows();
}

// Glasshouse panes in wooden glazing bars, a grey light behind them, one pane cracked.
function glassPanes() {
  const g = new Grid(32, 32);
  g.rect(1, 1, 30, 29, PALE_WOOD[1]);
  for (const x of [2, 16]) {
    g.rect(x, 2, 13, 26, GLASS[2]);
    g.rect(x, 2, 13, 4, GLASS[3]);
    g.rect(x, 14, 13, 1, PALE_WOOD[1]);
    for (let i = 0; i < 6; i++) g.set(x + 2 + i, 22 - i, GLASS[3]);
  }
  // A crack across one pane, and a moss line along the bottom bar.
  g.line(19, 16, 25, 20, GLASS[0]);
  g.line(22, 18, 23, 22, GLASS[0]);
  g.rect(1, 28, 30, 2, PALE_WOOD[0]);
  for (let x = 2; x < 30; x += 3) g.set(x, 28, GREEN[1]);
  g.outline(OUT);
  return g.rows();
}

// A slate on a nail: a chalk tally of cold nights, and a little chalk sprout at the end.
function frostSlate() {
  const g = new Grid(16, 22);
  g.rect(2, 4, 12, 13, WOOD[2]);
  g.rect(3, 5, 10, 11, SLATE[1]);
  g.rect(3, 5, 10, 1, SLATE[2]);
  for (let i = 0; i < 4; i++) g.line(4 + i, 7, 4 + i, 10, CHALK);
  g.line(3, 10, 8, 7, CHALK);
  g.line(9, 7, 9, 10, CHALK);
  g.line(10, 7, 10, 10, CHALK);
  // A tiny sprout drawn in chalk.
  g.line(7, 14, 7, 12, CHALK);
  g.set(6, 12, CHALK);
  g.set(8, 11, CHALK);
  g.rect(4, 14, 7, 1, CHALK);
  g.outline(OUT);
  g.line(7, 1, 4, 4, ROPE[1]);
  g.line(8, 1, 11, 4, ROPE[1]);
  g.set(7, 0, IRON[0]);
  g.set(8, 0, IRON[3]);
  return g.rows();
}

// The hearth: brick, an iron crane on two pins at the left, its arm over the fire with the
// wax pot on its hook. `flame` 0-2 picks the fire's shape; null is gone out.
function hearth(flame) {
  const g = new Grid(48, 40);
  // The brick surround and the black of the hearth.
  g.rect(2, 6, 44, 34, BRICK[1]);
  g.rect(2, 6, 44, 2, BRICK[2]);
  for (let y = 9; y < 40; y += 3) {
    g.rect(2, y, 44, 1, BRICK[0]);
    for (let x = 2 + ((y / 3) % 2) * 3; x < 46; x += 6) g.set(x, y + 1, BRICK[0]);
  }
  // A thick oak beam over the opening for a mantel, with drips of old wax down its face.
  g.rect(0, 4, 48, 4, WOOD[2]);
  g.rect(0, 4, 48, 1, WOOD[3]);
  g.rect(0, 7, 48, 1, WOOD[0]);
  for (const x of [7, 19, 33, 40]) g.rect(x, 8, 1, 2 + (x % 3), WAX[1]);
  // Things on the beam: a jar of spills, a row of drying wax cakes.
  g.rect(4, 0, 4, 4, TERRA[1]);
  g.rect(5, 0, 1, 1, PALE_WOOD[2]);
  g.rect(6, 0, 1, 1, PALE_WOOD[2]);
  for (const x of [30, 35, 40]) {
    g.rect(x, 1, 4, 3, WAX[1]);
    g.rect(x, 1, 4, 1, WAX[2]);
  }
  // The opening.
  g.rect(8, 12, 32, 26, '#120c10');
  g.rect(8, 12, 32, 2, '#2a1c18');
  // Logs and ash.
  g.rect(12, 34, 24, 3, WOOD[1]);
  g.rect(14, 33, 20, 1, WOOD[2]);
  g.rect(10, 37, 28, 1, '#3a3236');
  // The crane: an upright on two pins at the left side, the arm across, a hook down.
  g.rect(10, 13, 2, 22, IRON[1]);
  g.set(9, 15, IRON[3]);
  g.set(9, 31, IRON[3]);
  const armEnd = flame === null ? 18 : 28;
  g.rect(10, 13, armEnd - 9, 2, IRON[1]);
  g.line(11, 22, armEnd - 2, 15, IRON[2]);
  g.rect(armEnd - 1, 15, 1, 3, IRON[2]);
  // The copper pot on the hook, a bail handle, wax at the brim.
  const px = armEnd - 7;
  g.line(px, 20, armEnd - 1, 17, IRON[2]);
  g.line(px + 12, 20, armEnd - 1, 17, IRON[2]);
  g.rect(px, 20, 13, 9, COPPER[1]);
  g.rect(px, 20, 13, 1, COPPER[3]);
  g.rect(px + 1, 21, 2, 7, COPPER[2]);
  g.rect(px + 1, 28, 11, 1, COPPER[0]);
  g.rect(px + 1, 20, 11, 1, flame === null ? WAX[0] : WAX[2]);
  // A drip of wax down the pot's side.
  g.rect(px + 9, 21, 1, 3, WAX[1]);
  if (flame !== null) {
    const tips = [[18, 30], [24, 29], [29, 30]];
    tips.forEach(([x, top], i) => {
      const lean = ((flame + i) % 3) - 1;
      const t = top + ((flame + i) % 2);
      g.rect(x - 2, t + 2, 5, 34 - t - 2, FIRE[1]);
      g.rect(x - 1 + lean, t, 3, 34 - t, FIRE[2]);
      g.rect(x + lean, t + 2, 1, 34 - t - 3, FIRE[3]);
    });
    g.set(14, 32, FIRE[0]);
    g.set(33, 32, FIRE[0]);
  } else {
    g.set(20, 33, '#5a2a1a');
    g.set(27, 33, '#5a2a1a');
  }
  g.outline(OUT);
  return g.rows();
}

// A chest of little drawers, four by four, every one labelled; a jar and a seed packet on top.
function seedDrawers() {
  const g = new Grid(32, 34);
  g.rect(2, 8, 28, 24, WOOD[1]);
  g.rect(2, 8, 28, 2, WOOD[3]);
  g.rect(3, 32, 2, 2, WOOD[0]);
  g.rect(27, 32, 2, 2, WOOD[0]);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const x = 4 + c * 6.5;
      const y = 11 + r * 5;
      g.rect(x, y, 6, 4, WOOD[2]);
      g.rect(x + 1, y + 1, 4, 1, PAPER[2]);
      g.set(x + 1 + ((r + c) % 3), y + 1, INK);
      g.set(x + 3, y + 3, BRASS[1]);
    }
  }
  // One drawer left pulled out, a twist of seed in it.
  g.rect(17, 26, 7, 4, WOOD[3]);
  g.rect(18, 26, 5, 1, PAPER[1]);
  g.set(20, 25, GOLD[1]);
  // On top: a jar of seed, a paper packet, a pencil.
  g.rect(5, 2, 5, 6, GLASS[1]);
  g.rect(5, 4, 5, 4, SOIL[2]);
  g.rect(5, 1, 5, 1, WOOD[1]);
  g.rect(14, 4, 6, 4, PAPER[1]);
  g.rect(14, 4, 6, 1, PAPER[2]);
  g.set(16, 6, ROSE[1]);
  g.line(22, 7, 27, 6, GOLD[1]);
  g.set(27, 6, INK);
  g.outline(OUT);
  return g.rows();
}

// The potting bench: soil heaped on the top, pots, a trowel stuck in, a seedling half potted.
function pottingBench() {
  const g = new Grid(32, 30);
  // Legs and the shelf below with a stack of pots.
  g.rect(2, 16, 2, 14, WOOD[1]);
  g.rect(28, 16, 2, 14, WOOD[1]);
  g.rect(2, 24, 28, 2, WOOD[2]);
  for (let i = 0; i < 3; i++) {
    g.rect(6 + i, 20 - i * 1, 7, 4, TERRA[1]);
    g.rect(6 + i, 20 - i * 1, 7, 1, TERRA[2]);
  }
  g.rect(18, 20, 8, 4, SACK[1]);
  g.rect(18, 20, 8, 1, SACK[2]);
  // The top, with a back board.
  g.rect(1, 13, 30, 3, WOOD[2]);
  g.rect(1, 13, 30, 1, WOOD[3]);
  g.rect(1, 4, 2, 10, WOOD[1]);
  g.rect(29, 4, 2, 10, WOOD[1]);
  g.rect(1, 4, 30, 2, WOOD[1]);
  // A heap of soil, the trowel stuck in it.
  g.oval(9, 12, 6, 2, SOIL[1]);
  g.oval(9, 11, 4, 1, SOIL[2]);
  g.line(11, 10, 13, 5, IRON[2]);
  g.rect(13, 3, 2, 3, WOOD[2]);
  // A pot with a seedling going in.
  g.rect(19, 8, 6, 5, TERRA[1]);
  g.rect(18, 7, 8, 2, TERRA[2]);
  g.rect(19, 7, 6, 1, SOIL[1]);
  g.line(22, 6, 22, 3, GREEN[1]);
  g.oval(20, 3, 1, 0, GREEN[2]);
  g.oval(24, 2, 1, 0, GREEN[2]);
  // Little pots in a row at the end.
  g.rect(27, 10, 3, 3, TERRA[1]);
  g.rect(4, 10, 3, 3, TERRA[1]);
  g.outline(OUT);
  return g.rows();
}

// The wax pot on its little brick stove, embers under it, a ladle in the wax.
function waxVat() {
  const g = new Grid(16, 26);
  g.rect(1, 14, 14, 12, BRICK[1]);
  g.rect(1, 14, 14, 1, BRICK[2]);
  for (let y = 17; y < 26; y += 3) g.rect(1, y, 14, 1, BRICK[0]);
  g.rect(4, 19, 8, 5, '#120c10');
  g.rect(5, 22, 6, 2, FIRE[0]);
  g.set(6, 22, FIRE[1]);
  g.set(9, 21, FIRE[1]);
  g.set(8, 22, FIRE[2]);
  // The pot.
  g.rect(2, 6, 12, 8, COPPER[1]);
  g.rect(2, 6, 12, 1, COPPER[3]);
  g.rect(3, 7, 2, 6, COPPER[2]);
  g.rect(3, 6, 10, 1, WAX[2]);
  g.rect(11, 7, 1, 3, WAX[1]);
  // The ladle handle leaning out.
  g.line(10, 6, 14, 1, WOOD[2]);
  g.outline(OUT);
  return g.rows();
}

// A pot of hot wax on its brick stove and a tub of cold water: dip, cool, dip again.
function dippingVats() {
  const g = new Grid(32, 26);
  // The wax side, as the vat.
  g.rect(1, 14, 14, 12, BRICK[1]);
  g.rect(1, 14, 14, 1, BRICK[2]);
  for (let y = 17; y < 26; y += 3) g.rect(1, y, 14, 1, BRICK[0]);
  g.rect(4, 19, 8, 5, '#120c10');
  g.rect(5, 22, 6, 2, FIRE[0]);
  g.set(6, 22, FIRE[1]);
  g.set(9, 21, FIRE[1]);
  g.rect(2, 4, 12, 10, COPPER[1]);
  g.rect(2, 4, 12, 1, COPPER[3]);
  g.rect(3, 5, 2, 8, COPPER[2]);
  g.rect(3, 4, 10, 1, WAX[2]);
  // The water tub: staves and two iron hoops.
  g.rect(17, 10, 14, 16, WOOD[2]);
  for (let x = 19; x < 31; x += 3) g.rect(x, 10, 1, 16, WOOD[1]);
  g.rect(17, 13, 14, 1, IRON[1]);
  g.rect(17, 22, 14, 1, IRON[1]);
  g.rect(18, 10, 12, 1, '#4a7a96');
  g.set(21, 10, '#d8f0fa');
  g.set(26, 10, '#d8f0fa');
  g.outline(OUT);
  return g.rows();
}

// The dipping rack: two posts with feet, a crossbar, pegs along it, candles hung in pairs by
// their wicks, some dipped thick and some still thin.
function dippingRack() {
  const g = new Grid(32, 36);
  g.rect(2, 4, 2, 31, WOOD[1]);
  g.rect(28, 4, 2, 31, WOOD[1]);
  g.rect(0, 34, 6, 2, WOOD[0]);
  g.rect(26, 34, 6, 2, WOOD[0]);
  g.rect(1, 3, 30, 3, WOOD[2]);
  g.rect(1, 3, 30, 1, WOOD[3]);
  // Pairs of candles hung over each peg on one wick, a long candle each side.
  const pairs = [[8, 12], [14, 9], [20, 14], [25, 7]];
  for (const [x, len] of pairs) {
    g.rect(x, 6, 1, 2, WOOD[0]);
    g.line(x - 2, 8, x + 2, 8, WAX[0]);
    g.rect(x - 2, 9, 2, len, WAX[1]);
    g.rect(x + 1, 9, 2, len, WAX[1]);
    g.set(x - 2, 9 + len - 1, WAX[2]);
    g.set(x + 1, 9 + len - 1, WAX[2]);
    g.rect(x - 2, 9, 1, len - 1, WAX[2]);
  }
  // A drip tray on the floor under them.
  g.rect(5, 30, 22, 2, IRON[2]);
  g.rect(5, 30, 22, 1, IRON[3]);
  g.set(12, 29, WAX[2]);
  g.set(20, 29, WAX[2]);
  g.outline(OUT);
  return g.rows();
}

// A crate of pale wax cakes.
function waxCrate() {
  const g = new Grid(16, 20);
  g.rect(1, 9, 14, 11, WOOD[2]);
  g.rect(1, 9, 14, 1, WOOD[3]);
  g.rect(1, 14, 14, 1, WOOD[1]);
  g.line(1, 10, 14, 19, WOOD[1]);
  for (const [x, y] of [[2, 6], [8, 6], [4, 3], [10, 4]]) {
    g.rect(x, y, 5, 3, WAX[1]);
    g.rect(x, y, 5, 1, WAX[2]);
    g.set(x + 4, y + 2, WAX[0]);
  }
  g.outline(OUT);
  return g.rows();
}

// The cot: a low wooden box like a seedling tray (slatted sides, drainage holes), a sacking
// mattress, a patched quilt in greens, and a plant label stuck in at the head.
function cot() {
  const g = new Grid(32, 22);
  // The label at the head.
  g.rect(3, 1, 4, 6, PALE_WOOD[2]);
  g.line(4, 3, 5, 3, INK);
  g.line(4, 5, 6, 5, INK);
  g.rect(4, 7, 2, 4, PALE_WOOD[1]);
  // The box.
  g.rect(1, 9, 30, 11, PALE_WOOD[1]);
  g.rect(1, 9, 30, 1, PALE_WOOD[2]);
  g.rect(1, 19, 30, 1, PALE_WOOD[0]);
  for (let x = 4; x < 30; x += 5) g.set(x, 17, WOOD[0]);
  g.rect(2, 20, 2, 2, WOOD[1]);
  g.rect(28, 20, 2, 2, WOOD[1]);
  // The pillow and the quilt, in patches.
  g.rect(2, 7, 7, 4, WHITE[1]);
  g.rect(2, 7, 7, 1, WHITE[2]);
  const patches = [QUILT[0], QUILT[1], QUILT[2], QUILT[1], QUILT[3], QUILT[0]];
  for (let i = 0; i < 6; i++) {
    g.rect(9 + i * 3.6, 7, 4, 3, patches[i]);
    g.rect(9 + i * 3.6, 10, 4, 2, patches[(i + 2) % 6]);
  }
  g.rect(9, 7, 21, 1, QUILT[4]);
  g.rect(9, 12, 21, 1, PALE_WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

// A three-legged stool.
function stool() {
  const g = new Grid(16, 16);
  g.line(4, 15, 6, 8, WOOD[1]);
  g.line(12, 15, 10, 8, WOOD[1]);
  g.rect(7, 10, 2, 6, WOOD[0]);
  g.rect(3, 7, 10, 2, WOOD[2]);
  g.rect(3, 7, 10, 1, WOOD[3]);
  g.outline(OUT);
  return g.rows();
}

// A garden trug: a shallow basket with a handle, gloves and a trowel in it.
function trug() {
  const g = new Grid(16, 16);
  g.line(2, 8, 8, 2, PALE_WOOD[1]);
  g.line(8, 2, 14, 8, PALE_WOOD[1]);
  g.rect(1, 9, 14, 5, PALE_WOOD[1]);
  g.rect(1, 9, 14, 1, PALE_WOOD[2]);
  for (let x = 3; x < 15; x += 3) g.rect(x, 10, 1, 4, PALE_WOOD[0]);
  g.rect(3, 7, 4, 3, ROSE[1]);
  g.rect(4, 6, 1, 1, ROSE[1]);
  g.line(9, 8, 13, 6, IRON[2]);
  g.rect(13, 5, 2, 2, WOOD[2]);
  g.outline(OUT);
  return g.rows();
}

// Two sacks, one rolled open on a heap of bulbs.
function sacks() {
  const g = new Grid(16, 22);
  g.oval(5, 13, 4, 7, SACK[1]);
  g.rect(3, 4, 4, 3, SACK[1]);
  g.rect(2, 6, 6, 1, ROPE[1]);
  g.set(3, 12, SACK[2]);
  g.set(4, 10, SACK[2]);
  g.oval(11, 16, 4, 5, SACK[2]);
  g.rect(7, 11, 9, 2, SACK[0]);
  for (const [x, y] of [[9, 11], [11, 10], [13, 11], [10, 12], [12, 12]]) {
    g.oval(x, y, 1, 1, '#b08a5a');
    g.set(x, y - 2, GREEN[2]);
  }
  g.rect(0, 20, 16, 2, null);
  g.outline(OUT);
  return g.rows();
}

// A counter (as `counter`): with or without a seed cake on a wire rack, a candle-mould loaf.
function counterTop(withCake) {
  const g = new Grid(16, 26);
  g.rect(0, 8, 16, 2, '#ece4d4');
  g.rect(0, 10, 16, 2, '#8a8296');
  g.rect(1, 12, 14, 13, '#8a5a32');
  g.rect(7, 12, 1, 13, '#5a3a1e');
  g.set(5, 17, BRASS[1]);
  g.set(9, 17, BRASS[1]);
  if (withCake) {
    g.rect(2, 7, 12, 1, IRON[2]);
    g.set(3, 8, IRON[1]);
    g.set(12, 8, IRON[1]);
    // A tall round loaf, ribbed like the tin it came out of, seeds on the top.
    g.rect(4, 0, 8, 7, '#8a5a2a');
    g.rect(4, 0, 8, 1, '#b07a3a');
    for (let x = 5; x < 12; x += 2) g.rect(x, 1, 1, 6, '#6a4220');
    g.set(6, 0, '#e8d8a8');
    g.set(9, 0, '#e8d8a8');
    g.set(11, 0, '#2a2018');
  }
  g.outline(OUT);
  return g.rows();
}

// A stone sink on a cupboard, a pump spout over it, a pail on the floor beside.
function sink() {
  const g = new Grid(16, 30);
  g.rect(1, 16, 14, 13, '#8a5a32');
  g.rect(7, 16, 1, 13, '#5a3a1e');
  g.rect(0, 12, 16, 4, STONE[2]);
  g.rect(0, 12, 16, 1, STONE[3]);
  g.rect(2, 12, 12, 2, STONE[0]);
  // The pump: a post at the back, the spout, the handle up.
  g.rect(10, 2, 3, 10, IRON[1]);
  g.rect(10, 2, 3, 1, IRON[2]);
  g.rect(6, 4, 4, 2, IRON[1]);
  g.line(12, 2, 15, 0, IRON[2]);
  g.set(6, 7, '#7fb0c8');
  g.outline(OUT);
  return g.rows();
}

// The iron stove with a soup pot on it, a wisp over the lid.
function soupStove() {
  const g = new Grid(16, 30);
  g.rect(1, 13, 14, 16, '#5a5468');
  g.rect(1, 13, 14, 2, '#8a8296');
  g.rect(3, 19, 10, 6, '#3a3446');
  g.rect(4, 21, 8, 3, FIRE[0]);
  g.set(6, 22, FIRE[1]);
  g.set(9, 22, FIRE[2]);
  g.rect(7, 1, 2, 4, '#5a5468');
  // The pot.
  g.rect(3, 6, 10, 7, IRON[1]);
  g.rect(3, 6, 10, 1, IRON[2]);
  g.rect(4, 5, 8, 1, IRON[2]);
  g.rect(7, 4, 2, 1, IRON[3]);
  g.set(2, 8, IRON[1]);
  g.set(13, 8, IRON[1]);
  g.outline(OUT);
  return g.rows();
}

// A cold frame: a low box, the glass lid propped open on a stick, rows of seedlings inside.
function coldFrame() {
  const g = new Grid(32, 22);
  // The lid, propped up at the back.
  g.rect(1, 2, 30, 7, PALE_WOOD[1]);
  g.rect(2, 3, 13, 5, GLASS[2]);
  g.rect(17, 3, 13, 5, GLASS[2]);
  for (let i = 0; i < 4; i++) g.set(4 + i, 7 - i, GLASS[3]);
  g.line(27, 9, 27, 13, WOOD[2]);
  // The box.
  g.rect(1, 12, 30, 9, PALE_WOOD[1]);
  g.rect(1, 12, 30, 1, PALE_WOOD[2]);
  g.rect(2, 10, 28, 2, SOIL[1]);
  for (let x = 4; x < 29; x += 4) {
    g.line(x, 11, x, 8, GREEN[1]);
    g.set(x - 1, 8, GREEN[2]);
    g.set(x + 1, 9, GREEN[2]);
  }
  for (let x = 6; x < 30; x += 7) g.rect(x, 13, 1, 7, PALE_WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

// Staging: two tiers of slats with seedling pots; at the end, six clean pots upturned.
function staging() {
  const g = new Grid(32, 32);
  g.rect(1, 6, 2, 26, WOOD[1]);
  g.rect(29, 6, 2, 26, WOOD[1]);
  g.rect(15, 18, 2, 14, WOOD[1]);
  const tier = (y) => {
    g.rect(1, y, 30, 2, PALE_WOOD[1]);
    g.rect(1, y, 30, 1, PALE_WOOD[2]);
    for (let x = 4; x < 30; x += 4) g.set(x, y + 1, PALE_WOOD[0]);
  };
  tier(10);
  tier(22);
  // The top tier: seedlings in pots, all leaning the same way.
  for (const x of [3, 9, 15, 21]) {
    g.rect(x, 6, 5, 4, TERRA[1]);
    g.rect(x, 6, 5, 1, TERRA[2]);
    g.line(x + 2, 6, x + 4, 2, GREEN[1]);
    g.set(x + 4, 1, GREEN[2]);
    g.set(x + 3, 3, GREEN[2]);
  }
  // Six clean pots, upside down, stacked in twos at the end of the bottom tier.
  for (const x of [18, 22, 26]) {
    g.rect(x, 18, 3, 4, TERRA[2]);
    g.rect(x - 1 + 1, 14, 3, 4, TERRA[2]);
    g.rect(x, 21, 3, 1, TERRA[0]);
    g.rect(x, 17, 3, 1, TERRA[0]);
  }
  // A watering rose and a sack under the bottom tier's left half.
  g.rect(4, 17, 8, 5, '#7fb0c8');
  g.rect(4, 17, 8, 1, '#d8f0fa');
  g.line(11, 18, 14, 15, '#4a7a96');
  g.outline(OUT);
  return g.rows();
}

export const TH_PROP_SPRITES = {
  th_drying_rail: pegRail([bunch(LAV), bunch(GOLD), wickHank, bunch(ROSE)]),
  th_herb_rail: pegRail([herbs, ladle, herbs, sieve]),
  th_sconce: sconce(),
  th_wick_board: wickBoard(),
  th_mould_shelf: plankShelf('moulds'),
  th_jar_shelf: plankShelf('jars'),
  th_glass_panes: glassPanes(),
  th_frost_slate: frostSlate(),
  th_hearth: hearth(0),
  th_hearth_cold: hearth(null),
  th_seed_drawers: seedDrawers(),
  th_potting_bench: pottingBench(),
  th_wax_vat: waxVat(),
  th_dipping_vats: dippingVats(),
  th_dipping_rack: dippingRack(),
  th_wax_crate: waxCrate(),
  th_cot: cot(),
  th_stool: stool(),
  th_trug: trug(),
  th_sacks: sacks(),
  th_cake_counter: counterTop(true),
  th_counter: counterTop(false),
  th_sink: sink(),
  th_soup_stove: soupStove(),
  th_cold_frame: coldFrame(),
  th_staging: staging(),
};

// The hearth's fire, three frames (put the th_hearth animation on the th_hearth prop).
export const TH_HEARTH_SPRITES = {
  flicker1: hearth(0),
  flicker2: hearth(1),
  flicker3: hearth(2),
};

// The colours the rows above use (on private characters), for PROP_PALETTE and the animation.
export const TH_PALETTE_EXTRA = palette;
export const TH_HEARTH_PALETTE = palette;

// How many tiles wide each big one stands.
export const TH_FOOTPRINTS = {
  th_drying_rail: 2,
  th_herb_rail: 2,
  th_wick_board: 2,
  th_mould_shelf: 2,
  th_jar_shelf: 2,
  th_glass_panes: 2,
  th_hearth: 3,
  th_hearth_cold: 3,
  th_seed_drawers: 2,
  th_potting_bench: 2,
  th_dipping_vats: 2,
  th_dipping_rack: 2,
  th_cot: 2,
  th_cold_frame: 2,
  th_staging: 2,
};

// What glows (from the middle of the prop's foot, up is negative).
const FIRELIGHT = '255, 128, 48';
const CANDLE = '255, 180, 92';
export const TH_GLOWS = {
  th_hearth: [
    { dy: -14, bloom: 18, strength: 0.6, flicker: 1, color: FIRELIGHT },
    { dy: 8, pool: 72, strength: 0.55, flicker: 0.7, color: FIRELIGHT },
  ],
  th_sconce: [
    { dy: -36, bloom: 8, strength: 0.6, flicker: 0.5, color: CANDLE },
    { dy: 8, pool: 46, strength: 0.4, flicker: 0.3, color: CANDLE },
  ],
  th_wax_vat: [
    { dy: -6, bloom: 6, strength: 0.4, flicker: 0.8, color: FIRELIGHT },
    { dy: 2, pool: 34, strength: 0.32, flicker: 0.6, color: FIRELIGHT },
  ],
  th_dipping_vats: [
    { dx: -8, dy: -6, bloom: 6, strength: 0.4, flicker: 0.8, color: FIRELIGHT },
    { dx: -8, dy: 2, pool: 36, strength: 0.34, flicker: 0.6, color: FIRELIGHT },
  ],
  th_soup_stove: [{ dy: -6, pool: 34, strength: 0.3, flicker: 0.5, color: FIRELIGHT }],
  th_glass_panes: [
    { dy: -14, bloom: 12, strength: 0.22, flicker: 0, color: '220, 236, 230' },
    { dy: 16, pool: 50, strength: 0.34, flicker: 0, color: '220, 236, 230' },
  ],
};
