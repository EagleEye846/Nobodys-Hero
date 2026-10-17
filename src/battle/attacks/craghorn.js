import { defineBulletArt } from '../projectiles.js';

// The Craghorn's attacks. It's a mountain goat who's climbed the Long Stair
// every day for a hundred years, so it fights like one: charging head-down,
// bleating loud enough to echo off the peaks, its kids ricocheting off the
// cliffs, and grazing its way across the mountain grass.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const GOAT = { k: '#120c1c', w: '#ece6da', W: '#c4bba8', h: '#8a7a64', H: '#b8a88e', e: '#ffd25e', n: '#e89ab0' };

// A goat's head, charging horns-first: drawn facing right, and mirrored for
// the ones that charge to the left (so they stay the right way up).
const HEAD = [
  '..kkk.kkk...',
  '.kWwwkhHhk..',
  'kWwwwwkhHhk.',
  'kWwewwwkhHk.',
  'kWwwwwwwkhk.',
  '.kWwwwwwwkk.',
  '..kWwwwnwk..',
  '...kkkkkk...',
];
defineBulletArt('cragHead', { frames: [HEAD], palette: GOAT, hitbox: { w: 10, h: 7 } });
defineBulletArt('cragHeadLeft', {
  frames: [HEAD.map((row) => [...row].reverse().join(''))],
  palette: GOAT,
  hitbox: { w: 10, h: 7 },
});

// A bleat: a little wavy "MEH" of sound.
defineBulletArt('cragBleat', {
  frames: [
    ['.w...', 'w.w.w', '...w.'],
    ['...w.', 'w.w.w', '.w...'],
  ],
  palette: { w: '#f2ecff' },
  radius: 2,
  frameSeconds: 0.1,
});

// A kid goat, legs tucked, mid-bounce.
defineBulletArt('cragKid', {
  frames: [
    ['.hk.hk', '.kwwwk', 'kwewwk', 'kwwwWk', '.kWWk.', '.k..k.'],
    ['.hk.hk', '.kwwwk', 'kwewwk', 'kwwwWk', '.kWWk.', 'k....k'],
  ],
  palette: GOAT,
  radius: 2.5,
  frameSeconds: 0.14,
});

// A tuft of mountain grass on the floor of the box (harmless; it shows where
// a blade is about to shoot up).
defineBulletArt('cragTuft', {
  frames: [[
    'g.g.g',
    '.ggg.',
  ]],
  palette: { g: '#6aa65c' },
  radius: 1,
});

// A clump of long grass blades, shooting up out of the ground.
defineBulletArt('cragBlade', {
  frames: [[
    '.G..G',
    '.g.g.',
    'Gg.gG',
    '.gGg.',
    'g.g.g',
    'gGg.g',
    '.g.gG',
    'Gg.g.',
    '.gGg.',
    'g.g.g',
    '.ggg.',
    '.ggg.',
  ]],
  palette: { g: '#8ac46a', G: '#4a8446' },
  hitbox: { w: 5, h: 12 },
});

