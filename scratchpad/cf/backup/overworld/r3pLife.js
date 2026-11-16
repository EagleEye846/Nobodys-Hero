import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, TILE_SIZE as T } from '../config.js';
import { fract, hash } from '../engine/noise.js';
import { glowSprite } from './lamplight.js';

// THE PINEFALL AND HOLLIN'S LIFE: the small living things of the red wood and the empty village, as more
// kinds for touches.js (same rules: drawn only, no bodies, nothing can bump into them). Everything is
// worked out from the clock and where you stand; the little that is kept between frames is a few numbers
// per creature.
//
//   critter    a squirrel, rabbit, hedgehog or fox going about its business at a spot. It notices you
//              (stops, looks), bolts for its refuge if you come near (a squirrel up a tree, the others
//              into the leaves), is away a while, and is back about its business once you've gone
//   deer       a deer glimpsed between the trunks: grazes, lifts its head when you come near, and
//              bounds off out of sight. It comes back much later
//   perch      a bird on a bough or a roof edge (robin, jay, woodpecker, crow, an owl dozing in the day):
//              goes up in a flutter when you come near and settles again
//   flit       butterflies and little moths wandering over a patch
//   dapple     sun coming down through the leaves: warm patches sliding over the ground
//   canopy     leaf clusters and boughs overhead at the room's edge, swaying (drawn over everyone)
//   looseboard a board on a boarded window, hanging by one nail, swinging when the wind lifts
//   motes      dust in a shaft of light
//   ants       a line of ants carrying crumbs between two points (they don't mind you)
//
// Positions are in tiles (decimals are fine).

const rect = (ctx, color, x, y, w = 1, h = 1) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};
const onScreen = (x, y, pad = 30) => x > -pad && x < W + pad && y > -pad && y < H + pad;
const feetOf = (scene) => ({ x: scene.player.x + 6, y: scene.player.y + 12 });
const nearest = (scene, px, py) => {
  const f = feetOf(scene);
  let d = Math.hypot(f.x - px, f.y - py);
  for (const o of scene.followers ?? []) if (!o.hidden) d = Math.min(d, Math.hypot(o.x + 6 - px, o.y + 12 - py));
  return d;
};
const rnd = (a, b) => a + Math.random() * (b - a);

// ---- Critters ----

// Each species: how near before it notices you / bolts, how fast it runs, what it does at home, and
// how it is drawn. `p(dx, dy, w, h, c)` paints relative to its feet, mirrored by the way it faces.
const SPECIES = {
  squirrel: { look: 52, bolt: 34, speed: 96, climbs: true, away: [8, 16] },
  rabbit: { look: 70, bolt: 46, speed: 110, hops: true, away: [10, 20] },
  hedgehog: { look: 40, bolt: 24, speed: 0, curls: true, away: [3, 5] },
  fox: { look: 84, bolt: 56, speed: 80, away: [18, 30] },
};

function drawSquirrel(p, mode, t, i) {
  const bob = Math.round(Math.sin(t * 9 + i) * 0.6);
  if (mode === 'run') {
    const f = Math.floor(t * 14) % 2;
    p(-9, -8 - f, 3, 5, '#8a4420'); p(-8, -10 - f, 4, 3, '#b0622e'); p(-6, -9, 3, 3, '#b0622e');
    p(-4, -4, 8, 3, '#b0622e'); p(-4, -2, 8, 1, '#d8a070'); p(3, -6, 4, 4, '#b0622e'); p(5, -8, 1, 2, '#8a4420'); p(6, -5, 1, 1, '#1c0f14'); p(7, -4, 1, 1, '#4a2a1a');
    p(-4 + f, -1, 2, 1, '#6a3a1a'); p(3 - f, -1, 2, 1, '#6a3a1a');
    return;
  }
  if (mode === 'climb') {
    p(-3, -11, 3, 8, '#8a4420'); p(-3, -14, 4, 4, '#b0622e'); p(-2, -2, 4, 7, '#b0622e'); p(0, 0, 2, 4, '#d8a070'); p(-1, 3, 3, 3, '#b0622e');
    p(0, 4, 2, 1, '#6a3a1a');
    return;
  }
  const look = mode === 'look';
  p(-7, -9 + bob, 3, 8, '#8a4420'); p(-6, -12 + bob, 4, 4, '#b0622e'); p(-5, -13 + bob, 2, 1, '#d8a070');
  p(-4, -7, 5, 7, '#b0622e'); p(-1, -5, 2, 5, '#e0b078');
  p(0, look ? -11 : -10 + bob, 4, 4, '#b0622e'); p(1, look ? -13 : -12 + bob, 1, 2, '#8a4420'); p(3, look ? -10 : -9 + bob, 1, 1, '#1c0f14'); p(4, look ? -8 : -7 + bob, 1, 1, '#4a2a1a');
  if (!look) { p(2, -6, 2, 2, '#7a4020'); p(3, -6 + (Math.sin(t * 7) > 0.4 ? 1 : 0), 2, 2, '#c8a050'); }
  p(-3, -1, 3, 1, '#6a3a1a'); p(0, -1, 3, 1, '#6a3a1a');
}

