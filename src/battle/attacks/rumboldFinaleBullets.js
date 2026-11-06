import { segDist, rectDist, warnAlpha } from './rumboldBullets.js';
import { C, LIGHT, fill, drawString } from './rumboldAliveBullets.js';

// KING PEPTUP's finale (rumboldAliveTear in rumboldAlive.js): once the box
// is torn away the fight is up in the fly tower behind the stage
// (puppetStage.js draws it), and he brings the whole theatre down on you:
//
//   SceneryFlat   the painted scenery of his old show, running across on its
//                 tracks, a window cut through each: stand in its lane
//   Sandbag       dropped from the fly gallery on a snapped rope; it bursts
//                 into SandGrains on the floor
//   Batten        a pipe of stage lamps that swings down from one rope,
//                 through everything within its reach
//   PaperStar     the cardboard stars of his curtain call, cut loose
//   GiantHead     his own head, off his neck and swollen huge, hung in the
//                 middle of it all, eyes on you (it does no harm itself)
//   GrabHand      his hands, grown to match, on long jointed arms from the
//                 wings: they grab at where you are, and clap across your row
//
// All in stage pixels, like the rest of his bullets.

const TAU = Math.PI * 2;

// The fly tower's floor, where things land: the bottom of the stage-sized
// box (rumboldAlive.js's STAGE), so there's no hiding under the sand.
export const FLY_FLOOR = 161;

// What's painted on each flat: the story he was told he was in.
// [sky, paint, light paint].
const FLAT_PAINT = {
  stair: ['#1c2440', '#c8901a', '#f0c050'],
  tower: ['#3a2a48', '#8a7a9a', '#c8b8d8'],
  sun: ['#5a2a1a', '#e08a2a', '#ffd070'],
  hero: ['#20304a', '#d8c8a0', '#fff2d0'],
};

// A painted scenery flat on its track, running across the whole stage from
// one wing to the other. A window is cut through it (from `holeY`, `holeH`
// high): stand in its lane as it goes by. First the lane is chalked across
// the stage, with an arrow at the wing it's coming from.
export class SceneryFlat {
  constructor({ stage, dir = 1, holeY, holeH = 24, speed = 105, warn = 0.9, picture = 'stair', w = 26 }) {
    Object.assign(this, { stage, dir, holeY, holeH, speed, warn, picture, w });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.x = dir > 0 ? stage.x - w : stage.x + stage.w;
  }

  get top() { return this.stage.y; }
  get bottom() { return this.stage.y + this.stage.h; }

  update(dt) {
    this.age += dt;
    if (this.age >= this.warn) this.x += this.dir * this.speed * dt;
  }

  isGone() { return this.dir > 0 ? this.x > this.stage.x + this.stage.w + 2 : this.x + this.w < this.stage.x - 2; }

  edgeDistance(px, py) {
    if (this.age < this.warn) return Infinity;
    return Math.min(
      rectDist(px, py, this.x, this.top, this.w, this.holeY - this.top),
      rectDist(px, py, this.x, this.holeY + this.holeH, this.w, this.bottom - this.holeY - this.holeH),
    );
  }

  draw(ctx) {
    const { x, w, holeY, holeH, top, bottom, stage } = this;
    ctx.save();
    // The lane: blinking until it comes, then faint.
    ctx.globalAlpha = this.age < this.warn ? warnAlpha(this.age) : 0.3;
    ctx.strokeStyle = '#f4ecdc';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(stage.x, Math.round(holeY) + 0.5);
    ctx.lineTo(stage.x + stage.w, Math.round(holeY) + 0.5);
    ctx.moveTo(stage.x, Math.round(holeY + holeH) - 0.5);
    ctx.lineTo(stage.x + stage.w, Math.round(holeY + holeH) - 0.5);
    ctx.stroke();
    ctx.setLineDash([]);
    const ax = this.dir > 0 ? stage.x + 5 : stage.x + stage.w - 5;
    const ay = holeY + holeH / 2;
    ctx.fillStyle = '#f4ecdc';
    ctx.beginPath();
    ctx.moveTo(ax + this.dir * 4, ay);
    ctx.lineTo(ax - this.dir * 2, ay - 4);
    ctx.lineTo(ax - this.dir * 2, ay + 4);
    ctx.fill();
    ctx.globalAlpha = 1;
    // Its ropes, up into the flies.
    ctx.strokeStyle = C.string;
    ctx.beginPath();
    ctx.moveTo(Math.round(x + 4) + 0.5, 0); ctx.lineTo(Math.round(x + 4) + 0.5, top);
    ctx.moveTo(Math.round(x + w - 4) + 0.5, 0); ctx.lineTo(Math.round(x + w - 4) + 0.5, top);
    ctx.stroke();
    // The flat: painted canvas in a wooden frame, the window cut through it.
    const [sky, paint, light] = FLAT_PAINT[this.picture] ?? FLAT_PAINT.stair;
    for (const [y0, y1] of [[top, holeY], [holeY + holeH, bottom]]) {
      if (y1 <= y0) continue;
      fill(ctx, C.k, x, y0, w, y1 - y0);
      fill(ctx, sky, x + 2, y0 + 1, w - 4, y1 - y0 - 2);
      this.paint(ctx, x + 2, y0 + 1, w - 4, y1 - y0 - 2, paint, light);
      fill(ctx, '#6a4a2c', x + 1, y0, 1, y1 - y0);
      fill(ctx, '#6a4a2c', x + w - 2, y0, 1, y1 - y0);
    }
    // The cut edge of the window: rough canvas.
    for (let i = 0; i < w; i += 2) {
      const j = (i * 7) % 3;
      fill(ctx, '#e8dcc4', x + i, holeY - 1 - (j % 2), 2, 1 + (j % 2));
      fill(ctx, '#e8dcc4', x + i, holeY + holeH, 2, 1 + ((j + 1) % 2));
    }
    ctx.restore();
  }

