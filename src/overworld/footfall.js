import { TILE_SIZE as T } from '../config.js';
import { COAST_AREAS } from './coastTiles.js';

// What your feet do to the ground, wherever you walk: dust off a dry path
// when you run, leaves kicked up in the litter, mud flicked off the bog,
// drips off old duckboards, sawdust and snow sifting down through a bridge's
// planks, and a puff of whatever's there when you land from a jump. Party
// members following you do it too (a little less). In the snow, footprints
// and kicked-up snow are the overworld's own (see OverworldScene).
//
// Each footfall adds particles to the overworld's list; they're moved and
// drawn here (moveParticle, drawParticle) alongside its own.

// A step every this many pixels walked (about one per stride of the hero's
// walking frames), and running.
export const STRIDE = 11;
export const RUN_STRIDE = 14;

// Kinds of ground, by tile.
const GROUND = {
  ':': 'dust', s: 'dust', X: 'dust', j: 'dust', q: 'dust', '.': 'floor', o: 'boards', c: 'floor', r: 'floor',
  d: 'leaves', y: 'leaves', N: 'leaves',
  ',': 'grass', ';': 'grass',
  n: 'snow', i: 'snow', l: 'snow',
  g: 'bridge', '=': 'duckboards', '%': 'bog',
};
// The colours of what's kicked up off each.
const DUST = { dust: '200, 184, 156', floor: '170, 160, 170', boards: '180, 150, 110', grass: '150, 170, 120', sand: '226, 206, 156' };
const LEAVES = ['#c8402e', '#e0702a', '#a82838', '#e8a03a', '#8a2a24'];
const GRASS = ['#6c9a48', '#88b458', '#5a8040'];
const MUD = ['#3a2e22', '#4a3c2a', '#2c241a'];

// On the coast, `;` is the shallows (not fen turf), and `q` is shingle
// (pebbles that crunch). Each coast area's own tiles (their tile keys are in
// the room files): Gullrest's `.` and `:` are sand; Wrack Shore's `.` is wet
// shingle and `:` its shell path and dune sand; Saltcombe's `.` is planks and
// `X` cobbles; the wreck's `:` is deck planks; Merrow's `:`, the Soundings'
// and the Isles' `X` are flagstones and cobbles; the lighthouse's `:` gravel.
const COAST_GROUND = { ';': 'shallows', q: 'shingle' };
const AREA_GROUND = {
  gullrest: { '.': 'sand', ':': 'sand' },
  wrack: { '.': 'shingle', ':': 'sand' },
  saltcombe: { '.': 'boards', X: 'floor' },
  wreck: { ':': 'boards' },
  ghostship: { '.': 'boards', ':': 'boards', o: 'boards' },
  merrow: { ':': 'floor' },
  soundings: { X: 'floor' },
  isles: { X: 'floor' },
  haddock_light: { ':': 'shingle' },
  // Chapter 4 (added 9 November 2026), with real footsteps for each (see
  // FOOTSTEPS in src/audio/music.js). Sunnyside: meadow grass and buttercups,
  // the golden lane, sun-warmed flagstones, stepping stones, the shallows and
  // the fishers' plank steps. The Glimmering: the lilac cave floor (crystal
  // underfoot), glowing moss and ferns (soft), the shallow glowing water.
  // Belowtown: flagstones and cobbles (the moles' paving), mossy turf, the
  // royal carpet and the inn's rug, floorboards. The Diggings: packed dirt,
  // gravel, plank causeways, trestles, water. The Stillwater: pale wet
  // stone, wet shingle, the jetty, the shallows. The Deep: black stone, ash.
  sunnyside: { ',': 'meadow', N: 'meadow', ':': 'lane', '.': 'paving', j: 'paving', ';': 'wade', o: 'planks' },
  glimmer: { '.': 'crystal', ',': 'moss', N: 'moss', j: 'wade' },
  belowtown: { '.': 'paving', X: 'paving', ',': 'moss', r: 'rug', o: 'planks' },
  diggings: { '.': 'dirt', q: 'gravel', o: 'planks', g: 'trestle', ';': 'wade' },
  stillwater: { '.': 'rock', q: 'gravel', o: 'planks', g: 'trestle', ';': 'wade' },
  deep: { '.': 'rock', q: 'ash', o: 'planks', g: 'trestle', ';': 'wade' },
};
// Chapter 4's grounds kick up what the older ones do (their own sound aside).
const LOOKS_LIKE = {
  rock: 'floor', paving: 'floor', crystal: 'floor', rug: 'floor', ash: 'floor', gravel: 'dust', dirt: 'dust', lane: 'dust',
  planks: 'boards', trestle: 'bridge', meadow: 'grass', wade: 'shallows',
};

