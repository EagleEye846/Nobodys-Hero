import { UI_SCALE } from '../config.js';
import { drawNowPlaying } from '../ui/nowPlaying.js';

// Longest frame step we simulate, so a stalled tab doesn't teleport the player.
const MAX_FRAME_SECONDS = 1 / 20;

// Runs the main loop and hands each frame to the active scene.
// A scene is any object with update(dt, input) and draw(ctx), plus an optional enter(game).
// draw() starts in world coordinates; see inUiSpace in screen.js for UI drawing.
export class Game {
  constructor(ctx, input) {
    this.ctx = ctx;
    this.input = input;
    this.scene = null;
    this.lastTime = 0;
  }

  changeScene(scene) {
    this.scene = scene;
    scene.enter?.(this);
  }

  start() {
    this.lastTime = performance.now();
    requestAnimationFrame(this.frame);
  }

  frame = (now) => {
    // Always ask for the next frame first, so a mistake in a scene can't stop
    // the loop dead (which looks like the game freezing).
    requestAnimationFrame(this.frame);
    const dt = Math.min(Math.max(0, (now - this.lastTime) / 1000), MAX_FRAME_SECONDS);
    this.lastTime = now;
    const { ctx } = this;
    try {
      if (!this.error) this.scene.update(dt, this.input);
      this.input.endFrame();

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.setTransform(UI_SCALE, 0, 0, UI_SCALE, 0, 0);
      this.scene.draw(ctx);
      // A new song's name, top left, for a few seconds.
      drawNowPlaying(ctx, now);
    } catch (error) {
      // Stop the scene where it is and say what went wrong, on screen, so it
      // can be reported rather than just freezing.
      if (!this.error) console.error(error);
      this.error ??= error;
    }
    if (this.error) this.drawError(ctx);
  };

  drawError(ctx) {
    // The first line of the stack in the game's own code: where it broke.
    const at = String(this.error?.stack ?? '').split('\n').find((line) => line.includes('/src/')) ?? '';
    const where = at.match(/src\/[^)\s]+/)?.[0] ?? '';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = 'rgba(40, 0, 10, 0.92)';
    ctx.fillRect(0, 0, ctx.canvas.width, 96);
    ctx.fillStyle = '#ffd0d8';
    ctx.font = '20px monospace';
    ctx.fillText('Something broke. Please report this:', 12, 28);
    ctx.fillText(String(this.error?.message ?? this.error).slice(0, 90), 12, 56);
    ctx.fillText(where.slice(0, 90), 12, 84);
  }
}
