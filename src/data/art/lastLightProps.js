// Props for the inside of Chapter 5's Last Light (the tower where Corrie waits). Drawn like
// islesProps.js: rows of characters from a small painter, 16 pixels to a tile, standing on the
// bottom edge and centred over their footprint. Every id starts `ll_`.
//
//   ll_big_oilskin     a yellow oilskin on a peg stand, far too big for any child: the sleeves
//                      hang past the hem of a boy and the hem drags in a puddle (1 wide, 46 high)
//   ll_chalk_circle    a spell circle chalked on the brick: rings, runes, wave marks, rubbed out
//                      and drawn again (2 wide, 32 high; stands on the wall row)
//   ll_scorch_circle   the same kind of circle, but burnt into the brick, black with an orange
//                      edge where it caught (2 wide, 32 high)
//   ll_chalk_sums      tide sums chalked on the wall in a child's hand: columns of numbers, arrows
//                      up and down, a wobbly wave (2 wide, 16 high)
//   ll_chalk_hand      a child's handwriting, big at the start and cramped at the end, with a
//                      drawn boat (2 wide, 16 high)
//   ll_floor_circle    a spell circle chalked on the floor with a paper boat at each point
//                      (3 wide, 3 high; lay it `flat, walkable`)
//   ll_dead_lamp       the Last Light's great lamp, dead: a drum of dark glass rings in a brass
//                      frame on its pedestal, the bulb black, a crack across, salt on the brass
//                      (4 wide, 68 high)

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xf900 + colors.size);
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

  ring(cx, cy, r, c, steps = 0) {
    const n = steps || Math.max(16, r * 8);
    for (let i = 0; i < n; i++) this.set(cx + Math.cos((i / n) * 6.2832) * r, cy + Math.sin((i / n) * 6.2832) * r, c);
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

const OUT = '#0a0e10';
const YELLOW = ['#8a6a14', '#c49a22', '#e8c040', '#f4d86a'];
const WOOD = ['#3a2a1c', '#5a4430', '#7a6046', '#9a7c5a'];
const IRON = ['#1c2026', '#2e343c', '#4a5260', '#6a7480'];
const CHALK = ['#7e857c', '#b4bab0', '#e4e8dc'];
const BURN = ['#0c0c0c', '#2a1c14', '#7a3a18', '#d8761c'];
const BRASS = ['#4a3a1c', '#7a6230', '#a88a44', '#d0b468'];
const GLASS = ['#0e1c20', '#16282e', '#22404a', '#3a6670'];
const WATER = ['#1a4048', '#2e6a70'];
const PAPER = ['#cfc6ae', '#e8e0c8', '#a8a088'];
const SALT = '#c8d8d0';

let seed = 5;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};

// --- The oilskin that is far too big ---------------------------------
function bigOilskin() {
  const g = new Grid(16, 46);
  // Two posts and a crossbar with one iron peg: a coat-stand.
  g.rect(0, 2, 2, 44, WOOD[1]);
  g.rect(14, 2, 2, 44, WOOD[1]);
  g.rect(0, 2, 1, 44, WOOD[2]);
  g.rect(0, 1, 16, 3, WOOD[2]);
  g.rect(0, 1, 16, 1, WOOD[3]);
  g.rect(0, 44, 3, 2, WOOD[0]);
  g.rect(13, 44, 3, 2, WOOD[0]);
  g.rect(7, 4, 2, 3, IRON[2]);
  g.rect(6, 6, 4, 1, IRON[3]);
  // The hood bunched over the peg, then the coat: broad shoulders, sleeves too long, a hem
  // that reaches the floor and puddles.
  g.rect(5, 6, 6, 4, YELLOW[2]);
  g.rect(6, 7, 4, 2, YELLOW[0]);
  g.rect(3, 10, 10, 3, YELLOW[2]);
  g.rect(3, 13, 10, 28, YELLOW[1]);
  g.rect(3, 13, 2, 28, YELLOW[2]);
  g.rect(11, 13, 2, 28, YELLOW[0]);
  // The sleeves, hanging down past the pockets, one cuff on the floor.
  g.rect(2, 13, 2, 26, YELLOW[1]);
  g.rect(12, 13, 2, 27, YELLOW[0]);
  g.rect(2, 36, 2, 5, YELLOW[3]);
  // The front: a seam, big wooden buttons, a pocket you could keep a cat in.
  g.rect(8, 13, 1, 28, YELLOW[0]);
  for (const y of [15, 21, 27, 33]) g.rect(9, y, 2, 2, WOOD[1]);
  g.rect(4, 26, 4, 1, YELLOW[0]);
  g.rect(4, 26, 1, 6, YELLOW[0]);
  g.rect(7, 26, 1, 6, YELLOW[0]);
  g.rect(4, 31, 4, 1, YELLOW[0]);
  // Dark water stains and a puddle on the floor under the hem.
  g.rect(3, 38, 10, 3, YELLOW[0]);
  g.rect(3, 41, 10, 1, YELLOW[0]);
  g.rect(2, 43, 12, 2, WATER[0]);
  g.rect(4, 43, 5, 1, WATER[1]);
  g.outline(OUT);
  return g.rows();
}

