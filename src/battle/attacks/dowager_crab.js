import { defineBulletArt } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { Ring } from './underShapes.js';
import { PathShot, Deco, Zone, Tether } from './coastKit.js';

// The Dowager Crab's attacks. A very old, very polite hermit crab who lives in
// a bathtub with a ship's bell on it, and who has been trespassed upon. Every
// attack is her manners, turned on you:
//   - Wipe your feet: be on the doormat when she inspects your feet.
//   - Her pearls: the string snaps, the pearls scatter and stop, and then
//     come back exactly the way they rolled when she pulls the string.
//   - The minuet: four of her claws dance round you in three time, stepping
//     on the ONE, curtseying into the middle every fourth bar.
//   - The monocle: the lens drifts after you and burns where it settles.
//   - How very forward: her claws snip shut across the way you are going.
//   - The bath water (riled): it slops over the half of the box you're in.
// She stands to the right of the box.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`.
// `update` is given dt times `density`; a bullet's own clock is real time.
// Anything that flies by a set rule (arcs, stopping barnacles) has its speed
// set when it is let go, because the difficulty's speed scales a bullet on
// the frame it is made. Hazards that move themselves (Snip, Tide) have their
// own update so a bot or a player can read them.

const P = {
  k: '#1b1a22', w: '#ffffff', c: '#d4f2fa', C: '#74c0de', p: '#f2b4e0', y: '#ffd84a', Y: '#fff0a0',
  o: '#e8742e', O: '#a8431f', q: '#f6a868', s: '#d8c070', S: '#8a7a38', g: '#e0b84a', G: '#8a6a22',
  W: '#f4f6f4', b: '#9ab0c8', B: '#5a7090', e: '#2a2230',
};


// A soap bubble: a thin ring with a pink and blue sheen and a bright dot.
const bubble = (shift) => art(15, 15, (p) => {
  p.ellipse(7, 7, 6.2, 6.2, 'C');
  p.ellipse(7, 7, 5, 5, 'c');
  p.ellipse(7, 7, 3.6, 3.6, shift ? 'p' : 'w', ['c']);
  p.ellipse(7, 7, 2.4, 2.4, 'c');
  p.rect(3, 3, 2, 2, 'w');
  p.set(shift ? 10 : 9, shift ? 10 : 11, 'p');
});
defineBulletArt('crabBubble', { frames: [bubble(0), bubble(1)], palette: P, radius: 5.8, frameSeconds: 0.35 });

// A droplet from a popped bubble.
defineBulletArt('crabDrop', {
  frames: [art(5, 6, (p) => { p.set(2, 0, 'C'); p.rect(1, 1, 3, 4, 'C'); p.set(0, 3, 'C'); p.set(4, 3, 'C'); p.set(2, 2, 'w'); p.set(2, 4, 'c'); })],
  palette: P,
  radius: 1.9,
});

// The bell's mark: where a toll starts (harmless).
defineBulletArt('crabBell', {
  frames: [
    art(11, 12, (p) => { p.poly([[5, 1], [1, 9], [9, 9]], 'g'); p.ellipse(5, 3, 3, 3, 'g'); p.rect(1, 8, 9, 2, 'G'); p.rect(3, 2, 1, 6, 'Y'); p.set(5, 11, 'G'); p.set(5, 0, 'G'); }),
    art(11, 12, (p) => { p.poly([[6, 1], [2, 9], [10, 9]], 'g'); p.ellipse(6, 3, 3, 3, 'g'); p.rect(2, 8, 9, 2, 'G'); p.rect(4, 2, 1, 6, 'Y'); p.set(6, 11, 'G'); p.set(6, 0, 'G'); }),
  ],
  palette: P,
  radius: 1,
  frameSeconds: 0.15,
});

