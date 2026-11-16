import { Pix, dissolve, recolour, clip } from './pixKit.js';

// The STORM IMP, 34x36: a little thundercloud with a face, two tufty horns,
// stubby fists and a crooked bolt of lightning for a tail. A grin much too
// wide for it. It is a spell left running by a boy who was sad, and the
// spell is naughty because he was never naughty: it does everything he
// didn't. Idle, it bobs and the tail flickers; before an attack it puffs its
// cheeks and the eyes go white-gold; hit, it squashes flat; beaten, it
// rains itself out; spared, it giggles. Drawn in code (see pixKit.js).
export const STORM_IMP_PALETTE = {
  k: '#18242a',
  c: '#86a294',
  C: '#b4ccbe',
  d: '#54706a',
  D: '#3a5450',
  e: '#fff06a',
  w: '#ffffff',
  y: '#fff06a',
  Y: '#ffc83a',
  m: '#2a1a24',
  r: '#8fd0ff',
  p: '#e08a8a',
};

const W = 34;
const H = 36;

// pose: dy (bob), grin (0 smirk, 1 wide, 2 yelling), eye ('glee' | 'glare' | 'x' | 'happy'),
// bolt (0 hidden, 1 short, 2 full), puff (cheek swell), squash (0-1), arms ('side' | 'up'), rain (drops falling).
function drawImp(pose) {
  const { dy = 0, grin = 1, eye = 'glee', bolt = 2, puff = 0, squash = 0, arms = 'side', rain = 0, flip = false } = pose;
  const g = new Pix(W, H);
  const cx = 17;
  const cy = 15 + dy + squash * 4;
  const sx = 1 + squash * 0.25;
  const sy = 1 - squash * 0.3;
  // The tail first, behind: a crooked bolt.
  if (bolt > 0) {
    const bx = cx;
    const by = cy + 8 * sy;
    g.line(bx, by, bx - 3, by + 4, 'Y', 2);
    g.line(bx - 3, by + 4, bx + 2, by + 4, 'Y', 2);
    g.line(bx + 2, by + 4, bx - 1, by + 8, 'y', 2);
    if (bolt > 1) { g.line(bx - 1, by + 8, bx + 1, by + 11, 'y', 1); g.set(bx + 4, by + 6, 'y'); g.set(bx - 6, by + 3, 'y'); }
  }
  // Horns: little tufts of cloud.
  g.line(cx - 7, cy - 6 * sy, cx - 9, cy - 11 * sy, 'C', 2);
  g.line(cx + 7, cy - 6 * sy, cx + 9, cy - 11 * sy, 'C', 2);
  g.set(cx - 9, cy - 12 * sy, 'w');
  g.set(cx + 9, cy - 12 * sy, 'w');
  // The cloud: a bunch of puffs.
  g.disc(cx, cy, 11 * sx, 8.5 * sy, 'c');
  g.disc(cx - 9, cy + 3 * sy, 6 * sx, 5 * sy, 'c');
  g.disc(cx + 9, cy + 3 * sy, 6 * sx, 5 * sy, 'c');
  g.disc(cx - 5, cy - 6 * sy, 6 * sx, 4.5 * sy, 'c');
  g.disc(cx + 5, cy - 6 * sy, 6 * sx, 4.5 * sy, 'c');
  // Light on top, shade underneath.
  g.disc(cx - 4, cy - 6 * sy, 5 * sx, 2.6 * sy, 'C', 'c');
  g.disc(cx + 6, cy - 5 * sy, 3 * sx, 1.8 * sy, 'C', 'c');
  g.disc(cx, cy + 7 * sy, 12 * sx, 2.6 * sy, 'd', 'c');
  g.disc(cx - 9, cy + 6 * sy, 5 * sx, 1.6 * sy, 'd', 'c');
  g.disc(cx + 9, cy + 6 * sy, 5 * sx, 1.6 * sy, 'd', 'c');
  // Stubby fists.
  if (arms === 'up') {
    g.disc(cx - 14, cy - 5 * sy, 2.4, 2.4, 'C');
    g.disc(cx + 14, cy - 5 * sy, 2.4, 2.4, 'C');
    g.line(cx - 11, cy - 1, cx - 14, cy - 5 * sy, 'c', 2);
    g.line(cx + 11, cy - 1, cx + 14, cy - 5 * sy, 'c', 2);
  } else {
    g.disc(cx - 14, cy + 6 * sy, 2.4, 2.4, 'C');
    g.disc(cx + 14, cy + 6 * sy, 2.4, 2.4, 'C');
  }
  // The face.
  const ey = cy - 1 * sy;
  const lx = cx - 5;
  const rx = cx + 3;
  for (const x of [lx, rx]) {
    if (eye === 'glee') { g.rect(x, ey - 2, 3, 4, 'e'); g.set(x + 1, ey - 1, 'm'); g.set(x + 1, ey, 'm'); }
    else if (eye === 'glare') { g.rect(x, ey - 1, 3, 3, 'w'); g.set(x + 1, ey, 'm'); g.set(x, ey - 2, 'm'); g.set(x + 2, ey - 2, 'm'); }
    else if (eye === 'x') { g.set(x, ey - 1, 'm'); g.set(x + 2, ey - 1, 'm'); g.set(x + 1, ey, 'm'); g.set(x, ey + 1, 'm'); g.set(x + 2, ey + 1, 'm'); }
    else { g.set(x, ey + 1, 'm'); g.set(x + 1, ey, 'm'); g.set(x + 2, ey + 1, 'm'); }
  }
  if (eye === 'glee' || eye === 'glare') {
    // Slanted brows.
    g.line(lx - 1, ey - 4, lx + 3, ey - 3, 'D');
    g.line(rx + 4, ey - 4, rx, ey - 3, 'D');
  }
  // Cheeks puffed before a bolt.
  if (puff) { g.disc(cx - 9, ey + 4, 2.5, 2.5, 'p'); g.disc(cx + 9, ey + 4, 2.5, 2.5, 'p'); }
  // The grin.
  const my = ey + 5;
  if (grin === 0) { g.line(cx - 4, my, cx + 4, my - 1, 'm'); }
  else if (grin === 1) {
    g.line(cx - 6, my - 1, cx - 4, my + 1, 'm');
    g.line(cx - 4, my + 1, cx + 4, my + 1, 'm');
    g.line(cx + 4, my + 1, cx + 6, my - 1, 'm');
    for (const x of [-3, -1, 1, 3]) g.set(cx + x, my + 0, 'w');
  } else {
    g.disc(cx, my + 1, 6, 3.4, 'm');
    for (const x of [-4, -2, 0, 2, 4]) g.set(cx + x, my - 1, 'w');
    g.set(cx, my + 3, 'p');
  }
  g.outline('k');
  // Rain falling off it.
  for (let i = 0; i < rain; i++) {
    const rxp = cx - 10 + ((i * 7) % 21);
    const ryp = cy + 12 + ((i * 5) % 9) + dy;
    g.set(rxp, ryp, 'r');
    g.set(rxp, ryp + 1, 'r');
  }
  return flip ? g.rows().map((row) => [...row].reverse().join('')) : g.rows();
}

