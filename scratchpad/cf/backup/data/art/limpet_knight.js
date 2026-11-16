import { Pix, flash, shift } from './ch5Kit.js';

// The LIMPET KNIGHT, 38x36: a limpet in tiny armour, and very, very serious
// about it. The cone of its shell is the helmet and the body at once, with a
// red plume on the point; a steel visor across the front with two stern
// eyes in the slit; steel pauldrons; a round shield with a limpet on it; a
// short sword. Under it all, the soft grey foot it clings to the rocks with.
// Its battle clips (LIMPET_KNIGHT_ANIM, see `anim` in src/battle/battleScene.js):
// it stands to attention and the plume stirs; before an attack it raises the
// sword and pushes out the shield, and its shell lifts a hair to suck; hit,
// it rocks back and flashes; beaten, the shell slips off and the sword
// drops; spared, it bows with great ceremony. Drawn from a pose (see
// src/data/art/ch5Kit.js).
export const LIMPET_KNIGHT_PALETTE = {
  k: '#1b1a22',
  f: '#c4b49a',
  F: '#8e7e68',
  h: '#b4a68a',
  H: '#d8ccb0',
  s: '#8a7c64',
  D: '#35302c',
  a: '#a8b8c8',
  A: '#617488',
  W: '#e8f2fa',
  y: '#ffe08a',
  r: '#d8453a',
  R: '#9c2a2a',
  w: '#ffffff',
  t: '#d0c0a0',
};

// Poses: bob, shield (px pushed out), sword (angle of the blade in degrees:
// -80 straight up, 35 pointing down), lift (shell raised off the rock),
// eyes ('open' | 'stern' | 'blink' | 'happy' | 'dead'), lean (px the shell
// leans), bow (px the head dips), drop (death: shell slid off, px).
function draw(pose = {}) {
  const { bob = 0, shield = 0, sword = -62, lift = 0, eyes = 'stern', lean = 0, bow = 0, drop = 0, plume = 0, shieldDown = 0 } = pose;
  const p = new Pix(38, 36);
  const cx = 20;
  // Foot.
  p.ellipse(cx, 31, 15, 3.6, 'k');
  p.ellipse(cx, 31, 14, 2.9, 'f');
  p.ellipse(cx, 32.4, 12, 1.4, 'F', ['f']);
  // The sword arm and sword, behind the shell.
  const hand = { x: cx + 13 + lean * 0.4, y: 25 + bob };
  const rad = (sword * Math.PI) / 180;
  const tip = { x: hand.x + Math.cos(rad) * 19, y: hand.y + Math.sin(rad) * 19 };
  p.line(hand.x, hand.y, tip.x, tip.y, 'k', 4);
  p.line(hand.x, hand.y, tip.x, tip.y, 'a', 2);
  p.line(hand.x + 0.5, hand.y - 0.5, tip.x + 0.5, tip.y - 0.5, 'W');
  p.ellipse(hand.x, hand.y, 2.2, 2.2, 'k');
  p.ellipse(hand.x, hand.y, 1.5, 1.5, 't');
  // Cross-guard.
  const gx = hand.x + Math.cos(rad) * 3;
  const gy = hand.y + Math.sin(rad) * 3;
  p.line(gx - Math.sin(rad) * 3, gy + Math.cos(rad) * 3, gx + Math.sin(rad) * 3, gy - Math.cos(rad) * 3, 'A', 2);

  // The shell: a cone with ridges.
  const sx = cx + lean - drop * 1.6;
  const top = { x: sx + 1, y: 4 + bob + bow - drop * 0.5 };
  const baseY = 28 + bob - lift + drop * 0.3;
  p.poly([[top.x - 0.5, top.y - 1.2], [sx - 13.5, baseY + 1.2], [sx + 13.5, baseY + 1.2], [top.x + 0.5, top.y - 1.2]], 'k');
  p.poly([[top.x, top.y], [sx - 12.5, baseY], [sx + 12.5, baseY]], 'h');
  p.poly([[top.x, top.y], [sx + 12.5, baseY], [sx + 2, baseY]], 's', ['h']);
  for (let i = 0; i < 7; i++) {
    const bx = sx - 12 + i * 4;
    p.line(top.x, top.y + 1, bx + (i - 3) * 0.2, baseY - 1, i > 3 ? 'h' : 'H');
  }
  p.line(sx - 12, baseY, sx + 12, baseY, 'H');
  if (lift > 0) p.rect(sx - 12, baseY + 1, 25, lift, 'D');
  // The plume on its tip.
  p.line(top.x, top.y - 1, top.x + 4 + plume, top.y - 4 + plume * 0.3, 'r', 3);
  p.line(top.x + 1, top.y - 1, top.x + 5 + plume, top.y - 3 + plume * 0.3, 'R');
  // Pauldrons.
  for (const side of [-1, 1]) {
    const ex = sx + side * 11;
    p.ellipse(ex, baseY - 3.2, 4, 3.4, 'k');
    p.ellipse(ex, baseY - 3.4, 3.2, 2.7, 'a');
    p.ellipse(ex - side * 0.6, baseY - 4.2, 1.6, 1, 'W');
  }
  // The visor: a steel band, a slit and two stern eyes.
  const vy = Math.round(baseY - 11);
  p.rect(sx - 8, vy, 17, 6, 'k');
  p.rect(sx - 7, vy + 1, 15, 4, 'A');
  p.rect(sx - 7, vy + 1, 15, 1, 'a');
  p.rect(sx - 6, vy + 2, 13, 2, 'D');
  for (const ex of [sx - 3, sx + 4]) {
    if (eyes === 'blink') p.rect(ex - 1, vy + 3, 3, 1, 'y');
    else if (eyes === 'happy') { p.set(ex - 1, vy + 3, 'y'); p.set(ex, vy + 2, 'y'); p.set(ex + 1, vy + 3, 'y'); }
    else if (eyes === 'dead') { p.set(ex - 1, vy + 2, 'y'); p.set(ex + 1, vy + 3, 'y'); p.set(ex + 1, vy + 2, 'y'); p.set(ex - 1, vy + 3, 'y'); }
    else { p.rect(ex - 1, vy + 2, 3, 2, 'y'); p.set(ex, vy + 2, 'k'); }
  }
  if (eyes === 'stern') { p.line(sx - 6, vy - 0.4, sx - 1, vy + 1.4, 'k'); p.line(sx + 7, vy - 0.4, sx + 2, vy + 1.4, 'k'); }
  // The rivets.
  p.set(sx - 7, vy + 1, 'W');
  p.set(sx + 7, vy + 1, 'W');
  // The shield arm and shield, in front.
  const shx = sx - 13 - shield + shieldDown * 0;
  const shy = baseY - 1 + shieldDown * 4;
  p.line(sx - 8, baseY - 2, shx + 2, shy, 'k', 4);
  p.line(sx - 8, baseY - 2, shx + 2, shy, 'f', 2);
  p.ellipse(shx, shy, 7, 8.2, 'k');
  p.ellipse(shx, shy, 6.2, 7.4, 'A');
  p.ellipse(shx - 0.5, shy - 0.5, 5, 6.2, 'a');
  p.ring(shx, shy, 5, 6.2, 'W', 0.8);
  // A limpet on the shield.
  p.poly([[shx, shy - 3], [shx - 3, shy + 2.4], [shx + 3, shy + 2.4]], 'h');
  p.poly([[shx, shy - 3], [shx + 3, shy + 2.4], [shx, shy + 2.4]], 's', ['h']);
  p.line(shx - 3, shy + 3, shx + 3, shy + 3, 'D');
  p.outline('k');
  return p.rows();
}

