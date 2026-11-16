import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, TILE_SIZE as T } from '../config.js';
import { hash } from '../engine/noise.js';
import { glowSprite } from './lamplight.js';

// SHIP LIFE: the small unreal things aboard the Fair Return (round 2 of the life pass, 15 November 2026), as more
// kinds for touches.js (same rules: drawn only, no bodies, nothing can bump into them). Tables are in
// src/data/shipTouches.js, by room id. The drips (`echodrip`) and the candles are lanesLife.js's, used as they are.
//
//   ghostfish   a few pale fish swimming through the air, through the crates and the beams, fading in and out.
//               { x, y, w, h, n }: the box (tiles) they roam. They take no notice of you.
//   ghostrat    a rat that is not quite there: it scurries along a path, stops to wash its face, and is gone when
//               you come near. { path: [[x, y], ...], gap }
//   barnacles   white barnacles on the planking, feeding with a tiny flicker; they snap shut as you come near.
//               { points: [[x, y], ...] } (tiles; the middle of the bottom edge)
//   danglers    things hung from a nail or ring on a wall's top edge, swaying in air that isn't moving: rope,
//               chain, weed. { items: [{ x, y, len, k: 'rope' | 'chain' | 'weed' }] } (x, y: where it hangs from)
//   gutter      the glow of a lamp on a hook, guttering: it flickers and now and then nearly goes out, and comes
//               back. { points: [[x, y], ...], color } (x, y: the lamp's flame, tiles)
//   wisp        a thin curl of cold mist standing up from a spot, then thinning. { x, y }
//
// Everything is worked out from the time and the player's place.

const rect = (ctx, color, x, y, w = 1, h = 1) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};
const onScreen = (x, y, pad = 24) => x > -pad && x < W + pad && y > -pad && y < H + pad;
const near = (scene, px, py) => {
  const p = scene.player;
  let d = Math.hypot(p.x + 6 - px, p.y + 12 - py);
  for (const o of scene.followers ?? []) if (!o.hidden) d = Math.min(d, Math.hypot(o.x + 6 - px, o.y + 12 - py));
  return d;
};
const glow = (ctx, color, x, y, r, alpha) => {
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.drawImage(glowSprite(color), x - r, y - r, r * 2, r * 2);
  ctx.globalAlpha = 1;
};
const wander = (i, t, cx, cy, rx, ry, speed = 1) => {
  const a = t * speed * (0.8 + hash(i) * 0.9) + hash(i + 9) * 6.28;
  return [cx + Math.sin(a) * rx * (0.5 + hash(i + 3) * 0.5) + Math.sin(a * 2.7 + i) * rx * 0.25,
    cy + Math.cos(a * 1.3 + i) * ry * (0.5 + hash(i + 5) * 0.5)];
};

// ---- Fish in the air ----

function ghostfish(s) {
  const n = s.n ?? 3;
  const fish = Array.from({ length: n }, (_, i) => ({ i, x: 0, y: 0, dir: 1, ready: false }));
  return {
    over(ctx, cam, t) {
      for (const q of fish) {
        const [px, py] = wander(q.i + s.x * 5 + s.y, t * 0.32, (s.x + s.w / 2) * T, (s.y + s.h / 2) * T, (s.w * T) / 2, (s.h * T) / 2);
        if (!q.ready) { q.x = px; q.y = py; q.ready = true; }
        const dx = px - q.x;
        q.dir = Math.sign(dx) || q.dir;
        q.x = px;
        q.y = py;
        const x = px - cam.x;
        const y = py - cam.y;
        if (!onScreen(x, y)) continue;
        // They come and go: nothing here is quite sure of being a fish.
        const a = 0.5 + 0.5 * Math.sin(t * 0.45 + q.i * 2.1 + s.x);
        const alpha = Math.max(0, (a - 0.25) * 0.8);
        if (alpha < 0.03) continue;
        ctx.globalAlpha = alpha;
        const d = q.dir;
        const wag = Math.round(Math.sin(t * 6 + q.i * 3));
        const mx = (lx, ly, w = 1, h = 1) => rect(ctx, '#9fdcd2', d > 0 ? x + lx : x - lx - w + 1, y + ly, w, h);
        mx(-3, 0, 7, 3); mx(-2, -1, 5, 1); mx(-2, 3, 4, 1);
        mx(-6, wag - 1, 2, 2); mx(-5, wag + 1, 2, 2);
        mx(2, 0, 1, 1);
        rect(ctx, '#0c2a2a', d > 0 ? x + 3 : x - 3, y, 1, 1);
        ctx.globalAlpha = 1;
        glow(ctx, '120, 220, 210', x, y + 1, 12, alpha * 0.35);
      }
    },
  };
}

