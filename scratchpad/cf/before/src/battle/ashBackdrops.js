import { SCREEN_WIDTH as W } from '../config.js';
import { vistaHash as hash } from '../engine/noise.js';

// Battle backgrounds for Chapter 6's Ash Road (see BACKDROPS in backdrops.js),
// picked by the room's `area` (`ashroad`): a wide grey plain under a smoky
// sky, ash lying on it like snow, the old road running off toward the buried
// town, burnt black trees, and far off the ground still smouldering, an orange
// glow along the horizon and cracks that breathe in the near ground. Ash falls
// slowly the whole time and embers rise out of the cracks. `ashroad_gate` is
// the same road at the town gate, with the burnt farmhouse the Lum stood in
// (src/data/enemies/the_lum.js) and the roofs of the buried town showing over
// the ash. Each draws the stage from y = 0 down to `height`; the battle panel
// covers the rest. Scenery that never moves is drawn once onto its own canvas.

const HORIZON = 76;

const rect = (ctx, color, x, y, w, h) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};
function line(ctx, color, x0, y0, x1, y1, t = 1) {
  ctx.fillStyle = color;
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= n; i++) ctx.fillRect(Math.round(x0 + ((x1 - x0) * i) / n - (t - 1) / 2), Math.round(y0 + ((y1 - y0) * i) / n), t, 1);
}
function poly(ctx, color, pts) {
  ctx.fillStyle = color;
  const ys = pts.map((p) => p[1]);
  for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) {
    const xs = [];
    for (let i = 0; i < pts.length; i++) {
      const [ax, ay] = pts[i];
      const [bx, by] = pts[(i + 1) % pts.length];
      if ((ay <= y + 0.5 && by > y + 0.5) || (by <= y + 0.5 && ay > y + 0.5)) xs.push(ax + ((y + 0.5 - ay) / (by - ay)) * (bx - ax));
    }
    xs.sort((a, b) => a - b);
    for (let i = 0; i + 1 < xs.length; i += 2) ctx.fillRect(Math.round(xs[i]), y, Math.max(1, Math.round(xs[i + 1]) - Math.round(xs[i])), 1);
  }
}
function oval(ctx, color, cx, cy, rx, ry) {
  ctx.fillStyle = color;
  for (let dy = -ry; dy <= ry; dy++) {
    const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.25))));
    ctx.fillRect(Math.round(cx - w), Math.round(cy + dy), w * 2 + 1, 1);
  }
}
// A soft round light: one gradient sprite per colour, drawn at any size and strength.
const SOFT = new Map();
function soft(ctx, rgb, strength, x, y, w, h) {
  if (strength <= 0) return;
  if (!SOFT.has(rgb)) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const c = canvas.getContext('2d');
    const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, `rgba(${rgb}, 1)`);
    g.addColorStop(1, `rgba(${rgb}, 0)`);
    c.fillStyle = g;
    c.fillRect(0, 0, 64, 64);
    SOFT.set(rgb, canvas);
  }
  const before = ctx.globalAlpha;
  ctx.globalAlpha = before * Math.min(1, strength);
  ctx.drawImage(SOFT.get(rgb), x, y, w, h);
  ctx.globalAlpha = before;
}
const CACHED = new Map();
function cached(key, height, draw) {
  const id = `${key}:${height}`;
  if (!CACHED.has(id)) {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = height;
    draw(canvas.getContext('2d'));
    CACHED.set(id, canvas);
  }
  return CACHED.get(id);
}

const SKY = ['#1a1719', '#221e20', '#2b2627', '#342e2e', '#3e3735', '#48403c', '#544a43', '#62554a', '#6e5d4e', '#7a6450'];
const ASH_FAR = '#7e7870';
const ASH_MID = '#948e85';
const ASH_NEAR = '#a9a399';

// A burnt tree: a black trunk, leaning, and a few bare branches that fork.
function tree(c, x, base, height, lean, seed, colors = ['#141012', '#221d1d']) {
  const [dark, light] = colors;
  const topX = x + lean;
  const top = base - height;
  const w = Math.max(1, Math.round(height / 18));
  line(c, dark, x, base, topX, top, w + 1);
  line(c, light, x - 1, base, topX - 1, top + 4, 1);
  const branches = 3 + Math.floor(hash(seed) * 3);
  for (let i = 0; i < branches; i++) {
    const at = 0.3 + (i / branches) * 0.65;
    const bx = x + lean * at;
    const by = base - height * at;
    const side = i % 2 ? 1 : -1;
    const len = height * (0.22 + hash(seed + i) * 0.18) * (1 - at * 0.4);
    const ex = bx + side * len;
    const ey = by - len * (0.5 + hash(seed + i + 10) * 0.5);
    line(c, dark, bx, by, ex, ey, Math.max(1, w - 1));
    // A fork at the end.
    line(c, dark, ex, ey, ex + side * len * 0.35, ey - len * 0.3, 1);
    line(c, dark, ex, ey, ex + side * len * 0.1, ey - len * 0.45, 1);
  }
  // A snapped top.
  line(c, dark, topX, top, topX + (lean > 0 ? 2 : -2), top - 3, 1);
}

