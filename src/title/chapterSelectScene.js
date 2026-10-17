import { UI_WIDTH, UI_HEIGHT } from '../config.js';
import { inUiSpace } from '../engine/screen.js';
import { sfx } from '../audio/music.js';
import { CHAPTERS, chapterProgress, canPlay, beginChapter } from '../state/chapters.js';
import { soulSprite } from '../battle/soul.js';
import { drawText } from '../ui/text.js';

// The chapter list, from the title screen. Chapters you've started can be
// played again from their beginning; ones you haven't reached show as "???".
// Picking one asks first, since it takes the place of your save (which is
// backed up: see src/state/chapters.js).
export class ChapterSelectScene {
  // `back()` builds the title screen; `play(room, spawn)` the chapter's first scene.
  constructor(back, play) {
    this.back = back;
    this.play = play;
    this.cursor = 0;
    this.confirming = false;
    this.time = 0;
    const { started, beaten } = chapterProgress();
    this.rows = CHAPTERS.map((chapter) => ({
      chapter,
      open: canPlay(chapter),
      status: beaten.has(chapter.number) ? 'BEATEN' : started.has(chapter.number) ? 'STARTED' : '',
    }));
  }

  enter(game) {
    this.game = game;
  }

  update(dt, input) {
    this.time += dt;
    const row = this.rows[this.cursor];
    if (this.confirming) {
      if (input.wasPressed('confirm')) {
        const start = beginChapter(row.chapter);
        if (!start) return;
        sfx('select');
        this.game.changeScene(this.play(start.room, start.spawn));
      } else if (input.wasPressed('cancel')) {
        sfx('back');
        this.confirming = false;
      }
      return;
    }
    if (input.wasPressed('cancel')) {
      sfx('back');
      this.game.changeScene(this.back());
      return;
    }
    const before = this.cursor;
    if (input.wasPressed('down')) this.cursor = (this.cursor + 1) % this.rows.length;
    if (input.wasPressed('up')) this.cursor = (this.cursor - 1 + this.rows.length) % this.rows.length;
    if (this.cursor !== before) sfx('move');
    if (input.wasPressed('confirm')) {
      if (!row.open) {
        sfx('error');
        return;
      }
      sfx('select');
      this.confirming = true;
    }
  }

  draw(ctx) {
    inUiSpace(ctx, () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, UI_WIDTH, UI_HEIGHT);
      const cx = UI_WIDTH / 2;
      drawText(ctx, 'CHAPTERS', cx, 60, { size: 56, color: '#ffcc66', align: 'center', shadow: '#5a3a10' });
      const top = 170;
      const gap = 74;
      this.rows.forEach((row, i) => {
        const y = top + i * gap;
        const selected = i === this.cursor;
        const x = cx - 270;
        if (selected) ctx.drawImage(soulSprite(), x - 34, y + 10);
        const color = !row.open ? '#5a5468' : selected ? '#ffe14d' : '#ffffff';
        drawText(ctx, `CHAPTER ${row.chapter.number}`, x, y, { size: 32, color });
        drawText(ctx, row.open ? row.chapter.name : '???', x + 172, y, { size: 32, color: row.open ? (selected ? '#ffe14d' : '#c9c2e0') : '#5a5468' });
        if (row.status) drawText(ctx, row.status, cx + 270, y + 4, { size: 24, color: row.status === 'BEATEN' ? '#4fe3d0' : '#ffcc66', align: 'right' });
      });
      if (this.confirming) {
        const row = this.rows[this.cursor];
        drawText(ctx, `Start Chapter ${row.chapter.number} from the beginning?`, cx, UI_HEIGHT - 150, { size: 30, align: 'center', color: '#ffffff' });
        drawText(ctx, 'Your save is backed up, then replaced.', cx, UI_HEIGHT - 112, { size: 24, align: 'center', color: '#c9c2e0' });
        drawText(ctx, 'Z: yes     X: no', cx, UI_HEIGHT - 74, { size: 26, align: 'center', color: '#ffe14d' });
      } else {
        drawText(ctx, 'Z: play     X: back', cx, UI_HEIGHT - 74, { size: 24, align: 'center', color: '#8a82b0' });
      }
    });
  }
}
