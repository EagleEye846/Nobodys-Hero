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
//   ln_sunk_door     a doorway with no house round it, the door open (2 wide): the Sluices'
//                    one, the way into secret_lanes_door (lay it `walkable, solidSides: 5`)
//   ln_sunk_door_shut  the same with its door shut (scenery)
//   ln_parlour_window  the parlour's window: rain on the glass, a summer lane behind it (2 wide, hung)
//   ln_parlour_clock*  a tall clock, going (an animation: its pendulum swings)

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
  // The road carries on: the water deepens over the last treads, and below the stair's foot the
  // drowned steps show faintly, darker with each one, running on down.
  for (let y = 52; y < 64; y++) g.rect(16, y + 1, 96, 1, '#0c2a2c' + (0x20 + (y - 52) * 7).toString(16));
  g.rect(16, 64, 96, 16, '#10383a88');
  for (let i = 0; i < 4; i++) {
    const y = 65 + i * 4;
    const a = (0x60 - i * 14).toString(16).padStart(2, '0');
    g.rect(16, y, 96, 1, '#5a9a90' + a);
    g.rect(16, y + 1, 96, 1, '#06181a' + (0x70 + i * 20).toString(16));
  }
  g.rect(16, 72, 96, 8, '#04121444');
  // Worn chevrons inlaid down the middle of the upper steps: this way.
  for (let k = 0; k < 4; k++) {
    const y = Math.round(16 + k * th) + 2;
    const col = ['#c8b878', '#b0a46c', '#8a8458', '#5e6a50'][k];
    for (let d = 0; d < 5; d++) { g.set(60 + d, y + d, col); g.set(68 - d, y + d, col); }
  }
  // A chain handrail down each inner edge, from a post at the head into the water.
  for (const hx of [18, 109]) {
    g.rect(hx - 1, 15, 3, 4, '#2a231e');
    g.rect(hx - 1, 15, 3, 1, '#6c5440');
    for (let y = 19; y < 70; y += 2) g.set(hx, y, y % 4 === 3 ? '#a8b4aa' : '#586660');
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

/// --- The drowned lanes' dressing (second pass) --------------------------
// Garden walls, carts, doors and beds standing in the flood, weed mats on top of it and
// the shapes of the old lanes under it, so the water reads as a drowned village and not
// as a flat green floor. Every one in water has its waterline drawn on: a pale lapping
// edge and the part below darkened and green.
const OUTLINE_LN = '#101810';
function edge(g) {
  const pts = [];
  const at = (x, y) => x >= 0 && y >= 0 && x < g.w && y < g.h && g.cells[y][x];
  for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) {
    if (!at(x, y) && (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1))) pts.push([x, y]);
  }
  for (const [x, y] of pts) g.set(x, y, OUTLINE_LN);
}
const SUNK = ['#1f4a44cc', '#2c5e54aa'];
const LAP = ['#8ad0c0d0', '#c8f0e4e0'];
// Darken everything below `y` as if seen through the water, and lap a pale line along it.
function waterline(g, y, from = 0, to = g.w) {
  // Below the line it fades into the water: darker, then broken up, then gone.
  for (let yy = y + 1; yy < g.h; yy++) for (let x = from; x < to; x++) {
    if (!g.cells[yy][x]) continue;
    const d = yy - y;
    if (d > 6 || (d > 3 && (x + yy) % 2)) g.set(x, yy, null);
    else g.set(x, yy, d < 3 ? SUNK[0] : SUNK[1]);
  }
  for (let x = from; x < to; x++) {
    const wob = Math.round(Math.sin(x / 3) * 0.6);
    if ((x * 7) % 5 !== 0) g.set(x, y + wob, (x % 4) ? LAP[0] : LAP[1]);
  }
}
const MORTAR = '#2e3834';

// A run of old garden wall standing out of the water, broken at one end.
function sunkWall(w, broken) {
  const h = 26;
  const g = new Grid(w, h);
  const top = (x) => (broken && x > w - 14 ? 6 + Math.round((x - (w - 14)) * 0.9) + ((x * 5) % 3) : 4 + ((x * 3) % 7 === 0 ? 1 : 0));
  for (let x = 1; x < w - 1; x++) {
    const t = top(x);
    for (let y = t; y < h; y++) g.set(x, y, STONE[1]);
    g.set(x, t, STONE[3]);
    g.set(x, t + 1, STONE[2]);
  }
  // Courses of stone, staggered, each stone a shade of its own.
  for (let y = 9, k = 0; y < h; y += 5, k++) {
    for (let x = 1; x < w - 1; x++) if (g.cells[y][x] && y > top(x) + 1) g.set(x, y, MORTAR);
    for (let x = 1 + (k % 2 ? 4 : 0); x < w - 1; x += 8) for (let j = 1; j < 5; j++) if (y - j > top(x) + 1) g.set(x, y - j, MORTAR);
    for (let x = 3 + k * 3; x < w - 3; x += 11) if (y - 2 > top(x) + 1) { g.set(x, y - 2, STONE[2]); g.set(x + 1, y - 2, STONE[2]); }
  }
  // Ivy and weed down the face, moss on the coping.
  for (let x = 2; x < w - 2; x += 1) if ((x * 11) % 7 < 2) {
    const t = top(x);
    const len = 3 + ((x * 13) % 7);
    for (let j = 0; j < len; j++) g.set(x + (j % 3 === 2 ? 1 : 0), t + 1 + j, WEED[(x + j) % 3]);
  }
  for (let x = 1; x < w - 1; x++) if ((x * 3) % 4 === 0) g.set(x, top(x), WEED[2]);
  // Fallen stones at the broken end, half in the water.
  if (broken) { g.rect(w - 9, 18, 4, 3, STONE[2]); g.rect(w - 8, 18, 2, 1, STONE[3]); g.rect(w - 4, 20, 3, 2, STONE[1]); }
  edge(g);
  waterline(g, 19, 0, w);
  return g.rows();
}

