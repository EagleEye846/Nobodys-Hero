import { defineBulletArt } from '../projectiles.js';
import { makeStepAttacks } from './step.js';

// The Frozen Step's attacks. It's the Loose Step's brother, the top step of
// the Long Stair, frozen solid while it waited, so it mostly fights the same
// way in ice and snow: a frozen flight of steps with a gap in it, the Hero's
// bootprint (frosted, now), ice cracks running through the box, and an
// avalanche where its brother had a rockslide. Those moves are the Loose
// Step's own (makeStepAttacks in step.js) in new art. One is all its own:
// blocks of ice shoved across the box, sliding till they hit something.

const ICE = { k: '#1a2236', w: '#f4f8fc', i: '#bfe6ff', I: '#7fb6dc', d: '#4a7aa6', s: '#a8a092' };

// A stair step sealed in ice, a cap of snow on top.
defineBulletArt('iceStair', {
  frames: [[
    'kkkkkkk',
    'kwwwwwk',
    'kiiwiik',
    'kkkkkIk',
    'kisiiIk',
    'kIIIIdk',
    'kkkkkkk',
  ]],
  palette: ICE,
  radius: 3,
});

// A chip of ice, glinting as it turns.
defineBulletArt('iceChip', {
  frames: [
    ['.w.', 'wiI', '.I.'],
    ['.i.', 'Iwi', '.i.'],
  ],
  palette: ICE,
  radius: 1.5,
  frameSeconds: 0.08,
});

// A snowball rolled up round a rock, picking up snow as it comes.
defineBulletArt('iceSnowball', {
  frames: [[
    '..kkk..',
    '.kwwwk.',
    'kwwwisk',
    'kwiwwwk',
    'kswwiwk',
    '.kiIik.',
    '..kkk..',
  ]],
  palette: ICE,
  radius: 3.5,
  spin: 5,
});

// The sole of a hero's boot, rimed with frost. It blinks where it'll land.
defineBulletArt('iceBoot', {
  frames: [[
    '...kkkkk...',
    '..kbbbbbk..',
    '.kbBwBbBbk.',
    '.kbbbbbwbk.',
    '.kbBbBbBbk.',
    '.kwbbbbbbk.',
    '..kbBbBwk..',
    '..kbbbbbk..',
    '...kbwbk...',
    '...kkkkk...',
    '..kbbbbbk..',
    '..kwBbBbk..',
    '..kbbbbwk..',
    '...kkkkk...',
  ]],
  palette: { k: '#120c1c', b: '#7a4f2a', B: '#5a3a1e', w: '#dff0fb' },
  hitbox: { w: 9, h: 13 },
});


// The Frozen Step's own move, that its brother at the bottom can't do.
// "Mind the ice!" Blocks of ice are shoved in from the edges of the box, along
// your row or your column, and on ice nothing stops: each one slides until it
// hits the wall or another block, and stays there. So you can always tell
// where one will end up, and the box slowly fills with a pile of ice. Each
// one cracks as it hits, and two chips skitter off sideways. Near
// the end the whole pile cracks and bursts into chips.
const CELL = 10;
const SLIDE_SPEED = 120;
const ICE_STEP_SLIDE = {
  iceStepSlide(box, density, { Shot, rand, shuffleBag }) {
    const size = Math.round(box.w / CELL);
    const taken = new Set();
    const key = (c, r) => `${c},${r}`;
    const free = (c, r) => c >= 0 && r >= 0 && c < size && r < size && !taken.has(key(c, r));
    const edges = shuffleBag(['left', 'right', 'top', 'bottom']);
    let sliding = [];
    let resting = [];
    let timer = 0.1;
    let t = 0;
    let burst = false;
    const shove = (bullets, soul, tries = 0) => {
      const edge = edges();
      const c = Math.min(size - 1, Math.max(0, Math.floor((soul.x - box.x) / CELL)));
      const r = Math.min(size - 1, Math.max(0, Math.floor((soul.y - box.y) / CELL)));
      // Along your row (from a side) or your column (from the top or bottom).
      const dc = edge === 'left' ? 1 : edge === 'right' ? -1 : 0;
      const dr = edge === 'top' ? 1 : edge === 'bottom' ? -1 : 0;
      let col = edge === 'left' ? 0 : edge === 'right' ? size - 1 : c;
      let row = edge === 'top' ? 0 : edge === 'bottom' ? size - 1 : r;
      // (Blocked at that edge already: try another.)
      if (!free(col, row)) {
        if (tries < 3) shove(bullets, soul, tries + 1);
        return;
      }
      // Where it'll stop: the last free cell before something.
      while (free(col + dc, row + dr)) {
        col += dc;
        row += dr;
      }
      taken.add(key(col, row));
      const fromX = edge === 'left' ? box.x + CELL / 2 : edge === 'right' ? box.x + box.w - CELL / 2 : box.x + (c + 0.5) * CELL;
      const fromY = edge === 'top' ? box.y + CELL / 2 : edge === 'bottom' ? box.y + box.h - CELL / 2 : box.y + (r + 0.5) * CELL;
      const block = new Shot({ x: fromX, y: fromY, warn: 0.42, art: 'iceStair' });
      bullets.push(block);
      sliding.push({ block, to: { x: box.x + (col + 0.5) * CELL, y: box.y + (row + 0.5) * CELL }, dx: dc, dy: dr });
    };
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!burst) {
          timer -= dt;
          if (timer <= 0 && t < 5.4) {
            timer += 0.5;
            shove(bullets, soul);
          }
        }
        for (const s of sliding) {
          const { block, to } = s;
          if (block.age < block.warn) continue;
          // (Moved by hand, so it stops dead on its cell.)
          const step = SLIDE_SPEED * dt;
          const left = Math.abs(to.x - block.x) + Math.abs(to.y - block.y);
          if (left <= step) {
            block.x = to.x;
            block.y = to.y;
            s.done = true;
            resting.push(block);
            // It hits with a crack, and two chips skitter off sideways.
            for (const side of [-1, 1]) {
              bullets.push(new Shot({ x: block.x, y: block.y, vx: s.dy * side * 55, vy: s.dx * side * 55, life: 0.9, art: 'iceChip' }));
            }
          } else {
            block.x += s.dx * step;
            block.y += s.dy * step;
          }
        }
        sliding = sliding.filter((s) => !s.done);
        // The pile cracks: every block bursts into chips.
        if (!burst && t >= 6.0 && !sliding.length) {
          burst = true;
          for (const block of resting) {
            block.life = 0;
            for (const angle of [rand(0, Math.PI), rand(Math.PI, Math.PI * 2)]) {
              bullets.push(new Shot({ x: block.x, y: block.y, vx: Math.cos(angle) * 34, vy: Math.sin(angle) * 34, warn: 0.3, life: 0.9, art: 'iceChip' }));
            }
          }
        }
      },
    };
  },
};

export const ICE_STEP_ATTACKS = {
  ...ICE_STEP_SLIDE,
  ...makeStepAttacks({
    names: { stairs: 'iceStepStairs', footfall: 'iceStepFootfall', crack: 'iceStepCrack', slide: 'iceStepAvalanche' },
    art: { stair: 'iceStair', pebble: 'iceChip', boulder: 'iceSnowball', boot: 'iceBoot' },
    crack: '#bfe6ff',
  }),
};
