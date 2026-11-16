import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { PathShot, Deco, Zone, Tether, blit } from './coastKit.js';

// The Whelkling's attacks. A hermit crab in a great whelk shell far too
// big for it, crusted with glowing anemones, and it has very strong feelings
// about shells:
//   - Shell shopping: empty shells lie about, and it hops into them biggest
//     first, landing with a crunch of grit.
//   - Topple: the shell is too big to keep up. It leans (the shadow grows the
//     way it leans) and falls that way.
//   - Anemone clock: a ring of anemones round you goes off one after another
//     like the hand of a clock, each stinging in at the middle.
// It sits to the right of the box.

const WK = {
  k: '#141a1c', s: '#b8ac94', S: '#d8ceb4', d: '#8a7e68', D: '#5a4a3a', c: '#b0563a', C: '#d8805a', q: '#7a3424',
  n: '#4e7e70', N: '#8ad0b8', g: '#c8ffe8', e: '#fff6e0', w: '#ffffff', b: '#a8d8e0', B: '#e8fcff',
};

// An anemone budding in the box (harmless): a little glowing crown, pulsing brighter.
defineBulletArt('whelkBud', {
  frames: [
    ['.......', '..n.n..', '.nNgNn.', '..nNn..', '...n...'],
    ['..g.g..', '.gN.Ng.', '.nNgNn.', '..nNn..', '...n...'],
  ],
  palette: WK,
  radius: 1,
  frameSeconds: 0.14,
});

// The bud by you, ripe and about to open (harmless): its arms all out, bright.
defineBulletArt('whelkBudRipe', {
  frames: [[
    'C...C...C',
    '.g..g..g.',
    '..gNgNg..',
    'C.NgwgN.C',
    '..gNgNg..',
    '.g..g..g.',
    'C...C...C',
  ]],
  palette: WK,
  radius: 1,
});

// An anemone's stinging arm, flung out: a pale-green whip with a glowing tip (drawn flying right).
defineBulletArt('whelkSting', {
  frames: [['nnN.', '.NNg', 'nnN.'], ['.nN.', 'nNNg', '.nN.']],
  palette: WK,
  radius: 1.8,
  rotate: true,
  frameSeconds: 0.12,
});

// Where the shell will spin from (harmless): a little whorl of shell, turning.
defineBulletArt('whelkWhorl', {
  frames: [['..sSs..', '.s...S.', 's..dd.S', 'S.d..dS', 'S..d..s', '.S...s.', '..sSs..']],
  palette: WK,
  radius: 1,
  spin: 4,
});

// A chip of shell, thrown off as it spins.
defineBulletArt('whelkGrit', { frames: [['.S.', 'sSd', '.dD']], palette: WK, radius: 1.7, spin: 5 });

// Half the big claw, open, coming at you (drawn pointing right).
function clawHalf() {
  const g = new Pix(13, 9);
  g.line(0, 4, 4, 4, 'q', 3);
  g.disc(6, 4, 3.4, 3.2, 'c');
  g.disc(5, 3, 1.6, 1.2, 'C', 'c');
  g.line(8, 2, 12, 0, 'c', 2);
  g.line(8, 6, 12, 8, 'q', 2);
  g.set(12, 0, 'C');
  g.outline('k');
  return g.rows();
}
defineBulletArt('whelkClaw', { frames: [clawHalf()], palette: WK, radius: 3.6, rotate: true });

// Where the claw will pinch (harmless): a little pincer mark on the wall.
defineBulletArt('whelkNip', { frames: [['c...c', '.c.c.', '..q..'], ['C...C', '.c.c.', '..q..']], palette: WK, radius: 1, frameSeconds: 0.12 });

// A bubble out of the pinch.
defineBulletArt('whelkBubble', { frames: [['.bb.', 'b..B', 'b..b', '.bb.'], ['.bb.', 'b.B.', 'b..b', '.bb.']], palette: WK, radius: 2, frameSeconds: 0.2 });

