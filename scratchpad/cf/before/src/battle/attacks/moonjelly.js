import { defineBulletArt } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { Ring } from './underShapes.js';
import { PathShot } from './coastKit.js';

// The Moonjelly's attacks. A big soft jellyfish the colour of moonlight that
// does not hurry, and everything it does moves like a jellyfish:
//   - Pulse and drift: it only moves on the pulse, a short shove toward you,
//     then coasts, its tendrils trailing along the way it came.
//   - Bloom: baby jellies rise from the bottom, all hopping up together on
//     one beat and hanging still between.
//   - Moonglow: its tendrils hang in the box, pale and harmless, until the
//     moonlight runs along them; wherever it's lit, it stings.
// It drifts to the right of the box.

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

// The moonjelly itself, small enough to swim the box: a bell, squeezed on the pulse.
const swimmer = (squeeze) => art(15, 13, (p) => {
  p.ellipse(7, 5, 6.2 - squeeze, 4.6 - squeeze * 0.6, 'b');
  p.rect(0, 7, 15, 6, '.');
  p.rect(1, 7, 13, 1, 'B');
  p.ellipse(5, 3, 2, 1.2, 'w');
  for (const x of [4, 7, 10]) p.ellipse(x, 5, 1, 1, 'P');
  p.line(3, 8, 3 - squeeze, 12, 't');
  p.line(7, 8, 7, 12, 'p');
  p.line(11, 8, 11 + squeeze, 12, 't');
});
defineBulletArt('jelSwimmer', { frames: [swimmer(0), swimmer(1.4)], palette: JEL, radius: 5, frameSeconds: 0.35 });
// A baby jelly (an ephyra): a little eight-armed star, open and shut.
const ephyra = (shut) => art(9, 9, (p) => {
  p.ellipse(4, 4, 1.6, 1.6, 'p');
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const r = shut ? 2.6 : 3.8;
    p.set(4 + Math.cos(a) * r, 4 + Math.sin(a) * r, i % 2 ? 'b' : 'w');
  }
});
defineBulletArt('jelBaby', { frames: [ephyra(false), ephyra(true)], palette: JEL, radius: 3, frameSeconds: 0.2 });
// A drop of moonlight falling off a lit tendril.
defineBulletArt('jelMoonDrop', { frames: [['.g.', 'gwg', '.g.'], ['...', '.g.', '...']], palette: JEL, radius: 1.5, frameSeconds: 0.15 });

// A tendril hanging from the top of the box, swaying. It only stings while
// moonlight is on it: `lit(k)` (k: seconds since it finished warning).
class Hanging {
  constructor({ x, len, amp, phase, lit, warn = 0.5, life = 6, top }) {
    Object.assign(this, { x, len, amp, phase, lit, warn, life, top });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  sway(y, k) {
    return this.x + Math.sin((y - this.top) * 0.09 + k * 2.2 + this.phase) * this.amp;
  }

  get active() {
    const k = this.age - this.warn;
    return k >= 0 && k < this.life && this.lit(k);
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.warn + this.life + 0.25;
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const k = this.age - this.warn;
    const dy = Math.max(0, py - (this.top + this.len));
    return Math.hypot(px - this.sway(Math.min(py, this.top + this.len), k), dy) - 2;
  }

  draw(ctx) {
    const k = Math.max(0, this.age - this.warn);
    const on = this.age >= this.warn && this.lit(k);
    ctx.save();
    if (this.age < this.warn) ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.2 : 0.45;
    else if (!on) ctx.globalAlpha = 0.3;
    const over = this.age - this.warn - this.life;
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
    if (on) {
      ctx.shadowColor = '#fff4c4';
      ctx.shadowBlur = 6;
    }
    ctx.strokeStyle = on ? '#fff4c4' : '#a4c0f0';
    ctx.lineWidth = on ? 3 : 1.5;
    ctx.beginPath();
    for (let y = this.top; y <= this.top + this.len; y += 3) {
      const x = this.sway(y, k);
      if (y === this.top) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }
}

export const MOONJELLY_ATTACKS = {
  // Pulse and drift: the moonjelly swims into the box the way a jellyfish
  // does. On each pulse (its bell squeezes) it shoots a short way toward
  // you, then coasts to a stop; its long tendrils trail out behind along the
  // way it came. It only moves on the pulse: step aside between pulses.
  jelSwim(box, density, { Shot }) {
    const PULSE = 0.85;
    const KICK = 30;
    const BEADS = 8;
    const SPACING = 0.075;
    let real = 0;
    let made = false;
    let head = null;
    const beads = [];
    const trail = [];
    let vx = 0;
    let vy = 0;
    let nextPulse = 0.7;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        const step = dt / density;
        real += step;
        if (!made) {
          made = true;
          head = new Shot({ x: box.x + box.w + 8, y: box.y + box.h / 2, art: 'jelSwimmer', warn: 0.5 });
          head.life = 6.4;
          bullets.push(head);
          for (let i = 0; i < BEADS; i++) {
            const b = new Shot({ x: head.x, y: head.y, art: i === BEADS - 1 ? 'jelTip' : 'jelBead', warn: 0.5 });
            b.life = 6.4;
            beads.push(b);
            bullets.push(b);
          }
        }
        if (real >= nextPulse && real < 6.6) {
          nextPulse = real + PULSE;
          const a = Math.atan2(soul.y - head.y, soul.x - head.x);
          // A kick that coasts to a stop (drag below), covering about KICK pixels.
          vx = Math.cos(a) * KICK * 4;
          vy = Math.sin(a) * KICK * 4;
        }
        const drag = Math.exp(-4 * step);
        head.x += vx * step;
        head.y += vy * step;
        vx *= drag;
        vy *= drag;
        head.vx = 0;
        head.vy = 0;
        trail.unshift({ x: head.x, y: head.y, at: real });
        if (trail.length > 200) trail.pop();
        beads.forEach((b, i) => {
          const want = real - (i + 1) * SPACING;
          const p = trail.find((q) => q.at <= want) ?? trail[trail.length - 1];
          b.x = p.x + 2;
          b.y = p.y + 4;
        });
      },
    };
  },

