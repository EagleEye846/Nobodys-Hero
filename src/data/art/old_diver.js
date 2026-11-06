import { Pix, dissolve, recolour, clip } from './pixKit.js';

// The OLD DIVER, 36x42, facing left: an empty brass-and-canvas diving suit
// that walks the wrecks as if somebody were still inside it. A round helmet
// with one dark porthole (nothing in it but a faint green glimmer), rusted
// bolts, a patched canvas body, lead boots and a perished air hose trailing
// off behind it. It carries a harpoon. Idle, it sways and the hose swings;
// before an attack it raises the harpoon and the porthole glows; hit, it
// clangs; beaten, the helmet rolls off and the suit folds; spared, it sets
// the harpoon down and nods. Drawn in code (see pixKit.js).
export const OLD_DIVER_PALETTE = {
  k: '#14181c',
  b: '#b88a3a',
  B: '#7a5a22',
  y: '#e8c868',
  R: '#8a4a26',
  r: '#b8683a',
  c: '#6f7f6a',
  C: '#4a584a',
  d: '#8fa088',
  L: '#4a4e58',
  l: '#6c7280',
  G: '#0a1a1a',
  g: '#7af0b0',
  h: '#3a463c',
  H: '#5a6e5a',
  S: '#9a7a4a',
  I: '#c8ccd4',
  w: '#ffffff',
};

const W = 36;
const H = 42;

// pose: dy (bob), nod (helmet dx), spear ('down' | 'up' | 'back' | 'low'), glow (0-2), hose (swing -1..1),
// dent (a dent in the helmet), fold (0-3, collapsing), helmet (false once it has rolled off).
function drawDiver(pose) {
  const { dy = 0, nod = 0, spear = 'down', glow = 0, hose = 0, dent = false, fold = 0, helmet = true } = pose;
  const g = new Pix(W, H);
  const top = fold * 3; // the suit sinks as it folds
  // The hose, behind everything: out of the back of the helmet, round and down.
  const hx = 22 + nod;
  const hy = 8 + dy + top;
  const loop = hose * 2;
  g.line(hx, hy, hx + 6, hy + 1, 'h', 2);
  g.line(hx + 6, hy + 1, hx + 8 + loop, hy + 9, 'h', 2);
  g.line(hx + 8 + loop, hy + 9, hx + 5 - loop, hy + 20, 'h', 2);
  g.line(hx + 5 - loop, hy + 20, hx + 8 + loop, hy + 30, 'h', 2);
  for (let i = 0; i < 6; i++) g.set(hx + 7 + loop * (i / 6) - (i % 2), hy + 3 + i * 5, 'H');
  g.set(hx + 8 + loop, hy + 31, 'r');
  // Boots.
  g.rect(6, 35, 11, 6, 'L');
  g.rect(18, 35, 11, 6, 'L');
  g.rect(6, 35, 11, 1, 'l');
  g.rect(18, 35, 11, 1, 'l');
  g.rect(4, 38, 3, 3, 'L');
  g.rect(16, 38, 2, 3, 'L');
  // Legs.
  g.rect(8, 28 + top, 7, 8 - top, 'c');
  g.rect(19, 28 + top, 7, 8 - top, 'c');
  g.rect(8, 33, 7, 1, 'C');
  g.rect(19, 33, 7, 1, 'C');
  // The body: ribbed canvas.
  const bt = 15 + dy + top;
  g.disc(17, bt + 8, 10, 9, 'c');
  g.rect(7, bt + 2, 21, 14, 'c');
  for (let y = bt + 4; y < bt + 16; y += 3) g.line(7, y, 27, y, 'C');
  g.rect(7, bt + 2, 2, 14, 'C');
  g.rect(25, bt + 2, 3, 14, 'C');
  // A patch, and rust.
  g.rect(18, bt + 7, 5, 4, 'd');
  g.set(18, bt + 7, 'k');
  g.set(22, bt + 10, 'k');
  g.rect(9, bt + 12, 3, 2, 'R');
  g.rect(22, bt + 13, 4, 2, 'r');
  // The copper breastplate with its bolts.
  g.rect(9, bt + 1, 9, 8, 'b');
  g.rect(9, bt + 1, 9, 1, 'y');
  g.rect(9, bt + 8, 9, 1, 'B');
  for (const [x, y] of [[10, bt + 2], [16, bt + 2], [10, bt + 7], [16, bt + 7]]) g.set(x, y, 'B');
  g.rect(12, bt + 4, 3, 2, 'R');
  // The neck ring.
  g.rect(8 + nod, bt - 1, 13, 3, 'b');
  g.rect(8 + nod, bt - 1, 13, 1, 'y');
  g.rect(8 + nod, bt + 1, 13, 1, 'B');
  // The arm and the harpoon.
  const armY = bt + 4;
  const tip = { down: [3, 8 + dy + top, 2, 34], up: [8, 3, 3, 24], back: [20, 4, 6, 30], low: [3, 26, 2, 38] }[spear] ?? [3, 8, 2, 34];
  g.line(tip[2], tip[3], tip[0], tip[1] + 1, 'S', 1);
  g.line(tip[0], tip[1] + 1, tip[0] + (tip[0] < 6 ? -1 : 1), tip[1] - 2, 'I', 1);
  g.set(tip[0], tip[1], 'I');
  g.set(tip[0] - 1, tip[1] + 2, 'I');
  g.set(tip[0] + 1, tip[1] + 2, 'I');
  const handX = (tip[0] * 0.35 + tip[2] * 0.65);
  g.line(9, armY, handX + 2, armY + 5, 'c', 3);
  g.disc(handX + 1, armY + 6, 2, 2, 'L');
  // The helmet.
  if (helmet) {
    const cx = 14 + nod;
    const cy = 8 + dy + top;
    g.disc(cx, cy, 8, 7.4, 'b');
    g.disc(cx - 2, cy - 3, 4, 2.4, 'y', 'b');
    g.disc(cx + 3, cy + 3, 5, 3, 'B', 'b');
    g.rect(cx + 1, cy - 6, 2, 3, 'R');
    g.set(cx + 4, cy + 1, 'r');
    g.set(cx + 5, cy + 2, 'r');
    // The porthole.
    g.disc(cx - 3, cy + 1, 3.6, 3.6, 'B');
    g.disc(cx - 3, cy + 1, 2.8, 2.8, 'G');
    g.set(cx - 5, cy - 1, 'd');
    if (glow > 0) { g.set(cx - 4, cy + 1, 'g'); g.set(cx - 2, cy + 1, 'g'); }
    if (glow > 1) { g.set(cx - 4, cy, 'g'); g.set(cx - 2, cy, 'g'); g.set(cx - 3, cy + 2, 'g'); }
    // Bolts round the rim.
    for (const a of [0.2, 0.9, 1.6, 2.3, 3.0, 3.7, 4.4, 5.1]) g.set(cx - 3 + Math.cos(a) * 6.2, cy + 1 + Math.sin(a) * 6, 'B');
    // The little side port.
    g.disc(cx + 4, cy - 1, 1.4, 1.4, 'G');
    if (dent) { g.set(cx - 7, cy - 3, 'B'); g.set(cx - 6, cy - 4, 'B'); g.set(cx - 7, cy - 4, 'k'); }
  }
  g.outline('k');
  return g.rows();
}

