import { defineBulletArt } from '../projectiles.js';

// The Puffcap's attacks. It's a fat, sleepy toadstool that puffs spores when
// it's startled, so everything it throws is a mushroom thing: puffballs that
// swell up and pop into spores, a fairy ring of little toadstools that comes
// up round you and closes in, curtains of spores shaken loose from the gills
// under its cap, and drowsy spore clouds that make you slow and heavy while
// its babies come hopping across the floor.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. Forty Winks nudges the soul itself (the clouds
// slow it), always gently enough to fight against.

const SHROOM = {
  k: '#24141c', c: '#b4566a', C: '#7a3048', h: '#e08a98', s: '#f4e8d0', f: '#eadcc0', e: '#1a0e12',
  b: '#d8c08a', B: '#a88a58', p: '#5a3a2a', o: '#c8a860', S: '#f0e0a0', y: '#fff6c0',
  t: '#e8cfa0', T: '#b08850',
};

// A spore: a little seed of dust, fat at the front with a wisp behind,
// pointing the way it flies, glinting now and then.
defineBulletArt('puffSpore', {
  frames: [
    ['..oo.', 'ooSSo', '..oo.'],
    ['..oo.', 'ooSyo', '..oo.'],
  ],
  palette: SHROOM,
  radius: 1.5,
  rotate: true,
  frameSeconds: 0.2,
});

// A puffball, falling: round and papery with a dark pore on top.
defineBulletArt('puffBall', {
  frames: [[
    '...k...',
    '..kpk..',
    '.kbbbk.',
    'kbsbbbk',
    'kbbbbBk',
    '.kBBBk.',
    '..kkk..',
  ]],
  palette: SHROOM,
  radius: 3,
});

// A puffball that's landed and is swelling up to pop, a little dust already
// puffing out of its pore.
defineBulletArt('puffSwell', {
  frames: [
    ['...o.o...', '....k....', '..kkpkk..', '.kbbbbbk.', 'kbsbbbbbk', 'kbbbbbbBk', 'kbbbbbBBk', '.kBBBBBk.', '..kkkkk..'],
    ['..o...o..', '...ok....', '..kkpkk..', '.kbbbbbk.', 'kbsbbbbbk', 'kbbbbbbBk', 'kbbbbbBBk', '.kBBBBBk.', '..kkkkk..'],
  ],
  palette: SHROOM,
  radius: 3.5,
  frameSeconds: 0.1,
});

// A little fairy-ring toadstool, pale and tan like the real ones.
defineBulletArt('puffRingCap', {
  frames: [['.kkk.', 'ktttk', 'kTTTk', '.kfk.', '.kfk.']],
  palette: SHROOM,
  radius: 2,
});

// A baby puffcap, hopping: a tiny rose cap, two dot eyes, two tiny feet.
defineBulletArt('puffBaby', {
  frames: [
    ['.kkkkk.', 'kcsccsk', 'kCCCCCk', '.kefek.', '.kfffk.', '..k.k..'],
    ['.kkkkk.', 'kcsccsk', 'kCCCCCk', '.kefek.', '.kfffk.', '.k...k.'],
  ],
  palette: SHROOM,
  radius: 2.5,
  frameSeconds: 0.18,
});

// A drowsy spore cloud: soft and lilac, with spores glinting in it. It doesn't
// hurt, but inside it you're heavy and slow.
defineBulletArt('puffCloud', {
  frames: [
    [
      '.....mmm...mmm.....',
      '...mmMMMm.mMMMmm...',
      '.mmMMMMMMmMMyMMMmm.',
      'mMMMyMMMMMMMMMMMMMm',
      'mMMMMMMMMMMMMyMMMMm',
      'mMMMMMMMyMMMMMMMMMm',
      'mMMyMMMMMMMMMMMyMMm',
      '.mMMMMMMMMMMMMMMMm.',
      '..mmMMMMyMMMMMMmm..',
      '....mmmMMMMMmmm....',
      '.......mmmmm.......',
    ],
    [
      '....mmm....mmm.....',
      '..mmMMMm..mMMMmm...',
      '.mmMMyMMMmMMMMMMmm.',
      'mMMMMMMMMMMMMMyMMMm',
      'mMMMMMMyMMMMMMMMMMm',
      'mMyMMMMMMMMMMMMMMMm',
      'mMMMMMMMMMMyMMMMMMm',
      '.mMMMMyMMMMMMMMMMm.',
      '..mmMMMMMMMMMyMmm..',
      '....mmmMMMMMmmm....',
      '.......mmmmm.......',
    ],
  ],
  palette: { m: '#8a7aa8', M: '#b8a8d0', y: '#f0e0a0' },
  radius: 9,
  frameSeconds: 0.4,
});

