// The brig Fair Return's weathering (Chapter 5, the ghost ship), painted once into each ship room's
// picture after its tiles (Room.renderBackground), so it costs nothing while you play.
//
// The tiles draw every deck as the same laid boards, one 16 px square at a time, so left alone a
// ship reads as a grid of one wood. This pass goes over the finished picture and gives the
// whole ship a hundred years of weather, running across tile lines:
//
//  - old boards: big soft patches of silvered and honey-coloured wood, each strake drifting in tone
//    along its length (smoothly: no blocks); a few deck patches of newer, paler boards;
//  - damp: long dark water stains along the grain with a pale salt line round their edge and the
//    odd wet glint; moss and weed where it is wet and where the walls meet the floor; dark rot;
//  - broken boards: a short run of a board gone, black underneath, a joist showing, the ends
//    splintered (only ever a few pixels tall: a gap in the picture, not a hole you could fall in);
//  - shadow along every wall and a deeper one under the rail, so the deck sits down in its sides;
//  - the shape of a ship: inside corners rounded off, the light falling away toward her ends and
//    sides, and below decks her frames: a rib up the bulkhead under each beam, the beam's shadow
//    across the floor, a waterway plank round the edge, and the hull's side curving up out of the
//    deck where there used to be a black box;
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

// The deck's boards run fore and aft (left to right) everywhere, the poop deck too, except on a
// gangway: a narrow run of `o` (three tiles or fewer across), whose boards run across it, the way
// you walk. coastTiles.js asks this for each board tile, so the tiles and this pass agree.
const STRAKE = 6;
export function shipBoardsVertical(room, tx, ty) {
  const row = room?.tiles?.[ty];
  if (!row || row[tx] !== 'o') return false;
  let run = 1;
  for (let l = tx - 1; row[l] === 'o'; l--) run++;
  for (let r = tx + 1; row[r] === 'o'; r++) run++;
  return run <= 3;
}

// Distance from every pixel to the nearest pixel where `seed` is true (Euclidean, by passing the
// nearest seed's offset on from neighbour to neighbour). Gives the distance, and the offset from that
// nearest seed (ox, oy: this pixel minus the seed).
function distanceField(PW, PH, seed) {
  const N = PW * PH;
  const ox = new Int16Array(N);
  const oy = new Int16Array(N);
  const BIG = 4000;
  for (let i = 0; i < N; i++) if (!seed(i)) { ox[i] = BIG; oy[i] = BIG; }
  const tryFrom = (i, j, ax, ay) => {
    const nx = ox[j] + ax;
    const ny = oy[j] + ay;
    if (nx * nx + ny * ny < ox[i] * ox[i] + oy[i] * oy[i]) { ox[i] = nx; oy[i] = ny; }
  };
  for (let y = 0; y < PH; y++) {
    for (let x = 0; x < PW; x++) {
      const i = y * PW + x;
      if (x > 0) tryFrom(i, i - 1, 1, 0);
      if (y > 0) {
        tryFrom(i, i - PW, 0, 1);
        if (x > 0) tryFrom(i, i - PW - 1, 1, 1);
        if (x < PW - 1) tryFrom(i, i - PW + 1, -1, 1);
      }
    }
    for (let x = PW - 2; x >= 0; x--) { const i = y * PW + x; tryFrom(i, i + 1, -1, 0); }
  }
  for (let y = PH - 1; y >= 0; y--) {
    for (let x = PW - 1; x >= 0; x--) {
      const i = y * PW + x;
      if (x < PW - 1) tryFrom(i, i + 1, -1, 0);
      if (y < PH - 1) {
        tryFrom(i, i + PW, 0, -1);
        if (x < PW - 1) tryFrom(i, i + PW + 1, -1, -1);
        if (x > 0) tryFrom(i, i + PW - 1, 1, -1);
      }
    }
    for (let x = 1; x < PW; x++) { const i = y * PW + x; tryFrom(i, i - 1, 1, 0); }
  }
  const dist = new Float32Array(N);
  for (let i = 0; i < N; i++) dist[i] = Math.sqrt(ox[i] * ox[i] + oy[i] * oy[i]);
  return { dist, ox, oy };
}
const step = (a, b, t) => (t <= a ? 0 : t >= b ? 1 : smooth((t - a) / (b - a)));

