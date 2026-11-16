import { defineBulletArt } from '../projectiles.js';

// The Puffcap's attacks. It's a fat, sleepy toadstool that puffs spores when
// it's startled, so everything it throws is a mushroom thing: puffballs that
// swell up and pop into spores, drowsy spore clouds that make you slow and
// heavy while its babies come hopping across the floor, a box full of jumpy
// little puffcaps dozing that go POOF if you come too near, and the first
// two notes of its song, hummed over and over.
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

// A little puffcap fast asleep (eyes shut), before something startles it.
defineBulletArt('puffNapper', {
  frames: [['.kkkkk.', 'kcsccsk', 'kCCCCCk', '.kfffk.', '.kfffk.', '..k.k..']],
  palette: SHROOM,
  radius: 2.5,
});

// A note of its humming: a little floating crotchet.
defineBulletArt('puffNote', {
  frames: [['...Sk', '...S.', '...S.', '.SSS.', 'SSSS.', '.SS..'], ['...Sk', '...Sk', '...S.', '.SSS.', 'SSSS.', '.SS..']],
  palette: SHROOM,
  radius: 2,
  frameSeconds: 0.2,
});

// Changes a thing's look (to the art of a bullet made with the new one).
const LOOKS = {};
const setLook = (shot, name, Shot) => {
  LOOKS[name] ??= new Shot({ x: 0, y: 0, art: name }).art;
  shot.artName = name;
  shot.art = LOOKS[name];
};

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
      duration: 8,
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

  // Forty Winks: it yawns, and two drowsy spore clouds drift about the box.
  // They don't hurt, but inside one you're heavy and slow. Meanwhile its
  // babies come hopping in from the sides (off the floor, or jumping in from
  // up the walls), bounce, bounce, bounce. Hop over them, and stay out of
  // the clouds while you do.
  puffFortyWinks(box, density, { Shot, every, rand }) {
    const floor = box.y + box.h;
    let clouds = [];
    let babies = [];
    let drowsy = 0;
    let last = null;
    let snore = 0;
    let fromLeft = Math.random() < 0.5;
    let hops = 0;
    const hop = every(0.55, 0.75, (bullets) => {
      // How high it hops: mostly big hops, up to the top of the box, and
      // every third one a little scurry along the floor.
      const height = hops++ % 3 === 2 ? rand(6, 10) : rand(30, 72);
      const gravity = 220;
      // Some come in off the floor, some jump in from up the wall.
      const fromWall = hops % 2 === 0;
      const y = fromWall ? rand(box.y + 4, box.y + 26) : floor - 4;
      const baby = new Shot({
        x: fromLeft ? box.x - 3 : box.x + box.w + 3, y,
        vx: (fromLeft ? 1 : -1) * rand(38, 50), vy: fromWall ? rand(-15, 10) : -Math.sqrt(2 * gravity * height), gravity, life: 4, warn: 0.2, art: 'puffBaby',
      });
      baby.bounceAt = floor - 3;
      bullets.push(baby);
      babies.push(baby);
      fromLeft = !fromLeft;
    }, { first: 0.6 });
    return {
      duration: 8,
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
  // Don't wake them: little puffcaps are dozing all over the box. Every one
  // of them is jumpy: go too near and its eyes pop open, it jumps, and it
  // goes POOF in a ring of spores. Then it settles down somewhere else.
  // Meanwhile spores keep sifting down from above (every third right over
  // you), so you can't keep still: pick your way between the sleepers.
  puffJumpy(box, density, { Shot, every, rand, clamp, pointAwayFrom }) {
    const NEAR = 15;
    let nappers = [];
    let started = false;
    let t = 0;
    let sift = 0;
    const settle = (bullets, soul, warn = 0.6) => {
      const at = pointAwayFrom(box, soul, 30, 8);
      const napper = new Shot({ x: at.x, y: at.y, warn, art: 'puffNapper' });
      bullets.push(napper);
      nappers.push(napper);
    };
    const drift = every(0.25, 0.31, (bullets, soul) => {
      const x = sift++ % 3 === 0 ? clamp(soul.x, box.x + 4, box.x + box.w - 4) : rand(box.x + 4, box.x + box.w - 4);
      bullets.push(new Shot({ x, y: box.y - 2, vy: 34, warn: 0.2, art: 'puffSpore', angle: Math.PI / 2 }));
    });
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!started) {
          started = true;
          for (let i = 0; i < 5; i++) settle(bullets, soul);
        }
        drift(dt, bullets, soul);
        for (const napper of nappers) {
          if (napper.age < napper.warn) continue;
          if (napper.startled === undefined && Math.hypot(soul.x - napper.x, soul.y - napper.y) < NEAR) {
            // Eek! Eyes open, a little jump...
            napper.startled = t;
            setLook(napper, 'puffBaby', Shot);
            napper.vy = -20;
            napper.gravity = 120;
          }
          if (napper.startled !== undefined && t - napper.startled > 0.35 && !napper.popped) {
            // ...POOF.
            napper.popped = true;
            napper.life = napper.age - napper.warn;
            const turn = rand(0, Math.PI * 2);
            for (let i = 0; i < 8; i++) {
              const a = turn + (i / 8) * Math.PI * 2;
              bullets.push(new Shot({ x: napper.x, y: napper.y, vx: Math.cos(a) * 44, vy: Math.sin(a) * 44, life: 1.4, art: 'puffSpore' }));
            }
            if (t < 9) settle(bullets, soul, 0.9);
          }
        }
        nappers = nappers.filter((napper) => !napper.popped);
      },
    };
  },

  // Humming: it only knows the first two notes of its song, so that's what
  // it hums, over and over: a little cluster of notes floats across the box
  // at one height, then another at a second height, da-DUM, da-DUM. The
  // first note always comes along your row. Learn the two heights and
  // stand clear of them. Every few bars it loses its place and starts again,
  // two new heights (they flash across the box first).
  puffHum(box, density, { Line, Shot, rand, clamp }) {
    let t = 0;
    let verse = null;
    let next = 0.2;
    const fromRight = Math.random() < 0.5;
    const startVerse = (bullets, soul) => {
      const first = clamp(soul.y, box.y + 8, box.y + box.h - 8);
      let second = rand(box.y + 8, box.y + box.h - 8);
      for (let tries = 0; tries < 10 && Math.abs(second - first) < 24; tries++) second = rand(box.y + 8, box.y + box.h - 8);
      for (const y of [first, second]) bullets.push(new Line({ x: box.x, y, angle: 0, length: box.w, thickness: 14, warn: 0.7, life: 0, color: '#f0e0a0' }));
      verse = { lanes: [first, second], bars: 0, beat: 0, at: t + 0.7 };
    };
    const note = (bullets, y) => {
      for (let k = -1; k <= 1; k++) {
        const x = fromRight ? box.x + box.w + 4 : box.x - 4;
        bullets.push(new Shot({
          x, y: y + k * 5, vx: (fromRight ? -1 : 1) * 62, wobble: { amplitude: 1.5, frequency: 9 }, art: 'puffNote',
        }));
      }
    };
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!verse && t >= next) startVerse(bullets, soul);
        if (!verse || t < verse.at) return;
        // da...
        note(bullets, verse.lanes[verse.beat]);
        verse.beat = 1 - verse.beat;
        // ...DUM. (Then a breath before the next bar.)
        verse.at = t + (verse.beat === 1 ? 0.32 : 0.55);
        if (verse.beat === 0 && ++verse.bars >= 4) {
          verse = null;
          next = t + 0.5;
        }
      },
    };
  },
};
