// Life-pass props for the ghost ship, the Fair Return (round 2, 15 November 2026): the crew's belongings, the little
// signs that somebody lived here, and the sea getting in. Drawn like lanesLife.js: rows of characters from a small
// painter, 16 pixels to a tile, standing on the bottom edge. Every id starts `r5g_`. Colours are the ship's own: cold
// grey-green wood and weed, with the odd faded thing that used to be a colour. Nothing hangs in the air: every lamp,
// cage, hammock and string of weed has its post, hook or peg drawn in.
//
//   things that were somebody's: r5g_mug r5g_dice r5g_unsent r5g_toy r5g_boots r5g_tin r5g_cards r5g_sewing
//       r5g_spyglass r5g_bottle r5g_noughts r5g_ratdoor
//   things on posts:            r5g_slate r5g_fiddle r5g_knots r5g_cage (swings) r5g_hammock (swings)
//   the sea getting in:         r5g_barnacles r5g_weed (sways) r5g_hook_lamp (gutters) r5g_bucket (drips)

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xeb00 + colors.size);
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

  line(x0, y0, x1, y1, c) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) this.set(x0 + ((x1 - x0) * i) / steps, y0 + ((y1 - y0) * i) / steps, c);
  }

  disc(cx, cy, rx, ry, c) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) this.set(x, y, c);
      }
    }
  }

  // A dark edge round everything drawn.
  outline(c = INK) {
    const at = (x, y) => x >= 0 && y >= 0 && x < this.w && y < this.h && this.cells[y][x];
    const pts = [];
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      if (!at(x, y) && (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1))) pts.push([x, y]);
    }
    for (const [x, y] of pts) this.set(x, y, c);
    return this;
  }

  rows() {
    return this.cells.map((row) => row.map((c) => (c ? char(c) : '.')).join(''));
  }
}

const frames = (fn, n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`f${i + 1}`, fn(i)]));
const INK = '#0c1416';
const WOOD = ['#1c2826', '#304038', '#4a5e52', '#6c8070', '#90a090'];
const IRON = ['#1c2226', '#363e46', '#58626c', '#8494a0'];
const BRASS = ['#4a3a18', '#8a6a28', '#c4a040', '#eed070'];
const CANVAS = ['#6a6858', '#98967c', '#bcb898', '#d8d4b4'];
const WEED = ['#14281e', '#1f4030', '#2f5c40', '#4a7e56'];
const SHELL = ['#7a8478', '#a8b0a0', '#d4dccc', '#f0f6e8'];
const PAPER = ['#9a9886', '#c8c6b0', '#eeead4'];
const RED = ['#5a2018', '#8e3224', '#bc5038'];
const TAN = ['#6a5438', '#947850', '#b89c6c'];
const COLD = ['#7aa8a8', '#b8e0dc', '#f2fffa'];

// ---------------------------------------------------------------------------------------------
// THINGS THAT WERE SOMEBODY'S

// A tin mug of tea gone cold a hundred years ago, with the ring it left.
function mug() {
  const g = new Grid(16, 12);
  g.disc(8, 9, 6, 2, WOOD[0]);
  g.rect(5, 3, 6, 7, IRON[2]);
  g.rect(5, 3, 2, 7, IRON[3]);
  g.rect(9, 3, 2, 7, IRON[1]);
  g.rect(5, 3, 6, 1, IRON[1]);
  g.rect(6, 4, 4, 1, '#3a2c1c');
  g.line(11, 4, 13, 5, IRON[2]);
  g.line(13, 5, 13, 7, IRON[2]);
  g.line(13, 7, 11, 8, IRON[2]);
  return g.outline().rows();
}

