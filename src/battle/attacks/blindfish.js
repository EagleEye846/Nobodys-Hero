import { defineBulletArt } from '../projectiles.js';
import { Ring, stillness } from './underShapes.js';

// The Blindfish's attacks. It's a pale cave fish with no use for eyes, and
// it finds you by the ripples you make. So it fights by sound and splash:
// it leaps out of the black water in long arcs, spreads rings out from
// wherever you've been moving (so, the less you move, the safer, but only
// until it hears you've stopped), sends a school of silver minnows flashing
// past, snaps its great jaw shut on the spot where you were standing, and
// blows up bubbles that pop into spray. Everything it does is aimed at
// where you WERE.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The attack's own clock (`t`) runs `density`
// times faster than the seconds on the wall, hence the `T` below.

const FISH = { k: '#12141c', p: '#e4cfd8', P: '#f8ecf0', B: '#867494', m: '#f4f8ff', e: '#2a2234', f: '#c4cce6' };
const MINNOW = { k: '#1a2030', s: '#d8e8f4', S: '#8aa4c8', w: '#ffffff' };
const JAW = { k: '#12141c', t: '#ffffff', T: '#c8c0d0', g: '#e098a8', G: '#a86078', e: '#2a2234' };
const WATER = { a: '#4e6a9c', A: '#a4c0e4', h: '#d0e0f4', w: '#ffffff' };

// The fish itself, leaping, drawn heading right (it turns to face where it's
// going). The tail flicks.
const LEAP = [
  ['....kkkkk...', '.kk.kppPPkk.', 'kBBkpppPmPk.', 'kBBkppPPPeek', '.kk.kPPPPkk.', '....kkkkk...'],
  ['....kkkkk...', 'kB..kppPPkk.', '.BBkpppPmPk.', '.BBkppPPPeek', 'kB..kPPPPkk.', '....kkkkk...'],
];
defineBulletArt('fishLeap', { frames: LEAP, palette: FISH, radius: 3.4, rotate: true, frameSeconds: 0.12 });
// The same upside down, for when it's heading left (so it still has its belly down).
defineBulletArt('fishLeapFlip', { frames: LEAP.map((frame) => [...frame].reverse()), palette: FISH, radius: 3.4, rotate: true, frameSeconds: 0.12 });

// A minnow of the school: a silver flick.
defineBulletArt('fishMinnow', {
  frames: [['.kkk..', 'ksSwkk', '.kkk.k'], ['.kkk.k', 'ksSwkk', '.kkk..']],
  palette: MINNOW,
  radius: 1.8,
  rotate: true,
  frameSeconds: 0.07,
});

// The flash they make as they come: a long bright streak.
defineBulletArt('fishFlash', {
  frames: [['wwwwwwwwwwww'], ['..wwwwwwww..']],
  palette: MINNOW,
  radius: 1,
  frameSeconds: 0.1,
});

// Its lower jaw, rising: teeth along the top, gum below.
defineBulletArt('fishJawUp', {
  frames: [[
    'k.t.t.t.t.t.t.t.t.t.t.t.k',
    'ktTtTtTtTtTtTtTtTtTtTtTtk',
    'kggggggggggggggggggggggk',
    '.kGGGGGGGGGGGGGGGGGGGGk.',
  ].map((row) => row.padEnd(25, '.').slice(0, 25))],
  palette: JAW,
  hitbox: { w: 23, h: 5 },
});
// And its upper jaw, dropping.
defineBulletArt('fishJawDown', {
  frames: [[
    '.kGGGGGGGGGGGGGGGGGGGGk.',
    'kggggggggggggggggggggggk',
    'ktTtTtTtTtTtTtTtTtTtTtTtk',
    'k.t.t.t.t.t.t.t.t.t.t.t.k',
  ].map((row) => row.padEnd(25, '.').slice(0, 25))],
  palette: JAW,
  hitbox: { w: 23, h: 5 },
});

