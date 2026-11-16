import { Pix, flash, crumble } from './ch5Kit.js';

// The PLUMB LEAD, 36x46: a sounder's lead weight, the grey cone the Harbour
// Board's men dropped on a line to feel how deep a cave went, with the line
// still tied to its eyelet and fraying away upward into the dark. A dab of
// old tallow sits in the hollow of its base (it was for fetching up a
// pinch of the floor) and its belly is stamped with a number: the fathom it
// last counted. Two pale slits have opened above the number; it is always
// counting. Idle, it hangs and sways on its line, the number changing;
// before an attack it hauls itself up and swings wide; hit, it spins and
// flashes; beaten, the line parts and the lead drops, cracked; spared, the
// slits close and the number stops, at last, at one. Out in a room it lies
// coiled on the floor (PLUMB_LEAD_DISGUISE) until you are close.
// Drawn from a pose (see src/data/art/ch5Kit.js).
export const PLUMB_LEAD_PALETTE = {
  k: '#161c2c',
  l: '#8e9aa8',
  L: '#5c6878',
  d: '#3a4456',
  h: '#c4ceda',
  w: '#f2f8ff',
  t: '#d8c890',
  T: '#a08c58',
  r: '#b8a47c',
  R: '#7a6a4c',
  s: '#4a3e2a',
  e: '#e8fcff',
  c: '#8ff6ff',
  m: '#e08a60',
};

// A 3x5 numeral, for the stamp on its belly and the tags on the markers.
export const DIGITS = {
  0: ['xxx', 'x.x', 'x.x', 'x.x', 'xxx'],
  1: ['.x.', 'xx.', '.x.', '.x.', 'xxx'],
  2: ['xxx', '..x', 'xxx', 'x..', 'xxx'],
  3: ['xxx', '..x', '.xx', '..x', 'xxx'],
  4: ['x.x', 'x.x', 'xxx', '..x', '..x'],
  5: ['xxx', 'x..', 'xxx', '..x', 'xxx'],
  6: ['xxx', 'x..', 'xxx', 'x.x', 'xxx'],
  7: ['xxx', '..x', '.x.', '.x.', '.x.'],
  8: ['xxx', 'x.x', 'xxx', 'x.x', 'xxx'],
  9: ['xxx', 'x.x', 'xxx', '..x', 'xxx'],
};

// Stamps a number (one or two digits) with its top left at (x, y).
export function stampNumber(p, n, x, y, c) {
  const text = String(n);
  [...text].forEach((ch, i) => {
    DIGITS[ch].forEach((row, j) => {
      [...row].forEach((v, k) => {
        if (v === 'x') p.set(x + i * 4 + k, y + j, c);
      });
    });
  });
}

