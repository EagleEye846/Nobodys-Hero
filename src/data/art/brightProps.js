// Props for Chapter 4's bright regions: Sunnyside's fields, the Glimmering's
// crystal caves and Belowtown's streets. Drawn like the props in props.js
// (rows of characters, 16 pixels to a tile, standing on the bottom edge,
// centred over their footprint) but painted from small helpers below, with
// colours of their own: BRIGHT_PALETTE_EXTRA is added to PROP_PALETTE, and
// uses characters (accented letters) nobody else needs.
//
// Wide ones list their width in tiles in BRIGHT_FOOTPRINTS. The ones that
// move (butterflies, lamps, banners, the pool...) are also animations: put
// the prop's name in the object's `animation` too (see the builders' guide).
// What glows is in BRIGHT_GLOWS (src/overworld/lamplight.js reads it).

// --- A tiny painter ---------------------------------------------------
const OUT = '#1e1442'; // outline for the caves
const OUT_WARM = '#2a1c20'; // outline for fields and the town

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0x100 + colors.size);
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
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.cells[y][x] = c || null;
  }

  get(x, y) {
    return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.cells[y][x] : null;
  }

  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
  }

  disc(cx, cy, r, c) {
    this.oval(cx, cy, r, r, c);
  }

  oval(cx, cy, rx, ry, c) {
    for (let dy = -ry; dy <= ry; dy++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.25))));
      this.rect(cx - w, cy + dy, w * 2 + 1, 1, c);
    }
  }

  // A rounded lump with light from the top left: [dark, mid, light, highlight].
  ball(cx, cy, rx, ry, tones) {
    this.oval(cx, cy, rx, ry, tones[0]);
    this.oval(cx - 1, cy - 1, Math.max(1, rx - 1), Math.max(1, ry - 1), tones[1]);
    if (rx > 2 && ry > 2) this.oval(cx - 2, cy - 2, Math.max(1, rx - 3), Math.max(1, ry - 3), tones[2]);
    if (rx > 3 && ry > 3 && tones[3]) this.oval(cx - 3, cy - 3, Math.max(1, Math.floor(rx / 3)), Math.max(1, Math.floor(ry / 3)), tones[3]);
  }

  line(x0, y0, x1, y1, c) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) this.set(Math.round(x0 + ((x1 - x0) * i) / steps), Math.round(y0 + ((y1 - y0) * i) / steps), c);
  }

  // A one-pixel edge round everything drawn so far.
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

  // Draws `other` onto this one at (ox, oy).
  paste(other, ox, oy) {
    for (let y = 0; y < other.h; y++) for (let x = 0; x < other.w; x++) this.set(ox + x, oy + y, other.cells[y][x]);
  }

  rows() {
    return this.cells.map((row) => row.map((c) => (c ? char(c) : '.')).join(''));
  }
}

// Little deterministic dice, so every redraw of the file gives the same art.
let seed = 7;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const ri = (n) => Math.floor(rand() * n);
const choose = (list) => list[ri(list.length)];

// --- Crystals -----------------------------------------------------------
// [outline, dark face, light face, highlight, glint]
const HUES = {
  teal: ['#0e3a4a', '#1f9ea8', '#4fe0d0', '#b8fff0', '#ffffff'],
  pink: ['#4a1048', '#b8309a', '#ff6ac8', '#ffc4ec', '#ffffff'],
  violet: ['#241058', '#6a40d0', '#a888ff', '#dccaff', '#ffffff'],
  gold: ['#4a2c08', '#d08a1c', '#ffd24a', '#fff0a0', '#ffffff'],
  // The singing crystals before they've sung: slate and dust, no light in them.
  dull: ['#262244', '#4a4868', '#6c6a8c', '#8c8aac', '#b4b2cc'],
};
function shard(g, bx, by, w, h, hue, lean = 0) {
  const c = HUES[hue];
  const rows = [];
  for (let r = 0; r < h; r++) {
    const cap = Math.min(w, 1 + 2 * r);
    rows.push([bx - Math.floor(cap / 2) + Math.round(lean * (1 - r / Math.max(1, h - 1))), cap]);
  }
  const top = by - h + 1;
  rows.forEach(([x0, rw], r) => g.rect(x0 - 1, top + r, rw + 2, 1, c[0]));
  g.rect(rows[0][0], top - 1, rows[0][1], 1, c[0]);
  g.rect(rows[h - 1][0], by + 1, rows[h - 1][1], 1, c[0]);
  rows.forEach(([x0, rw], r) => {
    const half = Math.ceil(rw / 2);
    g.rect(x0, top + r, half, 1, c[2]);
    g.rect(x0 + half, top + r, rw - half, 1, c[1]);
    if (rw >= 3) g.set(x0 + Math.floor(rw / 2) - (rw >= 5 ? 1 : 0), top + r, c[3]);
  });
  if (w >= 5 && h > 5) {
    g.rect(rows[3][0] + 1, top + 3, 1, 2, c[4]);
    g.rect(rows[h - 1][0] + 1, by, w - 2, 1, c[3]);
  }
}
function rockBase(g, cx, by, rx) {
  g.oval(cx, by, rx, 2, '#4a3c84');
  g.oval(cx, by - 1, rx - 1, 2, '#6a5aa8');
  g.rect(cx - rx + 2, by - 2, 3, 1, '#8a7acc');
  g.set(cx + 2, by - 1, '#2c2058');
}

function crystalSmall(hue, other) {
  const g = new Grid(16, 22);
  rockBase(g, 8, 20, 6);
  shard(g, 4, 19, 3, 8, other, -1);
  shard(g, 12, 19, 3, 9, other, 1);
  shard(g, 8, 20, 5, 15, hue, 0);
  shard(g, 6, 20, 3, 6, hue, -1);
  return g.rows();
}
function crystalLarge(hue, other, third) {
  const g = new Grid(32, 38);
  rockBase(g, 16, 36, 13);
  shard(g, 4, 35, 3, 12, third, -1);
  shard(g, 27, 35, 3, 14, third, 1);
  shard(g, 9, 35, 5, 21, other, -1);
  shard(g, 23, 35, 5, 24, other, 1);
  shard(g, 16, 36, 9, 33, hue, 0);
  shard(g, 12, 36, 3, 12, hue, -1);
  shard(g, 20, 36, 3, 14, hue, 1);
  return g.rows();
}
// A singing crystal (src/overworld/chimes.js): one tall spire with a small
// one either side, `h` pixels tall, so the four of a set can stand in steps,
// the lowest note the shortest. `hue` 'dull' is before it has sung.
function singingCrystal(h, hue) {
  const g = new Grid(16, h + 4);
  const by = h + 2;
  rockBase(g, 8, by, 6);
  shard(g, 4, by - 1, 3, Math.round(h * 0.4), hue === 'dull' ? 'dull' : hue, -1);
  shard(g, 12, by - 1, 3, Math.round(h * 0.5), hue === 'dull' ? 'dull' : hue, 1);
  shard(g, 8, by, 7, h, hue, 0);
  return g.rows();
}
// The sealed cache the sung crystals open: a plain grey geode with a hairline
// crack down the middle, humming, that splits when the tune is done.
function sealedGeode() {
  const g = new Grid(16, 18);
  // A shadow on the floor, then a round grey stone lit from the top left.
  g.oval(8, 16, 7, 1, '#2a2650');
  g.oval(8, 11, 7, 6, '#1e1442');
  g.ball(8, 11, 6, 5, ['#3e3a68', '#5a5680', '#7c78a4', '#aeaad0']);
  // Rough grain on the shell, and chipped lighter edges on the lit side.
  for (const [x, y] of [[4, 12], [5, 14], [10, 14], [11, 12], [12, 10], [10, 15], [3, 10]]) g.set(x, y, '#4a4676');
  for (const [x, y] of [[6, 7], [4, 9], [3, 11]]) g.set(x, y, '#c4c0e4');
  g.set(11, 15, '#2e2a54');
  g.set(12, 14, '#2e2a54');
  // The hairline crack, with a faint violet-teal light humming through it.
  g.line(8, 6, 9, 9, '#1e1442');
  g.line(9, 9, 7, 12, '#1e1442');
  g.line(7, 12, 8, 15, '#1e1442');
  g.set(9, 7, '#8a6ae0');
  g.set(8, 10, '#6adcd0');
  g.set(8, 13, '#8a6ae0');
  g.set(7, 11, '#6adcd0');
  // It sits on the floor with a dark base line.
  g.rect(3, 16, 10, 1, '#1e1442');
  return g.rows();
}
// A flat stone with a stave cut into it, faint as old carving: five lines
// and the four notes G C E D (the chapter's tune), no clef, worn smooth.
function staveStone() {
  const g = new Grid(20, 32);
  // A standing slab, round at the top, a bit crooked at the foot.
  g.oval(10, 9, 8, 7, '#2a2650');
  g.rect(2, 9, 16, 21, '#2a2650');
  g.oval(10, 9, 7, 6, '#8884b0');
  g.rect(3, 9, 14, 20, '#8884b0');
  g.rect(3, 9, 2, 20, '#a8a4cc');
  g.rect(15, 9, 2, 20, '#6c688e');
  g.rect(1, 29, 18, 2, '#2a2650');
  g.rect(2, 29, 16, 1, '#4a4670');
  const ink = '#3a3660';
  for (let k = 0; k < 5; k++) g.rect(5, 12 + k * 3, 10, 1, '#5e5a88');
  // Notes: G4 on the second line from the bottom, C5 in the third space, E5
  // in the top space, D5 on the fourth line. A pixel and a half a half-step.
  const notes = [[6, 22], [9, 17], [12, 13], [15, 15]];
  for (const [nx, ny] of notes) g.rect(nx - 1, ny - 1, 2, 2, ink);
  return g.rows();
}
function crystalBloom(flip = false) {
  const g = new Grid(48, 52);
  rockBase(g, 24, 50, 21);
  const spec = [
    [5, 48, 3, 11, 'gold', -1], [42, 48, 3, 13, 'gold', 1],
    [10, 48, 5, 22, 'pink', -2], [37, 48, 5, 26, 'violet', 2],
    [17, 49, 5, 32, 'violet', -1], [31, 49, 5, 30, 'pink', 1],
    [24, 50, 11, 46, 'teal', 0], [19, 50, 3, 18, 'teal', -1], [29, 50, 3, 20, 'teal', 1],
  ];
  for (const [bx, by, w, h, hue, lean] of spec) shard(g, bx, by, w, h, hue, lean);
  const twinkles = flip ? [[22, 12], [8, 30], [41, 24]] : [[27, 20], [14, 26], [36, 36]];
  for (const [tx, ty] of twinkles) {
    g.set(tx, ty, '#ffffff');
    g.set(tx - 1, ty, '#e8fcff');
    g.set(tx + 1, ty, '#e8fcff');
    g.set(tx, ty - 1, '#e8fcff');
    g.set(tx, ty + 1, '#e8fcff');
  }
  return g.rows();
}

