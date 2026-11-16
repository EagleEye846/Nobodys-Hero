import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, TILE_SIZE as T } from '../config.js';
import { fract, hash } from '../engine/noise.js';

// CITY LIFE: the life pass's small living things for Lasthome, the Dead City, the Registry and the Old
// Baths (chapter 3), as more kinds for touches.js (same rules: drawn only, no bodies, nothing can bump
// into them; rooms' own list in src/data/cityTouches.js).
//
//   c3birds   birds on the ground in a box: pecking and hopping, and up in a flurry when you come near,
//             back down somewhere else a while later. look: 'sparrow' (the town), 'pigeon' (the dead
//             city: grey, with a green neck), 'hen' (Lasthome's yards: slow, red-brown, a comb)
//   c3kids    two or three children at play in a box: 'chase' (round and round), 'hop' (a hopscotch
//             column), 'watch' (sat in a row throwing stones). They stop and look when you come close
//   c3papers  sheets of paper (or flakes of ink-black ash) drifting up and over in a box, turning
//   c3mouse   a mouse at a hole, nibbling a crumb; it runs to its other hole when you come near and
//             comes out again once you have gone
//   c3vines   ivy (or cobwebs) hanging from the bottom edge of a wall, swaying; drawn in front, so you
//             walk under a fringe of it
//   c3flies   a few flies/midges turning over one spot (a bin, a stew pot, a lamp)
//
// Positions are in tiles; decimals are fine. `x, y, w, h` is the box.

const rect = (ctx, color, x, y, w = 1, h = 1) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};
const onScreen = (x, y, pad = 24) => x > -pad && x < W + pad && y > -pad && y < H + pad;
const bodies = (scene) => {
  const out = [{ x: scene.player.x + 6, y: scene.player.y + 12 }];
  for (const o of scene.followers ?? []) if (!o.hidden) out.push({ x: o.x + 6, y: o.y + 12 });
  return out;
};
const nearest = (scene, px, py) => {
  let d = Infinity;
  for (const b of bodies(scene)) d = Math.min(d, Math.hypot(b.x - px, b.y - py));
  return d;
};

// ---- Birds ----

const LOOKS = {
  sparrow: { body: '#8a6a48', back: '#5e4630', belly: '#c8b898', head: '#7a5a3a', beak: '#d8b050', w: 5, h: 3, bob: 1 },
  pigeon: { body: '#8a929e', back: '#646c78', belly: '#b4bac4', head: '#6a7482', neck: '#5aa088', beak: '#d8c8b0', w: 7, h: 4, bob: 1.5 },
  hen: { body: '#a85a30', back: '#7a3a1e', belly: '#c88050', head: '#a85a30', comb: '#d03a2a', beak: '#e8b840', w: 9, h: 6, bob: 2 },
};

