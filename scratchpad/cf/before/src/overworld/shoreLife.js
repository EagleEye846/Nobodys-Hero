import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, TILE_SIZE as T } from '../config.js';
import { STORM_AREAS } from '../data/areas.js';

// SHORE LIFE: the small living things of the Wrack Shore and the Wreck Yard, as
// kinds for touches.js (a table in src/data/shoreTouches.js, the same rules: drawn
// only, no bodies, nothing can bump into them). Rock pools with shrimp that dart
// when you lean over, sandpipers running the tideline that flush when you come
// near, sandhoppers in the wrack, a hermit crab that pulls in, a seal asleep on a
// rock, foam lines, spray bursts and glints on wet iron.
//
//   pool        x, y: a rock pool tile, shrimp resting in it, darting when anyone is near
//   sandpipers  x, y, w, n: little shore birds running along the tideline, flush and come back
//   hoppers     x, y, w, h, n: sandhoppers in the weed, hopping off from your feet
//   hermit      x, y, r: a hermit crab picking about, pulled into its shell while you are near
//   seal        x, y: a seal asleep on a rock, head up when you come near, gone when you come close
//   foam        x, y, w: a line of foam sliding up and down a beach (or round a rock)
//   spray       x, y, every: a burst of spray off a rock, bigger in the storm
//   fronds      x, y, w: dark weed fronds growing up out of a wall's foot, drawn in front for depth
//   glint       points: [[x, y], ...]: a twinkle now and then on wet iron or glass

const fract = (x) => x - Math.floor(x);
const hash = (n) => fract(Math.sin(n * 91.7 + 17.3) * 43758.5453);
const rect = (ctx, color, x, y, w = 1, h = 1) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};
const onScreen = (x, y, pad = 24) => x > -pad && x < W + pad && y > -pad && y < H + pad;
const stormy = (s) => STORM_AREAS.includes(s.scene.roomData.area) && !s.scene.calm && !s.scene.roomData.indoors;
// How far the nearest of the party is from a point (pixels).
function nearest(scene, px, py) {
  const p = scene.player;
  let d = Math.hypot(p.x + 6 - px, p.y + 12 - py);
  for (const o of scene.followers ?? []) if (!o.hidden) d = Math.min(d, Math.hypot(o.x + 6 - px, o.y + 12 - py));
  return d;
}

// ---- Rock pools ----

function pool(s) {
  const cx = s.x * T + 8;
  const cy = s.y * T + 9;
  const seed = s.x * 3.7 + s.y * 1.9;
  const n = s.n ?? 3;
  const shrimp = Array.from({ length: n }, (_, i) => ({
    x: (hash(seed + i) - 0.5) * 8, y: (hash(seed + i + 4) - 0.5) * 3,
    tx: 0, ty: 0, until: 0, dir: 1,
  }));
  shrimp.forEach((m) => { m.tx = m.x; m.ty = m.y; });
  let last = null;
  return {
    thing: {
      sortY: cy + 3,
      draw(ctx, cam, t) {
        const dt = last === null ? 0.016 : Math.max(0, Math.min(0.05, t - last));
        last = t;
        const x = cx - cam.x;
        const y = cy - cam.y;
        if (!onScreen(x, y)) return;
        const d = nearest(s.scene, cx, cy);
        const alarm = d < 34;
        shrimp.forEach((m, i) => {
          if (alarm && t > m.until) {
            m.tx = (hash(t * 7 + i * 3 + seed) - 0.5) * 11;
            m.ty = (hash(t * 5 + i + seed) - 0.5) * 4;
            m.until = t + 0.55 + hash(i + t) * 0.5;
            m.dir = Math.sign(m.tx - m.x) || 1;
            m.ring = 0.4;
          } else if (!alarm && t > m.until + 3) {
            m.tx += (hash(t + i) - 0.5) * 1.5;
            m.tx = Math.max(-5, Math.min(5, m.tx));
            m.until = t + 5 + hash(i * 2 + t) * 4;
          }
          const k = alarm ? 34 : 4;
          m.x += (m.tx - m.x) * Math.min(1, dt * k);
          m.y += (m.ty - m.y) * Math.min(1, dt * k);
          if (m.ring > 0) {
            m.ring -= dt;
            const rr = Math.round((0.4 - m.ring) * 14);
            rect(ctx, 'rgba(220, 245, 250, 0.4)', x + m.x - rr, y + m.y + 1, rr * 2 + 1, 1);
          }
          const sx = x + m.x;
          const sy = y + m.y;
          rect(ctx, 'rgba(20, 40, 50, 0.32)', sx - 1, sy + 1, 4, 1);
          rect(ctx, 'rgba(236, 214, 200, 0.85)', sx, sy, 3, 1);
          rect(ctx, 'rgba(236, 160, 150, 0.9)', sx - m.dir, sy - 1, 1, 1);
          rect(ctx, 'rgba(236, 160, 150, 0.7)', sx + (m.dir > 0 ? 3 : -1), sy, 1, 1);
        });
        // Now and then a bubble comes up.
        const b = (t * 0.4 + seed) % 5;
        if (b < 1) rect(ctx, 'rgba(230, 250, 255, 0.55)', x + Math.sin(seed * 5) * 4, y - 2 - b * 4, 1, 1);
      },
    },
  };
}

