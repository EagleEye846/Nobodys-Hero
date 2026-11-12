import { defineBulletArt, Shot, Line } from '../projectiles.js';
import { segDist, rectDist, warnAlpha } from './rumboldBullets.js';
import { drawString, C } from './rumboldAliveBullets.js';
import { sfx } from '../../audio/music.js';

// KING PEPTUP's own body, thrown at you (phase 3 of his fight, NO STRINGS;
// src/data/enemies/rumbold.js). By now he isn't a king putting on a show: he
// is a pale wooden artist's mannequin on strings with something lit up inside
// him, and everything here is HIM, the wood and the joints and the strings:
//
//   rumboldAliveLimbs     his arms and legs hanging loose off their joints,
//                         swinging through the box like pendulums: one long,
//                         one short, the pegs they hang from wandering along
//                         as he walks. Halfway through he lets that pair drop
//                         and hangs the other two, long and short swapped.
//                         Snip a limb's string and it falls away.
//   rumboldAliveGouge     he digs a face into his blank head with his
//                         fingertips: curls of wood shaving drift in off him,
//                         turning over as they come, and on every deep cut a
//                         splinter flies straight (its line shows first).
//                         Then he wipes his head smooth: his flat hand sweeps
//                         right across the box, wiping the shavings away with
//                         it, one way and then back. It never reaches the
//                         whole way: the gap is over his fingertips (or under
//                         his wrist), shown before it comes.
//   rumboldAliveJoints    his ball joints popping out of their sockets and
//                         bouncing round the box, rolling as they go. Each
//                         one blinks where it'll pop out, with the arc it'll
//                         take dotted out in front of it.
//   rumboldAliveCrossbar  his control bar let down over the box, turning, and
//                         the four strings off its ends hanging right down
//                         through it, swinging to and fro as it turns. Taut,
//                         they cut; slack, they're harmless (they shiver
//                         before they go taut). Snip one and it's gone till
//                         he lets down another.
//
// Every piece is pale bare wood (no paint, nothing red), with a dark outline.
// Each attack is `(box, density, tools) => ({ duration, update })`; each keeps
// `real` time (dt / density) for its timeline, as in rumboldAlive.js, and
// `density` thins out its repeats. Every bullet here moves itself (its own
// `update`), so the dodging bot (tools/dodgeCheck.html) reads it as a person
// would.

// --- The wood ---

// Pale bare wood, from the lit top down into shadow (as peptupPuppet.js).
const WOOD = {
  a: '#f6e6c4',
  b: '#e6c896',
  c: '#c9a06a',
  d: '#8e6844',
  e: '#563c28',
  f: '#2c1c14', // seams, peg holes, the gaps at the joints
  s: '#d8d2c4', // string
  k: '#0a0710', // outline
};

// A little painter for the bigger pieces: shapes in shades of the wood, then
// turned into letter rows (each piece then gets its dark rim from
// defineBulletArt, as every bullet does).
function canvasOf(w, h) {
  const g = Array.from({ length: h }, () => Array(w).fill('.'));
  const set = (x, y, ch) => { if (x >= 0 && y >= 0 && x < w && y < h) g[y][x] = ch; };
  return {
    set,
    rect(x, y, rw, rh, ch) { for (let j = 0; j < rh; j++) for (let i = 0; i < rw; i++) set(x + i, y + j, ch); },
    // A ball, lit from the top left.
    ball(cx, cy, r) {
      for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) {
        for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
          const dx = x - cx;
          const dy = y - cy;
          if (dx * dx + dy * dy > r * r + 0.3) continue;
          const lit = -(dx * 0.6 + dy * 0.8) / r;
          set(x, y, lit > 0.45 ? 'a' : lit > -0.05 ? 'b' : lit > -0.55 ? 'c' : 'd');
        }
      }
    },
    // A rod along x (rows y to y + t - 1), lit along its top.
    rod(x0, x1, y, t) {
      for (let x = x0; x <= x1; x++) {
        for (let j = 0; j < t; j++) set(x, y + j, j === 0 ? 'a' : j === t - 1 ? 'd' : j === 1 ? 'b' : 'c');
      }
    },
    rows: () => g.map((row) => row.join('')),
  };
}

// A curl of wood shaving, off where he's digging.
defineBulletArt('pepShaving', {
  frames: [[
    '..kkkk..',
    '.kaabbk.',
    'kakkkkck',
    'kbkabkck',
    'kbkkckdk',
    'kck.kdk.',
    '.kdddk..',
    '..kkk...',
  ]],
  palette: WOOD,
  radius: 2.8,
  spin: 5,
});

