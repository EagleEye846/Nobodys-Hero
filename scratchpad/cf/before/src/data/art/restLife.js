// Life-pass props for Heralds' Rest, the Long Stair and the Ice Caves (chapter 2, 15 November 2026):
// the village's woodpiles, sleds and snow, the inn's guests and drying boots, frosted windows, the
// climbers' leftovers on the trail and in the caves, and the small animals of the mountain. Drawn
// like lanesLife.js: rows of characters from a small painter, 16 pixels to a tile, standing on the
// bottom edge and centred over their footprint. Every id starts `r2r_`. Nothing hangs in the air:
// every line, lamp and sign has its post, hook or peg.
//
//   Village:  r2r_woodpile r2r_chop_block r2r_sled r2r_snow_fort r2r_drift_s r2r_drift_l r2r_trough
//             r2r_snowshoes r2r_axe_rack r2r_snow_angel (flat) r2r_snow_dog r2r_tracks (flat)
//             r2r_sack r2r_chimney r2r_roof_cock r2r_roof_cat r2r_icicles r2r_mat (flat)
//   Inside:   r2r_window r2r_window_pot r2r_boots_dry (animated) r2r_coat_hooks r2r_log_basket
//             r2r_guest_reader r2r_guest_sleeper (animated) r2r_guest_climber r2r_map_table
//             r2r_card_table r2r_herbs r2r_dartboard r2r_snow_globe r2r_menu_board r2r_scarf_pegs
//             r2r_toy_trumpet r2r_cat_hearth (animated)
//   Trail:    r2r_blaze_post r2r_goat_kid (animated) r2r_marmot (animated) r2r_flowers_a r2r_flowers_b
//             r2r_snow_patch r2r_scree r2r_nest r2r_piton r2r_tally_post r2r_boots_left r2r_camp_stove
//             r2r_tin_mug r2r_ptarmigan (animated) r2r_bent_pole
//   Caves:    r2r_ice_axe r2r_rope_coil r2r_glove r2r_frost_candle r2r_helmet r2r_ice_bud r2r_hoar
//             (flat) r2r_frozen_fish (flat) r2r_ice_spike r2r_cave_snow r2r_horn r2r_scratches r2r_drip_pool
//             (flat, animated)

import { R3A_PROP_SPRITES, R3A_PALETTE, R3A_FOOTPRINTS } from './r3aLife.js';

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0x9e40 + colors.size);
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

  // A dark edge round everything drawn.
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
const INK = '#141a22';
const SNOW = ['#7f98b8', '#a8bfd8', '#d4e4f2', '#f6fbff'];
const WOOD = ['#2e2218', '#4e3a28', '#6e5538', '#92764e', '#b89a68'];
const IRON = ['#22262c', '#3c4250', '#5c6676', '#8a94a4'];
const ICE = ['#3a6a92', '#66a0c8', '#a4d4ec', '#e2f6ff'];
const WOOL = { red: ['#6a2a2a', '#a84040', '#d06858'], blue: ['#26405e', '#3e6a98', '#6a9ac8'], green: ['#26452e', '#3e7048', '#68a070'], gold: ['#8a6418', '#c8982c', '#f0cc5c'], grey: ['#4a4e58', '#767c88', '#a4aab4'] };
const SKIN = ['#8a5a3c', '#c48a60', '#e8b890'];
const FUR = ['#6a4a30', '#9a7048', '#caa070'];
const WHITE = ['#9aa2ae', '#d2d8e0', '#f4f6fa'];
const WARM = ['#a8581e', '#e8982c', '#ffe080'];
const STONE = ['#3a424c', '#5a6470', '#7e8a98', '#a4b0bc'];
const GRASS = ['#2a4a2c', '#44763c', '#6aa04c', '#92c468'];

// A cap of snow along the top of something, 'x0'..'x1' wide, lumpy.
function snowCap(g, x0, x1, y, h = 2) {
  for (let x = x0; x <= x1; x++) {
    const lump = Math.round(Math.sin(x * 0.9) * 0.7 + (x % 3 === 0 ? 0.6 : 0));
    for (let j = 0; j < h + lump; j++) g.set(x, y - j, j === h + lump - 1 ? SNOW[3] : SNOW[2]);
    g.set(x, y + 1, SNOW[1]);
  }
}

// ---------------------------------------------------------------------------------------------
// THE VILLAGE

// Split logs stacked under a snowy cap, a few ends showing their rings.
function woodpile() {
  const g = new Grid(32, 20);
  g.rect(1, 17, 30, 2, WOOD[0]);
  g.rect(2, 7, 28, 11, WOOD[1]);
  for (let r = 0; r < 3; r++) for (let i = 0; i < 7; i++) {
    const x = 5 + i * 4 + (r % 2) * 2; const y = 9 + r * 3.4;
    g.disc(x, y, 2, 1.8, WOOD[3]); g.disc(x, y, 1, 0.8, WOOD[4]); g.set(x, y, WOOD[2]);
  }
  g.rect(1, 6, 30, 2, WOOD[2]);
  snowCap(g, 1, 30, 5, 3);
  g.rect(24, 2, 1, 2, SNOW[3]);
  return g.outline().rows();
}

// A chopping block with an axe left in it and a skirt of chips.
function chopBlock() {
  const g = new Grid(16, 18);
  g.disc(8, 12, 6, 3, WOOD[2]); g.rect(3, 12, 11, 4, WOOD[1]); g.rect(4, 15, 9, 1, WOOD[0]);
  g.disc(8, 11, 5, 2, WOOD[4]); g.disc(8, 11, 2.5, 1, WOOD[3]); g.set(8, 11, WOOD[2]);
  g.line(11, 10, 9, 2, WOOD[3]); g.line(12, 10, 10, 2, WOOD[2]);
  g.rect(6, 1, 4, 3, IRON[2]); g.rect(6, 1, 4, 1, IRON[3]);
  for (const [x, y] of [[1, 16], [13, 16], [3, 17], [11, 17]]) g.set(x, y, WOOD[4]);
  g.rect(5, 9, 6, 1, SNOW[3]);
  return g.outline().rows();
}

// A child's sled, the rope coiled on it, a dusting of snow.
function sled() {
  const g = new Grid(32, 14);
  g.rect(3, 6, 25, 3, WOOD[2]); g.rect(3, 6, 25, 1, WOOD[3]); g.rect(3, 8, 25, 1, WOOD[0]);
  g.rect(8, 4, 2, 3, WOOD[1]); g.rect(20, 4, 2, 3, WOOD[1]);
  g.line(2, 11, 28, 11, IRON[2]); g.line(2, 12, 28, 12, IRON[1]);
  g.set(1, 10, IRON[2]); g.set(0, 9, IRON[2]); g.rect(6, 9, 1, 2, IRON[1]); g.rect(24, 9, 1, 2, IRON[1]);
  g.line(28, 8, 31, 5, WOOL.red[1]); g.line(29, 9, 31, 7, WOOL.red[1]);
  g.disc(14, 5, 3, 1.5, WOOL.red[1]); g.disc(14, 5, 1.5, 0.8, WOOL.red[2]);
  snowCap(g, 4, 27, 6, 1);
  return g.outline().rows();
}

