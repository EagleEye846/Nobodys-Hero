import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, TILE_SIZE as T } from '../config.js';
import { sfx } from '../audio/music.js';
import { stormy } from './coastTouches.js';

// ISLE TOUCHES: the living extras of the Beacon Isles, the Last Light and the Reach (the life pass of
// 2026-11-14), as kinds for touches.js. The same rules as every touch: drawn only, no bodies, so nothing
// here can block a walk, a swing, a landing or a cutscene. Where they go is a table in
// src/data/islesTouches.js, by room id. Positions are in tiles.
//
//   gannets    a ledge of nesting gannets: they sit hunched, preen and gawp, and go up in a flurry when you
//              come near, wheeling off and settling back on the same ledge once you've gone
//   puffin     a puffin by its burrow in the turf: it pops up, bobs, and drops back in when you come near
//   seal       a seal hauled out on a rock: it breathes, lifts its head to look at you, and slides into the
//              sea if you come close, popping up again a while later
//   cormorant  a cormorant on a rock with its wings held out to dry; it goes off when you come near
//   kelp       strands of weed swaying under the water
//   burst      a wave bursting on a rock now and then, throwing spray (bigger in the storm)
//   cloudshade the shadows of clouds drifting over the ground (the big sky)
//   gullring   a few gulls wheeling high over a place
//   buoy       a bell buoy riding the swell, tilting
//   windsock   a windsock on its post, flying straight out (flat in the storm)
//   moth       a moth fluttering round a lantern in an indoor room
//
// Every one that stands on something draws its own ledge, burrow or post.

const fract = (x) => x - Math.floor(x);
const hash = (n) => fract(Math.sin(n * 91.7 + 17.3) * 43758.5453);
const rect = (ctx, color, x, y, w = 1, h = 1) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};
const onScreen = (x, y, pad = 24) => x > -pad && x < W + pad && y > -pad && y < H + pad;
const feetOf = (scene) => ({ x: scene.player.x + 6, y: scene.player.y + 12 });
const nearest = (scene, px, py) => {
  const f = feetOf(scene);
  let d = Math.hypot(f.x - px, f.y - py);
  for (const o of scene.followers ?? []) if (!o.hidden) d = Math.min(d, Math.hypot(o.x + 6 - px, o.y + 12 - py));
  return d;
};

// ---- Birds that fly off (gannets, cormorants) ----

// One bird with a place to sit: 'sit', then 'off' (flapping away along an arc), 'away', then 'back'.
function makePerch(seed, x, y, face) {
  return { seed, x, y, face, mode: 'sit', t0: 0, until: 0, dir: 1, lag: hash(seed) * 0.5 };
}

function stepPerch(b, s, t, scare, onFlush) {
  const d = nearest(s.scene, b.x, b.y);
  if (b.mode === 'sit' && d < scare - b.lag * 8) {
    b.mode = 'off';
    b.t0 = t + b.lag;
    b.dir = feetOf(s.scene).x > b.x ? -1 : 1;
    onFlush?.();
  } else if (b.mode === 'off' && t - b.t0 > 2.6) {
    b.mode = 'away';
    b.until = t + 14 + hash(b.seed + b.t0) * 14;
  } else if (b.mode === 'away' && t > b.until && d > 80) {
    b.mode = 'back';
    b.t0 = t + b.lag * 0.6;
  } else if (b.mode === 'back' && t - b.t0 > 3) {
    b.mode = 'sit';
  }
}

