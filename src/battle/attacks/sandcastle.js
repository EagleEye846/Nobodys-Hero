import { defineBulletArt } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';

// The Sandcastle's attacks. A living sandcastle, very pleased with itself,
// and quite sure the tide is not coming: so it fires sand from its turrets in
// volleys (pellets and clods, aimed at where you were), sweeps its lolly-stick
// flag across the box (a flagpole turning round a post, the pennant on the
// end), and sends the moat out along the floor in a long wave that you have
// to jump (the wave has a gap in it, and it's slow enough to see coming). It
// stands to the right of the box, so everything comes from that side.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The attack's own clock (`t`) runs `density`
// times faster than the seconds on the wall, hence the `T` below.

const SAND = { k: '#3a2e1c', s: '#e8cf8e', S: '#caa968', d: '#a88848', l: '#f6e6b0', m: '#9a7c44', w: '#5aa0c8', W: '#a8d8ec', e: '#ffffff', r: '#d8453a', R: '#9c2a2a', f: '#e0d4b0', c: '#f4dcdc', C: '#e49aa0' };


// A pellet of sand: a tight little ball, and a clod (bigger, lumpier).
defineBulletArt('castlePellet', {
  frames: [art(6, 6, (p) => { p.ellipse(2.5, 2.5, 2.2, 2.2, 's'); p.set(3, 3, 'S'); p.set(1, 1, 'l'); })],
  palette: SAND,
  radius: 2.4,
  spin: 3,
});
defineBulletArt('castleClod', {
  frames: [art(10, 10, (p) => { p.ellipse(4.5, 4.5, 4.2, 4, 's'); p.ellipse(5.5, 5.5, 2.8, 2.4, 'S'); p.set(2, 2, 'l'); p.set(3, 2, 'l'); p.set(6, 3, 'd'); p.set(3, 6, 'd'); })],
  palette: SAND,
  radius: 4.2,
  spin: 2,
});
// A puff where a turret fires.
defineBulletArt('castlePuff', {
  frames: [['..lll..', '.lssSl.', 'lsSSssl', '.lsSsl.', '..lll..']],
  palette: SAND,
  radius: 1,
});

// A cresting wave of moat water along the floor: a rounded curl with foam.
defineBulletArt('castleWave', {
  frames: [
    art(14, 10, (p) => { p.ellipse(7, 7, 6.6, 3.6, 'w'); p.ellipse(8, 3.6, 4, 3.2, 'w'); p.ellipse(7, 7.5, 5, 1.4, 'W'); p.set(4, 3, 'e'); p.set(10, 2, 'e'); p.set(11, 3, 'e'); }),
    art(14, 10, (p) => { p.ellipse(7, 7, 6.6, 3.6, 'w'); p.ellipse(6, 3.2, 3.6, 3, 'w'); p.ellipse(7, 7.5, 5, 1.4, 'W'); p.set(3, 3, 'e'); p.set(8, 1, 'e'); p.set(9, 2, 'e'); }),
  ],
  palette: SAND,
  radius: 4.6,
  frameSeconds: 0.25,
});

