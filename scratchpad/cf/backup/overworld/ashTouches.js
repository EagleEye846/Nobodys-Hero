import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, TILE_SIZE as T } from '../config.js';
import { sfx } from '../audio/music.js';
import { glowSprite } from './lamplight.js';

// ASH TOUCHES: the small living things of the Ash Road (the life pass), as kinds for
// touches.js (same rules: only drawn, no bodies, nothing can bump into them). The land
// burned a hundred years ago and never quite went out, so what lives here is small, grey
// and stubborn:
//
//   footprints  every step you take (and your friends') presses a print into the ash,
//               and the ash slowly fills it in again ("Footprints Fill In")
//   embers      embers lifting off the warm ground and drifting down the wind
//   slide       ash sliding off the black branches of the trees, and puffing at the foot
//   smoke       a thin curl of smoke from a crack, a cold hearth, a chimney
//   warm        hairline cracks in the ground that glow and fade, as if it breathed
//   beetles     ash beetles, scuttling about; they dig in when you come near, and out again
//   moth        a pale moth round a warm crack; it flutters off when you come near
//   lizard      a lizard on a warm crack; it darts off when you come near, and comes back
//   crow        a crow on a post or a stump; it flaps off when you come near, and comes back
//   ragline     scorched rags on a line between two black posts, swaying
//
// Every hanging thing draws its own post. Positions are in tiles. A kind that takes
// `spots` takes tile positions [x, y].

const fract = (x) => x - Math.floor(x);
const hash = (n) => fract(Math.sin(n * 91.7 + 17.3) * 43758.5453);
const rect = (ctx, color, x, y, w = 1, h = 1) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};
const onScreen = (x, y, pad = 24) => x > -pad && x < W + pad && y > -pad && y < H + pad;
const feetOf = (scene) => ({ x: scene.player.x + 6, y: scene.player.y + 12 });
// How near anyone in the party is.
const nearest = (scene, px, py) => {
  const f = feetOf(scene);
  let d = Math.hypot(f.x - px, f.y - py);
  for (const o of scene.followers ?? []) if (!o.hidden) d = Math.min(d, Math.hypot(o.x + 6 - px, o.y + 12 - py));
  return d;
};
// How thick the ash storm is just now (the Open Flats), 0 to 1.
const storm = (scene) => scene.ash?.stormLevel?.() ?? 0;
const glow = (ctx, color, x, y, r, alpha) => {
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.drawImage(glowSprite(color), x - r, y - r, r * 2, r * 2);
  ctx.globalAlpha = 1;
};
const dtOf = (state, t) => {
  const dt = state.last === null ? 0.016 : Math.max(0, Math.min(0.05, t - state.last));
  state.last = t;
  return dt;
};

// ---- Footprints ----

// Prints in the ash, one a step, filling in over nine seconds. (On the old road's stones, no
// prints. On the bare sand, darker, wetter ones.)
function footprints(s) {
  const prints = [];
  const lastAt = new Map();
  let side = 0;
  const LIFE = 9;
  const groundAt = (x, y) => s.scene.room.tiles[Math.floor(y / T)]?.[Math.floor(x / T)] ?? '.';
  const record = (id, x, y, t) => {
    const p = lastAt.get(id);
    if (!p) {
      lastAt.set(id, { x, y, stride: 0 });
      return;
    }
    const d = Math.hypot(x - p.x, y - p.y);
    p.x = x;
    p.y = y;
    // A jump (a new room, a scene) leaves nothing.
    if (d > 40) {
      p.stride = 0;
      return;
    }
    p.stride += d;
    if (p.stride < 8) return;
    p.stride = 0;
    const g = groundAt(x, y);
    if (g === ':' || g === 'X' || g === '~') return;
    side = 1 - side;
    prints.push({ x: x + (side ? 2 : -2), y: y - 1, t, sand: g === 'q' });
    if (prints.length > 90) prints.shift();
  };
  return {
    floor(ctx, cam, t) {
      const f = feetOf(s.scene);
      record('hero', f.x, f.y, t);
      for (const o of s.scene.followers ?? []) if (!o.hidden) record(o.id ?? 'friend', o.x + 6, o.y + 12, t);
      for (let i = prints.length - 1; i >= 0; i--) {
        const p = prints[i];
        const age = (t - p.t) / LIFE;
        if (age >= 1) {
          prints.splice(i, 1);
          continue;
        }
        const x = p.x - cam.x;
        const y = p.y - cam.y;
        if (!onScreen(x, y, 6)) continue;
        const dark = p.sand ? '100, 82, 56' : '66, 62, 58';
        const light = p.sand ? '214, 190, 150' : '188, 184, 176';
        // The print: a dark dent with a pale rim on its far edge; the rim sinks and the dent narrows.
        const fill = Math.min(1, age * 1.15);
        const w = Math.max(1, Math.round(4 - 3 * fill));
        const a = 0.5 * (1 - age * age);
        rect(ctx, `rgba(${dark}, ${a.toFixed(2)})`, x - Math.floor(w / 2), y, w, 2);
        if (age < 0.7) rect(ctx, `rgba(${light}, ${(0.32 * (1 - age)).toFixed(2)})`, x - Math.floor(w / 2), y - 1, w, 1);
      }
    },
  };
}

