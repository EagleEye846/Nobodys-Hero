// Art for Chapter 4's opening scenes (chapter_four_opens, the_ground_gives,
// soft_landing): everything that has its own frames so those moments can be
// real animation rather than a sprite swap.
//
//   sunny_ves_throw    Ves winding up and throwing her old crutch (5 frames)
//   sunny_crutch_spin  the crutch turning over and over in the air (8 frames)
//   sunny_bird         a small brown bird flapping (3 frames)
//   sunny_shrub_shake  the hedge shrub the crutch lands in: still, then
//                      shaking with leaves flying (4 frames; `sun_shrub` is
//                      the first of them, as a prop)
//   sunny_ves_proud    Ves swinging her umbrella down, planting it, and
//                      standing proud with a hand on her hip (5 frames)
//   sunny_cracks       cracks spreading across the grass from the umbrella
//                      tip (4 frames, lying flat on the ground, 112x72)
//   sunny_turf_fall    the turf sagging, breaking into chunks and dropping
//                      away (4 frames, the same size, carries on from above)
//   sunny_glowcap      the giant glowing mushroom cap: still, squashed flat,
//                      springing up, a smaller squash, settling (6 frames)
//   sunny_glowcap_splomf  the landing: caught flat, sprung tall, two smaller bounces (7 frames)
//   sunny_glowcap_legs the same cap with Ves's legs sticking out of the top,
//                      kicking, then stuck (4 frames) and empty (1 frame)
//   sunny_spores       a puff of glowing spores that drifts slowly down
//   sunny_hand_float   Ves under her open umbrella, holding your hand, the two
//                      of you drifting down side by side (2 frames: her
//                      floatHandA/B and your holdA/B, lined up as the wind
//                      geysers line them up, HOLD_OFFSET in windGeyser.js)
//
// The animations share one palette (SUNNY_PALETTE: Ves's colours, the bright
// props' colours and this file's own, on characters from U+3000 up so nothing
// clashes). Things with a flat `flat: true` actor in a scene lie under
// everyone: see Actor in src/overworld/scenePlayer.js. `sun_shrub` is also a
// prop (SUNNY_SCENE_PROP_SPRITES, added to props.js) so a room can grow the
// shrub the scene shakes.

import { VES_PALETTE, VES_OPEN_UMBRELLA_SPRITES, VES_CRUTCH_FRAMES, VES_FRAMES } from './vesper.js';
import { PLAYER_PALETTE, PLAYER_HANG_SPRITES } from './player.js';
import { BRIGHT_PALETTE_EXTRA, BRIGHT_PROP_SPRITES } from './brightProps.js';

// --- A tiny painter ---------------------------------------------------
const colors = new Map();
const palette = {};
function P(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0x3000 + colors.size);
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

  // A line with an outline round it (a stick, an arm).
  thick(x0, y0, x1, y1, fill, edge) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    const pts = [];
    for (let i = 0; i <= steps; i++) pts.push([Math.round(x0 + ((x1 - x0) * i) / steps), Math.round(y0 + ((y1 - y0) * i) / steps)]);
    for (const [x, y] of pts) for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) if (!this.get(x + dx, y + dy)) this.set(x + dx, y + dy, edge);
    for (const [x, y] of pts) this.set(x, y, fill);
  }

  // Draws a character grid (VES's rows, say) onto this one at (ox, oy).
  paste(rows, ox, oy) {
    rows.forEach((row, y) => [...row].forEach((c, x) => { if (c !== '.') this.set(ox + x, oy + y, c); }));
  }

  rows() {
    return this.cells.map((row) => row.map((c) => c ?? '.').join(''));
  }
}

