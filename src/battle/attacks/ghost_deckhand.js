import { defineBulletArt, Line } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { Ring } from './underShapes.js';
import { withSnipes } from './snipes.js';

// The Deckhand's attacks. A young sailor of the Fair Return, still on watch,
// still doing his round of the ship's chores a hundred years after there was
// anyone to do them for: he swabs, he empties the bilge bucket, he strikes the
// ship's bell for the watch, and, last, he holds out the letter he meant to
// post. Every one of these is a chore, done a little too hard. He stands to the
// right of the box, so most things come from that side (the swab from the top
// and bottom).
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The attack's own clock (`t`) runs `density`
// times faster than the seconds on the wall, hence the `T` below.

const P = {
  k: '#14212a', w: '#f0f6f2', W: '#a4c4c4', r: '#d8d0b4', R: '#8c8468', m: '#b04a3a', M: '#6a2a26',
  b: '#7aa8b4', B: '#456e7e', y: '#b49c68', Y: '#74603a', e: '#e8f4ff', i: '#7a8a90', I: '#454e54', n: '#c8a040', N: '#80601c',
  c: '#bfeaf0', C: '#7cc4d4',
};

// A sealed letter: cream paper, a fold, a red wax seal. It drifts and turns.
const letter = (tilt) => art(11, 9, (p) => {
  p.rect(1, 1, 9, 7, 'r');
  p.rect(1, 1, 9, 1, 'w');
  p.line(1, 2, 5, 5, 'R');
  p.line(9, 2, 5, 5, 'R');
  p.rect(4, 4, 3, 3, 'm');
  p.set(5, 5, 'M');
  p.set(tilt ? 9 : 1, 7, 'R');
});
defineBulletArt('deckLetter', { frames: [letter(0), letter(1)], palette: P, radius: 4, frameSeconds: 0.35, spin: 0.9 });

// A wax seal that has come off its letter and drops like a stone.
defineBulletArt('deckSeal', {
  frames: [art(8, 8, (p) => { p.ellipse(3.5, 3.5, 3.2, 3.2, 'm'); p.ellipse(3.5, 3.5, 1.8, 1.8, 'M'); p.set(2, 2, 'w'); })],
  palette: P,
  radius: 3,
  spin: 3,
});

// The bilge bucket: a tin pail on a rope handle, slopping.
defineBulletArt('deckBucket', {
  frames: [art(11, 11, (p) => {
    p.poly([[1, 3], [9, 3], [8, 9], [2, 9]], 'i');
    p.rect(1, 3, 9, 1, 'w');
    p.rect(2, 4, 2, 5, 'e');
    p.rect(2, 8, 7, 1, 'I');
    p.line(1, 3, 5, 0, 'y');
    p.line(9, 3, 5, 0, 'y');
    p.set(4, 2, 'c');
    p.set(6, 2, 'C');
  })],
  palette: P,
  radius: 4.6,
  spin: 4,
});

// A drop of slopped bilge water.
defineBulletArt('deckDrop', {
  frames: [
    art(5, 7, (p) => { p.set(2, 0, 'C'); p.rect(1, 1, 3, 4, 'c'); p.set(2, 2, 'w'); p.set(2, 5, 'B'); }),
    art(5, 6, (p) => { p.rect(1, 1, 3, 4, 'C'); p.set(2, 2, 'c'); p.set(2, 0, 'B'); }),
  ],
  palette: P,
  radius: 2.2,
  frameSeconds: 0.2,
});

// The ship's bell, a pip showing where a toll starts (harmless).
defineBulletArt('deckBell', {
  frames: [
    art(13, 12, (p) => { p.poly([[2, 9], [3, 3], [6, 1], [9, 3], [10, 9]], 'n'); p.rect(1, 9, 11, 2, 'N'); p.line(4, 3, 4, 8, 'w'); p.set(6, 11, 'i'); }),
    art(13, 12, (p) => { p.poly([[2, 8], [3, 2], [6, 0], [9, 2], [10, 8]], 'n'); p.rect(1, 8, 11, 2, 'N'); p.line(5, 2, 5, 7, 'w'); p.set(7, 10, 'i'); }),
  ],
  palette: P,
  radius: 1,
  frameSeconds: 0.14,
});

