import { UI_WIDTH, UI_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT } from '../config.js';
import { PANELS, PANEL_WIDTH, PANEL_HEIGHT } from '../data/art/cutscenes.js';
import { inUiSpace } from '../engine/screen.js';
import { textSection } from '../engine/textLoader.js';
import { music, sfx } from '../audio/music.js';
import { hasSave } from '../state/saveGame.js';
import { drawText, textWidth } from '../ui/text.js';

const TEXT_FILE = 'title.txt';

const PROMPT_BLINK_SECONDS = 0.5;
const TITLE_FADE_SECONDS = 1.5;
const PROMPT_DELAY = 1.2;
// The title shrinks to fit if it's long.
const TITLE_SIZE = 72;
const TITLE_MAX_WIDTH = UI_WIDTH - 80;

function blinkOn(time) {
  return Math.floor(time / PROMPT_BLINK_SECONDS) % 2 === 0;
}

// Browsers won't play sound until a key is pressed, so the game opens on this
// before the intro (which needs its music). `next()` builds the next scene.
export class PressStartScene {
  constructor(next) {
    this.next = next;
    this.time = 0;
  }

  enter(game) {
    this.game = game;
  }

  update(dt, input) {
    this.time += dt;
    if (input.wasPressed('confirm')) this.game.changeScene(this.next());
  }

  draw(ctx) {
    if (!blinkOn(this.time)) return;
    inUiSpace(ctx, () => {
      drawText(ctx, textSection(TEXT_FILE, 'press_start')[0], UI_WIDTH / 2, UI_HEIGHT / 2 - 14, { size: 28, color: '#888', align: 'center' });
    });
  }
}

// The title screen, after the intro. Confirm starts the game, or continues
// from the last save point. Its words live in text/title.txt.
export class TitleScene {
  constructor(startGame) {
    this.startGame = startGame;
    this.time = 0;
    this.title = textSection(TEXT_FILE, 'title')[0];
    this.prompt = textSection(TEXT_FILE, hasSave() ? 'continue' : 'new_game')[0];
  }

  enter(game) {
    this.game = game;
    music.play('prophecy');
  }

  update(dt, input) {
    this.time += dt;
    if (this.time >= PROMPT_DELAY && input.wasPressed('confirm')) {
      sfx('select');
      this.game.changeScene(this.startGame());
    }
  }

  draw(ctx) {
    const fade = Math.min(1, this.time / TITLE_FADE_SECONDS);
    this.drawStair(ctx, fade);

    inUiSpace(ctx, () => {
      const cx = UI_WIDTH / 2;
      const lines = this.title.split('\n');
      const widest = Math.max(...lines.map((line) => textWidth(ctx, line, TITLE_SIZE)));
      const size = Math.min(TITLE_SIZE, Math.floor((TITLE_SIZE * TITLE_MAX_WIDTH) / widest));

      ctx.globalAlpha = fade;
      drawText(ctx, this.title, cx, 92 - (lines.length - 1) * size * 0.5, {
        size, color: '#ffcc66', align: 'center', shadow: '#5a3a10',
      });
      ctx.globalAlpha = 1;

      if (this.time >= PROMPT_DELAY && blinkOn(this.time - PROMPT_DELAY)) {
        drawText(ctx, this.prompt, cx, UI_HEIGHT - 46, { size: 30, align: 'center', outline: '#07040c' });
      }
    });
  }

  // The Hero's stair from the intro, glowing faintly under the title, with
  // embers drifting up from the lanterns. In world pixels (320x240).
  drawStair(ctx, fade) {
    const x = (SCREEN_WIDTH - PANEL_WIDTH) / 2;
    const y = 104;
    ctx.save();
    ctx.globalAlpha = fade * 0.75;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.rect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);
    ctx.clip();
    PANELS.stair(ctx, this.time);
    ctx.restore();
    // Fade the picture's edges into the dark.
    const edge = ctx.createLinearGradient(0, y, 0, y + PANEL_HEIGHT);
    edge.addColorStop(0, 'rgba(0, 0, 0, 0)');
    edge.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    edge.addColorStop(1, 'rgba(0, 0, 0, 1)');
    ctx.fillStyle = edge;
    ctx.fillRect(x, y, PANEL_WIDTH, PANEL_HEIGHT);
    const sides = ctx.createLinearGradient(x, 0, x + PANEL_WIDTH, 0);
    sides.addColorStop(0, 'rgba(0, 0, 0, 1)');
    sides.addColorStop(0.25, 'rgba(0, 0, 0, 0)');
    sides.addColorStop(0.75, 'rgba(0, 0, 0, 0)');
    sides.addColorStop(1, 'rgba(0, 0, 0, 1)');
    ctx.fillStyle = sides;
    ctx.fillRect(x, y, PANEL_WIDTH, PANEL_HEIGHT);
    for (let i = 0; i < 26; i++) {
      const rise = (this.time * (8 + (i % 5) * 3) + i * 37) % 250;
      const ex = (i * 53 + Math.sin(this.time * 0.8 + i) * 6 + 400) % SCREEN_WIDTH;
      const ey = SCREEN_HEIGHT - rise;
      ctx.globalAlpha = fade * (0.35 + 0.35 * Math.sin(this.time * 3 + i * 1.7)) * Math.min(1, rise / 60);
      ctx.fillStyle = i % 3 ? '#ffcc66' : '#ff8c1a';
      ctx.fillRect(Math.round(ex), Math.round(ey), 1, 1);
    }
    ctx.globalAlpha = 1;
  }
}
