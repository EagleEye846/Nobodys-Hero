import { defineBulletArt } from '../projectiles.js';

// The Ringer's attacks. It's a living iron climbing ring with strong views on
// who hammered it in, so it fights with what a ring on a rock face knows:
// rings swinging on ropes, the mallet that drove it into the mountain, the
// CLANG of iron on iron, and climbing ropes pulled tight.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The ropes (both kinds) are their own bullets,
// below, with the same four methods as a Shot.

const IRON = { k: '#1c1826', M: '#8a8296', L: '#d0c8e0', O: '#5a5468', r: '#b0683e' };

// An iron climbing ring, a fleck of rust on it.
defineBulletArt('ringIron', {
  frames: [[
    '..kkk..',
    '.kMLMk.',
    'kLk.kMk',
    'kMk.kOk',
    'krk.kOk',
    '.kOOOk.',
    '..kkk..',
  ]],
  palette: IRON,
  radius: 3,
});

// The iron peg a swinging ring's rope is tied to.
defineBulletArt('ringPeg', {
  frames: [['kMk', 'LMO', 'kOk']],
  palette: IRON,
  radius: 1,
});

// A link of chain, flying outward in a CLANG. Drawn pointing right, so it
// turns to lie across the way it flies, like part of a ring.
defineBulletArt('ringLink', {
  frames: [['.L.', 'M.M', 'M.O', 'M.O', '.O.']],
  palette: IRON,
  radius: 1.5,
  rotate: true,
});

// Where a CLANG is about to go off: a ring, blinking.
defineBulletArt('ringMark', {
  frames: [['..LLL..', '.L...L.', 'L.....L', 'L.....L', 'L.....L', '.L...L.', '..LLL..']],
  palette: IRON,
  radius: 3,
});

// The mallet that drove it in, coming down head first.
defineBulletArt('ringMallet', {
  frames: [[
    '....kwk....',
    '....kwk....',
    '....kwk....',
    '....kWk....',
    '....kwk....',
    'kkkkkkkkkkk',
    'kHhhhhhhhHk',
    'kHhhhhhhhHk',
    'kHhhhhhhhHk',
    'kHddddddHHk',
    'kkkkkkkkkkk',
  ]],
  palette: { k: '#1c1826', w: '#c08a4e', W: '#7a4f2a', h: '#8a8296', H: '#5a5468', d: '#d0c8e0' },
  hitbox: { w: 11, h: 11 },
});

// Sparks off iron.
defineBulletArt('ringSpark', {
  frames: [['.y.', 'ywy', '.y.'], ['y.y', '.w.', 'y.y']],
  palette: { y: '#ffb347', w: '#fff6c0' },
  radius: 1.5,
  frameSeconds: 0.06,
});

const ROPE = '#c8a06a';
const ROPE_DARK = '#7a5a3a';

// A swinging ring's rope, from its peg down to the ring. Harmless.
function swingRope(peg, ring) {
  return {
    dmg: null,
    done: false,
    update() {},
    isGone() {
      return this.done;
    },
    edgeDistance() {
      return Infinity;
    },
    draw(ctx) {
      ctx.save();
      ctx.strokeStyle = ROPE;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(peg.x, peg.y);
      ctx.lineTo(ring.x, ring.y - 3);
      ctx.stroke();
      ctx.restore();
    },
  };
}

