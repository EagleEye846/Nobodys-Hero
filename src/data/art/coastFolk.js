// The Coast Folk (Chapter 5, "The Tide Held"): the people of the drowned
// coast. Haddock the old walrus lightman (his bell, his boat the Bother, his
// fireside hum, his crank), Orla Cobb the seal smith, Corrie the Tidecaller as
// a boy, and Saltcombe's townsfolk: Mrs. Tansy the lamplighter, Mrs. Wrasse
// the chandler, the Cockle Stall, the Drowned Rat's innkeeper, a harbour
// clerk, two kids and some fishers.
//
// Drawn like the people in belowFolk.js: rows of characters standing on the
// tile's bottom edge, built from a few shape helpers (ellipses, lines, a
// one-pixel outline) and touched up by hand. Each figure has its own little
// colour table written in plain letters; `pal()` swaps the letters for private
// characters (same colour, same character), so nothing clashes with another art
// file's palette. CF_PALETTE is merged into PROP_PALETTE (props.js), so every
// sprite here works as a prop, as a cutscene look ('prop:cf_haddock') and as an
// animation ('cf_haddock', 'cf_haddock_walk_down' ...: src/engine/animations.js).
//
// Also here, for the dialogue box: the faces of Haddock, Orla, Corrie, Mrs.
// Tansy, Mrs. Wrasse, the Cockle Stall's owner, the Drowned Rat's innkeeper
// and the harbour clerk (PORTRAITS in portraits.js).
//
// Haddock is the coast's LIGHTMAN. He is never called anything else.

import { BF_PALETTE, BF_MARIGOLD_SPRITES } from './belowFolk.js';

// --- Private colour characters ---
export const CF_PALETTE = {};
const CHAR_OF = new Map();
let nextChar = 0xe800;
// A figure's colour table (plain letters -> colours) as a function that turns
// its rows into rows of private characters.
function pal(table) {
  const map = {};
  for (const [letter, color] of Object.entries(table)) {
    if (!CHAR_OF.has(color)) {
      const ch = String.fromCharCode(nextChar++);
      CHAR_OF.set(color, ch);
      CF_PALETTE[ch] = color;
    }
    map[letter] = CHAR_OF.get(color);
  }
  const f = (rows) => rows.map((row) => [...row].map((ch) => map[ch] ?? ch).join(''));
  f.map = map;
  return f;
}

// --- Shape helpers (as in belowFolk.js) ---
class Cv {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.g = Array.from({ length: h }, () => Array(w).fill('.'));
  }
  get(x, y) { return this.g[y]?.[x]; }
  px(x, y, c) {
    x = Math.round(x) + (this.ox ?? 0);
    y = Math.round(y) + (this.oy ?? 0);
    if (x >= 0 && y >= 0 && x < this.w && y < this.h && c !== undefined) this.g[y][x] = c;
    return this;
  }
  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.px(x + i, y + j, c);
    return this;
  }
  ell(cx, cy, rx, ry, c, hi = null, lo = null) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const n = (x - cx) / rx;
        const m = (y - cy) / ry;
        if (n * n + m * m > 1) continue;
        const v = -0.6 * n - 0.8 * m;
        this.px(x, y, hi && v > 0.5 ? hi : lo && v < -0.45 ? lo : c);
      }
    }
    return this;
  }
  line(x0, y0, x1, y1, c) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) this.px(Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), c);
    return this;
  }
  // A line `t` pixels thick (sleeves, poles).
  thick(x0, y0, x1, y1, t, c) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) {
      const x = Math.round(x0 + ((x1 - x0) * i) / n);
      const y = Math.round(y0 + ((y1 - y0) * i) / n);
      this.rect(x - Math.floor((t - 1) / 2), y - Math.floor((t - 1) / 2), t, t, c);
    }
    return this;
  }
  stamp(rows, x, y) {
    rows.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== '.') this.px(x + i, y + j, ch); }));
    return this;
  }
  outline(c = 'k') {
    const keep = this.g.map((row) => [...row]);
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (keep[y][x] !== '.') continue;
        if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => (keep[y + dy]?.[x + dx] ?? '.') !== '.')) this.g[y][x] = c;
      }
    }
    return this;
  }
  // The same figure a pixel wider on each side, with the outline closed where
  // the drawing ran into the canvas's side (a claw, a hammer, a sleeve): the
  // party's sprites never have an edge left open, so the townsfolk don't
  // either. Feet on the bottom row stay as they are, as on the hero.
  closed(c = 'k') {
    const out = new Cv(this.w + 2, this.h);
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) out.g[y][x + 1] = this.g[y][x];
      if (this.g[y][0] !== '.' && this.g[y][0] !== c) out.g[y][0] = c;
      if (this.g[y][this.w - 1] !== '.' && this.g[y][this.w - 1] !== c) out.g[y][this.w + 1] = c;
    }
    return out;
  }
  rows() { return this.g.map((row) => row.join('')); }
}
const flip = (rows) => rows.map((row) => [...row].reverse().join(''));

// Every prop and look in this file, by name (merged into PROP_SPRITES).
export const CF_PROP_LOOKS = {};

// =====================================================================
// HADDOCK, the lightman
// =====================================================================
// An old walrus: big, round and slow. A deep navy oilskin coat and sou'wester
// hat, a huge drooping white moustache with two ivory tusks poking out below
// it, small kind dark eyes under bushy white brows, a brass handbell on a
// cord. 24 wide and 30 tall (the hero is 12 x 18): he is a good head and a
// half taller than Ves and about twice as wide.
const HADDOCK = pal({
  k: '#1a1220',
  a: '#a8825f', A: '#c9a27c', b: '#7d5c42', // hide, lit, shadow
  p: '#dba398', P: '#b87a74', // pink muzzle pad
  n: '#2a1a1e', w: '#ffffff', // nose and eyes, shine
  m: '#e4dfd0', M: '#b2ab98', N: '#7f7968', // moustache
  i: '#fffbea', I: '#d8c690', // tusks
  Y: '#46587a', y: '#33415c', Z: '#6a7c9c', X: '#222b40', // oilskin, deep navy
  g: '#d8862a', G: '#6a3a0c', h: '#ffe9a0', // brass
  t: '#6b4a2c', // cord
  B: '#3d4258', C: '#2a2e40', // boots
  W: '#b8844a', V: '#8a5c30', U: '#5e3c1e', // wood
  q: '#d0586a', o: '#5a2a36', // tongue, mouth
  s: '#bfe6ff', // sweat
  e: '#7c869c', E: '#c4cede', // iron, bright iron
  R: '#b83a30', // red paint on the boat
  T: '#3a7a96', S: '#9ad0e0', r: '#c8ecf4', // water, its edge, ripples
});

// The head and hat. cx, cy: the middle of the head. Returns nothing; draws on c.
// eyes: open, blink, happy (arcs), squint, down; mo: moustache dips (0 or 1);
// tilt: the head tipped (the hat follows); brows: 'kind' | 'up' | 'low' | 'sad'.
function haddockHead(c, cx, cy, o = {}) {
  const { eyes = 'open', mo = 0, brows = 'kind', sweat = false, ear = false } = o;
  const hx = Math.round(cx);
  // Head, wide and flat-topped.
  c.ell(cx, cy, 8.4, 5.8, 'a', 'A', 'b');
  // The sou'wester: a rounded crown, a brim that curves down at the sides and
  // a flap at the back of the neck.
  c.rect(hx - 10, cy - 2, 3, 6, 'y'); c.rect(hx - 10, cy - 2, 1, 6, 'X');
  c.rect(hx + 7, cy - 2, 3, 6, 'y');
  c.ell(cx, cy - 5.2, 6.8, 3.4, 'Y', 'Z', 'y');
  c.ell(cx, cy - 2.6, 10.6, 2.1, 'Y', 'Z', 'y');
  c.rect(hx - 9, cy - 2, 18, 1, 'y');
  c.px(hx - 11, cy - 3, 'y'); c.px(hx + 11, cy - 3, 'y');
  c.rect(hx - 4, cy - 7, 3, 1, 'Z');
  // The shadow of the brim on his brow.
  c.rect(hx - 6, cy - 1, 12, 1, 'b');
  // Eyes: small, dark and kind, with a crinkle under each.
  const ey = cy;
  [hx - 4, hx + 3].forEach((x, i) => {
    if (eyes === 'blink') { c.rect(x, ey + 1, 2, 1, 'n'); return; }
    if (eyes === 'happy') { c.px(x, ey + 1, 'n'); c.px(x + 1, ey, 'n'); c.px(x + 2, ey + 1, 'n'); return; }
    if (eyes === 'squint') { c.rect(x, ey + 1, 2, 1, 'n'); c.px(x + (i ? 2 : -1), ey, 'b'); return; }
    if (eyes === 'down') { c.rect(x, ey + 1, 2, 1, 'n'); c.px(x, ey + 2, 'w'); return; }
    c.rect(x, ey, 2, 2, 'n'); c.px(x, ey, 'w');
    c.px(x + (i ? 2 : -1), ey + 2, 'b');
  });
  // Brows: bushy white tufts.
  const by = ey - 1 - (brows === 'up' ? 1 : 0) + (brows === 'low' ? 1 : 0);
  if (brows === 'sad') { c.rect(hx - 5, by, 2, 1, 'm'); c.rect(hx - 3, by - 1, 2, 1, 'm'); c.rect(hx + 3, by - 1, 2, 1, 'm'); c.rect(hx + 5, by, 2, 1, 'm'); }
  else if (brows === 'low') { c.rect(hx - 5, by - 1, 2, 1, 'm'); c.rect(hx - 3, by, 2, 1, 'm'); c.rect(hx + 3, by, 2, 1, 'm'); c.rect(hx + 5, by - 1, 2, 1, 'm'); }
  else { c.rect(hx - 5, by, 4, 1, 'm'); c.px(hx - 6, by + 1, 'M'); c.rect(hx + 2, by, 4, 1, 'm'); c.px(hx + 6, by + 1, 'M'); }
  // The pink muzzle pad, the big dark nose.
  c.ell(cx, cy + 3.8, 5, 3, 'p', 'p', 'P');
  c.rect(hx - 1, cy + 2, 3, 1, 'n'); c.px(hx - 2, cy + 3, 'n'); c.px(hx + 2, cy + 3, 'n'); c.px(hx, cy + 3, 'n');
  // The moustache: two heavy lobes with a gap under the nose, drooping at the
  // ends, and strands. The chin shows below it, so the tusks stand out.
  const my = cy + 5 + mo;
  c.ell(cx, my + 3.2, 4.2, 2, 'a', 'a', 'b');
  c.ell(cx - 4.6, my, 4.8, 2.3, 'm', 'm', 'M');
  c.ell(cx + 4.6, my, 4.8, 2.3, 'm', 'm', 'M');
  c.rect(hx - 1, my - 2, 2, 3, 'm');
  c.px(hx, my - 1, 'M'); c.px(hx, my, 'M');
  // The drooping ends.
  c.line(hx - 9, my + 1, hx - 10, my + 4, 'm'); c.line(hx - 8, my + 1, hx - 9, my + 5, 'm'); c.px(hx - 9, my + 6, 'M');
  c.line(hx + 9, my + 1, hx + 10, my + 4, 'M'); c.line(hx + 8, my + 1, hx + 9, my + 5, 'm'); c.px(hx + 9, my + 6, 'N');
  c.line(hx - 6, my + 1, hx - 4, my + 2, 'M'); c.line(hx + 6, my + 1, hx + 4, my + 2, 'M');
  c.line(hx - 7, my - 1, hx - 5, my + 1, 'M'); c.line(hx + 7, my - 1, hx + 5, my + 1, 'N');
  // Tusks, poking out below.
  c.rect(hx - 3, my + 1, 2, 4, 'i'); c.px(hx - 3, my + 5, 'I'); c.rect(hx - 2, my + 1, 1, 4, 'I'); c.px(hx - 4, my + 2, 'b'); c.px(hx - 4, my + 3, 'b');
  c.rect(hx + 2, my + 1, 2, 4, 'i'); c.px(hx + 3, my + 5, 'I'); c.rect(hx + 3, my + 1, 1, 4, 'I'); c.px(hx + 4, my + 2, 'b'); c.px(hx + 4, my + 3, 'b');
  if (ear) { c.ell(hx - 9, cy + 1, 1.6, 2.2, 'A', 'A', 'a'); }
  if (sweat) { c.px(hx + 9, cy - 1, 's'); c.px(hx + 9, cy, 's'); c.px(hx + 8, cy + 1, 's'); }
}

// The handbell, brass, 6 wide and 6 tall (a handle ring, a flared lip, a clapper).
const BELL = ['..GG..', '.GggG.', '.ghggG', 'GgggggG'.slice(0,6), 'GGGGGG', '..nn..'];

// The whole figure facing the front. Options:
//  step 0|1 (a footstep and a bob), dx (the upper body sways), hy (the head
//  sinks), eyes/brows/mo (see haddockHead), armL 'down'|'cup'|'crank',
//  armR 'down'|'bell', swing (the bell swings, -1..1), sweat.
function haddockFront(o = {}) {
  const { step = 0, dx = 0, hy = 0, armL = 'down', armR = 'down', swing = 0, tilt = 0, ding = false, wide = false, knob = [22, 20] } = o;
  const c = o.canvas ?? new Cv(wide ? 32 : 24, 30);
  if (!o.canvas) c.ox = wide ? 4 : 0;
  const bob = step ? 1 : 0;
  const sh = (y) => Math.round(dx * Math.max(0, Math.min(1, (27 - y) / 12)));
  // Boots: two big dark flippers; one lifts when he steps.
  const lift = step === 1 ? 1 : 0;
  c.ell(8.5, 28 - lift, 3.2, 1.8, 'B', 'B', 'C');
  c.ell(15.5, 28 - (step === 2 ? 1 : 0), 3.2, 1.8, 'B', 'B', 'C');
  c.rect(5, 29, 7, 1, 'C'); c.rect(12, 29, 7, 1, 'C');
  // The coat: a bell shape, wider at the hem, folds down it.
  for (let y = 15 + bob; y <= 27; y++) {
    const half = 6.4 + (y - 15) * 0.27;
    const x0 = Math.round(12 - half) + sh(y);
    const x1 = Math.round(12 + half) + sh(y);
    for (let x = x0; x < x1; x++) c.px(x, y, x <= x0 + 1 ? 'Z' : x >= x1 - 3 ? 'y' : 'Y');
    c.px(x1 - 1, y, 'X');
  }
  c.rect(Math.round(5.6) + sh(27), 27, 13, 1, 'X');
  for (const y of [17, 20, 23]) { c.px(12 + sh(y), y + bob, 'g'); c.px(12 + sh(y), y + 1 + bob, 'G'); }
  c.line(12 + sh(16), 16 + bob, 12 + sh(16), 26, 'y');
  // Pockets and a fold or two.
  c.rect(6 + sh(22), 22, 4, 1, 'y'); c.rect(15 + sh(22), 22, 3, 1, 'y');
  c.line(8 + sh(24), 24, 7 + sh(26), 26, 'y');
  // The collar, turned up.
  c.rect(7 + sh(15), 14 + bob, 10, 2, 'y'); c.rect(8 + sh(15), 14 + bob, 3, 1, 'Y');
  // The cord over his shoulder, and the bell on it.
  if (armR !== 'bell') {
    c.line(9 + sh(16), 16 + bob, 15 + sh(21), 22, 't');
    const bx = 15 + sh(23) + swing;
    c.rect(bx + 1, 21, 1, 2, 't');
    c.stamp(BELL, bx - 1, 22);
  }
  // Arms: navy sleeves with flipper hands.
  const sleeveL = (x0, y0, x1, y1) => { c.thick(x0, y0, x1, y1, 3, 'Y'); c.line(x0 + 1, y0, x1 + 1, y1, 'y'); };
  if (armL === 'cup') {
    sleeveL(5 + sh(17), 18 + bob, -1, 12);
    c.ell(-2, 10.5, 2, 2.6, 'a', 'A', 'b'); c.px(-4, 9, 'b'); c.px(-4, 12, 'b'); c.px(-3, 10, 'b');
  } else if (armL === 'crank') {
    sleeveL(5 + sh(17), 17 + bob, knob[0] - 3, knob[1] + 1); c.ell(knob[0] - 1, knob[1] + 1, 2, 2, 'a', 'A', 'b');
  } else {
    c.thick(4 + sh(17), 17 + bob, 3 + sh(22), 23, 3, 'Y'); c.line(5 + sh(17), 17 + bob, 4 + sh(22), 23, 'y'); c.line(6 + sh(17), 18 + bob, 5 + sh(22), 22, 'X');
    c.rect(2, 22, 3, 1, 'y');
    c.ell(3.5, 25, 1.9, 2.2, 'a', 'A', 'b'); c.px(3, 27, 'b');
  }
  if (armR === 'bell') {
    // The arm out to the side, the bell held up by its handle, mouth down.
    c.thick(19 + sh(17), 18 + bob, 23, 11, 3, 'Y'); c.line(18 + sh(17), 18 + bob, 22, 11, 'X');
    const bx = 22 + swing;
    c.stamp(BELL, bx - 1, 11);
    c.ell(bx + 1.5, 10.4, 1.9, 1.7, 'a', 'A', 'b');
    if (ding) { c.px(bx + 6, 12, 'h'); c.px(bx + 7, 14, 'h'); c.px(bx + 5, 9, 'h'); c.px(bx - 3, 15, 'h'); c.px(bx - 2, 12, 'h'); }
  } else if (armR === 'crank') {
    sleeveL(18 + sh(17), 17 + bob, knob[0] - 3, knob[1] - 1); c.ell(knob[0] - 1, knob[1] - 1, 2, 2, 'a', 'A', 'b');
  } else {
    c.thick(20 + sh(17), 17 + bob, 21 + sh(22), 23, 3, 'Y'); c.line(21 + sh(17), 17 + bob, 22 + sh(22), 23, 'y'); c.line(18 + sh(17), 18 + bob, 19 + sh(22), 22, 'X');
    c.rect(19, 22, 3, 1, 'X');
    c.ell(20.5, 25, 1.9, 2.2, 'a', 'A', 'b'); c.px(21, 27, 'b');
  }
  haddockHead(c, 12 + sh(9) + tilt, 9 + hy + bob, o);
  if (o.extra) o.extra(c);
  return c.outline();
}

// From behind: the back flap of the hat over his collar, the cord round his
// neck, the big navy back of the coat.
function haddockBack(o = {}) {
  const { step = 0 } = o;
  const c = new Cv(24, 30);
  const bob = step ? 1 : 0;
  c.ell(8.5, 28 - (step === 1 ? 1 : 0), 3.2, 1.8, 'B', 'B', 'C');
  c.ell(15.5, 28 - (step === 2 ? 1 : 0), 3.2, 1.8, 'B', 'B', 'C');
  c.rect(5, 29, 7, 1, 'C'); c.rect(12, 29, 7, 1, 'C');
  for (let y = 15 + bob; y <= 27; y++) {
    const half = 6.4 + (y - 15) * 0.27;
    for (let x = Math.round(12 - half); x < Math.round(12 + half); x++) c.px(x, y, x <= Math.round(12 - half) + 1 ? 'Z' : x >= Math.round(12 + half) - 3 ? 'y' : 'Y');
    c.px(Math.round(12 + half) - 1, y, 'X');
  }
  c.rect(6, 27, 13, 1, 'X');
  c.line(12, 16 + bob, 12, 26, 'y'); c.line(12, 20, 8, 22, 'y'); c.line(12, 20, 16, 22, 'y');
  c.thick(4, 17 + bob, 3, 23, 3, 'Y'); c.line(5, 17 + bob, 4, 23, 'y'); c.rect(2, 22, 3, 1, 'y'); c.ell(3.5, 25, 1.9, 2.2, 'a', 'A', 'b');
  c.thick(20, 17 + bob, 21, 23, 3, 'Y'); c.line(21, 17 + bob, 22, 23, 'y'); c.rect(19, 22, 3, 1, 'X'); c.ell(20.5, 25, 1.9, 2.2, 'a', 'A', 'b');
  // Head from behind: the back of the hat, the flap, the cord.
  const hy = 9 + bob;
  c.ell(12, hy, 8.4, 5.8, 'a', 'A', 'b');
  c.ell(12, hy - 2, 10.2, 4.8, 'Y', 'Z', 'y');
  c.ell(12, hy - 5.4, 6.6, 3.4, 'Y', 'Z', 'y');
  c.rect(4, hy + 1, 16, 6, 'Y'); c.rect(4, hy + 1, 2, 6, 'Z'); c.rect(15, hy + 1, 5, 6, 'y'); c.rect(4, hy + 6, 16, 1, 'X');
  c.line(12, hy, 12, hy + 6, 'y'); c.rect(9, hy - 6, 3, 1, 'Z');
  c.rect(8, hy + 7, 8, 1, 't');
  return c.outline();
}

