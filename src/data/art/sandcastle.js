import { Pix, flash, shift } from './ch5Kit.js';

// The SANDCASTLE, 40x38: a living sandcastle, three towers and a keep in
// pail-turned sand, with shells pressed in for windows, a lolly-stick flag,
// a wet moat ringing the base and a doorway that works as a mouth. It is
// perfectly happy until the tide comes, and the tide is always coming. Its
// battle clips (SANDCASTLE_ANIM, see `anim` in src/battle/battleScene.js):
// the flag waves and grains trickle; before an attack the turrets swivel
// open and the door gapes; hit, chunks fall off and it flashes; beaten, it
// slumps into a mound; spared, the flag stands up and the shells wink. Drawn
// from a pose (see src/data/art/ch5Kit.js).
export const SANDCASTLE_PALETTE = {
  k: '#3a2e1c',
  s: '#e8cf8e',
  S: '#caa968',
  d: '#a88848',
  l: '#f6e6b0',
  m: '#9a7c44',
  D: '#4a3a20',
  c: '#f4dcdc',
  C: '#e49aa0',
  r: '#d8453a',
  R: '#9c2a2a',
  f: '#e0d4b0',
  w: '#5aa0c8',
  W: '#a8d8ec',
  e: '#ffffff',
  p: '#8a8a7a',
};

// Poses: flag (frame 0..3), door (open px), crumble (0 whole .. 1 mound),
// eyes ('open' | 'angry' | 'happy' | 'dead'), shake, trickle (sand falling),
// lift (turret hatch lifted: windup).
function draw(pose = {}) {
  const { flag = 0, door = 0, crumble: cr = 0, eyes = 'open', trickle = 0, lift = 0, flagUp = 0 } = pose;
  const p = new Pix(42, 40);
  const sink = Math.round(cr * 14);
  const baseY = 34;

  // The moat: wet sand and a thin band of water in front.
  p.ellipse(21, baseY + 2, 19, 3.6, 'k');
  p.ellipse(21, baseY + 2, 18, 3, 'm');
  p.ellipse(21, baseY + 3, 14, 1.6, 'w');
  p.ellipse(18, baseY + 2.6, 5, 0.7, 'W');
  // The base slab.
  p.rect(3, baseY - 10 + sink * 0.4, 36, 11 - sink * 0.4, 'k');
  p.rect(4, baseY - 9 + sink * 0.4, 34, 10 - sink * 0.4, 's');
  p.rect(26, baseY - 9 + sink * 0.4, 12, 10 - sink * 0.4, 'S');
  p.rect(4, baseY - 9 + sink * 0.4, 34, 1, 'l');
  // The towers: left, keep, right.
  const towers = [
    { x: 4, w: 9, top: 19 + sink, teeth: 3 },
    { x: 15, w: 12, top: 12 + sink, teeth: 4 },
    { x: 29, w: 9, top: 17 + sink, teeth: 3 },
  ];
  for (const t of towers) {
    const h = baseY - 8 - t.top;
    if (h < 1) continue;
    p.rect(t.x - 1, t.top - 1, t.w + 2, h + 1, 'k');
    p.rect(t.x, t.top, t.w, h, 's');
    p.rect(t.x + Math.ceil(t.w * 0.6), t.top, Math.floor(t.w * 0.4), h, 'S');
    p.rect(t.x, t.top, 1, h, 'l');
    // Ridges from the bucket.
    for (let y = t.top + 5; y < baseY - 9; y += 5) p.rect(t.x, y, t.w, 1, 'd');
    // Battlements.
    if (cr < 0.5) {
      for (let i = 0; i < t.teeth; i++) {
        const tx = t.x + (i * (t.w - 2)) / (t.teeth - 1);
        p.rect(tx - 1, t.top - 3, 3, 3, 'k');
        p.rect(tx, t.top - 2, 1, 2, 's');
        p.set(tx, t.top - 2, 'l');
      }
    }
  }
  // Windows: shells pressed in, with eyes.
  const eyeY = 24 + sink;
  if (cr < 0.7) {
    for (const ex of [8, 33]) {
      p.ellipse(ex, eyeY - (ex === 8 ? 0 : -1), 2.8, 2.6, 'k');
      p.ellipse(ex, eyeY - (ex === 8 ? 0 : -1), 2, 1.8, 'c');
      p.set(ex, eyeY - (ex === 8 ? 0 : -1), eyes === 'dead' ? 'D' : eyes === 'happy' ? 'C' : 'D');
      p.set(ex + 1, eyeY - (ex === 8 ? 0 : -1), eyes === 'happy' ? 'e' : 'C');
    }
    // Keep's slit eyes.
    const ky = 17 + sink;
    for (const ex of [18, 24]) {
      if (eyes === 'happy') { p.set(ex, ky + 1, 'D'); p.set(ex + 1, ky, 'D'); p.set(ex + 2, ky + 1, 'D'); }
      else if (eyes === 'dead') { p.set(ex, ky, 'D'); p.set(ex + 2, ky + 2, 'D'); p.set(ex + 2, ky, 'D'); p.set(ex, ky + 2, 'D'); }
      else {
        p.rect(ex, ky, 3, 3, 'D');
        p.set(ex + 1, ky + 1, 'e');
        if (eyes === 'angry') { p.line(ex - 1, ky - 1, ex + 3, ky + 1, 'D'); }
      }
    }
    // The doorway: an arch, and a mouth.
    const dy = baseY - 9;
    p.rect(17, dy - 6 - door, 8, 7 + door, 'k');
    p.ellipse(21, dy - 6 - door, 4, 2.4, 'k');
    p.rect(18, dy - 6 - door, 6, 6 + door, 'D');
    p.ellipse(21, dy - 6 - door, 3, 1.8, 'D');
    // Teeth (little shells) along the sill.
    for (let x = 18; x < 24; x += 2) p.set(x, dy - 1, 'c');
    if (door > 1) for (let x = 19; x < 24; x += 2) p.set(x, dy - 6 - door + 1, 'c');
  }
  // Pebbles and shells in the wall.
  for (const [bx, by, col] of [[7, baseY - 4, 'p'], [30, baseY - 5, 'C'], [13, baseY - 3, 'c'], [24, baseY - 4, 'p'], [35, baseY - 3, 'c']]) {
    if (by + sink * 0.2 < baseY - 1) p.set(bx, by, col);
  }
  // The flag on the keep: a lolly stick and a little pennant that waves.
  if (cr < 0.6) {
    const fx = 21;
    const fy = 12 + sink;
    const up = flagUp;
    p.line(fx, fy - 3, fx, fy - 11 - up, 'k', 1);
    p.line(fx, fy - 3, fx, fy - 11 - up, 'f');
    const wave = [0, 1, 0, -1][flag % 4];
    const top = fy - 11 - up;
    p.poly([[fx + 1, top], [fx + 8, top + 2 + wave], [fx + 1, top + 5]], 'k');
    p.poly([[fx + 1, top + 0.6], [fx + 7, top + 2 + wave], [fx + 1, top + 4.2]], 'r');
    p.line(fx + 1, top + 1, fx + 5, top + 2 + wave, 'R');
  }
  // Falling grains.
  if (trickle) {
    const gx = [6, 15, 28, 34];
    gx.forEach((x, i) => { p.set(x, 22 + ((trickle * 3 + i * 5) % 9) + sink, 's'); });
  }
  if (lift) {
    // The turrets swivel open: dark slots on the towers.
    p.rect(5, 22 + sink, 7, 1, 'D');
    p.rect(30, 20 + sink, 7, 1, 'D');
  }
  return p.outline('k').rows();
}

