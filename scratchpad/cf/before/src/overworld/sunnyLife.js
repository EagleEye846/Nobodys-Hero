import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, TILE_SIZE as T } from '../config.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { SUNNY_TOUCHES } from '../data/sunnyTouches.js';

// SUNNY LIFE: the small living things of Sunnyside, Haddock's rooms and the chapter 5 secret
// rooms (the life pass, round 2), as kinds for touches.js. Same rules as every touch: only drawn,
// no bodies, nothing can bump into them. A room's list is in src/data/sunnyTouches.js; add `ch: 4`
// or `ch: 5` to a line to show it in one chapter only.
//
//   hen        a hen (and her chicks) pecking about her patch; she runs and flaps when you come near
//   dog        a farm dog asleep in the sun; sits up and wags when you come near, flops down again
//   puff       a dandelion clock: walk close and it lets go all its seeds, then grows a new head
//   flutter    butterflies round a patch of flowers; they scatter when you come near and come back
//   swallows   a pair of swallows that skim over the field every so often
//   ducks      a duck and her ducklings paddling in a line over the pond
//   heron      a heron on one leg in the shallows; it takes off when you come near and comes back
//   rustle     a bush that rustles when you pass (chapter 4: it's nearer every time you come back)
//   ants       a line of ants carrying crumbs from one place to another
//   cloudshade soft cloud shadows sliding over the whole field
//   dapple     leaf shadow and bright flecks on the ground under a tree
//   slowSnail  a snail on its way along a ribbon; it is going to take a very long time
//   spray      flecks of foam blowing over the cliff edge
//
// Positions are in tiles (decimals are fine).

const rect = (ctx, color, x, y, w = 1, h = 1) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};
const onScreen = (x, y, pad = 24) => x > -pad && x < W + pad && y > -pad && y < H + pad;
const fract = (x) => x - Math.floor(x);
const hash = (n) => fract(Math.sin(n * 91.7 + 17.3) * 43758.5453);
// How near anyone in the party is (pixels).
const nearest = (scene, px, py) => {
  const p = scene.player;
  let d = Math.hypot(p.x + 6 - px, p.y + 12 - py);
  for (const o of scene.followers ?? []) if (!o.hidden) d = Math.min(d, Math.hypot(o.x + 6 - px, o.y + 12 - py));
  return d;
};
// Which way is away from the nearest friend, as -1 or 1.
const awayX = (scene, px) => (px >= scene.player.x + 6 ? 1 : -1);
const smooth = (t) => t * t * (3 - 2 * t);