// --- Chalk and scorch on the brick -----------------------------------
function circle(burnt) {
  const g = new Grid(32, 32);
  const [a, b, c] = burnt ? [BURN[1], BURN[2], BURN[3]] : CHALK;
  const dark = burnt ? BURN[0] : CHALK[0];
  // A wide scrubbed patch for the burnt one, so it reads as scorching and not a line drawing.
  if (burnt) {
    g.oval(16, 16, 14, 14, BURN[1]);
    for (let i = 0; i < 70; i++) g.set(3 + rand() * 26, 3 + rand() * 26, BURN[0]);
    g.oval(16, 16, 11, 11, BURN[0]);
    g.oval(16, 16, 8, 8, BURN[1]);
  }
  // Two rings, the outer one drawn twice (the first try is smudged).
  g.ring(16, 16, 13, a);
  g.ring(16, 16, 12, b);
  g.ring(17, 16, 12, dark);
  g.ring(16, 16, 9, b);
  // Runes round the gap between the rings: ticks, little waves, small boats.
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * 6.2832;
    const x = 16 + Math.cos(ang) * 10.5;
    const y = 16 + Math.sin(ang) * 10.5;
    if (i % 3 === 0) { g.set(x, y, c); g.set(x + 1, y, c); g.set(x, y + 1, c); }
    else if (i % 3 === 1) { g.set(x - 1, y, b); g.set(x, y - 1, c); g.set(x + 1, y, b); }
    else g.line(x, y - 1, x, y + 1, c);
  }
  // A star of lines inside, a wave in the middle, and a tiny boat.
  for (let i = 0; i < 3; i++) {
    const ang = (i / 3) * 3.1416 + 0.3;
    g.line(16 + Math.cos(ang) * 9, 16 + Math.sin(ang) * 9, 16 - Math.cos(ang) * 9, 16 - Math.sin(ang) * 9, b);
  }
  for (let x = 11; x < 22; x++) g.set(x, 16 + Math.round(Math.sin(x * 0.9) * 1.4), c);
  g.line(14, 20, 18, 20, c);
  g.line(15, 19, 17, 19, c);
  g.set(16, 17, c);
  g.set(16, 18, c);
  // A rubbed-out arc where a hand went through it.
  if (!burnt) for (let i = 0; i < 9; i++) g.set(5 + i, 22 + (i >> 1), null);
  return g.rows();
}

// Tide sums: a column of numbers in a child's hand, arrows, a wobbly wave.
function sums() {
  const g = new Grid(32, 16);
  const [a, b, c] = CHALK;
  // Row of tiny digits as little strokes.
  const digit = (x, y, n) => {
    const shapes = [
      [[0, 0, 2, 0], [0, 0, 0, 3], [2, 0, 2, 3], [0, 3, 2, 3]],
      [[1, 0, 1, 3]],
      [[0, 0, 2, 0], [2, 0, 2, 1], [0, 2, 2, 1], [0, 2, 0, 3], [0, 3, 2, 3]],
      [[0, 0, 2, 0], [2, 0, 2, 3], [0, 3, 2, 3], [0, 1, 2, 1]],
      [[0, 0, 0, 1], [0, 1, 2, 1], [2, 0, 2, 3]],
    ][n % 5];
    for (const [x0, y0, x1, y1] of shapes) g.line(x + x0, y + y0, x + x1, y + y1, c);
  };
  for (let row = 0; row < 3; row++) {
    const y = 1 + row * 5;
    let x = 1 + (row === 1 ? 1 : 0);
    digit(x, y, row + 1);
    g.set(x + 4, y + 1, b); g.set(x + 5, y + 1, b);
    g.set(x + 4, y + 3, b); g.set(x + 5, y + 3, b);
    digit(x + 7, y, row * 2 + 2);
    g.line(x + 11, y + 2, x + 14, y + 2, b);
    digit(x + 16, y, row + 3);
  }
  // Arrows up and down, the wobbly wave, a crossed-out line.
  g.line(26, 2, 26, 8, c); g.line(24, 4, 26, 2, c); g.line(28, 4, 26, 2, c);
  g.line(29, 8, 29, 14, b); g.line(27, 12, 29, 14, b); g.line(31, 12, 29, 14, b);
  for (let x = 22; x < 31; x++) g.set(x, 12 + Math.round(Math.sin(x * 1.1) * 1.2), a);
  g.line(1, 14, 18, 14, a);
  return g.rows();
}

