// Small set dressing for the life pass in Chapter 4's three caves: the
// Glimmering, the Stillwater and the Deep. Every piece here is meant to be
// placed as a `walkable` prop (nothing with a body), so none of it can stand
// in a beam, a climb, a push route or a cutscene walk. Same method as
// deepProps.js: each prop is a small grid, its colours folded into
// PROP_PALETTE on characters of their own (a range no other art file uses),
// and the ones that move are also animations (NAME_SPRITES / NAME_PALETTE).

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

const CAVE_PALETTE_EXTRA = {};
const CAVE_PROP_SPRITES = {};
const CAVE_FOOTPRINTS = {};
let nextChar = 0x9400;
function register(name, { palette, rows }, footprint = 1) {
  const map = {};
  for (const [key, color] of Object.entries(palette)) {
    const char = String.fromCharCode(nextChar++);
    map[key] = char;
    CAVE_PALETTE_EXTRA[char] = color;
  }
  CAVE_PROP_SPRITES[name] = rows.map((row) => [...row].map((ch) => map[ch] ?? '.').join(''));
  if (footprint > 1) CAVE_FOOTPRINTS[name] = footprint;
}
function still(name, palette, w, h, draw, footprint = 1) {
  const g = new Grid(w, h);
  draw(g);
  register(name, { palette, rows: g.rows() }, footprint);
  return g.rows();
}
function moving(name, palette, w, h, count, draw, footprint = 1) {
  const list = Array.from({ length: count }, (_, i) => { const g = new Grid(w, h); draw(g, i); return g.rows(); });
  register(name, { palette, rows: list[0] }, footprint);
  return Object.fromEntries(list.map((rows, i) => ['abcdefgh'[i], rows]));
}

const K = '#0a0814';

// ======================= THE GLIMMERING =======================
const STONE = { k: K, s: '#4a3c68', S: '#6a5a90', t: '#2e2446' };
const GEM = { p: '#ff9ad0', P: '#c860a0', c: '#7af0e0', C: '#38b4b0', y: '#ffe48a', Y: '#d0a040', v: '#b89aff', V: '#7a5ad0', w: '#ffffff' };

// A geode cracked in half and left on the floor: a rough grey shell, the
// hollow lined with crystals.
still('gl_geode_half', { ...STONE, ...GEM }, 16, 16, (g) => {
  g.ell(8, 10.5, 7, 4.5, 's').ell(8, 9.5, 6, 3.4, 'S');
  g.ell(8, 9, 4.6, 2.6, 'V').ell(8, 9, 3.6, 1.8, 'v');
  g.px(6, 8, 'c').px(7, 7, 'w').px(9, 8, 'p').px(10, 9, 'c').px(5, 9, 'y').px(8, 10, 'p').px(11, 8, 'v');
  g.line(4, 13, 11, 14, 't');
  g.outline('k');
});

// Crystal shards scattered where something got broken: lying flat, catching light.
still('gl_shards', { ...STONE, ...GEM }, 16, 16, (g) => {
  const bits = [[3, 11, 'c', 'C'], [8, 9, 'p', 'P'], [12, 12, 'v', 'V'], [6, 13, 'y', 'Y'], [10, 14, 'c', 'C'], [2, 14, 'v', 'V']];
  for (const [x, y, a, b] of bits) {
    g.px(x, y, a).px(x + 1, y, a).px(x + 1, y + 1, b).px(x, y + 1, b).px(x - 1, y + 1, b);
    g.px(x, y - 1, 'w');
  }
  g.outline('k');
});

// A glowbug: a round little beetle with a lamp in its back end.
const BUG_PAL = { k: K, b: '#5a4a88', B: '#8a78c0', g: '#d8ff7a', G: '#7aff9a', h: '#ffffd0', l: '#b8a8e0' };
const glowbug = moving('gl_glowbug', BUG_PAL, 16, 16, 2, (g, i) => {
  g.ell(7, 11, 4.6, 3, 'b').ell(7, 10, 3.4, 1.6, 'B').px(4, 10, 'l');
  g.px(3, 12, 'l').px(4, 14, 'l').px(7, 14, 'l').px(10, 14, 'l').px(2, 10, 'l');
  g.ell(12, 11, 2.6, 2.4, i ? 'g' : 'G').ell(12, 11, 1.3, 1.2, 'h');
  if (i) { g.px(12, 8, 'G').px(15, 11, 'G').px(12, 14, 'G'); }
  g.px(2, 11, 'k');
  g.outline('k');
});