// A cart tipped into the flood: one wheel up out of the water, the shafts in the air.
const WOOD = ['#2e2218', '#4a3624', '#6a4e34', '#8a6a48'];
function sunkCart() {
  const g = new Grid(36, 28);
  // The bed, tipped down to the left.
  for (let x = 2; x < 26; x++) {
    const y = 14 + Math.round((26 - x) * 0.18);
    g.rect(x, y, 1, 6, WOOD[1]);
    g.set(x, y, WOOD[3]);
    g.set(x, y + 3, WOOD[0]);
  }
  // The shafts, sticking up out of the water to the right.
  g.line(24, 16, 34, 5, WOOD[2]); g.line(24, 17, 34, 6, WOOD[1]);
  g.line(21, 16, 31, 3, WOOD[2]); g.line(21, 17, 31, 4, WOOD[1]);
  // The wheel, spoked, its top half dry.
  const cx = 12, cy = 15, r = 7;
  for (let a = 0; a < 64; a++) {
    const t = (a / 64) * Math.PI * 2;
    g.set(cx + Math.cos(t) * r, cy + Math.sin(t) * r, WOOD[2]);
    g.set(cx + Math.cos(t) * (r - 1), cy + Math.sin(t) * (r - 1), WOOD[1]);
  }
  for (let s = 0; s < 6; s++) { const t = (s / 6) * Math.PI * 2 + 0.3; g.line(cx, cy, cx + Math.cos(t) * (r - 1), cy + Math.sin(t) * (r - 1), WOOD[1]); }
  g.rect(cx - 1, cy - 1, 3, 3, WOOD[3]);
  // Weed hung over the rim.
  for (const x of [6, 9, 17, 20]) { g.set(x, 13, WEED[1]); g.set(x, 14, WEED[0]); g.set(x + 1, 15, WEED[0]); }
  edge(g);
  waterline(g, 19, 0, 36);
  return g.rows();
}

// A cottage doorway with nothing left round it: the jambs, the lintel, and the door
// hanging open on one hinge, up to its knees in the flood.
// `shut`: the door drawn to in its frame (the ones you can't go through). The open one (the
// Sluices', the way into secret_lanes_door) has a secret in the drawing: the flood stops at the
// jambs. Through the opening there are dry boards and a little warm light, a long way back.
function sunkDoor(shut = false) {
  const g = new Grid(32, 38);
  g.rect(4, 4, 24, 4, STONE[2]); g.rect(4, 4, 24, 1, STONE[3]); g.rect(4, 7, 24, 1, STONE[0]);
  g.rect(14, 2, 4, 3, STONE[2]); g.set(15, 2, STONE[3]);
  for (const x0 of [4, 24]) { g.rect(x0, 8, 4, 30, STONE[1]); g.rect(x0, 8, 1, 30, STONE[2]); for (let y = 12; y < 38; y += 6) g.rect(x0, y, 4, 1, MORTAR); }
  if (shut) {
    // The door shut in its frame: upright boards, two ledges and a brace, a ring latch.
    g.rect(8, 8, 16, 30, WOOD[1]);
    for (const x of [11, 15, 19]) g.rect(x, 8, 1, 30, WOOD[0]);
    for (const x of [8, 12, 16, 20]) g.rect(x, 8, 1, 30, WOOD[2]);
    g.rect(8, 13, 16, 2, WOOD[2]); g.rect(8, 13, 16, 1, WOOD[3]);
    g.rect(8, 29, 16, 2, WOOD[2]); g.rect(8, 29, 16, 1, WOOD[3]);
    g.line(9, 28, 22, 15, WOOD[2]); g.line(9, 27, 22, 14, WOOD[3]);
    g.rect(20, 20, 2, 3, '#2a2a24'); g.set(21, 23, '#c8b070'); g.set(20, 24, '#c8b070'); g.set(21, 24, '#9a8850');
    // Weed caught along the foot of it.
    for (const x of [9, 10, 14, 18, 22]) g.set(x, 27, WEED[x % 3]);
  } else {
    // The dark inside of the doorway, and the door swung half open. Far back in the dark,
    // warm light; and along the bottom, dry boards where the water ought to be.
    g.rect(8, 8, 16, 30, '#18241f');
    g.rect(14, 18, 9, 20, '#241f18'); g.rect(16, 23, 6, 15, '#3a2c1c'); g.rect(17, 26, 4, 8, '#5a4026');
    g.rect(18, 28, 2, 4, '#8a6236');
    for (let y = 33; y < 38; y++) g.rect(8, y, 16, 1, y === 33 ? '#7a5c3c' : (y % 2 ? '#5a4430' : '#4e3a28'));
    for (let y = 9; y < 38; y++) { g.set(9, y, WOOD[2]); g.set(10, y, WOOD[1]); g.set(11, y, WOOD[1]); g.set(12, y, WOOD[0]); }
    g.rect(9, 14, 4, 1, WOOD[3]); g.rect(9, 28, 4, 1, WOOD[3]);
    g.set(12, 22, '#c8b070');
  }
  // The number painted over the door, nearly gone.
  g.rect(13, 5, 1, 2, '#c8c0a8'); g.rect(17, 5, 2, 1, '#c8c0a8'); g.set(18, 6, '#c8c0a8');
  // Weed and moss.
  for (const [x, y] of [[5, 9], [6, 10], [26, 12], [25, 13], [7, 3], [22, 3], [23, 3]]) g.set(x, y, WEED[(x + y) % 3]);
  edge(g);
  if (shut) waterline(g, 30, 0, 32);
  else { waterline(g, 30, 0, 8); waterline(g, 30, 24, 32); }
  return g.rows();
}

