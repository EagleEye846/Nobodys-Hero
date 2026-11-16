// Round 3 life pass, helper B (15 November 2026): the set pieces for the dullest rooms of chapter 3, found by
// the fun check. Drawn like cityLife.js: rows of characters from a small painter, 16 pixels to a tile,
// standing on the bottom edge and centred over their footprint. Every id starts `r3b_`. Nothing hangs in
// the air: every sign, bell, string and banner has its post or hook.
//
//   The Hushwood (quiet things, felt and cloth, nothing that rings): r3b_bell_wrapped r3b_rag_thorn
//     r3b_felt_shoes r3b_stump_house r3b_jar_post r3b_fallen_giant r3b_quiet_shrine r3b_hush_sign r3b_moss_patch (flat)
//   The Dead City: r3b_bedroll r3b_left_sticks r3b_fountain_dry r3b_plinth_feet r3b_stall r3b_banner_pole
//     r3b_unfinished_statue r3b_laundry_slab (flat)
//   The Registry: r3b_book_tower r3b_globe r3b_queue_posts r3b_ticket_post r3b_dust_sheet r3b_file_cart
//   Hollin: r3b_bunting r3b_feast_table r3b_wild_flowers

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xc800 + colors.size);
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

const INK = '#14161a';
const WOOD = ['#2e2218', '#4e3a28', '#6e5538', '#92764e', '#b89a68'];
const STONE = ['#3a4040', '#566060', '#76827e', '#98a49c', '#b8c2b8'];
const MOSS = ['#243e26', '#35582f', '#4c7a3e', '#6ea052', '#92c068'];
const BARK = ['#2a1c1c', '#4a3030', '#6a4a42', '#8a6a5a'];
const RED = ['#6a2a22', '#a04030', '#d06a4c'];
const CREAM = ['#b8ac90', '#d8ccb0', '#f0e6cc'];
const FELT = ['#4a4a50', '#6a6a72', '#8e8e96', '#b0b0b8'];
const IRON = ['#22262c', '#3c4250', '#5c6676', '#8a94a4'];
const WARM = ['#a86a1e', '#e8a830', '#ffe080'];
const GLOW = ['#2a7a4a', '#4cc07a', '#a8f0b8'];
const PAPER = ['#a89c80', '#d4c8a8', '#efe6cc'];
const BRASS = ['#6a4c1a', '#a8802c', '#e0b850'];
const TEAL = ['#2a5a5e', '#3f8a8c', '#7cc0bc'];
const CLOTH = ['#a8484a', '#d89a3c', '#4a78a8', '#d8d0b8', '#6a9a5a', '#8a5a9a'];

const post = (g, x, y0, y1, w = 2) => { g.rect(x, y0, w, y1 - y0, WOOD[1]); g.rect(x, y0, 1, y1 - y0, WOOD[2]); };

// ---------------------------------------------------------------------------------------------
// THE HUSHWOOD

// A bell on a short post, wrapped in felt strips and tied shut so it can never ring.
function bellWrapped() {
  const g = new Grid(16, 26);
  post(g, 3, 4, 26, 2);
  g.rect(3, 3, 9, 2, WOOD[2]); g.rect(3, 3, 9, 1, WOOD[3]); g.rect(10, 4, 2, 3, WOOD[1]);
  g.disc(9, 11, 4, 4.5, BRASS[1]); g.rect(5, 13, 9, 3, BRASS[1]); g.rect(4, 15, 11, 2, BRASS[2]);
  for (let i = 0; i < 4; i++) { g.rect(5, 8 + i * 3, 9, 2, FELT[1 + (i % 2)]); g.rect(5, 8 + i * 3, 9, 1, FELT[3]); }
  g.line(9, 17, 9, 20, '#d8ccb0'); g.rect(8, 20, 3, 2, FELT[2]);
  g.line(12, 10, 14, 14, '#d8ccb0'); g.line(6, 10, 4, 15, '#d8ccb0');
  return g.outline().rows();
}