// A child's writing: big at first, then cramped; a small boat drawn at the end.
function hand() {
  const g = new Grid(32, 16);
  const [a, b, c] = CHALK;
  let x = 1;
  for (let row = 0; row < 4; row++) {
    const y = 1 + row * 3.6;
    const size = row < 2 ? 3 : 2;
    x = 1 + (row % 2);
    while (x < 24 - row * 2) {
      const len = 2 + Math.floor(rand() * 4);
      for (let i = 0; i < len; i++) {
        g.set(x + i, y + (i % 2 ? 0 : size - 1), c);
        g.set(x + i, y + Math.floor(size / 2), i % 3 ? b : a);
      }
      x += len + 2;
    }
  }
  // The boat at the end, drawn properly.
  g.line(25, 11, 30, 11, c); g.line(26, 12, 29, 12, b);
  g.line(27, 5, 27, 10, c); g.line(27, 5, 30, 9, b); g.line(27, 10, 30, 10, b);
  return g.rows();
}

// A circle on the floor with a paper boat at each point.
function floorCircle() {
  const g = new Grid(48, 48);
  const [a, b, c] = CHALK;
  g.ring(24, 24, 22, a);
  g.ring(24, 24, 21, b);
  g.ring(24, 24, 15, b);
  g.ring(24, 24, 14, a);
  // Eight ticks between the rings.
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * 6.2832 + 0.2;
    g.line(24 + Math.cos(ang) * 16, 24 + Math.sin(ang) * 16, 24 + Math.cos(ang) * 20, 24 + Math.sin(ang) * 20, c);
  }
  // A big wave at the centre, three sums beside it.
  for (let x = 14; x < 35; x++) { g.set(x, 24 + Math.round(Math.sin(x * 0.7) * 2), c); g.set(x, 26 + Math.round(Math.sin(x * 0.7 + 1) * 2), b); }
  // Four paper boats at the compass points.
  const boat = (cx, cy) => {
    g.rect(cx - 3, cy, 7, 2, PAPER[1]);
    g.rect(cx - 2, cy + 2, 5, 1, PAPER[2]);
    g.rect(cx - 1, cy - 3, 3, 3, PAPER[0]);
    g.set(cx, cy - 4, PAPER[1]);
    g.set(cx + 3, cy - 1, PAPER[1]);
  };
  boat(24, 5);
  boat(43, 25);
  boat(24, 45);
  boat(5, 25);
  return g.rows();
}

// --- The great lamp, dead --------------------------------------------
function deadLamp() {
  const g = new Grid(68, 68);
  // Brass pedestal and bottom ring, salted white at the edges.
  g.rect(14, 60, 40, 8, BRASS[1]);
  g.rect(14, 60, 40, 2, BRASS[2]);
  g.rect(14, 66, 40, 2, BRASS[0]);
  g.rect(24, 54, 20, 7, BRASS[0]);
  g.rect(26, 54, 3, 6, BRASS[1]);
  // The drum of dark glass rings, a cold bulb in the middle.
  g.oval(34, 30, 26, 26, BRASS[0]);
  g.oval(34, 30, 24, 24, GLASS[1]);
  for (const r of [22, 19, 16, 13, 10]) g.ring(34, 30, r, r % 2 ? GLASS[3] : GLASS[0], r * 8);
  g.oval(34, 30, 7, 7, GLASS[0]);
  g.oval(34, 30, 4, 4, '#1a1a1a');
  // Brass ribs.
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * 3.1416;
    g.line(34 - Math.cos(a) * 25, 30 - Math.sin(a) * 25, 34 + Math.cos(a) * 25, 30 + Math.sin(a) * 25, BRASS[1]);
  }
  g.rect(8, 28, 52, 3, BRASS[1]);
  g.rect(8, 28, 52, 1, BRASS[2]);
  // A crack across the glass, and a patch of salt.
  g.line(22, 14, 30, 24, '#04080a');
  g.line(30, 24, 28, 34, '#04080a');
  g.line(28, 34, 38, 44, '#04080a');
  for (let i = 0; i < 18; i++) g.set(44 + rand() * 9, 40 + rand() * 9, SALT);
  for (let x = 14; x < 54; x += 3) g.set(x, 60, SALT);
  g.oval(34, 6, 6, 3, BRASS[0]);
  g.rect(30, 0, 8, 4, BRASS[1]);
  g.outline(OUT);
  return g.rows();
}

