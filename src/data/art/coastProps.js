// Props for Chapter 5's coast ("The Tide Held"): the happy beach, the storm
// shore, Saltcombe's stilt houses, the sunken lanes, the Wreck Yard, the
// Soundings, the Beacon Isles, Haddock's Light and the Last Light. Drawn like
// brightProps.js: rows of characters from small painter helpers below, 16
// pixels to a tile, standing on the bottom edge and centred over their
// footprint. Every id starts `c5_`. The storm look is cold: wet dark wood,
// green-grey stone, rusted iron, with small warm lamp colours against it.
//
// Wide ones list their width in tiles in COAST_FOOTPRINTS. Ones that move are
// also animations: put the prop's name in the object's `animation` too. What
// glows is in COAST_GLOWS (src/overworld/lamplight.js reads it). The full
// list, with notes for room builders, is in notes/docs/chapter-5-builders-guide.md.

// --- A tiny painter ---------------------------------------------------
const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xec00 + colors.size);
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

  // A line `t` pixels thick (squares along the line).
  thick(x0, y0, x1, y1, t, c) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) this.rect(Math.round(x0 + ((x1 - x0) * i) / steps) - Math.floor(t / 2), Math.round(y0 + ((y1 - y0) * i) / steps) - Math.floor(t / 2), t, t, c);
  }

  ring(cx, cy, r, c, steps = 0) {
    const n = steps || Math.max(16, r * 8);
    for (let i = 0; i < n; i++) this.set(cx + Math.cos((i / n) * 6.2832) * r, cy + Math.sin((i / n) * 6.2832) * r, c);
  }

  // Scanline fill of a polygon [[x, y], ...].
  poly(pts, c) {
    const ys = pts.map((p) => p[1]);
    for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) {
      const xs = [];
      for (let i = 0; i < pts.length; i++) {
        const [ax, ay] = pts[i];
        const [bx, by] = pts[(i + 1) % pts.length];
        if ((ay <= y + 0.5 && by > y + 0.5) || (by <= y + 0.5 && ay > y + 0.5)) xs.push(ax + ((y + 0.5 - ay) / (by - ay)) * (bx - ax));
      }
      xs.sort((a, b) => a - b);
      for (let i = 0; i + 1 < xs.length; i += 2) this.rect(Math.round(xs[i]), y, Math.max(1, Math.round(xs[i + 1]) - Math.round(xs[i])), 1, c);
    }
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

  paste(other, ox, oy) {
    for (let y = 0; y < other.h; y++) for (let x = 0; x < other.w; x++) if (other.cells[y][x]) this.set(ox + x, oy + y, other.cells[y][x]);
  }

  rows() {
    return this.cells.map((row) => row.map((c) => (c ? char(c) : '.')).join(''));
  }
}

let seed = 11;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const ri = (n) => Math.floor(rand() * n);

// --- Colours: [dark, mid, light, highlight] -----------------------------
const OUT = '#10181e';
const WOOD = ['#2a231e', '#4a3a2c', '#6c5440', '#907a5c'];
const DRIFT = ['#3c3c3a', '#5a5a52', '#7e7e70', '#a4a490'];
const IRON = ['#161a22', '#2e3642', '#505c6a', '#7c8c9a'];
const RUST = ['#3a1c14', '#6a3420', '#9a5430', '#c8803c'];
const BRASS = ['#5c3e10', '#a07020', '#d8a838', '#fae27c'];
const ROPE = ['#5a4a2c', '#8c7644', '#bca46c'];
const SAIL = ['#58523f', '#8a846a', '#bcb698'];
const RED = ['#5e1a1a', '#b03834', '#dc5e4c'];
const WHITE = ['#7c8284', '#c8ccc6', '#f2f2e8'];
const YELLOW = ['#80580e', '#dca020', '#fad648'];
const BLUE = ['#1c3860', '#3a66a6', '#6c9cd2'];
const GREEN = ['#16402e', '#2c7a52', '#58b080'];
const STONE = ['#242c32', '#444e54', '#6a747a', '#929c9e'];
const SAND = ['#8c7648', '#bca470', '#e0cc98'];
const WEED = ['#10301e', '#1e5a30', '#3e8a40', '#6ab05a'];
const WATER = ['#0e3238', '#1c585a', '#3a8882', '#8ccec0'];
const GLASS = ['#1c3a44', '#3a7480', '#7cc0c8', '#d4f4f0'];
const LAMPY = ['#a85c10', '#f0a030', '#ffd870', '#fff6c8'];
const SLATE = ['#1e2630', '#323e4a', '#4a5a68'];

// A block lit from the top left.
function box(g, x, y, w, h, ramp) {
  g.rect(x, y, w, h, ramp[1]);
  g.rect(x, y, w, 1, ramp[2]);
  g.rect(x, y, 1, h, ramp[2]);
  g.rect(x + w - 1, y, 1, h, ramp[0]);
  g.rect(x, y + h - 1, w, 1, ramp[0]);
}
// Upright post.
function post(g, x, top, bottom, w, ramp = WOOD) {
  g.rect(x, top, w, bottom - top + 1, ramp[1]);
  g.rect(x, top, 1, bottom - top + 1, ramp[2]);
  g.rect(x + w - 1, top, 1, bottom - top + 1, ramp[0]);
}
// Horizontal planks with seams.
function planks(g, x, y, w, h, ramp = WOOD, every = 4) {
  g.rect(x, y, w, h, ramp[1]);
  for (let j = 0; j < h; j += every) {
    g.rect(x, y + j, w, 1, ramp[0]);
    if (j + 1 < h) g.rect(x, y + j + 1, w, 1, ramp[2]);
  }
  for (let j = 0; j < h; j += every) if (rand() < 0.8) g.set(x + 2 + ri(Math.max(1, w - 4)), y + j + 2, ramp[0]);
}
function vplanks(g, x, y, w, h, ramp = WOOD, every = 4) {
  g.rect(x, y, w, h, ramp[1]);
  for (let i = 0; i < w; i += every) {
    g.rect(x + i, y, 1, h, ramp[0]);
    if (i + 1 < w) g.rect(x + i + 1, y, 1, h, ramp[2]);
  }
}
function stoneWall(g, x, y, w, h, ramp = STONE) {
  g.rect(x, y, w, h, ramp[1]);
  for (let j = 0; j < h; j += 4) {
    g.rect(x, y + j, w, 1, ramp[0]);
    const off = (j / 4) % 2 ? 4 : 0;
    for (let i = off; i < w; i += 8) g.rect(x + i, y + j, 1, Math.min(4, h - j), ramp[0]);
  }
  for (let k = 0; k < w * h / 40; k++) g.set(x + ri(w), y + ri(h), ramp[2]);
}
function weedTuft(g, x, y, n, h) {
  for (let i = 0; i < n; i++) {
    const bx = x + i * 2 - n;
    const hh = h - ri(3);
    for (let j = 0; j < hh; j++) g.set(bx + Math.round(Math.sin(j / 2 + i) * 1), y - j, WEED[1 + (i % 2)]);
    g.set(bx, y - hh, WEED[3]);
  }
}

// A tiny 3x5 font for painted names.
const FONT = {
  B: ['11.', '1.1', '11.', '1.1', '11.'],
  O: ['.1.', '1.1', '1.1', '1.1', '.1.'],
  T: ['111', '.1.', '.1.', '.1.', '.1.'],
  H: ['1.1', '1.1', '111', '1.1', '1.1'],
  E: ['111', '1..', '11.', '1..', '111'],
  R: ['11.', '1.1', '11.', '1.1', '1.1'],
  L: ['1..', '1..', '1..', '1..', '111'],
};
function paint(g, text, x, y, c) {
  [...text].forEach((ch, i) => FONT[ch]?.forEach((row, j) => [...row].forEach((v, k) => { if (v === '1') g.set(x + i * 4 + k, y + j, c); })));
}

// ===================== THE HAPPY BEACH (gullrest) =====================
function buntingString(f) {
  const g = new Grid(48, 24);
  const flags = [RED[1], YELLOW[1], BLUE[2], GREEN[2], WHITE[1], RED[2]];
  for (const px of [0, 45]) {
    post(g, px, 2, 23, 3);
    g.rect(px, 1, 3, 1, WOOD[3]);
    g.rect(px, 21, 3, 2, WOOD[0]);
  }
  const sag = (x) => Math.round(Math.sin(((x - 2) / 43) * Math.PI) * 6);
  for (let x = 3; x < 45; x++) g.set(x, 3 + sag(x), ROPE[1]);
  for (let i = 0; i < 9; i++) {
    const fx = 6 + i * 4.5;
    const x = Math.round(fx);
    const s = 3 + sag(x);
    const sway = Math.round(Math.sin(f * 2.1 + i * 1.3));
    const col = flags[i % flags.length];
    for (let r = 0; r < 5; r++) g.rect(x + (r > 2 ? sway : 0), s + 1 + r, 3 - Math.floor(r / 2), 1, col);
    g.set(x + sway, s + 5, col);
  }
  g.outline(OUT);
  return g.rows();
}
function buntingPost(f) {
  const g = new Grid(16, 32);
  post(g, 6, 3, 31, 3);
  g.rect(5, 2, 5, 2, WOOD[3]);
  g.rect(5, 29, 5, 3, WOOD[0]);
  g.rect(4, 31, 7, 1, STONE[1]);
  // A short length of string with a few flags drooping, and a pennant on top.
  g.line(9, 4, 15, 8 + (f % 2), ROPE[1]);
  const cols = [RED[1], YELLOW[1], BLUE[2]];
  for (let i = 0; i < 3; i++) for (let r = 0; r < 4; r++) g.rect(10 + i * 2 + (r > 2 ? f % 2 : 0), 6 + i + r, 2 - (r > 1 ? 1 : 0), 1, cols[i]);
  g.poly([[8, 1], [8 + 6 + (f % 2), 2], [8, 4]], RED[1]);
  g.outline(OUT);
  return g.rows();
}

function deckchair() {
  const g = new Grid(20, 24);
  // Frame: back legs, front legs, an arm bar; then striped canvas over the top.
  g.thick(4, 22, 11, 14, 2, WOOD[1]);
  g.thick(18, 22, 12, 14, 2, WOOD[1]);
  g.thick(15, 8, 18, 20, 1, WOOD[0]);
  g.thick(13, 6, 17, 12, 2, WOOD[2]);
  const stripe = (i) => (Math.floor(i / 2) % 2 ? WHITE[2] : RED[1]);
  // Back rest slopes up and to the left; seat dips to the right.
  const seg = (x0, y0, x1, y1, t) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let i = 0; i <= n; i++) g.rect(Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), t, t, stripe(i));
  };
  seg(3, 2, 10, 15, 4);
  seg(11, 16, 17, 13, 3);
  g.rect(2, 0, 5, 2, WOOD[2]);
  g.outline(OUT);
  return g.rows();
}

function beachHut() {
  const g = new Grid(48, 52);
  // Stripes, roof, door, window.
  for (let x = 0; x < 40; x++) g.rect(4 + x, 22, 1, 29, Math.floor(x / 4) % 2 ? WHITE[2] : BLUE[1]);
  g.rect(4, 22, 40, 2, WOOD[2]);
  g.rect(4, 49, 40, 2, WOOD[0]);
  g.poly([[0, 22], [24, 5], [48, 22]], RED[1]);
  g.poly([[3, 22], [24, 8], [45, 22]], RED[2]);
  for (let i = 0; i < 6; i++) g.line(3 + i * 7, 22, 24, 7, RED[0]);
  g.rect(0, 21, 48, 2, WOOD[0]);
  g.rect(10, 30, 12, 21, WOOD[1]);
  g.rect(11, 31, 10, 19, WOOD[2]);
  g.rect(15, 31, 1, 19, WOOD[0]);
  g.set(19, 41, BRASS[3]);
  g.rect(28, 30, 10, 9, GLASS[1]);
  g.rect(28, 30, 10, 1, WOOD[3]);
  g.rect(28, 38, 10, 1, WOOD[3]);
  g.rect(32, 30, 1, 9, WOOD[3]);
  g.rect(29, 31, 2, 1, GLASS[3]);
  g.rect(9, 51 - 1, 14, 1, STONE[1]);
  g.outline(OUT);
  return g.rows();
}

function rowboat(named) {
  const g = new Grid(52, 26);
  const hull = named ? GREEN : WOOD;
  // The inside seen from slightly above: dark floor, thwarts, a bailer.
  g.poly([[4, 6], [48, 7], [50, 9], [6, 10]], WOOD[0]);
  g.rect(14, 7, 3, 3, WOOD[2]);
  g.rect(30, 7, 3, 3, WOOD[2]);
  g.rect(22, 8, 4, 2, IRON[2]);
  // The hull: pointed bow high on the left, flat transom on the right.
  g.poly([[0, 7], [6, 9], [50, 9], [51, 13], [47, 19], [38, 23], [14, 23], [6, 18], [2, 12]], hull[1]);
  g.poly([[1, 8], [6, 10], [50, 10], [50, 12], [4, 12]], hull[2]);
  for (const y of [14, 17, 20]) for (let x = 4; x < 50; x++) if (g.get(x, y) === hull[1]) g.set(x, y, hull[0]);
  g.poly([[0, 7], [6, 9], [50, 9], [51, 10], [6, 11], [1, 9]], WOOD[3]);
  // Oars lying across and a rope from the bow.
  g.thick(10, 5, 42, 3, 1, WOOD[3]);
  g.rect(40, 1, 7, 3, WOOD[2]);
  g.thick(2, 10, 0, 20, 1, ROPE[2]);
  if (named) {
    g.rect(8, 13, 28, 7, WHITE[1]);
    g.rect(8, 13, 28, 1, WHITE[2]);
    paint(g, 'BOTHER', 10, 14, GREEN[0]);
    g.rect(3, 12, 46, 1, YELLOW[1]);
  } else {
    g.rect(5, 12, 45, 1, RED[1]);
  }
  g.rect(8, 24, 36, 2, null);
  g.outline(OUT);
  return g.rows();
}