// A small thorn tree hung with strips of cloth, each one a whisper tied on.
function ragThorn() {
  const g = new Grid(24, 34);
  g.rect(11, 20, 3, 14, BARK[1]); g.rect(11, 20, 1, 14, BARK[2]); g.rect(9, 32, 7, 2, BARK[0]);
  const limbs = [[12, 20, 4, 10], [12, 22, 20, 12], [12, 16, 8, 3], [12, 17, 17, 5], [12, 12, 12, 2]];
  for (const [x0, y0, x1, y1] of limbs) g.line(x0, y0, x1, y1, BARK[1]);
  for (const [x, y] of [[4, 10], [20, 12], [8, 3], [17, 5], [12, 2], [6, 6], [19, 8]]) { g.set(x, y, BARK[2]); g.set(x - 1, y + 1, BARK[1]); g.set(x + 1, y + 1, BARK[1]); }
  const rags = [[4, 11, CLOTH[0], 5], [20, 13, CLOTH[2], 6], [8, 4, CLOTH[3], 5], [17, 6, CLOTH[1], 6], [12, 3, CLOTH[5], 4], [6, 7, CLOTH[4], 5], [19, 9, CLOTH[0], 4], [14, 13, CLOTH[3], 5], [9, 14, CLOTH[2], 4]];
  for (const [x, y, c, h] of rags) { g.rect(x, y, 2, h, c); g.set(x + 1, y + h, c); g.set(x, y, FELT[0]); }
  return g.outline().rows();
}

// A rail on two posts with pairs of felt-soled shoes hung on pegs below it.
function feltShoes() {
  const g = new Grid(24, 22);
  post(g, 1, 6, 22, 2); post(g, 21, 6, 22, 2);
  g.rect(1, 5, 22, 2, WOOD[2]); g.rect(1, 5, 22, 1, WOOD[3]);
  for (let i = 0; i < 3; i++) {
    const x = 4 + i * 6;
    g.rect(x, 7, 1, 3, WOOD[0]); g.rect(x + 3, 7, 1, 3, WOOD[0]);
    for (const dx of [0, 3]) { g.rect(x + dx - 1, 10, 3, 4, FELT[2 - (i % 2)]); g.rect(x + dx - 1, 13, 4, 2, FELT[1]); g.set(x + dx - 1, 10, FELT[3]); }
  }
  g.rect(8, 17, 8, 2, FELT[1]); g.set(9, 17, FELT[3]);
  return g.outline().rows();
}

// A big old stump with a tiny round door and a lit window: somebody small lives in it.
function stumpHouse() {
  const g = new Grid(20, 22);
  g.rect(3, 6, 14, 15, BARK[2]); g.rect(3, 6, 3, 15, BARK[1]); g.rect(14, 6, 3, 15, BARK[1]);
  g.rect(1, 18, 18, 4, BARK[1]); g.rect(0, 20, 20, 2, BARK[0]);
  g.disc(10, 6, 7, 2.4, WOOD[3]); g.disc(10, 6, 5, 1.4, WOOD[4]); g.disc(10, 6, 2.6, 0.9, WOOD[3]);
  g.disc(8, 15, 2.6, 3.4, WOOD[0]); g.disc(8, 15, 2, 3, WOOD[2]); g.set(9, 15, BRASS[2]);
  g.disc(13, 11, 1.6, 1.6, WARM[1]); g.set(13, 10, WARM[2]);
  g.rect(15, 1, 2, 5, IRON[1]); g.rect(14, 0, 4, 1, IRON[2]);
  g.rect(3, 17, 3, 2, MOSS[2]); g.rect(12, 18, 4, 2, MOSS[1]);
  return g.outline().rows();
}

// A post with a hook and a jar of glowing fungus hung from it, a cool green light in the dark.
function jarPost() {
  const g = new Grid(16, 30);
  post(g, 3, 4, 30, 2);
  g.rect(3, 3, 8, 2, WOOD[2]); g.rect(3, 3, 8, 1, WOOD[3]);
  g.line(9, 5, 9, 8, IRON[2]);
  g.rect(6, 9, 7, 9, '#9ab8a8'); g.rect(7, 8, 5, 2, IRON[2]);
  g.rect(7, 11, 5, 6, GLOW[1]); g.rect(8, 12, 3, 3, GLOW[2]); g.set(7, 16, GLOW[0]); g.set(11, 15, GLOW[0]);
  g.rect(6, 9, 1, 9, '#d8ece0');
  g.set(3, 20, MOSS[3]); g.set(5, 25, MOSS[2]); g.rect(2, 28, 5, 2, MOSS[1]);
  return g.outline().rows();
}