// --- The parlour behind the open door (secret_lanes_door) ---------------
// A window with rain running down the glass and, behind it, a lane in summer sun: hedges cut,
// a cottage, washing out. Its curtains on a rod with two brackets. 2 wide, hung on the wall's
// lowest row (its foot a few pixels above the floor line).
const PARLOUR = { frame: '#d8ccb0', frameLo: '#a89a7c', sill: '#8a6a48', sillHi: '#b08a60', curtain: ['#7a3a30', '#a85a48', '#c87a62'], rod: '#3a2c20' };
function parlourWindow() {
  const g = new Grid(32, 28);
  // The frame and sill.
  g.rect(3, 3, 26, 19, PARLOUR.frame); g.rect(3, 21, 26, 1, PARLOUR.frameLo);
  g.rect(1, 22, 30, 2, PARLOUR.sill); g.rect(1, 22, 30, 1, PARLOUR.sillHi);
  // The view: four panes of somewhere else.
  const sky = (y) => (y < 7 ? '#8ccaf0' : y < 10 ? '#a8d8f4' : '#c8e8f4');
  for (const [px, py] of [[5, 5], [17, 5], [5, 14], [17, 14]]) {
    for (let y = 0; y < 7; y++) for (let x = 0; x < 10; x++) {
      const vy = py + y - 5; // 0..15 down the whole view
      const vx = px + x - 5; // 0..21 across it
      let c = sky(vy);
      if (vy >= 9) c = '#6aaa50';
      if (vy === 9 || (vy === 10 && vx % 3 === 0)) c = '#3e7a36';
      if (vy >= 10 && Math.abs(vx - 11 + (vy - 10) * 0.6) < 1 + (vy - 10) * 0.7) c = vy % 2 ? '#d8c08a' : '#e4cc96';
      if (vy >= 11 && vy % 2 === 0 && vx % 4 === 1) c = '#8ac868';
      g.set(px + x, py + y, c);
    }
  }
  // The sun, top right, and a cottage with a red roof beside the lane, far off.
  g.rect(24, 6, 3, 2, '#fff4b0'); g.set(25, 5, '#fff4b0'); g.set(23, 7, '#ffe890');
  g.rect(7, 12, 5, 1, '#b84a3a'); g.rect(8, 11, 3, 1, '#b84a3a'); g.rect(7, 14, 5, 3, '#f0e8d8'); g.set(9, 15, '#5a4a3a');
  g.rect(19, 13, 1, 3, PARLOUR.rod); g.rect(25, 13, 1, 3, PARLOUR.rod); g.line(20, 13, 24, 13, '#e8e8e0');
  g.set(21, 14, '#e8e8e0'); g.set(23, 14, '#88a8d8');
  // The glazing bars.
  g.rect(15, 5, 2, 16, PARLOUR.frame); g.rect(5, 12, 22, 2, PARLOUR.frame);
  // Rain running down the outside of the glass, in spite of all that sun.
  for (const [x, y, n] of [[6, 5, 3], [9, 7, 4], [12, 14, 3], [18, 6, 3], [21, 15, 4], [26, 8, 3], [8, 16, 3], [24, 17, 2]]) {
    for (let j = 0; j < n; j++) g.set(x, y + j, '#e8f4ffb0');
    g.set(x, y + n, '#ffffffd0');
  }
  // The curtains drawn back to either side, on a rod with a bracket at each end.
  g.rect(0, 1, 32, 1, PARLOUR.rod); g.set(1, 2, PARLOUR.rod); g.set(30, 2, PARLOUR.rod); g.rect(0, 0, 2, 1, PARLOUR.rod); g.rect(30, 0, 2, 1, PARLOUR.rod);
  for (const side of [0, 1]) for (let y = 2; y < 24; y++) {
    const w = y < 12 ? 5 : y < 16 ? 4 : 5;
    for (let i = 0; i < w; i++) {
      const x = side ? 31 - i : i;
      g.set(x, y, PARLOUR.curtain[(i + (y > 13 ? 1 : 0)) % 3]);
    }
  }
  // The tie-backs.
  g.rect(0, 14, 5, 1, '#d8b060'); g.rect(27, 14, 5, 1, '#d8b060');
  edge(g);
  return g.rows();
}