// --- Mushrooms ----------------------------------------------------------
const CAPS = {
  teal: ['#14607a', '#1f9ea8', '#4fe0d0', '#b8fff0'],
  pink: ['#7a1a62', '#c4409e', '#ff7ad0', '#ffd0f0'],
  violet: ['#3a2490', '#6a4ad8', '#a888ff', '#e0d4ff'],
};
const STEM = ['#a89888', '#d8c8b4', '#f0e4d2', '#fff8ec'];
function glowcap(w, h, capHue, { stemW = null, spots = true } = {}) {
  const g = new Grid(w, h);
  const cap = CAPS[capHue];
  const sw = stemW ?? Math.max(3, Math.round(w / 5));
  const cx = Math.floor(w / 2);
  const capRy = Math.round(h * 0.42);
  const capRx = Math.floor(w / 2) - 1;
  const cy = capRy;
  // The cap: a dome, darker under the lip.
  g.oval(cx, cy + 1, capRx, capRy, cap[0]);
  g.oval(cx, cy, capRx - 1, capRy - 1, cap[1]);
  g.oval(cx - 1, cy - 1, Math.max(2, capRx - 3), Math.max(2, capRy - 3), cap[2]);
  g.oval(cx - Math.floor(capRx / 3), cy - Math.floor(capRy / 2), Math.max(1, Math.floor(capRx / 3)), Math.max(1, Math.floor(capRy / 4)), cap[3]);
  const lipY = cy + Math.floor(capRy * 0.55);
  g.rect(0, lipY, w, h - lipY, null);
  // The stem, a little fatter at the foot, shaded left to right.
  for (let y = lipY; y < h - 1; y++) {
    const flare = y > h - 5 ? 1 : 0;
    const x0 = cx - Math.floor(sw / 2) - flare;
    const width = sw + flare * 2;
    g.rect(x0, y, width, 1, STEM[1]);
    g.rect(x0, y, 1, 1, STEM[0]);
    g.rect(x0 + 1, y, Math.max(1, Math.floor(width / 3)), 1, STEM[2]);
    g.rect(x0 + width - 2, y, 2, 1, STEM[0]);
    if (y % 5 === 2) g.rect(x0 + 1, y, width - 2, 1, STEM[0]);
  }
  // The lip, and the gills glowing under it.
  g.rect(cx - capRx, lipY - 1, capRx * 2 + 1, 2, cap[1]);
  g.rect(cx - capRx + 1, lipY + 1, capRx * 2 - 1, 1, cap[0]);
  for (let x = cx - capRx + 2; x < cx + capRx - 1; x += 2) g.rect(x, lipY + 1, 1, 1, cap[3]);
  if (spots) {
    const count = Math.max(3, Math.round(w / 6));
    for (let i = 0; i < count; i++) {
      const sx = cx - capRx + 3 + Math.round(((capRx * 2 - 6) * (i + 0.5)) / count);
      const sy = cy - Math.floor(capRy * 0.5) + (i % 2) * Math.floor(capRy * 0.4);
      g.disc(sx, sy, i % 3 === 0 ? 2 : 1, '#fffbe8');
      g.set(sx, sy, '#ffffff');
    }
  }
  g.outline(OUT);
  return g.rows();
}
function glowcapGiant() {
  const g = new Grid(64, 60);
  const cap = CAPS.violet;
  const cx = 32;
  // The cap, a wide dome.
  g.oval(cx, 21, 31, 20, cap[0]);
  g.oval(cx, 20, 30, 19, cap[1]);
  g.oval(cx - 3, 17, 25, 15, cap[2]);
  g.oval(cx - 8, 11, 14, 8, cap[3]);
  g.oval(cx - 12, 8, 7, 3, '#f4ecff');
  g.rect(0, 31, 64, 29, null);
  // The stem.
  for (let y = 31; y < 58; y++) {
    const flare = y > 50 ? Math.floor((y - 50) / 2) : 0;
    const x0 = cx - 7 - flare;
    const width = 14 + flare * 2;
    g.rect(x0, y, width, 1, STEM[1]);
    g.rect(x0, y, 2, 1, STEM[0]);
    g.rect(x0 + 2, y, 4, 1, STEM[2]);
    g.rect(x0 + 3, y, 1, 1, STEM[3]);
    g.rect(x0 + width - 4, y, 4, 1, STEM[0]);
    if (y % 6 === 3) g.rect(x0 + 2, y, width - 4, 1, STEM[0]);
  }
  // Moss round the foot.
  g.oval(cx, 58, 14, 2, '#2f9e8a');
  g.oval(cx, 57, 12, 1, '#58e0b8');
  // The cap's lip and the gills under it.
  g.rect(2, 29, 60, 3, cap[1]);
  g.rect(4, 31, 56, 2, cap[0]);
  g.rect(8, 33, 48, 1, '#2a1870');
  for (let x = 8; x < 56; x += 2) g.rect(x, 33, 1, 3, x % 4 ? '#ff7ad0' : '#ffd0f0');
  // Glowing spots, teal and cream.
  const spots = [[14, 22, 4], [28, 12, 3], [42, 17, 4], [51, 24, 2], [22, 26, 2], [36, 25, 3], [9, 27, 2], [34, 6, 2], [18, 12, 2], [46, 9, 2], [26, 19, 2]];
  for (const [sx, sy, r] of spots) {
    g.disc(sx, sy, r, '#7af0e0');
    g.disc(sx, sy - 1, Math.max(1, r - 1), '#d8fff8');
    g.set(sx - 1, sy - 2, '#ffffff');
  }
  g.outline(OUT);
  // Small mushrooms at the foot of the stem.
  for (const [mx, hue] of [[10, 'teal'], [48, 'pink'], [53, 'teal']]) {
    g.rect(mx, 53, 2, 4, STEM[2]);
    g.oval(mx + 1, 52, 3, 2, CAPS[hue][2]);
    g.rect(mx - 2, 53, 6, 1, CAPS[hue][1]);
    g.set(mx, 51, '#fffbe8');
  }
  return g.rows();
}
function glowMoss(frame) {
  const g = new Grid(16, 9);
  g.oval(8, 6, 7, 2, '#1f6e66');
  g.oval(8, 5, 6, 2, '#2f9e8a');
  g.oval(7, 4, 4, 1, '#58e0b8');
  const dots = frame ? [[3, 4], [9, 2], [12, 5], [6, 6]] : [[5, 3], [11, 3], [2, 5], [8, 6]];
  for (const [x, y] of dots) {
    g.set(x, y, '#e8fff4');
    g.set(x, y - 1, '#9affe0');
  }
  for (const x of [3, 7, 10, 13]) g.rect(x, 2 + (x % 2), 1, 2, '#3cc4a0');
  return g.rows();
}
function crystalPool(frame) {
  const g = new Grid(32, 22);
  // Rim.
  g.oval(16, 13, 15, 8, '#2c2058');
  g.oval(16, 12, 14, 7, '#6a5aa8');
  g.oval(16, 13, 12, 6, '#1e1442');
  // Water.
  g.oval(16, 13, 11, 5, '#1b86a0');
  g.oval(16, 13, 9, 4, '#2aa6c8');
  g.oval(15, 12, 6, 2, '#47d0e0');
  g.oval(14, 11, 3, 1, '#b8f6ff');
  const ripple = [[10, 12, 6], [18, 14, 5], [13, 15, 4]];
  ripple.forEach(([x, y, w], i) => g.rect(x + ((frame + i) % 3) - 1, y, w, 1, i % 2 ? '#7af0ff' : '#b8f6ff'));
  const sparks = [[[12, 11], [20, 13]], [[17, 12], [11, 14]], [[21, 11], [14, 13]]][frame % 3];
  for (const [x, y] of sparks) { g.set(x, y, '#ffffff'); g.set(x + 1, y, '#e8fdff'); }
  // Crystals at the rim.
  shard(g, 4, 14, 3, 8, 'pink', -1);
  shard(g, 27, 13, 3, 10, 'violet', 1);
  shard(g, 7, 9, 3, 6, 'teal', -1);
  shard(g, 24, 8, 3, 5, 'gold', 1);
  g.rect(14, 3, 1, 1, '#ffffff');
  return g.rows();
}

