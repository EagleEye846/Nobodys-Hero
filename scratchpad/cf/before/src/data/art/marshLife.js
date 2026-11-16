// Life-pass props for chapter 3's Old Drains and Lantern Marsh (15 November 2026): the small, lived-in
// things that make the brick drains and the misty fen look like somewhere people worked and left.
// Drawn like lanesLife.js: rows of characters from a small painter, 16 pixels to a tile, standing on
// the bottom edge and centred over their footprint. Every id starts `r3m_`. Nothing hangs in the air:
// every lamp, coat, chain and line has its peg, hook or post.
//
//   Drains:  r3m_g_* (chalk words and doodles on the wall: walt, head, sweet, damp, tea, count, mab, down,
//            tally, face, rat, fish, marks), r3m_pipe, r3m_peg_coat, r3m_peg_cap, r3m_bracket_lamp,
//            r3m_bricks, r3m_mortar, r3m_rat_nest, r3m_mug, r3m_fungus, r3m_saucer, r3m_boot,
//            r3m_shelf (lost property), r3m_chain, r3m_spare_wheel, r3m_toolbox, r3m_sieve, r3m_beetle_tin
//   Marsh:   r3m_cart (sunk), r3m_wheel, r3m_post (old lantern post), r3m_post_cracked, r3m_punt,
//            r3m_eel_trap, r3m_decoy, r3m_boot_mud, r3m_cattails (animated), r3m_reeds (animated),
//            r3m_cotton, r3m_toadstools, r3m_stump, r3m_rod, r3m_bell_post, r3m_milestone, r3m_column,
//            r3m_head, r3m_bones, r3m_barrel, r3m_stepstones, r3m_nest, r3m_fingerpost, r3m_washline,
//            r3m_dock_post, r3m_feather, r3m_herbs, r3m_jars, r3m_rack, r3m_basket, r3m_slate,
//            r3m_chair_leg, r3m_strips_bundle, r3m_oil_tin, r3m_hat_pole, r3m_heron_sign

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xb400 + colors.size);
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

  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
  }

  line(x0, y0, x1, y1, c) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) this.set(x0 + ((x1 - x0) * i) / steps, y0 + ((y1 - y0) * i) / steps, c);
  }

  disc(cx, cy, rx, ry, c) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) this.set(x, y, c);
      }
    }
  }

  outline(c = INK) {
    const at = (x, y) => x >= 0 && y >= 0 && x < this.w && y < this.h && this.cells[y][x];
    const pts = [];
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      if (!at(x, y) && (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1))) pts.push([x, y]);
    }
    for (const [x, y] of pts) this.set(x, y, c);
    return this;
  }

  rows() {
    return this.cells.map((row) => row.map((c) => (c ? char(c) : '.')).join(''));
  }
}

const frames = (fn, n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`f${i + 1}`, fn(i)]));
const INK = '#10141a';
const WOOD = ['#2a2018', '#46362a', '#665038', '#8a7050', '#b09468'];
const BRICK = ['#2e2022', '#4a3434', '#664a42', '#82604e', '#9a7a62'];
const IRON = ['#1e2226', '#363c46', '#566070', '#7c8898'];
const RUST = ['#4a2a1a', '#7a4426', '#a8622e'];
const MOSS = ['#1e3226', '#2e4a34', '#46684a', '#6c9468'];
const FEN = ['#222a24', '#343e34', '#4a5640', '#667258', '#8a9672'];
const MUD = ['#1a1814', '#2c2820', '#403a2e', '#5a523e'];
const CHALK = '#e2dccb';
const CHALK_D = '#b4ae9c';
const CREAM = ['#a09880', '#c8bfa4', '#e8dfc4'];
const WATER = ['#1a3a3c', '#2a5656', '#4a8486', '#7cb4b0'];
const GLOW = ['#3a8a6a', '#7ad0a0', '#c8ffe0'];
const WARM = ['#a8641e', '#e8a22c', '#ffe284'];
const CLOTH = ['#4a2a44', '#6e4468', '#946890'];
const RED = ['#5a2420', '#8a3a2e', '#b85c44'];

// A tiny 3x5 chalk alphabet, for the workers' scrawl on the walls.
const FONT = {
  A: ['010', '101', '111', '101', '101'], B: ['110', '101', '110', '101', '110'], C: ['011', '100', '100', '100', '011'],
  D: ['110', '101', '101', '101', '110'], E: ['111', '100', '110', '100', '111'], F: ['111', '100', '110', '100', '100'],
  G: ['011', '100', '101', '101', '011'], H: ['101', '101', '111', '101', '101'], I: ['111', '010', '010', '010', '111'],
  J: ['001', '001', '001', '101', '010'], K: ['101', '101', '110', '101', '101'], L: ['100', '100', '100', '100', '111'],
  M: ['101', '111', '111', '101', '101'], N: ['110', '101', '101', '101', '101'], O: ['010', '101', '101', '101', '010'],
  P: ['110', '101', '110', '100', '100'], Q: ['010', '101', '101', '110', '011'], R: ['110', '101', '110', '101', '101'],
  S: ['011', '100', '010', '001', '110'], T: ['111', '010', '010', '010', '010'], U: ['101', '101', '101', '101', '111'],
  V: ['101', '101', '101', '101', '010'], W: ['101', '101', '111', '111', '101'], X: ['101', '101', '010', '101', '101'],
  Y: ['101', '101', '010', '010', '010'], Z: ['111', '001', '010', '100', '111'],
  0: ['111', '101', '101', '101', '111'], 1: ['010', '110', '010', '010', '111'], 2: ['110', '001', '010', '100', '111'],
  3: ['110', '001', '010', '001', '110'], 4: ['101', '101', '111', '001', '001'], 5: ['111', '100', '110', '001', '110'],
  6: ['011', '100', '110', '101', '010'], 7: ['111', '001', '010', '010', '010'], 8: ['010', '101', '010', '101', '010'],
  9: ['010', '101', '011', '001', '110'], '!': ['010', '010', '010', '000', '010'], '.': ['000', '000', '000', '000', '010'],
  '-': ['000', '000', '111', '000', '000'], '+': ['000', '010', '111', '010', '000'], '?': ['110', '001', '010', '000', '010'],
  ' ': ['000', '000', '000', '000', '000'],
};

// Chalk words on bare wall: `lines` of text, each starting at its x offset, in a w by h sprite.
function chalkText(lines, w = 32, h = 16, color = CHALK) {
  const g = new Grid(w, h);
  lines.forEach(([text, x0, y0], li) => {
    let x = x0;
    for (const ch of text) {
      const glyph = FONT[ch] ?? FONT[' '];
      glyph.forEach((row, ry) => [...row].forEach((bit, rx) => { if (bit === '1') g.set(x + rx, y0 + ry, (li + rx + ry) % 7 === 0 ? CHALK_D : color); }));
      x += 4;
    }
  });
  return g;
}

// ---------------------------------------------------------------------------------------------
// THE OLD DRAINS

const grafWalt = () => { const g = chalkText([['WALT', 3, 3], ['WOZ ERE', 2, 9]]); g.line(23, 4, 28, 4, CHALK_D); return g.rows(); };
const grafHead = () => { const g = chalkText([['MIND', 8, 2], ['YR HEAD', 2, 9]]); g.line(1, 8, 30, 8, CHALK_D); return g.rows(); };
const grafSweet = () => { const g = chalkText([['KEEP IT', 2, 3], ['SWEET', 8, 9]]); g.line(2, 8, 30, 8, CHALK_D); return g.rows(); };
const grafDamp = () => { const g = chalkText([['DAMP', 8, 3], ['AGAIN', 6, 9]]); g.set(27, 4, CHALK); g.set(26, 5, CHALK); g.set(27, 5, CHALK); return g.rows(); };
const grafTea = () => { const g = chalkText([['TEA', 2, 2], ['FOUR', 14, 9]]); g.disc(25, 5, 3, 2, CHALK_D); g.line(22, 5, 28, 5, CHALK); g.line(28, 4, 30, 4, CHALK); g.line(30, 4, 30, 6, CHALK); return g.rows(); };
const grafCount = () => { const g = chalkText([['DAY 41', 3, 2]]); for (let k = 0; k < 4; k++) g.rect(3 + k * 3, 9, 1, 5, CHALK); g.line(2, 13, 12, 9, CHALK); g.rect(15, 9, 1, 5, CHALK); g.rect(18, 9, 1, 5, CHALK); g.rect(21, 9, 1, 5, CHALK); g.rect(24, 9, 1, 5, CHALK); g.line(14, 13, 25, 9, CHALK); return g.rows(); };
const grafMab = () => { const g = chalkText([['MAB', 2, 3], ['SAYS', 14, 3], ['NO', 2, 9]]); g.line(13, 11, 28, 11, CHALK_D); return g.rows(); };
const grafDown = () => { const g = chalkText([['WELL', 3, 2], ['IS UP', 11, 9]]); g.line(18, 7, 18, 2, CHALK); g.line(16, 4, 18, 2, CHALK); g.line(20, 4, 18, 2, CHALK); return g.rows(); };

