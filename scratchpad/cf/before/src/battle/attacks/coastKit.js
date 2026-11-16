import { Shot, Line } from '../projectiles.js';

// Shared bits for the chapter 5 coast monsters' attacks (bellbuoy, wrackeel,
// powder monkey and the rest). Nothing here is an attack: just the odd
// things those attacks put in the box, written so they sit in the bullet list
// like a Shot does (update, isGone, edgeDistance, draw).
//
// Everything here moves by its own clock, from numbers fixed when it was
// made, so a player who has learned the monster's rule can read where it is
// going from how it looks now.

// How close the soul's centre can get to the box walls (SOUL_INSET in soulModes.js).
const INSET = 5;

export const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

// Moves the soul by (dx, dy), kept inside the box: a shove, a pull, a current.
export function shove(soul, box, dx, dy) {
  soul.x = Math.min(Math.max(soul.x + dx, box.x + INSET), box.x + box.w - INSET);
  soul.y = Math.min(Math.max(soul.y + dy, box.y + INSET), box.y + box.h - INSET);
}

// The soul's place in the box as lanes: which of `n` columns or rows it is in.
export const laneOf = (v, start, size, n) => Math.min(n - 1, Math.max(0, Math.floor(((v - start) / size) * n)));

// A Shot that goes where `path(k)` says, `k` being the seconds since its
// warning ended (0 while it warns). `path` returns { x, y } and, if it likes,
// `a` (the way the art faces). The path must only use numbers fixed when it
// was made, never the soul, so the shot can be read (and foreseen) exactly.
export class PathShot extends Shot {
  constructor({ path, ...rest }) {
    const p = path(0);
    super({ x: p.x, y: p.y, ...rest });
    this.path = path;
    if (p.a !== undefined) this.angle = p.a;
  }

  update(dt) {
    this.age += dt;
    const p = this.path(Math.max(0, this.age - this.warn));
    this.x = p.x;
    this.y = p.y;
    if (p.a !== undefined) this.angle = p.a;
  }

  isGone(box) {
    if (this.life !== Infinity) return this.age >= this.warn + this.life + 0.25;
    return super.isGone(box);
  }
}

// A Shot that only hurts while `on(k)` is true (k: seconds since its warning
// ended), and is drawn faint while it isn't: a bell that only stings on the
// beat, a lamp that only burns while lit.
export class GatedShot extends Shot {
  constructor({ on, offAlpha = 0.35, ...rest }) {
    super(rest);
    this.on = on;
    this.offAlpha = offAlpha;
  }

  get active() {
    return super.active && this.on(this.age - this.warn);
  }

  draw(ctx) {
    if (this.age >= this.warn && !this.on(this.age - this.warn)) {
      ctx.save();
      ctx.globalAlpha = this.offAlpha;
      super.draw(ctx);
      ctx.restore();
      return;
    }
    super.draw(ctx);
  }
}

// A patch of the box that hurts: a circle (`r`) or a rectangle (`w`, `h`,
// from its top-left corner). It warns first (drawn faint and blinking), then
// hurts for `life` seconds, or only while `on(k)` holds if it has one. It can
// drift (`vx`, `vy`). `paint(ctx, zone, hot)` draws it; `hot` is whether it
// hurts this moment.
export class Zone {
  constructor({ x, y, r = null, w = 0, h = 0, warn = 0.6, life = 1, vx = 0, vy = 0, on = null, paint, dmg = null }) {
    Object.assign(this, { x, y, r, w, h, warn, life, vx, vy, on, paint, dmg });
    this.age = 0;
    this.grazed = false;
  }

  get k() {
    return this.age - this.warn;
  }

  get active() {
    if (this.age < this.warn || this.age >= this.warn + this.life) return false;
    return this.on ? this.on(this.k) : true;
  }

