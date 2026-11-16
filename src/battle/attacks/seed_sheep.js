import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { Shot } from '../projectiles.js';
import { PathShot, Deco } from './coastKit.js';

// The Seed Sheep's attacks. A placid sheep whose fleece is a dandelion
// clock, and everything it does sheds seeds:
//   - Baa: every baa turns the wind (watch the grass along the top), and the
//     seeds blow in from the side the wind is from, with a gap.
//   - Counting sheep: its flock trots along the rows and hops the fence in
//     the middle. In the air over the fence a sheep is harmless.
//   - Wishes: big clocks drift across, and blow apart in a ring of seeds the
//     moment you come near. Give them a wide berth.
// It stands to the right of the box.

const WOOL = { w: '#ffffff', W: '#f6f3e8', s: '#dcd7c4', d: '#bdb6a0', k: '#3a2e2a', y: '#ffd93b', Y: '#e3a42a', g: '#6aa84f' };

// A parachute seed, tuft trailing to the right, the little seed leading.
function seed() {
  const g = new Pix(11, 7);
  g.line(1, 3, 6, 3, 'd');
  g.disc(8, 3, 2.6, 2.6, 'w');
  g.set(8, 1, 'd'); g.set(8, 5, 'd'); g.set(10, 3, 'd');
  g.set(0, 3, 'k');
  g.outline('s');
  return g.rows();
}
defineBulletArt('sheepSeed', { frames: [seed()], palette: WOOL, radius: 2.8, frameSeconds: 0.2 });

// A tuft of wool.
defineBulletArt('sheepTuft', { frames: [['.w.', 'wWw', '.s.']], palette: WOOL, radius: 1.8, spin: 3 });

// A woolly ball with a curl in it, small and big.
function ball(size) {
  const c = (size - 1) / 2;
  const g = new Pix(size, size);
  g.disc(c, c, c, c, 'W');
  g.disc(c + 1, c + 2, c * 0.8, c * 0.6, 's', 'W');
  g.disc(c - 1, c - 1, c * 0.4, c * 0.35, 'w', 'W');
  g.line(c - c * 0.5, c, c + c * 0.5, c + 1, 'd');
  g.outline('d');
  return g.rows();
}
defineBulletArt('sheepBall', { frames: [ball(13)], palette: WOOL, radius: 5.4, spin: 6 });

// The dandelion clock, a round ball of wisps (it only floats; the motes are what hurts).
function clock() {
  const g = new Pix(17, 17);
  g.disc(8, 8, 3, 3, 'd');
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    g.line(8 + Math.cos(a) * 3, 8 + Math.sin(a) * 3, 8 + Math.cos(a) * 6.4, 8 + Math.sin(a) * 6.4, 's');
    g.disc(8 + Math.cos(a) * 7, 8 + Math.sin(a) * 7, 1, 1, 'w');
  }
  g.disc(8, 8, 2, 2, 'W');
  return g.rows();
}
defineBulletArt('sheepClock', { frames: [clock()], palette: WOOL, radius: 7, spin: 1.2 });

// A seed mote that came out of a clock: a bright little star.
defineBulletArt('sheepMote', { frames: [['..w..', '.wsw.', 'wsysw', '.wsw.', '..w..']], palette: WOOL, radius: 2.2, spin: 4 });

// A little sheep at a trot, facing left: fleece a dandelion clock, black legs.
function trotter(step) {
  const g = new Pix(15, 12);
  g.disc(8, 5, 5.4, 4.2, 'W');
  for (const [x, y] of [[4, 2], [8, 1], [12, 3], [6, 8], [11, 8]]) g.set(x, y, 'w');
  g.disc(2.5, 5, 2.2, 1.8, 'k');
  g.set(2, 4, 'w');
  g.line(5, 9, 5 - step, 11, 'k');
  g.line(11, 9, 11 + step, 11, 'k');
  g.outline('d');
  return g.rows();
}
defineBulletArt('sheepTrot', { frames: [trotter(0), trotter(1)], palette: WOOL, radius: 4.6, frameSeconds: 0.14 });
defineBulletArt('sheepHop', { frames: [trotter(1)], palette: WOOL, radius: 1 });
// A wish clock that bursts when you come near (it hurts too, to bump into).
defineBulletArt('sheepWish', { frames: [clock()], palette: WOOL, radius: 5.5, spin: 1.2 });

// A wish clock: it drifts, and the moment you come within `near` of it, your
// breath blows it apart in a ring of seeds.
class Wish extends Shot {
  update(dt, box) {
    super.update(dt, box);
    if (this.burst || this.age < this.warn) return;
    if (Math.hypot(this.soul.x - this.x, this.soul.y - this.y) < this.near) {
      this.burst = true;
      this.life = this.age - this.warn;
      // (Only the real clock lets its seeds go, not a copy looking ahead.)
      if (this.mine.has(this)) this.out.push({ x: this.x, y: this.y });
    }
  }
}

