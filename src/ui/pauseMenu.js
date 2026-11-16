import { UI_WIDTH } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { inUiSpace } from '../engine/screen.js';
import { sfx } from '../audio/music.js';
import { HERO_STATE } from '../characters/heroState.js';
import { HERO_ANIMATIONS } from '../characters/hero.js';
import { expToNext, heroMaxHp, heroHp } from '../characters/progress.js';
import { WEAPONS } from '../data/weapons.js';
import { ARMOR } from '../data/armor.js';
import { ICONS } from '../data/art/icons.js';
import { soulSprite } from '../battle/soul.js';
import { drawText, textWidth, drawStyledLine } from './text.js';
import { glide, opening, bob } from './uiMotion.js';
import { AREA_NAMES } from '../data/areas.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { EquipMenu } from './equipMenu.js';
import { SkillsMenu } from './skillsMenu.js';
import { NotchMenu } from './notchMenu.js';
import { ItemsMenu } from './itemsMenu.js';
import { CandleMenu } from './candleMenu.js';
import { SettingsMenu } from './settingsMenu.js';
import { JournalMenu } from './journalMenu.js';
import { currentGoal } from './goalLine.js';
import { promptName } from '../engine/input.js';

// The menu on C in the overworld, laid out like Deltarune's: a bar of buttons
// across the top and the hero's status card along the bottom. Left/right picks
// a button, Z opens it, X or C closes.

const TABS = [
  { label: 'ITEMS', icon: 'items' },
  { label: 'EQUIP', icon: 'fight' },
  { label: 'SKILLS', icon: 'spells' },
  // Which learned spells go in each person's SPELL NOTCHES (notchMenu.js).
  { label: 'SPELLS', icon: 'notch' },
  { label: 'CANDLES', icon: 'candle' },
  { label: 'JOURNAL', icon: 'talk' },
  { label: 'OPTIONS', icon: 'sound' },
];
const BAR_HEIGHT = 96;
// Seven buttons across the bar with room between them: the icon sits centred
// above the label, so the labels don't crowd the icons.
const BUTTON = { w: 80, h: 72, gap: 8, y: 12 };
const ICON_SIZE = 20;
const LABEL_SIZE = 18;
const CARD = { x: 100, y: 330, w: 440, h: 134 };
const COLORS = {
  orange: '#ff8c1a',
  yellow: '#ffe14d',
  text: '#ffffff',
  dim: '#8a82b0',
  hero: '#4fe3d0',
  hpBack: '#6b0f1f',
  exp: '#b07cff',
  expBack: '#24153d',
};

const iconCache = new Map();
function icon(name, color) {
  const key = `${name}|${color}`;
  if (!iconCache.has(key)) iconCache.set(key, makeSprite(ICONS[name], { '#': color }));
  return iconCache.get(key);
}

function bar(ctx, x, y, w, h, fraction, fill, back) {
  ctx.fillStyle = back;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, Math.round(w * Math.min(1, Math.max(0, fraction))), h);
}

export class PauseMenu {
  constructor() {
    this.isOpen = false;
    this.tab = 0;
    this.screens = [new ItemsMenu(), new EquipMenu(), new SkillsMenu(), new NotchMenu(), new CandleMenu(), new JournalMenu(), new SettingsMenu()];
  }

  // `room` is the room you're in (its data), for the area name on the card.
  open(room = null) {
    this.isOpen = true;
    this.room = room;
  }

  openScreen() {
    return this.screens.find((screen) => screen.isOpen) ?? null;
  }