// A bird in the air, side on, wings flapping (`flap` -1..1), facing f.
function flyingBird(ctx, x, y, f, flap, big, tip) {
  const w = big ? 3 : 2;
  rect(ctx, '#eef0ee', x - 2, y, 5, 2);
  rect(ctx, f > 0 ? '#e8d890' : '#e8d890', f > 0 ? x + 3 : x - 4, y - 1, 1, 2);
  rect(ctx, '#7c8a94', f > 0 ? x + 4 : x - 5, y, 2, 1);
  const up = flap > 0.3 ? 1 : flap < -0.3 ? -1 : 0;
  for (let k = 1; k <= w * 2; k++) {
    const wy = y - 1 - (up > 0 ? k * 0.7 : up < 0 ? -k * 0.3 : 0);
    const col = k > w * 2 - 2 ? tip : '#d0d4d4';
    rect(ctx, col, x - 1 - k, wy + (up < 0 ? 1 : 0), 1, 1);
    rect(ctx, col, x + 1 + k, wy + (up < 0 ? 1 : 0), 1, 1);
  }
}

// The arc a bird takes leaving or arriving: up and out over the water.
function arc(b, u) {
  return [b.x + b.dir * u * 120, b.y - 4 - u * 64 - Math.sin(u * Math.PI) * 8];
}

// ---- Gannets ----

function gannetSit(ctx, x, y, f, t, seed, state) {
  const preen = state === 0 && fract(t * 0.13 + hash(seed)) < 0.12;
  const gape = state === 1;
  const sx = (lx, w) => (f > 0 ? x + lx : x - lx - w + 1);
  // Tail, body, folded wing with black tip, chest.
  rect(ctx, '#d4d8d8', sx(-1, 3), y - 4, 3, 3);
  rect(ctx, '#f2f2ee', sx(0, 6), y - 6, 6, 5);
  rect(ctx, '#f2f2ee', sx(1, 5), y - 7, 5, 1);
  rect(ctx, '#2a2a30', sx(0, 3), y - 4, 3, 2);
  rect(ctx, '#c8ccd0', sx(2, 3), y - 3, 3, 1);
  // Head with its buff crown, the blue-grey beak, the pale ringed eye.
  const hy = preen ? y - 7 : y - 10;
  rect(ctx, '#f6f0e0', sx(5, 3), hy, 3, 4);
  rect(ctx, '#e8cc78', sx(5, 3), hy, 3, 1);
  rect(ctx, '#7c8a94', sx(8, 3), hy + 2, 3, 1);
  if (gape) rect(ctx, '#7c8a94', sx(8, 3), hy + 3, 2, 1);
  rect(ctx, '#2a2a30', sx(6, 1), hy + 1, 1, 1);
  rect(ctx, '#4a5a64', sx(2, 1), y - 1, 1, 1);
  rect(ctx, '#4a5a64', sx(4, 1), y - 1, 1, 1);
}

function gannets(s) {
  const n = s.n ?? 3;
  const base = s.x * T;
  const y = s.y * T + 14;
  const birds = Array.from({ length: n }, (_, i) => makePerch(s.x * 13 + s.y * 7 + i * 5, base + 5 + i * 10, y, (s.face ?? 1) * (i % 3 === 2 ? -1 : 1)));
  return {
    floor(ctx, cam) {
      const x = base - cam.x;
      const yy = y - cam.y;
      if (!onScreen(x, yy, 60)) return;
      // Their ledge: a heap of weed and feathers, white-streaked where they've been.
      rect(ctx, 'rgba(0,0,0,0.2)', x - 1, yy, n * 10 + 5, 2);
      rect(ctx, '#3a4a30', x, yy - 2, n * 10 + 3, 3);
      rect(ctx, '#56683e', x + 1, yy - 3, n * 10, 2);
      for (let i = 0; i < n * 3; i++) rect(ctx, '#e8e8e0', x + 2 + Math.floor(hash(i + s.x) * n * 10), yy - 3 + (i % 3), 1, 1);
      rect(ctx, '#e8e8e0', x + 4, yy + 1, 1, 3);
      rect(ctx, '#e8e8e0', x + n * 10 - 3, yy + 1, 1, 2);
    },
    thing: {
      sortY: y + 6,
      draw(ctx, cam, t) {
        for (const [i, b] of birds.entries()) {
          stepPerch(b, s, t, s.scare ?? 46, () => { if (i === 0 && onScreen(b.x - cam.x, b.y - cam.y, 0)) sfx('flutter'); });
          const px = b.x - cam.x;
          const py = b.y - cam.y;
          if (b.mode === 'sit') {
            if (onScreen(px, py)) gannetSit(ctx, px, py, b.face, t, b.seed, fract(t * 0.07 + hash(b.seed + 3)) < 0.1 ? 1 : 0);
            continue;
          }
          if (b.mode === 'away') continue;
          const k = Math.max(0, Math.min(1, (t - b.t0) / (b.mode === 'off' ? 2.6 : 3)));
          const [gx, gy] = arc(b, b.mode === 'off' ? k * k : 1 - k * (2 - k));
          if (b.mode === 'off' && t < b.t0) { gannetSit(ctx, px, py, b.face, t, b.seed, 1); continue; }
          if (b.mode === 'back' && t < b.t0) continue;
          const fx = gx - cam.x;
          const fy = gy - cam.y;
          if (!onScreen(fx, fy)) continue;
          const flapping = b.mode === 'off' || k > 0.8;
          flyingBird(ctx, fx, fy, b.mode === 'off' ? b.dir : -b.dir, flapping ? Math.sin(t * 20 + b.seed) : 1, true, '#2a2a30');
          if (b.mode === 'back' && k > 0.94) gannetSit(ctx, px, py, b.face, t, b.seed, 0);
        }
      },
    },
  };
}