const IDLE = [
  draw({ flag: 0, trickle: 1 }),
  draw({ flag: 1, trickle: 2 }),
  draw({ flag: 2, trickle: 3 }),
  draw({ flag: 3, trickle: 4, eyes: 'angry' }),
];

export const SANDCASTLE_SPRITE = IDLE[0];

export const SANDCASTLE_ANIM = {
  chips: ['#e8cf8e', '#caa968', '#f6e6b0', '#a88848'],
  idle: { fps: 4, frames: IDLE },
  windup: {
    fps: 6,
    frames: [
      draw({ flag: 1, door: 1, lift: 1, eyes: 'angry' }),
      draw({ flag: 2, door: 3, lift: 1, eyes: 'angry', trickle: 1 }),
      draw({ flag: 3, door: 4, lift: 1, eyes: 'angry', trickle: 2 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(draw({ crumble: 0.1, eyes: 'angry' }), 2, 0), 'e'),
      shift(draw({ crumble: 0.1, trickle: 3, eyes: 'angry' }), 2, 0),
      shift(draw({ crumble: 0.05, trickle: 1 }), 1, 0),
    ],
  },
  death: {
    fps: 3,
    frames: [
      draw({ crumble: 0.3, eyes: 'dead', trickle: 1 }),
      draw({ crumble: 0.55, eyes: 'dead', trickle: 2 }),
      draw({ crumble: 0.8, eyes: 'dead', trickle: 3 }),
      draw({ crumble: 1, eyes: 'dead' }),
    ],
  },
  spared: {
    fps: 4,
    frames: [
      draw({ flag: 0, eyes: 'happy', flagUp: 2 }),
      draw({ flag: 1, eyes: 'happy', flagUp: 3, door: 1 }),
      draw({ flag: 2, eyes: 'happy', flagUp: 2 }),
      draw({ flag: 3, eyes: 'happy', flagUp: 3, door: 1 }),
    ],
  },
};
