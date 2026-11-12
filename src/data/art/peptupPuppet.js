// KING PEPTUP on the stage, in battle (the overworld keeps the painted king of
// belowFolk.js): a jointed artist's mannequin of pale wood hanging on strings
// from a wooden control bar. An egg of a head with no face on it at all,
// until he wants one: then he raises a hand and DIGS it into the wood with
// his fingertips (a grin, a scowl, a gape: GOUGES), and wipes his head smooth
// again after. A tarnished crown a size too big and slipping, and a rag of
// his old purple cape off one shoulder (until he comes alive in his last act:
// then they're flung off him and he's bare wood, `bare`). Lit by one cold
// spotlight from above.
//
// The sprite is 88 wide and 82 tall (drawn at double size): the bar near the
// top (room above it for the rafters, where Tuck works him: rumboldBattle.js),
// and him hanging below it on long strings, feet just over the boards. Built
// from shapes: every limb is a rounded capsule shaded by the light, every
// bend a ball joint, and each part gets its own dark outline so the parts
// read apart.
//
// With `glow` (0 to 3) there's a light inside the hollow wood (his last act),
// a fire burning in his ribcage: it shows through the gaps at his joints, the
// slits between his ribs, the crack in his head and every cut he digs, and
// lights the wood from below (the chin and chest bright, the brow in shadow,
// the far limbs gone dark).

const LOCAL_COLORS = {
  k: '#0a0710', // outline
  // Pale wood, from the lit top down into shadow
  1: '#f6e6c4',
  2: '#e6c896',
  3: '#c9a06a',
  4: '#8e6844',
  5: '#563c28',
  6: '#2c1c14', // grain, seams, the gaps at the joints
  d: '#120c18', // the bottom of a deep cut
  // The crown, tarnished
  g: '#d4ac48',
  G: '#9a7428',
  h: '#5a4218',
  j: '#8e1c2c', // jewel
  J: '#f0dc96', // glint
  // The cape rag
  u: '#5c3c7c',
  U: '#3a2452',
  v: '#7c5c9c',
  m: '#d6cfc0', // ermine, dirty
  M: '#26222c', // ermine tails
  // The control bar
  w: '#7a5634',
  W: '#553a22',
  x: '#33221a',
  X: '#b8903e', // brass
  s: '#d8d2c4', // string
  // The light inside him: a fire, deep orange out to a yellow-white core
  '`': '#fff0b4', // core
  ',': '#ff8a1c', // flame
  o: '#d84a0c', // ember, the edge of it
  // Wood lit by it from inside, hot to dim
  a: '#f8d8a8',
  A: '#dcae78',
  B: '#9a7048',
  // The border hung across the top of the stage (rumboldBattle.js), rotted
  q: '#1e0a10',
  Q: '#2c1018',
  z: '#12060a',
};

const REMAP = {};
export const PUPPET_PALETTE = {};
Object.entries(LOCAL_COLORS).forEach(([letter, color], i) => {
  const char = String.fromCharCode(0xe700 + i);
  REMAP[letter] = char;
  PUPPET_PALETTE[char] = color;
});
const remap = (rows) => rows.map((row) => [...row].map((ch) => REMAP[ch] ?? ch).join(''));
// The character a colour letter here turns into, for the art drawn round him
// (rumboldBattle.js); and the light's core, for the stage's bloom over it
// (puppetStage.js).
export const puppetChar = (letter) => REMAP[letter];
export const PUPPET_GLOW_CORE = REMAP['`'];

// The border across the top of the stage, hiding the rafters: rotted velvet
// in folds, ragged at the hem. By column of the stage (in pairs of screen
// pixels, as the sprite draws it), so the backdrop (theatreBackdrop.js) and
// the king's sprite draw the same cloth: which colour, and its last row.
export const BORDER_COLORS = { z: LOCAL_COLORS.z, q: LOCAL_COLORS.q, Q: LOCAL_COLORS.Q };
export function borderAt(col) {
  const fold = ((col % 6) + 6) % 6;
  const color = fold <= 1 ? 'z' : fold <= 3 ? 'q' : 'Q';
  const n = Math.sin(col * 127.1 + 311.7) * 43758.5453;
  return { color, hem: 10 + Math.floor((n - Math.floor(n)) * 3) };
}

export const PW = 88;
export const PH = 82;