const IDLE = [
  draw({ plume: 0 }),
  draw({ plume: 1, bob: 0 }),
  draw({ plume: 0, bob: 1 }),
  draw({ plume: -1, bob: 0, eyes: 'blink' }),
];

export const LIMPET_KNIGHT_SPRITE = IDLE[0];

export const LIMPET_KNIGHT_ANIM = {
  chips: ['#b4a68a', '#a8b8c8', '#c4b49a', '#d8453a'],
  idle: { fps: 3, frames: IDLE, holds: [3, 1, 3, 1] },
  windup: {
    fps: 7,
    frames: [
      draw({ sword: -75, shield: 1, lift: 1, bob: 0 }),
      draw({ sword: -85, shield: 3, lift: 2, plume: 1 }),
      draw({ sword: -85, shield: 4, lift: 3, plume: 1, eyes: 'stern' }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(draw({ lean: 1, sword: -40 }), 2, 0)),
      shift(draw({ lean: 2, sword: -30, eyes: 'blink', bob: 1 }), 2, 0),
      shift(draw({ lean: 1, sword: -50 }), 1, 0),
    ],
  },
  death: {
    fps: 3,
    frames: [
      draw({ sword: -20, shield: -1, eyes: 'dead', lean: 2, bob: 1 }),
      draw({ sword: 10, shield: -2, eyes: 'dead', lean: 3, bob: 2, drop: 3, plume: 2, shieldDown: 1 }),
      draw({ sword: 35, shield: -3, eyes: 'dead', lean: 3, bob: 3, drop: 6, plume: 3, shieldDown: 2 }),
      draw({ sword: 40, shield: -3, eyes: 'dead', lean: 3, bob: 4, drop: 9, plume: 4, shieldDown: 2 }),
    ],
  },
  spared: {
    fps: 3,
    frames: [
      draw({ sword: -88, eyes: 'happy', bow: 0 }),
      draw({ sword: -88, eyes: 'happy', bow: 3, bob: 2, lean: -1, plume: -1 }),
      draw({ sword: -88, eyes: 'happy', bow: 3, bob: 2, lean: -1, plume: -1 }),
      draw({ sword: -88, eyes: 'happy', bow: 0, plume: 1 }),
    ],
  },
};
