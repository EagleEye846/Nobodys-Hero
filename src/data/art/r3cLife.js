// Round 3 (fun check) props for chapter 4's dullest rooms (15 November 2026): the Long Rope's
// leaving gifts, the Hall's trodden party things, the Deep's left-behind comforts, the Glimmering's
// tea-party pieces. Drawn like lanesLife.js: rows of characters from a small painter, 16 pixels to a
// tile, standing on the bottom edge. Every id starts `r3c_`. Nothing here hangs in the air.
//
//   r3c_parcel r3c_flask r3c_paper_crown r3c_handbell r3c_top_hat r3c_rope_loop r3c_spoon_pot
//   r3c_glove r3c_log_pile r3c_step_lamp r3c_cup_row r3c_journal r3c_hammock (2 wide)
//   r3c_crystal_cups r3c_sock r3c_jar_lights (animated)
//   flat: r3c_chalk_line r3c_boot_print r3c_chalk_arrow

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xd600 + colors.size);
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
    return this;
  }
  rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c); return this; }
  line(x0, y0, x1, y1, c) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) this.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c);
    return this;
  }
  disc(cx, cy, rx, ry, c) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) this.set(x, y, c);
      }
    }
  }
  outline(c = INK) {
    const at = (x, y) => x >= 0 && y >= 0 && x < this.w && y < this.h && this.cells[y][x];
    const pts = [];
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      if (!at(x, y) && (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1))) pts.push([x, y]);
    }
    for (const [x, y] of pts) this.set(x, y, c);
    return this;
  }
  rows() { return this.cells.map((row) => row.map((c) => (c ? char(c) : '.')).join('')); }
}

const INK = '#12101a';
const frames2 = (fn) => ({ a: fn(0), b: fn(1) });

// A parcel tied with string, a paper label on top.
function parcel() {
  const g = new Grid(16, 16);
  g.rect(3, 8, 10, 6, '#b08a58').rect(3, 8, 10, 1, '#d0aa72').rect(3, 13, 10, 1, '#80603a');
  g.rect(7, 8, 2, 6, '#e8e0c8');
  g.rect(3, 10, 10, 1, '#e8e0c8');
  g.set(6, 7, '#e8e0c8'); g.set(7, 6, '#e8e0c8'); g.set(9, 7, '#e8e0c8'); g.set(10, 6, '#e8e0c8');
  g.rect(9, 11, 3, 2, '#f4efe0').set(10, 12, '#9a4a4a');
  return g.outline().rows();
}

// A tea flask with a cup for a lid and a spoon tied to it.
function flask() {
  const g = new Grid(16, 16);
  g.rect(5, 5, 6, 9, '#6a7a90').rect(5, 5, 2, 9, '#8a9ab0').rect(9, 5, 2, 9, '#4a5a70');
  g.rect(5, 3, 6, 2, '#a05a3a').rect(6, 2, 4, 1, '#c07a50');
  g.rect(5, 8, 6, 1, '#d8c890');
  g.line(12, 5, 13, 12, '#c0c4cc');
  return g.outline().rows();
}

// A little crown folded out of paper.
function paperCrown() {
  const g = new Grid(16, 16);
  g.rect(4, 10, 8, 4, '#e8dcb8').rect(4, 10, 8, 1, '#f8f0d4').rect(4, 13, 8, 1, '#b8a880');
  g.set(4, 9, '#e8dcb8'); g.set(4, 8, '#e8dcb8'); g.set(7, 9, '#e8dcb8'); g.set(8, 9, '#e8dcb8'); g.set(11, 9, '#e8dcb8'); g.set(11, 8, '#e8dcb8');
  g.set(8, 8, '#e8dcb8');
  g.set(6, 12, '#c04a4a'); g.set(9, 12, '#4a7ac0');
  g.rect(2, 14, 12, 1, '#7a7a88');
  return g.outline().rows();
}

