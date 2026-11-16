import { defineBulletArt as defineArt, Shot } from '../projectiles.js';
import { makeSprite } from '../../engine/sprite.js';
import { art } from '../../data/art/ch5Kit.js';
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
//
// (15 November 2026: the patterns played too easy, so each now layers
// two ideas, mixes shots at you with shots thrown where you're GOING, and
// keeps an uneven rhythm; each phase's own trick bites: the tide comes in
// deeper and a downdraught pushes you into it; the whirlpool surges and
// turns back; the beam swings across and back. After Haddock's bell
// (`sea.soothed`) every attack drops its extra layer and tricks as well as
// thinning out. The old ones are in notes/corrie-attacks-backup-2026-11-15.)
//
// (Polished 16 November 2026, for fairness and for reading at a glance.
// Two attacks in one turn now share ONE tide and ONE whirlpool: before,
// an encore doubled the water's drag and the current's pull. The pull
// eases off close to the eye. The wreckage comes in rings with an opening,
// the oars as a turning wheel; the lullaby's held notes show a fermata
// before they stop and a dotted line to where they'll go; the lamp's tears
// fall in swaying streams and its glass in panes. The water, the wind and
// the current each have a `carry`, so tools/dodgeCheck.html's bot allows
// for them as a player does. Stills, and the files as they were, are in
// a folder of their own inside notes/corrie-attacks-backup-2026-11-15.)

const TAU = Math.PI * 2;
const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));

const P = {
  k: '#0b1626', w: '#ffffff', c: '#d8f6ff', C: '#7fd4ee', b: '#3c8cc0', B: '#1e5a8a',
  p: '#f6f2e6', q: '#cfc6ae', Q: '#9c927a', y: '#ffe48a', Y: '#fff6c8', o: '#e0a040',
  g: '#a8e8c0', G: '#4a8a6a', W: '#8a6a48', V: '#5a4030', T: '#c49c70', r: '#c84a3a', R: '#8a2a24',
  s: '#b8c4cc', S: '#6a7884',
};


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
  frames: [art(5, 8, (p) => {
    p.set(2, 0, 'c');
    p.set(2, 1, 'c');
    p.rect(1, 2, 3, 1, 'c');
    p.rect(1, 3, 3, 1, 'c');
    p.rect(0, 4, 5, 2, 'c');
    p.rect(1, 6, 3, 1, 'C');
    p.set(0, 5, 'C');
    p.set(4, 5, 'C');
    p.rect(2, 3, 1, 2, 'w');
    p.set(1, 4, 'w');
  })],
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
// A shard of the lamp's glass, cracked off by the heat: a pale sliver,
// lit gold along one edge, turning as it falls.
defineBulletArt('corGlass', {
  frames: [
    art(5, 10, (p) => { p.poly([[2, 0], [4.4, 6], [1.5, 9.4], [0, 5]], 'c'); p.line(2, 0, 4, 6, 'Y'); p.line(2, 2, 2, 7, 'w'); p.set(1, 6, 'C'); }),
    art(5, 10, (p) => { p.poly([[2, 0], [4.4, 6], [1.5, 9.4], [0, 5]], 'c'); p.line(2, 0, 4, 6, 'y'); p.line(1, 4, 2, 8, 'w'); p.set(3, 5, 'w'); }),
  ],
  palette: P,
  radius: 2.2,
  spin: 1.5,
  frameSeconds: 0.12,
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
    // Of each frame's move under the water, only this much gets through.
    this.drag = 0.42;
    this.last = null;
    this.wadedAt = -1;
  }

  // Slows your shadow while it's under the water. Call it once a frame from
  // the attack's update; with two attacks in a turn sharing the one tide, it
  // still only slows you once.
  wade(soul) {
    if (this.wadedAt === this.age) return;
    this.wadedAt = this.age;
    if (this.last && soul.y > this.surface() + 1) {
      soul.x = this.last.x + (soul.x - this.last.x) * this.drag;
      soul.y = this.last.y + (soul.y - this.last.y) * this.drag;
    }
    this.last = { x: soul.x, y: soul.y };
  }

  // What it does to a step of (dx, dy) that ends at `p` (for reading ahead:
  // tools/dodgeCheck.html).
  carry(p, dx, dy) {
    if (p.y <= this.surface() + 1) return;
    p.x -= dx * (1 - this.drag);
    p.y -= dy * (1 - this.drag);
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
    this.push = 36;
  }

  carry(p, dx, dy, dt) {
    if (this.blowing && p.y >= this.y && p.y <= this.y + this.h) p.x += this.dir * this.push * dt;
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
// (`flipAt`: seconds after it starts moving, the whirl turns back, and it
// goes round the other way; it blinks for half a second before.)
// (`radial`: it points out from the eye, like the spoke of a wheel.)
class Orbiter {
  constructor({ cx, cy, r, a, speed = 40, dr = -6, art: name, radius = 3, seg = 0, spin = 0, warn = 0.4, life = 8, minR = 9, flipAt = Infinity, radial = false }) {
    Object.assign(this, { cx, cy, r0: r, a0: a, speed, dr, artName: name, radius, seg, spin, warn, life, minR, flipAt, radial });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.dir = speed >= 0 ? 1 : -1;
    this.drives = true;
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
      a += ((i * 0.1 >= this.flipAt ? -this.speed : this.speed) / ri) * s;
    }
    return { a, r };
  }

  // Blinking: before it starts, and in the half second before it turns back.
  get blinking() {
    const t = this.age - this.warn;
    return this.age < this.warn || (t > this.flipAt - 0.5 && t < this.flipAt);
  }

  update(dt) {
    this.age += dt;
    const { a, r } = this.at(Math.max(0, this.age - this.warn));
    this.x = this.cx + Math.cos(a) * r;
    this.y = this.cy + Math.sin(a) * r;
    // An oar lies along its path, turning end over end as it goes (or, a
    // spoke of the wheel, `radial`, points out from the eye).
    this.angle = this.radial ? a : a + Math.PI / 2 + this.spin * this.age;
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
    if (this.blinking) ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.3 : 0.65;
    const over = this.age - this.warn - this.life;
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.seg ? this.angle : this.spin * this.age);
    ctx.drawImage(frame, -frame.width / 2, -frame.height / 2);
    ctx.restore();
  }
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

// --- Helpers for the attacks ------------------------------------------------

// How fast your shadow has been going lately (real time), so a shot can be
// thrown where you're going, not where you are. Call once a frame.
function tracker() {
  let last = null;
  const v = { vx: 0, vy: 0 };
  return (soul, rdt) => {
    if (last && rdt > 0) {
      const k = Math.min(1, rdt * 8);
      v.vx += ((soul.x - last.x) / rdt - v.vx) * k;
      v.vy += ((soul.y - last.y) / rdt - v.vy) * k;
    }
    last = { x: soul.x, y: soul.y };
    return v;
  };
}

// His phases' `speed` (src/data/enemies/corrie.js), which every shot is
// sped up by once it's made: a led shot, or a dart that bursts just short
// of you, needs it to know when it'll get there. Keep these in step with
// the enemy file.
const BOY_FAST = 1.9;
const LAMP_FAST = 1.65;
const SPEED_GUESS = 1.45;

// The angle to throw a shot of (base) `speed` from `from` so that it meets
// you if you keep going as you are (`share` of the way: never quite all of
// it, so a player who stops dead is safe from it).
function leadAim(from, soul, v, speed, share = 0.8, fast = SPEED_GUESS) {
  const s = speed * fast;
  let tx = soul.x;
  let ty = soul.y;
  for (let i = 0; i < 3; i++) {
    const t = Math.hypot(tx - from.x, ty - from.y) / s;
    tx = soul.x + v.vx * t * share;
    ty = soul.y + v.vy * t * share;
  }
  return Math.atan2(ty - from.y, tx - from.x);
}

// A note that holds: the lullaby's fermata. At `holdFrom` (its own age) it
// stops dead where it is for `holdFor` seconds, the way the hum catches its
// breath on the long note; then it comes on `after` times as fast. Both
// tricks are told first: a fermata sign shows over the note a moment before
// it stops (`TELL` seconds) and flickers while it's held; and a note that
// will turn on you (`target`) fixes on where you are AS IT STOPS, and points
// a dotted line there until it goes: step off the line. It moves
// itself (`drives`), so it can be read ahead.
class HeldNote extends Shot {
  constructor(options) {
    super(options);
    this.holdFrom = options.holdFrom ?? Infinity;
    this.holdFor = options.holdFor ?? 0;
    this.after = options.after ?? 1;
    this.target = options.target ?? null;
    // (`aimDelay`: it fixes on you this long after it stops, and holds that
    // much longer: a phrase's notes fix on you one after another, in the
    // tune's order, so they come after you in a run.)
    this.aimDelay = this.target ? options.aimDelay ?? 0 : 0;
    this.aim = null;
    this.released = false;
    this.drives = true;
  }

  get holding() {
    return !this.released && this.age >= this.holdFrom;
  }

  update(dt, box) {
    if (!this.released && this.age + dt >= this.holdFrom) {
      if (this.target && !this.aim && this.age + dt >= this.holdFrom + this.aimDelay) this.aim = { x: this.target.x, y: this.target.y };
      if (this.age + dt < this.holdFrom + this.aimDelay + this.holdFor) {
        this.age += dt;
        return;
      }
      this.released = true;
      const speed = Math.hypot(this.vx, this.vy) * this.after;
      const a = this.aim ? Math.atan2(this.aim.y - this.y, this.aim.x - this.x) : Math.atan2(this.vy, this.vx);
      this.vx = Math.cos(a) * speed;
      this.vy = Math.sin(a) * speed;
      this.wobble = null;
    }
    super.update(dt, box);
  }

  draw(ctx, ...rest) {
    const TELL = 0.4;
    if (!this.released && this.age >= this.warn && this.age >= this.holdFrom - TELL) {
      const x = Math.round(this.x);
      const y = Math.round(this.y);
      const blink = Math.floor(this.age * 14) % 2;
      ctx.save();
      if (this.holding && this.aim) {
        // Where it'll go: a dotted line, and a mark at the end of it.
        const a = Math.atan2(this.aim.y - this.y, this.aim.x - this.x);
        const far = Math.min(34, Math.hypot(this.aim.x - this.x, this.aim.y - this.y));
        ctx.fillStyle = blink ? '#fff6c8' : '#ffe48a';
        ctx.globalAlpha = 0.85;
        for (let d = 7; d < far; d += 4) ctx.fillRect(Math.round(this.x + Math.cos(a) * d), Math.round(this.y + Math.sin(a) * d), 1, 1);
        ctx.globalAlpha = blink ? 0.9 : 0.5;
        ctx.fillRect(Math.round(this.aim.x) - 2, Math.round(this.aim.y), 5, 1);
        ctx.fillRect(Math.round(this.aim.x), Math.round(this.aim.y) - 2, 1, 5);
      }
      // The fermata: an arc with a dot under it, over the note.
      ctx.globalAlpha = this.holding ? (blink ? 1 : 0.55) : Math.min(1, (this.age - (this.holdFrom - TELL)) / 0.15) * 0.8;
      ctx.fillStyle = '#fff6c8';
      ctx.fillRect(x - 2, y - 10, 5, 1);
      ctx.fillRect(x - 3, y - 9, 1, 2);
      ctx.fillRect(x + 3, y - 9, 1, 2);
      ctx.fillRect(x, y - 8, 1, 1);
      ctx.restore();
    }
    super.draw(ctx, ...rest);
  }
}

// A water dart that bursts: `splitAt` seconds after it's thrown (its own
// age) it swells for a blink (`swell`) and breaks into `parts` drops that
// fan out `spread` radians either side of its way, at its own speed. The
// drops are worked out from where it burst, so it all moves itself.
class SplitDart extends Shot {
  constructor(options) {
    super(options);
    this.splitAt = options.splitAt ?? 0.6;
    this.parts = options.parts ?? 3;
    this.spread = options.spread ?? 0.5;
    this.swell = 0.12;
    this.from = null;
    this.drives = true;
  }

  update(dt, box) {
    if (this.from) {
      this.age += dt;
      return;
    }
    super.update(dt, box);
    if (this.age >= this.splitAt) this.from = { x: this.x, y: this.y, a: Math.atan2(this.vy, this.vx), s: Math.hypot(this.vx, this.vy), at: this.age };
  }

  drops() {
    const t = this.age - this.from.at;
    const out = [];
    for (let i = 0; i < this.parts; i++) {
      const a = this.from.a + (this.parts > 1 ? (i / (this.parts - 1) - 0.5) * 2 * this.spread : 0);
      out.push({ x: this.from.x + Math.cos(a) * this.from.s * t, y: this.from.y + Math.sin(a) * this.from.s * t });
    }
    return out;
  }

  edgeDistance(x, y) {
    if (!this.active) return Infinity;
    if (!this.from) return super.edgeDistance(x, y);
    let best = Infinity;
    for (const d of this.drops()) best = Math.min(best, Math.hypot(x - d.x, y - d.y) - 1.8);
    return best;
  }

  isGone(box) {
    if (!this.from) return super.isGone(box);
    return this.age >= this.warn + this.life + 0.3 || this.drops().every((d) => d.x < box.x - 30 || d.x > box.x + box.w + 30 || d.y < box.y - 30 || d.y > box.y + box.h + 30);
  }

  draw(ctx) {
    if (!this.from) {
      // (It swells and goes white just before it bursts.)
      if (this.age > this.splitAt - this.swell * 2 && this.age >= this.warn) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(Math.round(this.x) - 1, Math.round(this.y) - 1, 3, 3);
        ctx.restore();
      }
      super.draw(ctx);
      return;
    }
    const frame = sprite('corDrop')[0];
    ctx.save();
    const over = this.age - (this.warn + this.life);
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.3);
    for (const d of this.drops()) ctx.drawImage(frame, Math.round(d.x - frame.width / 2), Math.round(d.y - frame.height / 2));
    ctx.restore();
  }
}

