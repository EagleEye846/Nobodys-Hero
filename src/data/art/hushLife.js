// Set dressing for chapter 3's Hushwood (the life pass, round 2, 15 November 2026): the small, quiet things
// of a wood that is holding its breath. Fungus that glows a little, a toadstool asleep, a bird sitting very
// still, ferns and moss and roots, the woodcutters' leavings (a saw, a lunch tin, a grindstone, a coat on a
// peg, a lantern on its post), claw marks on a trunk, a tuft of dark fur on a thorn, and Bramble's den (a
// stick fort, a sword with a tin lid for a shield, a jar of treasure, a wanted poster of the Hush, a KEEP
// OUT sign). Drawn like diggingsDressing.js (a tiny painter, 16 pixels to a tile, standing on the bottom
// edge and centred over the footprint). Every id starts `r3h_`. They are all placed `walkable` in the rooms,
// so none of them can stand in the way of a log, a treadle, a push, a swing, a carry or a walk.

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xbd00 + colors.size);
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

const OUT = '#0e0710';
const BARK = ['#1e0f14', '#3a1e22', '#5a3236', '#7a4a48'];
const WOOD = ['#2a1c10', '#4a3018', '#7a5630', '#a77a48'];
const CUT = ['#a87048', '#d0a070', '#e0b888'];
const LEAF = ['#5a1020', '#8a1426', '#b81e30', '#e0383e'];
const MOSS = ['#18261a', '#2a4226', '#4a6a38', '#6e8c4c'];
const GLOW = ['#1e4a4e', '#3aa89a', '#8ae8d0', '#d8fff0'];
const IRON = ['#2e2e38', '#5a5a68', '#8a8a9a', '#b4b4c4'];
const FUR = ['#16101a', '#2a2230', '#463c4a'];
const CHALK = ['#bcb8a8', '#e8e4d8'];
const CAP = ['#6a3a58', '#9a5a7a', '#c88aa8', '#e8c8d8'];

// A plain stump, rings on its cut top, bark down its sides. x, y is the top-left of its top.
function stumpAt(g, x, y, w, h) {
  g.rect(x, y + 2, w, h - 2, BARK[1]);
  g.rect(x, y + 2, 1, h - 2, BARK[3]);
  g.rect(x + w - 1, y + 2, 1, h - 2, BARK[0]);
  for (let i = 1; i < w - 1; i += 2) g.rect(x + i, y + 3, 1, h - 4, BARK[2]);
  g.oval(x + (w - 1) / 2, y + 1, w / 2 - 0.5, 1.4, CUT[1]);
  g.oval(x + (w - 1) / 2, y + 1, Math.max(1, w / 2 - 2), 0.6, CUT[0]);
  g.set(x + Math.floor(w / 2), y + 1, CUT[2]);
}

// --- Ferns and green: bodiless dressing. ---
function fern() {
  const g = new Grid(16, 16);
  for (const [dx, h, lean] of [[-5, 6, -3], [-2, 9, -1], [1, 10, 1], [4, 7, 3], [0, 6, 0]]) {
    g.line(8, 15, 8 + dx + lean, 15 - h, MOSS[2]);
    g.line(8, 15, 8 + dx, 15 - h + 1, MOSS[1]);
    for (let k = 3; k < h; k += 2) {
      g.set(8 + dx * (k / h) - 1, 15 - k, MOSS[3]);
      g.set(8 + dx * (k / h) + 1, 15 - k, MOSS[2]);
    }
  }
  g.rect(6, 15, 5, 1, MOSS[0]);
  g.outline(OUT);
  return g.rows();
}

function bracken() {
  const g = new Grid(16, 24);
  for (const [dx, h] of [[-5, 14], [-2, 19], [2, 21], [5, 15], [0, 12]]) {
    for (let k = 0; k < h; k++) {
      const x = 8 + dx * Math.pow(k / h, 1.5);
      g.set(x, 23 - k, k > h - 5 ? MOSS[3] : MOSS[1]);
    }
    for (let k = 4; k < h - 1; k += 2) {
      const x = 8 + dx * Math.pow(k / h, 1.5);
      g.set(x - 2, 23 - k + 1, MOSS[2]);
      g.set(x + 2, 23 - k + 1, MOSS[1]);
      g.set(x - 1, 23 - k, MOSS[3]);
      g.set(x + 1, 23 - k, MOSS[2]);
    }
  }
  g.rect(5, 23, 7, 1, MOSS[0]);
  g.outline(OUT);
  return g.rows();
}