  // The scene on it, clipped to one piece of the flat: old paint, faded and
  // stained. Wherever the Hero is in it, someone has scratched his face out;
  // the little king beside him has kept his.
  paint(ctx, x, y, w, h, paint, light) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    const base = this.stage.y;
    const cx = x + w / 2;
    ctx.globalAlpha = 0.78;
    if (this.picture === 'stair') {
      // The great stair, going up and up; and the two of them on it,
      // shoulder to shoulder.
      for (let k = 0; k < 24; k++) {
        const sy = base + 158 - k * 7;
        const sx = x + ((k * 5) % (w + 6)) - 6;
        fill(ctx, paint, sx, sy, 10, 3);
        fill(ctx, light, sx, sy, 10, 1);
      }
      for (const fy of [base + 40, base + 128]) {
        figure(ctx, cx - 6, fy, 1, light, true);
        king(ctx, cx + 4, fy + 4);
      }
    } else if (this.picture === 'tower') {
      // A castle tower, its windows lit; and in one of them, two eyes.
      fill(ctx, paint, x + 4, base + 20, w - 8, 140);
      for (let k = 0; k < 4; k++) fill(ctx, paint, x + 3 + k * 5, base + 16, 3, 4);
      for (let k = 0; k < 9; k++) {
        const wy = base + 30 + k * 15;
        if (k === 4) {
          fill(ctx, '#0a0710', cx - 2, wy - 1, 4, 6);
          fill(ctx, `rgb(${LIGHT.warm})`, cx - 2, wy + 1, 1, 1);
          fill(ctx, `rgb(${LIGHT.warm})`, cx + 1, wy + 1, 1, 1);
        } else {
          fill(ctx, '#ffd070', cx - 1, wy, 2, 4);
        }
      }
      fill(ctx, light, x + 4, base + 20, 1, 140);
    } else if (this.picture === 'sun') {
      // Painted suns with faces.
      for (const cy of [base + 30, base + 120]) {
        ctx.fillStyle = paint;
        ctx.beginPath(); ctx.arc(cx, cy, 9, 0, TAU); ctx.fill();
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * TAU;
          fill(ctx, light, cx + Math.cos(a) * 12 - 1, cy + Math.sin(a) * 12 - 1, 2, 2);
        }
        fill(ctx, '#5a2a1a', cx - 4, cy - 2, 2, 2);
        fill(ctx, '#5a2a1a', cx + 2, cy - 2, 2, 2);
        fill(ctx, '#5a2a1a', cx - 3, cy + 3, 6, 1);
      }
    } else {
      // The Hero, painted tall with his sword up; and again, smaller, with
      // the little king at his side.
      figure(ctx, cx, base + 22, 2, light, true, paint);
      figure(ctx, cx - 3, base + 110, 1.4, light, true, paint);
      king(ctx, cx + 6, base + 128);
    }
    // Damp stains, and the paint flaking.
    ctx.globalAlpha = 1;
    for (let k = 0; k < 7; k++) {
      const n = (this.picture.length * 13 + k * 7) % 11;
      fill(ctx, 'rgba(10, 7, 16, 0.28)', x + ((n * 5) % (w - 4)), base + 12 + k * 22 + n, 3 + (n % 4), 2 + (n % 3));
      fill(ctx, 'rgba(232, 220, 196, 0.25)', x + ((n * 3 + 7) % (w - 2)), base + 20 + k * 21, 1, 1);
    }
    ctx.restore();
  }
}

// The Hero as the flats paint him (`s` times size, at his head's top
// middle), sword up; his face scratched away to the bare canvas.
function figure(ctx, cx, hy, s, light, scratched, paint = '#d8c8a0') {
  fill(ctx, light, cx - 3 * s, hy, 6 * s, 6 * s);
  fill(ctx, paint, cx - 4 * s, hy + 6 * s, 8 * s, 14 * s);
  fill(ctx, paint, cx - 3 * s, hy + 20 * s, 2 * s, 10 * s);
  fill(ctx, paint, cx + s, hy + 20 * s, 2 * s, 10 * s);
  fill(ctx, '#f0c050', cx + 4 * s, hy - 6 * s, Math.max(1, s), 14 * s);
  if (!scratched) return;
  // Gouged: crossed scratches through the paint, down to the canvas.
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#3a2a24';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let k = 0; k < 4; k++) {
    const dx = (k - 1.5) * 1.6 * s;
    ctx.moveTo(cx - 3 * s + dx, hy - s);
    ctx.lineTo(cx + 2 * s + dx, hy + 7 * s);
  }
  ctx.moveTo(cx + 3 * s, hy);
  ctx.lineTo(cx - 3 * s, hy + 6 * s);
  ctx.stroke();
  ctx.restore();
}

