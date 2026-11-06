import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { withSnipes } from './snipes.js';

// The Gullion's attacks. He is a brawler gull who steals, so it's all gull
// business: dive-bombs that drop stolen chips behind them (each shows its line
// first), fans of loose feathers, junk out of the swag sack lobbed in arcs
// (a boot, a spoon, a sandwich), and a proper scrap: two jabs and a haymaker.
// He stands to the right of the box.

const GULL = { W: '#f2f4f2', w: '#ffffff', s: '#d4dad8', g: '#8e9aa6', G: '#5e6a78', y: '#f2b830', c: '#d8c06a', h: '#e8a030', t: '#f0e8cc', T: '#c8bc98', P: '#6a6e6c', p: '#9a9e9c', k: '#1c1f26', r: '#d8483a', l: '#6ab04a', b: '#8a6a44', S: '#b8c0c8' };

// A gull diving, pointing right: wings swept back, a yellow beak.
function diver(flap) {
  const g = new Pix(15, 9);
  g.disc(8, 4.5, 5, 2.4, 'W');
  g.disc(12, 4.5, 2.4, 1.8, 'W');
  g.rect(14, 4, 1, 1, 'y');
  g.set(13, 3, 'k');
  g.line(8, 4, 2, flap ? 0 : 1, 'g', 2);
  g.line(8, 5, 2, flap ? 8 : 7, 'G', 2);
  g.line(3, 4, 0, 4, 'G');
  g.outline('k');
  return g.rows();
}
defineBulletArt('gullDiver', { frames: [diver(0), diver(1)], palette: GULL, radius: 3.4, rotate: true, frameSeconds: 0.1 });

// A chip, golden and bitten.
defineBulletArt('gullChip', {
  frames: [['..cc..', '.chhc.', 'chhhhc', '.chhc.', '..cc..']],
  palette: GULL,
  radius: 2.2,
  spin: 3,
});

// A crumb knocked off it when it lands.
defineBulletArt('gullCrumb', { frames: [['.c.', 'chc', '.c.']], palette: GULL, radius: 1.6, spin: 4 });

// A loose feather pointing right.
defineBulletArt('gullFeather', {
  frames: [['..s......', 'swwwwwwSs', '..s......']],
  palette: GULL,
  radius: 2,
  rotate: true,
});

// A boot.
defineBulletArt('gullBoot', {
  frames: [['.pppp....', '.pPPp....', '.pppp....', '.pPPp....', '.ppppppp.', 'ppppppppp', 'PPPPPPPPP']],
  palette: { ...GULL, P: '#4a4e58' },
  radius: 3.4,
  spin: 3,
});

// A teaspoon.
defineBulletArt('gullSpoon', {
  frames: [['.......ss.', 'SSSSSSSsss', '.......ss.']],
  palette: GULL,
  radius: 2.6,
  rotate: true,
  spin: 7,
});

// A sandwich, a bite out of it.
defineBulletArt('gullSandwich', {
  frames: [['.cccccc.', 'chhhhhhc', 'lllllll.', 'rrrrrrr.', 'chhhhhhc', '.cccccc.']],
  palette: GULL,
  radius: 3.2,
  spin: 2,
});

// A taped fist, small and big.
function fist(size) {
  const c = (size - 1) / 2;
  const g = new Pix(size, size);
  g.disc(c, c, c, c, 't');
  g.line(1, c - 1.5, size - 2, c - 1.5, 'T');
  g.line(1, c + 1.5, size - 2, c + 1.5, 'T');
  g.disc(c - 1, c - 1, c * 0.4, c * 0.4, 'w', 't');
  g.outline('k');
  return g.rows();
}
defineBulletArt('gullFist', { frames: [fist(7)], palette: GULL, radius: 3.2, spin: 1 });
defineBulletArt('gullFistBig', { frames: [fist(13)], palette: GULL, radius: 5.8, spin: 1 });

