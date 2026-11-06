// Props for Chapter 4's three underground regions: the Diggings (the mines),
// the Stillwater (the lake) and the Deep. Each prop is { palette, rows } with
// its own palette, drawn onto a small grid by the helpers below (16 px per
// tile, standing on the bottom edge, centred). At load the palettes are
// folded into PROP_PALETTE (each prop's colours get characters of their own,
// so none of them can clash with another prop's), and the rows registered
// in props.js like any other art file's.
//
// The ones that move are also animations (the frames of a NAME_SPRITES with
// its NAME_PALETTE, see src/engine/animations.js): put `animation: 'glow_reeds'`
// on a prop of the same name, with `speed` seconds a frame.

// --- A tiny pixel grid to draw on. ---
function noise(a, b = 0) {
  let h = (a * 374761393 + b * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
class Grid {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.cells = Array.from({ length: h }, () => Array(w).fill('.'));
  }
  px(x, y, c) { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.cells[y][x] = c; return this; }
  at(x, y) { return this.cells[y]?.[x] ?? '.'; }
  rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.px(x + i, y + j, c); return this; }
  ell(cx, cy, rx, ry, c) {
    for (let y = Math.ceil(cy - ry); y <= Math.floor(cy + ry); y++) {
      const t = ry ? (y - cy) / ry : 0;
      const dx = rx * Math.sqrt(Math.max(0, 1 - t * t));
      for (let x = Math.round(cx - dx); x <= Math.round(cx + dx); x++) this.px(x, y, c);
    }
    return this;
  }
  line(x0, y0, x1, y1, c) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) this.px(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c);
    return this;
  }
  // A dark edge round everything drawn so far.
  outline(c = 'k') {
    const marks = [];
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      if (this.cells[y][x] !== '.') continue;
      if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => this.at(x + dx, y + dy) !== '.' && this.at(x + dx, y + dy) !== c)) marks.push([x, y]);
    }
    for (const [x, y] of marks) this.cells[y][x] = c;
    return this;
  }
  rows() { return this.cells.map((r) => r.join('')); }
}

// --- Registration. ---
const DEEP_PALETTE_EXTRA = {};
const DEEP_PROP_SPRITES = {};
const DEEP_FOOTPRINTS = {};
let nextChar = 0x4e00;
// Gives each colour of a prop a character no other prop uses.
function register(name, { palette, rows }, footprint = 1) {
  const map = {};
  for (const [key, color] of Object.entries(palette)) {
    const char = String.fromCharCode(nextChar++);
    map[key] = char;
    DEEP_PALETTE_EXTRA[char] = color;
  }
  DEEP_PROP_SPRITES[name] = rows.map((row) => [...row].map((ch) => map[ch] ?? '.').join(''));
  if (footprint > 1) DEEP_FOOTPRINTS[name] = footprint;
}
const frames = (n, draw) => Array.from({ length: n }, (_, i) => draw(i));
// A prop made of one drawing.
function still(name, palette, w, h, draw, footprint = 1) {
  const g = new Grid(w, h);
  draw(g);
  register(name, { palette, rows: g.rows() }, footprint);
  return g.rows();
}
// A prop made of several frames: registered with its first frame, and the
// frames returned (named a, b, c...) for the animation export.
function moving(name, palette, w, h, count, draw, footprint = 1) {
  const list = frames(count, (i) => { const g = new Grid(w, h); draw(g, i); return g.rows(); });
  register(name, { palette, rows: list[0] }, footprint);
  return Object.fromEntries(list.map((rows, i) => ['abcdefgh'[i], rows]));
}

// ======================= THE DIGGINGS =======================
const WOOD = { k: '#120c1c', m: '#7a5630', l: '#a77a48', d: '#4a3018', D: '#2a1c10' };
const IRON = { i: '#5a5a68', I: '#8a8a9a', j: '#2e2e38' };
const ROCK = { s: '#5a4a3c', S: '#7a6a58', t: '#3a2e26', c: '#b8743a', g: '#4c9a78', q: '#d8d0c0' };

// A tunnel prop: a post under a cap beam, braced, standing on a stone chock.
still('mine_timber', { ...WOOD, ...ROCK }, 16, 32, (g) => {
  g.rect(5, 7, 6, 23, 'm').rect(5, 7, 2, 23, 'l').rect(9, 7, 2, 23, 'd');
  for (let y = 10; y < 28; y += 6) g.px(7 + (y % 2), y, 'd').px(8, y + 2, 'D');
  g.rect(1, 2, 14, 5, 'm').rect(1, 2, 14, 1, 'l').rect(1, 6, 14, 1, 'd');
  g.px(3, 4, 'D').px(12, 4, 'D');
  g.line(4, 13, 1, 8, 'm').line(5, 13, 2, 8, 'd').line(11, 13, 14, 8, 'm').line(10, 13, 13, 8, 'd');
  g.rect(3, 28, 10, 3, 's').rect(3, 28, 10, 1, 'S').px(4, 30, 't').px(11, 30, 't');
  g.outline('k');
});

// An old mine lamp on a short post: a dim flame behind dusty glass.
const LAMP_PAL = { ...WOOD, ...IRON, y: '#6a5222', f: '#ffcf6a', h: '#fff0b0', e: '#c8883a', ...ROCK };
function drawLamp(g, i, hung = false) {
  const top = hung ? 9 : 3;
  g.rect(5, top, 6, 10, 'i').rect(5, top, 6, 1, 'I').rect(5, top + 9, 6, 1, 'j');
  g.rect(6, top + 1, 4, 8, 'y');
  const tall = i === 0 ? 5 : 4;
  g.rect(7, top + 8 - tall, 2, tall, i === 0 ? 'f' : 'e').rect(7, top + 9 - tall, 2, tall - 2, i === 0 ? 'h' : 'f');
  g.rect(6, top - 2, 4, 2, 'i').px(7, top - 3, 'I').px(8, top - 3, 'I');
  return top;
}
const mineLamp = moving('mine_lamp', LAMP_PAL, 16, 24, 2, (g, i) => {
  const top = drawLamp(g, i);
  g.rect(7, top + 10, 2, 8, 'm').rect(7, top + 10, 1, 8, 'l');
  g.rect(4, 21, 8, 2, 's').rect(4, 21, 8, 1, 'S');
  g.outline('k');
});
const mineLampHung = moving('mine_lamp_hung', LAMP_PAL, 16, 32, 2, (g, i) => {
  g.rect(1, 0, 3, 31, 'm').rect(1, 0, 1, 31, 'l').rect(3, 0, 1, 31, 'd');
  g.rect(1, 0, 14, 3, 'm').rect(1, 0, 14, 1, 'l').rect(1, 2, 14, 1, 'd');
  g.line(8, 3, 8, 8, 'i');
  g.px(7, 5, 'I').px(9, 6, 'I');
  drawLamp(g, i, true);
  g.rect(0, 29, 6, 2, 's').rect(0, 29, 6, 1, 'S');
  g.outline('k');
});

still('pickaxe_in_rock', { ...WOOD, ...IRON, ...ROCK }, 16, 16, (g) => {
  g.ell(7.5, 11.5, 6, 3.6, 's').ell(7, 10.5, 4.5, 2.4, 'S').rect(2, 13, 11, 1, 't');
  g.px(5, 9, 'q').px(10, 11, 'c').px(4, 12, 'c').px(11, 9, 'g');
  g.line(9, 9, 13, 2, 'm').line(10, 9, 14, 2, 'd');
  // The head: a curved iron bar across the top of the handle.
  g.line(10, 1, 15, 3, 'i').line(11, 1, 15, 2, 'I').px(10, 2, 'j').px(15, 4, 'j').px(9, 3, 'j');
  g.outline('k');
});

