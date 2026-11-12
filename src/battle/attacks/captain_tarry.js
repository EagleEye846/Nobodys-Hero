import { defineBulletArt, Line } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { withSnipes } from './snipes.js';

// Captain Tarry's attacks. The master of the brig Fair Return, who has not
// admitted that the ship went down, and keeps giving the orders he gave that
// night. Each attack is an order, and the crew carries it out, a hundred years
// late and exactly as told.
//
// ORDERS (his first phase): he draws the cutlass he doesn't want to use (a
//   blade that sweeps a wedge of the box, and thrown crescents); "Run out the
//   guns!" (a broadside from ports along his side, the matches blinking
//   first); "Hard a-port!" through the speaking-trumpet (arcs of sound aimed at
//   you, in threes); and the last of the rum, thrown (bottles that break into
//   green glass and a flame that catches on the spill).
// MUTINY (the second): the crew has stopped answering and he can't see why.
//   "Boarders!": ghosts of his own crew walk in over the rail in lines, each
//   with a letter held out; "Throw lines!": grappling ropes fan across the
//   box, haul taut and pull back.
// HEAVE TO (the third): the hat comes off. The deck tips and loose cargo rolls
//   downhill (the box itself leans, and everything in it slides), and "Make
//   port": the ship's bell tolls from the middle of the box, ring after ring
//   with two gaps in it, and little lights lift off the deck and go up.
// He stands to the right of the box, so most things come from that side.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The attack's own clock (`t`) runs `density`
// times faster than the seconds on the wall, hence the `T` below. A hazard
// moves itself on the real clock; a hand-carried bullet is placed by hand so
// the enemy's `speed` doesn't change its timing.

const P = {
  k: '#101a1c', c: '#5a7a6c', C: '#86aa9a', b: '#c8a040', B: '#80601c', s: '#d8e2e4', S: '#7a8c94', w: '#f4f8f4',
  r: '#b49c68', R: '#7a6234', e: '#9ae0c8', E: '#4a9c88', n: '#7a2a26', m: '#c8442a', o: '#ff9a2a', O: '#ffe070',
  q: '#303034', Q: '#6a6a74', g: '#a8bcb4', G: '#6c8680', v: '#7ac060', V: '#3a6a34', h: '#4a3a30', H: '#7a6048', d: '#33483f',
  f: '#c8d8d0', F: '#8ea49e', l: '#e8c890',
};

// A crescent of steel flung off the cutlass's swing.
const crescent = (flip) => art(13, 9, (p) => {
  p.ellipse(6, 8, 6, 7.4, 's');
  p.ellipse(6, 10, 5, 7, '.');
  p.line(1, 5, 6, 1, 'w');
  if (flip) p.set(11, 4, 'S');
});
defineBulletArt('tarrySlash', { frames: [crescent(0), crescent(1)], palette: P, radius: 4.4, frameSeconds: 0.12, rotate: true });

// A belaying pin, thrown (the snipes): a turned wooden club.
defineBulletArt('tarryPin', {
  frames: [art(11, 5, (p) => { p.rect(0, 1, 3, 3, 'H'); p.rect(3, 2, 6, 1, 'H'); p.rect(8, 1, 3, 3, 'H'); p.line(1, 1, 2, 1, 'l'); p.set(9, 1, 'l'); })],
  palette: P,
  radius: 3,
  rotate: true,
  spin: 7,
});

// A broadside's round shot, with a smoking tail.
defineBulletArt('tarryBall', {
  frames: [
    art(15, 13, (p) => { p.ellipse(9, 6, 5.4, 5.4, 'q'); p.ellipse(8, 5, 2.4, 2, 'Q'); p.set(7, 4, 'S'); p.ellipse(3, 6, 2.6, 1.4, 'G'); p.ellipse(1, 6, 1.2, 1, 'g'); }),
    art(15, 13, (p) => { p.ellipse(9, 6, 5.4, 5.4, 'q'); p.ellipse(8, 5, 2.4, 2, 'Q'); p.set(7, 4, 'S'); p.ellipse(3, 5, 2.6, 1.6, 'g'); p.ellipse(1, 7, 1.2, 1, 'G'); }),
  ],
  palette: P,
  radius: 5.2,
  frameSeconds: 0.12,
});

