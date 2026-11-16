// Props for the round 3 fun check, chapters 1 and 2 (15 November 2026): the things the dullest rooms were
// missing. A picnic nobody came to, a signpost with opinions, a guide-line tied to the stalagmites, chalk
// notes on the Singing Gallery's rock, the bits of a village at work (loom, bellows, cheese, buns), and a
// sheet over a statue. Drawn like restLife.js: rows of characters from a small painter, 16 pixels to a tile,
// standing on the bottom edge and centred over their footprint. Every id starts `r3a_`. Nothing hangs in the
// air: every line, lamp and sign has its post, hook or peg.
//
//   Outdoors: r3a_picnic r3a_signpost r3a_firering (flat) r3a_thermos r3a_bundle r3a_crack_frost (wall)
//             r3a_cairn_small r3a_rime_fin r3a_summit_tin r3a_snow_stack
//   Caves:    r3a_cord_loop r3a_chalk_note_e r3a_chalk_note_g r3a_chalk_note_d r3a_pale_caps r3a_chalk_arrow
//             r3a_hum_slab r3a_bedroll (flat) r3a_guano (flat) r3a_boot_heap r3a_tea_kit r3a_slate
//   Inside:   r3a_loom r3a_wheel r3a_bellows r3a_quench_tub r3a_tong_rack r3a_horseshoes r3a_cheese
//             r3a_scales r3a_rope_hank r3a_hams r3a_dove_box r3a_geranium r3a_birdcage r3a_knit_basket
//             r3a_buns r3a_flour r3a_wish_bowl r3a_kneeler (flat) r3a_donations r3a_sheeted
//             r3a_welcome_banner r3a_arrivals_board r3a_oil_shelf r3a_hut_table r3a_coal r3a_grindstone
//             r3a_blade_rack r3a_wool_balls (flat) r3a_dust_sheet_chair r3a_bell_cleat

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xaa00 + colors.size);
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

const INK = '#141a22';
const SNOW = ['#7f98b8', '#a8bfd8', '#d4e4f2', '#f6fbff'];
const WOOD = ['#2e2218', '#4e3a28', '#6e5538', '#92764e', '#b89a68'];
const IRON = ['#22262c', '#3c4250', '#5c6676', '#8a94a4'];
const ICE = ['#3a6a92', '#66a0c8', '#a4d4ec', '#e2f6ff'];
const WOOL = { red: ['#6a2a2a', '#a84040', '#d06858'], blue: ['#26405e', '#3e6a98', '#6a9ac8'], green: ['#26452e', '#3e7048', '#68a070'], gold: ['#8a6418', '#c8982c', '#f0cc5c'], grey: ['#4a4e58', '#767c88', '#a4aab4'], cream: ['#a89878', '#d8c8a0', '#f0e4c4'] };
const STONE = ['#3a424c', '#5a6470', '#7e8a98', '#a4b0bc'];
const GRASS = ['#2a4a2c', '#44763c', '#6aa04c', '#92c468'];
const CAVE = ['#1c1a28', '#2e2c40', '#46445e', '#68668a'];
const CHALK = '#eef0f4';
const WARM = ['#a8581e', '#e8982c', '#ffe080'];
const CHEESE = ['#b8861c', '#e8b83c', '#f8dc74'];
const DOUGH = ['#8a5a28', '#c48a48', '#e8b870'];

// A lumpy cap of snow along the top of something.
function snowCap(g, x0, x1, y, h = 2) {
  for (let x = x0; x <= x1; x++) {
    const lump = Math.round(Math.sin(x * 0.9) * 0.7 + (x % 3 === 0 ? 0.6 : 0));
    for (let j = 0; j < h + lump; j++) g.set(x, y - j, j === h + lump - 1 ? SNOW[3] : SNOW[2]);
  }
}

// ---------------------------------------------------------------------------------------------
// OUTDOORS

// A picnic rug with a basket, two cups (one chipped) and a loaf that has become geology.
function picnic() {
  const g = new Grid(32, 16);
  g.rect(3, 6, 26, 8, '#9a3a3a'); g.rect(3, 6, 26, 1, '#c85a52'); g.rect(3, 13, 26, 1, '#6a2222');
  for (let y = 7; y < 13; y += 2) for (let x = 3 + (y % 4 === 1 ? 0 : 2); x < 29; x += 4) g.rect(x, y, 2, 1, '#f0e4d4');
  g.rect(5, 2, 9, 6, WOOD[3]); g.rect(5, 2, 9, 1, WOOD[4]); g.rect(5, 7, 9, 1, WOOD[1]);
  for (let x = 6; x < 14; x += 2) g.rect(x, 4, 1, 3, WOOD[2]);
  g.line(5, 2, 13, 2, WOOD[0]); g.rect(8, 0, 3, 2, WOOD[2]);
  g.rect(17, 7, 3, 3, '#e8e4dc'); g.rect(17, 7, 3, 1, '#ffffff'); g.rect(20, 8, 1, 1, '#e8e4dc');
  g.rect(22, 8, 3, 3, '#e8e4dc'); g.rect(22, 8, 3, 1, '#ffffff'); g.rect(25, 9, 1, 1, '#e8e4dc'); g.set(24, 8, '#9a3a3a');
  g.disc(15, 11, 3, 1.5, '#b08a50'); g.disc(15, 10, 2, 1, '#caa468');
  return g.outline().rows();
}

