import { defineBulletArt } from '../projectiles.js';

// The Duskling's attacks. It's a shadow that got left behind, so everything it
// throws is made of the dark: eyes that open in the walls and stare, hands that
// reach in to grab you, the shadows that stretch when a lantern flickers,
// tendrils that close in like a cage, and itself, following you about as
// your shadow (it hasn't had anyone to follow in a long time).
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// `tools` holds the bullet classes and helpers (see PATTERN_TOOLS in
// src/battle/bullets.js).

const DUSKLING_COLOURS = {
  k: '#05020a', // outline
  s: '#2a1a48', // shadow
  S: '#4a3478', // lighter shadow
  L: '#7a5cc0', // shadow edge, so it shows against the dark box
  e: '#4fe3d0', // glowing eyes
  E: '#ffffff', // eye shine
};

// Turns rows of a sprite a quarter turn clockwise, so one drawing of a hand
// can reach in from any side.
function turnRowsClockwise(rows) {
  const turned = [];
  for (let column = 0; column < rows[0].length; column++) {
    let line = '';
    for (let row = rows.length - 1; row >= 0; row--) line += rows[row][column];
    turned.push(line);
  }
  return turned;
}

// An eye in the dark, shut, then open (both harmless; the open one stares).
defineBulletArt('dusklingEyeShut', {
  frames: [[
    '.......',
    '.LLLLL.',
    'L.....L',
  ]],
  palette: DUSKLING_COLOURS,
  radius: 3,
});

defineBulletArt('dusklingEyeOpen', {
  frames: [[
    '..LLL..',
    '.LsesL.',
    'LseEesL',
    '.LsesL.',
    '..LLL..',
  ]],
  palette: DUSKLING_COLOURS,
  radius: 3,
});

// A grasping shadow hand, drawn reaching right. The other three are turned
// copies, so the hand always faces into the box, even while pulling back.
const HAND_REACHING_RIGHT = [
  '.....LL..',
  'sssSSSSL.',
  'sssSSSSSL',
  'sssSSSSL.',
  'sssSSSSSL',
  'sssSSSSL.',
  '...LLL...',
];
const HAND_REACHING_DOWN = turnRowsClockwise(HAND_REACHING_RIGHT);
const HAND_REACHING_LEFT = turnRowsClockwise(HAND_REACHING_DOWN);
const HAND_REACHING_UP = turnRowsClockwise(HAND_REACHING_LEFT);
defineBulletArt('dusklingHandRight', { frames: [HAND_REACHING_RIGHT], palette: DUSKLING_COLOURS, radius: 3 });
defineBulletArt('dusklingHandDown', { frames: [HAND_REACHING_DOWN], palette: DUSKLING_COLOURS, radius: 3 });
defineBulletArt('dusklingHandLeft', { frames: [HAND_REACHING_LEFT], palette: DUSKLING_COLOURS, radius: 3 });
defineBulletArt('dusklingHandUp', { frames: [HAND_REACHING_UP], palette: DUSKLING_COLOURS, radius: 3 });

// The thorny tip of a tendril, riding the front of it as it grows (harmless
// itself; the tendril behind it is what hurts).
defineBulletArt('dusklingTendrilTip', {
  frames: [[
    'L.L..',
    '.SSL.',
    'SSSSe',
    '.SSL.',
    'L.L..',
  ]],
  palette: DUSKLING_COLOURS,
  radius: 2,
  rotate: true,
});

// A little wisp of the duskling, with its eyes, its tail wriggling.
defineBulletArt('dusklingWisp', {
  frames: [
    ['.LLLL.', 'LsssSL', 'LeSeSL', 'LsssSL', 'Ls.sL.', 'L...L.'],
    ['.LLLL.', 'LsssSL', 'LeSeSL', 'LsssSL', '.Ls.sL', '.L...L'],
  ],
  palette: DUSKLING_COLOURS,
  radius: 2.5,
  frameSeconds: 0.18,
});

// A lantern hanging at the edge of the box, flickering (harmless).
defineBulletArt('dusklingLantern', {
  frames: [
    ['..k..', '.kkk.', 'kyYyk', 'kYwYk', 'kyYyk', '.kkk.'],
    ['..k..', '.kkk.', 'ky.yk', 'k.y.k', 'ky.yk', '.kkk.'],
    ['..k..', '.kkk.', 'kyYyk', 'kYYYk', 'kyYyk', '.kkk.'],
    ['..k..', '.kkk.', 'k...k', 'k.y.k', 'k...k', '.kkk.'],
  ],
  palette: { k: '#5a4a3a', y: '#ffb347', Y: '#ffe14d', w: '#fff6c0' },
  radius: 2,
  frameSeconds: 0.09,
});

