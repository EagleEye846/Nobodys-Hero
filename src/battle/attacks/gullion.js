import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { art } from '../../data/art/ch5Kit.js';
import { PathShot, Guide } from './coastKit.js';

// The Gullion's attacks. He is a brawler gull who steals, so it's all gull
// business:
//   - Finders keepers: chips lie about, and he always dives for the chip
//     nearest to you. Keep away from the chips.
//   - The swag sack: every kind of junk goes its own way. A boot drops and
//     bounces, a spoon comes back, a sandwich comes apart.
//   - A proper scrap: a ball of dust and feathers bounces about the box, and
//     the fists come out on the side facing you, only so far.
// He stands to the right of the box.

const GULL = { W: '#f2f4f2', w: '#ffffff', s: '#d4dad8', g: '#8e9aa6', G: '#5e6a78', y: '#f2b830', c: '#d8c06a', h: '#e8a030', t: '#f0e8cc', T: '#c8bc98', P: '#6a6e6c', p: '#9a9e9c', k: '#1c1f26', r: '#d8483a', l: '#6ab04a', b: '#8a6a44', S: '#b8c0c8' };

// A gull diving, pointing right: wings swept back, a yellow beak.
function diver(flap) {
  const g = new Pix(15, 9);
  g.disc(8, 4.5, 5, 2.4, 'W');
  g.disc(12, 4.5, 2.4, 1.8, 'W');
  g.rect(14, 4, 1, 1, 'y');
  g.set(13, 3, 'k');
  g.line(8, 4, 2, flap ? 0 : 1, 'g', 2);
  g.line(8, 5, 2, flap ? 8 : 7, 'G', 2);
  g.line(3, 4, 0, 4, 'G');
  g.outline('k');
  return g.rows();
}
defineBulletArt('gullDiver', { frames: [diver(0), diver(1)], palette: GULL, radius: 3.4, rotate: true, frameSeconds: 0.1 });

// A chip, golden and bitten.
defineBulletArt('gullChip', {
  frames: [['..cc..', '.chhc.', 'chhhhc', '.chhc.', '..cc..']],
  palette: GULL,
  radius: 2.2,
  spin: 3,
});

// A crumb knocked off it when it lands.
defineBulletArt('gullCrumb', { frames: [['.c.', 'chc', '.c.']], palette: GULL, radius: 1.6, spin: 4 });

// A loose feather pointing right.
defineBulletArt('gullFeather', {
  frames: [['..s......', 'swwwwwwSs', '..s......']],
  palette: GULL,
  radius: 2,
  rotate: true,
});

// A boot.
defineBulletArt('gullBoot', {
  frames: [['.pppp....', '.pPPp....', '.pppp....', '.pPPp....', '.ppppppp.', 'ppppppppp', 'PPPPPPPPP']],
  palette: { ...GULL, P: '#4a4e58' },
  radius: 3.4,
  spin: 3,
});

// A teaspoon.
defineBulletArt('gullSpoon', {
  frames: [['.......ss.', 'SSSSSSSsss', '.......ss.']],
  palette: GULL,
  radius: 2.6,
  rotate: true,
  spin: 7,
});

// A sandwich, a bite out of it.
defineBulletArt('gullSandwich', {
  frames: [['.cccccc.', 'chhhhhhc', 'lllllll.', 'rrrrrrr.', 'chhhhhhc', '.cccccc.']],
  palette: GULL,
  radius: 3.2,
  spin: 2,
});

// A taped fist punching left: four knuckle rolls at the front, a thumb folded
// across them, sailor's tape round the wrist, and (on the big one) speed lines
// streaming off the back.
function fist(scale, streaks) {
  const f = Math.max(2, Math.round(2 * scale));
  const H = f * 4 + 1;
  const back = streaks ? 5 : 0;
  const W = Math.round(H * 1.25) + back + 1;
  const g = new Pix(W, H + 2);
  const front = 1;
  const wrist = W - back - Math.round(H * 0.4) - 1;
  g.rect(front + f / 2, 1, W - back - front - f / 2 - 1, H, 't');
  for (let i = 0; i < 4; i++) g.disc(front + f / 2, 1 + f * i + f / 2, f / 2 + 0.4, f / 2, 't');
  for (let i = 1; i < 4; i++) g.line(front, 1 + f * i, front + f, 1 + f * i, 'T');
  g.line(front + f, 1 + Math.round(H * 0.62), wrist - 1, 1 + Math.round(H * 0.62), 'T');
  g.line(front + 1, 2, front + f, 2, 'w');
  g.rect(wrist, 1, W - back - wrist - 1, H, 'c');
  for (let x = wrist + 1; x < W - back - 1; x += 2) g.line(x, 1, x, H, 'h');
  if (streaks) for (const y of [2, Math.round(H / 2), H - 1]) g.line(W - back + 1, y + 1, W - 1, y + 1, 's');
  g.outline('k');
  return g.rows();
}
defineBulletArt('gullFist', { frames: [fist(1, false)], palette: GULL, radius: 3.2 });
defineBulletArt('gullFistBig', { frames: [fist(1.7, true)], palette: GULL, radius: 5.8 });

