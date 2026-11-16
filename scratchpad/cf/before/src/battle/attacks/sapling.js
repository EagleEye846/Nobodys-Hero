import { defineBulletArt } from '../projectiles.js';

// The Sapling's attacks. It's a young tree spirit that only moves when
// nobody's looking, so it fights like a tree that's cheating: seedlings that
// creep up on you only while you're busy moving, branches that grow across
// the box, whole trees it grows up out of the floor to practise being a big
// one, and saplings that are somewhere else every time you blink.
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

// A red leaf, see-sawing as it falls.
defineBulletArt('sapLeaf', {
  frames: [
    ['.ll..', 'lgLl.', '.lLLk'],
    ['..ll.', '.lgLl', 'kLLl.'],
  ],
  palette: TREE,
  radius: 1.8,
  frameSeconds: 0.3,
});

const BARK = '#7a5436';

// A sapling standing very still, in one pose and then another (a little
// red-leaved tree with two dark knot eyes).
defineBulletArt('sapPoseA', {
  frames: [['.l.l.l.', 'lLlLlLl', '.lLlLl.', 'b.kbk.b', '.bbbbb.', '...b...', '...b...', '..b.b..']],
  palette: TREE,
  radius: 3,
});
defineBulletArt('sapPoseB', {
  frames: [['..lll..', '.lLlLl.', 'lLlLlLl', '..kbk..', '.bbbbb.', 'b..b..b', '...b...', '..b.b..']],
  palette: TREE,
  radius: 3,
});

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
      duration: 8,
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
      duration: 8,
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

  // Growing up: it's practising being one of the big red trees. A trunk
  // shoots up from the floor of the box (every other one right under you),
  // and then its branches come out, one pair at a time, bottom to top, each
  // showing first as a dotted line. When it's grown, it drops its leaves
  // and pretends that never happened. Stand between the branches.
  sapGrow(box, density, { Line, Shot, rand, clamp }) {
    const floor = box.y + box.h;
    let t = 0;
    let next = 0.1;
    let planted = 0;
    let events = [];
    const at = (when, act) => events.push({ when, act });
    const plant = (soul) => {
      const x = planted++ % 2 === 0 ? clamp(soul.x + rand(-4, 4), box.x + 12, box.x + box.w - 12) : rand(box.x + 12, box.x + box.w - 12);
      const height = box.h - 2;
      const life = 3.6;
      at(t, (bullets) => bullets.push(new Line({ x, y: floor, angle: -Math.PI / 2, length: height, thickness: 5, warn: 0.6, life, grow: 110, color: BARK })));
      const tiers = [18, 40, 62, 75];
      tiers.forEach((h, i) => {
        const start = t + 0.7 + i * 0.4;
        const reach = rand(24, 32);
        for (const way of [-1, 1]) {
          const angle = way < 0 ? Math.PI + 0.3 : -0.3;
          at(start, (bullets) => bullets.push(new Line({
            x, y: floor - h, angle, length: reach, thickness: 3, warn: 0.45, life: life - (start - t) - 0.15, grow: 90, color: BARK,
          })));
          // Its leaves drop off the branch tips when it's done.
          at(t + 0.6 + life, (bullets) => {
            const tip = { x: x + Math.cos(angle) * reach, y: floor - h + Math.sin(angle) * reach };
            for (let k = 0; k < 2; k++) {
              bullets.push(new Shot({ x: tip.x + rand(-3, 3), y: tip.y, vx: rand(-15, 15), vy: 10, gravity: 50, life: 2.2, art: 'sapLeaf' }));
            }
          });
        }
      });
    };
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 7.5) {
          next = t + 2.2;
          plant(soul);
        }
        for (const event of events) {
          if (event.when > t || event.done) continue;
          event.done = true;
          event.act(bullets);
        }
        events = events.filter((event) => !event.done);
      },
    };
  },

  // You blinked: a few saplings stand about the box, very still. Then, in
  // the blink of an eye, they're all somewhere else, in a new pose, as if
  // they'd been there all along (they shake a leaf or two loose doing it).
  // Before each blink, a faint outline shows where each one will be: don't
  // be standing there. One of them always fancies the spot you're on.
  sapBlink(box, density, { Shot, rand, pointAwayFrom }) {
    const COUNT = 4;
    const CYCLE = 1.75;
    const SHOW = 0.85;
    let t = 0;
    let trees = [];
    let spots = null;
    let cycle = -1;
    const choose = (soul) => {
      const chosen = [{ x: soul.x + rand(-3, 3), y: soul.y + rand(-3, 3) }];
      while (chosen.length < COUNT) {
        let p = pointAwayFrom(box, soul, 14, 8);
        for (let tries = 0; tries < 10 && chosen.some((q) => Math.hypot(p.x - q.x, p.y - q.y) < 20); tries++) p = pointAwayFrom(box, soul, 14, 8);
        chosen.push(p);
      }
      for (const p of chosen) {
        p.x = Math.min(Math.max(p.x, box.x + 5), box.x + box.w - 5);
        p.y = Math.min(Math.max(p.y, box.y + 6), box.y + box.h - 6);
      }
      return chosen;
    };
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        const now = Math.floor((t + SHOW) / CYCLE);
        if (now !== cycle && t < 9) {
          // The outlines of where they'll be next.
          cycle = now;
          spots = choose(soul);
          const pose = cycle % 2 ? 'sapPoseA' : 'sapPoseB';
          for (const p of spots) bullets.push(new Shot({ x: p.x, y: p.y, harmless: true, warn: SHOW, life: 0, art: pose }));
          spots.pose = pose;
          spots.at = t + SHOW;
        }
        if (spots && t >= spots.at) {
          // Blink.
          for (const tree of trees) tree.life = 0;
          trees = spots.map((p) => {
            const tree = new Shot({ x: p.x, y: p.y, life: CYCLE + 0.05, art: spots.pose });
            bullets.push(tree);
            bullets.push(new Shot({ x: p.x, y: p.y - 3, vx: rand(-25, 25), vy: rand(-30, -15), gravity: 70, life: 1.6, art: 'sapLeaf' }));
            return tree;
          });
          spots = null;
        }
      },
    };
  },
};
