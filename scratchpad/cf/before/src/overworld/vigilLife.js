import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, TILE_SIZE as T } from '../config.js';
import { hash, fract } from '../engine/noise.js';

// VIGIL LIFE: the life pass's living things for Mount Vigil (the vigil_* rooms), as kinds for
// touches.js (the table is src/data/vigilTouches.js, by room id). Drawn only: none has a body, so
// none can block a climb, a ring, a block, a swing, a gust or a cutscene walk.
//
// Every one of these stands among the props (a `thing` with an `x`), because the rooms round the
// mountain are drawn bent, and only things with an `x` bend with them. Positions are in tiles.
//
//   hare      a snow hare sitting up, one ear that won't stay up. Bolts away when you come near
//             (`min`, `max`: the tiles it may run between) and drops into a drift; comes back later
//   stoat     a stoat in its white coat, black tail tip. Sits up to look, darts home to its den
//             (`to`: the den's tile) when you come near, peeks out of it, comes back later
//   grouse    a snow-coloured grouse: only its eye and tail show. Bursts up with a clatter when
//             you get close and lands again a few tiles off
//   vole      a head in a snow hole that pops up and ducks when you come near
//   iceFish   dark fish under a frozen pool (`x, y` = the pool prop's tile). Scatter from your shadow
//   drip      a bead on an icicle tip that grows, falls and splashes (`fall`: pixels it drops)
//   slide     snow sliding off a ledge's lip down the face every so often, in a puff
//   pineSnow  a clump falling off a pine's boughs, with a puff at the foot
//   spindrift wind-blown snow streaming across a box of the room (`dir`: 1 right, -1 left)
//   sparkle   little sun-glints in the snow (`x, y, w, h`: the box)

const rect = (ctx, color, x, y, w = 1, h = 1) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};
const onScreen = (x, y, pad = 28) => x > -pad && x < W + pad && y > -pad && y < H + pad;

// The way from a world x to the player's, short way round if the room wraps.
function dxTo(scene, wx) {
  let d = scene.player.x + 6 - wx;
  if (scene.room?.wraps) {
    const w = scene.room.pixelWidth;
    d = ((((d + w / 2) % w) + w) % w) - w / 2;
  }
  return d;
}
const distTo = (scene, wx, wy) => Math.hypot(dxTo(scene, wx), scene.player.y + 12 - wy);

// Skittish creatures share one little machine: sit at home; when someone comes near, run (to a den
// or away along the ledge); be gone a while; come back. `cfg` says how each one does it.
function critter(s, cfg) {
  const hx = s.x * T + 8;
  const hy = s.y * T + T - 1;
  const seed = s.x * 13 + s.y * 7 + (cfg.salt ?? 0);
  const st = { mode: 'idle', x: hx, y: hy, face: s.face ?? 1, since: 0, until: 0, tx: hx, last: null, fade: 1, bound: 0, flush: 0 };
  const lo = (s.min ?? s.x - cfg.runTiles) * T + 8;
  const hi = (s.max ?? s.x + cfg.runTiles) * T + 8;
  const denX = s.to ? s.to[0] * T + 8 : null;

  const update = (scene, t) => {
    const dt = st.last === null ? 0 : Math.min(0.1, t - st.last);
    st.last = t;
    const near = (px, py) => distTo(scene, px, py);
    if (st.mode === 'idle') {
      if (near(st.x, st.y) < cfg.scare) {
        const away = dxTo(scene, st.x) > 0 ? -1 : 1;
        let target;
        if (denX !== null) target = denX;
        else {
          target = Math.max(lo, Math.min(hi, st.x + away * cfg.runTiles * T));
          if (Math.abs(target - st.x) < 20) target = Math.max(lo, Math.min(hi, st.x - away * cfg.runTiles * T));
        }
        st.tx = target;
        st.face = target >= st.x ? 1 : -1;
        st.mode = 'run';
        st.since = t;
      }
    } else if (st.mode === 'run') {
      const step = cfg.speed * dt;
      const left = st.tx - st.x;
      if (Math.abs(left) <= step) {
        st.x = st.tx;
        st.mode = 'gone';
        st.since = t;
        st.until = t + cfg.hide[0] + hash(seed + Math.floor(t)) * (cfg.hide[1] - cfg.hide[0]);
        st.puff = t;
      } else {
        st.x += Math.sign(left) * step;
        st.bound += dt * cfg.hopRate;
      }
    } else if (st.mode === 'gone') {
      if (cfg.peek && denX !== null && t > st.until - 4 && t < st.until - 2 && near(st.x, st.y) > 40) st.peeking = true;
      else st.peeking = false;
      if (t > st.until && near(hx, hy) > cfg.scare * 1.6) {
        st.mode = 'back';
        st.since = t;
        st.x = hx;
        st.y = hy;
        st.face = s.face ?? 1;
        st.peeking = false;
      }
    } else if (st.mode === 'back') {
      st.fade = Math.min(1, (t - st.since) / 0.7);
      if (st.fade >= 1) { st.mode = 'idle'; st.fade = 1; }
    }
  };
  return { st, update, hx, hy, denX, seed };
}

