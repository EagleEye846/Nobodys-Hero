import { defineBulletArt } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { Ring } from './underShapes.js';
import { withSnipes } from './snipes.js';

// The Powder Monkey's attacks. The gunner's boy of the Fair Return, ten years
// old and in charge of the powder, carrying it from the magazine to the guns at
// a run: round shot he rolls along the deck, a keg with a slow fuse he sets and
// leaves, the rammer he pokes down the barrel, and the smoke and burning wadding
// that every gun leaves hanging in the air. Everything he does is slow to go
// off, because a boy with a match is told to be careful. He stands to the right
// of the box, so most things come from that side.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The attack's own clock (`t`) runs `density`
// times faster than the seconds on the wall, hence the `T` below.

const P = {
  k: '#1c1a1c', q: '#303034', Q: '#585860', C: '#9a9a84', w: '#f4f0dc', o: '#ff9a2a', O: '#ffe070', r: '#c8442a', R: '#6a2a1c',
  h: '#4a3a30', H: '#74604c', b: '#c8a448', B: '#80601c', g: '#a8b4ac', G: '#68807a', s: '#cfd4c8', S: '#8c948c', d: '#3e3e36',
};

// Round shot, a cannonball with a fuse spark on it: it rolls (spins), cold iron.
defineBulletArt('monkeyShot', {
  frames: [
    art(11, 11, (p) => { p.ellipse(5, 5, 4.6, 4.6, 'q'); p.ellipse(4, 4, 2, 1.6, 'Q'); p.set(3, 3, 'C'); p.set(7, 7, 'k'); p.set(8, 2, 'o'); p.set(9, 1, 'O'); }),
    art(11, 11, (p) => { p.ellipse(5, 5, 4.6, 4.6, 'q'); p.ellipse(4, 4, 2, 1.6, 'Q'); p.set(3, 3, 'C'); p.set(7, 7, 'k'); p.set(8, 2, 'O'); p.set(9, 1, 'o'); }),
  ],
  palette: P,
  radius: 4.6,
  frameSeconds: 0.1,
  spin: 5,
});

// A splinter off the keg: a long sliver of oak with a scorched end.
defineBulletArt('monkeySplinter', {
  frames: [art(11, 5, (p) => { p.poly([[0, 2], [8, 0], [10, 2], [8, 4]], 'H'); p.line(1, 2, 8, 1, 'b'); p.rect(7, 1, 3, 3, 'R'); p.set(9, 2, 'o'); })],
  palette: P,
  radius: 3,
  rotate: true,
});

// The keg itself (a pip that shows where it sits: harmless until it goes).
defineBulletArt('monkeyKeg', {
  frames: [
    art(13, 13, (p) => { p.ellipse(6, 6, 5.4, 5.8, 'h'); p.rect(1, 3, 11, 1, 'B'); p.rect(1, 9, 11, 1, 'B'); p.line(3, 2, 3, 10, 'H'); p.rect(5, 0, 3, 2, 'q'); p.set(6, 0, 'o'); }),
    art(13, 13, (p) => { p.ellipse(6, 6, 5.4, 5.8, 'h'); p.rect(1, 3, 11, 1, 'B'); p.rect(1, 9, 11, 1, 'B'); p.line(3, 2, 3, 10, 'H'); p.rect(5, 0, 3, 2, 'q'); p.set(6, 0, 'O'); }),
  ],
  palette: P,
  radius: 1,
  frameSeconds: 0.12,
});

// The fuse's spark, creeping along the deck toward the keg (harmless).
defineBulletArt('monkeySpark', {
  frames: [
    art(5, 5, (p) => { p.set(2, 2, 'O'); p.set(1, 2, 'o'); p.set(3, 2, 'o'); p.set(2, 1, 'o'); p.set(2, 3, 'o'); }),
    art(5, 5, (p) => { p.set(2, 2, 'w'); p.set(1, 1, 'o'); p.set(3, 3, 'o'); p.set(3, 1, 'O'); p.set(1, 3, 'O'); }),
  ],
  palette: P,
  radius: 1,
  frameSeconds: 0.08,
});

