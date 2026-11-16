import { defineBulletArt, Line } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { Ring } from './underShapes.js';
import { PathShot, Deco, Zone } from './coastKit.js';

// The Deckhand's attacks. A young sailor of the Fair Return, still on watch,
// still doing his round of the ship's chores a hundred years after there was
// anyone to do them for, and every chore done a little too hard:
//   - Bilge pump: on every downstroke of the pump handle, water spurts from
//     the next scupper round the ship's side, aimed at you. The next one
//     along is always the next to go.
//   - Watch bells: every stroke of the ship's bell is a bilge bucket slung
//     at where you are; count the strokes, mind the shadows.
//   - The letter home: letters drift down, and when one touches the deck it
//     opens and its words lift off the page and rise back up the box.
// He stands to the right of the box. Nothing is meant unkindly.

const P = {
  k: '#14212a', w: '#f0f6f2', W: '#a4c4c4', r: '#d8d0b4', R: '#8c8468', m: '#b04a3a', M: '#6a2a26',
  b: '#7aa8b4', B: '#456e7e', y: '#b49c68', Y: '#74603a', e: '#e8f4ff', i: '#7a8a90', I: '#454e54', n: '#c8a040', N: '#80601c',
  c: '#bfeaf0', C: '#7cc4d4',
};

// A sealed letter: cream paper, a fold, a red wax seal. It drifts and turns.
const letter = (tilt) => art(11, 9, (p) => {
  p.rect(1, 1, 9, 7, 'r');
  p.rect(1, 1, 9, 1, 'w');
  p.line(1, 2, 5, 5, 'R');
  p.line(9, 2, 5, 5, 'R');
  p.rect(4, 4, 3, 3, 'm');
  p.set(5, 5, 'M');
  p.set(tilt ? 9 : 1, 7, 'R');
});
defineBulletArt('deckLetter', { frames: [letter(0), letter(1)], palette: P, radius: 4, frameSeconds: 0.35, spin: 0.9 });

// A wax seal that has come off its letter and drops like a stone.
defineBulletArt('deckSeal', {
  frames: [art(8, 8, (p) => { p.ellipse(3.5, 3.5, 3.2, 3.2, 'm'); p.ellipse(3.5, 3.5, 1.8, 1.8, 'M'); p.set(2, 2, 'w'); })],
  palette: P,
  radius: 3,
  spin: 3,
});

// The bilge bucket: a tin pail on a rope handle, slopping.
defineBulletArt('deckBucket', {
  frames: [art(11, 11, (p) => {
    p.poly([[1, 3], [9, 3], [8, 9], [2, 9]], 'i');
    p.rect(1, 3, 9, 1, 'w');
    p.rect(2, 4, 2, 5, 'e');
    p.rect(2, 8, 7, 1, 'I');
    p.line(1, 3, 5, 0, 'y');
    p.line(9, 3, 5, 0, 'y');
    p.set(4, 2, 'c');
    p.set(6, 2, 'C');
  })],
  palette: P,
  radius: 4.6,
  spin: 4,
});

// A drop of slopped bilge water.
defineBulletArt('deckDrop', {
  frames: [
    art(5, 7, (p) => { p.set(2, 0, 'C'); p.rect(1, 1, 3, 4, 'c'); p.set(2, 2, 'w'); p.set(2, 5, 'B'); }),
    art(5, 6, (p) => { p.rect(1, 1, 3, 4, 'C'); p.set(2, 2, 'c'); p.set(2, 0, 'B'); }),
  ],
  palette: P,
  radius: 2.2,
  frameSeconds: 0.2,
});

// The ship's bell, a pip showing where a toll starts (harmless).
defineBulletArt('deckBell', {
  frames: [
    art(13, 12, (p) => { p.poly([[2, 9], [3, 3], [6, 1], [9, 3], [10, 9]], 'n'); p.rect(1, 9, 11, 2, 'N'); p.line(4, 3, 4, 8, 'w'); p.set(6, 11, 'i'); }),
    art(13, 12, (p) => { p.poly([[2, 8], [3, 2], [6, 0], [9, 2], [10, 8]], 'n'); p.rect(1, 8, 11, 2, 'N'); p.line(5, 2, 5, 7, 'w'); p.set(7, 10, 'i'); }),
  ],
  palette: P,
  radius: 1,
  frameSeconds: 0.14,
});

