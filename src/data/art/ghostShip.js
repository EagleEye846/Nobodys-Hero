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

  // A filled polygon (the fog bell's flare), from its corner points.
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
// The crew: pale, a cold sea-green, a little see-through (the dark wood shows faintly through them),
// a dark line round each so the shape reads against the boards, and outside that a soft rim of their
// own cold light (ghostFinish). Their eyes are dark points, so a face reads even small.
const GHOST = ['rgba(64, 124, 120, 0.82)', 'rgba(128, 200, 188, 0.88)', 'rgba(188, 240, 226, 0.92)', 'rgba(236, 255, 250, 0.96)'];
const GHOST_OUT = 'rgba(6, 28, 30, 0.85)';
const GHOST_RIM = 'rgba(150, 255, 230, 0.3)';
const GHOST_EYE = 'rgba(4, 22, 24, 0.95)';
function ghostFinish(g) {
  g.outline(GHOST_OUT);
  g.outline(GHOST_RIM);
}
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
  // Turned a little: an ear and the edge of a cheek, one eye looking out to sea.
  g.set(11, 7 + b, GHOST[3]);
  g.set(10, 6 + b, GHOST_EYE);
  ghostFinish(g);
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
  g.rect(6, 5, 1, 1, GHOST_EYE);
  g.rect(8, 5, 1, 1, GHOST_EYE);
  ghostFinish(g);
  return g.rows();
}

