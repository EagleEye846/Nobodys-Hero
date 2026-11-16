// Small lives and farm things for Sunnyside, Haddock's rooms and the chapter 5 secret rooms (the
// life pass, round 2). Cows, a hen house, hay, a cart, a well, turnips, dandelions and poppies, a fairy
// ring, a mole hill, things Marigold and Tolliver left lying about. Almost all of them are meant to be
// placed as `walkable` props (nothing with a body) so none can stand in a route, a push, a gust or a
// cutscene walk. Drawn like saltLife.js: a small Grid of hex colours turned into rows on private
// characters (a range no other art file uses). The ones that move are also animations (NAME_SPRITES,
// NAME_PALETTE): put the name in the prop's `animation` with a `speed`. Every id starts `r5s_`.

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xb800 + colors.size);
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
    return this;
  }
  get(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.cells[y][x] : null; }
  rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c); return this; }
  line(x0, y0, x1, y1, c) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) this.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c);
    return this;
  }
  oval(cx, cy, rx, ry, c) {
    for (let y = Math.ceil(cy - ry); y <= Math.floor(cy + ry); y++) {
      const t = ry ? (y - cy) / ry : 0;
      const dx = rx * Math.sqrt(Math.max(0, 1 - t * t));
      for (let x = Math.round(cx - dx); x <= Math.round(cx + dx); x++) this.set(x, y, c);
    }
    return this;
  }
  outline(c = OL) {
    const edge = [];
    for (let y = -1; y <= this.h; y++) {
      for (let x = -1; x <= this.w; x++) {
        if (this.get(x, y)) continue;
        if (this.get(x - 1, y) || this.get(x + 1, y) || this.get(x, y - 1) || this.get(x, y + 1)) edge.push([x, y]);
      }
    }
    for (const [x, y] of edge) this.set(x, y, c);
    return this;
  }
  rows() { return this.cells.map((row) => row.map((c) => (c ? char(c) : '.')).join('')); }
}

const R5S_PROP_SPRITES = {};
const R5S_FOOTPRINTS = {};
function still(name, w, h, draw, footprint = 1) {
  const g = new Grid(w, h);
  draw(g);
  R5S_PROP_SPRITES[name] = g.rows();
  if (footprint > 1) R5S_FOOTPRINTS[name] = footprint;
}
function moving(name, w, h, count, draw, footprint = 1) {
  const list = Array.from({ length: count }, (_, i) => { const g = new Grid(w, h); draw(g, i); return g.rows(); });
  R5S_PROP_SPRITES[name] = list[0];
  if (footprint > 1) R5S_FOOTPRINTS[name] = footprint;
  return Object.fromEntries(list.map((rows, i) => ['abcdefgh'[i], rows]));
}

const OL = '#3a2a1c';
const WOOD = ['#4a3220', '#6e4a2c', '#9a6c3e', '#c49a62'];
const GRASS = ['#2e6a2a', '#3f8a35', '#5eaa48', '#86c864'];
const HAY = ['#a8803a', '#d0a850', '#ecd078', '#f8e8a0'];
const STONE = ['#5a5a5e', '#82827e', '#aaaaa4', '#cfcfc6'];
const WHITE = '#f8f4ea';
const CREAM = '#e8e0cc';
const RED = ['#8a2a22', '#c4443a', '#e8685a'];
const WATER = ['#3a78a8', '#5aa0cc', '#9ad0e8', '#d8f0fa'];

// ---------------------------------------------------------------- Cows
// A cow standing side-on, facing left, 2 tiles wide. b: the tail flicks and she lowers her head to graze.
const cowFrames = moving('r5s_cow', 32, 24, 2, (g, i) => {
  const body = WHITE; const shade = '#d6ccb8'; const patch = '#6a4630'; const dark = '#2e2018';
  // Legs behind and in front.
  for (const lx of [10, 13, 22, 25]) { g.rect(lx, 16, 2, 6, lx === 13 || lx === 25 ? shade : body); g.rect(lx, 21, 2, 2, dark); }
  // Body and belly.
  g.oval(18, 12, 11, 6.4, body);
  g.rect(8, 14, 21, 4, shade);
  g.oval(18, 12, 10, 5.4, body);
  // Patches.
  g.oval(15, 9, 3.2, 2.4, patch); g.oval(24, 12, 3, 3, patch); g.oval(20, 15, 2, 1.4, patch);
  // Udder.
  g.oval(24, 18, 2.4, 1.6, '#f0b0a8');
  // Neck, head, nose.
  const hy = i ? 14 : 11;
  g.oval(9, hy - 1, 3.6, 3.6, body);
  g.oval(5, hy + 1, 4, 3.6, body);
  g.oval(3, hy + 2, 2.6, 2, '#f0a8a0');
  g.set(2, hy + 2, '#7a3a3a').set(4, hy + 2, '#7a3a3a');
  g.set(5, hy - 1, dark).set(6, hy - 1, dark);
  g.oval(7, hy - 3, 1.6, 1.2, patch).oval(2, hy - 2, 1.4, 1, patch);
  g.set(4, hy - 4, '#e8d8a8').set(7, hy - 5, '#e8d8a8');
  g.rect(8, hy - 2, 2, 1, '#c0e0f8');
  // Tail with a tuft.
  if (i) { g.line(28, 8, 31, 12, shade).rect(30, 12, 2, 3, patch); } else { g.line(28, 8, 30, 14, shade).rect(29, 14, 2, 3, patch); }
  g.outline(OL);
});