// --- Drawing helpers: a sprite described by dots, flipped by `f` (1 right, -1 left) about x. ---
const mirror = (ctx, x, y, f) => (dx, dy, w, h, c) => rect(ctx, c, f > 0 ? x + dx : x - dx - w + 1, y + dy, w, h);

function drawHare(ctx, x, y, f, pose, t, alpha = 1) {
  // pose: 'sit' (ears up, nose twitching), 'run' (stretched, in the air)
  const P = mirror(ctx, x, y, f);
  ctx.globalAlpha = alpha;
  const W0 = '#f4f7fb', W1 = '#d2dceb', W2 = '#a8b8d2', K = '#232834', EAR = '#b9a99a';
  if (pose === 'sit') {
    const twitch = Math.floor(t * 3) % 7 === 0 ? 1 : 0;
    // Body, hind foot, tail puff.
    P(-6, -6, 9, 6, W0); P(-5, -7, 7, 1, W0); P(-6, -1, 10, 1, W2); P(-7, -4, 2, 3, W0); P(-7, -2, 1, 1, W1);
    P(2, -2, 5, 2, W1); P(2, -1, 5, 1, W2);
    // Head, and its snout.
    P(2, -9, 5, 4, W0); P(6, -8, 2, 2, W0); P(8, -7, 1, 1, '#d88a8a'); P(5, -8, 1, 1, K);
    // Ears: one straight up, one that won't stay up.
    P(3, -14, 2, 6, W0); P(3, -14, 2, 1, K); P(4, -13, 1, 4, EAR);
    P(5 + twitch, -11, 3, 2, W1); P(8 + twitch, -10, 1, 2, K);
    // The outline: dark under the belly and round the back.
    P(-7, -5, 1, 2, K); P(-6, 0, 11, 1, K);
  } else {
    // Stretched in a bound.
    P(-8, -6, 12, 4, W0); P(-8, -7, 4, 1, W1); P(-9, -5, 2, 2, W0); P(-6, -2, 9, 1, W2);
    P(-10, -2, 4, 2, W1); P(4, -6, 4, 3, W0); P(8, -5, 2, 1, W0); P(9, -4, 1, 1, '#d88a8a'); P(6, -6, 1, 1, K);
    P(3, -9, 2, 3, W0); P(3, -9, 2, 1, K); P(5, -8, 3, 1, W1);
    P(5, -2, 4, 1, W1); P(-3, -1, 2, 1, W1);
  }
  ctx.globalAlpha = 1;
}

