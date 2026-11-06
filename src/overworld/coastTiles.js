// Chapter 5's coast, drawn tile by tile like the rest of the world (see
// tileset.js): the sunny beach of Gullrest, then the green-storm shore from
// the Wrack Shore to the Last Light.
//
// Each area keeps the usual letters but draws them its own way. A room just
// says `area: 'wrack'` (and so on) and writes its map as any other room does;
// every letter keeps the solidity and height it has everywhere else (a `~` is
// water, an `O` blocks you, a `b` is a 12 px step). tileset.js calls
// installCoastTiles once, after brightTiles. The letter tables are in
// notes/docs/chapter-5-builders-guide.md ("Coast tiles, atmosphere and
// ambiences").
//
// How it is built: each area is a small CONFIG (a palette, and which kind of
// ground, wall, stone and so on each letter is) that buildLook() turns into
// the drawing functions. The green storm itself (the dark teal shade, the
// rain, the lightning) is not painted into the tiles: it is laid over the
// room by lamplight.js (AREA_AMBIENT) and atmosphere.js. So the tiles are
// painted in their own daylight colours, a little brighter than they should
// finally look, and the storm pulls them down.
//
// coastTileLights() says what glows in the tiles (lit windows, lamp niches,
// the sea-glass of the Soundings): lamplight.js adds them to the room's lights.

const T = 16;

export const COAST_AREAS = new Set(['gullrest', 'wrack', 'saltcombe', 'lanes', 'wreck', 'merrow', 'soundings', 'isles', 'haddock_light', 'reach', 'lastlight']);

// --- Little helpers (the same ones brightTiles.js has) ---
function hash(tx, ty, salt = 0) {
  let h = (tx * 374761393 + ty * 668265263 + salt * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const pick = (list, roll) => list[Math.floor(roll * list.length)];
const px = (ctx, color, x, y, w = 1, h = 1) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };
const rnd = (tx, ty, salt, n) => Math.floor(hash(tx, ty, salt) * n);
const at = (room, tx, ty, dx = 0, dy = 0) => room?.tileAt(tx + dx, ty + dy);
function mottle(ctx, color, x, y, tx, ty, salt, size = 6) {
  const mx = rnd(tx, ty, salt, T - size);
  const my = rnd(tx, ty, salt + 1, T - size);
  px(ctx, color, x + mx, y + my + 1, size, size - 2);
  px(ctx, color, x + mx + 1, y + my, size - 2, size);
}
function oval(ctx, color, cx, cy, rx, ry) {
  for (let dy = -ry; dy <= ry; dy++) {
    const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.25))));
    px(ctx, color, cx - w, cy + dy, w * 2 + 1, 1);
  }
}
function shade(ctx, x, y, w, h, alpha, rgb = '0, 0, 0') {
  ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
  ctx.fillRect(x, y, w, h);
}
// '#aabbcc' as 'r, g, b' (for a soft stroke).
function hexRgb(hex) {
  const n = parseInt(hex.slice(1, 7), 16);
  return `${n >> 16}, ${(n >> 8) & 255}, ${n & 255}`;
}
const WALLISH = '#WVHKk5678awehM';
const isWallish = (c) => c != null && WALLISH.includes(c);
const isSea = (c) => c === '~' || c === '0';

// =====================================================================
// Ground. Every kind paints a whole tile, then the edges (a wall's shadow
// from above, the wet dark band where the sea reaches it).
// =====================================================================
function edges(ctx, x, y, tx, ty, room, p) {
  if (!room) return;
  if (isWallish(at(room, tx, ty, 0, -1))) { shade(ctx, x, y, T, 3, 0.4, p.shadow); shade(ctx, x, y + 3, T, 2, 0.18, p.shadow); }
  // Where the sea reaches the ground: a darker, wetter band and a bright wet line.
  const wet = (cond, bx, by, bw, bh, lx, ly, lw, lh) => {
    if (!cond) return;
    shade(ctx, x + bx, y + by, bw, bh, 0.28, p.wetShade ?? '10, 30, 40');
    px(ctx, p.wetLine, x + lx, y + ly, lw, lh);
  };
  wet(isSea(at(room, tx, ty, 0, 1)), 0, 11, T, 5, 0, 10, T, 1);
  wet(isSea(at(room, tx, ty, -1, 0)), 0, 0, 4, T, 4, 0, 1, T);
  wet(isSea(at(room, tx, ty, 1, 0)), 12, 0, 4, T, 11, 0, 1, T);
  wet(isSea(at(room, tx, ty, 0, -1)), 0, 0, T, 4, 0, 4, T, 1);
}
function base(ctx, x, y, tx, ty, p, salt = 0) {
  px(ctx, pick(p.ground, hash(tx, ty, 1 + salt)), x, y, T, T);
  mottle(ctx, pick([p.hi, p.lo, p.hi], hash(tx, ty, 2 + salt)), x, y, tx, ty, 3 + salt, 8);
  if (hash(tx, ty, 6 + salt) < 0.5) mottle(ctx, p.lo, x, y, tx, ty, 7 + salt, 5);
}
function glints(ctx, x, y, tx, ty, p, chance = 0.3) {
  if (!p.glint) return;
  if (hash(tx, ty, 90) < chance) px(ctx, p.glint, x + 2 + rnd(tx, ty, 91, 9), y + 3 + rnd(tx, ty, 92, 9), 3 + rnd(tx, ty, 93, 3), 1);
  if (hash(tx, ty, 94) < chance * 0.6) px(ctx, p.glint, x + 1 + rnd(tx, ty, 95, 9), y + 10 + rnd(tx, ty, 96, 4), 2, 1);
}

const GROUND = {
  // Soft sand: ripple lines, grains, the odd shell.
  sand(ctx, x, y, tx, ty, room, p) {
    base(ctx, x, y, tx, ty, p);
    for (let i = 0; i < 2; i++) {
      const ry = y + 3 + i * 7 + rnd(tx, ty, 10 + i, 4);
      px(ctx, p.hi, x + rnd(tx, ty, 12 + i, 5), ry, 5 + rnd(tx, ty, 14 + i, 5), 1);
      px(ctx, p.lo, x + rnd(tx, ty, 16 + i, 5) + 1, ry + 1, 4 + rnd(tx, ty, 18 + i, 4), 1);
    }
    for (let i = 0; i < 6; i++) px(ctx, pick(p.speck, hash(tx, ty, 20 + i)), x + rnd(tx, ty, 26 + i, 15), y + rnd(tx, ty, 32 + i, 15));
    if (p.shells && hash(tx, ty, 40) < 0.08) {
      const sx = x + 3 + rnd(tx, ty, 41, 9);
      const sy = y + 3 + rnd(tx, ty, 42, 9);
      px(ctx, pick(p.shells, hash(tx, ty, 43)), sx, sy, 2, 2);
      px(ctx, '#ffffff', sx, sy, 1, 1);
    }
    glints(ctx, x, y, tx, ty, p, 0.15);
    edges(ctx, x, y, tx, ty, room, p);
  },
  // Pebbles and broken shell, sorted by the tide.
  shingle(ctx, x, y, tx, ty, room, p) {
    base(ctx, x, y, tx, ty, p);
    for (let i = 0; i < 13; i++) {
      const cx = x + 1 + rnd(tx, ty, 50 + i, 14);
      const cy = y + 2 + rnd(tx, ty, 70 + i, 12);
      const rx = 1 + rnd(tx, ty, 90 + i, 2);
      oval(ctx, pick(p.speck, hash(tx, ty, 110 + i)), cx, cy, rx, 1);
      px(ctx, p.hi, cx - rx + 1, cy - 1, Math.max(1, rx), 1);
      if (i % 3 === 0) px(ctx, p.lo, cx - rx, cy + 1, rx * 2 + 1, 1);
    }
    glints(ctx, x, y, tx, ty, p, 0.35);
    edges(ctx, x, y, tx, ty, room, p);
  },
  // Flat slabs of rock, wet, with hairline cracks.
  rockfloor(ctx, x, y, tx, ty, room, p) {
    base(ctx, x, y, tx, ty, p);
    if (hash(tx, ty, 11) < 0.7) px(ctx, p.lo, x + rnd(tx, ty, 12, 10), y + rnd(tx, ty, 13, 14) + 1, 5 + rnd(tx, ty, 14, 7), 1);
    if (hash(tx, ty, 15) < 0.4) px(ctx, p.lo, x + rnd(tx, ty, 16, 14) + 1, y + 2, 1, 5 + rnd(tx, ty, 17, 8));
    for (let i = 0; i < 4; i++) px(ctx, pick(p.speck, hash(tx, ty, 20 + i)), x + rnd(tx, ty, 26 + i, 15), y + rnd(tx, ty, 32 + i, 15), 1 + (i % 2), 1);
    if (hash(tx, ty, 8) < 0.07) {
      let cx = 3 + rnd(tx, ty, 48, 9);
      for (let cy = 3; cy < 12; cy++) { px(ctx, p.crack, x + cx, y + cy); cx = Math.max(1, Math.min(14, cx + (hash(tx, ty, 50 + cy) < 0.5 ? -1 : 1))); }
    }
    glints(ctx, x, y, tx, ty, p, 0.4);
    edges(ctx, x, y, tx, ty, room, p);
  },
  // Cobbles, round and close, mud in the joints.
  cobbles(ctx, x, y, tx, ty, room, p) {
    px(ctx, p.gap, x, y, T, T);
    for (let r = 0; r < 2; r++) {
      const off = (r + tx + ty) % 2 ? 4 : 0;
      for (let bx = -off; bx < T; bx += 8) {
        const sx = Math.max(0, bx);
        const w = Math.min(bx + 8, T) - sx;
        if (w < 3) continue;
        const cy = y + r * 8;
        px(ctx, pick(p.ground, hash(tx * 3 + bx, ty * 5 + r, 61)), x + sx, cy + 1, w - 1, 7);
        px(ctx, pick(p.ground, hash(tx * 3 + bx, ty * 5 + r, 62)), x + sx + 1, cy, w - 3, 8);
        px(ctx, p.hi, x + sx + 1, cy + 1, Math.max(1, w - 4), 1);
        px(ctx, p.lo, x + sx + 1, cy + 6, Math.max(1, w - 3), 1);
      }
    }
    if (hash(tx, ty, 63) < p.moss) mottle(ctx, p.mossColor, x, y, tx, ty, 64, 5);
    glints(ctx, x, y, tx, ty, p, 0.3);
    edges(ctx, x, y, tx, ty, room, p);
  },
  // Squared flagstones with joints.
  flags(ctx, x, y, tx, ty, room, p) {
    const layout = hash(tx, ty, 1);
    const slabs = layout < 0.4 ? [[0, 0, 16, 16]] : layout < 0.75 ? (hash(tx, ty, 2) < 0.5 ? [[0, 0, 16, 8], [0, 8, 16, 8]] : [[0, 0, 8, 16], [8, 0, 8, 16]]) : [[0, 0, 8, 8], [8, 0, 8, 8], [0, 8, 8, 8], [8, 8, 8, 8]];
    px(ctx, p.gap, x, y, T, T);
    slabs.forEach(([sx, sy, w, h], i) => {
      px(ctx, pick(p.ground, hash(tx, ty, 10 + i)), x + sx, y + sy, w - 1, h - 1);
      px(ctx, p.hi, x + sx, y + sy, w - 1, 1);
      px(ctx, p.lo, x + sx, y + sy + h - 2, w - 1, 1);
    });
    for (let i = 0; i < 3; i++) if (hash(tx, ty, 20 + i) < 0.5) px(ctx, pick(p.speck, hash(tx, ty, 24 + i)), x + rnd(tx, ty, 28 + i, 14), y + rnd(tx, ty, 32 + i, 14));
    glints(ctx, x, y, tx, ty, p, 0.3);
    edges(ctx, x, y, tx, ty, room, p);
  },
  // Boards: dark gaps, nails, the grain, rain-wet along the grain.
  planks(ctx, x, y, tx, ty, room, p, vertical = false) {
    px(ctx, p.gap, x, y, T, T);
    for (let i = 0; i < 4; i++) {
      const colour = pick(p.plank, hash(tx * (vertical ? 4 : 1) + (vertical ? i : 0), ty * (vertical ? 1 : 4) + (vertical ? 0 : i), 71));
      const jx = rnd(tx, ty * 4 + i, 72, 8) + 3;
      if (vertical) {
        px(ctx, colour, x + i * 4, y, 3, T);
        px(ctx, p.plankHi, x + i * 4, y, 1, T);
        px(ctx, p.plankLo, x + i * 4 + 2, y, 1, T);
        if (hash(tx, ty * 4 + i, 74) < 0.8) { px(ctx, p.gap, x + i * 4, y + jx, 3, 1); }
        px(ctx, p.nail, x + i * 4 + 1, y + 1, 1, 1);
        px(ctx, p.nail, x + i * 4 + 1, y + T - 3, 1, 1);
      } else {
        px(ctx, colour, x, y + i * 4, T, 3);
        px(ctx, p.plankHi, x, y + i * 4, T, 1);
        px(ctx, p.plankLo, x, y + i * 4 + 2, T, 1);
        if (hash(tx, ty * 4 + i, 74) < 0.8) { px(ctx, p.gap, x + jx, y + i * 4, 1, 3); }
        px(ctx, p.nail, x + 1, y + i * 4 + 1, 1, 1);
        px(ctx, p.nail, x + T - 3, y + i * 4 + 1, 1, 1);
      }
    }
    // Wet along the boards, and the odd knot.
    if (p.glint && hash(tx, ty, 75) < 0.4) px(ctx, p.glint, x + 1 + rnd(tx, ty, 76, 5), y + 1 + rnd(tx, ty, 77, 3) * 4, 6 + rnd(tx, ty, 78, 6), 1);
    if (hash(tx, ty, 79) < 0.1) px(ctx, p.gap, x + 3 + rnd(tx, ty, 80, 9), y + 1 + rnd(tx, ty, 81, 3) * 4, 2, 1);
    edges(ctx, x, y, tx, ty, room, p);
  },
  // Iron deck plate: riveted squares, rust bleeding down from the rivets.
  plate(ctx, x, y, tx, ty, room, p) {
    base(ctx, x, y, tx, ty, p);
    px(ctx, p.lo, x, y + 7, T, 1);
    px(ctx, p.lo, x + 7, y, 1, T);
    px(ctx, p.hi, x, y + 8, T, 1);
    px(ctx, p.hi, x + 8, y, 1, T);
    for (const [rx, ry] of [[2, 2], [12, 2], [2, 12], [12, 12], [5, 5], [10, 10]]) if (hash(tx, ty, 90 + rx * 7 + ry) < 0.7) {
      px(ctx, p.hi, x + rx, y + ry, 2, 1);
      px(ctx, p.lo, x + rx, y + ry + 1, 2, 1);
      if (hash(tx, ty, 130 + rx + ry) < 0.4) px(ctx, p.rust, x + rx, y + ry + 2, 1, 2 + rnd(tx, ty, 140 + rx, 4));
    }
    if (hash(tx, ty, 150) < 0.35) mottle(ctx, p.rust, x, y, tx, ty, 151, 6);
    glints(ctx, x, y, tx, ty, p, 0.3);
    edges(ctx, x, y, tx, ty, room, p);
  },
  // Turf and sea-grass: blades in tufts, flattened by the wind.
  turf(ctx, x, y, tx, ty, room, p) {
    px(ctx, pick(p.turf, hash(tx, ty, 1)), x, y, T, T);
    mottle(ctx, pick(p.turf, hash(tx, ty, 2)), x, y, tx, ty, 3, 8);
    mottle(ctx, p.turfLo, x, y, tx, ty, 5, 6);
    for (let i = 0; i < 8; i++) {
      const bx = x + rnd(tx, ty, 10 + i, 15);
      const by = y + 1 + rnd(tx, ty, 20 + i, 13);
      px(ctx, i % 2 ? p.turfLo : p.turfHi, bx, by, 1, 2);
      if (i % 3 === 0) px(ctx, p.turfHi, bx + 1, by - 1, 1, 1);
    }
    if (p.flowers && hash(tx, ty, 40) < 0.14) {
      const fx = x + 3 + rnd(tx, ty, 41, 10);
      const fy = y + 3 + rnd(tx, ty, 42, 9);
      px(ctx, pick(p.flowers, hash(tx, ty, 43)), fx, fy, 2, 2);
    }
    edges(ctx, x, y, tx, ty, room, p);
  },
  // A trodden way: bare ground, ruts and prints.
  path(ctx, x, y, tx, ty, room, p) {
    px(ctx, pick(p.path, hash(tx, ty, 1)), x, y, T, T);
    mottle(ctx, pick(p.path, hash(tx, ty, 2)), x, y, tx, ty, 3, 8);
    for (let i = 0; i < 7; i++) px(ctx, pick(p.speck, hash(tx, ty, 10 + i)), x + rnd(tx, ty, 20 + i, 15), y + rnd(tx, ty, 30 + i, 15));
    if (hash(tx, ty, 40) < 0.3) px(ctx, p.lo, x, y + 4 + rnd(tx, ty, 41, 8), T, 1);
    if (hash(tx, ty, 42) < 0.3) px(ctx, p.hi, x + 2, y + 5 + rnd(tx, ty, 43, 8), 10, 1);
    glints(ctx, x, y, tx, ty, p, 0.3);
    edges(ctx, x, y, tx, ty, room, p);
  },
};