// A downdraught: a column of wind, arrows first, that shoves your shadow
// DOWN (into the tide) while it blows. The attack does the shoving.
class DownDraught {
  constructor({ box, x, w, warn = 0.7, blow = 1.3 }) {
    Object.assign(this, { box, x, w, warn, blow });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.push = 34;
  }

  carry(p, dx, dy, dt) {
    if (this.blowing && p.x >= this.x && p.x <= this.x + this.w) p.y = Math.min(this.box.y + this.box.h - 5, p.y + this.push * dt);
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
    ctx.fillRect(Math.round(this.x), b.y, Math.round(this.w), b.h);
    ctx.fillStyle = '#d8fff0';
    const shift = warning ? 0 : (this.age * 70) % 16;
    const ax = Math.round(this.x + this.w / 2);
    for (let y = b.y - 16; y < b.y + b.h + 16; y += 16) {
      const ay = Math.round(y + shift);
      if (ay < b.y || ay > b.y + b.h - 6) continue;
      ctx.fillRect(ax, ay, 1, 6);
      ctx.fillRect(ax - 1, ay + 4, 1, 2);
      ctx.fillRect(ax + 1, ay + 4, 1, 2);
    }
    ctx.restore();
  }
}

// The whirlpool drawing breath before a surge: a faint ring closing on the
// eye from the edge of the box (harmless). When it reaches the eye, the
// current pulls nearly twice as hard for a moment.
class SurgeRing {
  constructor({ cx, cy, warn = 0.7 }) {
    Object.assign(this, { cx, cy, warn });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.warn;
  }

  edgeDistance() {
    return Infinity;
  }

  draw(ctx) {
    const t = Math.min(1, this.age / this.warn);
    ctx.save();
    ctx.globalAlpha = 0.25 + 0.4 * t;
    ctx.strokeStyle = '#bff0ff';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, 6 + 52 * (1 - t), 0, TAU);
    ctx.stroke();
    ctx.restore();
  }
}

// The beam, swinging across and then (after `hold` at the far wall) back
// the way it came: the shadow you hid in swaps to the pillar's other side.
class SwingBeam extends Beam {
  constructor({ leg = 1.6, hold = 0.4, ...rest }) {
    super({ ...rest, sweep: leg * 2 + hold });
    this.leg = leg;
    this.hold = hold;
  }

  get angle() {
    const t = Math.max(0, this.age - this.warn);
    const ease = (k) => 0.5 - 0.5 * Math.cos(Math.min(1, Math.max(0, k)) * Math.PI);
    const back = t - this.leg - this.hold;
    const k = back > 0 ? 1 - ease(back / this.leg) : ease(t / this.leg);
    return this.from + (this.to - this.from) * k;
  }
}

// The lens's rays with legs of their own lengths: it grinds round, and then
// lurches.
class LurchRay extends Beam {
  constructor({ ox, oy, from, reach, legs = [2.4, 1.5, 2.6], half = 0.05, warn = 0.9 }) {
    super({ ox, oy, from, to: from + reach, sweep: legs.reduce((a, b) => a + b, 0), half, warn });
    this.reach = reach;
    this.legs = legs;
  }

  get angle() {
    let t = Math.min(this.sweep, Math.max(0, this.age - this.warn));
    let k = 0;
    while (k < this.legs.length - 1 && t > this.legs[k]) t -= this.legs[k++];
    const p = 0.5 - 0.5 * Math.cos(Math.min(1, t / this.legs[k]) * Math.PI);
    return this.from + this.reach * (k % 2 ? 1 - p : p);
  }
}

// Where a ring of wreckage has its opening, shown while the ring is still
// out past the walls of the box: a pale dashed arc just inside them, going
// round with the opening (`guide`: an Orbiter at the opening's middle, never
// put in the box, only asked where it is). Harmless.
class GapMark {
  constructor({ box, guide, width }) {
    Object.assign(this, { box, guide, width });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.show = 37;
  }

  get ring() {
    return this.guide.at(Math.max(0, this.age - this.guide.warn));
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.ring.r < this.show - 6;
  }

  edgeDistance() {
    return Infinity;
  }

  draw(ctx) {
    const { a, r } = this.ring;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, (r - this.show + 6) / 6)) * (Math.floor(this.age * 8) % 2 ? 0.75 : 0.45);
    ctx.strokeStyle = '#bff0ff';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.arc(this.guide.cx, this.guide.cy, this.show, a - this.width / 2, a + this.width / 2);
    ctx.stroke();
    ctx.restore();
  }
}

