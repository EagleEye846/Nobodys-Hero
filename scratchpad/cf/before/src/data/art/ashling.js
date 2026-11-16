import { Pix, dissolve, recolour, clip } from './pixKit.js';

// The ASHLING, 30x32: a little figure of packed ash, built like a snowman by
// nobody, two lumps one on the other, with a charred twig for an arm and two
// ember eyes pressed into its face. A crack down its front glows where the ash
// is still warm inside. It crumbles a little whenever it moves: a trickle of
// grey runs off its sides and settles. Idle, it bobs and sheds; before an
// attack its eyes flare and the crack opens; hit, it slumps and puffs; beaten,
// it falls into a heap of ash with the two embers going out last; spared, it
// pats itself back into shape. Drawn in code (see pixKit.js).
export const ASHLING_PALETTE = {
  k: '#141012',
  a: '#3c3637',
  A: '#5e5856',
  g: '#8d8781',
  G: '#b4aea6',
  w: '#d8d2c8',
  c: '#24201f',
  e: '#ff8c1a',
  E: '#ffd25e',
  r: '#a8401a',
  y: '#fff4c8',
};

const W = 30;
const H = 32;

// A fixed scatter of specks so the ash looks packed, not smooth.
const SPECKS = [[-5, -3], [4, -2], [-2, 2], [6, 3], [-7, 1], [1, -5], [3, 5], [-4, 5], [7, -1], [0, 1]];

// pose: dy (bob), squash (0-1), eye ('on' | 'flare' | 'x' | 'happy' | 'dim'),
// crack (0 shut, 1 glowing, 2 wide), arm ('down' | 'up' | 'pat'), shed (bits
// trickling off), lean (pixels the head leans), heap (0 standing, 1 fallen).
function drawAshling(pose) {
  const { dy = 0, squash = 0, eye = 'on', crack = 1, arm = 'down', shed = 0, lean = 0, heap = 0 } = pose;
  const g = new Pix(W, H);
  const cx = 15;
  const sy = 1 - squash * 0.25;
  const sx = 1 + squash * 0.2;
  if (heap >= 1) {
    // A heap of ash, two embers dying in it.
    g.disc(cx, 27, 12, 4.5, 'A');
    g.disc(cx - 2, 25, 7, 3, 'g');
    g.disc(cx - 4, 24, 3, 1.5, 'G');
    g.outline('k');
    if (eye !== 'x') { g.set(cx - 2, 26, 'r'); g.set(cx + 3, 26, 'r'); }
    return g.rows();
  }
  const bodyY = 23 + squash * 2;
  const headY = 12 + dy + squash * 4;
  // The twig arm behind (when down).
  if (arm === 'down') {
    g.line(cx + 8, bodyY - 3, cx + 13, bodyY + 1, 'c', 1);
    g.set(cx + 13, bodyY - 1, 'c');
  }
  // The body lump.
  g.disc(cx, bodyY, 10 * sx, 7 * sy, 'A');
  g.disc(cx - 2, bodyY - 2, 7 * sx, 4 * sy, 'g', ['A']);
  g.disc(cx - 4, bodyY - 4, 3.5, 1.6, 'G', ['g']);
  g.disc(cx + 1, bodyY + 5 * sy, 9 * sx, 2.2, 'a', ['A', 'g']);
  // The head lump.
  const hx = cx + lean;
  g.disc(hx, headY, 7 * sx, 6.4 * sy, 'g');
  g.disc(hx - 2, headY - 2, 4.5, 3.2, 'G', ['g']);
  g.disc(hx - 3, headY - 4, 2, 1, 'w', ['G']);
  g.disc(hx + 2, headY + 4 * sy, 6, 1.8, 'A', ['g']);
  for (const [x, y] of SPECKS) {
    const px = cx + x;
    const py = bodyY + y * 0.8;
    if (g.get(px, py) === 'g' || g.get(px, py) === 'A') g.set(px, py, (x + y) % 2 ? 'a' : 'G');
  }
  // The crack down its front, warm inside.
  if (crack > 0) {
    const c1 = crack > 1 ? 'E' : 'e';
    g.line(cx + 1, bodyY - 5, cx - 1, bodyY - 1, 'r');
    g.line(cx - 1, bodyY - 1, cx + 1, bodyY + 3, 'r');
    g.set(cx, bodyY - 3, c1);
    g.set(cx, bodyY + 1, c1);
    if (crack > 1) { g.set(cx - 1, bodyY - 2, 'e'); g.set(cx + 1, bodyY, 'e'); g.set(cx + 2, bodyY + 2, 'r'); }
  }
  // The eyes.
  const ey = headY - 1;
  for (const x of [hx - 3, hx + 2]) {
    if (eye === 'on') { g.rect(x, ey, 2, 2, 'e'); g.set(x, ey, 'E'); }
    else if (eye === 'flare') { g.rect(x - 1, ey - 1, 3, 3, 'e'); g.rect(x, ey, 2, 2, 'E'); g.set(x, ey, 'y'); }
    else if (eye === 'dim') { g.rect(x, ey, 2, 2, 'r'); }
    else if (eye === 'x') { g.set(x, ey, 'c'); g.set(x + 1, ey + 1, 'c'); g.set(x + 1, ey, 'c'); g.set(x, ey + 1, 'c'); }
    else { g.set(x, ey + 1, 'e'); g.set(x + 1, ey, 'E'); g.set(x + 2, ey + 1, 'e'); }
  }
  // A thumbprint of a mouth.
  if (eye === 'happy') g.line(hx - 1, ey + 4, hx + 1, ey + 4, 'a');
  else g.set(hx, ey + 4, 'a');
  // The twig arm in front (raised, or patting its head).
  if (arm === 'up') {
    g.line(cx + 8, bodyY - 3, cx + 12, bodyY - 10, 'c', 1);
    g.set(cx + 13, bodyY - 11, 'c');
    g.set(cx + 11, bodyY - 11, 'c');
  } else if (arm === 'pat') {
    g.line(cx + 8, bodyY - 3, hx + 6, headY - 6, 'c', 1);
    g.set(hx + 5, headY - 7, 'c');
  }
  g.outline('k');
  // Ash trickling off it (a column of bits down its sides).
  for (let i = 0; i < shed; i++) {
    const side = i % 2 ? 1 : -1;
    const px = cx + side * (9 + (i % 3));
    const py = bodyY - 3 + ((i * 3) % 9);
    g.set(px, py, i % 3 ? 'g' : 'G');
  }
  return g.rows();
}

