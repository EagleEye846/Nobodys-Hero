import { TILE_SIZE as T } from '../config.js';

// A tall climbing face underground, drawn as broken rock instead of the
// usual coursed wall. A room asks for it with `crag` (a list of { x, y, w, h }
// tile boxes, as the coast's crag does in coastTiles.js): inside them, the
// face tiles of the Glimmering, the Diggings and the Deep (brightTiles.js,
// deepTiles.js) are big rough lumps of rock stacked up the cliff, each with a
// lit top and a shadowed underside, cracks between them, smaller broken bits
// in places, darker toward the foot. The lumps are picked in world pixels, so
// they run on across tiles and a long face is not one tile over and over.
// (The chapter 4 ring climbs: glimmer_chimney, diggings_air_shaft, deep_last_flight.)

export const inCrag = (room, tx, ty) => Boolean(room?.crag?.some((b) => tx >= b.x && ty >= b.y && tx < b.x + b.w && ty < b.y + b.h));

function hash(a, b, salt) {
  const n = Math.sin(a * 127.1 + b * 311.7 + salt * 74.7) * 43758.5453;
  return n - Math.floor(n);
}
// Smooth noise (0..1), for where the big slabs are.
function soft(x, y, salt) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash(x0, y0, salt) + (hash(x0 + 1, y0, salt) - hash(x0, y0, salt)) * sx;
  const b = hash(x0, y0 + 1, salt) + (hash(x0 + 1, y0 + 1, salt) - hash(x0, y0 + 1, salt)) * sx;
  return a + (b - a) * sy;
}
const DITHER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

// The nearest of a jittered scatter of points (one per sx by sy cell) to a world pixel:
// which lump it's in, how far in from the lump's edge, and where it is from the lump's
// middle (-1..1 across and down).
function lumpAt(wx, wy, sx, sy, seed) {
  const gx = Math.floor(wx / sx);
  const gy = Math.floor(wy / sy);
  let d1 = 1e9;
  let d2 = 1e9;
  let best = null;
  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      const cx = gx + i;
      const cy = gy + j;
      const x0 = (cx + 0.15 + hash(cx, cy, seed) * 0.7) * sx;
      const y0 = (cy + 0.15 + hash(cx, cy, seed + 1) * 0.7) * sy;
      const d = Math.hypot((wx - x0) / sx, (wy - y0) / sy);
      if (d < d1) { d2 = d1; d1 = d; best = [cx, cy, x0, y0]; } else if (d < d2) d2 = d;
    }
  }
  const [cx, cy, x0, y0] = best;
  return { id: hash(cx, cy, seed + 2), cx, cy, edge: (d2 - d1) * Math.min(sx, sy) * 0.5, ux: (wx - x0) / (sx * 0.6), uy: (wy - y0) / (sy * 0.6) };
}

// Each region's rock: `rock` four body tones, `rim` the lit top edge, `lo` the
// shadowed underside, `crack` the dark between the lumps, `fleck` a rare glint.
export const CRAG_ROCK = {
  glimmer: { rock: ['#4b3d86', '#52438f', '#45387e', '#574896'], rim: '#8a74d4', lo: '#2f2460', crack: '#1c1540', fleck: '#c8b4ff' },
  diggings: { rock: ['#4d4036', '#473a31', '#54463b', '#42362d'], rim: '#7e6a54', lo: '#2a2018', crack: '#150f0b', fleck: '#b8743a' },
  deep: { rock: ['#1c1926', '#201d2c', '#181520', '#24203a'], rim: '#3e3a58', lo: '#0c0a12', crack: '#050408', fleck: '#56a4c4' },
};