// A rubber duck, beak to the left (it is lobbed in from the right).
defineBulletArt('crabDuck', {
  frames: [art(13, 11, (p) => {
    p.ellipse(7, 7, 5, 3.4, 'y');
    p.poly([[10, 6], [12, 3], [12, 8]], 'y');
    p.ellipse(4, 3.6, 2.6, 2.6, 'y');
    p.rect(0, 4, 2, 1, 'o');
    p.set(4, 3, 'e');
    p.ellipse(7, 8, 3, 1.4, 'Y');
    p.line(6, 5, 9, 6, 'q');
    p.set(2, 2, 'Y');
  })],
  palette: P,
  radius: 4.6,
});

// A bath sponge: yellow, full of holes.
defineBulletArt('crabSponge', {
  frames: [art(11, 9, (p) => {
    p.rect(1, 1, 9, 7, 's');
    p.rect(1, 1, 9, 1, 'Y');
    for (const [x, y] of [[3, 3], [6, 3], [8, 5], [4, 6], [2, 5]]) p.set(x, y, 'S');
    p.rect(1, 7, 9, 1, 'S');
  })],
  palette: P,
  radius: 4.2,
  spin: 3,
});

// A barnacle: a pale little volcano, a dark mouth, a few more behind.
defineBulletArt('crabBarnacle', {
  frames: [
    art(11, 10, (p) => { p.poly([[1, 8], [3, 3], [6, 3], [8, 8]], 'W'); p.poly([[6, 8], [7, 5], [9, 5], [10, 8]], 'b'); p.rect(3, 3, 3, 1, 'B'); p.line(2, 7, 3, 4, 'w'); p.rect(1, 8, 9, 1, 'b'); }),
    art(11, 10, (p) => { p.poly([[1, 8], [3, 3], [6, 3], [8, 8]], 'W'); p.poly([[6, 8], [7, 5], [9, 5], [10, 8]], 'b'); p.rect(3, 3, 3, 2, 'B'); p.line(2, 7, 3, 4, 'w'); p.rect(1, 8, 9, 1, 'b'); }),
  ],
  palette: P,
  radius: 3.8,
  frameSeconds: 0.4,
});

// A pincer, for the telegraphs of the snips (harmless markers).
defineBulletArt('crabSnapMark', {
  frames: [art(7, 7, (p) => { p.set(3, 3, 'O'); p.set(1, 1, 'o'); p.set(5, 1, 'o'); p.set(1, 5, 'o'); p.set(5, 5, 'o'); })],
  palette: P,
  radius: 1,
});

const EDGE = 5;

// A pair of claws that close on a column (from the top and bottom) or a row
// (from the left and right). It follows you while it flickers, then locks a
// third of a second before it shuts, shuts in 0.22 s, holds and opens.
class Snip {
  constructor({ box, vertical, at, warn = 1, follow = null, width = 14 }) {
    Object.assign(this, { box, vertical, at, warn, follow, width });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.close = 0.22;
    this.hold = 0.38;
    this.open = 0.3;
  }

  get end() {
    return this.warn + this.close + this.hold + this.open;
  }

  // How far in from each side the claws are (0 to the half-length).
  reach() {
    const half = (this.vertical ? this.box.h : this.box.w) / 2 + 2;
    const t = this.age - this.warn;
    if (t < 0) return 0;
    if (t < this.close) return half * (t / this.close);
    if (t < this.close + this.hold) return half;
    const o = (t - this.close - this.hold) / this.open;
    return half * Math.max(0, 1 - o);
  }

  update(dt) {
    this.age += dt;
    // (Stops following 0.4 s before it shuts, was 0.33: in her riled phase
    // three or four are out at once. 2026-11-10.)
    if (this.follow && this.age < this.warn - 0.4) {
      const target = this.vertical ? this.follow.x : this.follow.y;
      const lo = this.vertical ? this.box.x + 5 : this.box.y + 5;
      const hi = this.vertical ? this.box.x + this.box.w - 5 : this.box.y + this.box.h - 5;
      const goal = Math.min(hi, Math.max(lo, target + (this.offset ?? 0)));
      const step = 70 * dt;
      this.at += Math.max(-step, Math.min(step, goal - this.at));
    }
  }

  isGone() {
    return this.age >= this.end + 0.05;
  }