function drawRabbit(p, mode, t, i) {
  if (mode === 'run') {
    const lift = Math.abs(Math.sin(t * 10 + i)) * 4;
    const y = -lift;
    p(-6, -5 + y, 11, 4, '#9a7a5a'); p(-7, -5 + y, 2, 2, '#f0ece4'); p(3, -8 + y, 4, 4, '#a88a68'); p(4, -12 + y, 1, 4, '#8a6a4a'); p(6, -12 + y, 1, 4, '#8a6a4a'); p(6, -7 + y, 1, 1, '#1c0f14');
    p(-5, -1 + y, 3, 1, '#7a5a3a'); p(3, -1 + y, 3, 1, '#7a5a3a');
    return;
  }
  const up = mode === 'look';
  const nose = Math.sin(t * 12 + i) > 0.5 ? 1 : 0;
  p(-4, -5, 7, 5, '#9a7a5a'); p(-5, -4, 2, 2, '#f0ece4'); p(0, -3, 3, 3, '#c8a888');
  p(1, up ? -10 : -8, 4, 4, '#a88a68'); p(2, up ? -15 : -12, 1, up ? 5 : 4, '#8a6a4a'); p(4, up ? -15 : -12, 1, up ? 5 : 4, '#8a6a4a'); p(4, up ? -8 : -6, 1, 1, '#1c0f14'); p(5 + nose, up ? -7 : -5, 1, 1, '#d08a8a');
  p(-3, -1, 3, 1, '#7a5a3a'); p(1, -1, 3, 1, '#7a5a3a');
}

function drawHedgehog(p, mode, t, i) {
  const ball = mode === 'curl';
  p(-6, -7, 12, 7, '#4a3a30'); p(-5, -8, 10, 1, '#4a3a30');
  for (let x = -5; x < 6; x += 2) { p(x, -9 + (x % 4 === 0 ? 0 : 1), 1, 2, '#8a7458'); p(x + 1, -7, 1, 4, '#2a2018'); }
  p(-4, -6, 3, 2, '#6a5a44'); p(1, -8, 3, 2, '#6a5a44');
  if (!ball) {
    const sniff = Math.sin(t * 6 + i) > 0.3 ? 1 : 0;
    p(5, -4, 3, 3, '#c8a888'); p(8 + sniff, -3, 1, 1, '#1c0f14'); p(6, -5, 1, 1, '#1c0f14');
    p(-3, 0, 2, 1, '#8a6a4a'); p(2, 0, 2, 1, '#8a6a4a');
  } else {
    p(-6, -3, 12, 3, '#3a2c24'); p(-1, -9, 3, 1, '#a89478');
  }
}

