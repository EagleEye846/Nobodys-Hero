import { defineBulletArt } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { Ring } from './underShapes.js';
import { PathShot, Deco, Zone, blit } from './coastKit.js';

// The Powder Monkey's attacks. The gunner's boy of the Fair Return, ten
// years old and still running powder to the guns, where everything goes
// off slowly because a boy with a match is told to be careful:
//   - Rolling kegs: kegs roll along the rows and burst only when they hit
//     the far wall, throwing splinters back the way they came.
//   - The long fuse: a spark runs along a fuse to a keg by you; when it gets
//     there, the keg goes up. Watch the spark.
//   - Fire on the word: he loads the gun ports one by one (each glows), and
//     on FIRE! every loaded gun goes off at once along its row.
// He stands to the right of the box.

const P = {
  k: '#1c1a1c', q: '#303034', Q: '#585860', C: '#9a9a84', w: '#f4f0dc', o: '#ff9a2a', O: '#ffe070', r: '#c8442a', R: '#6a2a1c',
  h: '#4a3a30', H: '#74604c', b: '#c8a448', B: '#80601c', g: '#a8b4ac', G: '#68807a', s: '#cfd4c8', S: '#8c948c', d: '#3e3e36',
};

// Round shot, a cannonball with a fuse spark on it: it rolls (spins), cold iron.
defineBulletArt('monkeyShot', {
  frames: [
    art(11, 11, (p) => { p.ellipse(5, 5, 4.6, 4.6, 'q'); p.ellipse(4, 4, 2, 1.6, 'Q'); p.set(3, 3, 'C'); p.set(7, 7, 'k'); p.set(8, 2, 'o'); p.set(9, 1, 'O'); }),
    art(11, 11, (p) => { p.ellipse(5, 5, 4.6, 4.6, 'q'); p.ellipse(4, 4, 2, 1.6, 'Q'); p.set(3, 3, 'C'); p.set(7, 7, 'k'); p.set(8, 2, 'O'); p.set(9, 1, 'o'); }),
  ],
  palette: P,
  radius: 4.6,
  frameSeconds: 0.1,
  spin: 5,
});

// A splinter off the keg: a long sliver of oak with a scorched end.
defineBulletArt('monkeySplinter', {
  frames: [art(11, 5, (p) => { p.poly([[0, 2], [8, 0], [10, 2], [8, 4]], 'H'); p.line(1, 2, 8, 1, 'b'); p.rect(7, 1, 3, 3, 'R'); p.set(9, 2, 'o'); })],
  palette: P,
  radius: 3,
  rotate: true,
});

// The keg itself (a pip that shows where it sits: harmless until it goes).
defineBulletArt('monkeyKeg', {
  frames: [
    art(13, 13, (p) => { p.ellipse(6, 6, 5.4, 5.8, 'h'); p.rect(1, 3, 11, 1, 'B'); p.rect(1, 9, 11, 1, 'B'); p.line(3, 2, 3, 10, 'H'); p.rect(5, 0, 3, 2, 'q'); p.set(6, 0, 'o'); }),
    art(13, 13, (p) => { p.ellipse(6, 6, 5.4, 5.8, 'h'); p.rect(1, 3, 11, 1, 'B'); p.rect(1, 9, 11, 1, 'B'); p.line(3, 2, 3, 10, 'H'); p.rect(5, 0, 3, 2, 'q'); p.set(6, 0, 'O'); }),
  ],
  palette: P,
  radius: 1,
  frameSeconds: 0.12,
});

// The fuse's spark, creeping along the deck toward the keg (harmless).
defineBulletArt('monkeySpark', {
  frames: [
    art(5, 5, (p) => { p.set(2, 2, 'O'); p.set(1, 2, 'o'); p.set(3, 2, 'o'); p.set(2, 1, 'o'); p.set(2, 3, 'o'); }),
    art(5, 5, (p) => { p.set(2, 2, 'w'); p.set(1, 1, 'o'); p.set(3, 3, 'o'); p.set(3, 1, 'O'); p.set(1, 3, 'O'); }),
  ],
  palette: P,
  radius: 1,
  frameSeconds: 0.08,
});

// A puff of powder smoke, grey and slow (harmless: it only hides things a little).
defineBulletArt('monkeySmoke', {
  frames: [art(15, 11, (p) => { p.ellipse(7, 6, 6.4, 4, 'g'); p.ellipse(5, 4, 3.2, 2.4, 's'); p.ellipse(10, 7, 3, 2.2, 'G'); }, false)],
  palette: P,
  radius: 1,
  rim: false,
  frameSeconds: 0.5,
});