// In profile, facing right: the muzzle and moustache out in front, one tusk,
// the brim of the hat pushed forward.
function haddockSide(o = {}) {
  const { step = 0, swing = 0 } = o;
  const c = new Cv(24, 30);
  const bob = step ? 1 : 0;
  c.ell(9.5, 28 - (step === 1 ? 1 : 0), 3.6, 1.8, 'B', 'B', 'C');
  c.ell(14.5, 28 - (step === 2 ? 1 : 0), 3.6, 1.8, 'B', 'B', 'C');
  c.rect(5, 29, 14, 1, 'C');
  // The coat, seen from the side: a bell again, the back a touch fuller.
  for (let y = 15 + bob; y <= 27; y++) {
    const half = 5.2 + (y - 15) * 0.24;
    for (let x = Math.round(11 - half - 1); x < Math.round(11 + half); x++) c.px(x, y, x <= Math.round(11 - half) ? 'Z' : x >= Math.round(11 + half) - 3 ? 'y' : 'Y');
    c.px(Math.round(11 + half) - 1, y, 'X');
  }
  c.rect(5, 27, 13, 1, 'X');
  for (const y of [17, 20, 23]) c.px(15, y + bob, 'g');
  // The bell on its cord at his belt, and the near arm.
  c.line(9, 16 + bob, 14, 22, 't');
  const bx = 14 + swing;
  c.ell(bx + 0.5, 24.5, 2, 2.1, 'g', 'h', 'G'); c.rect(bx - 1, 26, 4, 1, 'G'); c.px(bx + 0.5, 27, 'n');
  c.thick(11, 17 + bob, 12 + (step ? 1 : -1), 23, 3, 'Y'); c.line(12, 17 + bob, 13 + (step ? 1 : -1), 23, 'y');
  c.ell(12 + (step ? 1 : -1) + 0.5, 25, 1.9, 2.2, 'a', 'A', 'b');
  // Head in profile.
  const hy = 9 + bob;
  c.ell(11, hy, 7.4, 5.8, 'a', 'A', 'b');
  c.ell(17.5, hy + 3.4, 4.4, 3.4, 'p', 'p', 'P');
  c.rect(20, hy + 1, 3, 2, 'n');
  // Hat: crown, brim pushed forward, flap behind.
  c.rect(2, hy - 2, 5, 9, 'Y'); c.rect(2, hy - 2, 1, 9, 'Z'); c.rect(5, hy + 4, 2, 3, 'y'); c.rect(2, hy + 6, 5, 1, 'X');
  c.ell(10.5, hy - 5, 6.2, 3.4, 'Y', 'Z', 'y');
  c.ell(12, hy - 2.4, 10.6, 2, 'Y', 'Z', 'y'); c.rect(3, hy - 2, 18, 1, 'y');
  c.rect(14, hy - 1, 6, 1, 'b');
  // Eye, brow.
  c.rect(15, hy, 2, 2, 'n'); c.px(15, hy, 'w'); c.rect(14, hy - 1, 4, 1, 'm'); c.px(16, hy + 2, 'b');
  // Moustache and tusk at the front.
  c.ell(17.5, hy + 5.6, 4.8, 2.6, 'm', 'm', 'M');
  c.ell(14, hy + 6.2, 3, 2, 'm', 'm', 'M');
  c.line(21, hy + 6, 21, hy + 11, 'm'); c.line(20, hy + 6, 19, hy + 11, 'M'); c.line(22, hy + 6, 22, hy + 10, 'N');
  c.line(12, hy + 6, 15, hy + 9, 'M');
  c.rect(17, hy + 6, 2, 4, 'i'); c.rect(18, hy + 6, 1, 4, 'I'); c.px(17, hy + 10, 'I');
  return c.outline();
}

const H = (cv) => HADDOCK(cv.rows());

// Standing: breathes, blinks, the bell sways.
export const CF_HADDOCK_SPRITES = {
  a: H(haddockFront()),
  b: H(haddockFront({ hy: 1, swing: 1 })),
  c: H(haddockFront({ swing: 1, mo: 1 })),
  d: H(haddockFront({ eyes: 'blink' })),
};
// Talking: the moustache bobs and the tusks bob with it.
export const CF_HADDOCK_TALK_SPRITES = {
  a: H(haddockFront({ mo: 1 })),
  b: H(haddockFront({ mo: 0, hy: 1 })),
  c: H(haddockFront({ mo: 1, eyes: 'happy' })),
  d: H(haddockFront({ mo: 0 })),
};
export const CF_HADDOCK_WALK_DOWN_SPRITES = { a: H(haddockFront()), b: H(haddockFront({ step: 1 })), c: H(haddockFront()), d: H(haddockFront({ step: 2 })) };
export const CF_HADDOCK_WALK_UP_SPRITES = { a: H(haddockBack()), b: H(haddockBack({ step: 1 })), c: H(haddockBack()), d: H(haddockBack({ step: 2 })) };
export const CF_HADDOCK_WALK_RIGHT_SPRITES = {
  a: H(haddockSide()), b: H(haddockSide({ step: 1, swing: 1 })), c: H(haddockSide()), d: H(haddockSide({ step: 2, swing: -1 })),
};
export const CF_HADDOCK_WALK_LEFT_SPRITES = {
  a: flip(CF_HADDOCK_WALK_RIGHT_SPRITES.a), b: flip(CF_HADDOCK_WALK_RIGHT_SPRITES.b),
  c: flip(CF_HADDOCK_WALK_RIGHT_SPRITES.c), d: flip(CF_HADDOCK_WALK_RIGHT_SPRITES.d),
};
// Ringing his handbell: the arm up, the bell swinging, a ding on every swing.
export const CF_HADDOCK_BELL_SPRITES = {
  a: H(haddockFront({ armR: 'bell', wide: true, swing: -1 })),
  b: H(haddockFront({ armR: 'bell', wide: true, swing: 1, ding: true })),
  c: H(haddockFront({ armR: 'bell', wide: true, swing: 0 })),
  d: H(haddockFront({ armR: 'bell', wide: true, swing: -1, ding: true, eyes: 'happy' })),
};
// A bit deaf: a flipper cupped behind his ear, leaning in, brows up. "Eh?"
export const CF_HADDOCK_LISTEN_SPRITES = {
  a: H(haddockFront({ armL: 'cup', wide: true, tilt: -1, dx: -1, brows: 'up', eyes: 'squint', ear: true })),
  b: H(haddockFront({ armL: 'cup', wide: true, tilt: -1, dx: -2, brows: 'up', eyes: 'squint', ear: true, hy: 1 })),
  c: H(haddockFront({ armL: 'cup', wide: true, tilt: -1, dx: -1, brows: 'up', eyes: 'open', ear: true })),
  d: H(haddockFront({ armL: 'cup', wide: true, tilt: -1, dx: -2, brows: 'up', eyes: 'squint', ear: true, mo: 1 })),
};
// Humming on his feet: eyes closed, a slow sway.
export const CF_HADDOCK_HUM_SPRITES = {
  a: H(haddockFront({ eyes: 'happy', dx: -1, swing: -1 })),
  b: H(haddockFront({ eyes: 'happy', dx: 0, swing: 0, hy: 1 })),
  c: H(haddockFront({ eyes: 'happy', dx: 1, swing: 1 })),
  d: H(haddockFront({ eyes: 'happy', dx: 0, swing: 0, hy: 1, mo: 1 })),
};
// Head down, shoulders down (the telling at his own lighthouse).
export const CF_HADDOCK_SLUMP_SPRITES = {
  a: H(haddockFront({ eyes: 'down', brows: 'sad', hy: 2, dx: 0 })),
  b: H(haddockFront({ eyes: 'down', brows: 'sad', hy: 2, dx: 0, swing: 1, mo: 1 })),
};
Object.assign(CF_PROP_LOOKS, {
  cf_haddock: H(haddockFront()),
  cf_haddock_back: H(haddockBack()),
  cf_haddock_side: H(haddockSide()),
  cf_haddock_bell: H(haddockFront({ armR: 'bell', wide: true, swing: 0 })),
  cf_haddock_listen: H(haddockFront({ armL: 'cup', wide: true, tilt: -1, dx: -1, brows: 'up', eyes: 'squint', ear: true })),
});

// Seated on a crate by the fire, a little rounder: eyes shut and humming, a
// slow sway, and a note drifting up. 24 wide, 28 tall.
function haddockSit(o = {}) {
  const { eyes = 'open', sway = 0, mo = 0, hy = 0, note = 0, chair = false } = o;
  const c = new Cv(24, 28);
  if (chair) {
    // His armchair (the parlour): a tall worn wine-red back behind him, rolled arms, short wooden feet.
    c.rect(2, 5, 20, 23, 'o'); c.rect(3, 6, 18, 21, 'R'); c.rect(3, 6, 18, 1, 'q');
    for (const [bx, by] of [[7, 9], [12, 8], [17, 9], [7, 14], [17, 14]]) c.px(bx, by, 'o');
    c.rect(0, 16, 4, 11, 'o'); c.rect(1, 17, 2, 9, 'R'); c.rect(1, 16, 2, 1, 'q');
    c.rect(20, 16, 4, 11, 'o'); c.rect(21, 17, 2, 9, 'R'); c.rect(21, 16, 2, 1, 'q');
    c.rect(1, 27, 3, 1, 'U'); c.rect(20, 27, 3, 1, 'U');
  } else {
    // The crate, with a plank line and a nail or two.
    c.rect(3, 22, 18, 6, 'W'); c.rect(3, 22, 18, 1, 'V'); c.rect(3, 27, 18, 1, 'U'); c.rect(3, 22, 1, 6, 'V'); c.rect(20, 22, 1, 6, 'U');
    c.rect(4, 25, 16, 1, 'V'); c.px(5, 23, 'U'); c.px(18, 23, 'U'); c.rect(11, 23, 2, 2, 'U');
  }
  // His boots, toes out over the front.
  c.ell(8, 26, 3.2, 1.6, 'B', 'B', 'C'); c.ell(16, 26, 3.2, 1.6, 'B', 'B', 'C');
  // The coat, bunched on his lap.
  c.ell(12 + sway * 0.5, 18.6, 9.4, 5.2, 'Y', 'Z', 'y');
  c.rect(5, 22, 14, 1, 'X');
  c.line(12 + sway, 15, 12 + sway, 22, 'y');
  for (const y of [17, 19]) c.px(12 + sway, y, 'g');
  c.rect(7, 14, 10, 2, 'y'); c.rect(8, 14, 3, 1, 'Y');
  // Flipper hands on his knees; the bell in his lap on its cord.
  c.ell(5.5, 20.5, 2.2, 2, 'a', 'A', 'b'); c.ell(18.5, 20.5, 2.2, 2, 'a', 'A', 'b');
  c.line(9, 15, 13, 17, 't'); c.stamp(BELL, 12, 17);
  haddockHead(c, 12 + sway, 9 + hy, { eyes, mo, brows: 'kind' });
  if (note) {
    const ny = 3 - (note > 1 ? 2 : 0);
    c.stamp(['.hh', '.h.', '.h.', 'hh.'], 21, ny);
  }
  return c.outline();
}
export const CF_HADDOCK_SIT_SPRITES = {
  a: H(haddockSit()),
  b: H(haddockSit({ eyes: 'happy', sway: -1, note: 1 })),
  c: H(haddockSit({ eyes: 'happy', sway: 0, hy: 1, mo: 1, note: 2 })),
  d: H(haddockSit({ eyes: 'happy', sway: 1 })),
};
CF_PROP_LOOKS.cf_haddock_sit = H(haddockSit());
// In his own armchair, at home (haddock_light_parlour): still, and not humming.
CF_PROP_LOOKS.cf_haddock_chair = H(haddockSit({ chair: true }));

// At the sluice crank in the ending (tf_haddock_strain and tf_haddock_look in
// tideFinale.js), from behind: the same Haddock as haddockBack (same coat,
// boots and size), but his hat gone, both sleeves up past his head to the
// crank's handle on the wall above him, flippers on it, leaning his weight in.
// `strain` 0-1 sinks his head and shoulders a pixel; `look` turns his head over
// his right shoulder (he can't let go to turn round): one eye, the side of the
// moustache, a tusk. 24 wide, 34 tall: the four extra rows on top are for his
// arms, so the figure itself is his usual 30.
function haddockCrankBack({ strain = 0, look = false, drip = 0 } = {}) {
  const c = new Cv(24, 34);
  c.oy = 4;
  const s = strain;
  // Boots and the coat, as in haddockBack.
  c.ell(8.5, 28, 3.2, 1.8, 'B', 'B', 'C');
  c.ell(15.5, 28, 3.2, 1.8, 'B', 'B', 'C');
  c.rect(5, 29, 7, 1, 'C'); c.rect(12, 29, 7, 1, 'C');
  for (let y = 15 + s; y <= 27; y++) {
    const half = 6.4 + (y - 15) * 0.27;
    for (let x = Math.round(12 - half); x < Math.round(12 + half); x++) c.px(x, y, x <= Math.round(12 - half) + 1 ? 'Z' : x >= Math.round(12 + half) - 3 ? 'y' : 'Y');
    c.px(Math.round(12 + half) - 1, y, 'X');
  }
  c.rect(6, 27, 13, 1, 'X');
  c.line(12, 16 + s, 12, 26, 'y'); c.line(12, 20, 8, 22, 'y'); c.line(12, 20, 16, 22, 'y');
  // Both sleeves up beside his head to the handle, the flippers on its knob.
  c.thick(5, 17 + s, 8, -1, 3, 'Y'); c.line(4, 17 + s, 7, -1, 'Z');
  c.thick(19, 17 + s, 16, -1, 3, 'Y'); c.line(20, 17 + s, 17, -1, 'y');
  c.ell(9, -2.4, 2, 1.6, 'a', 'A', 'b');
  c.ell(15, -2.4, 2, 1.6, 'a', 'A', 'b');
  // The head, bare and wet, hunched down between his arms.
  const hy = 10 + s;
  c.ell(12, hy, 7.2, 5.4, 'a', 'A', 'b');
  c.rect(8, hy + 5, 8, 1, 't');
  if (look) {
    // Turned over his right shoulder, toward us.
    c.ell(16.6, hy + 1.6, 3.6, 2.8, 'a', 'A', 'b');
    c.rect(16, hy - 1, 2, 2, 'n'); c.px(16, hy - 1, 'w');
    c.rect(15, hy - 2, 4, 1, 'm');
    c.ell(18, hy + 3.6, 3.2, 1.7, 'm', 'm', 'M');
    c.line(21, hy + 4, 21, hy + 7, 'm'); c.px(20, hy + 7, 'M');
    c.rect(18, hy + 5, 1, 3, 'i'); c.px(18, hy + 8, 'I');
    c.line(8, hy - 4, 11, hy - 5, 'A');
  } else {
    // The moustache, sticking out either side of his head from behind.
    c.rect(4, hy + 2, 2, 2, 'm'); c.px(4, hy + 4, 'M');
    c.rect(18, hy + 2, 2, 2, 'm'); c.px(19, hy + 4, 'N');
    // Wet shine on the crown, a few hairs plastered flat.
    c.line(9, hy - 4, 12, hy - 5, 'A'); c.px(8, hy - 3, 'A');
    for (const x of [10, 12, 14]) c.px(x, hy - 1, 'b');
  }
  c.outline();
  // Water running off him.
  c.px(4, 22 + drip, 's');
  c.px(20, 19 + ((drip + 1) % 3), 's');
  c.px(12, hy + 7 + drip, 's');
  return c;
}
export const HADDOCK_CRANK_BACK = {
  strain: {
    a: H(haddockCrankBack({ strain: 0, drip: 0 })),
    b: H(haddockCrankBack({ strain: 1, drip: 1 })),
    c: H(haddockCrankBack({ strain: 1, drip: 2 })),
    d: H(haddockCrankBack({ strain: 0, drip: 1 })),
  },
  look: {
    a: H(haddockCrankBack({ strain: 1, look: true, drip: 0 })),
    b: H(haddockCrankBack({ strain: 1, look: true, drip: 1 })),
  },
};

// The Bother, his little rowing boat (48 wide, 34 tall, three tiles): a
// brown clinker hull with a red band and a name in white dashes at the bow, the
// water drawn into the sprite under it. With Haddock seated rowing, or empty.
function botherShort(frame, { rower = true } = {}) {
  const c = new Cv(48, 34);
  const bob = frame % 2;
  // The hull: a long curve, bow up at the right, a flat stern at the left.
  c.ell(24, 24, 22, 6, 'W', 'W', 'V');
  for (let y = 12; y < 22; y++) for (let x = 0; x < 48; x++) if (c.get(x, y) !== '.') c.px(x, y, '.');
  c.line(44, 22, 46, 17, 'V'); c.line(45, 22, 47, 18, 'W'); c.line(46, 23, 47, 20, 'V');
  c.line(4, 22, 3, 18, 'V'); c.line(5, 22, 4, 18, 'W');
  c.rect(4, 22, 42, 1, 'V');
  c.rect(5, 23, 38, 1, 'R');
  for (let x = 7; x < 42; x += 5) c.rect(x, 25, 3, 1, 'V');
  c.rect(34, 25, 2, 1, 'i'); c.rect(37, 25, 1, 1, 'i'); c.rect(39, 25, 2, 1, 'i');
  c.rect(5, 28, 38, 1, 'U');
  // A thwart across, a lantern hook at the bow with a dark lamp.
  c.rect(14, 21, 3, 1, 'V'); c.rect(32, 21, 3, 1, 'V');
  c.rect(45, 15, 1, 4, 'U'); c.rect(45, 14, 2, 1, 'G');
  if (rower) {
    // Haddock amidships, seated, rowing.
    const reach = [10, 4, 0, 6][frame];
    c.ell(24, 19.6, 8.6, 5, 'Y', 'Z', 'y');
    c.rect(18, 22, 12, 1, 'X');
    for (const y of [18, 20]) c.px(24, y, 'g');
    c.rect(19, 14, 10, 2, 'y');
    c.line(21, 15, 25, 17, 't'); c.stamp(BELL, 25, 17);
    haddockHead(c, 24, 8 + bob, { eyes: 'open', brows: 'kind', mo: bob });
    // The near oar: the handle in his flippers, pivoting on the gunwale, the
    // blade out in the water (lifted clear on the recovery).
    const hx = 22 - reach * 0.35;
    const hyy = 19;
    c.thick(15, 15 + bob, hx, hyy, 3, 'Y'); c.ell(hx, hyy, 1.9, 1.9, 'a', 'A', 'b');
    const lift = frame === 2 ? 3 : 0;
    c.thick(hx, hyy, 9 + reach * 0.9, 27 - lift, 2, 'A');
    c.rect(5 + reach * 0.9, 26 - lift, 5, 3, 'A'); c.rect(5 + reach * 0.9, 28 - lift, 5, 1, 'V');
  } else {
    // Oars shipped, lying along the thwarts, and a coil of rope.
    c.line(10, 20, 36, 19, 'W'); c.line(10, 21, 36, 20, 'V'); c.rect(35, 18, 4, 2, 'V');
    c.ell(28, 20, 2.4, 1.4, 't');
  }
  c.outline();
  // The water, over the foot of the hull: pale ripples that slide with the frame.
  c.ell(24, 30, 25, 3.4, 'T', 'T', 'S');
  for (let x = 0; x < 48; x++) if (c.get(x, 31) === '.' && c.get(x, 30) !== '.') c.px(x, 31, 'S');
  for (let k = 0; k < 6; k++) { const rx = ((k * 9 + frame * 3) % 46) + 1; c.rect(rx, 29 + (k % 2) * 2, 3, 1, 'r'); }
  return c;
}
// The Bother is a boat for four: the hull is stretched by 24 pixels (a plain run
// of planking between the painted name and the bow), so Haddock rows at the
// stern end and there is room forward for the three to sit or stand, each one
// readable (72 wide, 34 tall, four and a half tiles; centre of the sprite at 36).
const BOTHER_GROW = 24;
const BOTHER_SPLIT = 42;
function bother(frame, opts) {
  const short = botherShort(frame, opts);
  const c = new Cv(48 + BOTHER_GROW, 34);
  for (let y = 0; y < 34; y++) {
    for (let x = 0; x < 48 + BOTHER_GROW; x++) {
      const from = x < BOTHER_SPLIT ? x : x < BOTHER_SPLIT + BOTHER_GROW ? BOTHER_SPLIT : x - BOTHER_GROW;
      c.g[y][x] = short.g[y][from];
    }
  }
  // Water ripples would repeat in stripes down the stretched part: redraw a few there.
  for (let k = 0; k < 4; k++) c.rect(BOTHER_SPLIT + 2 + k * 6 + ((frame * 3 + k) % 4), 29 + (k % 2) * 2, 3, 1, 'r');
  // A second thwart in the new run, for the riders.
  c.rect(BOTHER_SPLIT + 10, 21, 3, 1, 'V');
  return c;
}
// The Bother tied up: the empty boat with a painter run from her bow to a short
// mooring post standing in the water off it (86 wide, footprint 5), so a boat
// left at a slip or a beach is never just floating there on its own.
function botherMoored(frame) {
  const boat = bother(frame, { rower: false });
  const c = new Cv(86, 34);
  const post = new Cv(86, 34);
  // The post: a weathered stake, a darker cap, a band of weed at the waterline.
  post.rect(79, 12, 5, 20, 'V'); post.rect(79, 12, 1, 20, 'W'); post.rect(83, 12, 1, 20, 'U');
  post.rect(78, 11, 7, 2, 'U'); post.rect(79, 11, 5, 1, 'W');
  post.rect(79, 27, 5, 2, 'U');
  // The painter: a turn round the post, sagging back to the bow's ring.
  post.rect(78, 16, 7, 1, 't'); post.rect(78, 18, 7, 1, 't');
  for (let x = 72; x <= 78; x++) post.px(x, 18 + Math.round(Math.sin(((x - 72) / 6) * Math.PI) * 2), 't');
  post.outline();
  for (let y = 0; y < 34; y++) for (let x = 0; x < 86; x++) {
    if (x < boat.w && boat.g[y][x] !== '.') c.g[y][x] = boat.g[y][x];
    else if (post.g[y][x] !== '.') c.g[y][x] = post.g[y][x];
  }
  // Water round the foot of the post, moving with the boat's ripples.
  c.rect(76, 30, 11, 1, 'T'); c.rect(77, 31, 9, 1, 'S');
  c.rect(76 + (frame % 2) * 6, 30, 3, 1, 'r');
  return c;
}
export const CF_BOTHER_MOORED_SPRITES = { a: H(botherMoored(0)), b: H(botherMoored(1)), c: H(botherMoored(2)), d: H(botherMoored(3)) };
CF_PROP_LOOKS.cf_bother_moored = H(botherMoored(0));
export const CF_HADDOCK_ROW_SPRITES = { a: H(bother(0)), b: H(bother(1)), c: H(bother(2)), d: H(bother(3)) };
export const CF_BOTHER_SPRITES = { a: H(bother(0, { rower: false })), b: H(bother(1, { rower: false })), c: H(bother(2, { rower: false })), d: H(bother(3, { rower: false })) };
CF_PROP_LOOKS.cf_haddock_row = H(bother(0));
CF_PROP_LOOKS.cf_bother = H(bother(0, { rower: false }));

