import { defineBulletArt } from '../projectiles.js';

// The Dust Bunny's attacks. It's made of every speck that was ever swept into
// a corner, so it fights with what lives down there: sneezes full of dust,
// little bunnies hopping about, lint pushed by a broom, cobwebs, and the odd
// carrot it was saving for later.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. Carrots are drawn pointing right and turn to
// face where they fly.

// A speck of dust, flickering as it tumbles.
defineBulletArt('bunnyMote', {
  frames: [
    ['.g.g.', 'gGwg.', '.wGgg', 'gGwG.', '.g..g'],
    ['g..g.', '.gwGg', 'gGwg.', '.gGwg', '.g.g.'],
  ],
  palette: { g: '#8a82a0', G: '#b8b0c8', w: '#e8e4f0' },
  radius: 2,
  frameSeconds: 0.1,
});

// The cloud of a sneeze, puffing up (harmless itself; the dust comes out of it).
defineBulletArt('bunnySneezeCloud', {
  frames: [
    ['...ww....', '.wwGww...', 'wGwwwGw..', 'wwwGwwww.', '.wGwwGw..', '..www....'],
    ['..wwww...', '.wGwwGww.', 'wwwGwwwGw', 'wGwwwGwww', 'wwGwwwGw.', '.wwwww...'],
  ],
  palette: { w: '#e8e4f0', G: '#b8b0c8' },
  radius: 4,
  frameSeconds: 0.09,
});

// A baby dust bunny, ears flopping as it hops.
defineBulletArt('bunnyKit', {
  frames: [
    ['.k.k...', '.p.p...', '.fffff.', 'fwefeff', 'fffpfFf', '.fFFFf.'],
    ['.......', 'kp.pk..', '.fffff.', 'fwefeff', 'fffpfFf', '.fFFFf.'],
  ],
  palette: { k: '#8a82a0', p: '#e89ab0', f: '#b8b0c8', F: '#8a82a0', w: '#e8e4f0', e: '#120c1c' },
  radius: 3,
  frameSeconds: 0.18,
});

// A clump of lint and hair with loose strands, rolling along.
defineBulletArt('bunnyLint', {
  frames: [[
    'h..g.',
    '.gGg.',
    'gGwGg',
    '.gGg.',
    '.g..h',
  ]],
  palette: { g: '#8a82a0', G: '#b8b0c8', w: '#e8e4f0', h: '#5e5874' },
  radius: 2,
  spin: 5,
});

// A broom head pushing the lint (harmless; it only does the sweeping).
defineBulletArt('bunnyBroom', {
  frames: [[
    '...hh...',
    '...hh...',
    '...hh...',
    '.bbbbbb.',
    'yyyyyyyy',
    'yYyYyYyY',
    'yYyYyYyY',
  ]],
  palette: { h: '#8b5a2b', b: '#c0392b', y: '#e6c36a', Y: '#b8923e' },
  radius: 3,
});

// A carrot, drawn pointing right (its tip), leaves at the back.
defineBulletArt('bunnyCarrot', {
  frames: [[
    'g.oo.....',
    '.gOooooo.',
    'ggoOoOooo',
    '.gOooooo.',
    'g.oo.....',
  ]],
  palette: { g: '#5fbf4a', o: '#ff8c1a', O: '#c8620e' },
  radius: 2,
  rotate: true,
});

// A spider-free little web knot where the cobweb strands meet (harmless).
defineBulletArt('bunnyWebKnot', {
  frames: [[
    'w...w',
    '.w.w.',
    '..W..',
    '.w.w.',
    'w...w',
  ]],
  palette: { w: '#d8d4e4', W: '#ffffff' },
  radius: 2,
});

