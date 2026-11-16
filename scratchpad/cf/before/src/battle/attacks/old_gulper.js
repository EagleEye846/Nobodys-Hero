import { defineBulletArt, Shot as ShotClass } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { Ring } from './underShapes.js';

// Old Gulper's attacks. A giant, very old moray eel who nests in the fallen
// great bell of Merrow's bell tower, with toothache. His nest is his arsenal:
// he lunges through the box (a long mottled body sliding along a wavy path,
// with gaps where it dips under), blows clouds of bubbles out of his gills
// that pop into spray, whips his tail across the box in a sweep, sucks the
// water (and you, and his nest's spoons, bones and buttons) toward his open
// mouth, and bumps the great bell so its rings go round the tower and come
// back off the far wall. Wide awake (his second phase) he adds a chomp: his
// jaws shut on the whole box, and the only safe place is the little pocket
// his crooked tooth props open. He lies to the right of the box, so most
// things come from that side.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`.
// `update` is given dt times `density`; a hazard's own clock is real time.
// The hazards drawn here (Eel, Tail, Maw, Jaws) move themselves in their own
// update and carry no x/y of their own, so a bot (or a player) can read them;
// telegraphs come first and anything aimed follows you until about a third
// of a second before it goes, then locks.

const P = {
  k: '#1b1a22', w: '#ffffff', W: '#f4f0dc', g: '#7a8a2a', G: '#4a5a1c', y: '#c8c050', Y: '#e8e090',
  e: '#2a2230', E: '#eef2d4', r: '#c84a3a', R: '#6a2226', c: '#9fd8e4', C: '#d4f2fa', b: '#b08a3a',
  B: '#6a5020', v: '#5aa890', V: '#3a7a68', s: '#c8c8c0', S: '#8a8a84', o: '#d88a4a', n: '#e8d8b8',
};


// The head, pointing RIGHT (it is turned to face where it is going): an open
// mouth of needle teeth, the big pale eye, the crooked tooth out at the front.
const head = (open) => art(17, 13, (p) => {
  p.ellipse(6, 6, 6, 4.6, 'g');
  p.ellipse(5, 4, 4, 2, 'y', ['g']);
  p.poly([[8, 2 - open * 0.5], [16, 3 - open], [16, 5 - open * 0.3], [8, 6]], 'g');
  p.poly([[8, 7], [16, 8 + open * 0.3], [15, 10 + open], [8, 10]], 'G');
  p.poly([[9, 5], [16, 5 - open * 0.3], [16, 8 + open * 0.3], [9, 7]], 'R');
  for (let x = 10; x <= 15; x += 2) { p.set(x, 5 - open * 0.3 + 0.4, 'W'); p.set(x + 1, 8 + open * 0.3 - 0.4, 'W'); }
  // The crooked tooth, sticking out and up.
  p.set(16, 2 - open, 'W');
  p.set(15, 3 - open, 'W');
  p.ellipse(6, 4, 1.8, 1.8, 'E');
  p.set(7, 4, 'e');
  p.set(3, 7, 'G');
  p.set(5, 8, 'y');
});
defineBulletArt('gulpHead', { frames: [head(0), head(1)], palette: P, radius: 5.4, rotate: true, frameSeconds: 0.12 });

// A gill bubble: a thick wobbly ring with a shine; it swells and blinks
// before it pops (gulpBubbleSwell).
const bubble = (k) => art(13, 13, (p) => {
  p.ellipse(6, 6, 5.4, 5.4 - k * 0.5, 'c');
  p.ellipse(6, 6, 4.2, 4.2 - k * 0.5, 'C');
  p.ellipse(6, 6, 3, 3 - k * 0.5, 'c', ['C']);
  p.ellipse(6, 6, 2, 2 - k * 0.5, 'C');
  p.rect(3, 3, 2, 1, 'w');
  p.set(3, 4, 'w');
  p.set(8, 9 - k, 'v');
});
defineBulletArt('gulpBubble', { frames: [bubble(0), bubble(1)], palette: P, radius: 4.6, frameSeconds: 0.3 });
const swell = (k) => art(15, 15, (p) => {
  p.ellipse(7, 7, 6.4, 6.4, k ? 'w' : 'c');
  p.ellipse(7, 7, 5, 5, 'C');
  p.ellipse(7, 7, 3.4, 3.4, k ? 'c' : 'w', ['C']);
  p.ellipse(7, 7, 2.2, 2.2, 'C');
  p.rect(3, 3, 3, 1, 'w');
});
defineBulletArt('gulpBubbleSwell', { frames: [swell(0), swell(1)], palette: P, radius: 5.4, frameSeconds: 0.07 });

// Spray from a popped bubble or a whipped tail: a little green-blue drop.
defineBulletArt('gulpSpray', {
  frames: [art(5, 6, (p) => { p.set(2, 0, 'v'); p.rect(1, 1, 3, 4, 'c'); p.set(2, 2, 'w'); p.set(2, 4, 'v'); })],
  palette: P,
  radius: 1.9,
});

// Nest junk sucked toward his mouth: a spoon, a fish bone, a button.
defineBulletArt('gulpSpoon', {
  frames: [art(13, 7, (p) => { p.ellipse(3, 3, 2.6, 2, 's'); p.ellipse(3, 2.6, 1.4, 1, 'w', ['s']); p.line(5, 3, 12, 3, 's'); p.line(7, 4, 12, 4, 'S'); })],
  palette: P,
  radius: 3.2,
  spin: 5,
});
defineBulletArt('gulpBone', {
  frames: [art(13, 9, (p) => {
    p.line(1, 4, 11, 4, 'n');
    for (let x = 3; x <= 9; x += 2) { p.line(x, 1, x + 1, 4, 'n'); p.line(x, 7, x + 1, 4, 'n'); }
    p.poly([[9, 1], [12, 4], [9, 7]], 'n');
    p.set(10, 4, 'S');
  })],
  palette: P,
  radius: 3.4,
  spin: -3,
});
defineBulletArt('gulpButton', {
  frames: [art(8, 8, (p) => { p.ellipse(3.5, 3.5, 3.2, 3.2, 'o'); p.ellipse(3.5, 3.5, 2, 2, 'b', ['o']); for (const [x, y] of [[3, 3], [4, 3], [3, 4], [4, 4]]) p.set(x, y, 'e'); })],
  palette: P,
  radius: 2.8,
  spin: 6,
});