function mossPatch() {
  const g = new Grid(16, 16);
  g.oval(8, 10, 6, 3, MOSS[1]);
  g.oval(7, 9, 4, 2, MOSS[2]);
  g.oval(5, 11, 3, 1, MOSS[0]);
  for (const [x, y] of [[9, 8], [6, 9], [11, 10], [4, 11]]) g.set(x, y, MOSS[3]);
  return g.rows();
}

function roots() {
  const g = new Grid(16, 16);
  g.line(0, 9, 5, 8, BARK[2]);
  g.line(5, 8, 10, 10, BARK[2]);
  g.line(10, 10, 15, 9, BARK[1]);
  g.line(5, 8, 7, 13, BARK[1]);
  g.line(3, 9, 6, 9, BARK[3]);
  g.line(0, 10, 5, 9, BARK[0]);
  g.line(10, 11, 15, 10, BARK[0]);
  g.set(7, 13, BARK[0]);
  return g.rows();
}

function acorns() {
  const g = new Grid(16, 16);
  for (const [x, y] of [[4, 10], [8, 12], [11, 9], [6, 8], [13, 12]]) {
    g.rect(x, y, 2, 2, WOOD[2]);
    g.rect(x, y, 2, 1, WOOD[1]);
    g.set(x, y + 1, WOOD[3]);
  }
  return g.rows();
}

function twigs() {
  const g = new Grid(16, 16);
  g.line(2, 11, 11, 9, WOOD[1]);
  g.line(4, 13, 14, 12, WOOD[0]);
  g.line(8, 10, 9, 7, WOOD[1]);
  g.line(6, 11, 4, 8, WOOD[2]);
  g.set(12, 9, WOOD[2]);
  return g.rows();
}

function leafDrift() {
  const g = new Grid(16, 16);
  g.oval(8, 11, 6, 2, LEAF[0]);
  g.oval(7, 10, 5, 2, LEAF[1]);
  for (const [x, y] of [[4, 10], [8, 9], [11, 11], [6, 11], [9, 12], [13, 11], [3, 12]]) {
    g.rect(x, y, 2, 1, LEAF[2]);
    g.set(x + 1, y, LEAF[3]);
  }
  g.set(7, 13, LEAF[0]);
  return g.rows();
}

// --- Glowing fungus: small pale caps that give a faint light of their own. ---
function glowcaps() {
  const g = new Grid(16, 16);
  for (const [x, y, w, h] of [[3, 12, 4, 3], [8, 13, 5, 4], [11, 11, 3, 3], [6, 10, 3, 2]]) {
    g.rect(x + Math.floor(w / 2), y + 1, 1, 15 - y - 1, '#6a8a8a');
    g.oval(x + w / 2, y, w / 2 + 0.5, 1, GLOW[1]);
    g.set(x + 1, y - 1, GLOW[2]);
    g.set(x + Math.floor(w / 2), y - 1, GLOW[3]);
  }
  g.rect(2, 15, 12, 1, MOSS[0]);
  g.outline('#06201e');
  return g.rows();
}

// Shelf fungus climbing a dead stub: pale fans, one over the other.
function bracket() {
  const g = new Grid(16, 24);
  g.rect(5, 2, 6, 22, BARK[1]);
  g.rect(5, 2, 1, 22, BARK[3]);
  g.rect(10, 2, 1, 22, BARK[0]);
  g.rect(4, 2, 8, 2, BARK[2]);
  for (const [x, y, w] of [[10, 9, 5], [1, 13, 5], [10, 17, 4]]) {
    g.rect(x, y, w, 2, GLOW[1]);
    g.rect(x, y, w, 1, GLOW[2]);
    g.rect(x + 1, y + 2, w - 2, 1, GLOW[0]);
  }
  g.set(12, 9, GLOW[3]);
  g.set(3, 13, GLOW[3]);
  g.outline(OUT);
  return g.rows();
}

// A ring of toadstools in the leaf litter: the wood's old rule, never step inside.
function toadRing() {
  const g = new Grid(32, 16);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const x = 16 + Math.cos(a) * 11;
    const y = 10 + Math.sin(a) * 4;
    g.rect(x, y + 1, 1, 2, CHALK[0]);
    g.rect(x - 1, y, 3, 1, CAP[1]);
    g.set(x, y - 1, CAP[2]);
    g.set(x, y, CAP[3]);
  }
  g.oval(16, 10, 6, 2, MOSS[0]);
  return g.rows();
}