// ---- Hens ----
const HEN_COATS = {
  brown: { body: '#b0642c', light: '#d08a4a', tail: '#6a3a1a' },
  white: { body: '#f2eee2', light: '#ffffff', tail: '#c4c0b2' },
  black: { body: '#3a3038', light: '#5a4e58', tail: '#1e181e' },
  speckle: { body: '#8a6a4a', light: '#c8b08a', tail: '#4a3624' },
};
function drawHen(ctx, x, y, f, c, pose, t, i) {
  // x, y: its feet. f: 1 facing right, -1 left. pose: 'stand' | 'peck' | 'run' | 'sit'.
  const px = (lx, ly, w, h, col) => rect(ctx, col, f > 0 ? x + lx : x - lx - w + 1, y + ly, w, h);
  rect(ctx, 'rgba(0,0,0,0.16)', x - 4, y, 9, 1);
  if (pose === 'sit') {
    px(-5, -6, 10, 6, c.body); px(-4, -7, 8, 1, c.body); px(-3, -3, 6, 2, c.light);
    px(-6, -8, 2, 4, c.tail); px(3, -10, 3, 3, c.body); px(4, -12, 2, 2, '#d8382a'); px(6, -9, 1, 1, '#f0b020'); px(5, -9, 1, 1, '#14100c');
    return;
  }
  const flap = pose === 'run' ? Math.round(Math.sin(t * 36 + i)) : 0;
  const dip = pose === 'peck' ? 3 + Math.round(Math.sin(t * 9 + i * 2)) : 0;
  // Legs.
  const step = pose === 'run' ? Math.round(Math.sin(t * 30 + i)) : 0;
  px(-1 + step, -3, 1, 3, '#e0a020'); px(1 - step, -3, 1, 3, '#e0a020');
  // Body, belly, tail.
  px(-4, -7, 8, 4, c.body); px(-3, -8, 6, 1, c.body); px(-3, -4, 6, 1, c.light); px(-2, -6, 4, 2, c.light);
  px(-6, -10 - (pose === 'peck' ? -1 : 0), 2, 4, c.tail); px(-5, -11 - (pose === 'peck' ? -1 : 0), 1, 1, c.tail);
  // Wing.
  if (pose === 'run') { px(-3, -10 - flap, 5, 3, c.light); px(-2, -11 - flap, 3, 1, c.light); } else px(-2, -6, 4, 2, c.tail);
  // Neck and head.
  px(3, -9 + dip, 2, 4 - dip, c.body);
  px(3, -10 + dip, 3, 3, c.body);
  px(4, -12 + dip, 2, 2, '#d8382a');
  px(6, -9 + dip, 1, 1, '#f0b020');
  px(5, -7 + dip, 1, 1, '#d8382a');
  px(5, -9 + dip, 1, 1, '#14100c');
}
function hen(s) {
  const home = { x: s.x * T + 8, y: s.y * T + 8 };
  const r = (s.r ?? 1.6) * T;
  const coat = HEN_COATS[s.coat ?? 'brown'];
  const seed = s.x * 7.3 + s.y * 3.1;
  const st = { x: home.x, y: home.y, tx: home.x, ty: home.y, f: hash(seed) > 0.5 ? 1 : -1, mode: 'peck', until: 0, last: null, scare: 0, chicks: [] };
  const nChicks = s.chicks ?? 0;
  for (let k = 0; k < nChicks; k++) st.chicks.push({ x: home.x - 10 - k * 6, y: home.y + 2 });
  const update = (t) => {
    const dt = st.last === null ? 0.016 : Math.min(0.1, Math.max(0, t - st.last));
    st.last = t;
    const d = nearest(s.scene, st.x, st.y);
    if (d < 30 && st.mode !== 'run') {
      st.mode = 'run';
      st.scare = 1.4;
      const a = Math.atan2(st.y - (s.scene.player.y + 12), st.x - (s.scene.player.x + 6));
      st.tx = Math.max(home.x - r * 1.6, Math.min(home.x + r * 1.6, st.x + Math.cos(a) * 36));
      st.ty = Math.max(home.y - r, Math.min(home.y + r, st.y + Math.sin(a) * 24));
    }
    if (st.mode === 'run') {
      st.scare -= dt;
      const dx = st.tx - st.x; const dy = st.ty - st.y;
      const len = Math.hypot(dx, dy);
      if (len > 1) { st.x += (dx / len) * 46 * dt; st.y += (dy / len) * 46 * dt; st.f = dx >= 0 ? 1 : -1; }
      if (st.scare <= 0) { st.mode = 'stand'; st.until = t + 1; }
    } else if (t >= st.until) {
      if (st.mode === 'walk' && Math.hypot(st.tx - st.x, st.ty - st.y) > 2) {
        const dx = st.tx - st.x; const dy = st.ty - st.y; const len = Math.hypot(dx, dy);
        st.x += (dx / len) * 12 * dt; st.y += (dy / len) * 12 * dt; st.f = dx >= 0 ? 1 : -1;
        if (len < 3) { st.mode = 'peck'; st.until = t + 1.5 + hash(t) * 3; }
      } else if (st.mode === 'peck' || st.mode === 'stand') {
        // Done pecking: look about, then maybe wander to a new spot.
        if (hash(Math.floor(t * 3) + seed) > 0.4) { st.mode = 'walk'; st.tx = home.x + (hash(Math.floor(t) + seed) - 0.5) * 2 * r; st.ty = home.y + (hash(Math.floor(t) + seed + 5) - 0.5) * r; st.until = 0; } else { st.mode = hash(Math.floor(t) + seed) > 0.5 ? 'peck' : 'stand'; st.until = t + 1.2 + hash(t) * 2.5; }
      } else if (st.mode === 'walk') { st.mode = 'peck'; st.until = t + 2; }
    }
    // Chicks trail after her, a little behind.
    st.chicks.forEach((c, k) => {
      const gx = st.x - st.f * (9 + k * 7);
      const gy = st.y + 1 + (k % 2) * 2;
      c.x += (gx - c.x) * Math.min(1, dt * 3);
      c.y += (gy - c.y) * Math.min(1, dt * 3);
    });
  };
  const pose = () => (st.mode === 'run' ? 'run' : st.mode === 'peck' ? 'peck' : 'stand');
  return {
    thing: {
      get sortY() { return st.y + 1; },
      draw(ctx, cam, t) {
        update(t);
        const x = st.x - cam.x; const y = st.y - cam.y;
        if (!onScreen(x, y, 30)) return;
        drawHen(ctx, Math.round(x), Math.round(y), st.f, coat, pose(), t, seed);
        st.chicks.forEach((c, k) => {
          const cx = Math.round(c.x - cam.x); const cy = Math.round(c.y - cam.y);
          const hop = st.mode === 'run' ? Math.abs(Math.round(Math.sin(t * 24 + k))) : (Math.floor(t * 3 + k * 2) % 5 === 0 ? 1 : 0);
          rect(ctx, 'rgba(0,0,0,0.14)', cx - 2, cy, 5, 1);
          rect(ctx, '#f8e060', cx - 2, cy - 3 - hop, 4, 3);
          rect(ctx, '#f8e060', cx + st.f * 2 - (st.f < 0 ? 1 : 0), cy - 5 - hop, 2, 2);
          rect(ctx, '#e08a20', cx + st.f * 3 - (st.f < 0 ? 0 : 0), cy - 4 - hop, 1, 1);
          rect(ctx, '#14100c', cx + st.f * 2 - (st.f < 0 ? 1 : 0), cy - 5 - hop, 1, 1);
        });
      },
    },
  };
}

