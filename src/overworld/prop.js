import { TILE_SIZE as T } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { PROP_PALETTE, PROP_SPRITES } from '../data/art/props.js';

const sprites = Object.fromEntries(
  Object.entries(PROP_SPRITES).map(([name, rows]) => [name, makeSprite(rows, PROP_PALETTE)]),
);

// Characters (NPCs and shopkeepers) gently bob, so they read as alive.
const BOB_SECONDS = 0.6;

// A solid, one-tile object in a room. Press confirm on it to read its `text`
// (a section of the room's text file), talk to its `npc` (a file in text/npcs/),
// browse its `shop` (an id in src/data/shops.js), or save if it's a `save`
// point. Its sprite can be bigger than the tile: it stands on the tile's
// bottom edge, centred.
export class Prop {
  constructor({ sprite, x, y, text = null, npc = null, shop = null, save = false }) {
    this.sprite = sprites[sprite];
    if (!this.sprite) throw new Error(`Unknown prop sprite '${sprite}'`);
    this.x = x * T;
    this.y = y * T;
    this.width = T;
    this.height = T;
    this.text = text;
    this.npc = npc;
    this.shop = shop;
    this.save = save;
    this.talkedTo = false;
  }

  get sortY() {
    return this.y + this.height;
  }

  overlaps(left, top, right, bottom) {
    return left < this.x + this.width && right > this.x && top < this.y + this.height && bottom > this.y;
  }

  draw(ctx, camera) {
    const seconds = performance.now() / 1000;
    const isCharacter = this.npc || this.shop;
    let bob = isCharacter && Math.floor(seconds / BOB_SECONDS) % 2 ? 1 : 0;
    // Save points float smoothly and glow.
    if (this.save) bob = Math.round(Math.sin(seconds * 2.5) * 2);

    const x = this.x + Math.floor((T - this.sprite.width) / 2) - camera.x;
    const y = this.y + T - this.sprite.height - bob - camera.y;
    if (this.save) {
      const cx = x + this.sprite.width / 2;
      const cy = y + 6;
      const glow = ctx.createRadialGradient(cx, cy, 1, cx, cy, 14);
      glow.addColorStop(0, `rgba(255, 210, 120, ${(0.45 + 0.15 * Math.sin(seconds * 3)).toFixed(3)})`);
      glow.addColorStop(1, 'rgba(255, 210, 120, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(cx - 14, cy - 14, 28, 28);
    }
    ctx.drawImage(this.sprite, x, y);
  }
}