// A gun-port's match and its flash (harmless: the warning).
defineBulletArt('tarryMatch', {
  frames: [
    art(7, 7, (p) => { p.set(3, 3, 'w'); p.set(2, 3, 'O'); p.set(4, 3, 'O'); p.set(3, 2, 'o'); p.set(3, 4, 'o'); }),
    art(7, 7, (p) => { p.set(3, 3, 'O'); p.set(1, 3, 'o'); p.set(5, 3, 'o'); p.set(3, 1, 'm'); p.set(3, 5, 'm'); }),
  ],
  palette: P,
  radius: 1,
  frameSeconds: 0.08,
});
defineBulletArt('tarryFlash', {
  frames: [art(17, 15, (p) => { p.poly([[0, 7], [8, 1], [16, 4], [10, 7], [16, 10], [8, 13]], 'O'); p.poly([[4, 7], [9, 4], [12, 7], [9, 10]], 'w'); })],
  palette: P,
  radius: 1,
  rim: false,
});
defineBulletArt('tarrySmoke', {
  frames: [art(17, 11, (p) => { p.ellipse(8, 5, 7, 4, 'g'); p.ellipse(6, 4, 3.4, 2.4, 'f'); p.ellipse(11, 7, 3.4, 2.4, 'G'); }, false)],
  palette: P,
  radius: 1,
  rim: false,
});

// A bottle of rum: green glass, a cork, a scrap of label. It tumbles.
defineBulletArt('tarryBottle', {
  frames: [art(9, 15, (p) => {
    p.rect(3, 0, 3, 2, 'H');
    p.rect(3, 2, 3, 3, 'v');
    p.poly([[1, 6], [7, 6], [8, 14], [0, 14]], 'v');
    p.rect(1, 9, 7, 3, 'l');
    p.line(2, 6, 1, 13, 'w');
    p.rect(1, 13, 7, 1, 'V');
    p.set(4, 10, 'n');
  })],
  palette: P,
  radius: 4.8,
  spin: 5,
});
defineBulletArt('tarryShard', {
  frames: [
    art(9, 7, (p) => { p.poly([[0, 3], [5, 0], [8, 4], [4, 6]], 'v'); p.line(1, 3, 5, 1, 'w'); }),
    art(9, 7, (p) => { p.poly([[1, 1], [8, 3], [4, 6], [0, 5]], 'V'); p.line(2, 2, 6, 3, 'v'); }),
  ],
  palette: P,
  radius: 3,
  frameSeconds: 0.14,
  spin: 6,
});
// Spilled rum, alight.
defineBulletArt('tarryFlame', {
  frames: [
    art(11, 13, (p) => { p.poly([[5, 0], [9, 6], [8, 11], [2, 11], [1, 6]], 'm'); p.poly([[5, 3], [7, 7], [6, 10], [3, 10], [3, 7]], 'o'); p.set(5, 8, 'O'); }),
    art(11, 13, (p) => { p.poly([[4, 1], [9, 7], [8, 11], [2, 11], [2, 6]], 'm'); p.poly([[5, 4], [7, 8], [6, 10], [3, 10], [3, 7]], 'o'); p.set(4, 8, 'O'); }),
  ],
  palette: P,
  radius: 4.2,
  frameSeconds: 0.1,
});

// One of the crew coming over the rail: a pale sailor in a striped jersey,
// walking, a letter held out in front. They are not meaning anything by it.
const crew = (step) => art(15, 21, (p) => {
  // Mist for legs.
  p.rect(5, 15, 5, 4, 'F');
  p.set(4 + step, 19, 'g');
  p.set(9 - step, 19, 'g');
  // Jersey with stripes.
  p.rect(4, 8, 7, 8, 'f');
  p.rect(4, 10, 7, 1, 'c');
  p.rect(4, 13, 7, 1, 'c');
  // Arms out, the letter in the near hand.
  p.line(4, 9, 0, 11 + step, 'f');
  p.line(11, 9, 14, 11 - step, 'f');
  p.rect(-0, 9 + step, 3, 3, 'l');
  p.set(1, 10 + step, 'n');
  // Head, blank, two pale lights.
  p.ellipse(7.5, 4.5, 3.6, 3.8, 'f');
  p.set(6, 4, 'e');
  p.set(9, 4, 'e');
  p.rect(4, 1, 7, 2, 'n');
});
defineBulletArt('tarryCrew', { frames: [crew(0), crew(1)], palette: P, radius: 5.2, frameSeconds: 0.35 });

