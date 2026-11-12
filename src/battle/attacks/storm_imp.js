import { defineBulletArt } from '../projectiles.js';
import { withSnipes } from './snipes.js';

// The Storm Imp's attacks. It is a little thundercloud, and it plays with
// weather the way a child plays with a hose: forks of lightning (every one
// flickers thin first, and the flicker is the exact path), a rain of streaks
// (the ones aimed at you tick first), gusts that push you across the box while
// puffs and paper boats blow past, and crackling balls that bounce off the
// walls. It stands above and to the right of the box.

const STORM = { c: '#86a294', C: '#b4ccbe', d: '#54706a', k: '#18242a', y: '#fff06a', Y: '#ffc83a', w: '#ffffff', r: '#8fd0ff', R: '#4a8ac8', p: '#e8e0c8', P: '#b8b098' };

// A streak of rain, pointing the way it falls.
defineBulletArt('impRain', { frames: [['.RRrrrw.', 'RRrrrww.', '.RRrrrw.'].map((r, i) => (i === 1 ? r : r.replace(/R/g, '.')))], palette: STORM, radius: 1.5, rotate: true });

// Where a drop hits the floor (harmless): a little splash.
defineBulletArt('impSplash', {
  frames: [['r.....r', '.r.r.r.', '..RRR..'], ['.......', 'r..r..r', '.RRRRR.']],
  palette: STORM,
  radius: 1,
  frameSeconds: 0.1,
});

// The storm cloud it rains from, along the top of the box (harmless): grey
// puffs with a dark belly.
defineBulletArt('impCloud', {
  frames: [[
    '....cccc.....ccc....',
    '..ccCCCCcc.ccCCCcc..',
    '.cCCCCccccccCCcccccc',
    'cccccccccccccccccccc',
    'cddcdddcddddcdddcddc',
    '.dd.ddd..dd.ddd..dd.',
  ]],
  palette: STORM,
  radius: 1,
});

// A little spark (where a bolt lands, where an orb bounces).
defineBulletArt('impSpark', {
  frames: [['.y.', 'ywy', '.y.'], ['y.y', '.w.', 'y.y']],
  palette: STORM,
  radius: 1.7,
  frameSeconds: 0.08,
});

// The top of a bolt, before it falls (harmless): a tiny dark cloud with a yellow eye.
defineBulletArt('impMark', {
  frames: [
    ['.ccc.', 'cCcCc', 'cdydc', '.ccc.'],
    ['.ccc.', 'cCcCc', 'cdwdc', '.ccc.'],
  ],
  palette: STORM,
  radius: 1,
  frameSeconds: 0.1,
});

// An arrow that shows which way the gust will blow (harmless).
defineBulletArt('impArrow', {
  frames: [['...w...', '....w..', 'wwwwwww', '....w..', '...w...'], ['....w..', '.....w.', 'wwwwwww', '.....w.', '....w..']],
  palette: STORM,
  radius: 1,
  rotate: true,
  frameSeconds: 0.15,
});

// A puff of cloud blowing past.
defineBulletArt('impPuff', {
  frames: [['..ccc..', '.cCCcc.', 'cCCcccc', 'ccccddc', '.cddcc.', '..ccc..']],
  palette: STORM,
  radius: 3,
});

// A paper boat, blown off something (the storm's a boy's, and he made boats).
defineBulletArt('impBoat', {
  frames: [['..p....', '.ppp.pp', 'pppppPp', '.PPPPP.']],
  palette: STORM,
  radius: 2.6,
  spin: 4,
});

// A ball of lightning: crackling, spiky.
defineBulletArt('impOrb', {
  frames: [
    ['..y.y..', '.yYwYy.', 'yYwwwYy', '.yYwYy.', '..y.y..'],
    ['.y...y.', '..YYY..', 'yYwwwYy', '..YYY..', '.y...y.'],
  ],
  palette: STORM,
  radius: 3.4,
  frameSeconds: 0.07,
});