class Cv {
  constructor(w = PW, h = PH) {
    this.w = w;
    this.h = h;
    this.g = Array.from({ length: h }, () => Array(w).fill('.'));
  }
  get(x, y) { return this.g[y]?.[x]; }
  px(x, y, c) {
    x = Math.round(x);
    y = Math.round(y);
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.g[y][x] = c;
    return this;
  }
  line(x0, y0, x1, y1, c) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) this.px(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c);
    return this;
  }
  // A line bowed sideways by `sag` in the middle (a slack string).
  curve(x0, y0, x1, y1, sag, c) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      this.px(x0 + (x1 - x0) * t + Math.sin(t * Math.PI) * sag, y0 + (y1 - y0) * t, c);
    }
    return this;
  }
  stamp(other, ox = 0, oy = 0) {
    other.g.forEach((row, j) => row.forEach((ch, i) => { if (ch !== '.') this.px(ox + i, oy + j, ch); }));
    return this;
  }
  outline(c = 'k') {
    const keep = this.g.map((row) => [...row]);
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (keep[y][x] !== '.') continue;
        if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => (keep[y + dy]?.[x + dx] ?? '.') !== '.')) this.g[y][x] = c;
      }
    }
    return this;
  }
  // The same canvas turned by `ang` radians about (cx, cy).
  turned(ang, cx, cy) {
    const out = new Cv(this.w, this.h);
    const cos = Math.cos(ang);
    const sin = Math.sin(ang);
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const ch = this.get(Math.round(cx + dx * cos + dy * sin), Math.round(cy - dx * sin + dy * cos));
        if (ch && ch !== '.') out.g[y][x] = ch;
      }
    }
    return out;
  }
  rows() { return this.g.map((row) => row.join('')); }
}

// --- Shading ---
// One light, from above and a little to the left (the spotlight).
const L = (() => { const v = [-0.4, -0.6, 0.7]; const n = Math.hypot(...v); return v.map((a) => a / n); })();
const WOOD = ['1', '2', '3', '4', '5'];
const BAR = ['X', 'w', 'w', 'W', 'x'];
// (The head is shaded softer, so its underside doesn't go dark like a beard.)
const HEAD = ['1', '2', '2', '2', '3'];
const shade = (ramp, nx, ny) => {
  const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
  const v = nx * L[0] + ny * L[1] + nz * L[2];
  return v > 0.9 ? ramp[0] : v > 0.65 ? ramp[1] : v > 0.35 ? ramp[2] : v > 0.05 ? ramp[3] : ramp[4];
};

// How lit up inside he is while drawing the current figure: null for plain
// wood, 0 to 3 for the hollow, lit one (see puppetRows).
let GLOW = null;

// A rounded limb from a to b, radius r0 at a and r1 at b.
function capsule(c, [ax, ay], [bx, by], r0, r1, ramp = WOOD) {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy || 1;
  const rm = Math.max(r0, r1) + 1;
  for (let y = Math.floor(Math.min(ay, by) - rm); y <= Math.ceil(Math.max(ay, by) + rm); y++) {
    for (let x = Math.floor(Math.min(ax, bx) - rm); x <= Math.ceil(Math.max(ax, bx) + rm); x++) {
      const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / len2));
      const r = r0 + (r1 - r0) * t;
      const ox = x - (ax + dx * t);
      const oy = y - (ay + dy * t);
      if (ox * ox + oy * oy > r * r) continue;
      c.px(x, y, shade(ramp, ox / r, oy / r));
    }
  }
}

// A ball joint.
function ball(c, cx, cy, r, ramp = WOOD) {
  for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) {
    for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
      const nx = (x - cx) / r;
      const ny = (y - cy) / r;
      if (nx * nx + ny * ny > 1) continue;
      c.px(x, y, shade(ramp, nx, ny));
    }
  }
}

const part = (draw) => { const c = new Cv(); draw(c); return c.outline(); };

// --- The skeleton ---
// Left side as you look at him (the right is the mirror image across x 44).
const MID = 44;
const mirror = ([x, y]) => [2 * MID - x, y];
// He's drawn smaller than the skeleton below is written: every point is
// pulled in towards his feet (P) and every radius shrunk (R), so he hangs
// high on long strings from the bar.
const K = 0.72;
const FEET = 80;
const P = ([x, y]) => [MID + (x - MID) * K, FEET - (FEET - y) * K];
const R = (r) => Math.max(0.9, r * K);

