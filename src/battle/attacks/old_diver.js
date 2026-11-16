import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { PathShot, Deco, Guide } from './coastKit.js';

// The Old Diver's attacks. An empty diving suit that walks the wrecks as if
// somebody were still inside it with a job to finish:
//   - The helmet lamp: it can only see what's in its lamp. If the sweeping
//     beam falls on you, it stops, flashes, and throws its harpoon down it.
//   - Lead boots: it walks across the floor toward you one heavy step at a
//     time, and every step shakes rivets down off the deck above.
//   - The air hose: air runs down a perished hose laid across the box, and
//     each patch bursts in turn as the air reaches it.
// It stands to the right of the box.

const DIVE = { S: '#9a7a4a', I: '#c8ccd4', h: '#3a463c', H: '#5a6e5a', b: '#b88a3a', y: '#e8c868', G: '#0a1a1a', g: '#7af0b0', w: '#ffffff', c: '#9ad8ff', C: '#5a9ac8', k: '#14181c', n: '#6c7280', N: '#4a4e58', d: '#2a3a40', m: '#8a8068', M: '#5e5846' };

// The harpoon, pointing right: a long shaft, a barbed iron head.
defineBulletArt('diverHarpoon', {
  frames: [['.........I.', 'SSSSSSSSIII', '.........I.']],
  palette: DIVE,
  radius: 2.2,
  rotate: true,
});

// A bead of its rope: pulled taut behind the harpoon, it cuts too.
defineBulletArt('diverRope', { frames: [['SS']], palette: DIVE, radius: 1 });

// The nozzle at the end of the air hose, glowing faint green.
defineBulletArt('diverNozzle', {
  frames: [
    ['..bbb..', '.byyyb.', 'bbyGgbb', '.byGGb.', '..bbb..'],
    ['..bbb..', '.byyyb.', 'bbyGGbb', '.byGgb.', '..bbb..'],
  ],
  palette: DIVE,
  radius: 3,
  frameSeconds: 0.18,
});

// A length of hose it leaves behind: a ribbed grey-green ring.
defineBulletArt('diverSeg', {
  frames: [['.hhh.', 'hHHHh', 'hHhHh', 'hHHHh', '.hhh.']],
  palette: DIVE,
  radius: 2.4,
});

// A bubble (harmless until it pops).
function bubble(size) {
  const c = (size - 1) / 2;
  const g = new Pix(size, size);
  g.disc(c, c, c, c, 'C');
  g.disc(c, c, c - 1, c - 1, 'c', 'C');
  g.disc(c, c, c - 1.6, c - 1.6, '.');
  g.set(c - 1, c - 1, 'w');
  g.set(c - 1, c - 2, 'w');
  g.set(c + 1, c + 1, 'c');
  return g.rows();
}
defineBulletArt('diverBubble', { frames: [bubble(9), bubble(10)], palette: DIVE, radius: 1, frameSeconds: 0.2 });

// What it pops into: a pellet of spray.
defineBulletArt('diverPellet', {
  frames: [['.w.', 'wcw', '.w.'], ['.c.', 'cwc', '.c.']],
  palette: DIVE,
  radius: 1.8,
  frameSeconds: 0.1,
});

// The anchor: shaded iron, a ring at the top, a stock across, two curved
// arms ending in flukes, rust where the sea has had it.
function anchorArt() {
  const g = new Pix(15, 16);
  g.disc(7, 2, 2.2, 2.2, 'I');
  g.disc(7, 2, 0.9, 0.9, 'k', 'I');
  g.rect(3, 5, 9, 2, 'I');
  g.rect(3, 6, 9, 1, 'n');
  g.rect(6, 5, 3, 10, 'I');
  g.rect(8, 5, 1, 10, 'n');
  g.line(1, 9, 3, 13, 'I', 2);
  g.line(3, 13, 7, 15, 'n', 2);
  g.line(13, 9, 11, 13, 'I', 2);
  g.line(11, 13, 7, 15, 'n', 2);
  g.rect(0, 8, 3, 2, 'I');
  g.rect(12, 8, 3, 2, 'I');
  g.set(7, 11, 'm');
  g.set(4, 13, 'M');
  g.set(9, 8, 'm');
  g.outline('k');
  return g.rows();
}
defineBulletArt('diverAnchor', { frames: [anchorArt()], palette: DIVE, hitbox: { w: 9, h: 13 } });

// Where it will land (harmless): a pale ring of stirred silt on the floor, blinking.
defineBulletArt('diverShadow', {
  frames: [['..IIIII..', '.I.....I.', 'I..mmm..I', '.I.....I.', '..IIIII..'], ['.........', '..mmmmm..', '.m.....m.', '..mmmmm..', '.........']],
  palette: DIVE,
  radius: 1,
  frameSeconds: 0.12,
});