// ---- Sandpipers ----

function sandpipers(s) {
  const n = s.n ?? 3;
  const birds = Array.from({ length: n }, (_, i) => ({
    hx: s.x * T + (i + 0.5) * ((s.w ?? 3) * T) / n + (hash(i + s.x) - 0.5) * 8,
    x: 0, mode: 'feed', t0: 0, until: 0, face: hash(i + s.y) < 0.5 ? -1 : 1, hop: 0,
  }));
  birds.forEach((b) => { b.x = b.hx; });
  const hy = s.y * T + 12;
  return {
    thing: {
      sortY: hy,
      draw(ctx, cam, t) {
        birds.forEach((b, i) => {
          const d = nearest(s.scene, b.x, hy);
          if (b.mode === 'feed' && d < 44) {
            b.mode = 'fly';
            b.t0 = t;
            b.face = s.scene.player.x + 6 > b.x ? -1 : 1;
          } else if (b.mode === 'fly' && t - b.t0 > 2.2) {
            b.mode = 'away';
            b.until = t + 14 + hash(i * 5 + b.t0) * 18;
          } else if (b.mode === 'away' && t > b.until && d > 80) {
            b.mode = 'back';
            b.t0 = t;
            b.x = b.hx + (i % 2 ? 90 : -90);
          } else if (b.mode === 'back' && t - b.t0 > 2) {
            b.mode = 'feed';
          }
          if (b.mode === 'away') return;
          let x;
          let y = hy - cam.y;
          let air = 0;
          if (b.mode === 'feed') {
            // Run, stop, peck: a little stop-start along the line of the wet.
            const phase = (t * 0.7 + i * 1.7) % 4;
            if (phase < 1.2) { b.x += b.face * 0.5; air = 0; }
            if (phase > 3.8) b.face = hash(Math.floor(t) + i) < 0.5 ? -1 : 1;
            b.x = Math.max(b.hx - 14, Math.min(b.hx + 14, b.x));
            b.hop = phase > 1.6 && phase < 2.4 ? 1 : 0;
          } else if (b.mode === 'fly') {
            const k = (t - b.t0) / 2.2;
            b.x += -b.face * (20 + k * 80) * 0.016;
            air = k * k * 40;
          } else {
            const k = Math.min(1, (t - b.t0) / 2);
            b.x += (b.hx - b.x) * 0.05;
            air = (1 - k) * 18;
          }
          x = b.x - cam.x;
          if (!onScreen(x, y - air)) return;
          const f = b.face;
          const yy = y - air;
          if (b.mode === 'fly' || b.mode === 'back') {
            const flap = Math.sin(t * 28 + i) > 0;
            rect(ctx, '#7a6a58', x - 2, yy - 2, 5, 2);
            rect(ctx, '#e8e0d0', x - 1, yy, 3, 1);
            rect(ctx, '#5a4a3a', x - 3 + (flap ? 0 : 1), yy - (flap ? 4 : 1), 2, 2);
            rect(ctx, '#5a4a3a', x + 2 - (flap ? 0 : 1), yy - (flap ? 4 : 1), 2, 2);
            return;
          }
          rect(ctx, 'rgba(0,0,0,0.2)', x - 2, y + 1, 5, 1);
          // Legs, twinkling.
          const step = Math.floor(t * 9 + i) % 2;
          rect(ctx, '#3a3228', x - 1 + step, y - 1, 1, 2);
          rect(ctx, '#3a3228', x + 1 - step, y - 1, 1, 2);
          const peck = b.hop ? 1 : 0;
          rect(ctx, '#8a7a64', x - 2, y - 4 + peck, 5, 3);
          rect(ctx, '#e8e0d0', x - 1 + (f > 0 ? 1 : 0), y - 3 + peck, 3, 2);
          rect(ctx, '#6a5a48', x - 2, y - 5 + peck, 3, 1);
          rect(ctx, '#8a7a64', x + f * 3 - (f < 0 ? 0 : 0), y - 5 + peck * 2, 2, 2);
          rect(ctx, '#2a2218', x + f * 4 + (f < 0 ? 1 : 0), y - 4 + peck * 3, 2, 1);
          rect(ctx, '#10100c', x + f * 3 + (f < 0 ? 1 : 0), y - 5 + peck * 2, 1, 1);
        });
      },
    },
  };
}

