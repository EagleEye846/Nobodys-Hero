import { inUiSpace } from '../engine/screen.js';
import { sfx } from '../audio/music.js';
import { textSection } from '../engine/textLoader.js';
import { makeSprite } from '../engine/sprite.js';
import { ENEMIES } from '../data/enemies/index.js';
import { AREA_NAMES } from '../data/areas.js';
import { ITEMS } from '../data/items.js';
import { JOURNAL_PAGES, isMet, journalEntry } from '../data/journal.js';
import { drawMenuFrame, drawWeaponList, drawControls, MENU, FOOTER_Y, MENU_COLORS } from './menuFrame.js';
import { drawText, textWidth, wrapLines } from './text.js';

// The JOURNAL page of the C menu: every monster in the order you meet them,
// "???" until you have. Up and down picks one; its picture, area, HP, loot and
// how many you've beaten or spared are on the right, and a line or two about
// it (text/journal.txt) underneath.

const TEXT = 'journal.txt';
const DETAILS = { x: MENU.x + 320, y: MENU.y + 78, w: 216 };
const PICTURE = { w: 216, h: 88 };
const ANIM_FPS = 6;
const spriteCache = new Map();

// The picture of a monster, in the palette it fights in: its idle clip if it
// has one, or the plain sprite. `black` makes the shape and nothing else.
function picture(id, black) {
  const key = `${id}|${black}`;
  if (!spriteCache.has(key)) {
    const data = ENEMIES[id];
    const palette = black ? Object.fromEntries(Object.keys(data.sprite.palette).map((k) => [k, '#1c1830'])) : data.sprite.palette;
    const frames = data.anim?.idle?.frames ?? [data.sprite.rows];
    spriteCache.set(key, { frames: frames.map((rows) => makeSprite(rows, palette)), fps: data.anim?.idle?.fps ?? ANIM_FPS, holds: data.anim?.idle?.holds ?? null });
  }
  return spriteCache.get(key);
}

function frameAt(clip, t) {
  if (clip.frames.length === 1) return clip.frames[0];
  if (!clip.holds) return clip.frames[Math.floor(t * clip.fps) % clip.frames.length];
  const total = clip.holds.reduce((sum, h) => sum + h, 0);
  let left = (t * clip.fps) % total;
  for (let i = 0; i < clip.frames.length; i++) {
    left -= clip.holds[i] ?? 1;
    if (left < 0) return clip.frames[i];
  }
  return clip.frames[clip.frames.length - 1];
}

export class JournalMenu {
  constructor() {
    this.isOpen = false;
    this.cursor = 0;
    this.time = 0;
  }

  open() {
    this.isOpen = true;
    this.cursor = 0;
  }

  update(input) {
    this.time += 1 / 60;
    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      sfx('back');
      this.isOpen = false;
      return;
    }
    const last = JOURNAL_PAGES.length - 1;
    const before = this.cursor;
    if (input.wasPressed('down')) this.cursor = this.cursor === last ? 0 : this.cursor + 1;
    if (input.wasPressed('up')) this.cursor = this.cursor === 0 ? last : this.cursor - 1;
    if (input.wasPressed('right')) this.cursor = Math.min(last, this.cursor + 8);
    if (input.wasPressed('left')) this.cursor = Math.max(0, this.cursor - 8);
    if (this.cursor !== before) sfx('move');
  }

  draw(ctx) {
    if (!this.isOpen) return;
    const met = JOURNAL_PAGES.filter((page) => isMet(page.id)).length;
    inUiSpace(ctx, () => {
      drawMenuFrame(ctx, 'JOURNAL', `${met} / ${JOURNAL_PAGES.length} met`);
      const ids = JOURNAL_PAGES.map((_, i) => i);
      drawWeaponList(ctx, ids, this.cursor, {
        name: (i) => (isMet(JOURNAL_PAGES[i].id) ? ENEMIES[JOURNAL_PAGES[i].id].name : '???'),
        nameColor: (i) => (isMet(JOURNAL_PAGES[i].id) ? MENU_COLORS.text : MENU_COLORS.dim),
        tag: (i) => (isMet(JOURNAL_PAGES[i].id) && ENEMIES[JOURNAL_PAGES[i].id].boss ? { text: 'BOSS', color: MENU_COLORS.highlight } : null),
      });
      this.drawPage(ctx, JOURNAL_PAGES[this.cursor]);
      drawControls(ctx, 'Up/Down: pick     X: close');
    });
  }

  drawPage(ctx, { id, area }) {
    const data = ENEMIES[id];
    const known = isMet(id);
    const record = journalEntry(id) ?? { beaten: 0, spared: 0, loot: false };
    const clip = picture(id, !known);

    // The picture, as big as fits (whole-number scale, so the pixels stay crisp).
    const first = clip.frames[0];
    const scale = Math.max(1, Math.min(4, Math.floor(PICTURE.w / first.width), Math.floor(PICTURE.h / first.height)));
    const w = first.width * scale;
    const h = first.height * scale;
    const frame = known ? frameAt(clip, this.time) : first;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(frame, Math.round(DETAILS.x + (PICTURE.w - w) / 2), DETAILS.y + PICTURE.h - h, w, h);
    ctx.restore();

    let y = DETAILS.y + PICTURE.h + 10;
    if (!known) {
      drawText(ctx, '???', DETAILS.x, y, { size: 30, color: MENU_COLORS.dim });
      drawText(ctx, 'Not met yet.', DETAILS.x, y + 36, { size: 22, color: MENU_COLORS.dim });
      return;
    }

    // A long name shrinks to fit the panel.
    const size = Math.min(30, Math.floor((30 * DETAILS.w) / textWidth(ctx, data.name, 30)));
    drawText(ctx, data.name, DETAILS.x, y + (30 - size), { size });
    y += 32;
    drawText(ctx, AREA_NAMES[area] ?? '', DETAILS.x, y, { size: 20, color: MENU_COLORS.dim });
    y += 26;
    drawText(ctx, `HP ${data.maxHp}`, DETAILS.x, y, { size: 22, color: MENU_COLORS.fight });
    y += 24;
    const drop = data.drops?.[0]?.item;
    if (drop) {
      drawText(ctx, 'Loot', DETAILS.x, y, { size: 22, color: MENU_COLORS.dim });
      const seen = record.loot;
      drawText(ctx, seen ? ITEMS[drop].name : '???', DETAILS.x + DETAILS.w, y, { size: 22, color: seen ? MENU_COLORS.heal : MENU_COLORS.dim, align: 'right' });
    } else {
      drawText(ctx, 'Leaves nothing behind', DETAILS.x, y, { size: 22, color: MENU_COLORS.dim });
    }
    y += 24;
    drawText(ctx, `Beaten ${record.beaten}`, DETAILS.x, y, { size: 22, color: MENU_COLORS.text });
    drawText(ctx, `Spared ${record.spared}`, DETAILS.x + DETAILS.w, y, { size: 22, color: MENU_COLORS.ability, align: 'right' });

    // A line or two about it, in the footer.
    const text = textSection(TEXT, id)[0].replace(/\n/g, ' ');
    let fontSize = 20;
    let lines = wrapLines(ctx, text, MENU.w - 48, fontSize);
    while (fontSize > 15 && lines.length > 2) lines = wrapLines(ctx, text, MENU.w - 48, --fontSize);
    drawText(ctx, lines.join('\n'), MENU.x + 24, FOOTER_Y + 4, { size: fontSize, lineHeight: fontSize + 2, color: MENU_COLORS.description });
  }
}
