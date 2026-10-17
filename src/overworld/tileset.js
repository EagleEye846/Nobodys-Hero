import { TILE_SIZE as T } from '../config.js';

// Tiles drawn in code as pixel art. Each draw function paints one tile at
// pixel (x, y); tx/ty and room let a tile react to its neighbours. The old
// stone varies from tile to tile, picked by a hash of the tile's position, so
// the same room always looks the same.

// A steady pseudo-random number in [0, 1) for a tile (and a salt, for more than one roll).
function hash(tx, ty, salt = 0) {
  let h = (tx * 374761393 + ty * 668265263 + salt * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const pick = (list, roll) => list[Math.floor(roll * list.length)];
const px = (ctx, color, x, y, w = 1, h = 1) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };

const isWallFace = (c) => c === 'W' || c === 'V' || c === 'H' || c === 'h';
const isWall = (c) => c === '#' || isWallFace(c);

// Old flagstones: worn slabs of a few sizes in slightly different stone, with
// cracks, chips, and now and then a fallen red leaf.
const SLAB_STONE = ['#2f2752', '#332a58', '#2c244d', '#362c5d', '#30285a'];
function drawFloor(ctx, x, y, tx, ty, room) {
  const layout = hash(tx, ty, 1);
  // One big slab, two long ones, or four small ones.
  const slabs = layout < 0.5 ? [[0, 0, 16, 16]]
    : layout < 0.85 ? (hash(tx, ty, 2) < 0.5 ? [[0, 0, 16, 8], [0, 8, 16, 8]] : [[0, 0, 8, 16], [8, 0, 8, 16]])
      : [[0, 0, 8, 8], [8, 0, 8, 8], [0, 8, 8, 8], [8, 8, 8, 8]];
  slabs.forEach(([sx, sy, w, h], i) => {
    px(ctx, pick(SLAB_STONE, hash(tx, ty, 10 + i)), x + sx, y + sy, w, h);
    // Light catches the top edge; worn grout runs along the bottom and right.
    px(ctx, '#372d62', x + sx + 1, y + sy, w - 2, 1);
    px(ctx, '#251e44', x + sx, y + sy + h - 1, w, 1);
    px(ctx, '#251e44', x + sx + w - 1, y + sy, 1, h);
    // A chipped corner.
    if (hash(tx, ty, 20 + i) < 0.12) px(ctx, '#211a3c', x + sx + w - 3, y + sy + h - 3, 2, 2);
  });
  // A hairline crack wandering across.
  if (hash(tx, ty, 3) < 0.08) {
    let cx = 3 + Math.floor(hash(tx, ty, 4) * 9);
    for (let cy = 4; cy < 11; cy++) {
      px(ctx, '#221b3e', x + cx, y + cy);
      cx += hash(tx, ty, 30 + cy) < 0.5 ? -1 : 1;
      cx = Math.max(1, Math.min(14, cx));
    }
  }
  // Dust and grit.
  for (let i = 0; i < 3; i++) {
    if (hash(tx, ty, 40 + i) < 0.5) px(ctx, '#3f3570', x + 1 + Math.floor(hash(tx, ty, 50 + i) * 14), y + 1 + Math.floor(hash(tx, ty, 60 + i) * 14));
  }
  // A fallen leaf, red as the Ruins' trees.
  if (hash(tx, ty, 5) < 0.07) {
    const lx = x + 3 + Math.floor(hash(tx, ty, 6) * 9);
    const ly = y + 3 + Math.floor(hash(tx, ty, 7) * 9);
    px(ctx, '#a83a3a', lx, ly, 2, 1);
    px(ctx, '#d9673a', lx + 1, ly + 1, 2, 1);
    px(ctx, '#7a2626', lx + 2, ly, 1, 1);
  }
  // Shadow cast by a wall directly above.
  if (isWall(room.tileAt(tx, ty - 1))) {
    ctx.fillStyle = 'rgba(10, 6, 20, 0.55)';
    ctx.fillRect(x, y, T, 3);
    ctx.fillStyle = 'rgba(10, 6, 20, 0.25)';
    ctx.fillRect(x, y + 3, T, 2);
  }
}

// --- Home ---
// Warm wooden floorboards: honey-brown planks running across, their ends
// staggered, with grain and the odd nail. For houses, like Taper's.
const PLANKS = ['#8a5a32', '#94643a', '#86562e', '#9a6a3e', '#8e5e36'];
function drawWoodFloor(ctx, x, y, tx, ty, room) {
  for (let row = 0; row < 4; row++) {
    const py = y + row * 4;
    // Each row of planks has its seams in different places.
    const seam = Math.floor(hash(tx, ty * 4 + row, 1) * 16);
    px(ctx, pick(PLANKS, hash(tx, ty * 4 + row, 2)), x, py, T, 3);
    px(ctx, pick(PLANKS, hash(tx + 1, ty * 4 + row, 2)), x + seam, py, T - seam, 3);
    px(ctx, '#a87848', x, py, T, 1);
    px(ctx, '#4a2e18', x, py + 3, T, 1);
    px(ctx, '#4a2e18', x + seam, py, 1, 3);
    // Grain and nails.
    if (hash(tx, ty * 4 + row, 3) < 0.5) px(ctx, '#7a4e2a', x + Math.floor(hash(tx, ty * 4 + row, 4) * 12), py + 1, 4, 1);
    if (hash(tx, ty * 4 + row, 5) < 0.25) px(ctx, '#3a2414', x + (seam + 2) % 15, py + 1, 1, 1);
  }
  if (isWall(room.tileAt(tx, ty - 1))) {
    ctx.fillStyle = 'rgba(30, 14, 4, 0.5)';
    ctx.fillRect(x, y, T, 3);
    ctx.fillStyle = 'rgba(30, 14, 4, 0.22)';
    ctx.fillRect(x, y + 3, T, 2);
  }
}

// A papered wall: cream wallpaper with a little flower print, a moulding under
// the wall top, and wood panelling with a chair rail where it meets the floor.
function drawHomeWall(ctx, x, y, tx, ty, room) {
  px(ctx, '#d8b878', x, y, T, T);
  // Stripes and a tiny flower print.
  for (let sx = 1; sx < T; sx += 4) px(ctx, '#ccaa68', x + sx, y, 1, T);
  for (let fy = 2; fy < T; fy += 6) {
    const fx = x + ((fy / 2 + tx * 3) % 4) * 4 + 2;
    px(ctx, '#c0705a', fx, y + fy, 1, 1);
    px(ctx, '#7a9a5a', fx, y + fy + 1, 1, 1);
  }
  const above = room?.tileAt(tx, ty - 1);
  const below = room?.tileAt(tx, ty + 1);
  if (above === '#') {
    px(ctx, '#6b4423', x, y, T, 2);
    px(ctx, '#a87848', x, y + 2, T, 1);
    px(ctx, '#b89858', x, y + 3, T, 1);
  }
  if (below !== undefined && below !== null && !isWall(below)) {
    // Panelling and a chair rail.
    px(ctx, '#a87848', x, y + 6, T, 1);
    px(ctx, '#6b4423', x, y + 7, T, 1);
    px(ctx, '#7a4e2a', x, y + 8, T, 8);
    px(ctx, '#8a5a32', x + 1, y + 9, 6, 5);
    px(ctx, '#8a5a32', x + 9, y + 9, 6, 5);
    px(ctx, '#5a3a1e', x, y + T - 2, T, 2);
  }
}

// What a decoration (a flower bed, a plant, a pillar...) stands on: wooden
// boards if it's in a house, stone otherwise.
export function floorUnder(room, tx, ty) {
  for (const [dx, dy] of [[0, 1], [-1, 0], [1, 0], [0, -1]]) {
    const c = room.tileAt(tx + dx, ty + dy);
    if (c === 'o') return 'o';
    if (c === '.' || c === 'c') return '.';
  }
  return '.';
}
function drawBaseFloor(ctx, x, y, tx, ty, room) {
  (floorUnder(room, tx, ty) === 'o' ? drawWoodFloor : drawFloor)(ctx, x, y, tx, ty, room);
}

// The dark above a wall: rough stone with a faint lit rim where it meets the room.
function drawWallTop(ctx, x, y, tx = 0, ty = 0, room = null) {
  px(ctx, '#120c1c', x, y, T, T);
  if (hash(tx, ty, 1) < 0.5) px(ctx, '#170f24', x + Math.floor(hash(tx, ty, 2) * 10), y + Math.floor(hash(tx, ty, 3) * 10), 5, 4);
  if (hash(tx, ty, 4) < 0.3) px(ctx, '#1a1228', x + Math.floor(hash(tx, ty, 5) * 12), y + Math.floor(hash(tx, ty, 6) * 12), 3, 2);
  if (!room) return;
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && below !== '#') {
    px(ctx, '#2e2450', x, y + T - 3, T, 2);
    px(ctx, '#3d3168', x, y + T - 3, T, 1);
    px(ctx, '#07040c', x, y + T - 1, T, 1);
  }
  // Lit rims along the sides that face into the room.
  const left = room.tileAt(tx - 1, ty);
  const right = room.tileAt(tx + 1, ty);
  if (left !== null && !isWall(left)) px(ctx, '#2a2148', x, y, 1, T);
  if (right !== null && !isWall(right)) px(ctx, '#2a2148', x + T - 1, y, 1, T);
}