// A puff of powder smoke, grey and slow (harmless: it only hides things a little).
defineBulletArt('monkeySmoke', {
  frames: [art(15, 11, (p) => { p.ellipse(7, 6, 6.4, 4, 'g'); p.ellipse(5, 4, 3.2, 2.4, 's'); p.ellipse(10, 7, 3, 2.2, 'G'); }, false)],
  palette: P,
  radius: 1,
  rim: false,
  frameSeconds: 0.5,
});

// Burning wadding falling out of the smoke: a scrap of scorched cloth, still alight.
defineBulletArt('monkeyEmber', {
  frames: [
    art(7, 7, (p) => { p.ellipse(3, 3, 2.6, 2.6, 'r'); p.ellipse(3, 3, 1.4, 1.4, 'o'); p.set(3, 3, 'O'); p.set(1, 5, 'R'); }),
    art(7, 7, (p) => { p.ellipse(3, 3, 2.6, 2.6, 'R'); p.ellipse(3, 3, 1.4, 1.4, 'r'); p.set(3, 3, 'o'); p.set(5, 1, 'O'); }),
  ],
  palette: P,
  radius: 2.6,
  frameSeconds: 0.15,
});

// The slow-match's own flicker, as a thrown spark.
defineBulletArt('monkeyFlick', {
  frames: [art(7, 7, (p) => { p.set(3, 3, 'w'); p.set(2, 3, 'O'); p.set(4, 3, 'O'); p.set(3, 2, 'o'); p.set(3, 4, 'o'); p.set(1, 3, 'r'); p.set(5, 3, 'r'); })],
  palette: P,
  radius: 2.4,
  spin: 6,
});

// The rammer: a long pole, a round wooden head, a clean rope grip.
class Rammer {
  // Thrusts in from the right along its lane, holds, draws back. It flashes its
  // outline where it will be first (just inside the edge it comes from).
  constructor({ box, y, len = 56, thick = 6, warn = 0.8, thrust = 0.22, hold = 0.45, back = 0.45 }) {
    Object.assign(this, { box, y, len, thick, warn, thrust, hold, back });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    // The pole's tip, in x (the head); it comes in from beyond the right edge.
    this.vx = 0;
  }

  get end() {
    return this.warn + this.thrust + this.hold + this.back;
  }

  // How far out it is, 0 (outside the box) to 1 (full reach).
  reach() {
    const t = this.age - this.warn;
    if (t < 0) return 0;
    const ease = (u) => u * u * (3 - 2 * u);
    if (t < this.thrust) return ease(t / this.thrust);
    if (t < this.thrust + this.hold) return 1;
    return Math.max(0, 1 - ease((t - this.thrust - this.hold) / this.back));
  }

  tip() {
    const b = this.box;
    return b.x + b.w + 4 - this.len * this.reach();
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.end + 0.05;
  }

  edgeDistance(px, py) {
    if (this.age < this.warn || this.reach() <= 0.02) return Infinity;
    const b = this.box;
    const left = this.tip();
    const dx = Math.max(left - px, 0, px - (b.x + b.w + 8));
    const dy = Math.max(this.y - this.thick / 2 - py, 0, py - (this.y + this.thick / 2));
    return Math.hypot(dx, dy);
  }

