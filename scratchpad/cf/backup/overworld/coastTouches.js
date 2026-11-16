import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, TILE_SIZE as T } from '../config.js';
import { STORM_AREAS } from '../data/areas.js';
import { sfx } from '../audio/music.js';

// COAST TOUCHES: the small living things of the chapter 5 coast, as kinds for
// touches.js (the same table, src/data/touches.js, the same rules: drawn only,
// no bodies, nothing can bump into them). Most know whether the storm is on:
// `stormy(s)` is true in a green-storm room until its `calmAfter` has played.
//
//   gull     a gull perched on a post or a pile; flies off when you come near,
//            and comes back to the same perch once you've gone
//   crab     a little crab out of its hole; scuttles back in when you come near,
//            peeps out, and comes out again once you've moved off
//   cat      a cat on a sill: tail going, blinking, watching you go by (and a
//            slow blink back when you stroke it: a `looks` spot with `pet: true`)
//   smoke    smoke from a chimney or a stovepipe, torn sideways in the storm
//   rope     a rope's end hanging off an iron hook, swaying (much more in the
//            storm), and creaking when you brush past
//   floats   cork floats bobbing on the water, strung on a net line
//   blown    bits blowing through on the wind (leaves, wrack, spray), in a box
//   puddles  rain puddles: rain rings in the storm, and a splash when you step in
//
// Every hanging thing draws its own hook or post. Positions are in tiles.

const fract = (x) => x - Math.floor(x);
const hash = (n) => fract(Math.sin(n * 91.7 + 17.3) * 43758.5453);
const rect = (ctx, color, x, y, w = 1, h = 1) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};
const onScreen = (x, y, pad = 24) => x > -pad && x < W + pad && y > -pad && y < H + pad;
const feetOf = (scene) => ({ x: scene.player.x + 6, y: scene.player.y + 12 });
const near = (scene, px, py) => {
  const f = feetOf(scene);
  return Math.hypot(f.x - px, f.y - py);
};
// Whether anyone in the party is near (followers scare things too).
const nearest = (scene, px, py) => {
  let d = near(scene, px, py);
  for (const o of scene.followers ?? []) if (!o.hidden) d = Math.min(d, Math.hypot(o.x + 6 - px, o.y + 12 - py));
  return d;
};
export const stormy = (s) => STORM_AREAS.includes(s.scene.roomData.area) && !s.scene.calm && !s.scene.roomData.indoors;

// A pixel mirrored about `ox` when f is -1 (for things that face left or right).
const mrect = (ctx, color, ox, f, lx, y, w = 1, h = 1) => rect(ctx, color, f > 0 ? ox + lx : ox - lx - w + 1, y, w, h);

// ---- Gulls ----

const GULL = { white: '#f2f2ee', shade: '#c8ccd0', wing: '#8e98a6', tip: '#2a2a30', beak: '#f0c040', spot: '#d04030', legs: '#e08a4a' };

// A gull standing (x, y: its feet), facing f.
function gullSitting(ctx, x, y, f, t, seed, hunch) {
  const h = hunch ? 1 : 0;
  mrect(ctx, GULL.legs, x, f, -1, y - 2, 1, 2);
  mrect(ctx, GULL.legs, x, f, 1, y - 2, 1, 2);
  mrect(ctx, GULL.white, x, f, -3, y - 7 + h, 7, 5 - h);
  mrect(ctx, GULL.shade, x, f, -3, y - 3, 7, 1);
  mrect(ctx, GULL.wing, x, f, -4, y - 6 + h, 6, 2);
  mrect(ctx, GULL.tip, x, f, -5, y - 5 + h, 2, 1);
  // The head turns now and then (and looks back the other way a moment).
  const look = Math.sin(t * 0.7 + seed * 5) > 0.75 ? -1 : 1;
  const hx = 2;
  const hy = y - 10 + h * 2;
  mrect(ctx, GULL.white, x, f, hx, hy, 3, 3);
  mrect(ctx, GULL.tip, x, f, hx + (look > 0 ? 2 : 0), hy + 1);
  // The beak, and a call now and then (beak open).
  const calling = fract(t * 0.13 + seed) < 0.03;
  mrect(ctx, GULL.beak, x, f, look > 0 ? hx + 3 : hx - 2, hy + 1, 2, 1);
  if (calling) mrect(ctx, GULL.beak, x, f, look > 0 ? hx + 3 : hx - 2, hy + 3, 2, 1);
  else mrect(ctx, GULL.spot, x, f, look > 0 ? hx + 4 : hx - 2, hy + 2);
  // In the storm, a feather lifting on its back.
  if (hunch && Math.sin(t * 9 + seed) > 0.4) mrect(ctx, GULL.white, x, f, -2, y - 8);
}