// ---- A farm dog ----
function dog(s) {
  const x0 = s.x * T + 8; const y0 = s.y * T + 12;
  const face = s.face ?? 1;
  const fur = s.fur ?? '#c08a48'; const dark = s.dark ?? '#8a5a2a'; const pale = '#f0e2c0';
  const st = { awake: 0, last: null };
  return {
    thing: {
      sortY: y0 + 1,
      draw(ctx, cam, t) {
        const dt = st.last === null ? 0.016 : Math.min(0.1, Math.max(0, t - st.last));
        st.last = t;
        const d = nearest(s.scene, x0, y0);
        // Wakes when you come within three tiles, settles again when you've been gone a while.
        st.awake = d < 46 ? Math.min(1.4, st.awake + dt * 2.2) : Math.max(0, st.awake - dt * 0.5);
        const up = st.awake > 0.7;
        const x = Math.round(x0 - cam.x); const y = Math.round(y0 - cam.y);
        if (!onScreen(x, y, 24)) return;
        const px = (lx, ly, w, h, c) => rect(ctx, c, face > 0 ? x + lx : x - lx - w + 1, y + ly, w, h);
        rect(ctx, 'rgba(0,0,0,0.18)', x - 8, y, 17, 1);
        if (!up) {
          // Curled up asleep: back, nose on paws, tail round.
          const breathe = Math.round(Math.sin(t * 1.6) * 0.6 + 0.4);
          px(-7, -5 - breathe, 12, 5 + breathe, fur); px(-6, -6 - breathe, 9, 1, fur); px(-7, -2, 12, 2, dark);
          px(-3, -4 - breathe, 3, 2, dark);
          px(3, -4, 5, 3, fur); px(6, -3, 2, 2, pale); px(7, -3, 1, 1, '#14100c'); px(4, -6, 2, 3, dark);
          px(-8, -3, 2, 3, fur); px(-9, -2, 1, 1, pale);
          if (st.awake < 0.2 && Math.floor(t * 0.5) % 2 === 0) {
            const k = fract(t * 0.5);
            ctx.globalAlpha = 1 - k;
            rect(ctx, '#ffffff', x + face * (8 + k * 3), y - 9 - k * 6, 2, 1); rect(ctx, '#ffffff', x + face * (9 + k * 3), y - 8 - k * 6, 1, 1); rect(ctx, '#ffffff', x + face * (8 + k * 3), y - 7 - k * 6, 2, 1);
            ctx.globalAlpha = 1;
          }
        } else {
          // Sitting up, tongue out, tail thumping the grass.
          px(-4, -9, 7, 9, fur); px(-3, -10, 5, 1, fur); px(-1, -8, 3, 5, pale);
          px(-7, -1, 4, 1, dark);
          px(1, -14, 6, 5, fur); px(5, -12, 3, 3, pale); px(7, -12, 1, 1, '#14100c'); px(4, -12, 1, 1, '#14100c');
          px(0, -15, 2, 4, dark); px(5, -15, 2, 3, dark);
          px(6, -10, 1, 2, '#e86a7a');
          const wag = Math.round(Math.sin(t * 16));
          px(-7 + wag, -4, 3, 2, fur); px(-8 + wag, -5, 2, 2, fur);
          px(-1, -2, 2, 2, dark); px(2, -2, 2, 2, dark);
        }
      },
    },
  };
}

