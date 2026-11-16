import { defineBulletArt } from '../projectiles.js';
import { Deco, blit } from './coastKit.js';

// The Bunting's attacks. It's a plump little bird wearing a string of party
// bunting, and it's convinced it's somebody's birthday, so every attack is a
// party, and most are party games with a rule:
//   - Poppers: party poppers go off at you in fans of confetti.
//   - Balloons: balloons rise and pop into confetti.
//   - Streamers: streamers wriggle after you.
//   - The cake: it lights the candles to its own song, and blows them out.
//     Every lit candle sends its flame up its whole column. One candle
//     never lights (it's nobody's birthday): that column is the safe one.
//   - Musical chairs: it chirps a tune and puts chairs out. When the music
//     stops, the whole box goes off in confetti except the chairs. One chair
//     fewer each time.
// It's the bright, silly end of Sunnyside: slow, colourful and easy to read.
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

// A candle flame, blown loose and going up like a rocket.
defineBulletArt('buntFlame', {
  frames: [
    ['...w...', '..wyw..', '.wyyyw.', '.yyoyy.', 'yyoooyy', 'yoorooy', '.oorro.', '..ooo..', '...o...'],
    ['..w....', '..wyw..', '.wyyyw.', '.yyoyyy', 'yyoooyy', 'yoorooy', '.oorro.', '..ooo..', '....o..'],
  ],
  palette: { w: '#fff6c0', y: '#ffd25e', o: '#ff8c1a', r: '#e8483c' },
  radius: 3.5,
  hitbox: { w: 9, h: 9 },
  frameSeconds: 0.08,
});

// A party chair (harmless), for musical chairs.
const CHAIR = ['.bbbb.', '.bllb.', '.bllb.', '.bbbb.', 'rrrrrr', 'rRRRRr', 'r....r', 'r....r'];
const CHAIR_PAL = { b: '#e8483c', l: '#ff9a8c', r: '#8a6a3a', R: '#c89a5a' };

