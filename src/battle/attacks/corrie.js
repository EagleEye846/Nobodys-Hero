import { defineBulletArt as defineArt } from '../projectiles.js';
import { makeSprite } from '../../engine/sprite.js';
import { Pix } from '../../data/art/ch5Kit.js';
import { LULLABY_OPENING } from '../../data/music/parts/chapter5.js';
import { midi } from '../../audio/notation.js';

// CORRIE, THE TIDECALLER: chapter 5's last boss (src/data/enemies/corrie.js).
// A boy who tried to stop the sea with a spell and became the storm. His
// attacks come in four sets, one for each phase of the fight:
//
//   1. THE BOY MAGE (corrieDarts, corrieCircle, corrieBoats, corrieLullaby):
//      a child's spells. Water darts off the end of his driftwood staff, a
//      spell circle of runes that closes on you, paper boats sailing across
//      the box (the boats Haddock taught him to fold), and the lullaby itself,
//      its notes as bullets coming at you in the tune's own rhythm and pitch.
//   2. THE STORM (stormRain, stormLightning, stormGusts): the sky in the box.
//      The tide comes in from the bottom (Tide): it slows your shadow, it
//      climbs a little higher every turn (corrieStage.js keeps the level),
//      and when lightning strikes it the whole of it lights up. Stay above it.
//   3. THE WHIRLPOOL (whirlWreck, whirlOars, whirlFigurehead): the box turns
//      (corrieStage.js), the current spirals you in toward the eye in the
//      middle, and the wreckage of every boat the sea has taken goes round
//      and round: planks, oars, a ship's figurehead.
//   4. THE LAMP (lampSweep, lampTears, lampLullaby): the Last Light's lamp
//      swings its beam through the box; hide in the shadow of the pillars.
//      He is mostly a child again here, and tired: slower, sadder, still
//      dangerous.
//
// Each attack is `(box, density, tools) => ({ duration, update })`. As in
// King Peptup's (rumboldAlive.js), each keeps `real` time (dt / density) for
// its timeline, and `density` thins it out: its repeats come `density` times
// as often. A bullet's own clock is real time. Every hazard that moves moves
// itself (its own update), so dodgeCheck's bot can read it the way a player
// does; nothing's update touches anything else (the bot steps copies).
// `tools.sea` is what the stage hands over (see corrieStage.js): the tide's
// level, whether the bell has soothed this turn, and the current's pull.

const TAU = Math.PI * 2;
const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));

const P = {
  k: '#0b1626', w: '#ffffff', c: '#d8f6ff', C: '#7fd4ee', b: '#3c8cc0', B: '#1e5a8a',
  p: '#f6f2e6', q: '#cfc6ae', Q: '#9c927a', y: '#ffe48a', Y: '#fff6c8', o: '#e0a040',
  g: '#a8e8c0', G: '#4a8a6a', W: '#8a6a48', V: '#5a4030', T: '#c49c70', r: '#c84a3a', R: '#8a2a24',
  s: '#b8c4cc', S: '#6a7884',
};

function art(w, h, draw, outline = true) {
  const p = new Pix(w, h);
  draw(p);
  if (outline) p.outline('k');
  return p.rows();
}

// --- Bullet art ---------------------------------------------------------

// Every look here is kept as sprites too, for the hazards below that draw
// themselves (the rune ring, the wreckage).
const ARTS = new Map();
function defineBulletArt(name, options) {
  defineArt(name, options);
  ARTS.set(name, options.frames.map((rows) => makeSprite(rows, options.palette)));
}
const sprite = (name) => ARTS.get(name);

// A water dart: a sleek drop with a bright point, drawn pointing right.
defineBulletArt('corDart', {
  frames: [
    art(11, 5, (p) => { p.poly([[0, 2], [6, 0.2], [10, 2], [6, 3.8]], 'C'); p.rect(4, 2, 5, 1, 'c'); p.set(9, 2, 'w'); p.set(1, 2, 'b'); }),
    art(11, 5, (p) => { p.poly([[0, 2], [6, 0.2], [10, 2], [6, 3.8]], 'C'); p.rect(3, 2, 6, 1, 'c'); p.set(9, 2, 'w'); p.set(0, 2, 'c'); }),
  ],
  palette: P,
  radius: 2,
  rotate: true,
  frameSeconds: 0.1,
});
// A rune of the spell circle: a little ring with a cross in it, glowing.
const rune = (turn) => art(9, 9, (p) => {
  p.ring(4, 4, 3.6, 3.6, 'C', 1.2);
  if (turn) { p.line(2, 2, 6, 6, 'c'); p.line(6, 2, 2, 6, 'c'); } else { p.line(4, 1, 4, 7, 'c'); p.line(1, 4, 7, 4, 'c'); }
  p.set(4, 4, 'w');
});
defineBulletArt('corRune', { frames: [rune(0), rune(1)], palette: P, radius: 3, frameSeconds: 0.18 });
// A paper boat, folded from a page: white sail, creased hull, bow to the left.
const boat = (tip) => art(13, 9, (p) => {
  p.poly([[0, 5], [12, 5], [10, 8], [2, 8]], 'p');
  p.rect(2, 7, 9, 1, 'q');
  p.poly([[5, 0], [5, 5], [9 + tip, 5]], 'p');
  p.line(5, 0, 5, 5, 'q');
  p.line(1, 5, 11, 5, 'Q');
  p.set(7, 3, 'q');
});
defineBulletArt('corBoat', { frames: [boat(0), boat(1)], palette: P, radius: 4, hitbox: { w: 9, h: 5 }, frameSeconds: 0.3 });
// A note of the lullaby: a quaver of seawater (head, stem and flag).
defineBulletArt('corNote', {
  frames: [art(8, 11, (p) => {
    p.ellipse(2.5, 8.5, 2.3, 1.7, 'C');
    p.set(1, 8, 'c');
    p.rect(4, 1, 1, 8, 'c');
    p.line(5, 1, 7, 4, 'C');
    p.set(5, 2, 'c');
  })],
  palette: P,
  radius: 2.8,
});
// A long note (a minim): a hollow head, held.
defineBulletArt('corNoteLong', {
  frames: [art(8, 11, (p) => {
    p.ring(3, 8.5, 2.6, 1.9, 'C', 1.1);
    p.set(3, 8, 'w');
    p.rect(5, 1, 1, 8, 'c');
  })],
  palette: P,
  radius: 3.2,
});
// A sea drop, for the spray of a capsized boat or a burst.
defineBulletArt('corDrop', {
  frames: [art(5, 6, (p) => { p.set(2, 0, 'C'); p.rect(1, 1, 3, 4, 'C'); p.set(0, 3, 'C'); p.set(4, 3, 'C'); p.set(2, 2, 'c'); p.set(2, 3, 'w'); })],
  palette: P,
  radius: 1.8,
});
// A tear: longer, paler, falling slowly.
defineBulletArt('corTear', {
  frames: [art(5, 8, (p) => { p.set(2, 0, 'c'); p.rect(2, 1, 1, 2, 'c'); p.ellipse(2, 5, 1.6, 2, 'c'); p.set(2, 5, 'w'); p.set(1, 6, 'C'); })],
  palette: P,
  radius: 2,
});
// Sea foam blown on a gust.
defineBulletArt('corFoam', {
  frames: [
    art(9, 7, (p) => { p.ellipse(3, 4, 2.6, 2, 'c'); p.ellipse(6, 3, 2.4, 2, 'w'); p.set(2, 4, 'C'); p.set(7, 4, 'c'); }),
    art(9, 7, (p) => { p.ellipse(4, 3, 2.6, 2, 'w'); p.ellipse(6, 4, 2.2, 1.8, 'c'); p.set(3, 2, 'c'); p.set(6, 5, 'C'); }),
  ],
  palette: P,
  radius: 3,
  frameSeconds: 0.12,
});
// A plank off a wreck: spinning, nail holes and all.
defineBulletArt('corPlank', {
  frames: [art(15, 5, (p) => { p.rect(0, 1, 15, 3, 'T'); p.rect(0, 3, 15, 1, 'W'); p.rect(0, 1, 15, 1, 'T'); p.set(2, 2, 'V'); p.set(12, 2, 'V'); p.line(5, 2, 9, 2, 'W'); p.set(14, 0, 'T'); })],
  palette: P,
  radius: 3,
  spin: 3.2,
});
// The eye of the whirlpool, in the middle of the box.
const eye = (turn) => art(13, 13, (p) => {
  p.ellipse(6, 6, 5.6, 5.6, 'B');
  for (let i = 0; i < 3; i++) {
    const a = turn + (i * TAU) / 3;
    for (let r = 1; r < 6; r += 0.5) p.set(6 + Math.cos(a + r * 0.55) * r, 6 + Math.sin(a + r * 0.55) * r, r > 4 ? 'C' : 'b');
  }
  p.ellipse(6, 6, 1.6, 1.6, 'k');
}, false);
defineBulletArt('corEye', { frames: [eye(0), eye(1), eye(2)], palette: P, radius: 3.6, frameSeconds: 0.1 });
// Lightning's warning marks where it will land (harmless).
defineBulletArt('corSpark', {
  frames: [art(5, 5, (p) => { p.set(2, 0, 'y'); p.set(2, 4, 'y'); p.set(0, 2, 'y'); p.set(4, 2, 'y'); p.set(2, 2, 'Y'); }, false)],
  palette: P,
  radius: 1,
});

