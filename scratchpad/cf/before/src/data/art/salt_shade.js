import { Pix, flash, shift, crumble } from './ch5Kit.js';

// The SALT SHADE, 38x44: the ghost of a drowned sailor, sea-green and
// see-through, in a sou'wester and an oilskin coat that stops being a coat
// and starts being water near the hem. Seaweed beard, barnacles on the
// shoulders, a coil of rope over one arm and two pale, patient lights where
// the eyes were. It has been waiting for a ship for a very long time. Its
// battle clips (SALT_SHADE_ANIM, see `anim` in src/battle/battleScene.js): it
// sways, the hem streams and a drip rises; before an attack it hauls the
// rope arm back; hit, it flashes and flickers; beaten, it comes apart into
// bubbles; spared, it takes off its hat. Drawn from a pose (see
// src/data/art/ch5Kit.js).
export const SALT_SHADE_PALETTE = {
  k: '#132a34',
  b: '#6fb8b2',
  B: '#3f8088',
  d: '#265460',
  w: '#d4f0ec',
  e: '#f0ffff',
  y: '#d8c060',
  Y: '#8e7a2c',
  g: '#4c8044',
  G: '#2e5a2e',
  r: '#cfae7c',
  R: '#8c6c42',
  n: '#b8c8c4',
  x: '#9ad8d0',
};

// Poses: sway (px), arm (0 resting .. 1 hauled back .. -1 thrown), eyes
// ('glow' | 'flare' | 'closed' | 'dead' | 'happy'), hat (px lifted off; spared
// holds it to its chest), fade (death: 0..1), wave (hem phase), drip.
function draw(pose = {}) {
  const { sway = 0, arm = 0, eyes = 'glow', hat = 0, wave = 0, bob = 0, hold = false } = pose;
  const p = new Pix(40, 46);
  const cx = 19 + sway;
  const hy = 14 + bob;

  // The coat: broad shoulders narrowing, then a ragged, streaming hem.
  p.poly([[cx - 8, hy + 4], [cx + 8, hy + 4], [cx + 11, hy + 14], [cx + 8, hy + 24], [cx - 8, hy + 24], [cx - 11, hy + 14]], 'k');
  p.poly([[cx - 7, hy + 5], [cx + 7, hy + 5], [cx + 10, hy + 14], [cx + 7, hy + 24], [cx - 7, hy + 24], [cx - 10, hy + 14]], 'b');
  p.poly([[cx + 1, hy + 5], [cx + 7, hy + 5], [cx + 10, hy + 14], [cx + 7, hy + 24], [cx + 2, hy + 24]], 'B', ['b']);
  // Buttons and a seam.
  p.line(cx, hy + 6, cx, hy + 22, 'd');
  for (let i = 0; i < 4; i++) p.set(cx - 2, hy + 8 + i * 4, 'n');
  // The hem: strands of water, streaming.
  for (let i = -8; i <= 8; i += 2) {
    const len = 7 + ((i * 7 + 20) % 5);
    for (let y = 0; y < len; y++) {
      const x = cx + i + Math.sin(wave + i * 0.7 + y * 0.45) * (0.6 + y * 0.18);
      p.set(x, hy + 24 + y, y > len - 3 ? 'x' : y > 3 ? 'b' : 'B');
    }
  }
  // Barnacles on the shoulders.
  for (const [bx, by] of [[cx - 7, hy + 5], [cx + 6, hy + 6], [cx - 8, hy + 8]]) {
    p.set(bx, by, 'w');
    p.set(bx + 1, by, 'n');
  }
  // The rope arm (his left, ours right): coil over the forearm.
  const handX = cx + 12 + arm * 3;
  const handY = hy + 14 - arm * 8;
  p.line(cx + 8, hy + 7, handX, handY, 'k', 4);
  p.line(cx + 8, hy + 7, handX, handY, 'b', 2);
  p.ellipse(handX, handY, 2.4, 2.4, 'k');
  p.ellipse(handX, handY, 1.6, 1.6, 'w');
  p.ring(handX - 1, handY + 3, 4.5, 4.5, 'k', 2.4);
  p.ring(handX - 1, handY + 3, 4, 4, 'r', 1.4);
  p.line(handX - 4, handY + 3, handX - 2, handY + 6, 'R');
  // The other arm, hanging (or pressed to the chest holding the hat).
  if (hold) {
    p.line(cx - 8, hy + 7, cx - 3, hy + 13, 'k', 4);
    p.line(cx - 8, hy + 7, cx - 3, hy + 13, 'b', 2);
  } else {
    p.line(cx - 8, hy + 7, cx - 12, hy + 18, 'k', 4);
    p.line(cx - 8, hy + 7, cx - 12, hy + 18, 'b', 2);
    p.ellipse(cx - 12, hy + 19, 2, 2, 'k');
    p.ellipse(cx - 12, hy + 19, 1.2, 1.2, 'w');
  }
  // Head: gaunt, hollow-eyed, with a seaweed beard.
  p.ellipse(cx - 1, hy, 6, 5.4, 'k');
  p.ellipse(cx - 1, hy, 5, 4.5, 'w');
  p.ellipse(cx, hy + 1, 4, 3, 'n', ['w']);
  p.rect(cx - 5, hy - 1, 9, 3, 'd');
  for (const ex of [cx - 4, cx + 1]) {
    if (eyes === 'closed') p.rect(ex, hy, 3, 1, 'k');
    else if (eyes === 'happy') { p.set(ex, hy + 1, 'e'); p.set(ex + 1, hy, 'e'); p.set(ex + 2, hy + 1, 'e'); }
    else if (eyes === 'dead') { p.set(ex, hy - 1, 'x'); p.set(ex + 2, hy + 1, 'x'); p.set(ex + 2, hy - 1, 'x'); p.set(ex, hy + 1, 'x'); }
    else { p.rect(ex, hy - 1, 3, 3, 'e'); p.set(ex + 1, hy, 'x'); if (eyes === 'flare') { p.rect(ex - 1, hy - 2, 5, 5, 'x', ['.', 'd']); p.rect(ex, hy - 1, 3, 3, 'e'); } }
  }
  p.rect(cx - 2, hy + 3, 3, 1, 'd');
  // Beard.
  for (let i = -4; i <= 2; i++) {
    const len = 4 + (i % 2 ? 1 : 3);
    for (let y = 0; y < len; y++) p.set(cx + i + Math.sin(wave + i + y * 0.5) * 0.7, hy + 4 + y, y % 2 ? 'g' : 'G');
  }
  // The sou'wester: a deep brim in front, a tail at the back, yellow.
  if (!hold || hat) {
    const hyy = hy - 4 - hat;
    p.ellipse(cx - 1, hyy, 8.5, 2.4, 'k');
    p.ellipse(cx - 1, hyy, 7.8, 1.8, 'y');
    p.ellipse(cx - 1, hyy - 3, 5.4, 3.6, 'k');
    p.ellipse(cx - 1, hyy - 3, 4.7, 3, 'y');
    p.line(cx + 6, hyy, cx + 11, hyy + 5, 'Y', 2);
    p.line(cx - 4, hyy - 4, cx + 1, hyy - 5, 'w');
    p.rect(cx - 5, hyy, 9, 1, 'Y');
  }
  if (hold) {
    // Hat held to the chest.
    p.ellipse(cx - 3, hy + 11, 5, 1.8, 'k');
    p.ellipse(cx - 3, hy + 11, 4.3, 1.2, 'y');
    p.ellipse(cx - 3, hy + 9, 3, 2, 'k');
    p.ellipse(cx - 3, hy + 9, 2.4, 1.4, 'y');
  }
  return p.outline('k').rows();
}