export const BUNNY_ATTACKS = {
  // "Achoo!" A sneeze cloud puffs up at the edge of the box, then blasts a
  // cone of dust specks toward you. The dust slows down and hangs in the air
  // for a moment before settling, so the floor gets cluttered.
  bunnySneeze(box, density, { Shot, every, rand, angleTo, edgePoint, clamp }) {
    const windUp = 0.6;
    let clouds = [];
    const inhale = every(1.05, 1.4, (bullets) => {
      const edge = edgePoint(box, undefined, 0);
      const x = clamp(edge.x, box.x + 6, box.x + box.w - 6);
      const y = clamp(edge.y, box.y + 6, box.y + box.h - 6);
      bullets.push(new Shot({ x, y, art: 'bunnySneezeCloud', harmless: true, life: windUp + 0.2 }));
      clouds.push({ x, y, t: windUp });
    });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        inhale(dt, bullets);
        for (const cloud of clouds) {
          cloud.t -= dt;
          if (cloud.t > 0) continue;
          const aim = angleTo(cloud, soul);
          for (let i = 0; i < 7; i++) {
            const angle = aim + (i - 3) * 0.13 + rand(-0.04, 0.04);
            const speed = rand(92, 112);
            bullets.push(new Shot({
              x: cloud.x,
              y: cloud.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              accel: -60,
              life: 1.5,
              art: 'bunnyMote',
            }));
          }
        }
        clouds = clouds.filter((cloud) => cloud.t > 0);
      },
    };
  },

  // Baby dust bunnies tumble in from the sides and hop around the box,
  // bouncing off the floor and walls. Each one blinks first on the floor, then
  // leaps for where you are: high enough to reach you, landing past you.
  bunnyHopscotch(box, density, { Shot, every, rand, clamp }) {
    const floor = box.y + box.h - 4;
    const gravity = 150;
    const hop = every(0.6, 0.85, (bullets, soul) => {
      const fromLeft = Math.random() < 0.5;
      const x = fromLeft ? box.x + 5 : box.x + box.w - 5;
      // Jump just over your height, so the top of the hop passes through you.
      const height = clamp(floor - soul.y + rand(4, 14), 18, box.h - 8);
      const jump = Math.sqrt(2 * gravity * height);
      const timeToTop = jump / gravity;
      const run = clamp(Math.abs(soul.x - x) / timeToTop, 28, 75);
      bullets.push(new Shot({
        x,
        y: floor,
        vx: fromLeft ? run : -run,
        vy: -jump,
        gravity,
        bounce: true,
        warn: 0.45,
        life: 3.6,
        art: 'bunnyKit',
      }));
    });
    return { duration: 6.5, update: (dt, bullets, soul) => hop(dt, bullets, soul) };
  },

  // A broom sweeps a wall of lint across the box. Each wall has one gap in
  // it; slip through the gap before the lint rolls over you.
  bunnyBroomSweep(box, density, { Shot, every, rand }) {
    const spacing = 6;
    const gapHalf = 12;
    const speed = 48;
    const warn = 0.55;
    let fromLeft = Math.random() < 0.5;
    const sweep = every(1.4, 1.75, (bullets) => {
      const gapY = rand(box.y + 14, box.y + box.h - 14);
      const x = fromLeft ? box.x + 3 : box.x + box.w - 3;
      const vx = fromLeft ? speed : -speed;
      for (let y = box.y + 3; y <= box.y + box.h - 3; y += spacing) {
        if (Math.abs(y - gapY) < gapHalf) continue;
        bullets.push(new Shot({ x, y, vx, warn, art: 'bunnyLint' }));
      }
      // The broom pushes from behind the lint, on the bigger side of the wall.
      const broomY = gapY > box.y + box.h / 2 ? box.y + 12 : box.y + box.h - 12;
      bullets.push(new Shot({ x: x - (fromLeft ? 7 : -7), y: broomY, vx, warn, harmless: true, art: 'bunnyBroom', angle: 0 }));
      fromLeft = !fromLeft;
    });
    return { duration: 6.5, update: (dt, bullets) => sweep(dt, bullets) };
  },

  // Carrots the bunny was hoarding drop from the top of the box near you,
  // point first. Each hangs and blinks, then falls faster and faster.
  bunnyCarrotDrop(box, density, { Shot, every, rand, clamp }) {
    const drop = every(0.42, 0.62, (bullets, soul) => {
      const x = clamp(soul.x + rand(-16, 16), box.x + 4, box.x + box.w - 4);
      bullets.push(new Shot({ x, y: box.y + 4, vy: 25, accel: 190, warn: 0.55, art: 'bunnyCarrot', angle: Math.PI / 2 }));
    });
    return { duration: 6, update: (dt, bullets, soul) => drop(dt, bullets, soul) };
  },

  // Cobwebs from the corners the bunny lives in. A knot appears in a corner,
  // then strands of web flash across the box from it in a fan. Find a gap
  // between the strands, or step away before they snap tight. Dust drifts
  // down through the webs the whole time.
  bunnyCobweb(box, density, { Line, Shot, every, rand, pick }) {
    const corners = [
      { x: box.x, y: box.y, angle: 0 },
      { x: box.x + box.w, y: box.y, angle: Math.PI / 2 },
      { x: box.x + box.w, y: box.y + box.h, angle: Math.PI },
      { x: box.x, y: box.y + box.h, angle: Math.PI * 1.5 },
    ];
    const strands = 4;
    const warn = 0.85;
    const weave = every(1.45, 1.8, (bullets) => {
      const corner = pick(corners);
      const tilt = rand(-0.08, 0.08);
      bullets.push(new Shot({ x: corner.x, y: corner.y, art: 'bunnyWebKnot', harmless: true, life: warn + 0.7 }));
      for (let i = 0; i < strands; i++) {
        const angle = corner.angle + tilt + (i + 0.5) / strands * (Math.PI / 2);
        bullets.push(new Line({
          x: corner.x,
          y: corner.y,
          angle,
          length: 118,
          thickness: 2,
          warn,
          life: 0.7,
          color: '#d8d4e4',
          dash: [4, 1],
        }));
      }
    });
    const drift = every(0.75, 1.1, (bullets) => {
      bullets.push(new Shot({ x: rand(box.x + 4, box.x + box.w - 4), y: box.y - 3, vx: rand(-10, 10), vy: rand(30, 42), art: 'bunnyMote' }));
    });
    return {
      duration: 7,
      update: (dt, bullets) => {
        weave(dt, bullets);
        drift(dt, bullets);
      },
    };
  },
};