// A chip lying on the ground, for the taking (harmless): a fat golden chip.
defineBulletArt('gullChipDown', { frames: [['..ccc.', '.chhcc', 'chhcc.', '.cc...']], palette: GULL, radius: 1 });
// A slice of bread and a wedge of cheese, off a sandwich that came apart.
defineBulletArt('gullBread', { frames: [['.ttt.', 'tTTTt', 'tTTTt', 'ttttt']], palette: GULL, radius: 2.4, spin: 5 });
defineBulletArt('gullCheese', { frames: [['....y', '..yyh', 'yyyhh']], palette: GULL, radius: 2.2, spin: 6 });
// The scrap itself: a ball of dust and feathers with a beak and a foot sticking out.
const scrap = (f) => art(21, 19, (p) => {
  p.ellipse(10, 9, 9, 8, 'S');
  p.ellipse(8 + f, 7, 4, 3, 'W');
  p.ellipse(13 - f, 12, 3.4, 2.6, 's');
  p.poly([[16, 4 + f], [20, 5 + f], [16, 6 + f]], 'y');
  p.line(4, 15 - f, 1, 18 - f, 'y');
  p.set(6, 5, 'k');
  p.set(14, 9, 'k');
  for (const [x, y] of [[3, 8], [17, 13], [9, 2]]) p.set(x + f, y, 'w');
});
defineBulletArt('gullScrap', { frames: [scrap(0), scrap(1)], palette: GULL, radius: 8, frameSeconds: 0.08 });

