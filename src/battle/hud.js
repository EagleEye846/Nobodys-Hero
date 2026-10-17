import { UI_WIDTH, UI_HEIGHT, UI_SCALE as S } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { drawText, textWidth, wrapLines, layoutDialogue, drawDialogue, paginate } from '../ui/text.js';
import { ICONS } from '../data/art/icons.js';
import { soulSprite } from './soul.js';

// Battle UI, drawn in UI space (640x480) so it's finer than the pixel-art world.
// Everything here is drawing only; battle rules live in battleScene.js.

// In world units: the animated stage above the panel, and the box the soul dodges in.
export const STAGE_HEIGHT = 164;
export const BOX = { x: 120, y: 44, w: 80, h: 80 };

export const COLORS = {
  text: '#ffffff',
  dim: '#7d7590',
  cardFill: '#0c0816',
  cardIdle: '#33304a',
  panelLine: '#2b2140',
  orange: '#ff8c1a',
  orangeDim: '#5a3612',
  yellow: '#ffe14d',
  hpBack: '#6b0f1f',
  danger: '#ff5470',
  enemyHp: '#3ee08f',
  calm: '#ffe14d',
  calmBack: '#4a3a0a',
  sp: '#b07cff',
  spFull: '#e6d4ff',
  spBack: '#24153d',
  box: '#35d46c',
  teal: '#4fe3d0',
  outline: '#000000',
};

const PANEL_TOP = STAGE_HEIGHT * S;
const PARTY_CARD = { x: 10, y: 338, w: 206, h: 46 };
const BUTTON = { x: 226, y: 340, w: 62, h: 42, gap: 5 };
const TEXT = { x: 24, y: 396, w: 596, size: 28, lineHeight: 27 };
const SP_GAUGE = { x: 36, y: 84, w: 20, h: 196 };
const BUBBLE = { w: 164, h: 64 };
const ICON_SIZE = 18;

const iconCache = new Map();
function icon(name, color) {
  const key = `${name}|${color}`;
  if (!iconCache.has(key)) iconCache.set(key, makeSprite(ICONS[name], { '#': color }));
  return iconCache.get(key);
}

const blink = (time, rate = 4) => Math.floor(time * rate) % 2 === 0;

function outlineRect(ctx, x, y, w, h, color, width) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, width);
  ctx.fillRect(x, y + h - width, w, width);
  ctx.fillRect(x, y, width, h);
  ctx.fillRect(x + w - width, y, width, h);
}

function bar(ctx, x, y, w, h, fraction, fill, back) {
  ctx.fillStyle = back;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, Math.round(w * Math.min(1, Math.max(0, fraction))), h);
}

// The box in UI coordinates, unfolding from its centre as `open` goes 0..1.
export function boxRect(open = 1) {
  const w = Math.max(6, Math.round(BOX.w * S * open));
  const h = Math.max(6, Math.round(BOX.h * S * open));
  return { x: BOX.x * S + Math.round((BOX.w * S - w) / 2), y: BOX.y * S + Math.round((BOX.h * S - h) / 2), w, h };
}

export function drawBoxBack(ctx, open) {
  const r = boxRect(open);
  ctx.fillStyle = '#000';
  ctx.fillRect(r.x, r.y, r.w, r.h);
}

export function drawBoxBorder(ctx, open) {
  const r = boxRect(open);
  outlineRect(ctx, r.x - 3, r.y - 3, r.w + 6, r.h + 6, COLORS.box, 3);
}

// The weapon's SHIFT ability under the box: a recharge bar and its label,
// lit when it's ready to use.
export function drawAbility(ctx, label, readiness) {
  const x = BOX.x * S;
  const y = (BOX.y + BOX.h) * S + 10;
  const w = BOX.w * S;
  const ready = readiness >= 1;
  const color = ready ? COLORS.teal : COLORS.dim;
  bar(ctx, x, y, w, 4, readiness, color, '#1a1426');
  drawText(ctx, label, x + w / 2, y + 8, { size: 20, color, align: 'center', outline: COLORS.outline });
}

// The SP (spell power) gauge down the left edge, filling from the bottom.
export function drawSpGauge(ctx, sp, time) {
  const { x, y, w, h } = SP_GAUGE;
  drawText(ctx, 'S\nP', 18, y + 70, { size: 30, lineHeight: 26, color: COLORS.sp, align: 'center', outline: COLORS.outline });
  ctx.fillStyle = COLORS.outline;
  ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
  ctx.fillStyle = COLORS.spBack;
  ctx.fillRect(x, y, w, h);
  const filled = Math.round((h * Math.min(100, sp)) / 100);
  ctx.fillStyle = sp >= 100 && blink(time) ? COLORS.spFull : COLORS.sp;
  ctx.fillRect(x, y + h - filled, w, filled);
  drawText(ctx, `${Math.floor(sp)}%`, x + w / 2, y + h + 8, { size: 24, color: COLORS.sp, align: 'center', outline: COLORS.outline });
}

