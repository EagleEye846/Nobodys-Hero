import { Pix, flash, shift } from './ch5Kit.js';

// The SHELLAC, 36x32: a hermit crab who has moved into a teapot. Cream china
// with a blue willow pattern, a lid with a knob, a spout and a handle, and a
// very put-upon orange crab in the front door, one big claw ready. It is
// house-proud and extremely snappish about it. Its battle clips (SHELLAC_ANIM,
// see `anim` in src/battle/battleScene.js): the claw clacks and steam curls
// off the spout; it raises the claw wide before an attack; hit, it flinches
// into the pot; beaten, the lid pops off and it flops out on its back;
// spared, it puts the lid on like a hat and clacks happily. The shapes are
// drawn from a pose (see src/data/art/ch5Kit.js).
export const SHELLAC_PALETTE = {
  k: '#1c1a24',
  c: '#f4eedb',
  C: '#cfc7ac',
  w: '#ffffff',
  b: '#4f7fc8',
  B: '#2f4f94',
  r: '#e0673a',
  R: '#a8432a',
  o: '#f5a070',
  e: '#fff8e0',
  s: '#dff2f0',
};

function blob(p, cx, cy, rx, ry, c) {
  p.ellipse(cx, cy, rx + 1, ry + 1, 'k');
  p.ellipse(cx, cy, rx, ry, c);
}

// Poses: bob (px the crab bobs), claw (0 shut .. 1 wide), raise (px the claw
// lifts), steam (0..3), eyes ('open' | 'blink' | 'squint' | 'happy' | 'dead'),
// lid ({ dx, dy } the lid's offset, and `tilt`), sx (whole pot shifts),
// flop (death: crab lies on its back), tilt (pot leans).
function draw(pose = {}) {
  const { bob = 0, claw = 0.3, raise = 0, steam = 0, eyes = 'open', lid = null, sx = 0, flop = 0, tilt = 0 } = pose;
  const p = new Pix(36, 32);
  const px = 23 + sx;
  const py = 20 + flop * 3;

  // Handle and spout first (behind the body).
  p.ring(px + 9, py - 3, 3, 5, 'C', 1.6);
  p.line(px - 7, py - 2, px - 13 - tilt, py - 9, 'C', 4);
  p.line(px - 7, py - 3, px - 13 - tilt, py - 10, 'c', 2);
  // The pot.
  p.ellipse(px, py, 11, 8, 'k');
  p.ellipse(px, py, 10, 7.4, 'C');
  p.ellipse(px - 1, py - 1.4, 8.6, 5.8, 'c');
  p.ellipse(px - 4, py - 3.5, 2.5, 1.5, 'w');
  // Willow pattern: a blue band and little flowers.
  p.rect(px - 9, py + 1, 19, 1, 'b', ['c', 'C']);
  for (const [fx, fy] of [[px - 3, py - 3], [px + 3, py - 3], [px + 6, py - 1]]) {
    p.set(fx, fy, 'B');
    p.set(fx - 1, fy, 'b');
    p.set(fx + 1, fy, 'b');
    p.set(fx, fy - 1, 'b');
    p.set(fx, fy + 1, 'b');
  }
  p.rect(px - 7, py + 4, 14, 1, 'b', ['c', 'C']);
  // The lid and its knob (it can lift off).
  const l = lid ?? { dx: 0, dy: 0 };
  const lx = px + l.dx;
  const ly = py - 8 + l.dy;
  p.ellipse(lx, ly, 7, 2.6, 'k');
  p.ellipse(lx, ly, 6.2, 2, 'c');
  p.rect(lx - 5, ly + 1, 11, 1, 'b');
  p.ellipse(lx, ly - 3.4, 2.1, 1.7, 'k');
  p.ellipse(lx, ly - 3.4, 1.4, 1.1, 'c');
  p.set(lx, ly - 4, 'b');

  // Steam from the spout.
  const sx0 = px - 14 - tilt;
  const sy0 = py - 11;
  const puffs = [[0, -2], [1, -4], [0, -6], [-1, -8]];
  for (let i = 0; i < puffs.length; i++) {
    if ((i + steam) % 2) continue;
    p.set(sx0 + puffs[i][0], sy0 + puffs[i][1], 's');
    p.set(sx0 + puffs[i][0] + 1, sy0 + puffs[i][1], 's');
  }

  // The crab.
  const cy = 25 + bob + flop * 2;
  // Legs.
  for (const [lx0, lx1] of [[4, 2], [8, 7], [12, 14], [15, 18]]) p.line(lx0 + 1, cy + 3, lx1 + 1, 31, 'R');
  blob(p, 10, cy, 7, 4.5, 'r');
  p.ellipse(10, cy + 2, 6, 2, 'R', ['r']);
  p.ellipse(8, cy - 2, 4, 1.5, 'o', ['r']);
  // Eye stalks.
  const ey = cy - 5 - (flop ? -2 : 0);
  p.line(7, cy - 3, 6, ey + 1, 'r');
  p.line(12, cy - 3, 13, ey + 1, 'r');
  for (const ex of [6, 13]) {
    p.ellipse(ex, ey - 1, 2.2, 2.2, 'k');
    if (eyes === 'dead') {
      p.ellipse(ex, ey - 1, 1.5, 1.5, 'e');
      p.set(ex - 1, ey - 2, 'k'); p.set(ex + 1, ey, 'k'); p.set(ex + 1, ey - 2, 'k'); p.set(ex - 1, ey, 'k');
    } else if (eyes === 'blink' || eyes === 'happy') {
      p.rect(ex - 1, ey - 1, 3, 1, eyes === 'happy' ? 'e' : 'R');
      if (eyes === 'happy') p.set(ex, ey - 2, 'k');
    } else {
      p.ellipse(ex, ey - 1, 1.5, 1.5, 'e');
      p.set(ex - 1, ey - 1, 'k');
      if (eyes === 'squint') p.rect(ex - 1, ey - 2, 3, 1, 'k');
    }
  }
  // Brow: cross.
  if (eyes === 'open' || eyes === 'squint') { p.set(7, ey - 3, 'k'); p.set(12, ey - 3, 'k'); }
  // The big claw.
  const kx = 3;
  const ky = cy - 3 - raise;
  p.line(7, cy, kx + 1, ky + 3, 'k', 4);
  p.line(7, cy, kx + 1, ky + 3, 'r', 2);
  p.ellipse(kx, ky, 4, 3.4, 'k');
  p.ellipse(kx, ky, 3.3, 2.7, 'r');
  p.ellipse(kx - 1, ky - 1, 1.6, 1, 'o');
  // The gap between the pincers.
  const gap = Math.round(claw * 3);
  for (let g = 0; g <= gap; g++) p.line(kx - 4, ky - g * 0.4, kx, ky - g * 0.2, 'k');
  if (gap) p.rect(kx - 4, ky - 1, 3, 1, '.');
  p.outline('k');
  // The small claw.
  blob(p, 15, 28 + bob, 2.4, 1.8, 'r');
  return p.rows();
}

