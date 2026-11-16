// Life-pass props for chapter 5's Sunken Lanes and the Soundings (14 November 2026): the little
// belongings, signs, trees and cave things that make the flooded lanes and the sea caves look
// lived in. Drawn like lanesProps.js: rows of characters from a small painter, 16 pixels to a
// tile, standing on the bottom edge and centred over their footprint. Every id starts `lv_`.
// Nothing here hangs in the air: every lamp, sign and line has its post, hook or peg.
//
//   Lanes:  lv_letterbox lv_bench lv_barrow lv_rain_barrel lv_scarecrow lv_skep lv_birdbath
//           lv_sign_bakery lv_sign_lane lv_sign_inn lv_sill (a window in a wall, belongings on
//           its sill) lv_sill_pots lv_porch (a front door, step and boots) lv_churn lv_cat_bowl
//           lv_gnome lv_boards (flat) lv_ivy lv_reeds (animated) lv_apple_tree lv_willow
//           lv_sundial lv_milestone lv_chimney lv_roof_ridge lv_toadstools (flat) lv_kettle
//   Caves:  lv_hook_lamp lv_boot lv_lunch_pail lv_coil_line lv_midden lv_pearl_pool
//           lv_glow_shelf lv_echo_stone lv_hymn_board lv_kneelers (flat) lv_votive_boats
//           lv_poor_box lv_tripod lv_whale_rib lv_ledge_cups lv_glove lv_cave_fern lv_drip_column
//           lv_candle_stubs (flat) lv_umbrella lv_chalk_arrow (flat) lv_glow_threads (animated)

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xf000 + colors.size);
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
const INK = '#10161a';
const WOOD = ['#2e2218', '#4e3a28', '#6e5538', '#92764e', '#b89a68'];
const STONE = ['#3a4440', '#525e58', '#6c7872', '#8c9a92', '#a8b4aa'];
const LEAF = ['#243e26', '#35582f', '#4c7a3e', '#6ea052', '#92c068'];
const WATER = ['#1f4a44', '#2c5e54', '#5aa89c', '#8ad0c0'];
const RED = ['#6a2a22', '#a04030', '#d06a4c'];
const CREAM = ['#b8ac90', '#d8ccb0', '#f0e6cc'];
const IRON = ['#22262c', '#3c4250', '#5c6676', '#8a94a4'];
const GLOW = ['#2a8a7a', '#5ad0b8', '#b8fff0'];
const WARM = ['#a86a1e', '#e8a830', '#ffe080'];

// The flood lapping across a standing thing, with it darker and greener below.
function flood(g, y) {
  for (let yy = y + 1; yy < g.h; yy++) for (let x = 0; x < g.w; x++) {
    if (!g.cells[yy][x]) continue;
    const d = yy - y;
    if (d > 5 || (d > 2 && (x + yy) % 2)) g.set(x, yy, null);
    else g.set(x, yy, d < 3 ? WATER[0] + 'cc' : WATER[1] + 'aa');
  }
  for (let x = 0; x < g.w; x++) if ((x * 7) % 5 !== 0) g.set(x, y + Math.round(Math.sin(x / 3) * 0.6), x % 3 ? WATER[3] + 'd0' : '#e4fbf4e0');
}

// ---------------------------------------------------------------------------------------------
// THE LANES

// A post with a letterbox on it: red, dented, with the number painted out and in again.
function letterbox() {
  const g = new Grid(16, 24);
  g.rect(7, 8, 3, 16, WOOD[1]); g.rect(8, 8, 1, 16, WOOD[2]);
  g.rect(3, 3, 11, 7, RED[1]); g.rect(3, 3, 11, 1, RED[2]); g.rect(3, 9, 11, 1, RED[0]);
  g.rect(5, 6, 6, 1, INK); g.rect(12, 4, 1, 4, RED[0]);
  g.rect(6, 11, 5, 3, CREAM[1]); g.set(7, 12, INK); g.set(9, 12, INK); g.set(8, 13, INK);
  g.rect(3, 22, 4, 2, LEAF[1]); g.rect(10, 22, 3, 2, LEAF[2]);
  return g.outline().rows();
}

// A bench, one end in the mud, with someone's knitting left on it.
function bench() {
  const g = new Grid(32, 18);
  g.rect(2, 8, 28, 3, WOOD[2]); g.rect(2, 8, 28, 1, WOOD[3]); g.rect(2, 10, 28, 1, WOOD[0]);
  g.rect(3, 2, 26, 2, WOOD[2]); g.rect(3, 2, 26, 1, WOOD[3]); g.rect(4, 4, 2, 4, WOOD[1]); g.rect(26, 4, 2, 4, WOOD[1]);
  g.rect(4, 11, 3, 6, WOOD[1]); g.rect(25, 11, 3, 6, WOOD[1]); g.rect(24, 14, 6, 3, '#3a5a3a');
  g.disc(15, 6, 3, 2, '#a85a6a'); g.disc(14, 6, 1.5, 1, '#c87a8a'); g.line(17, 7, 22, 9, WOOD[4]); g.line(18, 6, 23, 8, WOOD[4]);
  g.line(20, 7, 21, 11, '#a85a6a');
  return g.outline().rows();
}

// A wheelbarrow of turnips, nobody coming back for it.
function barrow() {
  const g = new Grid(32, 20);
  g.rect(8, 6, 16, 6, WOOD[2]); g.rect(8, 6, 16, 1, WOOD[3]); g.rect(9, 11, 14, 1, WOOD[0]);
  g.line(24, 8, 30, 10, WOOD[1]); g.line(24, 9, 30, 11, WOOD[1]); g.line(8, 10, 2, 14, WOOD[1]);
  g.disc(24, 15, 3, 3, IRON[1]); g.disc(24, 15, 1, 1, IRON[2]);
  g.rect(5, 14, 2, 5, WOOD[1]); g.rect(9, 12, 2, 6, WOOD[1]);
  for (const [x, y] of [[10, 4], [14, 3], [18, 4], [12, 5], [16, 5], [21, 5]]) { g.disc(x, y, 2, 2, '#e8dcec'); g.set(x, y - 1, '#a878b0'); g.set(x, y - 3, LEAF[2]); g.set(x + 1, y - 4, LEAF[3]); }
  return g.outline().rows();
}

