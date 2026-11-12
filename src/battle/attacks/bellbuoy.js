import { defineBulletArt, Line } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { Ring } from './underShapes.js';

// The Bellbuoy's attacks. A haunted bell buoy: it tolls (rings of sound that
// spread from the bell on a steady beat, in pairs, each with a gap that is
// never where you're standing), it lashes its mooring chain round (two
// iron chains swinging across the box like pendulums, an anchor on the end
// of each), and it blows its foghorn (a cone of noise aimed where you are,
// outlined first). It stands to the right of the box, so everything comes
// from that side.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The attack's own clock (`t`) runs `density`
// times faster than the seconds on the wall, hence the `T` below.

const BELL = { k: '#1a1c22', n: '#8a8f98', N: '#5a5f68', w: '#e8e4d8', y: '#e8ffb0', Y: '#a8d860', v: '#4fa882', V: '#2e6a58', o: '#7ac8a0', L: '#c89a40' };


// The anchor at the end of a chain: it hurts like a bullet, and (unlike a Shot) it
// is kept while it swings outside the box.
class Anchor {
  constructor({ x, y, warn = 0.8, life = 5 }) {
    Object.assign(this, { x, y, warn, life });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get active() {
    return this.age >= this.warn && this.age < this.warn + this.life;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.warn + this.life + 0.25;
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    return Math.hypot(px - this.x, py - this.y) - 4;
  }

  draw(ctx) {
    ctx.save();
    if (this.age < this.warn) ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.2 : 0.5;
    const over = this.age - (this.warn + this.life);
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
    const x = Math.round(this.x);
    const y = Math.round(this.y);
    ctx.strokeStyle = '#1a1c22';
    ctx.lineCap = 'round';
    for (const [width, color] of [[4, '#1a1c22'], [2, '#9aa0aa']]) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x, y - 5);
      ctx.lineTo(x, y + 4);
      ctx.moveTo(x - 4, y - 2);
      ctx.lineTo(x + 4, y - 2);
      ctx.moveTo(x - 5, y + 1);
      ctx.quadraticCurveTo(x - 4, y + 5, x, y + 5);
      ctx.quadraticCurveTo(x + 4, y + 5, x + 5, y + 1);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// A chain that swings like a pendulum, with an anchor on the end. It moves
// itself (no outside help), so a careful player can read where it will be.
class Chain extends Line {
  constructor({ x, y, len, phase, spin }) {
    super({ x, y, angle: Math.PI, length: len, thickness: 3, warn: 0.8, life: 4.2, color: '#9aa0aa', dash: [3, 2] });
    this.phase = phase;
    this.spin = spin;
    this.anchor = new Anchor({ x: x - len, y, warn: 0.8, life: 4.2 });
  }

  update(dt) {
    super.update(dt);
    this.angle = Math.PI + 0.9 * Math.sin(this.spin * Math.max(0, this.age - 0.8) + this.phase);
    this.anchor.age = this.age;
    this.anchor.x = this.x + Math.cos(this.angle) * this.length;
    this.anchor.y = this.y + Math.sin(this.angle) * this.length;
  }

  edgeDistance(px, py) {
    return Math.min(super.edgeDistance(px, py), this.anchor.edgeDistance(px, py));
  }

  // Once it swings, it is drawn as real iron links (each one turned across the
  // last), rusted where the sea got at it; the outline before that is the dashed preview.
  draw(ctx) {
    if (this.age < this.warn) {
      super.draw(ctx);
      this.anchor.draw(ctx);
      return;
    }
    const over = this.age - (this.warn + this.life);
    ctx.save();
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
    const dx = Math.cos(this.angle);
    const dy = Math.sin(this.angle);
    const STEP = 5;
    for (let d = 2, i = 0; d < this.length - 3; d += STEP, i++) {
      const x = this.x + dx * d;
      const y = this.y + dy * d;
      const flat = i % 2 === 0;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(this.angle);
      ctx.lineWidth = flat ? 1.6 : 1.2;
      ctx.strokeStyle = '#1a1c22';
      ctx.beginPath();
      ctx.ellipse(0, 0, 3.6, flat ? 2.1 : 0.9, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = i % 5 === 3 ? '#b87848' : flat ? '#aab0ba' : '#6a707a';
      ctx.lineWidth = flat ? 0.9 : 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, 3.6, flat ? 2.1 : 0.9, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
    this.anchor.draw(ctx);
  }
}

// A note struck: a little pale spark that shows where the beat falls.
defineBulletArt('buoyNote', {
  frames: [['..y..', '.yYy.', 'yYwYy', '.yYy.', '..y..'], ['.....', '..y..', '.yYy.', '..y..', '.....']],
  palette: BELL,
  radius: 1,
  frameSeconds: 0.12,
});

// A cone of noise: apex at (x, y), pointing along `angle`, `spread` radians
// either side. It outlines itself first, then is solid for `life` seconds.
class Cone {
  constructor({ x, y, angle, spread = 0.3, length = 120, warn = 0.85, life = 0.5, turn = 0 }) {
    Object.assign(this, { x, y, angle, spread, length, warn, life, turn });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get active() {
    return this.age >= this.warn && this.age < this.warn + this.life;
  }

  update(dt) {
    this.age += dt;
    if (this.age >= this.warn) this.angle += this.turn * dt;
  }

  isGone() {
    return this.age >= this.warn + this.life + 0.25;
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const d = Math.hypot(px - this.x, py - this.y);
    const diff = Math.atan2(Math.sin(Math.atan2(py - this.y, px - this.x) - this.angle), Math.cos(Math.atan2(py - this.y, px - this.x) - this.angle));
    if (d > this.length) return Infinity;
    // Inside the cone counts as touching; the edge is the angular gap in pixels.
    const edge = (Math.abs(diff) - this.spread) * d;
    return edge < 0 ? 0 : edge;
  }

  draw(ctx) {
    ctx.save();
    const a0 = this.angle - this.spread;
    const a1 = this.angle + this.spread;
    const path = () => {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + Math.cos(a0) * this.length, this.y + Math.sin(a0) * this.length);
      ctx.lineTo(this.x + Math.cos(a1) * this.length, this.y + Math.sin(a1) * this.length);
      ctx.closePath();
    };
    if (this.age < this.warn) {
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.25 : 0.65;
      ctx.strokeStyle = '#e8ffb0';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      path();
      ctx.stroke();
      ctx.restore();
      return;
    }
    const over = this.age - (this.warn + this.life);
    const fade = over > 0 ? Math.max(0, 1 - over / 0.25) : 1;
    ctx.globalAlpha = 0.55 * fade;
    ctx.fillStyle = '#c8f0a8';
    path();
    ctx.fill();
    // Sound waves running down the cone.
    ctx.globalAlpha = 0.9 * fade;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    for (let r = 14 + ((this.age * 90) % 22); r < this.length; r += 22) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, r, a0, a1);
      ctx.stroke();
    }
    ctx.restore();
  }
}

export const BELLBUOY_ATTACKS = {
  // Toll: rings of sound off the bell on a steady beat, in pairs (a ring,
  // then a beat later a smaller one with its gap on the other side). Each
  // ring's gap is turned away from where you were standing.
  buoyToll(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.2);
    let tolls = 0;
    const second = [];
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && tolls < 6 && t < T(6.2)) {
          tolls++;
          next = t + T(1.2);
          const x = box.x + box.w + 8;
          const y = box.y + (tolls % 2 ? 0.3 : 0.7) * box.h + rand(-8, 8);
          const toSoul = Math.atan2(soul.y - y, soul.x - x);
          const side = Math.random() < 0.5 ? -1 : 1;
          const gap = toSoul + side * rand(0.7, 0.95);
          bullets.push(new Ring({ x, y, r: 3, grow: 50, thick: 3, warn: 0.5, life: 3.2, gap: { angle: gap, width: 1.5 }, color: '#e8ffb0', glow: '#a8d860' }));
          bullets.push(new Shot({ x: x - 5, y, harmless: true, life: 0.5, art: 'buoyNote' }));
          second.push({ at: t + T(0.55), x, y, gap: gap - side * rand(0.9, 1.3) });
        }
        for (const s of second) {
          if (t < s.at) continue;
          s.done = true;
          bullets.push(new Ring({ x: s.x, y: s.y, r: 2, grow: 50, thick: 2.5, warn: 0.35, life: 3, gap: { angle: s.gap, width: 1.5 }, color: '#7ac8a0', glow: '#4fa882' }));
        }
        for (let i = second.length - 1; i >= 0; i--) if (second[i].done) second.splice(i, 1);
      },
    };
  },

  // Chain lash: three iron chains swing from the buoy's side like pendulums,
  // out of step, each with an anchor on the end. A dashed outline of the
  // first swing shows before they start.
  buoyChain(box, density, { rand }) {
    let t = 0;
    let made = false;
    const spin = rand(1.45, 1.55);
    return {
      duration: 7,
      update: (dt, bullets) => {
        t += dt;
        if (!made) {
          made = true;
          const x = box.x + box.w + 5;
          const pivots = [{ y: box.y + 10, phase: 0, len: 100 }, { y: box.y + box.h - 10, phase: Math.PI, len: 100 }, { y: box.y + box.h / 2, phase: Math.PI / 2, len: 70 }];
          for (const pv of pivots) bullets.push(new Chain({ x, y: pv.y, len: pv.len, phase: pv.phase, spin }));
        }
      },
    };
  },

  // Foghorn: two horns blare, each a cone aimed at where you were when it
  // warned; the cone outlines itself first. Then the last blast turns slowly
  // like a lighthouse.
  buoyHorn(box, density, { rand }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.2);
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && n < 4 && t < T(5.2)) {
          n++;
          next = t + T(1.4);
          for (const hy of [box.y + 12, box.y + box.h - 12]) {
            const x = box.x + box.w + 6;
            const aim = Math.atan2(soul.y - hy, soul.x - x) + rand(-0.12, 0.12);
            bullets.push(new Cone({ x, y: hy, angle: aim, spread: 0.26, length: 130, warn: 0.9, life: 0.45, turn: n === 4 ? (hy < box.y + box.h / 2 ? 0.7 : -0.7) : 0 }));
          }
        }
      },
    };
  },
};