const ARMS = {
  hang: { e: [34, 49], w: [34, 59] },
  sag: { e: [33, 49], w: [36, 59] },
  limp: { e: [36, 50], w: [37, 61] },
  out: { e: [25, 36], w: [13, 33] },
  half: { e: [28, 44], w: [19, 40] },
  up: { e: [27, 30], w: [28, 19] },
  snap: { e: [27, 40], w: [25, 30] },
  hip: { e: [28, 46], w: [36, 51] },
  reach: { e: [26, 44], w: [14, 50] },
  // No arm drawn at all: the stage reaches his hands over the box instead
  // (battle/puppetStage.js).
  none: { e: [34, 49], w: [34, 59] },
};
const LEGS = {
  dangle: { k: [40, 68], a: [40, 76] },
  limp: { k: [41, 68], a: [42, 76] },
  splay: { k: [35, 67], a: [36, 76] },
  kick: { k: [33, 63], a: [34, 72] },
  fold: { k: [31, 70], a: [38, 76] },
};
const SHOULDER = [37, 37];
const HIP = [41, 58];

export const PUPPET_POSES = {
  idle: { l: 'hang', r: 'sag', ll: 'dangle', rl: 'dangle' },
  swing: { l: 'sag', r: 'hang', ll: 'dangle', rl: 'dangle' },
  half: { l: 'half', r: 'half', ll: 'dangle', rl: 'dangle' },
  gesture: { l: 'out', r: 'out', ll: 'splay', rl: 'splay' },
  wave: { l: 'up', r: 'hip', ll: 'kick', rl: 'dangle' },
  jam: { l: 'limp', r: 'sag', ll: 'limp', rl: 'dangle' },
  limp: { l: 'limp', r: 'limp', ll: 'limp', rl: 'limp' },
  heap: { l: 'limp', r: 'limp', ll: 'fold', rl: 'fold' },
};
const poseOf = (pose) => ({ ...PUPPET_POSES.idle, ...(typeof pose === 'string' ? PUPPET_POSES[pose] : pose) });

// One arm (in left-side coordinates; `flip` mirrors it to the right): upper
// arm, elbow, forearm, wrist, and a carved mitten of a hand pointing on
// along the forearm, the thumb on the inside.
// `kind` can also be { tip: [x, y] } (in the drawn, shrunk coordinates): the
// hand raised with its fingertips at that point, reaching up to his face.
function armJoints(kind, flip) {
  const f = flip ? (q) => P(mirror(q)) : P;
  const s = f(SHOULDER);
  if (kind?.tip) {
    // The fingers point up and in; the wrist sits behind them, and the elbow
    // folds out to the side to reach (two bones of 8.5).
    const ux = flip ? -0.6 : 0.6;
    const uy = -0.8;
    const w = [kind.tip[0] - ux * 4.4, kind.tip[1] - uy * 4.4];
    const dx = w[0] - s[0];
    const dy = w[1] - s[1];
    const d = Math.min(16.8, Math.hypot(dx, dy));
    const bend = Math.acos(Math.min(1, d / 17)) * (flip ? 1 : -1);
    const ang = Math.atan2(dy, dx) + bend;
    return { s, e: [s[0] + Math.cos(ang) * 8.5, s[1] + Math.sin(ang) * 8.5], w };
  }
  const a = ARMS[kind] ?? ARMS.hang;
  return { s, e: f(a.e), w: f(a.w) };
}

function arm(kind, flip) {
  if (kind === 'none') return new Cv();
  const { s, e, w } = armJoints(kind, flip);
  return part((c) => {
    capsule(c, s, e, R(2), R(1.7));
    capsule(c, e, w, R(1.7), R(1.4));
    // The hand.
    const len = Math.hypot(w[0] - e[0], w[1] - e[1]) || 1;
    const ux = (w[0] - e[0]) / len;
    const uy = (w[1] - e[1]) / len;
    const tip = [w[0] + ux * 4.4, w[1] + uy * 4.4];
    capsule(c, [w[0] + ux, w[1] + uy], tip, R(2.2), R(1.8));
    // The thumb, towards the body.
    const side = (flip ? -1 : 1) * (uy >= 0 ? 1 : -1);
    const thumb = [w[0] + ux * 1.5 - uy * 2.2 * side, w[1] + uy * 1.5 + ux * 2.2 * side];
    capsule(c, [w[0] + ux, w[1] + uy], thumb, R(1.1), R(0.9));
    // Clawing: three long fingers spread from the hand, fingertips together
    // at the point.
    if (kind?.claw) {
      const px = -uy;
      const py = ux;
      [-2, 0, 2].forEach((o) => c.line(tip[0] - ux * 2 + px * o * 0.6, tip[1] - uy * 2 + py * o * 0.6, tip[0] + ux * 0.4 + px * o * 0.35, tip[1] + uy * 0.4 + py * o * 0.35, '2'));
    }
    ball(c, ...e, R(1.9));
    ball(c, ...w, R(1.5));
    ball(c, ...s, R(2.6));
  });
}