// A puddle of still water on the cave floor: a lit crystal in the ceiling shows in it.
const PUDDLE_PAL = { k: K, w: '#2a3a78', W: '#4a62b4', l: '#8ab0ff', h: '#e8f4ff', p: '#d890ff', e: '#18204a' };
const mirrorPuddle = moving('gl_mirror_puddle', PUDDLE_PAL, 16, 16, 3, (g, i) => {
  g.ell(8, 11, 7, 3.6, 'e').ell(8, 11, 6, 2.8, 'w').ell(8, 10.4, 4.4, 1.6, 'W');
  g.px(5 + i, 10, 'l').px(6 + i, 10, 'l').px(10 - i, 11, 'p').px(11 - i, 11, 'p').px(8, 9 + (i === 1 ? 1 : 0), 'h');
  g.px(3, 12, 'l').px(12, 10, 'l');
});

// A thin crystal stalk hung with little crystal bells, which chime in a draught.
const CHIME_PAL = { k: K, s: '#6a5a90', S: '#9a8ac0', c: '#7af0e0', C: '#38b4b0', p: '#ff9ad0', y: '#ffe48a', w: '#ffffff', t: '#2e2446' };
const chimeStalk = moving('gl_chime_stalk', CHIME_PAL, 16, 32, 3, (g, i) => {
  g.rect(7, 4, 3, 25, 's').rect(7, 4, 1, 25, 'S').rect(9, 6, 1, 23, 't');
  g.px(8, 2, 'S').px(8, 3, 'S').px(8, 1, 'w');
  g.rect(4, 27, 9, 3, 't').rect(5, 26, 7, 1, 's');
  // Arms and what hangs from them.
  g.line(7, 9, 3, 7, 's').line(9, 13, 13, 11, 's');
  const sw = [0, 1, 0, -1][i % 4];
  g.line(3, 8, 3 + sw, 12, 'S').rect(2 + sw, 12, 2, 3, 'c').px(2 + sw, 14, 'C').px(3 + sw, 11, 'w');
  g.line(13, 12, 13 - sw, 17, 'S').rect(12 - sw, 17, 2, 3, 'p').px(13 - sw, 19, 'C');
  g.line(8, 20, 8 + sw, 23, 'S').rect(7 + sw, 23, 2, 3, 'y');
  g.outline('k');
});

// A gleamsnail's old shell, long left behind: a cracked spiral, empty.
still('gl_old_shell', { ...STONE, ...GEM, e: '#c8b8e8' }, 16, 16, (g) => {
  g.ell(8, 10, 5.5, 4.6, 'S').ell(8, 10, 4.4, 3.5, 's').ell(8, 10, 3, 2.3, 'S').ell(8, 10, 1.6, 1.2, 's');
  g.px(8, 10, 't').line(12, 7, 13, 11, 'k').px(5, 7, 'c').px(4, 10, 'p').px(11, 12, 'v');
  g.rect(3, 13, 3, 1, 'S').rect(2, 14, 6, 1, 't');
  g.outline('k');
});

// A heap of crystal crumbs somebody swept into a corner and never took away.
still('gl_crumb_heap', { ...STONE, ...GEM }, 16, 16, (g) => {
  g.ell(8, 12, 6.5, 3.4, 't').ell(8, 11, 5.5, 2.6, 's').ell(8, 10, 3.5, 1.6, 'S');
  g.px(5, 10, 'c').px(8, 9, 'p').px(11, 11, 'v').px(7, 11, 'y').px(10, 10, 'w').px(4, 12, 'p');
  g.rect(13, 6, 1, 7, 'Y').px(13, 5, 'y');
  g.outline('k');
});