// =====================================================================
// ORLA COBB, the smith
// =====================================================================
// A gruff grey seal in a red bandana, big dark eyes under a frown, a leather
// apron black with soot over a rust-red shirt, sleeves shoved up, flippers
// like paddles. A hammer in her fist. 18 wide, 24 tall. Her forge version is
// 36 wide: her at the anvil, a bar glowing on it, sparks.
const ORLA = pal({
  k: '#1a1220',
  s: '#8c949e', S: '#b6bdc7', d: '#5f6772', // grey fur, lit, shadow
  n: '#241a20', w: '#ffffff', m: '#e8e8ee', // nose and eyes, shine, whiskers
  r: '#a8483a', R: '#7a3028', // bandana, shirt
  L: '#8a5530', l: '#54301a', // leather apron, dark leather
  o: '#2e2a30', // soot
  W: '#a8743c', V: '#8a5c30', U: '#5e3c1e', // wood
  q: '#d6dde8', Q: '#8890a0', B: '#4a4658', // steel, shadow, dark iron
  O: '#ff8c1a', E: '#fff0a0', // hot iron, white-hot
});
// dir: 'down' | 'up'. blink; hammer: 0 held low, 1 raised, 2 struck; breathe.
function orlaFigure(dir, { blink = false, hammer = 0, breathe = 0, whisker = 0, canvas = null, at = 0 } = {}) {
  const c = canvas ?? new Cv(18, 24);
  if (!canvas) c.ox = 0;
  const front = dir === 'down';
  const b = breathe;
  // Flipper feet.
  c.ell(6 + at, 22.4, 2.8, 1.5, 'd', 'S', 'B'); c.ell(12 + at, 22.4, 2.8, 1.5, 'd', 'S', 'B');
  // Shirt and apron: a stocky barrel.
  c.ell(9 + at, 16.5 + b, 6.9, 6, 'R', 'r', 'R');
  c.rect(5 + at, 13 + b, 9, 9, 'L'); c.rect(12 + at, 13 + b, 2, 9, 'l'); c.rect(5 + at, 21, 9, 1, 'l');
  c.rect(6 + at, 17 + b, 3, 3, 'l'); c.px(7 + at, 17 + b, 'L');
  // Soot and a scorch on the apron.
  c.px(10 + at, 16, 'o'); c.px(11 + at, 17, 'o'); c.px(9 + at, 19, 'o'); c.px(7 + at, 15, 'o'); c.px(10 + at, 20, 'o'); c.px(8 + at, 21, 'o');
  if (front) { c.line(6 + at, 12 + b, 9 + at, 14 + b, 'l'); c.line(13 + at, 12 + b, 10 + at, 14 + b, 'l'); } else c.line(6 + at, 13, 12 + at, 13, 'l');
  // The left arm hangs, bare to the elbow; the right holds the hammer.
  c.rect(1 + at, 14 + b, 3, 3, 'R'); c.rect(1 + at, 17 + b, 3, 4, 'S'); c.rect(1 + at, 17 + b, 1, 4, 's'); c.ell(2.5 + at, 21.4, 1.7, 1.5, 's', 'S', 'd');
  const hx = 15.5 + at;
  c.rect(14 + at, 14 + b, 3, 3, 'R');
  if (hammer === 0) {
    c.rect(14 + at, 17 + b, 3, 4, 'S'); c.ell(hx, 21.4, 1.7, 1.5, 's', 'S', 'd');
    c.rect(16 + at, 19, 1, 5, 'W'); c.rect(15 + at, 22, 3, 2, 'q'); c.px(17 + at, 23, 'Q');
  } else if (hammer === 1) {
    c.thick(15 + at, 16 + b, 16 + at, 10, 3, 'S'); c.ell(16 + at, 9.4, 1.8, 1.6, 's', 'S', 'd');
    c.rect(16 + at, 4, 1, 6, 'W'); c.rect(14 + at, 1, 5, 3, 'q'); c.rect(14 + at, 3, 5, 1, 'Q');
  } else {
    c.thick(15 + at, 16 + b, 17 + at, 14, 3, 'S'); c.ell(17 + at, 14, 1.8, 1.6, 's', 'S', 'd');
    c.rect(18 + at, 11, 1, 5, 'W'); c.rect(16 + at, 9, 5, 3, 'q'); c.rect(16 + at, 11, 5, 1, 'Q');
  }
  // Head: round, grey, a pale muzzle.
  c.ell(9 + at, 7.4 + b, 5.7, 5.2, 's', 'S', 'd');
  if (front) {
    c.ell(9 + at, 10.6 + b, 3.4, 2.3, 'S', 'm', 'S');
    c.rect(8 + at, 9 + b, 3, 2, 'n'); c.px(8 + at, 8.6 + b, 'S'); c.px(9 + at, 9 + b, 'n');
    // Eyes: big, dark and wet, under a heavy gruff frown (inner ends low).
    [6, 11].forEach((x, i) => {
      const ex = x + at;
      if (blink) { c.rect(ex, 7 + b, 2, 1, 'n'); return; }
      c.rect(ex, 5 + b, 2, 3, 'n'); c.px(ex, 5 + b, 'w');
      if (i === 0) { c.px(ex - 1, 4 + b, 'd'); c.px(ex, 4 + b, 'd'); c.px(ex + 1, 4.9 + b, 'd'); } else { c.px(ex, 4.9 + b, 'd'); c.px(ex + 1, 4 + b, 'd'); c.px(ex + 2, 4 + b, 'd'); }
    });
    // A smear of soot across the cheek.
    c.px(5 + at, 9 + b, 'o'); c.px(6 + at, 9 + b, 'o'); c.px(6 + at, 10 + b, 'o');
    c.px(9 + at, 12 + b, 'd'); c.px(8 + at, 12 + b, 'd'); c.px(10 + at, 12 + b, 'd');
  }
  // The bandana: a red band round the top of her head, knotted behind.
  c.rect(4 + at, 3 + b, 11, 2, 'r'); c.ell(9 + at, 2.6 + b, 4.7, 1.6, 'r', 'r', 'R'); c.rect(4 + at, 4 + b, 11, 1, 'R');
  c.px(15 + at, 4 + b, 'r'); c.px(16 + at, 5 + b, 'r'); c.px(16 + at, 6 + b, 'R'); c.px(3 + at, 4 + b, 'r');
  if (!front) { c.rect(8 + at, 3 + b, 3, 3, 'R'); c.px(9 + at, 7 + b, 'R'); c.px(10 + at, 8 + b, 'r'); c.px(8 + at, 8 + b, 'R'); }
  c.outline();
  if (front) {
    // Whiskers go on after the outline, so they stay pale and thin.
    const wy = 10 + b + whisker;
    c.line(5 + at, wy, 2 + at, wy - 1, 'm'); c.line(5 + at, wy + 1, 2 + at, wy + 2, 'm'); c.line(13 + at, wy, 16 + at, wy - 1, 'm'); c.line(13 + at, wy + 1, 16 + at, wy + 2, 'm');
  }
  return c;
}
const O_ = (cv) => ORLA(cv.closed().rows());
export const CF_ORLA_SPRITES = {
  a: O_(orlaFigure('down')),
  b: O_(orlaFigure('down', { blink: true })),
  c: O_(orlaFigure('down', { breathe: 1, whisker: 1 })),
  d: O_(orlaFigure('down', { hammer: 1 })),
};
// At the forge: the smith, the anvil, a glowing bar, sparks. 36 wide, 24 tall,
// two tiles: put her on the left tile.
function orlaForge(frame) {
  const c = new Cv(36, 26);
  c.oy = 2;
  // The anvil on a stump.
  c.rect(24, 21, 9, 2, 'U'); c.rect(24, 21, 9, 1, 'V'); c.rect(25, 17, 7, 4, 'B'); c.rect(21, 14, 14, 3, 'Q'); c.rect(21, 14, 14, 1, 'q'); c.px(20, 15, 'Q'); c.px(19, 15, 'Q'); c.px(35, 15, 'B');
  c.rect(26, 20, 5, 1, 'B');
  // The glowing bar on it, hottest at the end.
  c.rect(24, 12, 9, 2, 'O'); c.rect(24, 12, 9, 1, 'E'); c.px(23, 13, 'O'); c.px(33, 13, 'R');
  const hot = frame % 2 === 1;
  // Her, a little left of the anvil, the hammer swinging over the bar.
  orlaFigure('down', { canvas: c, hammer: hot ? 2 : 1, at: 1, blink: frame === 3, breathe: frame === 2 ? 1 : 0 });
  if (hot) {
    // The strike: sparks fly.
    [[27, 8], [30, 6], [33, 9], [29, 10], [32, 12], [26, 6]].forEach(([x, y], i) => c.px(x, y + (frame === 3 ? i % 2 : 0), i % 2 ? 'E' : 'O'));
  }
  return c;
}
const OF = (cv) => ORLA(cv.rows());
export const CF_ORLA_FORGE_SPRITES = { a: OF(orlaForge(0)), b: OF(orlaForge(1)), c: OF(orlaForge(2)), d: OF(orlaForge(3)) };
// Walking-pose animations aren't needed for her: she stays at the forge.
Object.assign(CF_PROP_LOOKS, {
  cf_orla: O_(orlaFigure('down')),
  cf_orla_back: O_(orlaFigure('up')),
  cf_orla_forge: OF(orlaForge(0)),
});

// =====================================================================
// CORRIE, the boy who became the storm
// =====================================================================
// About eight: a bit shorter than Bramble, and thin. A pale skinny boy lost
// in a yellow oilskin far too big for him: the hood up over his wet hair, its
// shoulders drooping past his, long folds, the empty sleeves hanging past his
// hands, the ragged hem trailing, his bare shins in the gap at the front.
// Big eyes the pale sea-glass of his battle self, a driftwood staff taller
// than he is with a glow caught in its fork. He is half water: the colours
// are see-through, he hovers a little off the floor, toes down, and the green
// of the storm catches him from below. 19 wide, 23 tall (the staff on our
// right as he faces you, in his left hand).
// (Redrawn twice on 2026-11-15: a grey head on a yellow cone, then a thin
// boy; now the battle drawing's boy, hood and all. Both older drawings are in
// notes/art-backup-2026-11-15/corrie/ and corrie-v2/.)
//
// Looks (each an animation, `anim:<name>`, and a prop of its first frame):
//   cf_corrie            hovering, facing you, hood up (4)
//   cf_corrie_back       the same from behind (4)
//   cf_corrie_possessed  the storm has him: hood blown back, hair lifting,
//                        eyes burning green, the staff up and blazing,
//                        lightning in the darkened coat, rising (4)
//   cf_corrie_tired      spent: hood down, sitting in the air with his knees
//                        up, head bowed, the coat slipping off one shoulder,
//                        the staff leaning on him, its light low, a tear (4)
// (The colours of his skin, eyes, staff and drops stay exactly as they were:
// src/data/art/tideRescue.js picks them out of these frames.)
const CORRIE = pal({
  k: 'rgba(16, 30, 60, 0.92)',
  c: 'rgba(222, 238, 246, 0.9)', C: 'rgba(158, 194, 218, 0.88)', // skin
  H: 'rgba(58, 74, 118, 0.95)', h: 'rgba(104, 126, 178, 0.92)', // wet hair
  y: 'rgba(242, 208, 96, 0.8)', Y: 'rgba(255, 232, 150, 0.82)', z: 'rgba(188, 148, 48, 0.8)', // coat
  Z: 'rgba(120, 88, 30, 0.85)', // the coat's dark inside
  x: 'rgba(66, 46, 20, 0.9)', q: 'rgba(255, 250, 228, 0.9)', // deepest fold, wet shine
  e: '#bff8ff', w: '#ffffff', n: 'rgba(40, 60, 100, 0.95)', // eyes, shine, pupils
  m: 'rgba(96, 60, 84, 0.9)', p: 'rgba(236, 196, 214, 0.8)', // mouth, a flush
  W: '#a88a68', V: '#7a5e44', // driftwood
  T: '#8ff0ff', t: '#e8ffff', // staff glow
  D: 'rgba(196, 236, 255, 0.9)', G: 'rgba(150, 226, 255, 0.5)', // drops, watery trail
  L: 'rgba(132, 240, 176, 0.92)', l: 'rgba(96, 210, 160, 0.45)', // the storm's green, from below
  // The storm in him: eyes, their glow, the coat darkened, lightning.
  s: '#8dffb0', E: '#f0fff4', j: 'rgba(120, 255, 170, 0.55)',
  o: 'rgba(210, 220, 116, 0.85)', O: 'rgba(147, 162, 68, 0.85)', P: 'rgba(78, 104, 54, 0.88)', f: '#f4fff0',
  // His undershirt, where the coat slips off.
  B: 'rgba(222, 226, 238, 0.92)',
});
const STORMED = { Y: 'o', y: 'O', z: 'P', Z: 'P', q: 'o' };

// look: 'hover' | 'possessed' | 'tired'; dir 'down' (facing you) or 'up';
// frame 0-3 round the loop.
function corrieFigure(dir, { frame = 0, blink = false, look = 'hover' } = {}) {
  const c = new Cv(19, 23);
  const front = dir === 'down';
  const storm = look === 'possessed';
  const tired = look === 'tired';
  const ph = (frame / 4) * Math.PI * 2;
  const bob = Math.round(Math.sin(ph) * 0.9 + 0.2);
  const stir = [0, 1, 0, -1][frame % 4];
  // The light under him (green; brighter when the storm has him).
  c.ell(9, 22, 4 + (frame % 2) + (storm ? 2 : 0), 0.8, storm ? 'L' : 'l');
  // Where he is: hovering (the storm lifts him a pixel or two; tired, he sags).
  c.oy = bob + (storm ? -1 - (frame % 2) : 0) + (tired ? 1 : 0);
  const sx = front ? 17 : 1;

  // --- The staff: driftwood, crooked, the glow in its fork. Raised and
  // blazing when the storm has him; leaning on his shoulder when he's spent.
  if (tired) {
    c.line(16, 21, 13, 3, 'W');
    c.px(15, 15, 'V'); c.px(14, 9, 'V');
    c.px(12, 2, 'V'); c.px(14, 2, 'V');
    c.px(13, 1, 'G');
  } else if (storm) {
    c.line(sx, 18, sx, 3, 'W');
    c.px(sx, 7, 'V'); c.px(sx, 12, 'V');
    c.px(sx - 1, 2, 'V'); c.px(sx + 1, 2, 'V');
  } else {
    c.line(sx, 22, sx + (frame === 1 ? 0 : 0), 3, 'W');
    c.px(sx, 8, 'V'); c.px(sx, 14, 'V'); c.px(sx, 19, 'V');
    c.px(sx - 1, 2, 'V'); c.px(sx + 1, 2, 'V');
    c.px(sx - 1, 1, 'V'); c.px(sx + 1, 1, 'V');
  }

  // --- The hood fallen back (storm, tired): a lump of it behind his neck.
  if (storm || tired) {
    c.ell(9, 10, 5, 2.2, 'y', 'Y', 'z');
  }

  // --- The coat. Shoulders far wider than his, drooping; then it hangs in
  // long folds to a ragged hem; open at the front below the buttons.
  const hem = tired ? 17 : 19;
  const flare = storm ? 1 : 0;
  // (Tired, the far shoulder has slid down off him.)
  c.rect(5, 11, 9, 1, 'y');
  c.rect(3, 12, 13, 1, 'y'); c.px(3, 12, 'Y'); c.px(15, 12, 'z');
  if (tired) { c.rect(12, 11, 3, 1, 'B'); c.px(12, 11, 'c'); c.px(14, 12, 'B'); }
  for (let y = 13; y <= hem; y++) {
    const k = (y - 13) / (hem - 13);
    const s = y >= hem - 2 ? stir : 0;
    const L = Math.round(4 - k * (1 + flare) - (tired ? k * 1.5 : 0)) + s;
    const R = Math.round(14 + k * (1 + flare) + (tired ? k * 1.5 : 0)) + s;
    for (let x = L; x <= R; x++) {
      const u = (x - L) / Math.max(1, R - L);
      c.px(x, y, u < 0.12 ? 'Y' : u < 0.55 ? 'y' : u < 0.85 ? 'z' : 'Z');
    }
  }
  // The ragged hem, longer at the back, stirring; a fold or two dipping lower.
  for (let x = 3; x <= 15; x++) {
    const low = ((x * 5 + frame) % 4 === 0 ? 1 : 0) + (x > 11 ? 1 : 0);
    if (low) c.px(x + stir, hem + 1, x > 11 ? 'Z' : 'z');
  }
  if (storm) for (const x of [2, 5, 13, 16]) c.px(x + stir, hem + 1 + (frame + x) % 2, 'G');
  // Folds: long shadows down from the shoulders, a lit ridge beside each.
  for (const [fx, top] of [[6, 14], [12, 13]]) {
    for (let y = top; y <= hem; y++) {
      const s = y >= hem - 2 ? stir : 0;
      c.px(fx + s, y, y > top + 2 ? 'Z' : 'z');
      if (fx < 12) c.px(fx - 1 + s, y, 'Y');
    }
  }
  // A wet shine down the lit side.
  c.px(4, 14, 'q'); c.px(4, 15, 'q'); c.px(6, 13, 'q');
  if (front) {
    // Buttoned at the top, open below, his thin shins in the gap.
    c.px(9, 12, 'V'); c.px(9, 14, 'V');
    for (let y = 15; y <= hem; y++) c.rect(9 - (y >= 18 ? 1 : 0) + (y >= hem - 1 ? stir : 0), y, y >= 18 ? 2 : 1, 1, 'x');
    if (tired) {
      // Knees drawn up under the coat; feet dangling out under the hem.
      c.ell(7, 14, 1.6, 1, 'Y'); c.ell(11, 14, 1.6, 1, 'y');
      c.px(8, hem + 1, 'c'); c.px(10, hem + 1, 'C');
    } else {
      const kick = frame === 2 ? 1 : 0;
      c.rect(8, hem + 1, 1, 2, 'C'); c.rect(10 + kick, hem + 1, 1, 2, 'c');
      c.px(8, hem + 3, 'c'); c.px(10 + kick, hem + 3, 'c');
    }
  } else {
    // From behind: the seam down the back, and a vent.
    c.line(9, 12, 9 + stir, hem, 'z');
    c.px(9 + stir, hem - 1, 'x'); c.px(9 + stir, hem, 'x');
  }

  // --- The sleeves: long limp tubes off the drooping shoulders, past his
  // hands. One hangs empty, its cuff stirring and dripping; the other
  // bunches on the staff (raised with it, in the storm).
  const empty = front ? 2 : 15;
  const held = front ? 15 : 2;
  const eSt = stir > 0 ? 1 : 0;
  if (storm) {
    // Both flung out from his sides, cuffs flapping.
    c.rect(1, 12, 3, 2, 'y'); c.rect(0, 13 + (frame % 2), 2, 1, 'Z'); c.px(2, 12, 'Y');
    c.rect(15, 9, 2, 4, 'y'); c.rect(16, 8, 1, 1, 'Z'); c.px(16, 9, 'c');
  } else if (tired) {
    // Limp in his lap.
    c.rect(3, 13, 2, 4, 'Y'); c.rect(4, 17, 2, 1, 'Z');
    c.rect(13, 13, 2, 3, 'z'); c.rect(13, 16, 2, 1, 'Z'); c.px(14, 15, 'c');
  } else {
    c.rect(empty, 13, 2, 6, front ? 'Y' : 'z'); c.px(empty + (front ? 1 : 0), 14, front ? 'y' : 'Z'); c.px(empty + (front ? 1 : 0), 16, front ? 'y' : 'Z');
    c.rect(empty + eSt, 19, 2, 1, 'Z');
    c.rect(held, 13, 2, 4, front ? 'z' : 'Y'); c.px(held + (front ? 1 : 0), 14, front ? 'Z' : 'y');
    c.rect(held, 17, 2, 1, 'Z');
    // Fingertips round the staff, just out of the cuff.
    c.px(sx + (front ? -1 : 1), 17, 'c');
  }

  // --- The collar's dark inside, and his thin neck coming up out of it.
  c.rect(6, 10, 7, 1, 'Z');
  c.rect(8, 9, 3, 2, 'C');

  // --- The head.
  const hy = tired ? 6 : 5;
  const hoodUp = !storm && !tired;
  if (hoodUp) {
    // The hood: a big rounded cowl round his head, lit down its left.
    c.ell(9, hy, 6.4, 5.6, 'y', 'Y', 'z');
    c.rect(4, hy + 2, 2, 4, 'y'); c.rect(13, hy + 2, 2, 4, 'z');
    if (!front) {
      // From behind: all hood, its seam and point.
      c.line(9, hy - 5, 9, hy + 5, 'z');
      c.px(8, hy - 3, 'Y'); c.px(8, hy - 1, 'q');
      c.px(12, hy + 2, 'Z'); c.px(6, hy + 3, 'Y');
      // Where the hood lies on his shoulders.
      for (let x = 4; x <= 14; x++) c.px(x, hy + 5 + (x > 6 && x < 12 ? 1 : 0), x > 9 ? 'Z' : 'z');
    }
  }
  if (front) {
    // The face, a little too big for him, pale, a pointed chin.
    c.ell(9, hy + 1.5, 4.3, 4, 'c', 'c', 'C');
    c.rect(8, hy + 5, 3, 1, 'c'); c.px(10, hy + 5, 'C');
    if (hoodUp) {
      // The hood's rim, and its shadow inside, over his hair.
      c.rect(5, hy - 2, 9, 1, 'Y'); c.px(4, hy - 1, 'Y'); c.px(14, hy - 1, 'z');
      c.px(6, hy - 2, 'q');
    } else {
      // Hood back: his wet hair, flat to his head.
      c.ell(9, hy - 1.5, 5, 3, 'H', 'h', 'H');
      c.px(4, hy + 1, 'H'); c.px(14, hy + 1, 'H'); c.px(14, hy + 2, 'H');
      if (storm) {
        // Lifting: strands rising off his head, swaying, green at the ends.
        const sway = frame % 2 ? 1 : -1;
        for (const [x, len] of [[5, 2], [7, 3], [9, 4], [11, 3], [13, 2]]) {
          for (let i = 1; i <= len; i++) c.px(x + (i > 1 ? sway : 0), hy - 4 - i + 1, i === len ? 'j' : (x % 4 === 1 ? 'h' : 'H'));
        }
      } else {
        c.px(7, hy - 4, 'h'); c.px(10, hy - 4, 'h');
      }
    }
    // The fringe: wet points stuck to his forehead.
    c.rect(5, hy - 1, 9, 1, 'H');
    for (const x of [5, 6, 9, 12, 13]) c.px(x, hy, 'H');
    c.px(7, hy - 1, 'h'); c.px(11, hy - 1, 'h');
    // The eyes: big; burning green in the storm; heavy-lidded and shut when spent.
    for (const x of [6, 11]) {
      if (storm) {
        c.rect(x, hy + 2, 2, 2, 's'); c.px(x + (x < 9 ? 1 : 0), hy + 2, 'E');
        c.px(x + (x < 9 ? -1 : 2), hy + 2, 'j');
      } else if (tired || blink) {
        c.rect(x, hy + 3, 2, 1, 'n');
        if (tired && !blink) c.px(x + (x < 9 ? 1 : 0), hy + 4, 'e');
      } else {
        c.px(x, hy + 2, 'n'); c.px(x + 1, hy + 2, 'w');
        c.rect(x, hy + 3, 2, 1, 'e');
      }
    }
    // A flush on his cheeks; the mouth.
    if (!storm) { c.px(5, hy + 4, 'p'); c.px(13, hy + 4, 'p'); }
    if (storm) c.rect(9, hy + 5, 1, 1, 'm');
    else c.px(9, hy + 5, tired ? 'C' : 'm');
    // A tear, tired.
    if (tired) c.px(6, hy + 5 + (frame % 2), 'D');
  } else if (!hoodUp) {
    // From behind with the hood back: wet hair down to the collar.
    c.ell(9, hy + 0.5, 4.5, 4, 'H', 'h', 'H');
  }
  // The collar, turned up to his ears: a stiff flap either side.
  c.rect(3, hy + 3, 1, 4, 'Y'); c.rect(4, hy + 5, 1, 3, 'y');
  c.rect(15, hy + 3, 1, 4, 'z'); c.rect(14, hy + 5, 1, 3, 'z');

  // --- The storm: the coat darkened, lightning running in it.
  if (storm) {
    for (let y = 0; y < c.h; y++) for (let x = 0; x < c.w; x++) if (STORMED[c.g[y][x]]) c.g[y][x] = STORMED[c.g[y][x]];
    const bolt = [[[6, 13], [7, 15], [6, 16], [7, 18]], [[12, 12], [11, 14], [12, 15], [11, 17]], [[8, 14], [9, 16], [8, 18]], [[13, 15], [12, 17], [13, 19]]][frame % 4];
    c.oy = 0;
    const lift = bob - 1 - (frame % 2);
    for (let i = 0; i + 1 < bolt.length; i++) c.line(bolt[i][0], bolt[i][1] + lift, bolt[i + 1][0], bolt[i + 1][1] + lift, 'f');
    c.oy = lift;
  }

  // --- The staff's light (last, over the coat's outline): raised and green
  // in the storm, low when he's spent.
  c.outline();
  if (!tired) {
    if (storm) {
      c.oy = 0;
      c.px(sx, 1, 's'); c.px(sx, 0, 'E'); c.px(sx - 1, 1, 'E');
      c.px(sx - 2, 1, 'j'); c.px(sx + 1, 0, 'j'); c.px(sx - 1, 0, 'j'); c.px(sx, 2, 'j');
    } else {
      c.ell(sx, 1, 1.2, 1.2, 'T', 't', 'T');
      if (frame % 2 === 0) { c.px(sx - 1, -1, 'G'); c.px(sx + 1, -1, 'G'); }
    }
  }
  // The storm's green, from below: every edge that faces down catches it.
  const lit = new Set(['y', 'Y', 'z', 'c', 'C', 'Z', 'o', 'O', 'P', 'x']);
  for (let y = c.h - 1; y >= 1; y--) {
    for (let x = 0; x < c.w; x++) {
      const v = c.g[y - 1][x];
      if (y >= 16 && lit.has(v) && (c.g[y][x] === '.' || c.g[y][x] === 'k')) c.g[y - 1][x] = 'L';
    }
  }
  // Drops falling off his hem and his empty cuff.
  c.oy = 0;
  if (!storm) {
    const dx = front ? 3 : 15;
    const d = (frame % 4);
    if (c.g[20 + (d % 2)]?.[dx] === '.') c.px(dx, 20 + (d % 2), 'D');
    if (d < 2 && c.g[21]?.[6 + stir] === '.') c.px(6 + stir, 21 + d, 'D');
  }
  return c;
}
const CO = (cv) => CORRIE(cv.rows());
const loopOf = (dir, look) => ({
  a: CO(corrieFigure(dir, { frame: 0, look })),
  b: CO(corrieFigure(dir, { frame: 1, look })),
  c: CO(corrieFigure(dir, { frame: 2, look, blink: dir === 'down' && look === 'hover' })),
  d: CO(corrieFigure(dir, { frame: 3, look })),
});
// Hovering: up and down, the coat stirring, the drops falling (`anim:cf_corrie`
// facing you, `anim:cf_corrie_back` from behind; the props are the first frames).
export const CF_CORRIE_SPRITES = loopOf('down', 'hover');
export const CF_CORRIE_BACK_SPRITES = loopOf('up', 'hover');
export const CF_CORRIE_POSSESSED_SPRITES = loopOf('down', 'possessed');
export const CF_CORRIE_TIRED_SPRITES = loopOf('down', 'tired');
Object.assign(CF_PROP_LOOKS, {
  cf_corrie: CF_CORRIE_SPRITES.a,
  cf_corrie_back: CF_CORRIE_BACK_SPRITES.a,
  cf_corrie_possessed: CF_CORRIE_POSSESSED_SPRITES.a,
  cf_corrie_tired: CF_CORRIE_TIRED_SPRITES.a,
});