// A signpost with three boards pointing three ways.
function signpost() {
  const g = new Grid(16, 30);
  g.rect(7, 4, 2, 25, WOOD[2]); g.rect(7, 4, 1, 25, WOOD[3]); g.rect(7, 4, 2, 1, WOOD[4]);
  g.rect(8, 5, 7, 4, WOOD[4]); g.rect(8, 5, 7, 1, '#d2b684'); g.set(15, 6, WOOD[4]); g.set(15, 7, WOOD[4]);
  g.rect(1, 11, 7, 4, WOOD[3]); g.rect(1, 11, 7, 1, WOOD[4]); g.set(0, 12, WOOD[3]); g.set(0, 13, WOOD[3]);
  g.rect(8, 17, 7, 4, WOOD[4]); g.rect(8, 17, 7, 1, '#d2b684');
  for (const [x, y] of [[9, 7], [11, 7], [13, 7], [2, 13], [4, 13], [6, 13], [10, 19], [12, 19]]) g.rect(x, y, 1, 1, WOOD[0]);
  g.rect(5, 27, 6, 2, WOOD[1]);
  return g.outline().rows();
}

// A ring of stones round old ash and a charred stick.
function firering() {
  const g = new Grid(16, 10);
  g.disc(8, 5, 5, 2.4, '#3a3632'); g.disc(8, 5, 3.5, 1.6, '#5a544c');
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    g.disc(8 + Math.cos(a) * 6, 5 + Math.sin(a) * 3, 1.5, 1.1, STONE[2 + (i % 2)]);
  }
  g.line(6, 5, 10, 3, '#241a14');
  return g.outline().rows();
}

// A dented flask with a cup for a lid, lying where it was put down.
function thermos() {
  const g = new Grid(16, 12);
  g.rect(3, 4, 9, 6, IRON[2]); g.rect(3, 4, 9, 1, IRON[3]); g.rect(3, 9, 9, 1, IRON[1]); g.rect(4, 5, 1, 4, IRON[3]);
  g.rect(12, 5, 2, 4, '#a84040'); g.rect(12, 5, 2, 1, '#d06858');
  g.rect(1, 5, 2, 4, WOOL.blue[1]); g.set(1, 5, WOOL.blue[2]);
  g.rect(6, 6, 3, 1, '#c8982c');
  g.set(8, 7, IRON[1]);
  return g.outline().rows();
}

// Firewood tied in a bundle with a cord.
function bundle() {
  const g = new Grid(16, 14);
  for (let i = 0; i < 5; i++) { g.rect(2 + i, 4 + (i % 2), 1, 8, WOOD[2 + (i % 2)]); }
  g.rect(2, 12, 10, 1, WOOD[0]);
  g.disc(12, 8, 1.5, 3, WOOD[3]); g.disc(12, 8, 0.8, 1.6, WOOD[4]);
  g.rect(2, 7, 11, 1, '#d8c8a0'); g.rect(2, 9, 11, 1, '#d8c8a0');
  g.line(6, 6, 7, 3, '#d8c8a0');
  return g.outline().rows();
}

// Frost feathered across a rock face: a crack with white fern fingers.
function crackFrost() {
  const g = new Grid(16, 16);
  g.line(8, 0, 6, 5, STONE[0]); g.line(6, 5, 9, 10, STONE[0]); g.line(9, 10, 7, 15, STONE[0]);
  for (const [x, y, dx] of [[7, 3, -3], [6, 5, -4], [8, 8, 4], [9, 10, 4], [8, 12, -3]]) {
    g.line(x, y, x + dx, y - 1, SNOW[3]); g.line(x + dx, y - 1, x + dx + Math.sign(dx), y - 3, SNOW[2]);
  }
  g.set(6, 5, SNOW[3]); g.set(9, 10, SNOW[3]);
  return g.rows();
}

// A knee-high stack of flat stones: someone's cairn, no taller than a dog.
function cairnSmall() {
  const g = new Grid(16, 14);
  g.disc(8, 11, 6, 2.5, STONE[1]); g.disc(8, 10, 5, 2, STONE[2]);
  g.disc(8, 7, 4, 2, STONE[2]); g.disc(8, 6, 3, 1.3, STONE[3]);
  g.disc(8, 3.5, 2, 1.4, STONE[3]); g.set(8, 2, SNOW[3]); g.set(7, 2, SNOW[3]);
  g.rect(3, 12, 10, 1, STONE[0]);
  return g.outline().rows();
}

// A fin of wind-built rime standing up out of the summit snow, like a frozen wave.
function rimeFin() {
  const g = new Grid(16, 22);
  for (let y = 3; y < 21; y++) {
    const w = Math.max(1, Math.round(1 + Math.sin(((y - 3) / 18) * Math.PI) * 5));
    const lean = Math.round((21 - y) * 0.18);
    g.rect(8 - w + lean, y, w * 2, 1, y % 5 === 0 ? SNOW[1] : SNOW[2]);
    g.set(8 - w + lean, y, SNOW[3]);
    g.set(7 + w + lean, y, SNOW[0]);
  }
  g.rect(3, 19, 11, 2, SNOW[2]); g.rect(3, 20, 11, 1, SNOW[1]);
  for (const [x, y] of [[9, 4], [6, 9], [10, 13]]) { g.set(x, y, '#ffffff'); }
  return g.outline(SNOW[0]).rows();
}

// A tin box wedged in a pile of rocks, a stub of pencil on a string.
function summitTin() {
  const g = new Grid(16, 16);
  g.disc(8, 12, 7, 3, STONE[1]); g.disc(6, 10, 4, 3, STONE[2]); g.disc(11, 10, 3, 2.4, STONE[2]);
  g.rect(4, 5, 8, 6, IRON[2]); g.rect(4, 5, 8, 1, IRON[3]); g.rect(4, 10, 8, 1, IRON[1]);
  g.rect(7, 7, 2, 2, '#c8982c');
  g.line(12, 6, 14, 9, WOOL.red[1]); g.rect(14, 9, 1, 3, WOOD[3]);
  g.rect(3, 4, 10, 1, SNOW[3]); g.rect(4, 3, 8, 1, SNOW[2]);
  return g.outline().rows();
}