// A gull flying (x, y: its middle), wings up or down.
function gullFlying(ctx, x, y, f, flap) {
  mrect(ctx, GULL.white, x, f, -3, y, 7, 2);
  mrect(ctx, GULL.white, x, f, 3, y - 1, 2, 2);
  mrect(ctx, GULL.beak, x, f, 5, y, 1, 1);
  const up = flap > 0;
  for (let i = 0; i < 5; i++) {
    const wy = up ? y - 1 - Math.min(i, 3) : y + 1 + Math.min(i, 2);
    mrect(ctx, i > 3 ? GULL.tip : GULL.wing, x, f, -1 - i, wy, 1, 1);
    mrect(ctx, i > 3 ? GULL.tip : GULL.wing, x, f, 1 + i, wy, 1, 1);
  }
}

// x, y: where the gull's feet go (on top of a post or pile already in the room,
// or `post: true` for its own mooring post, `post` px tall if a number).
// `face`: 1 right, -1 left. It sits through the storm, hunched.
function gull(s) {
  const fx = s.x * T;
  const fy = s.y * T;
  const postH = s.post === true ? 14 : (s.post || 0);
  const seed = s.x * 3.1 + s.y * 7.7;
  let mode = 'sit';
  let t0 = 0;
  let dir = 1;
  let until = 0;
  const flightPath = (u) => [fx + dir * u * 110, fy - 4 - u * 70 - Math.sin(u * Math.PI) * 6];
  return {
    thing: {
      sortY: fy + postH + (s.sort ?? 0),
      draw(ctx, cam, t) {
        const d = nearest(s.scene, fx, fy + postH);
        if (mode === 'sit' && d < (s.scare ?? 40)) {
          mode = 'off';
          t0 = t;
          dir = feetOf(s.scene).x > fx ? -1 : 1;
          if (onScreen(fx - cam.x, fy - cam.y, 0)) sfx('flutter');
        } else if (mode === 'off' && t - t0 > 2.4) {
          mode = 'away';
          until = t + 18 + hash(seed + t0) * 16;
        } else if (mode === 'away' && t > until && d > 90) {
          mode = 'back';
          t0 = t;
        } else if (mode === 'back' && t - t0 > 2.6) {
          mode = 'sit';
        }
        const x = fx - cam.x;
        const y = fy - cam.y;
        if (postH && onScreen(x, y + postH, 30)) {
          // A tarred mooring post, rope-bound at the top.
          rect(ctx, '#2a2018', x - 3, y, 6, postH);
          rect(ctx, '#5a4632', x - 2, y, 4, postH - 1);
          rect(ctx, '#7a6046', x - 2, y, 1, postH - 1);
          rect(ctx, '#6a5a3e', x - 3, y + 2, 6, 1);
          rect(ctx, '#a08a5a', x - 3, y + 3, 6, 1);
          rect(ctx, '#3a4a40', x - 3, y + postH - 3, 6, 2);
        }
        if (mode === 'sit') {
          if (onScreen(x, y)) gullSitting(ctx, x, y, s.face ?? 1, t, seed, stormy(s));
          return;
        }
        if (mode === 'away') return;
        // Off: slow to get going, then away. Back: gliding in, slowing to land.
        const k = Math.min(1, (t - t0) / (mode === 'off' ? 2.4 : 2.6));
        const [gx, gy] = flightPath(mode === 'off' ? k * k : 1 - k * (2 - k));
        const px = gx - cam.x;
        const py = gy - cam.y;
        if (!onScreen(px, py)) return;
        // Flapping hard to get up; gliding in, with a flap or two to land.
        const flapping = mode === 'off' || k > 0.8;
        const flap = flapping ? Math.sin(t * 26) : 1;
        if (mode === 'back' && k > 0.94) gullSitting(ctx, x, y, s.face ?? 1, t, seed, false);
        else gullFlying(ctx, px, py, mode === 'off' ? dir : -dir, flap);
      },
    },
  };
}

