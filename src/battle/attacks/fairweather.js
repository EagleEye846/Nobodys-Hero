import { defineBulletArt, Line, Shot } from '../projectiles.js';
import { defineGuardianStar } from './guardianStar.js';
import { art } from '../../data/art/ch5Kit.js';
import { BEAT } from '../fairweatherDeck.js';

// Madam Fairweather's attacks: the carved figurehead of the brig Fair Return, woken by the piece
// of the Fallen Star that lodged in her breast. She laughs, she spins, she throws what she is made
// of (carved wood, sea foam, star-glass, gilt ribbon, painted carousel horses) and every one of
// her attacks is a game she thinks you are playing with her. They are chaotic to look at and
// fair to dodge: everything is warned (it blinks where it will start), nothing is faster than you
// can read, and no corner or middle is safe for a whole turn.
//
// THE LAUGH (phase 1): sea foam rolling in as waves, carved splinters snapped off her hand, and
//   her laughter as a rhythm: "ha ha ha ... HA", each laugh a ring going out, solid in one arc.
// STAR SHOWER (phase 2): stars fall out of the sky in columns that flash where they'll land and
//   break into glass; slow star-comets that follow you and shatter; the box rocks.
// THE CAROUSEL (phase 3): gilded horses ride round the box on rising and falling poles, and
//   turn about (with a stall, so you can see it coming); ribbons turn like spokes from a
//   maypole; the box turns with them.
// CHAOS (phase 4): masks that bounce, and a mixture: two of the others at once, one after the
//   other by a beat.
//
// HER RULES (14 November 2026, src/battle/fairweatherDeck.js): the box lists (you slide downhill)
// and/or she waltzes with you (you step only on the beats of her song). Every attack here fires on
// the song's beats (beatsOf), lasts her whole turn, and has a waltz version: fewer, slower, warned
// longer, timed so a step on the beat is the dodge. The carousel's horses and the maypole's
// ribbons turn a notch a beat along a known path (stepTurn), so they can be counted.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`; see dummy.js for
// the shape. The attack's own clock (`t`) runs `density` times faster than the seconds on the
// wall, hence the `T` below. Anything that moves itself by hand uses `real` (wall seconds).

const P = {
  k: '#140c10', d: '#2c1a14', h: '#8a5a34', H: '#5a3624', l: '#c8905a', L: '#ecc690',
  g: '#e8c060', G: '#9a7220', s: '#bff4ff', S: '#4ab8e0', w: '#ffffff', m: '#ff9ae0', M: '#b04a98',
  f: '#e8f6f4', F: '#9ccac8', b: '#3a7a98', B: '#1e4a66', r: '#c03a48', R: '#7a1c28', y: '#fff0a8',
  c: '#f2ead8', C: '#c8b890', p: '#4a8a6a',
};

// Sea foam: a cluster of bubbles with a glint.
const foam = (flip) => art(15, 13, (p) => {
  p.ellipse(6, 7, 5, 4.6, 'F');
  p.ellipse(11, 8, 3, 2.8, 'f');
  p.ellipse(7, 3, 2.8, 2.4, 'f');
  p.ellipse(5, 6, 2, 1.6, 'w');
  p.ring(6, 7, 5, 4.6, 'b', 1);
  if (flip) p.set(12, 7, 'w'); else p.set(8, 2, 'w');
});
defineBulletArt('fwFoam', { frames: [foam(0), foam(1)], palette: P, radius: 5.2, frameSeconds: 0.3 });
// A single rising bubble.
defineBulletArt('fwBubble', {
  frames: [art(7, 7, (p) => { p.ring(3, 3, 2.6, 2.6, 'f', 1); p.set(2, 2, 'w'); p.set(4, 4, 'F'); })],
  palette: P,
  radius: 2.6,
});

// A carved splinter, snapped off her hand: pale where it broke, a rind of paint on the back.
defineBulletArt('fwSplinter', {
  frames: [
    art(15, 7, (p) => {
      p.poly([[0, 3], [10, 0], [14, 3], [9, 6]], 'l');
      p.poly([[3, 3], [10, 1], [13, 3], [9, 5]], 'L');
      p.line(1, 3, 12, 3, 'h');
      p.set(11, 2, 'w'); p.set(5, 5, 'H'); p.set(3, 1, 'g');
    }),
    art(15, 7, (p) => {
      p.poly([[0, 3], [10, 1], [14, 3], [9, 5]], 'l');
      p.poly([[3, 3], [10, 2], [13, 3], [9, 4]], 'L');
      p.line(1, 3, 12, 3, 'h');
      p.set(11, 3, 'w'); p.set(6, 5, 'H');
    }),
  ],
  palette: P,
  radius: 3.4,
  rotate: true,
  frameSeconds: 0.14,
});