function leg(kind, flip) {
  const g = LEGS[kind] ?? LEGS.dangle;
  const f = flip ? (q) => P(mirror(q)) : P;
  const h = f(HIP);
  const k = f(g.k);
  const a = f(g.a);
  return part((c) => {
    capsule(c, h, k, R(2.6), R(2));
    capsule(c, k, a, R(2), R(1.5));
    // The foot, hanging toes down.
    capsule(c, [a[0], a[1] + 0.8], [a[0] + (flip ? -0.4 : 0.4), a[1] + 3.3], R(1.7), R(1.1));
    ball(c, ...k, R(2.2));
    ball(c, ...a, R(1.5));
    ball(c, ...h, R(2.5));
  });
}

function body() {
  return part((c) => {
    // The pelvis and the ball at the waist.
    capsule(c, P([MID, 53]), P([MID, 55.5]), R(4.6), R(3.8));
    capsule(c, P([MID - 3, 57]), P([MID + 3, 57]), R(2.2), R(2.2));
    ball(c, ...P([MID, 49.5]), R(2.4));
    // The chest: a block tapering to the waist, the shoulders a rounded bar.
    capsule(c, P([MID, 38]), P([MID, 45.5]), R(5.8), R(4));
    capsule(c, P([MID - 6, 36.5]), P([MID + 6, 36.5]), R(2.4), R(2.4));
    // The breastbone.
    c.line(...P([MID, 39.5]), ...P([MID, 43.5]), '4');
    // Lit up inside: one small flame burning in a hollow in his chest, and
    // nothing else of him lit (the only other light is in his eyes).
    if (GLOW !== null && GLOW >= 1) {
      for (let y = 40; y <= 44; y++) for (let x = MID - 2; x <= MID + 2; x++) c.px(...P([x, y]), 'd');
      const flame = [[0, 40.4, 'o'], [0, 41.4, ','], [-1, 42.4, 'o'], [0, 42.4, GLOW >= 2 ? '`' : ','], [1, 42.4, 'o'], [-1, 43.4, ','], [0, 43.4, '`'], [1, 43.4, ',']];
      flame.forEach(([dx, y, ch]) => c.px(...P([MID + dx, y]), ch));
    }
    // The neck post.
    capsule(c, P([MID, 34]), P([MID, 30]), R(1.5), R(1.4));
  });
}

// The rag of his cape over the left shoulder: a strip of dirty ermine and the
// purple hanging in torn tails.
function cape() {
  return part((c) => {
    const hem = [52, 58, 50, 62, 55, 60, 48, 57, 53, 61, 50, 56, 47, 45];
    for (let j = 0; j < 10; j++) {
      const i = Math.min(hem.length - 1, Math.round(j / K));
      const x = 31 + j;
      const top = Math.round(P([0, 35 + Math.max(0, 6 - i)])[1]);
      const bottom = Math.round(P([0, hem[i]])[1]);
      for (let y = top; y <= bottom; y++) c.px(x, y, j % 3 === 0 ? 'U' : j % 3 === 2 ? 'v' : 'u');
    }
    [[32, 53], [35, 56], [33, 58]].forEach(([x, y]) => c.px(x, y, 'U'));
    for (let x = 34; x <= 42; x++) { c.px(x, 47, 'm'); c.px(x, 48, x % 3 === 1 ? 'M' : 'm'); }
    c.px(32, 48, 'm'); c.px(33, 48, 'm');
  });
}

// --- The faces he digs ---
// Each a list of strokes, in the order he digs them (in the drawn
// coordinates; his head's middle is at 44, 37).
// Which strokes of each face are its eyes.
const EYES = { grin: [0, 1], scowl: [2, 3], gape: [0, 1], rictus: [0, 1], smile: [0, 1], glare: [0, 1], stare: [0, 1] };

