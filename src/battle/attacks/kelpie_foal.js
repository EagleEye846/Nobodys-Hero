import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { withSnipes } from './snipes.js';

// The Kelpie Foal's attacks. It's a young water-horse, so it's hooves and weed
// and water: hoof-stamps that throw rings of droplets (each ring has a gap, the
// second ring a different one), kelp whips that lash out along a line (the line
// shows first), a galloping wave of foam with a gap in it, and a charge along a
// row, shedding spray. It stands to the right of the box.

const KELP = { s: '#a8e8f0', S: '#e8fcff', c: '#68d0b4', C: '#3aa890', d: '#1f7868', K: '#4a7a2a', L: '#7ab040', l: '#a8d460', g: '#c8f0e0', k: '#12262a', h: '#2a3a3a', t: '#68d0b4', D: '#14584e', e: '#fff6c8' };

// A drop of water.
defineBulletArt('kelpDrop', {
  frames: [['.s.', 'sSs', 'sSs', '.s.'], ['.s.', 'sSs', '.s.', '...']],
  palette: KELP,
  radius: 1.9,
  frameSeconds: 0.14,
});

// Where a hoof will land (harmless): a pale crescent, flashing.
defineBulletArt('kelpHoof', {
  frames: [['.ggg.', 'g...g', 'g...g', '.....'], ['.....', '.ggg.', 'g...g', '.....']],
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

// The foal at full gallop, pointing right: a streak of horse with weed streaming behind.
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
defineBulletArt('kelpFoalRush', { frames: [rush()], palette: KELP, hitbox: { w: 19, h: 8 }, radius: 4 });

export const KELPIE_FOAL_ATTACKS = {
  // Stamps: a hoof comes down where you are (a crescent flashes there first) and
  // throws a ring of droplets with a gap in it, the gap turned toward you. A
  // slower ring follows with its gap a quarter turn round. Two stamps a round,
  // three rounds.
  kelpSplash(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let rounds = 0;
    let stamps = [];
    // `open` is the gap: how far either side of `gapAt` is left empty (a ring aimed
    // straight at you, the follow-up, has none).
    const ring = (bullets, p, speed, gapAt, warn = 0, open = 0) => {
      const N = 11;
      for (let k = 0; k < N; k++) {
        const a = (k / N) * Math.PI * 2;
        const off = Math.abs(((a - gapAt + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        if (off < open || off > Math.PI - 1.3) continue;
        bullets.push(new Shot({ x: p.x, y: p.y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, warn, art: 'kelpDrop', life: 1.6 }));
      }
    };
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (rounds < 3 && t >= 0.2 + rounds * 2.2) {
          // The hoof comes down a step off you, never right underfoot.
          const side = rand(0, Math.PI * 2);
          const near = { x: clamp(soul.x + Math.cos(side) * rand(16, 22), box.x + 10, box.x + box.w - 10), y: clamp(soul.y + Math.sin(side) * rand(16, 22), box.y + 10, box.y + box.h - 10) };
          const far = { x: rand(box.x + 10, box.x + box.w - 10), y: rand(box.y + 10, box.y + box.h - 10) };
          (rounds === 0 ? [near] : [near, far]).forEach((p, i) => {
            const warn = 0.7 + i * 0.5;
            bullets.push(new Shot({ x: p.x, y: p.y, harmless: true, life: warn, art: 'kelpHoof' }));
            stamps.push({ at: t + warn, p, near: i === 0 });
          });
          rounds++;
        }
        for (const s of stamps) {
          if (t < s.at) continue;
          s.done = true;
          const toSoul = Math.atan2(soul.y - s.p.y, soul.x - s.p.x);
          ring(bullets, s.p, 48, toSoul, 0, 0.8);
          if (s.near) ring(bullets, s.p, 34, toSoul + (s.p.x > soul.x ? 1 : -1) * 0.45, 0.4);
        }
        stamps = stamps.filter((s) => !s.done);
      },
    };
  },

  // Whips: kelp lashes out of its mane along the line to you (the line flickers
  // thin first), three at a time, a fan of them, and flings leaves where they
  // crack. Three lashes.
  kelpWhip(box, density, { Shot, Line, rand, clamp }) {
    let t = 0;
    let lashes = 0;
    let cracks = [];
    let whips = [];
    const heading = { x: 0, y: 0 };
    const seen = { x: null, y: null };
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (seen.x !== null && dt > 0) {
          heading.x = heading.x * 0.85 + ((soul.x - seen.x) / dt) * 0.15;
          heading.y = heading.y * 0.85 + ((soul.y - seen.y) / dt) * 0.15;
        }
        seen.x = soul.x;
        seen.y = soul.y;
        if (lashes < 3 && t >= 0.2 + lashes * 2.0) {
          const roots = [box.y + 14, box.y + box.h / 2, box.y + box.h - 14];
          roots.forEach((ry, i) => {
            const x = box.x + box.w + 8;
            const warn = 0.75 + i * 0.22;
            const line = new Line({ x, y: ry, angle: Math.PI, length: 150, thickness: 4, warn, life: 0.3, grow: 520, color: '#7ab040', glow: '#a8d460' });
            line.fan = (i - 1) * 0.2 * (lashes % 2 ? -1 : 1);
            line.root = { x, y: ry };
            whips.push(line);
            bullets.push(line);
            cracks.push({ line, done: false });
          });
          lashes++;
        }
        // Each lash tracks you (a little ahead of where you are heading) until a third of
        // a second before it goes, and then it is fixed: that is the line it lashes along.
        for (const line of whips) {
          if (line.age < line.warn - 0.3) {
            line.angle = Math.atan2(soul.y + heading.y * 0.3 - line.root.y, soul.x + heading.x * 0.3 - line.root.x) + line.fan;
          }
        }
        whips = whips.filter((line) => line.age < line.warn + line.life);
        for (const c of cracks) {
          if (c.line.age < c.line.warn + 0.2) continue;
          c.done = true;
          const ex = c.line.x + Math.cos(c.line.angle) * 100;
          const ey = c.line.y + Math.sin(c.line.angle) * 100;
          if (ex < box.x - 4 || ey < box.y - 4 || ey > box.y + box.h + 4) continue;
          for (const k of [-1, 1]) {
            const a2 = c.line.angle + k * 1.3;
            bullets.push(new Shot({ x: ex, y: ey, vx: Math.cos(a2) * 44, vy: Math.sin(a2) * 44, art: 'kelpLeaf', life: 1.1 }));
          }
        }
        cracks = cracks.filter((c) => !c.done);
      },
    };
  },

  // Wave: a wall of foam gallops across the box with a gap in it (the gap shows
  // on the wall first), then another a half-beat behind with the gap shifted. Four
  // waves, the gap never right on you.
  kelpWave(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let waves = 0;
    let prev = null;
    const GAP = 26;
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (waves >= 4 || t < 0.2 + waves * 1.75) return;
        let centre;
        if (waves % 2 === 0 || prev === null) {
          centre = soul.y + (Math.random() < 0.5 ? -1 : 1) * rand(16, 28);
        } else {
          centre = prev + (prev < box.y + box.h / 2 ? 1 : -1) * rand(20, 28);
        }
        centre = clamp(centre, box.y + GAP / 2 + 4, box.y + box.h - GAP / 2 - 4);
        prev = centre;
        const warn = 0.65;
        bullets.push(new Shot({ x: box.x + box.w - 3, y: centre, harmless: true, life: warn, art: 'kelpGap' }));
        for (let y = box.y + 3; y < box.y + box.h + 3; y += 7) {
          if (Math.abs(y - centre) < GAP / 2) continue;
          bullets.push(new Shot({ x: box.x + box.w + 5, y, vx: -96, warn, art: 'kelpFoam', life: 2.2 }));
        }
        waves++;
      },
    };
  },

  // Charge: it paws, then gallops along a row (the row flickers first), shedding
  // spray up and down as it goes. Three charges, each with a second foal a step
  // off your row, and the rows follow you until the last moment.
  kelpCharge(box, density, { Shot, Line, rand, clamp }) {
    let t = 0;
    let charges = 0;
    const offsets = [0, 0, 0];
    let runners = [];
    const heading = { y: 0 };
    let lastY = null;
    return {
      duration: 7.0,
      update: (dt, bullets, soul) => {
        t += dt;
        if (lastY !== null && dt > 0) heading.y = heading.y * 0.85 + ((soul.y - lastY) / dt) * 0.15;
        lastY = soul.y;
        if (charges < 3 && t >= 0.2 + charges * 1.9) {
          // One on your row, and a second a step off it (a different side each time).
          for (const offset of [0, charges % 2 ? 24 : -24]) {
            const y = clamp(soul.y + offset, box.y + 8, box.y + box.h - 8);
            const warn = 0.8;
            const guide = new Line({ x: box.x - 4, y, angle: 0, length: box.w + 8, thickness: 1, warn, life: 0, color: '#a8e8f0' });
            const print = new Shot({ x: box.x + box.w - 6, y, harmless: true, life: warn, art: 'kelpHoof' });
            const foal = new Shot({ x: box.x + box.w + 13, y, warn, art: 'kelpFoalRush', life: 2.4 });
            foal.shed = 0.15;
            foal.offset = offset;
            foal.guide = guide;
            foal.print = print;
            bullets.push(guide, print, foal);
            runners.push(foal);
          }
          charges++;
        }
        for (const r of runners) {
          // The row follows you until the last third of a second, then it is fixed.
          if (r.age < r.warn - 0.12) {
            const y = clamp(soul.y + r.offset + heading.y * 0.2, box.y + 8, box.y + box.h - 8);
            r.y = y;
            r.guide.y = y;
            r.print.y = y;
          }
          if (r.age < r.warn) continue;
          if (!r.launched) {
            r.launched = true;
            r.vx = -150;
          }
          r.shed -= dt;
          if (r.shed <= 0 && r.x > box.x + 6) {
            r.shed = 0.26;
            for (const dir of [-1, 1]) bullets.push(new Shot({ x: r.x + 6, y: r.y + dir * 3, vx: 14, vy: dir * 46, art: 'kelpDrop', life: 1.0 }));
          }
        }
        runners = runners.filter((r) => r.x > box.x - 20);
      },
    };
  },
};

// Flung kelp leaves, aimed ahead of you (see snipes.js): stamping alone left running one way safe.
KELPIE_FOAL_ATTACKS.kelpSplash = withSnipes(KELPIE_FOAL_ATTACKS.kelpSplash, { art: 'kelpLeaf', count: 3, first: 1.2, every: 1.8 });

// Aimed shots on top (see snipes.js): the whip and the charge alone left running one way safe.
KELPIE_FOAL_ATTACKS.kelpWhip = withSnipes(KELPIE_FOAL_ATTACKS.kelpWhip, { art: 'kelpLeaf', count: 5, first: 0.7, every: 1.0, lead: [0.9, 0, 'mean', 0.5, 0.9], until: 5.8 });
KELPIE_FOAL_ATTACKS.kelpCharge = withSnipes(KELPIE_FOAL_ATTACKS.kelpCharge, { art: 'kelpFoam', count: 4, first: 1.0, every: 1.3, lead: [0.9, 'mean', 0.5, 'mean'] });
