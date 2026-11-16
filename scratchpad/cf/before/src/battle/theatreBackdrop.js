import { SCREEN_WIDTH as W } from '../config.js';
import { borderAt, BORDER_COLORS } from '../data/art/peptupPuppet.js';

// The stage King Peptup's duel is fought on (`backdrop: 'theatre'` in
// src/data/enemies/rumbold.js; registered in backdrops.js): a great dark
// stage at the bottom of the world, long after the last show. No painted
// scenery: just the black of the stage house going up out of sight, the old
// pipes and fly ropes hanging in it, and puppets from other shows left
// hanging limp in the gloom. Heavy rotted drapes at the sides, a ragged
// border across the top hiding the rafters (where Tuck works the king), worn
// dusty boards, footlights dead but for one that stutters, and a single cold
// spotlight from the flies onto the king where he hangs.
//
// The drapes are exactly as wide as the curtains of his entrance leave them
// (see drawCurtains and `curtain` in stageBits.js), so the entrance parts
// them straight into the set.
//
// Each backdrop draws the stage from y = 0 down to `height`; the battle panel
// covers the rest.

export const DRAPE_WIDTH = 30;
// The bottom of the border across the top (ropes hang from here).
export const PELMET_HEIGHT = 24;

function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
const rect = (ctx, color, x, y, w, h) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};

const BULBS = Array.from({ length: 22 }, (_, i) => DRAPE_WIDTH + 8 + i * ((W - DRAPE_WIDTH * 2 - 16) / 21));
// Where he hangs (the middle of his sprite), for the spotlight.
const SPOT_X = 232;

// A heavy rotted drape, rising out of sight: deep folds, a ragged hem.
// `side` -1 left, 1 right; `sway` a jerk of the rope.
function drawDrape(ctx, x, w, height, side, sway = 0) {
  for (let i = 0; i < w; i++) {
    const fold = (i + (side > 0 ? 4 : 0)) % 10;
    const color = fold <= 1 ? '#12060a' : fold <= 3 ? '#1e0a10' : fold <= 5 ? '#2c1018' : fold <= 7 ? '#240c13' : '#180709';
    const tear = Math.floor(hash(i * 3 + (side > 0 ? 500 : 0)) * 10);
    rect(ctx, color, x + i + (i > w / 2 ? sway : 0), 0, 1, height - tear);
  }
  // The spotlight catching the inner edge.
  rect(ctx, 'rgba(180, 200, 255, 0.07)', side > 0 ? x : x + w - 3, 0, 3, height - 6);
}

// The border across the top of the stage, ragged at the hem: the same cloth
// the king's sprite draws over the rafters (peptupPuppet.js), so they meet.
function drawBorder(ctx) {
  for (let col = 0; col < W / 2; col++) {
    const { color, hem } = borderAt(col);
    rect(ctx, BORDER_COLORS[color], col * 2, 0, 2, (hem + 1) * 2);
  }
}

// Another puppet from another show, hanging limp in the dark on its strings:
// a dim silhouette. (x, y) is the top of its head; s its size.
function drawHungPuppet(ctx, x, y, s, color, tilt) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, y);
  ctx.moveTo(x - 3 * s + 0.5, 0); ctx.lineTo(x - 3 * s + tilt + 0.5, y + 9 * s);
  ctx.moveTo(x + 3 * s + 0.5, 0); ctx.lineTo(x + 3 * s + tilt + 0.5, y + 9 * s);
  ctx.stroke();
  rect(ctx, color, x - s + tilt, y, 2 * s + 1, 2 * s + 1);
  rect(ctx, color, x - s, y + 2 * s + 1, 2 * s + 1, 4 * s);
  rect(ctx, color, x - 3 * s + tilt, y + 3 * s, s, 6 * s);
  rect(ctx, color, x + 2 * s + tilt, y + 3 * s, s, 6 * s);
  rect(ctx, color, x - s, y + 6 * s + 1, s, 6 * s);
  rect(ctx, color, x + s, y + 6 * s + 1, s, 5 * s);
}

// A cone of cold light from the flies down to a pool on the boards.
function spotCone(ctx, x, height, strength) {
  const floorY = height - 30;
  const g = ctx.createLinearGradient(0, 0, 0, floorY + 8);
  g.addColorStop(0, `rgba(210, 225, 255, ${strength * 1.3})`);
  g.addColorStop(1, `rgba(200, 215, 255, ${strength * 0.6})`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - 8, 0);
  ctx.lineTo(x + 8, 0);
  ctx.lineTo(x + 56, floorY + 8);
  ctx.lineTo(x - 56, floorY + 8);
  ctx.fill();
  ctx.fillStyle = `rgba(210, 225, 255, ${strength})`;
  ctx.beginPath();
  ctx.ellipse(x, floorY + 8, 56, 6, 0, 0, Math.PI * 2);
  ctx.fill();
}