function lifeboatDoors() {
  const g = new Grid(64, 60);
  stoneWall(g, 2, 14, 60, 45, STONE);
  g.poly([[0, 16], [32, -2], [64, 16]], SLATE[1]);
  g.poly([[4, 16], [32, 2], [60, 16]], SLATE[2]);
  for (let i = 0; i < 8; i++) g.line(4 + i * 8, 16, 32, 2, SLATE[0]);
  g.rect(0, 15, 64, 2, WOOD[0]);
  // The tall double doors, arched.
  g.rect(14, 24, 36, 35, WOOD[1]);
  g.oval(32, 26, 18, 8, WOOD[1]);
  vplanks(g, 15, 22, 34, 37, WOOD, 4);
  g.rect(31, 18, 2, 41, IRON[0]);
  g.rect(14, 38, 36, 2, IRON[1]);
  g.rect(14, 50, 36, 2, IRON[1]);
  for (let i = 0; i < 4; i++) { g.set(18 + i * 9, 39, IRON[3]); g.set(18 + i * 9, 51, IRON[3]); }
  g.rect(12, 56, 40, 3, STONE[2]);
  // A red lintel plaque and a lifebuoy by the door.
  g.rect(22, 14, 20, 5, RED[1]);
  g.rect(22, 14, 20, 1, RED[2]);
  for (let i = 0; i < 5; i++) g.rect(24 + i * 4, 16, 2, 2, WHITE[2]);
  g.ring(7, 36, 4, WHITE[2]);
  g.ring(7, 36, 3, RED[1]);
  g.ring(7, 36, 5, WHITE[1]);
  g.rect(53, 28, 6, 8, GLASS[1]);
  g.rect(53, 28, 6, 1, STONE[3]);
  g.outline(OUT);
  return g.rows();
}
function lifebuoyPost() {
  const g = new Grid(16, 30);
  post(g, 6, 8, 29, 3);
  g.rect(3, 6, 10, 3, WOOD[2]);
  g.rect(4, 28, 8, 2, STONE[1]);
  for (const [r, c] of [[6, WHITE[2]], [5, RED[1]], [4, WHITE[2]]]) g.ring(8, 6, r, c);
  g.ring(8, 6, 3, RED[1]);
  for (let a = 0; a < 4; a++) g.rect(Math.round(8 + Math.cos(a * 1.57) * 5), Math.round(6 + Math.sin(a * 1.57) * 5), 2, 2, RED[2]);
  g.outline(OUT);
  return g.rows();
}

// A child's yellow oilskin hung from a peg on a little coat-stand.
function oilskinHook() {
  const g = new Grid(16, 30);
  post(g, 1, 4, 29, 2);
  post(g, 13, 4, 29, 2);
  g.rect(1, 3, 14, 3, WOOD[2]);
  g.rect(1, 3, 14, 1, WOOD[3]);
  g.rect(1, 28, 3, 2, WOOD[0]);
  g.rect(12, 28, 3, 2, WOOD[0]);
  g.rect(7, 6, 2, 2, IRON[2]);
  // The coat: a small yellow hooded oilskin, buttons, a dark patch.
  g.rect(5, 8, 6, 3, YELLOW[2]);
  g.rect(4, 11, 8, 12, YELLOW[1]);
  g.rect(3, 12, 2, 9, YELLOW[1]);
  g.rect(11, 12, 2, 9, YELLOW[0]);
  g.rect(4, 11, 1, 12, YELLOW[2]);
  g.rect(8, 11, 1, 12, YELLOW[0]);
  for (const y of [13, 16, 19]) g.set(7, y, WOOD[0]);
  g.rect(6, 8, 4, 1, YELLOW[0]);
  g.rect(4, 22, 8, 1, YELLOW[0]);
  g.outline(OUT);
  return g.rows();
}

function lanternPost(state) {
  // state 0 unlit, 1..3 lit (brightness frames).
  const g = new Grid(16, 42);
  post(g, 6, 14, 41, 3, IRON);
  g.rect(4, 38, 8, 4, IRON[1]);
  g.rect(3, 40, 10, 2, IRON[0]);
  g.rect(5, 15, 5, 2, IRON[2]);
  // Curl arm and the cage lantern.
  g.line(8, 13, 8, 12, IRON[2]);
  g.rect(4, 10, 8, 2, IRON[2]);
  g.rect(5, 8, 6, 2, IRON[1]);
  g.rect(7, 6, 2, 2, IRON[2]);
  g.rect(4, 12, 8, 1, IRON[0]);
  const fill = state === 0 ? GLASS[0] : state === 1 ? LAMPY[1] : state === 2 ? LAMPY[2] : LAMPY[3];
  g.rect(5, 2, 6, 8, fill);
  g.rect(5, 2, 6, 8, state === 0 ? GLASS[0] : fill);
  if (state) { g.rect(6, 3, 4, 6, state === 3 ? LAMPY[3] : LAMPY[2]); g.rect(7, 4, 2, 3, LAMPY[3]); }
  else g.rect(5, 3, 1, 5, GLASS[1]);
  g.rect(4, 1, 8, 1, IRON[1]);
  g.rect(7, 0, 2, 1, IRON[2]);
  g.rect(4, 9, 8, 1, IRON[1]);
  g.rect(7, 2, 1, 8, IRON[1]);
  g.outline(OUT);
  return g.rows();
}

function tideBoard() {
  const g = new Grid(32, 40);
  post(g, 3, 6, 39, 3);
  post(g, 26, 6, 39, 3);
  g.rect(1, 38, 7, 2, WOOD[0]);
  g.rect(24, 38, 7, 2, WOOD[0]);
  box(g, 1, 4, 30, 22, WOOD);
  g.rect(3, 6, 26, 18, SLATE[0]);
  // Chalk table: rows of times and a wave line.
  for (let j = 0; j < 4; j++) {
    g.rect(4, 8 + j * 4, 24, 1, WHITE[1]);
    for (let i = 0; i < 6; i++) g.rect(5 + i * 4, 9 + j * 4, 2, 2, j === 3 && i > 3 ? null : WHITE[2]);
  }
  g.rect(4, 8, 1, 14, WHITE[1]);
  g.rect(16, 8, 1, 14, WHITE[1]);
  g.rect(8, 0, 16, 4, WOOD[2]);
  g.rect(8, 0, 16, 1, WOOD[3]);
  for (let i = 0; i < 4; i++) g.rect(10 + i * 4, 1, 2, 2, BLUE[2]);
  g.outline(OUT);
  return g.rows();
}

function buoy(hue) {
  const g = new Grid(16, 24);
  const c = hue === 'red' ? RED : YELLOW;
  g.oval(8, 14, 6, 7, c[0]);
  g.oval(8, 14, 5, 6, c[1]);
  g.oval(7, 12, 3, 4, c[2]);
  g.rect(3, 13, 11, 2, WHITE[1]);
  g.rect(2, 12, 1, 1, WHITE[1]);
  g.rect(5, 19, 6, 2, c[0]);
  g.rect(6, 5, 4, 3, IRON[2]);
  g.ring(8, 3, 2, IRON[2]);
  g.set(6, 11, WHITE[2]);
  g.rect(12, 14, 1, 5, c[0]);
  g.outline(OUT);
  return g.rows();
}
function buoyPile() {
  const g = new Grid(32, 26);
  const one = (cx, cy, c, r) => {
    g.oval(cx, cy, r, r, c[0]);
    g.oval(cx, cy, r - 1, r - 1, c[1]);
    g.oval(cx - 2, cy - 2, Math.max(1, Math.floor(r / 2)), Math.max(1, Math.floor(r / 2)), c[2]);
    g.rect(cx - r + 1, cy, r * 2 - 1, 2, WHITE[1]);
    g.rect(cx - 1, cy - r - 2, 3, 3, IRON[2]);
  };
  one(8, 18, RED, 7);
  one(23, 19, YELLOW, 6);
  one(16, 8, BLUE, 6);
  g.thick(4, 24, 28, 25, 1, ROPE[1]);
  g.outline(OUT);
  return g.rows();
}

function lobsterPots() {
  // Three wicker pots, two below and one on top, hooped with wood, each with a
  // dark funnel mouth; a rope runs from the top pot to a red float.
  const WICKER = ['#6a5030', '#a8844c', '#cfaa6a', '#e8cc90'];
  const g = new Grid(32, 30);
  const pot = (x, y, w, h) => {
    const r = Math.floor(h / 2);
    g.rect(x, y + r, w, h - r, WICKER[1]);
    g.oval(x + (w - 1) / 2, y + r, (w - 1) / 2, r, WICKER[1]);
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        if (!g.get(x + i, y + j)) continue;
        if ((i + j) % 4 === 0) g.set(x + i, y + j, WICKER[0]);
        else if ((i - j + 40) % 4 === 0) g.set(x + i, y + j, WICKER[2]);
      }
    }
    // Wooden hoops and the slatted base.
    g.rect(x + 1, y + r + 1, w - 2, 1, WOOD[1]);
    g.rect(x, y + h - 4, w, 1, WOOD[1]);
    g.rect(x, y + h - 2, w, 2, WOOD[0]);
    g.rect(x + 2, y + h - 2, 1, 2, WOOD[2]);
    g.rect(x + w - 4, y + h - 2, 1, 2, WOOD[2]);
    // The funnel mouth at the right end.
    g.oval(x + w - 5, y + r + 4, 3, 3, WOOD[1]);
    g.oval(x + w - 5, y + r + 4, 2, 2, '#0a0e12');
    g.set(x + w - 6, y + r + 3, WICKER[3]);
    // A lit edge down the left.
    g.rect(x, y + r, 1, h - r - 2, WICKER[3]);
  };
  pot(0, 14, 17, 15);
  pot(15, 15, 17, 14);
  pot(7, 1, 17, 14);
  // Rope off the top pot, down over the others to a float.
  g.thick(22, 4, 25, 7, 1, ROPE[2]);
  g.thick(25, 7, 27, 12, 1, ROPE[1]);
  g.oval(28, 14, 3, 3, RED[1]);
  g.oval(27, 13, 1, 1, RED[2]);
  g.rect(26, 14, 5, 1, WHITE[1]);
  g.rect(28, 10, 1, 2, IRON[2]);
  g.outline(OUT);
  return g.rows();
}

