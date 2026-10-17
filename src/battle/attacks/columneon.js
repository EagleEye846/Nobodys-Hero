import { defineBulletArt } from '../projectiles.js';

// The Columneon's attacks. It's a chameleon pretending to be a pillar, so it
// fights with its tongue, its tail, its colour-changing scales, and bits of
// the "pillar" (some of which are, suspiciously, also looking at you).

// The sticky end of its tongue, drawn pointing right.
defineBulletArt('tongueTip', {
  frames: [[
    '.ttt..',
    'tTTTtt',
    'tTTTtt',
    '.ttt..',
  ]],
  palette: { t: '#ff5470', T: '#ffa0b4' },
  radius: 2,
  rotate: true,
});

// A chunk of the "pillar".
defineBulletArt('brick', {
  frames: [[
    'kkkkkkkk',
    'kSSSSSSk',
    'kssskssk',
    'kddddddk',
    'kkkkkkkk',
  ]],
  // Lighter than the pillars in the overworld, so they stand out in the dark box.
  palette: { k: '#3a2a5e', S: '#d4c8f4', s: '#a494d8', d: '#7462b0' },
  hitbox: { w: 7, h: 4 },
  spin: 1.5,
});

// A chunk of the "pillar" that is, on closer inspection, a very small chameleon.
defineBulletArt('mimicBrick', {
  frames: [
    ['kkkkkkkk', 'kepSSepk', 'kssssssk', 'kddttddk', 'kkkkkkkk'],
    ['kkkkkkkk', 'kpeSSpek', 'kssssssk', 'kddddddk', 'kkkkkkkk'],
  ],
  palette: { k: '#3a2a5e', S: '#d4c8f4', s: '#a494d8', d: '#7462b0', e: '#ffffff', p: '#1b1428', t: '#ff5470' },
  hitbox: { w: 7, h: 4 },
  frameSeconds: 0.3,
});

// A scale that changes colour to blend in: bright, then dim, then barely there
// (an outline you can still spot), then back.
defineBulletArt('scale', {
  frames: [
    ['..g..', '.gGg.', 'gGGGg', '.gGg.', '..g..'],
    ['..h..', '.hHh.', 'hHHHh', '.hHh.', '..h..'],
    ['..o..', '.o.o.', 'o...o', '.o.o.', '..o..'],
    ['..o..', '.o.o.', 'o...o', '.o.o.', '..o..'],
    ['..h..', '.hHh.', 'hHHHh', '.hHh.', '..h..'],
  ],
  palette: { g: '#5fc27a', G: '#b8f0a0', h: '#3f8f5a', H: '#5fc27a', o: '#4a7a5a' },
  radius: 2,
  frameSeconds: 0.22,
});

// A curl of tail, ringed like a chameleon's.
defineBulletArt('tailCurl', {
  frames: [[
    '.gggg.',
    'gGkkGg',
    'gk..kg',
    'gk..kg',
    'gGkkGg',
    '.gggg.',
  ]],
  palette: { g: '#5fc27a', G: '#3f8f5a', k: '#1b1428' },
  radius: 2,
  spin: 4,
});

