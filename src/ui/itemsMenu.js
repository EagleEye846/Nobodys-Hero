import { inUiSpace } from '../engine/screen.js';
import { sfx } from '../audio/music.js';
import { HERO_STATE } from '../characters/heroState.js';
import { heroHp, heroMaxHp, setHeroHp, skillBonus } from '../characters/progress.js';
import { MEMBERS, partyIds, memberHp, memberMaxHp, setMemberHp, possessive } from '../characters/party.js';
import { HERO } from '../characters/equipment.js';
import { ITEMS, MAX_ITEMS } from '../data/items.js';
import { GEAR, keepsakeText } from '../data/gear.js';
import { drawMenuFrame, drawWeaponList, drawItemDetails, drawKeepsakeDetails, drawControls, drawOwnerTag, itemIcon, MENU, MENU_COLORS, FOOTER_Y } from './menuFrame.js';
import { drawText } from './text.js';

// The ITEMS menu, opened with C in the overworld: what's in your bag. Z on
// an item offers EAT or THROW AWAY. Food can be eaten here as well as in
// battle (ITEMS on your turn); with friends in the party you then pick who
// gets it (their HP carries between fights too, see memberHp in party.js).
// Candles and other things that only work in a fight (a `use`, or a `light`
// you burn with the candle menu) say so.
//
// SPACE turns to the KEEPSAKES page: everything you carry for good (the rope,
// the star shards, keys, and the keepsakes people give you, src/data/gear.js),
// in the order you got them, with a line or two about each. Nothing to do
// with them there but look.
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
    // Who's getting the food: an index into eaters(), or -1 when not picking.
    this.feeding = -1;
    this.note = null;
    this.noteLeft = 0;
    // The KEEPSAKES page instead of the bag, and its cursor.
    this.keepsakes = false;
    this.keepCursor = 0;
  }

  open() {
    this.isOpen = true;
    this.cursor = 0;
    this.keepsakes = false;
    this.keepCursor = 0;
    this.choosing = false;
    this.confirming = false;
    this.feeding = -1;
    this.note = null;
    this.noteLeft = 0;
  }

  say(text) {
    this.note = text;
    this.noteLeft = NOTE_FRAMES;
  }

  // Who can eat: the hero, then each friend in the party, with their HP.
  eaters() {
    return [
      { who: HERO, hp: heroHp(), max: heroMaxHp(), set: setHeroHp },
      ...partyIds().map((id) => ({ who: id, hp: memberHp(id), max: memberMaxHp(id), set: (hp) => setMemberHp(id, hp) })),
    ];
  }

  // EAT: straight to the hero if they're on their own; otherwise pick who,
  // starting on whoever's lowest.
  startEating() {
    const id = HERO_STATE.items[this.cursor];
    if (!edible(id)) {
      sfx('error');
      this.say(`The ${ITEMS[id].name} is for using in battle.`);
      return;
    }
    const eaters = this.eaters();
    if (eaters.length === 1) {
      this.eat(eaters[0]);
      return;
    }
    sfx('select');
    this.feeding = eaters.reduce((low, eater, i) => (eater.hp / eater.max < eaters[low].hp / eaters[low].max ? i : low), 0);
  }

  // Feeds the item at the cursor to `eater`: heals them, like in battle (Warm
  // Heart and all). Not when they're already full: it'd be wasted. Returns
  // whether they ate it.
  eat(eater) {
    const items = HERO_STATE.items;
    const item = ITEMS[items[this.cursor]];
    const hero = eater.who === HERO;
    const name = hero ? 'You' : MEMBERS[eater.who].name;
    if (eater.hp >= eater.max) {
      sfx('error');
      this.say(hero ? "You're not hungry. Your HP is already full." : `${name} isn't hungry. ${possessive(eater.who)} HP is already full.`);
      return false;
    }
    const heal = item.heal >= 999 ? item.heal : Math.round(item.heal * (1 + skillBonus('itemBoost')));
    const after = Math.min(eater.max, eater.hp + heal);
    eater.set(after);
    items.splice(this.cursor, 1);
    this.cursor = Math.min(this.cursor, Math.max(0, items.length - 1));
    sfx('heal');
    const whose = hero ? 'Your' : possessive(eater.who);
    this.say(after >= eater.max ? `${name} ate the ${item.name}. ${whose} HP was maxed out!` : `${name} ate the ${item.name}. Recovered ${after - eater.hp} HP!`);
    return true;
  }

  update(input) {
    const items = HERO_STATE.items;
    if (this.noteLeft > 0) this.noteLeft--;
    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      sfx('back');
      if (this.confirming) this.confirming = false;
      else if (this.feeding >= 0) this.feeding = -1;
      else if (this.choosing) this.choosing = false;
      else this.isOpen = false;
      return;
    }
    // SPACE: between the bag and the KEEPSAKES page (not while picking what to do).
    if (input.wasPressed('jump') && !this.choosing && !this.confirming && this.feeding < 0) {
      this.keepsakes = !this.keepsakes;
      this.noteLeft = 0;
      sfx('move');
      return;
    }
    if (this.keepsakes) {
      const kept = HERO_STATE.gear ?? [];
      if (!kept.length) return;
      this.keepCursor = Math.min(this.keepCursor, kept.length - 1);
      const before = this.keepCursor;
      if (input.wasPressed('down')) this.keepCursor = (this.keepCursor + 1) % kept.length;
      if (input.wasPressed('up')) this.keepCursor = (this.keepCursor - 1 + kept.length) % kept.length;
      if (this.keepCursor !== before) sfx('move');
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
    if (this.feeding >= 0) {
      const eaters = this.eaters();
      const before = this.feeding;
      if (input.wasPressed('right') || input.wasPressed('down')) this.feeding = (before + 1) % eaters.length;
      if (input.wasPressed('left') || input.wasPressed('up')) this.feeding = (before - 1 + eaters.length) % eaters.length;
      if (this.feeding !== before) {
        sfx('move');
        this.noteLeft = 0;
      }
      if (input.wasPressed('confirm') && this.eat(eaters[this.feeding])) {
        this.feeding = -1;
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
          this.startEating();
          // On their own, the hero's eaten it (or not) already.
          if (this.feeding < 0) this.choosing = false;
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
    if (this.keepsakes) {
      inUiSpace(ctx, () => this.drawKeepsakes(ctx));
      return;
    }
    inUiSpace(ctx, () => {
      drawMenuFrame(ctx, 'ITEMS', `HP ${heroHp()}/${heroMaxHp()}   ${items.length}/${MAX_ITEMS}`);
      if (!items.length) {
        drawText(ctx, 'Your bag is empty.', MENU.x + 50, MENU.y + 90, { size: 28, color: MENU_COLORS.dim });
        drawControls(ctx, this.noteLeft > 0 ? this.note : 'SPACE: keepsakes     X: close');
        return;
      }
      drawWeaponList(ctx, items, this.cursor, {
        name: (id) => ITEMS[id].name,
        nameColor: (id) => (edible(id) ? MENU_COLORS.text : MENU_COLORS.dim),
        tag: () => null,
        icon: itemIcon,
      });
      drawItemDetails(ctx, items[this.cursor]);
      const name = ITEMS[items[this.cursor]].name;
      if (this.feeding >= 0) this.drawEaters(ctx);
      let line;
      if (this.feeding >= 0) line = this.noteLeft > 0 ? this.note : `Who gets the ${name}?   Z: give   X: back`;
      else if (this.confirming) line = `Throw away the ${name}?   Z: yes   X: no`;
      else if (this.choosing) line = OPTIONS.map((o, i) => (i === this.option ? `> ${o}` : `  ${o}`)).join('        ');
      else if (this.noteLeft > 0) line = this.note;
      else line = 'Z: eat or throw away   SPACE: keepsakes   X: close';
      drawControls(ctx, line);
    });
  }

  // The KEEPSAKES page: what you carry for good, and a line or two about it.
  drawKeepsakes(ctx) {
    const kept = (HERO_STATE.gear ?? []).filter((id) => GEAR[id]);
    drawMenuFrame(ctx, 'KEEPSAKES', `${kept.length} kept`);
    if (!kept.length) {
      drawText(ctx, 'Nothing kept yet.', MENU.x + 50, MENU.y + 90, { size: 28, color: MENU_COLORS.dim });
    } else {
      const cursor = Math.min(this.keepCursor, kept.length - 1);
      drawWeaponList(ctx, kept, cursor, {
        name: (id) => GEAR[id].name,
        nameColor: () => MENU_COLORS.text,
        tag: () => null,
      });
      drawKeepsakeDetails(ctx, GEAR[kept[cursor]].name, keepsakeText(kept[cursor]));
    }
    drawControls(ctx, 'Up/Down: look   SPACE: bag   X: close');
  }

  // Who's eating, along the row under the list: a tag for each (the one
  // picked lit up) with their HP under it, red when it's low.
  drawEaters(ctx) {
    const eaters = this.eaters();
    const slot = (MENU.w - 48) / eaters.length;
    eaters.forEach((eater, i) => {
      const x = MENU.x + 24 + i * slot;
      const selected = i === this.feeding;
      drawOwnerTag(ctx, eater.who, x, FOOTER_Y - 2, { selected, size: 18 });
      const color = eater.hp < eater.max / 3 ? MENU_COLORS.bad : selected ? MENU_COLORS.text : MENU_COLORS.dim;
      drawText(ctx, `HP ${eater.hp}/${eater.max}`, x + 6, FOOTER_Y + 28, { size: 18, color });
    });
  }
}