  get active() {
    return this.age >= this.warn && this.reach() > 1;
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const r = this.reach();
    const b = this.box;
    const hw = this.width / 2;
    const rects = this.vertical
      ? [{ x: this.at - hw, y: b.y - 4, w: this.width, h: r + 4 }, { x: this.at - hw, y: b.y + b.h - r, w: this.width, h: r + 4 }]
      : [{ x: b.x - 4, y: this.at - hw, w: r + 4, h: this.width }, { x: b.x + b.w - r, y: this.at - hw, w: r + 4, h: this.width }];
    let best = Infinity;
    for (const q of rects) {
      const dx = Math.max(q.x - px, 0, px - (q.x + q.w));
      const dy = Math.max(q.y - py, 0, py - (q.y + q.h));
      best = Math.min(best, Math.hypot(dx, dy));
    }
    return best;
  }

  draw(ctx) {
    const b = this.box;
    const hw = this.width / 2;
    ctx.save();
    if (this.age < this.warn) {
      // Two claws held open at the edges, and a flickering guide between.
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.25 : 0.65;
      ctx.strokeStyle = '#f6a868';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      if (this.vertical) {
        ctx.strokeRect(Math.round(this.at - hw) + 0.5, b.y + 0.5, this.width, b.h);
      } else {
        ctx.strokeRect(b.x + 0.5, Math.round(this.at - hw) + 0.5, b.w, this.width);
      }
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.9;
      this.drawClaw(ctx, 0, 6);
      this.drawClaw(ctx, 1, 6);
      ctx.restore();
      return;
    }
    const over = this.age - this.end;
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.05);
    const r = this.reach();
    this.drawClaw(ctx, 0, r);
    this.drawClaw(ctx, 1, r);
    ctx.restore();
  }

  // One claw, `r` pixels in from its side: a shaft with a notched, pale tip.
  drawClaw(ctx, side, r) {
    const b = this.box;
    const hw = this.width / 2;
    ctx.save();
    if (this.vertical) {
      ctx.translate(Math.round(this.at), side ? b.y + b.h + 4 : b.y - 4);
      ctx.rotate(side ? -Math.PI / 2 : Math.PI / 2);
    } else {
      ctx.translate(side ? b.x + b.w + 4 : b.x - 4, Math.round(this.at));
      ctx.rotate(side ? Math.PI : 0);
    }
    // Drawn pointing right along +x, length r + 4, width this.width.
    const len = r + 4;
    ctx.fillStyle = '#1b1a22';
    ctx.fillRect(-1, -hw - 1, len + 2, this.width + 2);
    ctx.fillStyle = '#a8431f';
    ctx.fillRect(0, -hw, len, this.width);
    ctx.fillStyle = '#e8742e';
    ctx.fillRect(0, -hw, len, this.width - 3);
    ctx.fillStyle = '#f6a868';
    ctx.fillRect(0, -hw + 1, len, 1);
    // The notch in the tip.
    ctx.fillStyle = '#1b1a22';
    ctx.fillRect(len - 5, -1, 5, 2);
    ctx.fillStyle = '#f4f6f4';
    ctx.fillRect(len - 3, -hw, 3, 3);
    ctx.fillRect(len - 3, hw - 3, 3, 3);
    ctx.restore();
  }
}

// The bath water: slops down from the taps (the top) or up out of the plug
// (the bottom), covers half the box or a little more, holds, drains. A dashed
// line shows the level first, and it is always the half you are standing in.
class Tide {
  constructor({ box, fromTop, depth, warn = 0.85 }) {
    Object.assign(this, { box, fromTop, depth, warn });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.rise = 0.35;
    this.hold = 1.05;
    this.drain = 0.5;
  }

  get end() {
    return this.warn + this.rise + this.hold + this.drain;
  }

  level() {
    const t = this.age - this.warn;
    if (t < 0) return 0;
    if (t < this.rise) return this.depth * (t / this.rise);
    if (t < this.rise + this.hold) return this.depth;
    return this.depth * Math.max(0, 1 - (t - this.rise - this.hold) / this.drain);
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.end + 0.05;
  }