// =====================================================================
// Water. Static: the pictures are painted once, so the movement comes from
// atmosphere.js (foam creeping along the edges, glints, rain, spray).
// =====================================================================
function water(ctx, x, y, tx, ty, room, p, deep = false) {
  const w = deep ? p.deep : p.water;
  px(ctx, w, x, y, T, T);
  mottle(ctx, deep ? p.water : p.deep, x, y, tx, ty, 3, 8);
  // Wave strokes: a lit crest over a dark trough.
  for (let i = 0; i < 3; i++) {
    const wy = y + 2 + i * 5 + rnd(tx, ty, 10 + i, 3);
    const wx = x + rnd(tx, ty, 14 + i, 9);
    const len = 3 + rnd(tx, ty, 18 + i, 5);
    px(ctx, p.wave, wx, wy, len, 1);
    px(ctx, p.troughs, wx + 1, wy + 1, len, 1);
  }
  if (hash(tx, ty, 30) < p.caps) {
    const cx = x + 2 + rnd(tx, ty, 31, 11);
    const cy = y + 3 + rnd(tx, ty, 32, 9);
    px(ctx, p.foam, cx, cy, 3, 1);
    px(ctx, p.foam, cx + 1, cy - 1, 1, 1);
  }
  if (!room) return;
  const above = at(room, tx, ty, 0, -1);
  if (!isSea(above)) {
    // The bank above: a dark lip and its reflection.
    px(ctx, p.lip, x, y, T, 2);
    shade(ctx, x, y + 2, T, 3, 0.3, p.shadow);
    if (isWallish(above)) shade(ctx, x, y + 5, T, 2, 0.15, p.shadow);
  }
  // Land to the sides: a calm, darker strip where the water laps it.
  if (!isSea(at(room, tx, ty, -1, 0)) && at(room, tx, ty, -1, 0) != null) shade(ctx, x, y, 2, T, 0.25, p.shadow);
  if (!isSea(at(room, tx, ty, 1, 0)) && at(room, tx, ty, 1, 0) != null) shade(ctx, x + T - 2, y, 2, T, 0.25, p.shadow);
  // And foam where it breaks (atmosphere.js moves it).
  if (at(room, tx, ty, 0, 1) != null && !isSea(at(room, tx, ty, 0, 1))) { px(ctx, p.foam, x, y + T - 2, T, 1); shade(ctx, x, y + T - 4, T, 2, 0.25, '255, 255, 255'); }
}

// Shallows you can wade: the bottom shows through, pale and rippled.
function shallows(ctx, x, y, tx, ty, room, p) {
  px(ctx, p.shallow, x, y, T, T);
  mottle(ctx, p.shallowHi, x, y, tx, ty, 3, 9);
  for (let i = 0; i < 6; i++) px(ctx, pick(p.speck, hash(tx, ty, 10 + i)), x + rnd(tx, ty, 16 + i, 15), y + rnd(tx, ty, 22 + i, 15));
  for (let i = 0; i < 2; i++) {
    const wy = y + 3 + i * 7 + rnd(tx, ty, 30 + i, 3);
    px(ctx, p.wave, x + rnd(tx, ty, 34 + i, 8), wy, 4 + rnd(tx, ty, 36 + i, 4), 1);
  }
  if (hash(tx, ty, 40) < 0.2) px(ctx, p.foam, x + 2 + rnd(tx, ty, 41, 10), y + 2 + rnd(tx, ty, 42, 10), 2, 1);
  if (room && at(room, tx, ty, 0, -1) !== ';' && at(room, tx, ty, 0, -1) !== 'j') shade(ctx, x, y, T, 2, 0.2, p.shadow);
}

// Stepping stones through the water (you can walk them).
function stones(ctx, x, y, tx, ty, room, p) {
  water(ctx, x, y, tx, ty, room, p);
  const n = 1 + rnd(tx, ty, 1, 2);
  for (let i = 0; i < n; i++) {
    const cx = x + 4 + rnd(tx, ty, 2 + i, 8);
    const cy = y + 5 + rnd(tx, ty, 6 + i, 6);
    shade(ctx, cx - 5, cy + 2, 11, 2, 0.3, p.shadow);
    oval(ctx, p.stoneDark, cx, cy, 5, 3);
    oval(ctx, p.stone, cx, cy - 1, 4, 2);
    px(ctx, p.stoneHi, cx - 2, cy - 2, 3, 1);
    px(ctx, p.foam, cx - 5, cy + 3, 3, 1);
  }
}

// =====================================================================
// Walls.
// =====================================================================
const WALLS = {
  // Cliff or cave rock. Top: the dark mass; face: banded strata.
  rockTop(ctx, x, y, tx, ty, room, p) {
    px(ctx, p.deepRock, x, y, T, T);
    if (hash(tx, ty, 1) < 0.6) px(ctx, p.topRock, x + rnd(tx, ty, 2, 9), y + rnd(tx, ty, 3, 9), 6, 5);
    if (hash(tx, ty, 4) < 0.4) px(ctx, p.deepRock2, x + rnd(tx, ty, 5, 11), y + rnd(tx, ty, 6, 11), 4, 3);
    if (hash(tx, ty, 7) < 0.12 && p.fleck) px(ctx, p.fleck, x + rnd(tx, ty, 8, 13) + 1, y + rnd(tx, ty, 9, 13) + 1, 1, 1);
    if (!room) return;
    const below = at(room, tx, ty, 0, 1);
    if (below != null && below !== '#') {
      px(ctx, p.rockLo, x, y + T - 3, T, 2);
      px(ctx, p.rim, x, y + T - 3, T, 1);
      px(ctx, p.deepRock2, x, y + T - 1, T, 1);
    }
    const left = at(room, tx, ty, -1, 0);
    const right = at(room, tx, ty, 1, 0);
    if (left != null && !isWallish(left)) px(ctx, p.rockLo, x, y, 1, T);
    if (right != null && !isWallish(right)) px(ctx, p.rockLo, x + T - 1, y, 1, T);
  },
  rockFace(ctx, x, y, tx, ty, room, p) {
    for (let band = 0; band < 4; band++) {
      const by = y + band * 4;
      px(ctx, pick(p.rock, hash(tx, ty * 4 + band, 430)), x, by, T, 4);
      if (hash(tx, ty * 4 + band, 437) < 0.5) shade(ctx, x + rnd(tx, ty * 4 + band, 431, 7), by, 4 + rnd(tx, ty * 4 + band, 432, 8), 1, 0.4, hexRgb(p.rim));
      shade(ctx, x + rnd(tx, ty * 4 + band, 433, 9), by + 3, 3 + rnd(tx, ty * 4 + band, 434, 7), 1, 0.5, hexRgb(p.rockLo));
    }
    if (hash(tx, ty, 435) < 0.4) {
      const cx = x + 2 + rnd(tx, ty, 436, 11);
      for (let cy = 0; cy < 7; cy++) px(ctx, p.deepRock2, cx + (cy > 3 ? 1 : 0), y + 2 + cy);
    }
    // Wet: pale streaks running down, and weed or barnacles at the foot.
    for (let i = 0; i < 2; i++) if (hash(tx, ty, 440 + i) < 0.55) px(ctx, p.streak, x + 2 + rnd(tx, ty, 442 + i, 12), y + rnd(tx, ty, 444 + i, 6), 1, 5 + rnd(tx, ty, 446 + i, 8));
    if (p.weedFoot && isSea(at(room, tx, ty, 0, 1))) {
      for (let i = 0; i < 6; i++) px(ctx, pick(p.weedFoot, hash(tx, ty, 450 + i)), x + rnd(tx, ty, 456 + i, 15), y + 11 + rnd(tx, ty, 462 + i, 5), 1, 2 + (i % 2));
    }
    px(ctx, p.deepRock2, x, y + T - 1, T, 1);
  },
  // A ship's hull: vertical iron strakes, rivets, rust.
  hullFace(ctx, x, y, tx, ty, room, p) {
    px(ctx, p.deepRock2, x, y, T, T);
    for (let s = 0; s < 2; s++) {
      px(ctx, pick(p.rock, hash(tx, ty, 500 + s)), x + s * 8, y, 7, T);
      px(ctx, p.rim, x + s * 8, y, 1, T);
      px(ctx, p.rockLo, x + s * 8 + 6, y, 1, T);
      for (let r = 1; r < T; r += 5) px(ctx, p.rivet, x + s * 8 + 3, y + r, 2, 1);
    }
    px(ctx, p.rockLo, x, y + 7, T, 1);
    for (let i = 0; i < 3; i++) if (hash(tx, ty, 510 + i) < 0.6) px(ctx, p.rust, x + rnd(tx, ty, 515 + i, 14) + 1, y + rnd(tx, ty, 520 + i, 5), 1, 5 + rnd(tx, ty, 525 + i, 9));
    if (hash(tx, ty, 530) < 0.2) mottle(ctx, p.rust, x, y, tx, ty, 531, 5);
    if (p.weedFoot && isSea(at(room, tx, ty, 0, 1))) for (let i = 0; i < 5; i++) px(ctx, pick(p.weedFoot, hash(tx, ty, 540 + i)), x + rnd(tx, ty, 545 + i, 15), y + 11 + rnd(tx, ty, 550 + i, 5), 1, 3);
    px(ctx, p.deepRock2, x, y + T - 1, T, 1);
  },
  // Whitewashed or plain stone brick, courses staggered; the tower curves, so the sides darken.
  brickFace(ctx, x, y, tx, ty, room, p) {
    px(ctx, p.gap, x, y, T, T);
    for (let r = 0; r < 4; r++) {
      const off = (r + tx) % 2 ? 4 : 0;
      for (let bx = -off; bx < T; bx += 8) {
        const sx = Math.max(0, bx);
        const w = Math.min(bx + 8, T) - sx;
        if (w < 2) continue;
        px(ctx, pick(p.rock, hash(tx * 3 + bx, ty * 5 + r, 600)), x + sx, y + r * 4, w - 1, 3);
        px(ctx, p.rim, x + sx, y + r * 4, w - 1, 1);
      }
    }
    for (let i = 0; i < 2; i++) if (hash(tx, ty, 610 + i) < 0.5) px(ctx, p.streak, x + 2 + rnd(tx, ty, 612 + i, 12), y + rnd(tx, ty, 614 + i, 5), 1, 5 + rnd(tx, ty, 616 + i, 8));
    if (p.curve) {
      const left = isWallish(at(room, tx, ty, -1, 0));
      const right = isWallish(at(room, tx, ty, 1, 0));
      if (!left) shade(ctx, x, y, 3, T, 0.28, p.shadow);
      if (!right) shade(ctx, x + T - 3, y, 3, T, 0.35, p.shadow);
    }
    px(ctx, p.deepRock2, x, y + T - 1, T, 1);
  },
  // Board walls (a stilt house, a hut, a ship's cabin): vertical boards.
  boardWall(ctx, x, y, tx, ty, room, p) {
    for (let i = 0; i < 4; i++) {
      px(ctx, pick(p.wall, hash(tx * 4 + i, ty, 700)), x + i * 4, y, 4, T);
      px(ctx, p.wallHi, x + i * 4, y, 1, T);
      px(ctx, p.wallLo, x + i * 4 + 3, y, 1, T);
    }
    px(ctx, p.trim, x, y, T, 2);
    px(ctx, p.wallLo, x, y + 2, T, 1);
    px(ctx, p.trim, x, y + T - 3, T, 3);
    for (const nx of [1, 5, 9, 13]) { px(ctx, p.nail, x + nx, y + 4); px(ctx, p.nail, x + nx, y + 11); }
    if (hash(tx, ty, 705) < 0.4) px(ctx, p.streak, x + 2 + rnd(tx, ty, 706, 12), y + 3, 1, 6 + rnd(tx, ty, 707, 5));
  },
  // A sea cliff (Saltcombe's K): the headland's rock face. Thick slanting beds
  // of dark wet stone, each with a lit lip and a shadowed underside, split by
  // joints; ledges with a tuft of thrift or a gull's white streak below them;
  // weed and a wet black band at the foot, and foam where the sea's below.
  seaCliff(ctx, x, y, tx, ty, room, p) {
    const up = at(room, tx, ty, 0, -1);
    const down = at(room, tx, ty, 0, 1);
    px(ctx, p.deepRock2, x, y, T, T);
    // The beds slant a little, and run on from tile to tile (picked by world height).
    for (let c = 0; c < T; c++) {
      const wx = tx * T + c;
      const off = Math.floor(wx / 6) % 2 + Math.floor(wx / 23) % 3;
      for (let r = 0; r < T; r++) {
        const wy = ty * T + r + off;
        const bed = Math.floor(wy / 5);
        const k = wy % 5;
        let col = pick(p.rock, hash(Math.floor(wx / 9), bed, 471));
        if (k === 0) col = p.rim;
        else if (k === 4) col = p.rockLo;
        px(ctx, col, x + c, y + r, 1, 1);
      }
    }
    // Joints: dark cracks running down through a bed or two.
    for (let i = 0; i < 2; i++) if (hash(tx, ty, 472 + i) < 0.5) {
      const cx = x + 2 + rnd(tx, ty, 474 + i, 12);
      const cy = y + rnd(tx, ty, 476 + i, 6);
      for (let j = 0; j < 6 + rnd(tx, ty, 478 + i, 5); j++) px(ctx, p.deepRock2, cx + (j > 4 ? 1 : 0), cy + j);
    }
    // A ledge with thrift, or a gull's white streak, now and then.
    const roll = hash(tx, ty, 480);
    if (roll < 0.2) {
      const lx = x + 2 + rnd(tx, ty, 481, 9);
      const ly = y + 3 + rnd(tx, ty, 482, 7);
      px(ctx, p.turf[0], lx, ly, 5, 2);
      px(ctx, p.turfHi, lx + 1, ly, 3, 1);
      px(ctx, '#e08aa8', lx + 1, ly - 1, 1, 1);
      px(ctx, '#e08aa8', lx + 3, ly - 1, 1, 1);
    } else if (roll < 0.34) {
      const gx = x + 3 + rnd(tx, ty, 483, 10);
      const gy = y + rnd(tx, ty, 484, 5);
      px(ctx, '#dcdcd0', gx, gy, 2, 1);
      px(ctx, '#c4c8be', gx, gy + 1, 1, 4 + rnd(tx, ty, 485, 4));
    }
    // Rain running down the face.
    for (let i = 0; i < 2; i++) if (hash(tx, ty, 486 + i) < 0.45) px(ctx, p.streak, x + 1 + rnd(tx, ty, 488 + i, 14), y + rnd(tx, ty, 490 + i, 6), 1, 4 + rnd(tx, ty, 492 + i, 7));
    // Under the clifftop: the turf's edge hanging over, roots in the first bed.
    if (up === '#' || up === 'k') {
      px(ctx, p.deepRock, x, y, T, 2);
      for (let c = 0; c < T; c += 2) if (hash(tx * 8 + c, ty, 494) < 0.6) px(ctx, p.turfLo, x + c, y + 2, 2, 1 + rnd(tx * 8 + c, ty, 495, 2));
    } else if (up != null && up !== 'K' && !isWallish(up)) {
      // Open ground above (a clifftop path or turf): its edge hangs over the face.
      px(ctx, p.deepRock, x, y, T, 1);
      for (let c = 0; c < T; c += 2) {
        const drop = 1 + rnd(tx * 8 + c, ty, 497, 3);
        px(ctx, up === ',' ? p.turf[0] : pick(p.path, hash(tx * 8 + c, ty, 498)), x + c, y, 2, drop);
        if (up === ',' && hash(tx * 8 + c, ty, 499) < 0.4) px(ctx, p.turfHi, x + c, y, 1, 1);
      }
    }
    // A face that ends beside open ground gets a lit or shadowed corner.
    const left = at(room, tx, ty, -1, 0);
    const right = at(room, tx, ty, 1, 0);
    if (left != null && left !== 'K' && !isWallish(left)) shade(ctx, x, y, 2, T, 0.25, hexRgb(p.rim));
    if (right != null && right !== 'K' && !isWallish(right)) shade(ctx, x + T - 3, y, 3, T, 0.4);
    // The foot: a wet black band, weed, and foam if the sea's below.
    if (down != null && down !== 'K') {
      px(ctx, p.deepRock, x, y + T - 4, T, 3);
      if (p.weedFoot) for (let i = 0; i < 6; i++) px(ctx, pick(p.weedFoot, hash(tx, ty, 496 + i)), x + rnd(tx, ty, 502 + i, 15), y + T - 5 + rnd(tx, ty, 508 + i, 3), 1, 2 + (i % 2));
      if (isSea(down)) for (let i = 0; i < 3; i++) px(ctx, p.foam, x + rnd(tx, ty, 514 + i, 13), y + T - 1, 2 + rnd(tx, ty, 517 + i, 3), 1);
      else px(ctx, p.deepRock2, x, y + T - 1, T, 1);
    }
  },
};

