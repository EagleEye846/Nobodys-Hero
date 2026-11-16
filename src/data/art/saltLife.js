// Little lives for Saltcombe and Gullrest (the life pass, chapter 5): townsfolk going about
// their day, cats, boats at their moorings, chalk boards, drying racks, an awning to walk
// under, and for the beach a ball, crabs in a bucket, a sandcastle, rockpools with things
// in them, washed-up junk. Drawn like saltcombeProps.js: rows from the small painter
// below, 16 pixels to a tile, standing on the bottom edge and centred over their
// footprint. Every id starts `st_`. Ones that move are also animations (put the name in the
// prop's `animation`, with a `speed`).
//
// Folk (16 wide, 22 tall; the stroll walks them about, flipping them to face the way)
//   st_folk_a..d       four townsfolk standing about, each in their own coat (2 frames)
//   st_sweeper         someone with a broom, sweeping (2 frames)
//   st_mender          someone on a crate with a net across their lap, mending (2 wide, 2 frames)
//   st_cat_walk(_b)    a grey cat and a black cat, walking (2 frames)
//   st_cat_sit         a tabby on a crate, tail going (2 frames)
//   st_cat_loaf(_b)    a ginger cat and a tabby loafed up asleep (2 frames)
// Harbour dressing
//   st_price_board     an A-frame chalkboard with the day's prices
//   st_fish_rack       a drying rack hung with fish (2 wide)
//   st_rain_barrel     a barrel under a downspout, the water shivering (2 frames)
//   st_flower_tub      a half-barrel of sea thrift;  st_boot_planter  an old boot with daisies in it
//   st_broom_bucket    a bucket with a broom standing in it
//   st_hopscotch       chalk squares on the planks (flat)
//   st_dinghy_a / _b   little boats on their moorings, bobbing (2 wide, 2 frames each)
//   st_boat_trestle    a boat up on trestles, half-planked, a paint pot (2 wide)
//   st_awning          a striped stall awning on two posts: walk through the middle (2 wide)
//   st_tiny_door       a mouse-sized door painted at the foot of a wall
//   st_tin_box         a biscuit tin tucked in a nook
// The beach
//   st_beach_ball      a striped ball (a stroll `ball: true` rolls it)
//   st_crab_bucket     a kid's tin bucket with crabs in it (2 frames)
//   st_sandcastle      a sandcastle with a flag;  st_bucket_spade  a bucket and a spade
//   st_towel_a/_b      striped towels (flat, 2 wide)
//   st_pool_life       a rockpool with a starfish and an anemone in it (flat, 2 frames)
//   st_shells          a scatter of shells (flat);  st_starfish  one starfish (flat)
//   st_old_boot  st_tin_can  st_glass_float  st_message_bottle   things the tide left
//   st_whale_rib       two great bleached ribs standing up out of the sand (2 wide)
//   st_sleeper_chair   a deckchair with someone asleep under a hat (2 frames)
//   st_beach_umbrella  a striped umbrella planted in the sand
//   st_driftwood_face  a standing driftwood root with a knot-hole face

const OUT = '#1a1410';

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xe900 + colors.size);
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

  line(x0, y0, x1, y1, c) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) this.set(x0 + ((x1 - x0) * i) / steps, y0 + ((y1 - y0) * i) / steps, c);
  }

  oval(cx, cy, rx, ry, c) {
    for (let dy = -ry; dy <= ry; dy++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.25))));
      this.rect(cx - w, cy + dy, w * 2 + 1, 1, c);
    }
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

const WOOD = ['#3a2818', '#5c4028', '#7e5a38', '#a07a4e'];
const ROPE = ['#7a6038', '#a88a58', '#cdb07a'];
const IRON = ['#1e2224', '#3a4246', '#5e686c'];
const PAPER = ['#a89878', '#d8c8a0', '#f0e4c4'];
const SLATE = ['#1e2a2c', '#2e3e40', '#44585a'];
const CHALK = '#e8ecdc';
const SAND = ['#a8946a', '#c8b488', '#e0d0a4'];
const SEAW = ['#2a6a7a', '#3e8a98', '#7ac0c8', '#cdeef0'];
const CANVAS = ['#c8c0a8', '#e8e0c8'];

// A post (`w` wide) from y0 to y1, dark on the left.
function post(g, x, y0, y1, w = 2) {
  g.rect(x, y0, w, y1 - y0 + 1, WOOD[1]);
  g.rect(x, y0, 1, y1 - y0 + 1, WOOD[0]);
  g.rect(x + w - 1, y0, 1, 1, WOOD[3]);
}

// --- Folk ---------------------------------------------------------------
// o: { fur, furDark, coat, coatDark, trousers, hat, hatBand, kind: 'seal'|'otter'|'gull'|'hare', item, frame }
function folk(o) {
  const g = new Grid(16, 22);
  const f = o.frame ?? 0;
  const lift = f ? 0 : 1; // breathing: the shoulders rise
  // Legs and boots.
  g.rect(5, 17, 2, 4, o.trousers);
  g.rect(9, 17, 2, 4, o.trousers);
  g.rect(4, 20, 3, 2, WOOD[0]);
  g.rect(9, 20, 3, 2, WOOD[0]);
  // Coat, with a belt and a collar.
  g.rect(4, 10 + lift, 8, 7 - lift, o.coat);
  g.rect(4, 10 + lift, 8, 1, o.coatDark);
  g.rect(4, 15, 8, 1, o.coatDark);
  g.rect(7, 12, 1, 3, o.coatDark);
  // Arms.
  g.rect(2, 11 + lift, 2, 5, o.coat);
  g.rect(12, 11 + lift, 2, 5, o.coat);
  g.rect(2, 16, 2, 1, o.fur);
  g.rect(12, 16, 2, 1, o.fur);
  // Head.
  g.oval(8, 6 + lift, 3, 3, o.fur);
  g.rect(5, 8 + lift, 7, 1, o.furDark);
  g.set(6, 6 + lift, OUT); g.set(10, 6 + lift, OUT);
  g.set(8, 7 + lift, o.furDark);
  if (o.kind === 'seal' || o.kind === 'otter') {
    g.set(5, 4 + lift, o.furDark); g.set(11, 4 + lift, o.furDark);
    // Whiskers.
    g.set(4, 8 + lift, o.furDark); g.set(12, 8 + lift, o.furDark);
  }
  if (o.kind === 'hare') { g.rect(6, 0 + lift, 1, 3, o.fur); g.rect(10, 0 + lift, 1, 3, o.fur); }
  // Hat.
  if (o.hat) {
    g.rect(4, 3 + lift, 9, 1, o.hat);
    g.rect(5, 1 + lift, 7, 2, o.hat);
    g.rect(5, 2 + lift, 7, 1, o.hatBand ?? o.hat);
  }
  g.outline(OUT);
  return g;
}

