import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, TILE_SIZE as T } from '../config.js';
import { fract, hash } from '../engine/noise.js';
import { glowSprite } from './lamplight.js';

// RUINS LIFE: the small living things of the Ruins and Mother Taper's house (chapter 1), as more
// kinds for touches.js. Same rules as the rest: drawn only, no bodies, nothing can bump into them,
// everything worked out from the clock and where you stand.
//
//   beetles    little things crawling the floor (beetles, ladybirds): they pause, set off, freeze
//              when you come near, then bolt (a beetle goes to ground; a ladybird flies) and are back
//              a while later. `points: [[x, y]...]` (tiles), `look: 'beetle' | 'ladybird'`
//   spiders    a spider on a silk thread from a beam or a wall: it hangs and sways, and runs up
//              out of sight when you come near. `x, y` (where the thread is fixed), `drop` (px)
//   webs       cobwebs in a corner, stirring in the draught. `x, y` (the corner tile), `side: 'l' | 'r'`
//   gecko      a gecko on the wall face: sits, flicks its head, scampers off along the wall when
//              you come near and is back much later. `x, y, toX` (tiles)
//   dustfall   mortar dust trickling out of a crack in the roof now and then, a little more when
//              you walk under it. `x, y, w`
//   moonbells  pulsing blue glows with a few motes rising, brighter when you come near.
//              `points: [[x, y]...]`
//
// Positions are in tiles.

const rect = (ctx, color, x, y, w = 1, h = 1) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};
const onScreen = (x, y, pad = 24) => x > -pad && x < W + pad && y > -pad && y < H + pad;
const feetOf = (scene) => ({ x: scene.player.x + 6, y: scene.player.y + 12 });
const glow = (ctx, color, x, y, r, alpha) => {
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.drawImage(glowSprite(color), x - r, y - r, r * 2, r * 2);
  ctx.globalAlpha = 1;
};

// ---- Beetles and ladybirds ----

