import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';

// The view off Mount Vigil, drawn behind any room with open sky (`_` tiles).
// A room asks for it with `vista: { altitude, heading }`: `altitude` (0 at the
// foot of the mountain, 1 at the top) sets how far below you the other peaks
// are, how deep the blue of the sky is and whether you're above the clouds;
// `heading` (in turns, 0 to 1) is which way you're looking.
//
// Everything in it is a ring around the mountain, so walking round a spire
// room (`wraps`) turns the whole view: the sun swings past, ranges you saw to
// the east slide away to the west, and when you come full circle it's all
// back where it was. In a flat room the view only shifts a little as the
// camera moves. The time of day (daylight.js) colours all of it: golden at
// dusk and dawn, and at night the sun gives way to a moon, stars and the odd
// shooting star, with the peaks gone blue-black below.

// Repeatable pseudo-random numbers, so the mountains are the same every frame.
function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// How many screen pixels one full turn moves each layer. The far ranges turn
// with you; the nearer ones a touch faster, because you're also moving.
const FAR_TURN = 1000;
const MID_TURN = 1120;
const NEAR_TURN = 1280;
const SEGMENT = 20;

// A ring of peaks: heights at every SEGMENT pixels around a full turn.
function makeRange(seed, turn, base, swing, jaggedness) {
  const count = Math.round(turn / SEGMENT);
  const heights = [];
  let h = base;
  for (let i = 0; i < count; i++) {
    // Wander up and down, with sharp peaks now and then.
    h += (hash(seed + i) - 0.5) * swing;
    h = Math.max(base * 0.4, Math.min(base + swing * 2, h));
    heights.push(h + (hash(seed + i + 500) < jaggedness ? swing * 0.8 : 0));
  }
  // Close the ring smoothly.
  for (let i = 0; i < 4; i++) heights[count - 4 + i] = heights[count - 4 + i] * (1 - (i + 1) / 5) + heights[0] * ((i + 1) / 5);
  return heights;
}

const FAR_RANGE = makeRange(11, FAR_TURN, 34, 14, 0.12);
const MID_RANGE = makeRange(37, MID_TURN, 46, 20, 0.18);
const NEAR_RANGE = makeRange(71, NEAR_TURN, 40, 24, 0.22);

// Sky colours, top to bottom, at the foot of the mountain, at its top, and at night.
const LOW_SKY = ['#5f86c4', '#6a90ca', '#769ad0', '#83a5d5', '#92b0da', '#a2bcde', '#b4c8e0', '#c7d3df', '#d6dde3'];
const HIGH_SKY = ['#1f3d86', '#2a4a94', '#355aa4', '#4670b6', '#5b88c6', '#7aa2d2', '#9ebfe0', '#c3d6ea', '#dbe6f2'];
const NIGHT_SKY = ['#040616', '#06091c', '#080c24', '#0b102c', '#0f1636', '#141c42', '#1b254e', '#25305c', '#303c68'];
const DUSK_GLOW = ['#f0b070', '#f4bc7c', '#f6c890'];

// Spread round the whole ring, like the stars, so they come back round exactly
// where they were when you've walked all the way round a spire.
const CLOUDS = Array.from({ length: 20 }, (_, i) => ({
  x: hash(i + 800) * FAR_TURN,
  y: hash(i + 810) * 70,
  w: 34 + hash(i + 820) * 50,
  speed: 2.5 + hash(i + 830) * 4,
  puff: hash(i + 840),
}));

// The sea of cloud you rise above: soft mounds all along the horizon.
const CLOUD_SEA = Array.from({ length: 40 }, (_, i) => ({
  x: (i / 40) * FAR_TURN + hash(i + 900) * 20,
  w: 36 + hash(i + 910) * 50,
  h: 8 + hash(i + 920) * 10,
  drift: hash(i + 930) * Math.PI * 2,
}));

// Far birds: little flocks wheeling slowly over the valleys.
const FLOCKS = Array.from({ length: 3 }, (_, i) => ({
  angle: hash(i + 1000),
  y: 30 + hash(i + 1010) * 60,
  radius: 20 + hash(i + 1020) * 30,
  speed: 0.05 + hash(i + 1030) * 0.05,
  birds: 3 + Math.floor(hash(i + 1040) * 4),
}));

// Stars, fixed to the sky, so they turn with the mountain.
const STARS = Array.from({ length: 160 }, (_, i) => ({
  x: hash(i + 3000) * FAR_TURN,
  y: hash(i + 3100) * 150,
  size: hash(i + 3200) < 0.12 ? 2 : 1,
  twinkle: hash(i + 3300) * Math.PI * 2,
}));

