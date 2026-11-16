// Life-pass props for chapter 3's Lasthome, the Dead City, the Registry and the Old Baths (15 November 2026):
// the belongings, signs, plants and small clutter that make the town look lived in and the dead city look
// left. Drawn like lanesLife.js: rows of characters from a small painter, 16 pixels to a tile, standing on
// the bottom edge and centred over their footprint. Every id starts `cl_`. Nothing hangs in the air: every
// sign has its bracket, every rail its posts, every string its peg.
//
//   Lasthome: cl_flower_tub cl_log_stack cl_wash_tub cl_apple_crate cl_flour_sacks cl_hopscotch (flat)
//     cl_hoop cl_stick_horse cl_broom_bucket cl_milk_stool cl_rain_butt cl_veg_bed cl_bird_table
//     cl_bean_poles cl_spare_wheel cl_oatcake_rack cl_kennel; inside: cl_dartboard cl_hat_pegs
//     cl_chalk_easel cl_cask_rack cl_stools cl_dog cl_jar_shelf cl_basin cl_cards_board cl_herb_dry
//     cl_pot_rack cl_prayer_board cl_hassock
//   Dead City: cl_weeds cl_weeds_tall cl_moss_flat cl_cracks_flat cl_ivy_wall cl_sign_bread cl_sign_boot
//     cl_sign_scales cl_sign_key cl_sign_quill cl_street_chair cl_laid_table cl_bundle cl_hand_cart cl_trunk
//     cl_stone_cat cl_statue_ivy cl_shoes cl_banner_torn cl_bench_moss cl_posy cl_chisels cl_tally_chalk
//   Registry: cl_paper_stack cl_ink_pot cl_ink_blot (flat) cl_ledger_lectern cl_pigeonholes cl_stamp_pad
//     cl_ladder_rail cl_clerk_desk cl_loose_pages (flat) cl_scroll_basket cl_slate_easel cl_wall_clock
//   Baths: cl_towel_rack cl_sandals cl_soap_dish cl_bath_duck cl_scrub_bucket cl_mosaic (flat)
//     cl_steam_pipe cl_gauge cl_coal_scuttle cl_shovel cl_rota_board

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

  ring(cx, cy, r, c) {
    for (let a = 0; a < 24; a++) this.set(cx + Math.cos((a / 24) * 6.283) * r, cy + Math.sin((a / 24) * 6.283) * r, c);
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

const INK = '#14161a';
const WOOD = ['#2e2218', '#4e3a28', '#6e5538', '#92764e', '#b89a68'];
const STONE = ['#3a4040', '#566060', '#76827e', '#98a49c', '#b8c2b8'];
const LEAF = ['#243e26', '#35582f', '#4c7a3e', '#6ea052', '#92c068'];
const DEADLEAF = ['#3a3a26', '#56583a', '#76784c', '#969a62'];
const RED = ['#6a2a22', '#a04030', '#d06a4c'];
const CREAM = ['#b8ac90', '#d8ccb0', '#f0e6cc'];
const IRON = ['#22262c', '#3c4250', '#5c6676', '#8a94a4'];
const WARM = ['#a86a1e', '#e8a830', '#ffe080'];
const PAPER = ['#a89c80', '#d4c8a8', '#efe6cc'];
const INKB = ['#101a34', '#1c2c58', '#2e4682'];
const BRASS = ['#6a4c1a', '#a8802c', '#e0b850'];
const WATER = ['#2a4e58', '#4c8290', '#8cc4cc'];

const post = (g, x, y0, y1, w = 2) => { g.rect(x, y0, w, y1 - y0, WOOD[1]); g.rect(x, y0, 1, y1 - y0, WOOD[2]); };
const tuft = (g, x, y, h, cols) => {
  g.line(x, y, x - 1, y - h, cols[1]); g.line(x + 1, y, x + 2, y - h + 1, cols[2]); g.line(x, y, x, y - h - 1, cols[3] ?? cols[2]);
};
const barrelBody = (g, x, y, w, h, cols = WOOD) => {
  g.rect(x, y, w, h, cols[2]); g.rect(x, y, 2, h, cols[1]); g.rect(x + w - 2, y, 2, h, cols[1]); g.rect(x + (w >> 1), y, 1, h, cols[3]);
  g.rect(x, y + 2, w, 1, IRON[1]); g.rect(x, y + h - 3, w, 1, IRON[1]);
};

// ---------------------------------------------------------------------------------------------
// LASTHOME (outdoors, lived in)

function flowerTub() {
  const g = new Grid(16, 20);
  g.rect(2, 12, 12, 7, WOOD[2]); g.rect(2, 12, 12, 1, WOOD[3]); g.rect(2, 15, 12, 1, IRON[1]); g.rect(2, 18, 12, 1, WOOD[0]);
  g.rect(3, 10, 10, 3, '#3a2a1c');
  for (const [x, y, c] of [[4, 5, RED[2]], [8, 3, WARM[1]], [11, 6, '#e8a0c0'], [6, 8, WARM[2]], [10, 9, RED[1]]]) { g.line(x, y + 1, x, 11, LEAF[2]); g.rect(x - 1, y, 3, 2, c); g.set(x, y, WARM[2]); }
  g.set(3, 9, LEAF[3]); g.set(13, 8, LEAF[3]);
  return g.outline().rows();
}
function logStack() {
  const g = new Grid(32, 20);
  for (let r = 0; r < 3; r++) for (let i = 0; i < 4 - (r === 2 ? 1 : 0); i++) {
    const cx = 5 + i * 7 + (r === 2 ? 3 : 0); const cy = 16 - r * 5;
    g.disc(cx, cy, 3.4, 2.6, WOOD[2]); g.disc(cx, cy, 2, 1.4, WOOD[4]); g.set(cx, cy, WOOD[3]);
  }
  g.rect(1, 17, 28, 2, WOOD[0]); g.rect(28, 4, 3, 15, WOOD[1]); g.rect(0, 4, 3, 15, WOOD[1]);
  return g.outline().rows();
}
function washTub() {
  const g = new Grid(16, 18);
  g.rect(2, 8, 12, 9, WOOD[2]); g.rect(2, 8, 12, 1, WOOD[3]); g.rect(2, 11, 12, 1, IRON[1]); g.rect(2, 15, 12, 1, IRON[1]); g.rect(2, 16, 12, 1, WOOD[0]);
  g.rect(3, 6, 10, 3, '#cfe0e8'); g.disc(5, 6, 1.5, 1, '#fff'); g.disc(9, 5, 2, 1.2, '#fff'); g.disc(12, 6, 1, 1, '#fff');
  g.line(13, 1, 10, 8, WOOD[3]); g.rect(11, 0, 4, 2, WOOD[2]);
  return g.outline().rows();
}
function appleCrate() {
  const g = new Grid(16, 14);
  g.rect(1, 6, 14, 7, WOOD[2]); g.rect(1, 6, 14, 1, WOOD[3]); g.rect(1, 9, 14, 1, WOOD[1]); g.rect(1, 12, 14, 1, WOOD[0]); g.rect(1, 6, 1, 7, WOOD[1]); g.rect(14, 6, 1, 7, WOOD[1]);
  for (const [x, y] of [[3, 4], [6, 3], [9, 4], [12, 4], [5, 6], [10, 6]]) { g.disc(x, y, 2, 2, RED[1]); g.set(x - 1, y - 1, RED[2]); g.set(x, y - 2, LEAF[2]); }
  return g.outline().rows();
}
function flourSacks() {
  const g = new Grid(16, 18);
  g.disc(5, 12, 4, 5, CREAM[1]); g.rect(2, 8, 7, 2, CREAM[0]); g.rect(3, 7, 5, 2, CREAM[1]);
  g.disc(11, 14, 4, 4, CREAM[1]); g.rect(8, 10, 7, 2, CREAM[0]); g.rect(9, 9, 5, 2, CREAM[2]);
  g.rect(3, 12, 4, 1, RED[1]); g.rect(9, 15, 4, 1, RED[1]);
  g.rect(3, 15, 2, 1, '#fff'); g.rect(5, 17, 5, 1, CREAM[2]);
  return g.outline().rows();
}
function hopscotch() {
  const g = new Grid(16, 48);
  const c = '#e8e4d8cc';
  for (let i = 0; i < 6; i++) {
    const y = 40 - i * 7;
    if (i === 3 || i === 5) {
      for (let k = 0; k < 6; k++) { g.set(1, y + k, c); g.set(6, y + k, c); g.set(9, y + k, c); g.set(14, y + k, c); }
      for (let k = 1; k < 7; k++) { g.set(k, y, c); g.set(k + 8, y, c); }
    } else {
      for (let k = 0; k < 6; k++) { g.set(5, y + k, c); g.set(10, y + k, c); }
      for (let k = 5; k < 11; k++) g.set(k, y, c);
    }
  }
  g.set(7, 41, '#e8c050'); g.set(8, 41, '#e8c050'); g.set(7, 42, '#e8c050');
  for (const [x, y] of [[7, 43], [8, 36], [7, 29], [4, 22], [11, 22], [7, 15], [3, 8], [12, 8]]) { g.set(x, y, c); g.set(x + 1, y, c); g.set(x, y + 1, c); }
  return g.rows();
}
function hoop() {
  const g = new Grid(16, 16);
  g.ring(8, 9, 5, WOOD[3]); g.ring(8, 9, 4.2, WOOD[2]); g.line(0, 14, 6, 11, WOOD[1]); g.line(0, 15, 6, 12, WOOD[0]);
  g.rect(3, 14, 3, 1, LEAF[2]);
  return g.outline().rows();
}
function stickHorse() {
  const g = new Grid(16, 24);
  g.rect(8, 8, 2, 16, WOOD[2]); g.rect(8, 8, 1, 16, WOOD[3]);
  g.disc(7, 5, 3.5, 3, '#c8a070'); g.rect(8, 7, 3, 2, '#c8a070'); g.rect(10, 6, 3, 3, '#d8b080'); g.set(6, 4, INK); g.set(12, 8, INK);
  g.rect(4, 1, 2, 3, '#8a6840'); g.rect(6, 0, 2, 3, '#8a6840'); g.rect(2, 3, 3, 4, RED[1]); g.rect(1, 6, 2, 4, RED[1]);
  g.rect(4, 22, 7, 2, LEAF[1]);
  return g.outline().rows();
}
function broomBucket() {
  const g = new Grid(16, 22);
  g.rect(3, 12, 9, 9, IRON[2]); g.rect(3, 12, 9, 1, IRON[3]); g.rect(3, 20, 9, 1, IRON[0]); g.rect(4, 14, 1, 5, IRON[3]);
  g.rect(4, 13, 7, 2, WATER[1]);
  g.line(11, 0, 7, 12, WOOD[3]); g.line(12, 0, 8, 12, WOOD[2]);
  g.rect(9, 1, 5, 1, WARM[0]); g.line(6, 4, 4, 8, WARM[1]); g.line(7, 4, 6, 9, WARM[1]);
  return g.outline().rows();
}
function milkStool() {
  const g = new Grid(16, 12);
  g.rect(3, 5, 10, 2, WOOD[3]); g.rect(3, 5, 10, 1, WOOD[4]); g.rect(4, 7, 2, 5, WOOD[1]); g.rect(10, 7, 2, 5, WOOD[1]);
  g.disc(8, 3, 3, 2, '#9a5a6a'); g.line(7, 4, 4, 5, '#c07a8a'); g.set(9, 2, '#c07a8a');
  return g.outline().rows();
}
function rainButt() {
  const g = new Grid(16, 22);
  barrelBody(g, 3, 7, 10, 14);
  g.rect(3, 5, 10, 3, WATER[1]); g.rect(4, 5, 5, 1, WATER[2]); g.rect(7, 18, 2, 3, WOOD[0]); g.rect(7, 18, 2, 1, IRON[2]);
  g.rect(1, 0, 2, 7, IRON[1]); g.rect(1, 0, 6, 1, IRON[1]);
  g.rect(5, 20, 6, 1, WATER[1] + 'aa');
  return g.outline().rows();
}
function vegBed() {
  const g = new Grid(32, 16);
  g.rect(1, 8, 30, 7, '#4a3220'); g.rect(1, 8, 30, 1, '#6a4a30'); g.rect(1, 14, 30, 1, WOOD[0]); g.rect(0, 8, 2, 7, WOOD[2]); g.rect(30, 8, 2, 7, WOOD[2]);
  for (let i = 0; i < 5; i++) { const x = 4 + i * 6; g.disc(x, 7, 3, 3, i % 2 ? LEAF[3] : LEAF[2]); g.disc(x, 6, 1.6, 1.4, LEAF[4]); g.set(x - 1, 8, LEAF[1]); }
  g.rect(15, 2, 1, 6, WOOD[2]); g.rect(14, 2, 3, 2, CREAM[1]); g.set(15, 3, INK);
  return g.outline().rows();
}
function birdTable() {
  const g = new Grid(16, 26);
  post(g, 7, 8, 26, 2); g.rect(2, 6, 12, 2, WOOD[3]); g.rect(2, 6, 12, 1, WOOD[4]); g.rect(2, 4, 1, 3, WOOD[1]); g.rect(13, 4, 1, 3, WOOD[1]);
  g.rect(1, 0, 14, 4, WOOD[2]); g.rect(1, 3, 14, 1, WOOD[0]);
  g.rect(4, 5, 7, 1, '#d8b858'); g.set(5, 5, '#a88838'); g.set(9, 5, '#a88838');
  g.rect(5, 24, 6, 2, LEAF[1]);
  return g.outline().rows();
}
function beanPoles() {
  const g = new Grid(32, 32);
  for (const [x0, x1] of [[4, 15], [27, 16], [10, 16], [22, 15]]) { g.line(x0, 31, x1, 3, WOOD[2]); g.line(x0 + 1, 31, x1 + 1, 3, WOOD[1]); }
  g.rect(14, 1, 4, 2, WOOD[3]);
  for (let i = 0; i < 18; i++) { const y = 28 - i * 1.4; const x = 16 + Math.sin(i * 0.9) * (10 - i * 0.45); g.disc(x, y, 1.6, 1.3, LEAF[i % 3 + 1]); if (i % 4 === 0) g.rect(x + 1, y + 1, 1, 3, LEAF[4]); }
  for (const [x, y] of [[9, 20], [22, 17], [16, 10], [13, 24]]) { g.disc(x, y, 1, 2, '#e04a3a'); g.set(x, y - 1, '#f08a7a'); }
  g.rect(3, 30, 26, 2, '#3a2a1c');
  return g.outline().rows();
}
function spareWheel() {
  const g = new Grid(16, 20);
  g.ring(7, 11, 7, WOOD[2]); g.ring(7, 11, 6, WOOD[3]); g.ring(7, 11, 7.6, IRON[1]);
  for (let a = 0; a < 6; a++) g.line(7, 11, 7 + Math.cos(a * 1.047) * 6, 11 + Math.sin(a * 1.047) * 6, WOOD[1]);
  g.disc(7, 11, 1.6, 1.6, IRON[2]);
  g.rect(12, 8, 3, 12, WOOD[1]);
  return g.outline().rows();
}
function oatcakeRack() {
  const g = new Grid(16, 20);
  post(g, 2, 4, 20); post(g, 12, 4, 20);
  for (const y of [7, 12, 17]) { g.rect(2, y, 12, 1, WOOD[3]); for (let i = 0; i < 3; i++) { g.disc(4 + i * 4, y - 1, 2, 1, i % 2 ? '#d8a860' : '#c08c48'); g.set(4 + i * 4, y - 1, '#e8c888'); } }
  g.rect(1, 3, 14, 1, WOOD[2]);
  return g.outline().rows();
}
function kennel() {
  const g = new Grid(16, 20);
  g.rect(2, 8, 12, 11, WOOD[2]); g.rect(2, 8, 12, 1, WOOD[3]); g.rect(2, 12, 12, 1, WOOD[1]);
  g.line(1, 8, 8, 1, RED[1]); g.line(15, 8, 8, 1, RED[1]); g.line(2, 8, 8, 2, RED[2]); g.rect(1, 8, 14, 1, RED[0]);
  g.disc(8, 15, 3, 4, '#1c1410'); g.rect(5, 15, 6, 5, '#1c1410');
  g.rect(5, 16, 1, 1, '#f0e0a0'); g.rect(10, 16, 1, 1, '#f0e0a0');
  g.rect(5, 18, 6, 1, CREAM[1]); g.rect(1, 19, 14, 1, WOOD[0]);
  return g.outline().rows();
}

function doormat() {
  const g = new Grid(32, 16);
  g.rect(2, 4, 28, 10, '#6a5436'); g.rect(2, 4, 28, 1, '#8a6e48'); g.rect(2, 13, 28, 1, '#3e2e1c'); g.rect(1, 6, 1, 6, '#8a6e48'); g.rect(30, 6, 1, 6, '#8a6e48');
  for (let x = 4; x < 28; x += 2) { g.set(x, 5, '#8a6e48'); g.set(x + 1, 12, '#3e2e1c'); }
  const l = '#e8dcc0';
  for (const x of [5, 8, 11, 14, 17, 20, 23]) { g.rect(x, 7, 1, 4, l); }
  g.rect(5, 7, 2, 1, l); g.rect(8, 7, 2, 1, l); g.rect(11, 8, 2, 1, l); g.rect(14, 7, 2, 1, l); g.rect(17, 9, 2, 1, l); g.rect(20, 7, 2, 1, l);
  g.rect(10, 5, 2, 1, '#2a1e12'); g.rect(22, 11, 3, 1, '#2a1e12'); g.rect(13, 12, 2, 1, '#2a1e12');
  g.disc(24, 9, 2, 1.4, '#3e2e1c88');
  return g.rows();
}

// ---- Inn, healer, chapel ----

function dartboard() {
  const g = new Grid(16, 16);
  g.disc(8, 8, 6, 6, INK); g.disc(8, 8, 5, 5, CREAM[1]); g.disc(8, 8, 3.4, 3.4, RED[1]); g.disc(8, 8, 2, 2, CREAM[1]); g.disc(8, 8, 1, 1, RED[2]);
  g.line(10, 5, 13, 1, WOOD[3]); g.rect(12, 0, 3, 2, RED[2]); g.line(6, 9, 3, 13, WOOD[3]); g.rect(2, 13, 3, 2, '#5a8aa8');
  return g.rows();
}
function hatPegs() {
  const g = new Grid(16, 18);
  g.rect(0, 2, 16, 3, WOOD[2]); g.rect(0, 2, 16, 1, WOOD[3]); g.rect(0, 4, 16, 1, WOOD[0]);
  for (const x of [3, 8, 13]) g.rect(x, 5, 2, 2, WOOD[1]);
  g.rect(1, 6, 5, 3, '#5a4a6a'); g.rect(2, 9, 3, 1, '#3a2e48'); g.disc(3, 9, 3, 1, '#5a4a6a');
  g.rect(7, 7, 3, 7, '#8a5a3a'); g.rect(6, 7, 5, 1, '#8a5a3a'); g.rect(7, 14, 3, 1, '#6a3a22');
  g.rect(12, 7, 3, 4, '#c8c0a0'); g.rect(11, 6, 5, 2, '#a89c80'); g.rect(13, 10, 1, 5, '#a89c80');
  return g.outline().rows();
}
function chalkEasel() {
  const g = new Grid(16, 24);
  g.line(3, 23, 6, 3, WOOD[2]); g.line(12, 23, 9, 3, WOOD[2]); g.line(8, 23, 8, 16, WOOD[1]);
  g.rect(2, 3, 12, 14, '#2a3a34'); g.rect(2, 3, 12, 1, WOOD[3]); g.rect(2, 16, 12, 1, WOOD[3]); g.rect(2, 3, 1, 14, WOOD[2]); g.rect(13, 3, 1, 14, WOOD[2]);
  g.rect(4, 6, 8, 1, '#e8e4d8'); g.rect(5, 9, 6, 1, '#e8e4d8'); g.rect(4, 12, 4, 1, '#e8e4d8'); g.rect(9, 12, 3, 1, '#e8c860'); g.set(6, 14, '#e8e4d8'); g.set(10, 14, '#e8e4d8');
  return g.outline().rows();
}
function caskRack() {
  const g = new Grid(32, 22);
  post(g, 1, 6, 22, 2); post(g, 29, 6, 22, 2); g.rect(0, 5, 32, 2, WOOD[3]); g.rect(0, 14, 32, 2, WOOD[2]);
  for (const x of [4, 12, 20]) { g.disc(x + 3, 10, 4.5, 4.5, WOOD[2]); g.disc(x + 3, 10, 3.5, 3.5, WOOD[3]); g.rect(x - 1, 9, 9, 1, IRON[1]); g.set(x + 3, 10, IRON[2]); g.rect(x + 2, 10, 2, 2, WOOD[0]); }
  g.rect(26, 17, 3, 5, WOOD[2]); g.rect(25, 16, 5, 2, IRON[2]); g.rect(3, 19, 4, 3, WARM[0]);
  return g.outline().rows();
}
function stools() {
  const g = new Grid(32, 14);
  for (const x of [3, 15, 24]) { g.rect(x, 4, 7, 2, WOOD[3]); g.rect(x, 4, 7, 1, WOOD[4]); g.rect(x + 1, 6, 1, 7, WOOD[1]); g.rect(x + 5, 6, 1, 7, WOOD[1]); g.rect(x + 1, 10, 5, 1, WOOD[1]); }
  g.rect(5, 2, 3, 2, '#8a3a3a');
  return g.outline().rows();
}
function dog() {
  const g = new Grid(16, 10);
  g.disc(8, 6, 6, 3, '#a87a4a'); g.disc(12, 5, 3, 2.6, '#c8905a'); g.rect(14, 5, 2, 2, '#6a4a2a'); g.rect(10, 2, 2, 3, '#7a5430'); g.set(13, 5, INK);
  g.line(2, 5, 0, 3, '#a87a4a'); g.rect(4, 8, 8, 1, '#8a6038'); g.rect(6, 4, 4, 2, '#c8905a');
  return g.outline().rows();
}
function jarShelf() {
  const g = new Grid(32, 16);
  g.rect(0, 11, 32, 3, WOOD[2]); g.rect(0, 11, 32, 1, WOOD[3]); g.rect(0, 13, 32, 1, WOOD[0]); g.rect(1, 13, 2, 3, WOOD[1]); g.rect(29, 13, 2, 3, WOOD[1]);
  const cs = ['#7aa84a', '#c8a030', '#a84a68', '#4a86a8', '#c87838', '#8a6ac0', '#c8c0a0'];
  for (let i = 0; i < 7; i++) { const x = 2 + i * 4; const h = 4 + (i * 3) % 4; g.rect(x, 11 - h, 3, h, cs[i]); g.rect(x, 11 - h, 3, 1, CREAM[1]); g.set(x, 11 - h + 1, '#ffffff88'); }
  return g.outline().rows();
}
function basin() {
  const g = new Grid(16, 16);
  g.rect(6, 10, 4, 5, STONE[2]); g.rect(4, 14, 8, 2, STONE[1]); g.disc(8, 8, 7, 3, STONE[3]); g.disc(8, 7.5, 5.5, 2, WATER[1]); g.rect(5, 7, 5, 1, WATER[2]);
  g.rect(10, 3, 5, 4, CREAM[2]); g.line(10, 4, 12, 6, CREAM[0]); g.rect(0, 5, 3, 2, '#d8a8a0');
  return g.outline().rows();
}
function cardsBoard() {
  const g = new Grid(16, 22);
  post(g, 2, 14, 22, 2); post(g, 12, 14, 22, 2);
  g.rect(0, 1, 16, 16, WOOD[2]); g.rect(1, 2, 14, 14, '#8a6a46'); g.rect(0, 1, 16, 1, WOOD[3]);
  const cc = [['#f0e6cc', 2, 3], ['#e8a0c0', 7, 4], ['#a8d0e8', 11, 3], ['#f0d870', 3, 9], ['#f0e6cc', 8, 10], ['#c8e0a0', 11, 9]];
  for (const [c, x, y] of cc) { g.rect(x, y, 4, 5, c); g.set(x + 1, y + 1, RED[1]); g.rect(x + 1, y + 3, 2, 1, INK + '66'); g.set(x + 1, y, IRON[2]); }
  return g.outline().rows();
}
function herbDry() {
  const g = new Grid(32, 28);
  post(g, 1, 2, 28, 2); post(g, 29, 2, 28, 2); g.rect(0, 2, 32, 2, WOOD[3]); g.rect(0, 2, 32, 1, WOOD[4]);
  for (let i = 0; i < 6; i++) { const x = 4 + i * 4.4; g.line(x, 4, x, 7, '#a89c80'); const c = [LEAF[2], '#8a8a4a', '#a8689a', LEAF[3], '#c8a848', LEAF[1]][i]; g.disc(x, 11, 2, 4, c); g.disc(x, 13, 1.4, 3, c); g.set(x, 16, c); }
  g.rect(5, 24, 8, 3, STONE[1]);
  return g.outline().rows();
}
function potRack() {
  const g = new Grid(32, 28);
  post(g, 1, 1, 28, 2); post(g, 29, 1, 28, 2); g.rect(0, 1, 32, 2, WOOD[3]); g.rect(0, 1, 32, 1, WOOD[4]);
  const cs = [IRON[2], BRASS[1], IRON[1], BRASS[2], IRON[3], BRASS[0], IRON[2]];
  for (let i = 0; i < 7; i++) { const x = 3 + i * 4; const len = 3 + (i * 5) % 6; g.rect(x + 1, 3, 1, len, '#4a3a2a'); g.rect(x - 1, 3 + len, 5, 4 + (i % 3), cs[i]); g.rect(x - 1, 3 + len, 5, 1, IRON[3]); g.set(x, 4 + len, '#ffffff66'); g.rect(x - 2, 4 + len, 1, 2, cs[i]); }
  g.rect(4, 25, 7, 3, STONE[1]);
  return g.outline().rows();
}
function prayerBoard() {
  const g = new Grid(16, 24);
  post(g, 7, 12, 24, 2);
  g.rect(1, 1, 14, 13, WOOD[2]); g.rect(1, 1, 14, 1, WOOD[3]);
  for (const [x, y, c] of [[2, 3, PAPER[2]], [6, 2, '#e8a0c0'], [10, 3, '#a8d0e8'], [3, 8, '#f0d870'], [8, 7, PAPER[2]], [11, 8, '#c8e0a0'], [6, 10, PAPER[1]]]) { g.rect(x, y, 3, 4, c); g.set(x + 1, y + 1, INK + '88'); g.set(x + 1, y + 2, INK + '88'); g.set(x + 1, y - 1, IRON[2]); }
  g.rect(3, 22, 10, 2, LEAF[1]);
  return g.outline().rows();
}
function hassock() {
  const g = new Grid(16, 10);
  g.disc(8, 6, 6, 3, '#7a3a4a'); g.rect(2, 5, 12, 3, '#7a3a4a'); g.rect(2, 5, 12, 1, '#a85a6a'); g.rect(2, 8, 12, 1, '#4a2230'); g.rect(1, 6, 1, 3, BRASS[1]); g.rect(14, 6, 1, 3, BRASS[1]);
  g.disc(6, 5, 1.6, 0.8, '#a85a6a');
  return g.outline().rows();
}

// ---------------------------------------------------------------------------------------------
// THE DEAD CITY (left, overgrown, nobody's)

function weeds() {
  const g = new Grid(16, 14);
  g.rect(2, 12, 12, 2, '#3a3a2a');
  tuft(g, 4, 12, 6, DEADLEAF); tuft(g, 8, 12, 9, DEADLEAF); tuft(g, 12, 12, 5, DEADLEAF); tuft(g, 6, 12, 4, LEAF);
  g.rect(8, 2, 2, 2, '#c8b848'); g.set(9, 1, '#e8d878'); g.set(4, 6, '#d8d0b8');
  return g.outline().rows();
}
function weedsTall() {
  const g = new Grid(16, 22);
  g.rect(3, 20, 10, 2, '#3a3a2a');
  tuft(g, 4, 20, 14, LEAF); tuft(g, 8, 20, 18, LEAF); tuft(g, 12, 20, 12, DEADLEAF); tuft(g, 6, 20, 8, DEADLEAF);
  g.disc(9, 3, 2, 2, '#e8e0f0'); g.disc(5, 8, 1.6, 1.6, '#d8c8e8'); g.set(9, 3, '#a898c8');
  return g.outline().rows();
}
function mossFlat() {
  const g = new Grid(32, 16);
  g.disc(16, 9, 9, 4, LEAF[1] + '66');
  for (let i = 0; i < 70; i++) { const x = 3 + ((i * 53) % 26); const y = 4 + ((i * 29) % 9); g.set(x, y, i % 3 ? LEAF[1] + 'aa' : LEAF[2] + 'aa'); if (i % 5 === 0) g.set(x + 1, y, LEAF[3] + 'aa'); }
  return g.rows();
}
function cracksFlat() {
  const g = new Grid(32, 16);
  const c = '#0c0e10aa';
  g.line(2, 12, 9, 8, c); g.line(9, 8, 14, 9, c); g.line(14, 9, 19, 4, c); g.line(9, 8, 11, 3, c); g.line(19, 4, 28, 5, c); g.line(14, 9, 17, 14, c);
  for (const [x, y] of [[5, 10], [12, 8], [17, 6], [24, 5], [15, 11]]) { g.set(x, y - 1, LEAF[2]); g.set(x + 1, y - 1, LEAF[3]); }
  return g.rows();
}
function ivyWall() {
  const g = new Grid(16, 28);
  g.line(8, 28, 6, 12, LEAF[0]); g.line(9, 28, 11, 8, LEAF[0]); g.line(6, 12, 3, 3, LEAF[0]); g.line(11, 8, 13, 1, LEAF[0]);
  for (let i = 0; i < 26; i++) { const t = i / 26; const x = 8 + Math.sin(i * 2.3) * (3 + t * 3); const y = 27 - t * 26; g.disc(x, y, 2.2, 1.8, LEAF[1 + (i % 3)]); g.set(x - 1, y - 1, LEAF[4]); }
  return g.outline().rows();
}
function signFrame(draw) {
  const g = new Grid(16, 30);
  g.rect(0, 2, 8, 2, IRON[1]); g.rect(0, 2, 2, 3, IRON[2]); g.rect(6, 4, 1, 3, IRON[1]); g.rect(12, 4, 1, 3, IRON[1]); g.rect(6, 3, 8, 1, IRON[1]);
  g.rect(3, 7, 12, 14, WOOD[1]); g.rect(3, 7, 12, 1, WOOD[2]); g.rect(3, 20, 12, 1, WOOD[0]); g.rect(4, 8, 10, 12, '#6a5a44');
  draw(g);
  for (let i = 0; i < 12; i++) g.set(4 + ((i * 7) % 10), 8 + ((i * 5) % 12), '#3a2e22');
  return g.outline().rows();
}
const signBread = () => signFrame((g) => { g.disc(9, 14, 4, 3, '#c89048'); g.rect(6, 13, 6, 1, '#8a5a24'); g.rect(8, 12, 1, 3, '#8a5a24'); g.rect(10, 12, 1, 3, '#8a5a24'); });
const signBoot = () => signFrame((g) => { g.rect(7, 10, 4, 6, '#7a4a2a'); g.rect(7, 15, 7, 3, '#7a4a2a'); g.rect(7, 18, 7, 1, INK); g.rect(7, 10, 4, 1, '#a8703a'); });
const signScales = () => signFrame((g) => { g.rect(9, 10, 1, 7, BRASS[1]); g.rect(5, 10, 9, 1, BRASS[1]); g.rect(5, 11, 1, 3, BRASS[1]); g.rect(13, 11, 1, 3, BRASS[1]); g.rect(4, 14, 3, 1, BRASS[2]); g.rect(12, 14, 3, 1, BRASS[2]); g.rect(7, 17, 5, 1, BRASS[0]); });
const signKey = () => signFrame((g) => { g.ring(8, 12, 2, BRASS[2]); g.rect(9, 12, 1, 7, BRASS[1]); g.rect(9, 17, 3, 1, BRASS[1]); g.rect(9, 15, 2, 1, BRASS[1]); g.set(8, 12, BRASS[0]); });
const signQuill = () => signFrame((g) => { g.line(12, 9, 6, 18, PAPER[2]); g.line(13, 9, 7, 18, PAPER[1]); g.line(6, 18, 5, 19, INK); g.rect(8, 17, 5, 2, INKB[1]); });
function streetChair() {
  const g = new Grid(16, 20);
  g.rect(3, 2, 2, 10, WOOD[2]); g.rect(11, 2, 2, 10, WOOD[2]); g.rect(3, 3, 10, 2, WOOD[3]); g.rect(3, 7, 10, 1, WOOD[2]);
  g.rect(2, 11, 12, 3, WOOD[3]); g.rect(2, 11, 12, 1, WOOD[4]); g.rect(3, 14, 2, 6, WOOD[1]); g.rect(11, 14, 2, 6, WOOD[1]); g.rect(5, 17, 6, 1, WOOD[1]);
  return g.outline().rows();
}
function laidTable() {
  const g = new Grid(32, 22);
  g.rect(1, 9, 30, 4, CREAM[1]); g.rect(1, 9, 30, 1, CREAM[2]); g.rect(1, 12, 30, 1, CREAM[0]); g.rect(2, 13, 2, 8, WOOD[1]); g.rect(28, 13, 2, 8, WOOD[1]);
  for (const x of [5, 13, 21, 27]) { g.rect(x, 5, 4, 4, '#a8c0d8'); g.rect(x, 5, 4, 1, '#d0e0f0'); g.rect(x + 4, 6, 1, 2, '#a8c0d8'); }
  g.rect(14, 3, 1, 6, WARM[1]); g.rect(14, 2, 1, 1, '#fff');
  g.rect(17, 6, 6, 3, '#d8b070'); g.rect(17, 6, 6, 1, '#e8d090');
  return g.outline().rows();
}
function bundle() {
  const g = new Grid(16, 14);
  g.disc(8, 8, 6, 5, '#7a6a4a'); g.disc(8, 7, 4.5, 3, '#9a8a62'); g.line(2, 8, 14, 8, '#5a4a30'); g.line(8, 3, 8, 13, '#5a4a30');
  g.rect(13, 3, 1, 9, WOOD[3]); g.rect(12, 2, 3, 2, WOOD[3]);
  g.rect(10, 9, 3, 3, RED[1]);
  return g.outline().rows();
}
function handCart() {
  const g = new Grid(32, 22);
  g.rect(4, 8, 20, 7, WOOD[2]); g.rect(4, 8, 20, 1, WOOD[3]); g.rect(4, 14, 20, 1, WOOD[0]); g.line(3, 8, 3, 15, WOOD[1]);
  g.line(24, 10, 31, 13, WOOD[1]); g.line(24, 11, 31, 14, WOOD[0]);
  g.disc(11, 17, 4.4, 4.4, IRON[1]); g.disc(11, 17, 3.4, 3.4, WOOD[2]); g.disc(11, 17, 1, 1, IRON[2]); g.line(8, 15, 14, 20, WOOD[1]);
  g.line(20, 15, 23, 21, WOOD[1]); g.rect(19, 20, 5, 2, WOOD[0]);
  g.rect(8, 5, 6, 3, '#a89c80'); g.rect(15, 6, 4, 2, RED[1]);
  return g.outline().rows();
}
function trunk() {
  const g = new Grid(32, 14);
  g.rect(3, 4, 18, 9, WOOD[2]); g.rect(3, 4, 18, 2, WOOD[3]); g.rect(3, 8, 18, 1, IRON[1]); g.rect(3, 12, 18, 1, WOOD[0]); g.rect(11, 8, 2, 3, BRASS[1]);
  g.line(21, 4, 26, 1, WOOD[3]); g.line(21, 5, 26, 2, WOOD[2]);
  g.rect(18, 8, 12, 4, '#b8a888'); g.rect(24, 5, 6, 3, '#8a4a5a'); g.rect(22, 11, 8, 2, '#5a6a8a'); g.disc(28, 11, 2, 1, '#e8d8b0');
  return g.outline().rows();
}
function stoneCat() {
  const g = new Grid(16, 24);
  g.rect(2, 16, 12, 8, STONE[1]); g.rect(2, 16, 12, 1, STONE[3]); g.rect(1, 22, 14, 2, STONE[0]);
  g.disc(8, 11, 4, 5, STONE[2]); g.disc(8, 5, 3.4, 3, STONE[3]); g.rect(5, 1, 2, 3, STONE[3]); g.rect(10, 1, 2, 3, STONE[3]);
  g.set(7, 5, INK); g.set(10, 5, INK); g.rect(12, 9, 2, 7, STONE[2]); g.rect(13, 14, 2, 3, STONE[2]);
  g.rect(3, 17, 4, 1, LEAF[2]); g.set(4, 16, LEAF[3]);
  return g.outline().rows();
}
function statueIvy() {
  const g = new Grid(16, 34);
  g.rect(2, 26, 12, 8, STONE[1]); g.rect(2, 26, 12, 1, STONE[3]); g.rect(1, 32, 14, 2, STONE[0]);
  g.rect(5, 11, 6, 15, STONE[2]); g.rect(4, 12, 8, 3, STONE[3]); g.rect(3, 13, 2, 9, STONE[2]); g.rect(11, 13, 2, 9, STONE[2]);
  g.disc(8, 7, 3.2, 4, STONE[3]); g.rect(6, 5, 4, 3, STONE[2]);
  for (let i = 0; i < 22; i++) { const t = i / 22; const x = 5 + (i * 7) % 7; const y = 29 - t * 24; g.disc(x, y, 1.8, 1.6, LEAF[1 + (i % 3)]); }
  g.rect(3, 27, 4, 2, LEAF[2]); g.rect(9, 29, 4, 2, LEAF[1]);
  return g.outline().rows();
}
function shoes() {
  const g = new Grid(16, 8);
  g.rect(2, 4, 5, 3, '#7a4a3a'); g.rect(2, 3, 2, 2, '#7a4a3a'); g.rect(2, 6, 5, 1, INK); g.set(3, 3, CREAM[1]);
  g.rect(9, 3, 5, 3, '#7a4a3a'); g.rect(12, 2, 2, 2, '#7a4a3a'); g.rect(9, 5, 5, 1, INK); g.set(12, 2, CREAM[1]);
  return g.outline().rows();
}
function bannerTorn() {
  const g = new Grid(16, 36);
  g.rect(7, 2, 2, 34, WOOD[1]); g.rect(7, 2, 1, 34, WOOD[2]); g.rect(3, 2, 10, 2, WOOD[3]); g.disc(8, 1, 2, 1.4, BRASS[1]);
  g.rect(4, 4, 8, 4, RED[1]); g.rect(4, 8, 7, 4, RED[1]); g.rect(5, 12, 5, 3, RED[1]); g.rect(5, 15, 2, 3, RED[1]); g.rect(9, 12, 1, 2, RED[0]);
  g.rect(6, 6, 4, 1, WARM[1]); g.rect(7, 9, 2, 1, WARM[1]); g.rect(4, 4, 8, 1, RED[2]);
  g.rect(4, 34, 9, 2, STONE[1]);
  return g.outline().rows();
}
function benchMoss() {
  const g = new Grid(32, 16);
  g.rect(2, 7, 28, 3, STONE[2]); g.rect(2, 7, 28, 1, STONE[3]); g.rect(2, 9, 28, 1, STONE[0]); g.rect(4, 10, 4, 5, STONE[1]); g.rect(24, 10, 4, 5, STONE[1]);
  g.rect(3, 4, 26, 2, STONE[2]); g.rect(3, 4, 26, 1, STONE[3]); g.rect(4, 6, 2, 1, STONE[1]); g.rect(26, 6, 2, 1, STONE[1]);
  for (const [x, y] of [[8, 7], [9, 7], [10, 6], [20, 7], [21, 7], [6, 14], [25, 14]]) g.disc(x, y, 2, 1.2, LEAF[2]);
  g.rect(14, 4, 3, 2, DEADLEAF[2]);
  return g.outline().rows();
}
function posy() {
  const g = new Grid(16, 12);
  g.rect(5, 8, 6, 3, '#6a6a76'); g.rect(5, 8, 6, 1, '#9a9aa8'); g.rect(6, 10, 4, 1, '#4a4a56');
  for (const [x, y, c] of [[6, 3, '#e8a0c0'], [8, 2, '#f0d870'], [10, 4, '#f0e8f8'], [7, 5, '#c0a0e0']]) { g.line(x, y + 1, 8, 8, LEAF[2]); g.rect(x - 1, y, 3, 2, c); }
  return g.outline().rows();
}
function chisels() {
  const g = new Grid(16, 8);
  g.line(2, 5, 9, 3, IRON[3]); g.rect(9, 2, 4, 2, WOOD[3]); g.line(3, 7, 10, 6, IRON[2]); g.rect(10, 5, 4, 2, WOOD[2]);
  g.rect(1, 2, 2, 1, '#b8b8b0'); g.set(14, 1, '#b8b8b0'); g.rect(5, 0, 2, 1, '#b8b8b0');
  return g.outline().rows();
}
function tallyChalk() {
  const g = new Grid(16, 16);
  const c = '#e8e4d8cc';
  for (let r = 0; r < 3; r++) { for (let i = 0; i < 4; i++) g.line(3 + i * 2, 3 + r * 4, 3 + i * 2, 6 + r * 4, c); g.line(2, 6 + r * 4, 10, 3 + r * 4, c); }
  g.line(12, 3, 12, 6, c); g.line(14, 3, 14, 6, c);
  return g.rows();
}

// ---------------------------------------------------------------------------------------------
// THE REGISTRY (paper, ink, dust)

function paperStack() {
  const g = new Grid(16, 16);
  g.rect(2, 9, 12, 5, PAPER[1]); g.rect(2, 9, 12, 1, PAPER[2]); g.rect(2, 11, 12, 1, PAPER[0]); g.rect(3, 6, 10, 4, PAPER[2]); g.rect(4, 4, 8, 3, PAPER[1]); g.rect(5, 2, 6, 2, PAPER[2]);
  g.rect(12, 7, 3, 2, PAPER[1]); g.line(2, 13, 0, 15, PAPER[1]); g.rect(6, 7, 4, 1, INK + '88'); g.rect(5, 12, 7, 1, INK + '66');
  return g.outline().rows();
}
function inkPot() {
  const g = new Grid(16, 12);
  g.disc(7, 8, 4.5, 3.6, INKB[0]); g.rect(4, 5, 7, 3, INKB[1]); g.rect(5, 3, 5, 3, STONE[2]); g.rect(6, 4, 3, 1, INKB[2]);
  g.line(10, 4, 14, 0, PAPER[2]); g.line(11, 4, 15, 0, PAPER[1]); g.set(9, 4, INK);
  g.rect(12, 9, 3, 1, INKB[1]);
  return g.outline().rows();
}
function inkBlot() {
  const g = new Grid(32, 16);
  g.disc(14, 9, 7, 3.4, INKB[1] + 'cc'); g.disc(18, 8, 4, 2.4, INKB[0] + 'dd'); g.disc(24, 11, 2, 1.2, INKB[1] + 'cc'); g.disc(6, 11, 1.4, 1, INKB[1] + 'aa');
  for (let i = 0; i < 6; i++) g.set(5 + i * 4, 4 + (i * 3) % 6, INKB[2] + '99');
  g.rect(18, 7, 2, 1, INKB[2] + 'aa');
  return g.rows();
}
function ledgerLectern() {
  const g = new Grid(16, 26);
  g.rect(6, 14, 4, 12, WOOD[2]); g.rect(4, 24, 8, 2, WOOD[1]); g.line(1, 14, 8, 9, WOOD[3]); g.line(15, 14, 8, 9, WOOD[3]); g.rect(1, 10, 14, 4, WOOD[2]);
  g.rect(2, 4, 12, 8, '#4a2a2a'); g.rect(3, 3, 5, 8, PAPER[2]); g.rect(8, 3, 5, 8, PAPER[1]); g.rect(8, 3, 1, 8, PAPER[0]);
  for (const y of [5, 7, 9]) { g.rect(4, y, 3, 1, INK + '77'); g.rect(9, y, 3, 1, INK + '77'); }
  g.rect(12, 3, 1, 9, RED[1]); g.set(12, 12, RED[2]);
  return g.outline().rows();
}
function pigeonholes() {
  const g = new Grid(32, 34);
  g.rect(1, 2, 30, 31, WOOD[1]); g.rect(1, 2, 30, 1, WOOD[3]);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
    const x = 3 + c * 4.7; const y = 4 + r * 7.2;
    g.rect(x, y, 4, 6, '#1a120c'); g.rect(x, y + 5, 4, 1, WOOD[0]);
    if ((r * 3 + c * 2) % 5 !== 0) { g.rect(x + 1, y + 2, 2, 4, PAPER[(r + c) % 3]); g.set(x + 2, y + 2, RED[1]); }
    if ((r + c) % 4 === 1) g.rect(x + 1, y + 1, 2, 5, PAPER[1]);
  }
  g.rect(0, 33, 32, 1, WOOD[0]);
  return g.outline().rows();
}
function stampPad() {
  const g = new Grid(16, 10);
  g.rect(2, 6, 10, 3, STONE[1]); g.rect(3, 5, 8, 2, RED[1]); g.rect(3, 5, 8, 1, RED[2]);
  g.rect(8, 0, 4, 2, WOOD[3]); g.rect(9, 2, 2, 3, WOOD[2]); g.rect(7, 4, 6, 2, RED[0]);
  g.rect(12, 7, 3, 2, PAPER[2]); g.rect(12, 7, 3, 1, RED[1]);
  return g.outline().rows();
}
function ladderRail() {
  const g = new Grid(16, 38);
  g.rect(1, 1, 14, 2, IRON[2]); g.rect(1, 1, 14, 1, IRON[3]); g.rect(1, 3, 2, 2, IRON[1]); g.rect(13, 3, 2, 2, IRON[1]);
  g.rect(4, 3, 2, 34, WOOD[2]); g.rect(10, 3, 2, 34, WOOD[2]); g.rect(4, 3, 1, 34, WOOD[3]);
  for (let y = 8; y < 36; y += 6) g.rect(6, y, 4, 2, WOOD[3]);
  g.rect(3, 36, 10, 2, WOOD[0]); g.rect(1, 33, 3, 4, IRON[1]); g.disc(3, 36, 2, 1.4, IRON[2]);
  return g.outline().rows();
}
function clerkDesk() {
  const g = new Grid(32, 24);
  g.rect(1, 10, 30, 3, WOOD[3]); g.rect(1, 10, 30, 1, WOOD[4]); g.rect(1, 12, 30, 1, WOOD[0]);
  g.rect(2, 13, 4, 10, WOOD[2]); g.rect(26, 13, 4, 10, WOOD[2]); g.rect(7, 13, 18, 4, WOOD[1]); g.rect(14, 14, 4, 2, BRASS[1]);
  g.rect(4, 7, 8, 3, PAPER[2]); g.rect(5, 6, 6, 1, PAPER[1]);
  g.rect(16, 4, 1, 6, BRASS[1]); g.rect(14, 3, 5, 2, '#3a7a5a'); g.rect(14, 3, 5, 1, '#5aa87a');
  g.rect(22, 7, 5, 3, INKB[1]); g.rect(23, 8, 1, 1, INKB[2]);
  return g.outline().rows();
}
function loosePages() {
  const g = new Grid(32, 16);
  const pg = (x, y, rot) => { g.rect(x, y, 6, 4, PAPER[2]); g.rect(x, y + 3, 6, 1, PAPER[0]); g.rect(x + 1, y + 1, 4, 1, INK + '66'); if (rot) g.set(x + 6, y, PAPER[1]); };
  pg(3, 9, 0); pg(10, 11, 1); pg(15, 6, 0); pg(22, 10, 1); pg(26, 5, 0); pg(8, 4, 1); pg(19, 12, 0);
  return g.rows();
}
function scrollBasket() {
  const g = new Grid(16, 16);
  g.rect(3, 9, 10, 6, '#8a6a3a'); g.rect(3, 9, 10, 1, '#b8924e'); for (let y = 10; y < 15; y += 2) g.rect(3, y, 10, 1, '#6a4a24'); g.rect(3, 14, 10, 1, '#4a3418');
  for (const [x, c] of [[4, PAPER[2]], [7, PAPER[1]], [10, PAPER[2]]]) { g.rect(x, 2, 3, 8, c); g.rect(x, 2, 3, 1, PAPER[0]); g.set(x + 1, 3, RED[1]); g.rect(x, 7, 3, 1, '#a04030'); }
  return g.outline().rows();
}
function slateEasel() {
  const g = new Grid(16, 26);
  g.line(3, 25, 6, 5, WOOD[2]); g.line(12, 25, 9, 5, WOOD[2]); g.rect(7, 20, 2, 5, WOOD[1]);
  g.rect(2, 5, 12, 12, '#2a2e34'); g.rect(2, 5, 12, 1, WOOD[3]); g.rect(2, 16, 12, 1, WOOD[3]); g.rect(2, 5, 1, 12, WOOD[2]); g.rect(13, 5, 1, 12, WOOD[2]);
  for (const y of [7, 9, 11, 13]) { g.rect(4, y, 4, 1, '#e8e4d8'); g.rect(9, y, 3, 1, '#e8e4d8'); }
  g.rect(9, 14, 3, 1, '#a8d0e8'); g.set(8, 14, '#a8d0e8');
  return g.outline().rows();
}
function wallClock() {
  const g = new Grid(16, 18);
  g.disc(8, 9, 7, 7, WOOD[2]); g.disc(8, 9, 5.5, 5.5, CREAM[2]); g.ring(8, 9, 5.5, IRON[1]);
  for (let a = 0; a < 12; a++) g.set(8 + Math.cos(a * 0.5236) * 4.4, 9 + Math.sin(a * 0.5236) * 4.4, INK);
  g.line(8, 9, 8, 5, INK); g.line(8, 9, 11, 10, INK); g.set(8, 9, RED[1]);
  g.line(5, 6, 11, 12, '#5a5a6a88');
  g.rect(7, 16, 2, 2, BRASS[1]);
  return g.outline().rows();
}