// A strip of glitter where something sparkly was dragged across the floor: lies flat, twinkles.
const GLITTER_PAL = { k: K, a: '#7af0e0', b: '#ff9ad0', c: '#ffe48a', d: '#b89aff', w: '#ffffff' };
const glitter = moving('gl_glitter', GLITTER_PAL, 16, 16, 3, (g, i) => {
  const spots = [[2, 6, 'a'], [5, 8, 'b'], [8, 7, 'c'], [11, 9, 'd'], [13, 11, 'a'], [4, 11, 'c'], [9, 12, 'b'], [6, 5, 'd'], [12, 6, 'b'], [3, 9, 'd']];
  spots.forEach(([x, y, c], n) => {
    if ((n + i) % 3 === 0) g.px(x, y, 'w').px(x - 1, y, c).px(x + 1, y, c).px(x, y - 1, c).px(x, y + 1, c);
    else g.px(x, y, c);
  });
});

// A scrap of cloth snagged on a crystal spike, so thin you can see the light through it.
still('gl_snagged_ribbon', { ...STONE, ...GEM, r: '#c04a6a', R: '#8a3050' }, 16, 24, (g) => {
  g.rect(7, 12, 3, 11, 'S').rect(7, 12, 1, 11, 'C').px(8, 11, 'c').px(8, 10, 'w').px(8, 9, 'c');
  g.rect(5, 22, 7, 2, 't');
  g.line(9, 11, 13, 14, 'r').line(9, 12, 14, 16, 'r').line(10, 12, 14, 18, 'R').px(14, 19, 'R').px(13, 14, 'R');
  g.outline('k');
});

// A small tin box, shut, tucked behind a boulder: the sort of thing a page would keep his sweets in.
still('gl_sweet_tin', { ...STONE, i: '#7a7a9a', I: '#b0b0d0', j: '#3a3a50', r: '#c04a6a', y: '#ffe48a' }, 16, 16, (g) => {
  g.rect(3, 8, 10, 6, 'i').rect(3, 8, 10, 1, 'I').rect(3, 13, 10, 1, 'j').rect(3, 8, 1, 6, 'I');
  g.rect(3, 10, 10, 1, 'r').px(8, 9, 'y').px(7, 11, 'y').px(9, 11, 'y');
  g.rect(2, 14, 12, 1, 't');
  g.outline('k');
});

// A little cave-spider web strung between two crystals: dew on it, with a drop shining.
const WEB_PAL = { k: K, s: '#6a5a90', S: '#9a8ac0', w: '#e8e4ff', W: '#a8a0d0', d: '#aef4ff', t: '#2e2446' };
const crystalWeb = moving('gl_crystal_web', WEB_PAL, 32, 24, 2, (g, i) => {
  g.rect(2, 8, 3, 15, 'S').rect(2, 8, 1, 15, 'w').px(3, 7, 'w').rect(0, 22, 7, 2, 't');
  g.rect(27, 6, 3, 17, 'S').rect(27, 6, 1, 17, 'w').px(28, 5, 'w').rect(25, 22, 7, 2, 't');
  g.outline('k');
  // The web itself, light and sparse: a few spokes out of the middle, two loose rings, no outline.
  const cx = 15.5; const cy = 12;
  for (const [ex, ey] of [[5, 10], [5, 16], [26, 8], [26, 17], [15, 5], [15, 20]]) g.line(cx, cy, ex, ey, 'W');
  for (const r of [3.4, 7]) {
    for (let k = 0; k < 28; k++) {
      const a = (k / 28) * Math.PI * 2;
      const x = cx + Math.cos(a) * r * 1.7; const y = cy + Math.sin(a) * r * 0.95;
      if (k % 5 !== 3 && y > 5 && y < 20 && x > 5 && x < 26) g.px(x, y, 'w');
    }
  }
  [[10, 11], [18, 9], [21, 15], [12, 16]].forEach(([x, y], n) => g.px(x, y, (n + i) % 2 ? 'd' : 'w'));
});

// ======================= THE STILLWATER =======================
const W_ = { k: '#0a1018', w: '#6a5238', W: '#4a3a2a', l: '#8a7050', D: '#1c140c', n: '#1d3050', N: '#3a5a84', v: '#070d19', a: '#3f6a58', g: '#8a9aa8', G: '#c0ccd8', r: '#a89a70', R: '#6a5e40' };

