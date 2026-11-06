import { Pix, dissolve, recolour, clip } from './pixKit.js';

// The GULLION, 42x40, facing left: a broad, scruffy herring gull who has
// decided that everything is his. A dented tin cap, a chipped yellow beak, a
// swag sack on his back with a boot sticking out of it, and his wing-tips
// taped up like a boxer's. Idle, he bounces on his toes with his fists up;
// before an attack he rears back and screeches; hit, he reels; beaten, he's
// flat on his back with his sack spilling; spared, he sits on it and
// shares a chip. Drawn in code (see pixKit.js).
export const GULLION_PALETTE = {
  k: '#1c1f26',
  W: '#f2f4f2',
  w: '#ffffff',
  s: '#d4dad8',
  g: '#8e9aa6',
  G: '#5e6a78',
  y: '#f2b830',
  Y: '#c88a1c',
  r: '#d8483a',
  o: '#e8923a',
  O: '#b8662a',
  t: '#f0e8cc',
  T: '#c8bc98',
  B: '#8a6a44',
  b: '#5a4630',
  e: '#fff0a0',
  c: '#d8c06a',
  h: '#e8a030',
  p: '#9a9e9c',
  P: '#6a6e6c',
};

const W = 42;
const H = 40;

// pose: dy (bounce), fists ('guard' | 'punch' | 'up' | 'down'), beak (0 shut, 1 open, 2 screech),
// eye ('mean' | 'x' | 'glad' | 'wide'), lean (body shift), bag (sack swing), cap (false once it's off),
// down (0-2, laid out), chip (holding a chip).
function drawGull(pose) {
  const { dy = 0, fists = 'guard', beak = 0, eye = 'mean', lean = 0, bag = 0, cap = true, down = 0, chip = false } = pose;
  const g = new Pix(W, H);
  const lx = lean;
  const top = down * 8;
  // The sack on his back, behind.
  g.disc(33 + lx + bag, 21 + dy + top, 6, 7, 'B');
  g.disc(32 + lx + bag, 19 + dy + top, 3, 3, 'h', 'B');
  g.line(30 + lx + bag, 14 + dy + top, 36 + lx + bag, 13 + dy + top, 'b', 2);
  g.rect(33 + lx + bag, 10 + dy + top, 2, 4, 'b');
  // A boot sticking out of it, and the end of a spoon.
  g.rect(35 + lx + bag, 14 + dy + top, 4, 5, 'P');
  g.rect(38 + lx + bag, 17 + dy + top, 2, 2, 'p');
  g.line(30 + lx + bag, 12 + dy + top, 28 + lx + bag, 8 + dy + top, 's');
  g.disc(28 + lx + bag, 7 + dy + top, 1.6, 2, 's');
  // Tail feathers.
  g.line(29 + lx, 27 + dy + top, 37 + lx, 31 + dy + top, 'G', 3);
  g.line(29 + lx, 25 + dy + top, 37 + lx, 27 + dy + top, 'g', 2);
  // Legs.
  if (!down) {
    g.line(20 + lx, 32 + dy, 18, 37, 'o');
    g.line(26 + lx, 32 + dy, 27, 37, 'o');
    g.line(15, 38, 21, 38, 'O', 1);
    g.line(15, 37, 18, 37, 'o');
    g.line(24, 38, 30, 38, 'O', 1);
    g.line(24, 37, 27, 37, 'o');
  }
  // The body.
  const cy = 22 + dy + top;
  g.disc(22 + lx, cy, 11, 11, 'W');
  g.disc(22 + lx, cy + 4, 9, 6, 's', 'W');
  g.disc(26 + lx, cy - 2, 8, 8, 'g', 'W');
  g.disc(27 + lx, cy - 1, 6, 5, 'G', 'g');
  // The neck and head.
  const hx = 12 + lx + (fists === 'punch' ? -2 : 0);
  const hy = 11 + dy + top + (down ? 10 : 0);
  g.disc(hx + 3, hy + 6, 5, 6, 'W');
  g.disc(hx, hy, 7, 6.4, 'W');
  g.disc(hx + 1, hy + 2, 4.5, 3, 's', 'W');
  // The beak: hooked, with a chip out of it.
  const by = hy + 2;
  const open = beak === 2 ? 4 : beak === 1 ? 2 : 0;
  g.rect(hx - 9, by - 2, 6, 3, 'y');
  g.line(hx - 10, by - 1, hx - 9, by + 2, 'y');
  g.rect(hx - 9, by + 1 + open, 6, 2, 'y');
  if (open) g.rect(hx - 8, by + 1, 5, open, 'r');
  g.set(hx - 8, by - 2, 'Y');
  g.set(hx - 7, by + 2 + open, 'Y');
  g.set(hx - 9, by + 2 + open, '.');
  g.set(hx - 4, by - 1, 'r');
  // The eye and brow.
  const ex = hx - 3;
  const ey = hy - 1;
  if (eye === 'mean') { g.rect(ex, ey, 3, 3, 'e'); g.set(ex, ey + 1, 'k'); g.set(ex, ey + 2, 'k'); g.line(ex - 2, ey - 3, ex + 4, ey - 1, 'k', 1); g.set(ex - 2, ey - 2, 'k'); }
  else if (eye === 'wide') { g.rect(ex, ey - 1, 3, 4, 'e'); g.set(ex + 1, ey + 1, 'k'); g.line(ex - 2, ey - 3, ex + 4, ey - 3, 'k'); }
  else if (eye === 'x') { g.set(ex, ey, 'k'); g.set(ex + 2, ey, 'k'); g.set(ex + 1, ey + 1, 'k'); g.set(ex, ey + 2, 'k'); g.set(ex + 2, ey + 2, 'k'); }
  else { g.set(ex, ey + 2, 'k'); g.set(ex + 1, ey + 1, 'k'); g.set(ex + 2, ey + 1, 'k'); g.set(ex + 3, ey + 2, 'k'); }
  // The tin cap, dented.
  if (cap) {
    g.disc(hx + 1, hy - 5, 6, 3.2, 'P');
    g.rect(hx - 6, hy - 3, 13, 2, 'p');
    g.rect(hx - 4, hy - 7, 3, 2, 'p');
    g.set(hx + 3, hy - 8, 'k');
    g.set(hx + 4, hy - 7, 'k');
  }
  // The near wing, as an arm: shoulder to taped fist.
  const sh = { x: 19 + lx, y: cy - 2 };
  const fist = { guard: { x: 8, y: cy - 1 }, punch: { x: 0 + 1, y: hy + 5 }, up: { x: 9, y: cy - 12 }, down: { x: 12, y: cy + 8 } }[fists] ?? { x: 8, y: cy };
  const elbow = { x: (sh.x + fist.x) / 2 + 1, y: (sh.y + fist.y) / 2 + 5 };
  g.line(sh.x, sh.y, elbow.x, elbow.y, 'g', 4);
  g.line(elbow.x, elbow.y, fist.x, fist.y, 'g', 4);
  g.line(sh.x, sh.y - 1, elbow.x, elbow.y - 1, 's', 1);
  g.set(elbow.x + 1, elbow.y + 2, 'k');
  g.set(elbow.x, elbow.y + 3, 'k');
  g.disc(fist.x, fist.y, 3.4, 3.4, 't');
  g.line(fist.x - 2, fist.y - 1, fist.x + 2, fist.y - 1, 'T');
  g.line(fist.x - 2, fist.y + 1, fist.x + 2, fist.y + 1, 'T');
  // A chip, if he has one.
  if (chip) {
    g.rect(fist.x - 5, fist.y - 6, 5, 3, 'c');
    g.set(fist.x - 5, fist.y - 6, 'h');
    g.set(fist.x - 2, fist.y - 4, 'h');
  }
  g.outline('k');
  return g.rows();
}

