import { defineBulletArt } from '../projectiles.js';

// The Bunting's attacks. It's a plump little bird wearing a string of party
// bunting, so everything it throws is a party: pennants strung in a row (with
// a gap), party poppers that go off in fans of confetti, balloons that rise
// and pop, streamers that wriggle after you, and chirps that wobble across
// the box as musical notes. It's the bright, silly end of Sunnyside: slow,
// colourful and easy to read, and every attack still goes where you stand.
//
// It stands to the right of the box, so everything comes in from the right
// edge. Each attack is a factory `(box, density, tools) => ({ duration,
// update })`; see dummy.js for the shape.

const COLORS = [
  { main: '#e8483c', dark: '#a82a28', light: '#ff9a8c' },
  { main: '#3c8cf0', dark: '#2458b0', light: '#9cc8ff' },
  { main: '#4cc86a', dark: '#2a8a44', light: '#a8f0b8' },
  { main: '#ff7ac8', dark: '#c0488e', light: '#ffc0e4' },
];
const STRING = '#8a6a3a';

// A pennant off the bunting string: a little triangle flag, four colours.
COLORS.forEach((c, i) => {
  defineBulletArt(`buntFlag${i}`, {
    frames: [
      ['ssssss', 'mmmmmm', 'mllmmd', '.mmmd.', '..md..', '...d..'],
      ['ssssss', 'mmmmmm', 'mmllmd', '.mmmmd', '..mdd.', '...d..'],
    ],
    palette: { s: STRING, m: c.main, d: c.dark, l: c.light },
    radius: 2.6,
    frameSeconds: 0.25,
  });
  // A bit of confetti: a twinkling square.
  defineBulletArt(`buntConfetti${i}`, {
    frames: [['mm', 'ml'], ['ml', 'dm']],
    palette: { m: c.main, d: c.dark, l: c.light },
    radius: 1.2,
    frameSeconds: 0.12,
  });
});

// A balloon: round, shiny, with a knot and a bit of string.
[0, 1].forEach((i) => {
  const c = COLORS[i];
  defineBulletArt(`buntBalloon${i}`, {
    frames: [[
      '..mmm..',
      '.mmmmm.',
      'mlllmmm',
      'mllmmmd',
      'mmmmmmd',
      '.mmmmd.',
      '..mdd..',
      '...d...',
      '...s...',
      '..s....',
    ]],
    palette: { m: c.main, d: c.dark, l: c.light, s: '#e8e0d0' },
    radius: 3.1,
    hitbox: null,
  });
});

// A party popper, about to go off (harmless): a cone with a twist of paper.
defineBulletArt('buntPopper', {
  frames: [
    ['..y.y..', '...y...', '..ooo..', '.ooroo.', '.orooo.', '..ooo..', '...o...'],
    ['.y.y.y.', '..yyy..', '..ooo..', '.ooroo.', '.orooo.', '..ooo..', '...o...'],
  ],
  palette: { o: '#e8a23c', r: '#e8483c', y: '#fff6a8' },
  radius: 1,
  rotate: false,
  frameSeconds: 0.1,
});

// A streamer: a curl of coloured paper, drawn pointing right, that wriggles.
COLORS.forEach((c, i) => {
  defineBulletArt(`buntStreamer${i}`, {
    frames: [
      ['..mm....', '.mmmm.mm', 'mm..mmmm', '.....mm.'],
      ['.mm.....', 'mmmmm.mm', '..mmmmm.', '...mm...'],
    ],
    palette: { m: c.main },
    radius: 2.2,
    rotate: true,
    frameSeconds: 0.12,
  });
});

// A chirp: a musical note, drawn upright.
defineBulletArt('buntNote', {
  frames: [
    ['...nn', '...nnn', '...n.n', '...n..', '...n..', '.nnn..', 'nnnn..', '.nn...'],
    ['...nn', '...nnn', '...n.n', '...n..', '...n..', 'nnn...', 'nnnn..', '.nn...'],
  ],
  palette: { n: '#f08a1c' },
  radius: 2.2,
  frameSeconds: 0.3,
});

// A twinkle (harmless) to say where something is about to happen.
defineBulletArt('buntTwinkle', {
  frames: [
    ['..g..', '..g..', 'ggwgg', '..g..', '..g..'],
    ['.g.g.', '..g..', '.gwg.', '..g..', '.g.g.'],
  ],
  palette: { g: '#fff6a8', w: '#ffffff' },
  radius: 1,
  frameSeconds: 0.12,
});