export const GOUGES = {
  // A jack-o'-lantern grin: slanted eye gashes and a wide mouth with the
  // teeth left standing.
  grin: [
    [[38, 35], [39, 34], [40, 34], [41, 35], [42, 35]],
    [[46, 35], [47, 35], [48, 34], [49, 34], [50, 35]],
    [[37, 39], [38, 40], [39, 41], [40, 41], [41, 42], [42, 41], [43, 42], [44, 42], [45, 42], [46, 41], [47, 42], [48, 41], [49, 41], [50, 40], [51, 39]],
  ],
  // Brows hacked down to the middle, a flat hard mouth.
  scowl: [
    [[37, 33], [38, 33], [39, 34], [40, 34], [41, 35], [42, 36]],
    [[51, 33], [50, 33], [49, 34], [48, 34], [47, 35], [46, 36]],
    [[39, 37], [40, 37]],
    [[48, 37], [49, 37]],
    [[39, 42], [40, 41], [41, 41], [42, 41], [43, 41], [44, 41], [45, 41], [46, 41], [47, 41], [48, 41], [49, 42]],
  ],
  // Round eye holes and a gaping round mouth.
  gape: [
    [[39, 34], [40, 34], [41, 35], [41, 36], [40, 37], [39, 37], [38, 36], [38, 35]],
    [[47, 34], [48, 34], [49, 35], [49, 36], [48, 37], [47, 37], [46, 36], [46, 35]],
    [[43, 39], [44, 39], [45, 39], [46, 40], [46, 41], [45, 42], [44, 42], [43, 42], [42, 41], [42, 40]],
  ],
  // Phase 3's faces, dug harder and wrong. The grimace: lopsided, one eye
  // squeezed to a ">" slit and the other a wide staring ring, a gritted
  // mouth (top lip, bottom lip, the gaps between the teeth).
  rictus: [
    [[40, 34], [41, 35], [40, 36]],
    [[47, 33], [48, 33], [49, 34], [49, 35], [48, 36], [47, 36], [46, 35], [46, 34]],
    [[40, 40], [41, 40], [42, 40], [43, 40], [44, 40], [45, 40], [46, 40], [47, 40], [48, 40]],
    [[41, 42], [42, 42], [43, 42], [44, 42], [45, 42], [46, 42], [47, 42]],
    [[41, 41]], [[43, 41]], [[45, 41]], [[47, 41]],
  ],
  // The smile: pinprick slits for eyes set close, something dark leaking
  // down from each, and a grin cut too wide, the teeth left standing in it.
  smile: [
    [[41, 34], [41, 35]],
    [[47, 34], [47, 35]],
    [[39, 39], [40, 40], [41, 41], [42, 41], [43, 42], [44, 42], [45, 42], [46, 41], [47, 41], [48, 40], [49, 39]],
    [[42, 42]], [[44, 43]], [[46, 42]],
    [[41, 37], [41, 38], [40, 39]],
    [[47, 37], [47, 38]],
  ],
  // The stare: eyes dug out to the rim and not the same size, no brow, and
  // a mouth stitched shut.
  glare: [
    [[39, 33], [40, 33], [41, 34], [41, 35], [40, 36], [39, 36], [38, 35], [38, 34]],
    [[47, 34], [48, 34], [49, 35], [48, 36], [47, 36], [46, 35]],
    [[41, 41], [42, 41], [43, 41], [44, 41], [45, 41], [46, 41], [47, 41]],
    [[42, 40]], [[42, 42]], [[44, 40]], [[44, 42]], [[46, 40]], [[46, 42]],
  ],
  // Just eyes, dug deep, and nothing else: looking at you.
  stare: [
    [[39, 35], [40, 35], [41, 35], [41, 36], [40, 37], [39, 37], [39, 36]],
    [[47, 35], [48, 35], [49, 35], [49, 36], [48, 37], [47, 37], [47, 36]],
  ],
};
// The raw scratches his other fingers leave round a face as he drags it in:
// shallow strokes, dark in the grain, drawn once the face is done.
const SCRATCHES = {
  rictus: [[[37, 38], [36, 40], [36, 42]], [[51, 38], [52, 40], [52, 42]], [[41, 31], [43, 33]], [[47, 31], [45, 33]], [[37, 35], [38, 33]]],
  smile: [[[36, 38], [36, 36]], [[52, 38], [52, 36]], [[37, 32], [39, 32]], [[51, 32], [49, 32]], [[37, 43], [38, 44]]],
  glare: [[[37, 32], [38, 34]], [[51, 32], [50, 34]], [[40, 39], [41, 40]], [[47, 39], [46, 40]]],
  scowl: [[[36, 33], [37, 35]], [[52, 33], [51, 35]]],
};
// The points of a face in digging order, and how many there are.
const gougePath = (kind) => (GOUGES[kind] ?? []).flat();
export const gougeLength = (kind) => gougePath(kind).length;
// Where his fingertip is after digging `n` points of a face.
export const gougeTip = (kind, n) => gougePath(kind)[Math.max(0, Math.min(gougeLength(kind), n) - 1)] ?? [44, 37];

