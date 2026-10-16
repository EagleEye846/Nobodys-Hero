// Enemy bullets and the attack patterns that spawn them. A pattern is an object
// with a duration (seconds) and update(dt, t, bullets, soul) that spawns bullets.

export class Bullet {
  constructor({ x, y, vx = 0, vy = 0, r = 3, dmg = null, bounce = false, color = '#fff' }) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = r;
    this.dmg = dmg; // null means the enemy's default bullet damage
    this.bounce = bounce;
    this.color = color;
    this.grazed = false;
  }

  update(dt, box) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (!this.bounce) return;
    if (this.x < box.x + this.r) { this.x = box.x + this.r; this.vx = -this.vx; }
    if (this.x > box.x + box.w - this.r) { this.x = box.x + box.w - this.r; this.vx = -this.vx; }
    if (this.y < box.y + this.r) { this.y = box.y + this.r; this.vy = -this.vy; }
    if (this.y > box.y + box.h - this.r) { this.y = box.y + box.h - this.r; this.vy = -this.vy; }
  }

  isGone(box) {
    if (this.bounce) return false;
    const margin = 24;
    return this.x < box.x - margin || this.x > box.x + box.w + margin
      || this.y < box.y - margin || this.y > box.y + box.h + margin;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function createPattern(name, box) {
  const make = PATTERNS[name];
  if (!make) throw new Error(`Unknown bullet pattern '${name}'`);
  return make(box);
}

// Runs an action on a fixed interval, independent of frame rate.
function every(interval, action) {
  let timer = interval;
  return (...args) => {
    timer -= args[0];
    while (timer <= 0) {
      timer += interval;
      action(...args.slice(1));
    }
  };
}

const PATTERNS = {
  // Cotton falls from above with a little sideways drift.
  rain(box) {
    const spawn = every(0.2, (bullets) => {
      bullets.push(new Bullet({
        x: box.x + 8 + Math.random() * (box.w - 16),
        y: box.y + 3,
        vx: (Math.random() - 0.5) * 30,
        vy: 60 + Math.random() * 50,
      }));
    });
    return { duration: 6, update: (dt, t, bullets) => spawn(dt, bullets) };
  },

  // Three-shot spreads fired at the soul from alternating top corners.
  aimed(box) {
    let corner = 0;
    const spawn = every(0.8, (bullets, soul) => {
      const x = corner % 2 ? box.x + 8 : box.x + box.w - 8;
      const y = box.y + 8;
      corner++;
      const aim = Math.atan2(soul.y - y, soul.x - x);
      for (const offset of [-0.28, 0, 0.28]) {
        bullets.push(new Bullet({ x, y, vx: Math.cos(aim + offset) * 85, vy: Math.sin(aim + offset) * 85 }));
      }
    });
    return { duration: 6, update: (dt, t, bullets, soul) => spawn(dt, bullets, soul) };
  },

  // Two spiral arms wind out from the top of the box, Touhou style.
  spiral(box) {
    let angle = 0;
    const cx = box.x + box.w / 2;
    const cy = box.y + 12;
    const spawn = every(0.09, (bullets) => {
      for (const arm of [0, Math.PI]) {
        bullets.push(new Bullet({
          x: cx,
          y: cy,
          vx: Math.cos(angle + arm) * 52,
          vy: Math.sin(angle + arm) * 52,
          r: 2.5,
        }));
      }
      angle += 0.4;
    });
    return { duration: 7, update: (dt, t, bullets) => spawn(dt, bullets) };
  },

  // A few big, slow bullets that bounce off the walls for the whole turn.
  bounce(box) {
    let spawned = 0;
    const spawn = every(0.9, (bullets) => {
      if (spawned >= 5) return;
      spawned++;
      const angle = Math.PI * (0.25 + Math.random() * 0.5);
      bullets.push(new Bullet({
        x: box.x + 10 + Math.random() * (box.w - 20),
        y: box.y + 10,
        vx: Math.cos(angle) * 65,
        vy: Math.sin(angle) * 65,
        r: 5,
        dmg: 12,
        bounce: true,
      }));
    });
    return { duration: 7, update: (dt, t, bullets) => spawn(dt, bullets) };
  },
};
