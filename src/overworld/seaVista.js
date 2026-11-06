import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';

// The first sight of the sea, from the cliffs above Gullrest. A room asks for
// it with `vista: { kind: 'sea' }` and open air (`_` tiles) over the edge.
// From the top: a pale summer sky with slow clouds, the horizon, and on it far
// to the right a low green smudge of storm with the Last Light standing in it
// (a black tower with a crown of spikes), then the sea in bands of colour
// with glints, and at the bottom left, very far below, Gullrest: a crescent of
// sand, a jetty, boats, and a row of little huts with red roofs and bunting.
// Each layer slides at its own speed as the camera moves, so panning down
// (the scene does it) opens the view up. `view.rise` is how far the camera is
// above the bottom of the room.

function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
const px = (ctx, color, x, y, w = 1, h = 1) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), w, h); };

const CLOUDS = Array.from({ length: 9 }, (_, i) => ({ x: hash(i + 1) * W * 1.3, y: 8 + hash(i + 20) * 50, w: 30 + hash(i + 40) * 40, speed: 1.2 + hash(i + 60) * 2 }));

export function drawSeaVista(ctx, view, time) {
  const rise = view.rise ?? 0;
  const horizon = 96 + rise * 0.18;
  // Sky.
  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, '#6aa4dc');
  sky.addColorStop(0.7, '#a8d0ee');
  sky.addColorStop(1, '#e6f0f0');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, horizon + 1);
  // Clouds. They come and go well off the edges (the widest is 70), so none pops
  // in half drawn, and they thin away as they drift into the storm's haze, so a
  // summer cloud never sits in the green as a stray grey block.
  const sx = W * 0.78;
  for (const c of CLOUDS) {
    const x = ((c.x + time * c.speed) % (W + 160)) - 80;
    const y = c.y + rise * 0.05;
    const near = Math.max(x, Math.min(sx, x + c.w));
    const fade = Math.max(0, Math.min(1, (Math.hypot(near - sx, y - (horizon - 6)) - 60) / 50));
    if (fade <= 0) continue;
    ctx.fillStyle = `rgba(255, 255, 255, ${(0.85 * fade).toFixed(3)})`;
    ctx.fillRect(Math.round(x), Math.round(y), c.w, 4);
    ctx.fillRect(Math.round(x + 5), Math.round(y - 3), c.w - 14, 4);
    ctx.fillStyle = `rgba(200, 220, 236, ${(0.9 * fade).toFixed(3)})`;
    ctx.fillRect(Math.round(x + 2), Math.round(y + 4), c.w - 4, 2);
  }
  // The storm, far to the right: a bank of sick green cloud sitting on the sea.
  const storm = ctx.createRadialGradient(sx, horizon - 6, 4, sx, horizon - 6, 92);
  storm.addColorStop(0, 'rgba(48, 92, 70, 0.95)');
  storm.addColorStop(0.5, 'rgba(70, 118, 84, 0.6)');
  storm.addColorStop(1, 'rgba(120, 160, 120, 0)');
  ctx.fillStyle = storm;
  ctx.fillRect(sx - 100, horizon - 90, 200, 96);
  ctx.fillStyle = 'rgba(40, 80, 60, 0.9)';
  for (let i = 0; i < 9; i++) ctx.fillRect(Math.round(sx - 40 + i * 9 + hash(i) * 6), Math.round(horizon - 16 - hash(i + 7) * 20), 14 + Math.round(hash(i + 3) * 10), 6);
  // Rain under it, slanting, and a flicker now and then.
  ctx.fillStyle = 'rgba(40, 70, 56, 0.5)';
  for (let i = 0; i < 26; i++) ctx.fillRect(Math.round(sx - 36 + i * 3), Math.round(horizon - 10 + (i % 3)), 1, 10 - (i % 4));
  // The flicker is a soft glow lighting the cloud from inside, fading out, never a hard-edged block.
  const flick = time % 7.3;
  if (flick < 0.3) {
    const k = 1 - flick / 0.3;
    const glow = ctx.createRadialGradient(sx - 4, horizon - 24, 2, sx - 4, horizon - 24, 34);
    glow.addColorStop(0, `rgba(230, 255, 210, ${(0.55 * k).toFixed(3)})`);
    glow.addColorStop(1, 'rgba(230, 255, 210, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(sx - 38, horizon - 58, 68, 58);
  }
  // The Last Light: a tall black tower, ribs near the top, a crown of spikes.
  const lx = Math.round(sx + 8);
  const top = horizon - 30;
  ctx.fillStyle = '#0c1210';
  for (let y = 0; y < 30; y++) {
    const half = Math.round(1.5 + (y / 30) * 2.5);
    ctx.fillRect(lx - half, top + y, half * 2 + 1, 1);
  }
  ctx.fillRect(lx - 4, top - 2, 9, 3);
  ctx.fillRect(lx - 3, top - 7, 7, 5);
  for (const [dx, h] of [[-5, 7], [-3, 10], [-1, 12], [1, 11], [3, 9], [5, 6]]) ctx.fillRect(lx + dx, top - 7 - h + 3, 1, h);
  px(ctx, '#2a3a30', lx - 1, top + 8, 1, 14);
  // The sea.
  const sea = ctx.createLinearGradient(0, horizon, 0, H + 60);
  sea.addColorStop(0, '#9ad4de');
  sea.addColorStop(0.25, '#4aa6c4');
  sea.addColorStop(0.7, '#2478ac');
  sea.addColorStop(1, '#1c5c92');
  ctx.fillStyle = sea;
  ctx.fillRect(0, horizon, W, H - horizon + 1);
  // A dark green stain on the water under the storm.
  const stain = ctx.createLinearGradient(sx - 60, 0, sx + 60, 0);
  stain.addColorStop(0, 'rgba(50, 100, 80, 0)');
  stain.addColorStop(0.5, 'rgba(40, 90, 70, 0.5)');
  stain.addColorStop(1, 'rgba(50, 100, 80, 0.1)');
  ctx.fillStyle = stain;
  ctx.fillRect(sx - 60, horizon, 140, 28);
  // Glints and wave lines, slipping toward you.
  for (let i = 0; i < 70; i++) {
    const depth = hash(i + 100);
    const y = horizon + 3 + depth * depth * (H - horizon + rise * 0.3);
    const x = ((hash(i + 200) * W * 1.2 + time * (3 + depth * 8)) % (W + 30)) - 15;
    const len = 3 + depth * 12;
    const lit = Math.sin(time * 2 + i) > 0.2;
    px(ctx, lit ? 'rgba(255,255,255,0.8)' : 'rgba(190,230,246,0.45)', x, y, len, 1);
  }
  // Little white sails far out.
  for (const [bx, by] of [[0.3, 0.1], [0.52, 0.2]]) {
    const x = W * bx + Math.sin(time * 0.3 + bx * 9) * 2;
    const y = horizon + 4 + by * 30;
    px(ctx, '#f8f8f0', x, y - 5, 3, 5);
    px(ctx, '#f8f8f0', x - 3, y - 3, 3, 3);
    px(ctx, '#6a4a30', x - 3, y, 8, 1);
  }
  // Gullrest, far below on the left: sand, a jetty, boats, huts.
  const by = H - 58 + rise * 0.95;
  if (by < H + 40) {
    ctx.fillStyle = '#e6d098';
    ctx.beginPath();
    ctx.moveTo(-10, by + 60);
    ctx.lineTo(-10, by + 6);
    ctx.quadraticCurveTo(70, by - 6, 150, by + 30);
    ctx.quadraticCurveTo(190, by + 50, 210, by + 70);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f4e4b0';
    ctx.beginPath();
    ctx.moveTo(-10, by + 14);
    ctx.quadraticCurveTo(70, by + 2, 140, by + 36);
    ctx.lineTo(140, by + 70);
    ctx.lineTo(-10, by + 70);
    ctx.closePath();
    ctx.fill();
    // Foam on the sand's edge.
    ctx.strokeStyle = `rgba(255,255,255,${(0.55 + 0.25 * Math.sin(time * 1.3)).toFixed(2)})`;
    ctx.beginPath();
    ctx.moveTo(60, by + 3);
    ctx.quadraticCurveTo(110, by + 8, 150, by + 32);
    ctx.stroke();
    // Huts in a row along the back of the beach.
    const roofs = ['#d8483c', '#e8b030', '#d8483c', '#3c88c8', '#d8483c'];
    for (let i = 0; i < 5; i++) {
      const hx = 8 + i * 17;
      const hy = by + 6 + i * 0.7;
      px(ctx, '#f6f0e0', hx, hy, 11, 8);
      px(ctx, '#d8d0b8', hx + 8, hy, 3, 8);
      px(ctx, roofs[i], hx - 1, hy - 4, 13, 4);
      px(ctx, '#7a5a3a', hx + 4, hy + 3, 3, 5);
      px(ctx, '#8ab8d8', hx + 1, hy + 2, 2, 2);
    }
    // Bunting across them.
    for (let i = 0; i < 12; i++) {
      const bx = 10 + i * 7;
      px(ctx, ['#e04a4a', '#f4d03c', '#4a98e0', '#fff'][i % 4], bx, by + 1 + Math.round(Math.sin(i * 0.7) * 1.5), 2, 2);
    }
    // The jetty and two boats.
    px(ctx, '#6a4a30', 118, by + 26, 3, 20);
    px(ctx, '#6a4a30', 110, by + 44, 20, 2);
    px(ctx, '#d8483c', 134 + Math.sin(time), by + 52, 9, 3);
    px(ctx, '#f8f8f0', 138 + Math.sin(time), by + 46, 1, 6);
    px(ctx, '#3c88c8', 96, by + 56 + Math.sin(time * 1.2), 8, 3);
  }
  // Gulls wheeling.
  for (let i = 0; i < 5; i++) {
    const a = time * (0.25 + hash(i) * 0.15) + hash(i + 9) * 6.28;
    const gx = W * 0.3 + Math.cos(a) * (50 + hash(i + 4) * 70);
    const gy = horizon + 30 + Math.sin(a * 1.3) * 18 + i * 8 + rise * 0.4;
    const flap = Math.sin(time * 6 + i) > 0 ? 1 : 0;
    px(ctx, '#ffffff', gx - 2, gy - flap, 2, 1);
    px(ctx, '#ffffff', gx + 1, gy - flap, 2, 1);
    px(ctx, '#c8d0d8', gx, gy + 1 - flap, 1, 1);
  }
}
