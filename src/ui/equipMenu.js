import { inUiSpace } from '../engine/screen.js';
import { sfx } from '../audio/music.js';
import { HERO_STATE } from '../characters/heroState.js';
import { MEMBERS, partyIds } from '../characters/party.js';
import { HERO, ownedGear, equippedGear, equipGear } from '../characters/equipment.js';
import { ARMOR } from '../data/armor.js';
import { drawText, textWidth } from './text.js';
import { drawMenuFrame, drawWeaponList, drawWeaponDetails, drawArmorDetails, drawControls, MENU, HEADER_Y, FOOTER_Y, MENU_COLORS } from './menuFrame.js';

// What you can equip, one tab each: the weapon (FIGHT power and a shadow
// ability) and the armor (DEF, MAG and SP, see src/data/armor.js). Each tab
// lists what you own and which is equipped.
const SLOTS = [
  { label: 'WEAPON', slot: 'weapon', details: drawWeaponDetails },
  { label: 'ARMOR', slot: 'armor', details: drawArmorDetails, name: (id) => ARMOR[id].name },
];
const HERO_LABEL = { name: 'HERO', color: '#4fe3d0' };
// The details panel on a member's tabs: as usual, but stopping at the footer.
const NOTE_DETAILS = { x: MENU.x + 320, y: MENU.y + 78, w: 216, h: FOOTER_Y - 14 - (MENU.y + 78) };
// A party member's tabs say a word about what their gear is for.
const MEMBER_NOTES = {
  vesper: "Ves's gear powers her moves, and looks after you.",
};

// The EQUIP menu, opened with C in the overworld. Left and right switch
// between weapons and armor (and, with friends in the party, on to each
// friend's own weapon and armor: see src/characters/equipment.js), up and
// down pick one, Z equips it, and X or C closes the menu. Each tab only
// lists what that person can use.
export class EquipMenu {
  constructor() {
    this.isOpen = false;
    this.tab = 0;
    this.cursor = 0;
  }

  // Every tab: the hero's weapon and armor, then each member's.
  tabs() {
    return [HERO, ...partyIds()].flatMap((who) => SLOTS.map((slot) => ({ ...slot, who })));
  }

  open() {
    this.isOpen = true;
    this.showTab(0);
  }

  // Switches tab, with the cursor on what's equipped there.
  showTab(index) {
    this.tab = index;
    const tab = this.tabs()[index];
    this.cursor = Math.max(0, ownedGear(tab.who, tab.slot).indexOf(equippedGear(tab.who, tab.slot)));
  }

  update(input) {
    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      sfx('back');
      this.isOpen = false;
      return;
    }
    const tabs = this.tabs();
    const dir = (input.wasPressed('right') ? 1 : 0) - (input.wasPressed('left') ? 1 : 0);
    if (dir) {
      sfx('move');
      this.showTab((this.tab + dir + tabs.length) % tabs.length);
      return;
    }
    const tab = tabs[this.tab];
    const owned = ownedGear(tab.who, tab.slot);
    if (!owned.length) return;
    const before = this.cursor;
    if (input.wasPressed('down')) this.cursor = (this.cursor + 1) % owned.length;
    if (input.wasPressed('up')) this.cursor = (this.cursor - 1 + owned.length) % owned.length;
    if (this.cursor !== before) sfx('move');
    if (input.wasPressed('confirm')) {
      sfx('select');
      equipGear(tab.who, tab.slot, owned[this.cursor]);
    }
  }

  draw(ctx) {
    if (!this.isOpen) return;

    inUiSpace(ctx, () => {
      drawMenuFrame(ctx, 'EQUIP', `${HERO_STATE.gold} G`);
      const tabs = this.tabs();
      const tab = tabs[this.tab];
      const people = [HERO, ...partyIds()];

      // Beside the title: whose gear it is (only once there's a choice),
      // then the weapon and armor tabs.
      let x = MENU.x + 170;
      if (people.length > 1) {
        x = MENU.x + 150;
        for (const who of people) {
          const { name, color } = who === HERO ? HERO_LABEL : MEMBERS[who];
          drawText(ctx, name, x, HEADER_Y + 12, { size: 28, color: who === tab.who ? color : MENU_COLORS.dim });
          x += textWidth(ctx, name, 28) + 14;
        }
        x += 18;
      }
      SLOTS.forEach((slot, i) => {
        drawText(ctx, slot.label, x, HEADER_Y + 12, {
          size: 28,
          color: slot.slot === tab.slot ? MENU_COLORS.highlight : MENU_COLORS.dim,
        });
        x += people.length > 1 ? textWidth(ctx, slot.label, 28) + 16 : 120;
      });

      const owned = ownedGear(tab.who, tab.slot);
      const equipped = (id) => id === equippedGear(tab.who, tab.slot);
      drawWeaponList(ctx, owned, this.cursor, {
        nameColor: (id) => (equipped(id) ? MENU_COLORS.highlight : MENU_COLORS.text),
        tag: (id) => (equipped(id) ? { text: 'E', color: MENU_COLORS.highlight } : null),
        ...(tab.name ? { name: tab.name } : {}),
      });
      // A member's tabs keep their details above the footer, where their note goes.
      const note = MEMBER_NOTES[tab.who];
      if (owned.length) tab.details(ctx, owned[this.cursor], note ? NOTE_DETAILS : undefined);
      if (note) drawText(ctx, note, MENU.x + MENU.w / 2, FOOTER_Y + 4, { size: 22, color: MENU_COLORS.description, align: 'center' });
      drawControls(ctx, people.length > 1
        ? 'Z: equip     LEFT/RIGHT: change tab     X: close'
        : 'Z: equip     LEFT/RIGHT: weapon or armor     X: close');
    });
  }
}