// --- Hazards that aren't Shots -------------------------------------------

// The tide: water up from the bottom of the box. It doesn't hurt (it slows
// you: see wade), unless lightning strikes it: each of its `charges`
// ([start, end] in its own age) lights all of it up, after a warning
// flicker (`warn` seconds before). Its surface climbs from `from` to `to`
// pixels deep over `rise` seconds, then holds.
class Tide {
  constructor({ box, from, to, rise = 6 }) {
    Object.assign(this, { box, from, to, rise });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.charges = [];
    this.warnFor = 0.55;
  }

  depth(age = this.age) {
    return this.from + (this.to - this.from) * Math.min(1, Math.max(0, age / this.rise));
  }

  surface(age = this.age) {
    return this.box.y + this.box.h - this.depth(age);
  }

  charged() {
    return this.charges.some(([a, b]) => this.age >= a && this.age < b);
  }

  warning() {
    return this.charges.some(([a]) => this.age >= a - this.warnFor && this.age < a);
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return false;
  }

  edgeDistance(px, py) {
    if (!this.charged() || this.depth() < 2) return Infinity;
    // Inside the water: the gap is how far under the surface (negative).
    return this.surface() - py;
  }

  draw(ctx) {
    const d = this.depth();
    if (d < 1) return;
    const b = this.box;
    const top = this.surface();
    const lit = this.charged();
    const warn = this.warning() && Math.floor(this.age * 12) % 2 === 0;
    ctx.save();
    ctx.fillStyle = lit ? 'rgba(220, 250, 200, 0.82)' : 'rgba(30, 110, 130, 0.62)';
    ctx.fillRect(b.x, Math.round(top), b.w, Math.ceil(d));
    ctx.fillStyle = lit ? 'rgba(255, 255, 220, 0.6)' : 'rgba(60, 160, 170, 0.4)';
    for (let y = Math.round(top) + 4; y < b.y + b.h; y += 6) ctx.fillRect(b.x + ((y * 7 + Math.round(this.age * 9)) % 9), y, b.w - 9, 1);
    // The surface: a white crest, rolling.
    ctx.fillStyle = lit || warn ? '#fff6a0' : '#c8f0f0';
    for (let x = b.x; x < b.x + b.w; x += 2) {
      const wave = Math.sin(x * 0.3 + this.age * 5) * 1.2;
      ctx.fillRect(x, Math.round(top + wave) - 1, 2, 2);
    }
    if (lit) {
      // Little forks of light running through it.
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 6; i++) {
        const x = b.x + 6 + ((i * 23 + Math.floor(this.age * 30) * 7) % (b.w - 12));
        const y = top + 3 + ((i * 11) % Math.max(3, d - 4));
        ctx.fillRect(Math.round(x), Math.round(y), 3, 1);
        ctx.fillRect(Math.round(x) + 2, Math.round(y) + 1, 1, 2);
      }
    }
    ctx.restore();
  }
}

// Slows your shadow while it's under the tide: of each frame's move, only
// `drag` gets through. Call it once a frame from the attack's update, with
// real time; it remembers where the shadow was.
function wader(drag = 0.45) {
  let last = null;
  return (soul, tide) => {
    if (last && tide && soul.y > tide.surface() + 1) {
      soul.x = last.x + (soul.x - last.x) * drag;
      soul.y = last.y + (soul.y - last.y) * drag;
    }
    last = { x: soul.x, y: soul.y };
  };
}

// A bolt of lightning: a jagged line from above the box down to `to`. It
// warns first (a thin flickering path and a spark where it lands), then is
// solid for a moment.
class Bolt {
  constructor({ x, to, box, warn = 0.75, life = 0.22, fork = 0 }) {
    this.box = box;
    this.warn = warn;
    this.life = life;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    // The path: zigzag down from above the box.
    const top = box.y - 4;
    const steps = 7;
    this.points = [];
    let px = x + (Math.random() - 0.5) * 10;
    for (let i = 0; i <= steps; i++) {
      const y = top + ((to.y - top) * i) / steps;
      const aim = x + ((to.x - x) * i) / steps;
      px = i === steps ? to.x : aim + (Math.random() - 0.5) * 9;
      this.points.push({ x: px, y });
    }
    // A fork off the middle.
    this.branch = null;
    if (fork) {
      const from = this.points[3];
      const end = { x: from.x + fork * 18, y: from.y + 22 };
      this.branch = [from, { x: (from.x + end.x) / 2 + 3 * fork, y: (from.y + end.y) / 2 }, end];
    }
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
    let best = Infinity;
    const run = (pts) => {
      for (let i = 0; i + 1 < pts.length; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const t = Math.max(0, Math.min(1, ((px - a.x) * dx + (py - a.y) * dy) / (dx * dx + dy * dy || 1)));
        best = Math.min(best, Math.hypot(px - (a.x + dx * t), py - (a.y + dy * t)));
      }
    };
    run(this.points);
    if (this.branch) run(this.branch);
    return best - 1.8;
  }