// ---- Cormorant ----

function cormorant(s) {
  const b = makePerch(s.x * 17 + s.y * 3, s.x * T + 8, s.y * T + 14, s.face ?? 1);
  return {
    thing: {
      sortY: b.y + 4,
      draw(ctx, cam, t) {
        stepPerch(b, s, t, s.scare ?? 44, () => { if (onScreen(b.x - cam.x, b.y - cam.y, 0)) sfx('flutter'); });
        const x = b.x - cam.x;
        const y = b.y - cam.y;
        if (b.mode === 'sit') {
          if (!onScreen(x, y)) return;
          const f = b.face;
          const m = (lx, w) => (f > 0 ? x + lx : x - lx - w + 1);
          // Wings held out to dry, a slow shiver now and then.
          const shiver = fract(t * 0.2 + hash(b.seed)) < 0.06 ? 1 : 0;
          rect(ctx, '#161a1c', m(-6 - shiver, 6), y - 9, 6, 2);
          rect(ctx, '#161a1c', m(6 + shiver, 6), y - 9, 6, 2);
          rect(ctx, '#161a1c', m(-3, 3), y - 7, 3, 2);
          rect(ctx, '#1e2a2c', m(-1, 6), y - 9, 6, 7);
          rect(ctx, '#3a4a4c', m(0, 2), y - 8, 2, 4);
          rect(ctx, '#161a1c', m(4, 2), y - 13, 2, 5);
          rect(ctx, '#161a1c', m(3, 4), y - 14, 4, 2);
          rect(ctx, '#d8b840', m(7, 3), y - 13, 3, 1);
          rect(ctx, '#d8d0b0', m(6, 1), y - 12, 1, 1);
          rect(ctx, '#161a1c', m(0, 1), y - 2, 1, 2);
          rect(ctx, '#161a1c', m(3, 1), y - 2, 1, 2);
          return;
        }
        if (b.mode === 'away') return;
        const k = Math.max(0, Math.min(1, (t - b.t0) / (b.mode === 'off' ? 2.6 : 3)));
        const [gx, gy] = arc(b, b.mode === 'off' ? k * k : 1 - k * (2 - k));
        const fx = gx - cam.x;
        const fy = gy - cam.y;
        if (!onScreen(fx, fy)) return;
        flyingBird(ctx, fx, fy, b.mode === 'off' ? b.dir : -b.dir, Math.sin(t * 24 + b.seed), false, '#161a1c');
      },
    },
  };
}

// ---- Puffin ----

