import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { HERO_ANIMATIONS } from '../characters/hero.js';
import { VES_OPEN_UMBRELLA_SPRITES, VES_PALETTE } from '../data/art/vesper.js';

// The fall into the Glimmering (the_ground_gives.js, then soft_landing.js): a
// whole-screen picture, in the same way as the fall down the well in
// visions.js. Moods, one after the other:
//   'drop'  the shaft from inside, packed earth rushing up past faster and
//           faster: the round of sunny sky overhead getting smaller, roots
//           and stones and buttercup petals going by, the hero and Ves
//           tumbling, her umbrella opening to slow them, flipping inside out
//           and fluttering uselessly; and deeper down, crystals in the walls
//   'rush'  the shaft opening out and a violet light coming up from below,
//           a huge glowing cap rising to meet them
// The room takes over from the last frame of 'rush' with the SPLOMF.

function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
const px = (ctx, color, x, y, w = 1, h = 1) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), w, h); };

let art = null;
function shaftArt() {
  art ??= {
    hero: HERO_ANIMATIONS.down[0],
    ves: makeSprite(VES_OPEN_UMBRELLA_SPRITES.furled, VES_PALETTE),
  };
  return art;
}

const WALL = 60; // how wide each side of the shaft is, in pixels
const ROW = 10;
const CRYSTALS = ['#4fe0d0', '#ff6ac8', '#a888ff', '#ffd24a'];

// The shaft's walls, `scroll` pixels down, `depth` (0 at the top, 1 at the
// bottom of the fall) deciding how much light still comes from above and how
// much the crystals in the walls give.
function walls(ctx, scroll, depth, openness) {
  ctx.fillStyle = '#0a0612';
  ctx.fillRect(0, 0, W, H);
  const first = Math.floor(scroll / ROW);
  for (let r = first; r <= first + Math.ceil(H / ROW) + 1; r++) {
    const y = Math.round(r * ROW - scroll);
    for (const side of [0, 1]) {
      const x0 = side ? W - WALL - openness : -openness;
      const wallW = WALL + openness;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, 0, wallW, H);
      ctx.clip();
      for (let c = -1; c < wallW / 14 + 1; c++) {
        const x = x0 + c * 14 + (r % 2) * 7;
        const n = hash(r * 31 + c * 7 + side * 1000);
        const near = side ? (x - x0) / wallW : 1 - (x - x0) / wallW;
        // Earth up top (warm brown), going to violet rock lower down.
        const earth = Math.max(0, 1 - depth * 1.6);
        const base = n < 0.14 ? [96, 90, 80] : n < 0.26 ? [60, 40, 28] : [118, 84, 52];
        const rock = n < 0.14 ? [88, 70, 140] : [58, 44, 104];
        const k = (0.16 + (1 - depth * 0.5) * (0.35 + 0.65 * (1 - near)) * 0.84) * (1 - depth * 0.15);
        const col = base.map((v, i) => Math.round((v * earth + rock[i] * (1 - earth)) * k));
        ctx.fillStyle = `rgb(${col.join(',')})`;
        ctx.fillRect(x, y, 13, ROW - 1);
        // Grass roots in the top bit of earth, crystal seeds deeper.
        if (depth < 0.45 && n > 0.86) px(ctx, '#3a6a30', x + 3, y + 2, 1, 6);
        if (depth > 0.4 && n > 0.9) px(ctx, CRYSTALS[Math.floor(n * 40) % 4], x + 5, y + 3, 2, 3);
      }
      ctx.restore();
    }
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(WALL - openness, 0, 2, H);
  ctx.fillRect(W - WALL + openness - 2, 0, 2, H);
}

// A root hanging out of one wall, curling, passing by.
function root(ctx, x, y, side, len, wobble) {
  ctx.strokeStyle = '#d6b58a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 1; i <= 6; i++) ctx.lineTo(x + side * i * len / 6 + Math.sin(i + wobble) * 2, y + i * 3 + Math.sin(i * 1.7 + wobble) * 2);
  ctx.stroke();
  ctx.strokeStyle = '#8a6a44';
  ctx.lineWidth = 1;
  ctx.stroke();
}