// A very small snowman on a very high place: stone eyes, a stick, one glove.
function snowStack() {
  const g = new Grid(16, 22);
  g.disc(8, 17, 6, 4, SNOW[2]); g.disc(7, 16, 4, 2.4, SNOW[3]);
  g.disc(8, 10, 4.4, 3.6, SNOW[2]); g.disc(7, 9, 2.6, 2, SNOW[3]);
  g.disc(8, 4, 3, 2.6, SNOW[3]); g.set(7, 3, STONE[0]); g.set(9, 3, STONE[0]);
  g.set(8, 5, '#c8782c'); g.set(9, 5, '#c8782c');
  g.line(1, 8, 5, 10, WOOD[2]); g.line(11, 10, 15, 7, WOOD[2]); g.rect(14, 5, 2, 3, WOOL.red[1]);
  g.set(8, 9, STONE[0]); g.set(8, 12, STONE[0]); g.set(8, 15, STONE[0]);
  return g.outline(SNOW[0]).rows();
}

// ---------------------------------------------------------------------------------------------
// CAVES

// A guide-line: a rope pulled taut round the foot of a stalagmite (this stands on the tile just south of the
// spike and reaches up over it), tied off, one end trailing across the floor.
function cordLoop() {
  const g = new Grid(16, 32);
  g.line(3, 9, 12, 11, '#b4a478'); g.line(3, 8, 12, 10, '#d8c8a0'); g.line(3, 12, 12, 14, '#b4a478'); g.line(3, 11, 12, 13, '#d8c8a0');
  g.rect(7, 9, 3, 5, '#d8c8a0'); g.rect(8, 10, 1, 3, '#8a7a56');
  g.line(8, 14, 6, 22, '#d8c8a0'); g.line(6, 22, 3, 27, '#b4a478'); g.line(3, 27, 8, 29, '#d8c8a0'); g.line(8, 29, 14, 27, '#b4a478');
  g.line(14, 27, 15, 30, '#d8c8a0');
  return g.rows();
}

// A chalked letter on a stalagmite (this stands on the tile just south of the spike and reaches up over it),
// big enough to read: someone has tuned the gallery.
function chalkNote(letter) {
  const g = new Grid(16, 32);
  const glyph = {
    E: ['111', '100', '110', '100', '111'],
    G: ['011', '100', '101', '101', '011'],
    D: ['110', '101', '101', '101', '110'],
  }[letter];
  glyph.forEach((row, j) => [...row].forEach((c, i) => { if (c === '1') g.set(6 + i, 5 + j, CHALK); }));
  g.set(10, 5, CHALK); g.set(11, 6, CHALK);
  g.set(5, 12, CHALK + 'aa'); g.set(11, 11, CHALK + 'aa');
  g.set(7, 28, CHALK + '88'); g.set(9, 29, CHALK + '88');
  return g.rows();
}

// Pale, faintly lit toadstools crowded in a crack of the rock.
function paleCaps() {
  const g = new Grid(16, 12);
  g.rect(2, 9, 12, 2, CAVE[1]);
  const cap = (x, y, r) => {
    g.rect(x, y + 1, 1, 8 - y, '#b8c8d0'); g.disc(x, y, r, r * 0.6, '#a8d8e0'); g.disc(x - 1, y - 1, r * 0.5, 0.6, '#e8fcff');
    g.set(x + 1, y + 1, '#78b8c8');
  };
  cap(4, 6, 2.4); cap(9, 4, 3); cap(12, 7, 2);
  return g.outline('#1c2a34').rows();
}

// A chalk arrow on the wall, pointing the way up.
function chalkArrow() {
  const g = new Grid(16, 10);
  g.line(2, 5, 12, 5, CHALK); g.line(2, 6, 12, 6, CHALK + 'cc');
  g.line(12, 5, 9, 2, CHALK); g.line(12, 5, 9, 8, CHALK);
  g.set(3, 3, CHALK + '88'); g.set(14, 7, CHALK + '88');
  return g.rows();
}

// A flat slab of rock polished smooth by palms.
function humSlab() {
  const g = new Grid(16, 12);
  g.disc(8, 8, 7, 3.4, CAVE[2]); g.disc(8, 7, 6, 2.8, CAVE[3]);
  g.disc(8, 6.6, 3.4, 1.4, '#8a88b0');
  for (const [x, y] of [[6, 6], [8, 5], [10, 6]]) g.set(x, y, '#c4c2e0');
  return g.outline('#14121e').rows();
}

// A bedroll frozen into the shape of whoever left it.
function bedroll() {
  const g = new Grid(32, 12);
  g.disc(16, 7, 14, 3.6, WOOL.green[1]); g.disc(16, 6, 13, 2.8, WOOL.green[2]);
  g.disc(5, 6, 4, 2.4, WOOL.cream[1]); g.disc(5, 5.5, 3, 1.6, WOOL.cream[2]);
  g.line(8, 4, 8, 9, WOOL.green[0]); g.line(16, 3, 16, 9, WOOL.green[0]); g.line(24, 4, 24, 9, WOOL.green[0]);
  for (let x = 6; x < 28; x += 3) g.set(x, 3, SNOW[3]);
  g.set(18, 4, SNOW[3]); g.set(22, 5, SNOW[3]);
  return g.outline().rows();
}

// A heap of bat leavings, deep, with a hat-sized dent in the top.
function guano() {
  const g = new Grid(32, 14);
  g.disc(16, 9, 14, 4, '#3a342c'); g.disc(14, 8, 10, 3, '#4e463a'); g.disc(12, 7, 6, 2, '#6a6048');
  for (const [x, y] of [[8, 9], [20, 8], [24, 10], [14, 11], [6, 11]]) g.rect(x, y, 2, 1, '#7a7054');
  g.rect(10, 4, 3, 2, '#8a8068');
  return g.outline().rows();
}

