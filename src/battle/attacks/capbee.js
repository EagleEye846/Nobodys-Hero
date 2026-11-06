import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { withSnipes } from './snipes.js';

// The Flatcap Bee's attacks. A tweed-capped bumblebee with a clover patch to
// defend: his mates doing a waggle dance across the box (weaving lines of
// little bees), honey dripping from above that splashes where it lands, and
// the flat cap itself, thrown out like a boomerang and brought back. He
// stands to the right of the box.

const BEE = { k: '#2a2018', y: '#ffcf2e', Y: '#e39c1c', b: '#3a2f28', v: '#cfe8f6', w: '#ffffff', T: '#8a8f7a', t: '#5e6450', u: '#b9bd9f', h: '#f0a020', H: '#c87a10', l: '#fff2a0' };

// A little bee, flying left, wings up.
function littleBee(flap) {
  const g = new Pix(11, 9);
  g.disc(6, 5, 4, 2.8, 'y');
  g.rect(5, 3, 1, 5, 'b');
  g.rect(8, 3, 1, 5, 'b');
  g.disc(2, 5, 1.8, 1.8, 'y');
  g.set(1, 4, 'k');
  g.line(10, 5, 10, 6, 'k');
  g.disc(5, flap ? 1 : 2, 2.6, flap ? 1.2 : 1.8, 'v');
  g.disc(8, flap ? 1 : 2, 2, flap ? 1 : 1.6, 'v');
  g.outline('k');
  return g.rows();
}
defineBulletArt('beeBuzz', { frames: [littleBee(0), littleBee(1)], palette: BEE, radius: 3, frameSeconds: 0.07 });

// A drop of honey, round at the bottom and pointed at the top.
defineBulletArt('beeDrop', {
  frames: [['...h...', '..hhh..', '..hhh..', '.hhlhh.', 'hhhlhhh', 'hhhhhhH', '.hhhHH.', '..HHH..']],
  palette: BEE,
  radius: 3.2,
});

// The honey about to fall: a swelling bead at the top of the box, blinking.
defineBulletArt('beeBead', { frames: [['.hh.', 'hhlh', 'hhhH', '.HH.']], palette: BEE, radius: 2 });

// A splash droplet.
defineBulletArt('beeSplat', { frames: [['.h.', 'hlh', '.H.']], palette: BEE, radius: 1.8 });

// The flat cap: tweed, with a short peak and a button.
function cap() {
  const g = new Pix(15, 9);
  g.disc(8, 4, 6.4, 3.4, 'T');
  g.disc(9, 3, 3.6, 1.6, 'u', 'T');
  g.rect(0, 5, 6, 2, 't');
  g.line(2, 5, 13, 6, 't');
  g.set(8, 1, 't');
  g.outline('k');
  return g.rows();
}
defineBulletArt('beeCap', { frames: [cap()], palette: BEE, radius: 4.6, spin: 7 });

