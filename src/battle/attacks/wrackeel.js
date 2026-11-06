import { defineBulletArt } from '../projectiles.js';
import { withSnipes } from './snipes.js';

// The Wrackeel's attacks. It's a sparking eel, so everything it does is a
// jolt: little eels that dart in zigzags, a chain of sparks that jumps from
// node to node (the whole chain is drawn first), coils that close into
// rings with one gap that turns, and surges along the rows and columns of
// the box. It stands to the right of the box.

const EEL = { b: '#2f8fa8', B: '#1d5f78', y: '#fff06a', c: '#8ff0ff', w: '#ffffff', k: '#0f1b26' };

// A little eel dart pointing right, a spark for an eye.
defineBulletArt('eelDart', {
  frames: [
    ['...bb..y', 'bbbbbbby', '.BBBBBb.', '...BB...'],
    ['..bb...y', '.bbbbbby', 'bBBBBBb.', '..BB....'],
  ],
  palette: EEL,
  radius: 2.4,
  rotate: true,
  frameSeconds: 0.14,
});

// A spark: a yellow cross that fizzes.
defineBulletArt('eelSpark', {
  frames: [
    ['.y.', 'ywy', '.y.'],
    ['y.y', '.w.', 'y.y'],
  ],
  palette: EEL,
  radius: 1.8,
  frameSeconds: 0.08,
});

// A node of the chain: a bigger crackling ball (harmless until its link fires).
defineBulletArt('eelNode', {
  frames: [
    ['..c..', '.cyc.', 'cywyc', '.cyc.', '..c..'],
    ['.c.c.', 'cyyyc', '.ywy.', 'cyyyc', '.c.c.'],
  ],
  palette: EEL,
  radius: 1,
  frameSeconds: 0.1,
});

// A bit of coil: a curl of eel, spinning.
defineBulletArt('eelCoil', {
  frames: [
    ['.ccc.', 'cBBBc', 'cB.Bc', 'cBycc', '.ccc.'],
    ['.ccc.', 'cBBBc', 'cyBBc', 'cB.Bc', '.ccc.'],
  ],
  palette: { ...EEL, c: '#9ff4ff' },
  frameSeconds: 0.2,
  radius: 2.4,
  spin: 3,
});

// Where a surge will end up (harmless): a pair of sparks on the wall.
defineBulletArt('eelPlug', {
  frames: [
    ['y...y', '.y.y.', '..y..', '.y.y.', 'y...y'],
    ['.y.y.', 'y...y', '.....', 'y...y', '.y.y.'],
  ],
  palette: EEL,
  radius: 1,
  frameSeconds: 0.1,
});

