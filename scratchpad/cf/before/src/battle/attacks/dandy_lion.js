import { defineBulletArt } from '../projectiles.js';
import { PathShot, Deco, Guide } from './coastKit.js';

// The Dandy Lion's attacks. Its mane is a dandelion clock, it is extremely
// vain about it, and every attack is the mane or the vanity:
//   - Roar: it puffs the mane up and roars it off at you in a spray.
//   - Pounce: it's a lion. It springs.
//   - Wish: wishes twinkle up and come true in rings of petals.
//   - Reflection: it admires itself in a puddle across the box, and every
//     seed above the water has a twin in it, upside down. Read the one you
//     can see to know where its twin goes.
//   - Sulk: the mane blows apart, every seed hangs in the air on its own
//     string back to the lion's head, and then it puffs itself back together:
//     every seed flies home along the same line it went out on.
//
// It stands to the right of the box, so everything comes in from the right
// edge (the roar, the pounce, the mane). Attacks work on `box` and `soul`
// positions only; each one is a factory `(box, density, tools) => ({ duration,
// update })`; see dummy.js for the shape.

const SEED = { w: '#fffdf0', W: '#cfd4bc', q: '#8a9a78', s: '#5a4a2a' };
const FLUFF = { w: '#fffdf0', W: '#d2d6c0', q: '#a9b39a' };
const PETAL = { y: '#f6c52b', Y: '#d9941a', l: '#ffe98a' };
const SPARK = { g: '#fff7a0', w: '#ffffff', y: '#f6c52b' };

// A dandelion seed: a puff on a thin stalk, with the seed at the bottom.
defineBulletArt('dandySeed', {
  frames: [
    ['.w.w.w.', '..wWw..', '..wWw..', '...q...', '...q...', '...s...'],
    ['w.w.w..', '.wwWw..', '..wWw..', '...q...', '...q...', '...s...'],
  ],
  palette: SEED,
  radius: 1.8,
  frameSeconds: 0.35,
});

// A seed's reflection in the puddle: the same seed upside down, gone blue.
const DROWNED = { w: '#cfe6f2', W: '#8fb4c8', q: '#5f8296', s: '#3a4a5a' };
defineBulletArt('dandySeedDown', {
  frames: [
    ['...s...', '...q...', '...q...', '..wWw..', '..wWw..', '.w.w.w.'],
    ['...s...', '...q...', '...q...', '..wWw..', '.wwWw..', 'w.w.w..'],
  ],
  palette: DROWNED,
  radius: 1.8,
  frameSeconds: 0.35,
});
// Its reflection when the puddle runs down the middle: the right way up, blue.
defineBulletArt('dandySeedBlue', {
  frames: [
    ['.w.w.w.', '..wWw..', '..wWw..', '...q...', '...q...', '...s...'],
    ['..w.w.w', '..wWww.', '..wWw..', '...q...', '...q...', '...s...'],
  ],
  palette: DROWNED,
  radius: 1.8,
  frameSeconds: 0.35,
});

// A bit of the mane: a ball of fluff.
defineBulletArt('dandyFluff', {
  frames: [
    ['..www..', '.wwWww.', 'wwwwWww', 'wWwwwWw', '.wwWww.', '..qqq..'],
    ['..www..', '.wWwww.', 'wwwwwWw', 'wwWwwww', '.wwwWw.', '..qqq..'],
  ],
  palette: FLUFF,
  radius: 2.8,
  frameSeconds: 0.3,
});

// A yellow petal, drawn pointing right.
defineBulletArt('dandyPetal', {
  frames: [['.yyy.', 'lYYYy', '.yyy.']],
  palette: PETAL,
  radius: 1.7,
  rotate: true,
});

// A paw, mid-pounce: three toes and a big pad, all pink beans, and the
// claws flicking out as it comes down.
const PAW = { y: '#f6c52b', Y: '#d9941a', k: '#8a5a14', p: '#ee7f8e', P: '#c85a6c', w: '#fffdf0' };
defineBulletArt('dandyPaw', {
  frames: [
    ['.........', '.kk.k.kk.', 'kyykykyyk', 'kpykpkypk', '.kkykykk.', 'kyyyyyyyk', 'kyypppyyk', 'kYppPppYk', '.kYpPpYk.', '..kkkkk..'],
    ['.w..w..w.', '.kw.w.wk.', 'kyykykyyk', 'kpykpkypk', '.kkykykk.', 'kyyyyyyyk', 'kyypppyyk', 'kYppPppYk', '.kYpPpYk.', '..kkkkk..'],
  ],
  palette: PAW,
  radius: 3.4,
  frameSeconds: 0.1,
});