// A heap of boots, no two a pair, with a price chalked on a tag.
function bootHeap() {
  const g = new Grid(32, 18);
  const boot = (x, y, c) => { g.rect(x, y, 4, 7, c); g.rect(x, y + 6, 7, 2, WOOD[0]); g.rect(x, y, 4, 1, WOOD[3]); g.set(x + 3, y + 2, IRON[3]); };
  boot(3, 8, WOOD[1]); boot(9, 6, WOOL.red[0]); boot(15, 8, WOOD[2]); boot(21, 6, '#3a4a3a'); boot(12, 2, WOOD[1]); boot(18, 3, WOOD[3]);
  g.rect(24, 3, 5, 4, CHALK); g.set(26, 4, '#6a2a2a'); g.set(27, 5, '#6a2a2a'); g.line(24, 3, 22, 8, '#d8c8a0');
  g.rect(2, 15, 28, 2, WOOD[0]);
  return g.outline().rows();
}

// A tea kit on a flat stone: a spirit stove, a blackened kettle, two cups.
function teaKit() {
  const g = new Grid(16, 14);
  g.disc(8, 11, 7, 2.6, STONE[1]); g.disc(8, 10, 6, 2, STONE[2]);
  g.rect(3, 4, 7, 6, IRON[1]); g.rect(3, 4, 7, 1, IRON[2]); g.rect(10, 5, 3, 1, IRON[2]); g.rect(12, 4, 1, 2, IRON[2]);
  g.rect(5, 2, 3, 2, IRON[2]);
  g.rect(11, 8, 3, 3, '#e8e4dc'); g.rect(11, 8, 3, 1, '#ffffff'); g.rect(1, 9, 2, 2, '#e8e4dc');
  g.set(5, 9, WARM[1]);
  return g.outline().rows();
}

// A slate on a stick with chalk writing, planted in the floor.
function slate() {
  const g = new Grid(16, 20);
  g.rect(7, 9, 2, 10, WOOD[2]);
  g.rect(2, 2, 12, 9, WOOD[1]); g.rect(3, 3, 10, 7, '#2e3a36');
  for (const y of [4, 6, 8]) g.rect(4, y, 7 - (y % 3), 1, CHALK);
  g.rect(5, 18, 6, 1, WOOD[0]);
  return g.outline().rows();
}

// ---------------------------------------------------------------------------------------------
// INDOORS

// A loom with a scarf on it that is already longer than the loom.
function loom() {
  const g = new Grid(32, 32);
  g.rect(3, 3, 3, 27, WOOD[2]); g.rect(26, 3, 3, 27, WOOD[2]); g.rect(3, 3, 1, 27, WOOD[3]); g.rect(26, 3, 1, 27, WOOD[3]);
  g.rect(3, 3, 26, 3, WOOD[3]); g.rect(3, 3, 26, 1, WOOD[4]); g.rect(2, 28, 28, 3, WOOD[1]);
  for (let x = 8; x < 26; x += 2) g.line(x, 6, x, 18, '#d8d0b8');
  g.rect(7, 18, 19, 8, WOOL.red[1]);
  for (let y = 19; y < 26; y += 2) g.rect(7, y, 19, 1, WOOL.gold[1]);
  g.rect(7, 18, 19, 1, WOOL.red[2]);
  g.rect(7, 26, 19, 3, WOOL.blue[1]); g.rect(7, 27, 19, 1, WOOL.blue[2]); g.rect(14, 28, 6, 3, WOOL.red[1]);
  g.rect(12, 29, 14, 2, WOOL.gold[1]); g.rect(18, 30, 10, 1, WOOL.red[1]);
  g.rect(7, 5, 19, 2, WOOD[2]);
  g.rect(8, 14, 17, 1, WOOD[0]);
  return g.outline().rows();
}

// A spinning wheel with wool on the distaff.
function wheel() {
  const g = new Grid(16, 22);
  g.disc(6, 14, 5.4, 5.4, WOOD[2]); g.disc(6, 14, 4, 4, null); g.disc(6, 14, 1.2, 1.2, WOOD[4]);
  for (let a = 0; a < 6; a++) g.line(6, 14, 6 + Math.cos(a * 1.047) * 5, 14 + Math.sin(a * 1.047) * 5, WOOD[3]);
  g.rect(10, 14, 5, 2, WOOD[2]); g.rect(12, 16, 1, 5, WOOD[1]); g.rect(3, 19, 10, 2, WOOD[1]);
  g.rect(13, 6, 2, 9, WOOD[2]); g.disc(14, 5, 2, 2.4, WOOL.cream[2]); g.disc(13, 4, 1, 1.4, '#ffffff');
  return g.outline().rows();
}

// Bellows: leather and wood, a nozzle pointing at the hearth.
function bellows() {
  const g = new Grid(16, 16);
  g.rect(2, 4, 10, 8, WOOD[3]); g.rect(2, 4, 10, 1, WOOD[4]);
  for (let y = 6; y < 11; y += 2) g.rect(3, y, 8, 1, '#5a3a22');
  g.rect(12, 7, 3, 2, IRON[2]); g.rect(14, 6, 1, 4, IRON[1]);
  g.rect(1, 2, 3, 3, WOOD[2]); g.rect(3, 11, 6, 3, WOOD[2]); g.rect(0, 14, 14, 1, WOOD[0]);
  return g.outline().rows();
}

// A barrel of black water with a ladle: the quench tub.
function quenchTub() {
  const g = new Grid(16, 16);
  g.rect(2, 4, 12, 11, WOOD[2]); g.rect(2, 4, 12, 1, WOOD[3]); g.rect(2, 14, 12, 1, WOOD[0]);
  g.rect(2, 7, 12, 1, IRON[2]); g.rect(2, 12, 12, 1, IRON[2]);
  g.disc(8, 4, 6, 1.6, '#1c2a34'); g.disc(8, 4, 4, 0.8, '#2e4a5e'); g.set(6, 4, '#8ab4c8');
  g.line(11, 1, 10, 6, WOOD[3]);
  return g.outline().rows();
}

