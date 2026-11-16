// Props for the life pass in Belowtown (chapter 4's buried town): things the
// folk have left lying about. Tubs of mushrooms, a pot on its tripod, drying
// racks, a pick rack, a market chalkboard, pigeons on the cobbles, toys, a
// cat's dish, posters pinned to the wall. Each prop is drawn onto a small grid
// (16 px to a tile, standing on the bottom edge), with colours that get
// characters of their own so none can clash with another art file's.
//
// The ones that move are also animations (NAME_SPRITES with NAME_PALETTE, see
// src/engine/animations.js): put `animation: 'bt_cook_pot'` on a prop of that name.

class Grid {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.cells = Array.from({ length: h }, () => Array(w).fill('.'));
  }
  px(x, y, c) { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.cells[y][x] = c; return this; }
  at(x, y) { return this.cells[y]?.[x] ?? '.'; }
  rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.px(x + i, y + j, c); return this; }
  ell(cx, cy, rx, ry, c) {
    for (let y = Math.ceil(cy - ry); y <= Math.floor(cy + ry); y++) {
      const t = ry ? (y - cy) / ry : 0;
      const dx = rx * Math.sqrt(Math.max(0, 1 - t * t));
      for (let x = Math.round(cx - dx); x <= Math.round(cx + dx); x++) this.px(x, y, c);
    }
    return this;
  }
  line(x0, y0, x1, y1, c) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) this.px(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c);
    return this;
  }
  outline(c = 'k') {
    const marks = [];
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      if (this.cells[y][x] !== '.') continue;
      if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => this.at(x + dx, y + dy) !== '.' && this.at(x + dx, y + dy) !== c)) marks.push([x, y]);
    }
    for (const [x, y] of marks) this.cells[y][x] = c;
    return this;
  }
  rows() { return this.cells.map((r) => r.join('')); }
}

const BL_PALETTE_EXTRA = {};
const BL_PROP_SPRITES = {};
const BL_FOOTPRINTS = {};
let nextChar = 0x8c00;
const charFor = new Map();
// One character per colour, shared by everything in this file.
function charOf(color) {
  if (!charFor.has(color)) {
    const ch = String.fromCharCode(nextChar++);
    charFor.set(color, ch);
    BL_PALETTE_EXTRA[ch] = color;
  }
  return charFor.get(color);
}
function register(name, palette, rows, footprint) {
  BL_PROP_SPRITES[name] = rows.map((row) => [...row].map((ch) => (palette[ch] ? charOf(palette[ch]) : '.')).join(''));
  if (footprint > 1) BL_FOOTPRINTS[name] = footprint;
}
function still(name, w, h, draw, footprint = 1) {
  const g = new Grid(w, h);
  draw(g);
  register(name, P, g.rows(), footprint);
}
function moving(name, w, h, count, draw, footprint = 1) {
  const list = Array.from({ length: count }, (_, i) => { const g = new Grid(w, h); draw(g, i); return g.rows(); });
  register(name, P, list[0], footprint);
  return Object.fromEntries(list.map((rows, i) => ['abcdefgh'[i], rows.map((row) => [...row].map((ch) => (P[ch] ? charOf(P[ch]) : '.')).join(''))]));
}

// One palette for the lot.
const P = {
  k: '#120c1c',
  m: '#7a5630', l: '#a77a48', d: '#4a3018', D: '#2a1c10',
  i: '#5a5a68', I: '#8a8a9a', j: '#2e2e38',
  r: '#c8503a', R: '#8a3024', w: '#f0e4c8', e: '#e0d0a8', E: '#b8a47c',
  o: '#e8a040', O: '#a86a20', h: '#c8648a', H: '#8a3a60',
  g: '#8affa0', G: '#3a9a5a', y: '#f0d050', Y: '#b8982c',
  p: '#e8dcc0', P: '#b8a888',
  b: '#4a6a9a', B: '#2e4a78',
  f: '#ffb040', F: '#ff6a20', c: '#2a2224',
  s: '#6a6460', S: '#8a847c', t: '#3e3a38',
  n: '#4a7a3a', N: '#2e5a28',
  u: '#5a3a24', U: '#3a2418',
  z: '#9a9aa6', x: '#d8c8e8', v: '#7a6a90',
};

