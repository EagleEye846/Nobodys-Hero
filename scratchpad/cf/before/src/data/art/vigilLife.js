// Props for the life pass on Mount Vigil (chapter 2, the `vigil_*` rooms): what the pilgrims left
// behind, what the weather did to it, and the small things that live up there. Drawn like
// islesProps.js: rows of characters from a small painter, 16 pixels to a tile, standing on the
// bottom edge and centred over their footprint. Every id starts `r2v_`. The ones that move are
// also animations (the prop's name in `animation`, and a `speed`).
//
//   r2v_pole_flags*    a prayer pole in a little cairn, five rag flags streaming off it (animated; a, b)
//   r2v_flag_line      two poles with a line of flags between them (2 wide, animated)
//   r2v_chime_post     a post and bracket with bone and tin chimes (animated)
//   r2v_prayer_wheel   a stone post with a little painted drum that turns (animated)
//   r2v_wall_flags     flags pegged along a rock face (animated)
//   r2v_offering_bowl  a stone bowl with a frozen oatcake and a ribbon in it
//   r2v_offering_cairn three stones with a frozen apple on top and a coin
//   r2v_name_stone     a slab with names and tally scratched in it
//   r2v_handholds      carved handholds in a rock face, one with a ribbon
//   r2v_icicles*       a row of icicles under a lip of rock (a, b, c)
//   r2v_icicle_big     a thick cluster hanging from a rock bracket
//   r2v_ice_fall       a frozen waterfall down the rock face
//   r2v_frost_patch    hoarfrost ferns on the rock (flat)
//   r2v_frozen_pool    a pool frozen over, ringed with stones (2 wide, flat)
//   r2v_fishing_hole   a hole in the ice, a stick, a line and a bobber
//   r2v_snow_lump*     soft mounds of snow (a, b, c)
//   r2v_rock_peek      a dark rock coming through the snow
//   r2v_frost_tuft     dry grass with frosted tips
//   r2v_tracks_*       a stoat's, a hare's and a bunting's tracks (flat)
//   r2v_wind_ripple    wind ripples in the snow (2 wide, flat)
//   r2v_ice_patch      glassy ice (flat)
//   r2v_pebble_spiral  stones set in a spiral by somebody with time (flat)
//   r2v_vole_hole      a small hole in the snow (flat)
//   r2v_lichen         lichen on a rock (flat)
//   r2v_flask / r2v_mitten / r2v_sled / r2v_ice_axe / r2v_snowshoes / r2v_frozen_shirt /
//   r2v_candle_jar / r2v_hat_stake / r2v_snowbunny / r2v_rime_stone / r2v_tiny_cairn /
//   r2v_stoat_den: the leftovers (see the room files for who left what)

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xfa00 + colors.size);
    colors.set(hex, c);
    palette[c] = hex;
  }
  return colors.get(hex);
}

class Grid {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.cells = Array.from({ length: h }, () => Array(w).fill(null));
  }

  set(x, y, c) {
    x = Math.round(x);
    y = Math.round(y);
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.cells[y][x] = c || null;
  }

  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
  }

  get(x, y) {
    return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.cells[y][x] : null;
  }

  oval(cx, cy, rx, ry, c) {
    for (let dy = -ry; dy <= ry; dy++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.25))));
      this.rect(cx - w, cy + dy, w * 2 + 1, 1, c);
    }
  }

  line(x0, y0, x1, y1, c) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) this.set(x0 + ((x1 - x0) * i) / steps, y0 + ((y1 - y0) * i) / steps, c);
  }

  // A dark rim round everything drawn so far.
  outline(c) {
    const edge = [];
    for (let y = -1; y <= this.h; y++) {
      for (let x = -1; x <= this.w; x++) {
        if (this.get(x, y)) continue;
        if (this.get(x - 1, y) || this.get(x + 1, y) || this.get(x, y - 1) || this.get(x, y + 1)) edge.push([x, y]);
      }
    }
    for (const [x, y] of edge) if (y >= 0 && y < this.h && x >= 0 && x < this.w) this.set(x, y, c);
  }

  rows() {
    return this.cells.map((row) => row.map((c) => (c ? char(c) : '.')).join(''));
  }
}

const frames = (fn, n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`f${i + 1}`, fn(i)]));

const SNOW = ['#ffffff', '#eef3fa', '#d3e0ee', '#aebfd8', '#8499bb'];
const ROCK = ['#232834', '#363d4e', '#4f586c', '#6b7589', '#8a94a6'];
const ICE = ['#35597e', '#6fa8d8', '#9bcbee', '#cbe8fa', '#eaf8ff'];
const DEEP = ['#17283e', '#22405e', '#2d5276'];
const WOOD = ['#33241a', '#54402e', '#765c42', '#9a7c5a'];
const ROPE = '#6e563a';
const CLOTH = ['#c8423a', '#3f78c8', '#e2b43a', '#4aa05a', '#f2f2ea'];
const CLOTH_DARK = ['#8c2a26', '#27508a', '#a98124', '#2e7340', '#b8b8ae'];
const OUT = '#1e2230';
const TAN = ['#8a7a5a', '#b4a27a', '#d2c298'];

