import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';

// Weather and wildlife drawn over a room: snow falling across the screen, and
// birds that circle the spire. A room asks for them with `weather: 'snow'`
// (or 'flurry' for a thin, windblown fall, or 'blizzard') and `birds: n`.

function hash(n) {
  const x = Math.sin(n * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
}

const SNOW_KINDS = {
  flurry: { count: 40, fall: 26, drift: 30, alpha: 0.75 },
  snow: { count: 90, fall: 30, drift: 14, alpha: 0.9 },
  blizzard: { count: 200, fall: 70, drift: 90, alpha: 0.85 },
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

export function drawSnow(ctx, kind, time, wind = 1) {
  const snow = SNOW_KINDS[kind] ?? SNOW_KINDS.snow;
  for (let i = 0; i < snow.count; i++) {
    const flake = FLAKES[i];
    const y = (flake.y + time * snow.fall * flake.speed) % (H + 4) - 2;
    const x = ((flake.x + time * snow.drift * flake.speed * wind + Math.sin(time * flake.swayRate + flake.sway) * 6) % (W + 4) + (W + 4)) % (W + 4) - 2;
    ctx.fillStyle = `rgba(255, 255, 255, ${(snow.alpha * (flake.size > 1 ? 1 : 0.7)).toFixed(2)})`;
    ctx.fillRect(Math.round(x), Math.round(y), flake.size, flake.size);
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