  update(input) {
    const screen = this.openScreen();
    if (screen) {
      screen.update(input);
      // X goes back to the bar; C closes the whole menu.
      if (!screen.isOpen && input.wasPressed('menu')) this.isOpen = false;
      return;
    }

    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      sfx('menuClose');
      this.isOpen = false;
      return;
    }
    const before = this.tab;
    if (input.wasPressed('right')) this.tab = (this.tab + 1) % TABS.length;
    if (input.wasPressed('left')) this.tab = (this.tab - 1 + TABS.length) % TABS.length;
    if (this.tab !== before) sfx('move');
    if (input.wasPressed('confirm')) {
      sfx('select');
      this.screens[this.tab].open();
    }
  }

  draw(ctx) {
    if (!this.isOpen) return;
    const screen = this.openScreen();
    if (screen) {
      screen.draw(ctx);
      return;
    }
    // The bar drops in from the top and the card rises from the bottom, quickly.
    const open = opening('pauseMenu', 120);
    inUiSpace(ctx, () => {
      ctx.save();
      ctx.translate(0, -Math.round((1 - open) * (BAR_HEIGHT + 3)));
      this.drawBar(ctx);
      ctx.restore();
      ctx.translate(0, Math.round((1 - open) * 160));
      this.drawStatusCard(ctx);
    });
  }

  drawBar(ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, UI_WIDTH, BAR_HEIGHT);
    ctx.fillStyle = COLORS.text;
    ctx.fillRect(0, BAR_HEIGHT, UI_WIDTH, 3);

    const totalWidth = TABS.length * BUTTON.w + (TABS.length - 1) * BUTTON.gap;
    const left = (UI_WIDTH - totalWidth) / 2;
    // A soft glow behind the chosen button slides across to the next one.
    const glow = glide('pauseTab', left + this.tab * (BUTTON.w + BUTTON.gap), BUTTON.y, 100);
    ctx.fillStyle = 'rgba(255, 225, 77, 0.12)';
    ctx.fillRect(glow.x, glow.y, BUTTON.w, BUTTON.h);
    TABS.forEach((tab, i) => {
      const x = left + i * (BUTTON.w + BUTTON.gap);
      const selected = i === this.tab;
      const color = selected ? COLORS.yellow : COLORS.orange;
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, BUTTON.y, BUTTON.w, BUTTON.h);
      const image = selected ? soulSprite() : icon(tab.icon, color);
      const w = selected ? image.width : ICON_SIZE;
      const h = selected ? image.height : ICON_SIZE;
      // The heart on the chosen button bobs a little.
      const lift = selected ? bob(2, 800) : 0;
      ctx.drawImage(image, x + (BUTTON.w - w) / 2, BUTTON.y + 12 + (ICON_SIZE - h) / 2 - lift, w, h);
      drawText(ctx, tab.label, x + BUTTON.w / 2, BUTTON.y + 42, { size: LABEL_SIZE, color, align: 'center' });
    });
  }

  // HERO's face, level, HP, EXP towards the next level, skill points, gold,
  // weapon and armor.
  drawStatusCard(ctx) {
    const { x, y, w, h } = CARD;
    ctx.fillStyle = COLORS.text;
    ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y, w, h);

    const face = HERO_ANIMATIONS.down[0];
    ctx.drawImage(face, 0, 0, face.width, 10, x + 16, y + 18, face.width * 3, 30);

    const level = HERO_STATE.level;
    const need = expToNext(level);
    const left = x + 72;
    drawText(ctx, 'HERO', left, y + 10, { size: 32, color: COLORS.hero });
    drawText(ctx, `LV ${level}`, left + 90, y + 14, { size: 26 });
    drawText(ctx, `HP ${heroHp()}/${heroMaxHp()}`, left + 170, y + 14, { size: 26 });

    drawText(ctx, 'EXP', left, y + 50, { size: 22, color: COLORS.exp });
    bar(ctx, left + 40, y + 56, 110, 10, HERO_STATE.exp / need, COLORS.exp, COLORS.expBack);
    drawText(ctx, `${HERO_STATE.exp}/${need}`, left + 158, y + 50, { size: 22, color: COLORS.dim });

    // Points waiting to be spent glow on and off, gently.
    const points = HERO_STATE.skillPoints;
    ctx.save();
    if (points) ctx.globalAlpha *= 0.7 + 0.3 * Math.sin(performance.now() / 260);
    drawText(ctx, `${points} POINT${points === 1 ? '' : 'S'}`, x + w - 16, y + 50, {
      size: 22,
      color: points ? COLORS.yellow : COLORS.dim,
      align: 'right',
    });
    ctx.restore();
    drawText(ctx, WEAPONS[HERO_STATE.weapon].name, left, y + 80, { size: 22, color: COLORS.dim });
    drawText(ctx, ARMOR[HERO_STATE.armor]?.name ?? '', left, y + 104, { size: 22, color: COLORS.dim });
    drawText(ctx, `${HERO_STATE.gold} G`, x + w - 16, y + 80, { size: 22, color: COLORS.yellow, align: 'right' });

    drawText(ctx, `${promptName('confirm')}: open     ${promptName('cancel')}: close`, UI_WIDTH / 2, BAR_HEIGHT + 12, { size: 20, color: COLORS.dim, align: 'center', outline: '#000' });

    // Where you are and which chapter, on a small tab sitting on the card's top edge.
    const area = this.room ? AREA_NAMES[this.room.titleArea ?? this.room.area] : null;
    const chapter = `CHAPTER ${WORLD_STATE.chapter ?? 1}`;
    const label = area ? `${area}   ${chapter}` : chapter;
    const labelW = textWidth(ctx, label, 20) + 20;
    ctx.fillStyle = COLORS.text;
    ctx.fillRect(x + w - labelW - 4, y - 30, labelW + 8, 30);
    ctx.fillStyle = '#000';
    ctx.fillRect(x + w - labelW, y - 26, labelW, 26);
    drawText(ctx, label, x + w - 10, y - 24, { size: 20, color: COLORS.dim, align: 'right' });

    // What you're meant to be doing (text/goals.txt): a plain line on the
    // card's top edge, left of the tab, no box of its own. It shrinks to fit
    // the room the tab leaves.
    const goal = currentGoal();
    if (goal) {
      const room = w - labelW - 24;
      const plain = goal.replace(/\{[^}]*\}/g, '');
      const size = Math.max(14, Math.min(20, Math.floor((20 * room) / Math.max(1, textWidth(ctx, plain, 20)))));
      // Still too long even small (a long place name on the tab): it goes up a line, over the tab, instead of under it.
      const fits = textWidth(ctx, plain, size) <= room;
      if (fits) drawStyledLine(ctx, goal, x + 6, y - 24 + (20 - size), { size, color: COLORS.text, outline: '#000' });
      else drawStyledLine(ctx, goal, x + 6, y - 52, { size: 20, color: COLORS.text, outline: '#000' });
    }
  }
}