// A cow lying down chewing, 2 tiles wide. b: the jaw moves.
const cowLie = moving('r5s_cow_lie', 32, 16, 2, (g, i) => {
  const body = WHITE; const shade = '#d6ccb8'; const patch = '#6a4630'; const dark = '#2e2018';
  g.oval(19, 9, 11, 5.4, body);
  g.rect(9, 11, 21, 4, shade);
  g.oval(19, 8, 10, 4.4, body);
  g.oval(16, 6, 3, 2, patch); g.oval(25, 9, 3, 3, patch);
  g.rect(8, 13, 7, 2, body).rect(8, 14, 2, 1, dark);
  g.oval(7, 8, 3.4, 3.2, body).oval(4, 9, 3.4, 2.8, body);
  g.oval(2, 10 + (i ? 1 : 0), 2.4, 1.8, '#f0a8a0');
  g.set(5, 7, dark).set(6, 7, dark);
  g.oval(7, 4, 1.4, 1, patch).set(5, 4, '#e8d8a8').set(8, 3, '#e8d8a8');
  g.line(29, 8, 30, 12, shade).rect(29, 12, 2, 2, patch);
  g.outline(OL);
}, 2);

// ---------------------------------------------------------------- The yard
const henHouse = () => still('r5s_hen_house', 32, 32, (g) => {
  // A little red coop on legs with a ramp and a round pop-hole.
  g.rect(4, 26, 2, 6, WOOD[0]).rect(25, 26, 2, 6, WOOD[0]);
  g.rect(3, 12, 26, 15, RED[1]).rect(3, 12, 26, 2, RED[2]).rect(3, 25, 26, 2, RED[0]);
  for (let x = 6; x < 28; x += 4) g.rect(x, 14, 1, 11, RED[0]);
  g.rect(0, 9, 32, 4, WOOD[1]).rect(2, 6, 28, 4, WOOD[2]).rect(5, 3, 22, 4, WOOD[2]).rect(8, 1, 16, 3, WOOD[3]);
  g.rect(2, 9, 28, 1, WOOD[0]).rect(5, 6, 22, 1, WOOD[0]);
  g.oval(21, 20, 3, 3.4, '#2a1a14').oval(21, 20, 2, 2.4, '#14100c');
  g.rect(6, 17, 7, 6, '#f0e4c4').rect(6, 17, 7, 1, WOOD[0]).rect(6, 22, 7, 1, WOOD[0]).rect(9, 17, 1, 6, WOOD[0]);
  // The ramp.
  g.rect(19, 26, 5, 1, WOOD[3]);
  g.line(21, 24, 25, 31, WOOD[2]).line(22, 24, 26, 31, WOOD[1]);
  for (let k = 0; k < 4; k++) g.rect(21 + k, 26 + k * 1.3, 3, 1, WOOD[0]);
  g.outline(OL);
}, 2);

const nest = () => still('r5s_nest', 16, 16, (g) => {
  g.oval(8, 11, 7, 3.4, HAY[0]).oval(8, 10, 6, 2.6, HAY[1]);
  g.oval(6, 9, 2, 1.6, '#f4ead2').oval(10, 9, 2, 1.6, '#f4ead2').oval(8, 11, 2, 1.6, '#e8d8b8');
  for (const [x, y] of [[2, 10], [13, 11], [4, 13], [11, 13], [8, 14]]) g.line(x, y, x + 2, y - 1, HAY[2]);
  g.outline(OL);
});

const trough = moving('r5s_trough', 32, 16, 2, (g, i) => {
  g.rect(2, 7, 28, 7, WOOD[1]).rect(2, 7, 28, 1, WOOD[3]).rect(2, 13, 28, 1, WOOD[0]);
  g.rect(4, 8, 24, 3, WATER[1]).rect(4, 8, 24, 1, WATER[0]);
  g.set(7 + i * 8, 9, WATER[3]).set(8 + i * 8, 9, WATER[3]).set(19 - i * 6, 10, WATER[2]);
  g.rect(4, 14, 3, 2, WOOD[0]).rect(25, 14, 3, 2, WOOD[0]);
  g.rect(14, 8, 1, 6, WOOD[0]);
  g.outline(OL);
}, 2);

const churn = () => still('r5s_churn', 16, 16, (g) => {
  g.rect(3, 5, 6, 9, '#b8bcc4').rect(3, 5, 1, 9, '#e0e4ea').rect(8, 5, 1, 9, '#7e828c');
  g.rect(2, 4, 8, 2, '#8a8e98').rect(4, 2, 4, 2, '#8a8e98').rect(5, 1, 2, 1, '#3a3a40');
  g.rect(3, 8, 6, 1, '#7e828c');
  g.rect(10, 9, 5, 5, '#cfa066').rect(10, 9, 5, 1, '#f2f4f6').rect(10, 13, 5, 1, '#8a5a2c');
  g.rect(14, 8, 1, 3, '#8a5a2c');
  g.outline(OL);
});

const roundBale = () => still('r5s_bale_round', 16, 16, (g) => {
  g.oval(8, 9, 7, 6.2, HAY[1]).oval(8, 9, 5.6, 4.8, HAY[2]).oval(8, 9, 3.6, 3, HAY[1]).oval(8, 9, 1.6, 1.4, HAY[0]);
  for (let a = 0; a < 6; a++) g.set(8 + Math.round(Math.cos(a) * 4.6), 9 + Math.round(Math.sin(a) * 3.8), HAY[0]);
  g.rect(2, 12, 12, 1, '#8a6c2c');
  g.outline(OL);
});

