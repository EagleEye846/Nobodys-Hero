import { TILE_SIZE as T } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { PROP_PALETTE, PROP_SPRITES, PROP_FOOTPRINTS } from '../data/art/props.js';
import { animationFrame, DEFAULT_FRAME_SECONDS } from '../engine/animations.js';

const sprites = Object.fromEntries(
  Object.entries(PROP_SPRITES).map(([name, rows]) => [name, makeSprite(rows, PROP_PALETTE)]),
);

// Characters (NPCs and shopkeepers) gently bob, so they read as alive.
const BOB_SECONDS = 0.6;

// A solid, one-tile object in a room. Press confirm on it to read its `text`
// (a section of the room's text file), talk to its `npc` (a file in text/npcs/),
// browse its `shop` (an id in src/data/shops.js), or save if it's a `save`
// point. Its sprite can be bigger than the tile: it stands on the tile's
// bottom edge, centred. With an `animation` (see src/engine/animations.js) it
// plays that instead, `speed` seconds a frame.
//
// An object that `gives` an item hands it over the first time you press Z on
// it; after that it changes to its `taken` look and words, if it has them
// (the cake on Taper's counter becomes just a counter).
export class Prop {
  //
  // Puzzles: a `lever` is a switch with a name, flipped with Z (it shows its
  // NAME_on sprite while on). A gate (`opensWith` a list of switch names) opens
  // once they're all on; with `inOrder`, they must be turned on in that order.
  constructor({
    sprite, x, y, text = null, npc = null, shop = null, save = false, animation = null, speed = DEFAULT_FRAME_SECONDS,
    gives = null, taken = null, lever = null, opensWith = null, inOrder = false, openText = null, resetText = null,
    walkable = false, light = null, seenInLight = false,
  }) {
    // In a dark room: how far it lights (pixels), and whether it can only be
    // seen (and used) inside your own light, like writing on a wall.
    this.light = light;
    this.seenInLight = seenInLight;
    // Something flat on the floor (a puddle, a rug) that you walk over, but can still look at.
    this.walkable = walkable;
    this.gives = gives;
    this.takenLook = taken;
    this.lever = lever;
    this.opensWith = opensWith;
    this.inOrder = inOrder;
    this.openText = openText;
    this.resetText = resetText;
    this.isOpen = false;
    this.baseLook = sprite;
    this.animation = animation;
    this.speed = speed;
    this.sprite = sprites[sprite];
    if (!this.sprite) throw new Error(`Unknown prop sprite '${sprite}'`);
    this.look = sprite;
    this.x = x * T;
    this.y = y * T;
    // Big furniture stands on several tiles, starting at its own and going right.
    this.width = (PROP_FOOTPRINTS[sprite] ?? 1) * T;
    this.height = T;
    this.text = text;
    this.npc = npc;
    this.shop = shop;
    this.save = save;
    this.talkedTo = false;
    // A cutscene can hide a character while an actor plays them (see scenePlayer.js).
    this.hidden = false;
  }

  // Who this is, for cutscenes that cast a room's character: their NPC or shop id.
  get character() {
    return this.npc ?? this.shop;
  }

  // A switch shows its NAME_on sprite while it's on, if it has one.
  setOn(on) {
    this.on = on;
    const look = on && sprites[`${this.baseLook}_on`] ? `${this.baseLook}_on` : this.baseLook;
    this.sprite = sprites[look];
    this.look = look;
  }

  // Its item has been taken: no more giving, and on to its `taken` look.
  markTaken() {
    this.gives = null;
    if (this.takenLook?.sprite && sprites[this.takenLook.sprite]) {
      this.sprite = sprites[this.takenLook.sprite];
      this.look = this.takenLook.sprite;
    }
    if (this.takenLook?.text) this.text = this.takenLook.text;
  }

  moveToTile(tx, ty) {
    this.x = tx * T;
    this.y = ty * T;
  }

  get sortY() {
    return this.y + this.height;
  }

  overlaps(left, top, right, bottom) {
    if (this.hidden || this.isOpen) return false;
    return left < this.x + this.width && right > this.x && top < this.y + this.height && bottom > this.y;
  }

  // Whether it stands in the way of something in that box.
  blocks(left, top, right, bottom) {
    return !this.walkable && this.overlaps(left, top, right, bottom);
  }

  draw(ctx, camera) {
    if (this.hidden || this.isOpen) return;
    const seconds = performance.now() / 1000;
    const frame = (this.animation && animationFrame(this.animation, seconds, this.speed)) || this.sprite;
    const isCharacter = (this.npc || this.shop) && frame === this.sprite;
    let bob = isCharacter && Math.floor(seconds / BOB_SECONDS) % 2 ? 1 : 0;
    // Save points float smoothly and glow.
    if (this.save) bob = Math.round(Math.sin(seconds * 2.5) * 2);

    const x = this.x + Math.floor((this.width - frame.width) / 2) - camera.x;
    // Standing on a raised block (`raise`, set by the room): drawn on top of it.
    const y = this.y + T - (this.raise ?? 0) - frame.height - bob - camera.y;
    if (this.save) {
      const cx = x + this.sprite.width / 2;
      const cy = y + 6;
      const glow = ctx.createRadialGradient(cx, cy, 1, cx, cy, 14);
      glow.addColorStop(0, `rgba(255, 210, 120, ${(0.45 + 0.15 * Math.sin(seconds * 3)).toFixed(3)})`);
      glow.addColorStop(1, 'rgba(255, 210, 120, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(cx - 14, cy - 14, 28, 28);
    }
    ctx.drawImage(frame, x, y);
  }
}