  draw(ctx) {
    const path = (pts) => {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (const p of pts.slice(1)) ctx.lineTo(p.x, p.y);
      ctx.stroke();
    };
    ctx.save();
    const end = this.points[this.points.length - 1];
    if (this.age < this.warn) {
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.3 : 0.75;
      ctx.strokeStyle = '#fff2a0';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      path(this.points);
      if (this.branch) path(this.branch);
      ctx.setLineDash([]);
      ctx.fillStyle = '#ffe48a';
      ctx.fillRect(Math.round(end.x) - 2, Math.round(end.y) - 1, 5, 2);
      ctx.restore();
      return;
    }
    const over = this.age - this.warn - this.life;
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
    ctx.shadowColor = '#fff6a0';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#fff8d0';
    ctx.lineWidth = 3;
    path(this.points);
    if (this.branch) path(this.branch);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    path(this.points);
    ctx.restore();
  }
}

// A band of wind across the box: arrows warn which way it'll blow, then
// for `blow` seconds it pushes your shadow along (the attack does that: see
// gustsPush) and carries foam. It never hurts by itself.
class GustBand {
  constructor({ box, y, h, dir, warn = 0.7, blow = 1.4 }) {
    Object.assign(this, { box, y, h, dir, warn, blow });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get blowing() {
    return this.age >= this.warn && this.age < this.warn + this.blow;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.warn + this.blow + 0.2;
  }

  edgeDistance() {
    return Infinity;
  }

  draw(ctx) {
    const b = this.box;
    ctx.save();
    const warning = this.age < this.warn;
    ctx.globalAlpha = warning ? (Math.floor(this.age * 10) % 2 ? 0.25 : 0.55) : Math.max(0, 0.32 - Math.max(0, this.age - this.warn - this.blow) * 1.5);
    ctx.fillStyle = 'rgba(200, 240, 230, 0.25)';
    ctx.fillRect(b.x, Math.round(this.y), b.w, Math.round(this.h));
    ctx.fillStyle = '#d8fff0';
    const shift = warning ? 0 : ((this.age * 70) % 16) * this.dir;
    for (let x = b.x - 16; x < b.x + b.w + 16; x += 16) {
      const ax = Math.round(x + shift);
      const ay = Math.round(this.y + this.h / 2);
      ctx.fillRect(ax, ay, 6, 1);
      ctx.fillRect(ax + (this.dir > 0 ? 4 : 0), ay - 1, 2, 1);
      ctx.fillRect(ax + (this.dir > 0 ? 4 : 0), ay + 1, 2, 1);
    }
    ctx.restore();
  }
}

// A ring of runes: the spell circle. It shows round where you stand, blinks,
// then turns and closes in; a few runes are missing (the way out). At the
// middle it bursts.
class RuneRing {
  constructor({ x, y, r = 38, count = 14, gap = 3, gapAt = 0, warn = 0.7, spin = 0.8, close = 1.7 }) {
    Object.assign(this, { x, y, r0: r, count, warn, spin, close });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.runes = [];
    for (let i = 0; i < count; i++) if (((i - gapAt + count) % count) >= gap) this.runes.push((i / count) * TAU);
  }

  get r() {
    const t = Math.max(0, this.age - this.warn);
    return Math.max(4, this.r0 * (1 - t / this.close));
  }

  get turn() {
    return Math.max(0, this.age - this.warn) * this.spin;
  }

  get active() {
    return this.age >= this.warn && this.age < this.warn + this.close;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.warn + this.close + 0.05;
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const r = this.r;
    let best = Infinity;
    for (const a of this.runes) {
      const d = Math.hypot(px - (this.x + Math.cos(a + this.turn) * r), py - (this.y + Math.sin(a + this.turn) * r)) - 3;
      if (d < best) best = d;
    }
    return best;
  }

  draw(ctx) {
    const frames = sprite('corRune');
    const r = this.r;
    ctx.save();
    ctx.globalAlpha = this.age < this.warn ? (Math.floor(this.age * 10) % 2 ? 0.3 : 0.7) : 1;
    // The circle drawn faintly between the runes.
    ctx.strokeStyle = 'rgba(127, 212, 238, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, TAU);
    ctx.stroke();
    const frame = frames[Math.floor(this.age / 0.18) % frames.length];
    for (const a of this.runes) {
      const x = this.x + Math.cos(a + this.turn) * r;
      const y = this.y + Math.sin(a + this.turn) * r;
      ctx.drawImage(frame, Math.round(x - frame.width / 2), Math.round(y - frame.height / 2));
    }
    ctx.restore();
  }
}

// Something going round the eye: a plank, an oar, the figurehead. It goes
// round (cx, cy) at radius `r`, `w` radians a second (or at `speed` pixels a
// second along its circle, faster nearer the middle), drifting in at `dr`
// pixels a second. An oar (`seg`, its half-length) hurts along its length,
// turned by `spin`; anything else is a circle of `radius`.
class Orbiter {
  constructor({ cx, cy, r, a, speed = 40, dr = -6, art: name, radius = 3, seg = 0, spin = 0, warn = 0.4, life = 8, minR = 9 }) {
    Object.assign(this, { cx, cy, r0: r, a0: a, speed, dr, artName: name, radius, seg, spin, warn, life, minR });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.dir = speed >= 0 ? 1 : -1;
  }

  // Where it is `t` seconds after it starts moving: angle and radius.
  at(t) {
    const r = Math.max(this.minR, this.r0 + this.dr * t);
    // Angle: the integral of speed / r over time, done in steps of 0.1 s.
    let a = this.a0;
    const n = Math.ceil(t / 0.1);
    for (let i = 0; i < n; i++) {
      const s = Math.min(0.1, t - i * 0.1);
      const ri = Math.max(this.minR, this.r0 + this.dr * (i * 0.1 + s / 2));
      a += (this.speed / ri) * s;
    }
    return { a, r };
  }

  update(dt) {
    this.age += dt;
    const { a, r } = this.at(Math.max(0, this.age - this.warn));
    this.x = this.cx + Math.cos(a) * r;
    this.y = this.cy + Math.sin(a) * r;
    // An oar lies along its path, turning end over end as it goes.
    this.angle = a + Math.PI / 2 + this.spin * this.age;
  }

  get active() {
    return this.age >= this.warn && this.age < this.warn + this.life;
  }

  isGone() {
    return this.age >= this.warn + this.life + 0.25;
  }

