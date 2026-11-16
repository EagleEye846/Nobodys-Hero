import { defineBulletArt } from '../projectiles.js';

// The Siltling's attacks. It's fifty years of drain silt under Hollin's well,
// and everything that ever went down the well is in it somewhere: thimbles,
// buttons, pennies, keys, spoons. So it fights with its collection (showing
// it off, counting its buttons and losing its place, wanting yours) and with
// itself: the whole of it sinking into a puddle and coming up somewhere
// else.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const MUD = '#6a5e52';
const MUD_GLOW = '#8a7e70';
const SILT = { s: '#6a5e52', S: '#4a4038', l: '#8a7e70', w: '#b8b0a2', k: '#14101c' };

// Its collection. A red coat button with four holes (spinning), a silver
// thimble, a copper penny (spinning), a brass key and a spoon (both drawn
// pointing right, turning to fly point first).
defineBulletArt('siltButton', {
  frames: [['.bbb.', 'bhbhb', 'bbbbb', 'bhbhb', '.bbb.']],
  palette: { b: '#c8524a', h: '#2a1418' },
  radius: 2.2,
  spin: 5,
});
defineBulletArt('siltThimble', {
  frames: [['.ttt.', 'tTtTt', 'ttwtt', 'tTtTt', 'TTTTT']],
  palette: { t: '#c0c0cc', T: '#7a7a8c', w: '#ffffff' },
  radius: 2.2,
});
defineBulletArt('siltPenny', {
  frames: [['.ppp.', 'ppPpp', 'pPwPp', 'ppPpp', '.ppp.']],
  palette: { p: '#d08a40', P: '#8a4a22', w: '#ffd8a0' },
  radius: 2.2,
  spin: 3,
});
defineBulletArt('siltKey', {
  frames: [['yy.....', 'y.yyyyy', 'yy..y.y']],
  palette: { y: '#d8b04a' },
  hitbox: { w: 6, h: 3 },
  rotate: true,
});
defineBulletArt('siltSpoon', {
  frames: [['.....mm.', 'mmmmmmwm', '.....mm.']],
  palette: { m: '#c8c8d4', w: '#ffffff' },
  hitbox: { w: 7, h: 3 },
  rotate: true,
});

// A drop of muddy water, and a clod.
defineBulletArt('siltDrop', {
  frames: [['.l.', 'sls', 'sSs', '.S.']],
  palette: SILT,
  radius: 1.5,
});
defineBulletArt('siltClod', {
  frames: [['.sss.', 'slsSs', 'ssSss', '.SSS.']],
  palette: SILT,
  radius: 2.2,
  spin: 3,
});

// A puddle, where it's about to come up (harmless: only a warning), and the
// Siltling itself, rising out of it, button eyes and all.
defineBulletArt('siltPuddle', {
  frames: [['..sssssss..', '.sSSSSSSSs.', 'ssSllSSSSss', '.sSSSSSSSs.', '..sssssss..']],
  palette: SILT,
  radius: 4,
});
defineBulletArt('siltMound', {
  frames: [[
    '...kkkkk...',
    '..kslllsk..',
    '.kssssssk..',
    '.kbkssbksk.',
    'kssssssssk.',
    'ksssssssssk',
    'kSSSSSSSSSk',
    '.kkkkkkkkk.',
  ]],
  palette: { ...SILT, b: '#c8524a' },
  radius: 4.5,
});

// A button counted, jumping up out of the silt.
defineBulletArt('siltButtonUp', {
  frames: [['.kkkk.', 'kwllwk', 'klhlhk', 'klhlhk', 'kwllwk', '.kkkk.']],
  palette: { k: '#2a1418', w: '#e87a72', l: '#c8524a', h: '#2a1418' },
  radius: 3,
});

const TREASURES = ['siltButton', 'siltThimble', 'siltPenny', 'siltKey', 'siltSpoon'];