// Ancient bricks, each a slightly different stone, weathered and stained, with a
// carved ledge under the wall top and moss where the wall meets the floor.
const BRICK_STONE = ['#4b3d78', '#47396f', '#504182', '#43366a', '#4d3f7c'];
function drawWallFace(ctx, x, y, tx = 0, ty = 0, room = null) {
  px(ctx, '#2f2650', x, y, T, T);
  for (let row = 0; row < 4; row++) {
    const rowY = y + row * 4;
    // Brick joints shift every row, and from tile to tile.
    const offset = (row + tx) % 2 ? 4 : 0;
    for (let bx = -offset; bx < T; bx += 8) {
      const left = Math.max(0, bx);
      const width = Math.min(bx + 7, T) - left;
      if (width <= 0) continue;
      const roll = hash(tx * 4 + Math.floor((bx + offset) / 8), ty * 4 + row, 1);
      px(ctx, pick(BRICK_STONE, roll), x + left, rowY, width, 3);
      px(ctx, '#5b4b8c', x + left, rowY, width, 1);
      // A chipped or crumbling brick.
      if (roll < 0.12) px(ctx, '#2f2650', x + left + Math.floor(width / 2), rowY + 1, 2, 2);
    }
  }
  // Water stains running down the stone.
  if (hash(tx, ty, 7) < 0.25) {
    const sx = x + 2 + Math.floor(hash(tx, ty, 8) * 12);
    ctx.fillStyle = 'rgba(20, 12, 40, 0.35)';
    ctx.fillRect(sx, y, 1, 6 + Math.floor(hash(tx, ty, 9) * 10));
  }
  if (!room) return;
  // A carved ledge under the wall top.
  if (room.tileAt(tx, ty - 1) === '#') {
    px(ctx, '#2a2148', x, y, T, 2);
    px(ctx, '#6a5a9c', x, y + 2, T, 1);
  }
  // Where the wall meets the floor: a dark base, and moss now and then.
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && !isWall(below)) {
    px(ctx, '#2a2148', x, y + T - 2, T, 2);
    for (let i = 0; i < 4; i++) {
      if (hash(tx, ty, 70 + i) < 0.35) px(ctx, i % 2 ? '#3f6b4a' : '#4f8a5a', x + i * 4 + Math.floor(hash(tx, ty, 80 + i) * 3), y + T - 3, 2, 2);
    }
  }
}