export const COLUMNEON_ATTACKS = {
  // Its tongue shoots across the box at your height, from one side (or now and
  // then from above), after a flashing warning. Step out of the line.
  columneonTongue(box, density, { Shot, Line, every, rand, clamp, shuffleBag }) {
    const from = shuffleBag(['left', 'right', 'left', 'right', 'top']);
    const speed = 300;
    const warn = 0.75;
    const lash = every(1.3, 1.7, (bullets, soul) => {
      const side = from();
      let x;
      let y;
      let angle;
      let length;
      if (side === 'top') {
        x = clamp(soul.x + rand(-8, 8), box.x + 6, box.x + box.w - 6);
        y = box.y - 4;
        angle = Math.PI / 2;
        length = box.h + 8;
      } else {
        x = side === 'left' ? box.x - 4 : box.x + box.w + 4;
        y = clamp(soul.y + rand(-8, 8), box.y + 6, box.y + box.h - 6);
        angle = side === 'left' ? 0 : Math.PI;
        length = box.w + 8;
      }
      bullets.push(new Line({ x, y, angle, length, thickness: 4, warn, grow: speed, life: 0.35, color: '#ff5470' }));
      bullets.push(new Shot({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, art: 'tongueTip', warn }));
    });
    return { duration: 6.5, update: (dt, bullets, soul) => lash(dt, bullets, soul) };
  },

  // The "pillar" crumbles: bricks rain down all over the box. Every so often
  // one of them has eyes, and drifts after you for a moment before giving up.
  columneonCrumble(box, density, { Shot, every, rand, spreadAcross }) {
    const dropX = spreadAcross(box.x + 6, box.x + box.w - 6, 5);
    const followSeconds = 1.6;
    let mimics = [];
    const crumble = every(0.4, 0.6, (bullets) => {
      bullets.push(new Shot({ x: dropX(), y: box.y + 4, vy: 10, gravity: 110, art: 'brick', warn: 0.35 }));
    });
    const sneak = every(1.7, 2.1, (bullets, soul) => {
      const shot = new Shot({ x: dropX(), y: box.y + 4, vy: 30, art: 'mimicBrick', warn: 0.5, homing: { target: soul, turn: 1.4 } });
      bullets.push(shot);
      mimics.push(shot);
    });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        crumble(dt, bullets);
        sneak(dt, bullets, soul);
        // Caught looking: it stops following and falls like the others.
        for (const shot of mimics) {
          if (shot.age < shot.warn + followSeconds) continue;
          shot.homing = null;
          shot.gravity = 90;
        }
        mimics = mimics.filter((shot) => shot.homing);
      },
    };
  },

  // Scales drift in from every edge toward you, fading in and out as they
  // change colour. Even at their faintest you can still see their outline.
  columneonCamouflage(box, density, { Shot, every, rand, edgePoint, angleTo, shuffleBag }) {
    const edge = shuffleBag(['top', 'left', 'right', 'bottom']);
    const shed = every(0.45, 0.65, (bullets, soul) => {
      const start = edgePoint(box, edge());
      const aim = angleTo(start, soul) + rand(-0.25, 0.25);
      const speed = rand(36, 46);
      bullets.push(new Shot({ x: start.x, y: start.y, vx: Math.cos(aim) * speed, vy: Math.sin(aim) * speed, art: 'scale', warn: 0.3 }));
    });
    return { duration: 6.5, update: (dt, bullets, soul) => shed(dt, bullets, soul) };
  },

  // Its tail pokes in at one corner of the box and swishes back and forth,
  // flicking a stream of rings across the box, then moves to another corner.
  // Slip through the gap as the stream sweeps past.
  columneonTailCurl(box, density, { Shot, every, rand, shuffleBag }) {
    // Each corner, and the angle of the quarter-turn that points into the box from it.
    const corners = [
      { x: box.x + 4, y: box.y + 4, from: 0 },
      { x: box.x + box.w - 4, y: box.y + 4, from: Math.PI / 2 },
      { x: box.x + box.w - 4, y: box.y + box.h - 4, from: Math.PI },
      { x: box.x + 4, y: box.y + box.h - 4, from: -Math.PI / 2 },
    ];
    const corner = shuffleBag(corners);
    let at = corner();
    let swish = rand(0, Math.PI * 2);
    const move = every(2.8, 3.2, () => { at = corner(); }, { first: 2.8 });
    const flick = every(0.17, 0.17, (bullets) => {
      // Sweeps between 10 and 80 degrees into the box, so rings never fly straight out.
      const angle = at.from + Math.PI / 4 + Math.sin(swish) * (Math.PI * 7 / 36);
      bullets.push(new Shot({ x: at.x, y: at.y, vx: Math.cos(angle) * 54, vy: Math.sin(angle) * 54, art: 'tailCurl', warn: 0.2 }));
    });
    return {
      duration: 6,
      update: (dt, bullets) => {
        swish += 1.8 * dt;
        move(dt);
        flick(dt, bullets);
      },
    };
  },
};