// A huge old trunk lying on its side, long dead, furred with moss, with a broken end open to look into.
function fallenGiant() {
  const g = new Grid(56, 26);
  g.rect(10, 6, 44, 17, BARK[2]); g.rect(10, 6, 44, 2, BARK[3]); g.rect(10, 20, 44, 3, BARK[0]);
  g.disc(10, 14, 6, 9, BARK[1]); g.disc(10, 14, 4.6, 7, WOOD[3]); g.disc(10, 14, 3, 5, WOOD[2]); g.disc(10, 14, 1.4, 2.4, WOOD[1]);
  for (let i = 0; i < 6; i++) g.line(14 + i * 7, 8, 15 + i * 7, 20, BARK[1]);
  for (const [x, y, w] of [[18, 5, 12], [36, 4, 9], [46, 6, 7], [28, 17, 8]]) { g.rect(x, y, w, 3, MOSS[2]); g.rect(x + 1, y - 1, w - 3, 1, MOSS[3]); g.rect(x, y + 2, w - 4, 1, MOSS[1]); }
  g.disc(40, 5, 3, 2, '#d8c8a8'); g.set(40, 3, '#efe6cc');
  g.disc(24, 4, 2, 1.6, '#c85a4a'); g.set(23, 3, '#efe6cc');
  g.rect(53, 14, 3, 8, BARK[1]);
  return g.outline().rows();
}

// A little cairn shrine: stacked stones round a nook, a candle stub wrapped in felt and a pinch of dried flowers.
function quietShrine() {
  const g = new Grid(18, 22);
  g.rect(2, 16, 14, 5, STONE[1]); g.rect(2, 16, 14, 1, STONE[3]);
  g.rect(3, 11, 4, 6, STONE[2]); g.rect(11, 11, 4, 6, STONE[2]); g.rect(2, 8, 14, 3, STONE[2]); g.rect(2, 8, 14, 1, STONE[4]);
  g.rect(4, 4, 10, 4, STONE[1]); g.rect(6, 1, 6, 3, STONE[2]);
  g.rect(7, 11, 4, 5, '#10100c');
  g.rect(8, 13, 2, 3, CREAM[1]); g.rect(7, 15, 4, 1, FELT[2]); g.set(9, 12, WARM[2]);
  g.set(5, 15, RED[2]); g.set(5, 14, WARM[1]); g.set(13, 15, '#a8a8d8'); g.set(13, 14, CLOTH[2]);
  g.rect(3, 18, 3, 2, MOSS[2]);
  return g.outline().rows();
}

// A post with a painted board: a hand with a finger to the lips. The woodcutters' sign for quiet.
function hushSign() {
  const g = new Grid(16, 28);
  post(g, 7, 12, 28, 2);
  g.rect(1, 3, 14, 11, WOOD[3]); g.rect(1, 3, 14, 1, WOOD[4]); g.rect(1, 13, 14, 1, WOOD[1]); g.rect(1, 3, 1, 11, WOOD[1]); g.rect(14, 3, 1, 11, WOOD[1]);
  g.rect(2, 4, 12, 9, CREAM[1]);
  g.disc(8, 8, 3.4, 3.6, RED[1]); g.rect(7, 5, 2, 5, CREAM[2]); g.rect(6, 9, 4, 1, RED[0]);
  g.set(6, 7, INK); g.set(10, 7, INK);
  return g.outline().rows();
}

// A flat drift of deep moss.
function mossPatch() {
  const g = new Grid(32, 14);
  g.disc(16, 7, 14, 5, MOSS[1]); g.disc(12, 6, 9, 3.4, MOSS[2]);
  for (const [x, y] of [[8, 5], [14, 4], [20, 6], [24, 8], [11, 9], [17, 8], [5, 8]]) { g.set(x, y, MOSS[3]); g.set(x + 1, y, MOSS[4]); }
  g.set(22, 4, '#e0d8b8'); g.set(10, 3, '#e0d8b8');
  return g.rows();
}

