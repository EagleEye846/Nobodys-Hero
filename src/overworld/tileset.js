import { TILE_SIZE as T } from '../config.js';
import { OUTDOOR_AREAS } from '../data/areas.js';

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

// A soft, lumpy patch of a second tone on a ground tile (grass, leaves, fen
// turf): three rects overlapping, so it never shows as a square. `size` is
// how big across; it stays inside the tile.
function mottle(ctx, color, x, y, tx, ty, salt, size = 6) {
  const mx = Math.floor(hash(tx, ty, salt) * (T - size));
  const my = Math.floor(hash(tx, ty, salt + 1) * (T - size));
  const lean = Math.floor(hash(tx, ty, salt + 2) * 3) - 1;
  px(ctx, color, x + mx, y + my + 1, size, size - 2);
  px(ctx, color, x + mx + 1, y + my, size - 2, size);
  px(ctx, color, x + Math.max(0, Math.min(T - size - 1, mx + lean)), y + my + Math.floor(size / 2) - 1, size + 1, 2);
}

const isWallFace = (c) => c === 'W' || c === 'V' || c === 'H' || c === 'h';
const isWall = (c) => c === '#' || isWallFace(c);
// The Old Drains under Hollin (Chapter 3) draw some old tiles their own way:
// see the drains section, near the end. The old city's stone out in the
// Lantern Marsh is the same drowned stone.
const isDrains = (room) => room?.area === 'drains' || room?.area === 'marsh';