// A tub with mushrooms growing out of the soil: a tall red one, a short orange, a pink, a glowing one.
still('bt_mushroom_tub', 16, 16, (g) => {
  g.rect(2, 10, 12, 5, 'm').rect(1, 9, 14, 2, 'l').rect(2, 11, 12, 1, 'd').rect(2, 14, 12, 1, 'D');
  for (const x of [5, 8, 11]) g.rect(x, 11, 1, 4, 'd');
  g.rect(2, 9, 12, 1, 'u');
  g.rect(5, 4, 2, 5, 'e').ell(6, 4, 3.4, 2, 'r').px(5, 3, 'w').px(7, 4, 'w').px(4, 4, 'R').px(8, 5, 'R');
  g.rect(10, 6, 2, 3, 'e').ell(11, 6, 2.4, 1.4, 'o').px(10, 5, 'w');
  g.rect(2, 7, 1, 2, 'e').ell(2, 7, 1.6, 1.2, 'h').px(2, 6, 'w');
  g.px(8, 8, 'g').px(8, 7, 'G').px(13, 8, 'g');
  g.outline('k');
});

// A pot hung from a tripod over coals; the embers flicker.
const cookPot = moving('bt_cook_pot', 16, 16, 2, (g, i) => {
  g.line(8, 1, 3, 14, 'd').line(8, 1, 13, 14, 'd').line(8, 1, 8, 9, 'm');
  g.px(8, 0, 'l');
  g.rect(4, 12, 8, 3, 'c').rect(5, 11, 6, 1, 'c');
  g.px(5, 12, i ? 'F' : 'f').px(7, 13, i ? 'f' : 'F').px(9, 12, i ? 'f' : 'F').px(10, 13, i ? 'F' : 'f').px(6, 13, 'F');
  g.ell(8, 8, 4.5, 3.4, 'i').rect(4, 5, 9, 1, 'I').rect(5, 6, 7, 1, 'j').px(4, 7, 'I').px(5, 7, 'I');
  g.rect(5, 5, 7, 1, 'z');
  g.px(7, 4, i ? 'e' : 'p');
  g.outline('k');
});

// A three-legged stool, a mug left on it.
still('bt_stool', 16, 16, (g) => {
  g.rect(3, 9, 10, 3, 'l').rect(3, 9, 10, 1, 'e').rect(3, 11, 10, 1, 'd');
  g.rect(4, 12, 2, 3, 'm').rect(10, 12, 2, 3, 'm').rect(7, 12, 2, 2, 'd');
  g.rect(9, 6, 3, 3, 'I').px(12, 7, 'i').px(9, 6, 'z').px(10, 5, 'p');
  g.outline('k');
});

// A rack of picks and shovels with a hard hat on the top peg.
still('bt_pick_rack', 16, 24, (g) => {
  g.rect(1, 21, 14, 2, 'D').rect(2, 8, 2, 14, 'm').rect(12, 8, 2, 14, 'm').rect(1, 7, 14, 2, 'l').rect(1, 8, 14, 1, 'd');
  g.rect(2, 14, 12, 1, 'd');
  g.rect(5, 9, 1, 12, 'l').line(2, 9, 8, 9, 'I').line(3, 10, 8, 10, 'i');
  g.rect(8, 9, 1, 12, 'm').px(7, 9, 'I').px(9, 9, 'I').px(6, 10, 'I').px(10, 10, 'I');
  g.rect(10, 10, 1, 11, 'l').rect(9, 19, 3, 2, 'I');
  g.ell(7, 5, 3.6, 2, 'y').rect(4, 6, 7, 1, 'Y').px(7, 3, 'f').px(5, 4, 'w');
  g.outline('k');
});

// A bucket and a mop propped on it, a puddle spreading.
still('bt_bucket_mop', 16, 16, (g) => {
  g.rect(3, 9, 8, 6, 'I').rect(3, 9, 8, 1, 'z').rect(3, 12, 8, 1, 'i').rect(8, 10, 3, 5, 'i');
  g.rect(4, 10, 6, 1, 'b').px(5, 10, 'x');
  g.line(10, 8, 13, 1, 'l').line(11, 8, 14, 1, 'm');
  g.rect(9, 7, 4, 2, 'p').px(9, 8, 'P').px(11, 8, 'P');
  g.outline('k');
});