  update(dt) {
    this.age += dt;
    if (this.age < this.warn) return;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  isGone() {
    return this.age >= this.warn + this.life + 0.25;
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    if (this.r !== null) return Math.hypot(px - this.x, py - this.y) - this.r;
    const dx = Math.max(this.x - px, 0, px - (this.x + this.w));
    const dy = Math.max(this.y - py, 0, py - (this.y + this.h));
    return Math.hypot(dx, dy);
  }

  draw(ctx) {
    ctx.save();
    if (this.age < this.warn) ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.2 : 0.5;
    else if (this.age > this.warn + this.life) ctx.globalAlpha = Math.max(0, 1 - (this.age - this.warn - this.life) / 0.25);
    this.paint(ctx, this, this.active);
    ctx.restore();
  }
}

// A harmless picture that sits in the box (a dancing bee, a gun port, a
// rod): it is drawn but never hurts. `paint(ctx, deco)`; `life` seconds.
export class Deco {
  constructor({ x = 0, y = 0, life = 3, paint, under = false, ...rest }) {
    Object.assign(this, { x, y, life, paint, under }, rest);
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.life;
  }

  edgeDistance() {
    return Infinity;
  }

  draw(ctx) {
    ctx.save();
    const left = this.life - this.age;
    if (left < 0.25) ctx.globalAlpha = Math.max(0, left / 0.25);
    this.paint(ctx, this);
    ctx.restore();
  }
}

// A rope, a chain, a fuse, a hose: a line between two points that can move.
// Both ends come from `ends(k)` -> [x0, y0, x1, y1] (k as in PathShot). It
// hurts only while `on(k)` (default: always, once warned).
export class Tether {
  constructor({ ends, warn = 0.6, life = 2, thick = 2, color = '#d8c8a0', dark = '#2a2018', dash = null, on = null, dmg = null }) {
    Object.assign(this, { ends, warn, life, thick, color, dark, dash, on, dmg });
    this.age = 0;
    this.grazed = false;
  }

  get active() {
    const k = this.age - this.warn;
    if (k < 0 || k >= this.life) return false;
    return this.on ? this.on(k) : true;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.warn + this.life + 0.25;
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const [x0, y0, x1, y1] = this.ends(this.age - this.warn);
    const dx = x1 - x0;
    const dy = y1 - y0;
    const l2 = dx * dx + dy * dy || 1;
    const u = Math.min(1, Math.max(0, ((px - x0) * dx + (py - y0) * dy) / l2));
    return Math.hypot(px - (x0 + dx * u), py - (y0 + dy * u)) - this.thick / 2;
  }

  draw(ctx) {
    const k = Math.max(0, this.age - this.warn);
    const [x0, y0, x1, y1] = this.ends(k);
    ctx.save();
    ctx.lineCap = 'round';
    if (this.age < this.warn) {
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.25 : 0.6;
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.restore();
      return;
    }
    const over = this.age - this.warn - this.life;
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
    else if (this.on && !this.on(k)) ctx.globalAlpha = 0.35;
    if (this.dash) ctx.setLineDash(this.dash);
    ctx.strokeStyle = this.dark;
    ctx.lineWidth = this.thick + 2;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.thick;
    ctx.stroke();
    ctx.restore();
  }
}

// A little pixel picture drawn straight onto the canvas from rows of
// characters and a palette (for Zones and Decos, which aren't Shots).
export function blit(ctx, rows, palette, x, y, alpha = 1) {
  ctx.save();
  ctx.globalAlpha *= alpha;
  const ox = Math.round(x - rows[0].length / 2);
  const oy = Math.round(y - rows.length / 2);
  rows.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const c = row[i];
      if (c === '.' || !palette[c]) continue;
      ctx.fillStyle = palette[c];
      ctx.fillRect(ox + i, oy + j, 1, 1);
    }
  });
  ctx.restore();
}

// A healing thing (a lucky clover, a dropped sweet): touching it gives `heals`
// HP back instead of hurting (see catchHeal in battleScene.js).
export function healer(opts, heals) {
  const s = new Shot({ harmless: false, ...opts });
  s.heals = heals;
  return s;
}

// A line that only ever warns: the dotted path a dive or a dart will take,
// shown for `warn` seconds and then gone. It never hurts.
export class Guide extends Line {
  constructor(opts) {
    super({ thickness: 1, ...opts, life: 0 });
  }

  get active() {
    return false;
  }

  isGone() {
    return this.age >= this.warn;
  }
}
