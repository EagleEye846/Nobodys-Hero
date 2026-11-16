import { makeSprite } from '../../engine/sprite.js';
import { clamp } from '../patternTools.js';
import { segDist, rectDist, warnAlpha } from './rumboldBullets.js';
import * as ART from '../../data/art/rumboldBattle.js';

// What the puppet throws once it's alive (phase 3 of King Peptup's fight; the
// attacks are in rumboldAlive.js). He's a wooden marionette with a light in
// him, running his own show with nobody's hand in him, so it's all HIM now:
// his own arms and legs flung on their strings, his jaw, the stage
// directions he can't stop saying, the strings, Tuck, and the light leaking
// out of the gaps in his joints.
//
// Bullets of their own, drawn in canvas shapes (see projectiles.js for what a
// bullet needs). The cuttable ones (CUT THE STRING, `snip` in
// src/battle/soulAbilities.js) have `cuttable`, `cutDistance(x, y)` and
// `cut(battle)`.

const TAU = Math.PI * 2;
// (His pale bare wood, as he is in battle: peptupPuppet.js. No paint left
// on him, and nothing red.)
export const C = {
  k: '#0a0710', // outline
  wood: '#c9a06a',
  woodLight: '#e6c896',
  woodDark: '#8e6844',
  peg: '#d4ac48',
  paint: '#e6c896', // a shoe (bare wood now)
  paintDark: '#563c28',
  string: '#d8d2c4',
  tooth: '#f6e6c4', // carved wooden teeth
  toothDark: '#c9a06a',
  gum: '#2c1c14', // the dark of the jaw slot
};
// The light in him: a white-gold core, warm round it, cold at the edge.
export const LIGHT = { core: '255, 240, 180', warm: '255, 138, 28', cold: '196, 60, 10' };

export const fill = (ctx, color, x, y, w, h) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};

// A string, a little slack unless it's pulling.
export function drawString(ctx, x0, y0, x1, y1, sag = 0, color = C.string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.quadraticCurveTo((x0 + x1) / 2 + sag, (y0 + y1) / 2 + Math.abs(sag), x1, y1);
  ctx.stroke();
}

// --- His arms and legs, flung on strings ---

// One of his own limbs on a string from offstage: an arm (forearm, peg
// joint, carved hand) or a leg (shin, peg, a red-painted shoe). It shows
// the line it'll fly along first (a dotted string, pulled taut), then shoots
// out along it from `from` to `to`, hangs a moment, and is yanked back the
// same way. The string can be cut: the limb drops, harmless.
//
// `creepy`: it comes with the rest of the limb on, bent the wrong way at the
// elbow or knee and twitching there, the fingers working, the light leaking
// out of the joint, the string thrumming. (Drawn only: what hurts is the
// same 11 at the tip.)
export class FlungLimb {
  constructor({ from, to, kind = 'arm', warn = 0.7, out = 170, back = 130, hang = 0.15, creepy = false }) {
    Object.assign(this, { from, to, kind, warn, out, back, hang, creepy });
    // (Which way it's broken, and how far: its own, for each limb.)
    this.bend = (Math.random() < 0.5 ? -1 : 1) * (2.0 + Math.random() * 0.5);
    this.angle = Math.atan2(to.y - from.y, to.x - from.x);
    this.length = Math.hypot(to.x - from.x, to.y - from.y);
    this.outTime = this.length / out;
    this.backTime = this.length / back;
    this.age = 0;
    this.d = 0; // how far along the line it is
    this.dmg = null;
    this.grazed = false;
    this.severed = false;
    this.fall = null;
  }

  get x() { return this.from.x + Math.cos(this.angle) * this.d; }
  get y() { return this.from.y + Math.sin(this.angle) * this.d; }
  get flying() { return !this.severed && this.age >= this.warn; }

  update(dt) {
    this.age += dt;
    if (this.severed) {
      this.fall.vy += 240 * dt;
      this.fall.x += this.fall.vx * dt;
      this.fall.y += this.fall.vy * dt;
      this.fall.spin += dt * 7;
      return;
    }
    const t = this.age - this.warn;
    if (t < 0) return;
    if (t < this.outTime) this.d = this.out * t;
    else if (t < this.outTime + this.hang) this.d = this.length;
    else this.d = Math.max(0, this.length - this.back * (t - this.outTime - this.hang));
  }

  isGone() {
    if (this.severed) return this.fall.y > 200;
    return this.age > this.warn + this.outTime + this.hang + this.backTime + 0.05;
  }

  // The limb itself: 11 long, along its line, behind its tip.
  edgeDistance(px, py) {
    if (!this.flying || this.d < 2) return Infinity;
    const x1 = this.x;
    const y1 = this.y;
    const x0 = x1 - Math.cos(this.angle) * 11;
    const y0 = y1 - Math.sin(this.angle) * 11;
    return segDist(px, py, x0, y0, x1, y1) - 2.2;
  }

  get cuttable() { return this.flying && this.d > 4; }
  cutDistance(px, py) { return segDist(px, py, this.from.x, this.from.y, this.x, this.y); }
  cut() {
    this.severed = true;
    this.fall = { x: this.x, y: this.y, vx: Math.cos(this.angle) * 20, vy: -20, spin: this.angle };
  }

