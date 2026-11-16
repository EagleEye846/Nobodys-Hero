import { defineBulletArt } from '../projectiles.js';

// The Hayward's attacks. It's Hollin's old scarecrow, still minding fields
// nobody has planted in fifty years, so it fights with what a scarecrow has:
// the crows it was meant to scare (and for once, does: they fly straight
// away from it), its battered hat, a pocketful of seed it's been saving for
// the farmers, and the darning needle it keeps its smile mended with.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const STRAW = { y: '#ecc65a', Y: '#b08a2a', k: '#24160c' };
// Its crows are a little paler than real ones, so you can see them in the dark.
const CROW = { b: '#5c5c88', B: '#a2a2d0', o: '#e8a838', g: '#ffffff' };
const HAT = { k: '#24160c', h: '#a0825c', H: '#6e563a', r: '#b84a34', y: '#ecc65a' };
const SEED = { s: '#c89a5a', S: '#7a5430', g: '#7ab84a', G: '#4a7a2a', y: '#ecc65a', Y: '#b08a2a' };

// A crow, drawn flying right, flapping.
defineBulletArt('haywardCrow', {
  frames: [
    ['...BB....', '....BB...', 'bb.bbbbgo', '.bbbbbbb.', '.........'],
    ['.........', 'bb.......', 'bbbbbbbgo', '..bbbbbb.', '...BB....'],
  ],
  palette: CROW,
  radius: 2.5,
  rotate: true,
  frameSeconds: 0.1,
});

// A black feather, see-sawing down.
defineBulletArt('haywardFeather', {
  frames: [['..B', '.b.', 'b..'], ['B..', '.b.', '..b']],
  palette: CROW,
  radius: 1.2,
  frameSeconds: 0.3,
});

// A wisp of straw, drawn pointing right.
defineBulletArt('haywardStraw', {
  frames: [['..Yyy', 'yyY..']],
  palette: STRAW,
  radius: 1.2,
  rotate: true,
});

// Its hat, spinning, with straw poking out from under the band.
defineBulletArt('haywardHat', {
  frames: [[
    '...kkkk....',
    '..khhHhk...',
    '..khhhHk...',
    '..krrrrk...',
    'kkhhhhhhkk.',
    'yHHHHHHHHky',
  ]],
  palette: HAT,
  radius: 4,
  spin: 8,
});

// A seed, flung; the shoot it puts up (harmless: it's the warning); and the
// grains it bursts into, drawn pointing right.
defineBulletArt('haywardSeed', {
  frames: [['.s.', 'sSs', '.S.']],
  palette: SEED,
  radius: 1.3,
  spin: 5,
});
defineBulletArt('haywardShoot', {
  frames: [
    ['.....', '.....', '..g..', '.gSG.', '..S..'],
    ['..y..', '.gyG.', 'g.g.G', '.gSG.', '..S..'],
  ],
  palette: SEED,
  radius: 2,
  frameSeconds: 0.2,
});
defineBulletArt('haywardGrain', {
  frames: [['.yy.', 'YyyY', '.Yy.']],
  palette: SEED,
  radius: 1.4,
  rotate: true,
});

// A crow sat down, pecking about (it's not scared of anything. Yet).
defineBulletArt('haywardCrowSitting', {
  frames: [
    ['..bbgo', '.bbbb.', 'bbBbb.', '.b..b.'],
    ['......', '..bbgo', 'bbBbbb', '.b..b.'],
  ],
  palette: CROW,
  radius: 2.5,
  frameSeconds: 0.25,
});

// A big darning needle, drawn pointing right.
defineBulletArt('haywardNeedle', {
  frames: [['kk.......', 'kyYYYYYYw', 'kk.......']],
  palette: { k: '#24160c', y: '#e8dcb0', Y: '#a8b0b8', w: '#ffffff' },
  radius: 1.5,
  rotate: true,
});