// A rain barrel brim-full, the lid propped up on one side.
function rainBarrel() {
  const g = new Grid(16, 22);
  g.rect(3, 6, 10, 15, WOOD[2]); g.rect(3, 6, 2, 15, WOOD[1]); g.rect(11, 6, 2, 15, WOOD[1]); g.rect(7, 6, 2, 15, WOOD[3]);
  g.rect(3, 9, 10, 1, IRON[1]); g.rect(3, 16, 10, 1, IRON[1]);
  g.rect(4, 4, 8, 3, WATER[1]); g.rect(5, 4, 5, 1, WATER[3]); g.line(2, 5, 7, 1, WOOD[3]); g.line(2, 6, 7, 2, WOOD[2]);
  g.rect(3, 20, 10, 1, WOOD[0]);
  return g.outline().rows();
}

// A scarecrow in a flooded vegetable bed: a coat, a hat, one stick arm, a gull on its shoulder.
function scarecrow() {
  const g = new Grid(20, 36);
  g.rect(9, 12, 2, 24, WOOD[1]); g.rect(9, 12, 1, 24, WOOD[2]);
  g.rect(2, 15, 16, 2, WOOD[2]); g.line(2, 15, 1, 19, WOOD[2]); g.line(17, 15, 18, 20, WOOD[2]);
  g.rect(6, 15, 8, 12, '#5a4a6a'); g.rect(6, 15, 8, 1, '#7a6a8a'); g.rect(6, 22, 8, 1, '#3a2e48');
  g.rect(8, 17, 2, 2, '#c8a070'); g.rect(8, 24, 4, 3, '#8a3a3a');
  g.disc(10, 9, 4, 4, '#d8c898'); g.set(8, 8, INK); g.set(12, 8, INK); g.rect(8, 11, 4, 1, INK);
  g.rect(4, 5, 12, 2, '#6a5a3a'); g.rect(7, 1, 6, 5, '#7a6a44'); g.rect(7, 4, 6, 1, RED[1]);
  g.rect(5, 15, 1, 6, '#d8c898'); g.rect(15, 15, 1, 5, '#d8c898'); g.rect(3, 19, 1, 3, '#d8c898');
  g.rect(14, 12, 4, 3, CREAM[2]); g.rect(17, 12, 2, 1, '#f0c040'); g.set(15, 13, INK);
  return g.outline().rows();
}

// A straw skep on its stand: bees come and go, the stand's legs under it.
function skep() {
  const g = new Grid(16, 18);
  g.rect(2, 12, 12, 2, WOOD[2]); g.rect(3, 14, 2, 4, WOOD[1]); g.rect(11, 14, 2, 4, WOOD[1]);
  g.disc(8, 8, 5, 5, '#c8a448'); g.rect(3, 9, 10, 3, '#c8a448');
  for (const y of [5, 8, 11]) g.rect(3, y, 10, 1, '#8a6a24');
  g.rect(7, 11, 3, 2, INK); g.set(8, 3, '#8a6a24');
  return g.outline().rows();
}

// A birdbath: a stone bowl, a drowned leaf in it, a wren's footprints on the rim.
function birdbath() {
  const g = new Grid(16, 20);
  g.rect(6, 8, 4, 9, STONE[2]); g.rect(6, 8, 1, 9, STONE[3]); g.rect(4, 16, 8, 3, STONE[1]); g.rect(4, 16, 8, 1, STONE[3]);
  g.disc(8, 6, 7, 3, STONE[2]); g.disc(8, 5, 5.5, 2, WATER[1]); g.rect(5, 5, 5, 1, WATER[3]);
  g.rect(9, 5, 2, 1, LEAF[3]); g.set(3, 7, STONE[4]);
  g.rect(3, 17, 3, 2, LEAF[1]);
  return g.outline().rows();
}

// Signs on posts: the shop bracket with a loaf, a lane finger-post, the inn's tankard.
function signBakery() {
  const g = new Grid(24, 30);
  g.rect(3, 4, 3, 26, WOOD[1]); g.rect(4, 4, 1, 26, WOOD[2]);
  g.rect(3, 4, 18, 2, IRON[1]); g.rect(18, 6, 1, 3, IRON[1]); g.rect(10, 6, 1, 3, IRON[1]);
  g.rect(7, 8, 14, 11, WOOD[2]); g.rect(7, 8, 14, 1, WOOD[3]); g.rect(7, 18, 14, 1, WOOD[0]);
  g.disc(14, 13, 4, 3, '#d8a050'); g.rect(11, 12, 6, 1, '#a8702c'); g.rect(13, 11, 1, 3, '#a8702c');
  g.rect(8, 28, 8, 2, WATER[1] + 'aa');
  return g.outline().rows();
}

function signLane() {
  const g = new Grid(16, 32);
  g.rect(7, 4, 3, 28, WOOD[1]); g.rect(8, 4, 1, 28, WOOD[2]);
  g.rect(1, 6, 14, 6, '#2a4a7a'); g.rect(1, 6, 14, 1, '#4a6aa0'); g.rect(1, 11, 14, 1, '#1a2e50');
  g.rect(3, 8, 10, 1, CREAM[1]); g.rect(4, 10, 8, 1, CREAM[1]);
  g.rect(3, 22, 4, 4, LEAF[1]); g.rect(10, 24, 3, 3, LEAF[2]);
  return g.outline().rows();
}