// ---- A dandelion clock that lets go ----
function puff(s) {
  const x0 = s.x * T + 8; const y0 = s.y * T + 14;
  const seeds = [];
  const st = { bare: false, regrow: 0, last: null };
  return {
    thing: {
      sortY: y0,
      draw(ctx, cam, t) {
        const dt = st.last === null ? 0.016 : Math.min(0.1, Math.max(0, t - st.last));
        st.last = t;
        const x = Math.round(x0 - cam.x); const y = Math.round(y0 - cam.y);
        if (!onScreen(x, y, 40)) return;
        if (!st.bare && nearest(s.scene, x0, y0 - 6) < 22) {
          st.bare = true; st.regrow = 28;
          for (let k = 0; k < 16; k++) seeds.push({ x: x0 + (hash(k) - 0.5) * 6, y: y0 - 12 + (hash(k + 20) - 0.5) * 6, vx: 10 + hash(k + 40) * 16, vy: -(7 + hash(k + 60) * 9), age: 0, life: 4 + hash(k + 80) * 3 });
        }
        if (st.bare) { st.regrow -= dt; if (st.regrow <= 0) st.bare = false; }
        // Stem.
        const sway = Math.round(Math.sin(t * 1.4 + s.x));
        rect(ctx, '#3f8a35', x + sway * 0, y - 11, 1, 11);
        rect(ctx, '#5eaa48', x - 2, y - 2, 2, 1); rect(ctx, '#5eaa48', x + 1, y - 3, 2, 1);
        // The head: a ball of fluff, or the bare knob.
        const grown = st.bare ? Math.max(0, 1 - st.regrow / 6) * 0 + (st.regrow < 6 ? 1 - st.regrow / 6 : 0) : 1;
        const hx = x + sway; const hy = y - 14;
        if (!st.bare || grown > 0) {
          const n = Math.round(14 * grown);
          for (let k = 0; k < n; k++) { const a = (k / 14) * 6.283 + (k % 2) * 0.4; const rr = k % 2 ? 4 : 2.5; rect(ctx, k % 3 ? '#ffffff' : '#dfe6ee', hx + Math.cos(a) * rr, hy + Math.sin(a) * rr, 1, 1); }
          rect(ctx, '#c8d0d8', hx, hy, 1, 1);
        } else {
          rect(ctx, '#a89868', hx, hy, 2, 2);
        }
        for (let i = seeds.length - 1; i >= 0; i--) {
          const sd = seeds[i];
          sd.age += dt;
          if (sd.age > sd.life) { seeds.splice(i, 1); continue; }
          sd.x += (sd.vx + Math.sin(sd.age * 2 + i) * 6) * dt;
          sd.y += (sd.vy + Math.cos(sd.age * 1.5 + i) * 3) * dt;
          sd.vy += 1.2 * dt;
          ctx.globalAlpha = Math.min(1, (sd.life - sd.age) * 1.2);
          const sx = sd.x - cam.x; const sy = sd.y - cam.y;
          rect(ctx, '#ffffff', sx - 1, sy - 1, 3, 1); rect(ctx, '#e6ecf2', sx, sy, 1, 2);
          ctx.globalAlpha = 1;
        }
      },
    },
  };
}

// ---- Butterflies that scatter ----
function flutter(s) {
  const n = s.n ?? 3;
  const cols = s.colors ?? [['#f8d02a', '#d8a818'], ['#f8f4ea', '#c8c4b8'], ['#6aa8f0', '#3a6ad0'], ['#f0884a', '#c8582a']];
  const cx0 = s.x * T + 8; const cy0 = s.y * T + 4;
  const scare = Array(n).fill(0);
  return {
    over(ctx, cam, t) {
      if (!onScreen(cx0 - cam.x, cy0 - cam.y, 60)) return;
      const dNear = nearest(s.scene, cx0, cy0 + 8);
      for (let i = 0; i < n; i++) {
        if (dNear < 38) scare[i] = Math.max(scare[i], 1 - hash(i + s.x) * 0.35);
        scare[i] = Math.max(0, scare[i] - 0.004);
        const a = t * (0.5 + hash(i + 2) * 0.5) + hash(i + 9) * 6.28;
        const away = awayX(s.scene, cx0) * smooth(Math.min(1, scare[i])) * (34 + i * 10);
        const x = cx0 + Math.sin(a) * 15 + Math.sin(a * 2.7 + i) * 4 + away - cam.x;
        const y = cy0 + Math.cos(a * 1.3 + i) * 7 - smooth(Math.min(1, scare[i])) * (14 + i * 4) - cam.y;
        if (!onScreen(x, y, 8)) continue;
        const [c1, c2] = cols[(i + (s.x | 0)) % cols.length];
        const open = Math.sin(t * 17 + i * 3) > 0;
        rect(ctx, '#2a1a10', x, y, 1, 2);
        if (open) { rect(ctx, c1, x - 2, y - 1, 2, 2); rect(ctx, c1, x + 1, y - 1, 2, 2); rect(ctx, c2, x - 2, y + 1, 2, 1); rect(ctx, c2, x + 1, y + 1, 2, 1); } else { rect(ctx, c1, x - 1, y - 1, 1, 2); rect(ctx, c2, x + 1, y - 1, 1, 2); }
      }
    },
  };
}