// A little standing stone the lantern throws a shadow from (harmless).
defineBulletArt('dusklingStone', {
  frames: [['.ggg.', 'gGGgg', 'gGggd', 'gggdd', 'ggddd', 'ddddd']],
  palette: { g: '#8a8296', G: '#b8b0c8', d: '#5e5874' },
  radius: 2,
});

// The Duskling walking behind you as your shadow: a head with its eyes on you.
defineBulletArt('dusklingFollower', {
  frames: [
    ['.LLLLL.', 'LsssssL', 'LsESEsL', 'LseSesL', 'LsssssL', '.LsssL.', '..LLL..'],
    ['.LLLLL.', 'LsssssL', 'LsssssL', 'LseSesL', 'LsssssL', '.LsssL.', '..LLL..'],
  ],
  palette: DUSKLING_COLOURS,
  radius: 3,
  frameSeconds: 0.5,
});

// Which hand art reaches in from each side of the box.
const HAND_FROM_SIDE = {
  left: { art: 'dusklingHandRight', dx: 1, dy: 0 },
  right: { art: 'dusklingHandLeft', dx: -1, dy: 0 },
  top: { art: 'dusklingHandDown', dx: 0, dy: 1 },
  bottom: { art: 'dusklingHandUp', dx: 0, dy: -1 },
};