// A falling star: the guardians' shared four-pointed star (guardianStar.js).
defineGuardianStar('fwStar', { radius: 5 });
// A splinter of star-glass (what a star breaks into).
defineBulletArt('fwShard', {
  frames: [
    art(9, 9, (p) => { p.poly([[4, 0], [8, 5], [4, 8], [1, 4]], 's'); p.line(4, 1, 4, 6, 'w'); }),
    art(9, 9, (p) => { p.poly([[2, 0], [8, 3], [5, 8], [0, 5]], 'S'); p.line(3, 2, 5, 6, 's'); }),
  ],
  palette: P,
  radius: 3,
  frameSeconds: 0.13,
  spin: 5,
});
// A comet: a bigger crystal with a pink-white tail.
const comet = (k) => art(19, 15, (p) => {
  p.poly([[9, 1], [13, 7], [9, 13], [5, 7]], 's');
  p.poly([[7, 5], [10, 7], [7, 10], [6, 7]], 'w');
  p.line(14, 7, 18, 7 + k, 'm');
  p.line(13, 5, 17, 3 + k, 'M');
  p.line(13, 9, 17, 11 - k, 'M');
  p.set(18, 7 + k, 'w');
});
defineBulletArt('fwComet', { frames: [comet(0), comet(1), comet(-1)], palette: P, radius: 5.6, frameSeconds: 0.1, rotate: true });

// A carousel horse on its gilded pole, the paint a hundred years old and still bright.
const horse = (k) => art(17, 17, (p) => {
  p.line(8, 0, 8, 16, 'G');
  p.line(9, 0, 9, 16, 'g');
  p.poly([[3, 5], [10, 4], [14, 8], [12, 11], [9, 10], [6, 12], [3, 10]], 'c');
  p.poly([[3, 5], [7, 4], [6, 8], [3, 8]], 'C');
  p.poly([[10, 4], [13, 2], [15, 5], [14, 8]], 'c');
  p.set(13, 4, 'k');
  p.line(8, 3 + k, 5, 5, 'r');
  p.line(8, 4, 6, 7, 'R');
  p.rect(3, 10, 2, 5, 'C');
  p.rect(10, 10, 2, 5 - k, 'C');
  p.rect(7, 8, 3, 1, 'g');
  p.set(11, 6, 'm');
});
defineBulletArt('fwHorse', { frames: [horse(0), horse(1)], palette: P, radius: 5.4, frameSeconds: 0.22 });

// A bow of ribbon, a decoration that stings (a thrown tip).
defineBulletArt('fwBow', {
  frames: [art(13, 9, (p) => { p.poly([[6, 4], [0, 0], [0, 8]], 'r'); p.poly([[6, 4], [12, 0], [12, 8]], 'r'); p.rect(5, 3, 3, 3, 'g'); p.line(1, 3, 3, 4, 'R'); p.line(11, 3, 9, 4, 'R'); })],
  palette: P,
  radius: 3.4,
  spin: 4,
});

// A laughing mask on a stick: gilt, a wide painted grin, empty eyes.
const mask = (k) => art(15, 15, (p) => {
  p.ellipse(7, 7, 6, 6.6, 'g');
  p.ellipse(7, 7, 4.8, 5.4, 'L');
  p.rect(3, 4, 3, 2 + k, 'd'); p.rect(9, 4, 3, 2 + k, 'd');
  p.set(4, 4, 's'); p.set(10, 4, 's');
  p.poly([[3, 9], [11, 9], [9, 12], [5, 12]], 'd');
  p.line(4, 9, 10, 9, 'w');
  p.set(2, 8, 'r'); p.set(12, 8, 'r');
  p.line(1, 2, 3, 4, 'G'); p.line(13, 2, 11, 4, 'G');
});
defineBulletArt('fwMask', { frames: [mask(0), mask(1)], palette: P, radius: 5.6, frameSeconds: 0.25 });