function beetles(s) {
  const ladybird = s.look === 'ladybird';
  const pts = s.points ?? [[s.x, s.y]];
  const reach = (s.reach ?? 1.2) * T;
  const bugs = pts.map(([x, y], i) => ({
    hx: x * T + 8, hy: y * T + 11, x: x * T + 8, y: y * T + 11, tx: x * T + 8, ty: y * T + 11,
    state: 'rest', until: hash(i + x) * 3, last: 0, dir: 1, hide: 0, air: 0, i,
  }));
  return {
    thing: {
      sortY: Math.max(...pts.map((p) => p[1]), 0) * T + 13,
      draw(ctx, cam, t) {
        const f = feetOf(s.scene);
        for (const b of bugs) {
          const dt = Math.min(0.1, Math.max(0, t - b.last));
          b.last = t;
          const d = Math.hypot(f.x - b.x, f.y - b.y);
          if (b.state === 'gone') {
            if (t > b.until && Math.hypot(f.x - b.hx, f.y - b.hy) > 40) { b.state = 'rest'; b.until = t + 1; b.x = b.hx; b.y = b.hy; }
            continue;
          }
          if (b.state !== 'flee' && b.state !== 'fly' && d < 24) {
            // Frozen a moment, then off: away from you.
            if (b.state !== 'freeze') { b.state = 'freeze'; b.until = t + 0.35; }
          }
          if (b.state === 'freeze' && t > b.until) {
            const ang = Math.atan2(b.y - f.y, b.x - f.x);
            b.tx = b.x + Math.cos(ang) * 26;
            b.ty = b.y + Math.sin(ang) * 14;
            b.state = ladybird ? 'fly' : 'flee';
            b.until = t + (ladybird ? 0.9 : 0.7);
            b.air = t;
          }
          if (b.state === 'rest' && t > b.until) {
            const a = hash(b.i * 7 + Math.floor(t)) * 6.28;
            b.tx = b.hx + Math.cos(a) * reach;
            b.ty = b.hy + Math.sin(a) * reach * 0.4;
            b.state = 'walk';
            b.until = t + 1.5 + hash(b.i + Math.floor(t * 2)) * 1.5;
          }
          let moving = false;
          if (b.state === 'walk' || b.state === 'flee' || b.state === 'fly') {
            const speed = b.state === 'walk' ? 8 : b.state === 'flee' ? 46 : 34;
            const dx = b.tx - b.x;
            const dy = b.ty - b.y;
            const len = Math.hypot(dx, dy);
            if (len > 1) {
              moving = true;
              b.x += (dx / len) * speed * dt;
              b.y += (dy / len) * speed * dt;
              if (Math.abs(dx) > 0.5) b.dir = dx > 0 ? 1 : -1;
            }
            if (t > b.until || len <= 1) {
              if (b.state === 'flee') { b.state = 'gone'; b.until = t + 5 + hash(b.i) * 4; continue; }
              b.state = 'rest';
              b.until = t + 1 + hash(b.i + Math.floor(t)) * 3;
              if (b.state === 'rest' && ladybird) { b.hx = b.x; b.hy = b.y; }
            }
          }
          const x = Math.round(b.x - cam.x);
          let y = Math.round(b.y - cam.y);
          if (!onScreen(x, y)) continue;
          const lift = b.state === 'fly' ? Math.round(Math.sin(Math.min(1, (t - b.air) / 0.9) * Math.PI) * 9) : 0;
          y -= lift;
          if (lift > 0) rect(ctx, 'rgba(0,0,0,0.25)', x - 1, y + lift, 3, 1);
          const leg = moving && Math.floor(t * 18 + b.i) % 2;
          if (ladybird) {
            rect(ctx, '#d83a2a', x - 1, y - 2, 3, 2);
            rect(ctx, '#f06a52', x - 1, y - 2, 1, 1);
            rect(ctx, '#1a1014', x, y - 2, 1, 2);
            rect(ctx, '#1a1014', x + b.dir, y - 3, 1, 1);
            if (lift > 0) {
              const flap = Math.floor(t * 30) % 2;
              rect(ctx, 'rgba(235,240,250,0.85)', x - 3, y - 3 - flap, 2, 1);
              rect(ctx, 'rgba(235,240,250,0.85)', x + 2, y - 3 - flap, 2, 1);
            }
          } else {
            rect(ctx, '#1a1226', x - 1, y - 2, 3, 2);
            rect(ctx, '#4a3e6a', x - 1, y - 2, 1, 1);
            rect(ctx, '#0c0814', x + b.dir * 2, y - 1, 1, 1);
            if (moving) {
              rect(ctx, '#0c0814', x - 2 + leg, y, 1, 1);
              rect(ctx, '#0c0814', x + 1 - leg, y, 1, 1);
            }
            if (b.state === 'freeze') rect(ctx, '#0c0814', x + b.dir * 2, y - 3, 1, 1);
          }
        }
      },
    },
  };
}

// ---- A spider on its thread ----

function spiders(s) {
  const drop = s.drop ?? 22;
  let len = drop;
  let away = 0;
  let last = 0;
  return {
    thing: {
      sortY: s.y * T + drop + 14 + (s.sort ?? 0),
      draw(ctx, cam, t) {
        const dt = Math.min(0.1, Math.max(0, t - last));
        last = t;
        const ax = s.x * T + 8;
        const ay = s.y * T;
        const f = feetOf(s.scene);
        const d = Math.hypot(f.x - ax, f.y - (ay + len));
        if (d < 30) away = t + 4;
        const goal = t < away ? 1 : drop + Math.sin(t * 0.4 + s.x) * 3;
        len += (goal - len) * Math.min(1, dt * (t < away ? 4 : 0.7));
        const x = Math.round(ax + Math.sin(t * 0.9 + s.x) * (len / drop) * 1.2 - cam.x);
        const y0 = Math.round(ay - cam.y);
        const y = Math.round(y0 + len);
        if (!onScreen(x, y)) return;
        rect(ctx, 'rgba(225,225,245,0.5)', x, y0, 1, len);
        if (len < 4) return;
        const kick = Math.floor(t * 3 + s.x) % 2;
        rect(ctx, '#1a1226', x - 1, y, 3, 2);
        rect(ctx, '#3a2e52', x, y, 1, 1);
        rect(ctx, '#1a1226', x - 2, y + kick, 1, 1);
        rect(ctx, '#1a1226', x + 2, y + kick, 1, 1);
        rect(ctx, '#1a1226', x - 2, y + 2 - kick, 1, 1);
        rect(ctx, '#1a1226', x + 2, y + 2 - kick, 1, 1);
      },
    },
  };
}

