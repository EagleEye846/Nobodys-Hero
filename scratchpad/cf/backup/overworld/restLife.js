import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, TILE_SIZE as T } from '../config.js';
import { glowSprite } from './lamplight.js';
import { fract, hash } from '../engine/noise.js';

// REST LIFE: the small living things and weather of Heralds' Rest, the Long Stair and the Ice Caves
// (chapter 2), as kinds for touches.js. The table that says which room has which is
// src/data/restTouches.js. Like every touch they are only drawn: no bodies, nothing can bump into
// them, so no climb, ice slide, push or cutscene walk can ever be in their way.
//
//   restDrift  streaks of dry snow blown along on the wind (x, y, w, h: a box in tiles; n streaks;
//              dir 1 or -1; speed; color and color2: a dusty seed-fluff on grass instead of snow)
//   restFlush  birds resting at spots (points: [[x, y], ...] in tiles). Come near and they go up in
//              a clatter, circle off the edge of the screen and come back much later. style:
//              'chough' (black, red bill), 'ptarmigan' (white), 'finch' (small and brown).
//   restGoats  a few mountain goats grazing near a spot (points). They lift their heads when you
//              come near, trot off a few tiles, and come back to the grass when you've gone.
//   restSlip   a clump of snow that slides off a roof edge or branch now and then and bursts on the
//              ground (points: [[x, y], ...] = where it lets go, in tiles; `drop` tiles it falls)
//   restGlow   a soft light that swells and fades (points; color 'r, g, b'; r the radius in px; rate;
//              flicker: true for a fire's uneven light)
//   restBreath a little cloud of visible breath at a face that is out in the cold now and then
//              (points)
//   restIcedrip a drip off an icicle: a bead, a fall, a ring on the floor (points: the tip, in
//              tiles; fall tiles; every seconds)

const rect = (ctx, color, x, y, w = 1, h = 1) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};
const onScreen = (x, y, pad = 24) => x > -pad && x < W + pad && y > -pad && y < H + pad;
const feet = (scene) => ({ x: scene.player.x + 6, y: scene.player.y + 12 });
const nearest = (scene, px, py) => {
  const f = feet(scene);
  let d = Math.hypot(f.x - px, f.y - py);
  for (const o of scene.followers ?? []) if (!o.hidden) d = Math.min(d, Math.hypot(o.x + 6 - px, o.y + 12 - py));
  return d;
};
const glow = (ctx, color, x, y, r, alpha) => {
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.drawImage(glowSprite(color), x - r, y - r, r * 2, r * 2);
  ctx.globalAlpha = 1;
};

const BIRD = {
  chough: { body: '#1c1c26', wing: '#34344a', bill: '#d8483a', leg: '#d8483a' },
  ptarmigan: { body: '#e8ecf2', wing: '#c8d0dc', bill: '#2a2a30', leg: '#8a8a96' },
  finch: { body: '#a88a64', wing: '#7a5e3e', bill: '#e8c8a0', leg: '#6a4a30' },
};

// A bird on the ground, facing right (f = 1) or left (f = -1), head down pecking now and then.
function drawPerched(ctx, x, y, f, peck, t, style) {
  const c = BIRD[style] ?? BIRD.chough;
  const px = Math.round(x);
  const py = Math.round(y);
  const m = (lx, ly, w, h, col) => rect(ctx, col, f > 0 ? px + lx : px - lx - w + 1, py + ly, w, h);
  m(-3, -4, 6, 3, c.body);
  m(-4, -3, 2, 1, c.wing);
  m(-1, -4, 3, 1, c.wing);
  if (peck) { m(2, -2, 2, 2, c.body); m(4, -1, 1, 1, c.bill); } else { m(2, -6, 2, 3, c.body); m(4, -5, 1, 1, c.bill); }
  m(-1, -1, 1, 1, c.leg);
  m(1, -1, 1, 1, c.leg);
}

// A bird in flight, wings up or down by the beat.
function drawFlying(ctx, x, y, f, beat, style) {
  const c = BIRD[style] ?? BIRD.chough;
  const px = Math.round(x);
  const py = Math.round(y);
  rect(ctx, c.body, px - 2, py, 5, 2);
  rect(ctx, c.bill, px + (f > 0 ? 3 : -3), py, 1, 1);
  if (beat) { rect(ctx, c.wing, px - 3, py - 3, 2, 3); rect(ctx, c.wing, px + 1, py - 3, 2, 3); }
  else { rect(ctx, c.wing, px - 4, py + 1, 3, 1); rect(ctx, c.wing, px + 2, py + 1, 3, 1); }
}