export const BUNTING_ATTACKS = {
  // Poppers: a party popper pops up at the edge of the box, twirls, and goes
  // off, throwing a fan of confetti at where you stand. The confetti slows,
  // and drifts down.
  buntPop(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let count = 0;
    let next = 0.2;
    let poppers = [];
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && count < 4) {
          count++;
          next = t + 1.6;
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
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && count < 5 && t < 6.2) {
          count++;
          next = t + 0.95;
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
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || count >= 6) return;
        count++;
        next = t + 1.1;
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


  // The cake: a birthday cake along the floor of the box, with seven
  // candles. It chirps its song and lights one candle on every note, along
  // the cake. One candle won't take (it's nobody's birthday) and only
  // smokes. Then it takes a deep breath and blows, and every lit flame goes
  // shooting up its candle's whole column, out of the top of the box. Stand
  // over the one that never lit. Three cakes, lit from alternate ends.
  buntCake(box, density, { Shot }) {
    // Real seconds (on the attack's clock, which runs `density` times fast);
    // when it's layered on another, lighter (density under 1), it spreads out.
    const pace = Math.max(density, 1);
    const T = (s) => s * pace;
    const CANDLES = 7;
    const gapX = box.w / CANDLES;
    const colX = (i) => box.x + gapX * (i + 0.5);
    const floor = box.y + box.h;
    const NOTE = 0.17;
    const BREATH = 0.85;
    let t = 0;
    let n = 0;
    let cake = null;
    return {
      duration: 8.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (n < 3 && t >= T(0.15 + n * 2.7)) {
          // The dud is never the column you're in, or the next one, but never
          // more than a short run away either.
          const mine = Math.min(CANDLES - 1, Math.max(0, Math.floor((soul.x - box.x) / gapX)));
          let dud;
          do dud = Math.floor(Math.random() * CANDLES); while (Math.abs(dud - mine) < 2 || Math.abs(dud - mine) > 4);
          cake = { born: t, dud, order: n % 2 === 0 ? 1 : -1 };
          const at = cake;
          n++;
          const last = NOTE * CANDLES;
          cake.blow = last + BREATH;
          cake.lights = [];
          for (let i = 0; i < CANDLES; i++) {
            if (i !== dud) cake.lights.push({ i, at: (cake.order > 0 ? i : CANDLES - 1 - i) * NOTE + 0.1 });
          }
          bullets.push(new Deco({
            life: last + BREATH + 0.9,
            under: true,
            paint: (ctx, d) => {
              // The cake: sponge and icing.
              ctx.fillStyle = '#c88a4a';
              ctx.fillRect(box.x + 2, floor - 5, box.w - 4, 5);
              ctx.fillStyle = '#ffc0e4';
              ctx.fillRect(box.x + 2, floor - 6, box.w - 4, 2);
              ctx.fillStyle = '#ff7ac8';
              for (let x = box.x + 4; x < box.x + box.w - 4; x += 5) ctx.fillRect(x, floor - 4, 2, 1);
              for (let i = 0; i < CANDLES; i++) {
                const k = at.order > 0 ? i : CANDLES - 1 - i;
                const x = Math.round(colX(i));
                ctx.fillStyle = i % 2 ? '#9cc8ff' : '#fff6a8';
                ctx.fillRect(x - 1, floor - 9, 2, 3);
                ctx.fillStyle = '#e8e0d0';
                ctx.fillRect(x, floor - 10, 1, 1);
                const on = d.age >= k * NOTE + 0.1;
                if (i === at.dud) {
                  // Only a wisp of smoke.
                  if (on) {
                    ctx.fillStyle = '#b8b0c0';
                    ctx.fillRect(x + Math.round(Math.sin(d.age * 6)), floor - 13 - (Math.floor(d.age * 6) % 4), 1, 2);
                  }
                }
              }
            },
          }));
        }
        // Light each candle on its note: its flame sits on the wick,
        // flickering (that's the warning), until the blow, then lifts off
        // and goes whooshing up.
        if (cake) {
          const age = (t - cake.born) / pace;
          for (const c of cake.lights) {
            if (c.done || age < c.at) continue;
            c.done = true;
            for (let j = 0; j < 4; j++) {
              bullets.push(new Shot({ x: colX(c.i), y: floor - 8, vy: -45, accel: 420, warn: cake.blow - c.at + j * 0.06, art: 'buntFlame', life: 1.2 }));
            }
          }
        }
      },
    };
  },

  // Musical chairs: it chirps a tune, and party chairs appear about the box
  // while the notes wobble past. When the music stops (the chairs flash),
  // the whole box goes off in confetti, except on a chair. Three rounds:
  // three chairs, then two, then one.
  buntChairs(box, density, { Shot, rand }) {
    // Real seconds (on the attack's clock, which runs `density` times fast);
    // when it's layered on another, lighter (density under 1), it spreads out.
    const pace = Math.max(density, 1);
    const T = (s) => s * pace;
    const MUSIC = 1.5;
    const STOP = 0.55;
    const BANG = 0.35;
    const SEAT = 11;
    const ROUND = MUSIC + STOP + BANG + 0.2;
    let t = 0;
    let round = 0;
    let noteTimer = T(0.3);
    let current = null;
    // The confetti blast: everywhere but the chairs.
    class Blast {
      constructor(chairs) {
        this.chairs = chairs;
        this.age = 0;
        this.warn = MUSIC + STOP;
        this.life = BANG;
        this.grazed = false;
        this.dmg = null;
        this.bits = Array.from({ length: 80 }, () => ({ x: rand(box.x, box.x + box.w), y: rand(box.y, box.y + box.h), c: Math.floor(rand(0, 4)) }));
      }
      get active() {
        return this.age >= this.warn && this.age < this.warn + this.life;
      }
      update(dt) {
        this.age += dt;
      }
      isGone() {
        return this.age >= this.warn + this.life + 0.25;
      }
      edgeDistance(px, py) {
        if (!this.active) return Infinity;
        const seat = Math.min(...this.chairs.map((c) => Math.hypot(px - c.x, py - c.y)));
        // (Inside a chair this is how far you are from its edge.)
        return SEAT - seat;
      }
      draw(ctx) {
        ctx.save();
        for (const c of this.chairs) blit(ctx, CHAIR, CHAIR_PAL, c.x, c.y);
        if (this.age < this.warn - STOP) {
          ctx.restore();
          return;
        }
        if (this.age < this.warn) {
          // The music's stopped: the chairs flash. Get on one.
          ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.3 : 0.9;
          ctx.strokeStyle = '#fff6a8';
          for (const c of this.chairs) {
            ctx.beginPath();
            ctx.arc(c.x, c.y, SEAT, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
          return;
        }
        const colours = ['#e8483c', '#3c8cf0', '#4cc86a', '#ff7ac8'];
        const over = this.age - this.warn - this.life;
        if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
        for (const b of this.bits) {
          const y = box.y + ((b.y - box.y + (this.age - this.warn) * 40) % box.h);
          if (this.chairs.some((c) => Math.hypot(b.x - c.x, y - c.y) < SEAT + 1)) continue;
          ctx.fillStyle = colours[b.c];
          ctx.fillRect(Math.round(b.x), Math.round(y), 2, 2);
        }
        ctx.restore();
      }
    }
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (round < 3 && t >= T(0.1 + round * ROUND)) {
          const seats = 3 - round;
          round++;
          // Chairs a fair way about the box, none right where you are.
          const chairs = [];
          for (let tries = 0; chairs.length < seats && tries < 300; tries++) {
            const c = { x: rand(box.x + 10, box.x + box.w - 10), y: rand(box.y + 12, box.y + box.h - 10) };
            const fromSoul = Math.hypot(c.x - soul.x, c.y - soul.y);
            if (tries < 250 && (fromSoul < 22 || fromSoul > 62)) continue;
            if (chairs.some((o) => Math.hypot(o.x - c.x, o.y - c.y) < 26)) continue;
            chairs.push(c);
          }
          current = { born: t };
          bullets.push(new Blast(chairs));
        }
        // The tune: notes wobble across while the music plays.
        if (current && t < current.born + T(MUSIC - 0.2)) {
          noteTimer -= dt;
          if (noteTimer <= 0) {
            noteTimer = T(0.5);
            const y = rand(box.y + 6, box.y + box.h - 6);
            bullets.push(new Shot({ x: box.x + box.w + 6, y, vx: -46, wobble: { amplitude: 5, frequency: 5 }, art: 'buntNote', life: 3.2 }));
          }
        }
      },
    };
  },
};
