import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, TILE_SIZE as T } from '../config.js';
import { glowSprite } from './lamplight.js';
import { fract, hash } from '../engine/noise.js';

// CAVE TOUCHES: the small living things of the Glimmering, the Stillwater and
// the Deep, as kinds for touches.js (the same table, src/data/caveTouches.js,
// the same rules: drawn only, no bodies, nothing can bump into them, so no
// beam, climb, push route or cutscene walk can ever be in their way).
//
//   bugs     little beetles resting at spots (points: [[x, y], ...] in tiles).
//            Come near and they scuttle off, wait, and come back to the same
//            spot once you have gone. `style`: 'glow' (a lamp in the back end,
//            lit in a colour), 'crystal' (a glittering back) or 'pale' (blind
//            cave crickets, colourless). `lit: true`: only seen in your light.
//   fish     pale, blind fish drifting about under the water (x, y, w, h: a
//            box of water tiles). They drift off the way you come from and
//            drift back after.
//   ripples  a ring spreading out on still water now and then (points).
//   mist     banks of low mist sliding along (x, y, w, h).
//   thread   glow-worm threads hung from a nub of rock in the roof (points:
//            [[x, y], ...]: the roof's edge, in tiles; each hangs `len` px).
//   sparkle  a patch of floor that glitters, more as you come near (x, y, w,
//            h, n): a reflection, a spill of crystal dust.
//
// Positions are in tiles; decimals are fine.

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
// How much of a thing you see when only your own light shows it.
const seenIn = (scene, x, y, on) => (on ? Math.max(0, Math.min(1, 1.4 - nearest(scene, x, y) / 62)) : 1);

const BUG = {
  glow: { body: '#3a2e5a', back: '#5a4a88', leg: '#8a7ab0', lamp: '210, 255, 120' },
  crystal: { body: '#3a3a6a', back: '#8ad8ff', leg: '#8a8ab0', lamp: '190, 235, 255' },
  pale: { body: '#6a6a82', back: '#b8b8cc', leg: '#8a8aa0', lamp: '200, 205, 230' },
};

// A beetle, facing right (f = 1) or left (f = -1), legs working while it runs.
function drawBug(ctx, x, y, f, run, t, style, lampGlow, alpha) {
  const c = BUG[style] ?? BUG.glow;
  ctx.globalAlpha = alpha;
  const px = Math.round(x);
  const py = Math.round(y);
  const m = (lx, ly, w, h, col) => rect(ctx, col, f > 0 ? px + lx : px - lx - w + 1, py + ly, w, h);
  m(-3, -3, 7, 3, c.body);
  m(-2, -4, 5, 1, c.back);
  m(4, -2, 2, 2, c.body);
  const step = run ? Math.floor(t * 18) % 2 : 0;
  m(-2 + step, 0, 1, 1, c.leg);
  m(0 - step, 0, 1, 1, c.leg);
  m(2 + step, 0, 1, 1, c.leg);
  ctx.globalAlpha = 1;
  if (style === 'glow') {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, c.lamp, f > 0 ? px - 3 : px + 3, py - 2, 7, lampGlow * 0.5 * alpha);
    rect(ctx, `rgba(${c.lamp},${(0.5 + 0.5 * lampGlow).toFixed(2)})`, f > 0 ? px - 3 : px + 3, py - 3, 2, 2);
    ctx.restore();
  } else if (style === 'crystal') {
    const sp = Math.floor(t * 3 + px) % 5 === 0;
    if (sp) rect(ctx, `rgba(255,255,255,${alpha.toFixed(2)})`, px + (f > 0 ? 0 : -1), py - 5);
  }
}