// Old flagstones: worn slabs of a few sizes in slightly different stone, with
// cracks, chips, and now and then a fallen red leaf.
const SLAB_STONE = ['#2f2752', '#332a58', '#2c244d', '#362c5d', '#30285a'];
// Out in the Hollow Valley (Chapter 3) the same flagstones lie under the open
// sky in the dead city: see drawRuinedFloor.
const isValley = (room) => room?.area === 'valley';
function drawFloor(ctx, x, y, tx, ty, room) {
  if (isDrains(room)) return drawDrownedFloor(ctx, x, y, tx, ty, room);
  if (isValley(room)) return drawRuinedFloor(ctx, x, y, tx, ty, room);
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

// The dead city's flagstones: the Ruins' slabs, a little paler in the
// daylight, split by frost and heaved by roots, with grass and weeds coming
// up through every joint, moss in the shade, and rain standing in the hollows.
// Where they meet the valley's grass, the grass creeps in over them.
const RUINED_SLAB = ['#3a3160', '#3e3566', '#372e5b', '#413869', '#3b3262'];
function drawRuinedFloor(ctx, x, y, tx, ty, room) {
  const layout = hash(tx, ty, 1);
  const slabs = layout < 0.5 ? [[0, 0, 16, 16]]
    : layout < 0.85 ? (hash(tx, ty, 2) < 0.5 ? [[0, 0, 16, 8], [0, 8, 16, 8]] : [[0, 0, 8, 16], [8, 0, 8, 16]])
      : [[0, 0, 8, 8], [8, 0, 8, 8], [0, 8, 8, 8], [8, 8, 8, 8]];
  slabs.forEach(([sx, sy, w, h], i) => {
    const roll = hash(tx, ty, 10 + i);
    px(ctx, pick(RUINED_SLAB, roll), x + sx, y + sy, w, h);
    px(ctx, '#4a4078', x + sx + 1, y + sy, w - 2, 1);
    px(ctx, '#2a2448', x + sx, y + sy + h - 1, w, 1);
    px(ctx, '#2a2448', x + sx + w - 1, y + sy, 1, h);
    // A slab heaved up at one end: its lower half in shadow, its top edge lit.
    if (roll < 0.1) {
      px(ctx, '#322a54', x + sx + 1, y + sy + Math.floor(h / 2), w - 2, Math.floor(h / 2) - 1);
      px(ctx, '#5a4e8c', x + sx + 1, y + sy, w - 2, 1);
    }
    // A corner broken off, the earth showing.
    if (hash(tx, ty, 20 + i) < 0.14) px(ctx, '#241e3e', x + sx + w - 3, y + sy + h - 3, 2, 2);
  });
  // Cracks: more of them, and wider, than indoors, lit along one side.
  if (hash(tx, ty, 3) < 0.22) {
    let cx = 3 + Math.floor(hash(tx, ty, 4) * 9);
    const from = Math.floor(hash(tx, ty, 29) * 4);
    for (let cy = from; cy < from + 9 + Math.floor(hash(tx, ty, 28) * 4) && cy < T; cy++) {
      px(ctx, '#1e1838', x + cx, y + cy);
      px(ctx, '#4a4078', x + cx + 1, y + cy);
      if (hash(tx, ty, 30 + cy) < 0.3) px(ctx, '#1e1838', x + cx - 1, y + cy);
      cx += hash(tx, ty, 30 + cy) < 0.5 ? -1 : 1;
      cx = Math.max(1, Math.min(13, cx));
    }
  }
  // Grit, and moss where the slabs stay damp.
  for (let i = 0; i < 3; i++) {
    if (hash(tx, ty, 40 + i) < 0.5) px(ctx, '#4a4080', x + 1 + Math.floor(hash(tx, ty, 50 + i) * 14), y + 1 + Math.floor(hash(tx, ty, 60 + i) * 14));
  }
  if (hash(tx, ty, 5) < 0.18) {
    const mx = x + 1 + Math.floor(hash(tx, ty, 6) * 10);
    const my = y + 1 + Math.floor(hash(tx, ty, 7) * 10);
    px(ctx, '#3f6b4a', mx, my, 4, 2);
    px(ctx, '#3f6b4a', mx + 1, my + 2, 2, 1);
    px(ctx, '#4f8a5a', mx + 1, my, 1, 1);
  }
  // Weeds up through the joints: grass, and now and then a flower.
  if (hash(tx, ty, 8) < 0.22) {
    const joint = slabs.length === 1 ? [7 + Math.floor(hash(tx, ty, 9) * 2), 1 + Math.floor(hash(tx, ty, 11) * 13)]
      : [slabs[1][0] === 8 ? 7 : 1 + Math.floor(hash(tx, ty, 9) * 13), slabs[1][1] === 8 ? 7 : 1 + Math.floor(hash(tx, ty, 11) * 13)];
    const [wx, wy] = [x + joint[0], y + joint[1]];
    px(ctx, '#3b6d38', wx, wy - 1, 1, 3);
    px(ctx, '#4f8a4a', wx + 1, wy - 2, 1, 2);
    px(ctx, '#3b6d38', wx - 1, wy, 1, 2);
    if (hash(tx, ty, 12) < 0.25) px(ctx, pick(FLOWERS, hash(tx, ty, 13)), wx + 1, wy - 3, 1, 1);
  }
  // Rain standing in a worn hollow.
  if (hash(tx, ty, 14) < 0.06) {
    const pxx = x + 3 + Math.floor(hash(tx, ty, 15) * 7);
    const pyy = y + 4 + Math.floor(hash(tx, ty, 16) * 8);
    px(ctx, '#26305a', pxx, pyy, 6, 2);
    px(ctx, '#26305a', pxx + 1, pyy - 1, 4, 1);
    px(ctx, '#6a7ab0', pxx + 2, pyy - 1, 2, 1);
  }
  // Grass creeping in over the edge from the turf beside it.
  const grassy = (dx, dy) => room.tileAt(tx + dx, ty + dy) === ',';
  for (let i = 0; i < T; i += 2) {
    const tuft = hash(tx * 3 + i, ty, 17) < 0.6 ? 1 : 2;
    const c = hash(tx * 3 + i, ty, 18) < 0.5 ? '#4f8a4a' : '#46803f';
    if (grassy(0, -1)) px(ctx, c, x + i, y, 2, tuft);
    if (grassy(0, 1)) px(ctx, c, x + i, y + T - tuft, 2, tuft);
    if (grassy(-1, 0)) px(ctx, c, x, y + i, tuft, 2);
    if (grassy(1, 0)) px(ctx, c, x + T - tuft, y + i, tuft, 2);
  }
  // Shadow cast by a wall directly above.
  if (isWall(room.tileAt(tx, ty - 1))) {
    ctx.fillStyle = 'rgba(10, 6, 20, 0.5)';
    ctx.fillRect(x, y, T, 3);
    ctx.fillStyle = 'rgba(10, 6, 20, 0.22)';
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
function floorFor(c) {
  if (c === 'o' || c === ',' || c === ':' || c === 's' || c === 'n' || c === 'i' || c === 'l' || c === 'z' || c === 'q' || c === 'g' || c === 'd' || c === 'y' || c === 'X' || c === 'j') return c;
  if (c === '.' || c === 'c') return '.';
  if (c === ';' || c === '=') return ';';
  return null;
}
export function floorUnder(room, tx, ty) {
  for (const [dx, dy] of [[0, 1], [-1, 0], [1, 0], [0, -1]]) {
    const floor = floorFor(room.tileAt(tx + dx, ty + dy));
    if (floor) return floor;
  }
  // In the middle of a big block (the crier's stone): the nearest floor
  // further out, so its middle matches its edges.
  for (let r = 2; r <= 4; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const floor = floorFor(room.tileAt(tx + dx, ty + dy));
        if (floor) return floor;
      }
    }
  }
  // Nothing to go by (a block or boulder surrounded by others): outdoors it's
  // grass, or snow up the mountain, or leaves in the scarlet forest, or cave
  // floor underground.
  if (room.snowy) return 'n';
  if (room.leafy) return 'd';
  if (room.cave) return 'q';
  if (isMarsh(room)) return ';';
  return OUTDOOR_AREAS.has(room.area) ? ',' : '.';
}
function drawBaseFloor(ctx, x, y, tx, ty, room) {
  const under = floorUnder(room, tx, ty);
  const draw = { o: drawWoodFloor, ',': drawGrass, ':': drawPath, s: drawStair, n: drawSnow, i: drawSnowPath, l: drawSnowLane, z: drawIce, q: drawCaveFloor, g: drawBridge, d: drawLeafLitter, y: drawLeafPath, X: drawCobbles, j: drawDryChannel, ';': drawFenTurf }[under] ?? drawFloor;
  draw(ctx, x, y, tx, ty, room);
}
// Whether a floor is out in the open air (grass, a path, the stair, snow, ice, the scarlet forest's leaves).
const OUTDOOR_FLOORS = new Set([',', ':', 's', 'n', 'i', 'l', 'z', 'g', 'd', 'y', 'X', 'j', 'N', ';', '%', '=']);
const SNOW_FLOORS = new Set(['n', 'i', 'l', 'z']);

// The dark above a wall: rough stone with a faint lit rim where it meets the room.
function drawWallTop(ctx, x, y, tx = 0, ty = 0, room = null) {
  if (isDrains(room)) return drawDrownedWallTop(ctx, x, y, tx, ty, room);
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
  if (isDrains(room)) return drawDrownedWallFace(ctx, x, y, tx, ty, room);
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
  // Out in the dead city the walls have weathered: more bricks gone, lichen
  // on the stone, and ivy climbing it.
  if (isValley(room)) {
    if (hash(tx, ty, 10) < 0.2) {
      const gx = x + Math.floor(hash(tx, ty, 11) * 3) * 4 + ((tx + Math.floor(hash(tx, ty, 11) * 3)) % 2 ? 4 : 0);
      const gy = y + Math.floor(hash(tx, ty, 12) * 4) * 4;
      px(ctx, '#241c40', gx, gy, 7, 3);
      px(ctx, '#1a1430', gx + 1, gy + 1, 5, 1);
    }
    for (let i = 0; i < 3; i++) {
      if (hash(tx, ty, 13 + i) < 0.3) px(ctx, i % 2 ? '#8a86a0' : '#9a9870', x + 1 + Math.floor(hash(tx, ty, 16 + i) * 14), y + 1 + Math.floor(hash(tx, ty, 19 + i) * 14), 2, 1);
    }
    if (hash(tx, ty, 22) < 0.28) {
      let vx = 2 + Math.floor(hash(tx, ty, 23) * 11);
      for (let vy = 0; vy < T; vy++) {
        px(ctx, '#2e5038', x + vx, y + vy);
        if (hash(tx, ty, 24 + vy) < 0.4) px(ctx, vy % 2 ? '#3f6b4a' : '#4f8a5a', x + vx + (hash(tx, ty, 40 + vy) < 0.5 ? -1 : 1), y + vy, 1, 1);
        if (hash(tx, ty, 60 + vy) < 0.3) vx = Math.max(1, Math.min(14, vx + (hash(tx, ty, 80 + vy) < 0.5 ? -1 : 1)));
      }
    }
  }
  if (!room) return;
  // A carved ledge under the wall top.
  if (room.tileAt(tx, ty - 1) === '#') {
    px(ctx, '#2a2148', x, y, T, 2);
    px(ctx, '#6a5a9c', x, y + 2, T, 1);
    // Grass has seeded along the broken top of the dead city's walls.
    if (isValley(room)) for (let i = 0; i < T; i += 3) if (hash(tx * 5 + i, ty, 100) < 0.45) px(ctx, i % 2 ? '#4f8a4a' : '#3b6d38', x + i, y, 1, 2 + Math.floor(hash(tx * 5 + i, ty, 101) * 2));
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
  // In a log cabin's wall, it's a cabin door.
  const log = (c) => c === 'a' || c === 'w';
  if (room && (log(room.tileAt(tx - 1, ty)) || log(room.tileAt(tx + 1, ty)))) {
    drawCabinDoor(ctx, x, y, tx, ty, room);
    return;
  }
  // In a Hollin cottage's front, it's that cottage's door, standing open.
  if (room && (isCottage(room.tileAt(tx - 1, ty)) || isCottage(room.tileAt(tx + 1, ty)))) {
    drawCottageDoorOpen(ctx, x, y, tx, ty, room);
    return;
  }
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
  if (isDrains(room)) return drawDrainWater(ctx, x, y, tx, ty, room);
  // Under the valley's open sky the water's a shade lighter, and the sky
  // glints in it; in the Ruins it's dark.
  const open = isValley(room);
  px(ctx, open ? '#1e2858' : '#1b2350', x, y, T, T);
  if (open) mottle(ctx, '#1a2450', x, y, tx, ty, 120, 7);
  const shift = (tx * 7 + ty * 3) % 8;
  px(ctx, open ? '#34448a' : '#2c3a78', x + shift, y + 6, 5, 1);
  px(ctx, open ? '#34448a' : '#2c3a78', x + ((shift + 6) % 12), y + 11, 4, 1);
  if (open) {
    px(ctx, '#4a5aa0', x + shift + 1, y + 6, 2, 1);
    if (hash(tx, ty, 121) < 0.35) px(ctx, '#8a9ad8', x + 2 + Math.floor(hash(tx, ty, 122) * 12), y + 2 + Math.floor(hash(tx, ty, 123) * 12), 2, 1);
    // A lily pad, or a drowned slab showing under the surface.
    if (hash(tx, ty, 124) < 0.08) {
      const lx = x + 3 + Math.floor(hash(tx, ty, 125) * 8);
      const ly = y + 3 + Math.floor(hash(tx, ty, 126) * 8);
      px(ctx, '#3a6a48', lx, ly, 4, 3);
      px(ctx, '#1e2858', lx + 2, ly, 1, 1);
      px(ctx, '#4f8a5a', lx, ly, 2, 1);
    } else if (hash(tx, ty, 127) < 0.1) {
      px(ctx, '#283468', x + 2 + Math.floor(hash(tx, ty, 128) * 6), y + 3 + Math.floor(hash(tx, ty, 129) * 7), 7, 5);
    }
  }
  // A stone lip where the water meets the floor above.
  if (room.tileAt(tx, ty - 1) !== '~') {
    px(ctx, '#4b3d78', x, y, T, 3);
    px(ctx, '#120c1c', x, y + 3, T, 1);
    if (open) for (let i = 0; i < T; i += 4) if (hash(tx * 3 + i, ty, 130) < 0.4) px(ctx, '#3f6b4a', x + i + 1, y + 1, 2, 2);
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

// --- Outdoors: the mountain past the Ruins, in daylight. ---

// Grass: a few greens, blades catching the light, and now and then a flower.
const GRASS = ['#4a8446', '#4f8a4a', '#548f4e', '#46803f'];
const FLOWERS = ['#f2e6c8', '#ffd25e', '#f0a8c8', '#a8c8f0'];
function drawGrass(ctx, x, y, tx, ty) {
  px(ctx, pick(GRASS, hash(tx, ty, 41)), x, y, T, T);
  // Other greens mottled in, soft-edged, so no squares show across a field.
  mottle(ctx, pick(GRASS, hash(tx, ty, 43)), x, y, tx, ty, 44, 7);
  if (hash(tx, ty, 42) < 0.6) mottle(ctx, pick(GRASS, hash(tx, ty, 47)), x, y, tx, ty, 48, 4);
  for (let i = 0; i < 6; i++) {
    const bx = x + Math.floor(hash(tx, ty, 50 + i) * 15);
    const by = y + Math.floor(hash(tx, ty, 60 + i) * 14);
    px(ctx, i % 2 ? '#3b6d38' : '#6aa65c', bx, by, 1, i % 2 ? 2 : 1);
  }
  // A clover leaf, or a small stone half sunk in the turf.
  if (hash(tx, ty, 74) < 0.1) {
    const cx = x + 2 + Math.floor(hash(tx, ty, 75) * 11);
    const cy = y + 2 + Math.floor(hash(tx, ty, 76) * 11);
    px(ctx, '#3b6d38', cx, cy, 3, 2);
    px(ctx, '#6aa65c', cx + 1, cy, 1, 1);
  } else if (hash(tx, ty, 77) < 0.06) {
    const sx = x + 2 + Math.floor(hash(tx, ty, 78) * 11);
    const sy = y + 3 + Math.floor(hash(tx, ty, 79) * 10);
    px(ctx, '#5e5a6a', sx, sy, 3, 2);
    px(ctx, '#8a8698', sx, sy, 2, 1);
    px(ctx, '#3b6d38', sx, sy + 2, 3, 1);
  }
  if (hash(tx, ty, 70) < 0.14) {
    const fx = x + 3 + Math.floor(hash(tx, ty, 71) * 10);
    const fy = y + 3 + Math.floor(hash(tx, ty, 72) * 10);
    const petal = pick(FLOWERS, hash(tx, ty, 73));
    px(ctx, petal, fx - 1, fy, 3, 1);
    px(ctx, petal, fx, fy - 1, 1, 3);
    px(ctx, '#ffcc66', fx, fy, 1, 1);
  }
}

// A worn dirt path, pebbly, with grass creeping in at its edges.
function drawPath(ctx, x, y, tx, ty, room) {
  px(ctx, '#8f6f48', x, y, T, T);
  // Trodden patches, a little paler or darker, and the odd rut.
  mottle(ctx, hash(tx, ty, 100) < 0.5 ? '#967650' : '#866842', x, y, tx, ty, 101, 6);
  for (let i = 0; i < 7; i++) {
    px(ctx, i % 3 ? '#a5845a' : '#76583a', x + Math.floor(hash(tx, ty, 80 + i) * 15), y + Math.floor(hash(tx, ty, 90 + i) * 15), i % 3 ? 1 : 2, 1);
  }
  // A pebble, lit on top with a shadow under it.
  if (hash(tx, ty, 104) < 0.3) {
    const sx = x + 2 + Math.floor(hash(tx, ty, 105) * 11);
    const sy = y + 2 + Math.floor(hash(tx, ty, 106) * 11);
    px(ctx, '#6a5a52', sx, sy + 1, 3, 1);
    px(ctx, '#b0a090', sx, sy, 2, 1);
  }
  const grassy = (dx, dy) => room && room.tileAt(tx + dx, ty + dy) === ',';
  for (let i = 0; i < T; i += 2) {
    const tuft = hash(tx * 3 + i, ty, 99) < 0.6 ? 1 : 2;
    if (grassy(0, -1)) px(ctx, '#4f8a4a', x + i, y, 2, tuft);
    if (grassy(0, 1)) px(ctx, '#4f8a4a', x + i, y + T - tuft, 2, tuft);
    if (grassy(-1, 0)) px(ctx, '#4f8a4a', x, y + i, tuft, 2);
    if (grassy(1, 0)) px(ctx, '#4f8a4a', x + T - tuft, y + i, tuft, 2);
  }
}

const isCliff = (c) => c === 'M' || c === 'm' || c === 'E' || c === 'A';
const isSnowTop = (c) => c === 'A';

// A rock cliff face: layered stone, cracked, grass on its lip, moss at its foot.
const CLIFF_ROCK = ['#6a6372', '#736c7c', '#625b6a', '#6e6776'];
function drawCliffFace(ctx, x, y, tx, ty, room) {
  for (let band = 0; band < 4; band++) {
    px(ctx, pick(CLIFF_ROCK, hash(tx, ty * 4 + band, 110)), x, y + band * 4, T, 4);
    // The edges of the rock's layers, uneven from tile to tile.
    px(ctx, '#857e8e', x + Math.floor(hash(tx, ty * 4 + band, 111) * 6), y + band * 4, 6 + Math.floor(hash(tx, ty * 4 + band, 112) * 8), 1);
  }
  if (hash(tx, ty, 113) < 0.5) {
    const cx = x + 2 + Math.floor(hash(tx, ty, 114) * 11);
    px(ctx, '#443e4c', cx, y + 2, 1, 5);
    px(ctx, '#443e4c', cx + 1, y + 7, 1, 4);
  }
  if (!room) return;
  const above = room.tileAt(tx, ty - 1);
  if (above === 'm') {
    px(ctx, room.leafy ? '#8a1a2e' : '#4f8a4a', x, y, T, 2);
    for (let i = 0; i < T; i += 3) if (hash(tx * 5 + i, ty, 115) < 0.5) px(ctx, room.leafy ? '#c0283a' : '#3b6d38', x + i, y + 2, 1, 2);
  }
  // Under a snowy top: a lip of snow, with the odd drip of ice.
  if (isSnowTop(above)) drawSnowLip(ctx, x, y, tx, ty);
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && below !== '_' && !isCliff(below)) {
    px(ctx, '#3f3946', x, y + T - 2, T, 2);
    const tuft = SNOW_FLOORS.has(below) ? '#eef3fa' : room.leafy ? '#c0283a' : '#4f8a4a';
    for (let i = 0; i < 4; i++) if (hash(tx, ty, 116 + i) < 0.4) px(ctx, tuft, x + i * 4 + 1, y + T - 3, 2, 2);
  }
}

// Snow overhanging the top of a cliff, with icicles.
function drawSnowLip(ctx, x, y, tx, ty) {
  px(ctx, '#eef3fa', x, y, T, 2);
  px(ctx, '#cfdcee', x, y + 2, T, 1);
  for (let i = 0; i < T; i += 2) if (hash(tx * 7 + i, ty, 117) < 0.35) px(ctx, '#eef3fa', x + i, y + 2, 1, 1 + Math.floor(hash(tx * 7 + i, ty, 118) * 2));
  if (hash(tx, ty, 119) < 0.5) {
    const ix = x + 2 + Math.floor(hash(tx, ty, 120) * 12);
    px(ctx, '#cfe6f5', ix, y + 3, 1, 3 + Math.floor(hash(tx, ty, 121) * 4));
  }
}

// The top of a cliff, seen from above: turf and rock, dark against the light.
function drawCliffTop(ctx, x, y, tx, ty, room) {
  // In the scarlet forest the clifftops are deep in red leaves, not grass.
  const leafy = room?.leafy;
  px(ctx, leafy ? '#4a1626' : '#3a6638', x, y, T, T);
  for (let i = 0; i < 5; i++) px(ctx, i % 2 ? (leafy ? '#c0283a' : '#2f5530') : '#5a5462', x + Math.floor(hash(tx, ty, 120 + i) * 14), y + Math.floor(hash(tx, ty, 130 + i) * 14), 2, i % 2 ? 1 : 2);
  if (!room) return;
  if (!isCliff(room.tileAt(tx, ty + 1) ?? 'm')) px(ctx, leafy ? '#2a0c16' : '#243f24', x, y + T - 1, T, 1);
}

// The great stair: wide old stone steps, two to a tile, worn in the middle.
function drawStair(ctx, x, y, tx, ty, room) {
  for (let step = 0; step < 2; step++) {
    const sy = y + step * 8;
    px(ctx, hash(tx, ty * 2 + step, 140) < 0.5 ? '#b8b0a2' : '#b0a898', x, sy, T, 6);
    px(ctx, '#8a8274', x, sy + 6, T, 2);
    // Joints between the slabs, and moss in the cracks.
    px(ctx, '#9a9284', x + 4 + Math.floor(hash(tx, ty * 2 + step, 141) * 8), sy, 1, 6);
    if (hash(tx, ty * 2 + step, 142) < 0.3) px(ctx, '#6aa65c', x + Math.floor(hash(tx, ty * 2 + step, 143) * 14), sy + 5, 2, 1);
  }
  if (!room) return;
  // Up the mountain, snow lies along the back of each step.
  const snowy = room.snowy || [[0, -1], [0, 1], [-1, 0], [1, 0]].some(([dx, dy]) => SNOW_FLOORS.has(room.tileAt(tx + dx, ty + dy)) || isSnowTop(room.tileAt(tx + dx, ty + dy)));
  if (snowy) {
    for (let step = 0; step < 2; step++) {
      const sy = y + step * 8;
      px(ctx, '#eef3fa', x, sy, T, 2);
      for (let i = 0; i < T; i += 3) if (hash(tx * 3 + i, ty * 2 + step, 144) < 0.5) px(ctx, '#eef3fa', x + i, sy + 2, 2, 1);
      if (hash(tx, ty * 2 + step, 145) < 0.4) px(ctx, '#dfe8f3', x + Math.floor(hash(tx, ty * 2 + step, 146) * 10), sy + 4, 5, 1);
    }
  }
  // Low walls where the stair meets anything else.
  if (room.tileAt(tx - 1, ty) !== 's') px(ctx, '#6a6274', x, y, 2, T);
  if (room.tileAt(tx + 1, ty) !== 's') px(ctx, '#6a6274', x + T - 2, y, 2, T);
}

// A mountain pine: a straight trunk and three tiers of dark needles.
function drawPine(ctx, x, y) {
  drawStandingShadow(ctx, x, y);
  ctx.fillStyle = '#3a2416';
  ctx.fillRect(x + 6, y + 4, 4, 11);
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(x + 7, y + 4, 2, 11);
  const tiers = [[-30, 6, 12], [-21, 10, 14], [-10, 14, 14]];
  for (const [top, width, height] of tiers) {
    for (let row = 0; row < height; row++) {
      const w = Math.round(2 + ((width - 2) * row) / (height - 1));
      const left = x + 8 - Math.floor(w / 2);
      ctx.fillStyle = '#14281a';
      ctx.fillRect(left - 1, y + top + row, w + 2, 1);
      ctx.fillStyle = '#2f5a35';
      ctx.fillRect(left, y + top + row, w, 1);
      ctx.fillStyle = '#3d7043';
      ctx.fillRect(left, y + top + row, Math.ceil(w / 3), 1);
      ctx.fillStyle = '#244a2b';
      ctx.fillRect(left + w - Math.ceil(w / 4), y + top + row, Math.ceil(w / 4), 1);
    }
  }
}

// A mossy boulder sitting in the grass.
function drawBoulder(ctx, x, y, tx, ty, room) {
  drawBaseFloor(ctx, x, y, tx, ty, room);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(x + 2, y + 12, 13, 3);
  ctx.fillStyle = '#2e2a34';
  ctx.fillRect(x + 2, y + 3, 12, 11);
  ctx.fillRect(x + 1, y + 5, 14, 7);
  ctx.fillStyle = '#7a7484';
  ctx.fillRect(x + 3, y + 4, 10, 9);
  ctx.fillRect(x + 2, y + 6, 12, 5);
  ctx.fillStyle = '#9a94a4';
  ctx.fillRect(x + 4, y + 5, 4, 2);
  ctx.fillStyle = '#5a5464';
  ctx.fillRect(x + 9, y + 10, 4, 2);
  ctx.fillStyle = '#4f8a4a';
  ctx.fillRect(x + 4, y + 3, 6, 2);
  ctx.fillStyle = '#6aa65c';
  ctx.fillRect(x + 5, y + 3, 2, 1);
}

// Raised stone blocks you can jump up onto (see `raise` below). Each is drawn
// as a block standing on its tile: a front face as tall as it rises, and its
// top face above that, lit, reaching up into the tile behind. Rows are drawn
// top to bottom, so the block in front always covers the one behind it.
const BLOCK_TOP = ['#5d4f8e', '#594b88', '#615293', '#564884'];
// Outdoors (on grass, a path or the stair) the same blocks are weathered grey stone.
const OUTDOOR_BLOCK_TOP = ['#a8a092', '#a09888', '#b0a898', '#9c9484'];
const OUTDOOR_BRICK = ['#8a8274', '#827a6c', '#90887a', '#7c7466'];
// Up the mountain their tops are under snow.
const SNOW_BLOCK_TOP = ['#dfe8f3', '#d8e2ef', '#e6edf6', '#d2dceb'];
function drawBlock(raise) {
  return (ctx, x, y, tx, ty, room) => {
    drawBaseFloor(ctx, x, y, tx, ty, room);
    const under = room ? floorUnder(room, tx, ty) : '.';
    const outdoors = OUTDOOR_FLOORS.has(under);
    const snowy = SNOW_FLOORS.has(under);
    const tops = snowy ? SNOW_BLOCK_TOP : outdoors ? OUTDOOR_BLOCK_TOP : BLOCK_TOP;
    const bricks = outdoors ? OUTDOOR_BRICK : BRICK_STONE;
    const top = y - raise;
    const raiseAt = (dx, dy) => TILES[room?.tileAt(tx + dx, ty + dy)]?.raise ?? 0;
    // The front face: courses of darker stone, as tall as the block rises.
    px(ctx, outdoors ? '#5a5448' : '#2a2148', x, top + T, T, raise);
    for (let row = 0; row * 4 < raise; row++) {
      const offset = (row + tx) % 2 ? 4 : 0;
      for (let bx = -offset; bx < T; bx += 8) {
        const left = Math.max(0, bx);
        const width = Math.min(bx + 7, T) - left;
        if (width > 0) px(ctx, pick(bricks, hash(tx * 3 + bx, ty * 5 + row, 31)), x + left, top + T + row * 4 + 1, width, 3);
      }
    }
    px(ctx, '#120c1c', x, y + T - 1, T, 1);
    // The top face: worn slabs, a lit near edge, and dark sides where it drops away.
    px(ctx, pick(tops, hash(tx, ty, 33)), x, top, T, T);
    const seam = snowy ? '#c3d2e6' : outdoors ? '#8a8274' : '#4f427c';
    if (hash(tx, ty, 34) < 0.5) px(ctx, seam, x + 7, top + 1, 1, T - 2);
    if (hash(tx, ty, 35) < 0.4) px(ctx, seam, x + 1, top + 9, T - 2, 1);
    if (hash(tx, ty, 36) < 0.3) px(ctx, snowy ? '#ffffff' : outdoors ? '#6aa65c' : '#7a6ab0', x + 3 + Math.floor(hash(tx, ty, 37) * 9), top + 3 + Math.floor(hash(tx, ty, 38) * 8), 2, 1);
    if (raiseAt(0, 1) < raise) px(ctx, snowy ? '#f6f9fc' : outdoors ? '#c8c0b0' : '#8a7ac0', x, top + T - 1, T, 1);
    if (raiseAt(0, -1) < raise) px(ctx, '#120c1c', x, top, T, 1);
    if (raiseAt(-1, 0) < raise) px(ctx, '#120c1c', x, top, 1, T + raise);
    if (raiseAt(1, 0) < raise) px(ctx, '#120c1c', x + T - 1, top, 1, T + raise);
  };
}

// --- Mount Vigil: snow and ice on the spire, its caves, and Heralds' Rest. ---

// Open sky: nothing is drawn, so the view off the mountain shows through
// (see vista.js). You can't walk on air.
function drawSky() {}

// Snow, everywhere on the mountain, is one even white (with a little blue in
// its shadows), so a field of it reads as a field and not as a grid of tiles.
// Its details are few and deliberate: a soft drift now and then, a glint, the
// tracks of something small. Where it meets a path, a lane or the ice it
// banks up in a clean lip along the edge (drawBank), and the lip's ups and
// downs are laid in world coordinates so they run on from tile to tile.
const SNOW_BASE = '#edf2f9';
const SNOW_LIGHT = '#f7fafd';
const SNOW_SHADE = '#dde5f0';
const SNOW_HOLLOW = '#e4eaf4';
const PATH_BASE = '#d9e1ed';
const isSnowGround = (c) => c === 'n' || c === 'A';

// A little drift: a lit crest with a blue hollow under it, `w` wide.
function drawDrift(ctx, x, y, w) {
  px(ctx, SNOW_LIGHT, x + 1, y, w - 2, 1);
  px(ctx, SNOW_SHADE, x, y + 1, w, 1);
  px(ctx, SNOW_HOLLOW, x + 2, y + 2, w - 4, 1);
}

// Snow banked along one edge of a tile, `color` on top and a soft `shadow`
// where it gives way. The bank is 1 or 2 pixels deep in steps of 4 pixels,
// chosen by where the step is in the world, so neighbouring tiles agree.
// side: 'top', 'bottom', 'left' or 'right'.
function drawBank(ctx, x, y, tx, ty, side, color, shadow) {
  const across = side === 'top' || side === 'bottom';
  for (let i = 0; i < T; i += 4) {
    const along = (across ? tx : ty) * T + i;
    const edge = across ? ty * 2 + (side === 'bottom') : tx * 2 + (side === 'right');
    const depth = hash(Math.floor(along / 4), edge, 335) < 0.45 ? 2 : 1;
    if (side === 'top') { px(ctx, color, x + i, y, 4, depth); px(ctx, shadow, x + i, y + depth, 4, 1); }
    if (side === 'bottom') { px(ctx, shadow, x + i, y + T - depth - 1, 4, 1); px(ctx, color, x + i, y + T - depth, 4, depth); }
    if (side === 'left') { px(ctx, color, x, y + i, depth, 4); px(ctx, shadow, x + depth, y + i, 1, 4); }
    if (side === 'right') { px(ctx, shadow, x + T - depth - 1, y + i, 1, 4); px(ctx, color, x + T - depth, y + i, depth, 4); }
  }
}

// Banks on every side of a tile where `bankOf` names a colour for the ground
// next door (or null for none). Where two banks meet at an outside corner, the
// corner fills in round; where the ground only touches at a corner, a little
// heap sits in it.
function drawBanks(ctx, x, y, tx, ty, room, bankOf, shadow) {
  if (!room) return;
  const at = (dx, dy) => bankOf(room.tileAt(tx + dx, ty + dy));
  const top = at(0, -1);
  const bottom = at(0, 1);
  const left = at(-1, 0);
  const right = at(1, 0);
  if (top) drawBank(ctx, x, y, tx, ty, 'top', top, shadow);
  if (bottom) drawBank(ctx, x, y, tx, ty, 'bottom', bottom, shadow);
  if (left) drawBank(ctx, x, y, tx, ty, 'left', left, shadow);
  if (right) drawBank(ctx, x, y, tx, ty, 'right', right, shadow);
  const corner = (cx, cy, color, sx, sy) => { px(ctx, color, x + cx, y + cy, 3, 3); px(ctx, shadow, x + sx, y + sy, 1, 1); };
  if (top && left) corner(0, 0, top, 3, 3);
  if (top && right) corner(T - 3, 0, top, T - 4, 3);
  if (bottom && left) corner(0, T - 3, bottom, 3, T - 4);
  if (bottom && right) corner(T - 3, T - 3, bottom, T - 4, T - 4);
  // Inside corners: only the diagonal is snow.
  const heap = (cx, cy, color, sx, sy) => { px(ctx, color, x + cx, y + cy, 2, 2); px(ctx, shadow, x + sx, y + sy, 1, 1); };
  if (!top && !left && at(-1, -1)) heap(0, 0, at(-1, -1), 2, 1);
  if (!top && !right && at(1, -1)) heap(T - 2, 0, at(1, -1), T - 3, 1);
  if (!bottom && !left && at(-1, 1)) heap(0, T - 2, at(-1, 1), 2, T - 2);
  if (!bottom && !right && at(1, 1)) heap(T - 2, T - 2, at(1, 1), T - 3, T - 2);
}

// The blue shade a cliff or wall casts on the ground at its foot.
function drawFootShade(ctx, x, y, tx, ty, room, strength = 1) {
  const above = room?.tileAt(tx, ty - 1);
  if (above === null || above === undefined || !TILES[above]?.solid || above === '_' || above === 'f') return;
  ctx.fillStyle = `rgba(60, 80, 130, ${(0.26 * strength).toFixed(3)})`;
  ctx.fillRect(x, y, T, 2);
  ctx.fillStyle = `rgba(60, 80, 130, ${(0.12 * strength).toFixed(3)})`;
  ctx.fillRect(x, y + 2, T, 2);
}

// Fresh snow.
function drawSnow(ctx, x, y, tx, ty, room) {
  px(ctx, SNOW_BASE, x, y, T, T);
  const roll = hash(tx, ty, 202);
  if (roll < 0.18) {
    drawDrift(ctx, x + 2 + Math.floor(hash(tx, ty, 203) * 5), y + 3 + Math.floor(hash(tx, ty, 204) * 9), 6 + Math.floor(hash(tx, ty, 205) * 4));
  } else if (roll < 0.22) {
    // Bird tracks, a little trail of arrows.
    const bx = x + 3 + Math.floor(hash(tx, ty, 219) * 6);
    const by = y + 4 + Math.floor(hash(tx, ty, 220) * 7);
    for (let i = 0; i < 3; i++) { px(ctx, '#c6d1e2', bx + i * 3, by + (i % 2) * 2, 1, 1); px(ctx, '#c6d1e2', bx + i * 3 - 1, by + (i % 2) * 2 + 1, 3, 1); }
  }
  // A glint where the light catches a crystal.
  if (hash(tx, ty, 212) < 0.12) px(ctx, '#ffffff', x + 2 + Math.floor(hash(tx, ty, 214) * 12), y + 2 + Math.floor(hash(tx, ty, 216) * 12));
  drawFootShade(ctx, x, y, tx, ty, room);
}

// Snow trodden into a path: packed a little greyer, a boot print here and
// there, and fresh snow banked along its edges.
function drawSnowPath(ctx, x, y, tx, ty, room) {
  px(ctx, PATH_BASE, x, y, T, T);
  if (hash(tx, ty, 230) < 0.35) px(ctx, '#d1dae7', x + 2 + Math.floor(hash(tx, ty, 231) * 7), y + 3 + Math.floor(hash(tx, ty, 232) * 9), 6, 2);
  // Boot prints, a pair.
  if (hash(tx, ty, 250) < 0.3) {
    const bx = x + 3 + Math.floor(hash(tx, ty, 251) * 6);
    const by = y + 2 + Math.floor(hash(tx, ty, 252) * 7);
    px(ctx, '#c3cddd', bx, by, 2, 3);
    px(ctx, '#c3cddd', bx + 4, by + 3, 2, 3);
  }
  drawBanks(ctx, x, y, tx, ty, room, (c) => (c === 'n' ? SNOW_BASE : null), '#ccd6e5');
  drawFootShade(ctx, x, y, tx, ty, room);
}

// A village lane, swept down to its cobbles every morning (in case the Hero
// comes today): neat courses of rounded grey-brown stones in pale mortar, and
// fresh snow banked in a clean lip wherever it meets unswept ground. Darker
// than the snow round it, so the way to every door reads at a glance. The
// stones are laid in world coordinates, so the courses run on unbroken from
// tile to tile: each is 7 by 4 pixels, its corners rounded off, lit along its
// top and shaded along its bottom, and every other course is offset by half
// a stone.
const COBBLE = ['#a69a8c', '#9f9386', '#ab9f92'];
const COBBLE_LIT = '#c2b7a9';
const COBBLE_SHADE = '#8c8177';
const MORTAR = '#807a84';
function drawSnowLane(ctx, x, y, tx, ty, room) {
  px(ctx, MORTAR, x, y, T, T);
  const left = tx * T;
  const top = ty * T;
  // A rectangle in world pixels, clipped to this tile.
  const clip = (color, wx, wy, w, h) => {
    const x0 = Math.max(wx, left);
    const y0 = Math.max(wy, top);
    const x1 = Math.min(wx + w, left + T);
    const y1 = Math.min(wy + h, top + T);
    if (x1 > x0 && y1 > y0) px(ctx, color, x + x0 - left, y + y0 - top, x1 - x0, y1 - y0);
  };
  for (let row = Math.floor(top / 5); row * 5 < top + T; row++) {
    const offset = row % 2 ? 4 : 0;
    for (let k = Math.floor((left - offset) / 8) - 1; offset + k * 8 < left + T; k++) {
      const sx = offset + k * 8;
      const sy = row * 5;
      clip(pick(COBBLE, hash(k, row, 321)), sx, sy + 1, 7, 2);
      clip(COBBLE_LIT, sx + 1, sy, 5, 1);
      clip(COBBLE_SHADE, sx + 1, sy + 3, 5, 1);
      // Now and then, a pinch of snow left in a joint.
      if (hash(k, row, 322) < 0.05) clip('#dde4ee', sx + 7, sy + 1, 1, 2);
    }
  }
  drawBanks(ctx, x, y, tx, ty, room, (c) => (isSnowGround(c) ? SNOW_BASE : c === 'i' ? PATH_BASE : null), '#b4bfcf');
  const above = room?.tileAt(tx, ty - 1);
  if (above && TILES[above]?.solid && above !== '_' && !isSnowGround(above)) {
    ctx.fillStyle = 'rgba(40, 50, 90, 0.28)';
    ctx.fillRect(x, y, T, 2);
    ctx.fillStyle = 'rgba(40, 50, 90, 0.12)';
    ctx.fillRect(x, y + 2, T, 2);
  }
}

// Ice over a frozen pool: one clear pale blue, with long streaks of shine
// running diagonally across it (laid in world coordinates, so they cross from
// tile to tile), the odd crack, and a bank of snow round its edge.
const ICE = '#c3e3f1';
function drawIce(ctx, x, y, tx, ty, room) {
  px(ctx, ICE, x, y, T, T);
  for (let r = 0; r < T; r++) {
    const wy = ty * T + r;
    for (let c = 0; c < T; c++) {
      const d = tx * T + c + wy;
      if (d % 29 !== 0) continue;
      // The streak shows in some stretches and not others.
      const line = Math.floor(d / 29);
      if (hash(line, Math.floor(wy / 10), 302) < 0.55) {
        px(ctx, '#e2f3fa', x + c, y + r, 1, 1);
        if (c + 1 < T) px(ctx, '#d4ecf6', x + c + 1, y + r, 1, 1);
      }
    }
  }
  // A crack wandering across.
  if (hash(tx, ty, 267) < 0.12) {
    let cx = 2 + Math.floor(hash(tx, ty, 268) * 11);
    for (let cy = 2; cy < T - 2; cy++) {
      px(ctx, '#9ec7dc', x + cx, y + cy);
      if (hash(tx, ty, 270 + cy) < 0.35) cx = Math.max(1, Math.min(14, cx + (hash(tx, ty, 290 + cy) < 0.5 ? -1 : 1)));
    }
  }
  if (hash(tx, ty, 269) < 0.1) px(ctx, '#ffffff', x + 4 + Math.floor(hash(tx, ty, 300) * 8), y + 4 + Math.floor(hash(tx, ty, 301) * 8), 1, 1);
  // A snowy bank where the ice meets snow or a path.
  drawBanks(ctx, x, y, tx, ty, room, (c) => (isSnowGround(c) ? SNOW_BASE : c === 'i' ? PATH_BASE : c === 'l' ? SNOW_BASE : null), '#a7cde1');
}

// A plank bridge slung across a gap: boards with daylight between them, rope
// rails along any edge that hangs over the drop, and snow on the boards.
function drawBridge(ctx, x, y, tx, ty, room) {
  for (let row = 0; row < 4; row++) {
    const py = y + row * 4;
    px(ctx, row % 2 ? '#9a6436' : '#a86f3c', x, py, T, 3);
    px(ctx, '#c08a4e', x, py, T, 1);
    px(ctx, 'rgba(10, 6, 20, 0.6)', x, py + 3, T, 1);
    if (hash(tx, ty * 4 + row, 310) < 0.5) px(ctx, '#eef3fa', x + Math.floor(hash(tx, ty * 4 + row, 311) * 10), py + 1, 3 + Math.floor(hash(tx, ty * 4 + row, 312) * 4), 1);
  }
  if (!room) return;
  const open = (dx, dy) => room.tileAt(tx + dx, ty + dy) === '_';
  const rope = (ry) => { px(ctx, '#3a2410', x, ry, T, 1); px(ctx, '#d8b070', x, ry + 1, T, 1); };
  if (open(0, -1)) { rope(y); if (room.tileAt(tx - 1, ty) !== 'g') px(ctx, '#5a3a1e', x, y - 2, 2, 6); if (room.tileAt(tx + 1, ty) !== 'g') px(ctx, '#5a3a1e', x + T - 2, y - 2, 2, 6); }
  if (open(0, 1)) { rope(y + T - 2); if (room.tileAt(tx - 1, ty) !== 'g') px(ctx, '#5a3a1e', x, y + T - 5, 2, 5); if (room.tileAt(tx + 1, ty) !== 'g') px(ctx, '#5a3a1e', x + T - 2, y + T - 5, 2, 5); }
}

// The top of a snowy cliff, seen from above: deep snow over rock, a shade
// darker than the snow you walk on, with a clean rim where it drops away and
// now and then a rock showing through.
function drawSnowCliffTop(ctx, x, y, tx, ty, room) {
  px(ctx, '#e2e9f3', x, y, T, T);
  const roll = hash(tx, ty, 320);
  if (roll < 0.05) {
    const rx = x + 3 + Math.floor(hash(tx, ty, 321) * 8);
    const ry = y + 4 + Math.floor(hash(tx, ty, 322) * 7);
    px(ctx, '#9a95a6', rx, ry + 1, 4, 1);
    px(ctx, '#7e7890', rx + 1, ry + 2, 3, 1);
    px(ctx, '#f4f7fb', rx, ry, 4, 1);
  } else if (roll < 0.26) {
    drawDrift(ctx, x + 2 + Math.floor(hash(tx, ty, 323) * 5), y + 3 + Math.floor(hash(tx, ty, 324) * 9), 6 + Math.floor(hash(tx, ty, 325) * 3));
  }
  if (!room) return;
  if (!isCliff(room.tileAt(tx, ty + 1) ?? 'A')) px(ctx, '#8c9bb0', x, y + T - 1, T, 1);
  // A soft rim on any side that looks down onto open ground.
  const open = (c) => c !== null && !TILES[c]?.solid;
  if (open(room.tileAt(tx - 1, ty))) px(ctx, '#ccd6e4', x, y, 1, T);
  if (open(room.tileAt(tx + 1, ty))) px(ctx, '#ccd6e4', x + T - 1, y, 1, T);
  if (open(room.tileAt(tx, ty - 1))) px(ctx, '#f6f9fc', x, y, T, 1);
}

// A cliff face high on the mountain: colder rock, veined with ice. The rock
// lies in layers that run the whole way along the face (each layer's stone is
// picked by its height, not by the tile), so a long wall reads as strata and
// not as a patchwork of tiles.
const ICE_ROCK = ['#6f7a94', '#78849e', '#66718a', '#737e98'];
function drawIceCliffFace(ctx, x, y, tx, ty, room) {
  for (let band = 0; band < 4; band++) {
    px(ctx, pick(ICE_ROCK, hash(7, ty * 4 + band, 350)), x, y + band * 4, T, 4);
    if (hash(tx, ty * 4 + band, 351) < 0.5) px(ctx, '#8a96b0', x + Math.floor(hash(tx, ty * 4 + band, 352) * 6), y + band * 4, 6 + Math.floor(hash(tx, ty * 4 + band, 353) * 8), 1);
  }
  if (hash(tx, ty, 353) < 0.3) {
    const cx = x + 2 + Math.floor(hash(tx, ty, 354) * 11);
    px(ctx, '#4f566e', cx, y + 2, 1, 5);
    px(ctx, '#4f566e', cx + 1, y + 7, 1, 4);
  }
  // A streak of ice running down the rock.
  if (hash(tx, ty, 355) < 0.25) {
    const ix = x + 1 + Math.floor(hash(tx, ty, 356) * 13);
    px(ctx, '#cfe6f5', ix, y, 1, T);
    px(ctx, '#ffffff', ix, y + Math.floor(hash(tx, ty, 357) * 10), 1, 3);
  }
  if (!room) return;
  if (isSnowTop(room.tileAt(tx, ty - 1)) || room.tileAt(tx, ty - 1) === 'm') drawSnowLip(ctx, x, y, tx, ty);
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && below !== '_' && !isCliff(below)) {
    // The foot of the face, with snow drifted against it.
    px(ctx, '#4c536a', x, y + T - 3, T, 1);
    px(ctx, '#5a6178', x, y + T - 2, T, 2);
    if (SNOW_FLOORS.has(below)) {
      for (let i = 0; i < T; i += 4) {
        const depth = hash(Math.floor((tx * T + i) / 4), ty, 358) < 0.45 ? 3 : 2;
        px(ctx, SNOW_BASE, x + i, y + T - depth, 4, depth);
      }
    }
  }
}

// A pine under snow: the same tree, each tier capped in white.
function drawSnowPine(ctx, x, y) {
  drawStandingShadow(ctx, x, y);
  ctx.fillStyle = '#3a2416';
  ctx.fillRect(x + 6, y + 4, 4, 11);
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(x + 7, y + 4, 2, 11);
  const tiers = [[-30, 6, 12], [-21, 10, 14], [-10, 14, 14]];
  for (const [top, width, height] of tiers) {
    for (let row = 0; row < height; row++) {
      const w = Math.round(2 + ((width - 2) * row) / (height - 1));
      const left = x + 8 - Math.floor(w / 2);
      ctx.fillStyle = '#14281a';
      ctx.fillRect(left - 1, y + top + row, w + 2, 1);
      ctx.fillStyle = row < 3 ? '#eef3fa' : row < 4 ? '#cfdcee' : '#2f5a35';
      ctx.fillRect(left, y + top + row, w, 1);
      if (row >= 4) {
        ctx.fillStyle = '#3d7043';
        ctx.fillRect(left, y + top + row, Math.ceil(w / 3), 1);
        ctx.fillStyle = '#244a2b';
        ctx.fillRect(left + w - Math.ceil(w / 4), y + top + row, Math.ceil(w / 4), 1);
      }
      // Snow caught on the branch ends.
      if (row === height - 1) { ctx.fillStyle = '#eef3fa'; ctx.fillRect(left, y + top + row, 2, 1); ctx.fillRect(left + w - 3, y + top + row, 3, 1); }
    }
  }
  // Snow on the ground at its foot.
  ctx.fillStyle = '#eef3fa';
  ctx.fillRect(x + 3, y + 13, 3, 1);
  ctx.fillRect(x + 10, y + 14, 4, 1);
}

// --- The Pinefall (Chapter 3): an autumn forest under the clouds, gone
// scarlet. Dark leaf litter underfoot, pale paths that glow against it, red
// trees, and bramble hedges for walls. ---
const LITTER = ['#2a1420', '#2e1622', '#26121e', '#30182a'];
const LEAVES = ['#c0283a', '#e0483e', '#ff7a4a', '#8a1a2e', '#f0a040'];

// Dark forest floor, thick with fallen red leaves. Kept quiet (a few muted
// leaves a tile, close in value to the ground) so a whole screen of it is
// easy on the eyes and the scarlet trees stand out against it.
const LITTER_LEAVES = ['#5e1a28', '#6a2030', '#74282c', '#5a1e30'];
// Below the Long Drop the leaves have rotted down into dark loam: browner,
// fewer red leaves, more roots, and pale mushrooms coming up through it.
const LOAM = ['#261a1e', '#2a1c20', '#22171b', '#2c1e24'];
const LOAM_LEAVES = ['#4a1a24', '#52202a', '#3e1820', '#48202c'];
const isHushwood = (room) => room?.area === 'hushwood';
function drawLeafLitter(ctx, x, y, tx, ty, room) {
  const loam = isHushwood(room);
  const ground = loam ? LOAM : LITTER;
  const leaves = loam ? LOAM_LEAVES : LITTER_LEAVES;
  px(ctx, pick(ground, hash(tx, ty, 141)), x, y, T, T);
  // Other tones mottled in, soft-edged, so no squares show across the floor.
  mottle(ctx, pick(ground, hash(tx, ty, 143)), x, y, tx, ty, 144, 7);
  if (hash(tx, ty, 142) < 0.6) mottle(ctx, pick(ground, hash(tx, ty, 147)), x, y, tx, ty, 148, 4);
  // A root breaking the surface, running across the tile.
  if (hash(tx, ty, 185) < (loam ? 0.14 : 0.07)) {
    const ry = y + 3 + Math.floor(hash(tx, ty, 186) * 9);
    const bend = hash(tx, ty, 187) < 0.5 ? 1 : -1;
    px(ctx, '#3e2a2e', x, ry + 1, 8, 1);
    px(ctx, '#3e2a2e', x + 7, ry + 1 + bend, 9, 1);
    px(ctx, '#5a3e40', x + 1, ry, 6, 1);
    px(ctx, '#5a3e40', x + 8, ry + bend, 7, 1);
  }
  // Leaves, lying every way: flat, on edge, and curled.
  for (let i = 0; i < 4; i++) {
    const lx = x + Math.floor(hash(tx, ty, 150 + i) * 14);
    const ly = y + Math.floor(hash(tx, ty, 160 + i) * 14);
    const c = pick(leaves, hash(tx, ty, 170 + i));
    const shape = hash(tx, ty, 190 + i);
    if (shape < 0.5) px(ctx, c, lx, ly, 2, 1);
    else if (shape < 0.75) px(ctx, c, lx, ly, 1, 2);
    else { px(ctx, c, lx, ly, 2, 1); px(ctx, c, lx + 1, ly + 1, 1, 1); }
  }
  // A twig.
  if (hash(tx, ty, 198) < 0.1) {
    const wx = x + 1 + Math.floor(hash(tx, ty, 199) * 10);
    const wy = y + 1 + Math.floor(hash(tx, ty, 200) * 13);
    px(ctx, '#4a2e28', wx, wy, 5, 1);
    px(ctx, '#4a2e28', wx + 3, wy - 1, 1, 1);
  }
  // Now and then one brighter leaf, fallen recently.
  if (hash(tx, ty, 176) < (loam ? 0.08 : 0.18)) px(ctx, '#a8323a', x + Math.floor(hash(tx, ty, 177) * 14), y + Math.floor(hash(tx, ty, 175) * 15), 2, 1);
  // Now and then a pale toadstool (a clump of them, in the loam).
  if (hash(tx, ty, 178) < (loam ? 0.08 : 0.05)) {
    const mx = x + 4 + Math.floor(hash(tx, ty, 179) * 8);
    const my = y + 5 + Math.floor(hash(tx, ty, 180) * 7);
    px(ctx, '#d8ccb0', mx, my + 1, 1, 2);
    px(ctx, loam ? '#e0d8c0' : '#c84a4a', mx - 1, my, 3, 1);
    if (loam) {
      px(ctx, '#b8ac90', mx + 3, my + 2, 1, 1);
      px(ctx, '#d8ccb0', mx + 2, my + 1, 3, 1);
    }
  }
}

// A pale path through the leaves, softly lit, with a few leaves blown across it.
function drawLeafPath(ctx, x, y, tx, ty, room) {
  px(ctx, '#c8a888', x, y, T, T);
  // Worn a little lighter and darker in patches, with pebbles trodden in.
  mottle(ctx, hash(tx, ty, 201) < 0.5 ? '#d0b090' : '#bfa080', x, y, tx, ty, 202, 6);
  for (let i = 0; i < 6; i++) {
    px(ctx, i % 2 ? '#dcc0a0' : '#b08e70', x + Math.floor(hash(tx, ty, 181 + i) * 15), y + Math.floor(hash(tx, ty, 187 + i) * 15), i % 2 ? 2 : 1, 1);
  }
  if (hash(tx, ty, 205) < 0.3) {
    const sx = x + 2 + Math.floor(hash(tx, ty, 206) * 11);
    const sy = y + 2 + Math.floor(hash(tx, ty, 207) * 11);
    px(ctx, '#9a7e64', sx, sy + 1, 3, 1);
    px(ctx, '#e8d4b8', sx, sy, 2, 1);
  }
  if (hash(tx, ty, 193) < 0.25) px(ctx, pick(isHushwood(room) ? LOAM_LEAVES : LITTER_LEAVES, hash(tx, ty, 194)), x + Math.floor(hash(tx, ty, 195) * 13), y + Math.floor(hash(tx, ty, 196) * 14), 2, 1);
  // Where it meets the litter, the edge frays into dark leaves.
  const litter = (dx, dy) => room && room.tileAt(tx + dx, ty + dy) === 'd';
  const edge = isHushwood(room) ? '#32201e' : '#3a1a26';
  for (let i = 0; i < T; i += 2) {
    const fray = hash(tx * 3 + i, ty, 197) < 0.6 ? 1 : 2;
    if (litter(0, -1)) px(ctx, edge, x + i, y, 2, fray);
    if (litter(0, 1)) px(ctx, edge, x + i, y + T - fray, 2, fray);
    if (litter(-1, 0)) px(ctx, edge, x, y + i, fray, 2);
    if (litter(1, 0)) px(ctx, edge, x + T - fray, y + i, fray, 2);
  }
}

// A tall tree in full autumn: a dark trunk and a round crown of scarlet,
// lit on one side, with a few leaves always falling.
function drawScarletTree(ctx, x, y, tx = 0, ty = 0) {
  drawStandingShadow(ctx, x, y);
  ctx.fillStyle = '#1e0f14';
  ctx.fillRect(x + 6, y - 2, 4, 17);
  ctx.fillStyle = '#3a1e22';
  ctx.fillRect(x + 7, y - 2, 2, 17);
  // The crown: overlapping rounds, darkest underneath, brightest on top.
  const blobs = [[8, -14, 9], [3, -20, 6], [13, -20, 6], [8, -25, 7], [4, -10, 5], [12, -10, 5]];
  for (const [cx, cy, r] of blobs) {
    for (let dy = -r; dy <= r; dy++) {
      const w = Math.round(Math.sqrt(r * r - dy * dy));
      px(ctx, '#4a0c1a', x + cx - w - 1, y + cy + dy, 2 * w + 2, 1);
    }
  }
  for (const [cx, cy, r] of blobs) {
    for (let dy = -r + 1; dy <= r - 1; dy++) {
      const w = Math.round(Math.sqrt((r - 1) * (r - 1) - dy * dy));
      const shade = dy > r / 3 ? '#8a1426' : dy < -r / 3 ? '#e0383e' : '#b81e30';
      px(ctx, shade, x + cx - w, y + cy + dy, 2 * w, 1);
    }
  }
  // Light catching the top-left of the crown.
  for (let i = 0; i < 9; i++) {
    px(ctx, i % 3 ? '#ff6a4a' : '#ffb070', x + 2 + Math.floor(hash(tx, ty, 200 + i) * 9), y - 30 + Math.floor(hash(tx, ty, 210 + i) * 14), 1, 1);
  }
  // A couple of leaves on their way down.
  px(ctx, '#ff7a4a', x + 1 + Math.floor(hash(tx, ty, 220) * 14), y - 4 + Math.floor(hash(tx, ty, 221) * 8), 2, 1);
  px(ctx, '#f0a040', x + 1 + Math.floor(hash(tx, ty, 222) * 14), y + 2 + Math.floor(hash(tx, ty, 223) * 6), 1, 1);
}

// A false scarlet tree: just the same as the real ones, except you can walk
// straight through it, and up in its crown, if you look, one leaf has a
// pale blue glint to it that isn't any colour of autumn (the way to the
// Starfall Glade).
function drawFalseTree(ctx, x, y, tx = 0, ty = 0) {
  drawScarletTree(ctx, x, y, tx, ty);
  px(ctx, '#9ad8ff', x + 10, y - 21, 3, 1);
  px(ctx, '#9ad8ff', x + 11, y - 22, 1, 3);
  px(ctx, '#e8f6ff', x + 11, y - 21, 1, 1);
}

// A bramble hedge: a solid tangle of dark thorny stems, red berries in it.
function drawBramble(ctx, x, y, tx, ty, room) {
  drawBaseFloor(ctx, x, y, tx, ty, room);
  px(ctx, 'rgba(0, 0, 0, 0.35)', x, y + 13, T, 3);
  // A dark mass of stems, a little lighter towards the top where the light gets in.
  px(ctx, '#1e0a12', x, y + 1, T, 13);
  px(ctx, '#3a1222', x + 1, y + 1, T - 2, 6);
  px(ctx, '#2c0e1a', x + 1, y + 7, T - 2, 6);
  // Thorny stems looping through it.
  for (let i = 0; i < 6; i++) {
    const sx = x + 1 + Math.floor(hash(tx, ty, 230 + i) * 12);
    const sy = y + 2 + Math.floor(hash(tx, ty, 240 + i) * 10);
    px(ctx, '#6a2438', sx, sy, 4, 1);
    px(ctx, '#8a3448', sx + 1, sy - 1, 2, 1);
    px(ctx, '#d8c0a8', sx + 3, sy - 1, 1, 1);
  }
  // Leaves, the same reds as the trees.
  for (let i = 0; i < 6; i++) {
    px(ctx, i % 2 ? '#a01e30' : '#c8303c', x + 1 + Math.floor(hash(tx, ty, 262 + i) * 13), y + 1 + Math.floor(hash(tx, ty, 268 + i) * 8), 2, 1);
  }
  // Bright berries.
  for (let i = 0; i < 3; i++) {
    const bx = x + 2 + Math.floor(hash(tx, ty, 250 + i) * 11);
    const by = y + 3 + Math.floor(hash(tx, ty, 255 + i) * 8);
    px(ctx, '#ff4a5a', bx, by, 2, 2);
    px(ctx, '#ffb0b0', bx, by, 1, 1);
  }
  // A ragged top edge, so it reads as a hedge and not a wall.
  for (let i = 0; i < T; i += 3) px(ctx, '#3a1222', x + i, y + (hash(tx * 5 + i, ty, 260) < 0.5 ? 0 : 1), 2, 1);
}

// --- The Hushwood (Chapter 3): the old wood below the Long Drop, and Hollin. ---

// A bramble so thin and old you can push straight through it: it looks like
// the rest of the hedge, nearly. Its top is a little more ragged and there's
// a darker gap at its foot, for anyone looking closely. (A secret way.)
function drawThinBramble(ctx, x, y, tx, ty, room) {
  drawBramble(ctx, x, y, tx, ty, room);
  px(ctx, '#12060c', x + 5, y + 9, 6, 4);
  px(ctx, '#2c0e1a', x + 6, y + 8, 4, 1);
  for (let i = 1; i < T; i += 4) px(ctx, '#1e0a12', x + i, y, 1, 2);
}

// A dry stone channel, where water ran once (or will, if the sluices send
// it): mossy slabs in a sunken bed, darker at the edges, a little damp.
function drawDryChannel(ctx, x, y, tx, ty, room) {
  if (isDrains(room)) return drawDrainGutter(ctx, x, y, tx, ty, room);
  px(ctx, '#3a3440', x, y, T, T);
  for (let i = 0; i < 4; i++) {
    const sx = x + (i % 2) * 8 + (ty % 2 ? 2 : 0);
    const sy = y + Math.floor(i / 2) * 8;
    px(ctx, hash(tx * 2 + (i % 2), ty * 2 + Math.floor(i / 2), 610) < 0.5 ? '#4a4452' : '#443e4c', sx, sy, 7, 7);
    px(ctx, '#56505e', sx, sy, 7, 1);
  }
  if (hash(tx, ty, 611) < 0.4) px(ctx, '#3e5a3a', x + Math.floor(hash(tx, ty, 612) * 12), y + Math.floor(hash(tx, ty, 613) * 12), 3, 2);
  if (hash(tx, ty, 614) < 0.3) px(ctx, '#2a3048', x + 3 + Math.floor(hash(tx, ty, 615) * 8), y + 10, 4, 2);
  if (!room) return;
  // The channel's banks, where it meets the ground either side.
  const bank = (c) => c !== 'j' && c !== '~' && c !== null;
  if (bank(room.tileAt(tx - 1, ty))) px(ctx, '#1e1824', x, y, 2, T);
  if (bank(room.tileAt(tx + 1, ty))) px(ctx, '#1e1824', x + T - 2, y, 2, T);
  if (bank(room.tileAt(tx, ty - 1))) { px(ctx, '#1e1824', x, y, T, 2); px(ctx, '#5e5868', x, y + 2, T, 1); }
}

// Hollin's cobbles: rounded grey stones, worn smooth, with weeds and fallen
// red leaves in the cracks. Nobody's swept them in fifty years.
// The stones come in a few sizes, laid as they came to hand: one of these
// layouts a tile (each a list of [x, y, w, h], leaving the tile's last row
// and column as grout, so the joints run on into the next tile).
const COBBLE_LAYOUTS = [
  [[0, 0, 5, 4], [6, 0, 4, 4], [11, 0, 4, 4], [0, 5, 4, 5], [5, 5, 6, 5], [12, 5, 3, 5], [0, 11, 6, 4], [7, 11, 4, 4], [12, 11, 3, 4]],
  [[0, 0, 4, 5], [5, 0, 6, 5], [12, 0, 3, 5], [0, 6, 6, 4], [7, 6, 4, 4], [12, 6, 3, 4], [0, 11, 5, 4], [6, 11, 5, 4], [12, 11, 3, 4]],
  [[0, 0, 6, 4], [7, 0, 3, 4], [11, 0, 4, 4], [0, 5, 3, 6], [4, 5, 5, 6], [10, 5, 5, 6], [0, 12, 5, 3], [6, 12, 6, 3], [13, 12, 2, 3]],
  [[0, 0, 3, 4], [4, 0, 5, 4], [10, 0, 5, 4], [0, 5, 5, 5], [6, 5, 4, 5], [11, 5, 4, 5], [0, 11, 4, 4], [5, 11, 6, 4], [12, 11, 3, 4]],
];
const HOLLIN_COBBLE = ['#6a6270', '#5e5664', '#726a78', '#66606c', '#746c7a'];
function drawCobbles(ctx, x, y, tx, ty, room) {
  px(ctx, '#262028', x, y, T, T);
  const layout = pick(COBBLE_LAYOUTS, hash(tx, ty, 619));
  layout.forEach(([sx, sy, w, h], i) => {
    const roll = hash(tx, ty, 620 + i);
    px(ctx, pick(HOLLIN_COBBLE, roll), x + sx, y + sy, w, h);
    // Each stone's rounded: light along its top and left, shadow under it.
    px(ctx, '#867e8c', x + sx, y + sy, w - 1, 1);
    px(ctx, '#7e7684', x + sx, y + sy, 1, h - 1);
    px(ctx, '#4a444e', x + sx + 1, y + sy + h - 1, w - 1, 1);
    px(ctx, '#4a444e', x + sx + w - 1, y + sy + 1, 1, h - 1);
    // A worn hollow, or a stone gone (mud in its place).
    if (roll < 0.08) px(ctx, '#56505c', x + sx + 1, y + sy + 1, Math.max(1, w - 2), Math.max(1, h - 2));
    else if (roll > 0.96) px(ctx, '#3a3028', x + sx, y + sy, w, h);
  });
  // Weeds in the joints, and water standing in a hollow.
  if (hash(tx, ty, 625) < 0.3) {
    const wx = x + Math.floor(hash(tx, ty, 626) * 14);
    const wy = y + 3 + Math.floor(hash(tx, ty, 627) * 11);
    px(ctx, '#3e5a3a', wx, wy, 1, 2);
    px(ctx, '#5a7a4a', wx + 1, wy - 1, 1, 2);
  }
  if (hash(tx, ty, 634) < 0.08) {
    const pxx = x + 3 + Math.floor(hash(tx, ty, 635) * 8);
    const pyy = y + 4 + Math.floor(hash(tx, ty, 636) * 8);
    px(ctx, '#2a3040', pxx, pyy, 5, 2);
    px(ctx, '#5a6a80', pxx + 1, pyy, 2, 1);
  }
  // Fallen red leaves, where the wood's trees reach over (Hollin, not Lasthome).
  if (room?.leafy) {
    if (hash(tx, ty, 621) < 0.3) px(ctx, pick(LITTER_LEAVES, hash(tx, ty, 622)), x + Math.floor(hash(tx, ty, 623) * 13), y + Math.floor(hash(tx, ty, 624) * 13), 2, 1);
    // Leaves drifted along the edge where the cobbles meet the litter.
    const litter = (dx, dy) => room.tileAt(tx + dx, ty + dy) === 'd';
    for (let i = 0; i < T; i += 3) {
      if (hash(tx * 3 + i, ty, 637) > 0.55) continue;
      const c = pick(LITTER_LEAVES, hash(tx * 5 + i, ty, 638));
      if (litter(0, -1)) px(ctx, c, x + i, y, 2, 1);
      if (litter(0, 1)) px(ctx, c, x + i, y + T - 1, 2, 1);
      if (litter(-1, 0)) px(ctx, c, x, y + i, 1, 2);
      if (litter(1, 0)) px(ctx, c, x + T - 1, y + i, 1, 2);
    }
  }
}

// A Hollin cottage's wall: grey fieldstone below, dark timbers and pale old
// plaster above, all of it gone green at the foot.
const isCottage = (c) => c === '5' || c === '6' || c === '8';
function drawCottageWall(ctx, x, y, tx, ty, room) {
  px(ctx, '#bdb2a0', x, y, T, 9);
  px(ctx, '#a89c8a', x, y + 6, T, 3);
  px(ctx, '#3a2418', x, y, T, 1);
  px(ctx, '#3a2418', x, y + 8, T, 1);
  if ((tx % 3) === 0) px(ctx, '#3a2418', x + 7, y, 2, 9);
  if (hash(tx, ty, 630) < 0.4) px(ctx, '#9a8e7c', x + 2 + Math.floor(hash(tx, ty, 631) * 10), y + 2, 3, 2);
  for (let i = 0; i < 3; i++) {
    px(ctx, i % 2 ? '#6a6270' : '#5e5664', x + i * 6 - (ty % 2 ? 2 : 0), y + 9, 6, 3);
    px(ctx, i % 2 ? '#5e5664' : '#6a6270', x + i * 6 - (ty % 2 ? 0 : 3), y + 12, 6, 4);
  }
  px(ctx, '#2e2830', x, y + 12, T, 1);
  px(ctx, '#3e5a3a', x, y + T - 2, T, 2);
  if (!room) return;
  if (!isCottage(room.tileAt(tx - 1, ty))) px(ctx, '#2a1810', x, y, 2, T);
  if (!isCottage(room.tileAt(tx + 1, ty))) px(ctx, '#2a1810', x + T - 2, y, 2, T);
}

// The same wall with a window, boarded up when they left.
function drawCottageWindow(ctx, x, y, tx, ty, room) {
  drawCottageWall(ctx, x, y, tx, ty, room);
  px(ctx, '#120c14', x + 3, y + 1, 10, 9);
  px(ctx, '#7a5a3a', x + 2, y + 2, 12, 2);
  px(ctx, '#6b4c30', x + 2, y + 6, 12, 2);
  px(ctx, '#9a7a52', x + 2, y + 2, 12, 1);
  px(ctx, '#c8c0b0', x + 4, y + 3, 1, 1);
  px(ctx, '#c8c0b0', x + 11, y + 7, 1, 1);
}

// A shut cottage door: old planks, an iron ring, and leaves drifted against it.
function drawCottageDoor(ctx, x, y, tx, ty, room) {
  drawCottageWall(ctx, x, y, tx, ty, room);
  px(ctx, '#2a1810', x + 3, y, 10, T);
  px(ctx, '#5a3a22', x + 4, y + 1, 8, T - 1);
  for (const dx of [6, 9]) px(ctx, '#4a2e1a', x + dx, y + 1, 1, T - 1);
  px(ctx, '#3a3440', x + 9, y + 8, 2, 2);
  px(ctx, '#8a8296', x + 9, y + 8, 1, 1);
  px(ctx, '#6a2030', x + 4, y + T - 2, 8, 2);
  px(ctx, '#a8323a', x + 6, y + T - 3, 2, 1);
}

// A cottage door left open: the dark of the room inside, the door swung back
// against the wall on its hinges, and a worn step.
function drawCottageDoorOpen(ctx, x, y, tx, ty, room) {
  drawCottageWall(ctx, x, y, tx, ty, room);
  px(ctx, '#2a1810', x + 3, y, 10, T);
  px(ctx, '#0c0810', x + 4, y + 1, 8, T - 1);
  px(ctx, '#1a1218', x + 4, y + 9, 8, 1);
  // The door, swung in, edge-on against the jamb.
  px(ctx, '#5a3a22', x + 4, y + 1, 2, T - 1);
  px(ctx, '#7a5434', x + 4, y + 1, 1, T - 1);
  px(ctx, '#8a8296', x + 5, y + 8, 1, 1);
  px(ctx, '#8a8296', x + 4, y + T - 2, 8, 2);
  px(ctx, '#a8a0b0', x + 4, y + T - 2, 8, 1);
}

// A cottage roof: dark slates under thick moss, with fallen leaves on it, a
// ridge on top and the eaves' shadow along the bottom.
function drawCottageRoof(ctx, x, y, tx, ty, room) {
  px(ctx, '#30303a', x, y, T, T);
  // Slates in overlapping courses, each lit along its lower edge where it
  // stands proud of the one below, a few cracked or slipped.
  for (let row = 0; row < 4; row++) {
    const offset = (row + tx) % 2 ? 3 : 0;
    for (let bx = -offset; bx < T; bx += 6) {
      const left = Math.max(0, bx);
      const width = Math.min(bx + 5, T) - left;
      if (width <= 0) continue;
      const roll = hash(tx * 3 + Math.floor((bx + offset) / 6), ty * 4 + row, 640);
      const slipped = roll > 0.9 ? 1 : 0;
      px(ctx, roll < 0.5 ? '#4a4a56' : '#44444e', x + left, y + row * 4 + slipped, width, 3);
      px(ctx, '#565664', x + left, y + row * 4 + 2 + slipped, width, 1);
      if (roll < 0.08) px(ctx, '#30303a', x + left + Math.floor(width / 2), y + row * 4 + slipped, 1, 3);
    }
  }
  for (let i = 0; i < 4; i++) {
    if (hash(tx, ty, 641 + i) < 0.55) px(ctx, i % 2 ? '#3e5a3a' : '#4a6a40', x + Math.floor(hash(tx, ty, 650 + i) * 12), y + Math.floor(hash(tx, ty, 655 + i) * 12), 4, 3);
  }
  if (hash(tx, ty, 660) < 0.5) px(ctx, pick(LITTER_LEAVES, hash(tx, ty, 661)), x + Math.floor(hash(tx, ty, 662) * 13), y + Math.floor(hash(tx, ty, 663) * 13), 2, 1);
  if (!room) return;
  if (room.tileAt(tx, ty - 1) !== '7') {
    px(ctx, '#22222a', x, y, T, 2);
    px(ctx, '#5a5a66', x, y + 2, T, 1);
  }
  if (room.tileAt(tx, ty + 1) !== '7') {
    px(ctx, '#22222a', x, y + T - 3, T, 3);
    px(ctx, '#56565e', x, y + T - 4, T, 1);
  }
  if (room.tileAt(tx - 1, ty) !== '7') px(ctx, '#22222a', x, y, 1, T);
  if (room.tileAt(tx + 1, ty) !== '7') px(ctx, '#22222a', x + T - 1, y, 1, T);
}

// A boulder with a cap of snow.
function drawSnowBoulder(ctx, x, y, tx, ty, room) {
  drawBaseFloor(ctx, x, y, tx, ty, room);
  ctx.fillStyle = 'rgba(40, 60, 110, 0.25)';
  ctx.fillRect(x + 2, y + 12, 13, 3);
  ctx.fillStyle = '#2e2a34';
  ctx.fillRect(x + 2, y + 3, 12, 11);
  ctx.fillRect(x + 1, y + 5, 14, 7);
  ctx.fillStyle = '#7a7484';
  ctx.fillRect(x + 3, y + 4, 10, 9);
  ctx.fillRect(x + 2, y + 6, 12, 5);
  ctx.fillStyle = '#9a94a4';
  ctx.fillRect(x + 4, y + 7, 3, 2);
  ctx.fillStyle = '#5a5464';
  ctx.fillRect(x + 9, y + 10, 4, 2);
  ctx.fillStyle = '#eef3fa';
  ctx.fillRect(x + 3, y + 3, 9, 2);
  ctx.fillRect(x + 2, y + 5, 3, 1);
  ctx.fillRect(x + 11, y + 5, 3, 1);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 5, y + 3, 3, 1);
}

// --- Heralds' Rest: the village's cabins. ---

// A log wall: round logs stacked up, each lit along its top and shaded under,
// with a dark seam between. Every log runs the whole length of the wall (its
// wood is picked by its height, not by the tile), so there are no seams where
// one tile meets the next, and at the building's corners the log ends show.
const LOGS = ['#9a6a3a', '#a06f3e', '#966738', '#9d6d3c'];
const isCabin = (c) => c === 'a' || c === 'w' || c === 'D';
function drawCabinWall(ctx, x, y, tx, ty, room) {
  for (let row = 0; row < 4; row++) {
    const py = y + row * 4;
    px(ctx, pick(LOGS, hash(3, ty * 4 + row, 400)), x, py, T, 4);
    px(ctx, '#b98451', x, py, T, 1);
    px(ctx, '#80542f', x, py + 2, T, 1);
    px(ctx, '#4e321b', x, py + 3, T, 1);
    // A knot, here and there.
    if (hash(tx, ty * 4 + row, 401) < 0.1) px(ctx, '#6b4423', x + 2 + Math.floor(hash(tx, ty * 4 + row, 402) * 11), py + 1, 2, 1);
  }
  if (!room) return;
  // The log ends, where the wall turns a corner.
  const end = (ex) => {
    for (let row = 0; row < 4; row++) {
      px(ctx, '#c99c68', ex, y + row * 4, 2, 3);
      px(ctx, '#9a6a3a', ex + (ex === x ? 0 : 1), y + row * 4 + 1, 1, 1);
    }
  };
  if (!isCabin(room.tileAt(tx - 1, ty))) end(x);
  if (!isCabin(room.tileAt(tx + 1, ty))) end(x + T - 2);
  // Icicles hanging off the eaves above.
  if (room.tileAt(tx, ty - 1) === 'e') {
    for (let i = 0; i < T; i++) {
      const wx = tx * T + i;
      // Icicles at most every other pixel, some long, most short.
      if (wx % 2 || hash(wx, ty, 404) > 0.3) continue;
      const length = 1 + Math.floor(hash(wx, ty, 405) ** 2 * 4);
      px(ctx, '#d6ecf7', x + i, y, 1, length);
      px(ctx, '#ffffff', x + i, y, 1, 1);
    }
    px(ctx, 'rgba(30, 16, 8, 0.35)', x, y, T, 1);
  }
  // A stone footing where it meets the ground, with snow drifted against it.
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && !TILES[below]?.solid && below !== 'D') {
    px(ctx, '#8d8699', x, y + T - 4, T, 3);
    px(ctx, '#a49db0', x, y + T - 4, T, 1);
    for (let i = 0; i < T; i++) if ((tx * T + i) % 6 === 0) px(ctx, '#6e687c', x + i, y + T - 3, 1, 2);
    px(ctx, '#5f596d', x, y + T - 1, T, 1);
    if (SNOW_FLOORS.has(below)) {
      for (let i = 0; i < T; i += 4) {
        const depth = hash(Math.floor((tx * T + i) / 4), ty, 403) < 0.4 ? 3 : 2;
        px(ctx, SNOW_BASE, x + i, y + T - depth, 4, depth);
      }
      px(ctx, SNOW_LIGHT, x, y + T - 2, T, 1);
    }
  }
}

