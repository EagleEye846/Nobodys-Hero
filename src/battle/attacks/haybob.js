import { defineBulletArt } from '../projectiles.js';

// The Haybob's attacks. It's a round hay bale in a straw hat that has got
// loose from its field and is having a lovely time, so it fights with its
// field: itself, rolling and bouncing across the box, loose straw, the
// pitchfork its farmer lost in it, little haystacks tumbling down, and the
// harvest mouse that lives in its side. Easy and bouncy, and still every
// attack goes where you're standing.
//
// It stands to the right of the box. Each attack is a factory
// `(box, density, tools) => ({ duration, update })`; see dummy.js.

const STRAW = { a: '#e8b83c', A: '#b8821c', h: '#fbe48a', k: '#6a4a14' };
const MOUSE = { m: '#d9c6a8', M: '#6a5238', n: '#f0a0a0', k: '#2a1a10' };
const WOOD = { s: '#9aa4ae', S: '#5a6672', h: '#8a5a24' };

// A whole bale, rolling (the Haybob throwing itself).
defineBulletArt('hayRound', {
  frames: [[
    '...aaaaa...',
    '.aaaAAAaaa.',
    '.aAaaaaaAa.',
    'aaAaAAAaAaa',
    'aAaAaaaAaAa',
    'aAaAaAaAaAa',
    'aAaAaaaAaAa',
    'aaAaAAAaAaa',
    '.aAaaaaaAa.',
    '.aaaAAAaaa.',
    '...aaaaa...',
  ]],
  palette: STRAW,
  radius: 4.6,
  spin: 3.2,
});

// A loose bit of straw, drawn flying right.
defineBulletArt('hayStraw', {
  frames: [['hhaaaaAA'], ['.hhaaaAA']],
  palette: STRAW,
  radius: 1.5,
  rotate: true,
  frameSeconds: 0.2,
});

// A little flake of chaff.
defineBulletArt('hayChaff', {
  frames: [['.a.', 'hAa', '.a.']],
  palette: STRAW,
  radius: 1.3,
  spin: 5,
});

// The pitchfork's head (three tines), drawn pointing right.
defineBulletArt('hayForkHead', {
  frames: [[
    '...ssssss.',
    '...S......',
    '...S......',
    'hhhSSSSSSs',
    '...S......',
    '...S......',
    '...ssssss.',
  ]],
  palette: WOOD,
  radius: 1,
  rotate: true,
});

// A small haystack, tumbling down.
defineBulletArt('hayStackBit', {
  frames: [[
    '....a....',
    '..aahaa..',
    '.aahaaAa.',
    'aahaaaaAa',
    'aAaaAaaAA',
    'AaAAaAaAA',
    '.AAAAAAA.',
  ]],
  palette: STRAW,
  radius: 3,
  hitbox: { w: 8, h: 6 },
});

// The harvest mouse, scurrying one way or the other.
defineBulletArt('hayMouseR', {
  frames: [
    ['.....mM...', '.Mmmmmmmm..', 'MMmmmmmmkn.', '.mmmmmmmm..', '..m.m..m...'],
    ['.....mM...', '.Mmmmmmmm..', 'MMmmmmmmkn.', '.mmmmmmmm..', '...m..m.m..'],
  ],
  palette: MOUSE,
  radius: 2.2,
  frameSeconds: 0.06,
});
defineBulletArt('hayMouseL', {
  frames: [
    ['...Mm.....', '..mmmmmmM.', '.nkmmmmmMM', '..mmmmmmm.', '...m..m.m.'],
    ['...Mm.....', '..mmmmmmM.', '.nkmmmmmMM', '..mmmmmmm.', '..m.m..m..'],
  ],
  palette: MOUSE,
  radius: 2.2,
  frameSeconds: 0.06,
});

// Its nose and ears, peeking out of a hole in the bale (harmless).
defineBulletArt('hayPeek', {
  frames: [
    ['.Mm..mM.', 'MmmmmmmM', 'mmkmmkmm', '.mmnnmm.'],
    ['.Mm..mM.', 'MmmmmmmM', 'mmkmmkmm', '.mmnnmm.'],
  ],
  palette: MOUSE,
  radius: 1,
  frameSeconds: 0.2,
});

// The line of a jab from a pitchfork: out fast, held, drawn back.
function forkOut(line, from, angle, reach) {
  const k = line.age - line.warn;
  if (k < 0) return 0;
  if (k < 0.12) return (k / 0.12) * reach;
  if (k < 0.45) return reach;
  return Math.max(0, 1 - (k - 0.45) / 0.35) * reach;
}

