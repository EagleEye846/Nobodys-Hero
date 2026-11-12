// Props for the ghost ship (Chapter 5, the brig Fair Return): her helm and trimming lines, the
// mast and shrouds, guns and shot, the crew's harmonium, the captain's cabin, the post bag, and the
// crew themselves, see-through and still at their stations. Drawn like wreckYard.js (a tiny
// painter, 16 pixels to a tile, standing on the bottom edge and centred over the footprint). Every
// id starts `gs_`. The ghosts and the lantern are animations too (GS_..._SPRITES): give the prop
// `animation: '<its name>'` and a `speed`.
//
// Things that must be on something (no floating props): the lantern hangs on its hook and bracket, the bell on its
// post, the tackle on a ring bolt in an upright, the portraits on a nail with a cord.

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0x7a00 + colors.size);
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

  ring(cx, cy, r, c, t = 1) {
    for (let a = 0; a < 360; a += 4) {
      const x = cx + Math.cos((a * Math.PI) / 180) * r;
      const y = cy + Math.sin((a * Math.PI) / 180) * r;
      this.rect(Math.round(x), Math.round(y), t, t, c);
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

const OUT = '#0c0a08';
const WOOD = ['#1c1510', '#33271c', '#4c3b2a', '#6a5640', '#8a7456'];
const BRASS = ['#4a3410', '#8a6420', '#c49a38', '#f0d070'];
const ROPE = ['#3c3426', '#6c5e44', '#a8987a'];
const IRON = ['#14181c', '#2c343c', '#4c5864', '#7a8a96'];
const CANVAS = ['#6e6a5c', '#948e7c', '#b8b09a'];
// The crew: pale, see-through, a cold sea-green.
const GHOST = ['rgba(46, 82, 82, 0.55)', 'rgba(118, 168, 164, 0.6)', 'rgba(190, 226, 218, 0.68)', 'rgba(236, 250, 246, 0.8)'];
const GHOST_OUT = 'rgba(10, 32, 34, 0.55)';
// Unseen things (prints, chalk, a handprint): paler still, and only there in the lantern's light.
const TRACE = ['rgba(120, 186, 176, 0.55)', 'rgba(190, 232, 222, 0.7)', 'rgba(236, 252, 246, 0.85)'];

// --- The helm: a wheel on a pedestal with its compass, two tiles wide (the ship's list is turned here) ---
function helm() {
  const g = new Grid(32, 26);
  // The pedestal.
  g.rect(12, 14, 8, 11, WOOD[2]);
  g.rect(12, 14, 1, 11, WOOD[3]);
  g.rect(19, 14, 1, 11, WOOD[1]);
  g.rect(10, 23, 12, 2, WOOD[1]);
  g.rect(10, 23, 12, 1, WOOD[3]);
  // The compass in its brass bowl.
  g.rect(13, 12, 6, 3, BRASS[1]);
  g.rect(14, 12, 4, 1, BRASS[3]);
  g.set(15, 11, '#c8d6d0');
  g.set(16, 11, '#c8d6d0');
  // The wheel: a ring, a brass hub and eight spokes with handles.
  const cx = 16;
  const cy = 8;
  g.ring(cx, cy, 7, WOOD[2], 1);
  g.ring(cx, cy, 6, WOOD[3], 1);
  for (let a = 0; a < 8; a++) {
    const r = (a * Math.PI) / 4;
    g.line(cx, cy, cx + Math.cos(r) * 7, cy + Math.sin(r) * 7, WOOD[3]);
    g.rect(Math.round(cx + Math.cos(r) * 9) - 1, Math.round(cy + Math.sin(r) * 9) - 1, 2, 2, WOOD[4]);
  }
  g.rect(cx - 1, cy - 1, 3, 3, BRASS[2]);
  g.set(cx, cy, BRASS[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A trimming line: a rope hauled round a cleat on a post, up into a block on the beam above ---
function trimLine() {
  const g = new Grid(16, 30);
  // The post (a stanchion) and the beam it carries up.
  g.rect(6, 6, 4, 22, WOOD[2]);
  g.rect(6, 6, 1, 22, WOOD[3]);
  g.rect(9, 6, 1, 22, WOOD[1]);
  g.rect(3, 2, 10, 4, WOOD[2]);
  g.rect(3, 2, 10, 1, WOOD[3]);
  g.rect(4, 26, 8, 2, WOOD[1]);
  // The block (a pulley) hung under the beam, and the line through it.
  g.rect(7, 6, 2, 3, IRON[2]);
  g.oval(8, 11, 2, 2, IRON[1]);
  g.set(8, 11, BRASS[2]);
  g.line(6, 9, 5, 22, ROPE[1]);
  g.line(10, 9, 11, 22, ROPE[2]);
  // The cleat, and the line round it, a hank hanging free.
  g.rect(4, 20, 8, 2, WOOD[3]);
  g.rect(5, 19, 2, 1, WOOD[3]);
  g.rect(9, 19, 2, 1, WOOD[3]);
  g.line(5, 22, 7, 25, ROPE[2]);
  g.line(11, 22, 9, 25, ROPE[1]);
  g.rect(7, 25, 2, 3, ROPE[2]);
  g.outline(OUT);
  return g.rows();
}

// --- A ballast crank: an iron wheel with a handle on a post, down in the bilge ---
function crank() {
  const g = new Grid(16, 20);
  g.rect(6, 8, 4, 10, IRON[1]);
  g.rect(6, 8, 1, 10, IRON[2]);
  g.rect(4, 16, 8, 2, IRON[0]);
  g.ring(8, 6, 5, IRON[2], 1);
  for (let a = 0; a < 6; a++) {
    const r = (a * Math.PI) / 3;
    g.line(8, 6, 8 + Math.cos(r) * 5, 6 + Math.sin(r) * 5, IRON[3]);
  }
  g.rect(7, 5, 3, 3, BRASS[1]);
  g.set(8, 6, BRASS[3]);
  g.rect(12, 5, 2, 4, WOOD[3]);
  for (const y of [11, 13, 15]) g.rect(6, y, 4, 1, '#6a3a24');
  g.outline(OUT);
  return g.rows();
}

// --- Gun tackle: ropes and a block on a ring bolt in an upright, the gun deck's hauling gear ---
function tackle() {
  const g = new Grid(16, 30);
  g.rect(7, 4, 3, 24, WOOD[2]);
  g.rect(7, 4, 1, 24, WOOD[3]);
  g.rect(5, 26, 7, 2, WOOD[1]);
  // The ring bolt through the upright and the double block on it.
  g.rect(5, 8, 2, 2, IRON[3]);
  g.ring(5, 11, 2, IRON[2], 1);
  g.rect(2, 12, 6, 4, WOOD[3]);
  g.rect(2, 12, 6, 1, WOOD[4]);
  g.oval(4, 14, 1, 1, IRON[0]);
  g.oval(6, 14, 1, 1, IRON[0]);
  // The falls: two lines going down, and the coil at the foot.
  g.line(3, 16, 3, 24, ROPE[2]);
  g.line(6, 16, 11, 24, ROPE[1]);
  g.oval(11, 25, 3, 1, ROPE[2]);
  g.oval(11, 26, 3, 1, ROPE[1]);
  g.outline(OUT);
  return g.rows();
}

// --- The mast: a thick round stick, banded, with a rail of belaying pins and the rigging going up into the fog ---
function mast() {
  const g = new Grid(16, 64);
  g.rect(3, 0, 10, 62, WOOD[2]);
  g.rect(3, 0, 2, 62, WOOD[3]);
  g.rect(5, 0, 1, 62, WOOD[4]);
  g.rect(11, 0, 2, 62, WOOD[1]);
  g.rect(12, 0, 1, 62, WOOD[0]);
  // The iron bands and the pins rail.
  for (const y of [8, 22, 40]) { g.rect(3, y, 10, 2, IRON[1]); g.rect(3, y, 10, 1, IRON[2]); }
  g.rect(1, 46, 14, 3, WOOD[1]);
  g.rect(1, 46, 14, 1, WOOD[3]);
  for (let x = 2; x < 15; x += 3) { g.rect(x, 49, 1, 3, WOOD[4]); g.set(x, 52, WOOD[3]); }
  g.rect(2, 56, 12, 6, WOOD[1]);
  // Lines coming down, lashed.
  g.line(4, 12, 2, 44, ROPE[1]);
  g.line(11, 12, 14, 44, ROPE[0]);
  g.rect(4, 62, 8, 2, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

// --- The shrouds: rope-ladder rigging going up beside the mast (walk up into it) ---
function ratlines() {
  const g = new Grid(32, 56);
  g.line(6, 54, 14, 0, ROPE[2]);
  g.line(26, 54, 18, 0, ROPE[2]);
  g.line(7, 54, 15, 0, ROPE[0]);
  g.line(25, 54, 17, 0, ROPE[0]);
  for (let y = 4; y < 54; y += 5) {
    const t = (y / 54);
    const xl = 14 - 8 * t + 0.5;
    const xr = 18 + 8 * t - 0.5;
    g.line(xl, y, xr, y, ROPE[1]);
  }
  // The dead-eyes at the foot, on the rail.
  g.rect(3, 52, 5, 2, WOOD[3]);
  g.rect(24, 52, 5, 2, WOOD[3]);
  g.rect(4, 50, 3, 2, WOOD[1]);
  g.rect(25, 50, 3, 2, WOOD[1]);
  g.outline(OUT);
  return g.rows();
}

// --- A hatch with its grating (two tiles, flat on the deck) and a battened one ---
function hatch(shut) {
  const g = new Grid(32, 16);
  g.rect(0, 1, 32, 14, WOOD[1]);
  g.rect(0, 1, 32, 1, WOOD[3]);
  g.rect(0, 14, 32, 1, WOOD[0]);
  if (shut) {
    g.rect(3, 3, 26, 10, WOOD[2]);
    for (let x = 3; x < 29; x += 4) g.rect(x, 3, 1, 10, WOOD[1]);
    g.rect(2, 7, 28, 2, IRON[1]);
    g.rect(2, 7, 28, 1, IRON[2]);
  } else {
    g.rect(3, 3, 26, 10, '#06090a');
    for (let x = 4; x < 29; x += 4) g.rect(x, 3, 2, 10, WOOD[3]);
    for (const y of [5, 9]) g.rect(3, y, 26, 1, WOOD[2]);
    g.rect(12, 7, 8, 1, '#162426');
  }
  g.outline(OUT);
  return g.rows();
}

// --- A ladder going down (flat: lay it over a hatch) ---
function ladder() {
  const g = new Grid(16, 16);
  g.rect(0, 0, 16, 16, '#050708');
  g.rect(3, 0, 2, 16, WOOD[3]);
  g.rect(11, 0, 2, 16, WOOD[3]);
  for (let y = 2; y < 16; y += 4) g.rect(5, y, 6, 2, WOOD[4]);
  g.rect(3, 0, 1, 16, WOOD[4]);
  return g.rows();
}

// --- A gun on its carriage, muzzle to the right (or left), run out to a gunport ---
function cannon(left) {
  const g = new Grid(16, 16);
  const f = (x) => (left ? 15 - x : x);
  const R = (x, y, w, h, c) => g.rect(left ? 16 - x - w : x, y, w, h, c);
  // The carriage: two cheeks and a stepped body, two small wheels.
  R(2, 8, 9, 4, WOOD[2]);
  R(2, 8, 9, 1, WOOD[3]);
  R(2, 11, 9, 1, WOOD[0]);
  R(1, 7, 3, 6, WOOD[1]);
  R(4, 12, 3, 3, WOOD[0]);
  R(8, 12, 3, 3, WOOD[0]);
  g.set(f(5), 13, IRON[2]);
  g.set(f(9), 13, IRON[2]);
  // The barrel.
  R(3, 5, 12, 4, IRON[1]);
  R(3, 5, 12, 1, IRON[3]);
  R(3, 8, 12, 1, IRON[0]);
  R(13, 4, 3, 6, IRON[2]);
  R(13, 4, 3, 1, IRON[3]);
  R(15, 6, 1, 2, '#030405');
  R(3, 4, 2, 6, IRON[2]);
  g.set(f(4), 3, IRON[3]);
  R(7, 5, 1, 4, BRASS[1]);
  g.outline(OUT);
  return g.rows();
}

// --- A rack of round shot (a pyramid in a wooden frame) ---
function shot() {
  const g = new Grid(16, 16);
  g.rect(1, 12, 14, 3, WOOD[2]);
  g.rect(1, 12, 14, 1, WOOD[3]);
  const ball = (x, y) => { g.oval(x, y, 2, 2, IRON[1]); g.set(x - 1, y - 1, IRON[3]); g.set(x, y - 1, IRON[2]); };
  for (let i = 0; i < 4; i++) ball(3 + i * 3.4, 10);
  for (let i = 0; i < 3; i++) ball(5 + i * 3.4, 7);
  for (let i = 0; i < 2; i++) ball(7 + i * 3.4, 4);
  g.outline(OUT);
  return g.rows();
}

// --- The crew, see-through. Each is two frames (a breath, a sway). ---
// A sailor at the rail, seen from behind and a little to the side, hands on the rail, cap on, looking out.
function sailorAtRail(f) {
  const g = new Grid(16, 26);
  const b = f ? 1 : 0;
  // Cap and hair.
  g.oval(8, 4 + b, 3, 2, GHOST[2]);
  g.rect(5, 5 + b, 6, 1, GHOST[3]);
  g.oval(8, 7 + b, 3, 2, GHOST[1]);
  // The back, a jersey with stripes.
  g.rect(4, 10 + b, 9, 9, GHOST[2]);
  for (let y = 11 + b; y < 19; y += 3) g.rect(4, y, 9, 1, GHOST[0]);
  // Arms out to the rail.
  g.rect(3, 12 + b, 2, 6, GHOST[1]);
  g.rect(12, 12 + b, 2, 6, GHOST[1]);
  g.rect(2, 17 + b, 3, 2, GHOST[3]);
  g.rect(12, 17 + b, 3, 2, GHOST[3]);
  // No legs: he thins out to nothing a little above the deck.
  g.rect(5, 19, 7, 2, GHOST[1]);
  g.rect(6, 21, 5, 1, GHOST[0]);
  g.rect(7, 22, 3, 1, GHOST[0]);
  g.outline(GHOST_OUT);
  return g.rows();
}

// A boy kneeling, coiling a rope that is not there, over and over.
function boyCoiling(f) {
  const g = new Grid(16, 18);
  const t = f ? 1 : 0;
  g.oval(7, 4, 3, 3, GHOST[2]);
  g.rect(5, 3, 5, 1, GHOST[3]);
  g.rect(4, 7, 7, 6, GHOST[2]);
  g.rect(4, 12, 8, 2, GHOST[1]);
  g.rect(5, 14, 6, 1, GHOST[0]);
  // The hands moving, the coil in them (a ring, turning).
  g.rect(10 + t, 9, 3, 2, GHOST[3]);
  g.ring(13, 11 + t, 2, GHOST[3], 1);
  g.rect(6, 5, 1, 1, GHOST_OUT);
  g.rect(8, 5, 1, 1, GHOST_OUT);
  g.outline(GHOST_OUT);
  return g.rows();
}

// An old hand on a chest, pipe in his teeth, the pipe's bowl glowing a very little.
function oldHand(f) {
  const g = new Grid(16, 20);
  g.rect(2, 13, 12, 5, WOOD[2]);
  g.rect(2, 13, 12, 1, WOOD[3]);
  g.rect(2, 17, 12, 1, WOOD[0]);
  g.rect(7, 14, 2, 2, BRASS[2]);
  g.oval(8, 4, 3, 3, GHOST[2]);
  g.rect(5, 2, 7, 2, GHOST[3]);
  g.rect(5, 6, 6, 1, GHOST[3]);
  g.rect(5, 8, 6, 6, GHOST[1]);
  g.rect(4, 9, 2, 4, GHOST[2]);
  g.rect(10, 9, 2, 4, GHOST[2]);
  g.rect(10, 6, 4, 1, GHOST[0]);
  g.rect(14, 5, 1, 2, GHOST[0]);
  g.set(14, 4 + (f ? -1 : 0), 'rgba(255, 190, 120, 0.7)');
  g.set(6, 5, GHOST_OUT);
  g.set(9, 5, GHOST_OUT);
  g.outline(GHOST_OUT);
  return g.rows();
}

// A sleeper in a hammock (two tiles wide): the canvas sags, someone small lies in it, breathing.
function sleeper(f) {
  const g = new Grid(32, 18);
  g.rect(1, 2, 3, 3, IRON[1]);
  g.rect(28, 2, 3, 3, IRON[1]);
  for (let i = 0; i < 3; i++) { g.line(3, 4, 7, 6 + i, ROPE[1]); g.line(28, 4, 24, 6 + i, ROPE[1]); }
  for (let x = 7; x <= 24; x++) {
    const s = Math.round(Math.sin(((x - 7) / 17) * Math.PI) * 3);
    g.rect(x, 6 + s, 1, 6, CANVAS[1]);
    g.set(x, 6 + s, CANVAS[2]);
    g.set(x, 11 + s, CANVAS[0]);
  }
  const b = f ? 1 : 0;
  g.oval(10, 7, 2, 2, GHOST[2]);
  g.rect(12, 6 - b, 9, 4, GHOST[1]);
  g.rect(12, 6 - b, 9, 1, GHOST[3]);
  g.rect(21, 7 - b, 3, 2, GHOST[0]);
  g.outline(GHOST_OUT);
  return g.rows();
}

// The lookout in the crow's nest: a tall figure at the top of a mast, one arm out, pointing at a harbour that isn't there.
function lookout(f) {
  const g = new Grid(20, 28);
  const b = f ? 1 : 0;
  g.oval(9, 4 + b, 3, 3, GHOST[2]);
  g.rect(5, 2 + b, 9, 2, GHOST[3]);
  g.rect(6, 8 + b, 7, 10, GHOST[2]);
  g.rect(6, 12 + b, 7, 1, GHOST[0]);
  g.rect(13, 9 + b, 6, 2, GHOST[1]);
  g.rect(18, 8 + b, 2, 2, GHOST[3]);
  g.rect(4, 10 + b, 2, 6, GHOST[1]);
  g.rect(7, 18, 5, 3, GHOST[1]);
  g.rect(8, 21, 3, 3, GHOST[0]);
  g.outline(GHOST_OUT);
  return g.rows();
}

// A man standing very straight at the wheel, hands on a wheel that is not his. The first mate: Mr Pike.
function mate(f) {
  const g = new Grid(16, 28);
  const b = f ? 1 : 0;
  // Tricorn-less, grey hair, a long coat with two rows of buttons.
  g.oval(8, 5 + b, 3, 3, GHOST[2]);
  g.rect(5, 3 + b, 7, 2, GHOST[1]);
  g.rect(4, 9 + b, 9, 12, GHOST[2]);
  g.rect(4, 9 + b, 9, 1, GHOST[3]);
  for (const y of [11, 14, 17]) { g.set(7 + 0, y + b, GHOST[3]); g.set(9, y + b, GHOST[3]); }
  g.rect(2, 11 + b, 2, 8, GHOST[1]);
  g.rect(13, 11 + b, 2, 8, GHOST[1]);
  g.rect(5, 21, 7, 2, GHOST[1]);
  g.rect(6, 23, 5, 2, GHOST[0]);
  g.rect(7, 25, 3, 1, GHOST[0]);
  g.set(6, 5 + b, GHOST_OUT);
  g.set(10, 5 + b, GHOST_OUT);
  g.outline(GHOST_OUT);
  return g.rows();
}

// --- What only the lantern shows ---
// Wet bare footprints, going on (two of them, lighter toward the toe).
function prints(seed) {
  const g = new Grid(16, 16);
  const foot = (x, y, f) => {
    g.rect(x, y + 2, 2, 4, TRACE[1]);
    g.rect(x - (f ? 0 : 1) + 1, y + 1, 2, 2, TRACE[0]);
    g.rect(x, y, 3, 2, TRACE[1]);
    g.set(x, y - 1, TRACE[2]);
    g.set(x + 2, y - 1, TRACE[0]);
    g.set(x + 3 > 15 ? 15 : x + 3, y, TRACE[0]);
  };
  foot(3 + seed, 2 + seed, seed);
  foot(9 - seed, 9 - seed, 1 - seed);
  return g.rows();
}

// A wet handprint on a bulkhead, fingers spread, as if someone were holding the wall up.
function handprint() {
  const g = new Grid(16, 16);
  g.rect(5, 7, 7, 6, TRACE[1]);
  g.rect(4, 9, 1, 3, TRACE[0]);
  for (const [x, y] of [[5, 3], [7, 2], [9, 2], [11, 3]]) g.rect(x, y, 1, 5, TRACE[1]);
  g.set(5, 3, TRACE[2]);
  g.set(7, 2, TRACE[2]);
  g.set(9, 2, TRACE[2]);
  g.set(11, 3, TRACE[2]);
  g.rect(5, 13, 7, 2, TRACE[0]);
  g.rect(7, 15, 3, 1, TRACE[0]);
  return g.rows();
}

// Chalk on a bulkhead: a tally of days, in fives, and under it the one word, HOME. Two tiles wide.
function chalk() {
  const g = new Grid(32, 16);
  for (let k = 0; k < 4; k++) {
    for (let i = 0; i < 4; i++) g.rect(2 + k * 7 + i, 2, 1, 5, TRACE[1]);
    g.line(1 + k * 7, 6, 6 + k * 7, 2, TRACE[2]);
  }
  g.rect(30, 2, 1, 5, TRACE[1]);
  // H O M E, in letters a few pixels high.
  const ch = (x, rows) => rows.forEach((r, j) => [...r].forEach((c, i) => c === '#' && g.set(x + i, 9 + j, TRACE[2])));
  ch(7, ['#.#', '#.#', '###', '#.#', '#.#']);
  ch(12, ['###', '#.#', '#.#', '#.#', '###']);
  ch(17, ['#.#', '###', '###', '#.#', '#.#']);
  ch(22, ['###', '#..', '###', '#..', '###']);
  return g.rows();
}

// A ghost's hand-ring: the pull ring of a hidden bulkhead panel, a ring in a plate, glowing.
function ghostRing() {
  const g = new Grid(16, 16);
  g.rect(4, 3, 8, 11, TRACE[0]);
  g.rect(4, 3, 8, 1, TRACE[1]);
  g.ring(8, 9, 3, TRACE[2], 1);
  g.rect(7, 4, 2, 2, TRACE[2]);
  g.rect(7, 12, 2, 1, TRACE[1]);
  return g.rows();
}

// A hidden panel, as it looks when it's a door: a doorway in the bulkhead, no door in it.
function ghostDoor() {
  const g = new Grid(16, 22);
  g.rect(2, 2, 12, 20, 'rgba(8, 14, 16, 0.85)');
  g.rect(2, 2, 12, 1, TRACE[1]);
  g.rect(2, 2, 1, 20, TRACE[0]);
  g.rect(13, 2, 1, 20, TRACE[0]);
  g.rect(5, 6, 6, 1, TRACE[0]);
  g.rect(5, 12, 6, 1, TRACE[0]);
  return g.rows();
}

// --- Portraits: a brass frame on a nail, a painted face, the eyes two pale patches the engine puts pupils on ---
function portrait(kind) {
  const g = new Grid(16, 20);
  // The nail, the cord and the frame.
  g.set(8, 0, IRON[3]);
  g.line(8, 1, 3, 4, ROPE[1]);
  g.line(8, 1, 12, 4, ROPE[1]);
  g.rect(2, 4, 12, 15, BRASS[1]);
  g.rect(2, 4, 12, 1, BRASS[3]);
  g.rect(2, 4, 1, 15, BRASS[2]);
  g.rect(3, 5, 10, 13, '#17120e');
  const skin = kind === 'boy' ? '#a88c70' : kind === 'wife' ? '#b49478' : '#9a7c60';
  const hair = kind === 'boy' ? '#4a3420' : kind === 'wife' ? '#2a1c18' : '#8a8478';
  const dress = kind === 'boy' ? '#3a4a62' : kind === 'wife' ? '#4a2a34' : '#2a3040';
  // Hair, face, shoulders.
  g.rect(5, 6, 6, 3, hair);
  if (kind === 'wife') { g.rect(4, 7, 1, 7, hair); g.rect(11, 7, 1, 7, hair); }
  g.rect(5, 8, 6, 5, skin);
  g.rect(4, 14, 8, 4, dress);
  g.rect(7, 13, 2, 1, skin);
  if (kind === 'captain') { g.rect(5, 12, 6, 1, hair); g.rect(4, 5, 8, 1, '#1c2230'); }
  // The eyes: two pale patches (the pupils are put on by haunt.js, one pixel, following you).
  g.rect(5, 9, 2, 2, '#e6ddc8');
  g.rect(9, 9, 2, 2, '#e6ddc8');
  g.rect(7, 12, 2, 1, '#6a3a34');
  g.outline(OUT);
  return g.rows();
}

// --- The harmonium: four keys side by side (each a tile) of one little organ. Down = lit. ---
function harmonium(i, on) {
  const g = new Grid(16, 22);
  const left = i === 0;
  const right = i === 3;
  // The case (a dark carved cabinet with a bellows panel at the top).
  g.rect(left ? 1 : 0, 2, right ? 15 : 16, 18, WOOD[2]);
  g.rect(0, 2, 16, 1, WOOD[3]);
  g.rect(left ? 2 : 0, 4, right ? 13 : 16, 8, WOOD[1]);
  // A carved scroll and the fretwork over the speaker.
  for (let x = 2; x < 14; x += 3) g.rect(x, 6, 1, 4, '#0c0806');
  g.rect(0, 12, 16, 1, WOOD[4]);
  // The key (white, long, with its black neighbours) and the wood under it.
  g.rect(3, 13, 10, 6, on ? '#fff2c0' : '#c8c0aa');
  g.rect(3, 13, 10, 1, on ? '#ffffff' : '#e4dcc6');
  g.rect(3, on ? 19 : 18, 10, 1, '#7a725c');
  if (!right) g.rect(12, 13, 4, 3, '#16120e');
  if (!left) g.rect(0, 13, 3, 3, '#16120e');
  // The stool-end feet.
  g.rect(left ? 2 : 0, 20, right ? 13 : 16, 2, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

// --- The captain's door: shut and bolted with a brass lock, and open on a dark cabin ---
function cabinDoor(open) {
  const g = new Grid(16, 24);
  g.rect(0, 0, 16, 24, WOOD[1]);
  g.rect(0, 0, 16, 2, WOOD[3]);
  g.rect(0, 0, 2, 24, WOOD[2]);
  g.rect(14, 0, 2, 24, WOOD[0]);
  if (open) {
    g.rect(2, 2, 12, 22, '#07090a');
    g.rect(2, 2, 12, 2, '#1a1f20');
    g.rect(2, 20, 12, 4, '#14181a');
    g.rect(12, 6, 3, 17, WOOD[2]);
  } else {
    g.rect(2, 2, 12, 22, WOOD[2]);
    for (let x = 4; x < 14; x += 4) g.rect(x, 2, 1, 22, WOOD[1]);
    g.rect(2, 11, 12, 2, IRON[1]);
    g.rect(2, 11, 12, 1, IRON[2]);
    // The lock plate and its keyhole, and a name plate over it.
    g.rect(10, 13, 4, 5, BRASS[1]);
    g.rect(10, 13, 4, 1, BRASS[3]);
    g.set(12, 15, '#050403');
    g.set(12, 16, '#050403');
    g.rect(5, 5, 6, 2, BRASS[2]);
    g.rect(6, 5, 4, 1, BRASS[3]);
  }
  g.outline(OUT);
  return g.rows();
}

// A bulkhead door, shut: heavy boards with an iron latch. (The harmonium's tune opens it.)
function bulkDoor() {
  const g = new Grid(16, 16);
  g.rect(0, 0, 16, 16, WOOD[1]);
  g.rect(0, 0, 16, 1, WOOD[3]);
  g.rect(1, 1, 14, 15, WOOD[2]);
  for (let x = 4; x < 15; x += 4) g.rect(x, 1, 1, 15, WOOD[1]);
  g.rect(1, 5, 14, 2, IRON[1]);
  g.rect(1, 5, 14, 1, IRON[2]);
  g.rect(1, 11, 14, 2, IRON[1]);
  g.rect(1, 11, 14, 1, IRON[2]);
  g.rect(10, 7, 3, 3, IRON[2]);
  g.set(11, 8, IRON[0]);
  g.outline(OUT);
  return g.rows();
}

// --- THE DEEP PART (the orlop, the sail locker, the flooded bow, the figurehead's perch) ---
// A pig of ballast iron: a short fat ingot, rust at the edges. (A loose one rolls with the list.)
function ballastPig() {
  const g = new Grid(16, 16);
  g.rect(1, 6, 14, 8, IRON[1]);
  g.rect(2, 5, 12, 1, IRON[2]);
  g.rect(1, 6, 14, 2, IRON[2]);
  g.rect(3, 6, 4, 1, IRON[3]);
  g.rect(1, 12, 14, 2, IRON[0]);
  g.set(3, 10, '#6a3a24'); g.set(4, 10, '#6a3a24'); g.set(11, 9, '#6a3a24'); g.set(12, 11, '#6a3a24');
  g.rect(0, 8, 1, 4, IRON[0]); g.rect(15, 8, 1, 4, IRON[0]);
  g.outline(OUT);
  return g.rows();
}

// A bale of sailcloth, roped: a stout round bundle with the rope crossed over it.
function sailBale() {
  const g = new Grid(16, 16);
  g.oval(8, 9, 7, 5, CANVAS[1]);
  g.oval(8, 8, 6, 4, CANVAS[2]);
  g.rect(3, 12, 10, 1, CANVAS[0]);
  for (const x of [4, 8, 12]) g.rect(x, 4, 1, 10, ROPE[1]);
  g.rect(2, 8, 12, 1, ROPE[1]);
  g.set(7, 5, CANVAS[2]);
  g.set(8, 6, ROPE[2]);
  g.outline(OUT);
  return g.rows();
}

// THE FIGUREHEAD: the carved woman off the Fair Return's bow, as she was before she woke (two tiles wide, three tall): chin lifted, hair
// carved in waves, a crown of gilt stars, one hand held out for a coin. In her breast, where the wood is cracked, a star-shard, glowing.
function figurehead(lit = true) {
  const g = new Grid(32, 48);
  const GLOW = ['#6fb8e8', '#9fd6e8', '#e6f6ff'];
  // The cutwater and the bracket she is bolted to.
  g.rect(6, 40, 20, 8, WOOD[1]);
  g.rect(6, 40, 20, 1, WOOD[3]);
  g.rect(8, 36, 16, 5, WOOD[2]);
  g.rect(8, 36, 16, 1, WOOD[3]);
  for (const x of [10, 16, 22]) g.set(x, 42, IRON[2]);
  // Her skirt of carved sea, falling into the bracket.
  g.rect(9, 28, 14, 9, WOOD[2]);
  for (let x = 9; x < 23; x += 3) { g.rect(x, 33, 2, 1, WOOD[3]); g.rect(x + 1, 35, 2, 1, WOOD[1]); }
  g.rect(9, 28, 1, 9, WOOD[3]);
  // Hair: a long carved wave, trailing back down her left.
  g.oval(15, 12, 8, 9, WOOD[1]);
  g.oval(15, 12, 7, 8, WOOD[2]);
  for (let y = 12; y < 36; y += 4) { g.rect(3 + (y % 8) / 2, y, 6, 1, WOOD[3]); g.rect(4 + (y % 8) / 2, y + 2, 5, 1, WOOD[1]); }
  g.rect(4, 14, 5, 22, WOOD[2]);
  // Her body and the arm held out.
  g.oval(16, 25, 6, 8, WOOD[3]);
  g.oval(16, 24, 5, 7, WOOD[4]);
  g.line(21, 19, 30, 23, WOOD[3]);
  g.line(21, 20, 30, 24, WOOD[2]);
  g.rect(29, 21, 3, 4, WOOD[4]);
  // Her head: the chin lifted, eyes blank, a small carved smile.
  g.oval(17, 11, 4, 5, WOOD[4]);
  g.rect(15, 10, 1, 1, OUT); g.rect(19, 10, 1, 1, OUT);
  g.rect(16, 14, 3, 1, WOOD[1]);
  // The crown: five gilt stars.
  for (const [x, y] of [[11, 4], [14, 2], [17, 1], [20, 2], [23, 4]]) { g.set(x, y, BRASS[3]); g.set(x - 1, y + 1, BRASS[2]); g.set(x + 1, y + 1, BRASS[2]); g.set(x, y + 1, BRASS[3]); g.set(x, y + 2, BRASS[1]); }
  // The shard in her breast, in a crack that runs out through the wood.
  if (lit) {
    g.rect(15, 21, 3, 4, GLOW[1]);
    g.rect(16, 22, 1, 2, GLOW[2]);
    g.line(14, 20, 10, 16, GLOW[0]);
    g.line(18, 25, 21, 31, GLOW[0]);
    g.line(14, 25, 11, 29, GLOW[0]);
    g.set(18, 21, GLOW[2]);
  } else {
    // Gone out: the crack is only a crack, and the hollow it leaves is dark.
    g.rect(15, 21, 3, 4, WOOD[0]);
    g.line(14, 20, 10, 16, WOOD[0]);
    g.line(18, 25, 21, 31, WOOD[0]);
    g.line(14, 25, 11, 29, WOOD[0]);
  }
  g.outline(OUT);
  return g.rows();
}

// --- THE COMPASS (the quest for the deep part): glass, needle, card, and the binnacle they go in ---
function compassGlass() {
  const g = new Grid(16, 16);
  g.oval(8, 9, 6, 5, BRASS[1]);
  g.oval(8, 9, 5, 4, '#9ec8c8');
  g.oval(8, 8, 4, 3, '#cfeeee');
  g.set(5, 7, '#ffffff'); g.set(6, 6, '#ffffff');
  g.rect(3, 14, 10, 1, BRASS[0]);
  g.outline(OUT);
  return g.rows();
}
function compassNeedle() {
  const g = new Grid(16, 16);
  g.line(2, 12, 13, 4, IRON[3]);
  g.line(2, 13, 13, 5, IRON[2]);
  g.set(13, 4, '#d44a3a'); g.set(12, 5, '#d44a3a');
  g.set(7, 8, BRASS[3]); g.set(8, 8, BRASS[2]);
  g.rect(5, 13, 6, 1, WOOD[1]);
  g.outline(OUT);
  return g.rows();
}
function compassCard() {
  const g = new Grid(16, 16);
  g.oval(8, 8, 6, 6, '#c9b98a');
  g.oval(8, 8, 5, 5, '#e0d2a4');
  g.line(8, 2, 8, 14, '#6a3a24'); g.line(2, 8, 14, 8, '#6a3a24');
  g.line(4, 4, 12, 12, '#a8987a'); g.line(12, 4, 4, 12, '#a8987a');
  g.rect(7, 7, 3, 3, '#d44a3a');
  g.outline(OUT);
  return g.rows();
}
function binnacle(full) {
  const g = new Grid(16, 24);
  g.rect(5, 12, 6, 11, WOOD[2]);
  g.rect(5, 12, 1, 11, WOOD[3]);
  g.rect(10, 12, 1, 11, WOOD[1]);
  g.rect(3, 21, 10, 3, WOOD[1]);
  g.rect(3, 21, 10, 1, WOOD[3]);
  g.oval(8, 9, 6, 4, BRASS[1]);
  g.oval(8, 8, 5, 3, BRASS[2]);
  if (full) {
    g.oval(8, 8, 4, 2, '#9ec8c8');
    g.line(5, 9, 11, 7, '#d44a3a');
    g.set(8, 8, BRASS[3]);
  } else {
    g.oval(8, 8, 4, 2, WOOD[0]);
  }
  g.outline(OUT);
  return g.rows();
}

// --- The lantern on its hook: lit, with a flame that is not burning anything. Two frames. And the hook, bare. ---
function lantern(f, cold = false) {
  const g = new Grid(16, 28);
  // The post and the bracket it hangs from (a binnacle stand).
  g.rect(6, 12, 4, 15, WOOD[2]);
  g.rect(6, 12, 1, 15, WOOD[3]);
  g.rect(4, 25, 8, 2, WOOD[1]);
  g.rect(6, 6, 7, 2, WOOD[3]);
  g.rect(6, 6, 2, 8, WOOD[3]);
  g.rect(11, 7, 1, 2, IRON[2]);
  // The lantern: brass cap, glass, a flame.
  g.rect(9, 8, 5, 1, BRASS[2]);
  g.rect(10, 7, 3, 1, BRASS[3]);
  g.rect(9, 9, 5, 7, cold ? 'rgba(112, 190, 230, 0.9)' : 'rgba(255, 226, 150, 0.9)');
  g.rect(10, 10 - (f ? 1 : 0), 3, 5, cold ? '#d4f2ff' : '#fff4d0');
  g.rect(11, 11 - (f ? 1 : 0), 1, 3, '#ffffff');
  g.rect(9, 16, 5, 1, BRASS[1]);
  g.rect(9, 9, 1, 7, BRASS[1]);
  g.rect(13, 9, 1, 7, BRASS[1]);
  g.outline(OUT);
  return g.rows();
}

function lanternHook() {
  const g = new Grid(16, 28);
  g.rect(6, 12, 4, 15, WOOD[2]);
  g.rect(6, 12, 1, 15, WOOD[3]);
  g.rect(4, 25, 8, 2, WOOD[1]);
  g.rect(6, 6, 7, 2, WOOD[3]);
  g.rect(6, 6, 2, 8, WOOD[3]);
  g.rect(11, 7, 1, 4, IRON[2]);
  g.set(11, 11, IRON[3]);
  g.outline(OUT);
  return g.rows();
}

// --- Captain's things ---
// The chart table (two tiles): a chart held flat by brass weights, a pair of dividers, a compass.
function chartTable() {
  const g = new Grid(32, 22);
  g.rect(1, 6, 30, 14, WOOD[2]);
  g.rect(1, 6, 30, 1, WOOD[4]);
  g.rect(1, 18, 30, 2, WOOD[0]);
  g.rect(3, 8, 26, 9, '#b8ac8a');
  g.rect(3, 8, 26, 1, '#d0c4a2');
  // The coast, drawn and drawn again, a course line that stops short.
  g.line(5, 14, 11, 11, '#4a3c28');
  g.line(11, 11, 17, 13, '#4a3c28');
  g.line(17, 13, 22, 10, '#4a3c28');
  g.rect(22, 10, 2, 2, '#8a2a2a');
  g.rect(3, 12, 5, 3, '#8a7c5a');
  g.rect(24, 12, 4, 4, '#8a7c5a');
  // Weights, dividers, the little wrong compass.
  g.rect(4, 8, 2, 2, BRASS[2]);
  g.rect(27, 8, 2, 2, BRASS[2]);
  g.oval(15, 8, 2, 2, BRASS[2]);
  g.set(15, 8, '#c8d6d0');
  g.line(8, 15, 11, 9, IRON[3]);
  g.line(11, 9, 13, 15, IRON[3]);
  g.rect(3, 20, 3, 2, WOOD[0]);
  g.rect(26, 20, 3, 2, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

// The captain's bunk (two tiles): a narrow bed against the bulkhead, the blanket turned back, never slept in.
function bunk() {
  const g = new Grid(32, 20);
  g.rect(0, 2, 32, 16, WOOD[1]);
  g.rect(0, 2, 32, 1, WOOD[3]);
  g.rect(2, 4, 28, 12, '#3a4458');
  g.rect(2, 4, 28, 1, '#58647e');
  g.rect(2, 4, 8, 12, '#d0cab4');
  g.rect(2, 4, 8, 1, '#ece6d0');
  g.rect(4, 6, 5, 6, '#b8b29a');
  g.rect(10, 8, 20, 1, '#2a3244');
  // The turned-back corner.
  g.rect(10, 4, 6, 4, '#d0cab4');
  g.rect(0, 16, 32, 2, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

// A captain's sea chest, brass-cornered, locked.
function trunk() {
  const g = new Grid(16, 16);
  g.rect(1, 6, 14, 9, WOOD[2]);
  g.rect(1, 3, 14, 4, WOOD[3]);
  g.rect(1, 3, 14, 1, WOOD[4]);
  g.rect(1, 6, 14, 1, WOOD[0]);
  for (const x of [1, 13]) { g.rect(x, 3, 2, 12, BRASS[1]); g.set(x, 3, BRASS[3]); }
  g.rect(7, 6, 2, 3, BRASS[2]);
  g.set(8, 7, '#050403');
  g.rect(1, 14, 14, 1, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

// A rocking chair by the stern window: it is rocking. Two frames.
function chair(f) {
  const g = new Grid(16, 18);
  const tilt = f ? 1 : -1;
  g.rect(4 + tilt, 2, 8, 2, WOOD[3]);
  g.rect(4 + tilt, 2, 2, 11, WOOD[2]);
  g.rect(10 + tilt, 2, 2, 11, WOOD[2]);
  for (const x of [6, 8]) g.rect(x + tilt, 4, 1, 8, WOOD[2]);
  g.rect(3 + tilt * 0, 10, 10, 3, WOOD[3]);
  g.rect(3, 10, 10, 1, WOOD[4]);
  g.rect(5, 6, 6, 4, '#3a2a28');
  // The rockers.
  g.rect(1, 15 + (f ? 0 : 0), 14, 1, WOOD[1]);
  g.rect(2, 14, 2, 1, WOOD[1]);
  g.rect(12, 14, 2, 1, WOOD[1]);
  g.rect(4 + tilt, 12, 2, 3, WOOD[1]);
  g.rect(10 + tilt, 12, 2, 3, WOOD[1]);
  g.outline(OUT);
  return g.rows();
}

// The log, open on the desk (two tiles): the last page, and the page before it, and the page before that, all the same.
function logDesk() {
  const g = new Grid(32, 20);
  g.rect(1, 6, 30, 12, WOOD[2]);
  g.rect(1, 6, 30, 1, WOOD[4]);
  g.rect(1, 16, 30, 2, WOOD[0]);
  g.rect(4, 8, 24, 7, '#c8bea0');
  g.rect(15, 8, 2, 7, '#8a806a');
  for (let y = 9; y < 15; y += 2) { g.rect(5, y, 8, 1, '#5a4c38'); g.rect(19, y, 8, 1, '#5a4c38'); }
  // The inkwell and the quill, still wet.
  g.rect(27, 7, 3, 3, IRON[1]);
  g.set(28, 8, '#050403');
  g.line(28, 7, 31, 2, '#d8d2c2');
  g.rect(3, 18, 3, 2, WOOD[0]);
  g.rect(26, 18, 3, 2, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

// --- Letters ---
// The letter rack (two tiles): pigeonholes, every one stuffed with letters, string-tied, never collected.
function letterRack() {
  const g = new Grid(32, 22);
  g.rect(1, 2, 30, 18, WOOD[2]);
  g.rect(1, 2, 30, 1, WOOD[4]);
  g.rect(1, 18, 30, 2, WOOD[0]);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 6; c++) {
      const x = 3 + c * 4.6;
      g.rect(x, 4 + r * 5, 4, 4, '#0c0806');
      g.rect(x, 5 + r * 5, 3, 3, c % 2 ? '#d8d0b4' : '#c8c0a2');
      if ((r + c) % 3 === 0) g.set(x + 1, 6 + r * 5, '#8a2a2a');
    }
  }
  g.rect(3, 20, 3, 2, WOOD[0]);
  g.rect(26, 20, 3, 2, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

function postBag() {
  const g = new Grid(16, 16);
  g.oval(8, 10, 6, 5, '#7a6a4a');
  g.oval(8, 9, 5, 4, '#948260');
  g.rect(5, 4, 6, 3, '#7a6a4a');
  g.rect(5, 6, 6, 1, '#3a2c1c');
  g.rect(6, 3, 4, 2, '#948260');
  // A letter sticking out, and the tag on the neck: HER MAJESTY'S... no, the Fair Return's own.
  g.rect(9, 2, 4, 3, '#e4dcc4');
  g.rect(9, 2, 4, 1, '#ffffff');
  g.set(11, 3, '#8a2a2a');
  g.rect(4, 7, 2, 3, BRASS[2]);
  g.outline(OUT);
  return g.rows();
}

// Letters spilled across the planks, flat: more than a bag could hold, tied up in string.
function lettersPile() {
  const g = new Grid(16, 16);
  const letter = (x, y, w, h, c = '#d8d0b4') => { g.rect(x, y, w, h, c); g.rect(x, y, w, 1, '#ffffff'); g.set(x + Math.floor(w / 2), y + 1, '#8a2a2a'); };
  letter(2, 8, 7, 5, '#c8c0a2');
  letter(6, 5, 7, 5);
  letter(9, 9, 6, 5, '#e0d8bc');
  g.line(2, 11, 8, 11, ROPE[1]);
  g.outline('rgba(20, 14, 10, 0.7)');
  return g.rows();
}

// --- The name board on the bow: FAIR RETURN, in gilt on black, two tiles. ---
function nameboard() {
  const g = new Grid(48, 16);
  g.rect(0, 2, 48, 12, WOOD[1]);
  g.rect(0, 2, 48, 1, WOOD[3]);
  g.rect(1, 4, 46, 8, '#10100e');
  const ch = (x, rows, c = BRASS[2]) => rows.forEach((r, j) => [...r].forEach((q, i) => q === '#' && g.set(x + i, 5 + j, c)));
  // F A I R   R E T U R N: five rows, three wide, one pixel between.
  const L = {
    F: ['###', '#..', '##.', '#..', '#..'], A: ['.#.', '#.#', '###', '#.#', '#.#'], I: ['###', '.#.', '.#.', '.#.', '###'],
    R: ['##.', '#.#', '##.', '#.#', '#.#'], E: ['###', '#..', '##.', '#..', '###'], T: ['###', '.#.', '.#.', '.#.', '.#.'],
    U: ['#.#', '#.#', '#.#', '#.#', '###'], N: ['##.', '#.#', '#.#', '#.#', '#.#'],
  };
  let x = 3;
  for (const c of 'FAIR') { ch(x, L[c]); x += 4; }
  x += 3;
  for (const c of 'RETURN') { ch(x, L[c]); x += 4; }
  g.outline(OUT);
  return g.rows();
}

// The ship's bell on a bracket post (it rings with a very small sound when you press it).
function shipBell() {
  const g = new Grid(16, 24);
  g.rect(7, 8, 3, 15, WOOD[2]);
  g.rect(7, 8, 1, 15, WOOD[3]);
  g.rect(4, 21, 9, 2, WOOD[1]);
  g.rect(3, 6, 11, 2, WOOD[3]);
  g.rect(3, 6, 2, 4, WOOD[3]);
  g.rect(12, 6, 2, 4, WOOD[3]);
  // The bell hanging on its yoke between the arms.
  g.rect(7, 8, 3, 2, BRASS[1]);
  g.oval(8, 13, 4, 4, BRASS[2]);
  g.rect(4, 14, 9, 3, BRASS[2]);
  g.rect(3, 17, 11, 1, BRASS[1]);
  g.rect(5, 11, 2, 5, BRASS[3]);
  g.rect(8, 18, 2, 2, IRON[1]);
  g.outline(OUT);
  return g.rows();
}

// --- The bilge ---
// An iron-banded hatch with a ring, set in the floor: the way down into the bilge, shut.
function bilgeHatch(open) {
  const g = new Grid(16, 16);
  g.rect(1, 1, 14, 14, open ? '#040606' : WOOD[2]);
  g.rect(1, 1, 14, 1, open ? WOOD[3] : WOOD[4]);
  if (open) {
    g.rect(2, 3, 12, 11, '#030405');
    g.rect(4, 6, 8, 1, '#12201f');
    for (let y = 3; y < 14; y += 4) g.rect(3, y, 2, 2, WOOD[3]);
    g.rect(3, 3, 2, 11, WOOD[3]);
    g.rect(11, 3, 2, 11, WOOD[3]);
  } else {
    g.rect(1, 6, 14, 2, IRON[1]);
    g.rect(1, 6, 14, 1, IRON[2]);
    g.ring(8, 11, 2, IRON[3], 1);
    for (let x = 4; x < 14; x += 4) g.rect(x, 1, 1, 5, WOOD[1]);
  }
  g.outline(OUT);
  return g.rows();
}

// A pressure plate: the weigh-plate of the cargo scale, an iron plate in the deck with a notched rim. Flat.
function weighPlate(down) {
  const g = new Grid(16, 16);
  g.rect(1, 1, 14, 14, IRON[0]);
  g.rect(2, down ? 3 : 2, 12, down ? 11 : 12, IRON[down ? 1 : 2]);
  g.rect(2, down ? 3 : 2, 12, 1, IRON[3]);
  for (const [x, y] of [[3, 4], [12, 4], [3, 12], [12, 12]]) g.set(x, y, BRASS[2]);
  g.rect(6, 7, 4, 1, BRASS[1]);
  g.rect(7, 8, 2, 2, BRASS[2]);
  g.outline(OUT);
  return g.rows();
}

// A heavy iron ballast pig (a loose weight that slides when she leans), for the cargo scale.
function ballast() {
  const g = new Grid(16, 16);
  g.rect(1, 6, 14, 8, IRON[1]);
  g.rect(2, 4, 12, 3, IRON[2]);
  g.rect(2, 4, 12, 1, IRON[3]);
  g.rect(1, 13, 14, 1, IRON[0]);
  g.rect(3, 8, 3, 3, '#6a3a24');
  g.rect(9, 9, 4, 2, '#6a3a24');
  g.rect(5, 6, 6, 1, BRASS[1]);
  g.outline(OUT);
  return g.rows();
}

// The captain's key, on a nail in the bilge chest's lid: a long brass key with a ring of tarnished brass.
function keyHook() {
  const g = new Grid(16, 16);
  g.rect(3, 1, 10, 14, WOOD[2]);
  g.rect(3, 1, 10, 1, WOOD[4]);
  g.rect(3, 13, 10, 2, WOOD[0]);
  g.rect(7, 3, 2, 2, IRON[3]);
  g.ring(8, 7, 2, BRASS[2], 1);
  g.rect(8, 9, 1, 4, BRASS[2]);
  g.rect(9, 11, 2, 1, BRASS[2]);
  g.rect(9, 13, 2, 1, BRASS[1]);
  g.outline(OUT);
  return g.rows();
}

// --- Dressing for the deck and holds ---
// A coil of rope with a loose end trailing, flat.
function coil() {
  const g = new Grid(16, 16);
  for (let i = 0; i < 3; i++) { g.oval(7, 9, 6 - i * 2, 4 - i, ROPE[i % 2 ? 1 : 2]); g.oval(7, 9, 5 - i * 2, 3 - i, i === 2 ? '#14100c' : ROPE[0]); }
  g.oval(7, 9, 2, 1, '#14100c');
  g.line(12, 11, 15, 13, ROPE[2]);
  g.outline('rgba(10, 8, 6, 0.7)');
  return g.rows();
}

// A puddle of fog-water, spreading, with a ring in it (a drip). Flat.
function puddle(seed) {
  const g = new Grid(16, 16);
  g.oval(8, 8, 6 - seed, 3, 'rgba(14, 26, 28, 0.7)');
  g.oval(8, 8, 4 - seed, 2, 'rgba(24, 44, 46, 0.7)');
  g.rect(6, 7, 3, 1, 'rgba(150, 190, 186, 0.5)');
  g.rect(7, 9, 2, 1, 'rgba(150, 190, 186, 0.3)');
  return g.rows();
}

// A rail: a line of bulwark posts, a plank on top. For the plank room (flat, two tiles).
function railSegment() {
  const g = new Grid(32, 16);
  g.rect(0, 5, 32, 3, WOOD[3]);
  g.rect(0, 5, 32, 1, WOOD[4]);
  g.rect(0, 8, 32, 1, WOOD[0]);
  for (const x of [1, 14, 27]) { g.rect(x, 5, 4, 10, WOOD[2]); g.rect(x, 5, 1, 10, WOOD[3]); }
  g.outline(OUT);
  return g.rows();
}

// A hanging boarding plank: a gangway going up to the rail, two tiles, flat.
function gangway() {
  const g = new Grid(16, 32);
  g.rect(2, 0, 12, 32, WOOD[2]);
  for (let y = 0; y < 32; y += 4) { g.rect(2, y, 12, 1, WOOD[1]); g.rect(4, y + 2, 1, 1, IRON[2]); g.rect(11, y + 2, 1, 1, IRON[2]); }
  g.rect(2, 0, 1, 32, WOOD[3]);
  g.rect(13, 0, 1, 32, WOOD[0]);
  g.rect(0, 0, 2, 32, ROPE[1]);
  g.rect(14, 0, 2, 32, ROPE[1]);
  g.outline(OUT);
  return g.rows();
}

// The unlit lantern post on the quay: the ship's own gangway lantern, out (no floating lamp: its post is drawn).
function quayLamp() {
  const g = new Grid(16, 28);
  g.rect(7, 8, 3, 19, WOOD[2]);
  g.rect(7, 8, 1, 19, WOOD[3]);
  g.rect(5, 25, 7, 2, WOOD[1]);
  g.rect(8, 6, 4, 2, WOOD[3]);
  g.rect(11, 6, 2, 6, WOOD[3]);
  g.rect(10, 12, 5, 7, 'rgba(70, 86, 86, 0.8)');
  g.rect(10, 12, 5, 1, BRASS[1]);
  g.rect(10, 19, 5, 1, BRASS[1]);
  g.rect(11, 13, 3, 5, 'rgba(110, 130, 128, 0.6)');
  g.outline(OUT);
  return g.rows();
}

// A boarding quay's sign: SHIP'S BOARD. Used for the plank room's notice (a sign on a post is `sign`; this is the shipowner's plank).
function ownersBoard() {
  const g = new Grid(16, 22);
  g.rect(7, 10, 3, 12, WOOD[2]);
  g.rect(7, 10, 1, 12, WOOD[3]);
  g.rect(2, 3, 12, 9, WOOD[3]);
  g.rect(2, 3, 12, 1, WOOD[4]);
  for (let y = 5; y < 11; y += 2) g.rect(4, y, 8, 1, '#c8c2b0');
  g.rect(4, 5, 3, 1, '#e8e2d0');
  g.outline(OUT);
  return g.rows();
}

// A gunport in the planking: a square cut in the hull, its lid propped up, grey fog beyond (dark, no glow of its own).
function gunport(lidUp) {
  const g = new Grid(16, 16);
  g.rect(2, 3, 12, 11, WOOD[0]);
  g.rect(2, 3, 12, 1, WOOD[3]);
  g.rect(3, 4, 10, 9, '#2c3a3a');
  g.rect(3, 4, 10, 2, '#46585a');
  g.rect(5, 6, 6, 4, '#587070');
  g.rect(3, 12, 10, 1, WOOD[1]);
  if (lidUp) { g.rect(1, 0, 14, 3, WOOD[2]); g.rect(1, 0, 14, 1, WOOD[3]); g.rect(2, 2, 2, 2, IRON[2]); g.rect(12, 2, 2, 2, IRON[2]); }
  g.outline(OUT);
  return g.rows();
}

// The key's hook with the key gone (a bare nail in a board).
function keyHookBare() {
  const g = new Grid(16, 16);
  g.rect(3, 1, 10, 14, WOOD[2]);
  g.rect(3, 1, 10, 1, WOOD[4]);
  g.rect(3, 13, 10, 2, WOOD[0]);
  g.rect(7, 3, 2, 2, IRON[3]);
  g.rect(7, 5, 2, 1, IRON[2]);
  g.outline(OUT);
  return g.rows();
}

// A round porthole with its brass ring and a dead grey glass, set in a board wall.
function porthole() {
  const g = new Grid(16, 16);
  g.oval(8, 8, 6, 6, BRASS[1]);
  g.oval(8, 8, 5, 5, BRASS[2]);
  g.oval(8, 8, 4, 4, '#26343a');
  g.oval(8, 8, 3, 3, '#46585e');
  g.rect(6, 6, 2, 1, '#8aa0a2');
  g.rect(7, 4, 2, 1, BRASS[3]);
  g.outline(OUT);
  return g.rows();
}

// --- Atmosphere (flat things that lie on the floor, or hang on a rail, to give a room depth) ---
// The shadow of rigging across the planks: long thin diagonal bands, see-through dark. Flat, two tiles wide.
function rigShadow(seed) {
  const g = new Grid(32, 16);
  for (let i = 0; i < 4; i++) {
    const x0 = (i * 9 + seed * 5) % 28;
    g.line(x0, 0, x0 + 6 + seed, 15, 'rgba(0, 4, 6, 0.26)');
    g.line(x0 + 1, 0, x0 + 7 + seed, 15, 'rgba(0, 4, 6, 0.14)');
  }
  g.line(0, 5 + seed, 31, 9 - seed, 'rgba(0, 4, 6, 0.2)');
  return g.rows();
}

// A bank of fog, low, soft, ragged: pale ovals one over another. Flat, two tiles wide.
function fogWisp(seed) {
  const g = new Grid(32, 16);
  for (let i = 0; i < 5; i++) {
    const cx = 5 + ((i * 7 + seed * 3) % 22);
    const cy = 4 + ((i * 5 + seed) % 8);
    g.oval(cx, cy, 8 - (i % 3), 3, 'rgba(176, 208, 204, 0.07)');
    g.oval(cx + 1, cy, 5, 2, 'rgba(196, 224, 220, 0.09)');
  }
  return g.rows();
}

// A rail with a stretch gone: three posts, a plank across two of them, the third plank splintered off short.
function brokenRail() {
  const g = new Grid(32, 16);
  for (const x of [1, 14, 27]) { g.rect(x, 4, 3, 11, WOOD[2]); g.rect(x, 4, 1, 11, WOOD[3]); }
  g.rect(1, 6, 14, 2, WOOD[3]); g.rect(1, 6, 14, 1, WOOD[4]);
  g.rect(16, 6, 6, 2, WOOD[3]);
  g.set(22, 6, WOOD[3]); g.set(23, 5, WOOD[2]); g.set(22, 8, WOOD[1]);
  g.rect(24, 12, 5, 2, WOOD[1]); g.rect(25, 13, 4, 1, WOOD[3]);
  g.outline(OUT);
  return g.rows();
}

// A net draped over a rail's posts, sagging, a float or two caught in it.
function netDrape() {
  const g = new Grid(16, 16);
  g.rect(0, 2, 3, 13, WOOD[2]); g.rect(13, 2, 3, 13, WOOD[2]);
  g.rect(0, 2, 16, 2, WOOD[3]);
  for (let x = 2; x < 14; x += 2) { const s = Math.round(Math.sin(((x - 2) / 12) * Math.PI) * 4); g.line(x, 4, x, 7 + s, ROPE[1]); }
  for (let y = 5; y < 11; y += 2) for (let x = 2; x < 14; x++) { const s = Math.round(Math.sin(((x - 2) / 12) * Math.PI) * 3); if (y + s < 12) g.set(x, y + s, ROPE[0]); }
  g.rect(5, 9, 2, 2, '#8a3a2a'); g.rect(10, 8, 2, 2, '#8a3a2a');
  g.outline(OUT);
  return g.rows();
}

// A sail come down and left where it fell: folds, a torn edge, a rope through its eyelets. Flat, two tiles wide.
function sailHeap() {
  const g = new Grid(32, 16);
  g.oval(15, 9, 14, 5, CANVAS[0]);
  g.oval(14, 8, 11, 4, CANVAS[1]);
  for (const [x0, x1] of [[5, 12], [10, 20], [17, 26]]) g.line(x0, 7, x1, 11, CANVAS[0]);
  g.line(8, 5, 22, 6, CANVAS[2]);
  g.line(4, 12, 28, 12, ROPE[1]);
  for (const x of [8, 14, 20, 26]) g.set(x, 12, IRON[2]);
  g.outline('rgba(8, 8, 6, 0.6)');
  return g.rows();
}

// A boom come down: a long spar lying across the planks with its rope still on it. Flat, three tiles wide.
function fallenSpar() {
  const g = new Grid(48, 16);
  g.rect(1, 6, 44, 4, WOOD[2]);
  g.rect(1, 6, 44, 1, WOOD[4]);
  g.rect(1, 9, 44, 1, WOOD[0]);
  g.rect(45, 5, 2, 6, IRON[1]);
  g.rect(0, 6, 2, 4, WOOD[1]);
  g.line(10, 5, 22, 12, ROPE[1]);
  g.line(22, 12, 34, 10, ROPE[2]);
  g.rect(18, 10, 3, 2, ROPE[2]);
  g.outline(OUT);
  return g.rows();
}

// =====================================================================
// ART PASS 2: structure, clutter and the crew's sad things. Everything lies flat (walked over) or stands on a wall
// or a rail (never on a tile you could walk); each stands on something (a post, a peg, a hook, a bracket, the planks).
// =====================================================================
const MOSSG = ['#233a2c', '#2f4a34', '#3f6040'];
const COLD = ['#2c4e5c', '#5a8ea4', '#a8d8ea', '#e6faff'];

// Weed and moss stippled along the foot of something, `w` wide starting at x, standing on row y.
function mossFoot(g, x, y, w, seed = 0) {
  for (let i = 0; i < w; i++) {
    const h = 1 + ((i * 7 + seed * 3) % 3 === 0 ? 2 : (i + seed) % 2);
    for (let k = 0; k < h; k++) g.set(x + i, y - k, MOSSG[(i + k + seed) % 3]);
  }
}

// A knee: a timber standing on the wall's foot with a curved bracket reaching out along the beam above. Two tiles tall.
function hullKnee(flip = false) {
  const g = new Grid(16, 32);
  const X = (x) => (flip ? 15 - x : x);
  const R = (x, y, w, h, c) => g.rect(flip ? 16 - x - w : x, y, w, h, c);
  R(5, 6, 5, 26, WOOD[1]);
  R(5, 6, 1, 26, WOOD[2]);
  R(9, 6, 1, 26, WOOD[0]);
  R(2, 0, 13, 4, WOOD[2]);
  R(2, 0, 13, 1, WOOD[3]);
  R(2, 3, 13, 1, WOOD[0]);
  for (let i = 0; i < 6; i++) { R(9 - i, 4 + i, 1, 2, WOOD[2]); R(10 - i, 4 + i, 1, 1, WOOD[3]); }
  for (const y of [9, 17]) { g.set(X(7), y, IRON[3]); g.set(X(7), y + 1, '#6a3a24'); g.set(X(7), y + 2, '#4a2a1c'); }
  g.set(X(4), 1, IRON[3]);
  mossFoot(g, 4, 31, 7, flip ? 2 : 0);
  g.outline(OUT);
  return g.rows();
}

// A rail of belaying pins under the mast's bulwark: pins like teeth, a hank of line hung on two of them. Two tiles wide.
function pinRail() {
  const g = new Grid(32, 24);
  g.rect(0, 6, 32, 5, WOOD[2]);
  g.rect(0, 6, 32, 1, WOOD[4]);
  g.rect(0, 10, 32, 1, WOOD[0]);
  g.rect(2, 11, 3, 13, WOOD[1]); g.rect(27, 11, 3, 13, WOOD[1]);
  for (let x = 3; x < 30; x += 4) { g.rect(x, 11, 2, 4, WOOD[4]); g.set(x, 15, WOOD[3]); }
  g.line(7, 15, 8, 20, ROPE[2]); g.line(11, 15, 12, 21, ROPE[2]); g.rect(7, 19, 6, 2, ROPE[1]);
  g.line(12, 21, 14, 23, ROPE[2]);
  g.line(23, 15, 24, 18, ROPE[1]);
  g.outline(OUT);
  return g.rows();
}

// A rail post: a turned post with a cap, a worn rope eye, a stub of line.
function railPost() {
  const g = new Grid(16, 32);
  g.rect(6, 8, 4, 24, WOOD[2]);
  g.rect(6, 8, 1, 24, WOOD[3]);
  g.rect(9, 8, 1, 24, WOOD[0]);
  g.rect(5, 6, 6, 3, WOOD[3]);
  g.rect(5, 6, 6, 1, WOOD[4]);
  g.rect(6, 4, 4, 2, WOOD[2]);
  g.rect(7, 3, 2, 1, WOOD[3]);
  g.rect(4, 18, 8, 2, WOOD[1]);
  g.set(5, 22, IRON[3]); g.set(5, 23, IRON[2]); g.set(4, 23, IRON[2]);
  g.line(5, 24, 3, 28, ROPE[2]);
  g.rect(5, 29, 6, 3, WOOD[1]);
  mossFoot(g, 5, 31, 6, 1);
  g.outline(OUT);
  return g.rows();
}

// Bitts: two stout posts and a crossbar, a rope hitched round them in a figure of eight. One tile.
function bitts() {
  const g = new Grid(16, 24);
  g.rect(3, 8, 4, 16, WOOD[2]); g.rect(9, 8, 4, 16, WOOD[2]);
  g.rect(3, 8, 1, 16, WOOD[3]); g.rect(9, 8, 1, 16, WOOD[3]);
  g.rect(6, 8, 1, 16, WOOD[0]); g.rect(12, 8, 1, 16, WOOD[0]);
  g.rect(2, 7, 5, 2, WOOD[3]); g.rect(9, 7, 5, 2, WOOD[3]);
  g.rect(2, 12, 12, 3, WOOD[1]);
  g.rect(2, 12, 12, 1, WOOD[3]);
  g.line(4, 10, 11, 18, ROPE[2]); g.line(11, 10, 4, 18, ROPE[1]);
  g.line(5, 10, 12, 18, ROPE[1]);
  g.line(4, 18, 2, 23, ROPE[2]);
  g.outline(OUT);
  return g.rows();
}

// A capstan: a drum with a rope round it, bar-holes, a pawl ring at its foot. One tile.
function capstan() {
  const g = new Grid(16, 24);
  g.rect(5, 6, 6, 14, WOOD[2]);
  g.rect(5, 6, 1, 14, WOOD[3]);
  g.rect(10, 6, 1, 14, WOOD[0]);
  g.oval(8, 5, 6, 2, WOOD[3]);
  g.oval(8, 5, 4, 1, WOOD[4]);
  g.set(5, 5, WOOD[0]); g.set(11, 5, WOOD[0]); g.set(8, 4, WOOD[1]);
  g.rect(3, 19, 10, 3, IRON[1]); g.rect(3, 19, 10, 1, IRON[2]);
  g.rect(2, 21, 12, 2, WOOD[1]);
  for (let y = 9; y < 17; y += 2) { g.rect(5, y, 6, 1, ROPE[1]); g.rect(5, y + 1, 6, 1, ROPE[2]); }
  g.line(10, 4, 15, 1, WOOD[3]);
  g.rect(5, 14, 6, 1, IRON[2]);
  g.outline(OUT);
  return g.rows();
}

// A cold lantern on a bracket out from the wall: iron arm, chain, glass. Two tiles tall, one wide.
function wallLantern() {
  const g = new Grid(16, 32);
  g.rect(0, 20, 4, 12, WOOD[2]);
  g.rect(0, 20, 1, 12, WOOD[3]);
  g.rect(0, 8, 14, 2, IRON[1]); g.rect(0, 8, 14, 1, IRON[2]);
  g.line(0, 24, 6, 9, IRON[1]);
  g.rect(3, 4, 1, 4, IRON[2]);
  g.set(3, 4, IRON[3]);
  g.rect(9, 10, 1, 2, IRON[2]);
  g.rect(7, 12, 5, 1, IRON[3]);
  g.rect(7, 13, 5, 7, 'rgba(112, 190, 230, 0.9)');
  g.rect(8, 14, 3, 5, COLD[3]);
  g.rect(9, 15, 1, 3, '#ffffff');
  g.rect(7, 13, 1, 7, IRON[1]); g.rect(11, 13, 1, 7, IRON[1]);
  g.rect(7, 20, 5, 1, IRON[1]);
  g.outline(OUT);
  return g.rows();
}

// A stern window: the curve of the captain's cabin, three tall panes in a lead frame, fog beyond, a pane cracked, a scrap of curtain.
// Three tiles wide, three tall (stands on the wall's foot).
function sternWindow() {
  const g = new Grid(48, 48);
  g.rect(0, 0, 48, 48, WOOD[1]);
  g.rect(0, 0, 48, 2, WOOD[3]);
  g.rect(0, 0, 48, 1, WOOD[4]);
  for (let i = 0; i < 3; i++) {
    const x0 = 3 + i * 15;
    g.rect(x0, 8, 12, 34, '#1a2e34');
    g.oval(x0 + 6, 8, 6, 4, '#1a2e34');
    g.rect(x0 + 1, 10, 10, 31, '#4a6e72');
    g.oval(x0 + 6, 9, 5, 3, '#4a6e72');
    for (let y = 12; y < 40; y += 5) g.rect(x0 + 1, y, 10, 2, i % 2 ? '#6e9490' : '#7aa09a');
    g.rect(x0 + 6, 8, 1, 33, IRON[1]);
    g.rect(x0, 24, 12, 1, IRON[1]);
    g.rect(x0 + 1, 10, 1, 31, '#8ab4b0');
    g.rect(x0 - 1, 41, 14, 3, WOOD[3]);
    g.rect(x0 - 1, 41, 14, 1, WOOD[4]);
    g.rect(x0 + 3, 44, 1, 3, 'rgba(10, 24, 28, 0.8)');
  }
  g.line(20, 12, 24, 24, '#162428'); g.line(24, 24, 22, 34, '#162428'); g.line(24, 24, 28, 28, '#162428');
  g.rect(35, 30, 5, 5, '#05080a'); g.rect(36, 29, 3, 1, '#05080a');
  g.rect(31, 8, 14, 1, BRASS[1]);
  g.rect(32, 9, 3, 9, '#5a4a52'); g.rect(32, 9, 1, 9, '#6e5c66'); g.rect(33, 17, 2, 2, '#3a2e34'); g.set(34, 19, '#3a2e34');
  g.rect(42, 9, 2, 5, '#5a4a52');
  g.rect(0, 44, 48, 4, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

// A hatch grating: iron-bound lattice over a black well. Flat.
function grating() {
  const g = new Grid(16, 16);
  g.rect(1, 2, 14, 12, '#05080a');
  for (let x = 3; x < 14; x += 3) { g.rect(x, 2, 1, 12, WOOD[2]); g.rect(x + 1, 2, 1, 12, WOOD[0]); }
  for (let y = 4; y < 13; y += 4) g.rect(1, y, 14, 1, WOOD[1]);
  g.rect(0, 1, 16, 2, IRON[1]); g.rect(0, 13, 16, 2, IRON[1]);
  g.rect(0, 1, 16, 1, IRON[2]);
  g.set(1, 1, IRON[3]); g.set(14, 1, IRON[3]); g.set(1, 14, IRON[3]); g.set(14, 14, IRON[3]);
  g.set(5, 13, '#6a3a24'); g.set(5, 14, '#4a2a1c');
  g.outline(OUT);
  return g.rows();
}

// A cutlass dropped on the planks, a hundred years of damp on the blade. Flat.
function cutlass() {
  const g = new Grid(16, 16);
  g.line(2, 11, 12, 6, '#5a6a6c');
  g.line(2, 12, 12, 7, '#2a3436');
  g.line(3, 11, 9, 8, '#9aaeb0');
  g.rect(11, 4, 2, 6, BRASS[1]);
  g.rect(13, 6, 2, 2, WOOD[1]);
  g.set(11, 4, BRASS[2]); g.set(12, 9, BRASS[2]);
  g.set(5, 11, '#6a3a24'); g.set(6, 10, '#6a3a24');
  g.outline('rgba(6, 8, 8, 0.7)');
  return g.rows();
}

// Two bottles and a broken neck, glass catching the cold light. Flat.
function bottles() {
  const g = new Grid(16, 16);
  g.rect(2, 9, 8, 3, '#3a5a46'); g.rect(10, 10, 3, 1, '#3a5a46'); g.rect(1, 10, 1, 1, '#3a5a46');
  g.rect(3, 9, 5, 1, '#7aa88a'); g.set(4, 10, '#c6e8d6');
  g.rect(5, 4, 4, 5, '#26402f'); g.rect(6, 1, 2, 3, '#26402f'); g.set(6, 1, '#7aa88a'); g.set(6, 5, '#7aa88a');
  g.set(12, 7, '#7aa88a'); g.set(13, 8, '#3a5a46'); g.set(11, 13, '#7aa88a'); g.set(14, 12, '#3a5a46');
  g.outline('rgba(4, 10, 8, 0.7)');
  return g.rows();
}

// One shoe, kicked off and never fetched. Flat.
function shoe() {
  const g = new Grid(16, 16);
  g.oval(8, 10, 5, 2, '#34261c');
  g.rect(3, 8, 5, 3, '#34261c'); g.rect(3, 8, 5, 1, '#4c3a2a');
  g.rect(9, 9, 4, 3, '#241a12');
  g.rect(4, 7, 3, 1, '#241a12');
  g.rect(5, 9, 2, 1, '#8a8470');
  g.set(8, 8, BRASS[1]);
  g.rect(11, 12, 3, 1, '#14100c');
  g.outline('rgba(6, 6, 6, 0.7)');
  return g.rows();
}

// A cloth doll face down in the wet, one button eye. Flat.
function doll() {
  const g = new Grid(16, 16);
  g.rect(3, 9, 8, 4, '#6a5a64'); g.rect(3, 9, 8, 1, '#8a7a84');
  g.rect(11, 8, 3, 3, '#a89a84'); g.set(12, 9, '#14100c'); g.set(13, 9, '#14100c');
  g.rect(10, 7, 3, 1, '#4a3a2a'); g.set(13, 7, '#4a3a2a');
  g.rect(1, 10, 3, 2, '#a89a84'); g.rect(2, 13, 3, 1, '#a89a84');
  g.set(5, 11, '#d8d2c0');
  g.outline('rgba(6, 6, 6, 0.7)');
  return g.rows();
}

// An unsent letter with the seal still red, damp at one corner. Flat.
function letterDropped() {
  const g = new Grid(16, 16);
  g.rect(3, 6, 10, 7, '#9a9886');
  g.rect(3, 6, 10, 1, '#b8b6a2');
  g.rect(3, 12, 10, 1, '#6a6a5a');
  g.line(4, 8, 10, 8, '#4a4a3e'); g.line(4, 10, 9, 10, '#4a4a3e');
  g.rect(10, 9, 3, 3, '#7a2a2a'); g.set(11, 10, '#a84a3a');
  g.rect(3, 11, 3, 2, '#5a6a64');
  g.outline('rgba(6, 6, 6, 0.6)');
  return g.rows();
}

// A sack split open, meal or ballast sand run out across the boards. Flat.
function sackSpill() {
  const g = new Grid(16, 16);
  g.oval(6, 8, 5, 4, '#6a5c42'); g.oval(6, 8, 4, 3, '#7e6e50');
  g.rect(2, 7, 2, 3, '#4a3e2a'); g.line(3, 6, 9, 5, '#4a3e2a'); g.line(5, 12, 10, 13, '#4a3e2a');
  g.rect(9, 8, 6, 3, '#8a8264'); g.rect(11, 11, 4, 1, '#8a8264'); g.rect(10, 7, 3, 1, '#8a8264');
  for (const [x, y] of [[12, 12], [14, 9], [8, 13], [15, 11]]) g.set(x, y, '#a89e7c');
  g.outline('rgba(6, 6, 6, 0.55)');
  return g.rows();
}

// A bucket on its side, a tongue of water run from it, a swab beside. Flat.
function bucket() {
  const g = new Grid(16, 16);
  g.oval(11, 12, 4, 2, 'rgba(14, 26, 28, 0.7)'); g.rect(9, 11, 3, 1, 'rgba(150, 190, 186, 0.4)');
  g.rect(2, 6, 7, 6, WOOD[2]); g.rect(2, 6, 7, 1, WOOD[3]);
  g.rect(2, 8, 7, 1, IRON[2]); g.rect(2, 11, 7, 1, IRON[2]);
  g.rect(1, 7, 1, 4, WOOD[0]); g.rect(2, 7, 1, 4, '#05080a');
  g.line(4, 5, 8, 3, IRON[2]);
  g.line(8, 13, 14, 14, ROPE[1]); g.rect(13, 13, 2, 2, ROPE[2]);
  g.outline('rgba(6, 6, 6, 0.65)');
  return g.rows();
}

// A net heaped where the last man dropped it, floats and a knot of weed in it. Flat, two tiles wide.
function netHeap() {
  const g = new Grid(32, 16);
  g.oval(15, 9, 13, 5, ROPE[0]);
  g.oval(14, 8, 11, 4, '#4a4030');
  for (let x = 4; x < 27; x += 3) g.line(x, 5, x + 4, 12, ROPE[1]);
  for (let x = 27; x > 5; x -= 3) g.line(x, 5, x - 4, 12, ROPE[2]);
  for (const [x, y] of [[8, 8], [17, 6], [23, 10], [12, 11]]) { g.rect(x, y, 2, 2, '#8a3a2a'); g.set(x, y, '#c0604a'); }
  g.rect(19, 9, 4, 2, '#2f4a34'); g.set(20, 11, '#3f6040'); g.set(23, 8, '#3f6040');
  g.line(25, 11, 31, 13, ROPE[1]);
  g.outline('rgba(6, 6, 6, 0.55)');
  return g.rows();
}

// A strand of weed come aboard on the swell and left, flat on the planks.
function weedStrand(seed = 0) {
  const g = new Grid(16, 16);
  for (let i = 0; i < 4; i++) {
    const y = 4 + i * 3 + seed;
    for (let x = 1; x < 15; x++) g.set(x, y + Math.round(Math.sin((x + i * 2 + seed) * 0.8)), MOSSG[(i + x) % 3 === 0 ? 2 : i % 2]);
  }
  g.set(3, 9, '#5a7a50'); g.set(10, 6, '#5a7a50'); g.set(12, 12, '#5a7a50');
  return g.rows();
}

// A wedge ring of timber round the mast's foot, clamped with iron, pins stuck in it all round. Flat, one tile (under the mast).
function mastStep() {
  const g = new Grid(16, 16);
  g.oval(8, 10, 8, 5, WOOD[1]);
  g.oval(8, 10, 7, 4, WOOD[2]);
  g.oval(8, 10, 5, 3, WOOD[1]);
  g.oval(8, 9, 4, 2, IRON[1]);
  g.rect(4, 10, 8, 1, IRON[2]);
  for (const x of [1, 3, 12, 14]) { g.rect(x, 9, 2, 2, WOOD[4]); g.set(x, 9, WOOD[3]); }
  for (const x of [3, 7, 11]) g.set(x, 14, IRON[3]);
  g.set(2, 13, '#6a3a24'); g.set(13, 13, '#6a3a24'); g.set(13, 14, '#4a2a1c');
  g.outline('rgba(6, 6, 6, 0.55)');
  return g.rows();
}

// A smashed crate, slats flung out. Flat.
function crateSmashed() {
  const g = new Grid(16, 16);
  g.rect(2, 8, 8, 5, WOOD[1]); g.rect(2, 8, 8, 1, WOOD[3]);
  g.rect(4, 9, 1, 4, WOOD[0]); g.rect(7, 9, 1, 4, WOOD[0]);
  g.line(9, 7, 15, 4, WOOD[2]); g.line(9, 8, 15, 5, WOOD[3]);
  g.line(11, 13, 15, 12, WOOD[2]); g.rect(12, 9, 3, 1, WOOD[1]);
  g.set(2, 8, IRON[3]); g.set(9, 12, IRON[3]);
  g.outline('rgba(6, 6, 6, 0.65)');
  return g.rows();
}

// A cobweb in a corner, grey thread beaded with damp; `left` for a left-hand corner. Flat.
function web(left) {
  const g = new Grid(16, 16);
  const X = (x) => (left ? x : 15 - x);
  for (let i = 0; i < 5; i++) g.line(X(0), 0, X(i * 3 + 2), 14, 'rgba(170, 190, 186, 0.3)');
  for (const r of [4, 8, 12]) for (let a = 0; a <= 90; a += 18) {
    const x = Math.round(Math.cos((a * Math.PI) / 180) * r);
    const y = Math.round(Math.sin((a * Math.PI) / 180) * r);
    g.set(X(x), y, 'rgba(190, 210, 206, 0.45)');
  }
  g.set(X(5), 8, '#d8f0ea'); g.set(X(9), 5, '#d8f0ea');
  return g.rows();
}

// A cask staved in, the staves splayed and a puddle round it. Flat.
function barrelStaves() {
  const g = new Grid(16, 16);
  g.oval(8, 11, 6, 3, 'rgba(14, 26, 28, 0.6)');
  g.oval(7, 9, 5, 3, WOOD[0]);
  g.oval(7, 8, 5, 3, WOOD[2]);
  g.oval(7, 8, 3, 2, '#05080a');
  for (const [x0, y0, x1, y1] of [[1, 9, 4, 5], [12, 8, 15, 5], [3, 13, 0, 11], [11, 13, 15, 14]]) { g.line(x0, y0, x1, y1, WOOD[3]); g.line(x0, y0 + 1, x1, y1 + 1, WOOD[1]); }
  g.rect(2, 7, 11, 1, IRON[2]);
  g.outline('rgba(6, 6, 6, 0.65)');
  return g.rows();
}

// A captain's cocked hat, brim wet, left on the floor. Flat.
function tricorn() {
  const g = new Grid(16, 16);
  g.oval(8, 10, 6, 3, '#1c1a20');
  g.rect(3, 8, 10, 3, '#26222c');
  g.rect(4, 6, 3, 3, '#26222c'); g.rect(9, 6, 3, 3, '#26222c');
  g.line(3, 8, 7, 6, '#3a3640'); g.line(12, 8, 9, 6, '#3a3640');
  g.rect(7, 9, 2, 2, BRASS[1]); g.set(7, 9, BRASS[3]);
  g.outline('rgba(6, 6, 6, 0.6)');
  return g.rows();
}

// A dropped lantern, glass broken, the wick drowned. Flat.
function lanternSmashed() {
  const g = new Grid(16, 16);
  g.rect(3, 9, 8, 4, IRON[1]); g.rect(3, 9, 8, 1, IRON[2]);
  g.rect(2, 8, 2, 6, BRASS[1]); g.rect(10, 8, 2, 6, BRASS[1]);
  g.rect(4, 10, 6, 3, '#10181a');
  for (const [x, y] of [[12, 12], [13, 10], [14, 13], [1, 14], [6, 14]]) g.set(x, y, '#a8d8ea');
  g.line(11, 7, 14, 3, IRON[2]);
  g.outline('rgba(6, 6, 6, 0.65)');
  return g.rows();
}

// A post that stands up out of the sea side of the rail with stays running off into the fog. Tall; stands on a rail tile.
function stayMast() {
  const g = new Grid(16, 48);
  g.rect(6, 10, 4, 38, WOOD[1]);
  g.rect(6, 10, 1, 38, WOOD[2]);
  g.rect(9, 10, 1, 38, WOOD[0]);
  g.rect(5, 8, 6, 3, IRON[1]); g.rect(5, 8, 6, 1, IRON[2]);
  g.rect(4, 22, 8, 3, IRON[1]); g.rect(4, 22, 8, 1, IRON[2]);
  g.line(8, 9, 1, 0, ROPE[1]); g.line(8, 9, 15, 0, ROPE[1]);
  g.line(8, 24, 15, 16, ROPE[0]);
  g.set(1, 1, IRON[3]);
  g.rect(5, 44, 6, 4, WOOD[0]);
  mossFoot(g, 5, 47, 6, 2);
  g.outline(OUT);
  return g.rows();
}

// Deadeyes lashed on the rail: three wooden discs on iron straps, lanyards threaded between. One tile.
function deadeyes() {
  const g = new Grid(16, 24);
  g.rect(0, 14, 16, 10, WOOD[1]);
  g.rect(0, 14, 16, 1, WOOD[3]);
  for (const x of [3, 8, 13]) {
    g.oval(x, 6, 2, 2, WOOD[3]); g.set(x, 6, '#05080a');
    g.rect(x, 8, 1, 7, IRON[2]);
    g.oval(x, 18, 2, 2, WOOD[3]); g.set(x, 18, '#05080a');
  }
  g.line(3, 8, 8, 16, ROPE[2]); g.line(8, 8, 13, 16, ROPE[2]); g.line(3, 16, 8, 8, ROPE[1]);
  g.rect(0, 21, 16, 3, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

// A hammock slung empty, sagging, a shape still pressed into it. Hung from two posts on the wall's foot, two wide.
function hammockSag() {
  const g = new Grid(32, 24);
  g.rect(0, 2, 3, 22, WOOD[2]); g.rect(29, 2, 3, 22, WOOD[2]);
  g.rect(0, 2, 1, 22, WOOD[3]);
  g.rect(2, 4, 2, 2, IRON[3]); g.rect(28, 4, 2, 2, IRON[3]);
  for (let x = 3; x < 29; x++) {
    const sag = Math.round(Math.sin(((x - 3) / 25) * Math.PI) * 9);
    g.set(x, 6 + sag, CANVAS[1]);
    g.set(x, 7 + sag, CANVAS[1]);
    g.set(x, 8 + sag, CANVAS[0]);
    g.set(x, 9 + sag, '#3a362c');
  }
  g.line(3, 5, 3, 7, ROPE[2]); g.line(28, 5, 28, 7, ROPE[2]);
  g.rect(12, 12, 8, 2, '#5a564a');
  g.rect(14, 10, 4, 2, '#4a463a');
  g.outline(OUT);
  return g.rows();
}

const ART2_SPRITES = {
  gs_knee: hullKnee(false),
  gs_knee_r: hullKnee(true),
  gs_pin_rail: pinRail(),
  gs_rail_post: railPost(),
  gs_bitts: bitts(),
  gs_capstan: capstan(),
  gs_wall_lantern: wallLantern(),
  gs_stern_window: sternWindow(),
  gs_grating: grating(),
  gs_cutlass: cutlass(),
  gs_bottles: bottles(),
  gs_shoe: shoe(),
  gs_doll: doll(),
  gs_letter_dropped: letterDropped(),
  gs_sack_spill: sackSpill(),
  gs_bucket: bucket(),
  gs_net_heap: netHeap(),
  gs_weed_a: weedStrand(0),
  gs_weed_b: weedStrand(2),
  gs_mast_step: mastStep(),
  gs_crate_smashed: crateSmashed(),
  gs_web_l: web(true),
  gs_web_r: web(false),
  gs_barrel_staves: barrelStaves(),
  gs_tricorn: tricorn(),
  gs_lantern_smashed: lanternSmashed(),
  gs_stay_mast: stayMast(),
  gs_deadeyes: deadeyes(),
  gs_hammock_sag: hammockSag(),
};
const ART2_FOOTPRINTS = { gs_pin_rail: 2, gs_stern_window: 3, gs_net_heap: 2, gs_hammock_sag: 2 };

// The animations (each its own export: the engine finds NAME_SPRITES and plays NAME).
export const GS_GHOST_RAIL_SPRITES = { f1: sailorAtRail(0), f2: sailorAtRail(1) };
export const GS_GHOST_BOY_SPRITES = { f1: boyCoiling(0), f2: boyCoiling(1) };
export const GS_GHOST_OLD_SPRITES = { f1: oldHand(0), f2: oldHand(1) };
export const GS_GHOST_SLEEPER_SPRITES = { f1: sleeper(0), f2: sleeper(1) };
export const GS_GHOST_LOOKOUT_SPRITES = { f1: lookout(0), f2: lookout(1) };
export const GS_GHOST_MATE_SPRITES = { f1: mate(0), f2: mate(1) };
export const GS_LANTERN_SPRITES = { f1: lantern(0), f2: lantern(1) };
export const GS_CHAIR_SPRITES = { f1: chair(0), f2: chair(1) };

export const GS_PROP_SPRITES = {
  gs_helm: helm(),
  gs_trim_line: trimLine(),
  gs_crank: crank(),
  gs_tackle: tackle(),
  gs_mast: mast(),
  gs_ratlines: ratlines(),
  gs_hatch: hatch(false),
  gs_hatch_shut: hatch(true),
  gs_ladder: ladder(),
  gs_cannon: cannon(false),
  gs_cannon_l: cannon(true),
  gs_shot: shot(),
  gs_ghost_rail: GS_GHOST_RAIL_SPRITES.f1,
  gs_ghost_boy: GS_GHOST_BOY_SPRITES.f1,
  gs_ghost_old: GS_GHOST_OLD_SPRITES.f1,
  gs_ghost_sleeper: GS_GHOST_SLEEPER_SPRITES.f1,
  gs_ghost_lookout: GS_GHOST_LOOKOUT_SPRITES.f1,
  gs_ghost_mate: GS_GHOST_MATE_SPRITES.f1,
  gs_prints_a: prints(0),
  gs_prints_b: prints(1),
  gs_handprint: handprint(),
  gs_chalk: chalk(),
  gs_ghost_ring: ghostRing(),
  gs_ghost_door: ghostDoor(),
  gs_portrait_wife: portrait('wife'),
  gs_portrait_boy: portrait('boy'),
  gs_portrait_captain: portrait('captain'),
  gs_harm_1: harmonium(0, false),
  gs_harm_1_on: harmonium(0, true),
  gs_harm_2: harmonium(1, false),
  gs_harm_2_on: harmonium(1, true),
  gs_harm_3: harmonium(2, false),
  gs_harm_3_on: harmonium(2, true),
  gs_harm_4: harmonium(3, false),
  gs_harm_4_on: harmonium(3, true),
  gs_cabin_door: cabinDoor(false),
  gs_cabin_door_open: cabinDoor(true),
  gs_bulk_door: bulkDoor(),
  gs_lantern: GS_LANTERN_SPRITES.f1,
  gs_lantern_hook: lanternHook(),
  gs_chart_table: chartTable(),
  gs_bunk: bunk(),
  gs_trunk: trunk(),
  gs_chair: GS_CHAIR_SPRITES.f1,
  gs_log_desk: logDesk(),
  gs_letter_rack: letterRack(),
  gs_post_bag: postBag(),
  gs_letters_pile: lettersPile(),
  gs_nameboard: nameboard(),
  gs_ship_bell: shipBell(),
  gs_bilge_hatch: bilgeHatch(false),
  gs_bilge_hatch_open: bilgeHatch(true),
  gs_weigh_plate: weighPlate(false),
  gs_weigh_plate_on: weighPlate(true),
  gs_ballast: ballast(),
  gs_key_hook: keyHook(),
  gs_key_hook_bare: keyHookBare(),
  gs_coil: coil(),
  gs_puddle: puddle(0),
  gs_puddle_b: puddle(1),
  gs_rail_segment: railSegment(),
  gs_gangway: gangway(),
  gs_quay_lamp: quayLamp(),
  gs_owners_board: ownersBoard(),
  gs_shadow_a: rigShadow(0),
  gs_shadow_b: rigShadow(1),
  gs_fog_a: fogWisp(0),
  gs_fog_b: fogWisp(1),
  gs_fog_c: fogWisp(2),
  gs_rail_broken: brokenRail(),
  gs_net_drape: netDrape(),
  gs_sail_heap: sailHeap(),
  gs_spar_fallen: fallenSpar(),
  gs_post_lantern: lantern(0, true),
  gs_gunport: gunport(false),
  gs_gunport_up: gunport(true),
  gs_porthole: porthole(),
  gs_compass_glass: compassGlass(),
  gs_compass_needle: compassNeedle(),
  gs_compass_card: compassCard(),
  gs_binnacle: binnacle(false),
  gs_binnacle_set: binnacle(true),
  gs_pig: ballastPig(),
  gs_bale: sailBale(),
  gs_figurehead: figurehead(true),
  gs_figurehead_dark: figurehead(false),
  ...ART2_SPRITES,
};

export const GS_PALETTE = palette;
// How many tiles wide each stands, for the wide ones.
export const GS_FOOTPRINTS = {
  gs_helm: 2, gs_hatch: 2, gs_hatch_shut: 2, gs_ghost_sleeper: 2, gs_chalk: 2, gs_chart_table: 2, gs_bunk: 2,
  gs_log_desk: 2, gs_letter_rack: 2, ...ART2_FOOTPRINTS, gs_nameboard: 3, gs_figurehead: 2, gs_figurehead_dark: 2, gs_shadow_a: 2, gs_shadow_b: 2, gs_fog_a: 2, gs_fog_b: 2, gs_fog_c: 2, gs_rail_broken: 2, gs_sail_heap: 2, gs_spar_fallen: 3, gs_ratlines: 2, gs_rail_segment: 2,
};

// What glows (lamplight.js): the lantern on its hook, and a harmonium key that has been pressed. The
// ghosts give no light: they are only there in the lantern's.
const LANTERN_LIGHT = '255, 214, 140';
export const GS_GLOWS = {
  gs_lantern: [
    { dy: -14, bloom: 12, strength: 0.6, flicker: 0.3, color: LANTERN_LIGHT },
    { dy: -6, pool: 52, strength: 0.5, flicker: 0.25, color: LANTERN_LIGHT },
  ],
  // Cold on purpose: blue-white, no warmth in it at all (the one lantern you take is the only warm light on the ship).
  gs_post_lantern: [
    { dy: -14, bloom: 12, strength: 0.55, flicker: 0.1, color: '170, 226, 255' },
    { dy: -6, pool: 52, strength: 0.46, flicker: 0.08, color: '120, 190, 255' },
  ],
  gs_wall_lantern: [
    { dy: -12, bloom: 12, strength: 0.55, flicker: 0.1, color: '170, 226, 255' },
    { dy: -4, pool: 56, strength: 0.5, flicker: 0.08, color: '120, 190, 255' },
  ],
  // The stern window: a cold fog-light coming in, never warm.
  gs_figurehead: [{ dy: -26, bloom: 14, strength: 0.75, flicker: 0.12, color: '150, 210, 255' }, { dy: -14, pool: 60, strength: 0.5, flicker: 0.1, color: '120, 190, 255' }],
  gs_stern_window: [{ dy: -10, pool: 70, strength: 0.34, flicker: 0, color: '110, 170, 210' }],
  gs_harm_1_on: [{ dy: -4, pool: 26, strength: 0.25, flicker: 0.1, color: '200, 230, 220' }],
  gs_harm_2_on: [{ dy: -4, pool: 26, strength: 0.25, flicker: 0.1, color: '200, 230, 220' }],
  gs_harm_3_on: [{ dy: -4, pool: 26, strength: 0.25, flicker: 0.1, color: '200, 230, 220' }],
  gs_harm_4_on: [{ dy: -4, pool: 26, strength: 0.25, flicker: 0.1, color: '200, 230, 220' }],
};