// A splinter: a long sharp sliver, pointing the way it flies.
defineBulletArt('pepSplinter', {
  frames: [[
    'kkkkkkkk...',
    'kdccbbaaakk',
    '.kkkkkkkk..',
  ]],
  palette: WOOD,
  radius: 1.8,
  rotate: true,
});

// A ball joint, popped out of its socket: a wooden ball with the dark peg
// hole in it (turning as it rolls).
defineBulletArt('pepBall', {
  frames: [[
    '..kkk..',
    '.kaabk.',
    'kaabbck',
    'kabffck',
    'kbbffdk',
    '.kccdk.',
    '..kkk..',
  ]],
  palette: WOOD,
  radius: 3,
  rotate: true,
});

// The wooden peg on the end of each of his strings.
defineBulletArt('pepPeg', {
  frames: [[
    '..k..',
    '.ksk.',
    '.kak.',
    'kabck',
    'kbcdk',
    'kbcdk',
    'kcddk',
    '.kkk.',
  ]],
  palette: WOOD,
  radius: 2.5,
});

// His forearm, off at the elbow: the ball of the elbow joint (with its peg
// hole), the forearm, a seam at the wrist, and the hand. Drawn pointing
// right; it hangs down its string.
const ARM = (() => {
  const p = canvasOf(26, 9);
  p.ball(4, 4, 3.6);
  p.set(4, 4, 'f');
  p.rect(8, 3, 1, 3, 'f');
  p.rod(9, 18, 3, 3);
  p.rect(19, 3, 1, 3, 'f');
  // The hand: a flat palm, three long jointed fingers and a thumb.
  p.rect(20, 2, 3, 5, 'b');
  p.rect(20, 2, 3, 1, 'a');
  p.rect(20, 6, 3, 1, 'c');
  for (const y of [2, 4, 6]) { p.rect(23, y, 3, 1, 'b'); p.set(24, y, 'f'); }
  p.rect(20, 1, 2, 1, 'a');
  p.set(21, 0, 'b');
  return p.rows();
})();
defineBulletArt('pepArm', { frames: [ARM], palette: WOOD, radius: 3, rotate: true });

// His shin, off at the knee: the knee ball, the shin, the ankle ball, and a
// foot of plain wood, toes out to the side.
const LEG = (() => {
  const p = canvasOf(27, 11);
  p.ball(4, 5, 3.8);
  p.set(4, 5, 'f');
  p.rect(8, 4, 1, 3, 'f');
  p.rod(9, 19, 3, 5);
  p.rect(20, 4, 1, 3, 'f');
  p.ball(21.5, 5, 1.6);
  p.rect(23, 1, 4, 9, 'b');
  p.rect(23, 1, 4, 1, 'a');
  p.rect(26, 2, 1, 7, 'c');
  p.rect(23, 9, 4, 1, 'd');
  p.rect(23, 3, 1, 1, 'f');
  return p.rows();
})();
defineBulletArt('pepLeg', { frames: [LEG], palette: WOOD, radius: 3, rotate: true });

// His flat hand, as it wipes his head smooth: four long jointed fingers
// together, the palm, the wrist seam and the forearm going on out of sight.
// `pepPalmUp` has the fingers up (the hand comes along the floor, and the gap
// is over its fingertips); `pepPalmDown` hangs from the top.
export const PALM_W = 16;
export const PALM_H = 64;
const PALM = (() => {
  const p = canvasOf(PALM_W, PALM_H);
  // Fingers, from the top: a rounded tip, two knuckle seams.
  for (const [i, x] of [3, 6, 9, 12].entries()) {
    const top = [3, 0, 1, 4][i];
    p.rect(x, top + 1, 3, 20 - top, 'b');
    p.set(x + 1, top, 'a');
    p.rect(x, top + 1, 1, 20 - top, 'a');
    p.rect(x + 2, top + 1, 1, 20 - top, 'c');
    p.rect(x, top + 7, 3, 1, 'f');
    p.rect(x, top + 13, 3, 1, 'f');
  }
  // The thumb, folded in along the side.
  p.rect(0, 22, 3, 11, 'b');
  p.rect(0, 22, 1, 11, 'a');
  p.rect(0, 28, 3, 1, 'f');
  // The palm.
  p.rect(3, 21, 12, 18, 'b');
  p.rect(3, 21, 12, 1, 'f');
  p.rect(3, 21, 2, 18, 'a');
  p.rect(13, 21, 2, 18, 'c');
  p.rect(6, 30, 6, 1, 'c');
  // The wrist seam, a ball joint showing through it, and the forearm.
  p.rect(4, 39, 10, 1, 'f');
  p.ball(8.5, 41.5, 2.3);
  p.rect(5, 43, 8, 21, 'b');
  p.rect(5, 43, 2, 21, 'a');
  p.rect(11, 43, 2, 21, 'c');
  p.rect(5, 43, 8, 1, 'f');
  return p.rows();
})();
defineBulletArt('pepPalmUp', { frames: [PALM], palette: WOOD, radius: 6 });
defineBulletArt('pepPalmDown', { frames: [[...PALM].reverse()], palette: WOOD, radius: 6 });

