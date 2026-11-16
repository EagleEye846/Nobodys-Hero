import { defineGuardianStar } from './guardianStar.js';
import { defineBulletArt, Line } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { clamp, shuffleBag } from '../patternTools.js';

// QUIRE's attacks: the Dead City's Welcome Register, a thing of ledgers, loose
// pages and ink woken by the splinter of the Fallen Star in its binding. It
// counts everybody who promised to be present when the Hero came, over and
// over, and it counts you. Everything it throws is the clerk's trade:
// tally strokes, ink, rubber stamps, loose pages and paper darts, a quill, the
// beads of an abacus, a bookcase sliding shut, and check marks ticked off a
// list. Each is warned (it blinks or draws where it will land first), nothing
// is faster than you can read, and in the last phase it throws two of them at
// once.
//
// Its fight has three phases (see `phases` in src/data/enemies/tally.js):
//   ROLL CALL   it counts: tally strokes, ink, loose pages, stamps
//   LATE FEES   it charges: a quill, an abacus, a bookcase, a list ticked off
//   THE MARGINS everything at once, and the book of it coming apart
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. `density` speeds up an attack's own clock, so
// these keep `real` time (time / density) to know when to stop.

const TP = {
  k: '#13101c', // outline
  p: '#eadfbb', // parchment
  P: '#bfae84', // parchment, shade
  q: '#8a7a56',
  i: '#2a3470', // ink, lit enough to read on the black box
  I: '#6a7cd0', // ink, brighter
  j: '#9aaaf0',
  l: '#a04a5e', // leather
  L: '#c8647c',
  r: '#e04a5a', // red
  R: '#9a2434',
  g: '#e8c060', // gold
  G: '#9a7220',
  s: '#c4f6ff', // star
  S: '#4ab8e0',
  w: '#ffffff',
  b: '#5a8ad8', // a blue bead
  B: '#2a4a98',
  n: '#6aa860', // a green spine
  N: '#3a6a38',
  o: '#d88a3a', // an orange spine
  O: '#8a5420',
};

// --- Art ---

