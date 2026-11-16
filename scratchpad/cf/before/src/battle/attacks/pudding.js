import { defineBulletArt, Shot } from '../projectiles.js';
import { defineGuardianStar } from './guardianStar.js';

// The PALE OLM's attacks (code id `pudding`): the guardian of Seam Nine (src/data/enemies/pudding.js).
// The miners' tea-break mascot, grown huge and see-through round a fallen
// star, swimming through solid rock as if it were water. Everything it throws
// is either the olm (gill-light, glass bubbles, its tail, its hiccups, stone
// thrown up as it dives), the star in its belly (rings of light, gold stars),
// or the tea break it is still waiting for (seven tin mugs, flung).
//
//   puddingGills    its gills fan out three rays of light that sweep (phase 1)
//   puddingSwim     it dives under the floor: ripples, then stone leaps out
//   puddingBubbles  glass bubbles drift up, then burst into rings of shards
//   puddingTail     its tail snakes through the box as a chain of crystal
//   puddingStar     the star pulses: rings of light with one gap, gold stars
//   puddingHiccup   a swelling bubble, a HIC, and crystal sprayed anywhere
//   puddingTea      seven tin mugs lobbed at where you are, splashing
//   puddingChaos    (phase 3) two or three of the above at once, swapped
//                   every few seconds, each at its own speed
//   puddingShatter  (the finale) the glass goes all at once, in three stages
//
// The olm sits to the right of the box. Each attack is a factory
// `(box, density, tools) => ({ duration, update })` (see dummy.js). Custom
// bullets here (the rays, the rings) have the same four methods as Shot:
// update, isGone, edgeDistance, draw. Their motion runs on the battle's own
// clock, so each attack is tuned for the olm's speed directly.

// ---------------------------------------------------------------------------
// Bullet art

const GLASS = { w: '#f4ffff', c: '#b0f0ff', g: '#bfeee8', G: '#7cc8d4', z: '#3f86a8', Z: '#245070' };
const GOLD = { y: '#ffe9a0', s: '#ffd95a', S: '#fff6c8', Y: '#d9a03a' };
const TIN = { e: '#f4f4f8', t: '#b8bcc8', T: '#7a8090', b: '#6a3a1a', B: '#c88a4a' };
const STONE = { r: '#4a3a52', R: '#7a6684', t: '#a898b4', m: '#1a0c18' };