// The egg head. jaw: 0 to 3 (the jaw drops on a hinge); gouge: { kind, n },
// a face from GOUGES dug into it, the first n points of it (all of it if n is
// left out).
function head({ jaw = 0, gouge = null } = {}) {
  const c = new Cv();
  const [cx, cy] = [MID, 37.5];
  // The egg: wider at the top.
  for (let y = 28; y <= 47; y++) {
    for (let x = cx - 8; x <= cx + 8; x++) {
      const w = (y - cy) / 7.9;
      const u = (x - cx) / (6.1 * (1 - 0.16 * w));
      if (u * u + w * w > 1) continue;
      c.px(x, y, shade(HEAD, u * 0.95, w * 0.95));
    }
  }
  // A crack down the far side.
  const crack = '4';
  c.line(48, 30, 49, 33, crack); c.line(49, 33, 48, 35, crack);
  if (gouge) {
    // Each point is dug two pixels deep: the top of the cut in black shadow
    // under its upper wall, the bottom dark wood; a ring of pale raw wood
    // round it where the varnish has been torn away; and splinters sticking
    // out at the end of each stroke. Lit up inside, a point of the light
    // shows in each eye (EYES), and nowhere else.
    const strokes = [];
    let left = gouge.n ?? Infinity;
    for (const stroke of GOUGES[gouge.kind] ?? []) {
      if (left <= 0) break;
      strokes.push(stroke.slice(0, left));
      left -= stroke.length;
    }
    const pts = strokes.flat();
    // (The eyes are cut one pixel deep, the rest two: deep eyes run into the
    // edges of his head and read as hair.)
    const eyes = new Set((EYES[gouge.kind] ?? []).flatMap((i) => (strokes[i] ?? []).map(([x, y]) => `${x},${y}`)));
    const deep = new Set();
    pts.forEach(([x, y]) => { deep.add(`${x},${y}`); if (!eyes.has(`${x},${y}`)) deep.add(`${x},${y + 1}`); });
    const onHead = (x, y) => c.get(x, y) !== undefined && c.get(x, y) !== '.';
    const lit = GLOW !== null && GLOW >= 1;
    // (Lit up inside, the cut's rim is his own wood, not paler: pale
    // patches round the face read as bags under his eyes.)
    const rim = lit ? '2' : '1';
    deep.forEach((key) => {
      // (No raw ring round the eyes: under them it reads as pale bags.)
      if (eyes.has(key)) return;
      const [x, y] = key.split(',').map(Number);
      [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1]].forEach(([dx, dy]) => {
        const k = `${x + dx},${y + dy}`;
        if (!deep.has(k) && onHead(x + dx, y + dy)) c.px(x + dx, y + dy, rim);
      });
    });
    strokes.forEach((stroke) => {
      if (stroke.length < 2) return;
      const [x1, y1] = stroke[stroke.length - 1];
      const [x0] = stroke[stroke.length - 2];
      const sx = Math.sign(x1 - x0) || 1;
      if (onHead(x1 + sx, y1 - 1)) c.px(x1 + sx, y1 - 1, '1');
      if (onHead(x1 + 2 * sx, y1 - 1)) c.px(x1 + 2 * sx, y1 - 1, '2');
    });
    pts.forEach(([x, y]) => {
      c.px(x, y, 'd');
      if (!eyes.has(`${x},${y}`)) c.px(x, y + 1, '6');
    });
    if (lit) {
      (EYES[gouge.kind] ?? []).forEach((i) => {
        const eye = strokes[i];
        if (!eye?.length) return;
        // (In the middle of it: of a slit, its middle point; of a ring, the
        // hole in it.)
        const x = Math.round(eye.reduce((sum, p) => sum + p[0], 0) / eye.length);
        const y = Math.round(eye.reduce((sum, p) => sum + p[1], 0) / eye.length);
        c.px(x, y, ',');
        if (GLOW >= 3) c.px(x, y + 1, 'o');
      });
    }
    // Once a face is nearly dug, the scratches round it.
    if ((gouge.n ?? Infinity) >= gougeLength(gouge.kind) - 3) {
      (SCRATCHES[gouge.kind] ?? []).forEach((s) => s.slice(1).forEach(([x1, y1], i) => {
        const [x0, y0] = s[i];
        const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
        for (let k = 0; k <= n; k++) {
          const x = Math.round(x0 + ((x1 - x0) * k) / n);
          const y = Math.round(y0 + ((y1 - y0) * k) / n);
          if (onHead(x, y)) c.px(x, y, '3');
        }
      }));
    }
  }
  if (jaw > 0) {
    // The jaw drops on its hinge: everything below the seam moves down and a
    // dark slot opens (the light in it, lit up inside).
    const was = c.g.map((row) => [...row]);
    for (let y = PH - 1; y >= 43; y--) {
      for (let x = 39; x <= 49; x++) c.g[y][x] = y - jaw >= 43 ? was[y - jaw][x] : '.';
    }
    for (let y = 43; y < 43 + jaw; y++) {
      for (let x = 39; x <= 49; x++) c.px(x, y, x === 39 || x === 49 ? '5' : 'd');
    }
  }
  return c.outline();
}

