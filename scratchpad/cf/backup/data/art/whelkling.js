import { Pix, dissolve, recolour, clip, shiftRows } from './pixKit.js';

// The WHELKLING, 44x38, facing left: a hermit crab who lives in the dark pool
// in the cliff cave, in a great spiral whelk shell far too big for it. The
// shell is crusted with little sea anemones that glow faintly in the dark,
// pale green at the tips, so in the pool all you see of it at first is a
// cluster of tiny lights, and then two eyes on stalks. One big claw, one
// small one, and very good manners about the shell. Idle, it peers out and
// the anemones sway; before an attack it raises the big claw and the
// anemones flare; hit, it pulls in; beaten, it hides away and the shell rolls
// over; spared, it comes right out and waves. Drawn in code (see pixKit.js).
export const WHELKLING_PALETTE = {
  k: '#141a1c',
  s: '#b8ac94',
  S: '#d8ceb4',
  d: '#8a7e68',
  D: '#5a4a3a',
  a: '#2e2224',
  c: '#b0563a',
  C: '#d8805a',
  q: '#7a3424',
  e: '#fff6e0',
  E: '#1a1010',
  n: '#4e7e70',
  N: '#8ad0b8',
  g: '#c8ffe8',
  p: '#c07890',
  P: '#f0b0c8',
  w: '#ffffff',
};

const W = 44;
const H = 38;

// An anemone stuck on the shell: a short stalk and a crown of swaying arms, glowing at the tips.
function anemone(g, x, y, phase, flare, pink = false) {
  g.line(x, y, x, y - 2, 'n', 2);
  const arms = 5;
  for (let i = 0; i < arms; i++) {
    const a = -Math.PI / 2 + (i - (arms - 1) / 2) * (0.45 + flare * 0.18) + Math.sin(phase + i) * 0.18;
    const len = 3 + flare * 1.5 + (i % 2);
    const ex = x + Math.cos(a) * len;
    const ey = y - 2 + Math.sin(a) * len;
    g.line(x, y - 2, ex, ey, pink ? 'p' : 'N');
    g.set(ex, ey, pink ? 'P' : 'g');
  }
}

