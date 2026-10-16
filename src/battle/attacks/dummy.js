import { defineBulletArt } from '../projectiles.js';

// The Rogue Dummy's attacks. It's a training dummy stuffed with cotton, so
// everything it throws comes out of a sewing basket: pins, buttons, needles
// and thread, tufts of stuffing, and the practice targets it was made to face.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// `tools` holds the bullet classes and helpers (see PATTERN_TOOLS in
// src/battle/bullets.js). Bullet art is drawn pointing right when `rotate` is
// set, so pins and needles face where they fly.

defineBulletArt('pin', {
  frames: [[
    '.rr.....',
    'rRrsssst',
    '.rr.....',
  ]],
  palette: { r: '#ff5470', R: '#ffa0b4', s: '#c9ccd6', t: '#ffffff' },
  radius: 2,
  rotate: true,
});

defineBulletArt('button', {
  frames: [[
    '.bbbbb.',
    'bBBBBBb',
    'bBkBkBb',
    'bBBBBBb',
    'bBkBkBb',
    'bBBBBBb',
    '.bbbbb.',
  ]],
  palette: { b: '#6b3f1a', B: '#c08a4e', k: '#2a160a' },
  radius: 3,
  spin: 3,
});

defineBulletArt('needle', {
  frames: [[
    'kk........',
    'k.sssssssw',
    'kk........',
  ]],
  palette: { k: '#8a8fa0', s: '#d8dce6', w: '#ffffff' },
  radius: 2,
  rotate: true,
});

// Tufts of stuffing, fluffing as they fly.
defineBulletArt('tuft', {
  frames: [
    ['.w.w.', 'wwWww', '.wWw.', 'wwWww', '.w.w.'],
    ['w.w.w', '.wWw.', 'wWwWw', '.wWw.', 'w.w.w'],
  ],
  palette: { w: '#f2ecff', W: '#c9c2e0' },
  radius: 2,
  frameSeconds: 0.15,
});

// A ball of stuffing, swelling before it bursts (harmless itself).
defineBulletArt('cottonBall', {
  frames: [
    ['..www..', '.wwWww.', 'wwWwWww', 'wWwwwWw', 'wwWwWww', '.wwWww.', '..www..'],
    ['.wwwww.', 'wwWwWww', 'wWwwwWw', 'wwwWwww', 'wWwwwWw', 'wwWwWww', '.wwwww.'],
  ],
  palette: { w: '#f2ecff', W: '#c9c2e0' },
  radius: 3,
  frameSeconds: 0.08,
});

// A practice target (harmless itself; it fires pins).
defineBulletArt('target', {
  frames: [[
    '..rrrrr..',
    '.rwwwwwr.',
    'rwrrrrrwr',
    'rwrwwwrwr',
    'rwrwrwrwr',
    'rwrwwwrwr',
    'rwrrrrrwr',
    '.rwwwwwr.',
    '..rrrrr..',
  ]],
  palette: { r: '#ff5470', w: '#f2ecff' },
  radius: 4,
});

