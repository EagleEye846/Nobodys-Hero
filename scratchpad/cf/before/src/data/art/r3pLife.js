// Life-pass props for chapter 3's Pinefall and Hollin (15 November 2026): the red wood's small things
// (mushrooms, nests, burrows, deer beds, woodcutters' marks) and the empty village's belongings
// (what fifty years of nobody did to a kitchen garden, a washtub, a swing). Drawn like the other life
// files: rows of characters from a small painter, 16 pixels to a tile, standing on the bottom edge and
// centred over their footprint. Every id starts `r3p_`. Nothing here hangs in the air: every lamp, sign
// and line has its post, hook or peg.
//
//   Pinefall: r3p_toadstools r3p_boletes r3p_chanterelles r3p_puffballs r3p_fairy_ring (flat)
//     r3p_bracket_stump r3p_mush_log r3p_fern r3p_bracken r3p_leaf_heap r3p_leaves_flat (flat)
//     r3p_acorns r3p_pinecones r3p_twigs (flat) r3p_moss_rock r3p_boulder r3p_stump r3p_stump_big
//     r3p_branch (flat) r3p_red_shrub r3p_berries r3p_hollow_log r3p_roots r3p_web_bush
//     r3p_nest_stump r3p_nut_stump r3p_burrow r3p_deer_bed (flat) r3p_hoofprints (flat) r3p_wallow
//     r3p_puddle (flat) r3p_stones_flat r3p_feather r3p_antler r3p_giant_trunk
//   Woodcutters' marks: r3p_blaze_post r3p_cut_tree r3p_axe_stump r3p_log_stack r3p_log_small
//     r3p_sawhorse r3p_split_logs r3p_chips r3p_peeled_log r3p_wedge_log r3p_saw r3p_rope_coil
//     r3p_pail r3p_billy r3p_old_boot r3p_marker_stone r3p_cairn r3p_fence_bit r3p_wheel
//     r3p_tally_board r3p_cap_stump r3p_rag_pole (animated) r3p_fingerpost r3p_lantern_stand
//     r3p_feeder r3p_sled
//   Hollin: r3p_rocker r3p_washtub r3p_peg_basket r3p_boots r3p_mat r3p_pot_dead r3p_pot_wild
//     r3p_churn r3p_bucket r3p_wood_lean r3p_block_axe r3p_coop r3p_kennel r3p_cradle r3p_swing
//     (animated) r3p_toy_horse r3p_marbles r3p_hoop r3p_doll r3p_table_set r3p_stools
//     r3p_barrel_rain r3p_scythe_post r3p_skeps r3p_cabbages r3p_bean_poles r3p_trough
//     r3p_notice_post r3p_maypole r3p_coat_post r3p_street_lamp r3p_hopscotch r3p_chalk_axeman
//     r3p_pie_bench r3p_music_box r3p_sack_pile r3p_millstone r3p_flour_barrel r3p_grindstone
//     r3p_eel_trap r3p_planks r3p_post r3p_ladder r3p_bundle r3p_wheelbarrow r3p_kettle_stones
//   Indoors: r3p_tin_stack r3p_cheese r3p_ledger r3p_cat_bed r3p_broom r3p_apple_crate r3p_jars
//     r3p_sweet_jar r3p_logbook r3p_horn r3p_blanket r3p_coins r3p_old_bucket r3p_bricks

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xcd00 + colors.size);
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
const INK = '#1c0f14';
const BARK = ['#2a1810', '#4a2e1e', '#6e4a30', '#946a44', '#b88c5c'];
const RED = ['#6a1c24', '#a82838', '#c8402e', '#e0702a', '#e8a03a'];
const MOSS = ['#26361f', '#3a5430', '#587a3c', '#7a9c50'];
const BROWN = ['#5a3420', '#7e4e2c', '#a87040'];
const ORANGE = ['#a85a14', '#d8841c', '#f0b44c'];
const STONE = ['#33303a', '#524e5c', '#767184', '#9a96a6'];
const IRON = ['#20242a', '#3a404c', '#5c6676', '#8a94a4'];
const CAP = ['#8a1c22', '#c8302a', '#e85a48'];
const CREAM = ['#b8a888', '#e8dcc0', '#f8f0dc'];
const STRAW = ['#8a6a2c', '#b8923c', '#e0bc58'];
const WEATHER = ['#2a2622', '#4a4238', '#6a6050', '#8a806a', '#a89c84'];
const EARTH = ['#2a1a1c', '#3e2a28', '#5a4034'];
const RAG = ['#7a2024', '#b03a34', '#d85c48'];
const BLUE = ['#2a3e62', '#3e5e8e', '#6e94c0'];
const MUSTARD = ['#8a6a1e', '#c8a03a', '#f0d070'];
const BONE = ['#a89c84', '#d8ccb0', '#f4ecd8'];
const WATER = ['#2a3a52', '#44607e', '#7aa0c0'];

// A toadstool: stem, cap with its dome, spots.
function toadstool(g, x, y, r, cap = CAP, spots = true, tall = 4) {
  g.rect(x - 1, y - tall, 2, tall + 1, CREAM[1]);
  g.rect(x, y - tall, 1, tall + 1, CREAM[0]);
  g.disc(x, y - tall - 1, r, r * 0.7 + 0.5, cap[1]);
  g.rect(x - r, y - tall, r * 2 + 1, 1, cap[0]);
  g.disc(x - 1, y - tall - 2, r * 0.5, 0.8, cap[2]);
  if (spots) {
    g.set(x - 1, y - tall - 2, CREAM[2]);
    g.set(x + 1, y - tall - 1, CREAM[2]);
    if (r > 3) g.set(x + 2, y - tall - 3, CREAM[2]);
  }
}

// A tuft of dead grass or fern blades.
function blades(g, x, y, n, h, cols, spread = 1) {
  for (let i = 0; i < n; i++) {
    const dx = (i - (n - 1) / 2) * spread;
    g.line(x + dx * 0.4, y, x + dx * 1.6, y - h + (i % 2) * 2, cols[i % cols.length]);
  }
}

// ---------------------------------------------------------------------------------------------
// THE PINEFALL: mushrooms

function toadstools() {
  const g = new Grid(16, 14);
  toadstool(g, 4, 13, 3, CAP, true, 3);
  toadstool(g, 10, 13, 4, CAP, true, 5);
  toadstool(g, 13, 13, 2, CAP, false, 2);
  g.rect(2, 13, 12, 1, MOSS[1]);
  return g.outline().rows();
}

function boletes() {
  const g = new Grid(16, 14);
  for (const [x, y, r, t] of [[5, 13, 4, 4], [11, 13, 3, 3]]) {
    g.rect(x - 1, y - t, 3, t + 1, CREAM[1]);
    g.rect(x + 1, y - t, 1, t + 1, CREAM[0]);
    g.disc(x, y - t - 1, r, r * 0.65, BROWN[1]);
    g.disc(x - 1, y - t - 2, r * 0.5, 0.8, BROWN[2]);
    g.rect(x - r, y - t, r * 2 + 1, 1, BROWN[0]);
  }
  g.rect(1, 13, 14, 1, MOSS[1]);
  g.set(2, 12, MOSS[2]); g.set(14, 12, MOSS[2]);
  return g.outline().rows();
}

function chanterelles() {
  const g = new Grid(16, 10);
  for (const [x, h] of [[3, 4], [6, 6], [9, 5], [12, 4]]) {
    g.line(x, 9, x, 9 - h + 2, ORANGE[0]);
    g.disc(x, 9 - h + 1, 2.4, 1.2, ORANGE[1]);
    g.set(x - 1, 9 - h + 1, ORANGE[2]);
    g.set(x + 1, 9 - h + 2, ORANGE[0]);
  }
  g.rect(1, 9, 14, 1, MOSS[0]);
  return g.outline().rows();
}

function puffballs() {
  const g = new Grid(16, 10);
  g.disc(4, 7, 3, 2.5, CREAM[2]); g.disc(3, 6, 1.2, 1, '#ffffff'); g.disc(5, 8, 2, 1, CREAM[0]);
  g.disc(10, 8, 2, 1.8, CREAM[1]); g.disc(9, 7, 0.8, 0.8, '#ffffff');
  g.disc(13, 8, 1.2, 1.1, CREAM[2]);
  g.rect(8, 3, 1, 1, CREAM[1]); g.rect(11, 1, 1, 1, CREAM[1]); g.rect(7, 1, 1, 1, CREAM[0]);
  g.rect(2, 9, 12, 1, MOSS[1]);
  return g.outline().rows();
}

// A ring of small red caps in the leaves, lying flat.
function fairyRing() {
  const g = new Grid(32, 16);
  const n = 11;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x = 16 + Math.cos(a) * 12;
    const y = 8 + Math.sin(a) * 4.5;
    g.rect(x, y, 1, 2, CREAM[1]);
    g.rect(x - 1, y - 1, 3, 1, CAP[1]);
    g.set(x, y - 1, CREAM[2]);
  }
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    g.set(16 + Math.cos(a) * 9, 8 + Math.sin(a) * 3, MOSS[2] + 'aa');
  }
  return g.rows();
}

function bracketStump() {
  const g = new Grid(16, 22);
  g.rect(3, 6, 10, 16, BARK[2]);
  g.rect(3, 6, 2, 16, BARK[1]); g.rect(11, 6, 2, 16, BARK[0]); g.rect(7, 8, 1, 12, BARK[3]);
  g.disc(8, 6, 5, 1.6, BARK[3]); g.disc(8, 6, 3, 0.9, BARK[4]);
  g.line(8, 5, 8, 6, BARK[2]);
  // Shelf fungus climbing the side.
  for (const [x, y, w] of [[11, 10, 5], [10, 14, 6], [1, 12, 4], [11, 18, 4]]) {
    g.rect(x, y, w, 2, ORANGE[1]); g.rect(x, y, w, 1, ORANGE[2]); g.rect(x, y + 2, w - 1, 1, ORANGE[0]);
  }
  g.rect(0, 21, 4, 1, MOSS[1]); g.rect(11, 21, 5, 1, MOSS[1]);
  return g.outline().rows();
}

function mushLog() {
  const g = new Grid(32, 18);
  g.rect(1, 8, 30, 9, BARK[1]);
  g.rect(1, 8, 30, 2, BARK[2]); g.rect(1, 15, 30, 2, BARK[0]);
  g.disc(2, 12, 2.5, 4.5, BARK[3]); g.disc(2, 12, 1, 2, BARK[4]);
  for (let x = 6; x < 30; x += 4) g.line(x, 9, x + 1, 15, BARK[0]);
  g.rect(8, 7, 5, 1, MOSS[2]); g.rect(20, 7, 6, 1, MOSS[1]);
  toadstool(g, 11, 8, 3, CAP, true, 3);
  toadstool(g, 16, 8, 2, CAP, false, 2);
  for (const [x, y] of [[22, 8], [25, 9], [27, 8]]) { g.rect(x, y - 2, 1, 2, CREAM[1]); g.disc(x, y - 3, 1.6, 1, CAP[1]); }
  g.rect(2, 17, 5, 1, MOSS[1]); g.rect(24, 17, 6, 1, MOSS[1]);
  return g.outline().rows();
}

// ---------------------------------------------------------------------------------------------
// THE PINEFALL: undergrowth, stones and stumps

function fern() {
  const g = new Grid(16, 16);
  for (let i = -3; i <= 3; i++) {
    const tx = 8 + i * 2;
    const ty = 15 - 9 + Math.abs(i);
    g.line(8, 15, tx, ty, i % 2 ? RED[3] : RED[2]);
    for (let k = 3; k < 9; k += 2) {
      const px = 8 + (tx - 8) * (k / 9);
      const py = 15 - (15 - ty) * (k / 9);
      g.set(px - 1, py, RED[1]); g.set(px + 1, py, RED[4]);
    }
  }
  g.rect(6, 14, 4, 2, EARTH[1]);
  return g.outline().rows();
}

function bracken() {
  const g = new Grid(32, 20);
  for (const [bx, s] of [[8, 1], [16, 1.2], [24, 0.9]]) {
    for (let i = -4; i <= 4; i++) {
      const tx = bx + i * 2.2 * s;
      const ty = 19 - 11 * s + Math.abs(i) * 1.2;
      g.line(bx, 19, tx, ty, i % 2 ? RED[2] : RED[3]);
      for (let k = 4; k < 11; k += 2) {
        const px = bx + (tx - bx) * (k / 11);
        const py = 19 - (19 - ty) * (k / 11);
        g.set(px - 1, py, RED[1]); g.set(px + 1, py + 1, RED[4]);
      }
    }
  }
  g.rect(3, 18, 26, 2, EARTH[1]);
  return g.outline().rows();
}

function leafHeap() {
  const g = new Grid(16, 12);
  g.disc(8, 8, 7, 3.5, RED[1]);
  g.disc(7, 6, 5, 2.5, RED[2]); g.disc(9, 5, 3, 1.5, RED[3]);
  for (const [x, y, c] of [[4, 6, RED[4]], [10, 4, RED[4]], [12, 8, RED[0]], [6, 9, RED[0]], [8, 7, RED[4]], [3, 9, RED[3]]]) g.set(x, y, c);
  return g.outline().rows();
}

function leavesFlat() {
  const g = new Grid(32, 12);
  for (let i = 0; i < 26; i++) {
    const x = 1 + ((i * 11) % 29);
    const y = 1 + ((i * 7) % 10);
    const c = [RED[0], RED[1], RED[2], RED[3], RED[4]][(i * 3) % 5];
    g.rect(x, y, 2, 1, c); g.set(x + (i % 2), y + 1, c);
  }
  return g.rows();
}