function drawFox(p, mode, t, i) {
  if (mode === 'sleep') {
    const br = Math.sin(t * 1.5 + i) > 0.1 ? 1 : 0;
    p(-9, -5 - br, 17, 5 + br, '#d8702a'); p(-8, -6 - br, 14, 1, '#e88a3a'); p(-9, -2, 17, 2, '#b85a1c');
    p(-12, -4, 5, 4, '#d8702a'); p(-14, -3, 3, 3, '#f4ecd8');
    p(4, -6 - br, 5, 4, '#d8702a'); p(8, -4, 2, 2, '#f4ecd8'); p(9, -4, 1, 1, '#1c0f14'); p(5, -8 - br, 2, 2, '#3a1c10'); p(7, -8 - br, 2, 2, '#3a1c10');
    p(5, -4 - br, 3, 1, '#1c0f14');
    return;
  }
  if (mode === 'look' || mode === 'idle') {
    p(-10, -6, 8, 4, '#d8702a'); p(-14, -5, 4, 3, '#f4ecd8');
    p(-5, -8, 9, 5, '#d8702a'); p(-4, -3, 8, 2, '#b85a1c'); p(-3, 0, 2, 1, '#2a1410'); p(2, 0, 2, 1, '#2a1410');
    p(2, -13, 5, 5, '#d8702a'); p(6, -10, 3, 2, '#f4ecd8'); p(8, -10, 1, 1, '#1c0f14'); p(3, -15, 2, 3, '#3a1c10'); p(6, -15, 2, 3, '#3a1c10'); p(5, -11, 1, 1, '#1c0f14');
    return;
  }
  const f = Math.floor(t * 9) % 2;
  p(-13, -9, 7, 4, '#d8702a'); p(-17, -8, 4, 3, '#f4ecd8');
  p(-6, -8, 11, 4, '#d8702a'); p(-5, -4, 9, 1, '#b85a1c');
  p(-5 + f, -4, 2, 4, '#2a1410'); p(2 - f, -4, 2, 4, '#2a1410'); p(-1, -4, 1, 3, '#2a1410');
  p(4, -11, 5, 4, '#d8702a'); p(8, -9, 3, 2, '#f4ecd8'); p(10, -9, 1, 1, '#1c0f14'); p(5, -13, 2, 3, '#3a1c10'); p(8, -13, 2, 3, '#3a1c10');
}

const DRAW = { squirrel: drawSquirrel, rabbit: drawRabbit, hedgehog: drawHedgehog, fox: drawFox };

// Spec: { species, x, y (home, tiles), flip?, refuge: { x, y } (tiles; where it bolts; a squirrel's tree foot),
//         doze? (a fox asleep until you come near), phase? }
function critter(s) {
  const sp = SPECIES[s.species];
  const home = { x: s.x * T + 8, y: s.y * T + 14 };
  const refuge = s.refuge ? { x: s.refuge.x * T + 8, y: s.refuge.y * T + 14 } : { x: home.x + 40, y: home.y - 6 };
  const st = { mode: s.doze ? 'sleep' : 'idle', x: home.x, y: home.y, last: null, wait: 0, alpha: 1, dir: s.flip ? -1 : 1, climbed: 0, dwell: rnd(1, 4), seed: Math.round(s.x * 7 + s.y * 13) };
  const toward = (tx, ty, dt, speed) => {
    const dx = tx - st.x;
    const dy = ty - st.y;
    const d = Math.hypot(dx, dy);
    if (d < speed * dt + 0.5) { st.x = tx; st.y = ty; return true; }
    st.x += (dx / d) * speed * dt;
    st.y += (dy / d) * speed * dt;
    if (Math.abs(dx) > 1) st.dir = Math.sign(dx);
    return false;
  };
  const step = (t, scene) => {
    const dt = st.last == null ? 0 : Math.min(0.1, t - st.last);
    st.last = t;
    const d = nearest(scene, st.x, st.y);
    switch (st.mode) {
      case 'sleep':
        if (d < sp.look) { st.mode = 'look'; st.dwell = 0.9; }
        break;
      case 'idle':
        if (sp.curls) {
          if (d < sp.bolt) { st.mode = 'curl'; st.wait = rnd(...sp.away); }
          else if (d < sp.look) st.mode = 'look';
          break;
        }
        if (d < sp.bolt) { st.mode = 'flee'; break; }
        if (d < sp.look) { st.mode = 'look'; st.dwell = 0.7; }
        break;
      case 'look':
        if (d < sp.bolt) { st.mode = sp.curls ? 'curl' : 'flee'; st.wait = rnd(...sp.away); if (sp.curls) break; }
        else if (d > sp.look + 12) st.mode = s.doze ? 'sleep' : 'idle';
        break;
      case 'curl':
        st.wait -= dt;
        if (st.wait <= 0 && d > sp.look) st.mode = 'idle';
        break;
      case 'flee':
        if (toward(refuge.x, refuge.y, dt, sp.speed)) {
          if (sp.climbs) { st.mode = 'climb'; st.climbed = 0; } else { st.mode = 'gone'; st.wait = rnd(...sp.away); }
        }
        break;
      case 'climb':
        st.climbed += dt * 46;
        if (st.climbed > 46) { st.mode = 'gone'; st.wait = rnd(...sp.away); }
        break;
      case 'gone':
        st.wait -= dt;
        if (st.wait <= 0 && d > sp.look + 30) { st.mode = 'back'; st.x = refuge.x; st.y = refuge.y; }
        break;
      case 'back':
        if (toward(home.x, home.y, dt, sp.speed * 0.5)) st.mode = 'idle';
        break;
      default:
    }
  };
  return {
    thing: {
      get sortY() { return st.y + 1; },
      draw(ctx, cam, t) {
        step(t, s.scene);
        if (st.mode === 'gone') return;
        const x = st.x - cam.x;
        const y = st.y - cam.y;
        if (!onScreen(x, y)) return;
        const mode = st.mode === 'flee' || st.mode === 'back' ? 'run' : st.mode === 'climb' ? 'climb' : st.mode === 'idle' && s.doze ? 'sleep' : st.mode;
        const dir = st.dir;
        const fy = mode === 'climb' ? y - st.climbed : y;
        const p = (dx, dy, w, h, c) => rect(ctx, c, dir > 0 ? x + dx : x - dx - w + 1, fy + dy, w, h);
        // A shadow on the ground.
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.fillRect(Math.round(x) - 5, Math.round(y), 10, 1);
        DRAW[s.species](p, mode === 'sleep' && s.species !== 'fox' ? 'idle' : mode, t, st.seed);
      },
    },
  };
}