// pose: dy, out (0 hidden in the shell, 1 right out), claw (0 rest, 1 raised,
// 2 raised and open), eye ('look' | 'wide' | 'x' | 'glad'), tent (sway phase),
// flare (anemones opened wide, 0-1), look (-1 left, 1 right).
function drawWhelk(pose) {
  const { dy = 0, out = 1, claw = 0, eye = 'look', tent = 0, flare = 0, look = -1 } = pose;
  const g = new Pix(W, H);
  const by = 21 + dy;
  // The spire, whorl on whorl, up to the right.
  g.disc(38, by - 17, 2.6, 2.2, 's');
  g.disc(35, by - 13, 5, 3.6, 's');
  g.disc(31, by - 8, 8, 5.4, 's');
  // The body whorl.
  g.disc(25, by, 14, 11, 's');
  // Shading: dark below, lit above and to the left.
  g.disc(26, by + 5, 12, 6, 'd', 's');
  g.disc(21, by - 4, 7, 4, 'S', 's');
  g.disc(30, by - 10, 4, 2, 'S', 's');
  // The bands of the spiral: dark lines along each whorl's lower edge.
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    g.set(18 + t * 20, by - 3 - t * 9 + Math.sin(t * Math.PI) * 3, 'D');
    g.set(26 + t * 12, by - 9 - t * 7 + Math.sin(t * Math.PI) * 2, 'D');
    g.set(14 + t * 24, by + 4 - t * 6 + Math.sin(t * Math.PI) * 5, 'D');
  }
  // The siphon canal, out at the bottom left.
  g.line(13, by + 8, 9, by + 13, 's', 3);
  g.line(13, by + 9, 9, by + 14, 'd');
  // The mouth of the shell, dark inside.
  g.disc(14, by + 2, 6, 7.5, 'a');
  g.line(8, by - 4, 8, by + 8, 'S');
  // Anemones crusting the top of the shell, softly lit.
  anemone(g, 18, by - 9, tent, flare);
  anemone(g, 25, by - 11, tent + 1.3, flare, true);
  anemone(g, 31, by - 14, tent + 2.1, flare);
  anemone(g, 36, by - 17, tent + 2.9, flare);
  anemone(g, 33, by - 4, tent + 0.7, flare * 0.5);
  // The crab, as far out of its shell as it dares.
  if (out > 0) {
    const ox = Math.round((1 - out) * 5);
    const cx = 12 + ox;
    // Legs, reaching down out of the mouth.
    for (const [lx, ly] of [[5, 15], [8, 16], [12, 16]]) g.line(cx + 1, by + 6, cx - 9 + lx + ox, by + ly, 'q', 2);
    // The small claw.
    g.line(cx + 1, by + 4, cx - 4, by + 9, 'c', 2);
    g.disc(cx - 5, by + 10, 2, 1.6, 'C');
    // The big claw: raised up and over, or resting in front.
    if (claw === 0) {
      g.line(cx, by + 1, cx - 6, by + 4, 'c', 3);
      g.disc(cx - 9, by + 4, 4.4, 3.4, 'c');
      g.disc(cx - 10, by + 3, 2.4, 1.6, 'C', 'c');
      g.line(cx - 13, by + 3, cx - 15, by + 2, 'c', 2);
      g.line(cx - 13, by + 6, cx - 15, by + 6, 'q', 2);
    } else {
      g.line(cx, by, cx - 5, by - 7, 'c', 3);
      g.disc(cx - 7, by - 10, 4.4, 3.6, 'c');
      g.disc(cx - 8, by - 11, 2.4, 1.6, 'C', 'c');
      const gap = claw === 2 ? 3 : 1;
      g.line(cx - 10, by - 12, cx - 13, by - 14 - gap, 'c', 2);
      g.line(cx - 10, by - 8, cx - 13, by - 8 + gap, 'q', 2);
    }
    // Eyes on stalks, peering out.
    const ex = cx - 1 + look;
    g.line(cx + 1, by - 3, ex - 2, by - 9, 'q');
    g.line(cx + 3, by - 3, ex + 2, by - 9, 'q');
    for (const x of [ex - 2, ex + 2]) {
      const y = by - 10;
      if (eye === 'x') { g.set(x - 1, y - 1, 'E'); g.set(x + 1, y + 1, 'E'); g.set(x + 1, y - 1, 'E'); g.set(x - 1, y + 1, 'E'); g.set(x, y, 'E'); }
      else if (eye === 'glad') { g.set(x - 1, y, 'E'); g.set(x, y - 1, 'E'); g.set(x + 1, y, 'E'); }
      else {
        g.disc(x, y, eye === 'wide' ? 1.8 : 1.4, eye === 'wide' ? 1.8 : 1.4, 'e');
        g.set(x + (eye === 'wide' ? 0 : look), y, 'E');
      }
    }
  } else {
    // Hidden: only the tip of the claw closing the door.
    g.disc(13, by + 2, 4, 5, 'q', 'a');
    g.disc(12, by + 1, 2, 2.6, 'c', 'q');
  }
  g.outline('k');
  return g.rows();
}

const FLASH = { s: 'w', S: 'w', d: 'S', D: 'd', c: 'C', q: 'c', N: 'g', p: 'P' };

export const WHELKLING_SPRITE = drawWhelk({});

export const WHELKLING_ANIM = {
  chips: ['#b8ac94', '#8ad0b8', '#b0563a'],
  idle: clip(4, [0, 1, 2, 3, 4, 5], (i) => drawWhelk({ tent: i * 0.9, dy: i % 3 === 1 ? 1 : 0, look: i < 3 ? -1 : 1 })),
  windup: clip(8, [0, 1, 2, 3, 4], (i) => drawWhelk({ claw: i < 1 ? 0 : i % 2 ? 2 : 1, eye: 'wide', flare: Math.min(1, i * 0.3), tent: i * 1.5, dy: i > 1 ? -1 : 0 })),
  hurt: clip(12, [0, 1, 2, 3], (i) => {
    const rows = drawWhelk({ out: i < 2 ? 0.3 : 0.7, eye: 'x', dy: i === 1 ? 1 : 0, tent: i });
    return i === 0 ? recolour(rows, FLASH) : rows;
  }),
  death: clip(4, [0, 1, 2, 3, 4, 5], (i) => dissolve(shiftRows(drawWhelk({ out: 0, tent: i, flare: 0 }), i > 0 ? Math.min(4, i) : 0, i > 1 ? Math.min(3, i - 1) : 0), i >= 3 ? (i - 2) * 0.28 : 0, 29)),
  spared: clip(4, [0, 1, 2, 3], (i) => drawWhelk({ eye: 'glad', claw: i % 2 ? 1 : 0, tent: i * 0.7, dy: i % 2 ? 1 : 0 })),
};
