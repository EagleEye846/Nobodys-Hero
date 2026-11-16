import { TILE_SIZE as T } from '../config.js';
import { glowSprite } from './lamplight.js';

// THE LAST LIGHT, UP CLOSE: the tower as it stands over reach_foot. Everywhere
// else it's the little silhouette on the skyline (drawLastLight in
// atmosphere.js); here it is the real thing. A room asks for it with
//
//   lastLightNear: { x, y }    x: the tile the door is centred on,
//                              y: the last row of the tower (its foot is that
//                                 row's bottom edge)
//
// It is painted once, pixel by pixel, into a canvas: wet black rock round its
// foot with rings for the chains, a tapering black stone shaft (its courses
// caught by the green storm light on the left), iron bands, chains down to the
// rings, a heavy door, and at the top the gallery, the shuttered lantern and a
// crown of iron spikes and broken spars. On top of that, every frame: water
// running down the stone, foam where the rock meets the sea, the one pale green
// slit (flickering), and the whole thing going black against the lightning.
// The body is drawn under the people and props (they all stand in front of it);
// the slit's glow and the lightning go over everything.

const CW = 264;
const CH = 304;
// The tower's centre and foot inside the canvas.
const OX = 132;
const FOOT = 296;
// The shaft runs from the foot up to the corbels under the gallery.
const SHAFT_TOP = 96;
const hw = (y) => Math.round(29 + 21 * Math.pow(Math.max(0, y - SHAFT_TOP) / (FOOT - SHAFT_TOP), 1.35));

// The colours. Stone and rock from black to the green the storm puts on them.
const STONE = ['#010303', '#040a0a', '#071211', '#0d1e1b', '#18352c', '#2b5a47', '#56977b'];
const ROCK = ['#010202', '#030707', '#060d0c', '#0b1715', '#172b24', '#28473a', '#6fa58e'];
const C = {
  iron: '#0f1513', ironMid: '#1c2624', ironHi: '#3c4d48', rust: '#2c1d14', rustHi: '#4d321f',
  wood: '#120d0a', woodMid: '#1d1610', woodHi: '#2e241a',
  glass: '#071412', slitDim: '#3c6e58',
  barnacle: '#46564f', weed: '#10251a', weedHi: '#22422c',
};

function hash(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}
const hash2 = (x, y, k = 0) => hash(x * 17.13 + y * 91.7 + k * 3.31);

function parse(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// A little pixel buffer: everything is painted into it in order, then put once.
class Pixels {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.data = new Uint8ClampedArray(w * h * 4);
    this.cache = new Map();
  }
  set(x, y, hex) {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    let rgb = this.cache.get(hex);
    if (!rgb) this.cache.set(hex, (rgb = parse(hex)));
    const i = (y * this.w + x) * 4;
    this.data[i] = rgb[0];
    this.data[i + 1] = rgb[1];
    this.data[i + 2] = rgb[2];
    this.data[i + 3] = 255;
  }
  has(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return false;
    return this.data[(y * this.w + x) * 4 + 3] > 0;
  }
  rect(x, y, w, h, hex) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, hex);
  }
  // A straight line, `thick` pixels across (Bresenham, stamped).
  line(x0, y0, x1, y1, hex, thick = 1) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.rect(x0, y0, thick, thick, hex);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }
  toCanvas() {
    const canvas = Object.assign(document.createElement('canvas'), { width: this.w, height: this.h });
    canvas.getContext('2d').putImageData(new ImageData(this.data, this.w, this.h), 0, 0);
    return canvas;
  }
}

// --- The rock it stands on ---------------------------------------------------

// The top of the rock at canvas column x (it covers the plinth tiles whole).
function rockTop(x) {
  const lump = 3 * Math.sin(x * 0.21) + 2 * Math.sin(x * 0.53 + 1) + Math.round(hash(x * 0.37) * 1.5);
  if (x < 34 || x > 230) return null;
  if (x < 56) return Math.round(296 - (x - 34) * (70 / 22) + lump * 0.6);
  if (x > 208) return Math.round(226 + (x - 208) * (70 / 22) + lump * 0.6);
  return Math.round(222 + lump);
}

