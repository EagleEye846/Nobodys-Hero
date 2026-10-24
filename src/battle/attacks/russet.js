import { defineBulletArt } from '../projectiles.js';

// The Russet's attacks. It's a fox the red of the leaves, playing a game of
// hide-and-seek it's sure it's winning: it hides in one of several leaf
// piles and bursts out at you, pounces on where you're standing, sweeps its
// great brush of a tail across the box, and leaves a trail of paw prints for
// you to read before it runs along them.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const FOX = { k: '#2a0e08', o: '#e0662c', O: '#a8401a', w: '#f6ecdc', W: '#cdbca8', b: '#3a1a10', y: '#ffc24a', l: '#d8402a', L: '#962418', g: '#ff8a5a' };

// A heap of red leaves (it rustles), and the white tip of a tail poking out
// of the one it's in.
defineBulletArt('russetPile', {
  frames: [
    ['....lgl....', '..lLlglLl..', '.lgLlLlgLl.', 'lLlLgLlLlgl', 'LLLLLLLLLLL'],
    ['...lgl.....', '..lLlglLl..', '.lgLlLlgLl.', 'lLlLgLlLlgl', 'LLLLLLLLLLL'],
  ],
  palette: FOX,
  radius: 4,
  frameSeconds: 0.25,
});
defineBulletArt('russetTip', {
  frames: [['.w.', 'wWw', 'oOo'], ['w..', 'wWw', 'oOo']],
  palette: FOX,
  radius: 1.5,
  frameSeconds: 0.12,
});

// The fox mid-leap, stretched out: facing right, and the same facing left.
const LEAP = [
  ['.........k.k.', 'kk......kokok', 'woOOooooooyok', '.kOOoowwooon.', '..kbk..kbk...'],
  ['.........k.k.', 'kk......kokok', 'woOOooooooyok', '.kOOoowwooon.', '.kbk....kbk..'],
];
const mirror = (rows) => rows.map((row) => [...row].reverse().join(''));
defineBulletArt('russetLeap', { frames: LEAP, palette: FOX, radius: 3.5, frameSeconds: 0.1 });
defineBulletArt('russetLeapLeft', { frames: LEAP.map(mirror), palette: FOX, radius: 3.5, frameSeconds: 0.1 });
const leapArt = (dx) => (dx < 0 ? 'russetLeapLeft' : 'russetLeap');

// Its shadow, where it's going to land.
defineBulletArt('russetShadow', {
  frames: [['.ggggg.', 'ggggggg', '.ggggg.']],
  palette: { g: '#3a2a2a' },
  radius: 2,
});

// A leaf kicked up, a tuft of tail fur, and a paw print.
defineBulletArt('russetLeaf', {
  frames: [['.lg', 'lLl', 'Ll.']],
  palette: FOX,
  radius: 1.5,
  spin: 6,
});
defineBulletArt('russetTuft', {
  frames: [['.oo.', 'oOwo', 'oOOo', '.oO.']],
  palette: FOX,
  radius: 2,
});
defineBulletArt('russetTuftTip', {
  frames: [['.ww.', 'wWww', 'wWWw', '.wW.']],
  palette: FOX,
  radius: 2,
});
defineBulletArt('russetPrint', {
  frames: [['b.b', '.b.', 'bbb']],
  palette: { b: '#a8401a' },
  radius: 1.5,
});

// Leaves bursting out of a pile in a ring.
const burst = (bullets, Shot, at, count, speed, offset = 0) => {
  for (let i = 0; i < count; i++) {
    const angle = offset + (i / count) * Math.PI * 2;
    bullets.push(new Shot({ x: at.x, y: at.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1.6, art: 'russetLeaf' }));
  }
};