// The eye of the whirlpool, and its pull: it draws your shadow in toward it
// and round it. The pull is `WHIRL.pull` pixels a second out in the whirl,
// easing off close to the eye (inside `easeFrom` pixels, down to `easeTo` of
// it at the eye's rim), so the last step into it is one you let happen, not
// one it snatches; a surge (`surges`, in its own age) is `WHIRL.surge` times
// as hard for `surgeFor` seconds.
const WHIRL = { pull: 27, swirl: 18, surge: 2, surgeFor: 0.9, surgeWarn: 0.75, easeFrom: 22, easeTo: 0.4 };
class Eye extends Shot {
  constructor({ cx, cy, strength = 1, calm = false }) {
    super({ x: cx, y: cy, warn: 0.5, life: 40, art: 'corEye' });
    Object.assign(this, { strength, calm });
    this.surges = [];
    this.flipAt = Infinity;
    this.warned = new Set();
    this.tuggedAt = -1;
    this.drives = true;
  }

  surging(age = this.age) {
    return !this.calm && this.surges.some((t) => age >= t && age < t + WHIRL.surgeFor);
  }

  // Moves `p` as the current does in `dt` seconds.
  drift(p, dt) {
    const dx = p.x - this.x;
    const dy = p.y - this.y;
    const d = Math.hypot(dx, dy);
    if (d < 1) return;
    const near = Math.min(1, Math.max(0, (d - 7) / (WHIRL.easeFrom - 7)));
    const pull = WHIRL.pull * this.strength * (WHIRL.easeTo + (1 - WHIRL.easeTo) * near) * (this.surging() ? WHIRL.surge : 1);
    const swirl = WHIRL.swirl * this.strength * (this.age >= this.flipAt ? -1 : 1);
    p.x += ((-dx / d) * pull + (-dy / d) * swirl) * dt;
    p.y += ((-dy / d) * pull + (dx / d) * swirl) * dt;
  }

  // Once a frame, from the attack (however many attacks share the eye).
  tug(bullets, soul, rdt) {
    if (this.tuggedAt === this.age) return;
    this.tuggedAt = this.age;
    if (!this.calm) {
      for (const t of this.surges) {
        if (this.warned.has(t) || this.age < t - WHIRL.surgeWarn) continue;
        this.warned.add(t);
        bullets.push(new SurgeRing({ cx: this.x, cy: this.y, warn: WHIRL.surgeWarn }));
      }
    }
    this.drift(soul, rdt);
  }

  // (For reading ahead: tools/dodgeCheck.html.)
  carry(p, dx, dy, dt) {
    this.drift(p, dt);
  }
}

// --- The attacks -----------------------------------------------------------

// Where his staff is: off the right of the box, high.
const staff = (box) => ({ x: box.x + box.w + 16, y: box.y + 10 });

// Each attack's rhythm is written for his own density (1.9 in the boy and
// the lamp, 2 in the storm and whirlpool): `tempo` runs it slower when he's
// lighter (an encore, or Haddock's bell).
const tempo = (density, at = 1.9) => density / at;