// --- His limbs, swinging loose ---

// One of his limbs (`arm` or `leg`) hanging off a peg above the box by a
// string, swinging like a pendulum: the string `length` long to the tip, the
// limb the last LIMB of it. Its peg wanders to and fro along the top (`drift`
// px, as he walks), and the swing grows from `amp` to `ampMax`. It shows the
// arc its tip will sweep first. Snip the string and the limb drops.
const LIMB = 22;
export class SwingLimb extends Shot {
  constructor({ pivot, length, kind = 'arm', amp = 0.6, ampMax = 0.9, period = 3, phase = 0, warn = 0.9, life = 4, drift = 0, driftRate = 0.45 }) {
    super({ x: pivot.x, y: pivot.y + length, art: kind === 'arm' ? 'pepArm' : 'pepLeg', warn, life });
    Object.assign(this, { px: pivot.x, py: pivot.y, home: pivot.x, length, kind, amp, ampMax, period, phase, drift, driftRate });
    this.driftPhase = Math.random() * 6.28;
    this.severed = false;
    this.fall = null;
    this.place();
  }

  get theta() {
    const t = Math.max(0, this.age - this.warn);
    const amp = this.amp + (this.ampMax - this.amp) * Math.min(1, t / 3);
    return amp * Math.sin((t / this.period) * Math.PI * 2 + this.phase);
  }

  place(dt = 0) {
    const was = { x: this.x, y: this.y };
    this.px = this.home + this.drift * Math.sin(this.age * this.driftRate + this.driftPhase);
    const th = this.theta;
    this.dx = Math.sin(th);
    this.dy = Math.cos(th);
    this.x = this.px + this.dx * (this.length - LIMB / 2);
    this.y = this.py + this.dy * (this.length - LIMB / 2);
    this.angle = Math.atan2(this.dy, this.dx);
    // (How fast it's going, for anything reading it: the dodging bot.)
    if (dt > 0) { this.vx = (this.x - was.x) / dt; this.vy = (this.y - was.y) / dt; }
  }

  get active() { return !this.severed && this.age >= this.warn && this.age < this.warn + this.life; }

  update(dt) {
    this.age += dt;
    if (this.severed) {
      this.fall.vy += 260 * dt;
      this.x += this.fall.vx * dt;
      this.y += this.fall.vy * dt;
      this.angle += dt * 6;
      return;
    }
    if (this.age < this.warn + this.life) this.place(dt);
  }

  isGone() { return this.severed ? this.y > 220 : this.age > this.warn + this.life + 0.25; }

  // The wooden limb: the last LIMB of the string.
  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const p = { x: this.px, y: this.py };
    return segDist(px, py, p.x + this.dx * (this.length - LIMB), p.y + this.dy * (this.length - LIMB), p.x + this.dx * this.length, p.y + this.dy * this.length) - 3;
  }

  get cuttable() { return this.active; }
  cutDistance(px, py) {
    const p = { x: this.px, y: this.py };
    return segDist(px, py, p.x, p.y, p.x + this.dx * (this.length - LIMB), p.y + this.dy * (this.length - LIMB));
  }

  cut() {
    this.severed = true;
    const w = (this.ampMax * Math.PI * 2) / this.period;
    this.fall = { vx: this.dy * w * this.length * 0.3, vy: -10 };
    sfx('clack');
  }

  draw(ctx) {
    const p = { x: this.px, y: this.py };
    if (this.age < this.warn) {
      // The arc its tip will sweep, dotted, and the limb hanging still.
      ctx.save();
      ctx.globalAlpha = warnAlpha(this.age) * 0.8;
      ctx.strokeStyle = WOOD.s;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.arc(p.x, p.y, this.length, Math.PI / 2 - this.ampMax, Math.PI / 2 + this.ampMax);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
    if (!this.severed && this.age < this.warn + this.life + 0.25) {
      ctx.save();
      if (this.age < this.warn) ctx.globalAlpha = 0.55;
      else if (this.age > this.warn + this.life) ctx.globalAlpha = Math.max(0, 1 - (this.age - this.warn - this.life) / 0.25);
      drawString(ctx, p.x, p.y, p.x + this.dx * (this.length - LIMB), p.y + this.dy * (this.length - LIMB));
      ctx.restore();
    }
    if (this.age < this.warn) {
      ctx.save();
      ctx.globalAlpha = 0.6;
      const frame = this.art.frames[0];
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.drawImage(frame, -frame.width / 2, -frame.height / 2);
      ctx.restore();
      return;
    }
    super.draw(ctx);
  }
}

