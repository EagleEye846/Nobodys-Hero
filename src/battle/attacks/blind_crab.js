import { defineBulletArt, Shot } from '../projectiles.js';
import { rand, clamp } from '../patternTools.js';
import { Deco, Guide, blit } from './coastKit.js';

// The Blind Grotto Crab's attacks. A huge white cave crab with no eyes at all,
// only feelers, sitting to the right of the box:
//   - Feelers: it reads where you WERE. Pale feelers reach in from the right
//     edge and follow the exact path you walked, a little behind you. Keep
//     moving and they trail after you; stand still, or double back over your
//     own path, and the tip catches up.
//   - Pearls: it spits cave-pearls. A big one, aimed (and locked a moment
//     before it leaves), that bursts into a ring of seed pearls; then a fan of
//     three that ricochet off the walls.
//   - Knock: it knocks on the roof of the cave with a claw. Shadows grow on the
//     floor, a moment later stalactites fall on them, with drips and grit.
// Every bullet is its own: pearls, feeler beads, stalactites, drips, grit.

const PAL = { k: '#141a26', w: '#f2f6f6', W: '#d3e0e4', s: '#a3bac6', S: '#728fa4', p: '#f6d2e4', P: '#bf86ac', t: '#ffffff', c: '#9fdcf0', C: '#4f9cc0', g: '#cfd8dc', G: '#7c8a94' };

// A cave-pearl: pink-white and shiny, a glint that sweeps across it.
defineBulletArt('grottoPearl', {
  frames: [
    ['..ppp..', '.pttpp.', 'ptppppP', 'ppppppP', 'ppppPPP', '.pPPPP.', '..PPP..'],
    ['..ppp..', '.ppppp.', 'pppttpP', 'ppptppP', 'ppppPPP', '.pPPPP.', '..PPP..'],
  ],
  palette: PAL,
  radius: 3.2,
  frameSeconds: 0.18,
});

// A seed pearl: the small ones a big pearl bursts into.
defineBulletArt('grottoSeed', {
  frames: [['.ppP.', 'pptpP', 'ppppP', 'pppPP', '.PPP.']],
  palette: PAL,
  radius: 2,
});

// A stalactite: grey-white cave rock, a long point downward, wet at the tip.
defineBulletArt('grottoStalactite', {
  frames: [
    ['.gggg.', 'gwwgGG', 'gwwgGG', '.gwgG.', '.gwgG.', '..gGG.', '..gGG.', '...GG.', '...cG.', '...C..'],
  ],
  palette: PAL,
  hitbox: { w: 4, h: 9 },
});

// A drip off the roof: a blue-white drop.
defineBulletArt('grottoDrip', {
  frames: [['.c.', 'ccc', 'cCc', '.C.']],
  palette: PAL,
  radius: 1.6,
});

// A bit of grit knocked loose: a pale chip that tumbles.
defineBulletArt('grottoGrit', {
  frames: [['gwg', 'wgG', '.G.']],
  palette: PAL,
  radius: 1.5,
  spin: 5,
});

// The tip of a feeler and a length of it, only drawn (the feeler hurts along its chain).
const TIP = ['.PPP.', 'PpttP', 'Ppppp', 'PpppP', '.PPP.'];
const BEAD = ['.W.', 'WwW', '.W.'];
const FEELER_PAL = { P: '#d9a6bf', p: '#fbe7f0', t: '#ffffff', W: '#e2eef0', w: '#f6fbfb', k: '#141a26' };

const smooth = (u) => u * u * (3 - 2 * u);

// What the soul has walked, kept as it goes: trailAt(time) is where it was then.
class Trail {
  constructor() {
    this.pts = [];
  }

  push(t, x, y) {
    this.pts.push({ t, x, y });
    while (this.pts.length > 400) this.pts.shift();
  }

  at(t) {
    const p = this.pts;
    if (!p.length) return { x: 0, y: 0 };
    if (t <= p[0].t) return p[0];
    for (let i = p.length - 1; i > 0; i--) {
      if (p[i - 1].t <= t) {
        const u = (t - p[i - 1].t) / Math.max(1e-6, p[i].t - p[i - 1].t);
        return { x: p[i - 1].x + (p[i].x - p[i - 1].x) * Math.min(1, u), y: p[i - 1].y + (p[i].y - p[i - 1].y) * Math.min(1, u) };
      }
    }
    return p[p.length - 1];
  }
}

// One feeler: a chain of beads that comes in from an anchor on the right edge and follows the soul's
// trail, the tip `lag` seconds behind it and each bead a little further behind that.
class Feeler {
  constructor({ trail, clock, anchor, warn, life, lag, beads = 6 }) {
    Object.assign(this, { trail, clock, anchor, warn, life, lag, beads });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.pos = Array.from({ length: beads }, () => ({ x: anchor.x, y: anchor.y }));
    this.out = 0;
  }

