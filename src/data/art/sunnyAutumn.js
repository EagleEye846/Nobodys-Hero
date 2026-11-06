// Props for Chapter 5's Sunnyside ("Sunnyside again": late summer, the
// dandelions gone to seed, the fields running east to the sea). Drawn like
// brightProps.js: rows of characters from the small painter below, 16 pixels
// to a tile, standing on the bottom edge and centred over their footprint.
// Every id starts `sy_`. Ones that move are also animations: put the prop's
// name in the object's `animation` too (and a `speed`, seconds a frame).
//
//   sy_seed_clock / _on  a dandelion clock on its stalk; a lever (Ves puffs it)
//   sy_seed_drift*       seeds floating in the air (flat, walkable)
//   sy_seed_heads*       tall dandelions gone to seed (sway)
//   sy_rope_post, _h, _v the posts and ropes round the Soft Field's hole
//   sy_windmill*         the sails turning (4 wide)
//   sy_mill_gear*        the great wooden cog (2 wide)
//   sy_hedge_gap         a hedge with a small arched hole (only Bramble)
//   sy_tortoise*         Farmer Tolliver
//   sy_hen*              a hen pecking
//   sy_slip              the slipped cliff path (2 wide)
//   sy_dune_grass*       sea-grass on the sand (sways)
//   sy_sand_patch        a flat patch of sand with a shell
//   sy_picnic_raided     a picnic after the gulls (2 wide, flat)
//   sy_apple_crate, sy_beehive*, sy_wheelbarrow, sy_windsock*, sy_reeds*,
//   sy_lily*, sy_seed_basket

// --- A tiny painter ---------------------------------------------------
const OUT = '#2a1c20';

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xee80 + colors.size);
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

  get(x, y) {
    return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.cells[y][x] : null;
  }

  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
  }

  oval(cx, cy, rx, ry, c) {
    for (let dy = -ry; dy <= ry; dy++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.25))));
      this.rect(cx - w, cy + dy, w * 2 + 1, 1, c);
    }
  }

  ball(cx, cy, rx, ry, tones) {
    this.oval(cx, cy, rx, ry, tones[0]);
    this.oval(cx - 1, cy - 1, Math.max(1, rx - 1), Math.max(1, ry - 1), tones[1]);
    if (rx > 2 && ry > 2) this.oval(cx - 2, cy - 2, Math.max(1, rx - 3), Math.max(1, ry - 3), tones[2]);
  }

  line(x0, y0, x1, y1, c) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) this.set(x0 + ((x1 - x0) * i) / steps, y0 + ((y1 - y0) * i) / steps, c);
  }

  outline(c) {
    const edge = [];
    for (let y = -1; y <= this.h; y++) {
      for (let x = -1; x <= this.w; x++) {
        if (this.get(x, y)) continue;
        if (this.get(x - 1, y) || this.get(x + 1, y) || this.get(x, y - 1) || this.get(x, y + 1)) edge.push([x, y]);
      }
    }
    for (const [x, y] of edge) this.set(x, y, c);
  }

  paste(other, ox, oy) {
    for (let y = 0; y < other.h; y++) for (let x = 0; x < other.w; x++) if (other.cells[y][x]) this.set(ox + x, oy + y, other.cells[y][x]);
  }

  rows() {
    return this.cells.map((row) => row.map((c) => (c ? char(c) : '.')).join(''));
  }
}

let seed = 23;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const ri = (n) => Math.floor(rand() * n);
const frames = (fn, n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`f${i + 1}`, fn(i)]));

// [dark, mid, light, highlight]
const WOOD = ['#5a3a1e', '#8a5a32', '#b88452', '#d8a468'];
const HAY = ['#b88a2c', '#d8aa44', '#e6c05a', '#fff0a0'];
const GREEN = ['#2c5a22', '#4a8a36', '#78b84a', '#a8d868'];
const STONE = ['#6a6460', '#948e86', '#bdb6aa', '#dcd6c8'];
const PLASTER = ['#c8bca4', '#e8dfc8', '#f8f2e2', '#ffffff'];
const ROPE = ['#8c6a30', '#c49a50', '#e6c47a'];
const SEEDWHITE = ['#c4c8c0', '#e8ece4', '#fbfdf8'];
const SAND = ['#b89a60', '#dcc384', '#f0e0aa'];
const RED = ['#8a2a2a', '#c4443c', '#e8685a'];

// --- Dandelion clocks and seeds ----------------------------------------
// A clock: the round ball of white seeds on its stalk. `wisps` is how many
// seeds are left (the lever's `_on` look has only a few).
function seedBall(g, cx, cy, r, wisps) {
  if (wisps === 0) {
    g.disc?.(cx, cy, 1, '#c0b890');
    g.set(cx, cy, '#c0b890');
    g.set(cx, cy - 1, '#a89c70');
    return;
  }
  for (let i = 0; i < wisps; i++) {
    const a = (i / wisps) * Math.PI * 2 + 0.3;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    g.line(cx, cy, x, y, SEEDWHITE[0]);
    g.set(x, y, SEEDWHITE[2]);
    g.set(x + Math.cos(a), y + Math.sin(a), SEEDWHITE[1]);
  }
  g.oval(cx, cy, 1, 1, '#a89c70');
}

function seedClock(on) {
  const g = new Grid(16, 24);
  // The stalk, with two leaves at the foot.
  g.line(8, 22, 8, 10, GREEN[1]);
  g.line(7, 22, 7, 12, GREEN[0]);
  g.line(8, 21, 3, 17, GREEN[1]);
  g.line(8, 21, 13, 18, GREEN[1]);
  g.rect(3, 17, 2, 2, GREEN[2]);
  g.rect(12, 17, 2, 2, GREEN[2]);
  g.rect(6, 22, 5, 1, GREEN[0]);
  if (on) {
    // Puffed: a few seeds hang on, the rest are away on the wind.
    seedBall(g, 8, 7, 5, 5);
    g.set(2, 2, SEEDWHITE[2]);
    g.set(13, 3, SEEDWHITE[2]);
    g.set(11, 0, SEEDWHITE[1]);
    g.set(4, 0, SEEDWHITE[1]);
  } else {
    // Round and full, ready to go.
    g.oval(8, 7, 6, 6, SEEDWHITE[0]);
    g.oval(7, 6, 5, 5, SEEDWHITE[1]);
    g.oval(6, 5, 3, 3, SEEDWHITE[2]);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      g.set(8 + Math.cos(a) * 7, 7 + Math.sin(a) * 7, SEEDWHITE[1]);
    }
    for (let i = 0; i < 9; i++) g.set(3 + ri(10), 2 + ri(10), (i % 2 ? '#c4c8c0' : '#ffffff'));
    g.oval(8, 7, 1, 1, '#a89c70');
  }
  g.outline(OUT);
  return g.rows();
}