defineBulletArt('pudShard', {
  frames: [['.......cc..', '.ccccwwwwwc', '.GGGGGGzzz.', '.......zz..']],
  palette: GLASS,
  radius: 2,
  rotate: true,
});
defineBulletArt('pudShardBig', {
  frames: [['.........ww..', '..cccccwwwwwc', 'cwwwwwwwwwwcc', '.GGGGGGGGzzzz', '.......zzZZ..']],
  palette: GLASS,
  radius: 3,
  rotate: true,
});
defineBulletArt('pudBubble', {
  frames: [
    ['..cccc..', '.cwwggc.', 'cwgGGGGc', 'cgGGGGzc', 'cgGGGzzc', 'cGGGzzZc', '.czzZZc.', '..cccc..'],
    ['..cccc..', '.cwggGc.', 'cwgGGGGc', 'cgGGGGzc', 'cGGGGzzc', 'cGGzzzZc', '.czzZZc.', '..cccc..'],
  ],
  palette: GLASS,
  radius: 3.6,
  frameSeconds: 0.3,
});
defineBulletArt('pudBead', {
  frames: [['..cc..', '.cwwc.', 'cwwGGc', 'cwGGzc', '.czzc.', '..cc..']],
  palette: GLASS,
  radius: 2.6,
  spin: 2,
});
defineBulletArt('pudStar', {
  frames: [['...y...', '...s...', '..ysy..', 'ysSSSsy', '..ysy..', '...s...', '...y...']],
  palette: GOLD,
  radius: 2.6,
  spin: 3,
});
defineBulletArt('pudStarBig', {
  frames: [[
    '....y....', '....s....', '...ysy...', '...sSs...', 'ysssSsssy', '...sSs...', '...ysy...', '....s....', '....y....',
  ]],
  palette: GOLD,
  radius: 3.4,
  spin: 2,
});
defineBulletArt('pudMug', {
  frames: [['.eeeeee..', '.tTTTTt..', '.tTTTTttt', '.tTTTTt.t', '.tTTTTt.t', '.tTTTTttt', '.tTTTTt..', '..tttt...']],
  palette: TIN,
  radius: 3.2,
  spin: 5,
});
defineBulletArt('pudTea', {
  frames: [['.b.', 'bBb', '.b.']],
  palette: TIN,
  radius: 1.5,
});
defineBulletArt('pudRock', {
  frames: [['.rRr.', 'rRRrr', 'rRrrm', '.rrm.', '..m..']],
  palette: STONE,
  radius: 2.6,
  spin: 3,
});
// Where a rock is about to leap from: stone rippling (harmless).
defineBulletArt('pudRipple', {
  frames: [
    ['..ttt..', '.t...t.', 'R.....R'],
    ['.ttttt.', 't.....t', '.R...R.'],
  ],
  palette: STONE,
  radius: 1,
  frameSeconds: 0.18,
});
// A glint of light (harmless): where something is about to come from.
defineBulletArt('pudSpark', {
  frames: [
    ['..w..', '..w..', 'wwSww', '..w..', '..w..'],
    ['.w.w.', '..c..', '.cSc.', '..c..', '.w.w.'],
  ],
  palette: { w: '#ffffff', S: '#fff6c8', c: '#b0f0ff' },
  radius: 1,
  frameSeconds: 0.1,
});
// The hiccup coming: a bubble swelling in the throat (harmless).
defineBulletArt('pudHic', {
  frames: [
    ['.cc.', 'cwGc', 'cGzc', '.cc.'],
    ['..cccc..', '.cwwggc.', 'cwgGGGGc', 'cgGGGGzc', '.czzZZc.', '..cccc..'],
    ['...cccc...', '..cwwwggc..', '.cwgGGGGGc.', 'cwgGGGGGGzc', 'cgGGGGGGzzc', '.cGGGGzzZc.', '..czzzZZc..', '...cccccc...'],
  ],
  palette: GLASS,
  radius: 1,
  frameSeconds: 0.18,
});
// Where a mug will come down (harmless).
defineBulletArt('pudMark', {
  frames: [['..bbbbb..', '.b.....b.', '..bbbbb..'], ['.bbbbbbb.', 'b.......b', '.bbbbbbb.']],
  palette: TIN,
  radius: 1,
  frameSeconds: 0.2,
});
// A chip of stone knocked off where a rock lands.
defineBulletArt('pudChip', {
  frames: [['.rR.', 'rRRr', '.rm.']],
  palette: STONE,
  radius: 1.7,
  spin: 4,
});
// The Falling Star (the guardians' tune, E B B-flat E, see src/data/music/parts/starGuardians.js):
// a star of glass, one of four that fall in the tune's shape.
defineGuardianStar('pudGlassStar', { radius: 2.8 });
defineBulletArt('pudSteam', {
  frames: [['.e.', 'eee', '.e.']],
  palette: { e: '#e8eef4' },
  radius: 1,
});

// ---------------------------------------------------------------------------
// Custom bullets

const segmentDistance = (px, py, ax, ay, bx, by) => {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
  return Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
};

// A ray of light from one of its gills, pivoting about a point at the olm's
// side of the box and sweeping to and fro. It warns first (a thin dashed
// line where it will start), then burns.
class GillRay {
  constructor({ ox, oy, center, amp, w, length = 128, thick = 4, warn = 0.9, life = 3.4, tint = 0 }) {
    Object.assign(this, { ox, oy, center, amp, w, length, thick, warn, life, tint });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.vx = 0;
    this.vy = 0;
  }

  get active() { return this.age >= this.warn && this.age < this.warn + this.life; }

  get angle() { return this.center + this.amp * Math.sin(this.w * Math.max(0, this.age - this.warn)); }

  update(dt) { this.age += dt; }