  draw(ctx) {
    const b = this.box;
    ctx.save();
    if (this.age < this.warn) {
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.25 : 0.6;
      ctx.strokeStyle = '#cfd4c8';
      ctx.setLineDash([3, 2]);
      ctx.strokeRect(b.x + b.w - this.len + 0.5, Math.round(this.y - this.thick / 2) + 0.5, this.len, this.thick);
      ctx.restore();
      return;
    }
    const left = Math.round(this.tip());
    const y = Math.round(this.y - this.thick / 2);
    const right = b.x + b.w + 10;
    ctx.fillStyle = '#1c1a1c';
    ctx.fillRect(left - 2, y - 1, right - left + 2, this.thick + 2);
    ctx.fillStyle = '#74604c';
    ctx.fillRect(left + 4, y + 1, right - left - 4, this.thick - 2);
    ctx.fillStyle = '#c8a448';
    ctx.fillRect(left + 4, y + 1, right - left - 4, 1);
    // The rope grip and the round wooden head, scorched.
    ctx.fillStyle = '#80601c';
    for (let x = left + 12; x < right - 4; x += 8) ctx.fillRect(x, y, 3, this.thick);
    ctx.fillStyle = '#4a3a30';
    ctx.fillRect(left, y - 1, 6, this.thick + 2);
    ctx.fillStyle = '#6a2a1c';
    ctx.fillRect(left, y, 2, this.thick);
    ctx.fillStyle = '#ff9a2a';
    ctx.fillRect(left, y + 1, 1, 1);
    ctx.restore();
  }
}