// One stroke of a tally: a stick of ink-pale chalk.
defineBulletArt('tallyStick', { frames: [art(3, 11, (p) => { p.rect(0, 0, 3, 11, 'p'); p.rect(2, 1, 1, 9, 'P'); p.set(0, 0, 'w'); })], palette: TP, hitbox: { w: 3, h: 11 } });
// A drop of ink falling, and the splash it throws.
defineBulletArt('inkDrop', { frames: [art(5, 8, (p) => { p.poly([[2, 0], [4, 4], [2, 7], [0, 4]], 'I'); p.ellipse(2, 5, 1.6, 1.6, 'I'); p.set(1, 4, 'j'); })], palette: TP, radius: 2.2 });
defineBulletArt('inkDot', { frames: [art(3, 3, (p) => { p.rect(0, 0, 3, 3, 'I'); p.set(0, 0, 'j'); })], palette: TP, radius: 1.3 });
defineBulletArt('inkSpeck', { frames: [['.I.', 'III', '.I.'], ['...', '.I.', '...']], palette: TP, radius: 1.2, frameSeconds: 0.2 });
// Where a drop is about to land (harmless): a ring of ink.
defineBulletArt('inkRing', { frames: [art(11, 7, (p) => { p.ring(5, 3, 5, 3, 'i', 1.1); })], palette: TP, radius: 0.1 });
// A loose page, turning as it blows, and a page folded into a dart.
defineBulletArt('tallyPage', {
  frames: [
    art(9, 11, (p) => { p.rect(0, 0, 9, 11, 'p'); p.rect(0, 0, 9, 1, 'w'); for (const y of [3, 5, 7, 9]) p.line(1, y, 7, y, 'q'); p.rect(0, 10, 9, 1, 'P'); }),
    art(7, 11, (p) => { p.rect(0, 0, 7, 11, 'P'); p.rect(0, 0, 7, 1, 'p'); for (const y of [3, 5, 7, 9]) p.line(1, y, 5, y, 'q'); }),
  ],
  palette: TP, radius: 4, frameSeconds: 0.2,
});
defineBulletArt('tallyDart', { frames: [art(11, 7, (p) => { p.poly([[0, 3], [10, 0], [10, 6]], 'p'); p.poly([[2, 3], [10, 3], [8, 5]], 'P'); p.line(1, 3, 9, 3, 'w'); })], palette: TP, radius: 3, rotate: true });
// A quill nib, pointing right.
defineBulletArt('tallyQuill', {
  frames: [art(15, 7, (p) => { p.poly([[0, 3], [5, 1], [14, 2], [14, 4], [5, 5]], 'p'); p.line(5, 3, 13, 3, 'P'); p.poly([[0, 3], [4, 2], [4, 4]], 'I'); p.set(1, 3, 'w'); })],
  palette: TP, radius: 2.4, rotate: true,
});
// A star falling (harmless: it only shows where a tick is about to go off, and when).
defineGuardianStar('tallyFallStar', { radius: 0.1, frameSeconds: 0.2 });
// A tick, in star-light: harmless itself (the burst that follows is not).
defineBulletArt('tallyTick', { frames: [art(11, 9, (p) => { p.line(1, 5, 4, 8, 's', 2); p.line(4, 8, 10, 0, 's', 2); p.set(1, 5, 'w'); p.set(4, 8, 'w'); })], palette: TP, radius: 0.1, frameSeconds: 0.3 });
defineBulletArt('tallyMote', { frames: [['.s.', 'sws', '.s.'], ['...', '.s.', '...']], palette: TP, radius: 1.6, frameSeconds: 0.18 });
// An abacus bead: red or blue.
defineBulletArt('beadRed', { frames: [art(7, 7, (p) => { p.ellipse(3, 3, 3, 3, 'r'); p.ellipse(3, 4, 2.4, 2, 'R', 'r'); p.set(2, 1, 'w'); })], palette: TP, radius: 3 });
defineBulletArt('beadBlue', { frames: [art(7, 7, (p) => { p.ellipse(3, 3, 3, 3, 'b'); p.ellipse(3, 4, 2.4, 2, 'B', 'b'); p.set(2, 1, 'w'); })], palette: TP, radius: 3 });
// Spines of books, for the bookcase.
const spine = (hi, lo) => art(5, 12, (p) => { p.rect(0, 0, 5, 12, lo); p.rect(0, 0, 1, 12, hi); p.rect(0, 2, 5, 1, 'g'); p.rect(0, 9, 5, 1, 'g'); p.rect(1, 4, 3, 4, 'p'); });
defineBulletArt('spineRed', { frames: [spine('L', 'l')], palette: TP, hitbox: { w: 5, h: 12 } });
defineBulletArt('spineGreen', { frames: [spine('n', 'N')], palette: TP, hitbox: { w: 5, h: 12 } });
defineBulletArt('spineOrange', { frames: [spine('o', 'O')], palette: TP, hitbox: { w: 5, h: 12 } });
// A book that has fallen out of the case, tumbling.
defineBulletArt('fallenBook', { frames: [art(9, 7, (p) => { p.rect(0, 0, 9, 7, 'l'); p.rect(0, 0, 9, 1, 'L'); p.rect(1, 5, 8, 2, 'p'); p.rect(0, 0, 1, 7, 'g'); })], palette: TP, radius: 3.6, spin: 5 });

// --- Bullets of its own ---

