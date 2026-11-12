import { SCREEN_WIDTH as W } from '../config.js';

// The Glass Pool: where Pudding the Glass Olm is fought (`backdrop:
// 'glass_pool'` in src/data/enemies/pudding.js; registered in backdrops.js).
// The bottom of the glassy shaft under Seam Nine: a cavern where something
// very hot came through once and fused the rock to green-black glass. Sheets
// of it hang from the roof like frozen curtains, the walls are glossy and
// fissured with veins of cold light, and the floor is a still pool that
// gives the whole cavern back upside down. Slow rays of star-light wander
// through the glass. At the left, on a shelf nobody has touched, the
// miners' tea break: a kettle and seven tin mugs, and a small tin dish.
// Each backdrop draws the scene from y = 0 down to `height`; the battle
// panel covers the rest.

const FLOOR_HEIGHT = 22;

function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const SKY = ['#030810', '#040a14', '#050d18', '#06101d', '#081423', '#0a1829', '#0c1c30', '#0e2036'];
const CURTAINS = Array.from({ length: 16 }, (_, i) => ({
  x: Math.round((i + 0.5) * (W / 16) + (hash(i + 4000) - 0.5) * 14),
  len: 14 + Math.round(hash(i + 4010) * 38),
  w: 5 + Math.round(hash(i + 4020) * 7),
  phase: hash(i + 4030) * Math.PI * 2,
}));
const VEINS = Array.from({ length: 14 }, (_, i) => ({
  x: hash(i + 4100) * W,
  y: 10 + hash(i + 4110) * 80,
  len: 12 + hash(i + 4120) * 30,
  slope: (hash(i + 4130) - 0.5) * 1.6,
  phase: hash(i + 4140) * Math.PI * 2,
}));
const MOTES = Array.from({ length: 36 }, (_, i) => ({
  x: hash(i + 4200) * W, y: hash(i + 4210), speed: 2 + hash(i + 4220) * 5, sway: hash(i + 4230) * Math.PI * 2,
}));

const rect = (ctx, color, x, y, w, h) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};

// A hanging sheet of fused glass: a pale green wedge, brighter on one edge.
function drawCurtain(ctx, c, time) {
  const glint = 0.5 + 0.5 * Math.sin(time * 0.9 + c.phase);
  ctx.fillStyle = '#0d2a33';
  ctx.beginPath();
  ctx.moveTo(c.x - c.w, 0); ctx.lineTo(c.x + c.w, 0); ctx.lineTo(c.x + 1, c.len); ctx.closePath(); ctx.fill();
  ctx.fillStyle = `rgba(150, 240, 230, ${(0.25 + 0.35 * glint).toFixed(3)})`;
  ctx.beginPath();
  ctx.moveTo(c.x - c.w * 0.2, 0); ctx.lineTo(c.x + c.w * 0.6, 0); ctx.lineTo(c.x + 1, c.len * 0.8); ctx.closePath(); ctx.fill();
}