// An old woven carpet, faded and threadbare: a diamond pattern in wine and
// dusty gold, worn through in places, with a fringed border.
function drawRug(ctx, x, y, tx, ty, room) {
  px(ctx, '#5a1a36', x, y, T, T);
  // A diamond in every tile, joining up into a lattice across the carpet.
  for (let i = 0; i < 6; i++) {
    px(ctx, '#74284a', x + 8 - i, y + 2 + i, 1, 1);
    px(ctx, '#74284a', x + 7 + i, y + 2 + i, 1, 1);
    px(ctx, '#74284a', x + 8 - i, y + 13 - i, 1, 1);
    px(ctx, '#74284a', x + 7 + i, y + 13 - i, 1, 1);
  }
  px(ctx, '#a07a3a', x + 7, y + 7, 2, 2);
  px(ctx, '#6a2244', x + 6, y + 7, 1, 2);
  px(ctx, '#6a2244', x + 9, y + 7, 1, 2);
  // Worn thin where feet have passed for a hundred years.
  if (hash(tx, ty, 1) < 0.3) {
    const wx = x + 2 + Math.floor(hash(tx, ty, 2) * 9);
    const wy = y + 2 + Math.floor(hash(tx, ty, 3) * 9);
    px(ctx, '#4a1530', wx, wy, 4, 2);
    px(ctx, '#4a1530', wx + 1, wy + 2, 2, 1);
  }
  // Faded gold border on any edge that doesn't continue into more rug, with a fringe.
  const edge = (dx, dy) => room.tileAt(tx + dx, ty + dy) !== 'r';
  const border = (bx, by, w, h) => { px(ctx, '#2a0c1a', bx, by, w, h); };
  if (edge(0, -1)) { border(x, y, T, 1); px(ctx, '#a8823c', x, y + 1, T, 2); px(ctx, '#3a1024', x, y + 3, T, 1); }
  if (edge(0, 1)) { px(ctx, '#3a1024', x, y + T - 4, T, 1); px(ctx, '#a8823c', x, y + T - 3, T, 2); border(x, y + T - 1, T, 1); }
  if (edge(-1, 0)) { border(x, y, 1, T); px(ctx, '#a8823c', x + 1, y, 2, T); px(ctx, '#3a1024', x + 3, y, 1, T); }
  if (edge(1, 0)) { px(ctx, '#3a1024', x + T - 4, y, 1, T); px(ctx, '#a8823c', x + T - 3, y, 2, T); border(x + T - 1, y, 1, T); }
  // Tassels along the top and bottom.
  for (let fx = 1; fx < T; fx += 3) {
    if (edge(0, -1)) px(ctx, '#d8c08a', x + fx, y, 1, 1);
    if (edge(0, 1)) px(ctx, '#d8c08a', x + fx, y + T - 1, 1, 1);
  }
}

