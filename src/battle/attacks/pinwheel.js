import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { withSnipes } from './snipes.js';

// The Pinwheel's attacks. It's a sea urchin, so it's all spines: fans of
// them thrown from its side or from above, a rolling ball of them across
// the box (shedding as it goes; the row follows you, and a second one rolls a step off it), a rain of them from the ceiling (each shows
// where it will drop), and mines of them that bristle, then burst. It
// stands to the right of the box.

const SPINE = { s: '#5a2f94', S: '#8a58d0', t: '#ff9ad0', T: '#ffd6ec', k: '#1a1030', p: '#7a46b8', P: '#a574e0', g: '#ffd24a', d: '#4a2a78' };

// A spine pointing right.
defineBulletArt('pinSpine', {
  frames: [['..ss.....', 'ssSSSSStT', '..ss.....']],
  palette: SPINE,
  radius: 2,
  rotate: true,
});

// A short spine (a burst's).
defineBulletArt('pinQuill', {
  frames: [['.ss..', 'sSSTT', '.ss..']],
  palette: SPINE,
  radius: 1.8,
  rotate: true,
});

// A whole rolling urchin, spinning.
function ball(size, spikes) {
  const c = (size - 1) / 2;
  const g = new Pix(size, size);
  for (let i = 0; i < spikes; i++) {
    const a = (i / spikes) * Math.PI * 2;
    g.line(c + Math.cos(a) * 4, c + Math.sin(a) * 4, c + Math.cos(a) * (c - 0.3), c + Math.sin(a) * (c - 0.3), i % 2 ? 'S' : 's');
    g.set(c + Math.cos(a) * (c - 0.3), c + Math.sin(a) * (c - 0.3), 't');
  }
  g.disc(c, c, c * 0.52, c * 0.52, 'p');
  g.disc(c - 1, c - 1.5, c * 0.3, c * 0.25, 'P', 'p');
  g.set(c - 1.5, c - 0.5, 'k');
  g.set(c + 1.5, c - 0.5, 'k');
  g.line(c - 1, c + 1.5, c + 1, c + 1.5, 'k');
  return g.rows();
}
defineBulletArt('pinBall', { frames: [ball(17, 14)], palette: SPINE, radius: 6.6, spin: 3.2 });

// A mine: a small urchin, pulsing its spines out and in (harmless until it bursts).
defineBulletArt('pinMine', { frames: [ball(11, 8), ball(13, 10)], palette: SPINE, radius: 1, frameSeconds: 0.18 });

// Where a spine will fall (harmless): a pink tick.
defineBulletArt('pinTick', {
  frames: [['..t..', '.ttt.', '..t..'], ['.....', '..t..', '.....']],
  palette: SPINE,
  radius: 1,
  frameSeconds: 0.1,
});