still('spoil_heap', { ...ROCK, ...WOOD, ...IRON }, 32, 16, (g) => {
  for (let x = 1; x < 31; x++) {
    const t = (x - 1) / 29;
    const high = Math.round(4 + 9 * Math.sin(t * Math.PI) ** 0.9 + (noise(x, 1) - 0.5) * 1.6);
    for (let y = 15 - high; y < 15; y++) {
      const r = noise(x, y);
      g.px(x, y, r < 0.12 ? 't' : r < 0.55 ? 's' : 'S');
    }
  }
  for (let i = 0; i < 9; i++) {
    const x = 4 + Math.floor(noise(i, 7) * 22);
    const y = 6 + Math.floor(noise(i, 8) * 7);
    if (g.at(x, y) !== '.') g.px(x, y, i % 3 === 0 ? 'c' : i % 3 === 1 ? 'q' : 'g');
  }
  for (let x = 2; x < 30; x += 3) if (g.at(x, 14) !== '.') g.px(x, 14, 't');
  // A shovel left stuck in it.
  g.line(24, 3, 22, 10, 'm').line(25, 3, 23, 10, 'l').rect(21, 9, 4, 3, 'i').px(21, 9, 'I').px(24, 2, 'j');
  g.outline('k');
}, 2);

still('ore_sacks', { k: '#120c1c', b: '#a8905a', B: '#8a7444', n: '#6a5a34', r: '#4a3a20', c: '#b8743a', q: '#d8d0c0' }, 16, 16, (g) => {
  const sack = (cx, cy, rx, ry) => {
    g.ell(cx, cy, rx, ry, 'b');
    g.ell(cx + 1, cy + 1, rx - 1.5, ry - 1.5, 'B');
    g.ell(cx - 1, cy - 1, rx - 2.5, ry - 2.5, 'b');
    g.rect(Math.round(cx) - 1, Math.round(cy - ry) - 1, 3, 2, 'n');
    g.px(cx, cy - ry, 'r');
    g.line(cx - rx + 1, cy + 1, cx + rx - 1, cy + 1, 'n');
  };
  sack(4.5, 11, 4, 4); sack(11.5, 11.5, 4, 3.5); sack(8, 5.5, 3.6, 3.6);
  g.px(5, 13, 'c').px(12, 13, 'c').px(9, 6, 'q').px(3, 10, 'c');
  g.outline('k');
});

still('mine_winch', { ...WOOD, ...IRON, ...ROCK, v: '#05030a', R: '#b0986a', Q: '#8a7448' }, 32, 28, (g) => {
  // The hole it lowers into, with a bucket on its rope just above it.
  g.ell(16, 24, 9, 2.6, 'v');
  // A-frame: two legs braced outward, a top beam, the axle through both.
  g.line(5, 3, 3, 26, 'm').line(6, 3, 4, 26, 'l').line(7, 3, 5, 26, 'd');
  g.line(26, 3, 28, 26, 'm').line(25, 3, 27, 26, 'd').line(27, 3, 29, 26, 'D');
  g.rect(4, 2, 24, 2, 'm').rect(4, 2, 24, 1, 'l');
  // The drum, wound with rope.
  g.rect(9, 8, 14, 6, 'R').rect(9, 8, 14, 1, 'Q').rect(9, 13, 14, 1, 'Q');
  for (let x = 10; x < 22; x += 2) g.line(x, 9, x, 12, 'Q');
  g.ell(9, 11, 1.6, 3.4, 'd').ell(23, 11, 1.6, 3.4, 'd');
  g.rect(5, 10, 22, 2, 'D').rect(9, 9, 14, 0, 'D');
  // The crank on the right: an arm and a handle.
  g.line(27, 11, 30, 17, 'I').line(28, 11, 31, 17, 'i').rect(30, 17, 2, 4, 'm');
  // Rope down to a small iron-banded bucket.
  g.line(16, 14, 16, 21, 'R').rect(13, 21, 7, 4, 'm').rect(13, 21, 7, 1, 'i').rect(13, 23, 7, 1, 'i').px(14, 22, 'l');
  g.rect(1, 25, 5, 2, 'd').rect(26, 25, 5, 2, 'd');
  g.outline('k');
}, 2);

// The same winch turning, for the lift going down: the crank comes round, the
// rope winds on the drum and the bucket bobs on its line. (An animation only
// the lift scene plays; the standing winch is the still above.)
const WINCH_PAL = { ...WOOD, ...IRON, ...ROCK, v: '#05030a', R: '#b0986a', Q: '#8a7448' };
const winchTurn = moving('mine_winch_turn', WINCH_PAL, 32, 28, 4, (g, i) => {
  g.ell(16, 24, 9, 2.6, 'v');
  g.line(5, 3, 3, 26, 'm').line(6, 3, 4, 26, 'l').line(7, 3, 5, 26, 'd');
  g.line(26, 3, 28, 26, 'm').line(25, 3, 27, 26, 'd').line(27, 3, 29, 26, 'D');
  g.rect(4, 2, 24, 2, 'm').rect(4, 2, 24, 1, 'l');
  g.rect(9, 8, 14, 6, 'R').rect(9, 8, 14, 1, 'Q').rect(9, 13, 14, 1, 'Q');
  for (let x = 10 + (i % 2); x < 22; x += 2) g.line(x, 9, x, 12, 'Q');
  g.ell(9, 11, 1.6, 3.4, 'd').ell(23, 11, 1.6, 3.4, 'd');
  g.rect(5, 10, 22, 2, 'D');
  // The crank goes round the axle: down, out, up, in.
  const spots = [[28, 17], [31, 11], [29, 5], [25, 11]];
  const [cx, cy] = spots[i];
  g.line(27, 11, cx, cy, 'I').line(28, 11, cx + 1, cy, 'i').rect(cx, cy, 2, 3, 'm');
  // The bucket swings a pixel or two as it goes.
  const bob = [0, 1, 0, -1][i];
  g.line(16, 14, 16, 21 + bob, 'R').rect(13, 21 + bob, 7, 4, 'm').rect(13, 21 + bob, 7, 1, 'i').rect(13, 23 + bob, 7, 1, 'i').px(14, 22 + bob, 'l');
  g.rect(1, 25, 5, 2, 'd').rect(26, 25, 5, 2, 'd');
  g.outline('k');
}, 2);

still('warning_sign', { ...WOOD, p: '#c8a870', P: '#a8885a', r: '#b82a22', R: '#7a1a14' }, 16, 24, (g) => {
  g.rect(7, 10, 2, 13, 'm').rect(7, 10, 1, 13, 'l');
  g.rect(2, 1, 12, 10, 'P').rect(3, 2, 10, 8, 'p');
  g.rect(3, 2, 10, 1, 'P');
  g.px(3, 2, 'D').px(12, 2, 'D').px(3, 9, 'D').px(12, 9, 'D');
  // A bold red mark: a stroke and a dot, hand-painted and a bit wonky.
  g.rect(7, 3, 2, 4, 'r').px(8, 3, 'R').rect(7, 8, 2, 1, 'r').px(6, 4, 'r').px(9, 5, 'r');
  g.rect(5, 22, 6, 1, 'd');
  g.outline('k');
});