// Confetti of star-dust: harmless, gold and pink, to make the room look glad.
defineBulletArt('fwDust', {
  frames: [art(5, 5, (p) => { p.set(2, 2, 'y'); p.set(1, 2, 'g'); p.set(3, 2, 'g'); p.set(2, 1, 'm'); p.set(2, 3, 'm'); }, false), art(5, 5, (p) => { p.set(2, 2, 'w'); p.set(1, 1, 'g'); p.set(3, 3, 'm'); }, false)],
  palette: P,
  radius: 1,
  frameSeconds: 0.2,
  rim: false,
});
// Her laugh, written in the air: HA (harmless).
defineBulletArt('fwHa', {
  frames: [art(15, 7, (p) => {
    p.line(0, 0, 0, 6, 'y'); p.line(4, 0, 4, 6, 'y'); p.line(0, 3, 4, 3, 'y');
    p.line(8, 6, 10, 0, 'y'); p.line(10, 0, 12, 6, 'y'); p.line(9, 4, 11, 4, 'y');
  }, false)],
  palette: P,
  radius: 1,
  rim: false,
});

const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------
// A harmless dotted line showing where something will fall.
class Guide {
  constructor({ x1, y1, x2, y2, warn = 0.8, color = '#bff4ff' }) {
    Object.assign(this, { x1, y1, x2, y2, warn, color });
    this.age = 0;
    this.dmg = null;
    this.grazed = true;
    this.active = false;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.warn + 0.1;
  }

  edgeDistance() {
    return Infinity;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.floor(this.age * 12) % 2 ? 0.2 : 0.55;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
    ctx.restore();
  }
}

// A laugh: a ring going out from her, solid only in an arc (`half` either side of `centre`). The
// arc is drawn as a dotted preview while it warns, so you can see where it will come.
class Laugh {
  constructor({ x, y, centre, half = 0.5, grow = 62, thick = 3.4, life = 2.2, warn = 0.6, color = '#fff0a8', glow = '#ff9ae0' }) {
    Object.assign(this, { x, y, centre, half, grow, thick, life, warn, color, glow });
    this.r = 2;
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

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const a = Math.atan2(py - this.y, px - this.x);
    const off = Math.abs(((a - this.centre + Math.PI * 3) % TAU) - Math.PI);
    if (off > this.half) return Infinity;
    return Math.abs(Math.hypot(px - this.x, py - this.y) - this.r) - this.thick / 2;
  }

  draw(ctx) {
    ctx.save();
    const a0 = this.centre - this.half;
    const a1 = this.centre + this.half;
    if (this.age < this.warn) {
      // The arc it will be, far out, blinking: and a rim of dots where it will start.
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.25 : 0.65;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      for (const rr of [26, 62, 98]) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, rr, a0, a1);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }
    const over = this.age - (this.warn + this.life);
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.thick;
    ctx.shadowColor = this.glow;
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0.1, this.r), a0, a1);
    ctx.stroke();
    ctx.restore();
  }
}

// Her song's beats, for an attack: called each frame, it says which beat just came ({ n, the
// count from the attack's start; one, whether it's a ONE; dance, whether the waltz rule is on})
// or null between beats. The beat is the deck's (fairweatherDeck.js: the song's own clock);
// with no deck, a clock of the same speed.
function beatsOf(box, density) {
  let own = 0;
  let n = -1;
  return (dt) => {
    const deck = box.deck;
    if (deck) {
      if (!deck.beatTick) return null;
      n++;
      return { n, one: deck.one, dance: deck.rule.dance };
    }
    own += dt / density;
    if (own < BEAT) return null;
    own -= BEAT;
    n++;
    return { n, one: n % 3 === 0, dance: false };
  };
}
const dancing = (box) => Boolean(box.deck?.rule.dance);

// A turn in steps, on the beat: how far round something has gone `c` seconds after it started,
// turning `notch` on each beat from beat `from` (a quick glide, then still till the next),
// standing `stall` beats at beat `turnAt` (or each of a list of them), then going back. It is a sum over the song's own
// beat grid (`c0`, the deck's clock when it started), so it's a function of time alone: the
// dodging bot's copies, run on ahead, know where it will be, as a player counting does.
function stepTurn({ c0, notch, from = 0, turnAt, stall = 2, glide = 0.09 }) {
  const b0 = Math.floor(c0 / BEAT + 1e-6);
  const turns = [turnAt].flat();
  const after = [0];
  for (let i = 1; i < 64; i++) {
    const passed = turns.filter((t) => i >= t).length;
    const standing = turns.some((t) => i >= t && i < t + stall);
    after.push(after[i - 1] + (i < from || standing ? 0 : passed % 2 ? -notch : notch));
  }
  const at = (k) => after[Math.min(Math.max(k, 0), after.length - 1)];
  return (c) => {
    const b = (c0 + c) / BEAT;
    const whole = Math.floor(b + 1e-6);
    const k = whole - b0;
    const into = (b - whole) * BEAT;
    return at(k - 1) + (at(k) - at(k - 1)) * Math.min(1, into / glide);
  };
}