// A grapnel on its rope, thrown (harmless: the hook at the end of the line).
defineBulletArt('tarryHook', {
  frames: [art(11, 11, (p) => { p.line(5, 0, 5, 7, 'S', 2); p.line(5, 8, 1, 6, 'S', 2); p.line(5, 8, 9, 6, 'S', 2); p.set(0, 5, 's'); p.set(10, 5, 's'); p.set(5, 0, 'w'); })],
  palette: P,
  radius: 1,
  rotate: true,
});

// A cask that's come loose, rolling: oak staves, two iron hoops.
defineBulletArt('tarryBarrel', {
  frames: [art(15, 15, (p) => {
    p.ellipse(7, 7, 6.6, 6.6, 'H');
    p.ellipse(7, 7, 5, 5, 'h');
    p.ring(7, 7, 6.2, 6.2, 'q', 1);
    p.line(7, 1, 7, 13, 'R');
    p.line(3, 3, 3, 11, 'R');
    p.line(11, 3, 11, 11, 'R');
    p.set(5, 3, 'l');
  })],
  palette: P,
  radius: 6,
  spin: 3.4,
});

// The mate's round shot rolling (loose shot, smaller).
defineBulletArt('tarryRolling', {
  frames: [art(9, 9, (p) => { p.ellipse(4, 4, 3.8, 3.8, 'q'); p.ellipse(3, 3, 1.6, 1.4, 'Q'); })],
  palette: P,
  radius: 3.8,
  spin: 6,
});

// A little light lifting off the deck as the bell tolls (harmless).
defineBulletArt('tarryMote', {
  frames: [
    art(5, 5, (p) => { p.set(2, 2, 'w'); p.set(1, 2, 'e'); p.set(3, 2, 'e'); p.set(2, 1, 'e'); p.set(2, 3, 'e'); }),
    art(5, 5, (p) => { p.set(2, 2, 'e'); p.set(1, 1, 'E'); p.set(3, 3, 'E'); }),
  ],
  palette: P,
  radius: 1,
  frameSeconds: 0.3,
  rim: false,
});

// ---------------------------------------------------------------------------
// Cutlass: the blade sweeps from a pivot off the right of the box through a
// wedge with you in it (the wedge follows you while it warns, then locks), and
// then draws back. The blade shakes a little in his hand: he doesn't want to.
class Cutlass {
  constructor({ box, px, py, len = 104, spread = 0.62, warn = 0.95, down = true, follow = null }) {
    Object.assign(this, { box, px, py, len, spread, warn, down, follow });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.swing = 0.28;
    this.hold = 0.2;
    this.back = 0.34;
    this.centre = follow ? Math.atan2(follow.y - py, follow.x - px) : Math.PI;
    this.flung = false;
  }

  get end() {
    return this.warn + this.swing + this.hold + this.back;
  }

  get a0() {
    return this.centre + (this.down ? -1 : 1) * this.spread / 2;
  }

  get a1() {
    return this.centre + (this.down ? 1 : -1) * this.spread / 2;
  }

  angle() {
    const t = this.age - this.warn;
    if (t < 0 || t > this.swing + this.hold + this.back) return null;
    const ease = (u) => u * u * (3 - 2 * u);
    if (t < this.swing) return this.a0 + (this.a1 - this.a0) * ease(t / this.swing);
    if (t < this.swing + this.hold) return this.a1;
    return this.a1 + (this.a0 - this.a1) * ease((t - this.swing - this.hold) / this.back);
  }