function acorns() {
  const g = new Grid(16, 8);
  for (const [x, y] of [[3, 6], [7, 5], [11, 6], [13, 4]]) {
    g.rect(x - 1, y - 2, 3, 1, BARK[1]); g.rect(x - 1, y - 1, 3, 2, BROWN[2]); g.set(x, y + 1, BARK[0]); g.set(x, y - 3, BARK[0]);
  }
  return g.rows();
}

function pinecones() {
  const g = new Grid(16, 10);
  for (const [x, y, s] of [[4, 8, 1], [11, 7, 1.3]]) {
    g.disc(x, y - 2, 2 * s, 3 * s, BARK[2]);
    for (let k = 0; k < 4; k++) g.rect(x - 2 * s, y - 4 * s + k * 2 * s, 4 * s, 1, BARK[3]);
    g.line(x, y - 5 * s, x, y + 1, BARK[0]);
  }
  return g.outline().rows();
}

function twigs() {
  const g = new Grid(32, 8);
  g.line(2, 5, 14, 3, BARK[3]); g.line(8, 4, 12, 7, BARK[2]); g.line(12, 3, 17, 1, BARK[2]);
  g.line(16, 6, 29, 5, BARK[2]); g.line(23, 5, 27, 2, BARK[3]); g.line(20, 6, 22, 7, BARK[1]);
  return g.rows();
}

function mossRock() {
  const g = new Grid(16, 14);
  g.disc(8, 9, 7, 4.6, STONE[1]);
  g.disc(7, 7, 5, 3, STONE[2]); g.disc(6, 6, 2, 1.3, STONE[3]);
  g.disc(9, 5, 5, 1.8, MOSS[2]); g.disc(5, 5, 2, 1, MOSS[3]);
  g.rect(3, 12, 10, 1, STONE[0]);
  return g.outline().rows();
}

function boulder() {
  const g = new Grid(32, 26);
  g.disc(16, 17, 14.5, 8, STONE[1]);
  g.disc(15, 13, 12, 7, STONE[2]); g.disc(11, 10, 6, 3.5, STONE[3]);
  g.line(20, 8, 24, 16, STONE[0]); g.line(24, 16, 22, 21, STONE[0]);
  g.disc(18, 7, 8, 2.4, MOSS[1]); g.disc(14, 6, 5, 1.5, MOSS[2]); g.disc(26, 9, 3, 1.5, MOSS[2]);
  g.rect(4, 23, 24, 2, STONE[0]);
  g.rect(2, 24, 4, 1, MOSS[1]); g.rect(24, 24, 6, 1, MOSS[1]);
  return g.outline().rows();
}

function stump() {
  const g = new Grid(16, 16);
  g.rect(3, 7, 10, 9, BARK[1]); g.rect(3, 7, 2, 9, BARK[2]); g.rect(11, 7, 2, 9, BARK[0]);
  g.line(3, 15, 1, 16, BARK[1]); g.line(12, 15, 14, 16, BARK[1]);
  g.disc(8, 7, 5.2, 2, BARK[3]); g.disc(8, 7, 3.4, 1.2, BARK[4]); g.disc(8, 7, 1.4, 0.6, BARK[3]);
  return g.outline().rows();
}

function stumpBig() {
  const g = new Grid(32, 22);
  g.rect(5, 8, 22, 14, BARK[1]);
  g.rect(5, 8, 4, 14, BARK[2]); g.rect(22, 8, 5, 14, BARK[0]);
  for (let x = 10; x < 22; x += 3) g.line(x, 9, x, 20, BARK[0]);
  g.line(5, 20, 1, 22, BARK[1]); g.line(26, 20, 31, 22, BARK[1]); g.line(14, 21, 12, 22, BARK[1]);
  g.disc(16, 8, 11.5, 3.6, BARK[3]); g.disc(16, 8, 8.5, 2.6, BARK[4]);
  g.disc(16, 8, 5.5, 1.7, BARK[3]); g.disc(16, 8, 2.5, 0.8, BARK[4]);
  g.rect(6, 8, 6, 1, MOSS[1]); g.set(7, 7, MOSS[2]); g.rect(24, 9, 2, 3, MOSS[1]);
  return g.outline().rows();
}

function branch() {
  const g = new Grid(32, 12);
  g.line(2, 9, 29, 6, BARK[2]); g.line(2, 10, 29, 7, BARK[1]); g.line(2, 8, 29, 5, BARK[3]);
  g.line(10, 8, 14, 3, BARK[2]); g.line(18, 7, 22, 2, BARK[2]); g.line(24, 6, 28, 3, BARK[2]);
  for (const [x, y] of [[14, 3], [22, 2], [28, 3], [12, 5]]) { g.rect(x - 1, y - 1, 3, 2, RED[2]); g.set(x, y - 2, RED[3]); }
  return g.rows();
}

function redShrub() {
  const g = new Grid(16, 20);
  g.rect(7, 12, 2, 8, BARK[1]);
  g.disc(8, 9, 7, 6, RED[1]);
  g.disc(6, 8, 4.5, 4, RED[2]); g.disc(10, 6, 3.5, 3, RED[3]); g.disc(5, 6, 2, 1.5, RED[4]);
  for (const [x, y] of [[4, 11], [12, 10], [9, 3], [3, 7], [11, 12]]) g.set(x, y, RED[0]);
  return g.outline().rows();
}

function berries() {
  const g = new Grid(16, 16);
  g.disc(8, 10, 7, 5, MOSS[1]); g.disc(6, 9, 4, 3, MOSS[2]);
  for (let i = 0; i < 6; i++) g.line(4 + i * 2, 14, 3 + i * 2.5, 6 + (i % 3), BARK[0]);
  for (const [x, y] of [[4, 9], [7, 6], [10, 9], [12, 11], [6, 12], [9, 12], [3, 12]]) { g.set(x, y, '#6a1a4a'); g.set(x, y - 1, '#c8508a'); }
  return g.outline().rows();
}

function hollowLog() {
  const g = new Grid(32, 20);
  g.rect(1, 6, 30, 13, BARK[1]);
  g.rect(1, 6, 30, 3, BARK[2]); g.rect(1, 16, 30, 3, BARK[0]);
  for (let x = 6; x < 30; x += 4) g.line(x, 8, x + 1, 17, BARK[0]);
  g.disc(3, 12, 3.4, 6.4, BARK[0]); g.disc(3, 12, 2.2, 4.8, '#0e0608'); g.disc(2, 11, 1, 2, '#2a1416');
  g.rect(8, 5, 8, 1, MOSS[1]); g.rect(22, 5, 5, 1, MOSS[2]);
  g.set(15, 12, '#2a1810'); g.set(22, 14, BARK[3]);
  g.rect(3, 19, 6, 1, MOSS[1]);
  return g.outline().rows();
}

// A knot of roots spreading from a trunk's foot.
function roots() {
  const g = new Grid(32, 24);
  g.rect(10, 0, 12, 14, BARK[1]);
  g.rect(10, 0, 3, 14, BARK[2]); g.rect(19, 0, 3, 14, BARK[0]); g.line(16, 0, 16, 12, BARK[0]);
  g.line(11, 13, 2, 22, BARK[1]); g.line(12, 12, 4, 23, BARK[2]); g.line(21, 13, 30, 22, BARK[1]); g.line(20, 12, 28, 23, BARK[2]);
  g.line(14, 13, 12, 23, BARK[1]); g.line(18, 13, 20, 23, BARK[1]);
  g.disc(16, 14, 6, 2, BARK[2]);
  g.disc(16, 17, 3.5, 3, '#0e0608');
  g.rect(8, 6, 3, 4, MOSS[1]); g.rect(21, 4, 2, 5, MOSS[2]);
  return g.outline().rows();
}

function webBush() {
  const g = new Grid(16, 18);
  g.disc(8, 12, 7, 5, MOSS[1]); g.disc(7, 11, 4, 3, MOSS[2]);
  g.line(1, 5, 15, 5, '#e8eef0' + 'aa'); g.line(1, 9, 15, 9, '#e8eef0' + 'aa');
  g.line(8, 1, 8, 15, '#e8eef0' + 'aa'); g.line(3, 2, 13, 14, '#e8eef0' + '88'); g.line(13, 2, 3, 14, '#e8eef0' + '88');
  for (const [x, y] of [[8, 5], [5, 5], [11, 9], [8, 9]]) g.set(x, y, '#ffffff');
  g.rect(7, 13, 2, 3, BARK[1]);
  return g.rows();
}

function nestStump() {
  const g = new Grid(16, 20);
  g.rect(3, 10, 10, 10, BARK[1]); g.rect(3, 10, 2, 10, BARK[2]); g.rect(11, 10, 2, 10, BARK[0]);
  g.disc(8, 10, 5.2, 1.8, BARK[3]);
  g.disc(8, 8, 5, 2.6, STRAW[1]); g.disc(8, 8, 3, 1.4, STRAW[0]);
  g.line(3, 8, 6, 6, STRAW[2]); g.line(13, 8, 10, 6, STRAW[2]);
  g.disc(6.5, 7.5, 1.3, 1, '#9cc8d8'); g.disc(9.5, 7.5, 1.3, 1, '#9cc8d8'); g.set(6, 7, '#d8ecf2'); g.set(9, 7, '#d8ecf2');
  g.rect(0, 19, 3, 1, MOSS[1]);
  return g.outline().rows();
}

function nutStump() {
  const g = new Grid(16, 16);
  g.rect(3, 6, 10, 10, BARK[1]); g.rect(3, 6, 2, 10, BARK[2]); g.rect(11, 6, 2, 10, BARK[0]);
  g.disc(8, 6, 5.2, 1.8, BARK[3]);
  g.disc(8, 11, 3, 3.4, '#0e0608');
  for (const [x, y] of [[6, 13], [8, 14], [10, 13], [7, 12], [9, 12]]) { g.rect(x, y, 2, 1, BROWN[2]); g.set(x, y - 1, BARK[0]); }
  g.set(3, 5, BROWN[2]); g.set(12, 5, BROWN[2]);
  return g.outline().rows();
}

function burrow() {
  const g = new Grid(16, 12);
  g.disc(8, 8, 7, 3.4, EARTH[2]);
  g.disc(8, 8, 4, 2.6, '#0a0406');
  g.disc(8, 6, 4.8, 1, EARTH[1]);
  for (const [x, y] of [[2, 8], [13, 7], [4, 10], [12, 10]]) g.set(x, y, RED[1]);
  g.line(1, 5, 4, 6, BARK[3]); g.line(14, 5, 12, 6, BARK[3]);
  return g.outline().rows();
}

function deerBed() {
  const g = new Grid(32, 12);
  g.disc(16, 6, 14, 4.5, EARTH[1] + 'cc');
  g.disc(15, 6, 11, 3.2, EARTH[0] + 'dd');
  for (const [x, y] of [[8, 5], [14, 4], [20, 6], [24, 7], [10, 8]]) { g.rect(x, y, 2, 1, RED[1]); }
  for (const [x, y] of [[12, 6], [18, 5]]) g.set(x, y, BARK[3]);
  g.set(21, 4, BARK[4]); g.set(6, 6, BARK[4]);
  return g.rows();
}

function hoofprints() {
  const g = new Grid(32, 8);
  for (let i = 0; i < 5; i++) {
    const x = 3 + i * 6;
    const y = 2 + (i % 2) * 3;
    g.rect(x, y, 1, 2, EARTH[0]); g.rect(x + 2, y, 1, 2, EARTH[0]); g.set(x + 1, y + 2, EARTH[0]);
  }
  return g.rows();
}

function wallow() {
  const g = new Grid(32, 14);
  g.disc(16, 8, 14, 5, EARTH[0]);
  g.disc(15, 8, 11, 3.6, '#3e2c26');
  g.disc(13, 7, 5, 1.6, '#5a443a');
  for (const [x, y] of [[4, 5], [27, 10], [8, 12], [25, 4]]) { g.rect(x, y, 3, 1, RED[1]); g.set(x + 1, y - 1, RED[2]); }
  g.line(21, 6, 25, 6, '#8a6c52');
  g.rect(3, 11, 2, 1, '#8a6c52'); g.rect(26, 7, 1, 2, '#8a6c52');
  return g.rows();
}

function puddle() {
  const g = new Grid(32, 12);
  g.disc(16, 6, 14, 4.6, WATER[0] + 'e0');
  g.disc(15, 6, 12, 3.6, WATER[1] + 'e0');
  g.disc(13, 5, 7, 1.6, WATER[2] + 'b0');
  for (const [x, y, c] of [[8, 6, RED[2]], [18, 5, RED[3]], [22, 7, RED[1]], [12, 8, RED[2]]]) { g.rect(x, y, 3, 1, c); g.set(x + 1, y + 1, c); }
  g.line(10, 3, 15, 3, '#e8f0f4');
  return g.rows();
}

function stonesFlat() {
  const g = new Grid(32, 10);
  for (const [x, y, rx] of [[5, 4, 4], [14, 6, 4.5], [22, 3, 3.5], [27, 7, 3]]) {
    g.disc(x, y, rx, 2.2, STONE[1]); g.disc(x - 1, y - 1, rx - 1.5, 1.2, STONE[2]);
    g.rect(x - rx, y + 1, rx * 2, 1, STONE[0]);
  }
  g.rect(8, 8, 3, 1, MOSS[1]); g.rect(24, 5, 2, 1, MOSS[2]);
  return g.rows();
}

function feather() {
  const g = new Grid(16, 8);
  g.line(3, 6, 13, 2, '#8a5a3a'); g.line(3, 5, 12, 2, '#c8502a');
  g.line(5, 6, 11, 3, '#e0702a'); g.line(3, 6, 14, 3, BONE[1] + '88');
  g.set(3, 6, BONE[2]); g.set(2, 7, BONE[2]);
  return g.rows();
}

function antler() {
  const g = new Grid(16, 10);
  g.line(2, 8, 12, 4, BONE[1]); g.line(2, 7, 12, 3, BONE[2]);
  g.line(5, 7, 6, 3, BONE[1]); g.line(8, 6, 9, 2, BONE[1]); g.line(11, 4, 14, 2, BONE[1]);
  g.rect(1, 7, 3, 3, BONE[0]); g.set(2, 8, BARK[1]);
  return g.outline().rows();
}

