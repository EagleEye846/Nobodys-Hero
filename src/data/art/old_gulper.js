import { Pix, flash, shift } from './ch5Kit.js';

// OLD GULPER, 60x50: a giant, very old moray eel who lives in the great bell
// of Merrow's bell tower, which fell and lies on its side in the flooded
// floor. He comes up out of its mouth in a slow S, mottled green and yellow,
// with a huge pale eye (one lid always half down), a mouth full of needle
// teeth, and one tooth sticking out crooked at the front: it aches. He faces
// left (toward you). The bell's mouth is part of him (its rim, the dark
// inside, a bit of the bronze behind), so he reads on his own in a room too.
// His battle clips (OLD_GULPER_ANIM, see `anim` in src/battle/battleScene.js):
// he sways, his gills pump and the eye blinks slowly; before an attack his
// jaw drops and he rears back; hit, he jerks, eye squeezed shut; beaten, he
// sinks back into the bell until only the tip of his tail flops out of it
// (held as the beaten sprite); spared, he rests his chin on the bell's rim,
// eyes shut, the crooked tooth gone. Wide awake (half HP) both eyes are open
// and red-rimmed, the gills flare and the bell's rim shakes.
// Drawn from a pose (see src/data/art/ch5Kit.js).
export const OLD_GULPER_PALETTE = {
  k: '#1b1a22',
  g: '#7a8a2a',
  h: '#5e6e22',
  G: '#3e4c18',
  y: '#c8c050',
  Y: '#e8e090',
  E: '#f0f4d8',
  e: '#1e1a22',
  a: '#e05a3a',
  R: '#5a1c22',
  r: '#b84438',
  W: '#f4f0dc',
  b: '#b08a3a',
  B: '#6a5020',
  T: '#e0c070',
  v: '#5aa890',
  V: '#3a7a68',
  d: '#141418',
  c: '#9fd8e4',
  C: '#d4f2fa',
  w: '#ffffff',
};

// Drawn on an 80x66 plan and shrunk to fit the stage (a sprite is drawn at
// twice its size, and the box takes the middle): every coordinate goes
// through FIT.
const FIT = 0.75;
class Plan {
  constructor(w, h) {
    this.p = new Pix(Math.round(w * FIT), Math.round(h * FIT));
  }

  n(v) {
    return Math.round(v * FIT);
  }

  set(x, y, c) {
    this.p.set(this.n(x), this.n(y), c);
  }

  get(x, y) {
    return this.p.get(this.n(x), this.n(y));
  }

  rect(x, y, w, h, c, only = null) {
    this.p.rect(this.n(x), this.n(y), Math.max(1, this.n(w)), Math.max(1, this.n(h)), c, only);
  }

  ellipse(cx, cy, rx, ry, c, only = null) {
    this.p.ellipse(cx * FIT, cy * FIT, rx * FIT, ry * FIT, c, only);
  }

  line(x0, y0, x1, y1, c, thick = 1) {
    this.p.line(x0 * FIT, y0 * FIT, x1 * FIT, y1 * FIT, c, Math.max(1, Math.round(thick * FIT)));
  }

  poly(points, c, only = null) {
    this.p.poly(points.map(([x, y]) => [x * FIT, y * FIT]), c, only);
  }

  outline(c) {
    this.p.outline(c);
  }

  rows() {
    return this.p.rows();
  }
}

const hash = (n) => {
  const x = Math.sin(n * 91.7 + 13.3) * 43758.5453;
  return x - Math.floor(x);
};

// A point on a cubic curve.
const bez = (a, b, c, d, t) => {
  const u = 1 - t;
  return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]];
};

// The bell's mouth: centre and radii of its rim (it lies on its side, mouth
// toward you and a little left).
const MX = 46;
const MY = 47;
const MRX = 8;
const MRY = 15;