function drawBird(ctx, look, x, y, f, pose, t, seed) {
  // (x, y) is the feet; f is 1 (facing right) or -1; pose is 'stand', 'peck' or 'fly'.
  const L = LOOKS[look];
  const px = (lx, ly, w, h, c) => rect(ctx, c, f > 0 ? x + lx : x - lx - w + 1, y + ly, w, h);
  const bw = L.w;
  const bh = L.h;
  if (pose === 'fly') {
    const flap = Math.sin(t * 24 + seed) > 0;
    px(-Math.floor(bw / 2), -bh - 2, bw, bh - 1, L.body);
    px(-Math.floor(bw / 2), -bh, bw, 1, L.belly);
    px(Math.floor(bw / 2) - 1, -bh - 3, 2, 2, L.head);
    px(Math.floor(bw / 2) + 1, -bh - 2, 1, 1, L.beak);
    px(-Math.floor(bw / 2) - 2, -bh - 1, 2, 1, L.back);
    if (flap) { px(-1, -bh - 5, bw - 2, 3, L.back); px(-2, -bh - 6, 2, 1, L.back); } else { px(-1, -bh - 1, bw - 2, 2, L.back); }
    return;
  }
  const peck = pose === 'peck' ? 1 : 0;
  px(-Math.floor(bw / 2), -bh, bw, bh - 1, L.body);
  px(-Math.floor(bw / 2), -bh, bw, 1, L.back);
  px(-Math.floor(bw / 2) + 1, -2, bw - 2, 1, L.belly);
  px(-Math.floor(bw / 2) - 1, -bh - (look === 'hen' ? 2 : 0), 2, look === 'hen' ? 3 : 2, L.back);
  const hx = Math.floor(bw / 2) - 1;
  const hy = -bh - (peck ? -1 : 1) - (look === 'hen' ? 1 : 0) + (peck ? 2 : 0);
  px(hx, hy, 3, 3, L.head);
  if (L.neck) px(hx - 1, hy + 1, 2, 2, L.neck);
  if (L.comb) px(hx, hy - 1, 2, 1, L.comb);
  px(hx + 3, hy + 1, 1, 1, L.beak);
  px(hx + 1, hy, 1, 1, '#14161a');
  rect(ctx, '#7a5a3a', f > 0 ? x : x - 1, y - 1, 1, 1);
  rect(ctx, '#7a5a3a', f > 0 ? x + 2 : x - 3, y - 1, 1, 1);
}

function c3birds(s) {
  const look = s.look ?? 'sparrow';
  const n = s.n ?? 3;
  const birds = Array.from({ length: n }, (_, i) => ({ i, mode: 'home', at: 0, hx: 0, hy: 0, f: 1, tx: 0, ty: 0, home: true, away: 0, dir: 1 }));
  const place = (b, salt) => {
    b.hx = s.x * T + 4 + hash(b.i * 7 + salt + s.x) * (s.w * T - 8);
    b.hy = s.y * T + 6 + hash(b.i * 13 + salt + s.y) * (s.h * T - 6);
    b.tx = b.hx;
    b.ty = b.hy;
  };
  birds.forEach((b) => place(b, 1));
  return {
    thing: {
      sortY: s.y * T + s.h * T * 0.6,
      draw(ctx, cam, t) {
        if (!onScreen(s.x * T - cam.x + s.w * T / 2, s.y * T - cam.y + s.h * T / 2, 90)) return;
        for (const b of birds) {
          const d = nearest(s.scene, b.hx, b.hy);
          if (b.mode !== 'fly' && b.mode !== 'gone' && d < (look === 'hen' ? 26 : 34)) {
            b.mode = 'fly'; b.at = t; b.dir = b.hx > (s.scene.player.x + 6) ? 1 : -1; b.f = b.dir;
          }
          if (b.mode === 'fly') {
            const u = (t - b.at) / 1.2;
            if (u >= 1) { b.mode = 'gone'; b.at = t; continue; }
            const fx = b.hx + b.dir * u * (look === 'hen' ? 60 : 110);
            const fy = b.hy - Math.sin(u * Math.PI * 0.8) * (look === 'hen' ? 14 : 40) - u * 10;
            if (look === 'hen' && u > 0.5) { drawBird(ctx, look, fx - cam.x, fy - cam.y + (u - 0.5) * 24, b.dir, 'stand', t, b.i); } else drawBird(ctx, look, fx - cam.x, fy - cam.y, b.dir, 'fly', t, b.i);
            continue;
          }
          if (b.mode === 'gone') {
            if (t - b.at > 9 + b.i * 2.5 && d > 70) { place(b, Math.floor(t)); b.mode = 'home'; b.at = t; }
            continue;
          }
          // Home: peck, stand, now and then hop a step.
          const k = ((t * (look === 'hen' ? 0.55 : 0.9) + b.i * 1.7) % 4);
          let pose = 'stand';
          if (k < 1.4) pose = Math.sin(t * 9 + b.i * 3) > -0.2 && Math.sin(t * 9 + b.i * 3) < 0.7 ? 'peck' : 'stand';
          if (k > 3.7 && Math.abs(b.tx - b.hx) < 0.5) {
            b.tx = Math.max(s.x * T + 3, Math.min((s.x + s.w) * T - 3, b.hx + (hash(Math.floor(t) + b.i) - 0.5) * 22));
            b.f = b.tx > b.hx ? 1 : -1;
          }
          if (Math.abs(b.tx - b.hx) > 0.4) { b.hx += Math.sign(b.tx - b.hx) * 0.9; }
          const hop = Math.abs(b.tx - b.hx) > 0.4 ? -Math.abs(Math.sin(t * 16)) * 1.5 : 0;
          if (onScreen(b.hx - cam.x, b.hy - cam.y)) {
            rect(ctx, 'rgba(0,0,0,0.18)', b.hx - cam.x - 2, b.hy - cam.y, 5, 1);
            drawBird(ctx, look, b.hx - cam.x, b.hy - cam.y + hop, b.f, pose, t, b.i);
          }
        }
      },
    },
  };
}