// The great whelk shell itself, rolling (it spins as it goes): pale whorls
// round a dark mouth, a couple of glowing anemones stuck on.
function shellRoll() {
  const g = new Pix(13, 13);
  g.disc(6, 6, 6, 6, 's');
  g.disc(6, 6, 4.4, 4.4, 'S', 's');
  g.disc(7, 5, 3, 3, 'd', 'S');
  g.disc(7, 5, 1.6, 1.6, 'S', 'd');
  g.set(7, 5, 'D');
  g.line(1, 8, 4, 11, 'd');
  g.set(3, 3, 'N');
  g.set(10, 9, 'N');
  g.set(9, 2, 'g');
  g.outline('k');
  return g.rows();
}
defineBulletArt('whelkShell', { frames: [shellRoll()], palette: WK, radius: 5.2, spin: 7 });

// An empty shell lying about, small, middling or big (harmless: it's waiting).
const emptyShell = (r) => {
  const g = new Pix(r * 2 + 3, r * 2 + 3);
  const c = r + 1;
  g.disc(c, c, r, r * 0.8, 's');
  g.disc(c + 1, c, r * 0.55, r * 0.45, 'D', 's');
  g.line(c - r + 1, c, c - 1, c - r * 0.6, 'd');
  g.outline('k');
  return g.rows();
};
const SHELLS = [emptyShell(3), emptyShell(4.5), emptyShell(6)];
// The crab out of its shell, mid-hop: little and pink, all legs.
defineBulletArt('whelkCrab', { frames: [[' c.c.c ', 'cCCCCCc', '.CkCkC.', 'c.c.c.c'].map((r) => r.replace(/ /g, '.'))], palette: WK, radius: 1 });
// An anemone, shut, then lit up and about to sting.
const ANEMONE = ['.n.n.', 'nNnNn', '.nNn.'];
const ANEMONE_LIT = [['g.g.g', '.gwg.', 'gNwNg', '.gNg.'], ['.N.N.', 'NgNgN', '.gwg.', '..g..']];

