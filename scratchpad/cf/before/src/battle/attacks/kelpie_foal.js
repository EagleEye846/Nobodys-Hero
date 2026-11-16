import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { art } from '../../data/art/ch5Kit.js';
import { PathShot, Zone, Deco, shove, blit } from './coastKit.js';

// The Kelpie Foal's attacks. A young water-horse practising being
// frightening, all knees and mane:
//   - Practice laps: it gallops round the rim of the box, da-da-da-DUM: a
//     drop flicked in on each beat, a kick of spray at you on the fourth.
//   - Hurdles: it leaps, harmless in the air; only its shadow shows where it
//     will land, and it lands with a splash.
//   - Come for a ride: it tosses its head and then tugs everything toward
//     its kelp. Line up with a gap in the fronds before it pulls.
// It stands to the right of the box.

const KELP = { s: '#a8e8f0', S: '#e8fcff', c: '#68d0b4', C: '#3aa890', d: '#1f7868', K: '#4a7a2a', L: '#7ab040', l: '#a8d460', g: '#c8f0e0', k: '#12262a', h: '#2a3a3a', t: '#68d0b4', D: '#14584e', e: '#fff6c8' };

// A drop of water, flung: a teardrop pointing the way it flies, with a glint.
defineBulletArt('kelpDrop', {
  frames: [
    ['..ss...', '.sSSsc.', 'sSSSSsc', '.sSSsc.', '..ss...'],
    ['...ss..', '.sSSsc.', 'sSSSSsc', '.sSSsc.', '...ss..'],
  ],
  palette: KELP,
  radius: 1.9,
  rotate: true,
  frameSeconds: 0.14,
});

// Where a hoof will land (harmless): a hoofprint pressed in the wet, with a ring
// of ripple round it, flashing.
defineBulletArt('kelpHoof', {
  frames: [
    ['..ggggg..', '.g.....g.', 'g..ccc..g', 'g.c...c.g', 'g.c...c.g', 'g.c...c.g', '.g.c.c.g.', '..ggggg..'],
    ['.........', '..ggggg..', '.g.ccc.g.', '.gc...cg.', '.gc...cg.', '.gc...cg.', '..gc.cg..', '.........'],
  ],
  palette: KELP,
  radius: 1,
  frameSeconds: 0.12,
});

// The splash where a hoof came down (harmless): a crown of water, falling back.
defineBulletArt('kelpCrown', {
  frames: [
    ['s.S.s.S.s', '.sSsSsSs.', '..sSSSs..', '.ccccccc.'],
    ['.........', 's..S.S..s', '.s.sSs.s.', '.ccccccc.'],
    ['.........', '.........', '..s.s.s..', '..ccccc..'],
  ],
  palette: KELP,
  radius: 1,
  frameSeconds: 0.12,
});

// Foam off the top of a wave.
function foam() {
  const g = new Pix(8, 8);
  g.disc(3.5, 3.5, 3.6, 3.6, 's');
  g.disc(3, 3, 2.2, 2.2, 'S', 's');
  g.set(5, 5, 'c');
  g.set(2, 2, 'S');
  return g.rows();
}
defineBulletArt('kelpFoam', { frames: [foam()], palette: KELP, radius: 3.3, spin: 0.8 });

// A leaf of kelp, flung.
defineBulletArt('kelpLeaf', {
  frames: [['.KKK..', 'KLllLK', '.KKK..'], ['.KK...', 'KLlLLK', '.KKK..']],
  palette: KELP,
  radius: 2.2,
  rotate: true,
  frameSeconds: 0.2,
});

// Where the gap in a wave is (harmless): a bright bracket on the wall.
defineBulletArt('kelpGap', {
  frames: [['g.....g', '.......', '.......', '.......', 'g.....g'], ['c.....c', '.......', '.......', '.......', 'c.....c']],
  palette: KELP,
  radius: 1,
  frameSeconds: 0.12,
});