// ---- Children ----

const SHIRTS = ['#c84a3a', '#4a86c8', '#e8c040', '#6aaa4a', '#b070c0', '#e88a4a'];
function kid(ctx, x, y, shirt, hair, run, face = 1, up = 0, arms = 0) {
  // (x, y) feet; 12 high, about as tall as a marmot child.
  const px = (lx, ly, w, h, c) => rect(ctx, c, x + lx, y + ly - up, w, h);
  px(-2, -12, 4, 4, '#e8c49a');
  px(-2, -12, 4, 2, hair);
  px(face > 0 ? 0 : -2, -10, 1, 1, '#14161a');
  px(-2, -8, 5, 5, shirt);
  px(-2, -8, 5, 1, '#ffffff33');
  if (arms) { px(-4, -11, 1, 4, '#e8c49a'); px(3, -11, 1, 4, '#e8c49a'); } else { px(-3, -8, 1, 4, '#e8c49a'); px(3, -8, 1, 4, '#e8c49a'); }
  const s = run ? Math.sin(x * 0.9) > 0 : 0;
  px(-2, -3, 2, 3 - (s ? 1 : 0), '#4a3a30');
  px(1, -3, 2, 3 - (s ? 0 : 1), '#4a3a30');
}

function c3kids(s) {
  const n = s.n ?? 2;
  const play = s.play ?? 'chase';
  const state = Array.from({ length: n }, (_, i) => ({ a: i * (6.28 / n), last: null, hop: 0 }));
  const cx = (s.x + s.w / 2) * T;
  const cy = (s.y + s.h / 2) * T;
  return {
    thing: {
      sortY: cy + 8,
      draw(ctx, cam, t) {
        if (!onScreen(cx - cam.x, cy - cam.y, 80)) return;
        const d0 = nearest(s.scene, cx, cy);
        const calm = d0 < Math.max(s.w, s.h) * T * 0.55 + 14;
        for (let i = 0; i < n; i++) {
          const k = state[i];
          const shirt = SHIRTS[(i * 2 + (s.seed ?? 0)) % SHIRTS.length];
          const hair = ['#3a2a1c', '#c8902a', '#1c1410', '#7a3a1e'][(i + (s.seed ?? 0)) % 4];
          if (play === 'chase') {
            if (k.last != null && !calm) k.a += (t - k.last) * (1.5 + i * 0.12);
            k.last = t;
            const rx = (s.w * T) / 2 - 4;
            const ry = (s.h * T) / 2 - 4;
            const x = cx + Math.cos(k.a) * rx - cam.x;
            const y = cy + Math.sin(k.a) * ry + 4 - cam.y;
            rect(ctx, 'rgba(0,0,0,0.18)', x - 2, y, 5, 1);
            kid(ctx, x, y, shirt, hair, !calm, Math.sin(k.a) < 0 ? 1 : -1, 0, 1);
          } else if (play === 'hop') {
            // One hops the column (n-1 others stand by and watch).
            if (i === 0) {
              const step = Math.floor(t * 1.4) % 8;
              const u = (t * 1.4) % 1;
              const rows = [0, 1, 2, 3, 4, 5];
              const idx = step < 6 ? rows[step] : 5 - (step - 6);
              const x = (s.x + 0.5) * T + (idx === 3 || idx === 5 ? (step % 2 ? 3 : -3) : 0) - cam.x;
              const y = (s.y + s.h - 0.5) * T - idx * 7 - cam.y;
              const up = calm ? 0 : Math.sin(u * Math.PI) * 4;
              rect(ctx, 'rgba(0,0,0,0.18)', x - 2, y, 5, 1);
              kid(ctx, x, y, shirt, hair, false, 1, up, 1);
            } else {
              const x = (s.x + 1.2 + i * 0.5) * T - cam.x;
              const y = (s.y + s.h - 0.2) * T - cam.y;
              rect(ctx, 'rgba(0,0,0,0.18)', x - 2, y, 5, 1);
              kid(ctx, x, y, shirt, hair, false, -1, 0, Math.sin(t * 3 + i) > 0.5 ? 1 : 0);
            }
          } else {
            // Sat in a row on the kerb, scuffing their heels.
            const x = (s.x + 0.6 + i * 0.7) * T - cam.x;
            const y = (s.y + 0.9) * T - cam.y;
            const swing = Math.sin(t * 2.4 + i * 1.7) > 0 ? 1 : 0;
            rect(ctx, 'rgba(0,0,0,0.18)', x - 2, y, 5, 1);
            kid(ctx, x, y - 1, shirt, hair, false, 1, 0, 0);
            rect(ctx, '#4a3a30', x - 2 + swing, y - 1, 2, 2);
          }
        }
      },
    },
  };
}

