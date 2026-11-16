import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, TILE_SIZE as T } from '../config.js';
import { STORM_AREAS } from '../data/areas.js';
import { fract, hash } from '../engine/noise.js';

// TOWN LIFE: the life pass's small living things for Saltcombe and Gullrest, as kinds for
// touches.js (the same table, rooms' own list in src/data/townTouches.js, the same rules: drawn
// only, no bodies, nothing can bump into them).
//
//   gullThief   a gull that comes gliding in from off the side of the screen every so often, lands at
//               a market stall or a rail for a moment, snatches a fish and flies off with it. It gives
//               up and keeps away while anyone is standing there. Quiet if `when: 'calm'`, and so on.
//   ripples     rings spreading out round a post, a buoy or a moored boat standing in the water
//   skyGulls    a few gulls far up, wheeling lazily over a box of the sky (they draw over everything)
//   lap         the sea's edge: a line of foam that runs up the sand and slides back, over and over
//   hang        a post and a washing line or a string of dried fish: see `laundry` in touches.js for cloth;
//               this one is a plain line of little flags, for the beach (bunting, but cut off from the
//               song: nobody's marching)
//
// Positions are in tiles (decimals are fine).

const rect = (ctx, color, x, y, w = 1, h = 1) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};
const onScreen = (x, y, pad = 24) => x > -pad && x < W + pad && y > -pad && y < H + pad;
const feetOf = (scene) => ({ x: scene.player.x + 6, y: scene.player.y + 12 });
const nearestBody = (scene, px, py) => {
  const f = feetOf(scene);
  let d = Math.hypot(f.x - px, f.y - py);
  for (const o of scene.followers ?? []) if (!o.hidden) d = Math.min(d, Math.hypot(o.x + 6 - px, o.y + 12 - py));
  return d;
};
const stormy = (s) => STORM_AREAS.includes(s.scene.roomData.area) && !s.scene.calm && !s.scene.roomData.indoors;

const GULL = { white: '#f2f2ee', shade: '#c8ccd0', wing: '#8e98a6', tip: '#2a2a30', beak: '#f0c040', fish: '#b8c4c8', fishDark: '#6a767c' };

// A gull flying (x, y: its middle), facing f (1 right, -1 left), wings by `flap` (-1 down, 0 level, 1 up).
function fly(ctx, x, y, f, flap, fish = false) {
  const px = (lx, ly, w = 1, h = 1, c) => rect(ctx, c, f > 0 ? x + lx : x - lx - w + 1, y + ly, w, h);
  px(-3, 0, 7, 2, GULL.white);
  px(-3, 2, 6, 1, GULL.shade);
  px(3, -1, 2, 2, GULL.white);
  px(5, 0, 1, 1, GULL.beak);
  px(4, -1, 1, 1, GULL.tip);
  if (flap > 0.3) {
    px(-2, -3, 2, 3, GULL.wing); px(-1, -5, 2, 2, GULL.wing); px(0, -6, 1, 1, GULL.tip);
    px(1, -3, 2, 3, GULL.wing); px(2, -5, 2, 2, GULL.wing);
  } else if (flap < -0.3) {
    px(-2, 2, 2, 3, GULL.wing); px(-1, 4, 2, 2, GULL.wing); px(0, 6, 1, 1, GULL.tip);
    px(1, 2, 2, 3, GULL.wing); px(2, 4, 2, 2, GULL.wing);
  } else {
    px(-6, 0, 4, 1, GULL.wing); px(-8, 0, 2, 1, GULL.tip);
    px(2, 0, 4, 1, GULL.wing); px(6, 0, 2, 1, GULL.tip);
  }
  if (fish) {
    px(5, 1, 4, 2, GULL.fish);
    px(5, 2, 4, 1, GULL.fishDark);
    px(9, 1, 1, 2, GULL.fishDark);
  }
}

// A gull standing (x, y: its feet), facing f, a fish held crosswise in its beak if it has one.
function stand(ctx, x, y, f, fish) {
  const px = (lx, ly, w = 1, h = 1, c) => rect(ctx, c, f > 0 ? x + lx : x - lx - w + 1, y + ly, w, h);
  px(-1, -2, 1, 2, '#e08a4a'); px(1, -2, 1, 2, '#e08a4a');
  px(-3, -7, 7, 5, GULL.white);
  px(-3, -3, 7, 1, GULL.shade);
  px(-4, -6, 6, 2, GULL.wing);
  px(-5, -5, 2, 1, GULL.tip);
  px(2, -10, 3, 3, GULL.white);
  px(3, -9, 1, 1, GULL.tip);
  px(5, -9, 2, 1, GULL.beak);
  if (fish) {
    px(4, -9, 5, 2, GULL.fish);
    px(4, -8, 5, 1, GULL.fishDark);
    px(9, -10, 1, 4, GULL.fishDark);
  }
}

