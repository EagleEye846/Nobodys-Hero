import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, TILE_SIZE as T } from '../config.js';
import { glowSprite } from './lamplight.js';
import { hash } from '../engine/noise.js';
import { COAST_KINDS } from './coastTouches.js';
import { ROOM_TOUCHES } from '../data/touches.js';

// THE DIGGINGS' SMALL LIFE (the life pass, 14 November 2026): more touches for
// chapter 4's mines, as kinds for touches.js (the same rules: drawn only, no
// bodies, so nothing can bump into them: a cart, a push, a climb or a cutscene
// walk never notices them). They hook in by adding themselves to the coast's
// kind table, so touches.js only has to import this file.
//
//   cricket    a cave cricket on the floor; hops away from your boots, waits,
//              and hops back
//   glowworms  threads of glow-worms hung from the roof, pulsing; they dim
//              when you come near
//   grit       grit and a little dust shaken off the roof now and then (more
//              when you run past under it)
//   sleepbat   a bat asleep upside down in the roof; it wakes if you come near,
//              flits round the room, and settles again
//   beetle     a rock beetle plodding along a seam of the floor; it tucks
//              itself in when you come near
//   motes      dust motes drifting in lamplight
//   wetwall    a wet streak on a rock face, with glints that run down it
//   cobweb     a web in a roof corner that stirs when you walk under it
//   teeth      small rock teeth hanging from the roof edge, with a wet tip
//   starmotes  slow pale sparks lifting off glassy rock (the star rooms)
//
// The room's own list is added to the table in src/data/touches.js at the end
// of this file (so the table there is left alone). Positions are in tiles.

const rect = (ctx, color, x, y, w = 1, h = 1) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};
const onScreen = (x, y, pad = 24) => x > -pad && x < W + pad && y > -pad && y < H + pad;
const fract = (x) => x - Math.floor(x);
const feetOf = (scene) => ({ x: scene.player.x + 6, y: scene.player.y + 12 });
const dist = (scene, px, py) => {
  const f = feetOf(scene);
  return Math.hypot(f.x - px, f.y - py);
};
const glow = (ctx, color, x, y, r, alpha) => {
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.drawImage(glowSprite(color), x - r, y - r, r * 2, r * 2);
  ctx.globalAlpha = 1;
};

// A cave cricket: long back legs, long feelers, a small round back.
const cricket = (s) => {
  const home = { x: s.x * T + 8, y: s.y * T + 12 };
  const side = s.away ?? (hash(s.x * 7 + s.y) > 0.5 ? 1 : -1);
  let at = 0; // 0 home .. 1 away
  let want = 0;
  let hop = 0;
  let wait = 0;
  let last = null;
  return {
    thing: {
      sortY: home.y,
      draw(ctx, cam, t) {
        const dt = last === null ? 0.016 : Math.max(0, Math.min(0.05, t - last));
        last = t;
        const d = dist(s.scene, home.x + at * side * 26, home.y);
        if (d < 30) { want = 1; wait = 3.5; } else if (wait > 0) wait -= dt; else want = 0;
        if (at !== want) {
          hop += dt * 5;
          at += Math.sign(want - at) * dt * 2.4;
          if (Math.abs(at - want) < 0.05) at = want;
        } else hop = 0;
        const x = home.x + at * side * 26 - cam.x;
        const jump = at !== want ? Math.abs(Math.sin(hop * 3)) * 5 : 0;
        const y = home.y - cam.y - jump;
        if (!onScreen(x, y)) return;
        const flip = side * (want ? 1 : -1);
        rect(ctx, '#1a1410', x - 2, y - 2, 4, 2);
        rect(ctx, '#5a4632', x - 1, y - 3, 3, 2);
        rect(ctx, '#7a6044', x, y - 3, 1, 1);
        rect(ctx, '#1a1410', x + flip * 2, y - 3, 1, 1);
        // The feelers, which wave.
        const wave = Math.sin(t * 6 + s.x) > 0 ? 1 : 0;
        rect(ctx, '#3a2c20', x + flip * 3, y - 4 - wave, 1, 1);
        rect(ctx, '#3a2c20', x + flip * 4, y - 5 - wave, 1, 1);
        // The back legs.
        rect(ctx, '#2a2018', x - flip * 3, y - 4 + (jump > 1 ? 1 : 0), 1, 3);
        rect(ctx, '#2a2018', x - flip * 2, y - 1, 1, 1);
      },
    },
  };
};

