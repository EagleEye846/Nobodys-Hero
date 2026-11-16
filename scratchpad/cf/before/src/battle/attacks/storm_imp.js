import { defineBulletArt } from '../projectiles.js';
import { Deco, blit, shove } from './coastKit.js';

// The Storm Imp's attacks. A bit of the storm with a grin, and a show-off,
// so it plays with lightning the way lightning really goes:
//   - Lightning rods: the bolt comes down on the rod nearest you, then jumps
//     to whatever is nearest that rod, another rod or you.
//   - Flash, then thunder: the flash shows where the bolts will fall, and
//     the thunder count (pips by the cloud) says when.
//   - Puffed cheeks: it puffs up at one side of the box and blows a gust from
//     there that shoves you, with the rain slanting in on it.
// It floats to the right of the box.

const STORM = { c: '#86a294', C: '#b4ccbe', d: '#54706a', k: '#18242a', y: '#fff06a', Y: '#ffc83a', w: '#ffffff', r: '#8fd0ff', R: '#4a8ac8', p: '#e8e0c8', P: '#b8b098' };

// A streak of rain, pointing the way it falls.
defineBulletArt('impRain', { frames: [['.RRrrrw.', 'RRrrrww.', '.RRrrrw.'].map((r, i) => (i === 1 ? r : r.replace(/R/g, '.')))], palette: STORM, radius: 1.5, rotate: true });

// Where a drop hits the floor (harmless): a little splash.
defineBulletArt('impSplash', {
  frames: [['r.....r', '.r.r.r.', '..RRR..'], ['.......', 'r..r..r', '.RRRRR.']],
  palette: STORM,
  radius: 1,
  frameSeconds: 0.1,
});

// The storm cloud it rains from, along the top of the box (harmless): grey
// puffs with a dark belly.
defineBulletArt('impCloud', {
  frames: [[
    '....cccc.....ccc....',
    '..ccCCCCcc.ccCCCcc..',
    '.cCCCCccccccCCcccccc',
    'cccccccccccccccccccc',
    'cddcdddcddddcdddcddc',
    '.dd.ddd..dd.ddd..dd.',
  ]],
  palette: STORM,
  radius: 1,
});

// A little spark (where a bolt lands, where an orb bounces).
defineBulletArt('impSpark', {
  frames: [['.y.', 'ywy', '.y.'], ['y.y', '.w.', 'y.y']],
  palette: STORM,
  radius: 1.7,
  frameSeconds: 0.08,
});

// The top of a bolt, before it falls (harmless): a tiny dark cloud with a yellow eye.
defineBulletArt('impMark', {
  frames: [
    ['.ccc.', 'cCcCc', 'cdydc', '.ccc.'],
    ['.ccc.', 'cCcCc', 'cdwdc', '.ccc.'],
  ],
  palette: STORM,
  radius: 1,
  frameSeconds: 0.1,
});

// An arrow that shows which way the gust will blow (harmless).
defineBulletArt('impArrow', {
  frames: [['...w...', '....w..', 'wwwwwww', '....w..', '...w...'], ['....w..', '.....w.', 'wwwwwww', '.....w.', '....w..']],
  palette: STORM,
  radius: 1,
  rotate: true,
  frameSeconds: 0.15,
});

// A puff of cloud blowing past.
defineBulletArt('impPuff', {
  frames: [['..ccc..', '.cCCcc.', 'cCCcccc', 'ccccddc', '.cddcc.', '..ccc..']],
  palette: STORM,
  radius: 3,
});

// A paper boat, blown off something (the storm's a boy's, and he made boats).
defineBulletArt('impBoat', {
  frames: [['..p....', '.ppp.pp', 'pppppPp', '.PPPPP.']],
  palette: STORM,
  radius: 2.6,
  spin: 4,
});

// A ball of lightning: crackling, spiky.
defineBulletArt('impOrb', {
  frames: [
    ['..y.y..', '.yYwYy.', 'yYwwwYy', '.yYwYy.', '..y.y..'],
    ['.y...y.', '..YYY..', 'yYwwwYy', '..YYY..', '.y...y.'],
  ],
  palette: STORM,
  radius: 3.4,
  frameSeconds: 0.07,
});

// A jagged bolt from the top of the box to the bottom, as a list of Lines.
function bolt(Line, x, box, warn, rand, width = 5.5) {
  const lines = [];
  const steps = 6;
  let px = x;
  let py = box.y - 4;
  for (let i = 1; i <= steps; i++) {
    const nx = i === steps ? x + rand(-2, 2) : x + rand(-width, width);
    const ny = box.y - 4 + ((box.h + 8) * i) / steps;
    lines.push(new Line({
      x: px, y: py, angle: Math.atan2(ny - py, nx - px), length: Math.hypot(nx - px, ny - py) + 1,
      thickness: 3, warn, life: 0.3, color: '#fff06a', glow: '#ffffff',
    }));
    px = nx;
    py = ny;
  }
  return lines;
}