export const CORRIE_ATTACKS = {
  // WATER DARTS: off the end of his staff, in a child's uneven rhythm, bar
  // after bar: "da . da da da" (a big dart at you that swells white and
  // bursts into a fan of spray just short of you, then fans thrown where you're
  // GOING), "da . da . da" (a fan of three that all burst, then two walls of darts
  // with one gap each, one from his side and one from above, crossing), then a run of single
  // darts, each led, quick as he can, skimmed so they skip off the walls. Every bar starts with a
  // pair from the top corners that curve after you.
  corrieDarts(box, density, { Shot, rand, sea }) {
    let real = 0;
    const calm = sea?.soothed;
    const track = tracker();
    const k = tempo(density);
    const BARS = [[0, 0.6, 0.86, 1.12], [0, 0.55, 1.1], [0, 0.2, 0.4, 0.6, 0.8, 1.0]];
    const BAR = 1.55;
    const plan = [];
    for (let b = 0, t0 = 0.35; t0 < 6.8 * k; b++, t0 += BAR) {
      BARS[b % 3].forEach((t, i) => plan.push({ at: (t0 + t) / k, kind: b % 3, i }));
    }
    let n = 0;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        const rdt = dt / density;
        real += rdt;
        const v = track(soul, rdt);
        while (n < plan.length && real >= plan[n].at) {
          const { kind, i } = plan[n++];
          if (real > 6.9) continue;
          const from = { x: staff(box).x, y: box.y + rand(4, box.h - 4) };
          const aim = Math.atan2(soul.y - from.y, soul.x - from.x);
          const fan = (a, count, spread, speed, split = null) => {
            for (let j = 0; j < count; j++) {
              const t = a + (j - (count - 1) / 2) * spread;
              const o = { x: from.x, y: from.y, vx: Math.cos(t) * speed, vy: Math.sin(t) * speed, warn: 0.28, life: 3, art: 'corDart' };
              bullets.push(split ? new SplitDart({ ...o, ...split }) : new Shot(o));
            }
          };
          // (A burst comes when it's most of the way to you: a big dart that
          // swells white, then breaks into a fan of spray.)
          const burstAt = (speed) => 0.28 + Math.max(0.35, (Math.hypot(soul.x - from.x, soul.y - from.y) - 15) / (speed * BOY_FAST));
          if (kind === 0) {
            // The first a single big dart at you that bursts; then fans where you're going.
            if (i === 0) fan(aim, calm ? 3 : 1, 0.21, 60, calm ? null : { splitAt: burstAt(60), parts: 5, spread: 0.7 });
            else if (!calm) fan(leadAim(from, soul, v, 68, 0.8, BOY_FAST), 3, 0.2, 68, i === 3 ? { splitAt: burstAt(68), parts: 3, spread: 0.35 } : null);
            else fan(aim, 1, 0, 56);
          } else if (kind === 1) {
            if (i > 0 && !calm) {
              // A wall of darts across the whole box with one gap in it, near
              // you but never on you: the first from his side, the second
              // dropping from above, so the two cross.
              const down = i === 2;
              const at = down ? soul.x : soul.y;
              const lo = down ? box.x : box.y;
              const hi = down ? box.x + box.w : box.y + box.h;
              const way = at < lo + 22 ? 1 : at > hi - 22 ? -1 : Math.random() < 0.5 ? -1 : 1;
              const gap = Math.min(Math.max(at + way * rand(12, 22), lo + 8), hi - 8);
              for (let u = lo + 2; u < hi; u += 7) {
                if (Math.abs(u - gap) < 7.5) continue;
                if (down) bullets.push(new Shot({ x: u, y: box.y - 6, vy: 58, warn: 0.4, life: 3, art: 'corDart' }));
                else bullets.push(new Shot({ x: box.x + box.w + 6, y: u, vx: -58, warn: 0.4, life: 3, art: 'corDart' }));
              }
            } else if (calm) fan(aim, 3, 0.19, 58);
            else fan(aim, 3, 0.3, 60, { splitAt: burstAt(60), parts: 3, spread: 0.32 });
          } else {
            // The run: down the edge, every one thrown ahead of you.
            from.y = box.y + 8 + (i / 5) * (box.h - 16);
            const a = calm ? Math.atan2(soul.y - from.y, soul.x - from.x) : leadAim(from, soul, v, 64, 0.9, BOY_FAST);
            // (Skimmed like stones: they skip off the walls of the box and
            // keep going a while. The last of the run bursts instead.)
            const o = { x: from.x, y: from.y, vx: Math.cos(a) * 64, vy: Math.sin(a) * 64, warn: 0.22, life: calm ? 3 : 3.2, art: 'corDart' };
            if (i === 5 && !calm) bullets.push(new SplitDart({ ...o, splitAt: burstAt(64), parts: 3, spread: 0.4 }));
            else {
              const dart = new Shot({ ...o, bounce: !calm });
              // (It starts just inside his side of the box, so it can skip.)
              if (!calm) dart.x = box.x + box.w - 3;
              bullets.push(dart);
            }
          }
          if ((i === 0 || (kind === 0 && i === 2)) && !calm) {
            for (const x of [box.x - 6, box.x + box.w + 6]) {
              const a = Math.atan2(soul.y - (box.y - 6), soul.x - x);
              bullets.push(new Shot({ x, y: box.y - 6, vx: Math.cos(a) * 46, vy: Math.sin(a) * 46, warn: 0.4, life: 3, art: 'corDart', homing: { target: soul, turn: 1.0 } }));
            }
          }
        }
      },
    };
  },

  // SPELL CIRCLE: two rings of runes appear round you, blink, then turn
  // opposite ways and close in, each with its way out on a different side:
  // the small one shuts fast (get out through its gap at once), the big one
  // follows (get round to ITS gap before it reaches you). Where the big one
  // shuts, it bursts into darts. Casts come long, then short, short, short; between
  // them, a dart thrown where you're going.
  corrieCircle(box, density, { Shot, rand, sea }) {
    let real = 0;
    const calm = sea?.soothed;
    const track = tracker();
    const k = Math.min(1.1, tempo(density));
    const times = (calm ? [0.25, 3.0, 4.75, 6.3] : [0.25, 2.6, 3.95, 5.3, 6.45]).map((t) => t / k);
    let cast = 0;
    const rings = [];
    let nextDart = 1.2;
    return {
      duration: 8.2,
      update: (dt, bullets, soul) => {
        const rdt = dt / density;
        real += rdt;
        const v = track(soul, rdt);
        if (cast < times.length && real >= times[cast] && real < 7) {
          cast++;
          // The way out of the small ring is never straight into a wall...
          const toMiddle = Math.atan2(box.y + box.h / 2 - soul.y, box.x + box.w / 2 - soul.x);
          const innerAt = toMiddle + rand(-1, 1);
          // ...and the big one's is a quarter turn or so round from it.
          const outerAt = innerAt + (Math.random() < 0.5 ? -1 : 1) * rand(0.9, 1.5);
          const slot = (a, count) => Math.round(((((a / TAU) * count) % count) + count) % count);
          const spin = cast % 2 ? 1 : -1;
          const outer = new RuneRing({ x: soul.x, y: soul.y, r: 40, count: 16, gap: calm ? 4 : 3, gapAt: slot(outerAt, 16), warn: 0.75, spin: spin * 0.4, close: calm ? 2.2 : 2.1 });
          bullets.push(outer);
          rings.push(outer);
          if (!calm) bullets.push(new RuneRing({ x: soul.x, y: soul.y, r: 22, count: 9, gap: 3, gapAt: slot(innerAt, 9), warn: 0.75, spin: -spin * 0.5, close: 1.1 }));
        }
        for (const ring of rings) {
          if (ring.burst || ring.age < ring.warn + ring.close) continue;
          ring.burst = true;
          const turn = rand(0, TAU);
          for (let j = 0; j < 6; j++) {
            const a = turn + (j / 6) * TAU;
            bullets.push(new Shot({ x: ring.x + Math.cos(a) * 4, y: ring.y + Math.sin(a) * 4, vx: Math.cos(a) * 34, vy: Math.sin(a) * 34, warn: 0.35, life: 2.4, art: 'corDart' }));
          }
        }
        if (!calm && real >= nextDart && real < 7.2) {
          nextDart += 0.68 / k;
          const from = { x: staff(box).x, y: box.y + rand(6, box.h - 6) };
          const a = leadAim(from, soul, v, 62, 0.8, BOY_FAST);
          bullets.push(new Shot({ x: from.x, y: from.y, vx: Math.cos(a) * 62, vy: Math.sin(a) * 62, warn: 0.3, life: 3, art: 'corDart' }));
        }
      },
    };
  },

  // PAPER BOATS: a fleet in a column with one gap, sailing across on a
  // swell, so the whole column (and its gap) rides up and down as it comes.
  // The waves come uneven, from his side, from the other, and twice from
  // both at once, crossing (each with its own gap); now and then a boat tips
  // over and spills its water at you.
  corrieBoats(box, density, { Shot, rand, clamp, sea }) {
    let real = 0;
    const calm = sea?.soothed;
    const k = tempo(density);
    // (0: from both sides at once, crossing.)
    const waves = [[0.3, 1], [1.25, 1], [1.95, -1], [3.2, 0], [4.2, 1], [4.75, -1], [5.6, 0], [6.5, -1]].map(([t, s]) => [t / k, s]);
    let wave = 0;
    const sails = [];
    return {
      duration: 8.2,
      update: (dt, bullets, soul) => {
        const rdt = dt / density;
        real += rdt;
        while (wave < waves.length && real >= waves[wave][0]) {
          const from = waves[wave++][1];
          if (real > 7) continue;
          for (const fromRight of from ? [from > 0] : calm ? [true] : [true, false]) {
          // The gap is near you, never far, but never right on you.
          const way = soul.y < box.y + 20 ? 1 : soul.y > box.y + box.h - 20 ? -1 : Math.random() < 0.5 ? -1 : 1;
          const gap = clamp(soul.y + way * rand(11, 24), box.y + 8, box.y + box.h - 8);
          const x = fromRight ? box.x + box.w + 10 : box.x - 10;
          // The swell: the whole column rides it together (one phase for all).
          const swell = calm ? { frequency: 3, amplitude: 2.5 } : { frequency: rand(2.2, 2.8), amplitude: 6 };
          for (let y = box.y - 4; y <= box.y + box.h + 4; y += 10.7) {
            if (Math.abs(y - gap) < (calm ? 10.5 : 9)) continue;
            const shot = new Shot({ x, y, vx: (fromRight ? -1 : 1) * 33, warn: 0.45, life: 6, art: 'corBoat', wobble: swell });
            bullets.push(shot);
            if (!calm && y > box.y && y < box.y + box.h && Math.random() < 0.17) sails.push({ shot, at: rand(box.x + 18, box.x + box.w - 18), fromRight });
          }
          }
        }
        for (const s of sails) {
          if (s.done || s.shot.age < s.shot.warn) continue;
          if (s.fromRight ? s.shot.x > s.at : s.shot.x < s.at) continue;
          s.done = true;
          s.shot.life = 0;
          s.shot.age = s.shot.warn + 0.01;
          const a = Math.atan2(soul.y - s.shot.y, soul.x - s.shot.x);
          for (let j = -1; j <= 1; j++) bullets.push(new Shot({ x: s.shot.x, y: s.shot.y, vx: Math.cos(a + j * 0.35) * 40, vy: Math.sin(a + j * 0.35) * 40, warn: 0.15, life: 1.8, art: 'corDrop' }));
        }
      },
    };
  },

  // THE LULLABY: its opening four bars, the notes coming at you in the
  // tune's own rhythm, each at its own pitch: across from his side on a
  // staff that follows you up and down as it's sung (higher notes higher), then down from above (higher notes further
  // right), then, a round, across from the OTHER side with the staff upside
  // down and in octaves; each phrase comes in before the last is done. The trick: on each phrase's long last note the hum catches its
  // breath, and every note of that phrase stops dead where it is, flickers,
  // and then comes on half again as fast; at the end of the round they
  // all turn and come at you from wherever they stopped. The long E never resolves: at
  // the end of every phrase it bursts where it stops.
  corrieLullaby(box, density, { Shot, clamp, sea }) {
    let real = 0;
    const calm = sea?.soothed;
    const EIGHTH = 0.16 / Math.min(1, tempo(density));
    const PHRASE = 24 * EIGHTH;
    const LAST = LULLABY[LULLABY.length - 1];
    const plan = [
      { start: 0.3, way: 'across', side: 1 },
      { start: 0.3 + PHRASE * 0.4, way: 'down', side: 1 },
      { start: 0.3 + PHRASE * 0.8, way: 'across', side: -1, octave: !calm },
    ];
    const queue = [];
    const bursts = [];
    const staves = [];
    let planned = 0;
    const STEP = 5.2;
    return {
      duration: 8.8,
      update: (dt, bullets, soul) => {
        real += dt / density;
        // Each phrase is laid on a staff centred where you are as it starts.
        while (planned < plan.length && real >= plan[planned].start) {
          const { start, way, side, octave } = plan[planned++];
          const across = way === 'across';
          const staffAt = { c: across ? soul.y : soul.x };
          const breath = start + LAST.at * EIGHTH;
          for (const note of LULLABY) queue.push({ at: start + note.at * EIGHTH, note, across, side, staffAt, breath, octave, last: note === LAST && (!calm || planned === plan.length) });
          staves.push({ staffAt, across, end: breath });
        }
        // Each phrase's staff follows you as it's sung (a step behind: 26 px
        // a second; 44 from 16 November 2026), so the tune is always sung at you:
        // read its shape.
        for (const st of staves) {
          if (real > st.end) continue;
          const want = st.across ? clamp(soul.y, box.y + 22, box.y + box.h - 22) : clamp(soul.x, box.x + 22, box.x + box.w - 22);
          const step = (calm ? 12 : 44) * (dt / density);
          st.staffAt.c += Math.max(-step, Math.min(step, want - st.staffAt.c));
        }
        for (let i = queue.length - 1; i >= 0; i--) {
          const q = queue[i];
          if (real < q.at) continue;
          queue.splice(i, 1);
          q.centre = q.staffAt.c;
          const off = (q.note.pitch - LULLABY_MID) * STEP * q.side;
          const art = q.note.long ? 'corNoteLong' : 'corNote';
          // (On the last note of the round, the held notes turn on you.)
          const hold = calm ? {} : { holdFrom: q.breath - q.at, holdFor: 0.5, after: 1.85, target: q.side < 0 ? soul : null };
          // (The tune's own notes turn in every phrase; the chord's only in the round.)
          const melody = calm ? hold : { ...hold, target: soul, aimDelay: LULLABY.indexOf(q.note) * 0.05 };
          if (hold.target) hold.aimDelay = melody.aimDelay + 0.03;
          let shot;
          if (q.across) shot = new HeldNote({ x: q.side > 0 ? box.x + box.w + 8 : box.x - 8, y: q.centre - off, vx: -54 * q.side, warn: 0.2, life: 3.6, art, ...melody });
          else shot = new HeldNote({ x: q.centre + off, y: box.y - 8, vy: 54, warn: 0.2, life: 3.6, art, ...melody });
          bullets.push(shot);
          // (Each note is a chord, a note 11 px either side of it, too close to slip between; the
          // round is sung in octaves instead: the same note again, 30 px over.)
          if (q.octave) bullets.push(new HeldNote({ x: shot.x, y: shot.y + (shot.y > box.y + box.h / 2 ? -30 : 30), vx: shot.vx, warn: 0.2, life: 3.6, art, ...hold }));
          else if (!calm) {
            for (const h of [-11, 11]) {
              bullets.push(q.across
                ? new HeldNote({ x: shot.x, y: shot.y + h, vx: shot.vx, warn: 0.2, life: 3.6, art: 'corNote', ...hold })
                : new HeldNote({ x: shot.x + h, y: shot.y, vy: shot.vy, warn: 0.2, life: 3.6, art: 'corNote', ...hold }));
            }
          }
          if (q.last) {
            shot.burstAt = q.across ? clamp(soul.x, box.x + 16, box.x + box.w - 16) : clamp(soul.y, box.y + 16, box.y + box.h - 16);
            shot.across = q.across;
            shot.side = q.side;
            bursts.push(shot);
          }
        }
        for (const shot of bursts) {
          if (shot.burst || shot.age < shot.warn || shot.holding) continue;
          // (Held, it bursts where it stopped, the moment it's let go: its
          // fermata is the warning. After the bell, nothing's held, and it
          // bursts when it's come as far across as you were.)
          if (shot.holdFrom === Infinity && (shot.across ? (shot.side > 0 ? shot.x > shot.burstAt : shot.x < shot.burstAt) : shot.y < shot.burstAt)) continue;
          if (shot.holdFrom !== Infinity && !shot.released) continue;
          shot.burst = true;
          shot.life = 0;
          shot.age = shot.warn + 0.01;
          const turn = Math.random() * TAU;
          for (let j = 0; j < 16; j++) {
            const a = turn + (j / 16) * TAU;
            bullets.push(new Shot({ x: shot.x, y: shot.y, vx: Math.cos(a) * 38, vy: Math.sin(a) * 38, life: 1.8, art: 'corDrop' }));
          }
        }
      },
    };
  },

  // --- 2. The storm -------------------------------------------------------

  // RAIN: sheets of it, slanting on the wind, each row with one gap that
  // wanders after you; now and then two rows close together, the second's
  // gap a step over. The wind swings round at uneven times. And over it all,
  // a bolt comes down where you're going every couple of seconds: if the
  // tide's under it, the whole tide lights up. The tide is in.
  stormRain(box, density, { Line, rand, clamp, sea }) {
    let real = 0;
    const calm = sea?.soothed;
    const tide = makeTide(box, sea);
    const track = tracker();
    const k = tempo(density, 2);
    let started = false;
    let nextRow = 0.35;
    let rows = 0;
    const every = 0.76 / Math.sqrt(density);
    let wind = (Math.random() < 0.5 ? -1 : 1) * 16;
    const swings = [2.1, 3.7, 5.6].map((t) => t / k);
    let nextBolt = 1.3 / k;
    let late = null;
    const row = (bullets, soul, gap) => {
      const vy = 60;
      const angle = Math.atan2(vy, wind);
      for (let x = box.x - 20; x < box.x + box.w + 20; x += 8) {
        const sx = x + rand(-1.5, 1.5);
        const later = sx + wind * ((soul.y - box.y + 8) / vy);
        if (Math.abs(later - gap) < 14) continue;
        bullets.push(new Line({ x: sx, y: box.y - 8, angle, length: 6, thickness: 1.6, warn: 0, life: 2.6, vx: wind, vy, color: '#bfe8f0' }));
      }
    };
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        const rdt = dt / density;
        real += rdt;
        const v = track(soul, rdt);
        if (!started) {
          started = true;
          if (!bullets.includes(tide)) bullets.push(tide);
        }
        stormHint(box, sea, real);
        tide.wade(soul);
        for (const t of swings) if (real > t && real - rdt <= t) wind = -Math.sign(wind) * rand(14, 22);
        if (late && real >= late.at) {
          row(bullets, soul, late.gap);
          late = null;
        }
        if (!calm && real >= nextBolt && real < 6.6) {
          nextBolt += 3.0 / k;
          lightning(box, tide, bullets, soul.x + v.vx * 0.6, Math.random() < 0.5 ? -1 : 1);
        }
        if (real < nextRow || real > 6.8) return;
        nextRow += every;
        rows++;
        const way = soul.x < box.x + 20 ? 1 : soul.x > box.x + box.w - 20 ? -1 : Math.random() < 0.5 ? -1 : 1;
        const gap = clamp(soul.x + way * rand(6, 15), box.x + 4, box.x + box.w - 4);
        row(bullets, soul, gap);
        // Every fourth row, a second a beat behind it, its gap a step on.
        if (!calm && rows % 4 === 0) late = { at: real + 0.3, gap: clamp(gap + way * rand(10, 14), box.x + 4, box.x + box.w - 4) };
      },
    };
  },

  // LIGHTNING: forks come down at you, a flickering path first and a spark
  // where it'll land. Where one lands in the water, the whole tide lights
  // up (it flickers yellow first): get out of it. Its rhythm goes: at you;
  // where you're going; a pair either side (stay between); at you; then a
  // chain of four walking across behind you and on past (keep ahead of it,
  // or double back through it once it's struck).
  stormLightning(box, density, { Shot, rand, clamp, sea }) {
    let real = 0;
    const calm = sea?.soothed;
    const tide = makeTide(box, sea);
    const track = tracker();
    let started = false;
    let next = 0.4;
    let strikes = 0;
    let nextDrop = 0.6;
    const every = 0.76 / density;
    const chains = [];
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        const rdt = dt / density;
        real += rdt;
        const v = track(soul, rdt);
        if (!started) {
          started = true;
          if (!bullets.includes(tide)) bullets.push(tide);
        }
        stormHint(box, sea, real);
        tide.wade(soul);
        if (real >= nextDrop && real < 7) {
          nextDrop += (calm ? 0.85 : 0.42) / density;
          bullets.push(new Shot({ x: rand(box.x + 3, box.x + box.w - 3), y: box.y - 6, vy: 44, vx: rand(-6, 6), life: 2.6, art: 'corDrop' }));
        }
        for (const c of chains) {
          while (c.left.length && real >= c.left[0].at) lightning(box, tide, bullets, c.left.shift().x, 0);
        }
        if (real < next || real > 6.4) return;
        strikes++;
        const step = calm ? 0 : strikes % 5;
        if (step === 3) {
          lightning(box, tide, bullets, soul.x - 11, -1);
          lightning(box, tide, bullets, soul.x + 11, 1);
          next += every * 1.15;
        } else if (step === 0 && !calm) {
          // The chain: from behind you, on past where you're heading.
          const dir = Math.abs(v.vx) > 10 ? Math.sign(v.vx) : Math.random() < 0.5 ? -1 : 1;
          chains.push({ left: [-24, -8, 8, 24].map((d, i) => ({ at: real + i * 0.22, x: clamp(soul.x + d * dir, box.x + 4, box.x + box.w - 4) })) });
          next += every * 1.7;
        } else {
          const x = step === 2 ? soul.x + v.vx * 0.7 : soul.x + rand(-4, 4);
          lightning(box, tide, bullets, x, calm ? 0 : Math.random() < 0.5 ? -1 : 1);
          next += every;
        }
      },
    };
  },

  // GUSTS: bands of wind across the box (arrows first) that shove you along
  // and carry foam; the band follows you. Every third, a DOWNDRAUGHT instead:
  // a column of wind on you, pressing you down into the tide, foam coming
  // down it. Step out of it sideways, or ride it and dodge the foam.
  stormGusts(box, density, { Shot, rand, clamp, sea }) {
    let real = 0;
    const calm = sea?.soothed;
    const tide = makeTide(box, sea);
    let started = false;
    let next = 0.3;
    let n = 0;
    const bands = [];
    const drafts = [];
    const every = 1.8 / density;
    let nextDrop = 0.5;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        const rdt = dt / density;
        real += rdt;
        if (!started) {
          started = true;
          if (!bullets.includes(tide)) bullets.push(tide);
        }
        stormHint(box, sea, real);
        if (real >= next && real < 6.4) {
          n++;
          // (Uneven: a quick one after every downdraught.)
          next += n % 3 === 0 ? every * 0.75 : every;
          if (n % 3 === 2 && !calm) {
            const w = 24;
            const x = clamp(soul.x - w / 2 + rand(-5, 5), box.x, box.x + box.w - w);
            const draft = new DownDraught({ box, x, w, warn: 0.7, blow: 1.4 });
            draft.nextFoam = 0;
            bullets.push(draft);
            drafts.push(draft);
          } else {
            const h = 24;
            const y = clamp(soul.y - h / 2 + rand(-6, 6), box.y, box.y + box.h - h);
            const band = new GustBand({ box, y, h, dir: Math.random() < 0.5 ? -1 : 1, warn: 0.7, blow: 1.5 });
            band.nextFoam = 0;
            bullets.push(band);
            bands.push(band);
          }
        }
        for (const band of bands) {
          if (!band.blowing) continue;
          if (soul.y >= band.y && soul.y <= band.y + band.h) soul.x += band.dir * band.push * rdt;
          band.nextFoam -= rdt;
          if (band.nextFoam <= 0) {
            band.nextFoam = 0.46;
            const x = band.dir > 0 ? box.x + 3 : box.x + box.w - 3;
            bullets.push(new Shot({ x, y: band.y + rand(3, band.h - 3), vx: band.dir * 66, vy: rand(-4, 4), warn: 0.3, life: 2.1, art: 'corFoam' }));
          }
        }
        for (const draft of drafts) {
          if (!draft.blowing) continue;
          if (soul.x >= draft.x && soul.x <= draft.x + draft.w) soul.y = Math.min(box.y + box.h - 5, soul.y + draft.push * rdt);
          draft.nextFoam -= rdt;
          if (draft.nextFoam <= 0) {
            draft.nextFoam = 0.48;
            bullets.push(new Shot({ x: draft.x + rand(3, draft.w - 3), y: box.y + 3, vy: 62, vx: rand(-3, 3), warn: 0.3, life: 2.1, art: 'corFoam' }));
          }
        }
        tide.wade(soul);
        if (real >= nextDrop && real < 7) {
          nextDrop += 0.7 / density;
          bullets.push(new Shot({ x: rand(box.x + 3, box.x + box.w - 3), y: box.y - 6, vy: 46, life: 2.6, art: 'corDrop' }));
        }
      },
    };
  },

  // --- 3. The whirlpool ---------------------------------------------------
  // Every whirlpool attack has the current in it, and it SURGES: a faint ring
  // closes on the eye, and when it gets there the pull is nearly twice as
  // strong for a moment. Keep moving outward, or you're in the eye.

  // WRECKAGE: the wreck goes down the whirl in RINGS: planks nose to tail,
  // a ring of them closing on the eye from the edge of the box, turning as
  // it comes (faster the nearer the eye), with one stretch missing. Get
  // round to the opening before the ring reaches you; a pale arc shows
  // where the opening will be while the ring's still out past the walls.
  // The rings turn opposite ways, and between them a plank comes back round
  // in the backwash, at your distance and ahead of you: head on.
  whirlWreck(box, density, { rand, sea }) {
    let real = 0;
    const c = middle(box);
    const calm = sea?.soothed;
    const k = tempo(density, 2);
    const pulled = whirl(box, sea, { surges: [2.6, 5.2].map((t) => t / k) });
    const rings = [0.3, 1.8, 3.1, 4.3, 5.4, 6.4].map((t) => t / k);
    const backs = [1.2, 2.6, 3.8, 5.0, 6.0].map((t) => t / k);
    let ring = 0;
    let back = 0;
    const R0 = 62;
    const IN = 18;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        const rdt = dt / density;
        real += rdt;
        pulled(bullets, soul, rdt);
        const yours = Math.atan2(soul.y - c.y, soul.x - c.x);
        const yourR = Math.hypot(soul.x - c.x, soul.y - c.y);
        if (ring < rings.length && real >= rings[ring] && real < 6.9) {
          ring++;
          const dir = ring % 2 ? 1 : -1;
          const plank = (a) => new Orbiter({ cx: c.x, cy: c.y, r: R0, a, speed: dir * 26, dr: -IN, art: 'corPlank', seg: 6, radius: 2.2, spin: 0, warn: 0.5, life: (R0 - 10) / IN, minR: 9 });
          // The opening is a good step round from you (either way) by the
          // time the ring gets to where you are.
          const width = calm ? 2.5 : 1.25;
          const reach = Math.max(0, (R0 - Math.max(12, yourR)) / IN);
          const turned = plank(0).at(reach).a;
          const gapAt = yours + (Math.random() < 0.5 ? -1 : 1) * rand(1.0, 1.7) - turned;
          for (let a = gapAt + width / 2 + 0.2; a < gapAt + TAU - width / 2; a += 0.4) bullets.push(plank(a));
          bullets.push(new GapMark({ box, guide: plank(gapAt), width }));
        }
        if (!calm && back < backs.length && real >= backs[back] && real < 6.6) {
          back++;
          // The backwash: ahead of you round the whirl, coming back at you.
          bullets.push(new Orbiter({ cx: c.x, cy: c.y, r: Math.max(14, Math.min(54, yourR + rand(-4, 4))), a: yours - rand(1.7, 2.3), speed: -58, dr: -1, art: 'corPlank', radius: 3.2, spin: -3, warn: 0.6, life: 3 }));
        }
      },
    };
  },

  // OARS: the whirl makes a wheel of them: three spokes of oars, blade to
  // handle, out from the eye to the corners, going round together. Go round
  // with it, between two spokes, while lost oars tumble past end over end.
  // Halfway through, the whirlpool TURNS BACK: the oars blink, the eye
  // throws up a ring of spray, and the wheel and the current go round the
  // other way.
  whirlOars(box, density, { Shot, rand, sea }) {
    let real = 0;
    const c = middle(box);
    const calm = sea?.soothed;
    const k = tempo(density, 2);
    const flip = calm ? Infinity : 3.7 / k;
    const pulled = whirl(box, sea, { surges: [1.9, 5.6].map((t) => t / k), flipAt: flip });
    let next = 1.3;
    let wheel = false;
    let splashed = false;
    const every = 1.0 / density;
    const WARN = 0.8;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        const rdt = dt / density;
        real += rdt;
        pulled(bullets, soul, rdt);
        if (!wheel && real >= 0.2) {
          wheel = true;
          // (Three spokes; two when he's lighter: an encore, or the bell. You
          // start midway between two of them.)
          const spokes = density >= 1.5 ? 3 : 2;
          const turn = (Math.random() < 0.5 ? -1 : 1) * 1.3;
          const a0 = Math.atan2(soul.y - c.y, soul.x - c.x) + Math.PI / spokes;
          for (let i = 0; i < spokes; i++) {
            for (const r of [22, 45]) {
              bullets.push(new Orbiter({ cx: c.x, cy: c.y, r, a: a0 + (i / spokes) * TAU, speed: turn * r, dr: 0, art: 'corOar', seg: 11, radius: 1.8, radial: true, warn: WARN, life: 6.6, minR: 16, flipAt: flip - real - WARN }));
            }
          }
        }
        // As it turns back, the eye throws up a ring of spray.
        if (!splashed && real >= flip) {
          splashed = true;
          const turn = rand(0, TAU);
          for (let j = 0; j < 12; j++) {
            const t = turn + (j / 12) * TAU;
            bullets.push(new Shot({ x: c.x + Math.cos(t) * 5, y: c.y + Math.sin(t) * 5, vx: Math.cos(t) * 30, vy: Math.sin(t) * 30, life: 2.4, art: 'corDrop' }));
          }
        }
        if (real < next || real > 6.4) return;
        next += every;
        // A lost oar, tumbling round at your distance from the eye, from the
        // far side. (Ones made after the turn are already going the new way.)
        const after = real >= flip;
        const r = Math.max(20, Math.min(54, Math.hypot(soul.x - c.x, soul.y - c.y) + rand(-5, 5)));
        const a = Math.atan2(soul.y - c.y, soul.x - c.x) + Math.PI + rand(-0.8, 0.8);
        bullets.push(new Orbiter({ cx: c.x, cy: c.y, r, a, speed: after ? -54 : 54, dr: -2, art: 'corOar', seg: 11, radius: 1.8, spin: 2.6, warn: 0.6, life: 3.8, minR: 16, flipAt: after ? Infinity : flip - real - 0.6 }));
      },
    };
  },

  // THE FIGUREHEAD: a ship's carved figurehead goes round the whirl, big,
  // coming in closer as it goes; it sheds splinters behind it and turns its
  // face on you to spit a fan of spray straight at you, and slings planks
  // the other way round.
  whirlFigurehead(box, density, { Shot, rand, sea }) {
    let real = 0;
    const c = middle(box);
    const k = tempo(density, 2);
    const pulled = whirl(box, sea, { surges: [3.0, 5.8].map((t) => t / k) });
    let head = null;
    let next = 0.9;
    let n = 0;
    const every = 0.6 / density;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        const rdt = dt / density;
        real += rdt;
        pulled(bullets, soul, rdt);
        if (!head) {
          const a = Math.atan2(soul.y - c.y, soul.x - c.x) + Math.PI;
          head = new Orbiter({ cx: c.x, cy: c.y, r: 36, a, speed: 62, dr: -2.4, art: 'corFigurehead', radius: 6, spin: 0, warn: 0.7, life: 7.2, minR: 20 });
          bullets.push(head);
        }
        if (real < next || real > 6.8 || head.x === undefined) return;
        next += every;
        n++;
        const out = Math.atan2(head.y - c.y, head.x - c.x);
        if (n % 2 === 0 && !sea?.soothed) {
          const at = Math.atan2(soul.y - head.y, soul.x - head.x);
          for (const turn of [-0.52, -0.26, 0, 0.26, 0.52]) bullets.push(new Shot({ x: head.x, y: head.y, vx: Math.cos(at + turn) * 56, vy: Math.sin(at + turn) * 56, warn: 0.25, life: 2, art: 'corDrop' }));
        } else {
          for (const turn of [-0.5, 0.5]) {
            const a = out + turn;
            bullets.push(new Shot({ x: head.x, y: head.y, vx: Math.cos(a) * 46, vy: Math.sin(a) * 46, life: 2, art: 'corDrop' }));
          }
        }
        const r = Math.hypot(soul.x - c.x, soul.y - c.y);
        bullets.push(new Orbiter({ cx: c.x, cy: c.y, r: Math.max(14, Math.min(54, r + rand(-6, 6))), a: out + Math.PI * 0.8, speed: -54, dr: 0, art: 'corPlank', radius: 3.2, spin: -3, warn: 0.45, life: 2.6 }));
      },
    };
  },

  // --- 4. The lamp ----------------------------------------------------------
  // The last phase, and the fight's peak: he's tired, but the lamp isn't.
  // Every lamp attack has the beam in it, and something to dodge while you
  // shelter from it: hiding is never the whole answer.

  // THE BEAM: the Last Light's lamp swings its beam through the box, from
  // one side, then quickly from the other, and last of all across AND BACK
  // (it holds a breath at the far wall first): the shadow you're in swaps to
  // the pillar's other side. Stone pillars rise out of the floor before each
  // pass. The heat cracks the lamp's glass, and shards rain down while it
  // swings (the pillars keep them off you too); tired darts come in between,
  // at you and where you're going.
  lampSweep(box, density, { Shot, rand, sea }) {
    let real = 0;
    const calm = sea?.soothed;
    const track = tracker();
    let pass = 0;
    const times = calm ? [0.2, 3.0, 5.8] : [0.2, 2.75, 5.0];
    let side = Math.random() < 0.5 ? -1 : 1;
    let next = 1.0;
    let darts = 0;
    let nextShard = 1.0;
    let panes = 0;
    const pillars = [];
    const shards = [];
    const me = {};
    return {
      duration: 9.6,
      update: (dt, bullets, soul) => {
        const rdt = dt / density;
        real += rdt;
        const v = track(soul, rdt);
        if (pass < times.length && real >= times[pass] && !beamBusy(bullets, me)) {
          const back = pass === 2 && !calm;
          pillars.push(...lampPass(bullets, box, side, soul, me, back ? { leg: 1.55, hold: 0.4 } : null));
          side = -side;
          pass++;
        }
        if (real >= next && real < 8.4) {
          next += LAMP.dartEvery / density;
          darts++;
          const from = { x: staff(box).x, y: box.y + rand(8, box.h - 8) };
          const a = darts % 2 && !calm ? leadAim(from, soul, v, 50, 0.8, LAMP_FAST) : Math.atan2(soul.y - from.y, soul.x - from.x);
          for (const turn of [-0.22, 0, 0.22]) bullets.push(new Shot({ x: from.x, y: from.y, vx: Math.cos(a + turn) * 50, vy: Math.sin(a + turn) * 50, warn: 0.4, life: 3.5, art: 'corDart' }));
        }
        if (real >= nextShard && real < 8.6) {
          nextShard = real + LAMP.paneEvery / density;
          panes++;
          // (A pane over you, then one anywhere.)
          const x = panes % 2 ? soul.x + rand(-8, 8) : rand(box.x + 8, box.x + box.w - 8);
          shards.push(...glassPane(bullets, box, Shot, rand, x));
        }
        splashOnPillars(shards, pillars);
      },
    };
  },

  // TEARS: he cries, and the tears come down the box in four streams that
  // sway from side to side: stand between two and move with them. Each
  // catches now and then (cross it then), and the pillars cut them off.
  // And he sobs, flinging a fan of tears in from his
  // side, low and level, that a pillar's shadow won't keep off. The beam
  // passes three times, the last across and back.
  lampTears(box, density, { Shot, rand, sea }) {
    let real = 0;
    const calm = sea?.soothed;
    let pass = 0;
    const times = calm ? [0.6, 3.4, 6.2] : [0.5, 3.05, 5.3];
    let side = Math.random() < 0.5 ? -1 : 1;
    let nextTear = 0.2;
    const offset = rand(0, 6);
    let nextSob = 1.4;
    const tears = [];
    const pillars = [];
    const me = {};
    return {
      duration: 9.8,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (pass < times.length && real >= times[pass] && !beamBusy(bullets, me)) {
          const back = pass === 2 && !calm;
          pillars.push(...lampPass(bullets, box, side, soul, me, back ? { leg: 1.55, hold: 0.4 } : null));
          side = -side;
          pass++;
        }
        // The streams: each sways from side to side, and catches (a sob)
        // every second or so: that's when to cross it.
        if (real >= nextTear && real < 8.6) {
          nextTear = real + LAMP.tearEvery / density;
          for (let i = 0; i < LAMP.streams; i++) {
            if ((real + i * 0.5 + offset) % 1.4 > 0.95) continue;
            const x = box.x + (box.w / LAMP.streams) * (i + 0.5) + Math.sin(real * 1.5 + i * 1.9 + offset) * 9;
            const tear = new Shot({ x, y: box.y - 6, vy: 30, gravity: 20, life: 4, art: 'corTear' });
            bullets.push(tear);
            tears.push(tear);
          }
        }
        if (!calm && real >= nextSob && real < 8.2) {
          // (Uneven, like sobbing: a long one, then two close.)
          nextSob += [1.9, 0.8, 0.9][Math.floor(real) % 3];
          const from = { x: staff(box).x - 6, y: box.y + rand(10, box.h - 10) };
          const a = Math.atan2(soul.y - from.y, soul.x - from.x);
          for (let j = -2; j <= 2; j++) bullets.push(new Shot({ x: from.x, y: from.y, vx: Math.cos(a + j * 0.2) * 40, vy: Math.sin(a + j * 0.2) * 40, warn: 0.4, life: 3.2, art: 'corTear' }));
        }
        splashOnPillars(tears, pillars);
      },
    };
  },

  // THE LULLABY, AGAIN: tired, the notes drifting in from his side, four
  // phrases of it now, overlapping like a round, and sung in full chords (a
  // note over and under each; only a second note, after the bell);
  // the hum catches its breath at the end of each phrase (the notes stop,
  // then come on faster, the tune's own notes turned on you, and in the
  // last phrase every note of every chord), and
  // the beam goes through three times, the last across and back.
  lampLullaby(box, density, { Shot, clamp, sea }) {
    let real = 0;
    const calm = sea?.soothed;
    const EIGHTH = 0.22;
    // (Four phrases; three after the bell.)
    const PHRASES = calm ? 3 : 4;
    const PHRASE = 24 * EIGHTH;
    const LAST = LULLABY[LULLABY.length - 1];
    const queue = [];
    let laid = 0;
    let passed = 0;
    let side = Math.random() < 0.5 ? -1 : 1;
    const passTimes = [1.0, 3.8, 6.6];
    const me = {};
    return {
      duration: 9.2,
      update: (dt, bullets, soul) => {
        real += dt / density;
        while (laid < PHRASES && real >= 0.3 + laid * PHRASE * LAMP.phraseGap) {
          const start = 0.3 + laid * PHRASE * LAMP.phraseGap;
          const centre = clamp(soul.y + (laid % 2 ? 10 : -10), box.y + 14, box.y + box.h - 14);
          const harmony = laid === PHRASES - 1 || !calm ? [-LAMP.harmony, LAMP.harmony] : [(laid % 2 ? 1 : -1) * LAMP.harmony];
          const breath = start + LAST.at * EIGHTH;
          for (const note of LULLABY) queue.push({ at: start + note.at * EIGHTH, note, centre, harmony, breath, last: laid === PHRASES - 1 });
          laid++;
        }
        for (let i = queue.length - 1; i >= 0; i--) {
          const q = queue[i];
          if (real < q.at) continue;
          queue.splice(i, 1);
          const y = q.centre - (q.note.pitch - LULLABY_MID) * 5.2;
          // (Held, the notes turn on you when they go: only the melody's in
          // the first two phrases, every note of the last.)
          const hold = calm ? {} : { holdFrom: q.breath - q.at, holdFor: 0.5, after: 1.7, target: q.last ? soul : null };
          const melody = calm ? hold : { ...hold, target: soul, aimDelay: LULLABY.indexOf(q.note) * 0.07 };
          if (hold.target) hold.aimDelay = melody.aimDelay + 0.03;
          for (const at of [y, ...q.harmony.map((h) => y + h)]) {
            bullets.push(new HeldNote({ x: box.x + box.w + 8, y: at, vx: -LAMP.noteSpeed, vy: 3, warn: 0.25, life: 4.2, art: q.note.long ? 'corNoteLong' : 'corNote', wobble: { frequency: 2.2, amplitude: 1.5 }, ...(at === y ? melody : hold) }));
          }
        }
        if (passed < passTimes.length && real >= passTimes[passed] && !beamBusy(bullets, me)) {
          side = passed ? -side : side;
          passed++;
          lampPass(bullets, box, side, soul, me, passed === 3 && !calm ? { leg: 1.5, hold: 0.4 } : null);
        }
      },
    };
  },

  // THE LENS: the lamp's great lens turns right over the box, and its light
  // breaks into three rays that swing through together, one way and back
  // and back again: the middle swing is a sudden lurch. No pillars here:
  // stay in the dark between two rays and move with them. (The lens starts
  // turning with you in the dark, never in a ray's path.) Splinters of the
  // lens's glass fall as it grinds round, and every second it spits three
  // of them at where you're going.
  lampLens(box, density, { Shot, rand, sea }) {
    let real = 0;
    const calm = sea?.soothed;
    const track = tracker();
    let lit = false;
    const ox = box.x + box.w / 2;
    const oy = box.y - 58;
    const down = Math.PI / 2;
    const me = {};
    let nextShard = 1.2;
    let panes = 0;
    let nextSpit = 2.0;
    return {
      duration: 9.2,
      update: (dt, bullets, soul) => {
        const rdt = dt / density;
        real += rdt;
        const v = track(soul, rdt);
        if (!lit && real >= 0.3 && !beamBusy(bullets, me)) {
          lit = true;
          const at = Math.atan2(soul.y - oy, soul.x - ox);
          const way = at > down ? -1 : 1;
          const mid = at + way * LAMP.lensSpread / 2;
          const legs = calm ? [2.4, 2.4, 2.4] : LAMP.lensLegs;
          for (const off of [-LAMP.lensSpread, 0, LAMP.lensSpread]) {
            const ray = new LurchRay({ ox, oy, from: mid + off, reach: way * LAMP.lensReach, legs, half: 0.05, warn: 0.9 });
            ray.owner = me;
            bullets.push(ray);
          }
        }
        if (real >= nextShard && real < 8.4) {
          nextShard = real + LAMP.lensPaneEvery / density;
          panes++;
          // (Narrow ones, anywhere: you've only the dark between two rays to stand in.)
          glassPane(bullets, box, Shot, rand, rand(box.x + 8, box.x + box.w - 8), 1);
        }
        if (!calm && real >= nextSpit && real < 8) {
          nextSpit += 1.0;
          const from = { x: rand(box.x + 10, box.x + box.w - 10), y: box.y - 4 };
          const a = leadAim(from, soul, v, 50, 0.8, LAMP_FAST);
          for (const turn of [-0.16, 0, 0.16]) bullets.push(new Shot({ x: from.x, y: from.y, vx: Math.cos(a + turn) * 50, vy: Math.sin(a + turn) * 50, warn: 0.4, life: 2.6, art: 'corGlass' }));
        }
      },
    };
  },
};