// Haddock's rock: a big weathered sea rock at the waterline, barnacled and
// hung with weed at the foot, with a flat worn top to sit on. 64 x 36; it is
// drawn flat (under everyone) over the four boulder tiles that make it solid.
function haddockRock() {
  const PINK = ['#4e343a', '#86605f', '#b48a82', '#d8b4a4'];
  const g = new Grid(64, 36);
  const h = (a, b) => {
    const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
  // The front face, a bulging wall of rock.
  g.poly([[0, 14], [63, 14], [63, 28], [60, 33], [44, 35], [20, 35], [4, 33], [0, 28]], PINK[1]);
  // The worn flat top, seen from a little above.
  g.poly([[4, 7], [11, 2], [30, 0], [50, 1], [59, 5], [63, 13], [62, 23], [1, 23], [0, 13]], PINK[2]);
  // The lip where top meets face.
  for (let x = 2; x < 62; x++) g.set(x, 23 + Math.round(h(x, 1) * 1), PINK[3]);
  // Face shading: darker towards the foot and the right, a wet band at the water.
  for (let y = 24; y < 35; y++) {
    for (let x = 0; x < 64; x++) {
      if (!g.get(x, y)) continue;
      const wet = y >= 30;
      const dark = x > 44 && y > 26;
      if (wet) g.set(x, y, (x + y) % 5 === 0 ? PINK[1] : PINK[0]);
      else if (dark || (x + y * 3) % 11 === 0) g.set(x, y, PINK[0]);
      else if (x < 14 && y < 28) g.set(x, y, PINK[2]);
    }
  }
  // Strata and cracks on the face; a few worn marks on top.
  g.line(8, 27, 22, 25, PINK[0]);
  g.line(30, 29, 41, 26, PINK[0]);
  g.line(48, 27, 56, 29, PINK[0]);
  g.line(26, 24, 24, 28, PINK[0]);
  g.line(14, 8, 24, 9, PINK[1]);
  g.line(36, 6, 49, 8, PINK[1]);
  g.line(12, 17, 20, 18, PINK[1]);
  g.line(40, 18, 54, 17, PINK[1]);
  g.rect(31, 12, 6, 1, PINK[3]);
  // A small tide-pool in the top, with a sky glint.
  g.oval(52, 13, 4, 2, GLASS[1]);
  g.rect(50, 12, 3, 1, GLASS[3]);
  // Barnacle clusters: pale rings with dark pits.
  const barn = (cx, cy, n) => {
    for (let i = 0; i < n; i++) {
      const bx = cx + Math.round((h(i, cx) - 0.5) * 9);
      const by = cy + Math.round((h(cy, i) - 0.5) * 4);
      g.oval(bx, by, 1, 1, WHITE[1]);
      g.set(bx, by, PINK[0]);
    }
  };
  barn(12, 31, 6);
  barn(33, 32, 7);
  barn(55, 30, 5);
  barn(24, 22, 3);
  // Weed hung at the foot and over the left corner.
  const weed = (x, top, len, sway) => {
    for (let i = 0; i < len; i++) {
      const wx = x + Math.round(Math.sin(i / 3 + sway) * 1.5);
      g.set(wx, top + i, i % 3 === 0 ? WEED[3] : WEED[2]);
      g.set(wx + 1, top + i, WEED[1]);
    }
  };
  weed(3, 20, 14, 0);
  weed(7, 26, 9, 1);
  weed(17, 29, 7, 2);
  weed(29, 30, 6, 0.5);
  weed(41, 29, 7, 1.5);
  weed(52, 27, 9, 2.5);
  weed(60, 22, 12, 0.7);
  // Wet shingle at the foot.
  for (let x = 4; x < 60; x += 2) g.set(x, 35, WATER[2]);
  g.outline(OUT);
  return g.rows();
}

// The cove's sea-cave mouth, in the cliff face: a dark arch of wet sandstone,
// white gull mess down the rock, a feather and a strand of weed at the foot.
// 32 x 30; it stands on the bottom of the cliff-face row.
function seaCave() {
  const ROCK = ['#4a3a2c', '#7c6648', '#a68c60', '#cfb882'];
  const g = new Grid(32, 30);
  g.poly([[0, 29], [1, 14], [5, 6], [11, 1], [21, 1], [27, 6], [31, 14], [31, 29]], ROCK[1]);
  g.poly([[0, 29], [1, 14], [5, 6], [11, 1], [14, 1], [8, 8], [5, 18], [5, 29]], ROCK[2]);
  for (let x = 5; x < 28; x += 2) g.set(x, 2 + (x % 3), ROCK[3]);
  // The mouth: dark inside, a lip of wet rock round it.
  g.poly([[6, 29], [6, 17], [9, 10], [14, 7], [19, 7], [23, 10], [26, 17], [26, 29]], ROCK[0]);
  g.poly([[8, 29], [8, 18], [10, 12], [14, 9], [18, 9], [22, 12], [24, 18], [24, 29]], '#0a0c10');
  g.poly([[11, 29], [11, 19], [13, 14], [16, 12], [19, 14], [21, 19], [21, 29]], '#040508');
  // Wet shine on the lip and the dark floor with a drip of water.
  for (let y = 12; y < 28; y += 3) g.set(7, y, GLASS[1]);
  g.rect(9, 28, 14, 1, WATER[0]);
  g.rect(12, 28, 8, 1, WATER[1]);
  // Cracks and dark wet streaks.
  g.line(28, 8, 26, 14, ROCK[0]);
  g.line(3, 20, 4, 27, ROCK[0]);
  g.line(26, 20, 28, 27, ROCK[0]);
  for (let y = 10; y < 29; y += 4) g.set(2, y, ROCK[0]);
  // Gull mess: white streaks down the rock above and beside the mouth.
  const mess = (x, y, len) => {
    for (let i = 0; i < len; i++) g.set(x + (i > 2 ? 1 : 0), y + i, WHITE[2]);
    g.set(x - 1, y + len - 1, WHITE[1]);
    g.set(x + 1, y, WHITE[1]);
  };
  mess(10, 4, 5);
  mess(22, 6, 7);
  mess(28, 15, 6);
  mess(3, 12, 4);
  // A ledge of rock with a splash of white on it.
  g.rect(24, 24, 6, 2, ROCK[2]);
  g.rect(25, 24, 3, 1, WHITE[2]);
  // Weed at the left foot.
  for (let i = 0; i < 8; i++) {
    g.set(2 + (i % 2), 28 - i, i % 3 === 0 ? WEED[3] : WEED[2]);
    g.set(3 + (i % 2), 28 - i, WEED[1]);
  }
  g.outline(OUT);
  // A white feather lying across the doorstep, drawn after the outline.
  g.line(13, 29, 21, 27, WHITE[2]);
  g.set(14, 28, WHITE[1]);
  g.set(16, 28, WHITE[1]);
  g.set(18, 27, WHITE[1]);
  g.set(20, 26, WHITE[2]);
  g.set(12, 29, WHITE[0]);
  return g.rows();
}

function netFrame() {
  const g = new Grid(32, 44);
  post(g, 2, 4, 43, 3);
  post(g, 27, 4, 43, 3);
  g.rect(0, 41, 9, 3, WOOD[0]);
  g.rect(23, 41, 9, 3, WOOD[0]);
  g.rect(1, 3, 30, 3, WOOD[2]);
  g.rect(1, 3, 30, 1, WOOD[3]);
  g.thick(5, 36, 2, 22, 1, WOOD[0]);
  // The net hangs in drooping folds, a mesh of dots.
  for (let y = 6; y < 36; y++) {
    const edge = Math.round(Math.sin((y - 6) / 29 * Math.PI) * 2);
    const x0 = 6 + (y > 28 ? Math.round((y - 28) / 2) : 0);
    const x1 = 26 - edge - (y > 28 ? Math.round((y - 28) / 2) : 0);
    for (let x = x0; x < x1; x++) if ((x + y) % 3 !== 0 && (x - y) % 4 !== 0) g.set(x, y, ROPE[(x + y) % 2 ? 1 : 0]);
  }
  for (let i = 0; i < 5; i++) g.rect(7 + i * 4, 6, 2, 2, i % 2 ? RED[1] : YELLOW[1]);
  g.rect(14, 33, 4, 2, WEED[1]);
  g.outline(OUT);
  return g.rows();
}

function anchor() {
  const g = new Grid(16, 24);
  g.rect(7, 4, 2, 15, RUST[1]);
  g.rect(7, 4, 1, 15, RUST[2]);
  g.ring(8, 3, 2, IRON[2]);
  g.rect(3, 6, 10, 2, RUST[1]);
  g.rect(3, 6, 10, 1, RUST[2]);
  g.rect(2, 5, 2, 4, IRON[1]);
  g.rect(12, 5, 2, 4, IRON[1]);
  // Flukes: a curved bar and two points.
  for (let i = -6; i <= 6; i++) g.set(8 + i, 18 - Math.round((i * i) / 12), RUST[1]);
  for (let i = -6; i <= 6; i++) g.set(8 + i, 19 - Math.round((i * i) / 12), RUST[0]);
  g.poly([[1, 13], [4, 17], [2, 18], [0, 15]], RUST[2]);
  g.poly([[15, 13], [12, 17], [14, 18], [16, 15]], RUST[2]);
  g.rect(6, 19, 4, 2, RUST[0]);
  g.outline(OUT);
  return g.rows();
}
function ropeCoil() {
  const g = new Grid(16, 12);
  for (let k = 0; k < 3; k++) {
    g.oval(8, 8 - k * 2, 7 - k, 3 - (k > 1 ? 1 : 0), ROPE[1 - (k % 2) * 1]);
    g.oval(8, 7 - k * 2, 5 - k, 2 - (k > 1 ? 1 : 0), ROPE[2]);
  }
  g.oval(8, 5, 2, 1, ROPE[0]);
  for (let i = 0; i < 12; i++) g.set(2 + i, 10 + (i % 2), ROPE[0]);
  g.outline(OUT);
  return g.rows();
}
function crate() {
  const g = new Grid(16, 17);
  box(g, 1, 1, 14, 15, WOOD);
  g.rect(2, 2, 12, 13, WOOD[1]);
  g.rect(1, 5, 14, 1, WOOD[0]);
  g.rect(1, 10, 14, 1, WOOD[0]);
  g.thick(3, 3, 12, 14, 1, WOOD[0]);
  g.thick(12, 3, 3, 14, 1, WOOD[2]);
  for (const [x, y] of [[2, 2], [13, 2], [2, 14], [13, 14]]) g.set(x, y, IRON[3]);
  g.outline(OUT);
  return g.rows();
}
function cratesStack() {
  const g = new Grid(20, 33);
  g.paste({ w: 16, h: 17, cells: unpack(crate()) }, 2, 16);
  g.paste({ w: 16, h: 17, cells: unpack(crate()) }, 3, 1);
  return g.rows();
}
// Turns rows back into a grid of hex colours (to stack finished sprites).
function unpack(rows) {
  return rows.map((r) => [...r].map((c) => (c === '.' ? null : palette[c])));
}
function barrel() {
  const g = new Grid(16, 22);
  for (let y = 1; y < 21; y++) {
    const bulge = Math.round(Math.sin(((y - 1) / 19) * Math.PI) * 1.5);
    g.rect(2 - bulge, y, 12 + bulge * 2, 1, WOOD[1]);
    g.set(2 - bulge, y, WOOD[2]);
    g.set(13 + bulge, y, WOOD[0]);
  }
  for (let x = 4; x < 14; x += 4) for (let y = 3; y < 20; y++) g.set(x, y, WOOD[0]);
  g.rect(1, 4, 14, 2, IRON[1]);
  g.rect(1, 15, 14, 2, IRON[1]);
  g.rect(1, 4, 14, 1, IRON[2]);
  g.rect(1, 15, 14, 1, IRON[2]);
  g.oval(8, 2, 5, 1, WOOD[2]);
  g.outline(OUT);
  return g.rows();
}
function barrels() {
  const g = new Grid(32, 24);
  g.paste({ w: 16, h: 22, cells: unpack(barrel()) }, 0, 2);
  g.paste({ w: 16, h: 22, cells: unpack(barrel()) }, 15, 2);
  g.rect(8, 0, 16, 2, WOOD[2]);
  g.outline(OUT);
  return g.rows();
}

// ===================== THE STORM SHORE (wrack) =====================
function tideClock(step) {
  const g = new Grid(32, 60);
  post(g, 14, 30, 59, 4, WOOD);
  g.rect(10, 56, 12, 4, STONE[1]);
  g.rect(9, 58, 14, 2, STONE[0]);
  g.thick(15, 52, 8, 44, 2, WOOD[1]);
  g.thick(17, 52, 24, 44, 2, WOOD[1]);
  // The dial: brass rim, pale face, twelve ticks, H at the top, L at the bottom.
  g.oval(16, 17, 15, 15, BRASS[0]);
  g.oval(16, 17, 14, 14, BRASS[2]);
  g.oval(16, 17, 12, 12, WHITE[1]);
  g.oval(15, 16, 10, 10, WHITE[2]);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * 6.2832;
    g.line(16 + Math.sin(a) * 9, 17 - Math.cos(a) * 9, 16 + Math.sin(a) * 11, 17 - Math.cos(a) * 11, IRON[1]);
  }
  paint(g, 'H', 14, 7, BLUE[0]);
  paint(g, 'L', 14, 22, BLUE[0]);
  // Tide hand: sweeps through four positions; a green weed-strand clings to the rim.
  const a = (step / 4) * 6.2832 + 0.4;
  g.thick(16, 17, 16 + Math.sin(a) * 8, 17 - Math.cos(a) * 8, 1, RED[1]);
  g.thick(16, 17, 16 - Math.sin(a) * 3, 17 + Math.cos(a) * 3, 1, RED[0]);
  g.rect(15, 16, 3, 3, BRASS[2]);
  g.rect(16, 17, 1, 1, IRON[0]);
  for (let i = 0; i < 6; i++) g.set(5 + i, 27 + (i % 2), WEED[2]);
  g.outline(OUT);
  return g.rows();
}
function seaweedHeap(big) {
  const w = big ? 32 : 16;
  const h = big ? 16 : 10;
  const g = new Grid(w, h);
  g.oval(w / 2, h - 3, w / 2 - 1, h / 2 - 1, WEED[0]);
  g.oval(w / 2 - 1, h - 4, w / 2 - 3, h / 2 - 2, WEED[1]);
  for (let i = 0; i < w / 2; i++) {
    const x = 2 + ri(w - 4);
    const y = 2 + ri(h - 4);
    g.line(x, y, x + ri(5) - 2, y + 2, i % 3 ? WEED[2] : WEED[3]);
  }
  for (let i = 0; i < 4; i++) g.set(3 + ri(w - 6), h - 3 - ri(3), BRASS[2]);
  g.outline(OUT);
  return g.rows();
}
function bathtubWreck() {
  const g = new Grid(32, 24);
  // A clawfoot tub half-buried, tipped, enamel chipped to rust.
  g.poly([[2, 8], [30, 6], [29, 18], [4, 20]], WHITE[1]);
  g.poly([[3, 9], [29, 7], [29, 11], [4, 13]], WHITE[2]);
  g.poly([[5, 9], [28, 8], [28, 11], [6, 12]], IRON[1]);
  g.rect(4, 17, 25, 2, WHITE[0]);
  for (let i = 0; i < 9; i++) g.set(5 + ri(23), 13 + ri(6), RUST[1 + ri(2)]);
  g.rect(24, 14, 4, 3, RUST[2]);
  g.rect(3, 18, 4, 5, BRASS[1]);
  g.rect(24, 18, 4, 5, BRASS[1]);
  g.rect(3, 18, 4, 1, BRASS[3]);
  g.rect(28, 3, 2, 6, BRASS[1]);
  g.rect(26, 2, 4, 2, BRASS[2]);
  g.oval(15, 21, 12, 2, SAND[1]);
  weedTuft(g, 20, 22, 3, 4);
  g.outline(OUT);
  return g.rows();
}
function driftwood() {
  const g = new Grid(32, 14);
  g.thick(2, 10, 29, 8, 3, DRIFT[1]);
  g.thick(2, 9, 29, 7, 1, DRIFT[2]);
  g.thick(3, 11, 28, 10, 1, DRIFT[0]);
  g.thick(10, 8, 14, 2, 1, DRIFT[1]);
  g.thick(20, 8, 24, 3, 1, DRIFT[1]);
  g.thick(24, 3, 26, 1, 1, DRIFT[2]);
  for (let i = 0; i < 6; i++) g.set(4 + ri(24), 8 + ri(3), DRIFT[3]);
  g.oval(4, 10, 2, 2, DRIFT[0]);
  g.outline(OUT);
  return g.rows();
}
function driftwoodTall() {
  const g = new Grid(16, 30);
  g.poly([[5, 29], [6, 8], [8, 2], [11, 9], [12, 29]], DRIFT[1]);
  g.poly([[6, 28], [6, 10], [8, 4], [8, 28]], DRIFT[2]);
  g.thick(11, 14, 15, 8, 2, DRIFT[1]);
  g.thick(6, 18, 2, 12, 1, DRIFT[1]);
  g.rect(3, 28, 11, 2, SAND[1]);
  for (let i = 0; i < 4; i++) g.set(7 + ri(4), 8 + ri(18), DRIFT[0]);
  g.outline(OUT);
  return g.rows();
}