// A tally scratched in tens, one stroke over each group.
function grafTally() {
  const g = new Grid(16, 16);
  for (let r = 0; r < 2; r++) {
    for (let k = 0; k < 4; k++) g.rect(2 + k * 3, 3 + r * 7, 1, 5, CHALK);
    g.line(1, 7 + r * 7, 12, 4 + r * 7, CHALK_D);
  }
  g.rect(13, 3, 1, 5, CHALK); g.rect(13, 10, 1, 5, CHALK_D);
  return g.rows();
}

// A round, grinning face under a miner's cap, drawn by someone bored.
function grafFace() {
  const g = new Grid(16, 16);
  g.disc(8, 8, 5, 5, null); for (let a = 0; a < 24; a++) g.set(8 + Math.round(Math.cos(a / 3.8) * 5), 8 + Math.round(Math.sin(a / 3.8) * 5), CHALK);
  g.set(6, 6, CHALK); g.set(10, 6, CHALK); g.line(5, 10, 6, 11, CHALK); g.line(6, 11, 10, 11, CHALK); g.line(10, 11, 11, 10, CHALK);
  g.line(3, 4, 13, 4, CHALK_D); g.line(5, 2, 11, 2, CHALK_D); g.line(5, 2, 3, 4, CHALK_D); g.line(11, 2, 13, 4, CHALK_D);
  return g.rows();
}

// A rat, chalked, with a very long tail and a speech mark.
function grafRat() {
  const g = new Grid(16, 16);
  g.disc(7, 10, 4, 2, CHALK); g.disc(7, 10, 3, 1, null); g.set(11, 9, CHALK); g.set(12, 10, CHALK); g.set(11, 8, CHALK); g.set(10, 8, CHALK);
  g.set(5, 9, CHALK); g.set(5, 11, CHALK); g.set(9, 11, CHALK); g.set(8, 11, CHALK);
  for (let i = 0; i < 8; i++) g.set(3 - i * 0.4, 11 + Math.sin(i) * 1.4, CHALK_D);
  g.rect(13, 3, 1, 3, CHALK); g.set(13, 7, CHALK);
  return g.rows();
}

// A fish, chalked, all bones. The drains have never had a fish.
function grafFish() {
  const g = new Grid(16, 16);
  g.line(2, 8, 12, 8, CHALK); g.line(12, 8, 14, 6, CHALK); g.line(12, 8, 14, 10, CHALK); g.line(14, 6, 14, 10, CHALK);
  for (let k = 0; k < 4; k++) { g.line(4 + k * 2, 8, 5 + k * 2, 5, CHALK_D); g.line(4 + k * 2, 8, 5 + k * 2, 11, CHALK_D); }
  g.set(3, 7, CHALK); g.line(1, 7, 2, 8, CHALK); g.line(1, 9, 2, 8, CHALK);
  return g.rows();
}

// Water-level ticks up the wall, each higher than the last, and a wavering line.
function grafMarks() {
  const g = new Grid(16, 16);
  g.rect(3, 2, 1, 13, CHALK_D);
  for (let k = 0; k < 5; k++) g.rect(3, 13 - k * 3, k % 2 ? 5 : 3, 1, CHALK);
  for (let x = 0; x < 16; x++) g.set(x, 6 + Math.round(Math.sin(x / 2) * 0.8), '#5a8a8a');
  g.set(10, 2, CHALK); g.set(11, 3, CHALK); g.set(12, 2, CHALK);
  return g.rows();
}

// A rusted iron pipe run along the wall with two flanges, a damp stain and a green beard under one.
function pipe() {
  const g = new Grid(32, 16);
  g.rect(0, 5, 32, 5, IRON[1]); g.rect(0, 5, 32, 1, IRON[3]); g.rect(0, 9, 32, 1, IRON[0]);
  for (const x of [7, 22]) { g.rect(x, 3, 3, 9, IRON[2]); g.rect(x, 3, 1, 9, IRON[3]); g.set(x + 1, 4, IRON[0]); g.set(x + 1, 10, IRON[0]); }
  for (let x = 2; x < 30; x += 5) { g.set(x, 6, RUST[1]); g.set(x + 1, 7, RUST[2]); }
  g.rect(8, 11, 1, 4, MOSS[1]); g.rect(9, 11, 1, 6, MOSS[2]); g.rect(23, 11, 1, 3, MOSS[1]); g.set(23, 14, WATER[3]);
  return g.outline().rows();
}

// A peg in the wall, an oilskin coat hung on it, still dripping a little.
function pegCoat() {
  const g = new Grid(16, 24);
  g.rect(7, 3, 3, 2, WOOD[3]); g.rect(7, 3, 3, 1, WOOD[4]);
  g.rect(4, 5, 9, 14, '#4a4a2a'); g.rect(4, 5, 2, 14, '#34341e'); g.rect(11, 5, 2, 14, '#34341e'); g.rect(6, 5, 5, 3, '#5e5e3a');
  g.line(8, 8, 8, 18, '#34341e'); g.set(8, 11, WOOD[3]); g.set(8, 14, WOOD[3]); g.rect(3, 9, 2, 8, '#4a4a2a'); g.rect(12, 9, 2, 8, '#4a4a2a');
  g.rect(6, 19, 1, 2, WATER[3]); g.set(10, 21, WATER[2]);
  return g.outline().rows();
}

// A peg with a flat cap and a miner's candle tin on it.
function pegCap() {
  const g = new Grid(16, 24);
  g.rect(7, 3, 3, 2, WOOD[3]); g.rect(7, 3, 3, 1, WOOD[4]);
  g.rect(3, 6, 10, 3, '#5a4a3a'); g.rect(4, 5, 8, 1, '#6e5a46'); g.rect(10, 8, 5, 1, '#3a2e24'); g.rect(3, 6, 10, 1, '#6e5a46');
  g.line(5, 7, 9, 7, '#3a2e24');
  g.rect(6, 12, 5, 6, IRON[2]); g.rect(6, 12, 5, 1, IRON[3]); g.rect(7, 10, 3, 2, CREAM[2]); g.set(8, 9, WARM[1]);
  g.rect(7, 18, 3, 1, IRON[0]);
  g.line(8, 5, 8, 12, IRON[1]);
  return g.outline().rows();
}

// An iron bracket bolted to the wall with a hooded lantern, lit low.
function bracketLamp() {
  const g = new Grid(16, 24);
  g.rect(6, 14, 4, 8, IRON[1]); g.rect(6, 14, 1, 8, IRON[3]); g.rect(4, 20, 8, 2, IRON[2]);
  g.rect(3, 4, 10, 2, IRON[2]); g.rect(4, 3, 8, 1, IRON[3]); g.rect(4, 6, 8, 9, IRON[0]);
  g.rect(5, 7, 6, 7, WARM[0]); g.rect(6, 8, 4, 5, WARM[1]); g.rect(7, 9, 2, 3, WARM[2]);
  g.rect(4, 6, 1, 9, IRON[3]); g.rect(11, 6, 1, 9, IRON[3]); g.rect(7, 1, 2, 2, IRON[3]);
  return g.outline().rows();
}

// Spare bricks stacked, a trowel stuck in the top, mortar on everything.
function bricks() {
  const g = new Grid(16, 16);
  for (const [y, n] of [[12, 4], [9, 3], [6, 2]]) for (let k = 0; k < n; k++) {
    const x = 2 + k * 4 + (y === 9 ? 2 : 0);
    g.rect(x, y, 4, 3, BRICK[3]); g.rect(x, y, 4, 1, BRICK[4]); g.rect(x, y + 2, 4, 1, BRICK[1]); g.set(x + 3, y + 1, CREAM[0]);
  }
  g.line(11, 1, 10, 7, IRON[3]); g.rect(11, 0, 2, 2, WOOD[3]); g.rect(8, 7, 4, 1, IRON[2]);
  return g.outline().rows();
}

