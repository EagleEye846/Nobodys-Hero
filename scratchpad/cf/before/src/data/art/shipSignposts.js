// The ghost ship's signposts to her shard (chapter 5): two props, drawn in code like the rest of the
// ship's art (src/data/art/ghostShip.js), with their own palette characters (U+E100 on).
//   gs_bow_star       the stem head at the very point of the main deck's bow rail (ship_deck 40,10): a stout
//                     timber with the heel of the bowsprit lashed to it, running out east into the fog, and at
//                     the end of what you can see of it, a pale blue spark. Its glow (SHIP_SIGN_GLOWS) is the
//                     light out past the bow. Until the figurehead has been dealt with.
//   gs_bow_dark       the same, after: no spark, no glow.
//   gs_chart_table_book  the captain's chart table with his book left on it, shut, a ribbon in it (ship_cabin
//                     10,5, after the captain is spared or beaten, until you take it: the CAPTAIN'S BOOK).
import { GS_PROP_SPRITES } from './ghostShip.js';

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xe100 + colors.size);
    colors.set(hex, c);
    palette[c] = hex;
  }
  return colors.get(hex);
}

const OUT = '#0c0a08';
const WOOD = ['#1c1510', '#33271c', '#4c3b2a', '#6a5640', '#8a7456'];
const IRON = ['#1a1c20', '#2c3036', '#4a5058'];
const ROPE = ['#3a3222', '#6a5a3a', '#8a7a52'];
const STAR = ['#4a7aa8', '#8fc8ff', '#d6eeff', '#ffffff'];

class Grid {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.cells = Array.from({ length: h }, () => Array(w).fill(null));
  }

  set(x, y, c) {
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.cells[y][x] = c;
  }

  get(x, y) {
    return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.cells[y][x] : null;
  }

  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
  }

  outline(c) {
    const edge = [];
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
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

// The stem head: a timber post standing up from the point of the rail, capped, and the bowsprit's heel
// lashed to it and running off up to the right (east), out over the bow. `lit`: the spark at its end.
function bowStem(lit) {
  const g = new Grid(16, 30);
  // The bowsprit, rising east from the post (2 px thick), cut off by the sprite's edge as it goes into the fog.
  for (let i = 0; i < 9; i++) {
    const x = 7 + i;
    const y = 15 - Math.floor(i / 2);
    g.set(x, y, WOOD[3]);
    g.set(x, y + 1, WOOD[1]);
  }
  // Its lashing to the post.
  g.set(9, 13, ROPE[2]); g.set(9, 14, ROPE[1]); g.set(10, 14, ROPE[2]); g.set(9, 16, ROPE[1]);
  // The post.
  g.rect(4, 8, 4, 22, WOOD[2]);
  g.rect(4, 8, 1, 22, WOOD[3]);
  g.rect(7, 8, 1, 22, WOOD[0]);
  g.rect(3, 6, 6, 3, WOOD[3]);
  g.rect(3, 6, 6, 1, WOOD[4]);
  g.rect(4, 4, 4, 2, WOOD[2]);
  // An iron band and a ring bolt.
  g.rect(4, 20, 4, 1, IRON[2]);
  g.set(3, 23, IRON[2]); g.set(2, 24, IRON[1]);
  g.rect(3, 28, 6, 2, WOOD[1]);
  g.outline(OUT);
  if (lit) {
    // The spark, out at the end of the bowsprit, in the fog: a little cross, brightest in the middle.
    g.set(14, 7, STAR[3]);
    g.set(13, 7, STAR[1]); g.set(15, 7, STAR[1]); g.set(14, 6, STAR[1]); g.set(14, 8, STAR[1]);
    g.set(12, 7, STAR[0]); g.set(14, 5, STAR[0]); g.set(14, 9, STAR[0]);
    g.set(13, 6, STAR[0]); g.set(15, 8, STAR[0]);
  }
  return g.rows();
}

// The chart table (ghostShip.js's own drawing, untouched) with the captain's book shut on it: dark
// leather, a brass clasp, the page edges showing, a blue ribbon hanging out over the table's edge.
function chartTableBook() {
  const base = GS_PROP_SPRITES.gs_chart_table;
  // The table stays in its own palette characters; the book is drawn over it in ours.
  const own = base.map((row) => [...row]);
  const put = (x, y, hex) => {
    if (y >= 0 && y < own.length && x >= 0 && x < own[y].length) own[y][x] = char(hex);
  };
  const LEATHER = ['#2a1210', '#4a2018', '#6a3222'];
  const PAGES = '#d8ceb0';
  // Its outline, then the cover (x 13-21, y 8-14), then the page edges along the right and the foot.
  for (let y = 7; y <= 16; y++) for (let x = 12; x <= 23; x++) put(x, y, OUT);
  for (let y = 8; y <= 14; y++) for (let x = 13; x <= 21; x++) put(x, y, LEATHER[1]);
  for (let x = 13; x <= 21; x++) put(x, 8, LEATHER[2]);
  for (let y = 8; y <= 14; y++) put(13, y, LEATHER[0]);
  for (let y = 9; y <= 15; y++) put(22, y, PAGES);
  for (let x = 14; x <= 22; x++) put(x, 15, PAGES);
  put(22, 8, OUT);
  // A tooled line round the cover, and the clasp.
  for (let x = 15; x <= 19; x++) put(x, 10, LEATHER[0]);
  for (let x = 15; x <= 19; x++) put(x, 12, LEATHER[0]);
  put(21, 11, '#c49a38'); put(22, 11, '#f0d070'); put(21, 12, '#8a6420');
  // The ribbon, out of the foot and down over the table's edge.
  put(17, 16, '#3a5a8a'); put(17, 17, '#3a5a8a'); put(18, 17, '#5a7aaa'); put(17, 18, '#3a5a8a');
  return own.map((cells) => cells.join(''));
}

export const SHIP_SIGN_PALETTE = palette;

export const SHIP_SIGN_PROP_SPRITES = {
  gs_bow_star: bowStem(true),
  gs_bow_dark: bowStem(false),
  gs_chart_table_book: chartTableBook(),
};

export const SHIP_SIGN_FOOTPRINTS = { gs_chart_table_book: 2 };

// The light out past the bow (lamplight.js): a cold blue bloom at the spark, and a faint pool on the fog
// around the rail's point. Steady (it's a star, not a flame), only a whisper of flicker.
export const SHIP_SIGN_GLOWS = {
  gs_bow_star: [
    { dx: 6, dy: -22, bloom: 16, strength: 0.8, flicker: 0.06, color: '160, 214, 255' },
    { dx: 4, dy: -12, pool: 64, strength: 0.42, flicker: 0.04, color: '120, 190, 255' },
  ],
};