// The little wooden king the flats paint at the Hero's side: crowned, and
// smiling, his face untouched.
function king(ctx, cx, hy) {
  fill(ctx, '#f0c050', cx - 2, hy - 2, 5, 2);
  fill(ctx, '#f0c050', cx - 2, hy - 3, 1, 1);
  fill(ctx, '#f0c050', cx + 2, hy - 3, 1, 1);
  fill(ctx, C.wood, cx - 2, hy, 5, 4);
  fill(ctx, C.k, cx - 1, hy + 1, 1, 1);
  fill(ctx, C.k, cx + 1, hy + 1, 1, 1);
  fill(ctx, '#a0302a', cx - 1, hy + 3, 3, 1);
  fill(ctx, '#7a2a3a', cx - 3, hy + 4, 7, 9);
  fill(ctx, C.wood, cx - 2, hy + 13, 2, 5);
  fill(ctx, C.wood, cx + 1, hy + 13, 2, 5);
}

// A sandbag from the fly gallery: it hangs swinging on its rope while a line
// shows where it'll fall; the rope snaps, it drops to the floor and bursts
// (`onLand`).
export class Sandbag {
  constructor({ x, warn = 0.7, hangY = 14, onLand = null }) {
    Object.assign(this, { x, warn, onLand });
    this.y = hangY;
    this.vy = 0;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.landed = false;
  }

  update(dt) {
    this.age += dt;
    if (this.age < this.warn || this.landed) return;
    this.vy += 420 * dt;
    this.y += this.vy * dt;
    if (this.y + 10 >= FLY_FLOOR) {
      this.y = FLY_FLOOR - 10;
      this.landed = true;
      this.onLand?.(this);
    }
  }

  isGone() { return this.landed; }
  edgeDistance(px, py) { return this.age < this.warn ? Infinity : rectDist(px, py, this.x - 4, this.y, 8, 10); }

  draw(ctx) {
    ctx.save();
    const swing = this.age < this.warn ? Math.sin(this.age * 14) * 1.5 : 0;
    const x = this.x + swing;
    if (this.age < this.warn) {
      // Where it'll come down.
      ctx.globalAlpha = warnAlpha(this.age) * 0.8;
      ctx.strokeStyle = '#e8dcc4';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(Math.round(this.x) + 0.5, this.y + 10);
      ctx.lineTo(Math.round(this.x) + 0.5, FLY_FLOOR);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      drawString(ctx, this.x, 0, x, this.y, 0);
    } else if (this.age < this.warn + 0.25) {
      // The snapped end, whipping up.
      ctx.globalAlpha = 1 - (this.age - this.warn) / 0.25;
      drawString(ctx, this.x, 0, this.x + 3, this.y * 0.5, 3);
      ctx.globalAlpha = 1;
    }
    // The bag: tied at the neck, patched.
    fill(ctx, C.k, x - 5, this.y, 10, 11);
    fill(ctx, '#a08860', x - 4, this.y + 3, 8, 7);
    fill(ctx, '#c8b088', x - 4, this.y + 3, 3, 3);
    fill(ctx, '#7a6444', x - 2, this.y + 1, 4, 2);
    fill(ctx, '#5a4a30', x + 1, this.y + 6, 2, 2);
    ctx.restore();
  }
}

