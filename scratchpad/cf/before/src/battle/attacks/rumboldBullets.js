import { defineBulletArt } from '../projectiles.js';
import { clamp } from '../patternTools.js';

// The things King Peptup throws at you: all of it is the stuff of a stage
// show. Spotlights and trapdoors, prop swords on strings, confetti, puppet
// strings and a puppeteer's control bar, cardboard moles in a chorus line,
// a CHEER sign and the hands that clap, a curtain and its sandbags,
// fireworks. The attacks that use them are in rumbold.js (the show) and
// rumboldBroken.js (the same show after the jaw jams, falling apart).
//
// Most of it is bullets of its own, drawn in canvas shapes: anything with
// update, isGone, edgeDistance and draw will do (see projectiles.js). The ones
// that can be cut with the CUT THE STRING ability (src/battle/soulAbilities.js,
// `snip`) also have `cuttable`, `cutDistance(x, y)` and `cut(battle)`.

// --- Paint ---
const C = {
  k: '#1a0f18', // outline
  r: '#e0344e', // red
  R: '#8c1a30', // dark red
  y: '#ffd25e', // yellow
  Y: '#c8901a', // dark yellow
  t: '#3fd0c0', // teal
  b: '#4a90e8', // blue
  p: '#b070f0', // purple
  w: '#ffffff',
  W: '#c9c2e0',
  s: '#cfd8e8', // silver
  S: '#8a96b0',
  c: '#c89a5e', // cardboard
  C: '#8a6234',
  g: '#f0c050', // gold
  n: '#6a4628', // wood
  o: '#ff8a3a', // orange
};

const TAU = Math.PI * 2;
export const warnAlpha = (age) => (Math.floor(age * 10) % 2 ? 0.25 : 0.6);
const fillRect = (ctx, color, x, y, w, h) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};