// Where the snap will be: a dark pool with a ring on it.
defineBulletArt('fishShadow', {
  frames: [
    ['..aaaaaaaaaaaa..', '.a............a.', '..aaaaaaaaaaaa..'],
    ['...aaaaaaaaaa...', '..a..........a..', '...aaaaaaaaaa...'],
  ],
  palette: WATER,
  radius: 1,
  frameSeconds: 0.2,
});

// A bubble, and a big one.
defineBulletArt('fishBubble', {
  frames: [['.AA.', 'A..A', 'A.hA', '.AA.']],
  palette: WATER,
  radius: 2,
});
defineBulletArt('fishBubbleBig', {
  frames: [['..AAA..', '.A...A.', 'A..h..A', 'A.h...A', 'A.....A', '.A...A.', '..AAA..']],
  palette: WATER,
  radius: 3.2,
});

// A drop of spray.
defineBulletArt('fishSpray', {
  frames: [['.h', 'hw']],
  palette: WATER,
  radius: 1.2,
});

// A pair of jaws set to snap at (x, y): a pool marks the spot, then they
// close from top and bottom and meet there, and open again. Returns the
// jaws so the caller can run them (see `runJaws`).
function openJaws(box, bullets, Shot, x, y) {
  const mid = Math.max(box.y + 10, Math.min(box.y + box.h - 10, y));
  bullets.push(new Shot({ x, y: box.y + box.h - 2, harmless: true, life: 0.9, art: 'fishShadow' }));
  const lower = new Shot({ x, y: box.y + box.h + 10, warn: 0.9, art: 'fishJawUp' });
  const upper = new Shot({ x, y: box.y - 10, warn: 0.9, art: 'fishJawDown' });
  bullets.push(lower, upper);
  return { lower, upper, mid, state: 'closing', hold: 0 };
}

// Moves the jaws along: in fast, held, then back out slow.
function runJaws(jaw, dt) {
  const { lower, upper } = jaw;
  if (lower.age < lower.warn) return;
  const goal = 3.5;
  if (jaw.state === 'closing') {
    lower.y -= 230 * dt;
    upper.y += 230 * dt;
    if (lower.y <= jaw.mid + goal) {
      lower.y = jaw.mid + goal;
      upper.y = jaw.mid - goal;
      jaw.state = 'held';
    }
  } else if (jaw.state === 'held') {
    jaw.hold += dt;
    if (jaw.hold > 0.35) jaw.state = 'opening';
  } else {
    lower.y += 90 * dt;
    upper.y -= 90 * dt;
  }
}