// ---------------------------------------------------------------------------------------------
// THE DEAD CITY

// A bedroll and a pack with a tin mug: somebody camped at the gate to wait for it to open.
function bedroll() {
  const g = new Grid(24, 14);
  g.disc(9, 9, 8, 4, '#6a5a7a'); g.disc(9, 7, 7, 2.4, '#8a7a9a'); g.rect(1, 8, 16, 1, '#4a3a5a');
  g.rect(1, 7, 3, 4, '#d8ccb0'); g.disc(19, 9, 3.4, 3.6, '#7a5a3a'); g.rect(17, 6, 5, 2, '#5a4026'); g.rect(18, 8, 3, 1, BRASS[1]);
  g.rect(12, 12, 3, 2, IRON[3]); g.set(15, 12, IRON[3]);
  return g.outline().rows();
}

// Walking sticks, a hat and a pilgrim's staff leaning in a barrel by a gate.
function leftSticks() {
  const g = new Grid(16, 28);
  g.rect(3, 16, 10, 11, WOOD[2]); g.rect(3, 16, 10, 1, WOOD[3]); g.rect(3, 19, 10, 1, IRON[1]); g.rect(3, 24, 10, 1, IRON[1]); g.rect(3, 26, 10, 1, WOOD[0]);
  g.line(5, 17, 2, 3, WOOD[3]); g.line(6, 17, 3, 4, WOOD[2]); g.line(8, 17, 8, 1, WOOD[4]); g.line(11, 17, 13, 4, WOOD[3]); g.line(10, 17, 11, 6, WOOD[2]);
  g.disc(8, 2, 4.4, 1.6, '#8a7a50'); g.rect(6, 0, 5, 3, '#a89868'); g.rect(6, 2, 5, 1, RED[1]);
  g.set(2, 3, WARM[1]); g.rect(12, 3, 2, 1, FELT[2]);
  return g.outline().rows();
}

// A dry round fountain: a wide stone basin, a plinth in the middle with nothing on it, leaves in the bottom.
function fountainDry() {
  const g = new Grid(40, 34);
  g.disc(20, 26, 19, 7, STONE[1]); g.disc(20, 24, 19, 6.4, STONE[3]); g.disc(20, 24, 16, 5, STONE[0]); g.disc(20, 24, 15, 4.4, '#3a3828');
  g.rect(1, 24, 38, 3, STONE[2]); g.rect(1, 27, 38, 1, STONE[0]);
  g.rect(16, 8, 8, 17, STONE[2]); g.rect(16, 8, 3, 17, STONE[3]); g.rect(14, 6, 12, 3, STONE[3]); g.rect(14, 6, 12, 1, STONE[4]); g.rect(17, 3, 6, 3, STONE[2]);
  g.rect(18, 1, 4, 2, STONE[3]); g.rect(19, 0, 2, 1, STONE[1]);
  for (const [x, y, c] of [[8, 23, '#6a5a2a'], [14, 26, '#8a4a2a'], [26, 25, '#6a5a2a'], [31, 23, '#a06a2a'], [20, 27, '#7a3a22'], [11, 21, MOSS[2]]]) { g.rect(x, y, 3, 1, c); g.set(x + 1, y - 1, c); }
  g.rect(3, 22, 5, 2, MOSS[2]); g.rect(33, 24, 4, 2, MOSS[1]); g.set(24, 24, BRASS[2]);
  return g.outline().rows();
}

// A plinth with only a pair of stone boots left on top.
function plinthFeet() {
  const g = new Grid(18, 30);
  g.rect(2, 20, 14, 10, STONE[1]); g.rect(2, 20, 14, 1, STONE[3]); g.rect(1, 28, 16, 2, STONE[0]); g.rect(3, 21, 12, 1, STONE[2]);
  g.rect(3, 14, 4, 6, STONE[3]); g.rect(2, 17, 6, 3, STONE[3]); g.rect(11, 14, 4, 6, STONE[3]); g.rect(10, 17, 6, 3, STONE[3]);
  g.rect(3, 14, 1, 6, STONE[4]); g.rect(11, 14, 1, 6, STONE[4]);
  g.rect(4, 11, 2, 3, STONE[2]); g.rect(12, 11, 2, 3, STONE[2]); g.set(4, 10, STONE[1]); g.set(5, 10, STONE[1]);
  g.rect(6, 23, 7, 3, STONE[0]); g.set(7, 24, STONE[3]); g.set(9, 24, STONE[3]); g.set(11, 24, STONE[3]);
  g.rect(2, 25, 3, 2, MOSS[2]);
  return g.outline().rows();
}