// The lamp phase's knobs, in one place for tuning.
const LAMP = {
  pillarWidth: 7, // the pillars you hide behind (11, then 8, before 15 November 2026)
  passSweep: 1.75, // seconds the beam takes to cross the box (2.4, then 2.0)
  passHalf: 0.17, // half the beam's width, in radians (0.12, then 0.15)
  dartEvery: 0.5, // lampSweep: a fan of three darts this often (0.7 before)
  paneEvery: 0.55, // lampSweep: a pane of the lamp's glass cracks and falls this often
  tearEvery: 0.17, // lampTears: a tear down each stream this often
  streams: 4, // lampTears: streams of tears across the box
  phraseGap: 0.26, // lampLullaby: each phrase starts this share of a phrase after the last (0.33 before)
  noteSpeed: 80, // (56 before 15 November 2026)
  harmony: 22, // px between a note and its harmony
  lensSpread: 0.38, // between the rays (radians)
  lensReach: 0.32, // how far the rays swing each time (radians)
  lensPaneEvery: 0.65, // lampLens: a pane of the lens this often
  lensLegs: [2.2, 1.3, 2.4], // the lens's three swings: it grinds, then lurches
};

// A pane of the lamp's glass cracks and falls: five shards side by side
// (`half` either side of the middle one),
// flickering a moment at the top of the box (that's the warning: the glass
// comes down THERE), then falling together, spreading a little. Returns them.
function glassPane(bullets, box, Shot, rand, x, half = 2) {
  const shards = [];
  x = Math.min(Math.max(x, box.x + 12), box.x + box.w - 12);
  for (let j = -half; j <= half; j++) {
    const shard = new Shot({ x: x + j * 4.5 + rand(-1, 1), y: box.y + 3 + Math.abs(j), vx: j * 2.5, vy: 26 + rand(-3, 5), gravity: 46, warn: 0.5, life: 3.4, art: 'corGlass' });
    bullets.push(shard);
    shards.push(shard);
  }
  return shards;
}