// ---- Crabs ----

// x, y: its hole (in the sand or the rocks). It potters about within `r`
// tiles of it (default 1.5), sideways, and dives in when anyone comes near.
function crab(s) {
  const hx = s.x * T + 8;
  const hy = s.y * T + 10;
  const r = (s.r ?? 1.5) * T;
  const seed = s.x * 5.3 + s.y * 2.9;
  let cx = hx + r * 0.6;
  let target = cx;
  let mode = 'out';
  let last = null;
  let pause = 0;
  let hidden = 0;
  let step = 0;
  const shell = s.color ?? '#d0603a';
  const dark = s.dark ?? '#8a3420';
  return {
    floor(ctx, cam) {
      const x = hx - cam.x;
      const y = hy - cam.y;
      if (!onScreen(x, y)) return;
      // The hole: a dark oval with a lip of spoil.
      rect(ctx, 'rgba(0,0,0,0.18)', x - 4, y, 9, 2);
      rect(ctx, '#2a2018', x - 3, y, 7, 2);
      rect(ctx, '#1a140e', x - 2, y + 1, 5, 1);
      rect(ctx, 'rgba(255,255,255,0.18)', x - 3, y + 2, 7, 1);
    },
    thing: {
      sortY: hy + 2,
      draw(ctx, cam, t) {
        const dt = last === null ? 0.016 : Math.max(0, Math.min(0.05, t - last));
        last = t;
        const d = nearest(s.scene, cx, hy);
        if (mode === 'out' && d < (s.scare ?? 38)) {
          mode = 'dash';
          if (onScreen(cx - cam.x, hy - cam.y, 0)) sfx('scuttle');
        }
        if (mode === 'dash') {
          const way = Math.sign(hx - cx);
          cx += way * 70 * dt;
          step += dt * 30;
          if (Math.sign(hx - cx) !== way || Math.abs(hx - cx) < 1) {
            cx = hx;
            mode = 'in';
            hidden = 0;
          }
        } else if (mode === 'in') {
          hidden = nearest(s.scene, hx, hy) > 64 ? hidden + dt : 0;
          if (hidden > 4 + hash(seed) * 3) {
            mode = 'out';
            target = hx + (hash(seed + t) - 0.5) * 2 * r;
          }
        } else {
          // Pottering: a few quick sideways steps, then a stop.
          if (pause > 0) pause -= dt;
          else if (Math.abs(target - cx) < 1) {
            pause = 1 + hash(seed + Math.floor(t)) * 2.5;
            target = hx + (hash(seed + t * 1.7) - 0.5) * 2 * r;
          } else {
            cx += Math.sign(target - cx) * 14 * dt;
            step += dt * 16;
          }
        }
        const x = cx - cam.x;
        const y = hy - cam.y;
        if (!onScreen(x, y)) return;
        if (mode === 'in') {
          // Eyes peeping over the lip now and then.
          if (fract(t * 0.25 + hash(seed)) < 0.45) {
            rect(ctx, '#1a1410', x - 1, y - 1, 1, 1);
            rect(ctx, '#1a1410', x + 1, y - 1, 1, 1);
            rect(ctx, shell, x - 1, y, 3, 1);
          }
          return;
        }
        const legs = Math.floor(step) % 2;
        // Legs, three a side, scissoring.
        for (let i = 0; i < 3; i++) {
          rect(ctx, dark, x - 4 - (i === 1 ? legs : 1 - legs), y - 1 + (i === 2 ? 1 : 0) - (i === 0 ? 1 : 0), 1, 1);
          rect(ctx, dark, x + 4 + (i === 1 ? legs : 1 - legs), y - 1 + (i === 2 ? 1 : 0) - (i === 0 ? 1 : 0), 1, 1);
        }
        rect(ctx, shell, x - 3, y - 3, 7, 3);
        rect(ctx, shell, x - 2, y - 4, 5, 1);
        rect(ctx, 'rgba(255,220,180,0.5)', x - 2, y - 4, 2, 1);
        rect(ctx, dark, x - 3, y - 1, 7, 1);
        // Claws up, and eyes on stalks.
        const snip = mode === 'out' && pause > 0 && Math.sin(t * 6 + seed) > 0.6 ? 1 : 0;
        rect(ctx, shell, x - 5, y - 4 - snip, 2, 2);
        rect(ctx, shell, x + 4, y - 4 - snip, 2, 2);
        rect(ctx, '#1a1410', x - 1, y - 6, 1, 2);
        rect(ctx, '#1a1410', x + 1, y - 6, 1, 2);
      },
    },
  };
}

