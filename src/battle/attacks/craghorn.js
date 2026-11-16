import { defineBulletArt } from '../projectiles.js';

// The Craghorn's attacks. It's a mountain goat who's climbed the Long Stair
// every day for a hundred years, so it fights like one: charging head-down,
// racing you round and round (it always wins), its kids ricocheting off the
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

// The Craghorn's face, head-on, horns curled like two question marks: what
// you see coming round the track at you.
defineBulletArt('cragFace', {
  frames: [[
    'hh......hh',
    'hHk....kHh',
    '.hHkkkkHh.',
    '..kWwwWk..',
    '.kwewwewk.',
    '..kwwwwk..',
    '..kWwwWk..',
    '...knnk...',
    '....kk....',
  ]],
  palette: GOAT,
  hitbox: { w: 8, h: 8 },
});

// A stone kicked up off the track.
defineBulletArt('cragStone', {
  frames: [['.hh.', 'hHHh', 'hHhk', '.kk.']],
  palette: GOAT,
  radius: 1.5,
  spin: 6,
});

// A puff of dust where it stamps (harmless).
defineBulletArt('cragDust', {
  frames: [
    ['..w..', '.wWw.', 'wW.Ww'],
    ['.w.w.', 'wW.Ww', 'W...W'],
  ],
  palette: { w: '#c4bba8', W: '#8a7a64' },
  radius: 1,
  frameSeconds: 0.12,
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
    return { duration: 7, update: (dt, bullets, soul) => charge(dt, bullets, soul) };
  },

  // The race. "Last one to the top is..." The Craghorn runs laps of the box
  // the way it runs the mountain every morning: round the walls, cutting in a
  // little tighter every stretch, so its track spirals in toward the middle.
  // When it's run out of room it stops, stamps (blinking), and charges
  // straight through where you're standing to the wall. Then a fresh lap
  // starts from a corner. Round every other corner it kicks a stone back at you.
  // Keep inside its track, then get off its line.
  cragRace(box, density, { Shot, rand }) {
    const SPEED = 150;
    const LAPS = 1.5;
    const INSET_FROM = 5;
    const INSET_TO = 27;
    const STAMP = 0.55;
    // A point `u` laps round the inside of the box, `inset` from the walls,
    // clockwise from the top-left corner, and which way it's heading there.
    const onTrack = (u, inset) => {
      const x0 = box.x + inset;
      const y0 = box.y + inset;
      const w = box.w - inset * 2;
      const h = box.h - inset * 2;
      let d = (u - Math.floor(u)) * 2 * (w + h);
      if (d < w) return { x: x0 + d, y: y0, dx: 1, dy: 0 };
      d -= w;
      if (d < h) return { x: x0 + w, y: y0 + d, dx: 0, dy: 1 };
      d -= h;
      if (d < w) return { x: x0 + w - d, y: y0 + h, dx: -1, dy: 0 };
      d -= w;
      return { x: x0, y: y0 + h - d, dx: 0, dy: -1 };
    };
    let goat = null;
    let state = 'start';
    let u = 0;
    let wait = 0;
    let start = 0;
    let heading = null;
    let corners = 0;
    const startLap = (bullets) => {
      // Each lap starts from a different corner.
      start = Math.floor(rand(0, 4)) / 4;
      u = start;
      heading = null;
      const at = onTrack(u, INSET_FROM);
      goat = new Shot({ x: at.x, y: at.y, warn: 0.6, art: 'cragFace' });
      bullets.push(goat);
      state = 'lap';
    };
    return {
      duration: 7.6,
      update: (dt, bullets, soul) => {
        if (state === 'start') startLap(bullets);
        if (state === 'lap') {
          if (goat.age < goat.warn) return;
          const run = Math.min((u - start) / LAPS, 1);
          const inset = INSET_FROM + (INSET_TO - INSET_FROM) * run;
          const perimeter = 2 * (box.w + box.h - inset * 4);
          u += (SPEED * dt) / perimeter;
          const at = onTrack(u, inset);
          goat.x = at.x;
          goat.y = at.y;
          // Round each corner it kicks a stone back at you.
          if (heading && (heading.dx !== at.dx || heading.dy !== at.dy) && ++corners % 2 === 0) {
            const angle = Math.atan2(soul.y - at.y, soul.x - at.x) + rand(-0.15, 0.15);
            bullets.push(new Shot({ x: at.x, y: at.y, vx: Math.cos(angle) * 46, vy: Math.sin(angle) * 46, art: 'cragStone' }));
          }
          heading = at;
          if (u - start >= LAPS) {
            state = 'stamp';
            wait = STAMP;
            // (A puff of dust while it stamps, eyeing you up.)
            bullets.push(new Shot({ x: goat.x, y: goat.y + 6, art: 'cragDust', harmless: true, life: STAMP }));
          }
        } else if (state === 'stamp') {
          wait -= dt;
          if (wait > 0) return;
          const angle = Math.atan2(soul.y - goat.y, soul.x - goat.x);
          goat.vx = Math.cos(angle) * 125;
          goat.vy = Math.sin(angle) * 125;
          state = 'charge';
        } else if (state === 'charge') {
          // Off the far wall, and a new lap.
          if (goat.x < box.x - 6 || goat.x > box.x + box.w + 6 || goat.y < box.y - 6 || goat.y > box.y + box.h + 6) {
            goat.life = 0;
            state = 'start';
          }
        }
      },
    };
  },
  // The kids want to play: little goats spring off the cliff walls and
  // ricochet around the box, bouncing off every side. Each one blinks in a
  // corner first, then springs off at you (they want to play), give or
  // take. They don't stay long, but more keep coming.
  cragRicochet(box, density, { Shot, every, rand, shuffleBag }) {
    const corners = shuffleBag([
      { x: box.x + 5, y: box.y + 5, sx: 1, sy: 1 },
      { x: box.x + box.w - 5, y: box.y + 5, sx: -1, sy: 1 },
      { x: box.x + 5, y: box.y + box.h - 5, sx: 1, sy: -1 },
      { x: box.x + box.w - 5, y: box.y + box.h - 5, sx: -1, sy: -1 },
    ]);
    const spring = every(0.95, 1.2, (bullets, soul) => {
      const corner = corners();
      // The angle off the corner's floor or wall that points at you,
      // kept well into the box.
      const at = Math.atan2(Math.abs(soul.y - corner.y), Math.abs(soul.x - corner.x));
      const angle = Math.min(1.3, Math.max(0.25, at + rand(-0.15, 0.15)));
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
    return { duration: 7, update: (dt, bullets, soul) => spring(dt, bullets, soul) };
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
