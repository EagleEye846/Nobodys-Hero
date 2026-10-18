import { makeSprite } from '../engine/sprite.js';
import { clamp } from './patternTools.js';

// The things enemies fire, and their art.
//
// Anything in the battle's bullet list is an object with update(dt, box),
// isGone(box), edgeDistance(x, y) (the gap between a point and its harmful
// edge; under 2 is a hit; Infinity while it can't hurt) and draw(ctx), in
// world pixels. Shot, Line and Pillar below are the usual ones; an attack file
// can make its own as long as it has those four methods.

// ---------------------------------------------------------------------------
// Bullet art

const ART = new Map();

// Registers a bullet's look, by name. Shots then use it with `art: 'name'`.
//   frames        one or more frames, each rows of characters like every sprite
//   palette       { char: '#colour' }
//   radius        hit radius in world pixels (a circle at the bullet's centre)
//   hitbox        { w, h } for a rectangle instead (candles, walls of things)
//   rotate        true if the art is drawn pointing RIGHT and should turn to
//                 face where it's flying (pins, needles, moths)
//   spin          radians per second to spin no matter where it's going (buttons)
//   frameSeconds  how long each animation frame shows
export function defineBulletArt(name, { frames, palette, radius = 2, hitbox = null, rotate = false, spin = 0, frameSeconds = 0.12 }) {
  ART.set(name, {
    frames: frames.map((rows) => makeSprite(rows, palette)),
    radius,
    hitbox,
    rotate,
    spin,
    frameSeconds,
  });
}

export function bulletArtNames() {
  return [...ART.keys()];
}

// Generic bullets for the built-in patterns and the Pattern Lab. Enemies should
// use their own art, defined in their file in src/battle/attacks/.
const PUFF = { o: '#9a86d8', w: '#f2ecff' };
defineBulletArt('small', { frames: [['.o.', 'owo', '.o.']], palette: PUFF, radius: 1.5 });
defineBulletArt('puff', { frames: [['.ooo.', 'owwwo', 'owwwo', 'owwwo', '.ooo.']], palette: PUFF, radius: 2.5 });
defineBulletArt('yarn', {
  frames: [[
    '..ooooo..',
    '.oaaaaao.',
    'oaabbaaao',
    'oabaabaao',
    'oaaabaabo',
    'oabaabaao',
    'oaabbaaao',
    '.oaaaaao.',
    '..ooooo..',
  ]],
  palette: { o: '#5a2a10', a: '#ffb347', b: '#a8601a' },
  radius: 4.5,
  spin: 4,
});
defineBulletArt('dust', { frames: [['.y.', 'ywy', '.y.']], palette: { y: '#ffd25e', w: '#fff6c0' }, radius: 1.5 });
defineBulletArt('ember', { frames: [['.ooo.', 'oyyyo', 'oywyo', 'oyyyo', '.ooo.']], palette: { o: '#ff8c1a', y: '#ffd25e', w: '#fff6c0' }, radius: 2.5 });
defineBulletArt('wax', { frames: [['.c.', 'cwc', '.c.']], palette: { c: '#f2e6c8', w: '#ffffff' }, radius: 1.5 });
defineBulletArt('shadow', {
  frames: [['.ooo.', 'osSso', 'oSeSo', 'osSso', '.ooo.']],
  palette: { o: '#7a4fd0', s: '#b07cff', S: '#c9b8ff', e: '#4fe3d0' },
  radius: 2.5,
});

// ---------------------------------------------------------------------------
// Shared timing

// Telegraphs blink at this rate while they warn; anything with a lifetime fades
// out over FADE_SECONDS once it's over.
const WARN_BLINKS_PER_SECOND = 10;
const FADE_SECONDS = 0.25;

function warningAlpha(age) {
  return Math.floor(age * WARN_BLINKS_PER_SECOND) % 2 ? 0.25 : 0.6;
}

// ---------------------------------------------------------------------------
// Shot: one flying thing