// Pose: sway (px the upper body leans), open (jaw, 0-4), lid (0 eye open, 1
// half shut, 2 shut, 'happy'), gill (0-1, the gills pumping), rear (px the
// head pulls back and up), angry (red-rimmed eye, brow down, gills flared),
// sink (0-1: how far he has gone back into the bell; 1 leaves the tail tip),
// chin (spared: head down on the rim), tooth (the crooked tooth still in),
// shake (px the rim jitters), jerk (px he jolts right when hit).
function draw(pose = {}) {
  const { sway = 0, open = 1, lid = 1, gill = 0, rear = 0, angry = false, sink = 0, chin = false, tooth = true, shake = 0, jerk = 0, dizzy = false } = pose;
  const p = new Plan(80, 66);

  // --- The bell, behind him: bronze body lying on its side, crown to the right.
  const sx = shake;
  p.poly([[MX + sx, MY - MRY], [74 + sx, MY - 9], [78 + sx, MY - 4], [78 + sx, MY + 4], [74 + sx, MY + 9], [MX + sx, MY + MRY]], 'b');
  p.poly([[MX + 2 + sx, MY + 4], [76 + sx, MY + 2], [74 + sx, MY + 9], [MX + sx, MY + MRY]], 'B', ['b']);
  p.line(MX + 3 + sx, MY - MRY + 2, 72 + sx, MY - 8, 'T');
  p.line(MX + 4 + sx, MY - MRY + 4, 70 + sx, MY - 6, 'Y');
  // Raised bands round it, and verdigris.
  for (const x of [56, 66]) p.line(x + sx, MY - MRY + (x - MX) * 0.2, x + sx, MY + MRY - (x - MX) * 0.2, 'B');
  for (let i = 0; i < 9; i++) p.set(52 + hash(i) * 22 + sx, MY - 8 + hash(i + 9) * 18, hash(i + 3) > 0.5 ? 'v' : 'V');
  // The crown's loops.
  p.rect(77 + sx, MY - 3, 3, 6, 'B');
  p.set(79 + sx, MY - 1, 'T');
  // Its mouth: the dark inside, then the rim.
  p.ellipse(MX + sx, MY, MRX - 1.5, MRY - 1.5, 'd');
  const rim = (from, to) => {
    for (let a = from; a <= to; a += 0.05) {
      for (const k of [0, 0.9, 1.8]) p.set(MX + sx + Math.cos(a) * (MRX - k * 0.6), MY + Math.sin(a) * (MRY - k), k < 1 ? 'b' : k < 1.5 ? 'T' : 'B');
    }
  };
  rim(0, Math.PI * 2);

  // --- Old Gulper, out of the mouth in an S. The neck ends at (nx, ny); the head is on it.
  let hx = 20 - rear * 0.4 + sway + jerk;
  let hy = 14 - rear * 0.6;
  if (chin) {
    hx = MX - 12;
    hy = MY - MRY - 2;
  }
  const start = [MX + 1 + sx, MY + 5];
  const neck = [hx + 12, hy + 6];
  const c1 = chin ? [MX - 4, MY - 4] : [12 + sway * 0.2 + jerk * 0.5, 66];
  const c2 = chin ? [MX - 2, MY - 10] : [40 + sway * 0.6 + jerk, 30 - rear * 0.3];
  // How much of him is out (sinking back in, the head end goes in last: the
  // whole S shortens toward the bell).
  const out = 1 - sink;
  const N = 40;
  const pts = [];
  for (let i = 0; i <= N; i++) pts.push(bez(start, c1, c2, neck, (i / N) * out));
  const thick = (t) => 10.5 - t * 2.5;
  if (sink < 0.95) {
    // Body: dark edge, then the olive, then the mottles.
    for (let i = 0; i <= N; i++) p.ellipse(pts[i][0], pts[i][1], thick(i / N) / 2 + 0.6, thick(i / N) / 2 + 0.6, 'h');
    for (let i = 0; i <= N; i++) p.ellipse(pts[i][0] - 0.6, pts[i][1] - 0.6, thick(i / N) / 2 - 0.4, thick(i / N) / 2 - 0.4, 'g');
    for (let i = 2; i <= N; i += 3) {
      const [x, y] = pts[i];
      p.ellipse(x + (hash(i) - 0.5) * 5, y + (hash(i + 40) - 0.5) * 5, 1.4, 1.1, hash(i + 7) > 0.45 ? 'G' : 'y', ['g', 'h']);
    }
    // The fin along his back: a pale frill on the outside of the S.
    for (let i = 4; i < N - 2; i++) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[i + 1];
      const nx = (y1 - y0);
      const ny = -(x1 - x0);
      const d = Math.hypot(nx, ny) || 1;
      const off = thick(i / N) / 2 + 0.8;
      p.set(x0 + (nx / d) * off, y0 + (ny / d) * off, i % 3 ? 'y' : 'Y');
    }
  } else {
    // Beaten: only the tip of his tail lolls out over the rim.
    p.line(MX - 2 + sx, MY + 6, MX - 9, MY + 12, 'g', 3);
    p.line(MX - 9, MY + 12, MX - 12, MY + 11, 'g', 2);
    p.set(MX - 13, MY + 10, 'y');
    p.set(MX - 6, MY + 9, 'G');
  }
  // The front of the rim goes in front of him (the bottom left of it).
  rim(Math.PI * 0.5, Math.PI * 1.0);

  // --- The head (unless he's all the way in).
  if (sink < 0.55) {
    const hs = sink > 0 ? 1 - sink * 0.4 : 1;
    if (sink > 0) {
      const [ex, ey] = pts[N];
      hx = ex - 12;
      hy = ey - 6;
    }
    const o = chin ? 0 : open;
    // Skull and upper jaw: long, blunt, a little hooked at the snout.
    p.ellipse(hx + 6, hy + 2, 10 * hs, 6.5 * hs, 'h');
    p.ellipse(hx + 6, hy + 1.4, 9.4 * hs, 6 * hs, 'g');
    p.poly([[hx - 7, hy + 2], [hx - 3, hy - 1], [hx + 8, hy - 3], [hx + 8, hy + 6], [hx - 6, hy + 6]], 'g');
    p.set(hx - 7, hy + 3, 'G');
    // Mottles on the head.
    for (const [x, y, c] of [[2, -2, 'y'], [8, -3, 'G'], [12, 2, 'y'], [-2, 1, 'G'], [5, 4, 'y']]) p.ellipse(hx + x, hy + y, 1.1, 0.9, c, ['g']);
    // The mouth: gums, the dark inside, the lower jaw hanging by `o`.
    const jawY = hy + 6;
    p.poly([[hx - 6, jawY], [hx + 9, jawY - 1], [hx + 10, jawY + 2 + o * 0.4], [hx - 4, jawY + 2 + o]], 'R');
    p.poly([[hx - 5, jawY + 1 + o], [hx + 10, jawY + 2 + o * 0.4], [hx + 12, jawY + 5 + o * 0.5], [hx - 4, jawY + 4 + o]], 'h');
    p.line(hx - 4, jawY + 4 + o, hx + 11, jawY + 5 + o * 0.5, 'G');
    p.line(hx - 5, jawY, hx + 9, jawY - 1, 'r');
    // Needle teeth, top and bottom.
    for (let x = -4; x <= 8; x += 2) {
      p.set(hx + x, jawY + 1, 'W');
      if (o > 0.6) p.set(hx + x + 1, jawY + 1 + o - 0.2, 'W');
    }
    // The crooked tooth: out of the front of the upper jaw, sticking down and forward.
    if (tooth) {
      p.line(hx - 4, jawY - 1, hx - 8, jawY + 5, 'W', 2);
      p.set(hx - 8, jawY + 5, 'w');
    } else if (chin) {
      // Where it was: a gap, and he looks very pleased about it.
      p.set(hx - 4, jawY + 1, 'R');
    }
    // The gills: a round dark opening behind the head, pumping.
    if (!chin) {
      const gr = 1.4 + gill * 1.2 + (angry ? 0.6 : 0);
      p.ellipse(hx + 16, hy + 8, gr * 1.3, gr * 1.6, 'G', ['g', 'h', 'y']);
      p.ellipse(hx + 16, hy + 8, gr * 0.7, gr, 'e', ['G']);
      if (angry) p.set(hx + 18, hy + 6, 'a');
    }
    // The eye: big and pale; the lid is always half down (one eye shows).
    const ex = hx + 3;
    const ey = hy - 1;
    p.ellipse(ex, ey, 3.6, 3.4, angry ? 'a' : 'h');
    p.ellipse(ex, ey, 3, 2.8, 'E');
    if (lid === 'happy') {
      p.ellipse(ex, ey, 3, 2.8, 'g');
      p.line(ex - 2, ey + 1, ex, ey - 1, 'e');
      p.line(ex, ey - 1, ex + 2, ey + 1, 'e');
    } else if (dizzy) {
      p.line(ex - 2, ey - 2, ex + 2, ey + 2, 'e');
      p.line(ex - 2, ey + 2, ex + 2, ey - 2, 'e');
    } else {
      p.rect(ex - 2, ey - 1, 2, 3, 'e');
      p.set(ex - 2, ey - 1, 'w');
      if (lid >= 1) p.ellipse(ex, ey - 2, 3.2, 1.8, 'g', ['E', 'e', 'w']);
      if (lid >= 2) p.ellipse(ex, ey, 3.2, 3, 'g', ['E', 'e', 'w']);
      if (lid >= 1) p.line(ex - 3, ey - (lid >= 2 ? 0 : 1), ex + 3, ey - (lid >= 2 ? 0 : 1), 'G');
    }
    // A heavy brow: down and cross when he's wide awake.
    if (angry) p.line(ex - 4, ey - 5, ex + 4, ey - 3, 'G', 2);
    else p.line(ex - 3, ey - 4, ex + 4, ey - 4, 'G');
  }

  // --- The water he lies in: a line of ripples along the bottom.
  for (let x = 4; x < 80; x += 1) {
    const y = 62 + Math.round(Math.sin(x * 0.5 + sway) * 0.5);
    if (p.get(x, y) === '.' && hash(x) > 0.35) p.set(x, y, hash(x + 5) > 0.7 ? 'C' : 'c');
  }
  p.outline('k');
  return p.rows();
}