// ---- A rat that is not quite there ----

function ghostrat(s) {
  const path = s.path;
  const gap = s.gap ?? 9;
  const st = { seg: 0, u: 0, pause: 0, gone: 0, fade: 1, last: null, washed: 0 };
  const at = () => {
    const a = path[st.seg % path.length];
    const b = path[(st.seg + 1) % path.length];
    return [(a[0] + (b[0] - a[0]) * st.u) * T + 8, (a[1] + (b[1] - a[1]) * st.u) * T + 8, b[0] >= a[0] ? 1 : -1];
  };
  return {
    thing: {
      sortY: 0,
      draw(ctx, cam, t) {
        const dt = st.last === null ? 0 : Math.min(0.1, t - st.last);
        st.last = t;
        let [px, py, dir] = at();
        // Frightened by company: it is gone, and some seconds later it is somewhere else on its path.
        if (near(s.scene, px, py) < 44 && st.gone <= 0) { st.gone = gap + hash(st.seg + 3) * gap; st.fade = 0; }
        if (st.gone > 0) {
          st.gone -= dt;
          if (st.gone <= 0) { st.seg = Math.floor(hash(t) * path.length); st.u = 0; st.pause = 0; }
          return;
        }
        st.fade = Math.min(1, st.fade + dt * 1.2);
        if (st.pause > 0) {
          st.pause -= dt;
        } else {
          const a = path[st.seg % path.length];
          const b = path[(st.seg + 1) % path.length];
          const len = Math.hypot(b[0] - a[0], b[1] - a[1]) * T || 1;
          st.u += (26 * dt) / len;
          if (st.u >= 1) { st.u = 0; st.seg = (st.seg + 1) % path.length; st.pause = 0.6 + hash(st.seg + 11) * 2.2; }
        }
        [px, py, dir] = at();
        this.sortY = py + 4;
        const x = px - cam.x;
        const y = py - cam.y;
        if (!onScreen(x, y)) return;
        const flick = 0.3 + 0.2 * Math.sin(t * 17) + (Math.sin(t * 2.3) > 0.93 ? -0.25 : 0);
        ctx.globalAlpha = Math.max(0, flick * st.fade);
        const run = st.pause > 0 ? 0 : Math.round(Math.sin(t * 20));
        const m = (lx, ly, w = 1, h = 1, c = '#b4c2c0') => rect(ctx, c, dir > 0 ? x + lx : x - lx - w + 1, y + ly, w, h);
        m(-3, -3, 6, 3); m(2, -3, 3, 2); m(4, -2, 2, 1, '#c8d6d2');
        m(3, -5, 1, 2); m(2, -4, 1, 1);
        m(-6, -2, 3, 1, '#8c9c9c'); m(-8, -1 + run, 2, 1, '#8c9c9c');
        m(-2, 0, 1, 1 + (run > 0 ? 0 : 1)); m(1, 0, 1, 1 + (run > 0 ? 1 : 0));
        if (st.pause > 0 && Math.floor(t * 5) % 2) m(4, -2, 1, 2, '#c8d6d2');
        rect(ctx, '#e0e8e8', dir > 0 ? x + 4 : x - 4, y - 3, 1, 1);
        ctx.globalAlpha = 1;
      },
    },
  };
}

// ---- Barnacles ----

function barnacles(s) {
  const pts = s.points ?? [];
  const shut = pts.map(() => 0);
  return {
    floor(ctx, cam, t) {
      pts.forEach(([tx, ty], i) => {
        const x = tx * T + 8 - cam.x;
        const y = ty * T + 14 - cam.y;
        if (!onScreen(x, y)) return;
        const close = near(s.scene, tx * T + 8, ty * T + 8) < 40 ? 1 : 0;
        shut[i] += (close - shut[i]) * 0.1;
        for (let k = 0; k < 5; k++) {
          const bx = x - 6 + k * 3 + (hash(i * 7 + k) * 2 - 1);
          const by = y - (k % 2) * 2 - Math.floor(hash(i + k * 3) * 2);
          rect(ctx, '#8e9888', bx, by - 2, 3, 3);
          rect(ctx, '#d4dccc', bx, by - 2, 2, 1);
          rect(ctx, '#1a2220', bx + 1, by - 1, 1, 1);
          // The little feathered feeding-arm: out and flicking, until it has company.
          if (shut[i] < 0.5 && Math.sin(t * 3 + k * 1.7 + i) > 0.3) rect(ctx, '#e6f0e0', bx + 1, by - 3, 1, 1);
        }
      });
    },
  };
}