const FOLK = {
  a: { kind: 'seal', fur: '#8c97a2', furDark: '#5e6a76', coat: '#3a5a78', coatDark: '#264058', trousers: '#46463e', hat: '#e0b030', hatBand: '#b88a20' },
  b: { kind: 'otter', fur: '#8a6440', furDark: '#5a4028', coat: '#a8483c', coatDark: '#7a2e28', trousers: '#2e3a42' },
  c: { kind: 'seal', fur: '#b8b4a8', furDark: '#7a766a', coat: '#4a7a58', coatDark: '#325a40', trousers: '#4a3a2e', hat: '#2e3a42' },
  d: { kind: 'hare', fur: '#d8d0c0', furDark: '#9a9284', coat: '#c89a3a', coatDark: '#8e6a22', trousers: '#34404a' },
};

function folkFrame(key, frame) {
  return folk({ ...FOLK[key], frame }).rows();
}

// Someone sweeping: the broom handle in the right hand, the bristles brushing the planks.
function sweeper(frame) {
  const g = folk({ ...FOLK.c, coat: '#8a5a6a', coatDark: '#603a48', hat: null, frame: 0 });
  const sway = frame ? 2 : 0;
  g.line(13, 15, 14 + sway, 4, WOOD[2]);
  g.line(14, 15, 15 + sway, 4, WOOD[1]);
  g.rect(11 + sway, 18, 5, 3, ROPE[1]);
  g.rect(11 + sway, 18, 5, 1, ROPE[2]);
  g.set(12 + sway, 20, ROPE[0]); g.set(14 + sway, 20, ROPE[0]);
  g.outline(OUT);
  return g.rows();
}

// Someone mending a net on an upturned crate: 32 wide, so the net can spill off the lap onto the planks.
function mender(frame) {
  const g = new Grid(32, 22);
  // The crate.
  g.rect(6, 15, 11, 7, WOOD[2]);
  g.rect(6, 15, 11, 1, WOOD[3]);
  g.rect(6, 19, 11, 1, WOOD[1]);
  g.rect(6, 21, 11, 1, WOOD[0]);
  // The person, sitting: a coat, a head bent, legs folded.
  g.rect(8, 8, 8, 8, '#4a6a88');
  g.rect(8, 8, 8, 1, '#304c66');
  g.oval(12, 5, 3, 3, '#8c97a2');
  g.rect(9, 2, 7, 1, '#2e3a42'); g.rect(10, 1, 5, 1, '#2e3a42');
  g.set(11, 6, OUT); g.set(14, 6, OUT);
  g.set(8, 4, '#5e6a76'); g.set(16, 4, '#5e6a76');
  g.rect(15, 16, 2, 6, '#46463e');
  g.rect(14, 21, 4, 1, WOOD[0]);
  // The net across the lap and down to the planks, in diamonds.
  const NET = '#b8a070';
  for (let y = 12; y < 22; y++) for (let x = 14; x < 30; x++) {
    if (x > 19 + (y - 12) * 1.2 + 6) continue;
    if ((x + y) % 3 === 0) g.set(x, y, NET);
    else if ((x - y) % 4 === 0) g.set(x, y, '#8a7650');
  }
  // The hand with the needle, up and down.
  const hy = frame ? 11 : 13;
  g.rect(16, hy, 3, 2, '#8c97a2');
  g.line(18, hy, 20, hy + 3, '#d8dcdc');
  g.set(20, hy + 3, '#ffffff');
  g.outline(OUT);
  return g.rows();
}

// Cats: body, head with ears, tail. f is the frame.
function cat(furs, frame, pose) {
  const [A, B, C, EYE] = furs;
  const g = new Grid(16, 12);
  if (pose === 'walk') {
    const s = frame ? 1 : 0;
    g.rect(3, 5, 9, 4, A);
    g.rect(3, 5, 9, 1, C);
    g.rect(4 + s, 9, 1, 2, B); g.rect(7 - s, 9, 1, 2, B); g.rect(9 + s, 9, 1, 2, B); g.rect(11 - s, 9, 1, 2, B);
    g.rect(11, 3, 4, 4, A);
    g.set(11, 2, A); g.set(14, 2, A);
    g.set(13, 4, EYE); g.set(14, 5, B);
    g.line(3, 6, 0, 3 + s, A);
    g.line(3, 7, 0, 4 + s, B);
  } else if (pose === 'loaf') {
    const b = frame ? 1 : 0;
    g.oval(8, 8, 6, 3 - 0, A);
    g.rect(2, 8, 12, 2, A);
    g.rect(2, 8 - b, 12, 1, C);
    g.oval(12, 6, 2, 2, A);
    g.set(11, 3, A); g.set(13, 3, A);
    g.set(11, 6, B); g.set(13, 6, B);
    g.rect(2, 10, 12, 1, B);
    g.line(2, 9, 0, 8, B);
  } else {
    // Sitting up, tail curling about.
    g.rect(5, 4, 6, 6, A);
    g.rect(5, 4, 6, 1, C);
    g.rect(5, 10, 2, 1, B); g.rect(9, 10, 2, 1, B);
    g.oval(8, 3, 3, 2, A);
    g.set(5, 0, A); g.set(11, 0, A); g.set(5, 1, B); g.set(11, 1, B);
    g.set(7, 3, EYE); g.set(9, 3, EYE);
    g.set(8, 4, B);
    const t = frame ? 2 : 0;
    g.line(11, 9, 14, 8 - t, A);
    g.line(11, 10, 14, 9 - t, B);
  }
  g.outline(OUT);
  return g;
}
const TABBY = ['#8a8a96', '#55555f', '#b8b8c2', '#e8d050'];
const BLACK = ['#34343c', '#1e1e24', '#4e4e58', '#d8e060'];
const GINGER = ['#d88a3a', '#a85e22', '#f0b068', '#78c060'];