const FLASH = { c: 'w', C: 'w', d: 'C', D: 'C' };

export const STORM_IMP_SPRITE = drawImp({ dy: 0 });

export const STORM_IMP_ANIM = {
  chips: ['#86a294', '#fff06a', '#8fd0ff'],
  idle: clip(4, [0, 1, 2, 3], (i) => drawImp({ dy: [0, -1, -2, -1][i], bolt: i % 2 ? 1 : 2, grin: i === 2 ? 2 : 1, rain: i % 2 ? 1 : 0 })),
  windup: clip(8, [0, 1, 2, 3, 4], (i) => drawImp({ dy: i > 2 ? -2 : 0, grin: 2, eye: 'glare', puff: 1, arms: 'up', bolt: 2, squash: i < 2 ? 0.25 : 0 })),
  hurt: clip(12, [0, 1, 2, 3], (i) => {
    const rows = drawImp({ dy: i === 1 ? 2 : 0, squash: i < 2 ? 0.7 : 0.3, eye: 'x', grin: 0, bolt: 1 });
    return i === 0 ? recolour(rows, FLASH) : rows;
  }),
  death: clip(4, [0, 1, 2, 3, 4, 5], (i) => dissolve(drawImp({ dy: Math.min(i, 3), squash: Math.min(0.8, i * 0.2), eye: 'x', grin: 0, bolt: 0, rain: 3 + i * 2 }), i >= 2 ? (i - 1) * 0.22 : 0, 9)),
  spared: clip(5, [0, 1, 2, 3], (i) => drawImp({ dy: i % 2 ? -2 : 0, eye: 'happy', grin: 2, bolt: 2, arms: i % 2 ? 'up' : 'side', rain: 2 })),
};