// A crystal growing out of a wall: a leaning spike, lit.
function crystal(ctx, x, y, side, size, hue, t) {
  const c = CRYSTALS[hue];
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.moveTo(x, y - size * 0.3);
  ctx.lineTo(x + side * size, y);
  ctx.lineTo(x, y + size * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(Math.round(x + side * size * 0.4), Math.round(y - 1), 2, 1);
  const g = ctx.createRadialGradient(x, y, 1, x, y, 22);
  g.addColorStop(0, c.replace('#', '#') + '66');
  g.addColorStop(1, c + '00');
  ctx.fillStyle = g;
  ctx.fillRect(x - 22, y - 22, 44, 44);
  if (Math.sin(t * 9 + x) > 0.9) px(ctx, '#fff', x + side * size * 0.6, y - 2, 1, 1);
}

// Her umbrella: held over her at the end of her arm. `state` runs 0 (shut),
// 1 (open, a dome), 2 (flipped inside out, a bowl), with a flutter.
function umbrella(ctx, x, y, state, t) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  // The shaft and handle.
  ctx.strokeStyle = '#7a4f2a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -34);
  ctx.stroke();
  const ribs = 7;
  if (state < 0.05) {
    ctx.fillStyle = '#7a3a5e';
    ctx.fillRect(-3, -50, 6, 22);
  } else {
    // The canopy: a dome when open, popped up into a bowl when flipped.
    const flip = Math.min(1, Math.max(0, state - 1));
    const open = Math.min(1, state);
    const w = 26 * open;
    const lift = (1 - flip * 2) * 14 * open; // + dome, - bowl
    const top = -34;
    const flutter = flip > 0.5 ? Math.sin(t * 22) * 2 : 0;
    ctx.fillStyle = '#7a3a5e';
    ctx.beginPath();
    ctx.moveTo(-w, top + 8 * flip);
    ctx.quadraticCurveTo(0, top - lift * 2 + flutter, w, top + 8 * flip);
    // The scalloped edge.
    for (let i = ribs; i >= 0; i--) ctx.lineTo(-w + (2 * w * (i / ribs)), top + 8 * flip + (i % 2 ? 3 : 0));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#5a2846';
    ctx.lineWidth = 1;
    for (let i = 0; i <= ribs; i++) {
      const rx = -w + (2 * w * (i / ribs));
      ctx.beginPath();
      ctx.moveTo(0, top);
      ctx.lineTo(rx, top + 8 * flip + (i % 2 ? 3 : 0));
      ctx.stroke();
    }
    // A snapped rib, flapping, once it's inside out.
    if (flip > 0.8) {
      ctx.strokeStyle = '#5a2846';
      ctx.beginPath();
      ctx.moveTo(w * 0.5, top + 4);
      ctx.lineTo(w * 0.5 + 8, top - 6 + Math.sin(t * 17) * 3);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// The two of them, tumbling: the hero on the left, Ves with her umbrella on the right.
function pair(ctx, t, fallT, umbrellaState) {
  const a = shaftArt();
  const sway = Math.sin(t * 2.4) * 8;
  // The hero: arms flailing, a slow spin, then faster.
  ctx.save();
  ctx.translate(Math.round(W / 2 - 34 + sway), Math.round(100 + Math.sin(t * 5) * 3));
  ctx.rotate(Math.sin(t * 2.1) * 0.7 + fallT * 0.2);
  ctx.scale(2, 2);
  ctx.drawImage(a.hero, -a.hero.width / 2, -a.hero.height / 2);
  ctx.restore();
  // Ves: held up by her umbrella (while it holds), feet dangling.
  const vx = W / 2 + 30 - sway * 0.6;
  const vy = 106 + Math.sin(t * 4 + 1) * 3;
  ctx.save();
  ctx.translate(Math.round(vx), Math.round(vy));
  ctx.rotate(Math.sin(t * 1.8 + 2) * (umbrellaState > 1.2 ? 0.55 : 0.18));
  ctx.scale(2, 2);
  ctx.drawImage(a.ves, -a.ves.width / 2, -a.ves.height / 2);
  ctx.restore();
  umbrella(ctx, vx + 11, vy - 10, umbrellaState, t);
}

function dropFrame(ctx, t, mood, moodTime) {
  if (mood === 'rush') {
    const depth = 1;
    const scroll = 900 + moodTime * 700;
    // The shaft opens out as the cave comes up.
    walls(ctx, scroll, depth, Math.min(70, moodTime * 60));
    const glow = ctx.createRadialGradient(W / 2, H + 30, 10, W / 2, H + 30, 60 + moodTime * 200);
    glow.addColorStop(0, `rgba(190, 150, 255, ${(0.55 + moodTime * 0.3).toFixed(3)})`);
    glow.addColorStop(0.5, 'rgba(110, 230, 220, 0.25)');
    glow.addColorStop(1, 'rgba(60, 30, 120, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
    // The cap, rising: a huge glowing dome with pale spots.
    const rise = Math.min(1, moodTime / 1.5);
    const r = 40 + rise * rise * 190;
    const cy = H + 60 - rise * rise * (H * 0.9);
    const g = ctx.createRadialGradient(W / 2 - r * 0.25, cy - r * 0.4, 4, W / 2, cy, r);
    g.addColorStop(0, '#e6d8ff');
    g.addColorStop(0.45, '#9a78e8');
    g.addColorStop(1, '#4a2e98');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(W / 2, cy, r, r * 0.55, 0, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    for (let i = 0; i < 9; i++) {
      ctx.fillStyle = i % 2 ? 'rgba(160, 255, 240, 0.8)' : 'rgba(255, 255, 255, 0.7)';
      const a = Math.PI + 0.25 + (i / 8) * (Math.PI - 0.5);
      const sx = W / 2 + Math.cos(a) * r * 0.62;
      const sy = cy + Math.sin(a) * r * 0.36;
      ctx.beginPath();
      ctx.arc(sx, sy, 3 + rise * 7 * (0.6 + hash(i) * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }
    if (rise < 0.85) pair(ctx, t, 3, 2.5);
    return;
  }
  // 'drop'
  const scroll = moodTime * 100 + moodTime * moodTime * 120;
  const depth = Math.min(1, moodTime / 4.6);
  walls(ctx, scroll, depth, 0);
  // The round of sunny sky overhead, going away.
  const skyR = Math.max(0, 70 - moodTime * 22);
  if (skyR > 1) {
    const sky = ctx.createRadialGradient(W / 2, -10 - moodTime * 24, 1, W / 2, -10 - moodTime * 24, skyR + 10);
    sky.addColorStop(0, `rgba(255, 246, 200, ${Math.min(1, skyR / 50).toFixed(3)})`);
    sky.addColorStop(0.6, `rgba(150, 210, 255, ${Math.min(0.7, skyR / 70).toFixed(3)})`);
    sky.addColorStop(1, 'rgba(120, 190, 255, 0)');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);
  }
  // The centre of the shaft is dark and lit from above, a column of light.
  // Roots and stones and crystals going by, on both walls.
  for (let i = 0; i < 16; i++) {
    const side = i % 2 ? 1 : -1;
    const period = H + 60;
    const speed = 120 + moodTime * 150;
    const y = H + 20 - ((moodTime * speed * (0.9 + hash(i + 40) * 0.3) + hash(i + 50) * period) % period);
    const x = side < 0 ? WALL - 2 : W - WALL + 2;
    // Roots in the earth; crystals once the earth turns to rock.
    const here = depth + (1 - y / H) * -0.1;
    if (here < 0.45 || hash(i + 60) < 0.3) root(ctx, x, y, -side, 14 + hash(i + 70) * 14, t * 3 + i);
    if (here > 0.35 && hash(i + 60) >= 0.3) crystal(ctx, x, y, -side, 9 + hash(i + 80) * 12, i % 4, t);
  }
  // Things falling with them: clods of turf, buttercup petals, a daisy.
  for (let i = 0; i < 24; i++) {
    const fx = WALL + 8 + hash(i + 400) * (W - WALL * 2 - 16) + Math.sin(t * 3 + i) * 4;
    const rate = 40 + hash(i + 410) * 90;
    const fy = -20 + ((hash(i + 420) * 300 + moodTime * rate) % (H + 40));
    if (moodTime > 3.5 && i > 8) continue;
    if (i % 4 === 0) {
      px(ctx, '#5a8a34', fx, fy, 5, 2);
      px(ctx, '#6a4524', fx, fy + 2, 5, 3);
    } else if (i % 4 === 1) {
      px(ctx, '#ffd62e', fx, fy, 3, 3);
      px(ctx, '#f6a010', fx + 1, fy + 1, 1, 1);
    } else if (i % 4 === 2) {
      px(ctx, '#ffffff', fx, fy, 3, 1);
      px(ctx, '#ffffff', fx + 1, fy - 1, 1, 3);
      px(ctx, '#ffd62e', fx + 1, fy, 1, 1);
    } else {
      px(ctx, '#7a5a3a', fx, fy, 2, 2);
    }
  }
  // Her umbrella: shut, then thrown open, then flipped, then hanging limp.
  const state = moodTime < 0.7 ? 0 : moodTime < 1.2 ? (moodTime - 0.7) * 2 : moodTime < 2.6 ? 1 : moodTime < 3.1 ? 1 + (moodTime - 2.6) * 2 : 2;
  pair(ctx, t, moodTime, state);
  // The deeper, the darker, until the glow below takes over.
  ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.55, depth * 0.55).toFixed(3)})`;
  ctx.fillRect(0, 0, W, H);
  // The faintest violet light from below, arriving.
  if (moodTime > 3.2) {
    const k = Math.min(1, (moodTime - 3.2) / 1.5);
    const g = ctx.createLinearGradient(0, H, 0, H * 0.4);
    g.addColorStop(0, `rgba(150, 110, 255, ${(0.45 * k).toFixed(3)})`);
    g.addColorStop(1, 'rgba(150, 110, 255, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
}

export const drawShaft = dropFrame;