// A toadstool, fat and asleep: two closed eyes, a small mouth. (The z's are drawn by its touch.)
function sleepcap() {
  const g = new Grid(16, 16);
  g.rect(5, 9, 6, 6, '#cdbfa8');
  g.rect(5, 9, 1, 6, '#e8dcc8');
  g.rect(10, 9, 1, 6, '#9a8c78');
  g.oval(8, 7, 7, 4, CAP[1]);
  g.oval(8, 6, 6, 3, CAP[2]);
  for (const [x, y] of [[4, 5], [10, 4], [8, 7], [12, 7]]) g.set(x, y, CAP[3]);
  g.rect(6, 10, 2, 1, '#2a1c24');
  g.rect(9, 10, 2, 1, '#2a1c24');
  g.rect(8, 12, 1, 1, '#2a1c24');
  g.rect(5, 15, 6, 1, MOSS[0]);
  g.outline(OUT);
  return g.rows();
}

// --- Stumps and logs, of different heights. ---
function stump() {
  const g = new Grid(16, 16);
  stumpAt(g, 3, 6, 10, 9);
  g.set(5, 14, BARK[0]);
  g.rect(2, 14, 3, 1, BARK[2]);
  g.rect(12, 14, 3, 1, BARK[2]);
  g.rect(4, 6, 3, 1, MOSS[2]);
  g.outline(OUT);
  return g.rows();
}

function stumpTall() {
  const g = new Grid(16, 24);
  stumpAt(g, 4, 5, 8, 18);
  g.rect(3, 22, 3, 2, BARK[2]);
  g.rect(11, 22, 3, 2, BARK[2]);
  g.rect(4, 12, 3, 5, MOSS[1]);
  g.rect(4, 12, 1, 5, MOSS[2]);
  g.rect(5, 5, 4, 1, MOSS[2]);
  g.outline(OUT);
  return g.rows();
}

function logPile() {
  const g = new Grid(32, 16);
  const row = (y, n, off) => {
    for (let i = 0; i < n; i++) {
      const x = off + i * 7;
      g.oval(x + 3, y + 3, 3, 3, BARK[1]);
      g.oval(x + 3, y + 3, 2, 2, CUT[1]);
      g.oval(x + 3, y + 3, 1, 1, CUT[0]);
      g.set(x + 3, y + 3, CUT[2]);
    }
  };
  row(8, 4, 2);
  row(3, 3, 5);
  g.rect(2, 14, 28, 1, BARK[0]);
  g.outline(OUT);
  return g.rows();
}

function hollowLog() {
  const g = new Grid(32, 16);
  g.rect(3, 6, 25, 9, BARK[1]);
  g.rect(3, 6, 25, 2, BARK[3]);
  g.rect(3, 13, 25, 2, BARK[0]);
  for (const x of [8, 14, 20, 25]) g.rect(x, 7, 1, 7, BARK[2]);
  g.oval(4, 10, 3, 4, '#0a0508');
  g.oval(4, 10, 2, 3, '#1a1014');
  g.oval(4, 10, 1, 2, '#0a0508');
  g.rect(14, 5, 5, 1, MOSS[2]);
  g.rect(15, 4, 3, 1, MOSS[3]);
  g.outline(OUT);
  return g.rows();
}

// A dead trunk, tall as the screen, with three great scratches down its bark.
function clawedTrunk() {
  const g = new Grid(16, 32);
  g.rect(4, 0, 9, 32, BARK[1]);
  g.rect(4, 0, 2, 32, BARK[3]);
  g.rect(11, 0, 2, 32, BARK[0]);
  for (const x of [7, 9]) for (let y = 2; y < 30; y += 5) g.rect(x, y, 1, 3, BARK[2]);
  g.rect(2, 29, 4, 3, BARK[2]);
  g.rect(11, 29, 4, 3, BARK[2]);
  for (const [x, y] of [[6, 6], [8, 5], [10, 7]]) g.line(x, y, x - 1, y + 13, CUT[1]);
  for (const [x, y] of [[6, 6], [8, 5], [10, 7]]) g.line(x + 1, y, x, y + 13, '#a05040');
  g.rect(5, 11, 1, 6, BARK[3]);
  g.outline(OUT);
  return g.rows();
}

function furTuft() {
  const g = new Grid(16, 16);
  g.line(3, 14, 5, 8, WOOD[1]);
  g.line(5, 8, 11, 6, WOOD[1]);
  g.line(11, 6, 13, 3, WOOD[1]);
  g.line(5, 8, 7, 4, WOOD[0]);
  g.set(7, 4, '#6a5a48');
  for (const [x, y] of [[7, 8], [8, 9], [6, 9], [9, 8], [10, 10], [8, 7]]) {
    g.rect(x, y, 2, 1, FUR[1]);
    g.set(x + 1, y + 1, FUR[0]);
    g.set(x, y - 1, FUR[2]);
  }
  g.rect(9, 11, 1, 2, FUR[1]);
  g.rect(5, 11, 1, 2, FUR[0]);
  g.outline(OUT);
  return g.rows();
}