export function limbs(box, density) {
  let real = 0;
  let pair = 0;
  const top = box.y - 16;
  // Two pairs: the first from the start, the second (long and short swapped,
  // the pegs moved over) as the first is dropped.
  const PAIRS = [0.2, 4.0];
  const left = Math.random() < 0.5;
  return {
    duration: 8.2,
    update: (dt, bullets) => {
      real += dt / density;
      if (pair >= PAIRS.length || real < PAIRS[pair]) return;
      // (The first pair is long and short, sweeping the floor and the top;
      // the second long and middling, sweeping the floor and the middle.)
      const longU = (pair === 0) === left ? 0.3 : 0.7;
      const flip = pair ? Math.PI : 0;
      // (A pendulum's period goes with its length: the long one swings slow.)
      bullets.push(new SwingLimb({
        pivot: { x: box.x + box.w * longU, y: top }, length: 97, kind: pair ? 'leg' : 'arm',
        amp: 0.5, ampMax: 0.74, period: 3.9, phase: flip, warn: 0.95, life: pair ? 3.7 : 3.9, drift: 14, driftRate: 0.5,
      }));
      bullets.push(new SwingLimb({
        pivot: { x: box.x + box.w * (1 - longU), y: top }, length: pair ? 68 : 42, kind: pair ? 'arm' : 'leg',
        amp: 0.65, ampMax: pair ? 0.9 : 1.05, period: pair ? 3.0 : 2.4, phase: Math.PI - flip, warn: 0.95, life: pair ? 3.7 : 3.9, drift: 16, driftRate: 0.6,
      }));
      pair++;
    },
  };
}

// --- Digging a face ---

// A curl of shaving: drifts in off his head, curling over as it goes (its
// heading turns round and round), and sinking a little.
export class Shaving extends Shot {
  constructor({ x, y, vx, vy, curl = 14, turn = 5, warn = 0.3, life = 4.5 }) {
    super({ x, y, vx, vy, art: 'pepShaving', warn, life });
    Object.assign(this, { bx: vx, by: vy, curl, turn });
    this.phase0 = Math.random() * 6.28;
  }

  update(dt) {
    this.age += dt;
    if (this.age < this.warn) return;
    const t = this.age - this.warn;
    this.vx = this.bx + Math.cos(t * this.turn + this.phase0) * this.curl;
    this.vy = this.by + Math.sin(t * this.turn + this.phase0) * this.curl + 6;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
}

// His flat hand, wiping across the box (`dir` -1 right to left, 1 left to
// right), from the floor up to `reach` short of the top (`from: 'floor'`) or
// down from the top (`from: 'top'`), so the gap is the rest. Its ghost waits
// at the edge it comes from, and the gap blinks, before it goes.
export class WipeHand extends Shot {
  constructor({ box, dir = -1, from = 'floor', gap = 24, speed = 70, warn = 1.05 }) {
    const x0 = dir < 0 ? box.x + box.w + PALM_W / 2 + 2 : box.x - PALM_W / 2 - 2;
    super({ x: x0, y: 0, vx: dir * speed, art: from === 'floor' ? 'pepPalmUp' : 'pepPalmDown', warn, life: (box.w + PALM_W + 8) / speed });
    Object.assign(this, { box: { ...box }, dir, from, gap, speed });
    // Where its fingertips (or its wrist) stop, leaving the gap.
    this.edge = from === 'floor' ? box.y + gap : box.y + box.h - gap;
    this.y = from === 'floor' ? this.edge + PALM_H / 2 : this.edge - PALM_H / 2;
    this.angle = 0;
  }

  update(dt) {
    this.age += dt;
    if (this.age >= this.warn) this.x += this.vx * dt;
  }

  // The hand and the forearm, all of it.
  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    const y0 = this.from === 'floor' ? this.edge + 1 : this.box.y - 40;
    const y1 = this.from === 'floor' ? this.box.y + this.box.h + 40 : this.edge - 1;
    return rectDist(px, py, this.x - 6.5, y0, 13, y1 - y0);
  }