// --- The working tower: iron, oil, chain and the sea getting in -------
// Wall pieces stand on the wall's lowest row (the row just above the floor), bolted on with their
// own brackets; the floor pieces marked "flat" lie on the flags (`flat: true, walkable: true`).
//   ll_pipes_run      two iron pipes along the brick on bolted brackets, a flange joint, rust
//                     running down from it; the ends meet the next piece (2 wide, 30 high)
//   ll_pipes_valve    the same pipes with a valve wheel, a pressure gauge and a downpipe that goes
//                     into the floor, dripping (2 wide, 30 high)
//   ll_pipes_end      the pipes bending down into the floor (2 wide, 30 high)
//   ll_pipe_riser     one pipe straight up the brick, a valve wheel at hand height (1 wide, 32 high)
//   ll_chain_hook     an iron hook on a bolted plate, a chain hanging from it in two loops (1 wide)
//   ll_lamp_bracket   an iron arm bolted to the brick with a caged lamp of sea-green glass, cold (1 wide)
//   ll_tide_marks     tide lines scratched in the brick with a nail, the worst one highest, a band
//                     of weed and salt where the water stood (2 wide, 30 high)
//   ll_drums          two iron oil drums and a little can, oil down their sides (2 wide)
//   ll_drum_tipped    a drum on its side, bung out, a black tongue of oil from it (2 wide)
//   ll_oil_spill      a slick of lamp oil on the flags, the sheen on it (flat, 2 wide)
//   ll_coal_spill     a split sack and the coal out of it (flat, 2 wide)
//   ll_grating        an iron grating over a drain, the sea moving under it (flat)
//   ll_kelp_drag      kelp dragged in across the floor, the wet track behind it (flat, 3 wide)
//   ll_seep           the sea come in under a door: a fan of wet and a puddle (flat, 2 wide)
//   ll_pillar_fallen  the spiked crown of a pillar, broken off and lying on the flags (flat, 2 wide)
const RUST = ['#3a2216', '#6a3a20', '#9a5a2a'];
const OIL = ['#07090a', '#14181a', '#2a3a3a'];
const SHEEN = ['#3a6a5a', '#5a4a6a', '#6a8a5a'];
const KELP = ['#14301c', '#204a28', '#2e6036', '#4a7a40'];
const SEA = ['#1e5a52', '#3a8c7a', '#8af4e0'];
const COAL = ['#0a0a0c', '#1a1c20', '#30343a'];
const SACK = ['#4a3e2a', '#6a5a3e', '#857250'];

function pipeRow(g, y, from, to) {
  g.rect(from, y, to - from, 4, IRON[1]);
  g.rect(from, y, to - from, 1, IRON[3]);
  g.rect(from, y + 1, to - from, 1, IRON[2]);
  g.rect(from, y + 3, to - from, 1, IRON[0]);
}
function bracket(g, x, y) {
  g.rect(x, y - 1, 3, 6, IRON[0]);
  g.rect(x + 1, y - 1, 1, 6, IRON[2]);
  g.set(x + 1, y - 2, IRON[3]);
  g.set(x + 1, y + 5, IRON[3]);
}
function flange(g, x, y) {
  g.rect(x, y - 1, 2, 6, IRON[2]);
  g.rect(x, y - 1, 1, 6, IRON[3]);
  g.set(x + 1, y, OUT);
  g.set(x + 1, y + 3, OUT);
}
function rustRun(g, x, y, len) {
  for (let i = 0; i < len; i++) {
    g.set(x + (i > len / 2 ? 1 : 0), y + i, i % 3 ? RUST[1] : RUST[2]);
    if (i % 4 === 1) g.set(x - 1, y + i, RUST[0]);
  }
}
function wheel(g, cx, cy, r) {
  g.ring(cx, cy, r, IRON[0], 24);
  g.ring(cx, cy, r - 1, RUST[2], 24);
  g.line(cx - r + 1, cy, cx + r - 1, cy, RUST[1]);
  g.line(cx, cy - r + 1, cx, cy + r - 1, RUST[1]);
  g.rect(cx - 1, cy - 1, 2, 2, IRON[3]);
}