function drawStoat(ctx, x, y, f, pose, t, alpha = 1, peek = false) {
  const P = mirror(ctx, x, y, f);
  ctx.globalAlpha = alpha;
  const W0 = '#f6f8fb', W1 = '#d6dfec', W2 = '#a4b4cc', K = '#171b26', BR = '#8a6a4a';
  if (peek) {
    // Just a head and the top of the neck out of the den, looking about.
    const look = Math.round(Math.sin(t * 2.2));
    P(-3 + look, -7, 6, 5, W0); P(-3 + look, -3, 6, 1, W1);
    P(-3 + look, -9, 2, 2, W0); P(1 + look, -9, 2, 2, W0); P(-3 + look, -9, 1, 1, K);
    P(0 + look, -6, 1, 1, K); P(2 + look, -4, 1, 1, '#d88a8a');
    ctx.globalAlpha = 1;
    return;
  }
  if (pose === 'sit') {
    // Up on its hind legs, front paws tucked, tail curled round the foot.
    const turn = Math.floor(t * 0.9) % 3 === 0 ? 1 : 0;
    P(-3, -12, 6, 12, W0); P(-3, -2, 6, 2, W1); P(-4, -8, 1, 6, W1); P(-3, -12, 6, 1, W1);
    P(-3, -15, 2, 2, W0); P(1, -15, 2, 2, W0); P(-2, -14, 1, 1, K);
    P(-3, -14, 6, 3, W0); P(1 + turn, -13, 1, 1, K); P(3 + turn, -12, 1, 1, '#d88a8a'); P(2, -11, 2, 1, W1);
    P(-5, -1, 4, 1, W0); P(-8, -2, 4, 2, W0); P(-9, -3, 2, 2, K);
    P(0, -7, 2, 3, W1);
    // A little brown at the nose, as a stoat in white still has.
    P(3, -12, 1, 1, BR);
  } else {
    // Stretched out, rippling.
    const wave = Math.round(Math.sin(t * 22));
    P(-7, -4 + wave, 11, 3, W0); P(-7, -2 + wave, 11, 1, W1);
    P(4, -5 + wave, 4, 3, W0); P(8, -4 + wave, 1, 1, '#d88a8a'); P(6, -5 + wave, 1, 1, K);
    P(4, -7 + wave, 1, 2, W0); P(7, -7 + wave, 1, 2, W0);
    P(-13, -3 - wave, 6, 1, W0); P(-16, -3 - wave, 3, 2, K);
    P(-4, -1, 1, 1, W2); P(2, -1 - wave, 1, 1, W2);
  }
  ctx.globalAlpha = 1;
}

function drawGrouse(ctx, x, y, f, pose, t, alpha = 1) {
  const P = mirror(ctx, x, y, f);
  ctx.globalAlpha = alpha;
  const W0 = '#f4f7fb', W1 = '#dbe5f1', W2 = '#b5c4dc', K = '#171b26';
  if (pose === 'sit') {
    const peck = Math.floor(t * 1.7) % 5 === 0 ? 2 : 0;
    P(-4, -6, 9, 6, W0); P(-4, -1, 9, 1, W2); P(-5, -5, 1, 3, W1);
    P(3, -9 + peck, 4, 4, W0); P(5, -8 + peck, 1, 1, K); P(7, -7 + peck, 2, 1, '#2a2620'); P(4, -9 + peck, 2, 1, '#c8423a');
    P(-6, -4, 2, 2, K); P(-6, -3, 1, 1, K);
    P(-3, 0, 2, 1, W1); P(1, 0, 2, 1, W1);
  } else {
    // Flying: wings up and down, tail fanned (black edge).
    const up = Math.sin(t * 28) > 0;
    P(-4, -4, 9, 4, W0); P(-4, -1, 8, 1, W2); P(5, -5, 3, 3, W0); P(7, -4, 2, 1, '#2a2620'); P(6, -5, 1, 1, K);
    P(-7, -3, 3, 2, K);
    if (up) { P(-3, -9, 6, 5, W1); P(-1, -10, 3, 1, W0); } else { P(-3, 0, 6, 4, W1); P(-1, 4, 3, 1, W2); }
  }
  ctx.globalAlpha = 1;
}