const FLASH = { A: 'w', g: 'w', G: 'w', a: 'G' };

export const ASHLING_SPRITE = drawAshling({});

export const ASHLING_ANIM = {
  chips: ['#8d8781', '#b4aea6', '#ff8c1a'],
  idle: clip(4, [0, 1, 2, 3], (i) => drawAshling({ dy: [0, -1, 0, 1][i], shed: [1, 2, 3, 1][i], crack: i === 2 ? 2 : 1 })),
  windup: clip(8, [0, 1, 2, 3], (i) => drawAshling({ dy: i > 1 ? -1 : 0, eye: 'flare', crack: 2, arm: 'up', shed: 3, squash: i < 2 ? 0.3 : 0 })),
  hurt: clip(12, [0, 1, 2, 3], (i) => {
    const rows = drawAshling({ squash: i < 2 ? 0.8 : 0.3, eye: 'x', crack: 0, shed: 5, lean: i === 1 ? 2 : 1 });
    return i === 0 ? recolour(rows, FLASH) : rows;
  }),
  death: clip(4, [0, 1, 2, 3, 4, 5], (i) => (i < 3
    ? dissolve(drawAshling({ squash: 0.4 + i * 0.25, eye: 'dim', crack: 0, shed: 6, lean: i }), i * 0.18, 5)
    : dissolve(drawAshling({ heap: 1, eye: i < 5 ? 'dim' : 'x' }), (i - 3) * 0.3, 5))),
  spared: clip(4, [0, 1, 2, 3], (i) => drawAshling({ dy: i % 2 ? -1 : 0, eye: 'happy', arm: i % 2 ? 'pat' : 'down', crack: 1, shed: 0 })),
};