// A spray of sand from a burst bag.
export class SandGrain {
  constructor({ x, y, vx, vy, life = 0.9 }) {
    Object.assign(this, { x, y, vx, vy, life });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  update(dt) {
    this.age += dt;
    this.vy += 300 * dt;
    this.x += this.vx * dt;
    this.y = Math.min(FLY_FLOOR, this.y + this.vy * dt);
  }

  isGone() { return this.age > this.life; }
  edgeDistance(px, py) { return Math.hypot(px - this.x, py - this.y) - 1.2; }

  draw(ctx) {
    fill(ctx, '#5a4a30', this.x - 1, this.y - 1, 3, 3);
    fill(ctx, '#d8c090', this.x, this.y, 1, 1);
  }
}

// A batten of stage lamps, hung level across the top on two ropes. The far
// rope frays and snaps, and it swings down from the near one through
// everything within its reach (shown first as an arc), and back, and back,
// till the other rope goes and it drops away.
export class Batten {
  constructor({ pivot, dir = 1, length = 170, warn = 1.1, life = 3.4 }) {
    Object.assign(this, { pivot, dir, length, warn, life });
    this.theta = Math.PI / 2; // from straight down: it starts level
    this.omega = 0;
    this.drop = 0;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get end() {
    return { x: this.pivot.x + this.dir * Math.sin(this.theta) * this.length, y: this.pivot.y + Math.cos(this.theta) * this.length + this.drop };
  }

  update(dt) {
    this.age += dt;
    if (this.age < this.warn) return;
    if (this.age > this.warn + this.life) {
      this.drop += (60 + (this.age - this.warn - this.life) * 400) * dt;
      return;
    }
    // A pendulum, slowing.
    this.omega += (-7 * Math.sin(this.theta) - 0.5 * this.omega) * dt;
    this.theta += this.omega * dt;
  }

  isGone() { return this.drop > 200; }

  edgeDistance(px, py) {
    if (this.age < this.warn) return Infinity;
    const e = this.end;
    return segDist(px, py, this.pivot.x, this.pivot.y + this.drop, e.x, e.y) - 2;
  }

  draw(ctx) {
    const p = { x: this.pivot.x, y: this.pivot.y + this.drop };
    const e = this.end;
    ctx.save();
    if (this.age < this.warn) {
      // Its reach: the arc it'll swing through.
      ctx.globalAlpha = warnAlpha(this.age) * 0.85;
      ctx.strokeStyle = `rgb(${LIGHT.warm})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      if (this.dir > 0) ctx.arc(p.x, p.y, this.length, 0, Math.PI / 2);
      else ctx.arc(p.x, p.y, this.length, Math.PI / 2, Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      // Both ropes on it, the far one fraying.
      drawString(ctx, p.x, 0, p.x, p.y, 0);
      if (Math.floor(this.age * 12) % 2) drawString(ctx, e.x, 0, e.x, e.y, 2);
    } else if (this.age <= this.warn + this.life) {
      drawString(ctx, p.x, 0, p.x, p.y, 0);
    }
    // The pipe.
    ctx.lineCap = 'round';
    ctx.strokeStyle = C.k;
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(e.x, e.y); ctx.stroke();
    ctx.strokeStyle = '#5a5464';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(e.x, e.y); ctx.stroke();
    // Its lamps, still lit once it's swinging.
    const lit = this.age >= this.warn;
    for (let k = 1; k <= 5; k++) {
      const u = k / 5.5;
      const lx = p.x + (e.x - p.x) * u;
      const ly = p.y + (e.y - p.y) * u;
      fill(ctx, C.k, lx - 3, ly - 3, 6, 6);
      fill(ctx, '#2a2430', lx - 2, ly - 2, 4, 4);
      fill(ctx, lit ? '#ffe0a0' : '#5a5048', lx - 1, ly - 1, 2, 2);
      if (!lit) continue;
      ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 10);
      g.addColorStop(0, 'rgba(255, 210, 140, 0.35)');
      g.addColorStop(1, 'rgba(255, 210, 140, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(lx - 10, ly - 10, 20, 20);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
  }
}

// A cardboard star from his curtain call: it hangs on its thread a moment,
// then tumbles down, drifting, gold on one side and grey card on the other.
// Each had a little painted face once, smiling; most have had it scratched
// off.
export class PaperStar {
  constructor({ x, y, vx, vy, warn = 0 }) {
    Object.assign(this, { x, y, vx, vy, warn });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.spin = Math.random() * TAU;
    this.scratched = Math.random() < 0.75;
  }

  update(dt) {
    this.age += dt;
    if (this.age < this.warn) return;
    this.x += (this.vx + Math.sin(this.age * 3 + this.spin) * 14) * dt;
    this.y += this.vy * dt;
  }

  isGone() { return this.y > FLY_FLOOR + 8; }
  edgeDistance(px, py) { return this.age < this.warn ? Infinity : Math.hypot(px - this.x, py - this.y) - 2.4; }

  draw(ctx) {
    if (this.age < this.warn) {
      ctx.save();
      ctx.globalAlpha = warnAlpha(this.age);
      drawString(ctx, this.x, 0, this.x, this.y, 0);
      ctx.restore();
    }
    // Flipping over as it falls: gold, thin edge, grey back.
    const turn = Math.cos(this.age * 6 + this.spin);
    const face = turn > 0 ? '#f0c050' : '#8a8478';
    const wide = Math.max(1, Math.round(Math.abs(turn) * 2));
    const x = Math.round(this.x);
    const y = Math.round(this.y);
    fill(ctx, C.k, x - wide - 1, y - 3, wide * 2 + 3, 7);
    fill(ctx, C.k, x - 3, y - 1, 7, 3);
    fill(ctx, face, x - wide, y - 2, wide * 2 + 1, 5);
    fill(ctx, face, x - 2, y, 5, 1);
    if (turn <= 0.45) return;
    // Its face, side on to you: two dots and a smile, or a scratch where they
    // were.
    if (this.scratched) {
      fill(ctx, '#6a5020', x - 2, y - 1, 1, 1);
      fill(ctx, '#6a5020', x - 1, y, 1, 1);
      fill(ctx, '#6a5020', x, y + 1, 2, 1);
      fill(ctx, '#fff2b0', x + 1, y - 2, 1, 1);
    } else {
      fill(ctx, C.k, x - 1, y - 1, 1, 1);
      fill(ctx, C.k, x + 1, y - 1, 1, 1);
      fill(ctx, '#a0302a', x - 1, y + 1, 3, 1);
    }
  }
}

// --- His head, and his hands ---

// His head, off his neck and swollen huge, hung in the middle of the fly
// tower on three strings: the carved egg of it, cracked, the two eyes dug
// deep and burning, a jaw that clacks with the light pouring out between
// its teeth. It does no harm itself (it's the backdrop to his hands); the
// attack moves it about (`x`, `y`, `size`: stage pixels to one of its
// pixels), opens its jaw (`open`) and points its eyes (`look`).
const HEAD_W = 26;
const HEAD_H = 30;
// Its outline, a row at a time: [first column, last column]. An egg, wider
// below.
const HEAD_ROWS = Array.from({ length: HEAD_H }, (_, r) => {
  const k = r < 16 ? (16 - r) / 16.5 : (r - 16) / 14.6;
  const half = (r < 16 ? 12 : 12.6) * Math.sqrt(Math.max(0, 1 - k * k));
  return [Math.round(13 - half), Math.round(12 + half)];
});
// The jaw is everything from this row down; it drops `open` rows.
const JAW_ROW = 22;
const EYE_SPOTS = [7, 16];
const CRACK = [[15, 1], [15, 2], [14, 3], [14, 4], [15, 5], [16, 6], [16, 7], [15, 8], [17, 6], [18, 7]];

export class GiantHead {
  constructor({ x, y, size = 1 }) {
    Object.assign(this, { x, y, size });
    this.open = 0;
    this.look = { x: 0, y: 0 };
    this.shake = 0;
    this.tilt = 0;
    this.age = 0;
    this.done = false;
    this.dmg = null;
    this.grazed = false;
  }

  update(dt) { this.age += dt; }
  isGone() { return this.done; }
  edgeDistance() { return Infinity; }

  // Where one of its pixels is on the stage (it can be cocked over on its
  // side, `tilt`, turning about its middle).
  at(col, row) {
    const s = this.size;
    const j = this.shake ? Math.sin(this.age * 70) * this.shake : 0;
    const ox = (col - HEAD_W / 2) * s;
    const oy = (row - HEAD_H / 2) * s;
    const c = Math.cos(this.tilt);
    const n = Math.sin(this.tilt);
    return { x: this.x + j + ox * c - oy * n, y: this.y + ox * n + oy * c };
  }

  // Where its eyes are, for the light they spit.
  eye(i) { return this.at(EYE_SPOTS[i] + 1.5 + this.look.x, 13 + this.look.y); }

  draw(ctx) {
    const s = this.size;
    // (Its pixels are drawn turned with it: about its middle, by `tilt`;
    // a touch oversized while it's turned, so no seams show between them.)
    const turned = Math.abs(this.tilt) > 0.005;
    const px = (col, row, color, w = 1, h = 1) => {
      ctx.fillStyle = color;
      const x = (col - HEAD_W / 2) * s;
      const y = (row - HEAD_H / 2) * s;
      if (turned) ctx.fillRect(x - 0.4, y - 0.4, w * s + 0.8, h * s + 0.8);
      else ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w * s), Math.ceil(h * s));
    };
    const drop = Math.round(this.open);
    const shift = (r) => (r >= JAW_ROW ? drop : 0);
    ctx.save();
    // The strings it hangs from, up into the flies: pulled taut and
    // trembling on the side it's cocked over to.
    for (const dx of [-7, 0, 7]) {
      const tie = this.at(13 + dx, Math.abs(dx) * 0.5 + 1);
      const taut = Math.sign(dx) === Math.sign(this.tilt) ? 0 : Math.sin(this.age * 50) * 0.6;
      drawString(ctx, tie.x - this.tilt * 30, 0, tie.x, tie.y, taut);
    }
    const mid = this.at(HEAD_W / 2, HEAD_H / 2);
    ctx.save();
    ctx.translate(mid.x, mid.y);
    ctx.rotate(this.tilt);
    // The outline, then the wood: lit on the left, dark down the right.
    HEAD_ROWS.forEach(([a, b], r) => px(a - 1, r + shift(r) - 1, C.k, b - a + 3, 3));
    HEAD_ROWS.forEach(([a, b], r) => {
      const y = r + shift(r);
      px(a, y, C.wood, b - a + 1, 1);
      px(a, y, C.woodLight, Math.max(1, Math.round((b - a) * 0.4)), 1);
      px(b - 1, y, C.woodDark, 2, 1);
    });
    // The light between the jaws, behind the teeth.
    const [ja, jb] = HEAD_ROWS[JAW_ROW];
    for (let r = JAW_ROW - 1; r < JAW_ROW + drop; r++) {
      px(ja + 1, r, C.k, jb - ja - 1, 1);
      if (r >= JAW_ROW) {
        px(ja + 2, r, `rgb(${LIGHT.warm})`, jb - ja - 3, 1);
        px(ja + 4, r, `rgb(${LIGHT.core})`, jb - ja - 7, 1);
      }
    }
    // The crack down from the crown.
    for (const [c, r] of CRACK) px(c, r, C.woodDark);
    // His painted smile: a red line, ear to ear, turned up at the corners,
    // chipped. It's painted on: it doesn't move when the jaw does.
    for (let c = ja - 1; c <= jb + 1; c++) {
      const corner = Math.max(0, Math.max(ja + 1 - c, c - (jb - 1)));
      if ((c * 7) % 5 === 0) continue;
      px(c, JAW_ROW - 4 - corner, '#8a2420', 1, 1);
    }
    // The pegs of the jaw's hinge.
    px(ja - 1, JAW_ROW - 3, C.k, 3, 3);
    px(ja, JAW_ROW - 2, C.peg, 2, 2);
    px(jb - 1, JAW_ROW - 3, C.k, 3, 3);
    px(jb - 1, JAW_ROW - 2, C.peg, 2, 2);
    // The teeth: carved pegs along both jaws, the light showing between.
    for (let c = ja + 3; c < jb - 2; c += 3) {
      px(c, JAW_ROW - 3, C.tooth, 2, 2);
      px(c + 1, JAW_ROW - 2, C.toothDark, 1, 1);
      px(c, JAW_ROW + drop, C.tooth, 2, 2);
      px(c, JAW_ROW + drop, C.toothDark, 1, 1);
    }
    // The eyes: dug deep, ragged at the top, burning, turned on you.
    const flick = Math.floor(this.age * 10) % 2;
    for (const c of EYE_SPOTS) {
      px(c, 11, C.k, 4, 5);
      px(c - 1, 12, C.k, 6, 3);
      px(c + 1, 10, C.k, 2, 1);
      px(c, 12, '#1a0e0a', 4, 3);
      const fx = c + 1 + this.look.x;
      const fy = 12 + this.look.y;
      px(fx - 0.5, fy, `rgb(${LIGHT.cold})`, 3, 2 + flick);
      px(fx, fy + 0.5, `rgb(${LIGHT.warm})`, 2, 1.5);
      px(fx + 0.5, fy + 0.5, `rgb(${LIGHT.core})`, 1, 1);
    }
    ctx.restore();
    // The glow of it all, added on.
    ctx.globalCompositeOperation = 'lighter';
    const glowAt = (p, r, rgb, alpha) => {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      g.addColorStop(0, `rgba(${rgb}, ${alpha})`);
      g.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
    };
    for (const i of [0, 1]) glowAt(this.eye(i), 5 * s, LIGHT.warm, 0.4);
    if (drop > 0) glowAt(this.at(13, JAW_ROW + drop / 2), (6 + drop) * s, LIGHT.warm, 0.18 + 0.05 * drop);
    ctx.restore();
  }
}

// One of his hands, grown to match: a carved wooden hand on a long jointed
// arm reaching in from offstage (`from`). It shows where it means to close
// first (a chalked ring, and the open hand trembling at the edge), then
// lunges to `to` and clenches there, and is hauled back. Only the hand
// hurts, from halfway through its lunge till it lets go.
//
// A `clap` hand doesn't grab a spot: it sweeps in flat along its row, open,
// to meet the other one (the row's chalked first: get off it).
const LUNGE = 0.16;
const HOLD = 0.42;
const BACK = 0.6;
const CLAP_SWEEP = 0.34;
// How much bigger than his hands on the stage: as big as the head they go with.
const HAND_SCALE = 1.8;

export class GrabHand {
  constructor({ from, to, warn = 0.7, clap = false, bend = 1, onClench = null }) {
    Object.assign(this, { from, to, warn, clap, bend, onClench });
    const a = Math.atan2(to.y - from.y, to.x - from.x);
    this.angle = a;
    // Waiting, it shows a little way in from the edge, along its reach.
    this.rest = { x: from.x + Math.cos(a) * 34, y: from.y + Math.sin(a) * 34 };
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.clenched = false;
  }

  get moveTime() { return this.clap ? CLAP_SWEEP : LUNGE; }

  // Where the hand is, and how shut (0 open, 1 a fist).
  get hand() {
    const t = this.age - this.warn;
    if (t < 0) {
      const j = Math.sin(this.age * 41) * 0.8;
      return { x: this.rest.x + j, y: this.rest.y - j, shut: 0 };
    }
    if (t < this.moveTime) {
      const k = (t / this.moveTime) ** 2;
      return { x: this.rest.x + (this.to.x - this.rest.x) * k, y: this.rest.y + (this.to.y - this.rest.y) * k, shut: this.clap ? 0 : k * 0.3 };
    }
    const held = t - this.moveTime;
    if (held < HOLD) return { ...this.to, shut: this.clap ? 0 : Math.min(1, 0.3 + held * 9) };
    const k = Math.min(1, (held - HOLD) / BACK) ** 2;
    return { x: this.to.x + (this.from.x - this.to.x) * k, y: this.to.y + (this.from.y - this.to.y) * k, shut: this.clap ? 0 : 1 };
  }

  update(dt) {
    this.age += dt;
    if (!this.clenched && this.age >= this.warn + this.moveTime) {
      this.clenched = true;
      this.onClench?.(this);
    }
  }

  isGone() { return this.age > this.warn + this.moveTime + HOLD + BACK; }

  edgeDistance(px, py) {
    const t = this.age - this.warn;
    if (t < this.moveTime * (this.clap ? 0 : 0.5) || t > this.moveTime + HOLD) return Infinity;
    const h = this.hand;
    return Math.hypot(px - h.x, py - h.y) - (this.clap ? 13 : 9 + h.shut * 3);
  }

  draw(ctx) {
    const h = this.hand;
    ctx.save();
    // Where it'll close: a chalked ring (or the clap's row), blinking.
    if (this.age < this.warn) {
      ctx.globalAlpha = warnAlpha(this.age);
      ctx.strokeStyle = `rgb(${LIGHT.warm})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 2]);
      ctx.beginPath();
      if (this.clap) {
        for (const dy of [-14, 14]) {
          ctx.moveTo(this.from.x, Math.round(this.to.y + dy) + 0.5);
          ctx.lineTo(this.to.x, Math.round(this.to.y + dy) + 0.5);
        }
      } else {
        ctx.arc(this.to.x, this.to.y, 16, 0, TAU);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }
    // The arm: too long, and with too many joints, three lengths of wood
    // and two pegged elbows, bent first one way and then the other (folding
    // up as it's hauled back), each elbow working a little on its own.
    const dx = h.x - this.from.x;
    const dy = h.y - this.from.y;
    const len = Math.hypot(dx, dy) || 1;
    const bow = Math.max(10, 52 - len * 0.2) * this.bend;
    const elbows = [[1 / 3, 1], [2 / 3, -0.8]].map(([u, k], i) => {
      const twitch = Math.sin(this.age * (9 + i * 4) + i) * 1.5;
      return { x: this.from.x + dx * u - (dy / len) * (bow * k + twitch), y: this.from.y + dy * u + (dx / len) * (bow * k + twitch) };
    });
    const elbow = elbows[1];
    const limb = (width, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(this.from.x, this.from.y);
      for (const e of elbows) ctx.lineTo(e.x, e.y);
      ctx.lineTo(h.x, h.y);
      ctx.stroke();
    };
    limb(15, C.k);
    limb(11, C.wood);
    limb(4, C.woodLight);
    for (const e of elbows) {
      fill(ctx, C.k, e.x - 7, e.y - 7, 14, 14);
      fill(ctx, C.peg, e.x - 6, e.y - 6, 12, 12);
      fill(ctx, C.woodDark, e.x - 2, e.y - 2, 4, 4);
      // His light, showing in the gap round the peg.
      fill(ctx, `rgb(${LIGHT.warm})`, e.x - 6, e.y + 5, 12, 1);
    }
    // The hand, pointing the way it reached: a palm, four long fingers
    // (spread open, curled shut) and a thumb.
    const a = this.clap ? this.angle : Math.atan2(h.y - elbow.y, h.x - elbow.x);
    ctx.translate(h.x, h.y);
    ctx.rotate(a);
    ctx.scale(HAND_SCALE, HAND_SCALE);
    const shut = h.shut;
    const fingers = [-1.5, -0.5, 0.5, 1.5].map((k) => {
      const spread = k * (0.32 * (1 - shut) + 0.05);
      const reach = 15 - shut * 9;
      return [Math.cos(spread) * reach, Math.sin(spread) * reach + k * 2.5 * (1 - shut * 0.5)];
    });
    const thumb = [4 - shut * 6, (this.bend > 0 ? -1 : 1) * (12 - shut * 5)];
    // (Each finger a joint too many: it bends in the middle, the wrong way,
    // as the hand shuts.)
    const knuckle = (fx, fy) => [fx * 0.55, fy * 0.55 - (fy >= 0 ? 1 : -1) * shut * 2.5];
    const stroke = (width, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      for (const [fx, fy] of fingers) {
        const [kx, ky] = knuckle(fx, fy);
        ctx.moveTo(2, fy * 0.4); ctx.lineTo(kx, ky); ctx.lineTo(fx, fy);
      }
      ctx.moveTo(-2, 0);
      ctx.lineTo(thumb[0], thumb[1]);
      ctx.stroke();
    };
    stroke(6, C.k);
    fill(ctx, C.k, -7, -8, 12, 16);
    stroke(4, C.woodLight);
    fill(ctx, C.wood, -6, -7, 10, 14);
    fill(ctx, C.woodLight, -6, -7, 10, 3);
    // Knuckle pegs, two to a finger.
    for (const [fx, fy] of fingers) {
      const [kx, ky] = knuckle(fx, fy);
      fill(ctx, C.peg, kx - 1, ky - 1, 2, 2);
      fill(ctx, C.woodDark, fx * 0.8 - 0.5, fy * 0.8 - 0.5, 1, 1);
    }
    ctx.restore();
  }
}

// --- His curtain call: the grand finale (rumboldAliveBow in rumboldAlive.js) ---

// The firework colours: a gold, a hot pink and a pale mint, none of them
// anywhere in the dark blue tower behind, and every one on a black outline.
export const SHOW_COLORS = ['#ffd23a', '#ff4f7a', '#aef5d2'];

// A five-pointed cardboard star, on a thick black edge, turning as it goes.
function drawStar(ctx, x, y, r, spin, color) {
  const path = (rad) => {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = spin + (i * Math.PI) / 5 - Math.PI / 2;
      const d = i % 2 ? rad * 0.45 : rad;
      ctx.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d);
    }
    ctx.closePath();
  };
  ctx.lineJoin = 'miter';
  path(r + 1.6);
  ctx.fillStyle = C.k;
  ctx.fill();
  path(r);
  ctx.fillStyle = color;
  ctx.fill();
  // A white glint on one point, so it reads even at a glance.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(Math.round(x - 1), Math.round(y - 1), 2, 2);
}