// A scrap of rag torn off the mop (the swab's spatter).
defineBulletArt('deckRag', {
  frames: [
    art(7, 4, (p) => { p.rect(0, 1, 6, 2, 'r'); p.set(5, 0, 'R'); p.set(1, 3, 'R'); }),
    art(7, 4, (p) => { p.rect(1, 1, 6, 2, 'R'); p.set(0, 0, 'r'); }),
  ],
  palette: P,
  radius: 2.6,
  frameSeconds: 0.2,
  rotate: true,
});

// The words of the letter, lifting off the page: a few capitals, 5x5.
const GLYPHS = {
  D: ['rrrr.', 'r...r', 'r...r', 'r...r', 'rrrr.'],
  E: ['rrrrr', 'r....', 'rrrr.', 'r....', 'rrrrr'],
  A: ['.rrr.', 'r...r', 'rrrrr', 'r...r', 'r...r'],
  R: ['rrrr.', 'r...r', 'rrrr.', 'r..r.', 'r...r'],
  M: ['r...r', 'rr.rr', 'r.r.r', 'r...r', 'r...r'],
  U: ['r...r', 'r...r', 'r...r', 'r...r', '.rrr.'],
  H: ['r...r', 'r...r', 'rrrrr', 'r...r', 'r...r'],
  O: ['.rrr.', 'r...r', 'r...r', 'r...r', '.rrr.'],
  S: ['.rrrr', 'r....', '.rrr.', '....r', 'rrrr.'],
  N: ['r...r', 'rr..r', 'r.r.r', 'r..rr', 'r...r'],
};
for (const [ch, rows] of Object.entries(GLYPHS)) {
  defineBulletArt(`deckGlyph${ch}`, { frames: [rows.map((r) => r.replace(/r/g, 'w')), rows.map((r) => r.replace(/r/g, 'W'))], palette: P, radius: 2.6, frameSeconds: 0.2 });
}
const WORDS = ['DEAR', 'MUM', 'HOME', 'SOON', 'DEAR', 'SON'];

// A hole in the ship's side (harmless): a dark scupper with a wet lip.
defineBulletArt('deckScupper', { frames: [['.iii.', 'iIkIi', 'iIkIi', '.iii.']], palette: P, radius: 1 });
// The shadow where a slung bucket will come down.
defineBulletArt('deckShadow', { frames: [['..BBB..', '.BBBBB.', '..BBB..']], palette: P, radius: 1 });

