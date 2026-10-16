import { drawText } from '../ui/text.js';
import { sfx } from '../audio/music.js';
import { COLORS } from './hud.js';

// All sizes in UI pixels (640x480): the bar is drawn in UI space, centred in
// the bottom panel where the dialogue usually goes.
const TRACK = { x: 150, y: 404, w: 340, h: 44 };
const NOTCH_X = TRACK.x + 40;
const BASE_SLASH_COUNT = 3;
const SLIDE_SPEED = 260; // pixels per second
const FIRST_GAP = 30; // how far past the right end the first slash starts
const MIN_SPACING = 100;
const MAX_SPACING = 170;
const TOLERANCE = 28; // how far from the notch still counts as a hit
const SLASH_WIDTH = 5;
const SLASH_INSET = 6; // gap between a slash and the top/bottom of the track
const TRAIL_STEP = 9;
const BURST_SECONDS = 0.4;
const LABEL_SECONDS = 1.2;

// The FIGHT minigame: slash marks slide in from the right, one after another,
// toward a notch at the left of the bar. Press confirm as each one crosses the
// notch; closer is stronger. Pressing when no slash is near the notch wastes
// the next one, so mashing doesn't work. Skills can add slashes
// (extraSlashes) and widen the hit window (toleranceScale).
export class StrikeBar {
  constructor(cx, cy, { extraSlashes = 0, toleranceScale = 1, color = COLORS.teal } = {}) {
    // Where the enemy is, for the PERFECT/GOOD labels.
    this.cx = cx;
    this.cy = cy;
    this.color = color;
    this.tolerance = TOLERANCE * toleranceScale;
    this.slashes = [];
    let x = TRACK.x + TRACK.w + FIRST_GAP;
    for (let i = 0; i < BASE_SLASH_COUNT + extraSlashes; i++) {
      this.slashes.push({ x, state: 'sliding', t: 0, closeness: 0 });
      x += MIN_SPACING + Math.random() * (MAX_SPACING - MIN_SPACING);
    }
    this.total = 0;
    this.labels = [];
    this.result = null;
    this.time = 0;
  }

  // Returns null until every slash is resolved, then { damage }.
  update(dt, input) {
    this.time += dt;
    for (const label of this.labels) label.t += dt;
    // A press is judged where the slash was drawn when the player pressed,
    // before it moves on this frame.
    const next = this.slashes.find((slash) => slash.state === 'sliding');
    if (next && input.wasPressed('confirm')) {
      const gap = Math.abs(next.x - NOTCH_X);
      this.score(next, gap <= this.tolerance ? 1 - gap / this.tolerance : 0);
    }
    for (const slash of this.slashes) {
      if (slash.state === 'hit') slash.t += dt;
      else slash.x -= SLIDE_SPEED * dt;
    }
    for (const slash of this.slashes) {
      if (slash.state === 'sliding' && slash.x < NOTCH_X - this.tolerance) this.score(slash, 0);
    }

    if (!this.result && this.slashes.every((slash) => slash.state !== 'sliding')) this.result = { damage: this.total };
    return this.result;
  }

  score(slash, closeness) {
    const index = this.slashes.indexOf(slash);
    slash.closeness = closeness;
    if (closeness <= 0) {
      slash.state = 'missed';
      this.labels.push({ text: 'MISS', color: COLORS.dim, index, t: 0 });
      return;
    }
    slash.state = 'hit';
    slash.x = NOTCH_X;
    sfx('slash');
    let damage = Math.round(5 + closeness * closeness * 15);
    let text = 'OK';
    let color = COLORS.text;
    if (closeness > 0.85) {
      damage = Math.round(damage * 1.3);
      text = 'PERFECT';
      color = COLORS.yellow;
    } else if (closeness > 0.4) {
      text = 'GOOD';
      color = COLORS.teal;
    }
    this.total += damage;
    this.labels.push({ text, color, index, t: 0 });
  }