// A knee-high snow fort with a stick flag.
function snowFort() {
  const g = new Grid(32, 20);
  g.rect(2, 9, 28, 9, SNOW[2]);
  g.rect(2, 9, 28, 1, SNOW[3]);
  for (const x of [3, 8, 13, 18, 23, 28]) g.rect(x, 6, 3, 4, SNOW[2]);
  for (const x of [3, 8, 13, 18, 23, 28]) g.rect(x, 6, 3, 1, SNOW[3]);
  g.rect(2, 16, 28, 2, SNOW[1]);
  for (let x = 4; x < 29; x += 5) g.rect(x, 12, 4, 1, SNOW[1]);
  g.line(16, 1, 16, 8, WOOD[2]);
  g.rect(17, 1, 5, 3, WOOL.red[1]); g.rect(17, 1, 5, 1, WOOL.red[2]);
  return g.outline().rows();
}

// Drift: a smooth heap of blown snow, a boot print pressed in the side.
function drift(w, h) {
  const g = new Grid(w, h);
  for (let x = 0; x < w; x++) {
    const u = x / (w - 1);
    const top = Math.round(h - 2 - Math.sin(u * Math.PI) * (h - 4) * (0.75 + 0.25 * Math.sin(u * 7)));
    for (let y = top; y < h; y++) g.set(x, y, y === top ? SNOW[3] : y < top + 2 ? SNOW[2] : y > h - 3 ? SNOW[0] : SNOW[1]);
  }
  g.rect(Math.round(w * 0.55), h - 4, 3, 2, SNOW[0]); g.rect(Math.round(w * 0.55) + 4, h - 3, 2, 1, SNOW[0]);
  return g.outline(SNOW[0]).rows();
}

// A frozen water trough with a lid of ice and a hole someone poked in it.
function trough() {
  const g = new Grid(32, 16);
  g.rect(2, 5, 28, 9, WOOD[2]); g.rect(2, 5, 28, 1, WOOD[3]); g.rect(2, 13, 28, 1, WOOD[0]);
  g.rect(4, 6, 24, 4, ICE[1]); g.rect(4, 6, 24, 1, ICE[2]);
  g.disc(20, 8, 2.5, 1.4, ICE[0]); g.line(7, 8, 14, 7, ICE[3]);
  g.rect(3, 13, 3, 2, WOOD[1]); g.rect(26, 13, 3, 2, WOOD[1]);
  g.line(9, 10, 12, 12, WOOD[1]); g.line(18, 10, 22, 12, WOOD[1]);
  snowCap(g, 2, 29, 5, 1);
  return g.outline().rows();
}

// A pair of snowshoes standing on their ends against a wall.
function snowshoes() {
  const g = new Grid(16, 22);
  for (const x0 of [3, 9]) {
    g.disc(x0 + 2, 11, 3, 8, WOOD[3]); g.disc(x0 + 2, 11, 2, 7, SNOW[0]);
    for (let y = 5; y <= 17; y += 3) g.line(x0, y, x0 + 4, y, WOOL.gold[1]);
    g.line(x0 + 2, 4, x0 + 2, 18, WOOD[2]);
    g.line(x0 + 2, 18, x0 + 2, 20, WOOD[1]);
  }
  g.line(4, 12, 11, 12, WOOL.red[1]);
  snowCap(g, 2, 13, 20, 1);
  return g.outline().rows();
}

// A post with ice axes and a coil of rope hung on it, for the inn's door.
function axeRack() {
  const g = new Grid(16, 24);
  g.rect(2, 21, 12, 2, WOOD[1]); g.rect(3, 6, 2, 16, WOOD[2]); g.rect(11, 6, 2, 16, WOOD[2]);
  g.rect(2, 5, 12, 2, WOOD[3]); g.rect(2, 5, 12, 1, WOOD[4]);
  for (const x of [5, 8, 11]) { g.line(x, 7, x, 20, WOOD[2]); g.rect(x - 2, 1, 5, 2, IRON[2]); g.line(x - 2, 3, x - 3, 4, IRON[2]); }
  g.disc(8, 13, 3, 3, WOOL.gold[1]); g.disc(8, 13, 1.5, 1.5, WOOD[1]);
  snowCap(g, 2, 13, 5, 1);
  return g.outline().rows();
}

// A snow angel pressed into the snow, leaving a lighter shape inside a darker rim.
function snowAngel() {
  const g = new Grid(16, 14);
  g.disc(8, 3, 2, 2, SNOW[1]);
  g.rect(7, 5, 3, 7, SNOW[1]);
  for (let i = 0; i < 6; i++) { g.set(7 - i, 5 + Math.floor(i / 1.5), SNOW[1]); g.set(9 + i, 5 + Math.floor(i / 1.5), SNOW[1]); g.set(7 - i, 6 + Math.floor(i / 1.5), SNOW[1]); g.set(9 + i, 6 + Math.floor(i / 1.5), SNOW[1]); }
  g.line(6, 11, 4, 13, SNOW[1]); g.line(10, 11, 12, 13, SNOW[1]);
  return g.outline(SNOW[0]).rows();
}

// A snow dog somebody made: sausage body, four stubby legs, a stick for a tail and coal eyes.
function snowDog() {
  const g = new Grid(16, 14);
  g.rect(3, 5, 10, 6, SNOW[2]); g.rect(3, 5, 10, 1, SNOW[3]); g.rect(3, 10, 10, 1, SNOW[1]);
  g.rect(3, 11, 2, 2, SNOW[2]); g.rect(11, 11, 2, 2, SNOW[2]);
  g.rect(0, 3, 5, 5, SNOW[2]); g.rect(0, 3, 5, 1, SNOW[3]);
  g.set(1, 4, INK); g.set(3, 4, INK); g.rect(0, 6, 1, 1, INK);
  g.rect(0, 2, 2, 2, SNOW[1]);
  g.line(13, 6, 15, 2, WOOD[2]);
  g.rect(5, 8, 7, 1, WOOL.red[1]);
  return g.outline(SNOW[0]).rows();
}

// Hare tracks across a patch of snow, small prints in pairs and the long ones behind.
function tracks() {
  const g = new Grid(32, 10);
  for (let i = 0; i < 6; i++) {
    const x = 2 + i * 5; const y = 3 + (i % 2) * 3;
    g.rect(x, y, 2, 1, SNOW[1]); g.rect(x + 2, y + 1, 1, 1, SNOW[1]);
    g.rect(x + 1, y + 2, 1, 1, SNOW[1]);
  }
  return g.rows();
}

// A grain sack, tied, with a shovel of snow on one side.
function sack() {
  const g = new Grid(16, 16);
  g.disc(8, 10, 5, 5, '#b4a078'); g.disc(7, 9, 3, 3, '#d4c49c'); g.rect(6, 3, 4, 3, '#b4a078');
  g.rect(5, 5, 6, 1, WOOL.red[1]);
  g.line(5, 9, 11, 11, '#8a7850');
  snowCap(g, 4, 11, 4, 1);
  return g.outline().rows();
}

// A brick chimney on a cabin roof, a snowy cap, the pot dark.
function chimney() {
  const g = new Grid(16, 26);
  g.rect(4, 8, 8, 18, '#7a4a3a'); g.rect(4, 8, 2, 18, '#9a6048'); g.rect(10, 8, 2, 18, '#5a3228');
  for (let y = 11; y < 26; y += 4) g.rect(4, y, 8, 1, '#4a281e');
  g.rect(3, 6, 10, 3, '#8a5440'); g.rect(3, 6, 10, 1, '#aa6c52');
  g.rect(5, 4, 6, 2, '#161014');
  snowCap(g, 2, 13, 6, 1);
  g.rect(3, 22, 10, 2, SNOW[2]); g.rect(3, 22, 10, 1, SNOW[3]);
  return g.outline().rows();
}