// A huge trunk, in the way of the light: roots, a split, moss and a lot of dark bark.
function giantTrunk() {
  const g = new Grid(32, 64);
  g.rect(6, 0, 20, 52, BARK[1]);
  g.rect(6, 0, 5, 52, BARK[2]); g.rect(20, 0, 6, 52, BARK[0]);
  for (let x = 10; x < 22; x += 3) g.line(x, 0, x + (x % 2), 52, BARK[0]);
  g.line(8, 0, 9, 52, BARK[3]);
  g.line(7, 50, 0, 62, BARK[1]); g.line(10, 51, 5, 63, BARK[2]); g.line(25, 50, 31, 62, BARK[1]); g.line(22, 51, 27, 63, BARK[2]);
  g.line(14, 52, 12, 63, BARK[1]); g.line(18, 52, 20, 63, BARK[1]);
  g.disc(16, 54, 11, 4, BARK[2]);
  g.disc(16, 40, 3.5, 6, '#0e0608'); g.disc(15, 38, 1.4, 2.5, '#2a1416');
  g.rect(6, 30, 5, 10, MOSS[1]); g.rect(7, 32, 3, 6, MOSS[2]); g.rect(21, 12, 4, 8, MOSS[1]);
  g.rect(6, 20, 3, 5, RED[1]);
  return g.outline().rows();
}

// ---------------------------------------------------------------------------------------------
// WOODCUTTERS' MARKS

// A short post, painted with a red ring and an arrow to show the way out.
function blazePost() {
  const g = new Grid(16, 28);
  g.rect(6, 4, 4, 24, BARK[2]); g.rect(6, 4, 1, 24, BARK[3]); g.rect(9, 4, 1, 24, BARK[0]);
  g.rect(5, 3, 6, 2, BARK[3]);
  g.rect(5, 9, 6, 6, '#e8e0d0'); g.rect(5, 9, 6, 1, '#b8b0a0');
  g.disc(8, 12, 2.2, 2.2, '#c8302a'); g.disc(8, 12, 1, 1, '#e8e0d0');
  g.line(3, 18, 7, 18, '#c8302a'); g.line(5, 16, 7, 18, '#c8302a'); g.line(5, 20, 7, 18, '#c8302a');
  g.rect(3, 27, 4, 1, MOSS[1]); g.rect(10, 27, 3, 1, RED[1]);
  return g.outline().rows();
}

// A standing trunk with the mark Ma cuts: three notches and a tick.
function cutTree() {
  const g = new Grid(16, 40);
  g.rect(4, 0, 8, 38, BARK[1]);
  g.rect(4, 0, 2, 38, BARK[2]); g.rect(10, 0, 2, 38, BARK[0]); g.line(8, 0, 8, 38, BARK[0]);
  g.line(3, 37, 0, 40, BARK[1]); g.line(12, 37, 15, 40, BARK[1]);
  for (const y of [18, 21, 24]) { g.rect(5, y, 6, 2, BARK[4]); g.rect(5, y + 2, 6, 1, BARK[0]); }
  g.line(7, 28, 9, 31, BARK[4]); g.line(9, 31, 12, 26, BARK[4]);
  g.rect(4, 8, 2, 4, MOSS[1]); g.rect(10, 30, 2, 5, MOSS[1]);
  g.disc(8, 38, 6, 1.4, EARTH[2]);
  return g.outline().rows();
}

function axeStump() {
  const g = new Grid(16, 22);
  g.rect(3, 12, 10, 10, BARK[1]); g.rect(3, 12, 2, 10, BARK[2]); g.rect(11, 12, 2, 10, BARK[0]);
  g.disc(8, 12, 5.2, 1.8, BARK[3]); g.disc(8, 12, 3, 1, BARK[4]);
  g.line(9, 11, 12, 2, BARK[3]); g.line(10, 11, 13, 2, BARK[2]);
  g.rect(5, 3, 7, 4, IRON[2]); g.rect(5, 3, 7, 1, IRON[3]); g.rect(5, 6, 6, 1, IRON[1]); g.set(4, 5, IRON[3]); g.set(4, 4, IRON[2]);
  g.rect(0, 21, 3, 1, RED[1]);
  return g.outline().rows();
}

function logStack() {
  const g = new Grid(32, 24);
  const row = (y, n, x0) => {
    for (let i = 0; i < n; i++) {
      const x = x0 + i * 6;
      g.disc(x, y, 3.2, 3.2, BARK[1]); g.disc(x, y, 2.4, 2.4, BARK[3]); g.disc(x, y, 1.3, 1.3, BARK[4]); g.set(x, y, BARK[2]);
    }
  };
  row(20, 5, 4); row(14, 4, 7); row(8, 3, 10); row(3, 2, 13);
  g.rect(0, 22, 32, 2, BARK[0]);
  g.rect(0, 0, 2, 24, BARK[2]); g.rect(30, 0, 2, 24, BARK[2]);
  return g.outline().rows();
}

function logSmall() {
  const g = new Grid(16, 14);
  g.rect(1, 6, 14, 7, BARK[1]); g.rect(1, 6, 14, 2, BARK[2]); g.rect(1, 11, 14, 2, BARK[0]);
  g.disc(2, 9, 2, 3.5, BARK[3]); g.disc(2, 9, 0.8, 1.6, BARK[4]);
  g.rect(5, 9, 6, 1, BARK[0]);
  return g.outline().rows();
}

// A log across a sawhorse, half sawn through, the saw still in the cut.
function sawhorse() {
  const g = new Grid(32, 22);
  for (const x of [5, 22]) { g.line(x, 8, x - 3, 21, BARK[2]); g.line(x + 1, 8, x + 4, 21, BARK[1]); g.rect(x - 1, 8, 4, 2, BARK[3]); }
  g.rect(1, 3, 30, 7, BARK[1]); g.rect(1, 3, 30, 2, BARK[2]); g.rect(1, 8, 30, 2, BARK[0]);
  g.disc(2, 6, 1.6, 3, BARK[3]);
  g.rect(14, 4, 1, 5, '#2a1810');
  g.rect(8, 0, 14, 2, IRON[2]); g.rect(8, 0, 14, 1, IRON[3]); g.rect(8, 2, 14, 1, IRON[1]);
  g.rect(7, 0, 1, 5, BARK[3]); g.rect(22, 0, 1, 5, BARK[3]);
  g.rect(10, 11, 4, 1, BARK[4]); g.rect(18, 12, 3, 1, BARK[4]); g.rect(14, 13, 2, 1, BARK[4]);
  return g.outline().rows();
}

function splitLogs() {
  const g = new Grid(16, 12);
  for (const [x, y, w] of [[1, 9, 6], [8, 9, 7], [3, 5, 6], [10, 5, 5], [6, 1, 5]]) {
    g.rect(x, y, w, 3, BARK[2]); g.rect(x, y, w, 1, BARK[3]); g.rect(x, y + 2, w, 1, BARK[0]); g.set(x, y + 1, BARK[4]);
  }
  return g.outline().rows();
}

function chips() {
  const g = new Grid(16, 8);
  for (let i = 0; i < 14; i++) g.rect(1 + ((i * 5) % 14), 1 + ((i * 3) % 6), 2, 1, i % 2 ? BARK[4] : BARK[3]);
  return g.rows();
}

function peeledLog() {
  const g = new Grid(32, 14);
  g.rect(1, 3, 30, 9, BARK[4]); g.rect(1, 3, 30, 2, '#d8b888'); g.rect(1, 10, 30, 2, BARK[3]);
  g.disc(2, 7, 1.8, 4.2, '#e8cc9c'); g.disc(30, 7, 1.8, 4.2, '#d8b888');
  g.rect(12, 3, 7, 3, BARK[1]); g.rect(24, 5, 4, 4, BARK[1]); g.rect(4, 7, 3, 3, BARK[1]);
  g.line(2, 12, 29, 12, BARK[0]);
  g.rect(8, 13, 5, 1, BARK[1]);
  return g.outline().rows();
}

function wedgeLog() {
  const g = new Grid(16, 16);
  g.rect(3, 4, 10, 12, BARK[1]); g.rect(3, 4, 2, 12, BARK[2]); g.rect(11, 4, 2, 12, BARK[0]);
  g.disc(8, 4, 5.2, 1.8, BARK[3]);
  g.line(8, 3, 8, 8, BARK[0]);
  g.rect(7, 1, 3, 5, IRON[2]); g.rect(7, 1, 1, 5, IRON[3]); g.rect(9, 1, 1, 5, IRON[1]);
  g.rect(6, 0, 5, 1, IRON[3]);
  return g.outline().rows();
}

// A two-man saw, leaning on a stump.
function sawLeaning() {
  const g = new Grid(16, 26);
  g.rect(3, 15, 10, 11, BARK[1]); g.rect(3, 15, 2, 11, BARK[2]); g.rect(11, 15, 2, 11, BARK[0]);
  g.disc(8, 15, 5.2, 1.8, BARK[3]);
  g.line(4, 14, 12, 1, IRON[2]); g.line(5, 14, 13, 1, IRON[3]); g.line(3, 14, 11, 1, IRON[1]);
  for (let i = 0; i < 6; i++) g.set(4 + i * 1.4 - 1, 14 - i * 2.2, IRON[0]);
  g.rect(11, 0, 3, 2, BARK[3]); g.rect(2, 13, 3, 2, BARK[3]);
  return g.outline().rows();
}

function ropeCoil() {
  const g = new Grid(16, 10);
  g.disc(8, 6, 6, 3, STRAW[1]); g.disc(8, 6, 3.6, 1.6, STRAW[0]); g.disc(8, 6, 1.8, 0.8, '#1c0f14');
  g.disc(8, 5, 6, 2.6, STRAW[2] + '66');
  g.line(10, 8, 15, 9, STRAW[1]); g.line(2, 6, 0, 8, STRAW[1]);
  for (const x of [3, 6, 10, 12]) g.set(x, 5, STRAW[0]);
  return g.outline().rows();
}

function pail() {
  const g = new Grid(16, 14);
  g.rect(4, 5, 8, 8, IRON[2]); g.rect(4, 5, 2, 8, IRON[3]); g.rect(10, 5, 2, 8, IRON[1]);
  g.rect(4, 5, 8, 1, IRON[1]); g.rect(4, 12, 8, 1, IRON[0]);
  g.disc(8, 3, 4.5, 3, null); g.line(4, 5, 4, 3, IRON[1]); g.line(12, 5, 12, 3, IRON[1]); g.line(5, 2, 11, 2, IRON[1]); g.line(6, 1, 10, 1, IRON[1]);
  g.rect(6, 7, 4, 2, RED[2]); g.set(7, 8, RED[0]);
  return g.outline().rows();
}

// A blackened billy-can on three stones, the fire long out.
function billy() {
  const g = new Grid(16, 14);
  for (const x of [3, 8, 12]) g.disc(x, 12, 2.4, 1.6, STONE[1]);
  g.rect(4, 4, 8, 7, '#2e2a2a'); g.rect(4, 4, 2, 7, '#46403c'); g.rect(10, 4, 2, 7, '#1e1a1a');
  g.rect(4, 4, 8, 1, '#5a544e'); g.line(3, 4, 8, 0, IRON[1]); g.line(13, 4, 8, 0, IRON[1]);
  g.rect(12, 6, 3, 1, '#2e2a2a'); g.rect(7, 12, 3, 1, '#1e1a1a');
  return g.outline().rows();
}

function oldBoot() {
  const g = new Grid(16, 10);
  g.rect(3, 1, 5, 7, BROWN[1]); g.rect(3, 1, 1, 7, BROWN[2]); g.rect(7, 1, 1, 7, BROWN[0]);
  g.rect(3, 6, 11, 3, BROWN[1]); g.rect(3, 6, 11, 1, BROWN[2]); g.rect(2, 9, 12, 1, BARK[0]);
  g.disc(14, 7, 1.4, 2, BROWN[1]);
  g.rect(3, 1, 5, 1, BARK[0]); g.set(5, 3, STRAW[1]); g.set(5, 4, STRAW[1]);
  g.set(12, 6, '#1c0f14'); g.set(13, 7, '#1c0f14');
  return g.outline().rows();
}

function markerStone() {
  const g = new Grid(16, 22);
  g.rect(3, 4, 10, 18, STONE[1]); g.rect(3, 4, 3, 18, STONE[2]); g.rect(11, 4, 2, 18, STONE[0]);
  g.disc(8, 4, 5, 2.4, STONE[2]); g.disc(8, 3, 3, 1.2, STONE[3]);
  for (const y of [9, 12, 15]) g.rect(5, y, 6, 1, STONE[0]);
  g.line(7, 17, 9, 19, STONE[0]); g.line(9, 19, 11, 16, STONE[0]);
  g.rect(3, 19, 3, 2, MOSS[1]); g.rect(10, 21, 4, 1, MOSS[1]);
  return g.outline().rows();
}

function cairn() {
  const g = new Grid(16, 18);
  g.disc(8, 15, 6.4, 2.6, STONE[1]); g.disc(8, 11, 4.6, 2.4, STONE[2]); g.disc(8, 7, 3, 2, STONE[1]); g.disc(8, 4, 1.8, 1.4, STONE[3]);
  g.disc(6, 14, 2, 1, STONE[3]); g.disc(10, 10, 1.5, 0.8, STONE[3]);
  g.rect(2, 17, 12, 1, STONE[0]);
  g.rect(7, 2, 1, 4, RAG[1]); g.rect(8, 3, 3, 2, RAG[2]);
  return g.outline().rows();
}

