import { makeSprite } from '../engine/sprite.js';

export const SOUL_HIT_RADIUS = 3;
export const GRAZE_RADIUS = 12;

const SPEED = 110; // pixels per second
const FOCUS_SPEED = 52;
const WALL_INSET = 5;

const HEART_ROWS = [
  '.rr..rr.',
  'rrrrrrrr',
  'rrrrrrrr',
  '.rrrrrr.',
  '..rrrr..',
  '...rr...',
];
export const HEART_SPRITE = makeSprite(HEART_ROWS, { r: '#ff2a4a' });

// The player's soul: a heart confined to the battle box during enemy attacks.
// Holding cancel (X/Shift) is Touhou-style focus: slower, with the hitbox shown.
export class Soul {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.iframes = 0;
    this.focused = false;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.iframes = 0;
  }

  update(dt, input, box) {
    this.iframes = Math.max(0, this.iframes - dt);
    this.focused = input.isDown('cancel');

    const dx = (input.isDown('right') ? 1 : 0) - (input.isDown('left') ? 1 : 0);
    const dy = (input.isDown('down') ? 1 : 0) - (input.isDown('up') ? 1 : 0);
    const length = Math.hypot(dx, dy);
    if (length > 0) {
      const speed = this.focused ? FOCUS_SPEED : SPEED;
      this.x += (dx / length) * speed * dt;
      this.y += (dy / length) * speed * dt;
    }

    this.x = Math.min(Math.max(this.x, box.x + WALL_INSET), box.x + box.w - WALL_INSET);
    this.y = Math.min(Math.max(this.y, box.y + WALL_INSET), box.y + box.h - WALL_INSET);
  }

  draw(ctx) {
    // Blink while invincible after a hit.
    if (this.iframes > 0 && Math.floor(this.iframes * 10) % 2 === 0) return;
    ctx.drawImage(HEART_SPRITE, Math.round(this.x) - 4, Math.round(this.y) - 3);
    if (this.focused) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(Math.round(this.x) - 1, Math.round(this.y) - 1, 2, 2);
    }
  }
}