// The same boy on his feet at the rail, waving (the Fair Return sailing off, crew_go_free): one arm up and
// going side to side, the other on the rail. (2026-11-14)
function boyWaving(f) {
  const g = new Grid(16, 22);
  g.oval(7, 5, 3, 3, GHOST[2]);
  g.rect(5, 3, 5, 1, GHOST[3]);
  // A jersey, a little big for him.
  g.rect(4, 9, 7, 7, GHOST[2]);
  g.rect(4, 9, 7, 1, GHOST[3]);
  g.rect(4, 12, 7, 1, GHOST[1]);
  // The arm on the rail (his left), the waving one up (his right): over his head, then out to the side.
  g.rect(2, 10, 2, 5, GHOST[1]);
  if (f) { g.rect(11, 6, 2, 4, GHOST[1]); g.rect(12, 3, 3, 3, GHOST[3]); }
  else { g.rect(11, 5, 2, 5, GHOST[1]); g.rect(10, 2, 3, 3, GHOST[3]); }
  // Thinning out to nothing below the knee.
  g.rect(5, 16, 5, 2, GHOST[1]);
  g.rect(6, 18, 3, 2, GHOST[0]);
  g.set(6, 5, GHOST_EYE);
  g.set(8, 5, GHOST_EYE);
  // Grinning.
  g.rect(6, 7, 3, 1, GHOST_EYE);
  ghostFinish(g);
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
  g.set(6, 5, GHOST_EYE);
  g.set(9, 5, GHOST_EYE);
  ghostFinish(g);
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
  // Eyes shut.
  g.set(9, 7, GHOST_EYE);
  g.set(11, 7, GHOST_EYE);
  ghostFinish(g);
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
  g.set(8, 4 + b, GHOST_EYE);
  g.set(11, 4 + b, GHOST_EYE);
  ghostFinish(g);
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
  g.set(6, 5 + b, GHOST_EYE);
  g.set(10, 5 + b, GHOST_EYE);
  ghostFinish(g);
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

// Chalk with a word (and an arrow) on it, big enough to read in passing: the sail locker's alcove names, the flooded
// bow's plank marks. Same chalk as the tallies, 3 x 5 capitals.
const CHALK_FONT = {
  A: ['.#.', '#.#', '###', '#.#', '#.#'], B: ['##.', '#.#', '##.', '#.#', '##.'], E: ['###', '#..', '##.', '#..', '###'],
  F: ['###', '#..', '##.', '#..', '#..'], I: ['###', '.#.', '.#.', '.#.', '###'], J: ['..#', '..#', '..#', '#.#', '.#.'],
  L: ['#..', '#..', '#..', '#..', '###'], M: ['#.#', '###', '###', '#.#', '#.#'], N: ['#.#', '###', '###', '###', '#.#'],
  O: ['###', '#.#', '#.#', '#.#', '###'], P: ['##.', '#.#', '##.', '#..', '#..'], R: ['##.', '#.#', '##.', '#.#', '#.#'],
  S: ['.##', '#..', '.#.', '..#', '##.'], T: ['###', '.#.', '.#.', '.#.', '.#.'], "'": ['.#.', '.#.', '...', '...', '...'],
};
const CHALK_ARROWS = {
  up: ['..#..', '.###.', '#.#.#', '..#..', '..#..'],
  down: ['..#..', '..#..', '#.#.#', '.###.', '..#..'],
  right: ['..#..', '...#.', '#####', '...#.', '..#..'],
};
function chalkWord(word, arrow = null) {
  const g = new Grid(32, 16);
  const put = (x, y, rows, color) => rows.forEach((r, j) => [...r].forEach((c, i) => c === '#' && g.set(x + i, y + j, color)));
  const letters = [...word];
  const width = letters.length * 4 - 1 + (arrow ? 7 : 0);
  let x = Math.max(1, Math.floor((32 - width) / 2));
  if (arrow) {
    put(x, 6, CHALK_ARROWS[arrow], TRACE[2]);
    x += 7;
  }
  for (const c of letters) {
    put(x, 6, CHALK_FONT[c], TRACE[2]);
    x += c === "'" ? 2 : 4;
  }
  // A line under it, gone over twice.
  g.rect(Math.max(1, Math.floor((32 - width) / 2)), 13, width, 1, TRACE[1]);
  return g.rows();
}

// A nook between two stacks of cargo: the dark at the back of it, one tile.
function nook() {
  const g = new Grid(16, 16);
  g.rect(1, 0, 14, 16, 'rgba(0, 0, 0, 0.28)');
  g.rect(3, 0, 10, 15, 'rgba(0, 0, 0, 0.3)');
  g.rect(5, 0, 6, 13, 'rgba(0, 0, 0, 0.3)');
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
  // A tall oak door in its frame, two tiles high (it stands on the lower tile and reaches up over the upper one, where
  // gs_bulk_door_top holds the way shut): posts and a lintel, the leaf in five planks, two iron straps nailed across it
  // and a strap hinge, a ring handle, the lintel's shadow at the top and a sill at the foot.
  const g = new Grid(16, 32);
  const OAK = ['#2a1e14', '#3e2e1f', '#56412c', '#6e5539', '#8a6e4a'];
  // The frame: posts and the lintel, lit on the left.
  g.rect(0, 0, 16, 32, OAK[0]);
  g.rect(0, 0, 2, 32, OAK[2]);
  g.rect(0, 0, 1, 32, OAK[3]);
  g.rect(14, 0, 2, 32, OAK[1]);
  g.rect(0, 0, 16, 3, OAK[2]);
  g.rect(0, 0, 16, 1, OAK[4]);
  g.rect(1, 3, 14, 1, OAK[0]);
  // The leaf: five planks, each its own shade, with grain and seams.
  const shades = [OAK[2], OAK[3], OAK[2], '#634b32', OAK[3]];
  for (let i = 0; i < 5; i++) {
    const x0 = 2 + i * 2.4;
    for (let x = Math.round(x0); x < Math.round(x0 + 2.4); x++) for (let y = 4; y < 30; y++) g.set(x, y, shades[i]);
    g.rect(Math.round(x0), 4, 1, 26, OAK[1]);
  }
  for (const [x, y] of [[4, 8], [9, 13], [6, 21], [11, 26], [3, 17]]) g.rect(x, y, 1, 2, OAK[1]);
  // The lintel's shadow on the top of the leaf.
  g.rect(2, 4, 12, 2, OAK[1]);
  // Two iron straps across, nailed, and the hinge ends on the left post.
  for (const y of [9, 23]) {
    g.rect(1, y, 13, 2, IRON[1]);
    g.rect(1, y, 13, 1, IRON[2]);
    for (let x = 3; x < 14; x += 3) g.set(x, y + 1, IRON[3]);
    g.rect(0, y - 1, 2, 4, IRON[1]);
  }
  // The ring handle and its plate.
  g.rect(10, 15, 3, 3, IRON[1]);
  g.ring(11, 19, 2, IRON[2]);
  g.set(11, 16, IRON[3]);
  // The sill.
  g.rect(0, 30, 16, 2, OAK[1]);
  g.rect(0, 30, 16, 1, OAK[3]);
  g.outline(OUT);
  return g.rows();
}

// The framing of a one-tile doorway in the poop's front wall (the captain's door on the deck), seen from above: a head
// beam across the top of the gap and a sill across the foot, brass-capped, with a lit threshold between them, so the
// gap reads as a door whether the leaf is shut, or swung back and the way clear. Flat (the door's leaf is drawn over it).
function doorFrame() {
  const g = new Grid(16, 16);
  const OAK = ['#2a1e14', '#3e2e1f', '#56412c', '#6e5539', '#8a6e4a'];
  g.rect(0, 0, 16, 16, '#4a3622');
  g.rect(0, 3, 16, 10, '#8a6a3c');
  g.rect(1, 4, 14, 8, '#b08a4c');
  g.rect(0, 0, 16, 3, OAK[3]);
  g.rect(0, 0, 16, 1, OAK[4]);
  g.rect(0, 2, 16, 1, OAK[0]);
  g.rect(0, 13, 16, 3, OAK[3]);
  g.rect(0, 13, 16, 1, OAK[4]);
  g.rect(0, 15, 16, 1, OAK[0]);
  for (const x of [2, 13]) { g.set(x, 1, BRASS[2]); g.set(x, 14, BRASS[2]); }
  g.outline(OUT);
  return g.rows();
}

// A bulkhead door in a SIDE wall (one you walk through left to right), seen from above the way the walls are: the frame's
// head beam at the top of the gap and its sill at the foot, and the leaf standing up the middle of the gap, its top edge
// catching the light, two iron straps across it and the ring on its open side. `state`: 'shut', 'ajar' (half swung,
// for the moment it moves) or 'open' (swung right back against the head beam, the way clear). `tall`: a two-tile gap
// (16x32, like gs_bulk_door) or a one-tile one (16x16).
function sideDoor(state, tall) {
  // Seen from above, a door in a side wall is narrow: a plank leaf down the middle of the gap, as wide as a door is
  // thick plus its lit top edge, with an iron band or two and the ring standing out on its open side. Small iron
  // hinge knuckles at the north end. No wide beams (they made it read as a crate).
  const H = tall ? 32 : 16;
  const g = new Grid(16, H);
  const OAK = ['#2a1e14', '#3e2e1f', '#56412c', '#6e5539', '#8a6e4a'];
  if (state === 'shut') {
    for (let y = 1; y < H - 1; y++) {
      g.set(6, y, OAK[4]);
      g.set(7, y, OAK[3]);
      g.set(8, y, OAK[2]);
      g.set(9, y, OAK[1]);
    }
    for (const y of tall ? [6, 19] : [4]) if (y < H) g.set(8, y, OAK[0]);
    g.rect(5, 1, 6, 2, IRON[1]);
    g.set(6, 1, IRON[2]);
    for (const y of tall ? [9, 23] : [8]) {
      g.rect(5, y, 6, 2, IRON[1]);
      g.rect(5, y, 6, 1, IRON[2]);
    }
    const ringY = tall ? 16 : 11;
    g.rect(10, ringY, 2, 1, IRON[2]);
    g.ring(13, ringY, 1.4, IRON[2]);
  } else if (state === 'ajar') {
    // Half swung, off its hinges at the north end at a slant.
    const len = tall ? 14 : 9;
    g.line(6, 1, 6 + len * 0.6, 1 + len, OAK[4]);
    g.line(7, 1, 7 + len * 0.6, 1 + len, OAK[3]);
    g.line(8, 1, 8 + len * 0.6, 1 + len, OAK[1]);
    g.rect(5, 1, 6, 2, IRON[1]);
  } else {
    // Open: swung right back against the wall to the east, only its edge showing, the gap clear.
    g.rect(5, 1, 6, 2, IRON[1]);
    for (let x = 6; x < 16; x++) {
      g.set(x, 2, OAK[4]);
      g.set(x, 3, OAK[2]);
      g.set(x, 4, OAK[1]);
    }
    g.rect(12, 2, 1, 3, IRON[2]);
  }
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

// THE FIGUREHEAD: Madam Fairweather, the carved figurehead of the Fair Return, small (two tiles wide, three tall): one
// block of wood leaning out to sea (right), a painted mask for a face turned back over her shoulder to the empty deck,
// carved walnut hair, a green gown running down into a gilt scroll, an iron strap at her back. One mitten hand is pressed
// over the star in her breast, the other held open. Her waking picture (src/data/art/figureheadWake.js) is what the perch
// shows; this is the same carving at prop size. Lit: a glimmer gets out under her hand. Dark: the star gone out.
function figurehead(lit = true) {
  const g = new Grid(32, 48);
  const PAINT = ['#6c5c44', '#d2c3a0', '#eee2c4'];
  const GOWN = ['#14362c', '#235846', '#3a7c60'];
  const HAIR = ['#24160c', '#5a3e26', '#c49a66'];
  // The cutwater she stands on, a gilt moulding along its top; the knee rising at her back.
  g.rect(4, 42, 24, 6, WOOD[1]);
  g.rect(4, 42, 24, 1, BRASS[2]);
  for (const x of [8, 16, 24]) g.set(x, 45, IRON[3]);
  g.poly([[5, 42], [9, 42], [12, 26], [9, 22], [7, 30]], WOOD[2]);
  g.line(6, 41, 8, 30, WOOD[3]);
  // The gown: one block sweeping back and down into the gilt scroll.
  g.poly([[11, 24], [21, 22], [24, 29], [21, 37], [13, 41], [8, 37], [9, 30]], GOWN[1]);
  g.poly([[11, 24], [14, 24], [12, 31], [12, 39], [8, 37], [9, 30]], GOWN[0]);
  g.poly([[19, 23], [21, 22], [24, 29], [21, 35], [20, 29]], GOWN[2]);
  g.line(14, 27, 16, 36, GOWN[0]);
  g.line(11, 24, 21, 22, BRASS[2]);
  g.line(13, 40, 21, 36, BRASS[2]);
  for (const [j, row] of ['.dcc.', 'd...b', 'c.dcb', 'c..b.', '.cb..'].entries()) {
    [...row].forEach((c, i) => { if (c !== '.') g.set(8 + i, 36 + j, BRASS['abcd'.indexOf(c)]); });
  }
  // The iron strap at her back.
  g.line(7, 25, 11, 25, IRON[1]); g.set(8, 25, IRON[3]);
  // The bodice and the gilt-banded neckline; the shoulders, all one block.
  g.poly([[12, 17], [21, 15], [23, 22], [11, 24]], GOWN[1]);
  g.rect(13, 13, 8, 4, PAINT[2]);
  g.rect(19, 13, 2, 4, PAINT[1]);
  g.line(12, 17, 21, 15, BRASS[2]);
  // The head: the carved hair, the mask turned back over her shoulder toward the deck.
  g.oval(16, 7, 5, 5, HAIR[1]);
  g.line(12, 3, 19, 2, HAIR[2]);
  g.line(11, 8, 9, 15, HAIR[1]); g.line(10, 8, 8, 14, HAIR[1]); g.set(8, 15, HAIR[2]);
  // (the mask: a carved rim, flat ivory, the one side plane, painted brows, eye lines with a dot, rouge, a tiny mouth)
  const MASK = [
    '..OOOO.',
    '.OPPPpO',
    'ONPNPpO',
    'OKPKPpO',
    'OzPzopO',
    'OyPyopO',
    'OPrPPpO',
    '.OOOOO.',
  ];
  const ink = { O: '#a39272', P: PAINT[2], p: PAINT[1], N: HAIR[1], K: '#24161a', z: lit ? '#2a5a86' : '#24161a', o: '#a39272', y: '#e2a28e', r: '#c0353f' };
  MASK.forEach((row, j) => [...row].forEach((c, i) => { if (c !== '.') g.set(11 + i, 4 + j, ink[c]); }));
  if (!lit) { g.set(12, 7, PAINT[2]); g.set(14, 7, PAINT[2]); g.set(12, 8, '#24161a'); g.set(14, 8, '#24161a'); }
  g.set(14, 9, '#b4a27f'); g.set(14, 10, '#b4a27f');
  // The open arm, held out low ahead of the ship; the mitten hand.
  g.line(21, 16, 27, 19, PAINT[2]); g.line(21, 17, 27, 20, PAINT[1]);
  g.rect(27, 18, 3, 2, PAINT[2]); g.set(29, 20, PAINT[1]);
  g.set(24, 18, '#b8976a');
  // The near arm, the mitten pressed flat over the star.
  g.line(20, 15, 21, 20, PAINT[1]);
  g.rect(15, 18, 5, 3, PAINT[2]); g.rect(15, 20, 5, 1, PAINT[1]);
  g.outline(OUT);
  if (lit) {
    g.set(14, 19, '#bff4ff'); g.set(20, 19, '#bff4ff'); g.set(17, 21, '#4ab8e0'); g.set(13, 18, '#ffffff');
  } else {
    g.set(17, 21, '#2a3a44');
  }
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

// The Fair Return's gangway coming down (ship_plank, scene ship_boarding). One picture, 96 x 128 (room for the spray under it), drawn at any
// angle: 0 is lying flat on the quay, 90 standing straight up. It is hinged at her side, 16 pixels in from the
// right (x 80 is the hull's edge), and its foot points west at the quay. Four boards laid lengthways with dark
// seams, cleats nailed across them for your feet, two iron hinge straps at the ship end, and a hand-rope on
// stanchions down its far (north) side. Seen from above and to the south, so upright it is short and tall and
// flat it is long. It is hoisted by a line from a davit on her rail (the davit's block at the top, its fall
// belayed at the foot): the line holds it up, and once let go it hangs down the davit, so nothing floats.
// `rope`: 'taut' (holding it up), 'whip' (just let go), 'hang'. `puff`: 0 none, 1-3 the spray as it lands.
const GW = { w: 96, h: 128, hinge: 80, base: 80, len: 62, width: 32, thick: 3 };
function gangwayAt(angle, rope = 'hang', puff = 0) {
  const g = new Grid(GW.w, GW.h);
  const a = (angle * Math.PI) / 180;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  // Where a point of the plank lands in the picture: u along it from the hinge, v across it (north to
  // south), s up off its underside (its top face is s = thick).
  const at = (u, v, s) => [GW.hinge - u * ca + s * sa, GW.base + v - u * sa - s * ca];
  const put = (u, v, s, c) => { const [x, y] = at(u, v, s); g.set(Math.floor(x), Math.floor(y), c); };
  const hash = (i, j) => { const n = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453; return n - Math.floor(n); };

  // The davit on her rail, behind the plank: an upright with a cap and a block, its foot on the hull.
  g.rect(83, 10, 3, 72, WOOD[2]);
  g.rect(83, 10, 1, 72, WOOD[3]);
  g.rect(85, 10, 1, 72, WOOD[0]);
  g.rect(82, 7, 5, 3, WOOD[3]);
  g.rect(82, 7, 5, 1, WOOD[4]);
  g.rect(81, 10, 3, 4, IRON[2]);
  g.set(82, 11, IRON[3]);
  g.rect(82, 78, 5, 3, IRON[1]);
  g.rect(87, 70, 3, 2, IRON[2]);
  g.rect(87, 74, 3, 2, IRON[2]);

  // The south side and the far end of the plank, its thickness (the faces you see edge on).
  for (let u = 0; u <= GW.len; u += 0.25) for (let s = 0; s < GW.thick; s += 0.5) put(u, GW.width - 0.5, s, WOOD[0]);
  for (let v = 0; v < GW.width; v += 0.5) for (let s = 0; s < GW.thick; s += 0.5) put(GW.len, v, s, WOOD[1]);
  // The top: four boards, each its own shade, grain flecks, seams between, cleats across, a wet sheen.
  const BOARD = ['#7a6546', WOOD[3], '#735f42', '#64513a'];
  for (let u = 0; u <= GW.len; u += 0.25) {
    for (let v = 0; v < GW.width; v += 0.5) {
      const board = Math.min(3, Math.floor(v / 8));
      const iu = Math.floor(u);
      const iv = Math.floor(v);
      let c = BOARD[board];
      if (iv % 8 === 0 && iv > 0) c = WOOD[1];
      else if (hash(iu >> 2, board) > 0.82 && iv % 8 === 4) c = WOOD[1];
      else if (hash(iu, iv) > 0.93) c = board % 2 ? WOOD[2] : '#a08a68';
      const cleat = (iu - 6) % 10;
      if (iu > 14 && iu < GW.len - 2 && cleat === 0) c = '#b09a74';
      if (iu > 14 && iu < GW.len - 2 && cleat === 1) c = WOOD[2];
      if (iv === 0 || iv === GW.width - 1) c = WOOD[1];
      if (iu >= GW.len - 1) c = WOOD[1];
      if (hash(iu + 7, iv + 3) > 0.97 && c !== WOOD[0]) c = COLD[1];
      put(u, v, GW.thick, c);
    }
  }
  // Two iron hinge straps at the ship end, bolted through, and their knuckles at the hull's edge.
  for (const v0 of [4, 24]) {
    for (let u = 0; u <= 12; u += 0.25) for (let v = v0; v < v0 + 4; v += 0.5) put(u, v, GW.thick, Math.floor(v) === v0 ? IRON[3] : IRON[2]);
    for (const u of [3, 8]) put(u, v0 + 2, GW.thick + 0.2, IRON[0]);
    for (let s = 0; s <= GW.thick + 1; s += 0.5) for (let v = v0 - 1; v < v0 + 5; v += 0.5) put(-1, v, s, s > GW.thick ? IRON[3] : IRON[1]);
  }
  // The hand-rope down the north side: stanchions standing up off the plank, a sagging rope between their heads.
  const tops = [];
  for (const u of [12, 33, 54]) {
    for (let s = GW.thick; s <= GW.thick + 9; s += 0.5) put(u, 1, s, s > GW.thick + 8 ? IRON[3] : IRON[2]);
    tops.push(at(u, 1, GW.thick + 9));
  }
  const sagLine = (x0, y0, x1, y1, sag, c) => {
    const steps = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1) * 1.5);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      g.set(Math.floor(x0 + (x1 - x0) * t), Math.floor(y0 + (y1 - y0) * t + sag * 4 * t * (1 - t)), c);
    }
  };
  for (let i = 0; i + 1 < tops.length; i++) sagLine(tops[i][0], tops[i][1], tops[i + 1][0], tops[i + 1][1], 2 + ca * 1.5, ROPE[2]);
  // And on into the davit, so the rail rope is made fast at the ship end.
  sagLine(tops[0][0], tops[0][1], 83, 44 + Math.round(ca * 26), 2, ROPE[1]);

  // The hoist line, from the davit's block: up, it is made fast to an eye at the plank's foot; let go, it falls
  // down the davit and lies coiled at its foot.
  const [ex, ey] = at(GW.len - 1, GW.width / 2, GW.thick + 1);
  put(GW.len - 1, GW.width / 2, GW.thick + 1, IRON[3]);
  if (rope === 'taut') sagLine(81, 12, ex, ey, 0.5, ROPE[2]);
  if (rope === 'whip') sagLine(81, 12, 74, 46, 5, ROPE[2]);
  if (rope === 'hang') {
    sagLine(81, 12, 88, 70, 1, ROPE[1]);
    g.oval(88, 78, 3, 1, ROPE[1]);
    g.set(88, 78, ROPE[0]);
  }
  g.outline(OUT);

  // Landing: a puff of spray and grit off the wet quay, along both sides and out past its foot, spreading and thinning.
  if (puff) {
    const SPRAY = [['rgba(226, 240, 236, 0.95)', 'rgba(170, 196, 194, 0.85)'], ['rgba(206, 226, 222, 0.75)', 'rgba(150, 178, 176, 0.6)'], ['rgba(180, 204, 200, 0.45)', 'rgba(140, 166, 164, 0.3)']][puff - 1];
    const foot = GW.hinge - GW.len;
    for (let i = 0; i < 70; i++) {
      const r = hash(i, 1);
      const r2 = hash(i + 50, 3);
      const side = i % 4;
      const out = (2 + puff * 3) * (0.4 + 0.6 * hash(i, 7));
      let x;
      let y;
      // Out past the foot (two of every four), and squeezed out along both long sides.
      if (side < 2) { x = foot - 1 - out; y = GW.base - 2 + r2 * (GW.width + 2) + (r - 0.5) * out * 0.6; }
      else if (side === 2) { x = foot + 2 + r2 * (GW.len - 14); y = GW.base - 4 - out * 0.6; }
      else { x = foot + 2 + r2 * (GW.len - 14); y = GW.base + GW.width + 1 + out * 0.5; }
      if (hash(i, puff + 9) < 0.12 * puff) continue;
      const big = puff < 3 && r > 0.45;
      g.rect(Math.round(x), Math.round(y), big ? 2 : 1, big && puff === 1 ? 2 : 1, SPRAY[r > 0.7 ? 0 : 1]);
    }
  }
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

// A wall of fog standing at the tip of the slip's point (wreck_slip, a gate on the fog bell): thick and pale, shut like a door,
// one tile wide and standing a tile and a half tall, so two of them stacked are a bank you can't see through.
function fogWall(seed) {
  const g = new Grid(16, 26);
  for (let i = 0; i < 9; i++) {
    const cx = 3 + ((i * 5 + seed * 3) % 11);
    const cy = 5 + ((i * 7 + seed * 2) % 18);
    g.oval(cx, cy, 6 - (i % 2), 5, 'rgba(176, 204, 200, 0.70)');
    g.oval(cx + 1, cy - 1, 4, 3, 'rgba(212, 232, 228, 0.78)');
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


// --- THE WAY TO HER: the torn log in its bottles, the fog bell on the Watch Rock and its tongue ---
const STONE = ['#151918', '#262d2b', '#3a4440', '#56625c', '#7c887e'];
const WEED = ['#1c2a1a', '#2e4426', '#4a6a34'];

// The Watch Rock's stone: the stump of the old fog-watch's beacon, courses of dark stone broken off at the top, with
// an iron arm leaded into it and the Fair Return's fog bell hung from the arm (nothing floats: the arm is braced back
// into the stone). `tongue` false: the bell's mouth is empty and its rope is tied up short to the arm. `swing` -1..1
// for the frames when it's rung. Two tiles wide: the stone on the left, the bell on the right.
function watchBell(swing = 0, tongue = true) {
  const g = new Grid(32, 52);
  // The stump, a little wider at the foot, its broken top uneven.
  for (let y = 12; y < 52; y++) {
    const half = 6 + (y > 40 ? Math.round((y - 40) / 4) : 0);
    const top = [14, 12, 13, 15, 13, 12, 14, 16, 13, 12, 13, 15, 14];
    for (let x = 9 - half; x <= 9 + half; x++) {
      if (y < (top[x - 3] ?? 14)) continue;
      const course = Math.floor((y - 12) / 6);
      const joint = (y - 12) % 6 === 5 || (x + course * 3) % 7 === 0;
      const shade = x < 9 - half + 2 ? 3 : x > 9 + half - 2 ? 1 : 2;
      g.set(x, y, joint ? STONE[0] : STONE[shade]);
    }
  }
  for (let x = 4; x < 15; x += 3) g.set(x, 13 + (x % 2), STONE[4]);
  // Weed and barnacles round its foot, a salt line above them.
  for (let x = 1; x < 18; x++) { g.rect(x, 47 + (x % 3), 1, 5 - (x % 3), WEED[x % 3 === 0 ? 2 : 1]); if (x % 4 === 1) g.set(x, 45, '#b8c0b0'); }
  g.rect(3, 41, 13, 1, 'rgba(210, 220, 206, 0.35)');
  // The iron arm: leaded into the stone, out over the rock, a brace back down into the courses.
  g.rect(13, 15, 15, 2, IRON[1]);
  g.rect(13, 15, 15, 1, IRON[2]);
  g.line(14, 26, 23, 17, IRON[1]);
  g.line(15, 26, 24, 17, IRON[0]);
  g.rect(12, 14, 3, 4, '#5a5e60');
  g.rect(12, 25, 3, 3, '#5a5e60');
  g.rect(26, 13, 2, 2, IRON[2]);
  // The bell, mouth down, on a shackle from the arm's end.
  const bx = 25 + swing;
  g.line(25, 17, bx, 20, IRON[2]);
  g.poly([[bx - 2, 20], [bx + 2, 20], [bx + 5, 31], [bx + 6, 33], [bx - 6, 33], [bx - 5, 31]], BRASS[1]);
  g.poly([[bx - 2, 21], [bx, 21], [bx - 1, 31], [bx - 4, 32]], BRASS[3]);
  g.rect(bx - 6, 32, 13, 2, BRASS[0]);
  // A band cast round her waist (the words are on it).
  g.rect(bx - 4, 27, 9, 1, BRASS[2]);
  g.set(bx - 3, 27, BRASS[3]); g.set(bx + 1, 27, BRASS[3]);
  // Verdigris where the spray gets her.
  g.set(bx + 3, 30, '#4f8a72'); g.set(bx + 4, 31, '#3c6e5a'); g.set(bx - 4, 30, '#4f8a72');
  if (tongue) {
    // The tongue hanging in her mouth, and her rope down to where a hand can reach it.
    g.rect(bx, 33, 1, 3, IRON[1]);
    g.rect(bx - 1, 35, 3, 3, IRON[2]);
    g.line(bx + 1, 37, bx + 3 + swing, 46, ROPE[1]);
    g.rect(bx + 2 + swing, 46, 3, 3, ROPE[2]);
  } else {
    // An empty mouth: dark inside, and the rope taken up and tied off round the arm so nobody pulls it.
    g.rect(bx - 4, 33, 9, 1, '#120d06');
    g.line(bx + 2, 21, 21, 17, ROPE[1]);
    g.rect(20, 16, 3, 2, ROPE[2]);
  }
  g.outline(OUT);
  return g.rows();
}

// The fog bell's tongue, as the Drowned Rat's doorstop: a heavy brass pear on an iron loop, bright where hands go,
// green where they don't, on the floor by the door.
function doorstop() {
  const g = new Grid(16, 16);
  g.oval(8, 14, 5, 1, 'rgba(0, 0, 0, 0.35)');
  g.ring(8, 4, 2, IRON[2], 1);
  g.rect(7, 6, 2, 2, IRON[1]);
  g.oval(8, 11, 3, 3, BRASS[1]);
  g.rect(6, 7, 4, 2, BRASS[1]);
  g.rect(7, 8, 1, 4, BRASS[3]);
  g.set(6, 10, BRASS[2]);
  g.set(10, 12, '#4f8a72'); g.set(9, 13, '#3c6e5a'); g.set(5, 12, '#4f8a72');
  g.outline(OUT);
  return g.rows();
}

// A bottle come ashore with a page of the Fair Return's log in it: green glass on its side, a roll of paper showing
// through, the cork sealed with the ship's red wax.
function logBottle() {
  const g = new Grid(16, 16);
  g.oval(8, 13, 6, 1, 'rgba(0, 0, 0, 0.3)');
  g.rect(2, 9, 9, 4, '#2a4a36');
  g.rect(2, 9, 9, 1, '#5e9a76');
  g.rect(11, 10, 2, 2, '#2a4a36');
  g.rect(13, 10, 2, 2, '#9a2a22');
  g.set(14, 10, '#d0584a');
  // The page rolled up inside, pale through the glass.
  g.rect(3, 10, 7, 2, '#a9b49a');
  g.rect(3, 10, 7, 1, '#d4dcc4');
  g.set(5, 11, '#6a7460'); g.set(8, 11, '#6a7460');
  g.set(3, 9, '#c6ead6');
  g.outline('rgba(4, 10, 8, 0.75)');
  return g.rows();
}

// The steps down into the point, where the old boat lay over them: a black mouth in the shingle with stone treads
// going down out of the light, edged with the stones that held the boat. Flat, two tiles wide (a door is on it).
function pointSteps() {
  const g = new Grid(32, 16);
  g.oval(16, 8, 14, 7, '#2a2a26');
  g.oval(16, 8, 12, 6, '#070808');
  for (let i = 0; i < 4; i++) {
    const y = 3 + i * 3;
    const w = 18 - i * 3;
    g.rect(16 - w / 2, y, w, 2, STONE[3 - Math.min(3, i)]);
    g.rect(16 - w / 2, y, w, 1, STONE[4 - Math.min(3, i)]);
  }
  for (const [x, y] of [[3, 5], [6, 13], [27, 4], [29, 10], [12, 1], [21, 14]]) { g.rect(x, y, 3, 2, STONE[2]); g.set(x, y, STONE[4]); }
  g.set(9, 9, WEED[2]); g.set(23, 6, WEED[2]); g.set(10, 10, WEED[1]);
  return g.rows();
}

// Chalk on the rock, an old fog-watch's tally: strokes in fives for every fog they rang through, a little bell drawn
// at the top, and the count stopping partway through a five. Flat on a wall.
function fogTally() {
  const g = new Grid(16, 16);
  const CHALK = 'rgba(214, 222, 210, 0.7)';
  g.line(6, 1, 9, 1, CHALK); g.line(5, 4, 10, 4, CHALK); g.line(5, 4, 6, 1, CHALK); g.line(10, 4, 9, 1, CHALK); g.set(7, 5, CHALK);
  for (let r = 0; r < 3; r++) for (let k = 0; k < (r === 2 ? 3 : 5); k++) {
    const x = 2 + (k % 5) * 2 + (r === 1 ? 1 : 0);
    if (k === 4) g.line(1 + (r === 1 ? 1 : 0), 8 + r * 3 + 2, 10 + (r === 1 ? 1 : 0), 8 + r * 3, CHALK);
    else g.line(x, 7 + r * 3, x, 9 + r * 3, CHALK);
  }
  return g.rows();
}


// The way into the point from the Watch Rock's side: a low black arch in the cliff's foot, wet stone round it, weed
// on its lip, the dark going back into the rock. Two tiles wide; walked into (a door is under it).
// The Fair Return lying off the Watch Rock (wreck_watch_rock, after ship_alongside), seen from above and to the south like
// everything else, so what stands up off her shows its height: two masts rising off the deck as poles, their yards and
// furled sails high over it, the shrouds fanning down to her rails, and their shadows falling away south-east across the
// boards; a deckhouse aft with its front wall, door and lit windows; the main hatch on its raised coaming; the deck
// cambered (darker towards the rails); a strip of her tarred side showing under the port rail; and at the south end her
// stern face with two cold-lit windows. Her bow runs off north. The gap in her port rail (rows 7-8 of the room, y 112-144
// here) is where the fog-watch's stones meet her. 8 tiles wide, 17 tall: placed at x 36, row 16, it covers rows 0-16.
function hullFromRock() {
  const W = 128;
  const H = 272;
  const g = new Grid(W, H);
  const hash = (i, j) => { const n = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453; return n - Math.floor(n); };
  const HULL = ['#0e0b09', '#1a1612', '#241e18', '#2e261e', '#3a3026'];
  const DECK = ['#4e4a42', '#45423b', '#565046', '#3e3c37', '#48494a'];
  const SEAM = '#24221e';
  const RAIL = ['#3c3226', '#5a4c3a', '#7a6a52'];
  const SHEEN = 'rgba(150, 200, 192, 0.6)';
  const FOAM = 'rgba(176, 210, 200, 0.6)';
  const POLE = ['#2a2018', '#4c3b2a', '#6a5640', '#8a7456'];
  const SAIL = ['#5e5c50', '#8e8a78', '#a8a490', '#c4c0aa'];
  const DECK_END = 222;
  const STERN_END = 262;
  // Tints what is already there toward a colour, opaque, so shadows lie ON her, not through her.
  const tint = (x, y, rgb, k) => {
    const c = g.get(x, y);
    if (!c || c[0] !== '#') return;
    const n = parseInt(c.slice(1), 16);
    const mix = [n >> 16, (n >> 8) & 255, n & 255].map((v, i) => Math.round(v + (rgb[i] - v) * k));
    g.set(x, y, '#' + mix.map((v) => v.toString(16).padStart(2, '0')).join(''));
  };
  const dark = (x, y, k) => tint(x, y, [6, 8, 8], k);
  // Her outline: a bow narrowing to the north, straight sides, the stern face tucking in a little at the waterline.
  const edges = (y) => {
    let inset = 0;
    if (y < 64) { const t = (64 - y) / 64; inset = Math.round(50 * t * t); }
    if (y > DECK_END) inset = Math.round((y - DECK_END) * 0.12);
    return [7 + inset, W - 8 - inset];
  };
  const onDeck = (x, y) => { if (y < 2 || y >= DECK_END - 2) return false; const [l, r] = edges(y); return x > l + 4 && x < r - 4; };

  // Her shadow on the water: off to the east and south of her (the light is from the north-west).
  for (let y = 10; y < STERN_END + 8; y++) {
    const [, r] = edges(Math.min(y, STERN_END - 1));
    g.rect(r + 2, y, 5, 1, 'rgba(0, 8, 10, 0.38)');
  }
  for (let y = STERN_END; y < STERN_END + 8; y++) g.rect(18, y, W - 30, 1, 'rgba(0, 8, 10, 0.3)');

  for (let y = 0; y < STERN_END; y++) {
    const [l, r] = edges(y);
    if (r - l < 2) continue;
    if (y < DECK_END) {
      // The deck: planks lengthways, butt joints here and there.
      for (let x = l; x <= r; x++) {
        const plank = Math.floor((x - 2) / 5);
        let c = DECK[Math.floor(hash(plank, 3) * DECK.length)];
        if ((x - 2) % 5 === 0) c = SEAM;
        else if ((y + plank * 13) % 37 === 0) c = SEAM;
        else if (hash(x, y) > 0.94) c = DECK[3];
        g.set(x, y, c);
      }
      // Her tarred side showing under the port rail (she flares out above the water), with a wale along it.
      for (let x = l - 4; x < l; x++) g.set(x, y, (y % 6 === 0) ? HULL[0] : HULL[2 + ((x + 4 - l) > 1 ? 1 : 0)]);
      if (y % 3 === 0) g.set(l - 3, y, '#3e3226');
      // The bulwarks: the rail on top, lit on the north-west, a ghost-green sheen catching it.
      g.rect(l, y, 3, 1, HULL[1]); g.rect(r - 2, y, 3, 1, HULL[1]);
      g.set(l + 3, y, RAIL[2]); g.set(l + 4, y, RAIL[1]); g.set(r - 3, y, RAIL[1]); g.set(r - 4, y, RAIL[0]);
      if (hash(y, 7) > 0.8) g.set(l + 3, y, SHEEN);
      g.set(r + 1, y, HULL[0]);
      // The deck cambered: it falls away to the rails, darker toward them; the port bulwark's shadow along it.
      for (let x = l + 5; x <= r - 5; x++) {
        const d = Math.min(x - l - 5, r - 5 - x);
        if (d < 12) dark(x, y, (12 - d) * 0.022);
      }
      for (let x = l + 5; x < l + 8; x++) dark(x, y, 0.25);
    } else {
      // The stern face: planks across, the waterline.
      for (let x = l; x <= r; x++) {
        let c = HULL[2 + ((Math.floor((y - DECK_END) / 4) + (hash(x >> 3, y >> 2) > 0.7 ? 1 : 0)) % 2)];
        if ((y - DECK_END) % 4 === 0) c = HULL[0];
        g.set(x, y, c);
      }
      // Darker toward the waterline.
      for (let x = l; x <= r; x++) dark(x, y, Math.max(0, (y - DECK_END - 20) * 0.02));
      g.set(l - 1, y, HULL[0]); g.set(r + 1, y, HULL[0]);
    }
  }
  // The taffrail across the top of the stern face, and a carved gilt band under it.
  {
    const [l, r] = edges(DECK_END);
    g.rect(l, DECK_END - 2, r - l + 1, 3, RAIL[1]);
    g.rect(l, DECK_END - 2, r - l + 1, 1, RAIL[2]);
    g.rect(l + 2, DECK_END + 6, r - l - 3, 2, '#5a4628');
    g.rect(l + 2, DECK_END + 6, r - l - 3, 1, '#8a6c3a');
  }
  // Two stern windows, lit cold from inside (nobody lit them).
  for (const wx of [34, 80]) {
    g.rect(wx, DECK_END + 14, 14, 12, HULL[0]);
    g.rect(wx + 1, DECK_END + 15, 12, 10, 'rgba(120, 190, 220, 0.8)');
    g.rect(wx + 6, DECK_END + 15, 1, 10, HULL[1]);
    g.rect(wx + 1, DECK_END + 19, 12, 1, HULL[1]);
    g.rect(wx + 2, DECK_END + 16, 3, 2, 'rgba(206, 244, 255, 0.9)');
  }
  // Her rudder post under the stern, and foam where she sits in the water.
  g.rect(62, STERN_END - 8, 5, 10, HULL[0]);
  for (let y = 40; y < STERN_END; y += 3) {
    const [l, r] = edges(y);
    if (hash(y, 1) > 0.35) g.set(l - 6 - Math.floor(hash(y, 2) * 2), y, FOAM);
    if (hash(y, 4) > 0.35) g.set(r + 2 + Math.floor(hash(y, 5) * 2), y, FOAM);
  }
  for (let x = 14; x < W - 14; x += 2) if (hash(x, 9) > 0.3) g.set(x, STERN_END + 1 + Math.floor(hash(x, 8) * 2), FOAM);

  // The gap in her port rail where the stones meet her (y 112-144): rail and side gone, two stout posts, planks.
  {
    const [l] = edges(128);
    g.rect(l - 4, 114, 9, 28, DECK[0]);
    for (let y = 114; y < 142; y += 5) g.rect(l - 4, y, 9, 1, SEAM);
    for (const py of [108, 142]) {
      g.rect(l - 3, py, 6, 6, RAIL[0]);
      g.rect(l - 3, py, 6, 2, RAIL[2]);
      g.rect(l - 3, py + 5, 6, 1, HULL[0]);
    }
  }

  // The main hatch on its raised coaming: a grating on top, the coaming's south face below it, its shadow.
  {
    const [x0, y0, w, h] = [50, 132, 28, 16];
    for (let y = y0 + 3; y < y0 + h + 7; y++) for (let x = x0 + 3; x < x0 + w + 4; x++) dark(x, y, 0.35);
    g.rect(x0, y0, w, h, HULL[3]);
    g.rect(x0 + 1, y0 + 1, w - 2, h - 2, '#2c2620');
    for (let y = y0 + 2; y < y0 + h - 2; y += 3) for (let x = x0 + 2; x < x0 + w - 2; x += 3) g.rect(x, y, 2, 2, '#62533f');
    g.rect(x0, y0, w, 1, RAIL[2]);
    g.rect(x0, y0 + h, w, 4, POLE[1]);
    g.rect(x0, y0 + h + 3, w, 1, HULL[0]);
  }
  // The deckhouse aft: its roof (seen from above), its front wall with a door and two windows lit cold, its shadow.
  {
    const [x0, y0, w, h, wall] = [40, 186, 48, 14, 16];
    for (let y = y0 + 4; y < y0 + h + wall + 6; y++) for (let x = x0 + 4; x < x0 + w + 6; x++) dark(x, y, 0.35);
    g.rect(x0, y0, w, h, '#3a3430');
    for (let y = y0 + 2; y < y0 + h; y += 3) g.rect(x0 + 1, y, w - 2, 1, '#2c2824');
    g.rect(x0, y0, w, 1, '#5a524a');
    g.rect(x0 - 1, y0 + h - 1, w + 2, 2, '#22201c');
    for (let y = y0 + h + 1; y < y0 + h + wall; y++) for (let x = x0; x < x0 + w; x++) g.set(x, y, (x - x0) % 6 === 0 ? HULL[2] : HULL[3]);
    g.rect(x0 + 20, y0 + h + 3, 8, wall - 3, HULL[0]);
    g.rect(x0 + 21, y0 + h + 4, 6, wall - 4, '#3a2c1e');
    g.set(x0 + 26, y0 + h + 10, BRASS[2]);
    for (const wx of [x0 + 6, x0 + 34]) {
      g.rect(wx, y0 + h + 4, 8, 6, HULL[0]);
      g.rect(wx + 1, y0 + h + 5, 6, 4, 'rgba(120, 190, 220, 0.85)');
      g.set(wx + 2, y0 + h + 5, 'rgba(206, 244, 255, 0.95)');
    }
    g.rect(x0, y0 + h + wall, w, 1, HULL[0]);
  }
  // The capstan forward, coils of line.
  g.oval(64, 60, 5, 4, POLE[1]);
  g.oval(64, 59, 3, 2, POLE[2]);
  g.rect(59, 61, 11, 3, POLE[0]);
  for (const [cx, cy] of [[28, 100], [100, 156], [96, 176]]) { g.ring(cx, cy, 3, ROPE[1]); g.ring(cx, cy, 2, ROPE[0]); }

  // A mast standing up off the deck at (64, base): its shadow thrown south-east across the boards first, then the shrouds
  // fanning down to the rails, the pole itself, two yards with their sails furled on them, and a top with its south face.
  const mast = (base, tall, span) => {
    const top = base - tall;
    const lean = [0.55, 0.42];
    // The shadow: the pole and the yards, laid down across the deck.
    for (let i = 0; i < tall; i++) {
      const sx = Math.round(64 + i * lean[0]);
      const sy = Math.round(base + i * lean[1] * 0.5);
      for (let k = -1; k <= 1; k++) if (onDeck(sx + k, sy)) dark(sx + k, sy, 0.4);
    }
    for (const [h, sp] of [[tall - 6, span], [Math.round(tall * 0.55), Math.round(span * 0.8)]]) {
      const ox = Math.round(h * lean[0]);
      const oy = Math.round(base + h * lean[1] * 0.5);
      for (let x = 64 - sp + ox; x < 64 + sp + ox; x++) for (let k = 0; k < 5; k++) if (onDeck(x, oy + k)) dark(x, oy + k, 0.38);
    }
    // The shrouds, from the top down to the rails a little aft of the mast.
    for (const side of [-1, 1]) for (const dy of [0, 6, 12]) {
      const [l, r] = edges(base + dy);
      g.line(64 + side * 2, top + 6, side < 0 ? l + 3 : r - 3, base + dy, '#2a2218');
    }
    // The pole: lit on its west side, dark on its east, with its partners (the ring it stands in) on the deck.
    g.oval(64, base, 6, 3, POLE[0]);
    g.oval(64, base - 1, 5, 2, POLE[1]);
    for (let y = top; y < base; y++) {
      const w = y < top + tall * 0.4 ? 3 : 4;
      g.rect(63 - (w >> 1), y, w, 1, POLE[1]);
      g.set(63 - (w >> 1), y, POLE[3]);
      g.set(63 - (w >> 1) + w - 1, y, POLE[0]);
    }
    // A yard across, with its sail furled on it in a lumpy roll, gaskets tying it, hanging a little under the spar.
    const yard = (y, sp) => {
      g.rect(64 - sp, y, sp * 2, 2, POLE[1]);
      g.rect(64 - sp, y, sp * 2, 1, POLE[3]);
      g.set(64 - sp - 1, y + 1, POLE[0]); g.set(64 + sp, y + 1, POLE[0]);
      for (let x = 64 - sp + 2; x < 64 + sp - 2; x++) {
        const lump = Math.round(2 + Math.sin(x * 0.45) * 1.2 + hash(x, y) * 1.2);
        g.rect(x, y + 2, 1, 2 + lump, SAIL[1]);
        g.set(x, y + 2, SAIL[3]);
        g.set(x, y + 3, SAIL[2]);
        g.set(x, y + 3 + lump, SAIL[0]);
        if (x % 9 === 0) g.rect(x, y + 1, 1, 4 + lump, ROPE[1]);
      }
    };
    yard(top + 6, span);
    yard(top + Math.round(tall * 0.45), Math.round(span * 0.8));
    // The top: a little platform on the mast, its floor and its south face.
    g.rect(57, top + 14, 14, 3, POLE[2]);
    g.rect(57, top + 17, 14, 2, POLE[0]);
    // The cap and a pennant stirring.
    g.rect(62, top - 3, 3, 3, POLE[2]);
    g.line(64, top - 3, 72, top - 1, '#8a3a2a');
    g.line(64, top - 2, 70, top, '#6a2a20');
  };
  mast(118, 74, 44);
  mast(180, 80, 48);
  // The bowsprit running off north from the bow, its stay down to the foremast's top.
  g.rect(62, 0, 4, 16, POLE[1]);
  g.rect(62, 0, 1, 16, POLE[3]);
  // Fog lying on her deck in a few soft drifts (she brought it with her).
  for (const [cx, cy, rx] of [[40, 70, 12], [92, 108, 14], [38, 160, 12]]) {
    for (let dy = -3; dy <= 3; dy++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / 9.25)));
      for (let dx = -w; dx <= w; dx++) tint(cx + dx, cy + dy, [176, 204, 200], 0.2);
    }
  }
  return g.rows();
}

