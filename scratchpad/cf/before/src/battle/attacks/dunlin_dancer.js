import { defineBulletArt } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { PathShot, Deco, Zone, blit, Guide } from './coastKit.js';

// The Dunlin Dancer's attacks. Five sandpipers that move as one bird, the
// way a flock on the tideline does:
//   - Chase the tide: the sea washes up the box and back, and the flock runs
//     along the very edge of the foam. The row hurts; slip through its gap.
//   - Follow the leader: the leader marks out a leg and flies it, and the
//     others follow its exact path, one after another.
//   - Probing: one bird over each strip, probing the sand in a ripple across
//     the box and back. Step into a strip just after it's been probed.
// It stands to the right of the box.

const DUN = { k: '#1c1a1e', b: '#a89478', B: '#7c6a54', r: '#c0703e', w: '#f4efe4', K: '#3a3436', l: '#6a5a4a', o: '#e0a060', s: '#d8c8a0', S: '#a8946a', e: '#ffffff' };


// A tiny running sandpiper, facing left, two frames of legs.
const runner = (a) => art(13, 10, (p) => {
  p.ellipse(7, 3.5, 4.4, 2.1, 'b');
  p.ellipse(6.5, 4.4, 3.4, 1, 'w');
  p.ellipse(8.4, 2.6, 2.4, 0.9, 'r');
  p.ellipse(2.4, 2.4, 1.7, 1.5, 'b');
  p.set(1.6, 1.8, 'e');
  p.line(0, 2.8, -2, 3.8, 'K');
  p.line(6, 5, 5 + a * 2.5, 9, 'o');
  p.line(8, 5, 9 - a * 2.5, 9, 'o');
  p.line(11, 3, 13, 4, 'B');
});
defineBulletArt('dunRunner', { frames: [runner(1), runner(-1)], palette: DUN, radius: 3.2, frameSeconds: 0.09 });

// A diving beak, pointing right: a thin dagger on a little head. (Pale since
// 2026-11-08: the black one was nearly lost in the black box.)
defineBulletArt('dunBeak', {
  frames: [art(13, 5, (p) => { p.ellipse(2.5, 2, 2.3, 2, 'b'); p.set(2, 1, 'e'); p.line(4, 2, 11, 2, 's', 1); p.set(11, 2, 'w'); })],
  palette: DUN,
  radius: 2.2,
  rotate: true,
});

// A cockle shell, ridged, spinning.
defineBulletArt('dunShell', {
  frames: [art(9, 8, (p) => { p.poly([[4, 0], [8, 5], [6, 7], [2, 7], [0, 5]], 's'); p.line(4, 1, 4, 6, 'S'); p.line(2, 2, 2, 6, 'S'); p.line(6, 2, 6, 6, 'S'); })],
  palette: DUN,
  radius: 3.4,
  spin: 4,
});

// The flock overhead (harmless): a bird with its wings up, then down.
const fly = (down) => art(15, 9, (p) => {
  p.ellipse(7, 4.5, 3.6, 2, 'b');
  p.ellipse(2.5, 3.8, 1.6, 1.4, 'b');
  p.line(0, 4.2, -1, 4.8, 'k');
  p.line(7, 3, 11, down ? 7 : 0, 'B', 3);
  p.line(7, 3, 4, down ? 8 : 0, 'B', 3);
  p.line(10, 5, 14, 6, 'B');
});
defineBulletArt('dunFlyer', { frames: [fly(false), fly(true)], palette: DUN, radius: 1, frameSeconds: 0.18 });

// Tells (harmless, they blink before the thing they warn of):
// a dunlin's three-toed footprint pressed in at the edge of a lane, where a
// row of runners is about to come in;
defineBulletArt('dunPrint', {
  frames: [['o...o', '.o.o.', '..o..', '..o..'], ['.....', 'o...o', '.o.o.', '..o..']],
  palette: DUN,
  radius: 1,
  frameSeconds: 0.12,
});
// a little puff of feathers at the top of the box, where a beak will come in;
defineBulletArt('dunDive', { frames: [['w.e.w', '.ses.', '..s..']], palette: DUN, radius: 1 });
// and a shell's shadow on the floor, where it will land.
defineBulletArt('dunMark', { frames: [['.sssss.', 'ssSSSss', '.sssss.']], palette: DUN, radius: 1 });

// A dunlin flying, facing the way it goes (drawn facing right).
defineBulletArt('dunLeader', { frames: [fly(false).map((r) => [...r].reverse().join('')), fly(true).map((r) => [...r].reverse().join(''))], palette: DUN, radius: 3.2, rotate: true, frameSeconds: 0.12 });