const IDLE = [
  draw({ bob: 0, claw: 0.2, steam: 0 }),
  draw({ bob: 1, claw: 0.7, steam: 1 }),
  draw({ bob: 0, claw: 0.2, steam: 0, eyes: 'blink' }),
  draw({ bob: 1, claw: 0.8, steam: 1 }),
];

export const SHELLAC_SPRITE = IDLE[0];

export const SHELLAC_ANIM = {
  chips: ['#f4eedb', '#cfc7ac', '#4f7fc8', '#e0673a'],
  idle: { fps: 3, frames: IDLE },
  windup: {
    fps: 7,
    frames: [
      draw({ claw: 0.5, raise: 3, bob: 1 }),
      draw({ claw: 1, raise: 7, bob: 0, eyes: 'squint', sx: 1 }),
      draw({ claw: 1, raise: 7, bob: 0, eyes: 'squint', sx: 1 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(draw({ eyes: 'squint', claw: 0 }), 2, 0)),
      shift(draw({ eyes: 'squint', claw: 0, bob: 2, tilt: -1 }), 2, 0),
      shift(draw({ eyes: 'squint', claw: 0, bob: 1 }), 1, 0),
    ],
  },
  death: {
    fps: 4,
    frames: [
      draw({ eyes: 'squint', claw: 0, bob: 2, lid: { dx: 0, dy: -2 }, raise: -2 }),
      draw({ eyes: 'dead', claw: 1, bob: 3, lid: { dx: 3, dy: -6 }, raise: -3, flop: 1 }),
      draw({ eyes: 'dead', claw: 1, bob: 3, lid: { dx: 6, dy: -3 }, raise: -4, flop: 1, steam: 1 }),
      draw({ eyes: 'dead', claw: 1, bob: 4, lid: { dx: 8, dy: 1 }, raise: -4, flop: 1, steam: 0 }),
    ],
  },
  spared: {
    fps: 4,
    frames: [
      draw({ eyes: 'happy', claw: 1, raise: 4, lid: { dx: 0, dy: -1 }, bob: 1 }),
      draw({ eyes: 'happy', claw: 0, raise: 4, lid: { dx: -1, dy: -3 }, bob: 0, steam: 1 }),
      draw({ eyes: 'happy', claw: 1, raise: 5, lid: { dx: 0, dy: -1 }, bob: 1 }),
      draw({ eyes: 'happy', claw: 0, raise: 4, lid: { dx: 1, dy: -3 }, bob: 0, steam: 1 }),
    ],
  },
};
