import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { Line } from '../projectiles.js';
import { PathShot, Deco, Guide } from './coastKit.js';

// The Barnacle Bat's attacks. A little cave bat crusted with barnacles,
// hanging over a wet ledge in the dark. It is nearly blind, so it hunts by
// ear, and the barnacles on it eat whenever it squeaks:
//   - Echo: it squeaks, and where the echo finds you it leaves a mark; a
//     moment later it swoops straight through the mark. Move once it's found you.
//   - Roost: a row of its cousins hangs from the roof. The one whose eyes
//     open is the next to drop, and it dives at where you were when it woke.
//   - Feeding time: barnacles crust the walls. On every squeak the ones with
//     their lids up comb the water with their feathery arms, out at you.
// It hangs to the right of the box, near the top.

const BB = {
  k: '#14161a', b: '#c8c4b4', B: '#8a867a', h: '#26262a', s: '#a8d8e0', S: '#e8fcff', c: '#5a9aa4',
  e: '#d8ffe8', E: '#7ae0b0', m: '#3a3440', M: '#5a5062', f: '#4a4048', F: '#6a5e66', w: '#f4f0e8',
};

// A drip of sea water off the roof, falling: a long teardrop (drawn pointing the way it falls).
defineBulletArt('bbatDrop', {
  frames: [['.sss....', 'sSSSsss.', 'sSSSSSSc', 'sSSSsss.', '.sss....']],
  palette: BB,
  radius: 2,
  rotate: true,
});

// Where a drip is gathering on the roof (harmless): a crust of barnacle with the drop swelling under it.
defineBulletArt('bbatDripForm', {
  frames: [
    ['BbbbB', '.BhB.', '..s..', '.....', '.....'],
    ['BbbbB', '.BhB.', '..s..', '..s..', '.....'],
    ['BbbbB', '.BhB.', '..s..', '.sSs.', '..s..'],
  ],
  palette: BB,
  radius: 1,
  frameSeconds: 0.2,
});

// The splash a drip throws up where it lands.
defineBulletArt('bbatSplash', { frames: [['.s.', 'sSs', '.s.']], palette: BB, radius: 1.4 });

// An echo: a pale sea-glass arc of sound, its bow forward (drawn flying right).
defineBulletArt('bbatEcho', {
  frames: [
    ['.e.....', '..e....', '...eE..', '....E..', '...eE..', '..e....', '.e.....'],
    ['.E.....', '..E....', '...Ee..', '....e..', '...Ee..', '..E....', '.E.....'],
  ],
  palette: BB,
  radius: 2.4,
  rotate: true,
  frameSeconds: 0.1,
});

// Where the next squeak comes from (harmless): two little ripples of sound on the wall.
defineBulletArt('bbatChirp', {
  frames: [['E.....', '.E..e.', '.E..e.', 'E.....'], ['..E...', '...E.e', '...E.e', '..E...']],
  palette: BB,
  radius: 1,
  frameSeconds: 0.12,
});

// A barnacle shaken off a wing, tumbling.
defineBulletArt('bbatBarnacle', {
  frames: [['..bb..', '.bBBb.', 'bBhhBb', 'bBBBBb', '.kkkk.']],
  palette: BB,
  radius: 2.4,
  spin: 5,
});

// A barnacle stuck where it landed, opening (harmless): its feathery arms come out to feel about.
defineBulletArt('bbatBarnOpen', {
  frames: [
    ['.......', '...s...', '..bhb..', '.bBhBb.', 'bBBBBBb'],
    ['.s...s.', '..s.s..', '..bhb..', '.bBhBb.', 'bBBBBBb'],
    ['s..s..s', '.s.s.s.', '..bhb..', '.bBhBb.', 'bBBBBBb'],
  ],
  palette: BB,
  radius: 1,
  frameSeconds: 0.18,
});

// A barnacle's feathery arm (its cirri), flicked out: a little comb, drawn flying right.
defineBulletArt('bbatCirri', {
  frames: [['b.b...', '.bBBBs', 'b.b...'], ['.b.b..', 'bBBBBs', '.b.b..']],
  palette: BB,
  radius: 1.8,
  rotate: true,
  frameSeconds: 0.1,
});

// The swoop's path, shown first (harmless): a faint pale dot.
defineBulletArt('bbatPath', { frames: [['.e.', 'eEe', '.e.'], ['...', '.e.', '...']], palette: BB, radius: 1, frameSeconds: 0.12 });

// Barnacle grit shaken down as it swoops.
defineBulletArt('bbatGrit', { frames: [['bB', 'Bh']], palette: BB, radius: 1.2, spin: 3 });

