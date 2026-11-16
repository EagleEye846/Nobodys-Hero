import { Pix, dissolve, recolour, clip, shiftRows } from './pixKit.js';

// The SOOT GULL, 38x30, facing left: a herring gull gone grey all over with
// soot, white only where it has preened, a sea bird a long way from the sea.
// It is still a thief, and what there is to steal out here is embers: it
// carries one in its beak like a cigarette. Hard yellow eye, a red spot on
// the beak gone brown. Idle, it shifts from foot to foot and the ember in its
// beak glows and dims; before an attack it throws its wings up and screams;
// hit, feathers and soot puff off it; beaten, it flops over, the ember rolling
// away; spared, it fluffs up, shakes the soot off and looks almost white.
// Drawn in code (see pixKit.js).
export const SOOT_GULL_PALETTE = {
  k: '#141012',
  a: '#3c3637',
  A: '#5e5856',
  g: '#8d8781',
  G: '#b4aea6',
  w: '#e8e4dc',
  y: '#d8c060',
  Y: '#f0dc80',
  r: '#8a3a20',
  e: '#ff8c1a',
  E: '#ffd25e',
  c: '#24201f',
  p: '#9a7a6a',
};

const W = 38;
const H = 30;

// pose: dy (bob), wings (0 folded, 1 half up, 2 right up), beak (0 shut, 1 open),
// ember (0 none, 1 dim, 2 bright), eye ('mean' | 'x' | 'glad'), step (0/1 which
// foot is up), clean (spared: the soot shaken off), puff (soot puffing off it).
function drawGull(pose) {
  const { dy = 0, wings = 0, beak = 0, ember = 1, eye = 'mean', step = 0, clean = 0, puff = 0 } = pose;
  const g = new Pix(W, H);
  const by = 17 + dy;
  const body = clean ? 'G' : 'g';
  const light = clean ? 'w' : 'G';
  // Legs and feet.
  const legs = [[17, step ? 26 : 27], [22, step ? 27 : 26]];
  for (const [x, footY] of legs) {
    g.line(x, by + 5, x, footY, 'p', 1);
    g.line(x - 2, footY, x + 1, footY, 'p', 1);
  }
  // A raised wing behind, when its wings are up.
  if (wings > 0) {
    const tipY = wings > 1 ? 1 : 6;
    g.line(23, by - 4, 30, tipY, 'A', 3);
    g.line(30, tipY, 36, tipY + 2, 'a', 2);
    g.set(36, tipY + 3, 'c');
  }
  // The tail.
  g.line(28, by - 1, 35, by - 3, 'A', 3);
  g.set(36, by - 3, 'c');
  g.set(35, by - 2, 'c');
  // The body.
  g.disc(21, by, 10, 6, body);
  g.disc(19, by + 3, 8, 2.6, light, [body]);
  // The neck and head.
  g.disc(12, by - 5, 4, 4, body);
  g.disc(9, by - 9, 5, 4.2, body);
  g.disc(8, by - 10, 3, 2, light, [body]);
  // Soot smudges (fewer once it's cleaned up).
  if (!clean) {
    for (const [x, y] of [[24, by - 2], [18, by + 1], [13, by - 6], [26, by + 2], [10, by - 7]]) g.set(x, y, 'A');
  }
  // The folded wing over the body.
  if (wings < 2) {
    g.disc(23, by - 1, 8, 3.6, 'A');
    g.line(17, by - 2, 32, by - 1, 'a', 2);
    g.set(32, by - 2, 'c');
    g.set(31, by + 1, 'c');
    g.line(19, by - 3, 27, by - 3, 'g');
  } else {
    g.line(20, by - 3, 25, by - 6, 'A', 3);
  }
  // The beak: a hooked yellow bill, the red spot gone brown.
  const bx = 4;
  const bY = by - 9;
  g.line(bx, bY, bx - 3, bY + (beak ? -1 : 0), 'y', 2);
  g.set(bx - 4, bY + 1, 'y');
  if (beak) { g.line(bx, bY + 2, bx - 3, bY + 3, 'y', 1); }
  g.set(bx - 2, bY + (beak ? 2 : 1), 'r');
  // The eye: a hard little yellow eye and a mean brow.
  const ex = 8;
  const ey = by - 11;
  if (eye === 'mean') { g.set(ex, ey, 'Y'); g.set(ex + 1, ey, 'k'); g.line(ex - 1, ey - 1, ex + 2, ey - 2, 'a'); }
  else if (eye === 'x') { g.set(ex, ey - 1, 'c'); g.set(ex + 1, ey, 'c'); g.set(ex, ey + 1, 'c'); g.set(ex + 2, ey - 1, 'c'); g.set(ex + 2, ey + 1, 'c'); }
  else { g.set(ex, ey, 'k'); g.set(ex + 1, ey - 1, 'k'); g.set(ex + 2, ey, 'k'); }
  g.outline('k');
  // The stolen ember, in the corner of its beak.
  if (ember > 0) {
    g.set(bx - 4, bY + 2, ember > 1 ? 'E' : 'e');
    g.set(bx - 5, bY + 2, 'e');
    g.set(bx - 5, bY + 3, 'r');
    if (ember > 1) g.set(bx - 6, bY + 1, 'E');
  }
  // Soot puffing off it.
  for (let i = 0; i < puff; i++) g.set(14 + ((i * 7) % 18), by - 8 - ((i * 3) % 6), i % 2 ? 'A' : 'a');
  return g.rows();
}

const FLASH = { g: 'w', G: 'w', A: 'G', a: 'g' };

export const SOOT_GULL_SPRITE = drawGull({});

export const SOOT_GULL_ANIM = {
  chips: ['#8d8781', '#5e5856', '#ff8c1a'],
  idle: clip(4, [0, 1, 2, 3], (i) => drawGull({ step: i % 2, dy: i === 2 ? -1 : 0, ember: i % 2 ? 2 : 1 })),
  windup: clip(8, [0, 1, 2, 3], (i) => drawGull({ wings: i < 1 ? 1 : 2, beak: 1, dy: i > 1 ? -2 : -1, ember: 2, puff: i })),
  hurt: clip(12, [0, 1, 2, 3], (i) => {
    const rows = shiftRows(drawGull({ wings: 1, eye: 'x', beak: 1, ember: 1, puff: 4 }), i < 2 ? 2 : 1, 0);
    return i === 0 ? recolour(rows, FLASH) : rows;
  }),
  death: clip(4, [0, 1, 2, 3, 4, 5], (i) => dissolve(shiftRows(drawGull({ wings: 1, eye: 'x', beak: 1, ember: i < 2 ? 1 : 0, puff: 3, dy: Math.min(i, 3) }), 0, Math.min(i, 3)), i >= 2 ? (i - 1) * 0.22 : 0, 11)),
  spared: clip(5, [0, 1, 2, 3], (i) => drawGull({ clean: 1, eye: 'glad', wings: i % 2 ? 1 : 0, ember: 0, dy: i % 2 ? -1 : 0, step: i % 2 })),
};
