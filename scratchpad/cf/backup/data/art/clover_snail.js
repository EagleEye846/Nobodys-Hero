import { Pix, dissolve, recolour, clip } from './pixKit.js';

// The CLOVER SNAIL, 40x32, facing left: a slow, sleepy snail whose shell is
// a four-leaf clover, one leaf for every nap it has had this morning. It
// is always about to fall asleep, and sometimes does. Idle, it nods off and
// jerks awake; before an attack it draws in a great yawn and the shell
// glows; hit, it tucks its eyes in; beaten, it rolls on its back in its
// shell; spared, it curls up and goes properly to sleep with a smile.
// Drawn in code (see pixKit.js).
export const CLOVER_SNAIL_PALETTE = {
  k: '#2c3a28',
  g: '#6bbf5a',
  G: '#3e8a40',
  L: '#a6e07c',
  l: '#d4f5a8',
  d: '#2a6a34',
  o: '#e8dcae',
  O: '#c8b87c',
  p: '#ff9aa8',
  e: '#1a1018',
  w: '#ffffff',
  y: '#ffd93b',
  z: '#b8d8ff',
};

const W = 40;
const H = 32;

// pose: dy (shell rock), neck (0-3, head stretched up), eye ('sleepy' | 'wide' | 'shut' | 'x' | 'glad'),
// yawn (0-2), glow (shell lit), tuck (eye stalks drawn in), down (rolled over), z (a Z drifting).
function drawSnail(pose) {
  const { dy = 0, neck = 1, eye = 'sleepy', yawn = 0, glow = 0, tuck = 0, down = 0, z = 0 } = pose;
  const g = new Pix(W, H);
  const baseY = 26;
  // The foot: a long soft body along the ground, with a slime trail behind.
  g.disc(21, baseY, 16, 3.4, 'o');
  g.disc(21, baseY + 1, 15, 2, 'O', 'o');
  g.line(30, baseY + 3, 38, baseY + 3, 'z');
  // The neck rising to the head.
  const hx = 7;
  const hy = baseY - 4 - neck * 2;
  g.line(13, baseY - 1, hx + 2, hy + 2, 'o', 6);
  // The head.
  g.disc(hx, hy, 5.4, 5, 'o');
  g.disc(hx + 1, hy + 2, 4, 2.6, 'O', 'o');
  g.disc(hx - 3, hy + 2, 2, 1.3, 'p');
  // The eye stalks, with big dreamy eyes.
  const reach = tuck ? 1 : 5;
  g.line(hx - 1, hy - 3, hx - 2, hy - 3 - reach, 'o', 2);
  g.line(hx + 3, hy - 3, hx + 4, hy - 3 - reach, 'o', 2);
  const eyes = [[hx - 2, hy - 4 - reach], [hx + 4, hy - 4 - reach]];
  for (const [x, y] of eyes) {
    g.disc(x, y, 2.8, 2.8, 'w');
    // Dreamy, not grumpy: big round pupils with a shine, under a soft lid.
    if (eye === 'sleepy') { g.rect(x - 1, y, 2, 2, 'e'); g.set(x - 1, y, 'w'); g.line(x - 2, y - 2, x + 2, y - 2, 'o'); }
    else if (eye === 'wide') { g.rect(x - 1, y - 1, 2, 3, 'e'); g.set(x - 1, y - 1, 'w'); }
    else if (eye === 'shut') { g.line(x - 2, y, x + 2, y, 'e'); }
    else if (eye === 'x') { g.set(x - 1, y - 1, 'e'); g.set(x + 1, y - 1, 'e'); g.set(x, y, 'e'); g.set(x - 1, y + 1, 'e'); g.set(x + 1, y + 1, 'e'); }
    else { g.set(x - 1, y, 'e'); g.set(x, y - 1, 'e'); g.set(x + 1, y, 'e'); }
  }
  // The mouth, and the yawn.
  if (yawn) {
    g.disc(hx - 3, hy + 3, 2 + yawn * 0.6, 1.6 + yawn * 0.8, 'e');
    g.set(hx - 3, hy + 4, 'p');
  } else {
    // A little smile.
    g.set(hx - 5, hy + 3, 'e');
    g.line(hx - 4, hy + 4, hx - 2, hy + 4, 'e');
    g.set(hx - 1, hy + 3, 'e');
  }
  // The shell: round, with a four-leaf clover on it.
  const sx = 25;
  const sy = baseY - 11 + dy;
  g.disc(sx, sy, 12, 11, 'g');
  g.disc(sx + 1, sy + 4, 10, 6, 'G', 'g');
  if (glow) g.disc(sx, sy, 12, 11, 'L', 'gG');
  g.disc(sx - 5, sy - 5, 3, 2, 'l', 'gL');
  // The clover: four round leaves round a stem-dot.
  for (const [ox, oy] of [[-3.4, -3.4], [3.4, -3.4], [-3.4, 3.4], [3.4, 3.4]]) {
    g.disc(sx + ox, sy + oy, 3.4, 3.4, 'L');
    g.disc(sx + ox - 0.8, sy + oy - 0.8, 1.5, 1.5, 'l', 'L');
  }
  g.line(sx - 4, sy - 4, sx + 4, sy + 4, 'd');
  g.line(sx + 4, sy - 4, sx - 4, sy + 4, 'd');
  g.disc(sx, sy, 1.3, 1.3, 'y');
  // A daisy growing out of the top of the shell, nodding as it rocks.
  if (!down) {
    const fx = sx + 7;
    const fy = sy - 10 + (dy ? 1 : 0);
    g.line(sx + 5, sy - 8, fx, fy + 1, 'G');
    for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) g.set(fx + ox, fy + oy, 'w');
    g.set(fx, fy, 'y');
  }
  // A Z, if it is dropping off.
  if (z) {
    const zx = 3 + z * 2;
    const zy = 8 - z * 3;
    g.line(zx, zy, zx + 3, zy, 'z');
    g.line(zx + 3, zy, zx, zy + 3, 'z');
    g.line(zx, zy + 3, zx + 3, zy + 3, 'z');
  }
  g.outline('k');
  if (down) return g.rows().slice().reverse();
  return g.rows();
}