// A lightning rod stuck in the ground: an iron spike with a brass ball.
defineBulletArt('impRod', { frames: [['.Y.', 'YyY', '.Y.', '.P.', '.P.', '.P.', '.P.', 'PPP']], palette: STORM, radius: 1 });
defineBulletArt('impRodLit', { frames: [['.w.', 'wyw', '.w.', '.y.', '.y.', '.y.', '.y.', 'yyy'], ['.Y.', 'YyY', '.Y.', '.P.', '.P.', '.P.', '.P.', 'PPP']], palette: STORM, radius: 1, frameSeconds: 0.06 });
// The imp's puffed-out cheeks: a round grey face, swelling.
const cheeks = (r) => {
  const n = r * 2 + 3;
  const rows = [];
  for (let y = 0; y < n; y++) {
    let row = '';
    for (let x = 0; x < n; x++) {
      const d = Math.hypot(x - n / 2 + 0.5, y - n / 2 + 0.5);
      row += d < r - 0.5 ? (Math.abs(y - n / 2) < 1 && Math.abs(x - n / 2 + 1.5) < 1 ? 'k' : 'C') : d < r + 0.5 ? 'd' : '.';
    }
    rows.push(row);
  }
  return rows;
};
const CHEEKS = [cheeks(4), cheeks(5), cheeks(6)];