// Two bone dice and a few coins, left where the game stopped.
function dice() {
  const g = new Grid(16, 10);
  g.rect(2, 4, 4, 4, SHELL[2]);
  g.rect(2, 4, 4, 1, SHELL[3]);
  g.set(3, 5, INK); g.set(4, 6, INK);
  g.rect(8, 3, 4, 4, SHELL[2]);
  g.rect(8, 3, 4, 1, SHELL[3]);
  g.set(9, 4, INK); g.set(10, 4, INK); g.set(9, 6, INK); g.set(10, 6, INK);
  g.disc(13, 7, 1.5, 1, BRASS[2]); g.set(13, 7, BRASS[0]);
  g.disc(7, 8, 1.5, 1, BRASS[1]);
  g.disc(1, 8, 1.5, 1, BRASS[2]);
  return g.outline().rows();
}

// A letter never posted: folded, a red seal, an address in a careful hand.
function unsent() {
  const g = new Grid(16, 12);
  g.rect(3, 3, 10, 7, PAPER[2]);
  g.rect(3, 9, 10, 1, PAPER[0]);
  g.rect(3, 3, 1, 7, PAPER[1]);
  g.line(3, 3, 8, 7, PAPER[1]);
  g.line(13, 3, 8, 7, PAPER[1]);
  g.rect(5, 8, 6, 1, '#5a5848');
  g.disc(8, 6, 1.5, 1.5, RED[1]);
  g.set(8, 6, RED[2]);
  g.rect(11, 8, 2, 1, '#8a7a5a');
  return g.outline().rows();
}

// A half-carved whale on a block, the knife stood in it, the shavings still lying.
function toy() {
  const g = new Grid(16, 14);
  g.disc(8, 9, 6, 3, TAN[1]);
  g.rect(2, 8, 5, 3, TAN[1]);
  g.rect(11, 6, 3, 3, TAN[1]);
  g.rect(13, 5, 2, 2, TAN[2]);
  g.rect(3, 6, 8, 2, TAN[2]);
  g.rect(4, 6, 4, 1, '#c8b080');
  g.set(4, 8, INK);
  g.rect(2, 10, 12, 1, TAN[0]);
  g.line(9, 3, 11, 6, IRON[3]);
  g.rect(8, 1, 2, 2, WOOD[3]);
  g.set(1, 11, TAN[2]); g.set(14, 11, TAN[2]); g.set(0, 10, '#c8b080'); g.set(15, 12, '#c8b080');
  return g.outline().rows();
}

// A pair of sea boots set neatly together, toes to the door, as if for morning.
function boots() {
  const g = new Grid(16, 12);
  for (const x0 of [2, 9]) {
    g.rect(x0, 2, 4, 5, '#2a2218');
    g.rect(x0, 2, 1, 5, '#463828');
    g.rect(x0, 7, 6, 3, '#2a2218');
    g.rect(x0, 7, 6, 1, '#463828');
    g.rect(x0 - 1, 9, 7, 1, '#10100c');
    g.rect(x0, 2, 4, 1, '#6a5a3e');
  }
  return g.outline().rows();
}

// A tin of ship's biscuit with the lid up. One biscuit has been got at.
function tin() {
  const g = new Grid(16, 12);
  g.rect(2, 5, 12, 6, IRON[1]);
  g.rect(2, 5, 12, 1, IRON[3]);
  g.rect(3, 6, 10, 1, '#0c1214');
  g.rect(4, 6, 3, 1, TAN[2]); g.rect(8, 6, 4, 1, TAN[1]);
  g.rect(3, 1, 10, 3, IRON[2]);
  g.rect(3, 1, 10, 1, IRON[3]);
  g.set(7, 2, INK); g.set(8, 2, INK);
  g.rect(11, 9, 3, 1, BRASS[1]);
  return g.outline().rows();
}

