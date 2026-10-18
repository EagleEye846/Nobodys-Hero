import { defineBulletArt } from '../projectiles.js';

// The Frostbite's attacks. It's a snowdrift that got up and walked, and it
// wants a hug, so everything it does closes in on you: a drift of snow
// sliding across the box with one hole in it, icicles growing from the top
// of the box until they let go, a snowball that gets bigger every time it
// bounces, and a cold that frosts the box over from the edges in.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The icicles and the frost are their own kinds
// of bullet (below), with the same four methods as a Shot.

const SNOW = { k: '#4a6a96', w: '#f4f8fc', W: '#d4e0ee', S: '#aebfd8', i: '#bfe6ff', I: '#7fb6dc' };

// A clump of drift snow.
defineBulletArt('frostClump', {
  frames: [['.www.', 'wwwwW', 'wwWwW', 'WwwWS', '.WSS.']],
  palette: SNOW,
  radius: 2.5,
});

// A little snowball, of the kind a big one leaves behind it.
defineBulletArt('frostPuff', {
  frames: [['.w.', 'wwW', '.S.']],
  palette: SNOW,
  radius: 1.5,
});

// The big snowball, at each size it grows to.
const ball = (size) => {
  const rows = [];
  const r = size / 2;
  for (let y = 0; y < size; y++) {
    let row = '';
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - r;
      const dy = y + 0.5 - r;
      const d = Math.hypot(dx, dy);
      if (d > r) row += '.';
      else if (d > r - 1) row += 'k';
      else if (dx + dy > r * 0.6) row += 'S';
      else if (dx + dy > 0) row += 'W';
      else if (dx < -r * 0.3 && dy < -r * 0.3) row += 'i';
      else row += 'w';
    }
    rows.push(row);
  }
  return rows;
};
const BALL_SIZES = [7, 9, 11, 13];
BALL_SIZES.forEach((size, i) => {
  defineBulletArt(`frostBall${i + 1}`, { frames: [ball(size)], palette: SNOW, radius: size / 2 - 0.5, spin: 3 });
});

// A chip of ice, from an icicle that hit the floor.
defineBulletArt('frostChip', {
  frames: [['.i.', 'iwI', '.I.'], ['.w.', 'Iii', '.i.']],
  palette: SNOW,
  radius: 1.5,
  frameSeconds: 0.08,
});

// A snowflake, turning as it falls.
defineBulletArt('frostFlake', {
  frames: [['i.w.i', '.iwi.', 'wwiww', '.iwi.', 'i.w.i']],
  palette: SNOW,
  radius: 2,
  spin: 2,
});

// An icicle hanging from the top of the box. It grows to its full length,
// shivers, then drops. Its whole length hurts, hanging or falling.
class Icicle {
  constructor({ x, top, length, growFor, dropAt }) {
    this.x = x;
    this.y = top;
    this.full = length;
    this.length = 1;
    this.growFor = growFor;
    this.dropAt = dropAt;
    this.vx = 0;
    this.vy = 0;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.gone = false;
  }

  get tip() {
    return this.y + this.length;
  }

  update(dt) {
    this.age += dt;
    this.length = 1 + (this.full - 1) * Math.min(1, this.age / this.growFor);
    if (this.age < this.dropAt) return;
    this.vy += 280 * dt;
    this.y += this.vy * dt;
  }

  isGone(box) {
    return this.gone || this.y > box.y + box.h + 4;
  }

  edgeDistance(px, py) {
    const along = Math.min(Math.max(py, this.y), this.tip);
    return Math.hypot(px - this.x, py - along) - 1.2;
  }

  draw(ctx) {
    // A shiver just before it lets go.
    const shaking = this.age > this.dropAt - 0.35 && this.age < this.dropAt;
    const x = Math.round(this.x) + (shaking && Math.floor(this.age * 30) % 2 ? 1 : 0);
    const y = Math.round(this.y);
    const length = Math.round(this.length);
    for (let i = 0; i < length; i++) {
      const w = i < length * 0.4 ? 3 : i < length * 0.8 ? 2 : 1;
      ctx.fillStyle = '#7fb6dc';
      ctx.fillRect(x - 1, y + i, w, 1);
      ctx.fillStyle = '#e8f6ff';
      ctx.fillRect(x - 1 + (w > 1 ? 1 : 0), y + i, 1, 1);
    }
    // Where it hangs from: a lip of snow.
    if (this.age < this.dropAt) {
      ctx.fillStyle = '#f4f8fc';
      ctx.fillRect(x - 3, y - 1, 7, 2);
    }
  }
}