// A jagged bolt from the top of the box to the bottom, as a list of Lines.
function bolt(Line, x, box, warn, rand, width = 5.5) {
  const lines = [];
  const steps = 6;
  let px = x;
  let py = box.y - 4;
  for (let i = 1; i <= steps; i++) {
    const nx = i === steps ? x + rand(-2, 2) : x + rand(-width, width);
    const ny = box.y - 4 + ((box.h + 8) * i) / steps;
    lines.push(new Line({
      x: px, y: py, angle: Math.atan2(ny - py, nx - px), length: Math.hypot(nx - px, ny - py) + 1,
      thickness: 3, warn, life: 0.3, color: '#fff06a', glow: '#ffffff',
    }));
    px = nx;
    py = ny;
  }
  return lines;
}

export const STORM_IMP_ATTACKS = {
  // Forks: three bolts at a time, one right where you stand and the others a
  // hand either side. Each blinks thin along its exact path, then cracks. A spark
  // jumps from the floor where it lands. Four volleys.
  impFork(box, density, { Shot, Line, rand, clamp }) {
    let t = 0;
    let volleys = 0;
    let next = 0.2;
    let sparks = [];
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && volleys < 4 && t < 5.4) {
          next = t + 1.55;
          const gap = rand(30, 38);
          const xs = [soul.x, soul.x + gap, soul.x - gap].map((x) => clamp(x, box.x + 5, box.x + box.w - 5));
          const warn = 0.85;
          for (const x of xs) {
            bullets.push(new Shot({ x, y: box.y + 3, harmless: true, life: warn, art: 'impMark' }));
            for (const line of bolt(Line, x, box, warn, rand)) bullets.push(line);
            sparks.push({ at: t + warn + 0.05, x });
          }
          volleys++;
        }
        for (const s of sparks) {
          if (t < s.at) continue;
          s.done = true;
          for (const dir of [-1, 1]) bullets.push(new Shot({ x: s.x, y: box.y + box.h - 3, vx: dir * 48, vy: -22, art: 'impSpark', life: 0.8 }));
        }
        sparks = sparks.filter((s) => !s.done);
      },
    };
  },

  // Rain: a shower of slanting streaks blowing in from the top right. Every
  // fourth one is aimed at where you are (it ticks at the top first).
  impRain(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let next = 0.15;
    let count = 0;
    const vx = -26;
    const vy = 104;
    let drops = [];
    let clouds = false;
    return {
      // (Its rain stops at 5 s: 6.0, was 6.8, so the next attack isn't long in coming.)
      duration: 6.0,
      update: (dt, bullets, soul) => {
        t += dt;
        // The cloud rolls in over the top of the box first, drifting with the wind.
        if (!clouds) {
          clouds = true;
          for (let x = box.x + 6; x < box.x + box.w + 30; x += 19) {
            bullets.push(new Shot({ x, y: box.y + 3 + (Math.round(x / 19) % 2 ? 2 : 0), vx: -3, harmless: true, life: 5.6, art: 'impCloud' }));
          }
        }
        // Each drop that reaches the floor splashes (only a look).
        for (const d of drops) {
          if (d.y < box.y + box.h - 2) continue;
          d.done = true;
          if (d.x > box.x + 2 && d.x < box.x + box.w - 2) bullets.push(new Shot({ x: d.x, y: box.y + box.h - 2, harmless: true, life: 0.2, art: 'impSplash' }));
        }
        drops = drops.filter((d) => !d.done && d.age < d.warn + d.life);
        if (t < next || t > 5) return;
        next = t + 0.085;
        const aimed = count % 4 === 0;
        const fall = ((aimed ? soul.y : box.y + box.h / 2) - box.y) / vy;
        const x = aimed ? clamp(soul.x - vx * fall, box.x - 4, box.x + box.w + 40) : rand(box.x - 4, box.x + box.w + 34);
        const drop = new Shot({ x, y: box.y - 2, vx, vy, warn: aimed ? 0.45 : 0, art: 'impRain', life: 2.2 });
        drops.push(drop);
        bullets.push(drop);
        count++;
      },
    };
  },

  // Gust: arrows blow across the box (that is the way it will push), and then
  // the wind comes, shoving you along while puffs of cloud and paper boats are
  // blown through. Three gusts, back and forth.
  impGust(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let gusts = 0;
    let gust = null;
    return {
      duration: 7.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!gust && gusts < 3 && t >= 0.2 + gusts * 2.45) {
          const dir = gusts === 1 ? 1 : -1;
          gust = { dir, start: t + 0.75, end: t + 2.05, spawn: 0 };
          for (let k = 0; k < 4; k++) {
            const y = box.y + 10 + k * 20;
            const x0 = dir < 0 ? box.x + box.w - 6 : box.x + 6;
            bullets.push(new Shot({ x: x0, y, vx: dir * 70, harmless: true, life: 0.75, art: 'impArrow', angle: dir < 0 ? Math.PI : 0 }));
          }
          gusts++;
        }
        if (gust) {
          if (t >= gust.start && t < gust.end) {
            soul.x = clamp(soul.x + gust.dir * 36 * dt, box.x + 4, box.x + box.w - 4);
            gust.spawn -= dt;
            if (gust.spawn <= 0) {
              gust.spawn = 0.34;
              const aimed = Math.random() < 0.12;
              const y = aimed ? clamp(soul.y + rand(-4, 4), box.y + 6, box.y + box.h - 6) : rand(box.y + 6, box.y + box.h - 6);
              const x = gust.dir < 0 ? box.x + box.w + 6 : box.x - 6;
              bullets.push(new Shot({ x, y, vx: gust.dir * 74, art: Math.random() < 0.5 ? 'impPuff' : 'impBoat', life: 2.4 }));
            }
          }
          if (t >= gust.end) gust = null;
        }
      },
    };
  },

  // Balls: three balls of lightning, one after another, fizz out of it and
  // bounce round the box off every wall. Each throws sparks where it bounces.
  impBall(box, density, { Shot, rand }) {
    let t = 0;
    let made = 0;
    const orbs = [];
    return {
      duration: 7.0,
      update: (dt, bullets, soul) => {
        t += dt;
        if (made < 3 && t >= 0.2 + made * 1.2) {
          const x = box.x + box.w - 6;
          const y = box.y + rand(14, box.h - 14);
          const aim = Math.atan2(soul.y - y, soul.x - x) + rand(-0.25, 0.25);
          const orb = new Shot({ x, y, vx: Math.cos(aim) * 56, vy: Math.sin(aim) * 56, bounce: true, warn: 0.6, art: 'impOrb', life: 5 });
          orb.lastVx = orb.vx;
          orb.lastVy = orb.vy;
          orb.sparked = 0;
          orbs.push(orb);
          bullets.push(orb);
          made++;
        }
        for (const orb of orbs) {
          if (orb.age <= orb.warn) continue;
          const bouncedX = orb.vx * orb.lastVx < 0;
          const bouncedY = orb.vy * orb.lastVy < 0;
          if ((bouncedX || bouncedY) && orb.sparked < 5) {
            orb.sparked += 1;
            for (const side of [-1, 1]) {
              const a = Math.atan2(orb.vy, orb.vx) + side * 1.1;
              bullets.push(new Shot({ x: orb.x, y: orb.y, vx: Math.cos(a) * 40, vy: Math.sin(a) * 40, art: 'impSpark', life: 1.0 }));
            }
          }
          orb.lastVx = orb.vx;
          orb.lastVy = orb.vy;
        }
      },
    };
  },
};

// Aimed shots on top (see snipes.js): with the aimed puffs thinned out, standing still was nearly safe.
STORM_IMP_ATTACKS.impGust = withSnipes(STORM_IMP_ATTACKS.impGust, { art: 'impPuff', count: 6, first: 0.6, every: 1.0, lead: [0.9, 0.4, 'mean', 0.9, 'mean', 0.4], until: 5.8 });
