import { defineBulletArt } from '../projectiles.js';

// The Waxling's attacks. It's a grumpy little living candle in a hurry before
// it melts, so everything it throws is candle stuff: drips of hot wax that
// splash when they land, flames, more little candles, the matchsticks that
// lit it, a fuse (it is mostly wick, after all), and itself, running laps
// before it melts.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// `tools` holds the bullet classes and helpers (see PATTERN_TOOLS in
// src/battle/bullets.js).

const WAX = { c: '#f2e6c8', C: '#c9b88f', w: '#ffffff' };
const FIRE = { f: '#ff8c1a', F: '#ffe14d', r: '#e0401a', w: '#fff6c0' };

// A drop of hot wax, pointed at the top, heavy at the bottom.
defineBulletArt('waxlingDrip', {
  frames: [[
    '.c.',
    '.c.',
    'cwc',
    'cCc',
    '.C.',
  ]],
  palette: WAX,
  radius: 1.5,
});

// A little fleck of wax thrown up when a drip splashes.
defineBulletArt('waxlingFleck', {
  frames: [
    ['c.', 'Cc'],
    ['.c', 'cC'],
  ],
  palette: WAX,
  radius: 1,
  frameSeconds: 0.1,
});

// A flat puddle of wax, still hot, left where a drip landed.
defineBulletArt('waxlingPuddle', {
  frames: [[
    '..cwc..',
    'cCcccCc',
  ]],
  palette: WAX,
  hitbox: { w: 7, h: 2 },
});

// A tiny lit candle standing on the floor of the box (harmless itself; its
// flame shoots up a moment later).
defineBulletArt('waxlingCandle', {
  frames: [
    ['..f..', '.fFf.', '..k..', '.ccc.', '.cwC.', '.ccC.', '.ccC.', '.ccC.', 'CCCCC'],
    ['.f...', '.Ff..', '..k..', '.ccc.', '.cwC.', '.ccC.', '.ccC.', '.ccC.', 'CCCCC'],
    ['...f.', '..fF.', '..k..', '.ccc.', '.cwC.', '.ccC.', '.ccC.', '.ccC.', 'CCCCC'],
  ],
  palette: { ...WAX, ...FIRE, k: '#4a2a14' },
  radius: 3,
  frameSeconds: 0.1,
});

// A loose candle flame, flickering.
defineBulletArt('waxlingFlame', {
  frames: [
    ['..f..', '.fFf.', 'fFwFf', 'fFwFf', '.fFf.'],
    ['.f...', '.fFf.', 'fFFwf', 'fFwFf', '.fFf.'],
    ['...f.', '.fFf.', 'fwFFf', 'fFwFf', '.fFf.'],
  ],
  palette: FIRE,
  radius: 2,
  frameSeconds: 0.08,
});

// A lit matchstick, drawn lying flat, head to the right. It spins as it flies.
defineBulletArt('waxlingMatch', {
  frames: [
    ['......F.', 'bbbbbrrf', '......F.'],
    ['.......F', 'bbbbbrrF', '......f.'],
  ],
  palette: { ...FIRE, b: '#d8a85a' },
  radius: 2,
  spin: 9,
  frameSeconds: 0.07,
});

