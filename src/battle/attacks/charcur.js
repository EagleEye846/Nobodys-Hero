import { defineBulletArt } from '../projectiles.js';
import { withSnipes } from './snipes.js';

// The Charcur's attacks. A lean stray dog of charcoal with ember eyes and a
// smoking tail, waiting on the old road. Its things are bones, the road and
// its own voice: walls of charcoal bones sliding in with a gap (they show at
// the edge first), a howl that goes out in arcs of sparks with a gap in each,
// digging that throws cinders up out of the floor (a puff of dust shows where
// first), and a game of fetch: a bone thrown to rattle round the box, and the
// dog itself running after it along your row (paw prints show the row). It
// stands to the right of the box.

const CHAR = {
  k: '#0c0a0b', c: '#2a2426', C: '#443c3c', s: '#5e5450', S: '#7e746c',
  e: '#ff8c1a', E: '#ffd25e', r: '#a8401a', y: '#fff4c8', g: '#8d8781', G: '#b4aea6',
};

// A charcoal bone, end on end: a knuckle at each end, a glowing crack.
defineBulletArt('charBone', {
  frames: [['SS...SS', 'SsCCCsS', '.CCrCC.', 'SsCCCsS', 'SS...SS']],
  palette: CHAR,
  radius: 2.6,
  spin: 6,
});

// A bone standing up (one piece of a wall).
defineBulletArt('charPost', {
  frames: [['S.S', 'sSs', '.C.', '.C.', '.r.', '.C.', '.C.', 'sSs', 'S.S']],
  palette: CHAR,
  hitbox: { w: 3, h: 9 },
});

// A spark of its howl.
defineBulletArt('charSpark', {
  frames: [['.e.', 'eEe', '.e.'], ['e.e', '.E.', 'e.e']],
  palette: CHAR,
  radius: 1.5,
  frameSeconds: 0.07,
});

// A cinder kicked up out of the road.
defineBulletArt('charCinder', {
  frames: [['.Cs.', 'CrEs', 'sCC.'], ['.sC.', 'sErC', '.CCs']],
  palette: CHAR,
  radius: 1.8,
  frameSeconds: 0.1,
});

// A puff of road dust where it will dig (harmless).
defineBulletArt('charDust', {
  frames: [['..g..', '.gGg.', 'g.G.g'], ['.g.g.', 'gGgGg', '.ggg.']],
  palette: CHAR,
  radius: 1,
  frameSeconds: 0.12,
  rim: false,
});

// A sooty paw print (harmless): the row it's going to run.
defineBulletArt('charPaw', { frames: [['s.s', '.S.', 'sSs']], palette: CHAR, radius: 1, rim: false });

// The dog running (it points right; it turns to run): long legs out, tail smoking.
defineBulletArt('charRunner', {
  frames: [[
    'g..........',
    '.sCC.....c.',
    '...CCcccCcc',
    '..CccrcCcEc',
    '.c.c...c.cc',
    'c.....c....',
  ], [
    '.g.........',
    'gsCC.....c.',
    '...CCcccCcc',
    '..CccrcCcEc',
    '...cc.cc...',
    '...c...c...',
  ]],
  palette: CHAR,
  radius: 4,
  hitbox: { w: 10, h: 5 },
  rotate: true,
  frameSeconds: 0.07,
});

// A puff of smoke off its tail (it stings for a moment).
defineBulletArt('charSmoke', {
  frames: [['.gg.', 'gGgg', '.gg.'], ['.g..', 'gGg.', '.gg.']],
  palette: CHAR,
  radius: 1.8,
  frameSeconds: 0.2,
});

function tracker() {
  const heading = { x: 0, y: 0 };
  let seen = null;
  return {
    heading,
    see(soul, dt) {
      if (seen && dt > 0) {
        heading.x = heading.x * 0.85 + ((soul.x - seen.x) / dt) * 0.15;
        heading.y = heading.y * 0.85 + ((soul.y - seen.y) / dt) * 0.15;
      }
      seen = { x: soul.x, y: soul.y };
    },
  };
}

