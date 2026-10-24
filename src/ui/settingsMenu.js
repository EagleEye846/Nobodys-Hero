import { inUiSpace } from '../engine/screen.js';
import { music, sfx } from '../audio/music.js';
import { SETTINGS, saveSettings } from '../state/settings.js';
import { soulSprite } from '../battle/soul.js';
import { drawMenuFrame, drawControls, MENU, MENU_COLORS } from './menuFrame.js';
import { drawText } from './text.js';

// The SETTINGS screen, in the C menu and on the title screen: how loud the
// music is (songs and the sounds of a place), and how loud the sound
// effects. Up and down picks one, left and right turn it down or up a step,
// and it's remembered for next time (src/state/settings.js).

const SLIDERS = [
  { key: 'music', label: 'MUSIC' },
  { key: 'sounds', label: 'SOUND EFFECTS' },
];
// Ten steps from off to full.
const STEP = 0.1;
const ROW = { x: MENU.x + 60, y: MENU.y + 110, gap: 90 };
const BAR = { x: MENU.x + 60, w: 360, h: 18, notches: 10 };

export class SettingsMenu {
  constructor() {
    this.isOpen = false;
    this.cursor = 0;
  }

  open() {
    this.isOpen = true;
    this.cursor = 0;
  }

  update(input) {
    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      sfx('back');
      saveSettings();
      this.isOpen = false;
      return;
    }
    const before = this.cursor;
    if (input.wasPressed('down')) this.cursor = (this.cursor + 1) % SLIDERS.length;
    if (input.wasPressed('up')) this.cursor = (this.cursor - 1 + SLIDERS.length) % SLIDERS.length;
    if (this.cursor !== before) sfx('move');
    const turn = (input.wasPressed('right') ? 1 : 0) - (input.wasPressed('left') ? 1 : 0);
    if (turn) {
      const { key } = SLIDERS[this.cursor];
      const value = Math.round((SETTINGS[key] + turn * STEP) * 10) / 10;
      music.setVolume(key, value);
      saveSettings();
      // A blip to hear how loud the sound effects are now.
      sfx('move');
    }
  }

  draw(ctx) {
    if (!this.isOpen) return;
    inUiSpace(ctx, () => {
      drawMenuFrame(ctx, 'SETTINGS', '', { split: false });
      SLIDERS.forEach(({ key, label }, i) => {
        const y = ROW.y + i * ROW.gap;
        const selected = i === this.cursor;
        if (selected) ctx.drawImage(soulSprite(), ROW.x - 34, y + 6);
        drawText(ctx, label, ROW.x, y, { size: 30, color: selected ? MENU_COLORS.highlight : MENU_COLORS.text });
        const value = SETTINGS[key];
        drawText(ctx, value <= 0 ? 'OFF' : `${Math.round(value * 100)}%`, BAR.x + BAR.w, y + 4, { size: 26, color: selected ? MENU_COLORS.highlight : MENU_COLORS.dim, align: 'right' });
        this.drawBar(ctx, BAR.x, y + 42, value, selected);
      });
      drawText(ctx, 'M turns all the sound off and on, any time.', ROW.x, ROW.y + SLIDERS.length * ROW.gap + 10, { size: 22, color: MENU_COLORS.dim });
      drawControls(ctx, 'Up/down: choose     Left/right: change     X: close');
    });
  }

  // The slider: a row of notches, lit up to the volume.
  drawBar(ctx, x, y, value, selected) {
    const notchW = BAR.w / BAR.notches;
    const lit = Math.round(value * BAR.notches);
    for (let i = 0; i < BAR.notches; i++) {
      ctx.fillStyle = i < lit ? (selected ? MENU_COLORS.highlight : MENU_COLORS.text) : MENU_COLORS.divider;
      ctx.fillRect(Math.round(x + i * notchW) + 2, y, Math.round(notchW) - 4, BAR.h);
    }
  }
}