const parse = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const lerpColor = (a, b, t) => {
  const pa = parse(a);
  const pb = parse(b);
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(',')})`;
};
// Blends a colour (hex or rgb()) towards another by t.
const toward = (color, hex, t) => {
  const pa = color.startsWith('#') ? parse(color) : color.match(/\d+/g).map(Number);
  const pb = parse(hex);
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(',')})`;
};

// Draws one ring of peaks at this scroll, standing on `baseY`, in `rock` with
// `snow` on anything higher than `snowLine` pixels above its base.
function drawRange(ctx, heights, turn, scroll, baseY, rock, snow, snowLine, fillTo = H) {
  // Whole pixels, once for the whole ridge: rounding each point on its own
  // makes the ridge line wobble as it scrolls.
  scroll = Math.round(scroll);
  const count = heights.length;
  const first = Math.floor(scroll / SEGMENT) - 1;
  const points = [];
  // On past the right edge: stopping short leaves a strip of bare sky there that
  // grows and snaps back as the view turns.
  for (let k = first; k * SEGMENT - scroll < W + SEGMENT * 2; k++) {
    const i = ((k % count) + count) % count;
    points.push([Math.round(k * SEGMENT - scroll), Math.round(baseY - heights[i])]);
  }
  ctx.fillStyle = rock;
  ctx.beginPath();
  ctx.moveTo(points[0][0], fillTo);
  for (const [x, y] of points) ctx.lineTo(x, y);
  ctx.lineTo(points[points.length - 1][0], fillTo);
  ctx.closePath();
  ctx.fill();
  if (!snow) return;
  // Snow on the high ground: the ridge line, down to the snow line.
  ctx.fillStyle = snow;
  ctx.beginPath();
  const line = baseY - snowLine;
  ctx.moveTo(points[0][0], line);
  for (const [x, y] of points) ctx.lineTo(x, Math.min(y, line));
  ctx.lineTo(points[points.length - 1][0], line);
  ctx.closePath();
  ctx.fill();
}

// Small pines along a ridge, for the lower slopes.
function drawRidgePines(ctx, heights, turn, scroll, baseY, color) {
  scroll = Math.round(scroll);
  const count = heights.length;
  const first = Math.floor(scroll / SEGMENT) - 1;
  ctx.fillStyle = color;
  // On past the right edge: stopping short leaves a strip of bare sky there that
  // grows and snaps back as the view turns.
  for (let k = first; k * SEGMENT - scroll < W + SEGMENT * 2; k++) {
    const i = ((k % count) + count) % count;
    if (hash(i + 2000) > 0.55) continue;
    const x = k * SEGMENT - scroll + Math.round(hash(i + 2100) * 12);
    const top = Math.round(baseY - heights[i] - 6 + hash(i + 2200) * 4);
    ctx.fillRect(x + 1, top, 1, 7);
    ctx.fillRect(x, top + 2, 3, 3);
    ctx.fillRect(x - 1, top + 4, 5, 2);
  }
}

function drawBird(ctx, x, y, flap, size = 1) {
  // A "v" of wings, up or down.
  const dy = flap ? -1 : 1;
  ctx.fillRect(x - 2 * size, y + dy, size, 1);
  ctx.fillRect(x - size, y, size, 1);
  ctx.fillRect(x, y, size, 1);
  ctx.fillRect(x + size, y + dy, size, 1);
}