// ---- Deer ----

function drawDeer(ctx, x, y, dir, pose, t, fawn) {
  const k = fawn ? 0.75 : 1;
  const q = (dx, dy, w, h, c) => {
    ctx.fillStyle = c;
    const px = dir > 0 ? x + dx * k : x - dx * k - w * k;
    ctx.fillRect(Math.round(px), Math.round(y + dy * k), Math.max(1, Math.round(w * k)), Math.max(1, Math.round(h * k)));
  };
  const body = '#7a4a30';
  const dark = '#4e2e20';
  const light = '#a8704a';
  // Legs (thin).
  const stride = pose === 'bound' ? Math.round(Math.sin(t * 14) * 2) : 0;
  q(-8 + stride, -7, 1, 7, dark); q(-6 - stride, -7, 1, 7, dark); q(4 - stride, -7, 1, 7, dark); q(6 + stride, -7, 1, 7, dark);
  // Body, white tail patch, belly.
  q(-9, -14, 16, 8, body); q(-9, -14, 16, 2, light); q(-9, -8, 16, 2, dark);
  q(-11, -13, 3, 4, '#e8dcc0'); q(-10, -12, 1, 1, '#f8f0dc');
  if (fawn) { q(-6, -12, 1, 1, '#e8dcc0'); q(-2, -10, 1, 1, '#e8dcc0'); q(2, -12, 1, 1, '#e8dcc0'); }
  // Neck and head.
  if (pose === 'graze') {
    q(5, -12, 3, 7, body); q(7, -7, 6, 3, body); q(12, -6, 2, 2, '#1c0f14'); q(8, -9, 2, 2, dark);
  } else {
    q(5, -19, 3, 9, body); q(6, -22, 6, 4, body); q(11, -20, 2, 2, '#c8a888'); q(12, -21, 1, 1, '#1c0f14'); q(8, -26, 1, 4, dark); q(10, -26, 1, 4, dark);
    q(6, -23, 1, 1, '#1c0f14');
  }
}