  drawLimb(ctx, x, y, angle) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.rotate(angle);
    if (this.creepy) {
      // The upper arm (or thigh), on past the joint and folded back the
      // wrong way, ticking in jerks as if it's trying to straighten.
      const tick = Math.floor(this.age * 13);
      const twitch = Math.sin(tick * 12.9898) * 0.22 + (tick % 7 === 0 ? 0.35 : 0);
      ctx.save();
      ctx.translate(-13, 0);
      ctx.rotate(this.bend + twitch * Math.sign(this.bend));
      fill(ctx, C.k, -10, -2, 10, 4);
      fill(ctx, C.wood, -9, -1, 8, 2);
      fill(ctx, C.woodDark, -9, 0, 8, 1);
      // A split down it, lit from inside.
      fill(ctx, C.k, -7, -1, 3, 1);
      ctx.fillStyle = `rgba(${LIGHT.core}, ${(0.7 + 0.3 * Math.sin(this.age * 31)).toFixed(3)})`;
      ctx.fillRect(-6, -1, 1, 1);
      // The peg at its far end, where it came off him.
      fill(ctx, C.k, -12, -2, 3, 4);
      fill(ctx, C.peg, -11, -1, 1, 2);
      ctx.restore();
    }
    // Drawn pointing right, the tip (hand or shoe) at 0.
    fill(ctx, C.k, -12, -2, 10, 4);
    fill(ctx, C.wood, -11, -1, 8, 2);
    fill(ctx, C.woodLight, -11, -1, 8, 1);
    // The peg joint at the back end.
    fill(ctx, C.k, -14, -2, 3, 4);
    fill(ctx, C.peg, -13, -1, 1, 2);
    if (this.creepy) {
      // The light in the joint, leaking out round the peg.
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `rgba(${LIGHT.warm}, 0.45)`;
      ctx.fillRect(-15, -3, 5, 6);
      ctx.fillStyle = `rgb(${LIGHT.core})`;
      ctx.fillRect(-13, 0, 1, 1);
      ctx.globalCompositeOperation = 'source-over';
    }
    if (this.kind === 'arm' && this.creepy) {
      // A carved hand, the long fingers working on their own.
      const t = Math.floor(this.age * 11);
      fill(ctx, C.k, -3, -3, 5, 6);
      fill(ctx, C.woodLight, -2, -2, 3, 4);
      [-3, -1, 1].forEach((fy, i) => {
        const len = 2 + ((t + i * 2) % 3 === 0 ? 2 : (t + i) % 2);
        fill(ctx, C.k, 2, fy, len, 1);
        fill(ctx, C.wood, 1, fy + 1, len - 1, 1);
      });
    } else if (this.kind === 'arm') {
      // A carved hand, fingers spread.
      fill(ctx, C.k, -3, -3, 5, 6);
      fill(ctx, C.woodLight, -2, -2, 3, 4);
      fill(ctx, C.k, 2, -3, 2, 1);
      fill(ctx, C.k, 2, -1, 2, 1);
      fill(ctx, C.k, 2, 1, 2, 1);
      fill(ctx, C.wood, 1, -2, 2, 1);
      fill(ctx, C.wood, 1, 0, 2, 1);
      fill(ctx, C.wood, 1, 2, 1, 1);
    } else {
      // A shoe, painted red, with a gold buckle.
      fill(ctx, C.k, -4, -3, 7, 7);
      fill(ctx, C.paint, -3, -2, 5, 5);
      fill(ctx, C.paintDark, -3, 2, 5, 1);
      fill(ctx, C.peg, -1, -1, 1, 1);
    }
    ctx.restore();
  }

  draw(ctx) {
    ctx.save();
    if (this.age < this.warn) {
      // The line it'll fly: a string pulled taut, blinking.
      ctx.globalAlpha = warnAlpha(this.age);
      ctx.strokeStyle = C.string;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(this.from.x, this.from.y);
      ctx.lineTo(this.to.x, this.to.y);
      ctx.stroke();
      ctx.setLineDash([]);
      // Where it'll stop: the tip, ghosted.
      ctx.globalAlpha *= 0.6;
      this.drawLimb(ctx, this.to.x, this.to.y, this.angle);
      ctx.restore();
      return;
    }
    if (this.severed) {
      ctx.globalAlpha = 0.85;
      this.drawLimb(ctx, this.fall.x, this.fall.y, this.fall.spin);
      ctx.restore();
      return;
    }
    // (Creepy: the string thrums as the limb hangs at the end of it.)
    const thrum = this.creepy && this.d >= this.length - 1 ? Math.sin(this.age * 70) * 1.5 : 0;
    drawString(ctx, this.from.x, this.from.y, this.x, this.y, thrum);
    this.drawLimb(ctx, this.x, this.y, this.angle);
    ctx.restore();
  }
}

// --- The jaw ---

// How high the lower teeth stand in the gum when they're not biting.
const STUB = 5;

// His jaw, with the box inside it. Painted wooden teeth along the top that
// creep down as it goes on; and the lower teeth, a row of pegs that shoot up
// to bite. Where a tooth is missing (`gap`, a column) the light inside him
// shines up through it first: that's the place to be when it clacks.
// `controller` is the attack's own state ({ teeth, clackAt, gapCols... }).
//
// `regrow` (seconds): a missing tooth doesn't snap back the moment the gap
// moves on, but grows back up out of the gum over that long (harmless till
// it's up), so standing low in the old gap isn't an instant hit. `painted`:
// the teeth look like his: piano keys and painted pegs, chipped, the gold
// one, cracks the light shows through as the jaw closes.
export class Jaw {
  constructor({ box, cols = 10, regrow = 0, painted = false }) {
    this.box = box;
    this.cols = cols;
    this.regrow = regrow;
    this.painted = painted;
    this.backAt = new Array(cols).fill(-99); // when each missing tooth started back
    this.missing = new Array(cols).fill(false);
    this.cw = box.w / cols;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    // The upper teeth: how far down they reach.
    this.upper = 4;
    // Each bite: { warnAt, at, gap: [col, ...] }; the one showing or biting.
    this.bite = null;
    this.height = 0; // how far up the lower teeth are, 0 to 1
  }

  update(dt) {
    this.age += dt;
    const b = this.bite;
    if (this.regrow) {
      for (let c = 0; c < this.cols; c++) {
        const gone = !!(b && b.gap.includes(c) && this.age >= b.warnAt);
        if (this.missing[c] && !gone) this.backAt[c] = this.age;
        this.missing[c] = gone;
      }
    }
    if (!b) {
      this.height = 0;
      return;
    }
    const t = this.age - b.at;
    // Up in a snap, held, then down.
    if (t < 0) this.height = 0;
    else if (t < 0.1) this.height = t / 0.1;
    else if (t < 0.32) this.height = 1;
    else if (t < 0.55) this.height = 1 - (t - 0.32) / 0.23;
    else this.height = 0;
  }

  isGone() { return this.age > 9.5; }

  // How far a tooth is grown back (1, all the way, unless it's `regrow`ing).
  grown(c) {
    if (!this.regrow) return 1;
    return Math.min(1, Math.max(0, (this.age - this.backAt[c]) / this.regrow));
  }

  // How high the lower teeth stand: stubs in the gum, or up and biting.
  get lowerTop() {
    const { box } = this;
    return box.y + box.h - Math.max(STUB, (box.h - this.upper) * this.height);
  }

  // Teeth bite, all of them, whatever they're doing: the upper row, and the
  // lower one (stubs or up), all but the missing ones.
  edgeDistance(px, py) {
    const { box } = this;
    let d = rectDist(px, py, box.x, box.y, box.w, this.upper);
    const top = this.lowerTop;
    for (let c = 0; c < this.cols; c++) {
      if (this.bite?.gap.includes(c) && this.age >= this.bite.warnAt) continue;
      const g = this.grown(c);
      if (g < 1) continue;
      d = Math.min(d, rectDist(px, py, box.x + c * this.cw + 0.5, top, this.cw - 1, box.y + box.h - top));
    }
    return d;
  }