// A market stall with a faded striped awning, empty, its scales still on the counter.
function stall() {
  const g = new Grid(34, 36);
  post(g, 2, 8, 36, 2); post(g, 30, 8, 36, 2);
  for (let i = 0; i < 8; i++) { g.rect(1 + i * 4, 4, 4, 8, i % 2 ? CREAM[0] : TEAL[1]); g.rect(1 + i * 4, 12, 4, 2, i % 2 ? CREAM[1] : TEAL[2]); }
  g.rect(0, 3, 34, 1, WOOD[1]);
  g.rect(3, 22, 28, 3, WOOD[3]); g.rect(3, 22, 28, 1, WOOD[4]); g.rect(4, 25, 26, 9, WOOD[2]); g.rect(4, 25, 26, 1, WOOD[1]); g.rect(4, 33, 26, 2, WOOD[0]);
  g.rect(14, 15, 1, 7, BRASS[1]); g.rect(9, 15, 12, 1, BRASS[1]); g.rect(7, 17, 5, 1, BRASS[2]); g.rect(18, 19, 5, 1, BRASS[2]);
  g.rect(9, 16, 1, 2, BRASS[0]); g.rect(21, 16, 1, 4, BRASS[0]);
  g.rect(24, 19, 5, 3, WOOD[1]); g.rect(25, 18, 3, 1, CREAM[1]);
  g.rect(6, 27, 8, 5, WOOD[1]); g.rect(7, 28, 6, 3, PAPER[1]);
  return g.outline().rows();
}

// A tall pole with a faded, torn banner, the city's colours gone to pink and grey.
function bannerPole() {
  const g = new Grid(18, 48);
  post(g, 3, 1, 48, 2);
  g.rect(2, 0, 12, 2, BRASS[1]); g.rect(2, 0, 12, 1, BRASS[2]);
  g.rect(5, 2, 10, 22, '#a86a6e'); g.rect(5, 2, 10, 1, '#c88a8e'); g.rect(5, 2, 1, 22, '#8a4a52');
  g.rect(8, 9, 4, 8, '#d8c890'); g.rect(9, 7, 2, 2, '#d8c890'); g.rect(7, 11, 6, 2, '#d8c890');
  g.set(6, 24, '#a86a6e'); g.set(8, 25, '#a86a6e'); g.rect(11, 22, 4, 1, '#8a4a52'); g.set(13, 23, '#a86a6e');
  g.rect(5, 3, 1, 4, '#8a7a7a'); g.rect(13, 5, 2, 4, '#8a7a7a');
  g.set(3, 46, MOSS[2]); g.rect(2, 47, 4, 1, MOSS[1]);
  return g.outline().rows();
}

// A block of stone with a figure half-freed from it: shoulders, a chin, and chisel marks.
function unfinishedStatue() {
  const g = new Grid(26, 44);
  g.rect(2, 30, 22, 14, STONE[2]); g.rect(2, 30, 22, 2, STONE[4]); g.rect(2, 32, 3, 12, STONE[3]); g.rect(21, 32, 3, 12, STONE[1]); g.rect(1, 42, 24, 2, STONE[0]);
  g.rect(6, 15, 14, 16, STONE[3]); g.rect(6, 15, 3, 16, STONE[4]); g.rect(17, 15, 3, 16, STONE[2]);
  g.disc(13, 10, 4.4, 5.4, STONE[3]); g.rect(9, 12, 8, 4, STONE[3]); g.rect(10, 6, 6, 3, STONE[4]);
  g.rect(8, 22, 10, 9, STONE[2]);
  g.set(11, 9, STONE[0]); g.set(15, 9, STONE[0]); g.rect(12, 12, 2, 1, STONE[1]);
  for (const [x, y] of [[5, 34], [9, 37], [16, 35], [20, 39], [4, 40], [12, 39], [8, 33]]) { g.line(x, y, x + 3, y - 1, STONE[0]); }
  g.rect(20, 28, 5, 3, WOOD[2]); g.rect(22, 25, 2, 3, WOOD[3]); g.rect(19, 27, 7, 2, IRON[2]);
  g.rect(0, 43, 3, 1, '#d8ccb0'); g.rect(22, 43, 3, 1, '#d8ccb0'); g.rect(4, 42, 2, 1, '#d8ccb0');
  return g.outline().rows();
}

