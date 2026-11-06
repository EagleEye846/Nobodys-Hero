import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/ch5Kit.js';
import { Ring } from './underShapes.js';
import { withSnipes } from './snipes.js';

// The Salt Shade's attacks. A drowned sailor's ghost doing what sailors do:
// he throws an anchor on a rope (the arc flashes first, and the rope itself
// stings), he flings a message in a bottle that bursts into a cloud of rising
// bubbles where it lands, and he casts lassos that drop round you and draw
// tight (every noose has a gap on the side he's standing). He stands to the
// right of the box, so everything comes from that side.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The attack's own clock (`t`) runs `density`
// times faster than the seconds on the wall, hence the `T` below.

const SEA = { k: '#132a34', b: '#6fb8b2', B: '#3f8088', w: '#d4f0ec', e: '#f0ffff', x: '#9ad8d0', g: '#4c8044', r: '#cfae7c', R: '#8c6c42', c: '#c8d8d0', p: '#e8dcb0', P: '#b8a878' };

function art(w, h, draw) {
  const p = new Pix(w, h);
  draw(p);
  return p.outline('k').rows();
}

// A bottle with a message in it, neck to the right.
defineBulletArt('shdBottle', {
  frames: [art(13, 8, (p) => {
    p.ellipse(4.5, 3.5, 4, 3, 'x');
    p.rect(7, 2, 4, 3, 'x');
    p.rect(11, 2, 2, 3, 'R');
    p.rect(2, 2, 5, 3, 'p');
    p.line(3, 3, 6, 3, 'P');
    p.set(2, 1, 'w');
    p.set(3, 0, 'w');
  })],
  palette: SEA,
  radius: 3.4,
  spin: 5,
});

// A bubble, and a bigger one.
defineBulletArt('shdBubble', {
  frames: [
    art(7, 7, (p) => { p.ring(3, 3, 2.6, 2.6, 'x', 1); p.set(2, 2, 'e'); }),
    art(7, 7, (p) => { p.ring(3, 3, 2.6, 2.6, 'w', 1); p.set(4, 2, 'e'); }),
  ],
  palette: SEA,
  radius: 2.8,
  frameSeconds: 0.3,
});
defineBulletArt('shdBubbleBig', {
  frames: [art(11, 11, (p) => { p.ring(5, 5, 4.4, 4.4, 'x', 1.2); p.set(3, 3, 'e'); p.set(4, 3, 'e'); p.set(3, 4, 'e'); })],
  palette: SEA,
  radius: 4.6,
});

// The message, harmless, floating down once the bottle bursts.
defineBulletArt('shdScroll', {
  frames: [art(9, 6, (p) => { p.rect(1, 1, 7, 4, 'p'); p.line(2, 2, 6, 2, 'P'); p.line(2, 3, 5, 3, 'P'); })],
  palette: SEA,
  radius: 1,
});

// An anchor thrown on a rope. It follows an arc from the sailor to a spot
// aimed at where you stood, the rope stinging all the way, lies there a
// moment, and is hauled back. The arc is drawn dashed first.
class AnchorThrow {
  constructor({ from, to, warn = 0.8, flight = 0.75, linger = 0.55, back = 0.5, lift = 22 }) {
    Object.assign(this, { from, to, warn, flight, linger, back, lift });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.pos = { x: from.x, y: from.y };
    this.total = warn + flight + linger + back;
  }

  arc(k) {
    return { x: this.from.x + (this.to.x - this.from.x) * k, y: this.from.y + (this.to.y - this.from.y) * k - Math.sin(Math.PI * k) * this.lift };
  }

  get phase() {
    if (this.age < this.warn) return 'warn';
    const a = this.age - this.warn;
    if (a < this.flight) return 'fly';
    if (a < this.flight + this.linger) return 'lie';
    if (a < this.flight + this.linger + this.back) return 'back';
    return 'gone';
  }

  get active() {
    const ph = this.phase;
    return ph === 'fly' || ph === 'lie' || ph === 'back';
  }

  update(dt) {
    this.age += dt;
    const ph = this.phase;
    const a = this.age - this.warn;
    if (ph === 'fly') this.pos = this.arc(a / this.flight);
    else if (ph === 'lie') this.pos = { ...this.to };
    else if (ph === 'back') {
      const k = (a - this.flight - this.linger) / this.back;
      this.pos = { x: this.to.x + (this.from.x - this.to.x) * k, y: this.to.y + (this.from.y - this.to.y) * k };
    }
  }