// A horse on the carousel and a ribbon on the maypole: they move themselves along `path(c, i)`
// (c: seconds since they came), rather than being moved by the attack.
class Rider extends Shot {
  constructor(opts, path, i) {
    super(opts);
    Object.assign(this, { path, i, c: 0, drives: true });
    Object.assign(this, path(0, i));
  }

  update(dt, box) {
    super.update(dt, box);
    this.c += dt;
    const p = this.path(this.c, this.i);
    this.x = p.x;
    this.y = p.y;
  }
}
class Spoke extends Line {
  constructor(opts, path, i) {
    super(opts);
    Object.assign(this, { path, i, c: 0, drives: true });
    Object.assign(this, path(0, i));
  }

  update(dt, box) {
    super.update(dt, box);
    this.c += dt;
    Object.assign(this, this.path(this.c, this.i));
  }
}

// Every attack runs the length of her turn (about eleven and a half seconds, a bar a
// second), so each has time to show off the list or the dance it's played under.
const LONG = 11.5;
const LAST_BEAT = 31;

export const FAIRWEATHER_ATTACKS = {
  // "Sea foam": waves of foam come over the high rail and roll downhill, bobbing (when the deck
  // rolls over, they come from the other side; on a level deck, from her side). Every wave has
  // a two-slot gap that is never where you are, and the next wave's gap is a step or two from
  // the last. A wave every other beat; spray rises off the floor on every beat, most of it
  // where the water has run, at the low side.
  fwFoam(box, density, { Shot, rand, clamp }) {
    const beat = beatsOf(box, density);
    let waves = 0;
    const slots = 7;
    return {
      duration: LONG,
      update: (dt, bullets, soul) => {
        const b = beat(dt);
        if (!b || b.n > LAST_BEAT) return;
        if (b.n % 2 === 0 && b.n <= 28) {
          waves++;
          const step = (box.h - 12) / (slots - 1);
          const mine = clamp(Math.round((soul.y - box.y - 6) / step), 0, slots - 1);
          let g = clamp(mine + (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(rand(0, 2))), 0, slots - 2);
          if (g === mine || g + 1 === mine) g = mine > 2 ? mine - 2 : mine + 1;
          const slope = box.deck ? box.deck.slopeAt(box.deck.tt + 0.8) : 0;
          const dir = slope > 0.1 ? 1 : -1;
          const from = dir > 0 ? box.x - 9 : box.x + box.w + 9;
          for (let i = 0; i < slots; i++) {
            if (i === g || i === g + 1) continue;
            const y = box.y + 6 + i * step;
            bullets.push(new Shot({ x: from, y, vx: 56 * dir, warn: 0.8, life: 5, art: 'fwFoam', wobble: { amplitude: 5, frequency: 3 + (waves % 7) * 0.6 } }));
            bullets.push(new Shot({ x: from + 16 * dir, y, harmless: true, warn: 0.85, life: 0, art: 'fwFoam' }));
          }
        }
        // Spray off the water at the low side: most bubbles come up there, so the low wall is
        // no place to lean.
        if (b.n <= 29) {
          const slope = box.deck ? box.deck.slopeAt(box.deck.tt) : 0;
          for (let i = 0; i < 2; i++) {
            const lowSide = Math.abs(slope) > 0.2 && Math.random() < 0.7;
            const x = lowSide ? (slope > 0 ? rand(box.x + box.w * 0.6, box.x + box.w - 4) : rand(box.x + 4, box.x + box.w * 0.4)) : rand(box.x + 6, box.x + box.w - 6);
            bullets.push(new Shot({ x, y: box.y + box.h + 4, vy: -rand(40, 52), warn: 0.5, life: 5, art: 'fwBubble' }));
          }
        }
      },
    };
  },

  // "Whittling": she snaps splinters off her own hand and flicks them at you in fans that leave
  // the line to you empty, with a few dropping out of the dark above each time. Every other beat
  // on the deck; in the waltz, on each ONE, every fan open where you stand, so you hold your
  // ground on ONE and step out from under the drops after.
  fwSplinters(box, density, { Shot, rand, clamp }) {
    const beat = beatsOf(box, density);
    let n = 0;
    return {
      duration: LONG,
      update: (dt, bullets, soul) => {
        const b = beat(dt);
        if (!b || b.n < 1 || b.n > 30) return;
        if (b.dance ? !b.one : b.n % 2 === 1) return;
        const ox = box.x + box.w - 3;
        const oy = clamp(soul.y + rand(-22, 22), box.y + 8, box.y + box.h - 8);
        const aim = Math.atan2(soul.y - oy, soul.x - ox);
        const offs = n % 2 || b.dance ? [-0.66, -0.44, -0.22, 0.22, 0.44, 0.66] : [-0.5, -0.25, 0, 0.25, 0.5];
        for (const o of offs) {
          bullets.push(new Shot({ x: ox, y: oy, vx: Math.cos(aim + o) * 100, vy: Math.sin(aim + o) * 100, warn: 0.55, life: 3, art: 'fwSplinter', angle: aim + o }));
        }
        // A pair out of the dark overhead, off to the side of you.
        for (const side of [-1, 1]) {
          const x = clamp(soul.x + side * rand(8, 26), box.x + 5, box.x + box.w - 5);
          bullets.push(new Shot({ x, y: box.y - 2, vx: 0, vy: 64, warn: 0.8, life: 3, art: 'fwSplinter', angle: Math.PI / 2 }));
        }
        if (b.dance) {
          // In the waltz, one straight down on you, late: the step after ONE. And one up off
          // the floor beside you.
          bullets.push(new Shot({ x: clamp(soul.x, box.x + 5, box.x + box.w - 5), y: box.y - 2, vx: 0, vy: 70, warn: 1.0, life: 3, art: 'fwSplinter', angle: Math.PI / 2 }));
          const ux = clamp(soul.x + (Math.random() < 0.5 ? -1 : 1) * rand(10, 18), box.x + 5, box.x + box.w - 5);
          bullets.push(new Shot({ x: ux, y: box.y + box.h + 2, vx: 0, vy: -70, warn: 0.9, life: 3, art: 'fwSplinter', angle: -Math.PI / 2 }));
        } else {
          // And a trio from the top or bottom edge, aimed where you are heading.
          const fromTop = n % 2 === 0;
          const ex = clamp(soul.x + rand(-30, 30), box.x + 8, box.x + box.w - 8);
          const ey = fromTop ? box.y + 3 : box.y + box.h - 3;
          const ea = Math.atan2(soul.y - ey, soul.x - ex);
          for (const o of [-0.3, 0, 0.3]) {
            bullets.push(new Shot({ x: ex, y: ey, vx: Math.cos(ea + o) * 92, vy: Math.sin(ea + o) * 92, warn: 0.6, life: 3, art: 'fwSplinter', angle: ea + o }));
          }
        }
        n++;
      },
    };
  },

  // "Laughter": ha, ha, ha ... HA. Each laugh is a ring going out from her, solid in one arc: the
  // first where you are, the next a step ahead of where you are going, the third behind. Then a
  // rest, long enough to think it is over, and the last one comes late and big. Twelve beats
  // round: ha ha ha, rest, ha ha, rest, HA. In the waltz she laughs on fewer beats, the
  // arcs narrower and warned longer, so a step or two takes you out of them.
  fwLaugh(box, density, { Shot, rand, clamp }) {
    const beat = beatsOf(box, density);
    let done = 0;
    const tx = box.x + box.w + 8;
    const heading = { x: 0, y: 0 };
    const seen = { x: null, y: null };
    const ON = [0, 1, 2, 6, 7, 10];
    const ON_DANCE = [0, 2, 4, 6, 8, 10];
    return {
      duration: LONG,
      update: (dt, bullets, soul) => {
        const real = dt / density;
        if (seen.x !== null && real > 0) {
          heading.x = heading.x * 0.85 + ((soul.x - seen.x) / real) * 0.15;
          heading.y = heading.y * 0.85 + ((soul.y - seen.y) / real) * 0.15;
        }
        seen.x = soul.x;
        seen.y = soul.y;
        const b = beat(dt);
        if (!b || b.n < 1 || b.n > 30) return;
        const k = (b.n - 1) % 12;
        if (!(b.dance ? ON_DANCE : ON).includes(k)) return;
        const late = k === 10;
        const lead = b.dance ? 0 : done % 3 === 0 ? 0 : done % 3 === 1 ? 0.8 : -0.6;
        const aimY = clamp(soul.y + heading.y * lead, box.y + 4, box.y + box.h - 4);
        const aimX = clamp(soul.x + heading.x * lead, box.x + 4, box.x + box.w - 4);
        const ty = box.y + (done % 2 ? 14 : box.h - 14) + rand(-6, 6);
        const a = Math.atan2(aimY - ty, aimX - tx);
        const half = b.dance ? (late ? 0.52 : 0.44) : late ? 0.7 : 0.48;
        const warn = b.dance ? 0.68 : late ? 0.8 : 0.55;
        bullets.push(new Laugh({ x: tx, y: ty, centre: a, half, grow: late ? 78 : 70, warn, thick: late ? 4.4 : 3.4 }));
        bullets.push(new Shot({ x: tx - 14, y: ty - 8, vx: -4, vy: -14, harmless: true, warn: 0, life: 0.7, art: 'fwHa' }));
        done++;
      },
    };
  },

  // "Falling stars": stars fall out of the dark in columns, each flashing where it will land
  // (with a dotted line down to the floor), and break into glass. On the deck, a volley every
  // other beat; in the waltz one a bar, on ONE, so the long step takes you out from under it.
  fwStars(box, density, { Shot, rand, clamp }) {
    const beat = beatsOf(box, density);
    let n = 0;
    const falling = [];
    return {
      duration: LONG,
      update: (dt, bullets, soul) => {
        const b = beat(dt);
        // (In the waltz, two more on three, either side of you: the step on ONE has to choose.)
        if (b && b.dance && b.n % 3 === 2 && b.n <= 28) {
          for (const side of [-1, 1]) {
            const x = clamp(soul.x + side * rand(12, 22), box.x + 6, box.x + box.w - 6);
            const s = new Shot({ x, y: box.y + 2, vx: 0, vy: 30, gravity: 170, warn: 0.75, life: 6, art: 'fwStar' });
            s.waltz = true;
            bullets.push(s);
            bullets.push(new Guide({ x1: x, y1: box.y, x2: x, y2: box.y + box.h, warn: 0.75 }));
            falling.push(s);
          }
        }
        if (b && b.n >= 1 && b.n <= 29 && (b.dance ? b.one : b.n % 2 === 1)) {
          const xs = [clamp(soul.x + rand(-5, 5), box.x + 6, box.x + box.w - 6)];
          for (let tries = 0; xs.length < 3 && tries < 40; tries++) {
            const x = rand(box.x + 6, box.x + box.w - 6);
            if (Math.abs(x - soul.x) > 12 && xs.every((o) => Math.abs(o - x) > 11)) xs.push(x);
          }
          for (const x of xs) {
            const s = new Shot({ x, y: box.y + 2, vx: 0, vy: 30, gravity: 170, warn: 0.75, life: 6, art: 'fwStar' });
            s.waltz = b.dance;
            bullets.push(s);
            bullets.push(new Guide({ x1: x, y1: box.y, x2: x, y2: box.y + box.h, warn: 0.75 }));
            falling.push(s);
          }
          n++;
        }
        for (const s of falling) {
          if (s.done || s.age < s.warn || s.y < box.y + box.h - 5) continue;
          s.done = true;
          s.life = 0;
          s.age = 99;
          // (In the waltz it only chips: two low splinters of glass, slow enough to step over.)
          for (const k of s.waltz ? [-1, 1] : [-1.3, 0, 1.3]) {
            bullets.push(new Shot({ x: s.x, y: box.y + box.h - 5, vx: k * (s.waltz ? 16 : 30), vy: s.waltz ? -26 : -50, gravity: 96, warn: 0.12, life: s.waltz ? 0.8 : 1.1, art: 'fwShard' }));
          }
        }
      },
    };
  },

  // "Comets": slow crystal comets come after you from her side, a tail of pink behind each, and
  // at the end of their run they burst into a ring of glass (it blinks first). Every other beat
  // on the deck; in the waltz, on ONE and three, turning after you more lazily, so the
  // step that dodges it is the one you take as it comes.
  fwComet(box, density, { Shot, rand, clamp }) {
    const beat = beatsOf(box, density);
    const comets = [];
    return {
      duration: LONG,
      update: (dt, bullets, soul) => {
        const b = beat(dt);
        if (b && b.n >= 1 && b.n <= 27 && (b.dance ? b.n % 3 !== 1 : b.n % 2 === 1)) {
          const c = new Shot({ x: box.x + box.w + 6, y: clamp(soul.y + rand(-26, 26), box.y + 8, box.y + box.h - 8), vx: b.dance ? -62 : -60, vy: 0, warn: 0.5, life: 3.2, art: 'fwComet', homing: { target: soul, turn: b.dance ? 1.3 : 1.8 } });
          c.ring = b.dance ? 9 : 11;
          bullets.push(c);
          comets.push(c);
        }
        for (const c of comets) {
          if (c.done || c.age < c.warn + 2.0) continue;
          c.done = true;
          c.life = 0;
          c.age = 99;
          const spin = Math.random() * Math.PI;
          for (let i = 0; i < c.ring; i++) {
            const a = spin + (i / c.ring) * TAU;
            bullets.push(new Shot({ x: c.x, y: c.y, vx: Math.cos(a) * 46, vy: Math.sin(a) * 46, warn: 0.25, life: 1.6, art: 'fwShard' }));
          }
        }
      },
    };
  },

  // "Round and round": painted horses ride round the box on gilded poles that rise and fall, so
  // the ring breathes in and out. The carousel turns a notch on every beat of her waltz (you can
  // count it), and halfway it stands for a bar and goes the other way. On each ONE a horse breaks
  // off the ring and gallops at where you are (it blinks first); in the waltz, one every beat,
  // slower, so each step is a step out of a horse's way.
  fwCarousel(box, density, { Shot }) {
    const beat = beatsOf(box, density);
    const N = 13;
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    let breaks = 0;
    const horses = [];
    return {
      duration: LONG,
      update: (dt, bullets, soul) => {
        if (!horses.length) {
          const start = Math.random() * TAU;
          const turn = stepTurn({ c0: box.deck?.clock ?? 0, notch: 0.26, from: 1, turnAt: 15 });
          const path = (c, i) => {
            const r = 25 + 18 * Math.sin(2.1 * c + i * 0.9);
            const a = start + turn(c) + (i / N) * TAU;
            return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.92 };
          };
          for (let i = 0; i < N; i++) {
            const s = new Rider({ warn: 0.9, life: LONG - 0.8, art: 'fwHorse' }, path, i);
            horses.push(s);
            bullets.push(s);
          }
        }
        const b = beat(dt);
        // (On ONE; in the waltz, on every beat, more slowly.)
        if (b && (b.one || b.dance) && b.n >= 3 && b.n <= 30) {
          const h = horses[(breaks++ * 5) % N];
          const aim = Math.atan2(soul.y - h.y, soul.x - h.x);
          const v = b.dance ? 72 : 88;
          bullets.push(new Shot({ x: h.x, y: h.y, vx: Math.cos(aim) * v, vy: Math.sin(aim) * v, warn: b.dance ? 0.66 : 0.45, life: 2.4, art: 'fwHorse' }));
        }
      },
    };
  },

  // "The maypole": gilded ribbons turn from a hub that wanders about the box, like spokes, a
  // notch on every beat (they stand still between), flinging a bow off the hub each beat. Twice
  // they stand a bar, and turn back. In the waltz they turn a smaller notch, so you can step round
  // after them.
  fwRibbons(box, density, { Shot, rand }) {
    const beat = beatsOf(box, density);
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    const spokes = [];
    let hub = null;
    return {
      duration: LONG,
      update: (dt, bullets) => {
        if (!spokes.length) {
          const waltz = dancing(box);
          const count = 4;
          const start = Math.random() * TAU;
          const turn = stepTurn({ c0: box.deck?.clock ?? 0, notch: waltz ? 0.48 : 0.56, from: 3, turnAt: [13, 23], stall: 3 });
          hub = (c) => ({ x: cx + 15 * Math.sin(c * 1.2), y: cy + 14 * Math.cos(c * 0.95) });
          const path = (c, i) => ({ ...hub(c), angle: start + turn(c) + (i / count) * TAU });
          for (let i = 0; i < count; i++) {
            const l = new Spoke({ x: cx, y: cy, angle: 0, length: 62, thickness: 4, warn: 1.0, life: LONG - 1.3, color: '#e8c060', glow: '#c03a48' }, path, i);
            spokes.push(l);
            bullets.push(l);
          }
        }
        const b = beat(dt);
        if (b && b.n >= 4 && b.n <= 30) {
          const at = hub(spokes[0].c);
          const a = rand(0, TAU);
          bullets.push(new Shot({ x: at.x, y: at.y, vx: Math.cos(a) * 48, vy: Math.sin(a) * 48, warn: 0.4, life: 2.2, art: 'fwBow' }));
        }
      },
    };
  },

  // "Masks": gilt laughing masks on sticks come bouncing into the box from her side, wall to wall,
  // with star-dust spilling off them (harmless, only to look glad). On every ONE one of them
  // turns its grin on you and comes. In the waltz they slow to a walk, so your steps can keep
  // out of their way.
  fwMasks(box, density, { Shot, rand, second = false }) {
    const beat = beatsOf(box, density);
    let t = 0;
    const masks = [];
    const T = (s) => s * density;
    let nextDust = 0;
    return {
      duration: LONG - 0.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!masks.length) {
          const count = second ? 5 : 10;
          for (let i = 0; i < count; i++) {
            const a = Math.PI + rand(-1.0, 1.0);
            const sp = rand(58, 72);
            const m = new Shot({ x: box.x + box.w - 9, y: box.y + 8 + i * ((box.h - 16) / (count - 1)), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, warn: 0.9, life: LONG - 1.2, art: 'fwMask', bounce: true });
            masks.push(m);
            bullets.push(m);
          }
        }
        // Their speed as the rules stand (read once they're flying: the fight's `speed` is in it).
        for (const m of masks) {
          const v = Math.hypot(m.vx, m.vy);
          if (!v) continue;
          m.top ??= v;
          const want = m.top * (dancing(box) ? 0.6 : 1);
          const k = v + (want - v) * Math.min(1, (dt / density) * 3);
          m.vx *= k / v;
          m.vy *= k / v;
        }
        // On each ONE one of them turns to look at you, and comes (it flashes as it turns).
        const b = beat(dt);
        if (b && b.one && b.n >= 3 && !second) {
          const live = masks.filter((m) => m.age > m.warn && m.age < m.warn + m.life - 1);
          const m = live[(b.n * 7) % Math.max(1, live.length)];
          if (m) {
            const v = Math.hypot(m.vx, m.vy);
            const a = Math.atan2(soul.y - m.y, soul.x - m.x);
            m.vx = Math.cos(a) * v;
            m.vy = Math.sin(a) * v;
            bullets.push(new Shot({ x: m.x, y: m.y - 8, vx: 0, vy: -16, harmless: true, life: 0.6, art: 'fwHa' }));
          }
        }
        if (t >= nextDust && t < T(LONG - 1.2)) {
          nextDust = t + T(0.2);
          bullets.push(new Shot({ x: rand(box.x + 4, box.x + box.w - 4), y: box.y + box.h + 2, vy: -rand(14, 24), vx: rand(-6, 6), harmless: true, life: 4, art: 'fwDust' }));
        }
      },
    };
  },
};

