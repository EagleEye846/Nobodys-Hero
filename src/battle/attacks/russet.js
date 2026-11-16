import { defineBulletArt } from '../projectiles.js';

// The Russet's attacks. It's a fox the red of the leaves, playing a game of
// hide-and-seek it's sure it's winning: it hides in one of several leaf
// piles and bursts out at you, pounces on where you're standing the way a
// fox pounces on a mouse in the leaves, follows in your footsteps a moment
// behind you, and races you for a pie it has its eye on.
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
// The look of each (from a bullet made with it), for a fox that turns round.
let LOOKS = null;
const looks = (Shot) => LOOKS ?? (LOOKS = { left: new Shot({ x: 0, y: 0, art: 'russetLeapLeft' }).art, right: new Shot({ x: 0, y: 0, art: 'russetLeap' }).art });
const leftArt = (Shot) => looks(Shot).left;
const rightArt = (Shot) => looks(Shot).right;

// A pie someone left out (touch it first and it's yours: HP back), and the
// crumbs when the fox gets it instead.
const PIE_HEAL = 5;
defineBulletArt('russetPieDish', {
  frames: [['.ccccc.', 'crcrcrc', 'ccccccc', '.CCCCC.']],
  palette: { c: '#e8b060', r: '#a03050', C: '#b07838' },
  radius: 3,
});
defineBulletArt('russetCrumb', {
  frames: [['.c.', 'cCr', '.C.']],
  palette: { c: '#e8b060', r: '#a03050', C: '#b07838' },
  radius: 1.3,
  spin: 5,
});

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
    const round = 2.65;
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
      duration: 8,
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
      duration: 8,
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

  // Watching your feet: the fox falls in behind you and runs exactly where
  // you've been, step for step, a moment behind, leaving its prints in your
  // footsteps and kicking up leaves, out to the side and at you. Stop, or
  // turn back over your own trail, and it's on you. And every so often it
  // gets bored of following and pounces, a little ahead of you, where it
  // thinks you're going (its shadow shows where), and picks up your trail
  // again from there.
  russetTrail(box, density, { Shot, rand, clamp }) {
    let path = [];
    let t = 0;
    let fox = null;
    let from = null;
    let fromT = 0;
    let kick = 0.3;
    let side = 1;
    let print = 0;
    let leap = null;
    let nextLeap = 2.6;
    const DELAY = 1.1;
    const FLIGHT = 0.7;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        path.push({ t, x: soul.x, y: soul.y });
        if (!fox) {
          // It comes in from the corner furthest from you.
          from = { x: soul.x < box.x + box.w / 2 ? box.x + box.w - 5 : box.x + 5, y: soul.y < box.y + box.h / 2 ? box.y + box.h - 5 : box.y + 5 };
          fromT = 0.6;
          fox = new Shot({ x: from.x, y: from.y, warn: 0.6, art: 'russetLeap' });
          bullets.push(fox);
          return;
        }
        if (fox.age < fox.warn) return;
        let to;
        if (leap) {
          // In the air (harmless: it's above you), coming down on the shadow.
          leap.t += dt;
          const u = Math.min(1, leap.t / FLIGHT);
          to = { x: leap.a.x + (leap.b.x - leap.a.x) * u, y: leap.a.y + (leap.b.y - leap.a.y) * u - Math.sin(u * Math.PI) * 22 };
          if (u >= 1) {
            fox.harmless = false;
            for (let i = 0; i < 6; i++) {
              const a = (i / 6) * Math.PI * 2 + rand(0, 1);
              bullets.push(new Shot({ x: leap.b.x, y: leap.b.y, vx: Math.cos(a) * 45, vy: Math.sin(a) * 45, life: 1.2, art: 'russetLeaf' }));
            }
            // It waits there a moment, then takes up the trail from that spot.
            from = { ...leap.b };
            fromT = t + 0.35;
            path = path.filter((step) => step.t > t);
            path.unshift({ t: fromT, x: from.x, y: from.y });
            leap = null;
            nextLeap = t + rand(2.3, 2.7);
          }
        } else if (t >= nextLeap && t < 9) {
          // It knows where you're going to step: it lands a little ahead.
          const last = path[path.length - 1];
          const back = path[Math.max(0, path.length - 7)];
          const span = Math.max(0.05, last.t - back.t);
          const b = {
            x: clamp(soul.x + ((last.x - back.x) / span) * FLIGHT, box.x + 5, box.x + box.w - 5),
            y: clamp(soul.y + ((last.y - back.y) / span) * FLIGHT, box.y + 5, box.y + box.h - 5),
          };
          leap = { a: { x: fox.x, y: fox.y }, b, t: 0 };
          fox.harmless = true;
          bullets.push(new Shot({ x: b.x, y: b.y + 2, harmless: true, life: FLIGHT, art: 'russetShadow' }));
          to = { x: fox.x, y: fox.y };
        } else {
          const when = t - DELAY;
          if (when <= path[0].t) {
            // Still on its way to where the trail starts.
            const u = Math.min(1, Math.max(0, (t - fromT) / Math.max(0.1, path[0].t + DELAY - fromT)));
            to = { x: from.x + (path[0].x - from.x) * u, y: from.y + (path[0].y - from.y) * u };
          } else {
            while (path.length > 2 && path[1].t <= when) path.shift();
            to = path[0];
          }
        }
        const dx = to.x - fox.x;
        const dy = to.y - fox.y;
        if (Math.abs(dx) > 0.2) {
          fox.artName = dx < 0 ? 'russetLeapLeft' : 'russetLeap';
          fox.art = dx < 0 ? leftArt(Shot) : rightArt(Shot);
        }
        // Moved by its velocity, so it reads as running.
        fox.vx = dx / Math.max(dt, 1e-4);
        fox.vy = dy / Math.max(dt, 1e-4);
        fox.x = to.x - fox.vx * dt;
        fox.y = to.y - fox.vy * dt;
        if (leap) return;
        const moving = Math.hypot(dx, dy) / Math.max(dt, 1e-4);
        print -= dt;
        if (print <= 0 && moving > 20) {
          print = 0.18;
          bullets.push(new Shot({ x: to.x, y: to.y + 2, harmless: true, life: 0.8, art: 'russetPrint' }));
        }
        kick -= dt;
        if (kick <= 0 && moving > 20) {
          kick = rand(0.22, 0.28);
          // Out to the side, then (every other one) flicked at you.
          const heading = side > 0 ? Math.atan2(dy, dx) + Math.PI / 2 : Math.atan2(soul.y - to.y, soul.x - to.x);
          side = -side;
          bullets.push(new Shot({ x: to.x, y: to.y, vx: Math.cos(heading) * 46, vy: Math.sin(heading) * 46, warn: 0.15, life: 1.6, art: 'russetLeaf' }));
        }
      },
    };
  },

  // Pie thief: a pie turns up on the leaves somewhere away from you, and the
  // fox's line shows from the edge of the box straight to it. Then it dashes
  // along that line for the pie. Get there first and the pie's yours (a
  // little HP back) and it runs on past, empty-pawed; let it get the pie
  // and it gobbles it, and crumbs fly everywhere. Either way, mind the dash.
  russetPie(box, density, { Shot, Line, every, rand, edgePoint, pointAwayFrom }) {
    let dashes = [];
    const lay = every(1.2, 1.35, (bullets, soul) => {
      const at = pointAwayFrom(box, soul, 22, 10);
      const pie = new Shot({ x: at.x, y: at.y, art: 'russetPieDish' });
      pie.heals = PIE_HEAL;
      bullets.push(pie);
      let from = edgePoint(box);
      for (let tries = 0; tries < 6 && Math.hypot(from.x - at.x, from.y - at.y) < 40; tries++) from = edgePoint(box);
      const angle = Math.atan2(at.y - from.y, at.x - from.x);
      const length = Math.hypot(at.x - from.x, at.y - from.y);
      const warn = 0.85;
      // The line runs on past the pie: it won't stop for you.
      bullets.push(new Line({ x: from.x, y: from.y, angle, length: length + 60, thickness: 7, warn, life: 0, color: '#e0662c' }));
      const fox = new Shot({ x: from.x, y: from.y, harmless: true, warn, art: leapArt(Math.cos(angle)) });
      bullets.push(fox);
      dashes.push({ fox, pie, angle, t: 0, warn, gobbled: false });
    }, { first: 0.3 });
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        lay(dt, bullets, soul);
        for (const dash of dashes) {
          dash.t += dt;
          const { fox, pie, angle } = dash;
          if (dash.t < dash.warn) continue;
          fox.harmless = false;
          fox.vx = Math.cos(angle) * 150;
          fox.vy = Math.sin(angle) * 150;
          if (dash.gobbled || Math.hypot(fox.x - pie.x, fox.y - pie.y) > 6) continue;
          dash.gobbled = true;
          if (pie.spent) continue;
          // Got it. Crumbs everywhere.
          pie.spent = true;
          pie.life = 0;
          const turn = rand(0, Math.PI * 2);
          for (let i = 0; i < 10; i++) {
            const a = turn + (i / 10) * Math.PI * 2;
            bullets.push(new Shot({ x: pie.x, y: pie.y, vx: Math.cos(a) * 50, vy: Math.sin(a) * 50, life: 1.5, art: 'russetCrumb' }));
          }
        }
        // A pie you took is gone from the leaves.
        for (const dash of dashes) if (dash.pie.spent && dash.pie.life > 0) dash.pie.life = 0;
        dashes = dashes.filter((dash) => dash.t < dash.warn + 1.5);
      },
    };
  },
};