// Little deterministic dice, so every redraw of the file gives the same art.
function dice(start) {
  let seed = start;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

const OUT = P('#120c1c');
const WOOD = P('#8a5a32');
const WOOD_LIT = P('#b07a48');

// =====================================================================
// 1. Ves throws the crutch
// =====================================================================
const VT_W = 32;
const VT_H = 30;
const VT_OX = 8; // her 16 columns go here
const VT_OY = VT_H - 26;

// Her on her crutch, with whatever's at the crutch's side cleared, for
// frames that move it.
function vesCrutchBase(clearCrutch) {
  const g = new Grid(VT_W, VT_H);
  const rows = VES_CRUTCH_FRAMES.downIdle.map((row) => (clearCrutch ? row.slice(0, 14) + '..' : row));
  g.paste(rows, VT_OX, VT_OY);
  return g;
}
// Her shoulder, where an arm leaves the coat (canvas coordinates).
const SHOULDER = [VT_OX + 12, VT_OY + 16];

function vesThrowFrames() {
  const frames = {};
  // 0: standing on it, as she was.
  frames.hold = vesCrutchBase(false).rows();

  // 1: the arm comes up, the crutch with it, tipped back behind her head.
  let g = vesCrutchBase(true);
  g.thick(SHOULDER[0], SHOULDER[1], SHOULDER[0] + 4, SHOULDER[1] - 5, P('#4a74b0'), OUT);
  g.set(SHOULDER[0] + 5, SHOULDER[1] - 6, P('#f0c050'));
  g.thick(SHOULDER[0] + 5, SHOULDER[1] - 7, SHOULDER[0] + 8, SHOULDER[1] - 16, WOOD_LIT, OUT);
  g.set(SHOULDER[0] + 8, SHOULDER[1] - 17, P('#e0d0b0'));
  frames.wind1 = g.rows();

  // 2: wound right back, the stick over her shoulder, her body leaning away
  // (the whole figure a pixel left).
  g = new Grid(VT_W, VT_H);
  g.paste(VES_CRUTCH_FRAMES.downIdle.map((row) => row.slice(0, 14) + '..'), VT_OX - 1, VT_OY);
  g.thick(SHOULDER[0] - 1, SHOULDER[1], SHOULDER[0] + 6, SHOULDER[1] - 7, P('#4a74b0'), OUT);
  g.set(SHOULDER[0] + 7, SHOULDER[1] - 8, P('#f0c050'));
  g.thick(SHOULDER[0] + 8, SHOULDER[1] - 8, SHOULDER[0] + 14, SHOULDER[1] - 3, WOOD_LIT, OUT);
  g.set(SHOULDER[0] + 15, SHOULDER[1] - 2, P('#e0d0b0'));
  frames.wind2 = g.rows();

  // 3: the throw: the arm flung out forward and up, the stick gone, a few
  // lines of speed where it was.
  g = vesCrutchBase(true);
  g.thick(SHOULDER[0], SHOULDER[1], SHOULDER[0] + 8, SHOULDER[1] - 6, P('#4a74b0'), OUT);
  g.set(SHOULDER[0] + 9, SHOULDER[1] - 7, P('#f0c050'));
  g.set(SHOULDER[0] + 10, SHOULDER[1] - 8, P('#f0c050'));
  for (const [x, y] of [[11, -12], [13, -10], [14, -7]]) g.set(SHOULDER[0] + x, SHOULDER[1] + y, P('#ffffff'));
  frames.throw = g.rows();

  // 4: the follow-through: the arm drops, the hand open, standing straight on
  // her own two feet (the foot she's been resting touches down).
  g = vesCrutchBase(true);
  g.thick(SHOULDER[0], SHOULDER[1], SHOULDER[0] + 4, SHOULDER[1] + 3, P('#4a74b0'), OUT);
  g.set(SHOULDER[0] + 5, SHOULDER[1] + 4, P('#f0c050'));
  frames.after = g.rows();
  return frames;
}
export const SUNNY_VES_THROW_SPRITES = vesThrowFrames();

// =====================================================================
// 2. The crutch, turning over in the air
// =====================================================================
function crutchSpin(step) {
  const g = new Grid(16, 16);
  const a = (step / 8) * Math.PI * 2;
  const dx = Math.cos(a) * 6;
  const dy = Math.sin(a) * 6;
  g.thick(8 - dx, 8 - dy, 8 + dx, 8 + dy, WOOD_LIT, OUT);
  // The padded fork at one end.
  g.set(8 + dx, 8 + dy, P('#e0d0b0'));
  g.set(8 + dx * 1.15, 8 + dy * 1.15, P('#e0d0b0'));
  // The grip, a lighter bit in the middle.
  g.set(8, 8, P('#4a74b0'));
  return g.rows();
}
export const SUNNY_CRUTCH_SPIN_SPRITES = Object.fromEntries(Array.from({ length: 8 }, (_, i) => [`turn${i}`, crutchSpin(i)]));

// =====================================================================
// 3. A bird, bursting out of the hedge
// =====================================================================
function bird(wings) {
  const g = new Grid(14, 12);
  const BROWN = P('#8a5a32');
  const BROWN_LIT = P('#b07a48');
  const RED = P('#e0603a');
  const BEAK = P('#f0b840');
  g.oval(7, 7, 4, 2, BROWN);
  g.oval(6, 6, 3, 1, BROWN_LIT);
  g.oval(9, 8, 2, 1, RED);
  g.rect(10, 5, 3, 3, BROWN);
  g.set(11, 5, P('#ffffff'));
  g.set(11, 6, OUT);
  g.set(13, 6, BEAK);
  g.set(12, 7, BEAK);
  // The tail.
  g.line(2, 7, 0, 8, BROWN);
  g.line(2, 8, 0, 10, BROWN);
  // The wings: up, level, down.
  if (wings === 0) {
    g.line(6, 5, 3, 0, BROWN);
    g.line(7, 5, 5, 0, BROWN_LIT);
    g.line(7, 5, 8, 1, BROWN);
  } else if (wings === 1) {
    g.line(6, 6, 2, 4, BROWN);
    g.line(7, 6, 3, 5, BROWN_LIT);
  } else {
    g.line(6, 8, 3, 11, BROWN);
    g.line(7, 9, 5, 11, BROWN_LIT);
  }
  return g.rows();
}
export const SUNNY_BIRD_SPRITES = { up: bird(0), level: bird(1), down: bird(2), level2: bird(1) };

// =====================================================================
// 4. The shrub in the hedge
// =====================================================================
function shrub(frame) {
  const g = new Grid(18, 20);
  const D = P('#2e6a2c');
  const M = P('#3e9a3a');
  const L = P('#64c04a');
  const H = P('#a0e070');
  const sway = frame === 1 ? -1 : frame === 2 ? 1 : frame === 3 ? -2 : 0;
  const lumps = [[9, 11, 7, 6], [5, 12, 4, 4], [13, 12, 4, 4], [9, 7, 5, 4]];
  for (const [cx, cy, rx, ry] of lumps) g.oval(cx + sway, cy, rx, ry, D);
  for (const [cx, cy, rx, ry] of lumps) g.oval(cx - 1 + sway, cy - 1, rx - 1, ry - 1, M);
  for (const [cx, cy, rx, ry] of lumps) g.oval(cx - 2 + sway, cy - 2, Math.max(1, rx - 3), Math.max(1, ry - 3), L);
  g.set(7 + sway, 6, H);
  g.set(8 + sway, 6, H);
  g.set(5 + sway, 10, H);
  // A few blossom dots.
  for (const [x, y, c] of [[6, 11, '#ffd0e4'], [12, 10, '#ffd62e'], [10, 14, '#ffffff']]) g.set(x + sway, y, P(c));
  g.rect(8, 17, 3, 3, P('#6a4524'));
  // Leaves flying off a shaken one.
  if (frame >= 1) for (const [x, y] of frame === 3 ? [[1, 2], [16, 3], [3, 0], [14, 1]] : [[1, 4], [16, 5]]) { g.set(x, y, L); g.set(x + 1, y, M); }
  return g.rows();
}
export const SUNNY_SHRUB_SHAKE_SPRITES = { still: shrub(0), left: shrub(1), right: shrub(2), burst: shrub(3) };

// =====================================================================
// 5. Ves plants her umbrella and strikes a pose
// =====================================================================
const VP_W = 28;
const VP_H = 30;
const VP_OX = 4;
const VP_OY = VP_H - 26;
const BUNDLE = P('#7a3a5e');
const BUNDLE_DK = P('#5a2846');
const FERRULE = P('#d8d8e0');
const TUFT = P('#4a9a3a');
const DUST = P('#e8d8a8');

// Her without the umbrella (it moves in every frame), as `furled` minus the
// shaft and the mitten's arm.
function vesNoUmbrella() {
  const g = new Grid(VP_W, VP_H);
  g.paste(VES_OPEN_UMBRELLA_SPRITES.furled.map((row) => row.slice(0, 13) + '...'), VP_OX, VP_OY);
  return g;
}
// The umbrella as a cane, handle at the top (at x, y), tip at the ground.
function umbrellaCane(g, x, top, bottom) {
  g.rect(x - 1, top, 3, 1, OUT);
  g.set(x - 1, top + 1, OUT);
  g.set(x, top, P('#7a4f2a'));
  g.set(x + 1, top, P('#7a4f2a'));
  for (let y = top + 2; y < bottom - 1; y++) {
    g.set(x - 1, y, OUT);
    g.set(x, y, y % 4 === 0 ? BUNDLE_DK : BUNDLE);
    g.set(x + 1, y, OUT);
  }
  g.set(x, bottom - 1, FERRULE);
  g.set(x, bottom, OUT);
}

function vesProudFrames() {
  const frames = {};
  const handX = VP_OX + 15;
  // 0: swinging it down, the umbrella at a slant, her arm out.
  let g = vesNoUmbrella();
  g.thick(handX - 1, VP_OY + 16, handX + 4, VP_OY + 10, BUNDLE, OUT);
  g.set(handX - 1, VP_OY + 16, P('#f0c050'));
  g.thick(handX + 4, VP_OY + 10, handX + 7, VP_OY + 4, P('#7a4f2a'), OUT);
  frames.swing = g.rows();

  // 1: PLANTED: the tip in the grass, a puff of dust, tufts flying.
  g = vesNoUmbrella();
  umbrellaCane(g, handX + 1, VP_OY + 14, VP_H - 1);
  g.set(handX + 1, VP_OY + 15, P('#f0c050'));
  g.set(handX + 1, VP_OY + 16, P('#f0c050'));
  for (const [x, y] of [[-3, -1], [-2, -2], [3, -1], [4, -2], [-4, 0], [5, 0]]) g.set(handX + 1 + x, VP_H - 1 + y, DUST);
  for (const [x, y] of [[-3, -4], [4, -4], [-5, -3]]) g.set(handX + 1 + x, VP_H - 1 + y, TUFT);
  frames.plant = g.rows();

  // 2-4: the pose: the other hand on her hip (the elbow out), chin up.
  const pose = (flick) => {
    const p = vesNoUmbrella();
    umbrellaCane(p, handX + 1, VP_OY + 14, VP_H - 1);
    p.set(handX + 1, VP_OY + 15, P('#f0c050'));
    p.set(handX + 1, VP_OY + 16, P('#f0c050'));
    // The elbow: a sharp triangle of coat out at her left, the hand on her hip.
    const gx = VP_OX + 1;
    const gy = VP_OY + 17;
    p.thick(gx, gy, gx - 2, gy + 2, P('#4a74b0'), OUT);
    p.thick(gx - 2, gy + 2, gx + 1, gy + 4, P('#4a74b0'), OUT);
    p.set(gx + 1, gy + 4, P('#f0c050'));
    // The hair flick: a lock swinging out, and a glint.
    if (flick === 1) {
      p.line(VP_OX + 3, VP_OY + 8, VP_OX + 0, VP_OY + 6, P('#5a3a1e'));
      p.line(VP_OX + 3, VP_OY + 9, VP_OX - 1, VP_OY + 8, P('#8a5a32'));
      p.set(VP_OX - 2, VP_OY + 4, P('#ffffff'));
      p.set(VP_OX - 3, VP_OY + 4, P('#ffffff'));
      p.set(VP_OX - 2, VP_OY + 3, P('#ffffff'));
      p.set(VP_OX - 2, VP_OY + 5, P('#ffffff'));
    }
    return p.rows();
  };
  frames.proud1 = pose(0);
  frames.proud2 = pose(1);
  frames.proud3 = pose(0);
  return frames;
}
export const SUNNY_VES_PROUD_SPRITES = vesProudFrames();

// =====================================================================
// 6. The ground gives: cracks, then the turf breaks away
// =====================================================================
const TW = 112;
const TH = 72;
const TCX = 56;
const TCY = 52; // the middle of the patch, level with Ves's feet when the actor stands a tile below her
const TRX = 50;
const TRY = 25;
const GRASS = P('#68c048');
const GRASS_LIT = P('#8ae060');
const GRASS_DK = P('#4a9a38');
const CRACK = P('#24300e');
const DIRT = P('#8a5a32');
const DIRT_DK = P('#5a3a1e');
const DIRT_LIT = P('#b07a48');
const HOLE = P('#120a22');
const HOLE_LO = P('#2a1a58');
const HOLE_GLOW = P('#6a4ad0');
const PETAL = P('#ffd62e');

// The cells the patch breaks into: seeds in rings, in the ellipse.
const roll = dice(41);
const SEEDS = [{ u: 0.0, v: 0.0 }];
for (let i = 0; i < 6; i++) SEEDS.push({ u: Math.cos((i / 6) * 6.283 + 0.3) * 0.38 + (roll() - 0.5) * 0.08, v: Math.sin((i / 6) * 6.283 + 0.3) * 0.38 + (roll() - 0.5) * 0.08 });
for (let i = 0; i < 9; i++) SEEDS.push({ u: Math.cos((i / 9) * 6.283) * 0.78 + (roll() - 0.5) * 0.1, v: Math.sin((i / 9) * 6.283) * 0.78 + (roll() - 0.5) * 0.1 });
SEEDS.forEach((s) => { s.r = Math.hypot(s.u, s.v); });

// Which cell each pixel of the ellipse belongs to (or -1 outside it).
const CELL = [];
for (let y = 0; y < TH; y++) {
  CELL.push([]);
  for (let x = 0; x < TW; x++) {
    const u = (x - TCX) / TRX;
    const v = (y - TCY) / TRY;
    // A ragged rim.
    const rim = 1 + Math.sin(Math.atan2(v, u) * 7) * 0.04;
    if (u * u + v * v > rim * rim) {
      CELL[y].push(-1);
      continue;
    }
    let best = 0;
    let bd = 1e9;
    SEEDS.forEach((s, i) => {
      const d = (u - s.u) ** 2 + (v - s.v) ** 2 + Math.sin((x + y * 3) * 0.9 + i) * 0.004;
      if (d < bd) { bd = d; best = i; }
    });
    CELL[y].push(best);
  }
}
const cellAt = (x, y) => (x >= 0 && y >= 0 && x < TW && y < TH ? CELL[y][x] : -1);
const isEdge = (x, y) => {
  const c = cellAt(x, y);
  return c >= 0 && (cellAt(x + 1, y) !== c || cellAt(x, y + 1) !== c);
};
const speck = dice(9);
const SPECKS = Array.from({ length: TW * TH }, () => speck());

// Cracks only: the lines between cells out to `reach` (0 to 1 of the way to
// the rim), plus a few radial splits, on the grass as it is.
function cracksFrame(reach) {
  const g = new Grid(TW, TH);
  for (let y = 0; y < TH; y++) {
    for (let x = 0; x < TW; x++) {
      const c = cellAt(x, y);
      if (c < 0) continue;
      const u = (x - TCX) / TRX;
      const v = (y - TCY) / TRY;
      const d = Math.hypot(u, v);
      // The crack has a reach that wobbles with the angle.
      const wob = 1 + Math.sin(Math.atan2(v, u) * 5 + 1) * 0.12;
      if (d > reach * wob) continue;
      if (isEdge(x, y)) g.set(x, y, CRACK);
    }
  }
  // Light along the edge of each crack, the grass lifting a pixel.
  for (let y = 1; y < TH; y++) for (let x = 1; x < TW; x++) if (g.get(x, y) === CRACK && !g.get(x - 1, y - 1) && cellAt(x - 1, y - 1) >= 0 && SPECKS[y * TW + x] < 0.5) g.set(x - 1, y - 1, GRASS_LIT);
  // A pale dot where the umbrella tip is.
  if (reach < 0.2) g.set(TCX, TCY, P('#d8d8e0'));
  return g.rows();
}

// How the cells sit in each stage of the break: [dy, state] per cell, where
// state is 'on' (a slab, sunk dy pixels), 'drop' (a chunk falling, dy far),
// or 'gone'.
function turfStage(stage) {
  return SEEDS.map((s, i) => {
    const wob = Math.sin(i * 2.1) * 0.5 + 0.5;
    if (stage === 0) return { dy: 1 + (s.r < 0.5 ? 1 : 0), state: 'on', tilt: 0 };
    if (stage === 1) return s.r < 0.5 ? { dy: 4 + wob * 2, state: 'on', tilt: 1 } : { dy: 2, state: 'on', tilt: 0 };
    if (stage === 2) return s.r < 0.5 ? { dy: 12 + wob * 8, state: 'drop', tilt: 1 } : s.r < 0.85 ? { dy: 5 + wob * 2, state: 'on', tilt: 1 } : { dy: 3, state: 'on', tilt: 0 };
    return s.r < 0.85 ? { dy: 22 + wob * 12, state: 'drop', tilt: 1 } : { dy: 4 + wob * 2, state: 'on', tilt: 1 };
  });
}

function turfFrame(stage) {
  const g = new Grid(TW, TH);
  const cells = turfStage(stage);
  const sunk = cells.some((c) => c.dy > 1);
  // The hole: wherever a cell has gone down, the dark under it.
  for (let y = 0; y < TH; y++) {
    for (let x = 0; x < TW; x++) {
      const c = cellAt(x, y);
      if (c < 0) continue;
      if (cells[c].dy >= 2 || cells[c].state !== 'on') {
        const lowness = (y - (TCY - TRY)) / (TRY * 2);
        g.set(x, y, lowness > 0.82 ? HOLE_GLOW : lowness > 0.6 ? HOLE_LO : HOLE);
      }
    }
  }
  // A faint glow coming up from far below.
  if (sunk) for (let x = TCX - 14; x <= TCX + 14; x++) if (g.get(x, TCY + TRY - 2) === HOLE_LO || g.get(x, TCY + TRY - 2) === HOLE) g.set(x, TCY + TRY - 2, HOLE_GLOW);
  // The slabs and chunks, the nearest (lowest on screen) drawn last.
  const order = SEEDS.map((s, i) => i).sort((a, b) => SEEDS[a].v - SEEDS[b].v);
  for (const i of order) {
    const cell = cells[i];
    if (cell.state === 'gone') continue;
    const dy = Math.round(cell.dy);
    const small = cell.state === 'drop';
    for (let y = 0; y < TH; y++) {
      for (let x = 0; x < TW; x++) {
        if (CELL[y][x] !== i) continue;
        // A falling chunk shrinks toward the cell's middle as it goes.
        let px = x;
        let py = y;
        if (small) {
          const cx = TCX + SEEDS[i].u * TRX;
          const cy = TCY + SEEDS[i].v * TRY;
          const k = Math.max(0.35, 1 - dy / 60);
          px = Math.round(cx + (x - cx) * k);
          py = Math.round(cy + (y - cy) * k);
        }
        const tilt = cell.tilt ? Math.round(((x - (TCX + SEEDS[i].u * TRX)) / 14) * (stage - 0.5)) : 0;
        const top = isEdge(x, y) ? GRASS_DK : SPECKS[y * TW + x] < 0.08 ? GRASS_LIT : SPECKS[y * TW + x] < 0.22 ? GRASS_DK : GRASS;
        const shade = small ? (dy > 14 ? DIRT_DK : DIRT) : top;
        g.set(px, py + dy + tilt, small ? shade : top);
        // The earth under the lip of a slab that's sunk.
        if (!small && dy >= 2 && CELL[y + 1]?.[x] !== i) {
          g.set(px, py + dy + tilt + 1, DIRT_LIT);
          g.set(px, py + dy + tilt + 2, DIRT);
          if (dy >= 4) g.set(px, py + dy + tilt + 3, DIRT_DK);
        }
      }
    }
  }
  // Buttercups going down with it, in the last stages.
  if (stage >= 2) {
    const drop = dice(5 + stage);
    for (let i = 0; i < 9; i++) {
      const x = TCX + (drop() - 0.5) * 70;
      const y = TCY - 6 + drop() * 30 + (stage - 2) * 12;
      g.set(x, y, PETAL);
      g.set(x + 1, y, PETAL);
      g.set(x, y + 1, P('#f6a010'));
    }
  }
  return g.rows();
}

export const SUNNY_CRACKS_SPRITES = { c0: cracksFrame(0.16), c1: cracksFrame(0.4), c2: cracksFrame(0.7), c3: cracksFrame(1.05) };
export const SUNNY_TURF_FALL_SPRITES = { t0: turfFrame(0), t1: turfFrame(1), t2: turfFrame(2), t3: turfFrame(3) };

// =====================================================================
// 7. The giant glowing mushroom, bouncing, with Ves stuck in it
// =====================================================================
const CAP_SRC = BRIGHT_PROP_SPRITES.glowcap_giant;
const CAP_SH = CAP_SRC.length;
const CAP_SW = CAP_SRC[0].length;
// The canvas: the cap's width with room to widen, and room above to spring
// up. The cap sits 8 pixels left of the middle, so an actor standing on the
// tile after the prop's second one lines up with the prop (4 tiles wide).
const CAP_W = CAP_SW + 32;
const CAP_H = CAP_SH + 24;
const CAP_CX = CAP_W / 2 - 8;

// The cap squashed by (sx, sy) about the middle of its foot.
function glowcap(sx, sy, legs = null) {
  const g = new Grid(CAP_W, CAP_H);
  for (let y = 0; y < CAP_H; y++) {
    const srcY = Math.floor(CAP_SH - 1 - (CAP_H - 1 - y) / sy);
    if (srcY < 0 || srcY >= CAP_SH) continue;
    for (let x = 0; x < CAP_W; x++) {
      const srcX = Math.floor(CAP_SW / 2 + (x - CAP_CX) / sx);
      if (srcX < 0 || srcX >= CAP_SW) continue;
      const c = CAP_SRC[srcY][srcX];
      if (c !== '.') g.set(x, y, c);
    }
  }
  if (legs) legs(g, CAP_H - Math.round(CAP_SH * sy));
  return g;
}
const capFrames = [[1, 1], [1.22, 0.7], [1.36, 0.52], [0.9, 1.14], [1.1, 0.84], [1, 1]];
export const SUNNY_GLOWCAP_SPRITES = Object.fromEntries(capFrames.map(([sx, sy], i) => [`bounce${i}`, glowcap(sx, sy).rows()]));
// The landing itself (soft_landing.js): caught flat, held there a beat, then
// sprung up tall, a smaller squash, a smaller spring, and settled.
const splomfFrames = [[1.4, 0.46], [1.42, 0.5], [0.88, 1.18], [1.14, 0.8], [0.96, 1.07], [1.04, 0.94], [1, 1]];
export const SUNNY_GLOWCAP_SPLOMF_SPRITES = Object.fromEntries(splomfFrames.map(([sx, sy], i) => [`splomf${i}`, glowcap(sx, sy).rows()]));

// Ves's legs sticking out of the top of the cap: two stockinged legs in
// boots, the hem of her coat, a pink of petticoat; `pose` kicks them.
function legsOf(pose) {
  return (g, topY) => {
    const cx = CAP_CX;
    const top = topY + 2;
    // Striped stockings and brown boots: they have to read against the purple cap.
    const BOOT = P('#5a3a1e');
    const SOLE = P('#e8d8b8');
    const COAT = P('#4a74b0');
    const COAT_DK = P('#30508a');
    const spread = [3, 5, 1][pose];
    const lift = [0, 2, 0][pose];
    // The coat hem, where she goes into the cap.
    g.rect(cx - 6, top + 1, 13, 3, COAT);
    g.rect(cx - 6, top + 3, 13, 1, COAT_DK);
    g.rect(cx - 6, top, 13, 1, OUT);
    for (const side of [-1, 1]) {
      const x0 = cx + side * 2;
      const x1 = cx + side * (2 + spread) + (pose === 1 ? side * 1 : 0);
      const y1 = top - 9 - lift - (side > 0 && pose === 1 ? 2 : 0);
      g.thick(x0, top, x1, y1, P('#f4f4f4'), OUT);
      g.thick(x0 + side, top, x1 + side, y1, P('#f4f4f4'), OUT);
      // The stripes.
      for (let k = 0; k < 4; k++) {
        const t = (k * 2 + 1) / 9;
        const sx = Math.round(x0 + (x1 - x0) * t);
        const sy = Math.round(top + (y1 - top) * t);
        g.set(sx, sy, P('#e88aa0'));
        g.set(sx + side, sy, P('#e88aa0'));
      }
      g.rect(x1 - 1, y1 - 3, 4, 3, OUT);
      g.rect(x1, y1 - 3, 2, 2, BOOT);
      g.rect(x1 - 1, y1 - 4, 4, 1, SOLE);
    }
  };
}
export const SUNNY_GLOWCAP_LEGS_SPRITES = {
  kick1: glowcap(1, 1, legsOf(0)).rows(),
  kick2: glowcap(1.04, 0.97, legsOf(1)).rows(),
  kick3: glowcap(1, 1, legsOf(2)).rows(),
  still: glowcap(1, 1, legsOf(2)).rows(),
};

// A puff of spores: bursts up out of the cap, hangs, then sinks slowly.
function spores(frame) {
  const W = 72;
  const H = 64;
  const g = new Grid(W, H);
  const r = dice(77);
  const TINTS = ['#4fe0d0', '#ff6ac8', '#a888ff', '#ffffff', '#ffd24a', '#b8fff0'];
  const count = 36;
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (r() - 0.5) * 2.6;
    const speed = 12 + r() * 26;
    const settle = 6 + r() * 8;
    const t = frame / 5;
    // Out and up in the first half, then drifting gently down.
    const out = Math.min(1, t * 2.2);
    const x = W / 2 + Math.cos(angle) * speed * out + Math.sin(frame * 1.3 + i) * 1.2;
    const y = H - 12 + Math.sin(angle) * speed * out * 1.2 + Math.max(0, t - 0.35) * (settle + 36);
    const tint = P(TINTS[i % TINTS.length]);
    g.set(x, y, tint);
    g.set(x + 1, y, tint);
    if (i % 2 === 0) {
      g.set(x, y + 1, tint);
      g.set(x + 1, y + 1, tint);
    }
    if (i % 7 === 0) {
      g.set(x - 1, y, tint);
      g.set(x, y - 1, tint);
    }
  }
  return g.rows();
}
export const SUNNY_SPORES_SPRITES = Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`puff${i}`, spores(i)]));

