// The brig Fair Return's weathering (Chapter 5, the ghost ship), painted once into each ship room's
// picture after its tiles (Room.renderBackground), so it costs nothing while you play.
//
// The tiles draw every deck as the same laid boards, one 16 px square at a time, so left alone a
// ship reads as a grid of one wood. This pass goes over the finished picture and gives the
// whole ship a hundred years of weather, running across tile lines:
//
//  - old boards: big soft patches of silvered, honey and sodden wood; some boards run wider
//    (the seam between two is filled in); a few deck patches of newer, paler boards;
//  - damp: long dark water stains along the grain with a pale salt line round their edge and the
//    odd wet glint; moss and weed where it is wet and where the walls meet the floor; dark rot;
//  - broken boards: a short run of a board gone, black underneath, a joist showing, the ends
//    splintered (only ever a few pixels tall: a gap in the picture, not a hole you could fall in);
//  - shadow along every wall and a deeper one under the rail, so the deck sits down in its sides;
//  - the walls themselves: drips running down them, tide marks, moss at the foot, rot;
//  - outdoors, the sea past the rail: fog lying on the water and a broken pale line of foam
//    along the hull.
//
// Only the drawing changes. Nothing here touches what is solid, walkable or where anything stands.
// Everything is worked out from the room's tile letters and world pixels (never a random call), so a
// room that leans over (tiles that change with the list) is painted the same way each time.

import { TILE_SIZE as T } from '../config.js';

