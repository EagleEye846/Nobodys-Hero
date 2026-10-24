import { SCREEN_WIDTH as W } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { PROP_PALETTE, PROP_SPRITES } from '../data/art/props.js';

// Animated battle backgrounds, one per area. Each draws the stage from y = 0
// down to `height`; the battle panel covers the rest of the screen.

// Repeatable pseudo-random numbers, so the scenery is the same every frame.
function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const RUINS_SKY = ['#07030f', '#0a0515', '#0d071b', '#110922', '#140b29', '#180e30', '#1c1137', '#20143e'];
const RUINS_MOTES = Array.from({ length: 28 }, (_, i) => ({
  x: hash(i) * W,
  y: hash(i + 50) * 164,
  speed: 4 + hash(i + 100) * 8,
  sway: hash(i + 150) * Math.PI * 2,
  size: hash(i + 200) < 0.25 ? 2 : 1,
}));
const FLOOR_HEIGHT = 20;

// Repeating scenery: draws `unit` for every tile of `spacing` pixels visible at this scroll.
function scrollingLayer(scroll, spacing, unit) {
  const first = Math.floor(scroll / spacing) - 1;
  for (let k = first; k * spacing - scroll < W + spacing; k++) unit(k, Math.round(k * spacing - scroll));
}

// Far layer: a colonnade of arches, some collapsed.
function drawArches(ctx, scroll, baseY) {
  ctx.fillStyle = '#1a0f30';
  scrollingLayer(scroll, 80, (k, x) => {
    const top = baseY - 64 - Math.round(hash(k) * 10);
    const broken = hash(k + 7) < 0.3;
    ctx.fillRect(x, top, 8, baseY - top);
    ctx.fillRect(x + 56, broken ? top + 30 : top, 8, broken ? baseY - top - 30 : baseY - top);
    if (broken) {
      ctx.fillRect(x, top - 8, 22, 8);
      ctx.fillRect(x + 30, baseY - 6, 10, 6);
      ctx.fillRect(x + 42, baseY - 3, 6, 3);
    } else {
      ctx.fillRect(x, top - 8, 64, 8);
      ctx.fillRect(x + 8, top, 6, 4);
      ctx.fillRect(x + 8, top + 4, 2, 3);
      ctx.fillRect(x + 50, top, 6, 4);
      ctx.fillRect(x + 54, top + 4, 2, 3);
    }
  });
}

// Near layer: lone columns with capitals, some snapped off.
function drawColumns(ctx, scroll, baseY) {
  scrollingLayer(scroll, 110, (k, x) => {
    const height = 50 + Math.round(hash(k + 20) * 40);
    const broken = hash(k + 30) < 0.4;
    const top = baseY - height;
    ctx.fillStyle = '#24163f';
    ctx.fillRect(x, top, 12, height);
    if (broken) {
      ctx.fillRect(x, top - 4, 5, 4);
      ctx.fillRect(x + 7, top - 2, 3, 2);
    } else {
      ctx.fillRect(x - 3, top - 4, 18, 4);
    }
    ctx.fillStyle = '#2e1d50';
    ctx.fillRect(x, top, 1, height);
  });
}

