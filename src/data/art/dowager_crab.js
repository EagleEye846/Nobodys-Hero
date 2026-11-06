import { Pix, flash, shift } from './ch5Kit.js';

// The DOWAGER CRAB, 78x62: a huge, very old hermit crab, and very proper. Her
// shell is a clawfoot bathtub, worn on her back like a hat: taps at the back
// end, iron feet, a blue painted band, and a brass ship's bell bolted on top
// with a pink bow on it. She comes out of the front of the tub in a string of
// pearls, with spectacles on one eyestalk and a monocle on the other, and one
// big claw up to point at the mat she wishes you had wiped your feet on. She
// faces left (toward you). Her battle clips (DOWAGER_CRAB_ANIM, see `anim` in
// src/battle/battleScene.js): she sways and blinks; before an attack her claw
// goes up and the bell swings; hit, she rocks back, cross-eyed with offence;
// beaten, she sinks into the tub and the bell tips over; spared, she gives
// a curtsey and holds out a claw to be shaken. Her riled look (half HP) has
// angry brows, steam, bath water slopping over the rim and the claws up.
// Drawn from a pose (see src/data/art/ch5Kit.js).
export const DOWAGER_CRAB_PALETTE = {
  k: '#1b1a22',
  W: '#f4f6f4',
  w: '#ffffff',
  b: '#b4c4d8',
  B: '#7088a8',
  C: '#74c0de',
  c: '#d4f2fa',
  s: '#4a4e58',
  S: '#7a7f8c',
  g: '#e0b84a',
  G: '#8a6a22',
  Y: '#fff0a0',
  o: '#e8742e',
  O: '#a8431f',
  q: '#f6a868',
  p: '#f2b4e0',
  r: '#d8453a',
  e: '#2a2230',
  y: '#ffe08a',
};