// Spec: { x, y (tiles), flip?, exit: { x, y }, fawn?: { dx, dy } }
function deer(s) {
  const home = { x: s.x * T + 8, y: s.y * T + 12 };
  const exit = s.exit ? { x: s.exit.x * T + 8, y: s.exit.y * T + 12 } : { x: home.x - 90, y: home.y - 10 };
  const st = { mode: 'graze', x: home.x, y: home.y, last: null, wait: 0, dir: s.flip ? -1 : 1, alpha: 1, headUp: 0, seed: s.x * 3 + s.y };
  return {
    floor(ctx, cam, t) {
      const dt = st.last == null ? 0 : Math.min(0.1, t - st.last);
      st.last = t;
      const d = nearest(s.scene, st.x, st.y);
      if (st.mode === 'graze') {
        // Head up now and then, on its own; up for good when you're near.
        st.headUp = d < 120 ? 1 : fract(t / 7 + hash(st.seed)) > 0.78 ? 1 : 0;
        if (d < 62) st.mode = 'bound';
      } else if (st.mode === 'bound') {
        const dx = exit.x - st.x;
        const dy = exit.y - st.y;
        const len = Math.hypot(dx, dy) || 1;
        st.x += (dx / len) * 130 * dt;
        st.y += (dy / len) * 130 * dt;
        st.dir = Math.sign(dx) || st.dir;
        st.alpha = Math.max(0, st.alpha - dt * 0.7);
        if (len < 4 || st.alpha <= 0) { st.mode = 'away'; st.wait = rnd(30, 55); }
      } else if (st.mode === 'away') {
        st.wait -= dt;
        if (st.wait <= 0 && d > 130) { st.mode = 'graze'; st.x = home.x; st.y = home.y; st.alpha = 0; st.dir = s.flip ? -1 : 1; }
      }
      if (st.mode === 'graze' && st.alpha < 1) st.alpha = Math.min(1, st.alpha + dt * 0.5);
      if (st.mode === 'away' || st.alpha <= 0.02) return;
      const x = st.x - cam.x;
      const y = st.y - cam.y;
      if (!onScreen(x, y, 50)) return;
      ctx.save();
      ctx.globalAlpha = st.alpha;
      const pose = st.mode === 'bound' ? 'bound' : st.headUp ? 'up' : 'graze';
      const hop = st.mode === 'bound' ? -Math.abs(Math.sin(t * 7)) * 7 : 0;
      drawDeer(ctx, x, y + hop, st.dir, pose, t, false);
      if (s.fawn) drawDeer(ctx, x + s.fawn.dx * st.dir, y + s.fawn.dy + hop * 0.8, st.dir, pose === 'up' ? 'up' : 'graze', t + 1, true);
      ctx.restore();
    },
  };
}

// ---- Birds on a bough ----

const BIRDS = {
  robin: { body: '#7a6048', head: '#5a4838', breast: '#e0582c', beak: '#e8b048', size: 1 },
  jay: { body: '#5a7ab0', head: '#3a5a90', breast: '#d8c8b0', beak: '#2a2a2a', size: 1.2 },
  woodpecker: { body: '#2a2a30', head: '#d8302a', breast: '#e8e0d0', beak: '#3a3a3a', size: 1.3, clings: true },
  crow: { body: '#26222c', head: '#1c1822', breast: '#32303c', beak: '#4a4650', size: 1.5 },
  owl: { body: '#8a6e50', head: '#6a5640', breast: '#d8c8a8', beak: '#c8a040', size: 1.6, dozes: true },
};