// How far a point is from a line segment.
export function segDist(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const t = clamp(((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy || 1), 0, 1);
  return Math.hypot(px - (x1 + dx * t), py - (y1 + dy * t));
}

// How far a point is outside a rectangle (0 inside).
export function rectDist(px, py, x, y, w, h) {
  return Math.hypot(Math.max(x - px, 0, px - (x + w)), Math.max(y - py, 0, py - (y + h)));
}

// --- Art for the plain Shots ---

// Confetti: slivers of coloured foil, sharp as glass, tumbling end over end
// as they go; each turn catches the light in a white glint. They cut.
for (const [name, main, light, dark] of [['R', C.r, '#ff9aa8', '#7a1428'], ['Y', C.y, '#fff2b0', '#a8701a'], ['T', C.t, '#b0fff0', '#1a7a70'], ['B', C.b, '#b0d0ff', '#24508a'], ['P', C.p, '#e0c0ff', '#5a2a8a']]) {
  const palette = { a: main, l: light, d: dark, w: '#ffffff' };
  defineBulletArt(`rumConf${name}`, {
    frames: [
      ['d...', '.al.', '..aa', '...d'],
      ['..d.', '..a.', '.la.', '.d..'],
      ['....', 'dlwa', '....', '....'],
      ['...d', '..la', '.aa.', 'd...'],
      ['.d..', '.a..', '.al.', '..d.'],
      ['....', '....', 'awld', '....'],
    ],
    palette,
    radius: 1.5,
    frameSeconds: 0.07,
  });
}

// A firework rocket going up (drawn pointing right: it turns to fly), with a
// spark trail behind. And the sparks a burst throws: one per colour.
defineBulletArt('rumRocket', {
  frames: [['..r....', 'kwwwrrr', 'ksssrrr', '..o.o..'], ['..r....', 'kwwwrrr', 'ksssrrr', '.o.o...']],
  palette: { k: C.k, w: C.w, s: C.s, r: C.r, o: C.o },
  radius: 2,
  rotate: true,
  frameSeconds: 0.07,
});
for (const [name, main, light] of [['R', '#ff4a66', '#ffc0c8'], ['Y', '#ffd25e', '#fff6c0'], ['T', '#3fe8d0', '#c0fff4'], ['B', '#5aa0ff', '#c8e0ff'], ['P', '#c080ff', '#ecd8ff'], ['W', '#ffffff', '#ffffff']]) {
  // A four-pointed star that twinkles: points out, a flash, points in.
  defineBulletArt(`rumSpark${name}`, {
    frames: [
      ['..l..', '..a..', 'lawal', '..a..', '..l..'],
      ['.....', '.l.l.', '..w..', '.l.l.', '.....'],
      ['.....', '..a..', '.ala.', '..a..', '.....'],
    ],
    palette: { a: main, l: light, w: '#ffffff' },
    radius: 1.5,
    frameSeconds: 0.1,
  });
}

// The big star of the finale.
defineBulletArt('rumStar', {
  frames: [['..y..', '.yyy.', 'yywyy', '.yyy.', '..y..'], ['..w..', '.ywy.', 'wwwww', '.ywy.', '..w..']],
  palette: { y: C.y, w: C.w },
  radius: 2.6,
  spin: 2,
  frameSeconds: 0.12,
});

// A sandbag, the kind that holds a stage flat up.
defineBulletArt('rumBag', {
  frames: [[
    '...kkk...',
    '...kck...',
    '..kcccck.',
    '.kcCccCck',
    'kcCcccCck',
    'kcccCccck',
    '.kcCcCck.',
    '..kkkkk..',
  ]],
  palette: { k: C.k, c: C.c, C: C.C },
  hitbox: { w: 8, h: 8 },
});

// A speaker's horn blast: a note, for the cheer.
// (Brass, outlined, and it bobs on its stem as it flies.)
defineBulletArt('rumNote', {
  frames: [
    ['...kk.', '..kyyk', '..kyk.', '.kkyk.', 'kyyyk.', 'kywyk.', '.kkk..'],
    ['...kkk', '..kyyk', '..kyk.', '.kkyk.', 'kyyyk.', 'kyyyk.', '.kkk..'],
  ],
  palette: { y: C.y, k: '#6a3a10', w: '#fff6c0' },
  radius: 2,
  frameSeconds: 0.15,
});

// A white-gloved hand, pointing right and left; the applause comes from both sides.
const GLOVE = ['..wwww..', '.wwwwwww', 'rwwwwwwW', 'rwwwwwwW', '.wwwwwW.', '..wWWW..'];
defineBulletArt('rumHandRight', { frames: [GLOVE], palette: { w: C.w, W: C.W, r: C.r }, hitbox: { w: 7, h: 5 } });
defineBulletArt('rumHandLeft', { frames: [GLOVE.map((row) => [...row].reverse().join(''))], palette: { w: C.w, W: C.W, r: C.r }, hitbox: { w: 7, h: 5 } });
// The pop where they meet.
defineBulletArt('rumClap', {
  frames: [['y.y.y', '.yyy.', 'yywyy', '.yyy.', 'y.y.y'], ['..w..', '.w.w.', 'w...w', '.w.w.', '..w..']],
  palette: { y: C.y, w: C.w },
  radius: 2.5,
  frameSeconds: 0.08,
});

// A limp bit of streamer, off a popper that didn't (phase 2).
defineBulletArt('rumStreamerBit', { frames: [['rrrr', '.yyy']], palette: { r: C.r, y: C.y }, radius: 1.5, frameSeconds: 0.2 });

// --- Spotlights ---

// A pool of light from a rig above the box. It first blinks as an outline
// (warn), with the lane it will sweep shown as a faint band, then burns for
// `life` seconds. Only the bright pool hurts. With a `flicker(t)` function it
// can go out for a moment (the broken one). With `rest(t)` (how long it has
// left dark, or 0) it goes out and stops where it is while the operator
// changes the gel: a breath to slip past it. It blinks before it comes back
// on, in the next colour from `gels`. It scorches the boards where it
// passes: burnt dust, which hurts nothing.
export class Spot {
  constructor({ x, y, r = 13, warn = 0.9, life = 6, color = '255, 244, 200', rig, move = null, flicker = null, target = null, path = null, rest = null, gels = null, box = null }) {
    Object.assign(this, { x, y, r, warn, life, color, rig, move, flicker, target, path, rest, gels, box });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.vx = 0;
    this.vy = 0;
    this.scorch = [];
    this.nextScorch = 0;
    this.gel = 0;
    this.wasResting = false;
  }

  get resting() { return !!this.rest && this.age >= this.warn && this.rest(this.age - this.warn) > 0; }

  get lit() {
    return this.age >= this.warn && this.age < this.warn + this.life && !this.resting
      && (!this.flicker || this.flicker(this.age - this.warn));
  }

  update(dt, box) {
    this.age += dt;
    for (const mark of this.scorch) mark.age += dt;
    if (this.scorch.length && this.scorch[0].age > 1.4) this.scorch = this.scorch.filter((mark) => mark.age < 1.4);
    const resting = this.resting;
    // A new gel each time it comes back on.
    if (this.wasResting && !resting && this.gels) this.color = this.gels[++this.gel % this.gels.length];
    this.wasResting = resting;
    if (this.age < this.warn || resting) return;
    this.move?.(this, dt, box);
    if (this.lit && this.age >= this.nextScorch) {
      this.nextScorch = this.age + 0.08;
      const a = Math.random() * TAU;
      const d = Math.random() * this.r * 0.75;
      this.scorch.push({ x: this.x + Math.cos(a) * d, y: this.y + Math.sin(a) * d, age: 0, size: Math.random() < 0.3 ? 2 : 1 });
    }
  }

  isGone() { return this.age > this.warn + this.life + 0.3 && !this.scorch.length; }

  edgeDistance(px, py) {
    return this.lit ? Math.hypot(px - this.x, py - this.y) - this.r * 0.85 : Infinity;
  }

  // Burnt dust where the light has been: specks with a last orange glint,
  // drifting up as they cool.
  drawScorch(ctx) {
    for (const mark of this.scorch) {
      const k = mark.age / 1.4;
      ctx.globalAlpha = 0.7 * (1 - k);
      fillRect(ctx, k < 0.2 ? '#ffb060' : k < 0.45 ? '#9a5a34' : '#4a3a44',
        mark.x + Math.sin(mark.age * 5 + mark.x) * 0.8, mark.y - mark.age * 6, mark.size, mark.size);
    }
    ctx.globalAlpha = 1;
  }

  draw(ctx) {
    ctx.save();
    const rgb = this.color;
    this.drawScorch(ctx);
    if (this.age < this.warn) {
      const blink = warnAlpha(this.age);
      if (this.path) {
        // The lane it will sweep: a faint band as wide as its hurting edge,
        // the edges dotted, and chevrons marching the way it'll go.
        const { x1, y1, x2, y2 } = this.path;
        const ang = Math.atan2(y2 - y1, x2 - x1);
        const nx = -Math.sin(ang) * this.r * 0.85;
        const ny = Math.cos(ang) * this.r * 0.85;
        ctx.globalAlpha = 0.08 + blink * 0.12;
        ctx.fillStyle = `rgb(${rgb})`;
        ctx.beginPath();
        ctx.moveTo(x1 + nx, y1 + ny);
        ctx.lineTo(x2 + nx, y2 + ny);
        ctx.lineTo(x2 - nx, y2 - ny);
        ctx.lineTo(x1 - nx, y1 - ny);
        ctx.fill();
        ctx.globalAlpha = blink;
        ctx.strokeStyle = `rgb(${rgb})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        for (const side of [1, -1]) {
          ctx.beginPath();
          ctx.moveTo(x1 + nx * side, y1 + ny * side);
          ctx.lineTo(x2 + nx * side, y2 + ny * side);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        const len = Math.hypot(x2 - x1, y2 - y1);
        for (let d = (this.age * 40) % 16 + this.r; d < len - this.r; d += 16) {
          const cx = x1 + Math.cos(ang) * d;
          const cy = y1 + Math.sin(ang) * d;
          ctx.beginPath();
          ctx.moveTo(cx - Math.cos(ang - 0.8) * 3, cy - Math.sin(ang - 0.8) * 3);
          ctx.lineTo(cx, cy);
          ctx.lineTo(cx - Math.cos(ang + 0.8) * 3, cy - Math.sin(ang + 0.8) * 3);
          ctx.stroke();
        }
      } else {
        ctx.globalAlpha = blink;
        ctx.strokeStyle = `rgb(${rgb})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 0.85, 0, TAU);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }
    const over = this.age - (this.warn + this.life);
    const fade = over > 0 ? Math.max(0, 1 - over / 0.3) : 1;
    if (!this.lit) {
      if (over > 0.3) { ctx.restore(); return; }
      // Out: a cold ring where it is. Changing the gel, a square of the next
      // colour slides across the lens, and the ring blinks just before it's
      // back on.
      const left = this.rest ? this.rest(this.age - this.warn) : 0;
      ctx.globalAlpha = (left > 0 && left < 0.45 ? warnAlpha(this.age) + 0.2 : 0.28) * fade;
      ctx.strokeStyle = `rgb(${rgb})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([1, 3]);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 0.85, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      if (left > 0 && this.gels) {
        const next = this.gels[(this.gel + 1) % this.gels.length];
        const slide = clamp(1.4 - left * 1.6, 0, 1);
        ctx.globalAlpha = 0.55;
        fillRect(ctx, `rgb(${next})`, this.x - 4, this.y - 3, Math.max(1, 8 * slide), 6);
        fillRect(ctx, '#1a0f18', this.x - 4 + 8 * slide, this.y - 4, 1, 8);
      }
      // A thread of smoke off the hot lens.
      ctx.globalAlpha = 0.35 * fade;
      for (let i = 0; i < 4; i++) fillRect(ctx, '#9a90a8', this.x + Math.sin(this.age * 4 + i) * 1.5, this.y - 4 - i * 3, 1, 2);
      ctx.restore();
      return;
    }
    ctx.globalAlpha = fade;
    // The beam, from the rig to the pool, with dust turning in it.
    const ang = Math.atan2(this.y - this.rig.y, this.x - this.rig.x);
    const nx = -Math.sin(ang);
    const ny = Math.cos(ang);
    const beam = ctx.createLinearGradient(this.rig.x, this.rig.y, this.x, this.y);
    beam.addColorStop(0, `rgba(${rgb}, 0.04)`);
    beam.addColorStop(1, `rgba(${rgb}, 0.22)`);
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(this.rig.x - nx * 2, this.rig.y - ny * 2);
    ctx.lineTo(this.rig.x + nx * 2, this.rig.y + ny * 2);
    ctx.lineTo(this.x + nx * this.r, this.y + ny * this.r);
    ctx.lineTo(this.x - nx * this.r, this.y - ny * this.r);
    ctx.fill();
    for (let i = 0; i < 5; i++) {
      const u = (this.age * 0.3 + i * 0.21) % 1;
      const w = Math.sin(this.age * 2 + i * 2.3) * (1 + u * this.r * 0.7);
      ctx.globalAlpha = 0.6 * fade * Math.sin(u * Math.PI);
      fillRect(ctx, '#ffffff', this.rig.x + (this.x - this.rig.x) * u + nx * w, this.rig.y + (this.y - this.rig.y) * u + ny * w, 1, 1);
    }
    ctx.globalAlpha = fade;
    // The pool, with a hot spot.
    const pool = ctx.createRadialGradient(this.x - 1, this.y - 1, 0, this.x, this.y, this.r);
    pool.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    pool.addColorStop(0.3, `rgba(${rgb}, 0.85)`);
    pool.addColorStop(0.8, `rgba(${rgb}, 0.6)`);
    pool.addColorStop(1, `rgba(${rgb}, 0)`);
    ctx.fillStyle = pool;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, TAU);
    ctx.fill();
    // Its hard edge, where it starts to hurt.
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.9 * fade;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r * 0.85, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }
}

// --- Trapdoors ---

// A hatch in the floor of the box, `w` by `h`. It blinks shut (warn), then
// bangs open and a boxing glove on a spring pops out of the dark. Only the
// open hole hurts.
export class Trapdoor {
  constructor({ x, y, w = 20, h = 20, warn = 0.8, life = 0.85 }) {
    Object.assign(this, { x, y, w, h, warn, life });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get open() { return this.age >= this.warn + 0.04 && this.age < this.warn + this.life; }

  update(dt) { this.age += dt; }

  isGone() { return this.age > this.warn + this.life + 0.3; }

  edgeDistance(px, py) {
    return this.open ? rectDist(px, py, this.x + 1, this.y + 1, this.w - 2, this.h - 2) : Infinity;
  }

  draw(ctx) {
    const { x, y, w, h } = this;
    const flap = (alpha, tilt = 0) => {
      ctx.globalAlpha = alpha;
      fillRect(ctx, C.n, x + 1, y + 1, w - 2, h - 2);
      for (let i = 3; i < h - 2; i += 4) fillRect(ctx, '#4a2e18', x + 1, y + i, w - 2, 1);
      fillRect(ctx, '#8a5a30', x + 1, y + 1 + tilt, w - 2, 1);
      // Hinges and a pull-ring.
      fillRect(ctx, C.g, x + 2, y + 2, 3, 1);
      fillRect(ctx, C.g, x + w - 5, y + 2, 3, 1);
      fillRect(ctx, C.g, x + w / 2 - 1, y + h - 5, 2, 2);
    };
    ctx.save();
    if (this.age < this.warn) {
      flap(1);
      ctx.globalAlpha = warnAlpha(this.age);
      ctx.strokeStyle = '#ff3a5a';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
      ctx.restore();
      return;
    }
    const since = this.age - this.warn;
    if (since >= this.life) {
      // Banging shut again.
      flap(Math.max(0, 1 - (since - this.life) / 0.3));
      ctx.restore();
      return;
    }
    // The hole: dark with a hot glow, and the lid thrown back on its hinge.
    fillRect(ctx, '#0a0610', x + 1, y + 1, w - 2, h - 2);
    fillRect(ctx, '#ff3a5a', x + 1, y + 1, w - 2, 1);
    fillRect(ctx, '#7a1428', x + 1, y + h - 2, w - 2, 1);
    fillRect(ctx, '#5a2438', x + 1, y + 2, 1, h - 4);
    fillRect(ctx, '#5a2438', x + w - 2, y + 2, 1, h - 4);
    // The glove on its spring.
    const pop = Math.min(1, since / 0.12);
    const gy = y + h - 4 - pop * (h - 10);
    ctx.strokeStyle = C.S;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 6; i++) ctx.lineTo(x + w / 2 + (i % 2 ? 2 : -2), gy + 4 + ((y + h - 2 - gy - 4) * i) / 6);
    ctx.stroke();
    ctx.fillStyle = C.r;
    ctx.beginPath();
    ctx.arc(x + w / 2, gy + 1, 4, 0, TAU);
    ctx.fill();
    fillRect(ctx, C.w, x + w / 2 - 3, gy + 3, 6, 2);
    fillRect(ctx, '#ff9aa8', x + w / 2 - 2, gy - 1, 2, 1);
    ctx.restore();
  }
}

// --- Prop swords on strings ---

const BLADE = 17;

// A prop sword hung from a string, swinging like a pendulum from `pivot`.
// Cardboard, with silver foil: it still cuts. Cut its string and it drops,
// harmless.
export class Pendulum {
  constructor({ px, py, length = 54, swing = 0.95, period = 2.6, phase = 0, warn = 0.9, life = 6 }) {
    Object.assign(this, { px, py, length, swing, period, phase, warn, life });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.severed = false;
    this.fx = 0;
    this.fy = 0;
    this.fvy = 0;
    this.spin = 0;
  }

  get angle() {
    return Math.PI / 2 + this.swing * Math.sin(((Math.max(0, this.age - this.warn)) / this.period) * TAU + this.phase);
  }

  get live() { return this.age >= this.warn && this.age < this.warn + this.life && !this.severed; }

  // Where the string ends and the hilt starts, and the tip.
  get hilt() { return { x: this.px + Math.cos(this.angle) * this.length, y: this.py + Math.sin(this.angle) * this.length }; }
  get tip() { const a = this.angle; return { x: this.px + Math.cos(a) * (this.length + BLADE), y: this.py + Math.sin(a) * (this.length + BLADE) }; }

  get cuttable() { return this.age >= this.warn && !this.severed; }
  cutDistance(x, y) { const h = this.hilt; return Math.min(segDist(x, y, this.px, this.py, h.x, h.y), Math.hypot(x - h.x, y - h.y)); }
  cut() {
    const h = this.hilt;
    this.severed = true;
    this.fx = h.x;
    this.fy = h.y;
    this.fAngle = this.angle;
    this.spin = (Math.random() < 0.5 ? -1 : 1) * 4;
  }

  update(dt) {
    this.age += dt;
    if (this.severed) {
      this.fvy += 260 * dt;
      this.fy += this.fvy * dt;
      this.fAngle += this.spin * dt;
    }
  }

  isGone() { return this.age > this.warn + this.life + 0.3 || (this.severed && this.fy > 220); }

  edgeDistance(px, py) {
    if (!this.live) return Infinity;
    const h = this.hilt;
    const t = this.tip;
    return segDist(px, py, h.x, h.y, t.x, t.y) - 1.8;
  }

  drawSword(ctx, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    // Drawn pointing right: hilt at the left.
    fillRect(ctx, C.k, -1, -3, 2, 6); // guard
    fillRect(ctx, C.g, -1, -2, 1, 4);
    fillRect(ctx, C.c, -4, -1, 3, 2); // grip, cardboard
    fillRect(ctx, C.k, 0, -1.5, BLADE, 3);
    fillRect(ctx, C.s, 1, -1, BLADE - 2, 1);
    fillRect(ctx, C.S, 1, 0, BLADE - 2, 1);
    fillRect(ctx, C.w, BLADE - 4, -1, 2, 1);
    ctx.restore();
  }

  draw(ctx) {
    ctx.save();
    if (this.age < this.warn) {
      // Where it'll swing.
      ctx.globalAlpha = warnAlpha(this.age) * 0.8;
      ctx.strokeStyle = C.s;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.arc(this.px, this.py, this.length + BLADE - 3, Math.PI / 2 - this.swing, Math.PI / 2 + this.swing);
      ctx.stroke();
      ctx.restore();
      return;
    }
    if (this.severed) {
      ctx.globalAlpha = 0.9;
      this.drawSword(ctx, this.fx, this.fy, this.fAngle);
      // The snipped end of the string, curling up.
      ctx.strokeStyle = '#e8e0d0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.px, this.py);
      ctx.lineTo(this.px + Math.sin(this.age * 6) * 2, this.py + 7);
      ctx.stroke();
      ctx.restore();
      return;
    }
    const over = this.age - (this.warn + this.life);
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.3);
    const h = this.hilt;
    ctx.strokeStyle = '#e8e0d0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.px, this.py);
    ctx.lineTo(h.x, h.y);
    ctx.stroke();
    this.drawSword(ctx, h.x, h.y, this.angle);
    ctx.restore();
  }
}

// A prop sword dropped on its string straight down a lane (it blinks a line
// down the lane first). Cut the string and it hangs limp, harmless.
export class SwordDive {
  constructor({ x, top, bottom, warn = 0.8, speed = 150 }) {
    Object.assign(this, { x, top, bottom, warn, speed });
    this.age = 0;
    this.y = top;
    this.dmg = null;
    this.grazed = false;
    this.severed = false;
  }

  get falling() { return this.age >= this.warn && !this.severed && this.y < this.bottom + 20; }
  get cuttable() { return this.age >= this.warn && !this.severed; }
  cutDistance(x, y) { return segDist(x, y, this.x, this.top, this.x, this.y); }
  cut() { this.severed = true; this.vy = 0; }

  update(dt) {
    this.age += dt;
    if (this.age < this.warn) return;
    if (this.severed) {
      this.vy = (this.vy ?? 0) + 280 * dt;
      this.y += this.vy * dt;
    } else {
      this.y += this.speed * dt;
    }
  }

  isGone() { return this.y > this.bottom + 60; }

  edgeDistance(px, py) {
    if (!this.falling) return Infinity;
    return segDist(px, py, this.x, this.y, this.x, this.y + BLADE) - 1.8;
  }

  draw(ctx) {
    ctx.save();
    if (this.age < this.warn) {
      ctx.globalAlpha = warnAlpha(this.age);
      ctx.strokeStyle = C.s;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(this.x, this.top);
      ctx.lineTo(this.x, this.bottom);
      ctx.stroke();
      ctx.restore();
      return;
    }
    if (!this.severed) {
      ctx.strokeStyle = '#e8e0d0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.x, this.top);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
    }
    // The sword, point down.
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.PI / 2 + (this.severed ? this.age * 5 : 0));
    fillRect(ctx, C.k, -1, -3, 2, 6);
    fillRect(ctx, C.g, -1, -2, 1, 4);
    fillRect(ctx, C.k, 0, -1.5, BLADE, 3);
    fillRect(ctx, C.s, 1, -1, BLADE - 2, 1);
    fillRect(ctx, C.S, 1, 0, BLADE - 2, 1);
    fillRect(ctx, C.w, BLADE - 4, -1, 2, 1);
    ctx.restore();
  }
}

// --- Puppet strings ---

// A puppet string lowered from the rig with a brass hook on the end. The
// hook steers after your shadow; if it catches it, the string reels it back
// up toward the rig (the attack does the pulling; see rumbold.js). Cut the
// string and you're free. `wander` makes it drift off course (the tangled
// one in phase 2).
export class PuppetHook {
  constructor({ x0, top, soul, speed = 36, hold = 2.4, wander = 0, reach = 6 }) {
    Object.assign(this, { x0, top, soul, speed, hold, wander, reach });
    this.x = x0;
    this.y = top + 4;
    this.age = 0;
    this.state = 'down'; // then 'caught', 'reeled' or 'cut'
    this.caughtAt = 0;
    this.heading = Math.PI / 2;
    this.turnBias = 0;
    this.dmg = null;
    this.grazed = false;
    this.vx = 0;
    this.vy = 0;
    this.fall = 0;
  }

  get cuttable() { return this.state === 'down' || this.state === 'caught'; }
  cutDistance(x, y) { return Math.min(segDist(x, y, this.x0, this.top, this.x, this.y), Math.hypot(x - this.x, y - this.y)); }
  cut() { this.state = 'cut'; this.fall = 0; }

  update(dt, box) {
    this.age += dt;
    if (this.state === 'down') {
      const want = Math.atan2(this.soul.y - this.y, this.soul.x - this.x);
      let diff = ((want - this.heading + Math.PI * 3) % TAU) - Math.PI;
      if (this.wander) {
        this.turnBias += (Math.random() - 0.5) * this.wander * dt * 20;
        this.turnBias = clamp(this.turnBias, -this.wander * 2.5, this.wander * 2.5);
        diff += this.turnBias;
      }
      this.heading += clamp(diff, -1.9 * dt, 1.9 * dt);
      this.x += Math.cos(this.heading) * this.speed * dt;
      this.y += Math.sin(this.heading) * this.speed * dt;
      this.x = clamp(this.x, box.x - 2, box.x + box.w + 2);
      this.y = clamp(this.y, this.top, box.y + box.h + 6);
      if (Math.hypot(this.soul.x - this.x, this.soul.y - this.y) < this.reach) {
        this.state = 'caught';
        this.caughtAt = this.age;
      }
    } else if (this.state === 'caught') {
      this.x = this.soul.x;
      this.y = this.soul.y - 3;
      if (this.age - this.caughtAt > this.hold) this.state = 'reeled';
    } else if (this.state === 'reeled') {
      this.y -= 90 * dt;
    } else {
      this.fall += dt;
      this.y += 40 * this.fall * dt * 6;
    }
  }

  isGone() { return this.state === 'reeled' ? this.y < this.top - 6 : this.state === 'cut' ? this.y > this.top + 400 || this.fall > 1.2 : false; }

  edgeDistance() { return Infinity; }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.state === 'cut' ? Math.max(0, 1 - this.fall / 1.2) : 1;
    // The string, a bit slack when it's not pulling.
    ctx.strokeStyle = this.state === 'caught' ? '#ffffff' : '#d8d0e8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x0, this.top);
    const sag = this.state === 'caught' ? 0 : 4;
    ctx.quadraticCurveTo((this.x0 + this.x) / 2 + Math.sin(this.age * 3) * sag, (this.top + this.y) / 2, this.x, this.y - 2);
    ctx.stroke();
    // The hook: a brass J with a wooden bead above it.
    fillRect(ctx, C.n, this.x - 1, this.y - 3, 3, 2);
    fillRect(ctx, C.g, this.x, this.y - 1, 1, 3);
    fillRect(ctx, C.g, this.x - 1, this.y + 2, 3, 1);
    fillRect(ctx, C.g, this.x - 2, this.y + 1, 1, 1);
    if (this.state === 'caught') {
      ctx.globalAlpha *= 0.6;
      ctx.strokeStyle = C.g;
      ctx.beginPath();
      ctx.arc(this.x, this.y + 3, 5 + Math.sin(this.age * 20), 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// A puppeteer's control bar sliding down the box on its strings: two
// wooden slats with a gap to slip through.
export class ControlBar {
  constructor({ x, w, y, gapX, gapW, vy = 38, top }) {
    Object.assign(this, { x, w, y, gapX, gapW, vy, top });
    this.h = 5;
    this.dmg = null;
    this.grazed = false;
    this.age = 0;
  }

  update(dt) { this.age += dt; this.y += this.vy * dt; }
  isGone(box) { return this.y > box.y + box.h + 12; }

  edgeDistance(px, py) {
    return Math.min(
      rectDist(px, py, this.x, this.y, this.gapX - this.x, this.h),
      rectDist(px, py, this.gapX + this.gapW, this.y, this.x + this.w - this.gapX - this.gapW, this.h),
    );
  }

  draw(ctx) {
    ctx.save();
    // Strings up to the rig.
    ctx.strokeStyle = '#d8d0e8';
    ctx.lineWidth = 1;
    for (const sx of [this.x + 6, this.gapX - 4, this.gapX + this.gapW + 4, this.x + this.w - 6]) {
      if (sx < this.x || sx > this.x + this.w) continue;
      ctx.beginPath();
      ctx.moveTo(sx, this.top);
      ctx.lineTo(sx, this.y);
      ctx.stroke();
    }
    const slat = (x0, x1) => {
      if (x1 - x0 < 1) return;
      fillRect(ctx, C.k, x0, this.y, x1 - x0, this.h);
      fillRect(ctx, '#b07a44', x0 + 1, this.y + 1, x1 - x0 - 2, 2);
      fillRect(ctx, C.n, x0 + 1, this.y + 3, x1 - x0 - 2, 1);
      fillRect(ctx, C.g, x0 + 2, this.y + 2, 1, 1);
      fillRect(ctx, C.g, x1 - 3, this.y + 2, 1, 1);
    };
    slat(this.x, this.gapX);
    slat(this.gapX + this.gapW, this.x + this.w);
    ctx.restore();
  }
}

// --- The chorus line ---

// A cardboard cut-out mole on a stick, in a kick line. It marches, and on the
// row's beat it kicks a leg out `kick` (a way: 'up', 'down', 'left', 'right')
// with a patent shoe on the end. The leg raises (a warning), then kicks.
// `beat(t)` says what the row's doing now: 0 marching, 1 leg raised, 2 kick.
export class CardboardMole {
  constructor({ x, y, vx, kick = 'down', row, flopAt = null, paw = false }) {
    Object.assign(this, { x, y, vx, kick, row, flopAt, paw });
    this.seed = Math.random() * 10;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.flop = 0;
  }

  get facing() { return this.vx >= 0 ? 1 : -1; }

  update(dt) {
    this.age += dt;
    this.x += this.vx * dt * (this.flop > 0 ? 0.3 : 1);
    if (this.flopAt !== null && this.age >= this.flopAt) this.flop += dt;
  }

  isGone(box) { return this.x < box.x - 30 || this.x > box.x + box.w + 30; }

  // The leg's state from its row: `this.row.state` is set by the attack.
  get legState() { return this.flop > 0 ? 0 : this.row.state; }

  // (A row can call the kick: high and low by turns.)
  get legVector() {
    return { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[this.row.kick ?? this.kick];
  }

  legEnd(length) {
    const [dx, dy] = this.legVector;
    // The leg starts at the edge of the body.
    const sx = this.x + dx * 4;
    const sy = this.y + dy * 7;
    return { sx, sy, ex: sx + dx * length, ey: sy + dy * length };
  }

  edgeDistance(px, py) {
    // A flat mole (tripped, phase 2) lies on its back and hurts as a slab.
    if (this.flop > 0.25) return rectDist(px, py, this.x - 9, this.y + 2, 18, 5);
    let gap = rectDist(px, py, this.x - 4.5, this.y - 6.5, 9, 13);
    if (this.legState === 2) {
      const { sx, sy, ex, ey } = this.legEnd(11);
      gap = Math.min(gap, segDist(px, py, sx, sy, ex, ey) - 2.5);
    }
    return gap;
  }

  draw(ctx) {
    ctx.save();
    const f = this.facing;
    const x = Math.round(this.x);
    const y = Math.round(this.y);
    if (this.flop > 0) {
      const tip = Math.min(1, this.flop / 0.25);
      ctx.translate(x, y + 7);
      ctx.rotate(tip * (Math.PI / 2) * f);
      ctx.translate(-x, -(y + 7));
    }
    // The stick below, held up by somebody offstage.
    fillRect(ctx, C.n, x - 0.5, y + 6, 1, this.paw ? 5 : 6);
    // The kicking leg, behind the body.
    const state = this.legState;
    if (state > 0) {
      const length = state === 2 ? 11 : 5;
      const { sx, sy, ex, ey } = this.legEnd(length);
      ctx.strokeStyle = C.R;
      ctx.lineWidth = 3;
      ctx.lineCap = 'butt';
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.strokeStyle = C.w;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = C.k;
      ctx.beginPath();
      ctx.arc(ex, ey, state === 2 ? 2.6 : 2, 0, TAU);
      ctx.fill();
      fillRect(ctx, C.w, ex - 1, ey - 1, 1, 1);
    }
    // The cut-out: card edge, grey velvet body, a pink snout. They're all
    // terrified: wide eyes darting about, eyebrows up, a wobbling mouth, a
    // bead of sweat; and they tremble as they lift a leg.
    const t = this.age + this.seed;
    const shiver = state === 1 && Math.floor(t * 30) % 2 ? 1 : 0;
    const bx = x + shiver;
    fillRect(ctx, C.c, bx - 5, y - 7, 10, 14);
    fillRect(ctx, C.C, bx - 5, y + 6, 10, 1);
    fillRect(ctx, '#5a5470', bx - 4, y - 6, 8, 12);
    fillRect(ctx, '#7a7494', bx - 4, y - 6, 8, 2);
    fillRect(ctx, '#eaa8a0', bx + (f > 0 ? 3 : -4), y - 3, 1, 2);
    // Eyes: whites, and pupils that dart (toward the audience, mostly).
    const look = Math.floor(t * 1.7) % 3 === 0 ? -f : f;
    for (const ex of [bx - 3, bx]) {
      fillRect(ctx, C.w, ex, y - 5, 2, 2);
      fillRect(ctx, C.k, ex + (look > 0 ? 1 : 0), y - 5 + (state === 2 ? 1 : 0), 1, 1);
      // Eyebrows, raised high.
      fillRect(ctx, '#2a2438', ex, y - 7 + (state === 2 ? 0 : 0), 2, 1);
    }
    // The mouth, a wobbling line (an O on the kick).
    if (state === 2) {
      fillRect(ctx, C.k, bx - 2, y - 2, 2, 2);
    } else {
      for (let i = 0; i < 4; i++) fillRect(ctx, C.k, bx - 3 + i, y - 2 + ((i + Math.floor(t * 8)) % 2), 1, 1);
    }
    // A bead of sweat running down the card.
    const drip = (t * 0.9) % 1;
    if (drip < 0.7) {
      fillRect(ctx, '#bfe8ff', bx + (f > 0 ? -5 : 4), y - 6 + drip * 8, 1, 2);
    }
    // A little bow tie, for the show.
    fillRect(ctx, C.r, bx - 2, y + 1, 4, 2);
    fillRect(ctx, C.y, bx - 0.5, y + 1, 1, 2);
    // Hands on hips: two pink dots.
    fillRect(ctx, '#eaa8a0', bx - 5, y + 1, 1, 2);
    fillRect(ctx, '#eaa8a0', bx + 4, y + 1, 1, 2);
    // (Phase 2: the stagehand's paw on the stick, holding it up.)
    if (this.paw && this.flop <= 0) drawPaw(ctx, x, y + 11, { t: this.age });
    ctx.restore();
  }
}

// --- The curtain ---

// A velvet curtain dropped over half the box (`side` 'left' or 'right').
// It hides what's going on behind it a bit (it's see-through, but not
// much). Its weighted hem hurts while it's coming down (get out from
// under it), but the cloth itself hurts nothing. Drop it with
// `drop()`, raise it with `raise()`.
export class DropCurtain {
  constructor({ box, side, coverage = 0.5, stuck = null }) {
    this.box = box;
    this.stuck = stuck;
    this.side = side;
    this.w = box.w * coverage;
    this.x = side === 'left' ? box.x : box.x + box.w - this.w;
    this.amount = 0;
    this.target = 0;
    this.speed = 3;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.done = false;
  }

  drop(speed = 3) { this.target = 1; this.speed = speed; }
  raise(speed = 2) { this.target = 0; this.speed = speed; this.leaving = true; }

  get down() { return this.amount >= 0.98; }

  update(dt) {
    this.age += dt;
    const step = this.speed * dt;
    // Stuck (phase 2): it catches partway down and jerks as it's tugged.
    const target = this.stuck !== null && this.target === 1
      ? this.stuck + (Math.sin(this.age * 7) > 0.6 ? 0.06 : 0) : this.target;
    const before = this.amount;
    this.amount += clamp(target - this.amount, -step, step);
    // Only on the way down: lifting, it sweeps up past you with no warning.
    this.moving = this.amount - before > 0.0005;
    if (this.leaving && this.amount <= 0.001) this.done = true;
  }

  isGone() { return this.done; }
  edgeDistance(px, py) {
    if (!this.moving || this.amount <= 0) return Infinity;
    const h = Math.round(this.box.h * this.amount);
    return rectDist(px, py, this.x, this.box.y + h - 4, this.w, 4);
  }

  draw(ctx) {
    if (this.amount <= 0) return;
    const { box } = this;
    const h = Math.round(box.h * this.amount);
    ctx.save();
    ctx.globalAlpha = 0.88;
    fillRect(ctx, '#7a1428', this.x, box.y, this.w, h);
    for (let i = 0; i < this.w; i++) {
      const fold = i % 8;
      const shade = fold === 0 ? '#50091a' : fold === 1 ? '#640f22' : fold === 4 ? '#9a2036' : fold === 5 ? '#b02a44' : null;
      if (shade) fillRect(ctx, shade, this.x + i, box.y, 1, h);
    }
    // Gold fringe along the hem.
    fillRect(ctx, C.g, this.x, box.y + h - 3, this.w, 2);
    for (let i = 0; i < this.w; i += 2) fillRect(ctx, C.Y ?? '#bf8a26', this.x + i, box.y + h - 1, 1, 1);
    // The rod it hangs from.
    fillRect(ctx, C.g, this.x, box.y, this.w, 1);
    ctx.globalAlpha = 1;
    // Stuck: a stagehand's paw reaching up, tugging at the hem.
    if (this.stuck !== null && this.amount > 0.3) drawPaw(ctx, this.x + this.w / 2, box.y + h, { t: this.age });
    ctx.restore();
  }
}

// --- Stagehands ---

// A stagehand's paw: Tuck's, golden and small, out of the end of a red
// sleeve far too big for him, gripping the stick or the hem of whatever
// it's holding up (phase 2, now you can see who works the show). `x, y` is
// where it grips; it reaches up from below (or down, `up: false`). It
// trembles now and then.
export function drawPaw(ctx, x, y, { up = true, t = 0 } = {}) {
  const shake = Math.floor(t * 9) % 5 === 0 ? 1 : 0;
  const px = Math.round(x) + shake;
  const py = Math.round(y);
  const s = up ? 1 : -1;
  const row = (dy, color, dx, w) => fillRect(ctx, color, px + dx, py + dy * s - (up ? 0 : 0), w, 1);
  // The sleeve, red with a gold cuff.
  for (let i = 3; i < 9; i++) {
    row(i, C.k, -3, 7);
    row(i, i === 3 ? C.g : i % 3 ? '#c8304a' : '#a02038', -2, 5);
  }
  // The paw, wrapped round the grip: three knuckles over it, a pink pad.
  row(-2, C.k, -2, 1);
  row(-2, C.k, 0, 1);
  row(-2, C.k, 2, 1);
  row(-1, C.k, -3, 7);
  row(-1, '#dda46a', -2, 1);
  row(-1, '#dda46a', 0, 1);
  row(-1, '#f0c890', 2, 1);
  row(0, C.k, -3, 7);
  row(0, '#dda46a', -2, 5);
  row(1, C.k, -3, 7);
  row(1, '#dda46a', -2, 4);
  row(1, '#ea9c9c', 1, 1);
  row(2, C.k, -3, 7);
  row(2, '#b27c4a', -2, 5);
}

// --- Party poppers ---

// A party popper in the wall of the box: a striped paper cone. While it
// warns it turns to follow your shadow; then it locks (shakes, and shows
// the spread it will fire) for `lock` seconds; then POP. The attack fires
// the confetti along `aim` (see rumbold.js). It hurts nothing itself.
export class Popper {
  constructor({ x, y, left, soul, warn = 0.75, lock = 0.3 }) {
    Object.assign(this, { x, y, left, soul, warn, lock });
    this.base = left ? 0 : Math.PI;
    this.aim = this.base;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.vx = 0;
    this.vy = 0;
  }

  get locked() { return this.age >= this.warn - this.lock; }

  update(dt) {
    this.age += dt;
    if (this.locked || !this.soul) return;
    const want = Math.atan2(this.soul.y - this.y, this.soul.x - this.x);
    const off = clamp(((want - this.base + Math.PI * 3) % TAU) - Math.PI, -1.1, 1.1);
    const diff = ((this.base + off - this.aim + Math.PI * 3) % TAU) - Math.PI;
    this.aim += clamp(diff, -5 * dt, 5 * dt);
  }

  isGone() { return this.age > this.warn + 0.7; }
  edgeDistance() { return Infinity; }

  draw(ctx) {
    const since = this.age - this.warn;
    ctx.save();
    const shake = this.locked && since < 0 ? (Math.floor(this.age * 30) % 2 ? 0.6 : -0.6) : 0;
    const recoil = since > 0 ? Math.max(0, 2.5 - since * 8) : 0;
    ctx.translate(this.x - Math.cos(this.aim) * recoil, this.y + shake - Math.sin(this.aim) * recoil);
    ctx.rotate(this.aim);
    if (this.locked && since < 0) {
      // The way it will fire, and how wide.
      ctx.save();
      ctx.globalAlpha = warnAlpha(this.age);
      ctx.strokeStyle = C.y;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      for (const a of [-0.55, 0, 0.55]) {
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 9, Math.sin(a) * 9);
        ctx.lineTo(Math.cos(a) * (a ? 18 : 26), Math.sin(a) * (a ? 18 : 26));
        ctx.stroke();
      }
      ctx.restore();
    }
    // The cone: narrow at the back, striped red and gold.
    for (let i = 0; i < 8; i++) {
      const h = 1 + Math.floor(i / 2);
      fillRect(ctx, C.k, i - 1, -h - 1, 1, h * 2 + 2);
      fillRect(ctx, (Math.floor(i / 2) % 2) ? C.y : C.r, i - 1, -h, 1, h * 2);
    }
    fillRect(ctx, '#ffffff', 1, -1, 4, 1);
    if (since < 0) {
      // The paper cap over its mouth, and the pull-string out of the back.
      fillRect(ctx, '#fff6c0', 7, -4, 1, 8);
      fillRect(ctx, '#e8e0d0', -3, Math.round(Math.sin(this.age * 8)), 2, 1);
    } else {
      // Popped: a dark mouth, the cap gone, a curl of smoke.
      fillRect(ctx, '#1a0f18', 7, -3, 1, 6);
      ctx.globalAlpha = Math.max(0, 0.6 - since);
      for (let i = 0; i < 3; i++) fillRect(ctx, '#d8d0e8', 9 + since * 14 + i * 2, Math.sin(since * 9 + i) * 2 - 1, 2, 2);
    }
    ctx.restore();
  }
}

// --- The applause ---

// A white glove: it waits at the wall of the box, fingers drumming, while a
// dotted line shows its row and a mark shows where it will meet its pair.
// Then it rushes in (`speed`, as `vx`) and stops dead at `toX`, squashed
// flat by the clap. It hurts while it rushes. The one with the `mark` also
// makes the CLAP where the pair meet: a burst of lines that flares and is
// gone, which hurts only right at the meeting point. (Give a pair speeds
// that bring them in together.)
export class ClapHand {
  constructor({ x, y, toX, warn = 0.75, speed = 96, mark = false }) {
    Object.assign(this, { x, y, toX, warn, mark });
    this.popLife = 0.24;
    this.from = x;
    this.dir = toX > x ? 1 : -1;
    this.vx = speed * this.dir;
    this.vy = 0;
    this.age = 0;
    this.met = false;
    this.metAge = 0;
    this.dmg = null;
    this.grazed = false;
  }

  update(dt) {
    this.age += dt;
    if (this.age < this.warn || this.met) return;
    this.x += this.vx * dt;
    if ((this.x - (this.toX - this.dir * 3)) * this.dir >= 0) {
      this.x = this.toX - this.dir * 3;
      this.met = true;
      this.metAge = this.age;
    }
  }

  isGone() { return this.met && this.age > this.metAge + 0.4; }

  get popR() { return 2 + Math.min(1, (this.age - this.metAge) / 0.1) * 4; }

  edgeDistance(px, py) {
    if (this.age < this.warn) return Infinity;
    if (this.met) {
      return this.mark && this.age - this.metAge < this.popLife ? Math.hypot(px - this.toX, py - this.y) - this.popR : Infinity;
    }
    return rectDist(px, py, this.x - 3.5, this.y - 2.5, 7, 5);
  }

  drawPop(ctx) {
    const k = Math.min(1, (this.age - this.metAge) / this.popLife);
    if (k >= 1) return;
    const r = this.popR;
    ctx.save();
    ctx.globalAlpha = 1 - k * 0.8;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.toX, this.y, r, 0, TAU);
    ctx.stroke();
    ctx.strokeStyle = C.y;
    for (let i = 0; i < 8; i++) {
      const a = i * (TAU / 8) + 0.2;
      const r0 = r + 1 + k * 3;
      const r1 = r0 + (i % 2 ? 2 : 4);
      ctx.beginPath();
      ctx.moveTo(this.toX + Math.cos(a) * r0, this.y + Math.sin(a) * r0);
      ctx.lineTo(this.toX + Math.cos(a) * r1, this.y + Math.sin(a) * r1);
      ctx.stroke();
    }
    if (k < 0.5) fillRect(ctx, '#ffffff', this.toX - 1, this.y - 1, 2, 2);
    ctx.restore();
  }

  draw(ctx) {
    ctx.save();
    if (this.age < this.warn) {
      ctx.globalAlpha = warnAlpha(this.age) * 0.8;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.setLineDash([1, 3]);
      ctx.beginPath();
      ctx.moveTo(this.from, this.y + 0.5);
      ctx.lineTo(this.toX, this.y + 0.5);
      ctx.stroke();
      if (this.mark) {
        // Where they'll meet: a little starburst.
        ctx.setLineDash([]);
        ctx.strokeStyle = C.y;
        for (const [dx, dy] of [[3, 0], [0, 3], [2, 2], [2, -2]]) {
          ctx.beginPath();
          ctx.moveTo(this.toX - dx, this.y + 0.5 - dy);
          ctx.lineTo(this.toX + dx, this.y + 0.5 + dy);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }
    let sx = 1;
    let sy = 1;
    if (this.met) {
      const k = Math.min(1, (this.age - this.metAge) / 0.25);
      sx = 0.55 + k * 0.2;
      sy = 1.35 - k * 0.2;
      ctx.globalAlpha = 1 - k;
    } else if (this.age >= this.warn) {
      // Stretched with the speed of it.
      sx = 1.25;
      sy = 0.85;
    }
    ctx.translate(Math.round(this.x), Math.round(this.y));
    ctx.scale(sx * this.dir, sy);
    // Drawn pointing right: the red cuff at the back, palm, thumb up, and
    // fingers that drum while it waits.
    const drum = this.age < this.warn ? Math.floor(this.age * 12) % 4 : -1;
    fillRect(ctx, C.k, -5, -3, 9, 7);
    fillRect(ctx, C.r, -5, -2, 1, 5);
    fillRect(ctx, '#ffffff', -4, -2, 6, 5);
    fillRect(ctx, C.W, -4, 2, 6, 1);
    for (let i = 0; i < 4; i++) fillRect(ctx, i % 2 ? '#f0ecf8' : '#ffffff', 2, -2 + i, drum === i ? 1 : 2, 1);
    fillRect(ctx, '#ffffff', -1, -4, 2, 2);
    fillRect(ctx, C.W, 0, 1, 1, 1);
    ctx.restore();
    if (this.met && this.mark) this.drawPop(ctx);
  }
}

// --- Sandbags ---

// A sandbag let go from the flies: it falls with its cut rope whipping
// after it, hurting as it falls, and lands on the floor of the box with a
// thump: it squashes, puffs dust, and sits there harmless for a moment.
export class Sandbag {
  constructor({ x, y, floor, vy = 30, gravity = 330 }) {
    Object.assign(this, { x, y, floor, vy, gravity });
    this.vx = 0;
    this.age = 0;
    this.landed = null;
    this.dmg = null;
    this.grazed = false;
    this.dust = [];
  }

  update(dt) {
    this.age += dt;
    for (const d of this.dust) {
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.vy += 30 * dt;
      d.age += dt;
    }
    if (this.landed !== null) return;
    this.vy += this.gravity * dt;
    this.y += this.vy * dt;
    if (this.y + 4 >= this.floor) {
      this.y = this.floor - 4;
      this.landed = this.age;
      for (let i = 0; i < 8; i++) {
        const side = i % 2 ? 1 : -1;
        this.dust.push({ x: this.x + side * 3, y: this.y + 3, vx: side * (14 + Math.random() * 24), vy: -6 - Math.random() * 12, age: 0 });
      }
    }
  }

  isGone() { return this.landed !== null && this.age > this.landed + 0.8; }

  edgeDistance(px, py) {
    return this.landed === null ? rectDist(px, py, this.x - 4, this.y - 4, 8, 8) : Infinity;
  }

  draw(ctx) {
    ctx.save();
    const since = this.landed === null ? -1 : this.age - this.landed;
    if (since > 0.5) ctx.globalAlpha = Math.max(0, 1 - (since - 0.5) / 0.3);
    // Squashed by the landing, stretched by the fall.
    const squash = since >= 0 ? Math.max(0, 1 - since / 0.18) : 0;
    const stretch = since < 0 ? Math.min(0.25, this.vy / 900) : 0;
    const w = 8 * (1 + squash * 0.4 - stretch * 0.5);
    const h = 8 * (1 - squash * 0.35 + stretch);
    const x = this.x - w / 2;
    const y = this.y + 4 - h;
    if (since < 0) {
      ctx.strokeStyle = '#c8b090';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.x, y);
      ctx.lineTo(this.x + Math.sin(this.age * 20) * 1.5, y - 6);
      ctx.stroke();
    }
    fillRect(ctx, C.k, x, y + 1, w, h - 1);
    fillRect(ctx, C.k, x + 1, y, w - 2, 1);
    fillRect(ctx, C.c, x + 1, y + 1, w - 2, h - 2);
    fillRect(ctx, '#e0b878', x + 1, y + 1, w - 3, 1);
    fillRect(ctx, C.C, x + 1, y + h - 2, w - 2, 1);
    // The tied neck with its rope, and a fold of sacking along the bottom.
    fillRect(ctx, C.C, this.x - 1, y - 1, 2, 2);
    fillRect(ctx, '#c8b090', this.x - 2, y + 1, 4, 1);
    fillRect(ctx, C.C, x + 2, y + h - 3, w - 4, 1);
    for (const d of this.dust) {
      ctx.globalAlpha = Math.max(0, 0.7 - d.age * 1.2);
      fillRect(ctx, '#b8a888', d.x, d.y, d.age < 0.2 ? 2 : 1, 1);
    }
    ctx.restore();
  }
}
