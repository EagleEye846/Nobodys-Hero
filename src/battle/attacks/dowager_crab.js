import { defineBulletArt } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { Ring } from './underShapes.js';

// The Dowager Crab's attacks. A very old, very polite hermit crab who lives in
// a bathtub with a ship's bell on it, and who has been trespassed upon. Her
// house is her weapon: soap bubbles that pop into droplets, the bell tolling
// in rings, her claws snipping shut on a column or a row, rubber ducks and
// bath sponges lobbed in from the tub, barnacles flung to stick where you
// stand, and (once she has lost her patience) the bath water itself, slopping
// over half the box at a time. She stands to the right of the box, so
// everything comes in from that side.
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

export const DOWAGER_CRAB_ATTACKS = {
  // Soap bubbles: big shimmering bubbles drift in from the tub on your row,
  // wobbling, and pop part-way across into a ring of drops. The pop is
  // where you would have been, so holding still is no good.
  crabBubbles(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let made = 0;
    let next = 0.2;
    const pops = [];
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (made < 9 && t >= next) {
          made++;
          next = t + rand(0.55, 0.75);
          const y = clamp(soul.y + rand(-16, 16), box.y + 8, box.y + box.h - 8);
          const shot = new Shot({ x: box.x + box.w + 8, y, vx: -36, warn: 0.3, life: 6, art: 'crabBubble', wobble: { frequency: 4.5, amplitude: 6 } });
          bullets.push(shot);
          pops.push({ shot, atX: rand(box.x + 18, box.x + box.w - 16), done: false });
        }
        for (const pop of pops) {
          if (pop.done || pop.shot.age < pop.shot.warn || pop.shot.x > pop.atX) continue;
          pop.done = true;
          const { x, y } = pop.shot;
          pop.shot.life = 0;
          pop.shot.age = pop.shot.warn + 0.01;
          const turn = Math.random() * Math.PI;
          for (let k = 0; k < 7; k++) {
            const a = turn + (k / 7) * Math.PI * 2;
            // (The drops hang a blink where it burst before they fly, so a bubble
            // popping beside you isn't a hit from point-blank. 2026-11-10.)
            bullets.push(new Shot({ x, y, vx: Math.cos(a) * 34, vy: Math.sin(a) * 34, warn: 0.22, art: 'crabDrop', life: 1.4 }));
          }
        }
      },
    };
  },

  // Toll: the bell on her tub rings, and the sound spreads in a ring with a
  // gap. Pairs of tolls, the second a beat later with the gap turned away.
  crabToll(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let tolls = 0;
    let echo = null;
    const rings = [];
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (tolls < 5 && t >= 0.2 + tolls * 1.35) {
          tolls++;
          const ox = box.x + box.w + 8;
          const oy = clamp(soul.y + rand(-22, 22), box.y + 6, box.y + box.h - 6);
          bullets.push(new Shot({ x: ox, y: oy, harmless: true, life: 0.9, art: 'crabBell' }));
          // The gap is a way through that is NOT where you stand: a point 22-34 px
          // up or down from you (the side with room), seen from the bell.
          const room = soul.y - (box.y + 8) > box.y + box.h - 8 - soul.y ? -1 : 1;
          const side = Math.random() < 0.3 ? -room : room;
          let ty = soul.y + side * rand(22, 34);
          ty = clamp(ty, box.y + 8, box.y + box.h - 8);
          if (Math.abs(ty - soul.y) < 20) ty = soul.y - side * 26 < box.y + 8 || soul.y - side * 26 > box.y + box.h - 8 ? soul.y + side * 22 : soul.y - side * 26;
          ty = clamp(ty, box.y + 8, box.y + box.h - 8);
          const reachD = Math.hypot(soul.x - ox, ty - oy);
          const gap = { angle: Math.atan2(ty - oy, soul.x - ox), width: 2 * Math.atan2(13, reachD) };
          const first = new Ring({ x: ox, y: oy, r: 3, grow: 50, thick: 3, warn: 0.5, life: 3.4, gap, color: '#f0d890', glow: '#e0b84a' });
          bullets.push(first);
          rings.push(first);
          echo = { at: t + 0.4, ox, oy, sx: soul.x, sy: soul.y, angle: Math.atan2(ty + rand(-8, 8) - oy, soul.x - ox) };
        }
        if (echo && t >= echo.at) {
          bullets.push(new Ring({ x: echo.ox, y: echo.oy, r: 3, grow: 50, thick: 2.4, warn: 0.5, life: 3.4, gap: { angle: echo.angle, width: 2 * Math.atan2(14, Math.max(30, Math.hypot(echo.ox - echo.sx, echo.oy - echo.sy))) }, color: '#fff4c8', glow: '#e0b84a' }));
          echo = null;
        }
      },
    };
  },

  // Snips: her claws close on a column, then a row, then (later in the turn)
  // both at once. Each follows you while it flickers and locks just before it
  // shuts.
  crabSnips(box, density, { rand }) {
    let t = 0;
    let n = 0;
    return {
      // (The last snip is open again by 5.5 s: 7.0, was 8, so the next attack isn't long in coming.)
      duration: 7.0,
      update: (dt, bullets, soul) => {
        t += dt;
        if (n < 7 && t >= 0.2 + n * 1.12) {
          const vertical = n % 2 === 0;
          const warn = 0.95;
          const snip = new Snip({ box, vertical, at: vertical ? soul.x : soul.y, warn, follow: soul });
          // The odd one is shifted a little to a side: you must read it, not sit in the middle.
          snip.offset = rand(-6, 6);
          bullets.push(snip);
          if (n >= 4) {
            const second = new Snip({ box, vertical: !vertical, at: vertical ? soul.y : soul.x, warn: warn + 0.2, follow: soul });
            second.offset = rand(-4, 4);
            bullets.push(second);
          }
          n++;
        }
      },
    };
  },

  // Ducks and sponges: she shies rubber ducks at you from the tub (some at
  // you, some ahead of you), and drops bath sponges from above that squeeze
  // out a spray where they land.
  crabDucks(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let thrown = 0;
    let next = 0.2;
    const GRAVITY = 130;
    const FLIGHT = 0.8;
    const flying = [];
    const falling = [];
    const heading = { x: 0, y: 0 };
    const seen = { x: null, y: null };
    const spray = (bullets, x, y, n) => {
      for (let k = 0; k < n; k++) {
        const a = -Math.PI + 0.3 + (k / (n - 1)) * (Math.PI - 0.6);
        bullets.push(new Shot({ x, y, vx: Math.cos(a) * 46, vy: Math.sin(a) * 58, gravity: 110, art: 'crabDrop', life: 1.1 }));
      }
    };
    return {
      duration: 7.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (seen.x !== null && dt > 0) {
          heading.x = heading.x * 0.85 + ((soul.x - seen.x) / dt) * 0.15;
          heading.y = heading.y * 0.85 + ((soul.y - seen.y) / dt) * 0.15;
        }
        seen.x = soul.x;
        seen.y = soul.y;
        if (thrown < 12 && t >= next) {
          next = t + 0.6;
          if (thrown % 2 === 0) {
            const duck = new Shot({ x: box.x + box.w + 8, y: rand(box.y + 8, box.y + 34), warn: 0.55, life: 4, art: 'crabDuck', gravity: GRAVITY });
            duck.ahead = thrown % 4 === 2;
            bullets.push(duck);
            flying.push(duck);
          } else {
            const x = clamp(soul.x + rand(-13, 13), box.x + 6, box.x + box.w - 6);
            const sponge = new Shot({ x, y: box.y - 6, warn: 0.6, life: 4, art: 'crabSponge' });
            bullets.push(sponge);
            falling.push(sponge);
          }
          thrown++;
        }
        for (const duck of flying) {
          if (!duck.set && duck.age >= duck.warn - 0.03) {
            const lead = duck.ahead ? FLIGHT * 0.9 : 0;
            const tx = clamp(soul.x + heading.x * lead, box.x + 4, box.x + box.w - 4);
            const ty = clamp(soul.y + heading.y * lead, box.y + 4, box.y + box.h - 4);
            duck.vx = (tx - duck.x) / FLIGHT;
            duck.vy = (ty - duck.y - 0.5 * GRAVITY * FLIGHT * FLIGHT) / FLIGHT;
            duck.set = true;
          }
          if (duck.set && duck.vy > 0 && duck.y > box.y + box.h - 3 && !duck.bounced) {
            duck.bounced = true;
            duck.y = box.y + box.h - 3;
            duck.vy = -duck.vy * 0.5;
            spray(bullets, duck.x, duck.y, 4);
          }
        }
        for (const sponge of falling) {
          if (!sponge.set && sponge.age >= sponge.warn) {
            sponge.vy = 60;
            sponge.set = true;
          }
          if (sponge.set && !sponge.splat && sponge.y > box.y + box.h - 5) {
            sponge.splat = true;
            sponge.life = 0;
            sponge.age = sponge.warn + 0.01;
            spray(bullets, sponge.x, box.y + box.h - 4, 6);
          }
        }
      },
    };
  },

  // Barnacles: she flings them at where you stand. Each slows to a stop and
  // stays, stuck fast, for a couple of seconds: a middle one at you and two
  // either side, so the box fills up with them.
  crabBarnacles(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let volleys = 0;
    const flying = [];
    const heading = { x: 0, y: 0 };
    const seen = { x: null, y: null };
    const STOP = 0.95;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (seen.x !== null && dt > 0) {
          heading.x = heading.x * 0.85 + ((soul.x - seen.x) / dt) * 0.15;
          heading.y = heading.y * 0.85 + ((soul.y - seen.y) / dt) * 0.15;
        }
        seen.x = soul.x;
        seen.y = soul.y;
        if (volleys < 5 && t >= 0.2 + volleys * 1.25) {
          volleys++;
          const ox = box.x + box.w + 8;
          const oy = rand(box.y + 20, box.y + box.h - 20);
          for (const off of [0, -32, 32]) {
            const b = new Shot({ x: ox, y: oy, warn: 0.6, life: 2.6, art: 'crabBarnacle' });
            b.off = off;
            bullets.push(b);
            flying.push(b);
          }
        }
        for (const b of flying) {
          if (b.set || b.age < b.warn - 0.03) continue;
          b.set = true;
          const lead = STOP * 0.45;
          const tx = clamp(soul.x + heading.x * lead, box.x + 6, box.x + box.w - 6);
          const ty = clamp(soul.y + heading.y * lead + b.off, box.y + 6, box.y + box.h - 6);
          const dx = tx - b.x;
          const dy = ty - b.y;
          const dist = Math.hypot(dx, dy);
          const v0 = (2 * dist) / STOP;
          b.vx = (dx / dist) * v0;
          b.vy = (dy / dist) * v0;
          b.accel = -v0 / STOP;
          b.life = STOP + 1.4;
        }
      },
    };
  },

  // Tide (once she's lost patience): the bath water sloshes over the half of
  // the box you are standing in, from the taps above or the plug below. Cross
  // before it lands. Three times, and in between, her bubbles.
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
      duration: 8.2,
      update: (dt, bullets, soul) => {
        t += dt;
        const ready = last ? last.age >= last.end - last.warn + 0.12 : t >= 0.2;
        if (surges < 3 && ready) {
          surges++;
          const mid = box.y + box.h / 2;
          last = new Tide({ box, fromTop: soul.y < mid, depth: 46, warn: 0.9 });
          bullets.push(last);
        }
        // Soap on the water: small bubbles drifting in from the right.
        if (t >= nextBubble && bubbles < 12) {
          bubbles++;
          nextBubble = t + rand(0.9, 1.1);
          bullets.push(new Shot({ x: box.x + box.w + 8, y: clamp(soul.y + rand(-26, 26), box.y + 8, box.y + box.h - 8), vx: -30, warn: 0.3, life: 5, art: 'crabBubble', wobble: { frequency: 4, amplitude: 5 } }));
        }
      },
    };
  },
};
