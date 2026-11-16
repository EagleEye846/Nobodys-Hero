import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { Ring } from './underShapes.js';
import { blit } from './coastKit.js';

// The Net Wraith's attacks. A fishing net that drowned with its boat and
// still thinks it's at work:
//   - Cast net: it lands round you and the weighted edge draws in. Get out
//     through the tear (between the two cork floats) before it closes.
//   - Mesh: the whole net hangs in the box, drifting on the swell. Stay in
//     your hole and go with it; the cords sting.
//   - Lost catch: the fish it never landed wriggle loose. A fish only ever
//     swims the way it faces, and turns to face you again at a wall.
// It hangs to the right of the box.

const NET = { n: '#c8b48a', N: '#8a7650', i: '#cfd8dc', o: '#e0583a', O: '#a83a28', W: '#f4ece0', w: '#ffffff', g: '#9af0c8', G: '#4ab08a', k: '#1c2a2a' };

// A net float: a cork bobber, red cap, white band, a peg on top where the
// line ties on, and a wet glint.
function float(flip) {
  const g = new Pix(7, 10);
  g.rect(3, 0, 1, 2, 'N');
  g.disc(3, 4, 3, 2.4, 'o');
  g.disc(3.6, 4.6, 1.6, 1.2, 'O', 'o');
  g.rect(0, 5, 7, 1, 'W');
  g.disc(3, 7, 2.6, 2, 'W');
  g.rect(1, 7, 5, 1, 'n');
  g.set(2, 3, 'w');
  g.rect(3, 9, 1, 1, flip ? 'n' : 'N');
  g.outline('k');
  return g.rows();
}
defineBulletArt('netFloat', { frames: [float(0), float(1)], palette: NET, radius: 3, frameSeconds: 0.25 });

// A hook on its line, point down.
defineBulletArt('netHook', {
  frames: [['..kk...', '.kiik..', '.k..k..', '..kik..', '...ik..', '...ik..', 'k..ikk.', 'ik.iik.', 'iikiik.', '.iiiik.', '..kkk..']],
  palette: NET,
  radius: 2.6,
});

// A bead of the fishing line (harmless).
defineBulletArt('netThread', { frames: [['i'], ['n']], palette: NET, radius: 1, frameSeconds: 0.3 });

// A glint where a hook will go down (harmless).
defineBulletArt('netGlint', {
  frames: [['..w..', '.....', 'w...w', '.....', '..w..'], ['.....', '..w..', '.wgw.', '..w..', '.....']],
  palette: NET,
  radius: 1,
  frameSeconds: 0.1,
});

// A knot of rope, in the curtain.
defineBulletArt('netKnot', {
  frames: [['n...n', '.nNn.', '.NNN.', '.nNn.', 'n...n']],
  palette: NET,
  radius: 2.6,
  spin: 0.8,
});

// A corner of the window (harmless): a green bracket.
defineBulletArt('netPeg', {
  frames: [['gggg.', 'g....', 'g....', 'g....', '.....'], ['GGGG.', 'G....', 'G....', 'G....', '.....']],
  palette: NET,
  radius: 1,
  frameSeconds: 0.12,
});

// A little silver fish, drawn swimming right: it wriggles.
function fish(bend) {
  const g = new Pix(13, 7);
  g.disc(6, 3, 4.4, 2.4, 'i');
  g.disc(6, 4, 3.6, 1.2, 'W', 'i');
  g.line(1, 3 - bend, 0, 1 - bend, 'i');
  g.line(1, 3 - bend, 0, 5 - bend, 'i');
  g.set(9, 2, 'k');
  g.line(4, 1, 7, 1, 'g');
  g.outline('k');
  return g.rows();
}
defineBulletArt('netFish', { frames: [fish(0), fish(1)], palette: NET, radius: 2.8, rotate: true, frameSeconds: 0.08 });