// The foal at full gallop, drawn pointing right: a streak of horse with weed streaming behind.
function rush() {
  const g = new Pix(24, 13);
  g.line(0, 5, 9, 4, 'K', 2);
  g.line(1, 8, 9, 6, 'L', 2);
  g.disc(13, 6.5, 6, 3.6, 'C');
  g.disc(13, 8, 5, 1.8, 'c', 'C');
  g.line(16, 5, 20, 3, 'C', 4);
  g.disc(21, 4, 2.8, 2.2, 'C');
  g.disc(23, 5, 1.2, 1.2, 'c');
  g.set(21, 3, 'e');
  g.line(18, 2, 19, 0, 'C', 2);
  g.line(10, 9, 7, 12, 'd', 2);
  g.line(16, 9, 19, 12, 'd', 2);
  g.line(12, 9, 11, 12, 'D', 2);
  g.outline('k');
  return g.rows();
}
// It gallops leftward across the box, so the art is turned to face that way.
defineBulletArt('kelpFoalRush', { frames: [rush().map((row) => [...row].reverse().join(''))], palette: KELP, hitbox: { w: 19, h: 8 }, radius: 4 });

// The foal galloping any way at all (drawn facing right), small enough for laps.
const RUSH = rush();
defineBulletArt('kelpLapper', { frames: [RUSH], palette: KELP, radius: 4.4, rotate: true });
// The foal in the air over a hurdle (harmless up there): legs tucked.
defineBulletArt('kelpAirborne', { frames: [RUSH], palette: KELP, radius: 1 });
// Its shadow on the ground under it.
defineBulletArt('kelpShadow', { frames: [['..ddddd..', '.ddddddd.', '..ddddd..']], palette: KELP, radius: 1 });
// A frond of kelp poking out of the wall it lives by.
const frond = art(13, 7, (p) => { p.line(0, 3, 12, 3, 'K', 2); p.line(3, 3, 6, 0, 'L'); p.line(6, 3, 9, 6, 'L'); p.line(9, 3, 12, 1, 'l'); });

