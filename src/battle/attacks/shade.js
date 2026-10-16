import { defineBulletArt } from '../projectiles.js';

// The Shade's attacks. It's a shadow that got left behind, so everything it
// throws is made of the dark: eyes that open in the walls and stare, hands that
// reach in to grab you, crescents of shadow, tendrils that close in like a
// cage, and little wisps of itself that follow you for a while.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// `tools` holds the bullet classes and helpers (see PATTERN_TOOLS in
// src/battle/bullets.js).

const SHADE_COLOURS = {
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
defineBulletArt('shadeEyeShut', {
  frames: [[
    '.......',
    '.LLLLL.',
    'L.....L',
  ]],
  palette: SHADE_COLOURS,
  radius: 3,
});

defineBulletArt('shadeEyeOpen', {
  frames: [[
    '..LLL..',
    '.LsesL.',
    'LseEesL',
    '.LsesL.',
    '..LLL..',
  ]],
  palette: SHADE_COLOURS,
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
defineBulletArt('shadeHandRight', { frames: [HAND_REACHING_RIGHT], palette: SHADE_COLOURS, radius: 3 });
defineBulletArt('shadeHandDown', { frames: [HAND_REACHING_DOWN], palette: SHADE_COLOURS, radius: 3 });
defineBulletArt('shadeHandLeft', { frames: [HAND_REACHING_LEFT], palette: SHADE_COLOURS, radius: 3 });
defineBulletArt('shadeHandUp', { frames: [HAND_REACHING_UP], palette: SHADE_COLOURS, radius: 3 });

// A crescent blade of shadow, spinning.
defineBulletArt('shadeCrescent', {
  frames: [[
    '..LLL..',
    '.LSs...',
    'LSs....',
    'LSs....',
    'LSs....',
    '.LSs...',
    '..LLL..',
  ]],
  palette: SHADE_COLOURS,
  radius: 2.5,
  spin: 7,
});

// The thorny tip of a tendril, riding the front of it as it grows (harmless
// itself; the tendril behind it is what hurts).
defineBulletArt('shadeTendrilTip', {
  frames: [[
    'L.L..',
    '.SSL.',
    'SSSSe',
    '.SSL.',
    'L.L..',
  ]],
  palette: SHADE_COLOURS,
  radius: 2,
  rotate: true,
});

// A little wisp of the shade, with its eyes, its tail wriggling.
defineBulletArt('shadeWisp', {
  frames: [
    ['.LLLL.', 'LsssSL', 'LeSeSL', 'LsssSL', 'Ls.sL.', 'L...L.'],
    ['.LLLL.', 'LsssSL', 'LeSeSL', 'LsssSL', '.Ls.sL', '.L...L'],
  ],
  palette: SHADE_COLOURS,
  radius: 2.5,
  frameSeconds: 0.18,
});

// Which hand art reaches in from each side of the box.
const HAND_FROM_SIDE = {
  left: { art: 'shadeHandRight', dx: 1, dy: 0 },
  right: { art: 'shadeHandLeft', dx: -1, dy: 0 },
  top: { art: 'shadeHandDown', dx: 0, dy: 1 },
  bottom: { art: 'shadeHandUp', dx: 0, dy: -1 },
};

export const SHADE_ATTACKS = {
  // Eyes open along the walls of the box. Each one blinks awake, looks at
  // you, and a moment later stares a beam straight through where you were.
  // The flashing preview shows the beam's path; step off it.
  shadeWatchingEyes(box, density, { Shot, Line, every, rand, pick, angleTo }) {
    const shutSeconds = 0.4;
    const stareWarn = 0.55;
    let waking = [];
    const openEye = every(0.85, 1.15, (bullets) => {
      const side = pick(['top', 'left', 'right', 'bottom']);
      let x;
      let y;
      if (side === 'top' || side === 'bottom') {
        x = rand(box.x + 10, box.x + box.w - 10);
        y = side === 'top' ? box.y + 4 : box.y + box.h - 4;
      } else {
        x = side === 'left' ? box.x + 4 : box.x + box.w - 4;
        y = rand(box.y + 10, box.y + box.h - 10);
      }
      bullets.push(new Shot({ x, y, art: 'shadeEyeShut', harmless: true, life: shutSeconds }));
      waking.push({ x, y, t: shutSeconds });
    });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        openEye(dt, bullets);
        for (const eye of waking) {
          eye.t -= dt;
          if (eye.t > 0) continue;
          bullets.push(new Shot({ x: eye.x, y: eye.y, art: 'shadeEyeOpen', harmless: true, life: stareWarn + 0.4 }));
          bullets.push(new Line({
            x: eye.x,
            y: eye.y,
            angle: angleTo(eye, soul),
            length: 130,
            thickness: 3,
            warn: stareWarn,
            life: 0.35,
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
  shadeGraspingHands(box, density, { Shot, every, rand, pick, clamp }) {
    const lungeSpeed = 150;
    const slowing = 260; // the hand stops about 43 px in
    const holdSeconds = 0.3;
    let hands = [];
    let elapsed = 0;

    function reachIn(bullets, soul, side) {
      const from = HAND_FROM_SIDE[side];
      let x;
      let y;
      if (from.dx) {
        x = from.dx > 0 ? box.x + 3 : box.x + box.w - 3;
        y = clamp(soul.y + rand(-4, 4), box.y + 5, box.y + box.h - 5);
      } else {
        x = clamp(soul.x + rand(-4, 4), box.x + 5, box.x + box.w - 5);
        y = from.dy > 0 ? box.y + 3 : box.y + box.h - 3;
      }
      const shot = new Shot({
        x,
        y,
        vx: from.dx * lungeSpeed,
        vy: from.dy * lungeSpeed,
        accel: -slowing,
        art: from.art,
        warn: 0.45,
      });
      bullets.push(shot);
      hands.push({ shot, from, pullBack: 0, retracting: false, startSpeed: 0 });
    }

    const lunge = every(0.85, 1.15, (bullets, soul) => {
      const sides = ['top', 'left', 'right', 'bottom'];
      const first = pick(sides);
      reachIn(bullets, soul, first);
      if (elapsed > 3 && Math.random() < 0.5) {
        const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
        reachIn(bullets, soul, opposite[first]);
      }
    });

    return {
      duration: 6.5,
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
          shot.vx = -hand.from.dx * hand.startSpeed * 0.45;
          shot.vy = -hand.from.dy * hand.startSpeed * 0.45;
          shot.life = shot.age - shot.warn + 1.2;
        }
        hands = hands.filter((hand) => !hand.retracting);
      },
    };
  },

  // Crescents of shadow are flung in from the edges, slow at first, then
  // pick up speed while their path bends, so they sweep around instead of
  // flying straight. Each one curves the opposite way to the last.
  shadeCrescentBlades(box, density, { Shot, every, rand, edgePoint, angleTo }) {
    let crescents = [];
    let bendWay = 1;
    const fling = every(0.45, 0.65, (bullets, soul) => {
      const start = edgePoint(box);
      const bend = bendWay * rand(1.3, 1.8); // radians per second
      bendWay = -bendWay;
      // Aim to one side of the soul so the bend carries it back across.
      const aim = angleTo(start, soul) - bend * 0.4;
      const shot = new Shot({
        x: start.x,
        y: start.y,
        vx: Math.cos(aim) * 38,
        vy: Math.sin(aim) * 38,
        accel: 55,
        art: 'shadeCrescent',
        warn: 0.35,
      });
      bullets.push(shot);
      crescents.push({ shot, bend });
    });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        fling(dt, bullets, soul);
        for (const crescent of crescents) {
          const shot = crescent.shot;
          if (shot.age < shot.warn) continue;
          const turn = crescent.bend * dt;
          const vx = shot.vx * Math.cos(turn) - shot.vy * Math.sin(turn);
          const vy = shot.vx * Math.sin(turn) + shot.vy * Math.cos(turn);
          shot.vx = vx;
          shot.vy = vy;
        }
        crescents = crescents.filter((crescent) => !crescent.shot.isGone(box));
      },
    };
  },

  // Rows of thorny tendrils creep across the box from one wall, leaving one
  // gap to squeeze through. Then the next rows come the other way, crossways,
  // closing in like the bars of a cage.
  shadeTendrilCage(box, density, { Shot, Line, every, rand, pick }) {
    const spacing = 10;
    const gapWidth = 22;
    const warn = 0.75;
    const growSpeed = 190;
    let crossways = Math.random() < 0.5;
    const close = every(1.45, 1.75, (bullets) => {
      crossways = !crossways;
      const fromStart = pick([true, false]);
      const across = crossways ? box.w : box.h; // the side the bars are spread along
      const gapStart = rand(4, across - gapWidth - 4);
      for (let offset = 5; offset < across; offset += spacing) {
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
        bullets.push(new Line({ x, y, angle, length, thickness: 2, warn, grow: growSpeed, life: 0.75, color: '#7a5cc0', glow: '#2a1a48' }));
        bullets.push(new Shot({
          x,
          y,
          vx: Math.cos(angle) * growSpeed,
          vy: Math.sin(angle) * growSpeed,
          art: 'shadeTendrilTip',
          harmless: true,
          warn,
          life: length / growSpeed,
        }));
      }
    });
    return { duration: 7, update: (dt, bullets) => close(dt, bullets) };
  },

  // Little wisps of the shade peel off the walls and drift after you, but
  // they lose interest after a moment and wander off the way they're facing,
  // speeding up. Lead them away, then slip aside.
  shadeLostWisps(box, density, { Shot, every, edgePoint, angleTo }) {
    const followSeconds = 1.2;
    let wisps = [];
    const peel = every(0.6, 0.85, (bullets, soul) => {
      const start = edgePoint(box);
      const aim = angleTo(start, soul);
      const shot = new Shot({
        x: start.x,
        y: start.y,
        vx: Math.cos(aim) * 46,
        vy: Math.sin(aim) * 46,
        art: 'shadeWisp',
        warn: 0.4,
        homing: { target: soul, turn: 2.4 },
      });
      bullets.push(shot);
      wisps.push(shot);
    });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        peel(dt, bullets, soul);
        for (const shot of wisps) {
          if (shot.age < shot.warn + followSeconds) continue;
          // Bored now: stop following and drift away, faster.
          shot.homing = null;
          shot.accel = 45;
        }
        wisps = wisps.filter((shot) => shot.homing);
      },
    };
  },
};