// A bucket of mortar gone to stone, with the brush still in it.
function mortar() {
  const g = new Grid(16, 16);
  g.rect(3, 6, 10, 9, WOOD[2]); g.rect(3, 6, 2, 9, WOOD[1]); g.rect(11, 6, 2, 9, WOOD[1]); g.rect(7, 6, 2, 9, WOOD[3]);
  g.rect(3, 8, 10, 1, IRON[2]); g.rect(3, 12, 10, 1, IRON[2]); g.rect(4, 5, 8, 2, CREAM[0]); g.rect(5, 5, 4, 1, CREAM[1]);
  g.line(10, 1, 9, 6, WOOD[4]); g.rect(9, 0, 3, 2, '#a89c84');
  return g.outline().rows();
}

// A rats' nest: shredded paper, one button, a thimble and a doll's shoe.
function ratNest() {
  const g = new Grid(16, 16);
  g.disc(8, 11, 6, 3, '#6e6450'); g.disc(8, 10, 5, 2, '#8a8068'); g.disc(8, 10, 3, 1, '#a89c84');
  for (let k = 0; k < 8; k++) g.set(3 + k * 1.5, 8 + (k % 3), CREAM[1]);
  g.rect(4, 9, 2, 2, '#c8a838'); g.set(4, 9, WARM[2]);
  g.rect(10, 8, 2, 2, IRON[3]); g.set(10, 8, CREAM[2]);
  g.rect(7, 7, 3, 2, RED[2]); g.set(7, 8, RED[1]);
  g.set(6, 12, '#3a3226'); g.set(9, 12, '#3a3226');
  return g.outline().rows();
}

// A dented tin mug with a candle stub in it, never lit.
function mug() {
  const g = new Grid(16, 16);
  g.rect(4, 8, 7, 7, IRON[2]); g.rect(4, 8, 1, 7, IRON[3]); g.rect(10, 8, 1, 7, IRON[1]); g.rect(4, 14, 7, 1, IRON[0]);
  g.rect(11, 10, 3, 1, IRON[2]); g.rect(13, 10, 1, 3, IRON[2]); g.rect(11, 12, 3, 1, IRON[2]);
  g.rect(6, 4, 3, 4, CREAM[2]); g.set(7, 3, INK); g.set(7, 2, RUST[1]);
  g.rect(5, 8, 5, 1, WATER[1]);
  return g.outline().rows();
}

// Pale fungus out of a crack at the foot of a wall: it has never seen the sun.
function fungus() {
  const g = new Grid(16, 16);
  g.line(3, 14, 5, 10, BRICK[0]); g.line(5, 10, 4, 7, BRICK[0]);
  for (const [x, y, r] of [[5, 12, 3], [10, 13, 2], [8, 10, 2], [12, 11, 2]]) {
    g.rect(x, y, 1, 3, '#c8c4b0'); g.disc(x, y - 1, r, 1.4, '#e8e4d0'); g.set(x - 1, y - 1, '#ffffff');
  }
  g.rect(2, 15, 12, 1, MOSS[0]);
  return g.outline('#2a2a30').rows();
}

// A saucer of milk on a step with a spoon laid beside it, for whoever keeps the water sweet.
function saucer() {
  const g = new Grid(16, 16);
  g.rect(2, 11, 12, 4, BRICK[2]); g.rect(2, 11, 12, 1, BRICK[4]);
  g.disc(7, 10, 4, 1.4, CREAM[1]); g.disc(7, 9.6, 3, 1, '#f2eee4'); g.set(6, 9, '#ffffff');
  g.line(11, 8, 13, 10, IRON[3]); g.set(11, 8, IRON[3]);
  return g.outline().rows();
}

// One wet boot on its side, a sock still in it.
function boot() {
  const g = new Grid(16, 16);
  g.rect(3, 6, 5, 8, '#4a3626'); g.rect(3, 6, 1, 8, '#6a5038'); g.rect(3, 4, 5, 3, '#3a2a1c'); g.rect(4, 3, 3, 2, '#b8b4a0'); g.set(5, 3, '#d8d4c0');
  g.rect(3, 13, 11, 2, '#2e2016'); g.rect(8, 10, 6, 4, '#4a3626'); g.rect(8, 10, 6, 1, '#6a5038');
  g.set(4, 8, CREAM[2]); g.set(6, 9, CREAM[2]); g.set(4, 10, CREAM[2]); g.set(6, 11, CREAM[2]);
  g.rect(13, 14, 2, 1, WATER[3]); g.set(2, 14, WATER[2]);
  return g.outline().rows();
}

// A shelf of lost property: a thimble, a spoon, a penny, a doll's shoe, a tag that says BOOT and a gap.
function shelf() {
  const g = new Grid(32, 24);
  g.rect(2, 9, 28, 2, WOOD[3]); g.rect(2, 9, 28, 1, WOOD[4]); g.rect(2, 11, 28, 1, WOOD[0]);
  g.rect(4, 11, 2, 7, WOOD[1]); g.rect(26, 11, 2, 7, WOOD[1]);
  g.rect(2, 20, 28, 2, WOOD[3]); g.rect(2, 20, 28, 1, WOOD[4]); g.rect(4, 22, 2, 2, WOOD[1]); g.rect(26, 22, 2, 2, WOOD[1]);
  // The top shelf.
  g.rect(5, 6, 3, 3, '#c8a838'); g.set(6, 6, WARM[2]); g.set(5, 5, '#c8a838');
  g.line(10, 6, 14, 8, IRON[3]); g.rect(14, 7, 2, 2, IRON[3]);
  g.disc(19, 7, 2, 1.4, '#a8782e'); g.set(19, 7, WARM[2]);
  g.rect(22, 6, 4, 3, RED[2]); g.rect(22, 8, 4, 1, RED[0]); g.set(26, 7, RED[0]);
  // The lower one: a button box, a candle end and the gap with its tag.
  g.rect(5, 16, 5, 4, WOOD[2]); g.set(7, 17, IRON[3]); g.set(8, 18, '#c8a838');
  g.rect(12, 15, 2, 5, CREAM[2]); g.set(12, 14, INK);
  g.rect(17, 18, 9, 2, CREAM[1]); g.rect(18, 18, 7, 1, CREAM[2]); g.set(18, 19, INK); g.set(20, 19, INK); g.set(22, 19, INK); g.set(24, 19, INK);
  g.line(21, 15, 21, 17, WOOD[4]);
  return g.outline().rows();
}

// A rusted chain from a hook, the end of it lying in the damp.
function chain() {
  const g = new Grid(16, 24);
  g.rect(6, 2, 4, 3, IRON[3]); g.rect(7, 4, 2, 2, IRON[0]);
  for (let k = 0; k < 6; k++) { g.rect(7 + (k % 2), 6 + k * 2, 2, 2, IRON[k % 2 ? 1 : 2]); g.set(7 + (k % 2), 6 + k * 2, RUST[1]); }
  g.disc(8, 20, 3, 2, IRON[1]); g.disc(8, 20, 1, 1, null); g.set(5, 21, RUST[2]);
  return g.outline().rows();
}

// A spare valve wheel leaning on the wall, waiting for a valve that wore out.
function spareWheel() {
  const g = new Grid(16, 24);
  g.disc(8, 12, 6, 6, IRON[2]); g.disc(8, 12, 4, 4, null); g.disc(8, 12, 1.6, 1.6, IRON[3]);
  g.line(8, 6, 8, 18, IRON[2]); g.line(2, 12, 14, 12, IRON[2]); g.line(4, 8, 12, 16, IRON[2]); g.line(12, 8, 4, 16, IRON[2]);
  g.set(5, 8, RUST[2]); g.set(11, 15, RUST[1]);
  g.rect(3, 19, 10, 2, IRON[1]); g.rect(12, 21, 2, 2, MOSS[2]);
  return g.outline().rows();
}

