import { defineBulletArt } from '../projectiles.js';
import { withSnipes } from './snipes.js';

// The Lum's attacks. The last standing chimney of a burnt farmhouse, its fire
// never out. Everything it has is the house: loose bricks falling off the
// stack (each hangs over you, blinking, then drops and breaks in two along the
// floor), smoke rings blown across the box (the only safe place is the hole in
// the middle, and the hole is never quite where you are), sparks going up the
// flue in columns out of the floor (a glow shows where), and coals shovelled
// in high arcs that lie on the floor glowing and then pop. Once its hearth has
// caught (its second phase) it adds the blaze (fire across half the floor of
// the box, flickering first) and its own chimney pot, jumping off and banging
// round the box puffing smoke. It stands to the right of the box.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`.
// `update` is given dt times `density`; a bullet's own clock is real time, so
// anything that waits on a warning goes by the bullet's own age. Anything
// that flies a set path (an arc onto a marked spot) is given its speed a frame
// after it's made, so the battle's speed setting doesn't bend it.

const LUM = {
  k: '#120c0c', b: '#7a3a2a', B: '#9a5038', n: '#5a2a20', m: '#3a2420', c: '#24201f', C: '#3e3633',
  s: '#6e6a66', S: '#8e8a84', p: '#b0683a', P: '#d08a54', o: '#7a4424',
  e: '#ff8c1a', E: '#ffd25e', y: '#fff4c8', r: '#a8401a', R: '#3a120a', g: '#8d8781', G: '#b4aea6',
};

// A brick, with a little mortar still on it.
defineBulletArt('lumBrick', {
  frames: [['mBBBBBBm', 'bBbbbbbn', 'bbbnbbbn', 'mnnnnnnm']],
  palette: LUM,
  hitbox: { w: 8, h: 4 },
});

// Half a brick, skidding.
defineBulletArt('lumHalf', {
  frames: [['BBBm', 'bbbn', 'nnnm']],
  palette: LUM,
  hitbox: { w: 4, h: 3 },
});

// A spark going up the flue.
defineBulletArt('lumSpark', {
  frames: [['.E.', 'EyE', '.e.', '.r.'], ['.e.', 'EyE', '.E.', '...']],
  palette: LUM,
  radius: 1.6,
  frameSeconds: 0.06,
});

// The glow on the floor where sparks are coming (harmless).
defineBulletArt('lumGlow', {
  frames: [['.r.r.r.', 'rerErer', '.r.r.r.'], ['..r.r..', '.rEyEr.', '..r.r..']],
  palette: LUM,
  radius: 1,
  frameSeconds: 0.1,
  rim: false,
});

// A coal, glowing.
defineBulletArt('lumCoal', {
  frames: [['.CcC.', 'CrerC', 'ceEec', '.CrC.'], ['.CcC.', 'CeEeC', 'crerc', '.CrC.']],
  palette: LUM,
  radius: 2.4,
  frameSeconds: 0.2,
});

// Where a coal will land (harmless).
defineBulletArt('lumMark', {
  frames: [['r...r', '..e..', 'r...r'], ['.r.r.', 'r.e.r', '.r.r.']],
  palette: LUM,
  radius: 1,
  frameSeconds: 0.12,
  rim: false,
});

// The chimney pot, tumbling.
defineBulletArt('lumPot', {
  frames: [[
    'PPPPPPPPP',
    'RRRRRRRRo',
    '.pPpppoo.',
    '.pPpppoo.',
    '.pPpppoo.',
    '.pppppoo.',
    'PPPPPPPPo',
  ]],
  palette: LUM,
  radius: 4.2,
  spin: 4,
});

// A puff of soot (it stings).
defineBulletArt('lumPuff', {
  frames: [['.cCc.', 'cCgCc', 'CgGgC', '.cCc.'], ['..c..', '.cCc.', 'cCgCc', '.cCc.']],
  palette: LUM,
  radius: 2.4,
  frameSeconds: 0.18,
});

function tracker() {
  const heading = { x: 0, y: 0 };
  let seen = null;
  return {
    heading,
    see(soul, dt) {
      if (seen && dt > 0) {
        heading.x = heading.x * 0.85 + ((soul.x - seen.x) / dt) * 0.15;
        heading.y = heading.y * 0.85 + ((soul.y - seen.y) / dt) * 0.15;
      }
      seen = { x: soul.x, y: soul.y };
    },
  };
}

// A smoke ring blown across the box: a ring of soot puffs that grows as it
// drifts left. It hurts along the ring itself; the hole in the middle is safe.
// It blinks at the right edge for `warn` seconds first.
class SmokeRing {
  constructor({ x, y, vx, r0, grow, warn = 0.6, life = 2.4, puffs = 14 }) {
    Object.assign(this, { x, y, vx, r0, grow, warn, life, puffs });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.spin = Math.random() * 6;
  }