// The same wall with a lit window: four little panes of lamplight in a dark
// frame, brighter at the top, and a sill of snow.
function drawCabinWindow(ctx, x, y, tx, ty, room) {
  drawCabinWall(ctx, x, y, tx, ty, room);
  px(ctx, '#4e321b', x + 3, y + 1, 10, 11);
  px(ctx, '#ffc65c', x + 4, y + 2, 8, 9);
  px(ctx, '#ffdb8a', x + 4, y + 2, 8, 3);
  px(ctx, '#f4ad45', x + 4, y + 9, 8, 2);
  // The frame's cross, and a glint on each upper pane.
  px(ctx, '#5a3a1e', x + 7, y + 2, 2, 9);
  px(ctx, '#5a3a1e', x + 4, y + 6, 8, 1);
  px(ctx, '#fff4cc', x + 4, y + 2, 2, 1);
  px(ctx, '#fff4cc', x + 9, y + 2, 2, 1);
  px(ctx, SNOW_LIGHT, x + 2, y + 12, 12, 1);
  px(ctx, SNOW_BASE, x + 2, y + 13, 12, 1);
  px(ctx, '#c4cfdf', x + 2, y + 14, 12, 1);
}

// A roof deep in snow: one smooth white with the odd soft lump, a dark ridge
// along the top, a gable edge either end, and the shingles showing under the
// overhang at the eaves (the icicles hang off it onto the wall below).
const ROOF_SNOW = '#e8eef7';
function drawCabinRoof(ctx, x, y, tx, ty, room) {
  px(ctx, ROOF_SNOW, x, y, T, T);
  if (hash(tx, ty, 411) < 0.22) drawDrift(ctx, x + 2 + Math.floor(hash(tx, ty, 412) * 5), y + 4 + Math.floor(hash(tx, ty, 413) * 5), 7);
  if (!room) return;
  const above = room.tileAt(tx, ty - 1);
  const below = room.tileAt(tx, ty + 1);
  // The ridge along the top.
  if (above !== 'e') {
    px(ctx, '#5a2e22', x, y, T, 1);
    px(ctx, '#8a4a34', x, y + 1, T, 1);
    px(ctx, SNOW_LIGHT, x, y + 2, T, 1);
  }
  // The eaves: the snow's rounded edge, then the shingles in its shadow.
  if (below !== 'e') {
    px(ctx, SNOW_LIGHT, x, y + T - 7, T, 1);
    px(ctx, '#d3dcea', x, y + T - 5, T, 1);
    px(ctx, '#8a4a34', x, y + T - 4, T, 1);
    px(ctx, '#6b3a2a', x, y + T - 3, T, 2);
    for (let i = 0; i < T; i++) if ((tx * T + i) % 4 === 1) px(ctx, '#55291d', x + i, y + T - 3, 1, 2);
    px(ctx, '#2e1a10', x, y + T - 1, T, 1);
  }
  // Gable ends.
  if (room.tileAt(tx - 1, ty) !== 'e') { px(ctx, '#6b3a2a', x, y, 1, T); px(ctx, '#d3dcea', x + 1, y, 1, T); }
  if (room.tileAt(tx + 1, ty) !== 'e') { px(ctx, '#6b3a2a', x + T - 1, y, 1, T); px(ctx, '#d3dcea', x + T - 2, y, 1, T); }
}