// The crown, too big, tipped over his right ear and slipping.
function crown(tip = 0.2) {
  const c = new Cv();
  const x0 = 36;
  const base = 31;
  const heights = [1, 2, 3, 2, 1, 0, 1, 3, 5, 3, 1, 0, 1, 2, 3, 2, 1, 0];
  const flat = new Cv();
  heights.forEach((h, i) => {
    const x = x0 + i;
    for (let y = base - 2 - h; y <= base; y++) flat.px(x, y, y === base ? 'G' : i % 6 >= 4 ? 'G' : 'g');
    if (h >= 3) flat.px(x, base - 3 - h, 'j');
  });
  [3, 9, 15].forEach((i) => flat.px(x0 + i, base - 1, 'j'));
  [[37, base - 2], [44, base - 5]].forEach(([x, y]) => flat.px(x, y, 'J'));
  [[41, base], [50, base - 1]].forEach(([x, y]) => flat.px(x, y, 'h'));
  flat.g.forEach((row, y) => row.forEach((ch, x) => { if (ch !== '.') c.px(x, y + Math.round((x - 40) * tip), ch); }));
  return c.outline();
}

// Where his head turns (for `twist`): about its own middle, so it can come
// all the way round and hang upside down on his neck.
const NECK = [MID, 38];

// --- The bar and the strings ---
// The control bar he hangs from: two strings to his head, one to each wrist
// and one to each knee.
export const BAR_Y = 17;
const BAR_TIES = { headL: [40, BAR_Y + 1], headR: [48, BAR_Y + 1], handL: [22, BAR_Y], handR: [66, BAR_Y], kneeL: [31, BAR_Y + 5], kneeR: [57, BAR_Y + 5] };
function controlBar() {
  return part((c) => {
    // The hanger, going up into the dark.
    c.line(MID, 0, MID, BAR_Y - 2, 'W');
    // The main bar, with brass caps.
    capsule(c, [22, BAR_Y], [66, BAR_Y], 1.6, 1.6, BAR);
    // The leg bar hung under it.
    capsule(c, [30, BAR_Y + 5], [58, BAR_Y + 5], 1.2, 1.2, BAR);
    c.line(32, BAR_Y + 1, 32, BAR_Y + 4, 's'); c.line(56, BAR_Y + 1, 56, BAR_Y + 4, 's');
    // The crosspiece at the middle.
    capsule(c, [MID, BAR_Y - 1], [MID, BAR_Y + 7], 2, 1.5, BAR);
    [[21, BAR_Y], [67, BAR_Y]].forEach(([x, y]) => c.px(x, y, 'X'));
  });
}

// Where each string is tied on him (with his body offset by ox, oy).
function figureTies(p, ox, oy) {
  const at = ([x, y]) => [x + ox, y + oy];
  return {
    headL: at([39, 31]),
    headR: at([49, 31]),
    handL: at(armJoints(p.l, false).w),
    handR: at(armJoints(p.r, true).w),
    kneeL: at(P((LEGS[p.ll] ?? LEGS.dangle).k)),
    kneeR: at(P(mirror((LEGS[p.rl] ?? LEGS.dangle).k))),
  };
}

// --- Him, whole ---