// A flat washing slab, the old laundry stone, with a bar of soap and a wooden paddle left on it.
function laundrySlab() {
  const g = new Grid(32, 16);
  g.rect(2, 6, 28, 8, STONE[2]); g.rect(2, 6, 28, 2, STONE[3]); g.rect(2, 13, 28, 2, STONE[0]);
  for (let i = 0; i < 7; i++) g.rect(5 + i * 4, 9, 2, 1, STONE[1]);
  g.rect(19, 7, 5, 3, '#d8c8e0'); g.rect(20, 6, 3, 1, '#f0e8f4');
  g.line(6, 8, 14, 11, WOOD[3]); g.rect(13, 10, 4, 3, WOOD[3]);
  g.rect(1, 13, 4, 2, MOSS[2]); g.rect(27, 12, 4, 2, MOSS[1]);
  return g.outline().rows();
}

// ---------------------------------------------------------------------------------------------
// THE REGISTRY

// A leaning tower of books with a slip of paper marking the place.
function bookTower() {
  const g = new Grid(18, 32);
  const cols = ['#7a2a2a', '#2a4a6a', '#4a6a3a', '#a07a2a', '#5a3a6a', '#8a4a3a', '#3a5a5a', '#a08a5a'];
  let y = 31;
  for (let i = 0; i < 8; i++) {
    const h = 3 + (i % 3);
    const dx = [0, 1, -1, 1, 2, 0, -1, 1][i];
    y -= h;
    g.rect(3 + dx, y, 12 - (i % 2) * 2, h, cols[i]); g.rect(3 + dx, y, 12 - (i % 2) * 2, 1, PAPER[2]); g.rect(3 + dx, y + h - 1, 12 - (i % 2) * 2, 1, '#00000055');
    g.rect(5 + dx, y + 1, 4, 1, BRASS[2]);
  }
  g.rect(13, y + 6, 4, 2, PAPER[2]); g.set(16, y + 7, RED[2]);
  return g.outline().rows();
}

// A globe on a wooden stand with a brass ring; the seas have faded to the same colour as the land.
function globe() {
  const g = new Grid(16, 24);
  g.rect(7, 14, 2, 8, WOOD[2]); g.rect(3, 21, 10, 3, WOOD[1]); g.rect(3, 21, 10, 1, WOOD[3]);
  g.disc(8, 8, 6, 6, '#b8a880'); g.disc(6, 6, 3, 2.6, '#8a9a78'); g.disc(10, 10, 3, 2, '#98a888'); g.rect(6, 3, 3, 2, '#c8b890');
  for (let a = 0; a < 28; a++) g.set(8 + Math.cos(a / 28 * 6.283) * 7, 8 + Math.sin(a / 28 * 6.283) * 7.4, BRASS[1]);
  g.line(1, 14, 14, 2, BRASS[2]);
  return g.outline().rows();
}

// Two queue posts with a rope sagging between them, and a worn track in front.
function queuePosts() {
  const g = new Grid(32, 22);
  for (const x of [3, 27]) { g.rect(x, 6, 3, 14, BRASS[1]); g.rect(x, 6, 1, 14, BRASS[2]); g.disc(x + 1, 5, 2.4, 2, BRASS[2]); g.rect(x - 1, 19, 5, 2, BRASS[0]); }
  for (let i = 0; i <= 22; i++) { const x = 6 + i; const y = 7 + Math.round(Math.sin((i / 22) * 3.14) * 5); g.set(x, y, RED[1]); g.set(x, y + 1, RED[0]); }
  return g.outline().rows();
}

