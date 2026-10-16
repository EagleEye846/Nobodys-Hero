const MARKER_SPEED = 230; // pixels per second

// The FIGHT minigame: a marker sweeps across a bar, and stopping it near the
// centre deals more damage. Letting it reach the end is a miss.
export class AttackBar {
  constructor(width) {
    this.width = width;
    this.pos = 0;
    this.outcome = null;
  }

  // Returns null until decided, then { hit, closeness } with closeness 0..1.
  update(dt, input) {
    if (this.outcome) return this.outcome;
    this.pos += MARKER_SPEED * dt;
    if (input.wasPressed('confirm')) {
      const half = this.width / 2;
      this.outcome = { hit: true, closeness: Math.max(0, 1 - Math.abs(this.pos - half) / half) };
    } else if (this.pos >= this.width) {
      this.outcome = { hit: false, closeness: 0 };
    }
    return this.outcome;
  }

  draw(ctx, x, y, height) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(x - 2, y - 2, this.width + 4, height + 4);
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y, this.width, height);
    // Target zone in the middle.
    ctx.fillStyle = '#c85a00';
    ctx.fillRect(x + this.width / 2 - 5, y, 10, height);
    // The moving marker.
    ctx.fillStyle = this.outcome ? '#ff2a4a' : '#fff';
    ctx.fillRect(x + Math.round(Math.min(this.pos, this.width)) - 2, y - 4, 4, height + 8);
  }
}
