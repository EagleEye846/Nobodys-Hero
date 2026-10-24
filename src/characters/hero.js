import { makeSprite, flipHorizontal } from '../engine/sprite.js';
import { PLAYER_PALETTE, PLAYER_SPRITES, PLAYER_RUN_SPRITES } from '../data/art/player.js';
import { CARRY_PALETTE, CARRY_FRAMES } from '../data/art/carry.js';

// The hero's sprites and animation rules, shared by the overworld and battles.

const SECONDS_PER_FRAME = 0.15;
const SECONDS_PER_RUN_FRAME = 0.09;

const sprite = (name) => makeSprite(PLAYER_SPRITES[name], PLAYER_PALETTE);
const downIdle = sprite('downIdle');
const downStep = sprite('downStep');
const upIdle = sprite('upIdle');
const upStep = sprite('upStep');
const leftIdle = sprite('leftIdle');
const leftStep = sprite('leftStep');

// 4-frame walk cycles. Frame 0 doubles as the standing pose and frame 1 as the jump pose.
// Front and back views mirror the step frame to alternate legs.
export const HERO_ANIMATIONS = {
  down: [downIdle, downStep, downIdle, flipHorizontal(downStep)],
  up: [upIdle, upStep, upIdle, flipHorizontal(upStep)],
  left: [leftIdle, leftStep, leftIdle, leftStep],
  right: [leftIdle, leftStep, leftIdle, leftStep].map(flipHorizontal),
};

const run = (name) => makeSprite(PLAYER_RUN_SPRITES[name], PLAYER_PALETTE);
const downStride = run('downStride');
const downPass = run('downPass');
const upStride = run('upStride');
const upPass = run('upPass');
const leftStride = run('leftStride');
const leftPass = run('leftPass');

// 4-frame run cycles: stride, pass, the other stride, pass. Front and back
// views mirror the stride to swap which leg and arm lead.
const HERO_RUN_ANIMATIONS = {
  down: [downStride, downPass, flipHorizontal(downStride), downPass],
  up: [upStride, upPass, flipHorizontal(upStride), upPass],
  left: [leftStride, leftPass, leftStride, leftPass],
  right: [leftStride, leftPass, leftStride, leftPass].map(flipHorizontal),
};

function runFrameIndex(animationTime) {
  return Math.floor(animationTime / SECONDS_PER_RUN_FRAME) % 4;
}

export function heroFrame(facing, moving, airborne, animationTime, running = false) {
  const frames = HERO_ANIMATIONS[facing];
  if (airborne) return frames[1];
  if (moving && running) return HERO_RUN_ANIMATIONS[facing][runFrameIndex(animationTime)];
  if (moving) return frames[Math.floor(animationTime / SECONDS_PER_FRAME) % frames.length];
  return frames[0];
}

// Carrying someone piggyback (Ves, hurt, in the Lantern Marsh: see
// Player.carrying): walking frames only, the same 4-step cycles as above.
let carryAnimations = null;
export function carryFrame(facing, moving, animationTime) {
  if (!carryAnimations) {
    const c = (name) => makeSprite(CARRY_FRAMES[name], CARRY_PALETTE);
    const [dI, dS, uI, uS, lI, lS] = ['downIdle', 'downStep', 'upIdle', 'upStep', 'leftIdle', 'leftStep'].map(c);
    // The other foot forward: only the hero's legs are mirrored, not the whole
    // frame, or Ves's head would hop from one shoulder to the other each step.
    const otherFoot = (name) => makeSprite(CARRY_FRAMES[name].map((row, y, rows) => (y < rows.length - CARRY_LEG_ROWS ? row
      : row.slice(0, CARRY_LEGS.from) + [...row.slice(CARRY_LEGS.from, CARRY_LEGS.to)].reverse().join('') + row.slice(CARRY_LEGS.to))), CARRY_PALETTE);
    carryAnimations = {
      down: [dI, dS, dI, otherFoot('downStep')],
      up: [uI, uS, uI, otherFoot('upStep')],
      left: [lI, lS, lI, lS],
      right: [lI, lS, lI, lS].map(flipHorizontal),
    };
  }
  const frames = carryAnimations[facing];
  return moving ? frames[Math.floor(animationTime / CARRY_SECONDS_PER_FRAME) % frames.length] : frames[0];
}
// A heavier, slower step with someone on your back.
const CARRY_SECONDS_PER_FRAME = 0.19;
// The hero's legs in a carry frame: the bottom 3 rows, columns 5 to 14 (Ves's
// dangling legs are either side of them).
const CARRY_LEG_ROWS = 3;
const CARRY_LEGS = { from: 5, to: 15 };

// How many pixels to lift the hero this frame: running bounces up on the pass frames.
export function heroBounce(moving, airborne, animationTime, running) {
  if (!moving || !running || airborne) return 0;
  return runFrameIndex(animationTime) % 2 === 1 ? 1 : 0;
}

// Keeps the current facing while that direction is still held, so moving
// diagonally doesn't flicker between two directions.
export function chooseFacing(dx, dy, current) {
  const held = { up: dy < 0, down: dy > 0, left: dx < 0, right: dx > 0 };
  if (held[current]) return current;
  if (dy !== 0) return dy < 0 ? 'up' : 'down';
  return dx < 0 ? 'left' : 'right';
}