function paintRock(px) {
  // Big wet boulders: each pixel belongs to the nearest stone; each stone's upper-left
  // rim catches the green light and shines wet, its lower-right rim falls into black.
  const stones = [];
  for (let i = 0; i < 30; i++) stones.push([34 + hash(i * 3.1) * 196, 212 + hash(i * 7.7) * 88, 0.8 + hash(i * 1.9) * 0.5]);
  for (let x = 30; x < 236; x++) {
    const top = rockTop(x);
    if (top == null) continue;
    for (let y = top; y < FOOT; y++) {
      let best = 1e9, second = 1e9, bi = 0;
      stones.forEach(([sx, sy, k], i) => {
        const d = Math.hypot((x - sx) * k, (y - sy) * 1.25);
        if (d < best) { second = best; best = d; bi = i; } else if (d < second) second = d;
      });
      const [sx, sy] = stones[bi];
      const rim = second - best;
      const upperLeft = (x - sx) + (y - sy) * 1.3 < 0;
      let lv;
      if (rim < 1.1) lv = 0; // the cracks between stones
      else if (rim < 3.2) lv = upperLeft ? 4 : 1;
      else lv = upperLeft && rim < 6 ? 3 : 2;
      if (y - top < 1) lv = 5; // the wet lip along the top
      else if (y - top < 3) lv = Math.max(lv, 3);
      if (y > 288) lv = Math.max(0, lv - 1);
      let col = ROCK[lv];
      // Wet glints on the lit rims, barnacles and weed low down.
      if (lv >= 4 && hash2(x, y, 1) < 0.12) col = ROCK[6];
      else if (y > 276 && lv > 0 && lv < 4 && hash2(x, y, 2) < 0.04) col = C.barnacle;
      else if (y > 286 && lv > 0 && hash2(x >> 1, y >> 2, 3) < 0.35) col = (x + y) % 3 ? C.weed : C.weedHi;
      px.set(x, y, col);
    }
  }
}

// An iron ring set in the rock on a staple, for a chain.
function ring(px, x, y) {
  px.rect(x - 1, y + 3, 3, 2, C.iron);
  px.set(x, y + 3, C.ironHi);
  for (const [dx, dy] of [[-2, -1], [-2, 0], [-2, 1], [2, -1], [2, 0], [2, 1], [-1, -2], [0, -2], [1, -2], [-1, 2], [0, 2], [1, 2]]) px.set(x + dx, y + dy, C.iron);
  px.set(x - 2, y - 1, C.ironHi);
  px.set(x - 1, y - 2, C.ironHi);
  px.set(x + 2, y + 1, C.rust);
}

// A chain from (x0,y0) to (x1,y1), sagging: links on and off edge, rust on the dark side.
function chain(px, x0, y0, x1, y1, sag) {
  const len = Math.hypot(x1 - x0, y1 - y0);
  const steps = Math.ceil(len / 1.5);
  let last = null;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(x0 + (x1 - x0) * t);
    const y = Math.round(y0 + (y1 - y0) * t + sag * 4 * t * (1 - t));
    if (last && last[0] === x && last[1] === y) continue;
    last = [x, y];
    const link = Math.floor(i / 2) % 2;
    if (link) {
      px.set(x, y, C.ironMid);
      px.set(x, y - 1, C.ironHi);
    } else {
      px.set(x, y, C.iron);
      px.set(x - 1, y, C.iron);
      px.set(x, y + 1, hash(i + x0) < 0.4 ? C.rust : C.iron);
    }
  }
}

// --- The tower ---------------------------------------------------------------