// One face tile of a crag. `isFace(ch)` says which letters are the face (the
// lumps run on across them, and the face's top and foot are found by them).
export function cragFace(ctx, x, y, tx, ty, room, pal, isFace) {
  let up = 0;
  while (up < 8 && isFace(room.tileAt(tx, ty - up - 1))) up++;
  let down = 0;
  while (down < 8 && isFace(room.tileAt(tx, ty + down + 1))) down++;
  const faceTop = (ty - up) * T;
  const faceH = (up + down + 1) * T;
  const footY = (ty + down + 1) * T;
  const topOpen = !isFace(room.tileAt(tx, ty - up - 1)) && room.tileAt(tx, ty - up - 1) !== '#';
  for (let r = 0; r < T; r++) {
    const wy = ty * T + r;
    const depth = (wy - faceTop) / faceH;
    for (let c = 0; c < T; c++) {
      const wx = tx * T + c;
      const dd = DITHER[(wy & 3) * 4 + (wx & 3)] / 16;
      // Big slabs in places, smaller broken lumps between.
      const L = soft(wx / 26, wy / 26, 740) > 0.42 ? lumpAt(wx, wy, 30, 17, 739) : lumpAt(wx, wy, 15, 11, 741);
      const lit = -L.uy * 0.9 - L.ux * 0.3;
      let col;
      if (L.edge < 0.9) col = lit < 0.1 ? pal.crack : pal.lo;
      else if (L.edge < 2.2 && lit > 0.25) col = pal.rim;
      else if (L.edge < 2.6 && lit < -0.2) col = pal.lo;
      else {
        col = pal.rock[Math.floor(L.id * pal.rock.length)];
        if (lit > 0.5 && dd < 0.35) col = pal.rim;
        else if (lit < -0.4 && dd < 0.6) col = pal.lo;
      }
      // Darker toward the foot.
      if (depth > 0.55 && dd < (depth - 0.55) * 1.5 && col !== pal.rim) col = col === pal.lo ? pal.crack : pal.lo;
      // The odd glint in the rock.
      if (hash(wx, wy, 760) < 0.004) col = pal.fleck;
      px(ctx, col, x + c, y + r);
    }
  }
  // A ring hammered in here: the rock round it is worn pale by years of rope,
  // so the way up shows from below before you hook on.
  if ((room.allProps ?? []).some((p) => p.swing && Math.round(p.x / T) === tx && Math.round(p.y / T) === ty)) {
    for (let r = 0; r < T; r++) {
      for (let c = 0; c < T; c++) {
        const d = Math.hypot(c - 7.5, r - 7.5) / 8;
        if (d > 1) continue;
        const dd = DITHER[(r & 3) * 4 + (c & 3)] / 16;
        if (dd < (1 - d) * 1.1) px(ctx, d < 0.55 ? pal.rim : pal.rock[3], x + c, y + r);
      }
    }
    px(ctx, pal.fleck, x + 4, y + 3);
    px(ctx, pal.fleck, x + 11, y + 12);
  }
  // The face's lip, where it meets the ground above: a broken lit edge.
  if (topOpen && up === 0) {
    for (let c = 0; c < T; c++) {
      const h = 1 + Math.floor(soft((tx * T + c) / 4, ty, 770) * 3);
      px(ctx, pal.rim, x + c, y, 1, 1);
      px(ctx, pal.lo, x + c, y + h, 1, 1);
    }
  }
  // Its foot: a shadow where it meets the ground, uneven, with a few fallen bits.
  if (down === 0 && room.tileAt(tx, ty + 1) !== null && room.tileAt(tx, ty + 1) !== '#') {
    for (let c = 0; c < T; c++) {
      const h = 1 + Math.floor(soft((tx * T + c) / 5, ty, 780) * 3);
      px(ctx, pal.crack, x + c, y + T - h, 1, h);
    }
  }
  // Beside the dark mass of the rock ('#'), the face's side is ragged: the mass bites in.
  for (const side of [-1, 1]) {
    if (room.tileAt(tx + side, ty) !== '#') continue;
    for (let r = 0; r < T; r++) {
      const reach = Math.floor(soft((ty * T + r) / 5, tx * 2 + (side > 0 ? 1 : 0), 790) * 6);
      for (let s = 0; s < reach; s++) px(ctx, s === reach - 1 ? pal.lo : pal.crack, side < 0 ? x + s : x + T - 1 - s, y + r);
    }
  }
}

function px(ctx, color, x, y, w = 1, h = 1) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}