// A canvas toolbox with a spanner laid across it.
function toolbox() {
  const g = new Grid(16, 16);
  g.rect(2, 7, 12, 7, '#4e5a3a'); g.rect(2, 7, 12, 1, '#6a7850'); g.rect(2, 13, 12, 1, '#2e3822'); g.rect(6, 6, 4, 1, IRON[3]);
  g.rect(7, 9, 2, 3, IRON[2]); g.set(7, 9, IRON[3]);
  g.line(1, 5, 13, 3, IRON[3]); g.rect(12, 2, 3, 3, IRON[2]); g.set(13, 3, INK);
  return g.outline().rows();
}

// A silt sieve on three legs, a handful of buttons left in the mesh.
function sieve() {
  const g = new Grid(16, 16);
  g.line(3, 14, 6, 8, WOOD[2]); g.line(13, 14, 10, 8, WOOD[2]); g.line(8, 14, 8, 9, WOOD[1]);
  g.disc(8, 8, 6, 2, WOOD[3]); g.disc(8, 8, 5, 1.4, MUD[2]); g.disc(8, 8, 4, 1, MUD[1]);
  for (const [x, y, c] of [[5, 7, '#c8a838'], [8, 8, IRON[3]], [10, 7, CREAM[2]], [7, 6, RED[2]]]) g.set(x, y, c);
  g.rect(2, 9, 12, 1, WOOD[1]);
  return g.outline().rows();
}

// A jam tin of beetles. They're in it by choice.
function beetleTin() {
  const g = new Grid(16, 16);
  g.rect(4, 7, 8, 7, '#8a5a3a'); g.rect(4, 7, 1, 7, '#b88458'); g.rect(4, 7, 8, 1, '#b88458'); g.rect(5, 10, 6, 2, CREAM[1]); g.set(6, 11, INK); g.set(8, 10, INK);
  g.rect(3, 6, 10, 1, IRON[3]); g.set(11, 4, INK); g.set(12, 5, INK); g.set(4, 4, INK);
  return g.outline().rows();
}

// ---------------------------------------------------------------------------------------------
// THE LANTERN MARSH

// A handcart gone into the bog: one wheel up, the bed full of mud, a barrel still lashed on.
function cart() {
  const g = new Grid(32, 28);
  g.rect(3, 18, 24, 6, WOOD[2]); g.rect(3, 18, 24, 1, WOOD[3]); g.rect(3, 23, 24, 1, WOOD[0]);
  g.line(3, 20, 0, 12, WOOD[2]); g.line(4, 20, 1, 12, WOOD[1]);
  g.disc(26, 13, 7, 7, WOOD[1]); g.disc(26, 13, 5, 5, null); g.disc(26, 13, 1.6, 1.6, IRON[2]);
  g.line(26, 7, 26, 19, WOOD[2]); g.line(20, 13, 32, 13, WOOD[2]); g.line(22, 9, 30, 17, WOOD[2]); g.line(30, 9, 22, 17, WOOD[2]);
  g.rect(8, 10, 8, 8, WOOD[3]); g.rect(8, 10, 8, 1, WOOD[4]); g.rect(8, 13, 8, 1, IRON[2]); g.rect(8, 16, 8, 1, IRON[2]);
  g.rect(0, 22, 32, 6, MUD[1]); for (let x = 0; x < 32; x += 3) g.set(x, 22 + (x % 2), MUD[2]); g.rect(4, 24, 8, 1, FEN[2]);
  return g.outline().rows();
}

// A single cartwheel half-sunk, its tyre rusted through.
function wheel() {
  const g = new Grid(16, 16);
  g.disc(8, 8, 7, 6, WOOD[1]); g.disc(8, 8, 5, 4, null); g.disc(8, 8, 1.4, 1.2, IRON[2]);
  g.line(8, 2, 8, 14, WOOD[2]); g.line(2, 8, 14, 8, WOOD[2]); g.line(4, 4, 12, 12, WOOD[2]); g.line(12, 4, 4, 12, WOOD[2]);
  g.set(3, 6, RUST[2]); g.set(13, 10, RUST[1]);
  g.rect(0, 11, 16, 5, MUD[1]); for (let x = 0; x < 16; x += 2) g.set(x, 11, MUD[2]);
  return g.outline().rows();
}

// An old lantern post: crooked grey pole, an empty hook, a tin shade green with age. Never lit.
function post() {
  const g = new Grid(16, 32);
  g.rect(7, 6, 2, 25, '#4a4e44'); g.rect(7, 6, 1, 25, '#686c5c'); g.line(8, 6, 11, 3, '#4a4e44'); g.line(11, 3, 14, 3, '#4a4e44');
  g.rect(13, 4, 1, 3, IRON[3]); g.set(13, 7, IRON[3]); g.set(12, 7, IRON[3]);
  g.rect(5, 28, 7, 3, FEN[1]); g.rect(4, 30, 9, 2, FEN[0]); g.set(6, 28, FEN[4]); g.set(10, 29, FEN[3]);
  for (const y of [11, 18, 24]) g.set(8, y, MOSS[2]);
  return g.outline('#12160f').rows();
}

// The same, with the lantern still on it: glass cracked and dark, a green skin on the tin.
function postCracked() {
  const g = new Grid(16, 32);
  g.rect(7, 8, 2, 23, '#4a4e44'); g.rect(7, 8, 1, 23, '#686c5c'); g.line(8, 8, 11, 5, '#4a4e44'); g.line(11, 5, 12, 5, '#4a4e44');
  g.rect(10, 6, 1, 2, IRON[3]);
  g.rect(9, 8, 6, 2, '#566050'); g.rect(9, 10, 6, 7, '#1a2026'); g.rect(9, 17, 6, 1, '#566050'); g.line(10, 11, 14, 16, '#7a8a80'); g.line(13, 11, 11, 15, '#5a6a64');
  g.rect(5, 28, 7, 3, FEN[1]); g.rect(4, 30, 9, 2, FEN[0]);
  for (const y of [13, 20]) g.set(8, y, MOSS[3]);
  g.rect(12, 8, 2, 1, MOSS[3]);
  return g.outline('#12160f').rows();
}

// A half-sunk punt, nose up, a pole across it and a hat that didn't get picked up.
function punt() {
  const g = new Grid(32, 24);
  g.line(1, 8, 8, 18, WOOD[2]); g.line(2, 8, 9, 18, WOOD[1]); g.rect(8, 16, 18, 4, WOOD[2]); g.rect(8, 16, 18, 1, WOOD[3]); g.rect(25, 12, 4, 8, WOOD[1]);
  g.line(6, 8, 26, 17, WOOD[3]); g.line(6, 7, 26, 16, WOOD[4]);
  g.rect(14, 14, 5, 2, '#6a5a3a'); g.rect(15, 12, 3, 2, '#7a6a46');
  g.rect(0, 18, 32, 6, MUD[1]); for (let x = 0; x < 32; x += 3) g.set(x, 18 + (x % 2), FEN[2]); g.rect(4, 20, 10, 1, WATER[1]); g.rect(20, 21, 8, 1, WATER[1]);
  return g.outline().rows();
}

// A wicker eel trap on a stake, lid tied shut, something inside that isn't pleased.
function eelTrap() {
  const g = new Grid(16, 24);
  g.rect(12, 3, 2, 19, WOOD[2]); g.rect(12, 3, 1, 19, WOOD[3]);
  g.disc(7, 15, 5, 6, '#8a7248'); g.disc(7, 15, 4, 5, '#a08a58');
  for (let k = 0; k < 6; k++) { g.line(3, 10 + k * 2, 11, 10 + k * 2, '#6a5430'); }
  g.line(7, 9, 7, 21, '#6a5430'); g.line(4, 10, 4, 20, '#6a5430'); g.line(10, 10, 10, 20, '#6a5430');
  g.rect(5, 9, 5, 2, '#4a3a22'); g.line(10, 10, 12, 8, '#c8b078'); g.set(6, 17, '#2c3a2a'); g.set(7, 17, '#4a6a4a');
  g.rect(2, 22, 12, 2, MUD[1]);
  return g.outline().rows();
}

