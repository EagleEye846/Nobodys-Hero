import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, TILE_SIZE as T } from '../config.js';
import { STORM_AREAS } from '../data/areas.js';
import { fract, hash } from '../engine/noise.js';
import { glowSprite } from './lamplight.js';

// LANES LIFE: the small living things of the Sunken Lanes and the Soundings, as more kinds for
// touches.js (same rules: drawn only, no bodies, nothing can bump into them). Water ones look at
// the room's tiles every frame, so a tide that comes in or goes out takes the fish and the
// floating things with it (they only show over water that is there right now).
//
//   swimfish  shadows of fish in the flooded streets: they nose about, and dart off when you
//             wade near. `pale: true` for the blind white fish of the caves
//   bobbers   belongings afloat: a chair, a bucket, a hat, apples, a bottle... each turns slowly
//             on the water and bobs. `items: [{ k, x, y }]`
//   rainrings rings spreading on the water where the rain lands (storm) or a drip does (calm)
//   duck      a duck on a doorstep: preens, dozes, waddles; goes into the water if you come near
//             and is back once you've gone
//   moths     moths round a lamp, bumping its glass
//   snail     a snail inching along a ledge, its trail shining; draws into its shell if you come near
//   drift     leaves, petals or foam bits turning slowly on the water in a box
//   echodrip  a drip whose ring comes back a moment later, fainter, as an echo
//   midges    a haze of midges over a patch of still water (calm evenings)
//   candles   little flames on stubs of candle, flickering, each with a glow
//
// Positions are in tiles. Everything is worked out from the time and the player's place.

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
const stormy = (s) => STORM_AREAS.includes(s.scene.roomData.area) && !s.scene.calm && !s.scene.roomData.indoors;
const isWater = (scene, tx, ty) => {
  const c = scene.room.tileAt(Math.floor(tx), Math.floor(ty));
  return c === '~' || c === '0';
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
const ring = (ctx, x, y, u, color, size = 6) => {
  ctx.strokeStyle = `rgba(${color},${(0.55 * (1 - u)).toFixed(2)})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(Math.round(x) + 0.5, Math.round(y) + 0.5, 1 + u * size, (1 + u * size) * 0.42, 0, 0, Math.PI * 2);
  ctx.stroke();
};

// ---- Fish in the streets ----

function swimfish(s) {
  const n = s.n ?? 3;
  const pale = Boolean(s.pale);
  const body = pale ? 'rgba(220,232,236,0.55)' : 'rgba(8,34,30,0.62)';
  const fin = pale ? 'rgba(190,206,214,0.45)' : 'rgba(6,26,22,0.5)';
  const fish = Array.from({ length: n }, (_, i) => ({ x: 0, y: 0, ready: false, dart: 0, dir: 1, i }));
  return {
    floor(ctx, cam, t) {
      const f = feetOf(s.scene);
      for (const q of fish) {
        const base = wander(q.i + s.x * 3, t * 0.45, (s.x + s.w / 2) * T, (s.y + s.h / 2) * T, (s.w * T) / 2, (s.h * T) / 2);
        let [px, py] = base;
        // Frightened: bolt away from you for a moment, then drift back.
        const d = Math.hypot(f.x - px, f.y - py);
        if (d < 34) q.dart = 1;
        q.dart = Math.max(0, q.dart - 0.012);
        if (q.dart > 0) {
          const ax = px - f.x;
          const ay = py - f.y;
          const len = Math.hypot(ax, ay) || 1;
          px += (ax / len) * 26 * q.dart;
          py += (ay / len) * 14 * q.dart;
        }
        if (!q.ready) { q.x = px; q.y = py; q.ready = true; }
        q.dir = Math.sign(px - q.x) || q.dir;
        q.x += (px - q.x) * 0.2;
        q.y += (py - q.y) * 0.2;
        if (!isWater(s.scene, q.x / T, q.y / T)) continue;
        const x = q.x - cam.x;
        const y = q.y - cam.y;
        if (!onScreen(x, y)) continue;
        const flick = Math.round(Math.sin(t * 7 + q.i * 2) * 1);
        const dir = q.dir;
        const mx = (lx, ly, w = 1, h = 1) => rect(ctx, body, dir > 0 ? x + lx : x - lx - w + 1, y + ly, w, h);
        mx(-2, 0, 6, 2); mx(-1, -1, 4, 1); mx(-1, 2, 3, 1);
        rect(ctx, fin, dir > 0 ? x - 4 : x + 4, y + flick - 1, 2, 1);
        rect(ctx, fin, dir > 0 ? x - 5 : x + 5, y + flick, 1, 2);
        if (pale) rect(ctx, 'rgba(255,255,255,0.8)', dir > 0 ? x + 3 : x - 3, y, 1, 1);
        // A faint ring on the surface when it darts.
        if (q.dart > 0.6) ring(ctx, x, y, 1 - q.dart, pale ? '200,230,240' : '150,210,200', 5);
      }
    },
  };
}

// ---- Belongings afloat ----

// Each painter draws its thing with (x, y) the middle of the water-line, `a` its slow turn.
const ITEMS = {
  chair(ctx, x, y) {
    rect(ctx, '#5a3e2a', x - 4, y - 4, 8, 2);
    rect(ctx, '#7a5a3a', x - 4, y - 4, 8, 1);
    rect(ctx, '#4a3220', x - 4, y - 2, 1, 4);
    rect(ctx, '#4a3220', x + 3, y - 2, 1, 4);
    rect(ctx, '#6a4a30', x + 2, y - 10, 2, 6);
    rect(ctx, '#6a4a30', x - 1, y - 9, 2, 5);
    rect(ctx, '#8a6a44', x - 4, y - 9, 8, 1);
  },
  bucket(ctx, x, y) {
    rect(ctx, '#5a6672', x - 3, y - 5, 7, 6);
    rect(ctx, '#7a8896', x - 3, y - 5, 2, 6);
    rect(ctx, '#3a4450', x + 2, y - 5, 2, 6);
    rect(ctx, '#2a323c', x - 3, y - 5, 7, 1);
    rect(ctx, '#2a323c', x - 3, y - 2, 7, 1);
    rect(ctx, '#2a323c', x - 4, y - 8, 1, 3);
    rect(ctx, '#2a323c', x + 4, y - 8, 1, 3);
    rect(ctx, '#2a323c', x - 3, y - 9, 7, 1);
  },
  hat(ctx, x, y) {
    rect(ctx, '#3a2e26', x - 6, y - 2, 12, 2);
    rect(ctx, '#5a4a3a', x - 6, y - 2, 12, 1);
    rect(ctx, '#3a2e26', x - 3, y - 6, 6, 4);
    rect(ctx, '#5a4a3a', x - 3, y - 6, 6, 1);
    rect(ctx, '#a83a3a', x - 3, y - 3, 6, 1);
  },
  apples(ctx, x, y) {
    for (const [dx, dy] of [[-5, -2], [0, -3], [5, -1], [-2, 0]]) {
      rect(ctx, '#7a2a20', x + dx - 2, y + dy - 3, 4, 4);
      rect(ctx, '#c04030', x + dx - 2, y + dy - 3, 3, 3);
      rect(ctx, '#e06a50', x + dx - 2, y + dy - 3, 1, 1);
      rect(ctx, '#3a5a2a', x + dx, y + dy - 4, 1, 1);
    }
  },
  bottle(ctx, x, y) {
    rect(ctx, '#2a6a58', x - 5, y - 3, 8, 3);
    rect(ctx, '#4a9a80', x - 5, y - 3, 8, 1);
    rect(ctx, '#2a6a58', x + 3, y - 2, 3, 1);
    rect(ctx, '#5a3a22', x + 6, y - 3, 1, 3);
    rect(ctx, '#e8e0c8', x - 3, y - 2, 4, 1);
  },
  slipper(ctx, x, y) {
    rect(ctx, '#7a4a6a', x - 4, y - 3, 8, 3);
    rect(ctx, '#a86a8a', x - 4, y - 3, 8, 1);
    rect(ctx, '#2a1a26', x - 3, y - 3, 3, 1);
  },
  loaf(ctx, x, y) {
    rect(ctx, '#8a5a24', x - 5, y - 4, 10, 4);
    rect(ctx, '#c88a3c', x - 5, y - 4, 10, 2);
    rect(ctx, '#e0b060', x - 3, y - 4, 4, 1);
    rect(ctx, '#8a5a24', x - 2, y - 3, 1, 1);
    rect(ctx, '#8a5a24', x + 1, y - 3, 1, 1);
  },
  cabbage(ctx, x, y) {
    rect(ctx, '#2a5a2a', x - 4, y - 5, 8, 5);
    rect(ctx, '#4a8a44', x - 3, y - 6, 6, 5);
    rect(ctx, '#7ab868', x - 2, y - 5, 2, 2);
    rect(ctx, '#2a5a2a', x, y - 3, 1, 3);
  },
  doll(ctx, x, y) {
    rect(ctx, '#d8a888', x - 4, y - 5, 3, 3);
    rect(ctx, '#7a3a8a', x - 1, y - 4, 6, 3);
    rect(ctx, '#e0c060', x - 5, y - 5, 1, 4);
    rect(ctx, '#2a1a1a', x - 3, y - 4, 1, 1);
  },
  book(ctx, x, y) {
    rect(ctx, '#2a3a6a', x - 4, y - 3, 8, 3);
    rect(ctx, '#e8e0c8', x - 3, y - 3, 6, 1);
    rect(ctx, '#5a6a9a', x - 4, y - 3, 1, 3);
  },
  kettle(ctx, x, y) {
    rect(ctx, '#3c4250', x - 4, y - 5, 8, 5);
    rect(ctx, '#5c6676', x - 4, y - 5, 3, 5);
    rect(ctx, '#3c4250', x + 4, y - 4, 3, 1);
    rect(ctx, '#2a2e38', x - 2, y - 7, 4, 2);
  },
  plank(ctx, x, y) {
    rect(ctx, '#4a3a28', x - 8, y - 2, 16, 2);
    rect(ctx, '#7a6240', x - 8, y - 2, 16, 1);
    rect(ctx, '#2a1e12', x - 2, y - 1, 1, 1);
  },
  teacup(ctx, x, y) {
    rect(ctx, '#d8d0c0', x - 3, y - 3, 6, 3);
    rect(ctx, '#f0e8d8', x - 3, y - 3, 6, 1);
    rect(ctx, '#d8d0c0', x + 3, y - 2, 2, 1);
    rect(ctx, '#7a5a3a', x - 2, y - 3, 4, 1);
  },
  lantern(ctx, x, y) {
    rect(ctx, '#2a2e38', x - 3, y - 7, 6, 7);
    rect(ctx, '#a8b4a888', x - 2, y - 6, 4, 5);
    rect(ctx, '#2a2e38', x - 1, y - 9, 2, 2);
  },
  basket(ctx, x, y) {
    rect(ctx, '#8a6a34', x - 5, y - 5, 10, 5);
    rect(ctx, '#b8924c', x - 5, y - 5, 10, 1);
    for (let i = -4; i < 5; i += 3) rect(ctx, '#5a4220', x + i, y - 4, 1, 4);
    rect(ctx, '#8a6a34', x - 4, y - 8, 1, 3);
    rect(ctx, '#8a6a34', x + 3, y - 8, 1, 3);
    rect(ctx, '#8a6a34', x - 4, y - 9, 8, 1);
  },
  boat(ctx, x, y) {
    rect(ctx, '#a83a3a', x - 6, y - 3, 12, 3);
    rect(ctx, '#d86a5a', x - 6, y - 3, 12, 1);
    rect(ctx, '#e8e0c8', x - 1, y - 9, 1, 6);
    rect(ctx, '#e8e0c8', x, y - 9, 4, 4);
  },
};

function bobbers(s) {
  const list = (s.items ?? []).map((it, i) => ({ ...it, i }));
  return {
    // Drawn on the floor (under everyone): a thing afloat is low.
    floor(ctx, cam, t) {
      {
        for (const it of list) {
          const drift = (it.r ?? 0.7) * T;
          const ox = it.x * T + 8 + Math.sin(t * 0.21 + it.i * 2.3) * drift;
          const oy = it.y * T + 10 + Math.cos(t * 0.17 + it.i * 1.7) * drift * 0.35;
          if (!isWater(s.scene, ox / T, oy / T)) continue;
          const x = ox - cam.x;
          const y = oy - cam.y + Math.sin(t * 1.5 + it.i * 1.9) * 1.2;
          if (!onScreen(x, y)) continue;
          // The water-line: a little dark shadow and a pale ring round the thing's foot.
          rect(ctx, 'rgba(6,30,28,0.35)', x - 6, y, 12, 2);
          ctx.globalAlpha = 0.5;
          rect(ctx, '#c8f0e4', x - 7, y + 1, 14, 1);
          ctx.globalAlpha = 1;
          const tilt = Math.round(Math.sin(t * 0.8 + it.i) * 0);
          (ITEMS[it.k] ?? ITEMS.plank)(ctx, Math.round(x) + tilt, Math.round(y));
          if (fract(t * 0.11 + it.i * 0.37) < 0.06) ring(ctx, x, y + 1, fract(t * 0.11 + it.i * 0.37) / 0.06, '200,240,230', 8);
        }
      }
    },
  };
}

// ---- Rain on the water ----

function rainrings(s) {
  const stormRate = s.n ?? 14;
  const calm = s.calm ?? !stormy(s);
  const seeds = Array.from({ length: calm ? Math.max(2, Math.round(stormRate / 4)) : stormRate }, (_, i) => i);
  return {
    floor(ctx, cam, t) {
      for (const i of seeds) {
        const period = calm ? 4.5 + hash(i + 1) * 3 : 0.9 + hash(i + 1) * 0.8;
        const clock = t / period + hash(i + 2) * 17;
        const k = Math.floor(clock);
        const u = fract(clock) / 0.5;
        if (u >= 1) continue;
        const tx = s.x + hash(k * 7 + i) * s.w;
        const ty = s.y + hash(k * 13 + i * 3) * s.h;
        if (!isWater(s.scene, tx, ty)) continue;
        const x = tx * T - cam.x;
        const y = ty * T - cam.y;
        if (!onScreen(x, y)) continue;
        ring(ctx, x, y, u, calm ? '190,230,225' : '200,235,230', calm ? 6 : 5);
        if (!calm && u < 0.25) rect(ctx, 'rgba(220,245,240,0.8)', x, y - 2 + u * 6, 1, 2);
      }
    },
  };
}

// ---- A duck on a doorstep ----

function duck(s) {
  let state = 'sit';
  let at = 0;
  let fx = s.x * T + 8;
  let fy = s.y * T + 12;
  const home = { x: fx, y: fy };
  const away = { x: (s.toX ?? s.x + 2) * T + 8, y: (s.toY ?? s.y + 1) * T + 10 };
  return {
    thing: {
      sortY: s.y * T + 12 + (s.sort ?? 0),
      draw(ctx, cam, t) {
        const d = nearest(s.scene, home.x, home.y);
        if (state === 'sit' && d < 30) { state = 'swim'; at = t; }
        if (state === 'swim' && d > 78 && t - at > 3) { state = 'sit'; at = t; }
        const goal = state === 'swim' ? away : home;
        fx += (goal.x - fx) * 0.04;
        fy += (goal.y - fy) * 0.04;
        const x = Math.round(fx - cam.x);
        const y = Math.round(fy - cam.y);
        if (!onScreen(x, y)) return;
        const moving = Math.hypot(goal.x - fx, goal.y - fy) > 1;
        const swimming = state === 'swim' && !moving;
        const dir = goal.x >= fx - 0.5 && moving ? (goal.x > fx ? 1 : -1) : (state === 'swim' ? -1 : 1);
        const bob = moving ? Math.round(Math.abs(Math.sin(t * 9))) : Math.round(Math.sin(t * 1.4) * 0.5 + 0.5);
        const mx = (lx, ly, w = 1, h = 1, c = '#d8d4c8') => rect(ctx, c, dir > 0 ? x + lx : x - lx - w + 1, y + ly - bob, w, h);
        if (swimming) { ring(ctx, x, y, fract(t * 0.4), '200,235,230', 7); }
        // Body, wing, tail, neck and head with its bill, and the orange feet (not in the water).
        mx(-4, -5, 8, 4); mx(-5, -6, 2, 2); mx(-3, -3, 6, 1, '#a8a498'); mx(-2, -5, 4, 2, '#b8885a');
        mx(3, -9, 3, 5, '#2a6a4a'); mx(3, -10, 4, 2, '#2a6a4a'); mx(2, -6, 4, 1, '#f0f0ec'); mx(6, -8, 3, 1, '#f0b030'); mx(5, -9, 1, 1, '#10161a');
        if (!swimming) { mx(-1, -1, 2, 1, '#e88a2a'); mx(2, -1, 2, 1, '#e88a2a'); }
        // Preening: the head dips every so often.
        if (!moving && fract(t * 0.18 + s.x) < 0.1) mx(4, -8, 2, 2, '#2a6a4a');
      },
    },
  };
}

// ---- Moths about a lamp ----

function moths(s) {
  const n = s.n ?? 4;
  return {
    over(ctx, cam, t) {
      const cx = s.x * T + 8 - cam.x;
      const cy = s.y * T - cam.y;
      if (!onScreen(cx, cy, 30)) return;
      for (let i = 0; i < n; i++) {
        const a = t * (1.4 + hash(i) * 1.6) + i * 2.1;
        const r = 5 + Math.sin(t * 0.9 + i) * 3 + hash(i + 3) * 3;
        const mx = cx + Math.cos(a) * r;
        const my = cy + Math.sin(a * 1.3) * r * 0.7;
        const up = Math.floor(t * 14 + i) % 2;
        rect(ctx, 'rgba(240,234,214,0.9)', mx - 1, my - up, 1, 1);
        rect(ctx, 'rgba(240,234,214,0.9)', mx + 1, my - up, 1, 1);
        rect(ctx, 'rgba(170,160,130,0.9)', mx, my, 1, 1);
      }
    },
  };
}

// ---- A snail on a ledge ----

function snail(s) {
  const len = (s.len ?? 2) * T;
  const wild = stormy(s);
  return {
    thing: {
      sortY: s.y * T + 14 + (s.sort ?? 0),
      draw(ctx, cam, t) {
        const px = s.x * T;
        const phase = (t * 0.6 + s.x) % (len * 2);
        const dist = phase < len ? phase : len * 2 - phase;
        const dir = phase < len ? 1 : -1;
        const x = Math.round(px + dist - cam.x);
        const y = Math.round(s.y * T + 14 - cam.y);
        if (!onScreen(x, y)) return;
        const scared = nearest(s.scene, px + dist, s.y * T + 14) < 22 || wild;
        // The trail: a pale line it's left.
        ctx.globalAlpha = 0.35;
        rect(ctx, '#c8f0e4', dir > 0 ? px - cam.x : x, y, dir > 0 ? dist : len - dist, 1);
        ctx.globalAlpha = 1;
        if (scared) {
          rect(ctx, '#8a6a44', x - 1, y - 4, 4, 4);
          rect(ctx, '#b8924c', x, y - 4, 2, 2);
          return;
        }
        rect(ctx, '#8a6a44', x - 2, y - 5, 5, 5);
        rect(ctx, '#b8924c', x - 1, y - 5, 3, 3);
        rect(ctx, '#6a4a2a', x, y - 4, 1, 1);
        rect(ctx, '#c8b898', dir > 0 ? x - 3 : x - 1, y - 1, 7, 1);
        rect(ctx, '#c8b898', dir > 0 ? x + 3 : x - 4, y - 3, 1, 2);
        rect(ctx, '#c8b898', dir > 0 ? x + 4 : x - 5, y - 4, 1, 1);
      },
    },
  };
}

// ---- Things turning on the water ----

function drift(s) {
  const n = s.n ?? 6;
  const color = s.color ?? '#7a8a3a';
  const lit = s.lit ?? '#a8b858';
  return {
    floor(ctx, cam, t) {
      for (let i = 0; i < n; i++) {
        const sp = 0.05 + hash(i + 1) * 0.06;
        const px = (s.x + fract(t * sp * (s.dir ?? 1) + hash(i + 2)) * s.w) * T;
        const py = (s.y + hash(i + 3) * s.h) * T + Math.sin(t * 0.8 + i) * 2;
        if (!isWater(s.scene, px / T, py / T)) continue;
        const x = px - cam.x;
        const y = py - cam.y;
        if (!onScreen(x, y)) continue;
        const turn = Math.floor(t * 0.7 + i) % 3;
        rect(ctx, color, x, y, turn === 1 ? 2 : 3, turn === 1 ? 3 : 2);
        rect(ctx, lit, x, y, 1, 1);
      }
    },
  };
}

// ---- A drip with an echo ----

function echodrip(s) {
  const every = s.every ?? 5;
  const fall = (s.fall ?? 2) * T;
  const color = s.color ?? '190,225,255';
  return {
    over(ctx, cam, t) {
      const x = s.x * T + 8 - cam.x;
      const y0 = s.y * T - cam.y;
      if (!onScreen(x, y0 + fall, 40)) return;
      const clock = (t + ((s.x * 7 + s.y * 3) % every)) % every;
      const fallTime = 0.5 + (s.fall ?? 2) * 0.12;
      if (clock < fallTime) {
        const u = clock / fallTime;
        rect(ctx, `rgba(${color},0.85)`, x, y0 + 2 + u * u * (fall - 2), 1, 2);
        return;
      }
      const since = clock - fallTime;
      // The splash, then the ring comes back from the walls: bigger, fainter, later.
      if (since < 0.9) ring(ctx, x, y0 + fall, since / 0.9, color, 6);
      if (since > 0.9 && since < 2.2) ring(ctx, x, y0 + fall, (since - 0.9) / 1.3, color, 14);
      if (since > 1.8 && since < 3.4) {
        ctx.globalAlpha = 0.4;
        ring(ctx, x, y0 + fall, (since - 1.8) / 1.6, color, 22);
        ctx.globalAlpha = 1;
      }
    },
  };
}

// ---- Midges over still water ----

function midges(s) {
  const n = s.n ?? 14;
  return {
    over(ctx, cam, t) {
      if (stormy(s)) return;
      for (let i = 0; i < n; i++) {
        const [px, py] = wander(i + s.x, t * 0.6, (s.x + s.w / 2) * T, (s.y + s.h / 2) * T, (s.w * T) / 2, (s.h * T) / 2, 1.3);
        const x = px - cam.x;
        const y = py - cam.y;
        if (!onScreen(x, y)) continue;
        const a = 0.25 + 0.4 * Math.abs(Math.sin(t * 2 + i));
        rect(ctx, `rgba(255,250,220,${a.toFixed(2)})`, x, y, 1, 1);
      }
    },
  };
}

// ---- Candle flames ----

function candles(s) {
  const pts = s.points ?? [];
  return {
    thing: {
      sortY: Math.max(...pts.map((p) => p[1]), 0) * T + 14,
      draw(ctx, cam, t) {
        pts.forEach(([px, py], i) => {
          const x = Math.round(px * T + 8 - cam.x);
          const y = Math.round(py * T + 8 - cam.y);
          if (!onScreen(x, y, 30)) return;
          const f = Math.sin(t * 9 + i * 3) + Math.sin(t * 5.3 + i);
          rect(ctx, '#ffe080', x, y - 3 - (f > 1 ? 1 : 0), 1, 2);
          rect(ctx, '#f0a030', x, y - 2, 1, 1);
          rect(ctx, 'rgba(255,255,255,0.85)', x, y - 3, 1, 1);
        });
      },
    },
    over(ctx, cam, t) {
      pts.forEach(([px, py], i) => {
        const x = px * T + 8 - cam.x;
        const y = py * T + 6 - cam.y;
        if (!onScreen(x, y, 40)) return;
        glow(ctx, '255, 190, 90', x, y, 20 + Math.sin(t * 7 + i) * 2, 0.5);
      });
    },
  };
}

export const LANES_KINDS = { swimfish, bobbers, rainrings, duck, moths, snail, drift, echodrip, midges, candles };