function puffinBody(ctx, x, y, f, t, fish) {
  const m = (lx, w) => (f > 0 ? x + lx : x - lx - w + 1);
  rect(ctx, '#e8e8e4', m(0, 4), y - 5, 4, 5);
  rect(ctx, '#1c2024', m(-1, 2), y - 6, 2, 5);
  rect(ctx, '#1c2024', m(0, 4), y - 8, 4, 3);
  rect(ctx, '#e8e8e4', m(1, 3), y - 7, 3, 2);
  rect(ctx, '#d86a2a', m(4, 3), y - 7, 3, 2);
  rect(ctx, '#f0c040', m(4, 1), y - 7, 1, 2);
  rect(ctx, '#1c2024', m(2, 1), y - 7, 1, 1);
  rect(ctx, '#e8802a', m(0, 1), y - 1, 1, 1);
  rect(ctx, '#e8802a', m(2, 1), y - 1, 1, 1);
  if (fish) {
    rect(ctx, '#b8c8d0', m(6, 4), y - 7 + Math.round(Math.sin(t * 9)), 4, 1);
    rect(ctx, '#b8c8d0', m(6, 3), y - 6, 3, 1);
  }
}

function puffin(s) {
  const hx = s.x * T + 8;
  const hy = s.y * T + 12;
  const seed = s.x * 3.3 + s.y * 7.1;
  const face = s.face ?? 1;
  return {
    floor(ctx, cam) {
      const x = hx - cam.x;
      const y = hy - cam.y;
      if (!onScreen(x, y)) return;
      rect(ctx, '#5a4a30', x - 5, y - 1, 11, 3);
      rect(ctx, '#2a2218', x - 3, y, 7, 2);
      rect(ctx, '#120e0a', x - 2, y + 1, 5, 1);
      rect(ctx, '#7a9a58', x - 6, y - 2, 3, 1);
      rect(ctx, '#7a9a58', x + 4, y - 2, 3, 1);
    },
    thing: {
      sortY: hy + 3,
      draw(ctx, cam, t) {
        const x = hx - cam.x;
        const y = hy - cam.y;
        if (!onScreen(x, y)) return;
        const d = nearest(s.scene, hx, hy);
        // Down the burrow when you come near; else a cycle: up, bob, a fish, down.
        if (d < (s.scare ?? 40)) return;
        const c = fract(t * 0.09 + hash(seed));
        if (c < 0.22) return;
        if (c < 0.3) {
          // Just the head peeping over the lip.
          rect(ctx, '#1c2024', x - 2, y - 2, 4, 2);
          rect(ctx, '#d86a2a', x + 2 * face, y - 1, 2, 1);
          return;
        }
        const bob = c > 0.5 && c < 0.58 ? Math.round(Math.abs(Math.sin(t * 8))) : 0;
        puffinBody(ctx, x + 6 * face, y + 1 - bob, face, t, c > 0.78);
      },
    },
  };
}

// ---- Seal ----