// A weathercock on a spike on the ridge: a tin cock pointing a way nobody asked.
function roofCock() {
  const g = new Grid(16, 26);
  g.rect(7, 8, 2, 18, IRON[1]); g.rect(7, 8, 1, 18, IRON[2]);
  g.line(2, 16, 14, 16, IRON[2]); g.rect(1, 15, 2, 2, IRON[3]); g.rect(13, 15, 2, 2, IRON[3]);
  g.rect(4, 4, 8, 4, WARM[1]); g.rect(4, 4, 8, 1, WARM[2]); g.rect(11, 2, 3, 3, WARM[0]);
  g.rect(10, 5, 2, 1, INK); g.rect(2, 3, 3, 5, WARM[0]); g.rect(3, 2, 2, 2, WARM[1]);
  g.rect(12, 3, 2, 1, WOOL.red[1]);
  g.rect(6, 7, 4, 1, WARM[0]);
  g.rect(5, 23, 6, 3, SNOW[2]); g.rect(5, 23, 6, 1, SNOW[3]);
  return g.outline().rows();
}

// A cat sitting in the snow on the roof's ridge, loafed against the cold, tail round its toes.
function roofCat() {
  const g = new Grid(16, 14);
  g.disc(8, 9, 5, 4, '#5a5a66'); g.disc(7, 8, 3, 2, '#7a7a88');
  g.disc(11, 5, 3, 3, '#5a5a66');
  g.rect(9, 1, 2, 3, '#5a5a66'); g.rect(12, 1, 2, 3, '#5a5a66');
  g.set(10, 5, '#e0e060'); g.set(12, 5, '#e0e060');
  g.line(3, 11, 11, 12, '#4a4a54');
  snowCap(g, 3, 13, 13, 0);
  g.rect(2, 12, 12, 2, SNOW[2]);
  return g.outline().rows();
}

// Icicles along an eave: top half only, so they hang off the roof's edge (stand it on the wall
// tile just below the roof). 2 wide, 16 tall, hanging from the top.
function icicles() {
  const g = new Grid(32, 16);
  g.rect(0, 0, 32, 2, SNOW[3]); g.rect(0, 1, 32, 1, SNOW[2]);
  const xs = [1, 4, 6, 9, 13, 16, 19, 22, 24, 27, 30];
  xs.forEach((x, i) => {
    const len = 3 + ((i * 5) % 6);
    for (let y = 2; y < 2 + len; y++) {
      const w = y < 2 + len - 2 ? 2 : 1;
      g.rect(x, y, w, 1, y === 2 + len - 1 ? ICE[3] : ICE[2]);
    }
    g.set(x, 3, ICE[1]);
  });
  return g.rows();
}

// A doormat, with the snow brushed off one corner.
function mat() {
  const g = new Grid(32, 12);
  g.rect(2, 2, 28, 8, '#7a4a30'); g.rect(3, 3, 26, 6, '#a06840');
  for (let x = 4; x < 28; x += 2) g.set(x, 4, '#c88850');
  for (let x = 5; x < 27; x += 2) g.set(x, 7, '#6a4028');
  g.rect(18, 2, 12, 3, SNOW[2]); g.rect(22, 5, 8, 2, SNOW[2]);
  return g.outline('#4a2c1c').rows();
}

// ---------------------------------------------------------------------------------------------
// INSIDE

// A cabin window set in the wall, frost in the corners, a snowdrift on the outside sill, a candle
// glowing behind the glass.
function windowSill(pot) {
  const g = new Grid(16, 24);
  g.rect(1, 3, 14, 17, WOOD[1]); g.rect(1, 3, 14, 1, WOOD[3]);
  g.rect(3, 5, 10, 12, '#243a52');
  g.rect(3, 5, 10, 12, '#243a52');
  for (let y = 6; y < 16; y++) for (let x = 4; x < 12; x++) g.set(x, y, y < 11 ? '#3a5a7c' : '#2a4666');
  g.rect(7, 5, 2, 12, WOOD[2]); g.rect(3, 10, 10, 2, WOOD[2]);
  // frost
  for (const [x, y] of [[4, 6], [5, 6], [4, 7], [11, 6], [10, 6], [11, 7], [4, 15], [5, 15], [11, 15], [10, 15], [4, 14], [11, 14]]) g.set(x, y, '#cfe6f6');
  // glow
  g.rect(9, 12, 2, 2, '#ffd880'); g.rect(10, 12, 1, 1, '#fff0b0');
  g.rect(0, 19, 16, 2, WOOD[2]); g.rect(0, 19, 16, 1, WOOD[4]);
  // snow on the sill, one drift
  snowCap(g, 0, 15, 20, 2);
  g.disc(4, 19, 3, 1.5, SNOW[3]); g.disc(11, 19, 2, 1, SNOW[3]);
  if (pot) {
    g.rect(3, 15, 4, 4, '#a85a3a'); g.rect(3, 15, 4, 1, '#c87a52');
    g.line(5, 14, 5, 10, GRASS[2]); g.line(5, 12, 3, 10, GRASS[2]); g.line(5, 12, 7, 10, GRASS[2]);
    g.set(3, 10, WOOL.red[2]); g.set(7, 10, WOOL.red[2]); g.set(5, 9, WOOL.red[2]);
  }
  return g.outline().rows();
}

// Boots in a row on a tray by the fire, two pairs with the steam going up from the toes.
function bootsDry(f) {
  const g = new Grid(32, 18);
  g.rect(2, 14, 28, 3, WOOD[1]); g.rect(2, 14, 28, 1, WOOD[3]); g.rect(3, 16, 26, 1, WOOD[0]);
  const boot = (x, c) => {
    g.rect(x, 6, 5, 9, c[1]); g.rect(x, 6, 2, 9, c[2]); g.rect(x + 5, 11, 5, 4, c[1]); g.rect(x + 5, 11, 5, 1, c[2]);
    g.rect(x, 14, 10, 1, '#1a1410'); g.rect(x - 1, 5, 7, 2, c[0]); g.rect(x, 8, 5, 1, '#d8ccb0'); g.rect(x, 10, 5, 1, '#d8ccb0');
  };
  boot(3, ['#3a2418', '#6a4428', '#8a6038']); boot(17, ['#2a2830', '#4a4858', '#6a6878']);
  // wet shine, and a puddle spreading
  g.rect(12, 16, 4, 1, ICE[1] + '99'); g.rect(29, 16, 2, 1, ICE[1] + '99');
  const wob = f ? 1 : 0;
  for (const x of [6, 20]) { g.set(x + wob, 3, '#e8ecf044'); g.set(x + 1 - wob, 2, '#e8ecf055'); g.set(x + wob, 1, '#e8ecf033'); g.set(x + 2, 4, '#e8ecf055'); }
  return g.outline().rows();
}

// Pegs along a plank with coats, a scarf and a pom-pom hat; one peg bare.
function coatHooks() {
  const g = new Grid(32, 28);
  g.rect(1, 3, 30, 3, WOOD[2]); g.rect(1, 3, 30, 1, WOOD[3]); g.rect(1, 5, 30, 1, WOOD[0]);
  const coat = (x, c) => { g.rect(x, 7, 6, 15, c[1]); g.rect(x, 7, 2, 15, c[2]); g.rect(x + 5, 7, 1, 15, c[0]); g.rect(x + 2, 7, 2, 4, c[0]); g.rect(x, 20, 6, 2, c[0]); g.set(x + 3, 12, WARM[2]); g.set(x + 3, 15, WARM[2]); g.set(x + 3, 18, WARM[2]); };
  coat(3, WOOL.red); coat(11, WOOL.green);
  // scarf
  g.rect(19, 7, 3, 16, WOOL.gold[1]); g.rect(19, 7, 1, 16, WOOL.gold[2]);
  for (let y = 9; y < 22; y += 3) g.rect(19, y, 3, 1, WOOL.red[1]);
  // hat
  g.rect(25, 7, 5, 5, WOOL.blue[1]); g.rect(25, 7, 5, 1, WOOL.blue[2]); g.disc(27, 6, 2, 2, WOOL.blue[2]);
  g.rect(24, 11, 7, 2, WOOL.blue[0]);
  for (const x of [5, 13, 20, 27]) { g.rect(x, 5, 2, 3, IRON[2]); }
  g.rect(1, 25, 30, 2, SNOW[2]); // drips of melted snow on the floor
  g.rect(4, 25, 4, 1, SNOW[3]); g.rect(14, 26, 5, 1, SNOW[3]);
  return g.outline().rows();
}