// Name, HP and MERCY under the enemy, centred on cx. (MERCY is stored as `calm`.)
export function drawEnemyStatus(ctx, name, hp, maxHp, calm, cx, top, time) {
  const w = 100;
  const x = Math.round(cx - w / 2);
  drawText(ctx, name, cx, top, { size: 24, align: 'center', outline: COLORS.outline });
  bar(ctx, x, top + 26, w, 8, hp / maxHp, COLORS.enemyHp, COLORS.hpBack);
  bar(ctx, x, top + 40, w, 8, calm / 100, calm >= 100 && blink(time) ? COLORS.text : COLORS.calm, COLORS.calmBack);
  drawText(ctx, `MERCY ${calm}%`, cx, top + 52, { size: 20, color: COLORS.calm, align: 'center', outline: COLORS.outline });
}

// The speaking enemy's taunt in a white speech bubble, in a smaller, smoother
// font. The bubble sits to the left of (tipX, tipY), with its tail pointing
// there, and keeps above `clearBelow` (the top of the enemy's name and bars).
export function drawSpeech(ctx, text, tipX, tipY, clearBelow = PANEL_TOP) {
  const { w, h } = BUBBLE;
  const x = Math.max(8, tipX - 16 - w);
  const y = Math.min(Math.max(8, tipY - 30), PANEL_TOP - h - 8, clearBelow - h - 6);
  const tailY = Math.min(Math.max(tipY, y + 12), y + h - 12);
  ctx.fillStyle = COLORS.text;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, 10);
  else ctx.rect(x, y, w, h);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + w - 1, tailY - 9);
  ctx.lineTo(x + w + 16, tailY);
  ctx.lineTo(x + w - 1, tailY + 6);
  ctx.fill();
  const lines = wrapLines(ctx, text, w - 22, 14, 'speech');
  drawText(ctx, lines.join('\n'), x + 11, y + 10, { size: 14, lineHeight: 17, font: 'speech', color: '#1a1424' });
}

// A compact name, HP bar and MERCY bar for one of several enemies, right-aligned to `right`.
export function drawEnemyMini(ctx, name, hp, maxHp, calm, right, top, time) {
  const w = 84;
  drawText(ctx, name, right, top, { size: 18, align: 'right', outline: COLORS.outline });
  bar(ctx, right - w, top + 20, w, 6, hp / maxHp, COLORS.enemyHp, COLORS.hpBack);
  bar(ctx, right - w, top + 30, w, 5, calm / 100, calm >= 100 && blink(time) ? COLORS.text : COLORS.calm, COLORS.calmBack);
}

// Picking which enemy to act on, Deltarune style: each one's name with its HP
// and MERCY. Each foe is { name, hp, maxHp, calm }.
export function drawTargets(ctx, foes, cursor, time) {
  foes.forEach((foe, i) => {
    const y = TEXT.y + i * 27;
    const selected = i === cursor;
    if (selected) ctx.drawImage(soulSprite(), TEXT.x + 8, y + 5);
    drawText(ctx, foe.name, TEXT.x + 36, y, { size: TEXT.size, color: selected ? COLORS.yellow : COLORS.text });
    drawText(ctx, 'HP', TEXT.x + 296, y + 4, { size: 20, color: COLORS.enemyHp });
    bar(ctx, TEXT.x + 322, y + 9, 100, 10, foe.hp / foe.maxHp, COLORS.enemyHp, COLORS.hpBack);
    drawText(ctx, 'MERCY', TEXT.x + 432, y + 4, { size: 20, color: COLORS.calm });
    const calmColor = foe.calm >= 100 && blink(time) ? COLORS.text : COLORS.calm;
    bar(ctx, TEXT.x + 478, y + 9, 100, 10, foe.calm / 100, calmColor, COLORS.calmBack);
  });
}

export function drawPanel(ctx) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, PANEL_TOP, UI_WIDTH, UI_HEIGHT - PANEL_TOP);
  ctx.fillStyle = COLORS.panelLine;
  ctx.fillRect(0, PANEL_TOP, UI_WIDTH, 2);
}

