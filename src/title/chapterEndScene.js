import { UI_WIDTH, UI_HEIGHT } from '../config.js';
import { inUiSpace } from '../engine/screen.js';
import { textSection } from '../engine/textLoader.js';
import { music, sfx } from '../audio/music.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { drawText, wrapLines } from '../ui/text.js';

const TEXT_FILE = 'chapter_end.txt';
const FADE_SECONDS = 2;
const PROMPT_DELAY = 4;

// Between chapters: the chapter's name, and a line that depends on how it went
// (text/chapter_end.txt). Z goes on to `next()`: the next region's first room.
export class ChapterEndScene {
  constructor(next) {
    this.home = next;
    this.time = 0;
    const seen = WORLD_STATE.seenScenes ?? [];
    const ending = seen.includes('taper_defeated') ? 'defeated' : seen.includes('taper_spared') ? 'spared' : 'neutral';
    this.title = textSection(TEXT_FILE, 'title')[0];
    this.subtitle = textSection(TEXT_FILE, 'subtitle')[0];
    this.line = textSection(TEXT_FILE, ending)[0];
  }

  enter(game) {
    this.game = game;
    music.play('prophecy');
  }

  update(dt, input) {
    this.time += dt;
    if (this.time >= PROMPT_DELAY && input.wasPressed('confirm') && this.home) {
      sfx('select');
      this.game.changeScene(this.home());
    }
  }

  draw(ctx) {
    inUiSpace(ctx, () => {
      const cx = UI_WIDTH / 2;
      ctx.globalAlpha = Math.min(1, this.time / FADE_SECONDS);
      drawText(ctx, this.title, cx, 130, { size: 72, color: '#ffcc66', align: 'center', shadow: '#5a3a10' });
      drawText(ctx, this.subtitle, cx, 210, { size: 32, color: '#c9c2e0', align: 'center' });
      ctx.globalAlpha = Math.min(1, Math.max(0, (this.time - 1.5) / FADE_SECONDS));
      const lines = wrapLines(ctx, this.line, UI_WIDTH - 120, 30);
      drawText(ctx, lines.join('\n'), cx, 290, { size: 30, align: 'center', lineHeight: 34 });
      ctx.globalAlpha = 1;
      if (this.time >= PROMPT_DELAY && Math.floor(this.time / 0.5) % 2 === 0) {
        drawText(ctx, 'Press Z to go on', cx, UI_HEIGHT - 60, { size: 26, color: '#8a82b0', align: 'center' });
      }
    });
  }
}
