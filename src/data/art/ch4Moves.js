// Little performances for Chapter 4's scenes that the usual standing and
// walking frames can't do: Tuck waving, pointing and rubbing his wrists, and
// the glow-worms coming down onto Ves's umbrella in the Deep.
//
//   tuck_wave        Tuck's paw up, waving hello (4 frames; he bounces on his toes)
//   tuck_point       Tuck pointing out to our right and a little down (3 frames)
//   tuck_point_left  the same, out to our left
//   tuck_point_up    Tuck pointing up and out to our right (3 frames)
//   tuck_rub         Tuck rubbing his wrists where the strings were (4 frames)
//   worm_drift       glow-worms drifting down onto an umbrella and sitting
//                    there (6 frames; lay it over Ves, feet on her feet)
//
// Tuck's frames are his own (belowFolk.js) on a bigger canvas, with an arm
// drawn on: a tabard sleeve in red and a furry paw. They share his palette.

import { BF_TUCK_SPRITES, BF_PALETTE, bfChar } from './belowFolk.js';

class Grid {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.cells = Array.from({ length: h }, () => Array(w).fill('.'));
  }

  set(x, y, c) {
    x = Math.round(x);
    y = Math.round(y);
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.cells[y][x] = c;
  }

  get(x, y) {
    return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.cells[y][x] : '.';
  }

  paste(rows, ox, oy) {
    rows.forEach((row, y) => [...row].forEach((c, x) => { if (c !== '.') this.set(ox + x, oy + y, c); }));
  }

  // A line of `fill`, three pixels wide, with an outline round it (a stubby arm).
  thick(x0, y0, x1, y1, fill, edge) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    const pts = [];
    const wide = Math.abs(x1 - x0) >= Math.abs(y1 - y0);
    for (let i = 0; i <= steps; i++) {
      const x = Math.round(x0 + ((x1 - x0) * i) / steps);
      const y = Math.round(y0 + ((y1 - y0) * i) / steps);
      pts.push([x, y]);
      pts.push(wide ? [x, y + 1] : [x + 1, y]);
      pts.push(wide ? [x, y - 1] : [x - 1, y]);
    }
    for (const [x, y] of pts) for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]]) if (this.get(x + dx, y + dy) === '.') this.set(x + dx, y + dy, edge);
    for (const [x, y] of pts) this.set(x, y, fill);
  }

  // A round furry paw, 3 wide with its corners off, and an outline round it.
  paw(x, y, fur, edge) {
    const cells = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [0, 2], [2, 2], [0, 0], [2, 0]].filter(([i, j]) => !((i === 0 || i === 2) && j === 0));
    for (const [i, j] of cells) for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) if (this.get(x + i + dx, y + j + dy) === '.') this.set(x + i + dx, y + j + dy, edge);
    for (const [i, j] of cells) this.set(x + i, y + j, fur);
  }

  rows() {
    return this.cells.map((row) => row.join(''));
  }
}

// =====================================================================
// Tuck
// =====================================================================
const K = bfChar('k');
const SLEEVE = bfChar('r');
const SLEEVE_DK = bfChar('R');
const FUR = bfChar('F');
const FUR_DK = bfChar('f');
const GOLD = bfChar('g');
const PAD = bfChar('b');

const MARGIN_X = 6;
const MARGIN_Y = 5;
const TW = 14 + MARGIN_X * 2;
const TH = 16 + MARGIN_Y;
// The figure goes in at (MARGIN_X, MARGIN_Y); shoulders (canvas coordinates)
// are on the tabard's top corners: ours-left (his right) and ours-right.
const SHOULDER_L = [MARGIN_X + 2, MARGIN_Y + 11];
const SHOULDER_R = [MARGIN_X + 11, MARGIN_Y + 11];

const mirror = (rows) => rows.map((row) => [...row].reverse().join(''));

// Tuck's front view (or its mirror image: his tail on the other side), pasted
// on a bigger canvas, `lift` pixels up off the ground.
function tuckOn(base = BF_TUCK_SPRITES.a, { flip = false, lift = 0 } = {}) {
  const g = new Grid(TW, TH);
  g.paste(flip ? mirror(base) : base, MARGIN_X, MARGIN_Y - lift);
  return g;
}

// An arm from a shoulder to a paw at (px, py): a tabard sleeve with a dark
// underside, and the paw (cream pad towards the middle).
function arm(g, shoulder, px, py) {
  // Stop the sleeve a little short of the paw, which is 3 wide round (px, py).
  const len = Math.hypot(px - shoulder[0], py - shoulder[1]) || 1;
  const ex = shoulder[0] + ((px - shoulder[0]) * (len - 1.5)) / len;
  const ey = shoulder[1] + ((py - shoulder[1]) * (len - 1.5)) / len;
  g.thick(shoulder[0], shoulder[1], ex, ey, SLEEVE, K);
  // A shadow along the underside of the sleeve, and a gold cuff.
  const mx = Math.round((shoulder[0] + ex) / 2);
  const my = Math.round((shoulder[1] + ey) / 2);
  g.set(mx, my + 2 > my ? my + 1 : my, SLEEVE_DK);
  g.set(Math.round(ex), Math.round(ey), GOLD);
  g.paw(px - 1, py - 1, FUR, K);
  g.set(px, py, PAD);
}