function signInn() {
  const g = new Grid(24, 34);
  g.rect(3, 3, 3, 31, WOOD[1]); g.rect(4, 3, 1, 31, WOOD[2]); g.rect(3, 3, 19, 2, WOOD[2]);
  g.rect(8, 5, 1, 4, IRON[1]); g.rect(18, 5, 1, 4, IRON[1]);
  g.rect(6, 9, 16, 14, '#3a2a1e'); g.rect(6, 9, 16, 1, WOOD[3]); g.rect(6, 22, 16, 1, WOOD[0]);
  g.rect(10, 12, 7, 8, '#d0a038'); g.rect(10, 12, 7, 1, '#f0d070'); g.rect(17, 14, 3, 4, '#d0a038'); g.rect(18, 15, 1, 2, '#3a2a1e');
  g.rect(10, 12, 7, 2, CREAM[2]);
  g.rect(4, 31, 6, 3, WATER[1] + 'aa');
  return g.outline().rows();
}

// A window in a stone wall with its belongings on the sill: a pot of geraniums, a candle in a
// jar, a cup, curtains drawn back. The wall round it is the wall it hangs on.
function sill() {
  const g = new Grid(32, 30);
  g.rect(0, 0, 32, 30, STONE[1]);
  for (let y = 6, k = 0; y < 30; y += 6, k++) { g.rect(0, y, 32, 1, STONE[0]); for (let x = k % 2 ? 4 : 10; x < 32; x += 12) g.rect(x, y - 5, 1, 5, STONE[0]); }
  g.rect(9, 3, 14, 17, STONE[3]); g.rect(11, 5, 10, 13, '#20323a'); g.rect(11, 5, 10, 2, '#3a5a64'); g.rect(15, 5, 2, 13, STONE[3]); g.rect(11, 11, 10, 1, STONE[3]);
  g.rect(11, 5, 3, 13, '#7a4a5a'); g.rect(18, 5, 3, 13, '#7a4a5a'); g.rect(11, 5, 3, 1, '#a86a7a'); g.rect(18, 5, 3, 1, '#a86a7a');
  g.rect(7, 20, 18, 3, STONE[4]); g.rect(7, 22, 18, 1, STONE[1]);
  g.rect(9, 15, 4, 5, '#a8584a'); g.rect(9, 15, 4, 1, '#c87a68'); for (const x of [9, 11, 12]) { g.set(x, 13, '#d03a4a'); g.set(x, 14, LEAF[2]); } g.set(10, 12, '#e86a7a'); g.set(11, 14, LEAF[3]);
  g.rect(17, 17, 3, 3, CREAM[1]); g.rect(17, 17, 3, 1, CREAM[2]); g.set(18, 15, WARM[2]); g.set(18, 16, WARM[1]);
  g.rect(21, 18, 3, 2, '#d8d0c0'); g.set(24, 18, '#d8d0c0');
  return g.outline().rows();
}

// Three little pots on a stone ledge.
function sillPots() {
  const g = new Grid(16, 18);
  g.rect(0, 12, 16, 4, STONE[3]); g.rect(0, 12, 16, 1, STONE[4]); g.rect(0, 15, 16, 1, STONE[0]);
  g.rect(1, 8, 4, 4, '#a8584a'); g.rect(6, 9, 4, 3, '#b86a50'); g.rect(11, 7, 4, 5, '#8a4a40');
  for (const [x, y, c] of [[2, 6, '#e8d050'], [3, 5, LEAF[3]], [7, 7, '#e87a8a'], [8, 6, LEAF[3]], [12, 4, '#f0f0f0'], [13, 3, LEAF[2]], [12, 5, LEAF[2]]]) { g.set(x, y, c); g.set(x, y + 1, LEAF[2]); }
  g.rect(3, 16, 3, 2, LEAF[1]);
  return g.outline().rows();
}

// A front door in a bit of cottage wall, a scraped step, boots lined up, a doormat reading nothing.
function porch() {
  const g = new Grid(32, 36);
  g.rect(0, 0, 32, 30, STONE[1]);
  for (let y = 6, k = 0; y < 30; y += 6, k++) { g.rect(0, y, 32, 1, STONE[0]); for (let x = k % 2 ? 3 : 9; x < 32; x += 12) g.rect(x, y - 5, 1, 5, STONE[0]); }
  g.rect(9, 5, 14, 25, '#3a4a6a'); g.rect(9, 5, 14, 2, '#5a6a8a'); g.rect(11, 8, 4, 8, '#2a3652'); g.rect(17, 8, 4, 8, '#2a3652');
  g.rect(11, 19, 10, 9, '#2a3652'); g.disc(20, 20, 1, 1, '#d8b840'); g.rect(14, 2, 4, 3, CREAM[1]); g.set(15, 3, INK); g.set(16, 3, INK);
  g.rect(7, 30, 18, 3, STONE[3]); g.rect(7, 30, 18, 1, STONE[4]); g.rect(9, 33, 14, 2, STONE[1]);
  g.rect(10, 28, 8, 2, '#8a6a4a'); g.rect(1, 25, 3, 5, '#2a2a30'); g.rect(1, 25, 3, 2, '#3a3a44'); g.rect(5, 26, 3, 4, '#2a2a30');
  g.rect(24, 28, 6, 3, '#8a3a3a');
  return g.outline().rows();
}

// A milk churn and a cat's saucer, tide-marked and left.
function churn() {
  const g = new Grid(16, 22);
  g.rect(4, 7, 8, 14, IRON[2]); g.rect(4, 7, 2, 14, IRON[3]); g.rect(10, 7, 2, 14, IRON[1]);
  g.rect(5, 4, 6, 3, IRON[2]); g.rect(3, 3, 10, 2, IRON[1]); g.rect(4, 12, 8, 1, IRON[1]); g.rect(3, 18, 10, 1, IRON[1]);
  g.rect(4, 16, 8, 1, '#8ac0a8'); g.rect(6, 9, 4, 2, CREAM[2]);
  return g.outline().rows();
}