export const PINWHEEL_ATTACKS = {
  // Fans: five spines at a time thrown at where you are, spread a hand apart
  // (they blink first, so you can see the way they point). One volley from the
  // right, one from the top, then from the right again.
  pinFan(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let volleys = 0;
    let next = 0.2;
    const last = { x: null, y: null };
    const drift = { x: 0, y: 0 };
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (last.x !== null && dt > 0) {
          drift.x = drift.x * 0.9 + ((soul.x - last.x) / dt) * 0.1;
          drift.y = drift.y * 0.9 + ((soul.y - last.y) / dt) * 0.1;
        }
        last.x = soul.x;
        last.y = soul.y;
        if (t < next || volleys >= 4 || t > 5.2) return;
        next = t + 1.45;
        const top = volleys % 2 === 1;
        const from = top
          ? { x: clamp(soul.x + rand(-20, 20), box.x + 8, box.x + box.w - 8), y: box.y - 2 }
          : { x: box.x + box.w + 4, y: rand(box.y + 12, box.y + box.h - 12) };
        // A fan right at you, and a thinner one a little ahead of where you are heading.
        for (const [lead, count, spread] of [[0.1, 5, 0.22], [0.75, 3, 0.2]]) {
          const tx = clamp(soul.x + drift.x * lead, box.x + 4, box.x + box.w - 4);
          const ty = clamp(soul.y + drift.y * lead, box.y + 4, box.y + box.h - 4);
          const aim = Math.atan2(ty - from.y, tx - from.x);
          for (let k = -(count - 1) / 2; k <= (count - 1) / 2; k++) {
            const a = aim + k * spread;
            bullets.push(new Shot({ x: from.x, y: from.y, vx: Math.cos(a) * 82, vy: Math.sin(a) * 82, warn: lead > 0.5 ? 0.8 : 0.6, art: 'pinSpine', life: 2.4 }));
          }
        }
        volleys++;
      },
    };
  },

  // Roll-by: a whole urchin rolls across the box along a row (the row flickers
  // first), shedding a pair of spines up and down as it goes. Three rolls, one
  // on you, the others a step to either side.
  pinRoll(box, density, { Shot, Line, rand, clamp }) {
    let t = 0;
    let rolls = 0;
    let balls = [];
    let lastY = null;
    const heading = { y: 0 };
    return {
      duration: 7.0,
      update: (dt, bullets, soul) => {
        t += dt;
        if (lastY !== null && dt > 0) heading.y = heading.y * 0.85 + ((soul.y - lastY) / dt) * 0.15;
        lastY = soul.y;
        if (rolls < 3 && t >= 0.2 + rolls * 1.85) {
          // One on your row, and a second a step off it (a different side each time).
          for (const offset of [0, rolls % 2 ? 26 : -26]) {
            const y = clamp(soul.y + offset, box.y + 9, box.y + box.h - 9);
            const warn = 0.8;
            const guide = new Line({ x: box.x - 4, y, angle: 0, length: box.w + 8, thickness: 1, warn, life: 0, color: '#ff9ad0' });
            const ball = new Shot({ x: box.x + box.w + 9, y, warn, art: 'pinBall', life: 3 });
            ball.guide = guide;
            ball.offset = offset;
            ball.shed = 0.35;
            balls.push(ball);
            bullets.push(guide, ball);
          }
          rolls++;
        }
        for (const ball of balls) {
          // The row follows you until the last moment before it rolls, then it is fixed.
          if (ball.age < ball.warn - 0.15) {
            const y = clamp(soul.y + ball.offset + heading.y * 0.25, box.y + 9, box.y + box.h - 9);
            ball.y = y;
            ball.guide.y = y;
          }
          if (ball.age < ball.warn) continue;
          if (!ball.rolling) {
            ball.rolling = true;
            ball.vx = -88;
          }
          ball.shed -= dt;
          if (ball.shed <= 0 && ball.x > box.x + 6) {
            ball.shed = 0.34;
            for (const dir of [-1, 1]) bullets.push(new Shot({ x: ball.x, y: ball.y, vx: 8, vy: dir * 52, art: 'pinQuill', life: 1.5, angle: dir * Math.PI / 2 }));
          }
        }
        balls = balls.filter((ball) => ball.x > box.x - 14);
      },
    };
  },

  // Spine rain: spines drop from the top of the box, each ticking pink where it
  // will fall just before. One in three comes down on your column.
  pinRain(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let next = 0.2;
    let count = 0;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || t > 5) return;
        next = t + 0.17;
        const aimed = count % 3 === 0;
        const x = aimed ? clamp(soul.x + rand(-5, 5), box.x + 5, box.x + box.w - 5) : rand(box.x + 5, box.x + box.w - 5);
        bullets.push(new Shot({ x, y: box.y + 4, harmless: true, life: 0.55, art: 'pinTick' }));
        bullets.push(new Shot({ x, y: box.y + 3, vy: 96, warn: 0.55, art: 'pinSpine', life: 2.2, angle: Math.PI / 2 }));
        count++;
      },
    };
  },

  // Mines: little urchins appear in the box, one by you, and swell. Then each
  // bursts into a ring of eight quills and a slower ring behind it. Three
  // rounds.
  pinBurst(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let rounds = 0;
    let mines = [];
    return {
      duration: 7.0,
      update: (dt, bullets, soul) => {
        t += dt;
        if (rounds < 3 && t >= 0.2 + rounds * 2.0) {
          const side = rand(0, Math.PI * 2);
          const pts = [{ x: clamp(soul.x + Math.cos(side) * rand(18, 24), box.x + 9, box.x + box.w - 9), y: clamp(soul.y + Math.sin(side) * rand(18, 24), box.y + 9, box.y + box.h - 9) }];
          let tries = 0;
          while (pts.length < 3 && tries < 40) {
            tries++;
            const p = { x: rand(box.x + 9, box.x + box.w - 9), y: rand(box.y + 9, box.y + box.h - 9) };
            if (pts.every((q) => Math.hypot(p.x - q.x, p.y - q.y) > 24)) pts.push(p);
          }
          pts.forEach((p, i) => {
            const fuse = 0.95 + i * 0.16;
            bullets.push(new Shot({ x: p.x, y: p.y, harmless: true, life: fuse, art: 'pinMine' }));
            mines.push({ at: t + fuse, p, turn: rand(0, Math.PI / 4) });
          });
          rounds++;
        }
        for (const m of mines) {
          if (t < m.at) continue;
          m.done = true;
          for (let k = 0; k < 8; k++) {
            const a = m.turn + (k / 8) * Math.PI * 2;
            bullets.push(new Shot({ x: m.p.x, y: m.p.y, vx: Math.cos(a) * 70, vy: Math.sin(a) * 70, art: 'pinQuill', life: 1.5 }));
          }
          for (let k = 0; k < 8; k++) {
            const a = m.turn + Math.PI / 8 + (k / 8) * Math.PI * 2;
            bullets.push(new Shot({ x: m.p.x, y: m.p.y, vx: Math.cos(a) * 38, vy: Math.sin(a) * 38, warn: 0.35, art: 'pinQuill', life: 1.5 }));
          }
        }
        mines = mines.filter((m) => !m.done);
      },
    };
  },
};

// Aimed shots on top, so standing still or running one way is never safe (see snipes.js).
PINWHEEL_ATTACKS.pinRoll = withSnipes(PINWHEEL_ATTACKS.pinRoll, { art: 'pinQuill' });
