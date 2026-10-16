import { TILE_SIZE as T } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { DUMMY_PALETTE, DUMMY_SPRITE } from '../data/art/dummy.js';

const ART = {
  dummy: { rows: DUMMY_SPRITE, palette: DUMMY_PALETTE },
};

const SPEED = 18; // pixels per second
const TOUCH_DISTANCE = 16;

// A floating enemy that patrols a strip of floor. Touching it starts a battle.
export class Npc {
  constructor({ art, enemy, x, y, patrol }) {
    const { rows, palette } = ART[art];
    this.sprite = makeSprite(rows, palette);
    this.enemy = enemy;
    // Like the player, (x, y) is the point under the feet.
    this.x = (x + 0.5) * T;
    this.y = (y + 1) * T;
    this.minX = (patrol[0] + 0.5) * T;
    this.maxX = (patrol[1] + 0.5) * T;
    this.direction = 1;
    this.time = Math.random() * 10;
  }

  get sortY() {
    return this.y;
  }

  update(dt) {
    this.time += dt;
    this.x += this.direction * SPEED * dt;
    if (this.x > this.maxX) {
      this.x = this.maxX;
      this.direction = -1;
    } else if (this.x < this.minX) {
      this.x = this.minX;
      this.direction = 1;
    }
  }

  touches(player) {
    return Math.hypot(this.x - player.x, this.y - player.y) < TOUCH_DISTANCE;
  }

  draw(ctx, camera) {
    const x = Math.round(this.x) - camera.x;
    const y = this.y - camera.y;
    const bob = Math.round(Math.sin(this.time * 3) * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(x - 5, y - 3, 10, 3);
    ctx.drawImage(this.sprite, x - Math.floor(this.sprite.width / 2), y - this.sprite.height - 2 + bob);
  }
}