const KINDS = {
  restDrift: (s) => ({
    over(ctx, cam, t) {
      const x0 = s.x * T - cam.x;
      const y0 = s.y * T - cam.y;
      const w = s.w * T;
      const h = s.h * T;
      if (x0 > W || x0 + w < 0 || y0 > H || y0 + h < 0) return;
      const n = s.n ?? 14;
      const dir = s.dir ?? 1;
      const sp = s.speed ?? 22;
      ctx.save();
      for (let i = 0; i < n; i++) {
        const k = hash(i + 4 + s.x);
        const run = (t * sp * (0.6 + k * 0.8) + hash(i + 40) * w) % (w + 12);
        const x = dir > 0 ? x0 + run - 6 : x0 + w - run + 6;
        const y = y0 + hash(i + 17) * h + Math.sin(t * 1.3 + i * 2.2) * 3;
        // A gust comes and goes: the streaks swell and thin over about a minute.
        const gust = 0.35 + 0.65 * Math.max(0, Math.sin(t * 0.23 + hash(i + 2) * 6.28));
        if (gust < 0.4) continue;
        ctx.globalAlpha = 0.25 + 0.4 * gust;
        const len = 3 + Math.floor(k * 5 * gust);
        rect(ctx, s.color ?? '#f4f8ff', dir > 0 ? x - len : x, y, len, 1);
        if (k > 0.55) rect(ctx, s.color2 ?? '#d8e8f8', dir > 0 ? x - len + 1 : x, y + 1, Math.max(1, len - 2), 1);
      }
      ctx.restore();
    },
  }),

  restFlush: (s) => {
    const state = s.points.map(([x, y], i) => ({
      hx: x * T + 8, hy: y * T + 12, mode: 'rest', until: 0, t0: 0, f: i % 2 ? 1 : -1, peckAt: hash(i + 3) * 6, dx: i % 2 ? 1 : -1,
    }));
    return {
      thing: {
        sortY: 1e7,
        draw(ctx, cam, t) {
          state.forEach((b, i) => {
            const d = nearest(s.scene, b.hx, b.hy);
            if (b.mode === 'rest' && d < 38) {
              b.mode = 'fly';
              b.t0 = t;
              const f = feet(s.scene);
              b.dx = b.hx >= f.x ? 1 : -1;
              b.f = b.dx;
              b.until = t + 7 + hash(i * 3 + Math.floor(t)) * 9;
            } else if (b.mode === 'away' && t > b.until && d > 110) {
              b.mode = 'back';
              b.t0 = t;
            }
            let x = b.hx;
            let y = b.hy;
            if (b.mode === 'rest') {
              const peck = fract(t / 4.5 + b.peckAt) < 0.22 && Math.floor(t * 6) % 2 === 0;
              if (!onScreen(x - cam.x, y - cam.y)) return;
              drawPerched(ctx, x - cam.x, y - cam.y, b.f, peck, t, s.style);
              return;
            }
            if (b.mode === 'fly') {
              const u = t - b.t0;
              x = b.hx + b.dx * u * 70;
              y = b.hy - u * 44 + Math.sin(u * 5) * 2;
              if (u > 2.2) { b.mode = 'away'; return; }
              if (onScreen(x - cam.x, y - cam.y)) drawFlying(ctx, x - cam.x, y - cam.y, b.dx, Math.floor(t * 14) % 2, s.style);
              return;
            }
            if (b.mode === 'back') {
              const u = t - b.t0;
              const k = Math.min(1, u / 2.4);
              x = b.hx + b.dx * (1 - k) * 90;
              y = b.hy - (1 - k) * 50 + Math.sin(u * 4) * (1 - k) * 3;
              if (k >= 1) { b.mode = 'rest'; return; }
              if (onScreen(x - cam.x, y - cam.y)) drawFlying(ctx, x - cam.x, y - cam.y, -b.dx, Math.floor(t * 12) % 2, s.style);
            }
          });
        },
      },
    };
  },

  restGoats: (s) => {
    const state = s.points.map(([x, y], i) => ({
      hx: x * T + 8, hy: y * T + 12, x: x * T + 8, y: y * T + 12, mode: 'graze', tx: 0, ty: 0, until: 0, f: i % 2 ? 1 : -1, phase: hash(i + 7) * 6,
      kid: i % 3 === 2,
    }));
    let last = 0;
    return {
      thing: {
        sortY: 1e7,
        draw(ctx, cam, t) {
          const dt = Math.min(0.1, Math.max(0, t - last));
          last = t;
          state.forEach((g, i) => {
            const d = nearest(s.scene, g.x, g.y);
            if ((g.mode === 'graze' || g.mode === 'look') && d < 40) {
              const f = feet(s.scene);
              const ax = g.x - f.x;
              const ay = g.y - f.y;
              const len = Math.hypot(ax, ay) || 1;
              g.tx = g.hx + (ax / len) * 42;
              g.ty = g.hy + (ay / len) * 14;
              g.mode = 'trot';
            } else if (g.mode === 'graze' && d < 68) {
              g.mode = 'look';
            } else if (g.mode === 'look' && d > 80) {
              g.mode = 'graze';
            } else if (g.mode === 'trot') {
              const dx = g.tx - g.x;
              const dy = g.ty - g.y;
              const l = Math.hypot(dx, dy);
              if (l < 2) { g.mode = 'wait'; g.until = t + 6 + hash(i + Math.floor(t)) * 6; } else { g.x += (dx / l) * 40 * dt; g.y += (dy / l) * 40 * dt; g.f = dx > 0 ? 1 : -1; }
            } else if (g.mode === 'wait' && t > g.until && nearest(s.scene, g.hx, g.hy) > 56) {
              g.mode = 'home';
            } else if (g.mode === 'home') {
              const dx = g.hx - g.x;
              const dy = g.hy - g.y;
              const l = Math.hypot(dx, dy);
              if (l < 2) { g.mode = 'graze'; g.x = g.hx; g.y = g.hy; } else { g.x += (dx / l) * 14 * dt; g.y += (dy / l) * 14 * dt; g.f = dx > 0 ? 1 : -1; }
            }
            const x = g.x - cam.x;
            const y = g.y - cam.y;
            if (!onScreen(x, y)) return;
            const moving = g.mode === 'trot' || g.mode === 'home';
            const headUp = g.mode === 'look' || g.mode === 'wait' || moving || fract(t / 7 + g.phase) > 0.8;
            const k = g.kid ? 0.75 : 1;
            const px = Math.round(x);
            const py = Math.round(y);
            const m = (lx, ly, w, h, col) => rect(ctx, col, g.f > 0 ? px + Math.round(lx * k) : px - Math.round(lx * k) - w + 1, py + Math.round(ly * k), w, h);
            // legs, then body, then head and horns, coat white with a grey back.
            const step = moving ? Math.floor(t * 12) % 2 : 0;
            m(-4, -2, 1, 2, '#6a6a76'); m(2 + step, -2, 1, 2, '#6a6a76'); m(-2 - step, -2, 1, 2, '#6a6a76'); m(4, -2, 1, 2, '#6a6a76');
            m(-5, -6, 11, 4, '#f0f2f6'); m(-5, -6, 11, 1, '#c8ced8'); m(-5, -3, 11, 1, '#b8c0cc');
            m(-6, -5, 1, 2, '#e0e4ea');
            if (headUp) {
              m(5, -9, 3, 3, '#f0f2f6'); m(6, -8, 3, 2, '#d8dce4'); m(5, -11, 1, 2, '#6a5a48'); m(7, -11, 1, 2, '#6a5a48'); m(8, -8, 1, 1, '#14141c');
              m(5, -7, 2, 1, '#b8c0cc');
            } else {
              m(5, -4, 3, 3, '#f0f2f6'); m(7, -3, 2, 2, '#d8dce4'); m(5, -6, 1, 2, '#6a5a48'); m(8, -2, 1, 1, '#14141c');
            }
          });
        },
      },
    };
  },

  restSlip: (s) => {
    const every = s.every ?? 17;
    return {
      thing: {
        sortY: 1e7,
        draw(ctx, cam, t) {
          s.points.forEach(([tx, ty], i) => {
            const period = every + (i % 3) * 3.7;
            const u = ((t + hash(i + 9) * period) % period);
            if (u > 1.6) return;
            const x = tx * T + 8 - cam.x;
            const y0 = ty * T + 8 - cam.y;
            if (!onScreen(x, y0, 40)) return;
            const drop = (s.drop ?? 1.5) * T;
            const fallT = 0.55;
            if (u < fallT) {
              const k = u / fallT;
              const y = y0 + k * k * drop;
              rect(ctx, '#e8f2fc', x - 1, y, 3, 2);
              rect(ctx, '#ffffff', x, y - 1, 2, 1);
              rect(ctx, '#c4d8ec', x - 1 + (k > 0.5 ? 1 : 0), y + 1, 2, 1);
            } else {
              const k = (u - fallT) / 1.05;
              const y = y0 + drop;
              ctx.save();
              ctx.globalAlpha = 1 - k;
              for (let j = 0; j < 7; j++) {
                const a = (j / 7) * Math.PI + Math.PI;
                rect(ctx, '#ffffff', x + Math.cos(a) * (2 + k * 7), y + Math.sin(a) * (1 + k * 4) * 0.8, 2, 1);
              }
              rect(ctx, '#dce9f6', x - 3, y, 6, 1);
              ctx.restore();
            }
          });
        },
      },
    };
  },

  restGlow: (s) => ({
    over(ctx, cam, t) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      s.points.forEach(([tx, ty], i) => {
        const x = tx * T + 8 - cam.x;
        const y = ty * T + 8 - cam.y;
        if (!onScreen(x, y, 60)) return;
        const rate = s.rate ?? 0.9;
        let k = 0.5 + 0.5 * Math.sin(t * rate + i * 1.9);
        if (s.flicker) k = 0.55 + 0.25 * Math.sin(t * 7 + i) + 0.2 * Math.sin(t * 13.3 + i * 2) + 0.1 * Math.sin(t * 3.1);
        glow(ctx, s.color ?? '255, 190, 110', x, y, (s.r ?? 22) * (0.85 + 0.2 * k), (s.strength ?? 0.4) * (0.55 + 0.6 * k));
      });
      ctx.restore();
    },
  }),

  restBreath: (s) => ({
    thing: {
      sortY: 1e7,
      draw(ctx, cam, t) {
        s.points.forEach(([tx, ty], i) => {
          const period = 5.2 + (i % 3) * 0.9;
          const u = (t + hash(i + 5) * period) % period;
          if (u > 1.5) return;
          const x = tx * T + 8 - cam.x;
          const y = ty * T + 4 - cam.y;
          if (!onScreen(x, y)) return;
          ctx.save();
          ctx.globalAlpha = 0.5 * (1 - u / 1.5);
          const k = u / 1.5;
          rect(ctx, '#f0f6fc', x + (s.dir ?? 1) * (3 + k * 6), y - k * 5, 2 + Math.round(k * 3), 2);
          rect(ctx, '#f0f6fc', x + (s.dir ?? 1) * (5 + k * 8), y - 1 - k * 7, 1 + Math.round(k * 3), 1);
          ctx.restore();
        });
      },
    },
  }),

  restIcedrip: (s) => ({
    thing: {
      sortY: 1e7,
      draw(ctx, cam, t) {
        s.points.forEach(([tx, ty], i) => {
          const every = s.every ?? 4.2;
          const period = every + (i % 4) * 1.3;
          const u = (t + hash(i + 12) * period) % period;
          const x = tx * T + 8 - cam.x;
          const y0 = ty * T + 6 - cam.y;
          if (!onScreen(x, y0, 40)) return;
          const fall = (s.fall ?? 2) * T;
          if (u < 1.6) {
            // The bead swells on the tip.
            const k = u / 1.6;
            rect(ctx, '#bfe6ff', x, y0, 1, 1 + Math.floor(k * 2));
          } else if (u < 1.95) {
            const k = (u - 1.6) / 0.35;
            const y = y0 + k * k * fall;
            rect(ctx, '#d8f2ff', x, y, 1, 2);
          } else if (u < 2.9) {
            const k = (u - 1.95) / 0.95;
            ctx.save();
            ctx.globalAlpha = 0.7 * (1 - k);
            const r = 2 + k * 6;
            rect(ctx, '#d8f2ff', x - r, y0 + fall, r * 2, 1);
            rect(ctx, '#a4d4ec', x - r * 0.6, y0 + fall + 1, r * 1.2, 1);
            ctx.restore();
          }
        });
      },
    },
  }),
};

export const REST_KINDS = KINDS;