  edgeDistance(px, py) {
    if (!this.active || this.x === undefined) return Infinity;
    if (!this.seg) return Math.hypot(px - this.x, py - this.y) - this.radius;
    const dx = Math.cos(this.angle);
    const dy = Math.sin(this.angle);
    const along = Math.max(-this.seg, Math.min(this.seg, (px - this.x) * dx + (py - this.y) * dy));
    return Math.hypot(px - (this.x + dx * along), py - (this.y + dy * along)) - this.radius;
  }

  draw(ctx) {
    if (this.x === undefined) return;
    const frames = sprite(this.artName);
    const frame = frames[0];
    ctx.save();
    if (this.age < this.warn) ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.3 : 0.65;
    const over = this.age - this.warn - this.life;
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.seg ? this.angle : this.spin * this.age);
    ctx.drawImage(frame, -frame.width / 2, -frame.height / 2);
    ctx.restore();
  }
}

// The pull of the whirlpool: each frame, your shadow is drawn in toward
// (cx, cy) and round it. `pull` and `swirl` are pixels a second.
function current(soul, cx, cy, rdt, pull, swirl) {
  const dx = soul.x - cx;
  const dy = soul.y - cy;
  const d = Math.hypot(dx, dy);
  if (d < 1) return;
  soul.x += ((-dx / d) * pull + (-dy / d) * swirl) * rdt;
  soul.y += ((-dy / d) * pull + (dx / d) * swirl) * rdt;
}

// A stone pillar in the lamp room: it stands in the box and throws a shadow
// away from the lamp. Harmless (you hide behind it). It rises out of the
// floor as it comes (`warn`), and sinks again at the end of its `life`.
class LampPillar {
  constructor({ x, y, w = 8, h = 16, warn = 0.6, life = 3.2 }) {
    Object.assign(this, { x, y, w, h, warn, life });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get standing() {
    return this.age >= this.warn && this.age < this.warn + this.life;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.warn + this.life + 0.4;
  }

  edgeDistance() {
    return Infinity;
  }

  // Whether the segment from (ax, ay) to (bx, by) passes through it.
  blocks(ax, ay, bx, by) {
    if (!this.standing) return false;
    let t0 = 0;
    let t1 = 1;
    const dx = bx - ax;
    const dy = by - ay;
    for (const [p, q] of [[-dx, ax - this.x], [dx, this.x + this.w - ax], [-dy, ay - this.y], [dy, this.y + this.h - ay]]) {
      if (p === 0) {
        if (q < 0) return false;
        continue;
      }
      const t = q / p;
      if (p < 0) t0 = Math.max(t0, t);
      else t1 = Math.min(t1, t);
      if (t0 > t1) return false;
    }
    return t1 > t0;
  }

  draw(ctx) {
    const grow = Math.min(1, this.age / this.warn) * Math.max(0, Math.min(1, (this.warn + this.life + 0.4 - this.age) / 0.4));
    const h = Math.round(this.h * grow);
    if (h <= 0) return;
    const x = Math.round(this.x);
    const y = Math.round(this.y + this.h - h);
    ctx.save();
    if (this.age < this.warn) ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#0b1626';
    ctx.fillRect(x - 1, y - 1, this.w + 2, h + 2);
    ctx.fillStyle = '#4a5664';
    ctx.fillRect(x, y, this.w, h);
    ctx.fillStyle = '#7a8898';
    ctx.fillRect(x, y, 2, h);
    ctx.fillStyle = '#2c3640';
    ctx.fillRect(x + this.w - 2, y, 2, h);
    ctx.fillStyle = '#a8b4c0';
    ctx.fillRect(x, y, this.w, 2);
    for (let j = y + 5; j < y + h - 1; j += 5) {
      ctx.fillStyle = '#3a4450';
      ctx.fillRect(x + 1, j, this.w - 2, 1);
    }
    ctx.restore();
  }
}

// The Last Light's beam, from its lamp at (ox, oy) outside the box, swinging
// from angle `from` to `to` over `sweep` seconds (after `warn`, when it's a
// faint glow that doesn't burn yet). Anything in it is burnt, unless one of
// the `pillars` stands between it and the lamp.
class Beam {
  constructor({ ox, oy, from, to, sweep = 2.2, half = 0.15, warn = 0.8, pillars = [] }) {
    Object.assign(this, { ox, oy, from, to, sweep, half, warn, pillars });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get angle() {
    const t = Math.min(1, Math.max(0, (this.age - this.warn) / this.sweep));
    // Eased: it swings, slowing at each end.
    return this.from + (this.to - this.from) * (0.5 - 0.5 * Math.cos(t * Math.PI));
  }

  get active() {
    return this.age >= this.warn && this.age < this.warn + this.sweep;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.warn + this.sweep + 0.3;
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    // In a pillar's shadow, it can't touch you, edge or middle.
    if (this.pillars.some((p) => p.blocks(this.ox, this.oy, px, py))) return Infinity;
    const a = Math.atan2(py - this.oy, px - this.ox);
    const off = Math.abs(wrapAngle(a - this.angle)) - this.half;
    if (off > 0) return off * Math.hypot(px - this.ox, py - this.oy);
    return -1;
  }

  draw(ctx) {
    const a = this.angle;
    const reach = 260;
    const warning = this.age < this.warn;
    const over = this.age - this.warn - this.sweep;
    const ray = (angle, r) => [this.ox + Math.cos(angle) * r, this.oy + Math.sin(angle) * r];
    ctx.save();
    // Only inside the beam...
    ctx.beginPath();
    ctx.moveTo(this.ox, this.oy);
    ctx.lineTo(...ray(a - this.half, reach));
    ctx.lineTo(...ray(a + this.half, reach));
    ctx.closePath();
    ctx.clip();
    // ...the light, less the shadow behind each pillar (even-odd: where a
    // shadow overlaps the beam, it's left dark).
    ctx.beginPath();
    ctx.moveTo(this.ox, this.oy);
    ctx.lineTo(...ray(a - this.half - 0.2, reach));
    ctx.lineTo(...ray(a + this.half + 0.2, reach));
    ctx.closePath();
    for (const p of this.pillars) {
      if (!p.standing) continue;
      const corners = [[p.x, p.y], [p.x + p.w, p.y], [p.x, p.y + p.h], [p.x + p.w, p.y + p.h]];
      const offs = corners.map(([x, y]) => wrapAngle(Math.atan2(y - this.oy, x - this.ox) - a));
      const lo = Math.min(...offs) + a;
      const hi = Math.max(...offs) + a;
      const near = Math.min(...corners.map(([x, y]) => Math.hypot(x - this.ox, y - this.oy)));
      ctx.moveTo(...ray(lo, near));
      ctx.lineTo(...ray(lo, reach));
      ctx.lineTo(...ray(hi, reach));
      ctx.lineTo(...ray(hi, near));
      ctx.closePath();
    }
    ctx.globalAlpha = warning ? 0.16 + 0.1 * Math.sin(this.age * 20) : over > 0 ? Math.max(0, 0.55 * (1 - over / 0.3)) : 0.55;
    ctx.fillStyle = '#fff2b0';
    ctx.fill('evenodd');
    ctx.restore();
    if (!warning && over <= 0) {
      // A hot white edge on each side of the beam.
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 240, 0.7)';
      ctx.lineWidth = 1;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(this.ox, this.oy);
        ctx.lineTo(...ray(a + side * this.half, reach));
        ctx.stroke();
      }
      ctx.restore();
    }
  }
}

