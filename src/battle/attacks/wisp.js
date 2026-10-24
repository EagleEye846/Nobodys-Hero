import { defineBulletArt } from '../projectiles.js';

// The Wisp's attacks. It's a marsh light that copies the lanterns on the
// safe path through the Lantern Marsh, to lead people off it (not to be
// cruel: it just wants someone to come and see it). So it fights with
// lights you'd like to follow: little lanterns drifting in to meet you
// (most of them burn, but one is real, and touching that one HEALS you),
// a path of lights that leads into a dead end, the Wisp itself blinking in
// and out, bubbles of marsh gas that catch light and pop, and a ring of its
// lights that comes in close round you, because it's lonely.
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

// The Wisp itself, small, blinking in somewhere (lid hat and all).
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
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 5.8) {
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
  // way through the bog, winding, and you keep between them. Then the path
  // splits in two... and one way is a dead end. The lights on that side
  // close in, starting from the far end, so look up and pick the other.
  wispPath(box, density, { Shot }) {
    const cx = box.x + box.w / 2;
    const forkAt = 3.1;
    const closeAt = 3.9;
    const falseSide = Math.random() < 0.5 ? -1 : 1;
    const sway = Math.random() * Math.PI * 2;
    let t = 0;
    let next = 0;
    // Where the middle of the path is, `time` seconds in.
    const middle = (time) => cx + Math.sin(time * 1.1 + sway) * 16 + Math.sin(time * 0.45) * 6;
    const post = (bullets, x, art = 'wispFlame') => {
      bullets.push(new Shot({ x, y: box.y - 4, vy: 40, art }));
    };
    return {
      duration: 6.8,
      update: (dt, bullets) => {
        t += dt;
        if (t < next || t > 6.2) return;
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

  // Here! No, here! The Wisp blinks in somewhere in the box, away from you,
  // and goes off in a ring of little flames with one gap in it. Then it
  // blinks out, and in again somewhere else, quicker as it goes.
  wispBlink(box, density, { Shot, rand, pointAwayFrom }) {
    let t = 0;
    let next = 0.15;
    let blinks = 0;
    let waiting = [];
    const appear = (bullets, soul) => {
      const at = pointAwayFrom(box, soul, 30, 12);
      const self = new Shot({ x: at.x, y: at.y, warn: 0.5, life: 0.12, harmless: true, art: 'wispSelf' });
      self.gap = rand(0, Math.PI * 2);
      bullets.push(self);
      waiting.push(self);
      blinks++;
    };
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 5.6) {
          appear(bullets, soul);
          next = t + Math.max(0.6, 1.0 - blinks * 0.06);
        }
        for (const self of waiting) {
          if (self.age < self.warn) continue;
          self.popped = true;
          const pieces = 11;
          for (let i = 0; i < pieces; i++) {
            const a = self.gap + ((i + 1) / (pieces + 1)) * Math.PI * 2;
            bullets.push(new Shot({ x: self.x, y: self.y, vx: Math.cos(a) * 46, vy: Math.sin(a) * 46, accel: -16, life: 2.4, art: 'wispFlame' }));
          }
        }
        waiting = waiting.filter((self) => !self.popped);
      },
    };
  },

  // Marsh gas: bubbles come wobbling up out of the bog, and each one, when
  // it gets high enough, catches light off the Wisp and pops into a few
  // little flames that drop back down.
  wispGas(box, density, { Shot, every, rand, spreadAcross }) {
    const nextX = spreadAcross(box.x + 6, box.x + box.w - 6, 6);
    let bubbles = [];
    const rise = every(0.3, 0.42, (bullets) => {
      const bubble = new Shot({
        x: nextX(), y: box.y + box.h + 4, vy: -rand(26, 34), wobble: null, art: 'wispBubble',
      });
      bubble.baseX = bubble.x;
      bubble.sway = rand(0, Math.PI * 2);
      bubble.popAt = rand(box.y + 12, box.y + box.h * 0.55);
      bullets.push(bubble);
      bubbles.push(bubble);
    });
    return {
      duration: 6.4,
      update: (dt, bullets) => {
        rise(dt, bullets);
        for (const bubble of bubbles) {
          bubble.x = bubble.baseX + Math.sin(bubble.age * 4 + bubble.sway) * 3;
          if (bubble.y > bubble.popAt) continue;
          // Pop: it's gone, and three flames fall out of where it was.
          bubble.spent = true;
          for (const vx of [-24, 0, 24]) {
            bullets.push(new Shot({ x: bubble.x, y: bubble.y, vx, vy: -30, gravity: 70, life: 2.6, art: 'wispFlame' }));
          }
        }
        bubbles = bubbles.filter((bubble) => !bubble.spent);
      },
    };
  },

  // Stay a while: a ring of its lights gathers round you and comes in close,
  // turning, because it doesn't want you to go. There's a gap in the ring:
  // slip out through it before it closes. The first ring has a real light
  // in it, too.
  wispLonely(box, density, { Shot, rand }) {
    const pieces = 12;
    let ring = null;
    let rings = 0;
    let t = 0;
    let next = 0.1;
    const gather = (bullets, soul) => {
      const gap = Math.floor(rand(0, pieces));
      const real = rings === 0 ? (gap + Math.floor(pieces / 2)) % pieces : -1;
      const lights = [];
      for (let i = 0; i < pieces; i++) {
        if (i === gap || i === (gap + 1) % pieces) continue;
        const light = new Shot({ x: soul.x, y: soul.y, warn: 0.4, life: 2.6, art: i === real ? 'wispTrueLight' : 'wispLight' });
        light.slot = i;
        if (i === real) light.heals = TRUE_LIGHT_HEAL;
        lights.push(light);
      }
      ring = { lights, x: soul.x, y: soul.y, turn: rand(0, Math.PI * 2), spin: rand(0.9, 1.3) * (Math.random() < 0.5 ? 1 : -1), age: 0 };
      bullets.push(...lights);
      rings++;
    };
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 5.4) {
          gather(bullets, soul);
          next = t + 3.2;
        }
        if (!ring) return;
        ring.age += dt;
        // It follows you, a little slower than you go.
        ring.x += (soul.x - ring.x) * Math.min(1, dt * 0.9);
        ring.y += (soul.y - ring.y) * Math.min(1, dt * 0.9);
        ring.turn += ring.spin * dt;
        // In close, a moment, then it lets go and drifts off.
        const k = ring.age;
        const radius = k < 2.2 ? 46 - (k / 2.2) * 43 : 3 + (k - 2.2) * 48;
        for (const light of ring.lights) {
          const a = ring.turn + (light.slot / pieces) * Math.PI * 2;
          light.x = ring.x + Math.cos(a) * radius;
          light.y = ring.y + Math.sin(a) * radius;
        }
      },
    };
  },
};