// ---- A cat on a sill ----

// x, y: where it sits (its feet, top left of a tile). `color`/`dark`/`eye`.
// Tail going, a blink now and then, an ear flick, and its eyes on you.
function cat(s) {
  const body = s.color ?? '#d8884a';
  const dark = s.dark ?? '#9a5a2a';
  const light = s.light ?? '#f0c49a';
  const eye = s.eye ?? '#9ad050';
  return {
    thing: {
      sortY: s.y * T + 12 + (s.sort ?? 0),
      draw(ctx, cam, t) {
        const x = s.x * T + 4 - cam.x;
        const y = s.y * T + 12 - cam.y;
        if (!onScreen(x, y)) return;
        // The tail, curling up off one side and swishing at the tip.
        const swish = Math.sin(t * 1.4) + Math.sin(t * 3.1) * 0.3;
        rect(ctx, body, x + 8, y - 2, 2, 2);
        rect(ctx, body, x + 9, y - 4, 2, 2);
        rect(ctx, body, x + 10 + Math.round(swish), y - 6, 2, 2);
        rect(ctx, dark, x + 10 + Math.round(swish * 1.5), y - 7, 2, 1);
        // Body, sat up: haunches, chest, front paws.
        rect(ctx, body, x, y - 6, 9, 6);
        rect(ctx, body, x + 1, y - 8, 7, 2);
        rect(ctx, dark, x + 1, y - 5, 1, 3);
        rect(ctx, dark, x + 7, y - 5, 1, 3);
        rect(ctx, light, x + 3, y - 6, 3, 5);
        rect(ctx, light, x + 2, y - 1, 2, 1);
        rect(ctx, light, x + 5, y - 1, 2, 1);
        // Head, ears (one flicks now and then).
        const flick = fract(t * 0.21) < 0.04 ? 1 : 0;
        rect(ctx, body, x + 1, y - 13, 7, 5);
        rect(ctx, body, x + 1, y - 15 + flick, 2, 2);
        rect(ctx, body, x + 6, y - 15, 2, 2);
        rect(ctx, dark, x + 1, y - 14 + flick, 1, 1);
        rect(ctx, dark, x + 7, y - 14, 1, 1);
        rect(ctx, dark, x + 3, y - 13, 3, 1);
        rect(ctx, light, x + 3, y - 10, 3, 2);
        rect(ctx, '#c86a6a', x + 4, y - 10);
        // Eyes: on you if you're about, shut for a blink, half shut when it's dozy.
        const f = feetOf(s.scene);
        const look = Math.hypot(f.x - (x + cam.x + 4), f.y - (y + cam.y)) < 90 ? Math.sign(f.x - (x + cam.x + 4)) : 0;
        // Stroked (OverworldScene.lookAt's `pet`): a long, slow blink back at you.
        const since = s.scene.pettedAt == null ? Infinity : t - s.scene.pettedAt;
        const blink = fract(t * 0.27 + s.x) < 0.035 || (since > 0.25 && since < 1.35);
        if (blink) {
          rect(ctx, dark, x + 2, y - 11, 2, 1);
          rect(ctx, dark, x + 5, y - 11, 2, 1);
        } else {
          rect(ctx, eye, x + 2, y - 12, 2, 2);
          rect(ctx, eye, x + 5, y - 12, 2, 2);
          rect(ctx, '#1a1410', x + 2 + (look > 0 ? 1 : 0), y - 12, 1, 2);
          rect(ctx, '#1a1410', x + 5 + (look > 0 ? 1 : 0), y - 12, 1, 2);
        }
      },
    },
  };
}