export const CRAGHORN_ATTACKS = {
  // Head down, horns first: goats charge across the box two at a time, from
  // alternating sides. Each blinks at the edge first, then thunders across,
  // picking up speed. The first comes at the row you're in; the second takes
  // a row well away from it, a moment later.
  cragCharge(box, density, { Shot, every, rand, clamp }) {
    const top = box.y + 6;
    const bottom = box.y + box.h - 6;
    let fromLeft = Math.random() < 0.5;
    const charge = every(1.25, 1.55, (bullets, soul) => {
      const first = clamp(soul.y + rand(-4, 4), top, bottom);
      // Somewhere at least 22 pixels from the first.
      let second = rand(top, bottom - 44);
      if (second > first - 22) second += 44;
      second = clamp(second, top, bottom);
      for (const [i, y] of [first, second].entries()) {
        bullets.push(new Shot({
          x: fromLeft ? box.x + 6 : box.x + box.w - 6,
          y,
          vx: fromLeft ? 70 : -70,
          accel: 110,
          warn: 0.7 + i * 0.25,
          art: fromLeft ? 'cragHead' : 'cragHeadLeft',
        }));
      }
      fromLeft = !fromLeft;
    });
    return { duration: 6.5, update: (dt, bullets, soul) => charge(dt, bullets, soul) };
  },

  // A bleat that echoes off the peaks: rings of sound spread from the edges
  // of the box. Each ring has one gap in it, never quite where you are, so
  // you have to move to slip through it.
  cragBleat(box, density, { Shot, every, rand, angleTo, shuffleBag }) {
    const spots = [
      { x: box.x, y: box.y },
      { x: box.x + box.w, y: box.y },
      { x: box.x, y: box.y + box.h },
      { x: box.x + box.w, y: box.y + box.h },
      { x: box.x + box.w / 2, y: box.y - 2 },
    ];
    const spot = shuffleBag(spots);
    const notes = 36;
    const gap = 5;
    const bleat = every(1.35, 1.65, (bullets, soul) => {
      const from = spot();
      // The gap opens off to one side of you (far enough that it never
      // covers where you are).
      const toGap = angleTo(from, soul) + (Math.random() < 0.5 ? -1 : 1) * rand(0.65, 0.9);
      const gapStart = Math.round((toGap / (Math.PI * 2)) * notes) - Math.floor(gap / 2);
      for (let i = 0; i < notes; i++) {
        const slot = (((i - gapStart) % notes) + notes) % notes;
        if (slot < gap) continue;
        const angle = (i / notes) * Math.PI * 2;
        bullets.push(new Shot({
          x: from.x,
          y: from.y,
          vx: Math.cos(angle) * 42,
          vy: Math.sin(angle) * 42,
          life: 2.4,
          art: 'cragBleat',
        }));
      }
    });
    return { duration: 6.5, update: (dt, bullets, soul) => bleat(dt, bullets, soul) };
  },

  // The kids want to play: little goats spring off the cliff walls and
  // ricochet around the box, bouncing off every side. Each one blinks in a
  // corner first. They don't stay long, but more keep coming.
  cragRicochet(box, density, { Shot, every, rand, shuffleBag }) {
    const corners = shuffleBag([
      { x: box.x + 5, y: box.y + 5, sx: 1, sy: 1 },
      { x: box.x + box.w - 5, y: box.y + 5, sx: -1, sy: 1 },
      { x: box.x + 5, y: box.y + box.h - 5, sx: 1, sy: -1 },
      { x: box.x + box.w - 5, y: box.y + box.h - 5, sx: -1, sy: -1 },
    ]);
    const spring = every(0.95, 1.2, (bullets) => {
      const corner = corners();
      const angle = rand(0.45, 1.1);
      const speed = rand(58, 70);
      bullets.push(new Shot({
        x: corner.x,
        y: corner.y,
        vx: Math.cos(angle) * speed * corner.sx,
        vy: Math.sin(angle) * speed * corner.sy,
        bounce: true,
        warn: 0.6,
        life: 3.6,
        art: 'cragKid',
      }));
    });
    return { duration: 7, update: (dt, bullets) => spring(dt, bullets) };
  },

  // Grazing: the goat munches its way across the box, and blades of grass
  // shoot up out of the floor in a wave behind it, one column after another.
  // Each wave leaves a bitten-off gap where the grass doesn't grow; stand in
  // it, or outrun the wave.
  cragGraze(box, density, { Shot, every }) {
    const columns = 10;
    const width = box.w / columns;
    const floor = box.y + box.h - 2;
    let fromLeft = Math.random() < 0.5;
    let waves = [];
    const graze = every(2.0, 2.4, () => {
      waves.push({ next: 0, t: 0, fromLeft, gap: 1 + Math.floor(Math.random() * (columns - 3)) });
      fromLeft = !fromLeft;
    });
    return {
      duration: 7,
      update: (dt, bullets) => {
        graze(dt, bullets);
        for (const wave of waves) {
          wave.t -= dt;
          while (wave.t <= 0 && wave.next < columns) {
            const column = wave.fromLeft ? wave.next : columns - 1 - wave.next;
            wave.next++;
            wave.t += 0.13;
            if (column === wave.gap || column === wave.gap + 1) continue;
            const x = box.x + (column + 0.5) * width;
            bullets.push(new Shot({ x, y: floor, art: 'cragTuft', harmless: true, life: 0.6 }));
            bullets.push(new Shot({ x, y: floor + 6, vy: -95, warn: 0.5, art: 'cragBlade', angle: 0 }));
          }
        }
        waves = waves.filter((wave) => wave.next < columns);
      },
    };
  },
};