export const WRACKEEL_ATTACKS = {
  // Zigzag: little eels come in from the right, each darting up and down in a
  // zigzag that flips on a steady beat (they blink first). One in two starts
  // on your row.
  eelZig(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let made = 0;
    let next = 0.2;
    const darts = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && made < 14 && t < 5.2) {
          next = t + 0.36;
          const y = made % 3 !== 2
            ? clamp(soul.y + rand(-10, 10), box.y + 8, box.y + box.h - 8)
            : rand(box.y + 8, box.y + box.h - 8);
          const dart = new Shot({ x: box.x + box.w - 3, y, vx: -66, vy: 0, warn: 0.5, art: 'eelDart', life: 3.4 });
          dart.dir = made % 2 === 0 ? 1 : -1;
          dart.flip = 0;
          bullets.push(dart);
          darts.push(dart);
          made++;
        }
        for (const dart of darts) {
          if (dart.age < dart.warn) continue;
          dart.flip -= dt;
          if (dart.flip <= 0) {
            dart.flip = rand(0.3, 0.42);
            dart.dir = Math.random() < 0.9 && Math.abs(soul.y - dart.y) > 6 ? Math.sign(soul.y - dart.y) : dart.dir * -1;
          }
          if (dart.y < box.y - 3) dart.dir = 1;
          if (dart.y > box.y + box.h + 3) dart.dir = -1;
          dart.vy = dart.dir * 66;
        }
      },
    };
  },

  // Chain: four nodes light up in the box and a bolt jumps down the chain, link
  // by link, each link flickering thin before it goes off. The first node is
  // right by you. Each node it reaches spits sparks, and the last throws one
  // more link at wherever you've got to.
  eelChain(box, density, { Shot, Line, rand, clamp }) {
    let t = 0;
    let rounds = 0;
    let next = 0.2;
    let bursts = [];
    let later = [];
    const chase = { x: 0, y: 0 };
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        chase.x = soul.x;
        chase.y = soul.y;
        for (const item of later) if (t >= item.at) { item.done = true; item.run(); }
        later = later.filter((item) => !item.done);
        if (t >= next && rounds < 3 && t < 4.4) {
          next = t + 1.9;
          rounds++;
          const pts = [{ x: clamp(soul.x + rand(-7, 7), box.x + 6, box.x + box.w - 6), y: clamp(soul.y + rand(-7, 7), box.y + 6, box.y + box.h - 6) }];
          let tries = 0;
          while (pts.length < 4 && tries < 40) {
            tries++;
            const p = { x: rand(box.x + 6, box.x + box.w - 6), y: rand(box.y + 6, box.y + box.h - 6) };
            const last = pts[pts.length - 1];
            if (Math.hypot(p.x - last.x, p.y - last.y) > 28) pts.push(p);
          }
          pts.forEach((p, i) => {
            bullets.push(new Shot({ x: p.x, y: p.y, harmless: true, life: 0.55 + i * 0.34 + 0.1, art: 'eelNode' }));
          });
          for (let i = 0; i < pts.length - 1; i++) {
            const a = pts[i];
            const b = pts[i + 1];
            const warn = 0.55 + i * 0.34;
            bullets.push(new Line({
              x: a.x, y: a.y, angle: Math.atan2(b.y - a.y, b.x - a.x), length: Math.hypot(b.x - a.x, b.y - a.y),
              thickness: 3, warn, life: 0.26, color: '#fff06a', glow: '#8ff0ff',
            }));
            bursts.push({ at: t + warn + 0.05, x: b.x, y: b.y });
          }
          // The last node throws one more link, at where you've got to.
          const end = pts[pts.length - 1];
          later.push({ at: t + 1.0, run: () => {
            bullets.push(new Line({
              x: end.x, y: end.y, angle: Math.atan2(chase.y - end.y, chase.x - end.x), length: 150,
              thickness: 3, warn: 0.55, life: 0.26, color: '#fff06a', glow: '#8ff0ff',
            }));
          } });
        }
        for (const b of bursts) {
          if (t < b.at) continue;
          b.done = true;
          const turn = rand(0, Math.PI / 3);
          for (let k = 0; k < 6; k++) {
            const a = turn + (k / 6) * Math.PI * 2;
            bullets.push(new Shot({ x: b.x, y: b.y, vx: Math.cos(a) * 40, vy: Math.sin(a) * 40, art: 'eelSpark', life: 1.2 }));
          }
        }
        bursts = bursts.filter((b) => !b.done);
      },
    };
  },

  // Coil: a ring of curls gathers round where you are and closes in, turning, with a
  // gap in it. Slip into the gap and ride round with it. Three rings, the
  // second turns the other way.
  eelCoil(box, density, { Shot, rand }) {
    let t = 0;
    let made = 0;
    // A bead steers itself round its ring (so its path can be read ahead).
    class Bead extends Shot {
      constructor(opts, ring, base) {
        super(opts);
        this.ring = ring;
        this.base = base;
        this.place();
      }

      place() {
        const R = Math.max(42 - Math.max(0, this.age - 0.5) * 18, 0);
        const a = this.base + this.ring.rot + this.ring.dir * 0.7 * this.age;
        this.x = this.ring.cx + Math.cos(a) * R;
        this.y = this.ring.cy + Math.sin(a) * R;
      }

      update(dt) {
        this.age += dt;
        this.place();
      }
    }
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (made < 3 && t >= 0.2 + made * 2.3) {
          const ring = { rot: rand(0, Math.PI * 2), dir: made === 1 ? -1 : 1, cx: soul.x, cy: soul.y };
          const gap = rand(0, Math.PI * 2);
          const count = 17;
          for (let i = 0; i < count; i++) {
            const a = (i / count) * Math.PI * 2;
            // The gap is a fifth of the way round.
            const off = Math.abs(((a - gap + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
            if (off > Math.PI - 0.68) continue;
            bullets.push(new Bead({ x: ring.cx, y: ring.cy, art: 'eelCoil', warn: 0.5, life: 2.15 }, ring, a));
          }
          made++;
        }
      },
    };
  },

  // Surge: three of the box's five rows go off like a live wire (the plugs
  // spark at the wall and the line flickers first). Then three of the five
  // columns. Then the rows again. One of them is always yours.
  eelSurge(box, density, { Shot, Line, rand }) {
    let t = 0;
    let waves = 0;
    const lanes = [0, 1, 2, 3, 4];
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (waves >= 3 || t < 0.2 + waves * 2.2) return;
        const rows = waves !== 1;
        const at = rows ? soul.y : soul.x;
        const lo = rows ? box.y : box.x;
        const size = rows ? box.h : box.w;
        const pos = (k) => lo + 8 + k * ((size - 16) / 4);
        // The lane nearest you is lit, plus two more.
        const mine = lanes.reduce((a, b) => (Math.abs(pos(b) - at) < Math.abs(pos(a) - at) ? b : a));
        const others = lanes.filter((k) => k !== mine).sort(() => Math.random() - 0.5).slice(0, 2);
        const warn = 0.85;
        for (const k of [mine, ...others]) {
          const p = pos(k);
          if (rows) {
            bullets.push(new Line({ x: box.x - 4, y: p, angle: 0, length: box.w + 8, thickness: 5, warn, life: 0.34, color: '#fff06a', glow: '#8ff0ff' }));
            bullets.push(new Shot({ x: box.x + 2, y: p, harmless: true, life: warn + 0.3, art: 'eelPlug' }));
            bullets.push(new Shot({ x: box.x + box.w - 2, y: p, harmless: true, life: warn + 0.3, art: 'eelPlug' }));
          } else {
            bullets.push(new Line({ x: p, y: box.y - 4, angle: Math.PI / 2, length: box.h + 8, thickness: 5, warn, life: 0.34, color: '#fff06a', glow: '#8ff0ff' }));
            bullets.push(new Shot({ x: p, y: box.y + 2, harmless: true, life: warn + 0.3, art: 'eelPlug' }));
            bullets.push(new Shot({ x: p, y: box.y + box.h - 2, harmless: true, life: warn + 0.3, art: 'eelPlug' }));
          }
        }
        waves++;
      },
    };
  },
};

// Aimed shots on top, so standing still or running one way is never safe (see snipes.js).
WRACKEEL_ATTACKS.eelZig = withSnipes(WRACKEEL_ATTACKS.eelZig, { art: 'eelDart', count: 4, first: 1.0, every: 1.2, lead: 0.8 });
WRACKEEL_ATTACKS.eelChain = withSnipes(WRACKEEL_ATTACKS.eelChain, { art: 'eelSpark' });
