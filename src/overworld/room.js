import { TILE_SIZE as T } from '../config.js';
import { TILES } from './tileset.js';
import { Prop } from './prop.js';

export class Room {
  constructor(data) {
    this.tiles = data.tiles;
    this.width = data.tiles[0].length;
    this.height = data.tiles.length;
    this.pixelWidth = this.width * T;
    this.pixelHeight = this.height * T;
    this.playerStart = data.playerStart;
    this.props = data.props.map((prop) => new Prop(prop));

    this.tiles.forEach((row, y) => {
      if (row.length !== this.width) {
        throw new Error(`Room row ${y} is ${row.length} tiles wide, expected ${this.width}`);
      }
    });

    // Tiles never change, so draw them once and reuse the image every frame.
    this.background = this.renderBackground();
  }

  // Tile character at (tx, ty), or null outside the room.
  tileAt(tx, ty) {
    if (tx < 0 || ty < 0 || tx >= this.width || ty >= this.height) return null;
    return this.tiles[ty][tx];
  }

  isSolidTile(tx, ty) {
    const tile = this.tileAt(tx, ty);
    return tile === null || TILES[tile].solid;
  }

  // Whether the box (right and bottom exclusive) overlaps a solid tile or prop.
  collides(left, top, right, bottom) {
    for (let ty = Math.floor(top / T); ty <= Math.floor((bottom - 1) / T); ty++) {
      for (let tx = Math.floor(left / T); tx <= Math.floor((right - 1) / T); tx++) {
        if (this.isSolidTile(tx, ty)) return true;
      }
    }
    return this.props.some((prop) => prop.overlaps(left, top, right, bottom));
  }

  propAt(x, y) {
    return this.props.find((prop) => prop.overlaps(x, y, x + 1, y + 1)) ?? null;
  }

  renderBackground() {
    const canvas = document.createElement('canvas');
    canvas.width = this.pixelWidth;
    canvas.height = this.pixelHeight;
    const ctx = canvas.getContext('2d');

    for (let ty = 0; ty < this.height; ty++) {
      for (let tx = 0; tx < this.width; tx++) {
        const char = this.tiles[ty][tx];
        const tile = TILES[char];
        if (!tile) throw new Error(`Unknown tile '${char}' at (${tx}, ${ty})`);
        tile.draw(ctx, tx * T, ty * T, tx, ty, this);
      }
    }

    return canvas;
  }
}
