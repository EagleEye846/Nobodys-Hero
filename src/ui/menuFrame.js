import { UI_WIDTH, UI_HEIGHT } from '../config.js';
import { textSection } from '../engine/textLoader.js';
import { WEAPONS } from '../data/weapons.js';
import { ARMOR, armorLabels } from '../data/armor.js';
import { ITEMS, healLabel, lightLabel } from '../data/items.js';
import { SOUL_ABILITIES } from '../battle/soulAbilities.js';
import { soulSprite } from '../battle/soul.js';
import { MEMBERS, partyIds, memberSprites } from '../characters/party.js';
import { HERO_ANIMATIONS } from '../characters/hero.js';
import { PORTRAITS } from '../data/art/portraits.js';
import { makeSprite } from '../engine/sprite.js';
import { HERO, wielderOf, memberGearLabels } from '../characters/equipment.js';
import { drawText, wrapLines, textWidth } from './text.js';

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
  // Armor stats, and a stat that's a drawback.
  defense: '#7fb0ff',
  magic: '#b07cff',
  spGain: '#4fe3d0',
  bad: '#ff7a8a',
  // A party member's gear stats (see src/characters/equipment.js).
  calm: '#ffd25e',
  heal: '#5fc27a',
};

const BORDER = 4;
const LIST = { x: MENU.x + 24, y: MENU.y + 78, width: 272, rowHeight: 30, rows: 8 };
// `h` is how tall the panel is: a description too long for it shrinks to fit.
const DETAILS = { x: MENU.x + 320, y: MENU.y + 78, w: 216, h: MENU.h - 78 - 42 };

// Where the title row sits, for menus that add their own header text.
export const HEADER_Y = MENU.y + 16;
const WEAPON_TEXT = 'items/weapons.txt';
const ARMOR_TEXT = 'items/armor.txt';
const ITEM_TEXT = 'items/items.txt';

function divider(ctx, x, y, w, h) {
  ctx.fillStyle = MENU_COLORS.divider;
  ctx.fillRect(x, y, w, h);
}

// Whose menu you're in, the same way everywhere (EQUIP, the skill tree, the
// gear panels): the hero or a party member (`who`: 'hero' or a member id),
// with their name, their colour, and their face: a member's portrait, or
// (the hero has none) the top rows of their sprite.
export const HERO_COLOR = '#4fe3d0';
const FACE_ROWS = 9;
const faces = new Map();
function faceOf(who) {
  if (!faces.has(who)) {
    const art = who === HERO ? null : PORTRAITS[MEMBERS[who].portrait];
    const sprite = art ? makeSprite(art.idle, art.palette) : who === HERO ? HERO_ANIMATIONS.right[0] : memberSprites(who).right;
    // The part of the image that's the face: all of a portrait, or the top of a sprite.
    faces.set(who, { image: sprite, sw: sprite.width, sh: art ? sprite.height : FACE_ROWS });
  }
  return faces.get(who);
}
export function ownerLook(who) {
  if (who === HERO) return { name: 'HERO', color: HERO_COLOR };
  return { name: MEMBERS[who].name, color: MEMBERS[who].color };
}

// A tag for `who`: their face and name in a pill of their colour, filled
// when it's the one you're on (`selected`), dim when it isn't. `x`, `y` is
// its top-left; `size` the name's size. Returns its width.
export function drawOwnerTag(ctx, who, x, y, { selected = true, size = 22 } = {}) {
  const { name, color } = ownerLook(who);
  const { image, sw, sh } = faceOf(who);
  const h = size + 10;
  const faceH = h - 6;
  const faceW = Math.round((faceH * sw) / sh);
  const w = 8 + faceW + 6 + textWidth(ctx, name, size) + 10;
  ctx.save();
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, h / 2);
  else ctx.rect(x, y, w, h);
  ctx.fillStyle = selected ? color : 'rgba(20, 16, 36, 0.9)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = selected ? '#ffffff' : MENU_COLORS.divider;
  ctx.stroke();
  ctx.globalAlpha = selected ? 1 : 0.45;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, 0, 0, sw, sh, x + 8, y + 3, faceW, faceH);
  ctx.restore();
  drawText(ctx, name, x + 8 + faceW + 6, y + 4, { size, color: selected ? '#120c1c' : MENU_COLORS.dim });
  return w;
}