// A cabin's door, standing open: a plank frame and lintel, firelight on the
// floor inside, and a stone step. (Doorways anywhere else are the Ruins' kind.)
function drawCabinDoor(ctx, x, y, tx, ty, room) {
  px(ctx, '#20130b', x, y, T, T);
  px(ctx, '#3a2414', x + 2, y + 2, T - 4, T - 4);
  // Firelight on the boards inside.
  px(ctx, '#5a3218', x + 3, y + 8, T - 6, 2);
  px(ctx, '#7a4520', x + 3, y + 10, T - 6, 2);
  px(ctx, '#9a5a28', x + 4, y + 12, T - 8, 1);
  // The frame.
  px(ctx, '#5a3a1e', x, y, 2, T);
  px(ctx, '#5a3a1e', x + T - 2, y, 2, T);
  px(ctx, '#8a5a32', x, y, 1, T);
  px(ctx, '#4e321b', x, y, T, 2);
  px(ctx, '#8a5a32', x, y, T, 1);
  // The step.
  px(ctx, '#8d8699', x + 1, y + T - 3, T - 2, 2);
  px(ctx, '#a49db0', x + 1, y + T - 3, T - 2, 1);
  px(ctx, '#5f596d', x + 1, y + T - 1, T - 2, 1);
}

