import { UI_WIDTH, UI_HEIGHT } from '../config.js';
import { textSection } from '../engine/textLoader.js';
import { WEAPONS } from '../data/weapons.js';
import { ITEMS, healLabel } from '../data/items.js';
import { SOUL_ABILITIES } from '../battle/soulAbilities.js';
import { soulSprite } from '../battle/soul.js';
import { drawText, wrapLines } from './text.js';

// Shared layout for full-screen menus (EQUIP, SKILLS), in UI pixels (640x480):
// a header, a scrolling weapon list on the left, details on the right, and a
// footer for messages and controls. The weapon list and details can also be
// placed elsewhere (the shop does).

export const MENU = { x: 40, y: 30, w: 560, h: 420 };
export const FOOTER_Y = MENU.y + 330;
export const MENU_COLORS = {
  text: '#ffffff',
  highlight: '#ffe14d',
  dim: '#8a82b0',
  description: '#c9c2e0',
  divider: '#33304a',
  fight: '#ff8c1a',
  ability: '#4fe3d0',
};

const BORDER = 4;
const LIST = { x: MENU.x + 24, y: MENU.y + 78, width: 272, rowHeight: 30, rows: 8 };
const DETAILS = { x: MENU.x + 320, y: MENU.y + 78, w: 216 };

// Where the title row sits, for menus that add their own header text.
export const HEADER_Y = MENU.y + 16;
const WEAPON_TEXT = 'items/weapons.txt';
const ITEM_TEXT = 'items/items.txt';

function divider(ctx, x, y, w, h) {
  ctx.fillStyle = MENU_COLORS.divider;
  ctx.fillRect(x, y, w, h);
}

// `split` draws the line between a list on the left and details on the right.
export function drawMenuFrame(ctx, title, rightLabel, { split = true } = {}) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, UI_WIDTH, UI_HEIGHT);
  ctx.fillStyle = MENU_COLORS.text;
  ctx.fillRect(MENU.x, MENU.y, MENU.w, MENU.h);
  ctx.fillStyle = '#000';
  ctx.fillRect(MENU.x + BORDER, MENU.y + BORDER, MENU.w - BORDER * 2, MENU.h - BORDER * 2);

  drawText(ctx, title, MENU.x + 24, MENU.y + 16, { size: 40 });
  drawText(ctx, rightLabel, MENU.x + MENU.w - 24, MENU.y + 28, { size: 24, color: MENU_COLORS.highlight, align: 'right' });
  divider(ctx, MENU.x + 24, MENU.y + 64, MENU.w - 48, 2);
  if (split) divider(ctx, DETAILS.x - 16, LIST.y - 4, 2, LIST.rows * LIST.rowHeight);
  divider(ctx, MENU.x + 24, FOOTER_Y - 8, MENU.w - 48, 2);
}

// The list scrolls to keep the cursor in view; small arrows show there's more.
// nameColor(id) colours each name; tag(id) can return { text, color } for the right edge.
// `area` is { x, y, width, rowHeight, rows }. `name(id)` is what to call each
// row (weapons by default; the ITEMS menu and shops pass their own).
export function drawWeaponList(ctx, ids, cursor, { nameColor, tag, area = LIST, name = (id) => WEAPONS[id].name }) {
  const first = Math.min(Math.max(0, cursor - Math.floor(area.rows / 2)), Math.max(0, ids.length - area.rows));
  const last = Math.min(ids.length, first + area.rows);

  for (let i = first; i < last; i++) {
    const id = ids[i];
    const y = area.y + (i - first) * area.rowHeight;
    if (i === cursor) ctx.drawImage(soulSprite(), area.x, y + 5);
    drawText(ctx, name(id), area.x + 26, y, { size: 28, color: nameColor(id) });
    const label = tag(id);
    if (label) drawText(ctx, label.text, area.x + area.width, y + 4, { size: 22, color: label.color, align: 'right' });
  }

  const arrowX = area.x + area.width / 2;
  ctx.fillStyle = MENU_COLORS.dim;
  if (first > 0) triangle(ctx, arrowX, area.y - 10, -1);
  if (last < ids.length) triangle(ctx, arrowX, area.y + area.rows * area.rowHeight - 2, 1);
}

function triangle(ctx, x, y, direction) {
  ctx.beginPath();
  ctx.moveTo(x - 6, y);
  ctx.lineTo(x + 6, y);
  ctx.lineTo(x, y + direction * 6);
  ctx.fill();
}

// Name, FIGHT power, SHIFT ability and description of one weapon. `area` is { x, y, w }.
export function drawWeaponDetails(ctx, id, area = DETAILS) {
  const weapon = WEAPONS[id];
  const ability = weapon.ability ? SOUL_ABILITIES[weapon.ability] : null;
  let y = area.y;

  drawText(ctx, weapon.name, area.x, y, { size: 30 });
  y += 34;
  drawText(ctx, `FIGHT x${weapon.fightPower}`, area.x, y, { size: 24, color: MENU_COLORS.fight });
  y += 26;
  const abilityLabel = ability ? `${ability.hold ? 'HOLD SHIFT' : 'SHIFT'}: ${ability.name}` : 'No soul ability';
  drawText(ctx, abilityLabel, area.x, y, { size: 24, color: ability ? MENU_COLORS.ability : MENU_COLORS.dim });
  y += 34;

  const lines = wrapLines(ctx, textSection(WEAPON_TEXT, id)[0], area.w, 22);
  drawText(ctx, lines.join('\n'), area.x, y, { size: 22, lineHeight: 22, color: MENU_COLORS.description });
}

// Name, how much it heals, and the description of one item. `area` is { x, y, w }.
export function drawItemDetails(ctx, id, area = DETAILS) {
  let y = area.y;
  drawText(ctx, ITEMS[id].name, area.x, y, { size: 30 });
  y += 34;
  drawText(ctx, healLabel(id), area.x, y, { size: 24, color: MENU_COLORS.ability });
  y += 34;
  const lines = wrapLines(ctx, textSection(ITEM_TEXT, id)[0], area.w, 22);
  drawText(ctx, lines.join('\n'), area.x, y, { size: 22, lineHeight: 22, color: MENU_COLORS.description });
}

export function drawControls(ctx, text) {
  drawText(ctx, text, MENU.x + MENU.w / 2, MENU.y + MENU.h - 34, { size: 22, color: MENU_COLORS.dim, align: 'center' });
}