  // Bloom: a bloom of baby jellies rises from the bottom of the box. They all
  // pulse together, on one beat: on the pulse every one of them hops up a
  // step, and between pulses they hang still. Slip between them while they
  // hang, and never be just above one on the beat.
  jelBloom(box, density, { rand }) {
    const BEAT = 0.6;
    const HOP = 15;
    const RISE = 0.16;
    let real = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        real += dt / density;
        // A new row on every other beat, so all of them pulse in step.
        if (real >= 0.1 + n * BEAT * 2 && n < 5) {
          n++;
          const y0 = box.y + box.h + 6;
          const xs = [soul.x];
          for (let guard = 0; xs.length < 4 && guard < 300; guard++) {
            const x = rand(box.x + 6, box.x + box.w - 6);
            if (xs.every((o) => Math.abs(o - x) > 12)) xs.push(x);
          }
          for (const x of xs) {
            bullets.push(new PathShot({
              art: 'jelBaby', life: 12 * BEAT,
              path: (k) => {
                const hops = Math.floor(k / BEAT);
                const f = Math.min(1, (k - hops * BEAT) / RISE);
                return { x: x + Math.sin(k * 2) * 1.5, y: y0 - HOP * (hops + (1 - (1 - f) * (1 - f))) };
              },
            }));
          }
        }
      },
    };
  },

  // Moonglow: its tendrils hang down into the box, swaying, pale and quite
  // harmless. Then the moonlight comes through the water and runs along
  // them from one side to the other, and wherever the light is on a
  // tendril, it stings, and drips light. Watch which way the light runs.
  jelGlow(box, density, { Shot, rand }) {
    const COUNT = 6;
    const SWEEP = 1.3;
    const ON = 0.5;
    const WARN = 0.5;
    let real = 0;
    let made = false;
    let drops = 0;
    // Sweeps (start times since the tendrils settled), alternating direction.
    const sweeps = [0.5, 2.2, 3.9, 5.2].map((s, i) => ({ s, dir: i % 2 ? -1 : 1 }));
    const litAt = (i) => (k) => sweeps.some(({ s, dir }) => {
      const at = s + (SWEEP * (dir > 0 ? i : COUNT - 1 - i)) / (COUNT - 1);
      return k >= at && k < at + ON;
    });
    const xs = [];
    return {
      duration: 7,
      update: (dt, bullets) => {
        real += dt / density;
        if (!made) {
          made = true;
          for (let i = 0; i < COUNT; i++) {
            const x = box.x + 7 + i * ((box.w - 14) / (COUNT - 1));
            xs.push(x);
            bullets.push(new Hanging({ x, len: rand(58, 76), amp: rand(5, 8), phase: rand(0, 6), lit: litAt(i), warn: WARN, life: 6.3, top: box.y - 2 }));
          }
        }
        // Light drips off lit tendrils.
        if (real >= WARN + 0.3 * drops && drops < 20) {
          drops++;
          const k = real - WARN;
          xs.forEach((x, i) => {
            if (litAt(i)(k) && Math.random() < 0.5) bullets.push(new Shot({ x: x + rand(-4, 4), y: box.y + rand(30, 60), vy: 30, art: 'jelMoonDrop', life: 1.5 }));
          });
        }
      },
    };
  },
};
