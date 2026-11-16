// Props for Haddock's shed (secret_haddocks_shed, Saltcombe, Chapter 5): the old
// lightman's junk, every bit of it labelled. Drawn like saltcombeProps.js: rows of
// characters from the small painter below, 16 pixels to a tile, standing on the
// bottom edge and centred over their footprint. Every id starts `hs_`.
//
//   hs_open_door         the shed's back door, ajar on its hinges, dark inside
//   hs_oars              a big oar and a short one, slung from a nail
//   hs_nets              a much-mended net on two nails
//   hs_floats            a rope of cork floats on a peg rail (2 wide)
//   hs_cabinet           a little cabinet; on top, a matchbox with a tooth in it
//   hs_notice            a card nailed up over a bucket of fish heads
//   hs_tide_table        a soft old tide table pinned up, books under it
//   hs_bench_<gift>_<n>  one third of the workbench (n = 0, 1, 2 left to right)
//                        with a gift and its label on it; `_empty` is the same
//                        with just the label card left behind

// --- A tiny painter ---------------------------------------------------
const OUT = '#1a1410';

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xfb40 + colors.size);
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
const IRON = ['#1e2224', '#3a4246', '#5e686c'];
const PAPER = ['#a89878', '#d8c8a0', '#f0e4c4'];
const INK = '#28201c';
const ROPE = ['#7a6038', '#a88a58', '#cdb07a'];
const CORK = ['#9a6c38', '#c89a58', '#e0b878'];
const RED = ['#7a2a24', '#b83a30'];
const OIL = ['#8a6418', '#c8962a', '#e8c04e'];
const DARK = '#120e0a';

// A little paper label with lines of ink.
function card(g, x, y, w, h) {
  g.rect(x, y, w, h, PAPER[2]);
  g.rect(x, y + h - 1, w, 1, PAPER[1]);
  for (let ly = y + 1; ly < y + h - 1; ly += 2) g.rect(x + 1, ly, w - 2 - (ly % 3), 1, INK);
}

function nail(g, x, y) {
  g.set(x, y, IRON[2]);
  g.set(x, y + 1, IRON[0]);
}

function openDoor() {
  const g = new Grid(16, 32);
  g.rect(0, 0, 16, 32, WOOD[1]);
  g.rect(0, 0, 16, 2, WOOD[2]);
  g.rect(2, 2, 12, 30, DARK);
  g.rect(2, 2, 12, 1, WOOD[0]);
  // The leaf, swung back against the left jamb.
  g.rect(2, 2, 4, 30, WOOD[2]);
  g.rect(2, 2, 1, 30, WOOD[3]);
  g.rect(5, 2, 1, 30, WOOD[0]);
  g.rect(3, 12, 2, 1, WOOD[0]);
  g.rect(3, 22, 2, 1, WOOD[0]);
  g.rect(2, 5, 4, 2, IRON[1]);
  g.rect(2, 26, 4, 2, IRON[1]);
  // The boards inside, catching a little light.
  g.rect(7, 28, 6, 4, WOOD[0]);
  g.rect(7, 28, 6, 1, WOOD[1]);
  g.outline(OUT);
  return g.rows();
}

function oars() {
  const g = new Grid(16, 32);
  // Big oar.
  g.rect(4, 3, 2, 24, WOOD[3]);
  g.rect(4, 3, 1, 24, WOOD[2]);
  g.rect(3, 20, 4, 11, WOOD[2]);
  g.rect(3, 20, 1, 11, WOOD[1]);
  g.rect(3, 30, 4, 1, WOOD[0]);
  // Short oar.
  g.rect(11, 11, 2, 16, WOOD[3]);
  g.rect(11, 11, 1, 16, WOOD[2]);
  g.rect(10, 22, 4, 9, WOOD[2]);
  g.rect(10, 22, 1, 9, WOOD[1]);
  g.rect(10, 30, 4, 1, WOOD[0]);
  // Both slung from a nail with a loop of rope.
  g.line(8, 3, 4, 9, ROPE[1]);
  g.line(8, 3, 12, 12, ROPE[1]);
  g.line(4, 9, 12, 12, ROPE[0]);
  nail(g, 8, 1);
  g.outline(OUT);
  return g.rows();
}