// A star flung out of a burst: it flies out, slows, and sinks.
export class StarShard {
  constructor({ x, y, vx, vy, gravity = 8, color = SHOW_COLORS[0], bounds, warn = 0 }) {
    Object.assign(this, { x, y, vx, vy, gravity, color, bounds, warn });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.spin = Math.random() * TAU;
    this.turn = (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 2);
  }

  update(dt) {
    this.age += dt;
    // (One falling from the flies shows a blinking tick where it will drop.)
    if (this.age < this.warn) return;
    this.vx *= 1 - 0.15 * dt;
    this.vy = this.vy * (1 - 0.15 * dt) + this.gravity * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  isGone() {
    const b = this.bounds;
    return this.x < b.x - 12 || this.x > b.x + b.w + 12 || this.y > b.y + b.h + 12 || this.y < b.y - 40;
  }

  edgeDistance(px, py) { return this.age < this.warn ? Infinity : Math.hypot(px - this.x, py - this.y) - 2.6; }

  draw(ctx) {
    if (this.age < this.warn) {
      ctx.save();
      ctx.globalAlpha = warnAlpha(this.age) + 0.25;
      const x = Math.round(this.x);
      const y = Math.round(this.bounds.y);
      fill(ctx, C.k, x - 3, y, 7, 6);
      fill(ctx, this.color, x - 2, y + 1, 5, 2);
      fill(ctx, this.color, x - 1, y + 3, 3, 1);
      fill(ctx, this.color, x, y + 4, 1, 1);
      ctx.restore();
      return;
    }
    drawStar(ctx, this.x, this.y, 4.2, this.spin + this.age * this.turn, this.color);
  }
}

// A rocket off the boards: first a chalked lane up to where it will burst, and
// a blinking ring there; then it goes (in `rise` seconds) and bursts (`onBurst`).
// It's only dangerous on its way up, and it's quick.
export class Shell {
  constructor({ x, floor, top, warn = 0.9, rise = 0.5, onBurst }) {
    Object.assign(this, { x, floor, top, warn, rise, onBurst });
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.y = floor;
    this.done = false;
  }