function caveMouth() {
  const g = new Grid(32, 30);
  g.poly([[0, 29], [1, 13], [5, 5], [11, 1], [21, 1], [27, 5], [31, 13], [31, 29]], STONE[2]);
  g.poly([[0, 29], [1, 13], [5, 5], [11, 1], [14, 1], [8, 8], [5, 18], [5, 29]], STONE[3]);
  for (let x = 5; x < 28; x += 2) g.set(x, 2 + (x % 3), STONE[4]);
  g.poly([[6, 29], [6, 17], [9, 10], [14, 7], [19, 7], [23, 10], [26, 17], [26, 29]], STONE[0]);
  g.poly([[8, 29], [8, 18], [10, 12], [14, 9], [18, 9], [22, 12], [24, 18], [24, 29]], '#07090a');
  g.poly([[11, 29], [11, 19], [13, 14], [16, 12], [19, 14], [21, 19], [21, 29]], '#020304');
  for (let y = 12; y < 28; y += 3) g.set(7, y, '#9ab0a8');
  for (let x = 2; x < 30; x++) if (x < 7 || x > 25) g.rect(x, 25 + (x % 3), 1, 5 - (x % 3), WEED[x % 4 === 0 ? 2 : 1]);
  g.outline(OUT);
  return g.rows();
}