// ===================== SALTCOMBE =====================
function stiltHouse(small) {
  const w = small ? 48 : 64;
  const g = new Grid(w, small ? 68 : 84);
  const base = g.h;
  const bodyTop = small ? 26 : 30;
  const bodyH = small ? 22 : 26;
  const floorY = bodyTop + bodyH;
  // Stilts with cross braces, barnacle bands and weed.
  const legs = small ? [4, 20, 40] : [4, 20, 38, 56];
  for (const lx of legs) {
    post(g, lx, floorY, base - 1, 4, WOOD);
    g.rect(lx, base - 18, 4, 2, STONE[2]);
    g.rect(lx, base - 17, 4, 1, WHITE[1]);
  }
  for (let i = 0; i + 1 < legs.length; i++) {
    g.thick(legs[i] + 2, floorY + 4, legs[i + 1] + 2, base - 20, 1, WOOD[0]);
    g.thick(legs[i + 1] + 2, floorY + 4, legs[i] + 2, base - 20, 1, WOOD[0]);
  }
  weedTuft(g, legs[1] + 2, base - 1, 2, 8);
  // The deck, the house, the roof.
  g.rect(0, floorY, w, 3, WOOD[2]);
  g.rect(0, floorY + 3, w, 2, WOOD[0]);
  planks(g, 3, bodyTop, w - 6, bodyH, WOOD, 4);
  g.rect(3, bodyTop, w - 6, bodyH, null);
  planks(g, 3, bodyTop, w - 6, bodyH, ['#2c3a3a', '#46605c', '#648480'], 4);
  const roofTop = bodyTop - (small ? 16 : 20);
  g.poly([[0, bodyTop + 1], [w / 2, roofTop], [w, bodyTop + 1]], SLATE[1]);
  g.poly([[3, bodyTop], [w / 2, roofTop + 3], [w - 3, bodyTop]], SLATE[2]);
  for (let r = roofTop + 6; r < bodyTop; r += 4) g.line(Math.round(w / 2 - (r - roofTop) * 1.5), r, Math.round(w / 2 + (r - roofTop) * 1.5), r, SLATE[0]);
  g.rect(w - 14, roofTop + 2, 5, 9, STONE[1]);
  g.rect(w - 15, roofTop + 1, 7, 2, STONE[2]);
  // Warm windows and a door with a lamp on a bracket.
  const win = (x, y) => {
    g.rect(x, y, 8, 8, LAMPY[1]);
    g.rect(x + 1, y + 1, 6, 6, LAMPY[2]);
    g.rect(x + 3, y + 2, 2, 3, LAMPY[3]);
    g.rect(x + 3, y, 1, 8, WOOD[0]);
    g.rect(x, y + 3, 8, 1, WOOD[0]);
    g.rect(x - 1, y + 8, 10, 1, WOOD[3]);
  };
  win(small ? 7 : 9, bodyTop + 6);
  if (!small) win(w - 22, bodyTop + 6);
  const dx = small ? 28 : w / 2 - 4;
  g.rect(dx, bodyTop + 6, 8, bodyH - 6, WOOD[0]);
  g.rect(dx + 1, bodyTop + 7, 6, bodyH - 7, WOOD[1]);
  g.set(dx + 6, bodyTop + 16, BRASS[3]);
  g.rect(dx - 2, floorY - 1, 12, 1, WOOD[3]);
  g.rect(dx + 9, bodyTop + 3, 1, 5, IRON[1]);
  g.rect(dx + 10, bodyTop + 3, 3, 4, LAMPY[2]);
  g.rect(dx + 9, bodyTop + 2, 5, 1, IRON[1]);
  g.outline(OUT);
  return g.rows();
}
function hangingNets() {
  const g = new Grid(32, 48);
  // A leaning pole with a brace and a spar; nets hung over the spar.
  g.thick(6, 47, 9, 4, 3, WOOD[1]);
  g.thick(5, 47, 8, 4, 1, WOOD[2]);
  g.rect(3, 44, 8, 4, STONE[1]);
  g.thick(18, 47, 10, 22, 1, WOOD[0]);
  g.rect(2, 6, 28, 3, WOOD[2]);
  g.rect(2, 6, 28, 1, WOOD[3]);
  for (let x = 4; x < 30; x++) {
    const len = 14 + Math.round(Math.sin(x * 0.6) * 3) + (x > 20 ? -6 : 0);
    for (let y = 9; y < 9 + len; y++) if ((x + y) % 3 !== 0 && (x * 2 - y) % 5 !== 0) g.set(x, y, ROPE[(x + y) % 2 ? 1 : 0]);
  }
  for (let i = 0; i < 4; i++) { g.rect(5 + i * 6, 9 + 15 - (i > 2 ? 6 : 0), 2, 3, i % 2 ? RED[1] : WHITE[2]); }
  g.outline(OUT);
  return g.rows();
}
function shopSign(kind) {
  const g = new Grid(16, 44);
  post(g, 1, 3, 43, 3);
  g.rect(0, 42, 6, 2, WOOD[0]);
  g.rect(1, 2, 14, 2, IRON[2]);
  g.rect(13, 4, 2, 2, IRON[1]);
  g.line(5, 4, 5, 6, IRON[1]);
  g.line(12, 4, 12, 7, IRON[1]);
  g.rect(3, 7, 12, 12, WOOD[2]);
  g.rect(3, 7, 12, 1, WOOD[3]);
  g.rect(3, 18, 12, 1, WOOD[0]);
  g.rect(4, 8, 10, 10, kind === 'fish' ? BLUE[1] : kind === 'rope' ? SAND[1] : RED[0]);
  if (kind === 'fish') {
    g.oval(8, 13, 4, 2, WHITE[2]);
    g.poly([[11, 13], [14, 10], [14, 16]], WHITE[2]);
    g.set(6, 12, IRON[0]);
  } else if (kind === 'rope') {
    g.ring(9, 13, 3, ROPE[0]);
    g.ring(9, 13, 2, ROPE[1]);
    g.rect(8, 8, 2, 3, ROPE[0]);
  } else {
    g.rect(6, 10, 6, 6, YELLOW[1]);
    g.rect(12, 11, 2, 4, YELLOW[0]);
    g.rect(6, 10, 6, 2, WHITE[2]);
  }
  g.outline(OUT);
  return g.rows();
}
function marketStall() {
  const g = new Grid(48, 46);
  post(g, 2, 8, 45, 3);
  post(g, 43, 8, 45, 3);
  // Striped awning, red and white, scalloped.
  for (let x = 0; x < 48; x++) {
    const c = Math.floor(x / 4) % 2 ? WHITE[2] : RED[1];
    g.rect(x, 4 + Math.round(x / 24 * 0), 1, 8, c);
    g.rect(x, 12, 1, Math.floor(x / 4) % 2 ? 2 : 3, c);
  }
  g.rect(0, 3, 48, 1, WOOD[3]);
  g.rect(0, 4, 48, 1, RED[2]);
  // Counter with crates of fish and a hanging scale.
  box(g, 3, 28, 42, 16, WOOD);
  planks(g, 4, 29, 40, 14, WOOD, 4);
  g.rect(3, 27, 42, 2, WOOD[3]);
  for (let i = 0; i < 4; i++) {
    const x = 6 + i * 9;
    g.oval(x + 3, 25, 4, 2, [BLUE[2], WHITE[1], GREEN[2], YELLOW[1]][i]);
    g.poly([[x + 7, 25], [x + 9, 23], [x + 9, 27]], [BLUE[1], WHITE[0], GREEN[1], YELLOW[0]][i]);
    g.set(x + 1, 24, IRON[0]);
  }
  g.line(24, 12, 24, 17, IRON[1]);
  g.rect(20, 17, 8, 1, BRASS[2]);
  g.rect(20, 18, 2, 2, BRASS[1]);
  g.rect(26, 18, 2, 2, BRASS[1]);
  // A lantern on the left pole.
  g.rect(5, 14, 1, 3, IRON[1]);
  g.rect(5, 17, 4, 5, LAMPY[2]);
  g.rect(5, 17, 4, 1, IRON[1]);
  g.rect(5, 21, 4, 1, IRON[1]);
  g.outline(OUT);
  return g.rows();
}
function lamplighterLadder(lit) {
  const g = new Grid(20, 54);
  // Lamp post with a lantern on top and a ladder leaning on it.
  post(g, 11, 12, 53, 3, IRON);
  g.rect(9, 50, 7, 4, IRON[1]);
  g.rect(8, 52, 9, 2, IRON[0]);
  g.rect(9, 8, 7, 5, IRON[2]);
  g.rect(10, 3, 5, 6, lit ? LAMPY[2] : GLASS[0]);
  if (lit) g.rect(11, 4, 3, 3, LAMPY[3]);
  g.rect(9, 2, 7, 1, IRON[1]);
  g.rect(11, 0, 3, 2, IRON[2]);
  // Ladder.
  g.thick(1, 53, 9, 12, 1, WOOD[2]);
  g.thick(4, 53, 12, 12, 1, WOOD[1]);
  for (let i = 0; i < 8; i++) {
    const y = 49 - i * 5;
    const t = (53 - y) / 41;
    g.rect(Math.round(1 + t * 8), y, Math.round(3 + t * 3), 1, WOOD[3]);
  }
  g.outline(OUT);
  return g.rows();
}
function harbourBell(swing, empty = false) {
  const g = new Grid(32, 46);
  // A-frame of heavy timber, the bell hanging from the crossbeam.
  g.thick(4, 45, 15, 6, 3, WOOD[1]);
  g.thick(28, 45, 17, 6, 3, WOOD[1]);
  g.thick(3, 45, 14, 6, 1, WOOD[2]);
  g.rect(10, 4, 12, 3, WOOD[2]);
  g.rect(10, 4, 12, 1, WOOD[3]);
  g.rect(0, 43, 9, 3, WOOD[0]);
  g.rect(23, 43, 9, 3, WOOD[0]);
  g.rect(12, 18, 8, 2, WOOD[0]);
  if (empty) {
    // Nothing hung yet: an iron bracket under the crossbeam, waiting for a bell.
    g.rect(15, 7, 2, 4, IRON[1]);
    g.rect(13, 10, 6, 1, IRON[1]);
    g.outline(OUT);
    return g.rows();
  }
  const sx = swing;
  g.line(16, 7, 16 + sx, 14, IRON[1]);
  // The bell, mouth down.
  const bx = 16 + sx;
  g.poly([[bx - 2, 13], [bx + 2, 13], [bx + 6, 26], [bx + 7, 28], [bx - 7, 28], [bx - 6, 26]], BRASS[1]);
  g.poly([[bx - 2, 14], [bx, 14], [bx - 1, 26], [bx - 5, 27]], BRASS[3]);
  g.rect(bx - 7, 27, 15, 2, BRASS[0]);
  g.rect(bx - 1, 29, 3, 3, IRON[1]);
  // A pull rope with a knot.
  g.line(bx + 2, 29, bx + 4 + sx, 40, ROPE[1]);
  g.rect(bx + 3 + sx, 40, 3, 3, ROPE[2]);
  g.outline(OUT);
  return g.rows();
}

// ===================== THE SUNKEN LANES =====================
function waterBand(g, y, x0, x1, f = 0) {
  for (let x = x0; x < x1; x++) {
    const wob = Math.round(Math.sin((x + f * 3) * 0.7) * 0.7);
    g.rect(x, y + wob, 1, g.h - y - wob, WATER[1]);
    g.set(x, y + wob, WATER[3]);
    if ((x + f * 2) % 7 === 0) g.set(x, y + wob + 2, WATER[2]);
  }
}
function halfSunkCottage() {
  const g = new Grid(64, 62);
  planks(g, 6, 20, 52, 42, ['#2e2c28', '#4c4a40', '#6c6858'], 4);
  g.poly([[0, 22], [32, 2], [64, 22]], SLATE[1]);
  g.poly([[4, 22], [32, 6], [60, 22]], SLATE[2]);
  for (let r = 10; r < 22; r += 4) g.line(Math.round(32 - (r - 4) * 1.6), r, Math.round(32 + (r - 4) * 1.6), r, SLATE[0]);
  g.rect(44, 4, 6, 12, STONE[1]);
  g.rect(43, 3, 8, 2, STONE[2]);
  // A sag in the ridge: a few slates gone.
  g.rect(26, 8, 5, 3, '#2a3844');
  g.rect(10, 30, 9, 9, GLASS[0]);
  g.rect(14, 30, 1, 9, WOOD[0]);
  g.rect(10, 34, 9, 1, WOOD[0]);
  g.rect(38, 30, 9, 9, GLASS[0]);
  g.rect(42, 30, 1, 9, WOOD[0]);
  g.rect(24, 36, 10, 26, WOOD[0]);
  g.rect(25, 37, 8, 25, WOOD[1]);
  // The flood: water to the windowsills at the front.
  waterBand(g, 44, 0, 64);
  g.rect(0, 52, 64, 10, WATER[0]);
  for (let x = 1; x < 63; x += 5) g.rect(x, 54 + (x % 3), 3, 1, WATER[1]);
  weedTuft(g, 12, 47, 3, 5);
  weedTuft(g, 50, 47, 3, 5);
  g.outline(OUT);
  return g.rows();
}
function churchWall() {
  const g = new Grid(64, 58);
  stoneWall(g, 0, 20, 64, 38, STONE);
  // Ragged top edge.
  for (let x = 0; x < 64; x++) {
    const top = 12 + Math.round(Math.abs(Math.sin(x * 0.31)) * 8 + Math.abs(Math.sin(x * 0.9)) * 3);
    g.rect(x, top, 1, 20 - top + 4, STONE[1]);
    g.set(x, top, STONE[3]);
  }
  stoneWall(g, 0, 22, 64, 36, STONE);
  // A tall pointed window with a few leaded pieces of coloured glass left.
  g.rect(24, 22, 16, 30, GLASS[0]);
  g.poly([[24, 24], [32, 8], [40, 24]], GLASS[0]);
  for (const [x, y, c] of [[26, 28, RED[1]], [34, 30, BLUE[1]], [29, 40, YELLOW[1]], [36, 42, GREEN[1]], [31, 20, BLUE[2]]]) g.rect(x, y, 3, 4, c);
  g.rect(31, 12, 2, 40, STONE[3]);
  g.rect(24, 36, 16, 1, STONE[3]);
  g.rect(22, 52, 20, 3, STONE[3]);
  // Buttress and weed.
  g.rect(52, 24, 10, 34, STONE[2]);
  g.rect(52, 24, 1, 34, STONE[3]);
  weedTuft(g, 10, 57, 4, 6);
  weedTuft(g, 48, 57, 3, 5);
  g.rect(0, 54, 64, 4, WATER[1]);
  for (let x = 0; x < 64; x += 4) g.set(x, 54, WATER[3]);
  g.outline(OUT);
  return g.rows();
}
function wheelSpokes(g, cx, cy, r, spokes, angle, ramp, thick = 1) {
  for (let i = 0; i < spokes; i++) {
    const a = angle + (i / spokes) * 6.2832;
    g.thick(cx, cy, cx + Math.cos(a) * r, cy + Math.sin(a) * r, thick, ramp[1]);
  }
}
function sluiceWheel(step) {
  const g = new Grid(20, 28);
  // A stand like a short stout post with a rim wheel on top and a spindle.
  g.rect(8, 10, 4, 18, IRON[1]);
  g.rect(8, 10, 1, 18, IRON[2]);
  g.rect(4, 25, 12, 3, STONE[1]);
  g.rect(4, 25, 12, 1, STONE[2]);
  const a = (step / 4) * (6.2832 / 6);
  g.ring(10, 8, 7, IRON[1]);
  g.ring(10, 8, 6, IRON[2]);
  wheelSpokes(g, 10, 8, 7, 6, a, IRON, 1);
  for (let i = 0; i < 6; i++) { const ang = a + (i / 6) * 6.2832; g.rect(10 + Math.cos(ang) * 8 - 1, 8 + Math.sin(ang) * 8 - 1, 2, 2, RUST[1]); }
  g.rect(9, 7, 3, 3, BRASS[2]);
  g.outline(OUT);
  return g.rows();
}
function millWheel(step) {
  const g = new Grid(52, 50);
  const cx = 26;
  const cy = 22;
  const a = (step / 4) * (6.2832 / 12);
  // Supports on either side.
  g.rect(0, 14, 5, 36, STONE[1]);
  g.rect(47, 14, 5, 36, STONE[1]);
  g.rect(0, 14, 5, 2, STONE[3]);
  g.rect(47, 14, 5, 2, STONE[3]);
  g.rect(4, 20, 8, 3, WOOD[0]);
  g.rect(40, 20, 8, 3, WOOD[0]);
  g.ring(cx, cy, 19, WOOD[1]);
  g.ring(cx, cy, 18, WOOD[2]);
  g.ring(cx, cy, 14, WOOD[0]);
  wheelSpokes(g, cx, cy, 19, 12, a, WOOD, 2);
  for (let i = 0; i < 12; i++) {
    const ang = a + (i / 12) * 6.2832;
    g.thick(cx + Math.cos(ang) * 18, cy + Math.sin(ang) * 18, cx + Math.cos(ang + 0.12) * 22, cy + Math.sin(ang + 0.12) * 22, 3, WOOD[2]);
  }
  g.oval(cx, cy, 3, 3, IRON[2]);
  g.rect(cx - 1, cy - 1, 2, 2, IRON[0]);
  // Flood water lapping the lower third.
  for (let x = 0; x < 52; x++) {
    const y = 38 + Math.round(Math.sin((x + step * 3) * 0.5) * 0.8);
    g.rect(x, y, 1, 50 - y, WATER[1]);
    g.set(x, y, WATER[3]);
  }
  g.outline(OUT);
  return g.rows();
}
function drownedSignpost() {
  const g = new Grid(16, 40);
  g.thick(7, 39, 8, 2, 3, WOOD[1]);
  g.thick(6, 39, 7, 2, 1, WOOD[2]);
  g.poly([[1, 6], [11, 5], [14, 8], [11, 11], [1, 12]], WOOD[2]);
  g.poly([[2, 8], [10, 7], [12, 8], [10, 9], [2, 10]], WOOD[3]);
  g.poly([[3, 16], [12, 15], [12, 20], [3, 21], [0, 18]], WOOD[1]);
  g.rect(4, 17, 6, 1, WHITE[1]);
  g.rect(4, 19, 4, 1, WHITE[1]);
  // The lower arm points into the water; waterline over the foot.
  g.poly([[2, 26], [6, 25], [13, 30], [11, 33], [3, 29]], WOOD[0]);
  for (let x = 0; x < 16; x++) {
    g.rect(x, 31 + (x % 3 === 0 ? 0 : 1), 1, 9, WATER[1]);
    g.set(x, 31 + (x % 3 === 0 ? 0 : 1), WATER[3]);
  }
  weedTuft(g, 12, 36, 2, 5);
  g.outline(OUT);
  return g.rows();
}