function seal(s) {
  const sx = s.x * T + 8;
  const sy = s.y * T + 14;
  const seed = s.x * 4.1 + s.y * 1.7;
  const f = s.face ?? 1;
  const hide = { mode: 'on', t0: 0, until: 0 };
  const body = s.color ?? '#7a828a';
  const light = s.light ?? '#a8b0b4';
  const dark = s.dark ?? '#4a5258';
  return {
    floor(ctx, cam) {
      const x = sx - cam.x;
      const y = sy - cam.y;
      if (!onScreen(x, y, 30)) return;
      // The wet dark of the rock where it lies.
      rect(ctx, 'rgba(10,20,26,0.35)', x - 12, y - 1, 24, 4);
    },
    thing: {
      sortY: sy + 2,
      draw(ctx, cam, t) {
        const d = nearest(s.scene, sx, sy);
        if (hide.mode === 'on' && d < (s.scare ?? 40)) {
          hide.mode = 'in';
          hide.t0 = t;
          if (onScreen(sx - cam.x, sy - cam.y, 0)) sfx('splash');
        } else if (hide.mode === 'in' && t - hide.t0 > 1) {
          hide.mode = 'gone';
          hide.until = t + 16 + hash(seed + t) * 12;
        } else if (hide.mode === 'gone' && t > hide.until && d > 60) {
          hide.mode = 'peek';
          hide.t0 = t;
        } else if (hide.mode === 'peek' && t - hide.t0 > 5) {
          hide.mode = 'on';
        }
        const x = sx - cam.x;
        const y = sy - cam.y;
        if (!onScreen(x, y, 30)) return;
        const m = (lx, w) => (f > 0 ? x + lx : x - lx - w + 1);
        if (hide.mode === 'gone') return;
        if (hide.mode === 'peek') {
          // Just a head in the water, looking at you, with a ring round it.
          const bob = Math.round(Math.sin(t * 2));
          rect(ctx, 'rgba(220,240,250,0.4)', x - 4, y + 2, 9, 1);
          rect(ctx, dark, x - 2, y - 2 + bob, 5, 3);
          rect(ctx, body, x - 2, y - 3 + bob, 5, 2);
          rect(ctx, '#0c1014', x - 1, y - 2 + bob, 1, 1);
          rect(ctx, '#0c1014', x + 1, y - 2 + bob, 1, 1);
          return;
        }
        const slide = hide.mode === 'in' ? Math.min(1, (t - hide.t0) / 1) : 0;
        const dip = Math.round(slide * 6);
        const breathe = Math.sin(t * 1.6 + seed) > 0.7 ? 1 : 0;
        const lift = d < 110 && hide.mode === 'on' ? 3 : 0;
        // A long grey body lying on its side, flippers, a tail turned up.
        rect(ctx, body, m(-10, 20), y - 6 + dip - breathe, 20, 6);
        rect(ctx, body, m(-8, 15), y - 8 + dip - breathe, 15, 2);
        rect(ctx, light, m(-8, 14), y - 2 + dip, 14, 2);
        rect(ctx, dark, m(-6, 3), y - 7 + dip, 2, 1);
        rect(ctx, dark, m(0, 3), y - 6 + dip, 2, 1);
        rect(ctx, dark, m(-12, 3), y - 4 + dip, 3, 2);
        rect(ctx, dark, m(-13, 1), y - 6 + dip, 1, 2);
        // The head, up on its chest when it's watching you.
        rect(ctx, body, m(8, 6), y - 9 - lift + dip, 6, 5);
        rect(ctx, light, m(10, 4), y - 6 - lift + dip, 4, 2);
        rect(ctx, '#0c1014', m(12, 1), y - 8 - lift + dip, 1, 1);
        rect(ctx, '#0c1014', m(14, 1), y - 6 - lift + dip, 1, 1);
        rect(ctx, '#e0e4e4', m(11, 1), y - 5 - lift + dip, 1, 1);
        if (slide > 0 && slide < 1) rect(ctx, 'rgba(230,245,250,0.7)', x - 8, y + 1 + dip, 16, 1);
      },
    },
  };
}

// ---- Kelp ----

function kelp(s) {
  const n = s.n ?? 5;
  return {
    floor(ctx, cam, t) {
      for (let i = 0; i < n; i++) {
        const x = (s.x + (i / n) * (s.w ?? 2)) * T + hash(i + s.x) * 6 - cam.x;
        const y = s.y * T + 8 + hash(i * 3 + s.y) * 8 - cam.y;
        if (!onScreen(x, y, 20)) continue;
        const tall = 7 + Math.floor(hash(i + 4) * 7);
        for (let k = 0; k < tall; k++) {
          const sway = Math.round(Math.sin(t * 1.1 + i * 1.7 + k * 0.5) * (k / tall) * 3);
          rect(ctx, k % 3 === 0 ? 'rgba(90,120,50,0.8)' : 'rgba(46,70,38,0.8)', x + sway, y - k, 1, 1);
          if (k % 4 === 2) rect(ctx, 'rgba(120,150,60,0.7)', x + sway + 1, y - k, 1, 1);
        }
      }
    },
  };
}

// ---- A wave bursting on a rock ----