const baleStack = () => still('r5s_bale_stack', 32, 24, (g) => {
  const bale = (x, y, w, h) => { g.rect(x, y, w, h, HAY[1]).rect(x, y, w, 2, HAY[3]).rect(x, y + h - 1, w, 1, HAY[0]); g.rect(x + 4, y, 1, h, '#8a6c2c').rect(x + w - 5, y, 1, h, '#8a6c2c'); for (let k = 0; k < 4; k++) g.set(x + 6 + k * 3, y + 3 + (k % 2), HAY[0]); };
  bale(1, 14, 14, 9); bale(16, 14, 14, 9); bale(8, 5, 14, 9);
  g.rect(24, 3, 1, 13, WOOD[1]).line(22, 3, 22, 1, '#9aa0a8').line(24, 3, 24, 1, '#9aa0a8').line(26, 3, 26, 1, '#9aa0a8').rect(22, 3, 5, 1, '#9aa0a8');
  g.outline(OL);
}, 2);

const pitchfork = () => still('r5s_pitchfork', 16, 24, (g) => {
  g.rect(7, 6, 2, 16, WOOD[2]).rect(7, 6, 1, 16, WOOD[3]);
  g.rect(4, 3, 8, 2, '#8a8e98').rect(4, 0, 1, 4, '#b8bcc4').rect(7, 0, 1, 4, '#b8bcc4').rect(11, 0, 1, 4, '#b8bcc4');
  g.rect(3, 22, 10, 2, HAY[1]).rect(5, 21, 6, 1, HAY[2]);
  g.outline(OL);
});

const hayCart = () => still('r5s_hay_cart', 32, 24, (g) => {
  g.oval(14, 9, 11, 6, HAY[1]).oval(14, 7, 8, 4, HAY[2]);
  for (let k = 0; k < 7; k++) g.line(5 + k * 3, 6 + (k % 3), 7 + k * 3, 3, HAY[3]);
  g.rect(2, 12, 24, 3, WOOD[1]).rect(2, 12, 24, 1, WOOD[3]).rect(2, 14, 24, 1, WOOD[0]);
  g.oval(9, 18, 5, 5, WOOD[0]).oval(9, 18, 4, 4, WOOD[2]).oval(9, 18, 1.4, 1.4, WOOD[0]);
  g.line(9, 14, 9, 22, WOOD[0]).line(5, 18, 13, 18, WOOD[0]);
  g.rect(25, 14, 6, 1, WOOD[1]).rect(30, 13, 1, 3, WOOD[0]);
  g.rect(6, 22, 8, 1, '#00000030');
  g.outline(OL);
}, 2);

const well = () => still('r5s_well', 16, 32, (g) => {
  g.rect(2, 4, 12, 3, WOOD[2]).rect(1, 6, 14, 2, WOOD[1]).rect(4, 2, 8, 2, WOOD[3]).rect(6, 0, 4, 2, WOOD[3]);
  g.rect(2, 8, 2, 14, WOOD[1]).rect(12, 8, 2, 14, WOOD[1]);
  g.rect(3, 12, 10, 1, '#c8b890').rect(7, 12, 2, 4, '#6e4a2c').rect(6, 16, 4, 4, WOOD[2]).rect(6, 16, 4, 1, WOOD[3]);
  g.rect(1, 22, 14, 9, STONE[1]).rect(1, 22, 14, 2, STONE[3]);
  for (let y = 25; y < 31; y += 3) for (let x = 1 + (y % 2) * 2; x < 15; x += 4) g.rect(x, y, 1, 3, STONE[0]);
  for (let y = 24; y < 31; y += 3) g.rect(1, y, 14, 1, STONE[0]);
  g.rect(3, 26, 3, 1, '#4f9a44').rect(11, 28, 3, 1, '#4f9a44');
  g.outline(OL);
});

const mailbox = () => still('r5s_mailbox', 16, 24, (g) => {
  g.rect(7, 12, 2, 12, WOOD[1]).rect(7, 12, 1, 12, WOOD[2]);
  g.rect(2, 5, 12, 8, RED[1]).oval(8, 6, 6, 3, RED[1]).rect(2, 11, 12, 2, RED[0]);
  g.rect(3, 6, 4, 1, RED[2]).rect(11, 3, 1, 5, '#e8d44a').rect(11, 3, 3, 2, '#e8d44a');
  g.rect(4, 8, 5, 3, '#f0e4c4').rect(5, 9, 3, 1, '#c8b890');
  g.outline(OL);
});

const birdhouse = moving('r5s_birdhouse', 16, 28, 2, (g, i) => {
  g.rect(7, 12, 2, 16, WOOD[1]).rect(7, 12, 1, 16, WOOD[2]);
  g.rect(3, 12, 10, 1, WOOD[0]);
  g.rect(3, 5, 10, 8, '#7ab0d8').rect(3, 5, 10, 1, '#a8d0ee');
  g.rect(1, 3, 14, 2, RED[1]).rect(3, 1, 10, 2, RED[1]).rect(5, 0, 6, 1, RED[2]).rect(1, 4, 14, 1, RED[0]);
  g.oval(8, 8, 2, 2, '#14100c');
  if (i) { g.rect(7, 6, 3, 2, '#c07a3a').set(10, 6, '#f0c040').set(8, 6, OL); }
  g.rect(6, 12, 4, 1, WOOD[3]);
  g.outline(OL);
});

const birdbath = moving('r5s_birdbath', 16, 20, 2, (g, i) => {
  g.rect(6, 8, 4, 8, STONE[2]).rect(6, 8, 1, 8, STONE[3]).rect(4, 16, 8, 3, STONE[1]);
  g.oval(8, 7, 7, 3, STONE[2]).oval(8, 7, 5.6, 2, WATER[1]).oval(8, 6.6, 4, 1.2, WATER[2]);
  g.set(6 + i * 3, 7, WATER[3]);
  g.outline(OL);
});