function nets() {
  const g = new Grid(16, 32);
  const inside = (x, y) => {
    const t = (y - 5) / 22;
    return y >= 5 && y <= 27 && x >= 2 + t * 1.5 && x <= 13 - t * 1.5;
  };
  for (let x = 2; x <= 13; x += 3) for (let y = 5; y <= 27; y++) if (inside(x, y) && !(y > 24 && x === 8)) g.set(x, y, ROPE[1]);
  for (let y = 6; y <= 27; y += 3) for (let x = 2; x <= 13; x++) if (inside(x, y)) g.set(x, y, ROPE[0]);
  // The top rope, sagging between the nails.
  for (let x = 2; x <= 13; x++) g.set(x, 4 + Math.round(Math.sin(((x - 2) / 11) * Math.PI) * 1.4), ROPE[2]);
  // A patch of newer twine, and a lone cork.
  g.rect(8, 12, 3, 3, ROPE[2]);
  g.rect(8, 13, 3, 1, ROPE[1]);
  g.oval(5, 24, 1, 1, CORK[1]);
  nail(g, 2, 2);
  nail(g, 13, 2);
  g.outline(OUT);
  return g.rows();
}

function floats() {
  const g = new Grid(32, 24);
  // A peg rail nailed to the wall, a peg at each end.
  g.rect(1, 2, 30, 3, WOOD[2]);
  g.rect(1, 2, 30, 1, WOOD[3]);
  g.rect(1, 4, 30, 1, WOOD[0]);
  g.rect(3, 4, 2, 4, WOOD[1]);
  g.rect(27, 4, 2, 4, WOOD[1]);
  nail(g, 1, 3);
  nail(g, 30, 3);
  // A rope slung between the pegs.
  const ropeY = (x) => 7 + Math.round(Math.sin(((x - 4) / 24) * Math.PI) * 5);
  for (let x = 4; x <= 28; x++) g.set(x, ropeY(x), ROPE[1]);
  // Floats on short strings: cork, red, white, a bottle, cork.
  const kit = [[7, CORK[1]], [11, RED[1]], [15, '#d8d4c4'], [19, '#4a8a5a'], [23, CORK[2]]];
  for (const [x, c] of kit) {
    const y = ropeY(x);
    g.line(x, y, x, y + 2, ROPE[0]);
    g.oval(x, y + 5, 2, 3, c);
    g.set(x - 1, y + 4, '#ffffff');
  }
  g.outline(OUT);
  return g.rows();
}

function cabinet() {
  const g = new Grid(16, 32);
  g.rect(1, 14, 14, 17, WOOD[1]);
  g.rect(1, 14, 14, 2, WOOD[3]);
  g.rect(2, 17, 5, 12, WOOD[2]);
  g.rect(9, 17, 5, 12, WOOD[2]);
  g.rect(7, 16, 2, 14, WOOD[0]);
  g.set(6, 22, IRON[2]);
  g.set(9, 22, IRON[2]);
  g.rect(1, 29, 14, 2, WOOD[0]);
  // On top: a matchbox, drawer pulled out, a pale tooth on cotton wool; a jar of nails.
  g.rect(2, 10, 7, 4, CORK[0]);
  g.rect(2, 10, 7, 1, CORK[1]);
  g.rect(3, 11, 5, 2, '#f0f0ec');
  g.set(5, 11, '#ffffff');
  g.set(6, 11, '#ffffff');
  g.rect(2, 13, 7, 1, RED[1]);
  g.rect(11, 8, 3, 6, '#7aa49c');
  g.rect(11, 8, 3, 1, IRON[1]);
  g.rect(11, 10, 3, 3, IRON[1]);
  g.outline(OUT);
  return g.rows();
}

function notice() {
  const g = new Grid(16, 32);
  card(g, 3, 3, 10, 9);
  g.rect(5, 5, 6, 1, RED[1]);
  nail(g, 8, 1);
  // The bucket underneath, fish heads over the rim.
  g.rect(3, 22, 10, 9, IRON[1]);
  g.rect(3, 22, 10, 2, IRON[2]);
  g.rect(3, 29, 10, 2, IRON[0]);
  g.rect(4, 20, 4, 3, '#a8b4b4');
  g.set(5, 21, INK);
  g.rect(8, 21, 4, 2, '#8a9898');
  g.rect(10, 19, 2, 2, '#a8b4b4');
  g.outline(OUT);
  return g.rows();
}