// The bat itself, swooping: wings back, eyes lit. Drawn flying right.
function swooper() {
  const g = new Pix(18, 11);
  // Swept-back wings, one above the body and one below.
  g.line(1, 1, 9, 4, 'm', 2);
  g.line(1, 9, 9, 6, 'm', 2);
  g.line(2, 1, 9, 4, 'M');
  g.line(2, 9, 9, 6, 'M');
  g.set(4, 2, 'b');
  g.set(4, 8, 'b');
  g.disc(11, 5, 4, 2.6, 'f');
  g.disc(14, 5, 2.6, 2.4, 'f');
  g.line(15, 2, 16, 0, 'f');
  g.set(15, 4, 'e');
  g.set(16, 5, 'w');
  g.outline('k');
  return g.rows();
}
const SWOOP = swooper();
defineBulletArt('bbatSwooper', { frames: [SWOOP], palette: BB, hitbox: { w: 12, h: 6 }, radius: 4 });
defineBulletArt('bbatSwooperL', { frames: [SWOOP.map((row) => [...row].reverse().join(''))], palette: BB, hitbox: { w: 12, h: 6 }, radius: 4 });

// The bat diving through the box, any way at all (drawn flying right).
defineBulletArt('bbatDiver', { frames: [SWOOP], palette: BB, radius: 3.6, rotate: true });

// A cousin hanging from the roof, wings folded: asleep, then eyes open.
function hanger(awake) {
  const g = new Pix(9, 11);
  g.line(4, 0, 4, 1, 'B');
  g.disc(4, 5, 3.2, 4.2, 'm');
  g.disc(4, 5, 1.8, 3, 'f');
  g.set(1, 3, 'b');
  g.set(7, 7, 'b');
  if (awake) { g.set(3, 7, 'e'); g.set(5, 7, 'e'); } else { g.set(3, 7, 'M'); g.set(5, 7, 'M'); }
  g.line(3, 9, 5, 9, 'F');
  g.outline('k');
  return g.rows();
}
defineBulletArt('bbatHangAsleep', { frames: [hanger(false)], palette: BB, radius: 1 });
defineBulletArt('bbatHangAwake', { frames: [hanger(true), hanger(false)], palette: BB, radius: 1, frameSeconds: 0.09 });

// A barnacle on the wall: lid shut, or lid up and arms ready to comb.
defineBulletArt('bbatWallShut', { frames: [['.bbb.', 'bBhBb', 'bBBBb']], palette: BB, radius: 1 });
defineBulletArt('bbatWallOpen', { frames: [['s.s.s', '.bhb.', 'bBhBb', 'bBBBb'], ['.s.s.', 's.h.s', 'bBhBb', 'bBBBb']], palette: BB, radius: 1, frameSeconds: 0.1 });

// A dive along a curve: from `a` through `via` (at the middle of the dive)
// to `b`, taking `secs`. A quadratic curve bent so it really passes `via`.
const dive = (a, via, b, secs) => {
  const cx = 2 * via.x - (a.x + b.x) / 2;
  const cy = 2 * via.y - (a.y + b.y) / 2;
  return (k) => {
    const u = Math.min(1, k / secs);
    const v = 1 - u;
    const x = v * v * a.x + 2 * v * u * cx + u * u * b.x;
    const y = v * v * a.y + 2 * v * u * cy + u * u * b.y;
    const dx = 2 * v * (cx - a.x) + 2 * u * (b.x - cx);
    const dy = 2 * v * (cy - a.y) + 2 * u * (b.y - cy);
    return { x, y, a: Math.atan2(dy, dx) };
  };
};