// A crate of mushrooms and roots, a chalked price on the front.
still('bt_produce_crate', 16, 16, (g) => {
  g.rect(1, 8, 14, 7, 'm').rect(1, 8, 14, 1, 'l').rect(1, 11, 14, 1, 'd').rect(12, 9, 3, 6, 'd');
  g.px(2, 9, 'D').px(2, 13, 'D').px(13, 9, 'D');
  g.ell(4, 6, 2.5, 1.8, 'r').px(3, 5, 'w').px(5, 6, 'w').rect(3, 7, 2, 1, 'e');
  g.ell(8, 6, 2.2, 1.5, 'o').px(8, 5, 'w').rect(7, 7, 2, 1, 'e');
  g.ell(11, 6, 2.2, 1.6, 'h').px(10, 5, 'w').rect(10, 7, 2, 1, 'e');
  g.rect(3, 12, 4, 2, 'p').px(4, 13, 'D').px(6, 13, 'D');
  g.outline('k');
});

// Sacks of flour and spore-meal, one slumped over.
still('bt_sacks', 16, 16, (g) => {
  g.ell(5, 11, 4.2, 4, 'P').ell(11, 12, 3.6, 3.2, 'p').ell(8, 7, 3.4, 2.6, 'e');
  g.rect(3, 8, 4, 1, 'E').rect(10, 10, 3, 1, 'P').px(8, 4, 'E');
  g.px(5, 12, 'D').px(6, 12, 'D').px(11, 12, 'D');
  g.rect(8, 5, 1, 2, 'E');
  g.outline('k');
});

// A coil of rope on the floor.
still('bt_rope_coil', 16, 16, (g) => {
  g.ell(8, 11, 6, 3, 'O').ell(8, 10, 5, 2.4, 'o').ell(8, 10, 2.6, 1, 'D');
  g.line(2, 11, 4, 8, 'o').px(14, 12, 'O');
  g.rect(8, 5, 1, 4, 'o').px(8, 4, 'O');
  g.outline('k');
});

// A game of stones scratched into a flagstone, with a few pebbles left on it.
still('bt_dice_board', 16, 16, (g) => {
  for (const x of [4, 8, 12]) g.rect(x, 5, 1, 9, 't');
  for (const y of [6, 9, 12]) g.rect(2, y, 12, 1, 't');
  g.ell(5.5, 7.5, 1.3, 1, 'z').ell(9.5, 10.5, 1.3, 1, 'y').ell(9.5, 7.5, 1.3, 1, 'z').ell(5.5, 13, 1.1, 0.8, 'y');
  g.px(14, 4, 'S');
});

// Little glowing mushrooms in a crack of the floor (a: green, b: blue-white).
const glowPatch = (name, light, mid) => still(name, 16, 16, (g) => {
  const stems = [[4, 11, 2], [8, 10, 3], [11, 12, 2], [6, 13, 1]];
  for (const [x, y, h] of stems) {
    g.rect(x, y, 1, h, 'E').ell(x + 0.5, y, 1.8, 1.2, mid).px(x, y - 1, light).px(x - 1, y, light);
  }
  g.px(2, 14, 'N').px(13, 14, 'N').px(9, 14, 'n');
});
glowPatch('bt_glow_patch_a', 'g', 'G');
glowPatch('bt_glow_patch_b', 'x', 'v');

// A tall mushroom, as high as the doors, with spots; the corners of the town grow them.
still('bt_tall_shroom', 16, 32, (g) => {
  g.rect(6, 12, 4, 18, 'e').rect(6, 12, 1, 18, 'w').rect(9, 12, 1, 18, 'E');
  g.rect(5, 28, 6, 2, 'E').rect(4, 29, 8, 2, 'P');
  g.ell(8, 9, 7, 5, 'r').rect(2, 9, 12, 2, 'R').rect(3, 11, 10, 1, 'R');
  g.ell(5, 7, 1.2, 1, 'w').ell(10, 6, 1.4, 1, 'w').ell(8, 9, 1, 0.8, 'w').px(12, 9, 'w');
  g.px(8, 12, 'E').px(7, 12, 'E').px(9, 12, 'E');
  g.outline('k');
});