  draw(ctx) {
    if (this.age < this.warn) {
      // The gap it'll leave, blinking: where the hand will go is shaded,
      // the gap is left clear, and the hand waits just inside the edge.
      const b = this.box;
      ctx.save();
      ctx.globalAlpha = warnAlpha(this.age) * 0.28;
      ctx.fillStyle = WOOD.c;
      if (this.from === 'floor') ctx.fillRect(b.x, this.edge, b.w, b.y + b.h - this.edge);
      else ctx.fillRect(b.x, b.y, b.w, this.edge - b.y);
      const frame = this.art.frames[0];
      ctx.globalAlpha = 0.55;
      ctx.drawImage(frame, Math.round((this.dir < 0 ? b.x + b.w - frame.width + 2 : b.x - 2)), Math.round(this.y - frame.height / 2));
      ctx.globalAlpha = warnAlpha(this.age);
      ctx.strokeStyle = WOOD.a;
      ctx.setLineDash([3, 2]);
      ctx.beginPath();
      ctx.moveTo(b.x, this.edge + 0.5);
      ctx.lineTo(b.x + b.w, this.edge + 0.5);
      ctx.stroke();
      ctx.setLineDash([]);
      // An arrow along the gap, the way the hand will go.
      const ay = this.from === 'floor' ? (b.y + this.edge) / 2 : (this.edge + b.y + b.h) / 2;
      const ax = b.x + b.w / 2;
      ctx.fillStyle = WOOD.a;
      for (let i = 0; i < 4; i++) ctx.fillRect(Math.round(ax - this.dir * (6 - i * 3)), Math.round(ay - i % 2), 2, 1 + (i % 2));
      ctx.restore();
      return;
    }
    super.draw(ctx);
  }
}

export function gouge(box, density, { rand }) {
  let real = 0;
  let next = 0.5;
  let stroke = 0;
  const every = 0.9 / Math.min(1.3, density);
  // His head is off the right of the box, where he hangs.
  const head = { x: box.x + box.w + 4, y: box.y + box.h * 0.4 };
  const wipes = [];
  const first = Math.random() < 0.5 ? 'floor' : 'top';
  const plan = [
    { at: 4.9, dir: -1, from: first },
    { at: 6.9, dir: 1, from: first === 'floor' ? 'top' : 'floor' },
  ];
  return {
    duration: 9.0,
    update: (dt, bullets, soul) => {
      real += dt / density;
      // The digging: a few curls off each stroke of his fingertips.
      if (real >= next && real < 4.3) {
        next += every;
        stroke++;
        const n = density < 1 ? 1 : 2;
        for (let i = 0; i < n; i++) {
          const y = head.y + rand(-34, 34);
          bullets.push(new Shaving({
            x: box.x + box.w + 3, y: Math.min(box.y + box.h - 6, Math.max(box.y + 6, y)),
            vx: -rand(30, 40), vy: rand(-8, 8), curl: rand(10, 15), turn: rand(4, 6),
          }));
        }
        // A deep cut: a splinter flies off at you, straight (its line first).
        // (None once the wipe's about to show: one warning line at a time.)
        if (stroke % 3 === 0 && real < 3.2) {
          const y = Math.min(box.y + box.h - 8, Math.max(box.y + 8, head.y + rand(-20, 20)));
          const x = box.x + box.w + 2;
          const a = Math.atan2(soul.y - y, soul.x - x);
          bullets.push(new Line({ x, y, angle: a, length: 110, thickness: 1, warn: 0.6, life: 0, color: WOOD.a, dmg: 0 }));
          const s = new Shot({ x, y, vx: Math.cos(a) * 105, vy: Math.sin(a) * 105, art: 'pepSplinter', warn: 0.6, life: 2 });
          bullets.push(s);
        }
      }
      // And he wipes it smooth: his hand across the box, and back.
      while (plan.length && real >= plan[0].at - 1.05) {
        const w = plan.shift();
        const hand = new WipeHand({ box, dir: w.dir, from: w.from, gap: 25 });
        wipes.push(hand);
        bullets.push(hand);
      }
      // The hand takes the shavings with it as it goes.
      for (const hand of wipes) {
        if (!hand.active) continue;
        for (const b of bullets) {
          if (b instanceof Shaving && Math.abs(b.x - hand.x) < 8 && hand.edgeDistance(b.x, b.y) < 3) b.spent = true;
        }
      }
    },
  };
}

// --- His joints, popping out ---

// A ball joint, bouncing round the box: it falls, bounces (a little lower
// each time) off the floor, the walls and the top, and rolls. It blinks
// where it'll pop out, with its first arc dotted out ahead of it.
export class Joint extends Shot {
  constructor({ box, x, y, vx, vy, warn = 0.75, life = 4.4, gravity = 150, bounce = 0.84 }) {
    super({ x, y, vx, vy, art: 'pepBall', warn, life });
    Object.assign(this, { box: { ...box }, g: gravity, rest: bounce });
    this.roll = 0;
    this.angle = 0;
    // Its first arc, for the warning.
    this.arc = [];
    const sim = { x, y, vx, vy };
    for (let i = 0; i < 14; i++) {
      for (let k = 0; k < 4; k++) this.step(sim, 0.02);
      this.arc.push({ x: sim.x, y: sim.y });
    }
  }

