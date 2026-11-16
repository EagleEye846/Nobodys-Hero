import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, TILE_SIZE as T } from '../config.js';
import { glowSprite } from './lamplight.js';
import { hash } from '../engine/noise.js';
import { COAST_KINDS } from './coastTouches.js';
import { ROOM_TOUCHES } from '../data/touches.js';
import { HUSH_LIFE_GLOW, HUSH_LIFE_SLEEPERS } from '../data/hushLife.js';
import { HUSH_LIFE_TOUCHES } from '../data/hushLifeTouches.js';

// THE HUSHWOOD'S SMALL LIFE (the life pass, round 2, 15 November 2026): living touches for chapter 3's quiet
// wood, as kinds for touches.js (the same rules: drawn only, no bodies, so a log, a treadle, a push, a swing
// or a cutscene walk never notices them; and nothing here makes a sound, because the wood is hiding).
// They hook in by adding themselves to the coast's kind table, so touches.js only has to import this file.
//
// Everything here goes still when the wood "listens": while the Hush's shadow is near (in the Quiet), and
// every half a minute or so for a few breaths everywhere else. Hares freeze, mice freeze, moths settle and
// the fungus dims. Nothing here ever runs away, because running is noise.
//
//   hare      a hare nibbling, looking up, nibbling; frozen stiff, ears straight up, when the wood listens
//             (or when you come close): it never bolts
//   mouse     a mouse that scurries a few steps between pauses, and freezes the same way
//   toadsnore the z's drifting up from a toadstool asleep
//   fungus    a faint glow of its own for glowing fungus (dims as the wood listens)
//   mothcloud pale moths, round a lantern, a stump, a patch of fungus; they settle when the wood listens
//   leaffall  the odd scarlet leaf, coming down very slowly and straight
//   boughs    dark leaf fringes hanging into the top and bottom edges of the room: foreground depth
//   smoke     a heavy charcoal smoke column (the kiln) and thin fire smoke
//
// Where each goes is a table in src/data/hushLifeTouches.js (made with the room's props), and the glow and
// the sleeping toadstools follow the props in src/data/hushLife.js. They're added to the touches table at
// the end of this file. Positions are in tiles.

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

// Whether the wood is holding its breath at a spot (world pixels): the Hush's shadow within a few lengths of
// it, or the whole wood's slow beat (about five seconds in every thirty). 0 or 1.
function hushed(scene, t, px, py) {
  const h = scene.hush;
  if (h && !h.sound && Math.hypot(h.x - px, h.y - py) < h.radius * 4.5) return 1;
  return (t + 11) % 31 > 26 ? 1 : 0;
}

// ---- A hare ----

const hare = (s) => {
  const x = s.x * T + 8;
  const y = s.y * T + 14;
  const f = s.face ?? 1;
  const seed = s.x * 3.1 + s.y * 1.7;
  const sx = (dx, w = 1) => (f > 0 ? x + dx : x - dx - w + 1);
  return {
    thing: {
      sortY: y,
      draw(ctx, cam, t) {
        const px = x - cam.x;
        const py = y - cam.y;
        if (!onScreen(px, py)) return;
        const still = hushed(s.scene, t, x, y) || dist(s.scene, x, y) < 30;
        const phase = fract(t * 0.11 + hash(seed));
        const nibble = !still && (phase < 0.5 || (phase > 0.62 && phase < 0.9));
        const bob = nibble && Math.floor(t * 3 + seed) % 2 ? 1 : 0;
        const flick = !still && fract(t * 0.23 + hash(seed + 4)) < 0.05;
        rect(ctx, 'rgba(0,0,0,0.3)', x - cam.x - 6, py, 12, 1);
        // Haunch, back, belly, tail.
        rect(ctx, '#8a7458', sx(-5, 4) - cam.x, py - 4, 4, 4);
        rect(ctx, '#8a7458', sx(-3, 6) - cam.x, py - 5 + (still ? 0 : 0), 6, 4);
        rect(ctx, '#a08a6c', sx(-4, 3) - cam.x, py - 5, 3, 1);
        rect(ctx, '#c0aa8a', sx(-2, 4) - cam.x, py - 2, 4, 1);
        rect(ctx, '#e8e0d0', sx(-7, 2) - cam.x, py - 3, 2, 2);
        rect(ctx, '#5a4a38', sx(2, 1) - cam.x, py - 2, 1, 2);
        rect(ctx, '#5a4a38', sx(-4, 3) - cam.x, py - 1, 3, 1);
        // Head: up and listening, or down in the grass.
        const hy = nibble ? py - 4 + bob : py - 7;
        rect(ctx, '#8a7458', sx(2, 3) - cam.x, hy, 3, 3);
        rect(ctx, '#a08a6c', sx(2, 3) - cam.x, hy, 3, 1);
        rect(ctx, '#14080c', sx(4, 1) - cam.x, hy + 1, 1, 1);
        rect(ctx, '#d89098', sx(5, 1) - cam.x, hy + 2, 1, 1);
        // Ears: straight up and wide-eyed when it freezes, laid back (and one flicking) when it's easy.
        if (still || !nibble) {
          rect(ctx, '#8a7458', sx(2, 1) - cam.x, hy - 4, 1, 4);
          rect(ctx, '#8a7458', sx(4, 1) - cam.x, hy - 4, 1, 4);
          rect(ctx, '#c8a898', sx(2, 1) - cam.x, hy - 3, 1, 2);
        } else {
          rect(ctx, '#8a7458', sx(0, 4) - cam.x, hy - 1, 4, 1);
          rect(ctx, '#8a7458', sx(-1 + (flick ? 1 : 0), 3) - cam.x, hy - 2, 3, 1);
        }
      },
    },
  };
};