// A drying rack with strings of mushrooms and chillies hung from the bar (posts at both ends).
still('bt_drying_rack', 32, 16, (g) => {
  g.rect(1, 3, 2, 12, 'm').rect(29, 3, 2, 12, 'm').rect(0, 14, 4, 2, 'd').rect(28, 14, 4, 2, 'd');
  g.rect(0, 2, 32, 2, 'l').rect(0, 3, 32, 1, 'd');
  const strings = [[6, 'r', 'e'], [11, 'o', 'e'], [16, 'h', 'e'], [21, 'r', 'o'], [25, 'e', 'e']];
  for (const [x, a, b] of strings) {
    g.rect(x, 4, 1, 9, 'D');
    g.ell(x, 6, 1.6, 1.2, a).ell(x, 9, 1.6, 1.2, b).ell(x, 12, 1.4, 1.2, a);
    g.px(x - 1, 5, 'w');
  }
  g.outline('k');
}, 2);

// A hand cart tipped up, still half full of ore.
still('bt_hand_cart', 32, 16, (g) => {
  g.rect(4, 6, 20, 7, 'm').rect(4, 6, 20, 1, 'l').rect(4, 10, 20, 1, 'd').rect(21, 7, 3, 6, 'd');
  g.ell(9, 5, 5, 2, 's').ell(16, 5, 4, 2, 'S').px(12, 4, 'o').px(7, 4, 'o').px(18, 4, 'g');
  g.ell(10, 13, 3.4, 3, 'D').ell(10, 13, 2, 1.8, 'l').px(10, 13, 'i');
  g.line(24, 8, 31, 12, 'l').line(24, 9, 31, 13, 'm');
  g.rect(28, 13, 2, 2, 'd');
  g.outline('k');
}, 2);

// Posters pinned to the wall. a: a lost-pet notice with a drawn bat. b: a band's gig.
still('bt_poster_a', 16, 16, (g) => {
  g.rect(3, 3, 10, 11, 'p').rect(3, 13, 10, 1, 'P').rect(12, 3, 1, 11, 'P');
  g.px(3, 3, 'D').px(12, 3, 'D').px(3, 13, 'D').px(12, 13, 'D');
  g.rect(5, 5, 6, 1, 'D').rect(6, 7, 4, 1, 't');
  g.ell(8, 10, 2.4, 1.2, 't').px(6, 9, 't').px(10, 9, 't').px(7, 11, 't').px(9, 11, 't');
  g.outline('k');
});
still('bt_poster_b', 16, 16, (g) => {
  g.rect(2, 4, 12, 9, 'y').rect(2, 12, 12, 1, 'Y').rect(13, 4, 1, 9, 'Y');
  g.px(2, 4, 'D').px(13, 4, 'D').px(2, 12, 'D').px(13, 12, 'D');
  g.rect(4, 6, 8, 1, 'R').rect(5, 8, 6, 1, 'B').rect(4, 10, 3, 1, 'R').rect(9, 10, 3, 1, 'B');
  g.outline('k');
});

// A standing chalkboard with the day's specials in a hurry.
still('bt_menu_board', 16, 24, (g) => {
  g.line(3, 22, 5, 7, 'd').line(13, 22, 11, 7, 'd').rect(2, 21, 3, 2, 'D').rect(11, 21, 3, 2, 'D');
  g.rect(3, 5, 10, 13, 'l').rect(4, 6, 8, 11, 'c').rect(4, 6, 8, 1, 't');
  g.rect(5, 8, 6, 1, 'p').rect(5, 10, 4, 1, 'p').rect(5, 12, 5, 1, 'p').rect(5, 14, 3, 1, 'e').px(10, 14, 'e').rect(10, 10, 1, 1, 'y');
  g.rect(3, 17, 10, 1, 'd');
  g.px(5, 16, 'p').px(11, 16, 'P');
  g.outline('k');
});

// Two pigeons that live in the roof, pecking at crumbs on the cobbles.
const pigeons = moving('bt_pigeons', 16, 16, 4, (g, i) => {
  const peck = i === 1 || i === 3;
  const bird = (x, y, flip, down) => {
    const s = flip ? -1 : 1;
    g.ell(x, y - 3, 3, 2.2, 'z').px(x + s * 2, y - 3, 'I').px(x - s * 2, y - 2, 'i');
    g.rect(x + s * 3 - (s < 0 ? 0 : 0), y - (down ? 3 : 5), 2, down ? 2 : 3, 'I').px(x + s * 4, y - (down ? 2 : 5), 'o').px(x + s * 4, y - (down ? 2 : 4), 'f');
    g.px(x + s * 3, y - (down ? 3 : 5), 'w').px(x - 1, y - 1, 'o').px(x + 1, y - 1, 'o');
    g.px(x, y - 4, 'x');
  };
  bird(5, 13, false, peck);
  bird(11, 14, true, !peck);
  g.px(7, 15, 'e').px(9, 15, 'E').px(8, 14, 'e');
  g.outline('k');
});