// A puff of snow dust at the foot of a bolt-hole: fades over ~0.8 s.
function puff(ctx, sx, sy, age, size = 1) {
  if (age < 0 || age > 0.9) return;
  const a = 1 - age / 0.9;
  for (let i = 0; i < 9; i++) {
    const ang = i * 0.7 + hash(i + Math.floor(sx)) * 2;
    const r = (3 + age * 14) * size * (0.5 + hash(i + 3) * 0.7);
    ctx.globalAlpha = 0.8 * a;
    rect(ctx, i % 2 ? '#ffffff' : '#d3e0ee', sx + Math.cos(ang) * r, sy - 2 - Math.abs(Math.sin(ang)) * r * 0.7 - age * 4, 2, 2);
  }
  ctx.globalAlpha = 1;
}

const hare = (s) => {
  const c = critter(s, { scare: 56, runTiles: 7, speed: 118, hide: [10, 18], hopRate: 3.2, salt: 11 });
  const { st } = c;
  return {
    thing: {
      x: c.hx,
      get sortY() { return st.y; },
      draw(ctx, cam, t) {
        c.update(s.scene, t);
        const sx = st.x - cam.x;
        const sy = st.y - cam.y;
        if (!onScreen(sx, sy, 40)) return;
        if (st.mode === 'gone') { puff(ctx, st.x - cam.x, st.y - cam.y, t - st.puff, 1); return; }
        if (st.mode === 'run') {
          const hop = Math.abs(Math.sin(st.bound * Math.PI)) * 5;
          if (t - st.since < 0.15) puff(ctx, st.x - cam.x - st.face * 6, sy, (t - st.since) * 3, 0.5);
          drawHare(ctx, sx, sy - hop, st.face, 'run', t);
          return;
        }
        if (st.mode === 'back') { puff(ctx, sx, sy, (t - st.since) * 1.1, 0.7); drawHare(ctx, sx, sy, st.face, 'sit', t, st.fade); return; }
        drawHare(ctx, sx, sy, st.face, 'sit', t);
      },
    },
  };
};

const stoat = (s) => {
  const c = critter(s, { scare: 44, runTiles: 6, speed: 150, hide: [8, 14], hopRate: 4, peek: true, salt: 5 });
  const { st } = c;
  return {
    thing: {
      x: c.hx,
      get sortY() { return st.mode === 'gone' ? (c.denX === null ? st.y : s.y * T + T - 1) : st.y; },
      draw(ctx, cam, t) {
        c.update(s.scene, t);
        const sx = st.x - cam.x;
        const sy = st.y - cam.y;
        if (!onScreen(sx, sy, 40)) return;
        if (st.mode === 'gone') {
          if (st.peeking) drawStoat(ctx, sx, sy, st.face, 'sit', t, 1, true);
          else puff(ctx, sx, sy, t - st.puff, 0.7);
          return;
        }
        if (st.mode === 'run') { drawStoat(ctx, sx, sy - Math.abs(Math.sin(st.bound * Math.PI)) * 1.5, st.face, 'run', t); return; }
        if (st.mode === 'back') { puff(ctx, sx, sy, (t - st.since) * 1.1, 0.6); drawStoat(ctx, sx, sy, st.face, 'sit', t, st.fade); return; }
        drawStoat(ctx, sx, sy, st.face, 'sit', t);
      },
    },
  };
};