// A climbing rope strung across the box between two rings. It starts slack,
// sagging and flashing (harmless), pulls itself straight, and then it's taut
// and hurts until it lets go.
class Rope {
  constructor({ ax, ay, bx, by, warn = 0.9, life = 0.7, sag = 10 }) {
    Object.assign(this, { ax, ay, bx, by, warn, life, sag });
    this.x = (ax + bx) / 2;
    this.y = (ay + by) / 2;
    this.vx = 0;
    this.vy = 0;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get taut() {
    return this.age >= this.warn && this.age < this.warn + this.life;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age > this.warn + this.life + 0.25;
  }

  edgeDistance(px, py) {
    if (!this.taut) return Infinity;
    const dx = this.bx - this.ax;
    const dy = this.by - this.ay;
    const t = Math.min(1, Math.max(0, ((px - this.ax) * dx + (py - this.ay) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(px - (this.ax + dx * t), py - (this.ay + dy * t)) - 1.5;
  }

  draw(ctx) {
    ctx.save();
    ctx.lineCap = 'round';
    if (this.age < this.warn) {
      // Slack, and pulling tighter: the sag shrinks to nothing.
      const sag = this.sag * (1 - this.age / this.warn);
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.35 : 0.7;
      ctx.strokeStyle = ROPE;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.ax, this.ay);
      ctx.quadraticCurveTo(this.x, this.y + sag * 2, this.bx, this.by);
      ctx.stroke();
      ctx.restore();
      return;
    }
    const over = this.age - (this.warn + this.life);
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
    ctx.strokeStyle = ROPE;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.ax, this.ay);
    ctx.lineTo(this.bx, this.by);
    ctx.stroke();
    // The twist of the rope.
    ctx.strokeStyle = ROPE_DARK;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.stroke();
    ctx.restore();
  }
}

// Where the line through (x, y) heading (dx, dy) crosses the box: its two
// ends, or null if it misses.
function acrossBox(box, x, y, dx, dy) {
  let t0 = -Infinity;
  let t1 = Infinity;
  for (const [p, d, lo, hi] of [[x, dx, box.x, box.x + box.w], [y, dy, box.y, box.y + box.h]]) {
    if (Math.abs(d) < 1e-6) {
      if (p < lo || p > hi) return null;
      continue;
    }
    const a = (lo - p) / d;
    const b = (hi - p) / d;
    t0 = Math.max(t0, Math.min(a, b));
    t1 = Math.min(t1, Math.max(a, b));
  }
  if (t1 - t0 < 12) return null;
  return { ax: x + dx * t0, ay: y + dy * t0, bx: x + dx * t1, by: y + dy * t1 };
}

export const RINGER_ATTACKS = {
  // Pendulums: three rings swing across the box on ropes from pegs along the
  // top, short, middling and long, each a beat behind the one before. Now
  // and then a rope snaps at the bottom of its swing: the ring flies off the
  // way it was going, and a new one slides down to take its place.
  ringPendulum(box, density, { Shot, every, shuffleBag }) {
    const lengths = [28, 50, 72].sort(() => Math.random() - 0.5);
    const swing = 2.2;
    const reach = 0.85;
    const start = Math.random() * Math.PI * 2;
    const which = shuffleBag([0, 1, 2]);
    let time = 0;
    let pendulums = null;
    const hang = (bullets, p) => {
      p.ring = new Shot({ x: p.peg.x, y: p.peg.y + p.length, warn: 0.6, art: 'ringIron' });
      p.rope = swingRope(p.peg, p.ring);
      bullets.push(p.rope, p.ring);
    };
    const snap = every(1.9, 2.3, () => {
      const p = pendulums[which()];
      if (p.regrow !== undefined || p.ring.age < p.ring.warn) return;
      p.snapping = true;
    }, { first: 1.6 });
    return {
      duration: 7,
      update: (dt, bullets) => {
        time += dt;
        if (!pendulums) {
          pendulums = [0.2, 0.5, 0.8].map((along, i) => ({
            peg: new Shot({ x: box.x + box.w * along, y: box.y + 1, harmless: true, art: 'ringPeg' }),
            length: lengths[i],
            phase: start + i * 0.95,
          }));
          for (const p of pendulums) {
            bullets.push(p.peg);
            hang(bullets, p);
          }
        }
        snap(dt);
        for (const p of pendulums) {
          const angle = Math.sin(time * swing + p.phase) * reach;
          const turning = Math.cos(time * swing + p.phase) * reach * swing;
          if (p.regrow !== undefined) {
            p.regrow -= dt;
            if (p.regrow <= 0) {
              p.regrow = undefined;
              hang(bullets, p);
            }
            continue;
          }
          p.ring.x = p.peg.x + Math.sin(angle) * p.length;
          p.ring.y = p.peg.y + Math.cos(angle) * p.length;
          // Snap at the bottom of the swing, where it's going fastest.
          if (p.snapping && Math.abs(angle) < 0.12) {
            p.snapping = false;
            // (The swing runs on the pattern's clock, which density speeds up.)
            p.ring.vx = Math.cos(angle) * turning * p.length * density;
            p.ring.vy = -Math.sin(angle) * turning * p.length * density;
            p.ring.gravity = 90;
            p.rope.done = true;
            p.regrow = 0.9;
          }
        }
        if (time > 6.6) for (const p of pendulums) p.peg.life = 0;
      },
    };
  },

  // The mallet: a crack flashes up a column of the box where you are, then
  // the mallet that drove the Ringer in comes down on it, head first, and
  // throws sparks along the floor. Sometimes it comes down twice.
  ringHammer(box, density, { Shot, every, rand, clamp, shuffleBag }) {
    const floor = box.y + box.h - 1;
    const warn = 0.7;
    const how = shuffleBag(['one', 'one', 'two']);
    let mallets = [];
    let queued = [];
    const crack = (x) => ({
      x, age: 0, dmg: null, vx: 0, vy: 0,
      update(dt) { this.age += dt; },
      isGone() { return this.age > warn; },
      edgeDistance() { return Infinity; },
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.3 : 0.75;
        ctx.fillStyle = '#d0c8e0';
        // A zigzag crack up from the floor, as high as the mallet will fall.
        let cx = Math.round(this.x);
        for (let y = floor; y > box.y + 4; y -= 3) {
          cx += (Math.floor(y / 3) % 2 ? 1 : -1);
          ctx.fillRect(cx, y - 3, 1, 3);
        }
        ctx.restore();
      },
    });
    const drop = (bullets, x) => {
      bullets.push(crack(x));
      const mallet = new Shot({ x, y: box.y + 6, vy: 30, accel: 520, warn, art: 'ringMallet', angle: 0 });
      bullets.push(mallet);
      mallets.push(mallet);
    };
    const strike = every(1.1, 1.35, (bullets, soul) => {
      const x = clamp(soul.x + rand(-3, 3), box.x + 6, box.x + box.w - 6);
      drop(bullets, x);
      if (how() === 'two') {
        const other = x + (x < box.x + box.w / 2 ? 1 : -1) * rand(22, 30);
        queued.push({ t: 0.4, x: clamp(other, box.x + 6, box.x + box.w - 6) });
      }
    });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        strike(dt, bullets, soul);
        for (const next of queued) {
          next.t -= dt;
          if (next.t <= 0) drop(bullets, next.x);
        }
        queued = queued.filter((next) => next.t > 0);
        for (const mallet of mallets) {
          if (mallet.landed || mallet.y + 5 < floor) continue;
          // CLANG: it stops dead, and sparks fly along the floor.
          mallet.landed = true;
          mallet.y = floor - 5;
          mallet.vx = mallet.vy = mallet.accel = 0;
          mallet.life = mallet.age - mallet.warn + 0.2;
          for (const vx of [-62, -34, 34, 62]) {
            bullets.push(new Shot({ x: mallet.x, y: floor - 2, vx, vy: -rand(15, 35), gravity: 140, life: 0.7, art: 'ringSpark' }));
          }
        }
        mallets = mallets.filter((mallet) => !mallet.landed);
      },
    };
  },

  // CLANG! The Ringer rings like a struck bell, and the sound comes back off
  // the rock where you were a second ago: a ring blinks there, then bursts
  // into a ring of chain links flying outward. Keep moving, and don't double
  // back; slip between the links if you have to.
  ringClang(box, density, { Shot, every, rand }) {
    const delay = 1.0;
    let time = 0;
    let trail = [];
    let marks = [];
    const clang = every(0.8, 0.95, (bullets) => {
      const then = trail.find((spot) => spot.t >= time - delay) ?? trail[0];
      if (!then) return;
      const mark = new Shot({ x: then.x, y: then.y, harmless: true, life: 0.4, art: 'ringMark' });
      bullets.push(mark);
      marks.push({ mark, t: 0.4 });
    }, { first: 1.0 });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        time += dt;
        trail.push({ t: time, x: soul.x, y: soul.y });
        trail = trail.filter((spot) => spot.t >= time - delay - 0.2);
        clang(dt, bullets);
        for (const m of marks) {
          m.t -= dt;
          if (m.t > 0) continue;
          const tilt = rand(0, Math.PI * 2);
          for (let i = 0; i < 12; i++) {
            const angle = tilt + (i / 12) * Math.PI * 2;
            bullets.push(new Shot({ x: m.mark.x, y: m.mark.y, vx: Math.cos(angle) * 44, vy: Math.sin(angle) * 44, life: 1.3, art: 'ringLink' }));
          }
        }
        marks = marks.filter((m) => m.t > 0);
      },
    };
  },

  // Rope burn: climbing ropes are strung across the box on a slant, side by
  // side. They sag at first, flashing, then pull themselves tight, and a taut
  // rope burns. Find a gap between them before they go taut. The next set
  // slants the other way.
  ringRope(box, density, { Shot, every, rand }) {
    let slant = Math.random() < 0.5 ? 1 : -1;
    const spacing = 19;
    const rig = every(1.35, 1.55, (bullets) => {
      const angle = slant * rand(0.5, 0.9);
      slant = -slant;
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      const cx = box.x + box.w / 2;
      const cy = box.y + box.h / 2;
      const shift = rand(0, spacing);
      for (let offset = -70 + shift; offset < 70; offset += spacing) {
        const ends = acrossBox(box, cx - dy * offset, cy + dx * offset, dx, dy);
        if (!ends) continue;
        bullets.push(new Rope(ends));
        for (const [x, y] of [[ends.ax, ends.ay], [ends.bx, ends.by]]) {
          bullets.push(new Shot({ x, y, harmless: true, life: 1.6, art: 'ringIron' }));
        }
      }
    }, { first: 0.1 });
    return { duration: 6.5, update: (dt, bullets) => rig(dt, bullets) };
  },
};
