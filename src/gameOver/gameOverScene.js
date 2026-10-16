import { UI_WIDTH, UI_HEIGHT } from '../config.js';
import { inUiSpace } from '../engine/screen.js';
import { music } from '../audio/music.js';
import { drawText } from '../ui/text.js';

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
    music.play(null);
  }

  update(dt, input) {
    this.time += dt;
    if (this.time >= PROMPT_DELAY && input.wasPressed('confirm')) {
      this.game.changeScene(this.restart());
    }
  }

  draw(ctx) {
    inUiSpace(ctx, () => {
      const cx = UI_WIDTH / 2;
      ctx.globalAlpha = Math.min(1, this.time / TITLE_FADE_SECONDS);
      drawText(ctx, 'GAME OVER', cx, UI_HEIGHT / 2 - 110, { size: 120, align: 'center' });
      drawText(ctx, this.message, cx, UI_HEIGHT / 2 + 10, { size: 32, color: '#9b7fd4', align: 'center' });
      ctx.globalAlpha = 1;

      const promptVisible = Math.floor((this.time - PROMPT_DELAY) / PROMPT_BLINK_SECONDS) % 2 === 0;
      if (this.time >= PROMPT_DELAY && promptVisible) {
        drawText(ctx, 'Press Z to try again', cx, UI_HEIGHT - 80, { size: 30, align: 'center' });
      }
    });
  }
}
