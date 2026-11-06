import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/ch5Kit.js';

// The Limpet Knight's attacks. Very serious, very armoured, and it will not
// be moved: so it bashes (two wide steel plates slam across the box with a
// gap between them, and the gap is never where you're standing), it sucks
// (a limpet's one real trick: you're pulled toward its side of the box, where
// a bed of barnacles waits, and pebbles are dragged in with you), and it sends
// stones rolling down its rock in diagonal lanes. It stands to the right of
// the box, so everything comes in from that side.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The attack's own clock (`t`) runs `density`
// times faster than the seconds on the wall, hence the `T` below.

const ROCK = { k: '#1b1a22', h: '#b4a68a', H: '#d8ccb0', s: '#8a7c64', D: '#35302c', g: '#7e8a78', G: '#aab6a0', w: '#f0f4ee' };

function art(w, h, draw) {
  const p = new Pix(w, h);
  draw(p);
  return p.outline('k').rows();
}

// A rolling stone, two sizes: round and lumpy, with a pale crack.
const stone = (r) => art(r * 2 + 3, r * 2 + 3, (p) => {
  p.ellipse(r + 1, r + 1, r, r, 'h');
  p.ellipse(r + 2, r + 2, r - 1.5, r - 1.5, 's', ['h']);
  p.ellipse(r, r, r / 2.4, r / 2.6, 'H');
  p.line(r - 1, r + 2, r + 2, r - 1, 'D');
});
defineBulletArt('limpStone', { frames: [stone(3)], palette: ROCK, radius: 3.1, spin: 6 });
defineBulletArt('limpBoulder', { frames: [stone(5)], palette: ROCK, radius: 5.1, spin: 4 });

// A pebble dragged along in the suction.
defineBulletArt('limpPebble', { frames: [art(5, 5, (p) => { p.ellipse(2, 2, 1.6, 1.6, 'h'); p.set(3, 3, 's'); })], palette: ROCK, radius: 1.9, spin: 8 });

// A barnacle: a little white volcano with a dark mouth.
defineBulletArt('limpBarnacle', {
  frames: [
    art(9, 8, (p) => { p.poly([[1, 6], [3, 1], [6, 1], [8, 6]], 'G'); p.rect(3, 1, 3, 1, 'D'); p.line(2, 5, 3, 2, 'w'); p.rect(1, 6, 7, 1, 'g'); }),
    art(9, 8, (p) => { p.poly([[1, 6], [3, 1], [6, 1], [8, 6]], 'G'); p.rect(3, 1, 3, 2, 'D'); p.line(2, 5, 3, 2, 'w'); p.rect(1, 6, 7, 1, 'g'); }),
  ],
  palette: ROCK,
  radius: 3.4,
  frameSeconds: 0.3,
});

// The suction itself: a ring of dashes pulling in (harmless; it's the pull
// and what comes with it that hurts).
defineBulletArt('limpSwirl', {
  frames: [
    ['..w...w..', '.........', 'w.......w', '.........', '..w...w..'].map((r) => r),
    ['.w.....w.', '.........', '.........', '.........', '.w.....w.'],
  ],
  palette: ROCK,
  radius: 1,
  frameSeconds: 0.2,
  spin: 3,
});

// A steel plate slamming across the box: a rectangle with rivets and a
// limpet crest. It flashes where it will be before it moves.
class Plate {
  constructor({ x, y, w, h, vx, warn = 0.6, life = 3 }) {
    Object.assign(this, { x, y, w, h, vx, warn, life });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
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
    const dx = Math.max(this.x - px, 0, px - (this.x + this.w));
    const dy = Math.max(this.y - py, 0, py - (this.y + this.h));
    return Math.hypot(dx, dy);
  }

  draw(ctx) {
    ctx.save();
    if (this.age < this.warn) {
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.2 : 0.5;
      ctx.strokeStyle = '#a8b8c8';
      ctx.setLineDash([3, 2]);
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x + 0.5, this.y + 0.5, this.w, this.h);
      ctx.restore();
      return;
    }
    const over = this.age - (this.warn + this.life);
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
    const x = Math.round(this.x);
    const y = Math.round(this.y);
    ctx.fillStyle = '#1b1a22';
    ctx.fillRect(x - 1, y - 1, this.w + 2, this.h + 2);
    ctx.fillStyle = '#617488';
    ctx.fillRect(x, y, this.w, this.h);
    ctx.fillStyle = '#a8b8c8';
    ctx.fillRect(x, y, Math.max(2, this.w - 3), this.h);
    ctx.fillStyle = '#e8f2fa';
    ctx.fillRect(x + 1, y, 1, this.h);
    // Rivets and a limpet crest.
    ctx.fillStyle = '#e8f2fa';
    for (let ry = y + 3; ry < y + this.h - 2; ry += 9) {
      ctx.fillRect(x + this.w - 3, ry, 1, 1);
    }
    ctx.fillStyle = '#b4a68a';
    for (let ry = y + this.h / 2 - 3; ry < y + this.h / 2 + 3; ry += 1) {
      const half = (ry - (y + this.h / 2 - 3)) / 2;
      ctx.fillRect(x + this.w / 2 - half, ry, half * 2 + 1, 1);
    }
    ctx.restore();
  }
}