// The lullaby's opening, as [{ pitch (MIDI), at (8ths from the start), long }].
const LULLABY = (() => {
  const tokens = LULLABY_OPENING.trim().split(/\s+/);
  const notes = [];
  tokens.forEach((token, i) => {
    if (token === '-' || token === '.') {
      if (token === '-' && notes.length) notes[notes.length - 1].len++;
      return;
    }
    notes.push({ pitch: midi(token), at: i, len: 1 });
  });
  return notes.map((n) => ({ ...n, long: n.len >= 3 }));
})();
const LULLABY_MID = (Math.min(...LULLABY.map((n) => n.pitch)) + Math.max(...LULLABY.map((n) => n.pitch))) / 2;

// An oar, end to end: blade at one end, handle at the other.
defineBulletArt('corOar', {
  frames: [art(25, 5, (p) => {
    p.rect(0, 2, 17, 1, 'T');
    p.rect(0, 1, 2, 3, 'W');
    p.poly([[16, 0.5], [24, 0], [24, 5], [16, 4.5]], 'T');
    p.rect(17, 3, 7, 1, 'W');
    p.set(10, 2, 'W');
  })],
  palette: P,
  radius: 2,
});
// The figurehead off a wrecked ship: a carved wooden woman, chipped red and
// gold, looking up, salt in her hair.
defineBulletArt('corFigurehead', {
  frames: [art(17, 17, (p) => {
    p.ellipse(8, 11, 6, 5, 'T');
    p.ellipse(8, 12, 5, 3.5, 'r');
    p.rect(4, 13, 9, 1, 'R');
    p.ellipse(8, 5, 3.6, 4, 'T');
    p.ellipse(7, 3, 4, 2.6, 'W');
    p.rect(3, 3, 2, 6, 'W');
    p.set(9, 5, 'V');
    p.set(7, 5, 'V');
    p.rect(7, 7, 3, 1, 'V');
    p.set(11, 9, 'o');
    p.set(5, 10, 'o');
    p.set(8, 15, 'W');
    p.set(10, 2, 's');
    p.set(4, 4, 's');
  })],
  palette: P,
  radius: 6,
  spin: 1.4,
});

// --- The attacks -----------------------------------------------------------

// Where his staff is: off the right of the box, high.
const staff = (box) => ({ x: box.x + box.w + 16, y: box.y + 10 });