// Whether another attack's beam is still in the box (or about to be): with
// two attacks in a turn, one waits for the other's beam to finish, so two
// beams never cross the box at once with nowhere dark to stand.
function beamBusy(bullets, me) {
  return bullets.some((b) => b instanceof Beam && b.owner !== me && b.age < b.warn + b.sweep);
}

// Anything falling or drifting that runs into a standing pillar breaks on it.
function splashOnPillars(list, pillars) {
  for (let i = list.length - 1; i >= 0; i--) {
    const b = list[i];
    if (b.spent || b.age > b.warn + b.life) {
      list.splice(i, 1);
      continue;
    }
    if (pillars.some((p) => p.standing && b.x >= p.x - 1 && b.x <= p.x + p.w + 1 && b.y >= p.y - 1 && b.y <= p.y + p.h)) b.spent = true;
  }
}

// A bolt of lightning down to `x`, warned first; where the tide's under it
// when it lands, the whole of the tide lights up.
function lightning(box, tide, bullets, x, fork = 0) {
  const WARN = 0.75;
  x = Math.min(Math.max(x, box.x + 4), box.x + box.w - 4);
  const when = tide.age + WARN;
  const wet = tide.depth(when) > 3;
  const y = wet ? tide.surface(when) : box.y + box.h;
  bullets.push(new Bolt({ x: x + (Math.random() - 0.5) * 12, to: { x, y }, box, warn: WARN, fork }));
  if (wet) tide.charges.push([when, when + 0.5]);
}