// A few seeds floating by: flat, so you walk through them.
function seedDrift(i) {
  const g = new Grid(16, 16);
  const seedAt = (x, y, big) => {
    g.set(x, y + 1, '#a89c70');
    g.rect(x - 1, y, 3, 1, '#ffffff');
    g.set(x, y - 1, SEEDWHITE[1]);
    if (big) {
      g.set(x - 2, y - 1, SEEDWHITE[0]);
      g.set(x + 2, y - 1, SEEDWHITE[0]);
    }
  };
  const t = i / 4;
  seedAt(Math.round(3 + t * 6), Math.round(12 - t * 8), true);
  seedAt(Math.round(11 - t * 3), Math.round(14 - t * 7), false);
  seedAt(Math.round(8 + Math.sin(t * 6.28) * 3), Math.round(7 - t * 3 + 4), false);
  return g.rows();
}

// Tall dandelions gone to seed, swaying.
function seedHeads(i) {
  const g = new Grid(16, 22);
  const sway = i === 0 ? 0 : 1;
  for (const [bx, top, r] of [[4, 6, 4], [11, 9, 3], [8, 3, 4]]) {
    const tx = bx + sway;
    g.line(bx, 21, tx, top + r, GREEN[1]);
    seedBall(g, tx, top, r, 11);
  }
  g.rect(1, 20, 14, 2, GREEN[0]);
  g.rect(2, 19, 4, 1, GREEN[2]);
  g.rect(10, 19, 4, 1, GREEN[2]);
  g.outline(OUT);
  return g.rows();
}

// --- The rope round the hole ------------------------------------------
function ropePost() {
  const g = new Grid(16, 22);
  g.rect(6, 4, 4, 17, WOOD[1]);
  g.rect(6, 4, 1, 17, WOOD[2]);
  g.rect(9, 4, 1, 17, WOOD[0]);
  g.rect(5, 2, 6, 3, WOOD[1]);
  g.rect(5, 2, 6, 1, WOOD[3]);
  g.rect(5, 4, 6, 1, WOOD[0]);
  // The rope, looped round and out both ways.
  g.rect(0, 7, 6, 1, ROPE[1]);
  g.rect(10, 7, 6, 1, ROPE[1]);
  g.rect(0, 8, 6, 1, ROPE[0]);
  g.rect(10, 8, 6, 1, ROPE[0]);
  g.rect(5, 6, 6, 1, ROPE[2]);
  g.rect(5, 9, 6, 1, ROPE[0]);
  g.rect(5, 7, 6, 2, ROPE[1]);
  g.oval(8, 21, 4, 1, '#3c2a10');
  g.outline(OUT);
  return g.rows();
}
function ropeSpan(vertical) {
  const g = new Grid(16, 22);
  if (!vertical) {
    for (let x = 0; x < 16; x++) {
      const sag = Math.round(Math.sin((x / 15) * Math.PI) * 2);
      g.set(x, 7 + sag, ROPE[1]);
      g.set(x, 8 + sag, ROPE[0]);
    }
    // A small cloth flag tied on, so nobody says they didn't see it.
    g.rect(7, 10, 3, 3, RED[1]);
    g.rect(7, 10, 3, 1, RED[2]);
    g.set(8, 13, RED[0]);
  } else {
    for (let y = 0; y < 22; y++) {
      g.set(7, y, ROPE[1]);
      g.set(8, y, ROPE[0]);
    }
  }
  g.outline(OUT);
  return g.rows();
}

// --- The windmill ------------------------------------------------------
// 64 wide by 96: whitewashed stone body, a thatch cap, a little door, and four
// sails on a hub. `turn` rotates the sails (quarter turns over four frames).
function windmill(turn) {
  const g = new Grid(64, 96);
  const cx = 32;
  const hubY = 28;
  // The body: a tapering tower.
  for (let y = 24; y < 94; y++) {
    const half = Math.round(15 + ((y - 24) / 70) * 8);
    g.rect(cx - half, y, half * 2 + 1, 1, PLASTER[1]);
    g.rect(cx - half, y, 3, 1, PLASTER[2]);
    g.rect(cx + half - 3, y, 4, 1, PLASTER[0]);
    if (y % 8 === 0) g.rect(cx - half, y, half * 2 + 1, 1, PLASTER[0]);
  }
  // Stones showing through where the plaster has worn.
  for (let i = 0; i < 18; i++) {
    const y = 40 + ri(48);
    const half = Math.round(15 + ((y - 24) / 70) * 8);
    g.rect(cx - half + 3 + ri(half * 2 - 8), y, 3, 2, STONE[1]);
  }
  // The cap.
  g.rect(cx - 14, 20, 29, 5, HAY[1]);
  g.rect(cx - 12, 14, 25, 6, HAY[2]);
  g.rect(cx - 9, 9, 19, 5, HAY[2]);
  g.rect(cx - 5, 5, 11, 4, HAY[1]);
  g.rect(cx - 2, 2, 5, 3, HAY[0]);
  for (let y = 5; y < 25; y += 3) g.rect(cx - 14 + ((y * 7) % 5), y, 24, 1, HAY[0]);
  g.rect(cx - 14, 24, 29, 1, WOOD[0]);
  // Windows and the door.
  g.rect(cx - 3, 42, 6, 8, '#3c4a6a');
  g.rect(cx - 2, 43, 4, 6, '#9ac4ea');
  g.rect(cx - 3, 42, 6, 1, WOOD[1]);
  g.rect(cx, 43, 1, 6, WOOD[1]);
  g.rect(cx - 3, 50, 7, 1, WOOD[1]);
  g.rect(cx - 5, 76, 11, 18, WOOD[1]);
  g.rect(cx - 5, 76, 11, 1, WOOD[3]);
  g.rect(cx - 4, 74, 9, 2, WOOD[0]);
  for (let x = cx - 4; x < cx + 6; x += 3) g.rect(x, 77, 1, 17, WOOD[0]);
  g.set(cx + 3, 86, HAY[3]);
  // The sails: four lattice blades round the hub.
  const blade = (angle) => {
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const px = -dy;
    const py = dx;
    const along = (d, w, c) => g.set(cx + dx * d + px * w, hubY + dy * d + py * w, c);
    for (let d = 3; d <= 26; d += 0.5) {
      along(d, 0, WOOD[1]);
      along(d, 0.7, WOOD[0]);
    }
    // The cloth: a frame on one side of the spar.
    for (let d = 8; d <= 26; d += 0.5) {
      for (let w = 1.2; w <= 5; w += 0.7) along(d, w, (Math.floor(d) + Math.floor(w * 2)) % 3 ? PLASTER[2] : PLASTER[1]);
      along(d, 5.6, WOOD[0]);
    }
    for (let w = 1.2; w <= 5.6; w += 0.5) {
      along(8, w, WOOD[0]);
      along(26, w, WOOD[0]);
    }
  };
  for (let k = 0; k < 4; k++) blade(turn * (Math.PI / 8) + (k * Math.PI) / 2 + 0.4);
  g.oval(cx, hubY, 3, 3, WOOD[1]);
  g.oval(cx - 1, hubY - 1, 1, 1, WOOD[3]);
  g.set(cx, hubY, '#2a1c20');
  g.outline(OUT);
  return g.rows();
}