// =====================================================================
// Houses (5 wall, 6 window, 7 roof, 8 door), cabins (a w e), stilts.
// =====================================================================
function houseColour(p, tx, ty, room) {
  // One colour per house: walk to the left end of this run of wall.
  let ex = tx;
  while (ex > 0 && ['5', '6', '8', 'h'].includes(at(room, ex - 1, ty))) ex--;
  return p.houses[Math.floor(hash(ex, ty, 777) * p.houses.length)];
}
const HOUSES = {
  wall(ctx, x, y, tx, ty, room, p) {
    const c = houseColour(p, tx, ty, room);
    for (let i = 0; i < 4; i++) {
      px(ctx, c, x + i * 4, y, 4, T);
      px(ctx, p.boardHi, x + i * 4, y, 1, T);
      px(ctx, p.boardLo, x + i * 4 + 3, y, 1, T);
    }
    px(ctx, p.boardLo, x, y, T, 1);
    px(ctx, p.trim, x, y + T - 2, T, 2);
    if (hash(tx, ty, 780) < 0.35) px(ctx, p.streak, x + 2 + rnd(tx, ty, 781, 12), y + 2, 1, 7);
    shade(ctx, x, y + T - 5, T, 3, 0.18, p.shadow);
  },
  window(ctx, x, y, tx, ty, room, p) {
    HOUSES.wall(ctx, x, y, tx, ty, room, p);
    px(ctx, p.frame, x + 2, y + 2, 12, 11);
    px(ctx, p.glass, x + 3, y + 3, 10, 9);
    px(ctx, p.glassHi, x + 3, y + 3, 10, 3);
    px(ctx, p.frame, x + 8, y + 3, 1, 9);
    px(ctx, p.frame, x + 3, y + 7, 10, 1);
    px(ctx, p.sill, x + 1, y + 13, 14, 2);
    // A curtain, half drawn.
    if (hash(tx, ty, 790) < 0.5) px(ctx, p.curtain, x + 3, y + 3, 3, 9);
  },
  door(ctx, x, y, tx, ty, room, p) {
    HOUSES.wall(ctx, x, y, tx, ty, room, p);
    px(ctx, p.frame, x + 1, y + 1, 14, 15);
    for (let i = 0; i < 3; i++) {
      px(ctx, p.door, x + 2 + i * 4, y + 2, 4, 14);
      px(ctx, p.doorHi, x + 2 + i * 4, y + 2, 1, 14);
    }
    px(ctx, p.frame, x + 2, y + 8, 12, 1);
    px(ctx, p.knob, x + 11, y + 10, 2, 2);
    px(ctx, p.sill, x, y + 15, T, 1);
  },
  roof(ctx, x, y, tx, ty, room, p) {
    px(ctx, p.roofLo, x, y, T, T);
    for (let r = 0; r < 4; r++) {
      const off = (r + tx) % 2 ? 4 : 0;
      for (let bx = -off; bx < T; bx += 8) {
        const sx = Math.max(0, bx);
        const w = Math.min(bx + 8, T) - sx;
        if (w < 2) continue;
        px(ctx, pick(p.roof, hash(tx * 3 + bx, ty * 5 + r, 800)), x + sx, y + r * 4, w - 1, 3);
        px(ctx, p.roofHi, x + sx, y + r * 4, w - 1, 1);
      }
    }
    if (isWallish(at(room, tx, ty, 0, 1)) === false) { /* eaves */ px(ctx, p.roofLo, x, y + T - 2, T, 2); shade(ctx, x, y + T, T, 0, 0); }
    if (hash(tx, ty, 806) < 0.25) mottle(ctx, p.streak, x, y, tx, ty, 807, 4);
  },
  // Cabins, as a wreck's deckhouse: board wall, porthole, deck roof.
  cabinWall(ctx, x, y, tx, ty, room, p) { WALLS.boardWall(ctx, x, y, tx, ty, room, p); },
  cabinWindow(ctx, x, y, tx, ty, room, p) {
    WALLS.boardWall(ctx, x, y, tx, ty, room, p);
    oval(ctx, p.frame, x + 8, y + 7, 5, 5);
    oval(ctx, p.glass, x + 8, y + 7, 4, 4);
    px(ctx, p.glassHi, x + 6, y + 5, 3, 1);
    px(ctx, p.frame, x + 3, y + 7, 10, 1);
  },
  cabinRoof(ctx, x, y, tx, ty, room, p) {
    GROUND.planks(ctx, x, y, tx, ty, null, { ...p, glint: null }, false);
    shade(ctx, x, y, T, T, 0.12, p.shadow);
    px(ctx, p.gap, x, y + T - 2, T, 2);
  },
};

// =====================================================================
// Standing things (drawn over the floor, sorted with the characters).
// =====================================================================
const STANDING = {
  // A mast: a tall bare pole with rope, a spar and a ragged sail.
  mast(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 13, 14, 3, 0.35);
    px(ctx, p.stand0, x + 3, y + 10, 10, 4);
    px(ctx, p.stand1, x + 4, y + 10, 8, 2);
    px(ctx, p.stand0, x + 5, y - 36, 6, 48);
    px(ctx, p.stand2, x + 6, y - 36, 4, 48);
    px(ctx, p.standHi, x + 6, y - 36, 1, 48);
    px(ctx, p.stand0, x + 9, y - 36, 1, 48);
    for (let r = -28; r < 8; r += 8) px(ctx, p.stand0, x + 5, y + r, 6, 1);
    // The spar and a tatter of sail.
    px(ctx, p.stand0, x - 3, y - 30, 22, 3);
    px(ctx, p.stand2, x - 2, y - 30, 20, 1);
    const sail = hash(tx, ty, 3);
    if (sail < 0.75) {
      for (let c = 0; c < 6; c++) px(ctx, p.sail, x - 1 + c * 3, y - 27, 3, 5 + ((c * 7 + tx) % 7));
      px(ctx, p.sailLo, x - 1, y - 27, 18, 1);
    }
    // Rope hanging, and a snapped end.
    px(ctx, p.rope, x + 15, y - 28, 1, 14);
    px(ctx, p.rope, x - 3, y - 28, 1, 9);
    px(ctx, p.rope, x + 4, y - 14, 1, 20);
  },
  // A tall iron or stone pillar: ribbed, with a broken crown (the Last Light's spikes).
  pillar(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 13, 14, 3, 0.35);
    px(ctx, p.deepRock2, x + 1, y + 8, 14, 7);
    px(ctx, p.rock[0], x + 2, y + 9, 12, 5);
    px(ctx, p.rim, x + 2, y + 9, 12, 1);
    px(ctx, p.deepRock2, x + 3, y - 26, 10, 36);
    px(ctx, p.rock[1], x + 4, y - 25, 8, 34);
    px(ctx, p.rim, x + 4, y - 25, 2, 34);
    px(ctx, p.rockLo, x + 10, y - 25, 2, 34);
    for (let band = y - 20; band < y + 8; band += 7) px(ctx, p.deepRock2, x + 4, band, 8, 1);
    // A crown of broken spikes.
    px(ctx, p.deepRock2, x + 1, y - 31, 14, 6);
    px(ctx, p.rock[2], x + 2, y - 30, 12, 4);
    for (const sx of [2, 6, 10, 13]) {
      px(ctx, p.deepRock2, x + sx, y - 37 - (sx % 3) * 2, 2, 7);
      px(ctx, p.rock[2], x + sx, y - 36 - (sx % 3) * 2, 1, 6);
    }
  },
  // A bollard or mooring post with a coil of rope (for the shore).
  post(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 13, 14, 3, 0.35);
    px(ctx, p.stand0, x + 4, y - 22, 8, 36);
    px(ctx, p.stand2, x + 5, y - 22, 6, 36);
    px(ctx, p.standHi, x + 5, y - 22, 2, 36);
    px(ctx, p.stand0, x + 9, y - 22, 2, 36);
    px(ctx, p.stand0, x + 3, y - 25, 10, 4);
    px(ctx, p.stand2, x + 4, y - 25, 8, 2);
    for (let r = -14; r < 4; r += 3) px(ctx, p.rope, x + 3, y + r, 10, 2);
    px(ctx, p.stand0, x + 3, y + 10, 10, 4);
  },
  // A natural stack of rock rising from the floor (a sea stack, cave pillar).
  rockpillar(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 13, 14, 3, 0.35);
    const tall = 34 + rnd(tx, ty, 470, 8);
    for (let row = 0; row <= tall; row++) {
      const w = Math.max(5, Math.round(12 - 3 * Math.abs(row / tall - 0.5) * 2 + (row > tall - 4 ? 2 : 0)));
      const left = x + 8 - Math.floor(w / 2);
      const py = y + 13 - tall + row;
      px(ctx, p.deepRock2, left - 1, py, w + 2, 1);
      px(ctx, pick(p.rock, hash(tx, row >> 2, 471)), left, py, w, 1);
      px(ctx, p.rim, left, py, Math.max(1, Math.floor(w / 4)), 1);
      if (row % 6 === 3) px(ctx, p.rockLo, left + 1, py, w - 2, 1);
    }
    if (p.weedFoot) for (let i = 0; i < 4; i++) px(ctx, pick(p.weedFoot, hash(tx, ty, 480 + i)), x + 3 + rnd(tx, ty, 485 + i, 10), y + 8 + (i % 3), 1, 4);
  },
  // Broken: a short stump of the same.
  stump(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 13, 14, 3, 0.35);
    px(ctx, p.stand0, x + 3, y + 10, 10, 4);
    px(ctx, p.stand0, x + 4, y - 9, 8, 20);
    px(ctx, p.stand2, x + 5, y - 8, 6, 19);
    px(ctx, p.standHi, x + 5, y - 8, 2, 19);
    px(ctx, p.stand0, x + 9, y - 8, 2, 19);
    px(ctx, p.stand2, x + 7, y - 12, 2, 4);
    px(ctx, p.rope, x + 11, y - 6, 1, 9);
    px(ctx, p.stand0, x + 11, y + 10, 5, 4);
    px(ctx, p.stand1, x + 12, y + 11, 3, 2);
  },
  jag(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 13, 14, 3, 0.35);
    px(ctx, p.deepRock2, x + 2, y + 6, 12, 8);
    px(ctx, p.deepRock2, x + 4, y - 8, 8, 16);
    px(ctx, p.deepRock2, x + 6, y - 13, 3, 6);
    px(ctx, p.rock[1], x + 3, y + 7, 10, 6);
    px(ctx, p.rock[2], x + 5, y - 7, 6, 15);
    px(ctx, p.rim, x + 5, y - 7, 2, 15);
    px(ctx, p.rock[2], x + 7, y - 12, 1, 5);
    px(ctx, p.rockLo, x + 10, y - 7, 1, 15);
  },
};