// A scrap of rag torn off the mop (the swab's spatter).
defineBulletArt('deckRag', {
  frames: [
    art(7, 4, (p) => { p.rect(0, 1, 6, 2, 'r'); p.set(5, 0, 'R'); p.set(1, 3, 'R'); }),
    art(7, 4, (p) => { p.rect(1, 1, 6, 2, 'R'); p.set(0, 0, 'r'); }),
  ],
  palette: P,
  radius: 2.6,
  frameSeconds: 0.2,
  rotate: true,
});

// The wet stripe a swab leaves (harmless).
const drawWet = (ctx, x, y, w) => {
  ctx.fillStyle = 'rgba(124, 196, 212, 0.28)';
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), 2);
};

// One pass of the swab: a ragged band of wet rag, a stripe across the whole
// box but for a gap (a ripple of clean deck). It sweeps down (or up) the box.
// While it warns the band's outline blinks at the edge it comes from.
class Swab {
  constructor({ box, y, vy, gapX, gapW = 25, warn = 0.8, h = 9 }) {
    Object.assign(this, { box, y, vy, gapX, gapW, warn, h });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    // Where it comes from, so the warning shows in the box.
    this.startY = y;
    this.trail = [];
  }

  get active() {
    return this.age >= this.warn;
  }

  update(dt) {
    this.age += dt;
    if (this.age >= this.warn) this.y += this.vy * dt;
  }

  isGone() {
    return this.age >= this.warn && (this.vy > 0 ? this.y > this.box.y + this.box.h + 14 : this.y < this.box.y - 14);
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const b = this.box;
    const dy = Math.max(this.y - this.h / 2 - py, 0, py - (this.y + this.h / 2));
    // In the gap's column the deck is clean.
    if (px > this.gapX - this.gapW / 2 && px < this.gapX + this.gapW / 2) return Infinity;
    const dx = Math.max(b.x - px, 0, px - (b.x + b.w));
    return Math.hypot(dx, dy);
  }

  draw(ctx) {
    const b = this.box;
    ctx.save();
    const edgeY = this.vy > 0 ? b.y + 4 : b.y + b.h - 4;
    if (this.age < this.warn) {
      // The gap shown on the edge it comes from, the band's line blinking.
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.25 : 0.6;
      ctx.fillStyle = '#d8d0b4';
      for (let x = b.x; x < b.x + b.w; x += 4) {
        if (x > this.gapX - this.gapW / 2 && x < this.gapX + this.gapW / 2) continue;
        ctx.fillRect(x, Math.round(edgeY), 2, 1);
      }
      ctx.strokeStyle = '#bfeaf0';
      ctx.strokeRect(Math.round(this.gapX - this.gapW / 2) + 0.5, Math.round(edgeY - 3) + 0.5, this.gapW, 6);
      ctx.restore();
      return;
    }
    const y = Math.round(this.y - this.h / 2);
    // Wet trail behind it.
    const behind = this.vy > 0 ? b.y : y + this.h;
    const behindH = this.vy > 0 ? y - b.y : b.y + b.h - (y + this.h);
    if (behindH > 0) {
      ctx.fillStyle = 'rgba(124, 196, 212, 0.14)';
      for (let x = b.x; x < b.x + b.w; x += 1) {
        if (x > this.gapX - this.gapW / 2 && x < this.gapX + this.gapW / 2) continue;
        if ((x * 7) % 3 === 0) ctx.fillRect(x, behind, 1, Math.max(0, behindH));
      }
    }
    for (let x = b.x - 2; x < b.x + b.w + 2; x++) {
      if (x > this.gapX - this.gapW / 2 && x < this.gapX + this.gapW / 2) continue;
      // Strands of rag: pale cords with darker tips, ragged by column.
      const ragged = ((x * 13) % 4) - 1;
      ctx.fillStyle = '#14212a';
      ctx.fillRect(x, y - 1 - (ragged > 1 ? 1 : 0), 1, this.h + 2 + ragged);
      ctx.fillStyle = x % 3 ? '#d8d0b4' : '#8c8468';
      ctx.fillRect(x, y, 1, this.h + ragged);
      if (x % 5 === 0) { ctx.fillStyle = '#e4f2ee'; ctx.fillRect(x, y, 1, 2); }
    }
    // The mop handle's end at the gap: a clean lip of deck on either side.
    ctx.fillStyle = '#7cc4d4';
    for (const gx of [this.gapX - this.gapW / 2 - 1, this.gapX + this.gapW / 2]) ctx.fillRect(Math.round(gx), y, 1, this.h);
    ctx.restore();
  }
}