const ladder = () => still('r5s_ladder', 16, 32, (g) => {
  g.line(4, 31, 6, 2, WOOD[2]).line(5, 31, 7, 2, WOOD[1]).line(11, 31, 13, 2, WOOD[2]).line(12, 31, 14, 2, WOOD[1]);
  for (let k = 0; k < 7; k++) { const y = 28 - k * 4; const x0 = 5 + (28 - y) * 0.07; g.rect(Math.round(x0), y, 8, 1, WOOD[3]).rect(Math.round(x0), y + 1, 8, 1, WOOD[0]); }
  g.outline(OL);
});

const appleBasket = () => still('r5s_apple_basket', 16, 16, (g) => {
  g.rect(2, 8, 12, 6, '#b58a4a').rect(2, 8, 12, 1, '#d8b070').rect(2, 12, 12, 1, '#8a6430');
  for (let x = 4; x < 14; x += 3) g.rect(x, 9, 1, 5, '#8a6430');
  for (const [x, y, c] of [[4, 6, RED[1]], [7, 5, RED[2]], [10, 6, RED[1]], [6, 7, '#7ab84a'], [9, 7, RED[2]]]) g.oval(x + 1, y + 1, 2, 2, c).set(x + 1, y, '#f8c0b0');
  g.line(2, 8, 4, 3, '#8a6430').line(14, 8, 12, 3, '#8a6430').line(4, 3, 12, 3, '#8a6430');
  g.outline(OL);
});

const fallenApples = () => still('r5s_apples_fallen', 16, 16, (g) => {
  for (const [x, y, c] of [[4, 10, RED[1]], [9, 8, RED[2]], [11, 12, RED[1]], [6, 13, '#7ab84a']]) {
    g.oval(x + 1, y + 1, 2, 2, c).set(x + 1, y - 1, '#4a3220').set(x + 2, y - 1, '#4f9a44').set(x, y, '#f8c0b0');
  }
  g.set(10, 12, '#c8d870').set(11, 13, '#c8d870').set(7, 13, '#c8d870');
  g.outline(OL);
});

const turnips = moving('r5s_turnips', 16, 16, 2, (g, i) => {
  for (const [x, y] of [[3, 8], [8, 9], [13, 8]]) {
    g.oval(x, y + 3, 2.4, 2.6, '#e8e0f0').oval(x, y + 4, 2.4, 1.6, '#b890c8').rect(x - 1, y + 5, 2, 1, '#9a6ab0');
    g.line(x - 1, y + 1, x - 3 + i, y - 3, GRASS[2]).line(x, y + 1, x, y - 4, GRASS[3]).line(x + 1, y + 1, x + 3 - i, y - 3, GRASS[1]);
  }
  g.rect(0, 13, 16, 3, '#6e4a30').rect(0, 13, 16, 1, '#8a6040');
  g.outline(OL);
});

const rosetteTurnip = () => still('r5s_rosette_turnip', 16, 20, (g) => {
  g.oval(8, 14, 6.4, 5.4, '#eadff2').oval(8, 16, 6, 3.4, '#b890c8').oval(8, 12, 4, 2, '#f8f0fc');
  g.rect(7, 18, 2, 2, '#9a6ab0');
  g.line(6, 9, 3, 3, GRASS[2]).line(8, 9, 8, 1, GRASS[3]).line(10, 9, 13, 3, GRASS[1]);
  g.oval(8, 12, 2.4, 2.4, '#3a6ad0').oval(8, 12, 1.2, 1.2, '#f8d84a');
  g.rect(6, 14, 1, 3, '#3a6ad0').rect(10, 14, 1, 3, '#3a6ad0');
  g.outline(OL);
});

const lemonCrate = () => still('r5s_lemon_crate', 16, 16, (g) => {
  g.rect(1, 8, 14, 7, WOOD[2]).rect(1, 8, 14, 1, WOOD[3]).rect(1, 11, 14, 1, WOOD[0]).rect(1, 14, 14, 1, WOOD[0]);
  for (const [x, y] of [[3, 6], [6, 5], [9, 6], [12, 5], [5, 7], [10, 8]]) g.oval(x + 1, y + 1, 2, 1.6, '#f4dc3a').set(x + 2, y + 1, '#fff08a').set(x, y + 1, '#d8b820');
  g.rect(3, 9, 4, 2, '#f0e4c4');
  g.outline(OL);
});

const jugCups = () => still('r5s_jug_cups', 16, 16, (g) => {
  g.rect(3, 4, 6, 10, '#f4e46a').rect(3, 4, 6, 1, '#fff6a8').rect(3, 4, 1, 10, '#fff6a8').rect(8, 4, 1, 10, '#d8c030');
  g.rect(4, 2, 4, 2, '#dfe8f0').rect(9, 6, 3, 1, '#dfe8f0').rect(11, 7, 1, 3, '#dfe8f0').rect(9, 10, 3, 1, '#dfe8f0');
  g.rect(11, 12, 4, 3, '#f8f4ea').rect(12, 12, 2, 1, '#f4e46a').rect(1, 13, 2, 1, '#d8c030');
  g.outline(OL);
});