// ---- Embers ----

// A few embers lifting off warm ground and drifting down the wind, across the whole picture, with
// a little parallax (`n` of them; `color` for the glow).
function embers(s) {
  const n = s.n ?? 14;
  return {
    over(ctx, cam, t) {
      const calm = 1 - Math.min(1, storm(s.scene) * 1.3);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < n; i++) {
        const period = 7 + hash(i + 3) * 8;
        const life = fract(t / period + hash(i + 9));
        const x0 = hash(i + 21 + (s.seed ?? 0)) * (W + 80);
        const x = ((x0 + t * (5 + hash(i + 31) * 8) - cam.x * 0.7 + Math.sin(t * 0.7 + i * 2.1) * 7) % (W + 80) + (W + 80)) % (W + 80) - 40;
        const y = H + 6 - life * (H * (0.5 + hash(i + 41) * 0.5)) + Math.sin(t * 1.3 + i) * 3;
        const a = Math.sin(life * Math.PI) * 0.8 * calm;
        if (a < 0.05) continue;
        const hot = life < 0.45;
        rect(ctx, hot ? `rgba(255, 190, 90, ${a.toFixed(2)})` : `rgba(230, 100, 40, ${a.toFixed(2)})`, x, y, 1, 1);
        if (hash(i + 51) < 0.35) {
          glow(ctx, '255, 130, 50', x, y, 5, a * 0.25);
          rect(ctx, `rgba(255, 210, 140, ${(a * 0.6).toFixed(2)})`, x, y - 1, 1, 1);
        }
      }
      ctx.restore();
    },
  };
}

// ---- Ash sliding off branches ----

// Dead trees shed their ash now and then: a pinch slides off a branch tip, falls, and puffs at the
// foot. Takes the room's burnt-tree tiles (T), and `spots` (tile positions of other tall trees).
function slide(s) {
  const trees = [];
  const rows = s.scene.room.tiles;
  rows.forEach((row, ty) => [...row].forEach((c, tx) => { if (c === 'T') trees.push([tx, ty]); }));
  for (const [tx, ty] of s.spots ?? []) trees.push([tx, ty]);
  return {
    over(ctx, cam, t) {
      if (storm(s.scene) > 0.4) return;
      for (let i = 0; i < trees.length; i++) {
        const [tx, ty] = trees[i];
        const bx = tx * T + 8 - cam.x;
        const by = ty * T - cam.y;
        if (!onScreen(bx, by, 40)) continue;
        const period = 8 + hash(i * 3.7 + 1) * 10;
        const at = fract(t / period + hash(i * 1.9 + 5)) * period;
        // The slide: 1.6 seconds of flakes sliding and dropping, then the puff.
        if (at > 2.6) continue;
        const side = hash(i + 7) < 0.5 ? -1 : 1;
        const hx = bx + side * (3 + hash(i + 11) * 5);
        const hy = by - 8 - hash(i + 13) * 6;
        const ground = by + 10 + hash(i + 15) * 5;
        for (let k = 0; k < 7; k++) {
          const u = at - k * 0.09;
          if (u < 0 || u > 1.5) continue;
          // Slides a few pixels along the branch, then drops.
          const slideX = Math.min(u, 0.5) * 7 * side;
          const drop = Math.max(0, u - 0.4);
          const y = hy + Math.min(1, u * 2) * 1.5 + drop * drop * 26;
          if (y > ground) continue;
          const x = hx + slideX + Math.sin(u * 5 + k) * 1.2 * drop;
          rect(ctx, k % 3 ? 'rgba(196, 192, 184, 0.85)' : 'rgba(224, 220, 212, 0.9)', x, y, 1, k % 2 ? 2 : 1);
        }
        const land = at - 1.4;
        if (land > 0 && land < 1.1) {
          const r = land / 1.1;
          for (let k = 0; k < 5; k++) {
            const a = (k / 5) * Math.PI;
            rect(ctx, `rgba(190, 186, 178, ${(0.7 * (1 - r)).toFixed(2)})`, hx + side * 2 + Math.cos(a) * (3 + r * 6) * (k % 2 ? 1 : -1), ground - Math.sin(a) * r * 4, 1, 1);
          }
        }
      }
    },
  };
}

// ---- Smoke ----

