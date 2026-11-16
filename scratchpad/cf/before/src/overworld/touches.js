import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, TILE_SIZE as T } from '../config.js';
import { glowSprite, roomLights } from './lamplight.js';
import { sfx } from '../audio/music.js';
import { ROOM_TOUCHES, AREA_TOUCHES } from '../data/touches.js';
import { R3D_TOUCHES } from '../data/r3dTouches.js';
import { COAST_KINDS } from './coastTouches.js';
import { ASH_KINDS, ashTouchesFor } from './ashTouches.js';
import { LANES_KINDS } from './lanesLife.js';
import { LANES_TOUCHES } from '../data/lanesTouches.js';
import { R3P_KINDS } from './r3pLife.js';
import { R3P_TOUCHES } from '../data/r3pTouches.js';
import { CITY_KINDS } from './cityLife.js';
import { CITY_TOUCHES } from '../data/cityTouches.js';
import { RUINS_KINDS } from './ruinsLife.js';
import { RUINS_TOUCHES } from '../data/ruinsTouches.js';
import { CAVE_KINDS } from './caveTouches.js';
import { CAVE_ROOM_TOUCHES } from '../data/caveTouches.js';
import { SHORE_KINDS } from './shoreLife.js';
import { SHORE_ROOM_TOUCHES } from '../data/shoreTouches.js';
import './diggingsLife.js';
import './hushLife.js';
import { ISLE_KINDS } from './isleTouches.js';
import { ISLE_ROOM_TOUCHES } from '../data/islesTouches.js';
import { TOWN_KINDS } from './townLife.js';
import { TOWN_ROOM_TOUCHES } from '../data/townTouches.js';
import { REST_KINDS } from './restLife.js';
import { R2R_ROOM_TOUCHES } from '../data/restTouches.js';
import { SHIP_KINDS } from './shipLife.js';
import { SHIP_ROOM_TOUCHES } from '../data/shipTouches.js';
import { SUNNY_KINDS, sunnyTouchesFor } from './sunnyLife.js';
import { MARSH_KINDS } from './marshLife.js';
import { MARSH_TOUCHES } from '../data/marshTouches.js';
import { VIGIL_KINDS } from './vigilLife.js';
import { VIGIL_ROOM_TOUCHES } from '../data/vigilTouches.js';
import { fract, hash } from '../engine/noise.js';

// TOUCHES: the small, living extras that give each Chapter 4 room its own
// look: bees over the flowers, a kite stuck in a tree, washing on a line, a
// canary in its cage, eyes in the dark that blink and are gone when you come
// near. Every one is drawn, never placed: none of them has a body, so none
// can block you, a beam, a cart or a cutscene walk. Positions are in tiles
// (decimals are fine; x, y is where the thing is, or its top left).
//
// Which touches a room has is a table in src/data/touches.js, by room id
// (plus a few for a whole area), so a room's own file doesn't change:
//
//   sunny_gate_field: [{ kind: 'kite', x: 24, y: 3 }, { kind: 'bees', x: 8, y: 7 }],
//
// Each kind below is a small function: given its spec and the scene, it
// returns up to three painters:
//   floor(ctx, cam, t)   on the ground, under everyone
//   thing  { sortY, draw(ctx, cam, t) }   stands among the props, in front of
//                                          or behind people by its y
//   over(ctx, cam, t)    glows, added on top after the room's lighting
// The coast's kinds (gulls, crabs, a cat, smoke, ropes, floats, blown bits,
// puddles) are in coastTouches.js. The player's spot is `scene.player` (pixels). Everything is worked out from
// the time and the player's place, so nothing is kept between frames except
// the odd flash.

const rect = (ctx, color, x, y, w = 1, h = 1) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};
const onScreen = (x, y, pad = 24) => x > -pad && x < W + pad && y > -pad && y < H + pad;
const near = (scene, px, py) => {
  const p = scene.player;
  return Math.hypot(p.x + 6 - px, p.y + 12 - py);
};
const glow = (ctx, color, x, y, r, alpha) => {
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.drawImage(glowSprite(color), x - r, y - r, r * 2, r * 2);
  ctx.globalAlpha = 1;
};

// A point that wanders on its own slow loops around a place (bees, flies,
// fireflies). Returns x, y.
const wander = (i, t, cx, cy, rx, ry, speed = 1) => {
  const a = t * speed * (0.8 + hash(i) * 0.9) + hash(i + 9) * 6.28;
  return [cx + Math.sin(a) * rx * (0.5 + hash(i + 3) * 0.5) + Math.sin(a * 2.7 + i) * rx * 0.25,
    cy + Math.cos(a * 1.3 + i) * ry * (0.5 + hash(i + 5) * 0.5)];
};