export const POWDER_MONKEY_ATTACKS = {
  // Round shot: he rolls iron balls across the deck from his side, in lanes,
  // a fuse spark on each. A ball that hits the far wall rolls back, slower.
  monkeyShot(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.25);
    let volleys = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && volleys < 6 && t < T(5.4)) {
          volleys++;
          next = t + T(0.85);
          // A ball through where you are, one either side a good way off (and a gap between).
          const lanes = [soul.y, soul.y - rand(20, 26), soul.y + rand(20, 26)].map((y) => clamp(y, box.y + 7, box.y + box.h - 7));
          lanes.forEach((y, i) => {
            if (i && Math.random() < 0.2) return;
            bullets.push(new Shot({ x: box.x + box.w + 6, y, vx: -rand(58, 68), warn: 0.5, life: 4.6, art: 'monkeyShot' }));
          });
        }
      },
    };
  },

  // Slow fuse: he sets a keg down in the box (somewhere other than where you
  // are) and lights it. The spark creeps along the deck to it (you can watch
  // it come) and the keg goes off in a ring of splinters. Three, one after another.
  monkeyKeg(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.3);
    let kegs = 0;
    const going = [];
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && kegs < 3 && t < T(4.4)) {
          kegs++;
          next = t + T(1.5);
          // At least 24 px from you, on whichever side has most room.
          const side = soul.x < box.x + box.w / 2 ? 1 : -1;
          let kx = clamp(soul.x + side * rand(24, 34), box.x + 10, box.x + box.w - 10);
          const ky = clamp(soul.y + rand(-22, 22), box.y + 10, box.y + box.h - 10);
          if (Math.abs(kx - soul.x) < 20) kx = soul.x < box.x + box.w / 2 ? box.x + box.w - 10 : box.x + 10;
          const fuseFrom = { x: box.x + box.w + 4, y: ky };
          const burn = 1.2;
          // The keg is there at once, blinking; the fuse's spark runs in along the deck.
          bullets.push(new Shot({ x: kx, y: ky, harmless: true, warn: burn, life: 0, art: 'monkeyKeg' }));
          const spark = new Shot({ x: fuseFrom.x, y: ky, harmless: true, life: 99, art: 'monkeySpark' });
          bullets.push(spark);
          going.push({ at: t + T(burn), t0: t, kx, ky, spark, from: fuseFrom.x, done: false });
        }
        for (const g of going) {
          if (g.done) continue;
          if (t < g.at) {
            g.spark.x = g.from + (g.kx - g.from) * ((t - g.t0) / (g.at - g.t0));
            continue;
          }
          g.done = true;
          g.spark.life = 0;
          g.spark.age = 99;
          // The keg goes: a ring of splinters, and a short ring of flame.
          bullets.push(new Ring({ x: g.kx, y: g.ky, r: 2, grow: 40, thick: 2.5, life: 0.5, color: '#ffb040', glow: '#ff7a20' }));
          const n = 10;
          const spin = Math.random() * Math.PI;
          for (let i = 0; i < n; i++) {
            const a = spin + (i / n) * Math.PI * 2;
            bullets.push(new Shot({ x: g.kx, y: g.ky, vx: Math.cos(a) * 44, vy: Math.sin(a) * 44, life: 1.7, art: 'monkeySplinter' }));
          }
        }
      },
    };
  },

  // The rammer: poles come in from the right along lanes, thrust, hold,
  // withdraw; a lane or two are left clear. The lane you are in is never the
  // clear one the first time.
  monkeyRam(box, density, { rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.2);
    let waves = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && waves < 5 && t < T(5.4)) {
          waves++;
          next = t + T(1.1);
          // Lanes every 14 px; the clear lane is a step or two from you.
          const lanes = [];
          for (let y = box.y + 8; y < box.y + box.h - 5; y += 14) lanes.push(y);
          const mine = lanes.reduce((a, y, i) => (Math.abs(y - soul.y) < Math.abs(lanes[a] - soul.y) ? i : a), 0);
          const dir = Math.random() < 0.5 ? -1 : 1;
          let clear = clamp(mine + dir * (1 + (Math.random() < 0.5 ? 1 : 0)), 0, lanes.length - 1);
          if (clear === mine) clear = mine > 0 ? mine - 1 : mine + 1;
          lanes.forEach((y, i) => {
            if (i === clear) return;
            // Every other lane waits a little longer (a backhand), so staying in the clear lane isn't enough.
            bullets.push(new Rammer({ box, y, warn: 0.75 + (i % 2) * 0.12 + rand(0, 0.06) }));
          });
        }
      },
    };
  },

  // Powder smoke: the guns' smoke rolls across the box, grey and slow, and
  // out of it burning wadding falls, still alight, wobbling down. You can see
  // clearly through the smoke; it's the embers you watch.
  monkeySmoke(box, density, { Shot, rand, clamp, every }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.2);
    let clouds = 0;
    const drift = [];
    const embers = every(0.14, 0.22, (bullets, soul) => {
      const c = drift[Math.floor(Math.random() * drift.length)];
      if (!c) return;
      bullets.push(new Shot({ x: clamp(c.shot.x + rand(-6, 6), box.x + 4, box.x + box.w - 4), y: c.shot.y + 3, vy: 14, gravity: 12, wobble: { amplitude: 3, frequency: 4 }, warn: 0.45, life: 3.2, art: 'monkeyEmber' }));
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && clouds < 4 && t < T(4.4)) {
          clouds++;
          next = t + T(1.0);
          const y = box.y + 8 + (clouds % 2 ? 2 : 14) + rand(0, 8);
          const shot = new Shot({ x: box.x + box.w + 8, y, vx: -20, harmless: true, life: 8, art: 'monkeySmoke' });
          bullets.push(shot);
          drift.push({ shot });
        }
        if (t < T(5.6) && drift.length) embers(dt, bullets, soul);
        // A spark flicked off the slow-match at you now and then.
      },
    };
  },
};

POWDER_MONKEY_ATTACKS.monkeyShot = withSnipes(POWDER_MONKEY_ATTACKS.monkeyShot, { art: 'monkeyFlick', count: 3, first: 1.2, every: 1.4, lead: [0.9, 'mean', 0.5] });
POWDER_MONKEY_ATTACKS.monkeyKeg = withSnipes(POWDER_MONKEY_ATTACKS.monkeyKeg, { art: 'monkeyFlick', count: 3, first: 1.3, every: 1.5, lead: [0.9, 'mean', 0.5] });
POWDER_MONKEY_ATTACKS.monkeyRam = withSnipes(POWDER_MONKEY_ATTACKS.monkeyRam, { art: 'monkeyFlick', count: 3, first: 1.3, every: 1.5, lead: [0.9, 'mean', 0.5] });
POWDER_MONKEY_ATTACKS.monkeySmoke = withSnipes(POWDER_MONKEY_ATTACKS.monkeySmoke, { art: 'monkeyFlick', count: 3, first: 1.3, every: 1.5, lead: [0.9, 'mean', 0.5] });