// A bit of fence, going nowhere: two posts, a rail, a gap where the rest was.
function fenceBit() {
  const g = new Grid(32, 20);
  for (const x of [3, 14, 27]) { g.rect(x, 4, 3, 16, BARK[2]); g.rect(x, 4, 1, 16, BARK[3]); g.rect(x + 2, 4, 1, 16, BARK[0]); g.rect(x, 3, 3, 1, BARK[4]); }
  g.rect(3, 7, 14, 2, BARK[3]); g.rect(3, 8, 14, 1, BARK[1]);
  g.rect(3, 13, 12, 2, BARK[3]); g.rect(3, 14, 12, 1, BARK[1]);
  g.line(26, 8, 21, 13, BARK[3]); g.line(26, 9, 21, 14, BARK[1]);
  g.rect(0, 19, 5, 1, MOSS[1]); g.rect(24, 19, 7, 1, MOSS[2]);
  return g.outline().rows();
}

function wheel() {
  const g = new Grid(16, 16);
  g.disc(8, 10, 7, 5.5, BARK[2]); g.disc(8, 10, 5.2, 3.8, null);
  g.disc(8, 10, 7, 5.5, null);
  for (let a = 0; a < 6.28; a += 0.12) { g.set(8 + Math.cos(a) * 7, 10 + Math.sin(a) * 5.5, BARK[2]); g.set(8 + Math.cos(a) * 6, 10 + Math.sin(a) * 4.7, BARK[1]); }
  for (let a = 0; a < 3.14; a += 0.52) g.line(8, 10, 8 + Math.cos(a) * 6, 10 + Math.sin(a) * 4.7, BARK[3]);
  g.disc(8, 10, 1.6, 1.3, IRON[2]);
  g.rect(0, 14, 16, 2, EARTH[1]); g.rect(1, 13, 14, 1, EARTH[2]);
  return g.outline().rows();
}

// A board on a post, with days counted in cuts and the odd rude one.
function tallyBoard() {
  const g = new Grid(16, 28);
  g.rect(7, 12, 3, 16, BARK[2]); g.rect(7, 12, 1, 16, BARK[3]);
  g.rect(1, 2, 14, 11, BARK[3]); g.rect(1, 2, 14, 1, BARK[4]); g.rect(1, 12, 14, 1, BARK[1]);
  for (const x of [3, 5, 7, 9]) g.line(x, 4, x, 8, BARK[0]);
  g.line(2, 5, 10, 7, BARK[0]);
  g.rect(3, 10, 3, 1, BARK[0]); g.set(12, 5, BARK[0]); g.set(12, 7, BARK[0]); g.set(12, 6, BARK[2]);
  g.set(3, 3, IRON[3]); g.set(13, 3, IRON[3]);
  g.rect(3, 27, 4, 1, MOSS[1]);
  return g.outline().rows();
}

function capStump() {
  const g = new Grid(16, 18);
  g.rect(3, 10, 10, 8, BARK[1]); g.rect(3, 10, 2, 8, BARK[2]); g.rect(11, 10, 2, 8, BARK[0]);
  g.disc(8, 10, 5.2, 1.8, BARK[3]);
  g.disc(8, 7, 4.4, 3, MUSTARD[1]); g.rect(3, 9, 11, 1, MUSTARD[0]);
  g.disc(7, 6, 2, 1.2, MUSTARD[2]); g.rect(11, 8, 4, 2, MUSTARD[0]); g.set(8, 3, MUSTARD[0]);
  return g.outline().rows();
}

// A red rag tied on a pole, for where the woodcutters turned back. Four frames of it lifting in the air.
function ragPole(i) {
  const g = new Grid(16, 32);
  g.rect(7, 6, 2, 26, BARK[2]); g.rect(7, 6, 1, 26, BARK[3]); g.rect(8, 6, 1, 26, BARK[1]);
  g.rect(6, 5, 4, 1, BARK[4]);
  g.rect(5, 29, 6, 3, STONE[1]); g.rect(5, 29, 6, 1, STONE[2]);
  const wave = [0, 1, 2, 1][i];
  const dy = [0, 1, 0, -1][i];
  for (let x = 0; x < 7; x++) {
    const y = 6 + dy + Math.round(Math.sin(x * 0.9 + i * 1.6) * (0.8 + wave * 0.4));
    g.rect(9 + x, y, 1, 4 - (x > 4 ? 1 : 0) - (x > 5 ? 1 : 0), x % 3 === 0 ? RAG[2] : RAG[1]);
  }
  g.set(9, 6 + dy, RAG[0]);
  return g.outline().rows();
}

function fingerpost() {
  const g = new Grid(16, 32);
  g.rect(7, 4, 3, 28, BARK[2]); g.rect(7, 4, 1, 28, BARK[3]); g.rect(9, 4, 1, 28, BARK[0]);
  const arrow = (y, dir, c) => {
    const x0 = dir > 0 ? 6 : 0;
    g.rect(x0, y, 10, 4, c); g.rect(x0, y, 10, 1, BARK[4]); g.rect(x0, y + 3, 10, 1, BARK[1]);
    if (dir > 0) { g.set(16 - 1, y + 1, null); g.line(15, y + 1, 15, y + 2, c); } else { g.line(0, y + 1, 0, y + 2, c); }
    g.rect(x0 + 2, y + 1, 5, 1, BARK[0]);
  };
  arrow(6, 1, BARK[3]); arrow(12, -1, BARK[3]); arrow(18, 1, BARK[2]);
  g.rect(5, 30, 7, 2, MOSS[1]);
  return g.outline().rows();
}

// A post with an unlit lantern on its hook.
function lanternStand() {
  const g = new Grid(16, 32);
  g.rect(7, 6, 3, 26, BARK[2]); g.rect(7, 6, 1, 26, BARK[3]); g.rect(9, 6, 1, 26, BARK[0]);
  g.rect(8, 3, 4, 2, IRON[2]); g.rect(11, 3, 3, 1, IRON[2]); g.rect(13, 4, 1, 2, IRON[2]);
  g.rect(11, 6, 5, 6, IRON[1]); g.rect(12, 7, 3, 4, '#c8d0c0' + '99'); g.rect(11, 5, 5, 1, IRON[3]); g.rect(11, 12, 5, 1, IRON[0]);
  g.set(13, 9, '#5a4a30');
  g.rect(5, 30, 7, 2, MOSS[1]);
  return g.outline().rows();
}

function feeder() {
  const g = new Grid(16, 28);
  g.rect(7, 10, 2, 18, BARK[2]); g.rect(7, 10, 1, 18, BARK[3]);
  g.rect(1, 7, 14, 4, BARK[3]); g.rect(1, 7, 14, 1, BARK[4]); g.rect(1, 10, 14, 1, BARK[1]);
  g.rect(3, 2, 10, 5, BARK[2]); g.rect(2, 1, 12, 2, BARK[1]); g.rect(3, 1, 10, 1, BARK[3]);
  g.rect(3, 3, 1, 4, BARK[1]); g.rect(12, 3, 1, 4, BARK[1]);
  for (const x of [4, 6, 9, 11]) g.set(x, 6, STRAW[2]);
  g.rect(5, 27, 6, 1, MOSS[1]);
  return g.outline().rows();
}

function sled() {
  const g = new Grid(32, 18);
  g.rect(2, 13, 28, 2, BARK[1]); g.line(2, 13, 0, 11, BARK[1]); g.line(30, 13, 31, 10, BARK[1]);
  g.rect(2, 14, 28, 1, BARK[0]); g.rect(0, 16, 32, 1, EARTH[1]);
  g.rect(6, 10, 3, 4, BARK[2]); g.rect(22, 10, 3, 4, BARK[2]);
  g.rect(3, 7, 26, 4, BARK[3]); g.rect(3, 7, 26, 1, BARK[4]); g.rect(3, 10, 26, 1, BARK[1]);
  g.rect(8, 2, 18, 5, BARK[2]); g.rect(8, 2, 18, 1, BARK[3]); g.disc(8, 4, 1.4, 2.6, BARK[4]);
  g.line(8, 5, 25, 5, BARK[1]);
  g.line(29, 8, 31, 12, STRAW[1]);
  return g.outline().rows();
}

// ---------------------------------------------------------------------------------------------
// HOLLIN: what's left out of doors

function rocker() {
  const g = new Grid(16, 22);
  g.rect(3, 2, 2, 12, WEATHER[2]); g.rect(11, 2, 2, 12, WEATHER[2]); g.rect(3, 3, 10, 2, WEATHER[3]); g.rect(4, 6, 8, 1, WEATHER[2]); g.rect(4, 9, 8, 1, WEATHER[2]);
  g.rect(3, 13, 10, 3, WEATHER[3]); g.rect(3, 13, 10, 1, WEATHER[4]);
  g.rect(3, 16, 2, 3, WEATHER[1]); g.rect(11, 16, 2, 3, WEATHER[1]);
  g.line(1, 20, 14, 20, WEATHER[3]); g.line(2, 21, 13, 21, WEATHER[1]); g.set(0, 19, WEATHER[3]); g.set(15, 19, WEATHER[3]);
  g.rect(5, 12, 6, 1, RAG[1]); g.set(6, 11, RAG[2]);
  g.rect(8, 7, 1, 1, '#1c0f14');
  return g.outline().rows();
}

function washtub() {
  const g = new Grid(16, 16);
  g.rect(1, 6, 14, 9, WEATHER[3]); g.rect(1, 6, 14, 2, WEATHER[4]); g.rect(1, 13, 14, 2, WEATHER[1]);
  for (const x of [4, 8, 12]) g.line(x, 7, x, 14, WEATHER[1]);
  g.rect(1, 9, 14, 1, IRON[1]); g.rect(1, 12, 14, 1, IRON[1]);
  g.disc(8, 6, 6.4, 1.6, WATER[0]); g.disc(8, 6, 5, 1, WATER[1]);
  g.rect(3, 1, 2, 5, BARK[3]); g.rect(3, 1, 2, 1, BARK[4]);
  g.rect(10, 2, 3, 3, RAG[1]); g.set(11, 3, RAG[2]);
  return g.outline().rows();
}

function pegBasket() {
  const g = new Grid(16, 12);
  g.disc(8, 8, 7, 3.6, STRAW[1]); g.disc(8, 6, 6, 2, STRAW[2]);
  for (let x = 2; x < 14; x += 2) g.line(x, 6, x + 1, 11, STRAW[0]);
  g.rect(2, 8, 12, 1, STRAW[0]);
  g.rect(4, 3, 2, 3, BARK[3]); g.rect(7, 2, 2, 4, BARK[3]); g.rect(10, 3, 2, 3, BARK[3]); g.set(5, 3, BARK[4]); g.set(8, 2, BARK[4]);
  g.rect(11, 5, 4, 2, BLUE[1]);
  return g.outline().rows();
}

function boots() {
  const g = new Grid(16, 10);
  for (const x of [1, 8]) {
    g.rect(x + 1, 1, 4, 6, BROWN[1]); g.rect(x + 1, 1, 1, 6, BROWN[2]);
    g.rect(x, 6, 7, 3, BROWN[1]); g.rect(x, 6, 7, 1, BROWN[2]); g.rect(x - 1, 9, 8, 1, BARK[0]);
    g.rect(x + 1, 1, 4, 1, BARK[0]); g.set(x + 3, 3, STRAW[1]); g.set(x + 3, 5, STRAW[1]);
  }
  g.line(9, 4, 12, 3, BARK[3]);
  return g.outline().rows();
}

function mat() {
  const g = new Grid(16, 8);
  g.rect(1, 1, 14, 6, STRAW[0]); g.rect(1, 1, 14, 1, STRAW[1]);
  for (let x = 2; x < 15; x += 2) g.line(x, 2, x, 6, STRAW[1]);
  g.rect(5, 3, 6, 2, RAG[0]); g.set(6, 3, STRAW[2]);
  g.set(0, 0, null); g.rect(1, 6, 14, 1, BARK[1]);
  for (const [x, y] of [[3, 4], [12, 5], [8, 2]]) g.set(x, y, RED[2]);
  return g.rows();
}

// Pots by a door: this one dried to stalks.
function potDead() {
  const g = new Grid(16, 18);
  g.rect(4, 10, 8, 8, '#9a5a3a'); g.rect(4, 10, 2, 8, '#b87a52'); g.rect(10, 10, 2, 8, '#6a3a26'); g.rect(3, 9, 10, 2, '#b87a52'); g.rect(3, 9, 10, 1, '#d09a6c');
  g.rect(5, 17, 6, 1, '#4a2a1c');
  blades(g, 8, 9, 6, 8, [STRAW[0], WEATHER[3], WEATHER[2]], 2.2);
  g.set(5, 3, WEATHER[4]); g.set(11, 4, WEATHER[4]);
  return g.outline().rows();
}

// ...and this one, fifty years on, still flowering: somebody forgot to tell it.
function potWild() {
  const g = new Grid(16, 22);
  g.rect(4, 14, 8, 8, '#9a5a3a'); g.rect(4, 14, 2, 8, '#b87a52'); g.rect(10, 14, 2, 8, '#6a3a26'); g.rect(3, 13, 10, 2, '#b87a52'); g.rect(3, 13, 10, 1, '#d09a6c');
  g.rect(5, 21, 6, 1, '#4a2a1c');
  g.disc(8, 10, 6.5, 3.5, MOSS[1]); g.disc(6, 9, 3, 2, MOSS[2]);
  for (const [x, y] of [[4, 6], [8, 3], [12, 7], [6, 9], [10, 10], [13, 12]]) {
    g.disc(x, y, 1.8, 1.8, '#d8302a'); g.set(x, y, '#ff7a5a'); g.set(x - 1, y - 1, '#ff9a7a');
    g.line(x, y + 2, 8, 12, MOSS[0]);
  }
  g.rect(2, 12, 3, 1, MOSS[2]); g.rect(11, 12, 3, 2, MOSS[1]);
  return g.outline().rows();
}