// The herald's handbell on its side, its handle in the air.
function handbell() {
  const g = new Grid(16, 16);
  g.disc(8, 11, 5, 3.4, '#d8b040'); g.rect(3, 11, 10, 3, '#d8b040');
  g.rect(3, 13, 10, 1, '#a07820'); g.disc(8, 10, 3.4, 1.6, '#f4d878');
  g.rect(7, 4, 2, 4, '#7a4a2a').rect(6, 3, 4, 1, '#9a6a3a');
  g.set(12, 14, '#c0a060'); g.set(13, 14, '#c0a060');
  return g.outline().rows();
}

// A flattened tall paper hat with a feather.
function topHat() {
  const g = new Grid(16, 16);
  g.rect(3, 12, 10, 2, '#4a4a68').rect(5, 8, 6, 4, '#6a6a8a').rect(5, 8, 6, 1, '#8a8aaa');
  g.rect(3, 13, 10, 1, '#3a3a50');
  g.rect(5, 11, 6, 1, '#c04a5a');
  g.line(10, 8, 13, 4, '#7ad0a0'); g.line(11, 8, 14, 5, '#a0f0c0');
  g.set(7, 10, '#f0f0f0'); g.set(8, 10, '#f0f0f0');
  return g.outline().rows();
}

// A short loop of rope, a knot at each end.
function ropeLoop() {
  const g = new Grid(16, 16);
  g.disc(8, 10, 5.4, 3.6, '#9a7a4a'); g.disc(8, 10, 3.2, 1.8, null);
  g.disc(8, 10, 5.4, 3.6, '#9a7a4a');
  g.disc(8, 10, 3.2, 1.8, null);
  for (let a = 0; a < 12; a++) {
    const t = (a / 12) * Math.PI * 2;
    g.set(8 + Math.cos(t) * 4.4, 10 + Math.sin(t) * 2.7, a % 2 ? '#c4a470' : '#7a5a30');
  }
  g.rect(12, 7, 3, 3, '#7a5a30').set(13, 8, '#c4a470');
  g.rect(1, 11, 3, 3, '#7a5a30').set(2, 12, '#c4a470');
  return g.outline().rows();
}

// A tin pot with its lid tied on and a spoon stood in the knot.
function spoonPot() {
  const g = new Grid(16, 16);
  g.disc(8, 11, 5, 3.4, '#4a4a58'); g.rect(3, 9, 10, 4, '#4a4a58');
  g.rect(3, 9, 2, 4, '#6a6a7a').rect(11, 9, 2, 4, '#323240');
  g.rect(3, 8, 10, 1, '#8a8a9a');
  g.disc(8, 8, 3.4, 1.2, '#7a7a8a');
  g.rect(8, 3, 1, 5, '#b8bcc8'); g.set(8, 3, '#d8dce8'); g.rect(7, 2, 3, 1, '#b8bcc8');
  g.rect(4, 11, 8, 1, '#c0a470');
  return g.outline().rows();
}

// One woollen glove with the fingertips cut off, hung on a stone spike.
function glove() {
  const g = new Grid(16, 16);
  g.rect(7, 11, 4, 3, '#6a5a50').rect(6, 13, 6, 1, '#4a3a30');
  g.rect(6, 5, 6, 6, '#c0504a').rect(6, 5, 2, 6, '#e06a60').rect(10, 5, 2, 6, '#903a3a');
  g.rect(5, 6, 1, 3, '#c0504a');
  g.set(6, 4, '#c0504a'); g.set(8, 4, '#c0504a'); g.set(10, 4, '#c0504a');
  g.rect(6, 10, 6, 1, '#e8d8b0');
  return g.outline().rows();
}

// A neat stack of split logs, the ends square.
function logPile() {
  const g = new Grid(16, 16);
  const logs = [[2, 12], [6, 12], [10, 12], [4, 9], [8, 9], [6, 6]];
  for (const [x, y] of logs) {
    g.rect(x, y, 4, 3, '#a08058'); g.rect(x, y, 4, 1, '#c0a070');
    g.disc(x + 3, y + 1, 1.2, 1.2, '#d8c090'); g.set(x + 3, y + 1, '#8a6a40');
  }
  return g.outline().rows();
}