still('toolbox', { ...WOOD, ...IRON, ...ROCK, a: '#6a4a2a' }, 16, 16, (g) => {
  // Tools standing up out of it: a hammer, a chisel, a saw's blade.
  g.rect(3, 4, 4, 3, 'i').px(3, 4, 'I').rect(4, 6, 1, 4, 'm');
  g.line(8, 9, 9, 2, 'I').px(9, 2, 'j').px(9, 1, 'j');
  g.rect(11, 3, 2, 7, 'I').rect(11, 3, 1, 7, 'q').px(12, 3, 'j');
  g.rect(2, 8, 12, 6, 'a').rect(2, 8, 12, 1, 'l').rect(2, 13, 12, 1, 'd');
  g.rect(2, 8, 2, 6, 'i').rect(12, 8, 2, 6, 'i').px(2, 8, 'I').px(12, 8, 'I');
  g.rect(7, 9, 2, 2, 'I').px(7, 11, 'j');
  g.outline('k');
});

still('broken_ladder', { ...WOOD, ...IRON }, 16, 32, (g) => {
  // Left rail whole; the right one snapped, its lower half slid out of line.
  g.rect(3, 1, 2, 30, 'm').rect(3, 1, 1, 30, 'l');
  g.rect(11, 1, 2, 11, 'm').rect(11, 1, 1, 11, 'l');
  g.px(11, 12, 'm').px(12, 13, 'm').px(11, 13, 'D');
  g.rect(12, 17, 2, 14, 'm').rect(12, 17, 1, 14, 'l').px(13, 16, 'd');
  for (const y of [4, 9, 20, 25, 30]) g.rect(3, y, y < 15 ? 10 : 11, 2, 'd').rect(3, y, y < 15 ? 10 : 11, 1, 'm');
  // A rung dangling by one nail.
  g.line(5, 14, 9, 17, 'm').px(5, 14, 'D');
  g.px(4, 4, 'D').px(11, 4, 'D');
  g.outline('k');
});

still('moles_hard_hat', { ...WOOD, ...IRON, h: '#b89430', H: '#e0c050', z: '#8a6a1c', f: '#f4e8a0', w: '#4a3828' }, 16, 16, (g) => {
  // A scrap of timber with a nail, and a small hard hat hung on it.
  g.rect(2, 0, 12, 16, 'w').rect(2, 0, 1, 16, 'd').rect(13, 0, 1, 16, 'D');
  g.px(5, 4, 'D').px(10, 11, 'D');
  g.px(8, 2, 'I').px(8, 3, 'i');
  g.ell(8, 8, 4, 3.4, 'h').rect(4, 8, 9, 3, 'h');
  g.rect(5, 6, 3, 1, 'H').px(6, 5, 'H');
  g.rect(3, 11, 11, 2, 'z').rect(3, 11, 11, 1, 'h');
  g.rect(7, 8, 3, 2, 'f').px(8, 7, 'f');
  g.line(5, 13, 5, 15, 'D').line(11, 13, 11, 15, 'D');
  g.outline('k');
});

// ======================= THE STILLWATER =======================
const GLOW = { k: '#0a1018', b: '#2a4a46', c: '#6aa89a', d: '#9fd9c8', e: '#d8fff0', f: '#7fe0d0' };
function drawReeds(g, i, tall) {
  const H = g.h;
  const sway = [-1, 0, 1, 0][i % 4];
  const grow = tall ? 1.4 : 1;
  // Blades of leaf curling out low down, then the tall stems with their glowing heads.
  const blades = [[8, 2, -6, 0.55], [8, 2, 6, 0.5], [7, 2, -3, 0.8], [9, 2, 4, 0.75]];
  for (const [bx, by, dx, hgt] of blades) {
    const len = Math.round(11 * hgt * grow);
    for (let s = 0; s <= len; s++) {
      const t = s / len;
      g.px(bx + dx * t * t * 1.1 + sway * t * t * 1.5, H - by - s, t > 0.7 ? 'd' : 'c');
    }
  }
  const stems = [[3, 17, -3.5], [6, 22, -1.5], [8, 26, 0.4], [10, 21, 2], [13, 15, 3.4]];
  for (const [x, len0, lean] of stems) {
    const len = Math.round(len0 * grow);
    let hx = x;
    let hy = H - 2;
    for (let s = 0; s <= len; s++) {
      const t = s / len;
      hx = x + lean * t * t + sway * t * t * 2;
      hy = H - 2 - s;
      g.px(hx, hy, t > 0.8 ? 'd' : t > 0.4 ? 'c' : 'b');
    }
    // The seed head: a soft glowing capsule on the end.
    g.rect(hx - 0.5, hy - 3, 2, 4, 'e').px(hx - 1, hy - 2, 'f').px(hx - 1, hy - 1, 'f').px(hx + 1.5, hy - 2, 'f').px(hx + 1.5, hy - 1, 'f').px(hx, hy - 4, 'f');
  }
  g.rect(4, H - 2, 9, 2, 'b').px(6, H - 2, 'c').px(10, H - 2, 'c');
  g.outline('k');
}
const glowReeds = moving('glow_reeds', GLOW, 16, 24, 4, (g, i) => drawReeds(g, i, false));
const glowReedsTall = moving('glow_reeds_tall', GLOW, 16, 32, 4, (g, i) => drawReeds(g, i, true));

still('punt', { k: '#0a1018', w: '#6a5238', W: '#4a3a2a', l: '#8a7050', D: '#1c140c', p: '#9a8a68', P: '#6a5c40', i: '#5a5a68', I: '#8a8a9a', r: '#a89a70', R: '#6a5e40', a: '#3f6a58', v: '#070d19', n: '#1d3050', N: '#3a5a84' }, 48, 24, (g) => {
  // Water first, so the hull sits in it.
  g.rect(0, 19, 48, 5, 'v');
  for (let x = 2; x < 46; x += 6) g.rect(x, 21 + (x % 2), 4, 1, 'n');
  // The hull: a long flat boat, bow and stern lifted.
  for (let x = 3; x < 45; x++) {
    const t = (x - 3) / 41;
    const lift = Math.round(3.2 * Math.abs(2 * t - 1) ** 2.2);
    for (let y = 11 - lift; y < 20; y++) {
      const edge = y === 11 - lift ? 'l' : y > 17 ? 'W' : (y + x) % 4 === 0 ? 'W' : 'w';
      g.px(x, y, edge);
    }
    g.px(x, 19, 'W');
  }
  g.line(3, 8, 8, 12, 'W');
  // Inside, seen over the gunwale: dark, with a seat plank and a coil of rope.
  g.rect(8, 10, 32, 1, 'D');
  g.rect(18, 9, 7, 2, 'p').rect(18, 9, 7, 1, 'r');
  g.rect(33, 8, 5, 3, 'R').rect(33, 8, 5, 1, 'r').px(35, 9, 'P');
  // The pole, laid along it, and a bare hook on a post at the bow: no lantern.
  g.line(6, 8, 42, 6, 'p').line(6, 9, 42, 7, 'P');
  g.rect(5, 2, 2, 9, 'w').rect(5, 2, 1, 9, 'l');
  g.line(7, 2, 10, 2, 'i').line(10, 2, 10, 4, 'i').px(9, 5, 'I').px(8, 4, 'I');
  g.px(12, 14, 'a').px(20, 16, 'a').px(30, 15, 'a').px(38, 14, 'a');
  g.outline('k');
}, 3);

