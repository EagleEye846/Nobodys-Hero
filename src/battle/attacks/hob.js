import { defineBulletArt } from '../projectiles.js';

// The Hob's attacks. It's the house-hob of Hollin, and it has kept every
// cottage spotless for fifty years in case the families come home, so it
// fights with what a hob keeps house with: its broom, the dust bunnies it
// chases out from under the beds, the good plates it lays out every evening,
// the kettle it keeps on the boil, and the ring of keys to every empty door.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const BROOM = { k: '#1e140e', h: '#b07a46', H: '#7a4e28', y: '#e8c46a', Y: '#a87e30' };
const DUST = { d: '#b8b0c8', D: '#867e98', e: '#2a2230', w: '#ece6f4' };
const CROCKERY = { k: '#2a2a3a', p: '#f4f0e8', P: '#c8c2b4', b: '#5a8ad0', B: '#3a5a9a', s: '#c8ccd8', S: '#8a90a0' };
const KETTLE = { k: '#1e1a22', c: '#b86a3a', C: '#7a4220', h: '#e8a070', w: '#f4f4fa', W: '#c0c4d8', b: '#7ac0f0', B: '#4a8ad0' };
const KEYS = { k: '#2a2010', y: '#e8c45a', Y: '#a8862a', r: '#7a6a5a', R: '#4e4236' };

// The broom's handle, a bit at a time, and its bristles.
defineBulletArt('hobHandle', {
  frames: [['.hh.', 'hHHh', '.hh.']],
  palette: BROOM,
  radius: 2,
});
defineBulletArt('hobBristles', {
  frames: [['.yYy.', 'yYyYy', 'YyYyY', 'yYyYy', '.yYy.']],
  palette: BROOM,
  radius: 3,
  spin: 2,
});

// A dust bunny, with its two little eyes, hopping (squashed, then tall); and
// the motes it puffs into.
defineBulletArt('hobBunny', {
  frames: [
    ['.......', '.dDdDd.', 'dwedewd', 'dDdddDd', '.DdDdD.'],
    ['..d.d..', '.dDdDd.', 'dwedewd', 'dDdddDd', '.DdDdD.'],
  ],
  palette: DUST,
  radius: 2.5,
  frameSeconds: 0.18,
});
defineBulletArt('hobMote', {
  frames: [['.d.', 'dwD', '.D.'], ['d.D', '.w.', 'D.d']],
  palette: DUST,
  radius: 1.2,
  frameSeconds: 0.2,
});

// The good plates, with the blue band round the rim; a knife and a fork,
// drawn pointing right; and a cup.
defineBulletArt('hobPlate', {
  frames: [['..kkkk..', '.kbbbbk.', 'kbpppPbk', 'kbpPppbk', 'kbppPpbk', '.kbBBbk.', '..kkkk..']],
  palette: CROCKERY,
  radius: 3.5,
  spin: 6,
});
defineBulletArt('hobKnife', {
  frames: [['kk......', 'SSsssss.', 'kk.ssss.']],
  palette: CROCKERY,
  radius: 1.5,
  rotate: true,
});
defineBulletArt('hobFork', {
  frames: [['....s.s.', 'SSSsssss', '....s.s.']],
  palette: CROCKERY,
  radius: 1.5,
  rotate: true,
});
defineBulletArt('hobCup', {
  frames: [['kkkkk..', 'kpbpkk.', 'kpppk.k', 'kpPpkk.', '.kkk...']],
  palette: CROCKERY,
  radius: 2.5,
  spin: 5,
});

// The kettle (harmless: the steam out of it hurts), rattling on the boil; a
// puff of steam; and a drop of boiling water.
defineBulletArt('hobKettle', {
  frames: [
    ['...kk.....', '..khhk....', '.kkkkkk...', 'kcchccck..', 'kchcccCkk.', 'kccccCCk.k', '.kCCCCk...'],
    ['....kk....', '...khhk...', '..kkkkkk..', '.kcchccck.', '.kchcccCk.', '.kccccCCkk', '..kCCCCk..'],
  ],
  palette: KETTLE,
  radius: 4,
  frameSeconds: 0.08,
});
defineBulletArt('hobSteam', {
  frames: [
    ['.ww.', 'wWww', 'wwWw', '.ww.'],
    ['.w.w', 'wWw.', '.wWw', 'w.w.'],
  ],
  palette: KETTLE,
  radius: 2,
  frameSeconds: 0.22,
});
defineBulletArt('hobDrop', {
  frames: [['.b.', 'bwb', 'BbB']],
  palette: KETTLE,
  radius: 1.3,
});