function h2(x, y, s = 0) {
  let h = (x * 374761393 + y * 668265263 + s * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const smooth = (t) => t * t * (3 - 2 * t);
// Smooth 2D value noise, 0..1, a lattice of `sx` by `sy` pixels.
function noise(x, y, sx, sy, seed) {
  const fx = x / sx;
  const fy = y / sy;
  const ix = Math.floor(fx);
  const iy = Math.floor(fy);
  const ux = smooth(fx - ix);
  const uy = smooth(fy - iy);
  const a = h2(ix, iy, seed);
  const b = h2(ix + 1, iy, seed);
  const c = h2(ix, iy + 1, seed);
  const d = h2(ix + 1, iy + 1, seed);
  return (a + (b - a) * ux) * (1 - uy) + (c + (d - c) * ux) * uy;
}
const fbm = (x, y, sx, sy, seed) => noise(x, y, sx, sy, seed) * 0.62 + noise(x + 91, y + 37, sx / 2.3, sy / 2.3, seed + 5) * 0.38;
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const bayer = (x, y) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;

const rgb = (hex) => {
  const n = parseInt(hex.slice(1, 7), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};
const SILVER = rgb('#6c7872');
const HONEY = rgb('#6e5a3a');
const SODDEN = rgb('#1c211f');
const BLACK = rgb('#05080a');
const STAIN = rgb('#0a1a1c');
const SALT = rgb('#8c9a8e');
const GLINT = rgb('#86aeae');
const MOSS = [rgb('#2c4634'), rgb('#3a5c3c'), rgb('#4a7048'), rgb('#233a2c')];
const ROT = rgb('#151210');
const JOIST = rgb('#1e1a15');
const SPLINTER = rgb('#8a8068');
const PATCH = [rgb('#5e5c50'), rgb('#54523f'), rgb('#686450')];
const FOAM = rgb('#a4c4bc');
const FOG = rgb('#4a6a68');

function mixTo(d, i, c, a) {
  d[i] += (c[0] - d[i]) * a;
  d[i + 1] += (c[1] - d[i + 1]) * a;
  d[i + 2] += (c[2] - d[i + 2]) * a;
}
function dim(d, i, f) {
  d[i] *= f;
  d[i + 1] *= f;
  d[i + 2] *= f;
}

// Floors (and a rail's walkway), walls, outside water. Anything else (a raised block, a bridge) is left alone.
function kindOf(c) {
  if (c === '.' || c === ',' || c === ':' || c === 'o' || c === 'X') return 1;
  if (c === '#' || c === 'W' || c === 'w') return 2;
  if (c === '~') return 3;
  return 0;
}

export function shipDecor(ctx, room) {
  if (room.area !== 'ghostship') return;
  const W = room.width;
  const H = room.height;
  const PW = W * T;
  const PH = H * T;
  const img = ctx.getImageData(0, 0, PW, PH);
  const d = img.data;
  const src = d.slice();
  const salt = room.id ? [...room.id].reduce((a, ch) => a + ch.charCodeAt(0), 0) : 0;
  const seed = (s) => s + salt * 7;

  const carved = new Uint8Array(PW * PH);
  const kind = new Uint8Array(W * H);
  const vertical = new Uint8Array(W * H);
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W; tx++) {
      const c = room.tiles[ty][tx];
      kind[ty * W + tx] = kindOf(c);
      if (c === 'o') vertical[ty * W + tx] = 1;
    }
  }
  const kindAt = (tx, ty) => (tx < 0 || ty < 0 || tx >= W || ty >= H ? 0 : kind[ty * W + tx]);
  const kp = (x, y) => (carved[y * PW + x] ? 3 : kind[((y / T) | 0) * W + ((x / T) | 0)]);

  // How far (px) each floor pixel is from the nearest thing that isn't floor, and how far up to the
  // nearest wall (the rail's shadow). Two sweeps, capped.
  const CAP = 40;
  const dist = new Uint8Array(PW * PH);
  for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) dist[y * PW + x] = kp(x, y) === 1 ? CAP : 0;
  for (let y = 0; y < PH; y++) {
    for (let x = 0; x < PW; x++) {
      const i = y * PW + x;
      if (!dist[i]) continue;
      let v = dist[i];
      if (x > 0) v = Math.min(v, dist[i - 1] + 1);
      if (y > 0) v = Math.min(v, dist[i - PW] + 1);
      if (x > 0 && y > 0) v = Math.min(v, dist[i - PW - 1] + 1);
      dist[i] = v;
    }
  }
  for (let y = PH - 1; y >= 0; y--) {
    for (let x = PW - 1; x >= 0; x--) {
      const i = y * PW + x;
      if (!dist[i]) continue;
      let v = dist[i];
      if (x < PW - 1) v = Math.min(v, dist[i + 1] + 1);
      if (y < PH - 1) v = Math.min(v, dist[i + PW] + 1);
      if (x < PW - 1 && y < PH - 1) v = Math.min(v, dist[i + PW + 1] + 1);
      dist[i] = v;
    }
  }
  // Distance down to the next floor-or-nothing above (how far under the rail's shade a pixel is), by column.
  const under = new Uint8Array(PW * PH).fill(CAP);
  for (let x = 0; x < PW; x++) {
    let since = CAP;
    for (let y = 0; y < PH; y++) {
      const k = kp(x, y);
      if (k === 2) since = 0;
      else since = Math.min(CAP, since + 1);
      under[y * PW + x] = since;
    }
  }

  // Tiles the pass keeps its hands off for breaks in the boards (doors, where you arrive, where you start).
  const keep = new Set();
  const hold = (tx, ty) => { for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) keep.add(`${tx + a},${ty + b}`); };
  for (const door of room.doors ?? []) {
    for (let i = 0; i < (door.w ?? 1); i++) for (let j = 0; j < (door.h ?? 1); j++) hold(door.x + i, door.y + j);
    if (door.spawn) hold(door.spawn.x, door.spawn.y);
  }
  if (room.playerStart) hold(room.playerStart.x, room.playerStart.y);

  const outdoors = !room.indoors;

  // The hull is not a box: outdoors, every convex corner of the ship's outline is rounded off into the sea
  // (copied from the water beside it), so the bow and stern curve and the steps of the bow smooth out.
  if (outdoors) {
    const R = 9;
    for (let ty = 0; ty < H; ty++) {
      for (let tx = 0; tx < W; tx++) {
        const k = kindAt(tx, ty);
        if (k !== 2 && k !== 1) continue;
        for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
          if (kindAt(tx + sx, ty) !== 3 || kindAt(tx, ty + sy) !== 3) continue;
          for (let ly = 0; ly < R; ly++) {
            for (let lx = 0; lx < R; lx++) {
              // Distance from the circle's centre, which sits R in from the corner.
              const dx = R - 1 - lx;
              const dy = R - 1 - ly;
              if (dx * dx + dy * dy <= (R - 0.5) * (R - 0.5)) continue;
              const x = sx < 0 ? tx * T + lx : tx * T + T - 1 - lx;
              const y = sy < 0 ? ty * T + ly : ty * T + T - 1 - ly;
              const fx = sx < 0 ? tx * T - 1 - lx : tx * T + T + lx;
              if (fx < 0 || fx >= PW) continue;
              const i = (y * PW + x) * 4;
              const j = (y * PW + fx) * 4;
              d[i] = src[j]; d[i + 1] = src[j + 1]; d[i + 2] = src[j + 2];
              carved[y * PW + x] = 1;
            }
          }
        }
      }
    }
  }

  // ---------------------------------------------------------------- the floor and the walls
  for (let y = 0; y < PH; y++) {
    for (let x = 0; x < PW; x++) {
      const k = kp(x, y);
      if (!k) continue;
      const i = (y * PW + x) * 4;
      const b = bayer(x, y);
      if (k === 3) {
        if (!outdoors) continue;
        // Sea past the rail: fog lying on it in long soft bands, and darker troughs.
        const fogN = fbm(x + y * 0.3, y * 2.2, 70, 10, seed(61));
        if (fogN + (b - 0.5) * 0.12 > 0.6) mixTo(d, i, FOG, 0.28 + (fogN - 0.6) * 0.5);
        else if (fogN < 0.3) dim(d, i, 0.78);
        continue;
      }
      const tile = ((y / T) | 0) * W + ((x / T) | 0);
      const vert = vertical[tile] === 1;
      // u runs along the boards, v across them.
      const u = vert ? y : x;
      const v = vert ? x : y;
      const di = dist[y * PW + x];

      if (k === 1) {
        // Seams between boards: some are filled in, so a wide plank runs where two would. (A board is
        // 3 px with a 1 px seam, so the seam is the 4th row.)
        if ((v & 3) >= 2) {
          const band = v >> 2;
          const run = Math.floor(u / (40 + h2(band, 3, seed(5)) * 90));
          if (h2(band, run, seed(6)) < 0.3) {
            const from = vert ? ((y * PW + (x - ((v & 3) - 1))) * 4) : (((y - ((v & 3) - 1)) * PW + x) * 4);
            d[i] = src[from]; d[i + 1] = src[from + 1]; d[i + 2] = src[from + 2];
          }
        }
        // Old boards: each run of board its own flat tone (silvered, honey or sodden), drifting across the deck.
        const band = v >> 2;
        const off = h2(band, 1, seed(12)) * 44;
        const seg = Math.floor((u + off) / 44);
        const cu = seg * 44 - off + 22;
        const tone = fbm(vert ? v : cu, vert ? cu : v, 80, 46, seed(11));
        const own = h2(band, seg, seed(13));
        let f = 0.74 + tone * 0.38 + (own - 0.5) * 0.16;
        f = Math.round(f * 9) / 9;
        dim(d, i, f);
        if (tone + (own - 0.5) * 0.2 < 0.36) mixTo(d, i, SILVER, 0.22);
        else if (tone + (own - 0.5) * 0.2 > 0.66) mixTo(d, i, HONEY, 0.22);

        // Water stains along the grain, flat dark with a salt line round the edge.
        const stn = fbm(vert ? y : x, vert ? x : y, 52, 15, seed(21));
        let wet = 0;
        if (stn > 0.665) {
          wet = stn > 0.7 ? 1 : 0.55;
          dim(d, i, 1 - 0.42 * wet);
          mixTo(d, i, STAIN, 0.28 * wet);
        } else if (stn > 0.645) {
          mixTo(d, i, SALT, 0.22);
        }
        if (wet > 0.9 && (v & 3) === 0 && h2(u >> 3, v >> 2, seed(23)) < 0.3) mixTo(d, i, GLINT, 0.5);

        // Moss and weed: where it is wet and along the walls.
        const mm = fbm(x, y, 22, 18, seed(31));
        const near = 1 - Math.min(1, di / 26);
        const mv = mm * 0.7 + near * 0.3 + wet * 0.14;
        if (mv + (b - 0.5) * 0.08 > 0.8 && h2(x, y, seed(32)) > 0.3) {
          mixTo(d, i, MOSS[Math.floor(h2(x >> 1, y >> 1, seed(33)) * 4)], 0.6);
        } else if (mv > 0.74 && (v & 3) === 3 && h2(x, y, seed(34)) < 0.8) {
          mixTo(d, i, MOSS[3], 0.7);
        }

        // Rot: dark crumbly wood in a few places.
        const rotMask = fbm(x, y, 70, 46, seed(41));
        if (rotMask > 0.7) {
          const r = noise(x, y, 7, 5, seed(42));
          if (r > 0.5 - (rotMask - 0.7) * 0.6) {
            mixTo(d, i, ROT, 0.5 + 0.3 * h2(x, y, seed(43)));
            if (h2(x, y, seed(44)) < 0.06) mixTo(d, i, SPLINTER, 0.35);
          }
        }

        // Ambient shadow: the deck sits down in its sides, deepest under the rail.
        if (di < 11) dim(d, i, 1 - 0.44 * Math.pow(1 - di / 11, 1.5) - (b - 0.5) * 0.04);
        const up = under[y * PW + x];
        if (up < 16) dim(d, i, 1 - 0.34 * (1 - up / 16));
      } else {
        // Walls: weather them too (the same wood, the same patches), and run drips down them.
        const tone = fbm(x, y, 50, 22, seed(51));
        dim(d, i, Math.round((0.78 + tone * 0.4 + (b - 0.5) * 0.06) * 12) / 12);
        const streak = h2(x >> 1, 7, seed(52));
        if (streak < 0.16) {
          const reach = 4 + h2(x >> 1, 9, seed(53)) * 22;
          const top = Math.floor(y / T) * T;
          // From a rail's lower edge (or a wall's top) downwards.
          const above = kindAt((x / T) | 0, ((y / T) | 0) - 1);
          const dy = above === 2 ? y - top : y - top + T;
          if (dy < reach && (above === 2 || kp(x, Math.max(0, y - 1)) === 2)) { dim(d, i, 0.72); }
        }
        const mm = fbm(x, y, 24, 14, seed(54));
        // Moss at the foot, where a wall stands in the wet.
        const belowFloor = kp(x, Math.min(PH - 1, y + 5)) === 1;
        if (belowFloor && mm > 0.55 && h2(x, y, seed(55)) > 0.35 + (b - 0.5) * 0.2) mixTo(d, i, MOSS[Math.floor(h2(x, y, seed(56)) * 3)], 0.55);
        const rotMask = fbm(x, y, 60, 30, seed(57));
        if (rotMask > 0.68 && noise(x, y, 8, 6, seed(58)) > 0.5) mixTo(d, i, ROT, 0.5);
      }
    }
  }

  // ---------------------------------------------------------------- stowed cargo (a room's `cargo` boxes)
  // The crates are drawn tile by tile, so a stack reads as one grid. Give each crate its own age, run damp
  // down the faces, and lay a few tarpaulins roped over the stacks, ragged at the edges.
  for (const r of room.cargo ?? []) {
    const x0 = r.x * T;
    const x1 = (r.x + r.w) * T;
    const y0 = Math.max(0, r.y * T - 24);
    const y1 = (r.y + r.h) * T;
    const tarps = [];
    const count = Math.max(1, Math.round(r.w / 4));
    for (let k = 0; k < count; k++) {
      const tw = 24 + Math.floor(h2(k, r.x, seed(101)) * 30);
      const th = 18 + Math.floor(h2(k, r.y, seed(102)) * 24);
      tarps.push({
        x: x0 + 4 + Math.floor(h2(k, r.x, seed(103)) * Math.max(1, x1 - x0 - tw - 8)),
        y: y0 + 2 + Math.floor(h2(k, r.y, seed(104)) * Math.max(1, y1 - y0 - th - 14)),
        w: tw, h: th, k,
      });
    }
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * PW + x) * 4;
        // Only pixels the crates drew (not the floor showing between stacks).
        if (src[i] === undefined) continue;
        const col = x >> 4;
        const row = (y + 8) >> 4;
        const own = h2(col, row, seed(105));
        dim(d, i, 0.9 + fbm(x, y, 40, 30, seed(106)) * 0.34 + (own - 0.5) * 0.16);
        if (own > 0.86) mixTo(d, i, SILVER, 0.16);
        else if (own < 0.12) mixTo(d, i, HONEY, 0.18);
        // Damp running down: columns that stay dark from the top.
        if (h2(x >> 1, 3, seed(107)) < 0.14 && fbm(x, y, 9, 30, seed(108)) > 0.35) { dim(d, i, 0.74); }
        const mm = fbm(x, y, 20, 14, seed(109));
        if (mm > 0.8 && h2(x, y, seed(110)) > 0.4) mixTo(d, i, MOSS[Math.floor(h2(x >> 1, y >> 1, seed(111)) * 3)], 0.55);
        for (const t of tarps) {
          const edge = noise(x, y, 6, 6, seed(112 + t.k)) * 3;
          const inX = x >= t.x + edge && x < t.x + t.w - edge;
          const inY = y >= t.y + edge * 0.6 && y < t.y + t.h + Math.sin((x - t.x) * 0.5) * 2;
          if (!inX || !inY) continue;
          const fold = Math.sin((x - t.x) * 0.55 + t.k) * 0.5 + 0.5;
          const base = fold > 0.66 ? [150, 144, 124] : fold > 0.33 ? [118, 112, 96] : [88, 84, 72];
          const lit = 0.5 + 0.3 * Math.max(0, (y - t.y) / t.h);
          d[i] = base[0] * lit; d[i + 1] = base[1] * lit; d[i + 2] = base[2] * lit;
          // Rope lashings.
          if ((x - t.x) % 13 === 6) mixTo(d, i, ROT, 0.7);
          if (y === t.y + t.h - 1) mixTo(d, i, ROT, 0.5);
        }
      }
    }
  }

  // ---------------------------------------------------------------- the sea's edge (outdoors): a broken line of foam
  if (outdoors) {
    for (let y = 0; y < PH; y++) {
      for (let x = 0; x < PW; x++) {
        if (kp(x, y) !== 3) continue;
        // Near the hull: any non-water neighbour within 3 px.
        let nearHull = false;
        for (let k = 1; k <= 3 && !nearHull; k++) {
          for (const [dx, dy] of [[k, 0], [-k, 0], [0, k], [0, -k]]) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= PW || ny >= PH) continue;
            if (kp(nx, ny) !== 3) { nearHull = true; break; }
          }
        }
        if (!nearHull) continue;
        const i = (y * PW + x) * 4;
        const broken = fbm(x, y, 11, 5, seed(71));
        if (broken > 0.5 && h2(x, y, seed(72)) > 0.3) mixTo(d, i, FOAM, 0.4 + broken * 0.3);
        else dim(d, i, 0.8);
      }
    }
  }

  // ---------------------------------------------------------------- broken boards and deck patches
  const put = (x, y, c, a = 1) => {
    if (x < 0 || y < 0 || x >= PW || y >= PH) return;
    if (kp(x, y) !== 1) return;
    mixTo(d, (y * PW + x) * 4, c, a);
  };
  const putRaw = (x, y, c) => {
    if (x < 0 || y < 0 || x >= PW || y >= PH) return;
    if (kp(x, y) !== 1) return;
    const i = (y * PW + x) * 4;
    d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2];
  };
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W; tx++) {
      if (kind[ty * W + tx] !== 1 || keep.has(`${tx},${ty}`)) continue;
      const vert = vertical[ty * W + tx] === 1;
      const X0 = tx * T;
      const Y0 = ty * T;
      const near = dist[(Y0 + 8) * PW + X0 + 8] < 20;
      // A break in the boards.
      if (h2(tx, ty, seed(81)) < (near ? 0.07 : 0.035)) {
        const row = Math.floor(h2(tx, ty, seed(82)) * 4);
        const len = 6 + Math.floor(h2(tx, ty, seed(83)) * 14);
        const start = Math.floor(h2(tx, ty, seed(84)) * (T - len));
        const wideBoard = h2(tx, ty, seed(85)) < 0.3;
        const rows = wideBoard ? 6 : 3;
        for (let a = 0; a < len; a++) {
          for (let c = 0; c < rows; c++) {
            // Ragged ends: the first and last pixels of a row are missing on alternating rows.
            if ((a === 0 || a === len - 1) && ((c + tx) & 1)) continue;
            const x = vert ? X0 + row * 4 + c : X0 + start + a;
            const y = vert ? Y0 + start + a : Y0 + row * 4 + c;
            putRaw(x, y, BLACK);
          }
          // The joist showing across the gap: a 2 px dark timber a third of the way along.
          if (len >= 10 && (a === Math.floor(len * 0.35) || a === Math.floor(len * 0.35) + 1)) {
            for (let c = 0; c < rows; c++) putRaw(vert ? X0 + row * 4 + c : X0 + start + a, vert ? Y0 + start + a : Y0 + row * 4 + c, JOIST);
          }
        }
        // The lip of the board either side catches the light, a splinter points in.
        for (let c = 0; c < rows; c++) {
          const x0 = vert ? X0 + row * 4 + c : X0 + start - 1;
          const y0 = vert ? Y0 + start - 1 : Y0 + row * 4 + c;
          put(x0, y0, SPLINTER, 0.5);
          const x1 = vert ? x0 : X0 + start + len;
          const y1 = vert ? Y0 + start + len : y0;
          put(x1, y1, SPLINTER, 0.35);
        }
        put(vert ? X0 + row * 4 + 1 : X0 + start + 1, vert ? Y0 + start + 1 : Y0 + row * 4, SPLINTER, 0.7);
      }
    }
  }
  // Deck patches: a run of newer, paler boards laid across the old, nailed at the corners.
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W - 2; tx++) {
      if (h2(tx, ty, seed(91)) > 0.012) continue;
      let clear = true;
      for (let a = 0; a < 3 && clear; a++) if (kind[ty * W + tx + a] !== 1 || keep.has(`${tx + a},${ty}`) || vertical[ty * W + tx + a]) clear = false;
      if (!clear) continue;
      const pw = 30 + Math.floor(h2(tx, ty, seed(92)) * 14);
      const ph = 11;
      const px0 = tx * T + 3;
      const py0 = ty * T + 2 + Math.floor(h2(tx, ty, seed(93)) * 3);
      for (let a = 0; a < pw; a += 5) {
        const col = PATCH[Math.floor(h2(tx + a, ty, seed(94)) * 3)];
        for (let y = 0; y < ph; y++) {
          for (let x = 0; x < 4 && a + x < pw; x++) {
            const X = px0 + a + x;
            const Y = py0 + y;
            const dark = x === 3 ? 0.55 : x === 0 ? 1.1 : 1;
            putRaw(X, Y, [col[0] * dark * 0.8, col[1] * dark * 0.8, col[2] * dark * 0.8]);
          }
        }
      }
      for (let x = 0; x < pw; x++) { put(px0 + x, py0, BLACK, 0.55); put(px0 + x, py0 + ph - 1, BLACK, 0.6); }
      for (const [nx, ny] of [[2, 2], [pw - 3, 2], [2, ph - 3], [pw - 3, ph - 3]]) put(px0 + nx, py0 + ny, SALT, 0.8);
    }
  }

  ctx.putImageData(img, 0, 0);
}