still('jetty_post', { k: '#0a1018', w: '#6a665a', W: '#4a483e', l: '#8a867a', a: '#3f6a58', r: '#a89a70', R: '#6a5e40' }, 16, 24, (g) => {
  g.rect(5, 4, 6, 19, 'w').rect(5, 4, 2, 19, 'l').rect(9, 4, 2, 19, 'W');
  g.rect(5, 3, 6, 1, 'l').px(6, 2, 'l').px(9, 2, 'w');
  g.rect(5, 18, 6, 4, 'a').px(6, 17, 'a').px(9, 18, 'W');
  // A rope turned twice round its neck, one end hanging.
  g.rect(4, 8, 8, 2, 'r').rect(4, 11, 8, 2, 'r').px(5, 9, 'R').px(8, 12, 'R').px(10, 9, 'R');
  g.line(10, 13, 11, 18, 'r').px(11, 19, 'R');
  g.outline('k');
});

still('mooring_ring', { k: '#0a1018', s: '#7a88a2', S: '#9aa8c0', t: '#4a566e', a: '#3f6a58', i: '#5a5a68', I: '#8a8a9a', j: '#2e2e38' }, 16, 16, (g) => {
  g.rect(4, 4, 8, 10, 's').rect(4, 4, 8, 2, 'S').rect(4, 6, 1, 8, 'S').rect(10, 6, 2, 8, 't').rect(4, 13, 8, 1, 't');
  g.rect(5, 11, 6, 2, 'a');
  g.ell(8, 9, 3, 3.2, 'i').ell(8, 9, 1.6, 1.8, 'j');
  g.px(6, 7, 'I').px(7, 6, 'I');
  g.px(8, 5, 'j').px(8, 4, 'i');
  g.outline('k');
});

const padsPal = { k: '#0a1018', p: '#a8d0b8', P: '#7aa890', r: '#d8f0e0', g: '#e8fff4', v: '#070d19', n: '#1d3050' };
const fungusPads = moving('fungus_pads', padsPal, 16, 16, 2, (g, i) => {
  const pad = (cx, cy, rx, ry) => {
    g.ell(cx, cy + 1, rx, ry, 'n');
    g.ell(cx, cy, rx, ry, 'P').ell(cx, cy - 0.4, rx - 1, ry - 0.7, 'p');
    g.line(cx - rx + 2, cy - 1, cx + rx - 3, cy - 1, 'r');
    g.px(cx, cy, 'v').px(cx + 1, cy - 1, 'v');
  };
  pad(5, 11, 4.5, 2.2); pad(11.5, 9, 3.6, 1.9); pad(8, 5, 3.2, 1.7);
  const on = i === 0;
  g.px(4, 10, on ? 'g' : 'r').px(12, 8, on ? 'r' : 'g').px(8, 5, on ? 'g' : 'r').px(7, 12, on ? 'r' : 'g');
  g.outline('k');
});

const sunkenTop = moving('sunken_pillar_top', { k: '#0a1018', s: '#8896ae', S: '#b4c2d8', t: '#5f6e8c', a: '#3a6a64', A: '#2c5450', v: '#070d19', n: '#1d3050', N: '#3a5a84' }, 16, 24, 3, (g, i) => {
  // Ripples spreading from its foot, one ring per frame.
  const r = 5 + i * 1.6;
  g.ell(8, 20.5, r + 1, 1.8 + i * 0.3, 'n').ell(8, 20.5, r - 0.6, 1.2 + i * 0.3, '.');
  g.rect(3, 6, 10, 14, 's').rect(3, 6, 3, 14, 'S').rect(10, 6, 3, 14, 't');
  g.ell(8, 6, 5, 2.4, 'S').ell(8, 6.3, 3.4, 1.4, 't');
  for (const [x, y] of [[4, 9], [7, 12], [11, 10]]) g.px(x, y, 't');
  g.rect(3, 16, 10, 3, 'a').rect(3, 19, 10, 1, 'A');
  g.px(5, 20, 'A').px(9, 20, 'A');
  g.px(5, 4, 'S').px(11, 5, 'S');
  g.outline('k');
});

still('rowing_seat', { k: '#0a1018', w: '#6a5238', W: '#4a3a2a', l: '#8a7050', i: '#5a5a68', I: '#8a8a9a', j: '#2e2e38' }, 16, 16, (g) => {
  g.rect(1, 6, 14, 3, 'w').rect(1, 6, 14, 1, 'l').rect(1, 8, 14, 1, 'W');
  g.rect(2, 9, 2, 5, 'W').rect(12, 9, 2, 5, 'W').rect(2, 13, 12, 1, 'W');
  // An oarlock, and a hook at the head of the seat where a lantern would hang. Nothing on it.
  g.rect(12, 3, 2, 3, 'i').px(12, 3, 'I').px(13, 2, 'j');
  g.rect(3, 1, 2, 5, 'i').px(3, 1, 'I').line(5, 1, 7, 1, 'i').line(7, 1, 7, 3, 'i').px(6, 4, 'I').px(5, 3, 'j');
  g.outline('k');
});

// ======================= THE DEEP =======================
const D_OUT = '#05040a';
const VEIN_DARK = { k: D_OUT, a: '#16222b', b: '#22313d', c: '#2f4352', d: '#405a6c', e: '#52748a', r: '#0e0c14', R: '#1c1926' };
const VEIN_LIT = { k: D_OUT, a: '#14486e', b: '#2a74ac', c: '#52a8dc', d: '#8ad4f8', e: '#e8fbff', f: '#b8f0ff', r: '#0e0c14', R: '#1c1926' };
// A great crystal root coming up out of the rock and splitting as it climbs.
function drawRoot(g, i, lit) {
  // Flat roots spreading along the floor.
  const spread = (sx, ex) => {
    const dir = ex > sx ? 1 : -1;
    for (let x = sx; x !== ex; x += dir) {
      const k = Math.abs(x - sx) / Math.abs(ex - sx);
      const y = 36 + Math.round(k * 2.4 + Math.sin(x * 0.8) * 0.6);
      g.rect(x, y, 1, 3 - Math.floor(k * 2), 'b').px(x, y, 'c');
    }
  };
  spread(16, 1); spread(16, 31);
  // A crystal rod: from (x0,y0) up to (x1,y1), thickness w, faceted (lit on the left).
  const rod = (x0, y0, x1, y1, w, tip = true) => {
    const n = Math.abs(y1 - y0);
    for (let s = 0; s <= n; s++) {
      const t = s / n;
      const cx = x0 + (x1 - x0) * t;
      const y = y0 - s;
      const half = w * (1 - 0.45 * t) / 2;
      for (let x = Math.round(cx - half); x <= Math.round(cx + half - 0.01); x++) {
        const rel = (x - (cx - half)) / (2 * half || 1);
        g.px(x, y, rel < 0.34 ? 'c' : rel < 0.7 ? 'b' : 'a');
      }
      g.px(cx - half + 0.5, y, s % 5 === 0 ? 'd' : 'c');
    }
    if (tip) {
      const half = w * 0.55 / 2;
      for (let k = 1; k <= 4; k++) {
        const hw = Math.max(0, half - k * 0.5);
        for (let x = Math.round(x1 - hw); x <= Math.round(x1 + hw); x++) g.px(x, y1 - n * 0 - k, x <= x1 - hw + 0.8 ? 'c' : 'b');
      }
    }
  };
  rod(16, 38, 15, 12, 7);
  rod(14, 28, 6, 13, 4);
  rod(18, 24, 26, 8, 4.4);
  rod(15, 20, 12, 4, 3);
  rod(22, 33, 29, 22, 3);
  rod(10, 34, 3, 25, 3);
  // Glints: on the lit one they flicker from frame to frame.
  const spots = [[15, 14], [6, 15], [26, 10], [12, 6], [29, 24], [3, 27], [16, 30], [17, 22], [24, 14]];
  spots.forEach(([x, y], n) => {
    if (lit) {
      if ((n + i) % 3 === 0) g.px(x, y, 'e').px(x - 1, y, 'd').px(x + 1, y, 'd').px(x, y - 1, 'd').px(x, y + 1, 'd');
      else if ((n + i) % 3 === 1) g.px(x, y, 'f');
      else g.px(x, y, 'd');
    } else if (n % 2) g.px(x, y, 'e');
  });
  g.outline('k');
}
const rootVeinLit = moving('root_vein_lit', VEIN_LIT, 32, 40, 3, (g, i) => drawRoot(g, i, true), 2);
still('root_vein', VEIN_DARK, 32, 40, (g) => drawRoot(g, 0, false), 2);