function pipes(kind) {
  const g = new Grid(32, 30);
  if (kind === 'end') {
    // The two pipes come in from the left and turn down into the floor.
    pipeRow(g, 6, 0, 22);
    pipeRow(g, 15, 0, 14);
    g.rect(22, 6, 4, 24, IRON[1]);
    g.rect(22, 6, 1, 24, IRON[3]);
    g.rect(25, 6, 1, 24, IRON[0]);
    g.rect(14, 15, 4, 15, IRON[1]);
    g.rect(14, 15, 1, 15, IRON[3]);
    g.rect(17, 15, 1, 15, IRON[0]);
    g.rect(21, 26, 6, 2, IRON[2]);
    g.rect(13, 26, 6, 2, IRON[2]);
    flange(g, 8, 6);
    bracket(g, 3, 15);
    bracket(g, 20, 14);
    rustRun(g, 23, 10, 12);
  } else {
    pipeRow(g, 6, 0, 32);
    pipeRow(g, 15, 0, 32);
    bracket(g, 3, 6);
    bracket(g, 3, 15);
    bracket(g, 25, 6);
    bracket(g, 25, 15);
    flange(g, 14, 6);
    flange(g, 18, 15);
    rustRun(g, 15, 10, 4);
    rustRun(g, 19, 19, 9);
    if (kind === 'valve') {
      // A downpipe off the lower run, a valve wheel on it and a gauge above.
      g.rect(9, 19, 4, 11, IRON[1]);
      g.rect(9, 19, 1, 11, IRON[3]);
      g.rect(12, 19, 1, 11, IRON[0]);
      g.rect(8, 27, 6, 2, IRON[2]);
      wheel(g, 11, 22, 4);
      g.rect(20, 0, 1, 6, IRON[2]);
      g.oval(20, 2, 3, 2, BRASS[1]);
      g.oval(20, 2, 2, 1, PAPER[1]);
      g.line(20, 2, 22, 1, OUT);
      // It drips.
      g.set(14, 27, SEA[1]);
      g.set(15, 29, SEA[2]);
    }
  }
  g.outline(OUT);
  return g.rows();
}

function pipeRiser() {
  const g = new Grid(16, 32);
  g.rect(6, 0, 4, 32, IRON[1]);
  g.rect(6, 0, 1, 32, IRON[3]);
  g.rect(9, 0, 1, 32, IRON[0]);
  for (const y of [4, 24]) { g.rect(4, y, 8, 2, IRON[0]); g.rect(5, y, 6, 1, IRON[2]); }
  g.rect(5, 12, 6, 2, IRON[2]);
  wheel(g, 8, 17, 5);
  rustRun(g, 7, 19, 10);
  g.rect(4, 30, 8, 2, IRON[2]);
  g.outline(OUT);
  return g.rows();
}

function chainHook() {
  const g = new Grid(16, 30);
  // The plate and its four bolts, the hook out of it.
  g.rect(4, 1, 8, 5, IRON[1]);
  g.rect(4, 1, 8, 1, IRON[3]);
  for (const [x, y] of [[5, 2], [10, 2], [5, 4], [10, 4]]) g.set(x, y, IRON[3]);
  g.rect(7, 6, 2, 3, IRON[2]);
  g.rect(4, 9, 7, 1, IRON[2]);
  // Chain: down one side, a loop low, back up to the hook and down again to the end.
  const link = (x, y, upright) => {
    if (upright) { g.rect(x, y, 2, 3, IRON[2]); g.set(x, y, IRON[3]); }
    else { g.rect(x - 1, y, 3, 1, IRON[3]); g.set(x, y, IRON[1]); }
  };
  const path = [];
  for (let i = 0; i <= 10; i++) path.push([4, 10 + i * 1.5]);
  for (let i = 1; i <= 6; i++) path.push([4 + i, 25 + Math.sin((i / 6) * 3.1416) * 2]);
  for (let i = 0; i <= 10; i++) path.push([10, 25 - i * 1.5]);
  path.forEach(([x, y], i) => link(Math.round(x), Math.round(y), i % 2 === 0));
  // The free end, with its own hook, hanging down the other side of the plate.
  for (let y = 10; y < 22; y += 2) link(12, y, (y / 2) % 2 === 0);
  g.rect(12, 22, 1, 3, IRON[3]);
  g.rect(13, 24, 2, 1, IRON[3]);
  g.set(14, 23, IRON[3]);
  g.outline(OUT);
  return g.rows();
}