// How bright the round stone is at this pixel (0 to 6), lit from the upper left.
function stoneLevel(x, y, h) {
  const s = (x - OX) / h;
  if (s < -0.93) return 5;
  if (s > 0.95) return 3; // a little light thrown back on the far edge
  const theta = Math.asin(Math.max(-1, Math.min(1, s)));
  const b = Math.cos(theta + 0.95);
  const d = ((x + y) & 1) ? 0.03 : -0.03; // dither the edges between tones
  if (b + d > 0.85) return 4;
  if (b + d > 0.5) return 3;
  if (b + d > 0.12) return 2;
  return 1;
}

const BANDS = [256, 206, 158, 116];

function paintShaft(px) {
  for (let y = SHAFT_TOP; y < FOOT; y++) {
    const plinth = y >= 280;
    const h = hw(y) + (plinth ? (y === 280 ? 3 : 5) : 0);
    const course = plinth ? 8 : 7;
    const r = (FOOT - 1 - y) % course;
    const k = Math.floor((FOOT - 1 - y) / course);
    for (let x = OX - h; x <= OX + h; x++) {
      let lv = stoneLevel(x, y, h);
      const s = (x - OX) / h;
      const theta = Math.asin(Math.max(-1, Math.min(1, s)));
      const theta2 = Math.asin(Math.max(-1, Math.min(1, (x + 1 - OX) / h)));
      const width = plinth ? 0.56 : 0.4;
      const off = (k % 2) * width * 0.5;
      const block = Math.floor((theta + 2 + off) / width);
      const joint = block !== Math.floor((theta2 + 2 + off) / width);
      // Each stone a touch different; some dark with wet, a few gone.
      const bh = hash2(block, k, 5);
      if (bh < 0.18) lv -= 1;
      else if (bh > 0.9 && s < 0.2) lv += 1;
      if (r === course - 1) lv -= 2; // the mortar line
      else if (r === course - 2 && s < 0.1) lv += s < -0.45 ? 2 : 1; // the course's top edge catches the light
      if (joint && r !== course - 1) lv -= 2;
      if (bh > 0.985 && !plinth) lv = 0; // a fallen-out stone
      lv = Math.max(0, Math.min(6, lv));
      let col = STONE[lv];
      if (lv >= 3 && s < 0 && hash2(x, y, 6) < 0.012) col = STONE[6];
      px.set(x, y, col);
    }
  }
  // Long dark wet runs down the stone, and rust bleeding under the bands.
  for (let i = 0; i < 30; i++) {
    const y0 = BANDS[i % BANDS.length] + 4;
    const x = OX + Math.round((hash(i * 4.3) * 2 - 1) * (hw(y0) - 3));
    const len = 8 + Math.round(hash(i * 2.9) * 26);
    const rusty = i % 3 === 0;
    for (let j = 0; j < len; j++) {
      const y = y0 + j;
      if (y >= 280 || !px.has(x, y)) break;
      if (j > len * 0.7 && (j & 1)) continue;
      px.set(x, y, rusty && j < len * 0.6 ? C.rust : STONE[1]);
    }
  }
  // A long crack down the right side of the shaft.
  let cx = OX + 12;
  for (let y = 150; y < 238; y++) {
    if (hash(y * 0.7) < 0.3) cx += hash(y * 1.3) < 0.5 ? -1 : 1;
    px.set(cx, y, STONE[0]);
    if (hash(y * 2.1) < 0.4) px.set(cx + 1, y, STONE[0]);
  }
  // The iron bands, riveted, with eye bolts on the outer two for the chains.
  for (const by of BANDS) {
    const h = hw(by) + 2;
    for (let x = OX - h; x <= OX + h; x++) {
      const s = (x - OX) / h;
      px.set(x, by, s < -0.2 ? C.ironHi : C.ironMid);
      px.set(x, by + 1, s < -0.5 ? C.ironMid : C.iron);
      px.set(x, by + 2, C.iron);
      px.set(x, by + 3, STONE[0]);
      const theta = Math.asin(Math.max(-1, Math.min(1, s)));
      if (Math.floor(theta / 0.3) !== Math.floor(Math.asin(Math.max(-1, Math.min(1, (x + 1 - OX) / h))) / 0.3)) px.set(x, by + 1, s < 0.3 ? C.ironHi : C.ironMid);
      if (hash2(x, by, 7) < 0.15) px.set(x, by + 2, C.rust);
    }
  }
}