// A STAMP, coming down on `at`: first its outline closes on the spot (harmless)
// for `warn` seconds, then the stamp slams, a block of red, and for a moment
// everything under it hurts. It leaves its print behind, faint (harmless).
// Seven flecks of ink fly out of the slam (made by the attack that owns it).
function stampDown({ at, w = 22, h = 14, warn = 0.95, word = 0 }) {
  return {
    x: at.x, y: at.y, dmg: null, grazed: false, age: 0,
    update(dt) { this.age += dt; },
    isGone() { return this.age > warn + 0.75; },
    landed() { return this.age >= warn; },
    edgeDistance(px, py) {
      if (this.age < warn || this.age > warn + 0.22) return Infinity;
      const dx = Math.max(Math.abs(px - this.x) - w / 2 + 1, 0);
      const dy = Math.max(Math.abs(py - this.y) - h / 2 + 1, 0);
      return Math.hypot(dx, dy);
    },
    draw(ctx) {
      ctx.save();
      const x = Math.round(this.x - w / 2);
      const y = Math.round(this.y - h / 2);
      if (this.age < warn) {
        const t = this.age / warn;
        const grow = (1 - t) * 10;
        ctx.globalAlpha = 0.4 + 0.5 * t;
        ctx.strokeStyle = '#e04a5a';
        ctx.lineWidth = 1 + t;
        ctx.setLineDash([3, 2]);
        ctx.strokeRect(x - grow + 0.5, y - grow + 0.5, w + grow * 2, h + grow * 2);
        // The handle of the stamp, above it, coming down.
        ctx.setLineDash([]);
        ctx.fillStyle = '#e8c060';
        ctx.fillRect(Math.round(this.x) - 1, y - 14 - Math.round(grow * 2), 3, 12);
        ctx.restore();
        return;
      }
      const since = this.age - warn;
      if (since < 0.22) {
        ctx.fillStyle = '#e04a5a';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#9a2434';
        ctx.fillRect(x, y + h - 3, w, 3);
        ctx.fillStyle = '#ffd0d4';
        ctx.fillRect(x + 1, y + 1, w - 2, 1);
        // The word cut into it: bars, like capitals.
        ctx.fillStyle = '#eadfbb';
        for (let i = 0; i < 4 + word; i++) ctx.fillRect(x + 3 + i * 4, y + 4, 2, 5);
      } else {
        // Its print, left on the paper, fading.
        ctx.globalAlpha = Math.max(0, 0.55 - (since - 0.22));
        ctx.strokeStyle = '#e04a5a';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
        ctx.fillStyle = '#e04a5a';
        for (let i = 0; i < 4 + word; i++) ctx.fillRect(x + 3 + i * 4, y + 4, 2, 5);
      }
      ctx.restore();
    },
  };
}