const KINDS = {
  bugs: (s) => {
    const state = s.points.map(([x, y], i) => ({
      x: x * T + 8, y: y * T + 12, hx: x * T + 8, hy: y * T + 12, mode: 'rest', until: 0, f: i % 2 ? 1 : -1, tx: 0, ty: 0,
    }));
    let last = 0;
    return {
      thing: {
        sortY: 1e7,
        draw(ctx, cam, t) {
          const dt = Math.min(0.1, Math.max(0, t - last));
          last = t;
          state.forEach((b, i) => {
            const d = nearest(s.scene, b.x, b.y);
            if (b.mode === 'rest' && d < 34) {
              // Off, away from whoever came, a few tiles.
              const f = feet(s.scene);
              const ax = b.x - f.x;
              const ay = b.y - f.y;
              const len = Math.hypot(ax, ay) || 1;
              const far = 34 + hash(i + Math.floor(t)) * 30;
              b.tx = b.hx + (ax / len) * far;
              b.ty = b.hy + (ay / len) * far * 0.5;
              b.mode = 'run';
            } else if (b.mode === 'run') {
              const dx = b.tx - b.x;
              const dy = b.ty - b.y;
              const l = Math.hypot(dx, dy);
              if (l < 2) { b.mode = 'wait'; b.until = t + 5 + hash(i * 3 + Math.floor(t)) * 5; }
              else { b.x += (dx / l) * 52 * dt; b.y += (dy / l) * 52 * dt; b.f = dx > 0 ? 1 : -1; }
            } else if (b.mode === 'wait' && t > b.until && nearest(s.scene, b.x, b.y) > 50 && nearest(s.scene, b.hx, b.hy) > 44) {
              b.mode = 'home';
            } else if (b.mode === 'home') {
              const dx = b.hx - b.x;
              const dy = b.hy - b.y;
              const l = Math.hypot(dx, dy);
              if (l < 2) { b.mode = 'rest'; b.x = b.hx; b.y = b.hy; }
              else { b.x += (dx / l) * 18 * dt; b.y += (dy / l) * 18 * dt; b.f = dx > 0 ? 1 : -1; }
            }
            const x = b.x - cam.x;
            const y = b.y - cam.y;
            if (!onScreen(x, y)) return;
            const alpha = seenIn(s.scene, b.x, b.y, s.lit);
            if (alpha < 0.03) return;
            drawBug(ctx, x, y, b.f, b.mode === 'run' || b.mode === 'home', t, s.style ?? 'glow', 0.5 + 0.5 * Math.sin(t * 1.6 + i * 2.1), alpha);
          });
        },
      },
    };
  },

  fish: (s) => {
    const n = s.n ?? 3;
    const fish = Array.from({ length: n }, (_, i) => ({ ox: 0, oy: 0, scare: 0 }));
    return {
      floor(ctx, cam, t) {
        const cx = (s.x + s.w / 2) * T - cam.x;
        const cy = (s.y + s.h / 2) * T - cam.y;
        if (!onScreen(cx, cy, s.w * T)) return;
        const f = feet(s.scene);
        fish.forEach((fi, i) => {
          const a = t * (0.07 + hash(i) * 0.06) + hash(i + 5) * 6.28;
          const bx = (s.x + (0.5 + 0.5 * Math.sin(a)) * s.w) * T;
          const by = (s.y + (0.5 + 0.5 * Math.sin(a * 1.3 + i)) * s.h) * T;
          const heading = Math.cos(a) >= 0 ? 1 : -1;
          const d = Math.hypot(f.x - (bx + fi.ox), f.y - (by + fi.oy));
          if (d < 52) fi.scare = 1.8;
          fi.scare = Math.max(0, fi.scare - 1 / 60);
          const away = Math.atan2(by + fi.oy - f.y, bx + fi.ox - f.x);
          const push = fi.scare > 0 ? 1 : -0.02;
          fi.ox = Math.max(-60, Math.min(60, fi.ox + Math.cos(away) * push * 1.4));
          fi.oy = Math.max(-30, Math.min(30, fi.oy + Math.sin(away) * push * 0.8));
          const x = bx + fi.ox - cam.x;
          const y = by + fi.oy - cam.y;
          if (!onScreen(x, y)) return;
          const fade = 0.55 * (1 - Math.min(1, fi.scare) * 0.6);
          const wig = Math.sin(t * 3 + i) > 0 ? 0 : 1;
          const col = `rgba(225,238,245,${fade.toFixed(2)})`;
          rect(ctx, col, x - 3 * heading, y + wig, 6, 2);
          rect(ctx, col, x + 3 * heading - (heading < 0 ? 1 : 0), y, 2, 2);
          rect(ctx, `rgba(200,220,232,${fade.toFixed(2)})`, x - 5 * heading, y - 1 + wig, 2, 1);
          rect(ctx, `rgba(200,220,232,${fade.toFixed(2)})`, x - 5 * heading, y + 2 + wig, 2, 1);
        });
      },
    };
  },

  ripples: (s) => ({
    floor(ctx, cam, t) {
      s.points.forEach(([px, py], i) => {
        const x = px * T + 8 - cam.x;
        const y = py * T + 8 - cam.y;
        if (!onScreen(x, y)) return;
        for (let k = 0; k < 2; k++) {
          const u = fract(t * 0.16 + i * 0.37 + k * 0.5);
          const r = 2 + u * 13;
          ctx.strokeStyle = `rgba(200,225,240,${(0.3 * (1 - u)).toFixed(2)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(Math.round(x) + 0.5, Math.round(y) + 0.5, r, r * 0.4, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    },
  }),

  mist: (s) => ({
    over(ctx, cam, t) {
      const x0 = s.x * T - cam.x;
      const y0 = s.y * T - cam.y;
      if (!onScreen(x0 + (s.w * T) / 2, y0 + (s.h * T) / 2, s.w * T)) return;
      for (let i = 0; i < (s.n ?? 4); i++) {
        const u = fract(t * (0.012 + hash(i) * 0.01) + hash(i + 4));
        const x = x0 + u * (s.w * T + 80) - 40;
        const y = y0 + hash(i + 9) * s.h * T + Math.sin(t * 0.3 + i) * 3;
        const a = 0.07 * Math.sin(u * Math.PI);
        ctx.fillStyle = `rgba(${s.color ?? '210,225,235'},${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.ellipse(x, y, 34 + hash(i + 2) * 26, 6 + hash(i + 7) * 5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  }),

  thread: (s) => ({
    over(ctx, cam, t) {
      s.points.forEach(([px, py], i) => {
        const x = px * T + 8 - cam.x;
        const y = py * T - cam.y;
        if (!onScreen(x, y)) return;
        const len = (s.len ?? 20) + (i % 3) * 5;
        const sway = Math.sin(t * 0.7 + i * 1.7) * 1.4;
        // The nub it hangs from, then the thread, then the beads.
        const alpha = s.lit ? seenIn(s.scene, x + cam.x, y + cam.y + len / 2, true) : 1;
        if (alpha < 0.03) return;
        ctx.globalAlpha = Math.min(1, 0.35 + alpha);
        rect(ctx, '#5a5678', x - 2, y - 1, 5, 2);
        rect(ctx, '#7a7698', x - 1, y - 2, 3, 1);
        rect(ctx, '#3a3650', x - 1, y + 1, 3, 1);
        ctx.globalAlpha = 1;
        ctx.save();
        ctx.globalAlpha = alpha;
        for (let k = 0; k <= len; k++) {
          const u = k / len;
          rect(ctx, 'rgba(120,200,190,0.35)', x + sway * u * u, y + 1 + k);
        }
        ctx.globalCompositeOperation = 'lighter';
        const col = s.color ?? '150, 255, 220';
        for (let k = 2; k < len; k += 4) {
          const u = k / len;
          const pulse = 0.5 + 0.5 * Math.sin(t * 1.4 - k * 0.35 + i);
          const bx = x + sway * u * u;
          rect(ctx, `rgba(${col},${(0.45 + 0.5 * pulse).toFixed(2)})`, bx - 0.5, y + 1 + k, 2, 2);
          glow(ctx, col, bx + 0.5, y + 2 + k, 5, 0.12 + 0.12 * pulse);
        }
        ctx.restore();
      });
    },
  }),

  sparkle: (s) => ({
    over(ctx, cam, t) {
      const x0 = s.x * T - cam.x;
      const y0 = s.y * T - cam.y;
      if (!onScreen(x0 + (s.w * T) / 2, y0, s.w * T)) return;
      const cx = (s.x + s.w / 2) * T;
      const cy = (s.y + s.h / 2) * T;
      const lift = Math.max(0, 1 - nearest(s.scene, cx, cy) / 70);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const col = s.color ?? '210, 230, 255';
      for (let i = 0; i < (s.n ?? 8); i++) {
        const x = x0 + hash(i + 1) * s.w * T;
        const y = y0 + hash(i + 30) * s.h * T;
        const tw = Math.max(0, Math.sin(t * (1.2 + hash(i + 7)) + i * 2.3));
        if (tw < 0.55 - lift * 0.35) continue;
        rect(ctx, `rgba(${col},${(0.5 + 0.5 * tw).toFixed(2)})`, x, y);
        if (tw > 0.9) {
          rect(ctx, `rgba(${col},0.55)`, x - 1, y);
          rect(ctx, `rgba(${col},0.55)`, x + 1, y);
          rect(ctx, `rgba(${col},0.55)`, x, y - 1);
          rect(ctx, `rgba(${col},0.55)`, x, y + 1);
        }
      }
      ctx.restore();
    },
  }),
};

export const CAVE_KINDS = KINDS;
