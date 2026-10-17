import { SCREEN_WIDTH } from '../config.js';
import { inUiSpace } from '../engine/screen.js';
import { textFile } from '../engine/textLoader.js';
import { music, sfx } from '../audio/music.js';
import { drawText, wrapLines } from '../ui/text.js';
import { PANELS, PANEL_WIDTH, PANEL_HEIGHT } from '../data/art/cutscenes.js';

// The picture, in world pixels (320x240), centred near the top like Undertale's intro.
const PANEL_X = (SCREEN_WIDTH - PANEL_WIDTH) / 2;
const PANEL_Y = 22;

// The text, in UI pixels (640x480), under the picture.
// About four lines fit, so keep each page short.
const TEXT_X = 80;
const TEXT_Y = 290;
const TEXT_WIDTH = 480;
const TEXT_SIZE = 32;
const LINE_HEIGHT = 36;

const CHARACTERS_PER_SECOND = 16;
// A typing blip every few letters.
const BLIP_EVERY = 2;
// How long a finished page stays up: a base time, plus a little per letter.
const HOLD_SECONDS = 1.6;
const HOLD_SECONDS_PER_CHARACTER = 0.025;
// Pictures fade in from black and out to black.
const FADE_SECONDS = 0.7;

// Plays a cutscene from a file in text/cutscenes/ (see the comments in
// intro.txt): each [section] shows a picture from PANELS, and each entry under
// it is a page of text typed out slowly beneath it. It plays by itself, and
// confirm skips the rest. `next()` builds the scene that follows.
export class CutsceneScene {
  constructor(path, next, { song = null } = {}) {
    this.next = next;
    this.song = song;
    // Anything after a space in a section name is ignored, so [stair] and
    // [stair again] both show the stair.
    this.shots = Object.entries(textFile(path)).map(([section, pages]) => {
      const picture = section.split(' ')[0];
      if (!PANELS[picture]) {
        throw new Error(`text/${path}: there's no picture called '${picture}'. Pictures: ${Object.keys(PANELS).join(', ')}.`);
      }
      return { picture, pages };
    });
    this.shotIndex = 0;
    this.pageIndex = 0;
    this.phase = 'fadeIn';
    this.phaseTime = 0;
    this.shotTime = 0;
    this.visibleCharacters = 0;
  }

  enter(game) {
    this.game = game;
    music.play(this.song);
  }

  get shot() {
    return this.shots[this.shotIndex];
  }

  get page() {
    return this.shot.pages[this.pageIndex] ?? '';
  }

  setPhase(phase) {
    this.phase = phase;
    this.phaseTime = 0;
  }

  finish() {
    this.game.changeScene(this.next());
  }

  update(dt, input) {
    if (input.wasPressed('confirm') || !this.shot) {
      this.finish();
      return;
    }

    this.phaseTime += dt;
    this.shotTime += dt;

    if (this.phase === 'fadeIn' && this.phaseTime >= FADE_SECONDS) {
      this.setPhase('typing');
    } else if (this.phase === 'typing') {
      const before = Math.floor(this.visibleCharacters);
      this.visibleCharacters = Math.min(this.page.length, this.visibleCharacters + CHARACTERS_PER_SECOND * dt);
      const after = Math.floor(this.visibleCharacters);
      for (let i = before; i < after; i++) {
        if (i % BLIP_EVERY === 0 && this.page[i].trim()) sfx('type');
      }
      if (this.visibleCharacters >= this.page.length) this.setPhase('hold');
    } else if (this.phase === 'hold' && this.phaseTime >= HOLD_SECONDS + this.page.length * HOLD_SECONDS_PER_CHARACTER) {
      if (this.pageIndex + 1 < this.shot.pages.length) {
        this.pageIndex++;
        this.visibleCharacters = 0;
        this.setPhase('typing');
      } else {
        this.setPhase('fadeOut');
      }
    } else if (this.phase === 'fadeOut' && this.phaseTime >= FADE_SECONDS) {
      this.shotIndex++;
      if (!this.shot) {
        this.finish();
        return;
      }
      this.pageIndex = 0;
      this.visibleCharacters = 0;
      this.shotTime = 0;
      this.setPhase('fadeIn');
    }
  }

  get brightness() {
    if (this.phase === 'fadeIn') return Math.min(1, this.phaseTime / FADE_SECONDS);
    if (this.phase === 'fadeOut') return Math.max(0, 1 - this.phaseTime / FADE_SECONDS);
    return 1;
  }

  draw(ctx) {
    if (!this.shot) return;
    ctx.save();
    ctx.globalAlpha = this.brightness;
    ctx.translate(PANEL_X, PANEL_Y);
    ctx.beginPath();
    ctx.rect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);
    ctx.clip();
    PANELS[this.shot.picture](ctx, this.shotTime);
    ctx.restore();

    inUiSpace(ctx, () => {
      ctx.globalAlpha = this.brightness;
      let remaining = Math.floor(this.visibleCharacters);
      // Count the line breaks between wrapped lines too, so the reveal stays in step with the page.
      wrapLines(ctx, this.page, TEXT_WIDTH, TEXT_SIZE).forEach((line, i) => {
        if (remaining <= 0) return;
        drawText(ctx, line.slice(0, remaining), TEXT_X, TEXT_Y + i * LINE_HEIGHT, { size: TEXT_SIZE });
        remaining -= line.length + 1;
      });
      ctx.globalAlpha = 1;
    });
  }
}