  get active() {
    return this.age >= this.warn && this.level() > 1;
  }

  // Distance past the surface: negative or zero inside the water.
  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const b = this.box;
    const d = this.level();
    return this.fromTop ? py - (b.y + d) : (b.y + b.h - d) - py;
  }

  draw(ctx) {
    const b = this.box;
    ctx.save();
    if (this.age < this.warn) {
      const y = this.fromTop ? b.y + this.depth : b.y + b.h - this.depth;
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.3 : 0.7;
      ctx.strokeStyle = '#bfeaf5';
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(b.x, Math.round(y) + 0.5);
      ctx.lineTo(b.x + b.w, Math.round(y) + 0.5);
      ctx.stroke();
      ctx.setLineDash([]);
      // Drips from the taps, or a bubbling from the plug.
      ctx.fillStyle = '#74c0de';
      const spot = this.fromTop ? b.y : b.y + b.h - 2;
      for (let i = 0; i < 6; i++) {
        const x = b.x + 8 + i * 13;
        const dy = ((this.age * 40 + i * 7) % 10) * (this.fromTop ? 1 : -1);
        ctx.fillRect(Math.round(x), Math.round(spot + dy), 1, 2);
      }
      ctx.restore();
      return;
    }
    const d = this.level();
    const over = this.age - this.end;
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.05);
    const top = this.fromTop ? b.y : b.y + b.h - d;
    ctx.fillStyle = 'rgba(80, 170, 214, 0.78)';
    ctx.fillRect(b.x, Math.round(top), b.w, Math.round(d));
    ctx.fillStyle = 'rgba(160, 220, 240, 0.8)';
    const wave = (x) => Math.sin(x * 0.28 + this.age * 7) * 1.4;
    const surface = this.fromTop ? b.y + d : b.y + b.h - d;
    ctx.fillStyle = '#d4f2fa';
    for (let x = b.x; x < b.x + b.w; x += 2) ctx.fillRect(x, Math.round(surface + wave(x)) - 1, 2, 2);
    // Soap bubbles caught in it.
    ctx.fillStyle = 'rgba(244, 246, 248, 0.75)';
    for (let i = 0; i < 9; i++) {
      const bx = b.x + 5 + ((i * 29) % (b.w - 8));
      const by = this.fromTop ? b.y + 4 + ((i * 17 + this.age * 18) % Math.max(4, d - 6)) : b.y + b.h - 4 - ((i * 17 + this.age * 18) % Math.max(4, d - 6));
      ctx.fillRect(Math.round(bx), Math.round(by), 2, 2);
    }
    ctx.restore();
  }
}

// A pearl off her necklace: round, white, with a pink sheen.
defineBulletArt('crabPearl', { frames: [art(7, 7, (p) => { p.ellipse(3, 3, 2.6, 2.6, 'W'); p.set(2, 2, 'w'); p.set(4, 4, 'p'); })], palette: P, radius: 2.6 });
// One of her claws, out on the floor for the minuet (pincers up).
defineBulletArt('crabDancer', {
  frames: [
    art(11, 11, (p) => { p.ellipse(5, 7, 3.6, 3, 'o'); p.poly([[2, 5], [3, 0], [5, 4]], 'o'); p.poly([[6, 4], [8, 0], [9, 5]], 'q'); p.set(5, 7, 'O'); p.set(4, 8, 'q'); }),
    art(11, 11, (p) => { p.ellipse(5, 7, 3.6, 3, 'o'); p.poly([[2, 5], [2, 1], [5, 4]], 'o'); p.poly([[6, 4], [9, 1], [9, 5]], 'q'); p.set(5, 7, 'O'); p.set(4, 8, 'q'); }),
  ],
  palette: P,
  radius: 4,
  frameSeconds: 0.19,
});
// A grain of sand shaken out of the mat.
defineBulletArt('crabGrit', { frames: [['.s.', 'sSs', '.s.']], palette: P, radius: 1.7, spin: 4 });