export const WHELKLING_ATTACKS = {
  // Shell shopping: it's never happy with its shell, so there are empty
  // ones lying about, a small, a middling and a big one, and it hops into
  // them biggest first, landing with a crunch that throws grit. Then more
  // wash up. It always tries the biggest next.
  whelkShells(box, density, { Shot, rand }) {
    const HOP = 0.38;
    const TRY = 0.2;
    let real = 0;
    let wave = 0;
    let queue = [];
    let at = { x: box.x + box.w + 8, y: box.y + box.h - 10 };
    let ready = 0.3;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (!queue.length && wave < 7 && real >= ready) {
          wave++;
          // Three shells: the big one near you, the others about.
          const spots = [{ x: soul.x + rand(-6, 6), y: soul.y + rand(-6, 6) }];
          for (let guard = 0; spots.length < 3 && guard < 300; guard++) {
            const s = { x: rand(box.x + 9, box.x + box.w - 9), y: rand(box.y + 9, box.y + box.h - 9) };
            if (spots.every((o) => Math.hypot(o.x - s.x, o.y - s.y) > 22)) spots.push(s);
          }
          const SHOW = 0.35;
          queue = spots.map((s, i) => ({ x: Math.min(Math.max(s.x, box.x + 8), box.x + box.w - 8), y: Math.min(Math.max(s.y, box.y + 8), box.y + box.h - 8), size: 2 - i }));
          let when = real + SHOW;
          let from = at;
          queue.forEach((q, i) => {
            const start = when - real;
            const f = from;
            const life = start + HOP + (i < 2 ? TRY : 0.6);
            bullets.push(new Deco({ x: q.x, y: q.y, life, paint(ctx, d) { blit(ctx, SHELLS[q.size], WK, d.x, d.y); } }));
            bullets.push(new PathShot({ art: 'whelkCrab', harmless: true, warn: start, life: HOP, path: (k) => { const u = Math.min(1, k / HOP); return { x: f.x + (q.x - f.x) * u, y: f.y + (q.y - f.y) * u - Math.sin(Math.PI * u) * 16 }; } }));
            const r = [5, 7, 9][q.size];
            bullets.push(new Zone({ x: q.x, y: q.y, r, warn: start + HOP, life: TRY, paint() {} }));
            for (let j = 0; j < 12; j++) {
              const a = (j / 12) * Math.PI * 2 + i;
              bullets.push(new Shot({ x: q.x, y: q.y, vx: Math.cos(a) * 80, vy: Math.sin(a) * 80, art: 'whelkGrit', warn: start + HOP, life: 0.9 }));
            }
            from = q;
            when += HOP + TRY;
          });
          at = from;
          ready = when;
          queue = [];
        }
      },
    };
  },

  // Topple: its shell is far too big for it, and it can't keep it up. It
  // sets the shell down by you and the shell leans (a shadow stretches out
  // the way it's leaning, longer and darker), then over it goes with a
  // crunch along the shadow. It always falls the way it leans.
  whelkTopple(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const LEAN = 0.45;
    const LEN = 52;
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + n * 0.4) && n < 15) {
          n++;
          // The base a little way from you, leaning across where you are.
          const a0 = rand(0, Math.PI * 2);
          const bx = Math.min(Math.max(soul.x + Math.cos(a0) * 20, box.x + 6), box.x + box.w - 6);
          const by = Math.min(Math.max(soul.y + Math.sin(a0) * 20, box.y + 6), box.y + box.h - 6);
          const a = Math.atan2(soul.y - by, soul.x - bx);
          const ex = bx + Math.cos(a) * LEN;
          const ey = by + Math.sin(a) * LEN;
          bullets.push(new Deco({ life: LEAN, paint(ctx, d) {
            const g = d.age / LEAN;
            ctx.globalAlpha *= 0.2 + 0.4 * g;
            ctx.strokeStyle = '#5a4a3a';
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + Math.cos(a) * LEN * (0.3 + 0.7 * g), by + Math.sin(a) * LEN * (0.3 + 0.7 * g));
            ctx.stroke();
            ctx.globalAlpha = 1;
            blit(ctx, SHELLS[2], WK, bx + Math.cos(a) * 3 * g, by + Math.sin(a) * 3 * g);
          } }));
          bullets.push(new Tether({ warn: LEAN, life: 0.35, thick: 20, color: '#d8ceb4', dark: '#5a4a3a', ends: () => [bx, by, ex, ey] }));
          for (const side of [-1, 1]) {
            for (const f of [0.25, 0.5, 0.75, 1]) {
              const px = bx + Math.cos(a) * LEN * f;
              const py = by + Math.sin(a) * LEN * f;
              const b = a + side * Math.PI / 2;
              bullets.push(new Shot({ x: px, y: py, vx: Math.cos(b) * 62, vy: Math.sin(b) * 62, art: 'whelkGrit', warn: LEAN, life: 0.9 }));
            }
          }
        }
      },
    };
  },

  // Anemone clock: it plants a ring of its glowing anemones round you, and
  // they go off one after another round the ring, like the hand of a clock:
  // each glows, then stings all round itself and flicks a sting in at the
  // middle. Slip out between two that have already gone.
  whelkClock(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const COUNT = 8;
    const STEP = 0.1;
    const GLOW = 0.28;
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + n * 0.85) && n < 7) {
          n++;
          const cx = Math.min(Math.max(soul.x, box.x + 18), box.x + box.w - 18);
          const cy = Math.min(Math.max(soul.y, box.y + 18), box.y + box.h - 18);
          const R = 17;
          const start = rand(0, Math.PI * 2);
          const turn = Math.random() < 0.5 ? 1 : -1;
          for (let i = 0; i < COUNT; i++) {
            const a = start + turn * (i / COUNT) * Math.PI * 2;
            const x = cx + Math.cos(a) * R;
            const y = cy + Math.sin(a) * R;
            const go = 0.4 + i * STEP + GLOW;
            bullets.push(new Deco({ x, y, life: go, paint(ctx, d) {
              const lit = d.age >= go - GLOW;
              blit(ctx, lit ? (Math.floor(d.age * 14) % 2 ? ANEMONE_LIT[0] : ANEMONE_LIT[1]) : ANEMONE, WK, d.x, d.y);
            } }));
            bullets.push(new Zone({ x, y, r: 10, warn: go, life: 0.3, paint(ctx, z) { if (z.age >= z.warn) { ctx.strokeStyle = '#c8ffe8'; ctx.beginPath(); ctx.arc(z.x, z.y, 10, 0, Math.PI * 2); ctx.stroke(); } } }));
            const inward = Math.atan2(cy - y, cx - x);
            for (const o of [-0.25, 0, 0.25]) bullets.push(new Shot({ x, y, vx: Math.cos(inward + o) * 85, vy: Math.sin(inward + o) * 85, art: 'whelkSting', warn: go, life: 0.9 }));
          }
        }
      },
    };
  },
};