// =====================================================================
// MRS. TANSY, the lamplighter
// =====================================================================
// A stubby ginger tabby in a navy coat and a flat cap, with the long
// lamplighting pole in her paw: a brass hook and a wick at the top. Round,
// brisk, and proud that she does the quay and nothing else. 18 wide, 30 tall
// (the pole is most of it; she is about the hero's height).
const TANSY = pal({
  k: '#1a1220',
  F: '#e0903e', f: '#f4b86c', D: '#a85a22', // ginger fur, lit, stripes
  i: '#f6ecd4', I: '#cfc3a6', // chest and apron
  T: '#3a5878', U: '#587898', V: '#26405c', // coat, lit, shadow
  e: '#8ae070', n: '#241a20', w: '#ffffff', P: '#e08a90', // eyes, pupils, shine, nose
  W: '#a8743c', G: '#e0b040', g: '#7a5614', // pole, brass
  O: '#ff8c1a', E: '#fff0a0', // wick flame
  m: '#f4eedc', // whiskers
});
function tansyFigure(dir, { blink = false, tail = 0, flame = 0, sway = 0 } = {}) {
  const c = new Cv(18, 30);
  const front = dir === 'down';
  const px = 15 + sway;
  // The pole, with its brass hook and snuffer at the top, and the little flame.
  c.line(px, 27, px - sway, 5, 'W'); c.px(px + 1, 26, 'g');
  c.rect(px - sway - 1, 3, 3, 2, 'G'); c.px(px - sway - 1, 2, 'G'); c.px(px - sway + 1, 2, 'g');
  c.px(px - sway, 1, 'g');
  if (flame) { c.px(px - sway - 2, 1, 'O'); c.px(px - sway - 2, 0, 'E'); if (flame > 1) c.px(px - sway - 3, 0, 'O'); }
  // Tail: curls out behind her and flicks.
  const tl = tail ? -1 : 0;
  c.line(2, 27, 1, 24 + tl, 'F'); c.line(3, 27, 2, 24 + tl, 'F'); c.px(1, 23 + tl, 'D'); c.px(2, 23 + tl, 'F'); c.px(0, 24 + tl, 'F'); c.px(0, 25, 'D'); c.px(2, 26, 'D');
  // Paws.
  c.ell(5, 28.5, 2.2, 1.2, 'F'); c.ell(10, 28.5, 2.2, 1.2, 'F');
  // The coat: a round little bell.
  for (let y = 19; y <= 27; y++) {
    const half = 4.6 + (y - 19) * 0.32;
    for (let x = Math.round(7.5 - half); x < Math.round(7.5 + half); x++) c.px(x, y, x <= Math.round(7.5 - half) + 1 ? 'U' : x >= Math.round(7.5 + half) - 2 ? 'V' : 'T');
  }
  c.rect(3, 27, 10, 1, 'V');
  if (front) { c.rect(6, 20, 3, 7, 'i'); c.rect(8, 20, 1, 7, 'I'); for (const y of [21, 24]) c.px(7, y, 'G'); }
  else c.line(7, 20, 7, 26, 'V');
  // Arms: the left down at her side, the right up on the pole.
  c.rect(1, 20, 3, 5, 'T'); c.rect(1, 20, 1, 5, 'U'); c.ell(2.5, 25.6, 1.5, 1.3, 'F');
  c.rect(11, 20, 3, 3, 'T'); c.rect(11, 20, 3, 1, 'U'); c.ell(px - sway - 0.5, 22, 1.5, 1.4, 'F');
  // Head: round, with two pointed ears.
  c.ell(7.5, 14, 5.3, 4.6, 'F', 'f', 'D');
  c.rect(3, 8, 3, 3, 'F'); c.px(3, 8, 'D'); c.px(4, 7, 'D'); c.px(5, 8, 'D'); c.rect(4, 8, 1, 2, 'P'); c.px(4, 7, 'F');
  c.rect(10, 8, 3, 3, 'F'); c.px(12, 8, 'D'); c.px(11, 7, 'D'); c.px(10, 8, 'D'); c.rect(11, 8, 1, 2, 'P'); c.px(11, 7, 'F');
  c.rect(3, 10, 10, 1, 'F');
  // The flat cap, peak to one side.
  c.ell(7.5, 10.6, 5.2, 1.9, 'T', 'U', 'V'); c.rect(2, 11, 6, 1, 'V');
  if (front) {
    // Stripes on the brow, green eyes, a pink nose, whiskers (after the outline).
    c.px(7, 12, 'D'); c.px(8, 12, 'D'); c.px(6, 13, 'D');
    [5, 9].forEach((x) => {
      if (blink) { c.rect(x, 15, 3, 1, 'n'); return; }
      c.rect(x, 14, 3, 3, 'e'); c.rect(x + 1, 14, 1, 3, 'n'); c.px(x, 14, 'w');
    });
    c.rect(7, 17, 2, 1, 'P'); c.px(6, 18, 'D'); c.px(9, 18, 'D'); c.px(7, 18, 'D'); c.px(8, 18, 'D');
    c.rect(5, 18, 6, 1, 'i'); c.px(4, 17, 'f'); c.px(11, 17, 'f');
  } else {
    c.rect(4, 12, 8, 1, 'D'); c.rect(6, 14, 4, 1, 'D');
  }
  c.outline();
  if (front) { c.line(5, 17, 1, 16, 'm'); c.line(5, 18, 1, 19, 'm'); c.line(11, 17, 13, 16, 'm'); c.line(11, 18, 13, 19, 'm'); }
  return c;
}
const TA = (cv) => TANSY(cv.closed().rows());
export const CF_TANSY_SPRITES = {
  a: TA(tansyFigure('down', { flame: 1 })),
  b: TA(tansyFigure('down', { blink: true, flame: 2, sway: 0 })),
  c: TA(tansyFigure('down', { tail: 1, flame: 1, sway: 1 })),
  d: TA(tansyFigure('down', { flame: 2, sway: 0 })),
};
Object.assign(CF_PROP_LOOKS, {
  cf_tansy: TA(tansyFigure('down', { flame: 1 })),
  cf_tansy_back: TA(tansyFigure('up', { flame: 1 })),
});

// =====================================================================
// MRS. WRASSE, the chandler (a heron)
// =====================================================================
// Tall and thin and grey-blue: a heron in round gold spectacles with a black
// plume trailing from the back of her head, a lilac dress and a cream apron
// with deep pockets, a yellow tape measure round her neck and a coil of rope
// over one arm. She is two heads taller than the hero. 16 wide, 30 tall.
const WRASSE = pal({
  k: '#1a1220',
  w: '#e8ecf2', g: '#a8b4c8', G: '#7a88a4', // plumage, shade, deeper
  b: '#f0c050', B: '#bf8a26', // beak and legs
  d: '#2a2838', // plume, pupils
  s: '#e8c050', // spectacles
  L: '#7a68b0', l: '#5a4a90', M: '#9a88cc', // dress
  i: '#f6ecd4', I: '#cfc3a6', // apron
  Y: '#f4d84a', y: '#2a2838', // tape measure and its ticks
  t: '#8a6a40', T: '#5e4428', // rope
});
function wrasseFigure(dir, { blink = false, tilt = 0, rope = 0 } = {}) {
  const c = new Cv(16, 30);
  const front = dir === 'down';
  // Legs: long and thin, with big toes.
  c.line(6, 25, 6, 28, 'B'); c.line(10, 25, 10, 28, 'B');
  c.rect(4, 29, 5, 1, 'B'); c.rect(8, 29, 5, 1, 'B'); c.px(3, 29, 'B'); c.px(13, 29, 'B');
  // The dress, a long bell, apron over the front.
  for (let y = 15; y <= 26; y++) {
    const half = 3.4 + (y - 15) * 0.38;
    for (let x = Math.round(8 - half); x < Math.round(8 + half); x++) c.px(x, y, x <= Math.round(8 - half) + 1 ? 'M' : x >= Math.round(8 + half) - 2 ? 'l' : 'L');
  }
  c.rect(4, 26, 8, 1, 'l');
  if (front) { c.rect(5, 18, 6, 8, 'i'); c.rect(10, 18, 1, 8, 'I'); c.rect(6, 22, 4, 1, 'I'); c.rect(5, 17, 6, 1, 'I'); }
  else { c.line(8, 16, 8, 25, 'l'); }
  // A shawl over the shoulders.
  c.ell(8, 15.4, 4.6, 1.8, 'M', 'M', 'L');
  // The coil of rope over her left arm; the arm itself.
  c.rect(1, 16, 2, 6, 'L'); c.ell(2.2, 22.5 + rope, 1.4, 1.4, 'w');
  c.ell(2, 20, 2.6, 2.4, 't', 't', 'T'); c.ell(2, 20, 1, 1, '.', null, null); c.px(2, 20, 'T');
  c.rect(13, 16, 2, 6, 'L'); c.ell(14, 22.6, 1.4, 1.4, 'w');
  // The long neck, S-bent, with the tape measure round it.
  c.rect(7, 8, 3, 8, 'w'); c.rect(9, 8, 1, 8, 'g'); c.px(7, 12, 'g'); c.px(7, 14, 'g');
  c.rect(6, 12, 5, 1, 'Y'); c.px(7, 12, 'y'); c.px(9, 12, 'y'); c.px(10, 12, 'y');
  if (front) { c.rect(6, 13, 2, 3, 'Y'); c.px(6, 14, 'y'); c.px(7, 15, 'y'); }
  // Head: small and sleek, a long yellow beak, a black plume trailing back.
  const hx = 8 + tilt;
  c.ell(hx, 5.4, 3.4, 2.9, 'w', 'w', 'g');
  c.rect(hx - 1, 2, 3, 1, 'd'); c.line(hx + 2, 3, hx + 6, 3 + 2, 'd'); c.line(hx + 1, 2, hx + 5, 4, 'd'); c.line(hx + 4, 4, hx + 6, 8, 'd'); c.px(hx + 6, 9, 'd');
  if (front) {
    c.rect(hx, 6, 7, 1, 'b'); c.rect(hx, 7, 5, 1, 'B'); c.px(hx + 7, 6, 'd');
    // Round gold spectacles over a small dark eye.
    if (blink) { c.rect(hx + 1, 5, 2, 1, 'd'); } else { c.px(hx + 1, 5, 'd'); c.px(hx + 2, 5, 'd'); }
    c.rect(hx, 4, 4, 1, 's'); c.rect(hx, 6, 4, 1, 's'); c.px(hx, 5, 's'); c.px(hx + 3, 5, 's'); c.line(hx - 2, 5, hx, 5, 's');
  } else {
    c.rect(hx - 2, 4, 5, 1, 'g'); c.line(hx - 2, 5, hx + 2, 5, 'g');
  }
  return c.outline();
}
const WR = (cv) => WRASSE(cv.rows());
export const CF_WRASSE_SPRITES = {
  a: WR(wrasseFigure('down')),
  b: WR(wrasseFigure('down', { blink: true })),
  c: WR(wrasseFigure('down', { tilt: 1, rope: 1 })),
  d: WR(wrasseFigure('down', { tilt: 1 })),
};
Object.assign(CF_PROP_LOOKS, {
  cf_wrasse: WR(wrasseFigure('down')),
  cf_wrasse_back: WR(wrasseFigure('up')),
});

// =====================================================================
// THE COCKLE STALL (a crab, and her stall)
// =====================================================================
// A broad orange-red shore crab in a paper hat and a blue-striped apron, one
// claw up with a cockle in it, the other clacking. 18 wide, 18 tall. Her stall
// is 32 wide (two tiles): a striped awning on two posts, a counter of cockle
// bowls, a string of dried fish and a hand-lettered board.
const CRAB = pal({
  k: '#1a1220',
  o: '#e0603a', O: '#f08a56', r: '#a8381e', // shell, lit, shade
  w: '#ffffff', n: '#241a20', // eyes
  i: '#f6ecd4', I: '#cfc3a6', // hat, apron
  b: '#5a88c0', B: '#3a6098', // apron stripes
  c: '#e8d4a8', C: '#b89868', // a cockle
  p: '#e8a0a0',
});
function crabFigure(dir, { claw = 0, blink = false, bob = 0 } = {}) {
  const c = new Cv(18, 18);
  const front = dir === 'down';
  // Legs: three a side, jointed, and the shell low to the ground.
  [[3, 16], [5, 16], [7, 16]].forEach(([x, y]) => { c.line(x - 1, y - 2, x - 2, y + 1, 'r'); });
  [[11, 16], [13, 16], [15, 16]].forEach(([x, y]) => { c.line(x + 1, y - 2, x + 2, y + 1, 'r'); });
  c.ell(9, 12 + bob, 7.4, 4.4, 'o', 'O', 'r');
  // The apron: blue and cream stripes over her front.
  if (front) { for (let x = 5; x < 13; x++) for (let y = 12 + bob; y < 17; y++) c.px(x, y, x % 2 ? 'i' : 'b'); c.rect(5, 12 + bob, 8, 1, 'B'); c.px(4, 12 + bob, 'B'); c.px(13, 12 + bob, 'B'); }
  else { c.rect(4, 11 + bob, 10, 1, 'r'); c.line(9, 12, 9, 16, 'r'); }
  // Eye stalks and eyes.
  c.rect(6, 5 + bob, 1, 4, 'o'); c.rect(11, 5 + bob, 1, 4, 'o');
  if (front) {
    [6, 11].forEach((x) => { if (blink) c.rect(x - 1, 4 + bob, 3, 1, 'n'); else { c.ell(x, 4 + bob, 1.6, 1.5, 'w'); c.px(x, 4 + bob, 'n'); } });
    c.px(8, 9 + bob, 'n'); c.px(9, 9 + bob, 'n'); c.px(7, 8 + bob, 'r'); c.px(10, 8 + bob, 'r');
  }
  // A paper hat, folded, between the stalks.
  c.rect(7, 2 + bob, 4, 2, 'i'); c.rect(6, 4 + bob, 6, 1, 'I'); c.px(8, 1 + bob, 'i'); c.px(9, 1 + bob, 'i');
  // Left claw, up and clacking: open (claw 1) or shut.
  c.thick(3, 10, 2, 6, 2, 'o');
  if (claw) { c.rect(0, 2, 3, 4, 'O'); c.rect(3, 2, 3, 3, 'O'); c.px(2, 5, 'k'); c.px(3, 4, 'k'); c.rect(1, 6, 3, 1, 'r'); c.px(4, 6, 'o'); }
  else { c.rect(0, 3, 5, 4, 'O'); c.rect(0, 6, 5, 1, 'r'); c.px(2, 4, 'k'); }
  // Right claw: holds up a cockle.
  c.thick(14, 10, 15, 7, 2, 'o'); c.rect(14, 4, 4, 4, 'O'); c.rect(14, 7, 4, 1, 'r'); c.px(16, 5, 'k');
  c.ell(16, 3, 1.8, 1.5, 'c', 'i', 'C'); c.px(16, 2, 'C');
  return c.outline();
}
const CR = (cv) => CRAB(cv.closed().rows());
export const CF_CRAB_COCKLE_SPRITES = {
  a: CR(crabFigure('down')), b: CR(crabFigure('down', { claw: 1 })), c: CR(crabFigure('down', { blink: true, bob: 1 })), d: CR(crabFigure('down', { claw: 1, bob: 1 })),
};
Object.assign(CF_PROP_LOOKS, { cf_crab_cockle: CR(crabFigure('down')), cf_crab_cockle_back: CR(crabFigure('up')) });