// ---- Sandhoppers ----

function hoppers(s) {
  const n = s.n ?? 5;
  const bugs = Array.from({ length: n }, (_, i) => ({
    x: s.x * T + hash(i + s.x) * (s.w ?? 2) * T, y: s.y * T + hash(i + 9 + s.y) * (s.h ?? 1) * T,
    hx: 0, hy: 0, t0: -9, vx: 0,
  }));
  bugs.forEach((b) => { b.hx = b.x; b.hy = b.y; });
  return {
    thing: {
      sortY: (s.y + (s.h ?? 1)) * T,
      draw(ctx, cam, t) {
        bugs.forEach((b, i) => {
          const d = nearest(s.scene, b.x, b.y);
          const hopNow = (d < 26 && t - b.t0 > 0.45) || (t - b.t0 > 3 + hash(i * 4 + Math.floor(t)) * 6);
          if (hopNow) {
            b.t0 = t;
            const away = d < 26 ? (b.x > s.scene.player.x + 6 ? 1 : -1) : (hash(t + i) < 0.5 ? -1 : 1);
            b.vx = away * (10 + hash(i + t) * 12);
          }
          const k = (t - b.t0) / 0.38;
          if (k < 1) b.x += b.vx * 0.016 * 2.4;
          // Drift home slowly so they stay in the weed.
          if (k >= 1) b.x += (b.hx - b.x) * 0.002;
          const x = b.x - cam.x;
          const y = b.y - cam.y;
          if (!onScreen(x, y)) return;
          const up = k < 1 ? Math.sin(k * Math.PI) * 6 : 0;
          rect(ctx, 'rgba(0,0,0,0.22)', x, y + 1, 2, 1);
          rect(ctx, '#b8a47a', x, y - up - 1, 2, 1);
          rect(ctx, '#7a6a48', x + 1, y - up, 1, 1);
        });
      },
    },
  };
}

// ---- Hermit crab ----

