import { defineBulletArt } from '../projectiles.js';

// The Dandy Lion's attacks. Its mane is a dandelion clock, so everything it
// throws is the mane: seeds on thin stalks drifting about on the breeze,
// fluff, petals from the flower it grew from, and a pounce that leaves a
// trail of puffs. It's the cheerful, vain fake-out of Sunnyside: slow,
// pretty, easy to read, and every attack still goes where you're standing.
//
// It stands to the right of the box, so everything comes in from the right
// edge (the breeze, the roar, the pounce). Attacks work on `box` and `soul`
// positions only; each one is a factory `(box, density, tools) => ({ duration,
// update })`; see dummy.js for the shape.

const SEED = { w: '#fffdf0', W: '#cfd4bc', q: '#8a9a78', s: '#5a4a2a' };
const FLUFF = { w: '#fffdf0', W: '#d2d6c0', q: '#a9b39a' };
const PETAL = { y: '#f6c52b', Y: '#d9941a', l: '#ffe98a' };
const SPARK = { g: '#fff7a0', w: '#ffffff', y: '#f6c52b' };

// A dandelion seed: a puff on a thin stalk, with the seed at the bottom.
defineBulletArt('dandySeed', {
  frames: [
    ['.w.w.w.', '..wWw..', '..wWw..', '...q...', '...q...', '...s...'],
    ['w.w.w..', '.wwWw..', '..wWw..', '...q...', '...q...', '...s...'],
  ],
  palette: SEED,
  radius: 1.8,
  frameSeconds: 0.35,
});

// A bit of the mane: a ball of fluff.
defineBulletArt('dandyFluff', {
  frames: [
    ['..www..', '.wwWww.', 'wwwwWww', 'wWwwwWw', '.wwWww.', '..qqq..'],
    ['..www..', '.wWwww.', 'wwwwwWw', 'wwWwwww', '.wwwWw.', '..qqq..'],
  ],
  palette: FLUFF,
  radius: 2.8,
  frameSeconds: 0.3,
});

// A yellow petal, drawn pointing right.
defineBulletArt('dandyPetal', {
  frames: [['.yyy.', 'lYYYy', '.yyy.']],
  palette: PETAL,
  radius: 1.7,
  rotate: true,
});

// The flower it grew from (harmless: it only throws petals).
defineBulletArt('dandyFlower', {
  frames: [
    ['...yyy...', '.y.yYy.y.', '..yyYyy..', 'yyyYYYyyy', '..yyYyy..', '.y.yYy.y.', '...yyy...'],
    ['..y.y.y..', '.yyyYyyy.', 'yyyyYyyyy', '.yYYYYYy.', 'yyyyYyyyy', '.yyyYyyy.', '..y.y.y..'],
  ],
  palette: PETAL,
  radius: 1,
  frameSeconds: 0.2,
});

// A paw, mid-pounce: three toes and a big pad, all pink beans, and the
// claws flicking out as it comes down.
const PAW = { y: '#f6c52b', Y: '#d9941a', k: '#8a5a14', p: '#ee7f8e', P: '#c85a6c', w: '#fffdf0' };
defineBulletArt('dandyPaw', {
  frames: [
    ['.........', '.kk.k.kk.', 'kyykykyyk', 'kpykpkypk', '.kkykykk.', 'kyyyyyyyk', 'kyypppyyk', 'kYppPppYk', '.kYpPpYk.', '..kkkkk..'],
    ['.w..w..w.', '.kw.w.wk.', 'kyykykyyk', 'kpykpkypk', '.kkykykk.', 'kyyyyyyyk', 'kyypppyyk', 'kYppPppYk', '.kYpPpYk.', '..kkkkk..'],
  ],
  palette: PAW,
  radius: 3.4,
  frameSeconds: 0.1,
});

// A wish, twinkling (harmless until it comes true).
defineBulletArt('dandyWish', {
  frames: [
    ['..g..', '..g..', 'ggwgg', '..g..', '..g..'],
    ['.g.g.', '..g..', '.gwg.', '..g..', '.g.g.'],
  ],
  palette: SPARK,
  radius: 1,
  frameSeconds: 0.15,
});