// A tall clock, going: its pendulum swinging in the window of its trunk (4 frames), the
// hands at ten to four. Tall, 1 wide.
const CLOCK = ['#3a2416', '#5a3820', '#7a5030', '#9a6a40'];
const BRASSY = ['#a88a3a', '#d8b860', '#f4e0a0'];
function parlourClock(i) {
  const g = new Grid(16, 48);
  g.rect(2, 41, 12, 7, CLOCK[2]); g.rect(2, 41, 12, 1, CLOCK[3]); g.rect(1, 46, 14, 2, CLOCK[1]);
  g.rect(4, 15, 8, 26, CLOCK[2]); g.rect(4, 15, 1, 26, CLOCK[3]); g.rect(11, 15, 1, 26, CLOCK[1]);
  // The trunk door and its little window, the pendulum swinging in it.
  g.rect(5, 18, 6, 18, CLOCK[1]); g.rect(6, 21, 4, 12, '#1a120c');
  const sway = [-1, 0, 1, 0][i];
  g.rect(8, 21, 1, 7, BRASSY[0]);
  g.set(8 + sway, 27, BRASSY[0]); g.set(8 + sway, 28, BRASSY[0]);
  g.rect(7 + sway, 29, 3, 3, BRASSY[1]); g.set(7 + sway, 29, BRASSY[2]);
  // The hood, a swan-neck top with a brass finial, and the dial.
  g.rect(2, 3, 12, 12, CLOCK[2]); g.rect(2, 3, 12, 1, CLOCK[3]);
  g.rect(1, 1, 5, 2, CLOCK[3]); g.rect(10, 1, 5, 2, CLOCK[3]); g.rect(7, 0, 2, 2, BRASSY[1]);
  g.rect(3, 4, 10, 10, BRASSY[0]);
  for (let y = -4; y <= 4; y++) for (let x = -4; x <= 4; x++) if (x * x + y * y <= 17) g.set(8 + x, 9 + y, '#f0ead6');
  for (const [dx, dy] of [[0, -4], [4, 0], [0, 4], [-4, 0]]) g.set(8 + dx, 9 + dy, '#6a5a44');
  // Ten to four: the long hand up and to the left, the short one nearly at the four.
  g.line(8, 9, 5, 7, '#14100c'); g.line(8, 9, 10, 10, '#14100c');
  g.rect(1, 14, 14, 1, CLOCK[1]);
  edge(g);
  return g.rows();
}

// A raised bed of cabbages and beans, the flood over the earth and the leaves on top.
function sunkBed() {
  const g = new Grid(36, 18);
  g.rect(2, 9, 32, 8, WOOD[1]); g.rect(2, 9, 32, 1, WOOD[3]);
  for (let i = 0; i < 6; i++) {
    const cx = 5 + i * 5 + (i % 2), cy = 8 + (i % 2);
    g.rect(cx - 2, cy - 1, 5, 3, WEED[1]); g.rect(cx - 1, cy - 2, 3, 1, WEED[2]); g.set(cx, cy, '#86b070'); g.set(cx - 1, cy - 1, '#86b070');
  }
  // Bean poles, leaning.
  g.line(30, 0, 31, 10, WOOD[2]); g.line(33, 1, 31, 10, WOOD[2]); g.set(31, 3, WEED[1]); g.set(32, 5, WEED[2]); g.set(30, 6, WEED[1]);
  edge(g);
  waterline(g, 11, 0, 36);
  return g.rows();
}