// The middle of the box: the eye of the whirlpool.
function middle(box) {
  return { x: box.x + box.w / 2, y: box.y + box.h / 2 };
}

// The whirlpool's pull, and its eye: call each frame with real time. After
// the bell (`sea.pull`), it's weaker and doesn't surge. `surges`: the times
// (real) it pulls nearly twice as hard for a moment, each warned by a ring
// closing on the eye; `flipAt`: when it turns back and goes round the other
// way. Two attacks in one turn share the one eye (and the one pull).
function whirl(box, sea, { surges = [], flipAt = Infinity } = {}) {
  const c = middle(box);
  let eye = null;
  return (bullets, soul, rdt) => {
    if (!eye) {
      eye = sea?.eye ?? new Eye({ cx: c.x, cy: c.y, strength: sea?.pull ?? 1, calm: sea?.soothed });
      if (sea) sea.eye = eye;
      if (!bullets.includes(eye)) bullets.push(eye);
      for (const t of surges) eye.surges.push(eye.age + t);
      eye.flipAt = Math.min(eye.flipAt, eye.age + flipAt);
    }
    eye.tug(bullets, soul, rdt);
  };
}

const TIDE_EXTRA = 4;
const TIDE_TOP = 36;

// The tide for one of the storm's attacks: from the stage's level (see
// corrieStage.js), climbing a little through the turn; after the bell, it
// drains away instead.
function makeTide(box, sea) {
  // (Two attacks in one turn share the one tide: one water, one slowing.)
  if (sea?.tide) return sea.tide;
  const tide = newTide(box, sea);
  if (sea) sea.tide = tide;
  return tide;
}

