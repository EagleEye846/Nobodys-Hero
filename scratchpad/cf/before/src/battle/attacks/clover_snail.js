import { defineBulletArt, Shot } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { Zone, healer } from './coastKit.js';
import { stillness } from './underShapes.js';

// The Clover Snail's attacks. Slow, sleepy and green, and its sleepiness is
// catching:
//   - Trail: it crawls after you leaving a stinging slime trail that dries
//     from the oldest end. Go round the tail.
//   - Lucky clover: drifts of three-leaf clovers sting, but the gap in each
//     drift holds a four-leaf one that does you good. Count the leaves.
//   - Forty winks: its Z's float past while you move, and drift in on you
//     the moment you stand still.
// It stands to the right of the box.

const SNAIL = { k: '#2c3a28', g: '#6bbf5a', G: '#3e8a40', L: '#a6e07c', l: '#d4f5a8', d: '#2a6a34', y: '#ffd93b', z: '#b8d8ff', Z: '#6a9ad8', w: '#ffffff', s: '#cfe9a0', S: '#9ccf6a' };

// A blob of slime, glossy.
defineBulletArt('snailSlime', {
  frames: [['..sss..', '.sswss.', 'ssswsss', 'sSSssSs', '.SSSSS.']],
  palette: SNAIL,
  radius: 3.4,
  frameSeconds: 0.3,
});

// A four-leaf clover.
function clover() {
  const g = new Pix(11, 11);
  for (const [ox, oy] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) {
    g.disc(5 + ox, 5 + oy, 2.4, 2.4, 'L');
    g.set(5 + ox - 1, 5 + oy - 1, 'l');
  }
  g.line(3, 3, 7, 7, 'd');
  g.line(7, 3, 3, 7, 'd');
  g.set(5, 5, 'y');
  g.outline('G');
  return g.rows();
}
defineBulletArt('snailLeaf', { frames: [clover()], palette: SNAIL, radius: 3.6, spin: 3 });

// A drifting Z, small and big.
function zed(size) {
  const g = new Pix(size, size);
  g.line(0, 0, size - 1, 0, 'z', size > 8 ? 2 : 1);
  g.line(size - 1, 0, 0, size - 1, 'z', size > 8 ? 2 : 1);
  g.line(0, size - 1, size - 1, size - 1, 'z', size > 8 ? 2 : 1);
  g.outline('Z');
  return g.rows();
}
defineBulletArt('snailZ', { frames: [zed(7)], palette: SNAIL, radius: 3, frameSeconds: 0.3 });
defineBulletArt('snailZBig', { frames: [zed(13)], palette: SNAIL, radius: 5.4, frameSeconds: 0.3 });

// A three-leaf clover (the ordinary, unlucky kind).
function trefoil() {
  const g = new Pix(11, 11);
  for (const [ox, oy] of [[0, -2.5], [-2.4, 1.6], [2.4, 1.6]]) {
    g.disc(5 + ox, 5 + oy, 2.4, 2.4, 'G');
    g.set(5 + ox - 1, 5 + oy - 1, 'g');
  }
  g.set(5, 5, 'd');
  g.outline('k');
  return g.rows();
}
defineBulletArt('snailTrefoil', { frames: [trefoil()], palette: SNAIL, radius: 3.4, spin: 1.5 });
// The lucky one, gold-edged and glinting.
defineBulletArt('snailLucky', { frames: [clover(), clover().map((r) => r.replace(/G/g, 'y'))], palette: SNAIL, radius: 4, frameSeconds: 0.15 });

// The snail itself, crawling (drawn crawling right): shell a four-leaf clover, eyes on stalks.
function crawler(stretch) {
  const g = new Pix(17, 11);
  g.disc(8, 8, 7 + stretch, 2, 'S');
  g.disc(7, 4, 4.4, 4.2, 'G');
  g.disc(7, 4, 2.6, 2.6, 'L');
  g.set(7, 4, 'y');
  g.line(14 + stretch, 7, 15 + stretch, 2, 's');
  g.set(15 + stretch, 1, 'k');
  g.outline('k');
  return g.rows();
}
defineBulletArt('snailHead', { frames: [crawler(0), crawler(1)], palette: SNAIL, radius: 4.5, rotate: true, frameSeconds: 0.4 });

