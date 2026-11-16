import { defineBulletArt } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { Ring } from './underShapes.js';
import { Zone, Deco, shove, blit } from './coastKit.js';

// The Bellbuoy's attacks. A haunted bell buoy that still warns ships off
// rocks nobody sails past any more, so every attack is a warning, and the
// warning is the clue:
//   - On the beat: the bell tolls, and its rings only hurt while the note is
//     loud. Between tolls they hang quiet and you can walk through them.
//   - Rocks ahead: wherever the water ripples now, a rock breaks the surface
//     on the next toll.
//   - Foghorn: the horn's blast shoves you away from the buoy, and the
//     flotsam rides it. Lean into it, and mind the reef behind you.
// It stands to the right of the box, so everything comes from that side.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The attack's own clock (`t`) runs `density`
// times faster than the seconds on the wall, hence the `T` below.

const BELL = { k: '#1a1c22', n: '#8a8f98', N: '#5a5f68', w: '#e8e4d8', y: '#e8ffb0', Y: '#a8d860', v: '#4fa882', V: '#2e6a58', o: '#7ac8a0', L: '#c89a40', r: '#c8402a', R: '#7a2418', b: '#6a5a48', B: '#9a8a70', s: '#c8e8f0', S: '#78a8b8' };

// A note struck: a little pale spark at the bell each time it tolls.
defineBulletArt('buoyNote', {
  frames: [['..y..', '.yYy.', 'yYwYy', '.yYy.', '..y..'], ['.....', '..y..', '.yYy.', '..y..', '.....']],
  palette: BELL,
  radius: 1,
  frameSeconds: 0.12,
});

// A rock of the reef, wet and black with weed on it.
const ROCK = art(19, 17, (p) => {
  p.poly([[2, 16], [5, 6], [8, 9], [10, 1], [13, 7], [16, 5], [18, 16]], 'N');
  p.poly([[5, 16], [7, 10], [10, 4], [12, 10], [14, 16]], 'n');
  p.line(10, 2, 10, 6, 'w');
  p.line(3, 15, 17, 15, 'V');
  p.set(6, 13, 'v'); p.set(13, 12, 'v'); p.set(15, 14, 'v');
});

// A ring of the bell's note that only hurts while the note is loud: for
// `loud` seconds after each toll, every `period` seconds. (Every ring is made
// on a toll, so they are all loud and quiet together.)
class BeatRing extends Ring {
  constructor({ period, loud, ...rest }) {
    super(rest);
    this.period = period;
    this.loud = loud;
  }

  get ringing() {
    const k = this.age - this.warn;
    return k >= 0 && k % this.period < this.loud;
  }

  get active() {
    return super.active && this.ringing;
  }

  draw(ctx) {
    if (this.age >= this.warn && !this.ringing) {
      // Quiet: a faint dotted ghost of the ring, so you can see it coming.
      const keep = { alpha: this.alpha, dash: this.dash, thick: this.thick, glow: this.glow };
      Object.assign(this, { alpha: 0.3, dash: [2, 3], thick: 1, glow: null });
      super.draw(ctx);
      Object.assign(this, keep);
      return;
    }
    super.draw(ctx);
  }
}