// A fish loose in the box. It darts the way it faces; when it reaches a wall
// it flops, turns to face you, and darts again (twice, then it's off).
class Fish {
  constructor({ x, y, angle, speed, warn, soul, box, flops = 2 }) {
    Object.assign(this, { x, y, angle, speed, warn, soul, box, flops });
    this.age = 0;
    this.rest = 0;
    this.gone = false;
    this.dmg = null;
    this.grazed = false;
    this.art = null;
  }

  get active() {
    return this.age >= this.warn && !this.gone;
  }

  update(dt) {
    this.age += dt;
    if (this.age < this.warn || this.gone) return;
    if (this.rest > 0) {
      this.rest -= dt;
      if (this.rest <= 0) this.angle = Math.atan2(this.soul.y - this.y, this.soul.x - this.x);
      return;
    }
    this.x += Math.cos(this.angle) * this.speed * dt;
    this.y += Math.sin(this.angle) * this.speed * dt;
    const b = this.box;
    const out = this.x < b.x + 4 || this.x > b.x + b.w - 4 || this.y < b.y + 4 || this.y > b.y + b.h - 4;
    if (!out) return;
    this.x = Math.min(Math.max(this.x, b.x + 4), b.x + b.w - 4);
    this.y = Math.min(Math.max(this.y, b.y + 4), b.y + b.h - 4);
    if (this.flops-- > 0) this.rest = 0.4; else this.gone = true;
  }

  isGone() {
    return this.gone;
  }

  edgeDistance(px, py) {
    if (!this.active || this.rest > 0) return Infinity;
    return Math.hypot(px - this.x, py - this.y) - 2.8;
  }

  draw(ctx) {
    ctx.save();
    if (this.age < this.warn || this.rest > 0) ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.45 : 0.9;
    const wiggle = this.rest > 0 ? Math.sin(this.age * 40) * 0.5 : 0;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + wiggle);
    ctx.strokeStyle = '#1c2a2a';
    blit(ctx, FISH_ROWS, NET, 0, 0);
    ctx.restore();
  }
}
const FISH_ROWS = fish(0);

// The drifting net: cords every `cell` pixels, offset by `at(k)`, hurting
// along the cords. Knots where they cross.
class Mesh {
  constructor({ box, cell, at, warn, life }) {
    Object.assign(this, { box, cell, at, warn, life });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get active() {
    const k = this.age - this.warn;
    return k >= 0 && k < this.life;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.warn + this.life + 0.25;
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const o = this.at(this.age - this.warn);
    const fx = ((px - o.x) % this.cell + this.cell) % this.cell;
    const fy = ((py - o.y) % this.cell + this.cell) % this.cell;
    return Math.min(fx, this.cell - fx, fy, this.cell - fy) - 0.8;
  }

  draw(ctx) {
    const o = this.at(Math.max(0, this.age - this.warn));
    const b = this.box;
    ctx.save();
    if (this.age < this.warn) ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.2 : 0.45;
    const over = this.age - this.warn - this.life;
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
    ctx.beginPath();
    ctx.rect(b.x, b.y, b.w, b.h);
    ctx.clip();
    const x0 = b.x + ((((o.x - b.x) % this.cell) + this.cell) % this.cell) - this.cell;
    const y0 = b.y + ((((o.y - b.y) % this.cell) + this.cell) % this.cell) - this.cell;
    ctx.strokeStyle = '#c8b48a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = x0; x <= b.x + b.w + this.cell; x += this.cell) { ctx.moveTo(x, b.y); ctx.lineTo(x, b.y + b.h); }
    for (let y = y0; y <= b.y + b.h + this.cell; y += this.cell) { ctx.moveTo(b.x, y); ctx.lineTo(b.x + b.w, y); }
    ctx.stroke();
    ctx.fillStyle = '#8a7650';
    for (let x = x0; x <= b.x + b.w + this.cell; x += this.cell) for (let y = y0; y <= b.y + b.h + this.cell; y += this.cell) ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3);
    ctx.restore();
  }
}

