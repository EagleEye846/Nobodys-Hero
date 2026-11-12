import { defineBulletArt } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { withSnipes } from './snipes.js';

// The Shellac's attacks. It's a hermit crab living in a teapot, and it is
// proud of its home: so it snaps its big claw (a fan of pincers aimed where
// you stand, edges flashing first), tosses its good teacups (they bounce
// about the box), spins the whole teapot until the china flies in rings of
// shards, and lets off steam from the spout in scalding columns. It stands
// to the right of the box, so most things come in from that side.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The attack's own clock (`t`) runs `density`
// times faster than the seconds on the wall, hence the `T` below.

const CHINA = { k: '#1c1a24', c: '#f4eedb', C: '#cfc7ac', w: '#ffffff', b: '#4f7fc8', B: '#2f4f94' };
const CLAW = { k: '#1c1a24', r: '#e0673a', R: '#a8432a', o: '#f5a070' };
const STEAM = { k: '#5a7a80', s: '#e8f6f4', S: '#b8d8d6', t: '#a8723a', T: '#7a4a22', y: '#d9a866' };


// A pincer pointing right: open, then snapped shut.
const pincer = (open) => art(13, 11, (p) => {
  p.ellipse(3, 5, 3, 3, 'r');
  p.ellipse(2, 4, 1.5, 1, 'o');
  const a = open ? 1.5 : 4;
  const b = open ? 8.5 : 6;
  p.line(5, 4, 11, a, 'r', 2);
  p.line(5, 6, 11, b, 'R', 2);
});
defineBulletArt('shlPincer', { frames: [pincer(true), pincer(false)], palette: CLAW, radius: 3.4, rotate: true, frameSeconds: 0.18 });

// A teacup: bowl, blue band, and a handle.
const CUP = art(11, 9, (p) => {
  p.ring(8.5, 3.5, 2, 2, 'C', 1);
  p.poly([[0, 1], [8, 1], [7, 6], [4, 7], [1, 6]], 'c');
  p.rect(1, 3, 7, 1, 'b');
  p.rect(0, 1, 9, 1, 'w');
  p.rect(2, 6, 4, 1, 'C');
});
defineBulletArt('shlCup', { frames: [CUP], palette: CHINA, radius: 3.6, spin: 3 });

// A shard of broken china, two sizes.
const SHARD = art(7, 7, (p) => {
  p.poly([[0, 3], [5, 0], [6, 5], [2, 6]], 'c');
  p.line(1, 3, 5, 1, 'b');
});
const CHUNK = art(9, 9, (p) => {
  p.poly([[0, 4], [3, 0], [8, 2], [7, 7], [2, 8]], 'c');
  p.line(1, 4, 4, 1, 'b');
  p.line(4, 2, 7, 3, 'B');
  p.set(5, 5, 'C');
  p.set(4, 6, 'C');
});
defineBulletArt('shlShard', { frames: [SHARD], palette: CHINA, radius: 2.2, spin: 7 });
defineBulletArt('shlChunk', { frames: [CHUNK], palette: CHINA, radius: 3.2, spin: 4 });

// The teapot itself, spinning (harmless: it's the shards that hurt).
const POT = art(19, 15, (p) => {
  p.ring(17, 7, 2, 3, 'C', 1.2);
  p.line(3, 6, 0, 2, 'C', 2);
  p.ellipse(9, 8, 7, 5.5, 'c');
  p.ellipse(8, 6, 4, 3, 'w');
  p.rect(3, 9, 12, 1, 'b');
  p.ellipse(9, 2.5, 4, 1.5, 'c');
  p.set(9, 0, 'b');
});
defineBulletArt('shlPot', { frames: [POT], palette: CHINA, radius: 1, spin: 5 });