// The cold closing in: frost over the edges of the box, leaving a window of
// clear air that shrinks and wanders. Inside the frost hurts; near its edge
// grazes. It warns first (faint and flashing), and lets go at the end.
class Frost {
  constructor(box, { warn = 0.8, life = 6.6, smallest = 13 } = {}) {
    this.box = box;
    this.warn = warn;
    this.life = life;
    this.smallest = smallest;
    this.phase = Math.random() * Math.PI * 2;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.vx = 0;
    this.vy = 0;
    this.window = this.windowAt(0);
  }

  // The clear window at a time: its centre wanders, its half-size shrinks
  // from the whole box down to `smallest`, then opens out again at the end.
  windowAt(t) {
    const { box } = this;
    const closing = Math.min(1, t / 2.2);
    const opening = Math.max(0, (t - (this.life - 0.7)) / 0.7);
    const shut = (1 - (1 - closing) ** 2) * (1 - Math.min(1, opening));
    const half = box.w / 2 - (box.w / 2 - this.smallest) * shut;
    const wander = shut * 1;
    const cx = box.x + box.w / 2 + Math.sin(t * 0.9 + this.phase) * 17 * wander;
    const cy = box.y + box.h / 2 + Math.sin(t * 1.25 + this.phase * 2) * 15 * wander;
    return { x0: cx - half, x1: cx + half, y0: cy - half, y1: cy + half, cx, cy, half };
  }

  update(dt) {
    this.age += dt;
    this.window = this.windowAt(this.age);
  }

  isGone() {
    return this.age > this.life + 0.1;
  }

  edgeDistance(px, py) {
    if (this.age < this.warn || this.age > this.life) return Infinity;
    const { x0, x1, y0, y1 } = this.window;
    if (px < x0 || px > x1 || py < y0 || py > y1) return 0;
    return Math.min(px - x0, x1 - px, py - y0, y1 - py);
  }

  draw(ctx) {
    const { box } = this;
    const { x0, x1, y0, y1 } = this.window;
    const left = Math.round(x0);
    const right = Math.round(x1);
    const top = Math.round(y0);
    const bottom = Math.round(y1);
    ctx.save();
    ctx.globalAlpha = this.age < this.warn ? (Math.floor(this.age * 10) % 2 ? 0.25 : 0.5) : 0.8;
    ctx.fillStyle = '#5a86b8';
    ctx.fillRect(box.x, box.y, box.w, Math.max(0, top - box.y));
    ctx.fillRect(box.x, bottom, box.w, Math.max(0, box.y + box.h - bottom));
    ctx.fillRect(box.x, top, Math.max(0, left - box.x), bottom - top);
    ctx.fillRect(right, top, Math.max(0, box.x + box.w - right), bottom - top);
    // Feathery frost along the edge of the clear window, pointing in.
    ctx.fillStyle = '#d8f0fa';
    for (let x = left; x < right; x += 4) {
      const reach = 1 + ((x * 7) % 3);
      ctx.fillRect(x, top, 1, reach);
      ctx.fillRect(x + 2, bottom - reach, 1, reach);
    }
    for (let y = top; y < bottom; y += 4) {
      const reach = 1 + ((y * 5) % 3);
      ctx.fillRect(left, y + 2, reach, 1);
      ctx.fillRect(right - reach, y, reach, 1);
    }
    ctx.fillStyle = '#f4f8fc';
    ctx.fillRect(left, top, right - left, 1);
    ctx.fillRect(left, bottom - 1, right - left, 1);
    ctx.fillRect(left, top, 1, bottom - top);
    ctx.fillRect(right - 1, top, 1, bottom - top);
    // Frost crystals in the frozen part.
    ctx.fillStyle = '#bfe6ff';
    for (let i = 0; i < 18; i++) {
      const fx = box.x + ((i * 37 + 11) % box.w);
      const fy = box.y + ((i * 53 + 7) % box.h);
      if (fx > left - 2 && fx < right + 2 && fy > top - 2 && fy < bottom + 2) continue;
      ctx.fillRect(fx - 1, fy, 3, 1);
      ctx.fillRect(fx, fy - 1, 1, 3);
    }
    ctx.restore();
  }
}