// ---- A mouse ----

const mouse = (s) => {
  const x0 = s.x * T + 8;
  const y = s.y * T + 14;
  const span = (s.w ?? 3) * T;
  const seed = s.x * 5.3 + s.y;
  return {
    thing: {
      sortY: y,
      draw(ctx, cam, t) {
        // A leg of four seconds: a scurry, then a pause; back and forth along its run.
        const leg = Math.floor(t / 4 + hash(seed) * 9);
        const k = fract(t / 4 + hash(seed) * 9);
        const moving = k < 0.3;
        const e = moving ? k / 0.3 : 1;
        const out = leg % 2 === 0;
        const x = x0 + (out ? e : 1 - e) * span;
        const f = out ? 1 : -1;
        const px = x - cam.x;
        const py = y - cam.y;
        if (!onScreen(px, py)) return;
        const still = hushed(s.scene, t, x, y) || dist(s.scene, x, y) < 22;
        const run = moving && !still;
        const cx = (dx, w = 1) => (f > 0 ? px + dx : px - dx - w + 1);
        rect(ctx, 'rgba(0,0,0,0.3)', px - 3, py, 7, 1);
        rect(ctx, '#7a6a5c', cx(-2, 5), py - 3, 5, 3);
        rect(ctx, '#9a8a7a', cx(-1, 3), py - 3, 3, 1);
        rect(ctx, '#7a6a5c', cx(3, 2), py - 3 + (still ? -1 : 0), 2, 2);
        rect(ctx, '#14080c', cx(4, 1), py - 3 + (still ? -1 : 0), 1, 1);
        rect(ctx, '#d89098', cx(2, 1), py - 5, 1, 2);
        rect(ctx, '#d8a0a0', cx(-4, 2), py - 1 - (run && Math.floor(t * 10) % 2 ? 1 : 0), 2, 1);
        rect(ctx, '#d8a0a0', cx(-5, 1), py - 2, 1, 1);
      },
    },
  };
};

// ---- The z's off a sleeping toadstool ----

const toadsnore = (s) => ({
  over(ctx, cam, t) {
    const x = s.x * T + 11 - cam.x;
    const y = s.y * T + 2 - cam.y;
    if (!onScreen(x, y)) return;
    for (let i = 0; i < 3; i++) {
      const life = fract(t * 0.2 + i / 3 + hash(s.x + s.y));
      const a = Math.sin(life * Math.PI) * 0.85;
      const zx = x + life * 7 + Math.sin(life * 5 + i) * 1.5;
      const zy = y - life * 18;
      const c = `rgba(226,226,255,${a.toFixed(2)})`;
      const big = life > 0.5 ? 3 : 2;
      rect(ctx, c, zx, zy, big, 1);
      rect(ctx, c, zx + big - 2, zy + 1, 1, 1);
      rect(ctx, c, zx, zy + 2 - (big - 2), big, 1);
    }
  },
});