// A streak in the current (harmless): shows which way the water is going.
defineBulletArt('gulpStreak', {
  frames: [art(9, 3, (p) => { p.line(0, 1, 7, 1, 'C'); })],
  palette: P,
  radius: 1,
  rotate: true,
});

// A flake of green bronze shaken off the bell and the beams by a ring.
defineBulletArt('gulpFlake', {
  frames: [
    art(7, 5, (p) => { p.poly([[0, 2], [3, 0], [6, 1], [5, 3], [2, 4]], 'v'); p.line(1, 2, 4, 1, 'V'); }),
    art(7, 5, (p) => { p.poly([[1, 1], [5, 0], [6, 3], [2, 4]], 'V'); p.set(3, 2, 'v'); }),
  ],
  palette: P,
  radius: 2.6,
  frameSeconds: 0.18,
});

// The bell's mark where a ring starts (harmless): the great bell's lip.
defineBulletArt('gulpBell', {
  frames: [
    art(13, 10, (p) => { p.ellipse(6, 5, 5, 4, 'b'); p.rect(1, 6, 11, 2, 'B'); p.line(3, 2, 3, 6, 'Y'); p.set(6, 9, 'B'); }),
    art(13, 10, (p) => { p.ellipse(6, 4, 5, 4, 'b'); p.rect(1, 5, 11, 2, 'B'); p.line(4, 1, 4, 5, 'Y'); p.set(7, 8, 'B'); }),
  ],
  palette: P,
  radius: 1,
  frameSeconds: 0.12,
});

// The crooked tooth that props his jaws open (harmless: the safe spot).
defineBulletArt('gulpTooth', {
  frames: [
    art(7, 11, (p) => { p.poly([[2, 0], [5, 3], [5, 10], [1, 10]], 'W'); p.line(2, 2, 2, 9, 'w'); p.set(4, 9, 'n'); }),
    art(7, 11, (p) => { p.poly([[2, 0], [5, 3], [5, 10], [1, 10]], 'w'); p.line(3, 2, 3, 9, 'Y'); }),
  ],
  palette: P,
  radius: 1,
  frameSeconds: 0.12,
});

// The bits of art the hand-drawn hazards stamp (a Shot made once to fetch it).
const artOf = (name) => new ShotClass({ x: 0, y: 0, art: name }).art;
let HEAD = null;

// The colours of his body, in the order the mottles go.
const BODY = ['#7a8a2a', '#8a9a32', '#6e7e26'];
const MOTTLE = ['#c8c050', '#4a5a1c', '#e8e090'];

// ---------------------------------------------------------------------------
// Eel: Old Gulper's body, lunging through the box along a wavy path. The path
// is fixed once it locks; the head runs along it and the body follows it like
// a train, so wherever the path goes the whole length of him passes. Some
// segments are missing (where he dips under), so you can slip through. While
// it warns, the path follows you (it runs right through where you are) until
// a third of a second before he comes.
class Eel {
  constructor({ box, ox, oy, dir, amp = 10, wl = 64, vx = 150, segs = 24, gaps = [], warn = 0.9, follow = null, offset = 0 }) {
    Object.assign(this, { box, ox, oy, dir, amp, wl, vx, segs, warn, follow, offset });
    this.gaps = new Set(gaps);
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.ph = Math.random() * Math.PI * 2;
    this.space = 5;
    // Long enough to cross the box whichever way it comes.
    this.pathLen = Math.hypot(box.w, box.h) + 40;
    this.nx = -Math.sin(dir);
    this.ny = Math.cos(dir);
  }

  point(s) {
    const off = this.amp * Math.sin((s / this.wl) * Math.PI * 2 + this.ph);
    return { x: this.ox + Math.cos(this.dir) * s + this.nx * off, y: this.oy + Math.sin(this.dir) * s + this.ny * off };
  }

  get headS() {
    return (this.age - this.warn) * this.vx;
  }

  update(dt) {
    this.age += dt;
    if (this.follow && dt > 0) {
      // Which way you're going, smoothed, so it can lead you a little.
      if (this.seen) {
        this.hx = (this.hx ?? 0) * 0.85 + ((this.follow.x - this.seen.x) / dt) * 0.15;
        this.hy = (this.hy ?? 0) * 0.85 + ((this.follow.y - this.seen.y) / dt) * 0.15;
      }
      this.seen = { x: this.follow.x, y: this.follow.y };
    }
    if (this.follow && this.age < this.warn - 0.33) {
      // Slide the path sideways so it runs through you (at the wave where you
      // are, a little ahead of where you're heading), or `offset` to one side
      // of you (the second of a pair).
      const lead = 0.25;
      const b = this.box;
      const rx = Math.min(b.x + b.w - 5, Math.max(b.x + 5, this.follow.x + (this.hx ?? 0) * lead)) - this.ox;
      const ry = Math.min(b.y + b.h - 5, Math.max(b.y + 5, this.follow.y + (this.hy ?? 0) * lead)) - this.oy;
      const along = rx * Math.cos(this.dir) + ry * Math.sin(this.dir);
      const across = rx * this.nx + ry * this.ny;
      const wave = this.amp * Math.sin((along / this.wl) * Math.PI * 2 + this.ph);
      const goal = across - wave - this.offset;
      const step = Math.max(-150 * dt, Math.min(150 * dt, goal));
      this.ox += this.nx * step;
      this.oy += this.ny * step;
    }
  }

