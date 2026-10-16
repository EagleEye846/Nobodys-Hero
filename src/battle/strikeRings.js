import { drawText } from '../ui/text.js';
import { COLORS } from './hud.js';

// All sizes in UI pixels (640x480): the rings are drawn in UI space.
const BASE_RING_COUNT = 3;
const START_RADIUS = 92;
const TARGET_RADIUS = 24;
const SHRINK_SPEED = 140; // pixels per second
const TOLERANCE = 20; // how far off the target still counts as a hit
const GAP_SECONDS = 0.25;
const LABEL_SECONDS = 1.2;

// The STRIKE minigame: rings shrink one at a time onto a target circle around
// the enemy. Pressing confirm as a ring meets the target hits; closer is stronger.
// Skills can add rings (extraRings) and widen the hit window (toleranceScale).
export class StrikeRings {
  constructor(cx, cy, { extraRings = 0, toleranceScale = 1 } = {}) {
    this.cx = cx;
    this.cy = cy;
    this.ringCount = BASE_RING_COUNT + extraRings;
    this.tolerance = TOLERANCE * toleranceScale;
    this.radius = START_RADIUS;
    this.delay = GAP_SECONDS;
    this.ringIndex = 0;
    this.total = 0;
    this.labels = [];
    this.result = null;
  }

  // Returns null until every ring is resolved, then { damage }.
  update(dt, input) {
    for (const label of this.labels) label.t += dt;
    if (this.result) return this.result;
    if (this.delay > 0) {
      this.delay -= dt;
      return null;
    }

    this.radius -= SHRINK_SPEED * dt;
    let closeness = null;
    if (input.wasPressed('confirm')) {
      closeness = Math.max(0, 1 - Math.abs(this.radius - TARGET_RADIUS) / this.tolerance);
    } else if (this.radius < TARGET_RADIUS - this.tolerance) {
      closeness = 0;
    }
    if (closeness === null) return null;

    this.scoreRing(closeness);
    this.ringIndex++;
    if (this.ringIndex >= this.ringCount) {
      this.result = { damage: this.total };
      return this.result;
    }
    this.radius = START_RADIUS;
    this.delay = GAP_SECONDS;
    return null;
  }

  scoreRing(closeness) {
    let damage = closeness > 0 ? Math.round(5 + closeness * closeness * 15) : 0;
    let text = 'MISS';
    let color = COLORS.dim;
    if (closeness > 0.85) {
      damage = Math.round(damage * 1.3);
      text = 'PERFECT';
      color = COLORS.yellow;
    } else if (closeness > 0.4) {
      text = 'GOOD';
      color = COLORS.teal;
    } else if (closeness > 0) {
      text = 'OK';
      color = COLORS.text;
    }
    this.total += damage;
    this.labels.push({ text, color, index: this.ringIndex, t: 0 });
  }

  ring(ctx, radius, color, width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  draw(ctx) {
    this.ring(ctx, TARGET_RADIUS, COLORS.teal, 3);
    if (!this.result && this.delay <= 0 && this.radius > 0) this.ring(ctx, this.radius, COLORS.yellow, 3);

    // Pips beside the enemy showing how many rings are left.
    for (let i = 0; i < this.ringCount; i++) {
      ctx.fillStyle = i < this.ringIndex ? COLORS.dim : COLORS.yellow;
      ctx.fillRect(this.cx + 60 + i * 12, this.cy - 4, 8, 8);
    }

    for (const label of this.labels) {
      if (label.t > LABEL_SECONDS) continue;
      ctx.globalAlpha = 1 - label.t / LABEL_SECONDS;
      const offset = (label.index - (this.ringCount - 1) / 2) * 56;
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
