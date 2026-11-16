import { inUiSpace } from '../engine/screen.js';
import { music, sfx } from '../audio/music.js';
import { SETTINGS, FLASH_STEPS, RUN_STEPS, LOW_HP_STEPS, saveSettings } from '../state/settings.js';
import { DEFAULT_KEYS, RESERVED_KEYS, keyFor, keyName, refreshBindings, promptName, isFullscreen, toggleFullscreen } from '../engine/input.js';
import { soulSprite } from '../battle/soul.js';
import { drawMenuFrame, drawControls, MENU, MENU_COLORS } from './menuFrame.js';
import { drawText } from './text.js';
import { glide } from './uiMotion.js';
import { exportSaves, readImport, applyImport, pickSaveFile } from '../state/saveTransfer.js';

// The OPTIONS screen, in the C menu and on the title screen: how loud the
// music is (songs and the sounds of a place), how loud the sound effects are,
// how fast words type out, whether they blip as they do (TEXT SOUNDS: the
// talking voices), whether the screen shakes, how bright the storm's
// lightning flashes (ON, SOFT or OFF, for anyone bright flashes bother),
// whether running is held or tapped on and off (RUN), how a fight warns you
// you're low on HP, fullscreen, which keys do what, and SAVE FILE (moving
// your saves to another browser or address: src/state/saveTransfer.js).
// Up and down picks one, left and right turn it, and it's all remembered for
// next time (src/state/settings.js).

// Words typing out: the steps of the TEXT SPEED row, slowest to quickest.
// (INSTANT shows the whole page at once.)
const TEXT_SPEEDS = [{ value: 0.6, name: 'SLOW' }, { value: 1, name: 'NORMAL' }, { value: 2, name: 'FAST' }, { value: 1000, name: 'INSTANT' }];
const ROWS = [
  { key: 'music', label: 'MUSIC', kind: 'volume' },
  { key: 'sounds', label: 'SOUND EFFECTS', kind: 'volume' },
  { key: 'textSpeed', label: 'TEXT SPEED', kind: 'speed' },
  { key: 'textSounds', label: 'TEXT SOUNDS', kind: 'toggle' },
  { key: 'shake', label: 'SCREEN SHAKE', kind: 'toggle' },
  { key: 'flashes', label: 'LIGHTNING FLASHES', kind: 'steps', steps: FLASH_STEPS },
  { key: 'runMode', label: 'RUN', kind: 'steps', steps: RUN_STEPS },
  { key: 'lowHp', label: 'LOW HP WARNING', kind: 'steps', steps: LOW_HP_STEPS },
  { key: 'fullscreen', label: 'FULLSCREEN', kind: 'fullscreen' },
  { key: 'keys', label: 'CONTROLS', kind: 'keys' },
  { key: 'saves', label: 'SAVE FILE', kind: 'saves' },
];
// The SAVE FILE page.
const SAVE_ROWS = [
  { id: 'export', label: 'EXPORT SAVE' },
  { id: 'import', label: 'IMPORT SAVE' },
];
// The keys you can change, in two columns on the CONTROLS page.
const KEY_ROWS = [
  { action: 'up', label: 'UP' }, { action: 'down', label: 'DOWN' },
  { action: 'left', label: 'LEFT' }, { action: 'right', label: 'RIGHT' },
  { action: 'jump', label: 'JUMP' }, { action: 'skip', label: 'SKIP SCENE' },
  { action: 'confirm', label: 'CONFIRM' }, { action: 'cancel', label: 'CANCEL' },
  { action: 'menu', label: 'MENU' }, { action: 'swap', label: 'COMPANION' },
  { action: 'swapB', label: 'BRAMBLE' }, { action: 'regroup', label: 'REGROUP' },
  { action: null, label: 'RESET ALL' },
];
const PER_COLUMN = 7;
// Ten steps from off to full.
const STEP = 0.1;
const ROW = { x: MENU.x + 60, y: MENU.y + 66, gap: 22 };
const BAR = { x: MENU.x + 290, w: 140, h: 16 };
const VALUE_X = MENU.x + MENU.w - 24;
const KEYS = { y: MENU.y + 84, gap: 36, columns: [MENU.x + 64, MENU.x + 310], width: 230 };

