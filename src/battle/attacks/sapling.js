import { defineBulletArt } from '../projectiles.js';

// The Sapling's attacks. It's a young tree spirit that only moves when
// nobody's looking, so it fights like a tree that's cheating: seedlings that
// creep up on you only while you're busy moving, branches that grow across
// the box, roots that break up through the floor under your feet, and its
// own leaves and seeds coming down.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const TREE = { k: '#1c1008', b: '#7a5436', B: '#4e321e', l: '#d8402a', L: '#962418', g: '#ff8a5a', y: '#ffd25e', s: '#9ac850' };

// A seedling: a shoot with two leaves and a glowing eye. It twitches when it
// moves.
defineBulletArt('sapSprout', {
  frames: [
    ['.l...l.', 'lgl.lgl', '.Llsll.', '...s...', '..kbk..', '.kbybk.', '..kkk..'],
    ['l.....l', 'gl...lg', '.Llsll.', '...s...', '..kbk..', '.kbybk.', '..kkk..'],
  ],
  palette: TREE,
  radius: 2.5,
  frameSeconds: 0.15,
});

// An acorn, and the shadow it throws before it lands.
defineBulletArt('sapAcorn', {
  frames: [['.kBk.', 'kBBBk', 'kbbbk', 'kbgbk', '.kbk.']],
  palette: TREE,
  radius: 2,
});
defineBulletArt('sapShadow', {
  frames: [['.ggggg.', 'ggggggg', '.ggggg.']],
  palette: { g: '#3a2a2a' },
  radius: 2,
});

// A crack in the floor, where a root's about to come up.
defineBulletArt('sapCrack', {
  frames: [['k.k.k', '.kBk.', 'kBkBk']],
  palette: TREE,
  radius: 2,
});

// A red leaf, see-sawing as it falls, and a winged seed spinning down.
defineBulletArt('sapLeaf', {
  frames: [
    ['.ll..', 'lgLl.', '.lLLk'],
    ['..ll.', '.lgLl', 'kLLl.'],
  ],
  palette: TREE,
  radius: 1.8,
  frameSeconds: 0.3,
});
defineBulletArt('sapSpinner', {
  frames: [['ll.....', 'lgl....', '.Llbk..', '...kbBk', '....kBk']],
  palette: TREE,
  radius: 2,
  spin: 12,
});

const BARK = '#7a5436';