function stillBird() {
  const g = new Grid(16, 16);
  stumpAt(g, 3, 10, 10, 5);
  g.oval(8, 7, 3, 3, '#6a5238');
  g.oval(8, 8, 2, 2, '#a89070');
  g.rect(6, 4, 3, 3, '#6a5238');
  g.set(6, 5, '#0e0710');
  g.rect(5, 5, 1, 1, '#d8a040');
  g.rect(10, 9, 3, 1, '#4a3a28');
  g.rect(7, 9, 1, 1, '#d8a040');
  g.rect(9, 9, 1, 1, '#d8a040');
  g.outline(OUT);
  return g.rows();
}

// --- The woodcutters' leavings. ---
function crosscutSaw() {
  const g = new Grid(16, 24);
  stumpAt(g, 7, 15, 8, 9);
  g.line(2, 21, 12, 5, IRON[2]);
  g.line(3, 21, 13, 5, IRON[1]);
  for (let k = 0; k < 9; k++) g.set(1 + k * 1.2, 21 - k * 1.8, IRON[3]);
  g.rect(11, 3, 3, 3, WOOD[2]);
  g.rect(1, 20, 3, 3, WOOD[2]);
  g.outline(OUT);
  return g.rows();
}

function lunchTin() {
  const g = new Grid(16, 16);
  stumpAt(g, 2, 8, 12, 7);
  g.rect(5, 3, 7, 5, IRON[1]);
  g.rect(5, 3, 7, 1, IRON[3]);
  g.rect(5, 7, 7, 1, IRON[0]);
  g.rect(6, 5, 5, 1, '#c8603a');
  g.line(6, 2, 10, 2, IRON[2]);
  g.rect(12, 5, 2, 1, WOOD[3]);
  g.outline(OUT);
  return g.rows();
}

function teaTin() {
  const g = new Grid(16, 16);
  stumpAt(g, 2, 8, 12, 7);
  g.rect(5, 3, 6, 5, '#7a3a2a');
  g.rect(5, 3, 6, 1, '#b86a4a');
  g.rect(5, 7, 6, 1, '#4a1e16');
  g.rect(6, 5, 4, 2, '#e0c890');
  g.set(7, 5, '#7a3a2a');
  g.set(9, 6, '#7a3a2a');
  g.rect(4, 2, 8, 1, '#8a4a38');
  g.outline(OUT);
  return g.rows();
}

function teaShelf() {
  const g = new Grid(16, 16);
  g.rect(1, 4, 14, 11, WOOD[1]);
  g.rect(1, 4, 14, 1, WOOD[3]);
  g.rect(2, 5, 12, 9, WOOD[0]);
  g.rect(1, 9, 14, 1, WOOD[2]);
  // Three round marks in the dust where tins stood, one tin-shaped gap.
  g.rect(3, 6, 3, 3, '#4a3a2a');
  g.rect(10, 6, 3, 3, '#4a3a2a');
  g.rect(3, 11, 3, 3, '#4a3a2a');
  g.rect(8, 11, 3, 3, '#5a4a38');
  g.set(9, 12, '#7a6a58');
  g.outline(OUT);
  return g.rows();
}

function grindstone() {
  const g = new Grid(16, 16);
  g.rect(2, 7, 2, 8, WOOD[1]);
  g.rect(12, 7, 2, 8, WOOD[1]);
  g.rect(2, 14, 12, 1, WOOD[0]);
  g.oval(8, 8, 5, 5, '#6a6a74');
  g.oval(8, 8, 4, 4, '#8a8a96');
  g.oval(8, 8, 1, 1, WOOD[1]);
  g.rect(11, 3, 3, 1, WOOD[3]);
  g.rect(13, 3, 1, 4, WOOD[3]);
  g.outline(OUT);
  return g.rows();
}

// A woodcutter's coat hung on a peg of a post, arms down, still the shape of its owner.
function coatPeg() {
  const g = new Grid(16, 24);
  g.rect(7, 1, 2, 23, WOOD[2]);
  g.rect(7, 1, 1, 23, WOOD[3]);
  g.rect(5, 3, 6, 1, WOOD[1]);
  g.rect(4, 4, 8, 11, '#5a3a2e');
  g.rect(4, 4, 8, 2, '#7a5a46');
  g.rect(3, 6, 2, 9, '#4a2e24');
  g.rect(11, 6, 2, 9, '#4a2e24');
  g.rect(7, 6, 2, 9, '#3a2218');
  for (const y of [8, 11]) g.set(8, y, '#c8a040');
  g.rect(4, 14, 8, 1, '#3a2218');
  g.rect(6, 22, 5, 2, WOOD[1]);
  g.outline(OUT);
  return g.rows();
}