export const CLOVER_SNAIL_ATTACKS = {
  // Trail: the snail crawls into the box and makes for you, slowly, leaving
  // a glistening trail of slime that stings to touch. The trail dries from
  // its oldest end, so the way past is round the tail, never across the
  // fresh bit. It turns slowly, so circle it.
  snailTrail(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    let t = 0;
    let head = null;
    let drop = 0;
    const DRY = 2.0;
    const slime = (x, y) => new Zone({
      x, y, r: 3.6, warn: 0, life: DRY,
      paint(ctx, z) {
        const fresh = 1 - z.age / DRY;
        ctx.fillStyle = fresh > 0.3 ? '#cfe9a0' : '#9ccf6a';
        ctx.globalAlpha *= 0.5 + fresh * 0.5;
        ctx.beginPath();
        ctx.arc(z.x, z.y, 3.6, 0, Math.PI * 2);
        ctx.fill();
        if (fresh > 0.5) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(Math.round(z.x) - 1, Math.round(z.y) - 2, 1, 1);
        }
      },
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!head) {
          const y = soul.y < box.y + box.h / 2 ? box.y + box.h - 10 : box.y + 10;
          head = new Shot({ x: box.x + box.w + 6, y, vx: -38, vy: 0, art: 'snailHead', warn: 0.5, homing: { target: soul, turn: 1.3 } });
          head.life = 6.6;
          bullets.push(head);
        }
        drop += dt;
        if (head.age > head.warn && drop >= T(0.1)) {
          drop = 0;
          bullets.push(slime(head.x - Math.cos(head.angle) * 5 + rand(-0.5, 0.5), head.y - Math.sin(head.angle) * 5));
        }
      },
    };
  },

  // Lucky clover: clovers blow across the patch in tall drifts, one drift
  // after another, with a gap in each. The ordinary three-leaf ones sting;
  // in every gap there's a four-leaf one, and catching it does you good.
  // Count the leaves, and follow the lucky one through.
  snailClover(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    let t = 0;
    let n = 0;
    let gapY = box.y + box.h / 2;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.3 + n * 1.15) && n < 5) {
          n++;
          // The gap moves a good way from the last one and away from your row.
          let y;
          let tries = 0;
          do {
            y = rand(box.y + 12, box.y + box.h - 12);
            tries++;
          } while (tries < 30 && (Math.abs(y - gapY) < 22 || Math.abs(y - soul.y) < 14));
          gapY = y;
          const x = box.x + box.w + 8;
          for (let cy = box.y + 4; cy < box.y + box.h; cy += 11) {
            if (Math.abs(cy - gapY) < 13) continue;
            bullets.push(new Shot({ x, y: cy, vx: -34, art: 'snailTrefoil', warn: 0.45, wobble: { amplitude: 3, frequency: 3 } }));
          }
          bullets.push(healer({ x, y: gapY, vx: -34, art: 'snailLucky', warn: 0.45 }, 30));
        }
      },
    };
  },

  // Forty winks: Z's drift out of the dozing snail. While you keep moving
  // they just float across; the moment you stand still they all turn and
  // drift toward you, because sleepiness is catching. Every few seconds it
  // yawns and lets a big slow Z go. Don't join in.
  snailZzz(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const still = stillness(14);
    const mood = { still: 0 };
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul, real = dt / density) => {
        t += dt;
        mood.still = still(real, soul);
        if (t >= T(0.2 + n * 0.26) && n < 24) {
          n++;
          const big = n % 6 === 0;
          const z = new DozyZ({ x: box.x + box.w + 6, y: rand(box.y + 6, box.y + box.h - 6), vx: -rand(26, 38), vy: rand(-6, 6), art: big ? 'snailZBig' : 'snailZ', warn: 0.25, life: 5 });
          z.soul = soul;
          z.mood = mood;
          bullets.push(z);
        }
      },
    };
  },
};

// A Z that drifts on its way, and homes on you while you stand still.
class DozyZ extends Shot {
  update(dt, box) {
    if (this.age >= this.warn && this.mood.still > 0.2) {
      const a = Math.atan2(this.soul.y - this.y, this.soul.x - this.x);
      this.vx += (Math.cos(a) * 70 - this.vx) * Math.min(1, dt * 3);
      this.vy += (Math.sin(a) * 70 - this.vy) * Math.min(1, dt * 3);
    }
    super.update(dt, box);
  }
}