// x, y: where the smoke comes from (the middle of a tile's foot). A thin curl, a few specks of grey
// wandering up and widening, leaning with the wind. `thin: true` for a wisp off a crack; `n` of them.
function smoke(s) {
  const n = s.n ?? 7;
  const seed = s.x * 3.1 + s.y * 1.7;
  const x0 = s.x * T + 8;
  const y0 = s.y * T + (s.dy ?? 10);
  const rise = s.rise ?? 44;
  return {
    over(ctx, cam, t) {
      if (!onScreen(x0 - cam.x, y0 - cam.y - rise / 2, 60)) return;
      // A crack that has been smothered with ash has stopped smoking.
      if (s.onCrack && s.scene.room.bridged?.has(`${s.x},${s.y}`)) return;
      const k = 1 - Math.min(1, storm(s.scene) * 0.8);
      for (let i = 0; i < n; i++) {
        const life = fract(t * (s.thin ? 0.12 : 0.1) + i / n + hash(seed));
        const spread = life * (s.thin ? 3 : 5);
        const x = x0 - cam.x + Math.sin(life * 7 + seed + i) * (1.5 + life * 3) + life * (s.lean ?? 8);
        const y = y0 - cam.y - life * rise;
        const a = Math.sin(Math.min(1, life * 1.15) * Math.PI) * (s.thin ? 0.3 : 0.4) * k;
        if (a < 0.03) continue;
        rect(ctx, `rgba(74, 68, 64, ${a.toFixed(2)})`, x - spread / 2, y, 2 + spread, 2);
        rect(ctx, `rgba(122, 116, 110, ${(a * 0.8).toFixed(2)})`, x - spread / 2 + 1, y - 1, Math.max(1, 1 + spread - 1), 1);
      }
      // The warm foot of it, if it comes from a hearth or a crack.
      if (s.glow) glow(ctx, '255, 120, 40', x0 - cam.x, y0 - cam.y, 9, 0.22 + 0.08 * Math.sin(t * 2.3 + seed));
    },
  };
}

// ---- Warm cracks ----

// Hairline cracks in the ground (`spots`: [x, y, length in pixels]) that glow and fade, slowly, as if
// the ground were breathing; and the odd spark. Under everyone: they're on the floor.
function warm(s) {
  const cracks = (s.spots ?? []).map(([tx, ty, len], i) => {
    const pts = [[0, 0]];
    let x = 0;
    let y = 0;
    const steps = Math.max(3, Math.round((len ?? 14) / 3));
    for (let k = 0; k < steps; k++) {
      x += 2 + Math.floor(hash(i * 13 + k) * 2);
      y += Math.floor(hash(i * 7 + k * 3) * 3) - 1;
      pts.push([x, y]);
    }
    return { x: tx * T + 2, y: ty * T + 8, pts, phase: hash(i * 5 + 2) * 6.28 };
  });
  return {
    floor(ctx, cam, t) {
      ctx.save();
      for (const c of cracks) {
        if (!onScreen(c.x - cam.x, c.y - cam.y, 50)) continue;
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.25 + c.phase);
        const a = 0.28 + 0.5 * pulse;
        // The dark edge of the crack, then the red inside it.
        for (const [px, py] of c.pts) rect(ctx, 'rgba(24, 16, 12, 0.55)', c.x - cam.x + px, c.y - cam.y + py + 1, 2, 1);
        for (const [px, py] of c.pts) rect(ctx, `rgba(${pulse > 0.6 ? '255, 150, 50' : '214, 80, 30'}, ${a.toFixed(2)})`, c.x - cam.x + px, c.y - cam.y + py, 2, 1);
        const mid = c.pts[Math.floor(c.pts.length / 2)];
        glow(ctx, '255, 110, 40', c.x - cam.x + mid[0], c.y - cam.y + mid[1], 12, 0.12 + 0.16 * pulse);
      }
      ctx.restore();
    },
  };
}

// ---- Beetles ----

