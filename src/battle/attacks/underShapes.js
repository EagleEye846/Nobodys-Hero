// Shared bits for the Chapter 4 monsters of the Diggings, the Stillwater and
// the Deep (slagling, blindfish, olm, murk, gnawer). Nothing here is an
// attack: just the odd shapes those attacks fling about, written so they can
// sit in the box's bullet list like a Shot does (each has update, isGone,
// edgeDistance and draw; see src/battle/projectiles.js).

const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

// Whether you've been standing (nearly) still, and for how long. Call it
// every frame with dt and the soul; it hands back the seconds so far.
export function stillness(slack = 18) {
  let last = null;
  let still = 0;
  return (dt, soul) => {
    if (last) {
      const moved = Math.hypot(soul.x - last.x, soul.y - last.y);
      still = moved < slack * dt ? still + dt : 0;
    }
    last = { x: soul.x, y: soul.y };
    return still;
  };
}

// A ring that spreads out from a point: a ripple, a scream, a pulse of
// light. Hurts along its edge. `gap` ({ angle, width }) leaves a stretch of
// it open to slip through; `squash` flattens it (a ripple on water).
export class Ring {
  constructor({ x, y, r = 2, grow = 30, thick = 2.5, life = 3, warn = 0, gap = null, color = '#ffffff', glow = null, squash = 1, dash = null, alpha = 1 }) {
    Object.assign(this, { x, y, r, grow, thick, life, warn, gap, color, glow, squash, dash, alpha });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get active() {
    return this.age >= this.warn && this.age < this.warn + this.life;
  }

  update(dt) {
    this.age += dt;
    if (this.age >= this.warn) this.r += this.grow * dt;
  }

  isGone() {
    return this.age >= this.warn + this.life + 0.25;
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const dx = px - this.x;
    const dy = (py - this.y) / this.squash;
    if (this.gap && Math.abs(wrap(Math.atan2(dy, dx) - this.gap.angle)) < this.gap.width / 2) return Infinity;
    return Math.abs(Math.hypot(dx, dy) - this.r) - this.thick / 2;
  }

  draw(ctx) {
    ctx.save();
    const over = this.age - (this.warn + this.life);
    let alpha = this.alpha;
    if (over > 0) alpha *= Math.max(0, 1 - over / 0.25);
    ctx.strokeStyle = this.color;
    ctx.lineCap = 'butt';
    if (this.age < this.warn) {
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.2 : 0.5;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, Math.max(this.r, 3), Math.max(this.r, 3) * this.squash, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      return;
    }
    ctx.globalAlpha = alpha;
    if (this.glow) {
      ctx.shadowColor = this.glow;
      ctx.shadowBlur = 5;
    }
    if (this.dash) ctx.setLineDash(this.dash);
    ctx.lineWidth = this.thick;
    ctx.beginPath();
    if (this.gap) {
      const half = this.gap.width / 2;
      ctx.ellipse(this.x, this.y, this.r, this.r * this.squash, 0, this.gap.angle + half, this.gap.angle - half + Math.PI * 2);
    } else {
      ctx.ellipse(this.x, this.y, this.r, this.r * this.squash, 0, 0, Math.PI * 2);
    }
    ctx.stroke();
    ctx.restore();
  }
}

// A flat slab (a wall of ooze, a drifting sheet): hurts all over. `paint`
// draws it, given the context and the slab.
export class Slab {
  constructor({ x, y, w, h, vx = 0, vy = 0, warn = 0, life = Infinity, paint }) {
    Object.assign(this, { x, y, w, h, vx, vy, warn, life, paint });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get active() {
    return this.age >= this.warn && this.age < this.warn + this.life;
  }

  update(dt) {
    this.age += dt;
    if (this.age < this.warn) return;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  isGone(box) {
    if (this.age >= this.warn + this.life + 0.25) return true;
    return this.age >= this.warn && (this.x > box.x + box.w + 60 || this.x + this.w < box.x - 60 || this.y > box.y + box.h + 60 || this.y + this.h < box.y - 60);
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const dx = Math.max(this.x - px, 0, px - (this.x + this.w));
    const dy = Math.max(this.y - py, 0, py - (this.y + this.h));
    return Math.hypot(dx, dy);
  }

  draw(ctx) {
    ctx.save();
    if (this.age < this.warn) ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.15 : 0.4;
    else if (this.age > this.warn + this.life) ctx.globalAlpha = Math.max(0, 1 - (this.age - this.warn - this.life) / 0.25);
    this.paint(ctx, this);
    ctx.restore();
  }
}

// A soft pool of light (or of anything) that follows a point, drawn under
// everything else. Never hurts.
export class Glow {
  constructor(at, { color = '255, 240, 200', alpha = 0.35 } = {}) {
    this.at = at;
    this.color = color;
    this.alpha = alpha;
    this.dmg = null;
    this.grazed = false;
    this.age = 0;
    this.off = false;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.off;
  }

  edgeDistance() {
    return Infinity;
  }

  draw(ctx) {
    const { x, y, r } = this.at;
    if (r <= 0) return;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(${this.color}, ${this.alpha})`);
    grad.addColorStop(1, `rgba(${this.color}, 0)`);
    ctx.save();
    ctx.fillStyle = grad;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    ctx.restore();
  }
}

// A Shot that can only be seen near `light` ({ x, y, r }: the lit patch round
// your soul): out in the dark it fades to almost nothing, though it hurts
// just the same. Hand it the Shot class from the attack's tools.
export function dimmed(Shot, light, floor = 0.1) {
  return class DimShot extends Shot {
    draw(ctx) {
      const art = this.art;
      const frame = art.frames[Math.floor(this.age / art.frameSeconds) % art.frames.length];
      const gap = Math.hypot(this.x - light.x, this.y - light.y);
      let alpha = Math.min(1, Math.max(floor, 1 - (gap - light.r * 0.65) / (light.r * 0.5 + 1)));
      if (this.age < this.warn) alpha *= Math.floor(this.age * 10) % 2 ? 0.45 : 1;
      const over = this.age - (this.warn + this.life);
      if (over > 0) alpha *= Math.max(0, 1 - over / 0.25);
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
  };
}