// =====================================================================
// A few props that aren't in the bright set
// =====================================================================
// A round hay bale you can push (Sunnyside's push puzzle): 16x16, a
// straw-gold barrel on its side with a string round it.
function hayBale() {
  const g = new Grid(16, 16);
  const D = P('#a88428');
  const M = P('#d0a840');
  const L = P('#e8c860');
  const H = P('#fff0a0');
  g.oval(8, 9, 7, 6, OUT);
  g.oval(8, 9, 6, 5, D);
  g.oval(7, 8, 5, 4, M);
  g.oval(6, 7, 3, 2, L);
  g.set(5, 6, H);
  g.set(6, 6, H);
  // Straw ends, and the string.
  for (const [x, y] of [[3, 10], [5, 12], [10, 12], [12, 9], [4, 7], [11, 6]]) g.set(x, y, D);
  for (const [x, y] of [[4, 9], [7, 11], [9, 5], [10, 9]]) g.set(x, y, L);
  g.line(8, 4, 8, 14, P('#7a5a28'));
  g.line(9, 4, 9, 14, P('#a88428'));
  // A few loose stalks.
  g.set(1, 11, M);
  g.set(0, 12, D);
  g.set(14, 13, M);
  g.set(15, 14, D);
  return g.rows();
}

// A rabbit hole: a neat mound of earth with a round black mouth, and a
// worn lip. 16x12. (It goes down a long way.)
function rabbitHole() {
  const g = new Grid(16, 12);
  const E = P('#8a5a32');
  const E_LIT = P('#b07a48');
  const E_DK = P('#5a3a1e');
  g.oval(8, 8, 7, 4, OUT);
  g.oval(8, 8, 6, 3, E);
  g.oval(7, 6, 5, 2, E_LIT);
  g.oval(8, 8, 3, 2, OUT);
  g.oval(8, 8, 2, 1, P('#06040c'));
  g.line(5, 10, 11, 10, E_DK);
  for (const x of [1, 3, 12, 14]) {
    g.set(x, 10, P('#4a9a3a'));
    g.set(x, 9, P('#4a9a3a'));
  }
  g.set(2, 8, P('#ffffff'));
  g.set(14, 8, P('#ffd62e'));
  return g.rows();
}