// A tin lamp on a step, its wick burnt to a black thread.
function stepLamp() {
  const g = new Grid(16, 16);
  g.rect(4, 12, 8, 2, '#5a5a68').rect(4, 12, 8, 1, '#7a7a8a');
  g.rect(5, 6, 6, 6, '#7a7a8a').rect(5, 6, 2, 6, '#9a9aaa').rect(9, 6, 2, 6, '#5a5a68');
  g.rect(6, 7, 4, 4, '#2a2a34').set(8, 6, '#2a2a34');
  g.rect(4, 5, 8, 1, '#5a5a68'); g.rect(7, 3, 2, 2, '#7a7a8a');
  g.set(8, 5, '#18181e');
  g.rect(11, 8, 2, 1, '#9a9aaa');
  return g.outline().rows();
}

// Seven cups in a row on a lip of rock, the seventh with a saucer.
function cupRow() {
  const g = new Grid(16, 16);
  g.rect(0, 13, 16, 2, '#5a5060').rect(0, 13, 16, 1, '#7a7080');
  const cols = ['#c0c8d8', '#c0c8d8', '#c0c8d8', '#c0c8d8', '#c0c8d8', '#c0c8d8', '#e8c870'];
  for (let i = 0; i < 7; i++) {
    const x = 1 + i * 2;
    g.rect(x, 10, 2, 3, cols[i]); g.set(x, 10, '#f0f4ff');
  }
  g.rect(12, 12, 4, 1, '#e8c870');
  return g.outline().rows();
}

// A thin damp notebook with a pencil in it.
function journal() {
  const g = new Grid(16, 16);
  g.rect(3, 8, 10, 6, '#5a4a3a').rect(3, 8, 10, 1, '#7a6a50');
  g.rect(4, 9, 8, 4, '#e0d8b8').rect(8, 9, 1, 4, '#a89870');
  g.rect(5, 10, 3, 1, '#7a7a88').rect(5, 12, 2, 1, '#7a7a88').rect(10, 10, 2, 1, '#7a7a88');
  g.line(12, 6, 9, 11, '#c09a50'); g.set(12, 5, '#c04a4a');
  g.rect(3, 13, 10, 1, '#3a2e22');
  return g.outline().rows();
}

// A rope hammock between two crystal spikes (two tiles wide).
function hammock() {
  const g = new Grid(32, 16);
  const spike = (x, c, hi) => {
    g.rect(x, 5, 4, 9, c); g.rect(x, 5, 1, 9, hi); g.rect(x + 1, 3, 2, 2, c); g.set(x + 1, 2, hi);
  };
  spike(2, '#6a58a0', '#9a88d0'); spike(26, '#6a58a0', '#9a88d0');
  for (let x = 6; x < 26; x++) {
    const sag = Math.sin(((x - 6) / 19) * Math.PI) * 4;
    g.set(x, 7 + sag, '#c4a470'); g.set(x, 8 + sag, '#9a7a4a'); g.set(x, 9 + sag, '#c08a5a');
  }
  g.line(5, 7, 5, 5, '#9a7a4a'); g.line(26, 7, 26, 5, '#9a7a4a');
  g.rect(12, 14, 3, 1, '#6a4a30').rect(14, 13, 2, 1, '#6a4a30');
  return g.outline().rows();
}

// Four tiny crystal cups on a flat rock, each filled with a different glitter.
function crystalCups() {
  const g = new Grid(16, 16);
  g.rect(1, 12, 14, 2, '#5a5070').rect(1, 12, 14, 1, '#7a7090');
  const fills = ['#7af0e0', '#ff9ad0', '#ffe48a', '#b89aff'];
  for (let i = 0; i < 4; i++) {
    const x = 2 + i * 3;
    g.rect(x, 9, 2, 3, '#e0e8ff'); g.set(x, 9, '#ffffff'); g.rect(x, 9, 2, 1, fills[i]);
  }
  return g.outline().rows();
}