function churn() {
  const g = new Grid(16, 22);
  g.rect(4, 6, 8, 15, WEATHER[3]); g.rect(4, 6, 2, 15, WEATHER[4]); g.rect(10, 6, 2, 15, WEATHER[1]);
  g.rect(4, 9, 8, 1, IRON[1]); g.rect(4, 15, 8, 1, IRON[1]);
  g.rect(3, 5, 10, 2, WEATHER[2]); g.rect(7, 0, 2, 6, BARK[3]); g.rect(7, 0, 2, 1, BARK[4]);
  g.rect(5, 21, 6, 1, WEATHER[0]);
  return g.outline().rows();
}

function bucket() {
  const g = new Grid(16, 14);
  g.rect(3, 5, 10, 8, WEATHER[3]); g.rect(3, 5, 2, 8, WEATHER[4]); g.rect(11, 5, 2, 8, WEATHER[1]);
  g.rect(3, 8, 10, 1, IRON[1]); g.rect(3, 11, 10, 1, IRON[1]);
  g.line(3, 4, 3, 1, IRON[2]); g.line(13, 4, 13, 1, IRON[2]); g.line(3, 1, 13, 1, IRON[2]); g.line(4, 0, 12, 0, IRON[2]);
  g.disc(8, 5, 4.6, 1.2, '#1a2230');
  return g.outline().rows();
}

function woodLean() {
  const g = new Grid(32, 24);
  for (let i = 0; i < 9; i++) {
    const x = 2 + i * 3;
    g.rect(x, 2 + (i % 3), 3, 22 - (i % 3), i % 2 ? WEATHER[2] : WEATHER[3]);
    g.rect(x, 2 + (i % 3), 1, 22 - (i % 3), WEATHER[4]);
  }
  g.rect(0, 22, 32, 2, EARTH[1]);
  g.rect(4, 8, 24, 1, BARK[0]); g.rect(4, 15, 24, 1, BARK[0]);
  g.rect(2, 0, 28, 2, BARK[2]);
  g.rect(14, 4, 3, 1, MOSS[1]); g.rect(24, 10, 4, 2, MOSS[1]);
  return g.outline().rows();
}

function blockAxe() {
  const g = new Grid(16, 18);
  g.rect(3, 9, 10, 9, WEATHER[2]); g.rect(3, 9, 2, 9, WEATHER[3]); g.rect(11, 9, 2, 9, WEATHER[1]);
  g.disc(8, 9, 5.2, 1.8, WEATHER[4]); g.line(5, 9, 11, 9, WEATHER[1]); g.line(7, 8, 9, 10, WEATHER[0]);
  g.line(11, 8, 14, 0, BARK[3]); g.line(12, 8, 15, 0, BARK[2]);
  g.rect(7, 0, 7, 4, IRON[2]); g.rect(7, 0, 7, 1, IRON[3]); g.rect(7, 3, 7, 1, IRON[1]);
  return g.outline().rows();
}

function coop() {
  const g = new Grid(32, 26);
  g.rect(2, 10, 28, 14, WEATHER[2]); g.rect(2, 10, 28, 2, WEATHER[3]); g.rect(2, 22, 28, 2, WEATHER[1]);
  for (let x = 6; x < 29; x += 4) g.line(x, 12, x, 22, WEATHER[1]);
  g.line(0, 10, 16, 1, WEATHER[1]); g.line(32, 10, 16, 1, WEATHER[1]);
  for (let y = 2; y < 10; y++) { const w = Math.round((y - 1) * 1.8); g.rect(16 - w, y, w * 2, 1, y % 2 ? '#6a4038' : '#7a4a40'); }
  g.rect(13, 14, 8, 9, '#0a0406'); g.rect(12, 13, 10, 1, WEATHER[4]); g.rect(12, 14, 1, 9, WEATHER[4]); g.rect(21, 14, 1, 9, WEATHER[4]);
  g.line(15, 23, 11, 25, WEATHER[3]); g.line(17, 23, 21, 25, WEATHER[3]); g.rect(11, 25, 11, 1, WEATHER[3]);
  g.rect(22, 18, 4, 3, STRAW[1]); g.set(24, 17, STRAW[2]);
  g.set(5, 25, BONE[2]); g.set(27, 25, BONE[2]); g.set(8, 24, BONE[1]);
  return g.outline().rows();
}

function kennel() {
  const g = new Grid(32, 22);
  g.rect(3, 8, 26, 12, WEATHER[2]); g.rect(3, 8, 26, 2, WEATHER[3]);
  for (let x = 7; x < 28; x += 4) g.line(x, 9, x, 19, WEATHER[1]);
  g.line(1, 8, 16, 0, WEATHER[1]); g.line(31, 8, 16, 0, WEATHER[1]);
  for (let y = 1; y < 8; y++) { const w = Math.round(y * 2); g.rect(16 - w, y, w * 2, 1, y % 2 ? '#5a3a30' : '#6a4638'); }
  g.disc(16, 16, 5, 5, '#0a0406'); g.rect(11, 16, 11, 4, '#0a0406');
  g.rect(2, 20, 28, 1, WEATHER[0]);
  g.rect(24, 17, 5, 3, STONE[1]); g.rect(24, 17, 5, 1, STONE[3]); g.rect(25, 17, 3, 1, '#2a2622');
  g.line(10, 20, 4, 21, IRON[2]);
  g.rect(13, 4, 6, 3, WEATHER[4]); g.set(14, 5, WEATHER[0]); g.set(16, 5, WEATHER[0]); g.set(18, 5, WEATHER[0]);
  return g.outline().rows();
}

function cradle() {
  const g = new Grid(16, 16);
  g.rect(2, 6, 12, 7, BARK[3]); g.rect(2, 6, 12, 1, BARK[4]); g.rect(2, 12, 12, 1, BARK[1]);
  g.rect(3, 3, 10, 4, BARK[2]); g.rect(1, 2, 2, 9, BARK[3]); g.rect(13, 3, 2, 8, BARK[3]);
  g.rect(3, 4, 10, 3, '#dcd0c0'); g.rect(3, 4, 10, 1, '#f0e8d8'); g.rect(4, 7, 8, 1, '#a89c8c');
  g.disc(8, 5, 2, 1, '#f4ecd8');
  g.line(1, 14, 14, 14, BARK[2]); g.line(3, 15, 12, 15, BARK[1]);
  return g.outline().rows();
}

// A swing from a stout branch, moving a little in no wind at all.
function swing(i) {
  const g = new Grid(32, 40);
  g.rect(3, 0, 8, 40, BARK[1]); g.rect(3, 0, 2, 40, BARK[2]); g.rect(9, 0, 2, 40, BARK[0]);
  g.line(1, 39, 3, 36, BARK[1]); g.line(12, 39, 11, 36, BARK[1]);
  g.rect(8, 3, 22, 3, BARK[2]); g.rect(8, 3, 22, 1, BARK[3]); g.rect(8, 5, 22, 1, BARK[0]);
  g.rect(27, 6, 3, 1, MOSS[1]);
  const a = [-0.14, 0, 0.14, 0][i % 4] + (i === 3 ? 0 : 0);
  const sway = [-1.5, 0, 1.5, 0][i];
  const swing3 = (rx) => {
    const x = 20 + rx;
    const top = 6;
    const bot = 30;
    const dx = sway * (rx < 0 ? 1 : 1);
    g.line(x, top, x + dx, bot, STRAW[0]);
  };
  swing3(-4); swing3(4);
  g.rect(15 + sway, 30, 11, 2, BARK[3]); g.rect(15 + sway, 30, 11, 1, BARK[4]); g.rect(15 + sway, 32, 11, 1, BARK[0]);
  g.disc(20 + sway, 38, 4, 1, EARTH[2]);
  g.rect(8, 38, 5, 2, EARTH[1]);
  return g.outline().rows();
}

function toyHorse() {
  const g = new Grid(16, 22);
  g.line(1, 20, 14, 20, WEATHER[3]); g.line(2, 21, 13, 21, WEATHER[1]);
  g.rect(3, 15, 2, 5, WEATHER[2]); g.rect(11, 15, 2, 5, WEATHER[2]);
  g.rect(3, 9, 10, 6, WEATHER[3]); g.rect(3, 9, 10, 1, WEATHER[4]); g.rect(3, 14, 10, 1, WEATHER[1]);
  g.rect(10, 3, 4, 7, WEATHER[3]); g.rect(11, 1, 5, 4, WEATHER[3]); g.rect(15, 3, 1, 2, WEATHER[1]);
  g.rect(9, 3, 2, 6, RAG[1]); g.set(12, 2, '#1c0f14'); g.rect(1, 9, 2, 5, RAG[1]);
  g.rect(8, 7, 1, 3, IRON[2]);
  return g.outline().rows();
}

function marbles() {
  const g = new Grid(16, 6);
  for (const [x, y, c] of [[3, 3, BLUE[2]], [6, 2, RED[2]], [9, 4, MUSTARD[2]], [12, 2, MOSS[3]], [5, 4, '#e8e8f0'], [11, 4, BLUE[1]]]) { g.disc(x, y, 1, 1, c); g.set(x, y - 1, '#ffffff'); }
  g.set(1, 2, STONE[3]); g.set(14, 4, STONE[3]);
  return g.rows();
}

function hoop() {
  const g = new Grid(16, 20);
  g.disc(8, 11, 6.4, 7.6, null);
  for (let a = 0; a < 6.28; a += 0.1) { g.set(8 + Math.cos(a) * 6.4, 11 + Math.sin(a) * 7.6, WEATHER[3]); g.set(8 + Math.cos(a) * 5.4, 11 + Math.sin(a) * 6.6, WEATHER[2]); }
  g.line(13, 19, 15, 6, BARK[3]); g.line(14, 19, 16, 6, BARK[2]);
  g.rect(3, 19, 10, 1, EARTH[1]);
  return g.outline().rows();
}

function doll() {
  const g = new Grid(16, 12);
  g.rect(4, 5, 8, 5, BLUE[1]); g.rect(4, 5, 8, 1, BLUE[2]); g.rect(2, 6, 3, 2, '#dcc0a0'); g.rect(11, 6, 3, 2, '#dcc0a0');
  g.rect(5, 10, 2, 2, '#dcc0a0'); g.rect(9, 10, 2, 2, '#dcc0a0');
  g.disc(8, 3, 3, 2.8, '#dcc0a0'); g.rect(5, 0, 6, 2, BARK[2]); g.set(7, 3, '#1c0f14'); g.set(9, 3, '#1c0f14'); g.set(8, 4, RAG[1]);
  return g.outline().rows();
}

function tableSet() {
  const g = new Grid(32, 22);
  g.rect(1, 8, 30, 3, WEATHER[3]); g.rect(1, 8, 30, 1, WEATHER[4]); g.rect(1, 10, 30, 1, WEATHER[1]);
  for (const x of [3, 27]) g.rect(x, 11, 3, 10, WEATHER[2]);
  g.rect(3, 20, 3, 1, WEATHER[0]); g.rect(27, 20, 3, 1, WEATHER[0]);
  for (const x of [5, 14, 23]) { g.rect(x, 5, 5, 4, STONE[2]); g.rect(x, 5, 5, 1, STONE[3]); g.rect(x + 1, 6, 3, 1, '#4a3a2a'); }
  g.rect(12, 2, 8, 6, WEATHER[4]); g.rect(12, 2, 8, 1, BONE[2]); g.rect(19, 3, 3, 3, WEATHER[4]);
  g.rect(14, 4, 4, 1, '#4a3a2a');
  g.rect(0, 9, 3, 3, RAG[1]); g.rect(29, 9, 3, 2, RAG[1]);
  return g.outline().rows();
}

function stools() {
  const g = new Grid(16, 14);
  for (const [x, h] of [[2, 0], [9, 3]]) {
    g.rect(x, 4 + h, 6, 2, WEATHER[3]); g.rect(x, 4 + h, 6, 1, WEATHER[4]);
    g.rect(x + 1, 6 + h, 1, 7 - h, WEATHER[1]); g.rect(x + 4, 6 + h, 1, 7 - h, WEATHER[1]);
  }
  g.line(10, 8, 13, 10, WEATHER[1]);
  return g.outline().rows();
}

function barrelRain() {
  const g = new Grid(16, 22);
  g.rect(3, 6, 10, 15, WEATHER[3]); g.rect(3, 6, 2, 15, WEATHER[4]); g.rect(11, 6, 2, 15, WEATHER[1]); g.rect(7, 6, 1, 15, WEATHER[2]);
  g.rect(3, 9, 10, 1, IRON[1]); g.rect(3, 16, 10, 1, IRON[1]);
  g.disc(8, 6, 5.4, 1.6, WEATHER[2]); g.disc(8, 6, 4.2, 1, WATER[1]); g.set(6, 6, WATER[2]); g.set(10, 6, RED[2]);
  g.line(14, 4, 13, 2, '#e8f0f4'); g.rect(3, 20, 10, 1, WEATHER[0]);
  g.rect(5, 12, 1, 8, WATER[1] + '88');
  return g.outline().rows();
}

function scythePost() {
  const g = new Grid(16, 32);
  g.rect(3, 6, 3, 26, WEATHER[2]); g.rect(3, 6, 1, 26, WEATHER[3]); g.rect(5, 6, 1, 26, WEATHER[0]);
  g.rect(5, 12, 4, 2, IRON[2]);
  g.line(8, 13, 8, 28, BARK[3]); g.line(9, 13, 9, 28, BARK[2]);
  g.line(8, 13, 14, 3, IRON[2]); g.line(8, 14, 14, 4, IRON[3]); g.line(14, 3, 15, 5, IRON[2]);
  g.rect(8, 20, 3, 2, BARK[4]);
  g.rect(2, 30, 6, 2, MOSS[1]);
  return g.outline().rows();
}

