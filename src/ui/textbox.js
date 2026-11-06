import { inUiSpace } from '../engine/screen.js';
import { makeSprite } from '../engine/sprite.js';
import { PORTRAITS, expressionRows } from '../data/art/portraits.js';
import { SETTINGS } from '../state/settings.js';
import { layoutDialogue, drawDialogue, paginate } from './text.js';

// In UI pixels (640x480).
const BOX = { x: 32, y: 318, w: 576, h: 146 };
const BOX_TOP_Y = 16;
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
// change the speaker's face for that page; and one can come part way along,
// "{thoughtful}Nine feet. {bored}I've seen your sword.", to change it as the
// words reach it.
const FACE_TAG = /^\{([a-z_]+)\}\s*/;
const LATER_TAG = /\{([a-z_]+)\}\s*/g;
export function splitFace(page) {
  const match = page.match(FACE_TAG);
  const face = match ? match[1] : null;
  const { text } = faceChanges(match ? page.slice(match[0].length) : page);
  return { face, text };
}
// The tags part way along a page, taken out: its words, and where (how many
// characters in) the face changes to what. While a page is being split to
// fit the box, each tag stands as an invisible MARK (no width, stuck to the
// word after it), with its face in `faces`, in order.
const MARK = '\u2063';
function markFaces(page) {
  const faces = [];
  const text = page.replace(LATER_TAG, (all, face) => { faces.push(face); return MARK; });
  return { text, faces };
}
function faceChanges(page, faces = null) {
  if (!faces) ({ text: page, faces } = markFaces(page));
  const changes = [];
  let text = '';
  for (const ch of page) {
    if (ch === MARK) changes.push({ at: text.length, face: faces.shift() });
    else text += ch;
  }
  return { text, changes };
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
    // Messages asked for while one is already showing wait their turn, so two
    // never sit on top of each other.
    this.queue = [];
  }

  get isOpen() {
    return this.pages !== null;
  }

  // `speaker` is an NPC id; their portrait shows if they have one, in the
  // expression `face` (unless a page asks for another). With `shake`, the
  // words tremble, for a scream or a shout.
  open(pages, speaker = null, face = null, options = {}) {
    if (this.pages !== null) {
      this.queue.push([pages, speaker, face, options]);
      return;
    }
    this.start(pages, speaker, face, options);
  }

  start(pages, speaker, face, { shake = false, top = false } = {}) {
    this.speaker = speaker;
    this.shake = shake;
    // `top`: the box sits at the top of the screen instead, for a scene whose
    // people are down where it would cover them.
    this.top = top;
    // A page too long for the box carries on onto the next one, in whatever
    // face the last one left it.
    this.pages = pages.flatMap((page) => {
      const match = page.match(FACE_TAG);
      let current = (match ? match[1] : null) ?? face;
      const { text: words, faces } = markFaces(match ? page.slice(match[0].length) : page);
      const { width } = textArea(speaker ? portraitSprites(speaker, current) : null);
      return paginate(measureCtx(), words, width, TEXT_SIZE, TEXTBOX_LINES).map((part) => {
        const { text, changes } = faceChanges(part, faces);
        const out = { text, face: current, changes };
        if (changes.length) current = changes[changes.length - 1].face;
        return out;
      });
    });
    this.pageIndex = 0;
    this.visibleCharacters = 0;
    this.showPage();
  }

  showPage() {
    const page = this.pages?.[this.pageIndex];
    this.shownFace = page?.face;
    this.portrait = this.speaker && page ? portraitSprites(this.speaker, page.face) : null;
  }

  // The face the words have got to on this page (its later tags).
  followFace() {
    const page = this.pages?.[this.pageIndex];
    if (!this.speaker || !page?.changes?.length) return;
    let face = page.face;
    for (const change of page.changes) if (this.visibleCharacters >= change.at) face = change.face;
    if (face !== this.shownFace) {
      this.shownFace = face;
      this.portrait = portraitSprites(this.speaker, face);
    }
  }

  update(dt, input) {
    const page = this.pages[this.pageIndex].text;
    this.followFace();

    if (input.isDown('skip')) {
      this.visibleCharacters = page.length;
      this.skipTimer += dt;
      if (this.skipTimer >= SKIP_PAGE_SECONDS) this.nextPage();
      return;
    }
    this.skipTimer = 0;

    if (this.visibleCharacters < page.length) {
      this.visibleCharacters = Math.min(page.length, this.visibleCharacters + CHARACTERS_PER_SECOND * SETTINGS.textSpeed * dt);
      if (input.wasPressed('cancel')) this.visibleCharacters = page.length;
      return;
    }

    if (input.wasPressed('confirm')) this.nextPage();
  }

  nextPage() {
    this.pageIndex++;
    this.visibleCharacters = 0;
    this.skipTimer = 0;
    if (this.pageIndex >= this.pages.length) {
      this.pages = null;
      if (this.queue.length) this.start(...this.queue.shift());
    } else this.showPage();
  }

  draw(ctx) {
    if (!this.isOpen) return;

    const y = this.top ? BOX_TOP_Y : BOX.y;
    inUiSpace(ctx, () => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(BOX.x, y, BOX.w, BOX.h);
      ctx.fillStyle = '#000';
      ctx.fillRect(BOX.x + BORDER, y + BORDER, BOX.w - BORDER * 2, BOX.h - BORDER * 2);

      if (this.portrait) {
        const blinking = (performance.now() / 1000) % BLINK_PERIOD < BLINK_SECONDS;
        const face = blinking ? this.portrait.blink : this.portrait.idle;
        const size = face.width * PORTRAIT_SCALE;
        ctx.drawImage(face, BOX.x + PADDING_X - 6, y + (BOX.h - size) / 2, size, size);
      }

      const { x, width } = textArea(this.portrait);
      const lines = layoutDialogue(ctx, this.pages[this.pageIndex].text, width, TEXT_SIZE);
      // Trembling words jump a pixel or two every few frames.
      const jolt = this.shake ? Math.floor(performance.now() / 50) : 0;
      const dx = this.shake ? ((jolt * 7) % 5) - 2 : 0;
      const dy = this.shake ? ((jolt * 3) % 5) - 2 : 0;
      drawDialogue(ctx, lines, x + dx, y + PADDING_Y + dy, {
        size: TEXT_SIZE,
        lineHeight: LINE_HEIGHT,
        visible: Math.floor(this.visibleCharacters),
      });
    });
  }
}