// The step of TEXT SPEED nearest to a speed (one saved by an older version
// might be none of them exactly).
function speedIndex(value) {
  let best = 0;
  TEXT_SPEEDS.forEach((step, i) => {
    if (Math.abs(Math.log(step.value / value)) < Math.abs(Math.log(TEXT_SPEEDS[best].value / value))) best = i;
  });
  return best;
}

// The key now doing an action, as the footers show it.
function hint(action) {
  return promptName(action);
}

export class SettingsMenu {
  constructor() {
    this.isOpen = false;
    this.cursor = 0;
    // On the CONTROLS page, and waiting for a key to give the chosen action.
    this.page = 'main';
    this.keyCursor = 0;
    this.waiting = false;
    this.note = '';
    // SAVE FILE: the chosen row, a checked file waiting for a yes
    // ({ data, summary }), and whether the file picker is open.
    this.saveCursor = 0;
    this.pending = null;
    this.picking = false;
  }

  open() {
    this.saveCursor = 0;
    this.pending = null;
    this.picking = false;
    this.isOpen = true;
    this.cursor = 0;
    this.page = 'main';
    this.keyCursor = 0;
    this.waiting = false;
    this.note = '';
  }

  close(input) {
    sfx('back');
    saveSettings();
    this.isOpen = false;
    this.waiting = false;
    if (input) input.capture = false;
  }

