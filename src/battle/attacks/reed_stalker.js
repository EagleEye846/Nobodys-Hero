import { defineBulletArt } from '../projectiles.js';

// The Reed Stalker's attacks. It's a heron that stands in the shallows of
// the Lantern Marsh as still as a reed, for hours, and then strikes, so it's
// the marsh's heavy: not many bullets, all slow to come and easy to see
// coming, but every one of them hurts a LOT. It fights with its spear of a
// beak (aimed at where you are, after a long, steady look), reeds that come
// up round you with one that isn't a reed, the grey feathers it shakes out,
// stabbing down into the water after fish, and its long legs wading
// through the box.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const BEAK_COLOR = '#d8a838';
const REED_COLOR = '#5a6a48';
const LEG_COLOR = '#9a8a5a';

const HEAD = { k: '#12141a', g: '#8a929a', w: '#d8dce0', c: '#1a1c22', b: '#d8a838', B: '#9a7020', y: '#f0d040' };
const FEATHER = { g: '#a8b0b8', G: '#6a7078', w: '#e0e4e8' };
const WATER = { q: '#8ab8d0', Q: '#4a7a98', w: '#e8f8ff' };
const FISH = { k: '#12141a', s: '#c8d4dc', S: '#7a8a98', e: '#000000' };
const CATTAIL = { c: '#6a4026', C: '#4a2a18', r: '#7a8a5a' };
const FOOT = { k: '#12141a', l: '#9a8a5a', L: '#6a5a3a' };
const EYE = { y: '#f0d040', k: '#12141a', e: '#000000' };

// Its head, at the very tip of a strike, drawn pointing right: the spear
// of the beak out in front.
defineBulletArt('stalkerHead', {
  frames: [[
    'kk.........',
    'cckk.......',
    'kggykkkk...',
    'kwwwbbbbbbk',
    'kwwkBBBBkk.',
    '.kk.kkkk...',
  ]],
  palette: HEAD,
  radius: 3,
  rotate: true,
});

// A grey feather, see-sawing down (tipped one way, then the other).
defineBulletArt('stalkerFeather', {
  frames: [
    ['wg.....', 'GgggG..', '..GgggG', '.....gG'],
    ['.....gw', '..GgggG', 'GgggG..', 'Gg.....'],
  ],
  palette: FEATHER,
  radius: 1.8,
  frameSeconds: 0.4,
});

// A ripple running out across the water.
defineBulletArt('stalkerRipple', {
  frames: [['.qwq.', 'Q...Q']],
  palette: WATER,
  radius: 1.8,
});

// A drop of marsh water.
defineBulletArt('stalkerDrop', {
  frames: [['.w.', 'qwq', '.Q.']],
  palette: WATER,
  radius: 1.4,
});

// A little silver fish, the one it missed, flipping, drawn heading right.
defineBulletArt('stalkerFish', {
  frames: [
    ['k..kkk.', 'kkksssk', 'kSssSek', 'k..kkk.'],
    ['.k.kkk.', '.kksssk', 'kSssSek', '...kkk.'],
  ],
  palette: FISH,
  radius: 2,
  rotate: true,
  frameSeconds: 0.08,
});

// The brown head of a cattail, on top of a reed.
defineBulletArt('stalkerCattail', {
  frames: [['.r.', 'cCc', 'cCc', 'cCc', 'cCc', '.r.']],
  palette: CATTAIL,
  radius: 1.6,
});

// Its eye opening among the reeds (harmless): it's about to strike.
defineBulletArt('stalkerEye', {
  frames: [['kkkkk', 'kyyek', 'kkkkk'], ['.....', 'kkkkk', '.....']],
  palette: EYE,
  radius: 1,
  frameSeconds: 0.12,
});

// Its foot, coming down flat in the mud.
defineBulletArt('stalkerFoot', {
  frames: [['k.lk.lk', '.klLlk.', 'kLLLLLk']],
  palette: FOOT,
  radius: 3,
});