// A puff of silt along the floor.
defineBulletArt('diverSilt', {
  frames: [['.mm.', 'mMMm', 'mMMm', '.mm.'], ['.mm.', 'mMmm', 'mmMm', '.mm.']],
  palette: DIVE,
  radius: 2.2,
  frameSeconds: 0.14,
});

// A small hurting bubble, burst out of a patch in the hose.
defineBulletArt('diverAirBubble', { frames: [bubble(7), bubble(6)], palette: DIVE, radius: 2.6, frameSeconds: 0.15 });
// A rivet shaken loose off the wreck overhead, falling.
defineBulletArt('diverRivet', { frames: [['.nn.', 'nNNn', '.NN.', '.N..']], palette: DIVE, radius: 2, spin: 4 });
// The suit walking, seen from the side, facing left: brass helmet, round window, lead boots.
function walker(stride) {
  const g = new Pix(15, 21);
  g.disc(7, 5, 5, 5, 'b');
  g.disc(5, 5, 2.6, 2.6, 'G');
  g.set(4, 4, 'g');
  g.rect(3, 10, 9, 6, 'm');
  g.rect(3, 10, 9, 1, 'M');
  g.rect(4 - stride, 16, 3, 3, 'm');
  g.rect(8 + stride, 16, 3, 3, 'm');
  g.rect(3 - stride, 19, 5, 2, 'N');
  g.rect(8 + stride, 19, 5, 2, 'N');
  g.outline('k');
  return g.rows();
}
defineBulletArt('diverWalker', { frames: [walker(0), walker(1)], palette: DIVE, hitbox: { w: 11, h: 18 }, radius: 5, frameSeconds: 0.3 });
// A canvas patch on the hose, about to give (harmless).
defineBulletArt('diverPatch', { frames: [['mmmm', 'mwmm', 'mmwm', 'mmmm'], ['MMMM', 'MmMM', 'MMmM', 'MMMM']], palette: DIVE, radius: 1, frameSeconds: 0.15 });

// The helmet lamp's beam: a pale cone from (x, y) along angle(k), harmless.
class Beam {
  constructor({ x, y, angle, spread, life, warn = 0 }) {
    Object.assign(this, { x, y, angle, spread, life, warn });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.flash = 0;
  }

  update(dt) {
    this.age += dt;
    this.flash = Math.max(0, this.flash - dt);
  }

  isGone() {
    return this.age >= this.life;
  }

  edgeDistance() {
    return Infinity;
  }

  covers(px, py) {
    const a = this.angle(this.age);
    const d = Math.atan2(py - this.y, px - this.x) - a;
    return Math.abs(Math.atan2(Math.sin(d), Math.cos(d))) < this.spread;
  }

