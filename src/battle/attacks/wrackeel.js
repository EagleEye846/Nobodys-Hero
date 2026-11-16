import { defineBulletArt } from '../projectiles.js';
import { PathShot, Deco, Guide, Zone, blit } from './coastKit.js';

// The Wrackeel's attacks. A long teal eel that lives in the half-drowned
// lanes and is wired wrong, crackling whenever it's cross:
//   - Hole to hole: it shoots out of one hole in the wall, across, and into a
//     hole on the far side; next time it comes out of the hole it went into.
//   - Current: it swims across in long waves with a spark running down its
//     body; when the spark reaches its tail it jumps off at you.
//   - Wet lanes: its head pokes in at the end of a lane, it swims the lane,
//     and the whole lane lights up just after it passes.
// It coils to the right of the box.

const EEL = { b: '#2f8fa8', B: '#1d5f78', y: '#fff06a', c: '#8ff0ff', w: '#ffffff', k: '#0f1b26' };

// A little eel dart pointing right, a spark for an eye.
defineBulletArt('eelDart', {
  frames: [
    ['...bb..y', 'bbbbbbby', '.BBBBBb.', '...BB...'],
    ['..bb...y', '.bbbbbby', 'bBBBBBb.', '..BB....'],
  ],
  palette: EEL,
  radius: 2.4,
  rotate: true,
  frameSeconds: 0.14,
});

// A spark: a yellow cross that fizzes.
defineBulletArt('eelSpark', {
  frames: [
    ['.y.', 'ywy', '.y.'],
    ['y.y', '.w.', 'y.y'],
  ],
  palette: EEL,
  radius: 1.8,
  frameSeconds: 0.08,
});

// A node of the chain: a bigger crackling ball (harmless until its link fires).
defineBulletArt('eelNode', {
  frames: [
    ['..c..', '.cyc.', 'cywyc', '.cyc.', '..c..'],
    ['.c.c.', 'cyyyc', '.ywy.', 'cyyyc', '.c.c.'],
  ],
  palette: EEL,
  radius: 1,
  frameSeconds: 0.1,
});

// A length of coiled eel: a scaly blue body with a pale belly, drawn pointing
// right (it turns to run along the ring), and a spark crawling down it.
defineBulletArt('eelCoil', {
  frames: [
    ['.BBBBB.', 'BbbbbbB', 'cccccyc', 'BbbbbbB', '.BBBBB.'],
    ['.BBBBB.', 'BbbbbbB', 'cyccccc', 'BbbbbbB', '.BBBBB.'],
  ],
  palette: { ...EEL, c: '#9ff4ff' },
  frameSeconds: 0.14,
  radius: 2.4,
  rotate: true,
});

// The head of the coil, pointing right: a jaw full of sparks and a hot eye.
defineBulletArt('eelCoilHead', {
  frames: [
    ['..BBBB...', '.BbbbyBB.', 'BbbbbbbbB', 'cccccwkwk', 'BbbbbbbB.', '.BBBBB...'],
    ['..BBBB...', '.BbbbwBB.', 'BbbbbbbbB', 'cccccyky.', 'BbbbbbbB.', '.BBBBB...'],
  ],
  palette: { ...EEL, c: '#9ff4ff' },
  frameSeconds: 0.1,
  radius: 2.4,
  rotate: true,
});

// The tip of its tail (it hurts like the rest of it).
defineBulletArt('eelCoilTail', {
  frames: [['.....', 'BBB..', 'bbbBB', 'BBB..', '.....']],
  palette: EEL,
  radius: 2.4,
  rotate: true,
});

// Where a surge will end up (harmless): a pair of sparks on the wall.
defineBulletArt('eelPlug', {
  frames: [
    ['y...y', '.y.y.', '..y..', '.y.y.', 'y...y'],
    ['.y.y.', 'y...y', '.....', 'y...y', '.y.y.'],
  ],
  palette: EEL,
  radius: 1,
  frameSeconds: 0.1,
});

// A hole in the wall it lives in: dark, and lit round the rim when it's coming out.
const HOLE = ['.BBB.', 'BkkkB', 'BkkkB', '.BBB.'];
const HOLE_LIT = ['.yyy.', 'ykkky', 'ykkky', '.yyy.'];

// A whole eel along a path: head, four lengths of body, a tail, each a beat
// behind the one in front, so it slides along the path like an eel.
function wholeEel(bullets, path, warn, life, lag = 0.045) {
  const parts = ['eelCoilHead', 'eelCoil', 'eelCoil', 'eelCoil', 'eelCoil', 'eelCoilTail'];
  parts.forEach((art, i) => bullets.push(new PathShot({ art, warn: warn + i * lag, life, path })));
}