  isGone() {
    return this.age >= this.total + 0.2;
  }

  // The rope runs from the sailor to the anchor, sagging a little.
  ropePoints() {
    const pts = [];
    for (let i = 0; i <= 10; i++) {
      const k = i / 10;
      pts.push({ x: this.from.x + (this.pos.x - this.from.x) * k, y: this.from.y + (this.pos.y - this.from.y) * k + Math.sin(Math.PI * k) * 5 });
    }
    return pts;
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    let best = Math.hypot(px - this.pos.x, py - this.pos.y) - 4.5;
    const pts = this.ropePoints();
    for (let i = 0; i < pts.length - 1; i++) {
      const [a, b] = [pts[i], pts[i + 1]];
      const l2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2 || 1;
      const u = Math.max(0, Math.min(1, ((px - a.x) * (b.x - a.x) + (py - a.y) * (b.y - a.y)) / l2));
      best = Math.min(best, Math.hypot(px - (a.x + (b.x - a.x) * u), py - (a.y + (b.y - a.y) * u)) - 1);
    }
    return best;
  }

  draw(ctx) {
    ctx.save();
    const ph = this.phase;
    if (ph === 'warn') {
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.25 : 0.65;
      ctx.strokeStyle = '#cfae7c';
      ctx.setLineDash([2, 2]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= 14; i++) {
        const q = this.arc(i / 14);
        if (i === 0) ctx.moveTo(q.x, q.y);
        else ctx.lineTo(q.x, q.y);
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.to.x, this.to.y, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      return;
    }
    if (ph === 'gone') { ctx.restore(); return; }
    ctx.lineCap = 'round';
    const pts = this.ropePoints();
    for (const [color, width] of [['#132a34', 4], ['#cfae7c', 2]]) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.setLineDash(width === 2 ? [3, 1] : []);
      ctx.beginPath();
      pts.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)));
      ctx.stroke();
    }
    // The anchor, tumbling a little in the air.
    ctx.translate(this.pos.x, this.pos.y);
    if (ph === 'fly') ctx.rotate(-1 + (this.age - this.warn) * 2.5);
    ctx.setLineDash([]);
    ctx.lineCap = 'round';
    for (const [color, width] of [['#132a34', 4], ['#9aa0aa', 2]]) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(0, -5);
      ctx.lineTo(0, 4);
      ctx.moveTo(-4, -2);
      ctx.lineTo(4, -2);
      ctx.moveTo(-5, 1);
      ctx.quadraticCurveTo(-4, 5, 0, 5);
      ctx.quadraticCurveTo(4, 5, 5, 1);
      ctx.stroke();
    }
    ctx.restore();
  }
}