const FLASH = { g: 'l', G: 'g', L: 'w', o: 'w', O: 'o', d: 'g' };

export const CLOVER_SNAIL_SPRITE = drawSnail({});

export const CLOVER_SNAIL_ANIM = {
  chips: ['#6bbf5a', '#a6e07c', '#e8dcae'],
  idle: clip(3, [0, 1, 2, 3], (i) => drawSnail({ dy: [0, 0, 1, 0][i], neck: [1, 1, 0, 1][i], eye: i === 2 ? 'shut' : 'sleepy', z: i === 2 ? 1 : i === 3 ? 2 : 0 })),
  windup: clip(7, [0, 1, 2, 3, 4], (i) => drawSnail({ dy: i % 2, neck: 2 + (i > 1 ? 1 : 0), yawn: Math.min(2, i), eye: i > 2 ? 'shut' : 'wide', glow: i > 1 ? 1 : 0 })),
  hurt: clip(12, [0, 1, 2, 3], (i) => {
    const rows = drawSnail({ dy: i === 1 ? 2 : 0, neck: 0, tuck: 1, eye: 'x', yawn: 1 });
    return i === 0 ? recolour(rows, FLASH) : rows;
  }),
  death: clip(4, [0, 1, 2, 3, 4, 5], (i) => dissolve(drawSnail({ neck: 0, down: i > 0 ? 1 : 0, tuck: 1, eye: 'x', yawn: 1 }), i >= 3 ? (i - 2) * 0.3 : 0, 5)),
  spared: clip(3, [0, 1, 2, 3], (i) => drawSnail({ neck: 0, eye: 'glad', tuck: i > 1 ? 1 : 0, z: i })),
};