// A crate with a tabby sitting on it (16 wide, 26 tall).
function catCrate(frame) {
  const g = new Grid(16, 26);
  const c = cat(TABBY, frame, 'sit');
  for (let y = 0; y < 12; y++) for (let x = 0; x < 16; x++) {
    const v = c.get(x, y);
    if (v) g.set(x, y + 3, v);
  }
  g.rect(1, 14, 14, 11, WOOD[2]);
  g.rect(1, 14, 14, 1, WOOD[3]);
  g.rect(1, 19, 14, 1, WOOD[1]);
  g.rect(1, 24, 14, 1, WOOD[0]);
  g.rect(3, 14, 1, 11, WOOD[1]); g.rect(12, 14, 1, 11, WOOD[1]);
  g.rect(1, 25, 14, 1, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

// --- Harbour dressing ----------------------------------------------------
function priceBoard() {
  const g = new Grid(16, 22);
  g.line(2, 21, 7, 2, WOOD[1]); g.line(14, 21, 9, 2, WOOD[1]);
  g.line(3, 21, 8, 2, WOOD[0]); g.line(13, 21, 8, 2, WOOD[0]);
  g.rect(3, 6, 10, 10, WOOD[2]);
  g.rect(4, 7, 8, 8, SLATE[1]);
  g.rect(4, 7, 8, 1, SLATE[2]);
  // Chalk: a fish, a price, a crossed-out price.
  g.rect(5, 8, 4, 1, CHALK); g.set(9, 8, CHALK); g.set(10, 9, CHALK);
  g.rect(5, 10, 3, 1, CHALK); g.rect(9, 10, 2, 1, CHALK);
  g.rect(5, 12, 5, 1, '#c8c8b0'); g.rect(5, 12, 5, 1, '#a8a890');
  g.line(5, 11, 10, 13, '#e0805a');
  g.rect(5, 14, 3, 1, CHALK);
  g.rect(3, 16, 10, 1, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

function fishRack() {
  const g = new Grid(32, 28);
  post(g, 2, 6, 27); post(g, 28, 6, 27);
  g.rect(2, 5, 28, 2, WOOD[2]);
  g.rect(2, 5, 28, 1, WOOD[3]);
  g.rect(8, 22, 16, 5, WOOD[1]);
  // Fish hung by the tail on short strings, heads down, silver and a bit mean-looking.
  const fish = [[7, 11], [11, 9], [15, 12], [19, 10], [23, 11]];
  for (const [x, len] of fish) {
    g.line(x, 7, x, 8, ROPE[1]);
    g.rect(x - 1, 8, 3, len, '#a8b4b8');
    g.rect(x - 1, 8, 1, len, '#7a888e');
    g.rect(x, 8, 1, len - 2, '#d8e2e4');
    g.set(x, 8 + len - 1, '#5a666c');
    g.set(x - 1, 8 + len, '#7a888e'); g.set(x + 1, 8 + len, '#7a888e');
    g.set(x, 8 + len - 3, OUT);
  }
  g.outline(OUT);
  return g.rows();
}

function rainBarrel(frame) {
  const g = new Grid(16, 22);
  g.rect(2, 6, 12, 15, WOOD[2]);
  g.oval(8, 6, 6, 2, WOOD[1]);
  g.oval(8, 6, 5, 1, '#3a6a78');
  g.rect(4 + (frame ? 3 : 0), 6, 3, 1, '#9ad0d8');
  g.set(9 + (frame ? -3 : 0), 5, '#cdeef0');
  g.rect(2, 9, 12, 1, IRON[1]); g.rect(2, 17, 12, 1, IRON[1]);
  g.rect(2, 7, 1, 14, WOOD[1]); g.rect(7, 8, 1, 13, WOOD[1]); g.rect(13, 7, 1, 14, WOOD[3]);
  // A downspout from the roof, dripping.
  g.rect(14, 0, 2, 7, IRON[1]);
  g.set(14, frame ? 7 : 8, '#9ad0d8');
  g.outline(OUT);
  return g.rows();
}

const THRIFT = ['#e89ab0', '#f6c4d0', '#3e6a3a', '#5e8a4a'];
function flowerTub() {
  const g = new Grid(16, 18);
  g.rect(2, 9, 12, 8, WOOD[2]);
  g.rect(2, 9, 12, 1, WOOD[3]);
  g.rect(2, 12, 12, 1, IRON[1]); g.rect(2, 15, 12, 1, IRON[1]);
  g.rect(7, 10, 1, 7, WOOD[1]);
  g.rect(3, 6, 10, 4, THRIFT[2]);
  for (const [x, y] of [[4, 4], [7, 3], [10, 4], [6, 6], [11, 6], [3, 6]]) {
    g.rect(x, y, 2, 2, THRIFT[0]);
    g.set(x, y, THRIFT[1]);
    g.set(x + 1, y + 2, THRIFT[3]);
  }
  g.outline(OUT);
  return g.rows();
}

function bootPlanter() {
  const g = new Grid(16, 16);
  // A rubber boot on its side-ish, upright, with daisies out of the top.
  g.rect(4, 7, 5, 8, '#6a4a2a');
  g.rect(4, 12, 10, 3, '#6a4a2a');
  g.rect(4, 7, 5, 1, '#8a6a3a');
  g.rect(4, 14, 10, 1, '#3a2818');
  g.rect(5, 8, 1, 4, '#8a6a3a');
  g.rect(3, 3, 7, 4, '#3e6a3a');
  for (const [x, y] of [[3, 2], [6, 1], [9, 3], [5, 4]]) {
    g.rect(x, y, 2, 2, '#f4f0e0');
    g.set(x, y, '#f0c840');
  }
  g.outline(OUT);
  return g.rows();
}

function broomBucket() {
  const g = new Grid(16, 24);
  g.line(8, 0, 8, 12, WOOD[2]);
  g.line(9, 0, 9, 12, WOOD[1]);
  g.rect(6, 10, 5, 4, ROPE[1]);
  g.rect(3, 13, 10, 9, IRON[2]);
  g.rect(3, 13, 10, 1, '#8a949a');
  g.rect(3, 17, 10, 1, IRON[1]);
  g.rect(4, 21, 8, 1, IRON[0]);
  g.rect(4, 14, 8, 1, '#3a6a78');
  g.outline(OUT);
  return g.rows();
}

function hopscotch() {
  const g = new Grid(16, 48);
  const C = '#c8ccc0';
  const sq = (x, y, w) => {
    g.rect(x, y, w, 1, C); g.rect(x, y + 7, w, 1, C);
    g.rect(x, y, 1, 8, C); g.rect(x + w - 1, y, 1, 8, C);
  };
  sq(4, 40, 8); sq(4, 32, 8); sq(0, 24, 8); sq(8, 24, 8); sq(4, 16, 8); sq(4, 8, 8);
  // The numbers, near enough: a dot or two.
  for (const [x, y] of [[7, 43], [7, 35], [3, 27], [11, 27], [7, 19], [7, 11]]) g.set(x, y, C);
  g.set(5, 1, C); g.set(8, 0, C); g.set(11, 1, C); g.rect(5, 2, 7, 1, C);
  return g.rows();
}

// A little boat at a mooring, bobbing: hull, a thwart, a rope up to a post.
function dinghy(frame, facing, trim) {
  const g = new Grid(32, 22);
  const dy = frame ? 1 : 0;
  const hull = trim ? ['#2a5a6a', '#3e7a88'] : ['#8a3a2e', '#b45a42'];
  const x0 = facing > 0 ? 2 : 6;
  g.line(x0, 11 + dy, x0 + 4, 16 + dy, hull[0]);
  g.rect(x0 + 4, 14 + dy, 18, 3, hull[0]);
  g.rect(x0 + 2, 11 + dy, 22, 3, hull[1]);
  g.rect(x0 + 2, 11 + dy, 22, 1, '#e8dcc0');
  g.line(x0 + 24, 11 + dy, x0 + 21, 16 + dy, hull[0]);
  g.rect(x0 + 5, 17 + dy, 16, 1, hull[0]);
  // A thwart and an oar shipped.
  g.rect(x0 + 8, 10 + dy, 2, 2, WOOD[2]);
  g.rect(x0 + 14, 10 + dy, 2, 2, WOOD[2]);
  g.line(x0 + 3, 9 + dy, x0 + 20, 11 + dy, WOOD[3]);
  // The water round it.
  const W = SEAW;
  g.rect(x0, 18 + dy, 26, 1, W[1]);
  g.rect(x0 + (frame ? 2 : 0), 19 + dy, 8, 1, W[2]);
  g.rect(x0 + 14 - (frame ? 2 : 0), 19 + dy, 8, 1, W[2]);
  g.set(x0 + 3, 18 + dy, W[3]); g.set(x0 + 18, 18 + dy, W[3]);
  // The painter running to a post at the far end.
  const px = facing > 0 ? 29 : 2;
  post(g, px, 4, 19, 2);
  g.set(px, 3, WOOD[3]);
  g.line(px, 7, facing > 0 ? x0 + 24 : x0 + 2, 11 + dy, ROPE[1]);
  g.outline(OUT);
  return g.rows();
}

function boatTrestle() {
  const g = new Grid(32, 28);
  post(g, 3, 17, 27, 2); post(g, 27, 17, 27, 2);
  g.rect(2, 26, 5, 2, WOOD[0]); g.rect(26, 26, 5, 2, WOOD[0]);
  // The hull, upside-up on its trestles, planked part-way: bare ribs at the stern.
  g.rect(2, 12, 28, 5, '#3a5a64');
  g.rect(2, 12, 28, 1, '#5a8a94');
  g.rect(2, 16, 28, 1, '#26404a');
  g.line(2, 12, 6, 17, '#26404a'); g.line(29, 12, 25, 17, '#26404a');
  g.rect(2, 8, 28, 4, '#c8503a');
  g.rect(2, 8, 28, 1, '#e88a6a');
  g.rect(2, 11, 28, 1, '#7a2e22');
  for (let x = 20; x < 30; x += 2) g.rect(x, 12, 1, 5, WOOD[3]);
  g.rect(20, 12, 10, 1, WOOD[1]);
  // A paint pot with a brush across it, and a plank leaning.
  g.rect(11, 22, 4, 4, IRON[2]); g.rect(11, 22, 4, 1, '#c8503a');
  g.line(10, 21, 16, 20, WOOD[3]);
  g.line(9, 25, 9, 14, WOOD[2]); g.line(10, 25, 10, 14, WOOD[1]);
  g.outline(OUT);
  return g.rows();
}

// A striped awning on two posts. The middle is open so you can walk through it.
function awning() {
  const g = new Grid(32, 48);
  post(g, 1, 14, 47, 3); post(g, 28, 14, 47, 3);
  g.rect(1, 13, 30, 1, WOOD[0]);
  // The canvas, sloping up to the wall, in stripes; a scalloped valance along the front.
  for (let y = 2; y < 13; y++) {
    const inset = Math.round((13 - y) * 0.6);
    for (let x = 1 + inset; x < 31 - inset; x++) {
      const stripe = Math.floor((x - 1) / 4) % 2 === 0;
      g.set(x, y, stripe ? '#e8dcc0' : '#c8503a');
    }
  }
  for (let x = 1; x < 31; x++) {
    const stripe = Math.floor((x - 1) / 4) % 2 === 0;
    const scallop = Math.abs(((x - 1) % 4) - 1.5) < 1.5 ? 2 : 1;
    for (let y = 13; y < 13 + scallop + 1; y++) g.set(x, y, stripe ? '#e8dcc0' : '#c8503a');
  }
  g.rect(1, 2, 30, 1, '#f4ecd8');
  g.outline(OUT);
  return g.rows();
}

function tinyDoor() {
  const g = new Grid(16, 14);
  g.rect(5, 4, 7, 9, WOOD[2]);
  g.rect(6, 3, 5, 1, WOOD[2]);
  g.rect(5, 4, 1, 9, WOOD[1]);
  g.rect(6, 5, 5, 7, '#4a7a8a');
  g.rect(6, 5, 5, 1, '#7ab0c0');
  g.set(10, 9, '#f0c840');
  g.rect(7, 12, 3, 1, '#a8483c');
  g.rect(2, 10, 3, 1, WOOD[1]);
  // A lantern the size of a thimble, on a nail.
  g.rect(13, 5, 1, 4, IRON[1]); g.rect(12, 8, 2, 2, '#ffd070'); g.set(13, 7, '#fff0b8');
  g.outline(OUT);
  return g.rows();
}

function tinBox() {
  const g = new Grid(16, 12);
  g.rect(3, 4, 10, 7, '#a84a3a');
  g.rect(3, 4, 10, 1, '#d8806a');
  g.rect(3, 9, 10, 1, '#7a2e22');
  g.rect(5, 6, 6, 2, '#f0e4c4');
  g.rect(6, 7, 4, 1, '#a89878');
  g.outline(OUT);
  return g.rows();
}

// --- The beach -----------------------------------------------------------
function beachBall() {
  const g = new Grid(16, 14);
  g.oval(8, 8, 4, 4, '#f0e4c4');
  for (let y = 4; y <= 12; y++) for (let x = 4; x <= 12; x++) {
    if (!g.get(x, y)) continue;
    const k = (x + y) % 6;
    if (k < 2) g.set(x, y, '#d8483a');
    else if (k === 3) g.set(x, y, '#3a7ab8');
  }
  g.set(6, 5, '#ffffff'); g.set(7, 5, '#ffffff');
  g.outline(OUT);
  return g.rows();
}

function crabBucket(frame) {
  const g = new Grid(16, 16);
  g.rect(3, 7, 10, 8, '#c8503a');
  g.rect(3, 7, 10, 1, '#e88a6a');
  g.rect(3, 13, 10, 1, '#7a2e22');
  g.rect(2, 7, 12, 1, '#a83a28');
  // Handle.
  g.line(3, 6, 8, 2, IRON[2]); g.line(13, 6, 8, 2, IRON[2]);
  // Crabs climbing out the top, claws waving.
  const up = frame ? 1 : 0;
  g.rect(4, 5 - up, 3, 2, '#d8603a'); g.rect(3, 3 - up, 1, 2, '#d8603a'); g.rect(7, 4 + up, 1, 2, '#d8603a');
  g.rect(9, 5 + up, 3, 2, '#c8502a'); g.rect(12, 3 + up, 1, 2, '#c8502a'); g.rect(8, 4 - up, 1, 2, '#c8502a');
  g.set(5, 5 - up, OUT); g.set(10, 5 + up, OUT);
  g.outline(OUT);
  return g.rows();
}

function sandcastle() {
  const g = new Grid(16, 20);
  g.rect(2, 12, 12, 7, SAND[1]);
  g.rect(2, 12, 12, 1, SAND[2]);
  g.rect(2, 18, 12, 1, SAND[0]);
  // Two towers with crenellations and a flag between.
  g.rect(2, 7, 4, 6, SAND[1]); g.rect(10, 7, 4, 6, SAND[1]);
  for (const x of [2, 4, 10, 12]) g.rect(x, 5, 2, 2, SAND[1]);
  g.rect(2, 7, 1, 6, SAND[2]); g.rect(10, 7, 1, 6, SAND[2]);
  g.rect(6, 13, 4, 6, SAND[0]);
  g.rect(7, 14, 2, 5, '#5a4a30');
  // The flag: a lolly stick and a scrap of paper.
  g.line(8, 4, 8, 11, WOOD[3]);
  g.rect(9, 2, 4, 3, '#d8483a');
  g.outline(OUT);
  return g.rows();
}

function bucketSpade() {
  const g = new Grid(16, 14);
  g.rect(3, 5, 8, 8, '#3a7ab8');
  g.rect(3, 5, 8, 1, '#7ab0e0');
  g.rect(3, 11, 8, 1, '#26527a');
  g.rect(2, 5, 10, 1, '#26527a');
  g.line(3, 4, 7, 1, IRON[2]); g.line(11, 4, 7, 1, IRON[2]);
  // A red spade leaning against it.
  g.line(12, 12, 14, 3, '#c8503a'); g.line(13, 12, 15, 3, '#a83a28');
  g.rect(12, 1, 4, 3, '#d8604a');
  g.outline(OUT);
  return g.rows();
}

function towel(stripe, w = 32) {
  const g = new Grid(w, 16);
  for (let y = 4; y < 15; y++) for (let x = 1; x < w - 1; x++) {
    const k = Math.floor((y - 4) / 2) % 2 === 0;
    g.set(x, y, k ? stripe[0] : stripe[1]);
  }
  for (let y = 4; y < 15; y++) { g.set(0, y + (y % 2 ? 0 : 0), null); }
  g.rect(1, 14, w - 2, 1, stripe[2]);
  // Fringe.
  for (let y = 4; y < 15; y += 2) { g.set(0, y, stripe[1]); g.set(w - 1, y, stripe[1]); }
  // A pair of sandals, kicked off.
  g.rect(w - 9, 7, 2, 4, '#8a5a30'); g.rect(w - 6, 8, 2, 4, '#8a5a30');
  return g.rows();
}

function poolLife(frame) {
  const g = new Grid(16, 16);
  g.oval(8, 9, 7, 5, '#3a3a34');
  g.oval(8, 9, 6, 4, SEAW[0]);
  g.oval(8, 9, 5, 3, SEAW[1]);
  g.rect(4, 7, 4, 1, SEAW[2]);
  // A starfish.
  const S = '#e88a3a';
  g.rect(4, 9, 3, 1, S); g.rect(5, 8, 1, 3, S); g.set(4, 8, S); g.set(6, 10, S);
  g.set(5, 9, '#f8c070');
  // An anemone, tentacles waving.
  const sw = frame ? 1 : 0;
  g.rect(10, 10, 3, 1, '#8a3a6a');
  for (let i = 0; i < 3; i++) g.set(10 + i + (i === 1 ? sw : 0), 8 + (i === 1 ? 0 : 1), '#d86aa8');
  g.set(11 + sw, 7, '#f0a8d0');
  // A shrimp-fish darting.
  g.rect(frame ? 8 : 6, 11, 2, 1, '#cdeef0');
  g.set(frame ? 7 : 8, 11, '#9ad0d8');
  return g.rows();
}

function shells() {
  const g = new Grid(16, 10);
  const spots = [[2, 4, '#f0d8c0'], [6, 6, '#e8b0a0'], [10, 3, '#f4ecd8'], [13, 6, '#d8c0e0'], [4, 8, '#f4ecd8'], [9, 8, '#e8b0a0']];
  for (const [x, y, c] of spots) { g.rect(x, y, 2, 1, c); g.set(x, y - 1, c); g.set(x + 1, y + 1, '#a89878'); }
  return g.rows();
}

function starfish() {
  const g = new Grid(16, 10);
  const S = '#e8683a';
  g.rect(6, 4, 4, 2, S); g.rect(7, 2, 2, 6, S); g.rect(4, 5, 8, 1, S);
  g.set(7, 4, '#f8b070'); g.set(8, 5, '#f8b070');
  return g.rows();
}

function oldBoot() {
  const g = new Grid(16, 14);
  g.rect(4, 3, 5, 9, '#5a3a22');
  g.rect(4, 9, 9, 3, '#5a3a22');
  g.rect(4, 3, 5, 1, '#7a5a38');
  g.rect(5, 4, 1, 4, '#7a5a38');
  g.rect(4, 11, 9, 1, '#2a1a10');
  // Weed out of the top, and a hole in the toe.
  g.line(5, 3, 3, 0, '#3e6a3a'); g.line(7, 3, 8, 0, '#4a7a3e');
  g.rect(11, 10, 2, 1, OUT);
  g.outline(OUT);
  return g.rows();
}

function tinCan() {
  const g = new Grid(16, 10);
  g.rect(5, 3, 6, 6, '#8a949a');
  g.rect(5, 3, 6, 1, '#c8d0d4');
  g.rect(5, 5, 6, 1, '#a83a28'); g.rect(5, 6, 6, 1, '#d8c8a0');
  g.rect(5, 8, 6, 1, '#5e686c');
  g.rect(6, 2, 4, 1, '#3a4246');
  g.outline(OUT);
  return g.rows();
}

function glassFloat(frame) {
  const g = new Grid(16, 18);
  g.oval(8, 10, 5, 5, '#3a9a78');
  g.oval(8, 10, 4, 4, '#5ac8a0');
  g.set(6, 8, '#cdf8e8'); g.set(7, 8, '#cdf8e8'); g.set(6, 9, '#cdf8e8');
  if (frame) { g.set(10, 12, '#ffffff'); g.set(5, 7, '#ffffff'); }
  // A scrap of net still knotted round it.
  g.line(3, 10, 13, 14, '#b8a070'); g.line(4, 7, 12, 14, '#8a7650');
  g.line(8, 5, 8, 2, ROPE[1]);
  g.outline(OUT);
  return g.rows();
}

function messageBottle() {
  const g = new Grid(16, 12);
  g.rect(2, 5, 9, 4, '#5ac8a0');
  g.rect(2, 5, 9, 1, '#9ae8c8');
  g.rect(11, 6, 3, 2, '#5ac8a0');
  g.rect(14, 6, 1, 2, '#a88a58');
  g.rect(4, 6, 5, 2, PAPER[2]);
  g.rect(5, 7, 3, 1, PAPER[0]);
  g.outline(OUT);
  return g.rows();
}

function whaleRib() {
  const g = new Grid(32, 38);
  // Two great ribs, curving over, half-sunk in the sand.
  const BONE = ['#a8a088', '#d8d0b8', '#f0ead4'];
  for (let i = 0; i < 2; i++) {
    const ox = i ? 17 : 1;
    const flip = i ? -1 : 1;
    for (let y = 0; y < 36; y++) {
      const bend = Math.round(Math.sin((y / 36) * 1.55) * 9);
      const x = ox + (flip > 0 ? bend : 12 - bend);
      g.rect(x, y, 3, 1, BONE[1]);
      g.set(x, y, BONE[2]); g.set(x + 2, y, BONE[0]);
    }
  }
  g.rect(0, 34, 32, 3, SAND[1]);
  g.rect(2, 33, 8, 2, SAND[2]); g.rect(20, 33, 9, 2, SAND[2]);
  g.outline(OUT);
  return g.rows();
}

function sleeperChair(frame) {
  const g = new Grid(32, 26);
  // A deckchair, striped, with a fellow asleep in it under a sun hat, one foot sticking out.
  g.line(4, 24, 12, 13, WOOD[1]); g.line(5, 24, 13, 13, WOOD[2]);
  g.line(22, 24, 18, 14, WOOD[1]);
  g.rect(8, 12, 14, 8, '#e8dcc0');
  for (let x = 8; x < 22; x += 4) g.rect(x, 12, 2, 8, '#3a7ab8');
  g.line(6, 20, 22, 20, WOOD[0]);
  // The sleeper: a round grey shape, the hat tipped over the face, the belly rising and falling.
  const b = frame ? 1 : 0;
  g.rect(10, 8 - b, 9, 7 + b, '#6a7a8a');
  g.rect(10, 8 - b, 9, 1, '#8c9aaa');
  g.oval(8, 7, 3, 3, '#8c97a2');
  g.rect(5, 4, 8, 2, '#e0b030'); g.rect(6, 2, 6, 3, '#e0b030'); g.rect(6, 4, 6, 1, '#b88a20');
  g.rect(19, 15, 6, 2, '#6a7a8a'); g.rect(24, 15, 2, 2, '#8c97a2');
  // A little z, now and then.
  if (frame) { g.rect(11, 0, 3, 1, '#e8f0f4'); g.set(13, 1, '#e8f0f4'); g.rect(11, 2, 3, 1, '#e8f0f4'); }
  g.outline(OUT);
  return g.rows();
}

function beachUmbrella() {
  const g = new Grid(16, 36);
  g.line(8, 5, 8, 34, WOOD[2]);
  g.line(9, 5, 9, 34, WOOD[1]);
  // The canopy: a dome in two colours, scalloped.
  g.oval(8, 7, 7, 4, '#e8dcc0');
  for (let x = 1; x < 15; x++) {
    if (Math.floor((x - 1) / 3) % 2 === 0) for (let y = 3; y < 12; y++) if (g.get(x, y) === '#e8dcc0') g.set(x, y, '#3a8aa8');
  }
  g.rect(1, 10, 14, 1, '#e8dcc0');
  g.set(8, 2, IRON[2]); g.set(8, 3, '#e8dcc0');
  // Heaped sand at the foot.
  g.oval(8, 34, 5, 1, SAND[1]);
  g.outline(OUT);
  return g.rows();
}

function driftwoodFace() {
  const g = new Grid(16, 28);
  const D = ['#6a5e4e', '#8a7e6a', '#b0a48c'];
  g.rect(5, 6, 7, 22, D[1]);
  g.rect(5, 6, 2, 22, D[0]);
  g.rect(10, 6, 2, 20, D[2]);
  // The roots at the foot and two branches up top.
  g.line(5, 27, 1, 24, D[1]); g.line(11, 27, 15, 24, D[1]);
  g.line(6, 6, 3, 1, D[1]); g.line(11, 6, 14, 2, D[1]);
  g.line(7, 6, 7, 0, D[2]);
  // A knot-hole face: two eyes and a surprised mouth.
  g.rect(6, 11, 2, 2, OUT); g.rect(9, 11, 2, 2, OUT);
  g.set(6, 11, '#d8d0b8'); g.set(9, 11, '#d8d0b8');
  g.rect(7, 15, 3, 3, OUT);
  g.outline(OUT);
  return g.rows();
}

// --- The flood (2026-11-15): Saltcombe's water creeping up, a little more each time you come back ----------
// (src/data/floodStages.js says when each shows.) Water is a see-through teal (the colours end in an alpha byte).
//   st_flood_sheet        water lying over boards (flat, 2 wide)
//   st_flood_puddle       a spread of it on the planks (flat, 2 wide)
//   st_flood_band_s_1..3  water up the legs of a small stilt house (3 wide), rising stage by stage
//   st_flood_band_l_1..3  the same for the big one (4 wide)
//   st_tide_post_1..3     the harbour's tide post, with its painted red line, and the water a little nearer it each stage
const FW = ['#2a6a7aa0', '#3e8a98a8', '#7ac0c8b8', '#cdeef0d0'];

function floodSheet(puddle) {
  const g = new Grid(32, 16);
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 32; x++) {
      if (puddle) {
        // A lumpy oval, ragged at the edge.
        const dx = (x - 15.5) / 15.5;
        const dy = (y - 7.5) / 7;
        const d = dx * dx + dy * dy + 0.12 * Math.sin(x * 1.3 + y * 0.9);
        if (d > 1) continue;
        g.set(x, y, d > 0.8 ? FW[2] : d > 0.45 ? FW[1] : FW[0]);
      } else {
        g.set(x, y, (x + y * 2) % 11 === 0 ? FW[1] : FW[0]);
      }
    }
  }
  // Ripples catching the lamplight.
  for (const [x, y, w] of [[4, 4, 5], [14, 9, 6], [22, 5, 4], [8, 12, 4]]) g.rect(x, y, w, 1, FW[3]);
  return g.rows();
}

// Water up a stilt house's legs: `h` pixels of it from the bottom, a lighter, rippled top edge.
function floodBand(w, h) {
  const g = new Grid(w, h);
  for (let x = 0; x < w; x++) {
    const top = (x % 7 < 3 ? 0 : 1) + (x % 13 === 0 ? 1 : 0);
    for (let y = top; y < h; y++) g.set(x, y, y === top ? FW[3] : y === top + 1 ? FW[2] : y < top + 4 ? FW[1] : FW[0]);
  }
  return g.rows();
}

// The tide post: a piling with white paint ticks down one side, the old RED LINE across it near the top, and a
// dark wet band from the bottom up to the water (`level` pixels), foam on top of it.
function tidePost(level) {
  const g = new Grid(16, 40);
  // The piling.
  g.rect(5, 1, 6, 39, WOOD[1]);
  g.rect(5, 1, 1, 39, WOOD[0]);
  g.rect(10, 1, 1, 39, WOOD[2]);
  g.rect(4, 0, 8, 2, WOOD[3]);
  // A pale painted board down it, ruled in tick marks.
  g.rect(6, 3, 4, 37, '#cdc8b0');
  for (let y = 5; y < 39; y += 3) g.rect(6, y, y % 6 === 5 ? 4 : 2, 1, '#3a2c20');
  // The red line, painted right round it and wide enough to read from the quay.
  g.rect(2, 9, 12, 3, '#c0392b');
  g.rect(2, 9, 12, 1, '#e0584a');
  g.rect(2, 12, 12, 1, '#7a2018');
  // Wet wood and the waterline.
  for (let y = 40 - level; y < 40; y++) g.rect(5, y, 6, 1, y === 40 - level ? SEAW[3] : '#1c3a40');
  g.rect(3, 40 - level, 10, 1, SEAW[2]);
  g.rect(4, 41 - level, 8, 1, '#3e8a98c0');
  return g.rows();
}

const FRAMES = (fn, n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`f${i + 1}`, fn(i)]));