const grouse = (s) => {
  const hx = s.x * T + 8;
  const hy = s.y * T + T - 1;
  const lo = (s.min ?? s.x - 6) * T + 8;
  const hi = (s.max ?? s.x + 6) * T + 8;
  const st = { x: hx, y: hy, mode: 'idle', since: 0, from: hx, to: hx, face: s.face ?? 1, last: null };
  return {
    thing: {
      x: hx,
      get sortY() { return st.mode === 'fly' ? st.y + 30 : st.y; },
      draw(ctx, cam, t) {
        const scene = s.scene;
        if (st.mode === 'idle' && distTo(scene, st.x, st.y) < 28) {
          const away = dxTo(scene, st.x) > 0 ? -1 : 1;
          let target = Math.max(lo, Math.min(hi, st.x + away * (5 + hash(Math.floor(t)) * 3) * T));
          if (Math.abs(target - st.x) < 24) target = Math.max(lo, Math.min(hi, st.x - away * 6 * T));
          st.mode = 'fly'; st.since = t; st.from = st.x; st.to = target; st.face = target >= st.x ? 1 : -1;
        }
        let sx = st.x - cam.x, sy = st.y - cam.y;
        if (st.mode === 'fly') {
          const u = Math.min(1, (t - st.since) / 1.1);
          st.x = st.from + (st.to - st.from) * u;
          sx = st.x - cam.x;
          sy = st.y - cam.y - Math.sin(u * Math.PI) * 22;
          if (u >= 1) { st.mode = 'rest'; st.since = t; }
          if (onScreen(sx, sy, 30)) {
            // A scatter of snow where it went up.
            puff(ctx, st.from - cam.x, st.y - cam.y, t - st.since, 0.8);
            drawGrouse(ctx, sx, sy, st.face, 'fly', t);
          }
          return;
        }
        if (st.mode === 'rest') {
          // Sat down again, but not startled for a bit.
          if (t - st.since > 5) st.mode = 'idle';
        }
        if (!onScreen(sx, sy, 30)) return;
        drawGrouse(ctx, sx, sy, st.face, 'sit', t);
      },
    },
  };
};

const vole = (s) => {
  const hx = s.x * T + 8;
  const hy = s.y * T + T - 4;
  const seed = s.x * 17 + s.y * 3;
  return {
    thing: {
      x: hx,
      sortY: hy + 1,
      draw(ctx, cam, t) {
        const sx = hx - cam.x;
        const sy = hy - cam.y;
        if (!onScreen(sx, sy)) return;
        const cycle = 7 + hash(seed) * 4;
        const u = ((t + hash(seed + 2) * cycle) % cycle) / cycle;
        const near = distTo(s.scene, hx, hy) < 34;
        // Up for the middle of each cycle, quick to go back down when someone comes.
        const up = !near && u > 0.3 && u < 0.62;
        const rise = up ? Math.min(1, Math.min(u - 0.3, 0.62 - u) * 12) : 0;
        if (rise > 0) {
          const h = Math.round(5 * rise);
          rect(ctx, '#7a6a5a', sx - 2, sy - h, 5, h);
          rect(ctx, '#9a8a78', sx - 2, sy - h, 5, 1);
          rect(ctx, '#171b26', sx + 1, sy - h + 1, 1, 1);
          rect(ctx, '#d88a8a', sx + 2, sy - h + 2, 1, 1);
          rect(ctx, '#5a4a3c', sx - 3, sy - h, 1, 2); rect(ctx, '#5a4a3c', sx + 3, sy - h, 1, 2);
          if (Math.floor(t * 6) % 3 === 0) rect(ctx, '#ffffff', sx + 3, sy - h + 2, 2, 1);
        }
        if (rise > 0.9 && u < 0.34) puff(ctx, sx, sy, (u - 0.3) * 8, 0.4);
      },
    },
  };
};