// The parts that never move: ridge, far trees, the plain, the road, near trees.
function scenery(height, gate) {
  return cached(gate ? 'ash_gate' : 'ash_road', height, (c) => {
    // The far ridge, low and black, ragged.
    const ridge = [];
    for (let x = 0; x <= W; x += 8) ridge.push([x, HORIZON - 4 - Math.round(Math.sin(x * 0.031) * 3 + Math.sin(x * 0.11) * 2 + hash(x + 5) * 2)]);
    poly(c, '#2a2425', [[0, HORIZON + 2], ...ridge, [W, HORIZON + 2]]);
    // Thin far trees standing on it.
    for (let i = 0; i < 22; i++) {
      const x = hash(i + 6100) * W;
      if (gate && x > 150 && x < 250) continue;
      const h = 6 + hash(i + 6110) * 10;
      tree(c, x, HORIZON - 2, h, (hash(i + 6120) - 0.5) * 3, i + 6130, ['#1e1a1b', '#2a2425']);
    }
    if (gate) {
      // The buried town over the ash: roof ridges and a chimney or two poking out,
      // a church spire, all sunk to the eaves.
      for (const [x, w, h] of [[150, 18, 6], [172, 12, 5], [188, 22, 7], [214, 14, 5], [232, 16, 6]]) {
        poly(c, '#3a3233', [[x, HORIZON], [x + w / 2, HORIZON - h], [x + w, HORIZON]]);
        line(c, '#4e4544', x + 2, HORIZON - 1, x + w / 2, HORIZON - h, 1);
      }
      rect(c, '#2e2829', 178, HORIZON - 9, 2, 4);
      rect(c, '#2e2829', 221, HORIZON - 8, 2, 3);
      // The spire.
      poly(c, '#2e2829', [[201, HORIZON - 7], [204, HORIZON - 26], [207, HORIZON - 7]]);
      rect(c, '#2e2829', 200, HORIZON - 8, 8, 4);
      rect(c, '#1a1617', 203, HORIZON - 14, 2, 2);
    }
    // The plain: ash lying like snow, darker far off.
    const bands = [ASH_FAR, '#868077', '#8d877e', ASH_MID, '#9c968c', '#a39d93', ASH_NEAR];
    const span = height - HORIZON;
    bands.forEach((color, i) => rect(c, color, 0, HORIZON + Math.round((span * i) / bands.length) - (i ? 0 : 1), W, Math.ceil(span / bands.length) + 1));
    // Drifts: long low ridges of paler ash, and shadow under them.
    for (let i = 0; i < 26; i++) {
      const y = HORIZON + 4 + Math.pow(hash(i + 6200), 1.6) * (span - 6);
      const near = (y - HORIZON) / span;
      const x = hash(i + 6210) * W;
      const w = 18 + near * 60 + hash(i + 6220) * 30;
      rect(c, '#b8b2a7', x - w / 2, y, w, 1);
      rect(c, '#7c766d', x - w / 2 + 3, y + 1, w - 6, 1);
    }
    // The old road: a band of trodden ash running off toward the town.
    const vx = gate ? 196 : 150;
    poly(c, '#7a736a', [[vx - 2, HORIZON], [vx + 2, HORIZON], [gate ? 190 : 210, height], [gate ? 70 : 92, height]]);
    poly(c, '#857e74', [[vx - 1, HORIZON], [vx + 1, HORIZON], [gate ? 160 : 178, height], [gate ? 100 : 122, height]]);
    // Wheel ruts.
    line(c, '#6a645c', vx - 1, HORIZON + 2, gate ? 112 : 134, height, 1);
    line(c, '#6a645c', vx + 1, HORIZON + 2, gate ? 150 : 168, height, 1);
    // Milestones along it, getting smaller.
    for (const k of [0.18, 0.4, 0.72]) {
      const y = HORIZON + span * k;
      const edge = vx + ((gate ? 194 : 214) - vx) * k + 4 + k * 6;
      const s = Math.max(1, Math.round(k * 7));
      rect(c, '#4e4842', edge, y - s * 2, s + 1, s * 2);
      rect(c, '#6e685e', edge, y - s * 2, 1, s * 2);
      if (s > 2) rect(c, '#3a3532', edge + 1, y - s * 2 + 2, s - 1, 1);
    }
    if (gate) {
      // The burnt farmhouse: a gable end standing, a broken side wall, charred
      // beams, and the gateposts of the road into town.
      poly(c, '#4a4440', [[236, HORIZON + 30], [236, 34], [262, 14], [288, 34], [288, HORIZON + 30]]);
      poly(c, '#3a3532', [[262, 14], [288, 34], [288, HORIZON + 30], [270, HORIZON + 30]]);
      // Stones in it, and the gap of a window, black inside.
      for (let y = 38; y < HORIZON + 28; y += 5) for (let x = 238 + ((y / 5) % 2) * 4; x < 286; x += 9) rect(c, '#3e3836', x, y, 6, 1);
      rect(c, '#141012', 254, 40, 7, 10);
      rect(c, '#2a2425', 255, 41, 5, 1);
      // The side wall, broken off in steps.
      poly(c, '#433d3a', [[288, HORIZON + 30], [288, 46], [298, 46], [298, 56], [308, 56], [308, 64], [W, 64], [W, HORIZON + 30]]);
      // A roof beam, burnt through, still leaning on the gable.
      line(c, '#1a1415', 262, 16, 300, 50, 3);
      line(c, '#2e2424', 262, 15, 299, 48, 1);
      line(c, '#1a1415', 244, 30, 226, 66, 2);
      // Gateposts either side of the road, with the gate gone.
      for (const x of [118, 176]) {
        rect(c, '#4e4842', x, HORIZON + 4, 6, 26);
        rect(c, '#6e685e', x, HORIZON + 4, 1, 26);
        rect(c, '#5a544c', x - 1, HORIZON + 2, 8, 3);
        rect(c, '#3a3532', x + 5, HORIZON + 6, 1, 23);
      }
      line(c, '#2a2425', 124, HORIZON + 10, 136, HORIZON + 20, 1);
      // Ash heaped against the walls.
      oval(c, ASH_MID, 262, HORIZON + 30, 30, 5);
      oval(c, '#a9a399', 262, HORIZON + 28, 22, 3);
    }
    // Near trees: tall, black, leaning, one each side.
    tree(c, 16, height + 2, 150, 6, 6300);
    tree(c, gate ? 214 : 300, height + 2, gate ? 104 : 140, gate ? -5 : -8, 6310);
    tree(c, gate ? 46 : 58, HORIZON + 26, 52, 3, 6320);
    if (!gate) tree(c, 262, HORIZON + 20, 40, -2, 6330);
    // Stumps.
    for (const [x, y, h] of [[78, HORIZON + 40, 6], [236, HORIZON + 50, 8], [32, HORIZON + 62, 9]]) {
      rect(c, '#1a1617', x, y - h, 4, h);
      rect(c, '#2a2425', x, y - h, 1, h);
      rect(c, '#a9a399', x - 2, y - 1, 8, 2);
    }
  });
}