export const BUNTING_ATTACKS = {
  // Pennants: a string of flags comes in from the right, hung down the box
  // with a gap in it (never where you're standing). Three strings, each a
  // little faster, each with its gap somewhere else.
  buntFlags(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let waves = 0;
    let next = 0.2;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || waves >= 3 || t > 4.8) return;
        next = t + 1.55;
        const flip = Math.random() < 0.5 ? -1 : 1;
        const gapY = clamp(soul.y + flip * rand(20, 32), box.y + 10, box.y + box.h - 10);
        const speed = 44 + waves * 7;
        const x = box.x + box.w + 8;
        for (let y = box.y + 3; y < box.y + box.h; y += 6.5) {
          if (Math.abs(y - gapY) < 13) continue;
          const bullet = new Shot({ x, y, vx: -speed, art: `buntFlag${waves % COLORS.length}`, life: 5, wobble: { amplitude: 1.4, frequency: 5 } });
          bullets.push(bullet);
        }
        waves++;
      },
    };
  },

  // Poppers: a party popper pops up at the edge of the box, twirls, and goes
  // off, throwing a fan of confetti at where you stand. The confetti slows,
  // and drifts down.
  buntPop(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let count = 0;
    let next = 0.2;
    let poppers = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && count < 4 && t < 4.6) {
          count++;
          next = t + 1.2;
          const side = count % 2 === 0 ? 'top' : 'right';
          const at = side === 'top'
            ? { x: clamp(soul.x + rand(-26, 26), box.x + 10, box.x + box.w - 10), y: box.y + 4 }
            : { x: box.x + box.w - 4, y: clamp(soul.y + rand(-22, 22), box.y + 10, box.y + box.h - 10) };
          bullets.push(new Shot({ x: at.x, y: at.y, harmless: true, life: 0.9, art: 'buntPopper' }));
          poppers.push({ at: t + 0.9, pos: at });
        }
        for (const p of poppers) {
          if (t < p.at) continue;
          p.done = true;
          const aim = Math.atan2(soul.y - p.pos.y, soul.x - p.pos.x);
          for (let i = 0; i < 11; i++) {
            const a = aim + (i - 5) * 0.14 + rand(-0.04, 0.04);
            const sp = rand(70, 105);
            bullets.push(new Shot({ x: p.pos.x, y: p.pos.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, accel: -42, gravity: 10, art: `buntConfetti${i % COLORS.length}`, life: 2.6 }));
          }
        }
        poppers = poppers.filter((p) => !p.done);
      },
    };
  },

  // Balloons: balloons drift up from the floor of the box, wobbling, and pop
  // somewhere on the way up, dropping a handful of confetti. The spot they
  // pop at flashes a twinkle first.
  buntBalloons(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let count = 0;
    let next = 0.2;
    let balloons = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && count < 6 && t < 4.4) {
          count++;
          next = t + 0.75;
          const x = clamp(soul.x + rand(-22, 22), box.x + 8, box.x + box.w - 8);
          const popY = clamp(soul.y + rand(-10, 10), box.y + 14, box.y + box.h - 16);
          const b = new Shot({ x, y: box.y + box.h + 6, vy: -40, warn: 0.5, art: `buntBalloon${count % 2}`, life: 6, wobble: { amplitude: 4, frequency: 3 } });
          b.popY = popY;
          balloons.push(b);
          bullets.push(b);
          bullets.push(new Shot({ x, y: popY, harmless: true, life: 1.6, art: 'buntTwinkle' }));
        }
        for (const b of balloons) {
          if (b.age < b.warn || b.y > b.popY) continue;
          b.popped = true;
          b.life = 0.001;
          for (let i = 0; i < 7; i++) {
            const a = (i / 7) * Math.PI * 2 + rand(-0.2, 0.2);
            const sp = rand(30, 52);
            bullets.push(new Shot({ x: b.x, y: b.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, accel: -18, gravity: 14, art: `buntConfetti${i % COLORS.length}`, life: 1.8 }));
          }
        }
        balloons = balloons.filter((b) => !b.popped);
      },
    };
  },

  // Streamers: coloured paper streamers are let go from its beak and wriggle
  // after you, turning slowly, so they have to be led round and round the box.
  buntStreamers(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let count = 0;
    let next = 0.3;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || count >= 6 || t > 4.8) return;
        count++;
        next = t + 0.85;
        // Most come off the right, level with you; every third one drops in
        // from above or below, over you, so no corner is out of the way.
        const level = count % 3 === 0;
        const fromTop = soul.y > box.y + box.h / 2 ? false : true;
        const from = level
          ? { x: clamp(soul.x + rand(-20, 20), box.x + 8, box.x + box.w - 8), y: fromTop ? box.y - 4 : box.y + box.h + 4 }
          : { x: box.x + box.w + 4, y: clamp(soul.y + rand(-22, 22), box.y + 8, box.y + box.h - 8) };
        const away = level ? (fromTop ? Math.PI / 2 : -Math.PI / 2) : Math.PI;
        bullets.push(new Shot({
          x: from.x, y: from.y, vx: Math.cos(away) * 48, vy: Math.sin(away) * 48, art: `buntStreamer${count % COLORS.length}`, life: 4,
          homing: { target: soul, turn: 1.3 }, wobble: null,
        }));
      },
    };
  },

  // Chirp: it sings, and the notes wobble across the box in rows, each row
  // wobbling the other way from the last. The rows are laid out around
  // wherever you are, one of them right at you. There's a pause (a rest) in
  // one of the rows next to yours each time, so that's where to go.
  buntChirp(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let waves = 0;
    let next = 0.2;
    // Notes waiting their turn to come in from the right, a beat apart.
    let queue = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && waves < 3 && t < 4.6) {
          next = t + 1.9;
          const rows = [];
          for (let k = -2; k <= 2; k++) {
            const y = soul.y + k * 18 + (k === 0 ? 0 : rand(-3, 3));
            if (y > box.y + 5 && y < box.y + box.h - 5) rows.push({ y, k });
          }
          const restK = Math.random() < 0.5 ? -1 : 1;
          rows.forEach((row, r) => {
            const phase = r % 2 === 0 ? 1 : -1;
            for (let i = 0; i < 7; i++) {
              // The rest: two notes left out.
              if (row.k === restK && (i === 3 || i === 4)) continue;
              queue.push({ at: t + i * 0.3, y: row.y, phase, i });
            }
          });
          waves++;
        }
        for (const note of queue) {
          if (t < note.at) continue;
          note.done = true;
          const bullet = new Shot({
            x: box.x + box.w + 8, y: note.y, vx: -40, art: 'buntNote', life: 8,
            wobble: { amplitude: 6 * note.phase, frequency: 3.2 },
          });
          // Start each part-way through its wobble, so the notes in a row
          // aren't all up or all down when they reach you.
          bullet.age = note.i * 0.5;
          bullets.push(bullet);
        }
        queue = queue.filter((note) => !note.done);
      },
    };
  },
};