// Tongs and a hammer hung on a rack against the wall (it has its own board).
function tongRack() {
  const g = new Grid(16, 18);
  g.rect(1, 3, 14, 12, WOOD[1]); g.rect(1, 3, 14, 1, WOOD[2]);
  g.rect(2, 5, 12, 1, WOOD[0]);
  for (const x of [3, 6, 9, 12]) { g.rect(x, 4, 1, 2, IRON[3]); g.rect(x, 6, 1, 8, IRON[2]); g.set(x + 1, 13, IRON[1]); g.set(x - 1, 14, IRON[1]); }
  g.rect(7, 7, 3, 2, IRON[2]); g.rect(8, 9, 1, 5, WOOD[3]);
  return g.outline().rows();
}

// Horseshoes on nails: a row of luck, the open ends all up.
function horseshoes() {
  const g = new Grid(16, 12);
  g.rect(0, 9, 16, 2, WOOD[1]); g.rect(0, 9, 16, 1, WOOD[2]);
  for (const x of [3, 8, 13]) {
    g.disc(x, 5, 2.6, 2.6, IRON[2]); g.disc(x, 5, 1.2, 1.2, null); g.rect(x - 1, 2, 3, 2, null);
    g.set(x - 2, 2, IRON[3]); g.set(x + 2, 2, IRON[3]); g.set(x, 7, IRON[1]);
  }
  return g.outline().rows();
}

// A stack of cheese wheels, one with a wedge out of it.
function cheese() {
  const g = new Grid(16, 16);
  const wheelAt = (y, w) => { g.disc(8, y, w, 2.4, CHEESE[1]); g.rect(8 - w, y, w * 2 + 1, 3, CHEESE[1]); g.disc(8, y + 3, w, 1.4, CHEESE[0]); g.disc(8, y - 0.5, w - 1, 1.4, CHEESE[2]); };
  wheelAt(10, 6); wheelAt(6, 5);
  g.rect(8, 4, 5, 6, null); g.rect(9, 6, 4, 4, CHEESE[2]); g.set(10, 7, CHEESE[0]); g.set(11, 8, CHEESE[0]);
  g.rect(3, 13, 10, 2, WOOD[1]);
  return g.outline().rows();
}

// A set of brass scales with a loaf in one pan and weights in the other.
function scales() {
  const g = new Grid(16, 16);
  g.rect(6, 13, 4, 2, WOOD[1]); g.rect(7, 4, 2, 10, '#b8982c'); g.rect(2, 3, 12, 1, '#d8b84c');
  g.line(3, 4, 3, 8, '#8a7020'); g.line(12, 4, 12, 9, '#8a7020');
  g.rect(1, 8, 5, 1, '#d8b84c'); g.rect(10, 9, 5, 1, '#d8b84c');
  g.disc(3, 7, 2, 1.2, DOUGH[2]); g.rect(11, 7, 3, 2, IRON[2]);
  return g.outline().rows();
}

// Coils of rope on a peg board, all sizes, none for sale.
function ropeHank() {
  const g = new Grid(16, 16);
  g.rect(2, 12, 12, 2, WOOD[1]);
  g.disc(5, 9, 3.4, 3.6, '#c4a868'); g.disc(5, 9, 1.4, 1.6, null);
  g.disc(11, 8, 3, 4, '#a88a50'); g.disc(11, 8, 1.2, 2, null);
  g.disc(8, 4, 2.4, 2.4, '#d8bc7c'); g.disc(8, 4, 1, 1, null);
  for (const [x, y] of [[3, 7], [6, 11], [10, 6], [12, 10]]) g.set(x, y, '#7a6238');
  return g.outline().rows();
}

// Smoked hams hanging from a rail on the wall, each with its own hook.
function hams() {
  const g = new Grid(32, 22);
  g.rect(1, 2, 30, 2, WOOD[2]); g.rect(1, 2, 30, 1, WOOD[3]);
  for (const x of [5, 12, 19, 26]) {
    g.line(x, 4, x, 6, IRON[2]);
    g.disc(x, 11, 3, 5, '#8a4a38'); g.disc(x - 1, 10, 1.6, 3, '#b0705a'); g.rect(x - 1, 15, 3, 3, '#e8d8c0'); g.set(x, 6, IRON[3]);
  }
  return g.outline().rows();
}

// A dovecote box on a post, one dove in the door.
function doveBox() {
  const g = new Grid(16, 24);
  g.rect(7, 12, 2, 11, WOOD[2]); g.rect(3, 22, 10, 1, WOOD[0]);
  g.rect(3, 5, 10, 8, WOOD[3]); g.rect(3, 5, 10, 1, WOOD[4]); g.rect(3, 12, 10, 1, WOOD[1]);
  g.rect(2, 3, 12, 2, '#7a4a3a'); g.rect(4, 1, 8, 2, '#8a5440'); g.rect(6, 0, 4, 1, '#9a6048');
  g.disc(8, 9, 2, 2, '#2a2420'); g.disc(8, 9, 1.4, 1.5, '#d8dce4'); g.set(9, 8, '#c8782c'); g.set(8, 9, INK);
  g.rect(5, 13, 6, 1, WOOD[4]);
  return g.outline().rows();
}

// A red geranium in a clay pot, doing very well for the weather.
function geranium() {
  const g = new Grid(16, 16);
  g.rect(4, 9, 8, 6, '#a8582e'); g.rect(3, 8, 10, 2, '#c8703e'); g.rect(4, 14, 8, 1, '#7a3a1e');
  g.disc(8, 6, 5, 3.4, GRASS[1]); g.disc(6, 5, 2.6, 2, GRASS[2]);
  for (const [x, y] of [[5, 4], [9, 3], [11, 6], [7, 7]]) { g.disc(x, y, 1.6, 1.6, '#d83a3a'); g.set(x, y, '#ffa0a0'); }
  return g.outline().rows();
}