// Fish under a frozen pool: shadows with tails that wander, then scatter from the player's shadow.
const iceFish = (s) => {
  // `x, y` is the pool prop's tile; or give the middle (`cx, cy`) and half sizes (`rx, ry`) in tiles.
  const cx = s.cx !== undefined ? s.cx * T : s.x * T + 15;
  const cy = s.cy !== undefined ? s.cy * T : s.y * T + 6;
  const RX = s.rx ? s.rx * T : 8;
  const RY = s.ry ? s.ry * T : 2.2;
  const n = s.n ?? 4;
  const fish = Array.from({ length: n }, (_, i) => ({ ang: hash(i + s.x) * 6.28, len: 5 + Math.floor(hash(i + 5) * 3), r: 0.45 + hash(i + 8) * 0.5, spd: 0.25 + hash(i + 2) * 0.3, flee: 0 }));
  return {
    thing: {
      x: cx,
      sortY: (s.cy !== undefined ? s.cy * T : s.y * T) - 1e6 + 6,
      draw(ctx, cam, t) {
        const sx = cx - cam.x;
        const sy = cy - cam.y;
        if (!onScreen(sx, sy, 24)) return;
        const d = distTo(s.scene, cx, cy);
        fish.forEach((f, i) => {
          const scare = d < 46 ? 1 : 0;
          f.flee += ((scare ? 1 : 0) - f.flee) * 0.06;
          const a = t * f.spd + f.ang;
          let x = Math.cos(a) * RX * f.r;
          let y = Math.sin(a * 1.3 + i) * RY * f.r;
          // Away from the player's side of the pool.
          const side = dxTo(s.scene, cx) > 0 ? -1 : 1;
          x += side * (RX * 0.6) * f.flee;
          const heading = -Math.sin(a) * f.r * 8 + side * f.flee * 4 >= 0 ? 1 : -1;
          const wag = Math.round(Math.sin(t * (f.flee > 0.4 ? 14 : 4) + i * 2));
          ctx.globalAlpha = 0.55;
          const P = mirror(ctx, sx + x, sy + y, heading);
          P(-f.len, 0 + wag, 2, 1, '#0f1d2e'); P(-f.len + 2, 0, f.len - 2, 2, '#13233a'); P(0, 0, 2, 1, '#13233a');
          P(-f.len + 1, wag > 0 ? -1 : 1, 1, 1, '#0f1d2e');
          ctx.globalAlpha = 1;
        });
        // Now and then a bubble comes up under the ice and stays there, silver.
        const b = (t * 0.3) % 5;
        if (b < 3 && d > 50) {
          const bx = sx + Math.round(hash(Math.floor(t * 0.3 / 5)) * 10 - 5);
          ctx.globalAlpha = 0.6;
          rect(ctx, '#eaf8ff', bx, sy - 1, 1, 1); rect(ctx, '#cbe8fa', bx + 1, sy, 1, 1);
          ctx.globalAlpha = 1;
        }
      },
    },
  };
};

// A drip: gather at the tip, let go, fall, splash.
const drip = (s) => {
  const tipX = s.x * T;
  const tipY = s.y * T;
  const seed = s.x * 7 + s.y * 5;
  const period = s.every ?? 3.2 + hash(seed) * 2;
  return {
    thing: {
      x: tipX,
      sortY: tipY + (s.fall ?? 14) + 2,
      draw(ctx, cam, t) {
        const sx = tipX - cam.x;
        const sy = tipY - cam.y;
        if (!onScreen(sx, sy)) return;
        const u = ((t + hash(seed + 1) * period) % period) / period;
        const fall = s.fall ?? 14;
        if (u < 0.5) {
          // Gathering: a bead swelling at the tip.
          const grow = u / 0.5;
          if (grow > 0.2) {
            rect(ctx, '#9bcbee', sx, sy + Math.round(grow * 1.5), 1, 1 + (grow > 0.7 ? 1 : 0));
            rect(ctx, '#eaf8ff', sx, sy + Math.round(grow * 1.5), 1, 1);
          }
        } else if (u < 0.5 + fall / 90) {
          const k = (u - 0.5) / (fall / 90);
          const y = sy + 2 + k * k * fall;
          rect(ctx, '#cbe8fa', sx, y, 1, 2);
        } else if (s.splash !== false && u < 0.5 + fall / 90 + 0.18) {
          const k = (u - 0.5 - fall / 90) / 0.18;
          const y = sy + 2 + fall;
          ctx.globalAlpha = 1 - k;
          rect(ctx, '#d3e0ee', sx - 1 - k * 2, y - k * 2, 1, 1);
          rect(ctx, '#d3e0ee', sx + 1 + k * 2, y - k * 2, 1, 1);
          rect(ctx, '#aebfd8', sx - 1 - k, y + 1, 3 + k * 2, 1);
          ctx.globalAlpha = 1;
        }
      },
    },
  };
};