// Glow-worm threads: each a hair of silk hanging from the roof with a bead of
// blue-green light on the end. They dim when you come near.
const glowworms = (s) => ({
  over(ctx, cam, t) {
    const n = s.n ?? 8;
    const cx = (s.x + (s.w ?? 4) / 2) * T - cam.x;
    if (!onScreen(cx, s.y * T - cam.y, 80)) return;
    ctx.save();
    for (let i = 0; i < n; i++) {
      const wx = (s.x + hash(i * 3 + s.x) * (s.w ?? 4)) * T - cam.x;
      const len = 3 + Math.floor(hash(i * 5 + s.y) * 8);
      const wy = s.y * T - cam.y;
      const shy = Math.min(1, dist(s.scene, wx + cam.x, wy + cam.y + len) / 46);
      const pulse = 0.55 + 0.45 * Math.sin(t * (0.9 + hash(i) * 0.8) + i * 2.1);
      const a = pulse * (0.25 + 0.75 * shy);
      ctx.globalCompositeOperation = 'source-over';
      rect(ctx, `rgba(160,200,200,${(0.35 * a).toFixed(2)})`, wx, wy, 1, len);
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, '120, 255, 200', wx + 0.5, wy + len + 1, 7, 0.4 * a);
      rect(ctx, `rgba(190,255,230,${a.toFixed(2)})`, wx, wy + len, 1, 2);
    }
    ctx.restore();
  },
});

// Grit shaken down off the roof: a few specks in a thin line, and a puff.
const grit = (s) => {
  const wake = { until: 0 };
  return {
    over(ctx, cam, t) {
      const x = s.x * T + 8 - cam.x;
      const y0 = s.y * T - cam.y;
      const fall = (s.fall ?? 2) * T;
      if (!onScreen(x, y0 + fall, 40)) return;
      const p = s.scene.player;
      // Running past under it shakes more down.
      if (p.moving && dist(s.scene, x + cam.x, y0 + cam.y + fall) < (s.reach ?? 40) && t > wake.until + 1.5) wake.until = t + 1.2;
      const period = s.every ?? 7;
      const clock = (t + ((s.x * 11 + s.y * 5) % period)) % period;
      const live = clock < 1.4 ? clock : t < wake.until ? 1.4 - (wake.until - t) : -1;
      if (live < 0) return;
      const u = Math.min(1, live / 1.4);
      for (let i = 0; i < (s.n ?? 6); i++) {
        const k = fract(u * 1.2 + hash(i + s.x) * 0.6);
        const gx = x + (hash(i * 3 + 1) - 0.5) * 10 + Math.sin(k * 6 + i) * 1.5;
        const gy = y0 + k * k * fall;
        rect(ctx, `rgba(190,165,125,${(0.8 * (1 - u * 0.5)).toFixed(2)})`, gx, gy, 1, i % 3 ? 1 : 2);
      }
      if (u > 0.55) {
        const v = (u - 0.55) / 0.45;
        for (let i = 0; i < 5; i++) rect(ctx, `rgba(190,165,125,${(0.4 * (1 - v)).toFixed(2)})`, x - 5 + i * 2.4 + (i - 2) * v * 2, y0 + fall - v * 4, 2, 1);
      }
    },
  };
};

// A sleeping bat, hanging by its feet from the roof, wings folded round it.
// Come near and it unfolds, circles the room, and settles on its perch again.
const sleepbat = (s) => {
  let flying = -1;
  let since = 0;
  return {
    thing: {
      sortY: s.y * T + 40,
      draw(ctx, cam, t) {
        const hx = s.x * T + 8;
        const hy = s.y * T;
        if (flying < 0) {
          if (t > since && dist(s.scene, hx, hy + 8) < (s.shy ?? 38)) { flying = 0; }
        } else {
          flying += 0.016 * 1.1;
          if (flying > 1) { flying = -1; since = t + 6; }
        }
        let x = hx - cam.x;
        let y = hy - cam.y;
        if (!onScreen(x, y, 60)) return;
        if (flying < 0) {
          // Hanging: the feet on the rock, the body a small dark teardrop, ears up the other way.
          rect(ctx, '#2a2030', x, y, 1, 1);
          rect(ctx, '#1a1220', x - 1, y + 1, 3, 4);
          rect(ctx, '#2a2030', x, y + 2, 1, 2);
          rect(ctx, '#1a1220', x - 1, y + 5, 3, 1);
          rect(ctx, '#3a2c40', x - 1, y + 6, 1, 1);
          rect(ctx, '#3a2c40', x + 1, y + 6, 1, 1);
          // A faint breath.
          if (Math.sin(t * 1.3 + s.x) > 0.6) rect(ctx, '#1a1220', x, y + 1, 1, 4);
        } else {
          const u = flying;
          const dir = s.dir ?? 1;
          x += Math.sin(u * Math.PI * 2) * 34 * dir;
          y += 8 + Math.sin(u * Math.PI) * 16 + Math.sin(u * 20) * 2;
          const up = Math.floor(u * 40) % 2;
          rect(ctx, '#1a1020', x, y, 2, 1);
          rect(ctx, '#1a1020', x - 2, y - up, 2, 1);
          rect(ctx, '#1a1020', x + 2, y - up, 2, 1);
          rect(ctx, '#1a1020', x - 3, y + (up ? 0 : 1));
          rect(ctx, '#1a1020', x + 4, y + (up ? 0 : 1));
        }
      },
    },
  };
};

