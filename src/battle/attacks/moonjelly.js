import { defineBulletArt } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { Ring } from './underShapes.js';

// The Moonjelly's attacks. A big soft jellyfish that drifts about like
// moonlight and does not hurry: so it trails its tendrils across the box in
// long wavy lashes (a string of stinging beads that ripple like a snake),
// pulses rings of pale light that spread out from it with a gap or two, and
// lets go a cloud of slow little bell-shaped jellies, drifting. It stands to
// the right of the box, so everything comes in from that side.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The attack's own clock (`t`) runs `density`
// times faster than the seconds on the wall, hence the `T` below.

const JEL = { k: '#232a5a', b: '#b4cdf5', B: '#86a4e6', w: '#f2f8ff', p: '#e0c4f6', P: '#b890e4', t: '#a4c0f0', T: '#7694dc', g: '#fff4c4' };


// One bead of a stinging tendril, and its tip.
defineBulletArt('jelBead', {
  frames: [['.kkk.', 'kwwwk', 'kwpwk', 'kwwpk', '.kkk.'], ['.kkk.', 'kwwwk', 'kwpwk', 'kpwwk', '.kkk.']],
  palette: JEL,
  radius: 2.3,
  frameSeconds: 0.25,
});
defineBulletArt('jelTip', {
  frames: [
    art(7, 7, (p) => { p.ellipse(3, 3, 2.4, 2.4, 'P'); p.ellipse(2.4, 2.4, 1, 1, 'w'); }),
    art(7, 7, (p) => { p.ellipse(3, 3, 2.4, 2.4, 'p'); p.ellipse(2.4, 2.4, 1, 1, 'g'); }),
  ],
  palette: JEL,
  radius: 2.6,
  frameSeconds: 0.15,
});

// A little bell-shaped jelly, pulsing (two frames), tendrils trailing right.
const bell = (squeeze) => art(11, 12, (p) => {
  p.ellipse(5, 4, 4.4 - squeeze * 0.6, 3.4 - squeeze * 0.4, 'b');
  p.rect(0, 5, 11, 8, '.');
  p.rect(1, 5, 8, 1, 'B');
  p.ellipse(4, 2.5, 1.6, 1, 'w');
  p.set(5, 4, 'P');
  p.line(2, 6, 2 - squeeze, 9, 't');
  p.line(5, 6, 5 + squeeze, 10, 'p');
  p.line(8, 6, 8 - squeeze, 9, 't');
});
defineBulletArt('jelBell', { frames: [bell(0), bell(1)], palette: JEL, radius: 3.2, frameSeconds: 0.4 });

// A stinging tendril: a wavy line that reaches out from the jelly across the
// box with a ripple running down it, so standing in its row means being
// stung as each crest passes. It flashes as a thin dashed row first.
class Tendril {
  constructor({ x, y, len = 100, grow = 120, amp = 10, k = 0.16, w = 6.5, thick = 3, warn = 0.55, life = 1.7 }) {
    Object.assign(this, { x, y, len, grow, amp, k, w, thick, warn, life });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get active() {
    return this.age >= this.warn && this.age < this.warn + this.life;
  }

  get solid() {
    return Math.min(this.len, Math.max(0, (this.age - this.warn) * this.grow));
  }

  point(d) {
    const root = Math.min(1, d / 14);
    return { x: this.x - d, y: this.y + this.amp * root * Math.sin(this.k * d - this.w * (this.age - this.warn)) };
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.warn + this.life + 0.25;
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    let best = Infinity;
    const end = this.solid;
    for (let d = 0; d <= end; d += 2.5) {
      const q = this.point(d);
      best = Math.min(best, Math.hypot(px - q.x, py - q.y));
    }
    return best - this.thick / 2;
  }

  draw(ctx) {
    ctx.save();
    if (this.age < this.warn) {
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.2 : 0.5;
      ctx.strokeStyle = '#d9e8ff';
      ctx.setLineDash([2, 3]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - this.amp);
      ctx.lineTo(this.x - this.len, this.y - this.amp);
      ctx.moveTo(this.x, this.y + this.amp);
      ctx.lineTo(this.x - this.len, this.y + this.amp);
      ctx.stroke();
      ctx.restore();
      return;
    }
    const over = this.age - (this.warn + this.life);
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const end = this.solid;
    for (const [color, width, glow] of [['#7694dc', this.thick + 2, '#86a4e6'], ['#d9e8ff', this.thick, null], ['#ffffff', 1, null]]) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.shadowColor = glow ?? 'transparent';
      ctx.shadowBlur = glow ? 5 : 0;
      ctx.beginPath();
      for (let d = 0; d <= end; d += 2) {
        const q = this.point(d);
        if (d === 0) ctx.moveTo(q.x, q.y);
        else ctx.lineTo(q.x, q.y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
}

export const MOONJELLY_ATTACKS = {
  // Stinging tendrils: long wavy lashes reach out across the box with a
  // ripple running down them. One is in your row; another is somewhere else.
  // A thin dashed outline shows where each will sweep.
  jelLash(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.2);
    let lashes = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && lashes < 4 && t < T(5)) {
          lashes++;
          next = t + T(1.4);
          const lo = box.y + 11;
          const hi = box.y + box.h - 11;
          const y1 = clamp(soul.y + rand(-7, 7), lo, hi);
          let y2 = rand(lo, hi);
          if (Math.abs(y2 - y1) < 24) y2 = y1 < (lo + hi) / 2 ? Math.min(hi, y1 + 30) : Math.max(lo, y1 - 30);
          for (const y of [y1, y2]) {
            const x = box.x + box.w + 3;
            bullets.push(new Tendril({ x, y, warn: 0.6, life: 1.6 }));
            bullets.push(new Shot({ x: x + 1, y, harmless: true, life: 0.6, art: 'jelTip' }));
          }
        }
      },
    };
  },

  // Pulse: it breathes out rings of cold light, one after another, each with
  // a gap somewhere, and a second smaller ring right behind the first.
  jelPulse(box, density, { rand }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.2);
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets) => {
        t += dt;
        if (t >= next && n < 5 && t < T(5.2)) {
          n++;
          next = t + T(1.1);
          const x = box.x + box.w + rand(2, 12);
          const y = rand(box.y + 8, box.y + box.h - 8);
          const gap = { angle: Math.PI + rand(-0.9, 0.9), width: 1.2 };
          bullets.push(new Ring({ x, y, r: 3, grow: 52, thick: 3, warn: 0.5, life: 3.4, gap, color: '#d9e8ff', glow: '#86a4e6' }));
          bullets.push(new Ring({ x, y, r: 1, grow: 52, thick: 2.2, warn: 0.85, life: 3.2, gap: { angle: gap.angle + rand(-0.8, 0.8), width: 1.4 }, color: '#e0c4f6', glow: '#b890e4' }));
        }
      },
    };
  },

  // A drift of bells: a whole cloud of little bell-shaped jellies sets off
  // slowly, bobbing and pulsing, some of them heading across your row.
  jelBells(box, density, { Shot, every, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    const drift = every(0.22, 0.32, (bullets, soul) => {
      const onYou = Math.random() < 0.4;
      const y = onYou ? clamp(soul.y + rand(-9, 9), box.y + 5, box.y + box.h - 5) : rand(box.y + 5, box.y + box.h - 5);
      bullets.push(new Shot({ x: box.x + box.w + 6, y, vx: -rand(18, 26), vy: rand(-5, 5), wobble: { amplitude: rand(3, 6), frequency: rand(2, 3.4) }, art: 'jelBell', life: 7 }));
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < T(5.6)) drift(dt, bullets, soul);
      },
    };
  },
};