function drawPlant(ctx, x, y, tx, ty, room) {
  drawBaseFloor(ctx, x, y, tx, ty, room);

  ctx.fillStyle = '#120c1c';
  ctx.fillRect(x + 4, y + 10, 8, 6);
  ctx.fillRect(x + 2, y + 1, 12, 10);
  ctx.fillStyle = '#9a5a3a';
  ctx.fillRect(x + 5, y + 11, 6, 4);
  ctx.fillStyle = '#3f8f5a';
  ctx.fillRect(x + 3, y + 2, 10, 8);
  ctx.fillStyle = '#5fc27a';
  ctx.fillRect(x + 5, y + 3, 3, 3);
  ctx.fillRect(x + 9, y + 5, 2, 2);
}

// A stone pillar with a small lantern burning in a niche.
function drawPillar(ctx, x, y, tx, ty, room) {
  drawBaseFloor(ctx, x, y, tx, ty, room);
  ctx.fillStyle = '#120c1c';
  ctx.fillRect(x + 3, y, 10, T);
  ctx.fillStyle = '#5a4884';
  ctx.fillRect(x + 4, y, 8, T);
  ctx.fillStyle = '#7a66a8';
  ctx.fillRect(x + 4, y, 2, T);
  ctx.fillStyle = '#3a2a5e';
  ctx.fillRect(x + 4, y + 3, 8, 1);
  ctx.fillRect(x + 4, y + 13, 8, 1);
  ctx.fillStyle = '#120c1c';
  ctx.fillRect(x + 5, y + 5, 6, 6);
  ctx.fillStyle = '#ffcc66';
  ctx.fillRect(x + 6, y + 6, 4, 4);
  ctx.fillStyle = '#fff2c0';
  ctx.fillRect(x + 7, y + 7, 2, 2);
}

// A dark doorway with faint steps. The top of a doorway gets rounded arch corners.
function drawDoorway(ctx, x, y, tx, ty, room) {
  ctx.fillStyle = '#07040f';
  ctx.fillRect(x, y, T, T);
  ctx.fillStyle = '#140b26';
  for (let step = 4; step < T; step += 4) ctx.fillRect(x + 2, y + step, T - 4, 1);

  if (room.tileAt(tx, ty - 1) !== 'D') {
    ctx.fillStyle = '#4b3d78';
    if (room.tileAt(tx - 1, ty) !== 'D') {
      ctx.fillRect(x, y, 4, 2);
      ctx.fillRect(x, y + 2, 2, 2);
    }
    if (room.tileAt(tx + 1, ty) !== 'D') {
      ctx.fillRect(x + T - 4, y, 4, 2);
      ctx.fillRect(x + T - 2, y + 2, 2, 2);
    }
  }
}

// Ivy creeping down a wall.
function drawIvyWall(ctx, x, y, tx, ty, room) {
  drawWallFace(ctx, x, y, tx, ty, room);
  ctx.fillStyle = '#2f6b45';
  const shift = (tx * 5 + ty * 3) % 6;
  ctx.fillRect(x + 3 + shift, y, 2, T);
  ctx.fillRect(x + 9 - shift / 2, y, 1, 10);
  ctx.fillStyle = '#5fc27a';
  for (const [lx, ly] of [[2, 3], [6, 8], [1, 12], [8, 5]]) ctx.fillRect(x + lx + shift, y + ly, 2, 2);
}