export const STORM_IMP_ATTACKS = {
  // Lightning rods: iron rods stand in the box. The imp's bolt always comes
  // down on the rod nearest to you (it flickers first), and then, as
  // lightning does, it jumps from that rod to whatever was nearest it when
  // it lit: the next rod, or you (the jump's path shows faintly). Be further
  // from the lit rod than another rod is.
  impRods(box, density, { Shot, Line, rand }) {
    const T = (s) => s * density;
    const WARN = 0.6;
    let t = 0;
    let n = 0;
    let rods = [];
    let placedFor = -1;
    const place = (bullets, soul) => {
      rods = [];
      let tries = 0;
      while (rods.length < 4) {
        const r = { x: rand(box.x + 8, box.x + box.w - 8), y: rand(box.y + 14, box.y + box.h - 6) };
        // (After many tries, take what comes, so it can never stall.)
        const roomy = tries++ > 200 || (rods.every((o) => Math.hypot(o.x - r.x, o.y - r.y) > 26) && Math.hypot(r.x - soul.x, r.y - soul.y) > 12);
        if (roomy) rods.push(r);
      }
      for (const r of rods) {
        const s = new Shot({ x: r.x, y: r.y - 3, harmless: true, art: 'impRod' });
        s.life = 2.8;
        bullets.push(s);
      }
    };
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (n % 3 === 0 && placedFor !== n && t >= T(0.2 + n * 0.72) && n < 8) {
          placedFor = n;
          place(bullets, soul);
        }
        if (t >= T(0.5 + n * 0.72) && n < 8) {
          n++;
          let rod = rods[0];
          for (const r of rods) if (Math.hypot(r.x - soul.x, r.y - soul.y) < Math.hypot(rod.x - soul.x, rod.y - soul.y)) rod = r;
          bullets.push(new Shot({ x: rod.x, y: rod.y - 3, harmless: true, life: WARN, art: 'impRodLit' }));
          // The bolt down to the rod (it hurts in the rod's column, above it).
          bullets.push(new Line({ x: rod.x, y: box.y - 4, angle: Math.PI / 2, length: rod.y - box.y - 3, thickness: 4, warn: WARN, life: 0.25, color: '#fff06a', glow: '#ffffff' }));
          // Where it will jump once it lands: to the nearest thing to that rod,
          // another rod or you, as things stand when the rod lights. The path shows.
          let to = { x: soul.x, y: soul.y };
          let best = Math.hypot(soul.x - rod.x, soul.y - rod.y);
          for (const o of rods) {
            if (o === rod) continue;
            const d = Math.hypot(o.x - rod.x, o.y - rod.y);
            if (d < best) { best = d; to = o; }
          }
          const a = Math.atan2(to.y - rod.y, to.x - rod.x);
          bullets.push(new Line({ x: rod.x, y: rod.y - 6, angle: a, length: best + 6, thickness: 3, warn: WARN, life: 0.22, color: '#fff06a', glow: '#ffffff' }));
          bullets.push(new Shot({ x: rod.x, y: rod.y - 6, harmless: true, warn: WARN, life: 0.3, art: 'impSpark' }));
        }
      },
    };
  },

  // Flash, then thunder: the imp flashes, and the flash shows exactly where
  // the bolts will fall (pale strips). Then it counts the thunder, a pip at
  // a time by the cloud: one, two or three. The bolts come on the last pip.
  // The flash says where; the count says when.
  impThunder(box, density, { Line, rand }) {
    const T = (s) => s * density;
    const PIP = 0.28;
    let t = 0;
    let n = 0;
    let wait = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + wait) && n < 6) {
          n++;
          const count = 1 + ((n * 2) % 3);
          const delay = 0.25 + count * PIP;
          wait += delay + 0.35;
          // The flash.
          bullets.push(new Deco({ life: 0.12, paint(ctx) {
            ctx.globalAlpha *= 0.25;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(box.x, box.y, box.w, box.h);
          } }));
          bullets.push(new Deco({ life: delay, paint(ctx, d) {
            for (let i = 0; i < count; i++) if (d.age >= 0.25 + i * PIP) blit(ctx, ['.y.', 'yYy', '.y.'], STORM, box.x + box.w - 5, box.y + 5 + i * 6);
          } }));
          const xs = [soul.x + rand(-3, 3)];
          for (let guard = 0; xs.length < 4 && guard < 300; guard++) {
            const x = rand(box.x + 5, box.x + box.w - 5);
            if (xs.every((o) => Math.abs(o - x) > 12)) xs.push(x);
          }
          for (const x of xs) {
            bullets.push(new Deco({ life: delay, paint(ctx, d) {
              ctx.globalAlpha *= d.age < 0.12 ? 0.6 : 0.18;
              ctx.fillStyle = '#fff06a';
              ctx.fillRect(Math.round(x) - 3, box.y, 6, box.h);
            } }));
            bullets.push(new Line({ x, y: box.y - 4, angle: Math.PI / 2, length: box.h + 8, thickness: 6, warn: delay, life: 0.28, color: '#fff06a', glow: '#ffffff' }));
          }
        }
      },
    };
  },

  // Puffed cheeks: the imp pops up at one side of the box and puffs out its
  // cheeks, bigger, bigger, and then blows: a gust from that side shoves you
  // across, and the rain comes slanting in on it, in lines with a gap.
  // Whichever side the cheeks are on, that's where it's coming from.
  impGust(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const PUFF = 0.75;
    const BLOW = 1.0;
    const sides = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    let t = 0;
    let n = 0;
    let blowEnd = -1;
    let dir = { x: 0, y: 0 };
    return {
      duration: 7,
      update: (dt, bullets, soul, real = dt / density) => {
        t += dt;
        if (t >= T(0.2 + n * 1.55) && n < 4) {
          const side = sides[n % 4];
          n++;
          // From the right, the bottom, the left or the top.
          const a = [Math.PI, -Math.PI / 2, 0, Math.PI / 2][side];
          dir = { x: Math.cos(a), y: Math.sin(a) };
          const cx = box.x + box.w / 2 - dir.x * (box.w / 2 + 9);
          const cy = box.y + box.h / 2 - dir.y * (box.h / 2 + 9);
          blowEnd = t + T(PUFF + BLOW);
          // The cheeks show just inside the edge the gust comes from.
          bullets.push(new Deco({ x: box.x + box.w / 2 - dir.x * (box.w / 2 - 6), y: box.y + box.h / 2 - dir.y * (box.h / 2 - 6), life: PUFF + BLOW, paint(ctx, d) {
            const f = Math.min(2, Math.floor((d.age / PUFF) * 3));
            blit(ctx, d.age < PUFF ? CHEEKS[f] : CHEEKS[0], STORM, d.x, d.y);
          } }));
          // Rain on the gust: lines of drops across the wind, each with a gap.
          const px = -dir.y;
          const py = dir.x;
          for (let row = 0; row < 3; row++) {
            const gap = rand(-26, 26);
            for (let s = -42; s <= 42; s += 8) {
              if (Math.abs(s - gap) < 10) continue;
              bullets.push(new Shot({ x: cx + px * s, y: cy + py * s, vx: dir.x * 70, vy: dir.y * 70, art: 'impRain', warn: PUFF + row * 0.3, life: 2 }));
            }
          }
        }
        const k = blowEnd - t;
        if (k > 0 && k < T(BLOW)) shove(soul, box, dir.x * 58 * real, dir.y * 58 * real);
      },
    };
  },
};
