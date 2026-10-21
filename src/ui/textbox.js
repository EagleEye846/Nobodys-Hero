import { inUiSpace } from '../engine/screen.js';
import { makeSprite } from '../engine/sprite.js';
import { PORTRAITS, expressionRows } from '../data/art/portraits.js';
import { layoutDialogue, drawDialogue, paginate } from './text.js';

// In UI pixels (640x480).
const BOX = { x: 32, y: 318, w: 576, h: 146 };
const BORDER = 4;
const PADDING_X = 26;
const PADDING_Y = 20;
const TEXT_SIZE = 30;
const LINE_HEIGHT = 34;
const CHARACTERS_PER_SECOND = 45;
// Holding C skips: each page shows whole, and turns after this long.
const SKIP_PAGE_SECONDS = 0.06;

// Portraits sit on the left of the box, drawn at 3x, with the text beside them.
const PORTRAIT_SCALE = 3;
const PORTRAIT_GAP = 18;
const BLINK_PERIOD = 3.4;
const BLINK_SECONDS = 0.14;

// A face for `id` in an expression (see `expressions` in portraits.js).
const portraitCache = new Map();
function portraitSprites(id, expression = null) {
  const key = `${id}:${expression ?? ''}`;
  if (!portraitCache.has(key)) {
    const art = PORTRAITS[id];
    const rows = art && expressionRows(art, expression);
    portraitCache.set(key, art && {
      idle: makeSprite(rows.idle, art.palette),
      blink: makeSprite(rows.blink, art.palette),
    });
  }
  return portraitCache.get(key);
}

// A page can start with an expression in braces, "{sad}I miss them.", to
// change the speaker's face for that page.
const FACE_TAG = /^\{([a-z_]+)\}\s*/;
export function splitFace(page) {
  const match = page.match(FACE_TAG);
  return match ? { face: match[1], text: page.slice(match[0].length) } : { face: null, text: page };
}

// Where the words go: beside the portrait, if there is one.
function textArea(portrait) {
  if (!portrait) return { x: BOX.x + PADDING_X, width: BOX.w - PADDING_X * 2 };
  const x = BOX.x + PADDING_X - 6 + portrait.idle.width * PORTRAIT_SCALE + PORTRAIT_GAP;
  return { x, width: BOX.x + BOX.w - PADDING_X - x };
}

// For measuring text outside of drawing.
let measuring = null;
const measureCtx = () => (measuring ??= document.createElement('canvas').getContext('2d'));

// How many lines fit in the box, and how many a page needs (the Studio warns
// about pages that run off the bottom). `speaker` is an NPC id, as in open().
export const TEXTBOX_LINES = 3;
export function pageLineCount(ctx, page, speaker = null) {
  return layoutDialogue(ctx, splitFace(page).text, textArea(speaker ? portraitSprites(speaker) : null).width, TEXT_SIZE).length;
}

// Overworld dialogue box. Text types out a character at a time;
// cancel skips to the end of the page and confirm advances to the next page;
// holding C (skip) flicks through the pages on its own.
// NPCs with an entry in PORTRAITS show their face beside the text, in the
// expression a page asks for ({sad}, {glee}...) or the one given to open().
export class TextBox {
  constructor() {
    this.pages = null;
    this.pageIndex = 0;
    this.visibleCharacters = 0;
    this.skipTimer = 0;
    this.speaker = null;
    this.portrait = null;
  }

  get isOpen() {
    return this.pages !== null;
  }

  // `speaker` is an NPC id; their portrait shows if they have one, in the
  // expression `face` (unless a page asks for another). With `shake`, the
  // words tremble, for a scream or a shout.
  open(pages, speaker = null, face = null, { shake = false } = {}) {
    this.speaker = speaker;
    this.shake = shake;
    // A page too long for the box carries on onto the next one.
    this.pages = pages.flatMap((page) => {
      const split = splitFace(page);
      const pageFace = split.face ?? face;
      const { width } = textArea(speaker ? portraitSprites(speaker, pageFace) : null);
      return paginate(measureCtx(), split.text, width, TEXT_SIZE, TEXTBOX_LINES).map((text) => ({ text, face: pageFace }));
    });
    this.pageIndex = 0;
    this.visibleCharacters = 0;
    this.showPage();
  }

  showPage() {
    const page = this.pages?.[this.pageIndex];
    this.portrait = this.speaker && page ? portraitSprites(this.speaker, page.face) : null;
  }

  update(dt, input) {
    const page = this.pages[this.pageIndex].text;

    if (input.isDown('skip')) {
      this.visibleCharacters = page.length;
      this.skipTimer += dt;
      if (this.skipTimer >= SKIP_PAGE_SECONDS) this.nextPage();
      return;
    }
    this.skipTimer = 0;

    if (this.visibleCharacters < page.length) {
      this.visibleCharacters = Math.min(page.length, this.visibleCharacters + CHARACTERS_PER_SECOND * dt);
      if (input.wasPressed('cancel')) this.visibleCharacters = page.length;
      return;
    }

    if (input.wasPressed('confirm')) this.nextPage();
  }

  nextPage() {
    this.pageIndex++;
    this.visibleCharacters = 0;
    this.skipTimer = 0;
    if (this.pageIndex >= this.pages.length) this.pages = null;
    else this.showPage();
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
      const lines = layoutDialogue(ctx, this.pages[this.pageIndex].text, width, TEXT_SIZE);
      // Trembling words jump a pixel or two every few frames.
      const jolt = this.shake ? Math.floor(performance.now() / 50) : 0;
      const dx = this.shake ? ((jolt * 7) % 5) - 2 : 0;
      const dy = this.shake ? ((jolt * 3) % 5) - 2 : 0;
      drawDialogue(ctx, lines, x + dx, BOX.y + PADDING_Y + dy, {
        size: TEXT_SIZE,
        lineHeight: LINE_HEIGHT,
        visible: Math.floor(this.visibleCharacters),
      });
    });
  }
}