// A TICK on a list, at `at`: it draws itself (a pale check mark, blinking) for
// `warn` seconds, then the star in it goes off: everything within `r` hurts for
// a moment. Motes fly out of it (made by the attack that owns it).
function tickOff({ at, r = 8, warn = 0.7 }) {
  return {
    x: at.x, y: at.y, dmg: null, grazed: false, age: 0,
    update(dt) { this.age += dt; },
    isGone() { return this.age > warn + 0.5; },
    went() { return this.age >= warn; },
    edgeDistance(px, py) {
      if (this.age < warn || this.age > warn + 0.18) return Infinity;
      return Math.hypot(px - this.x, py - this.y) - r;
    },
    draw(ctx) {
      ctx.save();
      const x = Math.round(this.x);
      const y = Math.round(this.y);
      if (this.age < warn) {
        const t = this.age / warn;
        ctx.globalAlpha = Math.floor(this.age * 12) % 2 ? 0.45 : 0.9;
        ctx.strokeStyle = '#c4f6ff';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x - 5, y);
        ctx.lineTo(x - 2, y + 4);
        ctx.lineTo(x + 5, y - 5);
        ctx.stroke();
        ctx.globalAlpha = 0.25 + 0.4 * t;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.arc(x, y, r + (1 - t) * 7, 0, Math.PI * 2);
        ctx.stroke();
      } else if (this.age < warn + 0.18) {
        const g = ctx.createRadialGradient(x, y, 1, x, y, r + 2);
        g.addColorStop(0, 'rgba(255,255,255,0.95)');
        g.addColorStop(0.6, 'rgba(120,220,255,0.8)');
        g.addColorStop(1, 'rgba(74,184,224,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r + 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    },
  };
}

const rand = (a, b) => a + Math.random() * (b - a);

// --- The attacks ---

export const TALLY_ATTACKS = {
  // TALLY MARKS. Four strokes fall side by side, the way a clerk marks off
  // four; each blinks at the top of the box first. A beat later the fifth
  // comes: a stroke drawn slantwise across where they were, warned by a thin
  // line first. Fall in the gaps, and don't stay where they were.
  tallyMarks(box, density, { Shot, every, rand, pick }) {
    let real = 0;
    let n = 0;
    const strokes = [];
    const group = every(1.0, 1.2, (bullets, soul) => {
      n++;
      const wide = n % 2 === 0;
      const gap = wide ? 12 : 10;
      const count = wide ? 6 : 4;
      const x0 = clamp(soul.x + rand(-18, 8) - ((count - 1) * gap) / 2, box.x + 4, box.x + box.w - 4 - (count - 1) * gap);
      for (let i = 0; i < count; i++) {
        bullets.push(new Shot({ x: x0 + i * gap, y: box.y - 3, vy: 80 + (i % 2) * 10, warn: 0.4, art: 'tallyStick' }));
      }
      strokes.push({ at: 0.8, x0, x1: x0 + (count - 1) * gap, y: clamp(soul.y + rand(-12, 12), box.y + 16, box.y + box.h - 16), done: false, clock: 0 });
    }, { first: 0.1 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        for (const s of strokes) {
          if (s.done) continue;
          s.clock += dt / density;
          if (s.clock < s.at) continue;
          s.done = true;
          // The slash, left to right or right to left, through where they fell.
          const flip = Math.random() < 0.5;
          const x0 = flip ? s.x1 + 8 : s.x0 - 8;
          const x1 = flip ? s.x0 - 8 : s.x1 + 8;
          bullets.push(new Line({ x: x0, y: s.y - 14, angle: Math.atan2(28, x1 - x0), length: Math.hypot(x1 - x0, 28), thickness: 4, warn: 0.5, life: 0.3, color: '#eadfbb', glow: '#fff6d8', dash: [4, 2] }));
        }
        if (real > 6.2) return;
        group(dt, bullets, soul);
      },
    };
  },

  // INK. Drops fall from the dark above the box, each one with a ring of ink
  // showing where it will land; when it lands it splashes into a spray of
  // flecks. Now and then a big drop falls right at you.
  tallyInk(box, density, { Shot, every, rand }) {
    let real = 0;
    let n = 0;
    const drops = [];
    const lane = (() => { const b = shuffleBag([0, 1, 2, 3, 4]); return () => box.x + 8 + (b() + Math.random() * 0.8) * ((box.w - 16) / 5); })();
    const rain = every(0.46, 0.6, (bullets, soul) => {
      n++;
      const x = n % 3 === 0 ? clamp(soul.x + rand(-4, 4), box.x + 6, box.x + box.w - 6) : lane();
      const landY = n % 3 === 0 ? clamp(soul.y + rand(-4, 4), box.y + 10, box.y + box.h - 8) : rand(box.y + 14, box.y + box.h - 10);
      const drop = new Shot({ x, y: box.y - 4, vy: 66, warn: 0.5, art: 'inkDrop' });
      bullets.push(drop);
      // The ring that shows where it lands: lasts as long as the drop takes to fall.
      bullets.push(new Shot({ x, y: landY, harmless: true, life: (landY - box.y) / 66 + 0.5 + 0.6, art: 'inkRing' }));
      drops.push({ shot: drop, landY });
    }, { first: 0.1 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        for (let i = drops.length - 1; i >= 0; i--) {
          const d = drops[i];
          if (d.shot.age < d.shot.warn || d.shot.y < d.landY) continue;
          drops.splice(i, 1);
          d.shot.life = 0;
          for (let k = 0; k < 6; k++) {
            const a = -Math.PI + (k / 5) * Math.PI + rand(-0.12, 0.12);
            bullets.push(new Shot({ x: d.shot.x, y: d.shot.y, vx: Math.cos(a) * 52, vy: Math.sin(a) * 52 - 8, gravity: 90, life: 1.2, art: 'inkSpeck' }));
          }
        }
        if (real > 6.3) return;
        rain(dt, bullets, soul);
      },
    };
  },

  // STAMPS. A great rubber stamp comes down on where you are: its outline
  // closes on the spot, then it slams and prints. Flecks of ink fly out of
  // it. Every third time it brings two, one either side of you, with a lane
  // between.
  tallyStamp(box, density, { Shot, every, rand }) {
    let real = 0;
    let n = 0;
    const slams = [];
    const stamp = every(0.85, 1.0, (bullets, soul) => {
      n++;
      if (n % 3 === 0) {
        for (const side of [-1, 0, 1]) {
          const s = stampDown({ at: { x: clamp(soul.x + side * 27, box.x + 12, box.x + box.w - 12), y: clamp(soul.y + rand(-12, 12) + (side === 0 ? 24 : 0), box.y + 9, box.y + box.h - 9) }, w: 20, h: 14, warn: 0.8, word: 1 });
          slams.push(s);
          bullets.push(s);
        }
      } else {
        const s = stampDown({ at: { x: clamp(soul.x, box.x + 12, box.x + box.w - 12), y: clamp(soul.y, box.y + 9, box.y + box.h - 9) }, w: 24, h: 16, warn: 0.72 });
        slams.push(s);
        bullets.push(s);
      }
    }, { first: 0.2 });
    const dust = every(0.34, 0.42, (bullets) => {
      bullets.push(new Shot({ x: rand(box.x + 4, box.x + box.w - 4), y: box.y - 2, vy: rand(16, 26), wobble: { amplitude: 2, frequency: 2 }, art: 'inkSpeck', harmless: true, life: 5 }));
    });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        for (let i = slams.length - 1; i >= 0; i--) {
          const s = slams[i];
          if (!s.landed()) continue;
          slams.splice(i, 1);
          for (let k = 0; k < 9; k++) {
            const a = (k / 9) * Math.PI * 2 + rand(-0.2, 0.2);
            bullets.push(new Shot({ x: s.x, y: s.y, vx: Math.cos(a) * 54, vy: Math.sin(a) * 54, accel: -18, life: 1.5, art: 'inkDot' }));
          }
        }
        if (real > 6.4) return;
        stamp(dt, bullets, soul);
        dust(dt, bullets);
      },
    };
  },

  // LOOSE PAGES. Pages come off it and blow across the box in the wind,
  // weaving, a few at a time from alternate sides. Every so often one folds
  // itself into a dart and comes after you, steering, until it's spent.
  tallyPages(box, density, { Shot, every, rand }) {
    let real = 0;
    let way = Math.random() < 0.5 ? 1 : -1;
    const rows = shuffleBag([0, 1, 2, 3, 4]);
    const blow = every(0.62, 0.78, (bullets) => {
      way = -way;
      for (let i = 0; i < 4; i++) {
        const y = box.y + 9 + rows() * ((box.h - 18) / 4);
        bullets.push(new Shot({
          x: way > 0 ? box.x - 6 - i * 10 : box.x + box.w + 6 + i * 10, y: y + (i % 2) * 5, vx: way * rand(46, 58),
          wobble: { amplitude: rand(4, 8), frequency: rand(3, 6) }, art: 'tallyPage',
        }));
      }
    }, { first: 0.1 });
    const dart = every(1.15, 1.4, (bullets, soul) => {
      const left = Math.random() < 0.5;
      bullets.push(new Shot({
        x: left ? box.x - 6 : box.x + box.w + 6, y: rand(box.y + 6, box.y + box.h - 6), vx: left ? 62 : -62, vy: 0,
        warn: 0.45, life: 3.4, homing: { target: soul, turn: 2.0 }, art: 'tallyDart',
      }));
    }, { first: 1.0 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real > 6.4) return;
        blow(dt, bullets);
        dart(dt, bullets, soul);
      },
    };
  },

  // THE QUILL. A quill dives in from the edge of the box after you and writes
  // as it goes: a trail of ink that stays where it was drawn, for a second or
  // so, then dries. It turns slowly, so it can be led round. Two, one after
  // the other.
  tallyQuill(box, density, { Shot, rand, pick }) {
    let real = 0;
    const quills = [];
    let spawned = 0;
    const nextAt = [0.2, 1.8, 3.4];
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (spawned < 3 && real >= nextAt[spawned]) {
          spawned++;
          const side = pick(['left', 'right', 'top']);
          const at = side === 'top' ? { x: rand(box.x + 10, box.x + box.w - 10), y: box.y - 8 } : { x: side === 'left' ? box.x - 8 : box.x + box.w + 8, y: rand(box.y + 12, box.y + box.h - 12) };
          const head = new Shot({
            x: at.x, y: at.y, vx: side === 'top' ? 0 : (side === 'left' ? 72 : -72), vy: side === 'top' ? 72 : 0,
            warn: 0.55, life: 3.6, homing: { target: soul, turn: 2.3 }, art: 'tallyQuill',
          });
          bullets.push(head);
          quills.push({ head, drip: 0 });
        }
        for (const q of quills) {
          if (q.head.age < q.head.warn || q.head.age > q.head.warn + q.head.life) continue;
          q.drip -= dt / density;
          if (q.drip > 0) continue;
          q.drip = 0.065;
          bullets.push(new Shot({ x: q.head.x, y: q.head.y, vx: 0, vy: 0, life: 1.3, art: 'inkDot' }));
        }
      },
    };
  },

  // THE ABACUS. Wires strung with beads slide across the box, each a row with a
  // gap in it, red and blue, one row after another going opposite ways like a
  // count going back and forth, each at a new height, the gap in each somewhere
  // new.
  tallyAbacus(box, density, { Shot, every, rand }) {
    let real = 0;
    let row = 0;
    const recent = [];
    const gapAt = shuffleBag([0.2, 0.4, 0.6, 0.8]);
    const slide = every(0.55, 0.68, (bullets, soul) => {
      const dir = row % 2 ? -1 : 1;
      row++;
      // A new height for each row (every other one at about where you are): never
      // close to the last two, so there is no height between the wires to stand at.
      const pickY = () => (row % 2 ? clamp(soul.y + rand(-7, 7), box.y + 8, box.y + box.h - 8) : rand(box.y + 8, box.y + box.h - 8));
      let y = pickY();
      for (let tries = 0; tries < 8 && recent.some((r) => Math.abs(r - y) < 13); tries++) y = pickY();
      recent.push(y);
      if (recent.length > 2) recent.shift();
      const gap = rand(17, 20);
      const span = box.w + 8;
      const gapMid = clamp(gapAt() * span, 14, span - 14);
      // The row trails out behind its leading bead, off the side it comes in at.
      for (let x = 0; x < span; x += 8) {
        if (Math.abs(x - gapMid) < gap / 2) continue;
        const start = dir > 0 ? box.x - 6 - x : box.x + box.w + 6 + x;
        bullets.push(new Shot({ x: start, y, vx: dir * 62, art: (x / 8) % 2 ? 'beadBlue' : 'beadRed' }));
      }
    }, { first: 0.1 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real > 6.3) return;
        slide(dt, bullets, soul);
      },
    };
  },

  // THE BOOKCASE. A case of books slides across the box from one side, then
  // the other, with a gap in it (a few books pulled out) at a new height each
  // time. Now and then a book works loose from the case and tumbles down.
  tallyShelves(box, density, { Shot, every, rand }) {
    let real = 0;
    let from = Math.random() < 0.5 ? 1 : -1;
    let lastGap = box.h / 2;
    const arts = ['spineRed', 'spineGreen', 'spineOrange'];
    const wall = every(1.3, 1.5, (bullets, soul) => {
      from = -from;
      // A gap of about 30px, at least 26px from the last one's middle.
      let gap = rand(16, box.h - 16);
      if (Math.abs(gap - lastGap) < 26) gap = clamp(lastGap + (lastGap > box.h / 2 ? -34 : 34), 16, box.h - 16);
      lastGap = gap;
      const x = from > 0 ? box.x - 8 : box.x + box.w + 8;
      for (let y = 6; y < box.h; y += 11) {
        if (Math.abs(y + 5 - gap) < 15) continue;
        bullets.push(new Shot({ x, y: box.y + y + 5, vx: from * 44, art: arts[Math.floor(y / 11) % 3] }));
        // A loose one: it drops out of the case as it crosses the box.
        if (Math.random() < 0.3) bullets.push(new Shot({ x, y: box.y + y + 5, vx: from * 44, vy: 0, warn: 0, gravity: 40, life: 4, art: 'fallenBook' }));
      }
    }, { first: 0.1 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real > 6.2) return;
        wall(dt, bullets, soul);
      },
    };
  },

  // ROLL CALL. It ticks you off a list: a row of check marks is drawn one
  // after another, each blinking where it will go off, close to where you
  // are and the one before. When one goes off it hurts for a moment and
  // throws motes of star-light out in a ring.
  tallyRollCall(box, density, { Shot, every, rand }) {
    let real = 0;
    let n = 0;
    const ticks = [];
    let last = null;
    const call = every(0.34, 0.4, (bullets, soul) => {
      n++;
      // Every other one is where you are; the rest lead you away from it.
      const base = n % 2 ? { x: soul.x, y: soul.y } : (last ?? { x: soul.x, y: soul.y });
      const spot = {
        x: clamp(base.x + rand(-17, 17), box.x + 8, box.x + box.w - 8),
        y: clamp(base.y + rand(-17, 17), box.y + 8, box.y + box.h - 8),
      };
      last = spot;
      const t = tickOff({ at: spot, r: 9, warn: 0.56 });
      ticks.push(t);
      bullets.push(t);
    }, { first: 0.1 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        for (let i = ticks.length - 1; i >= 0; i--) {
          const t = ticks[i];
          if (!t.went()) continue;
          ticks.splice(i, 1);
          const off = rand(0, Math.PI);
          for (let k = 0; k < 8; k++) {
            const a = off + (k / 8) * Math.PI * 2;
            bullets.push(new Shot({ x: t.x, y: t.y, vx: Math.cos(a) * 42, vy: Math.sin(a) * 42, life: 1.3, art: 'tallyMote' }));
          }
        }
        if (real > 6.2) return;
        call(dt, bullets, soul);
      },
    };
  },
  // THE FALLING STAR. The Welcome Register's own tune, drawn on the box: four stars
  // come down one after another, the way the four notes of the Falling Star fall
  // (high, a fifth below, a half-step lower, then home at the bottom), each one
  // landing on a tick that blinks where it will go off, and throwing motes out when it
  // does. The four make a staircase across the box, and a second staircase follows
  // from the other side before the first has quite cleared.
  tallyFalling(box, density, { Shot, every, rand }) {
    let real = 0;
    let n = 0;
    const ticks = [];
    // How far down the box each note lands: high, the fifth, the flat fifth, home.
    const NOTE = [0.1, 0.5, 0.6, 0.9];
    const stair = every(1.25, 1.45, (bullets, soul) => {
      n++;
      const dir = n % 2 ? 1 : -1;
      const step = 21;
      // The staircase is laid so the soul's own spot is on it somewhere.
      const x0 = clamp(soul.x - dir * step * (1 + Math.floor(Math.random() * 2)) , box.x + 10, box.x + box.w - 10 - step * 3);
      for (let i = 0; i < 4; i++) {
        const x = clamp(dir > 0 ? x0 + i * step : x0 + (3 - i) * step, box.x + 8, box.x + box.w - 8);
        const y = box.y + 8 + NOTE[i] * (box.h - 16);
        const warn = 0.58 + i * 0.27;
        const t = tickOff({ at: { x, y }, r: 10, warn });
        ticks.push(t);
        bullets.push(t);
        // The star itself, falling out of the dark to land on it just as it goes off.
        bullets.push(new Shot({ x, y: box.y - 8, vy: (y - (box.y - 8)) / warn, harmless: true, life: warn, art: 'tallyFallStar' }));
      }
    }, { first: 0.1 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        for (let i = ticks.length - 1; i >= 0; i--) {
          const t = ticks[i];
          if (!t.went()) continue;
          ticks.splice(i, 1);
          const off = rand(0, Math.PI);
          for (let k = 0; k < 6; k++) {
            const a = off + (k / 6) * Math.PI * 2;
            bullets.push(new Shot({ x: t.x, y: t.y, vx: Math.cos(a) * 40, vy: Math.sin(a) * 40, life: 1.2, art: 'tallyMote' }));
          }
        }
        if (real > 6.0) return;
        stair(dt, bullets, soul);
      },
    };
  },
};