// One party member's face, name and HP. The acting member's card lights up in their colour.
export function drawPartyCard(ctx, member, active) {
  const { x, y, w, h } = PARTY_CARD;
  ctx.fillStyle = COLORS.cardFill;
  ctx.fillRect(x, y, w, h);
  outlineRect(ctx, x, y, w, h, active ? member.color : COLORS.cardIdle, 2);

  // The face is the top of their sprite.
  const sprite = member.sprite;
  ctx.drawImage(sprite, 0, 0, sprite.width, 9, x + 8, y + 14, sprite.width * 2, 18);

  drawText(ctx, member.name, x + 42, y + 4, { size: 26, color: active ? member.color : COLORS.text });
  drawText(ctx, `LV${member.level}`, x + w - 8, y + 6, { size: 20, color: COLORS.dim, align: 'right' });
  drawText(ctx, 'HP', x + 42, y + 24, { size: 20, color: member.color });
  const low = member.hp / member.maxHp < 0.3;
  bar(ctx, x + 66, y + 29, 74, 9, member.hp / member.maxHp, low ? COLORS.danger : member.color, COLORS.hpBack);
  drawText(ctx, `${member.hp}/${member.maxHp}`, x + w - 8, y + 24, { size: 20, align: 'right' });
}

// The command buttons. The selected one swaps its icon for the soul, like Deltarune.
// `glowing` ones blink to draw your eye; `disabled` ones (like RUN in a boss
// fight) stay dim.
export function drawCommands(ctx, commands, selected, active, glowing, time, disabled = []) {
  commands.forEach((command, i) => {
    const x = BUTTON.x + i * (BUTTON.w + BUTTON.gap);
    const y = BUTTON.y;
    const isSelected = active && i === selected;
    let color = active && !disabled.includes(command.label) ? COLORS.orange : COLORS.orangeDim;
    if (glowing.includes(command.label) && blink(time)) color = COLORS.yellow;
    if (isSelected) color = COLORS.yellow;

    ctx.fillStyle = '#000';
    ctx.fillRect(x, y, BUTTON.w, BUTTON.h);
    outlineRect(ctx, x, y, BUTTON.w, BUTTON.h, color, 2);
    if (isSelected) {
      const soul = soulSprite();
      ctx.drawImage(soul, Math.round(x + (BUTTON.w - soul.width) / 2), y + 4);
    } else {
      ctx.drawImage(icon(command.icon, color), x + (BUTTON.w - ICON_SIZE) / 2, y + 4, ICON_SIZE, ICON_SIZE);
    }
    drawText(ctx, command.label, x + BUTTON.w / 2, y + 22, { size: 20, color, align: 'center' });
  });
}

// How many lines of dialogue fit in the panel, and `text` split into pages
// that fit (so a long message carries on onto another page).
export const TEXT_LINES = 3;
let measuring = null;
export function textPages(text) {
  measuring ??= document.createElement('canvas').getContext('2d');
  return paginate(measuring, text, TEXT.w, TEXT.size, TEXT_LINES);
}

// Dialogue in the panel, Deltarune style ("* " before each paragraph).
export function drawTextBox(ctx, text) {
  const lines = layoutDialogue(ctx, text, TEXT.w, TEXT.size);
  drawDialogue(ctx, lines, TEXT.x, TEXT.y, { size: TEXT.size, lineHeight: TEXT.lineHeight });
}

// A two-column pick list with the soul as the cursor. Each option is { label, note, noteColor, enabled }.
// Three rows fit in the panel; a longer list scrolls with the cursor. A label
// too long for its column shrinks to fit.
const OPTION_ROWS = 3;
const OPTION_WIDTH = 258;
export function drawOptions(ctx, options, cursor) {
  const rows = Math.ceil(options.length / 2);
  const firstRow = Math.max(0, Math.min(Math.floor(cursor / 2) - 1, rows - OPTION_ROWS));
  options.slice(firstRow * 2, (firstRow + OPTION_ROWS) * 2).forEach((option, n) => {
    const i = firstRow * 2 + n;
    const x = TEXT.x + 36 + (i % 2) * 300;
    const y = TEXT.y + (Math.floor(i / 2) - firstRow) * 30;
    if (i === cursor) ctx.drawImage(soulSprite(), x - 28, y + 4);
    const noteWidth = option.note ? textWidth(ctx, option.note, 22) + 12 : 0;
    const size = Math.min(TEXT.size, Math.floor((TEXT.size * (OPTION_WIDTH - noteWidth)) / textWidth(ctx, option.label, TEXT.size)));
    drawText(ctx, option.label, x, y + (TEXT.size - size), { size, color: option.enabled ? COLORS.text : COLORS.dim });
    if (option.note) {
      const noteX = x + textWidth(ctx, option.label, size) + 12;
      drawText(ctx, option.note, noteX, y + 4, { size: 22, color: option.noteColor ?? COLORS.sp });
    }
  });
  if (firstRow > 0) drawText(ctx, '▲', TEXT.x + TEXT.w - 14, TEXT.y - 4, { size: 18, color: COLORS.dim });
  if (firstRow + OPTION_ROWS < rows) drawText(ctx, '▼', TEXT.x + TEXT.w - 14, TEXT.y + 64, { size: 18, color: COLORS.dim });
}