// --- Sunnyside ------------------------------------------------------------
const GREENS = ['#3f8a2e', '#58ac3c', '#7dd356', '#a4ee74'];
function blades(g, x, y, w, h) {
  for (let i = 0; i < w; i += 2) {
    const bh = 2 + ri(h);
    g.rect(x + i, y - bh, 1, bh, choose(GREENS));
    if (rand() < 0.4) g.set(x + i + 1, y - bh + 1, GREENS[3]);
  }
}
function flowerPatch(kind) {
  const g = new Grid(16, 14);
  blades(g, 1, 13, 14, 4);
  const spots = [[3, 8], [8, 6], [12, 9], [5, 11], [10, 12], [2, 12], [14, 12]];
  for (const [x, y] of spots) {
    if (kind === 'daisy') {
      g.rect(x - 1, y, 3, 1, '#fffdf2');
      g.rect(x, y - 1, 1, 3, '#fffdf2');
      g.set(x, y, '#ffd23c');
      g.set(x, y + 2, '#3f8a2e');
    } else {
      g.rect(x - 1, y, 3, 2, '#ffd62e');
      g.set(x - 1, y - 1, '#ffd62e');
      g.set(x + 1, y - 1, '#ffd62e');
      g.set(x, y, '#fff3a0');
      g.rect(x, y + 2, 1, 2, '#3f8a2e');
    }
  }
  return g.rows();
}
function picketFence() {
  const g = new Grid(16, 18);
  for (const ry of [8, 13]) {
    g.rect(0, ry, 16, 2, '#e8dcc0');
    g.rect(0, ry, 16, 1, '#fff8e4');
    g.rect(0, ry + 1, 16, 1, '#b8a880');
  }
  for (const fx of [1, 6, 11]) {
    g.rect(fx, 4, 3, 13, '#f0e6cc');
    g.rect(fx, 4, 1, 13, '#fff8e4');
    g.rect(fx + 2, 4, 1, 13, '#c8b890');
    g.set(fx + 1, 3, '#f0e6cc');
    g.set(fx + 1, 2, '#fff8e4');
    g.set(fx, 4, '#fff8e4');
    g.rect(fx + 1, 17, 1, 1, '#7a9a50');
  }
  g.outline('#6a5a3a');
  return g.rows();
}
function meadowGate(open = false) {
  const g = new Grid(32, 26);
  const post = (x) => {
    g.rect(x, 3, 4, 22, '#f0e6cc');
    g.rect(x, 3, 1, 22, '#fff8e4');
    g.rect(x + 3, 3, 1, 22, '#c8b890');
    g.rect(x - 1, 1, 6, 3, '#e8dcc0');
    g.rect(x - 1, 1, 6, 1, '#fff8e4');
    g.rect(x + 1, 4, 1, 1, '#8a7a5a');
  };
  post(0);
  post(28);
  if (!open) {
    for (const ry of [6, 13, 20]) {
      g.rect(4, ry, 24, 3, '#e8dcc0');
      g.rect(4, ry, 24, 1, '#fff8e4');
      g.rect(4, ry + 2, 24, 1, '#b8a880');
    }
    g.line(5, 20, 26, 7, '#d8cca8');
    g.line(5, 21, 26, 8, '#b8a880');
    g.rect(24, 12, 3, 3, '#ffd23c');
    g.rect(25, 12, 1, 1, '#fff3a0');
  } else {
    // Swung wide, seen end on: a narrow leaf by the post.
    g.rect(4, 5, 3, 19, '#e8dcc0');
    g.rect(4, 5, 1, 19, '#fff8e4');
    g.rect(6, 5, 1, 19, '#b8a880');
    g.rect(7, 8, 8, 2, '#d8cca8');
    g.rect(7, 16, 8, 2, '#d8cca8');
  }
  g.rect(1, 24, 3, 1, '#7a9a50');
  g.rect(28, 24, 3, 1, '#7a9a50');
  g.outline('#6a5a3a');
  return g.rows();
}
function scarecrow(frame) {
  const g = new Grid(20, 34);
  // Pole and arms.
  g.rect(9, 8, 2, 25, '#8a5a32');
  g.rect(9, 8, 1, 25, '#b88452');
  g.rect(1, 14, 18, 2, '#8a5a32');
  g.rect(1, 14, 18, 1, '#b88452');
  // Shirt.
  g.rect(5, 14, 10, 11, '#4a8ad0');
  g.rect(5, 14, 3, 11, '#6aa8e8');
  g.rect(12, 14, 3, 11, '#3a6aa8');
  g.rect(7, 18, 3, 3, '#d8503a');
  g.rect(7, 18, 3, 1, '#f27a4a');
  g.rect(10, 22, 3, 2, '#e0c060');
  g.line(5, 25, 6, 26, '#e8c860');
  g.line(8, 25, 9, 27, '#e8c860');
  g.line(12, 25, 13, 27, '#e8c860');
  // Straw hands and cuffs.
  for (const [x, dir] of [[1, -1], [18, 1]]) {
    g.rect(x - (dir < 0 ? 0 : 0), 13, 1, 4, '#e8c860');
    g.set(x + dir, 12, '#e8c860');
    g.set(x + dir, 17, '#f4d878');
  }
  // Sleeves.
  g.rect(2, 14, 4, 3, '#4a8ad0');
  g.rect(14, 14, 4, 3, '#4a8ad0');
  // Head: a sack, stitched smile.
  g.oval(10, 8, 4, 4, '#d8b878');
  g.oval(9, 7, 3, 3, '#e8c888');
  g.set(8, 7, '#2a1c20');
  g.set(12, 7, '#2a1c20');
  g.rect(8, 10, 5, 1, '#6a4a28');
  g.set(8, 9, '#6a4a28');
  g.set(12, 9, '#6a4a28');
  // Hat.
  g.rect(4, 5, 13, 2, '#c8963c');
  g.rect(4, 5, 13, 1, '#e8b858');
  g.rect(7, 0, 7, 5, '#c8963c');
  g.rect(7, 0, 2, 5, '#e8b858');
  g.rect(7, 3, 7, 1, '#a82a2a');
  g.rect(14, 4, 3, 1, '#a07428');
  // Scarf, fluttering.
  const sy = frame ? 12 : 11;
  g.rect(8, 12, 5, 2, '#d8503a');
  g.rect(13, sy, 4, 2, '#d8503a');
  g.rect(16, sy + (frame ? -1 : 1), 3, 2, '#f27a4a');
  // Straw tufts at the hem.
  for (const x of [5, 7, 11, 13]) g.rect(x, 25, 1, 3 + (x % 2), '#e8c860');
  // A crow on one arm, in one frame.
  if (frame) {
    g.rect(2, 11, 4, 3, '#2a2438');
    g.set(1, 11, '#2a2438');
    g.set(0, 12, '#c8963c');
    g.set(2, 11, '#5a5470');
  }
  g.outline(OUT_WARM);
  return g.rows();
}
function haystack() {
  const g = new Grid(34, 30);
  g.oval(17, 26, 16, 3, '#b88a2c');
  for (let y = 0; y < 26; y++) {
    const half = Math.round(15 * Math.pow(y / 25, 0.8) + (y < 4 ? 1 : 0));
    const x0 = 17 - half;
    g.rect(x0, y + 2, half * 2 + 1, 1, y % 4 < 2 ? '#e6c05a' : '#d8aa44');
    g.rect(x0, y + 2, Math.max(1, Math.floor(half / 2)), 1, y % 4 < 2 ? '#f4d878' : '#e6c05a');
    g.rect(x0 + half * 2 - 1, y + 2, 2, 1, '#b88a2c');
  }
  for (let i = 0; i < 26; i++) {
    const y = 4 + ri(20);
    const half = Math.round(15 * Math.pow((y - 2) / 25, 0.8));
    g.rect(17 - half + ri(Math.max(1, half * 2)), y, 3, 1, choose(['#fff0a0', '#c89a38', '#f4d878']));
  }
  for (const y of [14, 22]) g.rect(17 - Math.round(15 * Math.pow((y - 2) / 25, 0.8)) + 1, y + 2, Math.round(15 * Math.pow((y - 2) / 25, 0.8)) * 2 - 1, 1, '#8a5a28');
  g.rect(15, 0, 4, 3, '#e6c05a');
  g.rect(16, 0, 2, 1, '#fff0a0');
  // A pitchfork leaning on it.
  g.rect(29, 12, 1, 15, '#8a5a32');
  g.rect(27, 10, 5, 1, '#8a8a96');
  for (const x of [27, 29, 31]) g.rect(x, 7, 1, 4, '#8a8a96');
  g.outline(OUT_WARM);
  return g.rows();
}
function picnicBlanket() {
  const g = new Grid(32, 16);
  // The blanket, a slanted rectangle of red and white checks.
  for (let y = 0; y < 11; y++) {
    const shift = Math.floor((10 - y) / 3);
    for (let x = 2; x < 28; x++) {
      const cx = Math.floor((x - 2) / 3);
      const cy = Math.floor(y / 3);
      g.set(x + shift, y + 3, (cx + cy) % 2 ? '#fffdf2' : '#e04a4a');
    }
  }
  g.rect(2 + 3, 13, 26, 1, '#9a2a2a');
  g.rect(2, 12, 26, 1, '#b83a3a');
  // A wicker basket with a loaf in it.
  g.rect(18, 4, 8, 6, '#b88452');
  g.rect(18, 4, 8, 1, '#d8a468');
  for (let x = 18; x < 26; x += 2) g.rect(x, 6, 1, 4, '#8a5a32');
  g.rect(19, 2, 6, 3, '#e0b070');
  g.rect(19, 2, 6, 1, '#f4d090');
  g.rect(20, 1, 4, 1, '#8a5a32');
  // Teacup and an apple.
  g.rect(6, 7, 4, 3, '#fffdf2');
  g.rect(6, 7, 4, 1, '#d8eef8');
  g.set(10, 8, '#fffdf2');
  g.oval(13, 9, 2, 2, '#d83a3a');
  g.set(12, 8, '#ff8a7a');
  g.set(13, 6, '#3f8a2e');
  g.outline(OUT_WARM);
  return g.rows();
}
function bridgePlank() {
  const g = new Grid(16, 9);
  g.rect(1, 2, 14, 5, '#d8a868');
  g.rect(1, 2, 14, 1, '#f0cc90');
  g.rect(1, 6, 14, 1, '#a87a44');
  g.rect(3, 4, 1, 1, '#6a4524');
  g.rect(12, 4, 1, 1, '#6a4524');
  g.line(5, 3, 8, 5, '#c89a58');
  g.rect(2, 1, 4, 1, '#7dd356');
  g.rect(11, 6, 4, 1, '#58ac3c');
  g.outline('#6a4524');
  return g.rows();
}
function butterflies(frame) {
  const g = new Grid(16, 16);
  const fly = (cx, cy, c1, c2, open) => {
    g.rect(cx, cy - 1, 1, 3, '#2a1c20');
    if (open) {
      g.rect(cx - 3, cy - 2, 3, 3, c1);
      g.rect(cx + 1, cy - 2, 3, 3, c1);
      g.rect(cx - 2, cy + 1, 2, 2, c2);
      g.rect(cx + 1, cy + 1, 2, 2, c2);
      g.set(cx - 2, cy - 1, '#fffdf2');
      g.set(cx + 2, cy - 1, '#fffdf2');
    } else {
      g.rect(cx - 1, cy - 2, 1, 4, c1);
      g.rect(cx + 1, cy - 2, 1, 4, c1);
      g.set(cx - 1, cy + 1, c2);
      g.set(cx + 1, cy + 1, c2);
    }
  };
  const path = [[4, 9, 12, 5], [5, 7, 11, 6], [6, 5, 10, 8], [5, 6, 11, 7]][frame % 4];
  fly(path[0], path[1], '#ffd62e', '#f08a2a', frame % 2 === 0);
  fly(path[2], path[3], '#6aa8f0', '#a878e0', frame % 2 === 1);
  return g.rows();
}
function lemonadeStand(frame) {
  const g = new Grid(48, 44);
  // Counter.
  g.rect(3, 26, 42, 16, '#c88a4a');
  g.rect(3, 26, 42, 2, '#e8b068');
  g.rect(3, 40, 42, 2, '#8a5a32');
  for (let x = 6; x < 45; x += 7) g.rect(x, 29, 1, 11, '#a8703a');
  // A lemon painted on the front.
  g.oval(24, 34, 5, 4, '#ffe45a');
  g.oval(23, 33, 3, 2, '#fff7b0');
  g.rect(28, 31, 3, 1, '#58ac3c');
  g.rect(29, 30, 2, 1, '#7dd356');
  // Posts and roof beam.
  for (const px0 of [1, 44]) {
    g.rect(px0, 6, 3, 36, '#a8703a');
    g.rect(px0, 6, 1, 36, '#d8a468');
  }
  // The awning: yellow and white stripes, scalloped.
  g.rect(0, 5, 48, 10, '#fffdf2');
  for (let x = 0; x < 48; x += 8) g.rect(x, 5, 4, 10, '#ffd62e');
  g.rect(0, 5, 48, 2, '#fff7b0');
  for (let x = 0; x < 48; x += 4) {
    const c = (x / 4) % 2 ? '#ffd62e' : '#fffdf2';
    g.rect(x, 15, 4, 2, c);
    g.rect(x + 1, 17, 2, 1, c);
  }
  g.rect(0, 14, 48, 1, '#d8a820');
  // Bunting along the top, flapping.
  for (let i = 0; i < 6; i++) {
    const bx = 4 + i * 8;
    const c = ['#e04a4a', '#4a8ad0', '#7dd356'][i % 3];
    g.rect(bx, 2 + ((i + frame) % 2), 4, 2, c);
    g.rect(bx + 1, 4 + ((i + frame) % 2), 2, 1, c);
  }
  g.rect(0, 2, 48, 1, '#6a4524');
  // A pitcher and cups on the counter.
  g.rect(12, 19, 6, 8, '#fff7b0');
  g.rect(12, 19, 6, 1, '#fffdf2');
  g.rect(13, 21, 4, 5, '#ffe45a');
  g.rect(18, 21, 2, 4, '#d8eef8');
  g.rect(11, 19, 1, 1, '#d8eef8');
  for (const cx of [26, 31, 36]) {
    g.rect(cx, 22, 4, 5, '#e8f6fc');
    g.rect(cx + 1, 23, 2, 3, '#ffe45a');
  }
  // A crate of lemons on the floor beside it.
  g.rect(38, 36, 9, 6, '#b88452');
  for (const [lx, ly] of [[39, 34], [42, 33], [45, 34]]) g.oval(lx, ly, 2, 2, '#ffe45a');
  // A little sign.
  g.rect(18, 17, 12, 1, '#6a4524');
  g.outline(OUT_WARM);
  return g.rows();
}