// ---- Swallows skimming ----
function swallows(s) {
  const every = s.every ?? 11;
  const n = s.n ?? 2;
  return {
    over(ctx, cam, t) {
      const cyc = Math.floor((t + (s.offset ?? 0)) / every);
      const phase = ((t + (s.offset ?? 0)) % every) / 4.2;
      if (phase > 1) return;
      const dir = hash(cyc + s.x) > 0.5 ? 1 : -1;
      for (let i = 0; i < n; i++) {
        const p = phase - i * 0.07;
        if (p < 0 || p > 1) continue;
        const wx = (dir > 0 ? s.x + s.w * p : s.x + s.w * (1 - p)) * T;
        const wy = (s.y + s.h * 0.5 + Math.sin(p * 9 + i) * s.h * 0.35 * Math.sin(p * 3.14)) * T;
        const x = wx - cam.x; const y = wy - cam.y;
        if (!onScreen(x, y, 12)) continue;
        const flap = Math.sin(t * 28 + i) > 0 ? -1 : 1;
        rect(ctx, 'rgba(0,0,0,0.12)', x - 2, y + 24 + i * 2, 5, 1);
        rect(ctx, '#243a5a', x - 2, y, 5, 2);
        rect(ctx, '#e8d8c0', x + dir * 2, y + 1, 1, 1);
        rect(ctx, '#243a5a', x - dir * 4, y + 1, 2, 1); rect(ctx, '#243a5a', x - dir * 5 + (dir > 0 ? 0 : 0), y + 2, 1, 1);
        rect(ctx, '#3a5a8a', x - 1, y + flap * 2, 3, 1);
        rect(ctx, '#3a5a8a', x - 3, y + flap * 3, 2, 1); rect(ctx, '#3a5a8a', x + 2, y + flap * 3, 2, 1);
        rect(ctx, '#d86a3a', x + dir * 3, y, 1, 1);
      }
    },
  };
}

// ---- Ducks on the pond ----
function ducks(s) {
  const n = s.n ?? 3;
  const cx = (s.x + s.w / 2) * T; const cy = (s.y + s.h / 2) * T;
  const path = (t, k) => {
    const a = t * 0.11 * (s.speed ?? 1) + (s.phase ?? 0) - k * 0.09;
    return [cx + Math.sin(a) * (s.w * T * 0.42), cy + Math.sin(a * 2) * (s.h * T * 0.3)];
  };
  return {
    floor(ctx, cam, t) {
      for (let k = n; k >= 0; k--) {
        const [x0, y0] = path(t, k);
        const [x1, y1] = path(t + 0.3, k);
        const x = x0 - cam.x; const y = y0 - cam.y;
        if (!onScreen(x, y, 20)) continue;
        const f = x1 >= x0 ? 1 : -1;
        const big = k === 0;
        // Wake: a V that trails behind.
        ctx.globalAlpha = 0.45;
        rect(ctx, '#d8f0fa', x - f * (big ? 7 : 4), y + 1, 4, 1); rect(ctx, '#d8f0fa', x - f * (big ? 10 : 6), y + 2, 3, 1);
        ctx.globalAlpha = 1;
        const px = (lx, ly, w, h, c) => rect(ctx, c, f > 0 ? x + lx : x - lx - w + 1, y + ly, w, h);
        if (big) {
          const dab = Math.floor(t * 0.4 + s.x) % 4 === 0 && fract(t * 0.4) < 0.3;
          px(-5, -3, 9, 4, '#d8cdb0'); px(-5, -2, 3, 2, '#a89868'); px(-6, -4, 2, 2, '#d8cdb0');
          px(2, dab ? -1 : -6, 3, 4, '#2a7a58'); px(4, dab ? 1 : -5, 3, 2, '#e0a020');
          px(3, dab ? 0 : -6, 1, 1, '#14100c');
        } else {
          px(-3, -2, 6, 3, '#f0d85a'); px(2, -4, 3, 3, '#f0d85a'); px(5, -3, 1, 1, '#e08a20'); px(3, -4, 1, 1, '#14100c');
        }
      }
    },
  };
}