export const CHARCUR_ATTACKS = {
  // Bones: walls of charcoal bones stood on end slide in from the right, each
  // with a gap a little way off where you are, so you have to go to it. Each
  // wall shows at the edge of the box, blinking, before it comes.
  charBones(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let walls = 0;
    let gapY = box.y + box.h / 2;
    const GAP = 22;
    const pending = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        for (const p of pending.splice(0)) p.vx = -74;
        if (walls < 5 && t >= 0.15 + walls * 1.05) {
          // The gap moves to somewhere 16-30 px from you, up or down.
          const way = soul.y > box.y + box.h / 2 ? -1 : 1;
          const off = rand(16, 30) * (Math.random() < 0.75 ? way : -way);
          gapY = clamp(soul.y + off, box.y + GAP / 2 + 2, box.y + box.h - GAP / 2 - 2);
          const x = box.x + box.w + 2;
          for (let y = box.y + 4; y < box.y + box.h; y += 8) {
            if (Math.abs(y - gapY) < GAP / 2 + 2) continue;
            const post = new Shot({ x, y, warn: 0.45, art: 'charPost', life: 3 });
            pending.push(post);
            bullets.push(post);
          }
          walls++;
        }
      },
    };
  },

  // Howl: it throws its head back, and its howl goes out from the right side
  // in arcs of sparks, each with a gap; the gaps don't line up.
  charHowl(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let howls = 0;
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (howls < 6 && t >= 0.2 + howls * 0.85) {
          const ox = box.x + box.w + 26;
          const oy = clamp(soul.y + rand(-30, 30), box.y, box.y + box.h);
          const n = 15;
          const spread = 1.6;
          let toward = Math.atan2(soul.y - oy, soul.x - ox);
          if (toward < 0) toward += Math.PI * 2;
          // The gap: three sparks wide, never quite where you are.
          const gapAt = Math.floor(rand(2, n - 5));
          const aimedK = Math.round(((toward - Math.PI + spread / 2) / spread) * (n - 1));
          const skip = gapAt <= aimedK && aimedK <= gapAt + 2 ? (gapAt + 5) % (n - 3) : gapAt;
          for (let k = 0; k < n; k++) {
            if (k >= skip && k <= skip + 2) continue;
            const a = Math.PI - spread / 2 + (k / (n - 1)) * spread;
            bullets.push(new Shot({ x: ox + Math.cos(a) * 18, y: oy + Math.sin(a) * 18, vx: Math.cos(a) * 52, vy: Math.sin(a) * 52, art: 'charSpark', life: 2.6, warn: 0.3 }));
          }
          howls++;
        }
      },
    };
  },

  // Dig: it scrabbles at the road and cinders fly up out of the floor of the
  // box in fountains, near where you are (a puff of dust shows where first).
  charDig(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let digs = 0;
    const track = tracker();
    const holes = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        track.see(soul, dt);
        if (digs < 7 && t >= 0.2 + digs * 0.72) {
          const x = clamp(soul.x + track.heading.x * 0.5 + rand(-8, 8), box.x + 6, box.x + box.w - 6);
          const puff = new Shot({ x, y: box.y + box.h - 3, harmless: true, art: 'charDust', life: 0.55 });
          holes.push({ puff, x });
          bullets.push(puff);
          digs++;
        }
        for (const h of holes) {
          if (h.done || h.puff.age < 0.5) continue;
          h.done = true;
          for (let k = 0; k < 6; k++) {
            const vx = rand(-34, 34);
            bullets.push(new Shot({ x: h.x + rand(-2, 2), y: box.y + box.h - 2, vx, vy: -rand(95, 140), gravity: 120, art: 'charCinder', life: 2.4 }));
          }
        }
      },
    };
  },

  // Fetch: it throws a bone into the box to rattle round off the walls, and
  // then runs after it, straight along your row: paw prints show the row first.
  // Twice, the second time from the other side.
  charFetch(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let runs = 0;
    let bone = false;
    const dashes = [];
    return {
      duration: 7.0,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!bone) {
          bone = true;
          const a = Math.PI + rand(-0.6, 0.6);
          bullets.push(new Shot({ x: box.x + box.w - 6, y: box.y + rand(12, box.h - 12), vx: Math.cos(a) * 54, vy: Math.sin(a) * 54, bounce: true, warn: 0.4, art: 'charBone', life: 5.6 }));
        }
        if (runs < 3 && t >= 0.9 + runs * 1.7) {
          const dir = runs % 2 ? 1 : -1;
          const y = clamp(soul.y, box.y + 5, box.y + box.h - 5);
          const prints = [];
          for (let x = box.x + 6; x < box.x + box.w; x += 12) {
            const p = new Shot({ x: dir < 0 ? box.x + box.w - (x - box.x) : x, y: y + ((x / 12) % 2 ? -2 : 2), harmless: true, art: 'charPaw', life: 0.75 });
            prints.push(p);
            bullets.push(p);
          }
          dashes.push({ y, dir, prints, runner: null });
          runs++;
        }
        for (const d of dashes) {
          // The row follows you for a moment, then holds.
          const age = d.prints[0].age;
          if (!d.runner && age < 0.4) {
            d.y = clamp(soul.y, box.y + 5, box.y + box.h - 5);
            d.prints.forEach((p, i) => { p.y = d.y + (i % 2 ? -2 : 2); });
          }
          if (!d.runner && age >= 0.72) {
            const x = d.dir < 0 ? box.x + box.w + 12 : box.x - 12;
            d.runner = new Shot({ x, y: d.y, art: 'charRunner', life: 1.6, angle: d.dir < 0 ? Math.PI : 0 });
            d.smoke = 0;
            bullets.push(d.runner);
          } else if (d.runner && !d.going) {
            d.going = true;
            d.runner.vx = d.dir * 170;
          }
          if (d.going && d.runner.age < 1.4) {
            d.smoke -= dt;
            const inside = d.runner.x > box.x && d.runner.x < box.x + box.w;
            if (d.smoke <= 0 && inside) {
              d.smoke = 0.1;
              bullets.push(new Shot({ x: d.runner.x - d.dir * 8, y: d.y + rand(-1, 1), vx: -d.dir * 6, vy: rand(-3, 3), art: 'charSmoke', life: 0.5 }));
            }
          }
        }
      },
    };
  },
};

// Aimed shots on top (see snipes.js), with its own bones and cinders, so waiting out a pattern in one spot never works.
CHARCUR_ATTACKS.charBones = withSnipes(CHARCUR_ATTACKS.charBones, { art: 'charBone', count: 4, first: 0.9, every: 1.2, lead: ['mean', 0.9, 'mean', 0.4], until: 5.6 });
CHARCUR_ATTACKS.charHowl = withSnipes(CHARCUR_ATTACKS.charHowl, { art: 'charCinder', count: 4, first: 0.8, every: 1.3, lead: [0.9, 'mean', 0.4, 'mean'], until: 5.6 });
CHARCUR_ATTACKS.charFetch = withSnipes(CHARCUR_ATTACKS.charFetch, { art: 'charBone', count: 4, first: 1.2, every: 1.25, lead: ['mean', 0.4, 'mean', 0.9], until: 6 });
