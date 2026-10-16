import { CUSTOM_PATTERNS } from '../data/patterns/index.js';
import { Shot, Line, Pillar, defineBulletArt, bulletArtNames } from './projectiles.js';
import { rand, pick, clamp, every, angleTo, edgePoint, pointAwayFrom } from './patternTools.js';
import { ENEMY_ATTACKS } from './attacks/index.js';

// Attack patterns, and how an enemy's attack is created for a turn.
//
// A pattern is a factory `(box, density, tools) => ({ duration, mode, update(dt, bullets, soul) })`.
// Each turn the battle creates a fresh one, so patterns roll their own random
// settings and no two turns play out quite the same. `update` pushes bullets
// (see src/battle/projectiles.js) into the list. `mode` is the soul mode for the
// turn: 'normal' unless it's a boss's special attack.
//
// Patterns come from three places:
//   - each enemy's own attacks, in src/battle/attacks/<enemy>.js (use these!)
//   - the plain generic patterns below, kept for the Pattern Lab and testing
//   - patterns made in the Pattern Lab, in src/data/patterns/

export { Shot, Line, Pillar, defineBulletArt, rand, pick, clamp, every, angleTo, edgePoint, pointAwayFrom };

// Everything a pattern is handed as its third argument, so pattern files don't
// need to import anything.
export const PATTERN_TOOLS = { Shot, Line, Pillar, defineBulletArt, rand, pick, clamp, every, angleTo, edgePoint, pointAwayFrom };

// `difficulty` tunes a pattern for an enemy. density < 1 spawns bullets less
// often (and slows moving emitters); speed < 1 makes each bullet fly slower.
export function createPattern(name, box, { density = 1, speed = 1 } = {}) {
  const make = ENEMY_ATTACKS[name] ?? PATTERNS[name] ?? CUSTOM_PATTERNS[name];
  if (!make) throw new Error(`Unknown attack pattern '${name}'`);
  const pattern = { mode: 'normal', ...make(box, density, PATTERN_TOOLS) };
  const spawn = pattern.update;
  pattern.update = (dt, bullets, soul) => {
    const before = bullets.length;
    spawn(dt * density, bullets, soul);
    for (let i = before; i < bullets.length; i++) {
      const bullet = bullets[i];
      bullet.vx = (bullet.vx ?? 0) * speed;
      bullet.vy = (bullet.vy ?? 0) * speed;
      if (bullet.grow) bullet.grow *= speed;
    }
  };
  return pattern;
}