// ---- Smoke ----

// x, y: the chimney's top (tiles). Calm: a slow column, leaning a little with
// `lean`. Storm: short, quick and torn away sideways. `stack: true` draws a
// little brick chimney under it (for a roof that hasn't one of its own);
// `cold: true` is the chimney alone, with nothing burning.
function smoke(s) {
  const lean = s.lean ?? 1;
  const puffs = (ctx, x, y, t) => {
    const wild = stormy(s);
    const n = wild ? 7 : 9;
    for (let i = 0; i < n; i++) {
      const life = fract(t * (wild ? 0.7 : 0.22) + i / n);
      const rise = wild ? life * 10 : life * 34;
      const drift = wild ? lean * life * life * 46 : lean * life * life * 12 + Math.sin(life * 5 + i) * 2;
      const size = 2 + Math.floor(life * (wild ? 3 : 4));
      const a = (1 - life) * (wild ? 0.48 : 0.52) * Math.min(1, life * 6);
      rect(ctx, `rgba(${s.color ?? '200, 200, 206'},${a.toFixed(3)})`, x + drift - size / 2, y - rise - size / 2, size, size);
    }
  };
  return {
    thing: {
      sortY: s.y * T + 10 + (s.sort ?? 0),
      draw(ctx, cam, t) {
        const x = Math.round(s.x * T - cam.x);
        const y = Math.round(s.y * T - cam.y);
        if (!onScreen(x, y - 20, 50)) return;
        if (s.stack) {
          rect(ctx, '#2a1a16', x - 4, y, 8, 10);
          rect(ctx, '#7a4a3a', x - 3, y + 1, 6, 9);
          rect(ctx, '#5a3428', x - 3, y + 4, 6, 1);
          rect(ctx, '#5a3428', x - 3, y + 7, 6, 1);
          rect(ctx, '#5a3428', x, y + 1, 1, 3);
          rect(ctx, '#3a2a26', x - 5, y, 10, 2);
          rect(ctx, '#1a1210', x - 2, y, 4, 1);
        }
        if (!s.cold) puffs(ctx, x, y - 1, t);
      },
    },
  };
}

// ---- A rope's end ----

// x, y: the hook (tiles; on a beam, a mast, a crane arm or a wall). `len` px
// of rope, with a knot at the end. Swings when you go past; the storm keeps it
// swinging. `creak: false` for no sound.
function rope(s) {
  let swing = 0;
  let vel = 0;
  let last = null;
  let creakAt = 0;
  const wild = stormy(s);
  return {
    thing: {
      sortY: s.y * T + (s.len ?? 18) + 8 + (s.sort ?? 0),
      draw(ctx, cam, t) {
        const dt = last === null ? 0.016 : Math.max(0, Math.min(0.05, t - last));
        last = t;
        const len = s.len ?? 18;
        const ox = s.x * T;
        const oy = s.y * T;
        const d = near(s.scene, ox, oy + len);
        const p = s.scene.player;
        if (d < 28 && p.moving) {
          vel += (p.x + 6 > ox ? -1 : 1) * dt * 10 * (1 - d / 28);
          if (s.creak !== false && t > creakAt) {
            sfx('creak');
            creakAt = t + 4;
          }
        }
        vel += (-swing * 12 - vel * 0.4) * dt;
        swing += vel * dt;
        const gust = wild ? Math.sin(t * 2.3 + s.x) * 0.32 + Math.sin(t * 5.1) * 0.08 : Math.sin(t * 0.9 + s.x) * 0.05;
        const sway = swing + gust;
        const x = ox - cam.x;
        const y = oy - cam.y;
        if (!onScreen(x, y + len, 30)) return;
        // The hook: an iron plate and a curl.
        rect(ctx, '#2a2a30', x - 2, y - 2, 4, 2);
        rect(ctx, '#5a5a66', x - 1, y - 2, 2, 1);
        rect(ctx, '#3a3a44', x, y, 1, 2);
        // The rope bends more toward the end.
        for (let i = 1; i <= len; i++) {
          const k = i / len;
          const a = sway * (0.6 + 0.4 * k);
          const rx = x + Math.sin(a) * i;
          const ry = y + 1 + Math.cos(a) * i;
          rect(ctx, '#6a4e2a', rx + 1, ry);
          rect(ctx, i % 3 === 0 ? '#8a6a3a' : '#c09a5e', rx, ry);
        }
        const a = sway;
        const ex = x + Math.sin(a) * len;
        const ey = y + 1 + Math.cos(a) * len;
        rect(ctx, '#8a6a3a', ex - 1, ey, 3, 2);
        rect(ctx, '#c8a468', ex - 1, ey, 1, 1);
      },
    },
  };
}