// --- Captain Tarry, on his feet in his own cabin (the cutscenes; his battle picture is art/captain_tarry.js) ---
// The crew's scale and the crew's see-through light, but darker and taller than any of them: the grey-green
// greatcoat, the tricorn with its brass edge, the white beard, the hook, the speaking-trumpet. All his frames
// are one size (28x40, feet on the bottom row, centred), so one animation hands over to the next in place.
// He faces right (toward the cabin door, where you come in); 'back' is him at the chart table.
const CAP_COAT = ['rgba(30, 66, 64, 0.86)', 'rgba(48, 98, 92, 0.88)', 'rgba(80, 138, 128, 0.9)', 'rgba(124, 186, 172, 0.92)'];
const CAP_HAT = ['rgba(10, 28, 32, 0.92)', 'rgba(26, 52, 56, 0.92)'];
const CAP_BRASS = ['rgba(150, 138, 80, 0.86)', 'rgba(212, 196, 126, 0.9)', 'rgba(246, 234, 176, 0.94)'];
const CAP_HOOK = 'rgba(150, 178, 186, 0.92)';
// Morning light at the very end (captain_spared): his rim goes gold.
const CAP_RIM_GOLD = 'rgba(255, 216, 140, 0.5)';

// A colour with its see-through-ness scaled (for fading out).
function thinned(c, k) {
  const m = /^rgba\(([^)]*),\s*([\d.]+)\)$/.exec(c);
  if (!m) return c;
  const parts = m[1].split(',').slice(0, 3).join(',');
  return `rgba(${parts}, ${(parseFloat(m[2]) * k).toFixed(2)})`;
}
const BAYER4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