const IDLE = [
  draw({ sway: -1, wave: 0, bob: 0 }),
  draw({ sway: 0, wave: 0.9, bob: -1 }),
  draw({ sway: 1, wave: 1.8, bob: 0 }),
  draw({ sway: 0, wave: 2.7, bob: -1, eyes: 'closed' }),
];

export const SALT_SHADE_SPRITE = IDLE[0];

export const SALT_SHADE_ANIM = {
  chips: ['#6fb8b2', '#d4f0ec', '#9ad8d0', '#3f8088'],
  idle: { fps: 4, frames: IDLE },
  windup: {
    fps: 7,
    frames: [
      draw({ arm: 0.5, sway: 1, wave: 1, eyes: 'flare' }),
      draw({ arm: 1, sway: 2, wave: 2, eyes: 'flare', bob: -1 }),
      draw({ arm: 1, sway: 2, wave: 3, eyes: 'flare', bob: -1 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(draw({ arm: 0.3, eyes: 'closed' }), 2, 0)),
      shift(draw({ arm: 0.3, eyes: 'closed', sway: -1, wave: 1.5 }), 2, 0),
      shift(draw({ wave: 2 }), 1, 0),
    ],
  },
  death: {
    fps: 3,
    frames: [
      draw({ arm: -0.5, eyes: 'dead', sway: 2, wave: 1 }),
      crumble(draw({ arm: -1, eyes: 'dead', sway: 2, wave: 2, bob: 2 }), 0.35, true),
      crumble(draw({ arm: -1, eyes: 'dead', sway: 2, wave: 3, bob: 4 }), 0.65, true),
      crumble(draw({ arm: -1, eyes: 'dead', sway: 2, wave: 4, bob: 6 }), 0.9, true),
    ],
  },
  spared: {
    fps: 3,
    frames: [
      draw({ eyes: 'happy', hold: true, wave: 0 }),
      draw({ eyes: 'happy', hold: true, wave: 1, bob: -1 }),
      draw({ eyes: 'happy', hold: true, wave: 2 }),
      draw({ eyes: 'happy', hold: true, wave: 3, bob: -1 }),
    ],
  },
};