function hermit(s) {
  const hx = s.x * T + 8;
  const hy = s.y * T + 12;
  const r = (s.r ?? 1.5) * T;
  const seed = s.x * 2.1 + s.y * 7.7;
  let x = hx;
  let target = hx;
  let pause = 0;
  let closed = 0;
  let last = null;
  return {
    thing: {
      sortY: hy + 1,
      draw(ctx, cam, t) {
        const dt = last === null ? 0.016 : Math.max(0, Math.min(0.05, t - last));
        last = t;
        const d = nearest(s.scene, x, hy);
        if (d < 30) closed = 3;
        if (closed > 0) closed -= dt;
        else if (pause > 0) pause -= dt;
        else if (Math.abs(target - x) < 1) {
          target = hx + (hash(Math.floor(t) + seed) - 0.5) * 2 * r;
          pause = 1.5 + hash(t + seed) * 2.5;
        } else {
          x += Math.sign(target - x) * 7 * dt;
        }
        const sx = x - cam.x;
        const sy = hy - cam.y;
        if (!onScreen(sx, sy)) return;
        const lean = closed > 0 ? 0 : Math.sign(target - x) || 1;
        rect(ctx, 'rgba(0,0,0,0.2)', sx - 3, sy + 1, 7, 1);
        // The shell: a spiral whelk, cream and brown.
        rect(ctx, '#7a6446', sx - 2, sy - 3, 5, 4);
        rect(ctx, '#d8c8a0', sx - 2, sy - 4, 4, 4);
        rect(ctx, '#f0e4c4', sx - 1, sy - 5, 2, 1);
        rect(ctx, '#a08a58', sx - 1, sy - 3, 2, 1);
        if (closed <= 0) {
          const walk = Math.floor(t * 7) % 2;
          rect(ctx, '#d0603a', sx + lean * 3 - (lean < 0 ? 1 : 0), sy - 2, 2, 2);
          rect(ctx, '#e8804a', sx + lean * 4 - (lean < 0 ? 1 : 0), sy - 3, 1, 1);
          rect(ctx, '#a8482c', sx - 1 + walk, sy + 1, 1, 1);
          rect(ctx, '#a8482c', sx + 1 - walk, sy + 1, 1, 1);
        }
      },
    },
  };
}

// ---- Seal ----

function seal(s) {
  const hx = s.x * T + 8;
  const hy = s.y * T + 12;
  let mode = 'sleep';
  let t0 = 0;
  let until = 0;
  return {
    thing: {
      sortY: hy + 2,
      draw(ctx, cam, t) {
        const d = nearest(s.scene, hx, hy);
        if (mode === 'sleep' && d < 70) { mode = 'look'; t0 = t; }
        else if (mode === 'look' && d < 30) { mode = 'dive'; t0 = t; }
        else if (mode === 'look' && d > 90) mode = 'sleep';
        else if (mode === 'dive' && t - t0 > 0.9) { mode = 'gone'; until = t + 24; }
        else if (mode === 'gone' && t > until && d > 100) { mode = 'sleep'; }
        const x = hx - cam.x;
        const y = hy - cam.y;
        if (!onScreen(x, y, 40)) return;
        if (mode === 'gone') {
          // A wet shape left on the rock, and nothing else.
          rect(ctx, 'rgba(20, 40, 50, 0.35)', x - 8, y - 1, 15, 2);
          return;
        }
        const breathe = mode === 'sleep' ? Math.round(Math.sin(t * 1.3) * 0.7 + 0.3) : 0;
        const slide = mode === 'dive' ? Math.min(1, (t - t0) / 0.9) : 0;
        const ox = slide * 10;
        const oy = slide * 6;
        rect(ctx, 'rgba(0,0,0,0.22)', x - 9 + ox, y + 1 + oy, 18, 2);
        // The body, grey and sleek, a paler belly.
        rect(ctx, '#5a6068', x - 8 + ox, y - 5 + oy - breathe, 15, 5);
        rect(ctx, '#7c848c', x - 7 + ox, y - 6 + oy - breathe, 12, 2);
        rect(ctx, '#b8bcc0', x - 6 + ox, y - 1 + oy, 11, 1);
        rect(ctx, '#3a4048', x - 2 + ox, y - 4 + oy, 2, 1);
        rect(ctx, '#3a4048', x + 1 + ox, y - 3 + oy, 1, 1);
        // Tail flippers.
        rect(ctx, '#4a5058', x - 10 + ox, y - 3 + oy, 3, 2);
        // The head: down asleep, up and looking when you come near.
        const up = mode === 'look' ? 3 : mode === 'dive' ? 1 : 0;
        rect(ctx, '#6a727a', x + 5 + ox, y - 6 + oy - up, 5, 4);
        rect(ctx, '#8a929a', x + 6 + ox, y - 7 + oy - up, 3, 1);
        rect(ctx, '#2a2e34', x + 9 + ox, y - 5 + oy - up, 1, 1);
        rect(ctx, '#e8e4d8', x + 6 + ox, y - 2 + oy - up, 4, 1);
        if (mode === 'sleep') rect(ctx, '#2a2e34', x + 8 + ox, y - 5 + oy, 2, 1);
        else rect(ctx, '#10161c', x + 8 + ox, y - 6 + oy - up, 1, 1);
        // Whiskers, and a sleeper's slow bubble.
        if (mode === 'sleep') {
          const b = (t * 0.35) % 4;
          if (b < 1) rect(ctx, 'rgba(240, 250, 255, 0.5)', x + 11 + ox, y - 8 - b * 5, 1, 1);
        }
        if (mode === 'dive' && slide > 0.5) rect(ctx, 'rgba(235, 248, 250, 0.7)', x + 6 + ox, y + 5, 12, 1);
      },
    },
  };
}