// A rowing boat, upturned on the shingle: nobody has turned it over in a very long time.
still('sw_old_boat', W_, 32, 16, (g) => {
  g.ell(16, 11, 14.5, 4.6, 'W').ell(16, 10, 14, 3.8, 'w').ell(16, 9, 12.6, 2.6, 'l');
  for (let x = 5; x < 28; x += 4) g.line(x, 7, x - 1, 13, 'W');
  g.rect(3, 13, 26, 1, 'D');
  g.px(24, 9, 'D').px(25, 9, 'D').px(8, 8, 'a').px(9, 8, 'a').px(15, 7, 'a').px(20, 12, 'a');
  g.rect(2, 14, 4, 1, 'G').rect(26, 14, 4, 1, 'g');
  g.outline('k');
}, 2);

// An oar stuck blade-down in the shingle, a loop of old rope on the handle.
still('sw_oar', W_, 16, 24, (g) => {
  g.rect(7, 2, 2, 17, 'w').rect(7, 2, 1, 17, 'l').rect(8, 2, 1, 17, 'W');
  g.rect(5, 17, 6, 5, 'w').rect(5, 17, 1, 5, 'l').rect(10, 17, 1, 5, 'W').rect(6, 21, 4, 1, 'D');
  g.rect(6, 4, 4, 1, 'r').px(5, 5, 'r').px(10, 5, 'R').rect(6, 6, 4, 1, 'R');
  g.rect(3, 22, 10, 2, 'g').rect(4, 22, 3, 1, 'G');
  g.outline('k');
});

// A fishing net hung out to dry between two driftwood posts (the posts are the point).
const netPal = { ...W_, m: '#c8c0a0', M: '#8a8468' };
const dryingNet = moving('sw_drying_net', netPal, 32, 24, 2, (g, i) => {
  g.rect(2, 3, 3, 20, 'w').rect(2, 3, 1, 20, 'l').rect(3, 2, 1, 1, 'l');
  g.rect(27, 3, 3, 20, 'w').rect(27, 3, 1, 20, 'l').rect(28, 2, 1, 1, 'l');
  g.rect(0, 22, 8, 2, 'g').rect(24, 22, 8, 2, 'g');
  g.line(5, 5, 27, 5, 'R');
  for (let x = 6; x < 27; x += 3) {
    const sag = Math.round(Math.sin((x - 6) / 21 * Math.PI) * 3);
    for (let y = 6; y < 14 + sag; y += 2) g.px(x, y, (x + y + i) % 4 === 0 ? 'M' : 'm');
  }
  for (let y = 7; y < 14; y += 3) for (let x = 6; x < 27; x++) if ((x + y) % 2 === 0) g.px(x, y, 'm');
  g.px(14, 15 + i, 'G').px(19, 14, 'G');
  g.outline('k');
});

// A little pale fish skeleton on the shingle, picked clean.
still('sw_fish_bones', W_, 16, 16, (g) => {
  g.line(3, 11, 12, 11, 'G').px(2, 10, 'G').px(2, 12, 'G').px(1, 11, 'g');
  for (let x = 4; x < 11; x += 2) g.line(x, 9, x, 13, 'g');
  g.px(13, 10, 'G').px(14, 11, 'G').px(13, 12, 'G').px(13, 11, 'k');
  g.line(1, 9, 1, 13, 'G');
  g.outline('k');
});

// A paper boat, folded small, afloat. Somebody's.
const paperPal = { k: '#0a1018', p: '#e8e0c8', P: '#b8b090', s: '#8a826a', w: '#1d3050', W: '#3a5a84', l: '#8ac0e8' };
const paperBoat = moving('sw_paper_boat', paperPal, 16, 16, 2, (g, i) => {
  g.ell(8, 12, 6, 1.6, 'w').px(3 + i, 12, 'l').px(11 - i, 13, 'l').px(6, 13, 'W');
  g.rect(4, 9, 8, 3, 'p').rect(4, 11, 8, 1, 'P').px(3, 9, 'p').px(12, 9, 'p');
  g.rect(7, 4, 1, 5, 'p').rect(8, 5, 1, 4, 'p').rect(6, 6, 1, 3, 'P').px(7, 4, 'P');
  g.px(5, 10, 's').px(9, 10, 's');
  g.outline('k');
});

