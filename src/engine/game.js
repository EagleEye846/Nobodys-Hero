import { UI_SCALE } from '../config.js';

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
    const dt = Math.min(Math.max(0, (now - this.lastTime) / 1000), MAX_FRAME_SECONDS);
    this.lastTime = now;

    this.scene.update(dt, this.input);
    this.input.endFrame();

    const { ctx } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.setTransform(UI_SCALE, 0, 0, UI_SCALE, 0, 0);
    this.scene.draw(ctx);

    requestAnimationFrame(this.frame);
  };
}
