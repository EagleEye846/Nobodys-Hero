import { Pix, flash, shift, crumble } from './ch5Kit.js';

// The MOONJELLY, 34x38: a big, soft, drifting jellyfish the blue-white of
// moonlight on water, with a four-leaf ring glowing in its bell, long
// trailing tendrils and a sleepy, faintly pleased face. It drifts and pulses
// without hurry. Its battle clips (MOONJELLY_ANIM, see `anim` in
// src/battle/battleScene.js): the bell breathes in and out while the
// tendrils sway; before an attack it squeezes hard and the tendrils flare;
// hit, it flinches and flashes; beaten, the bell sags and sinks into itself
// and goes out like a lamp; spared, it glows warm and its eyes close happily.
// Drawn from a pose (see src/data/art/ch5Kit.js).
export const MOONJELLY_PALETTE = {
  k: '#1f2750',
  b: '#b4cdf5',
  B: '#86a4e6',
  d: '#5f7ccc',
  w: '#f2f8ff',
  p: '#e0c4f6',
  P: '#b890e4',
  e: '#232a5a',
  t: '#a4c0f0',
  T: '#7694dc',
  g: '#fff4c4',
  m: '#f6a8c8',
};

// Poses: pulse (0..1 how squeezed the bell is), sway (tendril phase), eyes
// ('open' | 'blink' | 'happy' | 'dead'), flare (tendrils spread), sink (px
// the whole thing has sagged), glow (sparkle), sag (bell flattened).
function draw(pose = {}) {
  const { pulse = 0, sway = 0, eyes = 'open', flare = 0, sink = 0, glow = 0, sag = 0 } = pose;
  const p = new Pix(34, 38);
  const cx = 17;
  const bellTop = 3 + sink;
  const ry = 10 - pulse * 2.5 - sag * 3;
  const rx = 13 + pulse * 1.2 + sag * 2;
  const cy = bellTop + ry;
  const rimY = Math.round(cy + ry * 0.3);

  // Tendrils first, behind the bell.
  const roots = [[7, 0], [12, 0.8], [22, 2.1], [27, 3]];
  roots.forEach(([rx0, ph], i) => {
    const out = (i < 2 ? -1 : 1) * flare * 3;
    const len = 36 - sink * 0.2 - (i % 2) * 5 - sag * 5;
    for (let y = rimY; y < len; y++) {
      const k = (y - rimY) / (len - rimY);
      const x = rx0 + Math.sin(sway + ph + y * 0.38) * (1.4 + k * 1.9) + out * k;
      p.set(x, y, k > 0.6 ? 'T' : 't');
      p.set(x + 1, y, 'T');
    }
  });
  // Oral arms: thicker, frilly, pink-lilac.
  for (const [rx0, ph] of [[14, 0.4], [20, 2.4]]) {
    for (let y = rimY; y < 31 - sag * 5; y++) {
      const k = (y - rimY) / 16;
      const x = rx0 + Math.sin(sway * 1.1 + ph + y * 0.5) * (1 + k * 1.4) + (rx0 < 17 ? -1 : 1) * flare * 2 * k;
      p.set(x, y, 'p');
      p.set(x + 1, y, y % 3 === 0 ? 'P' : 'p');
      p.set(x - 1, y, y % 4 === 0 ? 'P' : '.');
    }
  }

  // The bell: a dome with a scalloped rim.
  const bell = new Pix(34, 38);
  bell.ellipse(cx, cy, rx + 1, ry + 1, 'k');
  bell.ellipse(cx, cy, rx, ry, 'b');
  bell.ellipse(cx + 1, cy + 2, rx - 2, ry - 3, 'B', ['b']);
  bell.ellipse(cx - 1, cy - 1.5, rx - 4, ry - 5, 'b');
  bell.rect(0, rimY + 1, 34, 12, '.');
  p.stamp(bell.rows(), 0, 0);
  p.rect(cx - rx - 1, rimY + 1, 2 * rx + 3, 1, 'k');
  for (let i = 0; i < 7; i++) {
    const sx = cx - rx + 2 + (i * (2 * rx - 4)) / 6;
    p.ellipse(sx, rimY + 0.5, 2, 1.2, 'k');
    p.ellipse(sx, rimY, 1.6, 0.8, 'd');
  }
  // The moon-ring in its bell: four little loops.
  const gy = cy - 1;
  for (const [ox, oy] of [[-3.2, -1.6], [3.2, -1.6], [-2.4, 2], [2.4, 2]]) {
    p.ellipse(cx + ox, gy + oy, 1.9, 1.5, 'P');
    p.ellipse(cx + ox, gy + oy - 0.3, 1.2, 0.8, 'p');
  }
  // A shine.
  p.ellipse(cx - 7, cy - ry + 3.4, 3, 1.2, 'w');
  p.set(cx - 9, cy - ry + 5, 'w');
  p.set(cx - 10, cy - ry + 6, 'w');
  // The face.
  const ey = Math.round(cy + ry * 0.45);
  for (const ex of [cx - 5, cx + 5]) {
    if (eyes === 'blink') p.rect(ex - 1, ey, 3, 1, 'e');
    else if (eyes === 'happy') { p.set(ex - 1, ey, 'e'); p.set(ex, ey - 1, 'e'); p.set(ex + 1, ey, 'e'); }
    else if (eyes === 'dead') { p.set(ex - 1, ey - 1, 'e'); p.set(ex + 1, ey + 1, 'e'); p.set(ex + 1, ey - 1, 'e'); p.set(ex - 1, ey + 1, 'e'); }
    else { p.rect(ex - 1, ey - 1, 3, 3, 'e'); p.set(ex - 1, ey - 1, 'w'); }
    if (eyes !== 'dead') p.set(ex + 2, ey + 1, 'm');
  }
  p.rect(cx - 1, ey + 2, 3, 1, 'e');
  if (eyes === 'happy') { p.set(cx - 2, ey + 1, 'e'); p.set(cx + 2, ey + 1, 'e'); }
  // Moon sparkles.
  const sparks = [[3, 5], [30, 8], [32, 22], [2, 20]];
  sparks.forEach(([sx, sy], i) => {
    if ((glow + i) % 2) return;
    p.set(sx, sy, 'g');
    p.set(sx - 1, sy, 'g');
    p.set(sx + 1, sy, 'g');
    p.set(sx, sy - 1, 'g');
    p.set(sx, sy + 1, 'g');
  });
  return p.outline('k').rows();
}