// Weed and lily mats lying on the water (flat).
const LILY = ['#2c5a30', '#3e7a40', '#5a9a52', '#e8c8d8', '#f4e8a0', '#2c5a30c0'];
function lilyMat(w, h, seed) {
  const g = new Grid(w, h);
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  // Floating weed strands first, then pads with their notch.
  for (let i = 0; i < w / 2; i++) {
    const y = 2 + Math.floor(rnd() * (h - 4));
    const x = Math.floor(rnd() * (w - 6));
    for (let j = 0; j < 6; j++) g.set(x + j, y + Math.round(Math.sin(j) * 0.6), LILY[5]);
  }
  for (let i = 0; i < Math.max(3, Math.floor((w * h) / 70)); i++) {
    const cx = 3 + Math.floor(rnd() * (w - 6)), cy = 2 + Math.floor(rnd() * (h - 4));
    const r = rnd() < 0.4 ? 2 : 3;
    for (let dy = -r + 1; dy < r; dy++) for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy * 2 <= r * r + 1) g.set(cx + dx, cy + dy, dy < 0 ? LILY[2] : LILY[1]);
    g.set(cx + 1, cy - 1, null); g.set(cx + 2, cy - 1, null);
    g.set(cx - r, cy, LILY[0]); g.set(cx + r, cy, LILY[0]);
  }
  for (let i = 0; i < Math.max(1, Math.floor(w / 18)); i++) {
    const cx = 4 + Math.floor(rnd() * (w - 8)), cy = 2 + Math.floor(rnd() * (h - 4));
    g.set(cx - 1, cy, LILY[3]); g.set(cx + 1, cy, LILY[3]); g.set(cx, cy - 1, LILY[3]); g.set(cx, cy, LILY[4]);
  }
  return g.rows();
}

// The old lanes seen down through the water: the line of a wall, a path's edging, a bed,
// in darker green (flat, over water).
const UNDER = ['#0e2a2290', '#0a201ab0', '#5a9a8a50'];
function underShapes(w, h, seed) {
  const g = new Grid(w, h);
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  // A wall line that turns a corner, broken in places.
  const y0 = 4 + Math.floor(rnd() * 4), x1 = Math.floor(w * (0.4 + rnd() * 0.4));
  for (let x = 2; x < x1; x++) if ((x * 7) % 11 > 1) { g.set(x, y0, UNDER[1]); g.set(x, y0 + 1, UNDER[0]); g.set(x, y0 - 1, UNDER[2]); }
  for (let y = y0; y < h - 2; y++) if ((y * 5) % 9 > 1) { g.set(x1, y, UNDER[1]); g.set(x1 + 1, y, UNDER[0]); }
  // Paving stones of a path, loosely.
  for (let i = 0; i < w / 6; i++) {
    const x = 2 + Math.floor(rnd() * (x1 - 6)), y = y0 + 4 + Math.floor(rnd() * Math.max(1, h - y0 - 8));
    g.rect(x, y, 3 + Math.floor(rnd() * 2), 2, UNDER[0]);
  }
  // A drowned bush or two, round and dark.
  for (let i = 0; i < 2; i++) {
    const cx = x1 + 5 + Math.floor(rnd() * Math.max(1, w - x1 - 9)), cy = 4 + Math.floor(rnd() * (h - 8)), r = 3;
    for (let dy = -r; dy <= r; dy++) for (let dx = -r - 1; dx <= r + 1; dx++) if (dx * dx + dy * dy * 1.6 <= r * r + 2) g.set(cx + dx, cy + dy, UNDER[1]);
  }
  return g.rows();
}

// Weed fronds growing up off the bottom, swaying (over water, flat).
const KELP = ['#1e4a30', '#2e6a40', '#5a9a5a'];
function kelp(i) {
  const g = new Grid(16, 30);
  for (const [x0, len, ph] of [[5, 26, 0], [9, 20, 1.5], [12, 14, 3]]) {
    for (let j = 0; j < len; j++) {
      const y = 29 - j;
      const x = x0 + Math.round(Math.sin(j / 5 + i * 1.57 + ph) * (j / len) * 2.4);
      g.set(x, y, KELP[j % 5 === 0 ? 2 : (j / len) > 0.5 ? 1 : 0]);
      if (j / len < 0.75) g.set(x + 1, y, KELP[0]);
      if (j % 6 === 3) g.set(x + (j % 12 === 3 ? 1 : -1), y, KELP[2]);
    }
  }
  return g.rows();
}

// Light coming down through the water in slanting bands (flat, for the dry pocket's lake).
const SHAFT = ['#d8fff018', '#d8fff022', '#d8fff014', '#d8fff01c'];
function lightShafts() {
  const g = new Grid(80, 72);
  [[10, 6], [24, 10], [44, 5], [56, 8]].forEach(([x0, wdt], k) => {
    for (let y = 0; y < 72; y++) {
      const x = x0 + Math.round(y * 0.35);
      const fade = y < 8 ? 0.5 : y > 56 ? (72 - y) / 16 : 1;
      for (let i = 0; i < wdt; i++) if (fade > 0.6 || (i + y) % 2 === 0) g.set(x + i, y, SHAFT[k]);
    }
  });
  return g.rows();
}

