import { TILE_SIZE as T } from '../config.js';
import { daylight } from './daylight.js';

// Shadows from the sun, outdoors by day: everything standing up (props,
// trees, statues, people, enemies, you) casts a soft dark shape of itself
// across the ground, which makes the world look solid. The sun goes round
// with the day (daylight.js), so the shadows do too: long and leaning one
// way in the morning, short and squat at noon, long and leaning the other
// way towards evening, and gone at night. (Morning shadows lean left, west
// of the morning sun; evening shadows lean right.)
//
// Anything that casts one has a `shadow()` method returning { image, x, y }
// (its current picture, and the point at its feet in world pixels), or null.

// A shadow's own picture: the same shape, all one colour. Kept per picture.
const silhouettes = new WeakMap();
function silhouette(image) {
  let shape = silhouettes.get(image);
  if (!shape) {
    shape = document.createElement('canvas');
    shape.width = image.width;
    shape.height = image.height;
    const ctx = shape.getContext('2d');
    ctx.drawImage(image, 0, 0);
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = '#1a1830';
    ctx.fillRect(0, 0, shape.width, shape.height);
    silhouettes.set(image, shape);
  }
  return shape;
}

// The little dark patch on the ground under someone's feet, day or night,
// so people stand on the floor instead of floating over it. (x, y) is the
// point at their feet, on screen. The same shape as an enemy's.
export function drawFootShadow(ctx, x, y, alpha = 0.3) {
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.fillRect(x - 4, y - 3, 8, 1);
  ctx.fillRect(x - 5, y - 2, 10, 2);
}

// How the sun throws shadows right now: how dark (0 for none), how long (as
// a share of the thing's height) and how far they lean (pixels sideways for
// each pixel of height, + right).
export function sunShadows(seconds) {
  const { t, elevation, night } = daylight(seconds);
  const strength = Math.max(0, Math.min(1, elevation * 4)) * (1 - night);
  return {
    alpha: 0.22 * strength,
    length: Math.max(0.22, Math.min(0.75, 0.85 - elevation * 0.6)),
    lean: 0.85 * Math.cos(t * Math.PI * 2),
  };
}

// Draws every shadow, under everything (call it after the room's floor and
// before what stands on it).
export function drawShadows(ctx, camera, things, sun) {
  if (sun.alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = sun.alpha;
  for (const thing of things) {
    const cast = thing.shadow?.();
    if (!cast?.image) continue;
    const { image } = cast;
    ctx.save();
    ctx.translate(Math.round(cast.x - camera.x), Math.round(cast.y - camera.y));
    // Down the screen, towards you (the sun is behind the scene, so a shadow
    // falls in front of what casts it, where you can always see it), squashed
    // and leaning away from the sun: upside down, as a shadow on the ground is.
    ctx.transform(1, 0, sun.lean, -sun.length, 0, 0);
    ctx.drawImage(silhouette(image), -Math.floor(image.width / 2), -image.height);
    ctx.restore();
  }
  ctx.restore();
}

// A standing tile (a pine, a statue) drawn once into its own picture, for
// its shadow: `height` is how tall it stands, from the tile's top.
export function standingPicture(tile, tx, ty, room) {
  const height = tile.height ?? T;
  const canvas = document.createElement('canvas');
  canvas.width = T * 3;
  canvas.height = height + T;
  // Drawn on the middle tile of three, standing on the bottom row. Its own
  // little contact shadow at the foot is trimmed off, so it doesn't cast one.
  const ctx = canvas.getContext('2d');
  tile.draw(ctx, T, height, tx, ty, room);
  ctx.clearRect(0, height + T - 2, canvas.width, 2);
  return canvas;
}

// Things built into the room's floor that stand up out of it (cabins,
// boulders, fences): they cast shadows too. Each block of them, as found by
// their tiles, casts one parallelogram from its foot, as tall as the block is
// (a cabin's roof counts), leaning and stretching with the sun like the rest.
const CASTERS = { a: 1, w: 1, e: 1, O: 0.8, Q: 0.8, f: 0.6 };
const blocksCache = new WeakMap();
function standingBlocks(room) {
  let blocks = blocksCache.get(room);
  if (blocks) return blocks;
  blocks = [];
  const seen = new Set();
  for (let ty = 0; ty < room.height; ty++) {
    for (let tx = 0; tx < room.width; tx++) {
      const char = room.tileAt(tx, ty);
      if (!(char in CASTERS) || seen.has(`${tx},${ty}`)) continue;
      // The whole block of tiles of the same sort of thing.
      const kind = (c) => (c in CASTERS) && (CASTERS[c] === 1) === (CASTERS[char] === 1);
      const queue = [[tx, ty]];
      seen.add(`${tx},${ty}`);
      const cells = [];
      while (queue.length) {
        const [x, y] = queue.pop();
        cells.push([x, y]);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx;
          const ny = y + dy;
          const key = `${nx},${ny}`;
          if (seen.has(key) || !kind(room.tileAt(nx, ny))) continue;
          seen.add(key);
          queue.push([nx, ny]);
        }
      }
      // Its foot: the bottom tile of each column, so a block casts from the
      // ground line it actually stands on.
      const columns = new Map();
      for (const [x, y] of cells) columns.set(x, Math.max(columns.get(x) ?? -1, y));
      const top = Math.min(...cells.map(([, y]) => y));
      for (const [x, bottom] of columns) {
        blocks.push({ x: x * T, foot: (bottom + 1) * T, height: (bottom + 1 - top) * T * CASTERS[char] });
      }
    }
  }
  blocksCache.set(room, blocks);
  return blocks;
}

export function drawBlockShadows(ctx, camera, room, sun) {
  if (sun.alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = sun.alpha;
  ctx.fillStyle = '#1a1830';
  // All one shape, so where neighbouring columns' shadows overlap it isn't darker.
  ctx.beginPath();
  for (const { x, foot, height } of standingBlocks(room)) {
    // A column one tile wide: its foot, and the foot moved along the shadow.
    const dx = -sun.lean * height;
    const dy = sun.length * height;
    const left = x - camera.x;
    const y = foot - camera.y;
    ctx.moveTo(left, y);
    ctx.lineTo(left + T, y);
    ctx.lineTo(left + T + dx, y + dy);
    ctx.lineTo(left + dx, y + dy);
    ctx.closePath();
  }
  ctx.fill('nonzero');
  ctx.restore();
}