// ===================== THE WRECK YARD =====================
function snappedMast() {
  const g = new Grid(28, 118);
  // A lone ship's mast stood up out of a wreck: a thick round trunk of wet
  // timber with iron hoops, snapped off near the top like a broken pencil
  // (pale splinters in the break), the lower yard hanging askew in its sling
  // with a rag of sail, a couple of slack shrouds swinging loose, and its foot
  // in a broken collar of deck, weed and barnacles.
  const cx = 14;
  // A slack shroud first (behind the trunk): from the hounds down to the
  // left, sagging, its end hanging loose.
  for (let y = 26; y < 92; y++) {
    const t = (y - 26) / 66;
    const x = Math.round(cx - 4 - t * 9 + Math.sin(t * 3.1416) * 3);
    g.set(x, y, ROPE[1]);
    if (y % 9 === 0) g.set(x + 1, y, ROPE[0]);
  }
  // The trunk, round: light down the left, shadow down the right, a touch
  // thicker below the yard.
  const half = (y) => (y > 60 ? 5 : 4);
  for (let y = 14; y < 112; y++) {
    const h = half(y);
    for (let x = cx - h; x < cx + h; x++) {
      const i = x - (cx - h);
      g.set(x, y, i === 0 ? WOOD[1] : i === 1 || i === 2 ? WOOD[3] : i >= h * 2 - 2 ? WOOD[0] : WOOD[2]);
    }
    if (y % 11 === 3) g.set(cx - 1, y, WOOD[1]);
    if (y % 13 === 7) g.set(cx + 1, y, WOOD[1]);
  }
  // The break: two ragged prongs, the left one taller, raw pale wood inside.
  const tops = [6, 3, 5, 9, 13, 15, 11, 8];
  for (let i = 0; i < 8; i++) for (let y = tops[i]; y < 16; y++) {
    const x = cx - 4 + i;
    g.set(x, y, i === 0 ? WOOD[1] : i < 3 ? WOOD[3] : i >= 6 ? WOOD[0] : WOOD[2]);
  }
  g.set(cx - 3, 2, WOOD[3]); g.set(cx - 2, 1, WOOD[3]); g.set(cx + 3, 7, WOOD[2]); g.set(cx + 4, 6, WOOD[1]);
  for (const [x, y] of [[cx, 13], [cx + 1, 14], [cx - 1, 9], [cx + 2, 16], [cx, 16]]) g.set(x, y, '#c8b088');
  g.set(cx - 1, 10, '#e0cca4'); g.set(cx + 1, 15, '#e0cca4');
  // The hounds: a wooden cheek block either side, where the shrouds were.
  g.rect(cx - 6, 24, 3, 5, WOOD[1]); g.rect(cx - 6, 24, 1, 5, WOOD[2]);
  g.rect(cx + 4, 24, 3, 5, WOOD[0]); g.set(cx + 5, 24, WOOD[2]);
  // Iron hoops round the trunk.
  for (const y of [20, 34, 70, 92]) {
    const h = half(y) + 1;
    g.rect(cx - h, y, h * 2, 2, IRON[1]);
    g.rect(cx - h, y, h * 2, 1, IRON[2]);
    g.set(cx - h + 1, y, IRON[3]);
    g.set(cx + 1, y + 1, RUST[1]);
    g.set(cx + 2, y + 2, RUST[2]);
  }
  // The yard, hanging askew in its sling: one arm cocked up to the left, the
  // other dropped to the right, with a rag of sail torn along the bottom.
  g.rect(cx - 2, 44, 4, 2, IRON[1]);
  g.thick(1, 41, cx, 46, 2, WOOD[2]);
  g.line(1, 40, cx, 45, WOOD[3]);
  g.thick(cx, 46, 26, 57, 2, WOOD[1]);
  g.line(cx, 48, 26, 59, WOOD[0]);
  g.poly([[3, 43], [cx - 2, 47], [cx - 3, 64], [cx - 6, 58], [cx - 8, 66], [4, 56]], SAIL[1]);
  g.poly([[4, 45], [8, 46], [8, 58], [5, 54]], SAIL[2]);
  g.line(cx - 3, 50, cx - 3, 60, SAIL[0]);
  // A brace still hanging off the yard's low end, swinging free.
  for (let y = 58; y < 80; y++) g.set(25 + Math.round(Math.sin((y - 58) / 7) * 1.2), y, ROPE[1]);
  g.rect(24, 80, 3, 2, ROPE[2]);
  // A second shroud, still taut, down to the right, with its deadeye.
  g.line(cx + 6, 28, 25, 108, ROPE[1]);
  g.line(cx + 7, 28, 26, 108, ROPE[0]);
  g.rect(24, 107, 3, 3, WOOD[0]); g.set(25, 108, WOOD[3]);
  // Barnacles and weed creeping up the lower trunk.
  for (const [x, y] of [[cx - 4, 100], [cx - 2, 104], [cx + 3, 98], [cx - 3, 96], [cx + 2, 106], [cx - 1, 101]]) g.set(x, y, '#c8ccc0');
  for (let y = 98; y < 112; y++) if (y % 3 !== 0) g.set(cx - 5 + (y % 2), y, WEED[2]);
  g.rect(cx + 3, 104, 2, 7, WEED[1]);
  g.set(cx + 4, 103, WEED[2]);
  // The foot: a broken collar of deck planks it's wedged into, and weed.
  g.rect(5, 110, 18, 4, WOOD[1]);
  g.rect(5, 110, 18, 1, WOOD[2]);
  g.rect(5, 113, 18, 1, WOOD[0]);
  g.rect(3, 112, 3, 2, WOOD[2]); g.rect(22, 111, 3, 3, WOOD[1]);
  g.set(9, 110, WOOD[0]); g.set(19, 110, WOOD[0]);
  g.rect(2, 114, 24, 3, WEED[1]);
  for (const x of [3, 7, 12, 17, 21, 24]) g.set(x, 114, WEED[2]);
  g.set(6, 116, WEED[3]); g.set(19, 115, WEED[3]);
  g.outline(OUT);
  return g.rows();
}
function starShard(step) {
  const g = new Grid(10, 10);
  const r = [1, 3, 2, 4][step];
  g.set(5, 5, '#ffffff');
  g.rect(4, 4, 2, 2, '#fff4b8');
  for (let i = 1; i <= r; i++) {
    const c = i > 2 ? '#ffe27a' : '#fff4b8';
    g.set(5, 5 - i, c); g.set(4, 5 + i, c); g.set(5 + i, 5, c); g.set(4 - i, 4, c);
    g.set(4, 4 - i, c); g.set(5, 5 + i, c); g.set(5 + i, 4, c); g.set(4 - i, 5, c);
  }
  if (step === 3) { g.set(2, 2, '#fff4b8'); g.set(7, 2, '#fff4b8'); g.set(2, 7, '#fff4b8'); g.set(7, 7, '#fff4b8'); }
  return g.rows();
}
function hull(g, x0, base, w, h, lean, tones, seed2, bowLeft = true) {
  // Side view hull: planked, leaning by `lean` pixels at the top, ragged top
  // edge that dips from the bow to the stern, and a curved keel.
  const jag = (x) => Math.round(Math.abs(Math.sin(x * 0.45 + seed2)) * 5 + Math.abs(Math.sin(x * 1.3)) * 2);
  const inside = (x, y) => {
    const t = y / (h - 1);
    const shear = Math.round(lean * (1 - t));
    const u = Math.max(0, t - 0.5) / 0.5;
    const bowIn = Math.round(u * u * 12);
    const sternIn = Math.round(u * u * 5);
    const l = x0 + shear + (bowLeft ? bowIn : sternIn);
    const r = x0 + shear + w - (bowLeft ? sternIn : bowIn);
    if (x < l || x >= r) return false;
    const along = (x - x0) / w;
    const sheer = Math.round((bowLeft ? along : 1 - along) * 24);
    return y >= jag(x - x0) + sheer || y >= h - 14;
  };
  for (let y = 0; y < h; y++) {
    for (let x = x0 - 14; x < x0 + w + 14; x++) {
      if (!inside(x, y)) continue;
      let c = tones[1];
      if (y % 5 === 4 || (x * 7 + y * 3) % 23 === 0) c = tones[0];
      else if (y % 5 === 0) c = tones[2];
      g.set(x, base - h + y, c);
    }
  }
}
function hullLeanA() {
  const g = new Grid(68, 76);
  hull(g, 6, 76, 56, 70, 8, ['#1e2428', '#38444a', '#506068'], 1.3, true);
  // A rail along the top of what is left, portholes, barnacles, a split.
  for (const [x, y] of [[22, 36], [34, 40], [46, 44]]) { g.oval(x, y, 3, 3, BRASS[1]); g.oval(x, y, 2, 2, GLASS[0]); g.set(x - 1, y - 1, GLASS[3]); }
  g.thick(14, 14, 6, 6, 2, '#38444a');
  g.thick(26, 44, 31, 70, 1, '#10181e');
  g.thick(27, 44, 32, 70, 1, '#10181e');
  for (let i = 0; i < 30; i++) g.set(6 + ri(54), 56 + ri(16), i % 2 ? WHITE[1] : STONE[2]);
  weedTuft(g, 18, 75, 4, 7);
  weedTuft(g, 48, 75, 3, 6);
  g.rect(0, 72, 68, 4, SAND[0]);
  g.outline(OUT);
  return g.rows();
}
function hullLeanB() {
  const g = new Grid(52, 66);
  hull(g, 10, 66, 38, 54, -7, ['#2a2220', '#4a3c34', '#6a5848'], 2.7, false);
  g.oval(30, 24, 3, 3, BRASS[1]);
  g.oval(30, 24, 2, 2, GLASS[0]);
  for (let i = 0; i < 20; i++) g.set(6 + ri(40), 46 + ri(16), i % 2 ? WHITE[1] : STONE[2]);
  weedTuft(g, 22, 65, 3, 6);
  g.rect(0, 62, 52, 4, SAND[0]);
  g.outline(OUT);
  return g.rows();
}
function shipRibs() {
  const g = new Grid(68, 48);
  g.rect(2, 42, 64, 4, WOOD[1]);
  g.rect(2, 42, 64, 1, WOOD[2]);
  g.rect(2, 45, 64, 1, WOOD[0]);
  const snaps = [30, 22, 36, 14, 38, 26, 34];
  for (let i = 0; i < 7; i++) {
    const x = 6 + i * 9;
    const dir = i < 3 ? -1 : 1;
    const hgt = snaps[i];
    for (let k = 0; k <= hgt; k++) {
      const t = k / 36;
      const xx = x + dir * Math.round(Math.pow(t, 1.6) * 12) + (i === 5 ? -Math.round(t * 5) : 0);
      g.rect(xx, 41 - k, 3, 1, WOOD[1]);
      g.set(xx, 41 - k, WOOD[2]);
      g.set(xx + 2, 41 - k, WOOD[0]);
    }
  }
  // A few planks left on the stern, a stub of rail.
  planks(g, 52, 28, 14, 14, WOOD, 3);
  g.rect(50, 26, 18, 2, WOOD[3]);
  g.thick(18, 36, 38, 30, 1, WOOD[0]);
  weedTuft(g, 12, 46, 3, 6);
  weedTuft(g, 44, 46, 2, 5);
  g.outline(OUT);
  return g.rows();
}
function figurehead() {
  const g = new Grid(20, 44);
  // A carved woman's figure leaning forward off a stump of beam; paint flaking.
  g.poly([[6, 43], [5, 30], [8, 24], [14, 26], [15, 43]], WOOD[1]);
  g.poly([[6, 43], [6, 30], [8, 26], [9, 43]], WOOD[2]);
  g.poly([[8, 24], [10, 18], [14, 18], [14, 26]], BLUE[1]);
  g.oval(10, 12, 4, 5, WHITE[1]);
  g.oval(9, 11, 3, 4, WHITE[2]);
  g.rect(8, 10, 1, 1, IRON[0]);
  g.rect(11, 10, 1, 1, IRON[0]);
  g.rect(9, 14, 3, 1, RED[1]);
  // Long carved hair in waves, falling past the shoulder.
  g.poly([[5, 9], [8, 4], [14, 5], [15, 14], [17, 28], [13, 28], [12, 15], [7, 15]], GREEN[1]);
  for (let y = 6; y < 28; y += 3) g.line(13 - Math.round((28 - y) / 8), y, 15 - Math.round((28 - y) / 10), y + 2, GREEN[0]);
  g.poly([[8, 4], [11, 3], [14, 5], [10, 7]], GREEN[2]);
  for (let i = 0; i < 9; i++) g.set(6 + ri(10), 10 + ri(30), WOOD[0]);
  g.rect(3, 40, 15, 4, SAND[1]);
  g.outline(OUT);
  return g.rows();
}
function shipsWheel() {
  const g = new Grid(24, 30);
  post(g, 10, 14, 29, 4, WOOD);
  g.rect(5, 26, 14, 4, WOOD[0]);
  g.rect(5, 26, 14, 1, WOOD[2]);
  g.ring(12, 11, 9, WOOD[1]);
  g.ring(12, 11, 8, WOOD[2]);
  g.ring(12, 11, 5, WOOD[0]);
  wheelSpokes(g, 12, 11, 10, 8, 0.2, WOOD, 1);
  for (let i = 0; i < 8; i++) { const a = 0.2 + (i / 8) * 6.2832; g.rect(12 + Math.cos(a) * 11 - 1, 11 + Math.sin(a) * 11 - 1, 2, 2, WOOD[3]); }
  g.oval(12, 11, 2, 2, BRASS[2]);
  g.outline(OUT);
  return g.rows();
}
function chainBollard() {
  const g = new Grid(20, 22);
  g.rect(4, 17, 12, 5, IRON[1]);
  g.rect(4, 17, 12, 1, IRON[2]);
  g.rect(6, 8, 8, 10, IRON[1]);
  g.rect(6, 8, 2, 10, IRON[2]);
  g.oval(10, 7, 6, 2, IRON[2]);
  g.oval(10, 6, 5, 1, IRON[3]);
  // A chain around the neck, trailing to the floor in links.
  for (let i = 0; i < 4; i++) g.rect(6 + i * 2, 11 + (i % 2), 2, 2, RUST[1 + (i % 2)]);
  for (let i = 0; i < 6; i++) { g.rect(14 + (i > 2 ? 1 : 0), 13 + i * 2 - (i > 2 ? 1 : 0), 2, 2, i % 2 ? RUST[2] : RUST[1]); }
  g.rect(15, 21, 5, 1, RUST[0]);
  g.outline(OUT);
  return g.rows();
}
function galleyStove() {
  const g = new Grid(20, 34);
  g.rect(3, 12, 14, 14, IRON[1]);
  g.rect(3, 12, 14, 2, IRON[2]);
  g.rect(3, 12, 1, 14, IRON[2]);
  g.rect(16, 12, 1, 14, IRON[0]);
  g.rect(6, 17, 7, 6, IRON[0]);
  g.rect(7, 18, 5, 4, RUST[0]);
  g.rect(9, 14, 2, 1, BRASS[2]);
  g.rect(3, 26, 2, 7, IRON[1]);
  g.rect(14, 26, 2, 7, IRON[1]);
  g.rect(2, 32, 4, 2, IRON[0]);
  g.rect(13, 32, 4, 2, IRON[0]);
  g.rect(5, 9, 5, 3, IRON[0]);
  g.rect(7, 3, 3, 7, IRON[1]);
  g.rect(7, 2, 8, 2, IRON[1]);
  g.rect(12, 2, 3, 3, IRON[2]);
  for (let i = 0; i < 6; i++) g.set(4 + ri(12), 14 + ri(11), RUST[1 + ri(2)]);
  g.outline(OUT);
  return g.rows();
}
function tatteredSail(f) {
  const g = new Grid(40, 52);
  post(g, 1, 4, 51, 3, WOOD);
  g.rect(0, 51, 8, 1, WOOD[0]);
  g.thick(2, 6, 38, 5, 2, WOOD[1]);
  const flap = [0, 1, 0, -1][f];
  for (let x = 6; x < 37; x++) {
    const hgt = 30 + Math.round(Math.sin(x * 0.55 + f * 1.4) * 4) - (x > 30 ? (x - 30) * 2 : 0);
    const off = Math.round(Math.sin((x - 6) / 30 * Math.PI) * flap);
    for (let y = 7; y < 7 + hgt; y++) {
      const hole = (x === 14 && y > 18 && y < 25) || (x === 15 && y > 20 && y < 24) || (x === 26 && y > 14 && y < 20);
      if (hole) continue;
      g.set(x + (y > 18 ? off : 0), y, (y + Math.floor(x / 3)) % 7 === 0 ? SAIL[0] : SAIL[1 + ((x + y) % 11 === 0 ? 1 : 0)]);
    }
    for (let k = 0; k < 4; k++) if (rand() < 0.25) g.rect(x + off, 7 + hgt - 1 - k, 1, 1 + k, null);
  }
  g.outline(OUT);
  return g.rows();
}
function tatteredFlag(f) {
  const g = new Grid(20, 40);
  post(g, 2, 2, 39, 2, WOOD);
  g.rect(1, 37, 5, 3, STONE[1]);
  g.rect(1, 1, 4, 2, BRASS[2]);
  for (let x = 4; x < 19; x++) {
    const t = x - 4;
    const y0 = 3 + Math.round(Math.sin(t * 0.6 + f * 1.6) * 1.5);
    const hgt = 10 - Math.floor(t / 3);
    for (let y = 0; y < hgt; y++) g.set(x, y0 + y, y < 3 ? RED[1] : y < 6 ? RED[2] : RED[0]);
    if (t > 8) g.set(x, y0 + hgt, RED[0]);
  }
  g.rect(18, 5, 1, 2, null);
  g.outline(OUT);
  return g.rows();
}