export const KELPIE_FOAL_ATTACKS = {
  // Practice laps: it gallops round and round the edge of the box, keeping
  // to a proper gallop, da-da-da-DUM. On the first three beats a hoof
  // flicks up a drop; on the fourth it kicks a spray at you. Keep off the
  // rim, and count the beats.
  kelpLaps(box, density, { Shot, rand }) {
    const IN = 7;
    const L = box.x + IN;
    const R = box.x + box.w - IN;
    const U = box.y + IN;
    const D = box.y + box.h - IN;
    const W = R - L;
    const H = D - U;
    const LAP = 2 * (W + H);
    const SPEED = 72;
    const dir = Math.random() < 0.5 ? 1 : -1;
    const off = rand(0, LAP);
    const at = (k) => {
      let d = ((off + dir * SPEED * k) % LAP + LAP) % LAP;
      if (d < W) return { x: R - d, y: U, a: Math.PI * (dir > 0 ? 1 : 0) };
      d -= W;
      if (d < H) return { x: L, y: U + d, a: dir > 0 ? Math.PI / 2 : -Math.PI / 2 };
      d -= H;
      if (d < W) return { x: L + d, y: D, a: dir > 0 ? 0 : Math.PI };
      d -= W;
      return { x: R, y: D - d, a: dir > 0 ? -Math.PI / 2 : Math.PI / 2 };
    };
    const WARN = 0.6;
    const BEAT = 0.3;
    let real = 0;
    let n = 0;
    let made = false;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (!made) {
          made = true;
          bullets.push(new PathShot({ art: 'kelpLapper', warn: WARN, life: 6.4, path: at }));
        }
        if (real >= WARN + 0.3 + n * BEAT && n < 20) {
          n++;
          const p = at(real - WARN);
          if (n % 4) {
            // A drop flicked up and in, toward the middle of the box.
            const a = Math.atan2(box.y + box.h / 2 - p.y, box.x + box.w / 2 - p.x) + rand(-0.4, 0.4);
            bullets.push(new Shot({ x: p.x, y: p.y, vx: Math.cos(a) * 55, vy: Math.sin(a) * 55, art: 'kelpDrop', life: 1.6 }));
          } else {
            // DUM: a kick of spray straight at you.
            const a = Math.atan2(soul.y - p.y, soul.x - p.x);
            for (const o of [-0.22, 0, 0.22]) bullets.push(new Shot({ x: p.x, y: p.y, vx: Math.cos(a + o) * 70, vy: Math.sin(a + o) * 70, art: 'kelpDrop', warn: 0.2, life: 1.8 }));
          }
        }
      },
    };
  },

  // Hurdles: it leaps, and you can only see where it will come down by its
  // shadow on the ground, sliding along under it. Up in the air it's
  // harmless; where the shadow meets it, it lands with a splash. It leaps at
  // where you were when it took off, one leap after another.
  kelpLeap(box, density, { Shot }) {
    const LEAP = 0.85;
    const HOP = 30;
    let real = 0;
    let next = 0.15;
    let n = 0;
    let at = { x: box.x + box.w + 10, y: box.y + box.h / 2 };
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real < next || n >= 6) return;
        n++;
        const from = at;
        const to = { x: soul.x, y: soul.y };
        next = real + LEAP + 0.25;
        const ground = (k) => {
          const u = Math.min(1, k / LEAP);
          return { x: from.x + (to.x - from.x) * u, y: from.y + (to.y - from.y) * u };
        };
        bullets.push(new PathShot({ art: 'kelpShadow', harmless: true, life: LEAP, path: ground }));
        bullets.push(new PathShot({ art: 'kelpAirborne', harmless: true, life: LEAP, path: (k) => { const g = ground(k); return { x: g.x, y: g.y - Math.sin(Math.PI * Math.min(1, k / LEAP)) * HOP }; } }));
        // The landing.
        bullets.push(new Zone({ x: to.x, y: to.y, r: 8, warn: LEAP, life: 0.22, paint(ctx, z) {
          if (z.age < z.warn) return;
          blit(ctx, RUSH, KELP, z.x, z.y - 2);
        } }));
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2 + n * 0.4;
          bullets.push(new Shot({ x: to.x, y: to.y, vx: Math.cos(a) * 48, vy: Math.sin(a) * 48, art: 'kelpDrop', warn: LEAP, life: 1 }));
        }
        at = to;
      },
    };
  },

  // Come for a ride: it tosses its head (its mane flicks), and then tugs:
  // for a long moment everything in the box is drawn toward it, to the
  // right wall, where its kelp fronds poke out of the water. There are
  // gaps between the fronds, different each tug. Line up with a gap before
  // it pulls, or pull the other way.
  kelpLure(box, density, { rand }) {
    const T = (s) => s * density;
    const NOD = 0.8;
    const TUG = 1.0;
    const EVERY = 1.55;
    let t = 0;
    let n = 0;
    let tugEnd = -1;
    return {
      duration: 7,
      update: (dt, bullets, soul, real = dt / density) => {
        t += dt;
        if (t >= T(0.2 + n * EVERY) && n < 4) {
          n++;
          tugEnd = t + T(NOD + TUG);
          // Fronds along the right wall, with one wide gap (not where you are now).
          let gap;
          let tries = 0;
          do {
            gap = rand(box.y + 12, box.y + box.h - 12);
            tries++;
          } while (tries < 20 && Math.abs(gap - soul.y) < 18);
          for (let y = box.y + 5; y < box.y + box.h; y += 9) {
            if (Math.abs(y - gap) < 10) continue;
            const len = rand(14, 22);
            bullets.push(new Zone({ x: box.x + box.w - len, y: y - 3, w: len, h: 6, warn: NOD, life: TUG + 0.2, paint(ctx, z) {
              ctx.save();
              ctx.beginPath();
              ctx.rect(z.x, z.y - 2, z.w, z.h + 4);
              ctx.clip();
              blit(ctx, frond, KELP, z.x + z.w - 6, z.y + 3);
              ctx.restore();
            } }));
          }
          // The pull, shown as streaks running toward the right.
          bullets.push(new Deco({ warn: NOD, life: NOD + TUG, paint(ctx, d) {
            if (d.age < d.warn) return;
            ctx.strokeStyle = '#a8e8f0';
            ctx.globalAlpha *= 0.5;
            for (let i = 0; i < 6; i++) {
              const y = box.y + 7 + i * 13;
              const x = box.x + (((d.age - d.warn) * 120 + i * 29) % box.w);
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x + 8, y);
              ctx.stroke();
            }
          } }));
        }
        const k = tugEnd - t;
        if (k > 0 && k < T(TUG)) shove(soul, box, 56 * real, 0);
      },
    };
  },
};