export const BLINDFISH_ATTACKS = {
  // Leaping: it throws itself out of the water at the bottom of the box and
  // sails across in a long arc, landing on the far side, aimed so the top of
  // the arc passes over where you are. A ring on the water shows where it's
  // going to jump from. Two at a time, in the end.
  fishLeap(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    const GRAVITY = 260;
    const leapers = [];
    let t = 0;
    let next = 0.15;
    let count = 0;
    // The top of its arc goes through (half way between `from` and `to`, aimY).
    const leap = (bullets, from, to, aimY) => {
      const y = box.y + box.h + 5;
      const launch = Math.sqrt(2 * GRAVITY * Math.max(26, y - aimY));
      const flight = (2 * launch) / GRAVITY;
      const vx = (to - from) / flight;
      bullets.push(new Ring({ x: from, y: box.y + box.h - 1, r: 2, grow: 14, thick: 1.5, warn: 0.55, life: 0.5, squash: 0.35, color: '#a4c0e4' }));
      // (Flown by hand, so the enemy's speed setting can't bend the arc.)
      const fish = new Shot({ x: from, y, warn: 0.55, art: vx < 0 ? 'fishLeapFlip' : 'fishLeap' });
      leapers.push({ fish, from, y, vx, launch });
      bullets.push(fish);
      for (const way of [-1, 1]) {
        bullets.push(new Shot({ x: from, y: box.y + box.h - 1, warn: 0.55, vx: way * rand(14, 28), vy: -rand(40, 70), gravity: 200, life: 0.6, art: 'fishSpray' }));
      }
    };
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        for (const l of leapers) {
          const flown = Math.max(0, l.fish.age - l.fish.warn);
          l.fish.x = l.from + l.vx * flown;
          l.fish.y = l.y - l.launch * flown + 0.5 * GRAVITY * flown * flown;
          l.fish.angle = Math.atan2(-l.launch + GRAVITY * flown, l.vx);
        }
        if (t < next || t > T(5.6)) return;
        next = t + T(1.1);
        const fromLeft = count % 2 === 0;
        const from = fromLeft ? box.x + rand(2, 12) : box.x + box.w - rand(2, 12);
        // The arc's top (half way) over you.
        leap(bullets, from, clamp(2 * soul.x - from, box.x - 16, box.x + box.w + 16), soul.y);
        if (count >= 2) {
          // A second one from the other side, a beat behind, over the middle.
          const other = fromLeft ? box.x + box.w - 8 : box.x + 8;
          leap(bullets, other, clamp(2 * (box.x + box.w / 2) - other, box.x - 12, box.x + box.w + 12), box.y + box.h * 0.4);
        }
        // One leaps straight up out of the water under where you are (the ring
        // shows the spot first), so sitting on the floor, or in a column, won't do.
        if (count >= 1) {
          const under = clamp(soul.x, box.x + 8, box.x + box.w - 8);
          leap(bullets, under, under, box.y + 4);
        }
        count++;
      },
    };
  },

  // Ripples: every step you take makes a ring on the water, and rings
  // spread out from where you were, flat and fast. Moving in a line outruns
  // them; turning back through them, or going round and round, doesn't.
  // Where you've stopped it can hear you stop: stand still and the jaw
  // comes up under you.
  fishRipples(box, density, { Shot, Line, rand, clamp }) {
    const T = (s) => s * density;
    const still = stillness(14);
    let t = 0;
    let last = null;
    let nextRing = 0;
    let nextDart = 1.1;
    let jaw = null;
    let heard = null;
    let nextSnap = 0;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        const stood = still(dt, soul);
        if (!last) last = { x: soul.x, y: soul.y };
        if (t < T(6) && t >= nextRing && Math.hypot(soul.x - last.x, soul.y - last.y) >= 9) {
          nextRing = t + 0.13;
          last = { x: soul.x, y: soul.y };
          heard = { x: soul.x, y: soul.y };
          bullets.push(new Ring({ x: soul.x, y: soul.y + 2, r: 3, grow: 40, thick: 2, warn: 0.28, life: 0.85, squash: 0.55, color: '#a4c0e4', glow: '#4e6a9c' }));
        }
        // A minnow-sized dart goes for the last place it heard you.
        if (t >= nextDart && t < T(5.6) && heard) {
          nextDart = t + 0.8;
          const left = Math.random() < 0.5;
          const from = { x: left ? box.x - 4 : box.x + box.w + 4, y: rand(box.y + 8, box.y + box.h - 8) };
          const aim = Math.atan2(heard.y - from.y, heard.x - from.x);
          bullets.push(new Shot({ x: from.x, y: from.y, warn: 0.3, vx: Math.cos(aim) * 82, vy: Math.sin(aim) * 82, art: 'fishMinnow' }));
        }
        // Stood still: it has you.
        if (stood > 0.9 && t >= nextSnap && t < T(5.4) && !jaw) {
          jaw = openJaws(box, bullets, Shot, soul.x, soul.y);
          nextSnap = t + T(2.2);
        }
        if (jaw) {
          runJaws(jaw, dt / density);
          if (jaw.state === 'opening' && jaw.lower.y > box.y + box.h + 12) jaw = null;
        }
      },
    };
  },

  // The school: a V of silver minnows flashes across the box at speed, from
  // one side and then the other, in rows near yours. A streak of light on the
  // wall of the box shows the row a moment before. Small, quick, and all at
  // once.
  fishSchool(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = 0.1;
    let count = 0;
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || t > T(5.4)) return;
        next = t + T(1.15);
        const right = count % 2 === 0;
        const y = clamp(soul.y + rand(-14, 14), box.y + 14, box.y + box.h - 14);
        const x0 = right ? box.x - 6 : box.x + box.w + 6;
        const way = right ? 1 : -1;
        bullets.push(new Shot({ x: right ? box.x + 8 : box.x + box.w - 8, y, harmless: true, life: 0.45, art: 'fishFlash' }));
        for (let i = 0; i < 9; i++) {
          const rank = Math.ceil(i / 2);
          const side = i % 2 ? 1 : -1;
          bullets.push(new Shot({
            x: x0 - way * rank * 5, y: y + side * rank * 4.2, warn: 0.5,
            vx: way * 118, wobble: { amplitude: 1.2, frequency: 14 }, art: 'fishMinnow',
          }));
        }
        count++;
      },
    };
  },

  // The jaw: it comes up from underneath and snaps shut. A dark pool with a
  // ring on it marks the spot on the floor, then the jaws close from below
  // and above and meet there, right where you were standing, and open again.
  // Three snaps, and the last is a pair, either side of you.
  fishJaw(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let snaps = 0;
    let next = 0.15;
    let jaws = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (snaps < 3 && t >= next) {
          next = t + T(1.6);
          if (snaps < 2) {
            jaws.push(openJaws(box, bullets, Shot, clamp(soul.x, box.x + 12, box.x + box.w - 12), soul.y));
          } else {
            for (const side of [-1, 1]) {
              jaws.push(openJaws(box, bullets, Shot, clamp(soul.x + side * 19, box.x + 12, box.x + box.w - 12), soul.y + rand(-6, 6)));
            }
          }
          snaps++;
        }
        for (const jaw of jaws) runJaws(jaw, dt / density);
        jaws = jaws.filter((jaw) => !(jaw.state === 'opening' && jaw.lower.y > box.y + box.h + 12));
      },
    };
  },

  // Bubbles: it breathes out, and bubbles come wobbling up from the water
  // all across the box. The big ones drift toward you, and they pop, any time
  // they like, into a ring of spray.
  fishBubbles(box, density, { Shot, rand, spreadAcross }) {
    const T = (s) => s * density;
    const nextX = spreadAcross(box.x + 5, box.x + box.w - 5, 6);
    let t = 0;
    let next = 0.1;
    let nextBig = 0.7;
    let bigs = [];
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < T(5.8)) {
          next = t + 0.22;
          bullets.push(new Shot({ x: nextX(), y: box.y + box.h + 3, vy: -rand(22, 34), wobble: { amplitude: 3, frequency: rand(3, 5) }, art: 'fishBubble' }));
        }
        if (t >= nextBig && t < T(5.2)) {
          nextBig = t + 1.05;
          const big = new Shot({
            x: rand(box.x + 10, box.x + box.w - 10), y: box.y + box.h + 4, vy: -rand(15, 21), warn: 0.2,
            homing: { target: soul, turn: 0.35 }, art: 'fishBubbleBig',
          });
          big.popAt = rand(1.6, 2.6);
          bigs.push(big);
          bullets.push(big);
        }
        for (const big of bigs) {
          if (big.age < big.popAt) continue;
          big.spent = true;
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + 0.3;
            bullets.push(new Shot({ x: big.x, y: big.y, vx: Math.cos(angle) * 44, vy: Math.sin(angle) * 44, accel: -30, life: 0.9, art: 'fishSpray' }));
          }
        }
        bigs = bigs.filter((big) => !big.spent);
      },
    };
  },
};