// The bell itself at the right of the box, swinging, flashing when it tolls.
const bellDeco = (box, life, period) => new Deco({
  x: box.x + box.w - 6,
  y: box.y + box.h / 2,
  life,
  paint(ctx, d) {
    const k = d.age % period;
    const lit = k < 0.3;
    const sway = Math.sin(d.age * Math.PI * 2 / period) * 2;
    ctx.fillStyle = lit ? '#e8ffb0' : '#8a8f98';
    ctx.strokeStyle = '#1a1c22';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(d.x - 4 + sway, d.y + 5);
    ctx.lineTo(d.x - 2 + sway, d.y - 4);
    ctx.lineTo(d.x + 2 + sway, d.y - 4);
    ctx.lineTo(d.x + 4 + sway, d.y + 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },
});

export const BELLBUOY_ATTACKS = {
  // On the beat: the bell tolls once a beat and sends a ring of its note
  // across the box. Every ring is loud for a moment after each toll and quiet
  // the rest of the beat, so the way through is to step across a ring just
  // after the note dies away. Tolls alternate high and low on the buoy.
  buoyToll(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const PERIOD = 1.05;
    let t = 0;
    let n = 0;
    let started = false;
    return {
      duration: 7,
      update: (dt, bullets) => {
        t += dt;
        if (!started) {
          started = true;
          bullets.push(bellDeco(box, 7, PERIOD));
        }
        // The first toll comes at 0.5 (the warning), then one a beat.
        const due = T(0.5 + n * PERIOD);
        if (t >= due && n < 7) {
          n++;
          const x = box.x + box.w + 9;
          const y = box.y + box.h * (n % 2 ? 0.3 : 0.7);
          // Each ring spreads at its own pace, so no spot is always crossed in the quiet.
          bullets.push(new BeatRing({ x, y, r: 4, grow: rand(30, 50), thick: 5, life: 5, period: PERIOD, loud: 0.5, color: '#e8ffb0', glow: '#a8d860' }));
          bullets.push(new Shot({ x: x - 5, y, harmless: true, life: 0.4, art: 'buoyNote' }));
        }
      },
    };
  },

  // Rocks ahead: the water ripples over a rock, and on the next toll the rock
  // breaks the surface there and stays up for a moment before it sinks. One
  // rock is always under where you are when it ripples; the next ripples
  // appear as the last rocks rise, so the rule is: leave the ripples.
  buoyReef(box, density, { rand }) {
    const T = (s) => s * density;
    const BEAT = 1.15;
    let t = 0;
    let n = 0;
    const rock = (x, y) => new Zone({
      x, y, r: 9.5, warn: BEAT, life: 0.8,
      paint(ctx, z) {
        if (z.age < z.warn) {
          // The ripple over it: two flat rings that widen as the toll nears.
          const g = z.age / z.warn;
          ctx.strokeStyle = '#c8e8f0';
          ctx.lineWidth = 1;
          for (const s of [0.5, 1]) {
            ctx.beginPath();
            ctx.ellipse(z.x, z.y + 3, 4 + 6 * g * s, (4 + 6 * g * s) * 0.45, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
          return;
        }
        const rise = Math.min(1, (z.age - z.warn) / 0.08);
        ctx.save();
        ctx.beginPath();
        ctx.rect(z.x - 12, z.y - 12, 24, 20);
        ctx.clip();
        blit(ctx, ROCK, BELL, z.x, z.y + (1 - rise) * 10);
        ctx.restore();
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(z.x, z.y + 7, 10, 2.5, 0, 0, Math.PI * 2);
        ctx.stroke();
      },
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + n * BEAT) && n < 5) {
          n++;
          bullets.push(rock(soul.x + rand(-3, 3), soul.y + rand(-3, 3)));
          // Four more spread about, not on top of the first.
          for (let i = 0; i < 4; i++) {
            let x;
            let y;
            let tries = 0;
            do {
              x = rand(box.x + 10, box.x + box.w - 10);
              y = rand(box.y + 10, box.y + box.h - 10);
              tries++;
            } while (tries < 20 && Math.hypot(x - soul.x, y - soul.y) < 24);
            bullets.push(rock(x, y));
          }
        }
      },
    };
  },

  // Foghorn: the horn draws breath (grey lines of fog gather on the right),
  // then blasts: for a long second everything in the box is shoved away from
  // the buoy, and spars of wreck come riding the blast along the rows. On the
  // far side there's a reef along the wall. Hold your ground into the blast
  // and slip the spars. Four blasts.
  buoyHorn(box, density, { rand }) {
    const T = (s) => s * density;
    const WARN = 0.75;
    const BLAST = 1.1;
    const EVERY = 1.65;
    let t = 0;
    let n = 0;
    let blastEnd = -1;
    let made = false;
    const blastPaint = (ctx, z) => {
      const k = z.age - z.warn;
      if (z.age < z.warn) {
        // Fog gathering: grey dashes drifting in from the right.
        ctx.strokeStyle = '#b8c0c8';
        ctx.setLineDash([3, 4]);
        for (let y = box.y + 8; y < box.y + box.h; y += 14) {
          ctx.beginPath();
          ctx.moveTo(box.x + box.w - 2, y);
          ctx.lineTo(box.x + box.w - 6 - z.age * 30, y);
          ctx.stroke();
        }
        return;
      }
      // The blast: pale streaks racing left.
      ctx.globalAlpha *= 0.6;
      ctx.strokeStyle = '#e8ecf0';
      for (let i = 0; i < 7; i++) {
        const y = box.y + 6 + i * 11;
        const x = box.x + box.w - ((k * 160 + i * 23) % (box.w + 20));
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 12, y);
        ctx.stroke();
      }
    };
    return {
      duration: 7.2,
      update: (dt, bullets, soul, real = dt / density) => {
        t += dt;
        if (!made) {
          made = true;
          // The reef along the far wall: harmless to look at until you touch it.
          bullets.push(new Zone({
            x: box.x, y: box.y, w: 4, h: box.h, warn: 0.6, life: 7,
            paint(ctx, z) {
              for (let y = z.y + 3; y < z.y + z.h; y += 8) blit(ctx, ['.N.', 'NnN', 'Nnn'], BELL, z.x + 1, y);
            },
          }));
        }
        if (t >= T(0.2 + n * EVERY) && n < 4) {
          n++;
          blastEnd = t + T(WARN + BLAST);
          bullets.push(new Deco({ warn: WARN, life: WARN + BLAST, paint: blastPaint }));
          // Spars along the rows: one on yours, two others, leaving after the warning.
          const rows = [soul.y, rand(box.y + 8, box.y + box.h - 8), soul.y + rand(-12, 12), rand(box.y + 8, box.y + box.h - 8), soul.y + rand(-20, 20)];
          rows.forEach((y, i) => {
            bullets.push(new Zone({
              x: box.x + box.w + 8, y: y - 2, w: 13, h: 4, warn: WARN + i * 0.28, life: 1.6, vx: -62,
              paint(ctx, z) {
                if (z.age < z.warn) {
                  ctx.fillStyle = '#9a8a70';
                  ctx.fillRect(box.x + box.w - 3, z.y, 3, 4);
                  return;
                }
                ctx.save();
                ctx.translate(z.x + 6, z.y + 2);
                blit(ctx, ['bbbbbbbbbbbbB', 'bBBBBnBBBBBBb', 'bbbbbbbbbbbbB'], BELL, 0, 0);
                ctx.restore();
              },
            }));
          });
        }
        // The blast shoves the soul away from the buoy, a bit slower than you can walk.
        const k = blastEnd - t;
        if (k > 0 && k < T(BLAST)) shove(soul, box, -64 * real, 0);
      },
    };
  },
};