// A half-sunk crate, wet to the lid, a rope trailing off it into the lake.
still('sw_float_crate', { ...W_, f: '#c8d4dc' }, 16, 16, (g) => {
  g.ell(8, 13, 7.5, 2, 'n').px(2, 13, 'N').px(13, 13, 'N');
  g.rect(3, 6, 10, 7, 'w').rect(3, 6, 10, 1, 'l').rect(11, 7, 2, 6, 'W').rect(3, 9, 10, 1, 'W');
  g.px(4, 7, 'D').px(11, 7, 'D').px(4, 11, 'D');
  g.line(13, 7, 15, 10, 'r').px(15, 11, 'R');
  g.rect(3, 12, 10, 1, 'a');
  g.outline('k');
});

// A clump of pale snails clustered on a stone, shells like little wet pearls.
still('sw_pale_snails', { ...W_, e: '#e8eef2', E: '#a8b4c0', q: '#6a7886' }, 16, 16, (g) => {
  g.ell(8, 12, 7, 3, 'q').ell(8, 11, 6, 2.2, 'g');
  for (const [x, y] of [[4, 9], [8, 7], [11, 10], [7, 10]]) { g.ell(x, y, 1.8, 1.6, 'e').px(x, y - 1, 'E').px(x + 1, y, 'E'); g.px(x - 2, y + 1, 'E'); }
  g.outline('k');
});

// A wooden bucket on the jetty, a coil of rope in it, a puddle round its foot.
still('sw_bucket', { ...W_, i: '#5a5a68', I: '#8a8a9a' }, 16, 16, (g) => {
  g.rect(4, 7, 8, 7, 'w').rect(4, 7, 1, 7, 'l').rect(11, 7, 1, 7, 'W').rect(4, 9, 8, 1, 'i').rect(4, 12, 8, 1, 'i');
  g.rect(4, 6, 8, 1, 'W').px(7, 6, 'r').px(8, 5, 'r').px(9, 6, 'R');
  g.line(4, 6, 8, 2, 'I').line(12, 6, 8, 2, 'I');
  g.ell(8, 14.5, 6, 1, 'n');
  g.outline('k');
});

// A smooth, flat skipping stone, set up on a bigger one. Somebody was going to throw it.
still('sw_skip_stone', { ...W_, e: '#e8eef2' }, 16, 16, (g) => {
  g.ell(8, 12, 6.5, 3, 'g').ell(8, 11, 5.5, 2, 'G');
  g.ell(8, 8.5, 3.6, 1.2, 'e').px(5, 8, 'G').px(11, 8, 'g');
  g.outline('k');
});

// A mooring ring set into a stone lip, with a frayed bit of rope still through it.
still('sw_rope_ring', { ...W_, i: '#5a5a68', I: '#8a8a9a' }, 16, 16, (g) => {
  g.ell(8, 12, 7, 3.2, 'g').ell(8, 11, 6, 2.2, 'G');
  g.ell(8, 9, 2.6, 2.6, 'I').ell(8, 9, 1.4, 1.4, 'g').px(8, 9, 'k');
  g.rect(8, 11, 1, 3, 'i').line(9, 10, 12, 13, 'r').px(12, 14, 'R').px(13, 14, 'R');
  g.outline('k');
});

// Fat little white blind-fish eggs in a clutch of jelly on the water's edge.
const eggPal = { k: '#0a1018', j: '#9ac0b0', J: '#6a9888', e: '#f0fff8', d: '#4a6a60', w: '#1d3050' };
const fishEggs = moving('sw_fish_eggs', eggPal, 16, 16, 2, (g, i) => {
  g.ell(8, 12, 6.5, 2.4, 'J').ell(8, 11.5, 5.5, 1.8, 'j');
  for (const [x, y] of [[4, 11], [7, 10], [10, 11], [6, 12], [12, 12], [9, 12]]) g.px(x, y, 'e').px(x + 1, y, 'e').px(x, y + 1, 'd');
  g.px(6 + i * 3, 11, 'k');
  g.outline('k');
});