// A basket of split logs beside the hearth.
function logBasket() {
  const g = new Grid(16, 16);
  g.rect(2, 7, 12, 8, '#8a6a3a'); g.rect(2, 7, 12, 1, '#b89050'); g.rect(2, 14, 12, 1, '#5a4224');
  for (let y = 9; y < 14; y += 2) for (let x = 2; x < 14; x += 2) g.set(x + (y % 4 ? 0 : 1), y, '#5a4224');
  for (const [x, y, c] of [[4, 4, WOOD[3]], [8, 3, WOOD[2]], [11, 4, WOOD[3]], [6, 5, WOOD[2]]]) { g.disc(x, y, 2, 2, c); g.set(x, y, WOOD[4]); }
  g.line(2, 7, 3, 3, '#8a6a3a'); g.line(13, 7, 12, 3, '#8a6a3a');
  return g.outline().rows();
}

// A guest in a scarf, in a chair, a book held up to the face; the tea going cold on the arm.
function guestReader() {
  const g = new Grid(16, 24);
  g.rect(2, 10, 12, 12, WOOD[2]); g.rect(2, 10, 2, 12, WOOD[1]); g.rect(12, 10, 2, 12, WOOD[1]); g.rect(2, 21, 12, 1, WOOD[0]);
  g.rect(4, 14, 8, 6, WOOL.green[1]);
  g.disc(8, 8, 3, 3, SKIN[1]); g.rect(5, 3, 6, 3, WOOL.blue[1]); g.rect(5, 3, 6, 1, WOOL.blue[2]);
  g.rect(4, 9, 8, 2, WOOL.red[1]); g.rect(4, 9, 8, 1, WOOL.red[2]);
  g.rect(5, 11, 6, 5, WOOL.green[1]);
  g.rect(4, 11, 8, 5, '#e8dcc0'); g.rect(4, 11, 8, 1, '#fff8e8'); g.line(8, 11, 8, 15, '#8a7a5a');
  g.set(6, 13, '#6a5a3a'); g.set(10, 13, '#6a5a3a');
  g.rect(13, 12, 2, 3, '#e8e0d0'); g.rect(13, 12, 2, 1, '#a04030');
  g.rect(4, 22, 3, 1, INK); g.rect(9, 22, 3, 1, INK);
  return g.outline().rows();
}

// A guest asleep in an armchair, hat over the eyes, a blanket up, a "z" now and then.
function guestSleeper(f) {
  const g = new Grid(16, 24);
  g.rect(1, 9, 14, 13, WOOL.red[1]); g.rect(1, 9, 3, 13, WOOL.red[0]); g.rect(12, 9, 3, 13, WOOL.red[0]); g.rect(1, 9, 14, 1, WOOL.red[2]);
  g.rect(4, 12, 8, 9, WOOL.grey[1]); g.rect(4, 12, 8, 1, WOOL.grey[2]);
  for (let y = 14; y < 21; y += 3) g.rect(4, y, 8, 1, WOOL.grey[0]);
  g.disc(8, 10, 3, 3, SKIN[1]);
  g.rect(4, 6, 9, 3, WOOL.gold[0]); g.rect(5, 4, 6, 3, WOOL.gold[1]); g.rect(5, 4, 6, 1, WOOL.gold[2]);
  g.rect(1, 21, 14, 1, WOOD[0]);
  if (f) { g.rect(12, 2, 3, 1, '#d8e8f8'); g.set(14, 3, '#d8e8f8'); g.rect(12, 4, 3, 1, '#d8e8f8'); } else { g.rect(13, 4, 2, 1, '#d8e8f8'); g.set(14, 5, '#d8e8f8'); g.rect(13, 6, 2, 1, '#d8e8f8'); }
  return g.outline().rows();
}

// A climber on their feet, a pack on their back with a coil of rope tied to it, a helmet.
function guestClimber() {
  const g = new Grid(16, 24);
  g.rect(3, 6, 10, 14, '#3a5a8a'); g.rect(3, 6, 3, 14, '#4a74aa');
  g.disc(8, 5, 3, 3, SKIN[1]); g.rect(5, 1, 6, 3, '#d8a030'); g.rect(5, 1, 6, 1, '#f0c850');
  g.rect(3, 8, 2, 8, WOOL.red[1]); g.rect(11, 8, 2, 8, WOOL.red[1]);
  g.rect(1, 7, 3, 9, '#6a5a3a'); g.disc(2, 11, 2, 4, WOOL.gold[1]);
  for (let y = 9; y < 14; y += 2) g.line(1, y, 3, y, WOOL.gold[0]);
  g.rect(5, 17, 3, 6, '#2a2e38'); g.rect(9, 17, 3, 6, '#2a2e38');
  g.rect(4, 22, 5, 2, '#4a3220'); g.rect(8, 22, 5, 2, '#4a3220');
  g.rect(6, 6, 4, 1, '#ffffff');
  return g.outline().rows();
}

// A table with a map spread out under a pair of weights and a compass, a mug.
function mapTable() {
  const g = new Grid(32, 22);
  g.rect(2, 8, 28, 3, WOOD[3]); g.rect(2, 8, 28, 1, WOOD[4]); g.rect(2, 10, 28, 1, WOOD[1]);
  g.rect(4, 11, 3, 10, WOOD[1]); g.rect(25, 11, 3, 10, WOOD[1]);
  g.rect(5, 3, 20, 6, '#e8dcb8'); g.rect(5, 3, 20, 1, '#f6ecca');
  g.line(7, 5, 12, 6, '#5a7a9a'); g.line(12, 6, 14, 4, '#5a7a9a'); g.line(14, 4, 21, 6, '#5a7a9a');
  g.line(9, 7, 20, 7, '#8a7050'); g.set(18, 5, WOOL.red[1]); g.set(19, 5, WOOL.red[1]);
  g.disc(9, 3, 1.5, 1, IRON[2]); g.disc(25, 4, 1.5, 1, IRON[2]);
  g.disc(27, 6, 2, 2, WARM[1]); g.disc(27, 6, 1, 1, WARM[2]); g.set(27, 6, INK);
  g.rect(14, 2, 3, 3, '#a85a3a'); g.rect(14, 2, 3, 1, '#d08060');
  return g.outline().rows();
}

// A round card table: cards fanned out, three mugs, a candle stub.
function cardTable() {
  const g = new Grid(32, 22);
  g.disc(16, 10, 13, 5, WOOD[2]); g.disc(16, 9, 12, 4, WOOD[3]); g.disc(16, 9, 8, 2.6, '#2e5a3a');
  g.rect(14, 14, 4, 7, WOOD[1]); g.rect(10, 20, 12, 1, WOOD[0]);
  for (let i = 0; i < 4; i++) { g.rect(11 + i * 2, 7 + (i % 2), 3, 4, '#f6f0e0'); g.set(12 + i * 2, 8 + (i % 2), WOOL.red[1]); }
  g.rect(6, 6, 3, 3, '#a85a3a'); g.rect(24, 6, 3, 3, '#a85a3a'); g.rect(18, 11, 3, 3, '#a85a3a');
  g.rect(15, 4, 2, 3, '#f0e8d0'); g.set(15, 3, '#ffd060'); g.set(16, 3, '#fff0a0');
  return g.outline().rows();
}

