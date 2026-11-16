import { Pix, dissolve, recolour, clip } from './pixKit.js';

// The SEED SHEEP, 38x34, facing left: a small, placid sheep whose fleece is
// a dandelion clock, a great round puff of seed-wisps on little stalks,
// with a yellow dandelion tucked behind one ear. It grazes, it baas, and
// every time it baas a few seeds float off. Idle, it bobs and chews; before
// an attack it throws its head back and baas; hit, it reels and sheds
// seeds; beaten, it sits down bald and round; spared, it fluffs right back
// up and gives a sleepy smile. Drawn in code (see pixKit.js).
export const SEED_SHEEP_PALETTE = {
  k: '#3a2e2a',
  w: '#ffffff',
  W: '#f6f3e8',
  s: '#dcd7c4',
  d: '#bdb6a0',
  f: '#5e4c46',
  F: '#85705f',
  y: '#ffd93b',
  Y: '#e3a42a',
  g: '#6aa84f',
  p: '#ff9aa8',
  e: '#1a1018',
  c: '#fff6cc',
};

const W = 38;
const H = 34;

// pose: dy (bounce), mouth (0 shut, 1 chewing, 2 baa), eye ('calm' | 'wide' | 'x' | 'glad'),
// lean (head and body shift), shed (0-22 seed wisps gone), down (0-1, sat bald), seed (a wisp in the air).
function drawSheep(pose) {
  const { dy = 0, mouth = 0, eye = 'calm', lean = 0, shed = 0, down = 0, seed = 0 } = pose;
  const g = new Pix(W, H);
  const cx = 22 + lean;
  const cy = 15 + dy + down * 4;
  // Legs, behind the fleece.
  if (!down) {
    for (const x of [15, 19, 26, 30]) {
      g.line(x + lean, cy + 8, x, 30, 'F', 2);
      g.rect(x - 1, 30, 3, 2, 'k');
    }
  } else {
    g.rect(14, 29, 5, 2, 'F');
    g.rect(27, 29, 5, 2, 'F');
  }
  // The seed wisps: a stalk with a white tuft at the top, all round the fleece.
  const N = 22;
  for (let i = 0; i < N; i++) {
    if ((i * 7) % N < shed) continue;
    const a = (i / N) * Math.PI * 2 - 0.4;
    const x0 = cx + Math.cos(a) * 12;
    const y0 = cy + Math.sin(a) * 10;
    const x1 = cx + Math.cos(a) * 16;
    const y1 = cy + Math.sin(a) * 13.5;
    g.line(x0, y0, x1, y1, 'd');
    g.disc(x1, y1, 1.3, 1.3, 'w');
  }
  // The fleece.
  g.disc(cx, cy, 13, 11, 'W');
  g.disc(cx + 1, cy + 5, 11, 5.5, 's', 'W');
  g.disc(cx - 4, cy - 5, 4, 3, 'w', 'W');
  // A few fine seed lines across it.
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    g.line(cx, cy, cx + Math.cos(a) * 9, cy + Math.sin(a) * 8, 's');
  }
  g.disc(cx, cy, 1.6, 1.6, 'd');
  // The tail: a tiny puff.
  g.disc(cx + 14, cy + 2, 2.4, 2.4, 'W');
  // The head.
  const hx = 7 + lean + (mouth === 2 ? -1 : 0);
  const hy = cy + 4 + (mouth === 2 ? -3 : 0) + (down ? 2 : 0);
  g.disc(hx + 4, hy + 2, 5, 4.4, 'W');
  g.disc(hx, hy, 6, 5.5, 'f');
  g.disc(hx - 2, hy + 2, 3.4, 2.8, 'F');
  g.set(hx - 4, hy + 1, 'e');
  g.set(hx - 3, hy + 1, 'e');
  // Ears, both perked up, pink inside.
  g.disc(hx + 4, hy - 4, 3.2, 1.8, 'f');
  g.set(hx + 4, hy - 4, 'p');
  g.disc(hx + 6, hy - 2, 2.6, 1.6, 'f');
  g.set(hx + 6, hy - 2, 'p');
  // A rosy cheek.
  g.disc(hx - 1, hy + 2, 1.4, 1, 'p');
  // A dandelion behind the ear.
  g.line(hx + 2, hy - 5, hx + 1, hy - 8, 'g');
  g.disc(hx + 1, hy - 9, 2.6, 2.2, 'y');
  g.set(hx + 1, hy - 9, 'Y');
  // The mouth.
  if (mouth === 2) {
    g.rect(hx - 5, hy + 3, 5, 3, 'e');
    g.rect(hx - 4, hy + 5, 3, 1, 'p');
  } else if (mouth === 1) {
    // Chewing, contentedly.
    g.set(hx - 5, hy + 3, 'e');
    g.rect(hx - 4, hy + 4, 2, 1, 'e');
  } else {
    // A happy little smile.
    g.set(hx - 5, hy + 3, 'e');
    g.line(hx - 4, hy + 4, hx - 2, hy + 4, 'e');
    g.set(hx - 1, hy + 3, 'e');
  }
  // The eye.
  const ex = hx + 1;
  const ey = hy - 1;
  if (eye === 'calm') {
    // A big round shiny eye, not a sleepy lid.
    g.rect(ex, ey - 1, 3, 3, 'e');
    g.set(ex, ey - 1, 'w');
  } else if (eye === 'wide') {
    g.rect(ex, ey - 1, 3, 4, 'w');
    g.set(ex + 1, ey + 1, 'e');
  } else if (eye === 'x') {
    g.set(ex, ey, 'e'); g.set(ex + 2, ey, 'e'); g.set(ex + 1, ey + 1, 'e'); g.set(ex, ey + 2, 'e'); g.set(ex + 2, ey + 2, 'e');
  } else {
    g.line(ex, ey + 1, ex + 1, ey, 'e');
    g.line(ex + 1, ey, ex + 2, ey + 1, 'e');
  }
  // A wisp in the air, if one has come loose.
  if (seed) {
    g.line(4 + seed * 3, 5 + seed, 7 + seed * 3, 2 + seed, 'd');
    g.disc(8 + seed * 3, 2 + seed, 1.3, 1.3, 'w');
  }
  g.outline('k');
  return g.rows();
}