// A rock beetle, shell like a river stone, plodding along a seam in the floor.
const beetle = (s) => {
  let pos = hash(s.x * 3 + s.y) * (s.w ?? 4);
  let dir = 1;
  let hidden = 0;
  let last = null;
  return {
    thing: {
      sortY: s.y * T + 12,
      draw(ctx, cam, t) {
        const dt = last === null ? 0.016 : Math.max(0, Math.min(0.05, t - last));
        last = t;
        const wx = (s.x + pos) * T;
        const wy = s.y * T + 12;
        if (dist(s.scene, wx, wy) < 26) hidden = 4;
        if (hidden > 0) hidden -= dt;
        else {
          pos += dir * dt * 0.35;
          if (pos > (s.w ?? 4)) dir = -1;
          if (pos < 0) dir = 1;
        }
        const x = wx - cam.x;
        const y = wy - cam.y;
        if (!onScreen(x, y)) return;
        const shell = '#4a4a58';
        if (hidden > 0) {
          // Tucked in: a small round stone, and nothing else.
          rect(ctx, '#2a2a34', x - 2, y - 2, 5, 3);
          rect(ctx, shell, x - 1, y - 3, 3, 1);
          rect(ctx, '#7a7a8a', x - 1, y - 3, 1, 1);
        } else {
          rect(ctx, '#1a1a22', x - 3, y - 3, 7, 4);
          rect(ctx, shell, x - 2, y - 4, 5, 3);
          rect(ctx, '#7a7a8a', x - 1, y - 4, 2, 1);
          rect(ctx, '#1a1a22', x + dir * 3, y - 3, 2, 2);
          const leg = Math.floor(t * 8) % 2;
          rect(ctx, '#1a1a22', x - 2 + leg, y + 1, 1, 1);
          rect(ctx, '#1a1a22', x + leg, y + 1, 1, 1);
          rect(ctx, '#1a1a22', x + 2 - leg, y + 1, 1, 1);
        }
      },
    },
  };
};

// Dust motes drifting in a lamp's light, up and across, slow and lazy.
const motes = (s) => ({
  over(ctx, cam, t) {
    const cx = (s.x + (s.w ?? 3) / 2) * T - cam.x;
    const cy = (s.y + (s.h ?? 3) / 2) * T - cam.y;
    if (!onScreen(cx, cy, 80)) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < (s.n ?? 10); i++) {
      const k = fract(t * (0.025 + hash(i + 3) * 0.03) + hash(i + 9));
      const mx = (s.x + hash(i * 2 + s.x) * (s.w ?? 3)) * T - cam.x + Math.sin(t * 0.7 + i * 2) * 5;
      const my = (s.y + (s.h ?? 3) * (1 - k)) * T - cam.y;
      const a = Math.sin(k * Math.PI) * (0.35 + 0.35 * Math.sin(t * 2.2 + i));
      rect(ctx, `rgba(${s.color ?? '255,226,170'},${a.toFixed(2)})`, mx, my, 1, 1);
    }
    ctx.restore();
  },
});

// A wet streak down a rock face: a darker, glossy line with a glint running down.
const wetwall = (s) => ({
  over(ctx, cam, t) {
    const x = s.x * T - cam.x;
    const y = s.y * T - cam.y;
    const h = (s.h ?? 1) * T;
    if (!onScreen(x, y + h, 40)) return;
    for (let i = 0; i < (s.w ?? 1) * 3; i++) {
      const sx = x + 3 + i * 5 + hash(i + s.x) * 3;
      rect(ctx, 'rgba(10,20,30,0.28)', sx, y + 1, 1, h - 3);
      rect(ctx, 'rgba(150,200,220,0.14)', sx + 1, y + 1, 1, h - 3);
      const k = fract(t * (0.12 + hash(i + 2) * 0.1) + hash(i + 5));
      rect(ctx, `rgba(200,235,250,${(Math.sin(k * Math.PI) * 0.7).toFixed(2)})`, sx, y + k * (h - 4), 1, 2);
    }
  },
});