export const HAYBOB_ATTACKS = {
  // Roll: the Haybob throws itself across the box in big bouncing hops, in
  // from the side away from you, each first hop thrown at the spot you're standing
  // on (the bale blinks at the wall first). Every landing flicks straw up.
  hayRoll(box, density, { Shot, rand, clamp }) {
    const floor = box.y + box.h - 6;
    const GRAVITY = 150;
    const SPEED = 54;
    let t = 0;
    let next = 0.1;
    let count = 0;
    let bales = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && count < 4 && t < 5) {
          // From the far side from you, so there's always room to see it come.
          const fromRight = soul.x < box.x + box.w / 2;
          const bale = new Shot({ x: fromRight ? box.x + box.w - 5 : box.x + 5, y: rand(box.y + 10, floor - 20), warn: 0.7, art: 'hayRound', life: 4.5 });
          bale.dir = fromRight ? -1 : 1;
          bales.push(bale);
          bullets.push(bale);
          count++;
          next = t + 1.35;
        }
        for (const bale of bales) {
          if (bale.age <= bale.warn) continue;
          if (!bale.v) {
            // Thrown so the hop passes through where you are right now.
            const reach = Math.max(14, Math.abs(soul.x - bale.x));
            const flight = reach / SPEED;
            bale.v = { x: bale.dir * SPEED, y: (clamp(soul.y, box.y + 6, floor) - bale.y - 0.5 * GRAVITY * flight * flight) / flight };
          }
          bale.v.y += GRAVITY * dt;
          bale.x += bale.v.x * dt;
          bale.y += bale.v.y * dt;
          if (bale.y >= floor && bale.v.y > 0) {
            bale.y = floor;
            bale.v.y = -Math.abs(bale.v.y) * 0.84;
            // The landing kicks straw up and out.
            for (let i = 0; i < 3; i++) {
              bullets.push(new Shot({ x: bale.x + rand(-4, 4), y: floor - 2, vx: rand(-26, 26), vy: -rand(40, 70), gravity: 120, art: 'hayStraw', life: 1.4 }));
            }
          }
        }
        bales = bales.filter((bale) => bale.age < 6);
      },
    };
  },

  // Straw: a gust through the Haybob and loose straw streaks across in a
  // sheet with one gap in it, never in your row, so you have to go somewhere.
  // It comes sideways, then from above.
  hayStraw(box, density, { Shot, rand, clamp }) {
    const lanes = 8;
    let t = 0;
    let next = 0.2;
    let count = 0;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        if ((t += dt) < next || count >= 5 || t > 5.2) return;
        const sideways = count % 2 === 0;
        const span = sideways ? box.h : box.w;
        const origin = sideways ? box.y : box.x;
        const width = span / lanes;
        const yours = clamp(Math.floor(((sideways ? soul.y : soul.x) - origin) / width), 0, lanes - 1);
        // The gap is two or three lanes away from yours.
        let gap = yours + (Math.random() < 0.5 ? -1 : 1) * (2 + Math.floor(Math.random() * 2));
        if (gap < 0 || gap >= lanes) gap = yours + (yours < lanes / 2 ? 3 : -3);
        for (let i = 0; i < lanes; i++) {
          if (i === gap) continue;
          // (In your own lane, it's aimed right at you.)
          const at = i === yours ? (sideways ? soul.y : soul.x) : origin + (i + 0.5) * width + rand(-1.5, 1.5);
          const speed = rand(66, 78);
          for (let n = 0; n < 2; n++) {
            const back = n * 9;
            if (sideways) {
              bullets.push(new Shot({ x: box.x + box.w - 5 + back, y: at, vx: -speed, warn: 0.65, art: 'hayStraw', life: 3 }));
            } else {
              bullets.push(new Shot({ x: at, y: box.y + 4 - back, vy: speed, warn: 0.65, angle: Math.PI / 2, art: 'hayStraw', life: 3 }));
            }
          }
        }
        count++;
        next = t + 1.1;
      },
    };
  },

  // Pitchfork: the fork its farmer lost in the bale. It jabs in, aimed at
  // you, from the side, from above, from below. The three tines show first.
  // It follows you while it warns and aims a little ahead of where you're
  // heading, so running in circles doesn't lose it.
  hayFork(box, density, { Shot, Line, rand, clamp }) {
    let t = 0;
    let next = 0.15;
    let count = 0;
    let forks = [];
    let last = null;
    const heading = { x: 0, y: 0 };
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        // How fast you're moving, smoothed a little.
        if (last && dt > 0) {
          heading.x += ((soul.x - last.x) / dt - heading.x) * Math.min(1, dt * 8);
          heading.y += ((soul.y - last.y) / dt - heading.y) * Math.min(1, dt * 8);
        }
        last = { x: soul.x, y: soul.y };
        if (t >= next && count < 5 && t < 5.6) {
          const way = count % 3;
          let from;
          if (way === 0) from = { x: box.x + box.w + 10, y: clamp(soul.y + rand(-12, 12), box.y + 6, box.y + box.h - 6) };
          else if (way === 1) from = { x: clamp(soul.x + rand(-14, 14), box.x + 6, box.x + box.w - 6), y: box.y - 10 };
          else from = { x: clamp(soul.x + rand(-14, 14), box.x + 6, box.x + box.w - 6), y: box.y + box.h + 10 };
          const warn = 0.95;
          const aimX = clamp(soul.x + heading.x * 0.3, box.x + 4, box.x + box.w - 4);
          const aimY = clamp(soul.y + heading.y * 0.3, box.y + 4, box.y + box.h - 4);
          let angle = Math.atan2(aimY - from.y, aimX - from.x);
          let reach = Math.hypot(aimX - from.x, aimY - from.y) + 14;
          // If you're hugging a wall, this one rakes along it instead, all
          // the way down the edge (so going round the box isn't a way out).
          const toWall = [soul.x - box.x, box.x + box.w - soul.x, soul.y - box.y, box.y + box.h - soul.y];
          const near = Math.min(...toWall);
          if (count > 0 && near < 22) {
            const edge = toWall.indexOf(near);
            const forward = Math.random() < 0.5;
            if (edge < 2) {
              from = { x: clamp(soul.x, box.x + 4, box.x + box.w - 4), y: forward ? box.y - 12 : box.y + box.h + 12 };
              angle = forward ? Math.PI / 2 : -Math.PI / 2;
              reach = box.h + 24;
            } else {
              from = { x: forward ? box.x - 12 : box.x + box.w + 12, y: clamp(soul.y, box.y + 4, box.y + box.h - 4) };
              angle = forward ? 0 : Math.PI;
              reach = box.w + 24;
            }
          }
          const handle = new Line({ x: from.x, y: from.y, angle, length: reach, thickness: 2, warn, life: 0.8, color: '#8a5a24' });
          const head = new Shot({ x: from.x, y: from.y, warn, life: 0.8, harmless: true, angle, art: 'hayForkHead' });
          // Three tines, each its own line, the middle one longest.
          const tines = [-5, 0, 5].map((side) => new Line({ x: from.x, y: from.y, angle, length: 9, thickness: 2, warn, life: 0.8, color: '#c4ccd4' }));
          bullets.push(handle, ...tines, head);
          forks.push({ handle, head, tines, from, angle, reach, track: !(count > 0 && near < 22) });
          count++;
          next = t + 1.35;
        }
        for (const fork of forks) {
          const out = forkOut(fork.handle, fork.from, fork.angle, fork.reach);
          if (fork.handle.age < fork.handle.warn) {
            // It follows you for most of the warning and settles just before
            // the jab, so it takes a real step to be out of the way.
            if (fork.track && fork.handle.age < fork.handle.warn - 0.22) {
              const ax = clamp(soul.x + heading.x * 0.3, box.x + 4, box.x + box.w - 4);
              const ay = clamp(soul.y + heading.y * 0.3, box.y + 4, box.y + box.h - 4);
              fork.angle = Math.atan2(ay - fork.from.y, ax - fork.from.x);
              fork.reach = Math.hypot(ax - fork.from.x, ay - fork.from.y) + 14;
              fork.handle.angle = fork.angle;
              fork.head.angle = fork.angle;
              for (const line of fork.tines) line.angle = fork.angle;
            }
            // While it warns, the line shows the whole jab and the tines show
            // where they'll end up, flashing; just before it goes they shrink
            // to nothing, so nothing hurts until the jab does.
            const soon = fork.handle.age > fork.handle.warn - 0.04;
            fork.handle.length = soon ? 1 : fork.reach;
            const tip = { x: fork.from.x + Math.cos(fork.angle) * fork.reach, y: fork.from.y + Math.sin(fork.angle) * fork.reach };
            fork.tines.forEach((line, i) => {
              const side = [-5, 0, 5][i];
              line.x = tip.x - Math.sin(fork.angle) * side - Math.cos(fork.angle) * 9;
              line.y = tip.y + Math.cos(fork.angle) * side - Math.sin(fork.angle) * 9;
              line.length = soon ? 1 : 9;
            });
            continue;
          }
          fork.handle.length = Math.max(1, out);
          const tipX = fork.from.x + Math.cos(fork.angle) * out;
          const tipY = fork.from.y + Math.sin(fork.angle) * out;
          fork.head.x = tipX;
          fork.head.y = tipY;
          fork.tines.forEach((line, i) => {
            const side = [-5, 0, 5][i];
            line.x = tipX - Math.sin(fork.angle) * side - Math.cos(fork.angle) * 9;
            line.y = tipY + Math.cos(fork.angle) * side - Math.sin(fork.angle) * 9;
            line.length = out < 2 ? 1 : 9;
          });
        }
        forks = forks.filter((fork) => fork.handle.age < fork.handle.warn + 1.2);
      },
    };
  },

  // Stacking up: little haystacks tumble down the box and pile up where they
  // land, one on another, hurting all the way. Every third one comes down
  // on your column, so the floor is no place to wait.
  hayStack(box, density, { Shot, rand }) {
    const cols = 8;
    const width = box.w / cols;
    const floor = box.y + box.h - 4;
    const heights = Array(cols).fill(0);
    let t = 0;
    let next = 0.2;
    let count = 0;
    let falling = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 4.9) {
          // Not on a column that's already three high.
          let col = count % 3 === 2 ? Math.min(cols - 1, Math.max(0, Math.floor((soul.x - box.x) / width))) : Math.floor(rand(0, cols));
          for (let tries = 0; tries < 6 && heights[col] >= 3; tries++) col = Math.floor(rand(0, cols));
          const bit = new Shot({ x: box.x + (col + 0.5) * width, y: box.y + 4, vy: 62, warn: 0.45, art: 'hayStackBit', life: 3.4 });
          bit.col = col;
          falling.push(bit);
          bullets.push(bit);
          count++;
          next = t + 0.52;
        }
        for (const bit of falling) {
          if (bit.age <= bit.warn) continue;
          const landing = floor - heights[bit.col] * 7;
          if (bit.y >= landing) {
            bit.y = landing;
            bit.vy = 0;
            heights[bit.col]++;
            bit.landed = true;
            // A puff of chaff where it lands.
            for (const side of [-1, 1]) bullets.push(new Shot({ x: bit.x, y: landing - 3, vx: side * rand(14, 26), vy: -rand(20, 40), gravity: 90, art: 'hayChaff', life: 0.9 }));
          }
        }
        falling = falling.filter((bit) => !bit.landed && bit.age < 5);
      },
    };
  },

  // The mouse: the harvest mouse that lives in the Haybob pops its head out
  // of a hole in the bale's side, squeaks, and scurries across the box along
  // your row, leaving chaff behind it. Now and then it brings its cousin.
  hayMouse(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let next = 0.2;
    let count = 0;
    let waiting = [];
    let runners = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 5) {
          const fromRight = count % 2 === 0;
          const pair = count % 3 === 2;
          const x = fromRight ? box.x + box.w - 3 : box.x + 3;
          for (let i = 0; i < (pair ? 2 : 1); i++) {
            const y = clamp(soul.y + (pair ? (i ? 12 : -12) : rand(-6, 6)), box.y + 5, box.y + box.h - 5);
            bullets.push(new Shot({ x, y: y - 1, harmless: true, life: 0.8, art: 'hayPeek' }));
            waiting.push({ at: t + 0.8, x, y, fromRight });
          }
          count++;
          next = t + 1.05;
        }
        for (const mouse of waiting) {
          if (t < mouse.at) continue;
          mouse.done = true;
          const run = new Shot({ x: mouse.x, y: mouse.y, vx: (mouse.fromRight ? -1 : 1) * 74, wobble: { amplitude: 3, frequency: 14 }, art: mouse.fromRight ? 'hayMouseL' : 'hayMouseR', life: 3 });
          run.drop = 0;
          runners.push(run);
          bullets.push(run);
        }
        waiting = waiting.filter((mouse) => !mouse.done);
        for (const run of runners) {
          run.drop -= dt;
          if (run.drop <= 0 && run.age < 2.6) {
            run.drop = 0.16;
            bullets.push(new Shot({ x: run.x, y: run.y + 2, art: 'hayChaff', life: 0.8 }));
          }
        }
        runners = runners.filter((run) => run.age < 3);
      },
    };
  },
};