// Options (all optional except x and y):
//   vx, vy      velocity in pixels per second
//   art         a name from defineBulletArt ('size' is an older name for it)
//   dmg         damage; null means the enemy's own
//   warn        seconds it sits still, blinking and harmless, before it moves
//   life        seconds it lasts once it moves, then fades away (default forever)
//   harmless    true for decorations and emitters that never hurt
//   bounce      bounces off the box walls instead of leaving
//   gravity     pixels per second squared, pulling it down
//   accel       pixels per second squared along its direction (negative slows)
//   wobble      { amplitude, frequency }: weaves up and down as it travels
//   homing      { target, turn }: steers toward target ({x, y}, e.g. the soul)
//               by up to `turn` radians per second
//   angle       which way it faces before it moves (defaults to its velocity)
export class Shot {
  constructor({
    x, y, vx = 0, vy = 0, art, size, dmg = null, warn = 0, life = Infinity, harmless = false,
    bounce = false, gravity = 0, accel = 0, wobble = null, homing = null, angle = null,
  }) {
    this.artName = art ?? size ?? 'puff';
    this.art = ART.get(this.artName);
    if (!this.art) throw new Error(`Unknown bullet art '${this.artName}'`);
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = this.art.radius;
    this.dmg = dmg;
    this.warn = warn;
    this.life = life;
    this.harmless = harmless;
    this.bounce = bounce;
    this.gravity = gravity;
    this.accel = accel;
    this.wobble = wobble;
    this.homing = homing;
    this.angle = angle ?? Math.atan2(vy, vx);
    this.baseY = y;
    this.age = 0; // counts from creation, including the warning
    this.grazed = false;
  }

  // Can it hurt right now?
  get active() {
    return !this.harmless && this.age >= this.warn && this.age < this.warn + this.life;
  }