export const DUSKLING_ATTACKS = {
  // Eyes open along the walls of the box. Each one blinks awake, looks at
  // you, and a moment later stares a beam straight through where you were.
  // The flashing preview shows the beam's path; step off it.
  dusklingWatchingEyes(box, density, { Shot, Line, every, rand, angleTo, shuffleBag }) {
    const edge = shuffleBag(['top', 'left', 'right', 'bottom']);
    const shutSeconds = 0.4;
    const stareWarn = 0.7;
    let waking = [];
    const openEye = every(2.1, 2.5, (bullets) => {
      const side = edge();
      let x;
      let y;
      if (side === 'top' || side === 'bottom') {
        x = rand(box.x + 10, box.x + box.w - 10);
        y = side === 'top' ? box.y + 4 : box.y + box.h - 4;
      } else {
        x = side === 'left' ? box.x + 4 : box.x + box.w - 4;
        y = rand(box.y + 10, box.y + box.h - 10);
      }
      bullets.push(new Shot({ x, y, art: 'dusklingEyeShut', harmless: true, life: shutSeconds }));
      waking.push({ x, y, t: shutSeconds });
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        openEye(dt, bullets);
        for (const eye of waking) {
          eye.t -= dt;
          if (eye.t > 0) continue;
          bullets.push(new Shot({ x: eye.x, y: eye.y, art: 'dusklingEyeOpen', harmless: true, life: stareWarn + 0.4 }));
          bullets.push(new Line({
            x: eye.x,
            y: eye.y,
            angle: angleTo(eye, soul) + rand(-0.12, 0.12), // it squints a little off
            length: 130,
            thickness: 2,
            warn: stareWarn,
            grow: 260,
            life: 0.4,
            color: '#4fe3d0',
            glow: '#4fe3d0',
          }));
        }
        waking = waking.filter((eye) => eye.t > 0);
      },
    };
  },

  // Shadow hands lunge in from the sides of the box, level with you, stop to
  // grab at the air, then slowly pull back out. Later on, two reach in at once.
  dusklingGraspingHands(box, density, { Shot, every, rand, clamp, shuffleBag }) {
    const edge = shuffleBag(['top', 'left', 'right', 'bottom']);
    const lungeSpeed = 90;
    const slowing = 70; // the hand stops about 50 px in
    const holdSeconds = 0.3;
    let hands = [];
    let elapsed = 0;

    function reachIn(bullets, soul, side) {
      const from = HAND_FROM_SIDE[side];
      let x;
      let y;
      if (from.dx) {
        x = from.dx > 0 ? box.x + 3 : box.x + box.w - 3;
        y = clamp(soul.y + rand(-16, 16), box.y + 5, box.y + box.h - 5);
      } else {
        x = clamp(soul.x + rand(-16, 16), box.x + 5, box.x + box.w - 5);
        y = from.dy > 0 ? box.y + 3 : box.y + box.h - 3;
      }
      const shot = new Shot({
        x,
        y,
        vx: from.dx * lungeSpeed,
        vy: from.dy * lungeSpeed,
        accel: -slowing,
        art: from.art,
        warn: 0.6,
      });
      bullets.push(shot);
      hands.push({ shot, from, pullBack: 0, retracting: false, startSpeed: 0 });
    }

    const lunge = every(1.8, 2.2, (bullets, soul) => {
      const first = edge();
      reachIn(bullets, soul, first);
      if (elapsed > 3.5 && Math.random() < 0.25) {
        const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
        reachIn(bullets, soul, opposite[first]);
      }
    });

    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        elapsed += dt;
        lunge(dt, bullets, soul);
        for (const hand of hands) {
          const shot = hand.shot;
          // Remember how fast it lunged (after the fight's speed is applied).
          if (!hand.startSpeed) hand.startSpeed = Math.hypot(shot.vx, shot.vy);
          if (hand.retracting || shot.age < shot.warn) continue;
          if (Math.hypot(shot.vx, shot.vy) > 0) continue;
          hand.pullBack += dt;
          if (hand.pullBack < holdSeconds) continue;
          // Done grabbing: slide back out the way it came, still facing in.
          hand.retracting = true;
          shot.accel = 0;
          shot.vx = -hand.from.dx * hand.startSpeed * 0.6;
          shot.vy = -hand.from.dy * hand.startSpeed * 0.6;
          shot.life = shot.age - shot.warn + 1.2;
        }
        hands = hands.filter((hand) => !hand.retracting);
      },
    };
  },

  // The lanterns flicker. A lantern hangs at the edge of the box and a few
  // little standing stones stand about in it. When the lantern flickers, the
  // Duskling stretches: every stone's shadow shoots out across the box, away
  // from the light. Shadows always fall away from the lantern, so get on its
  // side of the stones. Then the lantern moves, and the shadows swing round.
  dusklingFlicker(box, density, { Shot, Line, rand, clamp, angleTo, shuffleBag }) {
    const spots = shuffleBag(['top', 'right', 'bottom', 'left']);
    const WARN = 0.9;
    let timer = 0.1;
    const flicker = (bullets, soul) => {
      const side = spots();
      const along = rand(14, 66);
      const lamp = side === 'top' ? { x: box.x + along, y: box.y + 3 }
        : side === 'bottom' ? { x: box.x + along, y: box.y + box.h - 3 }
          : side === 'left' ? { x: box.x + 3, y: box.y + along } : { x: box.x + box.w - 3, y: box.y + along };
      bullets.push(new Shot({ ...lamp, art: 'dusklingLantern', harmless: true, life: WARN + 0.9 }));
      // One stone stands between the lantern and you; the others somewhere
      // else, not too close to it or each other.
      const between = rand(0.4, 0.6);
      const stones = [{
        x: clamp(lamp.x + (soul.x - lamp.x) * between, box.x + 8, box.x + box.w - 8),
        y: clamp(lamp.y + (soul.y - lamp.y) * between, box.y + 8, box.y + box.h - 8),
      }];
      for (let tries = 0; stones.length < 3 && tries < 30; tries++) {
        const stone = { x: rand(box.x + 10, box.x + box.w - 10), y: rand(box.y + 10, box.y + box.h - 10) };
        const apart = stones.every((other) => Math.hypot(other.x - stone.x, other.y - stone.y) > 22);
        if (apart && Math.hypot(stone.x - lamp.x, stone.y - lamp.y) > 18) stones.push(stone);
      }
      for (const stone of stones) {
        bullets.push(new Shot({ ...stone, art: 'dusklingStone', harmless: true, life: WARN + 0.9 }));
        bullets.push(new Line({ x: stone.x, y: stone.y, angle: angleTo(lamp, stone), length: 120, thickness: 7, warn: WARN, grow: 260, life: 0.7, color: '#4a3478', glow: '#7a5cc0' }));
      }
    };
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        timer -= dt;
        if (timer <= 0) {
          timer += 2.1;
          flicker(bullets, soul);
        }
      },
    };
  },

  // Rows of thorny tendrils creep across the box from one wall, leaving one
  // gap to squeeze through. Then the next rows come the other way, crossways,
  // closing in like the bars of a cage.
  dusklingTendrilCage(box, density, { Shot, Line, every, rand, shuffleBag, spreadAcross }) {
    const startSide = shuffleBag([true, false]);
    const gapAlong = { width: spreadAcross(0, 1, 3), height: spreadAcross(0, 1, 3) };
    const spacing = 10;
    const gapWidth = 22;
    const warn = 0.85;
    const growSpeed = 160;
    let crossways = Math.random() < 0.5;
    const close = every(1.7, 2.0, (bullets) => {
      crossways = !crossways;
      const fromStart = startSide();
      const across = crossways ? box.w : box.h; // the side the bars are spread along
      const gapStart = 4 + (crossways ? gapAlong.width() : gapAlong.height()) * (across - gapWidth - 8);
      // The bars shift a little each time, so no spot is always safe.
      for (let offset = rand(2, spacing); offset < across - 1; offset += spacing) {
        if (offset > gapStart && offset < gapStart + gapWidth) continue;
        let x;
        let y;
        let angle;
        let length;
        if (crossways) {
          // Vertical bars, growing down from the top or up from the bottom.
          x = box.x + offset;
          y = fromStart ? box.y - 2 : box.y + box.h + 2;
          angle = fromStart ? Math.PI / 2 : -Math.PI / 2;
          length = box.h + 4;
        } else {
          // Horizontal bars, growing in from the left or the right.
          x = fromStart ? box.x - 2 : box.x + box.w + 2;
          y = box.y + offset;
          angle = fromStart ? 0 : Math.PI;
          length = box.w + 4;
        }
        bullets.push(new Line({ x, y, angle, length, thickness: 2, warn, grow: growSpeed, life: 0.7, color: '#7a5cc0', glow: '#2a1a48' }));
        bullets.push(new Shot({
          x,
          y,
          vx: Math.cos(angle) * growSpeed,
          vy: Math.sin(angle) * growSpeed,
          art: 'dusklingTendrilTip',
          harmless: true,
          warn,
          life: length / growSpeed,
        }));
      }
    });
    return { duration: 7, update: (dt, bullets) => close(dt, bullets) };
  },

  // Left behind. The Duskling lost its owner, so it tries you instead: it
  // sticks to you as your shadow, walking exactly where you walked a moment
  // ago. Keep moving and don't double back over your own path. It gets
  // impatient: the longer it follows, the closer behind you it walks, and
  // every so often its eyes flash and it lunges straight at where you are,
  // cutting the corner, before it slips back into your footsteps.
  dusklingFollow(box, density, { Shot }) {
    const WARN = 0.7;
    const LAG_FROM = 1.35;
    const LAG_TO = 0.8;
    const LENGTH = 7.4;
    const TELL = 0.45;
    const LUNGE = 0.4;
    let t = 0;
    let trail = [];
    let shadow = null;
    let nextLunge = WARN + LAG_FROM + 1.4;
    let lunge = null;
    // Where you were `ago` seconds back.
    const back = (ago) => {
      const when = t - ago;
      for (let i = trail.length - 1; i >= 0; i--) if (trail[i].t <= when) return trail[i];
      return trail[0];
    };
    return {
      duration: LENGTH,
      update: (dt, bullets, soul) => {
        t += dt;
        trail.push({ t, x: soul.x, y: soul.y });
        if (!shadow) {
          // A head and two trailing wisps of shadow, like a little figure.
          shadow = [0, 0.16, 0.32].map((extra, i) => {
            const piece = new Shot({ x: soul.x, y: soul.y, art: i ? 'dusklingWisp' : 'dusklingFollower', warn: WARN + LAG_FROM + extra });
            bullets.push(piece);
            return { piece, extra };
          });
        }
        const lag = LAG_FROM + (LAG_TO - LAG_FROM) * Math.min(t / (LENGTH * 0.8), 1);
        const head = shadow[0].piece;
        if (!lunge && t >= nextLunge && t < LENGTH - 1) {
          // Its eyes flash...
          lunge = { at: t };
          bullets.push(new Shot({ x: head.x, y: head.y - 6, art: 'dusklingEyeOpen', harmless: true, life: TELL }));
        }
        if (lunge && !lunge.from && t >= lunge.at + TELL) {
          // ...and it goes for where you are now.
          lunge.from = { x: head.x, y: head.y };
          // (Leading you a little, the way you're heading.)
          const was = back(0.15);
          lunge.to = { x: soul.x + (soul.x - was.x) * (LUNGE / 0.15), y: soul.y + (soul.y - was.y) * (LUNGE / 0.15) };
        }
        for (const { piece, extra } of shadow) {
          const at = back(lag + extra);
          if (lunge?.from) {
            // (The whole figure lunges, then eases back onto your path.)
            const k = Math.min((t - lunge.at - TELL) / LUNGE, 2);
            const out = k < 1 ? k : 2 - k;
            piece.x = at.x + (lunge.to.x - at.x) * out;
            piece.y = at.y + (lunge.to.y - at.y) * out;
          } else {
            piece.x = at.x;
            piece.y = at.y;
          }
        }
        if (lunge?.from && t >= lunge.at + TELL + LUNGE * 2) {
          lunge = null;
          nextLunge = t + 1.3;
        }
        trail = trail.filter((p) => p.t > t - LAG_FROM - 1);
      },
    };
  },
};