// ---- Glowing fungus ----

const fungus = (s) => ({
  over(ctx, cam, t) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    (s.points ?? []).forEach(([px, py], i) => {
      const x = px * T + 8 - cam.x;
      const y = py * T + 9 - cam.y;
      if (!onScreen(x, y, 30)) return;
      const hush = hushed(s.scene, t, px * T + 8, py * T + 8);
      const pulse = 0.7 + 0.3 * Math.sin(t * 0.8 + i * 1.9);
      const a = (hush ? 0.07 : 0.2) * pulse;
      ctx.globalAlpha = a;
      ctx.drawImage(glowSprite(s.color ?? '110,230,200'), x - 14, y - 12, 28, 24);
      ctx.globalAlpha = 1;
      if (!hush && Math.sin(t * 1.3 + i * 2.7) > 0.4) rect(ctx, 'rgba(180,255,230,0.7)', x - 2 + Math.round(Math.sin(t + i) * 2), y - 5 - ((t * 3 + i * 7) % 6), 1, 1);
    });
    ctx.restore();
  },
});

// ---- Moths ----

const mothcloud = (s) => ({
  over(ctx, cam, t) {
    const cx = (s.x + (s.w ?? 2) / 2) * T - cam.x;
    const cy = (s.y + (s.h ?? 2) / 2) * T - cam.y;
    if (!onScreen(cx, cy, 60)) return;
    const hush = hushed(s.scene, t, (s.x + (s.w ?? 2) / 2) * T, (s.y + (s.h ?? 2) / 2) * T);
    for (let i = 0; i < (s.n ?? 4); i++) {
      const a = (hush ? 0 : t) * (0.7 + hash(i + s.x) * 0.6) + hash(i * 3 + s.y) * 6.28;
      const mx = cx + Math.sin(a) * (s.w ?? 2) * T * 0.45 + Math.sin(a * 2.3 + i) * 3;
      const my = cy + Math.sin(a * 1.4 + 1) * (s.h ?? 2) * T * 0.4;
      const wing = hush ? 0 : Math.floor(t * 18 + i * 3) % 3;
      const c = hush ? 'rgba(200,196,214,0.45)' : 'rgba(228,226,240,0.85)';
      rect(ctx, c, mx, my, 1, 1);
      if (wing === 0) { rect(ctx, c, mx - 2, my - 1, 2, 1); rect(ctx, c, mx + 1, my - 1, 2, 1); }
      else if (wing === 1) { rect(ctx, c, mx - 2, my, 2, 1); rect(ctx, c, mx + 1, my, 2, 1); }
      else { rect(ctx, c, mx - 1, my - 2, 1, 2); rect(ctx, c, mx + 1, my - 2, 1, 2); }
    }
  },
});

// ---- A leaf coming down ----

const leaffall = (s) => ({
  over(ctx, cam, t) {
    const x0 = s.x * T - cam.x;
    const y0 = s.y * T - cam.y;
    if (!onScreen(x0 + (s.w * T) / 2, y0 + (s.h * T) / 2, Math.max(s.w, s.h) * T)) return;
    for (let i = 0; i < (s.n ?? 3); i++) {
      const dur = 13 + hash(i + s.x) * 8;
      const life = fract(t / dur + hash(i * 5 + s.y));
      const lx = x0 + hash(i * 7 + s.x) * s.w * T + Math.sin(life * 9 + i * 2) * 5;
      const ly = y0 + life * s.h * T;
      const a = Math.min(1, life * 8, (1 - life) * 6) * 0.9;
      const turn = Math.floor(life * 14 + i) % 3;
      const c = `rgba(${turn === 1 ? '224,56,62' : '184,30,48'},${a.toFixed(2)})`;
      if (turn === 0) rect(ctx, c, lx, ly, 2, 1);
      else if (turn === 1) { rect(ctx, c, lx, ly, 1, 2); rect(ctx, c, lx + 1, ly + 1, 1, 1); }
      else rect(ctx, c, lx, ly, 2, 2);
    }
  },
});

// ---- Boughs hanging into the room's edges ----

