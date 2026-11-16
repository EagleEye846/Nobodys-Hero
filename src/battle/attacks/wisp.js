import { defineBulletArt } from '../projectiles.js';

// The Wisp's attacks. It's a marsh light that copies the lanterns on the
// safe path through the Lantern Marsh, to lead people off it (not to be
// cruel: it just wants someone to come and see it). So it fights with
// lights you'd like to follow: little lanterns drifting in to meet you
// (most of them burn, but one is real, and touching that one HEALS you),
// a path of lights that leads into a dead end, the Wisp itself wandering
// about with the bog flaring up all round it (stay close: it keeps a calm
// spot for a friend), and a ring of its lights that comes in close round
// you, because it's lonely.
//
// The real light is the one that burns STEADY and gold. The fakes flicker,
// and go a bit green when they do. (`heals` on a Shot: see checkBullets in
// src/battle/battleScene.js.)
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

// HP back for touching the real light.
const TRUE_LIGHT_HEAL = 12;

const LAMP = { k: '#0c1418', t: '#6a7676', T: '#9aa8a8', y: '#fff4c0', Y: '#e8c860', o: '#c89838' };
const FAKE = { k: '#0c1418', t: '#6a7676', T: '#9aa8a8', y: '#fff4c0', Y: '#e8c860', g: '#bfe8a0', G: '#6aae7a' };
const FLAME = { g: '#bfe8a0', G: '#6aae7a', y: '#f4f0b0', w: '#ffffff' };
const GAS = { b: '#9ab8a0', B: '#5a7a6a', w: '#e8fff0' };
const SELF = { k: '#0c1418', g: '#bfe8a0', G: '#6aae7a', y: '#f4f0b0', e: '#0c1418', t: '#6a7676', T: '#9aa8a8' };

// The REAL light: a little lantern, lid and all, burning steady and gold.
// One frame only, so it never flickers.
defineBulletArt('wispTrueLight', {
  frames: [[
    '..kTk..',
    '.kTttk.',
    'kYYYYYk',
    'kYoyoYk',
    'kYyyyYk',
    'kYoyoYk',
    'kYYYYYk',
    '.kTttk.',
    '..kkk..',
  ]],
  palette: LAMP,
  radius: 3.5,
});

// A FAKE light: the Wisp's copy of the same lantern. Nearly right, but its
// flame won't keep still, and every so often it goes green.
defineBulletArt('wispLight', {
  frames: [
    [
      '..kTk..',
      '.kTttk.',
      'kYYYYYk',
      'kYyyyYk',
      'kYyyyYk',
      'kYYyYYk',
      'kYYYYYk',
      '.kTttk.',
      '..kkk..',
    ],
    [
      '..kTk..',
      '.kTttk.',
      'kYYYYYk',
      'kYYyyYk',
      'kYyyyYk',
      'kYyyYYk',
      'kYYYYYk',
      '.kTttk.',
      '..kkk..',
    ],
    [
      '..kTk..',
      '.kTttk.',
      'kGGGGGk',
      'kGgggGk',
      'kGgygGk',
      'kGgggGk',
      'kGGGGGk',
      '.kTttk.',
      '..kkk..',
    ],
  ],
  palette: FAKE,
  radius: 3,
  frameSeconds: 0.09,
});

// A little will-o-flame: the green fire the Wisp is made of.
defineBulletArt('wispFlame', {
  frames: [
    ['..g..', '.gGg.', 'gGyGg', 'gyyyg', '.gyg.'],
    ['.g...', '.gGg.', 'gGyGg', 'gywyg', '.gyg.'],
  ],
  palette: FLAME,
  radius: 2,
  frameSeconds: 0.1,
});

// A glint of light, left when a fake goes out.
defineBulletArt('wispSpark', {
  frames: [['.g.', 'gwg', '.g.'], ['g.g', '.w.', 'g.g']],
  palette: FLAME,
  radius: 1.3,
  frameSeconds: 0.08,
});

// A bubble of marsh gas coming up out of the bog.
defineBulletArt('wispBubble', {
  frames: [['.BBB.', 'Bw.bB', 'B..bB', 'Bb.bB', '.BBB.']],
  palette: GAS,
  radius: 2.5,
});