// A hand of cards, face down, one turned up.
function cards() {
  const g = new Grid(16, 10);
  for (let i = 0; i < 4; i++) g.rect(2 + i * 2, 3 + (i % 2), 4, 5, i % 2 ? CANVAS[3] : '#a89c80');
  for (let i = 0; i < 4; i++) g.rect(3 + i * 2, 4 + (i % 2), 2, 1, RED[0]);
  g.rect(10, 2, 4, 6, PAPER[2]);
  g.set(11, 3, RED[1]); g.set(11, 4, RED[1]); g.rect(12, 6, 1, 1, INK);
  return g.outline().rows();
}

// The sailmaker's palm, a needle and a hank of thread on a scrap of canvas.
function sewing() {
  const g = new Grid(16, 8);
  g.rect(1, 3, 12, 4, CANVAS[1]);
  g.rect(1, 3, 12, 1, CANVAS[2]);
  g.line(3, 4, 11, 5, CANVAS[0]);
  g.disc(12, 4, 2, 2, TAN[1]);
  g.rect(11, 3, 2, 1, TAN[2]);
  g.line(4, 1, 8, 4, IRON[3]);
  g.set(9, 5, RED[2]); g.set(10, 6, RED[2]);
  return g.outline().rows();
}

// A brass spyglass with its leather cap off, left on the nearest flat thing.
function spyglass() {
  const g = new Grid(16, 8);
  g.rect(1, 3, 6, 3, BRASS[1]);
  g.rect(1, 3, 6, 1, BRASS[3]);
  g.rect(7, 3, 5, 2, TAN[1]);
  g.rect(7, 3, 5, 1, TAN[2]);
  g.rect(12, 2, 2, 4, BRASS[2]);
  g.rect(12, 3, 1, 2, COLD[1]);
  g.rect(3, 3, 1, 3, BRASS[0]);
  return g.outline().rows();
}

// A corked bottle with a rolled paper in it (the bilge's errand).
function bottle() {
  const g = new Grid(16, 14);
  g.rect(5, 5, 6, 8, '#2c5a54');
  g.rect(5, 5, 2, 8, '#58968c');
  g.rect(7, 2, 2, 3, '#2c5a54');
  g.rect(7, 1, 2, 1, TAN[2]);
  g.rect(7, 6, 3, 5, PAPER[2]);
  g.line(7, 7, 9, 7, '#6a6858'); g.line(7, 9, 9, 9, '#6a6858');
  g.rect(5, 12, 6, 1, '#1c3c38');
  return g.outline().rows();
}

// Noughts and crosses scratched in a plank with a knife-point. It is X's turn.
function noughts() {
  const g = new Grid(16, 12);
  const s = WOOD[0];
  g.rect(5, 1, 1, 10, s); g.rect(10, 1, 1, 10, s); g.rect(1, 4, 14, 1, s); g.rect(1, 8, 14, 1, s);
  for (const [cx, cy] of [[3, 2], [8, 6], [13, 10]]) { g.line(cx - 1, cy - 1, cx + 1, cy + 1, '#9aa890'); g.line(cx - 1, cy + 1, cx + 1, cy - 1, '#9aa890'); }
  for (const [cx, cy] of [[8, 2], [3, 6]]) { g.disc(cx, cy, 1.2, 1.2, '#9aa890'); g.set(cx, cy, null); }
  return g.rows();
}

// A rat's door at the foot of a bulkhead: an arch, a thimble for a lamp, a rind on the step.
function ratdoor() {
  const g = new Grid(16, 12);
  g.rect(4, 4, 8, 7, WOOD[3]);
  g.disc(8, 5, 4, 2.4, WOOD[3]);
  g.rect(5, 5, 6, 6, '#06090a');
  g.disc(8, 6, 3, 2, '#06090a');
  g.rect(6, 10, 4, 1, TAN[0]);
  g.rect(10, 9, 3, 2, BRASS[2]); g.rect(10, 9, 3, 1, BRASS[3]);
  g.rect(2, 10, 3, 1, '#c8b46a'); g.set(3, 10, '#8a7a3a');
  g.set(7, 8, COLD[1]); g.set(8, 8, COLD[1]);
  return g.outline().rows();
}