// ---- Cobwebs in a corner ----

function webs(s) {
  const size = s.size ?? 14;
  const left = s.side !== 'r';
  const dots = (ctx, x0, y0, x1, y1, sag) => {
    const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0)));
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      ctx.fillRect(Math.round(x0 + (x1 - x0) * u), Math.round(y0 + (y1 - y0) * u + Math.sin(u * Math.PI) * sag), 1, 1);
    }
  };
  return {
    floor(ctx, cam, t) {
      const cx = (left ? s.x : s.x + 1) * T - cam.x;
      const cy = s.y * T - cam.y;
      if (!onScreen(cx, cy, 30)) return;
      const dir = left ? 1 : -1;
      const sway = Math.sin(t * 0.6 + s.x * 2 + s.y) * 0.9;
      ctx.fillStyle = 'rgba(225,225,245,0.42)';
      // Four spokes out of the corner, and two sagging threads strung between them.
      const tips = [0, 1, 2, 3].map((k) => {
        const a = (k / 3) * (Math.PI / 2);
        return [Math.cos(a), Math.sin(a)];
      });
      for (const [fx, fy] of tips) dots(ctx, cx, cy, cx + dir * (fx * size + sway), cy + fy * size, 0);
      for (const r of [0.5, 0.85]) {
        for (let k = 0; k < 3; k++) {
          const [ax, ay] = tips[k];
          const [bx, by] = tips[k + 1];
          dots(ctx, cx + dir * (ax * size * r + sway * r), cy + ay * size * r, cx + dir * (bx * size * r + sway * r), cy + by * size * r, 1.5);
        }
      }
      // A bead of dew, shining now and then.
      if (Math.sin(t * 1.3 + s.x) > 0.8) rect(ctx, 'rgba(255,255,255,0.9)', cx + dir * size * 0.45, cy + size * 0.5, 1, 1);
    },
  };
}

// ---- A gecko on the wall ----