// The eye bolt on a band's edge, where a chain is made fast.
function eyeBolt(px, x, y, side) {
  px.set(x, y, C.ironMid);
  px.set(x + side, y, C.ironHi);
  px.set(x + side * 2, y - 1, C.iron);
  px.set(x + side * 2, y + 1, C.iron);
  px.set(x + side * 3, y, C.iron);
}

function paintDoor(px) {
  const L = OX - 20, R = OX + 19, top = 262, crown = 242;
  const inArch = (x, y, grow) => {
    if (x < L - grow || x > R + grow || y >= FOOT) return false;
    if (y >= top) return true;
    const dx = x - (L + R) / 2;
    const rr = (R - L) / 2 + grow;
    return y >= top - Math.sqrt(Math.max(0, rr * rr - dx * dx)) * ((top - crown) / ((R - L) / 2));
  };
  // The frame: a ring of big dressed stones round the arch.
  for (let y = crown - 8; y < FOOT; y++) {
    for (let x = L - 7; x <= R + 7; x++) {
      if (!inArch(x, y, 6) || inArch(x, y, 0)) continue;
      const a = Math.atan2(y - top, x - (L + R) / 2);
      const stone = y >= top ? Math.floor((FOOT - y) / 9) : Math.floor((a + Math.PI) / 0.32);
      const edge = y >= top ? (FOOT - y) % 9 === 0 : Math.floor((a + Math.PI) / 0.32) !== Math.floor((Math.atan2(y - top, x + 1 - (L + R) / 2) + Math.PI) / 0.32);
      let lv = x < OX ? 4 : 2;
      if (!inArch(x, y, 5)) lv += 1; // the outer edge catches the light
      if (inArch(x, y, 1)) lv = 1; // the inner edge, in shadow
      if (edge) lv = 0;
      if (hash(stone * 3.7 + (x < OX ? 0 : 50)) < 0.25) lv -= 1;
      px.set(x, y, STONE[Math.max(0, Math.min(6, lv))]);
    }
  }
  // The keystone, with an old worn lantern cut in it.
  px.rect(OX - 4, crown - 9, 8, 10, STONE[3]);
  px.rect(OX - 4, crown - 9, 8, 1, STONE[5]);
  px.rect(OX - 4, crown - 9, 1, 10, STONE[4]);
  px.rect(OX + 3, crown - 8, 1, 9, STONE[1]);
  px.rect(OX - 1, crown - 7, 2, 1, STONE[1]);
  px.rect(OX - 2, crown - 6, 4, 4, STONE[1]);
  px.set(OX - 1, crown - 5, STONE[2]);
  px.rect(OX - 2, crown - 2, 4, 1, STONE[1]);
  // The door itself: two heavy leaves of black planks, strapped and studded.
  for (let y = crown; y < FOOT; y++) {
    for (let x = L; x <= R; x++) {
      if (!inArch(x, y, 0)) continue;
      if (!inArch(x, y, -2)) { px.set(x, y, STONE[0]); continue; }
      const plank = Math.floor((x - L) / 5);
      let col = (x - L) % 5 === 0 ? STONE[0] : (x - L) % 5 === 1 ? C.woodHi : hash2(plank, y >> 3, 8) < 0.3 ? C.woodMid : C.wood;
      if (x === OX || x === OX - 1) col = STONE[0];
      px.set(x, y, col);
    }
  }
  for (const sy of [256, 270, 285]) {
    for (let x = L + 2; x <= R - 2; x++) {
      if (x === OX || x === OX - 1 || !inArch(x, sy, -2)) continue;
      px.set(x, sy, C.ironHi);
      px.set(x, sy + 1, C.iron);
      px.set(x, sy + 2, hash(x * 1.7 + sy) < 0.3 ? C.rust : C.iron);
      if ((x - L) % 6 === 3) px.set(x, sy + 1, C.ironHi);
    }
  }
  // A ring on each leaf.
  for (const rx of [OX - 6, OX + 5]) {
    px.set(rx, 275, C.ironHi);
    for (const [dx, dy] of [[-1, 1], [1, 1], [-1, 2], [1, 2], [0, 3]]) px.set(rx + dx, 275 + dy, dx < 0 ? C.ironHi : C.iron);
  }
  // A worn step at the threshold.
  px.rect(L - 2, FOOT - 2, R - L + 5, 2, STONE[3]);
  px.rect(L - 2, FOOT - 2, R - L + 5, 1, STONE[4]);
}

