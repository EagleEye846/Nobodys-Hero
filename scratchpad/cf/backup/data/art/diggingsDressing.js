// Set dressing for chapter 4's Diggings (the life pass, 14 November 2026): the
// small things the miners left lying about. A canary cage with nobody in it,
// a coal heap, a tally scratched on a plank, chalk on a beam, a cart off the
// line, pit props of different heights, a tin mug, boots, a rusted lamp, a
// bucket under a drip, mushrooms, a pipe, a rota board, a fossil in the wall,
// a coil of rope, and for the star rooms: glassy slag, Pale's tin dish and a
// scorch mark. Drawn like ashProps.js (a tiny painter, 16 pixels to a tile,
// standing on the bottom edge and centred over the footprint). Every id
// starts `dg_`. Every one is placed `walkable` in the rooms, so none of them
// can stand in the way of a cart, a push or a climb.

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xa000 + colors.size);
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

const OUT = '#120c1c';
const WOOD = ['#2a1c10', '#4a3018', '#7a5630', '#a77a48'];
const IRON = ['#2e2e38', '#5a5a68', '#8a8a9a', '#b4b4c4'];
const RUST = ['#5a2e1a', '#8a4a2a', '#b0623a', '#d08a50'];
const ROCK = ['#3a2e26', '#5a4a3c', '#7a6a58', '#9a8a74'];
const COAL = ['#12101a', '#242028', '#3a3640', '#5c6070'];
const CHALK = ['#bcb8a8', '#e8e4d8'];

// --- A canary cage with nobody in it, hung from a hook on a short post. ---
function canaryCage() {
  const g = new Grid(16, 24);
  // The post, an arm, and a hook.
  g.rect(2, 4, 2, 19, WOOD[2]);
  g.rect(2, 4, 1, 19, WOOD[3]);
  g.rect(3, 4, 1, 19, WOOD[1]);
  g.rect(2, 3, 11, 2, WOOD[2]);
  g.rect(2, 3, 11, 1, WOOD[3]);
  g.rect(0, 22, 7, 2, ROCK[1]);
  g.rect(0, 22, 7, 1, ROCK[2]);
  g.set(10, 5, IRON[2]);
  g.set(10, 6, IRON[1]);
  g.set(9, 7, IRON[2]);
  // The cage: a ring, a dome, bars, a floor, and a door swinging open.
  g.rect(7, 8, 7, 1, IRON[2]);
  g.rect(8, 7, 5, 1, IRON[2]);
  for (const x of [7, 9, 11, 13]) g.rect(x, 9, 1, 8, IRON[1]);
  g.rect(7, 17, 7, 1, IRON[0]);
  g.rect(7, 13, 7, 1, IRON[1]);
  g.rect(8, 16, 5, 1, RUST[1]);
  // The perch, and a single yellow feather on the floor of it.
  g.rect(8, 12, 5, 1, WOOD[3]);
  g.set(10, 16, '#ffd23a');
  g.set(11, 16, '#e8a020');
  g.outline(OUT);
  return g.rows();
}