function tideTable() {
  const g = new Grid(16, 32);
  card(g, 2, 3, 12, 15);
  // A line of waves across it, and a tick by every one.
  for (let x = 3; x <= 12; x++) g.set(x, 7 + Math.round(Math.sin((x - 3) * 0.9)), '#3e6a78');
  for (let x = 3; x <= 12; x++) g.set(x, 12 + Math.round(Math.sin((x - 3) * 0.9 + 1)), '#3e6a78');
  g.set(12, 15, '#4a8a5a');
  g.set(11, 16, '#4a8a5a');
  nail(g, 3, 1);
  nail(g, 12, 1);
  // A stack of old tide books under it.
  g.rect(2, 22, 10, 3, '#5a6a3a');
  g.rect(3, 22, 8, 1, '#7a8a4a');
  g.rect(2, 25, 12, 3, RED[0]);
  g.rect(3, 25, 10, 1, RED[1]);
  g.rect(2, 28, 12, 3, '#3e5a68');
  g.rect(3, 28, 9, 1, '#6a8a96');
  g.outline(OUT);
  return g.rows();
}

// One third of the workbench. `gift` is what's on it ('hero', 'ves', 'bramble', or 'none').
function bench(gift, pos) {
  const g = new Grid(16, 24);
  // The top and its front edge, and the apron under it.
  g.rect(0, 12, 16, 3, WOOD[3]);
  g.rect(0, 14, 16, 1, WOOD[2]);
  g.rect(0, 15, 16, 4, WOOD[1]);
  g.rect(0, 15, 16, 1, WOOD[0]);
  if (pos === 0) g.rect(1, 19, 3, 5, WOOD[1]);
  if (pos === 2) g.rect(12, 19, 3, 5, WOOD[1]);
  if (pos === 1) {
    g.rect(0, 21, 16, 2, WOOD[2]);
    g.rect(0, 22, 16, 1, WOOD[1]);
  } else {
    g.rect(pos === 0 ? 1 : 12, 21, 3, 2, WOOD[2]);
  }
  // The gift.
  if (gift === 'hero') {
    // A rolled scarf in oilskin yellow, tied with string.
    g.oval(8, 7, 6, 3, OIL[1]);
    g.rect(3, 6, 10, 1, OIL[2]);
    g.rect(3, 8, 10, 1, OIL[0]);
    g.rect(7, 4, 2, 7, ROPE[1]);
    g.set(8, 3, ROPE[2]);
    g.set(7, 2, ROPE[2]);
  } else if (gift === 'ves') {
    // A hat, quite ugly: mustard-green dome, floppy brim, one pink bobble.
    g.oval(8, 6, 4, 3, '#7a8a2a');
    g.rect(2, 8, 12, 2, '#a0b038');
    g.rect(2, 9, 12, 1, '#5a6a1a');
    g.rect(5, 4, 1, 3, '#a0b038');
    g.oval(8, 1, 1, 1, '#e87aa0');
  } else if (gift === 'bramble') {
    // A cork float on a loop of string, one red band.
    g.oval(8, 7, 4, 3, CORK[1]);
    g.rect(4, 6, 8, 2, RED[1]);
    g.set(6, 5, CORK[2]);
    g.rect(7, 2, 2, 1, ROPE[2]);
    g.set(6, 3, ROPE[2]);
    g.set(9, 3, ROPE[2]);
    g.set(7, 4, ROPE[1]);
    g.set(8, 4, ROPE[1]);
  }
  // The label card, propped on the front edge of the bench.
  g.outline(OUT);
  g.rect(4, 8, 8, 5, OUT);
  g.rect(5, 9, 6, 3, PAPER[2]);
  g.rect(5, 11, 6, 1, PAPER[1]);
  g.rect(6, 9, 4, 1, INK);
  g.rect(6, 10, 3, 1, INK);
  return g.rows();
}

export const HS_PROP_SPRITES = {
  hs_open_door: openDoor(),
  hs_oars: oars(),
  hs_nets: nets(),
  hs_floats: floats(),
  hs_cabinet: cabinet(),
  hs_notice: notice(),
  hs_tide_table: tideTable(),
};
for (const gift of ['hero', 'ves', 'bramble', 'none']) {
  for (const pos of [0, 1, 2]) HS_PROP_SPRITES[`hs_bench_${gift === 'none' ? 'empty' : gift}_${pos}`] = bench(gift, pos);
}

// The colours the rows above use (on private characters), for PROP_PALETTE.
export const HS_PALETTE_EXTRA = palette;

// How many tiles wide each big one stands.
export const HS_FOOTPRINTS = {
  hs_floats: 2,
};