  get r() {
    return this.r0 + this.grow * Math.max(0, this.age - this.warn);
  }

  get active() {
    return this.age >= this.warn && this.age < this.warn + this.life;
  }

  update(dt) {
    this.age += dt;
    if (this.age >= this.warn) this.x += this.vx * dt;
  }

  isGone() {
    return this.age >= this.warn + this.life + 0.25;
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    return Math.abs(Math.hypot(px - this.x, py - this.y) - this.r) - 2.6;
  }

  draw(ctx) {
    let alpha = 1;
    if (this.age < this.warn) alpha = Math.floor(this.age * 10) % 2 ? 0.25 : 0.6;
    const over = this.age - (this.warn + this.life);
    if (over > 0) alpha = Math.max(0, 1 - over / 0.25);
    ctx.save();
    ctx.globalAlpha = alpha;
    const r = this.r;
    const n = Math.max(this.puffs, Math.round(r * 0.9));
    for (let i = 0; i < n; i++) {
      const a = this.spin + (i / n) * Math.PI * 2 + this.age * 0.8;
      const x = Math.round(this.x + Math.cos(a) * r);
      const y = Math.round(this.y + Math.sin(a) * r);
      ctx.fillStyle = '#120c0c';
      ctx.fillRect(x - 3, y - 2, 6, 5);
      ctx.fillRect(x - 2, y - 3, 4, 7);
      ctx.fillStyle = i % 3 ? '#3e3633' : '#5e5856';
      ctx.fillRect(x - 2, y - 2, 4, 4);
      ctx.fillStyle = '#8d8781';
      ctx.fillRect(x - 1, y - 2, 2, 1);
    }
    ctx.restore();
  }
}