// Moss, weed and lost cobbles over the old lane's paving, to break the grid (flat, walkable).
const MOSS = ['#2e4a2a', '#3e6234', '#5a7e44', '#1e2a24', '#5a8a80'];
function laneMoss(seed, w = 40, h = 22) {
  const g = new Grid(w, h);
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  // An uneven blob of moss, thicker at its middle.
  const cx = w / 2, cy = h / 2;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const d = ((x - cx) / (w / 2)) ** 2 + ((y - cy) / (h / 2)) ** 2 + (rnd() - 0.5) * 0.5;
    if (d < 0.35) g.set(x, y, MOSS[(x + y) % 3 === 0 ? 2 : 1]);
    else if (d < 0.8 && rnd() < 0.55) g.set(x, y, MOSS[(x * y) % 4 === 0 ? 1 : 0]);
  }
  // Two cobbles missing: dark mud holes with a wet glint.
  for (let i = 0; i < 2; i++) {
    const x = 6 + Math.floor(rnd() * (w - 14)), y = 4 + Math.floor(rnd() * (h - 9));
    g.rect(x, y, 5, 3, MOSS[3]); g.rect(x + 1, y - 1, 3, 1, MOSS[3]); g.set(x + 1, y + 1, MOSS[4]);
  }
  return g.rows();
}

// A run of picket fence half under the water, leaning, a paling or two gone.
const PALE = ['#8a8270', '#b0a890', '#5e584c'];
function sunkFence() {
  const g = new Grid(48, 24);
  for (let i = 0; i < 9; i++) {
    if (i === 3 || i === 6) continue;
    const x = 3 + i * 5, lean = Math.round(i * 0.4), top = 4 + (i % 3) + (i > 5 ? 3 : 0);
    g.line(x + lean, top, x, 23, PALE[1]); g.line(x + 1 + lean, top, x + 1, 23, PALE[0]); g.line(x + 2 + lean, top + 1, x + 2, 23, PALE[2]);
    g.set(x + 1 + lean, top - 1, PALE[1]);
  }
  for (let x = 2; x < 44; x++) { g.set(x, 11 + Math.round(x * 0.06), PALE[2]); if (x < 30) g.set(x, 16 + Math.round(x * 0.06), PALE[2]); }
  for (const x of [5, 14, 27, 40]) { g.set(x, 13, WEED[1]); g.set(x, 14, WEED[0]); }
  edge(g);
  waterline(g, 16, 0, 48);
  return g.rows();
}

// The light through the flood overhead, wobbling on the pocket's floor in a loose net
// (flat, walkable, animated: four frames that drift).
const CAUSTIC = ['#c8fff022', '#e0fff840'];
function caustics(i) {
  const w = 64, h = 48;
  const g = new Grid(w, h);
  const t = i * (Math.PI / 2);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    // Two crossing wave fields; where they nearly cancel, a bright thread.
    const a = Math.sin(x / 5.2 + Math.sin(y / 7 + t) * 1.4 + t * 0.5);
    const b = Math.sin(y / 4.6 + Math.sin(x / 6 - t) * 1.3 - t * 0.5);
    const v = Math.abs(a + b);
    // Fade out round the edge, so it has no box.
    const fx = Math.min(x, w - 1 - x) / 10, fy = Math.min(y, h - 1 - y) / 8;
    const fade = Math.min(1, fx, fy);
    if (v < 0.34 && ((x * 7 + y * 3) % 10) / 10 < fade) g.set(x, y, v < 0.12 ? CAUSTIC[1] : CAUSTIC[0]);
  }
  return g.rows();
}

// The pocket's skin from inside: a pale crescent of light up the top-left of the dome, as on
// a glass ball, and a few running drops (flat, laid over the rim).
const GLINT = ['#e8fff860', '#ffffff90', '#bfeee440'];
function domeGlint() {
  const w = 176, h = 160;
  const g = new Grid(w, h);
  const cx = w / 2, cy = h / 2;
  for (let i = 0; i < 900; i++) {
    const a = Math.PI * (1.05 + (i / 900) * 0.55);
    for (const [r, c] of [[78, GLINT[2]], [76, GLINT[0]], [74, GLINT[2]]]) {
      const ry = r * 0.9;
      g.set(cx + Math.cos(a) * r, cy + Math.sin(a) * ry, c);
    }
  }
  for (let i = 0; i < 300; i++) {
    const a = Math.PI * (1.2 + (i / 300) * 0.22);
    g.set(cx + Math.cos(a) * 72, cy + Math.sin(a) * 72 * 0.9, GLINT[1]);
  }
  // Drops running down the inside of the skin on the lit side.
  for (const [x, y, n] of [[30, 54, 4], [44, 30, 3], [70, 14, 5], [118, 12, 3], [146, 40, 4]]) for (let j = 0; j < n; j++) g.set(x, y + j, j === n - 1 ? GLINT[1] : GLINT[0]);
  return g.rows();
}