// --- Belowtown ------------------------------------------------------------
const IRON = ['#2a2a32', '#4a4a56', '#7a7a8a'];
function glowwormJar(g, cx, cy, strength) {
  // A glass jar with a glowing grub coiled inside.
  const glow = ['#ffc866', '#ffe48a', '#fff6c0'][strength];
  g.rect(cx - 2, cy - 4, 5, 1, '#3a2c20');
  g.rect(cx - 3, cy - 3, 7, 8, '#6a5a40');
  g.rect(cx - 2, cy - 3, 5, 7, '#ffd88a');
  g.rect(cx - 1, cy - 2, 3, 5, glow);
  g.rect(cx - 2, cy - 1, 4, 1, glow);
  g.rect(cx - 1, cy + 1, 4, 1, glow);
  g.set(cx, cy, '#ffffff');
  g.rect(cx - 2, cy + 5, 5, 1, '#3a2c20');
}
function glowwormLamp(strength) {
  const g = new Grid(16, 34);
  g.rect(7, 8, 2, 25, IRON[1]);
  g.rect(7, 8, 1, 25, IRON[2]);
  g.rect(5, 31, 6, 2, IRON[1]);
  g.rect(4, 32, 8, 1, IRON[0]);
  g.rect(7, 6, 7, 2, IRON[1]);
  g.rect(12, 6, 2, 3, IRON[1]);
  g.rect(8, 4, 3, 2, IRON[1]);
  glowwormJar(g, 12, 13, strength);
  g.set(12, 9, IRON[1]);
  g.outline(OUT_WARM);
  return g.rows();
}
function glowwormString(frame) {
  const g = new Grid(48, 18);
  // A cord sagging between two hooks, jars hanging from it.
  for (let x = 0; x < 48; x++) {
    const sag = Math.round(Math.sin((x / 47) * Math.PI) * 5);
    g.set(x, 2 + sag, '#6a4a28');
    g.set(x, 3 + sag, '#3a2c20');
  }
  const jars = [4, 12, 20, 28, 36, 44];
  jars.forEach((jx, i) => {
    const sag = Math.round(Math.sin((jx / 47) * Math.PI) * 5);
    g.rect(jx, 4 + sag, 1, 2, '#3a2c20');
    const on = (i + frame) % 3;
    const glow = ['#ffc866', '#ffe48a', '#fff6c0'][on];
    g.rect(jx - 1, 6 + sag, 3, 4, '#6a5a40');
    g.rect(jx, 6 + sag, 1, 3, '#ffd88a');
    g.rect(jx - 1 + 0, 7 + sag, 3, 2, glow);
    g.set(jx, 7 + sag, '#ffffff');
  });
  // A wooden post at each end, standing on the ground, with an iron cap
  // and hook the cord ties off on.
  for (const px of [0, 45]) {
    g.rect(px, 1, 3, 17, '#6a4a28');
    g.rect(px, 1, 1, 17, '#8a6438');
    g.rect(px + 2, 1, 1, 17, '#3a2c20');
    g.rect(px, 16, 3, 2, '#3a2c20');
    g.rect(px, 0, 3, 1, IRON[1]);
  }
  g.outline(OUT_WARM);
  return g.rows();
}
const STALL_CAPS = ['#d8502e', '#f27a4a', '#9a3320'];
function mushroomStall() {
  const g = new Grid(52, 44);
  // Table and sacks.
  g.rect(6, 28, 40, 12, '#a8764a');
  g.rect(6, 28, 40, 2, '#c89a64');
  g.rect(6, 38, 40, 2, '#6a4424');
  for (const x of [12, 22, 32, 42]) g.rect(x, 30, 1, 8, '#8a5a38');
  // Baskets of mushrooms along the front.
  const basket = (bx, hue) => {
    g.rect(bx, 21, 12, 7, '#b88452');
    g.rect(bx, 21, 12, 1, '#d8a468');
    for (let x = bx + 1; x < bx + 12; x += 3) g.rect(x, 23, 1, 5, '#8a5a32');
    for (const [mx, mh] of [[bx + 2, 3], [bx + 6, 5], [bx + 9, 3]]) {
      g.rect(mx, 21 - mh, 2, mh, '#f2e8d0');
      g.oval(mx + 1, 20 - mh, 3, 2, CAPS[hue][2]);
      g.rect(mx - 1, 21 - mh, 5, 1, CAPS[hue][1]);
      g.set(mx + 1, 19 - mh, '#fffbe8');
    }
  };
  basket(8, 'pink');
  basket(21, 'teal');
  basket(34, 'violet');
  // Posts.
  for (const px0 of [3, 47]) {
    g.rect(px0, 8, 3, 34, '#8a5a38');
    g.rect(px0, 8, 1, 34, '#c89a64');
  }
  // The awning: one huge mushroom cap with cream spots and gills.
  g.oval(26, 10, 26, 10, STALL_CAPS[2]);
  g.oval(26, 9, 25, 9, STALL_CAPS[0]);
  g.oval(24, 7, 19, 6, STALL_CAPS[1]);
  g.oval(18, 4, 8, 2, '#ffa07a');
  for (let y = 11; y <= 22; y++) g.rect(0, y, 52, 1, null);
  g.rect(1, 10, 50, 3, STALL_CAPS[0]);
  g.rect(3, 12, 46, 2, STALL_CAPS[2]);
  for (let x = 3; x < 49; x += 2) g.rect(x, 14, 1, 2, x % 4 ? '#f0d8b0' : '#c8a878');
  g.rect(3, 13, 46, 1, '#f0d8b0');
  for (const [sx, sy, r] of [[8, 7, 2], [18, 3, 2], [29, 6, 3], [40, 8, 2], [13, 11, 1], [46, 11, 1], [35, 3, 1], [23, 9, 1]]) {
    g.disc(sx, sy, r, '#f8ecd0');
    g.set(sx - 1, sy - 1, '#ffffff');
  }
  // Hanging bunches of dried caps from the cap's lip.
  for (const hx of [10, 26, 43]) {
    g.rect(hx, 16, 1, 3, '#6a4a28');
    g.oval(hx, 20, 2, 1, '#e0c898');
  }
  g.outline(OUT_WARM);
  return g.rows();
}
function burrowDoor() {
  const g = new Grid(32, 34);
  // A mound of stone and earth around a round door.
  g.oval(16, 20, 15, 14, '#6a5c54');
  g.oval(16, 19, 14, 13, '#8a7b72');
  for (let y = 8; y < 30; y += 4) for (let x = 3 + ((y / 4) % 2) * 3; x < 30; x += 6) g.rect(x, y, 5, 1, '#6a5c54');
  g.rect(0, 30, 32, 4, null);
  g.rect(2, 30, 28, 2, '#a89888');
  g.rect(2, 32, 28, 1, '#6a5c54');
  // Moss on top.
  g.oval(14, 7, 8, 2, '#5f7a4a');
  g.oval(20, 8, 5, 1, '#86a864');
  // The door.
  g.disc(16, 19, 10, '#4a3a30');
  g.disc(16, 19, 9, '#8a5a32');
  g.rect(7, 19, 18, 11, '#8a5a32');
  g.rect(6, 19, 20, 12, null);
  g.rect(7, 19, 18, 11, '#8a5a32');
  for (const x of [10, 14, 18, 22]) g.rect(x, 10, 1, 20, '#6a4424');
  g.rect(8, 11, 1, 18, '#b8845a');
  g.rect(7, 16, 18, 2, IRON[1]);
  g.rect(7, 24, 18, 2, IRON[1]);
  g.rect(7, 16, 18, 1, IRON[2]);
  g.disc(21, 21, 1, '#f0c050');
  g.set(21, 20, '#fff0a0');
  // A little lamp over it and a doormat.
  g.rect(15, 5, 2, 3, IRON[1]);
  g.rect(14, 8, 4, 3, '#ffc866');
  g.set(15, 9, '#fff6c0');
  g.rect(9, 30, 14, 2, '#c8503a');
  g.rect(9, 30, 14, 1, '#e0705a');
  g.outline(OUT_WARM);
  return g.rows();
}
function townSignpost() {
  const g = new Grid(20, 32);
  g.rect(9, 3, 3, 28, '#8a5a38');
  g.rect(9, 3, 1, 28, '#c89a64');
  g.rect(7, 30, 7, 2, '#6a4424');
  const board = (y, dir, color, icon) => {
    const x0 = dir > 0 ? 3 : 1;
    g.rect(x0, y, 15, 6, color);
    g.rect(x0, y, 15, 1, '#e8c898');
    g.rect(x0, y + 5, 15, 1, '#6a4424');
    if (dir > 0) { g.set(x0 + 15, y + 2, color); g.set(x0 + 15, y + 3, color); g.set(x0 + 16, y + 2, color); }
    else { g.set(x0 - 1, y + 2, color); g.set(x0 - 1, y + 3, color); g.set(x0 - 2, y + 2, color); }
    const ix = x0 + (dir > 0 ? 3 : 6);
    icon(ix, y + 2);
    g.rect(ix + 4, y + 3, 5, 1, '#6a4424');
  };
  board(4, 1, '#c89a64', (x, y) => { g.rect(x, y + 2, 4, 1, '#4a4a56'); g.rect(x + 1, y, 2, 2, '#4a4a56'); });
  board(12, -1, '#b88452', (x, y) => { g.rect(x, y + 1, 4, 2, '#f2e8d0'); g.rect(x, y, 4, 1, '#d8503a'); });
  board(20, 1, '#c89a64', (x, y) => { g.rect(x, y, 4, 2, '#fffdf2'); g.rect(x, y + 2, 4, 1, '#6a8ad0'); });
  g.outline(OUT_WARM);
  return g.rows();
}
function townNoticeboard() {
  const g = new Grid(34, 32);
  for (const x of [3, 28]) { g.rect(x, 8, 3, 23, '#8a5a38'); g.rect(x, 8, 1, 23, '#c89a64'); }
  g.rect(1, 3, 32, 4, '#6a4424');
  g.rect(0, 4, 34, 2, '#8a5a38');
  g.rect(3, 7, 28, 16, '#c89a64');
  g.rect(4, 8, 26, 14, '#e0c08a');
  const notes = [[6, 9, 6, 5, '#fffdf2'], [14, 10, 5, 6, '#f8e8a0'], [21, 9, 6, 5, '#fffdf2'], [7, 16, 5, 5, '#f4c8d0'], [15, 17, 6, 4, '#fffdf2'], [23, 16, 5, 5, '#c8e8f4']];
  for (const [nx, ny, nw, nh, c] of notes) {
    g.rect(nx, ny, nw, nh, c);
    g.rect(nx + 1, ny + 1, nw - 3, 1, '#6a4a28');
    g.rect(nx + 1, ny + 3, nw - 2, 1, '#8a6a48');
    g.set(nx + Math.floor(nw / 2), ny - 1 < 0 ? 0 : ny, '#d83a3a');
  }
  g.rect(4, 22, 26, 1, '#a8703a');
  g.rect(3, 23, 28, 2, '#8a5a38');
  // A little roof of moss-grown shingle.
  g.rect(0, 1, 34, 3, '#5f7a4a');
  g.rect(2, 0, 30, 2, '#86a864');
  g.outline(OUT_WARM);
  return g.rows();
}
const CLOTH = ['#a8322e', '#c8503a', '#e0705a'];
const FONT = {
  W: ['10001', '10001', '10101', '10101', '01010'],
  E: ['111', '100', '110', '100', '111'],
  L: ['100', '100', '100', '100', '111'],
  C: ['011', '100', '100', '100', '011'],
  O: ['010', '101', '101', '101', '010'],
  M: ['10001', '11011', '10101', '10001', '10001'],
};
function bannerText(g, text, x, y, color, shadow, wave) {
  for (const ch of text) {
    const glyph = FONT[ch];
    glyph.forEach((row, j) => [...row].forEach((bit, i) => {
      if (bit === '1') {
        const dy = wave ? Math.round(Math.sin((x + i) * 0.5) * wave) : 0;
        g.set(x + i, y + j + dy, color);
        g.set(x + i + 1, y + j + dy + 1, shadow);
      }
    }));
    x += glyph[0].length + 1;
  }
}
function welcomeBanner(frame, text = 'WELCOME') {
  const g = new Grid(66, 38);
  for (const x of [1, 62]) {
    g.rect(x, 2, 3, 35, '#8a5a38');
    g.rect(x, 2, 1, 35, '#c89a64');
    g.disc(x + 1, 2, 2, '#f0c050');
  }
  g.rect(3, 3, 60, 2, '#6a4424');
  // The cloth, hanging in a gentle wave.
  for (let x = 4; x < 62; x++) {
    const wave = Math.round(Math.sin(x * 0.28 + frame * 1.6) * 1.2);
    const top = 5 + wave;
    const bottom = 25 + wave + (x % 6 < 3 ? 2 : 0);
    g.rect(x, top, 1, bottom - top, x % 12 < 6 ? CLOTH[1] : CLOTH[0]);
    g.set(x, top, CLOTH[2]);
    g.set(x, bottom - 1, '#7a1c1c');
    g.set(x, top + 1, '#f0c050');
    g.set(x, bottom - 3, '#f0c050');
  }
  // Centred on the cloth (61 wide at most; each letter is 3 or 5 and a gap).
  const textWidth = [...text].reduce((w, ch) => w + FONT[ch][0].length + 1, -1);
  bannerText(g, text, 4 + Math.round((58 - textWidth) / 2), 11 + (frame ? 0 : 0), '#ffe9a8', '#7a1c1c', 0.6);
  // Tassels.
  for (const x of [8, 32, 56]) {
    const wave = Math.round(Math.sin(x * 0.28 + frame * 1.6) * 1.2);
    g.rect(x, 27 + wave, 1, 4, '#f0c050');
    g.rect(x - 1, 31 + wave, 3, 2, '#d8a030');
  }
  g.outline(OUT_WARM);
  return g.rows();
}
function townBarrels() {
  const g = new Grid(34, 26);
  const barrel = (cx, by, w, h) => {
    const x0 = cx - Math.floor(w / 2);
    g.rect(x0, by - h, w, h, '#a8764a');
    for (let c = 0; c < w; c += 3) g.rect(x0 + c, by - h, 1, h, '#8a5a38');
    g.rect(x0, by - h, 2, h, '#c89a64');
    g.rect(x0 + w - 2, by - h, 2, h, '#7a4a2a');
    g.oval(cx, by - h, Math.floor(w / 2), 2, '#c89a64');
    g.oval(cx, by - h, Math.floor(w / 2) - 2, 1, '#e0b884');
    for (const hy of [by - h + 3, by - 3]) { g.rect(x0, hy, w, 1, IRON[1]); g.rect(x0 + 1, hy, 3, 1, IRON[2]); }
    g.oval(cx, by, Math.floor(w / 2) - 1, 1, '#6a4424');
  };
  barrel(9, 24, 14, 13);
  barrel(25, 24, 14, 13);
  barrel(17, 14, 13, 12);
  g.outline(OUT_WARM);
  return g.rows();
}
function townCrates() {
  const g = new Grid(34, 28);
  const crate = (x0, y0, w, h, c) => {
    g.rect(x0, y0, w, h, c[0]);
    g.rect(x0, y0, w, 2, c[1]);
    g.rect(x0, y0 + h - 2, w, 2, c[2]);
    g.rect(x0, y0, 2, h, c[2]);
    g.rect(x0 + w - 2, y0, 2, h, c[2]);
    g.line(x0 + 2, y0 + 2, x0 + w - 3, y0 + h - 3, c[2]);
    g.line(x0 + 2, y0 + h - 3, x0 + w - 3, y0 + 2, c[2]);
  };
  const wood = [['#b88452', '#d8a468', '#7a4a2a'], ['#a8764a', '#c89a64', '#6a4424']];
  crate(1, 12, 15, 15, wood[0]);
  crate(17, 14, 15, 13, wood[1]);
  crate(6, 0, 14, 12, wood[1]);
  // A sack of flour beside, tied at the neck.
  g.oval(28, 12, 4, 4, '#e8dcc0');
  g.rect(26, 8, 5, 2, '#d8cca8');
  g.rect(27, 7, 3, 1, '#8a5a32');
  g.set(27, 12, '#b8a880');
  g.outline(OUT_WARM);
  return g.rows();
}
function townWell() {
  const g = new Grid(34, 38);
  // Stone ring.
  g.oval(17, 30, 15, 6, '#6a5c54');
  g.rect(2, 24, 30, 7, '#8a7b72');
  g.oval(17, 24, 15, 5, '#a89888');
  g.oval(17, 24, 11, 3, '#1c3a48');
  g.oval(17, 25, 9, 2, '#245c6c');
  g.rect(8, 24, 4, 1, '#4a8a9a');
  for (let x = 3; x < 31; x += 6) g.rect(x, 26, 5, 1, '#6a5c54');
  for (let y = 27; y < 31; y += 3) for (let x = 3 + ((y % 2) * 3); x < 31; x += 7) g.rect(x, y, 6, 1, '#6a5c54');
  g.rect(3, 25, 7, 1, '#b8a890');
  // Posts and a little roof of moss.
  for (const x of [4, 28]) { g.rect(x, 8, 2, 19, '#8a5a38'); g.rect(x, 8, 1, 19, '#c89a64'); }
  g.rect(2, 5, 30, 4, '#6a4424');
  g.rect(0, 7, 34, 2, '#8a5a38');
  g.rect(2, 3, 30, 3, '#5f7a4a');
  g.rect(5, 1, 24, 3, '#86a864');
  g.rect(12, 0, 10, 2, '#a4c880');
  // Beam, rope and bucket.
  g.rect(5, 12, 24, 2, '#8a5a38');
  g.rect(16, 14, 1, 8, '#d8c090');
  g.rect(13, 21, 7, 5, '#a8764a');
  g.rect(13, 21, 7, 1, '#c89a64');
  g.rect(13, 23, 7, 1, IRON[1]);
  // Mushrooms at the foot.
  g.rect(30, 32, 2, 3, '#f2e8d0');
  g.oval(31, 31, 3, 2, '#d8502e');
  g.set(30, 30, '#fffbe8');
  g.outline(OUT_WARM);
  return g.rows();
}
function heroStatueOld() {
  const g = new Grid(34, 60);
  const S = ['#4a4048', '#6a5c64', '#8a7b82', '#a89aa0'];
  // Plinth.
  g.rect(3, 50, 28, 9, S[1]);
  g.rect(3, 50, 28, 2, S[3]);
  g.rect(3, 57, 28, 2, S[0]);
  g.rect(6, 44, 22, 7, S[2]);
  g.rect(6, 44, 22, 1, S[3]);
  g.rect(6, 50, 22, 1, S[0]);
  g.rect(8, 53, 18, 1, S[0]);
  // Cloak and legs.
  g.rect(11, 22, 13, 23, S[1]);
  g.rect(11, 22, 4, 23, S[2]);
  g.rect(21, 22, 3, 23, S[0]);
  g.rect(13, 36, 1, 8, S[0]);
  g.rect(18, 38, 1, 6, S[0]);
  g.rect(10, 43, 15, 2, S[0]);
  // Body and belt.
  g.rect(12, 14, 11, 10, S[2]);
  g.rect(12, 14, 3, 10, S[3]);
  g.rect(20, 14, 3, 10, S[1]);
  g.rect(11, 24, 13, 2, S[0]);
  g.set(17, 25, S[3]);
  // The raised arm (right), and a sword broken off at the middle.
  g.rect(23, 9, 3, 8, S[2]);
  g.rect(23, 9, 1, 8, S[3]);
  g.rect(25, 3, 3, 7, S[2]);
  g.rect(24, 1, 5, 2, S[1]);
  g.rect(26, -0, 1, 1, S[1]);
  g.rect(26, 3, 1, 1, S[3]);
  // The other arm gone at the elbow; a stump.
  g.rect(8, 15, 4, 6, S[1]);
  g.rect(8, 15, 1, 4, S[0]);
  // Head: chipped, one side sheared.
  g.oval(17, 8, 4, 5, S[2]);
  g.oval(16, 7, 3, 4, S[3]);
  g.rect(17, 5, 5, 8, null);
  g.rect(17, 6, 4, 6, S[1]);
  g.rect(21, 4, 2, 4, null);
  g.rect(14, 8, 2, 1, S[0]);
  g.rect(13, 13, 8, 2, S[1]);
  // Moss and cracks.
  for (const [mx, my, mw] of [[11, 29, 4], [20, 40, 4], [8, 47, 6], [4, 55, 5], [12, 13, 3], [22, 47, 5]]) {
    g.rect(mx, my, mw, 2, '#5f7a4a');
    g.rect(mx, my, Math.max(1, mw - 2), 1, '#86a864');
  }
  g.line(16, 18, 14, 24, S[0]);
  g.line(14, 24, 15, 30, S[0]);
  g.line(21, 44, 22, 50, S[0]);
  // Rubble at the foot.
  g.rect(0, 56, 3, 3, S[1]);
  g.rect(31, 57, 3, 2, S[2]);
  g.rect(27, 4, 0, 0, null);
  // A fallen piece of the sword on the plinth.
  g.rect(22, 42, 6, 1, S[3]);
  g.outline(OUT_WARM);
  return g.rows();
}
// The mural of the Hero's visit: a fresco, warm and faded, in a carved frame.
// The Hero stands on the great stair with the dark below; behind them, very
// small and the colour of the plaster, someone carries a lantern.
function muralVisit() {
  const W = 96;
  const H = 52;
  const g = new Grid(W, H);
  // Frame.
  g.rect(0, 0, W, H, '#4e4038');
  g.rect(1, 1, W - 2, H - 2, '#a89888');
  g.rect(3, 3, W - 6, H - 6, '#6a5c54');
  // Painted wall: a dawn sky fading from gold to deep rose at the bottom.
  const sky = ['#f2d890', '#ecc984', '#e0b478', '#cc9c70', '#b0846a', '#8a6a5e', '#5e4a4e'];
  for (let y = 4; y < H - 4; y++) {
    const t = (y - 4) / (H - 8);
    g.rect(4, y, W - 8, 1, sky[Math.min(sky.length - 1, Math.floor(t * sky.length))]);
  }
  // Sun and rays.
  g.disc(66, 14, 6, '#fff0b0');
  g.disc(66, 14, 4, '#fffbe0');
  for (let a = 0; a < 12; a++) {
    const ang = (a / 12) * Math.PI * 2;
    g.line(66 + Math.cos(ang) * 8, 14 + Math.sin(ang) * 8, 66 + Math.cos(ang) * 14, 14 + Math.sin(ang) * 14, '#f6dc8c');
  }
  // The stair, climbing left to right.
  for (let i = 0; i < 8; i++) {
    const x0 = 6 + i * 9;
    const y0 = H - 6 - i * 3;
    g.rect(x0, y0, 12, 3, '#cdb48a');
    g.rect(x0, y0, 12, 1, '#e8d4a8');
    g.rect(x0, y0 + 3, 12, H - 4 - y0 - 3, '#8a6a5e');
    g.rect(x0, y0 + 3, 1, H - 4 - y0 - 3, '#6a5048');
  }
  // The dark below: a roil of black shapes along the bottom with pale eyes.
  for (let x = 4; x < W - 4; x++) {
    const h = 6 + Math.round(Math.sin(x * 0.35) * 2 + Math.sin(x * 0.11) * 3) + Math.max(0, 8 - Math.floor(x / 8));
    g.rect(x, H - 4 - h, 1, h, '#1e1620');
    g.set(x, H - 5 - h, '#3a2c3a');
  }
  for (const [ex, ey] of [[12, 40], [20, 38], [34, 41], [47, 40], [9, 33]]) { g.set(ex, ey, '#e8d8a0'); g.set(ex + 2, ey, '#e8d8a0'); }
  // The Hero: a tall cloaked figure on the high steps, sword raised to the sun.
  const hx = 58;
  const hy = H - 6 - 6 * 3;
  g.rect(hx - 3, hy - 18, 7, 18, '#2c4a7a');
  g.rect(hx - 3, hy - 18, 2, 18, '#4a6aa0');
  g.rect(hx + 2, hy - 18, 2, 18, '#1e3458');
  g.rect(hx - 4, hy - 4, 9, 4, '#2c4a7a');
  g.disc(hx, hy - 21, 3, '#e8c8a0');
  g.rect(hx - 3, hy - 25, 7, 3, '#7a5a3a');
  g.rect(hx + 3, hy - 22, 3, 2, '#c8503a');
  g.rect(hx + 3, hy - 32, 2, 12, '#e8e8f0');
  g.rect(hx + 3, hy - 32, 1, 12, '#ffffff');
  g.rect(hx + 1, hy - 19, 3, 2, '#e8c8a0');
  g.rect(hx + 2, hy - 20, 5, 1, '#e8c8a0');
  // Behind them and lower, tiny and almost lost: someone with a lantern.
  const fx = 33;
  const fy = H - 6 - 3 * 3;
  g.rect(fx, fy - 6, 3, 6, '#9a7c62');
  g.rect(fx, fy - 8, 3, 2, '#8e7058');
  g.rect(fx + 3, fy - 5, 1, 1, '#a89060');
  g.set(fx + 4, fy - 4, '#b09a58');
  // Carved frame corners and ornament.
  for (const [cx, cy] of [[1, 1], [W - 4, 1], [1, H - 4], [W - 4, H - 4]]) g.rect(cx, cy, 3, 3, '#cdb48a');
  for (let x = 6; x < W - 6; x += 6) { g.set(x, 2, '#cdb48a'); g.set(x, H - 3, '#cdb48a'); }
  g.outline(OUT_WARM);
  return g.rows();
}
function muralEnd() {
  const g = new Grid(18, 52);
  g.rect(0, 0, 18, 52, '#4e4038');
  g.rect(1, 1, 16, 50, '#a89888');
  g.rect(3, 3, 12, 46, '#8a7b72');
  g.rect(3, 3, 2, 46, '#a89888');
  g.rect(13, 3, 2, 46, '#6a5c54');
  for (let y = 8; y < 48; y += 8) { g.rect(5, y, 8, 1, '#6a5c54'); g.rect(5, y + 1, 8, 1, '#b8a890'); }
  g.rect(5, 3, 8, 3, '#cdb48a');
  g.rect(5, 46, 8, 3, '#cdb48a');
  g.rect(7, 22, 4, 4, '#cdb48a');
  g.rect(8, 23, 2, 2, '#6a5c54');
  g.outline(OUT_WARM);
  return g.rows();
}