export const GHOST_DECKHAND_ATTACKS = {
  // Swab: the mop comes down (and back up) the deck, three passes, each with
  // a clean gap that is never where you're standing; every other pass is the
  // return stroke with its gap a step across. Rags fly off the end of it.
  deckSwab(box, density, { rand, clamp, Shot }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.2);
    let passes = 0;
    let lastGap = null;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && passes < 3 && t < T(5.0)) {
          passes++;
          next = t + T(2.0);
          const lo = box.x + 14;
          const hi = box.x + box.w - 14;
          let gap = clamp(soul.x + (Math.random() < 0.5 ? -1 : 1) * rand(26, 36), lo, hi);
          if (Math.abs(gap - soul.x) < 18) gap = soul.x < (lo + hi) / 2 ? hi : lo;
          if (lastGap !== null && Math.abs(gap - lastGap) < 12) gap = clamp(gap + (gap < (lo + hi) / 2 ? 1 : -1) * 20, lo, hi);
          lastGap = gap;
          const down = passes % 2 === 1;
          bullets.push(new Swab({ box, y: down ? box.y - 6 : box.y + box.h + 6, vy: down ? 36 : -36, gapX: gap, warn: 0.85 }));
          // Rags thrown off the wet end.
          for (let i = 0; i < 3; i++) {
            bullets.push(new Shot({ x: box.x + rand(6, box.w - 6), y: down ? box.y - 4 : box.y + box.h + 4, vx: rand(-14, 14), vy: down ? 24 : -24, warn: 1.0 + i * 0.35, life: 3.2, art: 'deckRag' }));
          }
        }
      },
    };
  },

  // Bilge bucket: he swings the pail and lets go; each lands in a heap of
  // slopped water that bursts into drops all round. A shadow blinks where it
  // will land.
  deckBucket(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.3);
    let thrown = 0;
    const flying = [];
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && thrown < 5 && t < T(5.2)) {
          thrown++;
          next = t + T(1.05);
          // Land somewhere near you but not on you.
          // (at least 26 px off you, in a random direction, then kept inside the box)
          const away = rand(0, Math.PI * 2);
          const gap = rand(26, 40);
          const lx = clamp(soul.x + Math.cos(away) * gap, box.x + 8, box.x + box.w - 8);
          const ly = clamp(soul.y + Math.sin(away) * gap, box.y + 8, box.y + box.h - 8);
          const fromX = box.x + box.w + 6;
          const fromY = box.y + rand(8, box.h - 8);
          const flight = 1.0;
          // The marker blinks where it will land (and is harmless); the bucket itself is carried
          // by hand along an arc, so its speed isn't scaled by the enemy's `speed`.
          for (const dx of [0, -5, 5]) bullets.push(new Shot({ x: lx + dx, y: ly, harmless: true, warn: flight, life: 0, art: 'deckDrop' }));
          const b = new Shot({ x: fromX, y: fromY, harmless: true, life: 99, art: 'deckBucket' });
          flying.push({ t0: t, at: t + T(flight), x: lx, y: ly, fromX, fromY, b });
          bullets.push(b);
        }
        for (const f of flying) {
          if (f.done) continue;
          if (t < f.at) {
            // (t runs `density` times faster than the wall clock, so one flight is T(flight) long.)
            const k = (t - f.t0) / (f.at - f.t0);
            f.b.x = f.fromX + (f.x - f.fromX) * k;
            f.b.y = f.fromY + (f.y - f.fromY) * k - Math.sin(k * Math.PI) * 18;
            continue;
          }
          f.done = true;
          f.b.life = 0;
          f.b.age = 99;
          // The splash: seven drops all round.
          const n = 7;
          const spin = Math.random() * Math.PI;
          for (let i = 0; i < n; i++) {
            const a = spin + (i / n) * Math.PI * 2;
            bullets.push(new Shot({ x: f.x, y: f.y, vx: Math.cos(a) * 36, vy: Math.sin(a) * 36, life: 1.5, art: 'deckDrop' }));
          }
        }
      },
    };
  },

  // Eight bells: he strikes the ship's bell on the right of the box, and
  // rings of sound go out across it, each with a gap in it that is never
  // quite where you are. The bell is struck in pairs, the way a watch is.
  deckBell(box, density, { rand }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.35);
    let tolls = 0;
    const cx = box.x + box.w + 6;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && tolls < 6 && t < T(5.4)) {
          tolls++;
          // Pairs: two close, then a pause.
          next = t + T(tolls % 2 ? 0.55 : 1.25);
          const cy = box.y + box.h / 2 + rand(-18, 18);
          const toSoul = Math.atan2(soul.y - cy, soul.x - cx);
          const off = (Math.random() < 0.5 ? -1 : 1) * rand(0.55, 0.85);
          bullets.push(new Ring({ x: cx, y: cy, r: 2, grow: 52, thick: 3, life: 3.4, warn: 0.5, gap: { angle: toSoul + off, width: 0.85 }, color: '#f2d88a', glow: '#c8a040' }));
          bullets.push({
            // A harmless pip of the bell, there and gone.
            x: cx - 4, y: cy, dmg: null, grazed: false, age: 0,
            update(d) { this.age += d; },
            isGone() { return this.age > 0.9; },
            edgeDistance() { return Infinity; },
            draw(ctx) {
              ctx.save();
              ctx.globalAlpha = Math.max(0, 1 - this.age / 0.9);
              ctx.fillStyle = '#c8a040';
              ctx.fillRect(Math.round(this.x - 2), Math.round(this.y - 3), 5, 5);
              ctx.fillStyle = '#80601c';
              ctx.fillRect(Math.round(this.x - 3), Math.round(this.y + 2), 7, 1);
              ctx.restore();
            },
          });
        }
      },
    };
  },

  // The letter: he holds it out and letters come off the top of the box,
  // drifting and turning in a slow curtain, and the wax seals on them come
  // off and drop straight down. There's a lane through where the curtain is
  // thin, and he never fills it. Nothing is meant unkindly.
  deckLetters(box, density, { Shot, rand, clamp, every }) {
    const T = (s) => s * density;
    let t = 0;
    let next = T(0.3);
    let waves = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && waves < 6 && t < T(5.6)) {
          waves++;
          next = t + T(0.9);
          const gapX = clamp(soul.x + (Math.random() < 0.5 ? -1 : 1) * rand(18, 30), box.x + 10, box.x + box.w - 10);
          for (let x = box.x + 6; x <= box.x + box.w - 6; x += 15) {
            if (Math.abs(x - gapX) < 12) continue;
            bullets.push(new Shot({ x: x + rand(-3, 3), y: box.y - 6, vy: 36, wobble: { amplitude: 4, frequency: 3.5 }, warn: 0.4, life: 4, art: 'deckLetter' }));
          }
          // The seal off one of them, dropping hard.
          bullets.push(new Shot({ x: clamp(soul.x + rand(-8, 8), box.x + 6, box.x + box.w - 6), y: box.y - 6, vy: 70, warn: 0.7, life: 2.4, art: 'deckSeal' }));
        }
      },
    };
  },
};

GHOST_DECKHAND_ATTACKS.deckSwab = withSnipes(GHOST_DECKHAND_ATTACKS.deckSwab, { art: 'deckRag', count: 3, first: 1.0, every: 1.4, lead: [0.9, 'mean', 0.5] });
GHOST_DECKHAND_ATTACKS.deckBucket = withSnipes(GHOST_DECKHAND_ATTACKS.deckBucket, { art: 'deckDrop', count: 3, first: 1.2, every: 1.5, lead: [0.9, 'mean', 0.5] });
GHOST_DECKHAND_ATTACKS.deckBell = withSnipes(GHOST_DECKHAND_ATTACKS.deckBell, { art: 'deckSeal', count: 3, first: 1.2, every: 1.5, lead: [0.9, 'mean', 0.5] });
GHOST_DECKHAND_ATTACKS.deckLetters = withSnipes(GHOST_DECKHAND_ATTACKS.deckLetters, { art: 'deckSeal', count: 3, first: 1.2, every: 1.5, lead: [0.9, 'mean', 0.5] });
// (Line is kept for a rope the captain's file borrows; nothing here needs it.)
void Line;