function gecko(s) {
  const homeX = s.x * T + 4;
  const toX = (s.toX ?? s.x + 6) * T + 4;
  let x = homeX;
  let state = 'sit';
  let until = 3 + hash(s.x) * 4;
  let last = 0;
  return {
    thing: {
      sortY: s.y * T + 14,
      draw(ctx, cam, t) {
        const dt = Math.min(0.1, Math.max(0, t - last));
        last = t;
        const f = feetOf(s.scene);
        const d = Math.hypot(f.x - x, f.y - s.y * T);
        if (state === 'sit' && d < 34) { state = 'run'; }
        if (state === 'run') {
          x += (toX - homeX >= 0 ? 1 : -1) * 70 * dt;
          if ((toX - homeX >= 0 && x >= toX) || (toX - homeX < 0 && x <= toX)) { state = 'gone'; until = t + 14 + hash(s.y) * 8; }
        } else if (state === 'gone' && t > until && Math.hypot(f.x - homeX, f.y - s.y * T) > 70) {
          state = 'sit'; x = homeX;
        }
        if (state === 'gone') return;
        const px = Math.round(x - cam.x);
        const py = Math.round(s.y * T + 8 - cam.y);
        if (!onScreen(px, py)) return;
        const dir = toX - homeX >= 0 ? 1 : -1;
        const sx = (lx, ly, w = 1, h = 1, c = '#5a7a5a') => rect(ctx, c, dir > 0 ? px + lx : px - lx - w + 1, py + ly, w, h);
        const move = state === 'run' ? Math.floor(t * 20) % 2 : 0;
        sx(0, 0, 6, 2); sx(-3, 0, 3, 1, '#4a6a4a'); sx(-5, 1, 2, 1, '#4a6a4a');
        sx(6, -1, 3, 3, '#6a8a6a');
        sx(8, 0, 1, 1, '#f0e8a0');
        sx(1, 2 + move, 1, 1, '#4a6a4a'); sx(4, 2 - move + 1, 1, 1, '#4a6a4a');
        sx(1, -1 - move, 1, 1, '#4a6a4a'); sx(4, -1 + move, 1, 1, '#4a6a4a');
        if (state === 'sit' && fract(t * 0.23 + s.x) < 0.05) sx(9, 1, 2, 1, '#d84a6a');
      },
    },
  };
}

// ---- Dust trickling from the roof ----

function dustfall(s) {
  const period = s.every ?? 11;
  return {
    over(ctx, cam, t) {
      const w = (s.w ?? 1) * T;
      const x0 = s.x * T - cam.x;
      const y0 = s.y * T - cam.y;
      if (!onScreen(x0, y0, 60)) return;
      const f = feetOf(s.scene);
      const under = Math.abs(f.x - (s.x * T + w / 2)) < w / 2 + 14 && f.y > s.y * T && f.y < s.y * T + 70;
      const clock = (t + s.x * 3.1) % period;
      const active = under ? fract(t * 0.5) < 0.6 : clock < 1.6;
      if (!active) return;
      const fall = (s.fall ?? 2) * T;
      for (let i = 0; i < 5; i++) {
        const life = fract(t * (0.8 + hash(i + s.x) * 0.5) + hash(i + 4));
        const px = x0 + hash(i * 3 + s.x) * w;
        const py = y0 + life * fall;
        rect(ctx, `rgba(176,160,200,${(0.7 * (1 - life)).toFixed(2)})`, px + Math.sin(life * 6 + i) * 1.2, py, 1, 1 + (i % 2));
      }
      // A thin haze where it lands.
      ctx.fillStyle = 'rgba(176,160,200,0.12)';
      ctx.fillRect(Math.round(x0 - 2), Math.round(y0 + fall - 2), Math.round(w + 4), 2);
    },
  };
}

// ---- Moonbells ----

function moonbells(s) {
  const pts = s.points ?? [];
  return {
    over(ctx, cam, t) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const f = feetOf(s.scene);
      pts.forEach(([px, py], i) => {
        const x = px * T + 8 - cam.x;
        const y = py * T + 6 - cam.y;
        if (!onScreen(x, y, 30)) return;
        const near = Math.max(0, 1 - Math.hypot(f.x - (px * T + 8), f.y - (py * T + 8)) / 56);
        const pulse = 0.55 + Math.sin(t * 1.3 + i * 1.7) * 0.25 + near * 0.5;
        glow(ctx, '150, 190, 255', x, y, 11 + near * 5, 0.22 * pulse);
        for (let k = 0; k < 2; k++) {
          const life = fract(t * 0.16 + hash(i * 5 + k) + k * 0.5);
          rect(ctx, `rgba(200,225,255,${(0.8 * Math.sin(life * Math.PI) * pulse).toFixed(2)})`, x + Math.sin(life * 7 + i + k) * 3, y - life * 14, 1, 1);
        }
      });
      ctx.restore();
    },
  };
}

export const RUINS_KINDS = { beetles, spiders, webs, gecko, dustfall, moonbells };