// --- Everything ---------------------------------------------------------
const crystals = {};
const sets = { teal: ['pink', 'violet'], pink: ['violet', 'gold'], violet: ['teal', 'pink'], gold: ['pink', 'teal'] };
for (const [hue, [a, b]] of Object.entries(sets)) {
  crystals[`crystal_${hue}_s`] = crystalSmall(hue, a);
  crystals[`crystal_${hue}_l`] = crystalLarge(hue, a, b);
}

export const BRIGHT_PROP_SPRITES = {
  // Sunnyside
  daisy_patch: flowerPatch('daisy'),
  buttercups: flowerPatch('buttercup'),
  picket_fence: picketFence(),
  meadow_gate: meadowGate(false),
  meadow_gate_open: meadowGate(true),
  scarecrow: scarecrow(0),
  haystack: haystack(),
  picnic_blanket: picnicBlanket(),
  bridge_plank: bridgePlank(),
  butterflies: butterflies(0),
  lemonade_stand: lemonadeStand(0),
  // The Glimmering
  ...crystals,
  crystal_bloom: crystalBloom(false),
  // The singing crystals of the King's Road: dull, then lit one hue each.
  singing_a: singingCrystal(16, 'dull'),
  singing_b: singingCrystal(22, 'dull'),
  singing_c: singingCrystal(28, 'dull'),
  singing_d: singingCrystal(34, 'dull'),
  singing_a_on: singingCrystal(16, 'teal'),
  singing_b_on: singingCrystal(22, 'violet'),
  singing_c_on: singingCrystal(28, 'pink'),
  singing_d_on: singingCrystal(34, 'gold'),
  sealed_geode: sealedGeode(),
  stave_stone: staveStone(),
  glowcap_giant: glowcapGiant(),
  glowcap_big: glowcap(34, 42, 'teal', { stemW: 8 }),
  glowcap_small: glowcap(16, 16, 'pink'),
  glowcap_tall: glowcap(16, 26, 'violet', { stemW: 3 }),
  glowcap_trio: glowcapTrio(),
  glow_moss: glowMoss(0),
  crystal_pool: crystalPool(0),
  // Belowtown
  glowworm_lamp: glowwormLamp(1),
  glowworm_string: glowwormString(0),
  mushroom_stall: mushroomStall(),
  burrow_door: burrowDoor(),
  town_signpost: townSignpost(),
  town_noticeboard: townNoticeboard(),
  welcome_banner: welcomeBanner(0),
  // Belowtown's own spelling of it (the gate).
  wellcome_banner: welcomeBanner(0, 'WELLCOME'),
  town_barrels: townBarrels(),
  town_crates: townCrates(),
  town_well: townWell(),
  hero_statue_old: heroStatueOld(),
  mural_visit: muralVisit(),
  mural_end: muralEnd(),
};