// Spec: { bird, x, y (tiles: where its feet are), flip?, twig? (a bit of bough under it; default true) }
function perch(s) {
  const b = BIRDS[s.bird];
  const hx = s.x * T + 8;
  const hy = s.y * T;
  const st = { mode: 'sit', x: hx, y: hy, wait: 0, last: null, dir: s.flip ? -1 : 1, lift: 0, seed: s.x * 5 + s.y };
  return {
    over(ctx, cam, t) {
      const dt = st.last == null ? 0 : Math.min(0.1, t - st.last);
      st.last = t;
      const d = nearest(s.scene, hx, hy + 14);
      if (st.mode === 'sit') {
        if (d < (b.dozes ? 34 : 40)) { st.mode = 'fly'; st.lift = 0; st.dir = hash(st.seed + 1) > 0.5 ? 1 : -1; }
      } else if (st.mode === 'fly') {
        st.lift += dt;
        st.x += st.dir * 70 * dt;
        st.y -= 46 * dt;
        if (st.lift > 1.6) { st.mode = 'away'; st.wait = rnd(10, 20); }
      } else if (st.mode === 'away') {
        st.wait -= dt;
        if (st.wait <= 0 && d > 70) { st.mode = 'sit'; st.x = hx; st.y = hy; st.dir = s.flip ? -1 : 1; }
      }
      if (st.mode === 'away') return;
      const x = st.x - cam.x;
      const y = st.y - cam.y;
      if (!onScreen(x, y)) return;
      const sc = b.size;
      const dir = st.dir;
      const m = (dx, dy, w, h, c) => rect(ctx, c, dir > 0 ? x + dx : x - dx - w + 1, y + dy, w, h);
      if (st.mode === 'sit') {
        if (s.twig !== false) {
          rect(ctx, '#3a2418', x - 8, y + 1, 17, 2);
          rect(ctx, '#5a3a24', x - 8, y + 1, 17, 1);
          rect(ctx, '#e0702a', x + 6, y - 1, 3, 2);
        }
        const peck = Math.sin(t * 2.3 + st.seed) > 0.85 ? 1 : 0;
        if (b.clings) {
          // Clinging upright, tapping.
          const tap = Math.sin(t * 22) > 0.2 && fract(t / 4 + hash(st.seed)) < 0.3 ? 1 : 0;
          m(-1, -8, 3, 7, b.body); m(0, -9, 3, 3, b.head); m(2 + tap, -8, 2, 1, b.beak); m(0, -2, 2, 3, b.breast); m(-3, -2, 3, 1, b.body);
          m(0, -7, 1, 1, '#f0ece4');
        } else if (b.dozes) {
          const br = Math.sin(t * 1.3) > 0.2 ? 1 : 0;
          m(-3, -8 - br, 7, 8 + br, b.body); m(-3, -4, 7, 3, b.breast); m(-3, -10 - br, 7, 3, b.head); m(-3, -12 - br, 2, 2, b.head); m(3, -12 - br, 2, 2, b.head);
          m(-2, -8 - br, 2, 1, '#2a1c10'); m(2, -8 - br, 2, 1, '#2a1c10'); m(0, -7 - br, 2, 1, b.beak);
          m(-2, 0, 2, 1, '#3a2c1c'); m(1, 0, 2, 1, '#3a2c1c');
        } else {
          m(-3 * sc, -4 * sc - peck, 6 * sc, 3 * sc, b.body); m(-3 * sc, -1 * sc, 6 * sc, 1.5 * sc, b.breast);
          m(1 * sc, -6 * sc - peck, 3 * sc, 3 * sc, b.head); m(4 * sc, -5 * sc - peck, 1.5 * sc, 1, b.beak); m(2 * sc + 1, -5 * sc - peck, 1, 1, '#1c0f14');
          m(-5 * sc, -2 * sc, 3 * sc, 1.5, b.body); m(-1, 0, 1, 2, '#3a2c1c'); m(1, 0, 1, 2, '#3a2c1c');
        }
      } else {
        // Wings going.
        const f = Math.floor(t * 18) % 2;
        m(-3 * sc, -3 * sc, 6 * sc, 3 * sc, b.body); m(1 * sc, -5 * sc, 3 * sc, 3 * sc, b.head); m(4 * sc, -4 * sc, 1.5 * sc, 1, b.beak);
        m(-4 * sc, f ? -8 * sc : -1 * sc, 6 * sc, 2, b.body); m(-2 * sc, f ? -9 * sc : 0, 3 * sc, 2, b.head);
      }
    },
  };
}

// ---- Butterflies and moths ----

function flit(s) {
  const n = s.n ?? 3;
  const cols = s.colors ?? [['#e0702a', '#7a2a14'], ['#e8d048', '#8a6a1c'], ['#d8e0e8', '#8a96a0']];
  return {
    over(ctx, cam, t) {
      const cx = (s.x + s.w / 2) * T - cam.x;
      const cy = (s.y + s.h / 2) * T - cam.y;
      if (!onScreen(cx, cy, s.w * T)) return;
      for (let i = 0; i < n; i++) {
        const a = t * (0.3 + hash(i + s.x) * 0.35) + hash(i + 9) * 6.28;
        const x = cx + Math.sin(a) * s.w * T * 0.5 + Math.sin(a * 3.1 + i) * 7;
        const y = cy + Math.cos(a * 0.8 + i) * s.h * T * 0.5 + Math.sin(a * 5 + i) * 4;
        const [c1, c2] = cols[i % cols.length];
        const open = Math.sin(t * 13 + i * 2) > 0 ? 3 : 1;
        rect(ctx, c2, x, y, 1, 2);
        rect(ctx, c1, x - open, y - 1, open, 2);
        rect(ctx, c1, x + 1, y - 1, open, 2);
        rect(ctx, c2, x - open, y + 1, 1, 1);
      }
    },
  };
}

