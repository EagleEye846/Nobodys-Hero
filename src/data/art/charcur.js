import { Pix, dissolve, recolour, clip, shiftRows } from './pixKit.js';

// The CHARCUR, 42x30, facing left: a lean stray dog of charcoal, all ribs and
// long legs, the grain of burnt wood running down it, with ember eyes and
// cracks along its flanks that still glow. Its tail smokes. It follows the old
// road as if it is waiting for someone to come back along it. Idle, it stands
// looking down the road, tail swinging, smoke curling off the tip; before an
// attack its hackles go up, its head drops and its eyes flare; hit, it yelps
// and flinches, flakes of char flying; beaten, it lies down on the road and
// the glow goes out of it; spared, it sits, and wags. Drawn in code (see pixKit.js).
export const CHARCUR_PALETTE = {
  k: '#0c0a0b',
  c: '#2a2426',
  C: '#443c3c',
  s: '#5e5450',
  S: '#7e746c',
  e: '#ff8c1a',
  E: '#ffd25e',
  r: '#a8401a',
  y: '#fff4c8',
  g: '#8d8781',
  G: '#b4aea6',
};

const W = 42;
const H = 30;

// pose: dy (bob), head (0 up, looking down the road; 1 down, growling; 2 lying),
// legs (0-3 trot step, 4 sitting, 5 lying), tail (-1 down, 0 level, 1 up/wagging),
// eye ('on' | 'flare' | 'x' | 'soft' | 'out'), glow (0 out, 1 dim, 2 bright),
// smoke (0-3 phase of the smoke on its tail), hackles (0/1).
function drawDog(pose) {
  const { dy = 0, head = 0, legs = 0, tail = 0, eye = 'on', glow = 1, smoke = 0, hackles = 0 } = pose;
  const g = new Pix(W, H);
  const lying = legs === 5;
  const sitting = legs === 4;
  const by = (lying ? 22 : 15) + dy;
  const rear = sitting ? by + 4 : by;
  // Legs, behind the body: thin charcoal sticks with a knuckle at the hock.
  if (!lying) {
    const swing = [[0, 0, 0, 0], [2, -1, -2, 1], [0, 0, 0, 0], [-2, 1, 2, -1]][legs % 4] ?? [0, 0, 0, 0];
    const feet = 27;
    // Fore legs.
    g.line(12, by + 3, 11 + swing[0], feet, 'C', 2);
    g.line(15, by + 3, 15 + swing[1], feet, 'c', 2);
    if (sitting) {
      g.line(27, rear + 1, 25, feet, 'C', 3);
      g.line(24, feet, 29, feet, 'c', 2);
    } else {
      g.line(28, by + 2, 30 + swing[2], by + 7, 'C', 2);
      g.line(30 + swing[2], by + 7, 28 + swing[2], feet, 'C', 2);
      g.line(31, by + 2, 33 + swing[3], by + 7, 'c', 2);
      g.line(33 + swing[3], by + 7, 31 + swing[3], feet, 'c', 2);
    }
  } else {
    g.line(4, by + 4, 14, by + 4, 'C', 2);
    g.line(26, by + 4, 34, by + 5, 'C', 2);
  }
  // The tail, smoking at the tip.
  const tx = 34;
  const ty = rear - 1;
  const tipX = tail > 0 ? 39 : tail < 0 ? 38 : 40;
  const tipY = tail > 0 ? rear - 8 + (smoke % 2) : tail < 0 ? rear + 6 : rear - 3;
  if (!lying || tail >= 0) {
    g.line(tx, ty, (tx + tipX) / 2, (ty + tipY) / 2 - 1, 'C', 2);
    g.line((tx + tipX) / 2, (ty + tipY) / 2 - 1, tipX, tipY, 's', 1);
    g.set(tipX, tipY, glow ? 'e' : 's');
  }
  // The body: a deep chest, a tucked waist, the spine.
  g.disc(14, by, 6.5, 5.4, 'c');
  g.disc(22, by - 1, 8, 3.6, 'c');
  g.disc(30, rear - 1, 5, 4, 'c');
  g.line(9, by - 4, 33, rear - 4, 'C', 1);
  // The grain of the burnt wood: ribs.
  for (const x of [13, 16, 19, 22]) g.line(x, by - 2, x - 1, by + 3, 'C');
  // Glowing cracks along the flank.
  if (glow > 0) {
    g.line(24, by - 1, 27, by + 1, 'r');
    g.line(17, by + 2, 20, by, 'r');
    g.set(25, by, glow > 1 ? 'E' : 'e');
    g.set(18, by + 1, 'e');
  }
  // Hackles up: a ridge of spikes along the back.
  if (hackles) for (const x of [12, 15, 18, 21, 24]) g.set(x, by - 6 + (x % 2), 'C');
  // The neck and head.
  const hx = lying ? 3 : 6;
  const hy = lying ? by - 1 : head === 1 ? by - 2 : by - 8;
  g.line(11, by - 3, hx + 3, hy + 1, 'c', 4);
  g.disc(hx + 2, hy, 4.5, 3.6, 'c');
  // The long muzzle.
  g.line(hx - 1, hy + 1, hx - 5, hy + 2, 'c', 3);
  g.set(hx - 6, hy + 2, 'k');
  if (head === 1) { g.line(hx - 5, hy + 3, hx - 1, hy + 3, 'C'); g.set(hx - 3, hy + 3, 'G'); g.set(hx - 1, hy + 3, 'G'); }
  // The ears: tall and pointed, or laid back.
  if (head === 1 || lying) {
    g.line(hx + 4, hy - 2, hx + 8, hy - 3, 'c', 2);
  } else {
    g.line(hx + 3, hy - 2, hx + 4, hy - 7, 'c', 2);
    g.line(hx + 5, hy - 2, hx + 7, hy - 6, 'C', 1);
  }
  // The eye.
  const ex = hx;
  const ey = hy - 1;
  if (eye === 'on') { g.set(ex, ey, 'e'); g.set(ex + 1, ey, 'E'); }
  else if (eye === 'flare') { g.set(ex - 1, ey, 'e'); g.set(ex, ey, 'E'); g.set(ex + 1, ey, 'y'); g.set(ex, ey - 1, 'e'); }
  else if (eye === 'soft') { g.set(ex, ey, 'e'); g.set(ex + 1, ey + 1, 'e'); }
  else if (eye === 'out') { g.set(ex, ey, 's'); g.set(ex + 1, ey, 's'); }
  else { g.set(ex, ey - 1, 'r'); g.set(ex + 1, ey, 'r'); g.set(ex, ey + 1, 'r'); }
  // A little light on top, where the wind has polished it.
  g.line(15, by - 5, 22, by - 4, 's');
  g.set(hx + 1, hy - 3, 's');
  g.outline('k');
  // Smoke off the tail tip.
  if (glow > 0 && !lying) {
    const sx = tipX + (smoke % 2);
    const sy = tipY - 2 - smoke;
    g.set(sx, sy, 'g');
    g.set(sx - 1, sy - 2, 'G');
    if (smoke > 1) g.set(sx + 1, sy - 4, 'g');
  }
  return g.rows();
}