export const GHOST_DECKHAND_ATTACKS = {
  // Bilge pump: he works the pump handle up and down (on the right wall of the
  // box), and on every downstroke bilge water spurts from the next scupper
  // round the ship's side, in order: along the floor, then up the far wall,
  // then along the top. Each spurt is aimed at you; the scupper it comes
  // from winks first, and the next one along is always the next to go.
  deckPump(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const holes = [];
    for (let i = 0; i < 4; i++) holes.push({ x: box.x + box.w - 10 - i * 20, y: box.y + box.h - 1 });
    for (let i = 0; i < 4; i++) holes.push({ x: box.x + 1, y: box.y + box.h - 10 - i * 20 });
    for (let i = 0; i < 4; i++) holes.push({ x: box.x + 10 + i * 20, y: box.y + 1 });
    const STROKE = 0.62;
    let t = 0;
    let n = 0;
    let made = false;
    const start = Math.floor(rand(0, 12));
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!made) {
          made = true;
          for (const h of holes) {
            const s = new Shot({ x: h.x, y: h.y, harmless: true, art: 'deckScupper' });
            s.life = 7;
            bullets.push(s);
          }
          // The pump handle, rocking.
          bullets.push(new Deco({ life: 7, paint(ctx, d) {
            const a = Math.sin((d.age / STROKE) * Math.PI * 2) * 0.5;
            const x = box.x + box.w - 4;
            const y = box.y + box.h / 2 - 9;
            ctx.strokeStyle = '#14212a';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(x, y + 18);
            ctx.lineTo(x, y);
            ctx.lineTo(x + Math.cos(a - 2.4) * 14, y + Math.sin(a - 2.4) * 14);
            ctx.stroke();
            ctx.strokeStyle = '#b49c68';
            ctx.lineWidth = 2;
            ctx.stroke();
          } }));
        }
        if (t >= T(0.3 + n * STROKE) && n < 10) {
          const h = holes[(start + n) % holes.length];
          n++;
          const WARN = 0.55;
          bullets.push(new Shot({ x: h.x, y: h.y, harmless: true, life: WARN, art: 'deckDrop' }));
          const aim = Math.atan2(soul.y - h.y, soul.x - h.x);
          bullets.push(new Line({ x: h.x, y: h.y, angle: aim, length: 110, thickness: 5, warn: WARN, life: 0.32, grow: 320, color: '#bfeaf0', glow: '#7cc4d4' }));
        }
      },
    };
  },

  // Watch bells: he strikes the ship's bell the way the watch is kept, in
  // pairs, and every stroke of the bell is a bilge bucket slung at where you
  // are that moment. A shadow marks where each will come down, and it lands
  // in a splash of drops. Count the strokes: that's how many are in the air.
  deckBells(box, density, { Shot }) {
    const T = (s) => s * density;
    const strikes = [0.3, 0.6, 1.6, 1.9, 2.9, 3.2, 4.2, 4.5, 5.3];
    const FLY = 0.95;
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (n < strikes.length && t >= T(strikes[n])) {
          n++;
          const from = { x: box.x + box.w + 8, y: box.y + 4 };
          const to = { x: soul.x, y: soul.y };
          bullets.push(new Shot({ x: box.x + box.w - 7, y: box.y + 7, harmless: true, life: 0.3, art: 'deckBell' }));
          bullets.push(new Shot({ x: to.x, y: to.y + 3, harmless: true, life: FLY, art: 'deckShadow' }));
          // The bucket, high in an arc (harmless in the air), hurting where it lands.
          bullets.push(new PathShot({
            art: 'deckBucket', harmless: true, life: FLY,
            path: (k) => {
              const u = Math.min(1, k / FLY);
              return { x: from.x + (to.x - from.x) * u, y: from.y + (to.y - from.y) * u - Math.sin(Math.PI * u) * 26 };
            },
          }));
          bullets.push(new Zone({ x: to.x, y: to.y, r: 7, warn: FLY, life: 0.2, paint(ctx, z) {
            if (z.age < z.warn) return;
            ctx.fillStyle = '#bfeaf0';
            ctx.beginPath();
            ctx.arc(z.x, z.y, 7, 0, Math.PI * 2);
            ctx.fill();
          } }));
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 + n;
            bullets.push(new Shot({ x: to.x, y: to.y, vx: Math.cos(a) * 46, vy: Math.sin(a) * 46, art: 'deckDrop', warn: FLY, life: 1.1 }));
          }
        }
      },
    };
  },

  // The letter home: he holds out the letter he never posted, and more of
  // them come drifting down. When a letter touches the deck it opens, and
  // the words lift off the page and rise back up the box, one letter after
  // another. One comes down over you each time.
  deckLetters(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const FALL = 40;
    const pending = [];
    let t = 0;
    let rt = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        rt += dt / density;
        for (let i = pending.length - 1; i >= 0; i--) {
          const g = pending[i];
          if (rt < g.at) continue;
          pending.splice(i, 1);
          bullets.push(new Shot({ x: g.x, y: box.y + box.h - 4, vy: -62, art: `deckGlyph${g.ch}`, warn: 0.12, life: 1.6 }));
        }
        if (t >= T(0.2 + n * 0.95) && n < 6) {
          n++;
          const xs = [soul.x + rand(-4, 4), rand(box.x + 8, box.x + box.w - 8)];
          for (const x0 of xs) {
            const x = Math.min(Math.max(x0, box.x + 8), box.x + box.w - 8);
            const y0 = box.y - 6;
            const land = (box.y + box.h - 4 - y0) / FALL;
            bullets.push(new PathShot({ art: 'deckLetter', warn: 0.35, life: land, path: (k) => ({ x: x + Math.sin(k * 4) * 3, y: y0 + FALL * k }) }));
            const word = WORDS[(n + xs.indexOf(x0)) % WORDS.length];
            // Bullets made as the letter lands (so they don't sit stacked on the deck before).
            [...word].forEach((ch, i) => pending.push({ at: rt + 0.35 + land + i * 0.17, x, ch }));
          }
        }
      },
    };
  },
};