// The great cog beside the sluice: 32 square, eight teeth, turning.
function millGear(turn) {
  const g = new Grid(32, 32);
  const cx = 16;
  const cy = 16;
  g.oval(cx, cy, 11, 11, WOOD[0]);
  g.oval(cx, cy, 10, 10, WOOD[1]);
  g.oval(cx - 1, cy - 1, 7, 7, WOOD[2]);
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2 + turn * (Math.PI / 16);
    for (let d = 10; d < 14; d++) {
      for (let w = -2; w <= 2; w++) g.set(cx + Math.cos(a) * d - Math.sin(a) * w, cy + Math.sin(a) * d + Math.cos(a) * w, d === 13 ? WOOD[0] : WOOD[1]);
    }
    g.line(cx, cy, cx + Math.cos(a + 0.4) * 9, cy + Math.sin(a + 0.4) * 9, WOOD[0]);
  }
  g.oval(cx, cy, 3, 3, STONE[1]);
  g.set(cx - 1, cy - 1, STONE[3]);
  g.set(cx, cy, OUT);
  g.outline(OUT);
  return g.rows();
}

// --- A hedge with a small arched hole ----------------------------------
function hedgeGap() {
  // A blossoming hedge bush like its neighbours in the ring, with a low
  // round hole at its foot. The hole is see-through (nothing painted in it):
  // Bramble crawls through it behind the leaves, and shows in the opening.
  // It stands two pixels taller than a tile, so the arch (15 high) clears his
  // head on hands and knees; the hero and Ves are far too tall for it.
  const g = new Grid(16, 18);
  const DARK = '#215a2a';
  const MID = '#2f7a34';
  const LIGHT = '#3f9a42';
  const RIM = '#173a1e';
  // The leafy body, full width, rounded off at the top corners.
  g.rect(0, 1, 16, 17, DARK);
  g.rect(2, 0, 12, 1, DARK);
  g.rect(1, 1, 14, 17, MID);
  g.rect(3, 0, 10, 1, MID);
  g.oval(5, 3, 4, 2, LIGHT);
  g.oval(11, 3, 3, 2, LIGHT);
  g.rect(0, 14, 16, 4, MID);
  for (let i = 0; i < 14; i++) g.set(ri(16), 8 + ri(10), ri(2) ? DARK : LIGHT);
  for (const [x, y] of [[2, 1], [6, 2], [10, 1], [13, 3], [1, 6], [14, 8], [1, 13], [14, 15], [8, 3]]) {
    g.rect(x, y, 2, 2, hedgeBloom(x, y));
    g.set(x, y, '#ffd23c');
  }
  g.outline(OUT);
  // The hole: a dark rim round an arch, then clear all the way to the ground.
  const span = (y) => (y <= 4 ? [5, 10] : y === 5 ? [4, 11] : [3, 12]);
  for (let y = 2; y <= 17; y++) {
    const [a, b] = span(y);
    g.rect(a - 1, y, b - a + 3, 1, rim(y));
  }
  for (let y = 3; y <= 17; y++) {
    const [a, b] = span(y);
    g.rect(a, y, b - a + 1, 1, null);
  }
  return g.rows();
  function rim() { return RIM; }
}
const hedgeBloom = (x, y) => ((x * 7 + y * 3) % 3 ? '#fffdf2' : '#ffd0e4');

// --- Farmer Tolliver, an ancient tortoise ------------------------------
function tortoise(i) {
  const g = new Grid(20, 20);
  const bob = i === 1 ? 1 : 0;
  // Feet and legs in waistcoat-and-boots style.
  g.rect(4, 16, 4, 3, '#5a7a3a');
  g.rect(12, 16, 4, 3, '#5a7a3a');
  g.rect(3, 18, 5, 2, '#5a3a1e');
  g.rect(12, 18, 5, 2, '#5a3a1e');
  // The shell, a big dome with a patch sewn on.
  g.oval(9, 11, 8, 6, '#5a6a2c');
  g.oval(9, 10, 7, 5, '#7a8a3a');
  g.oval(8, 9, 4, 3, '#9aaa52');
  for (const [x, y] of [[5, 8], [9, 7], [13, 9], [7, 12], [11, 12]]) g.set(x, y, '#4a5a22');
  g.rect(10, 11, 3, 3, '#c4443c');
  g.rect(10, 11, 3, 1, '#e8685a');
  // The head, long neck, wide straw hat.
  g.rect(14, 7 + bob, 3, 6 - bob, '#8aa05a');
  g.rect(14, 7 + bob, 4, 4, '#9ab464');
  g.set(16, 8 + bob, '#1c1408');
  g.set(17, 10 + bob, '#5a3a1e');
  g.rect(12, 5 + bob, 8, 1, '#e6c05a');
  g.rect(14, 3 + bob, 4, 3, '#d8aa44');
  g.rect(14, 5 + bob, 4, 1, '#c4443c');
  g.rect(13, 6 + bob, 6, 1, '#b88a2c');
  // A spade to lean on.
  g.rect(2, 7, 1, 12, '#8a5a32');
  g.rect(1, 5, 3, 3, '#948e86');
  g.outline(OUT);
  return g.rows();
}