  draw(ctx) {
    const a = this.angle(this.age);
    ctx.save();
    ctx.globalAlpha = this.flash > 0 ? 0.45 : 0.2;
    const left = this.life - this.age;
    if (left < 0.25) ctx.globalAlpha *= left / 0.25;
    ctx.fillStyle = this.flash > 0 ? '#ffffff' : '#e8c868';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + Math.cos(a - this.spread) * 140, this.y + Math.sin(a - this.spread) * 140);
    ctx.lineTo(this.x + Math.cos(a + this.spread) * 140, this.y + Math.sin(a + this.spread) * 140);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

export const OLD_DIVER_ATTACKS = {
  // The helmet lamp: it can only see what's in its lamp. The beam sweeps the
  // box back and forth; if it falls on you, it stops dead, flashes, and the
  // diver throws its harpoon straight down the beam at where you were. Keep
  // out of the light, and the moment it finds you, step off the line.
  diverLamp(box, density, { Shot }) {
    const x = box.x + box.w + 8;
    const y = box.y + box.h / 2;
    const SPREAD = 0.22;
    let real = 0;
    let beam = null;
    let base = 0;
    let swing = 0;
    let paused = 0;
    let cool = 0;
    let throws = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        const step = dt / density;
        real += step;
        if (!beam) {
          beam = new Beam({ x, y, spread: SPREAD, life: 6.8, angle: () => Math.PI + base });
          bullets.push(beam);
        }
        cool -= step;
        if (paused > 0) {
          paused -= step;
        } else {
          swing += step * 1.3;
          base = Math.sin(swing) * 0.78;
        }
        if (paused <= 0 && cool <= 0 && real > 0.5 && throws < 6 && beam.covers(soul.x, soul.y)) {
          throws++;
          paused = 0.6;
          cool = 0.75;
          beam.flash = 0.45;
          const aim = Math.atan2(soul.y - y, soul.x - x);
          bullets.push(new Guide({ x, y, angle: aim, length: 150, warn: 0.38, color: '#e8c868' }));
          bullets.push(new Shot({ x, y, vx: Math.cos(aim) * 230, vy: Math.sin(aim) * 230, art: 'diverHarpoon', warn: 0.38, life: 1 }));
          // And two more a beat later, either side of the first.
          for (const o of [-0.16, 0.16]) bullets.push(new Shot({ x, y, vx: Math.cos(aim + o) * 230, vy: Math.sin(aim + o) * 230, art: 'diverHarpoon', warn: 0.55, life: 1 }));
        }
      },
    };
  },

  // Lead boots: the empty suit walks into the box and across the floor
  // toward you, one slow, heavy step at a time. Every time a boot comes
  // down, the whole wreck shakes, and rivets drop off the deck above. The
  // boot lifts first. Everything happens on the step.
  diverBoots(box, density, { Shot, rand }) {
    const STEP = 0.6;
    const STRIDE = 10;
    let real = 0;
    let n = 0;
    let suit = null;
    let from = null;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (!suit) {
          from = { x: box.x + box.w + 6, y: box.y + box.h - 11 };
          suit = new Shot({ x: from.x, y: from.y, art: 'diverWalker', warn: 0.3 });
          suit.life = 6.6;
          bullets.push(suit);
        }
        if (real >= 0.5 + n * STEP && n < 10) {
          n++;
          // One step toward you along the floor.
          const dir = Math.sign(soul.x - suit.x) || -1;
          const to = Math.min(Math.max(suit.x + dir * STRIDE, box.x + 6), box.x + box.w - 6);
          const fx = suit.x;
          bullets.push(new PathShot({ art: 'diverShadow', harmless: true, life: STEP * 0.5, path: () => ({ x: to, y: box.y + box.h - 2 }) }));
          // The suit moves by hand over the step.
          suit.stepFrom = fx;
          suit.stepTo = to;
          suit.stepAt = real;
          // Rivets fall on the thump: one over you, two more.
          const xs = [soul.x, soul.x + rand(8, 14), soul.x - rand(8, 14), rand(box.x + 6, box.x + box.w - 6), rand(box.x + 6, box.x + box.w - 6)];
          for (const x of xs) {
            bullets.push(new Shot({ x, y: box.y + 2, harmless: true, life: STEP * 0.6, art: 'diverPellet' }));
            bullets.push(new Shot({ x, y: box.y - 2, vy: 90, gravity: 200, art: 'diverRivet', warn: STEP * 0.6, life: 1.4 }));
          }
        }
        if (suit.stepAt !== undefined) {
          const u = Math.min(1, (real - suit.stepAt) / (STEP * 0.6));
          suit.x = suit.stepFrom + (suit.stepTo - suit.stepFrom) * u;
          suit.y = from.y - Math.sin(Math.PI * u) * 3;
        }
      },
    };
  },

  // The air hose: a length of perished hose is laid across the box, patched
  // in four places. Air comes down it from the surface end to the suit, and
  // each patch bursts in turn as the air reaches it, in a puff of bubbles.
  // Follow the air along the hose and be clear of each patch as it goes.
  diverHose(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + n * 1.45) && n < 4) {
          n++;
          // The hose runs from the top of the box, through near where you are, out to the right.
          const top = { x: rand(box.x + 10, box.x + box.w - 10), y: box.y - 4 };
          const mid = { x: soul.x + rand(-6, 6), y: soul.y + rand(-6, 6) };
          const end = { x: box.x + box.w + 6, y: rand(box.y + 20, box.y + box.h - 6) };
          const along = (u) => {
            const v = 1 - u;
            const cx = 2 * mid.x - (top.x + end.x) / 2;
            const cy = 2 * mid.y - (top.y + end.y) / 2;
            return { x: v * v * top.x + 2 * u * v * cx + u * u * end.x, y: v * v * top.y + 2 * u * v * cy + u * u * end.y };
          };
          const LIFE = 2.4;
          bullets.push(new Deco({ life: LIFE, paint(ctx) {
            ctx.strokeStyle = '#2a3a40';
            ctx.lineWidth = 4;
            ctx.beginPath();
            for (let u = 0; u <= 1.001; u += 0.05) { const p = along(u); if (u) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }
            ctx.stroke();
            ctx.strokeStyle = '#5a6e5a';
            ctx.lineWidth = 2;
            ctx.stroke();
          } }));
          // The air running down it: a pale bead.
          const RUN = 1.3;
          bullets.push(new PathShot({ art: 'diverPellet', harmless: true, life: RUN, path: (k) => along(Math.min(1, k / RUN)) }));
          for (const u of [0.2, 0.4, 0.6, 0.8]) {
            const p = along(u);
            const at = RUN * u;
            bullets.push(new Shot({ x: p.x, y: p.y, harmless: true, life: at, art: 'diverPatch' }));
            for (let i = 0; i < 10; i++) {
              const a = (i / 10) * Math.PI * 2 + u * 3;
              bullets.push(new Shot({ x: p.x, y: p.y, vx: Math.cos(a) * 64, vy: Math.sin(a) * 64 - 8, art: 'diverAirBubble', warn: at, life: 1.3 }));
            }
          }
        }
      },
    };
  },
};