// `view`: { yaw (turns), rise (pixels climbed in this room), altitude, driftX
// (camera x, for flat rooms), night (0 to 1), dusk (0 to 1) }.
export function drawVista(ctx, view, time) {
  const altitude = Math.max(0, Math.min(1, view.altitude ?? 0));
  const yaw = view.yaw ?? 0;
  const rise = view.rise ?? 0;
  const night = view.night ?? 0;
  const dusk = view.dusk ?? 0;

  // The sky, deeper blue the higher you are, black-blue at night, and
  // flushed gold low down at dusk and dawn.
  const band = Math.ceil(H / LOW_SKY.length);
  LOW_SKY.forEach((low, i) => {
    let color = lerpColor(low, HIGH_SKY[i], altitude);
    color = toward(color, NIGHT_SKY[i], night);
    const glow = DUSK_GLOW[Math.min(2, Math.max(0, i - 6))];
    if (dusk > 0 && i >= 5) color = toward(color, glow, dusk * 0.55 * ((i - 4) / 5));
    ctx.fillStyle = color;
    ctx.fillRect(0, i * band, W, band);
  });

  // Where the far peaks stand: lower on the screen the higher you climb, and
  // sinking a little further as you climb within the room.
  const horizon = Math.round(H * (0.6 + altitude * 0.2) + rise * 0.1);
  // Every layer's scroll repeats exactly once per turn (stars, clouds and the
  // cloud sea go round with the far range), so crossing a spire's seam, where
  // the yaw jumps by a whole turn, changes nothing on screen.
  const farScroll = yaw * FAR_TURN;

  // Stars come out as the light goes, turning with the mountain.
  if (night > 0.05) {
    for (const star of STARS) {
      const x = ((star.x - Math.round(farScroll)) % FAR_TURN + FAR_TURN) % FAR_TURN;
      if (x >= W) continue;
      const y = Math.round(star.y + rise * 0.1);
      if (y > horizon - 10) continue;
      const twinkle = 0.55 + 0.45 * Math.sin(time * 1.7 + star.twinkle);
      ctx.fillStyle = `rgba(255, 255, 255, ${(night * twinkle).toFixed(2)})`;
      ctx.fillRect(Math.round(x), y, star.size, star.size);
    }
    // A shooting star now and then.
    const period = 9;
    const phase = time % period;
    const streak = Math.floor(time / period);
    if (phase < 0.5 && hash(streak + 4000) < 0.6) {
      const sx = hash(streak + 4100) * W;
      const sy = 10 + hash(streak + 4200) * 60;
      const k = phase / 0.5;
      ctx.strokeStyle = `rgba(255, 255, 255, ${(night * (1 - k) * 0.9).toFixed(2)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx + k * 90, sy + k * 30);
      ctx.lineTo(sx + k * 90 - 18, sy + k * 30 - 6);
      ctx.stroke();
    }
  }

  // The sun by day, the moon by night, fixed in the sky: they come round as you turn.
  const sunScroll = ((0.2 - yaw) % 1 + 1) % 1;
  const sunX = Math.round(sunScroll * FAR_TURN - FAR_TURN / 2 + W / 2);
  const sunY = 34 + Math.round(altitude * 10) + Math.round(night * 40);
  if (sunX > -60 && sunX < W + 60 && night < 0.95) {
    const halo = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 70);
    halo.addColorStop(0, `rgba(255, ${Math.round(246 - dusk * 60)}, ${Math.round(214 - dusk * 110)}, ${(0.55 * (1 - night)).toFixed(2)})`);
    halo.addColorStop(1, 'rgba(255, 246, 214, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(sunX - 70, sunY - 70, 140, 140);
    ctx.fillStyle = dusk > 0.3 ? '#ffd9a0' : '#fff8e0';
    ctx.globalAlpha = 1 - night;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 9 + dusk * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  const moonScroll = ((0.7 - yaw) % 1 + 1) % 1;
  const moonX = Math.round(moonScroll * FAR_TURN - FAR_TURN / 2 + W / 2);
  const moonY = 40 + Math.round(altitude * 8);
  if (night > 0.05 && moonX > -40 && moonX < W + 40) {
    const glow = ctx.createRadialGradient(moonX, moonY, 2, moonX, moonY, 40);
    glow.addColorStop(0, `rgba(220, 230, 255, ${(0.3 * night).toFixed(2)})`);
    glow.addColorStop(1, 'rgba(220, 230, 255, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(moonX - 40, moonY - 40, 80, 80);
    ctx.fillStyle = `rgba(236, 240, 255, ${night.toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 7, 0, Math.PI * 2);
    ctx.fill();
    // A crescent: the sky's colour bites a piece out.
    ctx.fillStyle = toward(lerpColor(LOW_SKY[0], HIGH_SKY[0], altitude), NIGHT_SKY[0], night);
    ctx.globalAlpha = night;
    ctx.beginPath();
    ctx.arc(moonX + 4, moonY - 2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Far clouds, drifting on the wind as well as turning with you.
  ctx.fillStyle = `rgba(255, 255, 255, ${((0.7 - altitude * 0.25) * (1 - night * 0.75)).toFixed(3)})`;
  for (const cloud of CLOUDS) {
    const x = ((cloud.x + time * cloud.speed - farScroll) % FAR_TURN + FAR_TURN) % FAR_TURN - 80;
    if (x > W) continue;
    const y = Math.round(cloud.y + 10 + altitude * 30 + rise * 0.06);
    ctx.fillRect(Math.round(x), y, Math.round(cloud.w), 5);
    ctx.fillRect(Math.round(x + cloud.w * 0.25), y - 4, Math.round(cloud.w * 0.45), 4);
    if (cloud.puff > 0.5) ctx.fillRect(Math.round(x + cloud.w * 0.55), y - 7, Math.round(cloud.w * 0.25), 3);
  }

  // Far birds, wheeling over the valleys (they roost at night).
  if (night < 0.6) {
    ctx.fillStyle = `rgba(30, 40, 70, ${((0.7 - altitude * 0.3) * (1 - night)).toFixed(2)})`;
    for (const flock of FLOCKS) {
      const centre = ((flock.angle - yaw) % 1 + 1) % 1 * FAR_TURN - FAR_TURN / 2 + W / 2;
      for (let b = 0; b < flock.birds; b++) {
        const a = time * flock.speed * Math.PI * 2 + b * 0.6;
        const x = Math.round(centre + Math.cos(a) * flock.radius + b * 4);
        const y = Math.round(flock.y + Math.sin(a) * flock.radius * 0.3 + altitude * 40 + b * 2 + rise * 0.08);
        if (x > -6 && x < W + 6) drawBird(ctx, x, y, Math.floor(time * 6 + b) % 2 === 0);
      }
    }
  }

  // The far ranges, blue with distance, white on top; dark shapes at night.
  const dim = (color) => toward(color, '#141a30', night * 0.8);
  const snowColor = (hex) => toward(hex, '#5c6a90', night * 0.75);
  drawRange(ctx, FAR_RANGE, FAR_TURN, farScroll, horizon, dim(lerpColor('#8a9cc0', '#6d82b0', altitude)), snowColor('#eef3fa'), 26);

  // Above the snowline the valleys fill with cloud: a sea of it, below the peaks.
  if (altitude > 0.45) {
    const seaY = horizon + 2 + Math.round((1 - altitude) * 30);
    const alpha = Math.min(1, (altitude - 0.45) * 2.2);
    ctx.fillStyle = `rgba(${Math.round(236 - night * 160)}, ${Math.round(242 - night * 160)}, ${Math.round(250 - night * 130)}, ${(0.92 * alpha).toFixed(3)})`;
    for (const mound of CLOUD_SEA) {
      const x = Math.round(((mound.x - farScroll + time * 2) % FAR_TURN + FAR_TURN) % FAR_TURN - 60);
      if (x < -mound.w || x > W) continue;
      const y = seaY + Math.round(Math.sin(time * 0.4 + mound.drift) * 1.5);
      ctx.fillRect(Math.round(x), y - Math.round(mound.h / 2), Math.round(mound.w), Math.round(mound.h));
      ctx.fillRect(Math.round(x + mound.w * 0.2), y - Math.round(mound.h / 2) - 3, Math.round(mound.w * 0.5), 3);
    }
    ctx.fillStyle = `rgba(${Math.round(226 - night * 160)}, ${Math.round(234 - night * 160)}, ${Math.round(246 - night * 130)}, ${(0.95 * alpha).toFixed(3)})`;
    ctx.fillRect(0, seaY + 2, W, H - seaY);
  }

  // The middle ranges.
  const midBase = horizon + 22 + Math.round(rise * 0.08);
  drawRange(ctx, MID_RANGE, MID_TURN, yaw * MID_TURN + (view.driftX ?? 0) * 0.08, midBase, dim(lerpColor('#5f7196', '#4a5c86', altitude)), snowColor('#e2ebf5'), 30);

  // The near ridge: dark rock, pines on it low down, snow on it high up.
  const nearBase = horizon + 50 + Math.round(rise * 0.14);
  const nearScroll = yaw * NEAR_TURN + (view.driftX ?? 0) * 0.16;
  drawRange(ctx, NEAR_RANGE, NEAR_TURN, nearScroll, nearBase, dim(lerpColor('#3e4660', '#36405c', altitude)), altitude > 0.3 ? snowColor('#d8e2ef') : null, 28);
  if (altitude < 0.55) drawRidgePines(ctx, NEAR_RANGE, NEAR_TURN, nearScroll, nearBase, dim('#26302e'));

  // Mist in the valley floor, and a cold haze over everything far away.
  const mist = ctx.createLinearGradient(0, nearBase - 10, 0, H);
  const mistColor = night > 0.5 ? '40, 48, 80' : '200, 214, 236';
  mist.addColorStop(0, `rgba(${mistColor}, 0)`);
  mist.addColorStop(1, `rgba(${mistColor}, ${(0.5 + altitude * 0.3).toFixed(2)})`);
  ctx.fillStyle = mist;
  ctx.fillRect(0, nearBase - 10, W, H - nearBase + 10);
}
