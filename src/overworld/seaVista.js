import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';
import { vistaHash as hash } from '../engine/noise.js';

// The first sight of the sea, from the cliffs above Gullrest. A room asks for
// it with `vista: { kind: 'sea' }` and open air (`_` tiles) over the edge.
// From the top: a pale summer sky with slow clouds, the horizon, and on it, left
// of the middle, a low green smudge of storm with the Last Light standing in it
// (a black tower with a crown of spikes), then the sea in bands of colour
// with glints, and at the bottom left, very far below, Gullrest: a crescent of
// sand, a jetty, boats, and a row of little huts with red roofs and bunting.
// Each layer slides at its own speed as the camera moves, so panning down
// (the scene does it) opens the view up. `view.rise` is how far the camera is
// above the bottom of the room.

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
  // Left of middle, so the cliff path down (the room's east side) never hides it.
  const sx = W * 0.36;
  for (const c of CLOUDS) {
    const x = ((c.x + time * c.speed) % (W + 160)) - 80;
    const y = c.y + rise * 0.05;
    const near = Math.max(x, Math.min(sx, x + c.w));
    const fade = view.calm ? 1 : Math.max(0, Math.min(1, (Math.hypot(near - sx, y - (horizon - 6)) - 60) / 50));
    if (fade <= 0) continue;
    ctx.fillStyle = `rgba(255, 255, 255, ${(0.85 * fade).toFixed(3)})`;
    ctx.fillRect(Math.round(x), Math.round(y), c.w, 4);
    ctx.fillRect(Math.round(x + 5), Math.round(y - 3), c.w - 14, 4);
    ctx.fillStyle = `rgba(200, 220, 236, ${(0.9 * fade).toFixed(3)})`;
    ctx.fillRect(Math.round(x + 2), Math.round(y + 4), c.w - 4, 2);
  }
  // After chapter 5 (`view.calm`, the room's `calmAfter`) the storm has gone:
  // only a thin grey tail of cloud low on the horizon, thinning out, where it sat.
  if (view.calm) {
    ctx.fillStyle = 'rgba(206, 216, 226, 0.55)';
    for (let i = 0; i < 6; i++) ctx.fillRect(Math.round(sx - 50 + i * 17 + hash(i) * 6), Math.round(horizon - 9 - hash(i + 7) * 8), 18 + Math.round(hash(i + 3) * 12), 3);
    ctx.fillStyle = 'rgba(232, 238, 242, 0.5)';
    for (let i = 0; i < 4; i++) ctx.fillRect(Math.round(sx - 36 + i * 22 + hash(i + 30) * 6), Math.round(horizon - 13 - hash(i + 37) * 8), 12 + Math.round(hash(i + 33) * 8), 2);
  }
  // The storm, far to the right: a bank of sick green cloud sitting on the sea.
  if (!view.calm) {
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
  if (!view.calm) {
    const stain = ctx.createLinearGradient(sx - 60, 0, sx + 60, 0);
    stain.addColorStop(0, 'rgba(50, 100, 80, 0)');
    stain.addColorStop(0.5, 'rgba(40, 90, 70, 0.5)');
    stain.addColorStop(1, 'rgba(50, 100, 80, 0.1)');
    ctx.fillStyle = stain;
    ctx.fillRect(sx - 60, horizon, 140, 28);
  }
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

// The end of chapter 5, from the Last Light's balcony at dawn
// (`vista: { kind: 'low_tide_dawn' }`). The storm has gone and the sea has
// pulled back farther than anyone has seen. From the top: a dawn sky the
// colour of the inside of a shell (blue going to lilac, rose, then gold), long
// thin clouds lit pink and gold from underneath, the sun half up with a soft
// fan of rays; low headlands either side, and out to the right (north-east) a
// long smudge of smoke leaning off the edge of the world. The sea is only a
// bright thread along the horizon. Below it, bare wet sand for miles, holding
// the sky: a sheen of pink and gold far off, the sun's road glittering down it,
// a channel winding out to the thread, pools, ripples, rocks with long morning
// shadows, and the ships the sea has let go of, stranded where they sank. At
// the very bottom, far below the tower, a stone boat-slip runs out onto the
// sand with a small boat's prow carved into its head. Panning down
// (`view.rise` falling to 0) brings the slip up. Nothing here moves much: it's
// the morning after.
const DAWN_STREAKS = Array.from({ length: 11 }, (_, i) => ({ x: hash(i + 300) * W * 1.4 - 40, h: hash(i + 320), w: 40 + hash(i + 340) * 90, speed: 0.5 + hash(i + 360) * 0.7 }));
const POOLS = Array.from({ length: 30 }, (_, i) => ({ x: hash(i + 400) * W, d: 0.12 + hash(i + 420) * 0.88, w: 6 + hash(i + 440) * 26 }));
const RIPPLES = Array.from({ length: 120 }, (_, i) => ({ x: hash(i + 500) * W, d: hash(i + 520), w: 3 + hash(i + 540) * 9 }));
const SHEEN = Array.from({ length: 26 }, (_, i) => ({ x: hash(i + 560) * W * 1.2 - 20, d: hash(i + 570) * 0.5, w: 20 + hash(i + 580) * 60 }));

// The sky's colour at a height (0 at the top of the screen's sky, 1 at the horizon), for reflections.
const SKY_STOPS = [[0, [104, 122, 176]], [0.35, [168, 152, 196]], [0.62, [232, 176, 176]], [0.85, [255, 208, 160]], [1, [255, 238, 200]]];
function skyAt(k) {
  for (let i = 1; i < SKY_STOPS.length; i++) {
    const [k1, c1] = SKY_STOPS[i];
    const [k0, c0] = SKY_STOPS[i - 1];
    if (k <= k1) {
      const f = (k - k0) / (k1 - k0);
      return c0.map((c, j) => Math.round(c + (c1[j] - c) * f));
    }
  }
  return SKY_STOPS[SKY_STOPS.length - 1][1];
}
const rgba = (c, a) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a.toFixed(3)})`;

export function drawLowTideVista(ctx, view, time) {
  const rise = view.rise ?? 0;
  // The horizon sits low enough that the balcony always has a strip of sky
  // over the rail, and drops away as the camera looks down.
  const horizon = Math.round(110 + rise * 0.5);
  const skyTop = horizon - 150;
  // --- The sky: shell colours, blue high up through lilac and rose to gold.
  const sky = ctx.createLinearGradient(0, skyTop, 0, horizon);
  for (const [k, c] of SKY_STOPS) sky.addColorStop(k, rgba(c, 1));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, horizon + 1);

  // The storm's tail, high up and going: a dark ragged edge of cloud along the
  // top, its underside caught pink by the sun.
  const tailY = horizon - 128;
  if (tailY > -30) {
    for (let x = -4; x < W + 4; x += 3) {
      const edge = tailY + 10 + Math.sin(x * 0.05 + 1.3) * 5 + Math.sin(x * 0.13) * 2.5 + hash(Math.floor(x / 3) + 900) * 2;
      ctx.fillStyle = '#4e5276';
      ctx.fillRect(x, -2, 3, Math.round(edge + 2));
      ctx.fillStyle = 'rgba(248, 168, 150, 0.85)';
      ctx.fillRect(x, Math.round(edge), 3, 1);
      ctx.fillStyle = 'rgba(255, 210, 170, 0.35)';
      ctx.fillRect(x, Math.round(edge) + 1, 3, 1);
    }
  }

  // The sun, half up, a little right of the middle.
  const sunX = Math.round(W * 0.62);
  const sunY = horizon - 2;
  // Its fan of rays, very soft, turning a hair.
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 9; i++) {
    const a = Math.PI + 0.25 + (i / 8) * (Math.PI - 0.5) + Math.sin(time * 0.05 + i) * 0.02;
    const spread = 0.025 + hash(i + 940) * 0.03;
    const len = 120 + hash(i + 950) * 110;
    ctx.fillStyle = `rgba(255, 226, 170, ${(0.05 + hash(i + 960) * 0.05).toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(sunX, sunY);
    ctx.lineTo(sunX + Math.cos(a - spread) * len, sunY + Math.sin(a - spread) * len);
    ctx.lineTo(sunX + Math.cos(a + spread) * len, sunY + Math.sin(a + spread) * len);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  const halo = ctx.createRadialGradient(sunX, sunY, 3, sunX, sunY, 120);
  halo.addColorStop(0, 'rgba(255, 250, 226, 0.95)');
  halo.addColorStop(0.12, 'rgba(255, 228, 168, 0.6)');
  halo.addColorStop(0.45, 'rgba(255, 196, 150, 0.18)');
  halo.addColorStop(1, 'rgba(255, 190, 150, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(sunX - 120, sunY - 120, 240, 124);

  // Long thin clouds, lilac on top and lit gold and rose underneath, closer
  // together and thinner as they near the horizon.
  for (const c of DAWN_STREAKS) {
    const y = Math.round(horizon - 8 - c.h * c.h * 70);
    const x = ((c.x + time * c.speed) % (W + 180)) - 90;
    const w = Math.round(c.w * (0.5 + c.h * 0.6));
    const near = 1 - Math.min(1, Math.abs(x + w / 2 - sunX) / 160);
    ctx.fillStyle = 'rgba(150, 128, 170, 0.55)';
    ctx.fillRect(Math.round(x + 4), y - 1, w - 8, 1);
    ctx.fillStyle = 'rgba(214, 160, 178, 0.8)';
    ctx.fillRect(Math.round(x), y, w, c.h > 0.5 ? 2 : 1);
    ctx.fillStyle = `rgba(255, ${Math.round(196 + near * 40)}, ${Math.round(140 + near * 50)}, ${(0.6 + near * 0.35).toFixed(3)})`;
    ctx.fillRect(Math.round(x + 3), y + (c.h > 0.5 ? 2 : 1), w - 6, 1);
  }

  // The sun's disc over everything in the sky, half under the sea.
  ctx.fillStyle = '#fff2c8';
  ctx.beginPath();
  ctx.arc(sunX, sunY + 1, 8, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#fffcf0';
  ctx.beginPath();
  ctx.arc(sunX, sunY + 1, 5, Math.PI, 0);
  ctx.fill();

  // Far headlands, low and blue in the haze: a long one on the left (the way
  // home) and a broken one on the right.
  ctx.fillStyle = 'rgba(122, 112, 158, 0.85)';
  ctx.beginPath();
  ctx.moveTo(-2, horizon + 1);
  ctx.lineTo(-2, horizon - 13);
  for (let x = 0; x <= 86; x += 2) ctx.lineTo(x, horizon - 13 + (x / 86) * (x / 86) * 13 - Math.sin(x * 0.2) * 1.2 - (x < 30 ? hash(x + 980) : 0));
  ctx.lineTo(90, horizon + 1);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(150, 136, 178, 0.6)';
  ctx.fillRect(0, horizon - 4, 70, 1);
  ctx.fillStyle = 'rgba(132, 118, 160, 0.8)';
  for (const [x, w, h] of [[W - 58, 22, 6], [W - 34, 9, 9], [W - 22, 24, 5]]) {
    ctx.fillRect(x, horizon - h, w, h + 1);
    ctx.fillRect(x + 2, horizon - h - 1, w - 5, 1);
  }

  // The smoke in the north-east: a long, low smudge from a point past the
  // horizon on the right, leaning away left as it climbs and thins. Grey-brown,
  // darker at its root, its top edge catching the sun. Nobody explains it.
  const smokeX = W * 0.9;
  for (let i = 0; i < 52; i++) {
    const k = i / 51;
    const x = smokeX - k * 130 + Math.sin(k * 5 + time * 0.08) * 4 + (hash(i + 230) - 0.5) * 8;
    const y = horizon - 4 - k * 34 - Math.sin(k * 3.1) * 4 + (hash(i + 260) - 0.5) * 5 * k;
    const r = (3 + k * 10) * (0.6 + hash(i + 290) * 0.7);
    ctx.fillStyle = `rgba(${Math.round(74 + k * 50)}, ${Math.round(64 + k * 44)}, ${Math.round(70 + k * 44)}, ${(0.34 * (1 - k * 0.7)).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.5, r * 0.75, -0.18, 0, Math.PI * 2);
    ctx.fill();
    if (i % 3 === 0) {
      ctx.fillStyle = `rgba(255, 196, 150, ${(0.12 * (1 - k)).toFixed(3)})`;
      ctx.fillRect(Math.round(x - r), Math.round(y - r * 0.75), Math.round(r * 2), 1);
    }
  }
  ctx.fillStyle = 'rgba(54, 44, 50, 0.75)';
  ctx.fillRect(Math.round(smokeX - 2), horizon - 5, 6, 4);

  // The sea, pulled right back: a bright thread on the horizon, the sun's
  // glitter on it.
  ctx.fillStyle = '#c4c2dc';
  ctx.fillRect(0, horizon, W, 3);
  ctx.fillStyle = '#e8e0ec';
  ctx.fillRect(0, horizon, W, 1);
  ctx.fillStyle = '#fff6d8';
  ctx.fillRect(sunX - 44, horizon + 1, 88, 1);
  ctx.fillStyle = '#fffff4';
  ctx.fillRect(sunX - 16, horizon, 32, 2);
  for (let i = 0; i < 22; i++) {
    const x = (hash(i + 600) * W + time * 2) % W;
    if (Math.sin(time * 1.7 + i * 2) > 0.3) {
      ctx.fillStyle = 'rgba(255, 255, 240, 0.9)';
      ctx.fillRect(Math.round(x), horizon + 1 + (i % 2), 3, 1);
    }
  }

  // --- The sand: wet, holding the sky far off, warmer and darker nearer the tower.
  const sandTop = horizon + 3;
  const depth = H + 40 - horizon;
  const at = (d) => sandTop + d * d * depth;
  const sand = ctx.createLinearGradient(0, sandTop, 0, sandTop + depth);
  sand.addColorStop(0, '#e2c4b4');
  sand.addColorStop(0.12, '#d8b898');
  sand.addColorStop(0.4, '#c4a07a');
  sand.addColorStop(1, '#8a6a4c');
  ctx.fillStyle = sand;
  ctx.fillRect(0, sandTop, W, H - sandTop + 1);
  // A morning haze lying on the far sand.
  const haze = ctx.createLinearGradient(0, sandTop, 0, sandTop + 18);
  haze.addColorStop(0, 'rgba(250, 226, 214, 0.75)');
  haze.addColorStop(1, 'rgba(250, 226, 214, 0)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, sandTop, W, 18);
  // Sheets of water still lying on it, reflecting the sky (long thin bands, far off).
  for (const s of SHEEN) {
    const y = Math.round(at(s.d));
    const c = skyAt(0.9 - s.d * 1.2);
    const w = Math.round(s.w * (0.4 + s.d * 1.4));
    ctx.fillStyle = rgba(c, 0.55);
    ctx.fillRect(Math.round(s.x), y, w, Math.max(1, Math.round(s.d * 4)));
  }
  // The sun's road: a glittering column down the wet sand, wider as it nears.
  for (let i = 0; i < 70; i++) {
    const d = hash(i + 620);
    const y = Math.round(at(d * 0.75));
    if (y > H) continue;
    const spread = 6 + d * 60;
    const x = sunX + (hash(i + 640) - 0.5) * 2 * spread;
    const on = Math.sin(time * (1.5 + hash(i + 660) * 2) + i * 1.7) > -0.2;
    if (!on) continue;
    ctx.fillStyle = d < 0.3 ? 'rgba(255, 248, 220, 0.9)' : 'rgba(255, 232, 180, 0.7)';
    ctx.fillRect(Math.round(x), y, Math.round(2 + d * 6), 1);
  }
  const road = ctx.createLinearGradient(sunX - 50, 0, sunX + 50, 0);
  road.addColorStop(0, 'rgba(255, 228, 180, 0)');
  road.addColorStop(0.5, 'rgba(255, 232, 190, 0.3)');
  road.addColorStop(1, 'rgba(255, 228, 180, 0)');
  ctx.fillStyle = road;
  ctx.fillRect(sunX - 50, sandTop, 100, 50);

  // A channel winding out to the far water, holding the sky; a dark lip on its near bank.
  // (Row by row, so it runs unbroken however near it comes.)
  for (let y = sandTop; y < H + 2; y++) {
    const k = Math.sqrt((y - sandTop) / depth);
    const x = W * 0.3 + Math.sin(k * 6.5) * (10 + k * 30) - k * 40;
    const w = 2 + k * 10;
    const c = skyAt(0.95 - k * 0.7);
    ctx.fillStyle = rgba(c, 0.9);
    ctx.fillRect(Math.round(x - w / 2), y, Math.round(w), 1);
    if (k > 0.3) {
      ctx.fillStyle = 'rgba(255, 246, 226, 0.5)';
      if (Math.sin(y * 0.9 + time * 0.8) > 0.4) ctx.fillRect(Math.round(x - w / 4), y, Math.max(1, Math.round(w / 4)), 1);
      ctx.fillStyle = 'rgba(96, 70, 56, 0.5)';
      ctx.fillRect(Math.round(x + w / 2), y, 1, 1);
      ctx.fillStyle = 'rgba(250, 226, 196, 0.5)';
      ctx.fillRect(Math.round(x - w / 2) - 1, y, 1, 1);
    }
  }
  // Pools left by the tide, flat ovals of sky with a dark near edge.
  for (const p of POOLS) {
    const y = Math.round(at(p.d));
    if (y > H + 10) continue;
    const w = Math.round(p.w * (0.3 + p.d));
    const h = Math.max(1, Math.round(p.d * 4));
    const c = skyAt(0.85 - p.d * 0.6);
    ctx.fillStyle = rgba(c, 0.9);
    ctx.beginPath();
    ctx.ellipse(p.x, y + h / 2, w / 2, h / 2 + 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 244, 220, 0.7)';
    ctx.fillRect(Math.round(p.x - w / 4), y, Math.max(1, Math.round(w / 3)), 1);
    if (h > 1) {
      ctx.fillStyle = 'rgba(100, 74, 58, 0.4)';
      ctx.fillRect(Math.round(p.x - w / 2 + 1), y + h, Math.max(1, w - 2), 1);
    }
  }
  // Ripples in the sand: short darker strokes with a lit edge, finer far off.
  for (const r of RIPPLES) {
    const y = Math.round(at(r.d) + 2);
    if (y > H + 4) continue;
    const w = Math.round(r.w * (0.4 + r.d * 1.2));
    ctx.fillStyle = 'rgba(120, 90, 66, 0.35)';
    ctx.fillRect(Math.round(r.x), y, w, 1);
    if (r.d > 0.4) {
      ctx.fillStyle = 'rgba(244, 214, 170, 0.35)';
      ctx.fillRect(Math.round(r.x), y - 1, w, 1);
    }
  }

  // Long morning shadows, falling away from the sun, toward us and to the left.
  const shadow = (x, y, w, len) => {
    ctx.fillStyle = 'rgba(84, 60, 74, 0.38)';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w - len * 0.9, y + len * 0.28);
    ctx.lineTo(x - len * 0.9, y + len * 0.28);
    ctx.closePath();
    ctx.fill();
  };
  // Rocks and weed.
  for (const [rx, rd, rw] of [[0.12, 0.35, 10], [0.86, 0.22, 6], [0.46, 0.64, 9], [0.93, 0.56, 12]]) {
    const y = Math.round(at(rd));
    const w = Math.round(rw * (0.4 + rd));
    const x = Math.round(W * rx);
    const h = Math.round(w / 3) + 1;
    shadow(x, y + 1, w, 10 + rd * 30);
    ctx.fillStyle = '#4c3e44';
    ctx.fillRect(x, y - h + 1, w, h);
    ctx.fillStyle = '#e8b890';
    ctx.fillRect(x + w - 2, y - h + 1, 2, 1);
    ctx.fillRect(x + 1, y - h + 1, w - 3, 1);
    ctx.fillStyle = '#36502e';
    ctx.fillRect(x, y, w, 1);
  }

  // The ships the sea has let go of: three wrecks stranded on the sand, far,
  // middling and near, each with its long shadow.
  const wreck = (cx, d, scale, lean) => {
    const y = Math.round(at(d));
    if (y > H + 30) return;
    const s = scale * (0.35 + d * 1.1);
    const len = Math.round(26 * s);
    shadow(cx - len / 2, y + 1, len, 14 + d * 50);
    // The keel and the hull's low side, half sunk in the sand.
    ctx.fillStyle = '#3a2c2c';
    ctx.fillRect(Math.round(cx - len / 2), y - Math.round(2 * s), len, Math.max(1, Math.round(2 * s)));
    // The ribs, curving up, short at the ends.
    const ribs = Math.max(4, Math.round(len / Math.max(2, 3 * s)));
    for (let i = 0; i <= ribs; i++) {
      const f = i / ribs;
      const rx = Math.round(cx - len / 2 + f * len);
      const rh = Math.round((3 + 9 * Math.sin(f * Math.PI)) * s);
      ctx.fillStyle = '#2e2224';
      ctx.fillRect(rx, y - rh, Math.max(1, Math.round(s * 0.8)), rh);
      ctx.fillStyle = 'rgba(255, 196, 150, 0.7)';
      ctx.fillRect(rx + Math.max(1, Math.round(s * 0.8)) - 1, y - rh, 1, Math.max(1, Math.round(rh / 3)));
    }
    // A mast, broken and leaning.
    if (lean) {
      const mx = cx + len * 0.15;
      const mh = 24 * s;
      ctx.strokeStyle = '#2e2224';
      ctx.lineWidth = Math.max(1, Math.round(s));
      ctx.beginPath();
      ctx.moveTo(Math.round(mx) + 0.5, y - 2 * s);
      ctx.lineTo(Math.round(mx + lean * mh) + 0.5, Math.round(y - mh));
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(Math.round(mx + lean * mh * 0.7 - 4 * s) + 0.5, Math.round(y - mh * 0.7));
      ctx.lineTo(Math.round(mx + lean * mh * 0.7 + 4 * s) + 0.5, Math.round(y - mh * 0.7 - lean * 2 * s));
      ctx.stroke();
    }
  };
  wreck(W * 0.74, 0.16, 0.9, 0.25);
  wreck(W * 0.08, 0.3, 1, 0);
  wreck(W * 0.66, 0.52, 1.15, -0.35);

  // The boat-slip, far below: a stone ramp running out from the bottom left
  // onto the sand, its slabs lit on one edge, and at its head a small boat's
  // prow carved into the stone, as if a boat were still nosed up against it.
  const sy = H - 30 + rise * 0.9;
  if (sy < H + 30) {
    const sx = W * 0.2;
    // Its shadow on the sand.
    ctx.fillStyle = 'rgba(84, 60, 74, 0.35)';
    ctx.beginPath();
    ctx.moveTo(sx - 4, sy + 2);
    ctx.lineTo(sx - 46, H + 10);
    ctx.lineTo(sx - 30, H + 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#7c7076';
    ctx.beginPath();
    ctx.moveTo(sx - 30, H + 10);
    ctx.lineTo(sx + 2, sy);
    ctx.lineTo(sx + 26, sy);
    ctx.lineTo(sx + 14, H + 10);
    ctx.closePath();
    ctx.fill();
    // The sunlit right-hand edge.
    ctx.strokeStyle = '#e4c0a0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx + 26, sy + 0.5);
    ctx.lineTo(sx + 14, H + 10);
    ctx.stroke();
    ctx.fillStyle = '#a49690';
    for (let i = 0; i < 6; i++) {
      const k = i / 6;
      const y = sy + 4 + k * (H + 10 - sy);
      ctx.fillRect(Math.round(sx + 2 - k * 32), Math.round(y), Math.round(24 - k * 12 + k * 20), 1);
    }
    // Weed along its foot, where the water stood all night.
    ctx.fillStyle = '#3a5032';
    for (let i = 0; i < 9; i++) {
      const k = 0.2 + (i / 9) * 0.8;
      ctx.fillRect(Math.round(sx + 2 - k * 32) - 1, Math.round(sy + 2 + k * (H + 8 - sy)), 2, 1);
    }
    // The prow: a pointed bow standing out of the head of the slip, its
    // planking and a stem-post cut into the stone, wet, the sun on its edge.
    const px0 = sx + 14;
    ctx.fillStyle = '#564c50';
    ctx.beginPath();
    ctx.moveTo(px0 - 9, sy + 1);
    ctx.quadraticCurveTo(px0 - 7, sy - 9, px0, sy - 14);
    ctx.quadraticCurveTo(px0 + 7, sy - 9, px0 + 9, sy + 1);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#e8c4a0';
    ctx.beginPath();
    ctx.moveTo(px0 + 0.5, sy - 13.5);
    ctx.quadraticCurveTo(px0 + 7, sy - 9, px0 + 8.5, sy + 1);
    ctx.stroke();
    ctx.fillStyle = '#8c8084';
    ctx.fillRect(Math.round(px0), Math.round(sy - 13), 1, 13);
    ctx.fillStyle = '#6e6266';
    ctx.fillRect(Math.round(px0 - 6), Math.round(sy - 5), 12, 1);
    ctx.fillRect(Math.round(px0 - 7), Math.round(sy - 2), 14, 1);
    ctx.fillStyle = '#fff0d8';
    ctx.fillRect(Math.round(px0), Math.round(sy - 14), 1, 2);
    // The sea-wet line round its foot.
    ctx.fillStyle = 'rgba(232, 214, 222, 0.7)';
    ctx.fillRect(Math.round(sx - 2), Math.round(sy + 1), 32, 1);
  }

  // Gulls, a long way off, back again: dark against the bright sky.
  for (let i = 0; i < 5; i++) {
    const a = time * (0.15 + hash(i + 700) * 0.1) + hash(i + 710) * 6.28;
    const gx = W * 0.42 + Math.cos(a) * (40 + hash(i + 720) * 70);
    const gy = horizon - 34 + Math.sin(a * 1.2) * 10 + i * 5;
    const flap = Math.sin(time * 5 + i) > 0 ? 1 : 0;
    px(ctx, 'rgba(70, 56, 76, 0.85)', gx - 2, gy - flap, 2, 1);
    px(ctx, 'rgba(70, 56, 76, 0.85)', gx + 1, gy - flap, 2, 1);
    px(ctx, 'rgba(70, 56, 76, 0.85)', gx, gy + 1 - flap, 1, 1);
  }
}