// A strike of its beak: a long warning line along where it'll go (it
// takes a good, steady look first), then the beak shoots along it, stays a
// moment, and pulls back. The shaft is its neck; the head rides the end.
function makeStrike(Line, Shot, from, angle, length, warn) {
  const line = new Line({ x: from.x, y: from.y, angle, length, thickness: 3, warn, life: 0.75, color: BEAK_COLOR });
  const head = new Shot({ x: from.x, y: from.y, warn, life: 0.75, angle, art: 'stalkerHead' });
  return { line, head, from, angle, reach: length };
}

// Out very fast, held, then drawn back.
function moveStrike(strike) {
  const { line, head, from, angle, reach } = strike;
  const k = line.age - line.warn;
  if (k < 0) return;
  let out;
  if (k < 0.12) out = k / 0.12;
  else if (k < 0.4) out = 1;
  else out = Math.max(0, 1 - (k - 0.4) / 0.35);
  line.length = Math.max(1, reach * out);
  head.x = from.x + Math.cos(angle) * line.length;
  head.y = from.y + Math.sin(angle) * line.length;
}

export const REED_STALKER_ATTACKS = {
  // Strike: it looks at you, for a long moment (the line shows where), and
  // then its beak goes through that spot like a spear. From the side, from
  // high up, from the side again. Move once it's committed.
  stalkerStrike(box, density, { Shot, Line, rand, clamp }) {
    let strikes = [];
    let t = 0;
    let next = 0.15;
    let count = 0;
    const aim = (bullets, soul) => {
      const high = count++ % 2 === 1;
      const from = high
        ? { x: clamp(soul.x + rand(20, 40), box.x + 20, box.x + box.w + 30), y: box.y - 10 }
        : { x: box.x + box.w + 10, y: clamp(soul.y + rand(-16, 16), box.y + 6, box.y + box.h - 6) };
      const angle = Math.atan2(soul.y - from.y, soul.x - from.x);
      const strike = makeStrike(Line, Shot, from, angle, 140, 0.85);
      bullets.push(strike.line, strike.head);
      strikes.push(strike);
    };
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 6) {
          aim(bullets, soul);
          next = t + 1.35;
        }
        for (const strike of strikes) {
          moveStrike(strike);
          // A feather or two shakes loose with each strike.
          if (!strike.shook && strike.line.age > strike.line.warn) {
            strike.shook = true;
            for (let i = 0; i < 2; i++) {
              bullets.push(new Shot({ x: rand(box.x + 8, box.x + box.w - 8), y: box.y - 3, vx: rand(-8, 8), vy: rand(16, 22), art: 'stalkerFeather' }));
            }
          }
        }
        strikes = strikes.filter((strike) => strike.line.age < strike.line.warn + 1.2);
      },
    };
  },

  // Still as a reed: reeds come up out of the water all over the box, and
  // you pick your way between them. One of them isn't a reed. Its eye
  // opens, and the beak comes out sideways along your row. Then another.
  stalkerReeds(box, density, { Shot, Line, rand, pick }) {
    const bottom = box.y + box.h + 2;
    const reeds = [];
    let strikes = [];
    let t = 0;
    let started = false;
    let nextStrike = 1.6;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!started) {
          started = true;
          // Reeds in a loose row, with room to stand between each.
          for (let x = box.x + 8 + rand(0, 4); x < box.x + box.w - 4; x += rand(13, 17)) {
            // Never right where you start: you get a moment to look first.
            if (Math.abs(x - soul.x) < 6) x += 7;
            const height = rand(36, 70);
            const line = new Line({ x, y: bottom, angle: -Math.PI / 2, length: height, thickness: 2, warn: 0.6, grow: 120, life: 5.2, color: REED_COLOR });
            const head = new Shot({ x, y: bottom, warn: 0.6, life: 5.2, art: 'stalkerCattail' });
            reeds.push({ line, head, x, height, sway: rand(0, Math.PI * 2) });
            bullets.push(line, head);
          }
        }
        for (const reed of reeds) {
          const grown = reed.line.solidLength;
          reed.line.x = reed.x + Math.sin(t * 1.2 + reed.sway) * 1;
          reed.head.x = reed.line.x;
          reed.head.y = bottom - Math.max(grown, 2) - 2;
        }
        // One of them opens an eye... and strikes across, along your row.
        if (t >= nextStrike && t < 6) {
          nextStrike = t + 1.45;
          const reed = pick(reeds);
          const y = Math.max(box.y + 6, Math.min(box.y + box.h - 6, soul.y));
          bullets.push(new Shot({ x: reed.x, y, harmless: true, life: 0.7, art: 'stalkerEye' }));
          const angle = soul.x >= reed.x ? 0 : Math.PI;
          const strike = makeStrike(Line, Shot, { x: reed.x, y }, angle, box.w, 0.7);
          bullets.push(strike.line, strike.head);
          strikes.push(strike);
        }
        for (const strike of strikes) moveStrike(strike);
        strikes = strikes.filter((strike) => strike.line.age < strike.line.warn + 1.2);
      },
    };
  },

  // Shake out: it ruffles itself up and shakes, and grey feathers come
  // see-sawing down all over. Every so often it beats its wings, and the
  // gust blows every feather in the box sideways at once.
  stalkerFeathers(box, density, { Shot, every, rand, spreadAcross }) {
    const nextX = spreadAcross(box.x + 5, box.x + box.w - 5, 6);
    let feathers = [];
    let t = 0;
    let gust = 0;
    let gustDir = 1;
    let nextGust = 1.8;
    const fall = every(0.24, 0.32, (bullets) => {
      const x = nextX();
      const feather = new Shot({ x, y: box.y - 4, vy: rand(14, 20), art: 'stalkerFeather' });
      feather.baseX = x;
      feather.sway = rand(0, Math.PI * 2);
      bullets.push(feather);
      feathers.push(feather);
    });
    return {
      duration: 6.6,
      update: (dt, bullets) => {
        t += dt;
        if (t < 6) fall(dt, bullets);
        // The wingbeat: a push one way, dying off.
        if (t >= nextGust && t < 5.6) {
          nextGust = t + 1.7;
          gustDir = Math.random() < 0.5 ? -1 : 1;
          gust = 55;
        }
        gust = Math.max(0, gust - dt * 45);
        for (const feather of feathers) {
          feather.baseX += gustDir * gust * dt;
          // Back and forth as it falls.
          feather.x = feather.baseX + Math.sin(feather.age * 2.6 + feather.sway) * 7;
        }
        feathers = feathers.filter((feather) => feather.y < box.y + box.h + 8);
      },
    };
  },

  // Fishing: it stabs straight down into the water, at you, after a fish.
  // Where the beak goes in, ripples run out along the bottom both ways, and
  // the fish it missed comes flipping up out of the water.
  stalkerFishing(box, density, { Shot, Line, rand, clamp }) {
    let stabs = [];
    let t = 0;
    let next = 0.15;
    let count = 0;
    // A second stab waiting to come down a beat after the first.
    let later = null;
    const stab = (bullets, x) => {
      const from = { x: clamp(x, box.x + 5, box.x + box.w - 5), y: box.y - 8 };
      const strike = makeStrike(Line, Shot, from, Math.PI / 2, box.h + 8, 0.75);
      bullets.push(strike.line, strike.head);
      stabs.push(strike);
    };
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 5.9) {
          count++;
          stab(bullets, soul.x);
          // Every third, a second stab just beside the first, a beat later.
          if (count % 3 === 0) {
            const side = soul.x < box.x + box.w / 2 ? 1 : -1;
            const x = soul.x + side * 18;
            later = { at: t + 0.35, x };
          }
          next = t + 1.25;
        }
        if (later && t >= later.at) {
          stab(bullets, later.x);
          later = null;
        }
        for (const strike of stabs) {
          moveStrike(strike);
          if (strike.splashed || strike.line.age - strike.line.warn < 0.12) continue;
          // In: ripples out along the bottom, and the fish leaps.
          strike.splashed = true;
          const x = strike.from.x;
          const y = box.y + box.h - 3;
          for (const side of [-1, 1]) {
            bullets.push(new Shot({ x, y, vx: side * 46, life: 2, art: 'stalkerRipple' }));
            bullets.push(new Shot({ x, y: y - 6, vx: side * 30, life: 2, art: 'stalkerRipple' }));
          }
          const leap = Math.random() < 0.5 ? -1 : 1;
          bullets.push(new Shot({ x, y, vx: leap * rand(26, 40), vy: -rand(120, 140), gravity: 200, life: 2, art: 'stalkerFish' }));
        }
        stabs = stabs.filter((strike) => strike.line.age < strike.line.warn + 1.2);
      },
    };
  },

  // Wading: its long legs come stepping through the box, slowly, one after
  // the other, left to right. Each one comes down where the line shows, and
  // stands there a while like a post, and its foot splashes mud and water
  // when it lands. Halfway across, it ducks its head between its own legs
  // and jabs along your row.
  stalkerWade(box, density, { Shot, Line, rand, clamp }) {
    const top = box.y - 4;
    let steps = 0;
    let t = 0;
    let next = 0.15;
    let strikes = [];
    let legs = [];
    let jabbed = false;
    const lanes = [0.12, 0.3, 0.46, 0.62, 0.8, 0.94];
    const step = (bullets, soul) => {
      // Mostly marching across; every third step comes down near you.
      const k = lanes[steps % lanes.length];
      const x = steps % 3 === 2 ? clamp(soul.x, box.x + 6, box.x + box.w - 6) : box.x + box.w * k;
      const leg = new Line({ x, y: top, angle: Math.PI / 2, length: box.h + 2, thickness: 4, warn: 0.7, grow: 260, life: 1.5, color: LEG_COLOR });
      bullets.push(leg);
      bullets.push(new Shot({ x, y: box.y + box.h - 3, warn: 0.7 + 0.3, life: 1.2, art: 'stalkerFoot' }));
      leg.splashAt = 0.7 + (box.h + 2) / 260;
      leg.footX = x;
      legs.push(leg);
      steps++;
    };
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 5.8) {
          step(bullets, soul);
          next = t + 0.95;
        }
        for (const leg of legs) {
          if (leg.splashed || leg.age < leg.splashAt) continue;
          leg.splashed = true;
          const y = box.y + box.h - 4;
          for (const side of [-1, 1]) {
            bullets.push(new Shot({ x: leg.footX, y, vx: side * 40, life: 1.5, art: 'stalkerRipple' }));
            bullets.push(new Shot({ x: leg.footX, y, vx: side * rand(20, 34), vy: -rand(60, 80), gravity: 150, life: 1.6, art: 'stalkerDrop' }));
          }
        }
        legs = legs.filter((leg) => leg.age < 3);
        // The jab between its legs, once.
        if (!jabbed && t >= 3.2) {
          jabbed = true;
          const fromLeft = soul.x > box.x + box.w / 2;
          const from = { x: fromLeft ? box.x - 8 : box.x + box.w + 8, y: clamp(soul.y, box.y + 6, box.y + box.h - 6) };
          const strike = makeStrike(Line, Shot, from, fromLeft ? 0 : Math.PI, box.w + 16, 0.85);
          bullets.push(strike.line, strike.head);
          strikes.push(strike);
        }
        for (const strike of strikes) moveStrike(strike);
        strikes = strikes.filter((strike) => strike.line.age < strike.line.warn + 1.2);
      },
    };
  },
};