function lampBracket() {
  const g = new Grid(16, 30);
  // Plate, arm out and down, the cage hanging from its tip.
  g.rect(1, 6, 4, 10, IRON[1]);
  g.rect(1, 6, 1, 10, IRON[3]);
  g.set(2, 8, IRON[3]);
  g.set(2, 13, IRON[3]);
  g.line(4, 8, 11, 4, IRON[2]);
  g.line(4, 9, 11, 5, IRON[1]);
  g.line(4, 14, 9, 6, IRON[1]);
  g.rect(10, 4, 1, 4, IRON[2]);
  g.rect(8, 8, 5, 2, IRON[1]);
  g.rect(8, 10, 5, 7, SEA[0]);
  // Cold: nobody has lit it in years (the only light up here is the one
  // that comes on after Corrie). A dull gleam on the glass, no flame.
  g.rect(9, 11, 3, 5, SEA[0]);
  g.set(9, 11, SEA[1]);
  for (const x of [8, 10, 12]) g.rect(x, 10, 1, 7, IRON[1]);
  g.rect(8, 17, 5, 2, IRON[1]);
  g.set(10, 19, IRON[2]);
  rustRun(g, 3, 16, 7);
  g.outline(OUT);
  return g.rows();
}

function tideMarks() {
  const g = new Grid(32, 30);
  // A band of weed and salt along the bottom, where the water stood longest.
  for (let x = 0; x < 32; x++) {
    const h = 5 + Math.round(Math.sin(x * 0.7) * 1.5 + rand() * 2);
    for (let y = 30 - h; y < 30; y++) g.set(x, y, y < 30 - h + 1 ? SALT : rand() < 0.5 ? KELP[1] : KELP[0]);
    if (rand() < 0.3) g.set(x, 30 - h - 1, KELP[2]);
  }
  // Scratched lines, each with a few tally strokes after it; the highest is the longest.
  const lines = [[20, 4, 24, 2], [15, 2, 19, 3], [10, 6, 25, 2], [4, 1, 22, 1]];
  for (const [y, x0, x1, ticks] of lines) {
    g.line(x0, y, x1, y, CHALK[1]);
    g.line(x0, y + 1, x1, y + 1, '#262c2e');
    for (let t = 0; t < ticks; t++) g.line(x1 + 2 + t * 2, y - 2, x1 + 1 + t * 2, y + 1, CHALK[0]);
  }
  return g.rows();
}

function drum(g, x, y, w, h, rusty) {
  g.rect(x, y, w, h, IRON[1]);
  g.rect(x + 1, y, 2, h, IRON[2]);
  g.rect(x + w - 2, y, 2, h, IRON[0]);
  for (const r of [y + 3, y + Math.round(h / 2), y + h - 3]) { g.rect(x, r, w, 1, IRON[3]); g.rect(x, r + 1, w, 1, IRON[0]); }
  g.oval(x + Math.floor(w / 2), y, Math.floor(w / 2), 2, IRON[2]);
  g.oval(x + Math.floor(w / 2), y, Math.floor(w / 2) - 1, 1, IRON[1]);
  g.rect(x + w - 4, y - 1, 2, 1, IRON[0]);
  // Oil down the side from the bung.
  g.rect(x + w - 4, y + 1, 1, h - 3, OIL[0]);
  g.rect(x + w - 5, y + 4, 1, 3, OIL[1]);
  if (rusty) for (let i = 0; i < 14; i++) g.set(x + 1 + rand() * (w - 2), y + 2 + rand() * (h - 3), i % 2 ? RUST[1] : RUST[0]);
}
function drums() {
  const g = new Grid(32, 26);
  g.oval(16, 23, 15, 2, OIL[1]);
  drum(g, 15, 3, 12, 20, false);
  drum(g, 4, 7, 12, 18, true);
  // A little oil can in front.
  g.rect(24, 18, 6, 6, RUST[1]);
  g.rect(24, 18, 6, 1, RUST[2]);
  g.rect(26, 15, 2, 3, IRON[2]);
  g.line(29, 19, 31, 16, IRON[2]);
  g.outline(OUT);
  for (let x = 6; x < 26; x += 3) g.set(x, 25, SHEEN[x % 3]);
  return g.rows();
}
function drumTipped() {
  const g = new Grid(32, 18);
  // The slick first, so the drum lies in it.
  g.oval(22, 14, 9, 3, OIL[0]);
  g.oval(23, 14, 6, 2, OIL[1]);
  g.set(20, 13, SHEEN[0]);
  g.set(24, 15, SHEEN[1]);
  g.set(27, 14, SHEEN[2]);
  // The drum on its side: the lid end facing us, ribs going round it.
  g.rect(2, 3, 18, 12, IRON[1]);
  g.rect(2, 4, 18, 2, IRON[2]);
  g.rect(2, 12, 18, 2, IRON[0]);
  for (const x of [6, 12]) { g.rect(x, 3, 1, 12, IRON[3]); g.rect(x + 1, 3, 1, 12, IRON[0]); }
  g.oval(20, 9, 3, 6, IRON[2]);
  g.oval(20, 9, 2, 5, IRON[1]);
  g.rect(20, 11, 2, 2, OIL[0]);
  for (let i = 0; i < 10; i++) g.set(3 + rand() * 15, 4 + rand() * 9, RUST[1]);
  g.outline(OUT);
  return g.rows();
}

