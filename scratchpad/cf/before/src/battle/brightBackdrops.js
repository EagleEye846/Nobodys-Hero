import { SCREEN_WIDTH as W } from '../config.js';

// Battle backgrounds for Chapter 4's bright regions (see BACKDROPS in
// backdrops.js): Sunnyside's fields, the Glimmering's crystal caves, and
// Belowtown's lamplit streets. Each draws the stage from y = 0 down to
// `height`; the battle panel covers the rest.

function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
const FLOOR_HEIGHT = 20;
const rect = (ctx, color, x, y, w, h) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};
function disc(ctx, color, cx, cy, r) {
  ctx.fillStyle = color;
  for (let dy = -r; dy <= r; dy++) {
    const w = Math.round(Math.sqrt(r * r - dy * dy + 0.25));
    ctx.fillRect(Math.round(cx - w), Math.round(cy + dy), w * 2 + 1, 1);
  }
}
// Scenery that never moves, drawn once onto its own canvas and reused every
// frame (one per backdrop and stage height).
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
function glow(ctx, x, y, radius, rgb, strength) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, `rgba(${rgb}, ${strength})`);
  g.addColorStop(1, `rgba(${rgb}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

// ===================== SUNNYSIDE =====================
const SUN_SKY = ['#5fb8f0', '#6cc0f2', '#7ac8f4', '#8ad0f6', '#9cd8f8', '#b0e2fa', '#c6ecfc', '#dcf4fe'];
const SUN_CLOUDS = Array.from({ length: 7 }, (_, i) => ({
  x: hash(i + 8000) * (W + 80), y: 12 + hash(i + 8010) * 60, speed: 2 + hash(i + 8020) * 3, size: 0.7 + hash(i + 8030) * 0.8,
}));
const SUN_FLOWERS = Array.from({ length: 46 }, (_, i) => ({
  x: hash(i + 8100) * W, y: hash(i + 8110), kind: hash(i + 8120), sway: hash(i + 8130) * 6.28,
}));
const SUN_BUTTERFLIES = Array.from({ length: 4 }, (_, i) => ({
  x: hash(i + 8200) * W, y: 0.3 + hash(i + 8210) * 0.5, phase: hash(i + 8220) * 6.28, color: ['#ffd62e', '#6aa8f0', '#f08ab8', '#fffdf2'][i],
}));
const SUN_BIRDS = Array.from({ length: 3 }, (_, i) => ({ x: hash(i + 8300) * W, y: 20 + hash(i + 8310) * 40, speed: 6 + hash(i + 8320) * 6 }));
// Dandelion seeds riding the breeze across the fields.
const SUN_SEEDS = Array.from({ length: 18 }, (_, i) => ({
  x: hash(i + 8320) * (W + 40), y: 0.15 + hash(i + 8330) * 0.8, speed: 5 + hash(i + 8340) * 7, bob: hash(i + 8350) * 6.28, rise: 1 + hash(i + 8360) * 2,
}));
// Glints on the brook, sliding along with the water.
const SUN_GLINTS = Array.from({ length: 14 }, (_, i) => ({ x: hash(i + 8370) * W, row: Math.floor(hash(i + 8380) * 3), at: hash(i + 8390) * 6.28 }));

function cloud(ctx, x, y, s) {
  for (const [dx, dy, r] of [[0, 0, 9], [-10, 3, 6], [11, 2, 7], [20, 5, 5], [-18, 5, 4]]) disc(ctx, '#ffffff', x + dx * s, y + dy * s, Math.round(r * s));
  for (const [dx, dy, r] of [[2, 4, 8], [-9, 6, 5], [13, 6, 6]]) disc(ctx, '#e6f4ff', x + dx * s, y + dy * s, Math.round(r * s * 0.8));
  rect(ctx, '#ffffff', x - 20 * s, y + 5 * s, 44 * s, 3 * s);
}
function hills(ctx, baseY, amp, period, shift, color, lit) {
  for (let x = 0; x < W; x++) {
    const h = amp * (0.55 + 0.45 * Math.sin((x + shift) / period)) + amp * 0.25 * Math.sin((x + shift) / (period * 0.37));
    rect(ctx, color, x, baseY - h, 1, h + 1);
    rect(ctx, lit, x, baseY - h, 1, 1);
  }
}
function windmill(ctx, x, baseY, time) {
  rect(ctx, '#e8dcc0', x - 4, baseY - 22, 9, 22);
  rect(ctx, '#fff8e4', x - 4, baseY - 22, 2, 22);
  rect(ctx, '#c8b890', x + 3, baseY - 22, 2, 22);
  for (let i = 0; i < 4; i++) rect(ctx, '#d8503a', x - 5 + i * 3, baseY - 26 + (i % 2), 3, 4);
  rect(ctx, '#7a5030', x - 1, baseY - 8, 3, 8);
  const hubY = baseY - 20;
  disc(ctx, '#6a4524', x, hubY, 2);
  for (let b = 0; b < 4; b++) {
    const a = time * 0.5 + (b * Math.PI) / 2;
    for (let k = 3; k < 17; k++) {
      const px = x + Math.cos(a) * k;
      const py = hubY + Math.sin(a) * k;
      rect(ctx, k > 7 ? '#fffdf2' : '#8a5a32', px, py, 1, 1);
      if (k > 7) rect(ctx, '#fffdf2', px + Math.round(-Math.sin(a) * 1.5), py + Math.round(Math.cos(a) * 1.5), 1, 1);
    }
  }
}
// The far blue line of the downs and the far hills: still, so drawn once.
function sunHills(ctx, floorY) {
  for (let x = 0; x < W; x++) {
    const h = 10 + 5 * Math.sin(x / 31 + 2) + 3 * Math.sin(x / 9);
    rect(ctx, '#a6d6c4', x, floorY - 40 - h, 1, h + 18);
    if (hash(x + 8440) < 0.12) rect(ctx, '#8cc4ac', x, floorY - 41 - h, 2, 3);
  }
  rect(ctx, 'rgba(220, 244, 254, 0.35)', 0, floorY - 46, W, 8);
  hills(ctx, floorY - 24, 26, 60, 0, '#9ad87a', '#b8ec98');
  rect(ctx, '#9ad87a', 0, floorY - 24, W, 24);
}
// The near hill and its trees, the brook at its foot, and the field.
function sunNear(ctx, floorY) {
  hills(ctx, floorY - 8, 22, 44, 70, '#72c45a', '#92e472');
  // Hedgerows and little round trees along the near hill.
  for (let i = 0; i < 9; i++) {
    const tx = 10 + i * 36 + hash(i + 8400) * 14;
    const h = 7 + hash(i + 8410) * 6;
    const base = floorY - 8 - 22 * (0.55 + 0.45 * Math.sin((tx + 70) / 44)) - 22 * 0.25 * Math.sin((tx + 70) / (44 * 0.37)) + 3;
    rect(ctx, '#6a4524', tx - 1, base - 3, 2, 4);
    disc(ctx, '#3f9a42', tx, base - h / 2 - 2, Math.round(h / 2) + 1);
    disc(ctx, '#62c05a', tx - 1, base - h / 2 - 3, Math.round(h / 3));
  }
  // The brook, with grassy banks.
  rect(ctx, '#6ab4d8', 0, floorY - 7, W, 7);
  rect(ctx, '#8ccbe6', 0, floorY - 7, W, 1);
  rect(ctx, '#4f9cc4', 0, floorY - 2, W, 2);
  for (let x = 0; x < W; x += 3) {
    rect(ctx, '#5aa846', x, floorY - 8 + Math.round(hash(x + 8450) * 1.4), 3, 1);
    if (hash(x + 8460) < 0.3) rect(ctx, '#4a9a3a', x, floorY - 10, 1, 3);
  }
  // The field underfoot.
  rect(ctx, '#5cb844', 0, floorY, W, FLOOR_HEIGHT);
  rect(ctx, '#82dc62', 0, floorY, W, 2);
  // A thin crack running out under the grass. Nobody's noticed it.
  for (const [x, y, w] of [[146, 9, 4], [149, 10, 3], [151, 11, 5], [155, 10, 2], [156, 12, 4], [159, 13, 3], [161, 12, 2]]) {
    rect(ctx, '#3f8a30', x, floorY + y, w, 1);
  }
  rect(ctx, '#2f6a24', 152, floorY + 11, 2, 1);
}
function drawSunnyside(ctx, time, height) {
  const band = Math.ceil(height / SUN_SKY.length);
  SUN_SKY.forEach((color, i) => rect(ctx, color, 0, i * band, W, band));
  const floorY = height - FLOOR_HEIGHT;
  // The sun, with rays turning slowly and each breathing a little.
  glow(ctx, 250, 34, 90, '255, 244, 190', 0.55);
  for (let i = 0; i < 12; i++) {
    const a = time * 0.08 + (i * Math.PI) / 6;
    const k = 0.6 + 0.25 * Math.sin(time * 0.6 + i * 1.3);
    for (let r = 14; r < 30; r++) rect(ctx, `rgba(255, 250, 210, ${(k * (1 - (r - 14) / 20)).toFixed(3)})`, 250 + Math.cos(a) * r, 34 + Math.sin(a) * r, 1, 1);
  }
  disc(ctx, '#fff6c8', 250, 34, 12);
  disc(ctx, '#ffffe8', 250, 34, 9);
  // Clouds drifting by.
  for (const c of SUN_CLOUDS) cloud(ctx, (c.x + time * c.speed) % (W + 80) - 40, c.y, c.size);
  // Birds far off.
  for (const b of SUN_BIRDS) {
    const x = (b.x + time * b.speed) % (W + 20) - 10;
    const flap = Math.sin(time * 6 + b.x) > 0 ? 1 : 0;
    rect(ctx, '#3a4a6a', x - 2, b.y + flap, 2, 1);
    rect(ctx, '#3a4a6a', x + 1, b.y + flap, 2, 1);
    rect(ctx, '#3a4a6a', x, b.y + 1 - flap, 1, 1);
  }
  // The far downs and hills, a windmill, then the near hill, the brook and the field.
  ctx.drawImage(cached('sun_far', height, (c) => sunHills(c, floorY)), 0, 0);
  windmill(ctx, 78, floorY - 40, time);
  ctx.drawImage(cached('sun_near', height, (c) => sunNear(c, floorY)), 0, 0);
  // The brook running: glints sliding along it, and a ripple of light.
  for (const g of SUN_GLINTS) {
    const x = (g.x + time * (9 + g.row * 3)) % W;
    const a = 0.45 + 0.4 * Math.sin(time * 2.2 + g.at);
    rect(ctx, `rgba(240, 252, 255, ${a.toFixed(3)})`, x, floorY - 6 + g.row * 2, 2 + g.row, 1);
  }
  for (let x = 0; x < W; x += 2) {
    if (Math.sin(x * 0.05 - time * 1.1) < 0.6) continue;
    rect(ctx, 'rgba(180, 226, 244, 0.6)', x, floorY - 4 + Math.round(Math.sin(x * 0.18 + time * 2.4) * 0.7), 2, 1);
  }
  // Grass and flowers stirring in the breeze.
  for (let x = 0; x < W; x += 5) {
    const sway = Math.round(Math.sin(time * 1.6 + x * 0.2));
    rect(ctx, '#4aa036', x + sway, floorY + 3 + hash(x + 8500) * 14, 1, 2);
    rect(ctx, '#92e86e', x + 2 + sway, floorY + 2 + hash(x + 8510) * 14, 1, 2);
  }
  for (const f of SUN_FLOWERS) {
    const x = f.x + Math.sin(time * 1.4 + f.sway) * 1.2;
    const y = floorY + 3 + f.y * (FLOOR_HEIGHT - 6);
    if (f.kind < 0.4) { rect(ctx, '#fffdf2', x - 1, y, 3, 1); rect(ctx, '#fffdf2', x, y - 1, 1, 3); rect(ctx, '#ffd23c', x, y, 1, 1); }
    else if (f.kind < 0.8) { rect(ctx, '#ffd62e', x, y, 2, 2); rect(ctx, '#fff3a0', x, y, 1, 1); }
    else { rect(ctx, '#f08ab8', x, y, 2, 2); }
  }
  // Cloud shadows sliding over the hill and the field, in step with the clouds.
  ctx.fillStyle = 'rgba(30, 80, 60, 0.1)';
  for (const c of SUN_CLOUDS) {
    const x = (c.x + time * c.speed) % (W + 80) - 70;
    ctx.beginPath();
    ctx.ellipse(x, floorY - 4 + c.y * 0.2, 26 * c.size + 10, 5 + 3 * c.size, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Butterflies.
  for (const b of SUN_BUTTERFLIES) {
    const x = (b.x + Math.sin(time * 0.5 + b.phase) * 30 + W) % W;
    const y = floorY - 10 - b.y * 50 + Math.sin(time * 1.3 + b.phase) * 6;
    const open = Math.sin(time * 14 + b.phase) > 0;
    rect(ctx, b.color, x - (open ? 2 : 1), y, open ? 2 : 1, 2);
    rect(ctx, b.color, x + 1, y, open ? 2 : 1, 2);
    rect(ctx, '#2a1c20', x, y, 1, 2);
  }
  // Dandelion seeds drifting over on the breeze, rising and dipping.
  for (const s of SUN_SEEDS) {
    const x = (s.x + time * s.speed) % (W + 40) - 20;
    const y = 18 + s.y * (floorY - 24) + Math.sin(time * 0.9 + s.bob) * 5 - Math.sin(time * 0.2 * s.rise + s.bob) * 4;
    const a = 0.75 + 0.2 * Math.sin(time * 2 + s.bob);
    rect(ctx, `rgba(255, 255, 255, ${(a * 0.45).toFixed(3)})`, x - 1, y - 1, 3, 1);
    rect(ctx, `rgba(255, 255, 255, ${(a * 0.45).toFixed(3)})`, x, y - 2, 1, 1);
    rect(ctx, `rgba(255, 255, 255, ${a.toFixed(3)})`, x, y - 1, 1, 1);
    rect(ctx, 'rgba(150, 140, 110, 0.6)', x, y, 1, 1);
  }
  // Warm light over everything.
  glow(ctx, 250, 20, 160, '255, 240, 180', 0.12);
}

// ===================== THE GLIMMERING =====================
const GLIM_SKY = ['#100a2c', '#150e36', '#1a123f', '#201648', '#271b52', '#2e215c', '#352866', '#3d2f70'];
const GLIM_HUES = [
  { dark: '#1f9ea8', mid: '#4fe0d0', light: '#b8fff0', rgb: '90, 240, 220' },
  { dark: '#b8309a', mid: '#ff6ac8', light: '#ffc4ec', rgb: '255, 120, 200' },
  { dark: '#6a40d0', mid: '#a888ff', light: '#dccaff', rgb: '170, 130, 255' },
  { dark: '#d08a1c', mid: '#ffd24a', light: '#fff0a0', rgb: '255, 214, 110' },
];
// Crystal groups: x, how big, hue, which wall (-1 ceiling, 0 floor, 1 back wall height).
const GLIM_GROUPS = [
  { x: 14, s: 44, hue: 2, at: 'floor' }, { x: 58, s: 26, hue: 0, at: 'floor' }, { x: 120, s: 18, hue: 3, at: 'back' },
  { x: 168, s: 30, hue: 1, at: 'back' }, { x: 214, s: 22, hue: 0, at: 'back' }, { x: 262, s: 48, hue: 1, at: 'floor' },
  { x: 300, s: 30, hue: 3, at: 'floor' }, { x: 36, s: 24, hue: 1, at: 'ceil' }, { x: 100, s: 34, hue: 2, at: 'ceil' },
  { x: 188, s: 28, hue: 3, at: 'ceil' }, { x: 244, s: 36, hue: 0, at: 'ceil' }, { x: 300, s: 22, hue: 2, at: 'ceil' },
];
const GLIM_MOTES = Array.from({ length: 34 }, (_, i) => ({
  x: hash(i + 8600) * W, y: hash(i + 8610), speed: 2 + hash(i + 8620) * 5, sway: hash(i + 8630) * 6.28, hue: Math.floor(hash(i + 8640) * 4),
}));
function crystalGroup(ctx, x, y, s, hue, up, glowK) {
  const c = GLIM_HUES[hue];
  const shards = [[-0.55, 0.6, -0.22], [0, 1, 0.02], [0.5, 0.74, 0.2], [0.95, 0.4, 0.34], [-1, 0.38, -0.36]];
  for (const [dx, tall, lean] of shards) {
    const h = s * tall;
    const w = Math.max(3, s * 0.24);
    const bx = x + dx * s * 0.5;
    const tipX = bx + lean * h * 0.5;
    const tipY = y - up * h;
    ctx.beginPath();
    ctx.moveTo(bx - w / 2, y);
    ctx.lineTo(bx + w / 2, y);
    ctx.lineTo(tipX, tipY);
    ctx.closePath();
    ctx.fillStyle = c.dark;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(bx - w / 2, y);
    ctx.lineTo(bx, y);
    ctx.lineTo(tipX, tipY);
    ctx.closePath();
    ctx.fillStyle = c.mid;
    ctx.fill();
    ctx.fillStyle = c.light;
    ctx.globalAlpha = 0.55 + 0.4 * glowK;
    // A bright edge down the lit face, from near the tip to halfway to the base.
    for (let f = 0.12; f < 0.6; f += 0.12) {
      const ex = tipX + (bx - w / 2 + 1 - tipX) * f;
      const ey = tipY + (y - tipY) * f;
      ctx.fillRect(Math.round(ex), Math.round(Math.min(ey, ey + up * h * 0.12)), 1, Math.max(1, Math.round(h * 0.12)));
    }
    ctx.globalAlpha = 1;
  }
}
// Shafts of light slanting down from cracks in the roof (x at the roof, x at
// the floor, width), with dust turning in them.
const GLIM_BEAMS = [
  { top: 30, foot: 64, w: 14, phase: 0 }, { top: 92, foot: 108, w: 9, phase: 2.1 },
  { top: 236, foot: 262, w: 16, phase: 4.2 }, { top: 290, foot: 300, w: 8, phase: 1.3 },
];
const GLIM_DUST = Array.from({ length: 30 }, (_, i) => ({
  beam: i % GLIM_BEAMS.length, k: hash(i + 8650), y: hash(i + 8660), speed: 1 + hash(i + 8670) * 2, sway: hash(i + 8680) * 6.28,
}));
// Great mushrooms standing at the cave's sides: x, stalk height, cap radius, lean.
const GLIM_SHROOMS = [
  { x: 92, h: 40, r: 15, lean: -3, phase: 0.6 }, { x: 236, h: 52, r: 19, lean: 4, phase: 2.8 }, { x: 8, h: 30, r: 11, lean: 2, phase: 4.6 },
];
// Now and then a glint runs up a crystal: which group, how often.
const GLIM_GLINTS = Array.from({ length: 7 }, (_, i) => ({ group: [0, 5, 6, 8, 10, 1, 3][i], every: 5 + hash(i + 8690) * 5, at: hash(i + 8695) * 9 }));

// The far chamber, the back wall and its veins: still, so drawn once.
function glimWall(ctx, floorY) {
  // A deeper chamber far behind, its crystals hazed over.
  for (let x = 0; x < W; x += 2) {
    const h = 54 + 16 * Math.sin(x * 0.021 + 1) + 6 * Math.sin(x * 0.09);
    rect(ctx, '#231a4e', x, floorY - h - 40, 2, h + 40);
  }
  for (let i = 0; i < 14; i++) {
    const fx = hash(i + 8710) * W;
    const fh = 6 + hash(i + 8720) * 12;
    const base = floorY - 66 - hash(i + 8730) * 20;
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = GLIM_HUES[i % 4].dark;
    ctx.beginPath();
    ctx.moveTo(fx - 2, base);
    ctx.lineTo(fx + 2, base);
    ctx.lineTo(fx + (hash(i + 8740) - 0.5) * 4, base - fh);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // The back wall: layered rock with veins.
  for (let x = 0; x < W; x += 2) {
    const h = 30 + 18 * Math.sin(x * 0.03) + 10 * Math.sin(x * 0.11 + 2);
    rect(ctx, '#2a1f58', x, floorY - h - 30, 2, h + 30);
    rect(ctx, '#3a2c70', x, floorY - h - 30, 2, 1);
  }
  ctx.globalAlpha = 0.7;
  for (let i = 0; i < 9; i++) {
    for (let k = 0; k < 26; k++) {
      const [x, y] = glimVein(i, k);
      rect(ctx, GLIM_HUES[i % 4].dark, x, y, 1, 4);
    }
  }
  ctx.globalAlpha = 1;
}
// A point on one of the back wall's veins of crystal (k from 0 to 26, top to bottom).
function glimVein(i, k) {
  return [10 + i * 36 + hash(i + 8700) * 10 + k * 0.8 + Math.sin(k * 0.5 + i) * 2, 30 + k * 3 + (i % 3) * 8];
}
function glimShroom(ctx, m, floorY, time) {
  const k = 0.6 + 0.4 * Math.sin(time * 0.7 + m.phase);
  const capY = floorY - m.h;
  glow(ctx, m.x + m.lean, capY + 4, m.r * 2.6, '120, 230, 255', 0.16 * k);
  for (let y = 0; y < m.h; y++) {
    const t = y / m.h;
    const x = m.x + m.lean * t * t;
    rect(ctx, '#6a5c9a', x - 2, floorY - y, 5, 1);
    rect(ctx, '#a89cd0', x - 2, floorY - y, 1, 1);
    rect(ctx, '#4a3e78', x + 2, floorY - y, 1, 1);
  }
  // The cap, and the gills underneath glowing.
  const cx = m.x + m.lean;
  ctx.fillStyle = '#3a2a78';
  ctx.beginPath();
  ctx.ellipse(cx, capY, m.r, m.r * 0.55, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#5a46a8';
  ctx.beginPath();
  ctx.ellipse(cx - 2, capY - 1, m.r - 3, m.r * 0.45, 0, Math.PI, 0);
  ctx.fill();
  rect(ctx, `rgba(140, 240, 255, ${(0.45 + 0.4 * k).toFixed(3)})`, cx - m.r + 2, capY, m.r * 2 - 4, 1);
  rect(ctx, `rgba(90, 200, 230, ${(0.3 + 0.3 * k).toFixed(3)})`, cx - m.r + 4, capY + 1, m.r * 2 - 8, 1);
  for (let s = 0; s < 5; s++) {
    const a = Math.PI * (1.15 + s * 0.17);
    const sx = cx + Math.cos(a) * m.r * 0.65;
    const sy = capY + Math.sin(a) * m.r * 0.38;
    const tw = 0.5 + 0.5 * Math.sin(time * 1.1 + m.phase + s * 1.7);
    rect(ctx, `rgba(200, 250, 255, ${(0.4 + 0.5 * tw).toFixed(3)})`, sx, sy, 2, 1);
  }
}
function drawGlimmer(ctx, time, height) {
  const band = Math.ceil(height / GLIM_SKY.length);
  GLIM_SKY.forEach((color, i) => rect(ctx, color, 0, i * band, W, band));
  const floorY = height - FLOOR_HEIGHT;
  ctx.drawImage(cached('glim_wall', height, (c) => glimWall(c, floorY)), 0, 0);
  // The crystals' light washing the cave, each breathing on its own time.
  const groupY = (g, i) => (g.at === 'ceil' ? 0 : g.at === 'back' ? floorY - 30 - (i % 3) * 14 : floorY + 6);
  GLIM_GROUPS.forEach((g, i) => {
    const k = 0.6 + 0.4 * Math.sin(time * 1.2 + i * 1.9);
    const y = g.at === 'ceil' ? 2 : g.at === 'back' ? floorY - 40 - (i % 3) * 14 : floorY;
    glow(ctx, g.x, y + (g.at === 'ceil' ? g.s * 0.5 : -g.s * 0.4), g.s * 2.4, GLIM_HUES[g.hue].rgb, 0.3 * k);
  });
  // Light seeping slowly down the veins, one bead at a time.
  for (let i = 0; i < 9; i++) {
    const k = ((time * 3 + i * 7.3) % 40);
    if (k > 26) continue;
    for (let tail = 0; tail < 4; tail++) {
      if (k - tail < 0) break;
      const [x, y] = glimVein(i, Math.floor(k - tail));
      ctx.globalAlpha = 0.8 - tail * 0.2;
      rect(ctx, GLIM_HUES[i % 4].mid, x, y, 1, 3);
      ctx.globalAlpha = 1;
      if (tail === 0) glow(ctx, x, y + 1, 6, GLIM_HUES[i % 4].rgb, 0.3);
    }
  }
  // Shafts of pale light from the roof, swelling and fading very slowly.
  for (const b of GLIM_BEAMS) {
    const k = 0.5 + 0.5 * Math.sin(time * 0.35 + b.phase);
    const shaft = ctx.createLinearGradient(0, 0, 0, floorY);
    shaft.addColorStop(0, `rgba(230, 220, 255, ${(0.13 + 0.07 * k).toFixed(3)})`);
    shaft.addColorStop(1, 'rgba(230, 220, 255, 0)');
    ctx.fillStyle = shaft;
    ctx.beginPath();
    ctx.moveTo(b.top - b.w * 0.3, 0);
    ctx.lineTo(b.top + b.w * 0.3, 0);
    ctx.lineTo(b.foot + b.w, floorY);
    ctx.lineTo(b.foot - b.w, floorY);
    ctx.closePath();
    ctx.fill();
  }
  // Far crystals on the back wall, the great mushrooms, then the ceiling's hanging crystals.
  GLIM_GROUPS.forEach((g, i) => {
    const k = 0.6 + 0.4 * Math.sin(time * 1.2 + i * 1.9);
    if (g.at === 'back') crystalGroup(ctx, g.x, groupY(g, i), g.s * 0.8, g.hue, 1, k);
  });
  for (const m of GLIM_SHROOMS) glimShroom(ctx, m, floorY, time);
  GLIM_GROUPS.forEach((g, i) => {
    const k = 0.6 + 0.4 * Math.sin(time * 1.2 + i * 1.9);
    if (g.at === 'ceil') crystalGroup(ctx, g.x, 0, g.s, g.hue, -1, k);
  });
  // The floor: pale lilac stone, with luminous moss.
  rect(ctx, '#5a4e94', 0, floorY, W, FLOOR_HEIGHT);
  rect(ctx, '#8a7acc', 0, floorY, W, 2);
  for (let x = 0; x < W; x += 6) rect(ctx, '#6a5ea8', x + hash(x + 8800) * 4, floorY + 4 + hash(x + 8810) * 12, 5, 1);
  for (let i = 0; i < 6; i++) {
    const mx = 30 + i * 52 + hash(i + 8820) * 20;
    rect(ctx, '#2f9e8a', mx, floorY + 3, 22, 3);
    rect(ctx, '#58e0b8', mx + 2, floorY + 3, 14, 1);
    for (let d = 0; d < 4; d++) {
      const tw = 0.5 + 0.5 * Math.sin(time * 1.5 + i * 2 + d * 1.3);
      rect(ctx, `rgba(232, 255, 244, ${(0.4 + 0.6 * tw).toFixed(3)})`, mx + 3 + d * 5, floorY + 4, 1, 1);
    }
  }
  // Where the shafts touch the floor, a soft pool of light.
  for (const b of GLIM_BEAMS) {
    const k = 0.5 + 0.5 * Math.sin(time * 0.35 + b.phase);
    ctx.fillStyle = `rgba(230, 220, 255, ${(0.1 + 0.06 * k).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(b.foot, floorY + 2, b.w + 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  GLIM_GROUPS.forEach((g, i) => {
    const k = 0.6 + 0.4 * Math.sin(time * 1.2 + i * 1.9);
    if (g.at === 'floor') crystalGroup(ctx, g.x, groupY(g, i), g.s, g.hue, 1, k);
  });
  // A glint running up a crystal's face now and then, soft, never a flash.
  for (const gl of GLIM_GLINTS) {
    const k = ((time + gl.at) % gl.every) / gl.every;
    if (k > 0.2) continue;
    const g = GLIM_GROUPS[gl.group];
    const up = g.at === 'ceil' ? -1 : 1;
    const s = g.at === 'back' ? g.s * 0.8 : g.s;
    const f = k / 0.2;
    const a = Math.sin(f * Math.PI) * 0.7;
    const x = g.x + 0.02 * s + (up > 0 ? -1 : 1);
    const y = groupY(g, gl.group) - up * s * (0.15 + f * 0.7);
    rect(ctx, `rgba(255, 255, 255, ${a.toFixed(3)})`, x, y - 1, 1, 3);
    rect(ctx, `rgba(255, 255, 255, ${(a * 0.6).toFixed(3)})`, x - 1, y, 3, 1);
  }
  // Dust turning in the shafts, lit only while it's inside one.
  for (const d of GLIM_DUST) {
    const b = GLIM_BEAMS[d.beam];
    const y = ((d.y + time * 0.01 * d.speed) % 1) * floorY;
    const t = y / floorY;
    const x = b.top + (b.foot - b.top) * t + (d.k - 0.5) * (b.w * 0.6 + b.w * 1.4 * t) + Math.sin(time * 0.6 + d.sway) * 2;
    const a = (0.35 + 0.3 * Math.sin(time * 1.7 + d.sway)) * (1 - t * 0.6);
    rect(ctx, `rgba(255, 250, 235, ${a.toFixed(3)})`, x, y, 1, 1);
  }
  // Motes of light drifting up.
  for (const m of GLIM_MOTES) {
    const y = height - ((m.y * height + time * m.speed) % height);
    const x = (m.x + Math.sin(time * 0.7 + m.sway) * 8 + W) % W;
    ctx.globalAlpha = Math.max(0, 0.4 + 0.5 * Math.sin(time * 3 + m.sway));
    rect(ctx, GLIM_HUES[m.hue].light, x, y, 1, 1);
    ctx.globalAlpha = 1;
  }
}

// ===================== BELOWTOWN =====================
const BT_SKY = ['#1c1426', '#221829', '#281c2c', '#2e2030', '#352532', '#3c2a34', '#432f36', '#4a3538'];
const BT_HOUSES = [
  { x: 6, w: 42, h: 36 }, { x: 60, w: 30, h: 28 }, { x: 106, w: 38, h: 40 }, { x: 160, w: 28, h: 30 },
  { x: 204, w: 40, h: 34 }, { x: 258, w: 34, h: 28 },
];
const BT_FLIES = Array.from({ length: 16 }, (_, i) => ({ x: hash(i + 9000) * W, y: hash(i + 9010), phase: hash(i + 9020) * 6.28, speed: 0.4 + hash(i + 9030) }));
// Houses far up the cavern walls, in tiers: x, y of the floor line, width, height.
const BT_TIERS = Array.from({ length: 16 }, (_, i) => {
  const left = i < 8;
  const n = i % 8;
  const row = n % 3;
  return { x: (left ? 4 : 222) + Math.floor(n / 3) * 30 + hash(i + 9040) * 10 + row * 6, y: 70 - row * 16 + hash(i + 9050) * 4, w: 12 + hash(i + 9060) * 10, h: 8 + hash(i + 9070) * 6 };
});
// Smoke curling up from the chimneys, and embers lifting from the forge's.
const BT_CHIMNEYS = [{ x: 30, house: 0, forge: false }, { x: 128, house: 2, forge: true }, { x: 226, house: 4, forge: false }];
const BT_EMBERS = Array.from({ length: 12 }, (_, i) => ({ k: hash(i + 9080), speed: 6 + hash(i + 9090) * 6, sway: hash(i + 9095) * 6.28 }));
const BT_DUST = Array.from({ length: 22 }, (_, i) => ({ x: hash(i + 9300), y: hash(i + 9310), speed: 1 + hash(i + 9320) * 2, sway: hash(i + 9330) * 6.28 }));
function lampString(ctx, x0, y0, x1, y1, sag, time, seed) {
  // The string swings a little, as if a draught ran down the street.
  const swing = Math.sin(time * 0.7 + seed) * 2;
  const n = 40;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * (sag + swing);
    rect(ctx, '#2a1c14', x, y, 1, 1);
  }
  for (let i = 1; i < 8; i++) {
    const t = i / 8;
    const x = x0 + (x1 - x0) * t + Math.sin(time * 1.1 + i + seed) * 0.6 * Math.sin(t * Math.PI);
    const y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * (sag + swing) + 2;
    const flicker = 0.78 + 0.12 * Math.sin(time * 3 + i * 1.7 + seed) + 0.06 * Math.sin(time * 11 + i * 4.1);
    glow(ctx, x, y + 2, 11, '255, 200, 110', 0.5 * flicker);
    rect(ctx, '#2a1c14', x, y - 1, 1, 1);
    rect(ctx, '#ffc866', x - 1, y, 3, 3);
    rect(ctx, '#fff6c0', x, y, 1, 2);
  }
}
// The far tiers, the old arches and the houses' walls and roofs: still, so drawn once.
function btTown(ctx, floorY) {
  // The cavern's far walls rising either side, terraced and built on.
  for (const [x0, x1, dir] of [[0, 110, 1], [210, W, -1]]) {
    for (let x = x0; x < x1; x++) {
      const t = dir > 0 ? (x - x0) / (x1 - x0) : (x1 - x) / (x1 - x0);
      const top = 22 + t * t * 60 + Math.sin(x * 0.2) * 2;
      rect(ctx, '#2c2130', x, top, 1, floorY - top);
    }
  }
  for (const h of BT_TIERS) {
    rect(ctx, '#3a2c38', h.x, h.y - h.h, h.w, h.h);
    rect(ctx, '#2a3a2c', h.x - 1, h.y - h.h - 2, h.w + 2, 2);
    rect(ctx, '#33263a', h.x - 3, h.y, h.w + 6, 2);
  }
  // A haze over the far walls.
  rect(ctx, 'rgba(70, 50, 60, 0.35)', 0, 0, W, floorY);
  // The cavern's ceiling and hanging rock.
  for (let x = 0; x < W; x += 3) rect(ctx, '#1a1220', x, 0, 3, 6 + hash(x + 9100) * 14);
  // Old carved arches of the buried city, far back.
  for (let i = 0; i < 6; i++) {
    const ax = 20 + i * 56;
    rect(ctx, '#4a3c3c', ax, floorY - 66, 8, 66);
    rect(ctx, '#6a5a54', ax, floorY - 66, 2, 66);
    rect(ctx, '#3a2e30', ax + 6, floorY - 66, 2, 66);
    rect(ctx, '#4a3c3c', ax + 40, floorY - 66, 8, 66);
    rect(ctx, '#6a5a54', ax + 40, floorY - 66, 2, 66);
    for (let k = 0; k < 24; k++) {
      const a = (k / 24) * Math.PI;
      rect(ctx, k % 2 ? '#5a4a48' : '#4a3c3c', ax + 24 - Math.cos(a) * 24 - 2, floorY - 66 - Math.sin(a) * 12, 5, 3);
    }
    // Moss and a hanging vine on the old stone.
    rect(ctx, '#3a5034', ax, floorY - 67, 9, 1);
    for (let v = 0; v < 6 + (i % 3) * 4; v++) rect(ctx, '#3e5a36', ax + 3 + (v % 2), floorY - 64 + v * 2, 1, 2);
  }
  // Houses of carved stone and timber.
  for (const h of BT_HOUSES) {
    rect(ctx, '#6a5a54', h.x, floorY - h.h, h.w, h.h);
    rect(ctx, '#7e6c66', h.x, floorY - h.h, h.w, 2);
    rect(ctx, '#4a3c3c', h.x + h.w - 3, floorY - h.h, 3, h.h);
    // Courses of carved stone, and a timber patch where the creature folk mended it.
    for (let r = floorY - h.h + 6; r < floorY - 2; r += 6) rect(ctx, '#5e4e4a', h.x, r, h.w - 3, 1);
    rect(ctx, '#7a5434', h.x + 2, floorY - h.h + 4, 6, 10);
    rect(ctx, '#946a42', h.x + 2, floorY - h.h + 4, 6, 1);
    rect(ctx, '#5a3a22', h.x + 4, floorY - h.h + 5, 1, 9);
    // Moss roof.
    rect(ctx, '#3a5e34', h.x - 3, floorY - h.h - 6, h.w + 6, 7);
    rect(ctx, '#6aa058', h.x - 3, floorY - h.h - 6, h.w + 6, 1);
    for (let m = 0; m < h.w; m += 6) rect(ctx, '#86c070', h.x + m, floorY - h.h - 5, 2, 1);
    for (let m = 1; m < h.w + 4; m += 5) rect(ctx, '#2e4a2a', h.x - 2 + m, floorY - h.h + 1, 1, 1 + (m % 3));
    // A round door.
    disc(ctx, '#8a5a32', h.x + Math.floor(h.w / 2), floorY - 5, 5);
    rect(ctx, '#8a5a32', h.x + Math.floor(h.w / 2) - 5, floorY - 5, 11, 5);
    rect(ctx, '#6a4224', h.x + Math.floor(h.w / 2), floorY - 10, 1, 10);
    rect(ctx, '#f0c050', h.x + Math.floor(h.w / 2) + 2, floorY - 4, 1, 1);
  }
  for (const c of BT_CHIMNEYS) {
    const h = BT_HOUSES[c.house];
    rect(ctx, '#4a3c3c', c.x - 2, floorY - h.h - 12, 5, 8);
    rect(ctx, '#6a5a54', c.x - 2, floorY - h.h - 12, 5, 1);
  }
}
function drawBelowtown(ctx, time, height) {
  const band = Math.ceil(height / BT_SKY.length);
  BT_SKY.forEach((color, i) => rect(ctx, color, 0, i * band, W, band));
  const floorY = height - FLOOR_HEIGHT;
  // The Sunstone, far overhead, filling the cavern with light.
  glow(ctx, W / 2, -10, 230, '255, 220, 150', 0.5);
  disc(ctx, '#ffe9a8', W / 2, -4, 18);
  disc(ctx, '#fff6d0', W / 2, -4, 13);
  ctx.drawImage(cached('bt_town', height, (c) => btTown(c, floorY)), 0, 0);
  // Little windows lit up the far tiers, now and then one going out or coming on.
  for (const [i, h] of BT_TIERS.entries()) {
    const on = Math.sin(time * 0.15 + i * 2.7) > -0.7;
    if (!on) continue;
    const flick = 0.75 + 0.2 * Math.sin(time * 2 + i * 1.9);
    rect(ctx, `rgba(255, 196, 110, ${(0.55 * flick).toFixed(3)})`, h.x + 3, h.y - h.h + 3, 2, 2);
    if (h.w > 16) rect(ctx, `rgba(255, 196, 110, ${(0.45 * flick).toFixed(3)})`, h.x + h.w - 6, h.y - h.h + 3, 2, 2);
  }
  // The Sunstone's light coming down in long, slow rays.
  for (let i = 0; i < 5; i++) {
    ctx.globalAlpha = 0.05 + 0.03 * Math.sin(time * 0.5 + i * 1.7);
    ctx.fillStyle = '#ffe6a0';
    const x = W / 2 + (i - 2) * 48;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 6 + (i - 2) * 6, 0);
    ctx.lineTo(W / 2 + 6 + (i - 2) * 6, 0);
    ctx.lineTo(x + 20, floorY);
    ctx.lineTo(x - 20, floorY);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // Dust hanging in the Sunstone's light.
  for (const d of BT_DUST) {
    const y = ((d.y + time * 0.008 * d.speed) % 1) * floorY;
    const x = d.x * W + Math.sin(time * 0.4 + d.sway) * 4;
    rect(ctx, `rgba(255, 236, 190, ${(0.2 + 0.15 * Math.sin(time * 1.3 + d.sway)).toFixed(3)})`, x, y, 1, 1);
  }
  // Smoke curling up from the chimneys; sparks from the forge's.
  for (const [n, c] of BT_CHIMNEYS.entries()) {
    const top = floorY - BT_HOUSES[c.house].h - 13;
    for (let p = 0; p < 6; p++) {
      const k = (time * 0.12 + p / 6 + n * 0.3) % 1;
      const r = 2 + k * 6;
      ctx.fillStyle = `rgba(120, 100, 110, ${(0.22 * (1 - k)).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(c.x + Math.sin(k * 5 + n) * 4 + k * 6, top - k * 34, r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!c.forge) continue;
    glow(ctx, c.x, top, 10, '255, 140, 60', 0.25 + 0.08 * Math.sin(time * 5));
    for (const e of BT_EMBERS) {
      const k = (time * e.speed * 0.04 + e.k) % 1;
      const a = (1 - k) * (0.6 + 0.3 * Math.sin(time * 9 + e.sway));
      rect(ctx, `rgba(255, ${Math.round(150 + 80 * (1 - k))}, 80, ${a.toFixed(3)})`, c.x + Math.sin(time * 1.5 + e.sway) * (2 + k * 6), top - k * 40, 1, 1);
    }
  }
  // The houses' windows, lit warm, flickering a little.
  for (const [i, h] of BT_HOUSES.entries()) {
    for (let w = 0; w < Math.floor(h.w / 12); w++) {
      const wx = h.x + 6 + w * 12 + (w === 0 && h.w > 30 ? 4 : 0);
      const wy = floorY - h.h + 8;
      const flick = 0.85 + 0.1 * Math.sin(time * 2.5 + w * 2 + i) + 0.05 * Math.sin(time * 9 + i * 3 + w);
      glow(ctx, wx + 3, wy + 4, 14, '255, 190, 100', 0.35 * flick);
      // An arched window: dark frame, warm glass, a cross of timber.
      rect(ctx, '#3a2418', wx - 1, wy, 9, 9);
      rect(ctx, '#3a2418', wx, wy - 1, 7, 1);
      rect(ctx, `rgba(255, 198, 92, ${flick.toFixed(3)})`, wx, wy + 1, 7, 7);
      rect(ctx, `rgba(255, 198, 92, ${flick.toFixed(3)})`, wx + 1, wy, 5, 1);
      rect(ctx, '#ffe8a8', wx + 1, wy + 1, 2, 2);
      rect(ctx, '#5a3a1e', wx + 3, wy, 1, 8);
      rect(ctx, '#5a3a1e', wx, wy + 4, 7, 1);
      rect(ctx, '#8a6a4a', wx - 1, wy + 8, 9, 1);
    }
  }
  // Strings of glow-worm lamps across the street.
  lampString(ctx, 0, 40, W * 0.55, 28, 14, time, 0);
  lampString(ctx, W * 0.45, 30, W, 46, 16, time, 3);
  // Mushroom-cap awnings.
  for (const [x, c] of [[40, '#d8502e'], [176, '#e0802e'], [262, '#a8508a']]) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(x, floorY - 12, 22, 10, 0, Math.PI, 0);
    ctx.fill();
    for (const dx of [-12, -2, 8, 14]) disc(ctx, '#f8ecd0', x + dx, floorY - 17 + Math.abs(dx) / 6, 2);
    rect(ctx, '#f0d8b0', x - 22, floorY - 12, 44, 2);
    rect(ctx, 'rgba(40, 20, 20, 0.35)', x - 20, floorY - 10, 40, 2);
  }
  // Cobbles underfoot, warm.
  rect(ctx, '#6a5a50', 0, floorY, W, FLOOR_HEIGHT);
  rect(ctx, '#9a8878', 0, floorY, W, 2);
  for (let r = 0; r < 4; r++) {
    for (let x = -(r % 2) * 6; x < W; x += 12) {
      rect(ctx, hash(x + r * 31 + 9200) < 0.5 ? '#7a6a5e' : '#86766a', x + 1, floorY + 3 + r * 4, 10, 3);
      rect(ctx, '#a89888', x + 1, floorY + 3 + r * 4, 9, 1);
    }
  }
  // Lamp-light spilling over the street, and glow-worms drifting like fireflies.
  glow(ctx, W / 2, floorY, 200, '255, 190, 110', 0.18);
  for (const f of BT_FLIES) {
    const x = (f.x + Math.sin(time * f.speed + f.phase) * 18 + W) % W;
    const y = 30 + f.y * (floorY - 40) + Math.sin(time * f.speed * 1.3 + f.phase) * 6;
    ctx.globalAlpha = Math.max(0, 0.4 + 0.5 * Math.sin(time * 2 + f.phase));
    rect(ctx, '#ffe48a', x, y, 1, 1);
    ctx.globalAlpha = 1;
  }
}

export const BRIGHT_BACKDROPS = {
  sunnyside: drawSunnyside,
  glimmer: drawGlimmer,
  belowtown: drawBelowtown,
};