const deckchair = () => still('r5s_deckchair', 16, 20, (g) => {
  g.line(3, 18, 5, 3, WOOD[1]).line(4, 18, 6, 3, WOOD[2]).line(13, 18, 11, 8, WOOD[1]);
  g.line(5, 5, 12, 15, '#3a7ab8').line(6, 5, 13, 15, '#3a7ab8').line(5, 7, 11, 15, '#f0e4c4').line(6, 7, 12, 15, '#f0e4c4');
  for (let k = 0; k < 5; k++) g.rect(5 + k, 5 + k * 2, 2, 1, k % 2 ? '#f0e4c4' : '#3a7ab8');
  g.oval(5, 3, 4, 1.4, '#e8d078').rect(3, 3, 5, 1, '#c4443a');
  g.outline(OL);
});

const finishRibbon = moving('r5s_finish_ribbon', 32, 20, 2, (g, i) => {
  g.rect(2, 4, 2, 16, WOOD[2]).rect(2, 4, 1, 16, WOOD[3]).rect(28, 4, 2, 16, WOOD[2]).rect(28, 4, 1, 16, WOOD[3]);
  g.rect(1, 3, 4, 2, RED[1]).rect(27, 3, 4, 2, RED[1]);
  for (let x = 4; x < 28; x++) {
    const sag = Math.round(Math.sin((x - 4) / 23 * Math.PI) * 3);
    const wave = Math.round(Math.sin(x * 0.5 + i * 2) * 0.8);
    g.set(x, 6 + sag + wave, x % 4 < 2 ? RED[1] : '#f8f4ea').set(x, 7 + sag + wave, x % 4 < 2 ? RED[0] : CREAM);
  }
  g.rect(5, 18, 22, 2, '#00000028');
  g.outline(OL);
}, 2);

// ---------------------------------------------------------------- Flowers and small green things
const dandelions = moving('r5s_dandelions', 16, 16, 2, (g, i) => {
  for (const [x, y, h] of [[4, 6, 7], [9, 4, 9], [13, 7, 6]]) {
    const sx = i ? 1 : 0;
    g.line(x, y + h, x + sx, y, GRASS[1]);
    g.oval(x + sx, y, 2.4, 2, '#f8d02a').oval(x + sx, y - 0.5, 1.4, 1, '#fff06a');
  }
  for (const x of [2, 7, 11]) g.rect(x, 13, 2, 1, GRASS[2]).rect(x - 1, 14, 4, 1, GRASS[1]).rect(x - 2, 15, 6, 1, GRASS[0]);
  g.outline(OL);
});

const poppies = moving('r5s_poppies', 16, 16, 2, (g, i) => {
  for (const [x, y, h] of [[3, 6, 8], [8, 3, 11], [12, 7, 7]]) {
    const sx = i ? 1 : 0;
    g.line(x, y + h, x + sx, y + 1, GRASS[1]);
    g.oval(x + sx, y, 2.4, 2, '#e03a2a').oval(x + sx, y, 1, 0.8, '#2a1a14');
    g.set(x + sx - 2, y - 1, '#f06a50');
  }
  for (const x of [2, 7, 11]) g.rect(x - 1, 14, 4, 1, GRASS[1]).rect(x - 2, 15, 6, 1, GRASS[0]);
  g.outline(OL);
});

const cornflowers = moving('r5s_cornflowers', 16, 16, 2, (g, i) => {
  for (const [x, y, h] of [[4, 8, 6], [9, 5, 9], [13, 9, 5]]) {
    const sx = i ? 1 : 0;
    g.line(x, y + h, x + sx, y + 1, GRASS[1]);
    g.rect(x + sx - 1, y, 3, 1, '#4a78e0').rect(x + sx, y - 1, 1, 3, '#4a78e0').set(x + sx, y, '#2a3a98');
  }
  for (const x of [3, 8, 12]) g.rect(x - 1, 14, 4, 1, GRASS[1]).rect(x - 2, 15, 6, 1, GRASS[0]);
  g.outline(OL);
});

const foxglove = moving('r5s_foxglove', 16, 28, 2, (g, i) => {
  const s = i ? 1 : 0;
  g.line(8, 27, 8 + s, 6, GRASS[1]).line(7, 27, 7 + s, 8, GRASS[0]);
  for (let k = 0; k < 6; k++) {
    const y = 6 + k * 3; const x = 8 + s * (1 - k / 7);
    g.oval(Math.round(x) - 2, y, 1.6, 1.8, '#b068d0').oval(Math.round(x) + 2, y + 1, 1.6, 1.8, '#9448b8').set(Math.round(x) - 2, y + 1, '#f4d0f0').set(Math.round(x) + 2, y + 2, '#f4d0f0');
  }
  g.set(8 + s, 3, '#b068d0').set(8 + s, 4, '#9448b8');
  g.rect(3, 26, 4, 2, GRASS[2]).rect(9, 26, 4, 2, GRASS[1]).rect(5, 24, 6, 2, GRASS[2]);
  g.outline(OL);
});

const clover = () => still('r5s_clover', 16, 16, (g) => {
  for (const [x, y] of [[3, 9], [8, 6], [12, 11], [6, 12], [10, 8]]) {
    g.oval(x, y, 2, 1.4, GRASS[2]).oval(x - 1, y + 1, 1.6, 1.2, GRASS[1]).oval(x + 2, y + 1, 1.6, 1.2, GRASS[3]);
    if ((x + y) % 2) g.oval(x + 1, y - 2, 1.6, 1.6, '#f8f4ea').set(x + 1, y - 2, '#f8e8a0');
  }
});