// Poses: swing (radians the whole weight leans on its line), eyes ('open' | 'squint' | 'shut' | 'dead'),
// n (the number on its belly), fray (how wild the loose fibres are), crack (death).
function draw(pose = {}) {
  const { swing = 0, eyes = 'open', n = 7, fray = 0, crack = 0, drop = 0 } = pose;
  const p = new Pix(36, 46);
  const px = 18;
  const py = 0;
  const rot = (x, y) => {
    const dx = x - px;
    const dy = y - py;
    return [px + dx * Math.cos(swing) - dy * Math.sin(swing), py + dx * Math.sin(swing) + dy * Math.cos(swing) + drop];
  };
  const sets = (x, y, c) => p.set(...rot(x, y), c);

  // The line, tied to the eyelet and fraying at the top, drawn straight down the pivot.
  for (let y = 0; y < 14; y++) {
    const wob = Math.sin(y * 0.7 + fray * 3) * fray;
    const [x, yy] = rot(px + wob * (1 - y / 14), y);
    p.set(x - 1, yy, 'r');
    p.set(x, yy, y % 3 === 0 ? 'R' : 'r');
    p.set(x + 1, yy, 'R');
  }
  // Loose strands standing out of the rope where it has frayed, a little way up from the knot.
  for (const [dx, y0, len, dir] of [[-2, 6, 4, -1], [2, 4, 5, 1], [-2, 1, 3, -1]]) {
    for (let i = 0; i < len; i++) p.set(...rot(px + dx + dir * (i + 1) * (0.7 + fray), y0 + i * 0.5 - i * i * 0.08), i < 2 ? 'r' : 'R');
  }
  // A knot in the line, and its tag stub.
  p.ellipse(...rot(px, 9), 2.2, 1.8, 'R');
  p.ellipse(...rot(px - 0.6, 8.6), 1.2, 0.8, 'r');

  // The body: a cone, narrow at the eyelet, wide and round at the base.
  const rows = [];
  for (let y = 12; y <= 41; y++) {
    const k = (y - 12) / 29;
    const half = 3 + 8.4 * Math.pow(k, 0.75) + (y > 36 ? -((y - 36) * 0.9) : 0);
    rows.push([y, half]);
  }
  for (const [y, half] of rows) {
    for (let x = -Math.ceil(half); x <= Math.ceil(half); x++) {
      if (Math.abs(x) > half) continue;
      const shade = x < -half * 0.45 ? 'h' : x > half * 0.4 ? 'L' : 'l';
      // Fill by sub-steps so the rotation leaves no holes.
      for (const sub of [0, 0.5]) sets(px + x, y + sub, shade);
      for (const sub of [0.25, 0.75]) sets(px + x + 0.5, y + sub, shade);
    }
  }
  // The eyelet at the top: a dark ring the line goes through.
  p.ellipse(...rot(px, 12.5), 2.4, 1.8, 'd');
  p.ellipse(...rot(px, 12.5), 1.2, 0.9, 'R');
  // The hollow in the base with its dab of tallow, and a rim round it.
  p.ellipse(...rot(px, 40.6), 6.2, 2, 'd');
  p.ellipse(...rot(px, 40.2), 4.6, 1.2, 't');
  p.ellipse(...rot(px + 1, 40.4), 2.4, 0.7, 'T');
  // A band of ridges round the belly, like a cooper's hoops.
  for (const y of [21, 33]) for (let x = -7; x <= 7; x++) if (Math.abs(x) < 3 + 8.4 * Math.pow((y - 12) / 29, 0.75)) sets(px + x, y, 'L');

  // The stamped number, on the belly: dark, between the hoops.
  const num = new Pix(36, 46);
  stampNumber(num, n, 0, 0, 'k');
  const digits = String(n).length;
  num.g.forEach((row, j) => row.forEach((v, i) => {
    if (v === 'k') sets(px - (digits * 4 - 1) / 2 + i, 24 + j, 'k');
  }));

  // The eyes: two pale slits above the hoop, with a heavy brow. It's counting.
  const ey = 16;
  for (const [ex, lean] of [[-3.5, 1], [3.5, -1]]) {
    if (eyes === 'shut') {
      for (const dx of [-1, 0, 1]) sets(px + ex + dx, ey + 1, 'k');
    } else if (eyes === 'dead') {
      sets(px + ex - 1, ey, 'k');
      sets(px + ex + 1, ey + 2, 'k');
      sets(px + ex + 1, ey, 'k');
      sets(px + ex - 1, ey + 2, 'k');
    } else {
      for (const dx of [-1, 0, 1]) for (const dy of eyes === 'squint' ? [1] : [0, 1, 2]) sets(px + ex + dx, ey + dy, 'e');
      sets(px + ex, ey + (eyes === 'squint' ? 1 : 2), 'k');
      sets(px + ex - lean, ey - 1, 'd');
      sets(px + ex, ey - 1, 'd');
      sets(px + ex + lean, ey - 2, 'd');
    }
  }
  // A thin mouth: a notch of the rope-groove.
  if (eyes !== 'dead') for (let x = -2; x <= 2; x++) sets(px + x, 20, eyes === 'shut' ? 'L' : 'd');
  // A gleam down the lit side.
  for (let y = 16; y < 36; y += 2) sets(px - 4 - (y - 16) * 0.12, y, 'w');

  if (crack) {
    for (let i = 0; i < 14; i++) {
      sets(px + 2 + Math.sin(i * 1.1) * 1.4 - i * 0.2, 14 + i * 2, 'k');
      sets(px + 3 + Math.sin(i * 1.1) * 1.4 - i * 0.2, 14 + i * 2, 'k');
    }
  }
  return p.outline('k').rows();
}

