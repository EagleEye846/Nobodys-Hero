import { TILE_SIZE as T } from '../config.js';

// Placeholder tiles drawn with rectangles. Each draw function paints one tile at
// pixel (x, y); tx/ty and room let a tile react to its neighbours.
function drawFloor(ctx, x, y, tx, ty, room) {
  ctx.fillStyle = (tx + ty) % 2 ? '#2e2650' : '#332a58';
  ctx.fillRect(x, y, T, T);
  ctx.fillStyle = '#241d40';
  ctx.fillRect(x, y + T - 1, T, 1);
  ctx.fillRect(x + T - 1, y, 1, T);

  // Shadow cast by a wall face directly above.
  if (room.tileAt(tx, ty - 1) === 'W') {
    ctx.fillStyle = '#1c1636';
    ctx.fillRect(x, y, T, 3);
  }
}

function drawWallTop(ctx, x, y) {
  ctx.fillStyle = '#120c1c';
  ctx.fillRect(x, y, T, T);
}

function drawWallFace(ctx, x, y) {
  ctx.fillStyle = '#4b3d78';
  ctx.fillRect(x, y, T, T);

  // Brick pattern: a mortar line every 4px, with joints offset on alternating rows.
  ctx.fillStyle = '#3a2f60';
  for (let row = 0; row < T / 4; row++) {
    const rowY = y + row * 4;
    ctx.fillRect(x, rowY + 3, T, 1);
    for (let jointX = row % 2 ? 4 : 0; jointX < T; jointX += 8) {
      ctx.fillRect(x + jointX, rowY, 1, 3);
    }
  }
}

function drawRug(ctx, x, y, tx, ty, room) {
  ctx.fillStyle = '#7a2146';
  ctx.fillRect(x, y, T, T);
  ctx.fillStyle = '#a8345f';
  ctx.fillRect(x + 7, y + 4, 2, 8);
  ctx.fillRect(x + 4, y + 7, 8, 2);

  // Gold trim on any edge that doesn't continue into more rug.
  ctx.fillStyle = '#d9a441';
  if (room.tileAt(tx, ty - 1) !== 'r') ctx.fillRect(x, y, T, 2);
  if (room.tileAt(tx, ty + 1) !== 'r') ctx.fillRect(x, y + T - 2, T, 2);
  if (room.tileAt(tx - 1, ty) !== 'r') ctx.fillRect(x, y, 2, T);
  if (room.tileAt(tx + 1, ty) !== 'r') ctx.fillRect(x + T - 2, y, 2, T);
}

function drawPlant(ctx, x, y, tx, ty, room) {
  drawFloor(ctx, x, y, tx, ty, room);

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
  drawFloor(ctx, x, y, tx, ty, room);
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

export const TILES = {
  '#': { solid: true, draw: drawWallTop },
  W: { solid: true, draw: drawWallFace },
  '.': { solid: false, draw: drawFloor },
  r: { solid: false, draw: drawRug },
  p: { solid: true, draw: drawPlant },
  P: { solid: true, draw: drawPillar },
  D: { solid: false, draw: drawDoorway },
};