// ---- Sun through the leaves ----

function dapple(s) {
  const n = s.n ?? 6;
  return {
    floor(ctx, cam, t) {
      const x0 = s.x * T - cam.x;
      const y0 = s.y * T - cam.y;
      if (!onScreen(x0 + (s.w * T) / 2, y0 + (s.h * T) / 2, Math.max(s.w, s.h) * T)) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < n; i++) {
        const slide = fract(t * 0.012 * (0.6 + hash(i + 3)) + hash(i)) ;
        const x = x0 + ((hash(i + 5 + s.x) + slide) % 1) * s.w * T;
        const y = y0 + hash(i + 11 + s.y) * s.h * T + Math.sin(t * 0.35 + i) * 3;
        const rx = 9 + hash(i + 7) * 14;
        const ry = 4 + hash(i + 8) * 7;
        const flick = 0.7 + Math.sin(t * 0.9 + i * 2.3) * 0.3;
        ctx.globalAlpha = (s.alpha ?? 0.09) * flick;
        ctx.fillStyle = s.color ?? '#ffcf80';
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = (s.alpha ?? 0.09) * flick * 0.8;
        ctx.beginPath();
        ctx.ellipse(x - 2, y - 1, rx * 0.5, ry * 0.5, 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    },
  };
}

// ---- Boughs overhead ----

// Spec: { x0, x1 (tiles), y (the edge row's top, in tiles), side: 'top' | 'bottom', n, size, colors? }
function canopy(s) {
  const n = s.n ?? 8;
  const cols = s.colors ?? ['#2e0a14', '#4e1220', '#6e1c26', '#8a2a2c', '#a83c2e'];
  return {
    over(ctx, cam, t) {
      const x0 = s.x0 * T - cam.x;
      const wide = (s.x1 - s.x0) * T;
      if (x0 > W + 40 || x0 + wide < -40) return;
      const top = s.side !== 'bottom';
      const base = s.y * T - cam.y;
      if (base < -40 || base > H + 40) return;
      for (let i = 0; i < n; i++) {
        const cx = x0 + ((i + 0.5 + (hash(i + s.x0) - 0.5) * 0.7) / n) * wide;
        const r = (s.size ?? 12) * (0.75 + hash(i + 4) * 0.5);
        const sway = Math.sin(t * 0.6 + i * 1.9) * 1.4;
        // A clump of leaves: several small blobs, the darker ones behind.
        for (let k = 0; k < 9; k++) {
          const a = hash(i * 13 + k + 2);
          const b = hash(i * 7 + k + 9);
          const lx = cx + (a - 0.5) * r * 2.2 + sway * (0.4 + b);
          const ly = base + (top ? 1 : -1) * (b * r * 0.9 + 1) + Math.sin(t * 0.9 + k + i) * 0.5;
          const lr = 2.6 + hash(i + k * 3) * 3.4;
          ctx.globalAlpha = 0.93;
          ctx.fillStyle = cols[Math.min(cols.length - 1, Math.floor(b * 3.2))];
          ctx.beginPath();
          ctx.ellipse(lx, ly, lr, lr * 0.72, a * 3, 0, Math.PI * 2);
          ctx.fill();
          if (k % 3 === 0) {
            ctx.fillStyle = cols[4];
            ctx.fillRect(Math.round(lx - 1), Math.round(ly - 1), 2, 1);
          }
        }
        ctx.globalAlpha = 1;
      }
      // The bough they hang from, along the very edge.
      ctx.fillStyle = 'rgba(22,8,12,0.78)';
      ctx.fillRect(Math.round(x0), Math.round(top ? base : base - 3), Math.round(wide), 3);
    },
  };
}

// ---- A board on a window ----

function looseboard(s) {
  return {
    floor(ctx, cam, t) {
      const x = s.x * T + 3 - cam.x;
      const y = s.y * T + 3 - cam.y;
      if (!onScreen(x, y)) return;
      // The wind comes in gusts: a swing, and a bang, now and then.
      const gust = Math.max(0, Math.sin(t * 0.8 + s.x) * Math.sin(t * 0.31 + s.y * 2));
      const ang = 0.15 + gust * 0.7 + Math.sin(t * 6) * 0.02 * gust;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang);
      ctx.fillStyle = '#4a4238';
      ctx.fillRect(0, 0, 3, 9);
      ctx.fillStyle = '#6a6050';
      ctx.fillRect(0, 0, 1, 9);
      ctx.fillStyle = '#1c0f14';
      ctx.fillRect(0, 9, 3, 1);
      ctx.restore();
      rect(ctx, '#8a94a4', x - 1, y - 1, 2, 2);
    },
  };
}

