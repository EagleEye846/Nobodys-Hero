import { defineBulletArt } from '../projectiles.js';

// The Loose Step's attacks. It's a stair step that came off in the rockslide,
// so it fights with what a broken stair has: smaller steps tumbling down and
// shattering, the bootprint of the Hero it's waited a hundred years to feel,
// cracks running through stone, and the rockslide that knocked it loose.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. Things that happen "when a bullet lands" check
// the bullet itself (its age and position), so they stay in step with it.

const STONE = { k: '#120c1c', S: '#c8c0b0', s: '#a8a092', d: '#8a8274', D: '#5a5448', g: '#6aa65c' };

// A little stair step, tumbling end over end.
defineBulletArt('stepBlock', {
  frames: [[
    'kkkkkkk',
    'kSSSSSk',
    'ksssssk',
    'kkkkkdk',
    'kssssdk',
    'kddddDk',
    'kkkkkkk',
  ]],
  palette: STONE,
  radius: 3,
  spin: 6,
});

// A chip of stone, from a step that shattered or a slide coming down.
defineBulletArt('stepPebble', {
  frames: [
    ['.S.', 'Ssd', '.d.'],
    ['.s.', 'dSs', '.s.'],
  ],
  palette: STONE,
  radius: 1.5,
  frameSeconds: 0.08,
});

// A rolling boulder, mossy on one side.
defineBulletArt('stepBoulder', {
  frames: [[
    '..kkk..',
    '.kSsgk.',
    'kSssggk',
    'ksssssk',
    'ksdssdk',
    '.kddDk.',
    '..kkk..',
  ]],
  palette: STONE,
  radius: 3.5,
  spin: 4,
});

// The sole of a hero's boot, coming down. It blinks where it'll land first.
defineBulletArt('stepBoot', {
  frames: [[
    '...kkkkk...',
    '..kbbbbbk..',
    '.kbBbBbBbk.',
    '.kbbbbbbbk.',
    '.kbBbBbBbk.',
    '.kbbbbbbbk.',
    '..kbBbBbk..',
    '..kbbbbbk..',
    '...kbbbk...',
    '...kkkkk...',
    '..kbbbbbk..',
    '..kbBbBbk..',
    '..kbbbbbk..',
    '...kkkkk...',
  ]],
  palette: { k: '#120c1c', b: '#7a4f2a', B: '#5a3a1e' },
  hitbox: { w: 9, h: 13 },
});