function skeps() {
  const g = new Grid(32, 20);
  g.rect(1, 10, 30, 3, WEATHER[3]); g.rect(1, 10, 30, 1, WEATHER[4]);
  g.rect(3, 13, 2, 6, WEATHER[1]); g.rect(27, 13, 2, 6, WEATHER[1]);
  for (const x of [8, 16, 24]) {
    g.disc(x, 7, 5, 5.4, STRAW[1]); g.disc(x - 1, 5, 3, 3, STRAW[2]);
    for (const y of [3, 6, 9]) g.rect(x - 5, y, 10, 1, STRAW[0]);
    g.rect(x - 1, 9, 3, 2, '#1c0f14');
  }
  g.rect(15, 0, 3, 1, '#1c0f14');
  return g.outline().rows();
}

function cabbages() {
  const g = new Grid(32, 14);
  for (const [x, y, s] of [[5, 10, 1], [12, 9, 1.2], [20, 10, 1], [27, 9, 1.1]]) {
    g.disc(x, y, 4 * s, 3 * s, MOSS[1]); g.disc(x - 1, y - 1, 2.6 * s, 1.8 * s, MOSS[2]);
    g.line(x, y - 3 * s, x, y - 7 * s, MOSS[2]); g.disc(x, y - 7 * s, 0.8, 0.8, '#e0c850'); g.set(x + 1, y - 6 * s, '#e0c850');
    g.line(x - 3, y, x + 3, y + 1, MOSS[0]);
  }
  g.rect(0, 12, 32, 2, EARTH[1]);
  return g.outline().rows();
}

function beanPoles() {
  const g = new Grid(16, 30);
  for (const x of [3, 8, 13]) g.line(x, 29, 8, 2, BARK[2]);
  g.line(3, 29, 8, 2, BARK[3]); g.line(13, 29, 8, 2, BARK[1]);
  for (let y = 6; y < 26; y += 3) { g.set(8 - (26 - y) * 0.2 + ((y % 2) ? 1 : -1), y, STRAW[0]); g.set(8 + ((y % 2) ? -1 : 1), y + 1, WEATHER[3]); }
  g.rect(4, 28, 9, 2, EARTH[1]);
  g.rect(6, 12, 1, 3, STRAW[1]); g.rect(10, 16, 1, 3, STRAW[1]);
  return g.outline().rows();
}

function trough() {
  const g = new Grid(32, 14);
  g.rect(1, 5, 30, 8, WEATHER[3]); g.rect(1, 5, 30, 1, WEATHER[4]); g.rect(1, 12, 30, 1, WEATHER[0]);
  g.rect(3, 6, 26, 4, '#1a2230'); g.rect(4, 7, 24, 2, WATER[0]); g.rect(7, 7, 6, 1, WATER[1]);
  g.rect(4, 12, 2, 2, WEATHER[1]); g.rect(26, 12, 2, 2, WEATHER[1]);
  for (const [x, y] of [[10, 7], [18, 8], [22, 7]]) g.rect(x, y, 2, 1, RED[2]);
  return g.outline().rows();
}

function noticePost() {
  const g = new Grid(16, 28);
  g.rect(7, 12, 3, 16, WEATHER[2]); g.rect(7, 12, 1, 16, WEATHER[3]);
  g.rect(1, 2, 14, 11, WEATHER[3]); g.rect(1, 2, 14, 1, WEATHER[4]); g.rect(1, 12, 14, 1, WEATHER[1]);
  g.rect(2, 3, 6, 5, '#d8ccb0'); g.rect(2, 3, 6, 1, '#f0e6cc'); g.rect(3, 5, 4, 1, '#8a806a'); g.rect(3, 6, 3, 1, '#8a806a');
  g.rect(9, 5, 5, 6, '#c8bca0'); g.line(9, 5, 11, 7, '#a89c84'); g.rect(10, 8, 3, 1, '#8a806a');
  g.set(5, 3, IRON[3]); g.set(11, 5, IRON[3]);
  g.rect(4, 27, 4, 1, MOSS[1]);
  return g.outline().rows();
}

// A maypole in the middle of the green's old cobbles, ribbons faded to nothing much.
function maypole() {
  const g = new Grid(16, 52);
  g.rect(7, 4, 3, 48, WEATHER[3]); g.rect(7, 4, 1, 48, WEATHER[4]); g.rect(9, 4, 1, 48, WEATHER[1]);
  g.rect(5, 2, 7, 3, WEATHER[4]); g.rect(6, 0, 5, 2, RAG[1]); g.set(8, 0, RAG[2]);
  const cols = [RAG[1], BLUE[1], MUSTARD[1], MOSS[2]];
  cols.forEach((c, k) => {
    const x0 = 8;
    for (let y = 4; y < 38 + k * 3; y++) g.set(x0 + Math.round(Math.sin(y * 0.35 + k * 1.6) * (3 + (y - 4) * 0.08)), y, y % 5 === k ? WEATHER[3] : c);
  });
  g.rect(4, 49, 9, 3, WEATHER[1]); g.rect(4, 49, 9, 1, WEATHER[2]);
  g.line(6, 38, 2, 51, RAG[0]);
  return g.outline().rows();
}

function coatPost() {
  const g = new Grid(16, 32);
  g.rect(2, 6, 3, 26, WEATHER[2]); g.rect(2, 6, 1, 26, WEATHER[3]);
  g.rect(4, 9, 5, 2, WEATHER[3]);
  g.rect(7, 9, 7, 4, '#5a5a68'); g.rect(6, 11, 9, 16, '#5a5a68'); g.rect(6, 11, 2, 16, '#767686'); g.rect(13, 11, 2, 16, '#3e3e4c');
  g.line(10, 13, 10, 26, '#3e3e4c'); g.rect(9, 15, 2, 1, MUSTARD[1]); g.rect(9, 19, 2, 1, MUSTARD[1]);
  g.rect(14, 12, 2, 10, '#5a5a68'); g.rect(5, 26, 4, 3, '#3e3e4c');
  g.rect(1, 30, 6, 2, MOSS[1]);
  return g.outline().rows();
}

function streetLamp() {
  const g = new Grid(16, 36);
  g.rect(7, 10, 2, 26, IRON[1]); g.rect(7, 10, 1, 26, IRON[2]);
  g.rect(5, 34, 6, 2, IRON[1]); g.rect(6, 31, 4, 3, IRON[1]);
  g.rect(4, 3, 8, 8, IRON[1]); g.rect(5, 4, 6, 6, '#8a9488' + '88'); g.rect(4, 2, 8, 1, IRON[3]); g.rect(6, 0, 4, 2, IRON[2]); g.rect(4, 11, 8, 1, IRON[0]);
  g.line(6, 5, 9, 9, '#c8d0c4' + '88'); g.set(8, 8, '#4a3a22');
  g.rect(12, 14, 3, 1, IRON[2]);
  g.rect(3, 33, 3, 1, MOSS[1]);
  return g.outline().rows();
}

function hopscotch() {
  const g = new Grid(16, 32);
  const c = '#e8e4d8' + 'bb';
  const sq = (x, y, w, h) => { g.rect(x, y, w, 1, c); g.rect(x, y + h - 1, w, 1, c); g.rect(x, y, 1, h, c); g.rect(x + w - 1, y, 1, h, c); };
  sq(5, 26, 6, 5); sq(5, 21, 6, 5); sq(2, 16, 6, 5); sq(8, 16, 6, 5); sq(5, 11, 6, 5); sq(2, 6, 6, 5); sq(8, 6, 6, 5); sq(4, 1, 8, 5);
  g.set(7, 28, '#e8e4d8'); g.set(8, 28, '#e8e4d8'); g.set(8, 23, '#e8e4d8');
  g.set(11, 8, '#e8e4d8'); g.set(4, 18, '#e8e4d8');
  return g.rows();
}

function chalkAxeman() {
  const g = new Grid(16, 16);
  const c = '#e8e4d8' + 'cc';
  g.disc(6, 3, 2, 2, c); g.line(6, 5, 6, 11, c); g.line(6, 7, 2, 9, c); g.line(6, 7, 11, 4, c);
  g.line(6, 11, 4, 15, c); g.line(6, 11, 9, 15, c);
  g.line(11, 4, 12, 0, c); g.rect(11, 0, 3, 2, c);
  g.set(5, 3, '#1c0f14'); g.set(7, 3, '#1c0f14');
  return g.rows();
}

function pieBench() {
  const g = new Grid(16, 18);
  g.rect(1, 10, 14, 3, WEATHER[3]); g.rect(1, 10, 14, 1, WEATHER[4]); g.rect(2, 13, 2, 5, WEATHER[1]); g.rect(12, 13, 2, 5, WEATHER[1]);
  g.disc(8, 8, 5.4, 2.6, '#b88a4a'); g.disc(8, 7, 4.4, 1.6, '#d8a85c'); g.disc(8, 6, 2, 0.8, '#e8c07a');
  for (let a = 0; a < 6.28; a += 0.8) g.set(8 + Math.cos(a) * 4.6, 7.6 + Math.sin(a) * 2, '#8a5e2a');
  g.set(7, 5, '#5a3a1a'); g.line(6, 7, 10, 7, '#8a5e2a');
  return g.outline().rows();
}

function musicBox() {
  const g = new Grid(16, 18);
  g.rect(4, 12, 2, 6, WEATHER[1]); g.rect(10, 12, 2, 6, WEATHER[1]);
  g.rect(2, 10, 12, 3, WEATHER[3]); g.rect(2, 10, 12, 1, WEATHER[4]);
  g.rect(3, 4, 10, 6, '#7a3a30'); g.rect(3, 4, 10, 1, '#a85a48'); g.rect(3, 9, 10, 1, '#4a2018');
  g.rect(2, 2, 12, 3, '#8a4438'); g.rect(2, 2, 12, 1, '#b8685a');
  g.rect(6, 6, 4, 2, MUSTARD[1]); g.rect(7, 6, 2, 1, MUSTARD[2]);
  g.rect(13, 6, 3, 1, MUSTARD[1]); g.set(15, 5, MUSTARD[2]);
  return g.outline().rows();
}

function sackPile() {
  const g = new Grid(16, 16);
  g.disc(5, 11, 5, 5, STRAW[1]); g.disc(11, 12, 4.4, 4, STRAW[0]); g.disc(8, 6, 4.4, 4, STRAW[2]);
  g.rect(3, 6, 4, 2, STRAW[0]); g.line(7, 4, 9, 4, STRAW[0]); g.line(8, 2, 8, 3, STRAW[0]);
  g.set(4, 12, STRAW[0]); g.set(12, 12, STRAW[1]); g.rect(1, 15, 14, 1, EARTH[1]);
  g.line(10, 15, 14, 14, '#ece4cc'); g.rect(13, 13, 2, 2, '#ece4cc');
  return g.outline().rows();
}

function millstone() {
  const g = new Grid(32, 22);
  g.disc(16, 11, 12, 10, STONE[2]); g.disc(16, 11, 9, 8, STONE[1]);
  g.disc(16, 11, 2.6, 2.2, '#1c1620');
  for (let a = 0; a < 6.28; a += 0.5) g.line(16 + Math.cos(a) * 3.5, 11 + Math.sin(a) * 3, 16 + Math.cos(a + 0.4) * 9, 11 + Math.sin(a + 0.4) * 7.5, STONE[0]);
  g.rect(3, 19, 26, 3, EARTH[1]);
  g.disc(8, 4, 3, 1.4, MOSS[1]); g.disc(26, 18, 3, 1.4, MOSS[1]);
  return g.outline().rows();
}

function flourBarrel() {
  const g = new Grid(16, 20);
  g.rect(3, 4, 10, 16, WEATHER[3]); g.rect(3, 4, 2, 16, WEATHER[4]); g.rect(11, 4, 2, 16, WEATHER[1]);
  g.rect(3, 8, 10, 1, IRON[1]); g.rect(3, 15, 10, 1, IRON[1]);
  g.disc(8, 4, 5.4, 1.6, '#e8e0cc'); g.disc(8, 4, 3.6, 0.8, '#f8f4ea');
  g.rect(12, 6, 3, 6, '#e8e0cc' + 'aa'); g.rect(13, 12, 2, 3, '#e8e0cc' + 'aa');
  g.line(5, 3, 6, 3, '#1c0f14');
  return g.outline().rows();
}

function grindstone() {
  const g = new Grid(16, 22);
  g.rect(1, 18, 14, 3, WEATHER[2]); g.rect(2, 12, 2, 7, WEATHER[2]); g.rect(12, 12, 2, 7, WEATHER[2]);
  g.disc(8, 11, 6, 6.4, STONE[2]); g.disc(8, 11, 4.4, 4.8, STONE[1]); g.disc(8, 11, 1.4, 1.4, IRON[1]);
  g.line(8, 11, 14, 8, BARK[3]); g.rect(14, 6, 2, 3, BARK[3]);
  g.rect(3, 20, 3, 1, MOSS[1]);
  g.set(5, 8, STONE[3]); g.set(11, 14, STONE[3]);
  return g.outline().rows();
}

function eelTrap() {
  const g = new Grid(16, 14);
  g.disc(7, 8, 6, 4.4, STRAW[1]); g.rect(1, 5, 12, 6, STRAW[1]);
  for (let x = 2; x < 13; x += 2) g.line(x, 4, x, 11, STRAW[0]);
  for (const y of [5, 8, 11]) g.rect(1, y, 12, 1, STRAW[0]);
  g.disc(14, 8, 1.5, 3, STRAW[2]); g.rect(13, 7, 2, 2, '#1c0f14');
  g.line(14, 4, 11, 1, STRAW[0]);
  g.set(5, 6, STRAW[2]); g.set(9, 7, STRAW[2]);
  return g.outline().rows();
}