// The Waxling itself, running flat out with its eyes screwed shut, at three
// heights: tall, worn down, and nearly a stub.
const RUNNER = { ...WAX, ...FIRE, k: '#4a2a14', e: '#120c1c' };
defineBulletArt('waxlingRunTall', {
  frames: [
    ['..f..', '.fFf.', '.fwf.', '..k..', 'ccccc', 'cecec', 'ccccC', 'cckcC', 'ccccC', 'ccccC', 'CCCCC'],
    ['.f...', '.Ff..', '.fwf.', '..k..', 'ccccc', 'cecec', 'ccccC', 'cckcC', 'ccccC', 'ccccC', 'CCCCC'],
  ],
  palette: RUNNER,
  hitbox: { w: 5, h: 9 },
  frameSeconds: 0.08,
});
defineBulletArt('waxlingRunMid', {
  frames: [
    ['..f..', '.fFf.', '.fwf.', '..k..', 'ccccc', 'cecec', 'cckcC', 'ccccC', 'CCCCC'],
    ['.f...', '.Ff..', '.fwf.', '..k..', 'ccccc', 'cecec', 'cckcC', 'ccccC', 'CCCCC'],
  ],
  palette: RUNNER,
  hitbox: { w: 5, h: 7 },
  frameSeconds: 0.07,
});
defineBulletArt('waxlingRunStub', {
  frames: [
    ['..f..', '.fFf.', '.fwf.', '..k..', 'cecec', 'cckcC', 'CCCCC'],
    ['.f...', '.Ff..', '.fwf.', '..k..', 'cecec', 'cckcC', 'CCCCC'],
  ],
  palette: RUNNER,
  hitbox: { w: 5, h: 5 },
  frameSeconds: 0.06,
});

// Ends a shot right now, wherever it is: it fades out and can't hurt.
function snuff(shot) {
  shot.life = Math.max(0, shot.age - shot.warn);
}