// A picket fence, every post capped with snow, the posts evenly spaced along
// the world so a long fence keeps its rhythm. Low enough to see over.
function drawFence(ctx, x, y, tx, ty, room) {
  drawBaseFloor(ctx, x, y, tx, ty, room);
  ctx.fillStyle = 'rgba(40, 60, 110, 0.18)';
  ctx.fillRect(x, y + 12, T, 2);
  const across = room && (room.tileAt(tx - 1, ty) === 'f' || room.tileAt(tx + 1, ty) === 'f');
  const down = room && (room.tileAt(tx, ty - 1) === 'f' || room.tileAt(tx, ty + 1) === 'f');
  // Down in the scarlet forest there's no snow on the posts, just the odd red leaf.
  const snow = !room?.leafy;
  if (across || !down) {
    for (const ry of [5, 9]) {
      px(ctx, '#9a643a', x, y + ry, T, 2);
      px(ctx, '#b67e48', x, y + ry, T, 1);
    }
    if (snow) px(ctx, SNOW_BASE, x, y + 4, T, 1);
    for (const fx of [3, 11]) {
      px(ctx, '#7c5030', x + fx, y + 3, 2, 10);
      px(ctx, '#b67e48', x + fx, y + 3, 1, 10);
      if (snow) {
        px(ctx, SNOW_LIGHT, x + fx - 1, y + 2, 4, 1);
        px(ctx, SNOW_BASE, x + fx - 1, y + 3, 4, 1);
      } else {
        px(ctx, '#5a3a22', x + fx, y + 2, 2, 1);
      }
    }
    if (!snow && hash(tx, ty, 700) < 0.3) px(ctx, '#a8323a', x + 6 + Math.floor(hash(tx, ty, 701) * 4), y + 4, 2, 1);
  }
  if (down && !across) {
    px(ctx, '#9a643a', x + 6, y, 2, T);
    px(ctx, '#7c5030', x + 7, y, 1, T);
    for (const fy of [2, 9]) {
      px(ctx, '#7c5030', x + 5, y + fy, 5, 2);
      if (snow) px(ctx, SNOW_LIGHT, x + 4, y + fy - 1, 7, 1);
      else px(ctx, '#b67e48', x + 5, y + fy, 5, 1);
    }
  }
}

// --- The caves inside the spire. ---

// Cave rock overhead (the dark above a cave wall), like a wall top.
function drawCaveRock(ctx, x, y, tx, ty, room) {
  if (isDrains(room)) return drawVaultDark(ctx, x, y, tx, ty, room);
  px(ctx, '#15121f', x, y, T, T);
  if (hash(tx, ty, 420) < 0.5) px(ctx, '#1c1829', x + Math.floor(hash(tx, ty, 421) * 10), y + Math.floor(hash(tx, ty, 422) * 10), 5, 4);
  if (hash(tx, ty, 423) < 0.3) px(ctx, '#201b30', x + Math.floor(hash(tx, ty, 424) * 12), y + Math.floor(hash(tx, ty, 425) * 12), 3, 2);
  if (!room) return;
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && below !== 'k') {
    px(ctx, '#3a3550', x, y + T - 3, T, 2);
    px(ctx, '#4a4466', x, y + T - 3, T, 1);
    px(ctx, '#09070f', x, y + T - 1, T, 1);
  }
  const left = room.tileAt(tx - 1, ty);
  const right = room.tileAt(tx + 1, ty);
  if (left !== null && left !== 'k' && left !== 'K') px(ctx, '#2f2a44', x, y, 1, T);
  if (right !== null && right !== 'k' && right !== 'K') px(ctx, '#2f2a44', x + T - 1, y, 1, T);
}

// A cave wall: craggy cold rock, glittering with ice in its cracks.
const CAVE_ROCK = ['#3e3a52', '#46415c', '#39354c', '#433e58'];
// The same under the Hushwood: an earth bank, roots hanging out of it.
function drawEarthWall(ctx, x, y, tx, ty, room) {
  for (let band = 0; band < 4; band++) {
    px(ctx, pick(EARTH_ROCK, hash(tx, ty * 4 + band, 430)), x, y + band * 4, T, 4);
    px(ctx, '#56423a', x + Math.floor(hash(tx, ty * 4 + band, 431) * 7), y + band * 4, 5 + Math.floor(hash(tx, ty * 4 + band, 432) * 8), 1);
  }
  for (let i = 0; i < 2; i++) {
    if (hash(tx, ty, 433 + i) < 0.55) {
      const rx = x + 2 + Math.floor(hash(tx, ty, 434 + i) * 11);
      const len = 5 + Math.floor(hash(tx, ty, 436 + i) * 9);
      px(ctx, '#7a5e48', rx, y, 1, len);
      px(ctx, '#5a4434', rx + 1, y + 2, 1, len - 2);
    }
  }
  if (!room) return;
  if (room.tileAt(tx, ty - 1) === 'k') {
    px(ctx, '#1e1612', x, y, T, 2);
    px(ctx, '#5a463a', x, y + 2, T, 1);
  }
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && below !== 'K' && below !== 'k') px(ctx, '#1e1612', x, y + T - 2, T, 2);
}
function drawCaveWall(ctx, x, y, tx, ty, room) {
  if (isDrains(room)) return drawCulvertBrick(ctx, x, y, tx, ty, room);
  if (isEarthy(room)) {
    drawEarthWall(ctx, x, y, tx, ty, room);
    return;
  }
  for (let band = 0; band < 4; band++) {
    px(ctx, pick(CAVE_ROCK, hash(tx, ty * 4 + band, 430)), x, y + band * 4, T, 4);
    px(ctx, '#56506e', x + Math.floor(hash(tx, ty * 4 + band, 431) * 7), y + band * 4, 5 + Math.floor(hash(tx, ty * 4 + band, 432) * 8), 1);
  }
  if (hash(tx, ty, 433) < 0.45) {
    const cx = x + 2 + Math.floor(hash(tx, ty, 434) * 11);
    px(ctx, '#27233a', cx, y + 1, 1, 6);
    px(ctx, '#27233a', cx + 1, y + 7, 1, 5);
  }
  if (hash(tx, ty, 435) < 0.3) px(ctx, '#9fd0e8', x + 1 + Math.floor(hash(tx, ty, 436) * 13), y + 2 + Math.floor(hash(tx, ty, 437) * 10), 1, 3);
  if (!room) return;
  if (room.tileAt(tx, ty - 1) === 'k') {
    px(ctx, '#2a2640', x, y, T, 2);
    px(ctx, '#625a86', x, y + 2, T, 1);
  }
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && below !== 'K' && below !== 'k') {
    px(ctx, '#27233a', x, y + T - 2, T, 2);
    for (let i = 0; i < 4; i++) if (hash(tx, ty, 438 + i) < 0.4) px(ctx, '#cfe6f5', x + i * 4 + 1, y + T - 3, 2, 2);
  }
}

// A false cave wall: just the same as the real thing, except you can walk
// straight through it to whatever's hidden behind (a secret). The only tell
// is a thin pale crack down it, if you look closely.
function drawFalseCaveWall(ctx, x, y, tx, ty, room) {
  if (isDrains(room)) return drawFalseCulvertBrick(ctx, x, y, tx, ty, room);
  drawCaveWall(ctx, x, y, tx, ty, room);
  px(ctx, '#6a6488', x + 7, y + 3, 1, 4);
  px(ctx, '#6a6488', x + 8, y + 7, 1, 5);
}