function glowcapTrio() {
  const g = new Grid(34, 20);
  const parts = [[0, 4, 14, 14, 'teal'], [10, 0, 14, 20, 'violet'], [22, 6, 12, 14, 'pink']];
  for (const [x, y, w, h, hue] of parts) g.paste(glowcapGrid(w, h, hue), x, y);
  return g.rows();
}
// glowcap() builds rows; the trio needs the grid itself.
function glowcapGrid(w, h, hue) {
  const rows = glowcap(w, h, hue, { spots: w > 11 });
  const g = new Grid(w, h);
  const byChar = Object.fromEntries(Object.entries(palette));
  rows.forEach((row, y) => [...row].forEach((c, x) => { if (c !== '.') g.set(x, y, byChar[c]); }));
  return g;
}

// Moving props: frames of the same size, and the palette to play them with.
export const BRIGHT_PALETTE_EXTRA = palette;
export const BUTTERFLIES_PALETTE = palette;
export const BUTTERFLIES_SPRITES = { f1: butterflies(0), f2: butterflies(1), f3: butterflies(2), f4: butterflies(3) };
export const SCARECROW_PALETTE = palette;
export const SCARECROW_SPRITES = { still: scarecrow(0), flutter: scarecrow(1) };
export const LEMONADE_STAND_PALETTE = palette;
export const LEMONADE_STAND_SPRITES = { flap1: lemonadeStand(0), flap2: lemonadeStand(1) };
export const CRYSTAL_BLOOM_PALETTE = palette;
export const CRYSTAL_BLOOM_SPRITES = { glint1: crystalBloom(false), glint2: crystalBloom(true) };
export const GLOW_MOSS_PALETTE = palette;
export const GLOW_MOSS_SPRITES = { twinkle1: glowMoss(0), twinkle2: glowMoss(1) };
export const CRYSTAL_POOL_PALETTE = palette;
export const CRYSTAL_POOL_SPRITES = { ripple1: crystalPool(0), ripple2: crystalPool(1), ripple3: crystalPool(2) };
export const GLOWWORM_LAMP_PALETTE = palette;
export const GLOWWORM_LAMP_SPRITES = { dim: glowwormLamp(0), glow: glowwormLamp(1), bright: glowwormLamp(2), glow2: glowwormLamp(1) };
export const GLOWWORM_STRING_PALETTE = palette;
export const GLOWWORM_STRING_SPRITES = { twinkle1: glowwormString(0), twinkle2: glowwormString(1), twinkle3: glowwormString(2) };
export const WELCOME_BANNER_PALETTE = palette;
export const WELCOME_BANNER_SPRITES = { wave1: welcomeBanner(0), wave2: welcomeBanner(1), wave3: welcomeBanner(2) };
export const WELLCOME_BANNER_PALETTE = palette;
export const WELLCOME_BANNER_SPRITES = { wave1: welcomeBanner(0, 'WELLCOME'), wave2: welcomeBanner(1, 'WELLCOME'), wave3: welcomeBanner(2, 'WELLCOME') };