// ---- Paper drifting ----

function c3papers(s) {
  const n = s.n ?? 6;
  const cols = s.colors ?? ['#efe6cc', '#d4c8a8', '#f4efe0'];
  return {
    over(ctx, cam, t) {
      const ox = s.x * T - cam.x;
      const oy = s.y * T - cam.y;
      const w = s.w * T;
      const h = s.h * T;
      if (ox > W + 10 || ox + w < -10 || oy > H + 10 || oy + h < -10) return;
      for (let i = 0; i < n; i++) {
        const sp = 0.025 + hash(i * 3 + 1) * 0.03;
        const u = fract(t * sp + hash(i * 11 + s.x));
        const x = ox + u * w + Math.sin(t * 0.9 + i * 2) * 6;
        const y = oy + h - fract(t * sp * 0.55 + hash(i + 5)) * h + Math.sin(t * 1.3 + i) * 4;
        const flip = Math.sin(t * 2.2 + i * 1.9);
        const pw = 2 + Math.abs(flip) * 3;
        const a = Math.sin(Math.PI * u) * 0.9;
        ctx.globalAlpha = Math.max(0, a);
        rect(ctx, cols[i % cols.length], x, y, pw, 2);
        if (s.ink) rect(ctx, s.ink, x, y + 1, Math.max(1, pw - 1), 1);
        ctx.globalAlpha = 1;
      }
    },
  };
}

// ---- A mouse ----

