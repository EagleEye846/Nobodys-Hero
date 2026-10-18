import { inUiSpace } from '../engine/screen.js';
import { textSection } from '../engine/textLoader.js';
import { sfx } from '../audio/music.js';
import { foundDrafts } from '../data/travel.js';
import { drawMenuFrame, drawWeaponList, drawControls, drawOwnerTag, MENU, MENU_COLORS } from './menuFrame.js';
import { drawText, wrapLines } from './text.js';

const TEXT = 'interactions/travel.txt';
const DETAILS = { x: MENU.x + 320, y: MENU.y + 78, w: 216 };
const GREEN = '#5fc27a';
// The first entry: don't go anywhere.
const STAY = { id: 'stay', name: 'Stay here' };

// TRAVEL, offered after you save, at any save point (src/data/travel.js):
// STAY HERE first (where the cursor starts), then every updraft you've found
// in this chapter, in route order, the one in this room dimmed. Pick another
// and Ves rides the wind there with you; X stays too.
export class TravelMenu {
  constructor() {
    this.isOpen = false;
    this.cursor = 0;
    this.here = null;
    this.onPick = null;
  }

  // `here` is the id of the updraft in this room (or null); `onPick(draft)` is
  // called with the one you choose.
  open(here, onPick) {
    this.drafts = [STAY, ...foundDrafts()];
    this.here = here;
    this.onPick = onPick;
    this.cursor = 0;
    this.isOpen = true;
  }

  update(input) {
    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      sfx('back');
      this.isOpen = false;
      return;
    }
    const count = this.drafts.length;
    const before = this.cursor;
    if (input.wasPressed('down')) this.cursor = (this.cursor + 1) % count;
    if (input.wasPressed('up')) this.cursor = (this.cursor - 1 + count) % count;
    if (this.cursor !== before) sfx('move');
    if (input.wasPressed('confirm')) {
      const draft = this.drafts[this.cursor];
      if (draft === STAY) {
        sfx('back');
        this.isOpen = false;
        return;
      }
      if (draft.id === this.here) {
        sfx('error');
        return;
      }
      sfx('select');
      this.isOpen = false;
      this.onPick?.(draft);
    }
  }

  draw(ctx) {
    if (!this.isOpen) return;
    inUiSpace(ctx, () => {
      drawMenuFrame(ctx, 'TRAVEL', '', { accent: GREEN });
      // Who's carrying you.
      drawOwnerTag(ctx, 'vesper', MENU.x + MENU.w - 24 - 80, MENU.y + 22, { size: 20 });
      const here = (draft) => draft.id === this.here;
      drawWeaponList(ctx, this.drafts, this.cursor, {
        name: (draft) => draft.name,
        nameColor: (draft) => (here(draft) ? MENU_COLORS.dim : MENU_COLORS.text),
        tag: () => null,
      });
      const draft = this.drafts[this.cursor];
      let y = DETAILS.y;
      const nameLines = wrapLines(ctx, draft.name, DETAILS.w, 30);
      drawText(ctx, nameLines.join('\n'), DETAILS.x, y, { size: 30, lineHeight: 30, color: GREEN });
      y += nameLines.length * 30 + 10;
      const blurb = wrapLines(ctx, textSection(TEXT, draft === STAY ? 'stay' : draft.id)[0] ?? '', DETAILS.w, 22);
      drawText(ctx, blurb.join('\n'), DETAILS.x, y, { size: 22, lineHeight: 22, color: MENU_COLORS.description });
      if (here(draft)) drawText(ctx, "You're here.", DETAILS.x, y + blurb.length * 22 + 12, { size: 22, color: GREEN });
      drawControls(ctx, draft === STAY ? 'Z: stay     X: stay' : here(draft) ? "You're here.     X: stay" : 'Z: ride the wind there     X: stay');
    });
  }
}
