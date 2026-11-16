import { inUiSpace } from '../engine/screen.js';
import { SETTINGS } from '../state/settings.js';
import { drawText } from './text.js';
import { bob, STILL } from './uiMotion.js';
import { sfx } from '../audio/music.js';
import { voiceFor, speak } from '../audio/voices.js';
import { splitFace, portraitSprites } from './textbox.js';

// A small CHOICE box, in the text box's style: a question line (typed out, in the
// speaker's voice and face), then two to four options under it. Up and down move
// the cursor, Z picks, X picks the cancel option (the one marked `cancel: true`,
// or the last one) if there is one to pick. The cursor can't pick until the
// question has been read, so a Z pressed to finish the last box never picks.
//
//   const box = new ChoiceBox();
//   box.open('Where to?', [{ text: 'Row on to the reef' }, { text: 'Not yet', cancel: true }], 'haddock');
//   // each frame, while box.isOpen: box.update(dt, input) ... it returns the picked
//   // index once, then isOpen is false. box.draw(ctx) draws it.
// In a cutscene: { do: 'choose', who, question, options: [{ text, then: [steps] }, ...] }.

const BOX_X = 32;
const BOX_W = 576;
const BOX_BOTTOM = 464;
const BORDER = 4;
const PADDING_X = 26;
const PADDING_Y = 18;
const TEXT_SIZE = 30;
const LINE_HEIGHT = 34;
const OPTION_HEIGHT = 32;
const CHARACTERS_PER_SECOND = 45;
const PORTRAIT_SCALE = 3;
const PORTRAIT_GAP = 18;
const GOLD = '#ffe14d';

export class ChoiceBox {
  constructor() {
    this.isOpen = false;
    this.options = [];
    this.cursor = 0;
  }

  // `speaker` is a portrait id (and the voice), or null.
  open(question, options, speaker = null) {
    if (options.length < 2 || options.length > 4) throw new Error(`A choice box takes 2 to 4 options, not ${options.length}`);
    const { face, text } = splitFace(String(question ?? ''));
    this.question = text;
    this.options = options;
    this.speaker = speaker;
    this.voice = speaker ? voiceFor(speaker) : null;
    this.portrait = speaker ? portraitSprites(speaker, face) : null;
    this.visible = 0;
    this.spoken = { letters: 0 };
    this.cursor = 0;
    this.openedAt = performance.now();
    this.isOpen = true;
    this.armed = false;
  }

  get typed() {
    return this.visible >= this.question.length;
  }

  // The index of the cancel option (X), or -1.
  get cancelIndex() {
    const marked = this.options.findIndex((o) => o.cancel);
    return marked >= 0 ? marked : this.options.length - 1;
  }

  // Returns the picked index on the frame it is picked, else -1.
  update(dt, input) {
    if (!this.isOpen) return -1;
    if (!this.typed) {
      if (input.wasPressed('cancel') || input.wasPressed('confirm')) {
        this.visible = this.question.length;
        return -1;
      }
      const from = Math.floor(this.visible);
      this.visible = Math.min(this.question.length, this.visible + CHARACTERS_PER_SECOND * SETTINGS.textSpeed * dt);
      if (this.voice) speak(this.voice, this.question, from, Math.floor(this.visible), this.spoken);
      return -1;
    }
    // Keys held through from the text before don't count: wait for a fresh press.
    const count = this.options.length;
    const before = this.cursor;
    if (input.wasPressed('down')) this.cursor = (this.cursor + 1) % count;
    if (input.wasPressed('up')) this.cursor = (this.cursor - 1 + count) % count;
    if (this.cursor !== before) sfx('move');
    if (input.wasPressed('confirm')) return this.pick(this.cursor);
    if (input.wasPressed('cancel')) return this.pick(this.cancelIndex);
    return -1;
  }

  pick(index) {
    sfx(this.options[index].cancel || index === this.cancelIndex ? 'back' : 'select');
    this.isOpen = false;
    return index;
  }

  draw(ctx) {
    if (!this.isOpen) return;
    const h = PADDING_Y * 2 + LINE_HEIGHT + 8 + this.options.length * OPTION_HEIGHT;
    const y = BOX_BOTTOM - h;
    inUiSpace(ctx, () => {
      const open = STILL ? 1 : Math.min(1, (performance.now() - this.openedAt) / 90);
      if (open < 1) {
        ctx.globalAlpha = 0.4 + 0.6 * open;
      }
      ctx.fillStyle = '#fff';
      ctx.fillRect(BOX_X, y, BOX_W, h);
      ctx.fillStyle = '#000';
      ctx.fillRect(BOX_X + BORDER, y + BORDER, BOX_W - BORDER * 2, h - BORDER * 2);
      let x = BOX_X + PADDING_X;
      if (this.portrait) {
        const face = this.portrait.idle;
        const size = face.width * PORTRAIT_SCALE;
        ctx.drawImage(face, BOX_X + PADDING_X - 6, y + (h - size) / 2, size, size);
        x = BOX_X + PADDING_X - 6 + size + PORTRAIT_GAP;
      }
      drawText(ctx, `* ${this.question.slice(0, Math.floor(this.visible))}`, x, y + PADDING_Y, { size: TEXT_SIZE, color: '#fff' });
      if (this.typed) {
        this.options.forEach((option, i) => {
          const oy = y + PADDING_Y + LINE_HEIGHT + 8 + i * OPTION_HEIGHT;
          const on = i === this.cursor;
          if (on) {
            const cx = x + 4 + (STILL ? 0 : Math.round(bob(2, 500)));
            ctx.fillStyle = GOLD;
            ctx.beginPath();
            ctx.moveTo(cx, oy + 6);
            ctx.lineTo(cx, oy + 22);
            ctx.lineTo(cx + 12, oy + 14);
            ctx.fill();
          }
          drawText(ctx, option.text, x + 28, oy, { size: TEXT_SIZE - 2, color: on ? GOLD : '#fff' });
        });
      }
    });
  }
}