// A little group of ash beetles in a patch (x, y, w, h in tiles; `n`; `color`, `shell`). They potter about, a
// few steps and a stop; come near and they dig straight in, leaving a pinch of ash and a ring; a few
// seconds later one comes up again. `tiny: true` for something smaller and brighter (a ladybird).
function beetles(s) {
  const n = s.n ?? 4;
  const seed = s.x * 4.3 + s.y * 2.1;
  const bugs = [];
  const state = { last: null };
  const box = { x: s.x * T, y: s.y * T, w: (s.w ?? 3) * T, h: (s.h ?? 2) * T };
  for (let i = 0; i < n; i++) {
    bugs.push({
      x: box.x + hash(seed + i) * box.w,
      y: box.y + hash(seed + i + 9) * box.h,
      tx: 0,
      ty: 0,
      mode: 'go',
      wait: hash(seed + i + 3) * 2,
      under: 0,
      dir: 1,
      step: hash(seed + i) * 5,
    });
    bugs[i].tx = bugs[i].x;
    bugs[i].ty = bugs[i].y;
  }
  const body = s.color ?? '#1e1814';
  const shine = s.shine ?? '#5a4a3c';
  return {
    thing: {
      sortY: box.y + box.h + 1,
      draw(ctx, cam, t) {
        const dt = dtOf(state, t);
        if (!onScreen(box.x + box.w / 2 - cam.x, box.y + box.h / 2 - cam.y, 80 + box.w)) return;
        const tiny = Boolean(s.tiny);
        for (let i = 0; i < bugs.length; i++) {
          const b = bugs[i];
          const d = nearest(s.scene, b.x, b.y);
          if (b.mode === 'go' && d < (s.scare ?? 30) && !s.stay) {
            b.mode = 'dig';
            b.under = 0;
            b.dir = Math.sign(b.x - feetOf(s.scene).x) || 1;
            if (onScreen(b.x - cam.x, b.y - cam.y, 0)) sfx('scuttle');
          }
          if (b.mode === 'dig') {
            b.under += dt;
            b.x += b.dir * 22 * dt;
            b.step += dt * 30;
            if (b.under > 0.45) {
              b.mode = 'under';
              b.under = 0;
            }
          } else if (b.mode === 'under') {
            b.under += dt;
            if (b.under > 5 + hash(seed + i * 3) * 4 && d > 48) {
              b.mode = 'up';
              b.under = 0;
              b.x = Math.min(box.x + box.w, Math.max(box.x, b.x));
              b.tx = b.x;
              b.ty = b.y;
            }
          } else if (b.mode === 'up') {
            b.under += dt;
            if (b.under > 0.5) b.mode = 'go';
          } else if (b.wait > 0) {
            b.wait -= dt;
          } else if (Math.hypot(b.tx - b.x, b.ty - b.y) < 1.2) {
            b.wait = 0.6 + hash(seed + t + i) * 2.4;
            b.tx = box.x + hash(seed + t * 1.3 + i * 5) * box.w;
            b.ty = box.y + hash(seed + t * 0.7 + i * 9) * box.h;
          } else {
            const a = Math.atan2(b.ty - b.y, b.tx - b.x);
            b.x += Math.cos(a) * 14 * dt;
            b.y += Math.sin(a) * 14 * dt;
            b.dir = Math.cos(a) >= 0 ? 1 : -1;
            b.step += dt * 24;
          }
          const x = b.x - cam.x;
          const y = b.y - cam.y;
          if (!onScreen(x, y, 6)) continue;
          // Dug in: a little ring of ash, and (now and then) a pair of feelers.
          if (b.mode === 'under') {
            rect(ctx, 'rgba(210, 206, 198, 0.55)', x - 2, y, 5, 1);
            rect(ctx, 'rgba(70, 66, 62, 0.5)', x - 1, y + 1, 3, 1);
            continue;
          }
          const sink = b.mode === 'dig' ? Math.min(1, b.under / 0.45) : b.mode === 'up' ? 1 - Math.min(1, b.under / 0.5) : 0;
          const legs = Math.floor(b.step) % 2;
          if (tiny) {
            rect(ctx, body, x - 1, y - 2, 3, 2);
            rect(ctx, 'rgba(0,0,0,0.22)', x - 1, y, 3, 1);
            rect(ctx, '#140e0c', x + b.dir, y - 2, 1, 1);
            rect(ctx, '#140e0c', x - 1 + legs, y - 1, 1, 1);
            continue;
          }
          rect(ctx, 'rgba(0,0,0,0.22)', x - 3, y, 7, 1);
          if (sink < 0.75) {
            rect(ctx, '#0e0b09', x - 3 + legs, y - 1, 1, 1);
            rect(ctx, '#0e0b09', x + 2 - legs, y - 1, 1, 1);
            rect(ctx, '#0e0b09', x - 2 + legs, y, 1, 1);
            rect(ctx, '#0e0b09', x + 3 - legs, y, 1, 1);
            rect(ctx, body, x - 2, y - 3 + Math.round(sink * 2), 5, 3 - Math.round(sink * 2));
            rect(ctx, shine, x - 1, y - 3 + Math.round(sink * 2), 2, 1);
            rect(ctx, '#0e0b09', x + b.dir * 3, y - 2 + Math.round(sink * 2), 1, 1);
          }
          if (b.mode === 'dig') rect(ctx, 'rgba(206, 202, 194, 0.6)', x - 3 - b.dir * 2, y - 1 - Math.round(sink * 2), 3, 1);
        }
      },
    },
  };
}

// ---- A moth ----