function bootsOnStakes() {
  const g = new Grid(16, 16);
  g.rect(4, 6, 2, 9, WOOD[1]);
  g.rect(10, 6, 2, 9, WOOD[1]);
  for (const x of [3, 9]) {
    g.rect(x, 1, 4, 6, '#4a3020');
    g.rect(x, 1, 4, 1, '#7a5a40');
    g.rect(x - 1, 5, 2, 2, '#3a2218');
  }
  g.outline(OUT);
  return g.rows();
}

function waterBucket() {
  const g = new Grid(16, 16);
  g.rect(4, 6, 8, 9, WOOD[2]);
  g.rect(4, 6, 8, 1, WOOD[3]);
  for (const x of [5, 7, 9, 11]) g.rect(x, 7, 1, 8, WOOD[1]);
  g.rect(4, 8, 8, 1, IRON[1]);
  g.rect(4, 12, 8, 1, IRON[1]);
  g.rect(5, 6, 6, 1, '#2c3a78');
  g.set(7, 6, '#6a8ae0');
  g.line(4, 6, 8, 2, IRON[2]);
  g.line(12, 6, 8, 2, IRON[2]);
  g.outline(OUT);
  return g.rows();
}

function wedges() {
  const g = new Grid(16, 16);
  stumpAt(g, 2, 7, 12, 8);
  g.rect(7, 4, 2, 4, IRON[2]);
  g.rect(6, 2, 4, 2, IRON[1]);
  g.line(3, 6, 12, 1, WOOD[2]);
  g.line(3, 7, 12, 2, WOOD[1]);
  g.rect(10, 0, 4, 3, IRON[2]);
  g.rect(4, 9, 2, 3, IRON[3]);
  g.outline(OUT);
  return g.rows();
}

function sawhorse() {
  const g = new Grid(16, 16);
  g.rect(1, 5, 14, 3, WOOD[2]);
  g.rect(1, 5, 14, 1, WOOD[3]);
  g.line(3, 8, 1, 15, WOOD[1]);
  g.line(4, 8, 3, 15, WOOD[0]);
  g.line(12, 8, 14, 15, WOOD[1]);
  g.line(11, 8, 12, 15, WOOD[0]);
  g.rect(3, 2, 5, 3, WOOD[1]);
  g.rect(3, 2, 5, 1, CUT[1]);
  g.outline(OUT);
  return g.rows();
}

// A lantern on a post, hooked up high, its glass clean and its wick trimmed square. Unlit.
function postLantern() {
  const g = new Grid(16, 24);
  g.rect(3, 2, 2, 22, WOOD[2]);
  g.rect(3, 2, 1, 22, WOOD[3]);
  g.rect(3, 3, 9, 2, WOOD[2]);
  g.rect(3, 3, 9, 1, WOOD[3]);
  g.set(10, 5, IRON[2]);
  g.rect(8, 6, 5, 1, IRON[1]);
  g.rect(8, 6, 5, 1, IRON[2]);
  g.rect(8, 7, 5, 6, '#2a2a38');
  g.rect(9, 8, 3, 4, '#4a5060');
  g.set(10, 9, '#8a96a8');
  g.rect(8, 13, 5, 1, IRON[1]);
  g.rect(10, 7, 1, 1, '#c8c8c0');
  g.rect(2, 22, 5, 2, WOOD[1]);
  g.outline(OUT);
  return g.rows();
}

// --- Bramble's den. ---
function denFort() {
  const g = new Grid(32, 24);
  // A lean-to: sticks slanting against a low branch, a patch of old sacking over the top.
  g.line(4, 23, 14, 3, WOOD[2]);
  g.line(5, 23, 15, 3, WOOD[1]);
  g.line(10, 23, 18, 5, WOOD[2]);
  g.line(16, 23, 22, 6, WOOD[1]);
  g.line(24, 23, 24, 6, WOOD[2]);
  g.line(28, 23, 25, 6, WOOD[1]);
  g.rect(13, 3, 14, 1, WOOD[3]);
  g.rect(14, 4, 13, 7, '#6a5a3a');
  g.rect(14, 4, 13, 1, '#8a7a52');
  g.rect(14, 10, 13, 1, '#3a2e1c');
  g.set(18, 7, '#3a2e1c');
  g.set(22, 8, '#3a2e1c');
  g.rect(15, 12, 8, 10, '#14101a');
  g.rect(14, 12, 1, 11, WOOD[1]);
  g.rect(23, 12, 1, 11, WOOD[1]);
  g.rect(18, 14, 3, 3, '#2a2230');
  // A red scarf for a flag.
  g.line(26, 2, 26, 8, WOOD[2]);
  g.rect(27, 2, 4, 2, '#c8302a');
  g.set(30, 3, '#c8302a');
  g.outline(OUT);
  return g.rows();
}