// A birdcage on a stand with a plump finch who is not impressed.
function birdcage() {
  const g = new Grid(16, 24);
  g.rect(7, 12, 2, 10, IRON[1]); g.rect(4, 22, 8, 1, IRON[0]);
  g.disc(8, 7, 5, 5, null);
  for (let x = 3; x <= 13; x += 2) g.line(x, 2, x, 12, '#b8982c');
  g.rect(3, 12, 11, 1, '#8a7020'); g.rect(3, 1, 11, 1, '#d8b84c'); g.rect(7, 0, 2, 1, '#d8b84c');
  g.disc(8, 9, 2.6, 2, '#c85a3a'); g.disc(8, 8, 1.6, 1.4, '#f0a070'); g.set(10, 8, '#e8d050'); g.set(7, 8, INK);
  g.line(4, 10, 12, 10, WOOD[3]);
  return g.outline().rows();
}

// A basket of wool balls with the needles stuck in, mid-row.
function knitBasket() {
  const g = new Grid(16, 16);
  g.rect(2, 8, 12, 6, WOOD[3]); g.rect(2, 8, 12, 1, WOOD[4]); g.rect(2, 13, 12, 1, WOOD[1]);
  for (let x = 3; x < 13; x += 2) g.rect(x, 9, 1, 4, WOOD[2]);
  g.disc(5, 6, 3, 3, WOOL.red[1]); g.disc(5, 5, 1.6, 1.4, WOOL.red[2]);
  g.disc(10, 6, 3, 3, WOOL.blue[1]); g.disc(10, 5, 1.6, 1.4, WOOL.blue[2]);
  g.line(7, 1, 10, 7, WOOD[4]); g.line(9, 1, 7, 7, WOOD[4]); g.set(7, 1, '#d8b84c'); g.set(9, 1, '#d8b84c');
  g.line(5, 9, 14, 11, WOOL.red[2]);
  return g.outline().rows();
}

// A tray of cooling buns under a cloth with one corner flipped.
function buns() {
  const g = new Grid(16, 14);
  g.rect(1, 10, 14, 2, IRON[2]); g.rect(1, 10, 14, 1, IRON[3]);
  for (const x of [4, 8, 12]) { g.disc(x, 8, 2.6, 2.4, DOUGH[1]); g.disc(x - 1, 7, 1.4, 1, DOUGH[2]); g.set(x + 1, 9, DOUGH[0]); }
  g.rect(1, 4, 8, 3, '#eae4d8'); g.rect(1, 4, 8, 1, '#ffffff');
  return g.outline().rows();
}

// A flour sack, open, a scoop standing in it, a white handprint on the side.
function flour() {
  const g = new Grid(16, 18);
  g.disc(8, 12, 6, 5, '#c8b890'); g.disc(7, 11, 4, 3.4, '#e4d8b8');
  g.rect(3, 6, 10, 3, '#c8b890'); g.rect(4, 5, 8, 2, '#f4f0e8'); g.rect(5, 4, 6, 1, '#ffffff');
  g.line(11, 0, 9, 5, WOOD[3]); g.rect(8, 5, 4, 1, IRON[2]);
  g.rect(9, 11, 3, 3, '#ffffff'); g.set(9, 10, '#ffffff'); g.set(11, 10, '#ffffff'); g.set(12, 10, '#ffffff');
  g.rect(3, 16, 10, 1, '#8a7850');
  return g.outline().rows();
}

// A wooden bowl of folded paper slips.
function wishBowl() {
  const g = new Grid(16, 14);
  g.disc(8, 10, 6, 3, WOOD[2]); g.rect(2, 8, 12, 3, WOOD[2]); g.rect(2, 8, 12, 1, WOOD[4]);
  g.disc(8, 8, 5, 1.6, WOOD[1]);
  for (const [x, y, c] of [[5, 6, '#f0e4c4'], [8, 4, '#f4f0e8'], [10, 6, '#e8d8b0'], [7, 7, '#f0e4c4'], [11, 8, '#f4f0e8'], [4, 8, '#e8d8b0']]) {
    g.rect(x, y, 3, 2, c); g.set(x + 1, y, '#9a8a6a');
  }
  g.rect(4, 12, 8, 1, WOOD[0]);
  return g.outline().rows();
}

// A knee cushion on the floor, worn flat in the middle.
function kneeler() {
  const g = new Grid(16, 10);
  g.disc(8, 6, 6, 2.6, WOOL.red[1]); g.disc(8, 5, 5, 1.8, WOOL.red[2]); g.disc(8, 6, 2.6, 1, WOOL.red[0]);
  g.set(2, 6, '#d8b84c'); g.set(14, 6, '#d8b84c');
  return g.outline().rows();
}

// A box for coins with a slot, a chalk label, and a handful of buttons showing through.
function donations() {
  const g = new Grid(16, 18);
  g.rect(3, 6, 10, 10, WOOD[2]); g.rect(3, 6, 10, 1, WOOD[4]); g.rect(3, 15, 10, 1, WOOD[0]);
  g.rect(2, 4, 12, 2, WOOD[1]); g.rect(5, 6, 6, 1, INK);
  g.rect(5, 9, 6, 4, CHALK); g.rect(6, 10, 4, 1, '#6a4a3a'); g.rect(6, 12, 3, 1, '#6a4a3a');
  g.rect(7, 2, 2, 2, '#c8982c');
  return g.outline().rows();
}

// A statue under a bedsheet, tied with a bow, waiting.
function sheeted() {
  const g = new Grid(16, 32);
  g.rect(2, 26, 12, 5, STONE[1]); g.rect(2, 26, 12, 1, STONE[2]); g.rect(1, 30, 14, 1, STONE[0]);
  g.disc(8, 20, 6, 7, '#e8e4dc'); g.rect(2, 19, 12, 8, '#e8e4dc'); g.disc(8, 8, 3.8, 4.4, '#e8e4dc'); g.rect(4, 11, 8, 10, '#e8e4dc');
  g.disc(8, 4, 2.4, 2, '#f4f2ec');
  for (const x of [3, 6, 9, 12]) g.line(x, 20, x + (x < 8 ? -1 : 1), 26, '#c8c4b8');
  g.line(5, 10, 5, 18, '#c8c4b8'); g.line(11, 10, 11, 18, '#c8c4b8');
  g.rect(6, 13, 4, 1, WOOL.red[1]); g.set(5, 14, WOOL.red[1]); g.set(10, 14, WOOL.red[1]);
  g.rect(1, 25, 14, 1, '#d8d4c8');
  return g.outline().rows();
}