// x, y: the warm spot it keeps by (the middle of a tile). It loops round it, wings going; come near
// and it flutters up and away, and comes back to the spot a while after.
function moth(s) {
  const cx = s.x * T + 8;
  const cy = s.y * T + 4;
  const seed = s.x * 1.7 + s.y * 6.1;
  let mode = 'loop';
  let t0 = 0;
  let from = 0;
  let dir = 1;
  return {
    thing: {
      sortY: 1e7,
      draw(ctx, cam, t) {
        const d = nearest(s.scene, cx, cy + 6);
        if (mode === 'loop' && d < (s.scare ?? 34)) {
          mode = 'off';
          t0 = t;
          dir = feetOf(s.scene).x > cx ? -1 : 1;
          if (onScreen(cx - cam.x, cy - cam.y, 0)) sfx('flutter');
        } else if (mode === 'off' && t - t0 > 2) {
          mode = 'away';
          from = t + 8 + hash(seed + t0) * 8;
        } else if (mode === 'away' && t > from && d > 70) {
          mode = 'back';
          t0 = t;
        } else if (mode === 'back' && t - t0 > 2) mode = 'loop';
        if (mode === 'away') return;
        let x;
        let y;
        const loopAt = (tt) => [cx + Math.sin(tt * 1.7 + seed) * 8 + Math.sin(tt * 4.1) * 2, cy - 6 + Math.cos(tt * 2.3 + seed) * 5];
        if (mode === 'loop') [x, y] = loopAt(t);
        else {
          const u = Math.min(1, (t - t0) / 2);
          const [lx, ly] = loopAt(t);
          const far = mode === 'off' ? u : 1 - u;
          x = lx + dir * far * 90;
          y = ly - far * 50 + Math.sin(t * 9) * 2;
        }
        const sx = x - cam.x;
        const sy = y - cam.y;
        if (!onScreen(sx, sy, 10)) return;
        const flap = Math.floor(t * 14 + seed) % 2;
        rect(ctx, '#d8d2c6', sx - 2, sy - flap, 2, 1 + flap);
        rect(ctx, '#d8d2c6', sx + 1, sy - flap, 2, 1 + flap);
        rect(ctx, '#7a7268', sx, sy, 1, 2);
        rect(ctx, 'rgba(255, 200, 150, 0.3)', sx - 3, sy + 1, 7, 1);
        // The warm spot draws it in.
        glow(ctx, '255, 150, 70', sx, sy, 6, 0.1);
      },
    },
  };
}

// ---- A lizard on a warm crack ----

// x, y: its rock (the middle of a tile's foot). It lies flat, tongue now and then, head turning; come
// near and it darts off a few tiles, freezes, and creeps back once you've gone.
function lizard(s) {
  const hx = s.x * T + 8;
  const hy = s.y * T + 12;
  const seed = s.x * 2.9 + s.y * 4.7;
  const state = { last: null };
  let x = hx;
  let mode = 'sit';
  let wait = 0;
  let dir = s.face ?? 1;
  const run = (s.run ?? 3) * T;
  return {
    floor(ctx, cam, t) {
      // The warm stone it lies on: a dull red patch of ground.
      const px = hx - cam.x;
      const py = hy - cam.y;
      if (!onScreen(px, py, 20)) return;
      glow(ctx, '255, 110, 40', px, py - 1, 14, 0.16 + 0.07 * Math.sin(t * 1.4 + seed));
      rect(ctx, 'rgba(90, 38, 20, 0.55)', px - 6, py - 2, 12, 3);
      rect(ctx, 'rgba(170, 70, 30, 0.5)', px - 4, py - 2, 8, 1);
    },
    thing: {
      sortY: hy + 1,
      draw(ctx, cam, t) {
        const dt = dtOf(state, t);
        const d = nearest(s.scene, x, hy);
        if (mode === 'sit' && d < (s.scare ?? 30)) {
          mode = 'dash';
          dir = Math.sign(hx - feetOf(s.scene).x) || 1;
          wait = 0;
          if (onScreen(x - cam.x, hy - cam.y, 0)) sfx('scuttle');
        }
        if (mode === 'dash') {
          x += dir * 70 * dt;
          wait += dt;
          if (Math.abs(x - hx) > run || wait > 0.6) {
            mode = 'frozen';
            wait = 0;
          }
        } else if (mode === 'frozen') {
          wait += dt;
          if (wait > 5 && nearest(s.scene, hx, hy) > 60) mode = 'creep';
        } else if (mode === 'creep') {
          const way = Math.sign(hx - x);
          x += way * 16 * dt;
          dir = way || dir;
          if (Math.abs(hx - x) < 1) {
            x = hx;
            mode = 'sit';
          }
        }
        const px = x - cam.x;
        const py = hy - cam.y;
        if (!onScreen(px, py, 12)) return;
        const lie = mode === 'sit' ? Math.sin(t * 1.6 + seed) * 0.4 : 0;
        const walk = mode === 'dash' || mode === 'creep' ? Math.floor(t * (mode === 'dash' ? 30 : 10)) % 2 : 0;
        const f = dir;
        const m = (lx, ly, w, c) => rect(ctx, c, f > 0 ? px + lx : px - lx - w + 1, py + ly, w, 1);
        m(-1, 0, 8, 'rgba(0,0,0,0.22)');
        // Body, tail curling, head up a pixel, little legs, an ember-orange belly showing.
        m(-4, -2, 7, '#6a6a3a');
        m(-3, -3, 5, '#7e7e46');
        m(-1, -3, 2, '#a8a860');
        m(3, -2, 3, '#7e7e46');
        m(5, -2 - Math.round(lie), 1, '#14100c');
        m(-7, -1, 3, '#5a5a30');
        m(-9, -2 + (walk ? 1 : 0), 2, '#5a5a30');
        m(-4, -1, 1, '#d46a30');
        m(1, -1, 1, '#d46a30');
        m(-3 + walk, 0, 1, '#4a4a28');
        m(2 - walk, 0, 1, '#4a4a28');
        // A flick of tongue now and then.
        if (mode === 'sit' && fract(t * 0.4 + seed) < 0.06) m(6, -2, 2, '#c8483a');
      },
    },
  };
}