// How many tiles wide each big one stands.
export const BRIGHT_FOOTPRINTS = {
  meadow_gate: 2,
  meadow_gate_open: 2,
  haystack: 2,
  picnic_blanket: 2,
  lemonade_stand: 3,
  crystal_teal_l: 2,
  crystal_pink_l: 2,
  crystal_violet_l: 2,
  crystal_gold_l: 2,
  crystal_bloom: 3,
  glowcap_giant: 4,
  glowcap_big: 2,
  glowcap_trio: 2,
  crystal_pool: 2,
  glowworm_string: 3,
  mushroom_stall: 4,
  burrow_door: 2,
  town_noticeboard: 2,
  welcome_banner: 4,
  wellcome_banner: 4,
  town_barrels: 2,
  town_crates: 2,
  town_well: 2,
  hero_statue_old: 2,
  mural_visit: 6,
  mural_end: 1,
};

// What glows. Each light is placed from the middle of the prop's foot (up is
// negative), like the lights in lamplight.js.
const TEAL = '90, 240, 220';
const PINK = '255, 120, 200';
const VIOLET = '170, 130, 255';
const GOLD = '255, 214, 110';
const LAMP = '255, 200, 110';
const crystalGlow = (color, big) => (big
  ? [{ dy: -16, bloom: 18, strength: 0.6, flicker: 0.2, color }, { dy: -4, pool: 70, strength: 0.55, flicker: 0.1, color }]
  : [{ dy: -10, bloom: 12, strength: 0.55, flicker: 0.2, color }, { dy: -2, pool: 48, strength: 0.48, flicker: 0.1, color }]);