function planks() {
  const g = new Grid(32, 12);
  g.rect(1, 6, 28, 3, WEATHER[3]); g.rect(1, 6, 28, 1, WEATHER[4]);
  g.rect(3, 3, 24, 3, WEATHER[2]); g.rect(3, 3, 24, 1, WEATHER[3]);
  g.rect(8, 9, 22, 2, WEATHER[2]); g.line(4, 4, 6, 5, WEATHER[0]); g.line(20, 7, 22, 8, WEATHER[0]);
  g.set(26, 4, IRON[2]); g.set(5, 7, IRON[2]);
  return g.outline().rows();
}

function post() {
  const g = new Grid(16, 26);
  g.rect(6, 6, 4, 20, WEATHER[2]); g.rect(6, 6, 1, 20, WEATHER[3]); g.rect(9, 6, 1, 20, WEATHER[0]);
  g.rect(5, 5, 6, 2, WEATHER[3]); g.rect(7, 3, 3, 2, WEATHER[4]);
  g.rect(3, 25, 4, 1, MOSS[1]); g.rect(10, 25, 3, 1, RED[1]);
  g.line(10, 12, 12, 14, IRON[2]);
  return g.outline().rows();
}

// A ladder against a cottage wall: both feet in the leaves, the top rung gone.
function ladder() {
  const g = new Grid(16, 36);
  g.line(4, 35, 6, 1, WEATHER[3]); g.line(5, 35, 7, 1, WEATHER[2]); g.line(12, 35, 14, 1, WEATHER[3]); g.line(13, 35, 15, 1, WEATHER[2]);
  for (let y = 6; y < 34; y += 5) { const k = (35 - y) / 34; g.rect(4 + k * 2 * 0 + (6 - (y - 1) * 0.06), y, 9, 1, WEATHER[4]); g.rect(4 + (6 - (y - 1) * 0.06), y + 1, 9, 1, WEATHER[1]); }
  g.rect(1, 34, 6, 2, RED[1]); g.rect(11, 34, 4, 2, RED[2]);
  return g.outline().rows();
}

function bundle() {
  const g = new Grid(16, 12);
  g.disc(8, 7, 6, 4, '#7a6a56'); g.disc(7, 6, 4, 2.4, '#a08a6e');
  g.line(2, 8, 14, 8, BARK[1]); g.line(8, 3, 8, 11, BARK[1]);
  g.rect(7, 1, 3, 3, '#7a6a56'); g.rect(8, 1, 1, 1, '#a08a6e');
  g.rect(12, 6, 3, 2, MUSTARD[1]);
  return g.outline().rows();
}

function wheelbarrow() {
  const g = new Grid(32, 18);
  g.rect(8, 5, 18, 7, WEATHER[3]); g.rect(8, 5, 18, 1, WEATHER[4]); g.rect(9, 11, 16, 1, WEATHER[1]);
  g.line(8, 8, 1, 12, WEATHER[2]); g.line(8, 9, 1, 13, WEATHER[1]);
  g.rect(24, 12, 2, 5, WEATHER[1]); g.rect(10, 12, 2, 5, WEATHER[1]);
  g.disc(27, 13, 3.4, 3.4, IRON[2]); g.disc(27, 13, 1.4, 1.4, IRON[3]);
  for (const [x, y, c] of [[12, 3, RED[2]], [16, 2, RED[3]], [20, 3, RED[1]], [14, 4, RED[4]], [22, 4, RED[2]]]) { g.rect(x, y, 3, 2, c); }
  g.rect(15, 0, 1, 2, MOSS[2]); g.rect(18, 1, 2, 1, MOSS[2]);
  g.rect(0, 17, 32, 1, EARTH[1]);
  return g.outline().rows();
}

// A kettle on a hob of three stones outside a door, long cold.
function kettleStones() {
  const g = new Grid(16, 14);
  g.disc(8, 12, 7, 2, '#2a2020');
  for (const x of [3, 8, 13]) g.disc(x, 11, 2.4, 2, STONE[1]);
  g.disc(8, 7, 4.6, 3.4, '#3a3834'); g.disc(7, 6, 2.6, 1.8, '#56524c'); g.rect(4, 9, 9, 1, '#26231f');
  g.rect(7, 2, 3, 2, '#3a3834'); g.rect(11, 6, 4, 1, '#3a3834'); g.set(14, 5, '#3a3834');
  g.line(3, 4, 8, 1, IRON[1]); g.line(13, 4, 8, 1, IRON[1]);
  return g.outline().rows();
}

// ---------------------------------------------------------------------------------------------
// INDOORS (the stores, the stockroom, the lookout, the well)

function tinStack() {
  const g = new Grid(16, 16);
  for (const [x, y, w, c] of [[2, 11, 6, '#8a5a4a'], [9, 11, 5, '#5a7a8a'], [3, 6, 5, '#7a8a4a'], [9, 6, 5, '#8a5a4a'], [6, 1, 5, '#a89a5a']]) {
    g.rect(x, y, w, 5, c); g.rect(x, y, w, 1, '#d8d0c0'); g.rect(x, y + 4, w, 1, '#2a2622'); g.rect(x + 1, y + 2, w - 2, 1, '#e8e0cc');
  }
  g.rect(1, 15, 14, 1, WEATHER[1]);
  return g.outline().rows();
}

function cheese() {
  const g = new Grid(16, 14);
  g.rect(2, 7, 12, 6, '#d8b848'); g.rect(2, 7, 12, 1, '#f0d870'); g.disc(8, 7, 6, 2.2, '#f0d870'); g.rect(2, 12, 12, 1, '#a88a2c');
  g.rect(4, 9, 2, 2, '#a88a2c'); g.rect(10, 8, 2, 2, '#a88a2c');
  g.rect(3, 2, 10, 4, '#bcd8ec' + 'bb'); g.rect(3, 2, 10, 1, '#e8f4fc'); g.rect(2, 6, 12, 1, '#8aa8bc');
  g.set(7, 3, '#e8f4fc');
  g.set(12, 11, '#5a8a4a'); g.set(5, 12, '#5a8a4a');
  return g.outline().rows();
}

function ledger() {
  const g = new Grid(16, 8);
  g.rect(1, 1, 14, 6, '#5a3a30'); g.rect(1, 1, 14, 1, '#8a5a48'); g.rect(1, 6, 14, 1, '#2a1410');
  g.rect(2, 2, 6, 4, '#d8ccb0'); g.rect(8, 2, 6, 4, '#e8dcc0'); g.line(8, 2, 8, 5, '#8a806a');
  for (const y of [3, 4]) { g.rect(3, y, 4, 1, '#6a5a4a'); g.rect(9, y, 4, 1, '#6a5a4a'); }
  g.rect(12, 0, 1, 3, BARK[3]);
  return g.outline().rows();
}

function catBed() {
  const g = new Grid(16, 10);
  g.disc(8, 6, 7, 3.4, STRAW[1]); g.disc(8, 5, 5.6, 2, '#a85a4a'); g.disc(8, 5, 4, 1.3, '#c87a68');
  for (let x = 2; x < 14; x += 2) g.set(x, 8, STRAW[0]);
  g.rect(6, 4, 3, 2, '#e8d8b0'); g.set(7, 3, '#e8d8b0');
  return g.outline().rows();
}

function broom() {
  const g = new Grid(16, 28);
  g.line(8, 0, 8, 19, BARK[3]); g.line(9, 0, 9, 19, BARK[2]);
  g.rect(4, 18, 9, 9, STRAW[1]); g.rect(4, 18, 9, 2, STRAW[2]); g.rect(4, 26, 9, 1, STRAW[0]);
  for (const x of [5, 7, 9, 11]) g.line(x, 20, x - (x - 8) * 0.3, 27, STRAW[0]);
  g.rect(4, 19, 9, 1, '#3a2a1a');
  g.rect(3, 15, 3, 3, BARK[2]);
  return g.outline().rows();
}

function appleCrate() {
  const g = new Grid(16, 16);
  g.rect(1, 7, 14, 9, WEATHER[3]); g.rect(1, 7, 14, 1, WEATHER[4]); g.rect(1, 15, 14, 1, WEATHER[0]);
  g.rect(1, 10, 14, 1, WEATHER[1]); g.rect(1, 13, 14, 1, WEATHER[1]);
  for (const [x, y] of [[3, 5], [6, 4], [9, 5], [12, 4], [5, 7], [10, 7]]) { g.disc(x, y, 2, 1.8, '#5a3a24'); g.set(x - 1, y - 1, '#7a5a3a'); }
  g.rect(7, 1, 1, 2, BARK[1]);
  return g.outline().rows();
}

function jars() {
  const g = new Grid(32, 12);
  for (let i = 0; i < 6; i++) {
    const x = 2 + i * 5;
    const c = [RED[1], '#8a6a1c', MOSS[1], '#5a3a6a', RED[2], '#3a5a6a'][i];
    g.rect(x, 3, 4, 8, '#c8d8d8' + '77'); g.rect(x, 5, 4, 5, c + 'cc'); g.rect(x + 1, 1, 2, 2, BARK[3]); g.rect(x, 3, 4, 1, '#e8f0f0'); g.rect(x, 10, 4, 1, '#5a6a6a');
    g.set(x, 5, '#e8f0f0');
  }
  g.rect(0, 11, 32, 1, WEATHER[1]);
  return g.outline().rows();
}

function sweetJar() {
  const g = new Grid(16, 14);
  g.rect(3, 4, 10, 9, '#c8d8d8' + '77'); g.rect(3, 4, 1, 9, '#e8f0f0'); g.rect(12, 4, 1, 9, '#7a8a8a'); g.rect(3, 12, 10, 1, '#5a6a6a');
  g.rect(5, 1, 6, 3, BARK[3]); g.rect(5, 1, 6, 1, BARK[4]);
  g.rect(4, 6, 8, 6, '#b8782a'); g.rect(5, 7, 3, 2, '#d89a3a'); g.rect(8, 9, 3, 2, '#9a5a1c'); g.rect(4, 6, 8, 1, '#8a4a18');
  g.set(6, 8, '#f0c060'); g.set(9, 10, '#f0c060');
  return g.outline().rows();
}

function logbook() {
  const g = new Grid(16, 8);
  g.rect(1, 1, 14, 6, '#3a4a5a'); g.rect(1, 1, 14, 1, '#5a6a7a'); g.rect(1, 6, 14, 1, '#1a2430');
  g.rect(2, 2, 6, 4, '#d8ccb0'); g.rect(8, 2, 6, 4, '#e8dcc0'); g.line(8, 2, 8, 5, '#8a806a');
  for (const y of [3, 4]) { g.rect(3, y, 4, 1, '#6a5a4a'); g.rect(9, y, 3, 1, '#6a5a4a'); }
  g.line(10, 0, 14, 2, BARK[4]);
  return g.outline().rows();
}

function horn() {
  const g = new Grid(16, 16);
  g.rect(1, 12, 14, 3, BARK[2]); g.rect(1, 12, 14, 1, BARK[3]);
  g.disc(3, 9, 3, 3, BONE[1]); g.disc(8, 7, 3, 3, BONE[1]); g.disc(11, 5, 3.4, 3.4, BONE[2]); g.disc(11, 5, 1.8, 1.8, '#2a1a1a');
  g.rect(2, 8, 3, 3, BONE[1]); g.line(3, 11, 11, 8, BONE[0]); g.line(4, 7, 9, 4, BONE[2]);
  g.rect(1, 8, 2, 3, IRON[2]); g.rect(1, 8, 2, 1, IRON[3]);
  g.line(1, 11, 1, 14, RAG[1]);
  return g.outline().rows();
}

function blanket() {
  const g = new Grid(32, 14);
  g.disc(16, 7, 14, 5, BLUE[1]); g.disc(15, 6, 11, 3.4, BLUE[2]);
  for (let x = 6; x < 26; x += 4) g.line(x, 2, x, 12, BLUE[0] + '99');
  g.rect(8, 6, 14, 1, MUSTARD[1]);
  g.disc(24, 5, 3, 1.6, BLUE[1]);
  g.disc(6, 8, 3, 1.6, BLUE[0]);
  return g.rows();
}

function coins() {
  const g = new Grid(16, 8);
  for (const [x, y] of [[3, 5], [6, 3], [9, 5], [12, 3], [5, 6], [11, 6], [8, 2]]) { g.rect(x, y, 2, 1, '#c8a03a'); g.set(x, y, '#f0d070'); }
  g.set(7, 5, '#8a6a1e'); g.set(13, 5, '#8a6a1e');
  return g.rows();
}

function oldBucket() {
  const g = new Grid(16, 14);
  g.rect(3, 6, 10, 7, WEATHER[2]); g.rect(3, 6, 2, 7, WEATHER[3]); g.rect(11, 6, 2, 7, WEATHER[0]);
  g.rect(3, 8, 10, 1, '#5a3a24'); g.rect(3, 11, 10, 1, '#5a3a24');
  g.disc(8, 6, 5, 1.4, '#1a2230');
  g.line(3, 6, 5, 1, '#5a3a24'); g.line(13, 6, 11, 1, '#5a3a24'); g.line(5, 1, 11, 1, '#5a3a24');
  g.line(14, 9, 15, 13, STRAW[1]); g.set(2, 12, STRAW[0]);
  g.rect(2, 13, 5, 1, '#3a5a6a');
  return g.outline().rows();
}

function bricks() {
  const g = new Grid(16, 12);
  for (const [x, y, w] of [[1, 8, 6], [8, 8, 7], [3, 4, 6], [10, 4, 5], [5, 0, 6]]) {
    g.rect(x, y, w, 3, '#7a5a4a'); g.rect(x, y, w, 1, '#9a7a68'); g.rect(x, y + 2, w, 1, '#4a3228');
  }
  g.rect(2, 11, 12, 1, MOSS[0]); g.set(11, 7, MOSS[2]); g.set(4, 3, MOSS[2]);
  return g.outline().rows();
}