// ======================= THE DEEP =======================
const DK = { k: '#05040a', a: '#1c1926', b: '#2d2a3c', c: '#44405a', d: '#6a668a', e: '#9a96b6', t: '#0e0c14' };
const BONE = { p: '#c9c3a8', q: '#8e8a74', r: '#5a564a' };
const CLOTH = { m: '#5a6a78', M: '#3a4654', n: '#8a9aa8' };

// The Hero's ration tin: dented and tiny, a child's palm wide, still shut. Spoon through the lid.
still('dp_ration_tin', { ...DK, ...BONE, i: '#6a6a7a', I: '#9a9aaa', j: '#35353f', o: '#8a5a30' }, 16, 16, (g) => {
  g.rect(4, 9, 8, 5, 'i').rect(4, 9, 8, 1, 'I').rect(4, 13, 8, 1, 'j').rect(4, 9, 1, 5, 'I');
  g.rect(4, 11, 8, 1, 'j').px(9, 10, 'j');
  g.line(10, 9, 13, 5, 'o').px(13, 4, 'p');
  g.rect(3, 14, 10, 1, 't');
  g.outline('k');
});

// A mitten with a patch on the thumb, a child's, put down on a rock to dry and never picked up.
still('dp_mitten', { ...DK, ...CLOTH, y: '#b89a4a', Y: '#7a622a' }, 16, 16, (g) => {
  g.ell(8, 13, 7, 2, 'b').ell(8, 12.5, 6, 1.3, 'c');
  g.ell(8, 9.5, 3.8, 3.6, 'm').rect(4, 10, 8, 3, 'm').ell(5, 8.5, 1.5, 2, 'm');
  g.rect(5, 12, 7, 1, 'M').rect(9, 8, 2, 2, 'y').px(9, 8, 'Y').px(10, 9, 'Y').rect(5, 11, 7, 1, 'n');
  g.outline('k');
});

// A stub of candle in a thumb of its own wax, black from being lit and lit.
const candlePal = { ...DK, w: '#d8d0b0', W: '#a8a088', f: '#ffcf6a', F: '#fff0b0', s: '#2a2630' };
const candleStub = moving('dp_candle_stub', candlePal, 16, 16, 2, (g, i) => {
  g.ell(8, 13, 4.5, 1.6, 'W').rect(6, 9, 4, 4, 'w').rect(6, 9, 1, 4, 'W').px(9, 12, 'W');
  g.px(8, 8, 's');
  g.rect(7, 5 - (i ? 1 : 0), 2, 3 + (i ? 1 : 0), 'f').px(8, 6 - (i ? 1 : 0), 'F').px(8, 4 - (i ? 1 : 0), 'f');
  g.outline('k');
});

// A slate, propped in a crack: three small chalk drawings of a sun, one under the other, each a bit more pleased with itself.
still('dp_chalk_slate', { ...DK, ...BONE, s: '#3a4048', S: '#59606a', h: '#e8e4d0', H: '#a8a490', w: '#5a4a38', W: '#8a7050' }, 16, 24, (g) => {
  g.rect(2, 4, 12, 17, 'w').rect(2, 4, 12, 1, 'W').rect(2, 4, 1, 17, 'W');
  g.rect(3, 5, 10, 15, 's').rect(3, 5, 10, 1, 'S').rect(3, 5, 1, 15, 'S');
  g.px(7, 8, 'h').px(8, 8, 'h').px(7, 9, 'h').px(8, 9, 'h').px(5, 8, 'H').px(10, 8, 'H').px(6, 6, 'H').px(9, 6, 'H');
  g.px(7, 12, 'h').px(8, 12, 'h').px(7, 13, 'h').px(8, 13, 'h').px(5, 12, 'H').px(10, 12, 'H').px(7, 10, 'H').px(8, 14, 'H');
  g.px(7, 16, 'h').px(8, 16, 'h').px(7, 17, 'h').px(8, 17, 'h').px(5, 16, 'H').px(10, 16, 'H').px(6, 15, 'H').px(9, 15, 'H').px(6, 18, 'H').px(9, 18, 'H');
  g.line(3, 21, 12, 22, 'b').rect(1, 21, 14, 2, 'b').rect(2, 21, 3, 1, 'c');
  g.outline('k');
});