export const BRIGHT_GLOWS = {
  crystal_teal_s: crystalGlow(TEAL, false),
  crystal_pink_s: crystalGlow(PINK, false),
  crystal_violet_s: crystalGlow(VIOLET, false),
  crystal_gold_s: crystalGlow(GOLD, false),
  crystal_teal_l: crystalGlow(TEAL, true),
  crystal_pink_l: crystalGlow(PINK, true),
  crystal_violet_l: crystalGlow(VIOLET, true),
  crystal_gold_l: crystalGlow(GOLD, true),
  singing_a_on: crystalGlow(TEAL, false),
  singing_b_on: crystalGlow(VIOLET, false),
  singing_c_on: crystalGlow(PINK, true),
  singing_d_on: crystalGlow(GOLD, true),
  crystal_bloom: [
    { dx: -10, dy: -14, bloom: 18, strength: 0.55, flicker: 0.2, color: PINK },
    { dx: 10, dy: -14, bloom: 18, strength: 0.55, flicker: 0.2, color: VIOLET },
    { dy: -22, bloom: 22, strength: 0.6, flicker: 0.2, color: TEAL },
    { dy: -4, pool: 110, strength: 0.6, flicker: 0.1, color: TEAL },
  ],
  glowcap_giant: [
    { dy: -40, bloom: 30, strength: 0.5, flicker: 0.1, color: VIOLET },
    { dy: -8, pool: 120, strength: 0.6, flicker: 0.08, color: VIOLET },
    { dy: -2, pool: 70, strength: 0.4, flicker: 0.1, color: TEAL },
  ],
  glowcap_big: [{ dy: -26, bloom: 18, strength: 0.5, flicker: 0.1, color: TEAL }, { dy: -4, pool: 70, strength: 0.5, flicker: 0.08, color: TEAL }],
  glowcap_small: [{ dy: -8, bloom: 8, strength: 0.45, flicker: 0.15, color: PINK }, { dy: -2, pool: 36, strength: 0.4, flicker: 0.1, color: PINK }],
  glowcap_tall: [{ dy: -16, bloom: 9, strength: 0.45, flicker: 0.15, color: VIOLET }, { dy: -2, pool: 40, strength: 0.4, flicker: 0.1, color: VIOLET }],
  glowcap_trio: [
    { dx: -10, dy: -8, bloom: 8, strength: 0.4, flicker: 0.15, color: TEAL },
    { dx: 0, dy: -12, bloom: 9, strength: 0.4, flicker: 0.15, color: VIOLET },
    { dx: 11, dy: -7, bloom: 8, strength: 0.4, flicker: 0.15, color: PINK },
    { dy: -2, pool: 62, strength: 0.42, flicker: 0.1, color: VIOLET },
  ],
  glow_moss: [{ dy: -2, pool: 38, strength: 0.35, flicker: 0.1, color: TEAL }],
  crystal_pool: [{ dy: -8, bloom: 20, strength: 0.3, flicker: 0.15, color: '110, 220, 255' }, { dy: -6, pool: 80, strength: 0.55, flicker: 0.1, color: '110, 220, 255' }],
  // (The glow-worms brighten a little with Belowtown's song: `sings`.)
  glowworm_lamp: [
    { dx: 4, dy: -20, bloom: 12, strength: 0.7, flicker: 0.25, color: LAMP, sings: true },
    { dx: 4, dy: -8, pool: 60, strength: 0.58, flicker: 0.15, color: LAMP },
  ],
  glowworm_string: [-18, -9, 0, 9, 18].map((dx) => ({ dx, dy: -6, bloom: 9, strength: 0.6, flicker: 0.3, color: LAMP, sings: true }))
    .concat([{ dy: 4, pool: 90, strength: 0.42, flicker: 0.15, color: LAMP }]),
  mushroom_stall: [{ dy: -16, pool: 64, strength: 0.42, flicker: 0.12, color: '255, 160, 110' }],
  burrow_door: [{ dy: -10, pool: 44, strength: 0.4, flicker: 0.2, color: LAMP }, { dy: -24, bloom: 8, strength: 0.6, flicker: 0.25, color: LAMP }],
  town_well: [{ dy: -10, pool: 46, strength: 0.25, flicker: 0.1, color: '255, 190, 120' }],
};