export const DUMMY_ATTACKS = {
  // A column of sewing pins lines up at one side of the box, level with you,
  // blinks a warning, then shoots across. Step out of their row.
  pinCushion(box, density, { Shot, every, pick, rand, clamp }) {
    const spacing = 9;
    const volley = every(0.95, 1.3, (bullets, soul) => {
      const fromLeft = Math.random() < 0.5;
      const count = pick([3, 4]);
      const span = (count - 1) * spacing;
      const top = clamp(soul.y - span / 2 + rand(-5, 5), box.y + 4, box.y + box.h - 4 - span);
      for (let i = 0; i < count; i++) {
        bullets.push(new Shot({
          x: fromLeft ? box.x + 4 : box.x + box.w - 4,
          y: top + i * spacing,
          vx: fromLeft ? 105 : -105,
          art: 'pin',
          warn: 0.45,
        }));
      }
    });
    return { duration: 6, update: (dt, bullets, soul) => volley(dt, bullets, soul) };
  },

  // Big buttons pop off and ricochet around the box, spinning, while loose
  // stuffing drifts down between them.
  buttonBounce(box, density, { Shot, every, rand, pick }) {
    const total = 3 + Math.round(density);
    let thrown = 0;
    const pop = every(0.55, 0.85, (bullets) => {
      if (thrown >= total) return;
      thrown++;
      const angle = rand(0.25, 0.75) * Math.PI;
      const speed = rand(58, 76);
      bullets.push(new Shot({
        x: rand(box.x + 10, box.x + box.w - 10),
        y: box.y + 6,
        vx: Math.cos(angle) * speed * pick([-1, 1]),
        vy: Math.sin(angle) * speed,
        art: 'button',
        bounce: true,
        warn: 0.35,
      }));
    });
    const fluff = every(0.65, 1, (bullets) => {
      bullets.push(new Shot({ x: rand(box.x + 4, box.x + box.w - 4), y: box.y - 3, vy: rand(38, 52), art: 'tuft' }));
    });
    return {
      duration: 6.5,
      update: (dt, bullets) => {
        pop(dt, bullets);
        fluff(dt, bullets);
      },
    };
  },

  // A needle shoots across the box pulling a line of thread behind it, near
  // where you are. The thread lingers for a moment, so lines can box you in.
  stitchLine(box, density, { Shot, Line, every, rand, clamp }) {
    const warn = 0.6;
    const speed = 170;
    const stitch = every(1.15, 1.5, (bullets, soul) => {
      const horizontal = Math.random() < 0.6;
      const forward = Math.random() < 0.5;
      let x;
      let y;
      let angle;
      let length;
      if (horizontal) {
        y = clamp(soul.y + rand(-10, 10), box.y + 6, box.y + box.h - 6);
        x = forward ? box.x - 4 : box.x + box.w + 4;
        angle = forward ? 0 : Math.PI;
        length = box.w + 8;
      } else {
        x = clamp(soul.x + rand(-10, 10), box.x + 6, box.x + box.w - 6);
        y = forward ? box.y - 4 : box.y + box.h + 4;
        angle = forward ? Math.PI / 2 : -Math.PI / 2;
        length = box.h + 8;
      }
      bullets.push(new Line({ x, y, angle, length, thickness: 2, warn, grow: speed, life: 1.4, color: '#f2ecff', dash: [3, 2] }));
      bullets.push(new Shot({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, art: 'needle', warn }));
    });
    return { duration: 7, update: (dt, bullets, soul) => stitch(dt, bullets, soul) };
  },

  // Balls of stuffing swell up around the box (never right on top of you),
  // then burst into a ring of tufts.
  stuffingBurst(box, density, { Shot, every, rand, pointAwayFrom }) {
    const swell = 0.65;
    let swelling = [];
    const grow = every(0.85, 1.2, (bullets, soul) => {
      const { x, y } = pointAwayFrom(box, soul, 28);
      bullets.push(new Shot({ x, y, art: 'cottonBall', harmless: true, life: swell }));
      swelling.push({ x, y, t: swell });
    });
    return {
      duration: 6,
      update: (dt, bullets, soul) => {
        grow(dt, bullets, soul);
        for (const ball of swelling) {
          ball.t -= dt;
          if (ball.t > 0) continue;
          const turn = rand(0, Math.PI * 2);
          for (let i = 0; i < 8; i++) {
            const angle = turn + (i / 8) * Math.PI * 2;
            bullets.push(new Shot({ x: ball.x, y: ball.y, vx: Math.cos(angle) * 52, vy: Math.sin(angle) * 52, art: 'tuft' }));
          }
        }
        swelling = swelling.filter((ball) => ball.t > 0);
      },
    };
  },

  // Practice targets pop up in the top of the box and, a moment later, each
  // fires three pins at you.
  trainingTargets(box, density, { Shot, every, rand, angleTo }) {
    let targets = [];
    const raise = every(1.25, 1.65, (bullets) => {
      const x = rand(box.x + 12, box.x + box.w - 12);
      const y = rand(box.y + 10, box.y + box.h * 0.45);
      bullets.push(new Shot({ x, y, art: 'target', harmless: true, life: 1.1 }));
      targets.push({ x, y, t: 0.55 });
    });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        raise(dt, bullets);
        for (const target of targets) {
          target.t -= dt;
          if (target.t > 0) continue;
          const aim = angleTo(target, soul);
          for (const offset of [-0.28, 0, 0.28]) {
            bullets.push(new Shot({ x: target.x, y: target.y, vx: Math.cos(aim + offset) * 88, vy: Math.sin(aim + offset) * 88, art: 'pin' }));
          }
        }
        targets = targets.filter((target) => target.t > 0);
      },
    };
  },
};