// She is drawn on a 78x62 plan and shrunk to fit the stage (a sprite is drawn
// at twice its size, and the box takes the middle): every coordinate, radius
// and thickness goes through FIT.
const FIT = 0.76;
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

  rect(x, y, w, h, c, only = null) {
    this.p.rect(this.n(x), this.n(y), Math.max(1, this.n(w)), Math.max(1, this.n(h)), c, only);
  }

  ellipse(cx, cy, rx, ry, c, only = null) {
    this.p.ellipse(cx * FIT, cy * FIT, rx * FIT, ry * FIT, c, only);
  }

  ring(cx, cy, rx, ry, c, thick = 1.1) {
    this.p.ring(cx * FIT, cy * FIT, rx * FIT, ry * FIT, c, Math.max(0.9, thick * FIT));
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

// Pose: bob (body up/down), claw (px the big claw is raised), open (the pincer
// gap), eyes ('prim' | 'blink' | 'angry' | 'cross' | 'happy' | 'dead'), swing
// (the bell, px), steam (puffs 0-2), water (sloshing over the rim), sink (death:
// how far she has gone into the tub), bow (px she dips), tilt (the tub, px
// the back end drops), lean (px the body leans).
function draw(pose = {}) {
  const { bob = 0, claw = 0, open = 3, eyes = 'prim', swing = 0, steam = 0, water = 0, sink = 0, bow = 0, tilt = 0, lean = 0, wave = 0 } = pose;
  const p = new Plan(78, 62);
  const rimAt = (x) => 24 + tilt * 0.4 - (x - 26) * (10 / 42) * (tilt ? 1 - tilt * 0.1 : 1);

  // The iron feet, under the tub.
  p.rect(35, 52 + tilt * 0.3, 5, 5, 's');
  p.ellipse(37, 57 + tilt * 0.3, 3.6, 2, 's');
  p.rect(36, 52 + tilt * 0.3, 1, 4, 'S');
  p.rect(62, 49 + tilt, 5, 5, 's');
  p.ellipse(64, 54 + tilt, 3.6, 2, 's');
  p.rect(63, 49 + tilt, 1, 4, 'S');

  // The tub: a long bath with a rolled rim, a blue painted band and shading.
  const T = tilt;
  p.poly([[26, 24], [68, 14 + T], [73, 22 + T], [73, 38 + T], [65, 50 + T], [40, 52], [30, 46], [26, 36]], 'W');
  p.poly([[28, 40], [73, 35 + T], [73, 38 + T], [65, 50 + T], [40, 52], [30, 46]], 'b', ['W']);
  p.poly([[34, 48], [60, 48 + T], [65, 50 + T], [40, 52]], 'B', ['b']);
  p.line(27, 33, 72, 28 + T, 'C', 2);
  p.line(27, 32, 72, 27 + T, 'c');
  p.line(26, 24, 68, 14 + T, 'b', 4);
  p.line(26, 23, 68, 13 + T, 'W', 3);
  p.line(28, 22, 66, 12 + T, 'w');
  p.line(68, 14 + T, 73, 22 + T, 'b', 2);
  // Water sloshing over the rim when she is riled.
  if (water) {
    p.line(30, 22, 60, 14 + T, 'C', 2);
    for (const x of [34, 48, 58]) p.rect(x, 24 + Math.round(water * 2) + (x > 40 ? -4 : 0), 1, 3, 'C');
    p.set(46, 18, 'c');
    p.set(52, 15 + T, 'c');
  }
  // The taps on the back rim.
  p.rect(64, 6 + T, 2, 8, 'g');
  p.rect(59, 6 + T, 9, 2, 'g');
  p.rect(58, 8 + T, 2, 3, 'G');
  p.rect(62, 3 + T, 2, 3, 'g');
  p.rect(66, 3 + T, 2, 3, 'g');
  p.set(62, 2 + T, 'Y');

  // The bell: a post up from the rim, then the dome, lip and clapper.
  const bx = 46 + tilt * 0.4;
  const rim = Math.round(rimAt(bx)) + 0;
  const baseY = rim - 3;
  p.rect(bx - 1, baseY, 3, 4, 'G');
  const sw = swing;
  p.poly([[bx + sw * 0.5, baseY - 11], [bx - 8 + sw, baseY - 1], [bx + 8 + sw, baseY - 1]], 'g');
  p.ellipse(bx + sw * 0.5, baseY - 9, 4, 3.4, 'g');
  p.poly([[bx + sw * 0.5, baseY - 11], [bx + 8 + sw, baseY - 1], [bx + 2 + sw, baseY - 1]], 'G', ['g']);
  p.rect(bx - 9 + sw, baseY - 1, 18, 2, 'G');
  p.line(bx - 3 + sw * 0.8, baseY - 8, bx - 6 + sw, baseY - 2, 'Y');
  p.ellipse(bx + sw * 1.6, baseY + 3, 1.8, 1.8, 'G');
  // The pink bow on its crown.
  p.rect(bx - 3 + sw * 0.5, baseY - 14, 7, 3, 'p');
  p.set(bx + sw * 0.5, baseY - 13, 'r');

  // The crab: body, legs, claws, eyestalks and face.
  const cx = 21 + lean - bow * 0.8;
  const by = 40 + bob + sink + bow;
  // Legs, three a side, kneed.
  for (const [lx, gx] of [[13, 7], [19, 14], [26, 22]]) {
    const kneeX = (lx + gx) / 2 - 1;
    p.line(lx + lean, by + 8, kneeX + lean, by + 12, 'O', 2);
    p.line(kneeX + lean, by + 12, gx + lean, 60 + (sink ? 0 : 0), 'O', 2);
    p.line(lx + lean, by + 8, kneeX + lean, by + 12, 'o');
  }
  // The big claw.
  const armX = cx - 9;
  const armY = by + 4;
  const clawX = cx - 16 + wave;
  const clawY = by - 6 - claw;
  p.line(armX, armY, clawX + 3, clawY + 5, 'O', 4);
  p.line(armX, armY, clawX + 3, clawY + 5, 'o', 2);
  p.ellipse(clawX + 3, clawY + 3, 5.6, 5, 'O');
  p.ellipse(clawX + 3, clawY + 3, 4.6, 4, 'o');
  const gap = open;
  p.line(clawX + 1, clawY, clawX - 1, clawY - 8, 'O', 3);
  p.line(clawX + 1, clawY, clawX - 1, clawY - 8, 'o');
  p.line(clawX + 5, clawY, clawX + 5 + gap * 0.9, clawY - 8, 'O', 3);
  p.line(clawX + 5, clawY, clawX + 5 + gap * 0.9, clawY - 8, 'o');
  p.set(clawX - 1, clawY - 8, 'q');
  p.set(clawX + 5 + Math.round(gap * 0.9), clawY - 8, 'q');
  p.set(clawX + 3, clawY + 2, 'q');
  // The body, in front of the tub's mouth.
  p.ellipse(cx + 1, by, 13, 11, 'O');
  p.ellipse(cx, by - 1, 12, 10, 'o');
  p.ellipse(cx - 1, by - 5, 8, 3.4, 'q', ['o']);
  p.ellipse(cx + 4, by + 5, 8, 3.4, 'O', ['o']);
  // The small claw, held at the hip.
  const hipX = cx + 10;
  const hipY = by + 8;
  p.line(hipX, hipY - 3, hipX - 3, hipY + 3, 'O', 3);
  p.ellipse(hipX - 4, hipY + 4, 3.4, 3, 'O');
  p.ellipse(hipX - 4, hipY + 4, 2.6, 2.2, 'o');
  p.set(hipX - 7, hipY + 4, 'k');
  // Pearls round the neck.
  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    p.set(cx - 10 + t * 20, by + 8 + Math.sin(t * Math.PI) * 3, "w");
    p.set(cx - 10 + t * 20, by + 9 + Math.sin(t * Math.PI) * 3, "p");
  }
  // Eyestalks and eyes.
  const droop = eyes === 'dead' ? 4 : 0;
  const eyeL = { x: cx - 5, y: by - 17 + droop + (eyes === 'angry' ? 1 : 0) };
  const eyeR = { x: cx + 5, y: by - 18 + droop + (eyes === 'angry' ? 1 : 0) };
  for (const e of [eyeL, eyeR]) {
    p.line(e.x + (e.x < cx ? 1 : -1), by - 7, e.x, e.y + 3, 'O', 3);
    p.line(e.x + (e.x < cx ? 1 : -1), by - 7, e.x, e.y + 3, 'o');
  }
  for (const e of [eyeL, eyeR]) {
    p.ellipse(e.x, e.y, 3.8, 3.8, 'W');
    if (eyes === 'blink') {
      p.rect(e.x - 3, e.y, 7, 2, 'o');
      p.rect(e.x - 3, e.y + 1, 7, 1, 'k');
    } else if (eyes === 'cross' || eyes === 'dead') {
      p.line(e.x - 2, e.y - 2, e.x + 2, e.y + 2, 'e');
      p.line(e.x - 2, e.y + 2, e.x + 2, e.y - 2, 'e');
    } else if (eyes === 'happy') {
      p.line(e.x - 2, e.y + 1, e.x, e.y - 1, 'e');
      p.line(e.x, e.y - 1, e.x + 2, e.y + 1, 'e');
    } else {
      p.rect(e.x - 3, e.y - 1, 2, 3, 'e');
      p.set(e.x - 3, e.y - 1, 'w');
    }
  }
  // Brows: level and prim, or slanted and furious.
  if (eyes === 'angry') {
    p.line(eyeL.x - 4, eyeL.y - 6, eyeL.x + 3, eyeL.y - 3, 'e', 2);
    p.line(eyeR.x + 4, eyeR.y - 6, eyeR.x - 3, eyeR.y - 3, 'e', 2);
  } else if (eyes === 'prim') {
    p.line(eyeL.x - 3, eyeL.y - 5, eyeL.x + 3, eyeL.y - 5, 'O');
    p.line(eyeR.x - 3, eyeR.y - 5, eyeR.x + 3, eyeR.y - 6, 'O');
  }
  // The spectacles on the left eye, the monocle (and its chain) on the right.
  p.ring(eyeL.x, eyeL.y, 5, 5, 'G', 0.9);
  p.line(eyeL.x + 5, eyeL.y, eyeL.x + 9, eyeL.y + 1, 'G');
  p.ring(eyeR.x, eyeR.y, 5, 5, 'g', 0.9);
  p.line(eyeR.x + 4, eyeR.y + 3, eyeR.x + 7, by - 2, 'g');
  // A small pursed mouth, or an open furious one.
  const my = by - 3;
  if (eyes === 'angry') {
    p.rect(cx - 3, my, 7, 3, 'k');
    p.rect(cx - 2, my, 5, 1, 'w');
  } else if (eyes === 'happy') {
    p.line(cx - 3, my, cx, my + 2, 'O');
    p.line(cx, my + 2, cx + 3, my, 'O');
  } else if (eyes === 'dead' || eyes === 'cross') {
    p.rect(cx - 2, my, 5, 2, 'k');
  } else {
    p.rect(cx - 2, my + 1, 5, 1, 'O');
    p.set(cx - 3, my, 'O');
    p.set(cx + 3, my, 'O');
  }
  if (eyes !== 'dead' && eyes !== 'blink') {
    p.set(cx - 7, by - 1, 'p');
    p.set(cx + 7, by - 1, 'p');
  }
  // Steam, when she is riled.
  for (let i = 0; i < steam; i++) {
    const sx = cx - 8 + i * 16;
    p.ellipse(sx, by - 26 - i * 3, 2.4, 2, 'w');
    p.ellipse(sx + 2, by - 29 - i * 3, 1.8, 1.5, 'c');
  }
  p.outline('k');
  return p.rows();
}