// ---------------------------------------------------------------------------------------------
// THE OLD BATHS

function towelRack() {
  const g = new Grid(32, 26);
  post(g, 2, 3, 26); post(g, 28, 3, 26); g.rect(1, 2, 30, 2, WOOD[3]); g.rect(1, 2, 30, 1, WOOD[4]); g.rect(1, 12, 30, 1, WOOD[2]);
  g.rect(5, 4, 6, 9, '#c8c0a8'); g.rect(5, 4, 6, 1, '#e0d8c0'); g.rect(5, 12, 6, 2, '#a89c80');
  g.rect(13, 4, 5, 6, '#7a98b0'); g.rect(13, 9, 5, 1, '#5a788e'); g.rect(13, 10, 2, 3, '#7a98b0');
  g.rect(20, 4, 6, 11, '#c8c0a8'); g.rect(20, 4, 6, 1, '#e0d8c0'); g.rect(20, 14, 6, 1, '#a89c80'); g.rect(22, 6, 2, 1, '#a04030');
  g.rect(8, 22, 5, 2, STONE[1]);
  return g.outline().rows();
}
function sandals() {
  const g = new Grid(16, 8);
  g.rect(2, 3, 5, 3, '#8a6a3a'); g.rect(2, 3, 5, 1, '#b8924e'); g.line(3, 3, 5, 0, '#6a4a24'); g.line(5, 3, 3, 1, '#6a4a24');
  g.rect(9, 4, 5, 3, '#8a6a3a'); g.rect(9, 4, 5, 1, '#b8924e'); g.line(10, 4, 12, 1, '#6a4a24'); g.line(12, 4, 10, 2, '#6a4a24');
  return g.outline().rows();
}
function soapDish() {
  const g = new Grid(16, 10);
  g.disc(8, 7, 6, 2.4, STONE[2]); g.disc(8, 6.5, 5, 1.6, STONE[3]);
  g.rect(5, 3, 6, 4, '#e8d8a0'); g.rect(5, 3, 6, 1, '#f8eec0'); g.rect(5, 6, 6, 1, '#b8a870'); g.set(11, 2, '#fff'); g.set(4, 2, '#fff');
  return g.outline().rows();
}
function bathDuck() {
  const g = new Grid(16, 10);
  g.disc(8, 6, 5, 3, '#e8c030'); g.disc(12, 3, 2.6, 2.6, '#f0d040'); g.rect(14, 3, 2, 1, '#e87830'); g.set(12, 2, INK);
  g.line(2, 5, 0, 3, '#e8c030'); g.rect(6, 6, 4, 1, '#c09820'); g.set(7, 5, '#ffffff');
  return g.outline().rows();
}
function scrubBucket() {
  const g = new Grid(16, 18);
  g.rect(3, 8, 10, 9, WOOD[2]); g.rect(3, 8, 10, 1, WOOD[3]); g.rect(3, 11, 10, 1, IRON[1]); g.rect(3, 15, 10, 1, IRON[1]); g.rect(3, 16, 10, 1, WOOD[0]);
  g.rect(3, 6, 10, 3, '#cfe0e8'); g.disc(6, 6, 1.4, 1, '#fff'); g.disc(10, 6, 1.4, 1, '#fff');
  g.rect(9, 1, 5, 3, '#a89060'); g.rect(10, 0, 3, 1, '#c8b078'); g.line(11, 4, 9, 7, WOOD[3]);
  return g.outline().rows();
}
function mosaic() {
  const g = new Grid(32, 16);
  const tiles = ['#4a7a98', '#5a8ea8', '#3a6a88', '#c8c0a0'];
  for (let y = 3; y < 14; y++) for (let x = 3; x < 29; x++) { if (((x - 16) / 13) ** 2 + ((y - 8) / 5.5) ** 2 < 1) g.set(x, y, (x + y) % 2 ? tiles[0] + 'dd' : tiles[1] + 'dd'); }
  g.disc(15, 8, 5, 2.4, '#e0a850dd'); g.rect(19, 7, 4, 3, '#e0a850dd'); g.rect(22, 6, 2, 1, '#e0a850dd'); g.rect(22, 10, 2, 1, '#e0a850dd'); g.set(12, 7, INK);
  for (let x = 4; x < 28; x += 2) g.set(x, 3 + (x % 4), tiles[3] + 'cc');
  for (const [x, y] of [[6, 12], [9, 4], [25, 12], [20, 3]]) g.set(x, y, null);
  return g.rows();
}
function steamPipe() {
  const g = new Grid(16, 26);
  g.rect(6, 0, 4, 18, IRON[2]); g.rect(6, 0, 1, 18, IRON[3]); g.rect(5, 4, 6, 2, IRON[1]); g.rect(5, 12, 6, 2, IRON[1]);
  g.rect(6, 18, 9, 4, IRON[2]); g.rect(6, 18, 9, 1, IRON[3]); g.rect(14, 17, 2, 6, IRON[1]);
  g.rect(2, 8, 4, 2, IRON[1]); g.rect(0, 7, 3, 4, '#a84030'); g.rect(1, 8, 1, 2, '#d06a4c');
  g.rect(5, 24, 8, 2, STONE[1]); g.rect(8, 21, 1, 2, WATER[2]); g.set(8, 23, WATER[2]);
  return g.outline().rows();
}
function gauge() {
  const g = new Grid(16, 18);
  g.disc(8, 8, 7, 7, BRASS[1]); g.disc(8, 8, 5.4, 5.4, CREAM[2]); g.ring(8, 8, 6.5, BRASS[0]);
  for (let a = 0; a < 7; a++) g.set(8 + Math.cos(3.5 + a * 0.4) * 4.2, 8 + Math.sin(3.5 + a * 0.4) * 4.2, INK);
  g.line(8, 8, 5, 5, RED[1]); g.set(8, 8, INK);
  g.rect(7, 15, 2, 3, BRASS[0]);
  return g.outline().rows();
}
function coalScuttle() {
  const g = new Grid(16, 14);
  g.rect(3, 5, 9, 8, IRON[1]); g.rect(3, 5, 9, 1, IRON[2]); g.rect(11, 6, 3, 3, IRON[1]); g.rect(2, 12, 11, 1, IRON[0]);
  for (const [x, y] of [[4, 4], [6, 3], [8, 4], [10, 4], [5, 5], [9, 5]]) { g.disc(x, y, 1.4, 1.2, '#121418'); g.set(x - 1, y - 1, '#4a4e58'); }
  g.line(3, 6, 1, 3, IRON[2]);
  return g.outline().rows();
}
function shovel() {
  const g = new Grid(16, 26);
  g.line(10, 0, 8, 17, WOOD[3]); g.line(11, 0, 9, 17, WOOD[2]); g.rect(9, 0, 4, 2, WOOD[3]);
  g.rect(5, 16, 7, 8, IRON[2]); g.rect(5, 16, 7, 1, IRON[3]); g.line(5, 24, 8, 25, IRON[1]); g.line(11, 24, 8, 25, IRON[1]); g.rect(7, 18, 3, 3, '#121418');
  return g.outline().rows();
}
function rotaBoard() {
  const g = new Grid(16, 24);
  post(g, 2, 14, 24, 2); post(g, 12, 14, 24, 2);
  g.rect(0, 2, 16, 14, WOOD[2]); g.rect(0, 2, 16, 1, WOOD[3]); g.rect(1, 3, 14, 12, '#d4c8a8');
  for (const y of [5, 8, 11]) { g.rect(2, y, 5, 1, INK + '88'); g.rect(9, y, 4, 1, INK + '88'); }
  g.rect(9, 13, 5, 1, RED[1]); g.set(14, 13, RED[1]);
  g.rect(3, 22, 10, 2, LEAF[1]);
  return g.outline().rows();
}