// Where the ground gave way in the Soft Field, after: a ragged black hole in
// the turf with a broken lip of grass, and the Long Rope coiled beside it,
// tied off to a stake (you climbed out of it at the end of Chapter 4). 48x16.
function fieldHole() {
  const g = new Grid(48, 16);
  const TURF = P('#4a9a3a');
  const TURF_DK = P('#2e6a26');
  const EARTH = P('#5a3a1e');
  const DARK = P('#06040c');
  const ROPE = P('#c8a46a');
  g.oval(22, 9, 18, 7, OUT);
  g.oval(22, 9, 17, 6, TURF_DK);
  g.oval(22, 9, 15, 5, EARTH);
  g.oval(22, 10, 13, 4, DARK);
  // The torn lip, tufts hanging over the edge.
  for (const x of [9, 13, 18, 24, 29, 33]) {
    g.set(x, 5 + (x % 3 === 0 ? 1 : 0), TURF);
    g.set(x, 6 + (x % 3 === 0 ? 1 : 0), TURF_DK);
  }
  // The stake, and the rope from it down over the edge.
  g.rect(41, 3, 2, 9, OUT);
  g.rect(41, 4, 1, 7, EARTH);
  g.oval(42, 12, 4, 2, ROPE);
  g.line(40, 9, 30, 9, ROPE);
  g.line(30, 9, 27, 12, ROPE);
  g.set(42, 12, OUT);
  return g.rows();
}

