import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { withSnipes } from './snipes.js';

// The Seed Sheep's attacks. Its fleece is a dandelion clock, so it's all
// seeds and wool: a drift of parachute seeds on the breeze (with a gap),
// woolly charges along your row that shed tufts as they go, and big
// dandelion clocks that float in and puff apart into rings of seed motes.
// It stands to the right of the box.

const WOOL = { w: '#ffffff', W: '#f6f3e8', s: '#dcd7c4', d: '#bdb6a0', k: '#3a2e2a', y: '#ffd93b', Y: '#e3a42a', g: '#6aa84f' };

// A parachute seed, tuft trailing to the right, the little seed leading.
function seed() {
  const g = new Pix(11, 7);
  g.line(1, 3, 6, 3, 'd');
  g.disc(8, 3, 2.6, 2.6, 'w');
  g.set(8, 1, 'd'); g.set(8, 5, 'd'); g.set(10, 3, 'd');
  g.set(0, 3, 'k');
  g.outline('s');
  return g.rows();
}
defineBulletArt('sheepSeed', { frames: [seed()], palette: WOOL, radius: 2.8, frameSeconds: 0.2 });

// A tuft of wool.
defineBulletArt('sheepTuft', { frames: [['.w.', 'wWw', '.s.']], palette: WOOL, radius: 1.8, spin: 3 });

// A woolly ball with a curl in it, small and big.
function ball(size) {
  const c = (size - 1) / 2;
  const g = new Pix(size, size);
  g.disc(c, c, c, c, 'W');
  g.disc(c + 1, c + 2, c * 0.8, c * 0.6, 's', 'W');
  g.disc(c - 1, c - 1, c * 0.4, c * 0.35, 'w', 'W');
  g.line(c - c * 0.5, c, c + c * 0.5, c + 1, 'd');
  g.outline('d');
  return g.rows();
}
defineBulletArt('sheepBall', { frames: [ball(13)], palette: WOOL, radius: 5.4, spin: 6 });

// The dandelion clock, a round ball of wisps (it only floats; the motes are what hurts).
function clock() {
  const g = new Pix(17, 17);
  g.disc(8, 8, 3, 3, 'd');
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    g.line(8 + Math.cos(a) * 3, 8 + Math.sin(a) * 3, 8 + Math.cos(a) * 6.4, 8 + Math.sin(a) * 6.4, 's');
    g.disc(8 + Math.cos(a) * 7, 8 + Math.sin(a) * 7, 1, 1, 'w');
  }
  g.disc(8, 8, 2, 2, 'W');
  return g.rows();
}
defineBulletArt('sheepClock', { frames: [clock()], palette: WOOL, radius: 7, spin: 1.2 });

// A seed mote that came out of a clock: a bright little star.
defineBulletArt('sheepMote', { frames: [['..w..', '.wsw.', 'wsysw', '.wsw.', '..w..']], palette: WOOL, radius: 2.2, spin: 4 });

