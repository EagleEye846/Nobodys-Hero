import { TILE_SIZE as T } from '../config.js';
import { TILES, floorUnder } from './tileset.js';
import { Prop } from './prop.js';
import { WORLD_STATE } from '../state/saveGame.js';

// Crack pixels as [x, y, width, height] within a tile. Each crack level shows more of the list.
const CRACKS = [
  [7, 4, 1, 3], [8, 7, 1, 2], [9, 9, 2, 1], [6, 7, 1, 1], [5, 8, 1, 2],
  [11, 10, 1, 3], [3, 10, 2, 1], [2, 11, 1, 2], [10, 3, 2, 1], [12, 2, 1, 1], [7, 11, 1, 3],
];
const CRACK_RECTS_PER_LEVEL = [0, 5, CRACKS.length];
const MAX_CRACKS = CRACK_RECTS_PER_LEVEL.length - 1;

function drawHole(ctx, x, y) {
  ctx.fillStyle = '#05030a';
  ctx.fillRect(x + 1, y + 2, T - 2, T - 3);
  ctx.fillRect(x + 2, y + 1, T - 4, T - 1);
  // The far wall of the pit, lit slightly so the hole reads as deep.
  ctx.fillStyle = '#1c1636';
  ctx.fillRect(x + 2, y + 2, T - 4, 2);
}

// Whether a prop is in the room right now. Props can come and go with the
// story: `until` a cutscene has played (Taper waters her flowers until you meet
// her), or only `after` one has (then she's at home).
function showsUpNow({ until = null, after = null }) {
  const seen = WORLD_STATE.seenScenes ?? [];
  if (until && seen.includes(until)) return false;
  if (after && !seen.includes(after)) return false;
  return true;
}

// Objects that give off light: [radius in pixels, strength].
const PROP_LIGHTS = {
  fireplace: [56, 0.26],
  lamp: [30, 0.14],
  side_table: [24, 0.12],
  table: [26, 0.1],
  counter_cake: [18, 0.08],
};

export class Room {
  constructor(data) {
    this.tiles = data.tiles;
    this.width = data.tiles[0].length;
    this.height = data.tiles.length;
    this.pixelWidth = this.width * T;
    this.pixelHeight = this.height * T;
    this.playerStart = data.playerStart;
    this.props = data.props.filter(showsUpNow).map((prop) => new Prop(prop));
    // Cracked and broken floor, keyed by "tx,ty". Kept apart from the tile data
    // so restarting the room brings the floor back.
    this.damage = new Map();

    this.tiles.forEach((row, y) => {
      if (row.length !== this.width) {
        throw new Error(`Room row ${y} is ${row.length} tiles wide, expected ${this.width}`);
      }
    });

    // Tiles never change, so draw them once and reuse the image every frame.
    // Standing tiles (tall pillars, statues) are drawn with the characters instead.
    this.background = this.renderBackground();
    this.standing = this.findStandingTiles();
  }

  // One drawable per standing tile, sorted with the characters by its base,
  // so the player and enemies can pass (or hide) behind it.
  findStandingTiles() {
    const pieces = [];
    this.tiles.forEach((row, ty) => [...row].forEach((char, tx) => {
      const tile = TILES[char];
      if (!tile?.standing) return;
      pieces.push({
        sortY: (ty + 1) * T,
        draw: (ctx, camera) => tile.draw(ctx, tx * T - camera.x, ty * T - camera.y, tx, ty, this),
      });
    }));
    return pieces;
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

  // Each landing cracks the tile under the player a little more, and the tile
  // gives way on the landing after it is fully cracked. Damage belongs to the
  // tile, not to a jump streak, and it never heals while the room lives.
  landOn(tx, ty) {
    const tile = this.damageAt(tx, ty);
    if (tile.cracks >= MAX_CRACKS) {
      tile.broken = true;
      return 'broken';
    }
    tile.cracks += 1;
    return 'cracked';
  }

  damageAt(tx, ty) {
    const key = `${tx},${ty}`;
    if (!this.damage.has(key)) this.damage.set(key, { tx, ty, cracks: 0, broken: false });
    return this.damage.get(key);
  }

  drawDamage(ctx, camera) {
    for (const { tx, ty, cracks, broken } of this.damage.values()) {
      const x = tx * T - camera.x;
      const y = ty * T - camera.y;
      if (broken) {
        drawHole(ctx, x, y);
      } else {
        ctx.fillStyle = '#120c1c';
        for (const [cx, cy, w, h] of CRACKS.slice(0, CRACK_RECTS_PER_LEVEL[cracks])) {
          ctx.fillRect(x + cx, y + cy, w, h);
        }
      }
    }
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
        (tile.standing ? TILES[floorUnder(this, tx, ty)] : tile).draw(ctx, tx * T, ty * T, tx, ty, this);
      }
    }
    this.paintLight(ctx);
    return canvas;
  }

  // Warm pools of light on the stone around lanterns, candles and save crystals.
  paintLight(ctx) {
    const lights = [];
    this.tiles.forEach((row, ty) => [...row].forEach((char, tx) => {
      if (char === 'P') lights.push([tx, ty, 38, 0.16]);
      if (char === 'C') lights.push([tx, ty, 34, 0.14]);
    }));
    for (const prop of this.props) {
      const [radius, strength] = prop.save ? [30, 0.12] : PROP_LIGHTS[prop.look] ?? [];
      if (radius) lights.push([(prop.x + prop.width / 2) / T - 0.5, prop.y / T, radius, strength]);
    }
    ctx.globalCompositeOperation = 'lighter';
    for (const [tx, ty, radius, strength] of lights) {
      const cx = tx * T + T / 2;
      const cy = ty * T + T / 2;
      const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius);
      glow.addColorStop(0, `rgba(255, 190, 110, ${strength})`);
      glow.addColorStop(1, 'rgba(255, 190, 110, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
}
