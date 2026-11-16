import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';
import { WORLD_STATE } from '../state/saveGame.js';

// The view over the edge in the Glimmering: the whole buried kingdom, far
// below. A room asks for it with `vista: { kind: 'kingdom' }` and open sky
// (`_` tiles) where the cave falls away. From the top down: the roof of the
// great cavern with its hanging crystals, the Sunstone (a huge crystal that
// lights the whole place like a sun, dim and a little cold just now), faint
// spires standing in the haze, and, very far down, the lights of Belowtown
// beside a glowing lake. Everything slides at its own speed as the camera
// moves, so panning down the room (a cutscene does it) opens the view up.
//
// `view` is what vista.js is given: `driftX` (the camera's x) and `rise` (how
// far the camera is above the bottom of the room); `night` and `dusk` don't
// matter here, it's always the same light underground.

function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
const px = (ctx, color, x, y, w = 1, h = 1) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), w, h); };

// How wide the repeating layers are (they wrap, so a long room never runs out).
const SPAN = 760;

// Roof crystals and stalactites, along the top.
const ROOF = Array.from({ length: 38 }, (_, i) => ({
  x: hash(i + 10) * SPAN,
  len: 14 + hash(i + 20) * 40,
  w: 4 + hash(i + 30) * 7,
  hue: Math.floor(hash(i + 40) * 4),
  glint: hash(i + 50) < 0.4,
}));
const HUES = [
  ['#2a1a58', '#6a40d0', '#a888ff'],
  ['#12384a', '#1f9ea8', '#4fe0d0'],
  ['#4a1448', '#b8309a', '#ff6ac8'],
  ['#4a2c08', '#d08a1c', '#ffd24a'],
];

// Spires standing out of the haze below.
const SPIRES = Array.from({ length: 26 }, (_, i) => ({
  x: hash(i + 100) * SPAN,
  h: 30 + hash(i + 110) * 70,
  w: 8 + hash(i + 120) * 16,
  hue: Math.floor(hash(i + 130) * 4),
  lean: (hash(i + 140) - 0.5) * 6,
}));

// The town: houses in rows, each a roof and a lit window or two.
const HOUSES = Array.from({ length: 60 }, (_, i) => ({
  dx: (hash(i + 200) - 0.5) * 150,
  row: Math.floor(hash(i + 210) * 4),
  w: 3 + Math.floor(hash(i + 220) * 4),
  h: 2 + Math.floor(hash(i + 230) * 3),
  lit: hash(i + 240) < 0.75,
  warm: hash(i + 250) < 0.7,
}));

const MOTES = Array.from({ length: 46 }, (_, i) => ({
  x: hash(i + 300) * W,
  y: hash(i + 310) * H,
  speed: 2 + hash(i + 320) * 5,
  size: hash(i + 330) < 0.2 ? 2 : 1,
  phase: hash(i + 340) * 6,
  hue: Math.floor(hash(i + 350) * 4),
}));