// ===================== THE SOUNDINGS =====================
function stalactiteDrip(step) {
  const g = new Grid(16, 44);
  const t = 18;
  g.poly([[3, 0], [13, 0], [10, 10], [8, t], [6, 10]], STONE[1]);
  g.poly([[3, 0], [8, 0], [7, 10], [8, t]], STONE[2]);
  g.poly([[9, 0], [13, 0], [10, 10]], STONE[0]);
  g.rect(8, t, 1, 2, WATER[2]);
  // A drop forms, falls, splashes into the puddle at the bottom.
  if (step === 0) g.rect(8, t + 1, 1, 2, WATER[3]);
  if (step === 1) { g.rect(8, t + 8, 1, 2, WATER[3]); }
  if (step === 2) { g.rect(8, t + 20, 1, 2, WATER[3]); }
  g.oval(8, 41, 5, 1, WATER[1]);
  g.oval(8, 41, 3, 1, WATER[2]);
  if (step === 3) { g.ring(8, 41, 5, WATER[3], 24); g.set(6, 38, WATER[3]); g.set(10, 38, WATER[3]); g.set(8, 37, WATER[3]); }
  g.outline(OUT);
  return g.rows();
}
function stalactitesWide() {
  const g = new Grid(48, 34);
  g.rect(0, 0, 48, 4, STONE[0]);
  for (const [cx, len, w] of [[8, 24, 7], [22, 32, 9], [36, 18, 6], [44, 12, 4]]) {
    g.poly([[cx - w, 0], [cx + w, 0], [cx + 1, len], [cx - 1, len]], STONE[1]);
    g.poly([[cx - w, 0], [cx - 1, 0], [cx - 1, len]], STONE[2]);
    g.poly([[cx + 2, 0], [cx + w, 0], [cx + 1, len]], STONE[0]);
    g.set(cx, len + 1, WATER[3]);
  }
  g.outline(OUT);
  return g.rows();
}
function soundingWeight() {
  const g = new Grid(20, 26);
  // A lead plumb-bob with a brass eye and a coil of knotted line beside it.
  g.poly([[8, 6], [12, 6], [15, 22], [5, 22]], IRON[2]);
  g.poly([[8, 6], [10, 6], [9, 22], [5, 22]], IRON[3]);
  g.poly([[12, 6], [15, 22], [11, 22]], IRON[1]);
  g.rect(5, 22, 11, 2, IRON[0]);
  g.oval(10, 22, 3, 1, BRASS[1]);
  g.rect(9, 3, 2, 4, BRASS[2]);
  g.ring(10, 2, 2, BRASS[2]);
  g.set(10, 2, null);
  g.ring(3, 20, 2, ROPE[1]);
  g.ring(3, 20, 1, ROPE[2]);
  g.line(3, 18, 8, 6, ROPE[1]);
  g.rect(8, 15, 3, 1, BRASS[2]);
  g.outline(OUT);
  return g.rows();
}
function chapelPews(step) {
  const g = new Grid(52, 30);
  // Two pews, the near one nearly under, the far one tilting; water laps them.
  const pew = (x, y, w, tilt) => {
    box(g, x, y, w, 4, WOOD);
    g.rect(x, y - 8, w, 2, WOOD[2]);
    for (let i = 0; i < w; i += 6) g.rect(x + i, y - 8, 2, 9, WOOD[0]);
    g.rect(x + 1, y - 8 + tilt, w - 2, 1, WOOD[3]);
    g.rect(x + 2, y + 4, 2, 6, WOOD[0]);
    g.rect(x + w - 4, y + 4, 2, 6, WOOD[0]);
  };
  pew(2, 12, 40, 0);
  pew(8, 4, 40, 1);
  for (let x = 0; x < 52; x++) {
    const y = 20 + Math.round(Math.sin((x + step * 4) * 0.5) * 0.8);
    g.rect(x, y, 1, 10, WATER[1]);
    g.set(x, y, WATER[3]);
    if ((x + step * 2) % 9 === 0) g.set(x, y + 3, WATER[2]);
  }
  g.rect(40, 23, 8, 2, WOOD[1]); // a hymn board bobbing
  g.outline(OUT);
  return g.rows();
}

// ===================== THE BEACON ISLES / HADDOCK'S LIGHT =====================
function lightBase(kind) {
  const w = kind === 'a' ? 32 : 20;
  const h = kind === 'a' ? 56 : 40;
  const g = new Grid(w, h);
  const half = w / 2;
  const top = kind === 'a' ? 6 : 4;
  // A tapering tower: red and white bands (a), white with a black band (b).
  for (let y = top; y < h - 2; y++) {
    const t = (y - top) / (h - top);
    const hw = Math.round(half - 6 + t * 4);
    const band = Math.floor((y - top) / 9) % 2;
    const c = kind === 'a' ? (band ? RED : WHITE) : (Math.floor((y - top) / 10) === 1 ? IRON : WHITE);
    g.rect(half - hw, y, hw * 2, 1, c[1]);
    g.rect(half - hw, y, 2, 1, c[2]);
    g.rect(half + hw - 2, y, 2, 1, c[0]);
  }
  // Broken top, jagged.
  for (let x = 0; x < w; x++) if ((x * 5) % 7 < 3 && x > 3 && x < w - 3) g.rect(x, top, 1, 2 + (x % 3), null);
  g.rect(half - 3, h - 14, 6, 12, WOOD[0]);
  g.oval(half, h - 14, 3, 2, WOOD[0]);
  g.rect(half - 2, h - 13, 4, 11, WOOD[1]);
  g.rect(half - 8, h - 8, 3, 3, GLASS[0]);
  g.rect(2, h - 3, w - 4, 3, STONE[1]);
  g.rect(2, h - 3, w - 4, 1, STONE[3]);
  g.outline(OUT);
  return g.rows();
}
function littleLight(step) {
  // A complete toy-sized lighthouse whose lantern pulses (step 0..3).
  const g = new Grid(20, 46);
  g.poly([[5, 44], [7, 14], [13, 14], [15, 44]], WHITE[1]);
  g.poly([[5, 44], [7, 14], [9, 14], [8, 44]], WHITE[2]);
  g.poly([[7, 23], [13, 23], [14, 32], [6, 32]], RED[1]);
  g.rect(4, 42, 12, 3, STONE[2]);
  g.rect(8, 36, 4, 8, WOOD[0]);
  g.rect(5, 12, 10, 2, IRON[1]);
  const c = [LAMPY[0], LAMPY[1], LAMPY[2], LAMPY[3]][step];
  g.rect(6, 5, 8, 7, c);
  g.rect(7, 6, 6, 5, step > 1 ? LAMPY[3] : c);
  g.rect(9, 5, 2, 7, IRON[1]);
  g.poly([[5, 5], [10, 0], [15, 5]], RED[1]);
  g.rect(9, 0, 2, 1, IRON[2]);
  g.outline(OUT);
  return g.rows();
}
function lampHousing() {
  const g = new Grid(36, 30);
  // A lantern room lying on its rocks: brass frame, a ring of panes, some gone.
  g.rect(3, 22, 30, 5, BRASS[1]);
  g.rect(3, 22, 30, 1, BRASS[3]);
  g.rect(3, 26, 30, 1, BRASS[0]);
  for (let i = 0; i < 6; i++) {
    const x = 5 + i * 5;
    g.rect(x, 9, 4, 13, i === 2 || i === 4 ? null : GLASS[1]);
    if (i !== 2 && i !== 4) g.rect(x, 9, 1, 13, GLASS[2]);
    g.rect(x + 4, 8, 1, 14, BRASS[2]);
  }
  g.rect(3, 8, 1, 14, BRASS[2]);
  g.poly([[2, 9], [18, 1], [34, 9]], BRASS[1]);
  g.poly([[5, 9], [18, 3], [20, 9]], BRASS[2]);
  g.rect(16, 0, 4, 2, BRASS[2]);
  g.oval(18, 17, 3, 4, LAMPY[2]);
  g.rect(0, 26, 36, 4, STONE[1]);
  g.rect(2, 28, 10, 2, STONE[2]);
  g.outline(OUT);
  return g.rows();
}
function ropeBridgePost() {
  const g = new Grid(20, 36);
  post(g, 6, 6, 35, 5, WOOD);
  g.rect(5, 4, 7, 3, WOOD[2]);
  g.rect(5, 4, 7, 1, WOOD[3]);
  g.rect(3, 32, 11, 4, STONE[1]);
  g.rect(3, 32, 11, 1, STONE[3]);
  g.ring(8, 20, 2, IRON[2]);
  // Two ropes: a handrail and a lower line, running off to the right, sagging a little.
  for (let x = 11; x < 20; x++) {
    g.set(x, 9 + Math.round((x - 11) / 6), ROPE[2]);
    g.set(x, 10 + Math.round((x - 11) / 6), ROPE[0]);
    g.set(x, 21 + Math.round((x - 11) / 5), ROPE[2]);
  }
  for (let i = 0; i < 3; i++) g.rect(6, 8 + i, 5, 1, ROPE[1]);
  g.outline(OUT);
  return g.rows();
}
function forge(step) {
  const g = new Grid(52, 46);
  stoneWall(g, 2, 18, 40, 28, STONE);
  g.poly([[0, 20], [8, 6], [36, 6], [44, 20]], STONE[1]);
  g.rect(14, 0, 14, 12, STONE[1]);
  g.rect(14, 0, 2, 12, STONE[2]);
  g.rect(13, 0, 16, 2, STONE[3]);
  // Hearth mouth with the oil-fire in it.
  g.rect(10, 28, 24, 16, IRON[0]);
  g.oval(22, 28, 12, 4, IRON[0]);
  const fl = [LAMPY[1], '#ff9030', '#ff7020'][step % 3];
  g.rect(13, 38, 18, 6, '#a03810');
  g.oval(22, 38, 8, 4, fl);
  g.oval(22, 37, 5, 3, LAMPY[2]);
  g.oval(22 + (step % 2), 35 - step, 2, 2 + step, LAMPY[3]);
  g.rect(8, 44, 28, 2, IRON[2]);
  // Bellows on the right with a nozzle, tongs on a peg.
  g.poly([[44, 34], [52, 36], [52, 44], [44, 44]], WOOD[1]);
  g.rect(44, 34, 8, 1, WOOD[3]);
  g.rect(38, 40, 7, 2, IRON[2]);
  g.rect(3, 22, 1, 7, IRON[2]);
  g.rect(4, 22, 3, 1, IRON[2]);
  g.rect(2, 28, 5, 1, IRON[1]);
  g.outline(OUT);
  return g.rows();
}
function sealAnvil() {
  const g = new Grid(20, 22);
  g.rect(5, 12, 10, 10, WOOD[1]);
  g.rect(5, 12, 2, 10, WOOD[2]);
  g.rect(5, 12, 10, 1, WOOD[3]);
  g.rect(5, 21, 10, 1, WOOD[0]);
  g.poly([[1, 6], [14, 6], [18, 8], [14, 10], [11, 10], [11, 12], [6, 12], [6, 10]], IRON[1]);
  g.rect(1, 6, 13, 2, IRON[3]);
  g.rect(14, 7, 1, 2, IRON[2]);
  g.thick(10, 5, 14, 1, 2, WOOD[2]);
  g.rect(14, 1, 4, 3, IRON[2]);
  g.outline(OUT);
  return g.rows();
}
function bottleGarden() {
  const g = new Grid(52, 32);
  g.rect(0, 26, 52, 6, SAND[0]);
  g.rect(0, 26, 52, 1, SAND[2]);
  for (let i = 0; i < 11; i++) {
    const x = 3 + i * 4;
    const col = [GREEN, BLUE, YELLOW, GREEN, WHITE][i % 5];
    const hh = 6 + (i % 3) * 2;
    g.rect(x, 25 - hh, 3, hh, col[1]);
    g.rect(x, 25 - hh, 1, hh, col[2]);
    g.rect(x + 1, 24 - hh - 1, 1, 2, col[0]);
  }
  // Buoys on poles, and a row of rope-wrapped stones as the border.
  for (const [x, c] of [[8, RED], [26, YELLOW], [44, BLUE]]) {
    g.rect(x, 4, 2, 22, WOOD[1]);
    g.oval(x + 1, 6, 4, 4, c[0]);
    g.oval(x + 1, 6, 3, 3, c[1]);
    g.set(x, 5, c[2]);
    g.rect(x - 3, 6, 8, 1, WHITE[1]);
  }
  for (let i = 0; i < 13; i++) g.oval(2 + i * 4, 29, 2, 1, STONE[1 + (i % 2) * 1]);
  g.outline(OUT);
  return g.rows();
}
function heightMarks() {
  // A patch of whitewashed brick on the stair wall, chipped here and there, with two sets of marks
  // scratched into it side by side (a nail, a knife): the long set is the Hero's, the shorter one
  // is Corrie's, and it stops. Small notches beside the marks are the years.
  const g = new Grid(36, 52);
  g.rect(2, 2, 32, 48, WHITE[2]);
  g.rect(2, 2, 32, 1, WHITE[1]);
  g.rect(33, 2, 1, 48, WHITE[1]);
  g.rect(2, 49, 32, 1, WHITE[0]);
  for (let y = 8; y < 48; y += 8) g.rect(2, y, 32, 1, WHITE[1]);
  for (const [cx, cy] of [[4, 4], [30, 6], [5, 44], [28, 46], [31, 27]]) g.rect(cx, cy, 2, 2, WHITE[1]);
  // The two columns of scratches.
  g.rect(9, 5, 1, 42, STONE[1]);
  g.rect(25, 5, 1, 42, STONE[1]);
  for (let i = 0; i < 12; i++) {
    const y = 46 - i * 3.6;
    g.rect(i % 3 === 2 ? 5 : 6, Math.round(y), i % 3 === 2 ? 8 : 6, 1, STONE[0]);
    g.set(14, Math.round(y), STONE[2]);
  }
  for (let i = 0; i < 7; i++) {
    const y = 46 - i * 3.6;
    g.rect(i % 3 === 2 ? 21 : 22, Math.round(y), i % 3 === 2 ? 8 : 6, 1, STONE[0]);
    g.set(30, Math.round(y), STONE[2]);
  }
  // The last mark of the shorter set is rubbed round; nothing above it.
  g.ring(25, 46 - 6 * 3.6, 3, STONE[1], 12);
  g.outline(OUT);
  return g.rows();
}
function childDrawing() {
  // A sheet of paper pinned up by two red-headed pins: a crayon sun, a stripy lighthouse, and two
  // little people standing under it, the small one and the one with the sword.
  const g = new Grid(16, 20);
  g.rect(1, 1, 14, 18, WHITE[2]);
  g.rect(14, 1, 1, 18, WHITE[1]);
  g.rect(1, 18, 14, 1, WHITE[1]);
  g.oval(12, 5, 2, 2, YELLOW[2]);
  g.rect(8, 6, 3, 8, RED[1]);
  g.rect(8, 9, 3, 2, WHITE[1]);
  g.rect(7, 4, 5, 2, YELLOW[1]);
  g.set(9, 3, YELLOW[2]);
  g.rect(2, 14, 12, 1, GREEN[1]);
  // The small one (ME): a round head, a body, arms up.
  g.oval(4, 10, 1, 1, BLUE[1]);
  g.rect(4, 11, 1, 3, BLUE[1]);
  g.set(3, 11, BLUE[1]);
  g.set(5, 11, BLUE[1]);
  // The tall one (THE HERO): a head, a body, and a long thin sword.
  g.oval(13, 9, 1, 1, RED[1]);
  g.rect(13, 10, 1, 4, RED[1]);
  g.rect(12, 11, 1, 2, IRON[2]);
  g.set(14, 11, IRON[2]);
  // Scribbles that are the writing: a label over each head.
  g.rect(3, 7, 3, 1, IRON[1]);
  g.rect(11, 7, 3, 1, IRON[1]);
  // The pins.
  g.rect(2, 0, 2, 2, RED[2]);
  g.rect(12, 0, 2, 2, RED[2]);
  g.set(2, 0, RED[1]);
  g.set(12, 0, RED[1]);
  g.outline(OUT);
  return g.rows();
}
function toyBoat() {
  const g = new Grid(20, 16);
  g.poly([[1, 9], [18, 9], [15, 14], [4, 14]], RED[1]);
  g.rect(1, 9, 17, 1, WHITE[2]);
  g.rect(9, 2, 1, 8, WOOD[1]);
  g.poly([[10, 2], [10, 8], [16, 8]], WHITE[2]);
  g.poly([[8, 3], [8, 8], [4, 8]], WHITE[1]);
  g.rect(9, 1, 3, 1, RED[2]);
  g.rect(5, 11, 2, 2, YELLOW[1]);
  g.outline(OUT);
  return g.rows();
}
function chest(open) {
  const g = new Grid(20, 20);
  box(g, 1, 8, 18, 11, WOOD);
  g.rect(2, 9, 16, 9, WOOD[1]);
  g.rect(2, 12, 16, 1, WOOD[0]);
  g.rect(1, 8, 18, 2, BRASS[1]);
  g.rect(1, 17, 18, 2, BRASS[1]);
  g.rect(5, 8, 2, 11, BRASS[1]);
  g.rect(13, 8, 2, 11, BRASS[1]);
  if (open) {
    g.rect(2, 9, 16, 4, IRON[0]);
    g.rect(1, 0, 18, 7, WOOD[0]);
    g.rect(2, 1, 16, 5, WOOD[1]);
    g.rect(1, 6, 18, 1, BRASS[1]);
    g.rect(2, 12, 16, 1, WOOD[0]);
  } else {
    g.poly([[1, 8], [3, 3], [17, 3], [19, 8]], WOOD[2]);
    g.rect(1, 7, 18, 1, BRASS[2]);
    g.rect(5, 3, 2, 5, BRASS[1]);
    g.rect(13, 3, 2, 5, BRASS[1]);
    g.rect(9, 6, 3, 4, BRASS[3]);
    g.set(10, 8, IRON[0]);
  }
  g.outline(OUT);
  return g.rows();
}