// A cave floor: cold flagstones of living rock, frost in the hollows.
const CAVE_FLOOR = ['#2d2a3c', '#312e41', '#2a2738', '#343047'];
// Under the Hushwood the tunnels aren't ice but earth: dark soil, roots and
// stones, no frost (the Underroot, Rummage's burrow, under Hollin's well).
const EARTH_FLOOR = ['#2a1e1c', '#2e2220', '#261a1a', '#30241e'];
const EARTH_ROCK = ['#3a2a24', '#34261f', '#40302a', '#2e221c'];
const isEarthy = (room) => room && (room.area === 'hushwood' || room.area === 'hollin');
function drawEarthFloor(ctx, x, y, tx, ty, room) {
  px(ctx, pick(EARTH_FLOOR, hash(tx, ty, 440)), x, y, T, T);
  if (hash(tx, ty, 441) < 0.6) px(ctx, pick(EARTH_FLOOR, hash(tx, ty, 442)), x + Math.floor(hash(tx, ty, 443) * 8), y + Math.floor(hash(tx, ty, 444) * 8), 8, 8);
  px(ctx, '#4a3830', x + Math.floor(hash(tx, ty, 445) * 14), y + Math.floor(hash(tx, ty, 446) * 14), 2, 1);
  // A pale root across the floor now and then, and a pebble.
  if (hash(tx, ty, 449) < 0.25) {
    const ry = y + 3 + Math.floor(hash(tx, ty, 450) * 10);
    px(ctx, '#6a5040', x, ry, T, 1);
    px(ctx, '#4e3a2e', x, ry + 1, T, 1);
  }
  if (hash(tx, ty, 452) < 0.2) px(ctx, '#5e5664', x + Math.floor(hash(tx, ty, 453) * 14), y + Math.floor(hash(tx, ty, 454) * 14), 2, 2);
  if (!room) return;
  const above = room.tileAt(tx, ty - 1);
  if (above === 'K' || above === 'k') {
    ctx.fillStyle = 'rgba(5, 3, 12, 0.6)';
    ctx.fillRect(x, y, T, 3);
    ctx.fillStyle = 'rgba(5, 3, 12, 0.3)';
    ctx.fillRect(x, y + 3, T, 2);
  }
}
function drawCaveFloor(ctx, x, y, tx, ty, room) {
  if (isDrains(room)) return drawCulvertFloor(ctx, x, y, tx, ty, room);
  if (isEarthy(room)) {
    drawEarthFloor(ctx, x, y, tx, ty, room);
    return;
  }
  px(ctx, pick(CAVE_FLOOR, hash(tx, ty, 440)), x, y, T, T);
  if (hash(tx, ty, 441) < 0.6) px(ctx, pick(CAVE_FLOOR, hash(tx, ty, 442)), x + Math.floor(hash(tx, ty, 443) * 8), y + Math.floor(hash(tx, ty, 444) * 8), 8, 8);
  px(ctx, '#3d394f', x + Math.floor(hash(tx, ty, 445) * 14), y + Math.floor(hash(tx, ty, 446) * 14), 2, 1);
  px(ctx, '#211d2e', x + Math.floor(hash(tx, ty, 447) * 14), y + Math.floor(hash(tx, ty, 448) * 14), 2, 1);
  // Frost, and the glint of wet stone.
  if (hash(tx, ty, 449) < 0.3) px(ctx, '#8fb0c8', x + Math.floor(hash(tx, ty, 450) * 11), y + Math.floor(hash(tx, ty, 451) * 12), 4, 2);
  if (hash(tx, ty, 452) < 0.2) px(ctx, '#cfe6f5', x + Math.floor(hash(tx, ty, 453) * 14), y + Math.floor(hash(tx, ty, 454) * 14), 1, 1);
  if (!room) return;
  const above = room.tileAt(tx, ty - 1);
  if (above === 'K' || above === 'k') {
    ctx.fillStyle = 'rgba(5, 3, 12, 0.6)';
    ctx.fillRect(x, y, T, 3);
    ctx.fillStyle = 'rgba(5, 3, 12, 0.3)';
    ctx.fillRect(x, y + 3, T, 2);
  }
}

// A stalactite hanging from the cave roof into this tile, its tip glazed with
// ice. Drawn with the characters, so you walk behind its point. Not solid.
function drawStalactite(ctx, x, y, tx, ty) {
  const tall = 18 + Math.floor(hash(tx, ty, 460) * 8);
  const top = y - T + 2;
  const lean = hash(tx, ty, 461) < 0.5 ? -1 : 1;
  for (let row = 0; row < tall; row++) {
    const w = Math.max(1, Math.round(9 * (1 - row / tall)));
    const left = x + 8 - Math.floor(w / 2) + (row > tall * 0.6 ? lean : 0);
    ctx.fillStyle = '#15121f';
    ctx.fillRect(left - 1, top + row, w + 2, 1);
    ctx.fillStyle = row > tall - 5 ? '#cfe6f5' : '#4a4466';
    ctx.fillRect(left, top + row, w, 1);
    if (w > 2) { ctx.fillStyle = row > tall - 5 ? '#ffffff' : '#625a86'; ctx.fillRect(left, top + row, 1, 1); }
  }
  // A drop of meltwater forming at the tip now and then.
  if (Math.floor(performance.now() / 700 + tx * 3 + ty) % 5 === 0) { ctx.fillStyle = '#9fd0e8'; ctx.fillRect(x + 8 + (lean > 0 ? 0 : -1), top + tall, 1, 2); }
}

// A stalagmite rising from the floor, as tall as you.
function drawStalagmite(ctx, x, y, tx, ty) {
  drawStandingShadow(ctx, x, y);
  const tall = 20 + Math.floor(hash(tx, ty, 470) * 6);
  for (let row = 0; row <= tall; row++) {
    const w = Math.max(1, Math.round(11 * (row / tall) ** 0.7));
    const left = x + 8 - Math.floor(w / 2);
    const py = y + 13 - tall + row;
    ctx.fillStyle = '#15121f';
    ctx.fillRect(left - 1, py, w + 2, 1);
    ctx.fillStyle = row < 4 ? '#cfe6f5' : '#4a4466';
    ctx.fillRect(left, py, w, 1);
    ctx.fillStyle = row < 4 ? '#ffffff' : '#625a86';
    ctx.fillRect(left, py, Math.max(1, Math.floor(w / 3)), 1);
    if (w > 4 && row % 5 === 2) { ctx.fillStyle = '#3a3550'; ctx.fillRect(left + 1, py, w - 2, 1); }
  }
}

// The mouth of a cave in the rock: a dark opening with a rough edge and
// icicles across the top. Walk into it (put a Door on it).
function drawCaveMouth(ctx, x, y, tx, ty, room) {
  px(ctx, '#09070f', x, y, T, T);
  px(ctx, '#15121f', x + 2, y + 6, T - 4, 1);
  px(ctx, '#15121f', x + 4, y + 11, T - 8, 1);
  if (!room) return;
  const edge = (dx, dy) => room.tileAt(tx + dx, ty + dy) !== 't';
  if (edge(0, -1)) {
    px(ctx, '#4a5068', x, y, T, 2);
    for (let i = 0; i < T; i += 3) px(ctx, '#4a5068', x + i, y + 2, 2, (i % 2) + 1);
    for (const ix of [3, 8, 13]) if (hash(tx * 3 + ix, ty, 480) < 0.7) px(ctx, '#cfe6f5', x + ix, y + 2, 1, 2 + Math.floor(hash(tx * 3 + ix, ty, 481) * 4));
  }
  if (edge(-1, 0)) { px(ctx, '#4a5068', x, y, 2, T); px(ctx, '#4a5068', x + 2, y + 4, 1, 3); }
  if (edge(1, 0)) { px(ctx, '#4a5068', x + T - 2, y, 2, T); px(ctx, '#4a5068', x + T - 3, y + 9, 1, 3); }
}

// A cluster of ice crystals, glowing faintly blue: light in the dark.
function drawIceCrystals(ctx, x, y, tx, ty, room) {
  drawBaseFloor(ctx, x, y, tx, ty, room);
  const glow = ctx.createRadialGradient(x + 8, y + 8, 1, x + 8, y + 8, 14);
  glow.addColorStop(0, 'rgba(140, 210, 255, 0.32)');
  glow.addColorStop(1, 'rgba(140, 210, 255, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(x - 6, y - 6, 28, 28);
  const shards = [[7, 2, 3, 12], [2, 7, 3, 7], [11, 5, 3, 9]];
  for (const [sx, sy, w, h] of shards) {
    ctx.fillStyle = '#15121f';
    ctx.fillRect(x + sx - 1, y + sy - 1, w + 2, h + 2);
    ctx.fillStyle = '#9fd0e8';
    ctx.fillRect(x + sx, y + sy, w, h);
    ctx.fillStyle = '#e8f7fc';
    ctx.fillRect(x + sx, y + sy, 1, h);
    ctx.fillRect(x + sx, y + sy, w, 1);
  }
}

// --- Drops: where the ground ends at open sky. ---
// Without this, ground next to the sky just stops at a tile's straight edge,
// like it was bitten off. So after every tile is drawn, each edge over the
// drop gets some depth: the ground's underside hangs down into the sky below
// it (a snowy overhang, then rock that tapers off into shadow, an icicle or
// two; under a bridge, its beams and a sagging rope), the outer corners are
// rounded off, the rims along the sides and far edge are made a little
// uneven, and a bridge that ends in the air ends in splintered planks. All of
// it is laid in world pixels, so it runs on unbroken from tile to tile.
const DROP_ROCK = ['#6f7a94', '#78849e', '#66718a', '#737e98'];
const isLand = (c) => c !== null && c !== undefined && c !== '_';
const isRockFace = (c) => c === 'E' || c === 'M' || c === 'k' || c === 'K';
// What hangs over the edge on top of the rock: snow (on snowy ground and the
// stair), turf (on a grassy cliff top), or nothing (bare rock, stone blocks).
const SNOWY_EDGES = new Set(['n', 'i', 'l', 'z', 'A', 's']);
function lipOf(c) {
  if (SNOWY_EDGES.has(c)) return { top: '#eef3fa', under: '#cfdcee' };
  if (c === 'm') return { top: '#3a6638', under: '#2f5530' };
  return null;
}

// A smooth wobble along a line: a value between lo and hi that eases from one
// random height to the next every `span` pixels.
function wobble(along, row, salt, span, lo, hi) {
  const i = Math.floor(along / span);
  const f = (along - i * span) / span;
  const a = hash(i, row, salt);
  const b = hash(i + 1, row, salt);
  const eased = f * f * (3 - 2 * f);
  return lo + (a + (b - a) * eased) * (hi - lo);
}

// The underside of the ground at (tx, ty - 1), hanging into the sky tile (tx, ty).
function drawUnderside(ctx, room, tx, ty) {
  const above = room.tileAt(tx, ty - 1);
  const x = tx * T;
  const y = ty * T;
  // Room below for it: the rest of this tile, and the next if that's sky too.
  const room2 = room.tileAt(tx, ty + 1) === '_' ? T * 2 : T - 2;
  // Ground that carries on to either side keeps its full depth (where it
  // steps down, the rock meets the lower ground); only where the ground itself
  // ends does the underside taper away, so its corner reads as rounded.
  const goesOnLeft = isLand(room.tileAt(tx - 1, ty - 1)) || isLand(room.tileAt(tx - 1, ty));
  const goesOnRight = isLand(room.tileAt(tx + 1, ty - 1)) || isLand(room.tileAt(tx + 1, ty));
  const bridge = above === 'g';
  const rock = isRockFace(above);
  const lipColor = lipOf(above);
  for (let c = 0; c < T; c++) {
    const wx = x + c;
    let taper = 1;
    if (!goesOnLeft && c < 6) taper = Math.min(taper, (c + 1) / 7);
    if (!goesOnRight && c > T - 7) taper = Math.min(taper, (T - c) / 7);
    if (bridge) {
      // Two dark joists under the boards and a rope sagging between posts.
      px(ctx, 'rgba(20, 12, 8, 0.85)', wx, y, 1, 2);
      const sag = Math.round(Math.sin(((wx % 48) / 48) * Math.PI) * 4);
      px(ctx, '#3a2410', wx, y + 3 + sag, 1, 1);
      if (wx % 24 < 2) px(ctx, '#5a3a1e', wx, y + 2, 1, 4);
      ctx.fillStyle = 'rgba(8, 12, 30, 0.22)';
      ctx.fillRect(wx, y + 2, 1, 6);
      continue;
    }
    // A snowy lip first (not under bare rock), then the rock, then shadow.
    const lip = lipColor ? Math.round(wobble(wx, ty, 901, 5, 1, 3.4)) : 0;
    const depth = Math.min(room2 - 6, Math.round(wobble(wx, ty, 902, 7, rock ? 6 : 12, rock ? 13 : 22) * taper));
    if (depth <= 0) continue;
    if (lip) {
      px(ctx, lipColor.top, wx, y, 1, lip);
      px(ctx, lipColor.under, wx, y + lip, 1, 1);
    }
    for (let r = lip + (lip ? 1 : 0); r < depth; r++) {
      const band = Math.floor((y + r) / 3);
      px(ctx, pick(DROP_ROCK, hash(Math.floor(wx / 9), band, 903)), wx, y + r, 1, 1);
    }
    // It darkens the further down it goes, into the cold.
    const top = lip + (lip ? 1 : 0);
    if (depth > top) {
      const shade = ctx.createLinearGradient(0, y + top, 0, y + depth);
      shade.addColorStop(0, 'rgba(20, 26, 52, 0.1)');
      shade.addColorStop(1, 'rgba(20, 26, 52, 0.6)');
      ctx.fillStyle = shade;
      ctx.fillRect(wx, y + top, 1, depth - top);
    }
    // Light catches the odd ledge in the rock.
    if (hash(Math.floor(wx / 4), ty, 904) < 0.18) px(ctx, '#8a96b0', wx, y + top + 2, 1, 1);
    // A ragged bottom edge, and below it the shadow fading into the drop.
    px(ctx, '#3e4560', wx, y + depth - 1, 1, 1);
    const fall = ctx.createLinearGradient(0, y + depth, 0, y + depth + 7);
    fall.addColorStop(0, 'rgba(8, 12, 30, 0.32)');
    fall.addColorStop(1, 'rgba(8, 12, 30, 0)');
    ctx.fillStyle = fall;
    ctx.fillRect(wx, y + depth, 1, Math.min(7, room2 - depth));
    // Now and then an icicle under the overhang.
    if (SNOWY_EDGES.has(above) && hash(wx, ty, 905) < 0.07) {
      const long = 2 + Math.floor(hash(wx, ty, 906) * 4);
      px(ctx, '#cfe6f5', wx, y + depth, 1, Math.min(long, room2 - depth));
      px(ctx, '#ffffff', wx, y + depth, 1, 1);
    }
  }
}

// Where ground has the sky beside it (`dir` -1: sky to its left, 1: to its
// right), the rim isn't a ruler-straight line: snow bulges a pixel or two out
// over the drop, with a shadow down its side.
function drawSideRim(ctx, room, tx, ty, dir) {
  const x = dir < 0 ? tx * T : tx * T + T;
  const y = ty * T;
  const char = room.tileAt(tx, ty);
  if (char === 'g') {
    // A bridge ending in the air: splintered plank ends and a dangling rope.
    for (let row = 0; row < 4; row++) {
      const len = 1 + Math.floor(hash(tx * 4 + row, ty, 907) * 4);
      const px0 = dir < 0 ? x - len : x;
      px(ctx, row % 2 ? '#9a6436' : '#a86f3c', px0, y + row * 4, len, 3);
      px(ctx, '#5a3a1e', dir < 0 ? px0 : px0 + len - 1, y + row * 4 + 1, 1, 2);
    }
    const rx = dir < 0 ? x - 2 : x + 1;
    px(ctx, '#3a2410', rx, y + T - 2, 1, 6 + Math.floor(hash(tx, ty, 908) * 6));
    return;
  }
  // Snow bulges over the side; any other ground just casts its shadow.
  for (let r = 0; SNOWY_EDGES.has(char) && r < T; r++) {
    const wy = y + r;
    const out = Math.round(wobble(wy, tx * 2 + (dir > 0 ? 1 : 0), 909, 5, 0, 2.4));
    if (out <= 0) continue;
    const ox = dir < 0 ? x - out : x;
    px(ctx, '#eef3fa', ox, wy, out, 1);
    px(ctx, '#aab6c9', dir < 0 ? ox - 1 : ox + out, wy, 1, 1);
  }
  // A soft shadow off the side, so the edge stands above the drop.
  ctx.fillStyle = edgeShadow(ctx, x, x + dir * 5);
  ctx.fillRect(dir < 0 ? x - 5 : x, y, 5, T);
}

// A shadow falling away from an edge at `from` towards `to` (x positions).
function edgeShadow(ctx, from, to) {
  const shade = ctx.createLinearGradient(from, 0, to, 0);
  shade.addColorStop(0, 'rgba(8, 12, 30, 0.22)');
  shade.addColorStop(1, 'rgba(8, 12, 30, 0)');
  return shade;
}

// The far edge of ground, with the sky beyond it (above it on screen): a
// crest of snow, uneven, lit along its top.
function drawFarRim(ctx, room, tx, ty) {
  const char = room.tileAt(tx, ty);
  if (!SNOWY_EDGES.has(char) || char === 's') return;
  const x = tx * T;
  const y = ty * T;
  for (let c = 0; c < T; c++) {
    const wx = x + c;
    const up = Math.round(wobble(wx, ty, 910, 6, 0, 2.4));
    if (up <= 0) continue;
    px(ctx, '#f7fafd', wx, y - up, 1, up);
  }
}

// Rounds off a corner of ground with the sky on both sides of it, by clearing
// a little quarter-circle of pixels so the view shows through.
function roundCorner(ctx, tx, ty, right, bottom) {
  const steps = [3, 2, 1, 1];
  for (let i = 0; i < steps.length; i++) {
    const w = steps[i];
    const cx = right ? tx * T + T - w : tx * T;
    const cy = bottom ? ty * T + T - 1 - i : ty * T + i;
    ctx.clearRect(cx, cy, w, 1);
  }
}

export function drawDrops(ctx, room) {
  for (let ty = 0; ty < room.height; ty++) {
    for (let tx = 0; tx < room.width; tx++) {
      const char = room.tileAt(tx, ty);
      if (char === '_') {
        if (isLand(room.tileAt(tx, ty - 1))) drawUnderside(ctx, room, tx, ty);
        continue;
      }
      const sky = (dx, dy) => room.tileAt(tx + dx, ty + dy) === '_';
      // Round the outer corners on the near side, where the underside tapers.
      if (SNOWY_EDGES.has(char) && char !== 's') {
        if (sky(-1, 0) && sky(0, -1)) roundCorner(ctx, tx, ty, false, false);
        if (sky(1, 0) && sky(0, -1)) roundCorner(ctx, tx, ty, true, false);
      }
      if (sky(-1, 0)) drawSideRim(ctx, room, tx, ty, -1);
      if (sky(1, 0)) drawSideRim(ctx, room, tx, ty, 1);
      if (sky(0, -1)) drawFarRim(ctx, room, tx, ty);
    }
  }
}

// --- The Old Drains (Chapter 3): under Hollin's well. ---
// In rooms of the 'drains' area the cave tiles are Hollin's brickwork (K a
// culvert wall, k the dark of the vault over it, q the wet walkway, G a
// false wall), and the Ruins' stone (#, W, .) is the old city's conduit,
// drowned for ages: the same ancient stone, gone green and silty. Water is
// black-green and still, and the dry gutters are silted. All of it is kept
// dark, so the currents, wheels, gratings and chalk are what you see.

// Hollin's culvert bricks: dark wet red-brown in courses, the mortar gone
// green, a tide-line where the water stood, slime and drips below it.
const CULVERT_BRICK = ['#3e231e', '#45281f', '#4a2a24', '#3a201c', '#43261f'];
const CULVERT_BRICK_WET = ['#2e1a18', '#33201b', '#36201c', '#2b1816', '#311d19'];
const isBrickWall = (c) => c === 'K' || c === 'k' || c === 'G';
function drawCulvertBrick(ctx, x, y, tx, ty, room) {
  // Where the water stood once, a little way down this tile (the same height
  // along a whole wall).
  const tide = 7 + Math.floor(hash(0, ty, 700) * 4);
  px(ctx, '#1a1012', x, y, T, T);
  for (let row = 0; row < 4; row++) {
    const rowY = y + row * 4;
    const offset = (row + tx) % 2 ? 4 : 0;
    for (let bx = -offset; bx < T; bx += 8) {
      const left = Math.max(0, bx);
      const width = Math.min(bx + 7, T) - left;
      if (width <= 0) continue;
      const roll = hash(tx * 4 + Math.floor((bx + offset) / 8), ty * 4 + row, 701);
      const wet = row * 4 >= tide;
      px(ctx, pick(wet ? CULVERT_BRICK_WET : CULVERT_BRICK, roll), x + left, rowY, width, 3);
      if (!wet) px(ctx, '#52302a', x + left, rowY, width, 1);
      if (roll < 0.1) px(ctx, '#1a1012', x + left + Math.floor(width / 2), rowY + 1, 2, 2);
    }
  }
  // The tide-line, and green slime in the mortar under it.
  px(ctx, '#2e3a2c', x, y + tide, T, 1);
  for (let i = 0; i < 3; i++) {
    if (hash(tx, ty, 702 + i) < 0.5) px(ctx, '#24382a', x + Math.floor(hash(tx, ty, 705 + i) * 13), y + tide + 1, 3, 1 + Math.floor(hash(tx, ty, 708 + i) * 4));
  }
  // A drip running down, catching what light there is.
  if (hash(tx, ty, 711) < 0.3) {
    const dx = x + 2 + Math.floor(hash(tx, ty, 712) * 12);
    px(ctx, '#2a2a30', dx, y, 1, 6 + Math.floor(hash(tx, ty, 713) * 8));
    px(ctx, '#5a7078', dx, y + 13, 1, 1);
  }
  if (!room) return;
  // Under the vault's dark: the springing of the arch.
  if (room.tileAt(tx, ty - 1) === 'k') {
    px(ctx, '#140c0e', x, y, T, 2);
    px(ctx, '#56342c', x, y + 2, T, 1);
  }
  // Where it meets the walkway: a slimy foot.
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && !isBrickWall(below)) {
    px(ctx, '#1c2a20', x, y + T - 2, T, 2);
    for (let i = 0; i < 4; i++) if (hash(tx, ty, 714 + i) < 0.45) px(ctx, '#2e4a34', x + i * 4 + Math.floor(hash(tx, ty, 718 + i) * 3), y + T - 3, 2, 2);
  }
}