  update(dt, box) {
    this.age += dt;
    if (this.age < this.warn) return;

    if (this.homing) {
      const speed = Math.hypot(this.vx, this.vy);
      const heading = Math.atan2(this.vy, this.vx);
      const wanted = Math.atan2(this.homing.target.y - this.y, this.homing.target.x - this.x);
      const difference = ((wanted - heading + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      const turn = clamp(difference, -this.homing.turn * dt, this.homing.turn * dt);
      this.vx = Math.cos(heading + turn) * speed;
      this.vy = Math.sin(heading + turn) * speed;
    }
    if (this.accel) {
      const speed = Math.hypot(this.vx, this.vy);
      if (speed > 0) {
        const next = Math.max(0, speed + this.accel * dt);
        this.vx *= next / speed;
        this.vy *= next / speed;
      }
    }
    this.vy += this.gravity * dt;
    this.x += this.vx * dt;
    if (this.wobble) {
      this.baseY += this.vy * dt;
      this.y = this.baseY + Math.sin((this.age - this.warn) * this.wobble.frequency) * this.wobble.amplitude;
    } else {
      this.y += this.vy * dt;
    }
    if (this.vx || this.vy) this.angle = Math.atan2(this.vy, this.vx);

    if (!this.bounce) return;
    if (this.x < box.x + this.r) { this.x = box.x + this.r; this.vx = -this.vx; }
    if (this.x > box.x + box.w - this.r) { this.x = box.x + box.w - this.r; this.vx = -this.vx; }
    if (this.y < box.y + this.r) { this.y = box.y + this.r; this.vy = -this.vy; }
    if (this.y > box.y + box.h - this.r) { this.y = box.y + box.h - this.r; this.vy = -this.vy; }
  }

  isGone(box) {
    if (this.age >= this.warn + this.life + FADE_SECONDS) return true;
    if (this.bounce || this.age < this.warn) return false;
    const frame = this.art.frames[0];
    const margin = 24 + Math.max(frame.width, frame.height);
    return this.x < box.x - margin || this.x > box.x + box.w + margin
      || this.y < box.y - margin || this.y > box.y + box.h + margin;
  }

  edgeDistance(x, y) {
    if (!this.active) return Infinity;
    if (this.art.hitbox) {
      const dx = Math.max(Math.abs(x - this.x) - this.art.hitbox.w / 2, 0);
      const dy = Math.max(Math.abs(y - this.y) - this.art.hitbox.h / 2, 0);
      return Math.hypot(dx, dy);
    }
    return Math.hypot(x - this.x, y - this.y) - this.r;
  }

  draw(ctx) {
    const art = this.art;
    const frame = art.frames[Math.floor(this.age / art.frameSeconds) % art.frames.length];
    let alpha = 1;
    if (this.age < this.warn) alpha = warningAlpha(this.age);
    const over = this.age - (this.warn + this.life);
    if (over > 0) alpha = Math.max(0, 1 - over / FADE_SECONDS);

    ctx.save();
    ctx.globalAlpha = alpha;
    const turn = (art.rotate ? this.angle : 0) + art.spin * this.age;
    if (turn) {
      ctx.translate(this.x, this.y);
      ctx.rotate(turn);
      ctx.drawImage(frame, -frame.width / 2, -frame.height / 2);
    } else {
      ctx.drawImage(frame, Math.round(this.x - frame.width / 2), Math.round(this.y - frame.height / 2));
    }
    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// Line: a straight hazard (a thread, a tendril, a beam of light)

// It starts at (x, y) and runs `length` pixels at `angle`. First it warns: a
// thin flashing preview of where it'll be, harmless. Then it's solid for
// `life` seconds. With `grow` (pixels per second) the solid part extends from
// the start like a pulled thread instead of appearing all at once. vx and vy
// slide the whole line. `color`, `thickness`, `dash` ([on, off]) and `glow`
// (a colour) set its look.
export class Line {
  constructor({
    x, y, angle = 0, length = 80, thickness = 3, warn = 0.5, life = 1, grow = 0,
    vx = 0, vy = 0, color = '#f2ecff', dash = null, glow = null, dmg = null,
  }) {
    // Anything but a colour string draws in the canvas's default black, which
    // can't be seen in the box but still hurts.
    if (typeof color !== 'string') throw new Error(`A Line's color should be a colour string, not ${typeof color}`);
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.length = length;
    this.thickness = thickness;
    this.warn = warn;
    this.life = life;
    this.grow = grow;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.dash = dash;
    this.glow = glow;
    this.dmg = dmg;
    this.age = 0;
    this.grazed = false;
  }

  get active() {
    return this.age >= this.warn && this.age < this.warn + this.life;
  }

  // How much of the line is solid so far.
  get solidLength() {
    if (this.age < this.warn) return 0;
    return this.grow ? Math.min(this.length, (this.age - this.warn) * this.grow) : this.length;
  }

  update(dt) {
    this.age += dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  isGone() {
    return this.age >= this.warn + this.life + FADE_SECONDS;
  }

  edgeDistance(px, py) {
    const length = this.solidLength;
    if (!this.active || length <= 0) return Infinity;
    const dx = Math.cos(this.angle);
    const dy = Math.sin(this.angle);
    const along = clamp((px - this.x) * dx + (py - this.y) * dy, 0, length);
    return Math.hypot(px - (this.x + dx * along), py - (this.y + dy * along)) - this.thickness / 2;
  }

  draw(ctx) {
    const dx = Math.cos(this.angle);
    const dy = Math.sin(this.angle);
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineCap = 'round';

    if (this.age < this.warn) {
      // A thin flashing preview of where it will be.
      ctx.globalAlpha = warningAlpha(this.age);
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + dx * this.length, this.y + dy * this.length);
      ctx.stroke();
      ctx.restore();
      return;
    }

    const over = this.age - (this.warn + this.life);
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / FADE_SECONDS);
    if (this.glow) {
      ctx.shadowColor = this.glow;
      ctx.shadowBlur = 6;
    }
    if (this.dash) ctx.setLineDash(this.dash);
    ctx.lineWidth = this.thickness;
    const length = this.solidLength;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + dx * length, this.y + dy * length);
    ctx.stroke();
    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// Pillar: a stone column sliding along the floor of the box (boss HEAVY mode)

export class Pillar {
  constructor({ x, y, w, h, vx }) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = vx;
    this.dmg = null;
    this.grazed = false;
  }

  update(dt) {
    this.x += this.vx * dt;
  }

  isGone(box) {
    const margin = 80;
    return this.x + this.w < box.x - margin || this.x > box.x + box.w + margin;
  }

  edgeDistance(px, py) {
    const dx = Math.max(this.x - px, 0, px - (this.x + this.w));
    const dy = Math.max(this.y - py, 0, py - (this.y + this.h));
    return Math.hypot(dx, dy);
  }

  draw(ctx) {
    const x = Math.round(this.x);
    const y = Math.round(this.y);
    ctx.fillStyle = '#3a2a5e';
    ctx.fillRect(x, y, this.w, this.h);
    ctx.fillStyle = '#7a66a8';
    ctx.fillRect(x + 1, y + 1, this.w - 2, this.h - 2);
    ctx.fillStyle = '#9d8ac8';
    ctx.fillRect(x + 1, y + 1, this.w - 2, 2);
    ctx.fillStyle = '#5a4884';
    for (let line = y + 5; line < y + this.h - 1; line += 4) ctx.fillRect(x + 1, line, this.w - 2, 1);
  }
}