function c3mouse(s) {
  const hx = s.x * T + 8;
  const hy = s.y * T + 12;
  const tx = (s.toX ?? s.x + 2) * T + 8;
  const ty = (s.toY ?? s.y) * T + 12;
  let mode = 'sit';
  let t0 = 0;
  return {
    thing: {
      sortY: hy,
      draw(ctx, cam, t) {
        const d = nearest(s.scene, hx, hy);
        if (mode === 'sit' && d < 40) { mode = 'run'; t0 = t; }
        if (mode === 'run' && t - t0 > 0.7) { mode = 'hide'; t0 = t; }
        if (mode === 'hide' && t - t0 > 8 && d > 70) { mode = 'sit'; }
        // The two holes.
        for (const [px, py] of [[hx, hy], [tx, ty]]) if (onScreen(px - cam.x, py - cam.y)) { rect(ctx, '#0a0a0c', px - 3 - cam.x, py - 2 - cam.y, 6, 2); rect(ctx, '#2a2420', px - 3 - cam.x, py - cam.y, 6, 1); }
        if (mode === 'hide') return;
        let x = hx;
        let y = hy;
        let f = tx > hx ? 1 : -1;
        if (mode === 'run') { const u = Math.min(1, (t - t0) / 0.7); x = hx + (tx - hx) * u; y = hy + (ty - hy) * u; }
        if (!onScreen(x - cam.x, y - cam.y)) return;
        const px = x - cam.x;
        const py = y - cam.y;
        const nib = mode === 'sit' && Math.sin(t * 14) > 0.4 ? 1 : 0;
        rect(ctx, '#9a9088', px - 2, py - 3, 5, 3);
        rect(ctx, '#b8aea4', px - 2, py - 1, 5, 1);
        rect(ctx, '#9a9088', px + 2 * f, py - 3 + nib, 2, 2);
        rect(ctx, '#e8a0a0', px + 2 * f, py - 4, 1, 1);
        rect(ctx, '#14161a', px + 3 * f, py - 3 + nib, 1, 1);
        rect(ctx, '#d8a0a0', px - 3 * f, py - 1 + Math.round(Math.sin(t * 6)), 3, 1);
        if (mode === 'sit') rect(ctx, '#d8b878', px + 4 * f, py - 1, 2, 1);
      },
    },
  };
}

// ---- Hanging ivy / cobwebs ----

function c3vines(s) {
  const n = Math.round(s.w * (s.density ?? 1.6));
  const web = s.style === 'web';
  const green = s.colors ?? ['#243e26', '#35582f', '#4c7a3e', '#6ea052'];
  return {
    over(ctx, cam, t) {
      const ox = s.x * T - cam.x;
      const oy = s.y * T - cam.y;
      if (ox > W + 20 || ox + s.w * T < -20 || oy > H + 40 || oy < -40) return;
      for (let i = 0; i < n; i++) {
        const x0 = ox + 2 + (i + hash(i * 5 + s.x) * 0.7) * ((s.w * T - 4) / n);
        const len = (s.len ?? 12) * (0.5 + hash(i * 9 + 3 + s.x) * 0.8);
        const sw = Math.sin(t * 0.8 + i * 1.3 + s.x) * (web ? 1.2 : 1.6);
        for (let j = 0; j < len; j++) {
          const k = j / len;
          const x = x0 + sw * k * k * 2 + Math.sin(j * 0.9 + i) * (web ? 0 : 0.8);
          if (web) {
            if (j % 2 === 0) rect(ctx, 'rgba(220,224,230,0.55)', x, oy + j);
          } else {
            rect(ctx, green[j % 3 === 0 ? 2 : 1], x, oy + j);
            if (j % 4 === 2) { rect(ctx, green[3], x + 1, oy + j, 2, 1); rect(ctx, green[2], x - 1, oy + j + 1, 2, 1); }
          }
        }
        if (!web && hash(i * 17 + s.x) > 0.8) rect(ctx, s.bloom ?? '#e8e0f0', x0 + sw * 2, oy + len, 2, 2);
      }
    },
  };
}

// ---- Flies over one spot ----

function c3flies(s) {
  const n = s.n ?? 4;
  return {
    over(ctx, cam, t) {
      const x = s.x * T + 8 - cam.x;
      const y = s.y * T + 4 - cam.y;
      if (!onScreen(x, y)) return;
      for (let i = 0; i < n; i++) {
        const a = t * (2 + hash(i) * 2) + i * 2;
        rect(ctx, 'rgba(20,20,24,0.85)', x + Math.cos(a) * 5 + Math.sin(a * 2.3) * 2, y + Math.sin(a * 1.7) * 3 + Math.cos(a * 0.7) * 2);
      }
    },
  };
}

export const CITY_KINDS = { c3birds, c3kids, c3papers, c3mouse, c3vines, c3flies };