// A boulder / barrel / crate / cask / lobster pots, standing on the floor under it.
const BLOCKERS = {
  boulder(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 12, 14, 3, 0.3);
    oval(ctx, p.deepRock2, x + 8, y + 8, 7, 5);
    oval(ctx, p.rock[1], x + 8, y + 7, 6, 4);
    px(ctx, p.rim, x + 4, y + 4, 5, 2);
    px(ctx, p.rockLo, x + 9, y + 10, 4, 2);
    if (p.weedFoot) { px(ctx, p.weedFoot[0], x + 3, y + 3, 5, 2); px(ctx, p.weedFoot[1] ?? p.weedFoot[0], x + 4, y + 3, 2, 1); }
  },
  barrel(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 12, 14, 3, 0.3);
    px(ctx, p.stand0, x + 3, y + 1, 10, 13);
    px(ctx, p.stand0, x + 2, y + 3, 12, 9);
    px(ctx, p.stand2, x + 4, y + 2, 8, 11);
    px(ctx, p.stand2, x + 3, y + 4, 10, 7);
    px(ctx, p.standHi, x + 4, y + 2, 2, 11);
    px(ctx, p.stand0, x + 9, y + 2, 1, 11);
    px(ctx, p.hoop, x + 2, y + 4, 12, 1);
    px(ctx, p.hoop, x + 2, y + 10, 12, 1);
  },
  crate(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 12, 14, 3, 0.3);
    px(ctx, p.stand0, x + 1, y + 2, 14, 12);
    px(ctx, p.stand2, x + 2, y + 3, 12, 10);
    px(ctx, p.standHi, x + 2, y + 3, 12, 1);
    px(ctx, p.stand0, x + 2, y + 7, 12, 1);
    px(ctx, p.stand0, x + 7, y + 3, 2, 10);
    px(ctx, p.hoop, x + 2, y + 3, 2, 2);
    px(ctx, p.hoop, x + 12, y + 11, 2, 2);
  },
  pots(ctx, x, y, tx, ty, room, p) {
    shade(ctx, x + 1, y + 12, 14, 3, 0.3);
    for (const [ox, oy] of [[1, 6], [8, 6], [4, 1]]) {
      px(ctx, p.stand0, x + ox, y + oy, 7, 7);
      px(ctx, p.stand2, x + ox + 1, y + oy + 1, 5, 5);
      for (let i = 1; i < 6; i += 2) px(ctx, p.stand0, x + ox + i, y + oy + 1, 1, 5);
      px(ctx, p.rope, x + ox + 1, y + oy, 5, 1);
    }
  },
};

// A bed or heap that blocks (F): a tangle of nets, weed, or pots.
const HEAPS = {
  weed(ctx, x, y, tx, ty, room, p, floor) {
    floor(ctx, x, y, tx, ty, room);
    shade(ctx, x + 1, y + 12, 14, 3, 0.25);
    for (let i = 0; i < 14; i++) {
      const bx = x + 1 + rnd(tx, ty, 10 + i, 14);
      const by = y + 3 + rnd(tx, ty, 30 + i, 9);
      px(ctx, pick(p.weed, hash(tx, ty, 50 + i)), bx, by, 2, 3 + rnd(tx, ty, 70 + i, 3));
    }
    px(ctx, p.weed[0], x + 2, y + 10, 12, 3);
    for (let i = 0; i < 3; i++) px(ctx, p.weedHi, x + 2 + rnd(tx, ty, 90 + i, 11), y + 4 + rnd(tx, ty, 94 + i, 6), 1, 1);
  },
  net(ctx, x, y, tx, ty, room, p, floor) {
    floor(ctx, x, y, tx, ty, room);
    shade(ctx, x + 1, y + 12, 14, 3, 0.25);
    px(ctx, p.stand0, x + 1, y + 4, 14, 9);
    px(ctx, p.net, x + 2, y + 5, 12, 7);
    for (let i = 0; i < 12; i += 3) { px(ctx, p.stand0, x + 2 + i, y + 5, 1, 7); px(ctx, p.stand0, x + 2, y + 5 + (i % 7), 12, 1); }
    px(ctx, p.float, x + 3, y + 3, 3, 3);
    px(ctx, p.float, x + 10, y + 5, 3, 3);
  },
  pots(ctx, x, y, tx, ty, room, p, floor) { floor(ctx, x, y, tx, ty, room); BLOCKERS.pots(ctx, x, y, tx, ty, room, p); },
};

// A walkable tangle of seaweed or beach grass (N), and a thorn heap of wrack (Z).
function seaGrass(ctx, x, y, tx, ty, room, p, floor) {
  floor(ctx, x, y, tx, ty, room);
  for (let i = 0; i < 7; i++) {
    const bx = x + 1 + rnd(tx, ty, 10 + i, 14);
    const by = y + 3 + rnd(tx, ty, 20 + i, 9);
    const lean = hash(tx, ty, 30 + i) < 0.5 ? -1 : 1;
    px(ctx, pick(p.weed, hash(tx, ty, 40 + i)), bx, by + 3, 1, 3);
    px(ctx, pick(p.weed, hash(tx, ty, 40 + i)), bx + lean * 0, by + 1, 1, 3);
    px(ctx, p.weedHi, bx + lean, by, 1, 2);
  }
}
function wrackHeap(ctx, x, y, tx, ty, room, p, floor) {
  floor(ctx, x, y, tx, ty, room);
  shade(ctx, x + 1, y + 12, 14, 3, 0.28);
  oval(ctx, p.deepRock2, x + 8, y + 8, 7, 5);
  for (let i = 0; i < 16; i++) {
    const bx = x + 2 + rnd(tx, ty, 10 + i, 12);
    const by = y + 3 + rnd(tx, ty, 30 + i, 9);
    px(ctx, pick(p.weed, hash(tx, ty, 50 + i)), bx, by, 2 + (i % 2), 2);
  }
  for (let i = 0; i < 5; i++) px(ctx, p.weedHi, x + 3 + rnd(tx, ty, 80 + i, 10), y + 4 + rnd(tx, ty, 90 + i, 6), 1, 1);
  // A bleached stick and a shell caught in it.
  px(ctx, p.driftwood, x + 3 + rnd(tx, ty, 100, 6), y + 5, 8, 1);
  if (hash(tx, ty, 101) < 0.5) px(ctx, '#e8d8c8', x + 5 + rnd(tx, ty, 102, 6), y + 8, 2, 2);
}

// A laid hedgerow (Z, in an area whose `Z` is 'hedge': the Sunken Lanes). A squared-off bank
// of dark leaves that joins its Z neighbours into one long row, a flat lit top, weed caught in
// its foot where the flood has been.
function hedgeRow(ctx, x, y, tx, ty, room, p, floor) {
  floor(ctx, x, y, tx, ty, room);
  const l = at(room, tx, ty, -1, 0) === 'Z';
  const r = at(room, tx, ty, 1, 0) === 'Z';
  const up = at(room, tx, ty, 0, -1) === 'Z';
  const x0 = x + (l ? 0 : 1);
  const x1 = x + (r ? 16 : 15);
  const top = y + (up ? 0 : 2);
  const dark = p.hedgeLo ?? '#1a2e1c';
  shade(ctx, x0, y + 13, x1 - x0, 3, 0.45);
  px(ctx, dark, x0, top, x1 - x0, y + 14 - top);
  px(ctx, p.hedge ?? '#2a4a28', x0, top + 1, x1 - x0, y + 11 - top);
  // The clipped top, catching the light, and the line where it turns down into the face.
  if (!up) {
    px(ctx, p.weed[1], x0, top, x1 - x0, 4);
    px(ctx, p.weedHi, x0 + 1, top, x1 - x0 - 2, 1);
    px(ctx, dark, x0, top + 4, x1 - x0, 1);
  }
  // Leaves: specks of light and dark down its face.
  for (let i = 0; i < 14; i++) {
    const bx = x + 1 + rnd(tx, ty, 10 + i, 14);
    const by = top + 3 + rnd(tx, ty, 30 + i, Math.max(1, y + 9 - top));
    px(ctx, i % 3 ? p.weed[0] : p.weed[1], bx, by, 2, 1);
    if (i % 4 === 0) px(ctx, p.turfLo, bx, by + 1, 1, 1);
  }
  // Rounded ends where the row stops.
  if (!l) { px(ctx, p.turfLo, x0, top, 1, 2); }
  if (!r) { px(ctx, p.turfLo, x1 - 1, top, 1, 2); }
  // Its foot, and a bit of weed the flood left in it.
  px(ctx, p.turfLo, x0, y + 13, x1 - x0, 1);
  if (hash(tx, ty, 120) < 0.5) px(ctx, p.weedFoot?.[0] ?? p.weed[2], x + 3 + rnd(tx, ty, 121, 8), y + 12, 3, 2);
}

// Barnacled rock mass (x, solid), coral on the beach, sea-glass in the Soundings.
const MASSES = {
  barnacle(ctx, x, y, tx, ty, room, p, floor) {
    floor(ctx, x, y, tx, ty, room);
    shade(ctx, x + 1, y + 12, 14, 3, 0.3);
    oval(ctx, p.deepRock2, x + 8, y + 7, 8, 7);
    oval(ctx, p.rock[0], x + 8, y + 7, 7, 6);
    mottle(ctx, p.rock[2], x, y, tx, ty, 3, 8);
    for (let i = 0; i < 12; i++) {
      const bx = x + 2 + rnd(tx, ty, 10 + i, 12);
      const by = y + 2 + rnd(tx, ty, 30 + i, 10);
      px(ctx, '#d8d6c8', bx, by, 2, 1);
      px(ctx, p.deepRock2, bx, by + 1, 2, 1);
    }
    px(ctx, p.rim, x + 4, y + 2, 5, 1);
  },
  coral(ctx, x, y, tx, ty, room, p, floor) {
    floor(ctx, x, y, tx, ty, room);
    shade(ctx, x + 1, y + 12, 14, 3, 0.25);
    const hue = pick(p.coral, hash(tx, ty, 1));
    for (let b = 0; b < 4; b++) {
      const bx = x + 2 + b * 3;
      const top = y + 1 + rnd(tx, ty, 10 + b, 6);
      px(ctx, hue[0], bx, top, 3, 13 - (top - y));
      px(ctx, hue[1], bx, top, 1, 13 - (top - y));
      px(ctx, hue[1], bx - 1, top + 2, 1, 2);
      px(ctx, hue[1], bx + 3, top + 4, 1, 2);
    }
  },
  glass(ctx, x, y, tx, ty, room, p, floor) {
    floor(ctx, x, y, tx, ty, room);
    shade(ctx, x + 1, y + 12, 14, 3, 0.3);
    oval(ctx, p.deepRock2, x + 8, y + 8, 7, 6);
    oval(ctx, p.rock[0], x + 8, y + 8, 6, 5);
    for (let i = 0; i < 4; i++) {
      const cx = x + 3 + rnd(tx, ty, 10 + i, 10);
      const h = 4 + rnd(tx, ty, 20 + i, 6);
      px(ctx, p.glow0, cx, y + 12 - h, 2, h);
      px(ctx, p.glow1, cx, y + 12 - h, 1, h);
      px(ctx, '#e8fffa', cx, y + 12 - h, 1, 1);
    }
  },
};

// A pit or open sea you can't enter (0): deep, dark, with whitecaps.
function drop(ctx, x, y, tx, ty, room, p) {
  water(ctx, x, y, tx, ty, room, p, true);
  shade(ctx, x, y, T, T, 0.22, p.shadow);
  if (hash(tx, ty, 200) < 0.2) px(ctx, p.foam, x + 2 + rnd(tx, ty, 201, 10), y + 4 + rnd(tx, ty, 202, 8), 4, 1);
}

// A walkway over water or a drop (g): boards on rope, shadowed, with posts.
function bridge(ctx, x, y, tx, ty, room, p) {
  const sideways = ['g', 'o'].includes(at(room, tx, ty, -1)) || ['g', 'o'].includes(at(room, tx, ty, 1));
  const under = at(room, tx, ty, 0, 1) === '0' || at(room, tx, ty, 0, -1) === '0' ? drop : water;
  under(ctx, x, y, tx, ty, room, p);
  const planks = p.bridge ?? p;
  GROUND.planks(ctx, x, y, tx, ty, null, planks, !sideways);
  if (sideways) {
    // Rails: a rope and its posts along the long edges, with shadow on the water.
    if (!['g', 'o'].includes(at(room, tx, ty, 0, -1))) { px(ctx, planks.gap, x, y, T, 2); px(ctx, planks.rope ?? planks.plankHi, x, y + 1, T, 1); }
    if (!['g', 'o'].includes(at(room, tx, ty, 0, 1))) { px(ctx, planks.gap, x, y + T - 2, T, 2); px(ctx, planks.rope ?? planks.plankHi, x, y + T - 3, T, 1); shade(ctx, x, y + T, T, 0, 0); }
  } else {
    if (!['g', 'o'].includes(at(room, tx, ty, -1))) { px(ctx, planks.gap, x, y, 2, T); px(ctx, planks.rope ?? planks.plankHi, x + 1, y, 1, T); }
    if (!['g', 'o'].includes(at(room, tx, ty, 1))) { px(ctx, planks.gap, x + T - 2, y, 2, T); px(ctx, planks.rope ?? planks.plankHi, x + T - 3, y, 1, T); }
  }
}

// Rope bridges on floats (an area with `floats: true`: the Beacon Isles). The long sides of a
// bridge (g) get a hand rope on short posts; the sea beside it (~) shows the cork floats that hold
// it up, every other tile, tied to its edge. At low tide the bridge lies slack on the bed (o): the
// rope lies in loops on the boards, the floats lie on their sides in the shingle (q) beside it, and
// where the bed is still sea the middle sags under the water, a rope and dark boards showing.
const BRIDGE_WALK = ['g', 'o'];
function bridgeSide(ctx, x, y, tx, ty, room, p, slack) {
  const sideways = BRIDGE_WALK.includes(at(room, tx, ty, -1)) || BRIDGE_WALK.includes(at(room, tx, ty, 1));
  if (!sideways) return;
  const rope = p.rope ?? p.plankHi;
  for (const top of [true, false]) {
    if (BRIDGE_WALK.includes(at(room, tx, ty, 0, top ? -1 : 1))) continue;
    if (slack) {
      // Lying in loops along the edge.
      const ey = top ? y + 2 : y + T - 4;
      for (let i = 0; i < T; i++) px(ctx, rope, x + i, ey + ((i + tx * 5) % 8 < 4 ? 0 : 1), 1, 1);
      if (tx % 3 === 0) { px(ctx, p.stand0, x + 5, ey - 1, 6, 3); px(ctx, p.stand2, x + 6, ey - 1, 4, 1); }
      continue;
    }
    // A short post every third tile, and the hand rope dipping between them.
    const post = tx % 3 === 0;
    const sag = [0, 1, 1][tx % 3];
    if (top) {
      if (post) { px(ctx, p.stand0, x + 6, y, 3, 6); px(ctx, p.stand2, x + 7, y, 1, 5); px(ctx, p.standHi ?? p.stand2, x + 6, y, 3, 1); }
      px(ctx, p.stand0, x, y + 2 + sag, T, 1);
      px(ctx, rope, x, y + 1 + sag, T, 1);
    } else {
      if (post) { px(ctx, p.stand0, x + 6, y + T - 8, 3, 8); px(ctx, p.stand2, x + 7, y + T - 8, 1, 7); px(ctx, p.standHi ?? p.stand2, x + 6, y + T - 8, 3, 1); }
      px(ctx, p.stand0, x, y + T - 5 + sag, T, 1);
      px(ctx, rope, x, y + T - 6 + sag, T, 1);
    }
  }
}
function bridgeFloat(ctx, x, y, tx, ty, room, p, lying) {
  const below = at(room, tx, ty, 0, 1);
  const above = at(room, tx, ty, 0, -1);
  const letter = lying ? 'o' : 'g';
  const top = below === letter;
  if (!top && above !== letter) return;
  // Only along a bridge's long side.
  const bx = top ? 1 : -1;
  const side = (dx) => at(room, tx + dx, ty + bx) === letter;
  if (!side(-1) && !side(1)) return;
  if (tx % 2) return;
  const cx = x + 8;
  const rope = p.rope ?? p.plankHi;
  const fl = p.float ?? '#d0562e';
  if (lying) {
    // On its side in the shingle, the tie slack.
    const cy = top ? y + T - 6 : y + 6;
    shade(ctx, cx - 5, cy + 2, 11, 2, 0.3, p.shadow);
    oval(ctx, p.stand0, cx, cy, 5, 2);
    oval(ctx, fl, cx, cy - 1, 4, 1);
    px(ctx, p.foam, cx - 1, cy - 2, 1, 3);
    px(ctx, rope, cx + 4, top ? cy + 2 : cy - 3, 1, 2);
    return;
  }
  // Afloat at the bridge's edge, half under, with a little foam.
  const cy = top ? y + T - 3 : y + 3;
  oval(ctx, p.stand0, cx, cy, 4, 3);
  oval(ctx, fl, cx, cy - 1, 3, 2);
  px(ctx, p.foam, cx - 1, cy - 3, 1, 4);
  px(ctx, '#ffffff60', cx - 2, cy - 2, 1, 1);
  px(ctx, rope, cx, top ? cy + 2 : cy - 4, 1, 2);
  px(ctx, p.foam, cx - 6, top ? cy - 1 : cy + 2, 3, 1);
  px(ctx, p.foam, cx + 4, top ? cy - 1 : cy + 2, 2, 1);
}
// The sea over a sunk stretch of a slack bridge: sea with boards on both sides of it in the row.
function sunkBridge(ctx, x, y, tx, ty, room, p) {
  const sunk = (sy) => at(room, tx, sy) === '~'
    && [1, 2, 3].some((k) => at(room, tx - k, sy) === 'o') && [1, 2, 3].some((k) => at(room, tx + k, sy) === 'o');
  if (!sunk(ty)) return;
  const shadowPlank = `rgba(${hexRgb(p.plankLo)}, 0.5)`;
  for (let i = 0; i < 4; i++) if ((i + tx) % 3 !== 0) px(ctx, shadowPlank, x, y + i * 4 + 1, T, 2);
  const rope = `rgba(${hexRgb(p.rope ?? p.plankHi)}, 0.65)`;
  if (!sunk(ty - 1)) px(ctx, rope, x, y + 2 + (tx % 2), T, 1);
  if (!sunk(ty + 1)) px(ctx, rope, x, y + T - 4 + (tx % 2), T, 1);
}