  get active() {
    return this.age >= this.warn && this.age < this.warn + this.life && this.out > 0.85;
  }

  update(dt) {
    this.age += dt;
    const k = this.age - this.warn;
    // How far out it has come: reaching in (0.55 s), then drawing back (0.45 s) at the end.
    this.out = k < 0 ? 0 : k < this.life - 0.45 ? smooth(clamp(k / 0.55, 0, 1)) : smooth(clamp((this.life - k) / 0.45, 0, 1));
    const now = this.clock.t;
    for (let i = 0; i < this.beads; i++) {
      const goal = this.trail.at(now - this.lag - i * 0.07);
      const e = clamp(this.out * 1.15 - i * 0.04, 0, 1);
      this.pos[i].x = this.anchor.x + (goal.x - this.anchor.x) * e;
      this.pos[i].y = this.anchor.y + (goal.y - this.anchor.y) * e;
    }
  }

  isGone() {
    return this.age >= this.warn + this.life + 0.1;
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    let best = Infinity;
    for (let i = 0; i < this.beads; i++) {
      const r = i === 0 ? 3 : 2.2;
      best = Math.min(best, Math.hypot(px - this.pos[i].x, py - this.pos[i].y) - r);
      if (i > 0) {
        const a = this.pos[i - 1];
        const b = this.pos[i];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const l2 = dx * dx + dy * dy;
        if (l2 > 0.01) {
          const u = clamp(((px - a.x) * dx + (py - a.y) * dy) / l2, 0, 1);
          best = Math.min(best, Math.hypot(px - (a.x + dx * u), py - (a.y + dy * u)) - 1.4);
        }
      }
    }
    return best;
  }