  // The bar, drawn over the bottom panel.
  drawBar(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(TRACK.x, TRACK.y, TRACK.w, TRACK.h);
    ctx.fillStyle = COLORS.outline;
    ctx.fill();
    ctx.clip();
    this.drawNotch(ctx);
    for (const slash of this.slashes) this.drawSlash(ctx, slash);
    ctx.restore();

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.strokeRect(TRACK.x + 1.5, TRACK.y + 1.5, TRACK.w - 3, TRACK.h - 3);
    this.drawPips(ctx);
  }

  // The target: the hit window as a box in the fighter's colour, brightest
  // at its centre line, pulsing gently.
  drawNotch(ctx) {
    const left = NOTCH_X - this.tolerance;
    const width = this.tolerance * 2;
    ctx.globalAlpha = 0.18 + 0.08 * Math.sin(this.time * 8);
    ctx.fillStyle = this.color;
    ctx.fillRect(left, TRACK.y, width, TRACK.h);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(left + 1, TRACK.y + 5, width - 2, TRACK.h - 10);
    ctx.fillStyle = this.color;
    ctx.fillRect(NOTCH_X - 2, TRACK.y + 5, 4, TRACK.h - 10);
  }

  // A slash is a tall white bar with fading after-images behind it. A hit one
  // flashes and swells at the target; a missed one goes grey and slides off.
  drawSlash(ctx, slash) {
    if (slash.state === 'hit') {
      if (slash.t > BURST_SECONDS) return;
      const k = slash.t / BURST_SECONDS;
      const color = slash.closeness > 0.85 ? COLORS.yellow : COLORS.text;
      ctx.globalAlpha = 1 - k;
      this.bar(ctx, slash.x, color, SLASH_WIDTH + k * 26, k * -6);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      const grow = 6 + k * 30;
      ctx.strokeRect(slash.x - grow, TRACK.y + SLASH_INSET - k * 10, grow * 2, TRACK.h - SLASH_INSET * 2 + k * 20);
      ctx.globalAlpha = 1;
      return;
    }
    if (slash.x > TRACK.x + TRACK.w + SLASH_WIDTH) return;
    const color = slash.state === 'missed' ? COLORS.dim : COLORS.text;
    for (let i = 3; i >= 1; i--) {
      ctx.globalAlpha = 0.1 * (4 - i);
      this.bar(ctx, slash.x + i * TRAIL_STEP, color, SLASH_WIDTH, 0);
    }
    ctx.globalAlpha = 1;
    if (slash.state === 'sliding') {
      ctx.shadowColor = COLORS.text;
      ctx.shadowBlur = 10;
    }
    this.bar(ctx, slash.x, color, SLASH_WIDTH, 0);
    ctx.shadowBlur = 0;
  }

  bar(ctx, x, color, width, extraHeight) {
    ctx.fillStyle = color;
    ctx.fillRect(x - width / 2, TRACK.y + SLASH_INSET - extraHeight, width, TRACK.h - SLASH_INSET * 2 + extraHeight * 2);
  }

  // Pips just above the right end of the track: how many slashes are left.
  drawPips(ctx) {
    this.slashes.forEach((slash, i) => {
      ctx.fillStyle = slash.state === 'sliding' ? COLORS.yellow : COLORS.dim;
      ctx.fillRect(TRACK.x + TRACK.w - 12 - (this.slashes.length - 1 - i) * 12, TRACK.y - 11, 8, 8);
    });
  }

  // PERFECT / GOOD / MISS rising over the enemy, one per slash.
  drawLabels(ctx) {
    for (const label of this.labels) {
      if (label.t > LABEL_SECONDS) continue;
      ctx.globalAlpha = 1 - label.t / LABEL_SECONDS;
      const offset = (label.index - (this.slashes.length - 1) / 2) * 56;
      drawText(ctx, label.text, this.cx + offset, this.cy + 36 - label.t * 20, {
        size: 24,
        color: label.color,
        align: 'center',
        outline: COLORS.outline,
      });
    }
    ctx.globalAlpha = 1;
  }
}