const KINDS = {
  // ---- Sunnyside ----

  // Bees working a patch of flowers: a few specks, yellow and dark, looping.
  bees: (s) => ({
    thing: {
      sortY: 1e7,
      draw(ctx, cam, t) {
        const cx = s.x * T + 8 - cam.x;
        const cy = s.y * T + 4 - cam.y;
        if (!onScreen(cx, cy)) return;
        for (let i = 0; i < (s.n ?? 3); i++) {
          const [x, y] = wander(i + s.x, t, cx, cy, 12, 6, 1.6);
          rect(ctx, '#2a1a10', x, y, 2, 1);
          rect(ctx, '#ffd23a', x + 1, y, 1, 1);
          if (Math.floor(t * 30 + i) % 2) rect(ctx, 'rgba(255,255,255,0.8)', x, y - 1, 1, 1);
        }
      },
    },
  }),

  // Tufts of tall grass that lean away from you as you pass, and sway on
  // their own in the breeze. `x, y, w, h` is the patch in tiles.
  grass: (s) => {
    const tufts = [];
    const n = Math.round(s.w * s.h * (s.density ?? 1.3));
    for (let i = 0; i < n; i++) {
      tufts.push({ x: (s.x + hash(i * 3 + s.x) * s.w) * T, y: (s.y + hash(i * 3 + 1 + s.y) * s.h) * T, h: 4 + Math.floor(hash(i * 3 + 2) * 4), shade: i % 3 });
    }
    const greens = s.colors ?? ['#4fa83d', '#3d8f30', '#6cc24a'];
    return {
      floor(ctx, cam, t) {
        for (const g of tufts) {
          const x = g.x - cam.x;
          const y = g.y - cam.y;
          if (!onScreen(x, y, 8)) continue;
          const d = near(s.scene, g.x, g.y);
          const push = d < 22 ? (1 - d / 22) * 3 * Math.sign(g.x - (s.scene.player.x + 6) || 1) : 0;
          const lean = Math.round(Math.sin(t * 1.6 + g.x * 0.2) * 1 + push);
          for (let k = -1; k <= 1; k++) {
            const hh = g.h - Math.abs(k);
            rect(ctx, greens[(g.shade + k + 3) % 3], x + k * 2 + Math.round(lean * 0.4), y - hh, 1, hh);
            rect(ctx, greens[(g.shade + k + 4) % 3], x + k * 2 + lean, y - hh - 1, 1, 1);
          }
        }
      },
    };
  },

  // A kite snagged in a tree (x, y: where its middle is): it flutters, its
  // tail tied in bows that wave.
  kite: (s) => ({
    thing: {
      sortY: s.y * T + 40,
      draw(ctx, cam, t) {
        const x = s.x * T - cam.x;
        const y = s.y * T - cam.y;
        if (!onScreen(x, y, 30)) return;
        const flap = Math.round(Math.sin(t * 3.1));
        // The diamond: red and cream halves, a cross of sticks.
        const rows = [[0, 1], [-1, 3], [-2, 5], [-3, 7], [-2, 5], [-1, 3], [0, 1]];
        rows.forEach(([off, len], r) => {
          rect(ctx, r < 3 ? '#e0453a' : '#f4e6c0', x + off + flap, y - 3 + r, len, 1);
        });
        rect(ctx, '#7a3a1a', x + flap, y - 3, 1, 7);
        rect(ctx, '#7a3a1a', x - 3 + flap, y, 7, 1);
        // The tail, with three bows.
        for (let i = 0; i < 9; i++) {
          const tx = x + flap + Math.round(Math.sin(t * 2.4 - i * 0.6) * (1 + i * 0.35));
          const ty = y + 4 + i;
          rect(ctx, '#e8d6b0', tx, ty);
          if (i % 3 === 2) {
            rect(ctx, '#3a7be0', tx - 1, ty, 3, 1);
            rect(ctx, '#ffd23a', tx, ty + 1, 1, 1);
          }
        }
      },
    },
  }),

  // A child's pinwheel stuck in the ground, spinning faster in a gust.
  pinwheel: (s) => ({
    thing: {
      sortY: s.y * T + 8,
      draw(ctx, cam, t) {
        const x = s.x * T + 8 - cam.x;
        const y = s.y * T + 14 - cam.y;
        if (!onScreen(x, y)) return;
        rect(ctx, '#8a5a2a', x, y - 8, 1, 8);
        const spin = Math.floor(t * (3 + 2 * Math.sin(t * 0.4) ** 2) * 4) % 4;
        const arms = [[[-1, -1], [-2, -2]], [[1, -1], [2, -2]], [[1, 1], [2, 2]], [[-1, 1], [-2, 2]]];
        const colors = ['#e0453a', '#3a7be0', '#ffd23a', '#4fa83d'];
        arms.forEach((arm, i) => {
          const c = colors[(i + spin) % 4];
          for (const [dx, dy] of arm) rect(ctx, c, x + dx, y - 10 + dy);
        });
        rect(ctx, '#fff', x, y - 10);
      },
    },
  }),

  // A fish now and then breaks the water of a stretch of it (x, y, w, h in
  // tiles): a small arc and rings.
  fishjump: (s) => ({
    over(ctx, cam, t) {
      const period = s.every ?? 6;
      for (let k = 0; k < (s.n ?? 2); k++) {
        const shifted = t + k * period * 0.47;
        const clock = shifted % period;
        if (clock > 1.4) continue;
        const seed = Math.floor(shifted / period) * 7 + k * 31;
        const px = (s.x + hash(seed) * s.w) * T - cam.x;
        const py = (s.y + hash(seed + 1) * s.h) * T - cam.y;
        if (!onScreen(px, py)) continue;
        if (clock < 0.55) {
          const u = clock / 0.55;
          const fx = px + (u - 0.5) * 8;
          const fy = py - Math.sin(u * Math.PI) * 7;
          rect(ctx, 'rgba(210,235,255,0.9)', fx, fy, 3, 1);
          rect(ctx, 'rgba(240,250,255,0.9)', fx + (u < 0.5 ? 2 : 0), fy - 1);
        }
        if (clock > 0.5) {
          const u = (clock - 0.5) / 0.9;
          for (let r = 0; r < 2; r++) {
            const rr = (u * 9 + r * 3) % 10;
            ctx.strokeStyle = `rgba(230,245,255,${(0.5 * (1 - u)).toFixed(2)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(Math.round(px) + 0.5, Math.round(py) + 0.5, rr, rr * 0.4, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
    },
  }),

  // A dragonfly that darts about over a place, hovering, then flicking off.
  dragonfly: (s) => ({
    thing: {
      sortY: 1e7,
      draw(ctx, cam, t) {
        const phase = t * 0.5 + s.x;
        const step = Math.floor(phase);
        const k = fract(phase);
        const ease = k < 0.25 ? k / 0.25 : 1;
        const px = (s.x + (hash(step) + (hash(step + 1) - hash(step)) * ease) * s.w) * T - cam.x;
        const py = (s.y + (hash(step + 40) + (hash(step + 41) - hash(step + 40)) * ease) * s.h) * T - cam.y + Math.sin(t * 9) * 0.6;
        if (!onScreen(px, py)) return;
        rect(ctx, s.color ?? '#3ad0d8', px, py, 3, 1);
        rect(ctx, '#fff', px + 1, py - 1);
        if (Math.floor(t * 40) % 2) rect(ctx, 'rgba(255,255,255,0.8)', px, py - 1, 3, 1);
      },
    },
  }),

  // ---- The Glimmering ----

  // Wavering bright lines on the floor, like light off water (x, y, w, h).
  caustics: (s) => ({
    floor(ctx, cam, t) {
      const x0 = s.x * T - cam.x;
      const y0 = s.y * T - cam.y;
      const span = s.w * T;
      if (x0 > W || y0 > H || x0 + span < 0 || y0 + s.h * T < 0) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const rows = Math.floor((s.h * T) / 3);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < 3; c++) {
          const wob = Math.sin(t * 0.9 + r * 0.8 + c * 2.1);
          const w = 4 + Math.round(hash(r * 7 + c) * 5);
          const dx = (hash(r * 5 + c * 11) * span + wob * 4 + t * 2) % span;
          if (dx + w > span) continue;
          const a = 0.1 + 0.1 * (0.5 + 0.5 * Math.sin(t * 1.3 + r + c * 3));
          rect(ctx, `rgba(${s.color ?? '140,235,255'},${a.toFixed(3)})`, x0 + dx, y0 + r * 3 + Math.round(wob), w, 1);
        }
      }
      ctx.restore();
    },
  }),

  // A column of soft light with motes turning in it (x, y, w, h in tiles: the
  // top left and the size of the shaft).
  shaft: (s) => ({
    over(ctx, cam, t) {
      const x0 = s.x * T - cam.x;
      const y0 = s.y * T - cam.y;
      const w = s.w * T;
      const h = s.h * T;
      if (x0 > W || y0 > H || x0 + w < 0 || y0 + h < 0) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const breathe = 0.8 + 0.2 * Math.sin(t * 0.6 + s.x);
      const col = s.color ?? '170,200,255';
      const g = ctx.createLinearGradient(0, y0, 0, y0 + h);
      g.addColorStop(0, `rgba(${col},${(0.13 * breathe).toFixed(3)})`);
      g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x0 + w * 0.2, y0);
      ctx.lineTo(x0 + w * 0.8, y0);
      ctx.lineTo(x0 + w, y0 + h);
      ctx.lineTo(x0, y0 + h);
      ctx.fill();
      for (let i = 0; i < 9; i++) {
        const my = y0 + ((((hash(i * 3) * h - t * (3 + hash(i) * 4)) % h) + h) % h);
        const mx = x0 + w * (0.2 + 0.6 * hash(i * 3 + 1)) + ((my - y0) / h) * (hash(i * 3 + 1) - 0.5) * w * 0.4 + Math.sin(t + i) * 2;
        rect(ctx, `rgba(255,250,235,${(0.3 + 0.4 * Math.abs(Math.sin(t * 1.2 + i))).toFixed(2)})`, mx, my);
      }
      ctx.restore();
    },
  }),

  // Crystals glint when you walk past: a four-pointed star and a brief bloom,
  // each at most once in a few seconds. `chime: true` also rings a soft ping
  // (leave it off where pings mean something, like the beam rooms).
  glints: (s) => {
    const lights = roomLights(s.scene.room, false).filter((l) => l.bloom && !l.sky && !l.color?.startsWith('255'));
    const last = new Map();
    const flashes = [];
    return {
      over(ctx, cam, t) {
        for (let i = 0; i < lights.length; i++) {
          const l = lights[i];
          if (near(s.scene, l.x, l.y) < 30 && t - (last.get(i) ?? -9) > 4) {
            last.set(i, t);
            flashes.push({ x: l.x, y: l.y - 3, t0: t, color: l.color });
            if (s.chime) sfx('ping');
          }
        }
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = flashes.length - 1; i >= 0; i--) {
          const f = flashes[i];
          const k = (t - f.t0) / 0.9;
          if (k >= 1 || k < 0) {
            flashes.splice(i, 1);
            continue;
          }
          const x = Math.round(f.x - cam.x);
          const y = Math.round(f.y - cam.y);
          const e = Math.sin(k * Math.PI);
          glow(ctx, f.color, x, y, 14 + 6 * e, 0.35 * e);
          const arm = 1 + Math.round(3 * e);
          const bright = `rgba(215,245,255,${(0.8 * e).toFixed(2)})`;
          rect(ctx, `rgba(255,255,250,${e.toFixed(2)})`, x, y);
          rect(ctx, bright, x - arm, y, arm, 1);
          rect(ctx, bright, x + 1, y, arm, 1);
          rect(ctx, bright, x, y - arm, 1, arm);
          rect(ctx, bright, x, y + 1, 1, arm);
        }
        ctx.restore();
      },
    };
  },

  // ---- Belowtown ----

  // Washing on a line from (x, y) to (x2, y2): sheets and socks swaying.
  laundry: (s) => ({
    thing: {
      sortY: Math.max(s.y, s.y2 ?? s.y) * T + 6,
      draw(ctx, cam, t) {
        const x1 = s.x * T - cam.x;
        const y1 = s.y * T - cam.y;
        const x2 = (s.x2 ?? s.x + 4) * T - cam.x;
        const y2 = (s.y2 ?? s.y) * T - cam.y;
        if (x2 < -20 || x1 > W + 20 || y1 > H + 20 || y2 < -40) return;
        const len = Math.round(x2 - x1);
        const sag = (u) => Math.round(Math.sin(u * Math.PI) * 3);
        // A post at each end to hold the line up, with a crossbar and a footing
        // (`posts: false` when it's tied to something already standing there, like two lamp posts).
        for (const [px, py] of s.posts === false ? [] : [[x1, y1], [x2, y2]]) {
          const top = Math.round(py) - 2;
          const post = Math.round(px) - 1;
          rect(ctx, '#3a2a1a', post - 1, top, 4, 20);
          rect(ctx, '#7a5a38', post, top, 2, 19);
          rect(ctx, '#a07a4c', post, top, 1, 19);
          rect(ctx, '#3a2a1a', post - 2, top + 1, 6, 1);
          rect(ctx, '#5a4a3a', post - 2, top + 19, 6, 2);
          rect(ctx, '#8a7a68', post - 1, top + 19, 4, 1);
        }
        for (let i = 0; i <= len; i++) {
          const u = i / len;
          rect(ctx, '#5a4430', x1 + i, y1 + (y2 - y1) * u + sag(u));
        }
        const cloths = [['#f4efe0', 8, 12], ['#e0746a', 4, 7], ['#7aa6d8', 6, 13], ['#f2d36a', 4, 6], ['#9fcf8a', 7, 10]];
        const count = s.items ?? Math.max(2, Math.floor(len / 14));
        for (let i = 0; i < count; i++) {
          const [col, w, h] = cloths[i % cloths.length];
          const u = (i + 0.6) / (count + 0.2);
          const cx = x1 + len * u;
          const cy = y1 + (y2 - y1) * u + sag(u) + 1;
          const swing = Math.sin(t * 1.5 + i * 1.7) * 1.4;
          for (let r = 0; r < h; r++) {
            const sw = Math.round(swing * (r / h));
            rect(ctx, col, cx + sw, cy + r, w, 1);
            if (r > 1 && r % 3 === 0) rect(ctx, 'rgba(0,0,0,0.12)', cx + sw + w - 1, cy + r);
          }
          rect(ctx, '#3a2c1c', cx + 1, cy - 1, 1, 2);
        }
      },
    },
  }),

  // A string of little lanterns, swaying, each with its own warm glow.
  lanterns: (s) => {
    const n = s.n ?? 5;
    const at = (i, t) => {
      const u = (i + 0.5) / n;
      return [s.x + (s.x2 - s.x) * u, s.y + (s.y2 - s.y) * u + Math.sin(u * Math.PI) * 0.22, Math.sin(t * 1.1 + i * 0.9) * 1.2];
    };
    return {
      thing: {
        sortY: Math.max(s.y, s.y2) * T + 4,
        draw(ctx, cam, t) {
          const x1 = s.x * T - cam.x;
          const x2 = s.x2 * T - cam.x;
          if (x2 < -20 || x1 > W + 20) return;
          // posts: true stands a post at each end so the string never hangs from nothing.
          if (s.posts) {
            for (const [px, py] of [[x1, s.y * T - cam.y], [x2, s.y2 * T - cam.y]]) {
              const post = Math.round(px) - 1;
              const top = Math.round(py) - 2;
              rect(ctx, '#2a1c10', post - 1, top, 4, 22);
              rect(ctx, '#7a5a38', post, top, 2, 21);
              rect(ctx, '#a07a4c', post, top, 1, 21);
              rect(ctx, '#2a1c10', post - 2, top + 1, 6, 1);
              rect(ctx, '#4a3a2a', post - 2, top + 21, 6, 2);
            }
          }
          for (let i = 0; i <= Math.round(x2 - x1); i++) {
            const u = i / (x2 - x1);
            rect(ctx, '#3a2c1c', x1 + i, (s.y + (s.y2 - s.y) * u) * T - cam.y + Math.round(Math.sin(u * Math.PI) * 3.5));
          }
          for (let i = 0; i < n; i++) {
            const [tx, ty, sw] = at(i, t);
            const x = tx * T - cam.x + sw;
            const y = ty * T - cam.y + 3;
            rect(ctx, '#3a2c1c', x, y - 1, 1, 2);
            rect(ctx, s.shell ?? '#c43a2a', x - 1, y + 1, 3, 1);
            rect(ctx, '#ffd890', x - 1, y + 2, 3, 2);
            rect(ctx, '#ffe9b8', x, y + 2);
            rect(ctx, s.shell ?? '#c43a2a', x - 1, y + 4, 3, 1);
          }
        },
      },
      over(ctx, cam, t) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < n; i++) {
          const [tx, ty, sw] = at(i, t);
          glow(ctx, s.color ?? '255, 190, 100', tx * T - cam.x + sw, ty * T - cam.y + 5, 13, 0.2 + 0.05 * Math.sin(t * 5 + i * 3));
        }
        ctx.restore();
      },
    };
  },

  // Steam curling up from a kettle or a pot.
  steam: (s) => ({
    over(ctx, cam, t) {
      const x = s.x * T + 8 - cam.x;
      const y = s.y * T + 4 - cam.y;
      if (!onScreen(x, y)) return;
      for (let i = 0; i < 7; i++) {
        const life = fract(t * 0.45 + i / 7);
        const px = x + Math.sin(life * 6 + i) * (1 + life * 3) + (s.lean ?? 0) * life * 4;
        const py = y - life * 20;
        const a = Math.sin(life * Math.PI) * 0.4;
        rect(ctx, `rgba(240,240,240,${a.toFixed(3)})`, px, py, 2, 2);
        rect(ctx, `rgba(240,240,240,${(a * 0.6).toFixed(3)})`, px + 1, py - 1);
      }
    },
  }),

  // Something small asleep on a sill or a step: a round cat-thing with its
  // tail round its feet, breathing, and a Z climbing off it now and then.
  sleeper: (s) => ({
    thing: {
      sortY: s.y * T + 12,
      draw(ctx, cam, t) {
        const x = s.x * T + 3 - cam.x;
        const y = s.y * T + 12 - cam.y;
        if (!onScreen(x, y)) return;
        const body = s.color ?? '#b8a08a';
        const dark = s.dark ?? '#8a7460';
        const breathe = Math.sin(t * 1.6) > 0.2 ? 1 : 0;
        rect(ctx, body, x + 1, y - 4 - breathe, 8, 4 + breathe);
        rect(ctx, body, x + 2, y - 5 - breathe, 6, 1);
        rect(ctx, dark, x + 1, y - 1, 8, 1);
        rect(ctx, dark, x + 6, y - 6 - breathe, 2, 2);
        rect(ctx, dark, x + 2, y - 6 - breathe, 2, 2);
        rect(ctx, body, x - 1, y - 2, 2, 2);
        rect(ctx, dark, x - 2, y - 1, 2, 1);
        rect(ctx, '#2a2018', x + 3, y - 4 - breathe);
        rect(ctx, '#2a2018', x + 6, y - 4 - breathe);
        // Stroked (a `looks` spot with `pet: true`): one eye opens, a while, and
        // shuts again, and no Z till it's back off.
        const since = s.scene.pettedAt == null ? Infinity : t - s.scene.pettedAt;
        if (since < 2.4) {
          if (since > 0.2 && since < 1.8) rect(ctx, s.eye ?? '#e8d050', x + 6, y - 4 - breathe);
          return;
        }
        // A Z.
        const life = fract(t * 0.3);
        const zx = x + 8 + life * 3;
        const zy = y - 8 - life * 9;
        const a = Math.sin(life * Math.PI);
        ctx.fillStyle = `rgba(255,255,255,${(0.85 * a).toFixed(2)})`;
        ctx.fillRect(Math.round(zx), Math.round(zy), 3, 1);
        ctx.fillRect(Math.round(zx) + 1, Math.round(zy) + 1, 1, 1);
        ctx.fillRect(Math.round(zx), Math.round(zy) + 2, 3, 1);
      },
    },
  }),

  // Sparks flying off a hot place and cooling to nothing.
  sparks: (s) => ({
    over(ctx, cam, t) {
      const x = s.x * T + 8 - cam.x;
      const y = s.y * T + 8 - cam.y;
      if (!onScreen(x, y, 40)) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < (s.n ?? 8); i++) {
        const life = fract(t * (0.6 + hash(i) * 0.5) + hash(i + 7));
        const sx = x + (hash(i + 3) - 0.5) * 12 + Math.sin(life * 5 + i) * 6 * life;
        const sy = y - life * (14 + hash(i + 4) * 16) + life * life * 10;
        rect(ctx, `rgba(255,${Math.round(200 - life * 120)},80,${((1 - life) * 0.9).toFixed(2)})`, sx, sy);
      }
      ctx.restore();
    },
  }),

  // A cloth banner hung from its top edge, swaying (x, y: top left in tiles;
  // `w`, `h` in pixels).
  banner: (s) => ({
    thing: {
      sortY: s.y * T + (s.h ?? 24) + (s.sort ?? 0),
      draw(ctx, cam, t) {
        const x = s.x * T - cam.x;
        const y = s.y * T - cam.y;
        const w = s.w ?? 10;
        const h = s.h ?? 24;
        if (!onScreen(x, y, 30)) return;
        rect(ctx, '#6a4a2a', x - 1, y - 1, w + 2, 1);
        for (let r = 0; r < h; r++) {
          const sw = Math.round(Math.sin(t * 1.3 + r * 0.12 + s.x) * (r / h) * 1.6);
          const taper = r > h - 3 ? (r - (h - 3)) * 2 : 0;
          rect(ctx, s.color ?? '#a8323a', x + sw + taper / 2, y + r, w - taper, 1);
          rect(ctx, s.trim ?? '#e8c25a', x + sw + taper / 2, y + r);
          rect(ctx, s.trim ?? '#e8c25a', x + sw + w - 1 - taper / 2, y + r);
        }
        if (s.emblem !== false) {
          const sw = Math.round(Math.sin(t * 1.3 + 4 + s.x) * 0.4);
          rect(ctx, s.trim ?? '#e8c25a', x + sw + w / 2 - 1, y + 5, 2, 4);
          rect(ctx, s.trim ?? '#e8c25a', x + sw + w / 2 - 2, y + 7, 4, 1);
        }
      },
    },
  }),

  // ---- The Diggings ----

  // Water dripping from a spot (x, y in tiles) down `fall` tiles to a ring.
  // `dust: true` makes it a trickle of grit instead.
  drip: (s) => ({
    over(ctx, cam, t) {
      const period = s.every ?? 3.2;
      const clock = (t + ((s.x * 7 + s.y * 3) % period)) % period;
      const x = s.x * T + 8 - cam.x;
      const y0 = s.y * T - cam.y;
      const fall = (s.fall ?? 2) * T;
      if (!onScreen(x, y0 + fall, 40)) return;
      const color = s.dust ? '196,170,130' : '170,220,255';
      const drop = 0.6 + (s.fall ?? 2) * 0.15;
      if (clock < 0.7) {
        const u = clock / 0.7;
        rect(ctx, `rgba(${color},${(0.4 + 0.4 * u).toFixed(2)})`, x, y0 + u * u * 3, 1, Math.min(2, Math.round(u * 3)));
      } else if (clock < 0.7 + drop) {
        const u = (clock - 0.7) / drop;
        rect(ctx, `rgba(${color},0.9)`, x, y0 + 3 + u * u * (fall - 3), 1, 2);
      } else if (clock < 0.7 + drop + 0.8) {
        const u = (clock - 0.7 - drop) / 0.8;
        ctx.strokeStyle = `rgba(${color},${(0.6 * (1 - u)).toFixed(2)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(Math.round(x) + 0.5, Math.round(y0 + fall) + 0.5, 1 + u * 5, (1 + u * 5) * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();
        if (s.dust) {
          for (let i = 0; i < 4; i++) rect(ctx, `rgba(${color},${(0.5 * (1 - u)).toFixed(2)})`, x - 3 + i * 2 + u * (i - 1.5) * 3, y0 + fall - u * 3);
        }
      }
    },
  }),

  // A lamp on a chain from the roof: swings a little on its own, and a lot
  // more when you go by (x, y: where it hangs from; `len` px of chain).
  hanglamp: (s) => {
    let swing = 0;
    let vel = 0;
    let last = null;
    const spot = { x: 0, y: 0 };
    return {
      thing: {
        sortY: s.y * T + (s.len ?? 14) + 12,
        draw(ctx, cam, t) {
          const dt = last === null ? 0.016 : Math.max(0, Math.min(0.05, t - last));
          last = t;
          const len = s.len ?? 14;
          const ox = s.x * T + 8;
          const oy = s.y * T;
          const d = near(s.scene, ox, oy + len);
          const p = s.scene.player;
          if (d < 40 && Math.abs(swing) < 0.5) vel += (p.x + 6 > ox ? -1 : 1) * dt * 14 * (1 - d / 40) * (p.moving ? 1 : 0.2);
          vel += (-swing * 14 - vel * 0.35) * dt;
          swing += vel * dt;
          const sway = swing + Math.sin(t * 1.1 + s.x) * 0.06;
          const x = ox - cam.x;
          const y = oy - cam.y;
          if (!onScreen(x, y + len, 30)) return;
          const bx = x + Math.sin(sway) * len;
          const by = y + Math.cos(sway) * len;
          for (let i = 0; i <= len; i += 2) rect(ctx, '#4a4038', x + Math.sin(sway) * i, y + Math.cos(sway) * i);
          rect(ctx, '#2a2420', bx - 2, by, 5, 1);
          rect(ctx, '#ffcf70', bx - 2, by + 1, 5, 3);
          rect(ctx, '#fff0c0', bx - 1, by + 2, 3, 1);
          rect(ctx, '#2a2420', bx - 2, by + 4, 5, 1);
          spot.x = bx + cam.x;
          spot.y = by + cam.y;
        },
      },
      over(ctx, cam, t) {
        if (!spot.x) return;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        glow(ctx, '255, 190, 100', spot.x - cam.x, spot.y - cam.y + 3, 20, 0.3 + 0.04 * Math.sin(t * 7));
        ctx.restore();
      },
    };
  },

  // A canary in a little cage: it hops from perch to perch, and now and then
  // sings (a note rises off it).
  canary: (s) => ({
    thing: {
      sortY: s.y * T + 12,
      draw(ctx, cam, t) {
        const x = s.x * T + 3 - cam.x;
        const y = s.y * T + 10 - cam.y;
        if (!onScreen(x, y)) return;
        // A hook above, and the cage: a dome, bars, a floor.
        rect(ctx, '#6a5a3a', x + 5, y - 16, 1, 5);
        rect(ctx, '#8a7a4a', x + 2, y - 11, 8, 1);
        rect(ctx, '#8a7a4a', x + 3, y - 12, 6, 1);
        for (const bx of [2, 4, 6, 8, 10]) rect(ctx, '#a89a6a', x + bx - 1 + (bx > 6 ? 1 : 0), y - 10, 1, 9);
        rect(ctx, '#6a5a3a', x + 1, y - 1, 11, 2);
        rect(ctx, '#6a5a3a', x + 2, y - 5, 8, 1);
        // On a stand: a pole and a little foot.
        rect(ctx, '#5a4a30', x + 6, y + 1, 1, 6);
        rect(ctx, '#5a4a30', x + 3, y + 7, 7, 1);
        // The bird.
        const side = Math.floor(t * 0.5) % 2;
        const hop = fract(t * 0.5) < 0.12 ? 1 : 0;
        const bx = x + (side ? 7 : 3);
        const by = y - 5 - hop;
        rect(ctx, '#ffd23a', bx, by - 3, 3, 3);
        rect(ctx, '#ffe97a', bx + (side ? 0 : 2), by - 4, 1, 2);
        rect(ctx, '#e8a020', bx + (side ? -1 : 3), by - 2);
        rect(ctx, '#2a1a10', bx + (side ? 0 : 2), by - 3);
        // A note, every so often.
        const song = (t * 0.35) % 3;
        if (song < 1) {
          const nx = bx + 1 + Math.sin(song * 7) * 2;
          const ny = by - 6 - song * 9;
          ctx.fillStyle = `rgba(255,236,150,${Math.sin(song * Math.PI).toFixed(2)})`;
          ctx.fillRect(Math.round(nx), Math.round(ny), 2, 2);
          ctx.fillRect(Math.round(nx) + 1, Math.round(ny) - 3, 1, 3);
        }
      },
    },
  }),

  // A miner's lunch tin left on the floor, lid ajar, still warm: a thread of
  // steam curls up off it and thins out (x, y: its top left tile).
  lunchtin: (s) => ({
    thing: {
      sortY: s.y * T + 14,
      draw(ctx, cam, t) {
        const x = s.x * T + 4 - cam.x;
        const y = s.y * T + 8 - cam.y;
        if (!onScreen(x, y)) return;
        // The tin: a dented body, a rim, a lid propped open on one side, a spoon.
        rect(ctx, '#2a2420', x, y + 1, 9, 6);
        rect(ctx, '#8a8f98', x + 1, y + 2, 7, 4);
        rect(ctx, '#b8bdc6', x + 1, y + 2, 7, 1);
        rect(ctx, '#6a6f78', x + 1, y + 5, 7, 1);
        rect(ctx, '#2a2420', x + 6, y - 2, 4, 1);
        rect(ctx, '#8a8f98', x + 7, y - 1, 3, 1);
        rect(ctx, '#5a3a22', x + 2, y + 1, 5, 1);
        rect(ctx, '#c9a35a', x + 3, y, 1, 1);
        rect(ctx, '#e0e4ea', x + 1, y - 1, 1, 2);
        // Steam: three wisps, each rising and fading on its own clock.
        for (let i = 0; i < 3; i++) {
          const k = fract(t * 0.32 + i / 3);
          const wx = x + 3 + i * 1.5 + Math.sin(k * 7 + i * 2) * (1 + k * 2);
          const wy = y - 2 - k * 14;
          ctx.fillStyle = `rgba(235, 235, 240, ${(Math.sin(k * Math.PI) * 0.5).toFixed(2)})`;
          ctx.fillRect(Math.round(wx), Math.round(wy), 2, 2);
          ctx.fillRect(Math.round(wx) + (i % 2 ? -1 : 1), Math.round(wy) - 2, 1, 2);
        }
      },
    },
  }),

  // A bat or two flitting across the roof now and then.
  bats: (s) => ({
    over(ctx, cam, t) {
      const period = s.every ?? 14;
      const clock = (t + s.x * 1.7) % period;
      if (clock > 4) return;
      const u = clock / 4;
      const x = (s.x + (s.w ?? 8) * u) * T - cam.x;
      const y = (s.y + Math.sin(u * 9) * 0.35) * T - cam.y;
      if (!onScreen(x, y)) return;
      for (let b = 0; b < (s.n ?? 2); b++) {
        const bx = x - b * 9;
        const by = y + b * 3 + Math.sin(u * 12 + b) * 2;
        const up = Math.floor(t * 14 + b) % 2;
        rect(ctx, '#1a1020', bx, by, 2, 1);
        rect(ctx, '#1a1020', bx - 2, by - up, 2, 1);
        rect(ctx, '#1a1020', bx + 2, by - up, 2, 1);
        rect(ctx, '#1a1020', bx - 3, by + (up ? 0 : 1));
        rect(ctx, '#1a1020', bx + 4, by + (up ? 0 : 1));
      }
    },
  }),

  // Glints in an exposed seam of ore: a few points that wink in turn.
  seam: (s) => ({
    over(ctx, cam, t) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < (s.n ?? 6); i++) {
        const x = (s.x + hash(i + s.x) * s.w) * T - cam.x;
        const y = (s.y + hash(i + 20 + s.y) * s.h) * T - cam.y;
        if (!onScreen(x, y)) continue;
        const k = ((t * 0.5 + hash(i + 50)) % 3) / 0.5;
        if (k > 1) continue;
        const e = Math.sin(k * Math.PI);
        const col = s.color ?? '255, 226, 140';
        const dim = `rgba(${col},${(e * 0.6).toFixed(2)})`;
        rect(ctx, `rgba(${col},${e.toFixed(2)})`, x, y);
        rect(ctx, dim, x - 1, y);
        rect(ctx, dim, x + 1, y);
        rect(ctx, dim, x, y - 1);
        rect(ctx, dim, x, y + 1);
      }
      ctx.restore();
    },
  }),

  // ---- The Stillwater and the Deep ----

  // Fireflies wandering over a patch (x, y, w, h in tiles), each blinking.
  fireflies: (s) => ({
    over(ctx, cam, t) {
      const cx = (s.x + s.w / 2) * T - cam.x;
      const cy = (s.y + s.h / 2) * T - cam.y;
      if (!onScreen(cx, cy, s.w * T)) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < (s.n ?? 6); i++) {
        const [x, y] = wander(i + s.x * 3, t, cx, cy, s.w * T * 0.5, s.h * T * 0.5, 0.5);
        const blink = Math.max(0, Math.sin(t * 1.7 + hash(i) * 9));
        if (blink < 0.05) continue;
        const col = s.color ?? '210, 255, 120';
        glow(ctx, col, x, y, 7, 0.4 * blink);
        rect(ctx, `rgba(${col},${blink.toFixed(2)})`, x, y);
      }
      ctx.restore();
    },
  }),

  // Lily pads floating on the water, each bobbing (points: [[x, y], ...] in tiles).
  pads: (s) => ({
    floor(ctx, cam, t) {
      s.points.forEach(([px, py], i) => {
        const x = px * T + Math.sin(t * 0.5 + i * 2) * 1.5 - cam.x;
        const y = py * T + Math.cos(t * 0.6 + i) - cam.y;
        if (!onScreen(x, y)) return;
        const bob = Math.round(Math.sin(t * 1.1 + i * 1.3));
        rect(ctx, '#2f7a4a', x + 1, y + bob, 6, 1);
        rect(ctx, '#3f9a5a', x, y + 1 + bob, 8, 2);
        rect(ctx, '#2f7a4a', x + 1, y + 3 + bob, 6, 1);
        rect(ctx, '#1a3a30', x + 4, y + 1 + bob, 4, 1);
        if (i % 2 === 0) {
          rect(ctx, '#ffd0e8', x + 3, y + bob, 2, 1);
          rect(ctx, '#fff', x + 3, y - 1 + bob);
        }
      });
    },
  }),

  // Moss that breathes: patches that glow slowly, and glow more (and lift
  // spores) the nearer you are (points: [[x, y], ...] in tiles).
  moss: (s) => ({
    over(ctx, cam, t) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      s.points.forEach(([px, py], i) => {
        const x = px * T + 8 - cam.x;
        const y = py * T + 8 - cam.y;
        if (!onScreen(x, y, 30)) return;
        const brighten = Math.max(0, 1 - near(s.scene, px * T + 8, py * T + 8) / 80);
        const breathe = 0.5 + 0.5 * Math.sin(t * 0.9 + i * 1.9);
        const col = s.color ?? '90, 240, 190';
        glow(ctx, col, x, y, 10 + 8 * brighten, 0.1 + 0.08 * breathe + 0.3 * brighten);
        for (let k = 0; k < 4; k++) {
          rect(ctx, `rgba(${col},${(0.25 + 0.3 * breathe + 0.4 * brighten).toFixed(2)})`, x - 6 + hash(i * 5 + k) * 12, y - 2 + hash(i * 5 + k + 9) * 6, 2, 1);
        }
        if (brighten > 0.2) {
          for (let k = 0; k < 3; k++) {
            const life = fract(t * 0.5 + k / 3 + i * 0.2);
            rect(ctx, `rgba(${col},${(brighten * Math.sin(life * Math.PI)).toFixed(2)})`, x - 3 + k * 3 + Math.sin(life * 5 + k) * 2, y - life * 14);
          }
        }
      });
      ctx.restore();
    },
  }),

  // Eyes in the dark: a pair that blinks, watching. Come near and they close,
  // and they're gone; they come back once you've moved off.
  eyes: (s) => {
    const points = s.points ?? [[s.x, s.y]];
    const state = points.map(() => ({ gone: 0, fade: 1 }));
    return {
      over(ctx, cam, t) {
        points.forEach(([px, py], i) => {
          const st = state[i];
          const x = px * T + 8 - cam.x;
          const y = py * T + 8 - cam.y;
          if (near(s.scene, px * T + 8, py * T + 8) < 46) st.gone = t + 6;
          const away = t < st.gone;
          st.fade += ((away ? 0 : 1) - st.fade) * (away ? 0.25 : 0.015);
          if (st.fade < 0.03 || !onScreen(x, y)) return;
          const blink = ((t + i * 3.1) % 4.3) < 0.14 || (away && st.fade > 0.1);
          const col = s.color ?? '255, 210, 90';
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          glow(ctx, col, x, y, 6, 0.15 * st.fade);
          if (blink) {
            rect(ctx, `rgba(${col},${(0.7 * st.fade).toFixed(2)})`, x - 3, y, 2, 1);
            rect(ctx, `rgba(${col},${(0.7 * st.fade).toFixed(2)})`, x + 2, y, 2, 1);
          } else {
            rect(ctx, `rgba(${col},${st.fade.toFixed(2)})`, x - 3, y - 1, 2, 2);
            rect(ctx, `rgba(${col},${st.fade.toFixed(2)})`, x + 2, y - 1, 2, 2);
          }
          ctx.restore();
        });
      },
    };
  },

  // Bubbles climbing up through water (x, y in tiles).
  bubbles: (s) => ({
    over(ctx, cam, t) {
      const x = s.x * T + 8 - cam.x;
      const y = s.y * T + 8 - cam.y;
      if (!onScreen(x, y)) return;
      for (let i = 0; i < 4; i++) {
        const life = fract(t * 0.35 + i / 4);
        rect(ctx, `rgba(220,245,255,${(0.7 * Math.sin(life * Math.PI)).toFixed(2)})`, x + Math.sin(life * 8 + i * 2) * 2, y - life * 18, 1 + (i % 2), 1 + (i % 2));
      }
    },
  }),

  // Spores or motes rising out of a patch (x, y, w, h in tiles), in a colour.
  spores: (s) => ({
    over(ctx, cam, t) {
      const x0 = s.x * T - cam.x;
      const y0 = s.y * T - cam.y;
      if (!onScreen(x0 + (s.w * T) / 2, y0, s.w * T)) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < (s.n ?? 8); i++) {
        const life = fract(t * (0.12 + hash(i) * 0.1) + hash(i + 3));
        const x = x0 + hash(i + 11) * s.w * T + Math.sin(t * 0.8 + i) * 3;
        const y = y0 + s.h * T - life * (s.h * T + 16);
        rect(ctx, `rgba(${s.color ?? '150, 255, 220'},${(0.7 * Math.sin(life * Math.PI)).toFixed(2)})`, x, y, 1 + (i % 3 === 0 ? 1 : 0), 1);
      }
      ctx.restore();
    },
  }),
};