// CHAOS: two of the others at once, the second two seconds late and lighter (fewer masks;
// otherwise every other volley of it left out). The deck's rules swap on her laugh on top.
const MIXES = [
  ['fwMasks', 'fwFoam'],
  ['fwLaugh', 'fwMasks'],
  ['fwRibbons', 'fwMasks'],
  ['fwCarousel', 'fwFoam'],
  ['fwComet', 'fwMasks'],
  ['fwSplinters', 'fwMasks'],
];
FAIRWEATHER_ATTACKS.fwChaos = (box, density, tools) => {
  const [a, b] = MIXES[Math.floor(Math.random() * MIXES.length)];
  const first = FAIRWEATHER_ATTACKS[a](box, density, tools);
  const second = FAIRWEATHER_ATTACKS[b](box, density, { ...tools, second: true });
  let t = 0;
  let volleys = 0;
  const delay = 2 * density;
  return {
    duration: Math.min(12.5, Math.max(first.duration, second.duration + 0.9)),
    update: (dt, bullets, soul) => {
      t += dt;
      first.update(dt, bullets, soul);
      if (t < delay) return;
      const before = bullets.length;
      second.update(dt, bullets, soul);
      // (Its masks, all at once, are its first volley: always kept.)
      if (bullets.length > before && volleys++ % 2 === 1 && b !== 'fwMasks') bullets.length = before;
    },
  };
};
