import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../config.js';

const TITLE_FADE_SECONDS = 1.2;
const PROMPT_DELAY = 1.5;
const PROMPT_BLINK_SECONDS = 0.5;

// Shown when the player dies. Confirm calls restart() to build a fresh scene.
export class GameOverScene {
  constructor(restart, message = 'The floor could not hold you.') {
    this.restart = restart;
    this.message = message;
    this.time = 0;
  }

  enter(game) {
    this.game = game;
  }

  update(dt, input) {
    this.time += dt;
    if (this.time >= PROMPT_DELAY && input.wasPressed('confirm')) {
      this.game.changeScene(this.restart());
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';

    ctx.globalAlpha = Math.min(1, this.time / TITLE_FADE_SECONDS);
    ctx.font = 'bold 32px monospace';
    ctx.fillText('GAME OVER', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 16);
    ctx.font = '10px monospace';
    ctx.fillText(this.message, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 14);

    const promptVisible = Math.floor((this.time - PROMPT_DELAY) / PROMPT_BLINK_SECONDS) % 2 === 0;
    if (this.time >= PROMPT_DELAY && promptVisible) {
      ctx.globalAlpha = 1;
      ctx.fillText('Press Z to try again', SCREEN_WIDTH / 2, SCREEN_HEIGHT - 30);
    }

    ctx.restore();
  }
}