// A wooden heron on a post, put there to make real herons feel watched. It is not convincing.
function decoy() {
  const g = new Grid(16, 32);
  g.rect(7, 18, 2, 12, WOOD[2]); g.rect(4, 29, 8, 2, MUD[1]);
  g.disc(8, 13, 3, 4, '#b4b8b0'); g.rect(6, 15, 4, 4, '#8a8e86'); g.line(8, 18, 8, 19, WOOD[3]);
  g.line(8, 10, 8, 4, '#b4b8b0'); g.line(9, 10, 9, 4, '#8a8e86'); g.disc(8, 3, 2, 2, '#c8ccc4'); g.line(10, 3, 14, 4, '#d8b848'); g.set(8, 2, INK);
  g.line(4, 12, 2, 17, '#6a6e66');
  return g.outline().rows();
}

// A boot stuck upright in the mud with a reed growing out of the top.
function bootMud() {
  const g = new Grid(16, 16);
  g.rect(5, 6, 6, 8, '#4a3626'); g.rect(5, 6, 1, 8, '#6a5038'); g.rect(5, 5, 6, 2, '#3a2a1c');
  g.line(8, 5, 7, 0, FEN[3]); g.line(9, 5, 10, 1, FEN[4]); g.line(8, 5, 9, 2, FEN[3]);
  g.rect(3, 13, 10, 3, MUD[1]); for (let x = 3; x < 13; x += 2) g.set(x, 13, MUD[3]);
  return g.outline('#12160f').rows();
}

// Cattails, a clump of them swaying (animated).
function cattails(i) {
  const g = new Grid(16, 28);
  const sway = [0, 1, 0, -1][i % 4];
  for (let b = 0; b < 5; b++) {
    const x0 = 3 + b * 2;
    const h = 16 + ((b * 7) % 9);
    for (let y = 0; y < h; y++) g.set(x0 + Math.round(sway * (y / h) * (b % 2 ? 1 : -1) * 2), 27 - y, y > 8 ? FEN[3] : FEN[2]);
    if (b % 2 === 0) { const top = 27 - h; const ox = x0 + Math.round(sway * 2 * (b % 2 ? 1 : -1)); g.rect(ox - 1, top, 2, 5, '#5a3a24'); g.set(ox - 1, top, '#7a5a3a'); g.set(ox, top - 1, FEN[4]); }
  }
  g.rect(0, 26, 16, 2, FEN[1]);
  return g.rows();
}

// Reeds, tall and thin and leaning together (animated).
function reedsAnim(i) {
  const g = new Grid(16, 32);
  const sway = [0, 1, 1, 0, -1, -1][i % 6];
  for (let b = 0; b < 7; b++) {
    const x0 = 2 + b * 2;
    const h = 18 + ((b * 5) % 12);
    for (let y = 0; y < h; y++) g.set(x0 + Math.round(sway * (y / h) * (b % 2 ? 1 : -1) * 2.4), 30 - y, y > 10 ? FEN[4] : FEN[3]);
    g.set(x0 + Math.round(sway * 2.4 * (b % 2 ? 1 : -1)) + 1, 30 - h, FEN[3]);
  }
  g.rect(0, 29, 16, 3, FEN[1]); g.rect(2, 30, 4, 1, FEN[0]);
  return g.rows();
}

// A tuft of cotton-grass, white heads on thin stems.
function cotton() {
  const g = new Grid(16, 16);
  for (const [x, h] of [[4, 9], [7, 12], [10, 8], [12, 10]]) { g.line(x, 15, x, 15 - h, FEN[3]); g.disc(x, 15 - h, 1.4, 1.4, '#e4e4da'); g.set(x, 15 - h - 1, '#ffffff'); }
  g.rect(2, 14, 12, 2, FEN[1]);
  return g.outline('#14180f').rows();
}

// Pale toadstools in a ring at the foot of nothing.
function toadstools() {
  const g = new Grid(16, 16);
  for (const [x, y, r] of [[3, 11, 2], [7, 9, 3], [11, 11, 2], [5, 13, 2]]) { g.rect(x, y, 1, 3, '#c8c4aa'); g.disc(x, y - 0.5, r, 1.4, '#e0dcc4'); g.set(x - 1, y - 1, '#8a4a3a'); g.set(x + 1, y - 1, '#8a4a3a'); }
  g.rect(1, 14, 14, 2, FEN[1]);
  return g.outline('#14180f').rows();
}

// A rotten stump gone to shelves of fungus, a blue-grey beetle on the top.
function stump() {
  const g = new Grid(16, 20);
  g.rect(3, 6, 10, 12, '#4a3e30'); g.rect(3, 6, 2, 12, '#34291d'); g.rect(11, 6, 2, 12, '#34291d'); g.disc(8, 6, 5, 1.6, '#6a5a46'); g.disc(8, 6, 3, 1, '#4a3e30');
  g.rect(11, 9, 4, 2, '#c8b890'); g.rect(11, 9, 4, 1, '#e4d8b0'); g.rect(1, 12, 4, 2, '#c8b890'); g.rect(1, 12, 4, 1, '#e4d8b0');
  g.rect(6, 4, 3, 1, '#5a7aa0'); g.set(7, 3, '#8aa0c0');
  g.rect(1, 17, 14, 3, FEN[1]); for (let k = 0; k < 4; k++) g.set(3 + k * 3, 17, MOSS[3]);
  return g.outline('#12160f').rows();
}

// A fishing rod pushed into the bank, the line out in the water, a tin of nothing beside it.
function rod() {
  const g = new Grid(16, 24);
  g.line(3, 22, 12, 2, WOOD[3]); g.line(4, 22, 13, 2, WOOD[2]); g.line(12, 2, 15, 4, '#c8c4aa'); g.line(15, 4, 15, 12, '#c8c4aa'); g.rect(14, 12, 3, 2, RED[2]); g.set(15, 12, '#ffffff');
  g.rect(2, 19, 5, 4, IRON[2]); g.rect(2, 19, 5, 1, IRON[3]); g.rect(3, 20, 3, 2, MUD[1]);
  g.rect(0, 22, 16, 2, FEN[1]);
  return g.outline('#12160f').rows();
}

// A handbell on a post, with a card nailed under it: RING FOR THE TOLL.
function bellPost() {
  const g = new Grid(16, 32);
  g.rect(7, 8, 3, 23, WOOD[2]); g.rect(7, 8, 1, 23, WOOD[3]); g.rect(8, 6, 1, 3, IRON[1]);
  g.disc(8, 8, 4, 3, '#b88a2e'); g.rect(4, 8, 9, 3, '#b88a2e'); g.rect(4, 10, 9, 1, '#7a5a1e'); g.set(6, 6, WARM[2]); g.rect(8, 11, 1, 2, IRON[3]);
  g.rect(3, 15, 11, 7, CREAM[1]); g.rect(3, 15, 11, 1, CREAM[2]); for (const y of [17, 19]) g.line(5, y, 12, y, '#5a5240'); g.set(8, 13, INK);
  g.rect(5, 29, 8, 3, FEN[1]);
  return g.outline('#12160f').rows();
}

// A milestone, leaning, moss up one side, the miles worn off it.
function milestone() {
  const g = new Grid(16, 24);
  g.rect(3, 8, 10, 14, '#7a7e72'); g.rect(3, 8, 2, 14, '#5a5e52'); g.rect(11, 8, 2, 14, '#5a5e52'); g.disc(8, 8, 5, 2.4, '#7a7e72'); g.disc(8, 8, 3, 1.4, '#9a9e90');
  g.rect(5, 12, 6, 1, '#3a3e34'); g.rect(5, 14, 4, 1, '#3a3e34'); g.rect(5, 16, 5, 1, '#4a4e44');
  g.rect(3, 15, 3, 6, MOSS[2]); g.rect(3, 14, 2, 1, MOSS[3]); g.rect(0, 21, 16, 3, FEN[1]);
  return g.outline('#12160f').rows();
}

// A fallen column drum of the old city's stone, half in the mud, fluting still sharp on top.
function column() {
  const g = new Grid(32, 20);
  g.rect(2, 4, 26, 12, '#6e7268'); g.rect(2, 4, 26, 2, '#8a8e82'); g.rect(2, 14, 26, 2, '#4e5248');
  for (let x = 4; x < 27; x += 3) g.line(x, 6, x, 13, '#566056');
  g.disc(3, 10, 2, 6, '#8a8e82'); g.disc(3, 10, 1, 4, '#565a50');
  g.rect(24, 8, 4, 3, MOSS[2]); g.rect(0, 15, 32, 5, MUD[1]); for (let x = 0; x < 32; x += 3) g.set(x, 15, MUD[3]); g.rect(8, 17, 8, 1, FEN[2]);
  return g.outline('#12160f').rows();
}

