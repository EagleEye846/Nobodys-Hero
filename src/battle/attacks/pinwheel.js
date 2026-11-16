import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { PathShot, Zone, Deco, Tether, blit } from './coastKit.js';

// The Pinwheel's attacks. A cross violet sea urchin that bristles at
// anything that might step on it, which is everything:
//   - Don't tread on me: a moment after you pass, an urchin pokes up where
//     your feet were. Don't go back the way you came, or stand still.
//   - Bounce: it rolls about the box in a fury, and every wall it hits
//     shakes a fan of spines off it, back into the box.
//   - Which way the wind blows: it turns as a pinwheel of spines, and when
//     the streamer at the top flips, it jerks round the other way.
// It sits to the right of the box.

const SPINE = { s: '#5a2f94', S: '#8a58d0', t: '#ff9ad0', T: '#ffd6ec', k: '#1a1030', p: '#7a46b8', P: '#a574e0', g: '#ffd24a', d: '#4a2a78' };

// A spine pointing right.
defineBulletArt('pinSpine', {
  frames: [['..ss.....', 'ssSSSSStT', '..ss.....']],
  palette: SPINE,
  radius: 2,
  rotate: true,
});

// A short spine (a burst's). (Lighter since 2026-11-08: the dark purple one
// was hard to pick out in the box.)
defineBulletArt('pinQuill', {
  frames: [['.SS..', 'SPPTT', '.SS..']],
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

// A mine about to burst (harmless): its spines all the way out, tipped gold,
// blinking for a moment over the mine before it goes.
defineBulletArt('pinMineHot', { frames: [ball(15, 12).map((r) => r.replace(/t/g, 'g'))], palette: SPINE, radius: 1 });

// Where a spine will fall (harmless): a pink tick.
defineBulletArt('pinTick', {
  frames: [['..t..', '.ttt.', '..t..'], ['.....', '..t..', '.....']],
  palette: SPINE,
  radius: 1,
  frameSeconds: 0.1,
});

const BUD = ball(11, 8);
const SAND = { ...SPINE, y: '#d8c890', Y: '#a89860' };

// Bouncing about inside the box, worked out from where it started: where it
// is after k seconds, and how many times it has hit a wall on that axis.
const bounce = (v, p0, lo, hi, k) => {
  const span = hi - lo;
  const raw = p0 - lo + v * k;
  let d = raw % (2 * span);
  if (d < 0) d += 2 * span;
  return { at: lo + (d > span ? 2 * span - d : d), hits: Math.floor(raw / span) };
};

export const PINWHEEL_ATTACKS = {
  // Don't tread on me: it's cross with anything that steps on it, so its
  // little cousins wait under the sand wherever you've walked. A moment
  // after you pass, the sand puffs where your feet were, and a spiny
  // urchin pokes up there. Don't go back the way you came, and don't stand still.
  pinTread(box, density) {
    const LAG = 0.4;
    const PUFF = 0.4;
    let real = 0;
    let last = 0;
    const steps = [];
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real - last >= 0.13 && real < 6.2) {
          last = real;
          steps.push({ x: soul.x, y: soul.y, at: real });
        }
        while (steps.length && real - steps[0].at >= LAG) {
          const s = steps.shift();
          bullets.push(new Zone({ x: s.x, y: s.y, r: 4.6, warn: PUFF, life: 1.5, paint(ctx, z) {
            if (z.age < z.warn) {
              blit(ctx, ['.y.y.', 'y.Y.y', '.y.y.'], SAND, z.x, z.y + 2);
              return;
            }
            const up = Math.min(1, (z.age - z.warn) / 0.08);
            ctx.save();
            ctx.beginPath();
            ctx.rect(z.x - 7, z.y - 7, 14, 11);
            ctx.clip();
            blit(ctx, BUD, SPINE, z.x, z.y + (1 - up) * 6);
            ctx.restore();
          } }));
        }
      },
    };
  },

  // Bounce: it rolls about the box in a fury, bouncing off the walls, and
  // every time it hits a wall the jolt shakes a fan of spines off it, back
  // out into the box, away from that wall. Watch where it's going to hit next.
  pinRoll(box, density, { Shot, rand }) {
    const R = 6.6;
    const x0 = box.x + box.w - 10;
    const y0 = rand(box.y + 15, box.y + box.h - 15);
    const vx = -rand(60, 68);
    const vy = rand(40, 48) * (Math.random() < 0.5 ? -1 : 1);
    const lx = box.x + R;
    const hx = box.x + box.w - R;
    const ly = box.y + R;
    const hy = box.y + box.h - R;
    const where = (k) => ({ x: bounce(vx, x0, lx, hx, k).at, y: bounce(vy, y0, ly, hy, k).at });
    const WARN = 0.6;
    let real = 0;
    let made = false;
    let hx0 = 0;
    let hy0 = 0;
    return {
      duration: 7,
      update: (dt, bullets) => {
        real += dt / density;
        if (!made) {
          made = true;
          bullets.push(new PathShot({ art: 'pinBall', warn: WARN, life: 6.2, path: where }));
          hx0 = bounce(vx, x0, lx, hx, 0).hits;
          hy0 = bounce(vy, y0, ly, hy, 0).hits;
        }
        const k = real - WARN;
        if (k <= 0 || k > 6.2) return;
        const bx = bounce(vx, x0, lx, hx, k).hits;
        const by = bounce(vy, y0, ly, hy, k).hits;
        const p = where(k);
        const shed = (away) => {
          for (const o of [-0.7, -0.35, 0, 0.35, 0.7]) {
            bullets.push(new Shot({ x: p.x, y: p.y, vx: Math.cos(away + o) * 62, vy: Math.sin(away + o) * 62, art: 'pinSpine', life: 1.5 }));
          }
        };
        if (bx !== hx0) { shed(p.x < box.x + box.w / 2 ? 0 : Math.PI); hx0 = bx; }
        if (by !== hy0) { shed(p.y < box.y + box.h / 2 ? Math.PI / 2 : -Math.PI / 2); hy0 = by; }
      },
    };
  },

  // Which way the wind blows: it hangs in the box as a pinwheel, three long
  // arms of spines turning. A streamer at the top shows the wind; when the
  // streamer flips, a moment later the pinwheel jerks round the other way,
  // and the jolt flings spines off its tips. Watch the streamer.
  pinWind(box, density, { Shot }) {
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    const ARM = 62;
    const SPEED = 1.25;
    const FLIP = 0.6;
    // Wind changes (seconds) and the spin they set, worked out ahead.
    const changes = [1.7, 3.2, 4.6, 5.9];
    const dirAt = (k) => (changes.filter((c) => k >= c + FLIP).length % 2 ? -1 : 1);
    const windAt = (k) => (changes.filter((c) => k >= c).length % 2 ? -1 : 1);
    const turn = (k) => {
      let a = 0.4;
      let prev = 0;
      for (const c of [...changes.map((x) => x + FLIP), Infinity]) {
        const to = Math.min(k, c);
        a += dirAt(prev) * SPEED * (to - prev);
        prev = to;
        if (k <= c) break;
      }
      return a;
    };
    const WARN = 0.8;
    let real = 0;
    let made = false;
    let flung = 0;
    return {
      duration: 7,
      update: (dt, bullets) => {
        real += dt / density;
        if (!made) {
          made = true;
          for (let i = 0; i < 3; i++) {
            const off = (i / 3) * Math.PI * 2;
            bullets.push(new Tether({ warn: WARN, life: 6.2, thick: 3, color: '#a574e0', dark: '#4a2a78', ends: (k) => { const a = turn(k) + off; return [cx + Math.cos(a) * 7, cy + Math.sin(a) * 7, cx + Math.cos(a) * ARM, cy + Math.sin(a) * ARM]; } }));
          }
          bullets.push(new PathShot({ art: 'pinBall', warn: WARN, life: 6.2, path: () => ({ x: cx, y: cy }) }));
          // The streamer at the top of the box, blowing the way the wind is.
          bullets.push(new Deco({ life: 7, paint(ctx, d) {
            const w = windAt(d.age - WARN);
            ctx.strokeStyle = '#ffd6ec';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx, box.y + 3);
            for (let i = 1; i <= 5; i++) ctx.lineTo(cx + w * i * 3, box.y + 3 + Math.sin(d.age * 12 + i) * 1.5);
            ctx.stroke();
          } }));
        }
        const k = real - WARN;
        if (flung < changes.length && k >= changes[flung] + FLIP) {
          flung++;
          for (let i = 0; i < 3; i++) {
            const a = turn(k) + (i / 3) * Math.PI * 2;
            const tx = cx + Math.cos(a) * 30;
            const ty = cy + Math.sin(a) * 30;
            for (const o of [-0.3, 0.3]) bullets.push(new Shot({ x: tx, y: ty, vx: Math.cos(a + o) * 55, vy: Math.sin(a + o) * 55, art: 'pinQuill', life: 1.2 }));
          }
        }
      },
    };
  },
};
