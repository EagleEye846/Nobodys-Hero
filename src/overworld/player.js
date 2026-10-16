import { TILE_SIZE as T } from '../config.js';
import { makeSprite, flipHorizontal } from '../engine/sprite.js';
import { PLAYER_PALETTE, PLAYER_SPRITES } from '../data/art/player.js';

const WALK_SPEED = 70; // pixels per second
const RUN_SPEED = 130;
const SECONDS_PER_FRAME = 0.15;
const RUN_ANIMATION_RATE = 1.6;

const JUMP_SPEED = 150; // pixels per second, upwards
const GRAVITY = 700; // pixels per second squared
// Pressing jump this long before landing still counts, so mashing feels responsive.
const JUMP_BUFFER = 0.12;

// After the floor breaks, the player hangs in the air this long before dropping.
const FALL_PAUSE = 0.25;
const FALL_GRAVITY = 500;

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

// 4-frame walk cycles. Frame 0 doubles as the standing pose and frame 1 as the jump pose.
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

    // Height above the ground. Jumping is visual only; collision stays at the feet.
    this.z = 0;
    this.velocityZ = 0;
    this.jumpBufferTime = 0;
    this.landedThisFrame = false;

    this.hole = null; // set once the player is falling into a broken tile
    this.fallTime = 0;
  }

  get sortY() {
    return this.y;
  }

  get isAirborne() {
    return this.z > 0 || this.velocityZ > 0;
  }

  get isFalling() {
    return this.hole !== null;
  }

  update(dt, input, room) {
    this.landedThisFrame = false;

    if (this.isFalling) {
      this.fallTime += dt;
      return;
    }

    const dx = (input.isDown('right') ? 1 : 0) - (input.isDown('left') ? 1 : 0);
    const dy = (input.isDown('down') ? 1 : 0) - (input.isDown('up') ? 1 : 0);
    this.moving = dx !== 0 || dy !== 0;

    if (this.moving) {
      this.facing = chooseFacing(dx, dy, this.facing);

      // Diagonals aren't normalised, matching Deltarune's movement feel.
      const running = input.isDown('cancel');
      const speed = running ? RUN_SPEED : WALK_SPEED;
      this.moveAxis(room, 'x', dx * speed * dt);
      this.moveAxis(room, 'y', dy * speed * dt);

      this.animationTime += dt * (running ? RUN_ANIMATION_RATE : 1);
    } else {
      this.animationTime = 0;
    }

    this.updateJump(dt, input);
  }

  updateJump(dt, input) {
    this.jumpBufferTime = Math.max(0, this.jumpBufferTime - dt);

    if (this.isAirborne) {
      if (input.wasPressed('jump')) this.jumpBufferTime = JUMP_BUFFER;
      this.velocityZ -= GRAVITY * dt;
      this.z += this.velocityZ * dt;
      if (this.z <= 0) {
        this.z = 0;
        this.velocityZ = 0;
        this.landedThisFrame = true;
      }
      return;
    }

    if (input.wasPressed('jump') || this.jumpBufferTime > 0) {
      this.jumpBufferTime = 0;
      this.velocityZ = JUMP_SPEED;
    }
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

  // The tile under the player's feet.
  tilePosition() {
    return [Math.floor(this.x / T), Math.floor((this.y - 1) / T)];
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

  // Centres the player over the broken tile and starts the fall.
  fallInto(tx, ty) {
    this.hole = { x: tx * T, y: ty * T };
    this.x = this.hole.x + T / 2;
    this.y = this.hole.y + T - 4;
    this.facing = 'down';
    this.moving = false;
    this.z = 0;
    this.velocityZ = 0;
    this.fallTime = 0;
  }

  draw(ctx, camera) {
    if (this.isFalling) {
      this.drawFalling(ctx, camera);
      return;
    }

    const frames = ANIMATIONS[this.facing];
    let frame = frames[0];
    if (this.isAirborne) {
      frame = frames[1];
      this.drawShadow(ctx, camera);
    } else if (this.moving) {
      frame = frames[Math.floor(this.animationTime / SECONDS_PER_FRAME) % frames.length];
    }
    this.drawFrame(ctx, camera, frame, this.y - Math.round(this.z));
  }

  drawShadow(ctx, camera) {
    const x = this.x - camera.x;
    const y = this.y - camera.y;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(x - 4, y - 3, 8, 3);
    ctx.fillRect(x - 5, y - 2, 10, 1);
  }

  // Drops the sprite into the hole, hiding whatever has passed below the hole's near edge.
  drawFalling(ctx, camera) {
    const dropTime = Math.max(0, this.fallTime - FALL_PAUSE);
    const drop = Math.round(0.5 * FALL_GRAVITY * dropTime * dropTime);
    const holeX = this.hole.x - camera.x;
    const holeY = this.hole.y - camera.y;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, ctx.canvas.width, holeY);
    ctx.rect(holeX, holeY, T, T);
    ctx.clip();
    this.drawFrame(ctx, camera, ANIMATIONS.down[0], this.y + drop);
    ctx.restore();
  }

  drawFrame(ctx, camera, frame, feetY) {
    ctx.drawImage(frame, this.x - Math.floor(frame.width / 2) - camera.x, feetY - frame.height - camera.y);
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
