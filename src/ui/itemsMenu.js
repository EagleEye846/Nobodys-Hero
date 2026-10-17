import { inUiSpace } from '../engine/screen.js';
import { sfx } from '../audio/music.js';
import { HERO_STATE } from '../characters/heroState.js';
import { ITEMS, MAX_ITEMS } from '../data/items.js';
import { drawMenuFrame, drawWeaponList, drawItemDetails, drawControls, MENU, MENU_COLORS } from './menuFrame.js';
import { drawText } from './text.js';

// The ITEMS menu, opened with C in the overworld: what's in your bag. Items
// are eaten in battle (ITEMS on your turn); here you can read about them, or
// throw one away with Z to make room.
export class ItemsMenu {
  constructor() {
    this.isOpen = false;
    this.cursor = 0;
    this.confirming = false;
  }

  open() {
    this.isOpen = true;
    this.cursor = 0;
    this.confirming = false;
  }

  update(input) {
    const items = HERO_STATE.items;
    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      sfx('back');
      if (this.confirming) this.confirming = false;
      else this.isOpen = false;
      return;
    }
    if (!items.length) return;
    if (this.confirming) {
      if (input.wasPressed('confirm')) {
        sfx('back');
        items.splice(this.cursor, 1);
        this.cursor = Math.min(this.cursor, Math.max(0, items.length - 1));
        this.confirming = false;
      }
      return;
    }
    const before = this.cursor;
    if (input.wasPressed('down')) this.cursor = (this.cursor + 1) % items.length;
    if (input.wasPressed('up')) this.cursor = (this.cursor - 1 + items.length) % items.length;
    if (this.cursor !== before) sfx('move');
    if (input.wasPressed('confirm')) {
      sfx('select');
      this.confirming = true;
    }
  }

  draw(ctx) {
    if (!this.isOpen) return;
    const items = HERO_STATE.items;
    inUiSpace(ctx, () => {
      drawMenuFrame(ctx, 'ITEMS', `${items.length}/${MAX_ITEMS}`);
      if (!items.length) {
        drawText(ctx, 'Your bag is empty.', MENU.x + 50, MENU.y + 90, { size: 28, color: MENU_COLORS.dim });
        drawControls(ctx, 'X: close');
        return;
      }
      drawWeaponList(ctx, items, this.cursor, {
        name: (id) => ITEMS[id].name,
        nameColor: () => MENU_COLORS.text,
        tag: () => null,
      });
      drawItemDetails(ctx, items[this.cursor]);
      drawControls(ctx, this.confirming
        ? `Throw away the ${ITEMS[items[this.cursor]].name}?   Z: yes   X: no`
        : 'Eat items in battle (ITEMS)     Z: throw away     X: close');
    });
  }
}