// Snow sliding off a lip of rock: a sheet shifts, falls down the face in a spray, puffs at the foot.
const slide = (s) => {
  const x0 = s.x * T;
  const y0 = s.y * T;
  const wide = (s.w ?? 2) * T;
  const drop = s.drop ?? 28;
  const seed = s.x * 11 + s.y;
  const period = s.every ?? 22 + hash(seed) * 18;
  return {
    thing: {
      x: x0 + wide / 2,
      sortY: y0 + drop + 3,
      draw(ctx, cam, t) {
        const sx = x0 - cam.x;
        const sy = y0 - cam.y;
        if (!onScreen(sx + wide / 2, sy, 40)) return;
        const u = (((t + hash(seed + 4) * period) % period)) / period;
        const dur = 1.6 / period;
        if (u > dur + 0.12) return;
        if (u <= dur) {
          const k = u / dur;
          // The slab: breaks at the lip, runs down, thins out into powder.
          const n = 6 + Math.floor(wide / 6);
          for (let i = 0; i < n; i++) {
            const px = sx + (i / n) * wide + hash(i + seed) * 3;
            const delay = hash(i + 2 + seed) * 0.35;
            const kk = Math.max(0, Math.min(1, (k - delay) / (1 - delay)));
            if (kk <= 0) { if (k > 0.03) rect(ctx, '#ffffff', px, sy - 1, 3, 2); continue; }
            const y = sy + kk * kk * drop;
            ctx.globalAlpha = 1 - kk * 0.5;
            rect(ctx, '#ffffff', px, y, 3, 2);
            rect(ctx, '#d3e0ee', px + 1, y - 2, 1, 2);
            rect(ctx, '#ffffff', px - 1 + (i % 2) * 3, y - 4, 1, 1);
            ctx.globalAlpha = 1;
          }
        } else {
          // The puff at the bottom.
          puff(ctx, sx + wide / 2, sy + drop + 3, (u - dur) / 0.12 * 0.9, wide / 24 + 0.8);
        }
      },
    },
  };
};

const pineSnow = (s) => {
  const x0 = s.x * T + 8;
  const y0 = s.y * T + T;
  const seed = s.x * 19 + s.y * 3;
  const period = s.every ?? 16 + hash(seed) * 14;
  return {
    thing: {
      x: x0,
      sortY: y0 + 1,
      draw(ctx, cam, t) {
        const sx = x0 - cam.x;
        const sy = y0 - cam.y;
        if (!onScreen(sx, sy, 24)) return;
        const u = ((t + hash(seed) * period) % period);
        if (u > 1.7) return;
        const bx = sx + (hash(seed + 2) > 0.5 ? 6 : -6);
        const by = sy - 22 + Math.floor(hash(seed + 3) * 8);
        if (u < 1.0) {
          // The bough gives, a clump drops, breaking up.
          const k = u / 1.0;
          const y = by + k * k * (sy - by - 2);
          rect(ctx, '#ffffff', bx - 1, y, 3, 2);
          rect(ctx, '#d3e0ee', bx, y + 2, 2, 1);
          if (k > 0.4) { ctx.globalAlpha = 0.7; rect(ctx, '#ffffff', bx + 2, y - 3, 1, 1); rect(ctx, '#ffffff', bx - 3, y - 2, 1, 1); ctx.globalAlpha = 1; }
          // The bough springs back.
          if (k < 0.5) rect(ctx, '#2f5a3a', bx - 3 + Math.round(Math.sin(t * 25) * 1), by + 2, 3, 1);
        } else {
          puff(ctx, bx, sy - 1, (u - 1.0) / 0.7 * 0.9, 0.9);
        }
      },
    },
  };
};