function catBowl() {
  const g = new Grid(16, 10);
  g.disc(8, 6, 6, 2.5, '#d8d0c0'); g.disc(8, 5, 4.5, 1.5, '#b87a50'); g.rect(6, 4, 3, 1, '#8a5a3a');
  g.line(3, 8, 5, 9, CREAM[2]); g.set(11, 8, CREAM[2]); g.set(12, 9, CREAM[2]);
  return g.outline().rows();
}

// A garden gnome fishing in the flood from his plinth: the lane's one clear idea.
function gnome() {
  const g = new Grid(20, 26);
  g.rect(3, 20, 12, 5, STONE[2]); g.rect(3, 20, 12, 1, STONE[3]);
  g.rect(6, 10, 6, 10, '#3a6aa0'); g.rect(6, 10, 6, 1, '#5a8ac0'); g.rect(7, 16, 4, 1, '#2a4a70');
  g.disc(9, 8, 3.5, 3.5, '#e8c8a8'); g.rect(6, 9, 6, 4, CREAM[2]); g.rect(7, 5, 5, 1, '#e8c8a8');
  g.rect(6, 1, 6, 5, RED[1]); g.rect(7, 0, 4, 2, RED[1]); g.set(9, 7, INK);
  g.line(12, 13, 19, 6, WOOD[3]); g.line(19, 6, 19, 17, '#c8d0d8');
  g.rect(18, 17, 2, 1, RED[2]); g.rect(15, 23, 4, 2, WATER[2] + 'aa');
  return g.outline().rows();
}

// Duckboards laid over the mud: flat, scattered, one end lifting.
function boards() {
  const g = new Grid(48, 14);
  for (let i = 0; i < 4; i++) {
    const y = 1 + i * 3;
    g.rect(1 + (i % 2) * 2, y, 44, 2, i % 2 ? WOOD[2] : WOOD[1]); g.rect(1 + (i % 2) * 2, y, 44, 1, WOOD[3]);
  }
  g.rect(8, 0, 2, 14, WOOD[0]); g.rect(26, 0, 2, 14, WOOD[0]); g.rect(40, 0, 2, 14, WOOD[0]);
  return g.rows();
}

// Ivy down a wall face, over the stone it grows on.
function ivy() {
  const g = new Grid(16, 34);
  for (let i = 0; i < 4; i++) {
    const x = 2 + i * 4;
    const len = 12 + ((i * 7) % 15);
    for (let y = 0; y < len; y++) g.set(x + Math.round(Math.sin(y / 3 + i) * 1.5), y, LEAF[0]);
    for (let y = 2; y < len; y += 3) { const ox = x + Math.round(Math.sin(y / 3 + i) * 1.5); g.rect(ox - 1, y, 3, 2, LEAF[1 + (y % 3 === 0 ? 1 : 0)]); g.set(ox - 1, y, LEAF[3]); }
  }
  return g.rows();
}

// Reeds at the water's edge, swaying (3 frames).
function reeds(i) {
  const g = new Grid(16, 26);
  const sway = [0, 1, 0, -1][i % 4];
  for (let b = 0; b < 6; b++) {
    const x0 = 2 + b * 2 + (b % 2);
    const h = 14 + ((b * 5) % 10);
    for (let y = 0; y < h; y++) g.set(x0 + Math.round(sway * (y / h) * (b % 2 ? 1 : -1) * 2), 25 - y, y > 6 ? LEAF[2] : LEAF[1]);
    if (b % 2) { const top = 25 - h; const ox = x0 + Math.round(sway * 2 * (b % 2 ? 1 : -1)); g.rect(ox - 1, top, 2, 4, WOOD[1]); g.set(ox - 1, top, WOOD[2]); }
  }
  g.rect(0, 24, 16, 2, LEAF[0]);
  return g.rows();
}

// A drowned apple tree: the trunk in the flood, the crown above it, apples still on, one fell.
function appleTree(wet = true) {
  const g = new Grid(36, 50);
  g.rect(15, 20, 6, 28, WOOD[1]); g.rect(15, 20, 2, 28, WOOD[2]); g.rect(19, 20, 2, 28, WOOD[0]);
  g.line(16, 24, 7, 16, WOOD[1]); g.line(20, 24, 29, 15, WOOD[1]);
  for (const [cx, cy, rx, ry] of [[18, 8, 12, 7], [8, 14, 7, 6], [28, 13, 8, 6], [18, 15, 11, 5]]) g.disc(cx, cy, rx, ry, LEAF[1]);
  for (const [cx, cy, rx, ry] of [[16, 5, 8, 4], [26, 11, 5, 3], [8, 12, 4, 3], [14, 12, 6, 3]]) g.disc(cx, cy, rx, ry, LEAF[2]);
  for (const [x, y] of [[10, 7], [20, 4], [26, 9], [15, 12], [30, 14], [6, 16], [21, 15]]) { g.set(x, y, RED[1]); g.set(x + 1, y, RED[1]); g.set(x, y + 1, RED[0]); g.set(x, y, RED[2]); }
  for (const [x, y] of [[13, 8], [22, 8], [24, 5]]) g.set(x, y, LEAF[4]);
  g.outline(LEAF[0]);
  if (wet) flood(g, 40);
  else { g.rect(11, 46, 14, 2, LEAF[1]); g.rect(9, 44, 4, 2, LEAF[2]); g.rect(24, 45, 3, 2, LEAF[2]); }
  return g.rows();
}

// A willow at the water's edge, fronds trailing to the surface. Wide, so a person can stand under it.
function willow() {
  const g = new Grid(72, 68);
  g.rect(33, 16, 6, 50, WOOD[1]); g.rect(33, 16, 2, 50, WOOD[2]); g.rect(37, 16, 2, 50, WOOD[0]);
  g.line(34, 22, 18, 12, WOOD[1]); g.line(38, 22, 54, 11, WOOD[1]);
  g.disc(36, 12, 30, 9, LEAF[1]); g.disc(28, 8, 20, 6, LEAF[2]); g.disc(48, 10, 14, 5, LEAF[2]);
  for (let x = 6; x < 68; x += 2) {
    const edgeFall = Math.abs(x - 36) / 30;
    const reach = 22 + ((x * 7) % 18) - Math.round(edgeFall * 8);
    for (let y = 10; y < 10 + reach + 8; y++) g.set(x + Math.round(Math.sin(y / 4 + x) * 0.8), y, y % 5 < 3 ? LEAF[2 - (x % 2)] : LEAF[1]);
  }
  g.outline(LEAF[0]);
  g.rect(28, 64, 16, 3, LEAF[1]); g.rect(24, 62, 5, 3, LEAF[2]); g.rect(42, 63, 5, 3, LEAF[2]);
  return g.rows();
}