  update(input) {
    if (this.page === 'keys') {
      this.updateKeys(input);
      return;
    }
    if (this.page === 'saves') {
      this.updateSaves(input);
      return;
    }
    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      this.close(input);
      return;
    }
    const before = this.cursor;
    if (input.wasPressed('down')) this.cursor = (this.cursor + 1) % ROWS.length;
    if (input.wasPressed('up')) this.cursor = (this.cursor - 1 + ROWS.length) % ROWS.length;
    if (this.cursor !== before) sfx('move');
    const row = ROWS[this.cursor];
    const turn = (input.wasPressed('right') ? 1 : 0) - (input.wasPressed('left') ? 1 : 0);
    if (row.kind === 'keys' || row.kind === 'saves') {
      if (input.wasPressed('confirm') || turn > 0) {
        sfx('select');
        this.page = row.kind;
        this.keyCursor = 0;
        this.saveCursor = 0;
        this.pending = null;
        this.note = '';
      }
    } else if (row.kind === 'toggle') {
      if (turn || input.wasPressed('confirm')) {
        SETTINGS[row.key] = !SETTINGS[row.key];
        saveSettings();
        // Text sounds back on: one blip of a voice, to hear it.
        sfx(row.key === 'textSounds' && SETTINGS.textSounds ? 'voiceMid' : 'move');
      }
    } else if (row.kind === 'steps') {
      if (turn || input.wasPressed('confirm')) {
        const { steps } = row;
        const at = steps.indexOf(SETTINGS[row.key]);
        SETTINGS[row.key] = steps[(at + (turn || 1) + steps.length) % steps.length];
        saveSettings();
        // The low HP warning back on: one beat of it, to hear it.
        sfx(row.key === 'lowHp' && SETTINGS.lowHp === 'on' ? 'heartbeat' : 'move');
      }
    } else if (row.kind === 'fullscreen') {
      // (Not saved: the browser decides, and asks each time.)
      if (turn || input.wasPressed('confirm')) {
        toggleFullscreen();
        sfx('move');
      }
    } else if (turn && row.kind === 'speed') {
      const next = Math.max(0, Math.min(TEXT_SPEEDS.length - 1, speedIndex(SETTINGS.textSpeed) + turn));
      SETTINGS.textSpeed = TEXT_SPEEDS[next].value;
      saveSettings();
      sfx('move');
    } else if (turn) {
      const value = Math.round((SETTINGS[row.key] + turn * STEP) * 10) / 10;
      music.setVolume(row.key, value);
      saveSettings();
      // A blip to hear how loud the sound effects are now.
      sfx('move');
    }
  }

  // The CONTROLS page: pick an action, press Z, then the key to give it.
  updateKeys(input) {
    if (this.waiting) {
      const code = input.captured;
      if (!code) return;
      input.captured = null;
      input.capture = false;
      this.waiting = false;
      this.giveKey(KEY_ROWS[this.keyCursor].action, code);
      return;
    }
    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      sfx('back');
      saveSettings();
      this.page = 'main';
      return;
    }
    const before = this.keyCursor;
    const column = Math.floor(this.keyCursor / PER_COLUMN);
    const row = this.keyCursor % PER_COLUMN;
    const length = Math.min(PER_COLUMN, KEY_ROWS.length - column * PER_COLUMN);
    if (input.wasPressed('down')) this.keyCursor = column * PER_COLUMN + (row + 1) % length;
    if (input.wasPressed('up')) this.keyCursor = column * PER_COLUMN + (row + length - 1) % length;
    if (input.wasPressed('left') || input.wasPressed('right')) {
      const other = 1 - column;
      this.keyCursor = other * PER_COLUMN + Math.min(row, Math.min(PER_COLUMN, KEY_ROWS.length - other * PER_COLUMN) - 1);
    }
    if (this.keyCursor !== before) {
      sfx('move');
      this.note = '';
    }
    if (input.wasPressed('confirm')) {
      const { action } = KEY_ROWS[this.keyCursor];
      sfx('select');
      if (action === null) {
        SETTINGS.keys = {};
        refreshBindings();
        saveSettings();
        this.note = 'Every key is back to how it started.';
      } else {
        this.waiting = true;
        this.note = '';
        input.captured = null;
        input.capture = true;
      }
    }
  }

  // The SAVE FILE page: EXPORT SAVE downloads every save as one file;
  // IMPORT SAVE picks a file, says what's in it, and asks before it replaces
  // anything. After an import the page reloads, so the game starts fresh
  // from the title with the imported save.
  updateSaves(input) {
    if (this.picking) return;
    if (this.pending) {
      if (input.wasPressed('confirm')) {
        const result = applyImport(this.pending.data);
        this.pending = null;
        if (result.ok) {
          sfx('select');
          this.note = 'Save imported. Starting again...';
          this.picking = true;
          setTimeout(() => location.reload(), 600);
        } else {
          sfx('back');
          this.note = result.error;
        }
      } else if (input.wasPressed('cancel') || input.wasPressed('menu')) {
        sfx('back');
        this.pending = null;
        this.note = 'Left as it was.';
      }
      return;
    }
    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      sfx('back');
      this.page = 'main';
      this.note = '';
      return;
    }
    const before = this.saveCursor;
    if (input.wasPressed('down')) this.saveCursor = (this.saveCursor + 1) % SAVE_ROWS.length;
    if (input.wasPressed('up')) this.saveCursor = (this.saveCursor - 1 + SAVE_ROWS.length) % SAVE_ROWS.length;
    if (this.saveCursor !== before) {
      sfx('move');
      this.note = '';
    }
    if (!input.wasPressed('confirm')) return;
    if (SAVE_ROWS[this.saveCursor].id === 'export') {
      const result = exportSaves();
      sfx(result.ok ? 'select' : 'back');
      this.note = result.ok ? `Exported ${result.saves} save${result.saves > 1 ? 's' : ''} to your downloads.` : result.error;
      return;
    }
    sfx('select');
    this.picking = true;
    this.note = 'Pick a save file...';
    pickSaveFile().then((text) => {
      this.picking = false;
      if (text === null) {
        this.note = '';
        return;
      }
      const checked = readImport(text);
      if (!checked.ok) {
        sfx('back');
        this.note = `${checked.error} Nothing was changed.`;
        return;
      }
      this.pending = checked;
      this.note = '';
    });
  }

  // `code` is now the key for `action`. A key another action had changes
  // hands: that action gets this one's old key, so nothing is left without.
  giveKey(action, code) {
    if (code === 'Escape') {
      sfx('back');
      this.note = 'Left as it was.';
      return;
    }
    if (RESERVED_KEYS.includes(code)) {
      sfx('back');
      this.note = 'That key is kept for something else. Try another.';
      return;
    }
    const old = keyFor(action);
    // (MENU and SKIP can share a key: they start on C together.)
    const pair = (a, b) => (a === 'menu' && b === 'skip') || (a === 'skip' && b === 'menu');
    const other = Object.keys(DEFAULT_KEYS).find((id) => id !== action && !pair(id, action) && keyFor(id) === code);
    SETTINGS.keys = { ...SETTINGS.keys, [action]: code };
    if (other) SETTINGS.keys[other] = old;
    // SKIP only ever shares a key with MENU: anything else taking its key sends it to the old one.
    if (action !== 'skip' && action !== 'menu' && keyFor('skip') === code) SETTINGS.keys.skip = old;
    refreshBindings();
    saveSettings();
    sfx('select');
    this.note = other ? `${KEY_ROWS.find((r) => r.action === other).label} had it, so it takes ${keyName(old)}.` : '';
  }

  draw(ctx) {
    if (!this.isOpen) return;
    inUiSpace(ctx, () => {
      drawMenuFrame(ctx, 'OPTIONS', { keys: 'CONTROLS', saves: 'SAVE FILE' }[this.page] ?? '', { split: false });
      if (this.page === 'keys') this.drawKeys(ctx);
      else if (this.page === 'saves') this.drawSaves(ctx);
      else this.drawMain(ctx);
    });
  }

  drawMain(ctx) {
    ROWS.forEach(({ key, label, kind }, i) => {
      const y = ROW.y + i * ROW.gap;
      const selected = i === this.cursor;
      const color = selected ? MENU_COLORS.highlight : MENU_COLORS.text;
      const dim = selected ? MENU_COLORS.highlight : MENU_COLORS.dim;
      if (selected) {
        const at = glide('settingsRows', ROW.x - 34, y + 4);
        ctx.drawImage(soulSprite(), at.x, at.y);
      }
      drawText(ctx, label, ROW.x, y, { size: 26, color });
      if (kind === 'volume') {
        const value = SETTINGS[key];
        drawText(ctx, value <= 0 ? 'OFF' : `${Math.round(value * 100)}%`, VALUE_X, y + 3, { size: 24, color: dim, align: 'right' });
        this.drawBar(ctx, BAR.x, y + 6, value, selected);
      } else if (kind === 'speed') {
        const at = speedIndex(SETTINGS.textSpeed);
        drawText(ctx, TEXT_SPEEDS[at].name, VALUE_X, y + 3, { size: 24, color: dim, align: 'right' });
        this.drawBar(ctx, BAR.x, y + 6, (at + 1) / TEXT_SPEEDS.length, selected, TEXT_SPEEDS.length);
      } else if (kind === 'toggle') {
        drawText(ctx, SETTINGS[key] ? 'ON' : 'OFF', VALUE_X, y + 3, { size: 24, color: dim, align: 'right' });
      } else if (kind === 'steps') {
        drawText(ctx, String(SETTINGS[key]).toUpperCase(), VALUE_X, y + 3, { size: 24, color: dim, align: 'right' });
      } else if (kind === 'fullscreen') {
        drawText(ctx, isFullscreen() ? 'ON' : 'OFF', VALUE_X, y + 3, { size: 24, color: dim, align: 'right' });
      } else {
        drawText(ctx, '>', VALUE_X, y + 3, { size: 24, color: dim, align: 'right' });
      }
    });
    drawText(ctx, 'M: all sound off and on.  F: fullscreen.  Any time.', ROW.x, MENU.y + 344, { size: 20, color: MENU_COLORS.dim });
    drawControls(ctx, `Up/down: choose     Left/right: change     ${hint('cancel')}: close`);
  }

  drawKeys(ctx) {
    KEY_ROWS.forEach(({ action, label }, i) => {
      const column = Math.floor(i / PER_COLUMN);
      const x = KEYS.columns[column];
      const y = KEYS.y + (i % PER_COLUMN) * KEYS.gap;
      const selected = i === this.keyCursor;
      const color = selected ? MENU_COLORS.highlight : MENU_COLORS.text;
      if (selected) {
        const at = glide('settingsKeys', x - 34, y + 4);
        ctx.drawImage(soulSprite(), at.x, at.y);
      }
      drawText(ctx, label, x, y, { size: 26, color });
      if (action === null) return;
      const waiting = selected && this.waiting;
      drawText(ctx, waiting ? 'PRESS KEY' : keyName(keyFor(action)), x + KEYS.width, y + 2, {
        size: 24,
        color: waiting ? MENU_COLORS.highlight : selected ? MENU_COLORS.highlight : MENU_COLORS.dim,
        align: 'right',
      });
    });
    if (this.note) drawText(ctx, this.note, MENU.x + 24, MENU.y + 330, { size: 22, color: MENU_COLORS.dim });
    else drawText(ctx, 'Esc leaves a key as it is. Other keys still work as well.', MENU.x + 24, MENU.y + 330, { size: 22, color: MENU_COLORS.dim });
    drawControls(ctx, this.waiting ? 'Press the new key' : `${hint('confirm')}: change a key     ${hint('cancel')}: back`);
  }

  drawSaves(ctx) {
    const x = MENU.x + 64;
    SAVE_ROWS.forEach(({ label }, i) => {
      const y = MENU.y + 84 + i * 40;
      const selected = i === this.saveCursor && !this.pending;
      if (selected) {
        const at = glide('settingsSaves', x - 34, y + 4);
        ctx.drawImage(soulSprite(), at.x, at.y);
      }
      drawText(ctx, label, x, y, { size: 26, color: selected ? MENU_COLORS.highlight : MENU_COLORS.text });
    });
    const about = MENU.x + 24;
    if (this.pending) {
      drawText(ctx, 'Replace the save in this browser with:', about, MENU.y + 190, { size: 24, color: MENU_COLORS.text });
      drawText(ctx, this.pending.summary, about, MENU.y + 222, { size: 24, color: MENU_COLORS.highlight });
      drawText(ctx, 'The save here now is kept aside, just in case.', about, MENU.y + 262, { size: 22, color: MENU_COLORS.dim });
      drawControls(ctx, `${hint('confirm')}: yes, import it     ${hint('cancel')}: no`);
      return;
    }
    drawText(ctx, 'Each browser and address keeps its own saves.', about, MENU.y + 190, { size: 22, color: MENU_COLORS.description });
    drawText(ctx, 'Export them to a file, then import it anywhere.', about, MENU.y + 216, { size: 22, color: MENU_COLORS.description });
    drawText(ctx, 'Export takes your last save point and each chapter\'s.', about, MENU.y + 250, { size: 22, color: MENU_COLORS.dim });
    if (this.note) drawText(ctx, this.note, about, MENU.y + 296, { size: 22, color: MENU_COLORS.highlight });
    drawControls(ctx, this.picking ? 'Waiting for a file...' : `${hint('confirm')}: choose     ${hint('cancel')}: back`);
  }

  // The slider: a row of notches, lit up to the volume.
  drawBar(ctx, x, y, value, selected, notches = 10) {
    const notchW = BAR.w / notches;
    const lit = Math.round(value * notches);
    for (let i = 0; i < notches; i++) {
      ctx.fillStyle = i < lit ? (selected ? MENU_COLORS.highlight : MENU_COLORS.text) : MENU_COLORS.divider;
      ctx.fillRect(Math.round(x + i * notchW) + 2, y, Math.round(notchW) - 4, BAR.h);
    }
  }
}
