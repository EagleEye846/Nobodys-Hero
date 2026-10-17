import { inUiSpace } from '../engine/screen.js';
import { sfx } from '../audio/music.js';
import { HERO_STATE } from '../characters/heroState.js';
import { ARMOR } from '../data/armor.js';
import { drawText } from './text.js';
import { drawMenuFrame, drawWeaponList, drawWeaponDetails, drawArmorDetails, drawControls, MENU, HEADER_Y, MENU_COLORS } from './menuFrame.js';

// What you can equip, one tab each: the weapon (FIGHT power and a shadow
// ability) and the armor (DEF, MAG and SP, see src/data/armor.js). Each tab
// lists what you own and which is equipped.
const TABS = [
  { label: 'WEAPON', owned: () => HERO_STATE.weapons, slot: 'weapon', details: drawWeaponDetails },
  { label: 'ARMOR', owned: () => HERO_STATE.armors, slot: 'armor', details: drawArmorDetails, name: (id) => ARMOR[id].name },
];

// The EQUIP menu, opened with C in the overworld. Left and right switch
// between weapons and armor, up and down pick one, Z equips it, and X or C
// closes the menu.
export class EquipMenu {
  constructor() {
    this.isOpen = false;
    this.tab = 0;
    this.cursor = 0;
  }

  open() {
    this.isOpen = true;
    this.showTab(0);
  }

  // Switches tab, with the cursor on what's equipped there.
  showTab(index) {
    this.tab = index;
    const tab = TABS[index];
    this.cursor = Math.max(0, tab.owned().indexOf(HERO_STATE[tab.slot]));
  }

  update(input) {
    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      sfx('back');
      this.isOpen = false;
      return;
    }
    if (input.wasPressed('left') || input.wasPressed('right')) {
      sfx('move');
      this.showTab((this.tab + 1) % TABS.length);
      return;
    }
    const tab = TABS[this.tab];
    const count = tab.owned().length;
    const before = this.cursor;
    if (input.wasPressed('down')) this.cursor = (this.cursor + 1) % count;
    if (input.wasPressed('up')) this.cursor = (this.cursor - 1 + count) % count;
    if (this.cursor !== before) sfx('move');
    if (input.wasPressed('confirm')) {
      sfx('select');
      HERO_STATE[tab.slot] = tab.owned()[this.cursor];
    }
  }

  draw(ctx) {
    if (!this.isOpen) return;

    inUiSpace(ctx, () => {
      drawMenuFrame(ctx, 'EQUIP', `${HERO_STATE.gold} G`);
      // The tabs, beside the title.
      TABS.forEach((tab, i) => {
        drawText(ctx, tab.label, MENU.x + 170 + i * 120, HEADER_Y + 12, {
          size: 28,
          color: i === this.tab ? MENU_COLORS.highlight : MENU_COLORS.dim,
        });
      });

      const tab = TABS[this.tab];
      const equipped = (id) => id === HERO_STATE[tab.slot];
      drawWeaponList(ctx, tab.owned(), this.cursor, {
        nameColor: (id) => (equipped(id) ? MENU_COLORS.highlight : MENU_COLORS.text),
        tag: (id) => (equipped(id) ? { text: 'E', color: MENU_COLORS.highlight } : null),
        ...(tab.name ? { name: tab.name } : {}),
      });
      tab.details(ctx, tab.owned()[this.cursor]);
      drawControls(ctx, 'Z: equip     LEFT/RIGHT: weapon or armor     X: close');
    });
  }
}
