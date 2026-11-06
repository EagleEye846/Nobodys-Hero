// Props for Chapter 5's Sunken Lanes (the dry pocket under the water in lanes_bubble). Drawn
// like sunnyAutumn.js: rows of characters from a small painter, 16 pixels to a tile, standing
// on the bottom edge and centred over their footprint. Every id starts `ln_`. Ones that move are
// also animations: put the prop's name in the object's `animation` too (and a `speed`).
//
//   ln_pocket_rim    the edge of the dry pocket: a ring of light where the water stands up
//                    like glass (11 wide, 10 high; lay it `flat` over the pocket's floor)
//   ln_bubbles*      a thread of bubbles rising off the bottom (over water, flat)
//   ln_fish*         a small fish's shadow nosing about (over water, flat)
//   ln_stair         the broad stone stair down to Merrow in lanes_down: 8 tiles wide, 5 high,
//                    its parapets over the '#' columns either side, the steps darkening and
//                    weeding over as they go down into the flood (lay it `flat, walkable` with
//                    its left foot at the parapet's bottom, 12,17)
//   ln_signpost      a leaning three-armed signpost on dry ground (c5_drowned_signpost is the
//                    one standing in water)

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xf380 + colors.size);
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

  rows() {
    return this.cells.map((row) => row.map((c) => (c ? char(c) : '.')).join(''));
  }
}

const frames = (fn, n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`f${i + 1}`, fn(i)]));

// The water's skin where it stands up round the pocket: pale, see-through, brightest at the top
// left (where the lantern's light catches it) and broken where the two culverts come in.
const RIM = ['#cdeee455', '#e4fbf488', '#ffffffc0', '#8ad0c040'];

function pocketRim() {
  const w = 176;
  const h = 160;
  const g = new Grid(w, h);
  const cx = w / 2;
  const cy = h / 2;
  const rx = 84;
  const ry = 76;
  // Culverts come in on both sides, rows 8 to 11 of the room (px 48 to 112 down this sprite).
  const gap = (y) => y > 44 && y < 116;
  for (let i = 0; i < 1400; i++) {
    const a = (i / 1400) * Math.PI * 2;
    const x = cx + Math.cos(a) * rx;
    const y = cy + Math.sin(a) * ry;
    if (gap(y) && Math.abs(Math.cos(a)) > 0.6) continue;
    // Upper left catches the light.
    const lit = Math.cos(a - Math.PI * 1.25);
    g.set(x, y, lit > 0.55 ? RIM[1] : RIM[0]);
    g.set(x + Math.cos(a) * 1.5, y + Math.sin(a) * 1.5, RIM[3]);
    if (lit > 0.85 && i % 3 === 0) g.set(x - Math.cos(a) * 1.2, y - Math.sin(a) * 1.2, RIM[2]);
  }
  // A few specks of light on the skin.
  for (const [x, y] of [[40, 30], [46, 24], [126, 20], [150, 60], [30, 120], [120, 146], [60, 150]]) g.set(x, y, RIM[2]);
  return g.rows();
}

const BUBBLE = ['#b8e4dc', '#e8fffa', '#7cbcb0'];
function bubbles(i) {
  const g = new Grid(16, 28);
  // Five bubbles rising at their own pace, wobbling side to side.
  for (let b = 0; b < 5; b++) {
    const y = 26 - ((b * 6 + i * 3) % 28);
    const x = 7 + Math.round(Math.sin((y + b * 5) / 4) * 2) + (b % 2 ? 2 : -1);
    const r = b % 3 === 0 ? 2 : 1;
    if (r === 2) {
      g.set(x, y - 1, BUBBLE[0]); g.set(x - 1, y, BUBBLE[0]); g.set(x + 1, y, BUBBLE[2]); g.set(x, y + 1, BUBBLE[2]);
      g.set(x - 1, y - 1, BUBBLE[1]);
    } else {
      g.set(x, y, BUBBLE[1]);
    }
  }
  return g.rows();
}

const FISH = ['#0e2a22c0', '#14382ec0'];
function fish(i) {
  const g = new Grid(16, 10);
  const sway = [0, 1, 0, -1][i];
  // A long body, then a tail that flicks.
  for (let x = 3; x < 12; x++) {
    const half = x < 6 ? x - 2 : x < 9 ? 2 : 1;
    for (let dy = -half; dy <= half; dy++) g.set(x, 5 + dy, x < 9 ? FISH[0] : FISH[1]);
  }
  g.set(12, 5 + sway, FISH[1]); g.set(13, 4 + sway, FISH[1]); g.set(13, 6 + sway, FISH[1]); g.set(14, 3 + sway, FISH[1]); g.set(14, 7 + sway, FISH[1]);
  return g.rows();
}


