import { makeSprite, flipHorizontal } from '../engine/sprite.js';
import { PLAYER_PALETTE, PLAYER_SPRITES } from '../data/art/player.js';

const WALK_SPEED = 70; // pixels per second
const RUN_SPEED = 130;
const SECONDS_PER_FRAME = 0.15;
const RUN_ANIMATION_RATE = 1.6;

// Collision box around the feet, so the head can overlap walls like in Deltarune.
const HITBOX_HALF_WIDTH = 5;
const HITBOX_HEIGHT = 6;

const sprite = (name) => makeSprite(PLAYER_SPRITES[name], PLAYER_PALETTE);
const downIdle = sprite('downIdle');
const downStep = sprite('downStep');
const upIdle = sprite('upIdle');
const upStep = sprite('upStep');
const leftIdle = sprite('leftIdle');
const leftStep = sprite('leftStep');

// 4-frame walk cycles. Frame 0 doubles as the standing pose.
// Front and back views mirror the step frame to alternate legs.
const ANIMATIONS = {
  down: [downIdle, downStep, downIdle, flipHorizontal(downStep)],
  up: [upIdle, upStep, upIdle, flipHorizontal(upStep)],
  left: [leftIdle, leftStep, leftIdle, leftStep],
  right: [leftIdle, leftStep, leftIdle, leftStep].map(flipHorizontal),
};

export class Player {
  // (x, y) is the point between the player's feet, in whole pixels.
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.remainderX = 0;
    this.remainderY = 0;
    this.facing = 'down';
    this.moving = false;
    this.animationTime = 0;
  }

  get sortY() {
    return this.y;
  }

  update(dt, input, room) {
    const dx = (input.isDown('right') ? 1 : 0) - (input.isDown('left') ? 1 : 0);
    const dy = (input.isDown('down') ? 1 : 0) - (input.isDown('up') ? 1 : 0);
    this.moving = dx !== 0 || dy !== 0;

    if (!this.moving) {
      this.animationTime = 0;
      return;
    }

    this.facing = chooseFacing(dx, dy, this.facing);

    // Diagonals aren't normalised, matching Deltarune's movement feel.
    const running = input.isDown('cancel');
    const speed = running ? RUN_SPEED : WALK_SPEED;
    this.moveAxis(room, 'x', dx * speed * dt);
    this.moveAxis(room, 'y', dy * speed * dt);

    this.animationTime += dt * (running ? RUN_ANIMATION_RATE : 1);
  }

  // Moves one pixel at a time and stops at the first solid pixel. Fractional
  // movement is carried over between frames so position stays a whole number.
  moveAxis(room, axis, amount) {
    const remainderKey = axis === 'x' ? 'remainderX' : 'remainderY';
    this[remainderKey] += amount;
    let pixels = Math.round(this[remainderKey]);
    this[remainderKey] -= pixels;

    const step = Math.sign(pixels);
    while (pixels !== 0) {
      const nextX = axis === 'x' ? this.x + step : this.x;
      const nextY = axis === 'y' ? this.y + step : this.y;
      if (this.collidesAt(room, nextX, nextY)) {
        this[remainderKey] = 0;
        return;
      }
      this.x = nextX;
      this.y = nextY;
      pixels -= step;
    }
  }

  collidesAt(room, x, y) {
    return room.collides(x - HITBOX_HALF_WIDTH, y - HITBOX_HEIGHT, x + HITBOX_HALF_WIDTH, y);
  }

  // The point just in front of the player, checked when they press confirm.
  interactionPoint() {
    switch (this.facing) {
      case 'up': return [this.x, this.y - HITBOX_HEIGHT - 4];
      case 'down': return [this.x, this.y + 4];
      case 'left': return [this.x - HITBOX_HALF_WIDTH - 4, this.y - HITBOX_HEIGHT / 2];
      case 'right': return [this.x + HITBOX_HALF_WIDTH + 4, this.y - HITBOX_HEIGHT / 2];
    }
  }

  draw(ctx, camera) {
    const frames = ANIMATIONS[this.facing];
    const frame = this.moving ? frames[Math.floor(this.animationTime / SECONDS_PER_FRAME) % frames.length] : frames[0];
    ctx.drawImage(frame, this.x - Math.floor(frame.width / 2) - camera.x, this.y - frame.height - camera.y);
  }
}

// Keeps the current facing while that direction is still held, so walking
// diagonally doesn't flicker between two directions.
function chooseFacing(dx, dy, current) {
  const held = { up: dy < 0, down: dy > 0, left: dx < 0, right: dx > 0 };
  if (held[current]) return current;
  if (dy !== 0) return dy < 0 ? 'up' : 'down';
  return dx < 0 ? 'left' : 'right';
}
