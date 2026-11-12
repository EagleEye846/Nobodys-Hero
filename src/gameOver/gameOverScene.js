import { UI_WIDTH, UI_HEIGHT } from '../config.js';
import { inUiSpace } from '../engine/screen.js';
import { music, sfx } from '../audio/music.js';
import { drawText, textWidth, wrapLines } from '../ui/text.js';
import { textFile } from '../engine/textLoader.js';
import { promptName } from '../engine/input.js';
import { soulSprite } from '../battle/soul.js';

// Shown when the player dies. Confirm calls restart() to build a fresh scene.
// After a boss or story fight (`retry`), there are two choices instead: TRY
// AGAIN goes straight back into the fight (retry() does that), and LAST SAVE
// is the usual restart().
//
// The last thing you saw stays up and goes slowly dark. Over it, a lantern
// flame, small, guttering; GAME OVER comes up a letter at a time to a low
// toll, then your own line (what got you) under it, quicker; the flame goes
// out; and then the prompt breathes in. Short enough not to wear thin the
// fifth time.
const FADE_SECONDS = 1.4;
const TITLE = 'GAME OVER';
const TITLE_AT = 0.7;
const TITLE_LETTER = 0.09;
const LINE_AT = 1.75;
const LINE_LETTER = 0.022;
const FLAME_OUT = 2.2;
const PROMPT_AT = 2.5;
const PROMPT_IN = 0.5;
const CHOICES = ['TRY AGAIN', 'LAST SAVE'];
const CHOICE_GAP = 220;

// A boss's own line under GAME OVER (text/game_over.txt, by the id of any
// enemy in the fight), or undefined.
export function bossGameOverWords(ids = []) {
  let words;
  try {
    words = textFile('game_over.txt');
  } catch {
    return undefined;
  }
  for (const id of ids) if (words[id]?.length) return words[id][0];
  return undefined;
}

export class GameOverScene {
  constructor(restart, message = 'The floor could not hold you.', { retry = null } = {}) {
    this.restart = restart;
    this.retry = retry;
    this.choice = 0;
    this.message = message;
    // Counted by letter, not by code unit, so an emoji never shows half-drawn.
    this.letters = [...message];
    this.time = 0;
    this.titleShown = 0;
    this.lineShown = 0;
    this.snapshot = null;
    // The flame's own flicker, steady from frame to frame.
    this.flicker = Array.from({ length: 8 }, () => Math.random() * Math.PI * 2);
  }

  enter(game) {
    this.game = game;
    music.play(null);
    // The canvas still holds the last frame the old scene drew: keep it.
    const source = game.ctx?.canvas;
    if (source) {
      this.snapshot = document.createElement('canvas');
      this.snapshot.width = source.width;
      this.snapshot.height = source.height;
      this.snapshot.getContext('2d').drawImage(source, 0, 0);
    }
  }

  update(dt, input) {
    this.time += dt;
    // The letters, as they come, each with its toll.
    const title = Math.max(0, Math.min(TITLE.length, Math.floor((this.time - TITLE_AT) / TITLE_LETTER) + 1));
    if (title > this.titleShown) {
      if (TITLE[title - 1] !== ' ') sfx('toll');
      this.titleShown = title;
    }
    const line = Math.max(0, Math.min(this.letters.length, Math.floor((this.time - LINE_AT) / LINE_LETTER) + 1));
    if (line > this.lineShown) {
      if (line % 3 === 0) sfx('type');
      this.lineShown = line;
    }
    if (this.time < PROMPT_AT || this.chosen) return;
    if (this.retry) {
      const before = this.choice;
      if (input.wasPressed('left') || input.wasPressed('up')) this.choice = 0;
      if (input.wasPressed('right') || input.wasPressed('down')) this.choice = 1;
      if (this.choice !== before) sfx('move');
    }
    if (input.wasPressed('confirm')) {
      // (Once: a second press mustn't start it twice.)
      this.chosen = true;
      sfx('select');
      if (this.retry && this.choice === 0) this.retry();
      else this.game.changeScene(this.restart());
    }
  }