export const BARNACLE_BAT_ATTACKS = {
  // Echo: it squeaks and a ring of echo spreads from it (harmless, pale).
  // Where the ring reaches you it leaves a little mark, and a dotted line
  // shows through it; a moment later the bat swoops along that line, right
  // through the mark, shaking grit off as it goes. Four squeaks.
  bbatEcho(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    let t = 0;
    let n = 0;
    const pings = [];
    return {
      duration: 7,
      update: (dt, bullets, soul, real = dt / density) => {
        t += dt;
        if (t >= T(0.2 + n * 1.45) && n < 4) {
          n++;
          const src = { x: n % 2 ? box.x + box.w + 10 : box.x - 10, y: box.y + 6 };
          pings.push({ r: 0, src, done: false });
          bullets.push(new Deco({ life: 1.6, paint(ctx, d) {
            ctx.strokeStyle = '#d8ffe8';
            ctx.globalAlpha *= 0.5;
            ctx.setLineDash([2, 3]);
            for (const off of [0, -6]) {
              const r = d.age * 70 + off;
              if (r <= 0) continue;
              ctx.beginPath();
              ctx.arc(src.x, src.y, r, 0, Math.PI * 2);
              ctx.stroke();
            }
          } }));
        }
        for (const p of pings) {
          if (p.done) continue;
          p.r += 70 * real;
          if (p.r < Math.hypot(soul.x - p.src.x, soul.y - p.src.y)) continue;
          p.done = true;
          const mark = { x: soul.x, y: soul.y };
          bullets.push(new Shot({ x: mark.x, y: mark.y, harmless: true, life: 0.7, art: 'bbatChirp' }));
          // The swoop: from outside the box on the squeak's side, through the mark, out the far side.
          const ang = Math.atan2(mark.y - p.src.y, mark.x - p.src.x) + rand(-0.15, 0.15);
          const a = { x: mark.x - Math.cos(ang) * 110, y: mark.y - Math.sin(ang) * 110 };
          const SPEED = 280;
          bullets.push(new Guide({ x: a.x, y: a.y, angle: ang, length: 220, warn: 0.5, color: '#d8ffe8' }));
          const path = (k) => ({ x: a.x + Math.cos(ang) * SPEED * k, y: a.y + Math.sin(ang) * SPEED * k, a: ang });
          bullets.push(new PathShot({ path, art: 'bbatDiver', warn: 0.5, life: 1.5 }));
          // Its mate, a beat behind on the same line.
          bullets.push(new PathShot({ path, art: 'bbatDiver', warn: 0.72, life: 1.5 }));
          // Grit shaken off along the way, falling from where the bat will be.
          for (let i = 1; i <= 4; i++) {
            const at = path(0.45 + i * 0.12);
            bullets.push(new Shot({ x: at.x, y: at.y, vy: 20, gravity: 40, art: 'bbatGrit', warn: 0.5 + 0.45 + i * 0.12, life: 1.4 }));
          }
        }
      },
    };
  },

  // Roost: five of its cousins hang along the roof of the box, asleep. Every
  // so often one opens its eyes (they blink yellow), and a moment later it
  // drops and dives at where you were when it woke, then swings back up to
  // the roof on the other side, where it hangs up again. Watch for the eyes.
  bbatRoost(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const top = box.y + 6;
    let t = 0;
    let n = 0;
    let made = false;
    const sleepers = [];
    const WAKE = 0.6;
    const DIVE = 0.85;
    const hang = (x, warn, life) => {
      const s = new Shot({ x, y: top, harmless: true, warn, art: 'bbatHangAsleep' });
      s.life = life;
      return s;
    };
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!made) {
          made = true;
          for (let i = 0; i < 5; i++) {
            const s = hang(box.x + 8 + i * 16, 0, 7.5);
            sleepers.push(s);
            bullets.push(s);
          }
        }
        if (t >= T(0.4 + n * 0.72) && n < 8) {
          n++;
          // Wake a sleeper that isn't right over you (so the dive comes at an angle).
          const choice = sleepers.filter((s) => Math.abs(s.x - soul.x) > 10);
          const s = choice.length ? choice[Math.floor(rand(0, choice.length))] : sleepers[n % sleepers.length];
          const a = { x: s.x, y: s.y };
          const via = { x: soul.x, y: soul.y };
          const bx = Math.min(Math.max(2 * via.x - a.x + rand(-6, 6), box.x + 6), box.x + box.w - 6);
          const b = { x: bx, y: top };
          s.life = 0;
          bullets.push(new Shot({ x: a.x, y: a.y, harmless: true, life: WAKE, art: 'bbatHangAwake' }));
          bullets.push(new PathShot({ path: dive(a, via, b, DIVE), art: 'bbatDiver', warn: WAKE, life: DIVE }));
          const back = hang(b.x, WAKE + DIVE, 7);
          bullets.push(back);
          sleepers.splice(sleepers.indexOf(s), 1, back);
        }
      },
    };
  },

  // Feeding time: barnacles crust the walls of the box. On every squeak (a
  // ripple at the bat), the barnacles with their lids up comb the water:
  // each flicks a fan of five feathery arms at where you are. The lids go
  // up a beat before the squeak, five barnacles at a time.
  bbatBarnacles(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const spots = [];
    for (let i = 0; i < 3; i++) spots.push({ x: box.x + 2, y: box.y + 16 + i * 24, reach: 62 });
    for (let i = 0; i < 3; i++) spots.push({ x: box.x + box.w - 2, y: box.y + 16 + i * 24, reach: 62 });
    for (let i = 0; i < 3; i++) spots.push({ x: box.x + 16 + i * 24, y: box.y + box.h - 2, reach: 52 });
    const order = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5);
    const BEAT = 1.15;
    const WARN = 0.55;
    let t = 0;
    let n = 0;
    let made = false;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!made) {
          made = true;
          for (const s of spots) {
            const shut = new Shot({ x: s.x, y: s.y, harmless: true, art: 'bbatWallShut' });
            shut.life = 7;
            bullets.push(shut);
          }
        }
        if (t >= T(0.3 + n * BEAT) && n < 5) {
          n++;
          const open = [];
          for (const i of order) {
            if (open.length < 5) open.push(i);
          }
          order.push(...order.splice(0, 4));
          bullets.push(new Shot({ x: box.x + box.w - 6, y: box.y + 8, harmless: true, warn: WARN - 0.15, life: 0.3, art: 'bbatChirp' }));
          for (const i of open) {
            const s = spots[i];
            bullets.push(new Shot({ x: s.x, y: s.y, harmless: true, life: WARN + 0.5, art: 'bbatWallOpen' }));
            const aim = Math.atan2(soul.y - s.y, soul.x - s.x) + rand(-0.06, 0.06);
            for (const off of [-0.4, -0.2, 0, 0.2, 0.4]) {
              bullets.push(new Line({ x: s.x, y: s.y, angle: aim + off, length: s.reach, thickness: 3, warn: WARN, life: 0.45, grow: 260, color: '#c8c4b4', dash: [3, 1] }));
            }
          }
        }
      },
    };
  },
};