const STALL = pal({
  k: '#1a1220',
  b: '#4a7ab0', B: '#2e5688', w: '#f4efe0', W: '#d6ceb8', // awning
  p: '#a8743c', P: '#8a5c30', Q: '#5e3c1e', // wood
  c: '#e8d4a8', C: '#b89868', // cockles
  s: '#cfd6e0', S: '#8890a0', // fish, bowls
  r: '#c8503a', x: '#2a2838',
});
function cockleStall(frame) {
  const c = new Cv(32, 28);
  // Awning, scalloped, striped.
  for (let y = 0; y < 5; y++) for (let x = 0; x < 32; x++) c.px(x, y, Math.floor(x / 4) % 2 ? 'w' : 'b');
  for (let x = 0; x < 32; x += 4) { const wb = Math.floor(x / 4) % 2; c.rect(x, 5, 4, 1, wb ? 'W' : 'B'); c.rect(x + 1, 6, 2, 1, wb ? 'W' : 'B'); }
  // Posts, and a string of dried fish hung from the awning's edge.
  c.rect(1, 6, 2, 22, 'p'); c.rect(29, 6, 2, 22, 'p'); c.rect(1, 6, 1, 22, 'P');
  c.line(5, 7, 12, 8, 'Q'); c.line(12, 8, 19, 7, 'Q');
  [[7, 8], [11, 9], [15, 9], [18, 8]].forEach(([x, y], i) => { c.rect(x, y + 1, 2, 4 + (i % 2), 's'); c.px(x, y + 5 + (i % 2), 'S'); c.px(x + 1, y + 1, 'x'); });
  // Counter.
  c.rect(0, 17, 32, 3, 'p'); c.rect(0, 17, 32, 1, 'P'); c.rect(0, 19, 32, 1, 'Q');
  c.rect(1, 20, 30, 8, 'P'); c.rect(1, 20, 30, 1, 'Q'); for (let x = 7; x < 31; x += 8) c.rect(x, 21, 1, 7, 'Q'); c.rect(3, 26, 26, 2, 'Q');
  // The board: COCKLES in strokes, a shell.
  c.rect(6, 22, 20, 5, 'w'); c.rect(6, 26, 20, 1, 'W');
  for (let x = 8; x < 18; x += 2) c.rect(x, 23, 1, 3, 'x');
  c.ell(21.5, 24.4, 2.2, 1.9, 'c', 'w', 'C'); c.px(21, 23, 'C'); c.px(22, 24, 'C');
  // Bowls of cockles on the counter, one with steam.
  [[4], [12], [20]].forEach(([x]) => { c.rect(x, 14, 7, 3, 'S'); c.rect(x, 14, 7, 1, 's'); c.ell(x + 3.5, 13.3, 3.4, 1.8, 'c', 'w', 'C'); c.px(x + 2, 13, 'C'); c.px(x + 5, 13, 'C'); });
  c.rect(27, 14, 3, 3, 'r'); c.px(28, 13, 'S');
  if (frame % 2) { c.px(7, 10, 'w'); c.px(8, 9, 'w'); c.px(9, 8, 'W'); } else { c.px(8, 10, 'w'); c.px(7, 9, 'w'); c.px(8, 8, 'W'); }
  return c.outline();
}
const ST = (cv) => STALL(cv.rows());
export const CF_COCKLE_STALL_SPRITES = { a: ST(cockleStall(0)), b: ST(cockleStall(1)) };
CF_PROP_LOOKS.cf_cockle_stall = ST(cockleStall(0));

// =====================================================================
// THE INNKEEPER OF THE DROWNED RAT (a rat, of course)
// =====================================================================
// A fat brown rat with big pink ears, a white apron grey with use, a towel
// over his shoulder and a tankard he is always polishing. A kind, tired face
// and a fine set of whiskers. 16 wide, 22 tall.
const RAT = pal({
  k: '#1a1220',
  F: '#8a6a58', f: '#b08e78', D: '#5e4438', // brown fur
  p: '#e8a0a8', P: '#c07a86', // ears, tail, nose
  n: '#241a20', w: '#ffffff', m: '#f0e8dc', // eyes, shine, whiskers
  i: '#efe6d0', I: '#bcb094', // apron
  b: '#3a5a86', B: '#28406a', // shirt
  g: '#d8a040', G: '#9a6a1c', h: '#fff4d0', // tankard and its foam
  t: '#e0e8f0', // towel
  X: '#4a3a30',
});
function ratFigure(dir, { polish = 0, blink = false, ear = 0, tail = 0 } = {}) {
  const c = new Cv(16, 22);
  const front = dir === 'down';
  // The tail curls out at the back, pink, a bit sad.
  const t = tail ? 1 : 0;
  c.line(12, 20, 15, 19, 'p'); c.line(15, 19, 15, 16 - t, 'p'); c.px(14, 15 - t, 'P');
  // Feet.
  c.ell(5, 21, 2.5, 1.2, 'F'); c.ell(11, 21, 2.5, 1.2, 'F'); c.px(3, 21, 'D'); c.px(13, 21, 'D');
  // The body: shirt and the long apron.
  c.ell(8, 16, 6.2, 5.2, 'b', 'b', 'B');
  if (front) { c.rect(4, 14, 8, 7, 'i'); c.rect(10, 14, 2, 7, 'I'); c.rect(4, 20, 8, 1, 'I'); c.rect(5, 17, 3, 2, 'I'); c.px(6, 11, 'i'); c.px(10, 11, 'i'); c.rect(5, 12, 1, 3, 'i'); c.rect(10, 12, 1, 3, 'i'); }
  else { c.rect(5, 13, 6, 8, 'I'); c.line(8, 13, 8, 20, 'B'); }
  // The towel over one shoulder.
  c.rect(11, 12, 3, 5, 't'); c.rect(13, 12, 1, 5, 'I'); c.px(12, 17, 'I');
  // Arms: one with the tankard and rag.
  c.rect(1, 13, 3, 4, 'b'); c.ell(2.5, 18, 1.7, 1.6, 'f');
  c.rect(11, 13, 3, 3, 'b');
  const rx = 12 - polish;
  c.ell(rx, 17, 1.7, 1.6, 'f');
  c.rect(rx - 2, 14, 4, 5, 'g'); c.rect(rx - 2, 14, 1, 5, 'h'); c.rect(rx + 1, 15, 2, 3, 'G'); c.rect(rx - 2, 13, 4, 1, 'h'); c.px(rx - 1, 12, 'h');
  if (polish) c.rect(rx - 3, 16, 2, 2, 't');
  // Head: pear-shaped, a long snout, big pink round ears.
  const eo = ear ? 1 : 0;
  c.ell(4.2, 5 + eo, 3, 3.2, 'F', 'f', 'D'); c.ell(4.2, 5.4 + eo, 1.9, 2, 'p');
  c.ell(11.8, 5, 3, 3.2, 'F', 'f', 'D'); c.ell(11.8, 5.4, 1.9, 2, 'p');
  c.ell(8, 8.6, 4.6, 4, 'F', 'f', 'D');
  if (front) {
    c.ell(8, 11, 2.6, 2, 'f');
    c.rect(7, 11, 2, 1, 'P'); c.px(7, 10, 'P'); c.px(8, 10, 'P');
    [5, 10].forEach((x) => { if (blink) c.rect(x, 8, 2, 1, 'n'); else { c.rect(x, 7, 2, 2, 'n'); c.px(x, 7, 'w'); } });
    // Tired brows, a little line of a smile.
    c.px(5, 6, 'D'); c.px(6, 6, 'D'); c.px(10, 6, 'D'); c.px(11, 6, 'D'); c.px(4, 7, 'D'); c.px(12, 7, 'D');
    c.px(7, 13, 'D'); c.px(8, 13, 'D'); c.px(9, 12, 'D'); c.px(6, 12, 'D');
  } else { c.rect(5, 9, 6, 1, 'D'); }
  c.outline();
  if (front) { c.line(6, 11, 2, 10, 'm'); c.line(6, 12, 2, 13, 'm'); c.line(10, 11, 14, 10, 'm'); c.line(10, 12, 14, 13, 'm'); }
  return c;
}
const RA = (cv) => RAT(cv.closed().rows());
export const CF_RAT_INNKEEPER_SPRITES = {
  a: RA(ratFigure('down')), b: RA(ratFigure('down', { polish: 1 })), c: RA(ratFigure('down', { blink: true, tail: 1 })), d: RA(ratFigure('down', { polish: 2, ear: 1 })),
};
Object.assign(CF_PROP_LOOKS, { cf_rat_innkeeper: RA(ratFigure('down')), cf_rat_innkeeper_back: RA(ratFigure('up')) });

// =====================================================================
// THE HARBOUR CLERK (a puffin)
// =====================================================================
// A small, fussy puffin: black back, white front, a big stripy orange beak,
// a green eyeshade and round spectacles, ink on the cuffs, a ledger held to
// the chest and a quill behind the ear. 14 wide, 20 tall.
const PUFFIN = pal({
  k: '#1a1220',
  d: '#2a2838', D: '#444058', // black feathers
  w: '#f4f4f0', g: '#c8c8c8', // white face and front
  o: '#f07a28', O: '#ffb040', r: '#d8402a', y: '#f4d040', // beak, stripes
  e: '#3a7a54', E: '#265a3c', // the green eyeshade
  s: '#e8c050', n: '#241a20', // spectacles, eyes
  B: '#6a3a2a', b: '#a8683c', i: '#efe6d0', // ledger, pages
  q: '#e8e0d0', Q: '#3a5a86', // quill, ink
});
function puffinFigure(dir, { blink = false, write = 0, bob = 0 } = {}) {
  const c = new Cv(14, 20);
  const front = dir === 'down';
  // Orange webbed feet.
  c.rect(3, 19, 4, 1, 'o'); c.rect(8, 19, 4, 1, 'o'); c.px(2, 19, 'o'); c.px(11, 19, 'o'); c.px(7, 19, 'O');
  // Body: black back, white front, wings tucked.
  c.ell(7, 14.6, 5, 5, 'd', 'D', 'd');
  if (front) { c.ell(7, 15.2, 3.2, 4, 'w', 'w', 'g'); }
  c.ell(2.6, 14.6, 1.6, 3.4, 'd', 'D', 'd'); c.ell(11.4, 14.6, 1.6, 3.4, 'd', 'D', 'd');
  // The ledger, held up to the chest, and the quill.
  if (front) {
    c.rect(3, 13 + bob, 8, 5, 'B'); c.rect(4, 14 + bob, 6, 3, 'i'); c.line(7, 14 + bob, 7, 16 + bob, 'g'); c.rect(3, 17 + bob, 8, 1, 'b');
    c.line(5, 15 + bob, 6, 15 + bob, 'Q'); c.line(8, 15 + bob, 9, 15 + bob, 'Q'); c.line(8, 16 + bob, 9, 16 + bob, 'Q');
    const qx = 10 + (write ? 1 : 0);
    c.line(qx, 13, qx + 2, 9, 'q'); c.px(qx - 1, 14, 'Q'); c.px(qx, 14, 'Q');
    c.px(1, 14, 'D'); c.px(12, 16, 'Q'); c.px(1, 17, 'Q');
  } else { c.line(7, 11, 7, 18, 'D'); }
  // Head: a round black cap, a white face patch.
  c.ell(7, 6, 4.6, 4.4, 'd', 'D', 'd');
  if (front) {
    c.ell(7, 7, 3.4, 2.8, 'w', 'w', 'g');
    // Eyes behind round spectacles; the big stripy beak.
    [4, 8].forEach((x) => {
      if (blink) c.rect(x, 6, 2, 1, 'n'); else { c.rect(x, 5, 2, 2, 'n'); c.px(x, 5, 'w'); }
      c.rect(x - 1, 4, 4, 1, 's'); c.rect(x - 1, 7, 4, 1, 's'); c.px(x - 1, 5, 's'); c.px(x - 1, 6, 's'); c.px(x + 2, 5, 's'); c.px(x + 2, 6, 's');
    });
    c.rect(5, 6, 4, 2, 'y'); c.rect(4, 8, 6, 2, 'o'); c.rect(5, 10, 4, 1, 'o'); c.rect(4, 8, 6, 1, 'r'); c.px(6, 9, 'O'); c.px(7, 9, 'O'); c.rect(6, 7, 2, 1, 'r');
    c.line(5, 10, 5, 8, 'r'); c.line(8, 10, 8, 8, 'r');
  }
  // The green eyeshade.
  c.ell(7, 3, 5.4, 1.8, 'e', 'e', 'E'); c.rect(2, 4, 10, 1, 'E');
  if (!front) c.rect(4, 5, 6, 3, 'D');
  return c.outline();
}
const PU = (cv) => PUFFIN(cv.rows());
export const CF_CLERK_PUFFIN_SPRITES = {
  a: PU(puffinFigure('down')), b: PU(puffinFigure('down', { write: 1, bob: 1 })), c: PU(puffinFigure('down', { blink: true })), d: PU(puffinFigure('down', { write: 1 })),
};
Object.assign(CF_PROP_LOOKS, { cf_clerk_puffin: PU(puffinFigure('down')), cf_clerk_puffin_back: PU(puffinFigure('up')) });

// =====================================================================
// THE KIDS OF SALTCOMBE
// =====================================================================
// Two small ones, about Corrie's size, who are never still. A seal pup in a
// bobble hat sailing a paper boat, and an otter girl in a too-big yellow
// raincoat (she copies Haddock) with a crab bucket. 12 wide, 14 tall.
const PUP = pal({
  k: '#1a1220', W: '#f4f2ec', w: '#d4d2ca', g: '#9aa0aa', n: '#241a20', h: '#ffffff',
  r: '#d8503e', R: '#a83426', i: '#efe6d0', I: '#bcb094', m: '#e8e8ee', b: '#4a7ab0',
});
function pupFigure(dir, { bounce = 0, blink = false, boat = 0 } = {}) {
  const c = new Cv(12, 14);
  const front = dir === 'down';
  const b = bounce;
  c.ell(4, 13, 2, 1, 'g'); c.ell(8, 13, 2, 1, 'g');
  c.ell(6, 9 - b, 4.2, 3.6, 'W', 'h', 'w');
  c.ell(6, 5 - b, 4.2, 3.6, 'W', 'h', 'w');
  // Bobble hat.
  c.ell(6, 2.4 - b, 4, 1.8, 'r', 'r', 'R'); c.rect(2, 3 - b, 8, 1, 'R'); c.ell(6, 0.4 - b, 1.3, 1.2, 'W');
  if (front) {
    [3, 7].forEach((x) => { if (blink) c.rect(x, 5 - b, 2, 1, 'n'); else { c.rect(x, 4 - b, 2, 3, 'n'); c.px(x, 4 - b, 'h'); } });
    c.rect(5, 7 - b, 2, 1, 'n'); c.px(6, 8 - b, 'g');
  }
  // Flippers up, holding a paper boat.
  c.rect(1, 8 - b, 2, 2, 'W'); c.rect(9, 8 - b, 2, 2, 'W');
  const by = 8 - b - boat;
  c.rect(3, by, 6, 2, 'i'); c.rect(3, by + 1, 6, 1, 'I'); c.px(6, by - 1, 'i'); c.px(6, by - 2, 'b'); c.px(7, by - 1, 'b');
  c.outline();
  if (front) { c.line(3, 7 - b, 0, 6 - b, 'm'); c.line(8, 7 - b, 11, 6 - b, 'm'); }
  return c;
}
const PP = (cv) => PUP(cv.closed().rows());
export const CF_KID_PUP_SPRITES = { a: PP(pupFigure('down')), b: PP(pupFigure('down', { bounce: 1, boat: 1 })), c: PP(pupFigure('down', { blink: true })), d: PP(pupFigure('down', { bounce: 1 })) };
Object.assign(CF_PROP_LOOKS, { cf_kid_pup: PP(pupFigure('down')), cf_kid_pup_back: PP(pupFigure('up')) });

const OTTERKID = pal({
  k: '#1a1220', F: '#9a6a42', f: '#c49464', D: '#6e4a2c', i: '#efe6d0', n: '#241a20', h: '#ffffff', m: '#f0e8dc',
  Y: '#f2c230', y: '#c48e14', Z: '#ffe58a', X: '#8a5c0e', B: '#3d4258', S: '#9aa4b4', s: '#6c7484', P: '#d98a8a',
});
function otterKidFigure(dir, { swing = 0, blink = false, bounce = 0 } = {}) {
  const c = new Cv(12, 15);
  const front = dir === 'down';
  const b = bounce;
  // Boots, a big yellow coat down to her knees.
  c.rect(3, 13, 3, 2, 'B'); c.rect(7, 13, 3, 2, 'B');
  for (let y = 8; y <= 13; y++) { const half = 3.4 + (y - 8) * 0.25; for (let x = Math.round(6 - half); x < Math.round(6 + half); x++) c.px(x, y - b, x <= Math.round(6 - half) ? 'Z' : x >= Math.round(6 + half) - 2 ? 'y' : 'Y'); }
  c.rect(2, 13 - b, 9, 1, 'X');
  if (front) c.line(6, 9 - b, 6, 13 - b, 'y');
  // The bucket swings from one paw.
  const bx = 10 + swing;
  c.rect(10, 9 - b, 1, 2, 'F'); c.rect(bx - 1, 11 - b, 4, 3, 'S'); c.rect(bx - 1, 11 - b, 4, 1, 's'); c.px(bx, 10 - b, 's'); c.px(bx + 2, 10 - b, 's');
  c.rect(1, 9 - b, 2, 3, 'Y'); c.px(1, 12 - b, 'f');
  // The head: round, small ears, a hood pushed back.
  c.ell(6, 5 - b, 4.2, 3.6, 'F', 'f', 'D');
  c.ell(2.6, 2.4 - b, 1.3, 1.3, 'F'); c.ell(9.4, 2.4 - b, 1.3, 1.3, 'F');
  c.ell(6, 1.6 - b, 3.8, 1.8, 'Y', 'Z', 'y'); c.rect(2, 2 - b, 8, 1, 'y');
  if (front) {
    [3, 7].forEach((x) => { if (blink) c.rect(x, 5 - b, 2, 1, 'n'); else { c.rect(x, 4 - b, 2, 2, 'n'); c.px(x, 4 - b, 'h'); } });
    c.ell(6, 7 - b, 2, 1.3, 'i'); c.rect(5, 6 - b, 2, 1, 'n'); c.px(5, 8 - b, 'P'); c.px(6, 8 - b, 'P');
  }
  c.outline();
  if (front) { c.line(4, 7 - b, 1, 6 - b, 'm'); c.line(8, 7 - b, 11, 6 - b, 'm'); }
  return c;
}
const OK = (cv) => OTTERKID(cv.closed().rows());
export const CF_KID_OTTER_SPRITES = { a: OK(otterKidFigure('down')), b: OK(otterKidFigure('down', { swing: -1, bounce: 1 })), c: OK(otterKidFigure('down', { blink: true })), d: OK(otterKidFigure('down', { swing: -2 })) };
Object.assign(CF_PROP_LOOKS, { cf_kid_otter: OK(otterKidFigure('down')), cf_kid_otter_back: OK(otterKidFigure('up')) });

