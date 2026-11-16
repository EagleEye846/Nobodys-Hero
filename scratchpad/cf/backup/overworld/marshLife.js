import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, TILE_SIZE as T } from '../config.js';
import { fract, hash } from '../engine/noise.js';
import { glowSprite } from './lamplight.js';

// MARSH LIFE: the living extras of chapter 3's Old Drains and Lantern Marsh (the life pass of 15
// November 2026), as more kinds for touches.js. Same rules as every touch: drawn only, no bodies, so
// nothing here can block a current, a push, a bog hop, a carry or a cutscene walk. The marsh is quiet on
// purpose: nothing here scatters, flaps off or makes a noise. Where each one goes is a table in
// src/data/marshTouches.js, by room id. Positions are in tiles.
//
//   drainrat        a rat along a line of floor: sniffs, trots, and is gone into a crack if you come near;
//              back after a while (the drains)
//   drainflotsam    things carried on the currents: corks, scraps, a tin boat, the odd boot (the drains;
//              it finds the room's currents itself, and goes only where a current is running)
//   drainseep       damp running down a wall face in a thin thread, now and then (x, y, len)
//   fenwisp    will-o-wisps far off over the fen: faint, slow, never near (a box: x, y, w, h, n)
//   fenheron      a heron standing in the shallows: still, a head turn, a stab at the water now and then;
//              if you come close it lowers its head and slips off into the reeds, back later (no flurry)
//   fenreeds   clumps of reeds in front of the ground, swaying, leaning off you as you pass
//   fenmist   low banks of mist drifting through, a little in front of everything
//   fenrise       something coming up under the fen water and ringing it (a box over water)
//   fenstriders   pond-skaters dimpling still water
//   fenplop    a blister rising on the bog, swelling, popping with a ring (points: [[x, y]])
//   hutglow   a warm square of lamplight laid on the floor by a stove or window
//
// Everything is worked out from the time and the player's place.

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
const glow = (ctx, color, x, y, r, alpha) => {
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.drawImage(glowSprite(color), x - r, y - r, r * 2, r * 2);
  ctx.globalAlpha = 1;
};
const ring = (ctx, x, y, u, color, size = 6) => {
  ctx.strokeStyle = `rgba(${color},${(0.55 * (1 - u)).toFixed(2)})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(Math.round(x) + 0.5, Math.round(y) + 0.5, 1 + u * size, (1 + u * size) * 0.42, 0, 0, Math.PI * 2);
  ctx.stroke();
};
const isWaterTile = (scene, tx, ty) => {
  const c = scene.room.tileAt(tx, ty);
  return c === '$' || c === '~';
};

// ---- Drains ----

// A rat, side on, facing f; `step` flickers its feet.
function drawRat(ctx, x, y, f, step, sniff) {
  const at = (lx, ly, color, w = 1) => rect(ctx, color, f > 0 ? x + lx : x - lx - w + 1, y + ly, w, 1);
  rect(ctx, 'rgba(0,0,0,0.28)', x - 3, y + 1, 7, 1);
  at(-3, -2, '#3e3630', 5);
  at(-2, -3, '#52463c', 4);
  at(2, -3, '#4a4036', 2);
  at(4, -2, '#4a4036', 2);
  at(5, -2, '#b89080');
  at(3, -3, '#1a1612');
  at(2, -4, '#6a5a4c');
  at(-4, -1, '#2a2420', 1);
  for (let k = 0; k < 5; k++) at(-5 - k, -1 + Math.round(Math.sin(k * 0.9 + step * 2) * 0.8), '#7a5a52');
  at(-2, -1 + (step % 2), '#1a1612');
  at(2, -1 + ((step + 1) % 2), '#1a1612');
  if (sniff) at(6, -2 + (step % 2), '#c8b0a0');
}

function makeRat(spec, index, scene) {
  const base = spec.x0 ?? spec.x ?? 0;
  return {
    i: index,
    x: (spec.x0 + hash(index * 3 + spec.y) * (spec.x1 - spec.x0)) * T,
    face: hash(index + 1) > 0.5 ? 1 : -1,
    mode: 'idle',
    until: hash(index * 7 + base) * 3,
    goal: 0,
    step: 0,
  };
}

// ---- Currents ----

// Every run of current in the room, as {horizontal, dir, line, from, to} in tiles, found from its props.
function findLanes(scene) {
  const flows = scene.room.props.filter((p) => p.flow);
  const lanes = [];
  const seen = new Set();
  for (const p of flows) {
    const tx = p.x / T;
    const ty = p.y / T;
    if (seen.has(`${tx},${ty}`)) continue;
    const horizontal = p.flow === 'left' || p.flow === 'right';
    let a = horizontal ? tx : ty;
    let b = a;
    const has = (v) => flows.some((q) => q.flow === p.flow && (horizontal ? q.x / T === v && q.y / T === ty : q.y / T === v && q.x / T === tx));
    while (has(a - 1)) a--;
    while (has(b + 1)) b++;
    for (let v = a; v <= b; v++) seen.add(horizontal ? `${v},${ty}` : `${tx},${v}`);
    lanes.push({ horizontal, dir: p.flow, line: horizontal ? ty : tx, from: a, to: b, props: flows.filter((q) => q.flow === p.flow && (horizontal ? q.y / T === ty : q.x / T === tx)) });
  }
  return lanes;
}

// A thing on the current, drawn small. `k` picks which.
function drawFloat(ctx, x, y, k, t, rot) {
  const bob = Math.round(Math.sin(t * 2.2 + k) * 0.7);
  y += bob;
  switch (k % 6) {
    case 0: // a cork
      rect(ctx, '#a8784a', x - 1, y - 1, 3, 2); rect(ctx, '#c8946a', x - 1, y - 1, 3, 1); break;
    case 1: // a scrap of paper
      rect(ctx, '#d8d0b8', x - 2, y - 1, 4, 2); rect(ctx, '#a8a088', x - 2 + rot, y, 3, 1); rect(ctx, '#6a6252', x - 1, y - 1, 2, 1); break;
    case 2: // a tin boat, with a candle-end for a mast
      rect(ctx, '#7a8088', x - 3, y, 6, 2); rect(ctx, '#a0a8b0', x - 3, y, 6, 1); rect(ctx, '#d8d0b0', x, y - 3, 1, 3); rect(ctx, '#e8e4c8', x + 1, y - 3, 2, 2); break;
    case 3: // a boot
      rect(ctx, '#4a3626', x - 3, y - 1, 5, 3); rect(ctx, '#6a5038', x - 3, y - 2, 2, 2); rect(ctx, '#2e2016', x - 3, y + 1, 6, 1); break;
    case 4: // a bottle cap and a button
      rect(ctx, '#b8b8b0', x - 1, y, 3, 1); rect(ctx, '#c8a838', x + 3, y - 1, 2, 2); break;
    default: // a twist of rag
      rect(ctx, '#6e4468', x - 2, y - 1, 4, 2); rect(ctx, '#946890', x - 1, y - 1, 2, 1); rect(ctx, '#6e4468', x + 2 + rot, y, 2, 1);
  }
  rect(ctx, 'rgba(190,225,235,0.35)', x - 4, y + 2, 8, 1);
}

// ---- The marsh ----

function heronBody(ctx, x, y, f, pose, fade) {
  // pose: 0 stand, 1 head turned, 2 neck low (stabbing), 3 hunched (slipping away)
  ctx.globalAlpha = fade;
  const at = (lx, ly, color, w = 1, h = 1) => rect(ctx, color, f > 0 ? x + lx : x - lx - w + 1, y + ly, w, h);
  const low = pose === 3 ? 4 : 0;
  // Thin legs in the shallows, and a ripple's worth of foot.
  at(-1, -11 + low, '#4a4a3a', 1, 11 - low);
  at(2, -11 + low, '#5a5a46', 1, 11 - low);
  at(-2, 0, '#2c3a36', 3, 1);
  at(1, 0, '#2c3a36', 3, 1);
  // Body: slate back, pale belly, a long wing and a trailing tail.
  at(-5, -17 + low, '#7c8a96', 10, 4);
  at(-4, -18 + low, '#6a7884', 8, 1);
  at(-4, -14 + low, '#9aa8b2', 8, 2);
  at(-3, -12 + low, '#c4ced4', 6, 1);
  at(-5, -16 + low, '#566470', 6, 2);
  at(-7, -15 + low, '#566470', 3, 1);
  at(2, -17 + low, '#e4eaec', 3, 3);
  if (pose === 3) {
    // Hunched, neck folded back, head low and turned away.
    at(2, -20 + low, '#b4bec4', 2, 3);
    at(3, -21 + low, '#d8e0e4', 3, 2);
    at(6, -21 + low, '#d8b848', 3, 1);
    at(3, -22 + low, '#1a2026', 1, 1);
  } else if (pose === 2) {
    // Neck shot out and down to the water.
    for (let k = 0; k < 9; k++) at(3 + k, -18 + k * 1.5, '#c4ced4', 2, 1);
    at(12, -5, '#d8e0e4', 2, 2);
    at(12, -3, '#d8b848', 1, 4);
  } else {
    const kink = pose === 1 ? 2 : 0;
    const pts = [[3, -18], [4, -19], [4, -20], [3, -21], [3, -22], [4, -23], [4, -24], [3 + kink, -25]];
    for (const [nx, ny] of pts) at(nx, ny, '#c4ced4', 1, 2);
    at(3 + kink, -27, '#d8e0e4', 3, 3);
    at(3 + kink, -28, '#1a2026', 2, 2);
    at(6 + kink, -26, '#d8b848', pose === 1 ? 3 : 5, 1);
    at(5 + kink, -26, '#1a2026');
  }
  ctx.globalAlpha = 1;
}

export const MARSH_KINDS = {
  // A rat on a line of floor (x0 to x1 at row y; n of them).
  drainrat: (s) => {
    const rats = Array.from({ length: s.n ?? 1 }, (_, i) => makeRat(s, i, s.scene));
    let last = 0;
    return {
      thing: {
        sortY: s.y * T + 12,
        draw(ctx, cam, t) {
          const dt = Math.min(0.1, Math.max(0, t - last));
          last = t;
          for (const r of rats) {
            const px = r.x;
            const py = s.y * T + 12;
            const d = nearest(s.scene, px, py);
            if (r.mode !== 'gone' && d < 34) {
              r.mode = 'flee';
              r.goal = feetOf(s.scene).x > px ? s.x0 * T : s.x1 * T;
              r.face = r.goal > px ? 1 : -1;
            }
            if (r.mode === 'idle') {
              r.until -= dt;
              if (r.until < 0) { r.mode = 'trot'; r.goal = (s.x0 + hash(t * 3 + r.i) * (s.x1 - s.x0)) * T; r.face = r.goal > r.x ? 1 : -1; }
            } else if (r.mode === 'trot' || r.mode === 'flee') {
              const v = r.mode === 'flee' ? 90 : 28;
              r.step += dt * (r.mode === 'flee' ? 14 : 7);
              r.x += Math.sign(r.goal - r.x) * v * dt;
              if (Math.abs(r.goal - r.x) < 2) {
                if (r.mode === 'flee') { r.mode = 'gone'; r.until = 9 + hash(r.i + t) * 8; } else { r.mode = 'idle'; r.until = 1.5 + hash(t + r.i * 5) * 4; }
              }
            } else if (r.mode === 'gone') {
              r.until -= dt;
              if (r.until < 0 && d > 70) { r.mode = 'idle'; r.until = 1; }
            }
            if (r.mode === 'gone') continue;
            const x = Math.round(r.x - cam.x);
            const y = Math.round(py - cam.y);
            if (!onScreen(x, y)) continue;
            drawRat(ctx, x, y, r.face, Math.floor(r.step), r.mode === 'idle' && Math.floor(t * 3 + r.i) % 3 === 0);
          }
        },
      },
    };
  },

  // Things riding the currents: an item every few tiles along every running lane.
  drainflotsam: (s) => {
    let lanes = null;
    return {
      // Above the current's own water (which sorts far below everything), under anyone standing on it.
      thing: {
        sortY: 1,
        draw(ctx, cam, t) {
        if (!lanes) lanes = findLanes(s.scene);
        let li = 0;
        for (const lane of lanes) {
          li++;
          if (lane.props.every((p) => p.hidden)) continue;
          const len = lane.to - lane.from + 1;
          const dirSign = lane.dir === 'right' || lane.dir === 'down' ? 1 : -1;
          const count = Math.max(1, Math.round(len / (s.gap ?? 6)));
          for (let k = 0; k < count; k++) {
            const u = fract((t * (s.speed ?? 0.11) * dirSign + k / count + hash(li * 5 + k) * 0.2));
            const along = (lane.from + u * len) * T;
            const px = lane.horizontal ? along : lane.line * T + 5 + hash(k + li) * 6;
            const py = lane.horizontal ? lane.line * T + 5 + hash(k * 3 + li) * 6 : along;
            const x = px - cam.x;
            const y = py - cam.y;
            if (!onScreen(x, y)) continue;
            // The tile it's over must still be a running current.
            const tx = Math.floor(px / T);
            const ty = Math.floor(py / T);
            if (!lane.props.some((p) => !p.hidden && p.x === tx * T && p.y === ty * T)) continue;
            drawFloat(ctx, x, y, k + li * 2 + (s.kind0 ?? 0), t, Math.round(Math.sin(t + k)));
          }
        }
        },
      },
    };
  },

  // Damp running down a wall face in a thin thread now and then.
  drainseep: (s) => ({
    over(ctx, cam, t) {
      const x = s.x * T + 8 - cam.x;
      const y0 = s.y * T - cam.y;
      if (!onScreen(x, y0, 30)) return;
      const len = (s.len ?? 1) * T;
      const period = s.every ?? 9;
      const clock = (t + hash(s.x * 3 + s.y) * period) % period;
      // A dark streak that stays, and a bright bead that runs down it.
      rect(ctx, 'rgba(10,22,26,0.45)', x, y0 + 2, 1, len - 2);
      rect(ctx, 'rgba(10,22,26,0.25)', x + 1, y0 + 4, 1, len - 8);
      if (clock < 3) {
        const u = clock / 3;
        rect(ctx, 'rgba(150,200,210,0.75)', x, y0 + 2 + u * (len - 4), 1, 2);
        rect(ctx, 'rgba(150,200,210,0.35)', x, y0 + 2 + Math.max(0, u * (len - 4) - 3), 1, 3);
      }
      if (clock > 2.8 && clock < 3.8) ring(ctx, x, y0 + len, (clock - 2.8), '150,200,210', 4);
    },
  }),

  // Will-o-wisps, far off: faint pale lights drifting slowly in a box over the fen, brightening and
  // fading, never coming near. (Not the Wisp monsters: these are only the look of the place.)
  fenwisp: (s) => ({
    over(ctx, cam, t) {
      const n = s.n ?? 3;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < n; i++) {
        const seed = i * 7 + s.x * 1.3 + s.y;
        const cx = (s.x + s.w * (0.5 + 0.5 * Math.sin(t * 0.05 * (1 + hash(seed)) + hash(seed + 1) * 6.28))) * T - cam.x;
        const cy = (s.y + s.h * (0.5 + 0.5 * Math.sin(t * 0.07 * (1 + hash(seed + 2)) + hash(seed + 3) * 6.28))) * T - cam.y;
        if (!onScreen(cx, cy, 30)) continue;
        const live = 0.5 + 0.5 * Math.sin(t * 0.35 + hash(seed + 4) * 9);
        const a = Math.max(0, live - 0.25) * 1.3;
        if (a < 0.03) continue;
        // Never near: they go dim as you come close.
        const d = nearest(s.scene, cx + cam.x, cy + cam.y);
        const shy = Math.min(1, Math.max(0, (d - 40) / 60));
        const col = s.color ?? '170, 255, 205';
        glow(ctx, col, cx, cy, 9, 0.28 * a * shy);
        rect(ctx, `rgba(${col},${(0.75 * a * shy).toFixed(2)})`, cx, cy, 1, 1);
        rect(ctx, `rgba(${col},${(0.35 * a * shy).toFixed(2)})`, cx - 1, cy, 3, 1);
      }
      ctx.restore();
    },
  }),

  // A heron in the shallows. Quiet: it stands, turns its head, stabs at the water now and then, and if
  // you come close it lowers its head and slips off into the reeds (it comes back once you've gone).
  fenheron: (s) => {
    const st = { fade: 1, away: 0, strike: -99, turn: -99 };
    return {
      thing: {
        sortY: s.y * T + 6,
        draw(ctx, cam, t) {
          const px = s.x * T + 8;
          const py = s.y * T + 12;
          const d = nearest(s.scene, px, py);
          if (d < 58) st.away = t + 22;
          const gone = t < st.away;
          st.fade += ((gone ? 0 : 1) - st.fade) * (gone ? 0.02 : 0.006);
          if (st.fade < 0.04) return;
          const x = px - cam.x + (gone ? (1 - st.fade) * 5 * (s.face ?? 1) * -1 : 0);
          const y = py - cam.y;
          if (!onScreen(x, y, 30)) return;
          let pose = 0;
          if (gone) pose = 3;
          else {
            const clock = (t + hash(s.x * 5 + s.y) * 31) % 17;
            if (clock > 6 && clock < 7.4) pose = 1;
            if (clock > 12 && clock < 12.7) pose = 2;
            if (clock > 12.7 && clock < 14.5) pose = 0;
          }
          heronBody(ctx, Math.round(x), Math.round(y), s.face ?? 1, pose, st.fade);
          // The ripples round its feet, and the ring a stab leaves.
          const clock2 = (t + hash(s.x * 5 + s.y) * 31) % 17;
          ring(ctx, x + 1, y, (t * 0.25) % 1, '170,190,190', 7);
          if (!gone && clock2 > 12.6 && clock2 < 14) ring(ctx, x + (s.face ?? 1) * 11, y - 3, (clock2 - 12.6) / 1.4, '190,210,210', 9);
        },
      },
    };
  },

  // Reeds in front of the ground: each clump sways with a slow breeze and leans off you as you pass.
  fenreeds: (s) => {
    const points = s.points ?? [[s.x, s.y]];
    const clumps = points.map(([px, py], i) => ({ x: (px + 0.5) * T, y: (py + 1) * T - 1, h: (s.h ?? 22) + Math.floor(hash(i * 3 + px) * 8), n: s.n ?? 9, i }));
    const cols = s.colors ?? ['#2e3a2a', '#44563a', '#566a48', '#6c8058'];
    return {
      thing: {
        // In front of whoever stands above the clump's foot, behind whoever stands below it.
        sortY: Math.max(...clumps.map((c) => c.y)) + 2,
        draw(ctx, cam, t) {
          for (const c of clumps) {
            const x = c.x - cam.x;
            const y = c.y - cam.y;
            if (!onScreen(x, y, 24)) continue;
            const d = nearest(s.scene, c.x, c.y - 4);
            const push = d < 26 ? (1 - d / 26) * 3 * Math.sign(c.x - feetOf(s.scene).x || 1) : 0;
            for (let b = 0; b < c.n; b++) {
              const bx = x - c.n + b * 2 + (b % 2);
              const hh = c.h - Math.abs(b - c.n / 2) * 1.6 - (b % 3) * 2;
              const lean = Math.sin(t * 0.9 + c.i + b * 0.5) * 1.4 + push;
              for (let k = 0; k < hh; k += 1) {
                const u = k / hh;
                rect(ctx, cols[(b + (k > hh * 0.6 ? 1 : 0)) % 4], bx + Math.round(lean * u * u * 2), y - k, 1, 1);
              }
              if (b % 3 === 1) rect(ctx, '#5a3a24', bx + Math.round(lean * 2) - 1, y - hh - 2, 2, 4);
            }
            rect(ctx, 'rgba(8,12,8,0.4)', x - c.n - 1, y - 1, c.n * 2 + 3, 2);
          }
        },
      },
    };
  },

  // Low banks of mist drifting through, over everything.
  fenmist: (s) => ({
    over(ctx, cam, t) {
      const n = s.n ?? 4;
      const worldW = (s.w ?? 30) * T;
      for (let i = 0; i < n; i++) {
        const sp = (s.speed ?? 5) * (0.6 + hash(i + 2));
        const x = ((hash(i * 3 + 1) * worldW + t * sp) % (worldW + 160)) - 80 - cam.x;
        const y = (s.y ?? 6) * T + hash(i * 5 + 3) * (s.h ?? 6) * T + Math.sin(t * 0.2 + i) * 4 - cam.y;
        if (x < -90 || x > W + 90 || y < -30 || y > H + 30) continue;
        const a = (s.alpha ?? 0.07) * (0.6 + 0.4 * Math.sin(t * 0.15 + i * 2));
        for (let k = 0; k < 4; k++) {
          ctx.fillStyle = `rgba(200,215,205,${(a * (1 - k * 0.18)).toFixed(3)})`;
          ctx.beginPath();
          ctx.ellipse(x + k * 6, y + k * 1.5, 62 - k * 10, 9 - k * 1.5, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
  }),

  // Something rising under the fen water: a ring that spreads, now and then, at some water tile in a
  // box (x, y, w, h in tiles). Quiet, and never the same place twice running.
  fenrise: (s) => ({
    floor(ctx, cam, t) {
      const period = s.every ?? 5;
      for (let slot = 0; slot < (s.n ?? 2); slot++) {
        const clock = t + slot * period * 0.5 + hash(s.x + slot) * period;
        const cycle = Math.floor(clock / period);
        const u = (clock % period) / 2.2;
        if (u > 1) continue;
        const tx = s.x + Math.floor(hash(cycle * 3 + slot + s.x) * s.w);
        const ty = s.y + Math.floor(hash(cycle * 5 + slot + s.y) * s.h);
        if (!isWaterTile(s.scene, tx, ty)) continue;
        const x = tx * T + 3 + hash(cycle + slot) * 10 - cam.x;
        const y = ty * T + 6 + hash(cycle * 2 + slot) * 6 - cam.y;
        if (!onScreen(x, y)) continue;
        ring(ctx, x, y, u, '180,205,205', 7);
        if (u > 0.2) ring(ctx, x, y, u - 0.2, '150,180,180', 4);
      }
    },
  }),

  // Pond-skaters dimpling the still water in a box.
  fenstriders: (s) => ({
    floor(ctx, cam, t) {
      for (let i = 0; i < (s.n ?? 3); i++) {
        const a = t * 0.12 * (0.6 + hash(i + s.x)) + hash(i * 3 + s.y) * 6.28;
        const tx = s.x + s.w * (0.5 + 0.5 * Math.sin(a));
        const ty = s.y + s.h * (0.5 + 0.5 * Math.cos(a * 1.3 + i));
        if (!isWaterTile(s.scene, Math.floor(tx), Math.floor(ty))) continue;
        const x = tx * T - cam.x;
        const y = ty * T - cam.y;
        if (!onScreen(x, y)) continue;
        const tick = Math.floor(t * 4 + i) % 3;
        rect(ctx, 'rgba(20,28,28,0.7)', x, y, 1, 1);
        rect(ctx, 'rgba(20,28,28,0.5)', x - 1, y + (tick ? 1 : 0), 3, 1);
        rect(ctx, 'rgba(180,205,205,0.25)', x - 2, y + 2, 5, 1);
        if (tick === 0) ring(ctx, x, y + 1, (t * 2 + i) % 1, '180,205,205', 3);
      }
    },
  }),

  // A blister rising on the bog and popping with a ring, here and there.
  fenplop: (s) => ({
    floor(ctx, cam, t) {
      (s.points ?? []).forEach(([px, py], i) => {
        const period = 6 + hash(i * 3 + px) * 6;
        const clock = (t + hash(i + px * py) * period) % period;
        const x = px * T + 8 - cam.x;
        const y = py * T + 9 - cam.y;
        if (!onScreen(x, y)) return;
        if (clock < 2) {
          const u = clock / 2;
          const r = 1 + u * 3;
          ctx.fillStyle = 'rgba(54,64,48,0.9)';
          ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.6, 0, 0, Math.PI * 2); ctx.fill();
          rect(ctx, 'rgba(150,170,140,0.7)', x - r * 0.4, y - r * 0.4, 1, 1);
        } else if (clock < 3) {
          const u = clock - 2;
          ring(ctx, x, y, u, '150,170,140', 6);
          rect(ctx, `rgba(120,140,110,${(0.7 * (1 - u)).toFixed(2)})`, x, y - 3 * u, 1, 1);
        }
      });
    },
  }),

  // A warm square of lamplight on a floor (x, y, w, h in tiles), breathing a little.
  hutglow: (s) => ({
    over(ctx, cam, t) {
      const x = s.x * T - cam.x;
      const y = s.y * T - cam.y;
      if (!onScreen(x, y, 60)) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const a = (s.alpha ?? 0.1) * (0.85 + 0.15 * Math.sin(t * 2.3) + 0.05 * Math.sin(t * 5.1));
      ctx.fillStyle = `rgba(255,190,100,${a.toFixed(3)})`;
      ctx.fillRect(x, y, s.w * T, s.h * T);
      glow(ctx, '255, 200, 120', x + (s.w * T) / 2, y + (s.h * T) / 2, Math.max(s.w, s.h) * T * 0.9, 0.18);
      ctx.restore();
    },
  }),
};