// The iron ring the keys hang on (harmless), and a key, drawn pointing right
// (out from the ring, or where it's thrown).
defineBulletArt('hobRing', {
  frames: [['.rrr.', 'rR.Rr', 'r...r', 'rR.Rr', '.rrr.']],
  palette: KEYS,
  radius: 2.5,
  spin: 1,
});
defineBulletArt('hobKey', {
  frames: [['.yy.....', 'y.Yyyyyy', '.yy..Y.Y']],
  palette: KEYS,
  radius: 1.8,
  rotate: true,
});

export const HOB_ATTACKS = {
  // A good sweep: it plants its broom in a corner of the box and sweeps it
  // round like a hand on a clock, from one wall to the other. The broom only
  // reaches so far, so the safe spot is the far corner. Then it picks a new
  // corner. The bristles kick up dust as they go.
  hobSweep(box, density, { Shot, rand, clamp, shuffleBag }) {
    const corners = shuffleBag([
      { x: box.x, y: box.y, from: 0, to: Math.PI / 2 },
      { x: box.x + box.w, y: box.y, from: Math.PI, to: Math.PI / 2 },
      { x: box.x, y: box.y + box.h, from: 0, to: -Math.PI / 2 },
      { x: box.x + box.w, y: box.y + box.h, from: Math.PI, to: (3 * Math.PI) / 2 },
    ]);
    const warn = 0.55;
    const travel = 1.0;
    let sweeps = [];
    let made = 0;
    let t = 0;
    const plant = (bullets) => {
      const c = corners();
      const flip = Math.random() < 0.5;
      const pieces = [];
      for (let r = 8; r <= 52; r += 5) pieces.push({ r, shot: new Shot({ x: 0, y: 0, warn, art: 'hobHandle' }) });
      for (const r of [57, 62]) pieces.push({ r, tip: true, shot: new Shot({ x: 0, y: 0, warn, art: 'hobBristles' }) });
      const sweep = { c, from: flip ? c.to : c.from, to: flip ? c.from : c.to, pieces, t: 0, dust: 0.1 };
      place(sweep);
      bullets.push(...pieces.map((p) => p.shot));
      sweeps.push(sweep);
    };
    // Sets the broom where it is this far into its sweep, and returns how far.
    const place = (sweep) => {
      const u = clamp((sweep.t - warn) / travel, 0, 1);
      const eased = u * u * (3 - 2 * u);
      sweep.angle = sweep.from + (sweep.to - sweep.from) * eased;
      for (const p of sweep.pieces) {
        p.shot.x = sweep.c.x + Math.cos(sweep.angle) * p.r;
        p.shot.y = sweep.c.y + Math.sin(sweep.angle) * p.r;
      }
      return u;
    };
    return {
      duration: 6.4,
      update: (dt, bullets) => {
        t += dt;
        if (made < 4 && t >= 0.1 + made * 1.55) {
          plant(bullets);
          made++;
        }
        for (const sweep of sweeps) {
          sweep.t += dt;
          const u = place(sweep);
          if (u > 0.05 && u < 0.95) {
            sweep.dust -= dt;
            if (sweep.dust <= 0) {
              // A puff of dust off the bristles, out toward the far corner.
              sweep.dust += 0.16;
              const out = sweep.angle + rand(-0.3, 0.3);
              bullets.push(new Shot({ x: sweep.c.x + Math.cos(out) * 62, y: sweep.c.y + Math.sin(out) * 62, vx: Math.cos(out) * 34, vy: Math.sin(out) * 34, life: 0.7, art: 'hobMote' }));
            }
          }
          if (u < 1) continue;
          for (const p of sweep.pieces) p.shot.life = p.shot.age - p.shot.warn;
          sweep.done = true;
        }
        sweeps = sweeps.filter((sweep) => !sweep.done);
      },
    };
  },

  // Supper's on: it lays a place at the table, three at a time, blinking
  // while it sets them out: a plate with a knife on one side and a fork on
  // the other. One is always laid right where you are. Then it clears them
  // all away at once: the plate skims off sideways, the knife flies up and
  // the fork flies down. Step straight up or down, between them.
  hobTable(box, density, { Shot, every, rand, clamp }) {
    const warn = 0.75;
    let places = [];
    const lay = (bullets, x, y) => {
      const towardRight = x < box.x + box.w / 2;
      places.push({
        t: 0,
        plate: new Shot({ x, y, warn, art: 'hobPlate' }),
        knife: new Shot({ x: x + 8, y, warn, angle: -Math.PI / 2, art: 'hobKnife' }),
        fork: new Shot({ x: x - 8, y, warn, angle: Math.PI / 2, art: 'hobFork' }),
        dir: towardRight ? 1 : -1,
      });
      const p = places[places.length - 1];
      bullets.push(p.plate, p.knife, p.fork);
    };
    const supper = every(1.25, 1.35, (bullets, soul) => {
      const spots = [{ x: clamp(soul.x, box.x + 10, box.x + box.w - 10), y: clamp(soul.y, box.y + 6, box.y + box.h - 6) }];
      for (let tries = 0; spots.length < 3 && tries < 30; tries++) {
        const spot = { x: rand(box.x + 10, box.x + box.w - 10), y: rand(box.y + 8, box.y + box.h - 8) };
        if (spots.every((s) => Math.abs(s.x - spot.x) > 20 || Math.abs(s.y - spot.y) > 12)) spots.push(spot);
      }
      for (const s of spots) lay(bullets, s.x, s.y);
    }, { first: 0.15 });
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        if (places.length < 15) supper(dt, bullets, soul);
        for (const p of places) {
          p.t += dt;
          if (p.t < warn || p.cleared) continue;
          // Cleared away.
          p.cleared = true;
          p.plate.vx = p.dir * 75;
          p.knife.vy = -85;
          p.fork.vy = 85;
          // Now and then a cup goes with the plate, the other way.
          if (Math.random() < 0.35) bullets.push(new Shot({ x: p.plate.x, y: p.plate.y, vx: -p.dir * 55, vy: -30, gravity: 90, art: 'hobCup' }));
        }
      },
    };
  },

  // Kettle's on: its kettle trundles along the bottom of the box after you,
  // rattles on the boil (spitting drops of boiling water out to the sides),
  // then stops dead and whistles a column of steam straight up. Don't be
  // above it when it whistles.
  hobKettle(box, density, { Shot, rand, clamp }) {
    const floor = box.y + box.h - 5;
    const kettle = new Shot({ x: box.x + box.w / 2, y: floor, harmless: true, art: 'hobKettle' });
    const rattle = 0.75;
    const whistle = 0.95;
    let t = 0;
    let started = false;
    let spit = 0;
    let puff = 0;
    return {
      duration: 6.4,
      update: (dt, bullets, soul) => {
        if (!started) {
          started = true;
          bullets.push(kettle);
        }
        t += dt;
        if (t > 6.0) return;
        const cycle = (rattle + whistle) + 0.1;
        const into = t % cycle;
        if (into < rattle) {
          // On the boil: it follows you, shaking, and spits.
          const want = clamp(soul.x, box.x + 6, box.x + box.w - 6);
          kettle.x += clamp(want - kettle.x, -38 * dt, 38 * dt);
          kettle.y = floor + rand(-0.6, 0.6);
          spit -= dt;
          if (spit <= 0) {
            spit += 0.28;
            const side = Math.random() < 0.5 ? -1 : 1;
            bullets.push(new Shot({ x: kettle.x + side * 3, y: kettle.y - 4, vx: side * rand(28, 50), vy: -rand(80, 105), gravity: 160, life: 1.6, art: 'hobDrop' }));
          }
        } else if (into < rattle + whistle) {
          // The whistle: steam, straight up, spreading as it slows.
          kettle.y = floor;
          puff -= dt;
          while (puff <= 0) {
            puff += 0.05;
            bullets.push(new Shot({
              x: kettle.x + rand(-2, 2), y: kettle.y - 5, vx: rand(-14, 14), vy: -rand(95, 110), accel: -45,
              wobble: { amplitude: 1.5, frequency: 7 }, life: 1.3, art: 'hobSteam',
            }));
          }
        }
      },
    };
  },

  // The keys to every door: its great iron ring of keys floats round the
  // box, turning, and breathes in and out as it's jangled. There's a gap
  // where three keys are missing (the doors with nobody behind them), and
  // inside the ring is safe. Every so often it throws a key at you.
  hobKeys(box, density, { Shot, every, rand, angleTo }) {
    const count = 18;
    const missing = 3;
    const hub = new Shot({ x: box.x + box.w / 2, y: box.y + box.h / 2, harmless: true, art: 'hobRing' });
    const keys = [];
    for (let i = missing; i < count; i++) keys.push({ i, shot: new Shot({ x: hub.x, y: hub.y, warn: 0.6, art: 'hobKey' }) });
    const phase = rand(0, Math.PI * 2);
    const turn = Math.random() < 0.5 ? 1.3 : -1.3;
    let t = 0;
    let started = false;
    const toss = every(1.3, 1.5, (bullets, soul) => {
      const angle = angleTo(hub, soul);
      const r = radius();
      bullets.push(new Shot({ x: hub.x + Math.cos(angle) * r, y: hub.y + Math.sin(angle) * r, vx: Math.cos(angle) * 70, vy: Math.sin(angle) * 70, warn: 0.25, art: 'hobKey' }));
    }, { first: 1.2 });
    const radius = () => 21 + Math.sin(t * 2.6 + phase) * 9;
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        if (!started) {
          started = true;
          bullets.push(hub, ...keys.map((k) => k.shot));
        }
        t += dt;
        // The ring drifts round the box in a slow figure of eight.
        hub.x = box.x + box.w / 2 + Math.sin(t * 0.7 + phase) * 16;
        hub.y = box.y + box.h / 2 + Math.sin(t * 1.4 + phase) * 12;
        const r = radius();
        for (const k of keys) {
          const angle = (k.i / count) * Math.PI * 2 + t * turn;
          k.shot.x = hub.x + Math.cos(angle) * r;
          k.shot.y = hub.y + Math.sin(angle) * r;
          k.shot.angle = angle;
        }
        if (t < 6) toss(dt, bullets, soul);
      },
    };
  },

  // Out from under the beds: dust bunnies come hopping in along the floor
  // from both sides, some in little hops and some in big ones. On their
  // third landing they burst into a puff of motes. Meanwhile it beats a rug
  // somewhere up above, and dust sifts down from the top.
  hobDust(box, density, { Shot, every, rand, pick }) {
    const floor = box.y + box.h - 3;
    let bunnies = [];
    let fromLeft = Math.random() < 0.5;
    const hop = every(0.42, 0.55, (bullets) => {
      const speed = rand(32, 46);
      const bunny = new Shot({
        x: fromLeft ? box.x - 4 : box.x + box.w + 4, y: floor, vx: fromLeft ? speed : -speed, gravity: 230, art: 'hobBunny',
      });
      bunny.jump = pick([85, 100, 125]);
      bunny.vy = -bunny.jump;
      bunny.landings = 0;
      bullets.push(bunny);
      bunnies.push(bunny);
      fromLeft = !fromLeft;
    }, { first: 0.15 });
    const sift = every(0.3, 0.45, (bullets) => {
      bullets.push(new Shot({ x: rand(box.x + 4, box.x + box.w - 4), y: box.y - 3, vy: rand(22, 30), wobble: { amplitude: 2, frequency: 3 }, art: 'hobMote' }));
    }, { first: 0.8 });
    return {
      duration: 6.6,
      update: (dt, bullets) => {
        hop(dt, bullets);
        sift(dt, bullets);
        for (const bunny of bunnies) {
          if (bunny.vy <= 0 || bunny.y < floor) continue;
          bunny.y = floor;
          if (++bunny.landings < 3) {
            bunny.vy = -bunny.jump;
            continue;
          }
          // Poof.
          bunny.done = true;
          bunny.life = bunny.age - bunny.warn;
          for (let i = 0; i < 5; i++) {
            const angle = -Math.PI / 2 + (i - 2) * 0.4;
            bullets.push(new Shot({ x: bunny.x, y: bunny.y - 2, vx: Math.cos(angle) * 36, vy: Math.sin(angle) * 36, life: 0.9, art: 'hobMote' }));
          }
        }
        bunnies = bunnies.filter((bunny) => !bunny.done);
      },
    };
  },
};