function paintTop(px) {
  // The corbels under the gallery: three steps out, with dark slots between the brackets.
  for (let y = 84; y < SHAFT_TOP; y++) {
    const step = y < 88 ? 37 : y < 92 ? 34 : 31;
    for (let x = OX - step; x <= OX + step; x++) {
      let lv = stoneLevel(x, y, step);
      if (y === 87 || y === 91 || y === 95) lv = 0;
      if (y >= 88 && (x - OX + 60) % 6 === 0) lv = 0;
      px.set(x, y, STONE[Math.max(0, lv)]);
    }
  }
  // The lantern room, behind the rail: an iron frame, every pane shuttered or smashed
  // but the one slit.
  for (let y = 40; y < 80; y++) {
    for (let x = OX - 21; x <= OX + 21; x++) {
      const pane = Math.floor((x - OX + 21) / 7);
      const mullion = (x - OX + 21) % 7 === 0 || y === 40 || y === 58 || y === 79;
      let col;
      if (mullion) col = x < OX - 10 ? C.ironHi : C.ironMid;
      else if (hash2(pane, y < 58 ? 0 : 1, 9) < 0.3) col = (x + y) % 5 === 0 ? STONE[2] : STONE[0]; // smashed: dark inside
      else col = (y + pane) % 4 === 0 ? C.woodMid : C.wood; // boarded up
      px.set(x, y, col);
    }
  }
  // The slit: a gap between two boards, where the green comes through.
  px.rect(OX - 1, 46, 2, 26, STONE[0]);
  px.rect(OX - 1, 48, 1, 22, C.slitDim);
  // The cornice and the dome, and the vent ball and a bent spike on top.
  for (let y = 34; y < 40; y++) for (let x = OX - 25; x <= OX + 25; x++) px.set(x, y, y === 34 ? (x < OX ? C.ironHi : C.ironMid) : y === 39 ? STONE[0] : C.iron);
  for (let y = 20; y < 34; y++) {
    const w = Math.round(22 * Math.sqrt(Math.max(0, 1 - ((34 - y) / 15) ** 2)));
    for (let x = OX - w; x <= OX + w; x++) {
      const s = (x - OX) / Math.max(1, w);
      let col = s < -0.7 ? C.ironHi : s < -0.2 ? C.ironMid : C.iron;
      if ((x - OX + 40) % 6 === 0) col = STONE[0]; // the ribs of the dome
      px.set(x, y, col);
    }
  }
  px.rect(OX - 2, 15, 5, 5, C.iron);
  px.rect(OX - 2, 15, 2, 2, C.ironHi);
  px.line(OX, 15, OX, 4, C.iron);
  px.line(OX, 4, OX + 3, 1, C.iron);
  px.set(OX - 1, 9, C.iron);
  // The crown: iron spikes out of the cornice and the gallery, leaning outward, barbed.
  const spike = (x, y, ang, len, thick) => {
    const ex = x + Math.sin(ang) * len;
    const ey = y - Math.cos(ang) * len;
    px.line(x, y, x + (ex - x) * 0.55, y + (ey - y) * 0.55, C.iron, thick);
    px.line(x + (ex - x) * 0.55, y + (ey - y) * 0.55, ex, ey, C.iron, 1);
    // a barb part way up, and the light along the lit side
    const bx = x + (ex - x) * 0.7, by = y + (ey - y) * 0.7;
    px.line(bx, by, bx + Math.sign(ang || 1) * 3, by + 1, C.iron);
    if (ang < 0) px.line(x - 1, y, x + (ex - x) * 0.5 - 1, y + (ey - y) * 0.5, C.ironHi);
  };
  for (const [dx, ang, len] of [[-23, -0.5, 26], [-15, -0.25, 30], [-7, -0.08, 22], [6, 0.1, 27], [14, 0.28, 32], [22, 0.55, 22]]) spike(OX + dx, 34, ang, len, 2);
  for (const [dx, ang, len] of [[-41, -0.75, 34], [-33, -0.45, 46], [33, 0.48, 40], [41, 0.82, 30]]) spike(OX + dx, 72, ang, len, 2);
  // Broken spars, old timbers sticking out of the gallery: one jutting up-left and splintered,
  // one snapped and hanging down on the right, and a stub with a chain hung from its end.
  const spar = (x0, y0, x1, y1) => {
    px.line(x0, y0, x1, y1, C.woodMid, 3);
    px.line(x0, y0, x1, y1, C.woodHi, 1);
    px.line(x1, y1, x1 + Math.sign(x1 - x0) * 3, y1 - 4, C.woodMid);
    px.line(x1 + 1, y1 + 1, x1 + Math.sign(x1 - x0) * 5, y1 - 1, C.woodMid);
  };
  spar(OX - 38, 78, OX - 76, 40);
  px.line(OX - 64, 52, OX - 58, 60, C.woodMid, 2); // a crosspiece, half gone
  spar(OX + 36, 80, OX + 74, 100);
  spar(OX + 30, 64, OX + 58, 46);
  // The chain hanging from the up-left spar's end, on a hook, broken off.
  px.line(OX - 73, 43, OX - 73, 46, C.ironHi);
  chain(px, OX - 73, 46, OX - 73, 70, 0);
  // The gallery: a slab on the corbels and a rail round it, a stretch of the rail torn
  // and hanging.
  for (let x = OX - 43; x <= OX + 43; x++) {
    px.set(x, 79, x < OX ? STONE[5] : STONE[3]);
    px.rect(x, 80, 1, 3, STONE[(x < OX - 20) ? 3 : 2]);
    px.set(x, 83, STONE[0]);
  }
  for (let x = OX - 42; x <= OX + 42; x += 5) {
    const broken = x > OX + 14 && x < OX + 34;
    px.line(x, broken ? 74 + (x % 3) : 66, x, 78, x < OX ? C.ironHi : C.ironMid);
  }
  px.line(OX - 42, 66, OX + 14, 66, C.ironMid);
  px.line(OX - 42, 72, OX + 14, 72, C.iron);
  px.line(OX + 34, 66, OX + 42, 66, C.ironMid);
  px.line(OX + 14, 66, OX + 22, 84, C.ironMid); // torn and bent down
  px.line(OX + 14, 72, OX + 19, 82, C.iron);
}

