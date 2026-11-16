import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';

// Weather and wildlife drawn over a room: snow falling across the screen, and
// birds that circle the spire. A room asks for them with `weather: 'snow'`
// (or 'flurry' for a thin, windblown fall, 'gale' for snow driven sideways
// on a hard wind, or 'blizzard') and `birds: n`.

function hash(n) {
  const x = Math.sin(n * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
}

const SNOW_KINDS = {
  flurry: { count: 40, fall: 26, drift: 30, alpha: 0.75 },
  snow: { count: 90, fall: 30, drift: 14, alpha: 0.9 },
  blizzard: { count: 200, fall: 70, drift: 90, alpha: 0.85 },
  // Thinner than a blizzard, so you can still see what's on the ground, but
  // flying past sideways, with streaks of wind through it.
  // Each flake has a faint shadow so it shows against the snow on the ground.
  gale: { count: 110, fall: 34, drift: 150, alpha: 0.75, streaks: 9, shadow: true },
  // The summit's storm: as thick as it gets, driven hard, every flake shadowed
  // so it shows even against snow.
  whiteout: { count: 200, fall: 55, drift: 120, alpha: 0.95, streaks: 14, shadow: true },
};

// Flakes are placed by a formula of time, so there's nothing to update and
// the fall looks the same after a pause as it would have anyway.
const FLAKES = Array.from({ length: 200 }, (_, i) => ({
  x: hash(i) * W,
  y: hash(i + 300) * H,
  size: hash(i + 600) < 0.3 ? 2 : 1,
  speed: 0.7 + hash(i + 900) * 0.6,
  sway: hash(i + 1200) * Math.PI * 2,
  swayRate: 0.8 + hash(i + 1500) * 1.2,
}));

// `dir` ([dx, dy], as in weathervanes.js) is which way the wind blows, if
// it's been turned that way: the snow goes with it. Without one it blows to
// the right, as it always has.
// `amount` (0 to 1) thins it out: fewer flakes, fainter, as a storm dies down.
export function drawSnow(ctx, kind, time, wind = 1, dir = null, amount = 1) {
  const snow = SNOW_KINDS[kind] ?? SNOW_KINDS.snow;
  const [dx, dy] = dir ?? [1, 0];
  const count = Math.round(snow.count * amount);
  ctx.save();
  ctx.globalAlpha = Math.min(1, 0.3 + amount * 0.7);
  for (let i = 0; i < count; i++) {
    const flake = FLAKES[i];
    const sway = Math.sin(time * flake.swayRate + flake.sway) * 6;
    // Blown sideways it still falls; blown up or down the wind carries it.
    const fall = time * flake.speed * (dy ? snow.drift * wind * dy + snow.fall * 0.3 : snow.fall);
    const drift = time * snow.drift * flake.speed * wind * dx;
    const y = ((flake.y + fall + (dy ? sway : 0)) % (H + 4) + (H + 4)) % (H + 4) - 2;
    const x = ((flake.x + drift + (dy ? 0 : sway)) % (W + 4) + (W + 4)) % (W + 4) - 2;
    if (snow.shadow) {
      ctx.fillStyle = 'rgba(70, 90, 125, 0.3)';
      ctx.fillRect(Math.round(x) + 1, Math.round(y) + 1, flake.size, flake.size);
    }
    ctx.fillStyle = `rgba(255, 255, 255, ${(snow.alpha * (flake.size > 1 ? 1 : 0.7)).toFixed(2)})`;
    ctx.fillRect(Math.round(x), Math.round(y), flake.size, flake.size);
  }
  if (snow.streaks) drawStreaks(ctx, snow.streaks, time, wind, dir);
  ctx.restore();
}

// Fog: a pale veil over everything, thickest at the edges, with banks of it
// rolling slowly across. `strength` 0 to 1 (a room's `fog`, times how much of
// its weather is left).
const FOG_BANKS = Array.from({ length: 9 }, (_, i) => ({
  x: hash(i + 2100) * W, y: hash(i + 2200) * H, r: 60 + hash(i + 2300) * 70, speed: 4 + hash(i + 2400) * 8,
}));
export function drawFog(ctx, time, strength) {
  if (strength <= 0) return;
  ctx.save();
  // Grey-blue, so it shows over snow as well as rock.
  ctx.fillStyle = `rgba(160, 172, 196, ${(0.42 * strength).toFixed(3)})`;
  ctx.fillRect(0, 0, W, H);
  for (const bank of FOG_BANKS) {
    const span = W + bank.r * 2;
    const x = ((bank.x + time * bank.speed) % span + span) % span - bank.r;
    const g = ctx.createRadialGradient(x, bank.y, 0, x, bank.y, bank.r);
    g.addColorStop(0, `rgba(196, 204, 222, ${(0.45 * strength).toFixed(3)})`);
    g.addColorStop(1, 'rgba(196, 204, 222, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - bank.r, bank.y - bank.r, bank.r * 2, bank.r * 2);
  }
  // Thicker toward the edges, so the middle is all you can make out.
  const edge = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, W * 0.7);
  edge.addColorStop(0, 'rgba(150, 162, 188, 0)');
  edge.addColorStop(1, `rgba(150, 162, 188, ${(0.65 * strength).toFixed(3)})`);
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

// Streaks of wind: long, faint lines whipping across the screen in gusts,
// each fading in and out as it goes, so they never cover anything for long.
const STREAKS = Array.from({ length: 16 }, (_, i) => ({
  y: 8 + hash(i + 1800) * (H - 16),
  length: 18 + hash(i + 1810) * 34,
  speed: 260 + hash(i + 1820) * 160,
  phase: hash(i + 1830),
  bend: hash(i + 1840) * Math.PI * 2,
}));

function drawStreaks(ctx, count, time, wind, dir = null) {
  // Blowing up or down: the same streaks, turned on their side.
  if (dir && dir[1]) {
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(dir[1] > 0 ? Math.PI / 2 : -Math.PI / 2);
    ctx.translate(-W / 2, -H / 2);
    drawStreaks(ctx, count, time, wind, null);
    ctx.restore();
    return;
  }
  // Blowing left: mirrored.
  if (dir && dir[0] < 0) {
    ctx.save();
    ctx.translate(W, 0);
    ctx.scale(-1, 1);
    drawStreaks(ctx, count, time, wind, null);
    ctx.restore();
    return;
  }
  const span = W * 2.2;
  for (let i = 0; i < Math.min(count, STREAKS.length); i++) {
    const streak = STREAKS[i];
    const travel = time * streak.speed * wind + streak.phase * span;
    const x = (travel % span) - streak.length;
    if (x > W) continue;
    // Brightest mid-screen, gone at the edges.
    const along = Math.max(0, Math.min(1, (x + streak.length / 2) / W));
    const alpha = 0.3 * Math.sin(along * Math.PI);
    if (alpha <= 0.01) continue;
    const y = Math.round(streak.y + Math.sin(time * 1.3 + streak.bend) * 5);
    // Pale on top, with a cool blue-grey edge under it, so it reads against
    // snow as well as sky.
    ctx.fillStyle = `rgba(240, 246, 255, ${alpha.toFixed(3)})`;
    ctx.fillRect(Math.round(x), y, Math.round(streak.length), 1);
    ctx.fillStyle = `rgba(110, 135, 175, ${(alpha * 0.6).toFixed(3)})`;
    ctx.fillRect(Math.round(x) + 2, y + 1, Math.round(streak.length) - 2, 1);
    // A shorter wisp trailing just under it, bent by the gust.
    ctx.fillStyle = `rgba(110, 135, 175, ${(alpha * 0.45).toFixed(3)})`;
    ctx.fillRect(Math.round(x + streak.length * 0.3), y + 3, Math.round(streak.length * 0.5), 1);
  }
}

// Wisps of cloud blowing across in front of everything, high on the mountain:
// soft, slow, and see-through. `strength` is 0 to 1.
const WISPS = Array.from({ length: 5 }, (_, i) => ({
  x: hash(i + 200) * W,
  y: 20 + hash(i + 210) * (H - 70),
  w: 120 + hash(i + 220) * 130,
  h: 16 + hash(i + 230) * 14,
  speed: 6 + hash(i + 240) * 9,
  phase: hash(i + 250) * Math.PI * 2,
}));

export function drawWisps(ctx, time, strength) {
  if (strength <= 0) return;
  for (const wisp of WISPS) {
    const span = W + wisp.w * 2;
    const cx = ((wisp.x + time * wisp.speed) % span + span) % span - wisp.w + wisp.w / 2;
    const cy = wisp.y + Math.sin(time * 0.3 + wisp.phase) * 4;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, wisp.h / wisp.w);
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, wisp.w / 2);
    glow.addColorStop(0, `rgba(236, 242, 250, ${(0.26 * strength).toFixed(3)})`);
    glow.addColorStop(0.6, `rgba(236, 242, 250, ${(0.12 * strength).toFixed(3)})`);
    glow.addColorStop(1, 'rgba(236, 242, 250, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, wisp.w / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Birds wheeling round the spire, in front of the rock when they're on your
// side of it and hidden when they pass behind. `project` turns an angle round
// the mountain (radians, 0 being where you are) and a world y into a screen
// point, or null if that's behind the rock.
const BIRDS = Array.from({ length: 12 }, (_, i) => ({
  angle: hash(i + 50) * Math.PI * 2,
  speed: (0.25 + hash(i + 60) * 0.2) * (hash(i + 70) < 0.5 ? 1 : -1),
  y: hash(i + 80),
  bob: hash(i + 90) * Math.PI * 2,
  flap: hash(i + 100) * 10,
}));

export function drawCirclingBirds(ctx, count, time, roomHeight, project) {
  ctx.fillStyle = '#1e2436';
  for (let i = 0; i < Math.min(count, BIRDS.length); i++) {
    const bird = BIRDS[i];
    const angle = bird.angle + time * bird.speed;
    const y = Math.round(roomHeight * (0.15 + bird.y * 0.7) + Math.sin(time * 0.9 + bird.bob) * 12);
    const point = project(angle, y);
    if (!point) continue;
    const flap = Math.floor(time * 7 + bird.flap) % 2 === 0;
    const size = point.near ? 2 : 1;
    const dy = flap ? -1 : 1;
    const x = Math.round(point.x);
    ctx.fillRect(x - 2 * size, point.y + dy, size, 1);
    ctx.fillRect(x - size, point.y, size, 1);
    ctx.fillRect(x, point.y, size, 1);
    ctx.fillRect(x + size, point.y + dy, size, 1);
    if (size > 1) ctx.fillRect(x - 1, point.y + 1, 2, 1);
  }
}
