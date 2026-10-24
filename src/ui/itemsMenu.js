import { inUiSpace } from '../engine/screen.js';
import { sfx } from '../audio/music.js';
import { HERO_STATE } from '../characters/heroState.js';
import { heroHp, heroMaxHp, setHeroHp, skillBonus } from '../characters/progress.js';
import { ITEMS, MAX_ITEMS } from '../data/items.js';
import { drawMenuFrame, drawWeaponList, drawItemDetails, drawControls, MENU, MENU_COLORS } from './menuFrame.js';
import { drawText } from './text.js';

// The ITEMS menu, opened with C in the overworld: what's in your bag. Z on
// an item offers EAT or THROW AWAY. Food can be eaten here as well as in
// battle (ITEMS on your turn), healing you; your friends start every fight
// fresh, so it's your HP it's for. Candles and other things that only work
// in a fight (a `use`, or a `light` you burn with the candle menu) say so.
const OPTIONS = ['EAT', 'THROW AWAY'];
// How long a line like "You ate the Trail Mix" stays up, in frames.
const NOTE_FRAMES = 150;

// Whether an item is food you can eat out here.
export function edible(id) {
  const item = ITEMS[id];
  return Boolean(item?.heal) && !item.use && !item.light;
}

export class ItemsMenu {
  constructor() {
    this.isOpen = false;
    this.cursor = 0;
    // The EAT / THROW AWAY choice, open on the item under the cursor.
    this.choosing = false;
    this.option = 0;
    this.confirming = false;
    this.note = null;
    this.noteLeft = 0;
  }

  open() {
    this.isOpen = true;
    this.cursor = 0;
    this.choosing = false;
    this.confirming = false;
    this.note = null;
  }

  say(text) {
    this.note = text;
    this.noteLeft = NOTE_FRAMES;
  }

  // Eats the item at the cursor: heals you, like in battle (Warm Heart and
  // all). Not when you're already full: it'd be wasted.
  eat() {
    const items = HERO_STATE.items;
    const id = items[this.cursor];
    const item = ITEMS[id];
    if (!edible(id)) {
      sfx('error');
      this.say(`The ${item.name} is for using in battle.`);
      return;
    }
    if (heroHp() >= heroMaxHp()) {
      sfx('error');
      this.say("You're not hungry. Your HP is already full.");
      return;
    }
    const heal = item.heal >= 999 ? item.heal : Math.round(item.heal * (1 + skillBonus('itemBoost')));
    const before = heroHp();
    setHeroHp(before + heal);
    items.splice(this.cursor, 1);
    this.cursor = Math.min(this.cursor, Math.max(0, items.length - 1));
    sfx('heal');
    this.say(heroHp() >= heroMaxHp() ? `You ate the ${item.name}. Your HP was maxed out!` : `You ate the ${item.name}. Recovered ${heroHp() - before} HP!`);
  }

  update(input) {
    const items = HERO_STATE.items;
    if (this.noteLeft > 0) this.noteLeft--;
    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      sfx('back');
      if (this.confirming) this.confirming = false;
      else if (this.choosing) this.choosing = false;
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
        this.choosing = false;
      }
      return;
    }
    if (this.choosing) {
      if (input.wasPressed('left') || input.wasPressed('right') || input.wasPressed('up') || input.wasPressed('down')) {
        this.option = 1 - this.option;
        sfx('move');
      }
      if (input.wasPressed('confirm')) {
        if (this.option === 0) {
          this.choosing = false;
          this.eat();
        } else {
          sfx('select');
          this.confirming = true;
        }
      }
      return;
    }
    const before = this.cursor;
    if (input.wasPressed('down')) this.cursor = (this.cursor + 1) % items.length;
    if (input.wasPressed('up')) this.cursor = (this.cursor - 1 + items.length) % items.length;
    if (this.cursor !== before) {
      sfx('move');
      this.noteLeft = 0;
    }
    if (input.wasPressed('confirm')) {
      sfx('select');
      this.choosing = true;
      // Food starts on EAT; anything else on THROW AWAY.
      this.option = edible(items[this.cursor]) ? 0 : 1;
      this.noteLeft = 0;
    }
  }

  draw(ctx) {
    if (!this.isOpen) return;
    const items = HERO_STATE.items;
    inUiSpace(ctx, () => {
      drawMenuFrame(ctx, 'ITEMS', `HP ${heroHp()}/${heroMaxHp()}   ${items.length}/${MAX_ITEMS}`);
      if (!items.length) {
        drawText(ctx, 'Your bag is empty.', MENU.x + 50, MENU.y + 90, { size: 28, color: MENU_COLORS.dim });
        drawControls(ctx, this.noteLeft > 0 ? this.note : 'X: close');
        return;
      }
      drawWeaponList(ctx, items, this.cursor, {
        name: (id) => ITEMS[id].name,
        nameColor: (id) => (edible(id) ? MENU_COLORS.text : MENU_COLORS.dim),
        tag: () => null,
      });
      drawItemDetails(ctx, items[this.cursor]);
      const name = ITEMS[items[this.cursor]].name;
      let line;
      if (this.confirming) line = `Throw away the ${name}?   Z: yes   X: no`;
      else if (this.choosing) line = OPTIONS.map((o, i) => (i === this.option ? `> ${o}` : `  ${o}`)).join('        ');
      else if (this.noteLeft > 0) line = this.note;
      else line = 'Z: eat or throw away     X: close';
      drawControls(ctx, line);
    });
  }
}
