import { inUiSpace } from '../engine/screen.js';
import { makeSprite } from '../engine/sprite.js';
import { PORTRAITS } from '../data/art/portraits.js';
import { layoutDialogue, drawDialogue } from './text.js';

// In UI pixels (640x480).
const BOX = { x: 32, y: 318, w: 576, h: 146 };
const BORDER = 4;
const PADDING_X = 26;
const PADDING_Y = 20;
const TEXT_SIZE = 30;
const LINE_HEIGHT = 34;
const CHARACTERS_PER_SECOND = 45;

// Portraits sit on the left of the box, drawn at 3x, with the text beside them.
const PORTRAIT_SCALE = 3;
const PORTRAIT_GAP = 18;
const BLINK_PERIOD = 3.4;
const BLINK_SECONDS = 0.14;

const portraitCache = new Map();
function portraitSprites(id) {
  if (!portraitCache.has(id)) {
    const art = PORTRAITS[id];
    portraitCache.set(id, art && {
      idle: makeSprite(art.idle, art.palette),
      blink: makeSprite(art.blink, art.palette),
    });
  }
  return portraitCache.get(id);
}

// Where the words go: beside the portrait, if there is one.
function textArea(portrait) {
  if (!portrait) return { x: BOX.x + PADDING_X, width: BOX.w - PADDING_X * 2 };
  const x = BOX.x + PADDING_X - 6 + portrait.idle.width * PORTRAIT_SCALE + PORTRAIT_GAP;
  return { x, width: BOX.x + BOX.w - PADDING_X - x };
}

// How many lines fit in the box, and how many a page needs (the Studio warns
// about pages that run off the bottom). `speaker` is an NPC id, as in open().
export const TEXTBOX_LINES = 3;
export function pageLineCount(ctx, page, speaker = null) {
  return layoutDialogue(ctx, page, textArea(speaker ? portraitSprites(speaker) : null).width, TEXT_SIZE).length;
}

// Overworld dialogue box. Text types out a character at a time;
// cancel skips to the end of the page and confirm advances to the next page.
// NPCs with an entry in PORTRAITS show their face beside the text, Undertale style.
export class TextBox {
  constructor() {
    this.pages = null;
    this.pageIndex = 0;
    this.visibleCharacters = 0;
    this.portrait = null;
  }

  get isOpen() {
    return this.pages !== null;
  }

  // `speaker` is an NPC id; their portrait shows if they have one.
  open(pages, speaker = null) {
    this.pages = pages;
    this.pageIndex = 0;
    this.visibleCharacters = 0;
    this.portrait = speaker ? portraitSprites(speaker) : null;
  }

  update(dt, input) {
    const page = this.pages[this.pageIndex];

    if (this.visibleCharacters < page.length) {
      this.visibleCharacters = Math.min(page.length, this.visibleCharacters + CHARACTERS_PER_SECOND * dt);
      if (input.wasPressed('cancel')) this.visibleCharacters = page.length;
      return;
    }

    if (input.wasPressed('confirm')) {
      this.pageIndex++;
      this.visibleCharacters = 0;
      if (this.pageIndex >= this.pages.length) this.pages = null;
    }
  }

  draw(ctx) {
    if (!this.isOpen) return;

    inUiSpace(ctx, () => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(BOX.x, BOX.y, BOX.w, BOX.h);
      ctx.fillStyle = '#000';
      ctx.fillRect(BOX.x + BORDER, BOX.y + BORDER, BOX.w - BORDER * 2, BOX.h - BORDER * 2);

      if (this.portrait) {
        const blinking = (performance.now() / 1000) % BLINK_PERIOD < BLINK_SECONDS;
        const face = blinking ? this.portrait.blink : this.portrait.idle;
        const size = face.width * PORTRAIT_SCALE;
        ctx.drawImage(face, BOX.x + PADDING_X - 6, BOX.y + (BOX.h - size) / 2, size, size);
      }

      const { x, width } = textArea(this.portrait);
      const lines = layoutDialogue(ctx, this.pages[this.pageIndex], width, TEXT_SIZE);
      drawDialogue(ctx, lines, x, BOX.y + PADDING_Y, {
        size: TEXT_SIZE,
        lineHeight: LINE_HEIGHT,
        visible: Math.floor(this.visibleCharacters),
      });
    });
  }
}