// Glowing cracks in the near ground: zigzags that breathe.
const CRACKS = Array.from({ length: 7 }, (_, i) => {
  const y = HORIZON + 14 + hash(i + 6400) * 64;
  const x = 10 + hash(i + 6410) * (W - 20);
  const pts = [[x, y]];
  const len = 4 + Math.floor(hash(i + 6420) * 4);
  for (let k = 0; k < len; k++) {
    const [px, py] = pts[pts.length - 1];
    pts.push([px + 3 + hash(i * 9 + k) * 5, py + (k % 2 ? -1 : 1) * (1 + hash(i * 7 + k) * 2)]);
  }
  return { pts, phase: hash(i + 6430) * 6.28 };
});
// Specks of fire along the far ridge.
const SPECKS = Array.from({ length: 16 }, (_, i) => ({ x: hash(i + 6500) * W, y: HORIZON - 1 - hash(i + 6510) * 5, phase: hash(i + 6520) * 6.28 }));
// Ash coming down, slow and swaying.
const FLAKES = Array.from({ length: 70 }, (_, i) => ({
  x: hash(i + 6600) * (W + 40) - 20,
  y: hash(i + 6610),
  speed: 5 + hash(i + 6620) * 9,
  sway: hash(i + 6630) * 6.28,
  big: hash(i + 6640) < 0.25,
  shade: hash(i + 6650) < 0.5 ? '#c8c2b6' : '#9c968c',
}));
// Embers going up out of the cracks.
const EMBERS = Array.from({ length: 20 }, (_, i) => ({
  crack: i % CRACKS.length,
  offset: hash(i + 6700),
  speed: 10 + hash(i + 6710) * 14,
  sway: hash(i + 6720) * 6.28,
}));

