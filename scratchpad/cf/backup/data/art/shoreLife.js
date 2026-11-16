// Life for chapter 5's coast (the Wrack Shore and the Wreck Yard): rock-pool
// things, kelp, shells, a nest, and what the ship-breakers left behind (a maul,
// a bar rack, a tally post, chalked plates, a kettle). Drawn like wreckYard.js:
// a tiny painter, 16 pixels to a tile, standing on the bottom edge. Every id
// starts `shore_`. Ones that move are animations too (SHORE_..._SPRITES): give
// the prop `animation: '<same name>'` and a `speed`.

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xfc80 + colors.size);
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

  rows() {
    return this.cells.map((row) => row.map((c) => (c ? char(c) : '.')).join(''));
  }
}

const OUT = '#10181e';
const IRON = ['#161a22', '#2e3642', '#505c6a', '#7c8c9a'];
const RUST = ['#3a1c14', '#6a3420', '#9a5430', '#c8803c'];
const WOOD = ['#2a231e', '#4a3a2c', '#6c5440', '#907a5c'];
const STONE = ['#2a3034', '#4a5458', '#6c787a', '#94a09c'];
const KELP = ['#1c3a1a', '#2e5a22', '#4a7a2c', '#7aa040'];
const CHALK = '#e8e4d0';
const CHALK_Y = '#e8cf6a';