export const CAPBEE_ATTACKS = {
  // Waggle: his mates dance across, weaving up and down in step like a wave.
  // Three bees in a four-lane wave, each wave weaving a little later than the
  // last, so there is always a lane through if you follow the beat. Seven waves.
  beeWaggle(box, density, { Shot, rand }) {
    let t = 0;
    let waves = 0;
    let next = 0.2;
    class Weaver extends Shot {
      update(dt, box2) {
        super.update(dt, box2);
        if (this.age > this.warn) this.y = this.row + Math.sin((this.age - this.warn) * 4.6 + this.phase) * 9;
      }
    }
    return {
      duration: 7.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || waves >= 7 || t > 5.8) return;
        next = t + 0.82;
        // The free lane is somewhere new, and not the lane you are in.
        const lanes = [0, 1, 2, 3];
        const mine = Math.max(0, Math.min(3, Math.floor((soul.y - box.y) / 20)));
        const free = lanes.filter((l) => l !== mine)[Math.floor(rand(0, 3))];
        for (const l of lanes) {
          if (l === free) continue;
          const row = box.y + 10 + l * 20;
          const b = new Weaver({ x: box.x + box.w + 6, y: row, vx: -60, warn: 0.3, art: 'beeBuzz', life: 3.2 });
          b.row = row;
          b.phase = waves * 0.8 + l * 0.35;
          bullets.push(b);
        }
        waves++;
      },
    };
  },

  // Honey: honey drips from the top of the box. A bead swells and blinks
  // first (over your column and either side of it), then falls, and where it
  // lands it splashes two droplets out sideways. Five rounds of three.
  beeHoney(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let rounds = 0;
    let next = 0.2;
    let falling = [];
    return {
      duration: 7.6,
      update: (dt, bullets, soul) => {
        t += dt;
        for (const d of falling) {
          if (d.age >= d.warn && !d.fallen) {
            d.fallen = true;
          }
          if (d.fallen && d.y > box.y + box.h - 4 && !d.splashed) {
            d.splashed = true;
            d.vy = 0;
            d.vx = 0;
            d.gravity = 0;
            d.life = 0;
            for (const s of [-1, 1]) {
              bullets.push(new Shot({ x: d.x, y: box.y + box.h - 4, vx: s * 46, vy: -40, gravity: 130, art: 'beeSplat', life: 0.85 }));
            }
          }
        }
        falling = falling.filter((d) => !d.splashed);
        if (t < next || rounds >= 5 || t > 5.6) return;
        next = t + 1.2;
        const xs = [soul.x + rand(-5, 5), soul.x + rand(-30, -16), soul.x + rand(16, 30)];
        // A drop is let go at the end of its blink.
        for (const x of xs) {
          const d = new Shot({ x: clamp(x, box.x + 6, box.x + box.w - 6), y: box.y + 4, warn: 0.62, art: 'beeDrop', life: 2.2, gravity: 0 });
          const old = d.update.bind(d);
          d.update = (dt2, b) => {
            if (d.age < d.warn && d.age + dt2 >= d.warn) d.gravity = 150;
            old(dt2, b);
          };
          falling.push(d);
          bullets.push(d);
        }
        rounds++;
      },
    };
  },

  // Cap: he doffs his cap and throws it out like a boomerang, one at you and
  // one or two a little off; each flies out, slows, and comes back along the same
  // line a bit faster, so the way out is not the way to stand. Four throws
  // of two, and a flick of the wrist between.
  beeCap(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let throws = 0;
    let next = 0.2;
    const T = 1.7;
    const heading = { x: 0, y: 0 };
    const seen = { x: null, y: null };
    class Boomerang extends Shot {
      update(dt, box2) {
        this.age += dt;
        if (this.age < this.warn) return;
        const s = this.age - this.warn;
        // Out and back along one line: distance D * sin, a touch faster home.
        const p = Math.min(1, s / T);
        const along = this.reach * Math.sin(Math.PI * Math.pow(p, 0.9));
        this.x = this.ox + Math.cos(this.dir) * along;
        this.y = this.oy + Math.sin(this.dir) * along;
        this.angle += dt * 7;
      }
    }
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (seen.x !== null && dt > 0) {
          heading.x = heading.x * 0.85 + ((soul.x - seen.x) / dt) * 0.15;
          heading.y = heading.y * 0.85 + ((soul.y - seen.y) / dt) * 0.15;
        }
        seen.x = soul.x;
        seen.y = soul.y;
        if (t < next || throws >= 4 || t > 5.6) return;
        next = t + 1.55;
        const ox = box.x + box.w + 7;
        const oy = clamp(soul.y + rand(-26, 26), box.y + 8, box.y + box.h - 8);
        const tx = soul.x + heading.x * 0.45;
        const ty = soul.y + heading.y * 0.45;
        const aim = Math.atan2(ty - oy, tx - ox);
        const reach = clamp(Math.hypot(tx - ox, ty - oy) + 18, 60, 120);
        for (const off of throws % 2 ? [0, 0.42, -0.42] : [0, -0.5]) {
          const c = new Boomerang({ x: ox, y: oy, warn: off ? 0.75 : 0.55, art: 'beeCap', life: T + 0.05 });
          c.ox = ox;
          c.oy = oy;
          c.dir = aim + off;
          c.reach = off ? reach * 0.9 : reach;
          bullets.push(c);
        }
        throws++;
      },
    };
  },
};

// Aimed bees on top, so standing still or running one way is never safe (see snipes.js).
CAPBEE_ATTACKS.beeWaggle = withSnipes(CAPBEE_ATTACKS.beeWaggle, { art: 'beeBuzz' });
CAPBEE_ATTACKS.beeHoney = withSnipes(CAPBEE_ATTACKS.beeHoney, { art: 'beeBuzz' });
CAPBEE_ATTACKS.beeCap = withSnipes(CAPBEE_ATTACKS.beeCap, { art: 'beeBuzz', count: 4, first: 1.0, every: 1.4 });