// ---- A crow ----

// x, y: where it perches (its feet: the top of a post or a stump). It stands, turns its head, pecks,
// preens; come near and it flaps off to the side and away, and lands back a good while later.
// `post: <pixels>` draws its own post under it (leave it out where it's on a prop).
function crow(s) {
  const fx = s.x * T + 8 + (s.dx ?? 0);
  const fy = s.y * T + (s.dy ?? 4);
  const seed = s.x * 3.7 + s.y * 1.3;
  let mode = 'sit';
  let t0 = 0;
  let until = 0;
  let dir = s.face ?? 1;
  const post = s.post ?? 0;
  const flight = (u) => [fx + dir * u * 120, fy - 6 - u * 70 - Math.sin(u * Math.PI) * 8];
  return {
    thing: {
      sortY: fy + post + (s.sort ?? 0),
      draw(ctx, cam, t) {
        const d = nearest(s.scene, fx, fy + post);
        if (mode === 'sit' && d < (s.scare ?? 38)) {
          mode = 'off';
          t0 = t;
          dir = feetOf(s.scene).x > fx ? -1 : 1;
          if (onScreen(fx - cam.x, fy - cam.y, 0)) sfx('flutter');
        } else if (mode === 'off' && t - t0 > 2.2) {
          mode = 'away';
          until = t + 14 + hash(seed + t0) * 14;
        } else if (mode === 'away' && t > until && d > 90) {
          mode = 'back';
          t0 = t;
        } else if (mode === 'back' && t - t0 > 2.4) mode = 'sit';
        const x = fx - cam.x;
        const y = fy - cam.y;
        if (post && onScreen(x, y + post, 30)) {
          rect(ctx, '#0e0c0b', x - 3, y, 6, post);
          rect(ctx, '#2e2622', x - 2, y, 4, post - 1);
          rect(ctx, '#45382f', x - 2, y, 1, post - 1);
          rect(ctx, '#a6a29b', x - 3, y, 4, 1);
        }
        if (mode === 'away') return;
        if (mode === 'sit') {
          if (onScreen(x, y)) crowSitting(ctx, x, y, dir, t, seed);
          return;
        }
        const u = (t - t0) / (mode === 'off' ? 2.2 : 2.4);
        const [wx, wy] = flight(mode === 'off' ? Math.min(1, u) : Math.max(0, 1 - u));
        const px = wx - cam.x;
        const py = wy - cam.y;
        if (!onScreen(px, py, 14)) return;
        const face = mode === 'off' ? dir : -dir;
        crowFlying(ctx, px, py, face, t);
        if (mode === 'back' && u > 0.92) crowSitting(ctx, x, y, -dir, t, seed);
      },
    },
  };
}

const CROW = { body: '#17141a', sheen: '#3c3844', beak: '#6a6258', eye: '#d8d0b8', legs: '#2a2420', ash: '#a6a29b' };
function mir(ctx, color, ox, f, lx, y, w = 1, h = 1) {
  rect(ctx, color, f > 0 ? ox + lx : ox - lx - w + 1, y, w, h);
}
function crowSitting(ctx, x, y, f, t, seed) {
  const phase = fract(t * 0.13 + hash(seed));
  // A cycle: still, a head turn, a peck or two, a preen.
  const peck = phase > 0.3 && phase < 0.4 && Math.sin(t * 14) > 0 ? 3 : 0;
  const turn = phase > 0.55 && phase < 0.7 ? -1 : 1;
  const ff = f * turn;
  mir(ctx, CROW.legs, x, f, -1, y - 2, 1, 2);
  mir(ctx, CROW.legs, x, f, 1, y - 2, 1, 2);
  mir(ctx, CROW.body, x, f, -3, y - 7 + (peck ? 1 : 0), 7, 5);
  mir(ctx, CROW.sheen, x, f, -2, y - 7 + (peck ? 1 : 0), 3, 1);
  mir(ctx, CROW.body, x, f, -6, y - 5, 4, 2);
  mir(ctx, CROW.body, x, f, -7, y - 4, 2, 1);
  // Head and beak.
  mir(ctx, CROW.body, x, ff, 2, y - 9 + peck, 4, 3);
  mir(ctx, CROW.beak, x, ff, 5, y - 8 + peck, 3, 1);
  mir(ctx, CROW.beak, x, ff, 5, y - 7 + peck, 2, 1);
  mir(ctx, CROW.eye, x, ff, 4, y - 9 + peck, 1, 1);
  // Ash on its back.
  mir(ctx, CROW.ash, x, f, -1, y - 8, 2, 1);
}
function crowFlying(ctx, x, y, f, t) {
  const flap = Math.floor(t * 12) % 2;
  mir(ctx, CROW.body, x, f, -2, y - 2, 6, 3);
  mir(ctx, CROW.body, x, f, 3, y - 3, 3, 2);
  mir(ctx, CROW.beak, x, f, 6, y - 2, 2, 1);
  mir(ctx, CROW.eye, x, f, 5, y - 3, 1, 1);
  mir(ctx, CROW.body, x, f, -5, y - 1, 3, 1);
  // Wings, up and down.
  if (flap) {
    mir(ctx, CROW.body, x, f, -3, y - 7, 3, 5);
    mir(ctx, CROW.body, x, f, -1, y - 9, 3, 3);
  } else {
    mir(ctx, CROW.body, x, f, -3, y + 1, 4, 3);
    mir(ctx, CROW.sheen, x, f, 0, y + 1, 3, 1);
  }
}