// A faded banner from the welcome that never happened.
function drawBannerWall(ctx, x, y, tx, ty, room) {
  drawWallFace(ctx, x, y, tx, ty, room);
  ctx.fillStyle = '#120c1c';
  ctx.fillRect(x + 2, y + 1, 12, 1);
  ctx.fillStyle = '#8a3a4e';
  ctx.fillRect(x + 3, y + 2, 10, 10);
  ctx.fillRect(x + 3, y + 12, 3, 3);
  ctx.fillRect(x + 10, y + 12, 3, 2);
  ctx.fillStyle = '#d9a441';
  ctx.fillRect(x + 7, y + 4, 2, 6);
  ctx.fillRect(x + 5, y + 6, 6, 2);
  // Torn and faded on the side away from the light.
  ctx.fillStyle = '#4b3d78';
  ctx.fillRect(x + 12, y + 9, 1, 3);
}

// Floor with old cracks and a weed pushing through. Safe to walk on.
function drawCrackedFloor(ctx, x, y, tx, ty, room) {
  drawFloor(ctx, x, y, tx, ty, room);
  ctx.fillStyle = '#1c1636';
  for (const [cx, cy, w, h] of [[3, 4, 1, 3], [4, 7, 3, 1], [7, 8, 1, 3], [8, 11, 3, 1], [11, 3, 1, 2], [12, 5, 2, 1]]) {
    ctx.fillRect(x + cx, y + cy, w, h);
  }
  ctx.fillStyle = '#3f8f5a';
  ctx.fillRect(x + 9, y + 9, 1, 2);
  ctx.fillRect(x + 10, y + 8, 1, 2);
}

// Chunks of fallen stone. Blocks the way, but it's low, so it isn't drawn standing.
function drawRubble(ctx, x, y, tx, ty, room) {
  drawBaseFloor(ctx, x, y, tx, ty, room);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(x + 1, y + 12, 14, 3);
  for (const [rx, ry, w, h] of [[1, 7, 7, 6], [7, 4, 7, 9], [5, 10, 5, 4]]) {
    ctx.fillStyle = '#120c1c';
    ctx.fillRect(x + rx, y + ry, w, h);
    ctx.fillStyle = '#5a4884';
    ctx.fillRect(x + rx + 1, y + ry + 1, w - 2, h - 2);
    ctx.fillStyle = '#7a66a8';
    ctx.fillRect(x + rx + 1, y + ry + 1, w - 2, 1);
  }
}

// A still, dark channel of water. You can't walk on it.
function drawWater(ctx, x, y, tx, ty, room) {
  ctx.fillStyle = '#1b2350';
  ctx.fillRect(x, y, T, T);
  ctx.fillStyle = '#2c3a78';
  const shift = (tx * 7 + ty * 3) % 8;
  ctx.fillRect(x + shift, y + 6, 5, 1);
  ctx.fillRect(x + ((shift + 6) % 12), y + 11, 4, 1);
  // A stone lip where the water meets the floor above.
  if (room.tileAt(tx, ty - 1) !== '~') {
    ctx.fillStyle = '#4b3d78';
    ctx.fillRect(x, y, T, 3);
    ctx.fillStyle = '#120c1c';
    ctx.fillRect(x, y + 3, T, 1);
  }
}