function captain(pose = {}) {
  const {
    view = 'front', coat = true, hat = 'on', arm = 'hang', breath = 0, stir = 0, flick = 0, eyes = 'open',
    trace = 0, sink = 0, fade = 0, gold = false,
  } = pose;
  const g = new Grid(28, 40);
  const t = breath;
  const thick = (x0, y0, x1, y1, c) => { g.line(x0, y0, x1, y1, c); g.line(x0 + 1, y0, x1 + 1, y1, c); };
  const hand = (x, y) => g.rect(x, y, 2, 2, GHOST[3]);
  const hook = (x, y) => { g.set(x, y, CAP_HOOK); g.set(x, y + 1, CAP_HOOK); g.set(x + 1, y + 2, CAP_HOOK); g.set(x + 2, y + 1, CAP_HOOK); };
  // The trumpet hanging, mouthpiece up, flare down.
  const trumpetDown = (x, y) => {
    g.rect(x, y, 1, 3, CAP_BRASS[1]);
    g.rect(x - 1, y + 3, 3, 1, CAP_BRASS[1]);
    g.rect(x - 2, y + 4, 5, 1, CAP_BRASS[2]);
    g.set(x, y + 4, CAP_BRASS[0]);
  };
  // The trumpet held level, mouthpiece at (x, y), flaring out to the right.
  const trumpetLevel = (x, y, len) => {
    for (let i = 0; i <= len; i++) {
      const h = Math.round(i * 0.34);
      g.rect(x + i, y - h, 1, h * 2 + 1, i === len ? CAP_BRASS[2] : CAP_BRASS[1]);
      if (h > 0) g.set(x + i, y - h, CAP_BRASS[2]);
    }
    const h = Math.round(len * 0.34);
    if (h > 1) g.rect(x + len, y - h + 1, 1, h * 2 - 1, CAP_BRASS[0]);
  };
  const tricorn = (y, seenFrom) => {
    g.oval(14, y - 2, 4, 2, CAP_HAT[1]);
    g.rect(7, y, 15, 2, CAP_HAT[0]);
    g.rect(6, y - 1, 2, 2, CAP_HAT[0]);
    g.rect(21, y - 1, 2, 2, CAP_HAT[0]);
    g.rect(8, y, 13, 1, CAP_BRASS[0]);
    g.set(6, y - 1, CAP_BRASS[0]);
    g.set(22, y - 1, CAP_BRASS[0]);
    if (seenFrom === 'front') g.rect(13, y + 1, 3, 1, CAP_HAT[0]);
    g.rect(12, y - 3, 3, 1, 'rgba(48, 86, 90, 0.9)');
  };
  // The fog he stands in where his boots should be, stirring.
  const tail = (left, right) => {
    const s = stir % 3;
    g.rect(left + 2, 32, right - left - 3, 1, CAP_COAT[0]);
    g.rect(left + 3 + (s === 1 ? 1 : 0), 33, right - left - 6, 1, GHOST[0]);
    g.rect(left + 5 - (s === 2 ? 1 : 0), 34, right - left - 9, 1, GHOST[0]);
    g.rect(12 + (s === 0 ? 1 : s === 1 ? 0 : -1), 35, 3, 1, GHOST[0]);
    g.set(14 + (s === 1 ? 1 : -1), 36, GHOST[0]);
  };
  // The greatcoat's hem, a pixel lifting here and there as it stirs.
  const hem = (left, right) => {
    for (let x = left; x <= right; x++) if ((x + stir) % 4 === 0) g.set(x, 31, CAP_COAT[1]);
    for (let x = left; x <= right; x++) if ((x + stir) % 4 === 2) g.set(x, 30, null);
  };

  if (view === 'back') {
    // At the chart table, his back to you. The map is ahead and to the right: his right hand is on it.
    if (coat) {
      tail(6, 23);
      g.poly([[8, 14 + t], [21, 14 + t], [23, 31], [5, 31]], CAP_COAT[1]);
      g.poly([[8, 14 + t], [12, 14 + t], [10, 31], [5, 31]], CAP_COAT[0]);
      hem(6, 22);
      g.line(14, 16 + t, 14, 30, CAP_COAT[0]);
      g.rect(14, 26, 1, 5, 'rgba(14, 40, 40, 0.9)');
      g.rect(10, 23, 9, 1, CAP_COAT[0]);
      g.set(12, 23, CAP_BRASS[1]);
      g.set(16, 23, CAP_BRASS[1]);
      g.rect(9, 12 + t, 11, 2, CAP_COAT[2]);
    } else {
      tail(8, 21);
      g.rect(10, 26, 9, 5, CAP_COAT[0]);
      g.poly([[9, 14 + t], [19, 14 + t], [19, 26], [9, 26]], CAP_COAT[2]);
      g.rect(9, 14 + t, 11, 4, GHOST[2]);
      g.rect(10, 22, 9, 1, CAP_COAT[1]);
      g.rect(13, 22, 3, 1, CAP_BRASS[0]);
      g.rect(11, 12 + t, 7, 2, GHOST[3]);
    }
    const sleeve = coat ? CAP_COAT[2] : GHOST[2];
    // The left (the hook), hanging, the trumpet from it if he has it.
    g.rect(coat ? 5 : 7, 15 + t, 3, 10, sleeve);
    g.rect(coat ? 5 : 7, 15 + t, 1, 10, coat ? CAP_COAT[1] : GHOST[1]);
    hook(coat ? 6 : 8, 25 + t);
    if (coat) trumpetDown(6, 28 + t);
    // The right, out on the map; the finger goes along the course.
    if (arm === 'trace') {
      g.rect(coat ? 20 : 19, 15 + t, 3, 3, sleeve);
      thick(coat ? 21 : 20, 17 + t, 22, 14 + t, sleeve);
      hand(22 + trace, 12 + t);
      g.set(24 + trace, 12 + t, GHOST[3]);
    } else {
      g.rect(coat ? 20 : 19, 15 + t, 3, 10, sleeve);
      hand(coat ? 20 : 19, 25 + t);
    }
    // Grey hair under the hat, tied back with a dark ribbon; the beard shows past his cheeks.
    g.rect(11, 7 + t, 7, 4, GHOST[1]);
    g.rect(12, 7 + t, 5, 1, GHOST[2]);
    g.rect(14, 10 + t, 1, 3, CAP_HAT[0]);
    g.set(10, 8 + t, GHOST[2]);
    g.set(18, 8 + t, GHOST[2]);
    g.rect(10, 10 + t, 1, 2, GHOST[3]);
    g.rect(18, 10 + t, 1, 2, GHOST[3]);
    if (hat === 'on') tricorn(5 + t, 'back');
    else g.oval(14, 6 + t, 4, 2, GHOST[1]);
  } else if (view === 'side') {
    // Half round, in profile, facing right.
    tail(7, 21);
    g.poly([[10, 14 + t], [18, 14 + t], [20, 31], [8, 31]], CAP_COAT[1]);
    g.line(18, 15 + t, 20, 30, CAP_COAT[2]);
    g.rect(9, 23, 10, 1, CAP_COAT[0]);
    g.set(18, 19, CAP_BRASS[1]);
    g.set(18, 23, CAP_BRASS[1]);
    hem(8, 20);
    g.rect(12, 15 + t, 4, 10, CAP_COAT[2]);
    g.rect(12, 15 + t, 1, 10, CAP_COAT[1]);
    hand(13, 25 + t);
    trumpetDown(14, 27 + t);
    g.oval(15, 9 + t, 3, 3, GHOST[2]);
    g.rect(12, 7 + t, 3, 5, GHOST[1]);
    g.set(19, 9 + t, GHOST[2]);
    g.poly([[14, 10 + t], [19, 10 + t], [19, 13 + t], [17, 16 + t], [15, 15 + t], [14, 13 + t]], GHOST[3]);
    g.rect(17, 11 + t, 2, 1, GHOST[2]);
    g.set(17, 8 + t, GHOST_EYE);
    g.rect(16, 7 + t, 3, 1, GHOST[3]);
    g.oval(13, 3 + t, 3, 2, CAP_HAT[1]);
    g.rect(8, 5 + t, 13, 1, CAP_HAT[0]);
    g.rect(8, 6 + t, 12, 1, CAP_BRASS[0]);
    g.rect(19, 4 + t, 2, 2, CAP_HAT[0]);
    g.rect(7, 4 + t, 2, 2, CAP_HAT[0]);
  } else {
    // Facing you, turned a little to the right.
    const holding = arm === 'hat' || arm === 'hatChin' || arm === 'coatOut';
    if (coat) {
      tail(6, 23);
      g.poly([[8, 14 + t], [21, 14 + t], [23, 31], [5, 31]], CAP_COAT[1]);
      g.poly([[8, 14 + t], [11, 14 + t], [11, 31], [5, 31]], CAP_COAT[0]);
      hem(6, 22);
      g.line(14, 17 + t, 14, 30, CAP_COAT[0]);
      g.line(12, 16 + t, 12, 30, CAP_COAT[2]);
      g.line(17, 16 + t, 17, 30, CAP_COAT[2]);
      for (const y of [19, 22, 26]) { g.set(13, y + (y < 22 ? t : 0), CAP_BRASS[1]); g.set(16, y + (y < 22 ? t : 0), CAP_BRASS[1]); }
      g.rect(7, 24, 15, 1, CAP_COAT[0]);
      g.set(14, 24, CAP_BRASS[2]);
      g.rect(8, 13 + t, 3, 3, CAP_COAT[3]);
      g.rect(18, 13 + t, 3, 3, CAP_COAT[3]);
    } else {
      tail(8, 21);
      g.rect(10, 26, 9, 5, CAP_COAT[0]);
      g.rect(14, 27, 1, 4, 'rgba(14, 40, 40, 0.9)');
      g.poly([[9, 14 + t], [19, 14 + t], [19, 26], [9, 26]], GHOST[2]);
      g.poly([[10, 16 + t], [18, 16 + t], [18, 26], [10, 26]], CAP_COAT[2]);
      g.rect(13, 16 + t, 3, 3, GHOST[3]);
      for (const y of [20, 22, 24]) g.set(14, y, CAP_BRASS[1]);
    }
    const sleeve = coat ? CAP_COAT[2] : GHOST[2];
    const lx = coat ? 5 : 7;
    const rx = coat ? 20 : 19;
    // His right (your left): the trumpet hand.
    if (arm === 'hang' || arm === 'empty') {
      g.rect(lx, 15 + t, 3, 10, sleeve);
      g.rect(lx, 15 + t, 1, 10, coat ? CAP_COAT[1] : GHOST[1]);
      hand(lx + 1, 25 + t);
      if (arm === 'hang') trumpetDown(lx + 1, 27 + t);
    } else if (arm === 'level') {
      g.rect(lx, 15 + t, 3, 5, sleeve);
      thick(lx + 1, 19 + t, 10, 19 + t, sleeve);
      hand(10, 18 + t);
      trumpetLevel(12, 19 + t, 10);
    } else if (arm === 'mouth') {
      g.rect(lx, 15 + t, 3, 4, sleeve);
      thick(lx + 1, 18 + t, 13, 14 + t, sleeve);
    } else if (arm === 'hatHand') {
      g.rect(lx, 15 + t, 3, 3, sleeve);
      thick(lx + 1, 16 + t, 9, 7 + t, sleeve);
    } else if (holding) {
      g.rect(lx, 15 + t, 3, 5, sleeve);
      thick(lx + 1, 19 + t, 10, 20 + t, sleeve);
    }
    // His left (your right): the hook.
    if (holding) {
      g.rect(rx, 15 + t, 3, 5, sleeve);
      thick(rx, 19 + t, 18, 20 + t, sleeve);
    } else {
      g.rect(rx, 15 + t, 3, 10, sleeve);
      hook(rx + 1, 25 + t);
    }
    // Face, brows, beard.
    g.oval(14, 9 + t, 3, 3, GHOST[2]);
    g.rect(11, 8 + t, 1, 3, GHOST[1]);
    if (hat !== 'on' && hat !== 'tipped') {
      g.oval(14, 6 + t, 4, 2, GHOST[1]);
      g.rect(12, 5 + t, 5, 1, GHOST[2]);
      g.set(10, 8 + t, GHOST[1]);
      g.set(18, 8 + t, GHOST[1]);
    }
    g.rect(12, 7 + t, 2, 1, GHOST[3]);
    g.rect(16, 7 + t, 2, 1, GHOST[3]);
    if (eyes === 'shut') { g.rect(13, 9 + t, 2, 1, GHOST[0]); g.rect(16, 9 + t, 2, 1, GHOST[0]); }
    else { g.set(13, 8 + t, GHOST_EYE); g.set(16, 8 + t, GHOST_EYE); }
    g.poly([[10, 10 + t], [19, 10 + t], [18, 14 + t], [15, 17 + t], [13, 17 + t], [11, 14 + t]], GHOST[3]);
    g.rect(12, 10 + t, 6, 1, GHOST[3]);
    g.rect(13, 12 + t, 3, 1, arm === 'mouth' ? GHOST_EYE : GHOST[2]);
    g.set(15, 10 + t, GHOST[2]);
    if (hat === 'on') tricorn(5 + t, 'front');
    if (hat === 'tipped') {
      // Lifted off, his hand on it.
      tricorn(3 + t, 'front');
      hand(8, 5 + t);
    }
    // The trumpet at his mouth (his hand on it), flaring away toward you.
    if (arm === 'mouth') { trumpetLevel(15, 12 + t, 11); hand(13, 12 + t); }
    // Held in front of him: the hat at his chin or his chest, or the folded coat held out.
    if (arm === 'hat' || arm === 'hatChin') {
      const y = arm === 'hatChin' ? 15 + t : 19 + t;
      g.oval(14, y, 4, 2, CAP_HAT[1]);
      g.rect(9, y + 1, 11, 2, CAP_HAT[0]);
      g.rect(10, y + 1, 9, 1, CAP_BRASS[0]);
      hand(9, y);
      hook(18, y);
    }
    if (arm === 'coatOut') {
      g.rect(11, 18 + t, 13, 4, CAP_COAT[1]);
      g.rect(11, 18 + t, 13, 1, CAP_COAT[3]);
      g.rect(11, 20 + t, 13, 1, CAP_COAT[0]);
      g.set(15, 19 + t, CAP_BRASS[1]);
      g.set(19, 19 + t, CAP_BRASS[1]);
      g.set(22, 21 + t, CAP_BRASS[1]);
      hand(10, 19 + t);
      hook(23, 19 + t);
    }
  }
  if (sink) {
    // Sinking down at the table: everything drops, the fog under him goes into the floor.
    for (let y = g.h - 1; y >= 0; y--) for (let x = 0; x < g.w; x++) g.cells[y][x] = y >= sink ? g.cells[y - sink][x] : null;
  }
  g.outline(GHOST_OUT);
  g.outline(gold ? CAP_RIM_GOLD : flick ? 'rgba(150, 255, 230, 0.42)' : GHOST_RIM);
  if (fade > 0) {
    // Going: thinner all over, and gone in a fine pattern, the fog end first.
    for (let y = 0; y < g.h; y++) {
      for (let x = 0; x < g.w; x++) {
        const c = g.cells[y][x];
        if (!c) continue;
        const edge = fade + (y / g.h) * 0.35 - 0.2;
        g.cells[y][x] = BAYER4[y % 4][x % 4] / 16 < edge ? null : thinned(c, 1 - fade * 0.7);
      }
    }
  }
  return g.rows();
}