// Toys left in the road: a wooden sword stuck in a crumb of cheese, and a top.
still('bt_toys', 16, 16, (g) => {
  g.line(4, 13, 10, 5, 'l').line(5, 13, 11, 5, 'e').px(10, 4, 'z').px(11, 4, 'z');
  g.rect(3, 12, 4, 1, 'O').rect(2, 13, 2, 1, 'o');
  g.ell(12, 12, 2.6, 1.6, 'r').rect(10, 11, 5, 1, 'y').px(12, 14, 'k').px(12, 10, 'l');
  g.outline('k');
});

// A cat's dish by the wall: fish bones, and the dish licked clean.
still('bt_cat_dish', 16, 16, (g) => {
  g.ell(8, 12, 5, 2.4, 'b').ell(8, 11, 4, 1.6, 'B').ell(8, 11.5, 2.4, 0.8, 'p');
  g.line(5, 11, 11, 11, 'w').px(5, 10, 'w').px(5, 12, 'w').px(11, 10, 'w').px(11, 12, 'w');
  g.rect(2, 14, 1, 1, 'e').rect(13, 14, 1, 1, 'e');
  g.outline('k');
});

// A rail of pegs on the wall with a cap, an apron and a lantern hung from them.
still('bt_wall_pegs', 16, 16, (g) => {
  g.rect(1, 4, 14, 2, 'l').rect(1, 5, 14, 1, 'd');
  g.rect(3, 6, 1, 1, 'O').rect(8, 6, 1, 1, 'O').rect(12, 6, 1, 1, 'O');
  g.rect(2, 6, 3, 3, 'h').rect(2, 9, 3, 3, 'H').px(3, 8, 'H');
  g.rect(7, 6, 3, 1, 'i').rect(6, 7, 5, 4, 'f').rect(7, 8, 3, 2, 'F').rect(6, 11, 5, 1, 'j');
  g.ell(12.5, 8, 2, 1.4, 'b').rect(11, 8, 4, 1, 'B');
  g.outline('k');
});

// A little round table outside, with a teapot and two cups.
still('bt_tea_table', 16, 16, (g) => {
  g.ell(8, 8, 6.4, 2.4, 'l').ell(8, 8, 6.4, 1.2, 'e');
  g.rect(7, 10, 2, 5, 'm').rect(4, 14, 8, 1, 'd');
  g.ell(7, 6, 2.2, 1.6, 'r').px(7, 4, 'w').rect(9, 5, 2, 1, 'r').px(5, 5, 'r');
  g.rect(11, 6, 2, 2, 'p').rect(3, 7, 2, 1, 'p');
  g.outline('k');
});

// A tall rough stalagmite, for the corners (and the shadows behind things).
still('bt_stalagmite', 16, 24, (g) => {
  g.rect(4, 21, 9, 2, 't');
  for (let y = 4; y < 22; y++) {
    const half = Math.round(1 + (y - 4) * 0.34);
    g.rect(8 - half, y, half * 2 + 1, 1, y % 5 < 2 ? 'S' : 's');
    g.px(8 + half, y, 't');
  }
  g.px(7, 6, 'z').px(7, 12, 'z').px(10, 16, 'n').px(6, 18, 'n').px(9, 19, 'N');
  g.outline('k');
});

// Hand-me-down shoes lined up outside a round door, smallest at the end.
still('bt_doorstep_shoes', 16, 16, (g) => {
  g.ell(4, 13, 2.6, 1.6, 'u').ell(9, 13, 2, 1.3, 'm').ell(13, 13, 1.4, 1, 'O');
  g.px(3, 12, 'l').px(9, 12, 'l').px(13, 12, 'o');
  g.rect(2, 14, 12, 1, 'D');
  g.outline('k');
});

export { BL_PALETTE_EXTRA, BL_PROP_SPRITES, BL_FOOTPRINTS };
export const BT_COOK_POT_PALETTE = Object.fromEntries(Object.entries(P).map(([k, v]) => [charOf(v), v]));
export const BT_COOK_POT_SPRITES = cookPot;
export const BT_PIGEONS_PALETTE = BT_COOK_POT_PALETTE;
export const BT_PIGEONS_SPRITES = pigeons;
