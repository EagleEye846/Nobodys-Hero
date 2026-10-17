import { defineBulletArt } from '../projectiles.js';

// The Chough's attacks. It's a mountain crow with a red beak and a wicked
// sense of humour, so it fights like a bird that thinks you're hilarious:
// swooping dives that shed feathers, pebbles dropped on you from above, a
// magpie's eye for anything shiny (and a very fast snatch), and its own
// "chee-OW!", which comes out as two rings of sound.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The box is black, so the birds are drawn in
// glossy blue-black with a lit sheen, not true black.

const CROW = { k: '#1c1a2c', b: '#3c3e5c', B: '#6a70a8', s: '#9aa4dc', r: '#ff5a3a', R: '#b8321e', e: '#f2ecff' };

// A chough on the wing, flying right: wings up, then down.
const FLY_UP = [
  '.....kk.....',
  '....kBsk....',
  '.....kBBk...',
  'kk..kbBbbk..',
  'kbbbbbbbbekr',
  '.kkbbbbbbkRr',
  '....kkkk....',
];
const FLY_DOWN = [
  '............',
  '............',
  'kk...kkkkk..',
  'kbbbbbbbbek.',
  '.kkbbBBbbkrr',
  '....kBBsk.Rr',
  '.....kkk....',
];
const mirror = (rows) => rows.map((row) => [...row].reverse().join(''));
defineBulletArt('choughFly', { frames: [FLY_UP, FLY_DOWN], palette: CROW, radius: 3, frameSeconds: 0.1 });
defineBulletArt('choughFlyLeft', { frames: [mirror(FLY_UP), mirror(FLY_DOWN)], palette: CROW, radius: 3, frameSeconds: 0.1 });

// Perched on the rim of the box, beak open for a "chee-OW!".
defineBulletArt('choughPerch', {
  frames: [
    ['..kkk...', '.kbbbk..', 'kbebbbk.', 'rRkbBbbk', '..kbBBsk', '..kbbBBk', '...kkkk.', '...r.r..'],
    ['..kkk...', '.kbbbk..', 'rkebbbk.', '.rRbBbbk', 'rRkbBBsk', '..kbbBBk', '...kkkk.', '...r.r..'],
  ],
  palette: CROW,
  radius: 3,
  frameSeconds: 0.2,
});

// A long black feather, see-sawing down.
defineBulletArt('choughFeather', {
  frames: [
    ['k....', 'BBb..', '.sBbk'],
    ['....k', '..bBB', 'kbBs.'],
  ],
  palette: CROW,
  radius: 1.5,
  frameSeconds: 0.3,
});

// A mountain pebble, and the grey shadow it throws on the floor of the box
// before it lands.
defineBulletArt('choughPebble', {
  frames: [['.sW.', 'sWWg', 'Wggg', '.gg.']],
  palette: { s: '#e0d8c8', W: '#b8b0a0', g: '#7a7466' },
  radius: 2,
  spin: 5,
});
defineBulletArt('choughShadow', {
  frames: [['.ggggg.', 'ggggggg', '.ggggg.']],
  palette: { g: '#4c4862' },
  radius: 2,
});

// Shiny things, as far as a chough is concerned: a brass button, a ring, a
// coin. They twinkle as they drift in.
const SHINY = { k: '#5a3a10', y: '#ffd25e', Y: '#c8962e', w: '#fff6c0', m: '#c9ccd6', M: '#8a8fa0' };
defineBulletArt('choughButton', {
  frames: [
    ['.kkk.', 'kyYyk', 'kYkYk', 'kyYyk', '.kkk.'],
    ['.kkk.', 'kwYyk', 'kYkYk', 'kyYwk', '.kkk.'],
  ],
  palette: SHINY,
  radius: 2.5,
  frameSeconds: 0.18,
});
defineBulletArt('choughRing', {
  frames: [
    ['.mmm.', 'm...m', 'M...m', 'M...M', '.MMM.'],
    ['.wmm.', 'm...m', 'M...w', 'M...M', '.MMM.'],
  ],
  palette: SHINY,
  radius: 2.5,
  frameSeconds: 0.18,
});
defineBulletArt('choughCoin', {
  frames: [
    ['.yyy.', 'yYwYy', 'yYYYy', 'yYYYy', '.yyy.'],
    ['..y..', '.yYy.', '.yYy.', '.yYy.', '..y..'],
  ],
  palette: SHINY,
  radius: 2.5,
  frameSeconds: 0.16,
});

// A piece of a "chee-OW!": a red crescent of sound, bulging the way it flies.
defineBulletArt('choughCaw', {
  frames: [['.r', 'rR', 'rR', 'rR', '.r']],
  palette: CROW,
  radius: 1.5,
  rotate: true,
});

// Where a chough streaks across to snatch something: a faint flashing line,
// then the bird.
const STREAK = '#aab0d8';