export const CORRIE_ATTACKS = {
  // WATER DARTS: volleys off the end of his staff at where you are (a fan
  // of three, then five), and every third volley a pair from the top
  // corners that curve after you a little.
  corrieDarts(box, density, { Shot, rand }) {
    let real = 0;
    let next = 0.35;
    let volley = 0;
    const every = 0.95 / density;
    return {
      duration: 7.6,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real < next || real > 6.6) return;
        next += every;
        volley++;
        const from = { x: staff(box).x, y: box.y + rand(4, box.h - 4) };
        const aim = Math.atan2(soul.y - from.y, soul.x - from.x);
        const n = volley % 2 ? 3 : 5;
        const spread = n === 3 ? 0.22 : 0.19;
        for (let i = 0; i < n; i++) {
          const a = aim + (i - (n - 1) / 2) * spread;
          bullets.push(new Shot({ x: from.x, y: from.y, vx: Math.cos(a) * 56, vy: Math.sin(a) * 56, warn: 0.3, life: 3, art: 'corDart' }));
        }
        if (volley % 2 === 0) {
          for (const x of [box.x - 6, box.x + box.w + 6]) {
            const a = Math.atan2(soul.y - (box.y - 6), soul.x - x);
            bullets.push(new Shot({ x, y: box.y - 6, vx: Math.cos(a) * 44, vy: Math.sin(a) * 44, warn: 0.4, life: 3, art: 'corDart', homing: { target: soul, turn: 0.7 } }));
          }
        }
      },
    };
  },

  // SPELL CIRCLE: a ring of runes appears round you with a few missing,
  // blinks, then turns and closes in. Slip out through the gap. Where it
  // shuts, it bursts into darts. Three casts, turning one way then the other.
  corrieCircle(box, density, { Shot, rand }) {
    let real = 0;
    let cast = 0;
    const times = [0.25, 2.55, 4.85];
    const rings = [];
    return {
      duration: 7.6,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (cast < times.length && real >= times[cast] / Math.min(1.25, density)) {
          cast++;
          // The way out is never straight into a wall.
          const toMiddle = Math.atan2(box.y + box.h / 2 - soul.y, box.x + box.w / 2 - soul.x);
          const gapAt = Math.round((((toMiddle + rand(-1.2, 1.2)) / TAU) * 14 + 14) % 14);
          const ring = new RuneRing({ x: soul.x, y: soul.y, r: 36, count: 14, gap: 4, gapAt, warn: 0.8, spin: (cast % 2 ? 1 : -1) * 0.45, close: 2.1 });
          bullets.push(ring);
          rings.push(ring);
        }
        for (const ring of rings) {
          if (ring.burst || ring.age < ring.warn + ring.close) continue;
          ring.burst = true;
          const turn = rand(0, TAU);
          for (let k = 0; k < 6; k++) {
            const a = turn + (k / 6) * TAU;
            bullets.push(new Shot({ x: ring.x + Math.cos(a) * 4, y: ring.y + Math.sin(a) * 4, vx: Math.cos(a) * 32, vy: Math.sin(a) * 32, warn: 0.4, life: 2.4, art: 'corDart' }));
          }
        }
      },
    };
  },

  // PAPER BOATS: a fleet sails in across the box from his side, bobbing,
  // in a column with one gap in it; each wave the gap moves. A few tip over
  // part way and spill. The later waves come from both sides.
  corrieBoats(box, density, { Shot, rand, clamp }) {
    let real = 0;
    let wave = 0;
    let gap = rand(box.y + 14, box.y + box.h - 14);
    const sails = [];
    const every = 1.25 / density;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (wave < 6 && real >= 0.3 + wave * every) {
          wave++;
          // The gap is near you, never far, but never right on you.
          const way = soul.y < box.y + 20 ? 1 : soul.y > box.y + box.h - 20 ? -1 : Math.random() < 0.5 ? -1 : 1;
          gap = clamp(soul.y + way * rand(11, 24), box.y + 6, box.y + box.h - 6);
          const fromLeft = wave >= 4 && wave % 2 === 0;
          const x = fromLeft ? box.x - 10 : box.x + box.w + 10;
          for (let y = box.y + 3; y <= box.y + box.h - 2; y += 10.7) {
            if (Math.abs(y - gap) < 10) continue;
            const shot = new Shot({ x, y, vx: (fromLeft ? 1 : -1) * 30, warn: 0.45, life: 6, art: 'corBoat', wobble: { frequency: 3, amplitude: 2.5 } });
            bullets.push(shot);
            if (Math.random() < 0.25) sails.push({ shot, at: rand(box.x + 18, box.x + box.w - 18), fromLeft });
          }
        }
        for (const s of sails) {
          if (s.done || s.shot.age < s.shot.warn) continue;
          if (s.fromLeft ? s.shot.x < s.at : s.shot.x > s.at) continue;
          s.done = true;
          s.shot.life = 0;
          s.shot.age = s.shot.warn + 0.01;
          for (let k = 0; k < 3; k++) bullets.push(new Shot({ x: s.shot.x, y: s.shot.y, vx: (k - 1) * 22, vy: -30, gravity: 90, life: 1.6, art: 'corDrop' }));
        }
      },
    };
  },

  // THE LULLABY: its opening four bars, the notes coming at you in the
  // tune's own rhythm, each at its own pitch: across from the right on a
  // staff (higher notes higher), then down from above on a staff laid on its
  // side (higher notes further right), then across again. The last note, the
  // long E that never resolves, bursts where it stops.
  corrieLullaby(box, density, { Shot, clamp }) {
    let real = 0;
    const EIGHTH = 0.16;
    const PHRASE = 24 * EIGHTH;
    const plan = [
      { start: 0.3, way: 'across' },
      { start: 0.3 + PHRASE * 0.5, way: 'down' },
      { start: 0.3 + PHRASE, way: 'across' },
    ];
    const queue = [];
    const bursts = [];
    let planned = 0;
    const STEP = 5.2;
    return {
      duration: 8.6,
      update: (dt, bullets, soul) => {
        real += dt / density;
        // Each phrase is laid on a staff centred where you are as it starts.
        while (planned < plan.length && real >= plan[planned].start) {
          const { start, way } = plan[planned++];
          const across = way === 'across';
          const centre = across ? clamp(soul.y, box.y + 26, box.y + box.h - 26) : clamp(soul.x, box.x + 26, box.x + box.w - 26);
          for (const note of LULLABY) queue.push({ at: start + note.at * EIGHTH, note, across, centre, last: note === LULLABY[LULLABY.length - 1] });
        }
        for (let i = queue.length - 1; i >= 0; i--) {
          const q = queue[i];
          if (real < q.at) continue;
          queue.splice(i, 1);
          const off = (q.note.pitch - LULLABY_MID) * STEP;
          const art = q.note.long ? 'corNoteLong' : 'corNote';
          let shot;
          if (q.across) shot = new Shot({ x: box.x + box.w + 8, y: q.centre - off, vx: -40, warn: 0.2, life: 3.4, art });
          else shot = new Shot({ x: q.centre + off, y: box.y - 8, vy: 40, warn: 0.2, life: 3.4, art });
          bullets.push(shot);
          if (q.last) {
            shot.burstAt = q.across ? clamp(soul.x, box.x + 16, box.x + box.w - 16) : clamp(soul.y, box.y + 16, box.y + box.h - 16);
            shot.across = q.across;
            bursts.push(shot);
          }
        }
        for (const shot of bursts) {
          if (shot.burst || shot.age < shot.warn) continue;
          if (shot.across ? shot.x > shot.burstAt : shot.y < shot.burstAt) continue;
          shot.burst = true;
          shot.life = 0;
          shot.age = shot.warn + 0.01;
          for (let k = 0; k < 9; k++) {
            const a = (k / 9) * TAU;
            bullets.push(new Shot({ x: shot.x, y: shot.y, vx: Math.cos(a) * 34, vy: Math.sin(a) * 34, life: 1.8, art: 'corDrop' }));
          }
        }
      },
    };
  },

  // --- 2. The storm -------------------------------------------------------

  // RAIN: sheets of it, slanting on the wind, each row with one gap that
  // wanders after you; the wind swings round twice. The tide is in.
  stormRain(box, density, { Line, rand, clamp, sea }) {
    let real = 0;
    const tide = makeTide(box, sea);
    const wade = wader();
    let started = false;
    let nextRow = 0.35;
    const every = 0.62 / Math.sqrt(density);
    let wind = (Math.random() < 0.5 ? -1 : 1) * 16;
    let gap = box.x + box.w / 2;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        const rdt = dt / density;
        real += rdt;
        if (!started) {
          started = true;
          bullets.push(tide);
        }
        stormHint(box, sea, real);
        wade(soul, tide);
        if (real > 2.6 && real - rdt <= 2.6) wind = -wind;
        if (real > 5.2 && real - rdt <= 5.2) wind = -wind * 1.3;
        if (real < nextRow || real > 6.8) return;
        nextRow += every;
        // The gap: a step or two off from where you are, never on you.
        const way = soul.x < box.x + 20 ? 1 : soul.x > box.x + box.w - 20 ? -1 : Math.random() < 0.5 ? -1 : 1;
        gap = clamp(soul.x + way * rand(9, 22), box.x + 4, box.x + box.w - 4);
        const vy = 60;
        const angle = Math.atan2(vy, wind);
        for (let x = box.x - 20; x < box.x + box.w + 20; x += 8) {
          const sx = x + rand(-1.5, 1.5);
          // (Where the drop will be when it's level with you.)
          const later = sx + wind * ((soul.y - box.y + 8) / vy);
          if (Math.abs(later - gap) < 11) continue;
          bullets.push(new Line({ x: sx, y: box.y - 8, angle, length: 6, thickness: 1.6, warn: 0, life: 2.6, vx: wind, vy, color: '#bfe8f0' }));
        }
      },
    };
  },

  // LIGHTNING: forks come down at you, a flickering path first and a spark
  // where it'll land. Where one lands in the water, the whole tide lights
  // up (it flickers yellow first): get out of it. Every third strike is a
  // pair either side of you; stay between.
  stormLightning(box, density, { Shot, rand, clamp, sea }) {
    let real = 0;
    const tide = makeTide(box, sea);
    const wade = wader();
    let started = false;
    let next = 0.4;
    let strikes = 0;
    let nextDrop = 0.6;
    const every = 1.15 / density;
    const WARN = 0.75;
    const strike = (bullets, x, fork) => {
      x = clamp(x, box.x + 4, box.x + box.w - 4);
      const when = tide.age + WARN;
      const wet = tide.depth(when) > 3;
      const y = wet ? tide.surface(when) : box.y + box.h;
      bullets.push(new Bolt({ x: x + rand(-6, 6), to: { x, y }, box, warn: WARN, fork }));
      if (wet) tide.charges.push([when, when + 0.42]);
    };
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (!started) {
          started = true;
          bullets.push(tide);
        }
        stormHint(box, sea, real);
        wade(soul, tide);
        // A little rain between, so standing about is no good.
        if (real >= nextDrop && real < 7) {
          nextDrop += 0.55 / density;
          bullets.push(new Shot({ x: rand(box.x + 3, box.x + box.w - 3), y: box.y - 6, vy: 44, vx: rand(-6, 6), life: 2.6, art: 'corDrop' }));
        }
        if (real < next || real > 6.6) return;
        next += every;
        strikes++;
        if (strikes % 3 === 0) {
          strike(bullets, soul.x - 15, -1);
          strike(bullets, soul.x + 15, 1);
        } else {
          strike(bullets, soul.x + rand(-4, 4), Math.random() < 0.5 ? (Math.random() < 0.5 ? -1 : 1) : 0);
        }
      },
    };
  },

  // GUSTS: bands of wind across the box (arrows first) that shove you along
  // and carry foam. The band follows you; step out of it up or down (mind
  // the water) or ride it and dodge the foam.
  stormGusts(box, density, { Shot, rand, clamp, sea }) {
    let real = 0;
    const tide = makeTide(box, sea);
    const wade = wader();
    let started = false;
    let next = 0.3;
    const bands = [];
    const every = 1.5 / density;
    let nextDrop = 0.5;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        const rdt = dt / density;
        real += rdt;
        if (!started) {
          started = true;
          bullets.push(tide);
        }
        stormHint(box, sea, real);
        if (real >= next && real < 6.4) {
          next += every;
          const h = 24;
          const y = clamp(soul.y - h / 2 + rand(-6, 6), box.y, box.y + box.h - h);
          const band = new GustBand({ box, y, h, dir: Math.random() < 0.5 ? -1 : 1, warn: 0.7, blow: 1.5 });
          band.nextFoam = 0;
          bullets.push(band);
          bands.push(band);
        }
        for (const band of bands) {
          if (!band.blowing) continue;
          if (soul.y >= band.y && soul.y <= band.y + band.h) soul.x += band.dir * 32 * rdt;
          band.nextFoam -= rdt;
          if (band.nextFoam <= 0) {
            band.nextFoam = 0.34;
            const x = band.dir > 0 ? box.x - 6 : box.x + box.w + 6;
            bullets.push(new Shot({ x, y: band.y + rand(3, band.h - 3), vx: band.dir * 66, vy: rand(-4, 4), life: 2.2, art: 'corFoam' }));
          }
        }
        wade(soul, tide);
        if (real >= nextDrop && real < 7) {
          nextDrop += 0.52 / density;
          bullets.push(new Shot({ x: rand(box.x + 3, box.x + box.w - 3), y: box.y - 6, vy: 46, life: 2.6, art: 'corDrop' }));
        }
      },
    };
  },

  // --- 3. The whirlpool ---------------------------------------------------

  // WRECKAGE: planks come in from the edge of the whirl and go round and
  // round, closer and closer to the eye. The current pulls you in too.
  whirlWreck(box, density, { Shot, rand, sea }) {
    let real = 0;
    const c = middle(box);
    const pulled = whirl(box, sea);
    let next = 0.2;
    const every = 0.4 / density;
    let n = 0;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        const rdt = dt / density;
        real += rdt;
        pulled(bullets, soul, rdt, Shot);
        if (real < next || real > 6.6) return;
        next += every;
        n++;
        // Mostly from the far side of the whirl from you, so they come round to you.
        const yours = Math.atan2(soul.y - c.y, soul.x - c.x);
        const a = yours + Math.PI + rand(-1.4, 1.4);
        // Every other one comes round at about your distance from the eye,
        // drifting in slower, so the corners are no hiding place.
        const yourR = Math.hypot(soul.x - c.x, soul.y - c.y);
        const r = n % 2 ? Math.min(60, yourR + rand(4, 10)) : n % 3 === 0 ? rand(26, 36) : rand(48, 58);
        bullets.push(new Orbiter({ cx: c.x, cy: c.y, r, a, speed: 36, dr: n % 2 ? -2 : -6, art: 'corPlank', radius: 3.2, spin: 3, warn: 0.45, life: 7 }));
      },
    };
  },

  // OARS: lost oars go round the whirl end over end, long enough to sweep a
  // good stretch of it, in pairs on opposite sides.
  whirlOars(box, density, { Shot, rand, sea }) {
    let real = 0;
    const c = middle(box);
    const pulled = whirl(box, sea);
    let next = 0.2;
    const every = 1.05 / density;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        const rdt = dt / density;
        real += rdt;
        pulled(bullets, soul, rdt, Shot);
        if (real < next || real > 6.4) return;
        next += every;
        const a = rand(0, TAU);
        const r = rand(22, 48);
        for (const side of [0, Math.PI]) {
          bullets.push(new Orbiter({ cx: c.x, cy: c.y, r: side ? Math.max(22, 70 - r) : r, a: a + side, speed: 26, dr: -2, art: 'corOar', seg: 11, radius: 1.8, spin: 1.4, warn: 0.6, life: 6.2, minR: 16 }));
        }
      },
    };
  },

  // THE FIGUREHEAD: a ship's carved figurehead goes round the whirl, big,
  // shedding splinters behind it and slinging planks out; it comes in closer
  // as it goes.
  whirlFigurehead(box, density, { Shot, rand, sea }) {
    let real = 0;
    const c = middle(box);
    const pulled = whirl(box, sea);
    let head = null;
    let next = 0.9;
    const every = 0.7 / density;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        const rdt = dt / density;
        real += rdt;
        pulled(bullets, soul, rdt, Shot);
        if (!head) {
          const a = Math.atan2(soul.y - c.y, soul.x - c.x) + Math.PI;
          head = new Orbiter({ cx: c.x, cy: c.y, r: 36, a, speed: 44, dr: -2.4, art: 'corFigurehead', radius: 6, spin: 0, warn: 0.7, life: 7.2, minR: 20 });
          bullets.push(head);
        }
        if (real < next || real > 6.8 || head.x === undefined) return;
        next += every;
        // Splinters flung out from it, and a plank slung round the other way.
        const out = Math.atan2(head.y - c.y, head.x - c.x);
        for (const turn of [-0.5, 0.5]) {
          const a = out + turn;
          bullets.push(new Shot({ x: head.x, y: head.y, vx: Math.cos(a) * 46, vy: Math.sin(a) * 46, life: 2, art: 'corDrop' }));
        }
        const r = Math.hypot(soul.x - c.x, soul.y - c.y);
        bullets.push(new Orbiter({ cx: c.x, cy: c.y, r: Math.max(14, Math.min(54, r + rand(-6, 6))), a: out + Math.PI * 0.8, speed: -40, dr: 0, art: 'corPlank', radius: 3.2, spin: -3, warn: 0.4, life: 2.6 }));
      },
    };
  },

  // --- 4. The lamp ----------------------------------------------------------

  // THE BEAM: the Last Light's lamp swings its beam through the box, from
  // one side and then the other. Stone pillars rise out of the floor before
  // each pass: get in a pillar's shadow (away from the lamp). A few tired
  // darts between.
  lampSweep(box, density, { Shot, rand }) {
    let real = 0;
    let pass = 0;
    const times = [0.2, 3.0, 5.8];
    let side = Math.random() < 0.5 ? -1 : 1;
    let next = 1.2;
    return {
      duration: 9,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (pass < times.length && real >= times[pass]) {
          lampPass(bullets, box, side, soul);
          side = -side;
          pass++;
        }
        if (real >= next && real < 8) {
          next += 1.5 / density;
          const from = { x: staff(box).x, y: box.y + rand(8, box.h - 8) };
          const a = Math.atan2(soul.y - from.y, soul.x - from.x);
          for (const turn of [-0.2, 0.2]) bullets.push(new Shot({ x: from.x, y: from.y, vx: Math.cos(a + turn) * 34, vy: Math.sin(a + turn) * 34, warn: 0.4, life: 3.5, art: 'corDart' }));
        }
      },
    };
  },

  // TEARS: he cries, and the tears come down slowly all over the box; the
  // pillars keep them off you too. The beam passes twice.
  lampTears(box, density, { Shot, rand }) {
    let real = 0;
    let pass = 0;
    const times = [0.9, 4.6];
    let side = Math.random() < 0.5 ? -1 : 1;
    let nextTear = 0.2;
    const tears = [];
    const pillars = [];
    return {
      duration: 8.6,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (pass < times.length && real >= times[pass]) {
          pillars.push(...lampPass(bullets, box, side, soul));
          side = -side;
          pass++;
        }
        if (real >= nextTear && real < 7.6) {
          nextTear += 0.2 / density;
          const tear = new Shot({ x: rand(box.x + 3, box.x + box.w - 3), y: box.y - 6, vy: 26, gravity: 16, life: 4, art: 'corTear' });
          bullets.push(tear);
          tears.push(tear);
        }
        // A tear that lands on a pillar splashes there.
        for (const tear of tears) {
          if (tear.spent) continue;
          if (pillars.some((p) => p.standing && tear.x >= p.x - 1 && tear.x <= p.x + p.w + 1 && tear.y >= p.y - 1 && tear.y <= p.y + p.h)) tear.spent = true;
        }
      },
    };
  },

  // THE LULLABY, AGAIN: slower now, tired, the notes drifting in from his
  // side; the beam goes through twice.
  lampLullaby(box, density, { Shot, clamp }) {
    let real = 0;
    const EIGHTH = 0.22;
    const PHRASE = 24 * EIGHTH;
    const queue = [];
    let laid = 0;
    let passed = 0;
    let side = Math.random() < 0.5 ? -1 : 1;
    return {
      duration: 8.8,
      update: (dt, bullets, soul) => {
        real += dt / density;
        while (laid < 2 && real >= 0.3 + laid * PHRASE * 0.62) {
          const start = 0.3 + laid * PHRASE * 0.62;
          const centre = clamp(soul.y + (laid ? 10 : -10), box.y + 14, box.y + box.h - 14);
          for (const note of LULLABY) queue.push({ at: start + note.at * EIGHTH, note, centre });
          laid++;
        }
        for (let i = queue.length - 1; i >= 0; i--) {
          const q = queue[i];
          if (real < q.at) continue;
          queue.splice(i, 1);
          const y = q.centre - (q.note.pitch - LULLABY_MID) * 5.2;
          bullets.push(new Shot({ x: box.x + box.w + 8, y, vx: -30, vy: 3, warn: 0.25, life: 4.2, art: q.note.long ? 'corNoteLong' : 'corNote', wobble: { frequency: 2.2, amplitude: 1.5 } }));
        }
        if (passed < 2 && real >= (passed ? 5.0 : 1.4)) {
          side = passed ? -side : side;
          passed++;
          lampPass(bullets, box, side, soul);
        }
      },
    };
  },
};