export function drawKingdomVista(ctx, view, time) {
  // Once the light goes up the Sunstone blazes warm gold and the sky warms.
  const relit = (WORLD_STATE.seenScenes ?? []).includes('the_light_goes_up');
  const rise = view.rise ?? 0;
  const drift = view.driftX ?? 0;
  const sink = (k) => rise * k;

  // The air of the great cavern: indigo at the roof, plum at the haze.
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, relit ? '#1a0e28' : '#06031a');
  sky.addColorStop(0.45, relit ? '#4a2a4a' : '#150c3a');
  sky.addColorStop(0.8, relit ? '#8a5a58' : '#2a1858');
  sky.addColorStop(1, relit ? '#b48860' : '#3c2670');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // The Sunstone: very large, very far, hanging in the middle of everything,
  // its light thin and cold, flickering a little.
  const flick = relit ? 1 : 0.82 + Math.sin(time * 1.3) * 0.06 + (hash(Math.floor(time * 5)) < 0.1 ? -0.12 : 0);
  const sx = W * 0.64 - drift * 0.04;
  const sy = 108 + sink(0.06);
  const halo = ctx.createRadialGradient(sx, sy, 6, sx, sy, relit ? 300 : 170);
  halo.addColorStop(0, `rgba(255, 238, 180, ${((relit ? 0.95 : 0.5) * flick).toFixed(3)})`);
  halo.addColorStop(0.35, `rgba(214, 170, 230, ${(0.2 * flick).toFixed(3)})`);
  halo.addColorStop(1, 'rgba(120, 90, 200, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);
  // Its body: a faceted crystal, hanging point-down from the roof's dark.
  const body = [[0, -50], [20, -26], [24, 10], [0, 52], [-24, 10], [-20, -26]];
  const facet = (pts, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(sx + x, sy + y) : ctx.moveTo(sx + x, sy + y)));
    ctx.closePath();
    ctx.fill();
  };
  facet(body, relit ? 'rgba(255, 214, 120, 1)' : `rgba(120, 96, 150, ${flick.toFixed(3)})`);
  facet([[0, -50], [20, -26], [4, -4], [-6, -22]], `rgba(255, 240, 200, ${(0.78 * flick).toFixed(3)})`);
  facet([[-6, -22], [4, -4], [0, 52], [-24, 10], [-20, -26]], `rgba(212, 176, 150, ${(0.62 * flick).toFixed(3)})`);
  facet([[4, -4], [20, -26], [24, 10], [0, 52]], `rgba(160, 124, 140, ${(0.55 * flick).toFixed(3)})`);
  facet([[-2, -30], [6, -24], [2, -10], [-4, -18]], `rgba(255, 255, 255, ${(0.7 * flick).toFixed(3)})`);

  // The roof: dark rock with crystals hanging from it.
  const roofShift = -drift * 0.1;
  px(ctx, '#05020f', 0, 0, W, 10);
  for (const c of ROOF) {
    const x = ((c.x + roofShift) % SPAN + SPAN) % SPAN - 40;
    if (x < -20 || x > W + 20) continue;
    const len = Math.round(c.len + sink(0.08) * 0.2);
    const hue = HUES[c.hue];
    for (let r = 0; r < len; r++) {
      const cw = Math.max(1, Math.round(c.w * (1 - r / len)));
      px(ctx, '#05020f', x - Math.floor(cw / 2) - 1, 8 + r, cw + 2, 1);
      px(ctx, r < len * 0.7 ? hue[1] : hue[0], x - Math.floor(cw / 2), 8 + r, cw, 1);
      if (cw > 2) px(ctx, hue[2], x - Math.floor(cw / 2), 8 + r, 1, 1);
    }
    if (c.glint && Math.sin(time * 2 + c.x) > 0.6) px(ctx, '#ffffff', x, 8 + len - 2, 1, 1);
  }

  // Spires far down, faint with haze, in two ranks.
  for (let rank = 0; rank < 2; rank++) {
    const k = rank ? 0.28 : 0.16;
    const baseY = H - 40 + sink(rank ? 0.2 : 0.12) + (rank ? 6 : -4);
    const alpha = rank ? 0.55 : 0.32;
    for (const s of SPIRES) {
      if (Math.floor(s.x) % 2 !== rank) continue;
      const x = ((s.x - drift * k) % SPAN + SPAN) % SPAN - 40;
      if (x < -30 || x > W + 30) continue;
      const hue = HUES[s.hue];
      const top = baseY - s.h * (rank ? 1 : 0.7);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = hue[0];
      ctx.beginPath();
      ctx.moveTo(x - s.w / 2, baseY + 40);
      ctx.lineTo(x - s.w / 2 + 1, baseY - s.h * 0.4);
      ctx.lineTo(x + s.lean, top);
      ctx.lineTo(x + s.w / 2 - 1, baseY - s.h * 0.4);
      ctx.lineTo(x + s.w / 2, baseY + 40);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = hue[1];
      ctx.beginPath();
      ctx.moveTo(x, baseY + 40);
      ctx.lineTo(x + 1, baseY - s.h * 0.4);
      ctx.lineTo(x + s.lean, top);
      ctx.lineTo(x + s.w / 2 - 1, baseY - s.h * 0.4);
      ctx.lineTo(x + s.w / 2, baseY + 40);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // The lake, a long glow in the haze, and the town beside it.
  const townX = W * 0.36 - drift * 0.12;
  const townY = H - 30 + sink(0.16);
  // The lake: a wide soft ellipse of teal glow, with a few glints along it.
  ctx.save();
  ctx.translate(townX + 50, townY + 6);
  ctx.scale(1, 0.28);
  const lake = ctx.createRadialGradient(0, 0, 4, 0, 0, 140);
  lake.addColorStop(0, 'rgba(110, 240, 225, 0.6)');
  lake.addColorStop(0.6, 'rgba(70, 180, 210, 0.22)');
  lake.addColorStop(1, 'rgba(60, 160, 200, 0)');
  ctx.fillStyle = lake;
  ctx.fillRect(-150, -150, 300, 300);
  ctx.restore();
  for (let i = 0; i < 9; i++) px(ctx, `rgba(170, 250, 240, ${(0.25 + 0.3 * Math.abs(Math.sin(time * 1.1 + i))).toFixed(2)})`, townX + 4 + i * 13 + (i % 2) * 5, townY + 3 + (i % 3) * 3, 5 + (i % 3) * 3, 1);
  // The ground the town stands on, dark, fading into the haze above it.
  const ground = ctx.createLinearGradient(0, townY + 2, 0, H);
  ground.addColorStop(0, 'rgba(14, 10, 34, 0)');
  ground.addColorStop(0.4, 'rgba(14, 10, 34, 0.9)');
  ground.addColorStop(1, 'rgba(14, 10, 34, 1)');
  ctx.fillStyle = ground;
  ctx.fillRect(0, townY + 2, W, H - townY);
  for (const [i, house] of HOUSES.entries()) {
    const hx = townX + house.dx * 1.1 - 10;
    const hy = townY + 6 - house.row * 4 - (i % 3);
    px(ctx, '#1a1238', hx, hy - house.h, house.w, house.h);
    px(ctx, '#241848', hx - 1, hy - house.h - 1, house.w + 2, 1);
    if (house.lit) {
      const twinkle = 0.7 + 0.3 * Math.sin(time * 2.2 + i * 1.7);
      const lamp = house.warm ? `rgba(255, 214, 120, ${twinkle.toFixed(2)})` : `rgba(190, 255, 210, ${twinkle.toFixed(2)})`;
      px(ctx, lamp, hx + 1, hy - house.h + 1, 2, 2);
      if (house.w > 4) px(ctx, lamp, hx + house.w - 2, hy - house.h + 1, 1, 2);
    }
  }
  // Street lamps in a string, and the glow-worm lamps along the lake.
  for (let i = 0; i < 14; i++) px(ctx, 'rgba(255, 224, 150, 0.95)', townX - 20 + i * 11, townY + 9 + Math.sin(i) * 1, 2, 2);
  const glow = ctx.createRadialGradient(townX + 30, townY, 2, townX + 30, townY, 70);
  glow.addColorStop(0, 'rgba(255, 190, 100, 0.5)');
  glow.addColorStop(1, 'rgba(255, 190, 100, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(townX - 60, townY - 70, 180, 140);

  // Haze between us and all of it.
  const haze = ctx.createLinearGradient(0, H * 0.5, 0, H);
  haze.addColorStop(0, 'rgba(100, 70, 170, 0)');
  haze.addColorStop(1, 'rgba(100, 70, 170, 0.35)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, H * 0.5, W, H * 0.5);

  // Motes of light drifting up out of the dark, in every colour.
  for (const mote of MOTES) {
    const x = ((mote.x - drift * 0.5 + Math.sin(time * 0.6 + mote.phase) * 6) % W + W) % W;
    const y = ((mote.y - time * mote.speed - rise * 0.3) % H + H) % H;
    const tw = 0.4 + 0.6 * Math.abs(Math.sin(time * 1.4 + mote.phase));
    ctx.globalAlpha = tw;
    px(ctx, HUES[mote.hue][2], x, y, mote.size, mote.size);
    ctx.globalAlpha = 1;
  }
}