// A raised bed of soil with flowers, tended by someone who cares. Each bed's
// flowers are a little different, picked by where it is.
function drawFlowerBed(ctx, x, y, tx, ty, room) {
  drawBaseFloor(ctx, x, y, tx, ty, room);
  const left = room.tileAt(tx - 1, ty) !== 'F';
  const right = room.tileAt(tx + 1, ty) !== 'F';
  // Wooden edging, open where beds join up.
  ctx.fillStyle = '#120c1c';
  ctx.fillRect(x + (left ? 1 : 0), y + 6, T - (left ? 1 : 0) - (right ? 1 : 0), 9);
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(x + (left ? 2 : 0), y + 7, T - (left ? 2 : 0) - (right ? 2 : 0), 7);
  ctx.fillStyle = '#3a2416';
  ctx.fillRect(x + (left ? 3 : 0), y + 8, T - (left ? 3 : 0) - (right ? 3 : 0), 4);
  // Stems and leaves, then the blooms.
  const colours = [['#ff7aa8', '#ffd6e6'], ['#ffd25e', '#fff2c0'], ['#b07cff', '#e2d0ff'], ['#ff8c5a', '#ffd2b8']];
  const seed = tx * 7 + ty * 13;
  for (let i = 0; i < 3; i++) {
    const fx = x + 2 + i * 5 + ((seed + i) % 2);
    const fy = y + 2 + ((seed + i * 3) % 3);
    const [petal, middle] = colours[(seed + i) % colours.length];
    ctx.fillStyle = '#3f8f5a';
    ctx.fillRect(fx + 1, fy + 3, 1, 8 - (fy - y));
    ctx.fillStyle = '#5fc27a';
    ctx.fillRect(fx + 2, fy + 5, 1, 1);
    ctx.fillStyle = petal;
    ctx.fillRect(fx, fy + 1, 3, 1);
    ctx.fillRect(fx + 1, fy, 1, 3);
    ctx.fillStyle = middle;
    ctx.fillRect(fx + 1, fy + 1, 1, 1);
  }
}

// Stairs climbing up and away through a wall: the steps get darker as they
// rise. Paint them two tiles tall in the wall (like a doorway) and put a Door on them.
function drawStairsUp(ctx, x, y, tx, ty, room) {
  const upper = room.tileAt(tx, ty + 1) === 'U';
  ctx.fillStyle = '#07040f';
  ctx.fillRect(x, y, T, T);
  const treads = upper ? ['#2a2048', '#33285a', '#3d306a', '#46397a'] : ['#4f418a', '#5a4b98', '#6556a6', '#7262b4'];
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = treads[i];
    ctx.fillRect(x, y + i * 4, T, 3);
    ctx.fillStyle = '#120c1c';
    ctx.fillRect(x, y + i * 4 + 3, T, 1);
  }
  // Rails where the stairs meet the wall.
  ctx.fillStyle = '#3a2f60';
  if (room.tileAt(tx - 1, ty) !== 'U') ctx.fillRect(x, y, 2, T);
  if (room.tileAt(tx + 1, ty) !== 'U') ctx.fillRect(x + T - 2, y, 2, T);
  // An arch over the top, like a doorway.
  if (room.tileAt(tx, ty - 1) !== 'U') {
    ctx.fillStyle = '#4b3d78';
    if (room.tileAt(tx - 1, ty) !== 'U') { ctx.fillRect(x, y, 4, 2); ctx.fillRect(x, y + 2, 2, 2); }
    if (room.tileAt(tx + 1, ty) !== 'U') { ctx.fillRect(x + T - 4, y, 4, 2); ctx.fillRect(x + T - 2, y + 2, 2, 2); }
  }
}

// Stairs going down into the dark: the steps fade the further down they go.
// Paint them along the bottom edge of a room and put a Door on them.
function drawStairsDown(ctx, x, y, tx, ty, room) {
  ctx.fillStyle = '#07040f';
  ctx.fillRect(x, y, T, T);
  const treads = ['#6556a6', '#4f418a', '#3a2f68', '#261d48'];
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = treads[i];
    ctx.fillRect(x, y + i * 4, T, 3);
    ctx.fillStyle = '#07040f';
    ctx.fillRect(x, y + i * 4 + 3, T, 1);
  }
  ctx.fillStyle = '#3a2f60';
  if (room.tileAt(tx - 1, ty) !== 'u') ctx.fillRect(x, y, 2, T);
  if (room.tileAt(tx + 1, ty) !== 'u') ctx.fillRect(x + T - 2, y, 2, T);
}

// --- Standing tiles ---
// Tall things (pillars, statues) are drawn with the characters, sorted by
// their base, so you can walk behind them and things can hide there. Their
// draw functions paint only the object, with its base on the tile and the
// rest rising above it; the floor under them is drawn separately.

function drawStandingShadow(ctx, x, y) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(x + 1, y + 13, 14, 3);
}

