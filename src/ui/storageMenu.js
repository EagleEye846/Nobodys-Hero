import { inUiSpace } from '../engine/screen.js';
import { sfx } from '../audio/music.js';
import { HERO_STATE } from '../characters/heroState.js';
import { ITEMS, MAX_ITEMS, MAX_STORAGE, healLabel } from '../data/items.js';
import { drawMenuFrame, drawWeaponList, drawControls, MENU, MENU_COLORS, FOOTER_Y } from './menuFrame.js';
import { drawText } from './text.js';

// STORAGE, opened at a storage chest (one stands by every save point; see
// placeStorage in room.js). Every storage chest holds the same things:
// whatever didn't fit in your bag ends up here. Your bag on the left, storage
// on the right; Z moves the item under the soul across to the other side.
const COLUMNS = [
  { title: 'BAG', list: () => HERO_STATE.items, max: MAX_ITEMS, area: { x: MENU.x + 24, y: MENU.y + 110, width: 236, rowHeight: 30, rows: 7 } },
  { title: 'STORAGE', list: () => (HERO_STATE.storage ??= []), max: MAX_STORAGE, area: { x: MENU.x + 316, y: MENU.y + 110, width: 220, rowHeight: 30, rows: 7 } },
];

export class StorageMenu {
  constructor() {
    this.isOpen = false;
    this.column = 0;
    this.cursors = [0, 0];
    this.message = '';
  }

  open() {
    this.isOpen = true;
    // Start on whichever side has something in it.
    this.column = COLUMNS[0].list().length ? 0 : 1;
    this.cursors = [0, 0];
    this.message = '';
  }

  update(input) {
    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      sfx('back');
      this.isOpen = false;
      return;
    }
    if (input.wasPressed('left') || input.wasPressed('right')) {
      this.column = input.wasPressed('left') ? 0 : 1;
      this.message = '';
      sfx('move');
    }
    const from = COLUMNS[this.column].list();
    const to = COLUMNS[1 - this.column];
    if (!from.length) return;
    const cursor = Math.min(this.cursors[this.column], from.length - 1);
    let next = cursor;
    if (input.wasPressed('down')) next = (cursor + 1) % from.length;
    if (input.wasPressed('up')) next = (cursor - 1 + from.length) % from.length;
    if (next !== cursor) {
      sfx('move');
      this.message = '';
    }
    this.cursors[this.column] = next;
    if (!input.wasPressed('confirm')) return;
    if (to.list().length >= to.max) {
      sfx('error');
      this.message = this.column === 0 ? 'Storage is full.' : 'Your bag is full.';
      return;
    }
    const [id] = from.splice(next, 1);
    to.list().push(id);
    sfx('select');
    this.message = this.column === 0 ? `Put the ${ITEMS[id].name} in storage.` : `Took the ${ITEMS[id].name}.`;
    this.cursors[this.column] = Math.min(next, Math.max(0, from.length - 1));
  }

  draw(ctx) {
    if (!this.isOpen) return;
    inUiSpace(ctx, () => {
      drawMenuFrame(ctx, 'STORAGE', '');
      COLUMNS.forEach((column, i) => {
        const list = column.list();
        const active = i === this.column;
        const { area } = column;
        drawText(ctx, `${column.title}  ${list.length}/${column.max}`, area.x + 26, MENU.y + 74, { size: 26, color: active ? MENU_COLORS.highlight : MENU_COLORS.dim });
        if (!list.length) {
          drawText(ctx, i === 0 ? 'Your bag is empty.' : 'Nothing in here yet.', area.x + 26, area.y, { size: 24, color: MENU_COLORS.dim });
          return;
        }
        const cursor = active ? Math.min(this.cursors[i], list.length - 1) : -1;
        drawWeaponList(ctx, list, cursor, {
          area,
          name: (id) => ITEMS[id].name,
          nameColor: () => (active ? MENU_COLORS.text : MENU_COLORS.dim),
          tag: () => null,
        });
      });
      const list = COLUMNS[this.column].list();
      const id = list[Math.min(this.cursors[this.column], list.length - 1)];
      // What the item under the soul does, or what just happened.
      const about = this.message || (id ? `${ITEMS[id].name}: ${healLabel(id)}` : '');
      drawText(ctx, about, MENU.x + MENU.w / 2, FOOTER_Y + 6, { size: 26, color: this.message ? MENU_COLORS.highlight : MENU_COLORS.description, align: 'center' });
      drawControls(ctx, 'Z: move it across     Left/Right: bag or storage     X: close');
    });
  }
}