const mushroomRing = moving('r5s_mushroom_ring', 32, 16, 2, (g, i) => {
  const ring = [[3, 8], [7, 12], [13, 13], [19, 13], [25, 12], [29, 8], [26, 4], [19, 3], [12, 3], [6, 4]];
  g.oval(16, 8, 14, 6, '#4f9a44').oval(16, 8, 12, 4.6, '#5eaa48');
  ring.forEach(([x, y], k) => {
    g.rect(x, y, 1, 2, '#f0e4c4').oval(x, y - 1, 2, 1.4, k % 2 ? '#e8685a' : '#f8f4ea').set(x - 1, y - 1, '#f8f4ea').set(x + 1, y - 2, k % 2 ? '#f8f4ea' : '#c4443a');
  });
  if (i) g.set(16, 6, '#f8f4a0').set(15, 9, '#f8f4a0').set(18, 8, '#f8f4a0');
  else g.set(14, 7, '#f8f4a0').set(19, 7, '#f8f4a0').set(17, 10, '#f8f4a0');
  g.outline(OL);
}, 2);

const moleHill = moving('r5s_molehill', 16, 16, 2, (g, i) => {
  g.oval(8, 12, 7, 3.6, '#6e4a30').oval(8, 11, 5.4, 2.6, '#8a6040').set(5, 10, '#a07850').set(11, 11, '#a07850');
  g.oval(8, 12, 2, 1, '#2a1a10');
  if (i) { g.oval(8, 8, 2.8, 2.6, '#5a5260').oval(8, 10, 3, 1.4, '#e8a8a0').set(7, 8, '#14100c').set(9, 8, '#14100c').rect(8, 9, 1, 2, '#f0b0a8'); }
  g.outline(OL);
});

const snailStone = moving('r5s_snail_stone', 16, 16, 2, (g, i) => {
  g.oval(8, 12, 7, 3.4, STONE[1]).oval(8, 11, 5.6, 2.2, STONE[2]);
  g.oval(7, 7, 3.4, 3, '#c8844a').oval(7, 7, 2.2, 1.8, '#e8b070').set(7, 7, '#8a5a2c');
  g.oval(9, 10, 4, 1.4, '#d8c8a0').rect(12, 9 - i, 1, 2, '#d8c8a0').set(12, 8 - i, '#14100c');
  g.outline(OL);
});

const stumpAxe = () => still('r5s_stump_axe', 16, 20, (g) => {
  g.oval(8, 15, 6.4, 3, WOOD[1]).rect(2, 8, 12, 8, WOOD[1]).oval(8, 8, 6.4, 2.6, WOOD[3]).oval(8, 8, 4.4, 1.6, WOOD[2]).oval(8, 8, 2, 0.8, WOOD[3]);
  g.rect(3, 11, 1, 5, WOOD[0]).rect(11, 11, 1, 5, WOOD[0]);
  g.line(10, 8, 13, 1, WOOD[2]).rect(8, 3, 3, 3, '#aeb4bc').rect(8, 4, 1, 2, '#e0e4ea');
  g.outline(OL);
});

const steppingStones = () => still('r5s_stepping_stones', 32, 16, (g) => {
  for (const [x, y, rx, ry] of [[4, 11, 3.4, 2], [11, 8, 3.2, 1.8], [18, 10, 3.4, 2], [26, 7, 3.2, 1.8]]) {
    g.oval(x, y + 1, rx, ry, STONE[0]).oval(x, y, rx, ry, STONE[2]).oval(x - 0.6, y - 0.4, rx * 0.5, ry * 0.4, STONE[3]);
  }
  g.outline(OL);
}, 2);

const cattail = moving('r5s_cattails', 16, 28, 3, (g, i) => {
  const s = [0, 1, 0][i];
  for (const [x, h, tail] of [[4, 22, true], [8, 26, true], [12, 19, false]]) {
    g.line(x, 27, x + s, 27 - h, GRASS[1]);
    if (tail) g.rect(x + s - 1, 27 - h - 1, 2, 5, '#6a4426').set(x + s, 27 - h - 3, '#3a2a1c');
  }
  g.line(2, 27, 3 + s, 14, GRASS[2]).line(10, 27, 11 + s, 12, GRASS[2]).line(14, 27, 14 + s, 17, GRASS[0]);
  g.rect(2, 26, 12, 2, '#3a5a2a');
  g.outline(OL);
});

const fishingRod = moving('r5s_fishing_rod', 16, 24, 2, (g, i) => {
  g.line(2, 22, 11, 3, WOOD[2]).line(3, 22, 12, 3, WOOD[1]);
  g.line(11, 3, 14, 8 + i, '#d8d8d0').oval(14, 10 + i, 1.4, 1.4, RED[1]).set(14, 9 + i, '#f8f4ea');
  g.rect(1, 20, 5, 3, '#7e8286').rect(1, 20, 5, 1, '#aeb4bc');
  g.outline(OL);
});

const sackPile = () => still('r5s_sack_pile', 16, 16, (g) => {
  g.oval(6, 11, 5, 4.4, '#e8dcb8').oval(6, 12, 5, 3, '#cfc29a').rect(5, 6, 3, 2, '#e8dcb8').rect(5, 6, 3, 1, '#a89868');
  g.oval(12, 12, 4, 3.4, '#e0d4ae').oval(12, 7, 3.4, 3, '#eee4c2').rect(11, 3, 3, 2, '#eee4c2').rect(11, 3, 3, 1, '#a89868');
  g.rect(2, 11, 8, 1, '#8a7a50').set(8, 8, '#f8f4ea').set(9, 9, '#f8f4ea').set(3, 14, '#f8f4ea').set(4, 15, '#f8f4ea');
  g.outline(OL);
});

