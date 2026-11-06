import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { withSnipes } from './snipes.js';

// The Clover Snail's attacks. Slow, sleepy and green: slow walls of slime
// with a gap, a spinning pinwheel of four-leaf clovers from its shell, and
// drifting Z's from a snail who keeps nodding off (a few big ones, now and
// then). It stands to the right of the box.

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

export const CLOVER_SNAIL_ATTACKS = {
  // Trail: a wall of slime, blob by blob, creeps across the box from the
  // right with a gap in it. It blinks first. Each new gap is a good way
  // up or down from the last. Four walls.
  snailTrail(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let walls = 0;
    let next = 0.2;
    let gap = null;
    return {
      duration: 7.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || walls >= 5 || t > 5.8) return;
        next = t + 1.28;
        const lo = box.y + 14;
        const hi = box.y + box.h - 14;
        if (gap === null) gap = clamp(soul.y, lo, hi);
        else {
          const dir = gap < soul.y ? 1 : -1;
          gap = clamp(gap + dir * rand(14, 26) * (rand(0, 1) < 0.8 ? 1 : -1), lo, hi);
        }
        for (let y = box.y + 4; y <= box.y + box.h - 4; y += 7) {
          if (Math.abs(y - gap) < 14) continue;
          bullets.push(new Shot({ x: box.x + box.w + 6, y, vx: -42, warn: 0.45, art: 'snailSlime', life: 3.4 }));
        }
        walls++;
      },
    };
  },

  // Clover: the shell lights and a pinwheel of four-leaf clovers turns out of
  // it, three arms, sweeping up and down across the box and back. When it has
  // wound down, two showers of loose leaves come down from the top, a
  // blink first, aimed along your column and either side of it.
  snailClover(box, density, { Shot, clamp, rand }) {
    let t = 0;
    let next = 0.4;
    let showers = 0;
    const ox = box.x + box.w + 2;
    const oy = box.y + box.h / 2;
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= 3.9 + showers * 1.2 && showers < 2) {
          showers++;
          for (const off of [-22, -4, 14]) {
            const x = clamp(soul.x + off + rand(-3, 3), box.x + 6, box.x + box.w - 6);
            bullets.push(new Shot({ x, y: box.y + 4, vx: 0, vy: 58, warn: 0.5, art: 'snailLeaf', life: 2.2 }));
          }
        }
        if (t < next || t > 3.5) return;
        next = t + 0.085;
        for (let arm = 0; arm < 3; arm++) {
          const a = Math.PI + Math.sin(t * 1.05) * 1.2 + (arm - 1) * 0.7;
          bullets.push(new Shot({ x: ox, y: oy, vx: Math.cos(a) * 64, vy: Math.sin(a) * 64, art: 'snailLeaf', life: 2.1 }));
        }
      },
    };
  },

  // Zzz: it nods off and the Z's drift out, bobbing as they come, most of them
  // near your row; every fourth is a big slow one. A lot of small ones.
  snailZzz(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let made = 0;
    let next = 0.2;
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || t > 5.6) return;
        next = t + 0.34;
        const big = made % 4 === 3;
        const y = clamp(soul.y + rand(-28, 28), box.y + 6, box.y + box.h - 6);
        bullets.push(new Shot({
          x: box.x + box.w + 7, y, vx: big ? -34 : -50, warn: big ? 0.4 : 0.15,
          wobble: { amplitude: big ? 5 : 8, frequency: 2.6 + (made % 3) * 0.5 },
          art: big ? 'snailZBig' : 'snailZ', life: 3.8,
        }));
        made++;
      },
    };
  },
};

// Aimed slime on top, so standing still or running one way is never safe (see snipes.js).
CLOVER_SNAIL_ATTACKS.snailTrail = withSnipes(CLOVER_SNAIL_ATTACKS.snailTrail, { art: 'snailSlime' });
CLOVER_SNAIL_ATTACKS.snailClover = withSnipes(CLOVER_SNAIL_ATTACKS.snailClover, { art: 'snailSlime', count: 4, first: 1.0, every: 1.25 });
CLOVER_SNAIL_ATTACKS.snailZzz = withSnipes(CLOVER_SNAIL_ATTACKS.snailZzz, { art: 'snailZ' });