// A sundial in the churchyard: the gnomon's shadow has been telling the wrong hour for a century.
function sundial() {
  const g = new Grid(16, 22);
  g.rect(6, 10, 4, 10, STONE[2]); g.rect(4, 18, 8, 3, STONE[1]);
  g.disc(8, 8, 7, 3, STONE[3]); g.disc(8, 7, 6, 2, STONE[4]);
  g.line(8, 7, 11, 2, IRON[2]); g.line(8, 7, 7, 3, IRON[1]); g.rect(4, 7, 8, 1, STONE[1]);
  return g.outline().rows();
}

// A milestone with the water over its lower figures.
function milestone() {
  const g = new Grid(16, 24);
  g.rect(3, 6, 10, 18, STONE[2]); g.disc(8, 6, 5, 3, STONE[2]); g.rect(3, 6, 2, 18, STONE[3]); g.rect(11, 6, 2, 18, STONE[1]);
  g.rect(5, 8, 6, 1, STONE[0]); g.rect(5, 11, 6, 1, STONE[0]); g.rect(5, 14, 4, 1, STONE[0]); g.set(6, 6, STONE[0]);
  g.rect(4, 20, 8, 4, LEAF[1]);
  g.outline();
  return g.rows();
}

// A chimney standing out of the flood, its pot cracked, soot still on the lip.
function chimney() {
  const g = new Grid(16, 28);
  g.rect(3, 6, 10, 22, '#6a4a40'); g.rect(3, 6, 2, 22, '#8a6a58'); g.rect(11, 6, 2, 22, '#4a3028');
  for (let y = 9; y < 24; y += 4) g.rect(3, y, 10, 1, '#3a2820');
  g.rect(2, 3, 12, 4, '#4a3028'); g.rect(2, 3, 12, 1, '#6a4a40'); g.rect(5, 0, 6, 4, '#8a4a30'); g.rect(6, 0, 4, 1, INK);
  g.outline();
  flood(g, 20);
  return g.rows();
}

// A cottage roof ridge poking out of the flood, a weathercock on top and a gull's marks on the slates.
function roofRidge() {
  const g = new Grid(56, 34);
  for (let y = 10; y < 34; y++) {
    const half = 4 + (y - 10) * 1.1;
    for (let x = Math.max(0, 28 - half); x < Math.min(56, 28 + half); x++) {
      const row = Math.floor((y - 10) / 4);
      g.set(x, y, (Math.floor(x / 4) + row) % 2 ? '#4a5a66' : '#566a76');
    }
    g.set(Math.max(0, Math.round(28 - half)), y, '#2e3a44'); g.set(Math.min(55, Math.round(28 + half) - 1), y, '#2e3a44');
  }
  g.rect(23, 9, 10, 2, '#6a4a3a'); g.rect(24, 8, 8, 1, '#8a6a58');
  g.rect(28, 1, 1, 8, IRON[1]); g.rect(24, 4, 9, 1, IRON[1]); g.rect(30, 2, 5, 3, IRON[2]); g.rect(34, 2, 1, 1, IRON[3]);
  for (const [x, y] of [[20, 20], [34, 22], [27, 17]]) { g.rect(x, y, 3, 1, CREAM[1]); g.set(x + 1, y + 1, CREAM[0]); }
  for (const [x, y] of [[16, 26], [40, 28], [30, 30]]) g.rect(x, y, 5, 1, LEAF[1]);
  g.outline();
  flood(g, 26);
  return g.rows();
}

// A ring of toadstools in the grass: flat.
function toadstools() {
  const g = new Grid(32, 14);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const x = 15 + Math.round(Math.cos(a) * 11);
    const y = 7 + Math.round(Math.sin(a) * 4);
    g.rect(x, y, 1, 2, CREAM[1]); g.rect(x - 1, y - 1, 3, 1, RED[1]); g.set(x, y - 1, CREAM[2]);
  }
  return g.rows();
}

// A kettle on a step, a thread of steam being the touch's job.
function kettle() {
  const g = new Grid(16, 14);
  g.rect(3, 12, 10, 2, STONE[2]); g.disc(8, 8, 4, 3.5, IRON[2]); g.rect(11, 5, 4, 2, IRON[2]); g.rect(4, 3, 1, 1, IRON[1]); g.line(4, 4, 11, 4, IRON[1]);
  g.set(6, 6, IRON[3]); g.rect(2, 7, 2, 1, IRON[2]);
  return g.outline().rows();
}

// ---------------------------------------------------------------------------------------------
// THE SOUNDINGS

// A sounder's lamp on a pit-prop post, its glass cloudy, the wick long dead.
function hookLamp() {
  const g = new Grid(16, 30);
  g.rect(7, 6, 3, 24, WOOD[1]); g.rect(8, 6, 1, 24, WOOD[2]);
  g.rect(2, 5, 11, 2, WOOD[2]); g.rect(12, 5, 1, 4, IRON[1]); g.rect(2, 5, 1, 3, IRON[1]);
  g.rect(9, 9, 6, 8, '#a8b4a860'); g.rect(9, 9, 6, 1, IRON[2]); g.rect(9, 16, 6, 2, IRON[1]); g.rect(11, 12, 2, 4, WARM[0]);
  g.rect(5, 27, 7, 3, STONE[1]);
  return g.outline().rows();
}