// A stone head, half in the mud, face up, looking at the sky with no opinion.
function headStone() {
  const g = new Grid(16, 16);
  g.disc(8, 8, 6, 6, '#7a7e72'); g.disc(7, 6, 4, 3, '#9a9e90');
  g.rect(5, 6, 2, 1, '#3a3e34'); g.rect(9, 6, 2, 1, '#3a3e34'); g.line(8, 7, 8, 10, '#5a5e52'); g.line(6, 12, 10, 12, '#4a4e44');
  g.rect(2, 4, 12, 1, '#566056'); g.rect(10, 9, 3, 3, MOSS[2]);
  g.rect(0, 11, 16, 5, MUD[1]); for (let x = 0; x < 16; x += 2) g.set(x, 11, MUD[3]);
  return g.outline('#12160f').rows();
}

// A horse's ribs coming out of the mud by the cart it pulled. It's been a very long time.
function bones() {
  const g = new Grid(32, 20);
  g.line(2, 18, 28, 18, '#6e6650');
  for (let k = 0; k < 6; k++) { const x = 5 + k * 4; g.line(x, 17, x + 1, 8 + Math.abs(k - 2.5), '#d8d0b4'); g.line(x + 1, 8 + Math.abs(k - 2.5), x + 3, 7 + Math.abs(k - 2.5), '#e8e0c4'); }
  g.line(4, 16, 29, 16, '#c8c0a4');
  g.rect(0, 16, 32, 4, MUD[1]); for (let x = 0; x < 32; x += 2) g.set(x, 16, MUD[2]); g.rect(26, 11, 5, 3, '#e8e0c4'); g.set(29, 12, INK);
  return g.outline('#12160f').rows();
}

// A barrel sunk to its belly, the head stove in, still smells of something.
function barrel() {
  const g = new Grid(16, 20);
  g.rect(2, 6, 12, 8, WOOD[2]); g.rect(2, 6, 2, 8, WOOD[1]); g.rect(12, 6, 2, 8, WOOD[1]); g.rect(7, 6, 2, 8, WOOD[3]);
  g.rect(2, 8, 12, 1, IRON[2]); g.rect(2, 12, 12, 1, IRON[2]); g.disc(8, 5, 6, 2, WOOD[3]); g.disc(8, 5, 4, 1.4, MUD[1]); g.line(5, 4, 11, 6, WOOD[1]);
  g.rect(0, 14, 16, 6, MUD[1]); for (let x = 0; x < 16; x += 2) g.set(x, 14, MUD[3]); g.rect(4, 16, 6, 1, WATER[1]);
  return g.outline('#12160f').rows();
}

// Flat pale stones in a line, each one a stride apart, worn smooth by crossing.
function stepstones() {
  const g = new Grid(32, 16);
  for (const [x, y, rx] of [[4, 6, 3], [12, 9, 4], [21, 6, 3], [28, 10, 3]]) { g.disc(x, y, rx, 2.2, '#8a8e82'); g.disc(x, y - 0.6, rx - 1, 1.2, '#a8ac9c'); g.line(x - rx, y + 2, x + rx, y + 2, '#4a5048'); }
  return g.rows();
}

// A reed nest on three stakes, a clutch of speckled eggs. Mum is somewhere being offended.
function nest() {
  const g = new Grid(16, 20);
  g.rect(3, 8, 1, 10, WOOD[2]); g.rect(12, 8, 1, 10, WOOD[2]); g.rect(7, 10, 1, 8, WOOD[2]);
  g.disc(8, 10, 6, 2.4, '#8a7a4a'); g.disc(8, 9, 5, 1.6, '#a8985c'); g.disc(8, 9, 3, 1, '#4a3e22');
  g.rect(6, 7, 2, 2, '#cfd8c0'); g.rect(9, 7, 2, 2, '#cfd8c0'); g.set(6, 7, '#7a8a5a'); g.set(10, 8, '#7a8a5a');
  g.line(2, 11, 0, 10, FEN[4]); g.line(14, 11, 15, 9, FEN[4]);
  g.rect(0, 18, 16, 2, FEN[1]);
  return g.outline('#12160f').rows();
}

// A fingerpost with one arm snapped off and lying at its foot. The other still says THE CITY.
function fingerpost() {
  const g = new Grid(16, 32);
  g.rect(7, 4, 3, 27, WOOD[2]); g.rect(7, 4, 1, 27, WOOD[3]);
  g.rect(8, 6, 7, 4, WOOD[3]); g.rect(8, 6, 7, 1, WOOD[4]); g.line(15, 6, 15, 9, WOOD[3]); g.set(14, 5, WOOD[3]);
  g.line(9, 8, 13, 8, '#3a2e24');
  g.line(1, 26, 6, 25, WOOD[2]); g.rect(0, 26, 6, 3, WOOD[1]); g.line(1, 27, 5, 27, '#3a2e24');
  g.rect(3, 29, 10, 3, FEN[1]);
  return g.outline('#12160f').rows();
}

// Two stakes and a washing line, a strip of plum cloth pegged out to dry and a stocking.
function washline() {
  const g = new Grid(48, 28);
  g.rect(3, 6, 2, 21, WOOD[2]); g.rect(3, 6, 1, 21, WOOD[3]); g.rect(43, 6, 2, 21, WOOD[2]); g.rect(43, 6, 1, 21, WOOD[3]);
  g.line(4, 7, 44, 10, '#c8c4aa');
  for (let x = 6; x < 42; x++) g.set(x, 7 + Math.round((x - 4) * 3 / 40), '#c8c4aa');
  g.rect(12, 9, 9, 10, CLOTH[1]); g.rect(12, 9, 9, 1, CLOTH[2]); g.rect(12, 18, 9, 1, CLOTH[0]); g.line(15, 10, 15, 17, CLOTH[0]); g.rect(13, 8, 1, 2, WOOD[4]); g.rect(19, 8, 1, 2, WOOD[4]);
  g.rect(28, 9, 3, 11, '#7a8a8a'); g.rect(28, 9, 3, 1, '#a8b4b4'); g.rect(27, 19, 5, 2, '#7a8a8a'); g.rect(28, 8, 1, 2, WOOD[4]);
  g.rect(33, 10, 4, 6, CLOTH[2]); g.rect(34, 9, 1, 2, WOOD[4]);
  g.rect(1, 25, 6, 3, FEN[1]); g.rect(41, 25, 6, 3, FEN[1]);
  return g.outline('#12160f').rows();
}

// A mooring post with a rope round it, one end trailing, wet where the water laps it.
function dockPost() {
  const g = new Grid(16, 24);
  g.rect(6, 4, 4, 18, WOOD[1]); g.rect(6, 4, 1, 18, WOOD[2]); g.rect(7, 3, 2, 1, WOOD[2]);
  for (const y of [8, 10, 12]) g.rect(5, y, 6, 1, CREAM[0]);
  g.line(10, 12, 13, 17, CREAM[0]); g.line(13, 17, 12, 20, CREAM[0]);
  g.rect(5, 18, 6, 4, '#2a3226'); g.rect(3, 21, 10, 3, FEN[1]);
  return g.outline('#12160f').rows();
}

// A single grey heron feather, stuck in the mud like a flag.
function feather() {
  const g = new Grid(16, 16);
  g.line(8, 15, 8, 3, '#8a8e86'); g.line(8, 3, 4, 2, '#b4b8b0'); g.line(8, 5, 4, 5, '#a4a8a0'); g.line(8, 7, 5, 8, '#9a9e96'); g.line(8, 4, 11, 4, '#b4b8b0'); g.line(8, 6, 11, 7, '#a4a8a0');
  g.rect(5, 14, 7, 2, MUD[1]);
  return g.outline('#12160f').rows();
}

// Bunches of drying herbs hung from a rafter hook, tied with plum thread.
function herbs() {
  const g = new Grid(16, 24);
  g.rect(2, 1, 12, 2, WOOD[2]); g.rect(2, 1, 12, 1, WOOD[3]);
  for (const x of [4, 8, 12]) { g.line(x, 3, x, 6, '#c8c4aa'); g.rect(x - 1, 6, 3, 1, CLOTH[1]); g.rect(x - 2, 7, 5, 9, MOSS[x === 8 ? 3 : 2]); g.line(x, 8, x, 18, MOSS[1]); g.set(x - 2, 16, MOSS[1]); g.set(x + 2, 16, MOSS[1]); }
  return g.outline().rows();
}