// Changes a thing's look (to the art of a bullet made with the new one).
const LOOKS = {};
const setLook = (shot, name, Shot) => {
  LOOKS[name] ??= new Shot({ x: 0, y: 0, art: name }).art;
  shot.artName = name;
  shot.art = LOOKS[name];
};

export const HAYWARD_ATTACKS = {
  // Hat trick: it takes off its hat and skims it at you. The hat blinks at
  // the edge of the box, then flies out in a loop that passes through where
  // you were standing and comes back round to its hand, dropping straw from
  // its lining as it spins.
  haywardHat(box, density, { Shot, rand, clamp, shuffleBag }) {
    const side = shuffleBag(['left', 'right', 'top', 'bottom']);
    const warn = 0.4;
    const flight = 1.35;
    let throws = [];
    let next = 0.15;
    let t = 0;
    const toss = (bullets, soul) => {
      const s = side();
      const start = {
        left: { x: box.x - 4, y: rand(box.y + 10, box.y + box.h - 10) },
        right: { x: box.x + box.w + 4, y: rand(box.y + 10, box.y + box.h - 10) },
        top: { x: rand(box.x + 10, box.x + box.w - 10), y: box.y - 4 },
        bottom: { x: rand(box.x + 10, box.x + box.w - 10), y: box.y + box.h + 4 },
      }[s];
      let far = { x: clamp(soul.x, box.x + 4, box.x + box.w - 4), y: clamp(soul.y, box.y + 4, box.y + box.h - 4) };
      // Never a tiny loop: if you're right by the edge, it goes the long way.
      let dx = far.x - start.x;
      let dy = far.y - start.y;
      const d = Math.hypot(dx, dy) || 1;
      if (d < 40) {
        far = { x: start.x + (dx / d) * 40, y: start.y + (dy / d) * 40 };
        dx = far.x - start.x;
        dy = far.y - start.y;
      }
      const centre = { x: (start.x + far.x) / 2, y: (start.y + far.y) / 2 };
      const hat = new Shot({ x: start.x, y: start.y, warn, art: 'haywardHat' });
      bullets.push(hat);
      throws.push({
        hat, centre, radius: Math.hypot(dx, dy) / 2, from: Math.atan2(start.y - centre.y, start.x - centre.x),
        turn: Math.random() < 0.5 ? 1 : -1, t: 0, shed: 0.1,
      });
    };
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 8.2) {
          toss(bullets, soul);
          next = t + rand(1.0, 1.15);
        }
        for (const th of throws) {
          th.t += dt;
          const u = clamp((th.t - warn) / flight, 0, 1);
          const angle = th.from + th.turn * u * Math.PI * 2;
          th.hat.x = th.centre.x + Math.cos(angle) * th.radius;
          th.hat.y = th.centre.y + Math.sin(angle) * th.radius;
          if (u > 0 && u < 1) {
            th.shed -= dt;
            if (th.shed <= 0) {
              th.shed += 0.16;
              bullets.push(new Shot({ x: th.hat.x, y: th.hat.y, vx: rand(-12, 12), vy: rand(-10, 4), gravity: 70, life: 1, art: 'haywardStraw' }));
            }
          }
          if (u >= 1) {
            th.hat.life = th.hat.age - th.hat.warn;
            th.done = true;
          }
        }
        throws = throws.filter((th) => !th.done);
      },
    };
  },

  // Sowing season: it scatters handfuls of seed it's been saving for the
  // farmers. The seeds skid to a stop, a green shoot comes up out of each,
  // and then it bursts into grain, four ways (straight, or corner-wise,
  // turn and turn about). One seed in every handful lands right on you.
  haywardSeeds(box, density, { Shot, every, rand, clamp, spreadAcross }) {
    const slow = 120;
    const nextX = spreadAcross(box.x + 8, box.x + box.w - 8, 4);
    let seeds = [];
    let handful = 0;
    const sow = (bullets, from, to) => {
      const d = Math.hypot(to.x - from.x, to.y - from.y);
      const speed = Math.min(140, Math.sqrt(2 * slow * d));
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      const seed = new Shot({ x: from.x, y: from.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, accel: -slow, art: 'haywardSeed' });
      seed.meant = speed;
      seed.straight = handful % 2 === 0;
      bullets.push(seed);
      seeds.push(seed);
    };
    const scatter = every(0.95, 1.1, (bullets, soul) => {
      const from = { x: nextX(), y: box.y - 3 };
      sow(bullets, from, { x: clamp(soul.x, box.x + 4, box.x + box.w - 4), y: clamp(soul.y, box.y + 4, box.y + box.h - 4) });
      for (let i = 0; i < 3; i++) {
        sow(bullets, from, { x: rand(box.x + 6, box.x + box.w - 6), y: rand(box.y + 10, box.y + box.h - 6) });
      }
      handful++;
    }, { first: 0.2 });
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        scatter(dt, bullets, soul);
        for (const seed of seeds) {
          const speed = Math.hypot(seed.vx, seed.vy);
          if (seed.meant && seed.age > 0) {
            // The battle speeds new bullets up for tougher enemies; slow it
            // to match, so the seed still stops where it was meant to.
            const k = speed / seed.meant;
            seed.accel *= k * k;
            seed.meant = 0;
          }
          if (speed > 0.5 || seed.planted) continue;
          // Stopped: it takes root, and only the grain it bursts into hurts.
          seed.planted = true;
          seed.harmless = true;
          seed.life = seed.age - seed.warn + 0.35;
          seed.root = 0.35 + 0.5;
          bullets.push(new Shot({ x: seed.x, y: seed.y - 1, harmless: true, warn: 0.35, life: 0.5, art: 'haywardShoot' }));
        }
        for (const seed of seeds) {
          if (!seed.planted) continue;
          seed.root -= dt;
          if (seed.root > 0) continue;
          seed.done = true;
          const offset = seed.straight ? 0 : Math.PI / 4;
          for (let i = 0; i < 4; i++) {
            const angle = offset + (i * Math.PI) / 2;
            bullets.push(new Shot({ x: seed.x, y: seed.y, vx: Math.cos(angle) * 48, vy: Math.sin(angle) * 48, life: 1.8, art: 'haywardGrain' }));
          }
        }
        seeds = seeds.filter((seed) => !seed.done);
      },
    };
  },
  // SHOO: crows come down to sit all over the box (they blink as they land),
  // a couple of them right between it and you. Then it flaps its arms (its
  // hat jumps first) and for once they're scared: every crow flies off
  // straight AWAY from the scarecrow, dropping a feather. So never be on the
  // far side of a crow from the hat. It moves round the box between goes.
  haywardScare(box, density, { Shot, rand, clamp, pointAwayFrom }) {
    const sides = [{ x: box.x + box.w / 2, y: box.y - 6 }, { x: box.x - 6, y: box.y + box.h / 2 }, { x: box.x + box.w + 6, y: box.y + box.h / 2 }];
    const scarecrow = { ...sides[0] };
    const CYCLE = 2.1;
    let hat = null;
    let crows = [];
    let t = 0;
    let round = -1;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!hat) {
          hat = new Shot({ x: scarecrow.x, y: scarecrow.y + 2, harmless: true, art: 'haywardHat' });
          bullets.push(hat);
        }
        const now = Math.floor(t / CYCLE);
        const into = t - now * CYCLE;
        if (now !== round && t < 9.4) {
          round = now;
          crows = [];
          // It shuffles round to another side of the box each time.
          Object.assign(scarecrow, sides[round % sides.length]);
          hat.x = scarecrow.x;
          const spots = [];
          // Two between it and you...
          for (const u of [rand(0.35, 0.5), rand(0.6, 0.75)]) {
            spots.push({ x: scarecrow.x + (soul.x - scarecrow.x) * u + rand(-5, 5), y: scarecrow.y + (soul.y - scarecrow.y) * u + rand(-5, 5) });
          }
          // ...and more about the place.
          for (let i = 0; i < 3; i++) spots.push(pointAwayFrom(box, soul, 22, 8));
          for (const spot of spots) {
            const crow = new Shot({ x: clamp(spot.x, box.x + 5, box.x + box.w - 5), y: clamp(spot.y, box.y + 8, box.y + box.h - 5), warn: 0.5, art: 'haywardCrowSitting' });
            bullets.push(crow);
            crows.push(crow);
          }
        }
        // The hat jumps: it's about to flap.
        hat.y = scarecrow.y + (scarecrow.y < box.y ? 2 : 0) - (into > 1.05 && into < 1.45 ? Math.abs(Math.sin(into * 30)) * 3 : 0);
        if (into >= 1.45 && !crows.flown) {
          crows.flown = true;
          for (const crow of crows) {
            const away = Math.atan2(crow.y - scarecrow.y, crow.x - scarecrow.x);
            setLook(crow, 'haywardCrow', Shot);
            crow.angle = away;
            crow.vx = Math.cos(away) * 72;
            crow.vy = Math.sin(away) * 72;
            bullets.push(new Shot({ x: crow.x, y: crow.y, vx: rand(-8, 8), vy: 14, life: 1.6, art: 'haywardFeather' }));
          }
        }
      },
    };
  },

  // Mending: its smile has been stitched back together a hundred times,
  // and it's still handy with a needle. A big darning needle comes stitching
  // across the box, zig, zag, and the thread it leaves stays pulled tight
  // behind it for a moment. Get past it ahead of the needle, through a
  // gap in the zigzag, not through the fresh thread. Then one from the
  // other side, along your row.
  haywardStitch(box, density, { Shot, Line, rand, clamp }) {
    const SPEED = 34;
    let needles = [];
    let t = 0;
    let next = 0.2;
    let fromLeft = Math.random() < 0.5;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 8.4) {
          next = t + 2.3;
          const y = clamp(soul.y, box.y + 6, box.y + box.h - 6);
          const x = fromLeft ? box.x - 2 : box.x + box.w + 2;
          const needle = new Shot({ x, y, warn: 0.6, art: 'haywardNeedle', angle: fromLeft ? 0 : Math.PI });
          needle.dir = fromLeft ? 1 : -1;
          needle.mid = y;
          needle.last = { x, y };
          // Timed so the seam goes through the spot you're standing on.
          needle.phase = -(Math.abs(soul.x - x) / SPEED) * 5;
          needle.thread = 0;
          bullets.push(needle);
          needles.push(needle);
          fromLeft = !fromLeft;
        }
        for (const needle of needles) {
          if (needle.age < needle.warn) continue;
          const run = needle.age - needle.warn;
          // Zig, zag: it dives through the cloth and back up.
          const wantY = clamp(needle.mid + Math.sin(run * 5 + needle.phase) * 20, box.y + 2, box.y + box.h - 2);
          needle.vx = needle.dir * SPEED;
          needle.vy = (wantY - needle.y) / Math.max(dt / density, 1e-4);
          needle.angle = Math.atan2(needle.vy, needle.vx);
          needle.thread -= dt;
          if (needle.thread <= 0) {
            needle.thread = 0.12;
            const dx = needle.x - needle.last.x;
            const dy = needle.y - needle.last.y;
            const length = Math.hypot(dx, dy);
            if (length > 0.5) {
              bullets.push(new Line({ x: needle.last.x, y: needle.last.y, angle: Math.atan2(dy, dx), length, thickness: 2, warn: 0, life: 0.9, color: '#e8dcb0' }));
            }
            needle.last = { x: needle.x, y: needle.y };
          }
        }
        needles = needles.filter((needle) => needle.x > box.x - 10 && needle.x < box.x + box.w + 10);
      },
    };
  },
};