// Everything but the doormat, for a moment: where her look falls hard when
// she inspects your feet. Hurts anywhere off the mat while it lasts.
class OffMat {
  constructor({ box, mat, warn, life = 0.22 }) {
    Object.assign(this, { box, mat, warn, life });
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
    return this.age >= this.warn + this.life + 0.2;
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const m = this.mat;
    // Inside the mat (with the soul's own size to spare) is safe.
    const inside = Math.min(px - m.x, m.x + m.w - px, py - m.y, m.y + m.h - py);
    return inside > 2.5 ? Infinity : 0;
  }

  draw(ctx) {
    const b = this.box;
    const m = this.mat;
    ctx.save();
    if (this.age < this.warn) {
      // Her monocle glints: a pale flicker round the edge of the box.
      if (this.warn - this.age < 0.35) {
        ctx.globalAlpha = Math.floor(this.age * 20) % 2 ? 0.25 : 0.5;
        ctx.strokeStyle = '#fff0a0';
        ctx.strokeRect(b.x + 1.5, b.y + 1.5, b.w - 3, b.h - 3);
      }
      ctx.restore();
      return;
    }
    const over = this.age - this.warn - this.life;
    ctx.globalAlpha = over > 0 ? Math.max(0, 0.45 * (1 - over / 0.2)) : 0.45;
    ctx.fillStyle = '#e8742e';
    ctx.beginPath();
    ctx.rect(b.x, b.y, b.w, b.h);
    ctx.rect(m.x + m.w, m.y, -m.w, m.h);
    ctx.fill('evenodd');
    ctx.restore();
  }
}

// A doormat: coir bristles, a border, WIPE on it.
const drawMat = (ctx, m, alpha = 1) => {
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = '#8a6a22';
  ctx.fillRect(Math.round(m.x), Math.round(m.y), m.w, m.h);
  ctx.fillStyle = '#d8c070';
  ctx.fillRect(Math.round(m.x) + 2, Math.round(m.y) + 2, m.w - 4, m.h - 4);
  ctx.fillStyle = '#8a7a38';
  for (let x = 4; x < m.w - 3; x += 3) ctx.fillRect(Math.round(m.x) + x, Math.round(m.y) + 3, 1, m.h - 6);
  ctx.restore();
};