// ---- A heron in the shallows ----
function heron(s) {
  const x0 = s.x * T + 8; const y0 = s.y * T + 14;
  const st = { gone: 0, last: null, flight: 0 };
  const GREY = '#8a98a8'; const LIGHT = '#c8d2dc'; const DARK = '#2e3846';
  return {
    thing: {
      sortY: y0,
      draw(ctx, cam, t) {
        const dt = st.last === null ? 0.016 : Math.min(0.1, Math.max(0, t - st.last));
        st.last = t;
        if (st.gone <= 0 && st.flight <= 0 && nearest(s.scene, x0, y0) < 56) { st.flight = 2.6; st.gone = 22 + hash(t) * 12; st.dir = awayX(s.scene, x0); }
        const x = Math.round(x0 - cam.x); const y = Math.round(y0 - cam.y);
        if (st.flight > 0) {
          st.flight -= dt;
          const p = 1 - st.flight / 2.6;
          const fx = x + st.dir * p * 130; const fy = y - 10 - p * 70 - p * p * 20;
          if (onScreen(fx, fy, 20)) {
            const flap = Math.sin(t * 9) > 0 ? -1 : 1;
            rect(ctx, GREY, fx - 3, fy, 7, 2); rect(ctx, LIGHT, fx - 2, fy, 5, 1);
            rect(ctx, GREY, fx - 9, fy + flap * 3, 6, 1); rect(ctx, GREY, fx + 4, fy + flap * 3, 6, 1);
            rect(ctx, DARK, fx - 11, fy + flap * 4, 2, 1); rect(ctx, DARK, fx + 9, fy + flap * 4, 2, 1);
            rect(ctx, GREY, fx + st.dir * 4, fy - 2, 2, 3); rect(ctx, '#e0b030', fx + st.dir * 6, fy - 2, 3, 1);
            rect(ctx, GREY, fx - st.dir * 5, fy + 1, 4, 1);
          }
          return;
        }
        if (st.gone > 0) {
          st.gone -= dt;
          if (st.gone > 3) return;
          // Gliding back in.
          const p = 1 - st.gone / 3;
          const fx = x - (s.side ?? 1) * (1 - p) * 90; const fy = y - 40 * (1 - p);
          if (onScreen(fx, fy, 20)) {
            rect(ctx, GREY, fx - 3, fy, 7, 2); rect(ctx, GREY, fx - 9, fy - 1, 6, 1); rect(ctx, GREY, fx + 4, fy - 1, 6, 1);
          }
          return;
        }
        if (!onScreen(x, y, 24)) return;
        const stab = fract(t / 9 + s.x) > 0.93;
        // Ripples round its leg.
        const r = fract(t * 0.35);
        ctx.strokeStyle = `rgba(216,240,250,${(0.5 * (1 - r)).toFixed(2)})`;
        ctx.beginPath(); ctx.ellipse(x + 0.5, y + 0.5, 3 + r * 6, 1.2 + r * 2.4, 0, 0, 6.283); ctx.stroke();
        rect(ctx, '#e0b030', x, y - 9, 1, 9);
        rect(ctx, GREY, x - 3, y - 17, 7, 8); rect(ctx, LIGHT, x - 2, y - 16, 4, 5); rect(ctx, DARK, x - 4, y - 14, 2, 3);
        if (stab) {
          rect(ctx, GREY, x + 3, y - 14, 2, 8); rect(ctx, GREY, x + 4, y - 7, 2, 7); rect(ctx, '#e0b030', x + 5, y - 1, 1, 3);
        } else {
          rect(ctx, GREY, x + 3, y - 19, 2, 4); rect(ctx, GREY, x + 4, y - 22, 2, 4);
          rect(ctx, LIGHT, x + 4, y - 24, 4, 3); rect(ctx, '#e0b030', x + 8, y - 23, 4, 1); rect(ctx, DARK, x + 5, y - 24, 1, 1);
          rect(ctx, DARK, x + 2, y - 25, 3, 1); rect(ctx, DARK, x + 1, y - 24, 2, 1);
        }
      },
    },
  };
}