// ---- Hung things that sway in still air ----

function danglers(s) {
  const items = s.items ?? [];
  const PAL = {
    rope: ['#a8a48a', '#7a7860', 1],
    chain: ['#8294a0', '#4c5a66', 2],
    weed: ['#4a7e56', '#2f5c40', 2],
  };
  return {
    thing: {
      sortY: Math.max(...items.map((it) => it.y * T + it.len), 0),
      draw(ctx, cam, t) {
        for (const it of items) {
          const ax = it.x * T + 8 - cam.x;
          const ay = it.y * T - cam.y;
          if (!onScreen(ax, ay + it.len, 30)) continue;
          const [c1, c2, wide] = PAL[it.k ?? 'rope'];
          // The nail it hangs from.
          rect(ctx, '#58626c', ax - 1, ay - 1, 3, 2);
          rect(ctx, '#8494a0', ax, ay - 1, 1, 1);
          const ph = hash(it.x * 13 + it.y) * 6.28;
          for (let j = 1; j <= it.len; j++) {
            const u = j / it.len;
            const sway = Math.sin(t * 0.8 + ph - u * 1.3) * (0.4 + u * 2.2);
            const wob = it.k === 'weed' ? Math.sin(j * 0.7 + t * 1.3 + ph) * 0.9 : 0;
            const tone = it.k === 'chain' ? (j % 3 === 0 ? c2 : c1) : (j % 2 === 0 ? c1 : c2);
            rect(ctx, tone, ax + sway + wob, ay + j, wide, 1);
          }
          if (it.k === 'weed') { rect(ctx, c1, ax + Math.sin(t * 0.8 + ph - 1.3) * 2.6 + 1, ay + it.len, 2, 2); }
        }
      },
    },
  };
}

// ---- Lamps that gutter ----

function gutter(s) {
  const pts = s.points ?? [];
  const color = s.color ?? '150, 235, 226';
  return {
    over(ctx, cam, t) {
      pts.forEach(([tx, ty], i) => {
        const x = tx * T + 8 - cam.x;
        const y = ty * T + 8 - cam.y;
        if (!onScreen(x, y, 70)) return;
        // Every so often the flame sinks right down, hangs on, and comes back.
        const cycle = (t + i * 4.3) % (11 + (i % 3) * 3);
        const low = cycle > 7.6 && cycle < 8.9 ? 0.18 + 0.1 * Math.sin((cycle - 7.6) * 9) : 1;
        const flick = 0.78 + 0.14 * Math.sin(t * 9 + i * 2) + 0.08 * Math.sin(t * 23.3 + i);
        const a = Math.max(0.05, low * flick);
        glow(ctx, color, x, y, 30 + 8 * low, 0.42 * a);
        glow(ctx, '230, 255, 250', x, y, 7, 0.6 * a);
      });
    },
  };
}

// ---- Cold mist standing up ----

function wisp(s) {
  return {
    over(ctx, cam, t) {
      const x = s.x * T + 8 - cam.x;
      const y = s.y * T + 14 - cam.y;
      if (!onScreen(x, y, 30)) return;
      for (let k = 0; k < 6; k++) {
        const u = ((t * 0.18 + k / 6 + hash(s.x + s.y) ) % 1);
        const px = x + Math.sin(u * 5 + k + t * 0.4) * (2 + u * 5);
        const py = y - u * 26;
        ctx.globalAlpha = (1 - u) * 0.28;
        rect(ctx, '#dff0ec', px, py, 2 + Math.floor(u * 3), 1);
        ctx.globalAlpha = 1;
      }
    },
  };
}

export const SHIP_KINDS = { ghostfish, ghostrat, barnacles, danglers, gutter, wisp };