export const RUSSET_ATTACKS = {
  // Which pile? Three heaps of leaves blow into the box. One of them has the
  // fox in: watch for the white tip of its tail. Then they all burst: the
  // empty ones into rings of leaves, and the fox comes flying out at you.
  russetPiles(box, density, { Shot, rand, angleTo, pointAwayFrom }) {
    const round = 2.3;
    let t = 0;
    let piles = [];
    let played = 0;
    const setUp = (bullets, soul) => {
      piles = [];
      for (let i = 0; i < 3; i++) {
        let at = pointAwayFrom(box, soul, 28, 8);
        // Keep the piles apart from each other, too.
        for (let tries = 0; tries < 10 && piles.some((p) => Math.hypot(p.x - at.x, p.y - at.y) < 22); tries++) at = pointAwayFrom(box, soul, 28, 8);
        const pile = new Shot({ x: at.x, y: at.y, harmless: true, life: 1.55, art: 'russetPile' });
        bullets.push(pile);
        piles.push(pile);
      }
      piles.real = Math.floor(Math.random() * 3);
      piles.tipped = false;
      piles.burst = false;
    };
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= played * round && played < 3) {
          setUp(bullets, soul);
          played++;
        }
        const into = t - (played - 1) * round;
        if (!piles.tipped && into > 0.7) {
          piles.tipped = true;
          const real = piles[piles.real];
          bullets.push(new Shot({ x: real.x + 4, y: real.y - 4, harmless: true, life: 0.8, art: 'russetTip' }));
        }
        if (!piles.burst && into > 1.55) {
          piles.burst = true;
          piles.forEach((pile, i) => {
            if (i !== piles.real) {
              burst(bullets, Shot, pile, 8, 42, rand(0, 1));
              return;
            }
            const aim = angleTo(pile, soul);
            bullets.push(new Shot({ x: pile.x, y: pile.y, vx: Math.cos(aim) * 115, vy: Math.sin(aim) * 115, art: leapArt(Math.cos(aim)) }));
            burst(bullets, Shot, pile, 5, 30, aim + Math.PI / 5);
          });
        }
      },
    };
  },

  // Pounce: a shadow falls where you're standing, and the fox comes down on
  // it in a high leap from the side of the box, scattering leaves where it
  // lands. Then the next one, from the other side.
  russetPounce(box, density, { Shot, every, rand, clamp }) {
    const flight = 0.75;
    let fromLeft = Math.random() < 0.5;
    let leaps = [];
    const pounce = every(1.15, 1.35, (bullets, soul) => {
      const to = { x: clamp(soul.x, box.x + 4, box.x + box.w - 4), y: clamp(soul.y, box.y + 4, box.y + box.h - 4) };
      const from = { x: fromLeft ? box.x + 2 : box.x + box.w - 2, y: rand(box.y + 10, box.y + box.h - 10) };
      fromLeft = !fromLeft;
      bullets.push(new Shot({ x: to.x, y: to.y + 2, harmless: true, life: flight, art: 'russetShadow' }));
      // Harmless in the air (it's above you); it bites when it lands.
      const fox = new Shot({ x: from.x, y: from.y, harmless: true, life: flight, art: leapArt(to.x - from.x) });
      bullets.push(fox);
      leaps.push({ fox, from, to, t: 0 });
    }, { first: 0.3 });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        pounce(dt, bullets, soul);
        for (const leap of leaps) {
          leap.t += dt;
          const u = Math.min(1, leap.t / flight);
          const { fox, from, to } = leap;
          fox.x = from.x + (to.x - from.x) * u;
          fox.y = from.y + (to.y - from.y) * u - Math.sin(u * Math.PI) * 26;
          if (u < 1) continue;
          leap.done = true;
          // Landed: it bites, and the leaves fly.
          bullets.push(new Shot({ x: to.x, y: to.y, life: 0.25, art: leapArt(to.x - from.x) }));
          burst(bullets, Shot, to, 7, 50, rand(0, 1));
        }
        leaps = leaps.filter((leap) => !leap.done);
      },
    };
  },

  // Tail sweep: its brush comes in from a bottom corner, a long arm of fur
  // that swings up across the box like the hand of a clock. There's always
  // a gap in it somewhere along its length (where the fur parts): be in the
  // gap when it passes. Then the other corner.
  russetTail(box, density, { Shot, rand }) {
    const pieces = 14;
    const spacing = 6.2;
    const swing = 1.5;
    let sweeps = [];
    let t = 0;
    let next = 0.2;
    let fromLeft = Math.random() < 0.5;
    const start = (bullets) => {
      const pivot = { x: fromLeft ? box.x : box.x + box.w, y: box.y + box.h };
      const gapAt = 3 + Math.floor(rand(0, pieces - 6));
      const fur = [];
      for (let i = 0; i < pieces; i++) {
        if (i === gapAt || i === gapAt + 1) continue;
        const shot = new Shot({ x: pivot.x, y: pivot.y, warn: 0.6, art: i === pieces - 1 ? 'russetTuftTip' : 'russetTuft' });
        shot.reach = (i + 1) * spacing;
        bullets.push(shot);
        fur.push(shot);
      }
      sweeps.push({ pivot, fur, t: 0, dir: fromLeft ? 1 : -1 });
      fromLeft = !fromLeft;
    };
    return {
      duration: 6.6,
      update: (dt, bullets) => {
        t += dt;
        if (t >= next) {
          start(bullets);
          next += 2.1;
        }
        for (const sweep of sweeps) {
          sweep.t += dt;
          // Flat along the floor while it warns, then up and over.
          const u = Math.min(1, Math.max(0, (sweep.t - 0.6) / swing));
          const eased = u * u * (3 - 2 * u);
          const angle = sweep.dir > 0 ? -eased * Math.PI / 2 : Math.PI + eased * Math.PI / 2;
          for (const shot of sweep.fur) {
            shot.x = sweep.pivot.x + Math.cos(angle) * shot.reach;
            shot.y = sweep.pivot.y + Math.sin(angle) * shot.reach;
            if (u >= 1 && shot.life === Infinity) shot.life = shot.age - shot.warn;
          }
          if (u >= 1) sweep.done = true;
        }
        sweeps = sweeps.filter((sweep) => !sweep.done);
      },
    };
  },

  // Tracks: paw prints appear across the box one by one, a winding trail,
  // and then the fox runs along it, fast, kicking up a leaf at every print.
  // One trail in two runs right through where you are.
  russetTracks(box, density, { Shot, every, rand, clamp }) {
    let runs = [];
    let aimed = Math.random() < 0.5;
    const lay = every(1.9, 2.1, (bullets, soul) => {
      const fromLeft = Math.random() < 0.5;
      const points = [];
      const steps = 5;
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const x = fromLeft ? box.x + u * box.w : box.x + box.w - u * box.w;
        points.push({ x, y: rand(box.y + 8, box.y + box.h - 8) });
      }
      if (aimed) {
        // Bend the middle of the trail through you.
        const i = clamp(Math.round(((soul.x - box.x) / box.w) * steps), 1, steps - 1);
        points[fromLeft ? i : steps - i].y = soul.y;
      }
      aimed = !aimed;
      const prints = [];
      for (let i = 0; i < points.length - 1; i++) {
        for (const u of [0, 0.5]) {
          prints.push({ x: points[i].x + (points[i + 1].x - points[i].x) * u, y: points[i].y + (points[i + 1].y - points[i].y) * u });
        }
      }
      prints.push(points[points.length - 1]);
      runs.push({ points, prints, laid: 0, t: 0, fox: null });
    }, { first: 0.15 });
    const layEvery = 0.08;
    const runSeconds = 0.6;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        lay(dt, bullets, soul);
        for (const run of runs) {
          run.t += dt;
          while (run.laid < run.prints.length && run.t >= run.laid * layEvery) {
            const p = run.prints[run.laid++];
            p.shot = new Shot({ x: p.x, y: p.y, harmless: true, life: 1.6, art: 'russetPrint' });
            bullets.push(p.shot);
          }
          const startAt = run.prints.length * layEvery + 0.45;
          if (run.t < startAt) continue;
          if (!run.fox) {
            run.fox = new Shot({ x: run.points[0].x, y: run.points[0].y, art: leapArt(run.points[1].x - run.points[0].x) });
            run.kicked = 0;
            bullets.push(run.fox);
          }
          const u = Math.min(1, (run.t - startAt) / runSeconds);
          const along = u * (run.points.length - 1);
          const i = Math.min(run.points.length - 2, Math.floor(along));
          const a = run.points[i];
          const b = run.points[i + 1];
          const f = along - i;
          run.fox.x = a.x + (b.x - a.x) * f;
          run.fox.y = a.y + (b.y - a.y) * f;
          // A leaf up off every print it passes.
          const passed = Math.floor(u * (run.prints.length - 1));
          while (run.kicked <= passed && run.kicked < run.prints.length) {
            const p = run.prints[run.kicked++];
            bullets.push(new Shot({ x: p.x, y: p.y, vx: rand(-20, 20), vy: rand(-45, -30), gravity: 90, life: 1.2, art: 'russetLeaf' }));
          }
          if (u >= 1) {
            run.fox.life = run.fox.age;
            run.done = true;
          }
        }
        runs = runs.filter((run) => !run.done);
      },
    };
  },
};