// Scratch marks on a patch of smooth dark rock: tallies, very old.
const TALLY = { k: D_OUT, r: '#14121b', R: '#1c1926', o: '#0b0911', m: '#4a4660', M: '#322f44', p: '#6a668a' };
function rockPanel(g) {
  g.rect(0, 0, 16, 16, 'o').rect(1, 1, 14, 14, 'r').rect(2, 2, 12, 12, 'R');
  g.px(1, 1, 'o').px(14, 1, 'o').px(1, 14, 'o').px(14, 14, 'o');
  g.rect(2, 2, 12, 1, 'r').px(3, 3, 'r').px(12, 12, 'r');
}
// Neat fives: four strokes and a slash, row on row.
still('tally_marks_a', TALLY, 16, 16, (g) => {
  rockPanel(g);
  for (const [gx, gy, full] of [[3, 3, true], [9, 3, true], [3, 8, true], [9, 8, false]]) {
    const n = full ? 4 : 2;
    for (let s = 0; s < n; s++) g.rect(gx + s * 1.2, gy, 1, 4, 'm').px(gx + s * 1.2, gy + 1, 'p');
    if (full) g.line(gx - 1, gy + 3, gx + 5, gy, 'm');
  }
  g.rect(3, 13, 3, 1, 'M');
});
// Single strokes, long rows of them, as a count of days kept without hope of an end.
still('tally_marks_b', TALLY, 16, 16, (g) => {
  rockPanel(g);
  for (let row = 0; row < 3; row++) for (let s = 0; s < 8; s++) {
    if (row === 2 && s > 5) break;
    g.rect(3 + s * 1.3, 3 + row * 4, 1, 3, s % 3 === 0 ? 'p' : 'm');
  }
  g.line(2, 9, 13, 7, 'M');
});
// A child's: wobbly strokes, a sun with rays, a stick figure holding a stick.
still('tally_marks_c', TALLY, 16, 16, (g) => {
  rockPanel(g);
  g.ell(5, 5, 1.6, 1.6, 'm');
  for (const [dx, dy] of [[0, -3], [3, 0], [0, 3], [-3, 0], [2, -2], [2, 2], [-2, -2], [-2, 2]]) g.px(5 + dx, 5 + dy, 'M');
  g.ell(11, 6, 1, 1, 'm').line(11, 7, 11, 10, 'm').line(11, 8, 9, 9, 'm').line(11, 8, 13, 7, 'm').line(11, 10, 10, 12, 'm').line(11, 10, 12, 12, 'm');
  for (let s = 0; s < 4; s++) g.rect(3 + s * 2, 12 - (s % 2), 1, 2, s % 2 ? 'M' : 'm');
});

still('cold_campfire', { k: D_OUT, s: '#4a4660', S: '#6a668a', t: '#2a2736', a: '#26232f', A: '#34303f', c: '#14110d', C: '#241c14', w: '#4a4036' }, 16, 16, (g) => {
  g.ell(8, 10, 7, 3.8, 'a');
  g.ell(8, 10.5, 5, 2.4, 'A').px(7, 10, 'a').px(10, 11, 'a').px(5, 9, 'a');
  // Charred sticks, burnt through, a stub of a log.
  g.line(4, 11, 11, 9, 'c').line(5, 12, 12, 11, 'c').line(5, 9, 10, 12, 'C').px(8, 8, 'w');
  g.rect(2, 8, 3, 2, 'c');
  // The ring of stones.
  for (let n = 0; n < 9; n++) {
    const a = (n / 9) * Math.PI * 2 + 0.3;
    const x = 8 + Math.cos(a) * 6.3;
    const y = 10 + Math.sin(a) * 3.6;
    g.rect(x - 1, y - 1, 3, 2, 's').px(x - 1, y - 1, 'S').px(x + 1, y, 't');
  }
  g.outline('k');
});

still('old_bedroll', { k: D_OUT, m: '#4a4236', M: '#6a5e4c', n: '#2e2a22', b: '#4a3e50', B: '#6a5c6a', p: '#5a5060', P: '#7a6e84', c: '#8a8274' }, 16, 16, (g) => {
  // A child's size: a mat rolled out, a blanket kicked half off, a flat pillow.
  g.rect(1, 6, 14, 8, 'm').rect(1, 6, 14, 1, 'M').rect(1, 13, 14, 1, 'n');
  g.rect(2, 8, 8, 6, 'b').rect(2, 8, 8, 1, 'B').rect(2, 13, 8, 1, 'n');
  for (const x of [4, 7]) g.line(x, 9, x, 12, 'B');
  g.rect(10, 8, 4, 4, 'p').rect(10, 8, 4, 1, 'P').px(12, 10, 'P');
  g.px(1, 13, '.').px(14, 13, '.');
  // A candle stub by the head of it, long since out.
  g.rect(14, 4, 2, 3, 'c').px(14, 3, 'n');
  g.outline('k');
});

still('little_cairn', { k: D_OUT, a: '#1c1926', b: '#2d2a3c', c: '#44405a', d: '#6a668a', t: '#0e0c14' }, 16, 20, (g) => {
  const stone = (cx, cy, rx, ry, body) => { g.ell(cx, cy, rx, ry, body).ell(cx - 0.8, cy - 0.6, rx - 1.6, ry - 1.2, 'c').px(cx - 2, cy - 1, 'd').rect(cx - rx + 1, cy + ry - 1, rx * 2 - 2, 1, 't'); };
  stone(8, 16, 6.2, 2.8, 'b'); stone(8.5, 12, 4.6, 2.5, 'a'); stone(7.5, 8.5, 3.4, 2.2, 'b'); stone(8, 5, 2, 1.8, 'a');
  g.outline('k');
});