export const DOWAGER_CRAB_ATTACKS = {
  // Wipe your feet: a doormat lies in the box, and every so often she
  // inspects your feet (her monocle glints round the box first). Anywhere
  // off the mat at that moment, her look lands hard. Then she has the mat
  // moved (its next place shows as an outline well before) and the old one
  // is shaken out, in a puff of sand. Be on the mat when she looks.
  crabMat(box, density, { Shot, rand }) {
    const EVERY = 2.4;
    const MW = 38;
    const MH = 27;
    let real = 0;
    let n = 0;
    let mat = null;
    let next = null;
    let shown = null;
    let pending = null;
    let inspecting = false;
    const place = (avoid) => {
      let m;
      let tries = 0;
      do {
        m = { x: rand(box.x + 2, box.x + box.w - MW - 2), y: rand(box.y + 2, box.y + box.h - MH - 2), w: MW, h: MH };
        tries++;
      } while (tries < 30 && avoid && Math.hypot(m.x - avoid.x, m.y - avoid.y) < 30);
      return m;
    };
    return {
      duration: 11.5,
      update: (dt, bullets) => {
        real += dt / density;
        if (!mat) {
          mat = place(null);
          next = place(mat);
          shown = { m: mat };
          bullets.push(new Deco({ life: 11.5, paint(ctx) { drawMat(ctx, shown.m); } }));
          bullets.push(new Deco({ life: 11.5, paint(ctx, d) {
            // The outline of where the mat goes next.
            if (!next) return;
            ctx.strokeStyle = '#d8c070';
            ctx.setLineDash([2, 2]);
            ctx.globalAlpha *= Math.floor(d.age * 8) % 2 ? 0.4 : 0.8;
            ctx.strokeRect(Math.round(next.x) + 0.5, Math.round(next.y) + 0.5, next.w - 1, next.h - 1);
          } }));
        }
        // An inspection every EVERY seconds, the first after a good look at the
        // mat. Each is set going as soon as the mat it checks is down, so its
        // hard look is known (and can be read) well ahead.
        if (!inspecting) {
          inspecting = true;
          bullets.push(new OffMat({ box, mat: { ...mat }, warn: 1.4 - real }));
        }
        if (real >= 1.4 + n * EVERY && n < 4) {
          n++;
          pending = { at: real + 0.6, old: mat, to: next };
        }
        const p = pending;
        if (p && real >= p.at) {
          pending = null;
          mat = p.to;
          shown.m = mat;
          next = place(mat);
          if (n < 4) bullets.push(new OffMat({ box, mat: { ...mat }, warn: 1.4 + n * EVERY - real }));
          const cx = p.old.x + MW / 2;
          const cy = p.old.y + MH / 2;
          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            bullets.push(new Shot({ x: cx, y: cy, vx: Math.cos(a) * 40, vy: Math.sin(a) * 40, art: 'crabGrit', warn: 0.4, life: 1.4 }));
          }
        }
      },
    };
  },

  // Her pearls: the string snaps, and the pearls scatter from beside you in
  // a burst, roll to a stop, and sit. Then she pulls the string: every pearl
  // comes back exactly the way it went, to where it broke, and the whole
  // string is drawn home to her. Three times. Remember where they rolled from.
  crabPearls(box, density, { rand }) {
    const OUT = 0.7;
    const SIT = 0.7;
    const BACK = 0.55;
    const HOME = 0.5;
    let real = 0;
    let n = 0;
    return {
      duration: 11,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real < 0.3 + n * 3.3 || n >= 3) return;
        n++;
        const a0 = rand(0, Math.PI * 2);
        const sx = Math.min(Math.max(soul.x + Math.cos(a0) * 14, box.x + 8), box.x + box.w - 8);
        const sy = Math.min(Math.max(soul.y + Math.sin(a0) * 14, box.y + 8), box.y + box.h - 8);
        const home = { x: box.x + box.w + 10, y: box.y + 14 };
        const COUNT = 11;
        for (let i = 0; i < COUNT; i++) {
          const a = (i / COUNT) * Math.PI * 2 + rand(-0.12, 0.12);
          const d = rand(26, 46);
          const ex = Math.min(Math.max(sx + Math.cos(a) * d, box.x + 4), box.x + box.w - 4);
          const ey = Math.min(Math.max(sy + Math.sin(a) * d, box.y + 4), box.y + box.h - 4);
          bullets.push(new PathShot({
            art: 'crabPearl', warn: 0.45, life: OUT + SIT + BACK + HOME,
            path: (k) => {
              if (k < OUT) { const u = 1 - (1 - k / OUT) ** 2; return { x: sx + (ex - sx) * u, y: sy + (ey - sy) * u }; }
              if (k < OUT + SIT) return { x: ex, y: ey };
              if (k < OUT + SIT + BACK) { const u = ((k - OUT - SIT) / BACK) ** 2; return { x: ex + (sx - ex) * u, y: ey + (sy - ey) * u }; }
              const u = Math.min(1, (k - OUT - SIT - BACK) / HOME);
              return { x: sx + (home.x - sx) * u, y: sy + (home.y - sy) * u };
            },
          }));
        }
        // The string itself, drawn home at the end (a thread from the knot to her).
        bullets.push(new Tether({ warn: 0.45 + OUT + SIT + BACK, life: HOME, thick: 2, color: '#f4f6f4', dark: '#5a7090', ends: (k) => {
          const u = Math.min(1, k / HOME);
          return [sx + (home.x - sx) * u, sy + (home.y - sy) * u, home.x, home.y];
        } }));
      },
    };
  },

  // The minuet: four of her claws take the floor round you, at the corners
  // of a square, and dance to her minuet, which is in three: on the ONE of
  // every bar they all step round to the next corner, and on the two and
  // three they hold. Every fourth bar they curtsey: all four step into the
  // middle and back. The square is set round where you were as each phrase
  // begins. Move on the two and three.
  crabMinuet(box, density) {
    const BEAT = 0.4;
    const BAR = BEAT * 3;
    const STEP = 0.3;
    const PHRASES = 2;
    let real = 0;
    let phrase = 0;
    return {
      duration: 11,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (phrase >= PHRASES || real < 0.2 + phrase * BAR * 4) return;
        phrase++;
        const H = phrase % 2 ? 22 : 28;
        const cx = Math.min(Math.max(soul.x, box.x + H - 4), box.x + box.w - H + 4);
        const cy = Math.min(Math.max(soul.y, box.y + H - 4), box.y + box.h - H + 4);
        const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, y]) => ({ x: cx + x * H, y: cy + y * H }));
        const WARN = 0.6;
        // The bell on her tub ticks the ONE.
        bullets.push(new Deco({ life: WARN + BAR * 4, paint(ctx, d) {
          const k = d.age - WARN;
          const one = k >= 0 && k % BAR < 0.12;
          ctx.fillStyle = one ? '#fff0a0' : '#8a6a22';
          ctx.fillRect(box.x + box.w - 8, box.y + 3, 5, 5);
        } }));
        for (let i = 0; i < 4; i++) {
          const at = (j) => corners[(i + j) % 4];
          bullets.push(new PathShot({
            art: 'crabDancer', warn: WARN, life: BAR * 4,
            path: (k) => {
              const bar = Math.floor(k / BAR);
              const f = Math.min(1, (k - bar * BAR) / STEP);
              if (bar === 3) {
                // The curtsey: in to the middle and back out within the bar.
                const c = at(3);
                const g = Math.sin(Math.PI * Math.min(1, (k - bar * BAR) / (BAR * 0.8)));
                return { x: c.x + (cx - c.x) * g, y: c.y + (cy - c.y) * g };
              }
              const from = at(bar);
              const to = at(bar + 1);
              return { x: from.x + (to.x - from.x) * f, y: from.y + (to.y - from.y) * f };
            },
          }));
        }
      },
    };
  },

  // The monocle: she screws in her monocle and looks for you through it. The
  // lens drifts after you, and while it's over you it focuses (its ring
  // draws in); if it finishes focusing, the sunlight through it burns that
  // spot. Keep the lens from settling on you.
  crabMonocle(box, density, { Shot, rand }) {
    const lens = { x: box.x + box.w - 10, y: box.y + 10, focus: 0, cool: 0 };
    const FOCUS = 0.75;
    let real = 0;
    let made = false;
    return {
      duration: 10.5,
      update: (dt, bullets, soul) => {
        const step = dt / density;
        real += step;
        if (!made) {
          made = true;
          bullets.push(new Deco({ life: 10.5, paint(ctx) {
            const r = 10 - 6 * (lens.focus / FOCUS);
            ctx.strokeStyle = '#d8c070';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(lens.x, lens.y, 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha *= 0.6;
            ctx.strokeStyle = '#fff0a0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(lens.x, lens.y, Math.max(1, r), 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(lens.x, lens.y, 9, 0, Math.PI * 2);
            ctx.fill();
          } }));
        }
        if (real > 10) return;
        // It drifts after you (faster the longer the turn goes on).
        const SPEED = 34 + real * 1.5;
        const dx = soul.x - lens.x;
        const dy = soul.y - lens.y;
        const d = Math.hypot(dx, dy);
        if (lens.cool > 0) {
          lens.cool -= step;
        } else if (d > 0.5) {
          lens.x += (dx / d) * Math.min(d, SPEED * step);
          lens.y += (dy / d) * Math.min(d, SPEED * step);
        }
        lens.focus = d < 9 ? lens.focus + step : Math.max(0, lens.focus - step * 1.5);
        if (lens.focus >= FOCUS) {
          lens.focus = 0;
          lens.cool = 0.8;
          bullets.push(new Zone({ x: lens.x, y: lens.y, r: 9, warn: 0.45, life: 0.35, paint(ctx, z) {
            ctx.fillStyle = z.age < z.warn ? '#fff0a0' : '#ffffff';
            ctx.beginPath();
            ctx.arc(z.x, z.y, z.age < z.warn ? 3 : 9, 0, Math.PI * 2);
            ctx.fill();
          } }));
          // And the glare scatters off the burnt spot.
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 + rand(0, 1);
            bullets.push(new Shot({ x: lens.x, y: lens.y, vx: Math.cos(a) * 55, vy: Math.sin(a) * 55, art: 'crabDrop', warn: 0.45, life: 1 }));
          }
        }
      },
    };
  },

  // How very forward: her claws snip shut across the way you are going.
  // Walk sideways and a column shuts ahead of you; walk up or down and a
  // row shuts ahead of you; stand still and both come at you. Each pair of
  // claws shows where it will shut before it does.
  crabSnips(box, density) {
    let real = 0;
    let n = 0;
    let last = null;
    let vx = 0;
    let vy = 0;
    return {
      duration: 10,
      update: (dt, bullets, soul) => {
        const step = dt / density;
        real += step;
        if (last && step > 0) {
          vx = vx * 0.8 + ((soul.x - last.x) / step) * 0.2;
          vy = vy * 0.8 + ((soul.y - last.y) / step) * 0.2;
        }
        last = { x: soul.x, y: soul.y };
        if (n >= 8 || real < 0.3 + n * 1.1) return;
        n++;
        const warn = 0.95;
        const moving = Math.hypot(vx, vy) > 15;
        const across = Math.abs(vx) >= Math.abs(vy);
        if (!moving || across) {
          // A column ahead of you (or on you, standing still).
          const ahead = moving ? Math.sign(vx) * 16 : 0;
          const s = new Snip({ box, vertical: true, at: Math.min(Math.max(soul.x + ahead, box.x + 6), box.x + box.w - 6), warn });
          bullets.push(s);
        }
        if (!moving || !across) {
          const ahead = moving ? Math.sign(vy) * 16 : 0;
          const s = new Snip({ box, vertical: false, at: Math.min(Math.max(soul.y + ahead, box.y + 6), box.y + box.h - 6), warn: warn + (moving ? 0 : 0.2) });
          bullets.push(s);
        }
      },
    };
  },

  // The bath water (riled only): it slops over the half of the box you are
  // in (a dashed line shows the level first), holds, and drains, three or
  // four times; soap bubbles drift in on it.
  // (Made fair 2026-11-08: the surges came on the pattern's clock, which
  // runs `density` fast, while the water itself runs in real time, so the
  // next surge rose before the last had drained and the two halves met:
  // nowhere to stand. Now each surge's warning starts just before the last one
  // drains, and it rises just after the last has gone.)
  crabTide(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let surges = 0;
    let bubbles = 0;
    let nextBubble = 0.5;
    let last = null;
    return {
      duration: 10.5,
      update: (dt, bullets, soul) => {
        t += dt;
        const ready = last ? last.age >= last.end - last.warn + 0.12 : t >= 0.2;
        if (surges < 4 && ready) {
          surges++;
          const mid = box.y + box.h / 2;
          last = new Tide({ box, fromTop: soul.y < mid, depth: 46, warn: 0.9 });
          bullets.push(last);
        }
        // Soap on the water: small bubbles drifting in from the right.
        if (t >= nextBubble && bubbles < 16) {
          bubbles++;
          nextBubble = t + rand(0.6, 0.75);
          bullets.push(new Shot({ x: box.x + box.w + 8, y: clamp(soul.y + rand(-26, 26), box.y + 8, box.y + box.h - 8), vx: -30, warn: 0.3, life: 5, art: 'crabBubble', wobble: { frequency: 4, amplitude: 5 } }));
        }
      },
    };
  },
};