// A rail along a quay or a deck (f): posts and a rope or rail.
function rail(ctx, x, y, tx, ty, room, p, floor) {
  floor(ctx, x, y, tx, ty, room);
  const sideways = at(room, tx, ty, -1) === 'f' || at(room, tx, ty, 1) === 'f';
  shade(ctx, x, y + 12, T, 3, 0.25);
  if (sideways || (at(room, tx, ty, 0, -1) !== 'f' && at(room, tx, ty, 0, 1) !== 'f')) {
    px(ctx, p.stand0, x, y + 5, T, 3);
    px(ctx, p.stand2, x, y + 5, T, 1);
    for (const fx of [0, 11]) { px(ctx, p.stand0, x + fx, y + 2, 4, 12); px(ctx, p.stand2, x + fx + 1, y + 3, 2, 10); }
  } else {
    px(ctx, p.stand0, x + 6, y, 3, T);
    px(ctx, p.stand2, x + 7, y, 1, T);
    px(ctx, p.stand0, x + 5, y + 8, 5, 5);
  }
}

// A raised ledge (b 12 px, B 24 px): cut or fallen blocks of the area's stone.
function blockOf(raise, look) {
  return (ctx, x, y, tx, ty, room, floor) => {
    floor(ctx, x, y, tx, ty, room);
    const top = y - raise;
    const raiseAt = (dx, dy) => ({ b: 12, B: 24 }[at(room, tx, ty, dx, dy)] ?? 0);
    // Face.
    px(ctx, look.faceBase, x, top + T, T, raise);
    for (let row = 0; row * 4 < raise; row++) {
      const off = (row + tx) % 2 ? 4 : 0;
      for (let bx = -off; bx < T; bx += 8) {
        const left = Math.max(0, bx);
        const width = Math.min(bx + 7, T) - left;
        if (width > 0) {
          px(ctx, pick(look.bricks, hash(tx * 3 + bx, ty * 5 + row, 31)), x + left, top + T + row * 4 + 1, width, 3);
          px(ctx, look.brickHi, x + left, top + T + row * 4 + 1, width, 1);
        }
      }
    }
    if (look.weed && isSea(at(room, tx, ty, 0, 1))) for (let i = 0; i < 4; i++) px(ctx, look.weed, x + rnd(tx, ty, 80 + i, 15), top + T + raise - 4 + rnd(tx, ty, 84 + i, 3), 1, 3);
    px(ctx, look.outline, x, y + T - 1, T, 1);
    // Top.
    px(ctx, pick(look.tops, hash(tx, ty, 33)), x, top, T, T);
    if (hash(tx, ty, 34) < 0.5) px(ctx, look.seam, x + 7, top + 1, 1, T - 2);
    if (hash(tx, ty, 35) < 0.4) px(ctx, look.seam, x + 1, top + 9, T - 2, 1);
    if (hash(tx, ty, 36) < 0.3) px(ctx, look.fleck, x + 3 + rnd(tx, ty, 37, 9), top + 3 + rnd(tx, ty, 38, 8), 2, 1);
    if (raiseAt(0, 1) < raise) px(ctx, look.lit, x, top + T - 1, T, 1);
    if (raiseAt(0, -1) < raise) px(ctx, look.outline, x, top, T, 1);
    if (raiseAt(-1, 0) < raise) px(ctx, look.outline, x, top, 1, T + raise);
    if (raiseAt(1, 0) < raise) px(ctx, look.outline, x + T - 1, top, 1, T + raise);
  };
}

// A hanging thing (v, you walk under): kelp-like ropes and weed in the storm, stalactites in the cave.
function hanging(ctx, x, y, tx, ty, room, p) {
  if (p.hangKind === 'rock') {
    const tall = 16 + rnd(tx, ty, 460, 10);
    const top = y - T + 2;
    const lean = hash(tx, ty, 461) < 0.5 ? -1 : 1;
    for (let row = 0; row < tall; row++) {
      const w = Math.max(1, Math.round(9 * (1 - row / tall)));
      const left = x + 8 - Math.floor(w / 2) + (row > tall * 0.6 ? lean : 0);
      px(ctx, p.deepRock2, left - 1, top + row, w + 2, 1);
      px(ctx, row > tall - 4 ? p.glow1 ?? p.rim : pick(p.rock, hash(tx, row, 462)), left, top + row, w, 1);
      if (w > 2) px(ctx, p.rim, left, top + row, 1, 1);
    }
    return;
  }
  // Ropes, nets and weed hung from a rail or a rafter.
  const top = y - T + 2;
  for (let i = 0; i < 4; i++) {
    const hx = x + 2 + i * 4 + rnd(tx, ty, 10 + i, 2);
    const len = 8 + rnd(tx, ty, 20 + i, 14);
    for (let r = 0; r < len; r++) px(ctx, r % 5 === 4 ? p.weedHi : pick(p.weed, hash(tx, ty, 30 + i)), hx + (r > len * 0.6 ? 1 : 0), top + r, 1 + (r % 6 === 0 ? 1 : 0), 1);
  }
}