  isGone() {
    return this.age > this.warn && this.headS - this.segs * this.space > this.pathLen;
  }

  // Each live segment: { x, y, r, i } from the head back.
  parts() {
    const out = [];
    const h = this.headS;
    if (h < 0) return out;
    for (let i = 0; i < this.segs; i++) {
      if (this.gaps.has(i)) continue;
      const s = h - i * this.space;
      if (s < 0 || s > this.pathLen) continue;
      const p = this.point(s);
      const r = i === 0 ? 5.4 : i > this.segs - 5 ? 4.6 - (i - (this.segs - 5)) * 0.6 : 4.4;
      out.push({ ...p, r, i, s });
    }
    return out;
  }

  edgeDistance(px, py) {
    if (this.age < this.warn) return Infinity;
    let best = Infinity;
    for (const q of this.parts()) best = Math.min(best, Math.hypot(px - q.x, py - q.y) - q.r);
    return best;
  }

  draw(ctx) {
    ctx.save();
    if (this.age < this.warn) {
      // The path he will come along: a dashed wavy line, blinking.
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.25 : 0.6;
      ctx.fillStyle = '#c8c050';
      for (let s = 0; s < this.pathLen; s += 4) {
        if (Math.floor(s / 4) % 2) continue;
        const p = this.point(s);
        ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 1);
      }
      ctx.restore();
      return;
    }
    const parts = this.parts();
    // Tail first, so the head is on top.
    for (let k = parts.length - 1; k >= 0; k--) {
      const q = parts[k];
      if (q.i === 0) continue;
      ctx.fillStyle = '#1b1a22';
      ctx.beginPath();
      ctx.arc(q.x, q.y, q.r + 1, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let k = parts.length - 1; k >= 0; k--) {
      const q = parts[k];
      if (q.i === 0) continue;
      ctx.fillStyle = BODY[q.i % 3];
      ctx.beginPath();
      ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = MOTTLE[(q.i * 7) % 3];
      ctx.fillRect(Math.round(q.x - 1 + ((q.i * 3) % 3) - 1), Math.round(q.y - 2 + (q.i % 2) * 2), 2, 2);
      // A ripple where he dips under (next to a gap).
      if (this.gaps.has(q.i + 1) || this.gaps.has(q.i - 1)) {
        ctx.strokeStyle = 'rgba(212, 242, 250, 0.7)';
        ctx.strokeRect(Math.round(q.x - 5), Math.round(q.y + 4), 10, 1);
      }
    }
    const lead = parts.find((q) => q.i === 0);
    if (lead) {
      HEAD ??= artOf('gulpHead');
      const frame = HEAD.frames[Math.floor(this.age / 0.12) % 2];
      const ahead = this.point(lead.s + 2);
      ctx.translate(lead.x, lead.y);
      ctx.rotate(Math.atan2(ahead.y - lead.y, ahead.x - lead.x));
      ctx.drawImage(frame, -frame.width / 2, -frame.height / 2);
    }
    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// Tail: his tail, swung from a pivot off the right of the box like a scythe,
// through a wedge with you in it (the wedge follows you while it warns), and
// then back again. Get out of the wedge, either side; being behind it as it
// passes is no good, because it comes back.
class Tail {
  constructor({ box, px, py, len = 108, spread = 0.62, warn = 0.85, down = true, follow = null }) {
    Object.assign(this, { box, px, py, len, spread, warn, down, follow });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.swing = 0.28;
    this.hold = 0.22;
    this.back = 0.32;
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

  // The tail's angle now (null while it warns or once it's done).
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
    // It stops following you half a second (his time) before the swing, so there is a moment to step out.
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
    const thick = 3.6 - (along / this.len) * 1.6;
    return Math.hypot(px - cx, py - cy) - thick;
  }

  draw(ctx) {
    ctx.save();
    if (this.age < this.warn) {
      // The wedge he'll sweep: its two edges, blinking.
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.25 : 0.6;
      ctx.strokeStyle = '#e8e090';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      for (const a of [this.a0, this.a1]) {
        ctx.beginPath();
        ctx.moveTo(this.px, this.py);
        ctx.lineTo(this.px + Math.cos(a) * this.len, this.py + Math.sin(a) * this.len);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.globalAlpha *= 0.35;
      ctx.fillStyle = '#c8c050';
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
    ctx.translate(this.px, this.py);
    ctx.rotate(a);
    // A tapering mottled tail with a fin along it, the tip flicking.
    ctx.fillStyle = '#1b1a22';
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(this.len, -2.2);
    ctx.lineTo(this.len + 3, 0);
    ctx.lineTo(this.len, 2.2);
    ctx.lineTo(0, 5);
    ctx.fill();
    ctx.fillStyle = '#7a8a2a';
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(this.len, -1.2);
    ctx.lineTo(this.len + 1.5, 0);
    ctx.lineTo(this.len, 1.2);
    ctx.lineTo(0, 4);
    ctx.fill();
    ctx.fillStyle = '#c8c050';
    for (let s = 6; s < this.len - 4; s += 9) ctx.fillRect(s, -1 + ((s / 9) % 2), 3, 2);
    ctx.fillStyle = '#4a5a1c';
    for (let s = 10; s < this.len - 4; s += 13) ctx.fillRect(s, 1, 2, 2);
    // The fin.
    ctx.fillStyle = '#e8e090';
    const flick = Math.sin(this.age * 40) * 1.2;
    for (let s = 4; s < this.len; s += 3) ctx.fillRect(s, -5 + (s / this.len) * 2.4 + (s > this.len - 12 ? flick : 0), 2, 1);
    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// Maw: his open mouth at the right edge of the box, a half ring of needle
// teeth, drifting up and down a little. Touch it and it bites.
class Maw {
  constructor({ box, oy, life = 6, warn = 0.6 }) {
    Object.assign(this, { box, oy, life, warn });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.r = 13;
    this.base = oy;
    this.sway = Math.random() * Math.PI * 2;
  }

  get mouth() {
    return { mx: this.box.x + this.box.w + 2, my: this.base + Math.sin(this.age * 1.1 + this.sway) * 22 };
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.warn + this.life + 0.25;
  }

  edgeDistance(px, py) {
    if (this.age < this.warn || this.age > this.warn + this.life) return Infinity;
    const { mx, my } = this.mouth;
    return Math.hypot(px - mx, py - my) - this.r;
  }

  draw(ctx) {
    const { mx, my } = this.mouth;
    ctx.save();
    const over = this.age - this.warn - this.life;
    if (this.age < this.warn) ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.3 : 0.7;
    else if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
    // The dark throat, the lips, a fringe of needle teeth pointing in.
    ctx.fillStyle = '#1b1a22';
    ctx.beginPath();
    ctx.arc(mx, my, this.r + 2, Math.PI / 2, Math.PI * 1.5);
    ctx.fill();
    ctx.fillStyle = '#6a2226';
    ctx.beginPath();
    ctx.arc(mx, my, this.r, Math.PI / 2, Math.PI * 1.5);
    ctx.fill();
    ctx.fillStyle = '#c84a3a';
    ctx.beginPath();
    ctx.arc(mx, my, this.r - 4, Math.PI / 2, Math.PI * 1.5);
    ctx.fill();
    ctx.fillStyle = '#f4f0dc';
    for (let k = 0; k < 9; k++) {
      const a = Math.PI / 2 + ((k + 0.5) / 9) * Math.PI;
      const x = mx + Math.cos(a) * (this.r - 1);
      const y = my + Math.sin(a) * (this.r - 1);
      ctx.fillRect(Math.round(x), Math.round(y), 2, 2);
      ctx.fillRect(Math.round(x - Math.cos(a) * 2), Math.round(y - Math.sin(a) * 2), 1, 1);
    }
    // The crooked one.
    ctx.fillRect(Math.round(mx - this.r - 2), Math.round(my - 4), 3, 2);
    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// Jaws (wide awake): his jaws come down and up over the whole box and shut.
// The only safe spot is the pocket his crooked tooth props open (shown while
// it warns, with the tooth blinking in it), and it's never where you are.
// The jaws' colours: his hide (dark to pale), the gums, the teeth, his throat.
const GULP_JAW = {
  k: '#1b1a22', G: '#3e4c18', h: '#5e6e22', g: '#7a8a2a', y: '#a4ae3c', Y: '#c8c050',
  R: '#6a2226', r: '#a83c34', a: '#d8574a', W: '#f4f0dc', S: '#c4bc9a', w: '#ffffff',
  c: '#8a6a3a', n: '#d8c890', d: '#2a0e12',
};

class Jaws {
  constructor({ box, cx, cy, warn = 1.05, pw = 10, ph = 9 }) {
    Object.assign(this, { box, cx, cy, warn, pw, ph });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.close = 0.3;
    this.hold = 0.42;
    this.open = 0.32;
  }

  get end() {
    return this.warn + this.close + this.hold + this.open;
  }

  // How shut they are, 0 to 1.
  shut() {
    const t = this.age - this.warn;
    if (t < 0) return 0;
    if (t < this.close) return t / this.close;
    if (t < this.close + this.hold) return 1;
    return Math.max(0, 1 - (t - this.close - this.hold) / this.open);
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.end + 0.05;
  }

  // Where the edges of the two jaws are just now (top jaw's lower edge, bottom jaw's upper edge).
  edges() {
    const b = this.box;
    const k = this.shut();
    return { top: b.y - 6 + (this.cy - (b.y - 6)) * k, bottom: b.y + b.h + 6 - (b.y + b.h + 6 - this.cy) * k };
  }

  edgeDistance(px, py) {
    if (this.age < this.warn || this.shut() <= 0.02) return Infinity;
    const { top, bottom } = this.edges();
    const inPocket = Math.abs(px - this.cx) <= this.pw;
    const t = inPocket ? Math.min(top, this.cy - this.ph) : top;
    const u = inPocket ? Math.max(bottom, this.cy + this.ph) : bottom;
    let d = Math.min(py - t, u - py);
    // Inside the pocket's column but where the jaws would be: the pocket's side walls.
    if (inPocket && (py < top || py > bottom)) d = Math.min(d, this.pw - Math.abs(px - this.cx));
    return d;
  }

  draw(ctx) {
    const b = this.box;
    ctx.save();
    if (this.age < this.warn) {
      // Where they'll meet, and the pocket, with the crooked tooth blinking in it.
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.3 : 0.7;
      ctx.strokeStyle = '#f4f0dc';
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(b.x, Math.round(this.cy) + 0.5);
      ctx.lineTo(Math.round(this.cx - this.pw), Math.round(this.cy) + 0.5);
      ctx.moveTo(Math.round(this.cx + this.pw), Math.round(this.cy) + 0.5);
      ctx.lineTo(b.x + b.w, Math.round(this.cy) + 0.5);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = '#e8e090';
      ctx.strokeRect(Math.round(this.cx - this.pw) + 0.5, Math.round(this.cy - this.ph) + 0.5, this.pw * 2, this.ph * 2);
      ctx.restore();
      return;
    }
    const over = this.age - this.end;
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.05);
    const k = this.shut();
    const L = Math.round(this.cx - this.pw);
    const R = Math.round(this.cx + this.pw);
    const x0 = b.x - 2;
    const x1 = b.x + b.w + 2;
    const fill = (c, x, y, w, h) => {
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    };
    // One jaw: the mottled olive hide, darker toward the back of the jaw; a
    // pale lip, then the gum line, scalloped between the teeth. The bands and
    // the mottles are laid out from the lip, so they ride with it as he bites.
    // (Only the look: where they hurt is edges() and edgeDistance().)
    // `hide` is the lip the hide's shading is laid out from (the pocket's
    // column keeps the outer jaw's, so the hide runs on unbroken over it).
    const wob = (x) => Math.round(Math.sin(x * 0.7) * 0.8 + Math.sin(x * 0.23 + 1.3) * 1.2);
    const jaw = (y0, y1, lip, up, hide = lip) => {
      const yA = Math.round(Math.min(y0, y1));
      const yB = Math.round(Math.max(y0, y1));
      if (yB <= yA) return;
      const ly = Math.round(lip);
      const hy = Math.round(hide);
      const dir = up ? 1 : -1; // from the lip into the jaw
      fill(GULP_JAW.k, x0, yA - 1, x1 - x0, yB - yA + 2);
      fill(GULP_JAW.g, x0, yA, x1 - x0, yB - yA);
      // Bands, a column at a time, their edges wavy so it reads as hide.
      const band = (from, to, c, base) => {
        for (let x = x0; x < x1; x++) {
          const w = wob(x + (up ? 17 : 0));
          const a = base + dir * (from + w);
          const z = base + dir * (to + w);
          const top = Math.max(yA, Math.min(a, z));
          const bot = Math.min(yB, Math.max(a, z));
          if (bot > top) fill(c, x, top, 1, bot - top);
        }
      };
      band(15, 25, GULP_JAW.h, hy);
      band(25, 999, GULP_JAW.G, hy);
      // Mottles and specks.
      for (let i = 0; i < 30; i++) {
        const mx = x0 + ((i * 29 + 7) % (x1 - x0 - 3));
        const d = 8 + ((i * 41) % 36);
        const my = hy + dir * d;
        if (my < yA + 1 || my > yB - 2) continue;
        const c = d > 26 ? GULP_JAW.h : d > 15 ? (i % 3 ? GULP_JAW.G : GULP_JAW.g) : i % 3 ? GULP_JAW.h : GULP_JAW.y;
        fill(c, mx, my, i % 2 ? 3 : 2, i % 4 ? 1 : 2);
      }
      // The pale lip.
      band(3, 6, GULP_JAW.y, ly);
      for (let x = x0; x < x1; x++) if ((x * 7) % 5 === 0) fill(GULP_JAW.Y, x, ly + dir * 4, 1, 1);
      // The gum: dark red, a sore lighter edge, little bumps between teeth.
      const gA = up ? ly : ly - 3;
      fill(GULP_JAW.R, x0, Math.max(yA, gA), x1 - x0, 3);
      fill(GULP_JAW.r, x0, up ? ly : ly - 1, x1 - x0, 1);
      for (let x = b.x + 2; x < x1 - 1; x += 4) fill(GULP_JAW.R, x, up ? ly + 3 : ly - 4, 2, 1);
    };
    // Needle teeth along a lip: long and short in turn, pale, shaded on one
    // side; the bottom row sits between the top row's, so they lock.
    const teeth = (y, up, from, to) => {
      const ly = Math.round(y);
      const dir = up ? -1 : 1; // the way they point
      for (let x = from + (up ? 2 : 0), i = 0; x < to - 1; x += 4, i++) {
        const len = i % 2 ? 3 : 4;
        // Dark edge, then the tooth tapering to a point.
        for (let j = 0; j <= len; j++) {
          const w = j < len - 1 ? 2 : 1;
          const yy = dir > 0 ? ly + j : ly - 1 - j;
          fill(GULP_JAW.k, x - 1, yy, w + 2, 1);
        }
        for (let j = 0; j < len; j++) {
          const yy = dir > 0 ? ly + j : ly - 1 - j;
          if (j < len - 1) {
            fill(GULP_JAW.W, x, yy, 1, 1);
            fill(GULP_JAW.S, x + 1, yy, 1, 1);
          } else fill(GULP_JAW.w, x, yy, 1, 1);
        }
      }
    };
    const { top, bottom } = this.edges();
    const pocketTop = Math.min(top, this.cy - this.ph);
    const pocketBottom = Math.max(bottom, this.cy + this.ph);
    // Inside his mouth: the gap between the jaws (and the pocket) goes the
    // dark red of his throat as they shut.
    if (k > 0.2) {
      ctx.save();
      ctx.globalAlpha *= Math.min(1, (k - 0.2) * 2) * 0.55;
      ctx.fillStyle = GULP_JAW.d;
      ctx.beginPath();
      if (bottom > top) ctx.rect(b.x, Math.round(top), b.w, Math.round(bottom - top));
      ctx.rect(L, Math.round(pocketTop), R - L, Math.round(pocketBottom - pocketTop));
      ctx.fill();
      ctx.restore();
    }
    // Both jaws, with the pocket notched out of them.
    ctx.save();
    ctx.beginPath();
    ctx.rect(b.x - 4, b.y - 8, L - (b.x - 4), b.h + 16);
    ctx.rect(R, b.y - 8, b.x + b.w + 4 - R, b.h + 16);
    ctx.clip();
    jaw(b.y - 8, top, top, false);
    jaw(bottom, b.y + b.h + 8, bottom, true);
    teeth(top, false, b.x, b.x + b.w);
    teeth(bottom, true, b.x, b.x + b.w);
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.rect(L, b.y - 8, R - L, b.h + 16);
    ctx.clip();
    jaw(b.y - 8, pocketTop, pocketTop, false, top);
    jaw(pocketBottom, b.y + b.h + 8, pocketBottom, true, bottom);
    // (No teeth on the pocket's lips: worn away round the sore one, so the
    // pocket looks exactly as big as it is.)
    ctx.restore();
    // The crooked tooth, propping the pocket open once they're nearly shut:
    // a big old fang, leaning, cracked, its gum swollen red round the root.
    if (k > 0.6) {
      const y0 = Math.round(this.cy - this.ph);
      const h = Math.round(this.ph * 2);
      const at = (j) => R - 2 - Math.round((j / h) * 3);
      // Swollen gum at the root, throbbing.
      const throb = Math.floor(this.age * 6) % 2;
      fill(GULP_JAW.k, R - 5, y0 - 4, 8, 4);
      fill(GULP_JAW.a, R - 4, y0 - 3, 6, 3);
      fill(GULP_JAW.r, R - 3, y0 - 3, 3, 1);
      if (throb) {
        fill(GULP_JAW.a, R + 3, y0 - 6, 1, 2);
        fill(GULP_JAW.a, R - 7, y0 - 6, 1, 2);
      }
      for (let j = -1; j <= h; j++) {
        const x = at(Math.max(0, j));
        const w = j < h * 0.7 ? 4 : 3;
        fill(GULP_JAW.k, x - 1, y0 + j, w + 2, 1);
      }
      for (let j = 0; j < h; j++) {
        const x = at(j);
        const w = j < h * 0.7 ? 4 : 3;
        fill(GULP_JAW.W, x, y0 + j, w, 1);
        fill(GULP_JAW.w, x, y0 + j, 1, 1);
        fill(GULP_JAW.S, x + w - 1, y0 + j, 1, 1);
      }
      // A brown crack down it, and a stain at the root.
      fill(GULP_JAW.c, at(2) + 2, y0 + 2, 1, 3);
      fill(GULP_JAW.c, at(5) + 1, y0 + 5, 1, 2);
      fill(GULP_JAW.n, at(0) + 1, y0, 2, 1);
    }
    ctx.restore();
  }
}

// A heading tracker, so aimed things can lead you a little.
function tracker() {
  const heading = { x: 0, y: 0 };
  const seen = { x: null, y: null };
  return {
    heading,
    see(soul, dt) {
      if (seen.x !== null && dt > 0) {
        heading.x = heading.x * 0.85 + ((soul.x - seen.x) / dt) * 0.15;
        heading.y = heading.y * 0.85 + ((soul.y - seen.y) / dt) * 0.15;
      }
      seen.x = soul.x;
      seen.y = soul.y;
    },
  };
}

// A pocket for the jaws: a spot 26-44 px from you, inside the box.
function pocketAway(box, soul, rand, clamp) {
  let best = null;
  for (let tries = 0; tries < 16; tries++) {
    const a = rand(0, Math.PI * 2);
    const d = rand(26, 44);
    const x = clamp(soul.x + Math.cos(a) * d, box.x + 14, box.x + box.w - 14);
    const y = clamp(soul.y + Math.sin(a) * d, box.y + 14, box.y + box.h - 14);
    const dist = Math.hypot(x - soul.x, y - soul.y);
    if (dist >= 24 && dist <= 48) return { x, y };
    if (!best || dist > Math.hypot(best.x - soul.x, best.y - soul.y)) best = { x, y };
  }
  return best;
}

// Bubbles from his gills: shared by the bubbles attack and the chomp.
function gillBubble(box, soul, bullets, pops, { Shot, rand, clamp }) {
  const y = clamp(soul.y + rand(-18, 18), box.y + 8, box.y + box.h - 8);
  const shot = new Shot({ x: box.x + box.w + 8, y, vx: -rand(34, 44), vy: -rand(2, 8), warn: 0.3, life: 6, art: 'gulpBubble', wobble: { frequency: rand(3.5, 5), amplitude: 4 } });
  bullets.push(shot);
  pops.push({ shot, atX: clamp(soul.x + rand(10, 22) * (Math.random() < 0.5 ? -1 : 1), box.x + 14, box.x + box.w - 12), swelled: false, done: false });
}

function updatePops(pops, bullets, { Shot }) {
  for (const pop of pops) {
    const s = pop.shot;
    if (pop.done || s.age < s.warn) continue;
    // About a third of a second out, it swells and blinks.
    if (!pop.swelled && s.x <= pop.atX + Math.abs(s.vx) * 0.38) {
      pop.swelled = true;
      SWELL ??= artOf('gulpBubbleSwell');
      s.art = SWELL;
      s.r = SWELL.radius;
    }
    if (s.x > pop.atX) continue;
    pop.done = true;
    s.life = 0;
    s.age = s.warn + 0.01;
    const turn = Math.random() * Math.PI;
    for (let k = 0; k < 6; k++) {
      const a = turn + (k / 6) * Math.PI * 2;
      bullets.push(new Shot({ x: s.x, y: s.y, vx: Math.cos(a) * 31, vy: Math.sin(a) * 31, art: 'gulpSpray', life: 1.4 }));
    }
  }
}
let SWELL = null;

export const OLD_GULPER_ATTACKS = {
  // Lunge: he comes through the box, jaws first, the whole long length of him
  // following along a wavy path that runs through you (it shows first, and
  // follows you until just before he comes). Gaps where he dips under. From
  // the right, then slanting down or up from the corners, a little quicker
  // each time; late in the turn two at once from different sides.
  gulpLunge(box, density, { rand }) {
    let t = 0;
    let n = 0;
    let next = 0.2;
    const track = tracker();
    const R = box.x + box.w + 12;
    const gapsFor = () => {
      const a = Math.floor(rand(5, 9));
      const b = Math.floor(rand(13, 17));
      return [a, a + 1, a + 2, b, b + 1, b + 2];
    };
    return {
      // (Its last lunge is done by 5.5 s: 6.6, was 7.6, so the next attack isn't long in coming.)
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        track.see(soul, dt / density);
        if (n < 5 && t >= next) {
          next = t + rand(1.3, 1.8);
          const kinds = [
            { ox: R, oy: soul.y, dir: Math.PI },
            { ox: R, oy: box.y - 12, dir: Math.PI - 0.62 },
            { ox: R, oy: box.y + box.h + 12, dir: Math.PI + 0.62 },
          ];
          const k = kinds[n === 0 ? 0 : 1 + ((n + Math.floor(rand(0, 2))) % 2)];
          bullets.push(new Eel({ box, ...k, amp: rand(7, 11), wl: rand(56, 72), vx: 140 + n * 6, gaps: gapsFor(), warn: 0.95, follow: soul }));
          // From the second lunge on, another of him (his coils are long) a
          // step to the side you're heading, so you can't just keep going.
          if (n >= 1 && n <= 3) {
            const across = track.heading.x * -Math.sin(k.dir) + track.heading.y * Math.cos(k.dir);
            const side = Math.abs(across) > 15 ? Math.sign(across) : Math.random() < 0.5 ? -1 : 1;
            bullets.push(new Eel({ box, ...k, amp: rand(6, 9), wl: rand(56, 72), vx: 150 + n * 6, gaps: gapsFor(), warn: 1.1, follow: soul, offset: side * rand(24, 30) }));
          }
          if (n === 4) {
            const other = k.dir === Math.PI ? kinds[1] : kinds[0];
            bullets.push(new Eel({ box, ...other, oy: other.dir === Math.PI ? soul.y : other.oy, amp: 8, wl: 64, vx: 150, gaps: gapsFor(), warn: 1.15, follow: soul }));
          }
          n++;
        }
      },
    };
  },

  // Bubbles: clouds of bubbles out of his gills, drifting and rising toward
  // you; each swells and blinks just before it pops into a ring of spray,
  // near where you are. Between them, a few small ones go straight past.
  gulpBubbles(box, density, tools) {
    const { Shot, rand, clamp } = tools;
    let t = 0;
    let clouds = 0;
    let small = 0;
    const pops = [];
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (clouds < 6 && t >= 0.2 + clouds * 1.3) {
          clouds++;
          // Two at a time, one a little above you and one a little below, or
          // one right at you and one well off.
          const pair = clouds % 2 ? [-12, 12] : [0, rand(28, 34) * (soul.y > box.y + box.h / 2 ? -1 : 1)];
          for (const dy of pair) gillBubble(box, { x: soul.x, y: soul.y + dy }, bullets, pops, tools);
        }
        if (small < 6 && t >= 0.8 + small * 1.2) {
          small++;
          bullets.push(new Shot({ x: box.x + box.w + 6, y: rand(box.y + 6, box.y + box.h - 6), vx: -58, vy: -6, warn: 0.25, life: 3, art: 'gulpSpray' }));
        }
        updatePops(pops, bullets, tools);
      },
    };
  },

  // Tail: he whips his tail in from the right like a scythe, through a wedge
  // with you in it (it shows first and follows you), and back. Down, then up,
  // and at the end two at once from either end of the wall. Spray flies off
  // the tip at the end of each swing.
  gulpTail(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let n = 0;
    const tails = [];
    const px = box.x + box.w + 16;
    return {
      duration: 7.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (n < 5 && t >= 0.2 + n * 1.5) {
          const down = n % 2 === 0;
          const py = clamp(soul.y + (down ? -1 : 1) * rand(12, 26), box.y - 10, box.y + box.h + 10);
          const tail = new Tail({ box, px, py, down, follow: soul, spread: rand(0.58, 0.7), warn: 0.95 });
          bullets.push(tail);
          tails.push(tail);
          if (n === 4) {
            const other = new Tail({ box, px, py: py < box.y + box.h / 2 ? box.y + box.h + 8 : box.y - 8, down: !down, follow: soul, spread: 0.5, warn: 1.15 });
            bullets.push(other);
            tails.push(other);
          }
          n++;
        }
        for (const tail of tails) {
          if (tail.flung || tail.age < tail.warn + tail.swing) continue;
          tail.flung = true;
          const a = tail.a1;
          const tx = tail.px + Math.cos(a) * tail.len * 0.9;
          const ty = tail.py + Math.sin(a) * tail.len * 0.9;
          for (let k = 0; k < 3; k++) {
            const ang = a + (tail.down ? 1 : -1) * (Math.PI / 2) + rand(-0.6, 0.6);
            bullets.push(new Shot({ x: tx, y: ty, vx: Math.cos(ang) * 36, vy: Math.sin(ang) * 36, art: 'gulpSpray', life: 1.3 }));
          }
        }
      },
    };
  },

  // Current: he opens his mouth at the right of the box and sucks. You are
  // pulled toward his teeth, and the junk of his nest (spoons, fish bones,
  // buttons) comes past you on the current from behind and the sides, faster
  // as it nears the mouth. Some of it comes along your row.
  gulpPull(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let maw = null;
    let next = 0.4;
    let streak = 0.2;
    const junk = ['gulpSpoon', 'gulpBone', 'gulpButton'];
    let j = 0;
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!maw) {
          maw = new Maw({ box, oy: box.y + box.h / 2 + rand(-10, 10), life: 6.6, warn: 0.7 });
          bullets.push(maw);
        }
        const { mx, my } = maw.mouth;
        const real = dt / density;
        // The pull (once the mouth is open): about a quarter of your speed.
        if (maw.age > maw.warn && maw.age < maw.warn + maw.life - 0.3) {
          const dx = mx - soul.x;
          const dy = my - soul.y;
          const d = Math.max(1, Math.hypot(dx, dy));
          const pull = 21 + Math.max(0, 40 - d) * 0.25;
          soul.x += (dx / d) * pull * real;
          soul.y += (dy / d) * pull * real;
        }
        // Streaks in the water, all heading for the mouth.
        if (t >= streak) {
          streak = t + 0.25;
          const sx = rand(box.x + 4, box.x + box.w - 30);
          const sy = rand(box.y + 4, box.y + box.h - 4);
          const a = Math.atan2(my - sy, mx - sx);
          bullets.push(new Shot({ x: sx, y: sy, vx: Math.cos(a) * 40, vy: Math.sin(a) * 40, harmless: true, life: 0.7, art: 'gulpStreak' }));
        }
        if (t >= next && t < 10.4) {
          next = t + rand(0.42, 0.58);
          // From behind (the left wall), or the top or bottom of the left half.
          const roll = Math.random();
          let sx;
          let sy;
          if (soul.x > box.x + box.w * 0.6 && roll < 0.5) {
            // Hanging back by his mouth: junk comes down (or up) on you there.
            sx = clamp(soul.x + rand(-6, 6), box.x + 4, box.x + box.w - 4);
            sy = soul.y < my ? box.y - 4 : box.y + box.h + 4;
          } else if (roll < 0.55) {
            sx = box.x - 4;
            sy = Math.random() < 0.6 ? clamp(soul.y + rand(-8, 8), box.y + 4, box.y + box.h - 4) : rand(box.y + 4, box.y + box.h - 4);
          } else {
            sx = clamp(soul.x + rand(-26, 10), box.x + 4, box.x + box.w * 0.6);
            sy = roll < 0.78 ? box.y - 4 : box.y + box.h + 4;
          }
          const a = Math.atan2(my - sy, mx - sx);
          const dist = Math.hypot(mx - sx, my - sy);
          const v0 = 30;
          const acc = 34;
          // Gone into his mouth when it gets there.
          const life = (-v0 + Math.sqrt(v0 * v0 + 2 * acc * dist)) / acc;
          bullets.push(new Shot({ x: sx, y: sy, vx: Math.cos(a) * v0, vy: Math.sin(a) * v0, accel: acc, warn: 0.3, life, art: junk[j++ % 3] }));
        }
      },
    };
  },