// A bunch of dried herbs on a wall hook.
function herbs() {
  const g = new Grid(16, 20);
  g.rect(7, 0, 2, 3, IRON[1]); g.rect(6, 2, 4, 2, IRON[2]);
  g.rect(7, 4, 2, 3, WOOD[2]);
  for (let i = 0; i < 4; i++) { const x = 3 + i * 3; g.line(8, 6, x, 17, i % 2 ? GRASS[1] : '#7a8a4a'); g.line(8, 6, x + 1, 17, GRASS[2]); g.disc(x, 16, 1.5, 2, i % 2 ? '#8a9a58' : GRASS[2]); }
  g.rect(6, 6, 4, 2, '#a08a58');
  return g.outline().rows();
}

// A dartboard on the wall with the Hero's head painted on it; one dart in an ear.
function dartboard() {
  const g = new Grid(16, 16);
  g.disc(8, 8, 7, 7, '#2a1c14'); g.disc(8, 8, 6, 6, '#e8dcb8'); g.disc(8, 8, 4, 4, '#b04030'); g.disc(8, 8, 2, 2, '#e8dcb8');
  g.set(8, 8, INK);
  g.line(3, 6, 5, 7, IRON[3]); g.rect(1, 4, 3, 1, WOOL.red[1]); g.rect(1, 5, 3, 1, WOOL.red[2]);
  for (const [x, y] of [[8, 3], [13, 9]]) g.set(x, y, '#3a2c20');
  return g.outline().rows();
}

// A snow globe: a tiny village in glass, white flecks, a wooden foot.
function snowGlobe() {
  const g = new Grid(16, 16);
  g.rect(4, 12, 8, 3, WOOD[2]); g.rect(4, 12, 8, 1, WOOD[3]);
  g.disc(8, 7, 5, 5, ICE[2] + 'aa'); g.disc(8, 7, 4, 4, '#a4d4ec88');
  g.rect(5, 9, 6, 3, SNOW[3]); g.rect(6, 7, 2, 2, '#a85a3a'); g.rect(6, 6, 2, 1, WOOL.red[1]); g.rect(9, 8, 1, 1, WARM[2]);
  for (const [x, y] of [[4, 4], [11, 5], [6, 3], [9, 4], [10, 8], [5, 7]]) g.set(x, y, '#ffffff');
  g.set(6, 4, '#ffffffff');
  return g.outline().rows();
}

// A small chalkboard on a hook: today's menu, the soup underlined twice.
function menuBoard() {
  const g = new Grid(16, 22);
  g.rect(7, 0, 2, 3, IRON[1]); g.line(8, 2, 3, 6, IRON[2]); g.line(8, 2, 13, 6, IRON[2]);
  g.rect(1, 6, 14, 15, WOOD[2]); g.rect(2, 7, 12, 13, '#1e2a2a');
  g.rect(3, 8, 8, 1, '#d8e4dc'); g.rect(3, 11, 10, 1, '#d8e4dc'); g.rect(3, 14, 7, 1, '#d8e4dc'); g.rect(3, 16, 7, 1, '#d8e4dc');
  g.rect(3, 18, 4, 1, WARM[2]);
  g.rect(10, 8, 2, 1, WARM[2]);
  return g.outline().rows();
}

// A rail of scarves and mittens along a plank, hung up to dry or to wait.
function scarfPegs() {
  const g = new Grid(32, 26);
  g.rect(1, 2, 30, 3, WOOD[2]); g.rect(1, 2, 30, 1, WOOD[3]);
  const sc = [[3, WOOL.red, 15], [8, WOOL.blue, 19], [14, WOOL.gold, 12], [19, WOOL.green, 17], [25, WOOL.red, 21]];
  for (const [x, c, len] of sc) {
    g.rect(x, 5, 4, len, c[1]); g.rect(x, 5, 1, len, c[2]);
    for (let y = 8; y < 5 + len; y += 3) g.rect(x, y, 4, 1, c[0]);
    g.rect(x - 1, 5 + len, 6, 1, c[0]);
    g.rect(x + 1, 2, 2, 3, IRON[2]);
  }
  return g.outline().rows();
}

// A toy trumpet on the floor, a little dented, a sock stuffed in the bell.
function toyTrumpet() {
  const g = new Grid(16, 10);
  g.rect(2, 4, 9, 2, WARM[1]); g.rect(2, 4, 9, 1, WARM[2]); g.rect(11, 2, 3, 6, WARM[1]); g.rect(13, 2, 1, 6, WARM[0]);
  g.rect(1, 3, 2, 4, WARM[0]); g.rect(12, 3, 3, 3, WOOL.grey[1]);
  g.set(5, 6, WARM[0]);
  return g.outline().rows();
}

// The inn's cat, loafed up by the hearth, a ginger one, tail tucked, with a slow blink.
function catHearth(f) {
  const g = new Grid(16, 14);
  const O = '#e88a38'; const L = '#f8b868'; const D = '#a85a20';
  g.disc(8, 9, 6, 4, O); g.disc(7, 8, 4, 2, L); g.disc(12, 7, 3, 3, O);
  g.rect(11, 3, 2, 3, O); g.rect(14, 3, 2, 3, O); g.set(12, 4, '#f8a0a0'); g.set(14, 4, '#f8a0a0');
  if (f) { g.rect(12, 7, 2, 1, INK); g.rect(14, 7, 1, 1, INK); } else { g.set(12, 7, '#7ac848'); g.set(14, 7, '#7ac848'); }
  g.set(13, 8, '#f0a0a0');
  g.line(3, 11, 10, 12, D); g.line(3, 10, 4, 12, D);
  for (let x = 4; x < 11; x += 3) g.line(x, 6, x + 1, 9, D);
  g.rect(2, 12, 12, 1, D);
  return g.outline().rows();
}

// ---------------------------------------------------------------------------------------------
// THE TRAIL

// A painted way-blaze on a post: three bars of red and white, the top one peeling.
function blazePost() {
  const g = new Grid(16, 24);
  g.rect(6, 3, 4, 20, WOOD[2]); g.rect(6, 3, 1, 20, WOOD[3]); g.rect(9, 3, 1, 20, WOOD[1]);
  g.rect(5, 2, 6, 2, WOOD[3]);
  g.rect(6, 7, 4, 2, '#e8e0d0'); g.rect(6, 10, 4, 2, WOOL.red[1]); g.rect(6, 13, 4, 2, '#e8e0d0');
  g.set(7, 7, WOOD[2]); g.set(8, 8, WOOD[2]);
  g.rect(3, 22, 10, 2, STONE[1]); g.rect(4, 21, 8, 1, STONE[2]);
  snowCap(g, 5, 10, 2, 1);
  return g.outline().rows();
}

// A goat kid curled up in the grass, ears flicking.
function goatKid(f) {
  const g = new Grid(16, 14);
  g.disc(7, 9, 6, 3.5, WHITE[1]); g.disc(6, 8, 4, 2, WHITE[2]);
  g.disc(12, 7, 2.6, 2.6, WHITE[2]); g.rect(14, 8, 2, 2, WHITE[1]);
  g.set(11, 3, STONE[2]); g.set(13, 3, STONE[2]); g.set(11, 4, STONE[2]); g.set(13, 4, STONE[2]);
  g.rect(f ? 9 : 10, f ? 4 : 5, 2, 1, WHITE[0]);
  g.set(13, 7, INK); g.set(15, 9, INK);
  g.rect(2, 11, 10, 1, WHITE[0]);
  g.line(14, 10, 14, 11, WHITE[0]);
  return g.outline().rows();
}

