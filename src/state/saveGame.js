import { HERO_STATE } from '../characters/heroState.js';
import { giveStartingGear } from '../characters/equipment.js';

// Everything about the world that should be remembered: the room you saved in,
// where you stood, which enemies are gone for good, and which cutscenes have
// played. Saved together with HERO_STATE to the browser's localStorage at save points.
export const WORLD_STATE = {
  // The chapter you're on: 1 in the Ruins, then up one at each chapter's end.
  chapter: 1,
  room: null,
  spawn: null,
  defeated: [],
  seenScenes: [],
  // Gifts already picked up (see Prop.markTaken), and play time in seconds.
  taken: [],
  // Things with a "!" over them that you've read (see Prop's `notice`).
  read: [],
  // NPCs' lines for after a cutscene that you've already heard, as "npc:scene"
  // (see OverworldScene.npcPages).
  talked: [],
  // Puzzle switches that are on, as "room:name".
  levers: [],
  // Green updrafts you've found and can travel between (src/data/travel.js).
  travelDrafts: [],
  playSeconds: 0,
};

const SAVE_KEY = 'ruins-rpg-save-v1';

// Both as they are at the start of a new game, so a load can clear out
// anything set since the save (a skill point bought, a vane turned).
const FRESH = JSON.parse(JSON.stringify({ hero: HERO_STATE, world: WORLD_STATE }));

function resetTo(state, fresh, saved) {
  for (const key of Object.keys(state)) delete state[key];
  Object.assign(state, JSON.parse(JSON.stringify(fresh)), saved);
}

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

// Brings an older save (`saved`, as it was read) up to date.
const PIP_SKILL_COSTS = { pip_loud: 1, pip_brave: 1, pip_encore: 2, pip_lucky: 2 };
function upgradeSave(saved) {
  // From before Ves replaced Pip: she takes Pip's place in the party, with
  // the points spent on Pip's old skills given back to her.
  if (HERO_STATE.party?.includes('pip')) {
    HERO_STATE.party = HERO_STATE.party.map((id) => (id === 'pip' ? 'vesper' : id));
    const refund = (HERO_STATE.skills ?? []).reduce((sum, id) => sum + (PIP_SKILL_COSTS[id] ?? 0), 0);
    HERO_STATE.skills = (HERO_STATE.skills ?? []).filter((id) => !(id in PIP_SKILL_COSTS));
    HERO_STATE.memberPoints ??= {};
    HERO_STATE.memberPoints.vesper = (HERO_STATE.memberPoints.pip ?? 0) + refund;
    delete HERO_STATE.memberPoints.pip;
  }
  // From before members had gear of their own: nobody's wearing anything
  // (not even what this session had on), so everyone in the party gets
  // their starting kit.
  if (!saved.hero.memberGear) HERO_STATE.memberGear = {};
  for (const id of HERO_STATE.party ?? []) giveStartingGear(id);
}

// Loads the last save into HERO_STATE and WORLD_STATE. Returns whether there was one.
export function loadGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!saved?.hero || !saved?.world) return false;
    resetTo(HERO_STATE, FRESH.hero, saved.hero);
    resetTo(WORLD_STATE, FRESH.world, saved.world);
    upgradeSave(saved);
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