// Little pseudo-random for wobble: the same every time.
const rnd = (seed) => {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

// --- Rock-pool things -------------------------------------------------------

function starfish(body = ['#7a2a14', '#c8582a', '#f08a4a'], seed = 1) {
  const g = new Grid(16, 10);
  const cx = 8;
  const cy = 5;
  for (let a = 0; a < 5; a++) {
    const ang = -Math.PI / 2 + (a * Math.PI * 2) / 5 + (seed % 3) * 0.25;
    const ex = cx + Math.cos(ang) * 6;
    const ey = cy + Math.sin(ang) * 3.4;
    g.line(cx, cy, ex, ey, body[1]);
    g.line(cx, cy - 1, ex, ey - 1, body[1]);
    g.set(ex, ey, body[2]);
  }
  g.oval(cx, cy, 2, 1, body[2]);
  g.set(cx - 1, cy, body[0]);
  g.set(cx + 1, cy - 1, body[0]);
  // Bumps down the arms.
  for (let a = 0; a < 5; a++) {
    const ang = -Math.PI / 2 + (a * Math.PI * 2) / 5 + (seed % 3) * 0.25;
    g.set(cx + Math.cos(ang) * 3.5, cy + Math.sin(ang) * 2, body[0]);
  }
  g.outline(OUT);
  return g.rows();
}

// A little pool with anemones swaying in it. Frame f moves the arms.
function anemonePool(f, seed = 5) {
  const g = new Grid(16, 14);
  g.oval(8, 9, 7, 4, '#1a3c48');
  g.oval(8, 9, 6, 3, '#2a6070');
  g.oval(6, 8, 3, 1, '#4a98a8');
  const spots = [[5, 9, '#e0587a', '#f8a0b4'], [10, 8, '#7ac060', '#c4f090'], [8, 11, '#e8903a', '#fcc878']];
  spots.forEach(([x, y, a, b], i) => {
    g.rect(x - 1, y - 1, 3, 3, a);
    for (let t = -2; t <= 2; t++) {
      const sway = Math.round(Math.sin(f * 1.6 + i + t) * 1);
      g.line(x + t * 0.7, y - 1, x + t * 1.1 + sway, y - 4 - (Math.abs(t) < 2 ? 1 : 0), b);
    }
  });
  // Rim of stones.
  g.oval(1, 10, 1, 2, STONE[1]);
  g.oval(15, 9, 1, 2, STONE[1]);
  g.set(2, 12, STONE[2]);
  g.set(13, 12, STONE[2]);
  g.outline(OUT);
  return g.rows();
}

function kelp(f, seed = 3) {
  const g = new Grid(16, 30);
  const r = rnd(seed);
  for (let s = 0; s < 3; s++) {
    const bx = 4 + s * 4 + (r() < 0.5 ? 0 : 1);
    const lean = (r() - 0.5) * 1.5;
    let x = bx;
    for (let y = 29; y >= 3; y--) {
      const up = 29 - y;
      x = bx + Math.sin(up * 0.3 + f * 1.57 + s * 1.3) * (1 + up * 0.07) + lean * up * 0.1;
      g.set(x, y, KELP[1 + ((y + s) % 3 === 0 ? 1 : 0)]);
      g.set(x + 1, y, KELP[1]);
      if (y % 6 === 0) {
        const side = s % 2 ? 1 : -1;
        g.line(x, y, x + side * 3, y - 2, KELP[2]);
        g.line(x + side * 3, y - 2, x + side * 4, y - 4, KELP[3]);
      }
    }
    g.oval(Math.round(x) + 1, 3, 1, 2, KELP[3]);
    g.set(bx, 29, STONE[2]);
  }
  g.oval(8, 29, 6, 1, STONE[1]);
  g.oval(7, 28, 3, 1, STONE[2]);
  g.outline(OUT);
  return g.rows();
}

function shells(seed = 11) {
  const g = new Grid(16, 8);
  const r = rnd(seed);
  const tones = [['#c8b48a', '#f2e4be'], ['#a0788a', '#d8b0c0'], ['#d8cdb4', '#fff6dc']];
  for (let i = 0; i < 7; i++) {
    const x = 2 + Math.floor(r() * 12);
    const y = 3 + Math.floor(r() * 3);
    const [a, b] = tones[Math.floor(r() * tones.length)];
    g.oval(x, y, 2, 1, a);
    g.set(x - 1, y - 1, b);
    g.set(x, y, '#7a6446');
  }
  g.outline(OUT);
  return g.rows();
}

function nest() {
  const g = new Grid(16, 12);
  g.oval(8, 9, 7, 3, STONE[1]);
  g.oval(8, 8, 6, 2, STONE[2]);
  g.oval(8, 7, 5, 2, '#8a7448');
  g.oval(8, 7, 4, 1, '#c8b078');
  for (const [x, c] of [[6, '#d8d4b8'], [8, '#c8c8a8'], [10, '#d8d4b8']]) {
    g.oval(x, 6, 1, 1, c);
    g.set(x, 6, '#6a5a3a');
  }
  for (let i = 0; i < 6; i++) g.line(3 + i * 2, 8, 4 + i * 2, 9, '#6a5a3a');
  g.outline(OUT);
  return g.rows();
}

function jelly() {
  const g = new Grid(16, 8);
  g.oval(8, 4, 6, 3, 'rgba(190, 210, 230, 0.8)');
  g.oval(8, 4, 4, 2, 'rgba(226, 238, 250, 0.9)');
  g.oval(8, 4, 2, 1, 'rgba(170, 150, 210, 0.9)');
  g.set(5, 6, 'rgba(190, 210, 230, 0.8)');
  g.set(11, 6, 'rgba(190, 210, 230, 0.8)');
  g.outline('rgba(40, 60, 80, 0.7)');
  return g.rows();
}

function fishbones() {
  const g = new Grid(16, 8);
  g.line(3, 4, 12, 4, '#e2dcc4');
  for (let x = 5; x <= 11; x += 2) {
    g.line(x, 2, x, 6, '#e2dcc4');
  }
  g.oval(2, 4, 2, 2, '#e2dcc4');
  g.set(2, 3, OUT);
  g.set(13, 3, '#e2dcc4');
  g.set(14, 2, '#e2dcc4');
  g.set(13, 5, '#e2dcc4');
  g.set(14, 6, '#e2dcc4');
  g.outline('rgba(30, 30, 30, 0.45)');
  return g.rows();
}

function crabShell() {
  const g = new Grid(16, 8);
  g.oval(8, 4, 5, 3, '#a8482c');
  g.oval(8, 4, 3, 2, '#d06a3c');
  g.set(6, 3, '#f0a070');
  for (let i = 0; i < 3; i++) {
    g.set(2, 3 + i, '#a8482c');
    g.set(14, 3 + i, '#a8482c');
  }
  g.set(5, 0, '#a8482c');
  g.set(11, 0, '#a8482c');
  g.outline(OUT);
  return g.rows();
}

function boot() {
  const g = new Grid(16, 12);
  g.rect(5, 1, 5, 7, '#4a3424');
  g.rect(6, 1, 3, 6, '#6a4a32');
  g.rect(5, 7, 9, 3, '#3a281c');
  g.rect(6, 8, 8, 1, '#5a4030');
  g.rect(5, 9, 9, 1, '#1c1410');
  g.rect(5, 2, 5, 1, '#8a6a4a');
  // A crab living in it.
  g.rect(9, 5, 2, 1, '#d0603a');
  g.set(8, 4, '#d0603a');
  g.set(11, 4, '#d0603a');
  g.outline(OUT);
  return g.rows();
}

function bottle(seed = 7) {
  const g = new Grid(16, 14);
  g.rect(5, 8, 7, 3, '#2a6a4a');
  g.rect(3, 9, 12, 2, '#3a8a5a');
  g.rect(3, 9, 6, 1, '#7ad0a0');
  g.rect(1, 9, 3, 2, '#2a6a4a');
  g.rect(0, 10, 1, 1, '#c8a060');
  g.line(7, 9, 11, 9, '#e8e4c8');
  // Partly in the shingle.
  g.oval(8, 11, 6, 1, '#6a7478');
  g.oval(6, 12, 3, 1, '#8a9696');
  g.set(11, 12, '#4a5458');
  g.outline(OUT);
  return g.rows();
}

// --- What the ship-breakers left ---------------------------------------------

function tarBucket() {
  const g = new Grid(16, 16);
  g.rect(4, 6, 8, 8, IRON[1]);
  g.rect(5, 6, 6, 8, IRON[2]);
  g.rect(4, 6, 8, 1, IRON[3]);
  g.rect(4, 9, 8, 1, IRON[0]);
  g.rect(4, 12, 8, 1, IRON[0]);
  g.rect(5, 5, 6, 1, '#0a0a0c');
  g.rect(6, 5, 2, 1, '#34343c');
  g.line(4, 6, 8, 1, IRON[3]);
  g.line(12, 6, 8, 1, IRON[3]);
  // The brush, tarred, leaning in.
  g.line(10, 5, 13, 0, WOOD[2]);
  g.rect(12, 0, 3, 2, '#0a0a0c');
  g.rect(3, 14, 10, 1, 'rgba(0,0,0,0.25)');
  g.outline(OUT);
  return g.rows();
}

function maul() {
  const g = new Grid(16, 24);
  // A stump with a big iron maul left standing in it.
  g.oval(8, 20, 6, 3, WOOD[1]);
  g.rect(2, 16, 13, 5, WOOD[1]);
  g.oval(8, 16, 6, 2, WOOD[3]);
  g.oval(8, 16, 4, 1, WOOD[2]);
  g.line(4, 17, 12, 17, WOOD[0]);
  g.rect(8, 6, 2, 12, WOOD[2]);
  g.rect(8, 6, 1, 12, WOOD[3]);
  g.rect(4, 1, 10, 6, IRON[1]);
  g.rect(4, 1, 10, 1, IRON[3]);
  g.rect(5, 2, 8, 1, IRON[2]);
  g.rect(4, 6, 10, 1, IRON[0]);
  g.rect(11, 3, 2, 2, RUST[2]);
  g.rect(5, 4, 2, 1, RUST[1]);
  g.outline(OUT);
  return g.rows();
}

function barRack() {
  const g = new Grid(16, 26);
  // Two posts, a cross-bar, iron bars and a pick leaning in.
  g.rect(1, 6, 2, 19, WOOD[1]);
  g.rect(13, 6, 2, 19, WOOD[1]);
  g.rect(1, 6, 1, 19, WOOD[3]);
  g.rect(13, 6, 1, 19, WOOD[3]);
  g.rect(1, 9, 14, 2, WOOD[2]);
  g.rect(1, 9, 14, 1, WOOD[3]);
  g.line(5, 22, 8, 3, IRON[2]);
  g.line(6, 22, 9, 3, IRON[1]);
  g.line(8, 22, 10, 5, IRON[2]);
  g.line(10, 22, 12, 4, IRON[1]);
  g.rect(8, 2, 3, 1, IRON[3]);
  g.rect(8, 3, 4, 1, IRON[3]);
  g.set(9, 4, IRON[3]);
  g.rect(4, 23, 8, 2, STONE[1]);
  g.oval(8, 24, 6, 1, STONE[1]);
  g.outline(OUT);
  return g.rows();
}

function tallyPost() {
  const g = new Grid(16, 30);
  g.rect(6, 4, 5, 25, WOOD[1]);
  g.rect(6, 4, 2, 25, WOOD[2]);
  g.rect(6, 4, 1, 25, WOOD[3]);
  g.rect(5, 2, 7, 3, WOOD[2]);
  g.rect(5, 2, 7, 1, WOOD[3]);
  // Tally marks, gates of five, carved in.
  for (let row = 0; row < 4; row++) {
    const y = 7 + row * 5;
    for (let i = 0; i < 4; i++) g.line(7 + i, y, 7 + i, y + 3, WOOD[0]);
    g.line(6, y + 3, 10, y, WOOD[0]);
  }
  g.rect(5, 27, 7, 2, STONE[1]);
  g.oval(8, 29, 6, 1, STONE[1]);
  g.oval(5, 28, 3, 1, STONE[2]);
  g.outline(OUT);
  return g.rows();
}

// A rusted plate propped on stones with a chalked doodle. kind picks the doodle.
function chalkPlate(kind = 0) {
  const g = new Grid(16, 22);
  g.rect(2, 3, 12, 15, RUST[1]);
  g.rect(3, 4, 10, 13, RUST[2]);
  g.rect(2, 3, 12, 1, RUST[3]);
  g.rect(2, 17, 12, 1, RUST[0]);
  g.set(3, 4, IRON[1]);
  g.set(12, 4, IRON[1]);
  g.set(3, 16, IRON[1]);
  g.set(12, 16, IRON[1]);
  g.rect(5, 12, 3, 3, RUST[1]);
  // Stones at its foot.
  g.oval(4, 19, 3, 2, STONE[1]);
  g.oval(12, 19, 3, 2, STONE[2]);
  g.rect(3, 19, 10, 2, STONE[1]);
  if (kind === 0) {
    // A ship with a sun.
    g.line(5, 12, 11, 12, CHALK);
    g.line(6, 13, 10, 13, CHALK);
    g.line(8, 7, 8, 11, CHALK);
    g.line(8, 7, 11, 10, CHALK);
    g.oval(5, 6, 1, 1, CHALK_Y);
  } else if (kind === 1) {
    // A tally and a stick man with a hammer.
    for (let i = 0; i < 4; i++) g.line(4 + i, 5, 4 + i, 8, CHALK);
    g.line(4, 8, 7, 5, CHALK);
    g.oval(10, 8, 1, 1, CHALK);
    g.line(10, 10, 10, 13, CHALK);
    g.line(8, 11, 12, 11, CHALK);
    g.line(12, 11, 13, 8, CHALK_Y);
  } else if (kind === 2) {
    // A skull and crossed bones, and a smile drawn on it afterwards.
    g.oval(8, 8, 3, 2, CHALK);
    g.set(7, 8, OUT);
    g.set(9, 8, OUT);
    g.line(6, 12, 11, 15, CHALK);
    g.line(11, 12, 6, 15, CHALK);
    g.line(6, 10, 10, 10, CHALK_Y);
  } else {
    // An arrow pointing at the sea, and a hand.
    g.line(4, 8, 11, 8, CHALK);
    g.line(11, 8, 9, 6, CHALK);
    g.line(11, 8, 9, 10, CHALK);
    g.rect(5, 12, 5, 3, CHALK_Y);
    for (let i = 0; i < 4; i++) g.set(5 + i, 11, CHALK_Y);
  }
  g.outline(OUT);
  return g.rows();
}

function rustPlate(seed = 4) {
  const g = new Grid(16, 8);
  const r = rnd(seed);
  g.rect(2, 2, 12, 4, RUST[1]);
  g.rect(3, 2, 10, 3, RUST[2]);
  g.rect(2, 2, 12, 1, RUST[3]);
  for (let i = 0; i < 5; i++) g.set(3 + Math.floor(r() * 10), 2 + Math.floor(r() * 4), RUST[0]);
  g.set(3, 3, IRON[3]);
  g.set(12, 3, IRON[3]);
  g.outline(OUT);
  return g.rows();
}

function kettle() {
  const g = new Grid(16, 16);
  // A camp kettle on three stones, the fire long dead.
  g.oval(4, 14, 2, 1, STONE[2]);
  g.oval(12, 14, 2, 1, STONE[2]);
  g.oval(8, 14, 3, 1, STONE[1]);
  g.rect(3, 6, 10, 7, IRON[1]);
  g.rect(4, 6, 8, 7, IRON[2]);
  g.rect(3, 6, 10, 1, IRON[3]);
  g.rect(3, 12, 10, 1, IRON[0]);
  g.rect(5, 4, 6, 2, IRON[2]);
  g.rect(13, 8, 2, 1, IRON[2]);
  g.rect(14, 7, 1, 1, IRON[2]);
  g.line(4, 6, 8, 2, IRON[3]);
  g.line(12, 6, 8, 2, IRON[3]);
  g.rect(6, 9, 2, 2, RUST[2]);
  g.set(9, 12, '#d8903a');
  g.outline(OUT);
  return g.rows();
}

function brokenChair() {
  const g = new Grid(16, 22);
  g.rect(3, 12, 10, 3, WOOD[2]);
  g.rect(3, 12, 10, 1, WOOD[3]);
  g.rect(3, 6, 2, 16, WOOD[1]);
  g.rect(11, 12, 2, 9, WOOD[1]);
  g.rect(3, 6, 2, 1, WOOD[3]);
  g.line(5, 8, 11, 9, WOOD[2]);
  g.line(5, 11, 11, 10, WOOD[2]);
  g.rect(4, 15, 2, 6, WOOD[1]);
  // A blanket slumped over the seat, plaid.
  g.rect(5, 10, 8, 3, '#7a3a34');
  g.rect(5, 11, 8, 1, '#c88a58');
  g.rect(6, 13, 3, 3, '#7a3a34');
  g.rect(7, 13, 1, 3, '#c88a58');
  g.rect(12, 20, 2, 1, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

function rivets() {
  const g = new Grid(16, 12);
  g.rect(4, 5, 8, 6, WOOD[1]);
  g.rect(4, 5, 8, 1, WOOD[3]);
  g.rect(4, 7, 8, 1, IRON[1]);
  g.rect(4, 10, 8, 1, IRON[1]);
  g.oval(8, 4, 3, 1, IRON[3]);
  g.set(6, 3, IRON[3]);
  g.set(9, 2, IRON[3]);
  g.set(10, 3, RUST[3]);
  g.set(7, 4, RUST[3]);
  // A few spilled.
  g.set(2, 10, IRON[3]);
  g.set(13, 10, RUST[3]);
  g.set(14, 9, IRON[2]);
  g.outline(OUT);
  return g.rows();
}

// A half-buried hull: the curve of old planks and ribs coming up out of the shingle.
function buriedHull() {
  const g = new Grid(32, 22);
  const rim = [];
  for (let x = 0; x < 32; x++) {
    const t = (x - 16) / 16;
    rim.push(Math.round(19 - 15 * (1 - t * t)));
  }
  for (let x = 1; x < 31; x++) {
    for (let y = rim[x]; y < 19; y++) g.set(x, y, WOOD[(y + (x >> 2)) % 3 === 0 ? 0 : 1]);
    g.set(x, rim[x], WOOD[3]);
  }
  for (let x = 4; x < 30; x += 5) for (let y = rim[x]; y < 19; y++) g.set(x, y, WOOD[2]);
  // Ribs poking up above the planking.
  for (const x of [6, 12, 19, 25]) g.line(x, rim[x], x - 1, rim[x] - 4, WOOD[2]);
  // Barnacles and green.
  for (const [x, y] of [[9, 14], [14, 11], [21, 13], [16, 15], [7, 16]]) {
    g.set(x, y, '#c8cdc0');
    g.set(x + 1, y, '#8a9890');
  }
  g.rect(10, 8, 6, 1, KELP[1]);
  // Shingle heaped round its foot.
  g.oval(5, 19, 5, 2, STONE[1]);
  g.oval(27, 19, 5, 2, STONE[1]);
  g.oval(16, 20, 14, 1, STONE[2]);
  g.oval(9, 18, 3, 1, STONE[3]);
  g.outline(OUT);
  return g.rows();
}

function flagPost(f) {
  const g = new Grid(16, 30);
  g.rect(3, 3, 2, 26, WOOD[1]);
  g.rect(3, 3, 1, 26, WOOD[3]);
  g.rect(2, 2, 4, 1, WOOD[3]);
  g.oval(4, 29, 5, 1, STONE[1]);
  g.rect(2, 27, 5, 2, STONE[2]);
  // A rag of red cloth torn into tails, streaming.
  const wave = [0, 1, 0, -1][f % 4];
  for (let x = 0; x < 9; x++) {
    const dy = Math.round(Math.sin(x * 0.9 + f * 1.57) * 1.5);
    g.rect(5 + x, 4 + dy + (x > 5 ? 1 : 0), 1, 3 - (x > 6 ? 1 : 0), x % 3 === 0 ? '#8a2a24' : '#b8423a');
  }
  g.set(14, 5 + wave, '#b8423a');
  g.outline(OUT);
  return g.rows();
}

// A sandhopper-free hermit: a hermit crab in a whelk shell, for the errand.
function hermit(f) {
  const g = new Grid(16, 14);
  const bob = f === 1 ? 1 : 0;
  g.oval(7, 8 - bob, 4, 3, '#d8c8a0');
  g.oval(7, 7 - bob, 2, 2, '#f0e4c4');
  g.line(4, 9 - bob, 10, 6 - bob, '#8a7448');
  g.oval(7, 7 - bob, 1, 1, '#b8a070');
  g.rect(10, 9, 3, 2, '#d0603a');
  g.rect(12, 8, 2, 1, '#e8804a');
  g.set(13, 7, '#e8804a');
  g.set(14, 8, '#e8804a');
  g.set(12, 7, OUT);
  g.set(13, 6, OUT);
  g.rect(8, 11, 1, 1, '#a8482c');
  g.rect(10, 11, 1, 1, '#a8482c');
  g.rect(12, 11, 1, 1, '#a8482c');
  g.outline(OUT);
  return g.rows();
}


// A great spiral whelk shell, the size of a loaf, for the errand.
function bigWhelk() {
  const g = new Grid(16, 16);
  g.oval(8, 14, 6, 1, STONE[1]);
  g.oval(8, 9, 5, 4, '#c8a878');
  g.oval(8, 8, 4, 3, '#e8d2a4');
  g.oval(7, 8, 2, 2, '#c8a878');
  g.line(8, 5, 11, 12, '#8a6a44');
  g.line(6, 6, 10, 12, '#b08c5c');
  g.line(5, 8, 8, 12, '#8a6a44');
  g.oval(8, 4, 2, 2, '#f4e6c0');
  g.set(8, 2, '#f4e6c0');
  g.rect(10, 11, 4, 3, '#4a3a28');
  g.rect(11, 12, 2, 1, '#1c1410');
  g.set(6, 7, '#fff6dc');
  g.outline(OUT);
  return g.rows();
}

// A clay pipe lying on a plank.
function pipeOnPlank() {
  const g = new Grid(16, 10);
  g.rect(1, 6, 14, 3, WOOD[1]);
  g.rect(1, 6, 14, 1, WOOD[3]);
  g.set(4, 7, WOOD[0]);
  g.set(10, 8, WOOD[0]);
  g.line(3, 5, 10, 5, '#e8e2cc');
  g.rect(10, 2, 3, 4, '#d8d0b4');
  g.rect(11, 2, 1, 1, '#2a2420');
  g.set(12, 3, '#e8e2cc');
  g.outline(OUT);
  return g.rows();
}

// A turnip washed up whole, with a rosette still pinned to it.
function turnip() {
  const g = new Grid(16, 16);
  g.oval(8, 13, 6, 1, STONE[1]);
  g.oval(8, 9, 4, 4, '#e8dce8');
  g.oval(8, 11, 3, 2, '#b86aa0');
  g.oval(8, 12, 2, 1, '#8a3a78');
  g.rect(7, 2, 1, 4, '#4a8a3a');
  g.rect(9, 3, 1, 3, '#5aa044');
  g.rect(5, 3, 1, 3, '#3a7a32');
  g.set(6, 2, '#5aa044');
  g.set(10, 2, '#4a8a3a');
  g.oval(11, 9, 2, 2, '#2a58b8');
  g.set(11, 9, '#e8e8f8');
  g.rect(10, 11, 1, 3, '#2a58b8');
  g.rect(12, 11, 1, 3, '#1c3e90');
  g.outline(OUT);
  return g.rows();
}

export const SHORE_PALETTE = palette;
export const SHORE_ANEMONE_POOL_SPRITES = { f1: anemonePool(0), f2: anemonePool(1), f3: anemonePool(2), f4: anemonePool(3) };
export const SHORE_KELP_SPRITES = { f1: kelp(0), f2: kelp(1), f3: kelp(2), f4: kelp(3) };
export const SHORE_KELP_B_SPRITES = { f1: kelp(1, 8), f2: kelp(2, 8), f3: kelp(3, 8), f4: kelp(0, 8) };
export const SHORE_FLAG_POST_SPRITES = { f1: flagPost(0), f2: flagPost(1), f3: flagPost(2), f4: flagPost(3) };
export const SHORE_HERMIT_SPRITES = { f1: hermit(0), f2: hermit(1) };

export const SHORE_PROP_SPRITES = {
  shore_starfish: starfish(),
  shore_starfish_purple: starfish(['#3a1a4a', '#7a3a98', '#b878d0'], 2),
  shore_starfish_pink: starfish(['#7a2a44', '#d86a8a', '#f8b0c4'], 4),
  shore_anemone_pool: SHORE_ANEMONE_POOL_SPRITES.f1,
  shore_kelp: SHORE_KELP_SPRITES.f1,
  shore_kelp_b: SHORE_KELP_B_SPRITES.f1,
  shore_shells: shells(),
  shore_shells_b: shells(29),
  shore_nest: nest(),
  shore_jelly: jelly(),
  shore_fishbones: fishbones(),
  shore_crab_shell: crabShell(),
  shore_boot: boot(),
  shore_bottle: bottle(),
  shore_tar_bucket: tarBucket(),
  shore_maul: maul(),
  shore_bar_rack: barRack(),
  shore_tally_post: tallyPost(),
  shore_chalk_ship: chalkPlate(0),
  shore_chalk_tally: chalkPlate(1),
  shore_chalk_skull: chalkPlate(2),
  shore_chalk_arrow: chalkPlate(3),
  shore_rust_plate: rustPlate(),
  shore_rust_plate_b: rustPlate(9),
  shore_kettle: kettle(),
  shore_chair: brokenChair(),
  shore_rivets: rivets(),
  shore_buried_hull: buriedHull(),
  shore_flag_post: SHORE_FLAG_POST_SPRITES.f1,
  shore_hermit: SHORE_HERMIT_SPRITES.f1,
  shore_whelk: bigWhelk(),
  shore_pipe: pipeOnPlank(),
  shore_turnip: turnip(),
};

export const SHORE_FOOTPRINTS = { shore_buried_hull: 2 };