// A shelf of jam jars with the lids tied on in cloth, each with a pencil label.
function jars() {
  const g = new Grid(32, 20);
  g.rect(1, 12, 30, 2, WOOD[3]); g.rect(1, 12, 30, 1, WOOD[4]); g.rect(1, 14, 30, 1, WOOD[0]); g.rect(3, 14, 2, 4, WOOD[1]); g.rect(27, 14, 2, 4, WOOD[1]);
  [['#a83a3a', 2], ['#c8882e', 9], ['#6a8a3a', 16], ['#7a4a6a', 23]].forEach(([c, x]) => { g.rect(x + 1, 4, 6, 8, '#8aa8a8'); g.rect(x + 2, 6, 4, 6, c); g.rect(x, 2, 8, 2, CLOTH[2]); g.rect(x + 3, 8, 2, 2, CREAM[2]); g.set(x + 1, 5, '#c8e0e0'); });
  return g.outline().rows();
}

// A rack of three wooden spoons and a ladle on pegs.
function rack() {
  const g = new Grid(16, 24);
  g.rect(1, 3, 14, 2, WOOD[3]); g.rect(1, 3, 14, 1, WOOD[4]);
  [[3, 14], [7, 18], [11, 12]].forEach(([x, h], k) => { g.rect(x, 5, 1, h - 5, WOOD[3]); g.disc(x, h + 1, 1.8, 2.2, k === 1 ? IRON[2] : WOOD[2]); });
  g.rect(2, 2, 1, 2, WOOD[2]); g.rect(13, 2, 1, 2, WOOD[2]);
  return g.outline().rows();
}

// A basket of mended socks, needle left in.
function basket() {
  const g = new Grid(16, 16);
  g.disc(8, 10, 6, 4, '#8a7248'); g.disc(8, 8, 6, 2, '#a08a58'); g.disc(8, 8, 5, 1.4, CLOTH[1]);
  for (let k = 0; k < 5; k++) g.line(3 + k * 2, 8, 3 + k * 2, 13, '#6a5430');
  g.rect(4, 5, 4, 3, '#7a8a8a'); g.rect(9, 5, 4, 3, CLOTH[2]); g.line(6, 4, 13, 2, IRON[3]);
  return g.outline().rows();
}

// A slate on a nail with a tally of days chalked in fives. She's counted them.
function slate() {
  const g = new Grid(16, 24);
  g.rect(7, 2, 2, 2, IRON[3]); g.line(8, 4, 4, 8, IRON[1]); g.line(8, 4, 12, 8, IRON[1]);
  g.rect(2, 8, 12, 12, WOOD[2]); g.rect(3, 9, 10, 10, '#2a3036'); g.rect(2, 8, 12, 1, WOOD[3]);
  for (let k = 0; k < 3; k++) for (let j = 0; j < 4; j++) g.rect(4 + j * 2, 10 + k * 3, 1, 2, CHALK);
  g.line(4, 11, 11, 11, CHALK_D); g.line(4, 14, 11, 14, CHALK_D);
  return g.outline().rows();
}

// A chair leg with a nail in it, leaning where it can be reached.
function chairLeg() {
  const g = new Grid(16, 24);
  g.line(5, 22, 11, 3, WOOD[3]); g.line(6, 22, 12, 3, WOOD[2]); g.line(7, 22, 13, 3, WOOD[1]);
  g.rect(10, 1, 4, 3, WOOD[3]); g.set(11, 0, IRON[3]); g.set(12, 0, IRON[3]);
  g.rect(3, 21, 8, 2, WOOD[1]);
  return g.outline().rows();
}

// A bundle of plum-coloured strips, knotted, waiting to be tied on to something.
function stripsBundle() {
  const g = new Grid(16, 16);
  g.disc(8, 10, 5, 4, CLOTH[1]); g.disc(8, 9, 4, 3, CLOTH[2]); g.line(3, 10, 13, 10, CLOTH[0]); g.line(6, 6, 10, 14, CLOTH[0]);
  g.rect(7, 8, 2, 2, CLOTH[0]); g.line(13, 12, 15, 14, CLOTH[2]); g.line(2, 12, 0, 14, CLOTH[2]);
  return g.outline().rows();
}

// A tin of lamp oil with a long spout, and a rag.
function oilTin() {
  const g = new Grid(16, 16);
  g.rect(4, 6, 7, 8, '#6a6a3a'); g.rect(4, 6, 7, 1, '#8a8a52'); g.rect(4, 13, 7, 1, '#3a3a1e'); g.rect(6, 8, 3, 3, CREAM[1]); g.set(7, 9, INK);
  g.line(11, 7, 15, 3, IRON[3]); g.line(11, 8, 15, 4, IRON[2]); g.rect(5, 3, 3, 3, IRON[2]); g.line(2, 12, 4, 10, '#c8c4aa');
  return g.outline().rows();
}

// A pole with a tin hat on top and a face scratched on it: the marsh's scarecrow, for scarecrow reasons.
function hatPole() {
  const g = new Grid(16, 32);
  g.rect(7, 8, 2, 23, WOOD[2]); g.rect(7, 8, 1, 23, WOOD[3]); g.line(2, 14, 13, 14, WOOD[2]); g.line(2, 13, 13, 13, WOOD[3]);
  g.disc(8, 8, 4, 4, '#7a6a4e'); g.set(7, 8, INK); g.set(10, 8, INK); g.line(7, 10, 10, 10, INK);
  g.rect(3, 4, 10, 2, '#7a8288'); g.rect(5, 1, 6, 4, '#7a8288'); g.rect(5, 1, 6, 1, '#a0a8ae');
  g.rect(3, 15, 3, 7, '#6a6a4a'); g.rect(10, 15, 3, 7, '#6a6a4a'); g.rect(5, 15, 6, 9, '#5a5a3a');
  g.rect(3, 29, 10, 3, FEN[1]);
  return g.outline('#12160f').rows();
}

// A board nailed to a post: BEWARE OF THE HERON (a heron has drawn a face on it, politely).
function heronSign() {
  const g = new Grid(16, 32);
  g.rect(7, 12, 2, 19, WOOD[2]); g.rect(7, 12, 1, 19, WOOD[3]);
  g.rect(1, 3, 14, 10, WOOD[3]); g.rect(1, 3, 14, 1, WOOD[4]); g.rect(1, 12, 14, 1, WOOD[1]);
  g.rect(3, 5, 10, 1, '#3a2e24'); g.rect(3, 7, 7, 1, '#3a2e24');
  g.disc(11, 9, 2, 2, '#8a8e86'); g.set(11, 8, INK); g.line(12, 9, 14, 9, '#d8b848');
  g.rect(3, 29, 10, 3, FEN[1]);
  return g.outline('#12160f').rows();
}


// ---------------------------------------------------------------------------------------------
// FLAT THINGS: no body, no outline, drawn on the ground itself.

// A puddle in the brick floor, a glint of lamp in it.
function puddle(v = 0) {
  const g = new Grid(16, 16);
  g.disc(8, 9, 6 - v, 3 - (v ? 0.4 : 0), '#16262a'); g.disc(8, 9, 5 - v, 2.2, '#1f3a3e'); g.rect(5 + v, 8, 3, 1, '#4a7a7a'); g.set(10, 9, '#8ac0c0');
  return g.rows();
}

// A streak of rust-orange where a pipe has wept down the wall onto the floor.
function stain() {
  const g = new Grid(16, 16);
  for (let k = 0; k < 4; k++) { g.rect(5 + k * 2, 2, 1, 6 + (k % 3) * 2, k % 2 ? '#6a3a22cc' : '#8a4a2acc'); }
  g.disc(8, 12, 5, 2, '#5a3220aa'); g.disc(8, 12, 3, 1, '#7a4426aa');
  return g.rows();
}

// A patch of green mould creeping out from the corner.
function mould() {
  const g = new Grid(16, 16);
  g.disc(7, 9, 6, 4, '#1e3226bb'); g.disc(7, 8, 4, 2.6, '#2e4a34cc'); g.disc(6, 8, 2, 1.4, '#46684acc');
  for (const [x, y] of [[3, 6], [11, 11], [12, 7], [4, 12]]) g.set(x, y, '#6c9468cc');
  return g.rows();
}

