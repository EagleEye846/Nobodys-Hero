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
import { drawText } from './text.js';
import { EquipMenu } from './equipMenu.js';
import { SkillsMenu } from './skillsMenu.js';
import { ItemsMenu } from './itemsMenu.js';
import { CandleMenu } from './candleMenu.js';
import { SettingsMenu } from './settingsMenu.js';

// The menu on C in the overworld, laid out like Deltarune's: a bar of buttons
// across the top and the hero's status card along the bottom. Left/right picks
// a button, Z opens it, X or C closes.

const TABS = [
  { label: 'ITEMS', icon: 'items' },
  { label: 'EQUIP', icon: 'fight' },
  { label: 'SKILLS', icon: 'spells' },
  { label: 'CANDLES', icon: 'candle' },
  { label: 'SETTINGS', icon: 'sound' },
];
const BAR_HEIGHT = 84;
// Five buttons across the bar, so they're a little narrower than they were
// with four, and their labels a little smaller.
const BUTTON = { w: 118, h: 58, gap: 6, y: 13 };
const LABEL_SIZE = 24;
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
    this.screens = [new ItemsMenu(), new EquipMenu(), new SkillsMenu(), new CandleMenu(), new SettingsMenu()];
  }

  open() {
    this.isOpen = true;
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
      sfx('back');
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
    inUiSpace(ctx, () => {
      this.drawBar(ctx);
      this.drawStatusCard(ctx);
    });
  }

  drawBar(ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, UI_WIDTH, BAR_HEIGHT);
    ctx.fillStyle = COLORS.text;
    ctx.fillRect(0, BAR_HEIGHT, UI_WIDTH, 3);

    const totalWidth = TABS.length * BUTTON.w + (TABS.length - 1) * BUTTON.gap;
    TABS.forEach((tab, i) => {
      const x = (UI_WIDTH - totalWidth) / 2 + i * (BUTTON.w + BUTTON.gap);
      const selected = i === this.tab;
      const color = selected ? COLORS.yellow : COLORS.orange;
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, BUTTON.y, BUTTON.w, BUTTON.h);
      const image = selected ? soulSprite() : icon(tab.icon, color);
      const size = selected ? image.width : 18;
      ctx.drawImage(image, x + 10, BUTTON.y + (BUTTON.h - size) / 2, size, selected ? image.height : 18);
      drawText(ctx, tab.label, x + 34, BUTTON.y + 17, { size: LABEL_SIZE, color });
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

    const points = HERO_STATE.skillPoints;
    drawText(ctx, `${points} POINT${points === 1 ? '' : 'S'}`, x + w - 16, y + 50, {
      size: 22,
      color: points ? COLORS.yellow : COLORS.dim,
      align: 'right',
    });
    drawText(ctx, WEAPONS[HERO_STATE.weapon].name, left, y + 80, { size: 22, color: COLORS.dim });
    drawText(ctx, ARMOR[HERO_STATE.armor]?.name ?? '', left, y + 104, { size: 22, color: COLORS.dim });
    drawText(ctx, `${HERO_STATE.gold} G`, x + w - 16, y + 80, { size: 22, color: COLORS.yellow, align: 'right' });

    drawText(ctx, 'Z: open     X: close', UI_WIDTH / 2, BAR_HEIGHT + 12, { size: 20, color: COLORS.dim, align: 'center', outline: '#000' });
  }
}