// --- A heap of coal with a shovel standing in it. ---
function coalHeap() {
  const g = new Grid(16, 16);
  g.oval(7, 12, 7, 3, COAL[0]);
  g.oval(7, 10, 6, 3, COAL[1]);
  g.oval(6, 8, 4, 2, COAL[1]);
  g.oval(5, 7, 2, 1, COAL[2]);
  for (const [x, y] of [[3, 11], [7, 9], [10, 11], [5, 13], [12, 13], [8, 7]]) g.set(x, y, COAL[3]);
  for (const [x, y] of [[4, 9], [9, 12], [11, 10]]) g.set(x, y, COAL[2]);
  // The shovel: a handle, a blade.
  g.line(12, 3, 11, 11, WOOD[2]);
  g.line(13, 3, 12, 11, WOOD[1]);
  g.rect(10, 11, 4, 2, IRON[2]);
  g.set(10, 11, IRON[3]);
  g.rect(11, 2, 3, 1, WOOD[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A plank on the wall with a tally scratched and chalked on it. ---
function tally() {
  const g = new Grid(16, 16);
  g.rect(2, 2, 12, 12, WOOD[2]);
  g.rect(2, 2, 12, 1, WOOD[3]);
  g.rect(2, 13, 12, 1, WOOD[1]);
  g.rect(2, 7, 12, 1, WOOD[1]);
  g.set(3, 3, IRON[1]);
  g.set(12, 3, IRON[1]);
  g.set(3, 12, IRON[1]);
  g.set(12, 12, IRON[1]);
  // Gates of five: four strokes and a slash through them.
  for (const [x0, y0] of [[4, 4], [9, 4], [4, 9]]) {
    for (let i = 0; i < 4; i++) g.rect(x0 + i, y0, 1, 3, CHALK[1]);
    g.line(x0 - 1, y0 + 2, x0 + 4, y0, CHALK[0]);
  }
  g.rect(9, 10, 1, 3, CHALK[1]);
  g.rect(11, 10, 1, 3, CHALK[1]);
  g.outline(OUT);
  return g.rows();
}

// --- A timber with a joke chalked along it. ---
function chalkBeam() {
  const g = new Grid(16, 16);
  g.rect(0, 5, 16, 7, WOOD[2]);
  g.rect(0, 5, 16, 1, WOOD[3]);
  g.rect(0, 11, 16, 1, WOOD[1]);
  g.rect(0, 8, 3, 1, WOOD[1]);
  g.rect(11, 7, 4, 1, WOOD[1]);
  // Scrawl: little letters and an arrow.
  const mark = (x, w) => { g.rect(x, 7, 1, 3, CHALK[1]); g.rect(x, 7, w, 1, CHALK[1]); };
  mark(2, 2); mark(5, 2); g.rect(8, 7, 1, 3, CHALK[1]); g.rect(8, 9, 2, 1, CHALK[1]);
  g.line(11, 8, 14, 8, CHALK[0]);
  g.set(13, 7, CHALK[0]);
  g.set(13, 9, CHALK[0]);
  g.outline(OUT);
  return g.rows();
}

// --- A cart off the line: on its side, a wheel gone, ore spilled out of it. ---
function brokenCart() {
  const g = new Grid(32, 16);
  // The body tipped on its side, open end toward the left.
  g.rect(8, 4, 18, 9, IRON[1]);
  g.rect(8, 4, 18, 2, IRON[2]);
  g.rect(8, 12, 18, 1, IRON[0]);
  g.rect(10, 6, 14, 5, IRON[0]);
  for (const x of [11, 15, 19, 23]) g.rect(x, 4, 1, 9, RUST[1]);
  g.rect(8, 4, 2, 9, IRON[0]);
  g.rect(8, 6, 2, 1, RUST[2]);
  // The wheels: one on, one lying flat beside it.
  g.oval(22, 13, 3, 2, IRON[0]);
  g.oval(22, 13, 1, 1, IRON[2]);
  g.oval(5, 14, 3, 1, IRON[1]);
  g.oval(5, 14, 1, 0, IRON[3]);
  // Rust blooms, and spilled ore (copper and green).
  for (const [x, y] of [[13, 5], [20, 6], [24, 8], [16, 10]]) g.set(x, y, RUST[2]);
  for (const [x, y, c] of [[2, 12, '#b8743a'], [3, 11, '#e09a58'], [1, 13, '#4c9a78'], [0, 14, '#8ad0a8'], [4, 13, '#b8743a'], [28, 14, '#4c9a78'], [29, 13, '#b8743a'], [27, 15, '#b8743a']]) g.set(x, y, c);
  g.outline(OUT);
  return g.rows();
}

// --- Pit props of different heights. ---
function propStub() {
  const g = new Grid(16, 16);
  g.rect(5, 6, 6, 9, WOOD[2]);
  g.rect(5, 6, 2, 9, WOOD[3]);
  g.rect(9, 6, 2, 9, WOOD[1]);
  // The split top, jagged.
  g.line(5, 6, 7, 3, WOOD[3]);
  g.line(8, 6, 9, 4, WOOD[2]);
  g.rect(6, 4, 2, 2, WOOD[3]);
  g.set(10, 5, WOOD[1]);
  g.rect(3, 14, 10, 2, ROCK[1]);
  g.rect(3, 14, 10, 1, ROCK[2]);
  g.outline(OUT);
  return g.rows();
}

function propLean() {
  const g = new Grid(16, 24);
  // A prop leaning on the wall behind it: slanted, with a wedge under its foot.
  g.line(4, 22, 11, 2, WOOD[2]);
  g.line(5, 22, 12, 2, WOOD[2]);
  g.line(6, 22, 13, 2, WOOD[1]);
  g.line(3, 22, 10, 2, WOOD[3]);
  g.rect(9, 1, 5, 2, WOOD[3]);
  g.rect(2, 21, 8, 2, ROCK[1]);
  g.rect(2, 21, 8, 1, ROCK[2]);
  g.set(7, 12, WOOD[0]);
  g.set(8, 9, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

// --- A tin mug and the stub of a candle, on a flat stone. ---
function tinMug() {
  const g = new Grid(16, 16);
  g.oval(7, 13, 6, 2, ROCK[1]);
  g.oval(7, 12, 5, 1, ROCK[2]);
  g.rect(3, 6, 5, 6, IRON[2]);
  g.rect(3, 6, 1, 6, IRON[3]);
  g.rect(7, 6, 1, 6, IRON[1]);
  g.rect(3, 6, 5, 1, IRON[0]);
  g.set(8, 7, IRON[2]);
  g.set(9, 8, IRON[2]);
  g.set(9, 9, IRON[2]);
  g.set(8, 10, IRON[2]);
  // The candle: a stub in a dish of its own wax, and a very small flame.
  g.rect(11, 9, 3, 3, '#e8dcc0');
  g.rect(11, 9, 3, 1, '#f4ecd8');
  g.set(12, 7, '#ffcf6a');
  g.set(12, 8, '#fff0b0');
  g.outline(OUT);
  return g.rows();
}

// --- A pair of boots, one fallen over. ---
function boots() {
  const g = new Grid(16, 16);
  // Standing boot.
  g.rect(3, 5, 4, 8, WOOD[1]);
  g.rect(3, 5, 4, 1, WOOD[3]);
  g.rect(3, 11, 7, 3, WOOD[1]);
  g.rect(3, 13, 7, 1, WOOD[0]);
  g.rect(4, 6, 1, 4, WOOD[2]);
  g.set(5, 8, IRON[2]);
  g.set(5, 10, IRON[2]);
  // Fallen boot.
  g.rect(9, 11, 6, 3, WOOD[2]);
  g.rect(9, 11, 6, 1, WOOD[3]);
  g.rect(13, 10, 2, 5, WOOD[1]);
  g.rect(9, 13, 6, 1, WOOD[0]);
  g.set(12, 12, IRON[2]);
  g.outline(OUT);
  return g.rows();
}

// --- One brown boot, standing on its own. ---
function oneBoot() {
  const g = new Grid(16, 16);
  g.rect(5, 4, 5, 9, '#6a4426');
  g.rect(5, 4, 5, 1, '#9a6a3c');
  g.rect(5, 11, 8, 3, '#6a4426');
  g.rect(5, 13, 8, 1, '#2a1c10');
  g.rect(6, 5, 1, 5, '#8a5a32');
  g.set(7, 6, '#c8c0a8');
  g.set(7, 8, '#c8c0a8');
  g.set(8, 7, '#c8c0a8');
  g.rect(11, 11, 2, 1, '#8a5a32');
  g.outline(OUT);
  return g.rows();
}

// --- A lamp that has gone out and rusted, on a hook on a short post. ---
function rustedLamp() {
  const g = new Grid(16, 24);
  g.rect(11, 3, 2, 19, WOOD[2]);
  g.rect(11, 3, 1, 19, WOOD[3]);
  g.rect(5, 2, 8, 2, WOOD[2]);
  g.rect(5, 2, 8, 1, WOOD[3]);
  g.rect(9, 20, 6, 2, ROCK[1]);
  g.rect(9, 20, 6, 1, ROCK[2]);
  g.set(6, 4, IRON[2]);
  g.set(6, 5, IRON[1]);
  g.rect(3, 6, 6, 9, RUST[1]);
  g.rect(3, 6, 6, 1, RUST[2]);
  g.rect(4, 8, 4, 5, IRON[0]);
  g.rect(4, 8, 1, 5, '#2a3238');
  g.set(7, 9, '#3a4a50');
  g.rect(3, 14, 6, 1, RUST[0]);
  g.set(5, 7, RUST[3]);
  g.set(7, 6, RUST[3]);
  g.rect(4, 5, 4, 1, IRON[1]);
  g.outline(OUT);
  return g.rows();
}

// --- A bucket under the drip, with a rope handle. ---
function bucket() {
  const g = new Grid(16, 16);
  g.rect(4, 6, 8, 8, WOOD[2]);
  g.rect(4, 6, 2, 8, WOOD[3]);
  g.rect(10, 6, 2, 8, WOOD[1]);
  g.rect(4, 8, 8, 1, IRON[1]);
  g.rect(4, 12, 8, 1, IRON[1]);
  g.rect(5, 6, 6, 1, '#3a6a78');
  g.set(7, 6, '#8ac0d0');
  g.line(4, 6, 8, 2, '#a8916e');
  g.line(12, 6, 8, 2, '#a8916e');
  g.outline(OUT);
  return g.rows();
}

// --- Grit shaken down off the roof, in a soft little fan. ---
function gritHeap() {
  const g = new Grid(16, 16);
  g.oval(8, 11, 6, 2, ROCK[1]);
  g.oval(8, 10, 4, 1, ROCK[2]);
  for (const [x, y] of [[3, 12], [12, 12], [6, 8], [10, 9], [2, 10], [13, 10]]) g.set(x, y, ROCK[3]);
  for (const [x, y] of [[5, 13], [9, 13], [14, 12]]) g.set(x, y, ROCK[0]);
  return g.rows();
}

// --- Pale cave mushrooms in a cluster. ---
function mushrooms() {
  const g = new Grid(16, 16);
  const cap = (x, y, r, c1, c2) => {
    g.rect(x, y + 1, 1, 5, '#d8d0c0');
    g.oval(x, y, r, 1, c1);
    g.set(x - 1, y - 1, c2);
  };
  cap(4, 8, 3, '#c8b8d0', '#e8e0f0');
  cap(9, 6, 3, '#c8b8d0', '#e8e0f0');
  cap(12, 10, 2, '#b0a0c0', '#d8d0e8');
  cap(7, 11, 2, '#b0a0c0', '#d8d0e8');
  g.rect(2, 14, 12, 1, '#2a3a30');
  g.outline(OUT);
  return g.rows();
}

// --- A clay pipe and a little ash, on a ledge of stone. ---
function pipe() {
  const g = new Grid(16, 16);
  g.rect(2, 12, 12, 2, ROCK[1]);
  g.rect(2, 12, 12, 1, ROCK[2]);
  g.rect(5, 9, 3, 3, '#d8c8a8');
  g.rect(5, 9, 3, 1, '#ece0c8');
  g.rect(5, 10, 2, 1, '#2a2420');
  g.line(8, 11, 13, 9, '#d8c8a8');
  g.set(13, 8, '#ece0c8');
  g.set(3, 11, '#7a7a80');
  g.set(2, 11, '#5a5a62');
  g.outline(OUT);
  return g.rows();
}

// --- A rota board on two legs: who's on which shift, mostly crossed out. ---
function rotaBoard() {
  const g = new Grid(16, 24);
  g.rect(3, 15, 2, 8, WOOD[1]);
  g.rect(11, 15, 2, 8, WOOD[1]);
  g.rect(1, 4, 14, 11, WOOD[2]);
  g.rect(1, 4, 14, 1, WOOD[3]);
  g.rect(2, 6, 12, 8, '#2e3a34');
  g.rect(2, 6, 12, 1, '#3a4a44');
  for (const y of [8, 10, 12]) {
    g.rect(3, y, 5, 1, CHALK[1]);
    g.rect(9, y, 4, 1, CHALK[0]);
  }
  g.line(3, 10, 12, 10, CHALK[1]);
  g.rect(1, 14, 14, 1, WOOD[1]);
  g.rect(4, 14, 8, 1, CHALK[0]);
  g.outline(OUT);
  return g.rows();
}

// --- A fossil in the rock face: a curled shell in a smooth oval. ---
function fossil() {
  const g = new Grid(16, 16);
  g.oval(8, 8, 6, 5, ROCK[2]);
  g.oval(8, 8, 5, 4, ROCK[1]);
  const ring = [[8, 5], [10, 6], [11, 8], [10, 10], [8, 11], [6, 10], [5, 8], [6, 6], [8, 7], [9, 8], [8, 9], [7, 8]];
  for (const [x, y] of ring) g.set(x, y, '#c8bca8');
  g.set(8, 8, '#e8dcc8');
  g.outline(OUT);
  return g.rows();
}

// --- A coil of rope on a peg. ---
function ropeCoil() {
  const g = new Grid(16, 16);
  g.rect(7, 2, 2, 5, WOOD[2]);
  g.rect(5, 2, 6, 1, WOOD[3]);
  g.oval(8, 9, 5, 4, '#8a7048');
  g.oval(8, 9, 3, 2, OUT);
  g.oval(8, 9, 5, 4, '#8a7048');
  g.oval(8, 9, 2, 1, '#2a1c10');
  for (const [x, y] of [[4, 8], [6, 6], [10, 6], [12, 9], [10, 12], [6, 12]]) g.set(x, y, '#b8a070');
  g.line(12, 10, 14, 14, '#8a7048');
  g.outline(OUT);
  return g.rows();
}

// --- A three-legged stool, a candle-burn on its seat. ---
function stool() {
  const g = new Grid(16, 16);
  g.rect(3, 6, 10, 2, WOOD[2]);
  g.rect(3, 6, 10, 1, WOOD[3]);
  g.line(4, 8, 3, 14, WOOD[1]);
  g.line(12, 8, 13, 14, WOOD[1]);
  g.line(8, 8, 8, 14, WOOD[0]);
  g.set(9, 6, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

// --- A single scarlet leaf, a long way from any tree. ---
function leaf() {
  const g = new Grid(16, 16);
  g.oval(8, 10, 3, 1, '#c8402e');
  g.set(6, 10, '#e0702a');
  g.set(9, 9, '#a82838');
  g.line(11, 10, 13, 11, '#6a3a22');
  return g.rows();
}

// --- A snow bunting's feather: white with a dark tip, caught in a crack (a Mount Vigil callback). ---
function buntingFeather() {
  const g = new Grid(16, 16);
  g.line(4, 12, 11, 6, '#e8e8f0');
  g.line(5, 12, 12, 7, '#f8f8ff');
  g.line(6, 11, 11, 8, '#c8ccd8');
  g.set(11, 6, '#3a3a48');
  g.set(12, 6, '#3a3a48');
  g.set(12, 7, '#3a3a48');
  g.line(3, 13, 5, 12, '#a8a8b8');
  g.set(9, 7, '#d8d8e4');
  return g.rows();
}

// --- A mouse's crumbs: a cheese rind and a few of its seeds. ---
function rind() {
  const g = new Grid(16, 16);
  g.oval(8, 11, 3, 1, '#e8c860');
  g.set(7, 11, '#f4e090');
  g.set(10, 11, '#b89030');
  for (const [x, y] of [[4, 12], [11, 13], [13, 11], [3, 10]]) g.set(x, y, '#c8b078');
  return g.rows();
}

// --- A water barrel with its lid pushed to one side. ---
function barrel() {
  const g = new Grid(16, 16);
  g.rect(4, 5, 8, 10, WOOD[2]);
  g.rect(3, 7, 10, 6, WOOD[2]);
  g.rect(4, 5, 2, 10, WOOD[3]);
  g.rect(10, 5, 2, 10, WOOD[1]);
  g.rect(3, 7, 10, 1, IRON[1]);
  g.rect(3, 12, 10, 1, IRON[1]);
  g.rect(5, 5, 6, 1, '#2e5a66');
  g.set(7, 5, '#8ac0d0');
  g.rect(9, 3, 5, 2, WOOD[3]);
  g.outline(OUT);
  return g.rows();
}

// --- Glassy slag where the star's heat ran through the rock (the star rooms). ---
function glassSlag() {
  const g = new Grid(16, 16);
  g.oval(7, 11, 5, 2, '#3a4a5e');
  g.oval(7, 10, 4, 1, '#5a7088');
  g.oval(12, 13, 2, 1, '#3a4a5e');
  g.oval(3, 13, 2, 1, '#4a5e74');
  for (const [x, y] of [[5, 10], [8, 9], [10, 11]]) g.set(x, y, '#a8c8e8');
  g.set(6, 10, '#e8f4ff');
  g.outline('#0a1018');
  return g.rows();
}

// --- Pale's tin dish, with a crust in it (the star rooms). ---
function paleDish() {
  const g = new Grid(16, 16);
  g.oval(8, 12, 5, 2, IRON[1]);
  g.oval(8, 11, 4, 1, IRON[2]);
  g.oval(8, 11, 3, 1, IRON[0]);
  g.rect(6, 10, 3, 1, '#c89a58');
  g.set(9, 10, '#a87838');
  g.rect(3, 13, 10, 1, IRON[0]);
  g.outline(OUT);
  return g.rows();
}

// --- A scorched mark on the floor: soot in a ragged star shape. ---
function scorch() {
  const g = new Grid(16, 16);
  g.oval(8, 10, 6, 3, '#1a1618');
  g.oval(8, 10, 4, 2, '#0e0c10');
  for (const [x1, y1] of [[1, 7], [14, 8], [4, 13], [12, 13]]) g.line(8, 10, x1, y1, '#1a1618');
  g.set(7, 10, '#3a2e30');
  g.set(9, 9, '#4a3a36');
  return g.rows();
}

export const DG_PALETTE_EXTRA = palette;

export const DG_PROP_SPRITES = {
  dg_canary_cage: canaryCage(),
  dg_coal_heap: coalHeap(),
  dg_tally: tally(),
  dg_chalk_beam: chalkBeam(),
  dg_broken_cart: brokenCart(),
  dg_prop_stub: propStub(),
  dg_prop_lean: propLean(),
  dg_tin_mug: tinMug(),
  dg_boots: boots(),
  dg_boot: oneBoot(),
  dg_rusted_lamp: rustedLamp(),
  dg_bucket: bucket(),
  dg_grit: gritHeap(),
  dg_mushrooms: mushrooms(),
  dg_pipe: pipe(),
  dg_rota_board: rotaBoard(),
  dg_fossil: fossil(),
  dg_rope_coil: ropeCoil(),
  dg_stool: stool(),
  dg_leaf: leaf(),
  dg_rind: rind(),
  dg_feather: buntingFeather(),
  dg_barrel: barrel(),
  dg_glass_slag: glassSlag(),
  dg_pale_dish: paleDish(),
  dg_scorch: scorch(),
};

export const DG_FOOTPRINTS = { dg_broken_cart: 2 };