const boughs = (s) => {
  const cols = s.scene.roomData.tiles[0].length;
  const rows = s.scene.roomData.tiles.length;
  const skip = (s.scene.roomData.doors ?? []).map((d) => [d.x - 1, d.x + d.w + 1, d.y, d.h]);
  const open = (tx, top) => !skip.some(([a, b, dy, dh]) => tx >= a && tx < b && (top ? dy <= 1 : dy + dh >= rows - 1));
  const lobe = (ctx, x, y, w, h, c) => {
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), w, h);
  };
  const cluster = (ctx, x, y, dir, i, t) => {
    const sway = Math.round(Math.sin(t * 0.5 + i * 1.3) * 1.2);
    const big = 4 + Math.floor(hash(i + s.scene.roomData.id.length) * 5);
    const drop = 1 + Math.floor(hash(i * 13 + 4) * 4);
    // A rounded clump: a broad bar, a narrower one under it, a short tip.
    lobe(ctx, x + sway - big, y, big * 2, 3, 'rgba(14,6,10,0.8)');
    lobe(ctx, x + sway - big + 2, y + dir * 3, big * 2 - 4, 2, 'rgba(14,6,10,0.7)');
    lobe(ctx, x + sway - 2, y + dir * 5, 4, drop, 'rgba(14,6,10,0.55)');
    if (hash(i * 3 + 1) > 0.5) lobe(ctx, x + sway - 2, y + dir * 1 + (dir > 0 ? 0 : 1), 2, 1, 'rgba(138,20,38,0.7)');
    if (hash(i * 3 + 2) > 0.7) lobe(ctx, x + sway + big - 3, y + dir * 3, 1, 1, 'rgba(184,30,48,0.6)');
  };
  return {
    over(ctx, cam, t) {
      const wide = cols * T;
      for (let i = 0; i < cols * 2; i++) {
        const wx = (i + hash(i * 11)) * (T / 2);
        if (wx > wide) break;
        const sxp = wx - cam.x;
        if (sxp < -12 || sxp > W + 12) continue;
        const tx = Math.floor(wx / T);
        if (s.top !== false && open(tx, true)) cluster(ctx, sxp, T * 0.8 - cam.y + (hash(i * 5) * 5 - 2), 1, i, t);
        if (s.bottom !== false && open(tx, false)) cluster(ctx, sxp, (rows - 1) * T + 4 - cam.y - (hash(i * 7) * 3), -1, i + 50, t);
      }
    },
  };
};

// ---- Smoke from the kiln and the fire ----

const smoke = (s) => ({
  over(ctx, cam, t) {
    const x = s.x * T + 8 - cam.x;
    const y = s.y * T - cam.y;
    if (!onScreen(x, y - 30, 60)) return;
    const n = s.n ?? 10;
    for (let i = 0; i < n; i++) {
      const life = fract(t * (s.speed ?? 0.12) + i / n);
      const rise = life * (s.rise ?? 40);
      const drift = (s.lean ?? 1) * life * life * 16 + Math.sin(life * 5 + i * 2) * 2;
      const size = 2 + Math.floor(life * (s.big ?? 5));
      const a = (1 - life) * (s.alpha ?? 0.5) * Math.min(1, life * 6);
      rect(ctx, `rgba(${s.color ?? '70,66,72'},${a.toFixed(3)})`, x + drift - size / 2, y - rise - size / 2, size, size);
      rect(ctx, `rgba(${s.color ?? '70,66,72'},${(a * 0.5).toFixed(3)})`, x + drift - size / 2 - 1, y - rise - size / 2 + 1, size + 2, size - 1);
    }
  },
});

Object.assign(COAST_KINDS, { hare, mouse, toadsnore, fungus, mothcloud, leaffall, boughs, huskSmoke: smoke });

// Each room's extras, added to the touches table (kept here so the table's own file stays small and other
// chapters' work doesn't collide with it). Every outdoor room of the wood gets its boughs, a few falling
// leaves and its dappled shade; the rest is the room's own table.
for (const [room, specs] of Object.entries(HUSH_LIFE_TOUCHES)) {
  const list = [...specs];
  if (HUSH_LIFE_GLOW[room]) list.push({ kind: 'fungus', points: HUSH_LIFE_GLOW[room] });
  for (const [x, y] of HUSH_LIFE_SLEEPERS[room] ?? []) list.push({ kind: 'toadsnore', x, y });
  ROOM_TOUCHES[room] = [...(ROOM_TOUCHES[room] ?? []), ...list];
}
