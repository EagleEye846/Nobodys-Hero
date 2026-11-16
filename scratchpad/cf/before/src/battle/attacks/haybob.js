import { defineBulletArt } from '../projectiles.js';

// The Haybob's attacks. It's a round hay bale in a straw hat that has got
// loose from its field and is having a lovely time, so it fights with its
// field and the things that live in it:
//   - Roll: itself, rolling and bouncing across the box.
//   - Pitchfork: the fork its farmer lost in it, jabbing.
//   - The mouse: the harvest mouse that lives in its side, scurrying.
//   - The gate: "No fences!" Fences slide across the box, and the only way
//     through is the gate in each, which swings open and bangs shut.
//   - Under the hats: the mouse hides under one of three straw hats and the
//     hats are swapped about. Follow the mouse's hat: it comes out of it.
// Easy and bouncy, and every attack still goes where you're standing.
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

// Its straw hat, upside down on the ground, with a red band (the mouse
// hides under one).
defineBulletArt('hayHat', {
  frames: [[
    '...aaaaa...',
    '..ahaaaAa..',
    '..aaaaaAa..',
    '..rrrrrrr..',
    '.aaaaaaaAa.',
    'ahaaaaaaaAa',
    '.AAAAAAAAA.',
  ]],
  palette: { ...STRAW, r: '#c83c2c' },
  radius: 4.5,
  hitbox: { w: 10, h: 6 },
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
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && count < 6) {
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
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        // How fast you're moving, smoothed a little.
        if (last && dt > 0) {
          heading.x += ((soul.x - last.x) / dt - heading.x) * Math.min(1, dt * 8);
          heading.y += ((soul.y - last.y) / dt - heading.y) * Math.min(1, dt * 8);
        }
        last = { x: soul.x, y: soul.y };
        if (t >= next && count < 5) {
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

  // The mouse: the harvest mouse that lives in the Haybob pops its head out
  // of a hole in the bale's side, squeaks, and scurries across the box along
  // your row, leaving chaff behind it. Now and then it brings its cousin.
  hayMouse(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let next = 0.2;
    let count = 0;
    let runners = [];
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 6.4) {
          const fromRight = count % 2 === 0;
          const pair = count % 3 === 2;
          const x = fromRight ? box.x + box.w - 3 : box.x + 3;
          for (let i = 0; i < (pair ? 2 : 1); i++) {
            const y = clamp(soul.y + (pair ? (i ? 12 : -12) : rand(-6, 6)), box.y + 5, box.y + box.h - 5);
            // It sits in its hole a moment first, blinking (the warning).
            const run = new Shot({ x, y, vx: (fromRight ? -1 : 1) * 74, warn: 0.8 / density, wobble: { amplitude: 3, frequency: 14 }, art: fromRight ? 'hayMouseL' : 'hayMouseR', life: 3 });
            run.drop = 0;
            runners.push(run);
            bullets.push(run);
          }
          count++;
          next = t + 1.3;
        }
        for (const run of runners) {
          run.drop -= dt;
          if (run.age > run.warn && run.drop <= 0 && run.age < run.warn + 2.6) {
            run.drop = 0.26;
            bullets.push(new Shot({ x: run.x, y: run.y + 2, art: 'hayChaff', life: 0.8 }));
          }
        }
        runners = runners.filter((run) => run.age < run.warn + 3);
      },
    };
  },

  // The gate: "No fences!" A field fence comes sliding across the box, top
  // to bottom, and the only way through it is the field gate in it, which
  // swings open and bangs shut, open and shut, on its hinge. Wait for it,
  // and go through while it's open. Then the farmer puts up another, from
  // the other side, with the gate somewhere else. Three fences.
  hayGate(box, density) {
    // Real seconds (on the attack's clock, which runs `density` times fast);
    // when it's layered on another, lighter (density under 1), it spreads out.
    const pace = Math.max(density, 1);
    const T = (s) => s * pace;
    const SPEED = 30;
    const GAP = 20;
    const OPEN = 0.95;
    const SHUT = 0.6;
    const WARN = 0.7;
    const THICK = 2;
    class Fence {
      constructor(fromLeft, gapY, phase) {
        this.fromLeft = fromLeft;
        this.gapY = gapY;
        this.phase = phase;
        this.age = 0;
        this.grazed = false;
        this.dmg = null;
        this.x0 = fromLeft ? box.x + 1 : box.x + box.w - 1;
      }
      get k() {
        return this.age - WARN;
      }
      get x() {
        return this.x0 + (this.fromLeft ? 1 : -1) * SPEED * Math.max(0, this.k);
      }
      get shut() {
        return (this.k + this.phase) % (OPEN + SHUT) >= OPEN;
      }
      get active() {
        return this.k >= 0;
      }
      update(dt) {
        this.age += dt;
      }
      isGone() {
        return this.k > box.w / SPEED;
      }
      edgeDistance(px, py) {
        if (!this.active) return Infinity;
        const dx = Math.max(Math.abs(px - this.x) - THICK, 0);
        const top = this.gapY - GAP / 2;
        const bottom = this.gapY + GAP / 2;
        // Inside the gateway: only the gate, if it's shut.
        if (py > top && py < bottom) return this.shut ? dx : Math.hypot(dx, Math.min(py - top, bottom - py));
        return dx;
      }
      draw(ctx) {
        const x = Math.round(this.x);
        const top = Math.round(this.gapY - GAP / 2);
        const bottom = Math.round(this.gapY + GAP / 2);
        ctx.save();
        if (this.k < 0) ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.25 : 0.6;
        // The rail and the posts.
        ctx.fillStyle = '#8a5a24';
        ctx.fillRect(x - 1, box.y, 3, top - box.y);
        ctx.fillRect(x - 1, bottom, 3, box.y + box.h - bottom);
        ctx.fillStyle = '#5a3a14';
        for (let y = box.y + 3; y < box.y + box.h; y += 9) {
          if (y > top - 2 && y < bottom + 2) continue;
          ctx.fillRect(x - 2, y, 5, 3);
        }
        // The gateposts, and the gate: across the gap when shut, swung back
        // along the hinge side when open.
        ctx.fillStyle = '#3a2410';
        ctx.fillRect(x - 2, top - 3, 5, 3);
        ctx.fillRect(x - 2, bottom, 5, 3);
        ctx.fillStyle = '#c89a5a';
        if (this.shut) {
          ctx.fillRect(x - 1, top, 3, bottom - top);
          ctx.fillStyle = '#8a5a24';
          for (let y = top + 2; y < bottom - 1; y += 4) ctx.fillRect(x - 1, y, 3, 1);
        } else {
          const dir = this.fromLeft ? -1 : 1;
          for (let i = 0; i < GAP - 2; i++) ctx.fillRect(x + dir * Math.round(i * 0.6), top + Math.round(i * 0.3), 1, 2);
        }
        ctx.restore();
      }
    }
    let t = 0;
    let n = 0;
    return {
      duration: 8.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (n >= 3 || t < T(0.1 + n * 2.7)) return;
        // The gate is never across your row.
        let gapY;
        do gapY = box.y + GAP / 2 + 3 + Math.random() * (box.h - GAP - 6);
        while (Math.abs(gapY - soul.y) < 22);
        // From the side you're furthest from, so there's room to read it.
        const fromLeft = soul.x > box.x + box.w / 2;
        bullets.push(new Fence(fromLeft, gapY, Math.random() * (OPEN + SHUT)));
        n++;
      },
    };
  },

  // Under the hats: the harvest mouse peeks out, and pops under one of three
  // straw hats, and the hats swap about, sliding round each other, four
  // swaps (the hats don't hurt). Keep your eye on the hat with the mouse. Then all three lift:
  // the empty ones only puff out chaff, but the mouse comes scampering out
  // of its hat straight at you. Twice, along two different rows.
  hayHats(box, density, { Shot, rand }) {
    // Real seconds (on the attack's clock, which runs `density` times fast);
    // when it's layered on another, lighter (density under 1), it spreads out.
    const pace = Math.max(density, 1);
    const T = (s) => s * pace;
    const PEEK = 0.8;
    const SWAP = 0.42;
    const SWAPS = 4;
    const ROUND = PEEK + SWAP * SWAPS + 1.4;
    const cols = [box.x + 16, box.x + 40, box.x + 64];
    let t = 0;
    let round = null;
    let rounds = 0;
    const rows = Math.random() < 0.5 ? [box.y + 26, box.y + 56] : [box.y + 56, box.y + 26];
    return {
      duration: 8.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (rounds < 2 && t >= T(0.1 + rounds * (ROUND + 0.4))) {
          const y = rows[rounds];
          rounds++;
          // Hats by slot; each swap trades two slots.
          const hats = cols.map((x) => new Shot({ x, y, harmless: true, art: 'hayHat', life: ROUND }));
          const mouse = Math.floor(rand(0, 3));
          const swaps = [];
          for (let i = 0; i < SWAPS; i++) {
            const a = Math.floor(rand(0, 3));
            swaps.push([a, (a + 1 + Math.floor(rand(0, 2))) % 3]);
          }
          bullets.push(...hats);
          bullets.push(new Shot({ x: cols[mouse], y: y - 6, harmless: true, art: 'hayPeek', life: PEEK - 0.1 }));
          round = { born: t, y, hats, slot: [0, 1, 2], mouse, swaps, lifted: false };
        }
        if (!round) return;
        const k = (t - round.born) / pace;
        // Slide the hats: each swap, the two go round each other in a half circle.
        if (k >= PEEK && !round.lifted) {
          const i = Math.min(SWAPS - 1, Math.floor((k - PEEK) / SWAP));
          const u = Math.min(1, (k - PEEK - i * SWAP) / SWAP);
          // Where each hat stands before swap i.
          const at = [0, 1, 2];
          for (let j = 0; j < i; j++) {
            const [a, b] = round.swaps[j];
            for (let h = 0; h < 3; h++) {
              if (at[h] === a) at[h] = b;
              else if (at[h] === b) at[h] = a;
            }
          }
          const [a, b] = round.swaps[i];
          round.hats.forEach((hat, h) => {
            const from = at[h];
            if (from !== a && from !== b) {
              hat.x = cols[from];
              hat.y = round.y;
              return;
            }
            const to = from === a ? b : a;
            // One goes over the top, the other underneath.
            const side = from === a ? -1 : 1;
            hat.x = cols[from] + ((cols[to] - cols[from]) * (1 - Math.cos(Math.PI * u))) / 2;
            hat.y = round.y + side * Math.sin(Math.PI * u) * 12;
          });
        }
        if (k >= PEEK + SWAP * SWAPS && !round.lifted) {
          round.lifted = true;
          round.hats.forEach((hat, h) => {
            hat.life = hat.age - hat.warn + 0.05;
            if (h === round.mouse) {
              // Out it comes, straight at you, dropping chaff.
              const ang = Math.atan2(soul.y - hat.y, soul.x - hat.x);
              const mouse = new Shot({ x: hat.x, y: hat.y, vx: Math.cos(ang) * 92, vy: Math.sin(ang) * 92, warn: 0.3, art: Math.cos(ang) > 0 ? 'hayMouseR' : 'hayMouseL', life: 2 });
              bullets.push(mouse);
              for (let c = 0; c < 2; c++) bullets.push(new Shot({ x: hat.x, y: hat.y, vx: Math.cos(ang) * 92, vy: Math.sin(ang) * 92, warn: 0.42 + c * 0.12, art: 'hayChaff', life: 2 }));
            } else {
              for (let c = 0; c < 5; c++) {
                const a = (c / 5) * Math.PI * 2 + rand(0, 0.5);
                bullets.push(new Shot({ x: hat.x, y: hat.y, vx: Math.cos(a) * 26, vy: Math.sin(a) * 26, art: 'hayChaff', life: 1.2 }));
              }
            }
          });
        }
      },
    };
  },
};