// Behind the curtain (his fight's second phase), the show coming apart in
// the set too: a sandbag that came down early lies split on the boards under
// its cut rope; the stagehands' work-light swings on its cord in the flies,
// the cord giving away the ropes; and the show's sign, TA-DA, hangs crooked
// off one chain, its bulbs dying.
function drawComingApart(ctx, time, floorY) {
  // The early sandbag, split, sand spilled; its rope still swinging above.
  const sway = Math.sin(time * 1.3) * 2;
  ctx.strokeStyle = 'rgba(200, 176, 140, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(102.5, 0);
  ctx.quadraticCurveTo(102.5 + sway, 40, 102.5 + sway * 1.6, 70);
  ctx.stroke();
  rect(ctx, '#3a2c1c', 92, floorY + 2, 12, 5);
  rect(ctx, '#5a4630', 93, floorY + 1, 10, 4);
  rect(ctx, '#7a6040', 94, floorY + 1, 4, 1);
  rect(ctx, '#4a3a26', 97, floorY, 2, 1);
  for (let i = 0; i < 7; i++) rect(ctx, '#6a5a40', 104 + i * 2, floorY + 5 - (i % 2), 2, 1);
  // The work-light: a bare bulb in a tin shade on a long cord.
  const lx = 276 + Math.sin(time * 0.9) * 5;
  const ly = 52;
  ctx.strokeStyle = 'rgba(120, 110, 100, 0.5)';
  ctx.beginPath();
  ctx.moveTo(276.5, 0);
  ctx.lineTo(lx + 0.5, ly - 3);
  ctx.stroke();
  const glow = ctx.createRadialGradient(lx, ly + 2, 0, lx, ly + 2, 34);
  const flick = 0.16 + Math.sin(time * 17) * 0.015;
  glow.addColorStop(0, `rgba(255, 200, 120, ${flick})`);
  glow.addColorStop(1, 'rgba(255, 200, 120, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(lx - 34, ly - 32, 68, 68);
  rect(ctx, '#4a4440', lx - 3, ly - 3, 7, 3);
  rect(ctx, '#ffe6a8', lx - 1, ly, 3, 2);
  // The TA-DA sign, crooked off one chain, half its bulbs out.
  ctx.save();
  ctx.translate(58, 30);
  ctx.rotate(0.22 + Math.sin(time * 0.7) * 0.03);
  ctx.globalAlpha = 0.75;
  rect(ctx, '#1a1210', -1, -1, 30, 11);
  rect(ctx, '#6a4a2a', 0, 0, 28, 9);
  for (let i = 0; i < 28; i += 3) rect(ctx, (i * 5) % 7 < 3 && Math.sin(time * 5 + i) > -0.3 ? '#ffe9a0' : '#3a2a18', i, 0, 1, 1);
  // T A - D A, in dull red blocks.
  [[2, 2, 3, 1], [3, 2, 1, 5], [7, 3, 1, 4], [9, 3, 1, 4], [7, 2, 3, 1], [7, 4, 3, 1], [12, 4, 2, 1],
    [15, 2, 1, 5], [16, 2, 1, 1], [16, 6, 1, 1], [17, 3, 1, 3], [20, 3, 1, 4], [22, 3, 1, 4], [20, 2, 3, 1], [20, 4, 3, 1]]
    .forEach(([x, y, w, h]) => rect(ctx, '#a02a38', x, y, w, h));
  ctx.restore();
  ctx.strokeStyle = 'rgba(140, 130, 120, 0.4)';
  ctx.beginPath();
  ctx.moveTo(58.5, 0);
  ctx.lineTo(58.5, 30);
  ctx.stroke();
}

// `battle`, if it's given, is the battle (for the phase of his fight).
export function drawTheatre(ctx, time, height, battle = null) {
  const floorY = height - 30;
  // The dark of the stage house, a little less black low down.
  const back = ctx.createLinearGradient(0, 0, 0, floorY);
  back.addColorStop(0, '#030205');
  back.addColorStop(1, '#0c0a10');
  ctx.fillStyle = back;
  ctx.fillRect(0, 0, W, floorY);
  // Pipes and fly ropes up in the dark, at different depths.
  [[30, 0.25], [46, 0.18], [60, 0.12]].forEach(([y, a]) => rect(ctx, `rgba(90, 84, 100, ${a})`, 0, y, W, 1));
  for (let n = 0; n < 14; n++) {
    const x = 40 + hash(n + 9400) * (W - 80);
    const len = 40 + hash(n + 9410) * 70;
    const sway = Math.sin(time * 0.4 + n) * 0.6;
    ctx.globalAlpha = 0.18 + hash(n + 9420) * 0.12;
    rect(ctx, '#5a5464', x + sway, 0, 1, len);
    if (hash(n + 9430) < 0.4) rect(ctx, '#3a3440', x + sway - 1, len, 3, 4);
    ctx.globalAlpha = 1;
  }
  // Puppets from other shows, left hanging in the gloom.
  drawHungPuppet(ctx, 70, 58, 2, '#16131c', 1);
  drawHungPuppet(ctx, 104, 44, 1, '#110f16', -1);
  drawHungPuppet(ctx, 186, 50, 2, '#141119', 2);
  drawHungPuppet(ctx, 292, 62, 1, '#110f16', 0);

  // The stage: worn dark boards, dust, one plank broken through.
  rect(ctx, '#1c1814', 0, floorY, W, height - floorY);
  for (let i = 0; i < 8; i++) {
    const y = floorY + 1 + i * 4;
    if (y >= height) break;
    rect(ctx, i % 2 ? '#262019' : '#2c251d', 0, y, W, 3);
    rect(ctx, '#110e0b', 0, y + 3, W, 1);
  }
  rect(ctx, '#030205', 92, floorY + 9, 22, 3);
  rect(ctx, '#3a3228', 0, floorY, W, 1);

  if (battle?.bossPhase?.()?.id === 'behind') drawComingApart(ctx, time, floorY);

  // The spotlight on him, and dust turning in it.
  spotCone(ctx, SPOT_X, height, 0.1);
  for (let n = 0; n < 24; n++) {
    const t = (time * (0.04 + hash(n + 9950) * 0.05) + hash(n + 9960)) % 1;
    const y = t * floorY;
    const spread = 8 + (y / floorY) * 48;
    const x = SPOT_X + (hash(n + 9970) * 2 - 1) * spread + Math.sin(time * 0.7 + n) * 3;
    ctx.globalAlpha = 0.2 + 0.3 * Math.sin(t * Math.PI);
    rect(ctx, '#e8eeff', x, y, 1, 1);
    ctx.globalAlpha = 1;
  }

  // The footlights: dead, but one that stutters.
  BULBS.forEach((x, i) => {
    rect(ctx, '#14110e', x - 2, height - 3, 5, 2);
    if (i === 15) {
      const on = Math.sin(time * 23) > 0.6 || Math.sin(time * 3.1) > 0.92;
      if (on) {
        rect(ctx, '#ffe0a0', x - 1, height - 5, 3, 2);
        const fg = ctx.createRadialGradient(x, height - 4, 0, x, height - 4, 18);
        fg.addColorStop(0, 'rgba(255, 210, 140, 0.22)');
        fg.addColorStop(1, 'rgba(255, 210, 140, 0)');
        ctx.fillStyle = fg;
        ctx.fillRect(x - 18, height - 22, 36, 22);
      } else rect(ctx, '#2a2418', x - 1, height - 5, 3, 2);
    } else rect(ctx, '#1e1a14', x - 1, height - 5, 3, 2);
  });

  // The drapes and the border.
  drawDrape(ctx, 0, DRAPE_WIDTH, height, -1);
  drawDrape(ctx, W - DRAPE_WIDTH, DRAPE_WIDTH, height, 1);
  drawBorder(ctx);
  // The dark closing in at the edges.
  const v = ctx.createRadialGradient(W * 0.6, height * 0.55, 50, W * 0.6, height * 0.55, 220);
  v.addColorStop(0, 'rgba(0, 0, 0, 0)');
  v.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, height);
}

// The stage curtains of his entrance. `u` is how far they've parted: 0 shut
// (the two halves meet in the middle), 1 open, hanging at the sides as the
// drapes of the set. Once they're apart the spotlight snaps on him.
export function drawCurtains(ctx, u, time, height, spot) {
  const e = u * u * (3 - 2 * u);
  const w = W / 2 + (DRAPE_WIDTH - W / 2) * e;
  // (They jerk a little as they go: somebody's pulling the rope.)
  const sway = Math.sin(time * 9) * (u > 0 && u < 1 ? 1.5 : 0);
  if (u > 0.45) spotCone(ctx, spot.x, height, 0.12 * Math.min(1, (u - 0.45) / 0.55));
  drawDrape(ctx, 0, Math.ceil(w), height, -1, sway);
  drawDrape(ctx, W - Math.ceil(w), Math.ceil(w), height, 1, sway);
  drawBorder(ctx);
}

export const THEATRE_BACKDROPS = { theatre: drawTheatre };