function paintBody() {
  const px = new Pixels(CW, CH);
  paintRock(px);
  paintShaft(px);
  paintDoor(px);
  paintTop(px);
  // Chains from the eye bolts on the two middle bands down to rings in the rock.
  const eyeL = (by) => [OX - hw(by) - 2, by + 1];
  const eyeR = (by) => [OX + hw(by) + 2, by + 1];
  const anchors = [[eyeL(206), [78, 283], 6], [eyeL(158), [56, 287], 10], [eyeR(206), [186, 283], 6], [eyeR(158), [208, 287], 10]];
  for (const [[ex, ey], [rx, ry]] of anchors) ring(px, rx, ry);
  for (const [[ex, ey], [rx, ry], sag] of anchors) {
    eyeBolt(px, ex, ey, ex < OX ? -1 : 1);
    chain(px, ex + (ex < OX ? -3 : 3), ey, rx, ry - 2, sag);
  }
  // A couple of front boulders over the corners of the tower's plinth course.
  for (const [bx, by, w, h] of [[OX - 60, 285, 12, 11], [OX + 46, 286, 14, 10], [OX - 46, 290, 7, 6], [OX + 62, 289, 8, 7]]) {
    for (let y = by; y < Math.min(FOOT, by + h); y++) {
      for (let x = bx; x < bx + w; x++) {
        const u = (x - bx) / w - 0.5, v = (y - by) / h - 0.5;
        if (u * u + v * v > 0.25) continue;
        let lv = u < -0.1 && v < 0 ? 4 : v > 0.2 ? 1 : 2;
        if (v < -0.35) lv = 5;
        px.set(x, y, hash2(x, y, 4) < 0.07 && lv >= 3 ? ROCK[6] : ROCK[lv]);
      }
    }
  }
  return px;
}