const FLASH = { c: 'G', C: 'G', s: 'y', S: 'y' };

export const CHARCUR_SPRITE = drawDog({});

export const CHARCUR_ANIM = {
  chips: ['#2a2426', '#5e5450', '#ff8c1a'],
  idle: clip(4, [0, 1, 2, 3], (i) => drawDog({ tail: i % 2 ? 0 : -1, smoke: i, glow: i === 2 ? 2 : 1, dy: i === 1 ? 1 : 0 })),
  windup: clip(8, [0, 1, 2, 3], (i) => drawDog({ head: 1, hackles: 1, eye: 'flare', glow: 2, tail: 1, legs: i % 2 ? 1 : 3, smoke: i })),
  hurt: clip(12, [0, 1, 2, 3], (i) => {
    const rows = shiftRows(drawDog({ head: 1, eye: 'x', tail: -1, glow: 1, legs: 2 }), i < 2 ? 2 : 1, 0);
    return i === 0 ? recolour(rows, FLASH) : rows;
  }),
  death: clip(3, [0, 1, 2, 3, 4, 5], (i) => (i < 2
    ? drawDog({ head: 1, eye: 'x', tail: -1, glow: 1, legs: 4 })
    : dissolve(drawDog({ legs: 5, eye: 'out', glow: i < 4 ? 1 : 0, tail: -1 }), i >= 4 ? (i - 3) * 0.25 : 0, 13))),
  spared: clip(5, [0, 1, 2, 3], (i) => drawDog({ legs: 4, eye: 'soft', tail: 1, smoke: i, glow: 1, dy: 0 })),
};