// A welcome banner, repainted so often the lettering is lumpy.
function welcomeBanner() {
  const g = new Grid(32, 16);
  g.rect(1, 1, 30, 2, WOOD[2]); g.rect(1, 1, 30, 1, WOOD[3]);
  g.rect(3, 3, 26, 10, '#a84040'); g.rect(3, 3, 26, 1, '#d06858');
  g.rect(3, 12, 26, 1, '#6a2a2a');
  for (let x = 3; x < 29; x += 4) g.rect(x, 13, 2, 2, '#a84040');
  for (let x = 5; x < 26; x += 3) g.rect(x, 6, 2, 3, '#f0e4c4');
  for (let x = 6; x < 24; x += 3) g.rect(x, 10, 2, 1, '#f0e4c4');
  g.rect(2, 1, 1, 3, WOOD[1]); g.rect(29, 1, 1, 3, WOOD[1]);
  return g.outline().rows();
}

// A board of tally marks and gaps: dates, and who arrived.
function arrivalsBoard() {
  const g = new Grid(32, 22);
  g.rect(2, 2, 28, 18, WOOD[1]); g.rect(3, 3, 26, 16, '#2e3a36'); g.rect(2, 2, 28, 1, WOOD[3]); g.rect(2, 19, 28, 1, WOOD[0]);
  g.rect(14, 3, 1, 16, WOOD[2]);
  for (let y = 5; y < 18; y += 3) { g.rect(5, y, 6, 1, CHALK); g.rect(17, y, 7 - (y % 2) * 2, 1, CHALK + 'cc'); }
  g.rect(5, 17, 5, 1, CHALK); g.rect(26, 15, 2, 2, '#c85a52');
  g.rect(5, 20, 22, 1, WOOD[0]);
  return g.outline().rows();
}

// A shelf of oil tins and wicks against the wall.
function oilShelf() {
  const g = new Grid(16, 22);
  g.rect(0, 14, 16, 2, WOOD[2]); g.rect(0, 14, 16, 1, WOOD[3]); g.rect(0, 6, 16, 2, WOOD[2]); g.rect(0, 6, 16, 1, WOOD[3]);
  g.rect(1, 7, 1, 7, WOOD[0]); g.rect(14, 7, 1, 7, WOOD[0]); g.rect(1, 15, 1, 6, WOOD[0]); g.rect(14, 15, 1, 6, WOOD[0]);
  for (const x of [3, 7]) { g.rect(x, 9, 3, 5, IRON[2]); g.rect(x, 9, 3, 1, IRON[3]); g.set(x + 1, 11, '#c8982c'); g.rect(x + 1, 7, 1, 2, IRON[1]); }
  for (const x of [11, 13]) { g.rect(x, 11, 2, 3, '#e8e0c8'); g.rect(x, 11, 2, 1, '#ffffff'); }
  for (const x of [3, 7, 11]) g.rect(x, 2, 2, 4, '#d8c8a0');
  g.rect(3, 17, 4, 4, IRON[2]); g.rect(3, 17, 4, 1, IRON[3]); g.rect(9, 18, 4, 3, '#e8e0c8');
  return g.outline().rows();
}

// A small round table: two mugs, a candle stub, a hand of cards face down.
function hutTable() {
  const g = new Grid(16, 18);
  g.rect(7, 9, 2, 8, WOOD[1]); g.rect(4, 16, 8, 1, WOOD[0]);
  g.disc(8, 8, 7, 3, WOOD[3]); g.disc(8, 7, 6, 2.2, WOOD[4]);
  g.rect(2, 3, 3, 4, '#e8e4dc'); g.rect(2, 3, 3, 1, '#ffffff'); g.rect(5, 4, 1, 2, '#e8e4dc');
  g.rect(11, 4, 3, 3, '#a84040'); g.rect(11, 4, 3, 1, '#d06858');
  g.rect(7, 3, 2, 4, '#f0e4c4'); g.set(7, 2, WARM[2]); g.set(8, 1, WARM[1]);
  return g.outline().rows();
}

// A heap of coal beside the fire, with a shovel in it.
function coal() {
  const g = new Grid(16, 14);
  g.disc(8, 10, 7, 3.6, '#181a20'); g.disc(7, 8, 5, 3, '#22262e'); g.disc(6, 6, 3, 2, '#2e323c');
  for (const [x, y] of [[4, 8], [9, 7], [11, 10], [6, 10]]) g.set(x, y, '#5a5e6a');
  g.line(12, 2, 9, 9, WOOD[3]); g.rect(7, 9, 4, 2, IRON[2]);
  return g.outline().rows();
}

// A grindstone in a trough, the wheel wet and bright.
function grindstone() {
  const g = new Grid(16, 18);
  g.rect(2, 13, 12, 3, WOOD[1]); g.rect(2, 13, 12, 1, WOOD[3]); g.rect(3, 16, 2, 1, WOOD[0]); g.rect(11, 16, 2, 1, WOOD[0]);
  g.disc(8, 8, 5.6, 5.6, STONE[2]); g.disc(8, 8, 4, 4, STONE[3]); g.disc(8, 8, 1.2, 1.2, IRON[1]);
  g.line(8, 8, 13, 3, IRON[2]); g.rect(13, 1, 2, 3, WOOD[3]);
  g.rect(4, 12, 8, 1, '#5a8aa8');
  return g.outline().rows();
}