export const SEED_SHEEP_ATTACKS = {
  // Baa: every time it baas, the wind turns (the weathervane of grass at the
  // top of the box swings round), and the seeds the baa shook loose come
  // blowing in with it from the side the wind's from. Each baa, look at the
  // grass, not the sheep.
  sheepBaa(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const WINDS = [0, Math.PI / 2, Math.PI, -Math.PI / 2, Math.PI / 4, (3 * Math.PI) / 4, -Math.PI / 4, (-3 * Math.PI) / 4];
    let wind = Math.PI;
    let t = 0;
    let n = 0;
    let made = false;
    const now = { wind };
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!made) {
          made = true;
          bullets.push(new Deco({ life: 7, paint(ctx, d) {
            // Blades of grass along the top edge, all leaning the way the wind blows.
            const lean = Math.cos(now.wind);
            ctx.strokeStyle = '#6aa84f';
            ctx.lineWidth = 1;
            for (let x = box.x + 4; x < box.x + box.w; x += 6) {
              ctx.beginPath();
              ctx.moveTo(x, box.y + 7);
              ctx.lineTo(x + lean * 4 + Math.sin(d.age * 8 + x) * 0.6, box.y + 1);
              ctx.stroke();
            }
          } }));
        }
        if (t >= T(0.2 + n * 1.25) && n < 5) {
          n++;
          let w;
          do w = WINDS[Math.floor(rand(0, WINDS.length))]; while (Math.abs(Math.atan2(Math.sin(w - wind), Math.cos(w - wind))) < 1);
          wind = w;
          now.wind = w;
          const BAA = 0.55;
          bullets.push(new Deco({ x: box.x + box.w + 10, y: box.y + 20, life: BAA, paint(ctx, d) {
            ctx.strokeStyle = '#ffffff';
            ctx.globalAlpha *= 0.6;
            ctx.beginPath();
            ctx.arc(d.x, d.y, 4 + d.age * 30, Math.PI * 0.6, Math.PI * 1.4);
            ctx.stroke();
          } }));
          // A line of seeds along the upwind side, square to the wind, with a gap.
          const vx = Math.cos(w) * 58;
          const vy = Math.sin(w) * 58;
          const cx = box.x + box.w / 2 - Math.cos(w) * 52;
          const cy = box.y + box.h / 2 - Math.sin(w) * 52;
          const px = -Math.sin(w);
          const py = Math.cos(w);
          const off = (soul.x - (box.x + box.w / 2)) * px + (soul.y - (box.y + box.h / 2)) * py;
          let gap;
          let guard = 0;
          do gap = rand(-36, 36); while (Math.abs(gap - off) < 16 && guard++ < 100);
          for (let s = -60; s <= 60; s += 9) {
            if (Math.abs(s - gap) < 9) continue;
            bullets.push(new Shot({ x: cx + px * s, y: cy + py * s, vx, vy, art: 'sheepSeed', warn: BAA, life: 3, wobble: Math.abs(vy) < 1 ? { amplitude: 2.5, frequency: 4 } : null }));
          }
        }
      },
    };
  },

  // Counting sheep: a fence stands across the middle of the box, and its
  // flock trots in along the rows and hops it, one after another. Up in the
  // air over the fence a sheep is harmless; on the ground, it bowls you
  // over. At the top of every hop a few seeds shake loose and drift down.
  sheepCount(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const fx = box.x + box.w * 0.45;
    const SPEED = 78;
    const HOP = 22;
    let t = 0;
    let n = 0;
    let made = false;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!made) {
          made = true;
          bullets.push(new Deco({ life: 7, paint(ctx) {
            ctx.fillStyle = '#8a6a44';
            ctx.fillRect(fx - 1, box.y, 3, box.h);
            for (let y = box.y + 6; y < box.y + box.h; y += 14) ctx.fillRect(fx - 4, y, 9, 2);
          } }));
        }
        if (t >= T(0.3 + n * 0.45) && n < 12) {
          n++;
          const y = n % 2 ? soul.y : rand(box.y + 7, box.y + box.h - 7);
          const x0 = box.x + box.w + 8;
          const x1 = box.x - 10;
          const total = (x0 - x1) / SPEED;
          const up = (x0 - (fx + HOP / 2)) / SPEED;
          const down = (x0 - (fx - HOP / 2)) / SPEED;
          const WARN = 0.35;
          const at = (k) => ({ x: x0 - SPEED * k, y: y - (k > up && k < down ? Math.sin(Math.PI * (k - up) / (down - up)) * 10 : 0) });
          bullets.push(new PathShot({ art: 'sheepTrot', warn: WARN, life: up, path: at }));
          bullets.push(new PathShot({ art: 'sheepHop', harmless: true, warn: WARN + up, life: down - up, path: (k) => at(k + up) }));
          bullets.push(new PathShot({ art: 'sheepTrot', warn: WARN + down, life: total - down, path: (k) => at(k + down) }));
          for (const o of [-6, 6]) bullets.push(new Shot({ x: fx + o, y: y - 10, vy: 26, art: 'sheepSeed', warn: WARN + (up + down) / 2, life: 1.4 }));
        }
      },
    };
  },

  // Wishes: big dandelion clocks drift across the box. Come near one and
  // your own breath blows it apart: a ring of seeds bursts out from it. Give
  // them a wide berth, or set one off from as far as you dare and be gone.
  sheepWish(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const out = [];
    const mine = new WeakSet();
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + n * 0.7) && n < 9) {
          n++;
          const y = n % 2 ? soul.y : rand(box.y + 10, box.y + box.h - 10);
          const w = new Wish({ x: box.x + box.w + 8, y, vx: -24, vy: (soul.y - y) * 0.1, art: 'sheepWish', warn: 0.3, life: 6 });
          Object.assign(w, { soul, near: 26, out, mine, burst: false });
          mine.add(w);
          bullets.push(w);
        }
        while (out.length) {
          const p = out.shift();
          for (let i = 0; i < 10; i++) {
            const a = (i / 10) * Math.PI * 2;
            bullets.push(new Shot({ x: p.x + Math.cos(a) * 4, y: p.y + Math.sin(a) * 4, vx: Math.cos(a) * 48, vy: Math.sin(a) * 48, art: 'sheepMote', warn: 0.25, life: 1.5 }));
          }
        }
      },
    };
  },
};
