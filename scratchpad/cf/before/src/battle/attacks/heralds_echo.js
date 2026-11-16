import { defineBulletArt } from '../projectiles.js';

// The Herald's Echo's attacks. It's the ghost of a town crier who still
// walks the empty streets of the old city crying that the Hero is coming,
// so it fights with its news: WORDS. The letters of its proclamation fly
// at you in long wavy ribbons, rows of them come down with the gaps
// between the words to slip through, and when it shouts a word at you its
// echo comes after it (and the echo's echo), and it writes its news across
// the box in letters as tall as you, which drip off when it's done.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. Its `density` is high, so its own clock
// (`t`) runs fast: about 11 of it fits in a turn.

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

// An ink blot, one dot of the big letters it writes across the box.
defineBulletArt('heraldBlot', {
  frames: [['.k.', 'kwk', '.k.']],
  palette: LETTER,
  radius: 1.4,
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
    let lead = 0;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!queue.length && t >= nextLetter && t < 10.6) {
          queue = [...RIBBONS[line % RIBBONS.length]];
          fromRight = line % 2 === 0;
          line++;
          y = clamp(soul.y + rand(-3, 3), box.y + 10, box.y + box.h - 10);
          // (Each line's wave starts at a different point in its sway, so it
          // falls differently across the box.)
          lead = rand(0, (Math.PI * 2) / 4);
        }
        if (queue.length && t >= nextLetter) {
          const char = queue.shift();
          nextLetter = t + 0.11;
          if (FONT[char]) {
            const letter = new Shot({
              x: fromRight ? box.x + box.w + 6 : box.x - 6, y,
              vx: fromRight ? -56 : 56,
              wobble: { amplitude: 8, frequency: 4 },
              art: letterArt(char),
            });
            letter.age = lead;
            bullets.push(letter);
          }
          // A breath between lines.
          if (!queue.length) nextLetter = t + 0.55;
        }
      },
    };
  },

  // In big letters: it writes its news right across the box, in letters
  // as tall as you are tall, made of ink blots: HERO, SOON, WAIT. Each word
  // shows faintly first, across your row, and then it's solid, so find a
  // hole to stand in: the middle of an O, the space between two letters,
  // the open side of an E. Then the letters drip off one by one, H, E, R,
  // O, and it writes the next one.
  heraldSpell(box, density, { Shot, rand, clamp, shuffleBag }) {
    const words = shuffleBag(['HERO', 'SOON', 'WAIT', 'HEAR', 'NEWS']);
    const PX = 3.6;
    const LETTER_W = PX * 5;
    const SPACE = 2;
    let t = 0;
    let next = 0.2;
    let writing = [];
    const write = (bullets, soul) => {
      const word = words();
      const top = clamp(soul.y - rand(3, 15), box.y + 3, box.y + box.h - 3 - LETTER_W);
      const left = box.x + (box.w - (word.length * LETTER_W + (word.length - 1) * SPACE)) / 2 + PX / 2;
      const letters = [...word].map((char, n) => {
        const blots = [];
        FONT[char].forEach((row, r) => [...row].forEach((on, c) => {
          if (on !== '#') return;
          const blot = new Shot({ x: left + n * (LETTER_W + SPACE) + c * PX, y: top + r * PX + PX / 2, warn: 0.9, art: 'heraldBlot' });
          bullets.push(blot);
          blots.push(blot);
        }));
        return blots;
      });
      writing.push({ letters, at: t, dropped: 0 });
    };
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 9.6) {
          write(bullets, soul);
          next = t + 2.4;
        }
        for (const word of writing) {
          // Solid for a moment, then the letters drip off, one by one.
          while (word.dropped < word.letters.length && t - word.at > 1.8 + word.dropped * 0.18) {
            for (const blot of word.letters[word.dropped]) {
              blot.vy = rand(0, 10);
              blot.gravity = rand(110, 150);
            }
            word.dropped++;
          }
        }
        writing = writing.filter((word) => word.dropped < word.letters.length);
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
      duration: 8,
      update: (dt, bullets) => {
        t += dt;
        if (t >= next && t < 10.4) {
          next = t + 1.05;
          const text = PROCLAMATION[line++ % PROCLAMATION.length];
          // A short line it says twice, the way a crier does, so it still
          // spans the box. Where along the row it starts changes, so the
          // gaps aren't always in the same place.
          const say = text.length <= 5 ? `${text} ${text}` : text;
          const width = say.length * gap;
          const start = box.x - 2 + rand(0, Math.max(4, box.w + 4 - width));
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
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 10) {
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