// =====================================================================
// The areas.
// =====================================================================
// A palette gives colours; `kinds` says which look each letter takes.
const AREAS = {
  // --- GULLREST: the sunny beach. ---
  gullrest: {
    p: {
      shadow: '60, 44, 20', wetShade: '30, 80, 90', wetLine: '#f6e9c0', glint: '#fff8dc',
      ground: ['#ecdaa8', '#e7d5a0', '#f1e0b0', '#e3d09a'], hi: '#f8eec8', lo: '#d3be88', crack: '#bba670',
      speck: ['#c4ae78', '#fff6d8', '#d8c48c', '#b09a62'], shells: ['#f2b8b0', '#fff2e0', '#e8c8f0'],
      turf: ['#88c45a', '#8dc95f', '#82bf54', '#92cd64'], turfHi: '#b4e87c', turfLo: '#5fa03e', flowers: ['#ffd62e', '#f08ab8', '#fffdf2'],
      path: ['#dcc790', '#d6c08a', '#e2cf9a'],
      water: '#34b8d4', deep: '#2a9ec2', wave: '#86e6f0', troughs: '#238eb0', foam: '#ffffff', lip: '#2a8aa6', caps: 0.16,
      shallow: '#8de6e2', shallowHi: '#b4f2ec', stone: '#d8d0b8', stoneDark: '#8a8068', stoneHi: '#f4ecd4',
      plank: ['#c9a068', '#bf965e', '#d2aa72'], plankHi: '#e2bf88', plankLo: '#9c7442', gap: '#6e4e2c', nail: '#5a3e22', rope: '#e8d8a8',
      deepRock2: '#6e5e48', topRock: '#a89678', deepRock: '#8a7a62', rim: '#d8c8a8', rockLo: '#7a6a52', fleck: '#fff0c8',
      rock: ['#b8a688', '#b0a082', '#c0ae90', '#a89878'], streak: '#d8c8a8', weedFoot: ['#4c8a46', '#3a7a3c'], rivet: '#6a5a48', rust: '#a8683c',
      houses: ['#f2efe4', '#9fd4e4', '#f4d6a0', '#f0b0a8'], boardHi: '#ffffff', boardLo: '#b8b09c', trim: '#2f86b0', frame: '#f6f2e2', glass: '#a8dcec', glassHi: '#d8f4fb',
      sill: '#2f86b0', curtain: '#e86868', door: '#3b8fb8', doorHi: '#5fb0d8', knob: '#ffd23c',
      roof: ['#d8503c', '#cc4632', '#e05c46'], roofHi: '#f08a74', roofLo: '#8a2c20',
      wall: ['#f0ecde', '#eae6d6', '#f5f1e4'], wallHi: '#ffffff', wallLo: '#c4bca8',
      stand0: '#4a3418', stand1: '#7a5630', stand2: '#a77a48', standHi: '#d8a870', rope: '#e8d8a8', sail: '#fffdf2', sailLo: '#c8c0b0', hoop: '#6a5638', net: '#d8c690', float: '#f26a4a',
      weed: ['#4f9a48', '#5ca850', '#438a3e'], weedHi: '#9ae070', driftwood: '#e8dcc0',
      coral: [['#f0788a', '#ffb4bc'], ['#f2a04a', '#ffd098'], ['#b878e0', '#e0b4ff']], glow0: '#4ad0c0', glow1: '#aef4e8', moss: 0, mossColor: '#6a9a4a',
      hangKind: 'rope',
    },
    '.': 'sand', ',': 'turf', ':': 'path', q: 'shingle', o: 'planks', X: 'cobbles',
    wallTop: 'rockTop', wallFace: 'rockFace', h: 'boardWall',
    houses: 'wall', stand: { I: 'post', J: 'stump', '^': 'rockpillar' }, block: 'sandstone',
    O: 'boulder', F: 'weed', Z: 'wrack', N: 'grass', x: 'coral', hang: 'rope',
  },
  // --- WRACK SHORE: the storm starts. Wet shingle, tidepool rock, weed. ---
  wrack: {
    p: {
      shadow: '4, 20, 26', wetShade: '4, 24, 34', wetLine: '#6a8e88', glint: '#aac8c0',
      ground: ['#8a8672', '#848070', '#908c78', '#7e7a68'], hi: '#a8a48e', lo: '#68665a', crack: '#4a4a40',
      speck: ['#5e5b4d', '#b3af98', '#4f5648', '#76806a'], shells: ['#d8b8b0', '#e8e0d0'],
      turf: ['#527c4c', '#4d7648', '#588450', '#487044'], turfHi: '#7aa66a', turfLo: '#37593a', flowers: ['#d8c870', '#b8a0c8'],
      path: ['#a49b80', '#9c9378', '#aca388'],
      water: '#2a5866', deep: '#224a58', wave: '#4a8c98', troughs: '#1a3e4c', foam: '#d4f0e8', lip: '#163440', caps: 0.2,
      shallow: '#4a8a88', shallowHi: '#68a8a0', stone: '#7a8480', stoneDark: '#323c40', stoneHi: '#a0aaa4',
      plank: ['#6e5a42', '#66523c', '#765f46'], plankHi: '#8c7658', plankLo: '#4a3a28', gap: '#2a2016', nail: '#20180e', rope: '#a8987a',
      deepRock: '#162224', deepRock2: '#0c1618', topRock: '#1c2c2e', rim: '#4a6870', rockLo: '#2a3c42', fleck: '#6a98a0',
      rock: ['#4e5e64', '#475860', '#566870', '#415158'], streak: '#6c8890', weedFoot: ['#3a5a30', '#4a7038', '#2e4a28'], rivet: '#7a8a8c', rust: '#7a4a30',
      stand0: '#1a1610', stand1: '#4a3e2e', stand2: '#6a5a44', standHi: '#8a7a5e', sail: '#a89c84', sailLo: '#6a6050', hoop: '#3a3226', net: '#8a7c5c', float: '#c4503a',
      weed: ['#3c5c2c', '#486a34', '#34502a'], weedHi: '#7ca058', driftwood: '#b0a488',
      coral: [['#a85a6a', '#d08a98']], glow0: '#2a9a98', glow1: '#80e8d8', moss: 0.2, mossColor: '#486a38',
    },
    '.': 'shingle', ',': 'turf', ':': 'path', q: 'shingle', o: 'planks', X: 'cobbles',
    wallTop: 'rockTop', wallFace: 'rockFace', h: 'boardWall',
    houses: 'wall', stand: { I: 'post', J: 'stump', '^': 'rockpillar' }, block: 'wetrock',
    O: 'boulder', F: 'weed', Z: 'wrack', N: 'grass', x: 'barnacle', hang: 'rope',
  },
  // --- SALTCOMBE: a stilt town of boards and ropes, lit from inside. ---
  saltcombe: {
    p: {
      shadow: '4, 14, 18', wetShade: '4, 20, 28', wetLine: '#7a9a98', glint: '#c8dcd0',
      ground: ['#7a6040', '#725a3c', '#82663f', '#6a5236'], hi: '#98784a', lo: '#4a3826', crack: '#2a2016',
      speck: ['#4a3a28', '#a89068', '#5a4a34'], shells: ['#d8c8b0'],
      turf: ['#4c7448', '#487046', '#527c4c', '#426a40'], turfHi: '#78a468', turfLo: '#34553a',
      path: ['#8e7e60', '#867658', '#968568'],
      water: '#21495a', deep: '#193c4c', wave: '#3e7a88', troughs: '#132f3e', foam: '#cce8e0', lip: '#10303c', caps: 0.1,
      shallow: '#3e7a7c', shallowHi: '#5a9894', stone: '#6a7470', stoneDark: '#2a3236', stoneHi: '#98a4a0',
      plank: ['#7a6040', '#72593a', '#826843', '#6a5236'], plankHi: '#9a7c52', plankLo: '#4a3826', gap: '#1e150c', nail: '#c8b890', rope: '#b8a47c',
      deepRock: '#14201f', deepRock2: '#0c1616', topRock: '#1c2a28', rim: '#5a766e', rockLo: '#2a3a38', fleck: '#d8c080',
      rock: ['#4a5652', '#44504c', '#505e5a', '#3e4a46'], streak: '#7a948c', weedFoot: ['#3a5a30', '#2e4a28'], rivet: '#9aa8a0', rust: '#7a4a30',
      houses: ['#3e7a7a', '#a8803a', '#9a4a4a', '#5a7a9a', '#7a8a4a'], boardHi: '#ffffff30', boardLo: '#1a2a2a', trim: '#2a2018', frame: '#2a2018', glass: '#ffd488', glassHi: '#fff0b8',
      sill: '#3a2c1c', curtain: '#c8603c', door: '#5a3c22', doorHi: '#7c5a38', knob: '#ffd23c',
      roof: ['#2c3a3e', '#26343a', '#323f44', '#202c30'], roofHi: '#4a5c60', roofLo: '#141c1e',
      wall: ['#6a5238', '#624b32', '#725940'], wallHi: '#8a6e4a', wallLo: '#3a2c1c', nail: '#c8b890',
      stand0: '#1e150c', stand1: '#4a3a28', stand2: '#6e5a3c', standHi: '#98805a', sail: '#9a9078', sailLo: '#5a5444', hoop: '#3a3226', net: '#8a7c5c', float: '#e0603a',
      weed: ['#3c5c2c', '#486a34'], weedHi: '#7ca058', driftwood: '#a89c80',
      coral: [['#a85a6a', '#d08a98']], glow0: '#2a9a98', glow1: '#80e8d8', moss: 0, mossColor: '#486a38',
    },
    '.': 'planks', ',': 'turf', ':': 'path', q: 'shingle', o: 'planksV', X: 'cobbles',
    wallTop: 'rockTop', wallFace: 'boardWall', h: 'boardWall',
    houses: 'wall', stand: { I: 'post', J: 'stump', '^': 'rockpillar' }, block: 'timber',
    O: 'barrel', F: 'pots', Z: 'wrack', N: 'grass', x: 'barnacle', hang: 'rope',
    // The headland's rock (the lagoon's and the lookout's cliffs): K is a sea-cliff face.
    K: 'seaCliff',
  },
  // --- THE SUNKEN LANES: drowned cobbles, mossy walls, brown-green water. ---
  lanes: {
    p: {
      shadow: '4, 22, 18', wetShade: '6, 28, 20', wetLine: '#7a9a80', glint: '#b8d0b8',
      ground: ['#6c6e60', '#666a5c', '#727464', '#60645a'], hi: '#8a8e78', lo: '#464a40', crack: '#2a2e26', gap: '#2c3a2c',
      speck: ['#4a4e42', '#98a088', '#3e4a38'], shells: ['#d8d0c0'],
      turf: ['#4a7040', '#456a3c', '#507848', '#3e6038'], turfHi: '#78a060', turfLo: '#30502e', flowers: ['#d8c870', '#c8a8d0'],
      path: ['#7a6e50', '#726648', '#847858'],
      water: '#2e5a48', deep: '#264c3c', wave: '#4e8a6c', troughs: '#1c3e30', foam: '#cce8d8', lip: '#162e24', caps: 0.08,
      shallow: '#4c8a6c', shallowHi: '#6aa888', stone: '#7a8478', stoneDark: '#2e3a30', stoneHi: '#a4b0a0',
      plank: ['#6c5c40', '#645438', '#74644a'], plankHi: '#8c7a58', plankLo: '#463a26', nail: '#a89870', rope: '#a89878',
      deepRock: '#142018', deepRock2: '#0a140e', topRock: '#1c2c20', rim: '#52705a', rockLo: '#2a4034', fleck: '#8ab898',
      rock: ['#4a5c4e', '#445648', '#506456', '#3e5044'], streak: '#7a9a84', weedFoot: ['#3a6a38', '#2e5a30', '#4e7a40'], rivet: '#88a090', rust: '#7a4a30',
      houses: ['#6a7a68', '#7a7468', '#687a80'], boardHi: '#ffffff25', boardLo: '#1c2a20', trim: '#2a3a2c', frame: '#2a3a2c', glass: '#a8b8a0', glassHi: '#d0dcc8',
      sill: '#3a4a3c', curtain: '#8a5a4a', door: '#4a3a26', doorHi: '#6a5238', knob: '#c8b068',
      roof: ['#3a4a44', '#344440', '#40504a', '#2e3c38'], roofHi: '#5a7068', roofLo: '#18241f',
      wall: ['#58604c', '#505844', '#626a54'], wallHi: '#7a8468', wallLo: '#2c3426',
      stand0: '#1a1610', stand1: '#4a3e2e', stand2: '#6a5a44', standHi: '#8a7a5e', sail: '#8a8a74', sailLo: '#585848', hoop: '#3a3226', net: '#7a7c5c', float: '#c4503a',
      weed: ['#3c6830', '#4a7a38', '#32582a'], weedHi: '#86b060', driftwood: '#a8a888',
      coral: [['#a85a6a', '#d08a98']], glow0: '#2a9a98', glow1: '#80e8d8', moss: 0.45, mossColor: '#4a7840',
    },
    '.': 'cobbles', ',': 'turf', ':': 'path', q: 'shingle', o: 'planks', X: 'cobbles',
    wallTop: 'rockTop', wallFace: 'rockFace', h: 'boardWall',
    houses: 'wall', stand: { I: 'post', J: 'jag', '^': 'rockpillar' }, block: 'wetrock',
    O: 'boulder', F: 'weed', Z: 'hedge', N: 'grass', x: 'barnacle', hang: 'rope',
  },
  // --- THE WRECK YARD: iron hulls, rust, deck timbers, snapped masts. ---
  wreck: {
    p: {
      shadow: '4, 22, 16', wetShade: '4, 24, 20', wetLine: '#78968c', glint: '#a8c4b8',
      ground: ['#6a5a4a', '#625244', '#72604e', '#5a4c3e'], hi: '#88745e', lo: '#3e3228', crack: '#241c14', gap: '#241a12',
      speck: ['#3e3228', '#8a7860', '#4a3c30'], shells: ['#d0c0b0'],
      turf: ['#46663c', '#426038', '#4c6e42', '#3a5832'], turfHi: '#76986a', turfLo: '#2c4828',
      path: ['#7a6a52', '#72624a', '#84745a'],
      water: '#1f4248', deep: '#193640', wave: '#3c747a', troughs: '#112c34', foam: '#c4e4d8', lip: '#102830', caps: 0.2,
      shallow: '#3c7274', shallowHi: '#58908c', stone: '#707a78', stoneDark: '#2a3434', stoneHi: '#9aa6a2',
      plank: ['#6a5640', '#62503a', '#725e46', '#5a4834'], plankHi: '#86705a', plankLo: '#3e3022', nail: '#8a8878', rope: '#9c8c6c',
      deepRock: '#101a18', deepRock2: '#080e0c', topRock: '#18241f', rim: '#5a7468', rockLo: '#26362f', fleck: '#a87850',
      rock: ['#5a4a42', '#52443c', '#645248', '#4a3c36'], streak: '#8a5a3e', weedFoot: ['#2e4a28', '#3a5a30'], rivet: '#98887a', rust: '#9a5a34',
      houses: ['#5a6a64', '#6a5a4c'], boardHi: '#ffffff20', boardLo: '#141c18', trim: '#2a2218', frame: '#2a2218', glass: '#a8c4a8', glassHi: '#d0e4cc',
      sill: '#3a3024', curtain: '#6a3a2a', door: '#4a3a28', doorHi: '#6a5238', knob: '#c8a850',
      roof: ['#4a3e34', '#42362e', '#524438', '#3a2e28'], roofHi: '#6a5848', roofLo: '#1e1610',
      wall: ['#5e4c3c', '#564434', '#685440', '#4e3e30'], wallHi: '#80684e', wallLo: '#2e2218',
      stand0: '#140e08', stand1: '#3e3226', stand2: '#5e4c3a', standHi: '#80684e', sail: '#a29a84', sailLo: '#605848', hoop: '#4a4036', net: '#74684c', float: '#b4482e',
      weed: ['#2e4e2a', '#3a5c32', '#264224'], weedHi: '#6c9450', driftwood: '#988c74',
      coral: [['#a85a6a', '#d08a98']], glow0: '#2a9a98', glow1: '#80e8d8', moss: 0, mossColor: '#3a5a30',
      bridge: null,
    },
    '.': 'plate', ',': 'turf', ':': 'planks', q: 'shingle', o: 'planks', X: 'plate',
    wallTop: 'rockTop', wallFace: 'hullFace', h: 'hullFace',
    houses: 'wall', stand: { I: 'mast', J: 'stump', '^': 'jag' }, block: 'iron',
    O: 'crate', F: 'net', Z: 'wrack', N: 'grass', x: 'barnacle', hang: 'rope', cabin: true, seaPorthole: true,
  },
  // --- THE SOUNDINGS: a sea cave. Wet slate, black water, sea-glass. ---
  soundings: {
    p: {
      shadow: '2, 10, 16', wetShade: '2, 12, 20', wetLine: '#4a7a88', glint: '#7aa8b4',
      ground: ['#3c474c', '#374248', '#424e54', '#333d43'], hi: '#566870', lo: '#222b30', crack: '#12181c', gap: '#161e22',
      speck: ['#222b30', '#6a8088', '#2c383e', '#4a8a90'], shells: ['#a8c0c0'],
      turf: ['#2c4c40', '#284838', '#30523f', '#244034'], turfHi: '#58846c', turfLo: '#1c3428',
      path: ['#4a5258', '#444c52', '#50585e'],
      water: '#12384a', deep: '#0c2a3a', wave: '#2c7482', troughs: '#081e2a', foam: '#a8d8d8', lip: '#06161e', caps: 0.1,
      shallow: '#245c68', shallowHi: '#347a84', stone: '#566870', stoneDark: '#1a242a', stoneHi: '#7a929a',
      plank: ['#4e4234', '#463c2e', '#564a3a'], plankHi: '#6a5c48', plankLo: '#2e261c', nail: '#8a9890', rope: '#8a7c60',
      deepRock: '#0c1216', deepRock2: '#06090c', topRock: '#141c20', rim: '#4a6670', rockLo: '#1e2a30', fleck: '#6ad0c8',
      rock: ['#3a464c', '#344046', '#404e55', '#2e3a40'], streak: '#5a808a', weedFoot: ['#24483c', '#2e5a48'], rivet: '#7a9096', rust: '#6a4a34',
      stand0: '#10161a', stand1: '#323c42', stand2: '#4a5860', standHi: '#6a808a', sail: '#80908c', sailLo: '#4a5654', hoop: '#2a3236', net: '#5a6a60', float: '#a8483a',
      weed: ['#244c3c', '#2e5c48', '#1c3c30'], weedHi: '#58a888', driftwood: '#7a8880',
      coral: [['#a85a6a', '#d08a98']], glow0: '#2ab0b0', glow1: '#8af4ec', moss: 0.2, mossColor: '#2e5a48',
      hangKind: 'rock',
    },
    '.': 'rockfloor', ',': 'turf', ':': 'path', q: 'shingle', o: 'planks', X: 'cobbles',
    wallTop: 'rockTop', wallFace: 'rockFace', h: 'rockFace',
    houses: 'wall', stand: { I: 'rockpillar', J: 'jag', '^': 'rockpillar' }, block: 'wetrock',
    O: 'boulder', F: 'weed', Z: 'wrack', N: 'grass', x: 'glass', hang: 'rock',
  },
  // --- THE BEACON ISLES: wind-bleached rock and turf, little lights. ---
  isles: {
    p: {
      shadow: '4, 22, 14', wetShade: '4, 26, 24', wetLine: '#7ca498', glint: '#b0d0c4',
      ground: ['#7a8470', '#747e6a', '#808a76', '#6e7864'], hi: '#98a28c', lo: '#515a48', crack: '#323a2c', gap: '#2e3628',
      speck: ['#515a48', '#aab4a0', '#68745c'], shells: ['#d8d0c0'],
      turf: ['#5a804c', '#547a48', '#608654', '#4e7442'], turfHi: '#86b070', turfLo: '#3a5a34', flowers: ['#e0d078', '#c8a8d8'],
      path: ['#9a9680', '#928e78', '#a29e88'],
      water: '#1f5560', deep: '#194656', wave: '#44909a', troughs: '#123a48', foam: '#dcf4ec', lip: '#103440', caps: 0.28,
      shallow: '#4a9490', shallowHi: '#68b0a8', stone: '#808a84', stoneDark: '#323c3c', stoneHi: '#aab6b0',
      plank: ['#7a6446', '#725c40', '#826c4c'], plankHi: '#9a8260', plankLo: '#4a3a28', gap: '#2a2016', nail: '#c8b890', rope: '#b0a07c',
      deepRock: '#141e1c', deepRock2: '#0a1210', topRock: '#1e2c2a', rim: '#58766e', rockLo: '#2c3e3a', fleck: '#e0d090',
      rock: ['#5a6a66', '#52625e', '#627270', '#4a5a56'], streak: '#86a49a', weedFoot: ['#3c643a', '#2e5030', '#4a7442'], rivet: '#98a8a0', rust: '#7a4a30',
      houses: ['#c8c4b0', '#b8c4c0', '#c4b8a4'], boardHi: '#ffffff30', boardLo: '#2a3030', trim: '#3a3a30', frame: '#2a2a22', glass: '#ffd488', glassHi: '#fff0b8',
      sill: '#4a4a3c', curtain: '#c8603c', door: '#5a3c22', doorHi: '#7c5a38', knob: '#ffd23c',
      roof: ['#3a4a50', '#344448', '#40545a', '#2c3c42'], roofHi: '#5c7680', roofLo: '#16222a',
      wall: ['#6a5a42', '#62523c', '#726248'], wallHi: '#8a7858', wallLo: '#3a2e20',
      stand0: '#14100a', stand1: '#3e3426', stand2: '#5c4e3a', standHi: '#7c6a50', sail: '#a8a08a', sailLo: '#605a48', hoop: '#3a3228', net: '#7a7458', float: '#d0562e',
      weed: ['#3c6a38', '#4a7a40', '#325a2e'], weedHi: '#86b468', driftwood: '#a8a48c',
      coral: [['#a85a6a', '#d08a98']], glow0: '#2ab0a0', glow1: '#8af4e0', moss: 0.2, mossColor: '#4a7840',
    },
    '.': 'rockfloor', ',': 'turf', ':': 'path', q: 'shingle', o: 'planks', X: 'cobbles',
    wallTop: 'rockTop', wallFace: 'rockFace', h: 'brickFace',
    houses: 'wall', stand: { I: 'pillar', J: 'jag', '^': 'rockpillar' }, block: 'wetrock',
    O: 'boulder', F: 'weed', Z: 'wrack', N: 'grass', x: 'barnacle', hang: 'rope',
    // The rope bridges ride on floats (bridgeSide); a free-standing brick wall has a coping.
    floats: true, coping: true,
  },
  // --- HADDOCK'S LIGHT: whitewashed lighthouse, warm boards, a windy garden. ---
  haddock_light: {
    p: {
      shadow: '8, 16, 14', wetShade: '4, 22, 26', wetLine: '#8aa8a0', glint: '#d0e4dc',
      ground: ['#b4ac98', '#aca490', '#bab29e', '#a69e8a'], hi: '#ccc4b0', lo: '#7a7462', crack: '#4a4638', gap: '#5a5646',
      speck: ['#7a7462', '#d8d0bc', '#8a846e'], shells: ['#e8e0d0'],
      turf: ['#58804c', '#527a48', '#5e8654', '#4c7442'], turfHi: '#86b070', turfLo: '#38583a', flowers: ['#f0d870', '#e8a0b8', '#f4f0e8'],
      path: ['#aaa088', '#a29880', '#b2a890'],
      water: '#1f5560', deep: '#194656', wave: '#44909a', troughs: '#123a48', foam: '#dcf4ec', lip: '#103440', caps: 0.2,
      shallow: '#4a9490', shallowHi: '#68b0a8', stone: '#808a84', stoneDark: '#323c3c', stoneHi: '#aab6b0',
      plank: ['#a07a4c', '#987244', '#a88256', '#926c40'], plankHi: '#c09a68', plankLo: '#6a4c2c', gap: '#3e2c18', nail: '#4a3620', rope: '#c8b88c',
      deepRock: '#141e1c', deepRock2: '#0a1210', topRock: '#1e2c2a', rim: '#58766e', rockLo: '#2c3e3a', fleck: '#e0d090',
      rock: ['#d2ccba', '#cac4b2', '#dad4c2', '#c2bcaa'], streak: '#a8a28c', weedFoot: ['#3c643a', '#2e5030'], rivet: '#98a8a0', rust: '#9a6a44',
      houses: ['#e4dfce', '#dcd6c4'], boardHi: '#ffffff', boardLo: '#9a9482', trim: '#b8452e', frame: '#6a4a2c', glass: '#ffd488', glassHi: '#fff0b8',
      sill: '#8a6a44', curtain: '#c8603c', door: '#8a4a30', doorHi: '#aa6a48', knob: '#ffd23c',
      roof: ['#a8452e', '#9e3e28', '#b04c34', '#963a26'], roofHi: '#cc6a50', roofLo: '#5a2216',
      wall: ['#cec8b4', '#c6c0ac', '#d6d0bc'], wallHi: '#f0ecdc', wallLo: '#8a8470', trim2: '#b8452e', nail: '#6a5a40',
      stand0: '#2a1c10', stand1: '#7a5630', stand2: '#a77a48', standHi: '#d8a870', sail: '#e8e0cc', sailLo: '#a8a090', hoop: '#6a5638', net: '#a89a74', float: '#d8503a',
      weed: ['#4a7a40', '#58884a', '#3e6c36'], weedHi: '#90c070', driftwood: '#c8c0a8',
      coral: [['#a85a6a', '#d08a98']], glow0: '#2ab0a0', glow1: '#8af4e0', moss: 0, mossColor: '#4a7840', curve: true,
    },
    '.': 'flags', ',': 'turf', ':': 'path', q: 'shingle', o: 'planks', X: 'cobbles',
    wallTop: 'rockTop', wallFace: 'brickFace', h: 'brickFace',
    houses: 'wall', stand: { I: 'pillar', J: 'stump', '^': 'rockpillar' }, block: 'lighthouse',
    O: 'barrel', F: 'pots', Z: 'wrack', N: 'grass', x: 'barnacle', hang: 'rope', curve: true,
  },
  // --- THE STORM REACH: open sea round Haddock's boat. Dark rock, deck, heavy water. ---
  reach: {
    p: {
      shadow: '2, 22, 14', wetShade: '2, 24, 20', wetLine: '#78a898', glint: '#b0d4c4',
      ground: ['#58625c', '#525c56', '#5e6862', '#4c5650'], hi: '#78857c', lo: '#363e3a', crack: '#1e2422', gap: '#222a26',
      speck: ['#363e3a', '#8a9a90', '#46524c'], shells: ['#c8d0c0'],
      turf: ['#3e6038', '#3a5a34', '#446840', '#34522e'], turfHi: '#6a9460', turfLo: '#284228',
      path: ['#6a6e5e', '#646858', '#727666'],
      water: '#183e48', deep: '#12323c', wave: '#3a7880', troughs: '#0c2830', foam: '#d4f0e4', lip: '#0c2a34', caps: 0.34,
      shallow: '#36767a', shallowHi: '#50908e', stone: '#667470', stoneDark: '#222c2c', stoneHi: '#8a9c96',
      plank: ['#6a5640', '#62503a', '#725e46', '#5a4834'], plankHi: '#86705a', plankLo: '#3e3022', nail: '#98988a', rope: '#a49474',
      deepRock: '#0e1816', deepRock2: '#060c0a', topRock: '#16221f', rim: '#4a6a60', rockLo: '#22322d', fleck: '#8ab8a0',
      rock: ['#3e4c48', '#384642', '#465450', '#32403c'], streak: '#6a9288', weedFoot: ['#2c4c28', '#3a5c30'], rivet: '#88988e', rust: '#8a5030',
      houses: ['#5a6a64'], boardHi: '#ffffff20', boardLo: '#141c18', trim: '#2a2218', frame: '#2a2218', glass: '#a8c4a8', glassHi: '#d0e4cc',
      sill: '#3a3024', curtain: '#6a3a2a', door: '#4a3a28', doorHi: '#6a5238', knob: '#c8a850',
      roof: ['#3a4a44'], roofHi: '#5a7068', roofLo: '#18241f',
      wall: ['#5e4c3c', '#564434', '#685440'], wallHi: '#80684e', wallLo: '#2e2218',
      stand0: '#120e08', stand1: '#3a2e22', stand2: '#584634', standHi: '#786248', sail: '#988f7a', sailLo: '#58503f', hoop: '#3a3226', net: '#6e6448', float: '#b4482e',
      weed: ['#2c4c28', '#385a30', '#244024'], weedHi: '#6c9450', driftwood: '#8a8470',
      coral: [['#a85a6a', '#d08a98']], glow0: '#2ab0a0', glow1: '#8af4e0', moss: 0, mossColor: '#3a5a30',
    },
    '.': 'rockfloor', ',': 'turf', ':': 'planks', q: 'shingle', o: 'planks', X: 'cobbles',
    wallTop: 'rockTop', wallFace: 'rockFace', h: 'hullFace',
    houses: 'wall', stand: { I: 'mast', J: 'stump', '^': 'rockpillar' }, block: 'wetrock',
    O: 'boulder', F: 'net', Z: 'wrack', N: 'grass', x: 'barnacle', hang: 'rope',
  },
  // --- THE LAST LIGHT: black stone, iron ribs, spikes. ---
  lastlight: {
    p: {
      shadow: '0, 14, 8', wetShade: '0, 16, 12', wetLine: '#70a090', glint: '#a0d0bc',
      ground: ['#3a4246', '#353d41', '#40484c', '#30383c'], hi: '#586468', lo: '#1e2428', crack: '#0e1214', gap: '#12181a',
      speck: ['#1e2428', '#6a787c', '#2a3236'], shells: ['#a8b8b0'],
      turf: ['#36563a', '#325234', '#3a5c3e', '#2c4a30'], turfHi: '#5e8660', turfLo: '#223a26',
      path: ['#4a5050', '#444a4a', '#505656'],
      water: '#103840', deep: '#0b2c34', wave: '#2e7478', troughs: '#07222a', foam: '#c8ecdc', lip: '#061c22', caps: 0.3,
      shallow: '#2a6a6a', shallowHi: '#408484', stone: '#586668', stoneDark: '#161e20', stoneHi: '#7a8e90',
      plank: ['#4e4034', '#463a2e', '#564838', '#3e3228'], plankHi: '#6a5a46', plankLo: '#2e241a', nail: '#8a9490', rope: '#7a6c54',
      deepRock: '#0a1012', deepRock2: '#04070a', topRock: '#12191c', rim: '#4a6a68', rockLo: '#1a262a', fleck: '#78c8b0',
      rock: ['#2e383c', '#283236', '#364246', '#242e32'], streak: '#4a7478', weedFoot: ['#1e3c26', '#2a4c30'], rivet: '#7a8e8e', rust: '#6a4630',
      houses: ['#3a4448'], boardHi: '#ffffff18', boardLo: '#0e1618', trim: '#1a2022', frame: '#1a2022', glass: '#ffd488', glassHi: '#fff0b8',
      sill: '#2a3234', curtain: '#6a3a2a', door: '#3a2c20', doorHi: '#564232', knob: '#c8a850',
      roof: ['#242e32'], roofHi: '#44585c', roofLo: '#0e1618',
      wall: ['#3a4448', '#343e42', '#404a4e'], wallHi: '#586468', wallLo: '#1a2224',
      stand0: '#0a0e10', stand1: '#2a3438', stand2: '#3e4a4e', standHi: '#5a6a6e', sail: '#7a8280', sailLo: '#434a48', hoop: '#2a3234', net: '#4e5a50', float: '#a8482e',
      weed: ['#1e3c26', '#2a4c30', '#16301e'], weedHi: '#5a9068', driftwood: '#6a7470',
      coral: [['#a85a6a', '#d08a98']], glow0: '#2ab0a0', glow1: '#8af4e0', moss: 0, mossColor: '#2e5a3a',
    },
    '.': 'flags', ',': 'turf', ':': 'path', q: 'shingle', o: 'planks', X: 'cobbles',
    wallTop: 'rockTop', wallFace: 'brickFace', h: 'brickFace',
    houses: 'wall', stand: { I: 'pillar', J: 'jag', '^': 'jag' }, block: 'iron',
    O: 'boulder', F: 'net', Z: 'wrack', N: 'grass', x: 'barnacle', hang: 'rope', curve: true,
  },
};
// Merrow (on hold) borrows the Wreck Yard's palette in sunken stone until it is designed.
AREAS.merrow = { ...AREAS.lanes, p: { ...AREAS.lanes.p, water: '#1c4c4c', deep: '#143e3e' } };