  draw(ctx) {
    const { box, cw } = this;
    ctx.save();
    // The light through the missing teeth, before and as it bites.
    const b = this.bite;
    if (b && this.age >= b.warnAt) {
      const before = b.at - this.age;
      const blink = before > 0 ? warnAlpha(this.age) : 0.5;
      ctx.globalCompositeOperation = 'lighter';
      for (const c of b.gap) {
        const x = box.x + c * cw;
        const g = ctx.createLinearGradient(0, box.y + box.h, 0, box.y);
        g.addColorStop(0, `rgba(${LIGHT.core}, ${(0.55 * blink).toFixed(3)})`);
        g.addColorStop(0.5, `rgba(${LIGHT.warm}, ${(0.25 * blink).toFixed(3)})`);
        g.addColorStop(1, `rgba(${LIGHT.cold}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(x, box.y, cw, box.h);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    if (this.painted) {
      this.drawPainted(ctx);
      ctx.restore();
      return;
    }
    // The upper teeth.
    for (let c = 0; c < this.cols; c++) {
      const x = box.x + c * cw;
      fill(ctx, C.gum, x, box.y, cw, 2);
      fill(ctx, C.k, x + 0.5, box.y + 1, cw - 1, this.upper);
      fill(ctx, C.tooth, x + 1.5, box.y + 1, cw - 3, this.upper - 1);
      fill(ctx, C.toothDark, x + cw - 2.5, box.y + 1, 1, this.upper - 1);
    }
    // The lower teeth: stubs in the gum, or up and biting.
    const top = this.lowerTop;
    for (let c = 0; c < this.cols; c++) {
      const x = box.x + c * cw;
      if (b && b.gap.includes(c) && this.age >= b.warnAt) continue;
      fill(ctx, C.k, x + 0.5, top, cw - 1, box.y + box.h - top);
      fill(ctx, C.tooth, x + 1.5, top + 1, cw - 3, box.y + box.h - top - 1);
      fill(ctx, C.toothDark, x + 1.5, top + 1, 1, box.y + box.h - top - 1);
      // One of them is gold.
      if (c === 3) fill(ctx, '#f0c050', x + 2.5, top + 1, cw - 5, 2);
    }
    fill(ctx, C.gum, box.x, box.y + box.h - 2, box.w, 2);
    ctx.restore();
  }

  // His own teeth: a row of old piano keys along the top (the black ones
  // hanging between), and carved pegs below, the ivory paint worn and
  // chipped, one gold. Cracks run up some of them, and as the jaw closes
  // the light inside him shows through the cracks.
  drawPainted(ctx) {
    const { box, cw } = this;
    const b = this.bite;
    const bottom = box.y + box.h;
    // How hot the light behind the teeth is: more as the mouth closes.
    const heat = Math.min(1, (this.upper - 4) / 8) * (0.75 + 0.25 * Math.sin(this.age * 23));
    const crack = (x, y0, y1, c) => {
      // A crack zigzagging up a tooth, light in it.
      for (let y = Math.ceil(y0); y < y1; y++) {
        const dx = ((y + c) % 3 === 0) ? 1 : 0;
        fill(ctx, C.toothDark, x + dx, y, 1, 1);
        if (heat > 0.2 && (y + c) % 2 === 0) {
          ctx.fillStyle = `rgba(${LIGHT.core}, ${(heat * 0.9).toFixed(3)})`;
          ctx.fillRect(Math.round(x + dx), y, 1, 1);
        }
      }
    };
    // The upper row: white keys...
    const upper = this.upper;
    for (let c = 0; c < this.cols; c++) {
      const x = box.x + c * cw;
      fill(ctx, C.gum, x, box.y, cw, 2);
      fill(ctx, C.k, x + 0.5, box.y + 1, cw - 1, upper);
      fill(ctx, C.tooth, x + 1.5, box.y + 1, cw - 3, upper - 1);
      fill(ctx, C.toothDark, x + 1.5, box.y + upper - 1, cw - 3, 1);
      // (A chip off the corner of some.)
      if (c % 4 === 1) fill(ctx, C.k, x + cw - 2.5, box.y + upper - 1, 1, 1);
      if (c % 3 === 2) crack(x + 3.5, box.y + 2, box.y + upper - 1, c);
    }
    // ...and the black keys hung between them, two and three, like a piano.
    for (const c of [1, 2, 4, 5, 6, 8, 9]) {
      const x = box.x + c * cw;
      fill(ctx, C.k, x - 1.5, box.y + 1, 3, upper * 0.6);
      fill(ctx, '#3a2a20', x - 0.5, box.y + 1, 1, upper * 0.6 - 1);
    }
    // The lower row: pegs, stubs in the gum, or up and biting.
    const top = this.lowerTop;
    for (let c = 0; c < this.cols; c++) {
      const x = box.x + c * cw;
      if (b && b.gap.includes(c) && this.age >= b.warnAt) {
        // An empty socket, the light right in it.
        fill(ctx, C.k, x + 1.5, bottom - 3, cw - 3, 2);
        continue;
      }
      const g = this.grown(c);
      const t = g < 1 ? bottom - Math.max(1, (bottom - top) * g) : top;
      const h = bottom - t;
      fill(ctx, C.k, x + 0.5, t, cw - 1, h);
      // (One coming back: pale new wood, not painted yet.)
      fill(ctx, g < 1 ? C.woodLight : C.tooth, x + 1.5, t + 1, cw - 3, h - 1);
      fill(ctx, C.toothDark, x + 1.5, t + 1, 1, h - 1);
      if (g < 1) continue;
      // Worn: the paint's off down one side, showing the wood.
      if (c % 3 === 0 && h > 6) fill(ctx, C.wood, x + cw - 3, t + 3, 1, h - 5);
      // A rounded, chipped top.
      fill(ctx, C.k, x + (c % 2 ? cw - 2.5 : 1.5), t + 1, 1, 1);
      // One of them is gold.
      if (c === 3) {
        fill(ctx, '#f0c050', x + 1.5, t + 1, cw - 3, 2);
        fill(ctx, '#fff2b0', x + 2.5, t + 1, 1, 1);
      }
      if (c % 3 === 1 && h > 8) crack(x + 4.5, t + 2, bottom - 3, c);
    }
    // As they meet: a hard white clack where the teeth hit.
    if (b && this.age >= b.at && this.age < b.at + 0.08) {
      ctx.globalAlpha = 1 - (this.age - b.at) / 0.08;
      fill(ctx, '#ffffff', box.x, box.y + upper, box.w, 1);
      ctx.globalAlpha = 1;
    }
    fill(ctx, C.gum, box.x, bottom - 2, box.w, 2);
  }
}

// --- Stage directions ---

// 3x5 letters for the wooden blocks.
const FONT = {
  A: ['.X.', 'X.X', 'XXX', 'X.X', 'X.X'], B: ['XX.', 'X.X', 'XX.', 'X.X', 'XX.'], C: ['.XX', 'X..', 'X..', 'X..', '.XX'],
  D: ['XX.', 'X.X', 'X.X', 'X.X', 'XX.'], E: ['XXX', 'X..', 'XX.', 'X..', 'XXX'], G: ['.XX', 'X..', 'X.X', 'X.X', '.XX'],
  H: ['X.X', 'X.X', 'XXX', 'X.X', 'X.X'], I: ['XXX', '.X.', '.X.', '.X.', 'XXX'], L: ['X..', 'X..', 'X..', 'X..', 'XXX'],
  N: ['X.X', 'XXX', 'XXX', 'X.X', 'X.X'], O: ['.X.', 'X.X', 'X.X', 'X.X', '.X.'], P: ['XX.', 'X.X', 'XX.', 'X..', 'X..'],
  R: ['XX.', 'X.X', 'XX.', 'X.X', 'X.X'], S: ['.XX', 'X..', '.X.', '..X', 'XX.'], T: ['XXX', '.X.', '.X.', '.X.', '.X.'],
  U: ['X.X', 'X.X', 'X.X', 'X.X', '.X.'], V: ['X.X', 'X.X', 'X.X', '.X.', '.X.'], W: ['X.X', 'X.X', 'XXX', 'XXX', 'X.X'],
  X: ['X.X', 'X.X', '.X.', 'X.X', 'X.X'], Y: ['X.X', 'X.X', '.X.', '.X.', '.X.'], Q: ['.X.', 'X.X', 'X.X', '.X.', '..X'],
  '(': ['.X', 'X.', 'X.', 'X.', '.X'], ')': ['X.', '.X', '.X', '.X', 'X.'], '-': ['...', '...', 'XXX', '...', '...'],
  '!': ['X', 'X', 'X', '.', 'X'],
};
export const BLOCK = 7;
export const BLOCK_STEP = 8;

// A row of wooden letter blocks spelling a stage direction, falling down the
// box in jerks (the rigging's jammed: drop, catch, drop). Spaces are gaps.
// When it hits the floor it breaks up, and two of its splinters skitter off
// along the boards.
//
// `peel`: old, worn blocks, hung from the flies. A rope runs up from each
// end of the row; each catch rattles the blocks in their places; and here and
// there a painted letter flakes off and flutters down on its own (harmless:
// only the wood hurts), leaving a bare block.
export class CueRow {
  constructor({ box, word, x, y, speed = 40, jerk = 0.55, onLand = null, peel = false }) {
    Object.assign(this, { box, word, x, y, speed, jerk, onLand, peel });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.landed = false;
    this.blocks = [...word].map((ch, i) => (ch === ' ' ? null : { ch, dx: i * BLOCK_STEP })).filter(Boolean);
    this.flakes = [];
    this.rattle = 0;
    if (peel) {
      for (const b of this.blocks) {
        if (Math.random() < 0.22) b.peelAt = 0.7 + Math.random() * 1.6;
      }
    }
  }

  update(dt) {
    const before = (this.age % this.jerk) / this.jerk;
    this.age += dt;
    for (const f of this.flakes) {
      f.age += dt;
      f.y += 22 * dt;
      f.x += Math.sin(f.age * 9 + f.seed) * 14 * dt;
    }
    this.flakes = this.flakes.filter((f) => f.age < 1.1);
    if (this.landed) return;
    // Drop, catch, drop: it moves for most of each jerk and hangs for the rest.
    const phase = (this.age % this.jerk) / this.jerk;
    if (this.peel) {
      // Caught short: the blocks rattle.
      if (before < 0.7 && phase >= 0.7) this.rattle = 0.12;
      this.rattle = Math.max(0, this.rattle - dt);
      for (const b of this.blocks) {
        if (b.peelAt === undefined || b.bare || this.age < b.peelAt) continue;
        b.bare = true;
        this.flakes.push({ ch: b.ch, x: this.x + b.dx + 1, y: this.y + 1, age: 0, seed: Math.random() * 6 });
      }
    }
    this.y += this.speed * dt * (phase < 0.7 ? 1.4 : 0.05);
    if (this.y + BLOCK >= this.box.y + this.box.h) {
      this.y = this.box.y + this.box.h - BLOCK;
      this.landed = true;
      this.onLand?.(this);
    }
  }

  isGone() { return this.landed; }

  edgeDistance(px, py) {
    let d = Infinity;
    for (const b of this.blocks) d = Math.min(d, rectDist(px, py, this.x + b.dx, this.y, BLOCK, BLOCK));
    return d;
  }

  draw(ctx) {
    if (!this.peel) {
      for (const b of this.blocks) drawBlock(ctx, this.x + b.dx, this.y, b.ch);
      return;
    }
    ctx.save();
    // The two ropes it hangs by, up into the flies.
    const first = this.blocks[0];
    const lastBlock = this.blocks[this.blocks.length - 1];
    ctx.globalAlpha = 0.35;
    for (const bx of [this.x + first.dx + 3, this.x + lastBlock.dx + 3]) fill(ctx, C.string, bx, this.box.y - 60, 1, this.y - this.box.y + 60);
    ctx.globalAlpha = 1;
    this.blocks.forEach((b, i) => {
      const shake = this.rattle > 0 ? ((i * 7 + Math.floor(this.age * 40)) % 3) - 1 : 0;
      drawBlock(ctx, this.x + b.dx, this.y + shake, b.bare ? null : b.ch);
      // A bare block keeps the ghost of its letter, where the paint was.
      if (b.bare) ghostGlyph(ctx, this.x + b.dx, this.y + shake, b.ch);
    });
    // The letters that came off, fluttering down.
    for (const f of this.flakes) {
      const glyph = FONT[f.ch];
      if (!glyph) continue;
      ctx.globalAlpha = Math.max(0, 1 - f.age / 1.1);
      ctx.fillStyle = f.ch === '(' || f.ch === ')' ? '#2a62c8' : C.paintDark;
      const flip = Math.floor(f.age * 10 + f.seed) % 3 === 0;
      glyph.forEach((row, j) => [...row].forEach((c, k) => {
        if (c === 'X') ctx.fillRect(Math.round(f.x) + (flip ? row.length - 1 - k : k), Math.round(f.y) + j, 1, 1);
      }));
    }
    ctx.restore();
  }
}

export function drawBlock(ctx, x, y, ch) {
  x = Math.round(x);
  y = Math.round(y);
  fill(ctx, C.k, x, y, BLOCK, BLOCK);
  fill(ctx, C.woodLight, x + 1, y + 1, BLOCK - 2, BLOCK - 2);
  fill(ctx, C.wood, x + 1, y + BLOCK - 2, BLOCK - 2, 1);
  fill(ctx, C.wood, x + BLOCK - 2, y + 1, 1, BLOCK - 2);
  const glyph = FONT[ch];
  if (!glyph) return;
  const gx = x + 1 + Math.floor((BLOCK - 2 - glyph[0].length) / 2);
  ctx.fillStyle = ch === '(' || ch === ')' ? '#2a62c8' : C.paintDark;
  glyph.forEach((row, j) => [...row].forEach((c, i) => {
    if (c === 'X') ctx.fillRect(gx + i, y + 1 + j, 1, 1);
  }));
}

// The faint mark a letter leaves on a block when its paint comes off.
function ghostGlyph(ctx, x, y, ch) {
  const glyph = FONT[ch];
  if (!glyph) return;
  x = Math.round(x);
  y = Math.round(y);
  const gx = x + 1 + Math.floor((BLOCK - 2 - glyph[0].length) / 2);
  ctx.fillStyle = C.wood;
  glyph.forEach((row, j) => [...row].forEach((c, i) => {
    if (c === 'X' && (i + j) % 2 === 0) ctx.fillRect(gx + i, y + 1 + j, 1, 1);
  }));
}

// A splinter off a broken block, skittering along the floor.
export class Splinter {
  constructor({ x, y, vx, life = 1.6 }) {
    Object.assign(this, { x, y, vx, life });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  update(dt) {
    this.age += dt;
    this.x += this.vx * dt;
    this.vx *= 1 - dt * 0.4;
  }

  isGone(box) { return this.age > this.life || this.x < box.x - 8 || this.x > box.x + box.w + 8; }
  edgeDistance(px, py) { return rectDist(px, py, this.x - 3, this.y - 1, 6, 2); }
  draw(ctx) {
    const spin = Math.floor(this.age * 14) % 2;
    fill(ctx, C.k, this.x - 3, this.y - 1 - spin, 7, 3);
    fill(ctx, C.wood, this.x - 2, this.y - spin, 5, 1);
  }
}

// --- The dance ---

// A string from the rig that catches your shadow and, after a moment going
// taut (`warn`), jerks it toward where it's tied (`pull` pixels a second for
// `jerk` seconds; fight it by heading the other way). Cut it before it pulls
// and you're free.
export class DanceString {
  constructor({ anchor, soul, warn = 0.55, pull = 95, jerk = 0.28 }) {
    Object.assign(this, { anchor, soul, warn, pull, jerk });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.severed = false;
    this.cutAt = 0;
  }

  get pulling() { return !this.severed && this.age >= this.warn && this.age < this.warn + this.jerk; }
  get cuttable() { return !this.severed && this.age < this.warn + this.jerk; }
  cutDistance(px, py) { return segDist(px, py, this.anchor.x, this.anchor.y, this.soul.x, this.soul.y - 2); }
  cut() { this.severed = true; this.cutAt = this.age; }

  update(dt) { this.age += dt; }
  isGone() { return this.severed ? this.age - this.cutAt > 0.4 : this.age > this.warn + this.jerk + 0.15; }
  edgeDistance() { return Infinity; }

  // Where it means to put you: from `x, y`, `jerk` seconds of pull.
  landing(x, y) {
    const d = Math.hypot(this.anchor.x - x, this.anchor.y - y) || 1;
    const go = Math.min(d, this.pull * this.jerk);
    return { x: x + ((this.anchor.x - x) / d) * go, y: y + ((this.anchor.y - y) / d) * go };
  }

  draw(ctx) {
    ctx.save();
    const sx = this.soul.x;
    const sy = this.soul.y - 2;
    if (this.severed) {
      // Two loose ends, curling away.
      const t = (this.age - this.cutAt) / 0.4;
      ctx.globalAlpha = 1 - t;
      drawString(ctx, this.anchor.x, this.anchor.y, (this.anchor.x + sx) / 2, (this.anchor.y + sy) / 2 + t * 10, 4);
      ctx.restore();
      return;
    }
    const taut = this.age >= this.warn;
    ctx.globalAlpha = taut ? 1 : 0.35 + 0.65 * (this.age / this.warn);
    drawString(ctx, this.anchor.x, this.anchor.y, sx, sy, taut ? 0 : 6 * (1 - this.age / this.warn), taut ? '#ffffff' : C.string);
    // An arrow on it, pointing the way it'll pull.
    const a = Math.atan2(this.anchor.y - sy, this.anchor.x - sx);
    const ax = sx + Math.cos(a) * 9;
    const ay = sy + Math.sin(a) * 9;
    ctx.fillStyle = taut ? '#ffe14d' : C.string;
    ctx.beginPath();
    ctx.moveTo(ax + Math.cos(a) * 3, ay + Math.sin(a) * 3);
    ctx.lineTo(ax + Math.cos(a + 2.5) * 3, ay + Math.sin(a + 2.5) * 3);
    ctx.lineTo(ax + Math.cos(a - 2.5) * 3, ay + Math.sin(a - 2.5) * 3);
    ctx.fill();
    // The little brass hook on you.
    fill(ctx, C.peg, sx, sy - 1, 1, 2);
    ctx.restore();
  }
}

// A dance step: a shoe print chalked on the boards (`warn`), then his
// wooden shoe stamps down on it. Only the stamp hurts.
export class Stamp {
  constructor({ x, y, warn = 0.85, life = 0.28, flip = false }) {
    Object.assign(this, { x, y, warn, life, flip });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get down() { return this.age >= this.warn && this.age < this.warn + this.life; }
  update(dt) { this.age += dt; }
  isGone() { return this.age > this.warn + this.life + 0.35; }
  edgeDistance(px, py) { return this.down ? rectDist(px, py, this.x - 4, this.y - 6, 8, 12) : Infinity; }

  draw(ctx) {
    const { x, y } = this;
    ctx.save();
    if (this.age < this.warn) {
      // The chalk print: a sole and a heel.
      ctx.globalAlpha = warnAlpha(this.age);
      ctx.strokeStyle = '#f4ecdc';
      ctx.lineWidth = 1;
      ctx.strokeRect(Math.round(x - 3) + 0.5, Math.round(y - 6) + 0.5, 6, 7);
      ctx.strokeRect(Math.round(x - 2) + 0.5, Math.round(y + 3) + 0.5, 4, 3);
      ctx.restore();
      return;
    }
    const since = this.age - this.warn;
    if (since > this.life) ctx.globalAlpha = Math.max(0, 1 - (since - this.life) / 0.35);
    // The shoe, coming down hard (it drops the last few pixels).
    const drop = Math.max(0, 6 - since * 60);
    fill(ctx, C.k, x - 5, y - 7 - drop, 10, 14);
    fill(ctx, C.paint, x - 4, y - 6 - drop, 8, 8);
    fill(ctx, C.paintDark, x - 4, y + 1 - drop, 8, 1);
    fill(ctx, C.woodDark, x - 3, y + 2 - drop, 6, 4);
    fill(ctx, C.peg, x - 1, y - 4 - drop, 2, 2);
    if (since < 0.12) {
      // Dust where it lands.
      ctx.globalAlpha = 0.7;
      fill(ctx, '#e8dcc4', x - 7, y + 6, 3, 1);
      fill(ctx, '#e8dcc4', x + 5, y + 6, 3, 1);
    }
    ctx.restore();
  }
}

// --- Tuck, on the strings ---

let tuckLooks = null;
function tuckSprites() {
  if (tuckLooks) return tuckLooks;
  const palette = ART.RUMBOLD_PALETTE;
  const anim = ART.TUCK_STRUNG_ANIM;
  const one = ART.TUCK_STRUNG_SPRITE;
  tuckLooks = {
    idle: (anim?.idle?.frames ?? (one ? [one] : [])).map((rows) => makeSprite(rows, palette)),
    down: (anim?.down?.frames ?? (one ? [one] : [])).map((rows) => makeSprite(rows, palette)),
  };
  return tuckLooks;
}
// Where his strings tie on (in his own 16x22), and how big he is.
const TUCK_W = 16;
const TUCK_H = 22;
const TUCK_TIES = Object.values(ART.TUCK_STRUNG_ANCHORS ?? { head: [8, 1], wristL: [2, 8], wristR: [13, 8] });

// Tuck, hung from three strings and swung through the box like a trapeze by
// the puppet that's working him now. Don't let him hit you. His strings run
// up out of the top of the box: SNIP them (SHIFT, near a string) and each one
// cut is a kindness that fills his MERCY. Cut all three and he drops out of
// the box, free (for now).
//
// `scared`: and he's terrified: he shakes, his strings tremble with him,
// and sweat flies off him at the top of each swing.
export class TuckSwing {
  constructor({ pivot, length = 66, swing = 0.8, period = 2.7, phase = 0, warn = 0.8, life = 6, mercy = 6, scared = false }) {
    Object.assign(this, { pivot, length, swing, period, phase, warn, life, mercy, scared });
    this.drops = [];
    this.lastSwingV = 0;
    this.isTuck = true;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.snipped = [false, false, false];
    this.free = null; // once he's dropped: { x, y, vy }
    this.tilt = 0;
  }

  get angle() {
    const t = Math.max(0, this.age - this.warn);
    // He swings in from the side, then on the full arc.
    const grow = Math.min(1, t / 0.9);
    return Math.PI / 2 + this.swing * grow * Math.sin((t / this.period) * TAU + this.phase);
  }

  // Where he is: the middle of him.
  get x() { return this.free ? this.free.x : this.pivot.x + Math.cos(this.angle) * this.length; }
  get y() { return this.free ? this.free.y : this.pivot.y + Math.sin(this.angle) * this.length; }
  get live() { return !this.free && this.age >= this.warn && this.age < this.warn + this.life; }

  // His strings: from the pivot to where each ties on him (the cut ones hang loose).
  ties() {
    const left = this.x - TUCK_W / 2;
    const top = this.y - TUCK_H / 2;
    return TUCK_TIES.map(([ax, ay]) => ({ x: left + ax, y: top + ay }));
  }

  update(dt) {
    const was = this.angle;
    this.age += dt;
    if (this.scared) {
      // Sweat, flung off as he turns at the top of a swing.
      const v = this.angle - was;
      if (this.live && Math.sign(v) !== Math.sign(this.lastSwingV) && this.lastSwingV !== 0) {
        for (let i = 0; i < 2; i++) this.drops.push({ x: this.x + (i ? 4 : -4), y: this.y - 8, vx: -Math.sign(this.lastSwingV) * (20 + i * 12), vy: -30 - i * 10, age: 0 });
      }
      this.lastSwingV = v;
      for (const d of this.drops) {
        d.age += dt;
        d.vy += 160 * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
      }
      this.drops = this.drops.filter((d) => d.age < 0.6);
    }
    if (this.free) {
      this.free.vy += 160 * dt;
      this.free.y += this.free.vy * dt;
      this.tilt *= 1 - dt * 3;
    }
  }

  isGone(box) {
    if (this.free) return this.free.y > box.y + box.h + 30;
    return this.age > this.warn + this.life + 0.5;
  }

  edgeDistance(px, py) {
    if (!this.live) return Infinity;
    return rectDist(px, py, this.x - 5, this.y - 8, 10, 17);
  }

  // (One string a snip: the blades close once.)
  get cuttable() { return this.live && this.snipped.includes(false) && this.age - (this.snippedAt ?? -9) > 0.4; }
  cutDistance(px, py) {
    let d = Infinity;
    this.ties().forEach((tie, i) => {
      if (!this.snipped[i]) d = Math.min(d, segDist(px, py, this.pivot.x, this.pivot.y, tie.x, tie.y));
    });
    return d;
  }

  cut(battle) {
    // The nearest of his strings goes.
    const soul = battle?.soul ?? { x: this.x, y: this.y - 20 };
    let best = -1;
    let bestD = Infinity;
    this.ties().forEach((tie, i) => {
      if (this.snipped[i]) return;
      const d = segDist(soul.x, soul.y, this.pivot.x, this.pivot.y, tie.x, tie.y);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    if (best < 0) return;
    this.snipped[best] = true;
    this.snippedAt = this.age;
    this.tilt += best === 1 ? -0.5 : best === 2 ? 0.5 : 0;
    battle?.addMercy?.(battle.phased, this.mercy, this.x, this.y - 18);
    // All three: he drops, free.
    if (!this.snipped.includes(false)) this.free = { x: this.x, y: this.y, vy: -30 };
  }

  draw(ctx) {
    const looks = tuckSprites();
    ctx.save();
    if (this.age < this.warn) {
      // The arc he'll swing on.
      ctx.globalAlpha = warnAlpha(this.age) * 0.8;
      ctx.strokeStyle = C.string;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.arc(this.pivot.x, this.pivot.y, this.length, Math.PI / 2 - this.swing, Math.PI / 2 + this.swing);
      ctx.stroke();
      ctx.restore();
      return;
    }
    const over = this.age - (this.warn + this.life);
    if (over > 0 && !this.free) ctx.globalAlpha = Math.max(0, 1 - over / 0.5);
    // (Scared: he shakes, in little hard jerks, and the strings with him.)
    const shake = this.scared && !this.free ? (Math.floor(this.age * 24) % 2 ? 1 : -1) * (this.snipped.includes(true) ? 0.5 : 1) : 0;
    // His strings: taut, or snipped and dangling from the rig.
    const ties = this.ties();
    ties.forEach((tie, i) => {
      if (this.snipped[i] || this.free) {
        drawString(ctx, this.pivot.x, this.pivot.y, this.pivot.x + (tie.x - this.pivot.x) * 0.25, this.pivot.y + 14, 3);
      } else {
        drawString(ctx, this.pivot.x, this.pivot.y, tie.x + shake, tie.y, shake * 0.8, '#ffffff');
      }
    });
    const frames = this.free || this.snipped.filter(Boolean).length >= 2 ? looks.down : looks.idle;
    const sprite = frames.length ? frames[Math.floor(this.age * 3) % frames.length] : null;
    ctx.save();
    ctx.translate(Math.round(this.x + shake), Math.round(this.y));
    ctx.rotate(this.free ? this.tilt : (this.angle - Math.PI / 2) * 0.6 + this.tilt);
    if (sprite) ctx.drawImage(sprite, -TUCK_W / 2, -TUCK_H / 2);
    else fill(ctx, '#c08a5a', -5, -8, 10, 16);
    ctx.restore();
    for (const d of this.drops) {
      ctx.globalAlpha = Math.max(0, 1 - d.age / 0.6);
      fill(ctx, '#bfe4ff', d.x, d.y, 1, 2);
    }
    ctx.restore();
  }
}

// --- The light, leaking ---

// One of his joints, a wooden peg-ring, with the light inside him shining out
// of it in a ray (`angle`, turning at `spin`, or steering after `target` at
// `turn` radians a second). First a thin dotted line where it'll come
// (`warn`), then it burns for `life` seconds.
//
// `eye`: it's one of his eye holes, not a joint: a hole gouged in wood with
// the light looking out of it; and as it turns it leaves a faint smear of
// itself behind, where it was looking (harmless: only the ray itself burns).
export class JointRay {
  constructor({ x, y, angle, spin = 0, target = null, turn = 0.45, warn = 0.8, life = 3, length = 140, width = 2, ring = true, eye = false }) {
    Object.assign(this, { x, y, angle, spin, target, turn, warn, life, length, width, ring, eye });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.trail = [];
    this.trailAt = 0;
  }

  get burning() { return this.age >= this.warn && this.age < this.warn + this.life; }

  update(dt) {
    this.age += dt;
    if (this.age < this.warn) return;
    if (this.eye && this.age >= this.trailAt) {
      this.trailAt = this.age + 0.06;
      this.trail.unshift(this.angle);
      this.trail.length = Math.min(this.trail.length, 6);
    }
    if (this.target) {
      const want = Math.atan2(this.target.y - this.y, this.target.x - this.x);
      const diff = ((want - this.angle + Math.PI * 3) % TAU) - Math.PI;
      this.angle += clamp(diff, -this.turn * dt, this.turn * dt);
    } else {
      this.angle += this.spin * dt;
    }
  }

  isGone() { return this.age > this.warn + this.life + 0.3; }

  get end() { return { x: this.x + Math.cos(this.angle) * this.length, y: this.y + Math.sin(this.angle) * this.length }; }

  edgeDistance(px, py) {
    if (!this.burning) return Infinity;
    const e = this.end;
    // (Not right at the joint, where the ring is.)
    return segDist(px, py, this.x + Math.cos(this.angle) * 4, this.y + Math.sin(this.angle) * 4, e.x, e.y) - this.width / 2;
  }

  draw(ctx) {
    const e = this.end;
    ctx.save();
    if (this.age < this.warn) {
      ctx.globalAlpha = warnAlpha(this.age) * 0.9;
      ctx.strokeStyle = `rgb(${LIGHT.warm})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([1, 3]);
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(e.x, e.y);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      const over = this.age - (this.warn + this.life);
      const fade = over > 0 ? Math.max(0, 1 - over / 0.3) : 1;
      const flick = 0.85 + 0.15 * Math.sin(this.age * 37);
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      // Where the eye was looking a moment ago: a fading smear.
      if (this.eye) {
        this.trail.forEach((a, i) => {
          if (i === 0) return;
          ctx.strokeStyle = `rgba(${LIGHT.cold}, ${(0.16 * (1 - i / 6) * fade).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x + Math.cos(a) * this.length, this.y + Math.sin(a) * this.length);
          ctx.stroke();
        });
      }
      for (const [rgb, w, a] of [[LIGHT.cold, this.width + 4, 0.22], [LIGHT.warm, this.width + 1.5, 0.5], [LIGHT.core, Math.max(1, this.width - 0.5), 0.95]]) {
        ctx.strokeStyle = `rgba(${rgb}, ${(a * fade * flick).toFixed(3)})`;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(e.x, e.y);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    // The joint: a ring of wood with a peg through it, glowing at the gap.
    // (Not for a ray out of his own eyes, on the stage: he's there himself.)
    if (!this.ring) { ctx.restore(); return; }
    ctx.globalAlpha = 1;
    if (this.eye) {
      // A hole gouged in wood, ragged, and the light in it looking along
      // the ray.
      const x = Math.round(this.x);
      const y = Math.round(this.y);
      fill(ctx, C.k, x - 4, y - 2, 9, 5);
      fill(ctx, C.wood, x - 3, y - 3, 7, 1);
      fill(ctx, C.woodDark, x - 3, y + 3, 7, 1);
      fill(ctx, C.gum, x - 3, y - 1, 7, 3);
      const lit = this.age >= this.warn;
      const lx = x + Math.round(Math.cos(this.angle) * 2);
      const ly = y + Math.round(Math.sin(this.angle) * 1);
      ctx.fillStyle = lit ? `rgb(${LIGHT.warm})` : C.woodDark;
      ctx.fillRect(lx - 1, ly - 1, 3, 2);
      if (lit) {
        ctx.fillStyle = `rgb(${LIGHT.core})`;
        ctx.fillRect(lx, ly - 1, 1, 1);
      }
      ctx.restore();
      return;
    }
    ctx.fillStyle = C.k;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4.5, 0, TAU);
    ctx.fill();
    ctx.fillStyle = C.wood;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3.5, 0, TAU);
    ctx.fill();
    ctx.fillStyle = this.age >= this.warn ? `rgb(${LIGHT.core})` : C.woodDark;
    ctx.fillRect(Math.round(this.x) - 1, Math.round(this.y) - 1, 2, 2);
    fill(ctx, C.peg, this.x - 4, this.y - 0.5, 1, 1);
    ctx.restore();
  }
}

// A bit of the light, leaking out of a joint and drifting: a little
// four-pointed glint, warm in the middle and cold at the points.
export class Glint {
  constructor({ x, y, vx, vy, life = 3.2, warn = 0 }) {
    Object.assign(this, { x, y, vx, vy, life, warn });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  update(dt) {
    this.age += dt;
    if (this.age < this.warn) return;
    this.x += this.vx * dt + Math.sin(this.age * 5) * 6 * dt;
    this.y += this.vy * dt;
  }

  isGone(box) { return this.age > this.warn + this.life || this.x < box.x - 10 || this.x > box.x + box.w + 10 || this.y < box.y - 10 || this.y > box.y + box.h + 10; }
  edgeDistance(px, py) { return this.age < this.warn ? Infinity : Math.hypot(px - this.x, py - this.y) - 1.6; }

  draw(ctx) {
    if (this.age < this.warn) return;
    const x = Math.round(this.x);
    const y = Math.round(this.y);
    const twinkle = Math.floor(this.age * 8) % 2;
    ctx.save();
    ctx.fillStyle = `rgb(${LIGHT.cold})`;
    ctx.fillRect(x - 2 - twinkle, y, 5 + twinkle * 2, 1);
    ctx.fillRect(x, y - 2 - twinkle, 1, 5 + twinkle * 2);
    ctx.fillStyle = `rgb(${LIGHT.warm})`;
    ctx.fillRect(x - 1, y, 3, 1);
    ctx.fillRect(x, y - 1, 1, 3);
    ctx.fillStyle = `rgb(${LIGHT.core})`;
    ctx.fillRect(x, y, 1, 1);
    ctx.restore();
  }
}

// --- Your shadow on his strings ---

// A string let down from his little control bar (`bar`, a point the attack
// moves) to hook YOUR shadow: it lowers, dotted (`warn`), then hooks on, and
// while it's on he works you like a puppet (rumboldAlive.js steers). `slot`
// spreads three of them along the bar. Cut it (SNIP) and it's off you. One
// snip cuts one string of a `group` (they're all on you, so the scissors
// would otherwise take the lot): cut your way free a string at a time.
export class MarionetteString {
  constructor({ bar, soul, slot = 0, warn = 0.75, group = { blocked: false } }) {
    Object.assign(this, { bar, soul, slot, warn, group });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.severed = false;
    this.cutAt = 0;
    this.done = false;
  }

  get from() { return { x: this.bar.x + this.slot * 7, y: this.bar.y + 1 }; }
  get hooked() { return !this.severed && !this.done && this.age >= this.warn; }
  get cuttable() { return !this.severed && !this.done && !this.group.blocked; }
  cutDistance(px, py) { const f = this.from; return segDist(px, py, f.x, f.y, this.soul.x, this.soul.y - 2); }
  cut() { this.severed = true; this.cutAt = this.age; this.group.blocked = true; }

  update(dt) { this.age += dt; this.group.blocked = false; }
  isGone() { return (this.severed && this.age - this.cutAt > 0.4) || this.done; }
  edgeDistance() { return Infinity; }

  draw(ctx) {
    ctx.save();
    const f = this.from;
    const sx = this.soul.x + this.slot * 2;
    const sy = this.soul.y - 2;
    if (this.severed) {
      const t = (this.age - this.cutAt) / 0.4;
      ctx.globalAlpha = 1 - t;
      drawString(ctx, f.x, f.y, (f.x + sx) / 2, (f.y + sy) / 2 + t * 10, 4);
      ctx.restore();
      return;
    }
    if (this.age < this.warn) {
      // Lowering: a dotted line creeping down towards you.
      const k = this.age / this.warn;
      ctx.globalAlpha = 0.4 + 0.6 * k;
      ctx.setLineDash([2, 2]);
      drawString(ctx, f.x, f.y, f.x + (sx - f.x) * k, f.y + (sy - f.y) * k, 3 * (1 - k));
      ctx.restore();
      return;
    }
    drawString(ctx, f.x, f.y, sx, sy, 0, '#ffffff');
    // The brass hook in you.
    fill(ctx, C.peg, sx - 1, sy - 1, 2, 2);
    ctx.restore();
  }
}

// The little control bar he works you with, at the top of the box (or of
// the whole stage): a cross of dark wood, rocking as he steers.
export class ControlBar {
  constructor({ bar, life = 99 }) {
    Object.assign(this, { bar, life });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.done = false;
  }

  update(dt) { this.age += dt; }
  isGone() { return this.done || this.age > this.life; }
  edgeDistance() { return Infinity; }

  draw(ctx) {
    const { x, y, tilt = 0 } = this.bar;
    ctx.save();
    ctx.globalAlpha = Math.min(1, this.age / 0.3);
    ctx.translate(Math.round(x + 7), Math.round(y));
    ctx.rotate(tilt);
    fill(ctx, C.k, -13, -2, 26, 4);
    fill(ctx, '#7a5634', -12, -1, 24, 2);
    fill(ctx, '#b8903e', -12, -1, 1, 2);
    fill(ctx, '#b8903e', 11, -1, 1, 2);
    fill(ctx, C.k, -2, -6, 4, 10);
    fill(ctx, '#553a22', -1, -5, 2, 8);
    ctx.restore();
  }
}