// ---- Dust in a light ----

function motes(s) {
  const n = s.n ?? 10;
  return {
    over(ctx, cam, t) {
      const cx = (s.x + s.w / 2) * T - cam.x;
      const cy = (s.y + s.h / 2) * T - cam.y;
      if (!onScreen(cx, cy, s.w * T)) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < n; i++) {
        const life = fract(t * 0.05 * (0.5 + hash(i + 2)) + hash(i));
        const x = cx + (hash(i + 5) - 0.5) * s.w * T + Math.sin(t * 0.5 + i) * 5;
        const y = cy + (hash(i + 8) - 0.5) * s.h * T + Math.sin(life * 6.28) * 6;
        const a = Math.max(0, Math.sin(t * 0.9 + i * 1.7)) * 0.7;
        rect(ctx, `rgba(${s.color ?? '255,236,190'},${a.toFixed(2)})`, x, y);
      }
      ctx.restore();
    },
  };
}

// ---- Ants ----

function ants(s) {
  const n = s.n ?? 8;
  return {
    floor(ctx, cam, t) {
      const x1 = s.x1 * T - cam.x;
      const y1 = s.y1 * T - cam.y;
      const x2 = s.x2 * T - cam.x;
      const y2 = s.y2 * T - cam.y;
      if (!onScreen((x1 + x2) / 2, (y1 + y2) / 2, 90)) return;
      for (let i = 0; i < n; i++) {
        const out = i % 2 === 0;
        const u = fract(t * 0.06 + i / n);
        const k = out ? u : 1 - u;
        const x = x1 + (x2 - x1) * k + Math.sin(k * 20 + i) * 1.5;
        const y = y1 + (y2 - y1) * k + Math.cos(k * 17 + i) * 1.2;
        rect(ctx, '#140a0a', x, y, 2, 1);
        if (!out) rect(ctx, '#e8e0cc', x - 1, y - 1, 1, 1);
      }
    },
  };
}

// ---- A swirl of leaves where something has just gone by ----

function leafswirl(s) {
  const n = s.n ?? 7;
  const cols = ['#a82838', '#c8402e', '#e0702a', '#e8a03a', '#7a1c24'];
  return {
    over(ctx, cam, t) {
      const cx = s.x * T + 8 - cam.x;
      const cy = s.y * T + 8 - cam.y;
      if (!onScreen(cx, cy)) return;
      const cycle = fract(t / (s.every ?? 14) + hash(s.x));
      if (cycle > 0.3) return;
      const u = cycle / 0.3;
      for (let i = 0; i < n; i++) {
        const a = u * 9 + i * (6.28 / n);
        const r = 3 + u * 11 * (0.5 + hash(i) * 0.5);
        const x = cx + Math.cos(a) * r;
        const y = cy - u * 14 + Math.sin(a) * r * 0.45;
        const c = cols[i % cols.length];
        rect(ctx, c, x, y, 2, 1);
        rect(ctx, c, x + 1, y + 1, 1, 1);
      }
    },
  };
}

export const R3P_KINDS = {
  r3p_critter: critter, r3p_deer: deer, r3p_perch: perch, r3p_flit: flit, r3p_dapple: dapple, r3p_canopy: canopy,
  r3p_looseboard: looseboard, r3p_motes: motes, r3p_ants: ants, r3p_leafswirl: leafswirl,
};
void glowSprite;
void H;