// The middle of the box: the eye of the whirlpool.
function middle(box) {
  return { x: box.x + box.w / 2, y: box.y + box.h / 2 };
}

// The whirlpool's pull, and its eye: call each frame with real time. After
// the bell (`sea.pull`), it's weaker.
function whirl(box, sea) {
  const c = middle(box);
  let eye = null;
  const strength = sea?.pull ?? 1;
  return (bullets, soul, rdt, Shot) => {
    if (!eye) {
      eye = new Shot({ x: c.x, y: c.y, warn: 0.5, life: 7.4, art: 'corEye' });
      bullets.push(eye);
    }
    current(soul, c.x, c.y, rdt, 16 * strength, 13 * strength);
  };
}

// The tide for one of the storm's attacks: from the stage's level (see
// corrieStage.js), climbing a little through the turn; after the bell, it
// drains away instead.
function makeTide(box, sea) {
  const level = sea?.level ?? 14;
  if (sea?.soothed) return new Tide({ box, from: level, to: 0, rise: 1.6 });
  return new Tide({ box, from: level, to: level + (sea?.rise ?? 9), rise: 6 });
}

// The first time the tide is in the box, the panel says what it does.
function stormHint(box, sea, real) {
  if (!sea?.first) return;
  if (real < 3.4) box.hint = 'The tide is coming in! The water slows your SHADOW, and lightning lights it up. Stay above it.';
  else delete box.hint;
}