export const WAXLING_ATTACKS = {
  // Drops of hot wax gather on the ceiling of the box (blinking), then fall,
  // speeding up. Where one lands it splashes: a few flecks hop out sideways
  // and a hot puddle sits on the floor for a moment. Some drops form right
  // above you.
  waxlingDripSplash(box, density, { Shot, every, rand, clamp, spreadAcross }) {
    const dripX = spreadAcross(box.x + 4, box.x + box.w - 4, 5);
    const floor = box.y + box.h - 2;
    let falling = [];
    let count = 0;
    const form = every(0.5, 0.7, (bullets, soul) => {
      count++;
      const aimed = count % 5 === 0;
      const x = aimed
        ? clamp(soul.x + rand(-3, 3), box.x + 4, box.x + box.w - 4)
        : dripX();
      const drip = new Shot({ x, y: box.y + 3, vy: 12, art: 'waxlingDrip', gravity: 95, warn: 0.6 });
      bullets.push(drip);
      falling.push(drip);
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        form(dt, bullets, soul);
        for (const drip of falling) {
          if (drip.age < drip.warn || drip.y < floor) continue;
          snuff(drip);
          bullets.push(new Shot({ x: drip.x, y: floor - 1, art: 'waxlingPuddle', life: 0.7 }));
          for (const side of [-1, 1]) {
            bullets.push(new Shot({
              x: drip.x,
              y: floor - 2,
              vx: side * rand(22, 38),
              vy: -rand(45, 65),
              gravity: 170,
              art: 'waxlingFleck',
              life: 0.8,
            }));
          }
        }
        falling = falling.filter((drip) => drip.life === Infinity);
      },
    };
  },

  // Little candles pop up along the floor of the box. A dotted line shows
  // above each one, then its flame roars straight up to the ceiling as a
  // column of fire. Every third wave, one candle lands right under you.
  waxlingCandleColumns(box, density, { Shot, Line, every, rand, clamp }) {
    const floor = box.y + box.h - 5;
    let wave = 0;
    const light = every(1.5, 1.8, (bullets, soul) => {
      wave++;
      const spots = [];
      if (wave % 3 === 1) spots.push(clamp(soul.x + rand(-2, 2), box.x + 4, box.x + box.w - 4));
      while (spots.length < 2) {
        const x = rand(box.x + 5, box.x + box.w - 5);
        if (spots.every((other) => Math.abs(other - x) > 14)) spots.push(x);
      }
      for (const x of spots) {
        bullets.push(new Shot({ x, y: floor, art: 'waxlingCandle', harmless: true, life: 1.5 }));
        bullets.push(new Line({
          x,
          y: floor - 5,
          angle: -Math.PI / 2,
          length: box.h - 8,
          thickness: 4,
          warn: 0.75,
          grow: 110,
          life: 0.5,
          color: '#ff8c1a',
          glow: '#ffe14d',
        }));
      }
    });
    return { duration: 7, update: (dt, bullets, soul) => light(dt, bullets, soul) };
  },

  // Lit matchsticks are flicked in from the sides, blinking first at the
  // edge, then spinning through the air in an arc that comes down where you
  // are. Two at a time, on different arcs: one at you, one off to a side.
  waxlingMatchToss(box, density, { Shot, every, rand, pick, shuffleBag }) {
    const side = shuffleBag(['left', 'right']);
    const gravity = 110;
    const toss = every(1.5, 1.8, (bullets, soul) => {
      const fromLeft = side() === 'left';
      const x = fromLeft ? box.x + 3 : box.x + box.w - 3;
      const y = rand(box.y + box.h * 0.45, box.y + box.h - 6);
      // The quick one comes down near you; the slow one lands off to a side.
      const throws = [{ flight: 0.85, miss: rand(-10, 10) }, { flight: pick([1.1, 1.25]), miss: pick([-1, 1]) * rand(12, 18) }];
      for (const { flight, miss } of throws) {
        const targetX = soul.x + miss;
        // Aimed a little high: the Waxling's slower bullet speed stretches the
        // flight, so gravity has longer to pull the match down onto you.
        const targetY = soul.y + rand(-2, 2) - 0.12 * gravity * flight * flight;
        bullets.push(new Shot({
          x,
          y,
          vx: (targetX - x) / flight,
          vy: (targetY - y) / flight - 0.5 * gravity * flight,
          gravity,
          art: 'waxlingMatch',
          warn: 0.6,
        }));
      }
    });
    return { duration: 7, update: (dt, bullets, soul) => toss(dt, bullets, soul) };
  },

  // The wick. A fuse is laid across the box in a zigzag (a flashing dotted
  // line), and then the far end catches: the flame runs along the fuse and
  // it burns behind it for a moment. It's laid right under you, but you can
  // see the whole path first, so
  // cross it ahead of the flame, or wait until it's burnt out. At the end of
  // the fuse it pops in a little puff of sparks. The fuses come from all
  // four sides, one after another.
  waxlingFuse(box, density, { Shot, Line, rand, clamp, shuffleBag }) {
    const sides = shuffleBag(['left', 'right', 'top', 'bottom']);
    const SPEED = 62;
    const LAY = 1.0;
    const BURN = 0.8;
    let sparks = [];
    let unlit = [];
    const lay = (bullets, soul) => {
      const side = sides();
      const across = side === 'left' || side === 'right';
      const sign = side === 'left' || side === 'top' ? 1 : -1;
      // Corner points along the zigzag: in from the edge, bent right through
      // where you're standing, a kink, and out the far side.
      const run = (k) => (sign > 0 ? k : 80 - k);
      const yours = clamp(across ? soul.x - box.x : soul.y - box.y, 3, 77);
      const yourSide = clamp(across ? soul.y - box.y : soul.x - box.x, 2, 78);
      const marks = [
        [0, rand(10, 70)],
        [sign > 0 ? yours : 80 - yours, yourSide],
        [(sign > 0 ? yours : 80 - yours) + (80 - (sign > 0 ? yours : 80 - yours)) / 2, rand(10, 70)],
        [80, rand(10, 70)],
      ];
      const points = marks.map(([k, offset]) => (across ? { x: box.x + run(k), y: box.y + offset } : { x: box.x + offset, y: box.y + run(k) }));
      let delay = LAY;
      const path = [];
      for (let i = 0; i < 3; i++) {
        const a = points[i];
        const b = points[i + 1];
        const length = Math.hypot(b.x - a.x, b.y - a.y);
        const angle = Math.atan2(b.y - a.y, b.x - a.x);
        // (Its burn speed is set next frame, after the battle's bullet-speed
        // tuning, so the flame and the fuse keep pace with each other.)
        const fuse = new Line({ x: a.x, y: a.y, angle, length, thickness: 3, warn: delay, life: length / SPEED + BURN, color: '#ff8c1a', glow: '#ffe14d' });
        bullets.push(fuse);
        unlit.push(fuse);
        path.push(fuse);
        delay += length / SPEED;
      }
      // The little flame running along the fuse (harmless: the fuse burns).
      const flame = new Shot({ x: points[0].x, y: points[0].y, art: 'waxlingFlame', harmless: true, life: delay + 0.05 });
      bullets.push(flame);
      sparks.push({ flame, path, end: points[3] });
    };
    let timer = 0.1;
    return {
      duration: 7.6,
      update: (dt, bullets, soul) => {
        for (const fuse of unlit) fuse.grow = SPEED;
        unlit = [];
        timer -= dt;
        if (timer <= 0) {
          timer += 2.3;
          lay(bullets, soul);
        }
        for (const spark of sparks) {
          // (The flame rides the head of whichever piece of fuse is burning.)
          const leg = [...spark.path].reverse().find((fuse) => fuse.age >= fuse.warn) ?? spark.path[0];
          spark.flame.x = leg.x + Math.cos(leg.angle) * leg.solidLength;
          spark.flame.y = leg.y + Math.sin(leg.angle) * leg.solidLength;
          const last = spark.path[spark.path.length - 1];
          if (last.age < last.warn || last.solidLength < last.length) continue;
          spark.flame.life = 0;
          spark.popped = true;
          for (let i = 0; i < 4; i++) {
            const angle = Math.PI / 4 + i * Math.PI / 2;
            bullets.push(new Shot({ x: spark.end.x, y: spark.end.y, vx: Math.cos(angle) * 38, vy: Math.sin(angle) * 38, art: 'waxlingFleck', life: 0.7 }));
          }
        }
        sparks = sparks.filter((spark) => !spark.popped);
      },
    };
  },

  // In a hurry! The Waxling runs flat out across the box at your height,
  // dripping as it goes: the drips hang where it passed, then fall. Every lap
  // it's a little shorter (it's melting) and a little faster. Step off its
  // row, and don't step in under where it's just been.
  waxlingHurry(box, density, { Shot, rand, clamp, shuffleBag }) {
    const side = shuffleBag(['left', 'right']);
    const looks = ['waxlingRunTall', 'waxlingRunMid', 'waxlingRunStub', 'waxlingRunStub'];
    let lap = 0;
    let runners = [];
    let timer = 0.1;
    const run = (bullets, soul) => {
      const fromLeft = side() === 'left';
      const speed = 66 + lap * 10;
      const y = clamp(soul.y + rand(-3, 3), box.y + 6, box.y + box.h - 6);
      const runner = new Shot({ x: fromLeft ? box.x + 3 : box.x + box.w - 3, y, vx: fromLeft ? speed : -speed, warn: 0.65, art: looks[Math.min(lap, looks.length - 1)] });
      bullets.push(runner);
      runners.push({ runner, nextDrip: 0, y });
      lap++;
    };
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        timer -= dt;
        if (timer <= 0) {
          timer += 1.75;
          run(bullets, soul);
        }
        for (const r of runners) {
          const { runner } = r;
          if (runner.age < runner.warn) continue;
          // A drip every 14 pixels or so, that hangs, then falls.
          const travelled = Math.abs(runner.x - (runner.vx > 0 ? box.x + 3 : box.x + box.w - 3));
          if (travelled >= r.nextDrip && runner.x > box.x + 4 && runner.x < box.x + box.w - 4) {
            r.nextDrip += 14 + rand(-2, 2);
            bullets.push(new Shot({ x: runner.x, y: r.y + 5, art: 'waxlingDrip', warn: 0.55, vy: 10, gravity: 90 }));
          }
        }
        runners = runners.filter((r) => r.runner.x > box.x - 10 && r.runner.x < box.x + box.w + 10);
      },
    };
  },
};
