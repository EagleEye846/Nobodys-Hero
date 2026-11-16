import { defineBulletArt } from '../projectiles.js';

// Grist's attacks. It's the mill rat who calls itself the Miller, so it
// fights with whatever's lying about the old mill: sacks of flour that burst,
// the runaway millstone, oats and grain by the chuteful, and the great scales
// it weighs the sacks on (it's very proud of those).
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const FLOUR = { w: '#f4eedc', W: '#c8bea8', k: '#5a4a3a' };
const SACK = { k: '#3a2614', a: '#d8bc84', A: '#a08450', w: '#f4eedc', r: '#a84a34' };
const STONE = { k: '#2a2630', s: '#9a96a2', S: '#6a6672', h: '#c8c4d0', o: '#3e3a46' };
const OATS = { o: '#e2c272', O: '#a8843a', g: '#f6e6a8' };
const PADDLE = { k: '#2a1a0e', w: '#8a5a32', W: '#5e3c1e', b: '#7ab8e0', B: '#c8e8f8' };
const LOAF = { k: '#3a2210', l: '#c8862e', L: '#8a5420', o: '#e2c272' };
// The tail's colour, for the whip (a Line, not art).

// A flour sack, tied at the top with red string, flung end over end.
defineBulletArt('gristSack', {
  frames: [[
    '..krk..',
    '.kaaak.',
    'kaaaaAk',
    'kawwaAk',
    'kaaaaAk',
    '.kAAAk.',
  ]],
  palette: SACK,
  radius: 3,
  spin: 6,
});

// The same sack landed and swelling, about to go (harmless: it's the warning).
defineBulletArt('gristSackSwell', {
  frames: [
    ['..krk..', '.kaaak.', 'kaaaaAk', 'kawwaAk', 'kaaaaAk', '.kAAAk.'],
    ['.krrk..', 'kaaaaak', 'kawwwaA', 'kawwwaA', 'kaaaaaA', '.kAAAAk'],
  ],
  palette: SACK,
  radius: 3,
  frameSeconds: 0.1,
});

// A puff of flour, billowing as it goes.
defineBulletArt('gristPuff', {
  frames: [
    ['.ww.', 'wWww', 'wwWw', '.ww.'],
    ['w.w.', '.wWw', 'wWw.', '.w.w'],
  ],
  palette: FLOUR,
  radius: 1.8,
  frameSeconds: 0.14,
});

// The post its scales stand on (harmless).
defineBulletArt('gristPost', {
  frames: [['.kk.', '.WW.', '.WW.', '.WW.', '.WW.', 'kWWk', 'kkkk']],
  palette: { k: '#2a1a0e', W: '#8a5a32' },
  radius: 1,
});

// The millstone, a big grey wheel with a square hole, rolling.
defineBulletArt('gristMillstone', {
  frames: [[
    '...kkkkkk...',
    '..kshhsssk..',
    '.kshssssSSk.',
    'kshssssssSSk',
    'kssss..sssSk',
    'kssso..ossSk',
    'ksssssssSSSk',
    'kssssssSSSSk',
    '.ksssSSSSSk.',
    '..kSSSSSSk..',
    '...kkkkkk...',
  ]],
  palette: STONE,
  radius: 5.5,
  spin: 7,
});

// An oat grain, drawn pointing right.
defineBulletArt('gristOat', {
  frames: [['.oog', 'OOo.']],
  palette: OATS,
  radius: 1.2,
  rotate: true,
});

// The grain chute's hopper (harmless: the oats come out of it).
defineBulletArt('gristHopper', {
  frames: [['kkkkkkkk', 'kWwwwwWk', '.kWwwWk.', '..kwWk..', '...kk...']],
  palette: PADDLE,
  radius: 3,
});

// Its nibbled oat loaf, lobbed and bouncing.
defineBulletArt('gristLoaf', {
  frames: [['.kkkk.', 'kllolk', 'klllLk', 'kLlL.k', '.kkk..']],
  palette: LOAF,
  radius: 2.5,
  spin: 4,
});