// One pass of the lamp's beam from the top corner on `side` (-1 left, 1
// right), with two pillars risen first to hide behind. Returns the pillars.
function lampPass(bullets, box, side, soul = null) {
  const ox = side > 0 ? box.x + box.w + 34 : box.x - 34;
  const oy = box.y - 46;
  const corners = [[box.x, box.y], [box.x + box.w, box.y], [box.x, box.y + box.h], [box.x + box.w, box.y + box.h]];
  const angles = corners.map(([x, y]) => Math.atan2(y - oy, x - ox));
  const lo = Math.min(...angles) - 0.12;
  const hi = Math.max(...angles) + 0.12;
  // It swings from the near wall across to the far one.
  const [from, to] = side > 0 ? [lo, hi] : [hi, lo];
  // Two pillars, one on each half of the box (so one is always in reach),
  // high enough that their shadows fall inside it; and never so that you're
  // in a shadow already where you stand (you always have to move).
  const halves = [[box.x + 8, box.x + box.w / 2 - 16], [box.x + box.w / 2 + 6, box.x + box.w - 19]];
  let pillars = [];
  for (let tries = 0; tries < 8; tries++) {
    pillars = halves.map(([a, b]) => new LampPillar({ x: a + Math.random() * (b - a), y: box.y + 14 + Math.random() * 22, w: 11, h: 16, warn: 0.6, life: 3.4 }));
    if (!soul) break;
    pillars.forEach((p) => { p.age = p.warn; });
    const hidden = pillars.some((p) => p.blocks(ox, oy, soul.x, soul.y) || p.blocks(ox, oy, soul.x + 6, soul.y) || p.blocks(ox, oy, soul.x - 6, soul.y));
    pillars.forEach((p) => { p.age = 0; });
    if (!hidden) break;
  }
  // (The beam first, so the pillars are drawn over its light.)
  bullets.push(new Beam({ ox, oy, from, to, sweep: 2.4, half: 0.12, warn: 0.9, pillars }));
  bullets.push(...pillars);
  return pillars;
}