  update(dt) {
    this.age += dt;
    if (this.follow && this.age < this.warn - 0.5) {
      const goal = Math.atan2(this.follow.y - this.py, this.follow.x - this.px);
      const d = ((goal - this.centre + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      this.centre += Math.max(-1.1 * dt, Math.min(1.1 * dt, d));
    }
  }

  isGone() {
    return this.age >= this.end + 0.05;
  }

  edgeDistance(px, py) {
    const a = this.angle();
    if (a === null) return Infinity;
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    const along = Math.max(0, Math.min(this.len, (px - this.px) * dx + (py - this.py) * dy));
    const cx = this.px + dx * along;
    const cy = this.py + dy * along;
    return Math.hypot(px - cx, py - cy) - (3.4 - (along / this.len) * 1.2);
  }

  draw(ctx) {
    ctx.save();
    if (this.age < this.warn) {
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.25 : 0.6;
      ctx.strokeStyle = '#d8e2e4';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      for (const a of [this.a0, this.a1]) {
        ctx.beginPath();
        ctx.moveTo(this.px, this.py);
        ctx.lineTo(this.px + Math.cos(a) * this.len, this.py + Math.sin(a) * this.len);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.globalAlpha *= 0.3;
      ctx.fillStyle = '#9ae0c8';
      ctx.beginPath();
      ctx.moveTo(this.px, this.py);
      ctx.arc(this.px, this.py, this.len, Math.min(this.a0, this.a1), Math.max(this.a0, this.a1));
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      return;
    }
    const a = this.angle();
    if (a === null) { ctx.restore(); return; }
    // A pale smear of where the blade has just been.
    const t = this.age - this.warn;
    if (t < this.swing + this.hold) {
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = '#d8e2e4';
      ctx.beginPath();
      ctx.moveTo(this.px, this.py);
      ctx.arc(this.px, this.py, this.len * 0.96, this.a0, a, this.a1 < this.a0);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.translate(this.px, this.py);
    ctx.rotate(a);
    // The blade: curved, widest near the tip (a cutlass), a brass guard at the hilt.
    const L = this.len;
    ctx.fillStyle = '#101a1c';
    ctx.beginPath();
    ctx.moveTo(10, -2.6);
    ctx.quadraticCurveTo(L * 0.6, -5.4, L, 0.8);
    ctx.lineTo(L - 2, 3);
    ctx.quadraticCurveTo(L * 0.6, -1.4, 10, 2.6);
    ctx.fill();
    ctx.fillStyle = '#d8e2e4';
    ctx.beginPath();
    ctx.moveTo(11, -1.6);
    ctx.quadraticCurveTo(L * 0.6, -4.2, L - 1, 0.6);
    ctx.quadraticCurveTo(L * 0.6, -2.4, 11, 0.2);
    ctx.fill();
    ctx.fillStyle = '#7a8c94';
    ctx.beginPath();
    ctx.moveTo(11, 0.2);
    ctx.quadraticCurveTo(L * 0.6, -2.4, L - 1, 0.6);
    ctx.quadraticCurveTo(L * 0.6, -1.2, 11, 1.6);
    ctx.fill();
    ctx.fillStyle = '#c8a040';
    ctx.fillRect(4, -5, 3, 10);
    ctx.fillStyle = '#80601c';
    ctx.fillRect(-4, -2, 9, 4);
    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// Toll: a ring of sound going out from a point, with any number of gaps in it.
class Toll {
  constructor({ x, y, r = 2, grow = 34, thick = 3, life = 3.6, warn = 0.5, gaps = [], color = '#f2d88a', glow = '#c8a040' }) {
    Object.assign(this, { x, y, r, grow, thick, life, warn, gaps, color, glow });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get active() {
    return this.age >= this.warn && this.age < this.warn + this.life;
  }

  update(dt) {
    this.age += dt;
    if (this.age >= this.warn) this.r += this.grow * dt;
  }

  isGone() {
    return this.age >= this.warn + this.life + 0.25;
  }

  inGap(a) {
    return this.gaps.some((g) => Math.abs((((a - g.angle) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2) - Math.PI) < g.width / 2);
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const dx = px - this.x;
    const dy = py - this.y;
    if (this.inGap(Math.atan2(dy, dx))) return Infinity;
    return Math.abs(Math.hypot(dx, dy) - this.r) - this.thick / 2;
  }

  draw(ctx) {
    ctx.save();
    const over = this.age - (this.warn + this.life);
    if (this.age < this.warn) {
      // The gaps, shown as little ticks on a faint circle.
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.2 : 0.5;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.arc(this.x, this.y, 8 + this.age * 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      return;
    }
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.thick;
    ctx.shadowColor = this.glow;
    ctx.shadowBlur = 4;
    // Draw the ring in the arcs between its gaps.
    const edges = this.gaps.map((g) => [g.angle - g.width / 2, g.angle + g.width / 2]).sort((a, b) => ((a[0] % 6.2832) + 6.2832) % 6.2832 - (((b[0] % 6.2832) + 6.2832) % 6.2832));
    if (!edges.length) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.1, this.r), 0, Math.PI * 2);
      ctx.stroke();
    } else {
      for (let i = 0; i < edges.length; i++) {
        const from = edges[i][1];
        let to = edges[(i + 1) % edges.length][0];
        while (to < from) to += Math.PI * 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.1, this.r), from, to);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
}

const TAU = Math.PI * 2;
const wrapPi = (a) => ((((a + Math.PI) % TAU) + TAU) % TAU) - Math.PI;

export const CAPTAIN_TARRY_ATTACKS = {
  // "Draw!": the cutlass sweeps its wedge (it follows you while it warns, then
  // locks), draws back, and sweeps again from the other side; a pair of
  // crescents of steel go flying off the end of each stroke.
  tarryCutlass(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let n = 0;
    const blades = [];
    const px = box.x + box.w + 16;
    return {
      duration: 7.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (n < 5 && t >= T(0.2 + n * 1.5)) {
          const down = n % 2 === 0;
          const py = clamp(soul.y + (down ? -1 : 1) * rand(12, 26), box.y - 10, box.y + box.h + 10);
          const blade = new Cutlass({ box, px, py, down, follow: soul, spread: rand(0.58, 0.7), warn: 0.95 });
          bullets.push(blade);
          blades.push(blade);
          if (n === 4) {
            const other = new Cutlass({ box, px, py: py < box.y + box.h / 2 ? box.y + box.h + 8 : box.y - 8, down: !down, follow: soul, spread: 0.5, warn: 1.15 });
            bullets.push(other);
            blades.push(other);
          }
          n++;
        }
        for (const blade of blades) {
          if (blade.flung || blade.age < blade.warn + blade.swing) continue;
          blade.flung = true;
          // (A crescent only comes off every other stroke.)
          if (blades.indexOf(blade) % 2) continue;
          const a = blade.a1;
          const tx = blade.px + Math.cos(a) * blade.len * 0.9;
          const ty = blade.py + Math.sin(a) * blade.len * 0.9;
          for (let k = 0; k < 1; k++) {
            const ang = a + (blade.down ? 1 : -1) * (Math.PI / 2) * 1.1 + rand(-0.2, 0.2);
            bullets.push(new Shot({ x: tx, y: ty, vx: Math.cos(ang) * 28, vy: Math.sin(ang) * 28, art: 'tarrySlash', life: 1.1 }));
          }
        }
      },
    };
  },

  // "Run out the guns!": six gun-ports down the right of the box; the matches
  // blink at the ports, then a broadside, all but a pair of ports (never
  // yours); smoke rolls off the muzzles. Four broadsides, each a lane shifted.
  tarryCannon(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.25);
    let broadsides = 0;
    const lanes = [];
    for (let i = 0; i < 6; i++) lanes.push(box.y + 8 + i * ((box.h - 16) / 5));
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && broadsides < 5 && t < T(5.8)) {
          broadsides++;
          next = t + T(1.15);
          const mine = lanes.reduce((a, y, i) => (Math.abs(y - soul.y) < Math.abs(lanes[a] - soul.y) ? i : a), 0);
          // The silent pair: two neighbouring ports a step or two from yours.
          const dir = broadsides % 2 ? 1 : -1;
          let clear = clamp(mine + dir * (1 + Math.floor(rand(0, 2))), 0, 4);
          if (clear === mine || clear + 1 === mine) clear = mine > 2 ? Math.max(0, mine - 2) : Math.min(4, mine + 1);
          lanes.forEach((y, i) => {
            if (i === clear || i === clear + 1) return;
            // The match at the port, blinking; then the ball and its smoke.
            bullets.push(new Shot({ x: box.x + box.w - 4, y, harmless: true, warn: 0.85, life: 0, art: 'tarryMatch' }));
            bullets.push(new Shot({ x: box.x + box.w + 8, y, vx: -76, warn: 0.85, life: 4, art: 'tarryBall' }));
            bullets.push(new Shot({ x: box.x + box.w - 6, y, vx: -7, harmless: true, warn: 0.85, life: 1.3, art: 'tarrySmoke' }));
            bullets.push(new Shot({ x: box.x + box.w - 3, y, harmless: true, warn: 0.85, life: 0.12, art: 'tarryFlash' }));
          });
        }
      },
    };
  },

  // "Hard a-port!": he shouts the order through the speaking-trumpet; arcs of
  // sound come out of it, aimed at you, in threes (the cadence of an order:
  // quick, quick, quick, rest). Each is a narrow arc of an expanding ring, so
  // the way out is sideways, and the three never come on quite the same line.
  tarryOrders(box, density, { rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    const cues = [0.35, 0.85, 1.35, 2.9, 3.4, 3.9, 5.3, 5.8];
    let done = 0;
    const ty = box.y + box.h / 2 + rand(-14, 14);
    const tx = box.x + box.w + 10;
    const heading = { x: 0, y: 0 };
    const seen = { x: null, y: null };
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (seen.x !== null && dt > 0) {
          heading.x = heading.x * 0.85 + ((soul.x - seen.x) / (dt / density)) * 0.15;
          heading.y = heading.y * 0.85 + ((soul.y - seen.y) / (dt / density)) * 0.15;
        }
        seen.x = soul.x;
        seen.y = soul.y;
        while (done < cues.length && t >= T(cues[done])) {
          const lead = done % 3 === 0 ? 0 : done % 3 === 1 ? 0.8 : -0.6;
          const aimY = clamp(soul.y + heading.y * lead, box.y + 4, box.y + box.h - 4);
          const aimX = clamp(soul.x + heading.x * lead, box.x + 4, box.x + box.w - 4);
          const a = Math.atan2(aimY - ty, aimX - tx);
          const width = 0.62;
          bullets.push(new Toll({ x: tx, y: ty, grow: 66, thick: 3.6, life: 2.2, warn: 0.62, gaps: [{ angle: a + Math.PI, width: TAU - width * 2 }], color: '#f6e29a', glow: '#c8a040' }));
          // The gap is the whole circle but the arc (`a` ± width), so the Toll's gap sits opposite.
          done++;
        }
      },
    };
  },

  // The last of the rum: he throws his bottles over, in arcs; each shatters
  // into green glass all round and the spill catches fire where it lands (the
  // fire waits a moment, blinking, and then burns for a couple of seconds).
  tarryRum(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.3);
    let thrown = 0;
    const flying = [];
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && thrown < 6 && t < T(5.2)) {
          thrown++;
          next = t + T(0.85);
          // (at least 28 px off you, in a random direction, then kept inside the box)
          const away = rand(0, TAU);
          const gap = rand(28, 42);
          const lx = clamp(soul.x + Math.cos(away) * gap, box.x + 9, box.x + box.w - 9);
          const ly = clamp(soul.y + Math.sin(away) * gap, box.y + 9, box.y + box.h - 9);
          const fromX = box.x + box.w + 8;
          const fromY = box.y + rand(4, box.h - 4);
          const flight = 1.0;
          for (const dx of [-6, 6]) bullets.push(new Shot({ x: lx + dx, y: ly, harmless: true, warn: flight, life: 0, art: 'tarryMatch' }));
          const b = new Shot({ x: fromX, y: fromY, harmless: true, life: 99, art: 'tarryBottle' });
          flying.push({ t0: t, at: t + T(flight), x: lx, y: ly, fromX, fromY, b });
          bullets.push(b);
        }
        for (const f of flying) {
          if (f.done) continue;
          if (t < f.at) {
            const k = (t - f.t0) / (f.at - f.t0);
            f.b.x = f.fromX + (f.x - f.fromX) * k;
            f.b.y = f.fromY + (f.y - f.fromY) * k - Math.sin(k * Math.PI) * 20;
            continue;
          }
          f.done = true;
          f.b.life = 0;
          f.b.age = 99;
          const spin = Math.random() * Math.PI;
          for (let i = 0; i < 5; i++) {
            const a = spin + (i / 5) * TAU;
            bullets.push(new Shot({ x: f.x, y: f.y, vx: Math.cos(a) * 36, vy: Math.sin(a) * 36, life: 1.3, art: 'tarryShard' }));
          }
          // The spill, alight: it blinks (harmless) for 0.7 s, then burns.
          bullets.push(new Shot({ x: f.x, y: f.y, warn: 0.7, life: 2.0, art: 'tarryFlame' }));
        }
      },
    };
  },

  // "Boarders!": his own crew come over the rail in lines, each with a letter
  // held out, walking slowly. A line has two neighbouring gaps, which are
  // never at your place, and the next line comes from another side.
  tarryBoard(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.3);
    let waves = 0;
    const sides = ['right', 'left', 'top', 'bottom'];
    let order = 0;
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && waves < 5 && t < T(5.4)) {
          const side = sides[order++ % 4];
          waves++;
          next = t + T(1.35);
          const horizontal = side === 'right' || side === 'left';
          const span = horizontal ? box.h : box.w;
          const origin = horizontal ? box.y : box.x;
          const slots = 6;
          const step = (span - 12) / (slots - 1);
          const at = horizontal ? soul.y : soul.x;
          const mine = Math.max(0, Math.min(slots - 1, Math.round((at - origin - 6) / step)));
          // Gap: two slots next to each other, one or two over from yours.
          let g = clamp(mine + (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(rand(0, 2))), 0, slots - 2);
          if (g === mine || g + 1 === mine) g = mine > 2 ? mine - 2 : mine + 1;
          const speed = 27;
          for (let i = 0; i < slots; i++) {
            if (i === g || i === g + 1) continue;
            const pos = origin + 6 + i * step;
            const o = { right: { x: box.x + box.w + 9, y: pos, vx: -speed, vy: 0 }, left: { x: box.x - 9, y: pos, vx: speed, vy: 0 }, top: { x: pos, y: box.y - 9, vx: 0, vy: speed }, bottom: { x: pos, y: box.y + box.h + 9, vx: 0, vy: -speed } }[side];
            bullets.push(new Shot({ ...o, warn: 0.85, life: 5, art: 'tarryCrew' }));
            // The warning: the ghost's outline blinking just inside the edge it's coming over.
            bullets.push(new Shot({ x: horizontal ? (side === 'right' ? box.x + box.w - 7 : box.x + 7) : o.x, y: horizontal ? o.y : (side === 'bottom' ? box.y + box.h - 8 : box.y + 8), harmless: true, warn: 0.85, life: 0, art: 'tarryCrew' }));
          }
        }
      },
    };
  },

  // "Throw lines!": grappling ropes are flung across the box from one side, in
  // a fan with you somewhere in it; each runs out, pulls taut, holds, and is
  // hauled in. A rope is thin, so the way out is between two of them.
  tarryRope(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.25);
    let throws = 0;
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && throws < 4 && t < T(5.4)) {
          const fromRight = throws % 2 === 0;
          throws++;
          next = t + T(1.4);
          const ox = fromRight ? box.x + box.w + 6 : box.x - 6;
          const oy = clamp(soul.y + rand(-16, 16), box.y + 6, box.y + box.h - 6);
          const toSoul = Math.atan2(soul.y - oy, soul.x - ox);
          // A fan of three: one a good way off you, two either side (the lane between is wide).
          const spread = 0.34;
          const lean = Math.random() < 0.5 ? 1 : -1;
          [-1, 0, 1].forEach((k, i) => {
            if (i === 1 && throws % 2 === 0 && Math.random() < 0.4) return;
            bullets.push(new Line({ x: ox, y: oy, angle: toSoul + k * spread + lean * 0.12, length: 128, thickness: 3, warn: 0.85, life: 0.7, grow: 320, color: '#b49c68', glow: '#7a6234' }));
          });
          bullets.push(new Shot({ x: ox + (fromRight ? -6 : 6), y: oy, harmless: true, warn: 0.85, life: 0, art: 'tarryHook' }));
        }
      },
    };
  },

  // "All hands, brace!": the deck lists. The whole box leans (the picture tips
  // and everything in it slides downhill: you too, a little), loose casks and
  // shot roll off the high side, and when the ship comes back the other way
  // they roll back. The list comes and goes about every three seconds.
  tarryList(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    const MAX = 0.1;
    let t = 0;
    let next = T(0.5);
    let loose = 0;
    const rolling = [];
    const angleAt = (real) => {
      // Ease in over the first second, then swing: starboard, port, starboard.
      const ease = Math.min(1, real / 1.0);
      return MAX * ease * Math.sin((real / 3.4) * TAU);
    };
    return {
      duration: 8.2,
      update: (dt, bullets, soul) => {
        const real = dt / density;
        t += dt;
        const now = t / density;
        const a = angleAt(now);
        box.tilt = a;
        // The slope carries you: about 12 px a second at the full list, downhill (the side that's down).
        soul.x = clamp(soul.x + (a / MAX) * 12 * real, box.x + 3, box.x + box.w - 3);
        if (t >= next && loose < 7 && t < T(6.3)) {
          loose++;
          next = t + T(0.85);
          // Loose cargo off the high side: every other one in your own lane, the rest a way off it.
          const downhill = a >= 0 ? 1 : -1;
          const y = clamp(loose % 2 ? soul.y + rand(-3, 3) : soul.y + (Math.random() < 0.5 ? -1 : 1) * rand(16, 30), box.y + 7, box.y + box.h - 7);
          const kind = loose % 3 === 0 ? 'tarryRolling' : 'tarryBarrel';
          const warn = 0.75;
          // It blinks (harmless) where it starts, on the high edge, then lets go.
          const shot = new Shot({ x: downhill > 0 ? box.x + 7 : box.x + box.w - 7, y, vx: 0, vy: 0, warn, life: 6, art: kind });
          rolling.push({ shot, birth: now + warn });
          bullets.push(shot);
        }
        // Loose cargo rolls to whichever side is down: harder the more the ship leans.
        for (const r of rolling) {
          if (now < r.birth) continue;
          r.shot.vx += (a / MAX) * 62 * real;
          r.shot.vx = clamp(r.shot.vx, -78, 78);
        }
      },
    };
  },

  // "Make port": the ship's bell, tolling from the middle of the box. Each
  // toll is a ring with two gaps in it, at your sides, so the way out is round
  // the ring, not through it; little lights lift off the deck and go up. It is
  // the slowest, the saddest and the easiest thing he has.
  tarryPort(box, density, { Shot, rand, clamp, every }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.3);
    let tolls = 0;
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    const motes = every(0.18, 0.3, (bullets) => {
      bullets.push(new Shot({ x: rand(box.x + 4, box.x + box.w - 4), y: box.y + box.h + 3, vy: -rand(10, 18), harmless: true, life: 5.5, art: 'tarryMote' }));
    });
    return {
      duration: 7.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < T(6.6)) motes(dt, bullets, soul);
        if (t >= next && tolls < 5 && t < T(5.6)) {
          tolls++;
          next = t + T(1.15);
          const toSoul = Math.atan2(soul.y - cy, soul.x - cx);
          const jitter = rand(-0.35, 0.35);
          bullets.push(new Toll({
            x: cx, y: cy, r: 2, grow: 36, thick: 3.2, life: 3.4, warn: 0.6,
            gaps: [{ angle: toSoul + Math.PI / 2 + jitter, width: 0.95 }, { angle: toSoul - Math.PI / 2 + jitter, width: 0.95 }],
            color: '#f6e29a', glow: '#c8a040',
          }));
        }
      },
    };
  },
};

// Belaying pins thrown at you, aimed a little ahead (see snipes.js).
for (const name of Object.keys(CAPTAIN_TARRY_ATTACKS)) {
  if (name === 'tarryList') continue;
  CAPTAIN_TARRY_ATTACKS[name] = withSnipes(CAPTAIN_TARRY_ATTACKS[name], { art: 'tarryPin', count: name === 'tarryPort' ? 2 : 3, first: 1.3, every: 1.5, lead: [0.9, 'mean', 0.5] });
}
void wrapPi;