// Pale cave mushrooms with no colour in them at all, leaning towards nothing in particular.
const paleCap = moving('dp_pale_caps', { ...DK, e: '#d8d8e8', f: '#a8a8c0', g: '#7a7a98', s: '#c8c8d8', l: '#fffff8' }, 16, 16, 2, (g, i) => {
  g.ell(5, 11, 3, 1.2, 'f').rect(5, 11, 1, 3, 's').ell(5 + i, 10, 2.8, 1.6, 'e').px(4 + i, 9, 'l');
  g.ell(11, 12, 2.6, 1, 'f').rect(11, 12, 1, 2, 's').ell(11 - i, 11, 2.4, 1.4, 'e').px(11 - i, 10, 'l');
  g.ell(8, 13, 7, 1, 'a');
  g.outline('k');
});

// A heap of pale roots come down through the roof, ending in a little tuft: still, but
// for the one thread that moves.
const rootHang = moving('dp_root_tuft', { ...DK, e: '#c8c8dc', f: '#8a88a8', g: '#5a5878' }, 16, 24, 2, (g, i) => {
  g.rect(7, 12, 2, 10, 'g').px(8, 14, 'f').px(7, 18, 'f');
  g.line(8, 22, 4, 23, 'g').line(8, 22, 12, 23, 'g');
  g.line(8, 12, 5 - i, 17, 'f').px(5 - i, 18, 'e').line(8, 12, 11 + i, 16, 'f').px(11 + i, 17, 'e');
  g.rect(3, 22, 10, 2, 'a').outline('k');
});

// A scatter of tiny bright specks on the black floor, like stars laid out for nobody. Lies flat.
const starPal = { k: '#05040a', a: '#cfd8ff', b: '#7a8ac8', c: '#4a5488' };
const floorStars = moving('dp_floor_stars', starPal, 16, 16, 3, (g, i) => {
  const spots = [[3, 5], [10, 3], [6, 9], [13, 8], [4, 13], [9, 12], [14, 14]];
  spots.forEach(([x, y], n) => g.px(x, y, (n + i) % 3 === 0 ? 'a' : (n + i) % 3 === 1 ? 'b' : 'c'));
});

// A pale lump of old candle-ends and ash, kicked together in a corner as if tidied by a child.
still('dp_ash_heap', { ...DK, ...BONE, g: '#3a3846', h: '#5a5868', w: '#c9c3a8' }, 16, 16, (g) => {
  g.ell(8, 12.5, 6.5, 2.6, 'g').ell(8, 12, 5.5, 1.9, 'h').ell(8, 11, 3.5, 1.2, 'g');
  g.px(5, 11, 'w').px(10, 11, 'w').px(7, 10, 'w').px(11, 12, 'q');
  g.outline('k');
});

// A thin tiny sword-shaped scratch... no: a child's pocket knife, wedged in the crack of a rock,
// handle out: it has held a stone shut for longer than anyone has been counting.
still('dp_pocket_knife', { ...DK, ...CLOTH, i: '#6a6a7a', I: '#b0b0c0', w: '#6a4a30', W: '#9a7a50' }, 16, 16, (g) => {
  g.ell(8, 12, 7, 3, 'b').ell(8, 11, 6, 2, 'c');
  g.rect(3, 8, 6, 2, 'w').rect(3, 8, 6, 1, 'W').px(9, 8, 'I').px(10, 8, 'I').px(11, 9, 'i').line(9, 9, 13, 9, 'I');
  g.px(3, 9, 'k');
  g.outline('k');
});

// A pinecone, bobbing in the reeds, a long way from any pine.
const conePal = { k: '#0a1018', c: '#8a5a30', C: '#5a3a1c', l: '#b88a50', w: '#1d3050', W: '#3a5a84', f: '#8ac0e8' };
const pinecone = moving('sw_pinecone', conePal, 16, 16, 2, (g, i) => {
  g.ell(8, 12.5, 6, 1.4, 'w').px(3 + i, 12, 'f').px(12 - i, 13, 'f').px(8, 13, 'W');
  const y = 7 + i;
  g.ell(8, y + 2.5, 2.6, 3.6, 'c');
  for (let r = 0; r < 4; r++) { g.px(6, y + r * 2, 'C').px(9, y + r * 2 + 1, 'C').px(7, y + r * 2, 'l'); }
  g.px(8, y - 1, 'C').px(8, y - 2, 'C');
  g.outline('k');
});