// The cached pictures: the body, its black silhouette for the lightning, and
// which columns of each row are tower (for the water running down it).
let cache = null;
function art() {
  if (cache) return cache;
  const px = paintBody();
  const body = px.toCanvas();
  const shadow = Object.assign(document.createElement('canvas'), { width: CW, height: CH });
  const sctx = shadow.getContext('2d');
  sctx.drawImage(body, 0, 0);
  sctx.globalCompositeOperation = 'source-in';
  sctx.fillStyle = '#010404';
  sctx.fillRect(0, 0, CW, CH);
  // The water runs: fixed columns down the shaft, each a different length and speed.
  const runs = [];
  for (let i = 0; i < 34; i++) {
    const s = hash(i * 5.17) * 1.8 - 0.9;
    runs.push({ s, speed: 26 + hash(i * 3.3) * 30, phase: hash(i * 8.1) * 200, len: 5 + Math.round(hash(i * 2.2) * 9), top: SHAFT_TOP + 2 + Math.round(hash(i * 6.6) * 120) });
  }
  cache = { body, shadow, runs };
  return cache;
}

// Where the canvas sits in the room.
function place(spec) {
  return { left: spec.x * T + 8 - OX, top: (spec.y + 1) * T - FOOT };
}

// Under the people: the tower, and water running down it, and foam at the rock's edge.
export function drawLastLightNear(ctx, spec, camera, t) {
  const { body, runs } = art();
  const { left, top } = place(spec);
  const x0 = Math.round(left - camera.x);
  const y0 = Math.round(top - camera.y);
  if (x0 > 340 || x0 + CW < -20 || y0 > 260 || y0 + CH < -20) return;
  ctx.drawImage(body, x0, y0);
  // Rain water running down the stone, brighter on the lit side.
  for (const r of runs) {
    const span = 280 - r.top;
    const y = r.top + ((t * r.speed + r.phase) % span);
    const x = OX + Math.round(r.s * hw(y));
    if (Math.abs(x - OX) >= hw(y) - 1 || (y > 236 && Math.abs(x - OX) < 23)) continue;
    const a = r.s < -0.2 ? 0.34 : r.s < 0.4 ? 0.2 : 0.11;
    ctx.fillStyle = `rgba(170, 232, 206, ${a})`;
    ctx.fillRect(x0 + x, y0 + Math.round(y), 1, r.len);
    ctx.fillStyle = `rgba(210, 250, 232, ${(a * 1.3).toFixed(3)})`;
    ctx.fillRect(x0 + x, y0 + Math.round(y) + r.len, 1, 1);
  }
  // Drips off the gallery and the bands.
  for (let i = 0; i < 8; i++) {
    const from = i < 4 ? 84 : BANDS[i % BANDS.length] + 3;
    const life = (t * 0.8 + hash(i * 9.1) * 5) % 2.2;
    const fall = life * life * 90;
    const dx = Math.round((hash(i * 4.4) * 2 - 1) * (i < 4 ? 40 : hw(from) + 2));
    if (from + fall > (i < 4 ? 230 : 280) || (i >= 4 && Math.abs(dx) < hw(from + fall) + 1)) continue;
    ctx.fillStyle = 'rgba(190, 240, 220, 0.45)';
    ctx.fillRect(x0 + OX + dx, y0 + from + Math.round(fall), 1, 2);
  }
  // Foam where the rock goes into the sea on either side.
  for (let i = 0; i < 24; i++) {
    const side = i < 12 ? -1 : 1;
    const k = i % 12;
    const fx = side < 0 ? 52 + k * 2 : 244 - k * 2;
    const top = rockTop(fx);
    if (top == null) continue;
    const wave = 0.5 + 0.5 * Math.sin(t * 1.3 + k * 0.7 + (side > 0 ? 2 : 0));
    ctx.fillStyle = `rgba(214, 244, 232, ${(0.25 + 0.4 * wave).toFixed(3)})`;
    ctx.fillRect(x0 + fx - side * Math.round(wave * 2) - 1, y0 + top - 1 + (k % 2), 2, 1);
  }
}