// ---- A gull that steals a fish ----
// x, y: the spot it snatches from (tiles); from: 'left' or 'right' (where it comes in from);
// every: seconds between visits (default 26); offset: seconds into the cycle at the start.
function gullThief(s) {
  const period = s.every ?? 26;
  const offset = s.offset ?? 4;
  const dir = s.from === 'right' ? -1 : 1;
  const tx = s.x * T + 8;
  const ty = s.y * T + 12;
  let spooked = -100;
  return {
    thing: {
      sortY: 1e7,
      draw(ctx, cam, t) {
        const phase = (t + offset) % period;
        const flight = 3 + 0.9 + 3.4;
        if (phase > flight) return;
        const cycle = Math.floor((t + offset) / period);
        // Someone standing at the stall: it thinks better of it.
        if (nearestBody(s.scene, tx, ty) < 26 && phase < 3.9) { spooked = cycle; }
        if (spooked === cycle && phase < 3.9) {
          // It wheels away overhead instead.
          const p = phase / 3.9;
          const gx = tx - dir * 180 + dir * 180 * p * 0.45 - dir * 0;
          const gy = ty - 70 - p * 40;
          if (onScreen(gx - cam.x, gy - cam.y)) fly(ctx, gx - cam.x, gy - cam.y, p < 0.35 ? dir : -dir, Math.sin(t * 22), false);
          return;
        }
        if (spooked === cycle) return;
        let gx;
        let gy;
        let face = dir;
        let mode = 'fly';
        if (phase < 3) {
          const p = phase / 3;
          gx = tx - dir * 180 * (1 - p);
          gy = ty - 70 * (1 - p) * (1 - p) + Math.sin(p * 9) * 1.5 - 6 * p;
        } else if (phase < 3.9) {
          gx = tx;
          gy = ty;
          mode = 'land';
        } else {
          const p = (phase - 3.9) / 3.4;
          gx = tx + dir * p * 190;
          gy = ty - 10 - p * p * 80 - p * 22;
        }
        const x = gx - cam.x;
        const y = gy - cam.y;
        if (!onScreen(x, y)) return;
        if (mode === 'land') {
          // A hop, and the fish goes in its beak.
          const grabbed = phase > 3.45;
          stand(ctx, x, y, dir, grabbed);
          return;
        }
        // Its shadow slides along the planks, small and far when it's high.
        const alt = Math.max(0, ty - gy);
        rect(ctx, `rgba(0,0,0,${Math.max(0.05, 0.22 - alt * 0.002).toFixed(2)})`, x - 3, ty - cam.y + 1, 7, 1);
        fly(ctx, x, y, face, Math.sin(t * 24), phase >= 3.9);
      },
    },
  };
}