// A sleepy "z", floating up off you while you're drowsy (harmless).
defineBulletArt('puffZ', {
  frames: [['zzzz', '..z.', '.z..', 'zzzz']],
  palette: { z: '#d8ccf0' },
  radius: 1,
});

const GILL = '#e8d8a8';

export const PUFFCAP_ATTACKS = {
  // Startle Pop: it jumps at nothing, and puffballs come tumbling down out of
  // its cap. Each one lands, swells up for a moment, then pops into a ring of
  // spores. Every other one lands right where you are, so keep shuffling off
  // the spot, then out of the way of the ring.
  puffStartle(box, density, { Shot, every, rand, clamp }) {
    let falling = [];
    let swelling = [];
    let aimed = true;
    const drop = every(0.75, 0.95, (bullets, soul) => {
      const x = aimed ? clamp(soul.x, box.x + 6, box.x + box.w - 6) : rand(box.x + 8, box.x + box.w - 8);
      const landAt = aimed ? clamp(soul.y, box.y + 14, box.y + box.h - 6) : rand(box.y + 20, box.y + box.h - 8);
      aimed = !aimed;
      const ball = new Shot({ x, y: box.y - 4, vy: 25, gravity: 150, art: 'puffBall' });
      ball.landAt = landAt;
      bullets.push(ball);
      falling.push(ball);
    }, { first: 0.2 });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        drop(dt, bullets, soul);
        for (const ball of falling) {
          if (ball.y < ball.landAt) continue;
          // It lands, and swells.
          ball.life = ball.age;
          const swell = new Shot({ x: ball.x, y: ball.landAt, life: 0.5, art: 'puffSwell' });
          bullets.push(swell);
          swelling.push(swell);
        }
        falling = falling.filter((ball) => ball.y < ball.landAt);
        for (const swell of swelling) {
          if (swell.age < swell.life) continue;
          swell.popped = true;
          // Pop: eight spores, the ring turned a little differently each time.
          const turn = rand(0, Math.PI * 2);
          for (let i = 0; i < 8; i++) {
            const angle = turn + (i / 8) * Math.PI * 2;
            bullets.push(new Shot({
              x: swell.x, y: swell.y, vx: Math.cos(angle) * 52, vy: Math.sin(angle) * 52, accel: -14, life: 2, art: 'puffSpore',
            }));
          }
        }
        swelling = swelling.filter((swell) => !swell.popped);
      },
    };
  },

  // Fairy Ring: a ring of little toadstools sprouts up all round you,
  // blinking, with a gap in it. Then the ring closes in. Get out through the
  // gap before it shuts. The gap always opens toward the inside of the box.
  puffFairyRing(box, density, { Shot, every, rand, clamp }) {
    const count = 15;
    const radius = 30;
    const warn = 0.75;
    const closeIn = 1.1; // seconds to close from the edge to the middle
    let rings = [];
    const sprout = every(1.55, 1.75, (bullets, soul) => {
      const centre = { x: clamp(soul.x, box.x + 14, box.x + box.w - 14), y: clamp(soul.y, box.y + 14, box.y + box.h - 14) };
      // Pick a gap that's inside the box, so there's always a way out.
      let gapAngle = 0;
      for (let tries = 0; tries < 24; tries++) {
        gapAngle = rand(0, Math.PI * 2);
        const gx = centre.x + Math.cos(gapAngle) * radius;
        const gy = centre.y + Math.sin(gapAngle) * radius;
        if (gx > box.x + 6 && gx < box.x + box.w - 6 && gy > box.y + 6 && gy < box.y + box.h - 6) break;
      }
      const caps = [];
      for (let i = 0; i < count; i++) {
        const angle = gapAngle + ((i + 1.5) / (count + 2)) * Math.PI * 2;
        const cap = new Shot({
          x: centre.x + Math.cos(angle) * radius, y: centre.y + Math.sin(angle) * radius,
          vx: -Math.cos(angle) * (radius / closeIn), vy: -Math.sin(angle) * (radius / closeIn),
          warn, life: closeIn * 0.92, art: 'puffRingCap',
        });
        bullets.push(cap);
        caps.push(cap);
      }
      rings.push(caps);
    }, { first: 0.25 });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        sprout(dt, bullets, soul);
        rings = rings.filter((caps) => caps[0].age < caps[0].warn + caps[0].life);
      },
    };
  },

  // Gill Curtain: it tips its cap over the box, and spores pour down off the
  // gills underneath in streaks, dotted lines first to show where. The
  // streaks shift every time, so you sidestep, sidestep. Every fourth shake
  // it's a whole curtain with one gap near you: dart for it.
  puffGills(box, density, { Line, Shot, every, rand, clamp }) {
    let beat = 0;
    const spacing = 20;
    const streak = (bullets, x, warn) => {
      bullets.push(new Line({
        x, y: box.y, angle: Math.PI / 2, length: box.h, thickness: 6, warn, life: 0.45, grow: 320, color: GILL,
      }));
      // A spore or two drifts down at the top of each streak.
      bullets.push(new Shot({ x, y: box.y + 2, vy: 0, harmless: true, life: warn, art: 'puffSpore', angle: Math.PI / 2 }));
    };
    const shake = every(0.85, 0.85, (bullets, soul) => {
      beat++;
      if (beat % 4 === 0) {
        // The whole curtain, with one gap 24 pixels wide not far from you.
        const gapAt = clamp(soul.x + rand(-24, 24), box.x + 14, box.x + box.w - 14);
        // Streaks 8 apart overlap into a solid wall: no slivers to squeeze through.
        for (let x = box.x + 3; x < box.x + box.w; x += 8) {
          if (Math.abs(x - gapAt) < 12) continue;
          streak(bullets, x, 0.65);
        }
        streak(bullets, gapAt - 12, 0.65);
        streak(bullets, gapAt + 12, 0.65);
      } else {
        const offset = rand(0, spacing);
        for (let x = box.x + offset; x < box.x + box.w; x += spacing) streak(bullets, x, 0.5);
      }
    }, { first: 0.2 });
    return { duration: 6.8, update: (dt, bullets, soul) => shake(dt, bullets, soul) };
  },

  // Forty Winks: it yawns, and two drowsy spore clouds drift about the box.
  // They don't hurt, but inside one you're heavy and slow. Meanwhile its
  // babies come hopping in from the sides, bounce, bounce, bounce. Hop over
  // them, and stay out of the clouds while you do.
  puffFortyWinks(box, density, { Shot, every, rand }) {
    const floor = box.y + box.h;
    let clouds = [];
    let babies = [];
    let drowsy = 0;
    let last = null;
    let snore = 0;
    let fromLeft = Math.random() < 0.5;
    const hop = every(0.55, 0.75, (bullets) => {
      const height = rand(26, 58); // how high it hops
      const gravity = 220;
      const baby = new Shot({
        x: fromLeft ? box.x - 3 : box.x + box.w + 3, y: floor - 4,
        vx: (fromLeft ? 1 : -1) * rand(38, 50), vy: -Math.sqrt(2 * gravity * height), gravity, life: 4, warn: 0.2, art: 'puffBaby',
      });
      baby.bounceAt = floor - 3;
      bullets.push(baby);
      babies.push(baby);
      fromLeft = !fromLeft;
    }, { first: 0.6 });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        if (!clouds.length) {
          for (let i = 0; i < 2; i++) {
            const cloud = new Shot({
              x: box.x + box.w * (i ? 0.72 : 0.28), y: box.y + rand(22, box.h - 22),
              vx: (i ? -1 : 1) * rand(10, 15), vy: rand(-8, 8), bounce: true, harmless: true, life: 6.8, warn: 0.4, art: 'puffCloud',
            });
            bullets.push(cloud);
            clouds.push(cloud);
          }
        }
        hop(dt, bullets, soul);
        // Babies bounce off the floor, but walk out through the walls.
        for (const baby of babies) {
          if (baby.y >= baby.bounceAt && baby.vy > 0) {
            baby.y = baby.bounceAt;
            baby.vy = -baby.vy;
          }
        }
        babies = babies.filter((baby) => baby.age < baby.warn + baby.life);
        // Inside a cloud you move at under half speed, and a little "z" drifts up.
        if (clouds.some((cloud) => cloud.age >= cloud.warn && Math.hypot(cloud.x - soul.x, cloud.y - soul.y) < 10)) drowsy = 0.3;
        if (drowsy > 0 && last) {
          drowsy -= dt;
          soul.x = last.x + (soul.x - last.x) * 0.45;
          soul.y = last.y + (soul.y - last.y) * 0.45;
          snore -= dt;
          if (snore <= 0) {
            snore = 0.35;
            bullets.push(new Shot({ x: soul.x + 3, y: soul.y - 5, vx: 6, vy: -14, harmless: true, life: 0.7, art: 'puffZ' }));
          }
        }
        last = { x: soul.x, y: soul.y };
      },
    };
  },
};