// ---------------------------------------------------------------------------------------------
// THINGS ON POSTS

// A post with a slate hung on a nail, the days counted in tallies. The fifth stroke is never drawn.
function slate() {
  const g = new Grid(16, 26);
  g.rect(7, 12, 3, 13, WOOD[2]); g.rect(7, 12, 1, 13, WOOD[3]);
  g.rect(5, 24, 7, 2, WOOD[1]);
  g.rect(1, 2, 14, 11, WOOD[1]);
  g.rect(2, 3, 12, 9, '#222c2c');
  g.set(8, 1, IRON[3]); g.set(8, 2, IRON[2]);
  for (const [x, y] of [[3, 4], [5, 4], [7, 4], [9, 4], [11, 4], [3, 7], [5, 7], [7, 7], [9, 7], [3, 10], [5, 10]]) g.rect(x, y, 1, 2, '#cfd4c4');
  g.rect(12, 9, 1, 2, '#cfd4c4');
  return g.outline().rows();
}

// A fiddle hung by its scroll on a rack, the bow on the next peg. Nobody has taken it down.
function fiddle() {
  const g = new Grid(16, 28);
  g.rect(2, 3, 2, 24, WOOD[2]); g.rect(12, 3, 2, 24, WOOD[2]);
  g.rect(1, 2, 14, 2, WOOD[3]);
  g.rect(1, 26, 4, 2, WOOD[1]); g.rect(11, 26, 4, 2, WOOD[1]);
  g.line(7, 4, 7, 6, IRON[3]);
  g.disc(8, 8, 1, 1, TAN[2]);
  g.rect(7, 9, 2, 3, TAN[1]);
  g.disc(8, 15, 3, 3.6, TAN[1]); g.disc(8, 20, 3.6, 4, TAN[1]);
  g.rect(7, 14, 2, 8, TAN[0]);
  g.rect(5, 16, 1, 3, INK); g.rect(10, 16, 1, 3, INK);
  g.rect(8, 11, 1, 12, '#c8c4a8');
  g.line(12, 5, 12, 22, TAN[2]);
  return g.outline().rows();
}

// A board of knots on two legs: the bosun's lessons, bowline to monkey's fist.
function knots() {
  const g = new Grid(16, 24);
  g.rect(2, 14, 2, 10, WOOD[2]); g.rect(12, 14, 2, 10, WOOD[2]);
  g.rect(1, 2, 14, 13, WOOD[1]);
  g.rect(1, 2, 14, 1, WOOD[3]);
  for (const [x, y, c] of [[3, 5, CANVAS[3]], [8, 5, CANVAS[2]], [12, 5, CANVAS[3]], [4, 10, CANVAS[2]], [9, 10, CANVAS[3]]]) {
    g.line(x, y - 2, x, y, c); g.disc(x, y + 1, 1.6, 1.6, c); g.set(x, y + 1, WOOD[0]); g.line(x, y + 2, x + 1, y + 4, c);
  }
  g.set(1, 3, IRON[3]); g.set(14, 3, IRON[3]);
  return g.outline().rows();
}

// A bird cage on a hook arm, door wide, a perch worn pale. The parrot went with the captain's wife. It swings a little.
function cage(f = 0) {
  const g = new Grid(16, 30);
  g.rect(7, 8, 2, 21, WOOD[2]); g.rect(7, 8, 1, 21, WOOD[3]);
  g.rect(4, 27, 8, 2, WOOD[1]);
  g.rect(4, 8, 8, 2, WOOD[2]);
  const sw = [0, 1, 0, -1][f % 4];
  g.line(9, 8, 11 + sw, 11, IRON[3]);
  for (let x = 9; x <= 13; x++) g.set(x + sw, 11, BRASS[2]);
  g.rect(9 + sw, 12, 5, 1, BRASS[1]);
  g.rect(9 + sw, 19, 5, 1, BRASS[1]);
  for (const x of [9, 11, 13]) g.rect(x + sw, 13, 1, 6, BRASS[2]);
  g.rect(10 + sw, 15, 3, 1, TAN[2]);
  g.set(13 + sw, 18, BRASS[0]);
  g.rect(14 + sw, 14, 1, 4, BRASS[1]);
  return g.outline().rows();
}