function drawPool(ctx, time, height) {
  const top = height - FLOOR_HEIGHT - 4;
  // Back wall: glossy, with a few cold veins of light in it.
  const band = Math.ceil(top / SKY.length);
  SKY.forEach((color, i) => rect(ctx, color, 0, i * band, W, band + 1));
  for (const v of VEINS) {
    const pulse = 0.35 + 0.35 * Math.sin(time * 0.8 + v.phase);
    ctx.strokeStyle = `rgba(120, 230, 230, ${pulse.toFixed(3)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(v.x, v.y);
    ctx.lineTo(v.x + v.len, v.y + v.len * v.slope);
    ctx.lineTo(v.x + v.len * 1.4, v.y + v.len * v.slope * 0.6 + 4);
    ctx.stroke();
  }
  // The roof's glass curtains.
  for (const c of CURTAINS) drawCurtain(ctx, c, time);
  // Rays of star-light, wide and faint, wandering through the glass.
  for (let i = 0; i < 3; i++) {
    const sweep = Math.sin(time * 0.25 + i * 2.1);
    const x0 = 60 + i * 100 + sweep * 24;
    ctx.fillStyle = `rgba(255, 233, 160, ${(0.035 + 0.02 * Math.sin(time * 0.6 + i)).toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(x0, 0); ctx.lineTo(x0 + 16, 0); ctx.lineTo(x0 + 60 + sweep * 20, top); ctx.lineTo(x0 + 20 + sweep * 20, top);
    ctx.closePath(); ctx.fill();
  }
  // The tea break, on a shelf at the left: a kettle and seven tin mugs, and
  // the little tin dish at the end.
  rect(ctx, '#142c36', 6, top - 14, 58, 14);
  rect(ctx, '#1f4a56', 6, top - 14, 58, 2);
  rect(ctx, '#5a6070', 10, top - 24, 10, 10);
  rect(ctx, '#8a90a0', 10, top - 24, 10, 2);
  rect(ctx, '#5a6070', 20, top - 21, 4, 2);
  for (let i = 0; i < 7; i++) {
    rect(ctx, '#8a90a0', 25 + i * 5, top - 20, 4, 6);
    rect(ctx, '#c4c8d4', 25 + i * 5, top - 20, 4, 1);
  }
  rect(ctx, '#7a8090', 56, top - 17, 7, 3);
  rect(ctx, '#c4c8d4', 56, top - 17, 7, 1);
  // Glass stalagmites at the sides, rising out of the pool.
  for (const [x, h] of [[12, 30], [30, 16], [292, 26], [306, 38], [270, 12]]) {
    ctx.fillStyle = '#0d2a33';
    ctx.beginPath(); ctx.moveTo(x - 5, top + 6); ctx.lineTo(x, top - h); ctx.lineTo(x + 5, top + 6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(150, 240, 230, 0.5)';
    ctx.beginPath(); ctx.moveTo(x - 1, top + 6); ctx.lineTo(x, top - h); ctx.lineTo(x + 2, top + 6); ctx.closePath(); ctx.fill();
  }
  // The pool: still, black-teal, giving the cavern back upside down.
  rect(ctx, '#04141c', 0, top, W, height - top);
  for (let y = top; y < height; y++) {
    const d = (y - top) / (height - top);
    ctx.fillStyle = `rgba(110, 220, 225, ${(0.12 * (1 - d)).toFixed(3)})`;
    ctx.fillRect(0, y, W, 1);
  }
  for (const c of CURTAINS) {
    const wob = Math.sin(time * 1.4 + c.phase) * 1.5;
    ctx.fillStyle = 'rgba(150, 240, 230, 0.18)';
    ctx.beginPath();
    ctx.moveTo(c.x - c.w * 0.4 + wob, top + 2); ctx.lineTo(c.x + c.w * 0.4 + wob, top + 2); ctx.lineTo(c.x + wob, top + 2 + Math.min(c.len * 0.4, height - top - 2));
    ctx.closePath(); ctx.fill();
  }
  // Ripples spreading on it, slowly.
  for (let i = 0; i < 5; i++) {
    const t = (time * 0.22 + i * 0.2) % 1;
    const rx = 40 + hash(i + 4300) * (W - 80);
    ctx.strokeStyle = `rgba(190, 255, 250, ${((1 - t) * 0.3).toFixed(3)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(rx, top + 8 + hash(i + 4310) * 6, 6 + t * 26, 1.5 + t * 4, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  rect(ctx, 'rgba(190, 255, 250, 0.5)', 0, top, W, 1);
  // Motes of star-light drifting up.
  for (const m of MOTES) {
    const y = (((m.y * height - time * m.speed) % height) + height) % height;
    const x = (((m.x + Math.sin(time * 0.7 + m.sway) * 6) % W) + W) % W;
    ctx.fillStyle = hash(Math.floor(m.sway * 10)) < 0.3 ? 'rgba(255, 233, 160, 0.7)' : 'rgba(190, 255, 250, 0.5)';
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  }
  // A dark edge round all of it.
  const edge = ctx.createLinearGradient(0, 0, W, 0);
  edge.addColorStop(0, 'rgba(0, 3, 8, 0.55)');
  edge.addColorStop(0.2, 'rgba(0, 3, 8, 0)');
  edge.addColorStop(0.8, 'rgba(0, 3, 8, 0)');
  edge.addColorStop(1, 'rgba(0, 3, 8, 0.55)');
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, W, height);
}

export const POOL_BACKDROPS = { glass_pool: drawPool };