const millstone = () => still('r5s_millstone', 16, 20, (g) => {
  g.oval(8, 11, 7, 8, STONE[1]).oval(8, 11, 5.6, 6.6, STONE[2]).oval(8, 11, 1.8, 2, '#3a3a3e');
  for (let a = 0; a < 8; a++) g.line(8, 11, 8 + Math.round(Math.cos(a * 0.785) * 5), 11 + Math.round(Math.sin(a * 0.785) * 6), STONE[1]);
  g.oval(8, 11, 1.6, 1.8, '#3a3a3e');
  g.rect(2, 18, 12, 2, '#00000028');
  g.outline(OL);
});

const gorse = moving('r5s_gorse', 16, 16, 2, (g, i) => {
  g.oval(8, 10, 7, 5, '#3f7a35').oval(8, 9, 6, 4, '#4f9a44');
  for (const [x, y] of [[3, 7], [6, 5], [9, 6], [12, 7], [5, 9], [10, 9], [8, 11], [13, 10], [4, 11]]) {
    g.set(x, y, '#f8d02a').set(x + 1, y, '#e8a818').set(x, y - 1, '#fff06a');
  }
  if (i) g.set(7, 3, '#f8d02a').set(8, 3, '#fff06a');
  g.rect(2, 14, 12, 2, '#00000022');
  g.outline(OL);
});

const thrift = () => still('r5s_thrift', 16, 16, (g) => {
  g.oval(8, 11, 7, 3.8, '#4f9a44').oval(8, 10, 6, 3, '#5eaa48');
  for (const [x, y] of [[4, 6], [7, 3], [10, 5], [13, 8], [8, 8], [5, 9]]) { g.line(x, y + 3, x, y, GRASS[1]); g.oval(x, y, 1.8, 1.8, '#f0a0c0').set(x, y, '#f8d0e0').set(x - 1, y - 1, '#f4b8d0'); }
  g.outline(OL);
});

const cairn = () => still('r5s_cairn', 16, 16, (g) => {
  g.oval(8, 13, 6, 2.6, STONE[1]).oval(8, 12, 5, 1.8, STONE[2]);
  g.oval(8, 10, 4, 2, STONE[2]).oval(8, 9.6, 3, 1.2, STONE[3]);
  g.oval(8, 7, 2.6, 1.6, STONE[1]).oval(8, 6.6, 1.8, 0.9, STONE[3]).oval(8, 4, 1.4, 1.2, STONE[2]);
  g.outline(OL);
});

const cartwheel = () => still('r5s_wheel', 16, 20, (g) => {
  g.oval(8, 11, 7.4, 8, WOOD[0]).oval(8, 11, 6.2, 6.8, WOOD[2]).oval(8, 11, 5, 5.6, null);
  for (let a = 0; a < 6; a++) g.line(8, 11, 8 + Math.round(Math.cos(a * 1.047) * 6), 11 + Math.round(Math.sin(a * 1.047) * 6.5), WOOD[1]);
  g.oval(8, 11, 1.8, 2, WOOD[0]);
  g.outline(OL);
});

const picnicBasket = () => still('r5s_picnic_basket', 16, 16, (g) => {
  g.rect(2, 7, 12, 7, '#b58a4a').rect(2, 7, 12, 1, '#d8b070').rect(2, 12, 12, 1, '#8a6430');
  for (let x = 4; x < 14; x += 3) g.rect(x, 8, 1, 5, '#8a6430');
  g.rect(1, 6, 14, 2, '#d4443a'); for (let x = 1; x < 15; x += 2) g.rect(x, 6, 1, 2, '#f8f4ea');
  g.line(3, 6, 5, 2, '#8a6430').line(13, 6, 11, 2, '#8a6430').line(5, 2, 11, 2, '#8a6430');
  g.rect(9, 3, 2, 3, '#7ab84a').rect(9, 3, 2, 1, '#f0e4c4');
  g.outline(OL);
});

const boots = () => still('r5s_boots', 16, 16, (g) => {
  g.rect(2, 7, 4, 7, '#6e4a2c').rect(2, 13, 6, 2, '#4a3220').rect(2, 7, 4, 1, '#a07850').rect(3, 9, 2, 1, '#8a6040');
  g.rect(9, 8, 4, 6, '#6e4a2c').rect(9, 13, 6, 2, '#4a3220').rect(9, 8, 4, 1, '#a07850');
  g.set(4, 15, '#3f8a35').set(11, 15, '#3f8a35');
  g.outline(OL);
});

const strawHat = () => still('r5s_straw_hat', 16, 24, (g) => {
  g.rect(7, 8, 2, 16, WOOD[1]).rect(7, 8, 1, 16, WOOD[2]);
  g.oval(8, 7, 7, 2.2, HAY[2]).oval(8, 5, 4, 3, HAY[2]).rect(5, 4, 6, 1, '#c4443a').oval(8, 3.5, 2.5, 1.2, HAY[3]);
  g.set(2, 7, HAY[0]).set(14, 7, HAY[0]).set(4, 8, HAY[0]);
  g.outline(OL);
});

const flourPuff = moving('r5s_flour_puff', 16, 16, 3, (g, i) => {
  for (let k = 0; k < 6; k++) g.set(4 + ((k * 5 + i * 3) % 9), 12 - ((k * 3 + i * 4) % 9), k % 2 ? '#f8f4ea' : '#e8e0cc');
});

