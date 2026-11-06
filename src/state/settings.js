// Player settings that aren't part of a save (they're the same whichever save
// you play): how loud the music and the sound effects are, how fast words
// type out, whether the screen shakes, and which keys do what. Kept in
// the browser's localStorage on their own, so starting a new game or loading
// a chapter never resets them. Changed from SETTINGS in the C menu (or on
// the title screen): see src/ui/settingsMenu.js.

const SETTINGS_KEY = 'nobodys-hero-settings-v1';

// Each volume is 0 (off) to 1 (full).
export const SETTINGS = {
  music: 1,
  sounds: 1,
  // How fast words type out in the text box, as a multiple of the usual
  // speed (the steps are in settingsMenu.js).
  textSpeed: 1,
  // false: hits and rumbles no longer shake the screen.
  shake: true,
  // The key that does each action you can rebind (see src/engine/input.js);
  // a key's `code`, like 'KeyZ'. Only the ones you've changed need be here.
  keys: {},
};

try {
  const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
  for (const key of Object.keys(SETTINGS)) {
    if (typeof saved?.[key] === typeof SETTINGS[key]) SETTINGS[key] = saved[key];
  }
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
