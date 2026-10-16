import { TILE_SIZE as T } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { PROP_PALETTE, PROP_SPRITES } from '../data/art/props.js';

const sprites = Object.fromEntries(
  Object.entries(PROP_SPRITES).map(([name, rows]) => [name, makeSprite(rows, PROP_PALETTE)]),
);

// A solid, one-tile object in a room. Props with text can be read with confirm.
export class Prop {
  constructor({ sprite, x, y, text = null }) {
    this.sprite = sprites[sprite];
    if (!this.sprite) throw new Error(`Unknown prop sprite '${sprite}'`);
    this.x = x * T;
    this.y = y * T;
    this.width = T;
    this.height = T;
    this.text = text;
  }

  get sortY() {
    return this.y + this.height;
  }

  overlaps(left, top, right, bottom) {
    return left < this.x + this.width && right > this.x && top < this.y + this.height && bottom > this.y;
  }

  draw(ctx, camera) {
    ctx.drawImage(this.sprite, this.x - camera.x, this.y - camera.y);
  }
}