// The four attacks, built from a set of art. The Loose Step uses its stone
// art; the Frozen Step at the top of the Long Stair (iceStep.js) uses the
// same moves in ice and snow. `names` are the four attack names, `art` the
// bullet art for each kind of thing, and `crack` the colour of the cracks.
export function makeStepAttacks({ names, art, crack }) {
  return {
    // Little steps tumble in from the top corners, end over end, and bounce
    // down the box like they're falling down a stair. When one hits the floor
    // it shatters into a spray of pebbles.
    [names.tumble](box, density, { Shot, every, rand, shuffleBag }) {
      const side = shuffleBag(['left', 'right']);
      const floor = box.y + box.h - 4;
      const gravity = 150;
      let steps = [];
      const tumble = every(0.85, 1.15, (bullets) => {
        const fromLeft = side() === 'left';
        const step = new Shot({
          x: fromLeft ? box.x + 5 : box.x + box.w - 5,
          y: box.y + rand(5, 22),
          vx: (fromLeft ? 1 : -1) * rand(28, 48),
          vy: rand(-30, 0),
          gravity,
          warn: 0.55,
          art: art.block,
        });
        bullets.push(step);
        steps.push(step);
      });
      return {
        duration: 6.5,
        update: (dt, bullets) => {
          tumble(dt, bullets);
          for (const step of steps) {
            if (step.age < step.warn || step.y < floor) continue;
            // Smash: the step is gone and its pieces fly up and out.
            step.life = step.age - step.warn;
            step.vx = step.vy = step.gravity = 0;
            for (let i = 0; i < 4; i++) {
              bullets.push(new Shot({
                x: step.x,
                y: floor - 1,
                vx: rand(-45, 45),
                vy: -rand(70, 105),
                gravity,
                life: 1.4,
                art: art.pebble,
              }));
            }
          }
          steps = steps.filter((step) => step.age < step.warn || step.y < floor);
        },
      };
    },

    // The footfall it's waited a hundred years for: a hero's bootprint blinks
    // where you're standing, then stamps down. Each stamp knocks a ring of
    // pebbles outward, so step clear and then mind the chips.
    [names.footfall](box, density, { Shot, every, rand, clamp }) {
      let boots = [];
      const stamp = every(1.05, 1.35, (bullets, soul) => {
        const boot = new Shot({
          x: clamp(soul.x + rand(-6, 6), box.x + 6, box.x + box.w - 6),
          y: clamp(soul.y + rand(-6, 6), box.y + 8, box.y + box.h - 8),
          warn: 0.8,
          life: 0.3,
          art: art.boot,
          angle: 0,
        });
        bullets.push(boot);
        boots.push(boot);
      });
      return {
        duration: 6.5,
        update: (dt, bullets, soul) => {
          stamp(dt, bullets, soul);
          for (const boot of boots) {
            if (boot.age < boot.warn) continue;
            const tilt = rand(0, Math.PI * 2);
            for (let i = 0; i < 6; i++) {
              const angle = tilt + (i / 6) * Math.PI * 2;
              bullets.push(new Shot({
                x: boot.x,
                y: boot.y,
                vx: Math.cos(angle) * 48,
                vy: Math.sin(angle) * 48,
                life: 0.9,
                art: art.pebble,
              }));
            }
          }
          boots = boots.filter((boot) => boot.age < boot.warn);
        },
      };
    },

    // Cracks race through the floor of the box from one edge to the other,
    // zigzagging as they go and sometimes splitting in two. Each one shows a
    // faint line first, then splits open along it. Pebbles drift down the
    // whole time.
    [names.crack](box, density, { Line, Shot, every, rand, shuffleBag, spreadAcross }) {
      const edge = shuffleBag(['left', 'right', 'top', 'bottom']);
      const pebbleX = spreadAcross(box.x + 4, box.x + box.w - 4);
      const grow = 140;
      const warn = 0.85;
      const segment = 20;

      // A crack starting at (x, y) heading `angle`, zigzagging `segments` times.
      // Each piece starts splitting open when the one before it gets there.
      // (Not called `crack`: that's the colour the cracks are drawn in.)
      const runCrack = (bullets, x, y, angle, segments, delay = 0) => {
        let heading = angle;
        for (let i = 0; i < segments; i++) {
          heading = angle + (i % 2 ? 1 : -1) * rand(0.35, 0.6);
          bullets.push(new Line({ x, y, angle: heading, length: segment, thickness: 2, warn: warn + delay, grow, life: 0.75, color: crack }));
          x += Math.cos(heading) * segment;
          y += Math.sin(heading) * segment;
          delay += segment / grow;
          if (i === 1 && Math.random() < 0.5) runCrack(bullets, x, y, angle + (Math.random() < 0.5 ? 0.9 : -0.9), 2, delay);
        }
      };

      const split = every(1.45, 1.8, (bullets) => {
        const from = edge();
        const along = rand(0.25, 0.75);
        const starts = {
          left: { x: box.x, y: box.y + box.h * along, angle: 0 },
          right: { x: box.x + box.w, y: box.y + box.h * along, angle: Math.PI },
          top: { x: box.x + box.w * along, y: box.y, angle: Math.PI / 2 },
          bottom: { x: box.x + box.w * along, y: box.y + box.h, angle: -Math.PI / 2 },
        };
        const start = starts[from];
        runCrack(bullets, start.x, start.y, start.angle, 5);
      });
      const crumble = every(0.55, 0.8, (bullets) => {
        bullets.push(new Shot({ x: pebbleX(), y: box.y - 3, vx: rand(-6, 6), vy: rand(28, 38), art: art.pebble }));
      });
      return {
        duration: 7,
        update: (dt, bullets) => {
          split(dt, bullets);
          crumble(dt, bullets);
        },
      };
    },

    // The rockslide that knocked it loose. Pebbles pour down the box at a slant
    // (a different slope every time), and now and then a boulder blinks at the
    // top above you and comes rolling down the same way.
    [names.slide](box, density, { Shot, every, rand, clamp, spreadAcross }) {
      const slope = (Math.random() < 0.5 ? -1 : 1) * rand(0.25, 0.55);
      // Start the pebbles far enough upslope that they cover the whole box.
      const reach = slope * box.h;
      const pebbleX = spreadAcross(box.x + 2 - Math.max(reach, 0), box.x + box.w - 2 - Math.min(reach, 0), 6);
      const pour = every(0.2, 0.3, (bullets) => {
        const vy = rand(38, 50);
        bullets.push(new Shot({ x: pebbleX(), y: box.y - 3, vx: vy * slope, vy, art: art.pebble }));
      });
      const roll = every(1.3, 1.6, (bullets, soul) => {
        const vy = 55;
        // Aimed so it would pass right through where you are now.
        const x = clamp(soul.x - slope * (soul.y - box.y), box.x + 4, box.x + box.w - 4);
        bullets.push(new Shot({ x, y: box.y + 4, vx: vy * slope, vy, accel: 25, warn: 0.6, art: art.boulder }));
      }, { first: 0.8 });
      return {
        duration: 6.5,
        update: (dt, bullets, soul) => {
          pour(dt, bullets);
          roll(dt, bullets, soul);
        },
      };
    },
  };
}

export const STEP_ATTACKS = makeStepAttacks({
  names: { tumble: 'stepTumble', footfall: 'stepFootfall', crack: 'stepCrack', slide: 'stepRockslide' },
  art: { block: 'stepBlock', pebble: 'stepPebble', boulder: 'stepBoulder', boot: 'stepBoot' },
  crack: '#d8d0c0',
});