// A tiny deterministic roll for texture.
const roll = (a, b = 0) => {
  let h = (a * 374761393 + b * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

// A snow mound, lit from the left: pale on top, blue underneath.
function mound(g, cx, base, rx, ry) {
  g.oval(cx, base - ry, rx, ry, SNOW[2]);
  g.oval(cx - 1, base - ry - 1, Math.max(1, rx - 2), Math.max(1, ry - 1), SNOW[1]);
  g.oval(cx - 2, base - ry - 1, Math.max(1, rx - 4), Math.max(1, ry - 2), SNOW[0]);
  g.rect(cx - rx, base, rx * 2 + 1, 1, SNOW[3]);
  g.rect(cx + 1, base - 1, Math.max(1, rx - 1), 1, SNOW[3]);
}

// A rock, snow on its shoulder.
function stone(g, cx, base, rx, ry, snowCap = true) {
  g.oval(cx, base - ry, rx, ry, ROCK[1]);
  g.oval(cx - 1, base - ry - 1, Math.max(1, rx - 1), Math.max(1, ry - 1), ROCK[2]);
  g.set(cx - rx + 2, base - ry - 1, ROCK[4]);
  g.set(cx - rx + 3, base - ry - 1, ROCK[3]);
  g.rect(cx - rx + 1, base - 1, rx * 2 - 1, 1, ROCK[0]);
  if (snowCap) {
    g.oval(cx - 1, base - ry * 2 + 1, Math.max(1, rx - 1), 1, SNOW[1]);
    g.rect(cx - rx + 2, base - ry * 2, Math.max(1, rx * 2 - 3), 1, SNOW[0]);
  }
}

function snowLump(v) {
  const g = new Grid(16, 9);
  if (v === 0) { mound(g, 8, 8, 6, 4); mound(g, 4, 8, 3, 2); }
  else if (v === 1) { mound(g, 6, 8, 5, 3); mound(g, 11, 8, 4, 2); }
  else { mound(g, 8, 8, 7, 3); g.set(5, 4, SNOW[4]); g.set(11, 5, SNOW[4]); }
  return g.rows();
}

function rockPeek() {
  const g = new Grid(16, 12);
  mound(g, 8, 11, 7, 2);
  stone(g, 7, 10, 5, 4);
  stone(g, 12, 11, 3, 2);
  return g.rows();
}

function frostTuft() {
  const g = new Grid(16, 10);
  mound(g, 8, 9, 5, 1);
  const blades = [[4, 5], [6, 7], [8, 8], [10, 6], [12, 4], [7, 4], [9, 5]];
  blades.forEach(([x, h], i) => {
    for (let k = 0; k < h; k++) g.set(x + Math.round(Math.sin(k * 0.5 + i) * 0.8), 8 - k, k > h - 3 ? TAN[2] : TAN[i % 2]);
    g.set(x + 1, 8 - h, SNOW[0]);
  });
  return g.rows();
}

// Little paired dots in a run: a stoat bounds, so they come in twos with a long gap.
function tracksStoat() {
  const g = new Grid(32, 8);
  let x = 1;
  for (let i = 0; i < 5; i++) {
    const y = 3 + Math.round(Math.sin(i * 1.7) * 1.5);
    g.rect(x, y, 2, 1, SNOW[4]); g.rect(x + 1, y + 2, 2, 1, SNOW[4]);
    g.set(x, y + 1, SNOW[3]); g.set(x + 3, y + 1, SNOW[3]);
    x += 6;
  }
  return g.rows();
}

function tracksHare() {
  const g = new Grid(32, 10);
  let x = 2;
  for (let i = 0; i < 3; i++) {
    // Two long hind prints in front, two small fore prints behind them.
    g.rect(x + 4, 2, 4, 2, SNOW[4]); g.rect(x + 4, 6, 4, 2, SNOW[4]);
    g.set(x + 5, 3, SNOW[3]); g.set(x + 5, 7, SNOW[3]);
    g.rect(x, 4, 2, 1, SNOW[4]); g.rect(x, 5, 2, 1, SNOW[3]);
    x += 10;
  }
  return g.rows();
}

function tracksBird() {
  const g = new Grid(16, 8);
  const print = (x, y) => { g.set(x, y, SNOW[4]); g.set(x - 1, y + 1, SNOW[4]); g.set(x + 1, y + 1, SNOW[4]); g.set(x, y + 1, SNOW[4]); g.set(x, y + 2, SNOW[3]); };
  print(2, 1); print(6, 4); print(10, 1); print(13, 4);
  return g.rows();
}

function windRipple() {
  const g = new Grid(32, 8);
  for (let row = 0; row < 4; row++) {
    const y = 1 + row * 2;
    const off = (row * 5) % 7;
    for (let x = off; x < 32 - 2; x += 8) {
      const len = 3 + ((x + row) % 3);
      g.rect(x, y, len, 1, row % 2 ? SNOW[3] : SNOW[2]);
      g.set(x + len, y + 1, SNOW[1]);
    }
  }
  return g.rows();
}

function icePatch() {
  const g = new Grid(16, 9);
  g.oval(8, 4, 7, 3, ICE[0]);
  g.oval(8, 4, 6, 2, ICE[1]);
  g.oval(7, 3, 4, 1, ICE[2]);
  g.rect(4, 3, 3, 1, ICE[4]);
  g.set(10, 5, ICE[3]);
  g.line(9, 2, 12, 5, ICE[0]);
  return g.rows();
}

function pebbleSpiral() {
  const g = new Grid(16, 12);
  const pts = [];
  for (let i = 0; i < 26; i++) {
    const a = i * 0.72;
    const r = 0.8 + i * 0.22;
    pts.push([8 + Math.cos(a) * r * 1.35, 5.5 + Math.sin(a) * r * 0.82]);
  }
  pts.forEach(([x, y], i) => {
    g.set(x, y, ROCK[2 + (i % 2)]);
    if (i % 3 === 0) g.set(x + 1, y, ROCK[1]);
    g.set(x - 0.4, y - 1, SNOW[1]);
  });
  return g.rows();
}

function voleHole() {
  const g = new Grid(16, 6);
  g.oval(8, 3, 4, 2, SNOW[3]);
  g.oval(8, 3, 3, 1, ROCK[0]);
  g.set(8, 3, '#0e1018');
  g.set(5, 1, SNOW[0]); g.set(11, 1, SNOW[0]);
  return g.rows();
}

function lichen() {
  const g = new Grid(16, 10);
  const blobs = [[4, 6, 3, 2, '#d49a3a'], [9, 4, 3, 2, '#b8b890'], [11, 7, 2, 2, '#d49a3a'], [6, 3, 2, 1, '#8aa070'], [3, 3, 2, 1, '#b8b890']];
  for (const [x, y, rx, ry, c] of blobs) {
    g.oval(x, y, rx, ry, c);
    g.set(x - 1, y - 1, SNOW[1]);
  }
  return g.rows();
}

// --- Things that hang and flap ---------------------------------------------------------------

// A cloth flag streaming off a pole to the right: wavy, ragged at the far end.
function flag(g, x, y, w, h, color, dark, phase) {
  for (let i = 0; i < w; i++) {
    const dy = Math.round(Math.sin(phase + i * 0.85) * (0.6 + i * 0.14));
    for (let j = 0; j < h; j++) {
      if (i >= w - 2 && (j + i) % 2) continue;
      g.set(x + i, y + dy + j, j === h - 1 ? dark : color);
    }
  }
}

function poleFlags(scheme) {
  return (f) => {
    const g = new Grid(16, 48);
    // The cairn at its foot.
    stone(g, 7, 47, 5, 3);
    stone(g, 11, 47, 3, 2);
    mound(g, 6, 47, 6, 1);
    // The pole: a straight stick, a knob on top.
    g.rect(7, 6, 2, 41, WOOD[2]);
    g.rect(7, 6, 1, 41, WOOD[3]);
    g.rect(8, 6, 1, 41, WOOD[1]);
    g.rect(6, 4, 4, 2, WOOD[3]);
    g.rect(7, 3, 2, 1, WOOD[2]);
    g.set(6, 40, ROPE); g.set(9, 40, ROPE);
    const order = scheme === 'a' ? [0, 1, 2, 3, 4] : scheme === 'rag' ? [0, 4, 1, 2, 3] : [3, 2, 4, 0, 1];
    for (let k = 0; k < 5; k++) {
      const c = order[k];
      // On the bare pole the middle flag has gone: three threads of blue are all that's left.
      if (scheme === 'rag' && k === 2) {
        for (let i = 0; i < 3; i++) { const sway = Math.round(Math.sin(f * 1.57 + i)); g.rect(9, 12 + k * 6 - 1 + i * 2, 3 + sway, 1, CLOTH[1]); }
        continue;
      }
      flag(g, 9, 6 + k * 6, 7, 4, CLOTH[c], CLOTH_DARK[c], f * 1.57 + k * 1.1);
    }
    // A snow cap on the cairn's shoulder.
    g.set(5, 43, SNOW[0]); g.set(6, 43, SNOW[0]); g.set(8, 44, SNOW[1]);
    g.outline(OUT);
    return g.rows();
  };
}

function flagLine() {
  return (f) => {
    const g = new Grid(32, 36);
    const post = (x) => {
      g.rect(x, 7, 2, 28, WOOD[2]); g.rect(x, 7, 1, 28, WOOD[3]);
      g.rect(x - 1, 33, 4, 2, ROCK[2]); g.set(x, 32, SNOW[0]); g.set(x + 1, 32, SNOW[1]);
      g.rect(x - 1, 6, 4, 1, WOOD[3]);
    };
    post(2); post(28);
    // The line sags in the middle.
    for (let x = 3; x < 29; x++) {
      const t = (x - 3) / 25;
      g.set(x, 9 + Math.round(Math.sin(t * Math.PI) * 4), ROPE);
    }
    for (let k = 0; k < 8; k++) {
      const x = 5 + k * 3;
      const t = (x - 3) / 25;
      const y = 10 + Math.round(Math.sin(t * Math.PI) * 4);
      const c = [0, 4, 1, 2, 3, 4, 0, 1][k];
      const sway = Math.round(Math.sin(f * 1.57 + k * 0.9) * 1);
      for (let j = 0; j < 6; j++) {
        if (j > 3 && (j + k) % 2) continue;
        g.rect(x + sway * (j > 2 ? 1 : 0), y + j, 2, 1, j === 5 ? CLOTH_DARK[c] : CLOTH[c]);
      }
    }
    g.outline(OUT);
    return g.rows();
  };
}

function chimePost() {
  return (f) => {
    const g = new Grid(16, 32);
    g.rect(3, 4, 2, 27, WOOD[2]); g.rect(3, 4, 1, 27, WOOD[3]);
    g.rect(3, 4, 11, 2, WOOD[2]); g.rect(3, 4, 11, 1, WOOD[3]);
    g.line(4, 12, 9, 5, WOOD[1]);
    stone(g, 4, 31, 4, 2);
    const hung = [[6, 9], [9, 12], [12, 8]];
    hung.forEach(([x, len], i) => {
      const sw = Math.round(Math.sin(f * 1.57 + i * 1.6));
      g.line(x, 6, x + sw, 6 + len - 3, ROPE);
      const bone = i % 2 === 0;
      g.rect(x + sw - 1, 3 + len, 3, 5, bone ? TAN[2] : '#b8c0c8');
      g.rect(x + sw - 1, 3 + len, 1, 5, bone ? TAN[1] : '#e0e6ec');
      g.set(x + sw, 8 + len, bone ? TAN[0] : '#6a727c');
    });
    g.outline(OUT);
    return g.rows();
  };
}

function prayerWheel() {
  return (f) => {
    const g = new Grid(16, 24);
    stone(g, 8, 23, 5, 3);
    g.rect(7, 12, 2, 10, ROCK[2]); g.rect(7, 12, 1, 10, ROCK[3]);
    // The drum.
    g.rect(3, 4, 10, 9, '#a2432f');
    g.rect(3, 4, 10, 1, '#d8a860');
    g.rect(3, 12, 10, 1, '#d8a860');
    g.rect(3, 4, 2, 9, '#c2573c');
    // Painted marks go round with the frames.
    for (let k = 0; k < 3; k++) {
      const x = 4 + ((k * 4 + f * 3) % 10);
      g.rect(x, 7, 2, 3, '#f0d890');
      g.set(x, 6, '#f0d890');
    }
    g.rect(7, 2, 2, 2, '#d8a860');
    g.set(7, 1, '#d8a860');
    g.set(5, 3, SNOW[0]); g.set(6, 3, SNOW[1]);
    g.outline(OUT);
    return g.rows();
  };
}

function wallFlags() {
  return (f) => {
    const g = new Grid(16, 16);
    g.rect(0, 3, 16, 1, WOOD[2]); g.rect(0, 3, 16, 0, WOOD[3]);
    g.rect(0, 2, 2, 3, ROCK[0]); g.rect(14, 2, 2, 3, ROCK[0]);
    g.rect(0, 2, 1, 1, WOOD[3]); g.rect(15, 2, 1, 1, WOOD[3]);
    for (let k = 0; k < 4; k++) {
      const x = 2 + k * 3;
      const c = [0, 4, 1, 2][k];
      const sway = Math.round(Math.sin(f * 1.57 + k * 1.2));
      for (let j = 0; j < 8; j++) {
        if (j > 5 && (j + k) % 2) continue;
        g.rect(x + (j > 3 ? sway : 0), 4 + j, 2, 1, j === 7 ? CLOTH_DARK[c] : CLOTH[c]);
      }
    }
    return g.rows();
  };
}

// --- What the pilgrims left ----------------------------------------------------------------------

function offeringBowl() {
  const g = new Grid(16, 12);
  mound(g, 8, 11, 7, 1);
  g.oval(8, 8, 6, 3, ROCK[1]);
  g.oval(8, 7, 5, 2, ROCK[2]);
  g.rect(3, 8, 11, 1, ROCK[0]);
  // The frozen offering: an oatcake in a skin of ice, a ribbon curled over it.
  g.oval(8, 6, 4, 2, ICE[2]);
  g.oval(8, 6, 3, 1, TAN[1]);
  g.set(6, 5, ICE[4]); g.set(7, 5, ICE[4]);
  g.line(10, 5, 12, 3, CLOTH[0]); g.set(12, 4, CLOTH[0]); g.set(13, 5, CLOTH_DARK[0]);
  g.outline(OUT);
  return g.rows();
}

function offeringCairn() {
  const g = new Grid(16, 18);
  mound(g, 8, 17, 7, 1);
  stone(g, 8, 16, 6, 3, false);
  stone(g, 8, 12, 4, 3, false);
  stone(g, 8, 8, 3, 2, false);
  // A frozen apple, glazed, and a coin on the stone beside it.
  g.oval(9, 4, 2, 2, '#9a2a2a');
  g.set(8, 3, '#d86a5a'); g.set(9, 1, WOOD[1]); g.set(10, 2, '#4a8a3a');
  g.set(8, 5, ICE[3]); g.set(10, 5, ICE[3]);
  g.oval(12, 6, 1, 0, '#d8b84a');
  g.set(5, 11, SNOW[0]); g.set(6, 11, SNOW[0]); g.set(7, 15, SNOW[1]);
  g.outline(OUT);
  return g.rows();
}

function nameStone() {
  const g = new Grid(16, 16);
  mound(g, 8, 15, 7, 1);
  g.oval(8, 9, 5, 6, ROCK[1]);
  g.oval(7, 8, 4, 5, ROCK[2]);
  g.rect(3, 13, 10, 2, ROCK[1]);
  // Scratched names: short strokes in rows, then a tally.
  for (let row = 0; row < 3; row++) {
    for (let k = 0; k < 3; k++) g.rect(4 + k * 3, 5 + row * 2, 2, 1, ROCK[4]);
  }
  for (let k = 0; k < 4; k++) g.rect(4 + k * 2, 11, 1, 2, ROCK[4]);
  g.line(4, 13, 11, 11, ROCK[4]);
  g.oval(7, 3, 3, 1, SNOW[1]); g.set(6, 2, SNOW[0]); g.set(9, 3, SNOW[2]);
  g.outline(OUT);
  return g.rows();
}

function handholds() {
  const g = new Grid(16, 16);
  // A smoothed patch of the face, a little paler than the rock round it.
  g.oval(8, 8, 7, 7, ROCK[3]);
  g.oval(8, 8, 6, 6, ROCK[2]);
  const holds = [[5, 12], [9, 8], [6, 4]];
  holds.forEach(([x, y]) => {
    g.rect(x - 2, y, 5, 3, ROCK[0]);
    g.rect(x - 1, y - 1, 3, 1, ROCK[0]);
    g.rect(x - 1, y + 3, 4, 1, ROCK[4]);
    g.rect(x - 1, y + 1, 2, 1, '#10131c');
  });
  // A ribbon tied through the middle one, blown flat.
  g.line(10, 8, 13, 10, CLOTH[1]); g.line(10, 9, 13, 12, CLOTH_DARK[1]);
  g.set(8, 3, SNOW[0]); g.set(7, 3, SNOW[1]); g.set(9, 7, SNOW[1]);
  return g.rows();
}

function icicles(v) {
  const g = new Grid(16, 16);
  // The lip of rock they hang from.
  g.rect(0, 0, 16, 2, ROCK[0]);
  g.rect(1, 1, 14, 1, ROCK[1]);
  const lens = v === 0 ? [6, 10, 5, 9, 4, 8, 6, 4] : v === 1 ? [4, 8, 12, 6, 10, 5, 8, 9] : [9, 13, 8, 12, 10, 6, 11, 8];
  lens.forEach((len, i) => {
    const x = 1 + i * 2;
    for (let k = 0; k < len; k++) {
      const half = k < len * 0.55 ? 1 : 0;
      g.set(x, 2 + k, k % 4 === 1 ? ICE[4] : ICE[3 - (k > len * 0.6 ? 1 : 0)]);
      if (half) g.set(x + 1, 2 + k, ICE[1]);
    }
    g.set(x, 2 + len, ICE[2]);
  });
  g.set(2, 2, SNOW[0]); g.set(9, 2, SNOW[0]); g.set(13, 2, SNOW[0]);
  return g.rows();
}

function icicleBig() {
  const g = new Grid(16, 32);
  g.rect(2, 0, 12, 3, ROCK[0]); g.rect(3, 1, 10, 1, ROCK[2]);
  const spikes = [[4, 18], [7, 28], [10, 22], [12, 12], [5, 10]];
  spikes.forEach(([x, len]) => {
    for (let k = 0; k < len; k++) {
      const w = Math.max(1, Math.round(2.6 - (k / len) * 2.4));
      g.rect(x, 3 + k, w, 1, k % 5 === 2 ? ICE[4] : ICE[2]);
      g.set(x, 3 + k, ICE[3]);
      g.set(x + w - 1, 3 + k, ICE[1]);
    }
  });
  g.set(4, 3, SNOW[0]); g.set(8, 3, SNOW[0]); g.set(11, 3, SNOW[0]);
  return g.rows();
}

function iceFall() {
  const g = new Grid(16, 32);
  g.rect(1, 0, 14, 3, ROCK[0]); g.rect(2, 1, 12, 1, ROCK[2]);
  for (let y = 3; y < 32; y++) {
    const wob = Math.round(Math.sin(y * 0.4) * 1);
    const l = 3 + wob - (y > 24 ? 1 : 0);
    const r = 12 + wob + (y > 24 ? 1 : 0);
    for (let x = l; x <= r; x++) {
      const t = (x - l) / (r - l);
      g.set(x, y, t < 0.25 ? ICE[4] : t < 0.6 ? ICE[3] : t < 0.85 ? ICE[2] : ICE[1]);
    }
    if (y % 6 === 2) g.rect(l, y, r - l + 1, 1, ICE[0]);
    if (y % 9 === 5) g.set(l + 3, y, ICE[4]);
  }
  // The bulge at the foot where it landed, with a skirt of snow.
  g.oval(8, 30, 7, 2, ICE[2]);
  g.rect(1, 31, 14, 1, SNOW[2]);
  g.rect(0, 31, 3, 1, SNOW[1]); g.rect(13, 31, 3, 1, SNOW[1]);
  return g.rows();
}

function frostPatch() {
  const g = new Grid(16, 16);
  const fern = (x, y, len, dir) => {
    for (let k = 0; k < len; k++) {
      const px = x + dir * k, py = y - k;
      g.set(px, py, SNOW[0]);
      if (k % 2 === 0 && k > 0) { g.set(px - 1, py, SNOW[1]); g.set(px + 1, py, SNOW[1]); g.set(px, py + 1, SNOW[2]); }
    }
  };
  fern(3, 14, 9, 0); fern(8, 15, 11, 0); fern(12, 13, 7, 0); fern(6, 9, 5, 1); fern(10, 8, 4, -1);
  return g.rows();
}

function frozenPool() {
  const g = new Grid(32, 18);
  // A rim of stones and heaped snow, then the dark water under glass.
  g.oval(16, 9, 15, 8, SNOW[2]);
  g.oval(16, 9, 14, 7, ROCK[2]);
  g.oval(16, 9, 13, 6, ICE[0]);
  g.oval(16, 9, 12, 5, ICE[1]);
  g.oval(15, 8, 9, 3, DEEP[2]);
  g.oval(15, 8, 7, 2, DEEP[1]);
  // Sheen on the glass, and a crack.
  g.rect(8, 6, 5, 1, ICE[4]); g.rect(9, 7, 2, 1, ICE[3]); g.rect(22, 11, 3, 1, ICE[3]);
  g.line(17, 6, 21, 11, ICE[4]); g.line(21, 11, 24, 12, ICE[4]);
  g.set(5, 8, ICE[3]); g.set(26, 8, ICE[3]);
  for (let k = 0; k < 11; k++) {
    const a = k * 0.6;
    g.set(16 + Math.cos(a) * 14.6, 9 + Math.sin(a) * 7.6, ROCK[3]);
    g.set(16 + Math.cos(a) * 14.6 - 1, 9 + Math.sin(a) * 7.6 - 1, SNOW[0]);
  }
  return g.rows();
}

function fishingHole() {
  const g = new Grid(16, 16);
  mound(g, 8, 15, 7, 1);
  g.oval(7, 12, 6, 3, ICE[3]);
  g.oval(7, 12, 5, 2, ICE[1]);
  g.oval(7, 12, 3, 1, DEEP[0]);
  g.set(4, 11, ICE[4]); g.set(5, 11, ICE[4]);
  // A forked stick pushed into the snow, a line down to the hole, a red bobber.
  g.line(12, 14, 14, 3, WOOD[2]);
  g.line(14, 3, 11, 3, WOOD[3]);
  g.line(11, 3, 8, 11, ROPE);
  g.oval(8, 11, 1, 0, CLOTH[0]); g.set(8, 10, CLOTH[4]);
  g.set(13, 14, SNOW[0]); g.set(12, 14, SNOW[1]);
  g.outline(OUT);
  return g.rows();
}

// --- Leftovers ---------------------------------------------------------------------------------------

function flask() {
  const g = new Grid(16, 9);
  mound(g, 8, 8, 7, 2);
  g.rect(4, 3, 8, 4, '#8a949c');
  g.rect(4, 3, 8, 1, '#c0c8d0');
  g.rect(3, 4, 1, 2, '#8a949c');
  g.rect(12, 4, 1, 2, '#6a727c');
  g.rect(12, 3, 2, 2, WOOD[2]);
  g.rect(5, 5, 6, 1, '#a45a32');
  g.line(4, 3, 2, 7, ROPE);
  g.set(7, 4, SNOW[0]);
  g.outline(OUT);
  return g.rows();
}

function mitten() {
  const g = new Grid(16, 9);
  mound(g, 8, 8, 7, 2);
  g.oval(7, 5, 3, 2, CLOTH[0]);
  g.rect(5, 4, 5, 3, CLOTH[0]);
  g.rect(9, 3, 2, 3, CLOTH[0]);
  g.rect(3, 5, 2, 3, CLOTH_DARK[0]);
  g.rect(3, 4, 2, 1, SNOW[0]);
  g.rect(5, 4, 1, 3, '#e86a5e');
  g.set(7, 3, SNOW[0]); g.set(8, 4, SNOW[1]);
  g.outline(OUT);
  return g.rows();
}

function sled() {
  const g = new Grid(16, 11);
  mound(g, 8, 10, 7, 1);
  g.rect(1, 8, 14, 1, ROCK[3]);
  g.rect(1, 7, 2, 1, ROCK[3]);
  g.rect(2, 5, 12, 2, WOOD[2]);
  g.rect(2, 5, 12, 1, WOOD[3]);
  g.rect(3, 7, 1, 1, WOOD[1]); g.rect(12, 7, 1, 1, WOOD[1]);
  g.line(2, 5, 0, 2, ROPE);
  g.rect(5, 3, 6, 2, SNOW[1]);
  g.set(7, 2, SNOW[0]); g.set(8, 2, SNOW[0]);
  g.outline(OUT);
  return g.rows();
}

function iceAxe() {
  const g = new Grid(16, 20);
  mound(g, 8, 19, 7, 2);
  g.rect(8, 7, 2, 12, WOOD[2]); g.rect(8, 7, 1, 12, WOOD[3]);
  g.rect(4, 4, 9, 2, '#6a727c'); g.rect(4, 4, 9, 1, '#a4aeb8');
  g.set(3, 5, '#6a727c'); g.set(13, 5, '#6a727c'); g.set(14, 6, '#6a727c');
  g.rect(7, 3, 4, 1, '#6a727c');
  g.set(9, 16, CLOTH[1]); g.set(10, 17, CLOTH[1]); g.set(10, 18, CLOTH_DARK[1]);
  g.set(5, 3, SNOW[0]); g.set(7, 3, SNOW[0]);
  g.outline(OUT);
  return g.rows();
}

function snowshoes() {
  const g = new Grid(16, 16);
  mound(g, 8, 15, 7, 1);
  stone(g, 12, 14, 3, 3);
  const shoe = (x) => {
    for (let k = 0; k < 12; k++) {
      const hw = Math.round(2.6 * Math.sin(((k + 0.5) / 12) * Math.PI) + 0.4);
      g.rect(x - hw, 13 - k, hw * 2 + 1, 1, null);
      g.set(x - hw, 13 - k, WOOD[2]);
      g.set(x + hw, 13 - k, WOOD[1]);
      if (k % 2 === 0) for (let i = -hw + 1; i < hw; i++) g.set(x + i, 13 - k, TAN[2]);
    }
  };
  shoe(5); shoe(8);
  g.set(5, 2, SNOW[0]); g.set(8, 1, SNOW[0]);
  g.outline(OUT);
  return g.rows();
}

function frozenShirt() {
  const g = new Grid(16, 22);
  mound(g, 8, 21, 6, 1);
  g.rect(8, 3, 1, 18, WOOD[2]);
  // A shirt, frozen solid, standing out like a board with its arms stuck out.
  g.rect(3, 4, 11, 3, '#c9d4df');
  g.rect(5, 4, 7, 9, '#dbe4ec');
  g.rect(5, 12, 7, 1, ICE[2]);
  g.rect(2, 5, 2, 5, '#b6c4d2'); g.rect(13, 5, 2, 5, '#b6c4d2');
  g.rect(5, 4, 7, 1, ICE[4]);
  g.line(6, 7, 6, 12, ICE[3]);
  g.set(9, 9, '#c8423a'); g.set(9, 10, '#c8423a');
  g.rect(7, 12, 2, 1, ICE[1]);
  g.outline(OUT);
  return g.rows();
}

function candleJar() {
  const g = new Grid(16, 11);
  mound(g, 8, 10, 6, 1);
  g.rect(5, 3, 6, 7, ICE[2]);
  g.rect(5, 3, 1, 7, ICE[4]);
  g.rect(10, 3, 1, 7, ICE[1]);
  g.rect(5, 2, 6, 1, '#8a949c');
  g.rect(6, 6, 4, 4, '#e8dcc0');
  g.rect(6, 6, 4, 1, '#f6efdc');
  g.set(8, 5, '#2a2620');
  g.set(8, 4, '#e8b648');
  g.outline(OUT);
  return g.rows();
}

function hatStake() {
  const g = new Grid(16, 22);
  mound(g, 8, 21, 5, 1);
  g.rect(8, 8, 2, 13, WOOD[2]); g.rect(8, 8, 1, 13, WOOD[3]);
  // A knitted hat jammed on the top, a bobble, frost in the wool.
  g.rect(4, 4, 9, 5, CLOTH[0]);
  g.rect(5, 3, 7, 1, CLOTH[0]);
  g.rect(4, 8, 9, 1, CLOTH_DARK[0]);
  g.rect(4, 6, 9, 1, CLOTH[4]);
  g.rect(4, 7, 9, 1, CLOTH_DARK[0]);
  g.oval(8, 2, 1, 1, CLOTH[4]);
  g.set(5, 4, SNOW[0]); g.set(6, 3, SNOW[0]); g.set(10, 4, SNOW[1]);
  g.outline(OUT);
  return g.rows();
}

function snowBunny() {
  const g = new Grid(16, 14);
  mound(g, 8, 13, 7, 1);
  g.oval(8, 10, 4, 3, SNOW[1]);
  g.oval(7, 9, 3, 2, SNOW[0]);
  g.oval(11, 7, 2, 2, SNOW[1]);
  g.oval(11, 6, 1, 1, SNOW[0]);
  // Ears are twigs with a bit of white on them; eyes are berries.
  g.line(10, 5, 9, 1, WOOD[1]); g.line(12, 5, 13, 1, WOOD[1]);
  g.set(9, 2, SNOW[0]); g.set(13, 2, SNOW[0]);
  g.set(12, 6, '#a82a3a'); g.set(11, 8, '#2a1a1a');
  g.set(4, 9, SNOW[3]); g.set(5, 12, SNOW[3]);
  g.outline(OUT);
  return g.rows();
}

function rimeStone() {
  const g = new Grid(16, 26);
  mound(g, 8, 25, 7, 1);
  g.rect(5, 8, 7, 17, ROCK[3]);
  g.rect(6, 5, 5, 3, ROCK[3]);
  g.rect(7, 3, 3, 2, ROCK[3]);
  g.rect(5, 8, 2, 17, ROCK[4]);
  // Rime grown over the windward side like fur, and a cap of snow.
  for (let y = 3; y < 25; y++) {
    const len = 1 + Math.round(roll(y, 3) * 3);
    for (let k = 0; k < len; k++) g.set(11 + k, y, k === len - 1 ? SNOW[2] : SNOW[0]);
    if (y % 3 === 0) g.set(7 + (y % 5), y, SNOW[1]);
  }
  g.rect(6, 4, 4, 1, SNOW[0]); g.rect(5, 8, 3, 1, SNOW[1]); g.rect(7, 14, 2, 1, SNOW[0]); g.rect(6, 19, 3, 1, SNOW[1]);
  g.set(5, 12, SNOW[0]); g.set(5, 18, SNOW[1]);
  g.outline(OUT);
  return g.rows();
}

function tinyCairn() {
  const g = new Grid(16, 11);
  mound(g, 8, 10, 6, 1);
  stone(g, 8, 9, 4, 2, false);
  stone(g, 8, 6, 3, 2, false);
  stone(g, 8, 3, 2, 1, true);
  g.line(10, 5, 13, 8, CLOTH[2]); g.set(13, 9, CLOTH_DARK[2]);
  g.outline(OUT);
  return g.rows();
}

function stoatDen() {
  // A drift with a round dark door in it and a few tiny bones outside. Flat enough to walk past.
  const g = new Grid(16, 12);
  mound(g, 8, 11, 7, 5);
  g.oval(8, 9, 3, 2, ROCK[0]);
  g.oval(8, 9, 2, 1, '#0c0e16');
  g.set(5, 7, SNOW[0]); g.set(11, 7, SNOW[0]);
  g.set(4, 11, TAN[2]); g.set(5, 11, TAN[2]); g.set(12, 11, TAN[2]);
  g.outline(OUT);
  return g.rows();
}


function flagRag() {
  const g = new Grid(16, 14);
  mound(g, 8, 13, 7, 1);
  stone(g, 4, 12, 3, 3);
  stone(g, 12, 12, 3, 4);
  // A torn blue flag pinned between two stones by the wind, one corner flapping.
  for (let i = 0; i < 7; i++) {
    const dy = Math.round(Math.sin(i * 0.9) * 1);
    for (let j = 0; j < 5; j++) {
      if (i > 4 && (i + j) % 2) continue;
      g.set(5 + i, 4 + j + dy, j === 4 ? CLOTH_DARK[1] : CLOTH[1]);
    }
  }
  g.set(6, 6, CLOTH[4]); g.set(7, 6, CLOTH[4]);
  g.outline(OUT);
  return g.rows();
}

function lanternRing() {
  // A ring pressed into the snow, the size of a lantern's foot, with the snow neat round it.
  const g = new Grid(16, 9);
  g.oval(8, 4, 6, 3, SNOW[2]);
  g.oval(8, 4, 5, 2, SNOW[3]);
  g.oval(8, 4, 3, 1, SNOW[1]);
  g.rect(4, 3, 3, 1, SNOW[0]);
  g.set(12, 5, SNOW[4]);
  return g.rows();
}


// --- The lower slopes: autumn grass and rock, before the snow properly starts ----------------------

function heather() {
  const g = new Grid(16, 10);
  g.oval(8, 8, 6, 2, '#4a3a5a');
  const spray = [[4, 5], [6, 3], [8, 4], [10, 3], [12, 5], [7, 6], [9, 6]];
  spray.forEach(([x, y], i) => {
    g.rect(x, y, 2, 4, i % 2 ? '#7a5a8a' : '#8a6a9a');
    g.set(x, y, '#b898c8'); g.set(x + 1, y + 1, '#d8c0e0');
  });
  g.set(3, 7, '#3a5a34'); g.set(13, 7, '#3a5a34');
  g.set(7, 2, SNOW[0]); g.set(10, 2, SNOW[1]);
  g.outline(OUT);
  return g.rows();
}

function pebbles() {
  const g = new Grid(16, 8);
  const at = [[3, 4, 2], [7, 2, 1], [9, 5, 2], [12, 3, 1], [5, 6, 1], [13, 6, 1]];
  for (const [x, y, r] of at) { g.oval(x, y, r, Math.max(0, r - 1), ROCK[2 + (x % 2)]); g.set(x - 1, y - 1, ROCK[4]); }
  g.set(7, 1, SNOW[0]); g.set(12, 2, SNOW[1]);
  return g.rows();
}

function gentian() {
  const g = new Grid(16, 9);
  mound(g, 8, 8, 5, 1);
  for (const [x, h] of [[5, 4], [8, 6], [11, 3]]) {
    g.rect(x, 7 - h, 1, h, '#3a6a3a');
    g.rect(x - 1, 6 - h, 3, 2, '#3a78c8');
    g.set(x, 5 - h, '#7ab0f0'); g.set(x, 6 - h, '#e8f0ff');
  }
  g.set(7, 3, SNOW[0]);
  return g.rows();
}

function krummholz() {
  // A wind-bent dwarf pine, grown flat and leaning one way, snow sitting in its needles.
  const g = new Grid(16, 18);
  mound(g, 8, 17, 7, 1);
  g.rect(5, 12, 2, 5, WOOD[1]);
  const boughs = [[6, 11, 9, 3], [3, 8, 9, 3], [6, 5, 9, 3], [9, 2, 6, 3]];
  boughs.forEach(([x, y, w, h], i) => {
    g.rect(x, y, w, h, i % 2 ? '#2f5a3a' : '#264a30');
    g.rect(x + 1, y, w - 2, 1, '#3f7a4a');
    g.rect(x + 1, y - 1, w - 3, 1, SNOW[1]);
    g.set(x + 2, y - 1, SNOW[0]); g.set(x + w - 1, y + 1, '#264a30');
  });
  g.outline(OUT);
  return g.rows();
}

function rockPile() {
  const g = new Grid(32, 22);
  mound(g, 16, 21, 15, 1);
  stone(g, 10, 20, 8, 6);
  stone(g, 22, 20, 7, 5);
  stone(g, 15, 14, 6, 5);
  stone(g, 26, 18, 3, 3);
  g.set(7, 5, SNOW[0]);
  g.outline(OUT);
  return g.rows();
}

function bigDrift() {
  const g = new Grid(32, 12);
  mound(g, 12, 11, 11, 5);
  mound(g, 24, 11, 7, 3);
  g.set(6, 6, SNOW[4]); g.set(18, 7, SNOW[4]); g.set(26, 8, SNOW[4]);
  // Wind-carved lip along the top.
  for (let x = 4; x < 22; x += 3) g.set(x, 5 + (x % 2), SNOW[0]);
  return g.rows();
}

// --- More leftovers -------------------------------------------------------------------------------

function boots() {
  const g = new Grid(16, 11);
  mound(g, 8, 10, 7, 1);
  const boot = (x) => {
    g.rect(x, 2, 3, 6, '#5a3a24'); g.rect(x, 2, 1, 6, '#7a5236');
    g.rect(x - 1, 7, 6, 2, '#4a2e1c'); g.rect(x - 1, 8, 6, 1, '#2a1a10');
    g.rect(x, 1, 3, 1, SNOW[1]); g.set(x + 1, 0, SNOW[0]);
    g.set(x + 2, 4, ICE[3]); g.set(x + 2, 6, ICE[3]);
  };
  boot(3); boot(9);
  g.outline(OUT);
  return g.rows();
}

function teapot() {
  const g = new Grid(16, 13);
  mound(g, 8, 12, 7, 1);
  stone(g, 8, 11, 6, 2, false);
  g.oval(8, 6, 4, 3, '#8a949c');
  g.oval(7, 5, 3, 2, '#b4bec6');
  g.rect(5, 7, 7, 1, '#6a727c');
  g.rect(7, 2, 3, 1, '#6a727c'); g.set(8, 1, '#c88a4a');
  g.line(11, 5, 14, 3, '#8a949c'); g.set(14, 2, '#8a949c');
  g.line(4, 4, 2, 6, '#6a727c'); g.set(2, 7, '#6a727c');
  g.set(8, 4, SNOW[0]); g.set(9, 3, SNOW[1]);
  g.set(7, 6, '#2a2620'); g.set(8, 6, '#2a2620');
  g.outline(OUT);
  return g.rows();
}

function ropeCoil() {
  const g = new Grid(16, 11);
  mound(g, 8, 10, 7, 1);
  g.oval(7, 6, 5, 3, '#8a7048');
  g.oval(7, 6, 3, 1, SNOW[2]);
  for (let k = 0; k < 8; k++) g.set(3 + k * 1.2, 4 + (k % 2) * 4, '#a88a5a');
  g.oval(7, 5, 4, 2, '#a88a5a');
  g.oval(7, 5, 2, 1, SNOW[1]);
  g.set(6, 3, SNOW[0]); g.set(9, 4, SNOW[0]);
  g.line(11, 7, 13, 9, ROPE);
  g.rect(12, 9, 3, 2, WOOD[3]); g.set(12, 9, WOOD[1]);
  g.outline(OUT);
  return g.rows();
}

function trumpet() {
  const g = new Grid(16, 22);
  mound(g, 8, 21, 6, 1);
  // Stuck in the snow, leaning: a long brass tube widening to a bell at the top.
  g.line(7, 20, 9, 8, '#c8982a');
  g.line(8, 20, 10, 8, '#e8c050');
  g.line(6, 20, 8, 8, '#8a6a1a');
  g.oval(10, 6, 4, 2, '#e8c050');
  g.oval(10, 6, 3, 1, '#2a1c0e');
  g.rect(6, 4, 7, 1, '#8a6a1a');
  g.oval(10, 7, 2, 1, SNOW[1]);
  g.line(8, 12, 12, 14, CLOTH[0]); g.set(12, 15, CLOTH_DARK[0]); g.set(13, 16, CLOTH[0]);
  g.set(10, 5, SNOW[0]);
  g.outline(OUT);
  return g.rows();
}

function windPost() {
  const g = new Grid(16, 32);
  mound(g, 8, 31, 6, 1);
  g.rect(4, 4, 8, 27, WOOD[2]);
  g.rect(4, 4, 2, 27, WOOD[3]);
  g.rect(10, 4, 2, 27, WOOD[1]);
  g.rect(5, 2, 6, 2, WOOD[2]); g.rect(6, 1, 4, 1, SNOW[0]);
  // The face: puffed cheeks, pursed lips, brows pulled down.
  g.oval(5, 12, 2, 2, '#d8a070'); g.oval(10, 12, 2, 2, '#d8a070');
  g.rect(5, 8, 3, 1, '#2a1a10'); g.rect(9, 8, 3, 1, '#2a1a10');
  g.rect(6, 10, 2, 2, '#fff2dc'); g.rect(9, 10, 2, 2, '#fff2dc');
  g.set(7, 11, '#1a2a4a'); g.set(10, 11, '#1a2a4a');
  g.oval(8, 15, 1, 1, '#7a2a2a'); g.set(8, 15, '#2a1010');
  // Wind curling out of its mouth, painted blue.
  g.line(10, 16, 14, 15, '#3f78c8'); g.line(10, 18, 15, 19, '#3f78c8'); g.set(14, 14, '#3f78c8'); g.set(15, 20, '#3f78c8');
  g.set(5, 22, SNOW[0]); g.set(6, 22, SNOW[1]);
  g.outline(OUT);
  return g.rows();
}

function bookStack() {
  const g = new Grid(16, 11);
  mound(g, 8, 10, 7, 1);
  g.rect(3, 5, 10, 3, '#5a3a2a'); g.rect(3, 5, 10, 1, '#8a5a3a'); g.rect(3, 7, 10, 1, '#2a1a10');
  g.rect(4, 3, 8, 2, '#3a4a5a'); g.rect(4, 3, 8, 1, '#5a6a7a');
  g.rect(5, 6, 6, 1, '#d8c8a0');
  stone(g, 8, 4, 3, 2);
  g.set(4, 5, SNOW[0]); g.set(11, 4, SNOW[1]);
  g.outline(OUT);
  return g.rows();
}

const FLAGS_A = frames(poleFlags('a'), 4);
const FLAGS_B = frames(poleFlags('b'), 4);
const FLAGS_RAG = frames(poleFlags('rag'), 4);

export const R2V_PROP_SPRITES = {
  r2v_pole_flags: FLAGS_A.f1,
  r2v_pole_flags_b: FLAGS_B.f1,
  r2v_pole_rag: FLAGS_RAG.f1,
  r2v_flag_line: flagLine()(0),
  r2v_chime_post: chimePost()(0),
  r2v_prayer_wheel: prayerWheel()(0),
  r2v_wall_flags: wallFlags()(0),
  r2v_offering_bowl: offeringBowl(),
  r2v_offering_cairn: offeringCairn(),
  r2v_name_stone: nameStone(),
  r2v_handholds: handholds(),
  r2v_icicles: icicles(0),
  r2v_icicles_b: icicles(1),
  r2v_icicles_c: icicles(2),
  r2v_icicle_big: icicleBig(),
  r2v_ice_fall: iceFall(),
  r2v_frost_patch: frostPatch(),
  r2v_frozen_pool: frozenPool(),
  r2v_fishing_hole: fishingHole(),
  r2v_snow_lump: snowLump(0),
  r2v_snow_lump_b: snowLump(1),
  r2v_snow_lump_c: snowLump(2),
  r2v_rock_peek: rockPeek(),
  r2v_frost_tuft: frostTuft(),
  r2v_tracks_stoat: tracksStoat(),
  r2v_tracks_hare: tracksHare(),
  r2v_tracks_bird: tracksBird(),
  r2v_wind_ripple: windRipple(),
  r2v_ice_patch: icePatch(),
  r2v_pebble_spiral: pebbleSpiral(),
  r2v_vole_hole: voleHole(),
  r2v_lichen: lichen(),
  r2v_flask: flask(),
  r2v_mitten: mitten(),
  r2v_sled: sled(),
  r2v_ice_axe: iceAxe(),
  r2v_snowshoes: snowshoes(),
  r2v_frozen_shirt: frozenShirt(),
  r2v_candle_jar: candleJar(),
  r2v_hat_stake: hatStake(),
  r2v_snowbunny: snowBunny(),
  r2v_rime_stone: rimeStone(),
  r2v_tiny_cairn: tinyCairn(),
  r2v_stoat_den: stoatDen(),
  r2v_flag_rag: flagRag(),
  r2v_heather: heather(),
  r2v_pebbles: pebbles(),
  r2v_gentian: gentian(),
  r2v_krummholz: krummholz(),
  r2v_rock_pile: rockPile(),
  r2v_big_drift: bigDrift(),
  r2v_boots: boots(),
  r2v_teapot: teapot(),
  r2v_rope_coil: ropeCoil(),
  r2v_trumpet: trumpet(),
  r2v_wind_post: windPost(),
  r2v_book_stack: bookStack(),
  r2v_lantern_ring: lanternRing(),
};

export const R2V_PALETTE = palette;
export const R2V_PALETTE_EXTRA = palette;
export const R2V_POLE_FLAGS_SPRITES = FLAGS_A;
export const R2V_POLE_FLAGS_B_SPRITES = FLAGS_B;
export const R2V_POLE_RAG_SPRITES = FLAGS_RAG;
export const R2V_FLAG_LINE_SPRITES = frames(flagLine(), 4);
export const R2V_CHIME_POST_SPRITES = frames(chimePost(), 4);
export const R2V_PRAYER_WHEEL_SPRITES = frames(prayerWheel(), 4);
export const R2V_WALL_FLAGS_SPRITES = frames(wallFlags(), 4);

// How many tiles wide each big one stands.
export const R2V_FOOTPRINTS = {
  r2v_flag_line: 2,
  r2v_frozen_pool: 2,
  r2v_tracks_stoat: 2,
  r2v_tracks_hare: 2,
  r2v_wind_ripple: 2,
  r2v_rock_pile: 2,
  r2v_big_drift: 2,
};