// A drift of silt with a few small prints in it, going somewhere.
function silt() {
  const g = new Grid(16, 16);
  g.disc(8, 9, 7, 3, '#3a3426aa'); g.disc(8, 9, 5, 2, '#4a4430aa');
  for (let k = 0; k < 5; k++) { g.set(2 + k * 3, 8 + (k % 2) * 2, '#201c14'); g.set(3 + k * 3, 9 + (k % 2) * 2, '#201c14'); }
  return g.rows();
}

// Crumbs of brick and a hairline crack across the floor.
function crumbs() {
  const g = new Grid(16, 16);
  g.line(1, 5, 7, 8, '#10141a99'); g.line(7, 8, 9, 12, '#10141a99'); g.line(9, 12, 15, 13, '#10141a99');
  for (const [x, y, c] of [[3, 10, BRICK[3]], [5, 11, BRICK[2]], [12, 5, BRICK[3]], [13, 7, BRICK[2]], [10, 9, BRICK[4]]]) g.rect(x, y, 2, 1, c);
  return g.rows();
}

// A mud flat with the three-toed prints of something that stood very still.
function mudflat() {
  const g = new Grid(16, 16);
  g.disc(8, 9, 7, 3.4, '#1a1814cc'); g.disc(8, 9, 5, 2.4, '#2c2820cc'); g.rect(4, 8, 4, 1, '#403a2ecc');
  for (const [x, y] of [[4, 10], [9, 8], [12, 11]]) { g.set(x, y, '#12100c'); g.set(x - 1, y + 1, '#12100c'); g.set(x + 1, y + 1, '#12100c'); g.set(x, y + 1, '#12100c'); }
  return g.rows();
}

// Duckweed: a skin of bright green over standing water.
function duckweed() {
  const g = new Grid(16, 16);
  g.disc(8, 9, 7, 3.4, '#1a2a26aa'); g.disc(8, 9, 6, 2.8, '#3a6a3ecc');
  for (const [x, y] of [[4, 8], [7, 10], [10, 8], [12, 10], [6, 7], [9, 11]]) { g.set(x, y, '#6ca85a'); g.set(x + 1, y, '#5a9448'); }
  return g.rows();
}

// A little pool with the grey sky in it.
function pool() {
  const g = new Grid(16, 16);
  g.disc(8, 9, 6, 3, '#1c2626'); g.disc(8, 9, 5, 2.2, '#34484a'); g.rect(5, 8, 4, 1, '#7a8e8c'); g.set(10, 9, '#a8bab4');
  g.set(2, 9, '#4a5a40'); g.set(14, 10, '#4a5a40');
  return g.rows();
}

// Fallen fen leaves and a few seed-heads, brown and gold in the mud.
function litter() {
  const g = new Grid(16, 16);
  for (const [x, y, c] of [[3, 8, '#7a5a2a'], [7, 10, '#a8842e'], [11, 7, '#6a4a22'], [6, 6, '#8a6a30'], [12, 11, '#a8842e'], [4, 12, '#6a4a22']]) { g.rect(x, y, 3, 1, c); g.set(x + 1, y + 1, c); }
  return g.rows();
}

// A speckled egg lying in the sedge where a nest dropped it.
function egg() {
  const g = new Grid(16, 16);
  g.disc(8, 10, 3, 3.6, '#d8dcc8'); g.disc(7, 9, 1.4, 1.8, '#eef0e0'); g.set(9, 11, '#6a7a4a'); g.set(7, 12, '#6a7a4a'); g.set(10, 9, '#8a9a5a');
  for (const [x, h] of [[3, 5], [5, 7], [12, 6], [13, 4]]) g.line(x, 15, x, 15 - h, FEN[3]);
  g.rect(3, 14, 11, 2, FEN[1]);
  return g.outline('#14180f').rows();
}

// A short tuft of sedge, bodiless, walked through.
function sedge() {
  const g = new Grid(16, 16);
  for (const [x, h] of [[5, 7], [7, 9], [9, 6], [11, 8]]) { g.line(x, 15, x + ((x * 3) % 3 - 1), 15 - h, FEN[3]); g.set(x + 1, 15 - h, FEN[4]); }
  g.rect(3, 14, 10, 2, FEN[1]);
  return g.rows();
}

export const R3M_PROP_SPRITES = {
  r3m_g_walt: grafWalt(),
  r3m_g_head: grafHead(),
  r3m_g_sweet: grafSweet(),
  r3m_g_damp: grafDamp(),
  r3m_g_tea: grafTea(),
  r3m_g_count: grafCount(),
  r3m_g_mab: grafMab(),
  r3m_g_down: grafDown(),
  r3m_g_tally: grafTally(),
  r3m_g_face: grafFace(),
  r3m_g_rat: grafRat(),
  r3m_g_fish: grafFish(),
  r3m_g_marks: grafMarks(),
  r3m_pipe: pipe(),
  r3m_peg_coat: pegCoat(),
  r3m_peg_cap: pegCap(),
  r3m_bracket_lamp: bracketLamp(),
  r3m_bricks: bricks(),
  r3m_mortar: mortar(),
  r3m_rat_nest: ratNest(),
  r3m_mug: mug(),
  r3m_fungus: fungus(),
  r3m_saucer: saucer(),
  r3m_boot: boot(),
  r3m_shelf: shelf(),
  r3m_chain: chain(),
  r3m_spare_wheel: spareWheel(),
  r3m_toolbox: toolbox(),
  r3m_sieve: sieve(),
  r3m_beetle_tin: beetleTin(),
  r3m_cart: cart(),
  r3m_wheel: wheel(),
  r3m_post: post(),
  r3m_post_cracked: postCracked(),
  r3m_punt: punt(),
  r3m_eel_trap: eelTrap(),
  r3m_decoy: decoy(),
  r3m_boot_mud: bootMud(),
  r3m_cattails: cattails(0),
  r3m_reeds: reedsAnim(0),
  r3m_cotton: cotton(),
  r3m_toadstools: toadstools(),
  r3m_stump: stump(),
  r3m_rod: rod(),
  r3m_bell_post: bellPost(),
  r3m_milestone: milestone(),
  r3m_column: column(),
  r3m_head: headStone(),
  r3m_bones: bones(),
  r3m_barrel: barrel(),
  r3m_stepstones: stepstones(),
  r3m_nest: nest(),
  r3m_fingerpost: fingerpost(),
  r3m_washline: washline(),
  r3m_dock_post: dockPost(),
  r3m_feather: feather(),
  r3m_herbs: herbs(),
  r3m_jars: jars(),
  r3m_rack: rack(),
  r3m_basket: basket(),
  r3m_slate: slate(),
  r3m_chair_leg: chairLeg(),
  r3m_strips_bundle: stripsBundle(),
  r3m_oil_tin: oilTin(),
  r3m_hat_pole: hatPole(),
  r3m_heron_sign: heronSign(),
  r3m_puddle: puddle(),
  r3m_puddle2: puddle(1),
  r3m_stain: stain(),
  r3m_mould: mould(),
  r3m_silt: silt(),
  r3m_crumbs: crumbs(),
  r3m_mudflat: mudflat(),
  r3m_duckweed: duckweed(),
  r3m_pool: pool(),
  r3m_litter: litter(),
  r3m_sedge: sedge(),
  r3m_egg: egg(),
};

export const R3M_PALETTE = palette;
export const R3M_PALETTE_EXTRA = palette;
export const R3M_CATTAILS_SPRITES = frames((i) => cattails(i), 4);
export const R3M_REEDS_SPRITES = frames((i) => reedsAnim(i), 6);

// How many tiles wide each wider one stands.
export const R3M_FOOTPRINTS = {
  r3m_g_walt: 2,
  r3m_g_head: 2,
  r3m_g_sweet: 2,
  r3m_g_damp: 2,
  r3m_g_tea: 2,
  r3m_g_count: 2,
  r3m_g_mab: 2,
  r3m_g_down: 2,
  r3m_pipe: 2,
  r3m_shelf: 2,
  r3m_cart: 2,
  r3m_punt: 2,
  r3m_column: 2,
  r3m_bones: 2,
  r3m_stepstones: 2,
  r3m_washline: 3,
  r3m_jars: 2,
};