// A tall stone column, almost three tiles high.
function drawTallPillar(ctx, x, y) {
  drawStandingShadow(ctx, x, y);
  ctx.fillStyle = '#120c1c';
  ctx.fillRect(x + 1, y + 8, 14, 7);
  ctx.fillRect(x + 3, y - 26, 10, 36);
  ctx.fillRect(x + 1, y - 31, 14, 6);
  ctx.fillStyle = '#5a4884';
  ctx.fillRect(x + 2, y + 9, 12, 5);
  ctx.fillRect(x + 4, y - 25, 8, 34);
  ctx.fillStyle = '#7a66a8';
  ctx.fillRect(x + 2, y + 9, 12, 1);
  ctx.fillRect(x + 4, y - 25, 2, 34);
  ctx.fillRect(x + 2, y - 30, 12, 4);
  ctx.fillStyle = '#3a2a5e';
  ctx.fillRect(x + 10, y - 25, 2, 34);
  for (let band = y - 18; band < y + 8; band += 9) ctx.fillRect(x + 4, band, 8, 1);
}

// A column that broke long ago, its top jagged and its pieces scattered.
function drawBrokenPillar(ctx, x, y) {
  drawStandingShadow(ctx, x, y);
  ctx.fillStyle = '#120c1c';
  ctx.fillRect(x + 1, y + 8, 14, 7);
  ctx.fillRect(x + 3, y - 10, 10, 20);
  ctx.fillRect(x + 6, y - 14, 4, 4);
  ctx.fillStyle = '#5a4884';
  ctx.fillRect(x + 2, y + 9, 12, 5);
  ctx.fillRect(x + 4, y - 9, 8, 18);
  ctx.fillRect(x + 7, y - 13, 2, 4);
  ctx.fillStyle = '#7a66a8';
  ctx.fillRect(x + 2, y + 9, 12, 1);
  ctx.fillRect(x + 4, y - 9, 2, 18);
  ctx.fillStyle = '#3a2a5e';
  ctx.fillRect(x + 10, y - 9, 2, 18);
  ctx.fillRect(x + 4, y - 1, 8, 1);
  // A fallen chunk at its foot.
  ctx.fillStyle = '#120c1c';
  ctx.fillRect(x + 11, y + 10, 5, 4);
  ctx.fillStyle = '#7a66a8';
  ctx.fillRect(x + 12, y + 11, 3, 2);
}

// A worn statue of a hero with a raised sword. Nobody remembers whose face it had.
function drawStatue(ctx, x, y) {
  drawStandingShadow(ctx, x, y);
  ctx.fillStyle = '#120c1c';
  ctx.fillRect(x + 1, y + 7, 14, 8);
  ctx.fillStyle = '#5a5278';
  ctx.fillRect(x + 2, y + 8, 12, 6);
  ctx.fillStyle = '#8a80aa';
  ctx.fillRect(x + 2, y + 8, 12, 1);
  // Cape, body, legs and a blank, weathered face.
  ctx.fillStyle = '#3a3258';
  ctx.fillRect(x + 3, y - 15, 10, 22);
  ctx.fillStyle = '#6e6490';
  ctx.fillRect(x + 5, y - 15, 6, 10);
  ctx.fillRect(x + 5, y - 5, 2, 12);
  ctx.fillRect(x + 9, y - 5, 2, 12);
  ctx.fillRect(x + 5, y - 22, 6, 7);
  ctx.fillStyle = '#8a80aa';
  ctx.fillRect(x + 5, y - 22, 2, 7);
  ctx.fillRect(x + 5, y - 15, 2, 10);
  // The arm and sword, raised high.
  ctx.fillStyle = '#6e6490';
  ctx.fillRect(x + 11, y - 18, 2, 6);
  ctx.fillStyle = '#120c1c';
  ctx.fillRect(x + 10, y - 19, 6, 2);
  ctx.fillStyle = '#a8a0c8';
  ctx.fillRect(x + 12, y - 33, 2, 14);
}

// An iron candle stand with three candles, still burning.
function drawCandelabra(ctx, x, y) {
  drawStandingShadow(ctx, x, y);
  const seconds = performance.now() / 1000;
  ctx.fillStyle = '#120c1c';
  ctx.fillRect(x + 4, y + 11, 8, 3);
  ctx.fillRect(x + 7, y - 10, 2, 22);
  ctx.fillRect(x + 2, y - 10, 12, 2);
  ctx.fillRect(x + 2, y - 13, 2, 3);
  ctx.fillRect(x + 12, y - 13, 2, 3);
  ctx.fillStyle = '#e8d8b8';
  for (const [cx, top] of [[2, -18], [7, -21], [12, -18]]) {
    ctx.fillRect(x + cx, y + top, 2, (cx === 7 ? -10 : -13) - top);
  }
  ctx.fillStyle = '#ffcc66';
  for (const [cx, top, seed] of [[2, -18, 0], [7, -21, 2], [12, -18, 4]]) {
    const tall = Math.sin(seconds * 11 + seed) > 0.3 ? 1 : 0;
    ctx.fillRect(x + cx, y + top - 3 - tall, 2, 3 + tall);
  }
}