// =====================================================================
// FISHERS (and other Saltcombe folk)
// =====================================================================
// One build in four colourings: a stocky fisher in a wool jumper and big
// black boots. A is an otter (blue stripes, red woolly cap, a fish on a
// string), B a vole (green jumper, yellow sou'wester, a pipe), C a stoat
// (rust jumper, navy flat cap, a net over the shoulder), D an old badger
// (navy jumper, grey beanie, an unlit tin lantern). 16 wide, 20 tall.
const FISHER_LOOKS = {
  a: { kind: 'otter', F: '#9a6a42', f: '#c49464', D: '#6e4a2c', J1: '#4a6ea8', J2: '#e8e4d8', hat: ['#c8402e', '#932a1e', '#e8786a'] },
  b: { kind: 'vole', F: '#8a8272', f: '#b0a690', D: '#5e5848', J1: '#4c8a56', J2: '#d8d0b0', hat: ['#f2c230', '#c48e14', '#ffe58a'] },
  c: { kind: 'stoat', F: '#c08a52', f: '#f0e4cc', D: '#7a5430', J1: '#b8603a', J2: '#e8c8a0', hat: ['#34486c', '#223250', '#566a90'] },
  d: { kind: 'badger', F: '#8a909a', f: '#e8eaee', D: '#4a4e58', J1: '#2e4468', J2: '#6a7e9c', hat: ['#9aa0aa', '#6a7080', '#c4c8d0'] },
};
function fisherPal(look) {
  return pal({
    k: '#1a1220', F: look.F, f: look.f, D: look.D, A: look.J1, a: look.J2, H: look.hat[0], h: look.hat[1], L: look.hat[2],
    B: '#2e3040', C: '#1a1a28', n: '#241a20', w: '#ffffff', P: '#d98a8a', m: '#f0e8dc',
    t: '#8a6a40', s: '#cfd6e0', S: '#8890a0', g: '#e0b040', G: '#7a5614', y: '#f2c230', q: '#c4ccd8', e: '#6a4a2c',
  });
}
function fisherFigure(dir, look, { blink = false, bob = 0, puff = 0, step = 0 } = {}) {
  const c = new Cv(16, 20);
  const front = dir === 'down';
  const b = bob;
  // Big black boots.
  c.rect(3, 18, 4, 2, 'B'); c.rect(9, 18, 4, 2, 'B'); c.px(2, 19, 'C'); c.px(13, 19, 'C'); c.rect(3, 19 - (step ? 1 : 0), 4, 1, 'C');
  // The jumper: a barrel with stripes, a roll collar.
  c.ell(8, 14 - b, 6.4, 5, 'A', 'A', 'A');
  for (let y = 10; y <= 18; y += 2) for (let x = 2; x <= 14; x++) if (c.get(x, y - b) === 'A') c.px(x, y - b, 'a');
  c.rect(5, 9 - b, 6, 2, 'a'); c.rect(5, 10 - b, 6, 1, 'A');
  // Arms: hands out front, the right one with the thing.
  c.rect(1, 11 - b, 3, 5, 'A'); c.rect(1, 12 - b, 3, 1, 'a'); c.ell(2.5, 16.4 - b, 1.7, 1.5, 'F');
  c.rect(12, 11 - b, 3, 5, 'A'); c.rect(12, 12 - b, 3, 1, 'a'); c.ell(13.5, 16.4 - b, 1.7, 1.5, 'F');
  if (look.kind === 'otter') { c.line(14, 17 - b, 14, 19, 't'); c.rect(13, 19, 3, 1, 's'); c.px(15, 19, 'S'); }
  if (look.kind === 'vole' && front) { c.px(10, 8 - b, 'e'); c.px(11, 8 - b, 'e'); c.rect(12, 7 - b, 2, 2, 'e'); if (puff) { c.px(13, 5 - b, 'w'); c.px(14, 4 - b, 'w'); } }
  if (look.kind === 'stoat') { c.line(2, 10 - b, 13, 17 - b, 't'); c.line(2, 11 - b, 13, 18 - b, 't'); c.px(5, 12 - b, 'G'); c.px(9, 15 - b, 'G'); }
  if (look.kind === 'badger') { c.rect(11, 17 - b, 4, 3, 'S'); c.rect(11, 17 - b, 4, 1, 'q'); c.rect(12, 16 - b, 2, 1, 'G'); c.px(13, 18 - b, 'g'); }
  // Head.
  const hy = 5 - b;
  c.ell(8, hy, 4.6, 4.2, 'F', 'f', 'D');
  if (look.kind === 'otter') { c.ell(3.6, hy - 3, 1.2, 1.2, 'F'); c.ell(12.4, hy - 3, 1.2, 1.2, 'F'); if (front) c.ell(8, hy + 2, 2.8, 1.8, 'f'); }
  if (look.kind === 'vole') { c.ell(3.2, hy - 2.6, 1.9, 1.9, 'F', 'f', 'D'); c.ell(12.8, hy - 2.6, 1.9, 1.9, 'F', 'f', 'D'); c.px(3, hy - 2, 'P'); c.px(13, hy - 2, 'P'); }
  if (look.kind === 'stoat') { c.ell(3.4, hy - 3, 1.3, 1.3, 'F'); c.ell(12.6, hy - 3, 1.3, 1.3, 'F'); if (front) c.ell(8, hy + 2.4, 3, 1.8, 'f'); }
  if (look.kind === 'badger' && front) { c.rect(6, hy - 4, 1, 8, 'f'); c.rect(9, hy - 4, 1, 8, 'f'); c.rect(6, hy - 1, 4, 5, 'f'); c.rect(3, hy, 2, 2, 'D'); c.rect(11, hy, 2, 2, 'D'); }
  // Hat: a woolly cap, a sou'wester, a flat cap, a beanie.
  if (look.kind === 'otter') { c.ell(8, hy - 3, 4.8, 2.2, 'H', 'L', 'h'); c.rect(3, hy - 1, 10, 1, 'h'); c.ell(8, hy - 5.4, 1.2, 1.2, 'H'); }
  if (look.kind === 'vole') { c.ell(8, hy - 3, 4.6, 2.2, 'H', 'L', 'h'); c.rect(2, hy - 1, 12, 1, 'H'); c.rect(2, hy - 1, 12, 1, 'h'); c.rect(1, hy - 1, 14, 1, 'h'); }
  if (look.kind === 'stoat') { c.ell(8, hy - 3, 5, 1.9, 'H', 'L', 'h'); c.rect(3, hy - 1, 11, 1, 'h'); c.rect(9, hy - 1, 6, 1, 'H'); }
  if (look.kind === 'badger') { c.ell(8, hy - 3, 4.8, 2.4, 'H', 'L', 'h'); c.rect(3, hy - 1, 10, 1, 'h'); }
  if (front) {
    [5, 9].forEach((x) => { if (blink) c.rect(x, hy + 0, 2, 1, 'n'); else { c.rect(x, hy - 1, 2, 2, 'n'); c.px(x, hy - 1, 'w'); } });
    c.rect(7, hy + 2, 2, 1, look.kind === 'badger' ? 'n' : 'P'); c.px(7, hy + 2, 'n'); c.px(8, hy + 2, 'n');
    if (look.kind !== 'vole') c.px(7, hy + 4, 'D'); else c.px(8, hy + 4, 'D');
  }
  c.outline();
  if (front && look.kind !== 'badger') { c.line(6, hy + 3, 3, hy + 2, 'm'); c.line(10, hy + 3, 13, hy + 2, 'm'); }
  return c;
}
const FSH = {};
for (const [k, look] of Object.entries(FISHER_LOOKS)) {
  const P = fisherPal(look);
  const f = (o) => P(fisherFigure('down', look, o).closed().rows());
  FSH[k] = {
    anim: { a: f({}), b: f({ bob: 1, puff: 1 }), c: f({ blink: true }), d: f({ puff: 1 }) },
    front: f({}), back: P(fisherFigure('up', look).closed().rows()),
  };
}
export const CF_FISHER_A_SPRITES = FSH.a.anim;
export const CF_FISHER_B_SPRITES = FSH.b.anim;
export const CF_FISHER_C_SPRITES = FSH.c.anim;
export const CF_FISHER_D_SPRITES = FSH.d.anim;
for (const k of Object.keys(FSH)) {
  CF_PROP_LOOKS[`cf_fisher_${k}`] = FSH[k].front;
  CF_PROP_LOOKS[`cf_fisher_${k}_back`] = FSH[k].back;
}

// =====================================================================
// THE BREAKFAST BASKET, and Marigold with it
// =====================================================================
// The chapter opens on Marigold seeing the three of you off: the same Marigold
// as chapter 4's (belowFolk.js), now with a covered basket on her arm. The
// first two frames are her standing there, blinking; the second two are her
// waving goodbye (an ear flops on the last). Same size as her: 16 x 24.
Object.assign(CF_PALETTE, BF_PALETTE);
const BASKET = pal({
  k: '#120c1c', b: '#c8964e', B: '#8a6030', r: '#d8503e', w: '#f6f0e0', t: '#8a5c30', y: '#f0c050',
});
function basketCv() {
  const c = new Cv(16, 24);
  // Handle, over her wrist.
  c.px(1, 18, 'B'); c.px(1, 17, 'B'); c.px(2, 16, 'B'); c.px(3, 16, 'B'); c.px(4, 16, 'B'); c.px(5, 17, 'B'); c.px(5, 18, 'B');
  // The cloth: checks, and a loaf end poking out.
  c.rect(0, 18, 7, 2, 'r'); c.px(1, 18, 'w'); c.px(3, 18, 'w'); c.px(5, 18, 'w'); c.px(2, 19, 'w'); c.px(4, 19, 'w'); c.px(6, 19, 'w');
  c.ell(4.5, 17.4, 1.6, 1.2, 'y');
  // The basket, woven.
  c.rect(0, 20, 7, 3, 'b'); c.rect(0, 20, 7, 1, 'B'); c.rect(0, 22, 7, 1, 'B'); c.px(2, 21, 'B'); c.px(4, 21, 'B'); c.px(6, 21, 'B'); c.px(1, 22, 'b');
  return c.outline();
}
function overlay(rows, top) {
  return rows.map((row, y) => [...row].map((ch, x) => (top[y][x] !== '.' ? top[y][x] : ch)).join(''));
}
const BK = BASKET(basketCv().rows());
const MB = (rows) => overlay(rows, BK);
export const CF_MARIGOLD_BASKET_SPRITES = { a: MB(BF_MARIGOLD_SPRITES.a), b: MB(BF_MARIGOLD_SPRITES.b) };
export const CF_MARIGOLD_WAVE_SPRITES = { a: MB(BF_MARIGOLD_SPRITES.c), b: MB(BF_MARIGOLD_SPRITES.d), c: MB(BF_MARIGOLD_SPRITES.c), d: MB(BF_MARIGOLD_SPRITES.d) };
CF_PROP_LOOKS.cf_marigold_basket = CF_MARIGOLD_BASKET_SPRITES.a;
// The basket on its own, on the ground (a prop for the picnic spot).
function basketProp() {
  const c = new Cv(12, 10);
  c.px(3, 3, 'B'); c.px(2, 4, 'B'); c.px(8, 3, 'B'); c.px(9, 4, 'B'); c.rect(3, 2, 6, 1, 'B');
  c.rect(1, 4, 10, 2, 'r'); [2, 4, 6, 8].forEach((x) => c.px(x, 4, 'w')); [3, 5, 7, 9].forEach((x) => c.px(x, 5, 'w'));
  c.ell(7, 3.6, 2, 1.3, 'y'); c.rect(2, 3, 2, 2, 'w');
  c.rect(1, 6, 10, 3, 'b'); c.rect(1, 6, 10, 1, 'B'); c.rect(1, 8, 10, 1, 'B'); [3, 5, 7, 9].forEach((x) => c.px(x, 7, 'B'));
  return c.outline();
}
CF_PROP_LOOKS.cf_basket = BASKET(basketProp().rows());

// =====================================================================
// FACES, for the dialogue box
// =====================================================================
// In exactly the format of the portraits in portraits.js: 32x32, an idle face
// and a blinking one, and `expressions`, each a few changes to the idle face
// as [row, column, pixels]; `eyes` are the rows the eyes are on. Each face is
// drawn from a few settings and every expression is the same face with other
// settings, so they always match; the patches are worked out from the
// differences. A portrait's palette uses its own plain letters.
const differingRows = (a, b) => a.map((row, i) => (row === b[i] ? -1 : i)).filter((i) => i >= 0);
function patchesFor(base, rows) {
  const out = [];
  rows.forEach((row, y) => {
    if (row === base[y]) return;
    let x0 = 0;
    while (row[x0] === base[y][x0]) x0++;
    let x1 = row.length - 1;
    while (row[x1] === base[y][x1]) x1--;
    out.push([y, x0, row.slice(x0, x1 + 1)]);
  });
  return out;
}
function makePortrait(palette, draw, base, expressions) {
  const idle = draw(base);
  const blink = draw({ ...base, blink: true });
  const out = {};
  for (const [name, settings] of Object.entries(expressions)) {
    const rows = draw({ ...base, ...settings });
    out[name] = { patches: patchesFor(idle, rows), ...(settings.closed ? { closed: true } : {}) };
  }
  return { palette, eyes: differingRows(idle, blink), expressions: out, idle, blink };
}
const mir = (x) => 31 - x;
const both = (c, x, y, col) => { c.px(x, y, col); c.px(mir(x), y, col); };

// --- Haddock ---
// The lightman, close up: the sou'wester pulled down over his brow, small
// kind eyes under bushy white brows, a big pink-whiskered muzzle behind the
// moustache, two ivory tusks, the collar of the navy oilskin. His mouth is
// under the moustache, so the moustache does the acting: it lifts when he's
// pleased, droops when he's sad, bristles when he's offended.
const HADDOCK_PORTRAIT_PALETTE = {
  k: '#1a1020',
  a: '#a8825f', A: '#c9a27c', b: '#7d5c42', // hide
  p: '#dba398', P: '#b87a74', // muzzle pad
  n: '#2a1a1e', w: '#ffffff', // eyes, shine
  m: '#e4dfd0', M: '#b2ab98', N: '#7f7968', // moustache
  i: '#fffbea', I: '#d8c690', // tusks
  Y: '#46587a', y: '#33415c', Z: '#6a7c9c', X: '#222b40', // oilskin, deep navy
  o: '#5a2a36', q: '#d0586a', // mouth, tongue
  s: '#bfe6ff', // tear, sweat
  t: '#6b4a2c',
};
function haddockFace(f) {
  const c = new Cv(32, 32);
  const lift = f.lift ?? 0; // moustache ends up (+) or sagging (-)
  const L = Math.round(lift);
  // The coat's collar at the bottom corners, and the cord.
  for (let y = 27; y < 32; y++) for (let x = 0; x < 32; x++) if (x < 7 + (y - 27) || x > 24 - (y - 27)) c.px(x, y, x > 24 ? 'y' : 'Y');
  c.rect(0, 27, 6, 1, 'Z'); c.rect(26, 28, 6, 1, 'X');
  // The head: wide and low.
  c.ell(16, 16.4, 13.6, 10.6, 'a', 'A', 'b');
  if (f.cup) {
    // A flipper cupped behind his ear, hat flap pushed out of the way.
    c.ell(2.6, 17, 3.4, 4.8, 'a', 'A', 'b'); c.px(1, 14, 'b'); c.px(0, 16, 'b'); c.px(0, 19, 'b'); c.px(1, 21, 'b'); c.rect(4, 15, 1, 5, 'b');
  }
  if (f.hatless) {
    // No hat (the crank scene): a bare, soaked dome, a few wet strands plastered
    // flat across it and the sea running off his brow.
    c.ell(16, 9.4, 11.4, 6.2, 'a', 'A', 'b');
    c.rect(9, 5, 5, 1, 'A'); c.rect(8, 6, 2, 1, 'A'); c.px(15, 4, 'A'); // wet shine
    [[12, 4, 17, 6], [15, 4, 21, 7], [18, 5, 23, 8]].forEach(([x0, y0, x1, y1]) => c.line(x0, y0, x1, y1, 'M'));
    c.px(11, 4, 'M'); c.px(22, 9, 'N');
    [[6, 9], [6, 10], [25, 8], [25, 9], [25, 10], [13, 11], [19, 11]].forEach(([x, y]) => c.px(x, y, 's'));
  } else {
    // The sou'wester: crown, wide brim dipping at the sides, flaps.
    c.rect(1, 7, 4, 11, 'y'); c.rect(1, 7, 1, 11, 'X'); c.rect(27, 7, 4, 11, 'y'); c.rect(30, 7, 1, 11, 'X');
    c.ell(16, 2.2, 12, 5.4, 'Y', 'Z', 'y');
    c.ell(16, 7, 15.6, 2.8, 'Y', 'Z', 'y');
    c.rect(1, 8, 30, 1, 'y');
    c.rect(6, 4, 4, 1, 'Z'); c.rect(11, 2, 3, 1, 'Z');
    c.rect(4, 10, 24, 1, 'b'); // the brim's shadow on his brow
  }
  if (f.cup) { c.ell(2.6, 17, 3.4, 4.8, 'a', 'A', 'b'); c.px(0, 16, 'b'); c.px(0, 19, 'b'); c.px(1, 21, 'b'); c.px(1, 14, 'b'); c.rect(4, 15, 1, 5, 'b'); }
  // Brows: bushy white tufts, two rows thick. y0 is the outer end, slope the
  // rise per pixel towards the middle (negative: the inner end goes up).
  const brow = (side, y0, slope) => {
    for (let i = 0; i < 7; i++) {
      const x = 6 + i;
      const y = Math.round(y0 + slope * i);
      c.px(side ? mir(x) : x, y, 'm'); c.px(side ? mir(x) : x, y + 1, i % 2 ? 'M' : 'm');
    }
    c.px(side ? mir(5) : 5, Math.round(y0) + 2, 'M');
  };
  const bk = f.brow ?? 'kind';
  const BR = { kind: [[11, -0.12], [11, -0.12]], up: [[9, -0.2], [9, -0.2]], sad: [[13, -0.5], [13, -0.5]], low: [[10, 0.45], [10, 0.45]], tired: [[12.5, 0], [12.5, 0]], offended: [[8, -0.1], [9.6, 0.5]], eh: [[8.4, -0.3], [11.4, 0.1]], soft: [[10.6, -0.25], [10.6, -0.25]] }[bk];
  brow(0, BR[0][0], BR[0][1]); brow(1, BR[1][0], BR[1][1]);
  // Eyes: small, dark, kind. Left eye at x 8, right at x 21 (three wide).
  const ey = f.eyeY ?? 14;
  [8, 21].forEach((x, i) => {
    const e = f.eyes ?? 'open';
    if (f.blink || e === 'blink') { c.rect(x, ey + 2, 3, 1, 'n'); return; }
    if (e === 'arc') { [[-1, 2], [0, 1], [1, 0], [2, 0], [3, 1], [4, 2]].forEach(([dx, dy]) => c.px(x + dx, ey + dy + 1, 'n')); return; }
    if (e === 'soft') { [[-1, 0], [0, 1], [1, 2], [2, 2], [3, 1], [4, 0]].forEach(([dx, dy]) => c.px(x + dx, ey + dy + 1, 'n')); c.px(x + 1, ey + 4, 'b'); c.px(x + 2, ey + 4, 'b'); return; }
    if (e === 'wide') { const big = bk === 'eh' && i === 0; const r = big ? 2.6 : 2.1; c.ell(x + 1, ey + 1.5, r, r, 'w'); c.rect(x, ey + 1, 3, 3, 'n'); c.px(x, ey + 1, 'w'); return; }
    if (e === 'glare') { c.rect(x, ey + 1, 3, 2, 'n'); c.px(x + (i ? 2 : 0), ey + 1, 'w'); return; }
    if (e === 'lid') { c.rect(x - 1, ey, 5, 1, 'b'); c.rect(x, ey + 1, 3, 2, 'n'); c.px(x, ey + 1, 'w'); return; }
    if (e === 'heavy') { c.rect(x - 1, ey + 1, 5, 1, 'b'); c.rect(x, ey + 2, 3, 1, 'n'); c.rect(x - 1, ey + 4, 5, 1, 'b'); return; }
    if (e === 'down') { c.rect(x, ey + 1, 3, 2, 'n'); c.px(x, ey + 3, 'w'); c.px(x + 1, ey + 3, 'w'); return; }
    c.rect(x, ey, 3, 3, 'n'); c.px(x, ey, 'w'); c.px(x + (i ? 3 : -1), ey + 3, 'b');
  });
  if (f.tear) { c.px(9, 19, 's'); c.px(9, 20, 's'); c.px(8, 21, 's'); c.px(9, 21, 's'); c.px(22, 20, 's'); c.px(22, 21, 's'); }
  if (f.sweat) { c.px(27, 12, 's'); c.px(27, 13, 's'); c.px(26, 14, 's'); c.px(27, 14, 's'); }
  // The muzzle pad and nose.
  c.ell(16, 21, 8.4, 5, 'p', 'p', 'P');
  c.rect(13, 17, 6, 2, 'n'); c.px(12, 18, 'n'); c.px(19, 18, 'n'); c.px(14, 17, 'w');
  if (f.blush) { c.ell(5.4, 21, 2.2, 1.4, 'P'); c.ell(26.6, 21, 2.2, 1.4, 'P'); }
  // The moustache: two heavy lobes with strands and drooping ends.
  const my = 22.6 - lift * 0.5;
  c.ell(9.6, my, 8.2, 3.7, 'm', 'm', 'M');
  c.ell(22.4, my, 8.2, 3.7, 'm', 'm', 'M');
  c.rect(14, 20, 4, 5, 'm'); c.px(15, 21, 'M'); c.px(16, 22, 'M'); c.px(16, 23, 'N');
  const droop = 6 - L * 2 + (f.sag ?? 0);
  for (let k = 0; k < droop; k++) {
    c.px(3 + (k > 3 ? 0 : 1), 23 + k - L, k > droop - 3 ? 'M' : 'm'); c.px(4, 23 + k - L, 'm');
    c.px(28 - (k > 3 ? 0 : 1), 23 + k - L, k > droop - 3 ? 'N' : 'M'); c.px(27, 23 + k - L, 'm');
  }
  [[9, 22, 5, 25]].forEach(([x0, y0, x1, y1]) => { c.line(x0, y0 - L, x1, y1 - L, 'M'); c.line(mir(x0), y0 - L, mir(x1), y1 - L, 'N'); });
  if (f.bristle) { [[3, 20], [2, 22], [4, 18], [28, 20], [29, 22], [27, 18], [1, 24], [30, 24]].forEach(([x, y]) => c.px(x, y, 'm')); c.px(2, 21, 'M'); c.px(29, 21, 'M'); }
  // Tusks, over the moustache and the chin.
  c.ell(16, 27.6, 5, 2.4, 'a', 'a', 'b');
  // The mouth, only seen when he laughs: open between the tusks.
  if (f.open) { c.ell(16, 26.4, 3.6, 3, 'o'); c.rect(14, 28, 5, 2, 'q'); c.rect(13, 24, 7, 1, 'M'); }
  const ty = 24 + (f.open ? 1 : 0) + (f.tuskUp ?? 0);
  c.rect(11, ty, 3, 6, 'i'); c.rect(13, ty, 1, 6, 'I'); c.px(11, ty + 6, 'I'); c.px(12, ty + 6, 'I'); c.px(10, ty + 1, 'b'); c.px(10, ty + 2, 'b'); c.px(10, ty + 3, 'b');
  c.rect(18, ty, 3, 6, 'i'); c.rect(20, ty, 1, 6, 'I'); c.px(18, ty + 6, 'I'); c.px(19, ty + 6, 'I'); c.px(21, ty + 1, 'b'); c.px(21, ty + 2, 'b'); c.px(21, ty + 3, 'b');
  return c.outline('k').rows();
}
const HADDOCK_EXPRESSIONS = {
  smile: { eyes: 'arc', brow: 'up', lift: 1.4, blush: true },
  laughing: { eyes: 'arc', brow: 'up', lift: 2.6, open: true, blush: true, closed: true },
  proud: { eyes: 'lid', brow: 'up', lift: 1.2, tuskUp: 0, blush: false },
  offended: { eyes: 'glare', brow: 'offended', bristle: true, lift: 0.4, sweat: false },
  eh: { eyes: 'wide', brow: 'eh', cup: true, lift: 0 },
  sad: { eyes: 'down', brow: 'sad', lift: -1.4, sag: 1, tear: true },
  tender: { eyes: 'soft', brow: 'soft', lift: 0.6, blush: true, closed: true },
  determined: { eyes: 'glare', brow: 'low', lift: 0.2, sweat: false },
  tired: { eyes: 'heavy', brow: 'tired', lift: -1, sag: 1, sweat: true },
};
export const HADDOCK_PORTRAIT = makePortrait(HADDOCK_PORTRAIT_PALETTE, haddockFace, { eyes: 'open', brow: 'kind', lift: 0.4 }, HADDOCK_EXPRESSIONS);
// The same face with his hat gone and soaked through, for the crank (tideHeldFinale.js).
export const HADDOCK_HATLESS_PORTRAIT = makePortrait(HADDOCK_PORTRAIT_PALETTE, haddockFace, { eyes: 'open', brow: 'kind', lift: 0.4, hatless: true }, HADDOCK_EXPRESSIONS);

