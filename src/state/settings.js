// Player settings that aren't part of a save (they're the same whichever save
// you play): how loud the music is, and how loud the sound effects. Kept in
// the browser's localStorage on their own, so starting a new game or loading
// a chapter never resets them. Changed from SETTINGS in the C menu (or on
// the title screen): see src/ui/settingsMenu.js.

const SETTINGS_KEY = 'nobodys-hero-settings-v1';

// Each volume is 0 (off) to 1 (full).
export const SETTINGS = {
  music: 1,
  sounds: 1,
};

try {
  const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
  for (const key of Object.keys(SETTINGS)) {
    if (typeof saved?.[key] === typeof SETTINGS[key]) SETTINGS[key] = saved[key];
  }
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
