import { inUiSpace } from '../engine/screen.js';
import { textSection } from '../engine/textLoader.js';
import { sfx } from '../audio/music.js';
import { HERO_STATE } from '../characters/heroState.js';
import { ITEMS, MAX_ITEMS, healLabel, lightLabel } from '../data/items.js';
import { MATERIALS, RECIPES, canMake, makeCandle, materialCount } from '../data/candles.js';
import { drawMenuFrame, drawWeaponList, drawControls, MENU, MENU_COLORS } from './menuFrame.js';
import { drawText, wrapLines } from './text.js';

const ITEM_TEXT = 'items/items.txt';
const DETAILS = { x: MENU.x + 320, y: MENU.y + 78, w: 216 };
const DETAILS_BOTTOM = MENU.y + MENU.h - 112;
const BLURB_WIDTH = 260;

// The CANDLES screen, in the C menu: make candles from the materials enemies
// leave behind (src/data/candles.js). The list shows every recipe; the right
// side shows what it does, how it lights the dark, and what it takes.
export class CandleMenu {
  constructor() {
    this.isOpen = false;
    this.cursor = 0;
    this.message = '';
  }

  open() {
    this.isOpen = true;
    this.message = '';
  }

  update(input) {
    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      sfx('back');
      this.isOpen = false;
      return;
    }
    const before = this.cursor;
    if (input.wasPressed('down')) this.cursor = (this.cursor + 1) % RECIPES.length;
    if (input.wasPressed('up')) this.cursor = (this.cursor - 1 + RECIPES.length) % RECIPES.length;
    if (this.cursor !== before) {
      sfx('move');
      this.message = '';
    }
    if (input.wasPressed('confirm')) {
      const recipe = RECIPES[this.cursor];
      const result = makeCandle(recipe);
      const name = ITEMS[recipe.candle].name;
      if (result === 'made' || result === 'stored') sfx('heal');
      else sfx('error');
      this.message = result === 'made' ? `You made a ${name}.`
        : result === 'stored' ? `You made a ${name}. (Bag full: it went to storage.)`
        : result === 'full' ? 'Your bag and storage are full.'
          : 'You need more materials.';
    }
  }

  draw(ctx) {
    if (!this.isOpen) return;
    inUiSpace(ctx, () => {
      drawMenuFrame(ctx, 'CANDLES', `${HERO_STATE.items.length}/${MAX_ITEMS}`);
      drawWeaponList(ctx, RECIPES.map((_, i) => i), this.cursor, {
        name: (i) => ITEMS[RECIPES[i].candle].name,
        nameColor: (i) => (canMake(RECIPES[i]) ? MENU_COLORS.text : MENU_COLORS.dim),
        tag: (i) => (canMake(RECIPES[i]) ? { text: 'READY', color: MENU_COLORS.highlight } : null),
      });
      this.drawDetails(ctx, RECIPES[this.cursor]);
      drawControls(ctx, this.message || 'Z: make it     X: close');
    });
  }

  drawDetails(ctx, recipe) {
    const id = recipe.candle;
    let y = DETAILS.y;
    drawText(ctx, ITEMS[id].name, DETAILS.x, y, { size: 30 });
    y += 34;
    drawText(ctx, `In battle: ${healLabel(id)}`, DETAILS.x, y, { size: 22, color: MENU_COLORS.ability });
    y += 26;
    drawText(ctx, lightLabel(id), DETAILS.x, y, { size: 20, color: MENU_COLORS.highlight });
    y += 34;
    // What it takes, and what you have of each.
    drawText(ctx, 'Takes:', DETAILS.x, y, { size: 22, color: MENU_COLORS.dim });
    y += 24;
    for (const [material, amount] of Object.entries(recipe.needs)) {
      const have = materialCount(material);
      drawText(ctx, `${MATERIALS[material].name}`, DETAILS.x + 10, y, { size: 22, color: have >= amount ? MENU_COLORS.text : MENU_COLORS.dim });
      drawText(ctx, `${have}/${amount}`, DETAILS.x + DETAILS.w, y, { size: 22, color: have >= amount ? MENU_COLORS.highlight : MENU_COLORS.dim, align: 'right' });
      y += 24;
    }
    // Its description, under the list on the left (a little smaller if it's long).
    const text = textSection(ITEM_TEXT, id)[0];
    const top = MENU.y + 78 + RECIPES.length * 30 + 18;
    let size = 20;
    let lines = wrapLines(ctx, text, BLURB_WIDTH, size);
    while (size > 14 && top + lines.length * size > DETAILS_BOTTOM + 30) lines = wrapLines(ctx, text, BLURB_WIDTH, --size);
    drawText(ctx, lines.join('\n'), MENU.x + 30, top, { size, lineHeight: size, color: MENU_COLORS.description });
  }
}
