// Set dressing for chapter 1's Ruins (the life pass, round 2, 15 November 2026): the
// things the waiting left behind. Torn banners, a cabinet of post nobody collected, a
// worn bench, a mouse's door, candle stubs, rubble and ferns in the cracks; and in Taper's
// house the cat's wool, boots by the door, a stopped clock, a gnome in a wick hat.
// Drawn like diggingsDressing.js (a tiny painter, 16 pixels to a tile, standing on the
// bottom edge and centred over the footprint). Every id starts `r1_`. Every one is
// placed `walkable` in the rooms, so none of them can stand in the way of a lever, a
// gate, a block, a monster or a cutscene walk.

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xc400 + colors.size);
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

  oval(cx, cy, rx, ry, c) {
    for (let dy = -ry; dy <= ry; dy++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.25))));
      this.rect(cx - w, cy + dy, w * 2 + 1, 1, c);
    }
  }

  line(x0, y0, x1, y1, c) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) this.set(x0 + ((x1 - x0) * i) / steps, y0 + ((y1 - y0) * i) / steps, c);
  }

  dots(list, c) {
    for (const [x, y] of list) this.set(x, y, c);
  }

  // A lit block: light top edge, body, dark underside.
  box(x, y, w, h, [dark, mid, light]) {
    this.rect(x, y, w, h, mid);
    this.rect(x, y, w, 1, light);
    this.rect(x, y + h - 1, w, 1, dark);
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

const OUT = '#100c1c';
const WARM = '#1a1410';
const STONE = ['#1c1830', '#2c2644', '#463e66', '#6a608e'];
const MOSS = ['#1e3a24', '#2f5a34', '#4a8444', '#78b060'];
const WOOD = ['#2a1c10', '#4a3018', '#7a5630', '#a77a48'];
const IRON = ['#22202c', '#46445a', '#74728c', '#a09eb6'];
const WAX = ['#b8a890', '#e8dcc4', '#f6eed8'];
const PAPER = ['#a89c7c', '#cbbf9c', '#e8e0c4'];
const CLOTH = ['#3a1424', '#5e2438', '#86384e'];
const FADED = ['#3a3250', '#5a4e6e', '#7e7094'];
const CHALK = ['#9a98a8', '#e8e6f0'];
const GLASS = ['#6a8aa0', '#a8c8da', '#e0f0f8'];
const FUR = ['#5a4a42', '#8a7668', '#b8a898'];
const WOOL = ['#6a2e44', '#a84a68', '#d88aa4'];

// --- A heap of fallen stone with a tuft of moss on top. ---
function rubble() {
  const g = new Grid(16, 16);
  g.oval(8, 13, 7, 2, STONE[0]);
  g.oval(8, 11, 6, 3, STONE[1]);
  g.box(2, 9, 5, 4, STONE);
  g.box(7, 5, 5, 5, STONE);
  g.box(10, 9, 4, 4, STONE);
  g.dots([[8, 5], [9, 5], [3, 9]], MOSS[2]);
  g.dots([[8, 4], [4, 9]], MOSS[3]);
  g.rect(8, 6, 1, 4, STONE[0]);
  g.outline(OUT);
  return g.rows();
}

// --- Scattered chips of stone and grit, lying on the floor. ---
function chips() {
  const g = new Grid(16, 16);
  for (const [x, y, w, h] of [[2, 9, 3, 2], [7, 6, 2, 2], [10, 11, 3, 2], [5, 12, 2, 1], [12, 5, 2, 1], [3, 4, 1, 1]]) g.box(x, y, w, h, STONE.slice(1));
  g.dots([[6, 9], [9, 9], [11, 8], [4, 7], [8, 12], [13, 13]], STONE[3]);
  return g.rows();
}

// --- A broken column: a drum of stone with a jagged top, cracked, moss at its foot. ---
function stump() {
  const g = new Grid(16, 24);
  g.box(3, 14, 10, 9, STONE);
  g.rect(4, 12, 8, 3, STONE[2]);
  g.rect(5, 11, 3, 2, STONE[2]);
  g.rect(9, 10, 3, 3, STONE[2]);
  g.dots([[5, 11], [9, 10], [10, 10], [11, 10]], STONE[3]);
  g.line(7, 14, 6, 22, STONE[0]);
  g.line(10, 15, 11, 20, STONE[0]);
  g.rect(3, 21, 4, 2, MOSS[1]);
  g.dots([[3, 21], [5, 21], [11, 22]], MOSS[2]);
  g.rect(2, 22, 12, 1, STONE[0]);
  g.outline(OUT);
  return g.rows();
}

// --- A column fallen across the floor and snapped in two. ---
function column() {
  const g = new Grid(32, 16);
  g.box(2, 7, 13, 7, STONE);
  g.rect(3, 8, 11, 1, STONE[3]);
  g.rect(15, 8, 2, 5, STONE[0]);
  g.box(18, 8, 12, 6, STONE);
  g.rect(19, 9, 10, 1, STONE[3]);
  g.rect(14, 6, 3, 3, STONE[2]);
  for (const x of [5, 9, 22, 26]) g.rect(x, 8, 1, 5, STONE[1]);
  g.rect(2, 13, 28, 1, STONE[0]);
  g.dots([[8, 6], [9, 6], [24, 7], [25, 7]], MOSS[2]);
  g.dots([[8, 7], [24, 8]], MOSS[1]);
  g.oval(16, 14, 2, 1, STONE[0]);
  g.dots([[31, 13], [0, 13], [16, 15]], STONE[2]);
  g.outline(OUT);
  return g.rows();
}

// --- A cracked urn with a fern growing out of the top. ---
function urn() {
  const g = new Grid(16, 16);
  g.oval(8, 10, 4, 4, WOOD[1]);
  g.rect(5, 6, 6, 2, WOOD[1]);
  g.rect(4, 5, 8, 1, WOOD[2]);
  g.rect(5, 14, 6, 1, WOOD[0]);
  g.oval(7, 9, 2, 2, WOOD[2]);
  g.line(9, 6, 8, 13, WOOD[0]);
  g.line(3, 3, 6, 5, MOSS[1]);
  g.line(8, 1, 8, 5, MOSS[1]);
  g.line(13, 3, 10, 5, MOSS[1]);
  g.dots([[2, 3], [8, 0], [13, 2], [5, 3], [11, 3]], MOSS[2]);
  g.outline(OUT);
  return g.rows();
}

// --- A faded banner hung from a rod, its hem torn into tongues. ---
function banner(body, edge, long) {
  const g = new Grid(16, 24);
  const bottom = long ? 22 : 17;
  g.rect(2, 1, 12, 1, WOOD[2]);
  g.dots([[1, 1], [14, 1]], WOOD[3]);
  g.rect(4, 2, 8, bottom - 2, body);
  g.rect(4, 2, 1, bottom - 2, edge);
  g.rect(11, 2, 1, bottom - 2, edge);
  g.rect(4, 2, 8, 1, edge);
  // The tongues at the bottom, uneven.
  g.rect(4, bottom, 2, 2, body);
  g.rect(7, bottom - 1, 2, 3, body);
  g.rect(10, bottom, 2, 1, body);
  // A faded sun, and the places the sun has worn through.
  g.oval(8, 8, 2, 2, edge);
  g.dots([[8, 5], [8, 11], [5, 8], [11, 8]], edge);
  g.dots([[6, 14], [9, 15], [7, 16], [10, 12]], FADED[0]);
  g.rect(8, bottom - 4, 1, 1, '#c8b070');
  g.outline(OUT);
  return g.rows();
}

// --- A wall cabinet of pigeonholes: post nobody came for. ---
function pigeonholes() {
  const g = new Grid(16, 24);
  g.box(1, 6, 14, 17, WOOD.slice(0, 3));
  g.rect(1, 6, 14, 1, WOOD[3]);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    const x = 2 + c * 4;
    const y = 8 + r * 4;
    g.rect(x, y, 3, 3, WOOD[0]);
  }
  // A few letters, and one that's stuck out.
  g.rect(2, 10, 3, 1, PAPER[2]);
  g.rect(6, 14, 3, 1, PAPER[1]);
  g.rect(10, 8, 3, 2, PAPER[2]);
  g.rect(6, 18, 3, 2, PAPER[2]);
  g.set(7, 19, '#a83a3a');
  g.rect(10, 17, 2, 3, PAPER[2]);
  g.rect(10, 16, 1, 2, PAPER[1]);
  g.rect(3, 22, 10, 1, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

// --- A framed painting, nearly all flaked away: a sun, a sky, and someone small under it. ---
function mural() {
  const g = new Grid(16, 16);
  g.box(2, 2, 12, 12, WOOD.slice(0, 3));
  g.rect(4, 4, 8, 8, FADED[0]);
  g.rect(4, 4, 8, 4, FADED[1]);
  g.oval(8, 7, 2, 2, '#c8a860');
  g.rect(4, 10, 8, 2, MOSS[0]);
  g.rect(8, 8, 1, 3, FADED[2]);
  g.set(8, 7, '#c8a860');
  g.line(9, 8, 11, 6, CHALK[0]);
  g.rect(4, 4, 2, 3, STONE[1]);
  g.rect(10, 10, 2, 2, STONE[1]);
  g.dots([[6, 12], [9, 5]], STONE[0]);
  g.outline(OUT);
  return g.rows();
}

// --- Ivy hanging down a wall, leaf over leaf. ---
function vines() {
  const g = new Grid(16, 24);
  for (const [x, len] of [[3, 14], [7, 20], [11, 11], [13, 17]]) {
    g.line(x, 2, x + (x % 2 ? 1 : -1), 2 + len, MOSS[0]);
    for (let y = 4; y < 2 + len; y += 3) {
      const dx = (y / 3) % 2 ? 1 : -1;
      g.rect(x + dx - (dx < 0 ? 1 : 0), y, 2, 2, MOSS[1]);
      g.set(x + dx, y, MOSS[2]);
    }
  }
  g.rect(2, 1, 12, 2, MOSS[0]);
  g.dots([[3, 1], [6, 1], [9, 1], [12, 1]], MOSS[2]);
  return g.rows();
}

// --- A damp patch of moss on the floor, dim and flat. ---
function moss() {
  const g = new Grid(16, 16);
  const dim = ['#1a2a24', '#243a30', '#345044', '#4a6a58'];
  g.oval(8, 9, 6, 3, dim[0]);
  g.oval(7, 8, 5, 2, dim[1]);
  g.dots([[4, 8], [6, 7], [9, 8], [11, 9], [7, 10], [5, 9]], dim[2]);
  g.dots([[6, 8], [10, 9]], dim[3]);
  return g.rows();
}

// --- A pink flower pushing up out of a crack in the floor. ---
function crackFlower() {
  const g = new Grid(16, 16);
  g.line(4, 14, 7, 11, STONE[0]);
  g.line(7, 11, 6, 8, STONE[0]);
  g.line(7, 11, 11, 13, STONE[0]);
  g.line(7, 11, 7, 6, MOSS[1]);
  g.set(6, 9, MOSS[2]);
  g.set(8, 8, MOSS[2]);
  g.rect(6, 4, 3, 3, '#e88ab4');
  g.set(7, 5, '#ffe080');
  g.dots([[7, 3], [5, 5], [9, 5]], '#f8b8d4');
  return g.rows();
}

// --- A doormat. The letters are in a few different hands. ---
function mat() {
  const g = new Grid(16, 16);
  g.box(1, 6, 14, 8, WOOD.slice(0, 3).map((c, i) => [WOOD[0], '#8a6a44', WOOD[3]][i]));
  g.rect(2, 7, 12, 1, '#a87a48');
  for (let x = 3; x < 13; x += 2) g.set(x, 9, WOOD[1]);
  for (let x = 3; x < 13; x += 3) g.rect(x, 11, 2, 1, WOOD[1]);
  g.rect(3, 8, 10, 1, '#c8a060');
  g.rect(3, 10, 6, 1, CHALK[0]);
  g.rect(10, 10, 3, 1, CHALK[0]);
  g.rect(1, 14, 14, 1, WOOD[0]);
  return g.rows();
}

// --- A stone bench worn into a hollow in the middle. ---
function bench() {
  const g = new Grid(16, 16);
  g.box(2, 8, 12, 3, STONE);
  g.rect(3, 9, 10, 1, STONE[1]);
  g.rect(6, 8, 4, 1, STONE[1]);
  g.box(3, 11, 3, 4, STONE);
  g.box(10, 11, 3, 4, STONE);
  g.dots([[4, 8], [11, 8]], STONE[3]);
  g.dots([[3, 14], [12, 14]], MOSS[1]);
  g.outline(OUT);
  return g.rows();
}

// --- A saucer with three stubs of candle and their drips (the flames are drawn on). ---
function candleSaucer() {
  const g = new Grid(16, 16);
  g.oval(8, 13, 5, 1, IRON[1]);
  g.rect(4, 13, 8, 1, IRON[2]);
  g.box(5, 8, 2, 5, WAX.map((c, i) => [WAX[0], WAX[1], WAX[2]][i]));
  g.box(8, 6, 2, 7, [WAX[0], WAX[1], WAX[2]]);
  g.box(11, 9, 2, 4, [WAX[0], WAX[1], WAX[2]]);
  g.dots([[5, 6], [8, 4], [11, 7]], WARM);
  g.dots([[7, 12], [10, 12], [4, 12]], WAX[1]);
  g.rect(8, 9, 1, 3, WAX[0]);
  g.outline(OUT);
  return g.rows();
}

// --- A mouse's door at the foot of the wall: a tiny arch, a tiny mat, a tiny lantern. ---
function mouseHole() {
  const g = new Grid(16, 16);
  g.rect(4, 7, 8, 7, STONE[0]);
  g.rect(5, 6, 6, 1, STONE[0]);
  g.rect(6, 5, 4, 1, STONE[0]);
  g.rect(5, 8, 6, 6, '#08060e');
  g.rect(6, 7, 4, 1, '#08060e');
  g.rect(4, 7, 1, 7, WOOD[2]);
  g.rect(11, 7, 1, 7, WOOD[2]);
  g.rect(5, 6, 6, 1, WOOD[3]);
  g.rect(3, 14, 10, 1, CLOTH[2]);
  g.rect(4, 14, 8, 1, '#c8a060');
  g.rect(12, 5, 1, 4, IRON[1]);
  g.rect(12, 4, 2, 1, IRON[1]);
  g.rect(13, 5, 2, 3, '#f0c060');
  g.rect(14, 5, 1, 1, '#fff0a0');
  g.outline(OUT);
  return g.rows();
}

// --- A mouse sitting up in a scarf, paws together, worried. ---
function mouse() {
  const g = new Grid(16, 16);
  g.oval(8, 11, 3, 3, FUR[1]);
  g.oval(8, 7, 3, 2, FUR[1]);
  g.oval(5, 4, 2, 2, FUR[2]);
  g.oval(11, 4, 2, 2, FUR[2]);
  g.set(5, 4, '#d88a9a');
  g.set(11, 4, '#d88a9a');
  g.rect(6, 6, 5, 2, FUR[1]);
  g.rect(7, 8, 3, 1, FUR[2]);
  g.set(7, 7, WARM);
  g.set(10, 7, WARM);
  g.set(8, 9, '#d88a9a');
  g.rect(5, 10, 7, 2, WOOL[1]);
  g.rect(5, 10, 7, 1, WOOL[2]);
  g.rect(11, 11, 2, 4, WOOL[1]);
  g.rect(8, 12, 2, 2, FUR[2]);
  g.line(12, 11, 15, 12, FUR[0]);
  g.line(15, 12, 15, 13, FUR[0]);
  g.rect(6, 14, 2, 1, FUR[0]);
  g.rect(9, 14, 2, 1, FUR[0]);
  g.outline(OUT);
  return g.rows();
}

// --- A slate on an easel, chalked, with a stub of chalk on the ledge. ---
function chalkboard() {
  const g = new Grid(16, 16);
  g.line(3, 14, 5, 3, WOOD[2]);
  g.line(13, 14, 11, 3, WOOD[2]);
  g.box(3, 3, 10, 8, WOOD.slice(0, 3));
  g.rect(4, 4, 8, 6, '#2a2a34');
  g.rect(5, 5, 4, 1, CHALK[1]);
  g.rect(5, 7, 6, 1, CHALK[0]);
  g.set(10, 9, CHALK[1]);
  g.rect(4, 11, 8, 1, WOOD[3]);
  g.rect(9, 10, 2, 1, CHALK[1]);
  g.outline(OUT);
  return g.rows();
}

// --- A hopscotch chalked on the floor. ---
function hopscotch() {
  const g = new Grid(16, 16);
  for (const [x, y, w, h] of [[6, 2, 4, 3], [6, 5, 4, 3], [3, 8, 4, 3], [9, 8, 4, 3], [6, 11, 4, 3]]) {
    g.rect(x, y, w, 1, CHALK[0]);
    g.rect(x, y + h - 1, w, 1, CHALK[0]);
    g.rect(x, y, 1, h, CHALK[0]);
    g.rect(x + w - 1, y, 1, h, CHALK[0]);
  }
  g.dots([[7, 3], [8, 3], [7, 6], [8, 6]], CHALK[1]);
  return g.rows();
}

// --- A hamper with a ribbon, packed for a welcome that never came. ---
function hamper() {
  const g = new Grid(16, 16);
  g.box(2, 7, 12, 7, WOOD.slice(0, 3).map((c, i) => [WOOD[1], '#8a6a44', WOOD[3]][i]));
  for (let x = 3; x < 13; x += 2) g.rect(x, 9, 1, 4, WOOD[1]);
  g.rect(2, 10, 12, 1, WOOD[1]);
  g.rect(3, 4, 10, 3, '#8a6a44');
  g.rect(3, 4, 10, 1, WOOD[3]);
  g.rect(7, 3, 2, 11, CLOTH[2]);
  g.rect(5, 2, 3, 2, CLOTH[2]);
  g.rect(9, 2, 3, 2, CLOTH[2]);
  g.set(8, 2, CLOTH[1]);
  g.rect(3, 14, 10, 1, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

// --- The skeleton of a very small mouse in a thimble helmet, a toothpick sword in its paw. ---
function mouseBones() {
  const g = new Grid(16, 16);
  g.oval(8, 12, 4, 1, STONE[0]);
  g.rect(6, 10, 5, 2, '#d8d4c8');
  g.rect(5, 9, 1, 3, '#b8b4a8');
  g.dots([[7, 9], [9, 9]], '#d8d4c8');
  g.rect(3, 8, 4, 3, '#e8e4d8');
  g.set(4, 9, WARM);
  g.set(6, 9, WARM);
  g.rect(3, 6, 4, 2, IRON[2]);
  g.rect(3, 6, 4, 1, IRON[3]);
  g.line(11, 11, 14, 7, WOOD[3]);
  g.set(11, 11, IRON[3]);
  g.line(10, 12, 13, 13, '#b8b4a8');
  g.outline(OUT);
  return g.rows();
}

// --- An old helmet on its side with a flower growing out of it. ---
function helm() {
  const g = new Grid(16, 16);
  g.oval(8, 11, 5, 4, IRON[1]);
  g.rect(3, 12, 11, 2, IRON[1]);
  g.rect(4, 8, 8, 1, IRON[2]);
  g.rect(5, 12, 5, 2, '#08060e');
  g.rect(10, 8, 3, 1, IRON[3]);
  g.dots([[5, 9], [6, 9]], '#8a4a2a');
  g.rect(4, 12, 1, 2, '#8a4a2a');
  g.line(8, 7, 8, 3, MOSS[1]);
  g.set(7, 5, MOSS[2]);
  g.rect(7, 1, 3, 3, '#ffe080');
  g.set(8, 2, '#e8a020');
  g.dots([[6, 2], [10, 2], [8, 0]], '#fff4b0');
  g.outline(OUT);
  return g.rows();
}

// --- A single old boot, tipped over, with a weed in it. ---
function boot() {
  const g = new Grid(16, 16);
  g.rect(4, 6, 4, 7, WOOD[1]);
  g.rect(4, 6, 4, 1, WOOD[0]);
  g.rect(4, 11, 9, 3, WOOD[1]);
  g.rect(12, 11, 1, 3, WOOD[2]);
  g.rect(4, 14, 9, 1, WOOD[0]);
  g.rect(5, 7, 1, 4, WOOD[2]);
  g.dots([[5, 5], [6, 4], [7, 5]], MOSS[2]);
  g.dots([[8, 12], [9, 12]], WOOD[2]);
  g.outline(OUT);
  return g.rows();
}

// --- A heap of mouldy old books, the top one open. ---
function books() {
  const g = new Grid(16, 16);
  g.box(2, 11, 12, 3, [WOOD[0], '#3a5a6a', '#5a8aa0']);
  g.box(3, 8, 10, 3, [WOOD[0], CLOTH[1], CLOTH[2]]);
  g.box(2, 5, 11, 3, [WOOD[0], '#4a6a3a', '#6a9a50']);
  g.rect(4, 12, 7, 1, PAPER[1]);
  g.rect(4, 9, 6, 1, PAPER[1]);
  g.rect(5, 2, 4, 3, PAPER[2]);
  g.rect(9, 2, 4, 3, PAPER[1]);
  g.rect(9, 1, 1, 4, PAPER[0]);
  g.dots([[6, 3], [7, 3], [11, 3]], '#5a4a6a');
  g.dots([[12, 12], [3, 6]], MOSS[2]);
  g.outline(OUT);
  return g.rows();
}

// --- A lantern knocked on its side, the glass dark. ---
function lanternDown() {
  const g = new Grid(16, 16);
  g.box(3, 8, 10, 5, [IRON[0], IRON[1], IRON[2]]);
  g.rect(4, 9, 8, 3, '#1e2a30');
  g.dots([[5, 10], [6, 10], [9, 10]], GLASS[0]);
  g.rect(2, 7, 1, 7, IRON[2]);
  g.rect(13, 7, 1, 7, IRON[2]);
  g.line(5, 8, 7, 4, IRON[2]);
  g.line(7, 4, 11, 8, IRON[2]);
  g.set(7, 3, IRON[3]);
  g.rect(14, 13, 2, 1, WAX[1]);
  g.outline(OUT);
  return g.rows();
}

// --- A puddle on the floor. ---
function puddle() {
  const g = new Grid(16, 16);
  g.oval(8, 9, 6, 3, '#1c2a44');
  g.oval(8, 9, 5, 2, '#2a4066');
  g.rect(5, 8, 3, 1, '#5a7aa8');
  g.set(10, 10, '#5a7aa8');
  return g.rows();
}

// --- A ring of pale toadstools. ---
function toadstools() {
  const g = new Grid(16, 16);
  for (const [x, y, s] of [[3, 11, 1], [7, 13, 2], [12, 11, 1], [5, 8, 1], [10, 8, 2], [8, 10, 1]]) {
    g.rect(x, y, 1, 2, '#e8e0d0');
    g.rect(x - s, y - 1, s * 2 + 1, 1, '#f0e8d8');
    g.rect(x - s + 1, y - 2 + (s > 1 ? -1 : 0), s * 2 - 1, 1, '#c8c0b0');
  }
  g.dots([[5, 8], [10, 8], [7, 11]], '#d84a4a');
  return g.rows();
}

// --- A snail shell, a silver trail behind it. ---
function shell() {
  const g = new Grid(16, 16);
  g.rect(2, 12, 9, 1, '#8a8aa8');
  g.oval(10, 10, 3, 3, '#8a6a44');
  g.oval(10, 10, 2, 2, '#b8924c');
  g.dots([[10, 10], [11, 9]], '#6a4a2a');
  g.rect(8, 12, 7, 1, '#a8a8b8');
  g.rect(2, 11, 2, 2, '#a8a8b8');
  g.set(2, 10, '#a8a8b8');
  g.outline(OUT);
  return g.rows();
}

// --- A few drips of old wax, hardened on the floor. ---
function waxPool() {
  const g = new Grid(16, 16);
  g.oval(8, 9, 3, 1, '#a89870');
  g.rect(6, 8, 4, 1, '#d8c898');
  g.dots([[11, 10], [4, 10], [9, 11], [6, 7]], '#c8b888');
  g.set(8, 8, '#f0e4b8');
  return g.rows();
}

// --- A fern, spilling over. ---
function fern() {
  const g = new Grid(16, 16);
  g.rect(7, 9, 2, 5, MOSS[0]);
  for (const [dx, dy, len] of [[-5, -2, 5], [5, -2, 5], [-3, -5, 4], [3, -5, 4], [0, -6, 4]]) {
    g.line(8, 11, 8 + dx, 11 + dy, MOSS[1]);
    for (let i = 1; i <= len; i++) g.set(8 + (dx * i) / len, 11 + (dy * i) / len + 1, MOSS[2]);
  }
  g.dots([[3, 10], [13, 10], [5, 6], [11, 6], [8, 5]], MOSS[3]);
  return g.rows();
}

// --- A little brass plaque on the wall, names chiselled in rows, most rubbed out. ---
function plaque() {
  const g = new Grid(16, 16);
  g.box(2, 3, 12, 10, [WARM, '#7a6a3a', '#b8a460']);
  for (let y = 5; y < 12; y += 2) {
    g.rect(4, y, 8, 1, y > 9 ? '#2a2210' : '#9a8a50');
  }
  g.rect(4, 7, 5, 1, '#5a4a28');
  g.dots([[3, 4], [12, 4], [3, 11], [12, 11]], IRON[2]);
  g.outline(OUT);
  return g.rows();
}

// --- A tip jar, three coins in it. ---
function tipJar() {
  const g = new Grid(16, 16);
  g.rect(5, 6, 6, 8, GLASS[0]);
  g.rect(6, 7, 4, 6, GLASS[1]);
  g.rect(5, 5, 6, 1, WOOD[2]);
  g.rect(6, 4, 4, 1, WOOD[2]);
  g.dots([[7, 12], [9, 12], [8, 11]], '#e8c050');
  g.rect(6, 8, 1, 3, GLASS[2]);
  g.rect(6, 14, 4, 1, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

// --- A small crate with a handful of straw sticking out. ---
function crate() {
  const g = new Grid(16, 16);
  g.box(3, 7, 10, 7, [WOOD[0], WOOD[2], WOOD[3]]);
  g.rect(3, 10, 10, 1, WOOD[1]);
  g.rect(3, 7, 1, 7, WOOD[1]);
  g.rect(12, 7, 1, 7, WOOD[1]);
  g.dots([[5, 6], [8, 5], [10, 6], [7, 6]], '#d8c070');
  g.set(8, 4, '#d8c070');
  g.outline(OUT);
  return g.rows();
}

// --- A box marked LOST AND FOUND with one glove in it. ---
function lostBox() {
  const g = new Grid(16, 16);
  g.box(2, 6, 12, 8, [WOOD[0], '#8a7a5a', '#b8a880']);
  g.rect(4, 9, 8, 3, PAPER[2]);
  g.rect(5, 10, 3, 1, '#4a3a2a');
  g.rect(9, 10, 2, 1, '#4a3a2a');
  g.rect(4, 4, 3, 3, '#3a5a8a');
  g.rect(3, 3, 1, 2, '#3a5a8a');
  g.rect(5, 3, 1, 2, '#3a5a8a');
  g.rect(7, 4, 1, 2, '#3a5a8a');
  g.outline(OUT);
  return g.rows();
}

// --- A small round brass button, lying on the floor. ---
function button() {
  const g = new Grid(16, 16);
  g.oval(8, 10, 2, 1, '#8a6a20');
  g.rect(6, 9, 4, 2, '#d8b040');
  g.rect(6, 9, 4, 1, '#f0d870');
  g.dots([[7, 10], [9, 10]], '#8a6a20');
  g.set(7, 9, '#fff4b8');
  return g.rows();
}

// --- A bell pull: a rope with a tassel, hung from a bracket, ringing nothing. ---
function bellPull() {
  const g = new Grid(16, 24);
  g.rect(5, 2, 7, 1, IRON[2]);
  g.rect(11, 2, 1, 4, IRON[1]);
  g.rect(8, 3, 2, 12, CLOTH[1]);
  g.dots([[8, 5], [9, 7], [8, 9], [9, 11], [8, 13]], CLOTH[2]);
  g.rect(7, 15, 4, 4, '#c8a060');
  g.rect(7, 15, 4, 1, '#e8c880');
  g.dots([[7, 19], [8, 20], [9, 19], [10, 20]], '#c8a060');
  g.outline(OUT);
  return g.rows();
}

// --- A stone chair with a cushion and a paper sign: RESERVED. ---
function reserved() {
  const g = new Grid(16, 16);
  g.box(4, 3, 8, 8, STONE);
  g.box(3, 9, 10, 5, STONE);
  g.rect(4, 8, 8, 2, CLOTH[1]);
  g.rect(4, 8, 8, 1, CLOTH[2]);
  g.rect(6, 4, 4, 3, PAPER[2]);
  g.rect(7, 5, 2, 1, '#8a3a3a');
  g.dots([[4, 13], [11, 13]], MOSS[1]);
  g.outline(OUT);
  return g.rows();
}

// --- A ball of wool and two needles, spilled from a basket (Taper's). ---
function wool() {
  const g = new Grid(16, 16);
  g.oval(8, 12, 5, 2, WOOD[1]);
  g.rect(3, 10, 10, 3, WOOD[2]);
  g.rect(3, 10, 10, 1, WOOD[3]);
  g.oval(7, 8, 3, 3, WOOL[1]);
  g.dots([[6, 7], [7, 6], [8, 8]], WOOL[2]);
  g.line(5, 8, 9, 10, WOOL[0]);
  g.line(11, 3, 9, 9, WOOD[3]);
  g.line(13, 4, 11, 9, WOOD[3]);
  g.line(10, 10, 14, 13, WOOL[1]);
  g.line(14, 13, 12, 14, WOOL[1]);
  g.outline(WARM);
  return g.rows();
}

// --- A tea tray: a pot, a cup, a cup. ---
function teaTray() {
  const g = new Grid(16, 16);
  g.rect(1, 12, 14, 2, WOOD[1]);
  g.rect(1, 12, 14, 1, WOOD[3]);
  g.oval(6, 9, 3, 3, '#8a9ab8');
  g.rect(5, 6, 3, 1, '#b8c4d8');
  g.rect(9, 8, 3, 1, '#8a9ab8');
  g.set(11, 8, '#b8c4d8');
  g.set(6, 8, '#b8c4d8');
  g.rect(11, 10, 3, 2, '#e8e4d8');
  g.rect(11, 10, 3, 1, '#c8b890');
  g.rect(1, 10, 3, 2, '#e8e4d8');
  g.rect(1, 10, 3, 1, '#c8b890');
  g.outline(WARM);
  return g.rows();
}

// --- Three pairs of boots by the door, one pair very small. ---
function bootsRow() {
  const g = new Grid(16, 16);
  g.rect(1, 9, 3, 4, WOOD[1]);
  g.rect(1, 12, 5, 2, WOOD[1]);
  g.rect(5, 9, 3, 4, WOOD[2]);
  g.rect(5, 12, 5, 2, WOOD[2]);
  g.rect(10, 11, 2, 2, '#8a2e2e');
  g.rect(10, 13, 3, 1, '#8a2e2e');
  g.rect(13, 11, 2, 2, '#8a2e2e');
  g.rect(13, 13, 2, 1, '#8a2e2e');
  g.dots([[2, 9], [6, 9], [11, 11]], WOOD[3]);
  g.rect(1, 14, 14, 1, WOOD[0]);
  g.outline(WARM);
  return g.rows();
}

// --- A peg rail screwed to the wall: a shawl, a floppy hat, an apron, an empty peg. ---
function coatPegs() {
  const g = new Grid(16, 24);
  g.rect(1, 6, 14, 2, WOOD[2]);
  g.rect(1, 6, 14, 1, WOOD[3]);
  g.dots([[3, 7], [7, 7], [11, 7], [14, 7]], IRON[2]);
  g.rect(2, 8, 4, 11, '#4a6a4a');
  g.rect(2, 8, 4, 1, '#6a8a6a');
  g.rect(2, 17, 1, 3, '#4a6a4a');
  g.rect(4, 17, 1, 2, '#4a6a4a');
  g.oval(9, 11, 3, 1, '#c8a060');
  g.rect(8, 8, 3, 3, '#c8a060');
  g.rect(8, 8, 3, 1, '#e0c080');
  g.rect(6, 12, 1, 1, '#c8a060');
  g.rect(12, 8, 3, 9, '#d8d0c0');
  g.rect(12, 8, 3, 1, '#f0ead8');
  g.rect(13, 12, 1, 3, '#b8aa90');
  g.outline(WARM);
  return g.rows();
}

// --- A little shelf of jam jars with paper hats and labels. ---
function jamShelf() {
  const g = new Grid(16, 24);
  g.rect(1, 12, 14, 2, WOOD[2]);
  g.rect(1, 12, 14, 1, WOOD[3]);
  g.rect(2, 14, 2, 3, WOOD[1]);
  g.rect(12, 14, 2, 3, WOOD[1]);
  const jars = [['#a8283a', 2], ['#d89020', 6], ['#6a2a6a', 10], ['#4a7a2a', 13]];
  for (const [c, x] of jars) {
    g.rect(x, 7, 3, 5, c);
    g.rect(x, 5, 3, 2, PAPER[2]);
    g.rect(x, 8, 3, 2, PAPER[1]);
  }
  g.rect(3, 8, 1, 3, '#ffffff');
  g.outline(WARM);
  return g.rows();
}

// --- A wall clock with a pendulum, stopped. ---
function clock() {
  const g = new Grid(16, 24);
  g.box(3, 2, 10, 14, [WOOD[0], WOOD[2], WOOD[3]]);
  g.oval(8, 7, 3, 3, PAPER[2]);
  g.dots([[8, 5], [8, 9], [5, 7], [11, 7]], WOOD[0]);
  g.line(8, 7, 8, 5, WARM);
  g.line(8, 7, 10, 8, WARM);
  g.rect(7, 11, 2, 1, WOOD[0]);
  g.rect(5, 13, 6, 2, WOOD[1]);
  g.line(8, 16, 8, 21, IRON[2]);
  g.oval(8, 21, 2, 2, '#c8a060');
  g.set(7, 20, '#f0d890');
  g.outline(WARM);
  return g.rows();
}

// --- A broom and dustpan leaning on the wall. ---
function broom() {
  const g = new Grid(16, 24);
  g.line(5, 1, 7, 17, WOOD[3]);
  g.line(6, 1, 8, 17, WOOD[2]);
  g.rect(4, 17, 7, 5, '#c8a060');
  g.rect(4, 17, 7, 1, '#e0c080');
  for (const x of [5, 7, 9]) g.rect(x, 19, 1, 3, '#8a6a30');
  g.rect(9, 12, 5, 8, IRON[1]);
  g.rect(9, 12, 5, 1, IRON[3]);
  g.rect(12, 19, 3, 3, IRON[1]);
  g.outline(WARM);
  return g.rows();
}

// --- A bucket and a mop with a head like a sleeping sheep. ---
function mop() {
  const g = new Grid(16, 16);
  g.rect(3, 8, 7, 6, IRON[1]);
  g.rect(3, 8, 7, 1, IRON[3]);
  g.rect(3, 13, 7, 1, IRON[0]);
  g.rect(4, 10, 5, 1, IRON[2]);
  g.line(9, 1, 7, 9, WOOD[3]);
  g.line(10, 1, 8, 9, WOOD[2]);
  g.rect(6, 5, 5, 2, '#d8d4c8');
  g.rect(5, 12, 5, 2, '#b8b4a8');
  g.rect(10, 12, 4, 2, '#d8d4c8');
  g.dots([[12, 11], [13, 13]], '#8a9ab8');
  g.outline(WARM);
  return g.rows();
}

// --- A clay garden gnome in a wick for a hat. ---
function gnome() {
  const g = new Grid(16, 16);
  g.rect(5, 8, 6, 6, '#6a8a9a');
  g.rect(5, 8, 6, 1, '#9ab8c8');
  g.rect(4, 14, 8, 1, WOOD[0]);
  g.rect(6, 5, 4, 3, '#e8b890');
  g.rect(5, 8, 6, 2, '#e8e4d8');
  g.set(7, 6, WARM);
  g.set(9, 6, WARM);
  g.rect(6, 4, 4, 1, '#a8283a');
  g.rect(7, 3, 2, 1, '#a8283a');
  g.rect(8, 0, 1, 3, '#2a2a30');
  g.rect(8, 0, 1, 1, '#e8dcc4');
  g.rect(7, 11, 2, 1, '#d8c070');
  g.outline(WARM);
  return g.rows();
}

// --- A wheelbarrow of pots, one wheel, a plant label stuck in a pot. ---
function barrow() {
  const g = new Grid(16, 16);
  g.rect(3, 7, 9, 5, WOOD[1]);
  g.rect(3, 7, 9, 1, WOOD[3]);
  g.rect(11, 9, 4, 1, WOOD[2]);
  g.rect(1, 9, 3, 1, WOOD[2]);
  g.oval(4, 13, 2, 2, IRON[1]);
  g.set(4, 13, IRON[3]);
  g.rect(5, 4, 3, 3, '#a85a3a');
  g.rect(8, 5, 3, 2, '#a85a3a');
  g.dots([[6, 3], [9, 4]], MOSS[2]);
  g.rect(6, 1, 1, 3, '#e8e4d8');
  g.rect(12, 12, 1, 3, WOOD[1]);
  g.rect(1, 12, 1, 3, WOOD[1]);
  g.outline(WARM);
  return g.rows();
}

// --- A rain barrel under a pipe, a lid half off. ---
function rainBarrel() {
  const g = new Grid(16, 16);
  g.oval(8, 9, 5, 5, WOOD[1]);
  g.rect(3, 5, 10, 9, WOOD[1]);
  g.rect(3, 7, 10, 1, IRON[2]);
  g.rect(3, 11, 10, 1, IRON[2]);
  g.rect(4, 4, 8, 2, '#2a4066');
  g.rect(5, 4, 3, 1, '#5a7aa8');
  g.rect(10, 3, 5, 2, WOOD[3]);
  g.rect(3, 5, 1, 9, WOOD[2]);
  g.outline(WARM);
  return g.rows();
}

// --- A pot of moonbells (the glow is drawn on). ---
function moonbellPot() {
  const g = new Grid(16, 16);
  g.rect(5, 10, 6, 4, '#a85a3a');
  g.rect(4, 9, 8, 2, '#c8704a');
  g.rect(5, 13, 6, 1, '#6a3a22');
  for (const [x, y] of [[5, 5], [8, 3], [11, 6]]) {
    g.line(x, y + 1, 8, 9, MOSS[1]);
    g.rect(x - 1, y, 3, 2, '#9ab8ff');
    g.set(x, y + 2, '#c8d8ff');
    g.set(x, y, '#e8f0ff');
  }
  g.outline(WARM);
  return g.rows();
}

// --- Bean canes in a wigwam, a few beans hanging. ---
function beanpoles() {
  const g = new Grid(16, 24);
  g.line(8, 2, 3, 22, WOOD[2]);
  g.line(8, 2, 13, 22, WOOD[2]);
  g.line(8, 2, 8, 22, WOOD[3]);
  g.line(8, 4, 5, 18, MOSS[1]);
  g.line(8, 5, 11, 17, MOSS[1]);
  for (const [x, y] of [[6, 11], [9, 9], [10, 14], [5, 16], [8, 15]]) {
    g.rect(x, y, 3, 2, MOSS[2]);
    g.set(x, y, MOSS[3]);
  }
  g.rect(7, 1, 3, 2, '#e8604a');
  g.rect(2, 22, 12, 1, WOOD[0]);
  g.outline(WARM);
  return g.rows();
}

// --- A glass jar over a seedling, to keep the cold off it. ---
function cloche() {
  const g = new Grid(16, 16);
  g.rect(3, 12, 10, 2, WOOD[0]);
  g.oval(8, 9, 4, 4, GLASS[0]);
  g.oval(8, 9, 3, 3, GLASS[1]);
  g.rect(4, 9, 8, 4, GLASS[1]);
  g.rect(5, 6, 1, 3, GLASS[2]);
  g.line(8, 12, 8, 8, MOSS[1]);
  g.rect(6, 7, 2, 1, MOSS[2]);
  g.rect(9, 8, 2, 1, MOSS[2]);
  g.rect(7, 4, 2, 1, GLASS[2]);
  g.outline(WARM);
  return g.rows();
}

// --- A row of plant labels in the soil, each with a word on it. ---
function labels() {
  const g = new Grid(16, 16);
  g.rect(1, 11, 14, 3, '#3a2616');
  for (const [x, y] of [[2, 8], [6, 7], [10, 8], [13, 9]]) {
    g.rect(x, y, 2, 3, '#e8e4d8');
    g.rect(x, y, 2, 1, '#c8c0a8');
    g.rect(x, y + 3, 1, 3, WOOD[2]);
    g.set(x, y + 1, '#4a3a2a');
  }
  return g.rows();
}

// --- Tin cups in a row on the ledge, a dried ring of soup in every one. ---
function cups() {
  const g = new Grid(16, 16);
  g.rect(1, 12, 14, 2, STONE[2]);
  g.rect(1, 12, 14, 1, STONE[3]);
  for (const x of [2, 6, 10]) {
    g.rect(x, 7, 3, 5, IRON[2]);
    g.rect(x, 7, 3, 1, IRON[3]);
    g.rect(x + 1, 8, 1, 1, '#8a5a2a');
    g.set(x + 3, 9, IRON[1]);
  }
  g.rect(14, 10, 1, 2, IRON[1]);
  g.outline(OUT);
  return g.rows();
}

// --- Worn boot-prints down the middle of the floor, a path trodden by many. ---
function footprints() {
  const g = new Grid(16, 16);
  for (const [x, y] of [[4, 3], [9, 6], [4, 9], [9, 12]]) {
    g.rect(x, y, 3, 4, STONE[0]);
    g.rect(x + 3, y + 1, 1, 2, STONE[0]);
    g.rect(x, y + 5, 2, 1, STONE[0]);
  }
  return g.rows();
}

// --- A drift of dead leaves, blown in. ---
function leaves() {
  const g = new Grid(16, 16);
  for (const [x, y, c] of [[3, 10, '#8a5a2a'], [7, 11, '#a87a3a'], [11, 9, '#7a4a22'], [9, 13, '#a87a3a'], [5, 13, '#7a4a22'], [13, 12, '#8a5a2a']]) {
    g.rect(x, y, 2, 1, c);
    g.set(x + 1, y + 1, c);
  }
  return g.rows();
}

// --- A scrap of old rope with a knot, in the dust. ---
function rope() {
  const g = new Grid(16, 16);
  g.line(2, 10, 6, 12, '#a8884a');
  g.line(6, 12, 10, 10, '#a8884a');
  g.line(10, 10, 13, 12, '#8a6a30');
  g.rect(5, 11, 3, 2, '#c8a85a');
  g.dots([[3, 10], [11, 10]], '#d8bc6a');
  return g.rows();
}

// --- A birdcage with the door open and nobody in it, hung from a hook on a post. ---
function cage() {
  const g = new Grid(16, 24);
  g.rect(2, 4, 2, 19, WOOD[2]);
  g.rect(2, 3, 11, 2, WOOD[2]);
  g.rect(2, 3, 11, 1, WOOD[3]);
  g.rect(0, 22, 7, 2, WOOD[1]);
  g.rect(10, 5, 1, 3, IRON[2]);
  g.oval(10, 12, 3, 4, IRON[2]);
  for (const x of [8, 10, 12]) g.rect(x, 8, 1, 8, IRON[1]);
  g.rect(8, 16, 5, 1, IRON[0]);
  g.rect(8, 12, 5, 1, WOOD[3]);
  g.dots([[10, 15], [11, 15]], '#ffd23a');
  g.outline(WARM);
  return g.rows();
}

// --- A seed packet, folded over, lying flat, a word on it in round handwriting. ---
function packet() {
  const g = new Grid(16, 16);
  g.box(4, 6, 8, 8, [PAPER[0], PAPER[1], PAPER[2]]);
  g.rect(4, 6, 8, 2, '#8a6a44');
  g.rect(5, 9, 6, 1, '#4a3a2a');
  g.rect(5, 11, 4, 1, '#4a3a2a');
  g.dots([[10, 12], [9, 12]], MOSS[2]);
  g.outline(WARM);
  return g.rows();
}

export const R1_PALETTE_EXTRA = palette;

export const R1_PROP_SPRITES = {
  r1_rubble: rubble(),
  r1_chips: chips(),
  r1_stump: stump(),
  r1_column: column(),
  r1_urn: urn(),
  r1_banner: banner(CLOTH[1], CLOTH[2], true),
  r1_banner_blue: banner('#2e3e66', '#4a5e96', false),
  r1_pigeonholes: pigeonholes(),
  r1_mural: mural(),
  r1_vines: vines(),
  r1_moss: moss(),
  r1_crack_flower: crackFlower(),
  r1_mat: mat(),
  r1_bench: bench(),
  r1_candle_saucer: candleSaucer(),
  r1_mouse_hole: mouseHole(),
  r1_mouse: mouse(),
  r1_chalkboard: chalkboard(),
  r1_hopscotch: hopscotch(),
  r1_hamper: hamper(),
  r1_mouse_bones: mouseBones(),
  r1_helm: helm(),
  r1_boot: boot(),
  r1_books: books(),
  r1_lantern_down: lanternDown(),
  r1_puddle: puddle(),
  r1_toadstools: toadstools(),
  r1_shell: shell(),
  r1_wax_pool: waxPool(),
  r1_fern: fern(),
  r1_plaque: plaque(),
  r1_tip_jar: tipJar(),
  r1_crate: crate(),
  r1_lost_box: lostBox(),
  r1_button: button(),
  r1_bell_pull: bellPull(),
  r1_reserved: reserved(),
  r1_wool: wool(),
  r1_tea_tray: teaTray(),
  r1_boots_row: bootsRow(),
  r1_coat_pegs: coatPegs(),
  r1_jam_shelf: jamShelf(),
  r1_clock: clock(),
  r1_broom: broom(),
  r1_mop: mop(),
  r1_gnome: gnome(),
  r1_barrow: barrow(),
  r1_rain_barrel: rainBarrel(),
  r1_moonbell_pot: moonbellPot(),
  r1_beanpoles: beanpoles(),
  r1_cloche: cloche(),
  r1_labels: labels(),
  r1_cups: cups(),
  r1_footprints: footprints(),
  r1_leaves: leaves(),
  r1_rope: rope(),
  r1_cage: cage(),
  r1_packet: packet(),
};

// How many tiles wide each big one stands.
export const R1_FOOTPRINTS = { r1_column: 2 };