export const ST_PROP_SPRITES = {
  st_folk_a: folkFrame('a', 0),
  st_folk_b: folkFrame('b', 0),
  st_folk_c: folkFrame('c', 0),
  st_folk_d: folkFrame('d', 0),
  st_sweeper: sweeper(0),
  st_mender: mender(0),
  st_cat_walk: cat(TABBY, 0, 'walk').rows(),
  st_cat_walk_b: cat(BLACK, 0, 'walk').rows(),
  st_cat_sit: catCrate(0),
  st_cat_loaf: cat(GINGER, 0, 'loaf').rows(),
  st_cat_loaf_b: cat(TABBY, 0, 'loaf').rows(),
  st_price_board: priceBoard(),
  st_fish_rack: fishRack(),
  st_rain_barrel: rainBarrel(0),
  st_flower_tub: flowerTub(),
  st_boot_planter: bootPlanter(),
  st_broom_bucket: broomBucket(),
  st_hopscotch: hopscotch(),
  st_dinghy_a: dinghy(0, 1, false),
  st_dinghy_b: dinghy(0, -1, true),
  st_boat_trestle: boatTrestle(),
  st_awning: awning(),
  st_tiny_door: tinyDoor(),
  st_tin_box: tinBox(),
  st_beach_ball: beachBall(),
  st_crab_bucket: crabBucket(0),
  st_sandcastle: sandcastle(),
  st_bucket_spade: bucketSpade(),
  st_towel_a: towel(['#d8483a', '#f0e4c4', '#a83228']),
  st_towel_b: towel(['#3a7ab8', '#f0e4c4', '#26527a']),
  st_pool_life: poolLife(0),
  st_shells: shells(),
  st_starfish: starfish(),
  st_old_boot: oldBoot(),
  st_tin_can: tinCan(),
  st_glass_float: glassFloat(0),
  st_message_bottle: messageBottle(),
  st_whale_rib: whaleRib(),
  st_sleeper_chair: sleeperChair(0),
  st_beach_umbrella: beachUmbrella(),
  st_driftwood_face: driftwoodFace(),
  st_flood_sheet: floodSheet(false),
  st_flood_puddle: floodSheet(true),
  st_flood_band_s_1: floodBand(48, 8),
  st_flood_band_s_2: floodBand(48, 14),
  st_flood_band_s_3: floodBand(48, 20),
  st_flood_band_l_1: floodBand(64, 8),
  st_flood_band_l_2: floodBand(64, 14),
  st_flood_band_l_3: floodBand(64, 20),
  st_tide_post_1: tidePost(14),
  st_tide_post_2: tidePost(21),
  st_tide_post_3: tidePost(27),
};