// What a scene holds: all the touches for its room.
export class Touches {
  constructor(scene) {
    this.scene = scene;
    const id = scene.roomData.id;
    // Round a spire only the mountain's own living things run (they bend with it: see vigilLife.js).
    const specs = scene.spire ? [...(VIGIL_ROOM_TOUCHES[id] ?? [])] : [...(VIGIL_ROOM_TOUCHES[id] ?? []), ...(AREA_TOUCHES[scene.roomData.area] ?? []), ...(ROOM_TOUCHES[id] ?? []), ...(CAVE_ROOM_TOUCHES[id] ?? []), ...(ISLE_ROOM_TOUCHES[id] ?? []), ...(SHORE_ROOM_TOUCHES[id] ?? []), ...(TOWN_ROOM_TOUCHES[id] ?? []), ...(R2R_ROOM_TOUCHES[id] ?? []), ...(LANES_TOUCHES[id] ?? []), ...(R3P_TOUCHES[id] ?? []), ...(MARSH_TOUCHES[id] ?? []), ...(SHIP_ROOM_TOUCHES[id] ?? []), ...(CITY_TOUCHES[id] ?? []), ...(RUINS_TOUCHES[id] ?? []), ...ashTouchesFor(scene.roomData), ...sunnyTouchesFor(scene.roomData), ...(R3D_TOUCHES[id] ?? [])];
    this.list = [];
    // `when: 'storm'` or `when: 'calm'`: only while a green-storm room's storm is on, or once it has
    // lifted (the room's `calmAfter`); a room with no `calmAfter` is never calm.
    const calm = Boolean(scene.calm);
    for (const spec of specs) {
      if (spec.when === 'storm' ? calm : spec.when === 'calm' ? !calm : false) continue;
      const make = KINDS[spec.kind] ?? COAST_KINDS[spec.kind] ?? CAVE_KINDS[spec.kind] ?? ISLE_KINDS[spec.kind] ?? SHORE_KINDS[spec.kind] ?? TOWN_KINDS[spec.kind] ?? REST_KINDS[spec.kind] ?? LANES_KINDS[spec.kind] ?? R3P_KINDS[spec.kind] ?? SHIP_KINDS[spec.kind] ?? CITY_KINDS[spec.kind] ?? RUINS_KINDS[spec.kind] ?? ASH_KINDS[spec.kind] ?? VIGIL_KINDS[spec.kind] ?? SUNNY_KINDS[spec.kind] ?? MARSH_KINDS[spec.kind];
      if (!make) throw new Error(`Room '${id}': unknown touch '${spec.kind}'`);
      const parts = make({ ...spec, scene });
      this.list.push(parts);
    }
    // Things that stand among the props draw at the scene's clock.
    this.things = this.list.filter((p) => p.thing).map((p) => {
      const { thing } = p;
      const draw = thing.draw;
      thing.draw = (ctx, cam) => draw.call(thing, ctx, cam, this.scene.time);
      return thing;
    });
  }

  get empty() {
    return this.list.length === 0;
  }

  drawFloor(ctx) {
    const t = this.scene.time;
    for (const p of this.list) p.floor?.(ctx, this.scene.camera, t);
  }

  drawOver(ctx) {
    const t = this.scene.time;
    for (const p of this.list) p.over?.(ctx, this.scene.camera, t);
  }
}

export function makeTouches(scene) {
  if (scene.spire && !VIGIL_ROOM_TOUCHES[scene.roomData.id]) return null;
  const touches = new Touches(scene);
  return touches.empty ? null : touches;
}