// pose: a name of PUPPET_POSES, or { l, r, ll, rl } (ARMS or { tip } for each
// arm, LEGS for each leg). opts:
//   jaw, gouge        his head (see head())
//   dx, hy            his head ticked sideways, or hung forward
//   twist             his head turned on his neck (radians)
//   glow              null, or 0 to 3: the light inside him
//   ox, oy            his body moved off true below the bar (lurched,
//                     dropped)
//   bar               false for no bar; or { dx, dy } it's moved by
//   strings           'taut', 'slack' or 'none'; cut: the names of any that
//                     have snapped (their ends hang from the bar)
//   chips             [x, y] points of wood flicking off as he digs (on the
//                     sprite, not moved with him)
//   bare              true: no crown and no cape rag, just the wood
//   flung             [{ part: 'crown' or 'cape', dx, dy, turn }]: the crown
//                     or the rag thrown off him, moved from where it sat and
//                     turned (radians), drawn behind him (on the sprite, not
//                     moved with him)
export function puppetRows(pose = 'idle', opts = {}) {
  const p = poseOf(pose);
  const { ox = 0, oy = 0, bar = {}, strings = 'taut', cut = [] } = opts;
  GLOW = opts.glow ?? null;
  const c = new Cv();
  // The strings first, so he and the bar are drawn over their ends.
  if (bar) {
    const ties = figureTies(p, ox, oy);
    const bdx = bar.dx ?? 0;
    const bdy = bar.dy ?? 0;
    Object.entries(BAR_TIES).forEach(([name, [bx, by]], i) => {
      const from = [bx + bdx, by + bdy];
      if (cut.includes(name) || cut === 'all') { c.line(...from, from[0] + (i % 2 ? 1 : -1), from[1] + 5 + (i % 3) * 2, 's'); return; }
      if (strings === 'none') return;
      c.curve(...from, ...ties[name], strings === 'slack' ? (i % 2 ? 3 : -3) : 0, 's');
    });
    c.stamp(controlBar(), bdx, bdy);
  }
  (opts.flung ?? []).forEach((f) => c.stamp(flungPart(f)));
  const parts = figureParts(p, opts);
  const order = [parts.legL, parts.legR, parts.body, parts.cape];
  if (!p.r.tip) order.push(parts.armR);
  if (!p.l.tip) order.push(parts.armL);
  order.push(parts.head);
  if (p.r.tip) order.push(parts.armR);
  if (p.l.tip) order.push(parts.armL);
  order.forEach((pc) => c.stamp(pc, ox, oy));
  (opts.chips ?? []).forEach(([x, y], i) => c.px(x, y, i % 2 ? '1' : '2'));
  GLOW = null;
  return remap(c.rows());
}

// His parts, each its own canvas (not yet moved by ox, oy): the head is his
// head and crown together, turned and ticked as asked.
function figureParts(p, opts) {
  const h = new Cv();
  h.stamp(head(opts));
  // (Lit up inside, it sits straight: tipped over one eye it reads as a
  // fringe of hair.)
  if (!opts.bare) h.stamp(crown(opts.glow != null ? 0 : 0.2));
  const tilted = opts.twist ? h.turned(opts.twist, ...NECK) : h;
  const placed = new Cv();
  placed.stamp(tilted, opts.dx ?? 0, opts.hy ?? 0);
  return {
    legL: leg(p.ll, false),
    legR: leg(p.rl, true),
    body: body(),
    cape: opts.bare ? new Cv() : cape(),
    armL: arm(p.l, false),
    armR: arm(p.r, true),
    head: placed,
  };
}

// The crown or the cape rag thrown off him: turned about its own middle and
// moved by dx, dy.
function flungPart({ part: which, dx = 0, dy = 0, turn = 0 }) {
  const piece = which === 'cape' ? cape() : crown(0);
  const mid = which === 'cape' ? [36, 44] : [44, 28];
  const out = new Cv();
  out.stamp(turn ? piece.turned(turn, ...mid) : piece, dx, dy);
  return out;
}

// His parts as rows in PUPPET_PALETTE, each where it is on the sprite (moved
// by ox, oy): for coming apart. head (with the crown), body (with the cape),
// unless he's `bare`;
// armL, armR, legL, legR.
export function puppetParts(pose = 'idle', opts = {}) {
  const p = poseOf(pose);
  GLOW = opts.glow ?? null;
  const parts = figureParts(p, opts);
  const out = {};
  const place = (cv) => { const c = new Cv(); c.stamp(cv, opts.ox ?? 0, opts.oy ?? 0); return remap(c.rows()); };
  const torso = new Cv();
  torso.stamp(parts.body);
  torso.stamp(parts.cape);
  out.head = place(parts.head);
  out.body = place(torso);
  ['armL', 'armR', 'legL', 'legR'].forEach((k) => { out[k] = place(parts[k]); });
  GLOW = null;
  return out;
}

// Where his left wrist is on the sprite (Tuck's strings tie there, in his last
// act), with his body offset by ox, oy.
export function puppetHandL(pose = 'idle', { ox = 0, oy = 0 } = {}) {
  const [x, y] = armJoints(poseOf(pose).l, false).w;
  return [Math.round(x + ox), Math.round(y + oy)];
}

// Where his two shoulders are on the sprite (the left one as you look at him
// first), with his body offset by ox, oy: where the stage hangs the arms it
// reaches over the box.
export function puppetShoulders({ ox = 0, oy = 0 } = {}) {
  return [armJoints('none', false).s, armJoints('none', true).s].map(([x, y]) => [x + ox, y + oy]);
}