// Burning wadding falling out of the smoke: a scrap of scorched cloth, still alight.
defineBulletArt('monkeyEmber', {
  frames: [
    art(7, 7, (p) => { p.ellipse(3, 3, 2.6, 2.6, 'r'); p.ellipse(3, 3, 1.4, 1.4, 'o'); p.set(3, 3, 'O'); p.set(1, 5, 'R'); }),
    art(7, 7, (p) => { p.ellipse(3, 3, 2.6, 2.6, 'R'); p.ellipse(3, 3, 1.4, 1.4, 'r'); p.set(3, 3, 'o'); p.set(5, 1, 'O'); }),
  ],
  palette: P,
  radius: 2.6,
  frameSeconds: 0.15,
});

// The slow-match's own flicker, as a thrown spark.
defineBulletArt('monkeyFlick', {
  frames: [art(7, 7, (p) => { p.set(3, 3, 'w'); p.set(2, 3, 'O'); p.set(4, 3, 'O'); p.set(3, 2, 'o'); p.set(3, 4, 'o'); p.set(1, 3, 'r'); p.set(5, 3, 'r'); })],
  palette: P,
  radius: 2.4,
  spin: 6,
});

// A powder keg rolling along the deck (it hurts while it rolls).
defineBulletArt('monkeyKegRoll', {
  frames: [
    art(13, 13, (p) => { p.ellipse(6, 6, 5.4, 5.8, 'h'); p.rect(1, 3, 11, 1, 'B'); p.rect(1, 9, 11, 1, 'B'); p.line(3, 2, 3, 10, 'H'); }),
    art(13, 13, (p) => { p.ellipse(6, 6, 5.4, 5.8, 'h'); p.rect(3, 1, 1, 11, 'B'); p.rect(9, 1, 1, 11, 'B'); p.line(2, 3, 10, 3, 'H'); }),
  ],
  palette: P,
  radius: 5,
  frameSeconds: 0.12,
});
// A gun port in the ship's side, shut, or loaded and glowing at the touch-hole.
const port = (lit) => art(9, 9, (p) => { p.rect(0, 0, 9, 9, 'h'); p.rect(1, 1, 7, 7, 'q'); p.ellipse(4, 4, 2.4, 2.4, 'k'); if (lit) { p.set(4, 0, 'O'); p.set(3, 0, 'o'); p.set(5, 0, 'o'); } });
defineBulletArt('monkeyPort', { frames: [port(false)], palette: P, radius: 1 });
defineBulletArt('monkeyPortLit', { frames: [port(true), port(false)], palette: P, radius: 1, frameSeconds: 0.1 });

// The word, shouted: FIRE! in little 3x5 capitals.
const SHOUT = {
  F: ['OOO', 'O..', 'OO.', 'O..', 'O..'],
  I: ['OOO', '.O.', '.O.', '.O.', 'OOO'],
  R: ['OO.', 'O.O', 'OO.', 'O.O', 'O.O'],
  E: ['OOO', 'O..', 'OO.', 'O..', 'OOO'],
  '!': ['.O.', '.O.', '.O.', '...', '.O.'],
};