// --- A hen, pecking ----------------------------------------------------
function hen(i) {
  const g = new Grid(16, 16);
  const peck = i === 1;
  g.oval(8, 11, 5, 4, '#f4eee0');
  g.oval(7, 10, 3, 2, '#fffcf0');
  g.rect(11, 9, 3, 2, '#e8dfc8');
  const hy = peck ? 10 : 6;
  g.rect(11, hy, 3, 4, '#fffcf0');
  g.rect(11, hy - 1, 2, 1, '#c4443c');
  g.rect(14, hy + 1, 2, 1, '#e6a02a');
  g.set(13, hy + 1, '#1c1408');
  g.rect(8, 14, 1, 2, '#e6a02a');
  g.rect(10, 14, 1, 2, '#e6a02a');
  g.set(3, 9, '#e8dfc8');
  g.set(2, 8, '#e8dfc8');
  g.outline(OUT);
  return g.rows();
}

// --- The slipped cliff path --------------------------------------------
function slip() {
  const g = new Grid(32, 24);
  g.oval(16, 20, 15, 4, '#8a6a3a');
  g.oval(16, 16, 13, 6, '#a8804a');
  g.oval(14, 13, 9, 4, '#c49a60');
  for (let i = 0; i < 18; i++) {
    const x = 4 + ri(24);
    const y = 10 + ri(10);
    g.rect(x, y, 2 + ri(3), 2 + ri(2), STONE[ri(3)]);
  }
  // A snapped length of fence stuck out of it, and a tuft of grass that
  // has slid down intact.
  g.rect(22, 5, 2, 12, WOOD[1]);
  g.rect(19, 8, 8, 1, WOOD[2]);
  g.line(26, 8, 28, 13, WOOD[0]);
  g.rect(6, 12, 6, 3, GREEN[1]);
  g.rect(7, 11, 4, 1, GREEN[2]);
  g.outline(OUT);
  return g.rows();
}

// --- The dunes begin ---------------------------------------------------
function duneGrass(i) {
  const g = new Grid(16, 16);
  const lean = [0, 1, 2, 1][i];
  for (let b = 0; b < 7; b++) {
    const bx = 2 + b * 2;
    const h = 7 + (b % 3) * 2;
    for (let y = 0; y < h; y++) {
      const dx = Math.round((y / h) ** 2 * (lean + (b % 2)));
      g.set(bx + dx, 15 - y, y > h - 3 ? '#e6dc8a' : b % 2 ? '#a8a85a' : '#8a9a4a');
    }
  }
  g.rect(1, 15, 14, 1, SAND[0]);
  g.outline(OUT);
  return g.rows();
}
function sandPatch() {
  const g = new Grid(16, 16);
  g.oval(8, 9, 7, 4, SAND[1]);
  g.oval(7, 8, 5, 2, SAND[2]);
  for (let i = 0; i < 10; i++) g.set(2 + ri(12), 6 + ri(7), ri(2) ? SAND[0] : '#ffffff');
  // A shell.
  g.oval(11, 9, 2, 2, '#f4c4b0');
  g.set(11, 8, '#fff0e8');
  g.set(12, 10, '#c88a78');
  return g.rows();
}

// --- The raided picnic -------------------------------------------------
function picnicRaided() {
  const g = new Grid(32, 16);
  for (let y = 0; y < 11; y++) {
    const shift = Math.floor((10 - y) / 3);
    for (let x = 2; x < 28; x++) {
      const cx = Math.floor((x - 2) / 3);
      const cy = Math.floor(y / 3);
      g.set(x + shift, y + 3, (cx + cy) % 2 ? '#fffdf2' : '#e04a4a');
    }
  }
  g.rect(5, 13, 26, 1, '#9a2a2a');
  g.rect(2, 12, 26, 1, '#b83a3a');
  // The basket on its side, the lid off.
  g.rect(17, 5, 9, 6, WOOD[2]);
  g.rect(17, 5, 9, 1, WOOD[3]);
  for (let x = 17; x < 26; x += 2) g.rect(x, 7, 1, 4, WOOD[1]);
  g.rect(25, 6, 2, 4, WOOD[0]);
  g.rect(14, 9, 4, 2, WOOD[3]);
  // Crumbs, a drumstick bone, a scatter of white feathers.
  for (let i = 0; i < 14; i++) g.set(3 + ri(22), 4 + ri(8), ri(2) ? HAY[2] : '#c8a060');
  g.rect(8, 7, 4, 1, '#f4eee0');
  g.set(7, 6, '#f4eee0');
  g.set(12, 6, '#f4eee0');
  for (const [x, y] of [[4, 2], [15, 1], [27, 8], [10, 14]]) {
    g.set(x, y, '#ffffff');
    g.set(x + 1, y + 1, '#c8ccc6');
  }
  g.outline(OUT);
  return g.rows();
}