// ---- A line of scorched rags ----

// A line of rags (x, y to x2, y2 in tiles, y2 default y) strung between two black posts; they hang
// stiff with soot and sway a little. A single faded red one among the greys.
function ragline(s) {
  return {
    thing: {
      sortY: Math.max(s.y, s.y2 ?? s.y) * T + 6,
      draw(ctx, cam, t) {
        const x1 = s.x * T - cam.x;
        const y1 = s.y * T - cam.y;
        const x2 = (s.x2 ?? s.x + 4) * T - cam.x;
        const y2 = (s.y2 ?? s.y) * T - cam.y;
        if (x2 < -20 || x1 > W + 20 || y1 > H + 30 || y2 < -40) return;
        const len = Math.round(x2 - x1);
        const sag = (u) => Math.round(Math.sin(u * Math.PI) * 3);
        for (const [px, py] of [[x1, y1], [x2, y2]]) {
          const top = Math.round(py) - 2;
          const post = Math.round(px) - 1;
          rect(ctx, '#0e0c0b', post - 1, top, 4, 22);
          rect(ctx, '#2e2622', post, top, 2, 21);
          rect(ctx, '#45382f', post, top, 1, 21);
          rect(ctx, '#a6a29b', post - 1, top, 3, 1);
          rect(ctx, '#0e0c0b', post - 2, top + 21, 6, 1);
        }
        for (let i = 0; i <= len; i++) rect(ctx, '#3a2e26', x1 + i, y1 + (y2 - y1) * (i / len) + sag(i / len));
        const cloths = [['#4a443e', 5, 10], ['#6a625a', 4, 7], ['#8a2a20', 3, 8], ['#38322d', 6, 11], ['#5a544c', 4, 6]];
        const count = s.items ?? Math.max(2, Math.floor(len / 13));
        for (let i = 0; i < count; i++) {
          const [col, w, h] = cloths[i % cloths.length];
          const u = (i + 0.6) / (count + 0.2);
          const cx = x1 + len * u;
          const cy = y1 + (y2 - y1) * u + sag(u) + 1;
          const swing = Math.sin(t * 1.3 + i * 1.9) * 0.9;
          for (let r = 0; r < h; r++) {
            const sw = Math.round(swing * (r / h));
            // Burnt ragged along the bottom.
            const ww = r > h - 3 && (i + r) % 2 ? w - 1 : w;
            rect(ctx, col, cx + sw, cy + r, ww, 1);
          }
          rect(ctx, '#a6a29b', cx + 1, cy - 1, 2, 1);
        }
      },
    },
  };
}

export const ASH_KINDS = { footprints, embers, slide, smoke, warm, beetles, moth, lizard, crow, ragline };

// What every room of the Ash Road gets, and what each has of its own. (Positions are tiles: see each room.)
const EVERY = [
  { kind: 'footprints' },
  { kind: 'embers', n: 12 },
  { kind: 'slide' },
];