// =====================================================================
// Props, palette
// =====================================================================
// The shrub, as a prop (a room's hedge can grow one; it's solid and 16 wide).
// --- The two of you, drifting down under her umbrella, hand in hand ---
// (Your frame's colours are moved onto this file's own characters, so they
// can't clash with hers.)
const HOLD = { x: 16, y: 7 };
function handFloat(vesRows, heroRows) {
  const w = Math.max(vesRows[0].length, HOLD.x + heroRows[0].length);
  const h = Math.max(vesRows.length, HOLD.y + heroRows.length);
  const g = new Grid(w, h);
  g.paste(vesRows, 0, 0);
  heroRows.forEach((row, y) => [...row].forEach((c, x) => {
    if (c !== '.' && PLAYER_PALETTE[c]) g.set(HOLD.x + x, HOLD.y + y, P(PLAYER_PALETTE[c]));
  }));
  return g.rows();
}
export const SUNNY_HAND_FLOAT_SPRITES = {
  a: handFloat(VES_FRAMES.floatHandA, PLAYER_HANG_SPRITES.holdA),
  b: handFloat(VES_FRAMES.floatHandB, PLAYER_HANG_SPRITES.holdB),
};

export const SUNNY_SCENE_PROP_SPRITES = {
  sun_shrub: SUNNY_SHRUB_SHAKE_SPRITES.still,
  hay_bale: hayBale(),
  rabbit_hole: rabbitHole(),
  field_hole: fieldHole(),
  // The cracks left in the turf round the hole once the ground has given
  // way: the last, widest frame of sunny_cracks, kept for good.
  field_cracks: SUNNY_CRACKS_SPRITES.c3,
};
// This file's own characters, for the prop palette (props.js).
export const SUNNY_SCENE_PALETTE_EXTRA = palette;
// What the animations above are drawn with: Ves's colours and the giant cap's
// (from the bright props), and this file's own.
export const SUNNY_PALETTE = { ...VES_PALETTE, ...BRIGHT_PALETTE_EXTRA, ...palette };