function woodSword() {
  const g = new Grid(16, 16);
  g.line(5, 14, 5, 1, WOOD[3]);
  g.line(6, 14, 6, 1, WOOD[2]);
  g.rect(3, 4, 5, 1, WOOD[1]);
  g.rect(5, 0, 2, 1, WOOD[3]);
  // The shield: a tin lid on a stick, dented.
  g.line(12, 15, 12, 7, WOOD[2]);
  g.oval(11, 7, 3, 3, IRON[2]);
  g.oval(11, 7, 2, 2, IRON[3]);
  g.set(12, 6, IRON[1]);
  g.set(10, 8, IRON[1]);
  g.rect(9, 15, 6, 1, MOSS[0]);
  g.outline(OUT);
  return g.rows();
}

function treasureJar() {
  const g = new Grid(16, 16);
  g.rect(4, 4, 8, 11, '#5a7a8a');
  g.rect(5, 5, 6, 9, '#9ac0cc');
  g.rect(5, 2, 6, 2, WOOD[2]);
  g.rect(5, 2, 6, 1, WOOD[3]);
  g.rect(6, 6, 1, 6, '#e8f4f8');
  // The treasure: a button, a bent key, a blue pebble, a fang-ish tooth, a coin that is a bottle cap.
  g.rect(6, 11, 4, 3, '#7a7a82');
  g.set(7, 10, '#e0b030');
  g.rect(8, 10, 2, 1, '#4a8ad0');
  g.line(6, 12, 9, 12, '#c8a040');
  g.set(9, 11, '#e8e4d8');
  g.outline(OUT);
  return g.rows();
}

function keepOut() {
  const g = new Grid(16, 16);
  g.rect(7, 7, 2, 8, WOOD[2]);
  g.rect(7, 7, 1, 8, WOOD[3]);
  g.rect(1, 1, 14, 7, '#c8b078');
  g.rect(1, 1, 14, 1, '#e8d8a0');
  g.rect(1, 7, 14, 1, '#7a6a40');
  // Letters, in red crayon, getting smaller as it runs out of room, and one backwards.
  for (const x of [3, 5, 7, 9]) g.rect(x, 2, 1, 3, '#b8302a');
  g.rect(3, 2, 2, 1, '#b8302a');
  g.rect(6, 5, 3, 1, '#b8302a');
  g.rect(11, 2, 1, 3, '#b8302a');
  g.rect(12, 4, 2, 1, '#b8302a');
  g.rect(3, 6, 9, 1, '#b8302a');
  g.outline(OUT);
  return g.rows();
}

function bugBox() {
  const g = new Grid(16, 16);
  g.rect(4, 10, 8, 4, '#c8a050');
  g.rect(4, 10, 8, 1, '#e8c878');
  g.rect(5, 11, 6, 2, '#6a4a28');
  for (const x of [5, 7, 9]) g.set(x, 11, '#14101a');
  g.set(11, 9, '#4a3020');
  g.set(12, 8, '#4a3020');
  g.outline(OUT);
  return g.rows();
}

// A poster nailed to a post: the Hush, drawn by a ten-year-old, with a great many teeth.
function wanted() {
  const g = new Grid(16, 24);
  g.rect(7, 12, 2, 12, WOOD[2]);
  g.rect(7, 12, 1, 12, WOOD[3]);
  g.rect(1, 1, 14, 13, '#d8c898');
  g.rect(1, 1, 14, 1, '#f0e4b8');
  g.rect(1, 13, 14, 1, '#8a7a50');
  g.rect(3, 3, 10, 6, '#3a2e3a');
  g.set(5, 5, '#e8862c');
  g.set(6, 5, '#e8862c');
  for (let x = 4; x < 12; x += 2) g.rect(x, 7, 1, 2, '#f0f0e0');
  g.rect(3, 2, 2, 1, '#3a2e3a');
  g.rect(11, 2, 2, 1, '#3a2e3a');
  g.rect(3, 10, 5, 1, '#b8302a');
  g.rect(9, 10, 4, 1, '#b8302a');
  g.rect(4, 12, 7, 1, '#b8302a');
  g.set(2, 2, IRON[2]);
  g.set(13, 2, IRON[2]);
  g.outline(OUT);
  return g.rows();
}