// ---- A bush that rustles ----
const BUSH_VISITS = {};
function rustle(s) {
  const id = s.scene.roomData.id;
  BUSH_VISITS[id] = (BUSH_VISITS[id] ?? 0) + 1;
  // Chapter 4 only: each time you come back to the room it's a little nearer the path.
  const nearer = Math.min(3, BUSH_VISITS[id] - 1) * (s.step ?? 6);
  const x0 = s.x * T + 8; const y0 = s.y * T + 14 + nearer * (s.dy ?? 0);
  const st = { shake: 0, last: null, drop: [] };
  return {
    thing: {
      sortY: y0,
      draw(ctx, cam, t) {
        const dt = st.last === null ? 0.016 : Math.min(0.1, Math.max(0, t - st.last));
        st.last = t;
        const bx = x0 + nearer * (s.dx ?? 0);
        if (nearest(s.scene, bx, y0) < 40 && st.shake < 0.3) { st.shake = 1.2; for (let k = 0; k < 3; k++) st.drop.push({ x: bx + (k - 1) * 4, y: y0 - 10, age: 0 }); }
        st.shake = Math.max(0, st.shake - dt);
        const x = Math.round(bx - cam.x); const y = Math.round(y0 - cam.y);
        if (!onScreen(x, y, 24)) return;
        const jig = st.shake > 0 ? Math.round(Math.sin(t * 40) * Math.min(1, st.shake) * 1.4) : (fract(t / 47) > 0.97 ? Math.round(Math.sin(t * 30)) : 0);
        rect(ctx, 'rgba(0,0,0,0.18)', x - 8, y - 1, 17, 2);
        const col = ['#2e6a2a', '#3f8a35', '#5eaa48', '#86c864'];
        rect(ctx, col[0], x - 8 + jig, y - 9, 16, 9);
        rect(ctx, col[1], x - 7 + jig, y - 12, 14, 5);
        rect(ctx, col[1], x - 4 + jig, y - 14, 8, 3);
        rect(ctx, col[2], x - 5 + jig, y - 11, 4, 2); rect(ctx, col[2], x + 1 + jig, y - 8, 4, 2); rect(ctx, col[3], x - 3 + jig, y - 13, 2, 1); rect(ctx, col[3], x + 3 + jig, y - 10, 2, 1);
        rect(ctx, '#e8685a', x + 5 + jig, y - 6, 1, 1); rect(ctx, '#e8685a', x - 6 + jig, y - 4, 1, 1);
        for (let i = st.drop.length - 1; i >= 0; i--) {
          const d = st.drop[i]; d.age += dt;
          if (d.age > 1.6) { st.drop.splice(i, 1); continue; }
          rect(ctx, '#5eaa48', d.x - cam.x + Math.sin(d.age * 5) * 3, d.y - cam.y + d.age * 9, 2, 1);
        }
      },
    },
  };
}

// ---- Ants carrying crumbs ----
function ants(s) {
  const n = s.n ?? 6;
  return {
    floor(ctx, cam, t) {
      const x1 = s.x * T + 8; const y1 = s.y * T + 8; const x2 = s.x2 * T + 8; const y2 = s.y2 * T + 8;
      if (!onScreen(x1 - cam.x, y1 - cam.y, 80) && !onScreen(x2 - cam.x, y2 - cam.y, 80)) return;
      for (let i = 0; i < n; i++) {
        const back = i % 2 === 1;
        let p = fract(t * 0.03 + i / n);
        if (back) p = 1 - p;
        const wob = Math.sin(p * 40 + i) * 1.2;
        const x = x1 + (x2 - x1) * p - cam.x; const y = y1 + (y2 - y1) * p + wob - cam.y;
        rect(ctx, '#2a1a10', x, y, 2, 1);
        if (!back) { rect(ctx, '#f8f4ea', x + (x2 > x1 ? 2 : -1), y - 1, 1, 1); }
      }
    },
  };
}

// ---- Cloud shadows ----
function cloudshade(s) {
  const n = s.n ?? 3;
  return {
    floor(ctx, cam, t) {
      const span = s.w * T + 220;
      for (let i = 0; i < n; i++) {
        const x = ((t * (4 + i * 1.3) + i * span / n) % span) - 110 - cam.x;
        const y = (s.y + (s.h ?? 12) * (0.2 + 0.3 * i)) * T - cam.y;
        if (x < -120 || x > W + 120) continue;
        const rw = 70 + i * 18; const rh = 22 + i * 5;
        ctx.fillStyle = 'rgba(20,50,40,0.07)';
        ctx.beginPath(); ctx.ellipse(x, y, rw, rh, 0.1, 0, 6.283); ctx.fill();
        ctx.fillStyle = 'rgba(20,50,40,0.05)';
        ctx.beginPath(); ctx.ellipse(x + 20, y + 4, rw * 0.7, rh * 0.7, 0.1, 0, 6.283); ctx.fill();
      }
    },
  };
}