const IDLE = [
  draw({}),
  draw({ bob: 1, swing: 1 }),
  draw({ bob: 0, swing: 0, eyes: 'blink' }),
  draw({ bob: -1, swing: -1, wave: 1 }),
];

export const DOWAGER_CRAB_SPRITE = IDLE[0];

// Half her HP gone: the bath water slops over, her brows come down.
const RILED = [
  draw({ eyes: 'angry', claw: 2, open: 4, water: 1, steam: 1, swing: 1 }),
  draw({ eyes: 'angry', claw: 3, open: 5, water: 2, steam: 2, swing: -1, bob: 1 }),
  draw({ eyes: 'angry', claw: 2, open: 4, water: 1, steam: 1, swing: 2, bob: 0 }),
  draw({ eyes: 'angry', claw: 3, open: 5, water: 2, steam: 2, swing: -2, bob: 1 }),
];
export const DOWAGER_CRAB_RILED_SPRITE = RILED[0];

export const DOWAGER_CRAB_DEATH_LAST = draw({ eyes: 'dead', sink: 7, bow: 3, tilt: 5, swing: 6, claw: -4, open: 0 });

export const DOWAGER_CRAB_ANIM = {
  chips: ['#f4f6f4', '#b4c4d8', '#e0b84a', '#e8742e'],
  idle: { fps: 3, frames: IDLE, holds: [3, 1, 1, 2] },
  windup: {
    fps: 7,
    frames: [
      draw({ claw: 2, open: 4, swing: 3 }),
      draw({ claw: 5, open: 6, swing: -4, bob: -1 }),
      draw({ claw: 6, open: 7, swing: 4, bob: -1 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(draw({ eyes: 'cross', lean: 1, swing: 5, claw: -2 }), 2, 0)),
      shift(draw({ eyes: 'cross', lean: 2, swing: -4, bob: 1, claw: -2 }), 2, 0),
      shift(draw({ eyes: 'cross', lean: 1, swing: 2, claw: 0 }), 1, 0),
    ],
  },
  death: {
    fps: 3,
    frames: [
      draw({ eyes: 'cross', lean: 2, swing: 5, claw: -2, open: 2 }),
      draw({ eyes: 'dead', lean: 2, swing: -5, bob: 2, sink: 3, claw: -3, open: 1, tilt: 2 }),
      draw({ eyes: 'dead', sink: 5, bow: 2, tilt: 4, swing: 7, claw: -4, open: 0 }),
      DOWAGER_CRAB_DEATH_LAST,
    ],
  },
  spared: {
    fps: 3,
    frames: [
      draw({ eyes: 'happy' }),
      draw({ eyes: 'happy', bow: 3, lean: -1, claw: 1, open: 2, swing: 1 }),
      draw({ eyes: 'happy', bow: 4, lean: -2, claw: 0, open: 1, swing: 2, bob: 1 }),
      draw({ eyes: 'happy', bow: 0, claw: 3, open: 2, swing: 0 }),
    ],
  },
  // Half her HP gone (played as the riled phase starts): the bell clangs, the water
  // slops, the brows come down.
  intro: {
    fps: 8,
    frames: [
      flash(draw({ eyes: 'angry', claw: 4, open: 6, swing: 6, water: 2, steam: 2 })),
      draw({ eyes: 'angry', claw: 6, open: 7, swing: -6, water: 2, steam: 2, bob: -1 }),
      draw({ eyes: 'angry', claw: 5, open: 6, swing: 5, water: 2, steam: 2 }),
    ],
  },
};

// The riled phase's own clips (the same, angrier).
export const DOWAGER_CRAB_RILED_ANIM = {
  chips: DOWAGER_CRAB_ANIM.chips,
  idle: { fps: 4, frames: RILED, holds: [1, 1, 1, 1] },
  windup: {
    fps: 8,
    frames: [
      draw({ eyes: 'angry', claw: 4, open: 6, swing: 4, water: 2, steam: 1 }),
      draw({ eyes: 'angry', claw: 7, open: 8, swing: -5, water: 2, steam: 2, bob: -1 }),
      draw({ eyes: 'angry', claw: 8, open: 9, swing: 5, water: 2, steam: 2, bob: -1 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(draw({ eyes: 'cross', lean: 1, swing: 5, water: 2, steam: 1 }), 2, 0)),
      shift(draw({ eyes: 'cross', lean: 2, swing: -4, bob: 1, water: 2, steam: 1 }), 2, 0),
      shift(draw({ eyes: 'angry', lean: 1, swing: 2, water: 1, steam: 1 }), 1, 0),
    ],
  },
  death: DOWAGER_CRAB_ANIM.death,
  spared: DOWAGER_CRAB_ANIM.spared,
};