// Raised stone blocks you can jump up onto (see `raise` below). Each is drawn
// as a block standing on its tile: a front face as tall as it rises, and its
// top face above that, lit, reaching up into the tile behind. Rows are drawn
// top to bottom, so the block in front always covers the one behind it.
const BLOCK_TOP = ['#5d4f8e', '#594b88', '#615293', '#564884'];
function drawBlock(raise) {
  return (ctx, x, y, tx, ty, room) => {
    drawBaseFloor(ctx, x, y, tx, ty, room);
    const top = y - raise;
    const raiseAt = (dx, dy) => TILES[room?.tileAt(tx + dx, ty + dy)]?.raise ?? 0;
    // The front face: courses of darker stone, as tall as the block rises.
    px(ctx, '#2a2148', x, top + T, T, raise);
    for (let row = 0; row * 4 < raise; row++) {
      const offset = (row + tx) % 2 ? 4 : 0;
      for (let bx = -offset; bx < T; bx += 8) {
        const left = Math.max(0, bx);
        const width = Math.min(bx + 7, T) - left;
        if (width > 0) px(ctx, pick(BRICK_STONE, hash(tx * 3 + bx, ty * 5 + row, 31)), x + left, top + T + row * 4 + 1, width, 3);
      }
    }
    px(ctx, '#120c1c', x, y + T - 1, T, 1);
    // The top face: worn slabs, a lit near edge, and dark sides where it drops away.
    px(ctx, pick(BLOCK_TOP, hash(tx, ty, 33)), x, top, T, T);
    if (hash(tx, ty, 34) < 0.5) px(ctx, '#4f427c', x + 7, top + 1, 1, T - 2);
    if (hash(tx, ty, 35) < 0.4) px(ctx, '#4f427c', x + 1, top + 9, T - 2, 1);
    if (hash(tx, ty, 36) < 0.3) px(ctx, '#7a6ab0', x + 3 + Math.floor(hash(tx, ty, 37) * 9), top + 3 + Math.floor(hash(tx, ty, 38) * 8), 2, 1);
    if (raiseAt(0, 1) < raise) px(ctx, '#8a7ac0', x, top + T - 1, T, 1);
    if (raiseAt(0, -1) < raise) px(ctx, '#120c1c', x, top, T, 1);
    if (raiseAt(-1, 0) < raise) px(ctx, '#120c1c', x, top, 1, T + raise);
    if (raiseAt(1, 0) < raise) px(ctx, '#120c1c', x + T - 1, top, 1, T + raise);
  };
}

// `standing` tiles are drawn with the characters (see above); `height` is how
// tall they stand in pixels, for previews.
// `raise` tiles are blocks that stand that many pixels above the floor: you
// can walk on top of them, and get up there by jumping from something no more
// than JUMP_REACH lower (see player.js). Enemies can't jump, so to them
// they're walls.
export const TILES = {
  '#': { solid: true, draw: drawWallTop },
  W: { solid: true, draw: drawWallFace },
  V: { solid: true, draw: drawIvyWall },
  H: { solid: true, draw: drawBannerWall },
  '.': { solid: false, draw: drawFloor },
  o: { solid: false, draw: drawWoodFloor },
  h: { solid: true, draw: drawHomeWall },
  c: { solid: false, draw: drawCrackedFloor },
  r: { solid: false, draw: drawRug },
  p: { solid: true, draw: drawPlant },
  P: { solid: true, draw: drawPillar },
  R: { solid: true, draw: drawRubble },
  F: { solid: true, draw: drawFlowerBed },
  '~': { solid: true, draw: drawWater },
  D: { solid: false, draw: drawDoorway },
  U: { solid: false, draw: drawStairsUp },
  u: { solid: false, draw: drawStairsDown },
  I: { solid: true, standing: true, height: 47, draw: drawTallPillar },
  J: { solid: true, standing: true, height: 30, draw: drawBrokenPillar },
  S: { solid: true, standing: true, height: 49, draw: drawStatue },
  C: { solid: true, standing: true, height: 40, draw: drawCandelabra },
  b: { solid: false, raise: 12, draw: drawBlock(12) },
  B: { solid: false, raise: 24, draw: drawBlock(24) },
};

// What's drawn under a standing tile.
export const FLOOR_TILE = '.';