export const GULLION_ATTACKS = {
  // Finders keepers: chips lie about the box, and every dive he makes is
  // for the chip nearest to you: a line flicks from him through that chip,
  // and he comes down it and snatches the chip on the way. Somebody keeps
  // dropping more chips near you. Keep your distance from the chips.
  gullDive(box, density, { Shot, Line, rand }) {
    const T = (s) => s * density;
    const chips = [];
    let t = 0;
    let n = 0;
    const drop = (x, y) => {
      const c = new Shot({ x: Math.min(Math.max(x, box.x + 6), box.x + box.w - 6), y: Math.min(Math.max(y, box.y + 6), box.y + box.h - 6), harmless: true, art: 'gullChipDown' });
      c.life = 9;
      chips.push(c);
      return c;
    };
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!chips.length && n === 0) {
          for (let i = 0; i < 3; i++) bullets.push(drop(rand(box.x + 8, box.x + box.w - 8), rand(box.y + 8, box.y + box.h - 8)));
        }
        if (t >= T(0.3 + n * 0.9) && n < 7) {
          n++;
          // Another chip dropped close by you.
          const a = rand(0, Math.PI * 2);
          bullets.push(drop(soul.x + Math.cos(a) * 9, soul.y + Math.sin(a) * 9));
          let best = null;
          for (const c of chips) if (!best || Math.hypot(c.x - soul.x, c.y - soul.y) < Math.hypot(best.x - soul.x, best.y - soul.y)) best = c;
          chips.splice(chips.indexOf(best), 1);
          const from = { x: box.x + box.w + 12, y: rand(box.y - 10, box.y + box.h + 10) };
          const ang = Math.atan2(best.y - from.y, best.x - from.x);
          const WARN = 0.45;
          const SPEED = 260;
          bullets.push(new Guide({ x: from.x, y: from.y, angle: ang, length: 220, warn: WARN, color: '#f2b830' }));
          bullets.push(new PathShot({ art: 'gullDiver', warn: WARN, life: 1.6, path: (k) => ({ x: from.x + Math.cos(ang) * SPEED * k, y: from.y + Math.sin(ang) * SPEED * k, a: ang }) }));
          // Crumbs fly off the chip as he takes it.
          const grab = WARN + Math.hypot(best.x - from.x, best.y - from.y) / SPEED;
          best.life = best.age + grab;
          for (const off of [-1.5, -1, -0.5, 0, 0.5, 1, 1.5]) {
            const b = ang + Math.PI + off;
            bullets.push(new Shot({ x: best.x, y: best.y, vx: Math.cos(b) * 65, vy: Math.sin(b) * 65, art: 'gullCrumb', warn: grab, life: 1.1 }));
          }
        }
      },
    };
  },

  // The swag sack: he turns it out and lobs the lot at you, and every kind
  // of junk goes its own way. A boot is heavy: it drops like a stone and
  // bounces once. A spoon spins out and comes back to his hand. A sandwich
  // comes apart in the air, into bread and cheese. Learn the junk.
  gullJunk(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const kinds = ['gullBoot', 'gullSpoon', 'gullSandwich'];
    let order = [...kinds].sort(() => Math.random() - 0.5);
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.3 + n * 0.55) && n < 11) {
          if (n % 3 === 0 && n) order = [...kinds].sort(() => Math.random() - 0.5);
          const kind = order[n % 3];
          n++;
          const from = { x: box.x + box.w + 6, y: rand(box.y + 10, box.y + box.h - 10) };
          const WARN = 0.45;
          bullets.push(new Shot({ x: from.x, y: from.y, harmless: true, life: WARN, art: kind }));
          if (kind === 'gullBoot') {
            // Thrown level to over your column, then it drops and bounces once.
            const to = soul.x;
            const fly = Math.max(0.2, (from.x - to) / 140);
            const floor = box.y + box.h - 5;
            bullets.push(new PathShot({
              art: kind, warn: WARN, life: fly + 1.4,
              path: (k) => {
                if (k < fly) return { x: from.x + (to - from.x) * (k / fly), y: from.y };
                const f = k - fly;
                const drop = Math.min(floor, from.y + 0.5 * 420 * f * f);
                const hit = Math.sqrt((2 * Math.max(0, floor - from.y)) / 420);
                if (f < hit) return { x: to, y: drop };
                const b = f - hit;
                return { x: to - b * 30, y: floor - Math.max(0, 70 * b - 0.5 * 420 * b * b) };
              },
            }));
          } else if (kind === 'gullSpoon') {
            // Out past you and back the same way.
            const ang = Math.atan2(soul.y - from.y, soul.x - from.x);
            const reach = Math.hypot(soul.x - from.x, soul.y - from.y) + 18;
            const OUT = 0.9;
            bullets.push(new PathShot({
              art: kind, warn: WARN, life: OUT * 2,
              path: (k) => {
                const d = reach * Math.sin((Math.PI / 2) * Math.min(2, k / OUT));
                return { x: from.x + Math.cos(ang) * d, y: from.y + Math.sin(ang) * d };
              },
            }));
          } else {
            // A sandwich flies at you and comes apart halfway.
            const ang = Math.atan2(soul.y - from.y, soul.x - from.x);
            const half = Math.hypot(soul.x - from.x, soul.y - from.y) * 0.55;
            const SPEED = 85;
            const split = half / SPEED;
            bullets.push(new Shot({ x: from.x, y: from.y, vx: Math.cos(ang) * SPEED, vy: Math.sin(ang) * SPEED, art: kind, warn: WARN, life: split }));
            const sx = from.x + Math.cos(ang) * half;
            const sy = from.y + Math.sin(ang) * half;
            [-0.45, 0, 0.45].forEach((off, i) => {
              bullets.push(new Shot({ x: sx, y: sy, vx: Math.cos(ang + off) * 80, vy: Math.sin(ang + off) * 80, art: i === 1 ? 'gullCheese' : 'gullBread', warn: WARN + split, life: 1.6 }));
            });
          }
        }
      },
    };
  },

  // A proper scrap: a ball of dust and feathers (him and another gull, at
  // it) tumbles about the box, bouncing off the walls. Whenever a fist
  // comes out of it, it comes out on the side facing you, and it only
  // reaches so far. Keep your distance, and mind where it's bouncing.
  gullBrawl(box, density, { Shot, Line, rand }) {
    const T = (s) => s * density;
    const R = 8;
    const x0 = box.x + box.w - 12;
    const y0 = rand(box.y + 14, box.y + box.h - 14);
    const vx = -rand(46, 54);
    const vy = rand(34, 42) * (Math.random() < 0.5 ? -1 : 1);
    // Bouncing about inside the box, worked out from where it started.
    const bounce = (v, p0, lo, hi, k) => {
      const span = hi - lo;
      let d = (p0 - lo + v * k) % (2 * span);
      if (d < 0) d += 2 * span;
      return lo + (d > span ? 2 * span - d : d);
    };
    const where = (k) => ({ x: bounce(vx, x0, box.x + R, box.x + box.w - R, k), y: bounce(vy, y0, box.y + R, box.y + box.h - R, k) });
    const WARN = 0.6;
    let t = 0;
    let n = 0;
    let made = false;
    let real = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        real += dt / density;
        if (!made) {
          made = true;
          bullets.push(new PathShot({ art: 'gullScrap', warn: WARN, life: 6.4, path: where }));
        }
        if (t >= T(WARN + 0.5 + n * 0.5) && n < 11) {
          n++;
          // The fist starts from where the scrap will be, a moment from now.
          const at = where(real - WARN + 0.3);
          const ang = Math.atan2(soul.y - at.y, soul.x - at.x);
          bullets.push(new Line({ x: at.x + Math.cos(ang) * R, y: at.y + Math.sin(ang) * R, angle: ang, length: 34, thickness: 6, warn: 0.3, life: 0.25, grow: 200, color: '#f2f4f2' }));
          bullets.push(new Shot({ x: at.x + Math.cos(ang) * (R + 34), y: at.y + Math.sin(ang) * (R + 34), art: 'gullFist', warn: 0.3 + 0.12, life: 0.13 }));
          if (n % 3 === 0) {
            for (const off of [-1.2, 1.2]) bullets.push(new Shot({ x: at.x, y: at.y, vx: Math.cos(ang + off) * 35, vy: Math.sin(ang + off) * 35, art: 'gullFeather', warn: 0.4, life: 1.6 }));
          }
        }
      },
    };
  },
};