// THE MARGINS: two of the others at once, the second a beat late; now and then
// three, each a beat after the last.
const MIXES = [
  ['tallyMarks', 'tallyInk'],
  ['tallyStamp', 'tallyPages'],
  ['tallyQuill', 'tallyShelves'],
  ['tallyAbacus', 'tallyRollCall'],
  ['tallyInk', 'tallyShelves'],
  ['tallyPages', 'tallyRollCall'],
  ['tallyMarks', 'tallyQuill'],
  ['tallyStamp', 'tallyAbacus'],
  ['tallyFalling', 'tallyMarks'],
  ['tallyFalling', 'tallyAbacus'],
  ['tallyFalling', 'tallyShelves'],
  ['tallyQuill', 'tallyInk'],
];
const TRIPLES = [
  ['tallyMarks', 'tallyInk', 'tallyPages'],
  ['tallyStamp', 'tallyFalling', 'tallyInk'],
  ['tallyAbacus', 'tallyRollCall', 'tallyPages'],
  ['tallyShelves', 'tallyFalling', 'tallyQuill'],
];
TALLY_ATTACKS.tallyMargins = (box, density, tools) => {
  const heavy = Math.random() < 0.4;
  const names = heavy ? TRIPLES[Math.floor(Math.random() * TRIPLES.length)] : MIXES[Math.floor(Math.random() * MIXES.length)];
  // (Three at once are each a little lighter.)
  const parts = names.map((name) => TALLY_ATTACKS[name](box, heavy ? density * 0.82 : density, tools));
  let t = 0;
  const beat = (heavy ? 0.6 : 0.55) * density;
  return {
    duration: Math.min(9.5, Math.max(...parts.map((part, i) => part.duration + i * 0.6))),
    update: (dt, bullets, soul) => {
      t += dt;
      parts.forEach((part, i) => { if (t >= beat * i) part.update(dt, bullets, soul); });
    },
  };
};