// Old Gulper on the stage, at rest: a lazy sway, the gills going, a slow blink.
const IDLE = [
  draw({}),
  draw({ sway: 1, gill: 0.6 }),
  draw({ sway: 2, gill: 1, lid: 2 }),
  draw({ sway: 1, gill: 0.4 }),
  draw({ sway: 0, gill: 0 }),
  draw({ sway: -1, gill: 0.6, open: 1.6 }),
];
export const OLD_GULPER_SPRITE = IDLE[0];

// Wide awake (half HP): both of him glaring, gills flared, the bell's rim
// rattling.
const AWAKE = [
  draw({ angry: true, lid: 0, open: 2, gill: 1, sway: 1, shake: 0 }),
  draw({ angry: true, lid: 0, open: 3, gill: 0.5, sway: 2, shake: 1 }),
  draw({ angry: true, lid: 0, open: 2, gill: 1, sway: 0, shake: 0 }),
  draw({ angry: true, lid: 0, open: 3, gill: 0.5, sway: -1, shake: -1 }),
];
export const OLD_GULPER_AWAKE_SPRITE = AWAKE[0];

export const OLD_GULPER_DEATH_LAST = draw({ sink: 1, tooth: false, shake: 0 });

export const OLD_GULPER_ANIM = {
  chips: ['#7a8a2a', '#c8c050', '#b08a3a', '#9fd8e4'],
  idle: { fps: 3, frames: IDLE, holds: [3, 1, 2, 1, 2, 1] },
  windup: {
    fps: 7,
    frames: [
      draw({ rear: 3, open: 2, gill: 1 }),
      draw({ rear: 6, open: 3.5, gill: 0.5, lid: 0 }),
      draw({ rear: 7, open: 4, gill: 1, lid: 0, shake: 1 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(draw({ jerk: 2, lid: 2, open: 3 }), 2, 0)),
      shift(draw({ jerk: 3, lid: 2, open: 2, sway: 1, shake: 1 }), 2, 0),
      shift(draw({ jerk: 1, lid: 1, open: 1 }), 1, 0),
    ],
  },
  death: {
    fps: 3,
    frames: [
      draw({ dizzy: true, open: 3, jerk: 2, shake: 1 }),
      draw({ dizzy: true, open: 2, sink: 0.35, tooth: false, shake: -1 }),
      draw({ dizzy: true, open: 1, sink: 0.7, tooth: false }),
      OLD_GULPER_DEATH_LAST,
    ],
  },
  spared: {
    fps: 3,
    frames: [
      draw({ lid: 'happy', open: 0, tooth: false }),
      draw({ lid: 'happy', open: 0, tooth: false, sway: -2, rear: -2 }),
      draw({ lid: 'happy', chin: true, tooth: false }),
      draw({ lid: 'happy', chin: true, tooth: false, shake: 0 }),
    ],
    holds: [1, 1, 2, 4],
  },
  // Half his HP gone (played as he wakes up properly): he rears, the bell
  // clangs and shakes, both eyes snap open.
  intro: {
    fps: 8,
    frames: [
      flash(draw({ angry: true, lid: 0, rear: 6, open: 4, gill: 1, shake: 2 })),
      draw({ angry: true, lid: 0, rear: 7, open: 4, gill: 1, shake: -2 }),
      draw({ angry: true, lid: 0, rear: 4, open: 3, gill: 0.5, shake: 1 }),
    ],
  },
};

// The wide-awake phase's own clips (the same, angrier).
export const OLD_GULPER_AWAKE_ANIM = {
  chips: OLD_GULPER_ANIM.chips,
  idle: { fps: 5, frames: AWAKE, holds: [1, 1, 1, 1] },
  windup: {
    fps: 9,
    frames: [
      draw({ angry: true, lid: 0, rear: 4, open: 3, gill: 1, shake: 1 }),
      draw({ angry: true, lid: 0, rear: 7, open: 4, gill: 0.5, shake: -1 }),
      draw({ angry: true, lid: 0, rear: 8, open: 4, gill: 1, shake: 2 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(draw({ angry: true, jerk: 2, lid: 2, open: 3, shake: 1 }), 2, 0)),
      shift(draw({ angry: true, jerk: 3, lid: 2, open: 3, sway: 1, shake: -1 }), 2, 0),
      shift(draw({ angry: true, jerk: 1, lid: 0, open: 2 }), 1, 0),
    ],
  },
  death: OLD_GULPER_ANIM.death,
  spared: OLD_GULPER_ANIM.spared,
};

// In the belfry itself (the scenes, and his bell after the fight) he is drawn in the room's own
// great bell, the same size as the mw_great_bell prop: mw_gulper_out / _doze / _snore in
// src/data/art/merrowProps.js.
