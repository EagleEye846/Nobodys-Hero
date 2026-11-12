import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { withSnipes } from './snipes.js';

// The Barnacle Bat's attacks. It's a little cave bat crusted with barnacles,
// hanging over a wet ledge in the dark, so it's drips and echoes and barnacles:
// drips off the roof that form first and splash where they land (one always
// over you), squeaks that go out as arcs of echo and bounce back off the walls,
// barnacles shaken off its wings that land on the floor and open, and a swoop
// down through the box along a path that shows first. It hangs to the right of
// the box, near the top, so things come from up there.

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

export const BARNACLE_BAT_ATTACKS = {
  // Drips: drops gather on the roof of the box (you see them swell) and fall,
  // splashing into two little drops where they land. Each wave has one drip
  // that follows you along the roof until just before it drops, and two more
  // somewhere else. Four waves.
  bbatDrip(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let waves = 0;
    let forming = [];
    let falling = [];
    const heading = { x: 0 };
    let lastX = null;
    const floor = box.y + box.h - 3;
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (lastX !== null && dt > 0) heading.x = heading.x * 0.85 + ((soul.x - lastX) / dt) * 0.15;
        lastX = soul.x;
        if (waves < 4 && t >= 0.2 + waves * 1.6) {
          const xs = [soul.x];
          for (let k = 0; k < 2; k++) {
            let x = rand(box.x + 6, box.x + box.w - 6);
            if (Math.abs(x - soul.x) < 14) x = clamp(soul.x + (x < soul.x ? -1 : 1) * rand(18, 30), box.x + 6, box.x + box.w - 6);
            xs.push(x);
          }
          xs.forEach((x, i) => {
            const warn = 0.7 + i * 0.12;
            const marker = new Shot({ x, y: box.y + 3, harmless: true, life: warn, art: 'bbatDripForm' });
            bullets.push(marker);
            forming.push({ marker, at: t + warn, follows: i === 0 });
          });
          waves++;
        }
        for (const f of forming) {
          // The drip over you slides along the roof after you until the last third of a second.
          if (f.follows && t < f.at - 0.3) f.marker.x = clamp(soul.x + heading.x * 0.35, box.x + 4, box.x + box.w - 4);
          if (t < f.at) continue;
          f.done = true;
          const drop = new Shot({ x: f.marker.x, y: box.y + 5, vy: 30, gravity: 200, art: 'bbatDrop', life: 2 });
          bullets.push(drop);
          falling.push(drop);
        }
        forming = forming.filter((f) => !f.done);
        for (const d of falling) {
          if (d.y < floor) continue;
          d.life = 0;
          d.splashed = true;
          for (const dir of [-1, 1]) bullets.push(new Shot({ x: d.x, y: floor - 2, vx: dir * 36, vy: -60, gravity: 220, art: 'bbatSplash', life: 0.7 }));
        }
        falling = falling.filter((d) => !d.splashed);
      },
    };
  },

  // Echo: it squeaks (two ripples show on the wall level with you), and arcs of
  // echo go out at you in a fan of three, bouncing off the walls and coming back
  // round. Three squeaks, each from a different height.
  bbatEcho(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let squeaks = 0;
    let pending = [];
    return {
      duration: 7.0,
      update: (dt, bullets, soul) => {
        t += dt;
        if (squeaks < 3 && t >= 0.2 + squeaks * 2.0) {
          const y = clamp(soul.y + [-14, 14, 0][squeaks], box.y + 8, box.y + box.h - 8);
          const warn = 0.6;
          const marker = new Shot({ x: box.x + box.w - 4, y, harmless: true, life: warn, art: 'bbatChirp' });
          bullets.push(marker);
          pending.push({ marker, at: t + warn });
          squeaks++;
        }
        for (const p of pending) {
          // The squeak's height follows you a little, then is fixed.
          if (t < p.at - 0.3) p.marker.y = clamp(p.marker.y + (soul.y - p.marker.y) * Math.min(1, dt * 3), box.y + 8, box.y + box.h - 8);
          if (t < p.at) continue;
          p.done = true;
          const a = Math.atan2(soul.y - p.marker.y, soul.x - p.marker.x);
          for (const k of [-1, 0, 1]) {
            const b = a + k * 0.42;
            bullets.push(new Shot({ x: box.x + box.w - 4, y: p.marker.y, vx: Math.cos(b) * 66, vy: Math.sin(b) * 66, art: 'bbatEcho', bounce: true, life: 2.1 }));
          }
        }
        pending = pending.filter((p) => !p.done);
      },
    };
  },

  // Barnacles: it shakes its wings and barnacles come off, tumbling over in
  // arcs and landing on the floor of the box (one where you are heading, the others
  // either side). Where one lands it sticks and opens, and flicks its five
  // feathery arms out in a fan, up and away. Six barnacles.
  bbatBarnacles(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let thrown = 0;
    let flying = [];
    let stuck = [];
    const floor = box.y + box.h - 4;
    const heading = { x: 0 };
    let lastX = null;
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (lastX !== null && dt > 0) heading.x = heading.x * 0.85 + ((soul.x - lastX) / dt) * 0.15;
        lastX = soul.x;
        if (thrown < 6 && t >= 0.3 + thrown * 0.95) {
          const x0 = box.x + box.w + 6;
          const y0 = box.y + 8;
          const tx = thrown % 2 === 0 ? clamp(soul.x + heading.x * 0.9, box.x + 6, box.x + box.w - 6) : clamp(soul.x + (Math.random() < 0.5 ? -1 : 1) * rand(16, 28), box.x + 6, box.x + box.w - 6);
          // It flies its arc by the clock (not by speed), so it lands just where it was thrown.
          const b = new Shot({ x: x0, y: y0, warn: 0.35, art: 'bbatBarnacle', life: 3 });
          b.arc = { x0, y0, tx, start: t + 0.35, T: rand(0.9, 1.1) };
          bullets.push(b);
          flying.push(b);
          thrown++;
        }
        for (const b of flying) {
          const u = (t - b.arc.start) / b.arc.T;
          if (u < 0) continue;
          if (u < 1) {
            b.x = b.arc.x0 + (b.arc.tx - b.arc.x0) * u;
            b.y = b.arc.y0 + (floor - b.arc.y0) * u * u - 16 * Math.sin(Math.PI * u);
            continue;
          }
          b.life = 0;
          b.landed = true;
          bullets.push(new Shot({ x: b.arc.tx, y: floor - 1, harmless: true, life: 0.6, art: 'bbatBarnOpen' }));
          stuck.push({ x: b.arc.tx, at: t + 0.55 });
        }
        flying = flying.filter((b) => !b.landed);
        for (const s of stuck) {
          if (t < s.at) continue;
          s.done = true;
          // Five arms in a fan, up and out.
          for (const k of [-2, -1, 0, 1, 2]) {
            const a = -Math.PI / 2 + k * 0.36;
            bullets.push(new Shot({ x: s.x, y: floor - 3, vx: Math.cos(a) * 56, vy: Math.sin(a) * 56, art: 'bbatCirri', life: 1.7 }));
          }
        }
        stuck = stuck.filter((s) => !s.done);
      },
    };
  },

  // Swoop: a faint dotted path shows where it will fly, dipping down through
  // the box to your height and back up (it follows you until a moment before
  // it goes); then the bat swoops along it, shaking barnacle grit down as it
  // passes. Three swoops, from alternate sides, the dip a step off where you were.
  bbatSwoop(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let swoops = 0;
    let runs = [];
    const N = 7;
    const pathAt = (run, k) => {
      const u = k;
      const x = run.dir > 0 ? box.x - 10 + (box.w + 20) * u : box.x + box.w + 10 - (box.w + 20) * u;
      const y = box.y - 6 + (run.depth - (box.y - 6)) * Math.sin(Math.PI * u);
      return { x, y };
    };
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (swoops < 3 && t >= 0.2 + swoops * 2.1) {
          const run = { dir: swoops % 2 ? 1 : -1, depth: soul.y, dots: [], at: t + 0.9, bat: null, shed: 0 };
          for (let k = 1; k < N; k++) {
            const p = pathAt(run, k / N);
            const dot = new Shot({ x: p.x, y: p.y, harmless: true, life: 0.9, art: 'bbatPath' });
            run.dots.push({ dot, k: k / N });
            bullets.push(dot);
          }
          runs.push(run);
          swoops++;
        }
        for (const run of runs) {
          if (!run.bat) {
            // The dip follows you until the last third of a second.
            if (t < run.at - 0.3) {
              run.depth = clamp(soul.y + (swoops % 2 ? 6 : -6), box.y + 10, box.y + box.h - 6);
              for (const { dot, k } of run.dots) Object.assign(dot, pathAt(run, k));
            }
            if (t >= run.at) {
              const p = pathAt(run, 0);
              run.bat = new Shot({ x: p.x, y: p.y, art: run.dir > 0 ? 'bbatSwooper' : 'bbatSwooperL', life: 2 });
              run.start = t;
              bullets.push(run.bat);
            }
            continue;
          }
          const u = (t - run.start) / 1.25;
          if (u >= 1) { run.bat.life = 0; run.done = true; continue; }
          Object.assign(run.bat, pathAt(run, u));
          run.shed -= dt;
          if (run.shed <= 0 && run.bat.x > box.x + 4 && run.bat.x < box.x + box.w - 4) {
            run.shed = 0.2;
            bullets.push(new Shot({ x: run.bat.x, y: run.bat.y + 3, vx: rand(-8, 8), vy: 24, gravity: 90, art: 'bbatGrit', life: 1.2 }));
          }
        }
        runs = runs.filter((run) => !run.done);
      },
    };
  },
};

// Aimed drips and barnacles on top (see snipes.js), so running one way all turn (along the
// floor under the barnacles, say) never works.
BARNACLE_BAT_ATTACKS.bbatEcho = withSnipes(BARNACLE_BAT_ATTACKS.bbatEcho, { art: 'bbatBarnacle', count: 3, first: 1.4, every: 1.8, lead: [0.9, 'mean', 0.5] });
BARNACLE_BAT_ATTACKS.bbatBarnacles = withSnipes(BARNACLE_BAT_ATTACKS.bbatBarnacles, { art: 'bbatDrop', count: 4, first: 1.2, every: 1.4, lead: [0.9, 'mean', 0.9, 'mean'] });
BARNACLE_BAT_ATTACKS.bbatSwoop = withSnipes(BARNACLE_BAT_ATTACKS.bbatSwoop, { art: 'bbatDrop', count: 4, first: 1.0, every: 1.3, lead: [0.9, 'mean', 0.5, 'mean'] });