// ---- Leaf shadow under a tree ----
function dapple(s) {
  const n = s.n ?? 14;
  const cx = s.x * T + 8; const cy = s.y * T + 8; const r = (s.r ?? 2) * T;
  return {
    floor(ctx, cam, t) {
      if (!onScreen(cx - cam.x, cy - cam.y, r + 20)) return;
      for (let i = 0; i < n; i++) {
        const a = hash(i + s.x) * 6.283; const d = Math.sqrt(hash(i + 31 + s.y)) * r;
        const x = cx + Math.cos(a) * d + Math.sin(t * 0.6 + i) * 1.5 - cam.x; const y = cy + Math.sin(a) * d * 0.6 + Math.cos(t * 0.5 + i) * 1 - cam.y;
        const wob = 0.5 + 0.5 * Math.sin(t * 1.3 + i * 2.1);
        ctx.fillStyle = `rgba(16,50,24,${(0.08 + wob * 0.07).toFixed(3)})`;
        ctx.beginPath(); ctx.ellipse(x, y, 4 + (i % 3) * 1.5, 2.6 + (i % 2), 0.4, 0, 6.283); ctx.fill();
        if (i % 3 === 0) { ctx.fillStyle = `rgba(255,255,210,${(0.1 + (1 - wob) * 0.2).toFixed(3)})`; ctx.fillRect(Math.round(x + 3), Math.round(y - 1), 2, 2); }
      }
    },
  };
}

// ---- A snail with a long way to go ----
function slowSnail(s) {
  const span = (s.x2 - s.x) * T;
  const len = s.minutes ?? 6;
  return {
    thing: {
      sortY: s.y * T + 14,
      draw(ctx, cam, t) {
        const p = (t / (len * 60)) % 1;
        const x = Math.round(s.x * T + 4 + span * p - cam.x); const y = Math.round(s.y * T + 14 - cam.y);
        if (!onScreen(x, y, 20)) return;
        // A shiny trail behind.
        for (let k = 0; k < Math.min(span * p, 30); k += 2) { ctx.globalAlpha = 0.35 * (1 - k / 30); rect(ctx, '#e8f0f4', x - k - 1, y, 2, 1); }
        ctx.globalAlpha = 1;
        rect(ctx, '#d8c8a0', x - 1, y - 2, 6, 2);
        rect(ctx, '#c8844a', x - 2, y - 6, 5, 5); rect(ctx, '#e8b070', x - 1, y - 5, 3, 3); rect(ctx, '#8a5a2c', x, y - 4, 1, 1);
        rect(ctx, '#d8c8a0', x + 4, y - 4, 1, 3);
        rect(ctx, '#14100c', x + 4, y - 5 + (Math.floor(t * 0.5) % 2), 1, 1);
      },
    },
  };
}

// ---- Foam blowing over a cliff edge ----
function spray(s) {
  const n = s.n ?? 8;
  return {
    over(ctx, cam, t) {
      for (let i = 0; i < n; i++) {
        const life = fract(t * 0.22 + hash(i + s.x) * 3);
        const x = (s.x + hash(i + 4) * s.w) * T - cam.x + life * 22;
        const y = (s.y + hash(i + 8) * s.h) * T - cam.y - life * 16;
        if (!onScreen(x, y, 8)) continue;
        ctx.globalAlpha = 0.7 * Math.sin(life * Math.PI);
        rect(ctx, '#f4fbff', x, y, 2, 1); rect(ctx, '#d8f0fa', x + 1, y + 1, 1, 1);
        ctx.globalAlpha = 1;
      }
    },
  };
}

export const SUNNY_KINDS = { hen, dog, puff, flutter, swallows, ducks, heron, rustle, ants, cloudshade, dapple, slowSnail, spray };

// A room's life-pass touches (src/data/sunnyTouches.js), for the chapter being played.
export function sunnyTouchesFor(roomData) {
  const list = SUNNY_TOUCHES[roomData.id];
  if (!list) return [];
  const chapter = WORLD_STATE.chapter ?? 1;
  const out = [];
  for (const spec of list) {
    if (spec.ch && spec.ch !== (chapter >= 5 ? 5 : 4)) continue;
    out.push(spec);
  }
  return out;
}