// The hull's own timber, where it shows round the deck below: the ribs (frames) curving up out of the
// floor, the inner planking between them, a lit edge where it turns up from the deck.
const HULL = rgb('#3a3027');
const RIB = rgb('#4e4234');
const RIB_HI = rgb('#6a5a46');
const HULL_EDGE = rgb('#5e5242');
const FRAME = rgb('#2a221a');
const FRAME_HI = rgb('#5c4e3c');
const PEG = rgb('#22201a');

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
      if (shipBoardsVertical(room, tx, ty)) vertical[ty * W + tx] = 1;
    }
  }
  const kindAt = (tx, ty) => (tx < 0 || ty < 0 || tx >= W || ty >= H ? 0 : kind[ty * W + tx]);
  const letterAt = (x, y) => room.tiles[(y / T) | 0]?.[(x / T) | 0];
  // A corner rounded off (see below) counts as wall from then on.
  const fillet = new Uint8Array(PW * PH);
  const kp = (x, y) => (carved[y * PW + x] ? 3 : fillet[y * PW + x] ? 2 : kind[((y / T) | 0) * W + ((x / T) | 0)]);

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
    const R = 12;
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

  // And the other way: where her outline steps in (the bow's staircase of rail, a quay's inside corner),
  // the sea's corner fills in with the hull on a curve, so a run of steps reads as one sweep.
  if (outdoors) {
    // (Kept small: a bigger curve would start closing over real one-tile channels of water.)
    const RC = 7;
    const toHull = distanceField(PW, PH, (i) => { const k = kp(i % PW, (i / PW) | 0); return k === 1 || k === 2; });
    const toSea = distanceField(PW, PH, (i) => toHull.dist[i] > RC);
    for (let y = 0; y < PH; y++) {
      for (let x = 0; x < PW; x++) {
        const i = y * PW + x;
        if (kp(x, y) !== 3 || toSea.dist[i] <= RC + 0.35) continue;
        const j = ((y - toHull.oy[i]) * PW + (x - toHull.ox[i])) * 4;
        d[i * 4] = src[j]; d[i * 4 + 1] = src[j + 1]; d[i * 4 + 2] = src[j + 2];
        carved[i] = 0;
        fillet[i] = 1;
      }
    }
  }

  // ---------------------------------------------------------------- rounded corners
  // Where the deck meets the ship's side or a bulkhead in an inside corner, a ship is never square:
  // the corner fills in on a curve (the wall closed over by a circle of radius R). Only the picture:
  // you can still walk into the corner, it just doesn't look like a box.
  const R = outdoors ? 6 : 9;
  const toWall = distanceField(PW, PH, (i) => kp(i % PW, (i / PW) | 0) === 2);
  const toOpen = distanceField(PW, PH, (i) => toWall.dist[i] > R);
  for (let y = 0; y < PH; y++) {
    for (let x = 0; x < PW; x++) {
      const i = y * PW + x;
      if (kp(x, y) !== 1 || toOpen.dist[i] <= R + 0.35) continue;
      fillet[i] = 1;
      // It takes the colour of the wall it closes in from.
      const j = ((y - toWall.oy[i]) * PW + (x - toWall.ox[i])) * 4;
      d[i * 4] = src[j]; d[i * 4 + 1] = src[j + 1]; d[i * 4 + 2] = src[j + 2];
    }
  }

  // How far each floor pixel is from anything that isn't floor (the ambient shadow), and how far each
  // wall pixel is from the floor (the hull's side, below decks).
  const isFloor = (i) => kp(i % PW, (i / PW) | 0) === 1;
  const fromEdge = distanceField(PW, PH, (i) => !isFloor(i)).dist;
  const fromFloor = distanceField(PW, PH, isFloor);
  // Distance down to the next floor-or-nothing above (how far under the rail's shade a pixel is), by column.
  const CAP = 40;
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

  // The shape of the light: a ship is lit along her middle and goes dark toward her ends and her sides,
  // the deck humped a little along the centre line (her camber). Worked out from the floor's extent.
  let fx0 = PW;
  let fx1 = 0;
  let fy0 = PH;
  let fy1 = 0;
  for (let y = 0; y < PH; y += 2) {
    for (let x = 0; x < PW; x += 2) {
      if (kp(x, y) !== 1) continue;
      if (x < fx0) fx0 = x;
      if (x > fx1) fx1 = x;
      if (y < fy0) fy0 = y;
      if (y > fy1) fy1 = y;
    }
  }
  const lcx = (fx0 + fx1) / 2;
  const lcy = (fy0 + fy1) / 2;
  const lrx = Math.max(32, (fx1 - fx0) / 2 + 10);
  const lry = Math.max(24, (fy1 - fy0) / 2 + 10);

  // Below decks, the deck overhead stands on beams, and each beam on a frame (a rib) up the ship's side:
  // a frame up the back wall, the beam's shadow across the floor, a line of treenails where the deck
  // underfoot is pegged to its own beam. Evenly spaced, as a shipwright would.
  const beamGap = 56 + (salt % 3) * 8;
  const beamOff = (salt * 13) % beamGap;
  const beamAt = (x) => {
    const q = (((x - beamOff) % beamGap) + beamGap) % beamGap;
    return q - beamGap / 2;
  };

  // ---------------------------------------------------------------- the floor and the walls
  for (let y = 0; y < PH; y++) {
    for (let x = 0; x < PW; x++) {
      const k = kp(x, y);
      if (!k) continue;
      const i = (y * PW + x) * 4;
      const pi = y * PW + x;
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
      const di = fromEdge[pi];

      if (k === 1) {
        // Old boards: each strake drifts in tone along its length, and big soft patches of silvered and
        // honey-coloured wood lie across the deck. No hard blocks: it all runs on smoothly.
        const band = Math.floor(v / STRAKE);
        const off = h2(band, 1, seed(12)) * 97;
        const seg = Math.floor((u + off) / 97);
        const own = h2(band, seg, seed(13)) - 0.5;
        const tone = fbm(x, y, 110, 70, seed(11));
        dim(d, i, 0.8 + tone * 0.32 + own * 0.1 + (b - 0.5) * 0.03);
        const age = tone + own * 0.3;
        if (age < 0.42) mixTo(d, i, SILVER, Math.min(0.24, (0.42 - age) * 0.8));
        else if (age > 0.6) mixTo(d, i, HONEY, Math.min(0.22, (age - 0.6) * 0.8));

        // Water stains along the grain, flat dark with a salt line round the edge.
        const stn = fbm(vert ? y : x, vert ? x : y, 64, 18, seed(21));
        let wet = 0;
        if (stn > 0.68) {
          wet = stn > 0.71 ? 1 : 0.55;
          dim(d, i, 1 - 0.36 * wet);
          mixTo(d, i, STAIN, 0.24 * wet);
        } else if (stn > 0.66) {
          mixTo(d, i, SALT, 0.18);
        }
        if (wet > 0.9 && v % STRAKE === 1 && h2(u >> 3, band, seed(23)) < 0.3) mixTo(d, i, GLINT, 0.45);

        // Moss and weed: where it is wet and along the walls.
        const mm = fbm(x, y, 22, 18, seed(31));
        const near = 1 - Math.min(1, di / 22);
        const mv = mm * 0.7 + near * 0.3 + wet * 0.14;
        if (mv + (b - 0.5) * 0.08 > 0.82 && h2(x, y, seed(32)) > 0.3) {
          mixTo(d, i, MOSS[Math.floor(h2(x >> 1, y >> 1, seed(33)) * 4)], 0.55);
        } else if (mv > 0.76 && v % STRAKE === 5 && h2(x, y, seed(34)) < 0.8) {
          mixTo(d, i, MOSS[3], 0.65);
        }

        // Rot: dark crumbly wood in a few places.
        const rotMask = fbm(x, y, 70, 46, seed(41));
        if (rotMask > 0.72) {
          const r = noise(x, y, 7, 5, seed(42));
          if (r > 0.5 - (rotMask - 0.72) * 0.6) {
            mixTo(d, i, ROT, 0.45 + 0.3 * h2(x, y, seed(43)));
            if (h2(x, y, seed(44)) < 0.06) mixTo(d, i, SPLINTER, 0.35);
          }
        }

        if (!outdoors) {
          // The beams overhead: a soft band of shadow across the floor under each, and the deck's pegs.
          const ba = beamAt(x);
          const bx = Math.abs(ba);
          if (bx < 9) dim(d, i, 1 - 0.2 * (1 - step(3, 9, bx + (b - 0.5) * 1.5)));
          if ((ba === -3 || ba === 3) && v % STRAKE === 2 && !vert) mixTo(d, i, PEG, 0.8);
          // The waterway: a broad plank laid round the edge of the deck where it meets the ship's side.
          if (di < 4 && toWall.dist[pi] < 5.5) {
            mixTo(d, i, HULL, di < 1.5 ? 0.75 : 0.5);
            if (di >= 3) mixTo(d, i, HULL_EDGE, 0.45);
          }
        }

        // The light: brightest down her middle, falling off toward her ends and sides.
        const ex = (x - lcx) / lrx;
        const ey = (y - lcy) / lry;
        const e = ex * ex + ey * ey;
        dim(d, i, (1 - 0.3 * step(0.45, 1.2, e + (b - 0.5) * 0.04)) * (1 + 0.06 * Math.max(0, 1 - Math.abs(ey) * 1.6)));

        // Ambient shadow: the deck sits down in its sides, deepest under the rail.
        if (di < 12) dim(d, i, 1 - 0.42 * Math.pow(1 - di / 12, 1.6) - (b - 0.5) * 0.04);
        const up = under[pi];
        if (up < 16) dim(d, i, 1 - 0.3 * (1 - up / 16));
      } else {
        const letter = letterAt(x, y);
        const fd = fromFloor.dist[pi];
        if (!outdoors && (letter === '#' || fillet[pi]) && fd < 18 && !(fillet[pi] && letter === 'W')) {
          // Below decks, the ship's side where it rises from the floor: not a black box but her hull,
          // the ribs curving up out of the deck and the planking between them, fading into the dark.
          const ax = Math.abs(fromFloor.ox[pi]);
          const ay = Math.abs(fromFloor.oy[pi]);
          const along = ay >= ax ? x : y;
          const t = fd / 18;
          const ribQ = (((along + Math.floor(fd * 0.5) + salt) % 13) + 13) % 13;
          const col = ribQ === 0 ? RIB_HI : ribQ < 3 ? RIB : HULL;
          mixTo(d, i, col, 0.92 * Math.pow(1 - t, 1.3));
          if (ribQ >= 3 && Math.floor(fd) % 4 === 0) dim(d, i, 0.82);
          if (fd < 2.2) mixTo(d, i, HULL_EDGE, 0.55);
          dim(d, i, 1 - 0.45 * t);
          continue;
        }
        if (fillet[pi]) {
          // Outdoors (or against a bulkhead's face): the corner's curve gets a lit lip.
          if (fd < 1.6) mixTo(d, i, HULL_EDGE, 0.45);
          continue;
        }
        // Walls: weather them too (the same wood, the same patches), and run drips down them.
        const tone = fbm(x, y, 50, 22, seed(51));
        dim(d, i, 0.8 + tone * 0.38 + (b - 0.5) * 0.05);
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
        // Below decks, a frame standing up the bulkhead under each beam, its knee flaring at the foot.
        if (!outdoors && letter === 'W') {
          const bx = beamAt(x);
          const foot = T - 1 - (y % T);
          if (bx >= -3 && bx <= 3) {
            mixTo(d, i, FRAME, 0.85);
            if (bx === -3) mixTo(d, i, FRAME_HI, 0.7);
            if (bx === 3) dim(d, i, 0.6);
          } else if (Math.abs(bx) <= 7 && foot < (8 - Math.abs(bx)) * 1.5) {
            mixTo(d, i, FRAME, 0.8);
            if (foot === Math.floor((8 - Math.abs(bx)) * 1.5) - 1) mixTo(d, i, FRAME_HI, 0.5);
          }
          // The light falls off up the wall, toward the beams.
          dim(d, i, 0.8 + 0.2 * ((y % T) / T));
        }
      }
    }
  }

  // ---------------------------------------------------------------- stowed cargo (a room's `cargo` boxes)
  // The stow is drawn tile by tile (crates, barrels and sacks: coastTiles.js). Give each its own age,
  // run damp down the faces, and lay a few tarpaulins roped over the stacks, ragged at the edges.
  for (const r of room.cargo ?? []) {
    const x0 = r.x * T;
    const x1 = (r.x + r.w) * T;
    const y0 = Math.max(0, r.y * T - 24);
    const y1 = (r.y + r.h) * T;
    const tarps = [];
    const count = Math.max(1, Math.round(r.w / 5));
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
        if (src[i] === undefined) continue;
        const col = x >> 4;
        const row = (y + 8) >> 4;
        const own = h2(col, row, seed(105));
        dim(d, i, 0.76 + fbm(x, y, 40, 30, seed(106)) * 0.26 + (own - 0.5) * 0.12);
        if (own > 0.86) mixTo(d, i, SILVER, 0.14);
        else if (own < 0.12) mixTo(d, i, HONEY, 0.16);
        if (h2(x >> 1, 3, seed(107)) < 0.12 && fbm(x, y, 9, 30, seed(108)) > 0.35) { dim(d, i, 0.78); }
        const mm = fbm(x, y, 20, 14, seed(109));
        if (mm > 0.8 && h2(x, y, seed(110)) > 0.4) mixTo(d, i, MOSS[Math.floor(h2(x >> 1, y >> 1, seed(111)) * 3)], 0.5);
        for (const t of tarps) {
          const edge = noise(x, y, 6, 6, seed(112 + t.k)) * 3;
          const inX = x >= t.x + edge && x < t.x + t.w - edge;
          const inY = y >= t.y + edge * 0.6 && y < t.y + t.h + Math.sin((x - t.x) * 0.5) * 2;
          if (!inX || !inY) continue;
          const fold = Math.sin((x - t.x) * 0.55 + t.k) * 0.5 + 0.5;
          const base = fold > 0.66 ? [122, 118, 102] : fold > 0.33 ? [98, 94, 80] : [74, 70, 60];
          const lit = 0.5 + 0.3 * Math.max(0, (y - t.y) / t.h);
          d[i] = base[0] * lit; d[i + 1] = base[1] * lit; d[i + 2] = base[2] * lit;
          if ((x - t.x) % 13 === 6) mixTo(d, i, ROT, 0.7);
          if (y === t.y + t.h - 1) mixTo(d, i, ROT, 0.5);
        }
        // The hold's light falls on the stow too: darker toward the ship's ends.
        const ex = (x - lcx) / lrx;
        const ey = (y - lcy) / lry;
        dim(d, i, 1 - 0.28 * step(0.45, 1.2, ex * ex + ey * ey));
      }
    }
  }

  // ---------------------------------------------------------------- the sea's edge (outdoors): a broken line of foam
  if (outdoors) {
    for (let y = 0; y < PH; y++) {
      for (let x = 0; x < PW; x++) {
        if (kp(x, y) !== 3) continue;
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
      const near = fromEdge[(Y0 + 8) * PW + X0 + 8] < 20;
      // A break in one strake: a short run of it gone, black under, the joist showing, the ends splintered.
      if (h2(tx, ty, seed(81)) < (near ? 0.06 : 0.03)) {
        const V0 = vert ? X0 : Y0;
        const first = Math.ceil(V0 / STRAKE) * STRAKE;
        const sv = first + (h2(tx, ty, seed(82)) < 0.5 || first + STRAKE + 5 > V0 + T ? 0 : STRAKE);
        const len = 8 + Math.floor(h2(tx, ty, seed(83)) * 8);
        const start = Math.floor(h2(tx, ty, seed(84)) * (T - len));
        const A0 = vert ? Y0 : X0;
        const at = (a, c) => (vert ? [sv + c, A0 + start + a] : [A0 + start + a, sv + c]);
        for (let a = 0; a < len; a++) {
          for (let c = 0; c < 5; c++) {
            if ((a === 0 || a === len - 1) && ((c + tx) & 1)) continue;
            putRaw(...at(a, c), BLACK);
          }
          if (len >= 10 && (a === Math.floor(len * 0.35) || a === Math.floor(len * 0.35) + 1)) {
            for (let c = 0; c < 5; c++) putRaw(...at(a, c), JOIST);
          }
        }
        for (let c = 0; c < 5; c++) {
          put(...at(-1, c), SPLINTER, 0.5);
          put(...at(len, c), SPLINTER, 0.35);
        }
        put(...at(1, 0), SPLINTER, 0.7);
      }
    }
  }
  // Deck patches: two strakes of newer, paler board let into the old, pegged at the ends.
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W - 2; tx++) {
      if (h2(tx, ty, seed(91)) > 0.012) continue;
      let clear = true;
      for (let a = 0; a < 3 && clear; a++) if (kind[ty * W + tx + a] !== 1 || keep.has(`${tx + a},${ty}`) || vertical[ty * W + tx + a]) clear = false;
      if (!clear) continue;
      const pw = 30 + Math.floor(h2(tx, ty, seed(92)) * 14);
      const px0 = tx * T + 3;
      const sv = Math.ceil((ty * T) / STRAKE) * STRAKE;
      for (let s = 0; s < 2; s++) {
        const col = PATCH[Math.floor(h2(tx + s, ty, seed(94)) * 3)];
        const shift = s * Math.floor(h2(tx, ty, seed(95)) * 10);
        for (let y = 0; y < 5; y++) {
          for (let x = shift; x < pw; x++) {
            const lit = y === 0 ? 1.12 : y === 4 ? 0.7 : 0.92;
            putRaw(px0 + x, sv + s * STRAKE + y, [col[0] * lit * 0.82, col[1] * lit * 0.82, col[2] * lit * 0.82]);
          }
        }
        for (const nx of [shift + 2, pw - 3]) { put(px0 + nx, sv + s * STRAKE + 1, PEG, 0.8); put(px0 + nx, sv + s * STRAKE + 3, PEG, 0.8); }
      }
    }
  }

  ctx.putImageData(img, 0, 0);
}