// A heap of sleeping glow-worms, curled together on the floor, each breathing a slow pale light.
const wormPal = { ...DK, g: '#7ae8c0', G: '#c8fff0', h: '#2f8a78', w: '#e8fffa' };
const wormPile = moving('dp_worm_pile', wormPal, 16, 16, 3, (g, i) => {
  g.ell(8, 12.5, 6.5, 2.4, 'a');
  const bits = [[4, 11], [7, 10], [10, 11], [6, 12], [9, 12], [12, 12], [5, 13]];
  bits.forEach(([x, y], n) => {
    const lit = (n + i) % 3 === 0;
    g.rect(x - 1, y, 3, 1, lit ? 'G' : 'g').px(x - 1, y + 1, 'h').px(x + 1, y + 1, 'h');
    if (lit) g.px(x, y - 1, 'w');
  });
  g.outline('k');
});

// A tiny blue crystal bud pushing up through the black floor, pulsing, a long way from any other.
const budPal = { ...DK, b: '#2a74ac', c: '#52a8dc', d: '#8ad4f8', e: '#e8fbff' };
const crystalBud = moving('dp_crystal_bud', budPal, 16, 16, 2, (g, i) => {
  g.ell(8, 13, 5, 1.6, 'b');
  g.rect(7, 6, 3, 8, 'c').rect(7, 6, 1, 8, 'd').px(8, 5, 'd').px(8, 4, 'e');
  g.rect(4, 9, 2, 5, 'b').px(4, 8, 'c').rect(11, 10, 2, 4, 'b').px(11, 9, 'c');
  if (i) g.px(8, 3, 'e').px(7, 4, 'd').px(9, 4, 'd');
  g.outline('k');
});

// ======================= Exports =======================
export { CAVE_PALETTE_EXTRA, CAVE_PROP_SPRITES, CAVE_FOOTPRINTS };

export const GL_GLOWBUG_PALETTE = BUG_PAL;
export const GL_GLOWBUG_SPRITES = glowbug;
export const GL_MIRROR_PUDDLE_PALETTE = PUDDLE_PAL;
export const GL_MIRROR_PUDDLE_SPRITES = mirrorPuddle;
export const GL_CHIME_STALK_PALETTE = CHIME_PAL;
export const GL_CHIME_STALK_SPRITES = chimeStalk;
export const GL_GLITTER_PALETTE = GLITTER_PAL;
export const GL_GLITTER_SPRITES = glitter;
export const GL_CRYSTAL_WEB_PALETTE = WEB_PAL;
export const GL_CRYSTAL_WEB_SPRITES = crystalWeb;
export const SW_DRYING_NET_PALETTE = netPal;
export const SW_DRYING_NET_SPRITES = dryingNet;
export const SW_PAPER_BOAT_PALETTE = paperPal;
export const SW_PAPER_BOAT_SPRITES = paperBoat;
export const SW_FISH_EGGS_PALETTE = eggPal;
export const SW_FISH_EGGS_SPRITES = fishEggs;
export const DP_CANDLE_STUB_PALETTE = candlePal;
export const DP_CANDLE_STUB_SPRITES = candleStub;
export const DP_PALE_CAPS_PALETTE = { ...DK, e: '#d8d8e8', f: '#a8a8c0', g: '#7a7a98', s: '#c8c8d8', l: '#fffff8' };
export const DP_PALE_CAPS_SPRITES = paleCap;
export const DP_ROOT_TUFT_PALETTE = { ...DK, e: '#c8c8dc', f: '#8a88a8', g: '#5a5878' };
export const DP_ROOT_TUFT_SPRITES = rootHang;
export const DP_FLOOR_STARS_PALETTE = starPal;
export const DP_FLOOR_STARS_SPRITES = floorStars;
export const SW_PINECONE_PALETTE = conePal;
export const SW_PINECONE_SPRITES = pinecone;
export const DP_WORM_PILE_PALETTE = wormPal;
export const DP_WORM_PILE_SPRITES = wormPile;
export const DP_CRYSTAL_BUD_PALETTE = budPal;
export const DP_CRYSTAL_BUD_SPRITES = crystalBud;