// A rack of unfinished blades, hilts on, no edges yet.
function bladeRack() {
  const g = new Grid(16, 22);
  g.rect(2, 1, 12, 2, WOOD[2]); g.rect(2, 19, 12, 2, WOOD[2]); g.rect(1, 1, 1, 20, WOOD[1]); g.rect(14, 1, 1, 20, WOOD[1]);
  for (const x of [4, 7, 10]) { g.rect(x, 4, 2, 14, IRON[2]); g.rect(x, 4, 1, 14, IRON[3]); g.rect(x - 1, 14, 4, 1, WOOD[3]); g.rect(x, 15, 2, 3, WOOD[1]); }
  return g.outline().rows();
}

// Balls of wool spilled over the floor, trailing threads.
function woolBalls() {
  const g = new Grid(32, 12);
  g.disc(7, 7, 3.4, 3, WOOL.red[1]); g.disc(6, 6, 1.6, 1.4, WOOL.red[2]);
  g.disc(15, 6, 2.6, 2.4, WOOL.blue[1]); g.disc(14, 5, 1.2, 1, WOOL.blue[2]);
  g.disc(24, 7, 3, 2.8, WOOL.gold[1]); g.disc(23, 6, 1.4, 1.2, WOOL.gold[2]);
  g.line(10, 8, 13, 9, WOOL.red[2]); g.line(13, 9, 21, 9, WOOL.blue[2]); g.line(18, 8, 21, 8, WOOL.gold[2]);
  g.line(26, 9, 30, 10, WOOL.gold[2]);
  return g.outline().rows();
}

// A chair under a dust sheet, as if it's got a ghost in it.
function dustSheetChair() {
  const g = new Grid(16, 22);
  g.rect(2, 4, 12, 16, '#e8e4dc'); g.rect(2, 4, 12, 1, '#ffffff'); g.rect(3, 3, 10, 1, '#f4f2ec');
  g.rect(1, 16, 14, 5, '#e8e4dc'); g.rect(1, 20, 14, 1, '#c8c4b8');
  for (const x of [5, 8, 11]) g.line(x, 6, x, 19, '#c8c4b8');
  g.rect(3, 19, 2, 2, WOOD[1]); g.rect(11, 19, 2, 2, WOOD[1]);
  return g.outline().rows();
}

// A cleat on the tower floor with the bell rope coiled and a little tuft of wool where hands go.
function bellCleat() {
  const g = new Grid(16, 14);
  g.rect(3, 10, 10, 2, WOOD[2]); g.rect(3, 10, 10, 1, WOOD[3]);
  g.rect(5, 7, 6, 3, IRON[2]); g.rect(4, 6, 2, 2, IRON[3]); g.rect(10, 6, 2, 2, IRON[3]);
  g.disc(8, 5, 5, 2.4, '#d8c8a0'); g.disc(8, 5, 3, 1.2, null); g.disc(8, 4, 5, 1.4, '#c4a868');
  g.rect(6, 2, 4, 2, WOOL.red[1]); g.set(7, 1, WOOL.red[2]); g.set(8, 1, WOOL.red[2]);
  return g.outline().rows();
}

export const R3A_PROP_SPRITES = {
  r3a_picnic: picnic(),
  r3a_signpost: signpost(),
  r3a_firering: firering(),
  r3a_thermos: thermos(),
  r3a_bundle: bundle(),
  r3a_crack_frost: crackFrost(),
  r3a_cairn_small: cairnSmall(),
  r3a_rime_fin: rimeFin(),
  r3a_summit_tin: summitTin(),
  r3a_snow_stack: snowStack(),
  r3a_cord_loop: cordLoop(),
  r3a_chalk_note_e: chalkNote('E'),
  r3a_chalk_note_g: chalkNote('G'),
  r3a_chalk_note_d: chalkNote('D'),
  r3a_pale_caps: paleCaps(),
  r3a_chalk_arrow: chalkArrow(),
  r3a_hum_slab: humSlab(),
  r3a_bedroll: bedroll(),
  r3a_guano: guano(),
  r3a_boot_heap: bootHeap(),
  r3a_tea_kit: teaKit(),
  r3a_slate: slate(),
  r3a_loom: loom(),
  r3a_wheel: wheel(),
  r3a_bellows: bellows(),
  r3a_quench_tub: quenchTub(),
  r3a_tong_rack: tongRack(),
  r3a_horseshoes: horseshoes(),
  r3a_cheese: cheese(),
  r3a_scales: scales(),
  r3a_rope_hank: ropeHank(),
  r3a_hams: hams(),
  r3a_dove_box: doveBox(),
  r3a_geranium: geranium(),
  r3a_birdcage: birdcage(),
  r3a_knit_basket: knitBasket(),
  r3a_buns: buns(),
  r3a_flour: flour(),
  r3a_wish_bowl: wishBowl(),
  r3a_kneeler: kneeler(),
  r3a_donations: donations(),
  r3a_sheeted: sheeted(),
  r3a_welcome_banner: welcomeBanner(),
  r3a_arrivals_board: arrivalsBoard(),
  r3a_oil_shelf: oilShelf(),
  r3a_hut_table: hutTable(),
  r3a_coal: coal(),
  r3a_grindstone: grindstone(),
  r3a_blade_rack: bladeRack(),
  r3a_wool_balls: woolBalls(),
  r3a_dust_sheet_chair: dustSheetChair(),
  r3a_bell_cleat: bellCleat(),
};

export const R3A_PALETTE = palette;

// How many tiles wide each big one stands.
export const R3A_FOOTPRINTS = {
  r3a_picnic: 2,
  r3a_bedroll: 2,
  r3a_guano: 2,
  r3a_boot_heap: 2,
  r3a_loom: 2,
  r3a_hams: 2,
  r3a_welcome_banner: 2,
  r3a_arrivals_board: 2,
  r3a_wool_balls: 2,
};