function blob(g, cx, cy, rx, ry, c, rough = 0.35) {
  for (let y = -ry; y <= ry; y++) {
    for (let x = -rx; x <= rx; x++) {
      const d = (x * x) / (rx * rx) + (y * y) / (ry * ry);
      if (d < 1 - rand() * rough) g.set(cx + x, cy + y, c);
    }
  }
}
function oilSpill() {
  const g = new Grid(32, 16);
  blob(g, 14, 8, 12, 5, OIL[1]);
  blob(g, 24, 10, 6, 3, OIL[1]);
  blob(g, 14, 8, 9, 3, OIL[0]);
  for (let i = 0; i < 16; i++) g.set(6 + rand() * 18, 6 + rand() * 4, SHEEN[i % 3]);
  g.line(8, 6, 13, 5, SHEEN[0]);
  g.line(16, 10, 20, 9, SHEEN[1]);
  return g.rows();
}
function coalSpill() {
  const g = new Grid(32, 16);
  // The sack, slumped and split, at one end.
  g.oval(7, 9, 6, 5, SACK[1]);
  g.oval(6, 8, 4, 3, SACK[2]);
  g.line(3, 13, 11, 13, SACK[0]);
  g.line(10, 6, 12, 10, SACK[0]);
  g.outline(OUT);
  // The coal out of it, heaped by the split and thinning out.
  blob(g, 17, 10, 7, 4, COAL[1]);
  blob(g, 15, 9, 4, 3, COAL[0]);
  for (let i = 0; i < 60; i++) {
    const t = rand();
    const x = 11 + t * 19 + (rand() - 0.5) * 4;
    const y = 8 + rand() * 7;
    if (rand() > t * 0.9) { g.set(x, y, COAL[0]); g.set(x + 1, y, rand() < 0.5 ? COAL[2] : COAL[1]); }
  }
  return g.rows();
}
function grating() {
  const g = new Grid(16, 16);
  g.rect(1, 2, 14, 12, IRON[0]);
  g.rect(2, 3, 12, 10, '#04080a');
  g.rect(3, 6, 10, 5, SEA[0]);
  g.set(5, 8, SEA[1]);
  g.set(9, 7, SEA[1]);
  g.set(11, 9, SEA[2]);
  for (let x = 3; x < 14; x += 3) { g.rect(x, 3, 1, 10, IRON[2]); g.set(x, 3, IRON[3]); }
  g.rect(2, 7, 12, 1, IRON[1]);
  g.rect(1, 2, 14, 1, IRON[3]);
  g.rect(1, 13, 14, 1, IRON[0]);
  for (let i = 0; i < 6; i++) g.set(1 + rand() * 14, 14 + rand() * 2, RUST[0]);
  return g.rows();
}
function kelpDrag() {
  const g = new Grid(48, 16);
  // The wet track it left, then the kelp itself at the end of it.
  for (let x = 0; x < 34; x++) {
    const y = 9 + Math.round(Math.sin(x * 0.18) * 2);
    g.set(x, y, '#1a2a2a');
    if (x % 2) g.set(x, y + 1, '#1a2a2a');
    if (x % 5 === 0) g.set(x, y - 1, WATER[0]);
  }
  for (let s = 0; s < 6; s++) {
    let x = 30 + s;
    let y = 6 + s;
    for (let i = 0; i < 14; i++) {
      x += 1;
      y += Math.round(Math.sin(i * 0.8 + s) * 0.8);
      g.set(x, y, KELP[s % 3]);
      if (i % 4 === 2) { g.set(x, y - 1, KELP[3]); g.set(x + 1, y + 1, KELP[1]); }
    }
  }
  blob(g, 39, 9, 7, 4, KELP[1]);
  blob(g, 40, 8, 4, 2, KELP[2]);
  for (let i = 0; i < 10; i++) g.set(33 + rand() * 13, 5 + rand() * 8, KELP[3]);
  g.set(36, 8, KELP[3]);
  g.set(40, 10, KELP[3]);
  g.set(38, 11, '#5a8a40');
  return g.rows();
}
function seep() {
  const g = new Grid(32, 16);
  // A fan out from the top edge (the door's sill) to a puddle.
  for (let y = 0; y < 10; y++) {
    const w = 3 + y;
    for (let x = 16 - w; x <= 16 + w; x++) if (rand() < 0.75 - y * 0.03) g.set(x, y, y < 3 ? WATER[1] : '#1c3436');
  }
  blob(g, 16, 11, 11, 4, WATER[0], 0.2);
  blob(g, 16, 11, 8, 2, WATER[1], 0.2);
  g.line(12, 10, 17, 10, SEA[1]);
  g.set(20, 12, SALT);
  g.set(9, 12, SEA[1]);
  return g.rows();
}
function pillarFallen() {
  const g = new Grid(32, 16);
  // The broken-off top of a pillar lying on its side: a length of the ribbed shaft, then the
  // collar and its crown of spikes pointing east, and the chips round it.
  const [lo, mid, hi, dark] = ['#1a262a', '#364246', '#4a6a68', '#04070a'];
  g.rect(3, 6, 15, 7, mid);
  g.rect(3, 6, 15, 2, hi);
  g.rect(3, 11, 15, 2, lo);
  g.rect(10, 6, 1, 7, lo);
  g.line(3, 6, 1, 9, mid);
  g.line(3, 12, 1, 9, lo);
  g.set(2, 8, dark);
  g.set(3, 10, dark);
  g.rect(18, 4, 4, 10, '#40484c');
  g.rect(18, 4, 4, 1, hi);
  g.rect(21, 4, 1, 10, lo);
  for (const [y, len, dy] of [[5, 6, -2], [8, 8, 0], [11, 6, 2], [7, 5, -1]]) g.line(22, y, 22 + len, y + dy, y === 8 ? hi : mid);
  g.outline(OUT);
  for (const [x, y] of [[26, 14], [8, 15], [14, 15], [29, 12]]) { g.set(x, y, mid); g.set(x + 1, y, dark); }
  return g.rows();
}