// The outline pass above also rims the tendrils; that's the look.
const IDLE = [
  draw({ pulse: 0, sway: 0, glow: 0 }),
  draw({ pulse: 0.5, sway: 0.9, glow: 1 }),
  draw({ pulse: 1, sway: 1.8, glow: 0 }),
  draw({ pulse: 0.5, sway: 2.7, glow: 1, eyes: 'blink' }),
  draw({ pulse: 0, sway: 3.6, glow: 0 }),
  draw({ pulse: 0.2, sway: 4.5, glow: 1 }),
];

export const MOONJELLY_SPRITE = IDLE[0];

export const MOONJELLY_ANIM = {
  chips: ['#b4cdf5', '#e0c4f6', '#f2f8ff', '#86a4e6'],
  idle: { fps: 4, frames: IDLE },
  windup: {
    fps: 6,
    frames: [
      draw({ pulse: 0.6, sway: 0.4, flare: 0.5, glow: 1 }),
      draw({ pulse: 1, sway: 1.2, flare: 1, glow: 0 }),
      draw({ pulse: 1, sway: 2, flare: 1.4, glow: 1 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(draw({ pulse: 1, flare: 1 }), 2, 0)),
      shift(draw({ pulse: 1, flare: 0.6, eyes: 'blink', sway: 1 }), 2, 1),
      shift(draw({ pulse: 0.5, flare: 0.3, sway: 2 }), 1, 0),
    ],
  },
  death: {
    fps: 3,
    frames: [
      draw({ pulse: 1, sag: 0.3, eyes: 'dead', sink: 1, sway: 1 }),
      draw({ pulse: 0, sag: 0.8, eyes: 'dead', sink: 4, sway: 2 }),
      draw({ pulse: 0, sag: 1, eyes: 'dead', sink: 8, sway: 3 }),
      crumble(draw({ pulse: 0, sag: 1, eyes: 'dead', sink: 12, sway: 3 }), 0.5, false),
    ],
  },
  spared: {
    fps: 4,
    frames: [
      draw({ eyes: 'happy', pulse: 0.2, glow: 0, sway: 0 }),
      draw({ eyes: 'happy', pulse: 0.8, glow: 1, sway: 1.5 }),
      draw({ eyes: 'happy', pulse: 0.2, glow: 0, sway: 3 }),
      draw({ eyes: 'happy', pulse: 0.8, glow: 1, sway: 4.5 }),
    ],
  },
};