// --- Orla Cobb ---
// A grey seal in a red bandana: big dark wet eyes under heavy brows, a pale
// muzzle with long whiskers, soot on her cheek, the straps of a leather apron
// over a rust-red shirt.
const ORLA_PORTRAIT_PALETTE = {
  k: '#1a1020',
  s: '#8c949e', S: '#b6bdc7', d: '#5f6772', // fur
  n: '#241a20', w: '#ffffff', m: '#eef0f4', // eyes, shine, whiskers
  r: '#a8483a', R: '#7a3028', // bandana, shirt
  L: '#8a5530', l: '#54301a', // apron
  o: '#2e2a30', // soot
  q: '#c8606a', // inside the mouth
  p: '#e0a0a0', // blush
};
function orlaFace(f) {
  const c = new Cv(32, 32);
  // Shoulders: the shirt and the apron bib with its straps.
  for (let y = 27; y < 32; y++) for (let x = 2; x < 30; x++) c.px(x, y, 'R');
  c.rect(9, 27, 14, 5, 'L'); c.rect(21, 27, 2, 5, 'l'); c.line(8, 26, 12, 31, 'l'); c.line(23, 26, 19, 31, 'l'); c.px(13, 30, 'o'); c.px(16, 29, 'o'); c.px(18, 31, 'o');
  c.ell(16, 16.4, 12.6, 11.4, 's', 'S', 'd');
  // The bandana, a knot at the side.
  c.ell(16, 5.2, 12.4, 4.6, 'r', 'r', 'R'); c.rect(4, 7, 24, 3, 'r'); c.rect(4, 9, 24, 1, 'R');
  c.rect(26, 7, 4, 2, 'r'); c.px(30, 9, 'r'); c.px(30, 10, 'R'); c.px(29, 11, 'r'); c.px(28, 5, 'R');
  // The muzzle and nose.
  c.ell(16, 22, 8, 5.4, 'S', 'm', 'S');
  c.rect(13, 18, 6, 3, 'n'); c.px(12, 19, 'n'); c.px(19, 19, 'n'); c.px(14, 18, 'w');
  c.px(16, 21, 'd'); c.px(16, 22, 'd');
  // Eyes: big and dark.
  const ey = 12;
  [7, 20].forEach((x, i) => {
    const e = f.eyes ?? 'open';
    if (f.blink || e === 'blink') { c.rect(x, ey + 3, 5, 1, 'n'); return; }
    if (e === 'arc') { [[0, 3], [1, 2], [2, 1], [3, 2], [4, 3]].forEach(([dx, dy]) => c.px(x + dx, ey + dy + 1, 'n')); return; }
    if (e === 'soft') { c.rect(x - 1, ey + 1, 7, 1, 'd'); c.rect(x, ey + 2, 5, 4, 'n'); c.px(x + 1, ey + 3, 'w'); c.px(x + 2, ey + 3, 'w'); c.px(x + 3, ey + 5, 'w'); return; }
    if (e === 'half') { c.rect(x - 1, ey + 1, 7, 1, 'd'); c.rect(x, ey + 2, 5, 3, 'n'); c.px(x + 1, ey + 2, 'w'); return; }
    c.rect(x, ey, 5, 6, 'n'); c.rect(x + 1, ey - 1, 3, 1, 'n'); c.rect(x + 1, ey + 6, 3, 1, 'n'); c.px(x + 1, ey + 1, 'w'); c.px(x + 2, ey + 1, 'w'); c.px(x + 3, ey + 4, 'w');
  });
  // Brows.
  const bk = f.brow ?? 'frown';
  const bw = (x0, y0, dir) => { for (let i = 0; i < 7; i++) { const yy = y0 + Math.round(dir * i); c.px(x0 + i, yy, 'd'); c.px(x0 + i, yy + 1, 'd'); } };
  if (bk === 'frown') { bw(5, 8, 0.28); bw(20, 11, -0.28); }
  if (bk === 'flat') { bw(5, 9, 0.1); bw(20, 9, -0.1); }
  if (bk === 'up') { bw(5, 8, -0.15); bw(20, 8, 0.15); }
  if (bk === 'one') { bw(5, 7, -0.1); bw(20, 11, -0.3); }
  if (bk === 'soft') { bw(5, 10, -0.2); bw(20, 8, 0.2); }
  // Mouth under the muzzle.
  const m = f.mouth ?? 'line';
  if (m === 'line') { c.rect(14, 24, 5, 1, 'd'); }
  if (m === 'frown') { c.rect(13, 25, 7, 1, 'd'); c.px(12, 26, 'd'); c.px(20, 26, 'd'); c.px(13, 24, 'd'); c.px(19, 24, 'd'); }
  if (m === 'smile') { c.rect(14, 25, 5, 1, 'd'); c.px(12, 24, 'd'); c.px(13, 25, 'd'); c.px(20, 24, 'd'); c.px(19, 25, 'd'); }
  if (m === 'smirk') { c.rect(14, 25, 4, 1, 'd'); c.px(18, 24, 'd'); c.px(19, 23, 'd'); }
  if (m === 'flat') { c.rect(13, 25, 7, 1, 'd'); }
  if (f.blush) { c.ell(6, 21, 2.2, 1.4, 'p'); c.ell(26, 21, 2.2, 1.4, 'p'); }
  // Soot on her cheek and forehead.
  c.px(5, 19, 'o'); c.px(6, 19, 'o'); c.px(6, 20, 'o'); c.px(7, 20, 'o'); c.px(24, 12, 'o'); c.px(25, 13, 'o'); c.px(15, 11, 'o');
  c.outline('k');
  // Whiskers over the outline, long and pale.
  const wy = 21 + (f.wy ?? 0);
  c.line(10, wy, 1, wy - 2, 'm'); c.line(10, wy + 1, 0, wy + 2, 'm'); c.line(10, wy + 2, 2, wy + 5, 'm');
  c.line(22, wy, 31, wy - 2, 'm'); c.line(22, wy + 1, 31, wy + 2, 'm'); c.line(22, wy + 2, 29, wy + 5, 'm');
  return c.rows();
}
const ORLA_EXPRESSIONS = {
  gruff: { brow: 'frown', mouth: 'frown', eyes: 'half' },
  proud: { brow: 'up', mouth: 'smirk', eyes: 'open', blush: false },
  soft: { brow: 'soft', mouth: 'smile', eyes: 'soft', blush: true },
  annoyed: { brow: 'one', mouth: 'flat', eyes: 'half' },
};
export const ORLA_PORTRAIT = makePortrait(ORLA_PORTRAIT_PALETTE, orlaFace, { eyes: 'open', brow: 'flat', mouth: 'line' }, ORLA_EXPRESSIONS);

// --- Corrie ---
// A pale, see-through boy: wet dark hair plastered over his brow, pale cyan
// eyes (a little too bright), a big yellow oilskin collar swallowing his neck,
// and water beading and running off him.
const CORRIE_PORTRAIT_PALETTE = {
  k: 'rgba(16, 30, 60, 0.95)',
  c: 'rgba(226, 240, 248, 0.94)', C: 'rgba(160, 196, 220, 0.92)', // skin
  H: 'rgba(52, 68, 112, 0.97)', h: 'rgba(100, 124, 180, 0.95)', // hair
  y: 'rgba(240, 206, 92, 0.9)', Y: 'rgba(255, 232, 150, 0.9)', z: 'rgba(188, 148, 48, 0.9)', // coat
  e: '#bff8ff', E: '#6cd4f0', w: '#ffffff', n: 'rgba(30, 50, 90, 0.98)',
  D: 'rgba(196, 236, 255, 0.95)', G: 'rgba(120, 210, 255, 0.55)', p: 'rgba(232, 150, 160, 0.8)', m: 'rgba(110, 90, 120, 0.95)',
};
function corrieFace(f) {
  const c = new Cv(32, 32);
  const dy = f.down ?? 0;
  // The collar of the huge coat.
  for (let y = 25; y < 32; y++) for (let x = 0; x < 32; x++) if (x < 9 + (y - 25) * 0.4 || x > 22 - (y - 25) * 0.4) c.px(x, y, x > 22 - (y - 25) * 0.4 ? 'z' : 'y');
  c.rect(0, 25, 7, 2, 'Y'); c.rect(25, 25, 7, 2, 'z');
  // A swirl of water round him when he's angry.
  if (f.swirl) { c.line(0, 12, 4, 6, 'G'); c.line(1, 16, 0, 10, 'G'); c.line(31, 12, 27, 6, 'G'); c.line(30, 16, 31, 10, 'G'); c.line(2, 22, 0, 20, 'G'); c.line(29, 22, 31, 20, 'G'); }
  c.ell(16, 15.6 + dy, 10.4, 10.4, 'c', 'c', 'C');
  c.rect(12, 24 + dy, 8, 3, 'C');
  // Hair: wet, dark, plastered down with a few wild strands.
  c.ell(16, 8.4 + dy, 11.6, 6.4, 'H', 'h', 'H');
  c.rect(5, 9 + dy, 22, 2, 'H'); c.rect(7, 11 + dy, 5, 1, 'H'); c.rect(20, 11 + dy, 5, 1, 'H'); c.px(6, 12 + dy, 'H'); c.px(26, 12 + dy, 'H'); c.px(5, 13 + dy, 'H'); c.px(27, 13 + dy, 'H');
  [[8, 3], [12, 2], [19, 2], [24, 3], [15, 1]].forEach(([x, y], i) => { c.px(x, y + dy, i % 2 ? 'h' : 'H'); c.px(x, y + 1 + dy, 'H'); });
  // Eyes.
  const ey = 15 + dy;
  [8, 19].forEach((x, i) => {
    const e = f.eyes ?? 'open';
    if (f.blink || e === 'blink') { c.rect(x, ey + 3, 5, 1, 'n'); return; }
    if (e === 'half') { c.rect(x - 1, ey + 1, 7, 2, 'C'); c.rect(x, ey + 3, 5, 2, 'e'); c.px(x + 2, ey + 4, 'n'); c.px(x + 2, ey + 3, 'n'); c.px(x, ey + 3, 'w'); return; }
    if (e === 'glare') { c.rect(x, ey + 1, 5, 4, 'e'); c.rect(x + 1, ey + 1, 3, 4, 'E'); c.rect(x + 2, ey + 2, 1, 2, 'n'); c.px(x + 1, ey + 1, 'w'); return; }
    if (e === 'cry') { c.rect(x, ey + 1, 5, 5, 'e'); c.rect(x + 2, ey + 3, 2, 3, 'n'); c.px(x + 1, ey + 2, 'w'); c.px(x + 2, ey + 2, 'w'); c.rect(x, ey + 6, 5, 1, 'D'); return; }
    c.rect(x, ey, 5, 6, 'e'); c.rect(x + 1, ey - 1, 3, 1, 'e'); c.rect(x + 1, ey + 6, 3, 1, 'e');
    c.rect(x + 2, ey + 2, 2, 3, 'n'); c.px(x + 1, ey + 1, 'w'); c.px(x + 2, ey + 1, 'w');
  });
  // Brows under the fringe.
  const bk = f.brow ?? 'sad';
  const bw = (x0, y0, dir) => { for (let i = 0; i < 6; i++) c.px(x0 + i, y0 + Math.round(dir * i) + dy, 'H'); };
  if (bk === 'sad') { bw(7, 14, -0.25); bw(19, 12, 0.25); }
  if (bk === 'angry') { bw(6, 12, 0.5); bw(20, 15, -0.5); c.px(8, 14 + dy, 'H'); c.px(23, 14 + dy, 'H'); }
  if (bk === 'cry') { bw(7, 15, -0.5); bw(19, 12, 0.5); }
  if (bk === 'flat') { bw(7, 13, 0.1); bw(19, 13, -0.1); }
  // Mouth, tears, drops.
  const m = f.mouth ?? 'tiny';
  if (m === 'tiny') { c.rect(14, 24 + dy, 4, 1, 'm'); c.px(13, 23 + dy, 'm'); }
  if (m === 'shout') { c.ell(16, 25 + dy, 3.6, 2.8, 'm'); c.rect(13, 23 + dy, 6, 1, 'w'); }
  if (m === 'wail') { c.ell(16, 25 + dy, 3, 3, 'm'); c.rect(15, 27 + dy, 3, 1, 'p'); }
  if (m === 'small') { c.rect(15, 24 + dy, 3, 1, 'm'); }
  if (f.tears) { [[9, 21], [9, 22], [8, 23], [9, 24], [9, 25], [22, 21], [22, 22], [23, 23], [22, 24], [22, 25]].forEach(([x, y]) => c.px(x, y + dy, 'D')); c.px(8, 20 + dy, 'D'); c.px(23, 20 + dy, 'D'); }
  if (f.cheek) { c.ell(7, 22 + dy, 2, 1.3, 'p'); c.ell(25, 22 + dy, 2, 1.3, 'p'); }
  c.px(27, 22 + dy, 'D'); c.px(4, 19 + dy, 'D'); c.px(5, 27, 'D');
  return c.outline('k').rows();
}
const CORRIE_EXPRESSIONS = {
  angry: { eyes: 'glare', brow: 'angry', mouth: 'shout', swirl: true },
  crying: { eyes: 'cry', brow: 'cry', mouth: 'wail', tears: true, cheek: true },
  small: { eyes: 'half', brow: 'flat', mouth: 'small', down: 1, cheek: true },
};
export const CORRIE_PORTRAIT = makePortrait(CORRIE_PORTRAIT_PALETTE, corrieFace, { eyes: 'open', brow: 'sad', mouth: 'tiny' }, CORRIE_EXPRESSIONS);

// --- Mrs. Tansy ---
// A ginger tabby with a flat navy cap over pointed ears, big green eyes, a
// pink nose and a crisp set of whiskers, a navy collar with a brass button.
const TANSY_PORTRAIT_PALETTE = {
  k: '#1a1020',
  F: '#e0903e', f: '#f4b86c', D: '#a85a22', // fur, lit, stripes
  i: '#f6ecd4', I: '#cfc3a6', // muzzle
  T: '#3a5878', U: '#587898', V: '#26405c', // cap and coat
  e: '#8ae070', E: '#4a9a3c', n: '#241a20', w: '#ffffff', P: '#e08a90', m: '#fffaf0', G: '#e0b040', o: '#7a2a36',
};
function tansyFace(f) {
  const c = new Cv(32, 32);
  for (let y = 26; y < 32; y++) for (let x = 3; x < 29; x++) c.px(x, y, x > 22 ? 'V' : x < 8 ? 'U' : 'T');
  c.rect(14, 26, 4, 6, 'i'); c.px(16, 29, 'G'); c.px(16, 31, 'G'); c.rect(8, 26, 3, 1, 'V');
  const ears = f.ears ?? 'up';
  const ey = ears === 'back' ? 5 : 3;
  // Ears: tall and pointed.
  [[4, 1], [22, 1]].forEach(([x, i]) => {
    for (let y = 0; y < 9; y++) c.rect(x + (i ? Math.floor(y / 3) : 3 - Math.floor(y / 3)) - (ears === 'back' ? (i ? -1 : 1) : 0), ey + y, 6 - Math.floor(y / 3) * 0 - (i ? 0 : 0), 1, 'F');
  });
  c.rect(7, ey + 3, 2, 5, 'P'); c.rect(23, ey + 3, 2, 5, 'P');
  c.ell(16, 16.6, 12.4, 10, 'F', 'f', 'D');
  // The cap.
  c.ell(16, 8, 11.6, 3.6, 'T', 'U', 'V'); c.rect(4, 10, 20, 2, 'V'); c.rect(18, 11, 11, 2, 'V'); c.rect(18, 11, 11, 1, 'U'); c.rect(6, 5, 3, 1, 'U');
  // Tabby marks on the brow and cheeks.
  c.rect(15, 12, 2, 2, 'D'); c.rect(11, 13, 2, 1, 'D'); c.rect(19, 13, 2, 1, 'D'); c.rect(5, 18, 3, 1, 'D'); c.rect(24, 18, 3, 1, 'D'); c.rect(5, 21, 3, 1, 'D'); c.rect(24, 21, 3, 1, 'D');
  // Eyes.
  const y = 15;
  [8, 19].forEach((x, i) => {
    const e = f.eyes ?? 'open';
    if (f.blink || e === 'blink') { c.rect(x, y + 3, 5, 1, 'n'); return; }
    if (e === 'arc') { [[0, 3], [1, 2], [2, 1], [3, 2], [4, 3]].forEach(([dx, dy]) => c.px(x + dx, y + dy + 1, 'n')); return; }
    if (e === 'slit') { c.rect(x, y + 1, 5, 3, 'e'); c.rect(x + 2, y + 1, 1, 3, 'n'); c.rect(x, y, 5, 1, 'D'); c.rect(x, y + 1, 5, 1, 'D'); return; }
    if (e === 'smug') { c.rect(x, y + 2, 5, 2, 'e'); c.rect(x + 2, y + 2, 1, 2, 'n'); c.rect(x - 1, y + 1, 7, 1, 'D'); return; }
    c.rect(x, y, 5, 5, 'e'); c.rect(x + 2, y, 1, 5, 'n'); c.px(x, y, 'w'); c.px(x + 1, y + 1, 'w'); c.rect(x, y + 4, 5, 1, 'E');
  });
  // Muzzle, nose, mouth.
  c.ell(16, 22.4, 5.4, 3.6, 'i', 'i', 'I');
  c.rect(15, 19, 3, 2, 'P'); c.px(16, 21, 'n');
  const m = f.mouth ?? 'w';
  if (m === 'w') { c.px(14, 23, 'n'); c.px(15, 24, 'n'); c.px(16, 22, 'n'); c.px(17, 24, 'n'); c.px(18, 23, 'n'); }
  if (m === 'smile') { c.px(13, 22, 'n'); c.px(14, 23, 'n'); c.px(15, 24, 'n'); c.px(16, 22, 'n'); c.px(17, 24, 'n'); c.px(18, 23, 'n'); c.px(19, 22, 'n'); }
  if (m === 'flat') { c.rect(13, 23, 7, 1, 'n'); c.px(16, 22, 'n'); }
  if (m === 'smug') { c.px(14, 24, 'n'); c.px(15, 24, 'n'); c.px(16, 22, 'n'); c.px(17, 23, 'n'); c.px(18, 22, 'n'); c.px(19, 21, 'n'); }
  if (f.brow === 'huff') { c.rect(7, 12, 5, 1, 'D'); c.rect(20, 12, 5, 1, 'D'); c.px(12, 13, 'D'); c.px(19, 13, 'D'); }
  c.outline('k');
  const wy = 21;
  c.line(9, wy, 0, wy - 2, 'm'); c.line(9, wy + 1, 0, wy + 2, 'm'); c.line(9, wy + 2, 2, wy + 5, 'm');
  c.line(23, wy, 31, wy - 2, 'm'); c.line(23, wy + 1, 31, wy + 2, 'm'); c.line(23, wy + 2, 29, wy + 5, 'm');
  return c.rows();
}
const TANSY_EXPRESSIONS = {
  smug: { eyes: 'smug', mouth: 'smug' },
  huffy: { eyes: 'slit', mouth: 'flat', brow: 'huff', ears: 'back' },
  smile: { eyes: 'arc', mouth: 'smile', closed: true },
};
export const TANSY_PORTRAIT = makePortrait(TANSY_PORTRAIT_PALETTE, tansyFace, { eyes: 'open', mouth: 'w' }, TANSY_EXPRESSIONS);