export const SALT_SHADE_ATTACKS = {
  // Anchor throw: the sailor swings an anchor on a rope in a high arc, aimed
  // at where you stood. The dashed arc and the landing ring flash first. The
  // rope stings along its whole length, and then he hauls it back.
  shadeAnchor(box, density, { rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.2);
    let n = 0;
    let later = [];
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && n < 4 && t < T(5.2)) {
          n++;
          next = t + T(1.5);
          const from = { x: box.x + box.w + 8, y: box.y + rand(8, box.h - 8) };
          const to = { x: clamp(soul.x + rand(-6, 6), box.x + 8, box.x + box.w - 8), y: clamp(soul.y + rand(-6, 6), box.y + 8, box.y + box.h - 8) };
          bullets.push(new AnchorThrow({ from, to, warn: 0.85, lift: rand(16, 28) }));
          // A smaller second anchor is thrown a beat later, wherever you've got to.
          later.push({ at: t + T(0.5), from: { x: from.x, y: box.y + rand(8, box.h - 8) } });
        }
        for (const l of later) {
          if (t < l.at) continue;
          l.done = true;
          const to2 = { x: clamp(soul.x + rand(-6, 6), box.x + 8, box.x + box.w - 8), y: clamp(soul.y + rand(-6, 6), box.y + 8, box.y + box.h - 8) };
          bullets.push(new AnchorThrow({ from: l.from, to: to2, warn: 0.7, lift: rand(16, 28), linger: 0.4 }));
        }
        later = later.filter((l) => !l.done);
      },
    };
  },

  // Message in a bottle: bottles fly in over the box in arcs and burst where
  // they land into a ring of bubbles, which then rise slowly, wobbling. The
  // message floats down, harmless.
  shadeBottle(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.2);
    let n = 0;
    const live = [];
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && n < 5 && t < T(5.2)) {
          n++;
          next = t + T(1.2);
          const from = { x: box.x + box.w + 10, y: box.y + rand(12, box.h - 12) };
          const to = { x: clamp(soul.x + rand(-16, 16), box.x + 10, box.x + box.w - 10), y: clamp(soul.y + rand(-16, 16), box.y + 10, box.y + box.h - 10) };
          const bottle = new Shot({ x: from.x, y: from.y, harmless: false, life: 3, art: 'shdBottle' });
          // The ring where it will burst, flashing.
          bullets.push(new Ring({ x: to.x, y: to.y, r: 7, grow: 0, thick: 1, warn: 0.95, life: 0, color: '#d4f0ec' }));
          bullets.push(bottle);
          live.push({ bottle, from, to, born: bottle.age, flight: 1.0, burst: false });
        }
        for (const b of live) {
          const k = Math.min(1, b.bottle.age / b.flight);
          if (!b.burst) {
            b.bottle.x = b.from.x + (b.to.x - b.from.x) * k;
            b.bottle.y = b.from.y + (b.to.y - b.from.y) * k - Math.sin(Math.PI * k) * 24;
          }
          if (k >= 1 && !b.burst) {
            b.burst = true;
            b.bottle.life = 0;
            b.bottle.age = 99;
            const turn = rand(0, Math.PI);
            for (let i = 0; i < 8; i++) {
              const a = turn + (i / 8) * Math.PI * 2;
              bullets.push(new Shot({ x: b.to.x, y: b.to.y, vx: Math.cos(a) * 22, vy: Math.sin(a) * 22 - 8, accel: -4, wobble: { amplitude: 2.5, frequency: 3 }, warn: 0.3, art: i % 3 === 0 ? 'shdBubbleBig' : 'shdBubble', life: 3 }));
            }
            bullets.push(new Shot({ x: b.to.x, y: b.to.y, vy: 14, harmless: true, life: 2, art: 'shdScroll' }));
          }
        }
        for (let i = live.length - 1; i >= 0; i--) if (live[i].burst) live.splice(i, 1);
      },
    };
  },

  // Lassos: a rope loop drops round where you're standing (a dashed ring
  // flashes), then draws tight. Every noose has a gap on the side the sailor
  // stands, so the way out is toward him.
  shadeRope(box, density, { rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.2);
    let n = 0;
    let last = null;
    let vel = { x: 0, y: 0 };
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        // Where you're heading: the nooses are cast a little ahead of you.
        if (last && dt > 0) {
          const k = Math.min(1, dt * 6);
          vel = { x: vel.x + ((soul.x - last.x) / dt - vel.x) * k, y: vel.y + ((soul.y - last.y) / dt - vel.y) * k };
        }
        last = { x: soul.x, y: soul.y };
        if (t >= next && n < 4 && t < T(5.2)) {
          n++;
          next = t + T(1.5);
          // One noose where you are, one where you're heading, one anywhere.
          const spots = [
            { x: soul.x, y: soul.y },
            { x: soul.x + vel.x * 0.9, y: soul.y + vel.y * 0.9 },
            { x: rand(box.x + 12, box.x + box.w - 12), y: rand(box.y + 12, box.y + box.h - 12) },
          ];
          spots.forEach((spot, i) => {
            const x = clamp(spot.x + rand(-4, 4), box.x + 12, box.x + box.w - 12);
            const y = clamp(spot.y + rand(-4, 4), box.y + 12, box.y + box.h - 12);
            // The opening faces the sailor (right), a touch off to one side.
            const gap = rand(-0.5, 0.5);
            bullets.push(new Ring({ x, y, r: 26, grow: -22, thick: 3, warn: 0.9 + i * 0.1, life: 1.15, gap: { angle: gap, width: 1.3 }, color: '#cfae7c', dash: [4, 1] }));
          });
        }
      },
    };
  },
};

// Aimed shots on top, so standing still or running one way is never safe (see snipes.js).
SALT_SHADE_ATTACKS.shadeAnchor = withSnipes(SALT_SHADE_ATTACKS.shadeAnchor, { art: 'shdBottle' });
SALT_SHADE_ATTACKS.shadeRope = withSnipes(SALT_SHADE_ATTACKS.shadeRope, { art: 'shdScroll' });
SALT_SHADE_ATTACKS.shadeBottle = withSnipes(SALT_SHADE_ATTACKS.shadeBottle, { art: 'shdBottle', count: 2, first: 1.8, every: 2.2, speed: 66 });