// A web in a roof corner. It trembles when you walk under it.
const cobweb = (s) => ({
  over(ctx, cam, t) {
    const x = s.x * T - cam.x;
    const y = s.y * T - cam.y;
    if (!onScreen(x, y, 30)) return;
    const f = s.flip ? -1 : 1;
    const near = Math.max(0, 1 - dist(s.scene, s.x * T + 6, s.y * T + 10) / 50);
    const sway = Math.sin(t * 2.2) * (0.3 + near * 1.4);
    const cx = x + (s.flip ? 15 : 0);
    ctx.fillStyle = 'rgba(225,225,230,0.5)';
    // Four spokes out of the corner, and three arcs between them.
    for (const ang of [0.05, 0.55, 1.05, 1.5]) {
      for (let r = 1; r <= 11; r++) ctx.fillRect(Math.round(cx + f * Math.cos(ang) * r), Math.round(y + Math.sin(ang) * r + sway * r / 14), 1, 1);
    }
    for (const r of [4, 7, 10]) {
      for (let a = 0; a <= 10; a++) {
        const ang = (a / 10) * 1.5 + 0.05;
        ctx.fillRect(Math.round(cx + f * Math.cos(ang) * r), Math.round(y + Math.sin(ang) * r + sway * r / 14), 1, 1);
      }
    }
  },
});

// Small rock teeth hanging from the roof's lower edge: the tips are wet and glint.
const teeth = (s) => ({
  over(ctx, cam, t) {
    const y0 = (s.y + 1) * T - cam.y;
    const x0 = s.x * T - cam.x;
    if (!onScreen(x0 + (s.w ?? 3) * T / 2, y0, 80)) return;
    const n = Math.round((s.w ?? 3) * 1.6);
    for (let i = 0; i < n; i++) {
      const tx = x0 + (i / n) * (s.w ?? 3) * T + hash(i + s.x) * 5;
      const len = 3 + Math.floor(hash(i * 3 + s.y) * 5);
      rect(ctx, '#3a2e26', tx - 1, y0 - 2, 3, 3);
      rect(ctx, '#4a3c30', tx, y0, 1, len);
      rect(ctx, '#2a2018', tx + 1, y0, 1, Math.max(1, len - 2));
      if (Math.sin(t * 0.8 + i * 1.7) > 0.8) rect(ctx, 'rgba(190,230,250,0.8)', tx, y0 + len, 1, 1);
    }
  },
});

// Pale sparks lifting off glassy rock, very slowly.
const starmotes = (s) => ({
  over(ctx, cam, t) {
    const cx = (s.x + (s.w ?? 4) / 2) * T - cam.x;
    if (!onScreen(cx, (s.y + (s.h ?? 3) / 2) * T - cam.y, 100)) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < (s.n ?? 8); i++) {
      const k = fract(t * (0.05 + hash(i + 3) * 0.05) + hash(i + 8));
      const mx = (s.x + hash(i * 2 + s.x) * (s.w ?? 4)) * T - cam.x + Math.sin(t * 0.6 + i) * 4;
      const my = (s.y + (s.h ?? 3) * (1 - k)) * T - cam.y;
      const a = Math.sin(k * Math.PI) * 0.8;
      const c = s.color ?? '190,225,255';
      rect(ctx, `rgba(${c},${a.toFixed(2)})`, mx, my, 1, 1);
      rect(ctx, `rgba(${c},${(a * 0.4).toFixed(2)})`, mx - 1, my, 3, 1);
      rect(ctx, `rgba(${c},${(a * 0.4).toFixed(2)})`, mx, my - 1, 1, 3);
    }
    ctx.restore();
  },
});

Object.assign(COAST_KINDS, { cricket, glowworms, grit, sleepbat, beetle, motes, wetwall, cobweb, teeth, starmotes });

// Each room's extras, added to the touches table (kept here so the table's own
// file stays small and other chapters' work doesn't collide with it).
import { DIGGINGS_EXTRA_TOUCHES } from '../data/diggingsTouches.js';
for (const [room, specs] of Object.entries(DIGGINGS_EXTRA_TOUCHES)) {
  ROOM_TOUCHES[room] = [...(ROOM_TOUCHES[room] ?? []), ...specs];
}