export function groundUnder(room, body) {
  if ((body.ground ?? 0) > 0) return 'block';
  const tile = room.tileAt(Math.floor(body.x / T), Math.floor((body.y - 1) / T));
  const own = AREA_GROUND[room.area]?.[tile] ?? (COAST_AREAS.has(room.area) ? COAST_GROUND[tile] : null);
  return own ?? GROUND[tile] ?? null;
}

const rand = (min, max) => min + Math.random() * (max - min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

// A puff of dust at someone's feet: `size` from a step (1) to a landing (2).
function puff(particles, x, y, color, size, way = 0) {
  const n = size > 1 ? 4 : 1 + (Math.random() < 0.5 ? 1 : 0);
  for (let i = 0; i < n; i++) {
    const side = size > 1 ? (i % 2 ? 1 : -1) : -way || (Math.random() < 0.5 ? -1 : 1) * 0.4;
    particles.push({ kind: 'dust', color, x: x + side * rand(1, 4), y: y - 1, vx: side * rand(8, 16) * size, vy: -rand(2, 6), life: rand(0.35, 0.55) * (size > 1 ? 1.3 : 1), age: 0, r: size > 1 ? 1.5 : 1 });
  }
}

// One footfall by `body` (facing `way`: -1 left, 1 right, 0 up or down) on
// `ground`. `light` is someone following, who stirs up less. `under` is the
// bridge run they're on, if any (to sift bits down through its planks).
export function footfall(particles, ground, body, { running = false, light = false, under = null, way = 0 } = {}) {
  ground = LOOKS_LIKE[ground] ?? ground;
  const x = body.x;
  const y = body.y;
  const chance = (p) => Math.random() < p * (light ? 0.5 : 1);
  switch (ground) {
    case 'dust':
    case 'floor':
    case 'boards':
      if (running && chance(ground === 'dust' ? 0.9 : 0.45)) puff(particles, x, y, DUST[ground], 1, way);
      break;
    case 'grass':
      if (running && chance(0.35)) particles.push({ kind: 'bit', color: pick(GRASS), x: x + rand(-3, 3), y: y - 1, vx: rand(-12, 12), vy: -rand(18, 30), life: 0.45, age: 0, flutter: false });
      break;
    case 'leaves':
      // Leaves: one kicked up now and then walking, more running, fluttering down.
      for (let i = 0; i < (running ? 2 : 1); i++) {
        if (!chance(running ? 0.55 : 0.28)) continue;
        particles.push({ kind: 'bit', color: pick(LEAVES), x: x + rand(-3, 3), y: y - 1, vx: rand(-14, 14) - way * 6, vy: -rand(26, 42), life: rand(0.9, 1.3), age: 0, flutter: true, phase: rand(0, 6) });
      }
      break;
    case 'snow':
      if (running && chance(0.6)) {
        for (let i = 0; i < 2; i++) particles.push({ kind: 'snow', x: x + rand(-2, 2), y: y - 1, vx: rand(-14, 14) - way * 8, vy: -rand(14, 24), life: rand(0.3, 0.45), age: 0 });
      }
      break;
    case 'sand':
      // Soft sand sprays up behind you running.
      if (running && chance(0.85)) puff(particles, x, y, DUST.sand, 1, way);
      break;
    case 'shallows':
      // Wading: a ring spreading from where you trod, and a few drops flicked up.
      if (chance(0.9)) particles.push({ kind: 'ripple', color: '236, 252, 250', x, y: y - 1, vx: 0, vy: 0, life: 0.75, age: 0 });
      for (let i = 0; i < (running ? 3 : 1); i++) {
        if (chance(running ? 0.9 : 0.6)) particles.push({ kind: 'drop', x: x + rand(-3, 3), y: y - 2, vx: rand(-14, 14) - way * 6, vy: -rand(18, 30), life: 0.45, age: 0, floor: y - 1 });
      }
      break;
    case 'bog':
      // Mud flicked up off your heels, and a ripple where you trod.
      if (chance(0.8)) {
        for (let i = 0; i < (running ? 3 : 2); i++) particles.push({ kind: 'mud', color: pick(MUD), x: x + rand(-3, 3), y: y - 1, vx: rand(-16, 16), vy: -rand(20, 34), life: 0.5, age: 0, floor: y });
      }
      if (chance(0.6)) particles.push({ kind: 'ripple', color: '120, 110, 80', x, y: y - 1, vx: 0, vy: 0, life: 0.7, age: 0 });
      break;
    case 'duckboards':
      // The boards dip into the fen water under them: a ripple off one side.
      if (chance(0.5)) particles.push({ kind: 'ripple', color: '150, 170, 170', x: x + (Math.random() < 0.5 ? -6 : 6), y: y - 2, vx: 0, vy: 0, life: 0.8, age: 0 });
      if (running && chance(0.5)) particles.push({ kind: 'drop', x: x + rand(-4, 4), y: y - 1, vx: rand(-10, 10), vy: -rand(16, 26), life: 0.4, age: 0, floor: y });
      break;
    case 'bridge':
      // Bits of bark and old snow sift down through the gaps in the planks.
      if (under && chance(running ? 0.9 : 0.6)) {
        for (let i = 0; i < (running ? 2 : 1); i++) {
          particles.push({ kind: 'sift', color: Math.random() < 0.5 ? '#c08a4e' : '#eef3fa', x: x + rand(-5, 5), y: Math.max(y, under.bottom - 1), vx: rand(-3, 3), vy: rand(8, 16), life: rand(0.8, 1.3), age: 0 });
        }
      }
      break;
    default:
      break;
  }
}

// Landing from a jump on `ground`: more of everything.
export function landing(particles, ground, body, under = null) {
  ground = LOOKS_LIKE[ground] ?? ground;
  const { x, y } = body;
  switch (ground) {
    case 'dust':
    case 'floor':
    case 'boards':
    case 'grass':
    case 'block':
      puff(particles, x, y, DUST[ground] ?? DUST.floor, 2);
      if (ground === 'grass') for (let i = 0; i < 2; i++) footfall(particles, 'grass', body, { running: true });
      break;
    case 'leaves':
      puff(particles, x, y, '160, 90, 70', 2);
      for (let i = 0; i < 4; i++) particles.push({ kind: 'bit', color: pick(LEAVES), x: x + rand(-5, 5), y: y - 1, vx: rand(-24, 24), vy: -rand(30, 50), life: rand(1, 1.4), age: 0, flutter: true, phase: rand(0, 6) });
      break;
    case 'sand':
      puff(particles, x, y, DUST.sand, 2);
      break;
    case 'bog':
    case 'duckboards':
    case 'shallows':
      for (let i = 0; i < 3; i++) footfall(particles, ground, body, { running: true });
      break;
    case 'bridge':
      for (let i = 0; i < 3; i++) footfall(particles, 'bridge', body, { running: true, under });
      break;
    default:
      break;
  }
}

// Pulling up short from a run, or turning back on the spot while running
// (`way` is the way you were going: -1 left, 1 right, 0 up or down): a scuff of
// whatever's underfoot thrown on ahead of your boots (see smallLife.js).
export function skid(particles, ground, body, way = 0) {
  ground = LOOKS_LIKE[ground] ?? ground;
  const { x, y } = body;
  switch (ground) {
    case 'dust':
    case 'floor':
    case 'boards':
    case 'block':
    case 'sand':
      puff(particles, x + way * 3, y, DUST[ground] ?? DUST.floor, 1, -way);
      puff(particles, x + way * 2, y + 1, DUST[ground] ?? DUST.floor, 1, -way);
      break;
    case 'grass':
      for (let i = 0; i < 3; i++) particles.push({ kind: 'bit', color: pick(GRASS), x: x + way * 3 + rand(-2, 2), y: y - 1, vx: way * rand(10, 24) + rand(-6, 6), vy: -rand(14, 26), life: 0.4, age: 0, flutter: false });
      break;
    case 'leaves':
      for (let i = 0; i < 3; i++) particles.push({ kind: 'bit', color: pick(LEAVES), x: x + way * 3 + rand(-2, 2), y: y - 1, vx: way * rand(12, 26) + rand(-8, 8), vy: -rand(24, 38), life: rand(0.9, 1.2), age: 0, flutter: true, phase: rand(0, 6) });
      break;
    case 'snow':
      for (let i = 0; i < 4; i++) particles.push({ kind: 'snow', x: x + way * 3 + rand(-2, 2), y: y - 1, vx: way * rand(14, 30) + rand(-8, 8), vy: -rand(12, 22), life: rand(0.3, 0.45), age: 0 });
      break;
    case 'shallows':
    case 'bog':
    case 'duckboards':
      footfall(particles, ground, body, { running: true, way: -way });
      break;
    default:
      break;
  }
}

// Moves one of the particles above, or returns false if it isn't one of ours.
export function moveParticle(p, dt) {
  switch (p.kind) {
    case 'dust':
      p.vx *= 0.9;
      p.vy *= 0.9;
      break;
    case 'bit':
      if (p.flutter) {
        // A leaf: falls slowly, rocking from side to side.
        p.vy = Math.min(p.vy + 140 * dt, 14);
        p.x += Math.sin(p.age * 9 + p.phase) * 10 * dt;
      } else {
        p.vy += 220 * dt;
      }
      break;
    case 'mud':
    case 'drop':
      p.vy += 260 * dt;
      // Back down on the ground: it stays there till it's gone.
      if (p.y > p.floor) { p.y = p.floor; p.vx = 0; p.vy = 0; }
      break;
    case 'sift':
      p.vy += 40 * dt;
      p.x += Math.sin(p.age * 6) * 4 * dt;
      break;
    case 'ripple':
      break;
    default:
      return false;
  }
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  return true;
}

// Draws one of the particles above at screen (x, y), or returns false.
export function drawParticle(ctx, p, x, y) {
  const k = p.age / p.life;
  switch (p.kind) {
    case 'dust': {
      const r = p.r + k * 2.5;
      ctx.fillStyle = `rgba(${p.color}, ${(0.4 * (1 - k)).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      return true;
    }
    case 'bit':
      ctx.globalAlpha = Math.min(1, (1 - k) * 2);
      ctx.fillStyle = p.color;
      // A leaf turns over as it falls: wide, then edge-on.
      ctx.fillRect(x, y, p.flutter && Math.sin(p.age * 9 + p.phase) > 0 ? 2 : 1, 1);
      ctx.globalAlpha = 1;
      return true;
    case 'mud':
      ctx.globalAlpha = Math.min(1, (1 - k) * 3);
      ctx.fillStyle = p.color;
      ctx.fillRect(x, y, 1, 1);
      ctx.globalAlpha = 1;
      return true;
    case 'drop':
      ctx.fillStyle = `rgba(200, 220, 230, ${(0.8 * (1 - k)).toFixed(3)})`;
      ctx.fillRect(x, y, 1, 1);
      return true;
    case 'sift':
      ctx.globalAlpha = Math.min(1, (1 - k) * 1.5);
      ctx.fillStyle = p.color;
      ctx.fillRect(x, y, 1, 1);
      ctx.globalAlpha = 1;
      return true;
    case 'ripple': {
      // A flat ring spreading out, seen from above at a slant.
      const r = 2 + k * 6;
      ctx.strokeStyle = `rgba(${p.color}, ${(0.6 * (1 - k)).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(x + 0.5, y + 0.5, r, r * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
      return true;
    }
    default:
      return false;
  }
}