// --- Mrs. Wrasse ---
// The heron chandler in profile, facing right: a long yellow beak, a round
// gold-rimmed eye behind spectacles, a black plume trailing back off her
// head, a yellow tape measure and the lilac collar of her dress.
const WRASSE_PORTRAIT_PALETTE = {
  k: '#1a1020',
  w: '#e8ecf2', g: '#a8b4c8', G: '#7a88a4',
  b: '#f0c050', B: '#bf8a26', d: '#2a2838', s: '#e8c050',
  L: '#7a68b0', l: '#5a4a90', M: '#9a88cc', Y: '#f4d84a', y: '#2a2838',
  e: '#fff8e0', S: '#bfe6ff', P: '#e8a0a0',
};
function wrasseFace(f) {
  const c = new Cv(32, 32);
  for (let y = 26; y < 32; y++) for (let x = 0; x < 28; x++) c.px(x, y, x < 5 ? 'M' : x > 20 ? 'l' : 'L');
  c.rect(0, 26, 22, 1, 'M');
  // Neck with the tape measure.
  c.rect(7, 18, 11, 9, 'w'); c.rect(15, 18, 3, 9, 'g'); c.rect(6, 23, 13, 2, 'Y'); [8, 11, 14, 17].forEach((x) => c.px(x, 23, 'y')); c.px(10, 24, 'y'); c.px(13, 24, 'y');
  c.rect(8, 25, 2, 6, 'Y'); c.px(8, 27, 'y'); c.px(9, 29, 'y');
  // Head, a long pale oval with the beak out to the right.
  const tilt = f.tilt ?? 0;
  c.ell(14, 10 + tilt, 9.6, 8.4, 'w', 'w', 'g');
  c.line(4, 3 + tilt, 0, 12, 'd'); c.line(5, 2 + tilt, 0, 9, 'd'); c.line(6, 2 + tilt, 1, 6, 'd'); c.line(4, 4 + tilt, 1, 14, 'd'); c.line(3, 5 + tilt, 0, 16, 'd');
  c.rect(9, 1 + tilt, 8, 2, 'd'); c.rect(12, 0 + tilt, 4, 1, 'd');
  // The beak: long, yellow, a darker lower half; open when she's flustered.
  const open = f.open ? 2 : 0;
  c.rect(19, 10 + tilt, 13, 3, 'b'); c.rect(19, 12 + tilt, 13, 1, 'B'); c.px(31, 10 + tilt, 'B'); c.rect(21, 9 + tilt, 6, 1, 'b');
  c.rect(19, 13 + tilt + open, 11, 2, 'b'); c.rect(19, 14 + tilt + open, 11, 1, 'B');
  if (open) { c.rect(21, 13 + tilt, 9, 2, 'P'); }
  c.px(25, 10 + tilt, 'B');
  // The eye: round, behind a round gold-rimmed lens.
  const ex = 17, ey = 8 + tilt;
  c.ell(ex, ey + 1, 4, 4, 'e'); [[0, -3], [1, -3], [2, -3], [-1, -2], [3, -2], [-2, -1], [4, -1], [-2, 0], [4, 0], [-2, 1], [4, 1], [-1, 2], [3, 2], [0, 3], [1, 3], [2, 3]].forEach(([dx, dy]) => c.px(ex + dx, ey + 1 + dy, 's'));
  c.line(ex - 3, ey - 1, 8, ey - 3, 's');
  const e = f.eyes ?? 'open';
  if (f.blink || e === 'blink') { c.rect(ex - 1, ey + 1, 4, 1, 'd'); }
  else if (e === 'narrow') { c.rect(ex - 1, ey + 1, 4, 2, 'd'); c.rect(ex - 2, ey, 6, 1, 'g'); c.px(ex - 2, ey - 1, 'w'); c.px(ex + 3, ey + 3, 'w'); }
  else if (e === 'wide') { c.rect(ex, ey, 3, 3, 'd'); c.px(ex, ey, 'w'); }
  else if (e === 'arc') { c.px(ex - 1, ey + 2, 'd'); c.px(ex, ey + 1, 'd'); c.px(ex + 1, ey + 1, 'd'); c.px(ex + 2, ey + 2, 'd'); }
  else { c.rect(ex, ey + 1, 2, 3, 'd'); c.px(ex, ey + 1, 'w'); }
  if (e === 'narrow') { c.px(ex - 3, ey - 3, 's'); c.px(ex - 4, ey - 4, 'e'); c.px(ex + 4, ey - 3, 'e'); }
  if (f.sweat) { c.px(10, 6, 'S'); c.px(10, 7, 'S'); c.px(9, 8, 'S'); c.px(10, 8, 'S'); }
  if (f.blush) { c.ell(14, 14 + tilt, 2, 1.2, 'P'); }
  return c.outline('k').rows();
}
const WRASSE_EXPRESSIONS = {
  sharp: { eyes: 'narrow' },
  smile: { eyes: 'arc', blush: true, closed: true },
  flustered: { eyes: 'wide', open: true, sweat: true, tilt: 1 },
};
export const WRASSE_PORTRAIT = makePortrait(WRASSE_PORTRAIT_PALETTE, wrasseFace, { eyes: 'open' }, WRASSE_EXPRESSIONS);

// --- The Cockle Stall's crab ---
// A broad orange-red shore crab in a folded paper hat: two eye stalks, a small
// busy mouth, a striped apron strap, and a claw up at each side.
const CRAB_PORTRAIT_PALETTE = {
  k: '#1a1020',
  o: '#e0603a', O: '#f08a56', r: '#a8381e', R: '#7a2812',
  w: '#ffffff', n: '#241a20', i: '#f6ecd4', I: '#cfc3a6', b: '#5a88c0', B: '#3a6098',
  m: '#6a2a24', p: '#e8a0a0', c: '#e8d4a8', C: '#b89868',
};
function crabFace(f) {
  const c = new Cv(32, 32);
  // The shell, and the apron's straps.
  c.ell(16, 21, 15, 9.4, 'o', 'O', 'r');
  for (let x = 12; x < 20; x++) for (let y = 28; y < 32; y++) c.px(x, y, x % 2 ? 'i' : 'b');
  c.line(8, 26, 12, 31, 'B'); c.line(24, 26, 20, 31, 'B');
  // Claws, one each side; the right one with a cockle when pleased.
  const up = f.claws ?? 0;
  c.ell(4, 14 - up, 3.6, 4.4, 'O', 'O', 'r'); c.line(2, 12 - up, 4, 17 - up, 'r'); c.rect(3, 9 - up, 2, 3, 'k');
  c.ell(28, 14 - up, 3.6, 4.4, 'O', 'O', 'r'); c.line(30, 12 - up, 28, 17 - up, 'r'); c.rect(27, 9 - up, 2, 3, 'k');
  if (f.cockle) { c.ell(28, 6, 3, 2.4, 'c', 'i', 'C'); c.px(28, 5, 'C'); c.px(27, 7, 'C'); }
  // Eye stalks.
  const lean = f.lean ?? 0;
  c.rect(10 - lean, 8, 3, 8, 'o'); c.rect(19 + lean, 8, 3, 8, 'o'); c.rect(10 - lean, 8, 1, 8, 'O'); c.rect(19 + lean, 8, 1, 8, 'O');
  [[11 - lean], [20 + lean]].forEach(([x], i) => {
    const e = f.eyes ?? 'open';
    c.ell(x + 0.5, 6, 3.4, 3.4, 'w');
    if (f.blink || e === 'blink') { c.rect(x - 2, 6, 5, 1, 'n'); return; }
    if (e === 'arc') { c.px(x - 1, 7, 'n'); c.px(x, 6, 'n'); c.px(x + 1, 6, 'n'); c.px(x + 2, 7, 'n'); return; }
    if (e === 'wide') { c.rect(x - 1, 4, 4, 4, 'n'); c.px(x - 1, 4, 'w'); return; }
    c.rect(x - 1 + (e === 'side' ? 1 : 0), 5, 3, 3, 'n'); c.px(x - 1 + (e === 'side' ? 1 : 0), 5, 'w');
  });
  // The paper hat, between the stalks.
  c.rect(13, 3, 6, 4, 'i'); c.rect(12, 7, 8, 1, 'I'); c.rect(14, 1, 4, 2, 'i'); c.rect(15, 0, 2, 1, 'i'); c.px(18, 4, 'I'); c.px(18, 5, 'I');
  // Mouth: little mandibles.
  const m = f.mouth ?? 'small';
  if (m === 'small') { c.rect(13, 21, 6, 1, 'm'); c.px(12, 20, 'm'); c.px(19, 20, 'm'); c.rect(14, 23, 4, 1, 'r'); }
  if (m === 'smile') { c.rect(12, 21, 8, 1, 'm'); c.px(11, 20, 'm'); c.px(20, 20, 'm'); c.px(12, 22, 'm'); c.px(19, 22, 'm'); c.rect(14, 22, 4, 1, 'p'); }
  if (m === 'open') { c.ell(16, 22, 4, 2.6, 'm'); c.rect(14, 20, 4, 1, 'i'); }
  if (m === 'worry') { c.rect(13, 22, 6, 1, 'm'); c.px(12, 23, 'm'); c.px(19, 23, 'm'); c.px(13, 21, 'm'); c.px(18, 21, 'm'); }
  c.px(9, 17, 'r'); c.px(22, 17, 'r'); c.px(6, 21, 'r'); c.px(25, 21, 'r'); c.px(11, 26, 'r'); c.px(21, 26, 'r');
  if (f.sweat) { c.px(24, 10, 'w'); c.px(24, 11, 'w'); c.px(23, 12, 'w'); }
  return c.outline('k').rows();
}
const CRAB_EXPRESSIONS = {
  cheery: { eyes: 'arc', mouth: 'smile', claws: 2, cockle: true, closed: true },
  clacking: { eyes: 'wide', mouth: 'open', claws: 4 },
  worried: { eyes: 'side', mouth: 'worry', lean: 1, sweat: true },
};
export const CRAB_PORTRAIT = makePortrait(CRAB_PORTRAIT_PALETTE, crabFace, { eyes: 'open', mouth: 'small' }, CRAB_EXPRESSIONS);

// --- The Drowned Rat's innkeeper ---
// A big brown rat with round pink ears, a long tired kind face, whiskers, and
// the neck of a white apron and a towel over one shoulder.
const RAT_PORTRAIT_PALETTE = {
  k: '#1a1020',
  F: '#8a6a58', f: '#b08e78', D: '#5e4438', p: '#e8a0a8', P: '#c07a86',
  n: '#241a20', w: '#ffffff', m: '#f4ece0', i: '#efe6d0', I: '#bcb094', b: '#3a5a86', t: '#e0e8f0', S: '#bfe6ff',
};
function ratFace(f) {
  const c = new Cv(32, 32);
  for (let y = 26; y < 32; y++) for (let x = 4; x < 28; x++) c.px(x, y, 'b');
  c.rect(10, 26, 12, 6, 'i'); c.rect(20, 26, 2, 6, 'I'); c.rect(23, 26, 5, 6, 't'); c.rect(27, 26, 1, 6, 'I');
  // Ears: big, round and pink.
  const ey = f.ears === 'down' ? 3 : 0;
  c.ell(7, 7 + ey, 6, 6, 'F', 'f', 'D'); c.ell(7, 7.4 + ey, 3.8, 4, 'p', 'p', 'P');
  c.ell(25, 7 + ey, 6, 6, 'F', 'f', 'D'); c.ell(25, 7.4 + ey, 3.8, 4, 'p', 'p', 'P');
  c.ell(16, 16, 10.4, 10.6, 'F', 'f', 'D');
  // Snout.
  c.ell(16, 22, 6, 5, 'f', 'f', 'F');
  c.rect(14, 19, 4, 3, 'P'); c.px(15, 19, 'p'); c.px(16, 22, 'n');
  // Eyes: small and bright, tired lids.
  const y = 13;
  [8, 20].forEach((x, i) => {
    const e = f.eyes ?? 'open';
    if (f.blink || e === 'blink') { c.rect(x, y + 3, 4, 1, 'n'); return; }
    if (e === 'arc') { [[0, 3], [1, 2], [2, 2], [3, 3]].forEach(([dx, dy]) => c.px(x + dx, y + dy, 'n')); return; }
    if (e === 'wide') { c.rect(x, y, 4, 5, 'n'); c.px(x, y, 'w'); c.px(x + 1, y, 'w'); return; }
    if (e === 'wry') { c.rect(x, y + 2, 4, 3, 'n'); c.px(x, y + 2, 'w'); c.rect(x - 1, y + 1, 6, 1, 'D'); return; }
    c.rect(x, y + 1, 4, 4, 'n'); c.px(x, y + 1, 'w'); c.rect(x - 1, y, 6, 1, 'D'); c.rect(x, y + 5, 4, 1, 'D');
  });
  const bk = f.brow ?? 'tired';
  if (bk === 'tired') { c.rect(7, 11, 5, 1, 'D'); c.rect(20, 11, 5, 1, 'D'); c.px(6, 12, 'D'); c.px(25, 12, 'D'); }
  if (bk === 'worry') { c.rect(7, 12, 3, 1, 'D'); c.rect(10, 11, 2, 1, 'D'); c.rect(20, 11, 2, 1, 'D'); c.rect(22, 12, 3, 1, 'D'); c.px(12, 10, 'D'); c.px(19, 10, 'D'); }
  if (bk === 'wry') { c.rect(7, 9, 5, 1, 'D'); c.rect(20, 11, 5, 1, 'D'); c.px(25, 12, 'D'); }
  const m = f.mouth ?? 'line';
  if (m === 'line') { c.px(14, 25, 'D'); c.px(15, 26, 'D'); c.px(16, 26, 'D'); c.px(17, 26, 'D'); c.px(18, 25, 'D'); }
  if (m === 'smile') { c.px(12, 24, 'D'); c.px(13, 25, 'D'); c.px(14, 26, 'D'); c.px(15, 26, 'D'); c.px(16, 26, 'D'); c.px(17, 26, 'D'); c.px(18, 26, 'D'); c.px(19, 25, 'D'); c.px(20, 24, 'D'); c.rect(15, 24, 2, 1, 'w'); }
  if (m === 'frown') { c.px(13, 26, 'D'); c.px(14, 25, 'D'); c.px(15, 25, 'D'); c.px(16, 25, 'D'); c.px(17, 25, 'D'); c.px(18, 25, 'D'); c.px(19, 26, 'D'); }
  if (m === 'smirk') { c.rect(14, 25, 4, 1, 'D'); c.px(18, 24, 'D'); c.px(19, 23, 'D'); }
  if (f.sweat) { c.px(26, 12, 'S'); c.px(26, 13, 'S'); c.px(25, 14, 'S'); c.px(26, 14, 'S'); }
  c.outline('k');
  c.line(11, 22, 1, 20, 'm'); c.line(11, 23, 1, 24, 'm'); c.line(11, 24, 3, 28, 'm');
  c.line(21, 22, 31, 20, 'm'); c.line(21, 23, 31, 24, 'm'); c.line(21, 24, 29, 28, 'm');
  return c.rows();
}
const RAT_EXPRESSIONS = {
  smile: { eyes: 'arc', mouth: 'smile', brow: 'wry', closed: true },
  worried: { eyes: 'wide', mouth: 'frown', brow: 'worry', ears: 'down', sweat: true },
  wry: { eyes: 'wry', mouth: 'smirk', brow: 'wry' },
};
export const RAT_PORTRAIT = makePortrait(RAT_PORTRAIT_PALETTE, ratFace, { eyes: 'open', mouth: 'line', brow: 'tired' }, RAT_EXPRESSIONS);

// --- The harbour clerk ---
// A puffin behind a ledger: a big stripy orange beak, tiny round spectacles on
// a white face, a black cap under a green eyeshade, a quill behind the ear.
const PUFFIN_PORTRAIT_PALETTE = {
  k: '#1a1020',
  d: '#2a2838', D: '#444058', w: '#f4f4f0', g: '#c8c8c8',
  o: '#f07a28', O: '#ffb040', r: '#d8402a', y: '#f4d040',
  e: '#3a7a54', E: '#265a3c', s: '#e8c050', n: '#241a20', q: '#e8e0d0', Q: '#3a5a86', S: '#bfe6ff',
};
function puffinFace(f) {
  const c = new Cv(32, 32);
  for (let y = 27; y < 32; y++) for (let x = 3; x < 29; x++) c.px(x, y, x < 8 || x > 23 ? 'd' : 'w');
  c.ell(16, 16, 12.4, 11, 'd', 'D', 'd');
  c.ell(16, 18.6, 9.8, 8, 'w', 'w', 'g');
  // The eyeshade, and the quill.
  c.ell(16, 6.4, 13, 3.8, 'e', 'e', 'E'); c.rect(2, 9, 28, 2, 'E'); c.rect(6, 4, 3, 1, 'e');
  c.line(27, 8, 31, 1, 'q'); c.line(28, 8, 31, 2, 'q'); c.px(26, 9, 'Q');
  // Eyes, behind round spectacles.
  const y = 12;
  [6, 19].forEach((x, i) => {
    const e = f.eyes ?? 'open';
    if (f.blink || e === 'blink') c.rect(x + 1, y + 3, 4, 1, 'n');
    else if (e === 'arc') { c.px(x + 1, y + 4, 'n'); c.px(x + 2, y + 3, 'n'); c.px(x + 3, y + 3, 'n'); c.px(x + 4, y + 4, 'n'); }
    else if (e === 'wide') { c.rect(x + 1, y + 1, 4, 5, 'n'); c.px(x + 1, y + 1, 'w'); }
    else if (e === 'glare') { c.rect(x + 1, y + 2, 4, 3, 'n'); c.px(x + 1, y + 2, 'w'); c.rect(x, y + 1, 6, 1, 'd'); }
    else { c.rect(x + 1, y + 2, 4, 4, 'n'); c.px(x + 1, y + 2, 'w'); }
    [[1, 0], [2, 0], [3, 0], [4, 0], [0, 1], [5, 1], [0, 2], [5, 2], [0, 3], [5, 3], [0, 4], [5, 4], [0, 5], [5, 5], [1, 6], [2, 6], [3, 6], [4, 6]].forEach(([dx, dy]) => c.px(x + dx, y + dy, 's'));
  });
  c.line(12, y + 3, 19, y + 3, 's');
  // The big beak: stripes of orange, red and yellow.
  const bo = f.beakDown ? 1 : 0;
  c.rect(11, 16 + bo, 10, 3, 'y'); c.rect(9, 19 + bo, 14, 3, 'o'); c.rect(10, 22 + bo, 12, 2, 'o'); c.rect(12, 24 + bo, 8, 1, 'r');
  c.rect(9, 19 + bo, 14, 1, 'r'); c.line(13, 24 + bo, 13, 17 + bo, 'r'); c.line(19, 24 + bo, 19, 17 + bo, 'r'); c.px(16, 20 + bo, 'O'); c.px(16, 22 + bo, 'O'); c.rect(11, 21 + bo, 3, 1, 'O'); c.rect(18, 21 + bo, 3, 1, 'O');
  if (f.mouth === 'open') { c.rect(11, 24 + bo, 10, 1, 'n'); c.rect(12, 25 + bo, 8, 2, 'r'); }
  if (f.mouth === 'smile') { c.px(10, 23 + bo, 'r'); c.px(9, 22 + bo, 'r'); c.px(22, 23 + bo, 'r'); c.px(23, 22 + bo, 'r'); }
  const bk = f.brow;
  if (bk === 'stern') { c.rect(5, 10, 8, 1, 'd'); c.rect(19, 10, 8, 1, 'd'); c.px(12, 11, 'd'); c.px(19, 11, 'd'); }
  if (bk === 'worry') { c.rect(5, 10, 3, 1, 'd'); c.rect(8, 9, 3, 1, 'd'); c.rect(21, 9, 3, 1, 'd'); c.rect(24, 10, 3, 1, 'd'); }
  if (f.sweat) { c.px(27, 12, 'S'); c.px(27, 13, 'S'); c.px(26, 14, 'S'); c.px(27, 14, 'S'); }
  if (f.ink) { c.px(5, 27, 'Q'); c.px(6, 28, 'Q'); c.px(5, 29, 'Q'); }
  return c.outline('k').rows();
}
const PUFFIN_EXPRESSIONS = {
  flustered: { eyes: 'wide', brow: 'worry', mouth: 'open', sweat: true },
  stern: { eyes: 'glare', brow: 'stern', beakDown: true },
  smile: { eyes: 'arc', mouth: 'smile', closed: true },
};
export const PUFFIN_PORTRAIT = makePortrait(PUFFIN_PORTRAIT_PALETTE, puffinFace, { eyes: 'open', ink: true }, PUFFIN_EXPRESSIONS);

// How many tiles wide the big ones stand (see PROP_FOOTPRINTS in props.js).
// Haddock is two tiles wide wherever he stands (put him on the left one: he is
// drawn centred across both), and so are his boat and the stalls.
export const CF_FOOTPRINTS = {
  cf_haddock: 2,
  cf_haddock_back: 2,
  cf_haddock_side: 2,
  cf_haddock_bell: 2,
  cf_haddock_listen: 2,
  cf_haddock_sit: 2,
  cf_haddock_chair: 2,
  cf_haddock_row: 4,
  cf_bother: 4,
  cf_bother_moored: 5,
  cf_orla_forge: 2,
  cf_cockle_stall: 2,
};