export const ASH_ROOM_TOUCHES = {
  // Stranded crabs on the bare sand (they dig back in when you come near), sand-hoppers, and nothing else yet.
  ash_seabed: [
    { kind: 'crab', x: 14, y: 12, r: 2 },
    { kind: 'crab', x: 27, y: 8, r: 2 },
    { kind: 'crab', x: 9, y: 12, r: 1.5 },
    { kind: 'beetles', x: 22, y: 5, w: 5, h: 2, n: 5, color: '#8a7050', shine: '#c2ab86', scare: 26 },
  ],
  // A crow on the signpost's top, beetles in the ash.
  ash_tideline: [
    { kind: 'crow', x: 27, y: 3, dy: 5, sort: 30 },
    { kind: 'beetles', x: 21, y: 9, w: 4, h: 2, n: 4 },
  ],
  // The seam wall to wall still breathes: smoke off it, warm hairlines beside it, a lizard and a moth.
  ash_buried_road: [
    { kind: 'crow', x: 32, y: 5, dy: 2, post: 14, face: -1 },
    { kind: 'beetles', x: 2, y: 9, w: 5, h: 2, n: 3 },
    { kind: 'smoke', x: 25, y: 5, thin: true, glow: true, onCrack: true, n: 5, rise: 32 },
    { kind: 'smoke', x: 25, y: 10, thin: true, glow: true, onCrack: true, n: 5, rise: 32 },
    { kind: 'warm', spots: [[27, 4, 10], [30, 9, 12], [20, 11, 9]] },
    { kind: 'lizard', x: 26, y: 10 },
    { kind: 'moth', x: 24, y: 5 },
  ],
  // A crow on the lone chimney, two seams smoking, a lizard and a moth between them.
  ash_cinder_field: [
    { kind: 'crow', x: 7, y: 3, dy: 8, sort: 60 },
    { kind: 'beetles', x: 21, y: 12, w: 4, h: 2, n: 3 },
    { kind: 'smoke', x: 14, y: 8, thin: true, glow: true, onCrack: true, n: 5, rise: 34 },
    { kind: 'smoke', x: 19, y: 9, thin: true, glow: true, onCrack: true, n: 5, rise: 34 },
    { kind: 'warm', spots: [[16, 5, 12], [17, 13, 10], [22, 11, 12]] },
    { kind: 'lizard', x: 16, y: 12 },
    { kind: 'moth', x: 18, y: 6 },
  ],
  // A crow on the birdhouse, a ladybird on the green shoot, a smouldering root, a line of scorched rags.
  ash_orchard: [
    { kind: 'crow', x: 28, y: 3, dy: 5, sort: 40 },
    { kind: 'beetles', x: 14, y: 6, w: 4, h: 2, n: 4, shine: '#6a5a3c' },
    { kind: 'beetles', x: 23.5, y: 12.5, w: 1, h: 1, n: 1, tiny: true, color: '#c0302a', stay: true },
    { kind: 'ragline', x: 10, y: 13, x2: 15, y2: 13 },
    { kind: 'smoke', x: 21, y: 12, thin: true, glow: true, n: 5, rise: 30 },
    { kind: 'warm', spots: [[21, 12, 10]] },
    { kind: 'moth', x: 21, y: 11 },
  ],
  // A crow on the scarecrow's arm; the cracks breathe; a lizard and a moth.
  ash_storm_flats: [
    { kind: 'crow', x: 7, y: 11, dx: 6, dy: 11, sort: 30 },
    { kind: 'beetles', x: 15, y: 5, w: 5, h: 2, n: 4 },
    { kind: 'smoke', x: 15, y: 6, thin: true, glow: true, onCrack: true, n: 5, rise: 32 },
    { kind: 'smoke', x: 29, y: 6, thin: true, glow: true, onCrack: true, n: 5, rise: 32 },
    { kind: 'smoke', x: 31, y: 13, thin: true, glow: true, onCrack: true, n: 5, rise: 32 },
    { kind: 'warm', spots: [[20, 6, 12], [20, 14, 10], [40, 6, 10]] },
    { kind: 'lizard', x: 21, y: 14 },
    { kind: 'moth', x: 29, y: 5 },
  ],
  // A crow on the signpost, beetles in the lee of the wall.
  ash_waystation: [
    { kind: 'crow', x: 24, y: 4, dy: 4, sort: 30 },
    { kind: 'beetles', x: 22, y: 12, w: 4, h: 2, n: 3 },
  ],
  // A crow on the cairn's stick, three seams smoking, a lizard and a moth.
  ash_drift_cut: [
    { kind: 'crow', x: 31, y: 5, dx: 2, dy: 12, sort: 30 },
    { kind: 'beetles', x: 5, y: 3, w: 4, h: 2, n: 3 },
    { kind: 'smoke', x: 14, y: 7, thin: true, glow: true, onCrack: true, n: 5, rise: 32 },
    { kind: 'smoke', x: 18, y: 7, thin: true, glow: true, onCrack: true, n: 5, rise: 32 },
    { kind: 'smoke', x: 26, y: 7, thin: true, glow: true, onCrack: true, n: 5, rise: 32 },
    { kind: 'warm', spots: [[9, 6, 10], [22, 11, 10], [30, 10, 10]] },
    { kind: 'lizard', x: 15, y: 10 },
    { kind: 'moth', x: 19, y: 10 },
  ],
  // A crow on the letter box; and thin smoke from the chimney pots of the buried town (it is not dead).
  ash_town_gate: [
    { kind: 'crow', x: 16, y: 8, dy: 8, sort: 30 },
    { kind: 'beetles', x: 22, y: 14, w: 4, h: 2, n: 3 },
    { kind: 'smoke', x: 33, y: 4, dy: 12, thin: true, n: 6, rise: 34, lean: 6 },
    { kind: 'smoke', x: 30, y: 3, dy: 12, thin: true, n: 6, rise: 34, lean: 6 },
    { kind: 'smoke', x: 33, y: 11, dy: 12, thin: true, n: 6, rise: 34, lean: 6 },
    { kind: 'warm', spots: [[24, 16, 8]] },
  ],
};

// The touches for a room of the Ash Road: the ones every room has, then its own.
export function ashTouchesFor(roomData) {
  if (roomData.area !== 'ashroad') return [];
  return [...EVERY, ...(ASH_ROOM_TOUCHES[roomData.id] ?? [])];
}