// ===================== THE LAST LIGHT =====================
function crankWheel(step) {
  const g = new Grid(28, 32);
  g.rect(4, 26, 20, 6, IRON[1]);
  g.rect(4, 26, 20, 1, IRON[2]);
  g.rect(12, 14, 4, 12, IRON[1]);
  const a = (step / 8) * 6.2832;
  g.ring(14, 11, 10, IRON[1]);
  g.ring(14, 11, 9, IRON[2]);
  wheelSpokes(g, 14, 11, 9, 4, a, IRON, 1);
  for (let i = 0; i < 12; i++) { const ang = (i / 12) * 6.2832 + a; g.rect(14 + Math.cos(ang) * 10 - 1, 11 + Math.sin(ang) * 10 - 1, 2, 2, IRON[2]); }
  g.oval(14, 11, 3, 3, BRASS[1]);
  // A crank handle off the rim.
  const hx = 14 + Math.cos(a) * 9;
  const hy = 11 + Math.sin(a) * 9;
  g.rect(hx - 1, hy - 1, 3, 3, WOOD[2]);
  g.rect(hx, hy, 1, 1, WOOD[3]);
  g.rect(13, 10, 2, 2, IRON[0]);
  g.outline(OUT);
  return g.rows();
}
function sluiceGate() {
  const g = new Grid(36, 48);
  post(g, 1, 6, 47, 4, IRON);
  post(g, 31, 6, 47, 4, IRON);
  g.rect(0, 4, 36, 4, IRON[2]);
  g.rect(0, 4, 36, 1, IRON[3]);
  // The plate, half raised, rusted; water pouring from beneath.
  g.rect(5, 10, 26, 20, RUST[1]);
  for (let y = 12; y < 30; y += 4) g.rect(5, y, 26, 1, RUST[0]);
  for (let x = 8; x < 30; x += 6) g.rect(x, 10, 1, 20, RUST[2]);
  g.rect(16, 8, 4, 22, IRON[1]);
  g.rect(14, 2, 8, 3, IRON[2]);
  g.rect(8, 30, 20, 17, WATER[0]);
  for (let x = 6; x < 30; x++) { g.rect(x, 33 + (x % 4), 1, 14, WATER[1]); }
  for (let x = 8; x < 28; x += 4) g.rect(x, 38 + (x % 3) * 2, 3, 1, WATER[3]);
  g.outline(OUT);
  return g.rows();
}
function spiralRail(kind) {
  const g = new Grid(20, 44);
  // Broken bits of stairwell rail: a curved handrail with balusters.
  g.rect(1, 41, 18, 3, IRON[1]);
  g.rect(1, 41, 18, 1, IRON[2]);
  for (let i = 0; i < 5; i++) {
    const x = 2 + i * 4;
    const top = kind === 'a' ? 10 + i * 3 : 28 - i * 4 + (i === 4 ? 4 : 0);
    g.rect(x, top, 2, 41 - top, IRON[1]);
    g.rect(x, top, 1, 41 - top, IRON[2]);
    g.set(x, top - 1, BRASS[2]);
  }
  for (let x = 0; x < 20; x++) {
    const t = x / 19;
    const y = kind === 'a' ? 8 + Math.round(t * 14 - Math.sin(t * 3) * 2) : 26 - Math.round(t * 18) + (t > 0.9 ? 6 : 0);
    g.rect(x, y, 1, 3, WOOD[x % 2 ? 1 : 2]);
    g.set(x, y, WOOD[3]);
  }
  g.outline(OUT);
  return g.rows();
}
function greatLens(step) {
  const g = new Grid(68, 68);
  // Brass pedestal and bottom ring.
  g.rect(14, 60, 40, 8, BRASS[1]);
  g.rect(14, 60, 40, 2, BRASS[3]);
  g.rect(14, 66, 40, 2, BRASS[0]);
  g.rect(24, 54, 20, 7, BRASS[0]);
  // The lens: a drum of concentric glass rings, a hot bulb in the middle.
  g.oval(34, 30, 26, 26, BRASS[0]);
  g.oval(34, 30, 24, 24, GLASS[1]);
  for (const r of [22, 19, 16, 13, 10]) g.ring(34, 30, r, r % 2 ? GLASS[2] : GLASS[0], r * 8);
  g.oval(34, 30, 7, 7, LAMPY[1]);
  g.oval(34, 30, 5, 5, LAMPY[2]);
  g.oval(34, 30, 3, 3, LAMPY[3]);
  // Brass ribs.
  for (let i = 0; i < 6; i++) { const a = (i / 6) * 3.1416; g.thick(34 - Math.cos(a) * 25, 30 - Math.sin(a) * 25, 34 + Math.cos(a) * 25, 30 + Math.sin(a) * 25, 1, BRASS[2]); }
  g.rect(8, 28, 52, 3, BRASS[2]);
  g.rect(8, 28, 52, 1, BRASS[3]);
  // A moving glint that sweeps across the glass.
  const gx = 12 + step * 12;
  for (let y = 10; y < 52; y++) { const x = gx + Math.round((y - 30) / 4); const dx = x - 34; const dy = y - 30; if (dx * dx + dy * dy < 22 * 22) { g.set(x, y, '#ffffff'); g.set(x + 1, y, '#e8fff8'); } }
  g.oval(34, 6, 6, 3, BRASS[1]);
  g.rect(30, 0, 8, 4, BRASS[2]);
  g.outline(OUT);
  return g.rows();
}
function longLantern(step) {
  const g = new Grid(16, 48);
  g.rect(4, 42, 8, 5, IRON[1]);
  g.rect(3, 45, 10, 3, IRON[0]);
  g.rect(4, 42, 8, 1, IRON[2]);
  g.rect(5, 10, 6, 32, [GLASS[1], LAMPY[1], LAMPY[2]][step % 3] ?? GLASS[1]);
  g.rect(6, 12, 4, 28, [LAMPY[2], LAMPY[3], LAMPY[2]][step % 3]);
  g.rect(7, 16, 2, 20, LAMPY[3]);
  g.rect(4, 9, 8, 2, BRASS[1]);
  g.rect(4, 41, 8, 2, BRASS[1]);
  g.rect(4, 9, 1, 34, BRASS[2]);
  g.rect(11, 9, 1, 34, BRASS[0]);
  g.poly([[5, 9], [8, 4], [11, 9]], BRASS[1]);
  g.ring(8, 3, 2, BRASS[2]);
  g.set(8, 1, BRASS[3]);
  g.outline(OUT);
  return g.rows();
}
function handbell() {
  const g = new Grid(14, 18);
  g.rect(6, 1, 2, 7, WOOD[2]);
  g.rect(6, 1, 1, 7, WOOD[3]);
  g.rect(5, 0, 4, 1, WOOD[1]);
  g.poly([[5, 8], [9, 8], [11, 15], [12, 16], [2, 16], [3, 15]], BRASS[1]);
  g.poly([[5, 9], [7, 9], [6, 15], [3, 15]], BRASS[3]);
  g.rect(2, 16, 10, 1, BRASS[0]);
  g.rect(6, 17, 2, 1, IRON[1]);
  g.outline(OUT);
  return g.rows();
}
function handbellFloat(step) {
  const g = new Grid(20, 26);
  const bob = [0, 1, 2, 1][step];
  const bell = new Grid(14, 18);
  bell.cells = unpack(handbell());
  g.paste(bell, 3, 3 + bob);
  const sparks = [[3, 20 - step * 2], [16, 18 - step * 3], [9, 24 - ((step * 5) % 12)], [14, 8 + step]];
  for (const [x, y] of sparks) { g.set(x, y, '#fff4b8'); if (step % 2) { g.set(x + 1, y, '#ffe27a'); g.set(x - 1, y, '#ffe27a'); } }
  return g.rows();
}
function farLantern(step) {
  // Tiny and far away: a stick with a lantern that lights as the ending starts.
  const g = new Grid(8, 12);
  g.rect(3, 4, 1, 8, WOOD[1]);
  g.rect(2, 11, 3, 1, STONE[1]);
  const body = [IRON[1], LAMPY[0], LAMPY[2], LAMPY[3]][step];
  g.rect(2, 1, 3, 3, body);
  g.rect(2, 0, 3, 1, IRON[1]);
  if (step >= 2) { g.set(1, 2, '#ffe27a'); g.set(5, 2, '#ffe27a'); }
  if (step === 3) { g.set(3, 2, '#ffffff'); g.set(0, 2, '#fff0b0'); g.set(6, 2, '#fff0b0'); }
  return g.rows();
}