function tuckWaveFrames() {
  const frames = {};
  // 0: the paw up beside his ear, leaning on one foot; 1: swung out wide; 2: back; 3: out again.
  const poses = [
    { lift: 0, paw: [MARGIN_X - 2, MARGIN_Y + 3] },
    { lift: 1, paw: [MARGIN_X - 4, MARGIN_Y + 6] },
    { lift: 0, paw: [MARGIN_X - 2, MARGIN_Y + 3] },
    { lift: 1, paw: [MARGIN_X - 4, MARGIN_Y + 6] },
  ];
  poses.forEach((pose, i) => {
    const g = tuckOn(i === 2 ? BF_TUCK_SPRITES.d : BF_TUCK_SPRITES.a, { lift: pose.lift });
    arm(g, [SHOULDER_L[0], SHOULDER_L[1] - pose.lift], pose.paw[0], pose.paw[1] - pose.lift);
    frames[`wave${i}`] = g.rows();
  });
  return frames;
}
export const TUCK_WAVE_SPRITES = tuckWaveFrames();

// Pointing: the figure turned round so the arm is on the free side. `way`:
// 'right' (the tail on our left, his arm out to our right) or 'left'.
function tuckPointFrames(way, aim) {
  const flip = way === 'right';
  const side = way === 'right' ? SHOULDER_R : SHOULDER_L;
  const sign = way === 'right' ? 1 : -1;
  // The paw's spot for each aim, from the shoulder: (out, down).
  const reach = aim === 'up' ? [[2, -4], [3, -7], [3, -7]] : [[3, 0], [4, 0], [4, 0]];
  const frames = {};
  reach.forEach(([out, down], i) => {
    const g = tuckOn(BF_TUCK_SPRITES.a, { flip, lift: i === 2 ? 1 : 0 });
    const lift = i === 2 ? 1 : 0;
    arm(g, [side[0], side[1] - lift], side[0] + sign * out, side[1] + down - lift);
    frames[`point${i}`] = g.rows();
  });
  return frames;
}
export const TUCK_POINT_SPRITES = tuckPointFrames('right', 'down');
export const TUCK_POINT_LEFT_SPRITES = tuckPointFrames('left', 'down');
export const TUCK_POINT_UP_SPRITES = tuckPointFrames('right', 'up');

// Rubbing his wrists: both paws crossed over his chest, sliding back and
// forth, his eyes squeezed shut (the blink frame) every other time.
function tuckRubFrames() {
  const frames = {};
  const spec = [
    [BF_TUCK_SPRITES.a, -1],
    [BF_TUCK_SPRITES.b, 1],
    [BF_TUCK_SPRITES.c, -1],
    [BF_TUCK_SPRITES.b, 1],
  ];
  spec.forEach(([base, shift], i) => {
    const g = tuckOn(base);
    const cx = MARGIN_X + 7;
    const y = MARGIN_Y + 11;
    // Two arms folded across the tabard, the near wrist held by the far paw.
    g.thick(cx - 4, y, cx + shift, y + 1, SLEEVE, K);
    g.thick(cx + 4, y, cx + shift + 2, y + 2, SLEEVE, K);
    g.paw(cx + shift - 1, y, FUR, K);
    g.paw(cx + shift + 1, y + 1, FUR, K);
    g.set(cx + shift, y + 1, PAD);
    frames[`rub${i}`] = g.rows();
  });
  return frames;
}
export const TUCK_RUB_SPRITES = tuckRubFrames();

export const TUCK_PALETTE = BF_PALETTE;

// =====================================================================
// Glow-worms
// =====================================================================
// Little green lamps drifting down out of the dark onto an umbrella, and
// settling on it. 32 wide, 54 tall; Ves (16 wide, 26 tall, her umbrella over
// her head) stands at the bottom middle, so her umbrella's top is near row 29.
const WW = 32;
const WH = 54;
const GLOW = {
  core: '#e8ffb0',
  lit: '#b4f060',
  mid: '#6ac838',
  dim: '#3a8a2e',
  halo: '#2a5a30',
};
export const WORM_DRIFT_PALETTE = { c: GLOW.core, l: GLOW.lit, m: GLOW.mid, d: GLOW.dim, h: GLOW.halo };

function dice(start) {
  let seed = start;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

// A glow-worm: a glowing dot with a short tail and a faint halo round it.
function worm(g, x, y, glow) {
  x = Math.round(x);
  y = Math.round(y);
  g.set(x, y, glow > 0.5 ? 'c' : 'l');
  g.set(x, y + 1, 'm');
  if (glow > 0.3) g.set(x, y + 2, 'd');
  // A glow-worm that has landed lies along the umbrella: a body three pixels wide.
  if (glow > 0.7) g.set(x + 1, y, 'm');
}

function wormFrames() {
  const frames = {};
  const r = dice(2024);
  // Where each lands on the umbrella (its canopy is a dome across rows 29-34).
  const SPOTS = [[8, 32], [12, 30], [16, 29], [20, 30], [24, 32], [14, 31], [18, 31], [10, 33], [22, 33], [16, 33]];
  const STARTS = SPOTS.map(([x]) => [x + Math.round((r() - 0.5) * 8), -Math.floor(r() * 18)]);
  const COUNT = 6;
  for (let f = 0; f < COUNT; f++) {
    const g = new Grid(WW, WH);
    const t = f / (COUNT - 1);
    SPOTS.forEach(([sx, sy], i) => {
      // Each one leaves a little later than the one before, and lands when its turn comes.
      const delay = (i / SPOTS.length) * 0.55;
      const k = Math.min(1, Math.max(0, (t - delay) / 0.45));
      if (t < delay) return;
      const [x0, y0] = STARTS[i];
      const y = y0 + (sy - y0) * k;
      const x = x0 + (sx - x0) * k + (k < 1 ? Math.sin(f * 1.7 + i) * 1.5 : 0);
      worm(g, x, y, k >= 1 ? 1 : 0.4 + 0.4 * Math.sin(f + i));
    });
    frames[`drift${f}`] = g.rows();
  }
  return frames;
}
export const WORM_DRIFT_SPRITES = wormFrames();
