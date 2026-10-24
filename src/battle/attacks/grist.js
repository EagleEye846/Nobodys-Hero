import { defineBulletArt } from '../projectiles.js';

// Grist's attacks. It's the mill rat who calls itself the Miller, so it
// fights with whatever's lying about the old mill: sacks of flour that burst,
// the runaway millstone, oats and grain by the chuteful, the paddles off the
// waterwheel, and its own long whip of a tail.
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
const TAIL = '#e09a9a';

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

// A waterwheel paddle, a plank with water slopping off it.
defineBulletArt('gristPaddle', {
  frames: [
    ['kkkkkkkkkk', 'kwWwwWwwWk', 'kkkkkkkkkk', '.b..B..b..'],
    ['kkkkkkkkkk', 'kwWwwWwwWk', 'kkkkkkkkkk', '..B..b..B.'],
  ],
  palette: PADDLE,
  hitbox: { w: 10, h: 3 },
  frameSeconds: 0.18,
});

// A drop of millrace water.
defineBulletArt('gristDrop', {
  frames: [['.b.', 'bBb', '.b.']],
  palette: PADDLE,
  radius: 1.2,
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
      duration: 6.5,
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
      duration: 6.6,
      update: (dt, bullets) => {
        t += dt;
        if (t >= next && t < 5.6) {
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

  // Tail whip: it spins round and cracks its long tail across the box from
  // one wall, aimed at you. You see a faint line where it'll land, then it
  // snaps. The crack knocks oats loose from the tip. Faster at the end, when
  // it's showing off.
  gristTail(box, density, { Shot, Line, rand, angleTo, shuffleBag }) {
    const side = shuffleBag(['left', 'right', 'top', 'bottom']);
    let whips = [];
    let next = 0.15;
    let t = 0;
    const crack = (bullets, soul) => {
      const s = side();
      const from = {
        left: { x: box.x - 2, y: rand(box.y + 8, box.y + box.h - 8) },
        right: { x: box.x + box.w + 2, y: rand(box.y + 8, box.y + box.h - 8) },
        top: { x: rand(box.x + 8, box.x + box.w - 8), y: box.y - 2 },
        bottom: { x: rand(box.x + 8, box.x + box.w - 8), y: box.y + box.h + 2 },
      }[s];
      const angle = angleTo(from, soul);
      const length = 95;
      const warn = t > 4 ? 0.45 : 0.6;
      bullets.push(new Line({ x: from.x, y: from.y, angle, length, thickness: 3, warn, life: 0.2, color: TAIL }));
      // This pattern's clock runs `density` times faster than the bullets',
      // so the oats fly when the tail really cracks.
      whips.push({ from, angle, length, at: warn * density });
    };
    return {
      duration: 6.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 5.8) {
          crack(bullets, soul);
          next = t + (t > 4 ? 0.55 : 0.75);
        }
        for (const whip of whips) {
          whip.at -= dt;
          if (whip.at > 0) continue;
          whip.done = true;
          // The tip's out past the far wall, so the oats fly from where the
          // tail crosses back into the box: a few points along it.
          for (let i = 1; i <= 3; i++) {
            const d = (whip.length * i) / 4;
            const x = whip.from.x + Math.cos(whip.angle) * d;
            const y = whip.from.y + Math.sin(whip.angle) * d;
            const away = whip.angle + (i % 2 ? Math.PI / 2 : -Math.PI / 2);
            bullets.push(new Shot({ x, y, vx: Math.cos(away) * 38, vy: Math.sin(away) * 38, life: 1.2, art: 'gristOat' }));
          }
        }
        whips = whips.filter((whip) => !whip.done);
      },
    };
  },

  // The waterwheel: rows of paddles come up from the bottom of the box like
  // the old wheel turning, each row with a gap in it, the gaps zigzagging
  // side to side. Water slops off the paddles as they go.
  gristWheel(box, density, { Shot, rand }) {
    const plank = 10;
    const gapWidth = 22;
    let rows = 0;
    let next = 0.1;
    let t = 0;
    let paddles = [];
    const turn = (bullets) => {
      // The gap goes from one side to the other and back.
      const span = box.w - gapWidth - 8;
      const u = (rows % 6) / 5;
      const zig = Math.floor(rows / 6) % 2 ? 1 - u : u;
      const gap = box.x + 4 + gapWidth / 2 + span * zig;
      rows++;
      for (let x = box.x + plank / 2; x < box.x + box.w; x += plank) {
        if (Math.abs(x - gap) < gapWidth / 2) continue;
        const paddle = new Shot({ x, y: box.y + box.h + 4, vy: -40, art: 'gristPaddle' });
        paddle.drip = rand(0.4, 1.6);
        bullets.push(paddle);
        paddles.push(paddle);
      }
    };
    return {
      duration: 6.8,
      update: (dt, bullets) => {
        t += dt;
        if (t >= next && t < 5.4) {
          turn(bullets);
          next = t + 0.62;
        }
        for (const paddle of paddles) {
          paddle.drip -= dt;
          if (paddle.drip > 0) continue;
          paddle.drip += rand(1.8, 2.8);
          bullets.push(new Shot({ x: paddle.x + rand(-3, 3), y: paddle.y + 3, gravity: 90, life: 0.6, art: 'gristDrop' }));
        }
        paddles = paddles.filter((paddle) => paddle.y > box.y - 10);
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
      duration: 6.6,
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
        if (t > 6.2) return;
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