// Odd smooth formations, like wax that ran and set.
const SMOOTH = { k: D_OUT, a: '#14121b', b: '#1c1926', c: '#272434', d: '#3a3649', e: '#5a5678', t: '#0b0911' };
still('smooth_stone_a', SMOOTH, 16, 32, (g) => {
  for (let y = 1; y < 31; y++) {
    const t = y / 30;
    const half = 2.6 + 4.6 * t ** 1.5 + Math.sin(y * 0.55) * 0.8 + (y > 24 ? (y - 24) * 0.4 : 0);
    const cx = 8 + Math.sin(y * 0.18) * 1.2;
    for (let x = Math.round(cx - half); x <= Math.round(cx + half); x++) {
      const rel = (x - (cx - half)) / (2 * half || 1);
      g.px(x, y, rel < 0.22 ? 'd' : rel < 0.55 ? 'c' : rel < 0.85 ? 'b' : 'a');
    }
  }
  g.rect(5, 7, 1, 3, 'e').rect(6, 17, 1, 4, 'e').px(5, 12, 'e');
  g.ell(10, 15, 1.6, 1, 'c').ell(6, 24, 2, 1.2, 'd');
  g.outline('k');
});
still('smooth_stone_b', SMOOTH, 32, 20, (g) => {
  const lobe = (cx, cy, rx, ry) => {
    g.ell(cx, cy, rx, ry, 'b').ell(cx - 1, cy - 1.2, rx - 2, ry - 2, 'c').ell(cx - 2.5, cy - 2.4, rx * 0.35, ry * 0.3, 'd');
    g.rect(Math.round(cx - rx + 2), Math.round(cy + ry - 1), Math.round(rx * 2 - 4), 1, 'a');
  };
  lobe(10, 13, 9.5, 6); lobe(21, 12, 8, 7); lobe(15.5, 8.5, 6, 4.5);
  g.px(8, 8, 'e').px(9, 8, 'e').px(18, 6, 'e').px(19, 7, 'e').px(22, 7, 'e');
  g.outline('k');
}, 2);
still('smooth_stone_c', SMOOTH, 16, 24, (g) => {
  // Two lobes leaning together, a fold between.
  for (const [cx, w, lean, top] of [[5.5, 4.2, 1.6, 6], [10.5, 4.6, -1.4, 2]]) {
    for (let y = top; y < 23; y++) {
      const t = (y - top) / (23 - top);
      const half = w * Math.min(1, 0.45 + t * 1.1) + (y > 20 ? 1 : 0);
      const x0 = cx + lean * (1 - t);
      for (let x = Math.round(x0 - half); x <= Math.round(x0 + half); x++) {
        const rel = (x - (x0 - half)) / (2 * half || 1);
        g.px(x, y, rel < 0.25 ? 'd' : rel < 0.6 ? 'c' : 'b');
      }
    }
    g.ell(cx + lean, top + 1.2, w * 0.55, 1.4, 'd');
  }
  g.line(8, 8, 8, 20, 'a');
  g.px(4, 10, 'e').px(11, 6, 'e').px(11, 7, 'e');
  g.outline('k');
});

still('big_bones', { k: '#0c0a08', b: '#b8b0a0', B: '#8a8478', s: '#4a463e', d: '#2a2820', e: '#05040a' }, 48, 24, (g) => {
  // Something huge lay down here, and the dust has settled on it since.
  for (let x = 2; x < 36; x++) {
    const y = 6 + Math.round(Math.sin(x * 0.09) * 1.4);
    g.rect(x, y, 1, 3, x % 3 === 0 ? 'B' : 'b');
    if (x % 3 === 0) g.px(x, y - 1, 'b');
  }
  for (const x of [7, 12, 17, 22, 27, 32]) {
    const reach = 16 - Math.abs(x - 20) * 0.28;
    for (let s = 0; s < reach; s++) {
      const t = s / reach;
      const rx = x + Math.round(Math.sin(t * 1.6) * 4);
      const ry = 8 + Math.round(t * 12);
      g.px(rx, ry, t > 0.75 ? 'B' : 'b').px(rx + 1, ry, 's');
    }
  }
  g.rect(27, 15, 3, 1, 'b').rect(11, 20, 4, 1, 'B');
  // The skull at the far end: long, heavy, a jaw of teeth, an empty socket.
  g.rect(36, 9, 11, 7, 'b').rect(38, 7, 6, 3, 'b').rect(36, 16, 11, 3, 'B');
  g.rect(40, 9, 3, 3, 'e');
  g.rect(44, 12, 3, 4, 'B');
  for (let x = 37; x < 47; x += 2) g.px(x, 17, 'b').px(x, 18, 'e');
  g.rect(36, 18, 11, 1, 'd');
  g.px(46, 10, 'e').px(46, 11, 'e');
  g.outline('k');
}, 3);

// A low heap of fallen rock with a hollow under it, to crouch in while
// something goes over (a `hide`, the Crawl). The second drawing has someone
// in the hollow: a shape and two eyes.
const RUBBLE = { k: '#0c0a14', a: '#1c1926', b: '#2d2a3c', c: '#44405a', d: '#6a668a', h: '#050409', e: '#cfd8ff', f: '#1a1824' };
function drawRubble(g, inside) {
  g.ell(7.5, 10, 7, 5, 'b').ell(6.5, 8.5, 5, 3.4, 'c');
  g.px(4, 6, 'd').px(5, 6, 'd').px(9, 5, 'd').px(11, 7, 'd').px(3, 8, 'a').px(12, 10, 'a');
  g.ell(7.5, 11.5, 4, 3, 'h');
  g.rect(3, 14, 10, 1, 'a');
  if (inside) g.ell(7.5, 11.5, 2.4, 2.2, 'f').px(6, 11, 'e').px(9, 11, 'e');
  g.outline('k');
}
still('rubble_hide', RUBBLE, 16, 16, (g) => drawRubble(g, false));
still('rubble_hide_hidden', RUBBLE, 16, 16, (g) => drawRubble(g, true));

// Loose scree to kick (the Crawl's lure): a spill of small stones against the
// wall. Kicked, it is scattered wider and the stones are darker where they ran.
const SCREE = { k: '#0c0a14', a: '#1c1926', b: '#2d2a3c', c: '#44405a', d: '#6a668a', e: '#8a86aa' };
function drawScree(g, kicked) {
  const stones = kicked
    ? [[3, 13], [6, 14], [9, 13], [12, 14], [5, 11], [10, 11], [14, 12], [2, 15], [8, 15], [13, 15]]
    : [[6, 12], [9, 12], [7, 10], [10, 10], [8, 8], [5, 13], [11, 13], [8, 13], [4, 11], [12, 11]];
  for (const [x, y] of stones) g.rect(x - 1, y - 1, 3, 2, 'b').px(x - 1, y - 1, 'd').px(x, y - 1, 'c').px(x + 1, y, 'a');
  if (!kicked) g.px(7, 7, 'e').px(9, 9, 'e').px(6, 11, 'e');
  g.rect(2, 15, 12, 1, 'a');
  g.outline('k');
}
still('scree_heap', SCREE, 16, 16, (g) => drawScree(g, false));
still('scree_heap_kicked', SCREE, 16, 16, (g) => drawScree(g, true));

// Gubb's pot marker (the Reeds): a stake in the shingle with a cork float on a
// line, a scrap of net, and a rag of red wool. It marks a fish-pot, not a way.
still('eel_float', { k: '#0a1018', w: '#6a665a', W: '#4a483e', c: '#a8885a', C: '#78603c', r: '#b04a3a', R: '#7a2e26', n: '#8a8678', s: '#2a3a48' }, 16, 20, (g) => {
  g.rect(7, 4, 2, 15, 'w').rect(7, 4, 1, 15, 'W');
  g.ell(8, 4, 3.4, 2.6, 'c').rect(5, 4, 7, 1, 'C').px(7, 2, 'c');
  g.rect(8, 9, 4, 2, 'r').px(12, 10, 'R').px(12, 11, 'R').px(11, 11, 'R');
  g.line(8, 6, 12, 14, 'n').line(8, 7, 4, 15, 'n').line(4, 15, 12, 14, 'n').line(6, 11, 10, 11, 'n');
  g.rect(3, 17, 10, 2, 's');
  g.outline('k');
}, 1);