// A marmot on its hind legs: up on a stone, paws together, listening.
function marmot(f) {
  const g = new Grid(16, 16);
  g.rect(2, 12, 12, 3, STONE[1]); g.rect(3, 11, 10, 1, STONE[2]);
  g.disc(8, 8, 4, 4.5, FUR[1]); g.disc(8, 8, 2.4, 3, FUR[2]);
  g.disc(8, 3, 3, 2.5, FUR[1]); g.set(6, 1, FUR[0]); g.set(10, 1, FUR[0]);
  g.set(7, 3, INK); g.set(9, 3, INK); g.set(8, 5, '#2a1a10');
  g.rect(f ? 6 : 7, 8, 3, 1, FUR[0]);
  g.line(11, 10, 14, f ? 7 : 9, FUR[0]);
  return g.outline().rows();
}

// A tuft of mountain flowers: blue gentians, white edelweiss in the other.
function flowers(kind) {
  const g = new Grid(16, 12);
  const col = kind === 'a' ? ['#3a6ad0', '#6a98f0'] : ['#e8f0d8', '#f6fbe8'];
  for (const [x, h] of [[3, 6], [7, 8], [11, 5], [13, 7], [5, 4]]) {
    g.line(x, 11, x, 11 - h, GRASS[1]);
    g.set(x - 1, 11 - h, col[0]); g.set(x + 1, 11 - h, col[0]); g.set(x, 11 - h - 1, col[1]); g.set(x, 11 - h + 1, col[0]);
    g.set(x, 11 - h, kind === 'a' ? '#f0d848' : '#e8c860');
  }
  g.rect(1, 10, 14, 2, GRASS[0]);
  for (const x of [2, 6, 9, 12]) g.line(x, 11, x + 1, 8, GRASS[2]);
  return g.rows();
}

// A leftover patch of old snow in a shaded hollow, grey at its edges.
function snowPatch() {
  const g = new Grid(32, 12);
  g.disc(16, 7, 14, 4, SNOW[1]); g.disc(15, 6, 12, 3, SNOW[2]); g.disc(13, 5, 7, 1.6, SNOW[3]);
  for (const [x, y] of [[4, 8], [28, 8], [10, 10], [22, 10]]) g.set(x, y, STONE[1]);
  return g.outline('#788898').rows();
}

// A heap of loose scree.
function scree() {
  const g = new Grid(16, 12);
  for (const [x, y, r, c] of [[4, 9, 2.5, STONE[1]], [8, 8, 3, STONE[2]], [12, 9, 2.5, STONE[1]], [6, 6, 2, STONE[3]], [10, 6, 2, STONE[2]], [3, 10, 1.5, STONE[2]], [13, 10, 1.5, STONE[3]]]) g.disc(x, y, r, r * 0.8, c);
  g.rect(5, 5, 3, 1, SNOW[3]);
  return g.outline().rows();
}

// A nest of twigs and feathers on the ledge, three speckled eggs.
function nest() {
  const g = new Grid(16, 12);
  g.disc(8, 8, 7, 3.5, WOOD[1]); g.disc(8, 7, 5, 2, '#8a7048');
  for (let i = 0; i < 9; i++) g.line(2 + i * 1.4, 10, 3 + i * 1.4, 6, WOOD[3]);
  for (const x of [5, 8, 11]) { g.disc(x, 6, 1.5, 1.5, '#d8d4c0'); g.set(x, 5, '#8a7a5a'); }
  g.rect(2, 9, 2, 1, WHITE[2]); g.rect(12, 10, 2, 1, WHITE[2]);
  return g.outline().rows();
}

// An iron peg hammered into the cliff foot with a rotted loop of rope still through its eye.
function piton() {
  const g = new Grid(16, 18);
  g.rect(5, 8, 7, 8, STONE[1]); g.rect(5, 8, 7, 1, STONE[2]);
  g.rect(8, 10, 5, 2, IRON[2]); g.rect(12, 9, 1, 4, IRON[3]); g.disc(13, 11, 1.5, 1.5, IRON[1]); g.set(13, 11, null);
  g.line(13, 12, 12, 17, '#8a7a58'); g.line(14, 12, 13, 17, '#6a5a3a');
  g.rect(3, 15, 10, 2, STONE[0]);
  return g.outline().rows();
}

// A post whose pale face is scratched with tally marks, groups of five, each a climb.
function tallyPost() {
  const g = new Grid(16, 24);
  g.rect(4, 2, 8, 20, WOOD[2]); g.rect(4, 2, 1, 20, WOOD[3]); g.rect(11, 2, 1, 20, WOOD[1]);
  for (let r = 0; r < 4; r++) for (let i = 0; i < 4; i++) g.line(6 + i * 1.4, 5 + r * 4, 6 + i * 1.4, 7 + r * 4, WOOD[0]);
  for (let r = 0; r < 4; r++) if (r < 3) g.line(5, 6 + r * 4, 11, 6 + r * 4, WOOD[0]);
  g.rect(2, 21, 12, 2, STONE[1]); g.rect(3, 20, 10, 1, STONE[2]);
  snowCap(g, 3, 12, 2, 1);
  return g.outline().rows();
}

// A pair of left boots, side by side, laced, stuffed with a rolled-up sock each, nobody in them.
function bootsLeft() {
  const g = new Grid(16, 12);
  for (const x of [1, 8]) {
    g.rect(x, 2, 4, 6, '#5a3a22'); g.rect(x, 2, 1, 6, '#7a5232'); g.rect(x + 4, 5, 3, 3, '#5a3a22');
    g.rect(x, 8, 7, 1, '#1a1410'); g.rect(x - 1, 1, 6, 1, '#3a2418'); g.rect(x + 1, 3, 2, 1, '#d8ccb0'); g.rect(x + 1, 5, 2, 1, '#d8ccb0');
    g.rect(x, 0, 3, 2, WOOL.red[1]);
  }
  g.rect(0, 9, 15, 1, SNOW[2]);
  return g.outline().rows();
}

// A tiny camp stove, a blackened billy on it, the flame blown out.
function campStove() {
  const g = new Grid(16, 16);
  g.rect(4, 11, 8, 3, IRON[1]); g.rect(4, 11, 8, 1, IRON[2]); g.rect(3, 13, 2, 2, IRON[0]); g.rect(11, 13, 2, 2, IRON[0]);
  g.rect(4, 4, 8, 8, '#2a2a30'); g.rect(4, 4, 2, 8, '#4a4a54'); g.rect(4, 3, 8, 2, IRON[2]);
  g.line(3, 6, 1, 9, IRON[2]); g.rect(1, 9, 2, 1, IRON[2]);
  g.line(5, 3, 8, 1, IRON[2]); g.line(11, 3, 8, 1, IRON[2]);
  snowCap(g, 4, 11, 3, 1);
  return g.outline().rows();
}

// An enamel mug with a skin of ice on the tea, left on a flat rock.
function tinMug() {
  const g = new Grid(16, 12);
  g.rect(2, 8, 12, 3, STONE[1]); g.rect(3, 7, 10, 1, STONE[2]);
  g.rect(5, 2, 5, 6, '#d8dce4'); g.rect(5, 2, 1, 6, '#fff'); g.rect(5, 2, 5, 1, '#3a6ab0'); g.rect(6, 3, 3, 1, ICE[2]);
  g.rect(10, 3, 2, 4, '#d8dce4'); g.set(11, 4, null); g.set(11, 5, null);
  return g.outline().rows();
}