// His coat on the deck, folded over once by itself (captain_beaten).
function captainCoat() {
  const g = new Grid(24, 12);
  g.poly([[1, 10], [5, 4], [12, 2], [20, 3], [23, 8], [22, 11], [2, 11]], '#3e5a52');
  g.poly([[5, 4], [12, 2], [20, 3], [17, 6], [7, 7]], '#5a7a6c');
  g.line(7, 7, 17, 6, '#86aa9a');
  g.line(3, 10, 21, 10, '#2a3c36');
  for (const x of [9, 13, 17]) g.set(x, 8, BRASS[2]);
  g.rect(18, 4, 3, 2, '#86aa9a');
  g.outline(OUT);
  return g.rows();
}

// His animations (see the cutscenes' `animate` steps):
//   gs_captain_trace      at the chart table, back to you, a finger going along the course; breathing, shimmering (loop)
//   gs_captain_turn       turning round to face you (once)
//   gs_captain_idle       facing you, the trumpet hanging; the coat stirring, a flicker (loop)
//   gs_captain_trumpet    the speaking-trumpet up to his mouth, and held there (once)
//   gs_captain_set_down   the trumpet put away, his hands empty (once); then gs_captain_idle_empty (loop)
//   gs_captain_hat_chest  the hat off and held to his chest (once, from empty hands)
//   gs_captain_sink       beaten: hat off to his chest, and down he sinks, eyes shut (once)
//   gs_captain_slump_bare beaten: the same with the coat gone from him (loop)
//   gs_captain_turn_back  beaten: turning back to the table, coat and hat gone (once); then gs_captain_trace_bare (loop)
//   gs_captain_coat_off   spared: from hat-to-chest, the coat off and held out to you (once)
//   gs_captain_bare_idle  spared: in his shirt and waistcoat, hat on straight (loop)
//   gs_captain_fade       spared: turning to the stern window, gone in the morning (once)
const captainLoop = (base) => [
  captain({ ...base, breath: 0, stir: 0 }),
  captain({ ...base, breath: 0, stir: 1, flick: 1 }),
  captain({ ...base, breath: 1, stir: 2 }),
  captain({ ...base, breath: 1, stir: 0, flick: 1 }),
];
const capFrames = (list) => Object.fromEntries(list.map((rows, i) => [`f${i + 1}`, rows]));
const CAP_TRACE = [0, 1, 2, 2].map((trace, i) => captain({ view: 'back', arm: 'trace', trace, breath: i >> 1, stir: i, flick: i % 2 }));
const CAP_TRACE_BARE = [0, 1, 2, 2].map((trace, i) => captain({ view: 'back', arm: 'trace', coat: false, hat: 'off', trace, breath: i >> 1, stir: i, flick: i % 2 }));
export const GS_CAPTAIN_TRACE_SPRITES = capFrames(CAP_TRACE);
export const GS_CAPTAIN_TURN_SPRITES = capFrames([
  captain({ view: 'back', arm: 'trace' }),
  captain({ view: 'back', arm: 'down' }),
  captain({ view: 'side' }),
  captain({ view: 'front', flick: 1 }),
  captain({ view: 'front' }),
]);
export const GS_CAPTAIN_IDLE_SPRITES = capFrames(captainLoop({}));
export const GS_CAPTAIN_TRUMPET_SPRITES = capFrames([
  captain({}),
  captain({ arm: 'level' }),
  captain({ arm: 'mouth', breath: 1 }),
  captain({ arm: 'mouth', flick: 1 }),
]);
export const GS_CAPTAIN_SET_DOWN_SPRITES = capFrames([captain({}), captain({ arm: 'level' }), captain({ arm: 'empty', flick: 1 }), captain({ arm: 'empty' })]);
export const GS_CAPTAIN_IDLE_EMPTY_SPRITES = capFrames(captainLoop({ arm: 'empty' }));
export const GS_CAPTAIN_HAT_CHEST_SPRITES = capFrames([
  captain({ arm: 'empty' }),
  captain({ arm: 'hatHand' }),
  captain({ arm: 'hatHand', hat: 'tipped' }),
  captain({ arm: 'hatChin', hat: 'off' }),
  captain({ arm: 'hat', hat: 'off', flick: 1 }),
  captain({ arm: 'hat', hat: 'off' }),
]);
export const GS_CAPTAIN_SINK_SPRITES = capFrames([
  captain({}),
  captain({ arm: 'hatHand', hat: 'tipped' }),
  captain({ arm: 'hatChin', hat: 'off' }),
  captain({ arm: 'hat', hat: 'off', sink: 1 }),
  captain({ arm: 'hat', hat: 'off', sink: 2, eyes: 'shut' }),
  captain({ arm: 'hat', hat: 'off', sink: 3, eyes: 'shut', flick: 1 }),
]);
export const GS_CAPTAIN_SLUMP_BARE_SPRITES = capFrames([
  captain({ arm: 'hat', hat: 'off', coat: false, sink: 3, eyes: 'shut' }),
  captain({ arm: 'hat', hat: 'off', coat: false, sink: 3, eyes: 'shut', flick: 1, stir: 1 }),
  captain({ arm: 'hat', hat: 'off', coat: false, sink: 3, eyes: 'shut', breath: 1, stir: 2 }),
  captain({ arm: 'hat', hat: 'off', coat: false, sink: 3, eyes: 'shut', breath: 1, flick: 1 }),
]);
export const GS_CAPTAIN_TURN_BACK_SPRITES = capFrames([
  captain({ arm: 'hat', hat: 'off', coat: false, sink: 3, eyes: 'shut' }),
  captain({ arm: 'empty', hat: 'off', coat: false, sink: 1 }),
  captain({ view: 'back', arm: 'down', hat: 'off', coat: false }),
  CAP_TRACE_BARE[0],
]);
export const GS_CAPTAIN_TRACE_BARE_SPRITES = capFrames(CAP_TRACE_BARE);
export const GS_CAPTAIN_COAT_OFF_SPRITES = capFrames([
  captain({ arm: 'hat', hat: 'off' }),
  captain({ arm: 'empty', hat: 'off' }),
  captain({ arm: 'empty', hat: 'off', coat: false, flick: 1 }),
  captain({ arm: 'coatOut', hat: 'off', coat: false }),
  captain({ arm: 'coatOut', hat: 'off', coat: false, flick: 1 }),
]);
export const GS_CAPTAIN_BARE_IDLE_SPRITES = capFrames(captainLoop({ arm: 'empty', coat: false }));
export const GS_CAPTAIN_FADE_SPRITES = capFrames([
  // A moment still facing you (the nearly-smile), then his back to you at the window, and the light takes him.
  ...captainLoop({ arm: 'empty', coat: false }),
  captain({ arm: 'empty', coat: false }),
  captain({ view: 'back', arm: 'down', coat: false }),
  captain({ view: 'back', arm: 'down', coat: false, gold: true }),
  ...[0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1.3].map((fade) => captain({ view: 'back', arm: 'down', coat: false, gold: true, fade })),
]);

