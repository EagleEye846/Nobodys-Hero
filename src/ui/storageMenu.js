import { inUiSpace } from '../engine/screen.js';
import { sfx } from '../audio/music.js';
import { HERO_STATE } from '../characters/heroState.js';
import { ITEMS, MAX_ITEMS, maxStorage } from '../data/items.js';
import { drawMenuFrame, drawWeaponList, drawItemDetails, drawControls, itemIcon, MENU, MENU_COLORS, HEADER_Y, FOOTER_Y } from './menuFrame.js';
import { edible } from './itemsMenu.js';
import { drawText, textWidth } from './text.js';

// STORAGE, opened at a storage chest (one stands by every save point; see
// placeStorage in room.js). Every storage chest holds the same things:
// whatever didn't fit in your bag ends up here. Two pages, BAG and STORAGE
// (Left/Right): the same items stack into one row with a count, and the one
// under the soul is described on the right. Z on a row offers to move one
// across to the other page, or to drop it for good.
const SIDES = [
  { title: 'BAG', list: () => HERO_STATE.items, max: () => MAX_ITEMS, move: 'PUT AWAY', empty: 'Your bag is empty.' },
  { title: 'STORAGE', list: () => (HERO_STATE.storage ??= []), max: maxStorage, move: 'TAKE', empty: 'Nothing in here yet.' },
];
// How long a line like "Put the Trail Mix in storage" stays up, in frames.
const NOTE_FRAMES = 150;

// A list of ids as rows: one per kind of item, in the order they first
// turn up, with how many there are.
function stacks(list) {
  const rows = new Map();
  for (const id of list) rows.set(id, (rows.get(id) ?? 0) + 1);
  return [...rows].map(([id, count]) => ({ id, count }));
}

export class StorageMenu {
  constructor() {
    this.isOpen = false;
    this.side = 0;
    this.cursors = [0, 0];
    // The MOVE / DROP choice, open on the row under the soul.
    this.choosing = false;
    this.option = 0;
    this.confirming = false;
    this.note = null;
    this.noteLeft = 0;
  }

  open() {
    this.isOpen = true;
    // Start on whichever side has something in it.
    this.side = SIDES[0].list().length ? 0 : 1;
    this.cursors = [0, 0];
    this.choosing = false;
    this.confirming = false;
    this.noteLeft = 0;
  }

  say(text) {
    this.note = text;
    this.noteLeft = NOTE_FRAMES;
  }

  rows() {
    return stacks(SIDES[this.side].list());
  }

  // The row under the soul on this side, or null if it's empty.
  current() {
    const rows = this.rows();
    if (!rows.length) return null;
    this.cursors[this.side] = Math.min(this.cursors[this.side], rows.length - 1);
    return rows[this.cursors[this.side]];
  }

  // Takes one of `id` off this side (the last one, so the stacks keep their order).
  takeOne(id) {
    const list = SIDES[this.side].list();
    list.splice(list.lastIndexOf(id), 1);
  }

  move(id) {
    const to = SIDES[1 - this.side];
    if (to.list().length >= to.max()) {
      sfx('error');
      this.say(this.side === 0 ? 'Storage is full.' : 'Your bag is full.');
      return;
    }
    this.takeOne(id);
    to.list().push(id);
    sfx('select');
    this.say(this.side === 0 ? `Put the ${ITEMS[id].name} in storage.` : `Took the ${ITEMS[id].name}.`);
  }

  drop(id) {
    this.takeOne(id);
    sfx('back');
    this.say(`Dropped the ${ITEMS[id].name}.`);
  }

  update(input) {
    if (this.noteLeft > 0) this.noteLeft--;
    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      sfx('back');
      if (this.confirming) this.confirming = false;
      else if (this.choosing) this.choosing = false;
      else this.isOpen = false;
      return;
    }
    const row = this.current();
    if (this.confirming) {
      if (input.wasPressed('confirm')) {
        this.drop(row.id);
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
          this.move(row.id);
        } else {
          sfx('select');
          this.confirming = true;
        }
      }
      return;
    }
    if (input.wasPressed('left') || input.wasPressed('right')) {
      const side = input.wasPressed('left') ? 0 : 1;
      if (side !== this.side) {
        this.side = side;
        this.noteLeft = 0;
        sfx('move');
      }
      return;
    }
    if (!row) return;
    const count = this.rows().length;
    const before = this.cursors[this.side];
    if (input.wasPressed('down')) this.cursors[this.side] = (before + 1) % count;
    if (input.wasPressed('up')) this.cursors[this.side] = (before - 1 + count) % count;
    if (this.cursors[this.side] !== before) {
      sfx('move');
      this.noteLeft = 0;
    }
    if (input.wasPressed('confirm')) {
      sfx('select');
      this.choosing = true;
      this.option = 0;
      this.noteLeft = 0;
    }
  }

  // The two pages' names in the header, right-aligned: the open one lit up.
  drawTabs(ctx) {
    const size = 24;
    let x = MENU.x + MENU.w - 24;
    for (let i = SIDES.length - 1; i >= 0; i--) {
      const side = SIDES[i];
      const label = `${side.title} ${side.list().length}/${side.max()}`;
      const w = textWidth(ctx, label, size) + 20;
      x -= w;
      const active = i === this.side;
      ctx.fillStyle = active ? MENU_COLORS.highlight : 'rgba(20, 16, 36, 0.9)';
      ctx.fillRect(x, HEADER_Y + 6, w, size + 8);
      ctx.strokeStyle = active ? '#ffffff' : MENU_COLORS.divider;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, HEADER_Y + 6, w, size + 8);
      drawText(ctx, label, x + 10, HEADER_Y + 10, { size, color: active ? '#120c1c' : MENU_COLORS.dim });
      x -= 10;
    }
  }

  draw(ctx) {
    if (!this.isOpen) return;
    inUiSpace(ctx, () => {
      drawMenuFrame(ctx, 'STORAGE', '');
      this.drawTabs(ctx);
      const side = SIDES[this.side];
      const row = this.current();
      if (!row) {
        drawText(ctx, side.empty, MENU.x + 50, MENU.y + 90, { size: 28, color: MENU_COLORS.dim });
        drawControls(ctx, this.noteLeft > 0 ? this.note : 'Left/Right: bag or storage     X: close');
        return;
      }
      drawWeaponList(ctx, this.rows(), this.cursors[this.side], {
        name: (entry) => ITEMS[entry.id].name,
        nameColor: (entry) => (edible(entry.id) ? MENU_COLORS.text : MENU_COLORS.description),
        tag: (entry) => (entry.count > 1 ? { text: `x${entry.count}`, color: MENU_COLORS.highlight } : null),
        // The same little pictures as the bag (food, a candle, or something else).
        icon: (entry) => itemIcon(entry.id),
      });
      drawItemDetails(ctx, row.id);
      // What just happened, under the list.
      if (this.noteLeft > 0) drawText(ctx, this.note, MENU.x + MENU.w / 2, FOOTER_Y + 6, { size: 24, color: MENU_COLORS.highlight, align: 'center' });
      const name = ITEMS[row.id].name;
      let line;
      if (this.confirming) line = `Drop the ${name} for good?   Z: yes   X: no`;
      else if (this.choosing) line = [side.move, 'DROP'].map((o, i) => (i === this.option ? `> ${o}` : `  ${o}`)).join('        ');
      else line = `Z: ${side.move.toLowerCase()} or drop    Left/Right: switch    X: close`;
      drawControls(ctx, line);
    });
  }
}
