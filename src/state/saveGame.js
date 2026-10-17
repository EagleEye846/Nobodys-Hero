import { HERO_STATE } from '../characters/heroState.js';

// Everything about the world that should be remembered: the room you saved in,
// where you stood, which enemies are gone for good, and which cutscenes have
// played. Saved together with HERO_STATE to the browser's localStorage at save points.
export const WORLD_STATE = {
  room: null,
  spawn: null,
  defeated: [],
  seenScenes: [],
  // Gifts already picked up (see Prop.markTaken), and play time in seconds.
  taken: [],
  // Puzzle switches that are on, as "room:name".
  levers: [],
  playSeconds: 0,
};

const SAVE_KEY = 'ruins-rpg-save-v1';

// Returns whether the save worked (storage can be blocked, e.g. in private windows).
export function saveGame(roomId, spawn) {
  WORLD_STATE.room = roomId;
  WORLD_STATE.spawn = spawn;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ hero: HERO_STATE, world: WORLD_STATE }));
    return true;
  } catch {
    return false;
  }
}

// Loads the last save into HERO_STATE and WORLD_STATE. Returns whether there was one.
export function loadGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!saved?.hero || !saved?.world) return false;
    Object.assign(HERO_STATE, saved.hero);
    Object.assign(WORLD_STATE, saved.world);
    return true;
  } catch {
    return false;
  }
}

// The saved game without loading it, for the title screen's save card: null if there isn't one.
export function peekSave() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    return saved?.hero && saved?.world ? saved : null;
  } catch {
    return null;
  }
}

export function eraseSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // Storage is blocked; there was nothing to erase anyway.
  }
}

// "1:05" or "12:40": hours and minutes.
export function formatPlayTime(seconds = 0) {
  const minutes = Math.floor(seconds / 60);
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
}

export function hasSave() {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}