// ---- Ripples ----
// points: [[x, y], ...] (tiles): a post, buoy or moored boat standing in the water.
function ripples(s) {
  const pts = s.points ?? [];
  return {
    floor(ctx, cam, t) {
      pts.forEach(([px, py], i) => {
        const x = px * T + 8 - cam.x;
        const y = py * T + 12 - cam.y;
        if (!onScreen(x, y)) return;
        for (let k = 0; k < 2; k++) {
          const life = fract(t * (s.rate ?? 0.3) + hash(i * 3) + k * 0.5);
          const r = (s.r ?? 5) + life * 8;
          ctx.strokeStyle = `rgba(205,238,240,${(0.5 * (1 - life)).toFixed(2)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(Math.round(x) + 0.5, Math.round(y) + 0.5, r, r * 0.38, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    },
  };
}

// ---- Gulls wheeling overhead ----
// x, y, w, h: the patch of sky they keep to (tiles); n: how many (default 3).
function skyGulls(s) {
  const n = s.n ?? 3;
  return {
    over(ctx, cam, t) {
      for (let i = 0; i < n; i++) {
        const sp = 0.16 + hash(i + 3) * 0.12;
        const a = t * sp + hash(i) * 6.28;
        const gx = (s.x + s.w * (0.5 + 0.5 * Math.sin(a))) * T - cam.x;
        const gy = (s.y + s.h * (0.5 + 0.5 * Math.sin(a * 1.7 + i))) * T - cam.y;
        if (!onScreen(gx, gy)) continue;
        const face = Math.cos(a) > 0 ? 1 : -1;
        // Small and high: wings in a V, beating slowly, gliding between.
        const beat = Math.sin(t * 5 + i * 2);
        const glide = Math.sin(t * 0.8 + i) > 0.3;
        ctx.globalAlpha = 0.9;
        if (glide) {
          rect(ctx, '#f2f2ee', gx - 3, gy, 7, 1);
          rect(ctx, '#8e98a6', gx - 5, gy + 1, 2, 1); rect(ctx, '#8e98a6', gx + 3, gy + 1, 2, 1);
        } else {
          const up = beat > 0 ? -1 : 1;
          rect(ctx, '#f2f2ee', gx - 1, gy, 3, 1);
          rect(ctx, '#f2f2ee', gx - 3, gy + up, 2, 1); rect(ctx, '#f2f2ee', gx + 2, gy + up, 2, 1);
          rect(ctx, '#8e98a6', gx - 5, gy + up * 2, 2, 1); rect(ctx, '#8e98a6', gx + 4, gy + up * 2, 2, 1);
        }
        rect(ctx, '#f0c040', gx + face * 2, gy, 1, 1);
        ctx.globalAlpha = 1;
      }
    },
  };
}

// ---- The sea's edge ----
// x, y, w: the line the water reaches at its furthest in (tiles); amp: how far it runs up and back, in px (default 5).
function lap(s) {
  return {
    floor(ctx, cam, t) {
      const x0 = s.x * T - cam.x;
      const w = Math.round(s.w * T);
      if (x0 > W || x0 + w < 0) return;
      const y0 = s.y * T - cam.y;
      if (y0 > H + 20 || y0 < -20) return;
      const amp = s.amp ?? 5;
      for (let i = 0; i < w; i += 2) {
        const wx = i + s.x * T;
        // Each wave a few tiles long, rolling in at its own time; a quiet moment between sets.
        const wave = Math.sin(t * 0.8 + wx * 0.03 + hash(Math.floor(wx / 40)) * 3);
        const run = (wave + 1) / 2;
        const edge = y0 - run * amp;
        const px = x0 + i;
        if (px < -2 || px > W) continue;
        // The wet sand left behind, then the foam on the front of it.
        ctx.fillStyle = `rgba(60,80,84,${(0.18 + 0.12 * run).toFixed(2)})`;
        ctx.fillRect(Math.round(px), Math.round(edge), 2, Math.round(amp * 0.7));
        if (run > 0.35) {
          ctx.fillStyle = `rgba(236,248,250,${(0.35 + run * 0.5).toFixed(2)})`;
          ctx.fillRect(Math.round(px), Math.round(edge - 1 + (i % 6 === 0 ? 1 : 0)), 2, 1);
        }
        if (run > 0.7 && i % 8 === 0) rect(ctx, 'rgba(255,255,255,0.7)', px, edge - 2, 1, 1);
      }
    },
  };
}

// ---- A line of little flags on a post at each end ----
// x, y, x2, y2 (tiles): the two posts; n flags; colors.
function hang(s) {
  const colors = s.colors ?? ['#d8483a', '#f0d868', '#3a7ab8', '#e8e0c8', '#4a9a6a'];
  const n = s.n ?? 6;
  return {
    thing: {
      sortY: Math.max(s.y, s.y2 ?? s.y) * T + 8,
      draw(ctx, cam, t) {
        const x1 = s.x * T + 8 - cam.x;
        const y1 = s.y * T - cam.y;
        const x2 = (s.x2 ?? s.x + 4) * T + 8 - cam.x;
        const y2 = (s.y2 ?? s.y) * T - cam.y;
        if (x2 < -20 || x1 > W + 20 || y1 > H + 20) return;
        const len = Math.round(x2 - x1);
        if (len < 4) return;
        for (const [px, py] of [[x1, y1], [x2, y2]]) {
          const post = Math.round(px) - 1;
          const top = Math.round(py) - 4;
          rect(ctx, '#2a1c10', post - 1, top, 4, 24);
          rect(ctx, '#7a5a38', post, top, 2, 23);
          rect(ctx, '#a07a4c', post, top, 1, 23);
          rect(ctx, '#4a3a2a', post - 2, top + 23, 6, 2);
        }
        const sag = (u) => Math.round(Math.sin(u * Math.PI) * 3);
        for (let i = 0; i <= len; i++) {
          const u = i / len;
          rect(ctx, '#5a4430', x1 + i, y1 - 3 + (y2 - y1) * u + sag(u));
        }
        for (let i = 0; i < n; i++) {
          const u = (i + 0.6) / (n + 0.2);
          const cx = x1 + len * u;
          const cy = y1 - 3 + (y2 - y1) * u + sag(u) + 1;
          const flutter = Math.sin(t * 3.2 + i * 1.3) > 0.2 ? 1 : 0;
          rect(ctx, colors[i % colors.length], cx, cy, 3, 2);
          rect(ctx, colors[i % colors.length], cx + 1 + flutter, cy + 2, 1, 1);
        }
      },
    },
  };
}

export const TOWN_KINDS = { gullThief, ripples, skyGulls, lap, hang };
export { stormy };