export const GRIST_ATTACKS = {
  // Flour sacks: it slings sacks over its shoulder into the box. Each one
  // lands, sits there swelling, then bursts into a ring of flour that slows
  // and hangs in the air. The ring always has a gap in it, turned a different
  // way each time. Every other sack lands right where you are.
  gristFlour(box, density, { Shot, every, rand, clamp }) {
    let sacks = [];
    let thrown = 0;
    const swell = 0.55;
    const sling = every(0.85, 1.0, (bullets, soul) => {
      const target = thrown % 2 === 0
        ? { x: clamp(soul.x, box.x + 8, box.x + box.w - 8), y: clamp(soul.y, box.y + 8, box.y + box.h - 8) }
        : { x: rand(box.x + 10, box.x + box.w - 10), y: rand(box.y + 10, box.y + box.h - 10) };
      thrown++;
      // It arcs in from the top corner on its side of the box.
      const left = Math.random() < 0.5;
      const from = { x: left ? box.x - 4 : box.x + box.w + 4, y: box.y - 4 };
      const sack = new Shot({ x: from.x, y: from.y, harmless: true, art: 'gristSack' });
      sack.from = from;
      sack.flight = 0;
      sack.target = target;
      bullets.push(sack);
      sacks.push(sack);
    }, { first: 0.15 });
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        sling(dt, bullets, soul);
        for (const sack of sacks) {
          if (sack.burst !== undefined || sack.done) continue;
          // It flies in a hump from the corner to where it'll land.
          sack.flight += dt;
          const u = Math.min(1, sack.flight / 0.7);
          sack.x = sack.from.x + (sack.target.x - sack.from.x) * u;
          sack.y = sack.from.y + (sack.target.y - sack.from.y) * u - Math.sin(u * Math.PI) * 24;
          if (u < 1) continue;
          // Down it comes: it swells, then goes off.
          sack.done = true;
          sack.life = sack.age - sack.warn;
          const swollen = new Shot({ x: sack.target.x, y: sack.target.y, harmless: true, life: swell, art: 'gristSackSwell' });
          bullets.push(swollen);
          swollen.burst = swell;
          swollen.at = sack.target;
          sacks.push(swollen);
        }
        for (const sack of sacks) {
          if (sack.burst === undefined || sack.done) continue;
          sack.burst -= dt;
          if (sack.burst > 0) continue;
          sack.done = true;
          const gap = rand(0, Math.PI * 2);
          for (let i = 0; i < 10; i++) {
            const angle = gap + ((i + 1) * Math.PI * 2) / 11;
            bullets.push(new Shot({
              x: sack.at.x, y: sack.at.y, vx: Math.cos(angle) * 70, vy: Math.sin(angle) * 70, accel: -60, life: 1.4, art: 'gristPuff',
            }));
          }
        }
        sacks = sacks.filter((sack) => !sack.done);
      },
    };
  },

  // Runaway millstone: the old millstone gets loose and rolls across the
  // box, along the top, the middle or the bottom, spilling oats behind it.
  // It blinks at the wall first so you know which lane. Every few rolls it
  // hits the far wall and comes back the same way.
  gristMillstone(box, density, { Shot, rand, shuffleBag }) {
    const lane = shuffleBag([0, 1, 2]);
    const warn = 0.5;
    let stones = [];
    let rolls = 0;
    let next = 0.1;
    let t = 0;
    const roll = (bullets) => {
      const row = lane();
      const y = box.y + 14 + row * ((box.h - 28) / 2);
      const left = rolls % 2 === 0;
      rolls++;
      const stone = new Shot({
        x: left ? box.x + 4 : box.x + box.w - 4, y, vx: left ? 75 : -75, warn, art: 'gristMillstone',
      });
      // Every third one bounces back off the far wall.
      stone.rebound = rolls % 3 === 0;
      stone.spill = 0.12;
      bullets.push(stone);
      stones.push(stone);
    };
    return {
      duration: 8,
      update: (dt, bullets) => {
        t += dt;
        if (t >= next && t < 8.6) {
          roll(bullets);
          next = t + rand(0.95, 1.1);
        }
        for (const stone of stones) {
          if (stone.age < stone.warn) continue;
          const atWall = stone.vx > 0 ? stone.x > box.x + box.w - 6 : stone.x < box.x + 6;
          if (stone.rebound && atWall) {
            stone.vx = -stone.vx;
            stone.rebound = false;
          }
          stone.spill -= dt;
          if (stone.spill > 0) continue;
          stone.spill += 0.14;
          // Oats tumble off it and drop away behind.
          bullets.push(new Shot({
            x: stone.x - Math.sign(stone.vx) * 5, y: stone.y - 4, vx: -Math.sign(stone.vx) * rand(10, 25), vy: rand(-35, -15), gravity: 120, life: 1.2, art: 'gristOat',
          }));
        }
        stones = stones.filter((stone) => stone.x > box.x - 30 && stone.x < box.x + box.w + 30);
      },
    };
  },

  // Weighing up: it's very proud of its scales. The great beam of them
  // runs right across the box on a post in the middle, and it drops sacks
  // onto the pans (each sack's shadow shows which pan first). Down goes the
  // pan with the sack on, up goes the other one, and the flour in it is
  // flung up and over. The beam hurts, so pick a side of it; mind the sacks
  // coming down, and the flour coming off the high pan.
  gristScales(box, density, { Shot, Line, rand }) {
    const pivot = { x: box.x + box.w / 2, y: box.y + box.h / 2 + 6 };
    const HALF = 36;
    const TIP = 0.42;
    let beam = null;
    let tilt = 0;
    let want = 0;
    let t = 0;
    let next = 0.5;
    let sacks = [];
    const end = (side, angle = tilt) => ({ x: pivot.x + side * Math.cos(angle) * HALF, y: pivot.y + side * Math.sin(angle) * HALF });
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!beam) {
          beam = new Line({ x: pivot.x - HALF, y: pivot.y, angle: 0, length: HALF * 2, thickness: 3, warn: 0.6, life: 30, color: '#8a5a32' });
          bullets.push(beam);
          bullets.push(new Shot({ x: pivot.x, y: pivot.y + 4, harmless: true, life: 30, art: 'gristPost' }));
          return;
        }
        if (t >= next && t < 9.4) {
          next = t + rand(1.25, 1.45);
          // Onto the pan on your side, mostly.
          const side = Math.random() < 0.7 ? (soul.x < pivot.x ? -1 : 1) : (soul.x < pivot.x ? 1 : -1);
          const pan = end(side);
          const sack = new Shot({ x: pan.x, y: box.y - 4, vy: 30, gravity: 160, warn: 0.5, art: 'gristSack' });
          sack.side = side;
          sacks.push(sack);
          bullets.push(sack);
        }
        for (const sack of sacks) {
          if (sack.landed || sack.age < sack.warn) continue;
          if (sack.y < end(sack.side).y - 5) continue;
          // Thump: that side goes down, the other comes up and flings.
          sack.landed = true;
          sack.life = sack.age - sack.warn;
          want = sack.side * TIP;
          const high = end(-sack.side, want);
          for (let i = 0; i < 6; i++) {
            bullets.push(new Shot({
              x: high.x + rand(-3, 3), y: high.y - 2, vx: sack.side * rand(5, 40), vy: rand(-110, -80), gravity: 150, life: 2.2, art: 'gristPuff',
            }));
          }
        }
        sacks = sacks.filter((sack) => !sack.landed);
        // The beam swings over to where it's going (by its own velocity, so
        // it reads as moving).
        const step = Math.sign(want - tilt) * Math.min(Math.abs(want - tilt), 2.4 * dt);
        tilt += step;
        const left = end(-1);
        const realDt = Math.max(dt / density, 1e-4);
        beam.vx = (left.x - beam.x) / realDt;
        beam.vy = (left.y - beam.y) / realDt;
        beam.angle = tilt;
      },
    };
  },

  // Grain chute: a hopper slides along the top of the box pouring a stream
  // of oats straight down, turning back at each wall. It stops pouring now
  // and then to fill up, and that's your gap to get past the stream. Now and
  // then it lobs its oat loaf, which bounces round the box for a bit (it's
  // not sharing).
  gristChute(box, density, { Shot, rand, angleTo }) {
    const hopper = new Shot({ x: box.x + 6, y: box.y + 3, harmless: true, art: 'gristHopper' });
    let started = false;
    let dir = Math.random() < 0.5 ? 1 : -1;
    let pour = 0;
    let loafIn = 1.6;
    let t = 0;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        if (!started) {
          started = true;
          hopper.x = dir > 0 ? box.x + 6 : box.x + box.w - 6;
          bullets.push(hopper);
        }
        t += dt;
        hopper.x += dir * 34 * dt;
        if (hopper.x > box.x + box.w - 6) dir = -1;
        if (hopper.x < box.x + 6) dir = 1;
        if (t > 9.6) return;
        pour -= dt;
        const filling = t % 0.9 > 0.55;
        while (pour <= 0) {
          if (filling) { pour = 0; break; }
          pour += 0.08;
          bullets.push(new Shot({ x: hopper.x + rand(-1.5, 1.5), y: hopper.y + 3, vx: rand(-4, 4), vy: 50, gravity: 40, art: 'gristOat' }));
        }
        loafIn -= dt;
        if (loafIn <= 0) {
          loafIn = rand(1.6, 1.9);
          const aim = angleTo(hopper, soul);
          bullets.push(new Shot({ x: hopper.x, y: box.y + 4, vx: Math.cos(aim) * 55, vy: Math.abs(Math.sin(aim)) * 55, bounce: true, life: 2.2, art: 'gristLoaf' }));
        }
      },
    };
  },
};