// Weed and a wet streak hanging down a culvert wall's face (flat, on the wall).
const STREAK = ['#1a2a2480', '#2a3a3460'];
function wallWeed(seed) {
  const g = new Grid(32, 16);
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let k = 0; k < 3; k++) {
    const x0 = 3 + Math.floor(rnd() * 26), len = 6 + Math.floor(rnd() * 9);
    for (let j = 0; j < len; j++) g.set(x0 + (j > len / 2 && k % 2 ? 1 : 0), j, j < 3 ? STREAK[0] : STREAK[1]);
  }
  for (let k = 0; k < 6; k++) {
    const x0 = 2 + Math.floor(rnd() * 28), len = 2 + Math.floor(rnd() * 7);
    for (let j = 0; j < len; j++) g.set(x0 + Math.round(Math.sin(j / 2 + k) * 0.6), j, WEED[(j + k) % 3]);
  }
  return g.rows();
}

// Headstones in the churchyard: a round-topped one and a cross, both leaning a little,
// lichen on their shoulders and grass round their feet.
const GRASS = ['#2e4a2a', '#4a6e3a'];
function headstone(kind) {
  const g = new Grid(16, 22);
  if (kind === 'round') {
    for (let y = 6; y < 20; y++) for (let x = 4; x < 12; x++) {
      const lean = Math.round((20 - y) * 0.12);
      if (y < 9 && (x - 8) ** 2 + (y - 9) ** 2 * 1.4 > 16) continue;
      g.set(x + lean, y, x === 4 ? STONE[3] : x === 11 ? STONE[1] : STONE[2]);
    }
    g.rect(6, 11, 4, 1, STONE[1]); g.rect(6, 13, 4, 1, STONE[1]); g.rect(7, 15, 2, 1, STONE[1]);
    g.set(6, 7, '#8a9a60'); g.set(7, 6, '#8a9a60'); g.set(10, 8, '#6a7a50');
  } else {
    const lean = (y) => Math.round((20 - y) * -0.15);
    for (let y = 4; y < 20; y++) { g.set(7 + lean(y), y, STONE[3]); g.set(8 + lean(y), y, STONE[2]); g.set(9 + lean(y), y, STONE[1]); }
    for (let x = 4; x < 13; x++) { g.set(x + lean(8), 8, STONE[3]); g.set(x + lean(9), 9, STONE[1]); }
    g.set(8, 5, '#8a9a60'); g.set(5, 8, '#8a9a60');
  }
  edge(g);
  // Grass round the foot, over the outline.
  for (let x = 2; x < 14; x++) if ((x * 5) % 3) { g.set(x, 20, GRASS[x % 2]); if (x % 3 === 0) g.set(x, 19, GRASS[1]); }
  return g.rows();
}

// The flood standing up round the pocket: along its north half you see the inside face of
// the water from below, a curved wall of green glass rising off the floor's edge, lit low down
// by the lantern and darkening up into the deep, with streaks running down it and a bright
// skin along the top where it bends over into the dome (flat; same footprint as ln_pocket_rim,
// laid at the same spot).
const FACE = ['#1a4a40c8', '#24605298', '#3a8070a8', '#5aa290b0', '#9ad8c8c0', '#d8fff0d0'];
function domeWall() {
  const w = 176, h = 176;
  const g = new Grid(w, h);
  const cx = w / 2, cy = 96, rx = 84, ry = 76;
  for (let x = 2; x < w - 2; x++) {
    const dx = (x - cx) / rx;
    if (Math.abs(dx) >= 1) continue;
    const ye = cy - ry * Math.sqrt(1 - dx * dx);
    // Only along the top: the face fades out toward the culverts at the sides.
    const tall = Math.round(18 * Math.pow(1 - dx * dx, 0.8));
    if (tall < 2) continue;
    const y1 = Math.round(ye);
    for (let k = 0; k <= tall; k++) {
      const y = y1 - k;
      const f = k / tall;
      let c = f < 0.18 ? FACE[3] : f < 0.45 ? FACE[2] : f < 0.8 ? FACE[1] : FACE[0];
      // Streaks running down the glass.
      if ((x * 7) % 13 === 0 && f > 0.15 && f < 0.85) c = FACE[3];
      if ((x * 11) % 17 === 0 && f > 0.3) c = FACE[0];
      g.set(x, y, c);
    }
    // The bright skin where it bends over into the dome, and the lit foot.
    g.set(x, y1 - tall, (x % 5) ? FACE[4] : FACE[5]);
    g.set(x, y1 + 1, FACE[4]);
  }
  // A fish nosing at the outside, and bubbles caught on the glass.
  for (const [x, y] of [[54, 34], [55, 34], [56, 33], [56, 35], [57, 34], [58, 34], [59, 33], [59, 35]]) g.set(x, y, FACE[0]);
  for (const [x, y] of [[96, 10], [120, 18], [70, 16], [134, 30]]) { g.set(x, y, FACE[5]); g.set(x + 1, y + 1, FACE[4]); }
  return g.rows();
}