  isGone() { return this.age >= this.warn + this.life + 0.25; }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const a = this.angle;
    return segmentDistance(px, py, this.ox, this.oy, this.ox + Math.cos(a) * this.length, this.oy + Math.sin(a) * this.length) - this.thick / 2;
  }

  draw(ctx) {
    const a = this.angle;
    const x1 = this.ox + Math.cos(a) * this.length;
    const y1 = this.oy + Math.sin(a) * this.length;
    ctx.save();
    ctx.lineCap = 'round';
    if (this.age < this.warn) {
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.25 : 0.6;
      ctx.strokeStyle = '#b0f0ff';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath(); ctx.moveTo(this.ox, this.oy); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.restore();
      return;
    }
    const over = this.age - (this.warn + this.life);
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
    const colors = [['#7cf0ff', '#e8ffff'], ['#ffb8e0', '#fff0fa'], ['#ffe9a0', '#fffbe8']][this.tint % 3];
    ctx.shadowColor = colors[0];
    ctx.shadowBlur = 6;
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = this.thick;
    ctx.beginPath(); ctx.moveTo(this.ox, this.oy); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = colors[1];
    ctx.lineWidth = Math.max(1, this.thick - 2.5);
    ctx.beginPath(); ctx.moveTo(this.ox, this.oy); ctx.lineTo(x1, y1); ctx.stroke();
    // Feathers: little barbs along it, so it reads as a gill and not a laser.
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 1;
    const nx = -Math.sin(a);
    const ny = Math.cos(a);
    for (let d = 14; d < this.length - 6; d += 9) {
      const bx = this.ox + Math.cos(a) * d;
      const by = this.oy + Math.sin(a) * d;
      const barb = 3 + 2 * Math.sin(d * 0.2 + this.age * 8);
      ctx.beginPath();
      ctx.moveTo(bx, by); ctx.lineTo(bx + nx * barb - Math.cos(a) * 2, by + ny * barb - Math.sin(a) * 2);
      ctx.moveTo(bx, by); ctx.lineTo(bx - nx * barb - Math.cos(a) * 2, by - ny * barb - Math.sin(a) * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// A ring of the star's light, spreading out from the belly with one gap in
// it. It warns as a star swelling at its centre, then spreads.
class StarRing {
  constructor({ cx, cy, gap, half = 0.5, speed = 50, thick = 3, warn = 0.8, color = '#ffd95a' }) {
    Object.assign(this, { cx, cy, gap, half, speed, thick, warn, color });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.vx = 0;
    this.vy = 0;
  }

  get active() { return this.age >= this.warn; }

  get radius() { return 6 + (this.age - this.warn) * this.speed; }

  update(dt) { this.age += dt; }

  isGone() { return this.age > this.warn && this.radius > 150; }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const dx = px - this.cx;
    const dy = py - this.cy;
    const turn = Math.atan2(dy, dx) - this.gap;
    const diff = Math.abs(Math.atan2(Math.sin(turn), Math.cos(turn)));
    if (diff < this.half) return Infinity;
    return Math.abs(Math.hypot(dx, dy) - this.radius) - this.thick / 2;
  }

  draw(ctx) {
    ctx.save();
    if (this.age < this.warn) {
      // The star swelling, before it goes.
      const s = 2 + (this.age / this.warn) * 5;
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.4 : 0.9;
      ctx.fillStyle = '#fff6c8';
      ctx.beginPath();
      ctx.moveTo(this.cx - s, this.cy); ctx.lineTo(this.cx, this.cy - s * 1.5); ctx.lineTo(this.cx + s, this.cy); ctx.lineTo(this.cx, this.cy + s * 1.5);
      ctx.closePath(); ctx.fill();
      ctx.restore();
      return;
    }
    const r = this.radius;
    ctx.strokeStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 5;
    ctx.lineWidth = this.thick;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, r, this.gap + this.half, this.gap - this.half + Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#fffbe8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, r, this.gap + this.half, this.gap - this.half + Math.PI * 2);
    ctx.stroke();
    // Points of the star riding the ring, so it is a star's light and not a hoop.
    ctx.fillStyle = '#fffbe8';
    for (let k = 0; k < 14; k++) {
      const a = this.gap + this.half + ((Math.PI * 2 - this.half * 2) * (k + 0.5)) / 14;
      ctx.fillRect(Math.round(this.cx + Math.cos(a) * (r + 3)), Math.round(this.cy + Math.sin(a) * (r + 3)), 1, 1);
    }
    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// The attacks

const rightEdge = (box) => box.x + box.w;
const floorOf = (box) => box.y + box.h - 3;

export const PUDDING_ATTACKS = {
  // Its gills fan out: three rays of light from the olm's side of the box, a
  // gap of dark between each, sweeping slowly to and fro. Find the dark and
  // ride it. Each fan lasts a few seconds, then another opens a little
  // higher or lower and a different colour.
  puddingGills(box, density, { rand, pick, shuffleBag }) {
    let clock = 0;
    let fans = 0;
    const tint = shuffleBag([0, 1, 2]);
    const open = (bullets) => {
      const t = tint();
      // The big fan from the olm's side: four rays, sweeping.
      const oy = box.y + box.h * rand(0.3, 0.7);
      const ox = rightEdge(box) + 8;
      const w = rand(1.2, 1.6) * pick([1, -1]);
      for (const off of [-1.0, -0.33, 0.33, 1.0]) {
        bullets.push(new GillRay({ ox, oy, center: Math.PI + off * 0.9, amp: 0.4, w, warn: 0.85, life: 3.3, tint: t }));
      }
      // And a smaller fan up through the floor, crossing it.
      const bx = box.x + box.w * rand(0.2, 0.8);
      const wb = rand(1.1, 1.5) * pick([1, -1]);
      bullets.push(new GillRay({ ox: bx, oy: box.y + box.h + 8, center: -Math.PI / 2 + pick([-0.3, 0.3]), amp: 0.35, w: wb, length: 118, warn: 1.3, life: 2.8, tint: (t + 1) % 3 }));
      fans++;
    };
    return {
      duration: 9,
      update(dt, bullets) {
        clock += dt;
        if (fans === 0 || (clock > fans * 3.9 && fans < 3)) open(bullets);
      },
    };
  },

  // It dives. Ripples run along the floor (stone shivering where it will
  // come out), a moment later each one throws a chunk of rock up like a fish
  // leaping, arcing over and falling back, and chips fly off where it lands.
  // Every fourth dive is a WAKE: the ripples run across the whole floor in a
  // line, one after another, with a gap or two left in it, and now and then
  // it passes overhead and rocks drop out of the roof where you stand.
  puddingSwim(box, density, { every, rand, pick, spreadAcross, clamp }) {
    const lane = spreadAcross(box.x + 6, box.x + box.w - 6, 6);
    const live = [];
    let waves = 0;
    const erupt = (bullets, x, warn, vx, vy) => {
      bullets.push(new Shot({ x, y: floorOf(box) + 1, art: 'pudRipple', harmless: true, warn, life: 0.1 }));
      const rock = new Shot({ x, y: floorOf(box) - 1, vx, vy: -vy, gravity: 150, art: 'pudRock', warn });
      bullets.push(rock);
      live.push({ rock, up: false });
    };
    const wave = every(1.0, 1.15, (bullets, soul) => {
      waves++;
      if (waves % 4 === 0) {
        // The wake: a line of ripples sweeping across, a gap or two left.
        const dir = pick([1, -1]);
        const cols = 10;
        const gap = Math.floor(rand(1, cols - 3));
        for (let i = 0; i < cols; i++) {
          if (i === gap || i === gap + 1) continue;
          const x = box.x + 6 + ((dir === 1 ? i : cols - 1 - i) * (box.w - 12)) / (cols - 1);
          erupt(bullets, x, 0.7 + i * 0.07, 0, rand(112, 128));
        }
        return;
      }
      const count = 6 + (Math.random() < 0.5 ? 1 : 0);
      const taken = [];
      for (let i = 0; i < count; i++) {
        const x = i < 3 ? clamp(soul.x + rand(-5, 5) + i * pick([-12, 12]), box.x + 6, box.x + box.w - 6) : lane();
        if (taken.some((t) => Math.abs(t - x) < 7)) continue;
        taken.push(x);
        erupt(bullets, x, 0.7, rand(-26, 26), rand(120, 170));
      }
      // Overhead: it passes over, and the roof drops rock where you stand.
      if (waves % 4 === 2) {
        for (const off of [0, pick([-18, 18])]) {
          const x = clamp(soul.x + off + rand(-3, 3), box.x + 5, box.x + box.w - 5);
          bullets.push(new Shot({ x, y: box.y + 1, art: 'pudRipple', harmless: true, warn: 0.75, life: 0.1 }));
          const rock = new Shot({ x, y: box.y + 2, vy: 14, gravity: 150, art: 'pudRock', warn: 0.75 });
          bullets.push(rock);
          live.push({ rock, up: true, falling: true });
        }
      }
    });
    return {
      duration: 11,
      update(dt, bullets, soul) {
        wave(dt, bullets, soul);
        for (let i = live.length - 1; i >= 0; i--) {
          const r = live[i];
          if (r.rock.age < r.rock.warn) continue;
          // A rock landing breaks into chips, thrown out low along the floor.
          if (r.rock.vy > 0 && r.rock.y >= floorOf(box) - 1) {
            live.splice(i, 1);
            r.rock.life = Math.max(0, r.rock.age - r.rock.warn);
            for (let k = 0; k < 2; k++) {
              const s = k % 2 ? 1 : -1;
              bullets.push(new Shot({ x: r.rock.x, y: floorOf(box) - 1, vx: s * rand(34, 70), vy: -rand(40, 90), gravity: 150, art: 'pudChip', life: 1.2 }));
            }
          } else if (r.rock.age > 5) live.splice(i, 1);
        }
      },
    };
  },

  // Glass bubbles drift up off the floor, slow and pretty. Each bursts, not
  // quite where you'd think, into a ring of shards: a fast ring and, a beat
  // behind it, a slower ring turned half a step between its shards, so the
  // gaps in the first are shut by the second.
  puddingBubbles(box, density, { every, rand, spreadAcross }) {
    const lane = spreadAcross(box.x + 10, box.x + box.w - 10, 5);
    const live = [];
    const spawn = every(0.62, 0.8, (bullets) => {
      const bubble = new Shot({ x: lane(), y: box.y + box.h + 4, vy: -rand(26, 38), vx: rand(-7, 7), art: 'pudBubble', wobble: { amplitude: 3, frequency: 3 } });
      bullets.push(bubble);
      live.push({ bubble, burst: rand(1.2, 1.75) });
    });
    return {
      duration: 11,
      update(dt, bullets) {
        spawn(dt, bullets);
        for (let i = live.length - 1; i >= 0; i--) {
          const b = live[i];
          if (b.bubble.age < b.burst) continue;
          live.splice(i, 1);
          const { x, y } = b.bubble;
          b.bubble.life = Math.max(0, b.bubble.age - b.bubble.warn);
          bullets.push(new Shot({ x, y, art: 'pudSpark', harmless: true, life: 0.2 }));
          const turn = rand(0, Math.PI);
          for (let k = 0; k < 8; k++) {
            const a = turn + (k * Math.PI * 2) / 8;
            bullets.push(new Shot({ x, y, vx: Math.cos(a) * 56, vy: Math.sin(a) * 56, art: 'pudShard', life: 3 }));
          }
          for (let k = 0; k < 8; k++) {
            const a = turn + Math.PI / 8 + (k * Math.PI * 2) / 8;
            bullets.push(new Shot({ x, y, vx: Math.cos(a) * 34, vy: Math.sin(a) * 34, art: 'pudShard', life: 3, warn: 0.12 }));
          }
        }
      },
    };
  },

  // Its tail comes through the box from the side as strings of crystal
  // beads, snaking up and down as it goes. A glint at the edge shows where
  // each will start; three come at once, two from one end and one from the
  // other, wavering against each other (and a fourth rises through the
  // floor on every other lash), so there is always a gap but never the same
  // one.
  puddingTail(box, density, { every, rand, shuffleBag }) {
    const side = shuffleBag([1, -1]);
    let lashes = 0;
    const lash = (bullets, soul) => {
      const dir = side();
      lashes++;
      for (const flip of [1, -1, 2]) {
        const from = flip === 2 ? -dir : dir;
        const x = from === 1 ? rightEdge(box) + 3 : box.x - 3;
        const y = Math.max(box.y + 10, Math.min(box.y + box.h - 10, soul.y + (flip === 1 ? rand(-5, 5) : flip === 2 ? rand(-28, 28) : rand(14, 24) * (Math.random() < 0.5 ? 1 : -1))));
        const amp = rand(14, 20) * (Math.random() < 0.5 ? 1 : -1);
        bullets.push(new Shot({ x: from === 1 ? x - 5 : x + 5, y, art: 'pudSpark', harmless: true, warn: 0.6, life: 0.1 }));
        for (let k = 0; k < 13; k++) {
          bullets.push(new Shot({ x, y, vx: -from * 90, art: 'pudBead', wobble: { amplitude: amp, frequency: 4.6 }, warn: 0.7 + k * 0.09 }));
        }
      }
      // A tail-tip up through the floor (or down from the roof) on every lash,
      // close to where you stand: sitting still or running the edges isn't
      // enough on its own (13 November 2026: the cheese check found a lazy
      // way through it at one hit a turn).
      {
        const up = lashes % 2 === 1;
        const x = Math.max(box.x + 8, Math.min(box.x + box.w - 8, soul.x + rand(-10, 10)));
        bullets.push(new Shot({ x, y: up ? box.y + box.h - 2 : box.y + 2, art: 'pudSpark', harmless: true, warn: 0.6, life: 0.1 }));
        for (let k = 0; k < 9; k++) {
          bullets.push(new Shot({ x, y: up ? box.y + box.h + 3 : box.y - 3, vy: up ? -74 : 74, art: 'pudBead', wobble: { amplitude: 9, frequency: 4 }, warn: 0.7 + k * 0.1 }));
        }
      }
    };
    const step = every(0.9, 1.05, lash, { first: 0.2 });
    return { duration: 11, update: (dt, bullets, soul) => step(dt, bullets, soul) };
  },

  // The star in its belly pulses. It swells where you can see it, then a
  // ring of gold light spreads out from it with a gap in the ring; the gap
  // wanders a little each time. A few gold stars drift after you in between.
  puddingStar(box, density, { rand, pick, angleTo }) {
    let clock = 0;
    let pulses = 0;
    let stars = 0;
    const cx = rightEdge(box) + 16;
    const cy = box.y + box.h * 0.5;
    let gap = Math.PI + rand(-0.5, 0.5);
    return {
      duration: 11,
      update(dt, bullets, soul) {
        clock += dt;
        if (clock > pulses * 1.7 && pulses < 7) {
          const half = 0.47 - Math.min(0.05, pulses * 0.012);
          bullets.push(new StarRing({ cx, cy: cy + rand(-10, 10), gap, half, speed: 62 }));
          if (pulses % 2 === 1) bullets.push(new StarRing({ cx, cy: cy + rand(-10, 10), gap: gap + pick([-1, 1]) * rand(0.5, 0.8), half, speed: 62, warn: 1.1, color: '#ffb8e0' }));
          gap = Math.PI + Math.max(-0.75, Math.min(0.75, gap - Math.PI + pick([-1, 1]) * rand(0.35, 0.7)));
          pulses++;
        }
        if (clock > 0.6 + stars * 0.85 && stars < 13) {
          stars++;
          const a = angleTo({ x: cx, y: cy }, soul) + rand(-0.4, 0.4);
          bullets.push(new Shot({ x: cx - 8, y: cy, vx: Math.cos(a) * 50, vy: Math.sin(a) * 50, art: 'pudStar', warn: 0.4, life: 4, homing: { target: soul, turn: 1.1 } }));
        }
      },
    };
  },

  // The olm hiccups. A bubble swells in its throat at the edge of the box,
  // a pause, then HIC: crystal sprayed every which way, some of it down the
  // middle and a good deal of it at you. Often twice in a row, and the
  // second one is quicker than you think.
  puddingHiccup(box, density, { every, rand }) {
    const hic = (bullets, soul) => {
      const y = rand(box.y + 14, box.y + box.h - 14);
      const x = rightEdge(box) - 4;
      const times = Math.random() < 0.5 ? 2 : 1;
      for (let n = 0; n < times; n++) {
        const delay = 0.45 + n * 0.32;
        const toward = Math.atan2(soul.y - y, soul.x - x);
        bullets.push(new Shot({ x, y, art: 'pudHic', harmless: true, warn: delay, life: 0.2 }));
        for (let k = 0; k < 19; k++) {
          const a = k < 7 ? toward + rand(-0.6, 0.6) : Math.PI + rand(-1.35, 1.35);
          const speed = rand(60, 135);
          bullets.push(new Shot({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, gravity: 35, art: Math.random() < 0.25 ? 'pudShardBig' : 'pudShard', warn: delay, life: 3 }));
        }
      }
    };
    const step = every(0.85, 1.0, hic, { first: 0.2 });
    return { duration: 11, update: (dt, bullets, soul) => step(dt, bullets, soul) };
  },

  // The miners' seven mugs, thrown. Each is lobbed from the olm's side to
  // come down where you are now: a ring on the floor shows where. Three at a
  // time: one on you, one a few steps to a side, and one on the wall or
  // corner you are nearest (so there is nowhere to stand and wait). Tea
  // splashes up and out when one lands, high enough to reach the roof. The
  // steam rises off them, to be fair.
  puddingTea(box, density, { rand }) {
    let clock = 0;
    let thrown = 0;
    const live = [];
    const G = 110;
    const midX = box.x + box.w / 2;
    return {
      duration: 11,
      update(dt, bullets, soul) {
        clock += dt;
        if (clock > 0.25 + thrown * 1.45 && thrown < 7) {
          thrown++;
          const sx = rightEdge(box) + 6;
          const fy = floorOf(box);
          const wall = soul.x < midX ? box.x + 5 : box.x + box.w - 5;
          for (const off of [0, (Math.random() < 0.5 ? -1 : 1) * rand(12, 24), null]) {
            const sy = box.y + rand(8, 28);
            const tx = off === null
              ? Math.max(box.x + 3, Math.min(box.x + box.w - 3, wall + rand(-4, 4)))
              : Math.max(box.x + 3, Math.min(box.x + box.w - 3, soul.x + off + rand(-2, 2)));
            const T = off === null ? 0.95 : 0.85;
            bullets.push(new Shot({ x: tx, y: fy, art: 'pudMark', harmless: true, warn: T, life: 0.25 }));
            const mug = new Shot({ x: sx, y: sy, vx: (tx - sx) / T, vy: (fy - sy - 0.5 * G * T * T) / T, gravity: G, art: 'pudMug' });
            bullets.push(mug);
            live.push({ mug, steam: 0 });
          }
        }
        for (let i = live.length - 1; i >= 0; i--) {
          const m = live[i];
          m.steam -= dt;
          if (m.steam <= 0) {
            m.steam = 0.16;
            bullets.push(new Shot({ x: m.mug.x, y: m.mug.y - 3, vy: -14, vx: rand(-5, 5), art: 'pudSteam', harmless: true, life: 0.5 }));
          }
          if (m.mug.y >= floorOf(box)) {
            live.splice(i, 1);
            m.mug.life = Math.max(0, m.mug.age - m.mug.warn);
            // (Eased 13 November 2026: seven throws, a short floor splash, one drop up
            // and three sprayed, so a careful dodger takes about one hit a turn here.)
            for (const dir of [-1, 1]) bullets.push(new Shot({ x: m.mug.x, y: floorOf(box) - 1.5, vx: dir * 50, art: 'pudTea', life: 0.4 }));
            for (let k = 0; k < 1; k++) {
              bullets.push(new Shot({ x: m.mug.x, y: floorOf(box), vx: rand(-12, 12), vy: -rand(110, 150), gravity: 130, art: 'pudTea', life: 1.3 }));
            }
            for (let k = 0; k < 3; k++) {
              bullets.push(new Shot({ x: m.mug.x, y: floorOf(box), vx: rand(-70, 70), vy: -rand(70, 150), gravity: 130, art: 'pudTea', life: 1.3 }));
            }
          }
        }
      },
    };
  },

  // The Falling Star. The guardians of the stars share one tune, four notes
  // falling (high, the fifth, a flat fifth, home: E B B-flat E), and here it is
  // as four glass stars at the heights of those notes, coming in from the
  // olm's side one after another and falling as they cross. Glints show where
  // each starts. The shape is the same every time; where it sits in the box is
  // not, and another shape follows before the last has gone.
  puddingFalling(box, density, { rand, pick }) {
    let clock = 0;
    let shapes = 0;
    const queue = [];
    // High, fifth, flat fifth, home: the flat fifth is only a hair under the fifth.
    // Their heights, as steps above and below where you are: far above, a little above, a hair below that
    // (the flat fifth), and well below (home). So the shape always passes through your row.
    const OFFSET = [-22, -4, 3, 20];
    return {
      duration: 11,
      update(dt, bullets, soul) {
        clock += dt;
        if (clock > shapes * 1.05 && shapes < 11) {
          shapes++;
          const shift = rand(-0.1, 0.1) + (soul.y > box.y + box.h * 0.5 ? 0.04 : -0.04);
          const slow = pick([1, 1.2]);
          const side = pick([1, -1]);
          OFFSET.forEach((o, i) => {
            const y = Math.max(box.y + 5, Math.min(box.y + box.h - 8, soul.y + OFFSET[i] + shift * 40));
            const at = clock + 0.7 + i * 0.4;
            bullets.push(new Shot({ x: side === 1 ? rightEdge(box) - 2 : box.x + 2, y, art: 'pudSpark', harmless: true, warn: 0.7 + i * 0.4, life: 0.15 }));
            queue.push({ at, y, slow, side, g: 22 });
          });
        }
        for (let i = queue.length - 1; i >= 0; i--) {
          if (clock < queue[i].at) continue;
          const q = queue.splice(i, 1)[0];
          bullets.push(new Shot({ x: q.side === 1 ? rightEdge(box) + 2 : box.x - 2, y: q.y, vx: (-q.side * 62) / q.slow, vy: 0, gravity: q.g, art: 'pudGlassStar', life: 5 }));
        }
      },
    };
  },
};

// ---------------------------------------------------------------------------
// Chaos: the attacks above, mixed.

// Runs several of the attacks above at once, at their own speeds, and swaps
// the mix every few seconds. `lite` thins each one so the pile is fair.
function mixer(box, density, tools, names, { lite = 0.3, swap = [2.6, 3.8], count = [2, 3], scales = [0.8, 1.3] } = {}) {
  const { rand } = tools;
  let t = 0;
  let next = 0;
  let runs = [];
  let last = [];
  const roll = () => {
    const n = Math.round(rand(count[0] - 0.49, count[1] + 0.49));
    const pool = names.filter((name) => !last.includes(name)).sort(() => Math.random() - 0.5);
    last = pool.slice(0, n);
    runs = last.map((name) => ({ run: PUDDING_ATTACKS[name](box, density, tools), scale: rand(scales[0], scales[1]) * lite }));
    next = t + rand(swap[0], swap[1]);
  };
  return {
    duration: 10,
    update(dt, bullets, soul) {
      t += dt;
      if (t >= next) roll();
      for (const r of runs) r.run.update(dt * r.scale, bullets, soul);
    },
  };
}

const MIX = ['puddingGills', 'puddingSwim', 'puddingBubbles', 'puddingTail', 'puddingStar', 'puddingHiccup', 'puddingTea', 'puddingFalling'];

Object.assign(PUDDING_ATTACKS, {
  // Phase 3. It has stopped choosing: every few seconds the glass shuffles
  // and two or three of its moves happen at once, at their own speeds.
  puddingChaos(box, density, tools) {
    return mixer(box, density, tools, MIX);
  },

  // The finale, once, when it is nearly done: the whole glass goes. Three
  // stages. First the light (gills and the star's rings), then the throwing
  // (tea, stone, hiccups), then everything, ending in three rings of the
  // star's light, one inside the other, each with its gap somewhere else.
  puddingShatter(box, density, tools) {
    const { rand } = tools;
    let t = 0;
    let stage = -1;
    let inner = null;
    let rings = 0;
    const cx = rightEdge(box) + 16;
    const cy = box.y + box.h * 0.5;
    const stages = [
      { at: 0, names: ['puddingGills', 'puddingStar'], opts: { lite: 0.5, count: [2, 2], swap: [5, 5] } },
      { at: 5, names: ['puddingTea', 'puddingSwim', 'puddingHiccup', 'puddingBubbles'], opts: { lite: 0.42, count: [2, 2], swap: [2.4, 3] } },
      { at: 10, names: MIX, opts: { lite: 0.38, count: [3, 3], swap: [2.2, 2.8] } },
    ];
    return {
      duration: 18,
      update(dt, bullets, soul) {
        t += dt;
        while (stage + 1 < stages.length && t >= stages[stage + 1].at) {
          stage++;
          inner = mixer(box, density, tools, stages[stage].names, stages[stage].opts);
        }
        inner?.update(dt, bullets, soul);
        // The last three rings, from 13s on.
        if (t > 13 && rings < 3 && t > 13 + rings * 0.9) {
          const gaps = [Math.PI + 0.55, Math.PI - 0.45, Math.PI + 0.05];
          bullets.push(new StarRing({ cx, cy, gap: gaps[rings] + rand(-0.12, 0.12), half: 0.52, speed: 44, warn: 0.7, color: ['#ffd95a', '#ffb8e0', '#7cf0ff'][rings] }));
          rings++;
        }
      },
    };
  },
});
