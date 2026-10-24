import { defineBulletArt } from '../projectiles.js';

// The Herald's Echo's attacks. It's the ghost of a town crier who still
// walks the empty streets of the old city crying that the Hero is coming,
// so it fights with its news: WORDS. The letters of its proclamation fly
// at you in long wavy ribbons, rows of them come down with the gaps
// between the words to slip through, and when it shouts a word at you its
// echo comes after it (and the echo's echo). And with its things: rings of
// sound off its hand bell, and its scroll, unrolling across the box.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. Its `density` is high, so its own clock
// (`t`) runs fast: about 9 of it fits in a turn.

// Its letters: a little blocky alphabet, 5 pixels square, with an outline
// added round each one when it's turned into bullet art below. Only the
// letters its words need are here; add more the same way. (The Warden of
// the Gate carves its prophecy in these letters too: attacks/warden.js.)
export const FONT = {
  A: ['.###.', '#...#', '#####', '#...#', '#...#'],
  C: ['.####', '#....', '#....', '#....', '.####'],
  D: ['####.', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '####.', '#....', '#####'],
  G: ['.####', '#....', '#..##', '#...#', '.###.'],
  H: ['#...#', '#...#', '#####', '#...#', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '#####'],
  L: ['#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '.###.'],
  R: ['####.', '#...#', '####.', '#..#.', '#...#'],
  S: ['.####', '#....', '.###.', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..'],
  W: ['#...#', '#...#', '#.#.#', '##.##', '#...#'],
  Y: ['#...#', '.#.#.', '..#..', '..#..', '..#..'],
  '!': ['..#..', '..#..', '..#..', '.....', '..#..'],
};

// What it cries. HEAR YE flies in ribbons; the PROCLAMATION comes down in
// rows (the spaces are the gaps you slip through); it SHOUTS the short ones.
const RIBBONS = ['HEAR YE', 'HEAR YE', 'THE HERO COMES', 'ALL HAIL'];
const PROCLAMATION = ['HEAR YE', 'THE HERO', 'IS COMING', 'ANY DAY', 'NOW', 'WELCOME', 'HOME HERO'];
const SHOUTS = ['HERO!', 'HAIL!', 'SOON!', 'HEAR!', 'COME!'];

// Its letters, bright gold (like the trim on its tabard), and its echo's,
// fainter and bluer.
const LETTER = { k: '#2a1e4a', w: '#f4e4b0' };
const ECHO_LETTER = { k: 'rgba(42, 30, 74, 0.55)', w: 'rgba(190, 204, 240, 0.7)' };
const RING = { y: '#f0e0a0', Y: '#c8b060' };
const BELL = { k: '#1e1a3a', b: '#e0c878', B: '#a08840', f: '#c8d4f0' };
const SCROLL = { k: '#3a2e1e', p: '#f0e8d0', P: '#c8bca0' };
const SCROLL_COLOR = '#e8dcb8';

// A letter, with a one-pixel outline round it so it reads on anything.
function outlined(glyph) {
  const w = glyph[0].length + 2;
  const h = glyph.length + 2;
  const filled = (x, y) => glyph[y - 1]?.[x - 1] === '#';
  const rows = [];
  for (let y = 0; y < h; y++) {
    let row = '';
    for (let x = 0; x < w; x++) {
      if (filled(x, y)) row += 'w';
      else if ([[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]].some(([dx, dy]) => filled(x + dx, y + dy))) row += 'k';
      else row += '.';
    }
    rows.push(row);
  }
  return rows;
}

for (const [char, glyph] of Object.entries(FONT)) {
  const frame = outlined(glyph);
  defineBulletArt(`heraldLetter${char}`, { frames: [frame], palette: LETTER, radius: 2.6 });
  defineBulletArt(`heraldEcho${char}`, { frames: [frame], palette: ECHO_LETTER, radius: 2.6 });
}
const letterArt = (char, echo = false) => `herald${echo ? 'Echo' : 'Letter'}${char}`;

// A ring of sound off the bell: an arc, drawn facing right (outward).
defineBulletArt('heraldRing', {
  frames: [['y..', '.Y.', '.yY', '.Y.', 'y..']],
  palette: RING,
  radius: 1.8,
  rotate: true,
});

// Its hand bell (harmless), swinging as it rings, with its paw on the handle.
defineBulletArt('heraldBellSwing', {
  frames: [
    ['...ff..', '...kk..', '..kbbk.', '.kbbbBk', '.kbbbBk', 'kbbbbbBk', 'kkkkkkkk', '...kb...'].map((row) => row.padEnd(8, '.')),
    ['..ff...', '..kk...', '.kbbk..', 'kbbbBk.', 'kbbbBk.', 'kbbbbbBk', 'kkkkkkkk', '....kb..'].map((row) => row.padEnd(8, '.')),
  ],
  palette: BELL,
  radius: 1,
  frameSeconds: 0.22,
});

// The rolled-up end of its scroll, riding the edge as it unrolls.
defineBulletArt('heraldScrollEnd', {
  frames: [['.kk.', 'kppk', 'kpPk', 'kppk', 'kpPk', 'kppk', 'kpPk', '.kk.']],
  palette: SCROLL,
  hitbox: { w: 4, h: 8 },
});

// The same, lying the other way, for a scroll unrolling downward.
defineBulletArt('heraldScrollEndDown', {
  frames: [['.kkkkkk.', 'kppPpPpk', 'kpPpPpPk', '.kkkkkk.']],
  palette: SCROLL,
  hitbox: { w: 8, h: 4 },
});

// Letters laid out along a line, starting at (x, y), each `gap` apart.
// Spaces leave a gap and make no bullet.
function spell(Shot, text, x, y, gap, extra = {}, echo = false) {
  const shots = [];
  [...text].forEach((char, i) => {
    if (char === ' ' || !FONT[char]) return;
    const shot = new Shot({ x: x + i * gap, y, art: letterArt(char, echo), ...extra });
    shot.offset = i * gap;
    shots.push(shot);
  });
  return shots;
}

export const HERALDS_ECHO_ATTACKS = {
  // Hear ye: its words come flying in across the box, a letter at a time,
  // in a long wavy ribbon (each letter follows the one before). Then the
  // next line comes, at a different height.
  heraldHearYe(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let line = 0;
    let queue = [];
    let nextLetter = 0.1;
    let y = 0;
    let fromRight = true;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!queue.length && t >= nextLetter && t < 7.8) {
          queue = [...RIBBONS[line % RIBBONS.length]];
          fromRight = line % 2 === 0;
          line++;
          y = clamp(soul.y + rand(-6, 6), box.y + 14, box.y + box.h - 14);
        }
        if (queue.length && t >= nextLetter) {
          const char = queue.shift();
          nextLetter = t + 0.11;
          if (FONT[char]) {
            bullets.push(new Shot({
              x: fromRight ? box.x + box.w + 6 : box.x - 6, y,
              vx: fromRight ? -56 : 56,
              wobble: { amplitude: 12, frequency: 4 },
              art: letterArt(char),
            }));
          }
          // A breath between lines.
          if (!queue.length) nextLetter = t + 0.55;
        }
      },
    };
  },

  // The bell: it rings its hand bell over the box, and every ring sends a
  // ring of sound spreading down through it, with one gap in it. The bell
  // moves along between rings.
  heraldBell(box, density, { Shot, rand, pick }) {
    let t = 0;
    let next = 0.35;
    let bell = null;
    let place = 0;
    const spots = [0.2, 0.5, 0.8];
    const COUNT = 15;
    return {
      duration: 6.6,
      update: (dt, bullets) => {
        t += dt;
        if (!bell) {
          bell = new Shot({ x: box.x + box.w * 0.5, y: box.y - 6, harmless: true, art: 'heraldBellSwing' });
          bullets.push(bell);
        }
        if (t >= next && t < 7.8) {
          next = t + 0.95;
          const from = { x: bell.x, y: bell.y + 4 };
          const gap = Math.floor(rand(2, COUNT - 4));
          for (let i = 0; i < COUNT; i++) {
            if (i >= gap && i < gap + 3) continue;
            const angle = 0.06 * Math.PI + (i / (COUNT - 1)) * 0.88 * Math.PI;
            bullets.push(new Shot({ x: from.x, y: from.y, vx: Math.cos(angle) * 40, vy: Math.sin(angle) * 40, art: 'heraldRing' }));
          }
          // Off to ring somewhere else next time.
          place = (place + pick([1, 2])) % spots.length;
          bell.targetX = box.x + box.w * spots[place];
        }
        if (bell.targetX !== undefined) bell.x += (bell.targetX - bell.x) * Math.min(1, dt * 4);
        // Gone when the ringing's done.
        if (t > 8.2) bell.life = 0;
      },
    };
  },

  // The scroll: it unrolls its scroll right across the box, along your row,
  // reads it out, and rolls it back up. From one side, then the other, and
  // now and then it lets one fall open from the top, down through where
  // you are.
  heraldScroll(box, density, { Shot, Line, clamp }) {
    let t = 0;
    let next = 0.1;
    let count = 0;
    let scrolls = [];
    const unroll = (bullets, soul) => {
      const down = count % 3 === 2;
      const fromLeft = count % 2 === 0;
      count++;
      let from;
      let angle;
      let reach;
      if (down) {
        from = { x: clamp(soul.x, box.x + 6, box.x + box.w - 6), y: box.y - 2 };
        angle = Math.PI / 2;
        reach = box.h + 2;
      } else {
        from = { x: fromLeft ? box.x - 2 : box.x + box.w + 2, y: clamp(soul.y, box.y + 6, box.y + box.h - 6) };
        angle = fromLeft ? 0 : Math.PI;
        reach = box.w + 4;
      }
      const line = new Line({ x: from.x, y: from.y, angle, length: reach, thickness: 7, warn: 0.6, life: 1.6, color: SCROLL_COLOR });
      const end = new Shot({ x: from.x, y: from.y, warn: 0.6, life: 1.6, art: down ? 'heraldScrollEndDown' : 'heraldScrollEnd' });
      bullets.push(line, end);
      scrolls.push({ line, end, from, angle, reach });
    };
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 7.4) {
          next = t + 1.05;
          unroll(bullets, soul);
        }
        for (const scroll of scrolls) {
          const { line, end, from, angle, reach } = scroll;
          const k = line.age - line.warn;
          if (k < 0) continue;
          // Out quick, read out, rolled back up.
          let out;
          if (k < 0.35) out = k / 0.35;
          else if (k < 1.1) out = 1;
          else out = Math.max(0, 1 - (k - 1.1) / 0.45);
          line.length = Math.max(1, reach * out);
          end.x = from.x + Math.cos(angle) * line.length;
          end.y = from.y + Math.sin(angle) * line.length;
        }
        scrolls = scrolls.filter((scroll) => scroll.line.age < scroll.line.warn + 1.9);
      },
    };
  },

  // The proclamation: it reads out the whole thing, and the words come
  // down the box in rows, one line of it at a time. The spaces between
  // the words are where you get through.
  heraldProclaim(box, density, { Shot, rand }) {
    let t = 0;
    let next = 0.1;
    let line = 0;
    const gap = 8;
    return {
      duration: 6.8,
      update: (dt, bullets) => {
        t += dt;
        if (t >= next && t < 7.6) {
          next = t + 1.05;
          const text = PROCLAMATION[line++ % PROCLAMATION.length];
          // A short line it says twice, the way a crier does, so it still
          // spans the box. Where along the row it starts changes, so the
          // gaps aren't always in the same place.
          const say = text.length <= 5 ? `${text} ${text}` : text;
          const width = say.length * gap;
          const start = box.x + 4 + rand(0, Math.max(0, box.w - 8 - width));
          bullets.push(...spell(Shot, say, start, box.y - 4, gap, { vy: 24 }));
        }
      },
    };
  },

  // Echo: it shouts a word at you, the whole word flying together, and
  // then the street shouts it back: its echo, fainter, along the same way,
  // and then the echo's echo. From all round the box.
  heraldEcho(box, density, { Shot, rand, edgePoint }) {
    let t = 0;
    let next = 0.1;
    let shout = 0;
    let echoes = [];
    const cry = (bullets, word, from, aim, echo) => {
      const gap = 7;
      const speed = echo ? 50 : 58;
      // The word lies across the way it flies, read left to right.
      const width = (word.length - 1) * gap;
      [...word].forEach((char, i) => {
        if (!FONT[char]) return;
        const across = -width / 2 + i * gap;
        bullets.push(new Shot({
          x: from.x - Math.sin(aim) * across,
          y: from.y + Math.cos(aim) * across,
          warn: echo ? 0 : 0.3,
          vx: Math.cos(aim) * speed,
          vy: Math.sin(aim) * speed,
          art: letterArt(char, echo),
        }));
      });
    };
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 7.2) {
          next = t + 1.3;
          const word = SHOUTS[shout++ % SHOUTS.length];
          const from = edgePoint(box, undefined, 8);
          const aim = Math.atan2(soul.y - from.y, soul.x - from.x);
          cry(bullets, word, from, aim, false);
          // The echo, and the echo of the echo, from a little to one side.
          const side = rand(10, 16) * (Math.random() < 0.5 ? -1 : 1);
          for (let i = 1; i <= 2; i++) {
            const shift = side * i;
            echoes.push({ word, aim, when: t + 0.45 * i, from: { x: from.x - Math.sin(aim) * shift, y: from.y + Math.cos(aim) * shift } });
          }
        }
        for (const echo of echoes) {
          if (t < echo.when) continue;
          echo.done = true;
          cry(bullets, echo.word, echo.from, echo.aim, true);
        }
        echoes = echoes.filter((echo) => !echo.done);
      },
    };
  },
};