function newTide(box, sea) {
  const level = sea?.level ?? 14;
  if (sea?.soothed) return new Tide({ box, from: level, to: 0, rise: 1.6 });
  // (It comes in a little deeper and faster than the stage's own level, so
  // there's always water to keep out of; never past TIDE_TOP.)
  const from = Math.min(TIDE_TOP - 8, level + TIDE_EXTRA);
  return new Tide({ box, from, to: Math.min(TIDE_TOP, from + (sea?.rise ?? 9) * 1.4), rise: 5 });
}

// The first time the tide is in the box, the panel says what it does.
function stormHint(box, sea, real) {
  if (!sea?.first) return;
  if (real < 3.4) box.hint = 'The tide is coming in! The water slows your SHADOW, and lightning lights it up. Stay above it.';
  else delete box.hint;
}

// One pass of the lamp's beam from the top corner on `side` (-1 left, 1
// right), with two pillars risen first to hide behind. Returns the pillars.
// (`back`: { leg, hold }, it swings across and back again: SwingBeam.)
function lampPass(bullets, box, side, soul = null, owner = null, back = null) {
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
    pillars = halves.map(([a, b]) => new LampPillar({ x: a + Math.random() * (b - a), y: box.y + 14 + Math.random() * 22, w: LAMP.pillarWidth, h: 16, warn: 0.6, life: back ? 0.4 + back.leg * 2 + back.hold + 0.4 : 3.4 }));
    if (!soul) break;
    pillars.forEach((p) => { p.age = p.warn; });
    const hidden = pillars.some((p) => p.blocks(ox, oy, soul.x, soul.y) || p.blocks(ox, oy, soul.x + 6, soul.y) || p.blocks(ox, oy, soul.x - 6, soul.y));
    pillars.forEach((p) => { p.age = 0; });
    if (!hidden) break;
  }
  // (The beam first, so the pillars are drawn over its light.)
  const beam = back
    ? new SwingBeam({ ox, oy, from, to, leg: back.leg, hold: back.hold, half: LAMP.passHalf, warn: 0.9, pillars })
    : new Beam({ ox, oy, from, to, sweep: LAMP.passSweep, half: LAMP.passHalf, warn: 0.9, pillars });
  beam.owner = owner;
  bullets.push(beam);
  bullets.push(...pillars);
  return pillars;
}