function pennant() {
  const g = new Grid(16, 24);
  g.line(5, 23, 5, 2, WOOD[2]);
  g.line(6, 23, 6, 2, WOOD[1]);
  // A sock, striped, hung out to be a flag.
  g.rect(7, 3, 6, 8, '#b8402a');
  g.rect(7, 5, 6, 2, '#e8d8b0');
  g.rect(7, 9, 6, 2, '#e8d8b0');
  g.rect(9, 11, 4, 3, '#b8402a');
  g.rect(12, 14, 3, 1, '#b8402a');
  g.rect(7, 3, 6, 1, '#d86a4a');
  g.rect(5, 22, 5, 1, MOSS[0]);
  g.outline(OUT);
  return g.rows();
}

// --- The crater, the Gorge, the mill leat, the junk shop. ---
function wateringCan() {
  const g = new Grid(16, 16);
  g.rect(4, 7, 7, 7, '#7a8a7a');
  g.rect(4, 7, 7, 1, '#a8b8a8');
  g.rect(4, 13, 7, 1, '#4a5a4a');
  g.line(11, 9, 14, 5, '#7a8a7a');
  g.line(11, 10, 14, 6, '#5a6a5a');
  g.rect(13, 4, 3, 1, '#a8b8a8');
  g.line(4, 8, 2, 11, '#5a6a5a');
  g.line(3, 11, 6, 13, '#5a6a5a');
  // A green sprout in the top, with two leaves, and one white flower.
  g.line(7, 7, 7, 3, MOSS[2]);
  g.rect(5, 4, 2, 1, MOSS[3]);
  g.rect(8, 5, 2, 1, MOSS[3]);
  g.rect(6, 2, 3, 2, '#f0f0e8');
  g.set(7, 2, '#f0d050');
  g.outline(OUT);
  return g.rows();
}

function starDust() {
  const g = new Grid(16, 16);
  g.oval(8, 10, 6, 3, '#1e2a4a');
  g.oval(8, 10, 4, 2, '#2a3c66');
  for (const [x, y] of [[4, 9], [8, 8], [11, 10], [6, 11], [9, 12], [13, 11], [2, 11], [7, 10]]) g.set(x, y, '#9ad8ff');
  for (const [x, y] of [[5, 10], [10, 9], [8, 11]]) g.set(x, y, '#e8f8ff');
  return g.rows();
}

function leatWeed() {
  const g = new Grid(16, 16);
  for (const [dx, h] of [[-4, 7], [-2, 10], [0, 8], [2, 11], [4, 6]]) {
    g.line(8 + dx, 15, 8 + dx + (dx > 0 ? 1 : -1), 15 - h, MOSS[1]);
    g.line(9 + dx, 15, 9 + dx + (dx > 0 ? 1 : -1), 15 - h + 1, MOSS[2]);
    g.set(8 + dx + (dx > 0 ? 1 : -1), 15 - h, MOSS[3]);
  }
  g.rect(3, 15, 10, 1, '#2c3a78');
  g.outline(OUT);
  return g.rows();
}

function millstone() {
  const g = new Grid(16, 16);
  g.oval(8, 11, 7, 4, '#5a5a62');
  g.oval(8, 10, 7, 3, '#8a8a92');
  g.oval(8, 10, 2, 1, '#2a2a30');
  g.rect(1, 12, 14, 3, '#2e2a26');
  g.rect(1, 12, 14, 1, '#4a423a');
  for (const x of [3, 6, 10, 13]) g.line(8, 10, x, 8 + (x % 3), '#6a6a72');
  g.rect(2, 13, 3, 1, MOSS[2]);
  g.rect(11, 13, 3, 1, MOSS[1]);
  g.outline(OUT);
  return g.rows();
}

function skis() {
  const g = new Grid(16, 24);
  g.line(5, 23, 7, 1, WOOD[3]);
  g.line(6, 23, 8, 1, WOOD[2]);
  g.line(10, 23, 11, 3, WOOD[2]);
  g.line(11, 23, 12, 3, WOOD[1]);
  g.rect(7, 0, 2, 3, WOOD[3]);
  g.rect(10, 2, 2, 2, WOOD[3]);
  g.rect(5, 12, 7, 1, '#7a5a2a');
  g.rect(4, 20, 8, 1, '#c8a050');
  g.outline(OUT);
  return g.rows();
}

function handlessClock() {
  const g = new Grid(16, 24);
  g.rect(3, 2, 10, 22, WOOD[1]);
  g.rect(3, 2, 10, 1, WOOD[3]);
  g.rect(3, 2, 1, 22, WOOD[2]);
  g.rect(12, 2, 1, 22, WOOD[0]);
  g.oval(8, 8, 4, 4, '#d8c898');
  g.oval(8, 8, 3, 3, '#e8dcb0');
  g.set(8, 5, '#2a1c10');
  g.set(8, 11, '#2a1c10');
  g.set(5, 8, '#2a1c10');
  g.set(11, 8, '#2a1c10');
  g.set(8, 8, '#2a1c10');
  g.rect(5, 15, 6, 6, '#2a1c10');
  g.line(8, 16, 8, 20, '#c8a040');
  g.outline(OUT);
  return g.rows();
}