export const SEED_SHEEP_ATTACKS = {
  // Drift: a wave of parachute seeds on the breeze, eight to a wave, in a
  // line across the box with a three-wide gap that sits somewhere new each
  // time. They bob as they come. Five waves.
  sheepSeeds(box, density, { Shot, rand }) {
    let t = 0;
    let waves = 0;
    let next = 0.2;
    let lastGap = -1;
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || waves >= 5 || t > 5.6) return;
        next = t + 1.15;
        // The gap is two or more slots from where the last one was, and away from your slot.
        let gap;
        let tries = 0;
        do {
          gap = Math.floor(rand(0, 6));
          tries++;
        } while (tries < 8 && (Math.abs(gap - lastGap) < 2));
        lastGap = gap;
        for (let k = 0; k < 8; k++) {
          if (k >= gap && k < gap + 3) continue;
          const y = box.y + 5 + k * 10;
          bullets.push(new Shot({ x: box.x + box.w + 6, y, vx: -56, warn: 0.3, wobble: { amplitude: 3, frequency: 3 + (waves % 2) }, art: 'sheepSeed', life: 3.2 }));
        }
        waves++;
      },
    };
  },

  // Ram: it lowers its head and a big woolly ball charges in along your row
  // (it blinks first and keeps lining up on you until the last instant),
  // shedding tufts as it rolls. From the second charge, a second ball comes
  // a step off your row, a beat later. Four charges.
  sheepRam(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let charges = 0;
    let next = 0.2;
    let aiming = [];
    return {
      duration: 7.6,
      update: (dt, bullets, soul) => {
        t += dt;
        for (const ball of aiming) {
          if (ball.age < ball.warn - 0.1) ball.y = clamp(soul.y + (ball.offset || 0), box.y + 6, box.y + box.h - 6);
          else if (ball.fire) {
            ball.fire = false;
            ball.vx = -128;
          }
          // Shedding tufts as it rolls.
          if (ball.age > ball.warn && ball.age >= ball.nextTuft) {
            ball.nextTuft = ball.age + 0.13;
            bullets.push(new Shot({ x: ball.x + 5, y: ball.y + rand(-3, 3), vx: rand(-6, 6), vy: rand(-22, 22), accel: -12, art: 'sheepTuft', life: 0.8 }));
          }
        }
        aiming = aiming.filter((ball) => ball.age < ball.warn + ball.life);
        if (t < next || charges >= 4 || t > 5.8) return;
        next = t + 1.55;
        const x = box.x + box.w + 7;
        const main = new Shot({ x, y: soul.y, warn: 0.62, art: 'sheepBall', life: 1.8 });
        main.fire = true;
        main.nextTuft = 0;
        aiming.push(main);
        bullets.push(main);
        if (charges >= 1) {
          const side = new Shot({ x, y: soul.y, warn: 0.9, art: 'sheepBall', life: 1.8 });
          side.fire = true;
          side.nextTuft = 0;
          side.offset = (charges % 2 ? 1 : -1) * 26;
          aiming.push(side);
          bullets.push(side);
        }
        charges++;
      },
    };
  },

  // Puff: a dandelion clock floats into the box, hangs a moment, and bursts
  // into a ring of seed motes, then a second ring a beat later turned by half
  // a step. Each ring has a gap, and it never sits right on you, so you
  // have to move. Four clocks.
  sheepPuff(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let made = 0;
    let next = 0.2;
    let clocks = [];
    const ring = (bullets, x, y, soul, turn) => {
      const N = 10;
      const toSoul = Math.atan2(soul.y - y, soul.x - x);
      const gapAt = toSoul + (Math.random() < 0.5 ? 0.75 : -0.75) + turn;
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2 + turn * 0.5;
        const d = Math.atan2(Math.sin(a - gapAt), Math.cos(a - gapAt));
        if (Math.abs(d) < 0.62) continue;
        bullets.push(new Shot({ x, y, vx: Math.cos(a) * 54, vy: Math.sin(a) * 54, art: 'sheepMote', life: 2.4 }));
      }
    };
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        for (const c of clocks) {
          if (!c.burst && c.age >= 0.95) {
            c.burst = true;
            ring(bullets, c.x, c.y, soul, 0);
          }
          if (!c.second && c.age >= 1.5) {
            c.second = true;
            ring(bullets, c.x, c.y, soul, 0.26);
          }
        }
        clocks = clocks.filter((c) => c.age < 1.6);
        if (t < next || made >= 4 || t > 5.2) return;
        next = t + 1.45;
        let x;
        let y;
        let tries = 0;
        do {
          x = rand(box.x + 16, box.x + box.w - 10);
          y = rand(box.y + 14, box.y + box.h - 14);
          tries++;
        } while (tries < 10 && Math.hypot(x - soul.x, y - soul.y) < 26);
        // It drifts in from the right to its spot.
        const c = new Shot({ x: box.x + box.w + 8, y, vx: 0, harmless: true, art: 'sheepClock', life: 1.6 });
        c.target = x;
        const oldUpdate = c.update.bind(c);
        c.update = (dt2, b) => {
          oldUpdate(dt2, b);
          c.x += (c.target - c.x) * Math.min(1, dt2 * 5);
        };
        clocks.push(c);
        bullets.push(c);
        made++;
      },
    };
  },
};

// Aimed seeds on top, so standing still or running one way is never safe (see snipes.js).
SEED_SHEEP_ATTACKS.sheepSeeds = withSnipes(SEED_SHEEP_ATTACKS.sheepSeeds, { art: 'sheepSeed' });
SEED_SHEEP_ATTACKS.sheepRam = withSnipes(SEED_SHEEP_ATTACKS.sheepRam, { art: 'sheepMote' });
SEED_SHEEP_ATTACKS.sheepPuff = withSnipes(SEED_SHEEP_ATTACKS.sheepPuff, { art: 'sheepMote' });