// ---------------------------------------------------------------- Cave and shore bits (the Fishers' Hollow, the Cliff Cave)
const fishTub = moving('r5s_fish_tub', 16, 16, 2, (g, i) => {
  g.rect(2, 8, 12, 7, WOOD[1]).rect(2, 8, 12, 1, WOOD[3]).rect(2, 11, 12, 1, '#7e828c').rect(2, 14, 12, 1, '#7e828c');
  g.rect(3, 7, 10, 2, '#9ab8c8');
  g.oval(6, 6, 3, 1.2, '#b8c8d0').oval(10, 7, 3, 1.2, '#a0b4bc').set(4 + i, 6, '#14100c').set(9 + i, 7, '#14100c');
  g.rect(12, 5, 2, 2, '#b8c8d0');
  g.outline(OL);
});

const crabTrap = () => still('r5s_crab_trap', 16, 16, (g) => {
  g.oval(8, 10, 7, 5, '#a88858').oval(8, 10, 5.6, 3.8, '#6e5430');
  for (let x = 3; x < 14; x += 3) g.line(x, 6, x, 14, '#c8a870');
  g.line(2, 10, 14, 10, '#c8a870').line(4, 7, 12, 7, '#c8a870').line(4, 13, 12, 13, '#c8a870');
  g.rect(7, 3, 2, 3, '#c4443a');
  g.outline(OL);
});

const oilskinHang = () => still('r5s_hung_coat', 16, 24, (g) => {
  g.rect(2, 2, 12, 2, WOOD[1]).rect(1, 1, 2, 3, WOOD[0]).rect(13, 1, 2, 3, WOOD[0]);
  g.rect(4, 4, 8, 14, '#e8c43a').rect(4, 4, 8, 1, '#f8e07a').rect(7, 4, 2, 14, '#c4a02a').rect(3, 6, 2, 8, '#e8c43a').rect(11, 6, 2, 8, '#e8c43a');
  g.rect(5, 18, 6, 4, '#e8c43a').rect(5, 22, 6, 1, '#c4a02a');
  g.outline(OL);
});

const spectacles = () => still('r5s_spectacles', 16, 16, (g) => {
  g.oval(5, 10, 3, 3, '#cfe6f2').oval(5, 10, 2, 2, null).oval(11, 10, 3, 3, '#cfe6f2').oval(11, 10, 2, 2, null);
  g.rect(8, 9, 1, 1, '#8a6c2c').line(2, 9, 1, 12, '#8a6c2c').line(14, 9, 15, 12, '#8a6c2c');
  g.set(3, 8, '#f8fcff').set(9, 8, '#f8fcff');
  g.oval(3, 14, 3, 1, '#4f9a44');
  g.outline(OL);
});

// ================ Exports ================
export const R5S_PROP_SPRITES_ALL = R5S_PROP_SPRITES;
export { R5S_PROP_SPRITES, R5S_FOOTPRINTS };
export const R5S_PALETTE_EXTRA = palette;
export const R5S_PALETTE = palette;

export const R5S_COW_SPRITES = cowFrames;
export const R5S_COW_PALETTE = palette;
export const R5S_COW_LIE_SPRITES = cowLie;
export const R5S_COW_LIE_PALETTE = palette;
export const R5S_TROUGH_SPRITES = trough;
export const R5S_TROUGH_PALETTE = palette;
export const R5S_BIRDHOUSE_SPRITES = birdhouse;
export const R5S_BIRDHOUSE_PALETTE = palette;
export const R5S_BIRDBATH_SPRITES = birdbath;
export const R5S_BIRDBATH_PALETTE = palette;
export const R5S_TURNIPS_SPRITES = turnips;
export const R5S_TURNIPS_PALETTE = palette;
export const R5S_FINISH_RIBBON_SPRITES = finishRibbon;
export const R5S_FINISH_RIBBON_PALETTE = palette;
export const R5S_DANDELIONS_SPRITES = dandelions;
export const R5S_DANDELIONS_PALETTE = palette;
export const R5S_POPPIES_SPRITES = poppies;
export const R5S_POPPIES_PALETTE = palette;
export const R5S_CORNFLOWERS_SPRITES = cornflowers;
export const R5S_CORNFLOWERS_PALETTE = palette;
export const R5S_FOXGLOVE_SPRITES = foxglove;
export const R5S_FOXGLOVE_PALETTE = palette;
export const R5S_MUSHROOM_RING_SPRITES = mushroomRing;
export const R5S_MUSHROOM_RING_PALETTE = palette;
export const R5S_MOLEHILL_SPRITES = moleHill;
export const R5S_MOLEHILL_PALETTE = palette;
export const R5S_SNAIL_STONE_SPRITES = snailStone;
export const R5S_SNAIL_STONE_PALETTE = palette;
export const R5S_CATTAILS_SPRITES = cattail;
export const R5S_CATTAILS_PALETTE = palette;
export const R5S_FISHING_ROD_SPRITES = fishingRod;
export const R5S_FISHING_ROD_PALETTE = palette;
export const R5S_GORSE_SPRITES = gorse;
export const R5S_GORSE_PALETTE = palette;
export const R5S_FLOUR_PUFF_SPRITES = flourPuff;
export const R5S_FLOUR_PUFF_PALETTE = palette;
export const R5S_FISH_TUB_SPRITES = fishTub;
export const R5S_FISH_TUB_PALETTE = palette;

// Static ones the helpers above only register when called.
henHouse(); nest(); churn(); roundBale(); baleStack(); pitchfork(); hayCart(); well(); mailbox(); ladder();
appleBasket(); fallenApples(); rosetteTurnip(); lemonCrate(); jugCups(); deckchair(); clover(); stumpAxe();
steppingStones(); sackPile(); millstone(); thrift(); cairn(); cartwheel(); picnicBasket(); boots(); strawHat();
crabTrap(); oilskinHang(); spectacles();