  draw(ctx) {
    inUiSpace(ctx, () => {
      const cx = UI_WIDTH / 2;
      const cy = UI_HEIGHT / 2;
      // What you saw last, going dark.
      if (this.snapshot) {
        ctx.globalAlpha = Math.max(0, 1 - this.time / FADE_SECONDS) * 0.85;
        ctx.drawImage(this.snapshot, 0, 0);
        ctx.globalAlpha = 1;
      }
      // GAME OVER, letter by letter, held where the whole of it will sit;
      // the flame under it; your own line under that.
      if (this.titleShown > 0) {
        const size = 120;
        const left = cx - textWidth(ctx, TITLE, size) / 2;
        drawText(ctx, TITLE.slice(0, this.titleShown), left, cy - 160, { size, color: '#e8e4f4', shadow: '#1a0e2a' });
      }
      this.drawFlame(ctx, cx, cy + 4);
      if (this.lineShown > 0) {
        // A long line wraps, each row centred where it'll end up.
        const size = 32;
        let shown = this.lineShown;
        wrapLines(ctx, this.message, UI_WIDTH - 160, size).forEach((row, i) => {
          const letters = [...row];
          const left = cx - textWidth(ctx, row, size) / 2;
          drawText(ctx, letters.slice(0, Math.max(0, shown)).join(''), left, cy + 40 + i * (size + 6), { size, color: '#9b7fd4' });
          shown -= letters.length + 1;
        });
      }
      // The prompt, breathing.
      if (this.time >= PROMPT_AT) {
        const t = this.time - PROMPT_AT;
        if (this.retry) {
          this.drawChoices(ctx, cx, UI_HEIGHT - 84, Math.min(1, t / PROMPT_IN));
        } else {
          ctx.globalAlpha = Math.min(1, t / PROMPT_IN) * (0.6 + 0.4 * Math.sin(t * 3));
          drawText(ctx, `Press ${promptName('confirm')} to try again`, cx, UI_HEIGHT - 80, { size: 30, align: 'center' });
        }
        ctx.globalAlpha = 1;
      }
    });
  }

  // TRY AGAIN and LAST SAVE side by side, the soul by the chosen one.
  drawChoices(ctx, cx, y, fade) {
    const size = 30;
    CHOICES.forEach((label, i) => {
      const x = cx + (i - 0.5) * CHOICE_GAP;
      const selected = i === this.choice;
      ctx.globalAlpha = fade * (selected ? 1 : 0.7);
      drawText(ctx, label, x, y, { size, align: 'center', color: selected ? '#ffe14d' : '#9b8fbf' });
      if (selected) {
        const soul = soulSprite();
        ctx.drawImage(soul, Math.round(x - textWidth(ctx, label, size) / 2 - soul.width - 12), y + Math.round((size - soul.height) / 2));
      }
    });
    ctx.globalAlpha = fade * 0.8;
    drawText(ctx, this.choice === 0 ? 'Back into the fight, everyone whole.' : 'Back to where you last saved.', cx, y + 40, { size: 22, align: 'center', color: '#6f6690' });
  }

  // A lantern flame on its wick, guttering, and out; then a wisp of smoke.
  drawFlame(ctx, x, y) {
    const t = this.time;
    const S = 4;
    const px = (color, dx, dy, w = 1, h = 1) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x + dx * S), Math.round(y + dy * S), w * S, h * S);
    };
    // The wick, and the lantern's little dish under it.
    px('#2a2230', -1, 0, 2, 3);
    px('#4a4058', -4, 3, 8, 1);
    px('#2e2838', -5, 4, 10, 1);
    const life = Math.max(0, 1 - t / FLAME_OUT);
    if (life > 0) {
      // Guttering: it leans and shrinks in fits as it goes.
      const f = this.flicker;
      const gutter = t > FLAME_OUT * 0.45 ? (Math.sin(t * 17 + f[0]) > 0.3 ? 0.45 : 1) : 1;
      const height = Math.max(1, Math.round((4 + Math.sin(t * 9 + f[1]) * 1.2) * life * gutter));
      const lean = Math.round(Math.sin(t * 6 + f[2]) * (1 + (1 - life) * 2));
      for (let i = 0; i < height; i++) {
        const w = Math.max(1, 3 - Math.floor((i / Math.max(1, height - 1)) * 2));
        const dx = Math.round(lean * (i / height));
        px(i < height - 1 ? '#f0a040' : '#ffe08a', dx - Math.floor(w / 2), -1 - i, w, 1);
      }
      px('#ffe8a0', lean > 0 ? 0 : -1, -1, 1, 1);
      // Its light on the dish.
      ctx.globalAlpha = 0.18 * life;
      const glow = ctx.createRadialGradient(x, y, 2, x, y, 90 * life + 10);
      glow.addColorStop(0, 'rgba(255, 190, 110, 1)');
      glow.addColorStop(1, 'rgba(255, 190, 110, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(x - 100, y - 100, 200, 200);
      ctx.globalAlpha = 1;
    } else {
      // Smoke, for a moment after.
      const since = t - FLAME_OUT;
      if (since < 1.6) {
        ctx.globalAlpha = Math.max(0, 1 - since / 1.6) * 0.7;
        for (let i = 0; i < 4; i++) {
          const rise = since * 14 + i * 3;
          px('#6a6478', Math.round(Math.sin(since * 4 + i) * 1.5), -1 - rise, 1, 1);
        }
        ctx.globalAlpha = 1;
      }
    }
  }
}