export const DANDY_LION_ATTACKS = {
  // On the breeze: seeds come drifting in on the wind in lazy arcs, and
  // every couple of seconds the wind turns and sends all of them back the
  // other way, still lazy, still coming.
  dandyBreeze(box, density, { Shot, every, rand, clamp }) {
    let t = 0;
    let dir = -1;
    let nextTurn = 2.2;
    let seeds = [];
    const drift = every(0.24, 0.34, (bullets, soul) => {
      // Half of them are drifting along your row.
      const y = Math.random() < 0.5 ? clamp(soul.y + rand(-10, 10), box.y + 4, box.y + box.h - 4) : rand(box.y + 4, box.y + box.h - 4);
      const x = dir < 0 ? box.x + box.w + 6 : box.x - 6;
      const seed = new Shot({ x, y, vx: dir * rand(24, 34), vy: rand(-4, 4), wobble: { amplitude: rand(7, 12), frequency: rand(1.6, 2.4) }, art: 'dandySeed', life: 7 });
      seeds.push(seed);
      bullets.push(seed);
    });
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < 5.8) drift(dt, bullets, soul);
        if (t >= nextTurn) {
          nextTurn = t + 2.1;
          dir = -dir;
          // The gust turns every seed round, a bit slower than it came.
          for (const seed of seeds) seed.vx = dir * Math.abs(seed.vx) * 0.8;
        }
        seeds = seeds.filter((seed) => seed.age < 7);
      },
    };
  },

  // Roar: it puffs its mane up, and then ROARS, and the whole mane blows off
  // in a spray of seeds, in a fan aimed at where you were standing. The fan's
  // edges flash first.
  dandyRoar(box, density, { Shot, Line, rand, clamp }) {
    const mouth = { x: box.x + box.w - 2, y: box.y + box.h / 2 };
    let t = 0;
    let roars = 0;
    let next = 0.2;
    let firing = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && roars < 3 && t < 5) {
          roars++;
          next = t + 2.1;
          const aim = Math.atan2(soul.y - mouth.y, soul.x - mouth.x);
          const spread = 0.62;
          // The edges of the spray, flashing: a puff swells at the mouth.
          for (const side of [-1, 1]) {
            bullets.push(new Line({ x: mouth.x, y: mouth.y, angle: aim + side * spread, length: 90, thickness: 2, warn: 0.85, life: 0, color: '#fffdf0' }));
          }
          bullets.push(new Shot({ x: box.x + box.w - 6, y: mouth.y, harmless: true, warn: 0, life: 0.85, art: 'dandyFluff' }));
          firing.push({ at: t + 0.85, aim, spread });
        }
        for (const roar of firing) {
          if (t < roar.at) continue;
          roar.done = true;
          const count = 13;
          for (let i = 0; i < count; i++) {
            const a = roar.aim - roar.spread + (2 * roar.spread * (i + rand(0.1, 0.9))) / count;
            const speed = rand(44, 70);
            const big = i % 4 === 0;
            bullets.push(new Shot({ x: mouth.x, y: mouth.y + rand(-4, 4), vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, accel: -10, gravity: 8, art: big ? 'dandyFluff' : 'dandySeed', life: 5 }));
          }
        }
        firing = firing.filter((roar) => !roar.done);
      },
    };
  },

  // Petals: it grows a flower. The flower spins out petals in a pair of
  // spiral arms, then wilts, and another opens somewhere else.
  dandyPetals(box, density, { Shot, rand, pointAwayFrom }) {
    let t = 0;
    let flower = null;
    let nextFlower = 0.2;
    let count = 0;
    let angle = 0;
    let spin = 3.4;
    let timer = 0;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= nextFlower && count < 2 && t < 4) {
          count++;
          nextFlower = t + 3.1;
          const at = pointAwayFrom(box, soul, 30, 16);
          flower = { x: at.x, y: at.y, from: t + 0.5, until: t + 3 };
          spin = count === 1 ? 3.4 : -3.8;
          angle = rand(0, Math.PI * 2);
          bullets.push(new Shot({ x: at.x, y: at.y, harmless: true, life: 3.1, art: 'dandyFlower' }));
        }
        if (flower && t >= flower.from && t < flower.until) {
          angle += spin * dt;
          timer -= dt;
          while (timer <= 0) {
            timer += 0.11;
            for (const arm of [0, Math.PI]) {
              const a = angle + arm;
              bullets.push(new Shot({ x: flower.x, y: flower.y, vx: Math.cos(a) * 34, vy: Math.sin(a) * 34, art: 'dandyPetal', life: 5 }));
            }
          }
        }
      },
    };
  },

  // Pounce: it springs across the box in a high arc and lands on the spot
  // where you were (the arc flashes first). Each leap leaves a trail of fluff
  // that hangs in the air a while, and a ring of puffs where it lands.
  dandyPounce(box, density, { Shot, Line, rand, clamp }) {
    let t = 0;
    let next = 0.1;
    let count = 0;
    const leaps = [];
    const FLIGHT = 0.6;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && count < 3 && t < 5) {
          const fromRight = count % 2 === 0;
          const start = { x: fromRight ? box.x + box.w + 8 : box.x - 8, y: clamp(soul.y + rand(-10, 10), box.y + 10, box.y + box.h - 6) };
          const end = { x: clamp(soul.x, box.x + 6, box.x + box.w - 6), y: clamp(soul.y, box.y + 6, box.y + box.h - 6) };
          const warn = 0.85;
          // The warning follows the arc itself, in short dashes, so the
          // flash shows the real path over the top and not a straight line.
          const arc = (k) => ({ x: start.x + (end.x - start.x) * k, y: start.y + (end.y - start.y) * k - Math.sin(Math.PI * k) * 20 });
          for (let i = 0; i < 10; i++) {
            const a = arc(i / 10);
            const b = arc((i + 1) / 10);
            bullets.push(new Line({ x: a.x, y: a.y, angle: Math.atan2(b.y - a.y, b.x - a.x), length: Math.hypot(b.x - a.x, b.y - a.y), thickness: 2, warn, life: 0, color: '#f6c52b' }));
          }
          const paw = new Shot({ x: start.x, y: start.y, warn, life: FLIGHT + 0.12, art: 'dandyPaw' });
          bullets.push(paw);
          leaps.push({ paw, start, end, born: t, warn, trail: 0, landed: false });
          count++;
          next = t + 2;
        }
        for (const leap of leaps) {
          const k = (t - leap.born - leap.warn) / FLIGHT;
          if (k < 0 || leap.landed) continue;
          if (k >= 1) {
            leap.landed = true;
            // A ring of puffs where it lands.
            for (let i = 0; i < 6; i++) {
              const a = (i / 6) * Math.PI * 2 + 0.3;
              bullets.push(new Shot({ x: leap.end.x, y: leap.end.y, vx: Math.cos(a) * 32, vy: Math.sin(a) * 32, art: 'dandyFluff', life: 1.6 }));
            }
            continue;
          }
          leap.paw.x = leap.start.x + (leap.end.x - leap.start.x) * k;
          leap.paw.y = leap.start.y + (leap.end.y - leap.start.y) * k - Math.sin(Math.PI * k) * 20;
          leap.trail -= dt;
          if (leap.trail <= 0) {
            leap.trail = 0.07;
            bullets.push(new Shot({ x: leap.paw.x, y: leap.paw.y, vy: -3, art: 'dandyFluff', life: 2 }));
          }
        }
      },
    };
  },

  // Make a wish: little golden sparkles twinkle up here and there, a lot of
  // them right beside you, and a moment later each one comes true, in a ring
  // of petals.
  dandyWish(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let next = 0.3;
    let wishes = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 5) {
          next = t + 0.62;
          const near = Math.random() < 0.55;
          const x = near ? clamp(soul.x + rand(-9, 9), box.x + 8, box.x + box.w - 8) : rand(box.x + 8, box.x + box.w - 8);
          const y = near ? clamp(soul.y + rand(-9, 9), box.y + 8, box.y + box.h - 8) : rand(box.y + 8, box.y + box.h - 8);
          bullets.push(new Shot({ x, y, harmless: true, life: 0.95, art: 'dandyWish' }));
          wishes.push({ at: t + 0.95, x, y });
        }
        for (const wish of wishes) {
          if (t < wish.at) continue;
          wish.done = true;
          const turn = rand(0, Math.PI);
          for (let i = 0; i < 8; i++) {
            const a = turn + (i / 8) * Math.PI * 2;
            bullets.push(new Shot({ x: wish.x, y: wish.y, vx: Math.cos(a) * 36, vy: Math.sin(a) * 36, art: 'dandyPetal', life: 2.2 }));
          }
        }
        wishes = wishes.filter((wish) => !wish.done);
      },
    };
  },
};