export const LL_PROP_SPRITES = {
  ll_big_oilskin: bigOilskin(),
  ll_chalk_circle: circle(false),
  ll_scorch_circle: circle(true),
  ll_chalk_sums: sums(),
  ll_chalk_hand: hand(),
  ll_floor_circle: floorCircle(),
  ll_dead_lamp: deadLamp(),
  ll_pipes_run: pipes('run'),
  ll_pipes_valve: pipes('valve'),
  ll_pipes_end: pipes('end'),
  ll_pipe_riser: pipeRiser(),
  ll_chain_hook: chainHook(),
  ll_lamp_bracket: lampBracket(),
  ll_tide_marks: tideMarks(),
  ll_drums: drums(),
  ll_drum_tipped: drumTipped(),
  ll_oil_spill: oilSpill(),
  ll_coal_spill: coalSpill(),
  ll_grating: grating(),
  ll_kelp_drag: kelpDrag(),
  ll_seep: seep(),
  ll_pillar_fallen: pillarFallen(),
};

export const LL_PALETTE_EXTRA = palette;

// How many tiles wide each big one stands.
export const LL_FOOTPRINTS = {
  ll_chalk_circle: 2,
  ll_scorch_circle: 2,
  ll_chalk_sums: 2,
  ll_chalk_hand: 2,
  ll_floor_circle: 3,
  ll_dead_lamp: 4,
  ll_pipes_run: 2,
  ll_pipes_valve: 2,
  ll_pipes_end: 2,
  ll_tide_marks: 2,
  ll_drums: 2,
  ll_drum_tipped: 2,
  ll_oil_spill: 2,
  ll_coal_spill: 2,
  ll_kelp_drag: 3,
  ll_seep: 2,
  ll_pillar_fallen: 2,
};