// The stair down to Merrow: dressed coast stone, a parapet each side with a coping, five steps
// whose nosings catch the light, each a little wetter and greener than the last, and the
// flood lapping over the bottom ones.
const STONE = ['#3a4440', '#525e58', '#6c7872', '#8c9a92', '#a8b4aa'];
const WET = ['#2a3632', '#34423e', '#3e4e48'];
const WEED = ['#2c4a2e', '#3e6a3e', '#5a8a50'];
function stair() {
  const w = 128;
  const h = 80;
  const g = new Grid(w, h);
  // The steps (between the parapets, x 16 to 111): rows 16 to 63, five treads.
  const treads = 6;
  const th = 48 / treads;
  for (let k = 0; k < treads; k++) {
    const y0 = Math.round(16 + k * th);
    const y1 = Math.round(16 + (k + 1) * th);
    const wet = k / (treads - 1);
    const base = wet < 0.3 ? STONE[2] : wet < 0.7 ? STONE[1] : WET[2];
    g.rect(16, y0, 96, y1 - y0, base);
    // The nosing, lit; the shadow under it.
    g.rect(16, y0, 96, 1, wet < 0.5 ? STONE[4] : STONE[3]);
    g.rect(16, y1 - 1, 96, 1, wet < 0.5 ? STONE[1] : WET[0]);
    // Joints between the slabs, staggered.
    for (let x = 16 + (k % 2 ? 12 : 0); x < 112; x += 24) g.rect(x, y0 + 1, 1, y1 - y0 - 2, wet < 0.5 ? STONE[1] : WET[0]);
    // Puddles and weed on the lower steps.
    if (wet > 0.3) for (let i = 0; i < 6 + k * 3; i++) {
      const x = 18 + ((i * 37 + k * 13) % 90);
      g.rect(x, y0 + 2 + (i % 3), 2 + (i % 2), 1, i % 2 ? WEED[0] : WEED[1]);
    }
    if (wet > 0.5) g.rect(20 + ((k * 29) % 70), y0 + 3, 6, 1, '#5aa89c');
  }
  // The flood over the last two steps: see-through water with a lapping edge.
  for (let x = 16; x < 112; x++) {
    const edge = 52 + Math.round(Math.sin(x / 5) * 1.5);
    for (let y = edge; y < 64; y++) g.set(x, y, y === edge ? '#8ad0c0b0' : '#1f5a5c99');
  }
  // The parapets over the '#' columns: a coping on top, dressed stone, weed at the foot.
  for (const x0 of [0, 112]) {
    g.rect(x0, 0, 16, 80, STONE[1]);
    g.rect(x0, 0, 16, 4, STONE[3]);
    g.rect(x0, 0, 16, 1, STONE[4]);
    g.rect(x0, 4, 16, 1, STONE[0]);
    for (let y = 12; y < 80; y += 10) {
      g.rect(x0, y, 16, 1, STONE[0]);
      g.rect(x0 + ((y / 10) % 2 ? 5 : 10), y - 9, 1, 9, STONE[0]);
    }
    g.rect(x0 + (x0 ? 0 : 15), 4, 1, 76, x0 ? STONE[2] : STONE[0]);
    for (let y = 56; y < 80; y += 3) g.rect(x0 + 2 + (y % 7), y, 3, 1, WEED[(y / 3) % 2 ? 0 : 1]);
    g.rect(x0, 66, 16, 14, '#1f5a5cb0');
    g.rect(x0, 66, 16, 1, '#8ad0c0b0');
  }
  return g.rows();
}

// A signpost on dry ground: a leaning post, three arms, moss at the foot.
const POST = ['#2a231e', '#4a3a2c', '#6c5440', '#907a5c'];
function signpost() {
  const g = new Grid(16, 40);
  const outline = [];
  g.line(7, 39, 8, 4, POST[1]); g.line(8, 39, 9, 4, POST[2]); g.line(9, 39, 10, 4, POST[1]);
  // The arms.
  for (const [y, dir, len] of [[7, 1, 6], [15, -1, 7], [23, 1, 5]]) {
    const x0 = dir > 0 ? 9 : 8;
    g.rect(dir > 0 ? x0 : x0 - len, y, len, 4, POST[2]);
    g.rect(dir > 0 ? x0 : x0 - len, y, len, 1, POST[3]);
    g.rect(dir > 0 ? x0 : x0 - len, y + 3, len, 1, POST[0]);
    g.set(dir > 0 ? x0 + len : x0 - len - 1, y + 1, POST[2]);
    g.set(dir > 0 ? x0 + len : x0 - len - 1, y + 2, POST[2]);
    g.rect(dir > 0 ? x0 + 1 : x0 - len + 1, y + 2, len - 2, 1, '#c8c0a8');
  }
  // Moss and weed round the foot.
  g.rect(5, 37, 7, 2, WEED[0]); g.set(4, 38, WEED[1]); g.set(11, 37, WEED[1]); g.set(7, 36, WEED[2]);
  // Outline.
  const filled = (x, y) => x >= 0 && y >= 0 && x < 16 && y < 40 && g.cells[y][x];
  for (let y = 0; y < 40; y++) for (let x = 0; x < 16; x++) if (!filled(x, y) && (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1))) outline.push([x, y]);
  for (const [x, y] of outline) g.set(x, y, '#101810');
  return g.rows();
}

// --- Registry ----------------------------------------------------------
export const LN_PROP_SPRITES = {
  ln_pocket_rim: pocketRim(),
  ln_bubbles: bubbles(0),
  ln_fish: fish(0),
  ln_stair: stair(),
  ln_signpost: signpost(),
};

export const LN_PALETTE = palette;
export const LN_PALETTE_EXTRA = palette;
export const LN_BUBBLES_SPRITES = frames((i) => bubbles(i), 8);
export const LN_FISH_SPRITES = frames((i) => fish(i), 4);

// How many tiles wide each big one stands.
export const LN_FOOTPRINTS = {
  ln_pocket_rim: 11,
  ln_stair: 8,
};