export const CHOUGH_ATTACKS = {
  // Dive! A chough blinks at a top or bottom corner, then swoops across the
  // box in a shallow arc that dips (or climbs) to the row you're on, shedding
  // feathers that see-saw down behind it. A moment later a second one dives
  // from the other side, aimed at wherever you are by then.
  choughDive(box, density, { Shot, every, rand, clamp }) {
    const middle = box.x + box.w / 2;
    const half = box.w / 2 + 6;
    let fromLeft = Math.random() < 0.5;
    let birds = [];
    let queued = [];
    const launch = (bullets, soul, left) => {
      const high = Math.random() < 0.6;
      const edgeY = high ? box.y + rand(4, 9) : box.y + box.h - rand(4, 9);
      // The bottom (or top) of the arc: your row, but never a flat line.
      const dipY = high ? clamp(soul.y, edgeY + 14, box.y + box.h - 6) : clamp(soul.y, box.y + 6, edgeY - 14);
      const x = left ? box.x + 5 : box.x + box.w - 5;
      const bird = new Shot({ x, y: edgeY, vx: left ? 85 : -85, warn: 0.55, art: left ? 'choughFly' : 'choughFlyLeft' });
      bird.edgeY = edgeY;
      bird.dipY = dipY;
      bird.featherIn = 0.1;
      bullets.push(bird);
      birds.push(bird);
    };
    const dive = every(1.6, 1.9, (bullets, soul) => {
      launch(bullets, soul, fromLeft);
      queued.push({ t: 0.55, left: !fromLeft });
      fromLeft = !fromLeft;
    });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        dive(dt, bullets, soul);
        for (const next of queued) {
          next.t -= dt;
          if (next.t <= 0) launch(bullets, soul, next.left);
        }
        queued = queued.filter((next) => next.t > 0);
        for (const bird of birds) {
          // Its height follows from how far across it is: a smooth dip.
          const u = clamp((bird.x - middle) / half, -1, 1);
          bird.y = bird.dipY + (bird.edgeY - bird.dipY) * u * u;
          if (bird.age < bird.warn) continue;
          bird.featherIn -= dt;
          if (bird.featherIn <= 0 && Math.abs(bird.x - middle) < box.w / 2 - 2) {
            bird.featherIn += 0.17;
            bullets.push(new Shot({
              x: bird.x,
              y: bird.y,
              vx: bird.vx * 0.08,
              vy: rand(10, 16),
              wobble: { amplitude: 2, frequency: 6 },
              life: 1.5,
              art: 'choughFeather',
            }));
          }
        }
        birds = birds.filter((bird) => bird.x > box.x - 12 && bird.x < box.x + box.w + 12);
      },
    };
  },

  // Bombs away: a chough flies along the top of the box with a beakful of
  // pebbles. Before each run, grey shadows blink on the floor in the columns
  // it'll drop on (always yours, and a few more), and it lets go of each one
  // as it passes over. A pebble that lands knocks up two chips.
  choughPebbles(box, density, { Shot, every, clamp }) {
    const columns = 8;
    const width = box.w / columns;
    const floor = box.y + box.h - 3;
    let fromLeft = Math.random() < 0.5;
    let runs = [];
    let falling = [];
    const run = every(1.75, 2.05, (bullets, soul) => {
      const yours = clamp(Math.floor((soul.x - box.x) / width), 0, columns - 1);
      const others = [...Array(columns).keys()].filter((c) => c !== yours).sort(() => Math.random() - 0.5);
      const drops = [yours, ...others.slice(0, 3)].map((column) => {
        const x = box.x + (column + 0.5) * width;
        const shadow = new Shot({ x, y: floor, art: 'choughShadow', harmless: true, life: 4 });
        bullets.push(shadow);
        return { x, shadow, dropped: false };
      });
      const bird = new Shot({
        x: fromLeft ? box.x - 8 : box.x + box.w + 8,
        y: box.y + 5,
        vx: fromLeft ? 62 : -62,
        art: fromLeft ? 'choughFly' : 'choughFlyLeft',
      });
      bullets.push(bird);
      runs.push({ bird, drops, fromLeft });
      fromLeft = !fromLeft;
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        run(dt, bullets, soul);
        for (const { bird, drops, fromLeft: right } of runs) {
          for (const drop of drops) {
            if (drop.dropped || (right ? bird.x < drop.x : bird.x > drop.x)) continue;
            drop.dropped = true;
            const pebble = new Shot({ x: drop.x, y: bird.y + 3, vy: 25, gravity: 230, art: 'choughPebble' });
            pebble.shadow = drop.shadow;
            bullets.push(pebble);
            falling.push(pebble);
          }
        }
        runs = runs.filter(({ drops }) => drops.some((drop) => !drop.dropped));
        for (const pebble of falling) {
          if (pebble.y < floor) continue;
          // Landed: the pebble and its shadow go, and two chips skip away.
          pebble.life = pebble.age;
          pebble.shadow.life = pebble.shadow.age;
          for (const side of [-1, 1]) {
            bullets.push(new Shot({ x: pebble.x, y: floor - 2, vx: side * 30, vy: -55, gravity: 230, life: 0.7, art: 'choughPebble' }));
          }
        }
        falling = falling.filter((pebble) => pebble.y < floor);
      },
    };
  },

  // Shiny! Trinkets drift into the box and stop, twinkling. Then a faint line
  // flashes across one's row, and a chough streaks along it to snatch it.
  // Mind the rows that flash.
  choughShiny(box, density, { Shot, Line, every, rand, pick, shuffleBag, spreadAcross }) {
    const side = shuffleBag(['left', 'right']);
    const rowY = spreadAcross(box.y + 8, box.y + box.h - 8, 5);
    const drift = 0.8;
    const look = 0.65;
    let shinies = [];
    const toss = every(0.75, 0.95, (bullets, soul) => {
      // One in three lands right on your row.
      const y = Math.random() < 0.34 ? soul.y : rowY();
      const x = rand(box.x + 10, box.x + box.w - 10);
      const from = { x: x + rand(-20, 20), y: Math.random() < 0.5 ? box.y - 4 : box.y + box.h + 4 };
      const trinket = new Shot({
        x: from.x,
        y: from.y,
        vx: (x - from.x) / drift,
        vy: (y - from.y) / drift,
        harmless: true,
        art: pick(['choughButton', 'choughRing', 'choughCoin']),
      });
      bullets.push(trinket);
      shinies.push({ trinket, t: drift, bird: null });
    });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        toss(dt, bullets, soul);
        for (const shiny of shinies) {
          const { trinket } = shiny;
          shiny.t -= dt;
          if (!shiny.spotted && shiny.t <= 0) {
            // It's landed: hold still, and a chough has spotted it.
            trinket.vx = trinket.vy = 0;
            const fromLeft = side() === 'left';
            shiny.spotted = true;
            const startX = fromLeft ? box.x - 6 : box.x + box.w + 6;
            bullets.push(new Line({
              x: startX, y: trinket.y, angle: fromLeft ? 0 : Math.PI, length: box.w + 12,
              thickness: 2, warn: look, grow: 420, life: 0.12, color: STREAK,
            }));
            shiny.bird = new Shot({
              x: fromLeft ? box.x + 4 : box.x + box.w - 4,
              y: trinket.y,
              vx: fromLeft ? 210 : -210,
              warn: look,
              art: fromLeft ? 'choughFly' : 'choughFlyLeft',
            });
            bullets.push(shiny.bird);
          }
          const { bird } = shiny;
          if (bird && bird.age >= bird.warn && Math.abs(bird.x - trinket.x) < 4) {
            trinket.life = trinket.age - trinket.warn;
            shiny.done = true;
          }
        }
        shinies = shinies.filter((shiny) => !shiny.done);
      },
    };
  },

  // "Chee-OW!" The chough hops to a perch on the rim of the box and calls.
  // "Chee" is a quick fan of red sound, "OW" a wider, slower one just after,
  // and each has one gap, never in the same place. Thread the first, then
  // the second.
  choughCaw(box, density, { Shot, every, rand, angleTo, shuffleBag }) {
    const perches = shuffleBag([
      { x: box.x + 7, y: box.y + 6 },
      { x: box.x + box.w / 2, y: box.y + 5 },
      { x: box.x + box.w - 7, y: box.y + 6 },
    ]);
    let perched = null;
    let calls = [];
    // A fan of `count` crescents `spread` radians wide, with a gap `gap` wide.
    const fan = (bullets, from, aim, { count, spread, speed, gap, gapAt }) => {
      for (let i = 0; i < count; i++) {
        if (i >= gapAt && i < gapAt + gap) continue;
        const angle = aim - spread / 2 + (i / (count - 1)) * spread;
        bullets.push(new Shot({ x: from.x, y: from.y + 2, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 2.2, art: 'choughCaw' }));
      }
    };
    const call = every(1.55, 1.85, (bullets, soul) => {
      const perch = perches();
      if (perched) perched.life = perched.age;
      perched = new Shot({ x: perch.x, y: perch.y, harmless: true, life: 1.7, art: 'choughPerch' });
      bullets.push(perched);
      const aim = angleTo(perch, soul);
      const cheeGap = 2 + Math.floor(Math.random() * 8);
      // The "OW" gap is well away from the "chee" one.
      let owGap = 2 + Math.floor(Math.random() * 11);
      if (Math.abs(owGap / 16 - cheeGap / 12) < 0.25) owGap = (owGap + 7) % 12 + 2;
      calls.push({ t: 0.35, perch, aim, chee: cheeGap, ow: owGap, said: 0 });
    }, { first: 0.15 });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        call(dt, bullets, soul);
        for (const c of calls) {
          c.t -= dt;
          if (c.said === 0 && c.t <= 0) {
            c.said = 1;
            c.t = 0.3;
            fan(bullets, c.perch, c.aim, { count: 13, spread: 2.4, speed: 62, gap: 2, gapAt: c.chee });
          } else if (c.said === 1 && c.t <= 0) {
            c.said = 2;
            fan(bullets, c.perch, c.aim + rand(-0.1, 0.1), { count: 17, spread: 2.6, speed: 40, gap: 3, gapAt: c.ow });
          }
        }
        calls = calls.filter((c) => c.said < 2);
      },
    };
  },
};