// ---- Floats ----

// Cork floats on the water, bobbing (points: [[x, y], ...] in tiles), strung
// on a line if `line` (true by default). They're on the water: they float.
function floats(s) {
  const pts = s.points ?? [];
  const wild = stormy(s);
  const bob = (i, t) => Math.round(Math.sin(t * (wild ? 3.4 : 1.6) + i * 1.3) * (wild ? 2 : 1));
  return {
    floor(ctx, cam, t) {
      if (s.line === false || pts.length < 2) return;
      ctx.fillStyle = 'rgba(40,36,30,0.55)';
      for (let i = 0; i < pts.length - 1; i++) {
        const [ax, ay] = pts[i];
        const [bx, by] = pts[i + 1];
        const x1 = ax * T + 8 - cam.x;
        const y1 = ay * T + 10 - cam.y + bob(i, t);
        const x2 = bx * T + 8 - cam.x;
        const y2 = by * T + 10 - cam.y + bob(i + 1, t);
        const n = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / 2));
        for (let k = 1; k < n; k++) {
          const u = k / n;
          ctx.fillRect(Math.round(x1 + (x2 - x1) * u), Math.round(y1 + (y2 - y1) * u + Math.sin(u * Math.PI) * 2), 1, 1);
        }
      }
    },
    over(ctx, cam, t) {
      pts.forEach(([px, py], i) => {
        const x = px * T + 8 - cam.x;
        const y = py * T + 10 - cam.y;
        if (!onScreen(x, y)) return;
        const b = bob(i, t);
        // A ring round it as it dips.
        if (Math.sin(t * (wild ? 3.4 : 1.6) + i * 1.3) < -0.8) rect(ctx, 'rgba(230,245,255,0.45)', x - 4, y + 3, 9, 1);
        const red = i % 2 === 0;
        rect(ctx, 'rgba(0,0,0,0.25)', x - 2, y + 3, 5, 1);
        rect(ctx, red ? '#c84a32' : '#e8dcc0', x - 2, y - 1 + b, 5, 3);
        rect(ctx, red ? '#e8dcc0' : '#c84a32', x - 2, y + b, 5, 1);
        rect(ctx, 'rgba(255,255,255,0.5)', x - 1, y - 1 + b, 1, 1);
      });
    },
  };
}

// ---- Blown bits ----