// One boot, on its side, with a crab's claim on it.
function boot() {
  const g = new Grid(16, 12);
  g.rect(3, 4, 5, 7, '#3a2a20'); g.rect(3, 9, 11, 3, '#3a2a20'); g.rect(3, 4, 5, 1, '#5a4636'); g.rect(8, 9, 6, 1, '#5a4636');
  g.rect(3, 11, 11, 1, INK); g.set(5, 6, '#8a7a5a'); g.set(5, 7, '#8a7a5a');
  g.rect(9, 7, 3, 2, '#d8a088'); g.set(8, 7, '#d8a088'); g.set(12, 6, '#d8a088');
  return g.outline().rows();
}

// A lunch pail, lid shut, with a name scratched on it.
function lunchPail() {
  const g = new Grid(16, 14);
  g.rect(3, 4, 10, 9, IRON[2]); g.rect(3, 4, 10, 1, IRON[3]); g.rect(3, 12, 10, 1, IRON[0]);
  g.rect(4, 2, 8, 2, IRON[1]); g.line(4, 2, 8, 0, IRON[2]); g.line(12, 2, 8, 0, IRON[2]);
  g.rect(6, 7, 1, 3, IRON[0]); g.rect(8, 7, 2, 1, IRON[0]); g.rect(8, 9, 2, 1, IRON[0]);
  return g.outline().rows();
}

// A coil of sounding line, knotted at every fathom, with a lead on the end.
function coilLine() {
  const g = new Grid(20, 14);
  g.disc(9, 8, 8, 4, '#a8946a'); g.disc(9, 8, 5, 2, '#10161a'); g.disc(9, 7, 8, 3, '#c8b488'); g.disc(9, 8, 4.5, 1.5, '#4a3e2a');
  for (const [x, y] of [[3, 7], [8, 4], [14, 6], [13, 10], [5, 10]]) g.set(x, y, WOOD[0]);
  g.rect(16, 9, 3, 4, IRON[1]); g.rect(16, 9, 3, 1, IRON[3]); g.line(15, 8, 17, 9, '#c8b488');
  return g.outline().rows();
}

// A shell midden: what something small has eaten over a great many winters.
function midden() {
  const g = new Grid(20, 10);
  g.disc(10, 7, 9, 3, '#8a8a7a');
  for (const [x, y, c] of [[4, 5, CREAM[2]], [8, 4, CREAM[1]], [12, 5, '#d8a0a8'], [15, 6, CREAM[2]], [6, 7, '#a8b0b8'], [10, 7, CREAM[1]], [14, 8, '#d8a0a8'], [3, 8, CREAM[1]], [17, 7, '#a8b0b8']]) { g.set(x, y, c); g.set(x + 1, y, c); }
  return g.outline().rows();
}

// A rock pool with a pearl in the bottom of it that catches the light.
function pearlPool() {
  const g = new Grid(32, 16);
  g.disc(16, 9, 14, 5, STONE[1]); g.disc(16, 9, 12, 4, '#102a30'); g.disc(15, 8, 10, 3, '#16424a');
  g.rect(8, 6, 8, 1, '#2c6a72'); g.rect(18, 10, 6, 1, '#2c6a72');
  g.disc(18, 9, 1.5, 1.5, '#f0f4f8'); g.set(17, 8, '#ffffff'); g.rect(9, 9, 2, 1, LEAF[1]);
  return g.outline().rows();
}

// A ledge of glowing shelf fungus, lamp-pale.
function glowShelf() {
  const g = new Grid(24, 18);
  g.rect(3, 12, 18, 6, STONE[0]); g.rect(3, 12, 18, 1, STONE[1]);
  for (const [x, y, w] of [[4, 9, 7], [10, 6, 8], [15, 10, 6], [7, 12, 6]]) { g.rect(x, y, w, 2, GLOW[1]); g.rect(x, y, w, 1, GLOW[2]); g.rect(x + 1, y + 2, w - 2, 1, GLOW[0]); }
  return g.outline().rows();
}

// A standing stone carved with rings, the kind a voice goes round: the Echo Hall's own.
function echoStone() {
  const g = new Grid(16, 28);
  g.rect(3, 6, 10, 22, STONE[1]); g.disc(8, 6, 5, 4, STONE[1]); g.rect(3, 6, 2, 22, STONE[2]); g.rect(11, 6, 2, 22, STONE[0]);
  for (const r of [2, 4, 6]) { for (let a = 0; a < 40; a++) { const t = (a / 40) * Math.PI * 2; g.set(8 + Math.cos(t) * r * 0.9, 12 + Math.sin(t) * r * 0.9, STONE[0]); } }
  g.set(8, 12, GLOW[1]); g.set(8, 20, GLOW[0]);
  return g.outline().rows();
}

// A hymn board on a post: three numbers up, in slotted tin, and one fallen out.
function hymnBoard() {
  const g = new Grid(20, 28);
  g.rect(8, 10, 3, 18, WOOD[1]); g.rect(9, 10, 1, 18, WOOD[2]);
  g.rect(1, 1, 18, 12, '#1e2a28'); g.rect(1, 1, 18, 1, WOOD[3]); g.rect(1, 12, 18, 1, WOOD[0]); g.rect(0, 1, 1, 12, WOOD[2]); g.rect(19, 1, 1, 12, WOOD[2]);
  for (const [x, n] of [[4, 4], [9, 7], [14, 2]]) { g.rect(x, 4, 3, 5, CREAM[1]); g.rect(x + 1, 5, 1, 3, '#1e2a28'); g.set(x, 4, CREAM[2]); void n; }
  g.set(7, 11, CREAM[1]); g.set(8, 11, CREAM[0]);
  return g.outline().rows();
}

// Kneelers lined up on the flagstones, flat, each one worn at the middle.
function kneelers() {
  const g = new Grid(48, 12);
  for (let i = 0; i < 4; i++) {
    const x = 1 + i * 12;
    g.rect(x, 3, 10, 6, i === 2 ? '#7a3a3a' : '#5a3a4a'); g.rect(x, 3, 10, 1, '#8a5a6a'); g.rect(x + 1, 6, 8, 1, '#3a2230'); g.set(x + 1, 8, CREAM[1]); g.set(x + 8, 8, CREAM[1]);
  }
  return g.rows();
}