const FLASH = { W: 'w', s: 'w', g: 'w', G: 's', t: 'w', y: 'w', B: 's', o: 'w' };

export const GULLION_SPRITE = drawGull({ fists: 'guard' });

export const GULLION_ANIM = {
  chips: ['#f2f4f2', '#8e9aa6', '#f2b830'],
  idle: clip(5, [0, 1, 2, 3], (i) => drawGull({ dy: [0, -1, 0, 1][i] * 1, fists: i % 2 ? 'up' : 'guard', beak: i === 2 ? 1 : 0, bag: [0, 1, 0, -1][i] })),
  windup: clip(8, [0, 1, 2, 3, 4], (i) => drawGull({ dy: i < 2 ? 1 : -1, fists: i < 2 ? 'down' : 'up', beak: i > 1 ? 2 : 1, eye: 'wide', lean: i < 2 ? 2 : -1, bag: i % 2 })),
  hurt: clip(12, [0, 1, 2, 3], (i) => {
    const rows = drawGull({ dy: i === 1 ? 2 : 0, lean: 2, fists: 'down', beak: 2, eye: 'x', bag: 2, cap: i < 1 });
    return i === 0 ? recolour(rows, FLASH) : rows;
  }),
  death: clip(4, [0, 1, 2, 3, 4, 5], (i) => dissolve(drawGull({ down: Math.min(1, i * 0.5), fists: 'down', beak: 1, eye: 'x', cap: i < 1, lean: Math.min(i, 3) }), i >= 3 ? (i - 2) * 0.3 : 0, 13)),
  spared: clip(4, [0, 1, 2, 3], (i) => drawGull({ dy: i % 2 ? -1 : 0, fists: 'down', beak: i % 2 ? 1 : 0, eye: 'glad', chip: true, bag: i % 2 })),
};