  step(s, dt) {
    const b = this.box;
    const r = 3;
    s.vy += this.g * dt;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    if (s.y > b.y + b.h - r) { s.y = b.y + b.h - r; s.vy = -Math.abs(s.vy) * this.rest; }
    if (s.y < b.y + r) { s.y = b.y + r; s.vy = Math.abs(s.vy) * 0.9; }
    if (s.x < b.x + r) { s.x = b.x + r; s.vx = Math.abs(s.vx) * 0.92; }
    if (s.x > b.x + b.w - r) { s.x = b.x + b.w - r; s.vx = -Math.abs(s.vx) * 0.92; }
  }

  update(dt) {
    this.age += dt;
    if (this.age < this.warn) return;
    this.step(this, dt);
    this.roll += (this.vx / 3) * dt;
    this.angle = this.roll;
  }

  isGone() { return this.age >= this.warn + this.life + 0.25; }

  draw(ctx) {
    if (this.age < this.warn) {
      ctx.save();
      ctx.globalAlpha = warnAlpha(this.age);
      ctx.fillStyle = WOOD.a;
      for (const p of this.arc) ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
      ctx.restore();
    }
    super.draw(ctx);
  }
}

export function joints(box, density, { rand }) {
  let real = 0;
  let next = 0.3;
  let count = 0;
  const every = 1.0 / Math.min(1.3, density);
  const live = [];
  return {
    duration: 8.2,
    update: (dt, bullets, soul) => {
      real += dt / density;
      if (real < next || real > 5.8) return;
      next += every;
      // (Never more than four in the box at once.)
      for (let i = live.length - 1; i >= 0; i--) if (live[i].age > live[i].warn + live[i].life) live.splice(i, 1);
      if (live.length >= 4) return;
      count++;
      let ball;
      if (count % 3 === 0) {
        // Out of a knee up over the box: dropped on you, a little off.
        const x = Math.min(box.x + box.w - 6, Math.max(box.x + 6, soul.x + rand(-14, 14)));
        ball = new Joint({ box, x, y: box.y + 4, vx: (Math.random() < 0.5 ? -1 : 1) * rand(22, 40), vy: 10, warn: 0.85 });
      } else {
        // Out of his side (he hangs to the right of the box): lobbed in.
        const y = rand(box.y + 8, box.y + 38);
        ball = new Joint({ box, x: box.x + box.w - 4, y, vx: -rand(36, 58), vy: -rand(40, 130) });
      }
      live.push(ball);
      bullets.push(ball);
    },
  };
}

// --- His control bar, and its strings ---

// The bar, hanging over the box and turning: a cross of two crossbars seen
// from the front, so as it turns the four ends slide to and fro. Harmless
// itself; it's the strings off its ends that cut.
const BAR_R = 44;
export class Crossbar {
  constructor({ cx, y, theta0, spin, warn = 0.8, life = 7.5 }) {
    Object.assign(this, { cx, y, theta0, spin, warn, life });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  static angle(theta0, spin, t) { return theta0 + spin * t + 0.5 * Math.sin(t * 0.8); }
  endX(k, t) { return this.cx + BAR_R * Math.cos(Crossbar.angle(this.theta0, this.spin, t) + (k * Math.PI) / 2); }
  update(dt) { this.age += dt; }
  isGone() { return this.age > this.warn + this.life + 0.4; }
  edgeDistance() { return Infinity; }

  draw(ctx) {
    const t = Math.max(0, this.age - this.warn);
    const th = Crossbar.angle(this.theta0, this.spin, t);
    ctx.save();
    ctx.globalAlpha = Math.min(1, this.age / 0.4) * (this.age > this.warn + this.life ? Math.max(0, 1 - (this.age - this.warn - this.life) / 0.4) : 1);
    // The two crossbars, the nearer one (by its ends' depth) drawn over.
    const bars = [0, 1].map((k) => ({ k, depth: Math.sin(th + (k * Math.PI) / 2) }));
    bars.sort((a, b) => a.depth - b.depth);
    for (const { k } of bars) {
      const x0 = this.endX(k, t);
      const x1 = this.endX(k + 2, t);
      const lo = Math.round(Math.min(x0, x1));
      const hi = Math.round(Math.max(x0, x1));
      const y = Math.round(this.y + k * 2);
      ctx.fillStyle = WOOD.k;
      ctx.fillRect(lo - 2, y - 2, hi - lo + 4, 5);
      ctx.fillStyle = WOOD.c;
      ctx.fillRect(lo - 1, y - 1, hi - lo + 2, 3);
      ctx.fillStyle = WOOD.b;
      ctx.fillRect(lo - 1, y - 1, hi - lo + 2, 1);
      ctx.fillStyle = WOOD.d;
      ctx.fillRect(lo - 1, y + 1, hi - lo + 2, 1);
    }
    // The upright in the middle, his hand's grip.
    ctx.fillStyle = WOOD.k;
    ctx.fillRect(Math.round(this.cx) - 2, Math.round(this.y) - 10, 5, 14);
    ctx.fillStyle = WOOD.d;
    ctx.fillRect(Math.round(this.cx) - 1, Math.round(this.y) - 9, 3, 12);
    ctx.fillStyle = WOOD.c;
    ctx.fillRect(Math.round(this.cx) - 1, Math.round(this.y) - 9, 1, 12);
    ctx.restore();
  }
}

// One of the strings off the bar's ends (`k`, 0 to 3), down through the box
// to its peg. It works out where it is from its own clock (so it keeps in
// step with the bar). Slack (the first `SLACK` of each `CYCLE`) it's harmless
// and wavy; it shivers just before it goes taut, and taut it cuts. Snip it
// and it drops; another comes down in its place after REGROW. (Taut, it's
// never long enough to sweep you far: one that has you against a wall goes
// slack in time, or snip it.)
const CYCLE = 2.3;
const SLACK = 1.4;
const SHIVER = 0.5;
const REGROW = 2.4;
export class BarString extends Shot {
  constructor({ box, k, bar, offset = 0 }) {
    super({ x: bar.cx, y: box.y + box.h - 5, art: 'pepPeg', warn: bar.warn, life: bar.life });
    Object.assign(this, { box: { ...box }, k, cx: bar.cx, barY: bar.y, theta0: bar.theta0, spin: bar.spin, offset });
    this.cutAt = null;
    this.place();
  }