  update(dt) {
    this.age += dt;
    if (this.age < this.warn) return;
    const k = Math.min(1, (this.age - this.warn) / this.rise);
    this.y = this.floor + (this.top - this.floor) * (1 - (1 - k) * (1 - k));
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
      // Chalk lane, a crosshair ring where it will go off.
      ctx.save();
      ctx.globalAlpha = warnAlpha(this.age) + 0.2;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(x + 0.5, this.floor); ctx.lineTo(x + 0.5, this.top); ctx.stroke();
      ctx.strokeStyle = SHOW_COLORS[0];
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x + 0.5, this.floor); ctx.lineTo(x + 0.5, this.top); ctx.stroke();
      ctx.setLineDash([]);
      for (const [w, c] of [[3, '#000000'], [1, SHOW_COLORS[1]]]) {
        ctx.lineWidth = w;
        ctx.strokeStyle = c;
        ctx.beginPath(); ctx.arc(x, this.top, 7, 0, TAU); ctx.stroke();
      }
      ctx.restore();
      return;
    }
    // On its way: a red cardboard tube, a pointed nose, a streak of sparks.
    const y = Math.round(this.y);
    for (let i = 1; i <= 6; i++) fill(ctx, i % 2 ? '#ffd23a' : '#ff9a2a', x - 1 + (i % 3) - 1, y + 4 + i * 3, 2, 2);
    fill(ctx, C.k, x - 4, y - 7, 8, 14);
    fill(ctx, '#e0402c', x - 3, y - 4, 6, 10);
    fill(ctx, '#fff2d0', x - 3, y - 1, 6, 2);
    fill(ctx, '#ffd23a', x - 1, y - 8, 2, 4);
    fill(ctx, C.k, x - 2, y - 9, 4, 3);
  }
}