// The animations (each its own export: the engine finds NAME_SPRITES and plays NAME).
// The swing, a frame every 0.08 s: hauled up, then let go. It starts slow and falls faster and faster (the
// angles go as the square of the time), lands flat with a puff, kicks up off the quay and settles. Lands on
// frame 15 (1.12 s in): the scene's thump is timed to that.
const GANGWAY_UP = 66;
const GANGWAY_FALL = 14;
const gangwayFrames = [];
for (let k = 0; k <= GANGWAY_FALL; k++) {
  const t = k / GANGWAY_FALL;
  gangwayFrames.push(gangwayAt(GANGWAY_UP * (1 - t * t), k === 0 ? 'taut' : k < 4 ? 'whip' : 'hang', k === GANGWAY_FALL ? 1 : 0));
}
gangwayFrames.push(gangwayAt(4, 'hang', 2), gangwayAt(1.5, 'hang', 3), gangwayAt(0, 'hang', 3), gangwayAt(0, 'hang', 0));

export const GS_GANGWAY_SWING_SPRITES = Object.fromEntries(gangwayFrames.map((rows, i) => [`f${i + 1}`, rows]));

export const GS_GHOST_RAIL_SPRITES = { f1: sailorAtRail(0), f2: sailorAtRail(1) };
export const GS_GHOST_BOY_SPRITES = { f1: boyCoiling(0), f2: boyCoiling(1) };
export const GS_GHOST_BOY_WAVE_SPRITES = { f1: boyWaving(0), f2: boyWaving(1) };
export const GS_GHOST_OLD_SPRITES = { f1: oldHand(0), f2: oldHand(1) };
export const GS_GHOST_SLEEPER_SPRITES = { f1: sleeper(0), f2: sleeper(1) };
export const GS_GHOST_LOOKOUT_SPRITES = { f1: lookout(0), f2: lookout(1) };
export const GS_GHOST_MATE_SPRITES = { f1: mate(0), f2: mate(1) };
export const GS_LANTERN_SPRITES = { f1: lantern(0), f2: lantern(1) };
export const GS_CHAIR_SPRITES = { f1: chair(0), f2: chair(1) };
// The fog bell on the Watch Rock, rung: it swings out and back.
export const GS_WATCH_BELL_SPRITES = { f1: watchBell(0), f2: watchBell(1), f3: watchBell(0), f4: watchBell(-1) };

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
  gs_ghost_boy_wave: GS_GHOST_BOY_WAVE_SPRITES.f1,
  gs_ghost_old: GS_GHOST_OLD_SPRITES.f1,
  gs_ghost_sleeper: GS_GHOST_SLEEPER_SPRITES.f1,
  gs_ghost_lookout: GS_GHOST_LOOKOUT_SPRITES.f1,
  gs_ghost_mate: GS_GHOST_MATE_SPRITES.f1,
  // Captain Tarry standing still, facing you (a plain look, 'prop:gs_captain'; its _back is him at the chart table), and his coat on the deck.
  gs_captain: GS_CAPTAIN_IDLE_SPRITES.f1,
  gs_captain_back: GS_CAPTAIN_TRACE_SPRITES.f1,
  gs_captain_coat: captainCoat(),
  gs_prints_a: prints(0),
  gs_prints_b: prints(1),
  gs_handprint: handprint(),
  gs_chalk: chalk(),
  gs_chalk_jib: chalkWord('JIB'),
  gs_chalk_main: chalkWord('MAIN'),
  gs_chalk_fore: chalkWord('FORE'),
  gs_chalk_tops: chalkWord("TOPS'L"),
  gs_chalk_go_east: chalkWord('P', 'right'),
  gs_chalk_go_north: chalkWord('S', 'up'),
  gs_chalk_go_south: chalkWord('P', 'down'),
  gs_nook: nook(),
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
  // The same door in a side wall: shut, swinging, open (src/overworld/prop.js `openLook`/`ajarLook`).
  gs_side_door: sideDoor('shut', true),
  gs_side_door_ajar: sideDoor('ajar', true),
  gs_side_door_open: sideDoor('open', true),
  // Every way out through a side wall of the ship, standing open with a light coming through (added by room.js).
  gs_exit_door: sideDoor('open', true),
  gs_door_frame: doorFrame(),
  gs_side_door_low: sideDoor('shut', false),
  gs_side_door_low_ajar: sideDoor('ajar', false),
  gs_side_door_low_open: sideDoor('open', false),
  // Nothing to see: the upper tile of a two-tile door (the door on the tile below reaches up over it).
  gs_bulk_door_top: new Grid(16, 16).rows(),
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
  // Her gangway hauled up against her side (until ship_boarding), and down on the quay (after it).
  gs_gangway_up: gangwayFrames[0],
  gs_gangway_down: gangwayFrames[gangwayFrames.length - 1],
  // Nothing to see: what stops you at her rail while the gangway is up (the gangway itself is drawn by gs_gangway_up).
  gs_rail_gap: new Grid(16, 16).rows(),
  gs_quay_lamp: quayLamp(),
  gs_owners_board: ownersBoard(),
  gs_shadow_a: rigShadow(0),
  gs_shadow_b: rigShadow(1),
  gs_fog_a: fogWisp(0),
  gs_fog_b: fogWisp(1),
  gs_fog_c: fogWisp(2),
  gs_fog_wall: fogWall(0),
  gs_fog_wall_b: fogWall(1),
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
  gs_watch_bell: watchBell(0, true),
  gs_watch_bell_mute: watchBell(0, false),
  gs_doorstop: doorstop(),
  gs_log_bottle: logBottle(),
  gs_point_steps: pointSteps(),
  gs_fog_tally: fogTally(),
  gs_cave_mouth: caveMouth(),
  gs_hull_rock: hullFromRock(),
  ...ART2_SPRITES,
};