// A slim trunk: a pale-barked tree standing in the back of the wood, its crown out of the picture.
function slimTrunk(v) {
  const g = new Grid(16, 56);
  const mid = v ? BARK[3] : BARK[2];
  const lite = v ? BARK[4] : BARK[3];
  g.rect(5, 0, 6, 54, mid);
  g.rect(5, 0, 2, 54, lite); g.rect(9, 0, 2, 54, BARK[1]);
  for (let y = 3; y < 52; y += 6) { g.rect(6 + (y % 4), y, 2, 3, BARK[1]); g.set(8, y + 1, BARK[0]); }
  g.line(5, 53, 2, 56, mid); g.line(10, 53, 13, 56, mid);
  g.rect(9, 20, 2, 5, MOSS[1]); g.rect(5, 38, 2, 4, MOSS[2]);
  if (v) { g.rect(6, 30, 4, 1, BARK[0]); g.rect(7, 12, 1, 3, RED[2]); }
  return g.outline().rows();
}

// A robin's nest, lying in the leaves where it fell, the eggs still in it.
function nestGround() {
  const g = new Grid(16, 10);
  g.disc(8, 6, 6.5, 3, STRAW[1]); g.disc(8, 5, 5.2, 2, STRAW[0]); g.disc(8, 5, 3.6, 1.2, '#4a3418');
  g.line(2, 6, 5, 8, STRAW[2]); g.line(14, 6, 11, 8, STRAW[2]); g.line(3, 4, 6, 2, STRAW[2]);
  g.disc(6.5, 4.6, 1.3, 1, '#9cc8d8'); g.disc(9.5, 4.6, 1.3, 1, '#9cc8d8'); g.set(6, 4, '#d8ecf2'); g.set(9, 4, '#d8ecf2');
  for (const x of [1, 13]) g.set(x, 8, RED[2]);
  return g.outline().rows();
}

// The stump the nest came off: the bare dip where it sat, and a few twigs it's been built on.
function nestEmpty() {
  const g = new Grid(16, 20);
  g.rect(3, 10, 10, 10, BARK[1]); g.rect(3, 10, 2, 10, BARK[2]); g.rect(11, 10, 2, 10, BARK[0]);
  g.disc(8, 10, 5.2, 1.8, BARK[3]);
  g.line(4, 9, 6, 7, STRAW[0]); g.line(12, 9, 10, 7, STRAW[0]); g.line(6, 7, 10, 7, STRAW[0]);
  g.rect(5, 9, 6, 1, STRAW[1]);
  g.rect(0, 19, 3, 1, MOSS[1]);
  return g.outline().rows();
}

// A stump with a face: two knots for eyes, a mouth, and an apple wedged in it.
function faceStump() {
  const g = new Grid(16, 18);
  g.rect(3, 6, 10, 12, BARK[1]); g.rect(3, 6, 2, 12, BARK[2]); g.rect(11, 6, 2, 12, BARK[0]);
  g.disc(8, 6, 5.2, 1.8, BARK[3]); g.disc(8, 6, 3, 1, BARK[4]);
  g.disc(6, 10, 1.3, 1.3, '#0e0608'); g.disc(10, 10, 1.3, 1.3, '#0e0608'); g.set(6, 9, BONE[1]); g.set(10, 9, BONE[1]);
  g.rect(5, 14, 6, 2, '#0e0608');
  g.disc(8, 14, 2.2, 2, '#c8302a'); g.set(7, 13, '#ff7a5a'); g.set(8, 11, MOSS[2]); g.set(9, 11, BARK[1]);
  return g.outline().rows();
}

// A toadstool holding up a very small sign.
function signShroom() {
  const g = new Grid(16, 16);
  toadstool(g, 5, 15, 4, CAP, true, 5);
  g.rect(11, 5, 1, 11, BARK[3]); g.rect(9, 2, 6, 4, BARK[4]); g.rect(9, 2, 6, 1, BONE[2]);
  g.set(10, 4, BARK[0]); g.set(12, 4, BARK[0]); g.set(13, 4, BARK[0]); g.set(11, 3, BARK[0]);
  return g.outline().rows();
}

// The kids' chalk drawing of the Hush: tall, many teeth, and (they insist) a bow tie.
function chalkBeast() {
  const g = new Grid(32, 20);
  const c = '#e8e4d8' + 'cc';
  g.rect(9, 4, 14, 10, c); g.rect(10, 5, 12, 8, null);
  g.line(9, 4, 12, 0, c); g.line(22, 4, 19, 0, c);
  g.line(10, 13, 8, 19, c); g.line(21, 13, 23, 19, c); g.line(13, 13, 13, 19, c); g.line(18, 13, 18, 19, c);
  g.set(12, 7, c); g.set(19, 7, c); g.set(12, 8, c); g.set(19, 8, c);
  for (let x = 11; x < 21; x += 2) { g.line(x, 10, x, 12, c); }
  g.line(11, 10, 20, 10, c);
  g.line(13, 14, 18, 14, '#c8302a' + 'cc'); g.line(13, 14, 11, 16, '#c8302a' + 'cc'); g.line(18, 14, 20, 16, '#c8302a' + 'cc'); g.line(13, 16, 11, 14, '#c8302a' + 'cc'); g.line(18, 16, 20, 14, '#c8302a' + 'cc');
  g.rect(2, 16, 5, 1, c); g.rect(25, 17, 5, 1, c);
  return g.rows();
}

function wateringCan() {
  const g = new Grid(16, 14);
  g.rect(3, 5, 8, 8, '#4a6a6a'); g.rect(3, 5, 2, 8, '#6a8a8a'); g.rect(9, 5, 2, 8, '#2a4444'); g.rect(3, 12, 8, 1, '#1a2c2c');
  g.line(11, 9, 15, 3, '#4a6a6a'); g.line(11, 10, 15, 4, '#2a4444'); g.rect(14, 1, 2, 2, '#6a8a8a');
  g.line(3, 6, 3, 2, '#4a6a6a'); g.line(3, 2, 8, 2, '#4a6a6a'); g.line(8, 2, 9, 5, '#4a6a6a');
  g.set(6, 8, '#a04a2a'); g.set(7, 9, '#a04a2a'); g.set(5, 10, '#a04a2a');
  return g.outline().rows();
}

// A biscuit tin of marbles, lid off, in a den.
function marbleTin() {
  const g = new Grid(16, 10);
  g.rect(2, 3, 12, 6, '#8a2a2a'); g.rect(2, 3, 12, 1, '#c85a4a'); g.rect(2, 8, 12, 1, '#4a1414');
  g.rect(3, 4, 10, 2, '#1a1410');
  for (const [x, y, c] of [[4, 4, BLUE[2]], [6, 3, RED[2]], [8, 4, MUSTARD[2]], [10, 3, MOSS[3]], [12, 4, '#e8e8f0'], [5, 5, MUSTARD[1]]]) { g.set(x, y, c); g.set(x + 1, y, c); }
  g.rect(0, 5, 3, 1, '#8a2a2a'); g.rect(13, 1, 3, 2, '#8a2a2a'); g.line(13, 3, 15, 1, '#c85a4a');
  return g.outline().rows();
}

// ---------------------------------------------------------------------------------------------

export const R3P_PROP_SPRITES = {
  r3p_toadstools: toadstools(),
  r3p_boletes: boletes(),
  r3p_chanterelles: chanterelles(),
  r3p_puffballs: puffballs(),
  r3p_fairy_ring: fairyRing(),
  r3p_bracket_stump: bracketStump(),
  r3p_mush_log: mushLog(),
  r3p_fern: fern(),
  r3p_bracken: bracken(),
  r3p_leaf_heap: leafHeap(),
  r3p_leaves_flat: leavesFlat(),
  r3p_acorns: acorns(),
  r3p_pinecones: pinecones(),
  r3p_twigs: twigs(),
  r3p_moss_rock: mossRock(),
  r3p_boulder: boulder(),
  r3p_stump: stump(),
  r3p_stump_big: stumpBig(),
  r3p_branch: branch(),
  r3p_red_shrub: redShrub(),
  r3p_berries: berries(),
  r3p_hollow_log: hollowLog(),
  r3p_roots: roots(),
  r3p_web_bush: webBush(),
  r3p_nest_stump: nestStump(),
  r3p_nut_stump: nutStump(),
  r3p_burrow: burrow(),
  r3p_deer_bed: deerBed(),
  r3p_hoofprints: hoofprints(),
  r3p_wallow: wallow(),
  r3p_puddle: puddle(),
  r3p_stones_flat: stonesFlat(),
  r3p_feather: feather(),
  r3p_antler: antler(),
  r3p_giant_trunk: giantTrunk(),
  r3p_blaze_post: blazePost(),
  r3p_cut_tree: cutTree(),
  r3p_axe_stump: axeStump(),
  r3p_log_stack: logStack(),
  r3p_log_small: logSmall(),
  r3p_sawhorse: sawhorse(),
  r3p_split_logs: splitLogs(),
  r3p_chips: chips(),
  r3p_peeled_log: peeledLog(),
  r3p_wedge_log: wedgeLog(),
  r3p_saw: sawLeaning(),
  r3p_rope_coil: ropeCoil(),
  r3p_pail: pail(),
  r3p_billy: billy(),
  r3p_old_boot: oldBoot(),
  r3p_marker_stone: markerStone(),
  r3p_cairn: cairn(),
  r3p_fence_bit: fenceBit(),
  r3p_wheel: wheel(),
  r3p_tally_board: tallyBoard(),
  r3p_cap_stump: capStump(),
  r3p_rag_pole: ragPole(0),
  r3p_fingerpost: fingerpost(),
  r3p_lantern_stand: lanternStand(),
  r3p_feeder: feeder(),
  r3p_sled: sled(),
  r3p_rocker: rocker(),
  r3p_washtub: washtub(),
  r3p_peg_basket: pegBasket(),
  r3p_boots: boots(),
  r3p_mat: mat(),
  r3p_pot_dead: potDead(),
  r3p_pot_wild: potWild(),
  r3p_churn: churn(),
  r3p_bucket: bucket(),
  r3p_wood_lean: woodLean(),
  r3p_block_axe: blockAxe(),
  r3p_coop: coop(),
  r3p_kennel: kennel(),
  r3p_cradle: cradle(),
  r3p_swing: swing(0),
  r3p_toy_horse: toyHorse(),
  r3p_marbles: marbles(),
  r3p_hoop: hoop(),
  r3p_doll: doll(),
  r3p_table_set: tableSet(),
  r3p_stools: stools(),
  r3p_barrel_rain: barrelRain(),
  r3p_scythe_post: scythePost(),
  r3p_skeps: skeps(),
  r3p_cabbages: cabbages(),
  r3p_bean_poles: beanPoles(),
  r3p_trough: trough(),
  r3p_notice_post: noticePost(),
  r3p_maypole: maypole(),
  r3p_coat_post: coatPost(),
  r3p_street_lamp: streetLamp(),
  r3p_hopscotch: hopscotch(),
  r3p_chalk_axeman: chalkAxeman(),
  r3p_pie_bench: pieBench(),
  r3p_music_box: musicBox(),
  r3p_sack_pile: sackPile(),
  r3p_millstone: millstone(),
  r3p_flour_barrel: flourBarrel(),
  r3p_grindstone: grindstone(),
  r3p_eel_trap: eelTrap(),
  r3p_planks: planks(),
  r3p_post: post(),
  r3p_ladder: ladder(),
  r3p_bundle: bundle(),
  r3p_wheelbarrow: wheelbarrow(),
  r3p_kettle_stones: kettleStones(),
  r3p_tin_stack: tinStack(),
  r3p_cheese: cheese(),
  r3p_ledger: ledger(),
  r3p_cat_bed: catBed(),
  r3p_broom: broom(),
  r3p_apple_crate: appleCrate(),
  r3p_jars: jars(),
  r3p_sweet_jar: sweetJar(),
  r3p_logbook: logbook(),
  r3p_horn: horn(),
  r3p_blanket: blanket(),
  r3p_coins: coins(),
  r3p_old_bucket: oldBucket(),
  r3p_bricks: bricks(),
  r3p_slim_trunk: slimTrunk(0),
  r3p_slim_trunk_b: slimTrunk(1),
  r3p_nest_ground: nestGround(),
  r3p_nest_empty: nestEmpty(),
  r3p_face_stump: faceStump(),
  r3p_sign_shroom: signShroom(),
  r3p_chalk_beast: chalkBeast(),
  r3p_watering_can: wateringCan(),
  r3p_marble_tin: marbleTin(),
};

export const R3P_PALETTE = palette;
export const R3P_PALETTE_EXTRA = palette;
export const R3P_RAG_POLE_SPRITES = frames((i) => ragPole(i), 4);
export const R3P_SWING_SPRITES = frames((i) => swing(i), 4);

// How many tiles wide each wider one stands.
export const R3P_FOOTPRINTS = {
  r3p_fairy_ring: 2, r3p_mush_log: 2, r3p_bracken: 2, r3p_leaves_flat: 2, r3p_twigs: 2, r3p_boulder: 2,
  r3p_stump_big: 2, r3p_branch: 2, r3p_hollow_log: 2, r3p_roots: 2, r3p_deer_bed: 2, r3p_hoofprints: 2,
  r3p_wallow: 2, r3p_puddle: 2, r3p_stones_flat: 2, r3p_giant_trunk: 2, r3p_log_stack: 2, r3p_sawhorse: 2,
  r3p_peeled_log: 2, r3p_fence_bit: 2, r3p_sled: 2, r3p_wood_lean: 2, r3p_coop: 2, r3p_kennel: 2,
  r3p_swing: 2, r3p_table_set: 2, r3p_skeps: 2, r3p_cabbages: 2, r3p_trough: 2, r3p_millstone: 2,
  r3p_planks: 2, r3p_wheelbarrow: 2, r3p_jars: 2, r3p_blanket: 2, r3p_chalk_beast: 2,
};