function burst(s) {
  const every = s.every ?? 6.5;
  const seed = s.x * 2.9 + s.y * 5.3;
  return {
    thing: {
      sortY: s.y * T + 14,
      draw(ctx, cam, t) {
        const x = s.x * T + 8 - cam.x;
        const y = s.y * T + 14 - cam.y;
        if (!onScreen(x, y)) return;
        const c = fract(t / every + hash(seed));
        if (c > 0.22) return;
        const u = c / 0.22;
        const big = stormy(s) ? 1.5 : 1;
        // A fan of drops going up and out, then falling, and a skirt of foam at the foot.
        for (let i = 0; i < 11; i++) {
          const a = -Math.PI / 2 + (hash(i + seed) - 0.5) * 2.2;
          const sp = (10 + hash(i * 3 + seed) * 16) * big;
          const px = x + Math.cos(a) * sp * u;
          const py = y - 2 + Math.sin(a) * sp * u + u * u * 22 * big;
          rect(ctx, `rgba(232,244,248,${(0.9 * (1 - u * u)).toFixed(2)})`, px, py, i % 3 === 0 ? 2 : 1, 1);
        }
        rect(ctx, `rgba(232,244,248,${(0.7 * (1 - u)).toFixed(2)})`, x - 7 * big - u * 3, y, 14 * big + u * 6, 2);
      },
    },
  };
}

// ---- Cloud shadows ----