// The child's waymark with a pointer (the First Dark, and one at the lake's far shore to
// learn it by): a small cairn, and three pale pebbles laid in a line the way to go.
const POINTER = { k: D_OUT, a: '#1c1926', b: '#2d2a3c', c: '#44405a', d: '#6a668a', t: '#0e0c14', p: '#c9c3a8', q: '#8e8a74' };
function drawPointer(g, way) {
  const cx = { left: 11, right: 5, up: 8, down: 8 }[way];
  const cy = { left: 18, right: 18, up: 18, down: 8 }[way];
  const stone = (x, y, rx, ry, body) => { g.ell(x, y, rx, ry, body).ell(x - 0.6, y - 0.5, rx - 1.3, ry - 1, 'c').px(x - 1.5, y - 0.8, 'd'); };
  stone(cx, cy - 1, 4.4, 2.2, 'b'); stone(cx + 0.4, cy - 4, 3.2, 2, 'a'); stone(cx - 0.4, cy - 6.5, 2.2, 1.6, 'b');
  const step = { left: [-3, 0], right: [3, 0], up: [0, -3], down: [0, 3] }[way];
  const start = { left: [6, 17], right: [10, 17], up: [8, 9], down: [8, 13] }[way];
  for (let n = 0; n < 3; n++) {
    const x = start[0] + step[0] * n;
    const y = start[1] + step[1] * n;
    g.rect(x - 1, y, 2, 2, n === 2 ? 'p' : 'q').px(x - 1, y, 'p');
  }
  g.outline('k');
}
for (const way of ['left', 'right', 'up', 'down']) still(`cairn_${way}`, POINTER, 16, 20, (g) => drawPointer(g, way));

// The older marks (the First Dark): a taller stack of five heavier, dustier stones, and four dark
// pebbles laid in a line. They point just as firmly as the child's, and they lie.
const OLD_POINTER = { k: D_OUT, a: '#201e2a', b: '#34313f', c: '#4e4a5c', d: '#7c788c', u: '#9a96a6', t: '#0e0c14', p: '#7a7690', q: '#5a566a' };
function drawOldPointer(g, way) {
  const cx = { left: 11, right: 5, up: 8, down: 8 }[way];
  const cy = { left: 18, right: 18, up: 18, down: 11 }[way];
  const stone = (x, y, rx, ry, body) => { g.ell(x, y, rx, ry, body).ell(x - 0.6, y - 0.5, rx - 1.3, ry - 1, 'c').px(x - 1.5, y - 0.8, 'd'); };
  stone(cx, cy - 1, 5.2, 2, 'b'); stone(cx + 0.5, cy - 3.6, 4.4, 1.8, 'a'); stone(cx - 0.4, cy - 5.8, 3.6, 1.7, 'b');
  stone(cx + 0.3, cy - 7.8, 2.8, 1.5, 'a'); stone(cx, cy - 9.5, 1.9, 1.3, 'b');
  // Dust settled on the tops of them.
  g.px(cx - 1, cy - 10.5, 'u').px(cx, cy - 10.5, 'u').px(cx + 1, cy - 8.5, 'u').px(cx - 2, cy - 6.5, 'u').px(cx + 2, cy - 4.5, 'u');
  const step = { left: [-2, 0], right: [2, 0], up: [0, -2], down: [0, 2] }[way];
  const start = { left: [6, 17], right: [10, 17], up: [8, 6], down: [8, 13] }[way];
  for (let n = 0; n < 4; n++) {
    const x = start[0] + step[0] * n;
    const y = start[1] + step[1] * n;
    // (A pebble each with a gap between: dark, so they read as dots, not a rail.)
    const flat = way === 'up' || way === 'down';
    g.rect(x - 1, y, flat ? 2 : 1, flat ? 1 : 2, 'q').px(x - (flat ? 1 : 0), y, 'p');
  }
  g.outline('k');
}
for (const way of ['left', 'right', 'up', 'down']) still(`old_cairn_${way}`, OLD_POINTER, 16, 20, (g) => drawOldPointer(g, way));

// A waymark knocked flat: the stones strewn, the pebbles gone every which way.
still('cairn_fallen', { k: D_OUT, a: '#1c1926', b: '#2d2a3c', c: '#44405a', d: '#6a668a', p: '#8e8a74' }, 16, 12, (g) => {
  for (const [x, y, rx, ry, body] of [[4, 8, 3.2, 1.8, 'b'], [10, 9, 3.6, 2, 'a'], [8, 5, 2.6, 1.6, 'b'], [13, 6, 1.6, 1.2, 'a'], [2, 4, 1.4, 1, 'a']]) {
    g.ell(x, y, rx, ry, body).px(x - 1, y - 1, 'c').px(x, y - 1, 'd');
  }
  g.px(6, 2, 'p').px(14, 9, 'p').px(1, 10, 'p');
  g.outline('k');
});

// The Hushwood's log sunk in the mines' flood water: the same log, with the
// ripples round it in the Diggings' dark green-black water (digWater in
// src/overworld/deepTiles.js) instead of the brook's blue.
const SUNK_LOG = [
  '................',
  '..~~~~..........',
  '..........~~kkk.',
  '..kkkkkkkkkkLLLk',
  '.kLLllllllllL$$k',
  '.kLLlllltttL$%$L',
  '.kLLLtttLLtL$$%$',
  'kLLLLLLttttL%%%$',
  '.kLLLttttLLL$$%$',
  '.kLLLLLLLLLL$%$L',
  '.kLLLLLLLLLLL$$k',
  '.z~~z~~~z~~zLLLz',
  '~~.~~~...~~~~kk.',
  '............~~~.',
  '......~~~~~.....',
  '................',
];
still('roll_log_mine', { k: '#120c1c', L: '#5a3a1e', l: '#8a5a32', t: '#6b4423', $: '#e0b888', '%': '#a87048', '~': '#2f4642', z: '#7a9a8a' }, 16, 16,
  (g) => SUNK_LOG.forEach((row, y) => [...row].forEach((c, x) => { if (c !== '.') g.px(x, y, c); })));

// ======================= SET DRESSING =======================
// Small things lying about that nobody needs to look at: `walkable` and
// `flat` (under everyone's feet), so they never stand in anyone's way.

// Loose stones kicked about the floor.
still('floor_pebbles', { k: '#1a120c', a: '#4a3c30', b: '#6a5a48', c: '#8a7a64' }, 16, 16, (g) => {
  for (const [x, y, r] of [[3, 11, 1.6], [9, 13, 1.2], [12, 9, 1.8], [6, 6, 1], [14, 14, 0.8], [1, 14, 0.8], [10, 4, 0.9]]) {
    g.ell(x, y, r + 0.4, r, 'a').px(x - 0.5, y - 0.6, 'b');
    if (r > 1.4) g.px(x - 1, y - 1, 'c');
  }
  g.outline('k');
});