// The plain generic patterns.
const PATTERNS = {
  // Cotton rains down, blown by a wind that changes every turn.
  rain(a) {
    const wind = rand(-25, 25);
    const spawn = every(0.14, 0.24, (bullets) => {
      bullets.push(new Shot({
        x: a.x - wind * 0.6 + Math.random() * a.w,
        y: a.y - 3,
        vx: wind + rand(-8, 8),
        vy: rand(55, 90),
        size: Math.random() < 0.3 ? 'small' : 'puff',
      }));
    });
    return { duration: 6, update: (dt, bullets) => spawn(dt, bullets) };
  },

  // Rows of cotton fall with one gap, and the gap wanders so you have to follow it.
  // Easier enemies leave a wider gap.
  sweep(a, density) {
    const gap = Math.min(40, 22 / density);
    const minCenter = a.x + gap / 2 + 2;
    const maxCenter = a.x + a.w - gap / 2 - 2;
    let center = rand(minCenter, maxCenter);
    let drift = rand(-25, 25);
    const spawn = every(0.85, 1.15, (bullets) => {
      for (let x = a.x + 3; x < a.x + a.w; x += 7) {
        if (Math.abs(x - center) > gap / 2) bullets.push(new Shot({ x, y: a.y - 3, vy: 50, size: 'small' }));
      }
    });
    return {
      duration: 6.5,
      update: (dt, bullets) => {
        drift = clamp(drift + rand(-60, 60) * dt, -30, 30);
        center += drift * dt;
        if (center < minCenter || center > maxCenter) {
          drift = -drift;
          center = clamp(center, minCenter, maxCenter);
        }
        spawn(dt, bullets);
      },
    };
  },

  // Spreads of 1, 3 or 5 shots aimed at the soul from random edges.
  aimed(a) {
    const speed = rand(70, 95);
    const spawn = every(0.6, 0.95, (bullets, soul) => {
      const side = pick(['top', 'left', 'right']);
      const x = side === 'left' ? a.x - 3 : side === 'right' ? a.x + a.w + 3 : rand(a.x + 6, a.x + a.w - 6);
      const y = side === 'top' ? a.y - 3 : rand(a.y + 6, a.y + a.h * 0.6);
      const aim = Math.atan2(soul.y - y, soul.x - x);
      const count = pick([1, 3, 3, 5]);
      for (let i = 0; i < count; i++) {
        const angle = aim + (i - (count - 1) / 2) * 0.22;
        bullets.push(new Shot({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed }));
      }
    });
    return { duration: 6, update: (dt, bullets, soul) => spawn(dt, bullets, soul) };
  },

  // A spinning emitter that sways near the top. Arms, spin direction and speed are random.
  spiral(a) {
    const arms = pick([2, 3]);
    const turn = rand(0.3, 0.5) * pick([-1, 1]);
    const speed = rand(38, 50);
    const baseX = a.x + a.w / 2 + rand(-12, 12);
    const phase = rand(0, Math.PI * 2);
    let angle = rand(0, Math.PI * 2);
    let time = 0;
    const spawn = every(0.11, 0.11, (bullets) => {
      const x = baseX + Math.sin(time * 1.3 + phase) * 14;
      for (let i = 0; i < arms; i++) {
        const armAngle = angle + (i * Math.PI * 2) / arms;
        bullets.push(new Shot({ x, y: a.y + 14, vx: Math.cos(armAngle) * speed, vy: Math.sin(armAngle) * speed, size: 'small' }));
      }
      angle += turn;
    });
    return {
      duration: 6.5,
      update: (dt, bullets) => {
        time += dt;
        spawn(dt, bullets);
      },
    };
  },

  // Heavy yarn balls bounce around the box for the whole turn. Easier enemies throw fewer.
  bounce(a, density) {
    const total = Math.max(2, Math.round(pick([3, 4]) * density));
    let spawned = 0;
    const spawn = every(0.6, 1.0, (bullets) => {
      if (spawned >= total) return;
      spawned++;
      const angle = rand(0.3, 0.7) * Math.PI;
      const speed = rand(55, 75);
      bullets.push(new Shot({
        x: rand(a.x + 10, a.x + a.w - 10),
        y: a.y + 6,
        vx: Math.cos(angle) * speed * pick([-1, 1]),
        vy: Math.sin(angle) * speed,
        size: 'yarn',
        dmg: 12,
        bounce: true,
      }));
    });
    return { duration: 6.5, update: (dt, bullets) => spawn(dt, bullets) };
  },

  // An emitter wanders along the top edge, changing direction at random, firing fans.
  wanderer(a) {
    let x = rand(a.x + 10, a.x + a.w - 10);
    let vx = rand(-40, 40);
    const steer = every(0.3, 0.6, () => {
      vx = rand(-45, 45);
    });
    const fire = every(0.4, 0.55, (bullets) => {
      const speed = rand(50, 65);
      for (let i = 0; i < 5; i++) {
        const angle = Math.PI / 2 + (i - 2) * 0.22;
        bullets.push(new Shot({ x, y: a.y + 4, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed }));
      }
    });
    return {
      duration: 6.5,
      update: (dt, bullets) => {
        steer(dt);
        x += vx * dt;
        if (x < a.x + 6 || x > a.x + a.w - 6) {
          vx = -vx;
          x = clamp(x, a.x + 6, a.x + a.w - 6);
        }
        fire(dt, bullets);
      },
    };
  },

  // The lantern moth: glittering dust weaves across the box from both sides.
  flutter(a) {
    const spawn = every(0.45, 0.75, (bullets) => {
      const fromLeft = Math.random() < 0.5;
      bullets.push(new Shot({
        x: fromLeft ? a.x - 3 : a.x + a.w + 3,
        y: rand(a.y + 10, a.y + a.h - 10),
        vx: (fromLeft ? 1 : -1) * rand(40, 58),
        vy: rand(-6, 6),
        size: 'dust',
        wobble: { amplitude: rand(6, 13), frequency: rand(4, 6.5) },
      }));
    });
    return { duration: 6.5, update: (dt, bullets) => spawn(dt, bullets) };
  },

  // The lantern moth: rings of embers burst from points around the box,
  // never right on top of you.
  ember(a) {
    const spawn = every(1.0, 1.4, (bullets, soul) => {
      let x = 0;
      let y = 0;
      for (let tries = 0; tries < 10; tries++) {
        x = rand(a.x + 10, a.x + a.w - 10);
        y = rand(a.y + 10, a.y + a.h * 0.6);
        if (Math.hypot(x - soul.x, y - soul.y) > 28) break;
      }
      const count = pick([6, 8]);
      const turn = rand(0, Math.PI * 2);
      const speed = rand(38, 50);
      for (let i = 0; i < count; i++) {
        const angle = turn + (i / count) * Math.PI * 2;
        bullets.push(new Shot({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, size: 'ember' }));
      }
    });
    return { duration: 6.5, update: (dt, bullets, soul) => spawn(dt, bullets, soul) };
  },

  // The dust bunny: puffs of dust hop up from the bottom corners in arcs.
  hop(a) {
    const spawn = every(0.45, 0.8, (bullets) => {
      const fromLeft = Math.random() < 0.5;
      bullets.push(new Shot({
        x: fromLeft ? a.x + rand(2, 14) : a.x + a.w - rand(2, 14),
        y: a.y + a.h + 3,
        vx: (fromLeft ? 1 : -1) * rand(22, 44),
        vy: -rand(85, 112),
        gravity: 120,
        size: 'puff',
      }));
    });
    return { duration: 6, update: (dt, bullets) => spawn(dt, bullets) };
  },

  // The waxling: drops of hot wax fall from above, faster and faster.
  drip(a) {
    const spawn = every(0.22, 0.38, (bullets) => {
      bullets.push(new Shot({ x: rand(a.x + 4, a.x + a.w - 4), y: a.y - 3, vy: rand(8, 18), gravity: rand(110, 150), size: 'wax' }));
    });
    return { duration: 6, update: (dt, bullets) => spawn(dt, bullets) };
  },

  // The shade: a ring of shadow forms around you and closes in. Slip out
  // through the gap before it shuts.
  orbit(a) {
    const count = 12;
    const radius = 34;
    const spawn = every(1.6, 2.1, (bullets, soul) => {
      const gapAt = Math.floor(rand(0, count));
      const speed = rand(24, 32);
      for (let i = 0; i < count; i++) {
        if (i === gapAt || i === (gapAt + 1) % count) continue;
        const angle = (i / count) * Math.PI * 2;
        bullets.push(new Shot({
          x: soul.x + Math.cos(angle) * radius,
          y: soul.y + Math.sin(angle) * radius,
          vx: -Math.cos(angle) * speed,
          vy: -Math.sin(angle) * speed,
          size: 'shadow',
        }));
      }
    });
    return { duration: 6.5, update: (dt, bullets, soul) => spawn(dt, bullets, soul) };
  },

  // Boss only (HEAVY soul mode): stone pillars of random heights slide along the floor, sometimes in pairs.
  pillars(a) {
    const width = 8;
    const spawn = every(0.9, 1.4, (bullets) => {
      const fromLeft = Math.random() < 0.5;
      const speed = rand(55, 75);
      const count = Math.random() < 0.3 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const height = Math.round(rand(10, 20));
        const offset = i * 34;
        bullets.push(new Pillar({
          x: fromLeft ? a.x - width - offset : a.x + a.w + offset,
          y: a.y + a.h - height,
          w: width,
          h: height,
          vx: fromLeft ? speed : -speed,
        }));
      }
    });
    // Slow drops from above keep you from hovering at the top of a jump.
    const drop = every(1.2, 1.8, (bullets) => {
      bullets.push(new Shot({ x: rand(a.x + 6, a.x + a.w - 6), y: a.y - 3, vy: 40 }));
    });
    return {
      duration: 7,
      mode: 'heavy',
      update: (dt, bullets) => {
        spawn(dt, bullets);
        drop(dt, bullets);
      },
    };
  },
};

// The enemies' own themed attacks, for tools.
export const ENEMY_ATTACK_NAMES = Object.keys(ENEMY_ATTACKS);

// Every pattern's name: enemies' own, the generic ones and the Pattern Lab's.
export const PATTERN_NAMES = [...Object.keys(ENEMY_ATTACKS), ...Object.keys(PATTERNS), ...Object.keys(CUSTOM_PATTERNS)];

// The bullet art a Shot can use, for tools.
export const SHOT_SIZES = bulletArtNames();