export const FROSTBITE_ATTACKS = {
  // A drift of snow slides across the box from one side, wall after wall,
  // each with one hole in it, and the whole wall bobs up and down as it
  // comes, taking the hole with it. Each hole is somewhere near the last.
  frostDrift(box, density, { Shot, every, rand, clamp }) {
    const fromLeft = Math.random() < 0.5;
    const gapHalf = 11;
    let gapY = null;
    const wall = every(1.55, 1.85, (bullets, soul) => {
      gapY = gapY === null
        ? clamp(soul.y + rand(-8, 8), box.y + 16, box.y + box.h - 16)
        : clamp(gapY + (Math.random() < 0.5 ? -1 : 1) * rand(10, 22), box.y + 16, box.y + box.h - 16);
      const wobble = { amplitude: 7, frequency: rand(1.8, 2.6) };
      for (let y = box.y + 2; y <= box.y + box.h - 2; y += 6) {
        if (Math.abs(y - gapY) < gapHalf) continue;
        bullets.push(new Shot({
          x: fromLeft ? box.x - 4 : box.x + box.w + 4,
          y,
          vx: fromLeft ? 36 : -36,
          warn: 0.3,
          wobble,
          art: 'frostClump',
        }));
      }
    });
    return { duration: 6.5, update: (dt, bullets, soul) => wall(dt, bullets, soul) };
  },

  // Icicles grow down from the top of the box, a row at a time, each row
  // longer than the last. Once they've grown they shiver and drop, one after
  // another in no particular order, and burst into chips on the floor.
  frostIcicles(box, density, { Shot, every, rand, clamp }) {
    const columns = 8;
    const width = box.w / columns;
    const floor = box.y + box.h - 2;
    let wave = 0;
    let icicles = [];
    const grow = every(2.2, 2.6, (bullets, soul) => {
      // One always grows right over you; the rest wherever there's room.
      const yours = clamp(Math.floor((soul.x - box.x) / width), 0, columns - 1);
      const others = [...Array(columns).keys()].filter((c) => c !== yours).sort(() => Math.random() - 0.5);
      const picked = [yours, ...others.slice(0, 4)];
      const order = [...picked].sort(() => Math.random() - 0.5);
      const longest = 12 + Math.min(wave, 4) * 5;
      for (const column of picked) {
        const icicle = new Icicle({
          x: column === yours ? clamp(soul.x, box.x + 3, box.x + box.w - 3) : box.x + (column + 0.5) * width + rand(-1.5, 1.5),
          top: box.y + 1,
          length: rand(longest - 8, longest),
          growFor: 1.0,
          dropAt: 1.35 + order.indexOf(column) * 0.24,
        });
        bullets.push(icicle);
        icicles.push(icicle);
      }
      wave++;
    }, { first: 0.1 });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        grow(dt, bullets, soul);
        for (const icicle of icicles) {
          if (icicle.tip < floor) continue;
          icicle.gone = true;
          for (const vx of [-35, 0, 35]) {
            bullets.push(new Shot({ x: icicle.x, y: floor - 1, vx: vx + rand(-8, 8), vy: -rand(45, 70), gravity: 220, life: 0.8, art: 'frostChip' }));
          }
        }
        icicles = icicles.filter((icicle) => !icicle.gone);
      },
    };
  },

  // A snowball blinks in a corner and bounces round the box, growing bigger
  // (and a little slower) every time it hits a wall, leaving a trail of
  // little snowballs. At its biggest, the next bounce bursts it into a ring
  // of them, and a new small one starts up in another corner.
  frostSnowball(box, density, { Shot, every, rand, shuffleBag }) {
    const corners = shuffleBag([
      { x: box.x + 6, y: box.y + 6, sx: 1, sy: 1 },
      { x: box.x + box.w - 6, y: box.y + 6, sx: -1, sy: 1 },
      { x: box.x + 6, y: box.y + box.h - 6, sx: 1, sy: -1 },
      { x: box.x + box.w - 6, y: box.y + box.h - 6, sx: -1, sy: -1 },
    ]);
    let balls = [];
    let waiting = [{ t: 0.1 }, { t: 2.6 }];
    // Changes a ball's look (and hit size) to the next size up.
    const grow = (shot, stage) => {
      const look = new Shot({ x: 0, y: 0, art: `frostBall${stage}` });
      shot.art = look.art;
      shot.artName = look.artName;
      shot.r = look.r;
    };
    const start = (bullets) => {
      const corner = corners();
      const angle = rand(0.5, 1.05);
      const speed = 54;
      const shot = new Shot({
        x: corner.x, y: corner.y, vx: Math.cos(angle) * speed * corner.sx, vy: Math.sin(angle) * speed * corner.sy,
        bounce: true, warn: 0.6, art: 'frostBall1',
      });
      bullets.push(shot);
      balls.push({ shot, stage: 1, sx: Math.sign(shot.vx), sy: Math.sign(shot.vy), trail: 0.2 });
    };
    return {
      duration: 7,
      update: (dt, bullets) => {
        for (const wait of waiting) {
          wait.t -= dt;
          if (wait.t <= 0) start(bullets);
        }
        waiting = waiting.filter((wait) => wait.t > 0);
        for (const ball of balls) {
          const { shot } = ball;
          if (shot.age < shot.warn) continue;
          ball.trail -= dt;
          if (ball.trail <= 0) {
            ball.trail += 0.22;
            bullets.push(new Shot({ x: shot.x, y: shot.y, vy: 5, life: 1.3, art: 'frostPuff' }));
          }
          const sx = Math.sign(shot.vx);
          const sy = Math.sign(shot.vy);
          if (sx === ball.sx && sy === ball.sy) continue;
          // It hit a wall.
          ball.sx = sx;
          ball.sy = sy;
          if (ball.stage < BALL_SIZES.length) {
            ball.stage++;
            grow(shot, ball.stage);
            shot.vx *= 0.92;
            shot.vy *= 0.92;
            continue;
          }
          // Too big: it bursts.
          ball.burst = true;
          shot.life = shot.age - shot.warn;
          const tilt = rand(0, Math.PI * 2);
          for (let i = 0; i < 8; i++) {
            const angle = tilt + (i / 8) * Math.PI * 2;
            bullets.push(new Shot({ x: shot.x, y: shot.y, vx: Math.cos(angle) * 42, vy: Math.sin(angle) * 42, life: 1.6, art: 'frostPuff' }));
          }
          waiting.push({ t: 0.5 });
        }
        balls = balls.filter((ball) => !ball.burst);
      },
    };
  },

  // A shiver: the box frosts over from the edges in, leaving a window of
  // clear air in the middle that shrinks and wanders about. Stay in it, and
  // mind the snowflakes drifting down through it.
  frostShiver(box, density, { Shot, every, rand }) {
    let frost = null;
    let thaw = 0;
    const flake = every(0.42, 0.55, (bullets) => {
      const { x0, x1, y0 } = frost.window;
      if (thaw > 0 || frost.age < 1.6 || frost.age > frost.life - 0.8) return;
      bullets.push(new Shot({
        x: rand(x0 + 2, x1 - 2),
        y: y0 - 2,
        vy: rand(18, 24),
        wobble: { amplitude: 2, frequency: 4 },
        life: 2.2,
        warn: 0.25,
        art: 'frostFlake',
      }));
    }, { first: 1.6 });
    return {
      duration: 6.8,
      update: (dt, bullets) => {
        if (!frost) {
          frost = new Frost(box);
          bullets.push(frost);
        }
        // A weapon ability that breaks bullets (a shield, an arrow) thaws the
        // frost for a moment, then it creeps back where it was.
        if (thaw > 0) {
          thaw -= dt;
          frost.update(dt);
          if (thaw <= 0 && !frost.isGone()) bullets.push(frost);
        } else if (!bullets.includes(frost) && !frost.isGone()) {
          thaw = 1;
        }
        flake(dt, bullets);
      },
    };
  },
};