// A scalding puff of steam, and a drop of tea.
defineBulletArt('shlPuff', {
  frames: [
    ['..sss..', '.sSsss.', 'sssSsss', '.sssSs.', '..sss..'],
    ['..sss..', '.ssSss.', 'sSsssss', '.ssSss.', '..sss..'],
  ],
  palette: STEAM,
  radius: 3,
  frameSeconds: 0.2,
});
defineBulletArt('shlDrop', { frames: [['.t.', 'ttt', 'tTt', '.t.']], palette: STEAM, radius: 1.6 });

export const SHELLAC_ATTACKS = {
  // Claw-snap: its big claw reaches round the pot and snaps, and a fan of
  // pincers flies out aimed at where you were. The edges of the fan flash
  // first. Odd number of pincers, so the middle one is always on you.
  shellClaws(box, density, { Shot, Line, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.2);
    let fans = 0;
    let firing = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && fans < 4 && t < T(5.2)) {
          fans++;
          next = t + T(1.55);
          const from = { x: box.x + box.w + 6, y: clamp(soul.y + rand(-22, 22), box.y + 6, box.y + box.h - 6) };
          const aim = Math.atan2(soul.y - from.y, soul.x - from.x);
          const spread = 0.5;
          for (const side of [-1, 1]) bullets.push(new Line({ x: from.x, y: from.y, angle: aim + side * spread, length: 100, thickness: 2, warn: 0.75, life: 0, color: '#e0673a' }));
          bullets.push(new Shot({ x: from.x - 2, y: from.y, harmless: true, warn: 0, life: 0.75, art: 'shlPincer' }));
          firing.push({ at: t + T(0.75), aim, spread, from });
        }
        for (const fan of firing) {
          if (t < fan.at) continue;
          fan.done = true;
          // A second, narrower snap follows half a beat later, aimed afresh.
          if (!fan.second) firing.push({ at: t + T(0.5), second: true, aim: Math.atan2(soul.y - fan.from.y, soul.x - fan.from.x), spread: 0.22, from: fan.from });
          if (fan.second) fan.aim = Math.atan2(soul.y - fan.from.y, soul.x - fan.from.x);
          const count = fan.second ? 3 : 7;
          for (let i = 0; i < count; i++) {
            const a = fan.aim - fan.spread + (2 * fan.spread * i) / (count - 1);
            const middle = i === (count - 1) / 2;
            bullets.push(new Shot({ x: fan.from.x, y: fan.from.y, vx: Math.cos(a) * (fan.second ? 54 : 52), vy: Math.sin(a) * (fan.second ? 54 : 52), art: 'shlPincer', life: 4, homing: middle ? { target: soul, turn: 0.9 } : null }));
          }
        }
        firing = firing.filter((fan) => !fan.done);
      },
    };
  },

  // Teacup toss: it lobs its good cups in high arcs; they hit the walls of
  // the box and keep bouncing, and now and then one is thrown straight at you.
  shellCups(box, density, { Shot, every, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let thrown = 0;
    const toss = every(0.7, 0.9, (bullets, soul) => {
      if (thrown >= 8) return;
      thrown++;
      const y = rand(box.y + 12, box.y + box.h - 10);
      const aimed = thrown % 2 === 0;
      const vx = -rand(42, 56);
      const vy = aimed ? clamp((soul.y - y) * 0.9, -40, 40) : -rand(25, 70);
      bullets.push(new Shot({ x: box.x + box.w + 6, y, vx, vy, gravity: aimed ? 0 : 95, bounce: true, art: 'shlCup', life: 4.2 }));
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < T(5.6)) toss(dt, bullets, soul);
      },
    };
  },

  // Shell spin: the whole teapot rolls into the box and spins, flinging
  // rings of china shards that turn a little each time, then rolls out.
  shellSpin(box, density, { Shot, rand, pointAwayFrom, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let pot = null;
    let angle = rand(0, Math.PI);
    let spawnAt = 0;
    const start = { x: box.x + box.w + 14, y: box.y + box.h / 2 };
    let target = null;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!pot) {
          pot = new Shot({ x: start.x, y: start.y, harmless: true, life: 6.4, art: 'shlPot' });
          bullets.push(pot);
          target = pointAwayFrom(box, soul, 30, 18);
        }
        const k = clamp((t - T(0.1)) / T(0.9), 0, 1);
        const leave = clamp((t - T(5.6)) / T(0.9), 0, 1);
        if (leave > 0) {
          pot.x = target.x + (start.x - target.x) * leave;
          pot.y = target.y + (start.y - target.y) * leave;
        } else {
          pot.x = start.x + (target.x - start.x) * k;
          pot.y = start.y + (target.y - start.y) * k;
          // Once it's in, it rolls slowly after you (and stops short of you).
          if (k >= 1) {
            const dx = soul.x - target.x;
            const dy = soul.y - target.y;
            const d = Math.hypot(dx, dy);
            if (d > 26) {
              target.x += (dx / d) * 11 * (dt / density);
              target.y += (dy / d) * 11 * (dt / density);
            }
          }
        }
        if (t >= T(1.1) && t < T(5.4) && t >= spawnAt) {
          spawnAt = t + T(0.68);
          angle += 0.42;
          const n = 7;
          for (let i = 0; i < n; i++) {
            const a = angle + (i / n) * Math.PI * 2;
            bullets.push(new Shot({ x: pot.x, y: pot.y, vx: Math.cos(a) * 28, vy: Math.sin(a) * 28, art: i % 3 === 0 ? 'shlChunk' : 'shlShard', warn: 0.45, life: 4 }));
          }
        }
      },
    };
  },

  // Let off steam: the pot whistles. Columns of scalding steam shoot up from
  // the floor of the box (each flashes first), one always where you are and
  // one somewhere else, and drops of tea fall between them.
  shellSteam(box, density, { Shot, Line, every, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.2);
    let n = 0;
    const drip = every(0.35, 0.5, (bullets) => {
      bullets.push(new Shot({ x: rand(box.x + 6, box.x + box.w - 6), y: box.y - 3, vy: rand(34, 48), art: 'shlDrop', life: 4 }));
    });
    // One Line is both the warning (a thin dashed preview of the column) and
    // the column itself, which shoots up the moment the warning is over.
    const column = (bullets, x) => {
      bullets.push(new Line({ x, y: box.y + box.h, angle: -Math.PI / 2, length: box.h, thickness: 8, warn: 0.95, life: 0.5, grow: 330, color: '#e8f6f4', glow: '#b8d8d6' }));
      bullets.push(new Shot({ x, y: box.y + box.h - 3, harmless: true, warn: 0, life: 0.95, art: 'shlPuff' }));
    };
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < T(5.8)) drip(dt, bullets);
        if (t >= next && n < 5 && t < T(5)) {
          n++;
          next = t + T(1.2);
          const x1 = clamp(soul.x + rand(-4, 4), box.x + 7, box.x + box.w - 7);
          column(bullets, x1);
          let x2 = rand(box.x + 7, box.x + box.w - 7);
          if (Math.abs(x2 - x1) < 16) x2 = x1 < box.x + box.w / 2 ? x1 + 22 : x1 - 22;
          column(bullets, clamp(x2, box.x + 7, box.x + box.w - 7));
        }
      },
    };
  },
};

// Aimed shots on top, so standing still or running one way is never safe (see snipes.js).
SHELLAC_ATTACKS.shellClaws = withSnipes(SHELLAC_ATTACKS.shellClaws, { art: 'shlPincer' });
SHELLAC_ATTACKS.shellCups = withSnipes(SHELLAC_ATTACKS.shellCups, { art: 'shlCup' });
SHELLAC_ATTACKS.shellSpin = withSnipes(SHELLAC_ATTACKS.shellSpin, { art: 'shlChunk', count: 2, first: 2.4, every: 2 });
