import { HERO_STATE } from '../characters/heroState.js';

// Everything about the world that should be remembered: the room you saved in,
// where you stood, which enemies are gone for good, and which cutscenes have
// played. Saved together with HERO_STATE to the browser's localStorage at save points.
export const WORLD_STATE = {
  room: null,
  spawn: null,
  defeated: [],
  seenScenes: [],
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

export function hasSave() {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}