// The same brick, but loose: a draught comes through it, and the mortar's
// gone from one joint in a thin dark seam (walk straight through: a secret).
function drawFalseCulvertBrick(ctx, x, y, tx, ty, room) {
  drawCulvertBrick(ctx, x, y, tx, ty, room);
  px(ctx, '#0a0608', x + 7, y + 1, 1, 6);
  px(ctx, '#0a0608', x + 8, y + 6, 1, 6);
  px(ctx, '#5e3a30', x + 9, y + 2, 1, 1);
  px(ctx, '#5e3a30', x + 6, y + 9, 1, 1);
}

// The dark over a brick vault; where it comes down to a wall or the walkway,
// the arch's edge: a course of brick ends.
function drawVaultDark(ctx, x, y, tx, ty, room) {
  px(ctx, '#0e090b', x, y, T, T);
  if (hash(tx, ty, 720) < 0.4) px(ctx, '#140d0f', x + Math.floor(hash(tx, ty, 721) * 9), y + Math.floor(hash(tx, ty, 722) * 10), 7, 3);
  if (!room) return;
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && below !== 'k') {
    for (let bx = 0; bx < T; bx += 4) {
      px(ctx, hash(tx * 4 + bx, ty, 723) < 0.5 ? '#3a221c' : '#42261f', x + bx, y + T - 4, 3, 3);
      px(ctx, '#4e2e26', x + bx, y + T - 4, 3, 1);
    }
    px(ctx, '#060405', x, y + T - 1, T, 1);
  }
  const left = room.tileAt(tx - 1, ty);
  const right = room.tileAt(tx + 1, ty);
  if (left !== null && !isBrickWall(left)) px(ctx, '#2a1814', x, y, 1, T);
  if (right !== null && !isBrickWall(right)) px(ctx, '#2a1814', x + T - 1, y, 1, T);
}

// The culvert walkway: wet pavers in the brick's colours, a puddle here and
// there with a glint in it, and silt.
const CULVERT_PAVER = ['#231b1b', '#271e1d', '#211919', '#2a2020'];
function drawCulvertFloor(ctx, x, y, tx, ty, room) {
  px(ctx, '#171111', x, y, T, T);
  // Pavers in rows, every other row shifted half a paver, like brick bond.
  for (let row = 0; row < 2; row++) {
    const shift = row % 2 ? 4 : 0;
    for (let bx = -shift; bx < T; bx += 8) {
      const left = Math.max(0, bx);
      const width = Math.min(bx + 7, T) - left;
      if (width <= 0) continue;
      px(ctx, pick(CULVERT_PAVER, hash(tx * 2 + Math.floor((bx + shift) / 8), ty * 2 + row, 730)), x + left, y + row * 8, width, 7);
      px(ctx, '#2e2423', x + left, y + row * 8, width, 1);
    }
  }
  // A puddle.
  if (hash(tx, ty, 731) < 0.22) {
    const pxx = x + 2 + Math.floor(hash(tx, ty, 732) * 7);
    const pyy = y + 4 + Math.floor(hash(tx, ty, 733) * 7);
    px(ctx, '#18222a', pxx, pyy, 6, 3);
    px(ctx, '#18222a', pxx + 1, pyy - 1, 4, 1);
    px(ctx, '#3a4e58', pxx + 1, pyy, 2, 1);
  }
  // Silt.
  if (hash(tx, ty, 734) < 0.35) px(ctx, '#3a3028', x + Math.floor(hash(tx, ty, 735) * 12), y + Math.floor(hash(tx, ty, 736) * 13), 4, 2);
  if (hash(tx, ty, 737) < 0.2) px(ctx, '#2e4a34', x + Math.floor(hash(tx, ty, 738) * 14), y + Math.floor(hash(tx, ty, 739) * 14), 2, 1);
  if (!room) return;
  const above = room.tileAt(tx, ty - 1);
  if (above === 'K' || above === 'k' || above === 'G' || above === 'W' || above === '#') {
    ctx.fillStyle = 'rgba(4, 2, 6, 0.6)';
    ctx.fillRect(x, y, T, 3);
    ctx.fillStyle = 'rgba(4, 2, 6, 0.3)';
    ctx.fillRect(x, y + 3, T, 2);
  }
}

// Deep drain water: black-green, still, a slow ripple or two; a stone lip
// where it meets the floor above.
function drawDrainWater(ctx, x, y, tx, ty, room) {
  px(ctx, '#0c1614', x, y, T, T);
  const shift = (tx * 5 + ty * 3) % 9;
  px(ctx, '#1a2a26', x + shift, y + 6, 5, 1);
  px(ctx, '#1a2a26', x + ((shift + 7) % 11), y + 11, 4, 1);
  if (hash(tx, ty, 740) < 0.25) px(ctx, '#2a3e38', x + 3 + Math.floor(hash(tx, ty, 741) * 10), y + 9, 1, 1);
  if (room.tileAt(tx, ty - 1) !== '~') {
    px(ctx, '#2e2624', x, y, T, 3);
    px(ctx, '#3a302c', x, y, T, 1);
    px(ctx, '#050807', x, y + 3, T, 1);
  }
}

// A dry gutter: a sunken bed of old stone slabs, silted up, dark at the banks.
function drawDrainGutter(ctx, x, y, tx, ty, room) {
  px(ctx, '#0e0c0e', x, y, T, T);
  for (let i = 0; i < 4; i++) {
    const sx = x + (i % 2) * 8 + (ty % 2 ? 2 : 0);
    const sy = y + Math.floor(i / 2) * 8;
    px(ctx, hash(tx * 2 + (i % 2), ty * 2 + Math.floor(i / 2), 750) < 0.5 ? '#161314' : '#141112', sx, sy, 7, 7);
    px(ctx, '#1c1819', sx, sy, 7, 1);
  }
  // Silt drifted along the bed.
  px(ctx, '#2a231e', x + Math.floor(hash(tx, ty, 751) * 8), y + 9 + Math.floor(hash(tx, ty, 752) * 4), 6 + Math.floor(hash(tx, ty, 753) * 4), 2);
  if (hash(tx, ty, 754) < 0.3) px(ctx, '#2e4a34', x + Math.floor(hash(tx, ty, 755) * 12), y + Math.floor(hash(tx, ty, 756) * 12), 3, 1);
  if (!room) return;
  const bank = (c) => c !== 'j' && c !== '~' && c !== null;
  if (bank(room.tileAt(tx - 1, ty))) px(ctx, '#060405', x, y, 2, T);
  if (bank(room.tileAt(tx + 1, ty))) px(ctx, '#060405', x + T - 2, y, 2, T);
  if (bank(room.tileAt(tx, ty - 1))) { px(ctx, '#060405', x, y, T, 3); px(ctx, '#2a2426', x, y + 3, T, 1); }
}

// The old city's conduit: the Ruins' stone, drowned. The dark above its
// walls, with a faint green-grey rim.
function drawDrownedWallTop(ctx, x, y, tx, ty, room) {
  px(ctx, '#0c0b10', x, y, T, T);
  if (hash(tx, ty, 1) < 0.5) px(ctx, '#111016', x + Math.floor(hash(tx, ty, 2) * 10), y + Math.floor(hash(tx, ty, 3) * 10), 5, 4);
  if (!room) return;
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && below !== '#') {
    px(ctx, '#24283a', x, y + T - 3, T, 2);
    px(ctx, '#30364a', x, y + T - 3, T, 1);
    px(ctx, '#050408', x, y + T - 1, T, 1);
  }
  const left = room.tileAt(tx - 1, ty);
  const right = room.tileAt(tx + 1, ty);
  if (left !== null && !isWall(left)) px(ctx, '#20243a', x, y, 1, T);
  if (right !== null && !isWall(right)) px(ctx, '#20243a', x + T - 1, y, 1, T);
}

// Its walls: the Ruins' great dressed blocks, gone grey-green, darker below
// the old water-line, streaked with slime, and mossy at the foot.
const DROWNED_STONE = ['#34344a', '#313146', '#38384e', '#2e2e42', '#353550'];
const DROWNED_STONE_WET = ['#272a36', '#252832', '#2a2d3a', '#23262f', '#282b37'];
function drawDrownedWallFace(ctx, x, y, tx, ty, room) {
  const tide = 8 + Math.floor(hash(0, ty, 760) * 3);
  px(ctx, '#1c1c2a', x, y, T, T);
  for (let row = 0; row < 4; row++) {
    const rowY = y + row * 4;
    const offset = (row + tx) % 2 ? 4 : 0;
    for (let bx = -offset; bx < T; bx += 8) {
      const left = Math.max(0, bx);
      const width = Math.min(bx + 7, T) - left;
      if (width <= 0) continue;
      const roll = hash(tx * 4 + Math.floor((bx + offset) / 8), ty * 4 + row, 1);
      const wet = row * 4 >= tide;
      px(ctx, pick(wet ? DROWNED_STONE_WET : DROWNED_STONE, roll), x + left, rowY, width, 3);
      if (!wet) px(ctx, '#42445c', x + left, rowY, width, 1);
      if (roll < 0.12) px(ctx, '#1c1c2a', x + left + Math.floor(width / 2), rowY + 1, 2, 2);
    }
  }
  px(ctx, '#2c3a34', x, y + tide, T, 1);
  // Slime and silt streaks running down from the water-line.
  for (let i = 0; i < 2; i++) {
    if (hash(tx, ty, 761 + i) < 0.55) px(ctx, i ? '#24382e' : '#2a3a2c', x + 1 + Math.floor(hash(tx, ty, 763 + i) * 13), y + tide + 1, 2, 2 + Math.floor(hash(tx, ty, 765 + i) * 5));
  }
  if (hash(tx, ty, 7) < 0.3) {
    ctx.fillStyle = 'rgba(8, 14, 12, 0.4)';
    ctx.fillRect(x + 2 + Math.floor(hash(tx, ty, 8) * 12), y, 1, 6 + Math.floor(hash(tx, ty, 9) * 10));
  }
  if (!room) return;
  if (room.tileAt(tx, ty - 1) === '#') {
    px(ctx, '#20243a', x, y, T, 2);
    px(ctx, '#4a5068', x, y + 2, T, 1);
  }
  const below = room.tileAt(tx, ty + 1);
  if (below !== null && !isWall(below)) {
    px(ctx, '#18201e', x, y + T - 2, T, 2);
    for (let i = 0; i < 4; i++) {
      if (hash(tx, ty, 70 + i) < 0.45) px(ctx, i % 2 ? '#2e4a34' : '#3a5a3e', x + i * 4 + Math.floor(hash(tx, ty, 80 + i) * 3), y + T - 3, 2, 2);
    }
  }
}

// Its flagstones: the Ruins' slabs, drowned and drained again, dull and
// silty, with puddles in the hollows. No red leaves reach down here.
const DROWNED_SLAB = ['#22222c', '#25242f', '#20202a', '#272632', '#23232e'];
function drawDrownedFloor(ctx, x, y, tx, ty, room) {
  const layout = hash(tx, ty, 1);
  const slabs = layout < 0.5 ? [[0, 0, 16, 16]]
    : layout < 0.85 ? (hash(tx, ty, 2) < 0.5 ? [[0, 0, 16, 8], [0, 8, 16, 8]] : [[0, 0, 8, 16], [8, 0, 8, 16]])
      : [[0, 0, 8, 8], [8, 0, 8, 8], [0, 8, 8, 8], [8, 8, 8, 8]];
  slabs.forEach(([sx, sy, w, h], i) => {
    px(ctx, pick(DROWNED_SLAB, hash(tx, ty, 10 + i)), x + sx, y + sy, w, h);
    px(ctx, '#2c2b38', x + sx + 1, y + sy, w - 2, 1);
    px(ctx, '#17161e', x + sx, y + sy + h - 1, w, 1);
    px(ctx, '#17161e', x + sx + w - 1, y + sy, 1, h);
  });
  if (hash(tx, ty, 770) < 0.18) {
    const pxx = x + 2 + Math.floor(hash(tx, ty, 771) * 8);
    const pyy = y + 3 + Math.floor(hash(tx, ty, 772) * 9);
    px(ctx, '#161e26', pxx, pyy, 6, 2);
    px(ctx, '#34485a', pxx + 1, pyy, 2, 1);
  }
  if (hash(tx, ty, 773) < 0.35) px(ctx, '#332c26', x + Math.floor(hash(tx, ty, 774) * 12), y + Math.floor(hash(tx, ty, 775) * 13), 4, 2);
  if (hash(tx, ty, 776) < 0.15) px(ctx, '#2e4a34', x + Math.floor(hash(tx, ty, 777) * 14), y + Math.floor(hash(tx, ty, 778) * 14), 2, 1);
  if (!room) return;
  if (isWall(room.tileAt(tx, ty - 1)) || room.tileAt(tx, ty - 1) === 'K') {
    ctx.fillStyle = 'rgba(4, 4, 8, 0.6)';
    ctx.fillRect(x, y, T, 3);
    ctx.fillStyle = 'rgba(4, 4, 8, 0.3)';
    ctx.fillRect(x, y + 3, T, 2);
  }
}

// --- The Lantern Marsh (Chapter 3): the fen where the old conduit spills out. ---
// Everything here is grey-green and soft, low in contrast: the mist does the
// rest. Fen turf to stand on, old duckboards laid across it, black bog that
// swallows you (see OverworldScene.checkBog), still fen water, tall reeds,
// and the stilt hut out on its island.
const isMarsh = (room) => room?.area === 'marsh';
const FEN = ['#363c34', '#383e35', '#343a32', '#3a4036'];
const SEDGE = ['#4a5244', '#525a48', '#46503e', '#5a6250'];

// Fen turf: tussocky sedge, damp and dull, with a seed-head or a puddle now and then.
function drawFenTurf(ctx, x, y, tx, ty) {
  px(ctx, pick(FEN, hash(tx, ty, 800)), x, y, T, T);
  // Wetter and drier ground mottled together, soft-edged.
  mottle(ctx, pick(FEN, hash(tx, ty, 802)), x, y, tx, ty, 803, 7);
  if (hash(tx, ty, 801) < 0.5) mottle(ctx, '#323830', x, y, tx, ty, 826, 4);
  // Tufts of sedge: a few blades leaning the same way, dark at the root.
  for (let i = 0; i < 4; i++) {
    const sx = x + 1 + Math.floor(hash(tx, ty, 805 + i) * 13);
    const sy = y + 3 + Math.floor(hash(tx, ty, 810 + i) * 11);
    const c = pick(SEDGE, hash(tx, ty, 815 + i));
    px(ctx, '#2c3230', sx, sy + 1, 3, 1);
    px(ctx, c, sx, sy - 2, 1, 3);
    px(ctx, c, sx + 1, sy - 3, 1, 3);
    px(ctx, c, sx + 2, sy - 1, 1, 2);
  }
  // A seed-head, or a tuft of cotton-grass, white in the mist.
  if (hash(tx, ty, 820) < 0.12) px(ctx, '#7a7c64', x + 2 + Math.floor(hash(tx, ty, 821) * 11), y + 2 + Math.floor(hash(tx, ty, 822) * 10), 1, 1);
  else if (hash(tx, ty, 827) < 0.07) {
    const cx = x + 3 + Math.floor(hash(tx, ty, 828) * 10);
    const cy = y + 4 + Math.floor(hash(tx, ty, 829) * 8);
    px(ctx, '#5a6250', cx + 1, cy, 1, 3);
    px(ctx, '#d8d8cc', cx, cy - 1, 3, 1);
    px(ctx, '#f0f0e8', cx + 1, cy - 2, 1, 1);
  }
  // Water standing in a hollow, with a glint of the grey sky in it.
  if (hash(tx, ty, 823) < 0.12) {
    const pxx = x + 3 + Math.floor(hash(tx, ty, 824) * 7);
    const pyy = y + 4 + Math.floor(hash(tx, ty, 825) * 8);
    px(ctx, '#222a2a', pxx, pyy, 5, 2);
    px(ctx, '#222a2a', pxx + 1, pyy - 1, 3, 1);
    px(ctx, '#3e4c4c', pxx + 1, pyy, 2, 1);
    px(ctx, '#6a7a7a', pxx + 2, pyy - 1, 1, 1);
  }
}