export const GULLION_ATTACKS = {
  // Dives: he drops out of the sky or across the box at where you are (a thin
  // line shows the way first), shedding stolen chips behind him, which fall.
  // Four dives, from all sides.
  gullDive(box, density, { Shot, Line, rand, clamp }) {
    let t = 0;
    let dives = 0;
    let next = 0.2;
    let live = [];
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
        if (t >= next && dives < 4 && t < 5.4) {
          next = t + 1.5;
          const from = [
            { x: box.x + box.w + 8, y: box.y - 10 },
            { x: box.x - 8, y: box.y + rand(8, 30) },
            { x: box.x + box.w + 8, y: box.y + box.h - rand(8, 24) },
            { x: clamp(soul.x + rand(-20, 20), box.x + 8, box.x + box.w - 8), y: box.y - 10 },
          ][dives];
          const aim = Math.atan2(soul.y - from.y, soul.x - from.x);
          const warn = 0.8;
          const guide = new Line({ x: from.x, y: from.y, angle: aim, length: 190, thickness: 1, warn, life: 0, color: '#f2f4f2' });
          bullets.push(guide);
          // Its speed is set the moment it takes off (the difficulty's speed would skew the line).
          const gull = new Shot({ x: from.x, y: from.y, warn, art: 'gullDiver', life: 2, angle: aim });
          gull.guide = guide;
          gull.from = from;
          gull.aim = aim;
          gull.drop = 0.12;
          live.push(gull);
          bullets.push(gull);
          dives++;
        }
        for (const gull of live) {
          // The line follows you (a little ahead of where you are heading) until the last
          // third of a second, and then it is fixed: that is the line it dives down.
          if (gull.age < gull.warn - 0.3) {
            const aim = Math.atan2(soul.y + heading.y * 0.3 - gull.from.y, soul.x + heading.x * 0.3 - gull.from.x);
            gull.guide.angle = aim;
            gull.aim = aim;
            gull.angle = aim;
          }
          if (gull.age < gull.warn) continue;
          if (!gull.launched) {
            gull.launched = true;
            gull.vx = Math.cos(gull.aim) * 140;
            gull.vy = Math.sin(gull.aim) * 140;
          }
          gull.drop -= dt;
          if (gull.drop <= 0 && gull.age < gull.warn + 1.3) {
            gull.drop = 0.2;
            bullets.push(new Shot({ x: gull.x, y: gull.y, vx: rand(-8, 8), vy: -10, gravity: 85, art: 'gullChip', life: 1.7 }));
          }
        }
        live = live.filter((gull) => gull.age < gull.warn + gull.life);
      },
    };
  },

  // Feathers: he flaps and a fan of loose feathers comes off him, spread wide
  // and slowing as they fly. A fan from the right, then one from the top, then
  // one from the right again, each aimed to leave a gap either side of where
  // you were.
  gullFeathers(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let fans = 0;
    let next = 0.2;
    return {
      duration: 7.0,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || fans >= 4 || t > 5.2) return;
        next = t + 1.5;
        const top = fans % 2 === 1;
        const from = top
          ? { x: clamp(soul.x + rand(-24, 24), box.x + 8, box.x + box.w - 8), y: box.y - 3 }
          : { x: box.x + box.w + 5, y: rand(box.y + 14, box.y + box.h - 14) };
        const aim = Math.atan2(soul.y - from.y, soul.x - from.x);
        for (let k = -4; k <= 4; k++) {
          const a = aim + k * 0.21;
          bullets.push(new Shot({ x: from.x, y: from.y, vx: Math.cos(a) * 92, vy: Math.sin(a) * 92, warn: 0.55, accel: -18, art: 'gullFeather', life: 2.6 }));
        }
        fans++;
      },
    };
  },

  // Junk: he turns out his swag sack and lobs it: a boot, a spoon, a sandwich,
  // each thrown in a high arc to land where you are. The thing blinks at the
  // sack first. Seven throws.
  gullJunk(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let thrown = 0;
    let next = 0.2;
    const GRAVITY = 120;
    const FLIGHT = 0.75;
    const JUNK = ['gullBoot', 'gullSpoon', 'gullSandwich'];
    let flying = [];
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
        for (const junk of flying) {
          // It is let go at the end of its blink, aimed from where you are then: one at
          // you, one at where you are heading. (Its speed is set here, not when it is
          // made: the difficulty's speed scales a new bullet, and an arc only lands where
          // it should if the gravity matches.)
          if (!junk.set && junk.age >= junk.warn - 0.03) {
            const lead = junk.ahead ? FLIGHT * 0.9 : 0;
            const tx = clamp(soul.x + heading.x * lead, box.x + 4, box.x + box.w - 4);
            const ty = clamp(soul.y + heading.y * lead, box.y + 4, box.y + box.h - 4);
            junk.vx = (tx - junk.x) / FLIGHT;
            junk.vy = (ty - junk.y - 0.5 * GRAVITY * FLIGHT * FLIGHT) / FLIGHT;
            junk.set = true;
          }
          // It lands and bounces along the floor.
          if (junk.set && junk.vy > 0 && junk.y > box.y + box.h - 3) {
            junk.y = box.y + box.h - 3;
            junk.vy = -junk.vy * 0.55;
            if (!junk.crumbed) {
              junk.crumbed = true;
              for (let k = 0; k < 5; k++) {
                const a = -Math.PI + 0.35 + (k / 4) * (Math.PI - 0.7);
                bullets.push(new Shot({ x: junk.x, y: junk.y - 2, vx: Math.cos(a) * 42, vy: Math.sin(a) * 42, art: 'gullCrumb', life: 0.9 }));
              }
            }
          }
        }
        flying = flying.filter((junk) => junk.age < junk.warn + junk.life);
        if (t < next || thrown >= 6 || t > 5.4) return;
        next = t + 0.85;
        const x0 = box.x + box.w + 4;
        for (let k = 0; k < 2; k++) {
          const junk = new Shot({ x: x0, y: box.y + rand(4, 34), gravity: GRAVITY, warn: 0.4 + k * 0.1, art: JUNK[(thrown + k) % 3], life: 2.2 });
          junk.ahead = k === 1;
          flying.push(junk);
          bullets.push(junk);
        }
        thrown++;
      },
    };
  },

  // Brawl: a proper scrap. Two quick jabs along your row (each fist blinks first),
  // then a haymaker, a huge slow fist that swings in and curves after you. Three
  // rounds of jab, jab, haymaker.
  gullBrawl(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let round = 0;
    let step = 0;
    let next = 0.2;
    let jabs = [];
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        // A jab keeps lining up on your row until the last instant, then goes.
        for (const jab of jabs) {
          if (jab.age < jab.warn - 0.1) jab.y = clamp(soul.y, box.y + 5, box.y + box.h - 5);
          else if (jab.fire) {
            jab.fire = false;
            jab.vx = -150;
          }
        }
        jabs = jabs.filter((jab) => jab.age < jab.warn + jab.life);
        if (t < next || round >= 3) return;
        const x = box.x + box.w + 4;
        if (step < 2) {
          next = t + 0.52;
          const jab = new Shot({ x, y: soul.y, warn: 0.42, art: 'gullFist', life: 1.4 });
          jab.fire = true;
          jabs.push(jab);
          bullets.push(jab);
          step++;
        } else {
          next = t + 2.0;
          const y = clamp(soul.y + (round % 2 ? 30 : -30), box.y + 6, box.y + box.h - 6);
          bullets.push(new Shot({ x, y, vx: -78, vy: 0, warn: 0.75, art: 'gullFistBig', life: 2.4, homing: { target: soul, turn: 0.95 } }));
          step = 0;
          round++;
        }
      },
    };
  },
};

// Aimed shots on top, so standing still or running one way is never safe (see snipes.js).
GULLION_ATTACKS.gullDive = withSnipes(GULLION_ATTACKS.gullDive, { art: 'gullFeather' });
GULLION_ATTACKS.gullJunk = withSnipes(GULLION_ATTACKS.gullJunk, { art: 'gullSpoon', count: 5, first: 0.8, every: 1.0, lead: [0.9, 'mean', 0.3, 'mean', 0.9], until: 5.8 });
GULLION_ATTACKS.gullBrawl = withSnipes(GULLION_ATTACKS.gullBrawl, { art: 'gullFist', count: 4, first: 1.0, every: 1.2, lead: 0.8 });