// Raised-ledge looks, from each area's palette.
function ledgeLook(p, kind) {
  const tones = {
    sandstone: { faceBase: '#8a7858', bricks: ['#c0ae90', '#b8a688', '#c8b698', '#b0a082'], brickHi: '#ddd0b0', outline: '#5a4a32', tops: ['#e0d0a8', '#dccca4', '#e6d6ae'], seam: '#b8a47c', fleck: '#fff0c8', lit: '#f4e8c4' },
    timber: { faceBase: p.gap, bricks: p.plank, brickHi: p.plankHi, outline: p.deepRock2, tops: p.plank, seam: p.plankLo, fleck: p.nail, lit: p.plankHi },
    iron: { faceBase: p.deepRock2, bricks: p.rock, brickHi: p.rim, outline: p.deepRock2, tops: [p.ground[0], p.ground[1], p.ground[2]], seam: p.lo, fleck: p.rust, lit: p.hi },
    lighthouse: { faceBase: p.wallLo, bricks: p.rock, brickHi: p.wallHi ?? p.rim, outline: p.wallLo, tops: p.ground, seam: p.lo, fleck: p.hi, lit: p.hi },
    wetrock: { faceBase: p.deepRock2, bricks: p.rock, brickHi: p.rim, outline: p.deepRock2, tops: [p.ground[0], p.ground[1], p.ground[2]], seam: p.lo, fleck: p.glint ?? p.hi, lit: p.hi, weed: p.weedFoot?.[0] },
  };
  return tones[kind] ?? tones.wetrock;
}

// Cargo (a room's `cargo` boxes: [{ x, y, w, h }] in tiles): the room's b and B
// tiles inside them draw as wooden crates instead of the area's stone, each tile
// its own crate. A b is one crate; a B is two stacked. Same heights and
// solidity as any b or B.
const inCargo = (room, tx, ty) => (room?.cargo ?? []).some((r) => tx >= r.x && ty >= r.y && tx < r.x + r.w && ty < r.y + r.h);
function crateFront(ctx, x, y, w, h, tx, ty, salt, p) {
  px(ctx, p.stand0, x, y, w, h);
  // Boards across, the frame round them, a brace corner to corner.
  for (let j = 1; j < h - 1; j += 3) px(ctx, pick(p.plank, hash(tx, ty * 7 + j, salt)), x + 1, y + j, w - 2, 2);
  px(ctx, p.plankHi, x + 1, y + 1, w - 2, 1);
  px(ctx, p.plankHi, x + 1, y + 1, 2, h - 2);
  px(ctx, p.plankLo, x + w - 3, y + 1, 2, h - 2);
  px(ctx, p.plankLo, x + 1, y + h - 2, w - 2, 1);
  const flip = hash(tx, ty, salt + 3) < 0.5;
  const span = w - 7;
  for (let i = 0; i <= span; i++) {
    const by = y + 2 + Math.round(((flip ? i : span - i) / span) * (h - 5));
    px(ctx, p.plankHi, x + 3 + i, by, 1, 1);
    px(ctx, p.plankLo, x + 3 + i, by + 1, 1, 1);
  }
  // Nails at the corners, and now and then a stencilled mark or a rope round it.
  for (const [nx, ny] of [[x + 1, y + 1], [x + w - 2, y + 1], [x + 1, y + h - 2], [x + w - 2, y + h - 2]]) px(ctx, p.nail, nx, ny, 1, 1);
  const r = hash(tx, ty, salt + 5);
  if (r < 0.3 && h >= 10) { px(ctx, '#c8bca0', x + 5, y + 5, 6, 1); px(ctx, '#c8bca0', x + 7, y + 3, 2, 5); }
  else if (r > 0.78) { px(ctx, p.rope, x + 5, y + 1, 2, h - 2); px(ctx, p.stand0, x + 7, y + 1, 1, h - 2); }
}
function crateLid(ctx, x, y, tx, ty, salt, p) {
  px(ctx, p.stand0, x, y, T, T);
  for (let j = 0; j < 3; j++) px(ctx, pick(p.plank, hash(tx, ty * 3 + j, salt)), x + 1, y + 1 + j * 5, T - 2, 4);
  px(ctx, p.plankHi, x + 1, y + 1, T - 2, 1);
  px(ctx, p.plankLo, x + 1, y + 5, T - 2, 1);
  px(ctx, p.plankLo, x + 1, y + 10, T - 2, 1);
  // The lid's battens at each end, nailed.
  px(ctx, p.plankHi, x + 2, y + 1, 2, T - 2);
  px(ctx, p.plankLo, x + T - 4, y + 1, 2, T - 2);
  for (const ny of [3, 8, 13]) { px(ctx, p.nail, x + 2, y + ny, 1, 1); px(ctx, p.nail, x + T - 3, y + ny, 1, 1); }
  if (hash(tx, ty, salt + 9) < 0.35) px(ctx, p.plankLo, x + 6 + rnd(tx, ty, salt + 10, 4), y + 7, 3, 1);
  // Damp along the near edge.
  if (hash(tx, ty, salt + 11) < 0.5) shade(ctx, x + 1, y + 12, T - 2, 3, 0.2);
}
function crateBlockOf(raise, p) {
  return (ctx, x, y, tx, ty, room, floor) => {
    floor(ctx, x, y, tx, ty, room);
    const top = y - raise;
    if (raise <= 12) crateFront(ctx, x, top + T, T, raise, tx, ty, 70, p);
    else {
      crateFront(ctx, x, top + T + 12, T, 12, tx, ty, 72, p);
      crateFront(ctx, x, top + T, T, 12, tx, ty + 99, 74, p);
      shade(ctx, x + 1, top + T + 12, T - 2, 1, 0.45);
    }
    crateLid(ctx, x, top, tx, ty, 76 + raise, p);
    // Its shadow on the deck at the foot.
    shade(ctx, x, y + T - 1, T, 1, 0.35);
  };
}