// A post with a ticket dispenser: a roll of paper numbers, NOW SERVING the same number it always was.
function ticketPost() {
  const g = new Grid(16, 30);
  g.rect(6, 10, 3, 20, IRON[1]); g.rect(6, 10, 1, 20, IRON[2]); g.rect(3, 28, 9, 2, IRON[0]);
  g.rect(2, 3, 12, 8, '#6a2a2a'); g.rect(2, 3, 12, 1, '#a04a4a'); g.rect(4, 5, 8, 4, '#201414');
  g.rect(5, 6, 6, 2, CREAM[2]); g.set(6, 7, INK); g.set(8, 7, INK); g.set(10, 7, INK);
  g.rect(5, 11, 6, 6, PAPER[2]); g.rect(5, 15, 6, 1, PAPER[0]); g.set(7, 13, INK); g.set(8, 13, INK);
  return g.outline().rows();
}

// Furniture under a dust sheet: a lump with a table's legs poking out, and a drift of grey around it.
function dustSheet() {
  const g = new Grid(22, 22);
  g.disc(11, 13, 9, 7, '#a8a498'); g.disc(10, 11, 7, 5, '#c0bcb0'); g.disc(9, 9, 4, 3, '#d0ccc0');
  g.rect(2, 17, 18, 3, '#a8a498'); g.rect(1, 19, 3, 2, '#8a8678'); g.rect(8, 20, 5, 2, '#8a8678'); g.rect(17, 19, 4, 2, '#8a8678');
  g.rect(3, 20, 2, 2, WOOD[2]); g.rect(18, 20, 2, 2, WOOD[2]);
  for (const [x, y] of [[8, 12], [12, 14], [6, 15]]) g.line(x, y, x + 3, y + 2, '#908c80');
  return g.outline().rows();
}

// A little cart of file boxes, labelled in a hurry, with one lid not quite on.
function fileCart() {
  const g = new Grid(26, 22);
  g.rect(2, 12, 22, 3, WOOD[2]); g.rect(2, 12, 22, 1, WOOD[3]);
  g.rect(3, 4, 7, 8, '#a88a5a'); g.rect(11, 5, 6, 7, '#8a6a42'); g.rect(18, 3, 6, 9, '#a88a5a');
  g.rect(4, 6, 5, 3, PAPER[2]); g.rect(12, 7, 4, 2, PAPER[2]); g.rect(19, 5, 4, 3, PAPER[2]);
  g.rect(3, 3, 7, 1, WOOD[4]); g.rect(17, 2, 7, 1, WOOD[4]); g.rect(18, 1, 8, 1, PAPER[1]);
  g.rect(4, 15, 3, 3, IRON[1]); g.rect(18, 15, 3, 3, IRON[1]); g.rect(4, 18, 3, 3, IRON[0]); g.rect(18, 18, 3, 3, IRON[0]);
  g.line(0, 5, 3, 14, WOOD[3]); g.rect(0, 4, 2, 2, WOOD[2]);
  return g.outline().rows();
}

// ---------------------------------------------------------------------------------------------
// HOLLIN

// Two posts with a sagging string of triangle flags, faded from the welcome nobody came to.
function bunting() {
  const g = new Grid(56, 34);
  post(g, 2, 5, 34, 2); post(g, 52, 5, 34, 2);
  g.rect(1, 4, 4, 2, WOOD[3]); g.rect(51, 4, 4, 2, WOOD[3]);
  const flagCols = ['#b86a6a', '#d8b86a', '#6a8ab8', '#d8d0b8', '#7aa86a', '#a87ab8', '#d89a6a'];
  for (let i = 0; i <= 46; i++) { const x = 4 + i; const y = 6 + Math.round(Math.sin((i / 46) * 3.14) * 7); g.set(x, y, '#7a6a52'); }
  for (let k = 0; k < 9; k++) {
    const i = 3 + k * 5; const x = 4 + i; const y = 7 + Math.round(Math.sin((i / 46) * 3.14) * 7);
    const c = flagCols[k % flagCols.length];
    g.rect(x, y, 5, 1, c); g.rect(x + 1, y + 1, 3, 1, c); g.rect(x + 2, y + 2, 1, 2, c);
  }
  g.rect(1, 33, 5, 1, MOSS[2]); g.rect(50, 33, 5, 1, MOSS[1]);
  return g.outline().rows();
}