export const SILTLING_ATTACKS = {
  // Have a look at THIS: it shows off its collection, flinging things up
  // from the top corners so they arc over and come down where you are (or
  // near enough). Buttons, thimbles, pennies, keys, spoons: never the same
  // one twice running.
  siltFling(box, density, { Shot, every, rand, clamp, shuffleBag }) {
    const treasure = shuffleBag(TREASURES);
    const side = shuffleBag(['left', 'right']);
    const fling = every(0.32, 0.44, (bullets, soul) => {
      const fromLeft = side() === 'left';
      const x = fromLeft ? box.x + 4 : box.x + box.w - 4;
      const y = box.y + 2;
      // Where it means it to land: near you, a little either way.
      const target = clamp(soul.x + rand(-14, 14), box.x + 6, box.x + box.w - 6);
      const flight = rand(0.9, 1.2);
      const gravity = 110;
      bullets.push(new Shot({
        x, y, warn: 0.25,
        vx: (target - x) / flight,
        vy: (soul.y - y - 0.5 * gravity * flight * flight) / flight,
        gravity, art: treasure(),
      }));
    });
    return {
      duration: 8,
      update: (dt, bullets, soul) => fling(dt, bullets, soul),
    };
  },

  // Counting: its buttons are laid out in the silt in rows, and it counts
  // them, out loud, the way you read: along each row, left to right, then
  // the next row down. Each one it counts jumps up out of the silt (it
  // blinks first) and flicks mud off. It always gets to eleven, loses its
  // place, and starts again from somewhere else. Keep ahead of the count.
  siltCount(box, density, { Shot, rand }) {
    const COLS = 4;
    const ROWS = 3;
    const spots = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) spots.push({ x: box.x + 13 + c * 18, y: box.y + 16 + r * 24 });
    let laid = false;
    let t = 0;
    let at = Math.floor(rand(0, spots.length));
    let counted = 0;
    let next = 0.6;
    return {
      duration: 8,
      update: (dt, bullets) => {
        t += dt;
        if (!laid) {
          laid = true;
          for (const spot of spots) bullets.push(new Shot({ x: spot.x, y: spot.y, harmless: true, life: 9, art: 'siltButton' }));
        }
        if (t < next || t > 9.8) return;
        if (counted >= 11) {
          // Eleven... twelve? It's lost its place. Start again.
          counted = 0;
          at = Math.floor(rand(0, spots.length));
          next = t + 0.6;
          return;
        }
        const spot = spots[at];
        bullets.push(new Shot({ x: spot.x, y: spot.y, warn: 0.35, life: 0.55, art: 'siltButtonUp' }));
        for (let k = 0; k < 4; k++) {
          const a = Math.PI / 4 + (k * Math.PI) / 2;
          bullets.push(new Shot({ x: spot.x, y: spot.y, vx: Math.cos(a) * 34, vy: Math.sin(a) * 34, warn: 0.35, life: 0.9, art: 'siltDrop' }));
        }
        at = (at + 1) % spots.length;
        counted++;
        next = t + 0.26;
      },
    };
  },

  // Down it goes, into a puddle, and up it comes somewhere else. Each time,
  // a puddle spreads first (that's where), then the Siltling heaves up out
  // of it and shakes itself, and muddy drops fly off all round. Then it
  // sinks again. The puddles creep after you.
  siltSink(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let rises = 0;
    let next = 0.1;
    const warn = 0.75;
    const up = 0.7;
    const rise = (bullets, soul) => {
      const x = clamp(soul.x + rand(-18, 18), box.x + 10, box.x + box.w - 10);
      const y = clamp(soul.y + rand(-18, 18), box.y + 10, box.y + box.h - 10);
      bullets.push(new Shot({ x, y: y + 3, harmless: true, life: warn + up, art: 'siltPuddle' }));
      const mound = new Shot({ x, y, warn, life: up, art: 'siltMound' });
      bullets.push(mound);
      // As it comes up, the drops fly off it in a ring (every other ring
      // turned half a step, so the same spot isn't safe twice).
      const drops = 8;
      const turn = rises % 2 ? Math.PI / drops : 0;
      for (let i = 0; i < drops; i++) {
        const a = turn + (i / drops) * Math.PI * 2;
        bullets.push(new Shot({ x, y, warn: warn + 0.1, vx: Math.cos(a) * 50, vy: Math.sin(a) * 50, life: 2, art: 'siltDrop' }));
      }
      rises++;
    };
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 8.4) {
          rise(bullets, soul);
          next = t + 1.1;
        }
      },
    };
  },

  // Mine: it wants something of yours. Fingers of mud reach up out of the
  // floor of the box toward wherever you are (a faint line first, then the
  // grab), two at a time from different places, and where each one grabs it
  // leaves a clod that drops back down.
  siltGrab(box, density, { Shot, Line, every, rand, angleTo, spreadAcross }) {
    const nextX = spreadAcross(box.x + 6, box.x + box.w - 6, 5);
    const grab = every(0.62, 0.78, (bullets, soul) => {
      for (let i = 0; i < 2; i++) {
        const from = { x: nextX(), y: box.y + box.h + 2 };
        const aim = { x: soul.x + rand(-6, 6), y: soul.y + rand(-6, 6) };
        const angle = angleTo(from, aim);
        const length = Math.hypot(aim.x - from.x, aim.y - from.y) + 8;
        bullets.push(new Line({
          x: from.x, y: from.y, angle, length, thickness: 3, warn: 0.6, life: 0.45, grow: 260,
          color: MUD, glow: MUD_GLOW,
        }));
        // The clod it was holding, let go at the end of the grab.
        const end = { x: from.x + Math.cos(angle) * (length - 4), y: from.y + Math.sin(angle) * (length - 4) };
        bullets.push(new Shot({ x: end.x, y: end.y, warn: 1.05, vy: -20, gravity: 150, life: 2, art: 'siltClod' }));
      }
    }, { first: 0.2 });
    return {
      duration: 8,
      update: (dt, bullets, soul) => grab(dt, bullets, soul),
    };
  },
};
