// Player settings that aren't part of a save (they're the same whichever save
// you play): how loud the music and the sound effects are, how fast words
// type out, whether the screen shakes, how bright lightning flashes, and
// which keys do what. Kept in
// the browser's localStorage on their own, so starting a new game or loading
// a chapter never resets them. Changed from SETTINGS in the C menu (or on
// the title screen): see src/ui/settingsMenu.js.

const SETTINGS_KEY = 'nobodys-hero-settings-v1';

// The steps of the LIGHTNING option, and how bright each lets a flash go.
export const FLASH_STEPS = ['on', 'soft', 'off'];
const FLASH_SCALE = { on: 1, soft: 0.35, off: 0 };
// The steps of the RUN and LOW HP WARNING options.
export const RUN_STEPS = ['hold', 'toggle'];
export const LOW_HP_STEPS = ['on', 'quiet', 'off'];

// How bright lightning may flash (1 as made, 0 not at all): everything that
// flashes the screen for a storm multiplies by this.
export function flashScale() {
  return FLASH_SCALE[SETTINGS.flashes] ?? 1;
}

// Each volume is 0 (off) to 1 (full).
export const SETTINGS = {
  music: 1,
  sounds: 1,
  // How fast words type out in the text box, as a multiple of the usual
  // speed (the steps are in settingsMenu.js).
  textSpeed: 1,
  // false: no blips as words type out (the talking voices, src/audio/voices.js).
  textSounds: true,
  // false: hits and rumbles no longer shake the screen.
  shake: true,
  // Lightning in the storm: 'on' (soft flashes), 'soft' (a faint glow only)
  // or 'off' (no flash at all; the thunder still rolls). See flashScale().
  flashes: 'on',
  // How running works out of battle: 'hold' (hold Shift or X to run) or
  // 'toggle' (tap Shift to start running, tap it again to walk).
  runMode: 'hold',
  // Low on HP in a fight: 'on' (the HP bar throbs and a soft heartbeat
  // ticks while you dodge), 'quiet' (the throb only) or 'off'.
  lowHp: 'on',
  // The key that does each action you can rebind (see src/engine/input.js);
  // a key's `code`, like 'KeyZ'. Only the ones you've changed need be here.
  keys: {},
};

try {
  const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
  for (const key of Object.keys(SETTINGS)) {
    if (typeof saved?.[key] === typeof SETTINGS[key]) SETTINGS[key] = saved[key];
  }
  if (!FLASH_STEPS.includes(SETTINGS.flashes)) SETTINGS.flashes = 'on';
  if (!RUN_STEPS.includes(SETTINGS.runMode)) SETTINGS.runMode = 'hold';
  if (!LOW_HP_STEPS.includes(SETTINGS.lowHp)) SETTINGS.lowHp = 'on';
  // Only keys for actions that exist, each a plain string.
  SETTINGS.keys = Object.fromEntries(Object.entries(SETTINGS.keys ?? {}).filter(([action, code]) => typeof code === 'string' && action !== '__proto__'));
} catch {
  // Storage can be blocked (private windows): the settings just won't be remembered.
}

export function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS));
  } catch {
    // As above: nothing to be done.
  }
}
