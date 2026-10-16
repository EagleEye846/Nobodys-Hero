import { defineBulletArt } from '../projectiles.js';

// The Waxling's attacks. It's a grumpy little living candle in a hurry before
// it melts, so everything it throws is candle stuff: drips of hot wax that
// splash when they land, flames, more little candles, the matchsticks that
// lit it, and the smoke it gives off when it sputters.
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

// A curl of grey candle smoke, swirling.
defineBulletArt('waxlingSmoke', {
  frames: [
    ['.ss..', 's..s.', '.sSs.', '..s.s', '..ss.'],
    ['..ss.', '.s..s', '.sSs.', 's.s..', '.ss..'],
  ],
  palette: { s: '#a8a0b8', S: '#e2dcec' },
  radius: 2,
  frameSeconds: 0.2,
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
      duration: 6.5,
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
    return { duration: 6.5, update: (dt, bullets, soul) => light(dt, bullets, soul) };
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
    return { duration: 6.5, update: (dt, bullets, soul) => toss(dt, bullets, soul) };
  },

  // A wall of candle flames creeps down from the ceiling with one gap in it.
  // Each new wall has its gap somewhere else, so you have to keep sliding
  // over to find it.
  waxlingFlameCurtain(box, density, { Shot, every, rand }) {
    const spacing = 8;
    const gapWidth = 28;
    let gapCentre = rand(box.x + 16, box.x + box.w - 16);
    const lower = every(2.3, 2.6, (bullets) => {
      let next = rand(box.x + 14, box.x + box.w - 14);
      for (let tries = 0; tries < 8 && Math.abs(next - gapCentre) < 22; tries++) {
        next = rand(box.x + 14, box.x + box.w - 14);
      }
      gapCentre = next;
      for (let x = box.x + 3; x <= box.x + box.w - 3; x += spacing) {
        if (Math.abs(x - gapCentre) < gapWidth / 2) continue;
        bullets.push(new Shot({ x, y: box.y + 3, vy: 28, art: 'waxlingFlame', warn: 0.6 }));
      }
    });
    return { duration: 6.5, update: (dt, bullets) => lower(dt, bullets) };
  },

  // Curls of smoke appear around the box (never right on top of you), then
  // drift lazily toward you, swaying, before they thin out. Now and then a stray
  // flame flickers across the box too.
  waxlingSmokeCurls(box, density, { Shot, every, rand, angleTo, pointAwayFrom, edgePoint, shuffleBag }) {
    const straySide = shuffleBag(['left', 'right']);
    const puff = every(1.3, 1.7, (bullets, soul) => {
      const { x, y } = pointAwayFrom(box, soul, 30);
      const aim = angleTo({ x, y }, soul) + rand(-0.6, 0.6);
      const speed = rand(30, 38);
      bullets.push(new Shot({
        x,
        y,
        vx: Math.cos(aim) * speed,
        vy: Math.sin(aim) * speed,
        art: 'waxlingSmoke',
        warn: 0.6,
        life: 2.2,
        homing: { target: soul, turn: 0.35 },
        wobble: { amplitude: 2, frequency: 7 },
      }));
    });
    const stray = every(2.6, 3.2, (bullets, soul) => {
      const start = edgePoint(box, straySide(), -3);
      const aim = angleTo(start, soul) + rand(-0.25, 0.25);
      bullets.push(new Shot({
        x: start.x,
        y: start.y,
        vx: Math.cos(aim) * 60,
        vy: Math.sin(aim) * 60,
        art: 'waxlingFlame',
        warn: 0.6,
        wobble: { amplitude: 3, frequency: 12 },
      }));
    });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        puff(dt, bullets, soul);
        stray(dt, bullets, soul);
      },
    };
  },
};