const FLASH = { b: 'w', y: 'w', B: 'I', c: 'd', C: 'd', R: 'I', r: 'I', L: 'l', h: 'H' };

export const OLD_DIVER_SPRITE = drawDiver({ spear: 'down' });

export const OLD_DIVER_ANIM = {
  chips: ['#b88a3a', '#6f7f6a', '#8a4a26'],
  idle: clip(3, [0, 1, 2, 3], (i) => drawDiver({ dy: i % 2 ? 1 : 0, nod: i === 2 ? 1 : 0, hose: Math.sin(i * 1.6), glow: i === 1 ? 1 : 0 })),
  windup: clip(7, [0, 1, 2, 3, 4], (i) => drawDiver({ dy: i > 2 ? -1 : 0, spear: i < 2 ? 'back' : 'up', glow: 2, nod: i > 2 ? -1 : 0, hose: i % 2 ? 1 : -1 })),
  hurt: clip(10, [0, 1, 2, 3], (i) => {
    const rows = drawDiver({ dy: i === 1 ? 1 : 0, nod: i === 1 ? 2 : 1, dent: true, glow: i < 2 ? 2 : 0, spear: 'low' });
    return i === 0 ? recolour(rows, FLASH) : rows;
  }),
  death: clip(4, [0, 1, 2, 3, 4, 5], (i) => dissolve(drawDiver({ fold: Math.min(i, 3), spear: 'low', dent: true, helmet: i < 3, nod: -i, hose: 0 }), i >= 3 ? (i - 2) * 0.28 : 0, 3)),
  spared: clip(3, [0, 1, 2, 3], (i) => drawDiver({ dy: 0, nod: i % 2 ? -1 : 0, spear: 'low', glow: 1, hose: Math.sin(i) * 0.6 })),
};