export const ST_PALETTE_EXTRA = palette;

// Moving ones: frames of one size, played by `animation: '<same name>'`.
export const ST_FOLK_A_SPRITES = { f1: folkFrame('a', 0), f2: folkFrame('a', 1) };
export const ST_FOLK_B_SPRITES = { f1: folkFrame('b', 0), f2: folkFrame('b', 1) };
export const ST_FOLK_C_SPRITES = { f1: folkFrame('c', 0), f2: folkFrame('c', 1) };
export const ST_FOLK_D_SPRITES = { f1: folkFrame('d', 0), f2: folkFrame('d', 1) };
export const ST_SWEEPER_SPRITES = FRAMES(sweeper, 2);
export const ST_MENDER_SPRITES = FRAMES(mender, 2);
export const ST_CAT_WALK_SPRITES = { f1: cat(TABBY, 0, 'walk').rows(), f2: cat(TABBY, 1, 'walk').rows() };
export const ST_CAT_WALK_B_SPRITES = { f1: cat(BLACK, 0, 'walk').rows(), f2: cat(BLACK, 1, 'walk').rows() };
export const ST_CAT_SIT_SPRITES = { f1: catCrate(0), f2: catCrate(1) };
export const ST_CAT_LOAF_SPRITES = { f1: cat(GINGER, 0, 'loaf').rows(), f2: cat(GINGER, 1, 'loaf').rows() };
export const ST_CAT_LOAF_B_SPRITES = { f1: cat(TABBY, 0, 'loaf').rows(), f2: cat(TABBY, 1, 'loaf').rows() };
export const ST_RAIN_BARREL_SPRITES = FRAMES(rainBarrel, 2);
export const ST_DINGHY_A_SPRITES = { f1: dinghy(0, 1, false), f2: dinghy(1, 1, false) };
export const ST_DINGHY_B_SPRITES = { f1: dinghy(0, -1, true), f2: dinghy(1, -1, true) };
export const ST_CRAB_BUCKET_SPRITES = FRAMES(crabBucket, 2);
export const ST_POOL_LIFE_SPRITES = FRAMES(poolLife, 2);
export const ST_GLASS_FLOAT_SPRITES = FRAMES(glassFloat, 2);
export const ST_SLEEPER_CHAIR_SPRITES = FRAMES(sleeperChair, 2);
export const ST_PALETTE = palette;

// How many tiles wide each big one stands.
export const ST_FOOTPRINTS = {
  st_mender: 2,
  st_fish_rack: 2,
  st_dinghy_a: 2,
  st_dinghy_b: 2,
  st_boat_trestle: 2,
  st_awning: 2,
  st_towel_a: 2,
  st_towel_b: 2,
  st_whale_rib: 2,
  st_sleeper_chair: 2,
  st_flood_sheet: 2,
  st_flood_puddle: 2,
  st_flood_band_s_1: 3,
  st_flood_band_s_2: 3,
  st_flood_band_s_3: 3,
  st_flood_band_l_1: 4,
  st_flood_band_l_2: 4,
  st_flood_band_l_3: 4,
};