// ---- Foam ----

function foam(s) {
  const x0 = s.x * T;
  const y0 = s.y * T;
  const w = (s.w ?? 4) * T;
  const wild = stormy(s);
  return {
    floor(ctx, cam, t) {
      const sx = x0 - cam.x;
      if (sx > W || sx + w < 0) return;
      const sy0 = y0 - cam.y;
      if (sy0 < -20 || sy0 > H + 20) return;
      for (let i = 0; i < w; i += 2) {
        const ph = i * 0.09 + t * (wild ? 1.1 : 0.7);
        const swell = (Math.sin(ph) + Math.sin(ph * 0.43 + 2)) * 0.5;
        const y = sy0 + (s.edge === 'top' ? 3 : s.edge === 'bottom' ? 11 : 7) + swell * (wild ? 4 : 2.4);
        const a = 0.22 + 0.3 * Math.max(0, Math.sin(ph * 1.7 + t * 0.4));
        rect(ctx, `rgba(236, 246, 240, ${a * (wild ? 1 : 0.8)})`, sx + i, y, 3, 1);
        if ((i * 5 + Math.floor(t * 0.7)) % 7 === 0) rect(ctx, `rgba(236, 246, 240, ${a * 0.8})`, sx + i + 1, y + 1, 2, 1);
        // The wet it leaves behind, darker, as it draws back.
        if (swell < 0) rect(ctx, 'rgba(20, 40, 50, 0.1)', sx + i, y + 1, 3, 2);
      }
    },
  };
}

// ---- Spray ----

function spray(s) {
  const bx = s.x * T + 8;
  const by = s.y * T + 8;
  const every = s.every ?? 7;
  const seed = s.x * 1.3 + s.y * 4.1;
  return {
    over(ctx, cam, t) {
      const k = ((t + seed) % every) / every;
      const wild = stormy(s);
      // A burst for the first part of the cycle, a puff of mist after.
      const dur = wild ? 0.22 : 0.16;
      if (k > dur) return;
      const u = k / dur;
      const x = bx - cam.x;
      const y = by - cam.y;
      if (!onScreen(x, y)) return;
      const n = wild ? 9 : 5;
      for (let i = 0; i < n; i++) {
        const dx = (hash(seed + i + Math.floor((t + seed) / every) * 3) - 0.5) * 18;
        const h = (wild ? 22 : 13) * (0.5 + hash(i + seed)) * Math.sin(u * Math.PI);
        rect(ctx, `rgba(236, 246, 248, ${0.8 - u * 0.5})`, x + dx * u * 1.3, y - h, 2, 2);
        if (i % 2 === 0) rect(ctx, `rgba(236, 246, 248, ${0.5 - u * 0.4})`, x + dx * u * 1.3 + 1, y - h + 3, 1, 1);
      }
      // Foam at the foot.
      rect(ctx, `rgba(236, 246, 248, ${0.7 - u * 0.5})`, x - 6 - u * 3, y, 13 + u * 6, 1);
    },
  };
}

