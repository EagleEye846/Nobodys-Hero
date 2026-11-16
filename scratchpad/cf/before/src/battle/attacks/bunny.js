import { defineBulletArt } from '../projectiles.js';

// The Dust Bunny's attacks. It's made of every speck that was ever swept into
// a corner, so it fights with what lives down there: sneezes full of dust,
// little bunnies hopping about, lint pushed by a broom, cobwebs, and its big
// ears, which hear every move you make.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

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

// The bunny's big ears poking up over the rim of the box (harmless): flopped
// down while it fidgets, straight up and swivelling while it listens.
defineBulletArt('bunnyEarsDown', {
  frames: [[
    '...........',
    '...........',
    'kk.......kk',
    'fpkk...kkpf',
    '.ffpk.kpff.',
    '...fk.kf...',
  ]],
  palette: { k: '#8a82a0', f: '#b8b0c8', p: '#e89ab0' },
  radius: 1,
});
defineBulletArt('bunnyEarsUp', {
  frames: [
    ['.kk....kk..', '.fpk..kpf..', '.fpk..kpf..', '.fpk..kpf..', '.fpk..kpf..', '..fk..kf...'],
    ['..kk....kk.', '..fpk..kpf.', '..fpk..kpf.', '..fpk..kpf.', '..fpk..kpf.', '...fk..kf..'],
  ],
  palette: { k: '#8a82a0', f: '#b8b0c8', p: '#e89ab0' },
  radius: 1,
  frameSeconds: 0.3,
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
  bunnySneeze(box, density, { Shot, every, rand, angleTo, edgePoint, clamp, shuffleBag }) {
    const edge = shuffleBag(['top', 'left', 'right', 'bottom']);
    const windUp = 0.7;
    let clouds = [];
    const inhale = every(1.7, 2.1, (bullets) => {
      const spot = edgePoint(box, edge(), 0);
      const x = clamp(spot.x, box.x + 6, box.x + box.w - 6);
      const y = clamp(spot.y, box.y + 6, box.y + box.h - 6);
      bullets.push(new Shot({ x, y, art: 'bunnySneezeCloud', harmless: true, life: windUp + 0.2 }));
      clouds.push({ x, y, t: windUp });
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        inhale(dt, bullets);
        for (const cloud of clouds) {
          cloud.t -= dt;
          if (cloud.t > 0) continue;
          // (The middle speck comes straight at you: standing still in a
          // corner isn't safe from a sneeze.)
          const aim = angleTo(cloud, soul) + rand(-0.04, 0.04);
          for (let i = 0; i < 5; i++) {
            const angle = aim + (i - 2) * 0.24 + rand(-0.04, 0.04);
            const speed = rand(72, 86);
            bullets.push(new Shot({
              x: cloud.x,
              y: cloud.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              accel: -45,
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
  // About two in five are pouncers: each waits out its blink, looks where you
  // are, and hops so the top of its hop comes down on you, bumping its head
  // on the top of the box if it has to, or going nearly straight up beside
  // a wall. So there's nowhere to stand still, not even up at the top.
  bunnyHopscotch(box, density, { Shot, every, rand, clamp, shuffleBag }) {
    const side = shuffleBag(['left', 'right']);
    const floor = box.y + box.h - 4;
    const gravity = 150;
    let pouncers = [];
    const hop = every(0.95, 1.25, (bullets, soul) => {
      const aimed = Math.random() < 0.4;
      // (A pouncer comes in on your side of the box.)
      const fromLeft = aimed ? soul.x < box.x + box.w / 2 : side() === 'left';
      const x = fromLeft ? box.x + 5 : box.x + box.w - 5;
      const height = rand(18, box.h - 10);
      const jump = Math.sqrt(2 * gravity * height);
      const run = rand(25, 45);
      const kit = new Shot({
        x,
        y: floor,
        vx: aimed ? 0 : fromLeft ? run : -run,
        vy: aimed ? 0 : -jump,
        gravity,
        bounce: true,
        warn: 0.6,
        life: 2.4,
        art: 'bunnyKit',
      });
      bullets.push(kit);
      if (aimed) pouncers.push(kit);
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        hop(dt, bullets, soul);
        for (const kit of pouncers) {
          if (kit.age < kit.warn) continue;
          kit.launched = true;
          // Up to just past your height (the top of the box stops it), and
          // across so it's over you as it gets there.
          const height = clamp(floor - soul.y + 2, 4, box.h);
          const jump = Math.sqrt(2 * gravity * height);
          const run = clamp((soul.x - kit.x) / (jump / gravity), -60, 60);
          kit.vx = Math.abs(run) < 3 ? (kit.x < box.x + box.w / 2 ? 3 : -3) : run;
          kit.vy = -jump;
        }
        pouncers = pouncers.filter((kit) => !kit.launched);
      },
    };
  },

  // A broom sweeps a wall of lint across the box. Each wall has one gap in
  // it; slip through the gap before the lint rolls over you.
  bunnyBroomSweep(box, density, { Shot, every, rand, spreadAcross }) {
    const nextGap = spreadAcross(box.y + 14, box.y + box.h - 14, 3);
    const spacing = 7;
    const gapHalf = 13;
    const speed = 42;
    const warn = 0.65;
    let fromLeft = Math.random() < 0.5;
    const sweep = every(2.1, 2.5, (bullets) => {
      const gapY = nextGap();
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
    return { duration: 7, update: (dt, bullets) => sweep(dt, bullets) };
  },

  // Ears up! Lint rolls across the box in rows (one along your row), so you
  // have to move. Then the bunny's big ears flop up over the rim and swivel:
  // it's listening. Hold still until they flop down again. Move while it's
  // listening and it hears you: a baby dust bunny leaps from under its ears
  // at where you're going, and keeps leaping for as long as you keep moving.
  bunnyListen(box, density, { Shot, rand, clamp, shuffleBag }) {
    const side = shuffleBag(['left', 'right']);
    const CYCLE = 2.9;
    const PERK = 1.6;
    const LISTEN_FROM = 1.95;
    const LISTEN_TO = 2.65;
    const FLIGHT = 0.45;
    const earsX = box.x + box.w / 2;
    const earsY = box.y + 4;
    let t = 0;
    let cycle = -1;
    let rolled = 0;
    let perked = false;
    let last = null;
    let moved = 0;
    let check = 0;
    let pounces = 0;
    let vx = 0;
    let vy = 0;
    const roll = (bullets, y) => {
      const fromLeft = side() === 'left';
      bullets.push(new Shot({
        x: fromLeft ? box.x - 3 : box.x + box.w + 3,
        y: clamp(y, box.y + 5, box.y + box.h - 5),
        vx: fromLeft ? 80 : -80,
        warn: 0.35,
        art: 'bunnyLint',
      }));
    };
    return {
      duration: 7.6,
      update: (dt, bullets, soul) => {
        t += dt;
        // (How you're moving, smoothed, to leap where you're going.)
        if (last && dt > 0) {
          vx += ((soul.x - last.x) / dt - vx) * Math.min(1, dt * 10);
          vy += ((soul.y - last.y) / dt - vy) * Math.min(1, dt * 10);
        }
        const step = last ? Math.hypot(soul.x - last.x, soul.y - last.y) : 0;
        last = { x: soul.x, y: soul.y };
        const now = Math.floor(t / CYCLE);
        const c = t - now * CYCLE;
        if (now !== cycle) {
          cycle = now;
          rolled = 0;
          perked = false;
          bullets.push(new Shot({ x: earsX, y: earsY, art: 'bunnyEarsDown', harmless: true, life: PERK }));
        }
        // Two rows of lint, the first along yours.
        if (rolled === 0 && c >= 0.05) { roll(bullets, soul.y + rand(-3, 3)); rolled = 1; }
        if (rolled === 1 && c >= 0.3) { roll(bullets, soul.y > box.y + box.h / 2 ? rand(box.y + 8, box.y + 30) : rand(box.y + 50, box.y + 72)); rolled = 2; }
        if (!perked && c >= PERK) {
          perked = true;
          bullets.push(new Shot({ x: earsX, y: earsY, art: 'bunnyEarsUp', harmless: true, life: LISTEN_TO - PERK }));
          moved = 0;
          check = 0;
          pounces = 0;
        }
        if (c < LISTEN_FROM || c >= LISTEN_TO) return;
        moved += step;
        check -= dt;
        if (check > 0) return;
        check = 0.22;
        if (moved < 4 || pounces >= 3) {
          moved = 0;
          return;
        }
        moved = 0;
        pounces++;
        // Heard you! A leap from under the ears to where you'll be.
        const x = clamp(soul.x + vx * FLIGHT, box.x + 4, box.x + box.w - 4);
        const y = clamp(soul.y + vy * FLIGHT, box.y + 4, box.y + box.h - 4);
        const from = { x: earsX + rand(-6, 6), y: earsY + 4 };
        bullets.push(new Shot({ ...from, vx: (x - from.x) / FLIGHT, vy: (y - from.y) / FLIGHT, warn: 0.12, life: FLIGHT + 0.6, art: 'bunnyKit' }));
      },
    };
  },

  // Cobwebs from the corners the bunny lives in. A knot appears in a corner,
  // then strands of web shoot across the box from it in a fan. Find a gap
  // between the strands, or step away before they snap tight. Dust drifts
  // down through the webs the whole time.
  bunnyCobweb(box, density, { Line, Shot, every, rand, shuffleBag, spreadAcross }) {
    const corners = [
      { x: box.x, y: box.y, angle: 0 },
      { x: box.x + box.w, y: box.y, angle: Math.PI / 2 },
      { x: box.x + box.w, y: box.y + box.h, angle: Math.PI },
      { x: box.x, y: box.y + box.h, angle: Math.PI * 1.5 },
    ];
    const nextCorner = shuffleBag(corners);
    const moteX = spreadAcross(box.x + 4, box.x + box.w - 4);
    const strands = 4;
    const warn = 0.85;
    const weave = every(1.55, 1.95, (bullets, soul) => {
      const corner = nextCorner();
      // The fan turns so one strand runs through where you are (as far as
      // it can turn): there's no spot along a wall it can't reach.
      const toSoul = Math.atan2(soul.y - corner.y, soul.x - corner.x);
      let tilt = rand(-0.4, 0.4);
      for (let i = 0; i < strands; i++) {
        const want = Math.atan2(Math.sin(toSoul - (corner.angle + (i + 0.5) / strands * (Math.PI / 2))), Math.cos(toSoul - (corner.angle + (i + 0.5) / strands * (Math.PI / 2))));
        if (i === 0 || Math.abs(want) < Math.abs(tilt)) tilt = want;
      }
      tilt = Math.max(-0.4, Math.min(0.4, tilt));
      bullets.push(new Shot({ x: corner.x, y: corner.y, art: 'bunnyWebKnot', harmless: true, life: warn + 0.6 }));
      for (let i = 0; i < strands; i++) {
        const angle = corner.angle + tilt + (i + 0.5) / strands * (Math.PI / 2);
        bullets.push(new Line({
          x: corner.x,
          y: corner.y,
          angle,
          length: 118,
          thickness: 1.5,
          warn,
          grow: 150,
          life: 0.6,
          color: '#d8d4e4',
          dash: [4, 1],
        }));
      }
    });
    const drift = every(2.0, 2.6, (bullets) => {
      bullets.push(new Shot({ x: moteX(), y: box.y - 3, vx: rand(-10, 10), vy: rand(30, 42), art: 'bunnyMote' }));
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        weave(dt, bullets, soul);
        drift(dt, bullets);
      },
    };
  },
};