export const DUNLIN_DANCER_ATTACKS = {
  // Chase the tide: the sea washes up the box from the bottom and back
  // down again, and the flock runs along the very edge of it, a row of
  // little birds always just ahead of the foam (two of them missing, so
  // there's a gap). In the water or above the line you're fine: what hurts
  // is the row. Every wave reaches a bit past where you were.
  dunTide(box, density, { rand }) {
    const T = (s) => s * density;
    const W = 1.55;
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + n * W * 0.85) && n < 6) {
          n++;
          const bottom = box.y + box.h + 4;
          const reach = Math.min(box.h - 4, bottom - soul.y + rand(10, 18));
          const line = (k) => bottom - reach * Math.sin(Math.PI * Math.min(1, k / W));
          const WARN = 0.45;
          bullets.push(new Deco({ life: WARN + W + 0.1, paint(ctx, d) {
            const k = Math.max(0, d.age - WARN);
            const y = line(k);
            ctx.globalAlpha *= 0.35;
            ctx.fillStyle = '#4a8aa8';
            ctx.fillRect(box.x, y, box.w, bottom - y);
            ctx.globalAlpha = 0.9;
            ctx.fillStyle = '#f4efe4';
            for (let x = box.x; x < box.x + box.w; x += 3) ctx.fillRect(x, Math.round(y + 3 + Math.sin(x * 0.7 + d.age * 9)), 2, 1);
          } }));
          const gap = Math.floor(rand(0, 8));
          for (let i = 0; i < 10; i++) {
            if (i === gap || i === gap + 1) continue;
            const x = box.x + 4 + i * 8;
            bullets.push(new PathShot({ art: 'dunRunner', warn: WARN, life: W, path: (k) => ({ x: x + Math.sin(k * 20 + i) * 0.8, y: line(k) - 4 }) }));
          }
        }
      },
    };
  },

  // Follow the leader: the five fly as one, in a file. The leader marks out
  // a leg (a dotted line, through where you are), flies it, and the others
  // follow its exact path a beat behind each other; at the end of each leg
  // they bunch up, bob, and the leader marks out the next. Six legs.
  dunFollow(box, density) {
    const SPEED = 135;
    const GAP = 0.12;
    const MARK = 0.5;
    let real = 0;
    let next = 0.2;
    let legs = 0;
    let at = { x: box.x + box.w + 10, y: box.y + 10 };
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real < next || legs >= 6) return;
        legs++;
        // Through where you are, and on a bit further, kept in the box.
        const ang = Math.atan2(soul.y - at.y, soul.x - at.x);
        const len = Math.hypot(soul.x - at.x, soul.y - at.y) + 22;
        const end = { x: Math.min(Math.max(at.x + Math.cos(ang) * len, box.x + 6), box.x + box.w - 6), y: Math.min(Math.max(at.y + Math.sin(ang) * len, box.y + 6), box.y + box.h - 6) };
        const from = at;
        const secs = Math.max(0.2, Math.hypot(end.x - from.x, end.y - from.y) / SPEED);
        const a = Math.atan2(end.y - from.y, end.x - from.x);
        bullets.push(new Guide({ x: from.x, y: from.y, angle: a, length: Math.hypot(end.x - from.x, end.y - from.y), warn: MARK, color: '#d8c8a0' }));
        for (let i = 0; i < 5; i++) {
          bullets.push(new PathShot({
            art: 'dunLeader', warn: MARK + i * GAP, life: secs,
            path: (k) => {
              const u = Math.min(1, k / secs);
              return { x: from.x + (end.x - from.x) * u, y: from.y + (end.y - from.y) * u, a };
            },
          }));
        }
        at = end;
        next = real + MARK + secs + 4 * GAP;
      },
    };
  },

  // Probing: the flock lines the top of the box, one bird over each strip,
  // and they probe the sand in a ripple, one after the next, across the
  // box; the next ripple comes back the other way. The bird the ripple
  // starts from calls first, and each bird dips its beak just before it
  // probes. Step into a strip just after its bird has probed it.
  dunProbe(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const COLS = 5;
    const CW = box.w / COLS;
    const STEP = 0.34;
    const STAB = 0.2;
    let t = 0;
    let n = 0;
    let made = false;
    let from = 0;
    return {
      duration: 7,
      update: (dt, bullets) => {
        t += dt;
        if (!made) {
          made = true;
          for (let c = 0; c < COLS; c++) {
            bullets.push(new Deco({ life: 7, x: box.x + CW * (c + 0.5), y: box.y + 3, paint(ctx, d) { blit(ctx, ['..bbb', '.bbbbs', 'bwwwb.', '.o.o..'], DUN, d.x, d.y - 1); } }));
          }
        }
        if (t >= T(0.2 + n * 1.25) && n < 5) {
          n++;
          from = n === 1 ? (rand(0, 1) < 0.5 ? 0 : COLS - 1) : from === 0 ? COLS - 1 : 0;
          const dir = from === 0 ? 1 : -1;
          const CALL = 0.5;
          bullets.push(new Shot({ x: box.x + CW * (from + 0.5), y: box.y + 9, harmless: true, life: CALL, art: 'dunPrint' }));
          // Across the box, one strip after the next; the next pass comes back.
          const seq = [];
          for (let c = 0; c < COLS; c++) seq.push(from + dir * c);
          seq.forEach((c, i) => {
            const x = box.x + CW * c;
            bullets.push(new Zone({
              x: x + 1, y: box.y, w: CW - 2, h: box.h, warn: CALL + i * STEP, life: STAB,
              paint(ctx, z) {
                if (z.age < z.warn) {
                  // The bird over this strip bobs its beak down just before it probes.
                  if (z.warn - z.age < 0.3) { ctx.globalAlpha = 1; ctx.fillStyle = '#d8c8a0'; ctx.fillRect(z.x + z.w / 2 - 1, z.y, 3, 5); }
                  return;
                }
                const k = Math.min(1, (z.age - z.warn) / 0.08);
                ctx.fillStyle = '#d8c8a0';
                ctx.fillRect(z.x + z.w / 2 - 1, z.y, 3, z.h * k);
                ctx.globalAlpha *= 0.3;
                ctx.fillRect(z.x, z.y, z.w, z.h * k);
              },
            }));
          });
        }
      },
    };
  },
};
