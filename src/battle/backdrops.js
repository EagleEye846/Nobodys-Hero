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

export const BACKDROPS = {
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