// A hammock slung between two posts, still swinging. A hundred years is a long time to swing.
function hammock(f = 0) {
  const g = new Grid(32, 28);
  for (const x of [1, 29]) {
    g.rect(x, 5, 2, 22, WOOD[2]); g.rect(x, 5, 1, 22, WOOD[3]);
    g.rect(x - 1, 26, 4, 2, WOOD[1]);
    g.rect(x - 1, 8, 4, 1, IRON[2]); g.set(x, 7, IRON[3]);
  }
  const sway = Math.round(Math.sin((f / 4) * Math.PI * 2) * 2);
  for (let x = 4; x <= 28; x++) {
    const u = (x - 4) / 24;
    const y = 9 + Math.round(Math.sin(u * Math.PI) * 6);
    const o = Math.round(sway * Math.sin(u * Math.PI));
    g.set(x + o, y, CANVAS[3]);
    g.set(x + o, y + 1, CANVAS[2]);
    g.set(x + o, y + 2, CANVAS[1]);
    if (x % 3 === 0) g.set(x + o, y + 3, CANVAS[0]);
  }
  for (let i = 0; i < 4; i++) { g.line(3, 9 + i, 5 + sway / 2, 9 + i, '#8a8a74'); g.line(27 + sway / 2, 9 + i, 29, 9 + i, '#8a8a74'); }
  g.rect(14 + sway, 14, 4, 1, CANVAS[0]);
  return g.outline().rows();
}

// ---------------------------------------------------------------------------------------------
// THE SEA GETTING IN

// A knot of barnacles on a plank, white cones in a crust, each with a dark mouth.
function barnacles(seed = 3) {
  const g = new Grid(16, 10);
  let s = seed;
  const r = () => { s = (Math.imul(s, 1103515245) + 12345) >>> 0; return (s >>> 8) / 16777216; };
  g.disc(8, 7, 7, 2.4, WOOD[0]);
  for (let i = 0; i < 12; i++) {
    const x = 2 + Math.floor(r() * 12); const y = 3 + Math.floor(r() * 5);
    const big = r() > 0.6;
    g.rect(x, y, big ? 3 : 2, big ? 3 : 2, SHELL[1]);
    g.rect(x, y, big ? 2 : 1, 1, SHELL[3]);
    g.set(x + (big ? 1 : 0), y + 1, '#2c342c');
  }
  return g.outline().rows();
}

// A string of weed hung on an iron hook arm: it sways in air that isn't moving.
function weed(f = 0) {
  const g = new Grid(16, 30);
  g.rect(3, 6, 2, 23, IRON[2]); g.rect(3, 6, 1, 23, IRON[3]);
  g.rect(1, 28, 6, 2, IRON[1]);
  g.rect(3, 6, 8, 2, IRON[2]);
  g.rect(10, 7, 1, 2, IRON[3]);
  for (const [bx, len, ph] of [[8, 18, 0], [10, 22, 1.3], [6, 14, 2.4], [9, 12, 3.2]]) {
    for (let i = 0; i < len; i++) {
      const sway = Math.sin(i * 0.28 - f * 1.57 + ph) * (0.4 + i * 0.07);
      const x = bx + sway;
      g.set(x, 8 + i, WEED[1 + (i % 3 === 0 ? 1 : 0)]);
      g.set(x + 1, 8 + i, WEED[1]);
      if (i % 5 === 2) g.set(x + 2, 8 + i, WEED[3]);
    }
  }
  return g.outline().rows();
}