// The flagpole: a lolly stick turning on a post at the box's edge, with a red
// pennant on the end. It flashes in its first place, then sweeps. (Not a Line,
// because its end swings far outside the box and must stay.)
class FlagPole {
  constructor({ x, y, angle = Math.PI, length = 96, warn = 0.9, life = 5.4 }) {
    Object.assign(this, { x, y, angle, length, warn, life });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get active() {
    return this.age >= this.warn && this.age < this.warn + this.life;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.warn + this.life + 0.25;
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const dx = Math.cos(this.angle);
    const dy = Math.sin(this.angle);
    const along = Math.max(0, Math.min(this.length, (px - this.x) * dx + (py - this.y) * dy));
    return Math.hypot(px - (this.x + dx * along), py - (this.y + dy * along)) - 1.8;
  }

  draw(ctx) {
    ctx.save();
    const dx = Math.cos(this.angle);
    const dy = Math.sin(this.angle);
    const ex = this.x + dx * this.length;
    const ey = this.y + dy * this.length;
    if (this.age < this.warn) {
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.25 : 0.65;
      ctx.strokeStyle = '#e0d4b0';
      ctx.setLineDash([3, 2]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.restore();
      return;
    }
    const over = this.age - (this.warn + this.life);
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
    ctx.lineCap = 'round';
    for (const [color, width] of [['#3a2e1c', 4], ['#e0d4b0', 2]]) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    }
    // The pennant: a red triangle streaming behind the end as it swings.
    const nx = -dy;
    const ny = dx;
    const wave = Math.sin(this.age * 9) * 1.5;
    ctx.fillStyle = '#d8453a';
    ctx.strokeStyle = '#3a2e1c';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - dx * 9 + nx * (5 + wave), ey - dy * 9 + ny * (5 + wave));
    ctx.lineTo(ex - dx * 9 - nx * (1 - wave), ey - dy * 9 - ny * (1 - wave));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

export const SANDCASTLE_ATTACKS = {
  // Turret volley: the towers fire sand in volleys (a little puff shows
  // first): a fan of pellets aimed at you from the high turret, a clod lobbed
  // on an arc from the low one.
  castleVolley(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.2);
    let n = 0;
    let firing = [];
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && n < 5 && t < T(5.4)) {
          n++;
          next = t + T(1.2);
          const hi = { x: box.x + box.w + 6, y: box.y + rand(4, 22) };
          const lo = { x: box.x + box.w + 6, y: box.y + box.h - rand(4, 20) };
          for (const at of [hi, lo]) bullets.push(new Shot({ x: at.x - 2, y: at.y, harmless: true, life: 0.55, art: 'castlePuff' }));
          firing.push({ at: t + T(0.55), hi, lo, aim: { x: soul.x, y: soul.y }, n });
        }
        for (const f of firing) {
          if (t < f.at) continue;
          f.done = true;
          // The fan from the high turret: odd count, the middle on where you stood.
          const base = Math.atan2(f.aim.y - f.hi.y, f.aim.x - f.hi.x);
          for (let i = -2; i <= 2; i++) {
            const a = base + i * 0.17;
            bullets.push(new Shot({ x: f.hi.x, y: f.hi.y, vx: Math.cos(a) * 54, vy: Math.sin(a) * 54, art: 'castlePellet', life: 3.5 }));
          }
          // The clod from the low turret: an arc that comes down near you.
          const dx = f.aim.x - f.lo.x;
          const flight = 1;
          bullets.push(new Shot({ x: f.lo.x, y: f.lo.y, vx: clamp(dx / flight, -80, -30), vy: clamp((f.aim.y - f.lo.y) / flight - 0.5 * 90 * flight, -90, 20), gravity: 90, art: 'castleClod', life: 2.6 }));
        }
        firing = firing.filter((f) => !f.done);
      },
    };
  },

  // Flag sweep: the flagpole swings round like a gate, its pennant a hazard on
  // the end, a long rope of sand streaming from it, and it sweeps back again.
  // The pole flashes in its first position, then goes.
  castleFlag(box, density) {
    const T = (s) => s * density;
    let t = 0;
    let made = false;
    let poles = [];
    return {
      duration: 7.2,
      update: (dt, bullets) => {
        t += dt;
        if (!made) {
          made = true;
          // Two poles, one from the top corner, one from the bottom, turning opposite ways.
          for (const [y, dir, phase] of [[box.y + 6, 1, 0], [box.y + box.h - 6, -1, Math.PI * 0.9]]) {
            const x = box.x + box.w + 4;
            const line = new FlagPole({ x, y, angle: Math.PI, length: 96, warn: 0.9, life: 5.4 });
            poles.push({ x, y, dir, phase, line });
            bullets.push(line);
          }
        }
        const swingT = Math.max(0, t - T(0.9)) / density;
        for (const p of poles) {
          // A gate swinging over a wide arc, to and fro.
          p.line.angle = Math.PI + p.dir * 1.25 * Math.sin(1.0 * swingT + p.phase);
        }
      },
    };
  },

  // Moat wave: the moat water comes out along the floor in a long wave, a
  // wall of curling breakers with a gap or two, and rolls the length of the
  // box. Two waves run in from the right, one after another, then one more
  // from the left. Jump the gap.
  castleMoat(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.2);
    let n = 0;
    const SLOTS = 8;
    const slotY = (i) => box.y + 7 + (i * (box.h - 14)) / (SLOTS - 1);
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && n < 4 && t < T(5.4)) {
          n++;
          next = t + T(1.5);
          const mine = Math.round(((soul.y - box.y - 7) / (box.h - 14)) * (SLOTS - 1));
          // The gap is two slots wide and never where you are.
          let gap = Math.floor(rand(0, SLOTS - 1));
          if (gap === mine || gap + 1 === mine) gap = mine < SLOTS / 2 ? SLOTS - 2 : 0;
          const fromRight = n !== 3;
          const x = fromRight ? box.x + box.w + 8 : box.x - 8;
          const vx = fromRight ? -40 : 40;
          for (let i = 0; i < SLOTS; i++) {
            if (i === gap || i === gap + 1) continue;
            bullets.push(new Shot({ x, y: slotY(i), vx, art: 'castleWave', life: 4.5, warn: 0.2 }));
          }
          // A thin foam line just before it arrives, marking the gap's edges.
          bullets.push(new Shot({ x: fromRight ? box.x + box.w - 4 : box.x + 4, y: (slotY(gap) + slotY(gap + 1)) / 2, harmless: true, life: 0.6, art: 'castlePuff' }));
        }
      },
    };
  },
};