function umbrellaStand() {
  const g = new Grid(16, 24);
  g.rect(3, 15, 10, 9, WOOD[2]);
  g.rect(3, 15, 10, 1, WOOD[3]);
  g.rect(3, 22, 10, 2, WOOD[0]);
  g.rect(3, 18, 10, 1, IRON[1]);
  const furled = (x, h, c) => { g.line(x, 15, x + 1, 15 - h, c); g.line(x + 1, 15, x + 2, 15 - h, c); g.set(x + 2, 15 - h - 1, WOOD[3]); };
  furled(4, 12, '#2a5a8a');
  furled(7, 14, '#5a2a6a');
  furled(10, 11, '#3a5a3a');
  g.outline(OUT);
  return g.rows();
}

function mugTree() {
  const g = new Grid(16, 24);
  g.rect(7, 4, 2, 20, WOOD[2]);
  g.rect(7, 4, 1, 20, WOOD[3]);
  g.rect(4, 22, 8, 2, WOOD[1]);
  for (const [x, y, c] of [[2, 5, '#c8603a'], [10, 8, '#4a7aa8'], [2, 12, '#e0c890'], [10, 15, '#8a4a6a']]) {
    g.rect(x, y, 4, 4, c);
    g.set(x + (x < 7 ? 4 : -1), y + 1, c);
    g.set(x + (x < 7 ? 4 : -1), y + 2, c);
    g.rect(x + 1, y, 2, 1, '#14101a');
    g.line(x < 7 ? x + 4 : x, y + 3, 8, y + 3, WOOD[2]);
  }
  g.outline(OUT);
  return g.rows();
}

// An egg-box of pebbles: every one of them labelled FOUND, in a small hand.
function pebbleBox() {
  const g = new Grid(16, 16);
  g.rect(2, 9, 12, 5, WOOD[2]);
  g.rect(2, 9, 12, 1, WOOD[3]);
  g.rect(2, 13, 12, 1, WOOD[0]);
  for (const [x, y, c] of [[3, 7, '#8a8a92'], [6, 6, '#6a7a8a'], [8, 7, '#9a8a7a'], [11, 6, '#5a5a62'], [5, 8, '#aaa'], [10, 8, '#8a7a6a']]) g.rect(x, y, 2, 2, c);
  g.outline(OUT);
  return g.rows();
}

export const HUSH_LIFE_PALETTE_EXTRA = palette;

export const HUSH_LIFE_PROP_SPRITES = {
  r3h_fern: fern(),
  r3h_bracken: bracken(),
  r3h_moss: mossPatch(),
  r3h_roots: roots(),
  r3h_acorns: acorns(),
  r3h_twigs: twigs(),
  r3h_leafdrift: leafDrift(),
  r3h_glowcaps: glowcaps(),
  r3h_bracket: bracket(),
  r3h_toadring: toadRing(),
  r3h_sleepcap: sleepcap(),
  r3h_stump: stump(),
  r3h_stump_tall: stumpTall(),
  r3h_logpile: logPile(),
  r3h_hollowlog: hollowLog(),
  r3h_clawed: clawedTrunk(),
  r3h_fur: furTuft(),
  r3h_stillbird: stillBird(),
  r3h_saw: crosscutSaw(),
  r3h_lunchtin: lunchTin(),
  r3h_teatin: teaTin(),
  r3h_teashelf: teaShelf(),
  r3h_grindstone: grindstone(),
  r3h_coat: coatPeg(),
  r3h_boots: bootsOnStakes(),
  r3h_bucket: waterBucket(),
  r3h_wedges: wedges(),
  r3h_sawhorse: sawhorse(),
  r3h_lantern: postLantern(),
  r3h_fort: denFort(),
  r3h_sword: woodSword(),
  r3h_jar: treasureJar(),
  r3h_keepout: keepOut(),
  r3h_bugbox: bugBox(),
  r3h_wanted: wanted(),
  r3h_pennant: pennant(),
  r3h_can: wateringCan(),
  r3h_stardust: starDust(),
  r3h_leatweed: leatWeed(),
  r3h_millstone: millstone(),
  r3h_skis: skis(),
  r3h_clock: handlessClock(),
  r3h_umbrellas: umbrellaStand(),
  r3h_mugtree: mugTree(),
  r3h_pebblebox: pebbleBox(),
};

export const HUSH_LIFE_FOOTPRINTS = { r3h_toadring: 2, r3h_logpile: 2, r3h_hollowlog: 2, r3h_fort: 2 };