// Wind-blown snow: streaks racing across a box, thicker in the gusts.
const spindrift = (s) => {
  const bx = s.x * T;
  const by = s.y * T;
  const bw = s.w * T;
  const bh = s.h * T;
  const n = s.n ?? 10;
  const dir = s.dir ?? 1;
  return {
    thing: {
      x: bx + bw / 2,
      sortY: 1e7,
      draw(ctx, cam, t) {
        const sx = bx - cam.x;
        const sy = by - cam.y;
        if (!onScreen(sx + bw / 2, sy + bh / 2, bw / 2 + 40)) return;
        const gust = 0.55 + 0.45 * Math.sin(t * 0.37 + bx * 0.01) * Math.sin(t * 0.91 + 1.3);
        const speed = 55 + 60 * Math.max(0, gust);
        for (let i = 0; i < n; i++) {
          const lane = hash(i + bx) ;
          const phase = hash(i * 3 + 7 + by);
          const run = (t * speed * (0.8 + lane * 0.5) * 0.01 + phase * 3) % 1;
          const len = 5 + Math.floor(lane * 8) * (0.6 + gust * 0.7);
          const x = dir > 0 ? sx - len + run * (bw + len * 2) : sx + bw + len - run * (bw + len * 2);
          const y = sy + hash(i * 5 + 1 + bx) * bh + Math.sin(t * 2 + i) * 1.2;
          const a = (0.2 + 0.5 * gust) * Math.sin(run * Math.PI);
          if (a <= 0.02) continue;
          ctx.globalAlpha = a;
          rect(ctx, '#ffffff', dir > 0 ? x : x - len, y, len, 1);
          ctx.globalAlpha = a * 0.5;
          rect(ctx, '#d3e0ee', dir > 0 ? x - 3 : x - len + 3, y + 1, Math.max(2, len - 3), 1);
          ctx.globalAlpha = 1;
        }
      },
    },
  };
};

const sparkle = (s) => {
  const bx = s.x * T;
  const by = s.y * T;
  const n = s.n ?? 10;
  return {
    thing: {
      x: bx + (s.w * T) / 2,
      sortY: -1e6 + by,
      draw(ctx, cam, t) {
        const sx = bx - cam.x;
        const sy = by - cam.y;
        if (!onScreen(sx + (s.w * T) / 2, sy + (s.h * T) / 2, (s.w * T) / 2 + 30)) return;
        for (let i = 0; i < n; i++) {
          const k = (t * 0.55 + hash(i + bx) * 7) % 1;
          if (k > 0.22) continue;
          const a = Math.sin((k / 0.22) * Math.PI);
          const cell = Math.floor(t * 0.55 + hash(i + bx) * 7);
          const x = sx + fract(hash(i * 3 + cell) * 97) * s.w * T;
          const y = sy + fract(hash(i * 5 + cell + 2) * 53) * s.h * T;
          ctx.globalAlpha = a;
          rect(ctx, '#ffffff', x, y, 1, 1);
          if (a > 0.6) { rect(ctx, '#ffffff', x - 1, y, 3, 1); rect(ctx, '#ffffff', x, y - 1, 1, 3); }
          ctx.globalAlpha = 1;
        }
      },
    },
  };
};

export const VIGIL_KINDS = { hare, stoat, grouse, vole, iceFish, drip, slide, pineSnow, spindrift, sparkle };