// ---- Townsfolk (marmots, like the rest of Lasthome) ----
function marmot(opts) {
  const { w = 16, h = 24, fur = '#8a6a4a', furLight = '#b8946a', cloth = '#5a7a4a', apron = null, broom = false, small = false } = opts;
  const g = new Grid(w, h);
  const s = small ? 0.75 : 1;
  const cx = Math.round(w / 2);
  const top = h - Math.round(24 * s);
  g.rect(cx - 5 * s, h - 2, 4, 2, '#2e2218'); g.rect(cx + 1 * s, h - 2, 4, 2, '#2e2218');
  g.disc(cx, h - 8 * s, 5.5 * s, 6.5 * s, cloth); g.rect(cx - 5 * s, h - 8 * s, 2, 1, '#ffffff22');
  if (apron) { g.disc(cx, h - 7 * s, 3.4 * s, 4.6 * s, apron); g.rect(cx - 3 * s, h - 12 * s, 6 * s, 1, apron); }
  g.rect(cx - 8 * s, h - 11 * s, 3, 6, fur); g.rect(cx + 5 * s, h - 11 * s, 3, 6, fur);
  g.disc(cx, top + 8 * s, 4.6 * s, 4.4 * s, fur); g.disc(cx, top + 10 * s, 2.8 * s, 2 * s, furLight);
  g.disc(cx - 4 * s, top + 4.5 * s, 1.7 * s, 1.7 * s, fur); g.disc(cx + 4 * s, top + 4.5 * s, 1.7 * s, 1.7 * s, fur);
  g.set(cx - 4 * s, top + 4.5 * s, '#d8a0a0'); g.set(cx + 4 * s, top + 4.5 * s, '#d8a0a0');
  g.set(cx - 2, top + 8 * s, INK); g.set(cx + 2, top + 8 * s, INK); g.set(cx, top + 10 * s, '#c87878');
  if (broom) { g.line(cx + 7, top + 5, cx + 7, h - 1, WOOD[3]); g.rect(cx + 5, h - 4, 5, 4, '#b89a58'); g.rect(cx + 5, h - 4, 5, 1, WOOD[1]); }
  return g.outline().rows();
}