// A rock ptarmigan pecking, already half in its winter white.
function ptarmigan(f) {
  const g = new Grid(16, 12);
  g.disc(8, 7, 5, 3, WHITE[1]); g.disc(7, 6, 3, 1.6, WHITE[2]); g.rect(1, 6, 3, 2, WHITE[0]);
  if (f) { g.disc(12, 8, 2, 1.8, WHITE[2]); g.rect(13, 10, 2, 1, WARM[1]); g.set(13, 7, INK); } else { g.disc(12, 5, 2, 2, WHITE[2]); g.rect(14, 5, 2, 1, WARM[1]); g.set(12, 4, INK); g.rect(11, 3, 2, 1, WOOL.red[1]); }
  g.set(7, 10, WARM[1]); g.set(9, 10, WARM[1]);
  g.set(5, 7, '#6a5a48'); g.set(6, 8, '#6a5a48');
  return g.outline().rows();
}

// A bent tent pole wedged between two rocks, a rag of orange nylon still tied to it.
function bentPole() {
  const g = new Grid(16, 22);
  g.rect(1, 18, 14, 3, STONE[1]); g.rect(2, 17, 12, 1, STONE[2]); g.line(8, 18, 8, 17, STONE[0]);
  g.line(7, 17, 6, 11, IRON[2]); g.line(6, 11, 9, 5, IRON[2]); g.line(9, 5, 13, 3, IRON[2]);
  g.rect(8, 4, 3, 5, '#e87a2a'); g.rect(8, 4, 1, 5, '#f8a050'); g.set(10, 9, '#e87a2a'); g.set(9, 10, '#e87a2a');
  return g.outline().rows();
}

// ---------------------------------------------------------------------------------------------
// THE CAVES

// An ice axe wedged in a crack in a block of ice, its shaft still leaning where its owner left it.
function iceAxe() {
  const g = new Grid(16, 24);
  g.rect(2, 11, 12, 11, ICE[1]); g.rect(2, 11, 12, 1, ICE[2]); g.rect(2, 11, 3, 11, ICE[2]); g.rect(11, 12, 3, 10, ICE[0]);
  g.rect(3, 14, 1, 4, ICE[3]); g.rect(12, 16, 1, 3, ICE[3]);
  g.line(8, 12, 8, 2, WOOD[3]); g.line(9, 12, 9, 2, WOOD[2]);
  g.rect(4, 1, 9, 2, IRON[2]); g.rect(4, 1, 9, 1, IRON[3]); g.set(3, 3, IRON[2]); g.set(13, 3, IRON[2]);
  g.rect(7, 6, 3, 1, WOOL.red[1]); g.rect(7, 8, 3, 1, WOOL.red[1]);
  g.set(7, 11, '#ffffff'); g.set(10, 11, '#ffffff');
  return g.outline().rows();
}

// A coil of climbing rope stiff with frost, its end frayed.
function ropeCoil() {
  const g = new Grid(16, 14);
  g.disc(8, 8, 6, 4, WOOL.gold[1]); g.disc(8, 8, 4, 2.5, WOOL.gold[0]); g.disc(8, 8, 1.5, 1, ICE[0]);
  for (let a = 0; a < 6.3; a += 0.5) g.set(8 + Math.cos(a) * 5, 8 + Math.sin(a) * 3.2, WOOL.gold[2]);
  g.line(13, 9, 15, 11, WOOL.gold[1]); g.set(15, 12, WOOL.gold[2]); g.set(14, 12, WOOL.gold[0]);
  for (const [x, y] of [[4, 7], [7, 5], [11, 6], [6, 10], [10, 10]]) g.set(x, y, SNOW[3]);
  return g.outline().rows();
}

// A single mitten, red, frozen in a curl of its own fingers, lying where it dropped.
function glove() {
  const g = new Grid(16, 10);
  g.rect(3, 3, 8, 5, WOOL.red[1]); g.rect(3, 3, 8, 1, WOOL.red[2]); g.rect(10, 2, 2, 3, WOOL.red[1]);
  g.rect(2, 4, 2, 4, WOOL.grey[1]); g.rect(1, 4, 2, 4, WOOL.grey[2]);
  g.rect(5, 5, 4, 1, WOOL.red[0]); g.rect(4, 6, 6, 1, WOOL.red[0]);
  g.rect(4, 3, 4, 1, SNOW[3]); g.rect(9, 4, 1, 2, SNOW[2]);
  g.line(12, 5, 15, 7, WOOL.red[0]);
  return g.outline().rows();
}

// A candle stub frozen into a puddle of its own wax and the ice that came after.
function frostCandle() {
  const g = new Grid(16, 14);
  g.disc(8, 11, 6, 2.5, ICE[1]); g.disc(8, 10, 5, 1.6, ICE[2]);
  g.rect(6, 4, 4, 7, '#e8dcc0'); g.rect(6, 4, 1, 7, '#fff8e8'); g.rect(9, 5, 1, 6, '#b8a888');
  g.rect(6, 3, 4, 1, '#e8dcc0'); g.set(8, 2, INK); g.set(8, 1, '#c8d8e8');
  g.rect(4, 11, 2, 1, WOOD[2]);
  for (const [x, y] of [[4, 9], [11, 10]]) g.set(x, y, '#ffffff');
  return g.outline().rows();
}

// A climber's helmet, cracked once and glued, a bit of frost inside it.
function helmet() {
  const g = new Grid(16, 12);
  g.disc(8, 8, 6, 5, '#d8a030'); g.rect(2, 8, 12, 3, '#d8a030'); g.rect(2, 10, 12, 1, '#8a6418');
  g.disc(7, 6, 3, 2, '#f0c850'); g.line(9, 3, 11, 8, '#6a4818'); g.line(10, 4, 11, 5, '#6a4818');
  g.rect(4, 9, 8, 2, '#1e2a3a'); g.rect(4, 9, 8, 1, SNOW[2]);
  g.rect(1, 9, 1, 2, WOOL.grey[1]);
  return g.outline().rows();
}

// A knot of small ice crystals pushing out of the floor, glowing faintly from inside.
function iceBud() {
  const g = new Grid(16, 18);
  const spike = (x, h, w, c) => { for (let j = 0; j < h; j++) { const ww = Math.max(1, Math.round(w * (1 - j / (h + 1)))); g.rect(x - Math.floor(ww / 2), 16 - j, ww, 1, c); } };
  spike(8, 14, 5, ICE[1]); spike(4, 9, 4, ICE[2]); spike(12, 10, 4, ICE[1]); spike(6, 6, 3, ICE[3]); spike(10, 7, 3, ICE[2]);
  g.rect(8, 6, 1, 8, ICE[3]); g.rect(4, 11, 1, 4, ICE[3]);
  g.rect(2, 16, 12, 1, ICE[0]);
  return g.outline().rows();
}

// A patch of hoar frost on the cave floor: feathery crystals across the dark.
function hoar() {
  const g = new Grid(32, 10);
  for (let i = 0; i < 26; i++) {
    const x = 2 + ((i * 11) % 28); const y = 1 + ((i * 7) % 8);
    g.set(x, y, SNOW[3]); g.set(x + 1, y + 1, SNOW[2]); g.set(x - 1, y + 1, SNOW[2]); g.set(x, y + 2, SNOW[2] + '99');
  }
  return g.rows();
}