// Bog: black, wet, sucking mud with an oily sheen and the odd slow bubble.
// The sedge creeps over its edges, so in the mist it's easy to miss.
function drawBog(ctx, x, y, tx, ty, room) {
  px(ctx, '#1e201c', x, y, T, T);
  px(ctx, '#23261f', x + Math.floor(hash(tx, ty, 830) * 6), y + Math.floor(hash(tx, ty, 831) * 6), 10, 9);
  // The sheen: a couple of smears of grey light on the wet.
  px(ctx, '#2e3230', x + 2 + Math.floor(hash(tx, ty, 832) * 8), y + 4 + Math.floor(hash(tx, ty, 833) * 3), 4, 1);
  px(ctx, '#2a2e2c', x + 5 + Math.floor(hash(tx, ty, 834) * 6), y + 10 + Math.floor(hash(tx, ty, 835) * 3), 3, 1);
  if (hash(tx, ty, 836) < 0.4) {
    const bx = x + 3 + Math.floor(hash(tx, ty, 837) * 9);
    const by = y + 3 + Math.floor(hash(tx, ty, 838) * 9);
    px(ctx, '#3a3e36', bx, by, 2, 1);
    px(ctx, '#3a3e36', bx - 1, by + 1, 1, 1);
    px(ctx, '#3a3e36', bx + 2, by + 1, 1, 1);
    px(ctx, '#3a3e36', bx, by + 2, 2, 1);
  }
  if (!room) return;
  // Sedge creeping in over the edges where it meets the turf.
  const turf = (dx, dy) => { const c = room.tileAt(tx + dx, ty + dy); return c !== '%' && c !== '$' && c !== null; };
  for (let i = 0; i < T; i += 3) {
    const n = hash(tx * 5 + i, ty, 839) < 0.5 ? 1 : 2;
    if (turf(0, -1)) px(ctx, '#363c34', x + i, y, 2, n);
    if (turf(0, 1)) px(ctx, '#363c34', x + i, y + T - n, 2, n);
    if (turf(-1, 0)) px(ctx, '#363c34', x, y + i, n, 2);
    if (turf(1, 0)) px(ctx, '#363c34', x + T - n, y + i, n, 2);
  }
}

// Old duckboards: grey, warped planks laid across the fen on sunk posts,
// gapped and mossy, with a rusty nail or two. They run the way the walk does.
function drawDuckboards(ctx, x, y, tx, ty, room) {
  drawFenTurf(ctx, x, y, tx, ty);
  const along = (dx, dy) => room?.tileAt(tx + dx, ty + dy) === '=';
  const upright = (along(0, -1) || along(0, 1)) && !(along(-1, 0) || along(1, 0));
  const plank = ['#5e584c', '#625c50', '#58534a', '#66604f'];
  for (let i = 0; i < 4; i++) {
    const c = pick(plank, hash(tx, ty, 840 + i));
    if (upright) {
      px(ctx, '#24221e', x + 2, y + i * 4, 12, 4);
      px(ctx, c, x + 3 + (hash(tx, ty, 845 + i) < 0.3 ? 1 : 0), y + i * 4, 10, 3);
      px(ctx, '#6e6858', x + 3, y + i * 4, 10, 1);
    } else {
      px(ctx, '#24221e', x + i * 4, y + 2, 4, 12);
      px(ctx, c, x + i * 4, y + 3 + (hash(tx, ty, 845 + i) < 0.3 ? 1 : 0), 3, 10);
      px(ctx, '#6e6858', x + i * 4, y + 3, 1, 10);
    }
  }
  if (hash(tx, ty, 850) < 0.4) px(ctx, '#4a5a40', x + 2 + Math.floor(hash(tx, ty, 851) * 10), y + 3 + Math.floor(hash(tx, ty, 852) * 9), 3, 1);
  if (hash(tx, ty, 853) < 0.3) px(ctx, '#6a4a34', x + 4 + Math.floor(hash(tx, ty, 854) * 8), y + 5 + Math.floor(hash(tx, ty, 855) * 6), 1, 1);
}

// Fen water: dark, still, grey-green, a ripple, now and then a lily pad.
// Too deep to wade.
function drawFenWater(ctx, x, y, tx, ty, room) {
  px(ctx, '#1c2628', x, y, T, T);
  // A darker, deeper patch, and ripples catching what light there is.
  mottle(ctx, '#192224', x, y, tx, ty, 863, 7);
  const shift = (tx * 5 + ty * 7) % 9;
  px(ctx, '#283438', x + shift, y + 5, 5, 1);
  px(ctx, '#324044', x + shift + 1, y + 5, 2, 1);
  px(ctx, '#283438', x + ((shift + 6) % 11), y + 11, 4, 1);
  if (hash(tx, ty, 866) < 0.4) px(ctx, '#243034', x + ((shift + 3) % 12), y + 8, 3, 1);
  // Duckweed, a green scum on the still water, in places.
  if (hash(tx, ty, 867) < 0.15) {
    const dx = x + Math.floor(hash(tx, ty, 868) * 10);
    const dy = y + Math.floor(hash(tx, ty, 869) * 12);
    px(ctx, '#2e4030', dx, dy, 5, 2);
    px(ctx, '#2e4030', dx + 2, dy + 2, 3, 1);
    px(ctx, '#3a5038', dx + 1, dy, 2, 1);
  }
  if (hash(tx, ty, 860) < 0.12) {
    const lx = x + 3 + Math.floor(hash(tx, ty, 861) * 8);
    const ly = y + 3 + Math.floor(hash(tx, ty, 862) * 8);
    px(ctx, '#34483a', lx, ly, 4, 3);
    px(ctx, '#1c2628', lx + 2, ly, 1, 1);
    px(ctx, '#40583e', lx, ly, 2, 1);
  }
  if (!room) return;
  // A soft bank where the water meets the turf above.
  const above = room.tileAt(tx, ty - 1);
  if (above !== '$' && above !== null && above !== '9') {
    px(ctx, '#2e3430', x, y, T, 2);
    px(ctx, '#121816', x, y + 2, T, 1);
  }
}

// Reeds: a tall clump of reeds and bulrushes, taller than you (drawn
// standing, so you can walk behind them).
function drawReeds(ctx, x, y, tx, ty) {
  drawStandingShadow(ctx, x, y);
  const stalks = 7;
  for (let i = 0; i < stalks; i++) {
    const sx = x + 1 + Math.floor((i * 14) / stalks) + Math.floor(hash(tx, ty, 870 + i) * 2);
    const h = 16 + Math.floor(hash(tx, ty, 880 + i) * 14);
    const lean = hash(tx, ty, 890 + i) < 0.5 ? -1 : 1;
    const c = i % 2 ? '#5a6448' : '#4e5840';
    px(ctx, '#262c22', sx, y + 15 - h, 1, h);
    px(ctx, c, sx, y + 15 - h + 4, 1, h - 4);
    px(ctx, c, sx + lean, y + 15 - h, 1, 5);
    // Bulrush heads on some.
    if (hash(tx, ty, 900 + i) < 0.35) {
      px(ctx, '#3a2a1e', sx - 1 + lean, y + 15 - h + 2, 3, 5);
      px(ctx, '#5a4030', sx + lean, y + 15 - h + 2, 1, 4);
    }
  }
  // A long leaf or two, bent over.
  px(ctx, '#66704e', x + 3, y + 2, 5, 1);
  px(ctx, '#66704e', x + 9 + Math.floor(hash(tx, ty, 910) * 3), y + 5, 4, 1);
}

// The stilt hut, out on its island: walls of grey, weathered boards...
const isHut = (c) => c === '1' || c === '3' || c === '4';
function drawHutWall(ctx, x, y, tx, ty, room) {
  px(ctx, '#4a443c', x, y, T, T);
  for (let i = 0; i < 4; i++) {
    px(ctx, hash(tx * 4 + i, ty, 920) < 0.5 ? '#5a5248' : '#544c42', x + i * 4, y, 3, T);
    px(ctx, '#6a6256', x + i * 4, y, 1, T);
  }
  px(ctx, '#2a2620', x, y + T - 2, T, 2);
  if (hash(tx, ty, 921) < 0.3) px(ctx, '#3e4a36', x + Math.floor(hash(tx, ty, 922) * 12), y + 10, 4, 3);
  if (!room) return;
  if (!isHut(room.tileAt(tx - 1, ty))) px(ctx, '#2a2620', x, y, 2, T);
  if (!isHut(room.tileAt(tx + 1, ty))) px(ctx, '#2a2620', x + T - 2, y, 2, T);
}

// ...a window, with a little warm firelight in it...
function drawHutWindow(ctx, x, y, tx, ty, room) {
  drawHutWall(ctx, x, y, tx, ty, room);
  px(ctx, '#2a2620', x + 3, y + 3, 10, 8);
  px(ctx, '#c08440', x + 4, y + 4, 8, 6);
  px(ctx, '#e0a858', x + 5, y + 6, 3, 3);
  px(ctx, '#2a2620', x + 8, y + 4, 1, 6);
  px(ctx, '#2a2620', x + 4, y + 7, 8, 1);
}

// ...its door, standing open a crack...
function drawHutDoor(ctx, x, y, tx, ty, room) {
  drawHutWall(ctx, x, y, tx, ty, room);
  px(ctx, '#2a2620', x + 3, y, 10, T);
  px(ctx, '#140e0c', x + 4, y + 1, 8, T - 1);
  px(ctx, '#3a2a1c', x + 4, y + 6, 8, 1);
  px(ctx, '#6a5a44', x + 9, y + 1, 3, T - 1);
  px(ctx, '#7a6a52', x + 9, y + 1, 1, T - 1);
  px(ctx, '#6e6858', x + 2, y + T - 2, 12, 2);
}

// ...a roof of reed thatch, gone grey and green...
function drawHutThatch(ctx, x, y, tx, ty, room) {
  px(ctx, '#5a5440', x, y, T, T);
  for (let row = 0; row < 5; row++) {
    for (let i = 0; i < 8; i++) {
      const c = hash(tx * 8 + i, ty * 5 + row, 930) < 0.5 ? '#6a6248' : '#625a42';
      px(ctx, c, x + i * 2, y + row * 3, 1, 3);
    }
    px(ctx, '#46402e', x, y + row * 3 + 2, T, 1);
  }
  if (hash(tx, ty, 931) < 0.4) px(ctx, '#4a5a3a', x + Math.floor(hash(tx, ty, 932) * 11), y + Math.floor(hash(tx, ty, 933) * 11), 5, 3);
  if (!room) return;
  if (room.tileAt(tx, ty - 1) !== '2') px(ctx, '#3a3424', x, y, T, 2);
  if (room.tileAt(tx, ty + 1) !== '2') {
    px(ctx, '#2a2418', x, y + T - 2, T, 2);
    for (let i = 0; i < T; i += 2) px(ctx, '#6a6248', x + i, y + T - 2 + (hash(tx * 3 + i, ty, 934) < 0.5 ? 0 : 1), 1, 2);
  }
  if (room.tileAt(tx - 1, ty) !== '2') px(ctx, '#3a3424', x, y, 1, T);
  if (room.tileAt(tx + 1, ty) !== '2') px(ctx, '#3a3424', x + T - 1, y, 1, T);
}

// ...and the stilts it stands on, sunk in the fen water.
function drawHutStilts(ctx, x, y, tx, ty, room) {
  drawFenWater(ctx, x, y, tx, ty, room);
  px(ctx, 'rgba(0, 0, 0, 0.35)', x, y, T, 6);
  for (const sx of [3, 11]) {
    px(ctx, '#2a2620', x + sx, y, 3, T - 3);
    px(ctx, '#4a443c', x + sx, y, 1, T - 3);
    px(ctx, '#283438', x + sx - 1, y + T - 4, 5, 1);
  }
  px(ctx, '#3a342c', x, y + 4, T, 1);
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
  C: { solid: true, standing: true, animated: true, height: 40, draw: drawCandelabra },
  ',': { solid: false, draw: drawGrass },
  ':': { solid: false, draw: drawPath },
  s: { solid: false, draw: drawStair },
  M: { solid: true, draw: drawCliffFace },
  m: { solid: true, draw: drawCliffTop },
  O: { solid: true, draw: drawBoulder },
  T: { solid: true, standing: true, height: 46, draw: drawPine },
  b: { solid: false, raise: 12, draw: drawBlock(12) },
  B: { solid: false, raise: 24, draw: drawBlock(24) },
  // Mount Vigil and Heralds' Rest (see the section above).
  _: { solid: true, draw: drawSky },
  n: { solid: false, draw: drawSnow },
  i: { solid: false, draw: drawSnowPath },
  l: { solid: false, draw: drawSnowLane },
  z: { solid: false, draw: drawIce },
  g: { solid: false, draw: drawBridge },
  A: { solid: true, draw: drawSnowCliffTop },
  E: { solid: true, draw: drawIceCliffFace },
  Y: { solid: true, standing: true, height: 46, draw: drawSnowPine },
  Q: { solid: true, draw: drawSnowBoulder },
  a: { solid: true, draw: drawCabinWall },
  w: { solid: true, draw: drawCabinWindow },
  e: { solid: true, draw: drawCabinRoof },
  f: { solid: true, draw: drawFence },
  // The caves inside the spire.
  k: { solid: true, draw: drawCaveRock },
  K: { solid: true, draw: drawCaveWall },
  G: { solid: false, draw: drawFalseCaveWall },
  q: { solid: false, draw: drawCaveFloor },
  v: { solid: false, standing: true, animated: true, height: 26, draw: drawStalactite },
  '^': { solid: true, standing: true, height: 26, draw: drawStalagmite },
  x: { solid: true, draw: drawIceCrystals },
  t: { solid: false, draw: drawCaveMouth },
  // The Pinefall (Chapter 3): an autumn forest gone scarlet under the clouds.
  L: { solid: true, standing: true, height: 46, draw: drawScarletTree },
  // A false scarlet tree: walk through it (a secret).
  '&': { solid: false, standing: true, height: 46, draw: drawFalseTree },
  d: { solid: false, draw: drawLeafLitter },
  y: { solid: false, draw: drawLeafPath },
  Z: { solid: true, draw: drawBramble },
  // The Hushwood (see the section above): a bramble you can walk through, a
  // dry sluice channel, Hollin's cobbles, and its cottages (wall, boarded
  // window, roof, shut door).
  N: { solid: false, draw: drawThinBramble },
  j: { solid: false, draw: drawDryChannel },
  X: { solid: false, draw: drawCobbles },
  5: { solid: true, draw: drawCottageWall },
  6: { solid: true, draw: drawCottageWindow },
  7: { solid: true, draw: drawCottageRoof },
  8: { solid: true, draw: drawCottageDoor },
  // The Lantern Marsh (see the section above): fen turf, bog (walk on it and
  // it swallows you), old duckboards, fen water, tall reeds, and the stilt
  // hut (wall, window, door, thatch, and the stilts under it).
  ';': { solid: false, draw: drawFenTurf },
  '%': { solid: false, draw: drawBog },
  '=': { solid: false, draw: drawDuckboards },
  $: { solid: true, draw: drawFenWater },
  '"': { solid: true, standing: true, height: 30, draw: drawReeds },
  1: { solid: true, draw: drawHutWall },
  3: { solid: true, draw: drawHutWindow },
  4: { solid: false, draw: drawHutDoor },
  2: { solid: true, draw: drawHutThatch },
  9: { solid: true, draw: drawHutStilts },
};

// What's drawn under a standing tile.
export const FLOOR_TILE = '.';

// --- Crumbling floor (the Dead City, Chapter 3: see crumble.js). ---
// A flagstone split right through: the city's floor, sunk a little below
// its neighbours (a dark seam round it), with a web of cracks over it and
// grit in them. It gives way under you.
function drawCrumblingFloor(ctx, x, y, tx, ty, room) {
  drawFloor(ctx, x, y, tx, ty, room);
  // Sunk: a seam of shadow along its top and left, where it's dropped.
  px(ctx, '#1e1838', x, y, T, 1);
  px(ctx, '#1e1838', x, y, 1, T);
  px(ctx, '#2a2448', x + 1, y + 1, T - 2, 1);
  // The web: three or four cracks out from a point, each lit on one side.
  const ox = 5 + Math.floor(hash(tx, ty, 900) * 6);
  const oy = 5 + Math.floor(hash(tx, ty, 901) * 6);
  const arms = [[1, 1], [-1, 0], [0, -1], [1, -1], [-1, 1]];
  const count = 3 + Math.floor(hash(tx, ty, 902) * 2);
  for (let i = 0; i < count; i++) {
    const [ax, ay] = arms[(i + Math.floor(hash(tx, ty, 903) * 5)) % arms.length];
    let cx = ox;
    let cy = oy;
    for (let k = 0; k < 5 + Math.floor(hash(tx, ty, 904 + i) * 4); k++) {
      if (cx < 1 || cy < 1 || cx > T - 2 || cy > T - 2) break;
      px(ctx, '#1e1838', x + cx, y + cy);
      if (hash(tx, ty, 910 + i * 9 + k) < 0.5) px(ctx, '#4a4078', x + cx + 1, y + cy);
      const wobble = hash(tx, ty, 940 + i * 9 + k);
      cx += ax || (wobble < 0.5 ? -1 : 1) * (wobble < 0.25 || wobble > 0.75 ? 1 : 0);
      cy += ay || (wobble < 0.5 ? 1 : -1) * (wobble > 0.4 && wobble < 0.6 ? 1 : 0);
    }
  }
  // Grit shaken out of the joints.
  for (let i = 0; i < 3; i++) px(ctx, '#2a2448', x + 2 + Math.floor(hash(tx, ty, 950 + i) * 12), y + 2 + Math.floor(hash(tx, ty, 955 + i) * 12));
}
TILES['!'] = { solid: false, draw: drawCrumblingFloor };
