import { SCREEN_WIDTH as W } from '../config.js';

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

export const BACKDROPS = {
  ruins: drawRuins,
};