// A little fish, frozen into the ice of the floor as it swam, eye still bright.
function frozenFish() {
  const g = new Grid(16, 8);
  g.disc(8, 4, 6, 3, ICE[1] + 'aa');
  g.disc(7, 4, 4, 1.6, '#c8d4e0'); g.line(11, 4, 14, 2, '#c8d4e0'); g.line(11, 4, 14, 6, '#c8d4e0');
  g.set(5, 3, INK); g.set(9, 2, '#8a98a8'); g.set(8, 6, '#8a98a8');
  return g.rows();
}

// A small spike of ice, the height of your knee, with a drip hanging off its tip.
function iceSpike() {
  const g = new Grid(16, 18);
  for (let j = 0; j < 14; j++) { const w = Math.max(1, Math.round(6 * (1 - j / 14))); g.rect(8 - Math.floor(w / 2), 16 - j, w, 1, j < 3 ? ICE[0] : ICE[1]); }
  g.rect(6, 6, 1, 8, ICE[2]); g.rect(8, 10, 1, 4, ICE[3]);
  g.rect(3, 16, 10, 1, ICE[0]);
  return g.outline().rows();
}

// Blown-in snow banked up against a cave wall, a hare's print in it.
function caveSnow() {
  return drift(16, 10);
}

// A goat's horn, curled, lying where it fell, a bit of frost along its ridges.
function horn() {
  const g = new Grid(16, 10);
  g.disc(8, 6, 6, 3.5, '#c8b890'); g.disc(8, 6, 3.5, 2, '#1e1a18'); g.rect(0, 5, 6, 4, null);
  g.rect(2, 7, 6, 2, '#c8b890'); g.line(11, 3, 14, 6, '#c8b890');
  for (let i = 3; i < 12; i += 3) g.set(i, 4, '#a89870');
  g.rect(5, 3, 3, 1, SNOW[3]);
  return g.outline().rows();
}

// Scratches on the wall: a tally, a name, an arrow with its tail, done with a knife. (Wall decoration.)
function scratches() {
  const g = new Grid(16, 16);
  g.rect(1, 1, 14, 14, STONE[1] + '88');
  for (let i = 0; i < 5; i++) g.line(3 + i * 1.5, 3, 3 + i * 1.5, 7, SNOW[2]);
  g.line(2, 5, 10, 5, SNOW[2]);
  g.line(3, 10, 12, 10, SNOW[2]); g.line(12, 10, 10, 8, SNOW[2]); g.line(12, 10, 10, 12, SNOW[2]);
  g.line(3, 13, 7, 13, SNOW[2]); g.line(8, 12, 10, 14, SNOW[2]);
  return g.rows();
}

// A shallow puddle of meltwater with ripples going out from the drip that feeds it.
function dripPool(f) {
  const g = new Grid(16, 10);
  g.disc(8, 6, 7, 3, ICE[0] + 'cc'); g.disc(8, 5, 6, 2, ICE[1] + 'bb'); g.line(3, 5, 9, 4, ICE[3] + 'cc');
  const r = f ? 3 : 1.5;
  g.rect(8 - r, 5, Math.round(r * 2), 1, ICE[3] + 'aa');
  g.rect(8, f ? 1 : 0, 1, 2, ICE[3]);
  return g.rows();
}

export const R2R_PROP_SPRITES = {
  r2r_woodpile: woodpile(),
  r2r_chop_block: chopBlock(),
  r2r_sled: sled(),
  r2r_snow_fort: snowFort(),
  r2r_drift_s: drift(16, 11),
  r2r_drift_l: drift(32, 15),
  r2r_trough: trough(),
  r2r_snowshoes: snowshoes(),
  r2r_axe_rack: axeRack(),
  r2r_snow_angel: snowAngel(),
  r2r_snow_dog: snowDog(),
  r2r_tracks: tracks(),
  r2r_sack: sack(),
  r2r_chimney: chimney(),
  r2r_roof_cock: roofCock(),
  r2r_roof_cat: roofCat(),
  r2r_icicles: icicles(),
  r2r_mat: mat(),
  r2r_window: windowSill(false),
  r2r_window_pot: windowSill(true),
  r2r_boots_dry: bootsDry(0),
  r2r_coat_hooks: coatHooks(),
  r2r_log_basket: logBasket(),
  r2r_guest_reader: guestReader(),
  r2r_guest_sleeper: guestSleeper(0),
  r2r_guest_climber: guestClimber(),
  r2r_map_table: mapTable(),
  r2r_card_table: cardTable(),
  r2r_herbs: herbs(),
  r2r_dartboard: dartboard(),
  r2r_snow_globe: snowGlobe(),
  r2r_menu_board: menuBoard(),
  r2r_scarf_pegs: scarfPegs(),
  r2r_toy_trumpet: toyTrumpet(),
  r2r_cat_hearth: catHearth(0),
  r2r_blaze_post: blazePost(),
  r2r_goat_kid: goatKid(0),
  r2r_marmot: marmot(0),
  r2r_flowers_a: flowers('a'),
  r2r_flowers_b: flowers('b'),
  r2r_snow_patch: snowPatch(),
  r2r_scree: scree(),
  r2r_nest: nest(),
  r2r_piton: piton(),
  r2r_tally_post: tallyPost(),
  r2r_boots_left: bootsLeft(),
  r2r_camp_stove: campStove(),
  r2r_tin_mug: tinMug(),
  r2r_ptarmigan: ptarmigan(0),
  r2r_bent_pole: bentPole(),
  r2r_ice_axe: iceAxe(),
  r2r_rope_coil: ropeCoil(),
  r2r_glove: glove(),
  r2r_frost_candle: frostCandle(),
  r2r_helmet: helmet(),
  r2r_ice_bud: iceBud(),
  r2r_hoar: hoar(),
  r2r_frozen_fish: frozenFish(),
  r2r_ice_spike: iceSpike(),
  r2r_cave_snow: caveSnow(),
  r2r_horn: horn(),
  r2r_scratches: scratches(),
  r2r_drip_pool: dripPool(0),
  ...R3A_PROP_SPRITES,
};

Object.assign(palette, R3A_PALETTE);
export const R2R_PALETTE_EXTRA = palette;
export const R2R_PALETTE = palette;

// Moving ones: frames of one size, played by `animation: '<same name>'`.
export const R2R_BOOTS_DRY_SPRITES = frames(bootsDry, 2);
export const R2R_GUEST_SLEEPER_SPRITES = frames(guestSleeper, 2);
export const R2R_CAT_HEARTH_SPRITES = frames(catHearth, 2);
export const R2R_GOAT_KID_SPRITES = frames(goatKid, 2);
export const R2R_MARMOT_SPRITES = frames(marmot, 2);
export const R2R_PTARMIGAN_SPRITES = frames(ptarmigan, 2);
export const R2R_DRIP_POOL_SPRITES = frames(dripPool, 2);

// How many tiles wide each big one stands.
export const R2R_FOOTPRINTS = {
  r2r_woodpile: 2,
  r2r_sled: 2,
  r2r_snow_fort: 2,
  r2r_drift_l: 2,
  r2r_trough: 2,
  r2r_tracks: 2,
  r2r_icicles: 2,
  r2r_mat: 2,
  r2r_coat_hooks: 2,
  r2r_map_table: 2,
  r2r_card_table: 2,
  r2r_scarf_pegs: 2,
  r2r_boots_dry: 2,
  r2r_snow_patch: 2,
  r2r_hoar: 2,
  ...R3A_FOOTPRINTS,
};

// What glows (from the middle of the prop's foot, up is negative): the frosted windows' candle, the
// ice buds, the frozen candle.
export const R2R_GLOWS = {};