// The lake's: rounder and blue-grey, washed smooth.
still('floor_pebbles_cool', { k: '#0a1018', a: '#3a4a5e', b: '#5a6e84', c: '#8a9cb4' }, 16, 16, (g) => {
  for (const [x, y, r] of [[4, 12, 1.4], [10, 10, 1.8], [13, 14, 1], [7, 5, 1], [2, 8, 0.8], [12, 4, 1.2]]) {
    g.ell(x, y, r + 0.5, r, 'a').px(x - 0.5, y - 0.6, 'b');
    if (r > 1.3) g.px(x - 1, y - 1, 'c');
  }
  g.outline('k');
});

// Crumbs of ore spilled off a cart: copper and green, catching the lamplight.
still('ore_crumbs', { k: '#1a120c', a: '#5a4a3c', c: '#b8743a', C: '#e09a58', g: '#4c9a78', G: '#8ad0a8' }, 16, 16, (g) => {
  for (const [x, y, body, glint] of [[4, 10, 'c', 'C'], [8, 12, 'a', 'c'], [11, 8, 'g', 'G'], [13, 13, 'c', 'C'], [6, 14, 'g', 'G'], [2, 6, 'a', 'C']]) {
    g.rect(x, y, 2, 2, body).px(x, y, glint);
  }
  g.outline('k');
});

// A puddle under a drip from the roof: a drop falls, lands, and rings out.
const DRIP_PAL = { k: '#0c1418', w: '#1e3438', W: '#2c4a50', r: '#6a9aa0', R: '#a8d4d8', d: '#c8eef0' };
const dripPuddle = moving('drip_puddle', DRIP_PAL, 16, 16, 4, (g, i) => {
  g.ell(8, 12, 6, 2.4, 'w').ell(7, 11.6, 4, 1.4, 'W');
  if (i === 0) g.px(8, 3, 'd').px(8, 4, 'R');
  if (i === 1) g.px(8, 8, 'd').px(8, 9, 'R');
  if (i === 2) { g.px(8, 12, 'd').px(7, 12, 'R').px(9, 12, 'R'); g.px(8, 10, 'r'); }
  if (i === 3) { for (const x of [4, 5, 11, 12]) g.px(x, 12, 'r'); g.px(6, 11, 'r').px(10, 11, 'r').px(6, 13, 'r').px(10, 13, 'r'); }
});

// Shoring on a rock face: two planks up the wall under a cap beam, pegged.
still('wall_shoring', { ...WOOD, i: '#5a5a68' }, 16, 16, (g) => {
  g.rect(2, 3, 3, 13, 'm').px(2, 3, 'l').rect(2, 4, 1, 12, 'l').rect(4, 4, 1, 12, 'd');
  g.rect(11, 3, 3, 13, 'm').px(11, 3, 'l').rect(11, 4, 1, 12, 'l').rect(13, 4, 1, 12, 'd');
  g.rect(0, 0, 16, 3, 'm').rect(0, 0, 16, 1, 'l').rect(0, 2, 16, 1, 'd');
  g.px(3, 1, 'i').px(12, 1, 'i').px(3, 9, 'D').px(12, 11, 'D');
  g.line(5, 4, 10, 9, 'd').line(5, 5, 10, 10, 'm');
  g.outline('k');
});

// Pale roots come down through the rock face from somewhere far above.
still('wall_roots', { k: '#140e0a', a: '#6a5440', b: '#9a8064', c: '#c8b090' }, 16, 32, (g) => {
  g.line(4, 0, 5, 12, 'a').line(5, 12, 3, 22, 'a').line(3, 22, 4, 28, 'a');
  g.line(5, 0, 6, 11, 'b').line(6, 12, 4, 21, 'b');
  g.line(11, 0, 10, 9, 'a').line(10, 9, 12, 17, 'a').line(12, 17, 11, 24, 'a');
  g.line(12, 0, 11, 8, 'b').px(11, 10, 'c').px(5, 6, 'c');
  g.line(6, 14, 9, 19, 'a').px(9, 20, 'a').line(10, 12, 8, 15, 'b');
  g.outline('k');
});

// The creature folk's front doors: a little round door in the rock, a step,
// a knocker and a mat. Somebody lives in there.
still('tiny_door', { k: '#140c08', s: '#5a4a3c', S: '#7a6a58', d: '#7a4a24', D: '#a8703a', l: '#c8904a', y: '#e8c050', m: '#8a3a2a', M: '#b8584a' }, 16, 24, (g) => {
  g.ell(8, 15, 6, 7, 's').ell(8, 15, 5, 6, 'S');
  g.ell(8, 16, 4, 5, 'd').rect(4, 16, 9, 5, 'd');
  g.line(6, 12, 6, 20, 'D').line(8, 11, 8, 20, 'D').line(10, 12, 10, 20, 'D');
  g.px(7, 11, 'l').px(9, 11, 'l');
  g.px(11, 17, 'y').px(8, 14, 'y');
  g.rect(3, 21, 11, 1, 'S').rect(4, 22, 9, 1, 'm').px(5, 22, 'M').px(8, 22, 'M').px(11, 22, 'M');
  g.outline('k');
});

// Tiny tools leaned against the rock: a pick, a shovel, a broom, each about
// the length of your hand.
still('tiny_tools', { ...WOOD, ...IRON, b: '#c8a050', B: '#8a6a30' }, 16, 16, (g) => {
  g.line(3, 15, 5, 5, 'm').line(1, 6, 6, 4, 'I').px(1, 7, 'i').px(6, 5, 'i');
  g.line(8, 15, 8, 4, 'l').rect(7, 11, 3, 4, 'I').px(7, 14, 'i').px(9, 14, 'i');
  g.line(13, 4, 12, 11, 'm').line(10, 12, 14, 12, 'b').line(10, 13, 14, 15, 'b').line(12, 13, 12, 15, 'B');
  g.outline('k');
});

// ======================= Exports =======================
export { DEEP_PALETTE_EXTRA, DEEP_PROP_SPRITES, DEEP_FOOTPRINTS };

// Animations (see animations.js): the same drawings, a frame at a time.
export const MINE_LAMP_PALETTE = LAMP_PAL;
export const MINE_LAMP_SPRITES = mineLamp;
export const MINE_LAMP_HUNG_PALETTE = LAMP_PAL;
export const MINE_LAMP_HUNG_SPRITES = mineLampHung;
export const GLOW_REEDS_PALETTE = GLOW;
export const GLOW_REEDS_SPRITES = glowReeds;
export const GLOW_REEDS_TALL_PALETTE = GLOW;
export const GLOW_REEDS_TALL_SPRITES = glowReedsTall;
export const FUNGUS_PADS_PALETTE = padsPal;
export const FUNGUS_PADS_SPRITES = fungusPads;
export const MINE_WINCH_TURN_PALETTE = WINCH_PAL;
export const MINE_WINCH_TURN_SPRITES = winchTurn;
export const SUNKEN_PILLAR_TOP_PALETTE = { k: '#0a1018', s: '#8896ae', S: '#b4c2d8', t: '#5f6e8c', a: '#3a6a64', A: '#2c5450', v: '#070d19', n: '#1d3050', N: '#3a5a84' };
export const SUNKEN_PILLAR_TOP_SPRITES = sunkenTop;
export const ROOT_VEIN_LIT_PALETTE = VEIN_LIT;
export const ROOT_VEIN_LIT_SPRITES = rootVeinLit;
export const DRIP_PUDDLE_PALETTE = DRIP_PAL;
export const DRIP_PUDDLE_SPRITES = dripPuddle;