// The weighted edge of a cast net, drawn with its mesh inside and the tear left open.
class CastNet extends Ring {
  draw(ctx) {
    super.draw(ctx);
    if (this.age < this.warn || this.r < 4) return;
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = '#c8b48a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + Math.cos(a) * this.r, this.y + Math.sin(a) * this.r);
    }
    for (const f of [0.35, 0.7]) {
      ctx.moveTo(this.x + this.r * f, this.y);
      ctx.arc(this.x, this.y, this.r * f, 0, Math.PI * 2);
    }
    ctx.stroke();
    // Cork floats either side of the tear, so it's easy to find.
    if (this.gap) {
      for (const s of [-1, 1]) {
        const a = this.gap.angle + s * (this.gap.width / 2 + 0.12);
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#1c2a2a';
        ctx.fillRect(Math.round(this.x + Math.cos(a) * this.r) - 2, Math.round(this.y + Math.sin(a) * this.r) - 2, 5, 5);
        ctx.fillStyle = '#e0583a';
        ctx.fillRect(Math.round(this.x + Math.cos(a) * this.r) - 1, Math.round(this.y + Math.sin(a) * this.r) - 1, 3, 3);
      }
    }
    ctx.restore();
  }
}

export const NET_WRAITH_ATTACKS = {
  // Cast net: it throws itself over you. A round net lands with you in the
  // middle and its weighted edge draws in, closing to nothing. There's a
  // tear in it somewhere (the gap in the edge): get out through the tear
  // before it closes. Four casts.
  netCast(box, density, { rand }) {
    const T = (s) => s * density;
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + n * 2.1) && n < 3) {
          n++;
          const R = 40;
          const CLOSE = 1.4;
          const tear = rand(0, Math.PI * 2);
          bullets.push(new CastNet({ x: soul.x, y: soul.y, r: R, grow: -R / CLOSE, thick: 3, warn: 0.7, life: CLOSE, gap: { angle: tear, width: 1.5 }, color: '#c8b48a', glow: '#8a7650' }));
        }
      },
    };
  },

  // Mesh: the whole net hangs in the box, drifting on the swell, cords and
  // knots. The holes are big enough to stand in, and the cords sting. It
  // drifts and sways, so stay in your hole and go with it.
  netMesh(box, density, { rand }) {
    let made = false;
    return {
      duration: 7,
      update: (dt, bullets) => {
        if (made) return;
        made = true;
        const vx = rand(6, 9) * (Math.random() < 0.5 ? -1 : 1);
        const vy = rand(4, 6) * (Math.random() < 0.5 ? -1 : 1);
        const ox = rand(0, 20);
        const oy = rand(0, 20);
        const ph = rand(0, 6);
        bullets.push(new Mesh({ box, cell: 30, warn: 1.0, life: 5.3, at: (k) => ({ x: box.x + ox + vx * k + Math.sin(k * 1.2 + ph) * 6, y: box.y + oy + vy * k + Math.sin(k * 0.9) * 4 }) }));
      },
    };
  },

  // Lost catch: the fish it never landed wriggle loose into the box. Each
  // fish shows facing the way it will go (it's facing you), then darts
  // straight that way. When it hits a wall it flops about, turns to face
  // you again, and darts again. Fish only ever swim the way they face.
  netCatch(box, density, { rand }) {
    const T = (s) => s * density;
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + n * 0.9) && n < 6) {
          n++;
          let x;
          let y;
          let tries = 0;
          do {
            x = rand(box.x + 8, box.x + box.w - 8);
            y = rand(box.y + 8, box.y + box.h - 8);
            tries++;
          } while (tries < 30 && Math.hypot(x - soul.x, y - soul.y) < 30);
          bullets.push(new Fish({ x, y, angle: Math.atan2(soul.y - y, soul.x - x), speed: 105, warn: 0.6, soul, box }));
        }
      },
    };
  },
};