// Votive boats: little carved ships on a stone shelf, left for the ones who didn't come up.
function votiveBoats() {
  const g = new Grid(32, 22);
  g.rect(1, 14, 30, 6, STONE[1]); g.rect(1, 14, 30, 1, STONE[3]); g.rect(1, 19, 30, 1, STONE[0]);
  for (const [x, c] of [[4, '#a86a3a'], [13, '#6a8aa0'], [22, '#b8a070']]) {
    g.rect(x, 11, 8, 3, c); g.rect(x, 11, 8, 1, CREAM[1]); g.rect(x + 3, 4, 1, 7, WOOD[2]); g.rect(x + 4, 4, 3, 5, CREAM[2]); g.set(x - 1, 11, c); g.set(x + 8, 11, c);
  }
  g.rect(15, 12, 1, 2, WARM[1]); g.set(15, 11, WARM[2]);
  return g.outline().rows();
}

// A poor box: iron-banded, on its post, the slot worn bright.
function poorBox() {
  const g = new Grid(16, 24);
  g.rect(6, 10, 4, 14, WOOD[1]); g.rect(7, 10, 1, 14, WOOD[2]);
  g.rect(2, 2, 12, 9, WOOD[2]); g.rect(2, 2, 12, 1, WOOD[3]); g.rect(2, 5, 12, 1, IRON[1]); g.rect(2, 9, 12, 1, IRON[1]);
  g.rect(5, 3, 6, 1, INK); g.rect(7, 7, 2, 2, IRON[3]);
  g.rect(3, 22, 4, 2, STONE[1]); g.rect(10, 22, 3, 2, STONE[1]);
  return g.outline().rows();
}

// A sounder's tripod with the lead-line over its pulley, the lead hung a hand off the floor.
function tripod() {
  const g = new Grid(24, 34);
  g.line(12, 6, 3, 33, WOOD[1]); g.line(13, 6, 21, 33, WOOD[1]); g.line(12, 6, 12, 33, WOOD[2]);
  g.line(7, 20, 18, 20, WOOD[2]);
  g.rect(10, 3, 5, 4, IRON[1]); g.disc(12, 5, 2, 2, IRON[3]);
  g.line(14, 7, 14, 26, '#c8b488'); g.rect(12, 26, 5, 6, IRON[1]); g.rect(12, 26, 5, 1, IRON[3]);
  return g.outline().rows();
}

// A whale's rib, arched over a ledge: older than the hall, a long way from home.
function whaleRib() {
  const g = new Grid(36, 44);
  for (let t = 0; t <= 1; t += 0.01) {
    const x = 4 + t * 28;
    const y = 42 - Math.sin(t * Math.PI) * 38;
    const w = 3 - Math.abs(t - 0.5) * 2;
    g.rect(x - w / 2, y, Math.max(2, w), 2, t < 0.5 ? '#c8c0a8' : '#a8a088');
  }
  g.rect(2, 38, 5, 6, '#a8a088'); g.rect(29, 38, 5, 6, '#8a8470');
  g.outline();
  return g.rows();
}

// A tea corner: a ledge with a cup, a saucer, a spoon and a folded cloth, nobody's, kept.
function ledgeCups() {
  const g = new Grid(20, 14);
  g.rect(0, 10, 20, 4, STONE[2]); g.rect(0, 10, 20, 1, STONE[3]);
  g.rect(3, 6, 5, 4, CREAM[2]); g.rect(8, 7, 2, 2, CREAM[2]); g.rect(3, 6, 5, 1, CREAM[0]); g.rect(2, 9, 7, 1, CREAM[1]);
  g.rect(12, 8, 6, 2, '#6a8aa0'); g.rect(12, 8, 6, 1, '#8aaac0'); g.line(10, 9, 11, 9, IRON[3]);
  return g.outline().rows();
}

// A diver's glove, flat, fingers up, as if it were waving.
function glove() {
  const g = new Grid(16, 14);
  g.rect(4, 8, 8, 5, '#6a5a3a'); g.rect(4, 8, 8, 1, '#8a7a52');
  for (const [x, h] of [[4, 5], [6, 7], [8, 7], [10, 5]]) g.rect(x, 8 - h, 2, h, '#6a5a3a');
  g.rect(11, 6, 3, 2, '#6a5a3a'); g.rect(3, 12, 10, 1, '#3a2e1e');
  return g.outline().rows();
}

// A pale cave fern in a crack.
function caveFern() {
  const g = new Grid(16, 18);
  for (let i = 0; i < 7; i++) {
    const a = -1.4 + i * 0.47;
    for (let r = 0; r < 12; r++) g.set(8 + Math.sin(a) * r * 0.9, 17 - Math.cos(a) * r * (0.8 + 0.1 * (r % 2)), r < 5 ? '#5a8a70' : '#8ac0a0');
  }
  g.rect(6, 16, 5, 2, STONE[0]);
  return g.rows();
}

// A dripstone column, floor to the roof of the ledge it stands in.
function dripColumn() {
  const g = new Grid(16, 36);
  for (let y = 0; y < 36; y++) {
    const half = 2 + Math.round(Math.pow(Math.abs(y - 18) / 18, 2) * 4);
    g.rect(8 - half, y, half * 2, 1, y % 5 < 2 ? '#a8a08a' : '#8a846e');
    g.set(8 - half, y, '#6e6a58');
  }
  g.rect(8, 6, 1, 24, '#c8c0a8');
  return g.outline().rows();
}