export const GS_PALETTE = palette;
// How many tiles wide each stands, for the wide ones.
export const GS_FOOTPRINTS = {
  gs_helm: 2, gs_hatch: 2, gs_hatch_shut: 2, gs_ghost_sleeper: 2, gs_chalk: 2, gs_chalk_jib: 2, gs_chalk_main: 2, gs_chalk_fore: 2, gs_chalk_tops: 2, gs_chalk_go_east: 2,
  gs_chalk_go_north: 2, gs_chalk_go_south: 2, gs_chart_table: 2, gs_bunk: 2,
  gs_log_desk: 2, gs_letter_rack: 2, ...ART2_FOOTPRINTS, gs_nameboard: 3, gs_figurehead: 2, gs_figurehead_dark: 2, gs_shadow_a: 2, gs_shadow_b: 2, gs_fog_a: 2, gs_fog_b: 2, gs_fog_c: 2, gs_rail_broken: 2, gs_sail_heap: 2, gs_spar_fallen: 3, gs_ratlines: 2, gs_rail_segment: 2,
  gs_watch_bell: 2, gs_watch_bell_mute: 2, gs_gangway_up: 6, gs_gangway_down: 6, gs_point_steps: 2, gs_cave_mouth: 2, gs_hull_rock: 8,
};

// What glows (lamplight.js): the lantern on its hook, and a harmonium key that has been pressed. The
// ghosts give no light: they are only there in the lantern's.
const LANTERN_LIGHT = '255, 214, 140';
export const GS_GLOWS = {
  // A way out: a soft warm light spilling through the open doorway, so the exits stand out from the cold lamps.
  gs_exit_door: [
    { dy: -14, bloom: 18, strength: 0.85, flicker: 0.12, color: '255, 200, 130' },
    { dy: -8, pool: 72, strength: 0.7, flicker: 0.1, color: '255, 190, 115' },
  ],
  // Ways down: a ladder, a hatch, the bilge hatch, with a faint warm light coming up out of the dark below.
  gs_ladder: [{ dy: -6, pool: 46, strength: 0.9, flicker: 0.1, color: '255, 196, 125' }],
  gs_hatch: [{ dy: -6, pool: 60, strength: 0.8, flicker: 0.1, color: '255, 196, 125' }],
  gs_bilge_hatch_open: [{ dy: -6, pool: 46, strength: 0.9, flicker: 0.1, color: '255, 196, 125' }],
  // A bulkhead gate or cabin door once it stands open: the same warm spill as the doorframes.
  gs_door_frame: [{ dy: -8, bloom: 14, strength: 0.7, flicker: 0.1, color: '255, 200, 130' }, { dy: -6, pool: 64, strength: 0.7, flicker: 0.1, color: '255, 190, 115' }],
  gs_side_door_open: [{ dy: -8, pool: 56, strength: 0.55, flicker: 0.1, color: '255, 190, 115' }],
  gs_side_door_low_open: [{ dy: -8, pool: 56, strength: 0.55, flicker: 0.1, color: '255, 190, 115' }],
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
  // The star in her breast (figureheadWake.js): 40 pixels right of the prop's foot, 54 up. Asleep she is dark: only a
  // glimmer gets out under her hand.
  gs_figurehead: [{ dx: 40, dy: -54, bloom: 8, strength: 0.32, flicker: 0.2, color: '150, 210, 255' }, { dx: 36, dy: -44, pool: 40, strength: 0.16, flicker: 0.12, color: '120, 190, 255' }],
  gs_stern_window: [{ dy: -10, pool: 70, strength: 0.34, flicker: 0, color: '110, 170, 210' }],
  gs_harm_1_on: [{ dy: -4, pool: 26, strength: 0.25, flicker: 0.1, color: '200, 230, 220' }],
  gs_harm_2_on: [{ dy: -4, pool: 26, strength: 0.25, flicker: 0.1, color: '200, 230, 220' }],
  gs_harm_3_on: [{ dy: -4, pool: 26, strength: 0.25, flicker: 0.1, color: '200, 230, 220' }],
  gs_harm_4_on: [{ dy: -4, pool: 26, strength: 0.25, flicker: 0.1, color: '200, 230, 220' }],
};
