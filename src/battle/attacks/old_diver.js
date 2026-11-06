import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { withSnipes } from './snipes.js';

// The Old Diver's attacks. It is an empty diving suit, so everything it does
// is a diver's job: a harpoon thrown on a line and reeled home (it comes back
// down the same line), the air hose lashing after you like a loose snake, the
// air it hasn't got any more rising in bubbles that pop into pellets, and an
// anchor dropped from the dark that makes a wave of silt where it lands. It
// stands to the right of the box.

const DIVE = { S: '#9a7a4a', I: '#c8ccd4', h: '#3a463c', H: '#5a6e5a', b: '#b88a3a', y: '#e8c868', G: '#0a1a1a', g: '#7af0b0', w: '#ffffff', c: '#9ad8ff', C: '#5a9ac8', k: '#14181c', n: '#6c7280', N: '#4a4e58', d: '#2a3a40', m: '#8a8068', M: '#5e5846' };

// The harpoon, pointing right: a long shaft, a barbed iron head.
defineBulletArt('diverHarpoon', {
  frames: [['.........I.', 'SSSSSSSSIII', '.........I.']],
  palette: DIVE,
  radius: 2.2,
  rotate: true,
});

// A bead of its rope (harmless).
defineBulletArt('diverRope', { frames: [['SS']], palette: DIVE, radius: 1 });

// The nozzle at the end of the air hose, glowing faint green.
defineBulletArt('diverNozzle', {
  frames: [
    ['..bbb..', '.byyyb.', 'bbyGgbb', '.byGGb.', '..bbb..'],
    ['..bbb..', '.byyyb.', 'bbyGGbb', '.byGgb.', '..bbb..'],
  ],
  palette: DIVE,
  radius: 3,
  frameSeconds: 0.18,
});

// A length of hose it leaves behind: a ribbed grey-green ring.
defineBulletArt('diverSeg', {
  frames: [['.hhh.', 'hHHHh', 'hHhHh', 'hHHHh', '.hhh.']],
  palette: DIVE,
  radius: 2.4,
});

// A bubble (harmless until it pops).
function bubble(size) {
  const c = (size - 1) / 2;
  const g = new Pix(size, size);
  g.disc(c, c, c, c, 'C');
  g.disc(c, c, c - 1, c - 1, 'c', 'C');
  g.disc(c, c, c - 1.6, c - 1.6, '.');
  g.set(c - 1, c - 1, 'w');
  g.set(c - 1, c - 2, 'w');
  g.set(c + 1, c + 1, 'c');
  return g.rows();
}
defineBulletArt('diverBubble', { frames: [bubble(9), bubble(10)], palette: DIVE, radius: 1, frameSeconds: 0.2 });

// What it pops into: a pellet of spray.
defineBulletArt('diverPellet', {
  frames: [['.w.', 'wcw', '.w.'], ['.c.', 'cwc', '.c.']],
  palette: DIVE,
  radius: 1.8,
  frameSeconds: 0.1,
});

// The anchor: iron, with a ring at the top and two flukes.
defineBulletArt('diverAnchor', {
  frames: [[
    '....nnnnn....',
    '....n...n....',
    '....nnnnn....',
    '......n......',
    '....nnnnn....',
    '......n......',
    '......n......',
    '.n....n....n.',
    '.nn...n...nn.',
    '..nn..n..nn..',
    '...nn.n.nn...',
    '....nnnnnn...',
    '.....nnnn....',
  ]],
  palette: DIVE,
  hitbox: { w: 9, h: 13 },
});

// Where it will land (harmless): a dark smear on the floor, blinking.
defineBulletArt('diverShadow', {
  frames: [['..ddddd..', '.ddddddd.', '..ddddd..'], ['.........', '..ddddd..', '.........']],
  palette: DIVE,
  radius: 1,
  frameSeconds: 0.12,
});

// A puff of silt along the floor.
defineBulletArt('diverSilt', {
  frames: [['.mm.', 'mMMm', 'mMMm', '.mm.'], ['.mm.', 'mMmm', 'mmMm', '.mm.']],
  palette: DIVE,
  radius: 2.2,
  frameSeconds: 0.14,
});