const FLASH = { W: 'w', s: 'w', d: 'w', f: 'F', y: 'w' };

export const SEED_SHEEP_SPRITE = drawSheep({});

export const SEED_SHEEP_ANIM = {
  chips: ['#ffffff', '#dcd7c4', '#ffd93b'],
  idle: clip(4, [0, 1, 2, 3], (i) => drawSheep({ dy: [0, -1, 0, 1][i], mouth: i % 2, seed: i === 3 ? 1 : 0 })),
  windup: clip(8, [0, 1, 2, 3, 4], (i) => drawSheep({ dy: i < 2 ? 1 : -1, mouth: i > 1 ? 2 : 0, eye: 'wide', lean: i < 2 ? 1 : -1, shed: i * 2 })),
  hurt: clip(12, [0, 1, 2, 3], (i) => {
    const rows = drawSheep({ dy: i === 1 ? 2 : 0, lean: 2, mouth: 2, eye: 'x', shed: 6 + i * 2 });
    return i === 0 ? recolour(rows, FLASH) : rows;
  }),
  death: clip(4, [0, 1, 2, 3, 4, 5], (i) => dissolve(drawSheep({ down: Math.min(1, i * 0.5), mouth: 1, eye: 'x', shed: Math.min(22, 8 + i * 5), lean: Math.min(i, 2) }), i >= 3 ? (i - 2) * 0.3 : 0, 11)),
  spared: clip(4, [0, 1, 2, 3], (i) => drawSheep({ dy: i % 2 ? -1 : 0, eye: 'glad', mouth: 1, seed: i })),
};
