import { inUiSpace } from '../engine/screen.js';
import { sfx } from '../audio/music.js';
import { HERO_STATE } from '../characters/heroState.js';
import { drawMenuFrame, drawWeaponList, drawWeaponDetails, drawControls, MENU_COLORS } from './menuFrame.js';

// The EQUIP menu, opened with C in the overworld. Pick a weapon with up/down,
// equip it with Z, and close with X or C.
export class EquipMenu {
  constructor() {
    this.isOpen = false;
    this.cursor = 0;
  }

  open() {
    this.isOpen = true;
    this.cursor = Math.max(0, HERO_STATE.weapons.indexOf(HERO_STATE.weapon));
  }

  update(input) {
    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      sfx('back');
      this.isOpen = false;
      return;
    }
    const count = HERO_STATE.weapons.length;
    const before = this.cursor;
    if (input.wasPressed('down')) this.cursor = (this.cursor + 1) % count;
    if (input.wasPressed('up')) this.cursor = (this.cursor - 1 + count) % count;
    if (this.cursor !== before) sfx('move');
    if (input.wasPressed('confirm')) {
      sfx('select');
      HERO_STATE.weapon = HERO_STATE.weapons[this.cursor];
    }
  }

  draw(ctx) {
    if (!this.isOpen) return;

    inUiSpace(ctx, () => {
      drawMenuFrame(ctx, 'EQUIP', `${HERO_STATE.gold} G`);
      const equipped = (id) => id === HERO_STATE.weapon;
      drawWeaponList(ctx, HERO_STATE.weapons, this.cursor, {
        nameColor: (id) => (equipped(id) ? MENU_COLORS.highlight : MENU_COLORS.text),
        tag: (id) => (equipped(id) ? { text: 'E', color: MENU_COLORS.highlight } : null),
      });
      drawWeaponDetails(ctx, HERO_STATE.weapons[this.cursor]);
      drawControls(ctx, 'Z: equip     X: close');
    });
  }
}