  draw(ctx) {
    if (this.age < this.warn) return;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // The faint thread back to the edge it came in by (harmless).
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = '#e2eef0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.anchor.x, this.anchor.y);
    const last = this.pos[this.beads - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    // The feeler itself: a dark rim and a pale core, bead to bead.
    for (const [col, w] of [['#141a26', 3.4], ['#e8f2f4', 1.8]]) {
      ctx.strokeStyle = col;
      ctx.lineWidth = w;
      ctx.beginPath();
      this.pos.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
    }
    for (let i = this.beads - 1; i >= 1; i--) blit(ctx, BEAD, FEELER_PAL, this.pos[i].x, this.pos[i].y);
    blit(ctx, TIP, FEELER_PAL, this.pos[0].x, this.pos[0].y);
    ctx.restore();
  }
}

// Little bits knocked off where a stalactite lands.
function grit(bullets, x, y, n) {
  for (let i = 0; i < n; i++) {
    const side = i % 2 ? 1 : -1;
    bullets.push(new Shot({ x, y: y - 1, vx: side * rand(14, 34), vy: -rand(40, 80), gravity: 230, art: 'grottoGrit', life: 0.8 }));
  }
}

export const BLIND_CRAB_ATTACKS = {
  // Feelers: three of them, one after another, each following the path you walked a moment ago.
  crabFeelers(box, density) {
    const trail = new Trail();
    const clock = { t: 0 };
    let real = 0;
    let n = 0;
    let first = true;
    const anchors = [0.3, 0.72, 0.48].map((f) => ({ x: box.x + box.w + 7, y: box.y + box.h * f }));
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        const step = dt / density;
        real += step;
        clock.t = real;
        if (first) {
          first = false;
          trail.push(-5, soul.x, soul.y);
        }
        trail.push(real, soul.x, soul.y);
        if (n < 3 && real >= 0.15 + n * 2.1) {
          const anchor = anchors[n % anchors.length];
          n++;
          // Shows where it's reaching for, a moment before it comes in.
          const a = Math.atan2(soul.y - anchor.y, soul.x - anchor.x);
          bullets.push(new Guide({ x: anchor.x, y: anchor.y, angle: a, length: Math.hypot(soul.x - anchor.x, soul.y - anchor.y), warn: 0.6, color: '#e8f2f4' }));
          bullets.push(new Feeler({ trail, clock, anchor, warn: 0.6, life: 3.1, lag: 0.8 - Math.min(0.1, n * 0.03) }));
        }
      },
    };
  },

  // Pearls: spits a big one at you (it bursts into seeds), then a fan of three that ricochet.
  crabSpit(box, density) {
    let real = 0;
    let n = 0;
    const bursts = [];
    const mouthX = box.x + box.w + 5;
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        const step = dt / density;
        real += step;
        if (n < 6 && real >= 0.2 + n * 1.1) {
          const oy = box.y + box.h * [0.3, 0.55, 0.78, 0.42, 0.65, 0.35][n];
          const big = n % 2 === 0;
          n++;
          // Aimed at where you are heading a little ahead; locked as it leaves.
          const tx = soul.x;
          const ty = soul.y;
          const a = Math.atan2(ty - oy, tx - mouthX);
          const WARN = 0.5;
          bullets.push(new Guide({ x: mouthX, y: oy, angle: a, length: 70, warn: WARN, color: '#fbe7f0' }));
          if (big) {
            const speed = 48;
            const pearl = new Shot({ x: mouthX, y: oy, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, art: 'grottoPearl', warn: WARN, bounce: true });
            bullets.push(pearl);
            bursts.push({ at: real + WARN + 1.05, pearl });
          } else {
            for (const off of [-0.4, 0, 0.4]) {
              bullets.push(new Shot({ x: mouthX, y: oy, vx: Math.cos(a + off) * 42, vy: Math.sin(a + off) * 42, art: 'grottoSeed', warn: WARN, bounce: true, life: 2.6 }));
            }
          }
        }
        for (let i = bursts.length - 1; i >= 0; i--) {
          const b = bursts[i];
          if (real < b.at) continue;
          bursts.splice(i, 1);
          const { x, y } = b.pearl;
          b.pearl.life = 0;
          const turn = rand(0, Math.PI);
          for (let k = 0; k < 6; k++) {
            const a = turn + (k / 6) * Math.PI * 2;
            bullets.push(new Shot({ x, y, vx: Math.cos(a) * 34, vy: Math.sin(a) * 34, art: 'grottoSeed', life: 1.6 }));
          }
        }
      },
    };
  },

  // Knock: a claw on the roof. Shadows grow on the floor, then stalactites come down on them.
  crabKnock(box, density) {
    let real = 0;
    let n = 0;
    const falls = [];
    const floor = box.y + box.h - 5;
    const drips = [];
    return {
      duration: 7.6,
      update: (dt, bullets, soul) => {
        const step = dt / density;
        real += step;
        if (n < 4 && real >= 0.3 + n * 1.75) {
          n++;
          // One where you stand, the others spread away from it and from each other.
          const xs = [clamp(soul.x + rand(-8, 8), box.x + 8, box.x + box.w - 8)];
          for (let tries = 0; tries < 30 && xs.length < 3; tries++) {
            const x = rand(box.x + 8, box.x + box.w - 8);
            if (xs.every((o) => Math.abs(o - x) > 17)) xs.push(x);
          }
          const WARN = 0.85;
          bullets.push(new Deco({ life: WARN + 0.15, paint(ctx, d) {
            // The knock: a few dust marks jumping on the roof line.
            const k = Math.min(1, d.age / 0.25);
            ctx.fillStyle = '#d3e0e4';
            for (let i = 0; i < 9; i++) ctx.fillRect(box.x + 4 + i * 9, box.y + 1 + ((i + Math.floor(d.age * 12)) % 3) * k, 2, 1);
          } }));
          for (const x of xs) {
            bullets.push(new Deco({ life: WARN, paint(ctx, d) {
              const g = Math.min(1, d.age / WARN);
              ctx.globalAlpha *= (Math.floor(d.age * 12) % 2 ? 0.45 : 0.75);
              ctx.fillStyle = '#05080e';
              ctx.beginPath();
              ctx.ellipse(x, floor + 2, 2 + 6 * g, 1 + 2 * g, 0, 0, Math.PI * 2);
              ctx.fill();
              // A thin dust line from the roof, so you can see which way it's coming.
              ctx.fillStyle = '#c9d6dc';
              for (let yy = box.y + 3; yy < floor - 4; yy += 9) ctx.fillRect(Math.round(x), yy + ((Math.floor(d.age * 14)) % 3), 1, 2);
            } }));
            falls.push({ at: real + WARN, x });
          }
          // A few drips between, so the gaps aren't entirely safe.
          for (let i = 0; i < 3; i++) drips.push({ at: real + WARN + 0.15 + i * 0.28, x: rand(box.x + 6, box.x + box.w - 6) });
        }
        for (let i = falls.length - 1; i >= 0; i--) {
          if (real < falls[i].at) continue;
          const f = falls.splice(i, 1)[0];
          const rock = new Shot({ x: f.x, y: box.y - 2, vx: 0, vy: 30, accel: 0, gravity: 260, art: 'grottoStalactite' });
          rock.floor = floor;
          bullets.push(rock);
        }
        for (let i = drips.length - 1; i >= 0; i--) {
          if (real < drips[i].at) continue;
          const d = drips.splice(i, 1)[0];
          bullets.push(new Shot({ x: d.x, y: box.y + 2, vx: 0, vy: 46, art: 'grottoDrip' }));
        }
        // A stalactite that reaches the floor breaks into grit.
        for (const b of bullets) {
          if (b.floor && !b.broke && b.y >= b.floor) {
            b.broke = true;
            b.life = 0;
            b.vy = 0;
            grit(bullets, b.x, b.floor, 4);
          }
        }
      },
    };
  },
};