// After the sea fog, before the rain: the tower is near, so the fog only half hides it.
export function drawLastLightNearVeil(ctx, spec, camera) {
  const { shadow } = art();
  const { left, top } = place(spec);
  const x0 = Math.round(left - camera.x);
  const y0 = Math.round(top - camera.y);
  if (x0 > 340 || x0 + CW < -20 || y0 > 260 || y0 + CH < -20) return;
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.drawImage(shadow, 0, 0, CW, 248, x0, y0, CW, 248);
  // (fading out down to where the people stand in front of it)
  for (let y = 248; y < 288; y += 4) {
    ctx.globalAlpha = 0.4 * (1 - (y - 248) / 40);
    ctx.drawImage(shadow, 0, y, CW, 4, x0, y0 + y, CW, 4);
  }
  ctx.restore();
}

// Over everything: the black shape against the lightning.
export function drawLastLightNearOver(ctx, spec, camera, t, flash) {
  const { shadow } = art();
  const { left, top } = place(spec);
  const x0 = Math.round(left - camera.x);
  const y0 = Math.round(top - camera.y);
  if (x0 > 340 || x0 + CW < -20 || y0 > 260 || y0 + CH < -20) return;
  // Black against the flash (not its foot, where the people stand in front of it).
  if (flash > 0.02) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, flash * 0.9);
    ctx.drawImage(shadow, 0, 0, CW, 270, x0, y0, CW, 270);
    ctx.restore();
  }
}

// Last of all (over a scene's green wash too): the slit, breathing.
export function drawLastLightNearSlit(ctx, spec, camera, t, flash) {
  const { left, top } = place(spec);
  const x0 = Math.round(left - camera.x);
  const y0 = Math.round(top - camera.y);
  if (x0 > 340 || x0 + CW < -20 || y0 + 80 < -20 || y0 + 40 > 260) return;
  // The slit: it breathes, and now and then it stutters nearly out.
  let f = 0.75 + 0.2 * Math.sin(t * 0.7) + 0.08 * Math.sin(t * 4.3 + 1.2) + 0.05 * Math.sin(t * 11.7);
  const tick = Math.floor(t * 7);
  if (hash(tick * 0.913) < 0.07) f *= 0.25;
  else if (hash(tick * 0.913) < 0.14) f *= 0.6;
  f = Math.max(0.05, Math.min(1, f)) * (1 - flash * 0.8);
  ctx.save();
  ctx.fillStyle = `rgba(206, 255, 224, ${f.toFixed(3)})`;
  ctx.fillRect(x0 + OX - 1, y0 + 47, 1, 18);
  ctx.fillStyle = `rgba(150, 240, 190, ${(f * 0.75).toFixed(3)})`;
  ctx.fillRect(x0 + OX, y0 + 48, 1, 16);
  ctx.globalCompositeOperation = 'lighter';
  ctx.imageSmoothingEnabled = true;
  ctx.globalAlpha = 0.8 * f;
  ctx.drawImage(glowSprite("110, 255, 170"), x0 + OX - 14, y0 + 38, 28, 36);
  ctx.globalAlpha = 0.35 * f;
  ctx.drawImage(glowSprite('110, 255, 170'), x0 + OX - 40, y0 + 30, 80, 70);
  ctx.restore();
}