// The blaze: fire across part of the floor of the box. It flickers (a thin
// outline and a few flames) for `warn` seconds, then burns for `life`.
class Blaze {
  constructor({ box, x0, x1, height, warn = 0.85, life = 1.7 }) {
    Object.assign(this, { box, x0, x1, height, warn, life });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get top() {
    const t = this.age - this.warn;
    const rise = t < 0 ? 0 : Math.min(1, t / 0.2);
    const fall = Math.max(0, Math.min(1, (this.age - this.warn - this.life) / 0.25));
    return this.box.y + this.box.h - this.height * rise * (1 - fall);
  }

  get active() {
    return this.age >= this.warn + 0.1 && this.age < this.warn + this.life;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.warn + this.life + 0.3;
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const dx = Math.max(this.x0 - px, 0, px - this.x1);
    const dy = Math.max(this.top + 3 - py, 0);
    return Math.hypot(dx, dy);
  }

  draw(ctx) {
    const floor = this.box.y + this.box.h;
    ctx.save();
    if (this.age < this.warn) {
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.3 : 0.7;
      ctx.fillStyle = '#ff8c1a';
      const y = floor - this.height;
      for (let x = this.x0; x < this.x1; x += 4) ctx.fillRect(Math.round(x), Math.round(y), 2, 1);
      for (let x = this.x0 + 2; x < this.x1; x += 7) ctx.fillRect(Math.round(x), floor - 3 - ((x * 3) % 4), 1, 3);
      ctx.restore();
      return;
    }
    const top = this.top;
    const h = floor - top;
    if (h > 0.5) {
      for (let x = this.x0; x < this.x1; x += 2) {
        const lick = Math.sin(x * 0.7 + this.age * 14) * 3 + Math.sin(x * 0.31 - this.age * 9) * 2;
        const col = Math.max(0, h + lick);
        ctx.fillStyle = '#a8401a';
        ctx.fillRect(Math.round(x), Math.round(floor - col), 2, Math.round(col));
        ctx.fillStyle = '#ff8c1a';
        ctx.fillRect(Math.round(x), Math.round(floor - col * 0.75), 2, Math.round(col * 0.75));
        ctx.fillStyle = '#ffd25e';
        ctx.fillRect(Math.round(x), Math.round(floor - col * 0.4), 2, Math.round(col * 0.4));
      }
    }
    ctx.restore();
  }
}

export const THE_LUM_ATTACKS = {
  // Bricks: rows of three loose bricks, one over you and one a hand either
  // side; each hangs at the top blinking (following you a moment), drops, and
  // breaks in two on the floor, the halves skidding off both ways.
  lumBricks(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let rows = 0;
    const track = tracker();
    const falling = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        track.see(soul, dt);
        if (rows < 5 && t >= 0.2 + rows * 1.1) {
          const gap = rand(22, 30);
          const set = [];
          for (const off of [0, -gap, gap]) {
            const brick = new Shot({ x: soul.x + off, y: box.y + 5, warn: 0.7, art: 'lumBrick', life: 2 });
            set.push({ brick, off });
            bullets.push(brick);
          }
          falling.push({ set, lead: rows % 2 ? 0.4 : 0 });
          rows++;
        }
        for (const f of falling) {
          for (const { brick, off } of f.set) {
            if (brick.age < brick.warn - 0.3) brick.x = clamp(soul.x + track.heading.x * f.lead + off, box.x + 4, box.x + box.w - 4);
            else if (!brick.dropped && brick.age >= brick.warn - 0.02) { brick.dropped = true; brick.vy = 175; }
            if (brick.dropped && !brick.landed && brick.y >= box.y + box.h - 3) {
              brick.landed = true;
              brick.life = brick.age - brick.warn;
              brick.vy = 0;
              for (const side of [-1, 1]) bullets.push(new Shot({ x: brick.x + side * 2, y: box.y + box.h - 3, vx: side * 62, art: 'lumHalf', life: 1.6 }));
            }
          }
        }
      },
    };
  },

  // Rings: it blows smoke rings across the box. Each grows as it comes; the
  // hole in the middle is the only safe place on its line, and the hole is
  // aimed a little off where you are.
  lumRings(box, density, { rand, clamp }) {
    let t = 0;
    let rings = 0;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (rings < 4 && t >= 0.2 + rings * 1.3) {
          const off = rand(14, 22) * (Math.random() < 0.5 ? -1 : 1);
          const y = clamp(soul.y + off, box.y + 14, box.y + box.h - 14);
          bullets.push(new SmokeRing({ x: box.x + box.w + 4, y, vx: -46, r0: 9, grow: 6, warn: 0.6, life: 2.8 }));
          rings++;
        }
      },
    };
  },

  // Flue: sparks shoot straight up out of the floor in columns, near you; a
  // glow on the floor shows each column first.
  lumSparks(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let vents = 0;
    const track = tracker();
    const live = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        track.see(soul, dt);
        if (vents < 7 && t >= 0.2 + vents * 0.72) {
          const lead = vents % 2 ? 0.55 : 0.1;
          const x = clamp(soul.x + track.heading.x * lead + rand(-3, 3), box.x + 5, box.x + box.w - 5);
          const glow = new Shot({ x, y: box.y + box.h - 3, harmless: true, art: 'lumGlow', life: 1.25 });
          live.push({ glow, x, next: 0 });
          bullets.push(glow);
          vents++;
        }
        for (const v of live) {
          const age = v.glow.age;
          if (age < 0.62 || age > 1.2) continue;
          v.next -= dt;
          if (v.next > 0) continue;
          v.next = 0.07;
          bullets.push(new Shot({ x: v.x + rand(-1.5, 1.5), y: box.y + box.h - 2, vx: rand(-4, 4), vy: -rand(120, 150), art: 'lumSpark', life: 1.2 }));
        }
      },
    };
  },

  // Coals: it shovels coals out of the hearth in high arcs; each lands on the
  // floor on a marked spot (near where you are), lies there glowing, and then
  // pops into three sparks.
  lumCoals(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let coals = 0;
    const track = tracker();
    const pending = [];
    const live = [];
    const GRAV = 220;
    const FLIGHT = 0.8;
    return {
      duration: 7.0,
      update: (dt, bullets, soul) => {
        t += dt;
        track.see(soul, dt);
        for (const p of pending.splice(0)) { p.shot.vx = p.vx; p.shot.vy = p.vy; }
        if (coals < 8 && t >= 0.2 + coals * 0.62) {
          const lead = coals % 3 === 1 ? 0.6 : 0.15;
          const tx = clamp(soul.x + track.heading.x * lead + rand(-5, 5), box.x + 5, box.x + box.w - 5);
          // It lands at your height or on the floor, turn about.
          const ty = coals % 2 ? box.y + box.h - 3 : clamp(soul.y + track.heading.y * lead, box.y + 8, box.y + box.h - 3);
          const warn = 0.55;
          bullets.push(new Shot({ x: tx, y: ty, harmless: true, art: 'lumMark', life: warn + FLIGHT }));
          const x0 = box.x + box.w + 8;
          const y0 = box.y + 10;
          const coal = new Shot({ x: x0, y: y0, warn, art: 'lumCoal', life: FLIGHT, gravity: GRAV });
          pending.push({ shot: coal, vx: (tx - x0) / FLIGHT, vy: (ty - y0 - 0.5 * GRAV * FLIGHT * FLIGHT) / FLIGHT });
          live.push({ coal, tx, ty });
          bullets.push(coal);
          coals++;
        }
        for (const c of live) {
          if (!c.landed && c.coal.age >= c.coal.warn + FLIGHT) {
            c.landed = true;
            c.rest = new Shot({ x: c.tx, y: c.ty, art: 'lumCoal', life: 0.9 });
            bullets.push(c.rest);
          }
          if (c.rest && !c.popped && c.rest.age >= 0.9) {
            c.popped = true;
            for (const a of [-Math.PI / 2, -Math.PI / 2 - 0.9, -Math.PI / 2 + 0.9]) {
              bullets.push(new Shot({ x: c.tx, y: c.ty, vx: Math.cos(a) * 60, vy: Math.sin(a) * 60, gravity: 40, art: 'lumSpark', life: 1.4 }));
            }
          }
        }
      },
    };
  },

  // Blaze (once its hearth has caught): fire runs across the floor of the box,
  // over one half and then the other, rising high; it flickers first. Sparks
  // come down from above meanwhile, the odd one over you.
  lumBlaze(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let fires = 0;
    let next = 0.3;
    let count = 0;
    let real = 0;
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        real += dt / density;
        if (fires < 3 && real >= 0.15 + fires * 2.05) {
          const side = soul.x < box.x + box.w / 2 ? 0 : 1;
          const half = box.w * 0.55;
          const x0 = side === 0 ? box.x - 2 : box.x + box.w - half;
          bullets.push(new Blaze({ box, x0, x1: x0 + half + 2, height: box.h * 0.62, warn: 0.85, life: 1.6 }));
          fires++;
        }
        if (t < next || t > 6.2) return;
        next = t + 0.3;
        const aimed = count % 3 === 0;
        const x = aimed ? clamp(soul.x, box.x + 4, box.x + box.w - 4) : rand(box.x + 3, box.x + box.w - 3);
        bullets.push(new Shot({ x, y: box.y - 3, vy: 72, vx: rand(-6, 6), warn: aimed ? 0.4 : 0, art: 'lumSpark', life: 2.2 }));
        count++;
      },
    };
  },

  // Pot (once its hearth has caught): the chimney pot jumps off the stack and
  // bangs round the box off the walls, puffing soot as it goes; then a second.
  lumPot(box, density, { Shot, rand }) {
    let t = 0;
    let pots = 0;
    const live = [];
    return {
      duration: 7.0,
      update: (dt, bullets, soul) => {
        t += dt;
        if (pots < 2 && t >= 0.2 + pots * 2.4) {
          const x = box.x + box.w - 7;
          const y = box.y + rand(12, box.h - 12);
          const a = Math.atan2(soul.y - y, soul.x - x) + rand(-0.3, 0.3);
          const pot = new Shot({ x, y, vx: Math.cos(a) * 62, vy: Math.sin(a) * 62, bounce: true, warn: 0.6, art: 'lumPot', life: 5.4 - pots * 1.6 });
          live.push({ pot, puff: 0.3 });
          bullets.push(pot);
          pots++;
        }
        for (const p of live) {
          if (p.pot.age < p.pot.warn || p.pot.age > p.pot.warn + p.pot.life) continue;
          p.puff -= dt;
          if (p.puff > 0) continue;
          p.puff = 0.45;
          // A puff out of its mouth, back the way it came, slowing.
          const sp = Math.hypot(p.pot.vx, p.pot.vy) || 1;
          bullets.push(new Shot({ x: p.pot.x, y: p.pot.y, vx: (-p.pot.vx / sp) * 24 + rand(-10, 10), vy: (-p.pot.vy / sp) * 24 + rand(-10, 10), accel: -10, art: 'lumPuff', life: 1.6 }));
        }
      },
    };
  },
};

// Aimed shots on top (see snipes.js), with its own bricks, coals and sparks.
THE_LUM_ATTACKS.lumRings = withSnipes(THE_LUM_ATTACKS.lumRings, { art: 'lumCoal', count: 5, first: 0.8, every: 1.0, lead: ['mean', 0.9, 'mean', 0.4, 0.9], until: 5.6 });
THE_LUM_ATTACKS.lumBricks = withSnipes(THE_LUM_ATTACKS.lumBricks, { art: 'lumHalf', count: 4, first: 1.0, every: 1.2, lead: [0.9, 'mean', 0.4, 'mean'], until: 5.6 });
THE_LUM_ATTACKS.lumPot = withSnipes(THE_LUM_ATTACKS.lumPot, { art: 'lumCoal', count: 5, first: 0.9, every: 1.0, lead: ['mean', 0.9, 'mean', 0.4, 0.9], until: 6 });