// A wish, twinkling (harmless until it comes true).
defineBulletArt('dandyWish', {
  frames: [
    ['..g..', '..g..', 'ggwgg', '..g..', '..g..'],
    ['.g.g.', '..g..', '.gwg.', '..g..', '.g.g.'],
  ],
  palette: SPARK,
  radius: 1,
  frameSeconds: 0.15,
});

export const DANDY_LION_ATTACKS = {
  // Roar: it puffs its mane up, and then ROARS, and the whole mane blows off
  // in a spray of seeds, in a fan aimed at where you were standing. The fan's
  // edges flash first. Four roars, and it's out of breath.
  dandyRoar(box, density, { Shot, Line, rand, clamp }) {
    const mouth = { x: box.x + box.w - 2, y: box.y + box.h / 2 };
    let t = 0;
    let roars = 0;
    let next = 0.2;
    let firing = [];
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && roars < 4) {
          roars++;
          next = t + 2.1;
          const aim = Math.atan2(soul.y - mouth.y, soul.x - mouth.x);
          const spread = 0.62;
          // The edges of the spray, flashing: a puff swells at the mouth.
          for (const side of [-1, 1]) {
            bullets.push(new Line({ x: mouth.x, y: mouth.y, angle: aim + side * spread, length: 90, thickness: 2, warn: 0.85, life: 0, color: '#fffdf0' }));
          }
          bullets.push(new Shot({ x: box.x + box.w - 6, y: mouth.y, harmless: true, warn: 0, life: 0.85, art: 'dandyFluff' }));
          firing.push({ at: t + 0.85, aim, spread });
        }
        for (const roar of firing) {
          if (t < roar.at) continue;
          roar.done = true;
          const count = 13;
          for (let i = 0; i < count; i++) {
            const a = roar.aim - roar.spread + (2 * roar.spread * (i + rand(0.1, 0.9))) / count;
            const speed = rand(44, 70);
            const big = i % 4 === 0;
            bullets.push(new Shot({ x: mouth.x, y: mouth.y + rand(-4, 4), vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, accel: -10, gravity: 8, art: big ? 'dandyFluff' : 'dandySeed', life: 5 }));
          }
        }
        firing = firing.filter((roar) => !roar.done);
      },
    };
  },

  // Pounce: it springs across the box in a high arc and lands on the spot
  // where you were (the arc flashes first), four times, side to side. Each leap leaves a trail of fluff
  // that hangs in the air a while, and a ring of puffs where it lands.
  dandyPounce(box, density, { Shot, Line, rand, clamp }) {
    let t = 0;
    let next = 0.1;
    let count = 0;
    const leaps = [];
    const FLIGHT = 0.6;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && count < 4) {
          const fromRight = count % 2 === 0;
          const start = { x: fromRight ? box.x + box.w + 8 : box.x - 8, y: clamp(soul.y + rand(-10, 10), box.y + 10, box.y + box.h - 6) };
          const end = { x: clamp(soul.x, box.x + 6, box.x + box.w - 6), y: clamp(soul.y, box.y + 6, box.y + box.h - 6) };
          const warn = 0.85;
          // The warning follows the arc itself, in short dashes, so the
          // flash shows the real path over the top and not a straight line.
          const arc = (k) => ({ x: start.x + (end.x - start.x) * k, y: start.y + (end.y - start.y) * k - Math.sin(Math.PI * k) * 20 });
          for (let i = 0; i < 10; i++) {
            const a = arc(i / 10);
            const b = arc((i + 1) / 10);
            bullets.push(new Line({ x: a.x, y: a.y, angle: Math.atan2(b.y - a.y, b.x - a.x), length: Math.hypot(b.x - a.x, b.y - a.y), thickness: 2, warn, life: 0, color: '#f6c52b' }));
          }
          const paw = new Shot({ x: start.x, y: start.y, warn, life: FLIGHT + 0.12, art: 'dandyPaw' });
          bullets.push(paw);
          leaps.push({ paw, start, end, born: t, warn, trail: 0, landed: false });
          count++;
          next = t + 2;
        }
        for (const leap of leaps) {
          const k = (t - leap.born - leap.warn) / FLIGHT;
          if (k < 0 || leap.landed) continue;
          if (k >= 1) {
            leap.landed = true;
            // A ring of puffs where it lands.
            for (let i = 0; i < 6; i++) {
              const a = (i / 6) * Math.PI * 2 + 0.3;
              bullets.push(new Shot({ x: leap.end.x, y: leap.end.y, vx: Math.cos(a) * 32, vy: Math.sin(a) * 32, art: 'dandyFluff', life: 1.6 }));
            }
            continue;
          }
          leap.paw.x = leap.start.x + (leap.end.x - leap.start.x) * k;
          leap.paw.y = leap.start.y + (leap.end.y - leap.start.y) * k - Math.sin(Math.PI * k) * 20;
          leap.trail -= dt;
          if (leap.trail <= 0) {
            leap.trail = 0.07;
            bullets.push(new Shot({ x: leap.paw.x, y: leap.paw.y, vy: -3, art: 'dandyFluff', life: 2 }));
          }
        }
      },
    };
  },

  // Make a wish: little golden sparkles twinkle up here and there, a lot of
  // them right beside you, and a moment later each one comes true, in a ring
  // of petals.
  dandyWish(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let next = 0.3;
    let wishes = [];
    return {
      duration: 7.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 6.2) {
          next = t + 0.66;
          const near = Math.random() < 0.45;
          const x = near ? clamp(soul.x + rand(-9, 9), box.x + 8, box.x + box.w - 8) : rand(box.x + 8, box.x + box.w - 8);
          const y = near ? clamp(soul.y + rand(-9, 9), box.y + 8, box.y + box.h - 8) : rand(box.y + 8, box.y + box.h - 8);
          bullets.push(new Shot({ x, y, harmless: true, life: 0.95, art: 'dandyWish' }));
          wishes.push({ at: t + 0.95, x, y });
        }
        for (const wish of wishes) {
          if (t < wish.at) continue;
          wish.done = true;
          const turn = rand(0, Math.PI);
          for (let i = 0; i < 8; i++) {
            const a = turn + (i / 8) * Math.PI * 2;
            bullets.push(new Shot({ x: wish.x, y: wish.y, vx: Math.cos(a) * 36, vy: Math.sin(a) * 36, art: 'dandyPetal', life: 2.2 }));
          }
        }
        wishes = wishes.filter((wish) => !wish.done);
      },
    };
  },

  // Reflection: it finds a puddle and admires itself in it. The puddle lies
  // across the middle of the box, and every seed that drifts over it has a
  // twin in the water, upside down, doing exactly the opposite. Half the
  // seeds come along the mirror of your row, so their twins come along yours.
  // Then it turns its head for a better angle, and the puddle turns with it:
  // now it runs down the middle, seeds float down the left half and their
  // twins down the right. The new waterline flickers before it's used.
  dandyMirror(box, density, { Shot, rand, clamp }) {
    // Real seconds (on the attack's clock, which runs `density` times fast);
    // when it's layered on another, lighter (density under 1), it spreads out.
    const pace = Math.max(density, 1);
    const T = (s) => s * pace;
    const midY = box.y + box.h / 2;
    const midX = box.x + box.w / 2;
    let t = 0;
    let next = T(0.3);
    const TURN = 4.1;
    // The waterline, shimmering (harmless).
    const water = (vertical, from, until) => new Deco({
      life: until - from,
      paint: (ctx, d) => {
        const blink = d.age < 0.7 ? (Math.floor(d.age * 10) % 2 ? 0.3 : 0.75) : 0.8;
        ctx.globalAlpha *= blink;
        ctx.fillStyle = '#8fc8e8';
        for (let i = 0; i < box.w; i += 4) {
          const wob = Math.round(Math.sin(d.age * 5 + i * 0.4));
          if (vertical) ctx.fillRect(midX + wob, box.y + i, 1, 3);
          else ctx.fillRect(box.x + i, midY + wob, 3, 1);
        }
      },
    });
    const twins = [];
    let phase = 0;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (phase === 0) {
          phase = 1;
          bullets.push(water(false, 0, TURN + 0.2));
        }
        if (phase === 1 && t >= T(TURN - 0.8)) {
          phase = 2;
          bullets.push(water(true, 0, 4.2));
        }
        if (t >= next && t < T(7)) {
          const vertical = t >= T(TURN);
          next = t + T(vertical ? 0.42 : 0.4);
          if (!vertical && t > T(TURN - 0.9)) return;
          if (!vertical) {
            // Over the water, on the mirror of your row half the time.
            const mirrorRow = 2 * midY - soul.y;
            const y = Math.random() < 0.5 && mirrorRow < midY - 4 ? clamp(mirrorRow + rand(-3, 3), box.y + 4, midY - 5) : rand(box.y + 5, midY - 6);
            const seed = new Shot({ x: box.x + box.w + 6, y, vx: -rand(24, 32), wobble: { amplitude: rand(3, 6), frequency: rand(1.8, 2.6) }, art: 'dandySeed', life: 5 });
            const twin = new Shot({ x: seed.x, y: 2 * midY - y, art: 'dandySeedDown', life: 5 });
            twin.of = seed;
            twin.flip = 'y';
            bullets.push(seed, twin);
            twins.push(twin);
          } else {
            // Down the left half; the twin down the right.
            const mirrorCol = 2 * midX - soul.x;
            const x = Math.random() < 0.5 && mirrorCol < midX - 4 ? clamp(mirrorCol + rand(-3, 3), box.x + 4, midX - 5) : rand(box.x + 5, midX - 6);
            const seed = new Shot({ x, y: box.y - 6, vy: rand(24, 32), vx: rand(-3, 3), art: 'dandySeed', life: 5 });
            const twin = new Shot({ x: 2 * midX - x, y: seed.y, art: 'dandySeedBlue', life: 5 });
            twin.of = seed;
            twin.flip = 'x';
            bullets.push(seed, twin);
            twins.push(twin);
          }
        }
        // Each twin goes wherever its seed goes, the other way up.
        for (const twin of twins) {
          const seed = twin.of;
          if (twin.flip === 'y') {
            twin.x = seed.x;
            twin.y = 2 * midY - seed.y;
          } else {
            twin.x = 2 * midX - seed.x;
            twin.y = seed.y;
          }
          twin.age = seed.age;
        }
      },
    };
  },

  // Sulk: someone breathed on it. The whole mane blows apart into the box,
  // and every seed stops where it got to, hanging on its own thin line back
  // to the lion's head. Then it sulks, and puffs itself back together: every
  // seed flies home along exactly the line it went out on. So the lines are
  // the danger, out and back, and the wedges between them are where to be.
  // One line always runs through you. Three sulks, from three heights.
  dandySulk(box, density, { rand, clamp }) {
    // Real seconds (on the attack's clock, which runs `density` times fast);
    // when it's layered on another, lighter (density under 1), it spreads out.
    const pace = Math.max(density, 1);
    const T = (s) => s * pace;
    const OUT = 0.75;
    const HOLD = 0.9;
    const BACK = 0.55;
    const heights = [0.18, 0.5, 0.82].sort(() => Math.random() - 0.5);
    let t = 0;
    let n = 0;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (n >= 3 || t < T(0.2 + n * 2.45)) return;
        const head = { x: box.x + box.w + 4, y: box.y + box.h * heights[n] };
        n++;
        const aim = Math.atan2(soul.y - head.y, soul.x - head.x);
        const count = 10;
        // A fan across the box from the head, one line on you.
        const lo = Math.atan2(box.y + 2 - head.y, box.x - head.x);
        const hi = Math.atan2(box.y + box.h - 2 - head.y, box.x - head.x);
        const top = Math.min(lo, hi);
        const bottom = Math.max(lo, hi);
        const angles = [aim];
        for (let i = 0; i < count; i++) {
          const a = top + ((bottom - top) * (i + 0.5)) / count + rand(-0.04, 0.04);
          if (Math.abs(a - aim) > 0.11) angles.push(a);
        }
        for (const a of angles.slice(0, count)) {
          // Where it stops: inside the box, the one on you just past you.
          const reach = a === aim ? Math.hypot(soul.x - head.x, soul.y - head.y) + 10 : rand(36, 92);
          const room = (() => {
            // Keep it inside the box.
            let r = reach;
            for (let i = 0; i < 20; i++) {
              const x = head.x + Math.cos(a) * r;
              const y = head.y + Math.sin(a) * r;
              if (x > box.x + 4 && y > box.y + 3 && y < box.y + box.h - 3) break;
              r -= 5;
            }
            return Math.max(r, 20);
          })();
          const stop = { x: head.x + Math.cos(a) * room, y: clamp(head.y + Math.sin(a) * room, box.y + 3, box.y + box.h - 3) };
          const path = (k) => {
            if (k < OUT) {
              const u = 1 - (1 - k / OUT) ** 2;
              return { x: head.x + (stop.x - head.x) * u, y: head.y + (stop.y - head.y) * u };
            }
            if (k < OUT + HOLD) return { x: stop.x + Math.sin(k * 30) * 0.6, y: stop.y };
            const u = Math.min(1, ((k - OUT - HOLD) / BACK) ** 2);
            return { x: stop.x + (head.x - stop.x) * u, y: stop.y + (head.y - stop.y) * u };
          };
          bullets.push(new PathShot({ path, art: a === aim ? 'dandyFluff' : 'dandySeed', warn: 0.35, life: OUT + HOLD + BACK }));
          // Its string home, dotted, the whole time it's out.
          bullets.push(new Guide({ x: stop.x, y: stop.y, angle: Math.atan2(head.y - stop.y, head.x - stop.x), length: Math.hypot(head.x - stop.x, head.y - stop.y), warn: 0.35 + OUT + HOLD, color: '#fffdf0' }));
        }
      },
    };
  },
};