function cloudshade(s) {
  const n = s.n ?? 3;
  const alpha = s.alpha ?? 0.1;
  return {
    over(ctx, cam, t) {
      const span = (s.span ?? 60) * T;
      ctx.save();
      for (let i = 0; i < n; i++) {
        const w = 90 + hash(i + 2) * 120;
        const h = 28 + hash(i + 7) * 26;
        const wx = ((t * (s.speed ?? 7) + hash(i) * span) % (span + w * 2)) - w;
        const wy = (s.band ?? 3) * T + hash(i + 11) * (s.bandh ?? 12) * T;
        const x = wx - cam.x;
        const y = wy - cam.y;
        if (x < -w - 20 || x > W + w + 20 || y < -h - 20 || y > H + h + 20) continue;
        for (let k = 0; k < 3; k++) {
          ctx.fillStyle = `rgba(6,14,20,${alpha / 2})`;
          ctx.beginPath();
          ctx.ellipse(Math.round(x), Math.round(y), (w / 2) * (1 - k * 0.2), (h / 2) * (1 - k * 0.2), 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    },
  };
}

// ---- Gulls wheeling overhead ----

function gullring(s) {
  const n = s.n ?? 3;
  return {
    thing: {
      sortY: 1e7,
      draw(ctx, cam, t) {
        const cx = s.x * T - cam.x;
        const cy = s.y * T - cam.y;
        if (!onScreen(cx, cy, 100)) return;
        for (let i = 0; i < n; i++) {
          const a = t * (0.4 + hash(i + s.x) * 0.25) + i * 2.1;
          const x = cx + Math.cos(a) * (s.rx ?? 46) * (0.7 + hash(i) * 0.4);
          const y = cy + Math.sin(a) * (s.ry ?? 12);
          const f = Math.sin(a) > 0 ? -1 : 1;
          const flap = Math.sin(t * 5 + i * 2) > 0.6 ? 1 : 0;
          rect(ctx, '#f2f2ee', x - 1, y, 3, 1);
          for (let k = 1; k <= 3; k++) {
            rect(ctx, '#e4e8ea', x - k - 1, y - flap * (k > 1 ? 1 : 0), 1, 1);
            rect(ctx, '#e4e8ea', x + k + 1, y - flap * (k > 1 ? 1 : 0), 1, 1);
          }
          rect(ctx, '#2a2a30', x - 5, y - flap, 1, 1);
          rect(ctx, '#2a2a30', x + 5, y - flap, 1, 1);
          rect(ctx, '#f0c040', f > 0 ? x + 2 : x - 2, y, 1, 1);
        }
      },
    },
  };
}

// ---- A bell buoy ----

function buoy(s) {
  const seed = s.x * 1.9 + s.y * 4.3;
  return {
    thing: {
      sortY: s.y * T + 12,
      draw(ctx, cam, t) {
        const x = s.x * T + 8 - cam.x;
        const y = s.y * T + 10 - cam.y;
        if (!onScreen(x, y)) return;
        const roll = Math.sin(t * 0.9 + seed) * 1.6;
        const heave = Math.round(Math.sin(t * 0.9 + seed + 1.2));
        const bx = (k) => Math.round(roll * (k / 10));
        rect(ctx, 'rgba(220,240,250,0.35)', x - 7, y + 4 + heave, 14, 1);
        rect(ctx, 'rgba(0,0,0,0.25)', x - 5, y + 5 + heave, 10, 1);
        // The float: red and white bands, an iron cage on top, the bell hung in it.
        rect(ctx, '#a83c34', x - 4 + bx(2), y + heave, 8, 4);
        rect(ctx, '#ece8da', x - 3 + bx(4), y - 2 + heave, 6, 2);
        rect(ctx, '#a83c34', x - 2 + bx(6), y - 4 + heave, 4, 2);
        rect(ctx, '#1c2026', x - 1 + bx(8), y - 9 + heave, 1, 5);
        rect(ctx, '#1c2026', x + 1 + bx(8), y - 9 + heave, 1, 5);
        rect(ctx, '#1c2026', x - 1 + bx(9), y - 10 + heave, 3, 1);
        rect(ctx, '#c8a040', x + bx(8) + (roll > 0 ? 0 : -1), y - 8 + heave, 2, 3);
      },
    },
  };
}

// ---- A windsock on its post ----

function windsock(s) {
  const seed = s.x * 2.3 + s.y;
  return {
    thing: {
      sortY: s.y * T + 14,
      draw(ctx, cam, t) {
        const x = s.x * T + 8 - cam.x;
        const y = s.y * T + 14 - cam.y;
        if (!onScreen(x, y, 30)) return;
        const gale = stormy(s) ? 1 : 0.55;
        rect(ctx, '#2a2018', x - 1, y - 24, 2, 24);
        rect(ctx, '#5a4632', x - 1, y - 24, 1, 24);
        rect(ctx, '#2a2018', x - 3, y - 2, 6, 2);
        // The sock: five hoops, orange and white, drooping or streaming with the gusts.
        const gust = gale * (0.8 + 0.2 * Math.sin(t * 3 + seed));
        for (let i = 0; i < 5; i++) {
          const len = 4 + i;
          const droop = Math.round((1 - gust) * i * 1.6 + Math.sin(t * 7 + i) * 0.5);
          rect(ctx, i % 2 ? '#ece8da' : '#e8762a', x + 1 + i * 4 * (s.face ?? 1), y - 24 + droop, 4 * (s.face ?? 1) || 4, len - i * 0.6);
        }
      },
    },
  };
}

// ---- A moth at a lantern (indoors) ----

function moth(s) {
  return {
    thing: {
      sortY: 1e7,
      draw(ctx, cam, t) {
        const cx = s.x * T + 8 - cam.x;
        const cy = s.y * T + 6 - cam.y;
        if (!onScreen(cx, cy)) return;
        const a = t * 2.2 + hash(s.x);
        const x = cx + Math.cos(a) * 6 + Math.sin(a * 3.1) * 2;
        const y = cy + Math.sin(a * 1.4) * 5;
        rect(ctx, '#d8d0b8', x, y, 1, 1);
        if (Math.floor(t * 22) % 2) rect(ctx, '#ece6d0', x - 1, y - 1, 1, 1);
        else rect(ctx, '#ece6d0', x + 1, y - 1, 1, 1);
      },
    },
  };
}

export const ISLE_KINDS = { gannets, cormorant, puffin, seal, kelp, burst, cloudshade, gullring, buoy, windsock, moth };
void H;
