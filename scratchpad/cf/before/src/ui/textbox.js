import { inUiSpace } from '../engine/screen.js';
import { makeSprite } from '../engine/sprite.js';
import { PORTRAITS, expressionRows } from '../data/art/portraits.js';
import { SETTINGS } from '../state/settings.js';
import { layoutDialogue, drawDialogue, paginate, drawText, textWidth, stripStyle, markStyles, applyStyle, STYLE_MARK } from './text.js';
import { lastSavedAt } from '../state/saveGame.js';
import { bob, arrow, STILL } from './uiMotion.js';
import { sfx } from '../audio/music.js';
import { voiceFor, speak } from '../audio/voices.js';
import { lineClips, textClips, sayClips, stopVoice } from '../audio/voiceClips.js';

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
// The words stop for a breath after a full stop (or ! or ?) and for a
// moment after a comma, when a space follows: seconds, at the usual speed
// (a faster TEXT SPEED shortens them). X still shows the page whole at once.
const STOP_PAUSE = 0.16;
const COMMA_PAUSE = 0.07;
const PAUSES = { '.': STOP_PAUSE, '!': STOP_PAUSE, '?': STOP_PAUSE, ',': COMMA_PAUSE, ';': COMMA_PAUSE, ':': COMMA_PAUSE };
// The box eases open over this long (it never holds up the words or a key).
const OPEN_MS = 90;
// After a save point, a "SAVED" badge sits on the box for this long.
const SAVED_MS = 1800;

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
  const { text } = faceChanges(stripStyle(match ? page.slice(match[0].length) : page));
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
// Coloured and shaking words ({c:gold}...{/c}, {fx:shake}...{/fx}: see
// text.js) stand as STYLE_MARKs the same way, with what each does in
// `styles`; `look` is how the words look as the page starts (carried on from
// the page before), and comes back as `runs`: [{ at, color, shake }].
function faceChanges(page, faces = null, styles = null, look = null) {
  if (!faces) ({ text: page, faces } = markFaces(page));
  const changes = [];
  const runs = [];
  const now = { color: null, shake: false, ...look };
  if (now.color || now.shake) runs.push({ at: 0, ...now });
  let text = '';
  for (const ch of page) {
    if (ch === MARK) changes.push({ at: text.length, face: faces.shift() });
    else if (ch === STYLE_MARK) {
      const style = styles?.shift();
      if (!style) continue;
      applyStyle(now, style);
      const last = runs[runs.length - 1];
      if (last?.at === text.length) runs.pop();
      runs.push({ at: text.length, color: now.color, shake: now.shake });
    } else text += ch;
  }
  if (look) Object.assign(look, now);
  return { text, changes, runs };
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
    this.openedAt = performance.now();
    // Words that open right as the game saves (a save point) get the badge.
    this.savedBadge = this.openedAt - lastSavedAt() < 150;
    this.start(pages, speaker, face, options);
  }

  start(pages, speaker, face, { shake = false, top = false, voice = null, line = null } = {}) {
    sfx('textOpen');
    this.speaker = speaker;
    // Their talking voice as the words type out (src/audio/voices.js): from
    // who's speaking, or `voice` (an id to sound like) for someone with no
    // portrait. No speaker, no voice.
    this.voice = voiceFor(voice ?? speaker);
    this.shake = shake;
    // `top`: the box sits at the top of the screen instead, for a scene whose
    // people are down where it would cover them.
    this.top = top;
    // A recorded line plays as its page opens (src/audio/voiceClips.js):
    // `line` is a cutscene line's id, or the words are a voiced entry of a
    // text file.
    const clips = line ? lineClips(line, pages.length) : pages.map(textClips);
    // A page too long for the box carries on onto the next one, in whatever
    // face the last one left it.
    this.pages = pages.flatMap((page, n) => {
      const match = page.match(FACE_TAG);
      let current = (match ? match[1] : null) ?? face;
      const { text: styled, styles } = markStyles(match ? page.slice(match[0].length) : page);
      const { text: words, faces } = markFaces(styled);
      const look = { color: null, shake: false };
      const { width } = textArea(speaker ? portraitSprites(speaker, current) : null);
      return paginate(measureCtx(), words, width, TEXT_SIZE, TEXTBOX_LINES).map((part, i) => {
        const { text, changes, runs } = faceChanges(part, faces, styles, look);
        const out = { text, face: current, changes, runs, clips: i === 0 ? clips[n] : null };
        if (changes.length) current = changes[changes.length - 1].face;
        return out;
      });
    });
    this.pageIndex = 0;
    this.visibleCharacters = 0;
    this.pause = 0;
    this.showPage();
  }

  showPage() {
    const page = this.pages?.[this.pageIndex];
    this.spoken = { letters: 0 };
    this.shownFace = page?.face;
    this.portrait = this.speaker && page ? portraitSprites(this.speaker, page.face) : null;
    // Its recording, cutting off the last page's; while it plays the page
    // doesn't blip. (Not while C flicks through.)
    this.voiced = this.rushing ? (stopVoice(), false) : sayClips(page?.clips);
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
      this.rushing = true;
      if (this.skipTimer >= SKIP_PAGE_SECONDS) this.nextPage();
      return;
    }
    this.skipTimer = 0;
    this.rushing = false;

    if (this.visibleCharacters < page.length) {
      if (input.wasPressed('cancel')) {
        this.visibleCharacters = page.length;
        this.pause = 0;
        return;
      }
      if (this.pause > 0) {
        this.pause -= dt;
        return;
      }
      const from = Math.floor(this.visibleCharacters);
      this.visibleCharacters = Math.min(page.length, this.visibleCharacters + CHARACTERS_PER_SECOND * SETTINGS.textSpeed * dt);
      // Stop just after a full stop or comma that's been reached, for a breath.
      for (let i = from; i < Math.floor(this.visibleCharacters); i++) {
        const rest = PAUSES[page[i]];
        if (rest && /\s/.test(page[i + 1] ?? '') && !PAUSES[page[i + 1]]) {
          this.visibleCharacters = i + 1;
          this.pause = rest / Math.max(0.5, SETTINGS.textSpeed);
          break;
        }
      }
      if (!this.voiced) speak(this.voice, page, from, Math.floor(this.visibleCharacters), this.spoken);
      return;
    }

    if (input.wasPressed('confirm')) this.nextPage();
  }

  nextPage() {
    this.pageIndex++;
    this.visibleCharacters = 0;
    this.skipTimer = 0;
    this.pause = 0;
    if (this.pageIndex >= this.pages.length) {
      this.pages = null;
      stopVoice();
      if (this.queue.length) this.start(...this.queue.shift());
    } else {
      sfx('page');
      this.showPage();
    }
  }

  draw(ctx) {
    if (!this.isOpen) return;

    const y = this.top ? BOX_TOP_Y : BOX.y;
    inUiSpace(ctx, () => {
      // Easing open: a touch small and faint for its first few frames.
      const open = STILL ? 1 : Math.min(1, (performance.now() - (this.openedAt ?? -Infinity)) / OPEN_MS);
      if (open < 1) {
        const k = 1 - (1 - open) * (1 - open);
        const cx = BOX.x + BOX.w / 2;
        const cy = y + BOX.h / 2;
        ctx.translate(cx, cy);
        ctx.scale(1, 0.85 + 0.15 * k);
        ctx.translate(-cx, -cy);
        ctx.globalAlpha = 0.4 + 0.6 * k;
      }
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
        runs: this.pages[this.pageIndex].runs,
        page: this.pages[this.pageIndex].text,
      });
      // The page is all out: a small arrow bobs in the corner, waiting for Z.
      if (this.visibleCharacters >= this.pages[this.pageIndex].text.length) {
        arrow(ctx, BOX.x + BOX.w - 20, y + BOX.h - 12 + bob(3, 600), '#ffffff', 5);
      }
      if (this.savedBadge) this.drawSavedBadge(ctx, y);
    });
  }

  // "SAVED", in a small gold tab on the box's top edge (its bottom edge when
  // the box is at the top of the screen), with a few twinkles. It fades away.
  drawSavedBadge(ctx, boxY) {
    const age = performance.now() - this.openedAt;
    if (age > SAVED_MS) return;
    const fade = Math.min(1, (SAVED_MS - age) / 400) * Math.min(1, age / 120);
    const size = 20;
    const w = textWidth(ctx, 'SAVED', size) + 34;
    const h = 26;
    const x = BOX.x + BOX.w - w - 16;
    const y = this.top ? boxY + BOX.h - 2 : boxY - h + 2;
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y, w, h);
    drawText(ctx, 'SAVED', x + 24, y + 3, { size, color: '#ffe14d' });
    // Twinkles: small four-point stars that grow and shrink in turn.
    const stars = [[x + 12, y + 13], [x + w + 8, y + 2], [x - 10, y + h], [x + w - 6, y + h + 8]];
    stars.forEach(([sx, sy], i) => {
      const r = Math.max(0, Math.sin(age / 160 + i * 1.7)) * (i === 0 ? 5 : 4);
      if (r < 0.5) return;
      ctx.fillStyle = i === 0 ? '#ffe14d' : '#fff6c0';
      ctx.fillRect(Math.round(sx - r), Math.round(sy), Math.round(r * 2), 1);
      ctx.fillRect(Math.round(sx), Math.round(sy - r), 1, Math.round(r * 2));
      ctx.fillRect(Math.round(sx - 1), Math.round(sy - 1), 3, 3);
    });
    ctx.restore();
  }
}