// Bits blowing through a box (x, y, w, h in tiles) on the wind: `colors`, `n`
// of them, `wind` px a second (minus for leftwards). Calm rooms blow gently;
// `stormOnly: true` leaves it out once the storm's gone.
function blown(s) {
  const colors = s.colors ?? ['#6a7a3a', '#4a5a2a', '#8a7a4a'];
  const n = s.n ?? 6;
  const base = s.wind ?? 60;
  return {
    over(ctx, cam, t) {
      const wild = stormy(s);
      const wind = wild ? base : base * 0.35;
      const w = s.w * T;
      const h = s.h * T;
      const ox = s.x * T - cam.x;
      const oy = s.y * T - cam.y;
      if (ox > W + 10 || ox + w < -10 || oy > H + 10 || oy + h < -10) return;
      for (let i = 0; i < n; i++) {
        const speed = Math.abs(wind) * (0.7 + hash(i) * 0.6);
        const across = (w + 20) / speed;
        const life = fract(t / across + hash(i + 4));
        const lap = Math.floor(t / across + hash(i + 4));
        const bx = wind > 0 ? -10 + life * (w + 20) : w + 10 - life * (w + 20);
        const by = hash(i * 7 + lap) * h + Math.sin(t * 3 + i) * 3 + Math.sin(life * Math.PI * 2 + i) * 4;
        const spin = Math.floor(t * 8 + i) % 3;
        const color = colors[i % colors.length];
        const x = ox + bx;
        const y = oy + by;
        if (!onScreen(x, y, 4)) continue;
        // Tumbling: long side on, end on, edge on.
        if (spin === 0) rect(ctx, color, x, y, 3, 1);
        else if (spin === 1) rect(ctx, color, x + 1, y - 1, 1, 3);
        else rect(ctx, color, x, y - 1, 2, 2);
      }
    },
  };
}

// ---- Puddles ----

// Rain puddles (points: [[x, y, w], ...]: the puddle's middle in tiles, `w`
// its width in px, default 14). Rain rings while it rains; a splash when you
// or a friend walk through.
function puddles(s) {
  const pts = (s.points ?? []).map(([x, y, w]) => ({ x: x * T, y: y * T, w: w ?? 14, splash: -10 }));
  return {
    floor(ctx, cam, t) {
      const wild = stormy(s);
      const people = [s.scene.player, ...(s.scene.followers ?? [])];
      pts.forEach((p, i) => {
        const x = p.x - cam.x;
        const y = p.y - cam.y;
        if (!onScreen(x, y)) return;
        const hw = p.w / 2;
        ctx.fillStyle = 'rgba(70,90,100,0.45)';
        ctx.beginPath();
        ctx.ellipse(Math.round(x) + 0.5, Math.round(y) + 0.5, hw, hw * 0.38, 0, 0, Math.PI * 2);
        ctx.fill();
        rect(ctx, 'rgba(210,230,240,0.35)', x - hw * 0.5, y - hw * 0.2, Math.max(2, Math.round(hw * 0.6)), 1);
        // Rain on it.
        if (wild) {
          for (let k = 0; k < 2; k++) {
            const life = fract(t * 1.3 + hash(i * 3 + k));
            const lap = Math.floor(t * 1.3 + hash(i * 3 + k));
            const rx = x + (hash(lap * 5 + i + k) - 0.5) * hw * 1.2;
            const ry = y + (hash(lap * 9 + i - k) - 0.5) * hw * 0.4;
            ctx.strokeStyle = `rgba(220,240,250,${(0.5 * (1 - life)).toFixed(2)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(Math.round(rx) + 0.5, Math.round(ry) + 0.5, 1 + life * 3, (1 + life * 3) * 0.4, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        // Someone walking through it: a splash.
        for (const b of people) {
          if (!b || b.hidden) continue;
          if (!(b === s.scene.player ? b.moving : b.walking)) continue;
          const dx = (b.x + 6 - p.x) / hw;
          const dy = (b.y + 12 - p.y) / (hw * 0.45);
          if (dx * dx + dy * dy < 1 && t - p.splash > 0.32) p.splash = t;
        }
        const age = t - p.splash;
        if (age < 0.35) {
          const u = age / 0.35;
          for (let k = 0; k < 5; k++) {
            const a = (k / 5) * Math.PI + Math.PI;
            const sx = x + Math.cos(a) * (2 + u * 7);
            const sy = y + Math.sin(a) * (3 + u * 2) - Math.sin(u * Math.PI) * 4;
            rect(ctx, `rgba(220,240,250,${(0.9 * (1 - u)).toFixed(2)})`, sx, sy);
          }
        }
      });
    },
  };
}

export const COAST_KINDS = { gull, crab, cat, smoke, rope, floats, blown, puddles };
