import { defineBulletArt } from '../projectiles.js';

// The Hayward's attacks. It's Hollin's old scarecrow, still minding fields
// nobody has planted in fifty years, so it fights with what a scarecrow has:
// the crows it was meant to scare (they've never been scared of it), the
// straw it's stuffed with, its battered hat, its great wide arms, and a
// pocketful of seed it's been saving for the farmers.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const STRAW = { y: '#ecc65a', Y: '#b08a2a', k: '#24160c' };
const COAT = { k: '#24160c', c: '#93a660', C: '#62723c', p: '#b8603a', y: '#ecc65a', Y: '#b08a2a' };
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

// A coat cuff with straw sticking out, pointing right (harmless itself: the
// straw comes out of it). And one pointing left.
defineBulletArt('haywardCuffRight', {
  frames: [['kkkk..', 'cCck.y', 'cpCkyY', 'cCck.y', 'kkkk..']],
  palette: COAT,
  radius: 2.5,
});
defineBulletArt('haywardCuffLeft', {
  frames: [['..kkkk', 'y.kcCc', 'Yykcpc', 'y.kcCc', '..kkkk']],
  palette: COAT,
  radius: 2.5,
});

// A piece of its sleeve, faded green, with a patch on every other one.
defineBulletArt('haywardSleeve', {
  frames: [['kkkkkk', 'cCcccC', 'cccCcc', 'kkkkkk']],
  palette: COAT,
  hitbox: { w: 6, h: 4 },
});
defineBulletArt('haywardPatch', {
  frames: [['kkkkkk', 'cpppcC', 'cpppCc', 'kkkkkk']],
  palette: COAT,
  hitbox: { w: 6, h: 4 },
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

export const HAYWARD_ATTACKS = {
  // Shoo, crows: its crows come flapping in along the top of the box from
  // either side. Each one stops, hangs in the air and looks at you, then
  // dives at where you were when it looked. Every third time two come at
  // once, one from each side. They drop feathers when they stop.
  haywardCrows(box, density, { Shot, every, rand, angleTo }) {
    let crows = [];
    let fromLeft = Math.random() < 0.5;
    let flock = 0;
    const send = (bullets, left) => {
      const crow = new Shot({
        x: left ? box.x - 6 : box.x + box.w + 6,
        y: rand(box.y + 6, box.y + 28),
        vx: left ? 62 : -62,
        wobble: { amplitude: 2, frequency: 10 },
        art: 'haywardCrow',
      });
      crow.cruise = rand(0.45, 0.85);
      crow.stage = 'cruise';
      bullets.push(crow);
      crows.push(crow);
    };
    const flap = every(0.6, 0.75, (bullets) => {
      if (++flock % 3 === 0) {
        send(bullets, true);
        send(bullets, false);
      } else {
        send(bullets, fromLeft);
        fromLeft = !fromLeft;
      }
    });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        flap(dt, bullets, soul);
        for (const crow of crows) {
          if (crow.stage === 'cruise') {
            crow.cruise -= dt;
            if (crow.cruise > 0) continue;
            // It stops, hangs there, and fixes you with one eye.
            crow.stage = 'look';
            crow.look = 0.38;
            crow.wobble = null;
            crow.speed = Math.hypot(crow.vx, crow.vy) * 1.8;
            crow.vx = 0;
            crow.vy = 0;
            crow.aim = angleTo(crow, soul);
            crow.angle = crow.aim;
            bullets.push(new Shot({ x: crow.x, y: crow.y + 3, vx: rand(-4, 4), vy: 20, wobble: { amplitude: 2, frequency: 4 }, life: 3, art: 'haywardFeather' }));
          } else if (crow.stage === 'look') {
            crow.look -= dt;
            if (crow.look > 0) continue;
            crow.stage = 'dive';
            crow.vx = Math.cos(crow.aim) * crow.speed;
            crow.vy = Math.sin(crow.aim) * crow.speed;
          }
        }
        crows = crows.filter((crow) => crow.stage !== 'dive');
      },
    };
  },

  // Stuffing spray: its two coat cuffs creep up and down the walls of the
  // box, always at opposite heights, and take turns blowing a stream of
  // straw across. The stream follows the cuff, so it comes as a wave: watch
  // the cuff, not the straw. Every third gust ends with a sneeze of straw
  // aimed at you.
  haywardStraw(box, density, { Shot, rand, angleTo }) {
    const mid = box.y + box.h / 2;
    const reach = box.h / 2 - 8;
    const left = new Shot({ x: box.x + 3, y: mid, harmless: true, art: 'haywardCuffRight' });
    const right = new Shot({ x: box.x + box.w - 3, y: mid, harmless: true, art: 'haywardCuffLeft' });
    const phase = rand(0, Math.PI * 2);
    let t = 0;
    let started = false;
    let gust = 0;
    let puffIn = 0;
    const gustSeconds = 0.55;
    const restSeconds = 0.3;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        if (!started) {
          started = true;
          bullets.push(left, right);
        }
        t += dt;
        left.y = mid + Math.sin(t * 1.5 + phase) * reach;
        right.y = mid - Math.sin(t * 1.5 + phase) * reach;
        // A short breath before the first gust, then gusts and rests in turn.
        const into = t - 0.6;
        if (into < 0 || t > 6.4) return;
        const round = Math.floor(into / (gustSeconds + restSeconds));
        const inGust = into - round * (gustSeconds + restSeconds) < gustSeconds;
        const cuff = round % 2 ? right : left;
        const dir = round % 2 ? -1 : 1;
        if (round !== gust) {
          // The last gust's over: every third one, a sneeze at you.
          if (gust % 3 === 2) {
            const was = gust % 2 ? right : left;
            const aim = angleTo(was, soul);
            for (let i = -2; i <= 2; i++) {
              const angle = aim + i * 0.22;
              bullets.push(new Shot({ x: was.x, y: was.y, vx: Math.cos(angle) * 70, vy: Math.sin(angle) * 70, life: 2, art: 'haywardStraw' }));
            }
          }
          gust = round;
        }
        if (!inGust) return;
        puffIn -= dt;
        while (puffIn <= 0) {
          puffIn += 0.07;
          const angle = (dir > 0 ? 0 : Math.PI) + rand(-0.1, 0.1);
          const speed = rand(76, 84);
          bullets.push(new Shot({
            x: cuff.x + dir * 3, y: cuff.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, gravity: 30, life: 1.8, art: 'haywardStraw',
          }));
        }
      },
    };
  },

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
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 5.4) {
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

  // Big hug: its arms come in from both walls, a sleeve from each side with
  // a gap between the hands, and sweep down the box (then up it, then down).
  // The gap opens where you aren't, and closes as the arms come, so get
  // under it early.
  haywardHug(box, density, { Shot, rand, clamp }) {
    const travel = 1.6;
    const warn = 0.6;
    const piece = 6;
    // Half the gap between the hands, when they start and when they've closed in.
    const OPEN = 16;
    const SHUT = 9;
    let passes = [];
    let made = 0;
    let t = 0;
    const embrace = (bullets, soul) => {
      const down = made % 2 === 0;
      made++;
      // The gap's middle is at least a good step from you.
      let gap = rand(box.x + 16, box.x + box.w - 16);
      for (let tries = 0; tries < 12 && Math.abs(gap - soul.x) < 24; tries++) gap = rand(box.x + 16, box.x + box.w - 16);
      // The sleeves stay put either side; the hands (a cuff and a wrist
      // each) slide in from the edges of the gap.
      const sleeves = [];
      for (let x = box.x + piece / 2; x < box.x + box.w; x += piece) {
        if (Math.abs(x - gap) < OPEN + piece / 2) continue;
        const shot = new Shot({ x, y: 0, warn, art: Math.floor(x / piece) % 3 === 0 ? 'haywardPatch' : 'haywardSleeve' });
        sleeves.push(shot);
      }
      const cuffs = [
        new Shot({ x: 0, y: 0, warn, art: 'haywardCuffRight' }),
        new Shot({ x: 0, y: 0, warn, art: 'haywardCuffLeft' }),
        new Shot({ x: 0, y: 0, warn, art: 'haywardSleeve' }),
        new Shot({ x: 0, y: 0, warn, art: 'haywardSleeve' }),
      ];
      const pass = { sleeves, cuffs, gap, down, t: 0 };
      place(pass);
      bullets.push(...sleeves, ...cuffs);
      passes.push(pass);
    };
    // Sets the arms where they are this far into their pass.
    const place = (pass) => {
      const u = clamp((pass.t - warn) / travel, 0, 1);
      const top = box.y + 3;
      const bottom = box.y + box.h - 3;
      const y = pass.down ? top + (bottom - top) * u : bottom - (bottom - top) * u;
      const half = OPEN - (OPEN - SHUT) * u; // the hands close in as they come
      for (const shot of [...pass.sleeves, ...pass.cuffs]) shot.y = y;
      pass.cuffs[0].x = pass.gap - half - 2;
      pass.cuffs[1].x = pass.gap + half + 2;
      pass.cuffs[2].x = pass.gap - half - 8;
      pass.cuffs[3].x = pass.gap + half + 8;
      return u;
    };
    return {
      duration: 6.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (made < 3 && t >= 0.1 + made * 1.9) embrace(bullets, soul);
        for (const pass of passes) {
          pass.t += dt;
          if (place(pass) < 1) continue;
          for (const shot of [...pass.sleeves, ...pass.cuffs]) shot.life = shot.age - shot.warn;
          pass.done = true;
        }
        passes = passes.filter((pass) => !pass.done);
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
      duration: 6.6,
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
};
