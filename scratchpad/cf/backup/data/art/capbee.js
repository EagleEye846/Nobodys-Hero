import { Pix, dissolve, recolour, clip } from './pixKit.js';

// The FLATCAP BEE, 36x34, facing left: a plump bumblebee in a tweed flat cap,
// the sort that has worked the same clover patch for forty years and has
// opinions about the new flowers. Idle, he hovers and his wings blur; before
// an attack he tips his cap and curls his stinger up; hit, he spins and the
// cap goes askew; beaten, he drops upside-down; spared, he takes off the cap
// and holds it to his chest. Drawn in code (see pixKit.js).
export const CAPBEE_PALETTE = {
  k: '#2a2018',
  y: '#ffcf2e',
  Y: '#e39c1c',
  l: '#fff2a0',
  b: '#3a2f28',
  v: '#cfe8f6',
  V: '#9cc4e0',
  w: '#ffffff',
  T: '#8a8f7a',
  t: '#5e6450',
  u: '#b9bd9f',
  p: '#ff9aa8',
  e: '#1a1018',
  o: '#e8923a',
};

const W = 36;
const H = 34;

// pose: dy (hover), wing (0-2), eye ('calm' | 'wide' | 'x' | 'glad'), mouth (0 smile, 1 open),
// sting (0 rest, 1 curled up), tip (cap lifted, 0-2), tilt (cap askew), down (upside down), lean.
function drawBee(pose) {
  const { dy = 0, wing = 0, eye = 'calm', mouth = 0, sting = 0, tip = 0, tilt = 0, down = 0, lean = 0 } = pose;
  const g = new Pix(W, H);
  const cx = 22 + lean;
  const cy = 19 + dy;
  // Wings, behind.
  const wy = cy - 11 + (wing === 1 ? 1 : wing === 2 ? -1 : 0);
  g.disc(cx - 1, wy, 7, wing === 1 ? 2.2 : 3.4, 'v');
  g.disc(cx + 6, wy + 1, 6, wing === 1 ? 1.8 : 3, 'V');
  g.line(cx - 6, wy + 1, cx + 3, wy - 1, 'w');
  // The stinger.
  if (sting) {
    g.line(cx + 11, cy - 1, cx + 15, cy - 6, 'k', 2);
  } else {
    g.line(cx + 11, cy + 2, cx + 16, cy + 3, 'k', 2);
  }
  // The body, striped.
  g.disc(cx, cy, 12, 9.4, 'y');
  g.disc(cx + 1, cy + 4, 10, 4.6, 'Y', 'y');
  for (const [sx, sw, sh] of [[cx - 5, 3, 8.6], [cx + 2, 3, 9.2], [cx + 8, 2, 7]]) {
    for (let x = sx; x < sx + sw; x++) {
      for (let y = Math.round(cy - sh); y <= Math.round(cy + sh); y++) {
        if (g.get(x, y) !== '.') g.set(x, y, 'b');
      }
    }
  }
  g.disc(cx - 8, cy - 3, 2.4, 1.6, 'l', 'y');
  // Little legs.
  for (const x of [cx - 4, cx + 1, cx + 6]) g.line(x, cy + 8, x - 1, cy + 12, 'k');
  // The head.
  const hx = 9 + lean;
  const hy = cy - 1;
  g.disc(hx, hy, 7, 6.6, 'y');
  g.disc(hx + 1, hy + 3, 5.4, 3, 'Y', 'y');
  g.disc(hx - 2, hy + 3, 2, 1.3, 'p');
  // Feelers.
  g.line(hx - 2, hy - 6, hx - 5, hy - 11, 'k');
  g.line(hx + 3, hy - 6, hx + 6, hy - 11, 'k');
  g.disc(hx - 5, hy - 12, 1.2, 1.2, 'k');
  g.disc(hx + 6, hy - 12, 1.2, 1.2, 'k');
  // The eye.
  const ex = hx - 3;
  const ey = hy - 2;
  if (eye === 'calm') {
    // Bright and pleased with himself: a tall pupil with a shine.
    g.rect(ex, ey, 4, 4, 'w');
    g.rect(ex, ey, 2, 3, 'e');
    g.set(ex + 1, ey, 'w');
  } else if (eye === 'wide') {
    g.rect(ex, ey - 1, 5, 5, 'w');
    g.rect(ex + 1, ey + 1, 2, 2, 'e');
  } else if (eye === 'x') {
    g.set(ex, ey, 'e'); g.set(ex + 3, ey, 'e'); g.set(ex + 1, ey + 1, 'e'); g.set(ex + 2, ey + 1, 'e'); g.set(ex, ey + 3, 'e'); g.set(ex + 3, ey + 3, 'e');
  } else {
    g.line(ex, ey + 2, ex + 1, ey + 1, 'e');
    g.line(ex + 1, ey + 1, ex + 3, ey + 2, 'e');
  }
  // The mouth.
  if (mouth) {
    g.rect(hx - 6, hy + 4, 4, 2, 'e');
    g.set(hx - 5, hy + 5, 'p');
  } else {
    // A cheerful little smile.
    g.set(hx - 6, hy + 3, 'e');
    g.line(hx - 5, hy + 4, hx - 4, hy + 4, 'e');
    g.set(hx - 3, hy + 3, 'e');
  }
  // The flat cap: a soft tweed pancake with a short peak and a button.
  if (tip < 2) {
    const lift = tip * -3;
    const sk = tilt * 2;
    const capy = hy - 6 + lift;
    g.disc(hx + 1 + sk, capy, 7, 3.4, 'T');
    g.disc(hx + 3 + sk, capy - 1, 4, 1.6, 'u', 'T');
    g.rect(hx - 8 + sk, capy + 1, 6, 2, 't');
    g.set(hx + 1 + sk, capy - 3, 't');
    g.line(hx - 6 + sk, capy, hx + 6 + sk, capy + 1, 't');
  }
  g.outline('k');
  if (down) return g.rows().slice().reverse();
  return g.rows();
}

const FLASH = { y: 'w', Y: 'l', T: 'u', b: 'T', v: 'w' };

export const CAPBEE_SPRITE = drawBee({});

export const CAPBEE_ANIM = {
  chips: ['#ffcf2e', '#3a2f28', '#8a8f7a'],
  idle: clip(8, [0, 1, 2, 3], (i) => drawBee({ dy: [0, -1, 0, 1][i], wing: i % 3 })),
  windup: clip(8, [0, 1, 2, 3, 4], (i) => drawBee({ dy: i < 2 ? 1 : -1, wing: i % 3, eye: 'wide', mouth: 1, sting: i > 1 ? 1 : 0, tip: i > 0 ? 1 : 0, lean: i < 2 ? 1 : -1 })),
  hurt: clip(12, [0, 1, 2, 3], (i) => {
    const rows = drawBee({ dy: i === 1 ? 2 : 0, lean: 2, wing: 1, eye: 'x', mouth: 1, tilt: 2 });
    return i === 0 ? recolour(rows, FLASH) : rows;
  }),
  death: clip(4, [0, 1, 2, 3, 4, 5], (i) => dissolve(drawBee({ dy: Math.min(i, 3) * 2, down: i > 0 ? 1 : 0, wing: 1, eye: 'x', mouth: 1, tilt: 2 }), i >= 3 ? (i - 2) * 0.3 : 0, 9)),
  spared: clip(4, [0, 1, 2, 3], (i) => drawBee({ dy: i % 2 ? -1 : 0, wing: i % 3, eye: 'glad', tip: 2 })),
};