// A cold lantern on a hook arm, its wick going; it gutters (frame 3 is nearly out).
function hookLamp(f = 0) {
  const g = new Grid(16, 30);
  g.rect(3, 4, 2, 25, IRON[2]); g.rect(3, 4, 1, 25, IRON[3]);
  g.rect(1, 28, 6, 2, IRON[1]);
  g.rect(3, 4, 9, 2, IRON[2]);
  g.rect(11, 5, 1, 4, IRON[3]);
  g.rect(8, 9, 7, 1, IRON[2]);
  g.rect(8, 16, 7, 1, IRON[2]);
  g.rect(8, 10, 1, 6, IRON[2]); g.rect(14, 10, 1, 6, IRON[2]);
  g.rect(9, 10, 5, 6, '#143030');
  const flame = [3, 2, 1, 2][f % 4];
  const c = f % 4 === 2 ? COLD[0] : COLD[1];
  g.rect(10, 15 - flame, 3, flame, c);
  if (flame > 1) g.rect(11, 15 - flame, 1, flame, COLD[2]);
  g.set(11, 15, f % 4 === 2 ? COLD[0] : COLD[2]);
  return g.outline().rows();
}

// A pail under a leak: the drop falls, the water rings, and it never quite fills.
function bucket(f = 0) {
  const g = new Grid(16, 22);
  const drop = f % 4;
  if (drop < 3) g.rect(8, 1 + drop * 3, 1, 2, COLD[1]);
  g.rect(3, 12, 10, 9, IRON[2]);
  g.rect(3, 12, 2, 9, IRON[3]);
  g.rect(11, 12, 2, 9, IRON[1]);
  g.rect(3, 15, 10, 1, IRON[1]); g.rect(3, 19, 10, 1, IRON[1]);
  g.rect(4, 11, 8, 2, '#1e4448');
  g.rect(5, 12, 6, 1, '#4a8a90');
  if (drop === 3) { g.rect(7, 12, 3, 1, COLD[1]); g.rect(6, 11, 5, 1, '#4a8a90'); }
  g.set(2, 10, IRON[3]); g.set(13, 10, IRON[3]);
  g.line(3, 11, 8, 6, IRON[3]); g.line(8, 6, 12, 11, IRON[3]);
  return g.outline().rows();
}

export const R5G_PROP_SPRITES = {
  r5g_mug: mug(),
  r5g_dice: dice(),
  r5g_unsent: unsent(),
  r5g_toy: toy(),
  r5g_boots: boots(),
  r5g_tin: tin(),
  r5g_cards: cards(),
  r5g_sewing: sewing(),
  r5g_spyglass: spyglass(),
  r5g_bottle: bottle(),
  r5g_noughts: noughts(),
  r5g_ratdoor: ratdoor(),
  r5g_slate: slate(),
  r5g_fiddle: fiddle(),
  r5g_knots: knots(),
  r5g_cage: cage(0),
  r5g_hammock: hammock(0),
  r5g_barnacles: barnacles(),
  r5g_barnacles_b: barnacles(9),
  r5g_weed: weed(0),
  r5g_hook_lamp: hookLamp(0),
  r5g_bucket: bucket(0),
};

// Animated ones: give the prop `animation: '<name>'` and a `speed`.
export const R5G_CAGE_SPRITES = frames((i) => cage(i), 4);
export const R5G_HAMMOCK_SPRITES = frames((i) => hammock(i), 4);
export const R5G_WEED_SPRITES = frames((i) => weed(i), 4);
export const R5G_HOOK_LAMP_SPRITES = frames((i) => hookLamp(i), 4);
export const R5G_BUCKET_SPRITES = frames((i) => bucket(i), 4);

export const R5G_PALETTE = palette;
export const R5G_PALETTE_EXTRA = palette;

// How many tiles wide each wider one stands.
export const R5G_FOOTPRINTS = {
  r5g_hammock: 2,
};