const IDLE = [
  draw({ swing: -0.09, n: 7 }),
  draw({ swing: -0.04, n: 7, eyes: 'squint' }),
  draw({ swing: 0.05, n: 8 }),
  draw({ swing: 0.1, n: 8 }),
  draw({ swing: 0.04, n: 8, eyes: 'squint' }),
  draw({ swing: -0.05, n: 9 }),
];

export const PLUMB_LEAD_SPRITE = IDLE[0];

// Lying on the floor, a coil of line with the lead's cone half buried in the loops, in the room
// until you're close (the 'disguise' behaviour). The first frame stands still; the others flash by.
function coil(blink = false, tell = false) {
  const p = new Pix(26, 14);
  const cx = 12;
  // Three loops of rope, flat on the floor.
  for (const [ry, y, c] of [[4.4, 9, 'R'], [4, 8, 'r'], [3, 6.5, 'R'], [2.4, 5.8, 'r']]) p.ellipse(cx, y, 8 - (9 - y) * 0.7, ry, c);
  p.ellipse(cx, 7, 4.5, 1.8, 's');
  // The lead's cone lying in the loops, its base-hollow toward you.
  p.ellipse(cx + 5, 7.5, 6, 3.6, 'l');
  p.ellipse(cx + 4, 6.4, 4, 1.6, 'h');
  p.ellipse(cx + 8, 8.2, 3, 2.2, 'd');
  p.ellipse(cx + 8, 8.2, 2, 1.2, 't');
  // The loose tail of the line.
  p.line(1, 10, 5, 11, 'r');
  p.line(5, 11, 8, 10, 'R');
  if (tell) p.set(cx + 5, 6, 'e');
  if (blink) p.set(cx + 4, 5, 'e');
  return p.outline('k').rows();
}
export const PLUMB_LEAD_DISGUISE_SPRITES = { still: coil(), tell: coil(false, true), blink: coil(true) };

export const PLUMB_LEAD_ANIM = {
  chips: ['#8e9aa8', '#5c6878', '#b8a47c', '#c4ceda'],
  idle: { fps: 3, frames: IDLE },
  windup: {
    fps: 6,
    frames: [
      draw({ swing: -0.25, n: 9, eyes: 'squint', fray: 0.4 }),
      draw({ swing: -0.4, n: 9, fray: 0.6 }),
      draw({ swing: 0.22, n: 9, fray: 0.8 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(draw({ swing: 0.3, eyes: 'dead', fray: 0.8 })),
      draw({ swing: -0.3, eyes: 'squint', fray: 0.5, n: 3 }),
      draw({ swing: 0.15, fray: 0.3, n: 4 }),
    ],
  },
  death: {
    fps: 4,
    frames: [
      draw({ swing: 0.1, eyes: 'dead', n: 1, fray: 0.5 }),
      draw({ swing: 0.05, eyes: 'dead', n: 1, fray: 1, crack: 1, drop: 3 }),
      crumble(draw({ eyes: 'dead', n: 0, fray: 1, crack: 1, drop: 7 }), 0.4, false),
      crumble(draw({ eyes: 'dead', n: 0, fray: 1, crack: 1, drop: 7 }), 0.75, false),
      crumble(draw({ eyes: 'dead', n: 0, fray: 1, crack: 1, drop: 7 }), 1, false),
    ],
  },
  spared: {
    fps: 3,
    frames: [
      draw({ swing: -0.05, eyes: 'shut', n: 1 }),
      draw({ swing: 0, eyes: 'shut', n: 1 }),
      draw({ swing: 0.05, eyes: 'shut', n: 1 }),
      draw({ swing: 0, eyes: 'shut', n: 1 }),
    ],
  },
};