export const OLD_DIVER_ATTACKS = {
  // Harpoon: it throws a harpoon at where you are, on a line (the beads are the
  // rope, and the harpoon blinks first, so you can see the way it points). It
  // flies out, stops, and is reeled home along the same line, a touch faster. Four
  // throws, from the right and from above.
  diverHarpoon(box, density, { Shot, Line, rand, clamp }) {
    let t = 0;
    let throws = 0;
    let next = 0.2;
    let live = [];
    const heading = { x: 0, y: 0 };
    const seen = { x: null, y: null };
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (seen.x !== null && dt > 0) {
          heading.x = heading.x * 0.85 + ((soul.x - seen.x) / dt) * 0.15;
          heading.y = heading.y * 0.85 + ((soul.y - seen.y) / dt) * 0.15;
        }
        seen.x = soul.x;
        seen.y = soul.y;
        if (t >= next && throws < 4 && t < 5.2) {
          next = t + 1.55;
          const from = throws % 2 === 0
            ? { x: box.x + box.w + 3, y: rand(box.y + 10, box.y + box.h - 10) }
            : { x: clamp(soul.x + rand(-26, 26), box.x + 8, box.x + box.w - 8), y: box.y - 3 };
          // One thrown at you, a beat later one at where you are heading.
          for (const lead of [0.05, 0.7]) {
            const warn = lead < 0.5 ? 0.75 : 0.95;
            const guide = new Line({ x: from.x, y: from.y, angle: 0, length: 150, thickness: 1, warn, life: 0, color: '#c8ccd4' });
            const harpoon = new Shot({ x: from.x, y: from.y, warn, art: 'diverHarpoon', life: 1.7 });
            harpoon.from = from;
            harpoon.lead = lead;
            harpoon.guide = guide;
            harpoon.out = 0.52;
            harpoon.bead = 0;
            live.push(harpoon);
            bullets.push(guide, harpoon);
          }
          throws++;
        }
        for (const h of live) {
          // The line follows you until the last moment before the throw, then it is fixed.
          if (h.age < h.warn - 0.15) {
            const aim = Math.atan2(soul.y + heading.y * h.lead - h.from.y, soul.x + heading.x * h.lead - h.from.x);
            h.guide.angle = aim;
            h.angle = aim;
            h.aim = aim;
          }
          if (h.age < h.warn) continue;
          if (!h.thrown) {
            h.thrown = true;
            h.vx = Math.cos(h.aim) * 150;
            h.vy = Math.sin(h.aim) * 150;
          }
          const flown = h.age - h.warn;
          if (flown < h.out) {
            h.bead -= dt;
            if (h.bead <= 0) {
              h.bead = 0.045;
              bullets.push(new Shot({ x: h.x, y: h.y, harmless: true, life: h.out - flown + 0.45, art: 'diverRope' }));
            }
          } else if (!h.reeled) {
            h.reeled = true;
            const back = Math.atan2(h.from.y - h.y, h.from.x - h.x);
            h.vx = Math.cos(back) * 175;
            h.vy = Math.sin(back) * 175;
          }
        }
        live = live.filter((h) => h.age < h.warn + h.life);
      },
    };
  },

  // Hose: the air hose comes alive, the brass nozzle at the end of it hunting
  // you across the box (it turns, but only so fast) and leaving a length of
  // hose behind it that lies there a moment. Three hunts, one at a time.
  diverHose(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let hunts = 0;
    let heads = [];
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (hunts < 3 && t >= 0.2 + hunts * 2.15) {
          // It comes in from whichever side is further from you, aimed at you.
          const right = soul.x < box.x + box.w / 2;
          const x = right ? box.x + box.w - 2 : box.x + 2;
          const y = hunts % 2 === 0 ? box.y + 8 : box.y + box.h - 8;
          const aim = Math.atan2(soul.y - y, soul.x - x);
          const head = new Shot({ x, y, warn: 0.6, art: 'diverNozzle', life: 2.6, angle: aim, homing: { target: soul, turn: 2.1 } });
          head.aim = aim;
          head.drop = 0;
          heads.push(head);
          bullets.push(head);
          hunts++;
        }
        for (const head of heads) {
          if (head.age < head.warn) continue;
          if (!head.going) {
            head.going = true;
            head.vx = Math.cos(head.aim) * 54;
            head.vy = Math.sin(head.aim) * 54;
          }
          head.drop -= dt;
          if (head.drop <= 0) {
            head.drop = 0.075;
            bullets.push(new Shot({ x: head.x, y: head.y, art: 'diverSeg', life: 0.85 }));
          }
        }
        heads = heads.filter((head) => head.age < head.warn + head.life);
      },
    };
  },

  // Bubbles: the diver's last air rises from the floor in bubbles, harmless to
  // touch, and each one pops at a different height into a ring of spray. Keep
  // clear of them. Every other one rises by you, drifting your way.
  diverBubbles(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let next = 0.2;
    let made = 0;
    let bubbles = [];
    return {
      duration: 7.0,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 4.8) {
          next = t + 0.36;
          const x = made % 2 === 0 ? clamp(soul.x + rand(-8, 8), box.x + 7, box.x + box.w - 7) : box.x + 7 + ((made * 23) % 67);
          const pop = rand(1.2, 2.0);
          // Each drifts a little toward you as it rises.
          const b = new Shot({ x, y: box.y + box.h - 3, vx: (soul.x - x) * 0.14, vy: -36, harmless: true, life: pop, art: 'diverBubble', wobble: { amplitude: 3, frequency: 4 } });
          b.pop = pop;
          bubbles.push(b);
          bullets.push(b);
          made++;
        }
        for (const b of bubbles) {
          if (b.age < b.pop) continue;
          b.done = true;
          const turn = rand(0, Math.PI / 5);
          for (let k = 0; k < 6; k++) {
            const a = turn + (k / 6) * Math.PI * 2;
            bullets.push(new Shot({ x: b.x, y: b.y, vx: Math.cos(a) * 52, vy: Math.sin(a) * 52, art: 'diverPellet', life: 1.3 }));
          }
        }
        bubbles = bubbles.filter((b) => !b.done);
      },
    };
  },

  // Anchor: an anchor is dropped from the dark onto your column (a smear shows on
  // the floor where, and holds where it was when it first appeared). It lands with
  // a wave of silt each way along the floor, three puffs high. Four anchors.
  diverAnchor(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let drops = 0;
    let next = 0.2;
    let falling = [];
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && drops < 4 && t < 5.4) {
          next = t + 1.55;
          const x = clamp(soul.x + rand(-5, 5), box.x + 8, box.x + box.w - 8);
          const warn = 0.8;
          bullets.push(new Shot({ x, y: box.y + box.h - 2, harmless: true, life: warn, art: 'diverShadow' }));
          const anchor = new Shot({ x, y: box.y - 10, vy: 140, warn, art: 'diverAnchor', life: 2 });
          falling.push(anchor);
          bullets.push(anchor);
          drops++;
        }
        for (const a of falling) {
          if (a.age < a.warn || a.landed) continue;
          if (a.y >= box.y + box.h - 7) {
            a.landed = true;
            a.vy = 0;
            a.life = a.age - a.warn + 0.25;
            for (const dir of [-1, 1]) {
              for (const rise of [0, 8, 16]) {
                bullets.push(new Shot({ x: a.x + dir * 6, y: box.y + box.h - 4 - rise, vx: dir * 66, art: 'diverSilt', life: 1.3 }));
              }
            }
          }
        }
        falling = falling.filter((a) => !a.landed);
      },
    };
  },
};

// Aimed shots on top, so standing still or running one way is never safe (see snipes.js).
OLD_DIVER_ATTACKS.diverHarpoon = withSnipes(OLD_DIVER_ATTACKS.diverHarpoon, { art: 'diverHarpoon', count: 4, first: 1.0, every: 1.2, lead: 0.8 });
OLD_DIVER_ATTACKS.diverHose = withSnipes(OLD_DIVER_ATTACKS.diverHose, { art: 'diverPellet', count: 4, first: 1.0, every: 1.2, lead: 0.8 });
OLD_DIVER_ATTACKS.diverBubbles = withSnipes(OLD_DIVER_ATTACKS.diverBubbles, { art: 'diverBubble', count: 4, first: 1.0, every: 1.2, lead: [0.9, 'mean', 0.5, 'mean'] });
OLD_DIVER_ATTACKS.diverAnchor = withSnipes(OLD_DIVER_ATTACKS.diverAnchor, { art: 'diverSilt' });