  get t() { return Math.max(0, this.age - this.warn); }
  place(dt = 0) {
    const was = this.x;
    this.x = this.cx + BAR_R * Math.cos(Crossbar.angle(this.theta0, this.spin, this.t) + (this.k * Math.PI) / 2);
    if (dt > 0) this.vx = (this.x - was) / dt;
  }
  // Where it is in its slack-and-taut cycle (seconds).
  get beat() { return (this.t + this.offset) % CYCLE; }
  get gone() { return this.cutAt !== null && this.age - this.cutAt < REGROW; }
  get regrowing() { return this.cutAt !== null && this.age - this.cutAt >= REGROW && this.age - this.cutAt < REGROW + SHIVER; }
  get taut() { return this.age >= this.warn && this.age < this.warn + this.life && !this.gone && !this.regrowing && this.beat >= SLACK; }
  get shivering() { return !this.gone && this.beat >= SLACK - SHIVER && this.beat < SLACK; }
  get active() { return this.taut; }
  // (The ends past the walls of the box don't reach into it.)
  get inBox() { return this.x > this.box.x - 2 && this.x < this.box.x + this.box.w + 2; }

  update(dt) {
    this.age += dt;
    this.place(dt);
    if (this.cutAt !== null && this.age - this.cutAt >= REGROW + SHIVER) this.cutAt = null;
  }

  edgeDistance(px, py) {
    if (!this.taut || !this.inBox) return Infinity;
    return Math.max(0, Math.abs(px - this.x) - 1, py - (this.box.y + this.box.h)) ;
  }

  get cuttable() { return this.age >= this.warn && !this.gone && !this.regrowing && this.inBox; }
  cutDistance(px) { return Math.abs(px - this.x); }
  cut() { this.cutAt = this.age; sfx('clack'); }

  draw(ctx) {
    const top = this.barY + 1;
    const bottom = this.box.y + this.box.h - 8;
    const x = Math.round(this.x) + 0.5;
    ctx.save();
    if (this.age < this.warn) ctx.globalAlpha = warnAlpha(this.age);
    else if (this.age > this.warn + this.life) ctx.globalAlpha = Math.max(0, 1 - (this.age - this.warn - this.life) / 0.25);
    if (this.gone) {
      // Cut: the lower end dropping away and gone.
      const k = (this.age - this.cutAt) / 0.5;
      if (k < 1) {
        ctx.globalAlpha *= 1 - k;
        drawString(ctx, x, top, x + 3, top + 20 + k * 20, 4);
      }
      ctx.restore();
      return;
    }
    if (this.regrowing) {
      // Let down again: a dotted line coming down.
      const k = (this.age - this.cutAt - REGROW) / SHIVER;
      ctx.globalAlpha *= 0.6;
      ctx.setLineDash([2, 2]);
      drawString(ctx, x, top, x, top + (bottom - top) * k, 0);
      ctx.restore();
      return;
    }
    if (this.taut) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.stroke();
    } else {
      // Slack: a loose wavy line, dim; shivering as it's about to pull.
      const shiver = this.shivering ? Math.sin(this.age * 60) * 1.5 : 0;
      ctx.globalAlpha *= this.shivering ? 0.9 : 0.45;
      ctx.strokeStyle = WOOD.s;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let y = top; y <= bottom; y += 3) {
        const wave = Math.sin(y * 0.18 + this.age * 3) * (this.shivering ? 1 : 2.5) + shiver;
        if (y === top) ctx.moveTo(x + wave, y); else ctx.lineTo(x + wave, y);
      }
      ctx.stroke();
    }
    ctx.restore();
    // The peg on the end of it.
    if (!this.inBox) return;
    const frame = this.art.frames[0];
    ctx.save();
    ctx.globalAlpha = this.taut ? 1 : 0.6;
    ctx.drawImage(frame, Math.round(this.x - frame.width / 2), Math.round(bottom - 1));
    ctx.restore();
  }
}