// A single grey sock, laid out to dry.
function sock() {
  const g = new Grid(16, 16);
  g.rect(5, 6, 5, 6, '#8a8a9a').rect(5, 6, 5, 1, '#c8c8d8');
  g.rect(5, 11, 8, 3, '#8a8a9a'); g.rect(5, 11, 8, 1, '#a8a8b8');
  g.rect(5, 8, 5, 1, '#c08a8a');
  g.rect(12, 12, 1, 2, '#6a6a7a');
  g.set(7, 10, '#6a6a7a'); g.set(8, 12, '#6a6a7a');
  return g.outline().rows();
}

// A jar of glowbugs, lid off, the little lights drifting.
function jarLights(i) {
  const g = new Grid(16, 16);
  g.rect(4, 5, 8, 9, '#a8c8e0').rect(5, 6, 6, 7, '#243044');
  g.rect(4, 5, 1, 9, '#dcf0ff'); g.rect(11, 5, 1, 9, '#6a8aa8');
  g.rect(5, 4, 6, 1, '#c8e0f0');
  const bugs = i ? [[6, 9], [9, 8], [7, 12], [10, 11]] : [[7, 8], [9, 10], [6, 11], [10, 7]];
  for (const [x, y] of bugs) { g.set(x, y, '#d8ff7a'); g.set(x + 1, y, '#7aff9a'); }
  g.set(8, i ? 6 : 7, '#ffffd0');
  return g.outline().rows();
}

// Chalk lines (flat): a wait-here line and a crooked arrow.
function chalkLine() {
  const g = new Grid(16, 16);
  g.rect(1, 9, 14, 1, '#d8d4c8'); g.rect(3, 11, 10, 1, '#b8b4a8');
  g.rect(7, 6, 1, 7, '#d8d4c8');
  g.set(6, 7, '#d8d4c8'); g.set(8, 7, '#d8d4c8');
  return g.rows();
}
function bootPrint() {
  const g = new Grid(16, 16);
  const prints = [[3, 9], [6, 7], [9, 10], [12, 8]];
  for (const [x, y] of prints) {
    g.rect(x, y, 2, 3, '#3a3446'); g.rect(x, y + 3, 2, 1, '#4a4458');
    g.set(x, y, '#2a2434'); g.set(x + 1, y, '#2a2434');
  }
  return g.rows();
}
function chalkArrow() {
  const g = new Grid(16, 16);
  g.line(3, 10, 12, 10, '#e0dccc'); g.line(12, 10, 9, 7, '#e0dccc'); g.line(12, 10, 9, 13, '#e0dccc');
  g.rect(3, 11, 5, 1, '#b8b4a8');
  g.set(2, 10, '#e0dccc');
  return g.rows();
}

export const R3C_PROP_SPRITES = {
  r3c_parcel: parcel(),
  r3c_flask: flask(),
  r3c_paper_crown: paperCrown(),
  r3c_handbell: handbell(),
  r3c_top_hat: topHat(),
  r3c_rope_loop: ropeLoop(),
  r3c_spoon_pot: spoonPot(),
  r3c_glove: glove(),
  r3c_log_pile: logPile(),
  r3c_step_lamp: stepLamp(),
  r3c_cup_row: cupRow(),
  r3c_journal: journal(),
  r3c_hammock: hammock(),
  r3c_crystal_cups: crystalCups(),
  r3c_sock: sock(),
  r3c_jar_lights: jarLights(0),
  r3c_chalk_line: chalkLine(),
  r3c_boot_print: bootPrint(),
  r3c_chalk_arrow: chalkArrow(),
};
export const R3C_JAR_LIGHTS_SPRITES = frames2(jarLights);
export const R3C_FOOTPRINTS = { r3c_hammock: 2 };
// Every colour above lives on its own character; the animation shares the same table.
export const R3C_PALETTE_EXTRA = palette;
export const R3C_JAR_LIGHTS_PALETTE = palette;