// A round porthole on a ship's wall, the glass dark with the storm outside:
// grey-green sky, the horizon, the swell with a white crest, rain on the glass.
function seaPorthole(ctx, x, y, tx, ty, room, p, cfg) {
  WALLS[cfg.wallFace](ctx, x, y, tx, ty, room, p);
  const cx = x + 8;
  const cy = y + 7;
  oval(ctx, p.stand0, cx, cy, 6, 6);
  oval(ctx, '#6a6656', cx, cy, 5, 5);
  oval(ctx, '#0c1c1a', cx, cy, 4, 4);
  // Sky, then the sea from the horizon down.
  oval(ctx, '#2a4440', cx, cy - 1, 3, 2);
  px(ctx, '#1e3a36', cx - 3, cy, 7, 1);
  px(ctx, '#9cbcb0', cx - 3, cy + 1, 7, 1);
  oval(ctx, '#123a34', cx, cy + 3, 3, 1);
  const crest = rnd(tx, ty, 61, 4);
  px(ctx, '#cfe6dc', cx - 2 + crest, cy + 2, 2, 1);
  px(ctx, '#3c6a62', cx - 3, cy + 2, 1, 1);
  // A glint on the glass and a run of rain down it.
  px(ctx, '#d4ecdf', cx - 3, cy - 3, 2, 1);
  px(ctx, '#d4ecdf', cx - 3, cy - 2, 1, 1);
  px(ctx, '#7aa69a', cx + 1 + rnd(tx, ty, 62, 2), cy - 2, 1, 3);
  // Rivets round the rim, rust weeping from the bottom one.
  for (const [dx, dy] of [[0, -5], [5, 0], [0, 5], [-5, 0]]) px(ctx, '#a89e7e', cx + dx, cy + dy, 1, 1);
  px(ctx, p.rust ?? '#9a5a34', cx, cy + 6, 1, 2);
}

// =====================================================================
// From a config to the drawing functions for every letter.
// =====================================================================
// Whatever a palette leaves out is worked out from what it has.
function withDefaults(p) {
  return {
    wall: p.plank, wallHi: p.plankHi, wallLo: p.plankLo, trim: p.gap ?? p.deepRock2, hoop: p.stand0,
    houses: [p.plank[0]], boardHi: '#ffffff20', boardLo: p.deepRock2, frame: p.stand0, glass: '#ffd488', glassHi: '#fff0b8',
    sill: p.plankLo, curtain: '#8a4a3a', door: p.plank[1], doorHi: p.plankHi, knob: '#d8b858',
    roof: [p.rock[1]], roofHi: p.rim, roofLo: p.deepRock2, ...p,
  };
}
function buildLook(cfg0) {
  const cfg = { ...cfg0, p: withDefaults(cfg0.p) };
  const { p } = cfg;
  const ground = (kind) => {
    if (kind === 'planksV') return (c, x, y, tx, ty, room) => GROUND.planks(c, x, y, tx, ty, room, p, true);
    return (c, x, y, tx, ty, room) => GROUND[kind](c, x, y, tx, ty, room, p);
  };
  const look = {};
  for (const letter of ['.', ',', ':', 'q', 'o', 'X']) look[letter] = ground(cfg[letter]);
  look['#'] = (c, x, y, tx, ty, room) => WALLS.rockTop(c, x, y, tx, ty, room, p);
  look.k = look['#'];
  const face = (c, x, y, tx, ty, room) => WALLS[cfg.wallFace](c, x, y, tx, ty, room, { ...p, curve: cfg.curve });
  look.W = face; look.K = face; look.G = face;
  // An area can give K a look of its own (Saltcombe's sea cliffs: `K: 'seaCliff'`).
  if (cfg.K) look.K = (c, x, y, tx, ty, room) => WALLS[cfg.K](c, x, y, tx, ty, room, p);
  look.h = (c, x, y, tx, ty, room) => WALLS[cfg.h](c, x, y, tx, ty, room, { ...p, curve: cfg.curve });
  // Walls hung with weed (V) or tattered sailcloth (H).
  look.V = (c, x, y, tx, ty, room) => {
    face(c, x, y, tx, ty, room);
    for (let i = 0; i < 9; i++) px(c, pick(p.weed, hash(tx, ty, 900 + i)), x + rnd(tx, ty, 910 + i, 15), y + rnd(tx, ty, 920 + i, 4), 1, 4 + rnd(tx, ty, 930 + i, 9));
  };
  look.H = (c, x, y, tx, ty, room) => {
    face(c, x, y, tx, ty, room);
    px(c, p.stand0, x + 2, y + 1, 12, 1);
    for (let i = 0; i < 4; i++) px(c, i % 2 ? p.sailLo : p.sail, x + 2 + i * 3, y + 2, 3, 6 + ((i * 5 + tx) % 5));
  };
  look['~'] = (c, x, y, tx, ty, room) => water(c, x, y, tx, ty, room, p);
  look[';'] = (c, x, y, tx, ty, room) => shallows(c, x, y, tx, ty, room, p);
  look.j = (c, x, y, tx, ty, room) => stones(c, x, y, tx, ty, room, p);
  look.g = (c, x, y, tx, ty, room) => bridge(c, x, y, tx, ty, room, p);
  look['0'] = (c, x, y, tx, ty, room) => drop(c, x, y, tx, ty, room, p);
  // A free-standing wall of brick (an `h` with open ground above it, like the Isles' lamp-yard):
  // a coping of capstones along the top, and its shadow on the ground at its foot.
  if (cfg.coping) {
    const plainH = look.h;
    look.h = (c, x, y, tx, ty, room) => {
      plainH(c, x, y, tx, ty, room);
      const up = at(room, tx, ty, 0, -1);
      if (up == null || isWallish(up) || up === 'h') return;
      px(c, p.deepRock2, x, y + 4, T, 1);
      for (let sx = 0; sx < T; sx += 4) {
        px(c, pick(p.rock, hash(tx * 4 + sx, ty, 640)), x + sx, y, 4, 4);
        px(c, p.stoneHi ?? p.rim, x + sx, y, 3, 1);
        px(c, p.rockLo, x + sx + 3, y, 1, 4);
      }
      const down = at(room, tx, ty, 0, 1);
      if (down != null && !isWallish(down) && down !== 'h') shade(c, x, y + T - 1, T, 1, 0.35);
    };
  }
  // Rope bridges on floats (see bridgeSide): only where the area asks for them.
  if (cfg.floats) {
    const plain = { '~': look['~'], q: look.q, o: look.o, g: look.g };
    look.g = (c, x, y, tx, ty, room) => { plain.g(c, x, y, tx, ty, room); bridgeSide(c, x, y, tx, ty, room, p, false); };
    look['~'] = (c, x, y, tx, ty, room) => {
      plain['~'](c, x, y, tx, ty, room);
      bridgeFloat(c, x, y, tx, ty, room, p, false);
      sunkBridge(c, x, y, tx, ty, room, p);
    };
    look.q = (c, x, y, tx, ty, room) => { plain.q(c, x, y, tx, ty, room); bridgeFloat(c, x, y, tx, ty, room, p, true); };
    // Boards are a slack bridge only out on the bed (indoors they're a floor).
    look.o = (c, x, y, tx, ty, room) => {
      plain.o(c, x, y, tx, ty, room);
      if (['q', '~', ';'].includes(at(room, tx, ty, 0, -1)) || ['q', '~', ';'].includes(at(room, tx, ty, 0, 1))) bridgeSide(c, x, y, tx, ty, room, p, true);
    };
  }
  look.f = (c, x, y, tx, ty, room, floor) => rail(c, x, y, tx, ty, room, p, floor);
  look.b = blockOf(12, ledgeLook(p, cfg.block));
  look.B = blockOf(24, ledgeLook(p, cfg.block));
  // A room's `cargo` boxes turn its b and B into crates (see crateBlockOf).
  for (const [letter, raise] of [['b', 12], ['B', 24]]) {
    const stone = look[letter];
    const crate = crateBlockOf(raise, p);
    look[letter] = (c, x, y, tx, ty, room, floor) => (inCargo(room, tx, ty) ? crate : stone)(c, x, y, tx, ty, room, floor);
  }
  look.O = (c, x, y, tx, ty, room, floor) => { floor(c, x, y, tx, ty, room); BLOCKERS[cfg.O](c, x, y, tx, ty, room, p); };
  look.F = (c, x, y, tx, ty, room, floor) => HEAPS[cfg.F](c, x, y, tx, ty, room, p, floor);
  look.Z = cfg.Z === 'hedge'
    ? (c, x, y, tx, ty, room, floor) => hedgeRow(c, x, y, tx, ty, room, p, floor)
    : (c, x, y, tx, ty, room, floor) => wrackHeap(c, x, y, tx, ty, room, p, floor);
  look.N = (c, x, y, tx, ty, room, floor) => seaGrass(c, x, y, tx, ty, room, p, floor);
  look.x = (c, x, y, tx, ty, room, floor) => MASSES[cfg.x](c, x, y, tx, ty, room, p, floor);
  look.I = (c, x, y, tx, ty, room) => STANDING[cfg.stand.I](c, x, y, tx, ty, room, p);
  look.J = (c, x, y, tx, ty, room) => STANDING[cfg.stand.J](c, x, y, tx, ty, room, p);
  look['^'] = (c, x, y, tx, ty, room) => STANDING[cfg.stand['^']](c, x, y, tx, ty, room, p);
  look.v = (c, x, y, tx, ty, room) => hanging(c, x, y, tx, ty, room, p);
  // Houses, and a ship's deckhouse.
  look[5] = (c, x, y, tx, ty, room) => HOUSES.wall(c, x, y, tx, ty, room, p);
  look[6] = (c, x, y, tx, ty, room) => HOUSES.window(c, x, y, tx, ty, room, p);
  look[7] = (c, x, y, tx, ty, room) => HOUSES.roof(c, x, y, tx, ty, room, p);
  look[8] = (c, x, y, tx, ty, room) => HOUSES.door(c, x, y, tx, ty, room, p);
  look.a = (c, x, y, tx, ty, room) => HOUSES.cabinWall(c, x, y, tx, ty, room, p);
  look.w = (c, x, y, tx, ty, room) => HOUSES.cabinWindow(c, x, y, tx, ty, room, p);
  // A ship's porthole looking out on the storm (the Wreck Yard): `seaPorthole` in the config.
  if (cfg.seaPorthole) look.w = (c, x, y, tx, ty, room) => seaPorthole(c, x, y, tx, ty, room, p, cfg);
  look.e = (c, x, y, tx, ty, room) => HOUSES.cabinRoof(c, x, y, tx, ty, room, p);
  return look;
}

const LOOKS = Object.fromEntries(Object.entries(AREAS).map(([area, cfg]) => [area, buildLook(cfg)]));

// =====================================================================
// Hooking in.
// =====================================================================
export function installCoastTiles(TILES, helpers) {
  const letters = new Set(Object.values(LOOKS).flatMap((look) => Object.keys(look)));
  // `0` (a drop) is made by deepTiles.js; if it is missing, make it here.
  if (!TILES['0']) TILES['0'] = { solid: true, beamOver: true, draw: () => {} };
  for (const letter of letters) {
    const tile = TILES[letter];
    if (!tile) continue;
    const old = tile.draw;
    tile.draw = (ctx, x, y, tx, ty, room) => {
      const draw = LOOKS[room?.area]?.[letter];
      if (!draw) return old(ctx, x, y, tx, ty, room);
      const floor = (c, fx, fy, ftx, fty, froom) => helpers.drawBaseFloor(c, fx, fy, ftx, fty, froom);
      return draw(ctx, x, y, tx, ty, room, floor, () => old(ctx, x, y, tx, ty, room));
    };
  }
}

// =====================================================================
// What glows in the tiles: lit windows and doors (Saltcombe, the lights,
// the Isles), the sea-glass in the Soundings' rock and its water.
// =====================================================================
const WINDOW_LIGHT = '255, 196, 108';
const GLASS_LIGHT = '120, 240, 220';
const windowGlow = (strength = 1) => [
  { dy: -1, bloom: 12, strength: 0.6 * strength, flicker: 0.15, color: WINDOW_LIGHT },
  { dy: 16, pool: 46, strength: 0.5 * strength, flicker: 0.12, color: WINDOW_LIGHT },
];
const doorGlow = (strength = 1) => [{ dy: 4, pool: 32, strength: 0.34 * strength, flicker: 0.2, color: WINDOW_LIGHT }];
const GLOW_TILES = {
  saltcombe: { 6: () => windowGlow(1.1), w: () => windowGlow(0.9), 8: () => doorGlow() },
  // Portholes on the storm: no lamp behind them, just a faint cold sea-light.
  wreck: { w: () => [{ dy: -1, bloom: 7, strength: 0.16, flicker: 0.05, color: '120, 196, 176' }] },
  isles: { 6: () => windowGlow(0.9), 8: () => doorGlow(0.8) },
  haddock_light: { 6: () => windowGlow(1.1), 8: () => doorGlow(), H: (tx, ty) => (hash(tx, ty, 3) < 0.5 ? [{ dy: 2, bloom: 10, strength: 0.5, flicker: 0.3, color: WINDOW_LIGHT }, { dy: 10, pool: 44, strength: 0.4, flicker: 0.2, color: WINDOW_LIGHT }] : null) },
  lastlight: { 6: () => windowGlow(0.7), H: (tx, ty) => [{ dy: 3, bloom: 9, strength: 0.4, flicker: 0.3, color: '170, 255, 210' }, { dy: 10, pool: 40, strength: 0.3, flicker: 0.2, color: '170, 255, 210' }] },
  soundings: {
    x: (tx, ty) => [{ dy: -2, bloom: 13, strength: 0.6, flicker: 0.2, color: GLASS_LIGHT }, { dy: 3, pool: 52, strength: 0.5, flicker: 0.1, color: GLASS_LIGHT }],
    '~': (tx, ty) => ((tx + ty * 2) % 5 === 0 ? [{ dy: 0, pool: 42, strength: 0.26, flicker: 0.1, color: '70, 200, 220' }] : null),
    v: (tx, ty) => (hash(tx, ty, 6) < 0.3 ? [{ dy: -12, bloom: 8, strength: 0.35, flicker: 0.2, color: GLASS_LIGHT }] : null),
  },
};

// The lights of a room's tiles, in world pixels.
export function coastTileLights(room) {
  const table = GLOW_TILES[room?.area];
  if (!table) return [];
  const lights = [];
  room.tiles.forEach((row, ty) => [...row].forEach((char, tx) => {
    const make = table[char];
    const list = make ? make(tx, ty) : null;
    if (!list) return;
    const cx = tx * T + T / 2;
    const cy = ty * T + T / 2;
    for (const l of list) lights.push({ ...l, x: cx + (l.dx ?? 0), y: cy + (l.dy ?? 0) });
  }));
  return lights;
}
