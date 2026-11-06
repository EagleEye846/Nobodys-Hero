import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/ch5Kit.js';

// The Dunlin Dancer's attacks. Five sandpipers that move as one, so
// everything comes in rows and waves: whole rows of little running birds
// scurrying across the box with a gap or two, a rain of diving beaks that
// all come down at the same slant, and a flyover that drops shells (they hit
// the floor and bounce). It stands to the right of the box, so the runners
// come in from that side.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The attack's own clock (`t`) runs `density`
// times faster than the seconds on the wall, hence the `T` below.

const DUN = { k: '#1c1a1e', b: '#a89478', B: '#7c6a54', r: '#c0703e', w: '#f4efe4', K: '#3a3436', l: '#6a5a4a', o: '#e0a060', s: '#d8c8a0', S: '#a8946a', e: '#ffffff' };

function art(w, h, draw) {
  const p = new Pix(w, h);
  draw(p);
  return p.outline('k').rows();
}

// A tiny running sandpiper, facing left, two frames of legs.
const runner = (a) => art(13, 10, (p) => {
  p.ellipse(7, 3.5, 4.4, 2.1, 'b');
  p.ellipse(6.5, 4.4, 3.4, 1, 'w');
  p.ellipse(8.4, 2.6, 2.4, 0.9, 'r');
  p.ellipse(2.4, 2.4, 1.7, 1.5, 'b');
  p.set(1.6, 1.8, 'e');
  p.line(0, 2.8, -2, 3.8, 'K');
  p.line(6, 5, 5 + a * 2.5, 9, 'o');
  p.line(8, 5, 9 - a * 2.5, 9, 'o');
  p.line(11, 3, 13, 4, 'B');
});
defineBulletArt('dunRunner', { frames: [runner(1), runner(-1)], palette: DUN, radius: 3.2, frameSeconds: 0.09 });

// A diving beak, pointing right: a thin black dagger on a little head.
defineBulletArt('dunBeak', {
  frames: [art(13, 5, (p) => { p.ellipse(2.5, 2, 2.3, 2, 'b'); p.set(2, 1, 'e'); p.line(4, 2, 11, 2, 'K', 1); p.set(11, 2, 'k'); })],
  palette: DUN,
  radius: 2.2,
  rotate: true,
});

// A cockle shell, ridged, spinning.
defineBulletArt('dunShell', {
  frames: [art(9, 8, (p) => { p.poly([[4, 0], [8, 5], [6, 7], [2, 7], [0, 5]], 's'); p.line(4, 1, 4, 6, 'S'); p.line(2, 2, 2, 6, 'S'); p.line(6, 2, 6, 6, 'S'); })],
  palette: DUN,
  radius: 3.4,
  spin: 4,
});

// The flock overhead (harmless): a bird with its wings up, then down.
const fly = (down) => art(15, 9, (p) => {
  p.ellipse(7, 4.5, 3.6, 2, 'b');
  p.ellipse(2.5, 3.8, 1.6, 1.4, 'b');
  p.line(0, 4.2, -1, 4.8, 'k');
  p.line(7, 3, 11, down ? 7 : 0, 'B', 3);
  p.line(7, 3, 4, down ? 8 : 0, 'B', 3);
  p.line(10, 5, 14, 6, 'B');
});
defineBulletArt('dunFlyer', { frames: [fly(false), fly(true)], palette: DUN, radius: 1, frameSeconds: 0.18 });

export const DUNLIN_DANCER_ATTACKS = {
  // Wave run: whole rows of little running dunlin cross the box one lane
  // after another, each row starting a beat after the last so the wave
  // rolls down the box. Three neighbouring lanes are left empty, never the
  // ones you're in.
  dunWave(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.2);
    let waves = 0;
    const queue = [];
    const LANES = 8;
    const laneY = (i) => box.y + 6 + i * ((box.h - 12) / (LANES - 1));
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && waves < 4 && t < T(5)) {
          waves++;
          next = t + T(1.5);
          const mine = Math.round(((soul.y - box.y - 6) / (box.h - 12)) * (LANES - 1));
          let gap = Math.floor(rand(0, LANES - 3));
          if (mine >= gap - 1 && mine <= gap + 4) gap = mine < LANES / 2 ? LANES - 4 : 0;
          const down = Math.random() < 0.5;
          for (let k = 0; k < LANES; k++) {
            const lane = down ? k : LANES - 1 - k;
            if (lane >= gap && lane <= gap + 3) continue;
            queue.push({ at: t + T(k * 0.09), y: laneY(lane) });
          }
        }
        for (const q of queue) {
          if (t < q.at) continue;
          q.done = true;
          for (let n = 0; n < 3; n++) bullets.push(new Shot({ x: box.x + box.w + 6 + n * 13, y: q.y, vx: -48, art: 'dunRunner', life: 4 }));
        }
        for (let i = queue.length - 1; i >= 0; i--) if (queue[i].done) queue.splice(i, 1);
      },
    };
  },

  // Peck rain: beaks dive out of the sky all on the same slant, a curtain of
  // them, a couple aimed straight at you.
  dunPeck(box, density, { Shot, every, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let flip = 1;
    let nextFlip = T(3.2);
    const rain = every(0.24, 0.34, (bullets, soul) => {
      const aimed = Math.random() < 0.2;
      const vx = -30 * flip;
      const vy = 52;
      // Slant: they start high and to the side, so they cross the box on a diagonal.
      const x = aimed ? soul.x - vx * ((soul.y - (box.y - 4)) / vy) : rand(box.x - 30, box.x + box.w + 30);
      bullets.push(new Shot({ x: clamp(x, box.x - 40, box.x + box.w + 40), y: box.y - 5, vx, vy, art: 'dunBeak', life: 3 }));
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= nextFlip) {
          nextFlip = Infinity;
          flip = -1;
        }
        if (t < T(5.6)) rain(dt, bullets, soul);
      },
    };
  },

  // Dropped shells: the flock flies over the top of the box, one bird after
  // another, and each lets go a cockle shell above where you were. The shells
  // hit the floor and bounce.
  dunShells(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.2);
    let flights = 0;
    const live = [];
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && flights < 7 && t < T(5.4)) {
          const fromRight = flights % 2 === 0;
          flights++;
          next = t + T(0.72);
          const aim = clamp(soul.x + rand(-14, 14), box.x + 8, box.x + box.w - 8);
          const speed = 70;
          const startX = fromRight ? box.x + box.w + 14 : box.x - 14;
          const bird = new Shot({ x: startX, y: box.y + 4, vx: fromRight ? -speed : speed, harmless: true, life: 3, art: 'dunFlyer' });
          bullets.push(bird);
          // It drops its shell when it's over the mark.
          live.push({ bird, x: aim, fromRight });
        }
        for (const d of live) {
          if (d.fromRight ? d.bird.x > d.x : d.bird.x < d.x) continue;
          d.done = true;
          bullets.push(new Shot({ x: d.x, y: box.y + 6, vy: 8, gravity: 105, bounce: true, art: 'dunShell', life: 3.4 }));
        }
        for (let i = live.length - 1; i >= 0; i--) if (live[i].done) live.splice(i, 1);
      },
    };
  },
};