// The Wisp itself, small (lid hat and all).
defineBulletArt('wispSelf', {
  frames: [
    [
      '...kTk...',
      '.kktttkk.',
      'kTTTTTTTk',
      '.kgGgggk.',
      'kgGyyyygk',
      'kgeyyeygk',
      'kgGyyyygk',
      '.kgGyygk.',
      '..kgggk..',
      '...kgGk..',
      '....kk...',
    ],
    [
      '...kTk...',
      '.kktttkk.',
      'kTTTTTTTk',
      '.kgGgggk.',
      'kgGyyyygk',
      'kgGyyyygk',
      'kgGyyyygk',
      '.kgGyygk.',
      '..kgggk..',
      '..kgGk...',
      '...kk....',
    ],
  ],
  palette: SELF,
  radius: 3.5,
  frameSeconds: 0.2,
});

export const WISP_ATTACKS = {
  // This way! Little lanterns appear round the box and drift in to meet you,
  // slowly. Most are the Wisp's copies, and burn. One is a real light, and
  // touching it gives you some HP back: it's the one that burns steady and
  // gold. Then the fakes go out in a puff of sparks, and more come.
  wispLure(box, density, { Shot, rand }) {
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    let rounds = 0;
    let t = 0;
    let next = 0.15;
    let lights = [];
    const call = (bullets, soul) => {
      const count = 5 + (rounds > 0 ? 1 : 0);
      const turn = rand(0, Math.PI * 2);
      const real = Math.floor(rand(0, count));
      for (let i = 0; i < count; i++) {
        const a = turn + (i / count) * Math.PI * 2;
        const x = cx + Math.cos(a) * 33;
        const y = cy + Math.sin(a) * 33;
        const toward = Math.atan2(soul.y - y, soul.x - x);
        const isReal = i === real;
        const light = new Shot({
          x, y, vx: Math.cos(toward) * 17, vy: Math.sin(toward) * 17, warn: 0.5, life: 2.1,
          homing: { target: soul, turn: isReal ? 0.4 : 0.9 }, art: isReal ? 'wispTrueLight' : 'wispLight',
        });
        if (isReal) light.heals = TRUE_LIGHT_HEAL;
        bullets.push(light);
        lights.push(light);
      }
      rounds++;
    };
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 8.5) {
          call(bullets, soul);
          next = t + 2.75;
        }
        for (const light of lights) {
          if (light.out || light.age < light.warn + light.life) continue;
          // Out it goes. A fake leaves a puff of sparks behind.
          light.out = true;
          if (light.heals) continue;
          for (let i = 0; i < 4; i++) {
            const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
            bullets.push(new Shot({ x: light.x, y: light.y, vx: Math.cos(a) * 40, vy: Math.sin(a) * 40, accel: -25, life: 1.1, art: 'wispSpark' }));
          }
        }
        lights = lights.filter((light) => !light.out);
      },
    };
  },

  // The path: two rows of lights come down the box like lanterns marking a
  // way through the bog, winding, and you keep between them (off the path
  // the bog flares up under you, it blinks first). Then the path
  // splits in two... and one way is a dead end. The lights on that side
  // close in, starting from the far end, so look up and pick the other.
  wispPath(box, density, { Shot, rand }) {
    const cx = box.x + box.w / 2;
    const forkAt = 5.2;
    const closeAt = 6.0;
    const falseSide = Math.random() < 0.5 ? -1 : 1;
    const sway = Math.random() * Math.PI * 2;
    let t = 0;
    let next = 0;
    let bog = 1;
    // Where the middle of the path is, `time` seconds in.
    const middle = (time) => cx + Math.sin(time * 1.1 + sway) * 16 + Math.sin(time * 0.45) * 6;
    const post = (bullets, x, art = 'wispFlame') => {
      bullets.push(new Shot({ x, y: box.y - 4, vy: 40, art }));
    };
    return {
      duration: 8,
      update: (dt, bullets) => {
        t += dt;
        // Off the path, the bog bubbles up in flames (they blink first).
        bog -= dt;
        if (bog <= 0 && t < 8.6) {
          bog = 0.13;
          const m = t < forkAt ? middle(Math.max(0, t - 1.6)) : middle(forkAt);
          const half = t < forkAt + 1.6 ? 19 : 32;
          const left = m - half - (box.x + 2);
          const right = box.x + box.w - 2 - (m + half);
          if (left + right > 4) {
            const u = rand(0, left + right);
            const x = u < left ? box.x + 2 + u : m + half + (u - left);
            bullets.push(new Shot({ x, y: rand(box.y + 30, box.y + box.h - 3), vy: -10, warn: 0.45, life: 0.6, art: 'wispFlame' }));
          }
        }
        if (t < next || t > 8.6) return;
        next = t + 0.16;
        const m = t < forkAt ? middle(t) : middle(forkAt);
        if (t < forkAt) {
          post(bullets, m - 15);
          post(bullets, m + 15);
          return;
        }
        // The fork: the path widens and a row of lights starts down the middle.
        const open = Math.min(1, (t - forkAt) / 0.5);
        const half = 15 + open * 13;
        const midX = Math.min(box.x + box.w - 22, Math.max(box.x + 22, m));
        post(bullets, midX - half);
        post(bullets, midX + half);
        if (t > forkAt + 0.3) post(bullets, midX, 'wispLight');
        // The dead end: its outer row swings in to meet the middle one.
        if (t > closeAt) {
          const shut = Math.min(1, (t - closeAt) / 0.7);
          post(bullets, midX + falseSide * (half - shut * (half - 4)));
        }
      },
    };
  },

  // Keep it company: the Wisp itself comes drifting about the box, and all
  // round it the bog lets go of its gas, bubbles flaring up into flames
  // everywhere (they blink first). Everywhere but near the Wisp: it keeps a
  // little pool of calm round itself, just big enough for a friend. It's
  // harmless, and it only wants you close. Stay by it as it wanders, and
  // when it blinks somewhere else (it shows where first), hurry after it.
  wispCompany(box, density, { Shot, rand, clamp }) {
    const SAFE = 13;
    let wisp = null;
    let goal = null;
    let flare = 0.4;
    let hop = 2.4;
    let next = null;
    let t = 0;
    const pickGoal = () => ({ x: rand(box.x + 16, box.x + box.w - 16), y: rand(box.y + 16, box.y + box.h - 16) });
    return {
      duration: 8,
      update: (dt, bullets) => {
        t += dt;
        if (!wisp) {
          wisp = new Shot({ x: box.x + box.w / 2, y: box.y + box.h / 2, harmless: true, art: 'wispSelf' });
          bullets.push(wisp);
          goal = pickGoal();
          return;
        }
        // Now and then it hops: it shows where first, then it's there.
        hop -= dt;
        if (!next && hop <= 0.7) {
          do next = pickGoal(); while (Math.hypot(next.x - wisp.x, next.y - wisp.y) < 34);
          bullets.push(new Shot({ x: next.x, y: next.y, harmless: true, warn: 0.7, life: 0, art: 'wispSelf' }));
        }
        if (next && hop <= 0) {
          // Off it goes in a puff of flame.
          const turn = rand(0, Math.PI * 2);
          for (let k = 0; k < 6; k++) {
            const a = turn + (k / 6) * Math.PI * 2;
            bullets.push(new Shot({ x: wisp.x, y: wisp.y, vx: Math.cos(a) * 38, vy: Math.sin(a) * 38, life: 1.2, art: 'wispFlame' }));
          }
          wisp.x = next.x;
          wisp.y = next.y;
          goal = pickGoal();
          next = null;
          hop = rand(2.1, 2.5);
        }
        // It wanders from spot to spot, never in a hurry.
        const dx = goal.x - wisp.x;
        const dy = goal.y - wisp.y;
        const far = Math.hypot(dx, dy);
        if (far < 3) goal = pickGoal();
        wisp.vx = far > 0 ? (dx / far) * 24 : 0;
        wisp.vy = far > 0 ? (dy / far) * 24 : 0;
        wisp.x = clamp(wisp.x, box.x + 12, box.x + box.w - 12);
        wisp.y = clamp(wisp.y, box.y + 12, box.y + box.h - 12);
        flare -= dt;
        while (flare <= 0 && t > 0.8) {
          flare += 0.07;
          let x;
          let y;
          let tries = 0;
          do {
            x = rand(box.x + 3, box.x + box.w - 3);
            y = rand(box.y + 3, box.y + box.h - 3);
          } while (Math.hypot(x - wisp.x, y - wisp.y) < SAFE + 6 && ++tries < 12);
          if (tries >= 12) continue;
          // A bubble comes up, then flares (it's the bubble that blinks).
          bullets.push(new Shot({ x, y, harmless: true, life: 0.38, art: 'wispBubble' }));
          // It flares into three little flames.
          for (let k = 0; k < 3; k++) {
            const a = (k / 3) * Math.PI * 2 + rand(0, 2);
            bullets.push(new Shot({ x: x + Math.cos(a) * 4, y: y + Math.sin(a) * 4, vx: Math.cos(a) * 10, vy: Math.sin(a) * 10 - 8, warn: 0.38, life: 0.7, art: 'wispFlame' }));
          }
        }
      },
    };
  },

  // Stay a while: a ring of its lights gathers round where you are and
  // comes in close, because it doesn't want you to go. It shows first (the
  // lights flicker where they'll start), then closes in, holds a moment,
  // and lets go, drifting back out. There's a gap in the ring, always
  // opening toward the middle of the box: slip out through it before it
  // closes, and stay in line with it as the ring drifts back out. The
  // first ring has a real light in it, too, across from the gap.
  // (It used to follow you as it closed, with its gap turning, and could
  // close with the gap facing a wall: there was no way out.)
  wispLonely(box, density, { Shot, rand }) {
    const pieces = 12;
    // How far out it gathers, and how close it comes in.
    const START = 44;
    const CLOSE = 4;
    // Real seconds: showing before it moves, coming in, holding close.
    const WARN = 0.7;
    const closing = 2.2 / density;
    const HOLD = 0.3;
    // How fast it drifts back out once it lets go.
    const DRIFT = 34;
    let rings = [];
    let count = 0;
    let t = 0;
    let next = 0.1;
    const gather = (bullets, soul) => {
      const x = Math.min(Math.max(soul.x, box.x + 14), box.x + box.w - 14);
      const y = Math.min(Math.max(soul.y, box.y + 14), box.y + box.h - 14);
      const midX = box.x + box.w / 2;
      const midY = box.y + box.h / 2;
      const toMiddle = Math.hypot(midX - x, midY - y) < 8 ? rand(0, Math.PI * 2) : Math.atan2(midY - y, midX - x);
      const gapAt = toMiddle + rand(-0.5, 0.5);
      const lights = [];
      // Eleven lights, a sixth of the ring left open around gapAt.
      for (let j = 0; j < pieces - 1; j++) {
        const a = gapAt + ((j + 1) / pieces) * Math.PI * 2;
        const isReal = count === 0 && j === 5;
        const light = new Shot({ x: x + Math.cos(a) * START, y: y + Math.sin(a) * START, warn: WARN, life: 3.4, art: isReal ? 'wispTrueLight' : 'wispLight' });
        light.toward = { x: -Math.cos(a), y: -Math.sin(a) };
        if (isReal) light.heals = TRUE_LIGHT_HEAL;
        lights.push(light);
      }
      rings.push({ lights, age: 0, closing: false, letGo: false });
      bullets.push(...lights);
      count++;
    };
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 8.6) {
          gather(bullets, soul);
          next = t + 3.2;
        }
        for (const ring of rings) {
          ring.age += dt / density;
          // In: fast, slowing to a stop right where it gathered round you.
          if (!ring.closing && ring.age >= WARN) {
            ring.closing = true;
            const v = (2 * (START - CLOSE)) / closing;
            for (const light of ring.lights) {
              light.vx = light.toward.x * v;
              light.vy = light.toward.y * v;
              light.accel = -v / closing;
            }
          }
          // Then it lets go, and they drift back out the way they came.
          if (!ring.letGo && ring.age >= WARN + closing + HOLD) {
            ring.letGo = true;
            for (const light of ring.lights) {
              light.vx = -light.toward.x * DRIFT;
              light.vy = -light.toward.y * DRIFT;
              light.accel = 0;
            }
          }
        }
        rings = rings.filter((ring) => !ring.letGo);
      },
    };
  },
};