// Candle stubs on a flagstone, flat: three burnt down, one still standing in its own grease.
function candleStubs() {
  const g = new Grid(24, 10);
  g.disc(12, 6, 10, 3, '#3a3a3c');
  for (const [x, y, h] of [[6, 5, 2], [11, 6, 3], [16, 5, 1], [14, 3, 3]]) { g.rect(x, y, 2, h, CREAM[1]); g.rect(x, y, 2, 1, CREAM[2]); }
  g.disc(13, 5, 4, 1.5, '#d8d0b0');
  return g.rows();
}

// An umbrella, not Ves's, wedged in a crack: black, bent, remarkably well-kept.
function umbrella() {
  const g = new Grid(20, 28);
  g.line(10, 6, 10, 26, WOOD[1]); g.line(10, 26, 13, 27, WOOD[1]);
  for (let a = -4; a <= 4; a++) { g.line(10, 5, 10 + a * 2, 10 - Math.abs(a) * 0.1, '#2a2a38'); }
  g.rect(2, 8, 16, 2, '#2a2a38'); g.rect(4, 6, 12, 2, '#3a3a50'); g.rect(7, 4, 6, 2, '#3a3a50'); g.set(10, 3, IRON[3]);
  g.set(3, 10, '#2a2a38'); g.set(17, 10, '#2a2a38'); g.rect(4, 22, 3, 5, STONE[1]); g.rect(12, 23, 3, 4, STONE[1]);
  return g.outline().rows();
}

// A chalked arrow on the wall-foot, flat, with the sounders' one word: UP.
function chalkArrow() {
  const g = new Grid(24, 12);
  g.rect(2, 5, 14, 2, '#d8d8d0cc'); g.line(16, 2, 21, 6, '#d8d8d0cc'); g.line(16, 10, 21, 6, '#d8d8d0cc');
  g.rect(3, 9, 1, 2, '#d8d8d0aa'); g.rect(5, 9, 2, 1, '#d8d8d0aa'); g.rect(8, 9, 1, 2, '#d8d8d0aa');
  return g.rows();
}

// Glow-threads: strings of pale beads hung from the cave roof, pulsing in turn (4 frames).
function glowThreads(i) {
  const g = new Grid(32, 28);
  g.rect(0, 0, 32, 1, STONE[0]);
  for (let s = 0; s < 6; s++) {
    const x = 3 + s * 5 + (s % 2);
    const len = 10 + ((s * 7) % 14);
    for (let y = 1; y <= len; y++) {
      g.set(x, y, '#3a504aa0');
      if (y % 3 === 0) {
        const lit = (y / 3 + s + i) % 4;
        g.set(x, y, lit === 0 ? GLOW[2] : lit === 1 ? GLOW[1] : GLOW[0]);
        if (lit === 0) { g.set(x - 1, y, GLOW[1] + '80'); g.set(x + 1, y, GLOW[1] + '80'); }
      }
    }
  }
  return g.rows();
}

export const LV_PROP_SPRITES = {
  lv_letterbox: letterbox(),
  lv_bench: bench(),
  lv_barrow: barrow(),
  lv_rain_barrel: rainBarrel(),
  lv_scarecrow: scarecrow(),
  lv_skep: skep(),
  lv_birdbath: birdbath(),
  lv_sign_bakery: signBakery(),
  lv_sign_lane: signLane(),
  lv_sign_inn: signInn(),
  lv_sill: sill(),
  lv_sill_pots: sillPots(),
  lv_porch: porch(),
  lv_churn: churn(),
  lv_cat_bowl: catBowl(),
  lv_gnome: gnome(),
  lv_boards: boards(),
  lv_ivy: ivy(),
  lv_reeds: reeds(0),
  lv_apple_tree: appleTree(),
  lv_apple_tree_dry: appleTree(false),
  lv_willow: willow(),
  lv_sundial: sundial(),
  lv_milestone: milestone(),
  lv_chimney: chimney(),
  lv_roof_ridge: roofRidge(),
  lv_toadstools: toadstools(),
  lv_kettle: kettle(),
  lv_hook_lamp: hookLamp(),
  lv_boot: boot(),
  lv_lunch_pail: lunchPail(),
  lv_coil_line: coilLine(),
  lv_midden: midden(),
  lv_pearl_pool: pearlPool(),
  lv_glow_shelf: glowShelf(),
  lv_echo_stone: echoStone(),
  lv_hymn_board: hymnBoard(),
  lv_kneelers: kneelers(),
  lv_votive_boats: votiveBoats(),
  lv_poor_box: poorBox(),
  lv_tripod: tripod(),
  lv_whale_rib: whaleRib(),
  lv_ledge_cups: ledgeCups(),
  lv_glove: glove(),
  lv_cave_fern: caveFern(),
  lv_drip_column: dripColumn(),
  lv_candle_stubs: candleStubs(),
  lv_umbrella: umbrella(),
  lv_chalk_arrow: chalkArrow(),
  lv_glow_threads: glowThreads(0),
};

export const LV_PALETTE = palette;
export const LV_PALETTE_EXTRA = palette;
export const LV_REEDS_SPRITES = frames((i) => reeds(i), 4);
export const LV_GLOW_THREADS_SPRITES = frames((i) => glowThreads(i), 4);

// How many tiles wide each wider one stands.
export const LV_FOOTPRINTS = {
  lv_bench: 2,
  lv_barrow: 2,
  lv_sign_bakery: 2,
  lv_sign_inn: 2,
  lv_sill: 2,
  lv_porch: 2,
  lv_boards: 3,
  lv_apple_tree: 2,
  lv_apple_tree_dry: 2,
  lv_willow: 4,
  lv_roof_ridge: 3,
  lv_toadstools: 2,
  lv_pearl_pool: 2,
  lv_glow_shelf: 2,
  lv_kneelers: 3,
  lv_votive_boats: 2,
  lv_tripod: 2,
  lv_whale_rib: 2,
  lv_ledge_cups: 2,
  lv_coil_line: 2,
  lv_midden: 2,
  lv_candle_stubs: 2,
  lv_chalk_arrow: 2,
  lv_glow_threads: 2,
  lv_umbrella: 2,
  lv_hymn_board: 2,
};