export const POWDER_MONKEY_ATTACKS = {
  // Rolling kegs: he trundles powder kegs down the deck along the rows. A
  // keg doesn't go off till it fetches up against the far side, and then
  // it bursts, throwing splinters back the way it came. So the wall's
  // the danger, and the splinters come back at you.
  monkeyKeg(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const SPEED = 76;
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + n * 0.7) && n < 9) {
          n++;
          const y = n % 2 ? soul.y : rand(box.y + 8, box.y + box.h - 8);
          const x0 = box.x + box.w + 8;
          const x1 = box.x + 6;
          const WARN = 0.4;
          const roll = (x0 - x1) / SPEED;
          bullets.push(new PathShot({ art: 'monkeyKegRoll', warn: WARN, life: roll, path: (k) => ({ x: x0 - SPEED * Math.min(k, roll), y }) }));
          for (const o of [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9]) {
            bullets.push(new Shot({ x: x1, y, vx: Math.cos(o) * 80, vy: Math.sin(o) * 80, art: 'monkeySplinter', warn: WARN + roll, life: 1.3 }));
          }
        }
      },
    };
  },

  // The long fuse: he lays a fuse across the deck to a keg and lights it.
  // The spark runs along the fuse (it burns, so keep off it), and when it
  // reaches the keg, the keg goes up in a ring of splinters. Watch the spark,
  // not the keg: it tells you when.
  monkeyFuse(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const RUN = 1.3;
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + n * 1.0) && n < 5) {
          n++;
          // The keg sits near you; the fuse snakes in to it from the right wall.
          const keg = { x: Math.min(Math.max(soul.x + rand(-10, 10), box.x + 10), box.x + box.w - 10), y: Math.min(Math.max(soul.y + rand(-10, 10), box.y + 10), box.y + box.h - 10) };
          const start = { x: box.x + box.w - 2, y: rand(box.y + 8, box.y + box.h - 8) };
          const wig = rand(8, 14) * (Math.random() < 0.5 ? -1 : 1);
          const along = (u) => ({ x: start.x + (keg.x - start.x) * u, y: start.y + (keg.y - start.y) * u + Math.sin(u * Math.PI * 2) * wig });
          bullets.push(new Deco({ life: RUN + 0.3, paint(ctx, d) {
            const burnt = Math.min(1, d.age / RUN);
            ctx.strokeStyle = '#4a3a30';
            ctx.lineWidth = 2;
            ctx.setLineDash([2, 1]);
            ctx.beginPath();
            for (let u = burnt; u <= 1.001; u += 0.04) { const p = along(u); if (u === burnt) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }
            ctx.stroke();
          } }));
          bullets.push(new PathShot({ art: 'monkeySpark', life: RUN, path: (k) => along(Math.min(1, k / RUN)) }));
          const kegPip = new Shot({ x: keg.x, y: keg.y, harmless: true, art: 'monkeyKeg' });
          kegPip.life = RUN;
          bullets.push(kegPip);
          for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2 + n;
            bullets.push(new Shot({ x: keg.x, y: keg.y, vx: Math.cos(a) * 66, vy: Math.sin(a) * 66, art: 'monkeySplinter', warn: RUN, life: 1.2 }));
          }
          bullets.push(new Zone({ x: keg.x, y: keg.y, r: 9, warn: RUN, life: 0.2, paint(ctx, z) {
            if (z.age < z.warn) return;
            ctx.fillStyle = '#ffe070';
            ctx.beginPath();
            ctx.arc(z.x, z.y, 9, 0, Math.PI * 2);
            ctx.fill();
          } }));
        }
      },
    };
  },

  // Fire on the word: a row of gun ports down the right side of the box. He
  // runs along them loading one gun after another (each loaded port's
  // touch-hole glows), and then the word comes, FIRE!, and every loaded gun
  // goes off at once, straight across. Count the glowing ports.
  monkeyBroadside(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const ROWS = 6;
    const rowY = (i) => box.y + 7 + i * ((box.h - 14) / (ROWS - 1));
    let t = 0;
    let made = false;
    const loaded = [];
    const glowing = [];
    const plan = [];
    // Three volleys: load five of the six guns, a beat apart, then FIRE.
    for (let v = 0; v < 3; v++) {
      for (let i = 0; i < 5; i++) plan.push({ at: 0.3 + v * 2 + i * 0.26, kind: 'load' });
      plan.push({ at: 0.3 + v * 2 + 1.5, kind: 'fire' });
    }
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!made) {
          made = true;
          for (let i = 0; i < ROWS; i++) {
            const s = new Shot({ x: box.x + box.w - 5, y: rowY(i), harmless: true, art: 'monkeyPort' });
            s.life = 7;
            bullets.push(s);
          }
        }
        while (plan.length && t >= T(plan[0].at)) {
          const step = plan.shift();
          if (step.kind === 'load') {
            // The first gun loaded each volley is the one on your row.
            const free = [...Array(ROWS).keys()].filter((i) => !loaded.includes(i));
            const mine = Math.round(((soul.y - box.y - 7) / (box.h - 14)) * (ROWS - 1));
            const i = loaded.length === 0 && free.includes(mine) ? mine : free[Math.floor(rand(0, free.length))];
            loaded.push(i);
            const lit = new Shot({ x: box.x + box.w - 5, y: rowY(i), harmless: true, art: 'monkeyPortLit' });
            lit.life = 3;
            glowing.push(lit);
            bullets.push(lit);
          } else {
            for (const g of glowing.splice(0)) g.life = g.age;
            bullets.push(new Deco({ life: 0.7, paint(ctx, d) {
              [...'FIRE!'].forEach((ch, j) => blit(ctx, SHOUT[ch], P, box.x + box.w / 2 - 10 + j * 5, box.y + 6 - d.age * 4));
            } }));
            for (const i of loaded.splice(0)) {
              bullets.push(new Shot({ x: box.x + box.w - 5, y: rowY(i), vx: -140, art: 'monkeyShot', warn: 0.3, life: 1.4 }));
              bullets.push(new Shot({ x: box.x + box.w - 2, y: rowY(i), vx: -30, art: 'monkeySmoke', harmless: true, life: 0.6 }));
            }
          }
        }
      },
    };
  },
};