// --- Registry ---------------------------------------------------------
const frames = (fn, n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`f${i + 1}`, fn(i)]));

// The gulls' hoard (secret_gull_hoard): a heap of everything shiny they ever
// borrowed. Sand and feathers underneath, spoons, buttons, a thimble, a
// monocle, a little bell and a very small trumpet on top.
function gullHoard() {
  const g = new Grid(32, 22);
  const SILVER = ['#5a6068', '#9aa2aa', '#d4dade', '#ffffff'];
  // The heap itself: a mound of driftwood twigs, feathers and junk, lit from the top left.
  g.poly([[1, 21], [6, 12], [12, 6], [18, 5], [24, 9], [30, 15], [31, 21]], WOOD[1]);
  g.poly([[3, 20], [7, 12], [12, 7], [18, 6], [23, 10], [28, 16], [29, 20]], WOOD[2]);
  g.poly([[7, 15], [11, 9], [16, 7], [19, 9], [14, 14]], WOOD[3]);
  for (const [x, y] of [[5, 15], [26, 16], [9, 18], [22, 18]]) { g.line(x, y, x + 4, y - 2, WHITE[2]); g.set(x + 1, y, WHITE[1]); }
  // Spoons, lying every which way.
  const spoon = (x, y, dx, dy) => { g.line(x, y, x + dx * 6, y + dy * 6, SILVER[1]); g.oval(x, y, 1, 1, SILVER[2]); g.set(x - 1, y - 1, SILVER[3]); };
  spoon(8, 13, 1, -0.2);
  spoon(21, 14, -1, -0.4);
  spoon(15, 17, 1, 0.1);
  // Coins and buttons.
  for (const [x, y, c] of [[11, 11, BRASS], [18, 12, BRASS], [24, 13, RED], [6, 17, BLUE], [27, 17, BRASS], [13, 15, GREEN]]) {
    g.rect(x, y, 2, 2, c[1]); g.set(x, y, c[2]);
  }
  // A thimble, a monocle on its string, a little bell, a very small trumpet.
  g.rect(17, 8, 3, 3, SILVER[1]); g.rect(17, 8, 1, 3, SILVER[2]); g.rect(17, 7, 3, 1, SILVER[2]);
  g.ring(25, 10, 2, BRASS[2], 12); g.set(25, 10, GLASS[3]); g.line(23, 11, 20, 14, BRASS[1]);
  g.poly([[9, 6], [11, 6], [13, 10], [7, 10]], BRASS[1]); g.rect(8, 7, 1, 3, BRASS[3]); g.rect(9, 4, 2, 2, BRASS[0]);
  g.line(2, 12, 6, 11, BRASS[1]); g.poly([[0, 9], [2, 11], [2, 13], [0, 14]], BRASS[2]); g.set(6, 11, BRASS[3]);
  // Glints.
  for (const [x, y] of [[12, 10], [20, 9], [26, 12], [7, 14]]) g.set(x, y, '#fff8d0');
  g.outline(OUT);
  return g.rows();
}

export const COAST_PROP_SPRITES = {
  // Gullrest: the happy beach
  c5_bunting_string: buntingString(0),
  c5_bunting_post: buntingPost(0),
  c5_deckchair: deckchair(),
  c5_beach_hut: beachHut(),
  c5_rowboat: rowboat(false),
  c5_the_bother: rowboat(true),
  c5_lifeboat_doors: lifeboatDoors(),
  c5_lifebuoy_post: lifebuoyPost(),
  c5_oilskin_hook: oilskinHook(),
  c5_lantern_post_unlit: lanternPost(0),
  c5_lantern_post_lit: lanternPost(2),
  c5_tide_board: tideBoard(),
  c5_buoy_red: buoy('red'),
  c5_buoy_yellow: buoy('yellow'),
  c5_buoys_pile: buoyPile(),
  c5_lobster_pots: lobsterPots(),
  c5_haddock_rock: haddockRock(),
  c5_sea_cave: seaCave(),
  c5_net_frame: netFrame(),
  c5_anchor: anchor(),
  c5_rope_coil: ropeCoil(),
  c5_crate: crate(),
  c5_crates_stack: cratesStack(),
  c5_barrel: barrel(),
  c5_barrels: barrels(),
  // The storm shore
  c5_tide_clock: tideClock(0),
  c5_seaweed_heap: seaweedHeap(false),
  c5_seaweed_heap_big: seaweedHeap(true),
  c5_bathtub_wreck: bathtubWreck(),
  c5_driftwood: driftwood(),
  c5_driftwood_tall: driftwoodTall(),
  // Saltcombe
  c5_stilt_house: stiltHouse(false),
  c5_stilt_house_small: stiltHouse(true),
  c5_hanging_nets: hangingNets(),
  c5_sign_fish: shopSign('fish'),
  c5_sign_chandler: shopSign('rope'),
  c5_sign_inn: shopSign('inn'),
  c5_market_stall: marketStall(),
  c5_lamplighter_ladder: lamplighterLadder(true),
  c5_harbour_bell: harbourBell(0),
  // The Dowager's gate post before her bell is hung on it (wrack_bathtub).
  c5_bell_frame_empty: harbourBell(0, true),
  // The Sunken Lanes
  c5_halfsunk_cottage: halfSunkCottage(),
  c5_church_wall: churchWall(),
  c5_sluice_wheel: sluiceWheel(0),
  c5_mill_wheel: millWheel(0),
  c5_drowned_signpost: drownedSignpost(),
  // The Wreck Yard
  c5_snapped_mast: snappedMast(),
  c5_star_shard: starShard(1),
  c5_hull_lean_a: hullLeanA(),
  c5_hull_lean_b: hullLeanB(),
  c5_ship_ribs: shipRibs(),
  c5_figurehead: figurehead(),
  c5_ships_wheel: shipsWheel(),
  c5_chain_bollard: chainBollard(),
  c5_galley_stove: galleyStove(),
  c5_tattered_sail: tatteredSail(0),
  c5_tattered_flag: tatteredFlag(0),
  // The Soundings
  c5_stalactite_drip: stalactiteDrip(0),
  c5_stalactites_wide: stalactitesWide(),
  c5_sounding_weight: soundingWeight(),
  c5_chapel_pews: chapelPews(0),
  // The Beacon Isles and Haddock's Light
  c5_light_base_a: lightBase('a'),
  c5_light_base_b: lightBase('b'),
  c5_little_light: littleLight(2),
  c5_lamp_housing: lampHousing(),
  c5_rope_bridge_post: ropeBridgePost(),
  c5_forge: forge(0),
  c5_seal_anvil: sealAnvil(),
  c5_bottle_garden: bottleGarden(),
  c5_height_marks: heightMarks(),
  c5_child_drawing: childDrawing(),
  c5_toy_boat: toyBoat(),
  c5_chest: chest(false),
  c5_chest_open: chest(true),
  // The Last Light
  c5_crank_wheel: crankWheel(0),
  c5_sluice_gate: sluiceGate(),
  c5_spiral_rail_a: spiralRail('a'),
  c5_spiral_rail_b: spiralRail('b'),
  c5_great_lens: greatLens(1),
  c5_long_lantern: longLantern(0),
  c5_handbell: handbell(),
  c5_gull_hoard: gullHoard(),
  c5_handbell_float: handbellFloat(0),
  c5_far_lantern: farLantern(0),
};

// Moving props: frames of one size, played by `animation: '<same name>'`.
export const C5_PALETTE = palette;
export const COAST_PALETTE_EXTRA = palette;
export const C5_BUNTING_STRING_SPRITES = frames((i) => buntingString(i), 3);
export const C5_BUNTING_POST_SPRITES = frames((i) => buntingPost(i), 2);
export const C5_LANTERN_POST_LIT_SPRITES = { f1: lanternPost(1), f2: lanternPost(2), f3: lanternPost(3), f4: lanternPost(2) };
export const C5_TIDE_CLOCK_SPRITES = frames((i) => tideClock(i), 4);
export const C5_LAMPLIGHTER_LADDER_SPRITES = { f1: lamplighterLadder(true), f2: lamplighterLadder(false) };
export const C5_HARBOUR_BELL_SPRITES = { f1: harbourBell(0), f2: harbourBell(1), f3: harbourBell(0), f4: harbourBell(-1) };
export const C5_SLUICE_WHEEL_SPRITES = frames((i) => sluiceWheel(i), 4);
export const C5_MILL_WHEEL_SPRITES = frames((i) => millWheel(i), 4);
export const C5_STAR_SHARD_SPRITES = frames((i) => starShard(i), 4);
export const C5_TATTERED_SAIL_SPRITES = frames((i) => tatteredSail(i), 4);
export const C5_TATTERED_FLAG_SPRITES = frames((i) => tatteredFlag(i), 4);
export const C5_STALACTITE_DRIP_SPRITES = frames((i) => stalactiteDrip(i), 4);
export const C5_CHAPEL_PEWS_SPRITES = frames((i) => chapelPews(i), 4);
export const C5_LITTLE_LIGHT_SPRITES = { f1: littleLight(1), f2: littleLight(2), f3: littleLight(3), f4: littleLight(2) };
export const C5_FORGE_SPRITES = frames((i) => forge(i), 3);
export const C5_CRANK_WHEEL_SPRITES = frames((i) => crankWheel(i), 8);
export const C5_GREAT_LENS_SPRITES = frames((i) => greatLens(i), 5);
export const C5_LONG_LANTERN_SPRITES = frames((i) => longLantern(i), 3);
export const C5_HANDBELL_FLOAT_SPRITES = frames((i) => handbellFloat(i), 4);
export const C5_FAR_LANTERN_SPRITES = frames((i) => farLantern(i), 4);

// How many tiles wide each big one stands.
export const COAST_FOOTPRINTS = {
  c5_gull_hoard: 2,
  c5_bunting_string: 3,
  c5_beach_hut: 3,
  c5_rowboat: 3,
  c5_the_bother: 3,
  c5_lifeboat_doors: 4,
  c5_tide_board: 2,
  c5_buoys_pile: 2,
  c5_lobster_pots: 2,
  c5_haddock_rock: 4,
  c5_sea_cave: 2,
  c5_net_frame: 2,
  c5_crates_stack: 1,
  c5_barrels: 2,
  c5_tide_clock: 2,
  c5_seaweed_heap_big: 2,
  c5_bathtub_wreck: 2,
  c5_driftwood: 2,
  c5_stilt_house: 4,
  c5_stilt_house_small: 3,
  c5_hanging_nets: 2,
  c5_market_stall: 3,
  c5_harbour_bell: 2,
  c5_bell_frame_empty: 2,
  c5_halfsunk_cottage: 4,
  c5_church_wall: 4,
  c5_mill_wheel: 3,
  c5_snapped_mast: 2,
  c5_hull_lean_a: 4,
  c5_hull_lean_b: 3,
  c5_ship_ribs: 4,
  c5_figurehead: 1,
  c5_ships_wheel: 2,
  c5_tattered_sail: 3,
  c5_tattered_flag: 1,
  c5_stalactites_wide: 3,
  c5_chapel_pews: 3,
  c5_light_base_a: 2,
  c5_lamp_housing: 2,
  c5_forge: 3,
  c5_bottle_garden: 3,
  c5_height_marks: 2,
  c5_sluice_gate: 2,
  c5_spiral_rail_a: 1,
  c5_spiral_rail_b: 1,
  c5_great_lens: 4,
  c5_chest: 1,
  c5_chest_open: 1,
  c5_toy_boat: 1,
};

// What glows (positions from the middle of the prop's foot, up is negative).
const LAMP = '255, 200, 110';
const FIRE = '255, 140, 60';
const GOLD = '255, 226, 140';
const PALE = '210, 255, 240';
export const COAST_GLOWS = {
  c5_lantern_post_lit: [
    { dy: -34, bloom: 14, strength: 0.8, flicker: 0.35, color: LAMP },
    { dy: -8, pool: 60, strength: 0.6, flicker: 0.25, color: LAMP },
  ],
  c5_stilt_house: [
    { dx: -18, dy: -48, bloom: 10, strength: 0.7, flicker: 0.1, color: LAMP },
    { dx: 20, dy: -48, bloom: 10, strength: 0.7, flicker: 0.1, color: LAMP },
    { dy: -48, pool: 90, strength: 0.4, flicker: 0.1, color: LAMP },
  ],
  c5_stilt_house_small: [
    { dx: -13, dy: -38, bloom: 10, strength: 0.7, flicker: 0.1, color: LAMP },
    { dy: -38, pool: 70, strength: 0.4, flicker: 0.1, color: LAMP },
  ],
  c5_market_stall: [
    { dx: -17, dy: -26, bloom: 10, strength: 0.7, flicker: 0.3, color: LAMP },
    { dy: -12, pool: 76, strength: 0.5, flicker: 0.2, color: LAMP },
  ],
  c5_lamplighter_ladder: [
    { dx: 4, dy: -46, bloom: 14, strength: 0.75, flicker: 0.3, color: LAMP },
    { dx: 4, dy: -8, pool: 56, strength: 0.55, flicker: 0.2, color: LAMP },
  ],
  c5_forge: [
    { dy: -8, bloom: 20, strength: 0.75, flicker: 0.8, color: FIRE },
    { dy: 4, pool: 90, strength: 0.6, flicker: 0.6, color: FIRE },
  ],
  c5_great_lens: [
    { dy: -34, bloom: 34, strength: 0.8, flicker: 0, color: '255, 244, 200' },
    { dy: -6, pool: 130, strength: 0.6, flicker: 0, color: '255, 244, 200' },
  ],
  c5_long_lantern: [
    { dy: -24, bloom: 14, strength: 0.7, flicker: 0.3, color: LAMP },
    { dy: -4, pool: 54, strength: 0.5, flicker: 0.2, color: LAMP },
  ],
  c5_little_light: [
    { dy: -37, bloom: 12, strength: 0.7, flicker: 0.2, color: LAMP },
    { dy: -6, pool: 40, strength: 0.35, flicker: 0.2, color: LAMP },
  ],
  c5_star_shard: [
    { dy: -5, bloom: 12, strength: 0.7, flicker: 0.4, color: GOLD },
    { dy: 0, pool: 36, strength: 0.3, flicker: 0.3, color: GOLD },
  ],
  c5_handbell_float: [
    { dy: -12, bloom: 12, strength: 0.55, flicker: 0.3, color: GOLD },
    { dy: 0, pool: 40, strength: 0.25, flicker: 0.2, color: GOLD },
  ],
  c5_far_lantern: [{ dy: -8, bloom: 10, strength: 0.7, flicker: 0.4, color: LAMP }],
  c5_lamp_housing: [{ dy: -12, bloom: 10, strength: 0.25, flicker: 0.5, color: PALE }],
};
