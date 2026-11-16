import { UI_WIDTH, UI_HEIGHT } from '../config.js';
import { inUiSpace } from '../engine/screen.js';
import { sfx } from '../audio/music.js';
import { CHAPTERS, chapterProgress, canPlay, beginChapter, chapterSave, continueChapter, kitLines } from '../state/chapters.js';
import { ROOMS } from '../data/rooms/index.js';
import { soulSprite } from '../battle/soul.js';
import { drawText } from '../ui/text.js';
import { glide } from '../ui/uiMotion.js';

// The chapter list, from the title screen. Chapters you've started can be
// played again from their beginning; ones you haven't reached show as "???".
// Each chapter keeps its own save (src/state/chapters.js): picking one offers
// CONTINUE, from where you got to in it, or START FROM BEGINNING.
//
// Only VISIBLE rows show at once, so the list stays clear of the prompt at
// the bottom; it scrolls with the cursor, with arrows when there's more.
const VISIBLE = 3;
// A room's name as the title screen's save card writes it.
const friendlyName = (name) => String(name).toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export class ChapterSelectScene {
  // `back()` builds the title screen; `play(room, spawn)` the chapter's first
  // scene; `resume()` carries on from the save (like CONTINUE).
  constructor(back, play, resume = null) {
    this.back = back;
    this.play = play;
    this.resume = resume;
    // The CONTINUE / START FROM BEGINNING choice, once a chapter is picked.
    this.choices = [];
    this.choice = 0;
    this.cursor = 0;
    // The first row shown.
    this.scroll = 0;
    this.confirming = false;
    this.time = 0;
    const { started, beaten } = chapterProgress();
    this.rows = CHAPTERS.map((chapter) => ({
      chapter,
      open: canPlay(chapter),
      status: beaten.has(chapter.number) ? 'BEATEN' : started.has(chapter.number) ? 'STARTED' : '',
    }));
  }

  // What picking `row` offers: CONTINUE (if that chapter has a save) and
  // START FROM BEGINNING.
  choicesFor(row) {
    const kept = this.resume ? chapterSave(row.chapter.number) : null;
    const room = kept ? ROOMS[kept.world?.room] : null;
    const where = room ? friendlyName(room.name || room.id) : '';
    const level = kept?.hero?.level ? `LV ${kept.hero.level}` : '';
    return [
      ...(kept ? [{ id: 'continue', label: 'CONTINUE', note: [where, level].filter(Boolean).join('   ') }] : []),
      { id: 'begin', label: 'START FROM BEGINNING', note: kept ? `Your Chapter ${row.chapter.number} save will be replaced.` : '' },
    ];
  }

  enter(game) {
    this.game = game;
  }

  update(dt, input) {
    this.time += dt;
    const row = this.rows[this.cursor];
    if (this.confirming) {
      const was = this.choice;
      if (input.wasPressed('down')) this.choice = (this.choice + 1) % this.choices.length;
      if (input.wasPressed('up')) this.choice = (this.choice - 1 + this.choices.length) % this.choices.length;
      if (this.choice !== was) sfx('move');
      const picked = this.choices[this.choice];
      if (input.wasPressed('confirm') && picked.id === 'continue') {
        if (!continueChapter(row.chapter.number)) return;
        sfx('select');
        this.game.changeScene(this.resume());
      } else if (input.wasPressed('confirm')) {
        const start = beginChapter(row.chapter);
        if (!start) return;
        sfx('select');
        const scene = this.play(start.room, start.spawn);
        // A kit for whoever was short of gear (giveKit) is said as you arrive.
        const kit = kitLines(start.kit);
        if (kit.length) scene.textbox?.open(kit);
        this.game.changeScene(scene);
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
    if (this.cursor < this.scroll) this.scroll = this.cursor;
    if (this.cursor >= this.scroll + VISIBLE) this.scroll = this.cursor - VISIBLE + 1;
    if (input.wasPressed('confirm')) {
      if (!row.open) {
        sfx('error');
        return;
      }
      sfx('select');
      this.choices = this.choicesFor(row);
      this.choice = 0;
      this.confirming = true;
    }
  }

  draw(ctx) {
    inUiSpace(ctx, () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, UI_WIDTH, UI_HEIGHT);
      const cx = UI_WIDTH / 2;
      drawText(ctx, 'CHAPTERS', cx, 60, { size: 56, color: '#ffcc66', align: 'center', shadow: '#5a3a10' });
      const top = 150;
      const gap = 62;
      const shown = this.rows.slice(this.scroll, this.scroll + VISIBLE);
      // Arrows when there are chapters above or below the ones shown.
      const bob = Math.round(Math.sin(this.time * 4) * 3);
      if (this.scroll > 0) drawText(ctx, '▲', cx, top - 36 - bob, { size: 22, color: '#8a82b0', align: 'center' });
      if (this.scroll + VISIBLE < this.rows.length) drawText(ctx, '▼', cx, top + VISIBLE * gap - 22 + bob, { size: 22, color: '#8a82b0', align: 'center' });
      shown.forEach((row, n) => {
        const i = this.scroll + n;
        const y = top + n * gap;
        const selected = i === this.cursor;
        const x = cx - 270;
        if (selected) {
          const at = glide('chapterSelect', x - 34, y + 10);
          ctx.drawImage(soulSprite(), at.x, at.y);
        }
        const color = !row.open ? '#5a5468' : selected ? '#ffe14d' : '#ffffff';
        drawText(ctx, `CHAPTER ${row.chapter.number}`, x, y, { size: 32, color });
        drawText(ctx, row.open ? row.chapter.name : '???', x + 172, y, { size: 32, color: row.open ? (selected ? '#ffe14d' : '#c9c2e0') : '#5a5468' });
        if (row.status) drawText(ctx, row.status, cx + 270, y + 4, { size: 24, color: row.status === 'BEATEN' ? '#4fe3d0' : '#ffcc66', align: 'right' });
      });
      if (this.confirming) {
        const row = this.rows[this.cursor];
        drawText(ctx, `Chapter ${row.chapter.number}: ${row.chapter.name}`, cx, UI_HEIGHT - 196, { size: 28, align: 'center', color: '#ffcc66' });
        this.choices.forEach((choice, n) => {
          const y = UI_HEIGHT - 156 + n * 40;
          const on = n === this.choice;
          if (on) ctx.drawImage(soulSprite(), cx - 220, y + 6);
          drawText(ctx, choice.label, cx - 186, y, { size: 28, color: on ? '#ffe14d' : '#ffffff' });
        });
        const note = this.choices[this.choice].note;
        if (note) drawText(ctx, note, cx, UI_HEIGHT - 70, { size: 22, align: 'center', color: '#c9c2e0' });
        drawText(ctx, 'Z: pick     X: back', cx, UI_HEIGHT - 38, { size: 20, align: 'center', color: '#8a82b0' });
      } else {
        drawText(ctx, 'Z: play     X: back', cx, UI_HEIGHT - 74, { size: 24, align: 'center', color: '#8a82b0' });
      }
    });
  }
}
