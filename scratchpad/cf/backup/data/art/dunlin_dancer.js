import { Pix, flash, shift } from './ch5Kit.js';

// The DUNLIN DANCER, 44x34: not one bird but a flock of five dunlin
// sandpipers that move as one, hop as one, turn as one, and look at you with
// one very quick eye. Rusty backs, pale bellies, black beaks and thin legs.
// Its battle clips (DUNLIN_DANCER_ANIM, see `anim` in src/battle/battleScene.js):
// the flock hops and ripples in a wave; before an attack it spreads its wings
// and lines up; hit, it scatters and flashes; beaten, it takes off, bird by
// bird, until the sand is empty; spared, it bows in time and dances. Drawn
// from a pose (see src/data/art/ch5Kit.js).
export const DUNLIN_DANCER_PALETTE = {
  k: '#1c1a1e',
  b: '#a89478',
  B: '#7c6a54',
  r: '#c0703e',
  R: '#8a4a2a',
  w: '#f4efe4',
  W: '#cfc8b8',
  K: '#3a3436',
  l: '#6a5a4a',
  e: '#ffffff',
  s: '#d8c8a0',
  f: '#eee6d4',
};

// One dunlin facing left, its body centre at (x, y).
function bird(p, x, y, { legs = 0, wing = 0, head = 0, beak = 0, eye = 'open', lift = 0 } = {}) {
  y -= lift;
  // Legs (thin).
  if (lift < 2) {
    p.line(x - 1, y + 3, x - 2 + legs, y + 6, 'l');
    p.line(x + 1, y + 3, x + 2 - legs, y + 6, 'l');
  }
  // Tail.
  p.line(x + 3, y - 0.5, x + 7, y + 1 - wing, 'B', 2);
  // Body.
  p.ellipse(x, y, 4.6, 3.3, 'k');
  p.ellipse(x, y, 3.8, 2.6, 'b');
  p.ellipse(x - 0.5, y + 1.2, 3.2, 1.5, 'w');
  p.ellipse(x + 1.4, y - 1, 2.3, 1.1, 'r');
  p.ellipse(x - 1.2, y + 1.6, 1.4, 0.8, 'K');
  // Wing (raised when `wing` > 0).
  if (wing > 0) {
    p.line(x + 1, y - 1, x + 3, y - 5 - wing * 3, 'k', 3);
    p.line(x + 1, y - 1, x + 3, y - 5 - wing * 3, 'B', 1.5);
    p.line(x + 1, y - 1, x + 4, y - 4 - wing * 3, 'b');
  }
  // Head and beak.
  const hy = y - 2.4 + head;
  p.ellipse(x - 4, hy, 2.5, 2.4, 'k');
  p.ellipse(x - 4, hy, 1.8, 1.7, 'b');
  p.line(x - 6, hy, x - 11, hy + 0.8 + beak, 'k', 2);
  p.line(x - 6, hy - 0.2, x - 10, hy + 0.5 + beak, 'K');
  if (eye === 'closed') p.set(x - 4.5, hy - 0.6, 'k');
  else if (eye === 'dead') { p.set(x - 5, hy - 1, 'k'); p.set(x - 4, hy, 'k'); p.set(x - 4, hy - 1, 'k'); p.set(x - 5, hy, 'k'); }
  else { p.set(x - 5, hy - 0.8, 'e'); p.set(x - 4.6, hy - 0.8, 'k'); }
}

// Where the five stand (x, y of body centre).
const SPOTS = [[15, 10], [28, 7], [37, 14], [12, 22], [27, 23]];

// Poses: hop (phase), wing, scatter (px the birds spread apart), gone (how
// many have flown), eyes, head (bowing px), run (legs phase).
function draw(pose = {}) {
  const { hop = 0, wing = 0, scatter = 0, gone = 0, eye = 'open', head = 0, legs = 0, beak = 0, lift = 0, step = 0 } = pose;
  const p = new Pix(46, 36);
  // Back birds first.
  const order = [0, 1, 2, 3, 4];
  order.forEach((i) => {
    const [bx, by] = SPOTS[i];
    if (i < gone) return;
    const dx = (i - 2) * scatter;
    const dy = (i % 2 ? -1 : 1) * scatter * 0.5;
    const wave = Math.abs(Math.sin(hop + i * 0.55)) * 2.4;
    const flown = lift > 0 && i < gone + 2 ? lift * 4 : 0;
    bird(p, bx + dx + 1 + step, by + dy + 4, { legs: legs ? (Math.round(hop * 2 + i) % 2 ? 2 : -1) : 0, wing, head, beak, eye, lift: wave + flown });
  });
  return p.outline('k').rows();
}

const IDLE = [
  draw({ hop: 0 }),
  draw({ hop: 0.8 }),
  draw({ hop: 1.6, eye: 'closed' }),
  draw({ hop: 2.4 }),
];

export const DUNLIN_DANCER_SPRITE = IDLE[0];

export const DUNLIN_DANCER_ANIM = {
  chips: ['#f4efe4', '#a89478', '#c0703e', '#cfc8b8'],
  idle: { fps: 5, frames: IDLE },
  windup: {
    fps: 7,
    frames: [
      draw({ hop: 0.3, wing: 0.5, beak: -0.5 }),
      draw({ hop: 0.9, wing: 1, scatter: 1, beak: -0.5 }),
      draw({ hop: 1.4, wing: 1.3, scatter: 1.5, beak: -0.5 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(draw({ scatter: 2, wing: 0.6, eye: 'closed' }), 2, 0)),
      shift(draw({ scatter: 3, wing: 0.3, hop: 1.5 }), 2, 0),
      shift(draw({ scatter: 1, hop: 2 }), 1, 0),
    ],
  },
  death: {
    fps: 3,
    frames: [
      draw({ scatter: 2, wing: 1, eye: 'closed', hop: 1 }),
      draw({ scatter: 3, wing: 1.2, gone: 1, lift: 1, hop: 2 }),
      draw({ scatter: 3, wing: 1.2, gone: 3, lift: 1, hop: 3 }),
      draw({ scatter: 3, gone: 5 }),
    ],
  },
  spared: {
    fps: 4,
    frames: [
      draw({ head: 3, hop: 0, eye: 'closed', beak: 1 }),
      draw({ head: 0, hop: 1.2, wing: 0.7, beak: 0 }),
      draw({ head: 3, hop: 2.4, eye: 'closed', beak: 1 }),
      draw({ head: 0, hop: 3.6, wing: 0.7 }),
    ],
  },
};