// --- Small things ------------------------------------------------------
function appleCrate() {
  const g = new Grid(16, 16);
  g.rect(1, 7, 14, 8, WOOD[1]);
  g.rect(1, 7, 14, 1, WOOD[3]);
  g.rect(1, 14, 14, 1, WOOD[0]);
  g.rect(1, 10, 14, 1, WOOD[0]);
  for (const [x, y] of [[3, 5], [7, 4], [11, 5], [5, 3], [9, 2]]) {
    g.ball(x, y, 2, 2, ['#8a2a2a', '#c4443c', '#e8685a']);
    g.set(x - 1, y - 1, '#ffd0c0');
  }
  g.rect(8, 0, 1, 2, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}
function beehive(i) {
  const g = new Grid(16, 20);
  g.rect(3, 15, 10, 4, WOOD[0]);
  g.rect(2, 18, 12, 2, WOOD[0]);
  for (let k = 0; k < 4; k++) {
    const half = 5 - Math.abs(k - 1.5) * 0.8;
    g.oval(8, 14 - k * 3, Math.round(half), 2, k % 2 ? HAY[1] : HAY[2]);
  }
  g.rect(6, 4, 4, 1, HAY[3]);
  g.oval(8, 15, 2, 1, '#2a1c20');
  // A bee, two positions.
  const by = i === 0 ? 8 : 6;
  g.set(13, by, '#2a1c20');
  g.set(14, by, HAY[2]);
  g.set(13, by - 1, '#ffffff');
  g.outline(OUT);
  return g.rows();
}
function wheelbarrow() {
  // Side on, nose to the right: two handles back to the left, a leg under
  // them, a red tray heaped with hay, and the one wheel under the nose.
  const g = new Grid(16, 16);
  // The handles, from the tray's back corner out and up to the left.
  g.line(5, 9, 0, 6, WOOD[1]);
  g.line(5, 8, 1, 6, WOOD[2]);
  // The back leg, standing on the grass.
  g.rect(5, 10, 1, 4, WOOD[0]);
  g.rect(4, 13, 2, 1, WOOD[0]);
  // The wheel's strut, then the wheel.
  g.line(10, 10, 12, 12, WOOD[0]);
  g.oval(12, 12, 2, 2, '#3a3634');
  g.set(12, 12, '#948e86');
  g.set(12, 10, '#5a5450');
  g.set(14, 12, '#5a5450');
  // The tray: wide at the top, narrowing to the bottom and the nose.
  g.rect(3, 6, 10, 2, '#c4443c');
  g.rect(4, 8, 9, 1, '#c4443c');
  g.rect(5, 9, 7, 1, '#a8302a');
  g.rect(6, 10, 5, 1, '#8a2622');
  g.rect(3, 6, 10, 1, '#e8685a');
  g.rect(12, 6, 1, 3, '#a8302a');
  // Hay heaped up in it, a few stalks sticking out.
  g.oval(8, 5, 4, 1, HAY[2]);
  g.rect(5, 4, 6, 1, HAY[2]);
  g.rect(6, 3, 4, 1, HAY[3]);
  g.set(4, 4, HAY[3]);
  g.set(11, 3, HAY[3]);
  g.set(8, 2, HAY[3]);
  g.outline(OUT);
  return g.rows();
}
function windsock(i) {
  const g = new Grid(16, 26);
  g.rect(2, 3, 2, 22, WOOD[1]);
  g.rect(2, 3, 1, 22, WOOD[2]);
  g.rect(1, 24, 4, 2, WOOD[0]);
  // The sock: striped, streaming toward the sea (right), rippling.
  const dip = [0, 1, 2, 1][i];
  for (let x = 0; x < 11; x++) {
    const h = Math.round(4 - x * 0.28);
    const y = 4 + Math.round(Math.sin((x + i * 2) * 0.7) * 1) + (x > 6 ? dip : 0);
    g.rect(4 + x, y, 1, h, Math.floor(x / 2) % 2 ? '#fffdf2' : '#e04a4a');
  }
  g.rect(4, 3, 1, 6, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}
function reeds(i) {
  const g = new Grid(16, 22);
  const sway = i === 0 ? 0 : 1;
  for (const [bx, h] of [[3, 14], [6, 19], [9, 16], [12, 12], [7, 11]]) {
    for (let y = 0; y < h; y++) g.set(bx + Math.round((y / h) ** 2 * sway), 21 - y, y > h - 5 ? '#9ab454' : '#4a7a3a');
    g.rect(bx + sway - 0, 21 - h - 3, 2, 4, '#7a4a2a');
  }
  g.rect(1, 20, 14, 2, '#2c5a22');
  g.outline(OUT);
  return g.rows();
}
function lily(i) {
  const g = new Grid(16, 16);
  g.oval(5, 8, 4, 2, '#3a7a2c');
  g.oval(4, 7, 3, 1, '#5aa03c');
  g.oval(11, 11, 3, 2, '#3a7a2c');
  g.oval(10, 10, 2, 1, '#5aa03c');
  g.set(5, 7, '#2c5a22');
  g.set(12, 10, '#2c5a22');
  g.rect(8, 5 + (i % 2), 3, 2, '#fbd0e0');
  g.set(9, 4 + (i % 2), '#ffffff');
  g.set(9, 6 + (i % 2), '#e8a0c0');
  return g.rows();
}
function seedBasket() {
  const g = new Grid(16, 16);
  g.rect(3, 8, 10, 7, WOOD[2]);
  g.rect(3, 8, 10, 1, WOOD[3]);
  for (let x = 3; x < 13; x += 2) g.rect(x, 10, 1, 5, WOOD[1]);
  g.rect(3, 13, 10, 1, WOOD[0]);
  for (let i = 0; i < 6; i++) {
    g.set(4 + ri(8), 4 + ri(4), '#ffffff');
    g.set(4 + ri(8), 5 + ri(3), SEEDWHITE[1]);
  }
  g.oval(8, 6, 4, 2, SEEDWHITE[0]);
  g.oval(7, 5, 3, 1, SEEDWHITE[2]);
  g.outline(OUT);
  return g.rows();
}


// A round green door in a grassy bank, with a mat and a few flowers: a burrow.
function burrowDoor() {
  const g = new Grid(32, 24);
  g.oval(16, 20, 15, 12, GREEN[0]);
  g.oval(16, 20, 14, 11, GREEN[1]);
  g.oval(14, 17, 10, 7, GREEN[2]);
  for (let i = 0; i < 30; i++) g.set(3 + ri(26), 9 + ri(10), ri(2) ? GREEN[3] : GREEN[0]);
  g.rect(0, 20, 32, 4, '.');
  g.rect(1, 21, 30, 3, GREEN[1]);
  g.rect(2, 21, 28, 1, GREEN[2]);
  // the door: a round top, planks, a brass knob
  g.oval(16, 15, 6, 6, '#2e6a3a');
  g.rect(10, 15, 13, 8, '#2e6a3a');
  g.oval(16, 15, 5, 5, '#3f8a4c');
  g.rect(11, 15, 11, 8, '#3f8a4c');
  for (const x of [13, 16, 19]) g.rect(x, 11, 1, 12, '#2e6a3a');
  g.rect(10, 12, 1, 11, WOOD[1]);
  g.rect(22, 12, 1, 11, WOOD[0]);
  g.oval(16, 10, 6, 1, WOOD[1]);
  g.set(20, 18, HAY[3]);
  g.set(21, 18, HAY[2]);
  g.rect(12, 23, 9, 1, RED[1]);
  for (const [x, y, c] of [[4, 20, '#ffffff'], [6, 22, '#f4d878'], [27, 21, '#f08ab8'], [25, 19, '#ffffff'], [2, 22, '#f4d878']]) {
    g.set(x, y, c);
    g.set(x, y + 1, GREEN[0]);
  }
  g.outline(OUT);
  return g.rows();
}

// --- The windmill's scales ---------------------------------------------
// A weighing plate let into the yard: a square iron frame flush with the
// ground, a scrubbed oak platform inside it with a picture painted on, and a
// little brass dial at its head whose needle swings over when somebody heavy
// enough stands on it. `on` is it pressed: the platform sunk a pixel into its
// frame (a dark gap showing round it) and the needle hard over. `small` is
// Bramble's, with a sack on it instead of a cart wheel. (No `rand` in these:
// they're made after the others, and must not shift the random ones.)
function scalePlate(on, small) {
  const g = new Grid(16, 16);
  const kerb = ['#8a8478', '#b0a898', '#ccc4b2'];
  const iron = ['#2e2e34', '#4a4c54', '#7a7c84'];
  const oak = ['#8a5e34', '#b88a56', '#d8aa70'];
  // A kerb of flat stones round it, flush with the yard.
  g.rect(0, 0, 16, 16, kerb[1]);
  for (const [x, y, w, hh] of [[0, 0, 6, 2], [6, 0, 5, 2], [11, 0, 5, 2], [0, 14, 7, 2], [7, 14, 9, 2], [0, 2, 2, 6], [0, 8, 2, 6], [14, 2, 2, 5], [14, 7, 2, 7]]) {
    g.rect(x, y, w, hh, kerb[1]);
    g.rect(x, y, w, 1, kerb[2]);
    g.rect(x + w - 1, y, 1, hh, kerb[0]);
  }
  // The brass dial let into the kerb at the head, its needle over when it's pressed.
  g.rect(6, 0, 4, 2, '#a07020');
  g.rect(7, 0, 2, 1, '#f8f2e2');
  g.set(on ? 8 : 7, 0, on ? '#c4443c' : '#2a1c20');
  // The iron frame and the pit inside it.
  g.rect(2, 2, 12, 12, iron[1]);
  g.rect(2, 2, 12, 1, iron[0]);
  g.rect(2, 13, 12, 1, iron[2]);
  const inset = small ? 2 : 0;
  const x0 = 3 + inset;
  const w = 10 - inset * 2;
  g.rect(x0, 3 + inset, w, w, '#1e1a1c');
  // The platform: up, it stands a pixel proud (its lit top edge, a shadow under
  // it); pressed, it's sunk (the dark gap shows along its top instead).
  const y0 = 3 + inset + (on ? 1 : 0);
  const ph = w - 1;
  g.rect(x0, y0, w, ph, on ? oak[0] : oak[1]);
  for (let y = y0 + 2; y < y0 + ph - 1; y += 3) g.rect(x0, y, w, 1, on ? '#74502c' : '#a47a48');
  if (!on) { g.rect(x0, y0, w, 1, oak[2]); g.rect(x0, y0 + ph - 1, w, 1, oak[0]); }
  // The picture painted on it: a cart wheel (the hero's) or a sack (Bramble's).
  const cx = x0 + Math.floor(w / 2);
  const cy = y0 + Math.floor(ph / 2);
  const ink = on ? '#3a2a20' : '#2e5a8a';
  if (!small) {
    for (const [dx, dy] of [[-1, -3], [0, -3], [1, -3], [2, -2], [3, -1], [3, 0], [3, 1], [2, 2], [1, 3], [0, 3], [-1, 3], [-2, 2], [-3, 1], [-3, 0], [-3, -1], [-2, -2]]) g.set(cx + dx, cy + dy, ink);
    for (const [dx, dy] of [[0, 0], [0, -1], [0, -2], [0, 1], [0, 2], [-1, 0], [-2, 0], [1, 0], [2, 0]]) g.set(cx + dx, cy + dy, ink);
  } else {
    const sack = on ? '#8a7a5a' : '#e6d8b0';
    g.rect(cx - 2, cy - 1, 4, 3, sack);
    g.rect(cx - 1, cy - 2, 2, 1, ink);
    g.set(cx - 1, cy - 3, ink);
    g.set(cx, cy - 3, ink);
  }
  // A grain of red paint at the corners: the lettering round the edge.
  g.set(x0, y0 + ph - 2, on ? '#6a2a2a' : '#c4443c');
  g.set(x0 + w - 1, y0 + ph - 2, on ? '#6a2a2a' : '#c4443c');
  return g.rows();
}

// --- The burrow's round door ---------------------------------------------
// A round green door set into the earth wall of Clover's front room, the
// pantry's: a ring of bent willow round it, planks, a brass knob in the very
// middle, and a card hung on the knob. 16 wide, two tiles tall (stand it on
// the wall's lower row).
function roundDoor() {
  const g = new Grid(16, 30);
  // The willow frame.
  g.oval(8, 15, 8, 14, '#5a3a1e');
  g.oval(8, 15, 7, 13, '#8a5a32');
  g.oval(8, 15, 6, 12, '#3f8a4c');
  // Planks.
  for (const x of [4, 7, 10]) for (let y = 4; y < 28; y++) if (g.get(x, y) === '#3f8a4c' || g.get(x, y) === '#2e6a3a') g.set(x, y, '#2e6a3a');
  g.oval(6, 10, 2, 4, '#4f9a5a');
  // The knob in the middle, and the card on its string.
  g.rect(7, 14, 2, 2, '#d8a838');
  g.set(7, 14, '#fae27c');
  g.set(9, 16, '#e6c47a'); g.set(10, 17, '#e6c47a');
  g.rect(9, 18, 5, 4, '#f8f2e2');
  g.rect(10, 19, 3, 1, '#8a2a2a');
  g.rect(10, 20, 2, 1, '#948e86');
  // The step at its foot, worn.
  g.rect(1, 28, 14, 2, '#8a6240');
  g.rect(2, 28, 12, 1, '#a07a50');
  g.outline(OUT);
  return g.rows();
}

// --- The Sea View's cliff path ---------------------------------------------
// The way down from the clifftop to Gullrest: steps cut into a spur of the
// warm sandstone cliff, turf and thrift clinging to the rock either side, and
// a hand rope on posts along both edges of the steps. A flat, walkable prop,
// 8 tiles wide and 11 high: stand it at (21, 23), so the steps lie over the
// path's tiles (x 23 to 26, rows 13 to 22). The spur is broad where it leaves
// the clifftop and narrows as it goes down, the lower steps in its shadow, so
// it reads as a stair cut down the cliff and not a pier out into the air.
function cliffPath() {
  const W = 128;
  const H = 176;
  const g = new Grid(W, H);
  const rock = ['#c29a62', '#b88e58', '#ad8450', '#bf9660'];
  const deep = ['#9a7448', '#8a6640', '#7a5a38', '#6a4c30'];
  const h = (x, y, s) => {
    let v = (x * 374761393 + y * 668265263 + s * 1442695041) | 0;
    v = Math.imul(v ^ (v >>> 13), 1274126177);
    return ((v ^ (v >>> 16)) >>> 0) / 4294967296;
  };
  const L = 32; // the steps run from x 32 to 95 (the path's four tiles)
  const R = 96;
  // The spur: broad under the clifftop, narrowing downwards, its outline ragged.
  const edges = [];
  for (let y = 0; y < H; y++) {
    const t = y / H;
    const wob = Math.round(Math.sin(y / 7) * 1.5 + Math.sin(y / 3.1) * 0.8);
    const spread = Math.max(5, Math.round(30 * (1 - t) ** 1.3 + 5)) + wob;
    const l = L - spread;
    const r = R + spread - Math.round(wob / 2);
    edges.push([l, r]);
    for (let x = l; x < r; x++) {
      const band = Math.floor((y + Math.round(Math.sin(x / 13) * 3)) / 6);
      const lower = t > 0.45 && h(x >> 2, band, 5) < (t - 0.45) * 1.6;
      let c = lower ? deep[band % 2] : rock[band % 4];
      // The west face catches the light; the east face is in shadow, deeper as it goes down.
      if (x < l + 2) c = '#d8b478';
      if (x > r - 3) c = deep[3];
      else if (x > r - 8) c = deep[2];
      else if (x > R + 2 && h(x, y >> 1, 6) < 0.3) c = deep[1];
      g.set(x, y, c);
    }
    // Strata and cracks.
    if (y % 6 === 0) { for (let x = l + 2; x < L - 4; x++) if (h(x, y, 8) < 0.7) g.set(x, y, deep[0]); for (let x = R + 4; x < r - 3; x++) if (h(x, y, 9) < 0.7) g.set(x, y, deep[2]); }
    if (h(3, y, 10) < 0.09) for (let i = 0; i < 4; i++) g.set(l + 4 + Math.floor(h(4, y, 11) * Math.max(1, L - l - 10)), y + i, deep[2]);
    if (h(5, y, 12) < 0.09) for (let i = 0; i < 4; i++) g.set(R + 4 + Math.floor(h(6, y, 13) * Math.max(1, r - R - 10)), y + i, deep[3]);
  }
  // The underside where the spur ends, ragged.
  // Tufts of turf and pink thrift clinging to the rock on both flanks.
  for (let y = 2; y < H - 4; y += 3) {
    for (const side of [0, 1]) {
      if (h(side, y, 20) > 0.45) continue;
      const [l, r] = edges[y];
      const room = side ? r - R - 4 : L - l - 4;
      if (room < 3) continue;
      const x = side ? R + 3 + Math.floor(h(side, y, 21) * room) : l + 1 + Math.floor(h(side, y, 21) * room);
      const w = 2 + Math.floor(h(side, y, 22) * 4);
      for (let i = 0; i < w; i++) { g.set(x + i, y, '#58b04a'); g.set(x + i, y + 1, '#3f8a38'); }
      g.set(x + 1, y - 1, '#58b04a');
      if (h(side, y, 23) < 0.35) { g.set(x + 1, y - 1, '#f4a8c8'); g.set(x + 2, y - 1, '#e07aa8'); }
    }
  }
  // The steps, cut into the rock: each one a row of stone slabs (joints
  // staggered step to step, like laid stone, not boards), its front edge
  // chipped and catching the light, the riser in shadow under it, moss in the
  // back corners. The lower ones are darker and damper.
  const STEP = 13;
  for (let y = 0; y < H; y++) {
    const k = y % STEP;
    const n = Math.floor(y / STEP);
    const t = y / H;
    const left = L + Math.floor(h(n, 0, 30) * 3);
    const right = R - Math.floor(h(n, 1, 30) * 3);
    // Where this step's slabs meet: two or three joints, never in line with the last step's.
    const joints = [];
    for (let x = left + 8 + Math.floor(h(n, 2, 30) * 12); x < right - 8; x += 16 + Math.floor(h(n, joints.length, 31) * 10)) joints.push(x);
    for (let x = left; x < right; x++) {
      let c;
      const chip = h(x >> 1, n, 35) < 0.18 ? 1 : 0;
      if (k < 9) {
        const slab = joints.filter((j) => j <= x).length;
        c = rock[(n + slab) % 4];
        // Worn smooth and pale down the middle where feet go.
        if (x > L + 14 && x < R - 14 && k > 1 && k < 7) c = '#c8a670';
        if (joints.includes(x)) c = deep[1];
        if (k === 8 - chip) c = '#e4c48a';                 // the front edge, in the sun
      } else if (k === 9 && chip) c = '#e4c48a';
      else if (k < 11) c = deep[0];
      else c = deep[2];                                    // the riser's foot, in shadow
      if (k < 8 && h(x >> 2, y >> 2, 34) < 0.07) c = '#a8844e';
      if (t > 0.5 && k < 8 && h(x >> 3, n, 31) < (t - 0.5) * 1.2) c = '#a8844e';
      g.set(x, y, c);
    }
    // Moss in the back corners of the tread.
    if (k > 0 && k < 4) {
      for (let i = 0; i < 3 - k + 1; i++) {
        if (h(n, i, 36) < 0.7) g.set(left + i, y, '#58b04a');
        if (h(n, i, 37) < 0.7) g.set(right - 1 - i, y, '#4a9a40');
      }
    }
    if (k === 2) for (let i = 0; i < 3; i++) g.set(L + 6 + Math.floor(h(i, y, 33) * 56), y, '#f4e6c0');
  }
  // The cut walls either side: not a straight line but the rock's own
  // edge, bulging a pixel or two in and out, a boulder sitting by every few steps.
  for (let y = 0; y < H; y++) {
    const n = Math.floor(y / STEP);
    const wl = Math.round(Math.sin(y / 5 + n) * 1.2);
    const wr = Math.round(Math.sin(y / 4.3 + n * 2) * 1.2);
    for (let i = -3; i <= wl; i++) g.set(L + i - 1, y, i === wl ? '#d8b478' : deep[1]);
    for (let i = wr; i <= 3; i++) g.set(R + i, y, i === wr ? deep[0] : deep[3]);
  }
  for (let n = 1; n * STEP < H - 20; n += 2 + (n % 2)) {
    const y = n * STEP + 3;
    const side = n % 4 < 2;
    const x = side ? L - 1 : R - 6;
    g.rect(x, y, 7, 5, deep[0]);
    g.rect(x + 1, y - 1, 5, 1, deep[0]);
    g.rect(x + 1, y, 4, 2, side ? '#d8b478' : rock[1]);
    g.rect(x, y + 5, 7, 1, deep[3]);
  }
  // The hand ropes on their posts, either side, sagging between.
  const posts = [8, 44, 80, 116, 152];
  for (const px of [L - 5, R + 2]) {
    for (const py of posts) {
      g.rect(px, py - 7, 3, 10, '#4a2e16');
      g.rect(px, py - 7, 1, 10, '#8a5a32');
      g.rect(px, py - 8, 3, 1, '#b88452');
      g.rect(px - 1, py + 3, 5, 1, '#5a3e22');
    }
    for (let i = 0; i + 1 < posts.length; i++) {
      const a = posts[i] - 6;
      const b = posts[i + 1] - 6;
      for (let y = a; y <= b; y++) {
        const f = (y - a) / (b - a);
        const sag = Math.round(Math.sin(f * Math.PI) * 2) * (px < L ? -1 : 1);
        g.set(px + 1 + sag, y, y % 4 === 0 ? '#8c6a30' : '#e6c47a');
      }
    }
  }
  // The top: the clifftop's turf runs over the first step's back.
  for (let x = L; x < R; x++) if (h(x, 0, 40) < 0.6) g.set(x, 0, '#58b04a');
  // The foot: the steps turn east round the spur under a rough arch of rock
  // (the way on down to Gullrest), and the spur stands in the sea on fallen
  // boulders with the surf breaking white round them.
  const archTop = H - 30;
  for (let y = archTop; y < H; y++) {
    const f = (y - archTop) / 30;
    const half = Math.round(26 * Math.sqrt(Math.min(1, f * 1.6)));
    const mid = (L + R) >> 1;
    for (let x = L; x < R; x++) {
      const inside = Math.abs(x - mid) < half;
      if (!inside) g.set(x, y, h(x >> 2, y >> 2, 41) < 0.5 ? deep[1] : deep[0]);
      else g.set(x, y, y > H - 6 ? '#2a1e14' : (Math.abs(x - mid) > half - 3 ? '#4a3420' : '#1e1610'));
      if (!inside && Math.abs(Math.abs(x - mid) - half) < 1) g.set(x, y, '#d8b478');
    }
  }
  // The keystone line of the arch, in the sun.
  for (let x = L + 8; x < R - 8; x++) if (h(x, 3, 42) < 0.8) g.set(x, archTop - 1, '#e4c48a');
  // Boulders round the spur's foot, and foam.
  const [fl, fr] = edges[H - 1];
  for (let i = 0; i < 9; i++) {
    const bx = i < 5 ? fl - 6 + i * 4 : fr - 10 + (i - 5) * 4;
    const by = H - 5 - Math.floor(h(i, 0, 43) * 6);
    const bw = 5 + Math.floor(h(i, 1, 43) * 4);
    g.rect(bx, by, bw, 4, deep[2]);
    g.rect(bx + 1, by - 1, bw - 2, 1, deep[1]);
    g.rect(bx + 1, by, bw - 3, 1, rock[2]);
  }
  for (let x = Math.max(0, fl - 10); x < Math.min(W, fr + 10); x++) {
    if (x > fl + 2 && x < fr - 2) continue;
    for (let y = H - 4; y < H; y++) if (h(x, y, 44) < 0.55 && !g.cells[y][x]) g.set(x, y, h(x, y, 45) < 0.5 ? '#ffffff' : '#cfe8f0');
  }
  return g.rows();
}

// --- Registry ----------------------------------------------------------
export const SY_PROP_SPRITES = {
  sy_seed_clock: seedClock(false),
  sy_seed_clock_on: seedClock(true),
  sy_seed_drift: seedDrift(0),
  sy_seed_heads: seedHeads(0),
  sy_rope_post: ropePost(),
  sy_rope_h: ropeSpan(false),
  sy_rope_v: ropeSpan(true),
  sy_windmill: windmill(0),
  sy_mill_gear: millGear(0),
  sy_hedge_gap: hedgeGap(),
  sy_tortoise: tortoise(0),
  sy_hen: hen(0),
  sy_slip: slip(),
  sy_dune_grass: duneGrass(0),
  sy_sand_patch: sandPatch(),
  sy_picnic_raided: picnicRaided(),
  sy_apple_crate: appleCrate(),
  sy_beehive: beehive(0),
  sy_wheelbarrow: wheelbarrow(),
  sy_windsock: windsock(0),
  sy_reeds: reeds(0),
  sy_lily: lily(0),
  sy_seed_basket: seedBasket(),
  sy_burrow_door: burrowDoor(),
  // Made last, and with no rand(), so nothing above changes.
  sy_scale_cart: scalePlate(false, false),
  sy_scale_cart_on: scalePlate(true, false),
  sy_scale_sack: scalePlate(false, true),
  sy_scale_sack_on: scalePlate(true, true),
  sy_round_door: roundDoor(),
  sy_cliff_path: cliffPath(),
};

// Moving props: frames of one size, played by `animation: '<same name>'`.
export const SY_PALETTE = palette;
export const SY_PALETTE_EXTRA = palette;
export const SY_SEED_DRIFT_SPRITES = frames((i) => seedDrift(i), 4);
export const SY_SEED_HEADS_SPRITES = frames((i) => seedHeads(i), 2);
export const SY_WINDMILL_SPRITES = frames((i) => windmill(i), 4);
export const SY_MILL_GEAR_SPRITES = frames((i) => millGear(i), 4);
export const SY_TORTOISE_SPRITES = frames((i) => tortoise(i), 2);
export const SY_HEN_SPRITES = frames((i) => hen(i), 2);
export const SY_DUNE_GRASS_SPRITES = frames((i) => duneGrass(i), 4);
export const SY_BEEHIVE_SPRITES = frames((i) => beehive(i), 2);
export const SY_WINDSOCK_SPRITES = frames((i) => windsock(i), 4);
export const SY_REEDS_SPRITES = frames((i) => reeds(i), 2);
export const SY_LILY_SPRITES = frames((i) => lily(i), 2);

// How many tiles wide each big one stands.
export const SY_FOOTPRINTS = {
  sy_windmill: 4,
  sy_mill_gear: 2,
  sy_slip: 2,
  sy_picnic_raided: 2,
  sy_burrow_door: 2,
  sy_cliff_path: 8,
};