// A long trestle table laid for a feast: a cloth, plates, a mouldy cake with candle stubs, and a banner nobody took down.
function feastTable() {
  const g = new Grid(54, 30);
  g.rect(2, 14, 50, 3, '#d8ccb0'); g.rect(2, 14, 50, 1, '#f0e6cc'); g.rect(1, 17, 52, 6, '#bdb092'); g.rect(1, 22, 52, 1, '#8a7e62');
  for (let i = 0; i < 5; i++) g.rect(3 + i * 11, 22, 2, 7, WOOD[1]);
  for (let i = 0; i < 6; i++) { const x = 4 + i * 8; g.disc(x + 2, 15, 3, 1.2, '#e8e0d0'); g.rect(x + 7, 12, 2, 3, '#b0a890'); }
  g.rect(22, 7, 10, 7, '#e8d8a8'); g.rect(22, 7, 10, 2, '#c87a8a'); g.rect(24, 5, 6, 2, '#d8c898'); g.rect(26, 2, 1, 3, CREAM[1]); g.rect(29, 3, 1, 3, CREAM[1]);
  g.set(27, 9, MOSS[3]); g.set(30, 10, MOSS[2]); g.set(25, 11, MOSS[3]); g.rect(24, 12, 3, 2, '#7a9a6a');
  g.rect(40, 9, 3, 5, '#6a8aa8'); g.rect(44, 10, 3, 4, '#a87a5a');
  return g.outline().rows();
}

// A tuft of mixed wild flowers, for colour.
function wildFlowers() {
  const g = new Grid(16, 14);
  g.line(3, 13, 3, 6, MOSS[2]); g.line(7, 13, 7, 3, MOSS[2]); g.line(11, 13, 12, 5, MOSS[2]); g.line(5, 13, 5, 8, MOSS[1]); g.line(9, 13, 9, 7, MOSS[1]);
  for (const [x, y, c] of [[3, 5, '#e87a8a'], [7, 2, '#f0d870'], [12, 4, '#a89ae8'], [5, 7, '#f0f0e0'], [9, 6, '#e8a050']]) { g.rect(x - 1, y, 3, 2, c); g.set(x, y, WARM[2]); }
  g.rect(1, 13, 14, 1, MOSS[1]);
  return g.rows();
}

export const R3B_PROP_SPRITES = {
  r3b_bell_wrapped: bellWrapped(), r3b_rag_thorn: ragThorn(), r3b_felt_shoes: feltShoes(), r3b_stump_house: stumpHouse(),
  r3b_jar_post: jarPost(), r3b_fallen_giant: fallenGiant(), r3b_quiet_shrine: quietShrine(), r3b_hush_sign: hushSign(),
  r3b_moss_patch: mossPatch(),
  r3b_bedroll: bedroll(), r3b_left_sticks: leftSticks(), r3b_fountain_dry: fountainDry(), r3b_plinth_feet: plinthFeet(),
  r3b_stall: stall(), r3b_banner_pole: bannerPole(), r3b_unfinished_statue: unfinishedStatue(), r3b_laundry_slab: laundrySlab(),
  r3b_book_tower: bookTower(), r3b_globe: globe(), r3b_queue_posts: queuePosts(), r3b_ticket_post: ticketPost(),
  r3b_dust_sheet: dustSheet(), r3b_file_cart: fileCart(),
  r3b_bunting: bunting(), r3b_feast_table: feastTable(), r3b_wild_flowers: wildFlowers(),
};

export const R3B_PALETTE_EXTRA = palette;

// How many tiles wide each wider one stands.
export const R3B_FOOTPRINTS = {
  r3b_fallen_giant: 4, r3b_moss_patch: 2, r3b_felt_shoes: 2, r3b_fountain_dry: 3, r3b_stall: 3, r3b_laundry_slab: 2,
  r3b_queue_posts: 2, r3b_file_cart: 2, r3b_bunting: 4, r3b_feast_table: 4, r3b_rag_thorn: 2,
  r3b_unfinished_statue: 2, r3b_bedroll: 2, r3b_stump_house: 2, r3b_quiet_shrine: 2, r3b_banner_pole: 2, r3b_dust_sheet: 2,
};