function drawAsh(ctx, time, height, gate) {
  // The sky: smoke, lit warm from underneath.
  const sky = HORIZON + 2;
  const band = Math.ceil(sky / SKY.length);
  SKY.forEach((color, i) => rect(ctx, color, 0, i * band, W, band + 1));
  // The far fires: an orange glow along the horizon, breathing.
  for (const [x, w, k] of [[40, 140, 0], [170, 120, 1.7], [280, 150, 3.1]]) {
    soft(ctx, '255, 110, 40', 0.22 + 0.08 * Math.sin(time * 0.7 + k), x - w / 2, HORIZON - 26, w, 44);
  }
  // Slow banks of smoke drifting across.
  for (let i = 0; i < 5; i++) {
    const w = 110 + hash(i + 6800) * 80;
    const x = ((hash(i + 6810) * (W + w) + time * (2 + hash(i + 6820) * 2.5)) % (W + w)) - w;
    const y = 6 + hash(i + 6830) * 48;
    soft(ctx, '96, 88, 84', 0.35, x, y, w, 26 + hash(i + 6840) * 16);
  }
  ctx.drawImage(scenery(height, gate), 0, 0);
  // Fire specks along the ridge.
  for (const s of SPECKS) {
    const on = 0.5 + 0.5 * Math.sin(time * 1.3 + s.phase);
    if (on > 0.35) rect(ctx, on > 0.8 ? '#ffd25e' : '#ff8c1a', s.x, s.y, 1, 1);
  }
  // The cracks breathe: dark red, then bright.
  for (const c of CRACKS) {
    const heat = 0.5 + 0.5 * Math.sin(time * 1.1 + c.phase);
    const [cx, cy] = c.pts[Math.floor(c.pts.length / 2)];
    soft(ctx, '255, 110, 40', 0.18 + heat * 0.25, cx - 18, cy - 8, 36, 16);
    for (let k = 0; k + 1 < c.pts.length; k++) {
      const [ax, ay] = c.pts[k];
      const [bx, by] = c.pts[k + 1];
      line(ctx, '#5a1e0e', ax, ay + 1, bx, by + 1, 1);
      line(ctx, heat > 0.6 ? '#ff8c1a' : '#a8401a', ax, ay, bx, by, 1);
    }
    if (heat > 0.75) rect(ctx, '#ffd25e', cx, cy, 1, 1);
  }
  // Embers rising out of them.
  for (const e of EMBERS) {
    const c = CRACKS[e.crack].pts;
    const [sx, sy] = c[Math.floor(e.offset * (c.length - 1))];
    const rise = (time * e.speed + e.offset * 90) % 90;
    const x = sx + Math.sin(time * 1.4 + e.sway) * (2 + rise * 0.08);
    const y = sy - rise;
    if (y < 4) continue;
    const fade = 1 - rise / 90;
    rect(ctx, fade > 0.6 ? '#ffd25e' : fade > 0.3 ? '#ff8c1a' : '#a8401a', x, y, 1, 1);
  }
  // Ash falling.
  for (const f of FLAKES) {
    const y = (f.y * height + time * f.speed) % (height + 6) - 3;
    const x = f.x + Math.sin(time * 0.8 + f.sway) * 4 + Math.sin(time * 0.23) * 6;
    rect(ctx, f.shade, x, y, f.big ? 2 : 1, 1);
    if (f.big) rect(ctx, '#7c766d', x, y + 1, 1, 1);
  }
  // A dark edge round it all, a lonely sort of light.
  soft(ctx, '0, 0, 0', 0, 0, 0, 0, 0);
  ctx.fillStyle = 'rgba(10, 8, 9, 0.35)';
  ctx.fillRect(0, 0, W, 3);
  ctx.fillRect(0, 0, 3, height);
  ctx.fillRect(W - 3, 0, 3, height);
}

export const ASH_BACKDROPS = {
  // Rooms with `area: 'ashroad'`.
  ashroad: (ctx, time, height) => drawAsh(ctx, time, height, false),
  // The Lum's (`backdrop: 'ashroad_gate'` in src/data/enemies/the_lum.js): the town gate.
  ashroad_gate: (ctx, time, height) => drawAsh(ctx, time, height, true),
};