export const SAPLING_ATTACKS = {
  // Don't look away: seedlings come up round the edge of the box. They only
  // move while you do, creeping after you; stand still and they freeze. But
  // acorns keep dropping where you stand (their shadows show first), so
  // you'll have to step: as little as you can.
  sapCreep(box, density, { Shot, every, clamp, pointAwayFrom }) {
    const floor = box.y + box.h;
    let sprouts = [];
    let acorns = [];
    let last = null;
    const grow = every(0.7, 0.9, (bullets, soul) => {
      if (sprouts.length >= 7) return;
      const at = pointAwayFrom(box, soul, 34, 6);
      const sprout = new Shot({ x: at.x, y: at.y, warn: 0.5, life: 5.5, art: 'sapSprout' });
      bullets.push(sprout);
      sprouts.push(sprout);
    });
    const drop = every(1.15, 1.35, (bullets, soul) => {
      const x = clamp(soul.x, box.x + 3, box.x + box.w - 3);
      const y = clamp(soul.y, box.y + 3, floor - 3);
      const shadow = new Shot({ x, y, harmless: true, life: 0.7, art: 'sapShadow' });
      bullets.push(shadow);
      acorns.push({ x, y, t: 0.6, shadow });
    }, { first: 0.6 });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        grow(dt, bullets, soul);
        drop(dt, bullets, soul);
        const moved = last ? Math.hypot(soul.x - last.x, soul.y - last.y) > 0.01 : false;
        last = { x: soul.x, y: soul.y };
        for (const sprout of sprouts) {
          if (sprout.age < sprout.warn) continue;
          // Only while you're moving, and never quite as fast as you.
          const step = moved ? 34 * dt : 0;
          const dx = soul.x - sprout.x;
          const dy = soul.y - sprout.y;
          const d = Math.hypot(dx, dy) || 1;
          sprout.x += (dx / d) * step;
          sprout.y += (dy / d) * step;
          sprout.age = moved ? sprout.age : sprout.age - dt * 0.6; // frozen ones barely age
        }
        sprouts = sprouts.filter((sprout) => sprout.age < sprout.warn + sprout.life);
        for (const acorn of acorns) {
          acorn.t -= dt;
          if (acorn.t > 0 || acorn.dropped) continue;
          acorn.dropped = true;
          // It drops from just above its shadow, fast.
          bullets.push(new Shot({ x: acorn.x, y: acorn.y - 22, vy: 160, life: 0.14, art: 'sapAcorn' }));
        }
        acorns = acorns.filter((acorn) => !acorn.dropped);
      },
    };
  },

  // Branches: they grow across the box from the walls, each with a dotted
  // line first to show where. Some come from one side, some meet from both
  // with a gap between. As each one pulls back, two leaves drop off it.
  sapBranches(box, density, { Line, Shot, every, rand, spreadAcross, shuffleBag }) {
    const nextY = spreadAcross(box.y + 6, box.y + box.h - 6, 5);
    const kind = shuffleBag(['left', 'right', 'both', 'left', 'right']);
    let leafFalls = [];
    const branch = (bullets, x, y, angle, length) => {
      bullets.push(new Line({ x, y, angle, length, thickness: 4, warn: 0.55, life: 1.1, grow: 170, color: BARK }));
      leafFalls.push({ t: 0.55 + 1.1, x, y, angle, length });
    };
    const grow = every(0.8, 1.0, (bullets, soul) => {
      const y = Math.random() < 0.4 ? soul.y : nextY();
      const which = kind();
      if (which === 'both') {
        const gapAt = rand(box.x + 16, box.x + box.w - 16);
        const gap = 13;
        branch(bullets, box.x, y, 0, gapAt - gap / 2 - box.x);
        branch(bullets, box.x + box.w, y, Math.PI, box.x + box.w - (gapAt + gap / 2));
      } else {
        const length = box.w * rand(0.55, 0.78);
        if (which === 'left') branch(bullets, box.x, y, 0, length);
        else branch(bullets, box.x + box.w, y, Math.PI, length);
      }
    });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        grow(dt, bullets, soul);
        for (const fall of leafFalls) {
          fall.t -= dt;
          if (fall.t > 0) continue;
          fall.done = true;
          for (const u of [0.45, 0.85]) {
            bullets.push(new Shot({
              x: fall.x + Math.cos(fall.angle) * fall.length * u,
              y: fall.y + 2,
              vy: rand(18, 26),
              wobble: { amplitude: 3, frequency: 5 },
              life: 3,
              art: 'sapLeaf',
            }));
          }
        }
        leafFalls = leafFalls.filter((fall) => !fall.done);
      },
    };
  },

  // Roots: the floor cracks under you, and a moment later a root shoots up
  // out of the crack. They come in threes, each a little ahead of where
  // you're going.
  sapRoots(box, density, { Line, Shot, every, rand, clamp }) {
    const floor = box.y + box.h;
    let last = null;
    let drift = 0;
    const root = every(0.42, 0.5, (bullets, soul) => {
      // Lead you a little, the way you're going.
      if (last) drift = clamp((soul.x - last) * 6, -14, 14);
      last = soul.x;
      const x = clamp(soul.x + drift + rand(-3, 3), box.x + 3, box.x + box.w - 3);
      const warn = 0.6;
      bullets.push(new Shot({ x, y: floor - 2, harmless: true, life: warn, art: 'sapCrack' }));
      bullets.push(new Line({
        x, y: floor, angle: -Math.PI / 2, length: rand(48, 66), thickness: 5, warn, life: 0.55, grow: 400, color: BARK,
      }));
    });
    return { duration: 6, update: (dt, bullets, soul) => root(dt, bullets, soul) };
  },

  // Leaf fall: its crown shakes, and red leaves see-saw down all over the
  // box. Every second or so a winged seed comes spinning down at you,
  // faster, and steering a little.
  sapLeaffall(box, density, { Shot, every, rand }) {
    const leaves = every(0.16, 0.24, (bullets) => {
      bullets.push(new Shot({
        x: rand(box.x + 2, box.x + box.w - 2),
        y: box.y - 3,
        vx: rand(-6, 6),
        vy: rand(22, 32),
        wobble: { amplitude: rand(3, 6), frequency: rand(3, 5) },
        life: 4,
        art: 'sapLeaf',
      }));
    });
    const seeds = every(0.9, 1.1, (bullets, soul) => {
      const x = rand(box.x + 6, box.x + box.w - 6);
      bullets.push(new Shot({
        x, y: box.y - 3, vx: (soul.x - x) * 0.6, vy: 62, homing: { target: soul, turn: 0.7 }, life: 2.2, warn: 0.3, art: 'sapSpinner',
      }));
    }, { first: 0.5 });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        leaves(dt, bullets, soul);
        seeds(dt, bullets, soul);
      },
    };
  },
};