export const WRACKEEL_ATTACKS = {
  // Hole to hole: there are holes in both side walls, and it lives in them.
  // It shoots out of one hole, straight across the box and into a hole on
  // the far side, and next time it comes out of the hole it last went into.
  // So you always know where it's coming from: the hole it went in by.
  eelHoles(box, density, { rand }) {
    const ys = [0.2, 0.5, 0.8].map((f) => box.y + box.h * f);
    const holes = [...ys.map((y) => ({ x: box.x + 2, y, side: 0 })), ...ys.map((y) => ({ x: box.x + box.w - 2, y, side: 1 }))];
    const GLOW = 0.55;
    const SPEED = 150;
    let real = 0;
    let next = 0.2;
    let n = 0;
    let made = false;
    let from = holes[3 + Math.floor(rand(0, 3))];
    let lit = null;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (!made) {
          made = true;
          bullets.push(new Deco({ life: 7, paint(ctx, d) {
            for (const h of holes) blit(ctx, h === lit && Math.floor(d.age * 10) % 2 ? HOLE_LIT : HOLE, EEL, h.x, h.y);
          } }));
        }
        if (real < next || n >= 6) return;
        n++;
        // Across to the far hole nearest your row.
        const far = holes.filter((h) => h.side !== from.side);
        let to = far[0];
        for (const h of far) if (Math.abs(h.y - soul.y) < Math.abs(to.y - soul.y)) to = h;
        const f = from;
        const secs = Math.hypot(to.x - f.x, to.y - f.y) / SPEED;
        const a = Math.atan2(to.y - f.y, to.x - f.x);
        lit = f;
        bullets.push(new Guide({ x: f.x, y: f.y, angle: a, length: Math.hypot(to.x - f.x, to.y - f.y), warn: GLOW, color: '#fff06a' }));
        wholeEel(bullets, (k) => {
          const u = Math.min(1, k / secs);
          return { x: f.x + (to.x - f.x) * u, y: f.y + (to.y - f.y) * u, a };
        }, GLOW, secs);
        from = to;
        next = real + GLOW + secs + 0.3;
      },
    };
  },

  // Current: it swims across the box in long waves, and a spark runs down
  // its body from head to tail. When the spark reaches the tip of its tail
  // it jumps off, straight at you. Watch the spark run down to the tail.
  eelCurrent(box, density, { Shot, rand }) {
    const SWIM = 2.4;
    const RUN = 0.55;
    const LAG = 0.06;
    let real = 0;
    let n = 0;
    let next = 0.15;
    const jumps = [];
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real >= next && n < 3) {
          n++;
          next = real + SWIM - 0.3;
          const y0 = rand(box.y + 18, box.y + box.h - 18);
          const right = n % 2 === 1;
          const x0 = right ? box.x + box.w + 10 : box.x - 10;
          const x1 = right ? box.x - 30 : box.x + box.w + 30;
          const amp = rand(12, 18);
          const path = (k) => {
            const u = k / SWIM;
            const x = x0 + (x1 - x0) * u;
            const y = y0 + Math.sin(u * Math.PI * 3) * amp;
            const dx = (x1 - x0) / SWIM;
            const dy = (Math.cos(u * Math.PI * 3) * amp * Math.PI * 3) / SWIM;
            return { x, y, a: Math.atan2(dy, dx) };
          };
          const WARN = 0.4;
          wholeEel(bullets, path, WARN, SWIM, LAG);
          // Sparks run head to tail; each leaves the tail when it gets there.
          for (let s = 0.2; s < SWIM - 0.6; s += 0.62) {
            const startK = s;
            bullets.push(new PathShot({ art: 'eelSpark', harmless: true, warn: WARN + startK, life: RUN, path: (k) => path(Math.max(0, startK + k - (k / RUN) * 5 * LAG)) }));
            jumps.push({ at: real + WARN + startK + RUN, path, k: startK + RUN - 5 * LAG });
          }
        }
        for (let i = jumps.length - 1; i >= 0; i--) {
          const j = jumps[i];
          if (real < j.at) continue;
          jumps.splice(i, 1);
          const p = j.path(Math.max(0, j.k));
          const a = Math.atan2(soul.y - p.y, soul.x - p.x);
          bullets.push(new Shot({ x: p.x, y: p.y, vx: Math.cos(a) * 85, vy: Math.sin(a) * 85, art: 'eelSpark', warn: 0.12, life: 1.3 }));
        }
      },
    };
  },

  // Wet lanes: the floor's awash in lanes, and it swims along them. Its head
  // pokes in at the end of a lane first; then it swims the length of it,
  // and the lane it swam through lights up behind it, the whole lane, for a
  // moment. Keep off the lane it's in, and off it just after, too.
  eelLanes(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const LANES = 5;
    const LH = box.h / LANES;
    const PEEK = 0.45;
    const SPEED = 140;
    const SHOCK = 0.45;
    let t = 0;
    let n = 0;
    let made = false;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!made) {
          made = true;
          bullets.push(new Deco({ life: 7, paint(ctx) {
            ctx.globalAlpha *= 0.18;
            ctx.fillStyle = '#2f8fa8';
            for (let i = 0; i < LANES; i += 2) ctx.fillRect(box.x, box.y + i * LH, box.w, LH);
          } }));
        }
        if (t >= T(0.2 + n * 0.8) && n < 7) {
          n++;
          const mine = Math.min(LANES - 1, Math.max(0, Math.floor((soul.y - box.y) / LH)));
          const lane = n % 2 ? mine : Math.floor(rand(0, LANES));
          const y = box.y + (lane + 0.5) * LH;
          const right = Math.random() < 0.5;
          const x0 = right ? box.x + box.w + 8 : box.x - 8;
          const x1 = right ? box.x - 40 : box.x + box.w + 40;
          const secs = Math.abs(x1 - x0) / SPEED;
          const a = right ? Math.PI : 0;
          bullets.push(new Shot({ x: right ? box.x + box.w - 3 : box.x + 3, y, harmless: true, life: PEEK, art: 'eelPlug' }));
          wholeEel(bullets, (k) => ({ x: x0 + (x1 - x0) * Math.min(1, k / secs), y, a }), PEEK, secs, 0.05);
          // The lane lights once the eel has gone right through it.
          const lit = PEEK + (box.w + 16) / SPEED + 0.05;
          bullets.push(new Zone({ x: box.x, y: box.y + lane * LH + 1, w: box.w, h: LH - 2, warn: lit, life: SHOCK, paint(ctx, z) {
            if (z.age < z.warn) return;
            ctx.globalAlpha *= Math.floor(z.age * 20) % 2 ? 0.7 : 0.45;
            ctx.fillStyle = '#fff06a';
            ctx.fillRect(z.x, z.y, z.w, z.h);
          } }));
        }
      },
    };
  },
};