// `split` draws the line between a list on the left and details on the right.
// `accent` colours the border: whose menu it is (see ownerLook).
export function drawMenuFrame(ctx, title, rightLabel, { split = true, accent = MENU_COLORS.text } = {}) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, UI_WIDTH, UI_HEIGHT);
  ctx.fillStyle = accent;
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
  if (wielderOf('weapon', id) !== HERO) {
    drawMemberGearDetails(ctx, 'weapon', id, WEAPONS[id].name, WEAPON_TEXT, area);
    return;
  }
  const weapon = WEAPONS[id];
  const ability = weapon.ability ? SOUL_ABILITIES[weapon.ability] : null;
  let y = area.y;

  drawText(ctx, weapon.name, area.x, y, { size: 30 });
  y += 34;
  drawHeroMark(ctx, area, y);
  drawText(ctx, `FIGHT x${weapon.fightPower}`, area.x, y, { size: 24, color: MENU_COLORS.fight });
  y += 26;
  const abilityLabel = ability ? `${ability.hold ? 'HOLD SHIFT' : 'SHIFT'}: ${ability.name}` : 'No shadow ability';
  drawText(ctx, abilityLabel, area.x, y, { size: 24, color: ability ? MENU_COLORS.ability : MENU_COLORS.dim });
  y += 34;

  drawDescription(ctx, textSection(WEAPON_TEXT, id)[0], area, y);
}

// Name, stats (DEF, MAG, SP) and description of a piece of armor. `area` is { x, y, w }.
export function drawArmorDetails(ctx, id, area = DETAILS) {
  if (wielderOf('armor', id) !== HERO) {
    drawMemberGearDetails(ctx, 'armor', id, ARMOR[id].name, ARMOR_TEXT, area);
    return;
  }
  let y = area.y;
  drawText(ctx, ARMOR[id].name, area.x, y, { size: 30 });
  y += 34;
  drawHeroMark(ctx, area, y);
  const labels = armorLabels(id);
  if (!labels.length) {
    drawText(ctx, 'No protection', area.x, y, { size: 24, color: MENU_COLORS.dim });
    y += 26;
  }
  for (const label of labels) {
    drawText(ctx, label.text, area.x, y, { size: 24, color: label.bad ? MENU_COLORS.bad : MENU_COLORS[label.stat] });
    y += 26;
  }
  y += 8;
  drawDescription(ctx, textSection(ARMOR_TEXT, id)[0], area, y);
}

// The hero's own gear says so, beside its first stat, once there's a party
// member it might otherwise be for (theirs says their name in the same spot).
function drawHeroMark(ctx, area, y) {
  if (partyIds().length) drawText(ctx, 'HERO', area.x + area.w, y, { size: 24, color: HERO_COLOR, align: 'right' });
}

// A party member's weapon or armor: its name, its stats (one a line, with
// who it's for beside the first, in their colour) and its description.
function drawMemberGearDetails(ctx, slot, id, name, textPath, area) {
  const member = MEMBERS[wielderOf(slot, id)];
  let y = area.y;
  // A long name shrinks to fit the panel.
  const size = Math.min(30, Math.floor((30 * area.w) / textWidth(ctx, name, 30)));
  drawText(ctx, name, area.x, y + (30 - size), { size });
  y += 34;
  drawText(ctx, member.name, area.x + area.w, y, { size: 24, color: member.color, align: 'right' });
  const labels = memberGearLabels(slot, id);
  if (!labels.length) {
    drawText(ctx, 'No bonus', area.x, y, { size: 24, color: MENU_COLORS.dim });
    y += 26;
  }
  for (const label of labels) {
    drawText(ctx, label.text, area.x, y, { size: 24, color: label.bad ? MENU_COLORS.bad : MENU_COLORS[label.color] });
    y += 26;
  }
  y += 8;
  drawDescription(ctx, textSection(textPath, id)[0], area, y);
}

// A description under the details, in the space left: smaller if it needs to be.
function drawDescription(ctx, text, area, y) {
  const room = area.h ? area.y + area.h - y : Infinity;
  let size = 22;
  let lines = wrapLines(ctx, text, area.w, size);
  while (size > 14 && lines.length * size > room) {
    size -= 1;
    lines = wrapLines(ctx, text, area.w, size);
  }
  drawText(ctx, lines.join('\n'), area.x, y, { size, lineHeight: size, color: MENU_COLORS.description });
}

// Name, how much it heals, and the description of one item. `area` is { x, y, w }.
export function drawItemDetails(ctx, id, area = DETAILS) {
  let y = area.y;
  drawText(ctx, ITEMS[id].name, area.x, y, { size: 30 });
  y += 34;
  drawText(ctx, healLabel(id), area.x, y, { size: 24, color: MENU_COLORS.ability });
  y += 34;
  // A candle also says how it lights the dark.
  const light = lightLabel(id);
  if (light) {
    drawText(ctx, light, area.x, y - 6, { size: 20, color: MENU_COLORS.highlight });
    y += 24;
  }
  drawDescription(ctx, textSection(ITEM_TEXT, id)[0], area, y);
}

export function drawControls(ctx, text) {
  drawText(ctx, text, MENU.x + MENU.w / 2, MENU.y + MENU.h - 34, { size: 22, color: MENU_COLORS.dim, align: 'center' });
}