// ---- Glints ----

function glint(s) {
  const pts = s.points ?? [];
  return {
    over(ctx, cam, t) {
      pts.forEach(([px, py], i) => {
        const x = px * T + 8 - cam.x;
        const y = py * T + 8 - cam.y;
        if (!onScreen(x, y)) return;
        const k = ((t + i * 2.7 + px) % 6) / 6;
        if (k > 0.1) return;
        const a = Math.sin((k / 0.1) * Math.PI);
        rect(ctx, `rgba(255, 250, 220, ${a})`, x, y, 1, 1);
        rect(ctx, `rgba(255, 250, 220, ${a * 0.6})`, x - 1, y, 3, 1);
        rect(ctx, `rgba(255, 250, 220, ${a * 0.6})`, x, y - 1, 1, 3);
      });
    },
  };
}


// ---- Foreground fronds ----

// Dark weed fronds and little rock humps growing up out of a wall's foot, drawn over
// everything for depth. x, y, w: the wall tile row and how many tiles across. They only
// rise a few pixels into the row above, so nobody's feet are hidden.
function fronds(s) {
  const x0 = s.x * T;
  const base = s.y * T + 3;
  const w = (s.w ?? 6) * T;
  const seed = s.x * 2.3 + s.y * 5.1;
  return {
    over(ctx, cam, t) {
      const sx = x0 - cam.x;
      if (sx > W + 8 || sx + w < -8) return;
      const by = base - cam.y;
      if (by < -20 || by > H + 20) return;
      const wild = stormy(s);
      for (let i = 0; i < w; i += 3) {
        const h = 4 + Math.floor(hash(seed + i * 0.37) * (hash(seed + i * 0.11) > 0.8 ? 12 : 7));
        const sway = Math.sin(t * (wild ? 2.1 : 1.1) + i * 0.21 + seed) * (wild ? 2 : 1);
        const x = sx + i;
        ctx.fillStyle = 'rgba(8, 26, 24, 0.92)';
        for (let k = 0; k < h; k++) {
          const lean = Math.round(sway * (k / h) * 1.5);
          ctx.fillRect(Math.round(x + lean), Math.round(by - k), 2, 1);
        }
        ctx.fillStyle = 'rgba(52, 112, 84, 0.75)';
        ctx.fillRect(Math.round(x + Math.round(sway * 1.5)), Math.round(by - h), 1, 1);
        if (h > 9) {
          ctx.fillRect(Math.round(x + 1 + Math.round(sway * 0.8)), Math.round(by - h * 0.6), 1, 1);
        }
      }
      // A dark hump of rock here and there, wet along the top.
      for (let i = 6; i < w - 8; i += 29 + Math.floor(hash(seed + i) * 20)) {
        ctx.fillStyle = 'rgba(10, 22, 26, 0.95)';
        ctx.fillRect(Math.round(sx + i), Math.round(by - 4), 9, 5);
        ctx.fillRect(Math.round(sx + i + 2), Math.round(by - 6), 5, 2);
        ctx.fillStyle = 'rgba(110, 160, 160, 0.35)';
        ctx.fillRect(Math.round(sx + i + 2), Math.round(by - 6), 4, 1);
      }
    },
  };
}

export const SHORE_KINDS = { pool, sandpipers, hoppers, hermit, seal, foam, spray, glint, fronds };