export const CL_PROP_SPRITES = {
  cl_flower_tub: flowerTub(), cl_log_stack: logStack(), cl_wash_tub: washTub(), cl_apple_crate: appleCrate(), cl_flour_sacks: flourSacks(),
  cl_hopscotch: hopscotch(), cl_hoop: hoop(), cl_stick_horse: stickHorse(), cl_broom_bucket: broomBucket(), cl_milk_stool: milkStool(),
  cl_rain_butt: rainButt(), cl_veg_bed: vegBed(), cl_bird_table: birdTable(), cl_bean_poles: beanPoles(), cl_spare_wheel: spareWheel(),
  cl_oatcake_rack: oatcakeRack(), cl_kennel: kennel(),
  cl_folk_sweeper: marmot({ cloth: '#4a6a7a', broom: true, w: 20 }), cl_folk_kid: marmot({ small: true, cloth: '#b04a3a', fur: '#c8a070', furLight: '#e0c090', h: 20, w: 14 }), cl_folk_baker: marmot({ cloth: '#c8b890', apron: '#f0e6cc', fur: '#a07a52', furLight: '#c8a478' }),
  cl_doormat: doormat(), cl_dartboard: dartboard(), cl_hat_pegs: hatPegs(), cl_chalk_easel: chalkEasel(), cl_cask_rack: caskRack(), cl_stools: stools(), cl_dog: dog(),
  cl_jar_shelf: jarShelf(), cl_basin: basin(), cl_cards_board: cardsBoard(), cl_herb_dry: herbDry(), cl_pot_rack: potRack(),
  cl_prayer_board: prayerBoard(), cl_hassock: hassock(),
  cl_weeds: weeds(), cl_weeds_tall: weedsTall(), cl_moss_flat: mossFlat(), cl_cracks_flat: cracksFlat(), cl_ivy_wall: ivyWall(),
  cl_sign_bread: signBread(), cl_sign_boot: signBoot(), cl_sign_scales: signScales(), cl_sign_key: signKey(), cl_sign_quill: signQuill(),
  cl_street_chair: streetChair(), cl_laid_table: laidTable(), cl_bundle: bundle(), cl_hand_cart: handCart(), cl_trunk: trunk(),
  cl_stone_cat: stoneCat(), cl_statue_ivy: statueIvy(), cl_shoes: shoes(), cl_banner_torn: bannerTorn(), cl_bench_moss: benchMoss(),
  cl_posy: posy(), cl_chisels: chisels(), cl_tally_chalk: tallyChalk(),
  cl_paper_stack: paperStack(), cl_ink_pot: inkPot(), cl_ink_blot: inkBlot(), cl_ledger_lectern: ledgerLectern(), cl_pigeonholes: pigeonholes(),
  cl_stamp_pad: stampPad(), cl_ladder_rail: ladderRail(), cl_clerk_desk: clerkDesk(), cl_loose_pages: loosePages(),
  cl_scroll_basket: scrollBasket(), cl_slate_easel: slateEasel(), cl_wall_clock: wallClock(),
  cl_towel_rack: towelRack(), cl_sandals: sandals(), cl_soap_dish: soapDish(), cl_bath_duck: bathDuck(), cl_scrub_bucket: scrubBucket(),
  cl_mosaic: mosaic(), cl_steam_pipe: steamPipe(), cl_gauge: gauge(), cl_coal_scuttle: coalScuttle(), cl_shovel: shovel(), cl_rota_board: rotaBoard(),
};

export const CL_PALETTE_EXTRA = palette;

// How many tiles wide each wider one stands.
export const CL_FOOTPRINTS = {
  cl_log_stack: 2, cl_veg_bed: 2, cl_bean_poles: 2, cl_cask_rack: 2, cl_stools: 2, cl_jar_shelf: 2, cl_herb_dry: 2, cl_pot_rack: 2,
  cl_moss_flat: 2, cl_doormat: 2, cl_cracks_flat: 2, cl_laid_table: 2, cl_hand_cart: 2, cl_trunk: 2, cl_bench_moss: 2,
  cl_ink_blot: 2, cl_pigeonholes: 2, cl_clerk_desk: 2, cl_loose_pages: 2, cl_towel_rack: 2, cl_mosaic: 2,
};