export const LIMPET_KNIGHT_ATTACKS = {
  // Shield bash: two wide plates slam across the box with a gap between
  // them. The gap is never where you are, and the plates' outlines flash
  // first.
  limpBash(box, density, { rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.2);
    let waves = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && waves < 4 && t < T(5.4)) {
          waves++;
          next = t + T(1.55);
          const gapH = 25;
          const lo = box.y + 4 + gapH / 2;
          const hi = box.y + box.h - 4 - gapH / 2;
          // Somewhere other than where you stand.
          let c = clamp(soul.y + (Math.random() < 0.5 ? -1 : 1) * rand(24, 34), lo, hi);
          if (Math.abs(c - soul.y) < 18) c = soul.y < (lo + hi) / 2 ? hi : lo;
          const x = box.x + box.w + 3;
          const speed = -64;
          bullets.push(new Plate({ x, y: box.y - 2, w: 9, h: c - gapH / 2 - (box.y - 2), vx: speed, warn: 0.65, life: 3 }));
          bullets.push(new Plate({ x, y: c + gapH / 2, w: 9, h: box.y + box.h + 2 - (c + gapH / 2), vx: speed, warn: 0.65, life: 3 }));
        }
      },
    };
  },

  // Suction: the knight clamps down and pulls. You're dragged toward its side
  // of the box, where a bed of barnacles waits (with a gap or two), and
  // pebbles are dragged in with you, faster and faster.
  limpSuck(box, density, { Shot, every, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let bed = false;
    const pebbles = every(0.3, 0.42, (bullets, soul) => {
      const y = Math.random() < 0.55 ? clamp(soul.y + rand(-6, 6), box.y + 4, box.y + box.h - 4) : rand(box.y + 4, box.y + box.h - 4);
      bullets.push(new Shot({ x: box.x - 3, y, vx: 14, accel: 38, art: 'limpPebble', life: 3.5 }));
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!bed) {
          bed = true;
          // The barnacles along the right wall: a gap or two in the row.
          const gaps = [rand(box.y + 12, box.y + 30), rand(box.y + 48, box.y + box.h - 12)];
          for (let y = box.y + 5; y <= box.y + box.h - 4; y += 9) {
            if (gaps.some((g) => Math.abs(g - y) < 8)) continue;
            bullets.push(new Shot({ x: box.x + box.w - 3, y, warn: 0.9, life: 5.4, art: 'limpBarnacle' }));
          }
          for (let i = 0; i < 3; i++) bullets.push(new Shot({ x: box.x + box.w - 6, y: box.y + 14 + i * 26, harmless: true, life: 6, art: 'limpSwirl' }));
        }
        if (t >= T(0.9) && t < T(6.2)) {
          soul.x += 17 * (dt / density);
          if (t < T(5.6)) pebbles(dt, bullets, soul);
        }
      },
    };
  },

  // Stones: it shoves stones off its rock, and they roll down diagonal lanes
  // across the box, a lane through where you stand and others to either
  // side, some big. Dust puffs up where each one starts.
  limpStones(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.2);
    let volleys = 0;
    let firing = [];
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && volleys < 5 && t < T(5.2)) {
          volleys++;
          next = t + T(1.2);
          // Lanes run down and to the left, then up and to the left (each
          // volley turns the other way), so strafing one way never beats it.
          // A lane is the value of (x + dir * y).
          const dir = volleys % 2 === 1 ? 1 : -1;
          const base = soul.x + dir * soul.y;
          const offsets = [0, rand(24, 32), -rand(24, 32), rand(48, 60)];
          const cut = [];
          for (const o of offsets) {
            const lane = base + o;
            // Where the lane enters the box: along the top (or bottom) edge, or the right edge.
            const edgeY = dir === 1 ? box.y : box.y + box.h;
            let x = lane - dir * edgeY;
            let y = edgeY;
            if (x > box.x + box.w) { x = box.x + box.w; y = (lane - x) * dir; }
            if (y > box.y + box.h || y < box.y || x < box.x) continue;
            cut.push({ x: x + 3, y: y - 3 * dir, dir, big: o === 0 ? Math.random() < 0.4 : Math.random() < 0.3 });
          }
          for (const s of cut) bullets.push(new Shot({ x: s.x + 5, y: s.y - 5 * s.dir, harmless: true, life: 0.65, art: 'limpPebble' }));
          firing.push({ at: t + T(0.65), cut });
        }
        for (const v of firing) {
          if (t < v.at) continue;
          v.done = true;
          for (const s of v.cut) bullets.push(new Shot({ x: s.x, y: s.y, vx: -40, vy: 40 * s.dir, art: s.big ? 'limpBoulder' : 'limpStone', life: 4 }));
        }
        firing = firing.filter((v) => !v.done);
      },
    };
  },
};