function drawRuins(ctx, time, height) {
  // A stepped gradient keeps the sky pixel-sharp.
  const band = Math.ceil(height / RUINS_SKY.length);
  RUINS_SKY.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * band, W, band);
  });

  // Shafts of light falling through the broken roof, gently flickering.
  for (let i = 0; i < 3; i++) {
    const alpha = 0.04 + 0.02 * Math.sin(time * 0.8 + i * 2);
    const x = 40 + i * 100 + Math.sin(time * 0.2 + i) * 6;
    ctx.fillStyle = `rgba(190, 150, 255, ${alpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 18, 0);
    ctx.lineTo(x + 58, height);
    ctx.lineTo(x + 30, height);
    ctx.closePath();
    ctx.fill();
  }

  const baseY = height - FLOOR_HEIGHT;
  drawArches(ctx, time * 3, baseY);
  drawColumns(ctx, time * 9, baseY);

  // Flagstone floor, scrolling with the near columns.
  ctx.fillStyle = '#1a1030';
  ctx.fillRect(0, baseY, W, FLOOR_HEIGHT);
  ctx.fillStyle = '#2a1a48';
  ctx.fillRect(0, baseY, W, 1);
  ctx.fillStyle = '#140b26';
  const floorScroll = Math.floor(time * 9) % 24;
  for (let x = -floorScroll; x < W; x += 24) ctx.fillRect(x, baseY + 1, 1, FLOOR_HEIGHT - 1);
  ctx.fillRect(0, baseY + 10, W, 1);

  // Dust drifting up through the light.
  for (const mote of RUINS_MOTES) {
    const y = (((mote.y - time * mote.speed) % height) + height) % height;
    const x = (mote.x + Math.sin(time + mote.sway) * 4 + W) % W;
    ctx.globalAlpha = 0.4 + 0.4 * Math.sin(time * 2 + mote.sway);
    ctx.fillStyle = '#9b7fd4';
    ctx.fillRect(Math.round(x), Math.round(y), mote.size, mote.size);
  }
  ctx.globalAlpha = 1;
}

// --- Taper's: the way out of the Ruins, where she makes her stand. ---
// The great old door in the middle, with the light from outside seeping
// through its cracks; tiers of her candles on both sides, flickering and
// dripping; embers drifting up through the warm dark.
const TAPER_SKY = ['#110712', '#170a16', '#1e0d19', '#25111c', '#2c141f', '#331722', '#3a1a24', '#411d26'];
const TAPER_EMBERS = Array.from({ length: 34 }, (_, i) => ({
  x: hash(i + 300) * W,
  y: hash(i + 350) * 164,
  speed: 6 + hash(i + 400) * 10,
  sway: hash(i + 450) * Math.PI * 2,
  size: hash(i + 500) < 0.3 ? 2 : 1,
}));
// Each tier of candles: how high its shelf stands, and where its candles are.
const CANDLE_TIERS = [0, 1, 2].map((tier) => ({
  rise: 8 + tier * 18,
  candles: Array.from({ length: 6 - tier }, (_, i) => ({
    x: 6 + tier * 10 + i * 17 + Math.round(hash(tier * 10 + i) * 4),
    tall: 6 + Math.round(hash(tier * 10 + i + 60) * 10),
    seed: tier * 10 + i,
  })),
}));

function drawCandle(ctx, x, base, tall, time, seed) {
  // A soft glow first, so the wax sits in its own light.
  const flick = Math.sin(time * 9 + seed * 1.7) * 0.5 + Math.sin(time * 23 + seed) * 0.3;
  const glow = ctx.createRadialGradient(x + 1.5, base - tall - 3, 1, x + 1.5, base - tall - 3, 14 + flick * 2);
  glow.addColorStop(0, 'rgba(255, 190, 100, 0.28)');
  glow.addColorStop(1, 'rgba(255, 190, 100, 0)');
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = glow;
  ctx.fillRect(x - 14, base - tall - 18, 32, 32);
  ctx.restore();
  ctx.fillStyle = '#cdb98f';
  ctx.fillRect(x, base - tall, 4, tall);
  ctx.fillStyle = '#f2e6c8';
  ctx.fillRect(x, base - tall, 3, tall);
  // A drip running down one side.
  if (hash(seed + 90) < 0.6) ctx.fillRect(x + 3, base - tall + 1, 1, 2 + Math.round(hash(seed + 91) * 4));
  ctx.fillStyle = '#3a2a2a';
  ctx.fillRect(x + 1, base - tall - 2, 1, 2);
  const lean = flick > 0.4 ? 1 : 0;
  ctx.fillStyle = '#ffcc66';
  ctx.fillRect(x + lean, base - tall - 6, 3, 4);
  ctx.fillStyle = '#fff2c0';
  ctx.fillRect(x + 1 + lean, base - tall - 5, 1, 2);
}

function drawTaperStand(ctx, time, height) {
  const band = Math.ceil(height / TAPER_SKY.length);
  TAPER_SKY.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * band, W, band);
  });
  const baseY = height - FLOOR_HEIGHT;

  // The back wall: big old stones.
  ctx.fillStyle = '#1c0f16';
  for (let row = 0; row * 14 < baseY; row++) {
    for (let x = -(row % 2) * 16; x < W; x += 32) ctx.fillRect(x + 1, row * 14 + 1, 30, 12);
  }

  // The door out, tall and arched, shut, with light from outside at its seams.
  const doorX = W / 2 - 34;
  const doorTop = 26;
  const pulse = 0.55 + 0.25 * Math.sin(time * 1.3);
  const outside = ctx.createRadialGradient(W / 2, baseY - 40, 4, W / 2, baseY - 40, 90);
  outside.addColorStop(0, `rgba(255, 236, 190, ${(0.14 * pulse).toFixed(3)})`);
  outside.addColorStop(1, 'rgba(255, 236, 190, 0)');
  ctx.fillStyle = outside;
  ctx.fillRect(W / 2 - 90, baseY - 130, 180, 130);
  ctx.fillStyle = '#0c060a';
  ctx.fillRect(doorX - 6, doorTop + 14, 80, baseY - doorTop - 14);
  ctx.beginPath();
  ctx.arc(W / 2, doorTop + 18, 40, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#2a1712';
  ctx.fillRect(doorX, doorTop + 18, 68, baseY - doorTop - 18);
  ctx.beginPath();
  ctx.arc(W / 2, doorTop + 18, 34, Math.PI, 0);
  ctx.fill();
  // Planks and iron bands.
  ctx.fillStyle = '#20110e';
  for (let x = doorX + 8; x < doorX + 68; x += 11) ctx.fillRect(x, doorTop + 4, 1, baseY - doorTop - 4);
  ctx.fillStyle = '#3a2c2c';
  ctx.fillRect(doorX, doorTop + 34, 68, 3);
  ctx.fillRect(doorX, baseY - 26, 68, 3);
  ctx.fillRect(W / 2 + 14, baseY - 50, 4, 6);
  // The light getting in: down the middle, and under the door.
  ctx.fillStyle = `rgba(255, 236, 190, ${pulse.toFixed(3)})`;
  ctx.fillRect(W / 2, doorTop - 14, 1, baseY - doorTop + 14);
  ctx.fillRect(doorX, baseY - 1, 68, 1);

  // Her candles, on stepped shelves either side of the door.
  for (const side of [0, 1]) {
    for (const tier of CANDLE_TIERS) {
      const shelfY = baseY - tier.rise;
      const left = side ? W - 112 : 0;
      ctx.fillStyle = '#2a1418';
      ctx.fillRect(left, shelfY, 112, tier.rise);
      ctx.fillStyle = '#3d1e22';
      ctx.fillRect(left, shelfY, 112, 1);
      for (const candle of tier.candles) {
        const x = side ? W - 4 - candle.x : candle.x;
        drawCandle(ctx, x, shelfY, candle.tall, time, candle.seed + side * 50);
      }
    }
  }

  // The floor, with old wax pooled on it.
  ctx.fillStyle = '#24100f';
  ctx.fillRect(0, baseY, W, FLOOR_HEIGHT);
  ctx.fillStyle = '#3d1e22';
  ctx.fillRect(0, baseY, W, 1);
  ctx.fillStyle = '#cdb98f';
  for (let i = 0; i < 7; i++) ctx.fillRect(Math.round(hash(i + 700) * W), baseY + 4 + Math.round(hash(i + 710) * 10), 4 + Math.round(hash(i + 720) * 8), 1);

  // Embers drifting up.
  for (const ember of TAPER_EMBERS) {
    const y = (((ember.y - time * ember.speed) % height) + height) % height;
    const x = (ember.x + Math.sin(time + ember.sway) * 5 + W) % W;
    ctx.globalAlpha = 0.35 + 0.45 * Math.sin(time * 2.4 + ember.sway);
    ctx.fillStyle = ember.size > 1 ? '#ffcc66' : '#ff9a4a';
    ctx.fillRect(Math.round(x), Math.round(y), ember.size, ember.size);
  }
  ctx.globalAlpha = 1;
}

// --- The Long Stair: open sky at last. ---
// A daylight sky, two ranges of distant peaks with snow on their tips, the old
// stair zigzagging up the nearest mountain, clouds drifting by, grass underfoot.
const STAIR_SKY = ['#5f86c4', '#6a90ca', '#769ad0', '#83a5d5', '#92b0da', '#a2bcde', '#b4c8e0', '#c7d3df'];
const CLOUDS = Array.from({ length: 6 }, (_, i) => ({
  x: hash(i + 800) * (W + 120),
  y: 10 + hash(i + 810) * 50,
  w: 30 + hash(i + 820) * 40,
  speed: 3 + hash(i + 830) * 5,
}));

// A mountain range: peaks at these heights, evenly across the screen.
function drawRange(ctx, baseY, peaks, color, snow) {
  const span = W / (peaks.length - 1);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, baseY);
  peaks.forEach((h, i) => ctx.lineTo(i * span, baseY - h));
  ctx.lineTo(W, baseY);
  ctx.closePath();
  ctx.fill();
  if (!snow) return;
  ctx.fillStyle = snow;
  peaks.forEach((h, i) => {
    if (h < 60) return;
    ctx.beginPath();
    ctx.moveTo(i * span, baseY - h);
    ctx.lineTo(i * span - 7, baseY - h + 9);
    ctx.lineTo(i * span + 7, baseY - h + 9);
    ctx.closePath();
    ctx.fill();
  });
}

function drawStairSky(ctx, time, height) {
  const band = Math.ceil(height / STAIR_SKY.length);
  STAIR_SKY.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * band, W, band);
  });
  const baseY = height - FLOOR_HEIGHT;

  // Clouds, drifting across.
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  for (const cloud of CLOUDS) {
    const x = ((cloud.x + time * cloud.speed) % (W + 120)) - 60;
    ctx.fillRect(Math.round(x), Math.round(cloud.y), Math.round(cloud.w), 5);
    ctx.fillRect(Math.round(x + cloud.w * 0.2), Math.round(cloud.y - 4), Math.round(cloud.w * 0.5), 4);
  }

  drawRange(ctx, baseY, [40, 70, 52, 88, 60, 76, 45], '#8a9cc0', '#eef3fa');
  drawRange(ctx, baseY, [20, 46, 30, 64, 38, 50, 26], '#6a7ea4', null);
  // The stair, zigzagging up the near mountain towards its peak.
  ctx.fillStyle = '#c9c1b2';
  const bends = [[150, baseY - 4], [178, baseY - 14], [158, baseY - 24], [182, baseY - 34], [166, baseY - 44], [188, baseY - 54]];
  for (let i = 0; i < bends.length - 1; i++) {
    const [x1, y1] = bends[i];
    const [x2, y2] = bends[i + 1];
    for (let k = 0; k <= 10; k++) ctx.fillRect(Math.round(x1 + (x2 - x1) * (k / 10)), Math.round(y1 + (y2 - y1) * (k / 10)), 2, 1);
  }

  // Grass underfoot.
  ctx.fillStyle = '#4a8446';
  ctx.fillRect(0, baseY, W, FLOOR_HEIGHT);
  ctx.fillStyle = '#6aa65c';
  ctx.fillRect(0, baseY, W, 1);
  ctx.fillStyle = '#3b6d38';
  for (let x = 0; x < W; x += 5) ctx.fillRect(x + Math.round(hash(x) * 3), baseY + 2 + Math.round(hash(x + 1) * 12), 1, 2);
}

// --- Mount Vigil: high on the spire, above the clouds. ---
// A deep blue sky, the sun low and cold, a sea of cloud with the far peaks
// standing out of it, the spire's own ice-veined rock to one side, snow
// blowing across, and birds wheeling far below.
const VIGIL_SKY = ['#1f3d86', '#2a4a94', '#355aa4', '#4670b6', '#5b88c6', '#7aa2d2', '#9ebfe0', '#c3d6ea'];
const VIGIL_FLAKES = Array.from({ length: 70 }, (_, i) => ({
  x: hash(i + 1100) * W,
  y: hash(i + 1150) * 164,
  speed: 14 + hash(i + 1200) * 18,
  drift: 20 + hash(i + 1250) * 30,
  size: hash(i + 1300) < 0.3 ? 2 : 1,
}));
const VIGIL_BIRDS = Array.from({ length: 5 }, (_, i) => ({
  x: hash(i + 1400) * W,
  y: 70 + hash(i + 1450) * 50,
  speed: 10 + hash(i + 1500) * 12,
  flap: hash(i + 1550) * 10,
}));
const CLOUD_MOUNDS = Array.from({ length: 16 }, (_, i) => ({
  x: (i / 16) * (W + 80) + hash(i + 1600) * 30 - 40,
  w: 40 + hash(i + 1650) * 50,
  h: 10 + hash(i + 1700) * 10,
  bob: hash(i + 1750) * Math.PI * 2,
}));

function drawVigilHeights(ctx, time, height) {
  const band = Math.ceil(height / VIGIL_SKY.length);
  VIGIL_SKY.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * band, W, band);
  });
  const baseY = height - FLOOR_HEIGHT;

  // A cold low sun with a halo.
  const halo = ctx.createRadialGradient(254, 36, 4, 254, 36, 60);
  halo.addColorStop(0, 'rgba(255, 246, 214, 0.5)');
  halo.addColorStop(1, 'rgba(255, 246, 214, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(194, -24, 120, 120);
  ctx.fillStyle = '#fff8e0';
  ctx.beginPath();
  ctx.arc(254, 36, 8, 0, Math.PI * 2);
  ctx.fill();

  // Far peaks standing out of the cloud sea.
  drawRange(ctx, baseY - 30, [50, 84, 62, 96, 70, 88, 56], '#6d82b0', '#eef3fa');
  // The cloud sea, rolling very slowly.
  ctx.fillStyle = 'rgba(236, 242, 250, 0.95)';
  for (const mound of CLOUD_MOUNDS) {
    const x = ((mound.x + time * 3) % (W + 80) + (W + 80)) % (W + 80) - 40;
    const y = baseY - 34 + Math.round(Math.sin(time * 0.5 + mound.bob) * 1.5);
    ctx.fillRect(Math.round(x), y, Math.round(mound.w), Math.round(mound.h));
    ctx.fillRect(Math.round(x + mound.w * 0.2), y - 4, Math.round(mound.w * 0.5), 4);
  }
  ctx.fillStyle = '#e2eaf6';
  ctx.fillRect(0, baseY - 26, W, 26);

  // Birds wheeling over the cloud.
  ctx.fillStyle = '#1e2436';
  for (const bird of VIGIL_BIRDS) {
    const x = Math.round(((bird.x + time * bird.speed) % (W + 20)) - 10);
    const y = Math.round(bird.y + Math.sin(time * 0.7 + bird.flap) * 6);
    const dy = Math.floor(time * 7 + bird.flap) % 2 ? -1 : 1;
    ctx.fillRect(x - 2, y + dy, 1, 1);
    ctx.fillRect(x - 1, y, 2, 1);
    ctx.fillRect(x + 1, y + dy, 1, 1);
  }

  // The spire's rock at the right-hand side, veined with ice.
  ctx.fillStyle = '#4a5068';
  ctx.beginPath();
  ctx.moveTo(W, 0);
  ctx.lineTo(W - 56, 0);
  ctx.lineTo(W - 44, 40);
  ctx.lineTo(W - 62, 90);
  ctx.lineTo(W - 50, baseY);
  ctx.lineTo(W, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6f7a94';
  for (let y = 6; y < baseY; y += 9) ctx.fillRect(W - 40 + Math.round(hash(y) * 10), y, 20 + Math.round(hash(y + 1) * 16), 2);
  ctx.fillStyle = '#cfe6f5';
  ctx.fillRect(W - 30, 10, 1, 60);
  ctx.fillRect(W - 18, 50, 1, 70);
  ctx.fillStyle = '#eef3fa';
  ctx.fillRect(W - 56, 0, 56, 3);

  // Snow underfoot, and blowing across.
  ctx.fillStyle = '#e6edf6';
  ctx.fillRect(0, baseY, W, FLOOR_HEIGHT);
  ctx.fillStyle = '#f6f9fc';
  ctx.fillRect(0, baseY, W, 1);
  ctx.fillStyle = '#cfdcee';
  for (let x = 0; x < W; x += 7) ctx.fillRect(x + Math.round(hash(x + 7) * 4), baseY + 3 + Math.round(hash(x + 9) * 12), 3, 1);
  for (const flake of VIGIL_FLAKES) {
    const y = (((flake.y + time * flake.speed) % height) + height) % height;
    const x = (((flake.x + time * flake.drift) % W) + W) % W;
    ctx.globalAlpha = flake.size > 1 ? 0.9 : 0.6;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(Math.round(x), Math.round(y), flake.size, flake.size);
  }
  ctx.globalAlpha = 1;
}

// --- Heralds' Rest: the village square at dusk, lamps lit, snow falling. ---
const REST_SKY = ['#2a3f7a', '#34508c', '#40619c', '#5276ae', '#6b8dc0', '#89a6cf', '#a9bfdc', '#c7d3e6'];
const REST_FLAKES = Array.from({ length: 60 }, (_, i) => ({
  x: hash(i + 2100) * W,
  y: hash(i + 2150) * 164,
  speed: 10 + hash(i + 2200) * 14,
  sway: hash(i + 2250) * Math.PI * 2,
  size: hash(i + 2300) < 0.3 ? 2 : 1,
}));
const CABINS = [
  { x: 10, w: 70, h: 44, windows: [20, 44] },
  { x: 98, w: 90, h: 52, windows: [18, 46, 72] },
  { x: 206, w: 60, h: 40, windows: [22] },
  { x: 280, w: 60, h: 48, windows: [14, 40] },
];

function drawCabin(ctx, cabin, baseY, time) {
  const top = baseY - cabin.h;
  // Walls: logs.
  ctx.fillStyle = '#9a6a3a';
  ctx.fillRect(cabin.x, top, cabin.w, cabin.h);
  ctx.fillStyle = '#5a3a1e';
  for (let y = top + 3; y < baseY; y += 4) ctx.fillRect(cabin.x, y, cabin.w, 1);
  // A snowy roof.
  ctx.fillStyle = '#6b3a2a';
  ctx.beginPath();
  ctx.moveTo(cabin.x - 6, top);
  ctx.lineTo(cabin.x + cabin.w / 2, top - 22);
  ctx.lineTo(cabin.x + cabin.w + 6, top);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e6edf6';
  ctx.beginPath();
  ctx.moveTo(cabin.x - 6, top - 2);
  ctx.lineTo(cabin.x + cabin.w / 2, top - 24);
  ctx.lineTo(cabin.x + cabin.w + 6, top - 2);
  ctx.lineTo(cabin.x + cabin.w + 6, top - 6);
  ctx.lineTo(cabin.x + cabin.w / 2, top - 28);
  ctx.lineTo(cabin.x - 6, top - 6);
  ctx.closePath();
  ctx.fill();
  // Lit windows, with a warm glow, flickering a little.
  for (const wx of cabin.windows) {
    const x = cabin.x + wx;
    const y = top + 12;
    const glow = ctx.createRadialGradient(x + 5, y + 6, 1, x + 5, y + 6, 22);
    glow.addColorStop(0, `rgba(255, 200, 110, ${(0.3 + 0.05 * Math.sin(time * 3 + wx)).toFixed(3)})`);
    glow.addColorStop(1, 'rgba(255, 200, 110, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - 17, y - 16, 44, 44);
    ctx.fillStyle = '#5a3a1e';
    ctx.fillRect(x - 1, y - 1, 12, 14);
    ctx.fillStyle = '#ffcc66';
    ctx.fillRect(x, y, 10, 12);
    ctx.fillStyle = '#5a3a1e';
    ctx.fillRect(x + 4, y, 1, 12);
    ctx.fillRect(x, y + 5, 10, 1);
    ctx.fillStyle = '#eef3fa';
    ctx.fillRect(x - 2, y + 12, 14, 2);
  }
  // A chimney with smoke.
  ctx.fillStyle = '#5a5468';
  ctx.fillRect(cabin.x + cabin.w - 16, top - 20, 7, 14);
  ctx.fillStyle = 'rgba(220, 220, 230, 0.5)';
  for (let i = 0; i < 4; i++) {
    const t = (time * 0.4 + i * 0.25) % 1;
    ctx.fillRect(Math.round(cabin.x + cabin.w - 14 + Math.sin(t * 6) * 3), Math.round(top - 24 - t * 30), 3 + i, 2);
  }
}

function drawRestSquare(ctx, time, height) {
  const band = Math.ceil(height / REST_SKY.length);
  REST_SKY.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * band, W, band);
  });
  const baseY = height - FLOOR_HEIGHT;
  // The peaks behind the village.
  drawRange(ctx, baseY - 40, [60, 90, 70, 100, 76, 94, 64], '#6d82b0', '#eef3fa');
  for (const cabin of CABINS) drawCabin(ctx, cabin, baseY, time);
  // Lamp posts between the cabins, lit.
  for (const x of [88, 196, 272]) {
    const glow = ctx.createRadialGradient(x + 2, baseY - 38, 1, x + 2, baseY - 38, 30);
    glow.addColorStop(0, 'rgba(255, 210, 120, 0.35)');
    glow.addColorStop(1, 'rgba(255, 210, 120, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - 28, baseY - 68, 60, 60);
    ctx.fillStyle = '#2a2630';
    ctx.fillRect(x + 1, baseY - 34, 2, 34);
    ctx.fillRect(x - 2, baseY - 44, 8, 10);
    ctx.fillStyle = '#ffcc66';
    ctx.fillRect(x - 1, baseY - 43, 6, 8);
    ctx.fillStyle = '#eef3fa';
    ctx.fillRect(x - 3, baseY - 46, 10, 2);
  }
  // Bunting strung across the square.
  for (let x = 0; x < W; x += 12) {
    const sag = Math.round(Math.sin((x / W) * Math.PI) * 10);
    ctx.fillStyle = ['#c43b3b', '#3f6fb5', '#f0c050'][(x / 12) % 3];
    ctx.fillRect(x, 20 + sag, 6, 5);
    ctx.fillRect(x + 2, 25 + sag, 2, 2);
  }
  // Snow underfoot.
  ctx.fillStyle = '#e6edf6';
  ctx.fillRect(0, baseY, W, FLOOR_HEIGHT);
  ctx.fillStyle = '#f6f9fc';
  ctx.fillRect(0, baseY, W, 1);
  ctx.fillStyle = '#cfdcee';
  for (let x = 0; x < W; x += 9) ctx.fillRect(x + Math.round(hash(x + 3) * 5), baseY + 4 + Math.round(hash(x + 5) * 10), 4, 1);
  // Snow falling, gently.
  for (const flake of REST_FLAKES) {
    const y = (((flake.y + time * flake.speed) % height) + height) % height;
    const x = (((flake.x + Math.sin(time * 0.8 + flake.sway) * 8) % W) + W) % W;
    ctx.globalAlpha = flake.size > 1 ? 0.9 : 0.6;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(Math.round(x), Math.round(y), flake.size, flake.size);
  }
  ctx.globalAlpha = 1;
}

// By area (a room's `area`), plus special ones a boss can ask for with its
// own `backdrop` (Taper's 'taper_stand').

// --- The ice caves: a crystal cavern, glowing blue. ---
// Layers of rock going back into the dark, icicles hanging from the roof
// (now and then one drips, and the drop splashes on the floor), clusters of
// ice crystal on the floor and the walls that pulse with their own light,
// slow beams of that light sweeping through the air, sparkles drifting
// in it, and a glassy floor that reflects the crystals.
const CAVE_SKY = ['#06040e', '#080614', '#0a0819', '#0c0b1f', '#0e0e25', '#10112b', '#121531', '#141837'];
const CAVE_ICICLES = Array.from({ length: 22 }, (_, i) => ({
  x: Math.round(hash(i + 1500) * W),
  len: 8 + Math.round(hash(i + 1510) * 26),
  w: 2 + Math.round(hash(i + 1520) * 3),
  drip: hash(i + 1530) * 7,
  every: 4 + hash(i + 1540) * 6,
}));
const CAVE_CRYSTALS = Array.from({ length: 9 }, (_, i) => ({
  x: 10 + Math.round(((i + 0.5) / 9) * (W - 20) + (hash(i + 1600) - 0.5) * 24),
  size: 8 + Math.round(hash(i + 1610) * 14),
  wall: i % 3 === 1,
  y: hash(i + 1620),
  pulse: hash(i + 1630) * Math.PI * 2,
}));
const CAVE_MOTES = Array.from({ length: 40 }, (_, i) => ({
  x: hash(i + 1700) * W, y: hash(i + 1710), speed: 2 + hash(i + 1720) * 5, sway: hash(i + 1730) * Math.PI * 2,
}));

// A cluster of crystal shards growing up from (x, y), `size` tall, lit `glow` (0 to 1).
function drawCrystalCluster(ctx, x, y, size, glow) {
  const shards = [[-0.5, 0.6, -0.25], [0, 1, 0], [0.45, 0.75, 0.2], [0.9, 0.45, 0.35], [-0.95, 0.4, -0.4]];
  for (const [dx, tall, lean] of shards) {
    const h = size * tall;
    const bx = x + dx * size * 0.5;
    const w = Math.max(2, size * 0.22);
    ctx.fillStyle = `rgba(${Math.round(120 + 80 * glow)}, ${Math.round(190 + 50 * glow)}, 255, 0.95)`;
    ctx.beginPath();
    ctx.moveTo(bx - w / 2, y);
    ctx.lineTo(bx + w / 2, y);
    ctx.lineTo(bx + lean * h * 0.4, y - h);
    ctx.closePath();
    ctx.fill();
    // A bright edge down one side.
    ctx.fillStyle = `rgba(235, 250, 255, ${(0.5 + 0.4 * glow).toFixed(3)})`;
    ctx.fillRect(Math.round(bx - w / 2 + 1), Math.round(y - h * 0.7), 1, Math.round(h * 0.6));
  }
}

function drawCrystalCave(ctx, time, height) {
  const band = Math.ceil(height / CAVE_SKY.length);
  CAVE_SKY.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * band, W, band);
  });
  const floorY = height - FLOOR_HEIGHT - 6;
  const crystalY = (c) => (c.wall ? 30 + c.y * (floorY - 70) : floorY);
  const glowOf = (c) => 0.6 + 0.4 * Math.sin(time * 1.3 + c.pulse);

  // The crystals' light, pulsing, washing the whole cave blue.
  for (const c of CAVE_CRYSTALS) {
    const cy = crystalY(c) - c.size * 0.5;
    const light = ctx.createRadialGradient(c.x, cy, 2, c.x, cy, 34 + c.size * 2);
    light.addColorStop(0, `rgba(110, 200, 255, ${(0.22 * glowOf(c)).toFixed(3)})`);
    light.addColorStop(1, 'rgba(110, 200, 255, 0)');
    ctx.fillStyle = light;
    ctx.fillRect(c.x - 80, cy - 80, 160, 160);
  }

  // Rock going back into the dark: two layers of cave wall, the far one fainter.
  for (const [layer, color, top] of [[0, '#151a33', 0.35], [1, '#1c2140', 0.55]]) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    for (let x = 0; x <= W; x += 16) {
      const h = (top + hash(Math.floor(x / 16) + layer * 50 + 1800) * 0.25) * floorY;
      ctx.lineTo(x, floorY - h * (layer ? 0.55 : 1));
    }
    ctx.lineTo(W, floorY);
    ctx.closePath();
    ctx.fill();
  }

  // Beams of crystal light sweeping slowly through the air.
  for (let i = 0; i < 3; i++) {
    const x = ((time * (6 + i * 3) + i * 110) % (W + 120)) - 60;
    const a = 0.05 + 0.03 * Math.sin(time * 0.8 + i * 2);
    const beam = ctx.createLinearGradient(x, 0, x + 40, 0);
    beam.addColorStop(0, 'rgba(170, 225, 255, 0)');
    beam.addColorStop(0.5, `rgba(170, 225, 255, ${a.toFixed(3)})`);
    beam.addColorStop(1, 'rgba(170, 225, 255, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 26, 0);
    ctx.lineTo(x + 60, floorY);
    ctx.lineTo(x + 20, floorY);
    ctx.closePath();
    ctx.fill();
  }

  // Crystals in the walls, and on the floor.
  for (const c of CAVE_CRYSTALS) drawCrystalCluster(ctx, c.x, crystalY(c), c.wall ? c.size * 0.6 : c.size, glowOf(c));

  // The roof, and its icicles; now and then one drips.
  ctx.fillStyle = '#0b0d1c';
  ctx.fillRect(0, 0, W, 6);
  for (const ice of CAVE_ICICLES) {
    ctx.fillStyle = '#8fb8d8';
    ctx.beginPath();
    ctx.moveTo(ice.x - ice.w / 2, 4);
    ctx.lineTo(ice.x + ice.w / 2, 4);
    ctx.lineTo(ice.x, 4 + ice.len);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#e8f6ff';
    ctx.fillRect(ice.x - 1, 5, 1, Math.round(ice.len * 0.6));
    // The drop: forms at the tip, falls, and splashes.
    const k = ((time + ice.drip) % ice.every) / ice.every;
    const tip = 4 + ice.len;
    ctx.fillStyle = 'rgba(220, 245, 255, 0.9)';
    if (k < 0.15) {
      ctx.fillRect(ice.x, tip, 1, 1 + Math.round(k * 10));
    } else if (k < 0.35) {
      const f = (k - 0.15) / 0.2;
      ctx.fillRect(ice.x, Math.round(tip + (floorY - tip) * f * f), 1, 2);
    } else if (k < 0.45) {
      const f = (k - 0.35) / 0.1;
      ctx.fillStyle = `rgba(220, 245, 255, ${(0.8 * (1 - f)).toFixed(3)})`;
      ctx.fillRect(Math.round(ice.x - 2 - f * 3), floorY - 1 - Math.round(f * 2), 1, 1);
      ctx.fillRect(Math.round(ice.x + 2 + f * 3), floorY - 1 - Math.round(f * 2), 1, 1);
    }
  }

  // Sparkles drifting in the light.
  for (const mote of CAVE_MOTES) {
    const y = ((mote.y * floorY - time * mote.speed) % floorY + floorY) % floorY;
    const x = mote.x + Math.sin(time * 0.7 + mote.sway) * 6;
    const twinkle = 0.3 + 0.7 * Math.max(0, Math.sin(time * 3 + mote.sway * 5));
    ctx.fillStyle = `rgba(220, 245, 255, ${(0.6 * twinkle).toFixed(3)})`;
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  }

  // The frozen floor: glassy, with the crystals' glow reflected in it.
  ctx.fillStyle = '#1b2a48';
  ctx.fillRect(0, floorY, W, height - floorY);
  ctx.fillStyle = '#2c4470';
  ctx.fillRect(0, floorY, W, 1);
  for (const c of CAVE_CRYSTALS) {
    if (c.wall) continue;
    ctx.fillStyle = `rgba(150, 215, 255, ${(0.18 * glowOf(c)).toFixed(3)})`;
    ctx.fillRect(c.x - c.size * 0.6, floorY + 2, c.size * 1.2, Math.min(height - floorY - 2, c.size * 0.6));
  }
  for (let x = 0; x < W; x += 23) {
    ctx.fillStyle = 'rgba(200, 235, 255, 0.12)';
    ctx.fillRect(x + Math.round(hash(x + 1900) * 12), floorY + 4 + Math.round(hash(x + 1910) * 10), 8, 1);
  }
}

// --- The summit of Mount Vigil, where the Usurper makes his stand. ---
// Nothing higher anywhere: a dusk sky going to night, the first stars, the
// sea of cloud far below, and the crown of snow with the old beacon on it,
// cold. The storm he stopped hangs in the air, flakes barely drifting.
const SUMMIT_SKY = ['#0d0a24', '#14102f', '#1c153a', '#271b46', '#352252', '#4a2a5a', '#6a3a5e', '#8a4e5e'];
const SUMMIT_STARS = Array.from({ length: 30 }, (_, i) => ({
  x: hash(i + 2600) * W,
  y: hash(i + 2650) * 70,
  twinkle: hash(i + 2700) * Math.PI * 2,
}));
const SUMMIT_FLAKES = Array.from({ length: 40 }, (_, i) => ({
  x: hash(i + 2800) * W,
  y: hash(i + 2850) * 150,
  bob: hash(i + 2900) * Math.PI * 2,
}));
let summitBeacon = null;
let summitCairn = null;
function drawSummit(ctx, time, height) {
  const band = Math.ceil(height / SUMMIT_SKY.length);
  SUMMIT_SKY.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * band, W, band);
  });
  const baseY = height - FLOOR_HEIGHT - 6;
  for (const star of SUMMIT_STARS) {
    ctx.fillStyle = `rgba(255, 246, 230, ${(0.35 + 0.35 * Math.sin(time * 1.5 + star.twinkle)).toFixed(3)})`;
    ctx.fillRect(Math.round(star.x), Math.round(star.y), 1, 1);
  }
  // Far peaks, and the sea of cloud far below, rolling very slowly.
  drawRange(ctx, baseY - 14, [20, 34, 26, 40, 30, 36, 22], '#3a2f5a', '#b8b0d0');
  ctx.fillStyle = 'rgba(190, 170, 200, 0.85)';
  for (const mound of CLOUD_MOUNDS) {
    const x = ((mound.x + time * 2) % (W + 80) + (W + 80)) % (W + 80) - 40;
    ctx.fillRect(Math.round(x), baseY - 12 + Math.round(Math.sin(time * 0.4 + mound.bob)), Math.round(mound.w), 8);
  }
  // The crown of snow.
  ctx.fillStyle = '#d8dcec';
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, baseY + 4);
  ctx.quadraticCurveTo(W / 2, baseY - 10, W, baseY + 4);
  ctx.lineTo(W, height);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f2f4fa';
  ctx.fillRect(0, baseY + 8, W, 1);
  ctx.fillStyle = '#b4bcd4';
  for (let x = 0; x < W; x += 9) ctx.fillRect(x + Math.round(hash(x + 2950) * 5), baseY + 10 + Math.round(hash(x + 2960) * 14), 3, 1);
  // The beacon, cold, and the cairns of those who made it this far.
  summitBeacon ??= makeSprite(PROP_SPRITES.beacon_cold, PROP_PALETTE);
  summitCairn ??= makeSprite(PROP_SPRITES.cairn, PROP_PALETTE);
  ctx.drawImage(summitBeacon, 136, baseY + 4 - summitBeacon.height);
  ctx.drawImage(summitCairn, 18, baseY + 2 - summitCairn.height);
  ctx.drawImage(summitCairn, 300, baseY + 4 - summitCairn.height);
  // The stilled storm: flakes hanging in the air, barely moving.
  for (const flake of SUMMIT_FLAKES) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillRect(Math.round(flake.x + Math.sin(time * 0.3 + flake.bob) * 3), Math.round(flake.y + Math.sin(time * 0.2 + flake.bob) * 2), 1, 1);
  }
}

// --- The Pinefall: the scarlet wood below the clouds (Chapter 3). ---
// A dim wine-dark sky between the trunks, two rows of scarlet trees (the far
// ones dark and hazy, the near ones lit), light coming down in slanting
// bars, leaves drifting across, and a floor of dark leaf litter kept quiet
// so the trees carry the colour.
const PINEFALL_SKY = ['#1a0a12', '#210c15', '#290f18', '#31121b', '#3a161e', '#431a21', '#4c1e23', '#552325'];
const FAR_PINES = Array.from({ length: 11 }, (_, i) => ({ x: i * 32 + hash(i + 3000) * 18, w: 22 + hash(i + 3010) * 10, h: 58 + hash(i + 3020) * 26 }));
const NEAR_PINES = Array.from({ length: 6 }, (_, i) => ({ x: i * 60 + hash(i + 3030) * 30 - 10, w: 34 + hash(i + 3040) * 12, h: 86 + hash(i + 3050) * 30 }));
const PINEFALL_LEAVES = Array.from({ length: 26 }, (_, i) => ({
  x: hash(i + 3100) * W,
  y: hash(i + 3150) * 164,
  speed: 8 + hash(i + 3200) * 10,
  drift: 6 + hash(i + 3250) * 12,
  sway: hash(i + 3300) * Math.PI * 2,
  bright: hash(i + 3350) < 0.4,
}));
// A scarlet tree: a trunk, and a crown of three stacked, ragged tiers.
function drawScarletTree(ctx, x, baseY, w, h, trunk, crown, lit) {
  ctx.fillStyle = trunk;
  ctx.fillRect(Math.round(x + w / 2 - 2), Math.round(baseY - h * 0.45), 4, Math.round(h * 0.45));
  for (let tier = 0; tier < 3; tier++) {
    const tw = w * (1 - tier * 0.22);
    const ty = baseY - h * 0.38 - tier * h * 0.2;
    ctx.fillStyle = crown;
    ctx.fillRect(Math.round(x + (w - tw) / 2), Math.round(ty - h * 0.24), Math.round(tw), Math.round(h * 0.26));
    if (lit) {
      ctx.fillStyle = lit;
      ctx.fillRect(Math.round(x + (w - tw) / 2 + 2), Math.round(ty - h * 0.24), Math.round(tw * 0.4), 2);
    }
  }
}
function drawPinefall(ctx, time, height) {
  const band = Math.ceil(height / PINEFALL_SKY.length);
  PINEFALL_SKY.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * band, W, band);
  });
  const baseY = height - FLOOR_HEIGHT;
  for (const tree of FAR_PINES) drawScarletTree(ctx, tree.x, baseY - 6, tree.w, tree.h, '#24100f', '#5a1a1c', null);
  // Light in slanting bars, breathing slowly.
  ctx.save();
  for (let i = 0; i < 4; i++) {
    ctx.globalAlpha = 0.05 + 0.03 * Math.sin(time * 0.5 + i * 1.7);
    ctx.fillStyle = '#ffc890';
    const x = 30 + i * 80;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 14, 0);
    ctx.lineTo(x + 44, baseY);
    ctx.lineTo(x + 26, baseY);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  for (const tree of NEAR_PINES) drawScarletTree(ctx, tree.x, baseY + 2, tree.w, tree.h, '#3a1c12', '#a8281e', '#d8402a');
  // Leaf litter underfoot: dark, low-contrast.
  ctx.fillStyle = '#2c1418';
  ctx.fillRect(0, baseY, W, FLOOR_HEIGHT);
  ctx.fillStyle = '#3c1a1c';
  ctx.fillRect(0, baseY, W, 1);
  ctx.fillStyle = '#4a1e1e';
  for (let x = 0; x < W; x += 6) ctx.fillRect(x + Math.round(hash(x + 3400) * 4), baseY + 3 + Math.round(hash(x + 3410) * 12), 2, 1);
  // Leaves coming down.
  for (const leaf of PINEFALL_LEAVES) {
    const y = (leaf.y + time * leaf.speed) % (height + 10) - 5;
    const x = (leaf.x + Math.sin(time * 0.9 + leaf.sway) * leaf.drift + W) % W;
    ctx.fillStyle = leaf.bright ? '#e0502e' : '#9a2a1e';
    ctx.fillRect(Math.round(x), Math.round(y), 2, 1);
  }
}

// --- The Old Drains: under Hollin's well (Chapter 3). ---
// Looking down a brick culvert into the dark: its arches go back and back,
// each a little dimmer, until at the far end the brick gives way to the old
// city's great carved stone. A grating somewhere above lets down one pale
// shaft of daylight. Black water runs along the channel underfoot, slowly,
// and drips come down from the vault into it. Kept dark and low so the
// bullets stand out.
const DRAINS_SKY = ['#08070b', '#0b090e', '#0e0b11', '#110d14', '#130f16', '#151118', '#17131a', '#19141b'];
// Arches from the far end of the culvert to the near: how far each is (0 far,
// 1 near).
const DRAINS_ARCHES = [0.12, 0.26, 0.42, 0.6, 0.8, 1];
const DRAINS_DRIPS = Array.from({ length: 7 }, (_, i) => ({
  x: 20 + hash(i + 3500) * (W - 40),
  every: 2.4 + hash(i + 3510) * 2.6,
  at: hash(i + 3520) * 5,
}));
const DRAINS_RIPPLES = Array.from({ length: 22 }, (_, i) => ({
  x: hash(i + 3600) * W,
  y: hash(i + 3610),
  w: 4 + Math.round(hash(i + 3620) * 8),
  speed: 5 + hash(i + 3630) * 6,
}));
const DRAINS_MOTES = Array.from({ length: 16 }, (_, i) => ({
  x: hash(i + 3700), y: hash(i + 3710), sway: hash(i + 3720) * Math.PI * 2,
}));

// One brick arch of the culvert, centred, `k` of the way from the far end to
// the near: a ring of brick round the dark of the next arch along.
function drawDrainArch(ctx, k, floorY) {
  const cx = W / 2;
  const half = 26 + k * (W / 2 + 30 - 26);
  const spring = floorY - (14 + k * 40);
  const ring = 2 + Math.round(k * 7);
  const shade = Math.round(18 + k * 22);
  const brick = `rgb(${shade + 10}, ${shade}, ${shade - 4})`;
  const mortar = `rgb(${shade - 6}, ${shade - 10}, ${shade - 12})`;
  ctx.fillStyle = brick;
  ctx.beginPath();
  ctx.moveTo(cx - half - ring, floorY);
  ctx.lineTo(cx - half - ring, spring);
  ctx.arc(cx, spring, half + ring, Math.PI, 0);
  ctx.lineTo(cx + half + ring, floorY);
  ctx.lineTo(cx + half, floorY);
  ctx.lineTo(cx + half, spring);
  ctx.arc(cx, spring, half, 0, Math.PI, true);
  ctx.lineTo(cx - half, floorY);
  ctx.closePath();
  ctx.fill();
  // Mortar lines between the bricks of the ring.
  if (ring >= 4) {
    ctx.fillStyle = mortar;
    const n = Math.round(10 + k * 14);
    for (let i = 1; i < n; i++) {
      const a = Math.PI + (i / n) * Math.PI;
      const r0 = half + 1;
      ctx.fillRect(Math.round(cx + Math.cos(a) * r0), Math.round(spring + Math.sin(a) * r0), 1, Math.max(1, ring - 2));
    }
    for (let y = spring + 4; y < floorY; y += 5) {
      ctx.fillRect(Math.round(cx - half - ring), y, ring, 1);
      ctx.fillRect(Math.round(cx + half), y, ring, 1);
    }
  }
}

function drawDrains(ctx, time, height) {
  const band = Math.ceil(height / DRAINS_SKY.length);
  DRAINS_SKY.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * band, W, band);
  });
  const floorY = height - FLOOR_HEIGHT;
  const cx = W / 2;

  // At the far end: the old city's conduit, big pale-grey blocks with a band
  // of carving across them, faint in the dark.
  const farTop = floorY - 64;
  ctx.fillStyle = '#1e1d24';
  ctx.fillRect(cx - 30, farTop, 60, floorY - farTop);
  ctx.fillStyle = '#25242c';
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 3; col++) {
      const bx = cx - 30 + col * 20 + (row % 2 ? 10 : 0);
      ctx.fillRect(bx + 1, farTop + row * 12 + 1, 18, 10);
    }
  }
  ctx.fillStyle = '#2e2c36';
  for (let x = cx - 28; x < cx + 28; x += 4) ctx.fillRect(x, farTop + 26 + ((x / 4) % 2), 2, 2);
  // The conduit's own great arch, black, with a glint of water at its foot.
  ctx.fillStyle = '#060508';
  ctx.beginPath();
  ctx.moveTo(cx - 14, floorY);
  ctx.lineTo(cx - 14, floorY - 18);
  ctx.arc(cx, floorY - 18, 14, Math.PI, 0);
  ctx.lineTo(cx + 14, floorY);
  ctx.closePath();
  ctx.fill();

  // The culvert's arches, far to near.
  for (const k of DRAINS_ARCHES) drawDrainArch(ctx, k, floorY);

  // Daylight through a grating, far above: a pale slanting shaft, breathing,
  // with dust turning in it.
  ctx.save();
  ctx.globalAlpha = 0.07 + 0.025 * Math.sin(time * 0.6);
  ctx.fillStyle = '#c8d0c0';
  ctx.beginPath();
  ctx.moveTo(78, 0);
  ctx.lineTo(100, 0);
  ctx.lineTo(132, floorY);
  ctx.lineTo(96, floorY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  // The grating's bars, where it comes in at the top.
  ctx.fillStyle = '#2a2a2c';
  ctx.fillRect(74, 0, 30, 3);
  ctx.fillStyle = '#5e6260';
  for (let x = 76; x < 104; x += 5) ctx.fillRect(x, 0, 2, 3);
  for (const mote of DRAINS_MOTES) {
    const k = (mote.y + time * 0.03) % 1;
    const x = 82 + k * 32 + mote.x * 18 + Math.sin(time * 0.8 + mote.sway) * 2;
    ctx.fillStyle = `rgba(220, 226, 210, ${(0.25 + 0.2 * Math.sin(time * 2 + mote.sway)).toFixed(3)})`;
    ctx.fillRect(Math.round(x), Math.round(k * floorY), 1, 1);
  }

  // Underfoot: a brick walkway, and the channel of black water running along
  // it, slowly, left to right.
  ctx.fillStyle = '#1c1618';
  ctx.fillRect(0, floorY, W, FLOOR_HEIGHT);
  ctx.fillStyle = '#2a2224';
  ctx.fillRect(0, floorY, W, 1);
  ctx.fillStyle = '#141012';
  for (let x = 0; x < W; x += 12) ctx.fillRect(x + (hash(x + 3800) < 0.5 ? 0 : 6), floorY + 3, 1, 4);
  ctx.fillRect(0, floorY + 7, W, 1);
  const waterY = floorY + 9;
  ctx.fillStyle = '#07090d';
  ctx.fillRect(0, waterY, W, FLOOR_HEIGHT - 9);
  ctx.fillStyle = '#0e1218';
  ctx.fillRect(0, waterY, W, 1);
  for (const r of DRAINS_RIPPLES) {
    const x = ((r.x + time * r.speed) % (W + 20)) - 10;
    const y = waterY + 2 + Math.round(r.y * (FLOOR_HEIGHT - 12));
    ctx.fillStyle = 'rgba(70, 84, 96, 0.35)';
    ctx.fillRect(Math.round(x), y, r.w, 1);
  }
  // The shaft's light on the water.
  ctx.fillStyle = `rgba(200, 210, 196, ${(0.06 + 0.03 * Math.sin(time * 1.4)).toFixed(3)})`;
  ctx.fillRect(98, waterY + 1, 32, FLOOR_HEIGHT - 10);

  // Drips from the vault: a drop forms, falls, and rings out on the water.
  for (const drip of DRAINS_DRIPS) {
    const k = ((time + drip.at) % drip.every) / drip.every;
    const x = Math.round(drip.x);
    const fallTo = waterY + 3;
    if (k < 0.12) {
      ctx.fillStyle = 'rgba(150, 160, 170, 0.7)';
      ctx.fillRect(x, 2, 1, 1 + Math.round(k * 12));
    } else if (k < 0.3) {
      const f = (k - 0.12) / 0.18;
      ctx.fillStyle = 'rgba(160, 170, 180, 0.8)';
      ctx.fillRect(x, Math.round(2 + (fallTo - 2) * f * f), 1, 2);
    } else if (k < 0.5) {
      const f = (k - 0.3) / 0.2;
      const r = 1 + Math.round(f * 5);
      ctx.fillStyle = `rgba(110, 124, 136, ${(0.6 * (1 - f)).toFixed(3)})`;
      ctx.fillRect(x - r, fallTo, r * 2 + 1, 1);
    }
  }
}

// --- The Lantern Marsh: below where the old city's conduit spills out
// under the trees (Chapter 3). ---
// A flat grey fen under a flat grey sky. Far off, the dark edge of the wood,
// and the broken end of the old stone conduit with its water still falling.
// A line of lanterns on poles goes away across the bog (the one safe path),
// each with its light on the black water under it; and out in the fog,
// off the path, a few more lights drift about that look just like them.
// Bands of mist roll slowly across, a low one hangs over the water, and
// reeds stand up close on either side, swaying.
const MARSH_SKY = ['#2a2e32', '#2e3236', '#32363a', '#363a3d', '#393d40', '#3b3f41', '#3a3e40', '#363a3c'];
const MARSH_TREES = Array.from({ length: 16 }, (_, i) => ({ x: i * 22 + hash(i + 4000) * 14 - 8, w: 12 + hash(i + 4010) * 10, h: 14 + hash(i + 4020) * 16 }));
// The lanterns on the path, far to near: x across the screen, and how far
// off (0 far, 1 near).
const MARSH_LANTERNS = [
  { x: 86, k: 0.04 }, { x: 104, k: 0.14 }, { x: 210, k: 0.3 }, { x: 228, k: 0.44 }, { x: 306, k: 0.7 },
];
// The lights that aren't lanterns, out in the fog.
const MARSH_WISPS = Array.from({ length: 4 }, (_, i) => ({
  x: 24 + hash(i + 4100) * 120, y: 0.25 + hash(i + 4110) * 0.5, sway: hash(i + 4120) * Math.PI * 2, every: 7 + hash(i + 4130) * 5,
}));
const MARSH_MIST = Array.from({ length: 5 }, (_, i) => ({
  y: 0.3 + i * 0.13, speed: 3 + hash(i + 4200) * 4, w: 90 + hash(i + 4210) * 80, at: hash(i + 4220) * W,
}));
const MARSH_REEDS = [
  ...Array.from({ length: 9 }, (_, i) => ({ x: 2 + i * 4 + hash(i + 4300) * 3, h: 26 + hash(i + 4310) * 26, sway: hash(i + 4320) * 6, cattail: hash(i + 4330) < 0.45 })),
  ...Array.from({ length: 9 }, (_, i) => ({ x: W - 38 + i * 4 + hash(i + 4340) * 3, h: 24 + hash(i + 4350) * 28, sway: hash(i + 4360) * 6, cattail: hash(i + 4370) < 0.45 })),
];
const MARSH_RIPPLES = Array.from({ length: 10 }, (_, i) => ({
  x: hash(i + 4400) * W, y: hash(i + 4410), every: 3 + hash(i + 4420) * 3, at: hash(i + 4430) * 6,
}));

// A soft round glow: rings of light, fading out.
function drawGlow(ctx, x, y, radius, color, strength) {
  for (let r = radius; r >= 1; r -= Math.max(1, radius / 4)) {
    ctx.fillStyle = color;
    ctx.globalAlpha = strength * (1 - r / (radius + 1)) * 0.6;
    ctx.fillRect(Math.round(x - r), Math.round(y - r * 0.8), Math.round(r * 2), Math.round(r * 1.6));
  }
  ctx.globalAlpha = 1;
}

function drawMarsh(ctx, time, height) {
  const band = Math.ceil(height / MARSH_SKY.length);
  MARSH_SKY.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * band, W, band);
  });
  const floorY = height - FLOOR_HEIGHT;
  const horizon = floorY - 54;

  // The edge of the wood, far off and dim, and the old conduit coming out
  // of it on broken stone arches, with its water still pouring off the end.
  ctx.fillStyle = '#25292c';
  for (const tree of MARSH_TREES) {
    ctx.fillRect(Math.round(tree.x), Math.round(horizon - tree.h), Math.round(tree.w), Math.round(tree.h) + 1);
    ctx.fillRect(Math.round(tree.x + tree.w / 2 - 1), Math.round(horizon - tree.h - 4), 3, 4);
  }
  ctx.fillStyle = '#2c3033';
  ctx.fillRect(0, horizon - 22, 74, 6);
  for (const x of [6, 30, 54]) {
    ctx.fillRect(x, horizon - 16, 5, 16);
    ctx.fillStyle = '#25292c';
    ctx.fillRect(x + 5, horizon - 14, 19, 14);
    ctx.fillStyle = '#2c3033';
  }
  // Its broken end: a jagged lip, and the water falling from it.
  ctx.fillRect(74, horizon - 20, 3, 3);
  ctx.fillStyle = '#4a5258';
  for (let y = horizon - 16; y < horizon; y += 1) {
    const wobble = Math.round(Math.sin(time * 6 + y * 0.7));
    ctx.fillRect(73 + wobble, y, 2, 1);
  }
  ctx.fillStyle = 'rgba(160, 172, 178, 0.35)';
  ctx.fillRect(70, horizon - 1, 9, 1);

  // The flat fen running out to the horizon, grey-green, with darker pools.
  ctx.fillStyle = '#30362f';
  ctx.fillRect(0, horizon, W, floorY - horizon);
  ctx.fillStyle = '#2a302a';
  for (let row = 0; row < 6; row++) {
    const y = horizon + 3 + row * row * 1.4;
    for (let x = (row * 37) % 50; x < W; x += 50 + row * 6) ctx.fillRect(x, Math.round(y), 14 + row * 5, 1 + Math.floor(row / 2));
  }
  ctx.fillStyle = '#181c1e';
  for (let row = 1; row < 6; row++) {
    const y = horizon + 2 + row * row * 1.4;
    for (let x = (row * 61) % 70; x < W; x += 70 + row * 10) ctx.fillRect(x + 8, Math.round(y), 8 + row * 4, 1);
  }

  // Lights in the fog that aren't lanterns: they drift and bob, fade out,
  // and come back somewhere else.
  for (const wisp of MARSH_WISPS) {
    const phase = (time / wisp.every + wisp.sway) % 1;
    const fade = Math.min(1, phase * 5, (1 - phase) * 5);
    const x = wisp.x + Math.sin(time * 0.4 + wisp.sway) * 14;
    const y = horizon + 4 + wisp.y * 30 + Math.sin(time * 1.3 + wisp.sway) * 2;
    drawGlow(ctx, x, y, 5, '#c8e8a0', 0.5 * fade);
    ctx.globalAlpha = fade;
    ctx.fillStyle = '#e8f4c0';
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    ctx.globalAlpha = 1;
  }

  // The lanterns on their poles, going off across the bog: the far ones
  // small, the near ones tall. Each burns steady, with its light on the water.
  for (const lantern of MARSH_LANTERNS) {
    const k = lantern.k;
    const base = horizon + 4 + k * k * 40;
    const pole = 10 + k * 34;
    const top = base - pole;
    ctx.fillStyle = '#1e1a16';
    ctx.fillRect(lantern.x, Math.round(top), k > 0.4 ? 2 : 1, Math.round(pole));
    ctx.fillRect(lantern.x, Math.round(top), Math.round(3 + k * 4), 1);
    const lx = lantern.x + Math.round(2 + k * 4);
    const ly = top + 2 + k * 3;
    drawGlow(ctx, lx, ly, 3 + k * 6, '#ffd890', 0.7);
    ctx.fillStyle = '#2a2420';
    ctx.fillRect(Math.round(lx - 1 - k), Math.round(ly - 2 - k * 2), Math.round(2 + k * 2) + 1, 1);
    ctx.fillStyle = '#ffe8a8';
    ctx.fillRect(Math.round(lx - k), Math.round(ly - 1 - k), Math.max(1, Math.round(1 + k * 2)), Math.max(1, Math.round(1 + k * 3)));
    // Its light, wavering on the water below.
    ctx.fillStyle = 'rgba(255, 216, 144, 0.18)';
    for (let i = 0; i < 3 + k * 4; i++) {
      const shake = Math.round(Math.sin(time * 2 + i + lantern.x) * (1 + k));
      ctx.fillRect(Math.round(lx - 1 + shake), Math.round(base + 2 + i * 2), Math.round(2 + k * 3), 1);
    }
  }

  // Mist, rolling slowly across in long soft bands.
  for (const mist of MARSH_MIST) {
    const y = Math.round(horizon - 30 + mist.y * 80);
    const x = ((mist.at + time * mist.speed) % (W + mist.w)) - mist.w;
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = `rgba(170, 180, 182, ${(0.05 - i * 0.012).toFixed(3)})`;
      ctx.fillRect(Math.round(x - i * 12), y - i * 2, Math.round(mist.w + i * 24), 5 + i * 4);
    }
  }

  // Underfoot: black still water, with the sky's grey lying flat on it and a
  // ring spreading now and then where something moved underneath.
  ctx.fillStyle = '#121618';
  ctx.fillRect(0, floorY, W, FLOOR_HEIGHT);
  ctx.fillStyle = '#3a4042';
  ctx.fillRect(0, floorY, W, 1);
  ctx.fillStyle = '#1c2224';
  for (let y = floorY + 3; y < height; y += 4) ctx.fillRect(0, y, W, 1);
  for (const ripple of MARSH_RIPPLES) {
    const k = ((time + ripple.at) % ripple.every) / ripple.every;
    if (k > 0.5) continue;
    const r = 1 + Math.round(k * 16);
    ctx.fillStyle = `rgba(150, 162, 166, ${(0.4 * (1 - k * 2)).toFixed(3)})`;
    ctx.fillRect(Math.round(ripple.x - r), Math.round(floorY + 3 + ripple.y * (FLOOR_HEIGHT - 6)), r * 2 + 1, 1);
  }
  // The waist-deep mist, lying low over everything.
  ctx.fillStyle = `rgba(180, 190, 192, ${(0.08 + 0.02 * Math.sin(time * 0.5)).toFixed(3)})`;
  ctx.fillRect(0, floorY - 12, W, 16);
  ctx.fillStyle = 'rgba(180, 190, 192, 0.06)';
  ctx.fillRect(0, floorY - 20, W, 8);

  // Reeds close by on both sides, dark against the fog, swaying a little.
  for (const reed of MARSH_REEDS) {
    const lean = Math.sin(time * 0.9 + reed.sway) * 1.5;
    const top = height - reed.h;
    for (let y = Math.round(top); y < height; y++) {
      const along = (height - y) / reed.h;
      ctx.fillStyle = along > 0.7 ? '#2a3226' : '#1e241c';
      ctx.fillRect(Math.round(reed.x + lean * along), y, 1, 1);
    }
    if (reed.cattail) {
      ctx.fillStyle = '#3a2618';
      ctx.fillRect(Math.round(reed.x + lean - 1), Math.round(top + 2), 3, 6);
      ctx.fillStyle = '#2a3226';
      ctx.fillRect(Math.round(reed.x + lean), Math.round(top), 1, 2);
    }
  }
}

// --- The Dead City (the Hollow Valley, past Lasthome) ---
// The half-sunk old city at dusk. A rose-and-violet sky with the first
// stars out; far off down the middle, the great Hero's Gate, shut, with
// the last of the sun behind it; the city's broken towers and domes either
// side, standing in the flood, and the old aqueduct fallen across the left.
// Nearer, the drowned forum: a broken colonnade up to its knees in still
// water, every column with its reflection, and a toppled statue of the
// Hero lying on its side in the shallows. Up close, two dead street lamps,
// with tiny moths fussing round their dark glass, and dust drifting.
const VALLEY_SKY = ['#1c1430', '#271a3c', '#352046', '#48284e', '#5e3252', '#7a3e54', '#9a4e54', '#b86a5a'];
const VALLEY_STARS = Array.from({ length: 22 }, (_, i) => ({
  x: hash(i + 5000) * W, y: hash(i + 5010) * 40, twinkle: hash(i + 5020) * Math.PI * 2,
}));
// The city's ruins far off on either side of the gate: x, width, height, and
// what's on top (0 a flat broken top, 1 a dome, 2 a snapped spire).
const VALLEY_TOWERS = [
  { x: 4, w: 14, h: 26, top: 2 }, { x: 22, w: 20, h: 16, top: 1 }, { x: 48, w: 10, h: 34, top: 0 },
  { x: 92, w: 16, h: 22, top: 1 }, { x: 206, w: 12, h: 28, top: 2 }, { x: 222, w: 22, h: 18, top: 1 },
  { x: 252, w: 10, h: 30, top: 0 }, { x: 270, w: 18, h: 14, top: 1 }, { x: 296, w: 12, h: 24, top: 2 },
];
// The drowned colonnade: x, height, and whether it's snapped off.
const VALLEY_COLUMNS = [
  { x: 30, h: 46, broken: false }, { x: 62, h: 30, broken: true }, { x: 94, h: 46, broken: false },
  { x: 226, h: 38, broken: true }, { x: 258, h: 46, broken: false }, { x: 290, h: 24, broken: true },
];
const VALLEY_MITES = Array.from({ length: 8 }, (_, i) => ({
  lamp: i % 2, phase: hash(i + 5100) * Math.PI * 2, speed: 2 + hash(i + 5110) * 2, r: 4 + hash(i + 5120) * 5,
}));
const VALLEY_DUST = Array.from({ length: 26 }, (_, i) => ({
  x: hash(i + 5200) * W, y: hash(i + 5210), speed: 2 + hash(i + 5220) * 4, sway: hash(i + 5230) * Math.PI * 2,
}));
const VALLEY_RIPPLES = Array.from({ length: 9 }, (_, i) => ({
  x: hash(i + 5300) * W, y: hash(i + 5310), every: 3 + hash(i + 5320) * 4, at: hash(i + 5330) * 6,
}));

// A dead street lamp, up close: an iron post with a crossbar and a cage of
// dark glass on top. Its foot is at (x, baseY).
function drawDeadLamp(ctx, x, baseY, tall) {
  const top = baseY - tall;
  ctx.fillStyle = '#16121e';
  ctx.fillRect(x - 1, top, 3, tall);
  ctx.fillRect(x - 3, baseY - 4, 7, 4);
  ctx.fillRect(x - 5, top + 12, 11, 2);
  // The lamp's cage, and its glass, gone dark and dusty.
  ctx.fillRect(x - 5, top - 14, 11, 14);
  ctx.fillRect(x - 3, top - 17, 7, 3);
  ctx.fillRect(x - 1, top - 19, 3, 2);
  ctx.fillStyle = '#2a3038';
  ctx.fillRect(x - 4, top - 12, 9, 10);
  ctx.fillStyle = '#16121e';
  ctx.fillRect(x, top - 12, 1, 10);
  ctx.fillStyle = '#5a6a70';
  ctx.fillRect(x - 3, top - 11, 1, 3);
  ctx.fillRect(x + 2, top - 11, 1, 2);
  // Its edge, catching the last of the light.
  ctx.fillStyle = '#4a3a50';
  ctx.fillRect(x + 1, top, 1, tall - 4);
}

function drawValley(ctx, time, height) {
  const floorY = height - FLOOR_HEIGHT;
  const horizon = floorY - 40;
  const mid = W / 2;
  // The sky's bands run down to the horizon, so the warmest is lowest.
  const band = Math.ceil(horizon / VALLEY_SKY.length);
  VALLEY_SKY.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * band, W, band);
  });

  // The first stars, coming out.
  for (const star of VALLEY_STARS) {
    ctx.globalAlpha = 0.35 + 0.35 * Math.sin(time * 1.5 + star.twinkle);
    ctx.fillStyle = '#f4e8f0';
    ctx.fillRect(Math.round(star.x), Math.round(star.y), 1, 1);
  }
  ctx.globalAlpha = 1;

  // The low sun, going down behind the gate.
  drawGlow(ctx, mid, horizon - 6, 40, '#f0a070', 0.5);
  drawGlow(ctx, mid, horizon - 4, 18, '#ffd8a0', 0.6);

  // The city's ruins far off, in the haze, each with a dark window or two.
  for (const tower of VALLEY_TOWERS) {
    const top = horizon - tower.h;
    ctx.fillStyle = '#4a3050';
    ctx.fillRect(tower.x, top, tower.w, tower.h + 1);
    if (tower.top === 1) {
      ctx.fillRect(tower.x + 2, top - 3, tower.w - 4, 3);
      ctx.fillRect(tower.x + 4, top - 5, tower.w - 8, 2);
    } else if (tower.top === 2) {
      ctx.fillRect(tower.x + Math.floor(tower.w / 2) - 1, top - 9, 3, 9);
      ctx.fillRect(tower.x + Math.floor(tower.w / 2) + 2, top - 6, 2, 2);
    } else {
      ctx.fillRect(tower.x, top - 3, 3, 3);
      ctx.fillRect(tower.x + tower.w - 5, top - 2, 5, 2);
    }
    ctx.fillStyle = '#32223e';
    for (let y = top + 4; y < horizon - 4; y += 8) ctx.fillRect(tower.x + 3, y, 2, 3);
  }

  // The old aqueduct, coming across the left on its arches, and broken off
  // partway, with its fallen piece lying in the water.
  ctx.fillStyle = '#3e2a48';
  ctx.fillRect(0, horizon - 30, 108, 5);
  for (let x = 2; x < 108; x += 18) {
    ctx.fillRect(x, horizon - 25, 4, 25);
    ctx.fillRect(x + 4, horizon - 25, 14, 3);
  }
  ctx.fillRect(108, horizon - 30, 3, 3);
  ctx.fillRect(116, horizon - 4, 22, 4);
  ctx.fillRect(120, horizon - 7, 8, 3);

  // The Hero's Gate, far off but enormous: two great towers either side of
  // the battle box, and the arch over the top of it, so you fight in its
  // gateway. The sunset shows round the edges of its shut doors.
  ctx.fillStyle = '#2a1e36';
  for (const side of [-1, 1]) {
    const x = side < 0 ? mid - 62 : mid + 44;
    ctx.fillRect(x, horizon - 86, 18, 86);
    ctx.fillRect(x - 2, horizon - 90, 22, 4);
    for (let i = 0; i < 3; i++) ctx.fillRect(x - 2 + i * 8, horizon - 94, 5, 4);
    // Slit windows, and a line of light down the tower's sunward edge.
    ctx.fillStyle = '#1c1428';
    for (let y = horizon - 80; y < horizon - 10; y += 16) ctx.fillRect(x + 8, y, 2, 6);
    ctx.fillStyle = '#5a3a50';
    ctx.fillRect(side < 0 ? x + 17 : x, horizon - 86, 1, 86);
    ctx.fillStyle = '#2a1e36';
  }
  // The arch: a great lintel, stepping down into a curve at each end.
  ctx.fillRect(mid - 46, horizon - 84, 92, 10);
  ctx.fillRect(mid - 46, horizon - 74, 10, 4);
  ctx.fillRect(mid + 36, horizon - 74, 10, 4);
  ctx.fillRect(mid - 46, horizon - 70, 5, 4);
  ctx.fillRect(mid + 41, horizon - 70, 5, 4);
  ctx.fillStyle = '#5a3a50';
  ctx.fillRect(mid - 46, horizon - 74, 92, 1);
  // The shut doors, and the thread of sunset at the crack between them.
  ctx.fillStyle = '#1c1428';
  ctx.fillRect(mid - 44, horizon - 66, 88, 66);
  ctx.fillStyle = `rgba(255, 200, 140, ${(0.5 + 0.15 * Math.sin(time * 0.7)).toFixed(3)})`;
  ctx.fillRect(mid - 44, horizon - 67, 88, 1);
  ctx.fillRect(mid, horizon - 66, 1, 66);
  // A star over the arch, carved for the Hero, catching the light.
  ctx.fillStyle = '#c88a78';
  ctx.fillRect(mid - 2, horizon - 80, 5, 1);
  ctx.fillRect(mid, horizon - 82, 1, 5);
  ctx.fillRect(mid - 1, horizon - 81, 3, 3);

  // The flood, from the horizon in: still water with the sky in it, and the
  // sun's light lying on it in a long, broken streak.
  ctx.fillStyle = '#3a2440';
  ctx.fillRect(0, horizon, W, floorY - horizon);
  ctx.fillStyle = '#48304e';
  for (let row = 0; row < 7; row++) {
    const y = horizon + 2 + row * 5;
    for (let x = (row * 41) % 60; x < W; x += 60 + row * 7) ctx.fillRect(x, y, 12 + row * 3, 1);
  }
  for (let i = 0; i < 9; i++) {
    const y = horizon + 1 + i * 4;
    const w = 6 + i * 2 + Math.round(Math.sin(time * 2 + i) * 2);
    ctx.fillStyle = `rgba(255, 200, 150, ${(0.32 - i * 0.03).toFixed(3)})`;
    ctx.fillRect(Math.round(mid - w / 2 + Math.sin(time * 1.3 + i * 1.7) * 2), y, w, 1);
  }

  // The drowned colonnade, standing in it, each column with its reflection.
  const waterY = floorY - 6;
  for (const column of VALLEY_COLUMNS) {
    const top = waterY - column.h;
    ctx.fillStyle = '#4e4260';
    ctx.fillRect(column.x, top, 9, column.h);
    if (column.broken) {
      ctx.fillRect(column.x, top - 3, 4, 3);
      ctx.fillRect(column.x + 6, top - 1, 3, 1);
    } else {
      ctx.fillRect(column.x - 2, top - 4, 13, 4);
    }
    ctx.fillStyle = '#6a6278';
    ctx.fillRect(column.x + 1, top, 1, column.h);
    // Its reflection, upside down and shaking a little.
    ctx.fillStyle = 'rgba(78, 66, 96, 0.5)';
    for (let y = 0; y < 6; y++) ctx.fillRect(column.x + Math.round(Math.sin(time * 3 + y + column.x)), waterY + y, 9, 1);
  }
  // A lintel still across two of them on the right.
  ctx.fillStyle = '#4e4260';
  ctx.fillRect(254, waterY - 50, 46, 4);

  // The fallen statue of the Hero, on its side in the shallows: the great
  // stone head (worn smooth, no face left to speak of), a shoulder, and an
  // arm still holding up half a sword.
  ctx.fillStyle = '#5a4e6a';
  ctx.fillRect(150, waterY - 12, 20, 12);
  ctx.fillRect(152, waterY - 15, 16, 3);
  ctx.fillRect(170, waterY - 9, 22, 9);
  ctx.fillRect(186, waterY - 22, 5, 14);
  ctx.fillRect(184, waterY - 25, 9, 3);
  ctx.fillStyle = '#8a8098';
  ctx.fillRect(187, waterY - 38, 3, 13);
  ctx.fillRect(152, waterY - 15, 16, 1);
  ctx.fillRect(170, waterY - 9, 22, 1);
  ctx.fillStyle = 'rgba(90, 78, 106, 0.45)';
  ctx.fillRect(150, waterY, 42, 3);

  // Underfoot: the forum's flagstones, a hand deep under the flood.
  ctx.fillStyle = '#241c30';
  ctx.fillRect(0, floorY, W, FLOOR_HEIGHT);
  ctx.fillStyle = '#5a4a62';
  ctx.fillRect(0, floorY, W, 1);
  ctx.fillStyle = '#2e2438';
  for (let x = 0; x < W; x += 26) ctx.fillRect(x, floorY + 1, 1, FLOOR_HEIGHT - 1);
  ctx.fillRect(0, floorY + 9, W, 1);
  ctx.fillStyle = 'rgba(184, 106, 90, 0.08)';
  for (let y = floorY + 3; y < height; y += 4) ctx.fillRect(0, y, W, 1);
  for (const ripple of VALLEY_RIPPLES) {
    const k = ((time + ripple.at) % ripple.every) / ripple.every;
    if (k > 0.5) continue;
    const r = 1 + Math.round(k * 14);
    ctx.fillStyle = `rgba(200, 170, 190, ${(0.35 * (1 - k * 2)).toFixed(3)})`;
    ctx.fillRect(Math.round(ripple.x - r), Math.round(floorY + 3 + ripple.y * (FLOOR_HEIGHT - 6)), r * 2 + 1, 1);
  }

  // The two dead street lamps up close, one each side, and the tiny moths
  // that live in them, fussing round the glass.
  const lamps = [{ x: 12, tall: 92 }, { x: W - 12, tall: 84 }];
  for (const lamp of lamps) drawDeadLamp(ctx, lamp.x, height, lamp.tall);
  ctx.fillStyle = '#e8dcc0';
  for (const mite of VALLEY_MITES) {
    const lamp = lamps[mite.lamp];
    const a = time * mite.speed + mite.phase;
    const x = lamp.x + Math.cos(a) * mite.r;
    const y = height - lamp.tall - 7 + Math.sin(a * 1.3) * mite.r * 0.7;
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  }

  // Dust, drifting in the last light.
  for (const mote of VALLEY_DUST) {
    const y = (((mote.y * height - time * mote.speed) % height) + height) % height;
    const x = (mote.x + Math.sin(time * 0.7 + mote.sway) * 5 + W) % W;
    ctx.globalAlpha = 0.25 + 0.25 * Math.sin(time * 1.8 + mote.sway);
    ctx.fillStyle = '#f0d8b8';
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  }
  ctx.globalAlpha = 1;
}

export const BACKDROPS = {
  pinefall: drawPinefall,
  // The Lantern Marsh (rooms with `area: 'marsh'`).
  marsh: drawMarsh,
  // The Dead City (rooms with `area: 'valley'`).
  valley: drawValley,
  // Under Hollin's well (rooms with `area: 'drains'`).
  drains: drawDrains,
  ruins: drawRuins,
  stair: drawStairSky,
  vigil: drawVigilHeights,
  // Any room with `cave: true` fights here (see battleArea in overworldScene.js).
  cave: drawCrystalCave,
  rest: drawRestSquare,
  taper_stand: drawTaperStand,
  // The Usurper's (src/data/enemies/usurper.js).
  summit: drawSummit,
};