  // The bell: he bumps the great bell and it rings, a ring of sound with a
  // gap in it spreading from the bell (the bottom right), and then its echo
  // coming back off the far wall (the left), with its own gap. Green flakes
  // of bronze come down from the beams with each ring.
  gulpBell(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let rings = 0;
    let flakes = 0;
    let nextFlake = 0.5;
    const gapFor = (ox, oy, soul) => {
      // A way through that isn't where you stand: 22-34 px to one side of you.
      const room = soul.y - (box.y + 8) > box.y + box.h - 8 - soul.y ? -1 : 1;
      const side = Math.random() < 0.3 ? -room : room;
      const ty = clamp(soul.y + side * rand(22, 34), box.y + 8, box.y + box.h - 8);
      const tx = clamp(soul.x + rand(-6, 6), box.x + 6, box.x + box.w - 6);
      const reach = Math.hypot(tx - ox, ty - oy);
      return { angle: Math.atan2(ty - oy, tx - ox), width: 2 * Math.atan2(13, reach) };
    };
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (rings < 6 && t >= 0.2 + rings * 1.3) {
          const echo = rings % 2 === 1;
          rings++;
          const ox = echo ? box.x - 10 : box.x + box.w + 10;
          const oy = echo ? clamp(soul.y + rand(-20, 20), box.y + 6, box.y + box.h - 6) : box.y + box.h - rand(4, 16);
          if (!echo) bullets.push(new Shot({ x: ox, y: oy, harmless: true, life: 0.9, art: 'gulpBell' }));
          bullets.push(new Ring({ x: ox, y: oy, r: 3, grow: echo ? 46 : 52, thick: echo ? 2.6 : 3.2, warn: 0.5, life: 3.4, gap: gapFor(ox, oy, soul), color: echo ? '#cfe8d0' : '#e8d890', glow: '#b08a3a' }));
        }
        if (t >= nextFlake && flakes < 12) {
          flakes++;
          nextFlake = t + rand(0.55, 0.75);
          const x = clamp(soul.x + rand(-22, 22), box.x + 5, box.x + box.w - 5);
          bullets.push(new Shot({ x, y: box.y - 4, vx: rand(-6, 6), vy: 44, warn: 0.4, life: 3, art: 'gulpFlake' }));
        }
      },
    };
  },

  // Chomp (wide awake): his jaws close over the whole box, down from the top
  // and up from the bottom. His crooked tooth props a little pocket open, and
  // that's the only place to be: it shows first, never where you are. Three
  // chomps, with gill bubbles drifting in between.
  gulpChomp(box, density, tools) {
    const { rand, clamp } = tools;
    let t = 0;
    let n = 0;
    let clouds = 0;
    let jaws = null;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        // (2026-11-10: 3.9 apart, was 3.4. Closer, the next pocket was shown
        // while you were still shut in the last one, with too little time
        // left to cross to it once the jaws let go.)
        if (n < 3 && t >= 0.25 + n * 3.9) {
          n++;
          const spot = pocketAway(box, soul, rand, clamp);
          jaws = new Jaws({ box, cx: spot.x, cy: spot.y, warn: 1.35 });
          bullets.push(jaws);
        }
        // Between chomps, a few gill bubbles drift straight through (they
        // don't pop: there's enough to think about).
        if (clouds < 6 && t >= 2.3 + clouds * 1.5) {
          clouds++;
          let y = clamp(soul.y + rand(-14, 14), box.y + 8, box.y + box.h - 8);
          // (Never along the pocket's row while the jaws are coming or shut: a
          // bubble drifting into the only safe spot left no way out. 2026-11-10.)
          if (jaws && !jaws.isGone() && Math.abs(y - jaws.cy) < 20) {
            const up = jaws.cy - 20;
            const down = jaws.cy + 20;
            y = up >= box.y + 8 && (down > box.y + box.h - 8 || Math.random() < 0.5) ? up : down;
          }
          bullets.push(new tools.Shot({ x: box.x + box.w + 8, y, vx: -40, vy: -4, warn: 0.3, life: 5, art: 'gulpBubble', wobble: { frequency: 4, amplitude: 4 } }));
        }
      },
    };
  },
};