// The flooded cottage's stair (secret_lanes_kitchen): the top flight, hanging off the landing
// where the lower steps have gone, 2 tiles wide and 2 high, laid flat over the board wall under
// the landing (its top is at the landing's edge, where the rope's ring is). Four treads left,
// the stringers splintered off short and nothing under them.
const IRONS = ['#161a22', '#3e4852', '#7c8c9a'];
function stairStub() {
  const g = new Grid(32, 32);
  for (let x = 8; x < 32; x++) {
    const k = Math.floor((x - 8) / 6);
    const top = 25 - 6 * k;
    const jag = (x * 5) % 7 === 0 ? 1 : 0;
    // The stringer under the treads, a darker board with a pale top edge.
    for (let y = top + 6; y < top + 11 - jag; y++) g.set(x, y, y === top + 6 ? POST[2] : y < top + 9 ? POST[1] : POST[0]);
  }
  for (let k = 0; k < 4; k++) {
    const x0 = 8 + 6 * k, top = 25 - 6 * k;
    g.rect(x0, top, 32 - x0, 3, POST[3]);
    g.rect(x0, top, 32 - x0, 1, '#b49c78');
    g.rect(x0, top + 3, 32 - x0, 1, POST[0]);
    g.rect(x0, top + 4, 2, 2, POST[1]);
    for (let x = x0 + 4; x < 32; x += 7) g.set(x, top + 1, POST[1]);
  }
  // The newel post at the top, and its iron band.
  g.rect(28, 0, 4, 12, POST[2]); g.rect(28, 0, 1, 12, POST[3]); g.rect(31, 0, 1, 12, POST[0]);
  g.rect(28, 5, 4, 2, IRONS[1]); g.rect(28, 5, 4, 1, IRONS[2]);
  // Splinters hanging from the broken end, one nail left in a stringer.
  g.set(9, 31, POST[0]); g.set(10, 30, POST[0]); g.set(8, 29, POST[1]); g.set(12, 29, IRONS[2]);
  edge(g);
  return g.rows();
}


// --- Registry ----------------------------------------------------------
export const LN_PROP_SPRITES = {
  ln_pocket_rim: pocketRim(),
  ln_bubbles: bubbles(0),
  ln_fish: fish(0),
  ln_stair: stair(),
  ln_signpost: signpost(),
  ln_sunk_wall: sunkWall(48, true),
  ln_sunk_wall_short: sunkWall(32, false),
  ln_sunk_cart: sunkCart(),
  ln_sunk_door: sunkDoor(),
  ln_sunk_door_shut: sunkDoor(true),
  ln_parlour_window: parlourWindow(),
  ln_parlour_clock: parlourClock(0),
  ln_sunk_bed: sunkBed(),
  ln_sunk_fence: sunkFence(),
  ln_lily_mat: lilyMat(40, 18, 7),
  ln_lily_mat_b: lilyMat(30, 14, 31),
  ln_lily_small: lilyMat(16, 10, 5),
  ln_under_a: underShapes(80, 40, 11),
  ln_under_b: underShapes(64, 48, 23),
  ln_kelp: kelp(0),
  ln_light_shafts: lightShafts(),
  ln_moss_a: laneMoss(3),
  ln_moss_b: laneMoss(17, 32, 18),
  ln_caustics: caustics(0),
  ln_dome_glint: domeGlint(),
  ln_wall_weed: wallWeed(5),
  ln_wall_weed_b: wallWeed(41),
  ln_headstone: headstone('round'),
  ln_headstone_cross: headstone('cross'),
  ln_dome_wall: domeWall(),
  ln_stair_stub: stairStub(),
};

export const LN_PALETTE = palette;
export const LN_PALETTE_EXTRA = palette;
export const LN_BUBBLES_SPRITES = frames((i) => bubbles(i), 8);
export const LN_FISH_SPRITES = frames((i) => fish(i), 4);
export const LN_KELP_SPRITES = frames((i) => kelp(i), 4);
export const LN_CAUSTICS_SPRITES = frames((i) => caustics(i), 4);
export const LN_PARLOUR_CLOCK_SPRITES = frames((i) => parlourClock(i), 4);

// How many tiles wide each big one stands.
export const LN_FOOTPRINTS = {
  ln_pocket_rim: 11,
  ln_stair: 8,
  ln_sunk_wall: 3,
  ln_sunk_wall_short: 2,
  ln_sunk_cart: 2,
  ln_sunk_door: 2,
  ln_sunk_door_shut: 2,
  ln_parlour_window: 2,
  ln_sunk_bed: 2,
  ln_sunk_fence: 3,
  ln_lily_mat: 2,
  ln_lily_mat_b: 2,
  ln_under_a: 5,
  ln_under_b: 4,
  ln_light_shafts: 5,
  ln_moss_a: 2,
  ln_moss_b: 2,
  ln_caustics: 4,
  ln_dome_glint: 11,
  ln_dome_wall: 11,
  ln_wall_weed: 2,
  ln_wall_weed_b: 2,
  ln_stair_stub: 2,
};