export function crossbar(box, density) {
  let real = 0;
  let started = false;
  return {
    duration: 8.6,
    update: (dt, bullets) => {
      real += dt / density;
      if (started || real < 0.2) return;
      started = true;
      const dir = Math.random() < 0.5 ? -1 : 1;
      const bar = new Crossbar({ cx: box.x + box.w / 2, y: box.y + 7, theta0: Math.random() * 6.28, spin: dir * 0.5 * Math.min(1.2, density), warn: 0.9, life: 7.2 });
      bullets.push(bar);
      // (Two strings go taut together, the other two half a beat after.)
      for (let k = 0; k < 4; k++) bullets.push(new BarString({ box, k, bar, offset: k % 2 ? 0 : CYCLE / 2 }));
    },
  };
}

export const RUMBOLD_WOOD_ATTACKS = {
  rumboldAliveLimbs: (box, density, tools) => limbs(box, density, tools),
  rumboldAliveGouge: (box, density, tools) => gouge(box, density, tools),
  rumboldAliveJoints: (box, density, tools) => joints(box, density, tools),
  rumboldAliveCrossbar: (box, density, tools) => crossbar(box, density, tools),
};

// --- For his finale (rumboldAliveTear's last act, in rumboldAlive.js) ---

// One of his ball joints, flung up off the boards to burst into splinters:
// first a chalked lane up to where it will go, and a ring there; then up it
// goes (in `rise` seconds), turning, and bursts (`onBurst`). Dangerous only on
// its way up, and quick.
export class FlungJoint extends Shot {
  constructor({ x, floor, top, warn = 0.9, rise = 0.5, onBurst }) {
    super({ x, y: floor, art: 'pepBall', warn, life: rise + 0.05 });
    Object.assign(this, { floor, top, rise, onBurst });
    this.done = false;
    this.angle = 0;
  }

  update(dt) {
    this.age += dt;
    if (this.age < this.warn) return;
    const k = Math.min(1, (this.age - this.warn) / this.rise);
    const was = this.y;
    this.y = this.floor + (this.top - this.floor) * (1 - (1 - k) * (1 - k));
    this.vy = dt > 0 ? (this.y - was) / dt : 0;
    this.angle += dt * 14;
    if (k >= 1 && !this.done) {
      this.done = true;
      this.onBurst?.(this);
    }
  }

  isGone() { return this.done; }
  edgeDistance(px, py) { return this.age < this.warn || this.done ? Infinity : Math.hypot(px - this.x, py - this.y) - 3.5; }

  draw(ctx) {
    const x = Math.round(this.x);
    if (this.age < this.warn) {
      ctx.save();
      ctx.globalAlpha = warnAlpha(this.age) + 0.2;
      for (const [w, c] of [[3, WOOD.k], [1, WOOD.s]]) {
        ctx.lineWidth = w;
        ctx.strokeStyle = c;
        ctx.setLineDash(w === 3 ? [] : [3, 4]);
        ctx.beginPath(); ctx.moveTo(x + 0.5, this.floor); ctx.lineTo(x + 0.5, this.top); ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(x, this.top, 7, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
      return;
    }
    super.draw(ctx);
  }
}

// A ring of splinters bursting out of a joint (with a gap, if `gap` is an
// angle): they fly out, slow, and sink.
export function splinterRing(bullets, x, y, n, speed, turn, gap = null, dmg = null) {
  for (let i = 0; i < n; i++) {
    const a = turn + (i / n) * Math.PI * 2;
    if (gap !== null && Math.abs(((a - gap + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < 0.55) continue;
    const s = new Shot({ x: x + Math.cos(a) * 4, y: y + Math.sin(a) * 4, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, accel: -12, gravity: 8, life: 3.4, art: 'pepSplinter' });
    if (dmg !== null) s.dmg = dmg;
    bullets.push(s);
  }
}
