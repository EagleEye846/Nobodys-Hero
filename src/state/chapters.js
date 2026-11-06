import { HERO_STATE } from '../characters/heroState.js';
import { WORLD_STATE, saveGame, peekSave } from './saveGame.js';
import { ROOMS, START_ROOM } from '../data/rooms/index.js';
import { SCENES } from '../data/scenes/index.js';
import { SHOPS } from '../data/shops.js';
import { ENEMIES } from '../data/enemies/index.js';
import { ALL_SKILL_BRANCHES } from '../data/skills.js';

// Chapter select (on the title screen): start any chapter you've reached
// again, from its beginning, to replay it or to try out something new in it.
//
// Each chapter's start is remembered when you get there: a copy of the hero
// and the world as they were when the chapter began (at the end of the one
// before, see OverworldScene's endChapter). That's kept apart from the save,
// so carrying on and saving doesn't lose it. Picking a chapter backs the
// current save up first, then makes that copy the save and starts there.

export const CHAPTERS = [
  { number: 1, name: 'The Ruins', room: START_ROOM.id, spawn: START_ROOM.playerStart },
  { number: 2, name: 'Mount Vigil', room: 'beyond_ruins', spawn: { x: 11, y: 12 } },
  // `party`: who's with you when it starts, whatever its recorded start says
  // (Ves went over the summit's edge: chapter 3 begins alone).
  { number: 3, name: 'The Search', room: 'pinefall_landing', spawn: { x: 10, y: 9 }, party: [] },
  // Ves is with you, off her crutch (`well`: she's healed from the start; the
  // opening scene still shows her throwing the crutch away).
  { number: 4, name: 'The First', room: 'sunny_gate_field', spawn: { x: 14, y: 4 }, party: ['vesper'], well: true },
  // The next morning in the Soft Field (tide_held_opens). Ves and Bramble are
  // with you for good; `fromSave`: a chapter 4 save that has climbed out of
  // the hole is already this chapter's start (chapter 5 was built after it).
  { number: 5, name: 'The Tide Held', room: 'sunny_soft_field', spawn: { x: 21, y: 12 }, party: ['vesper', 'bramble'], well: true, fromSave: 'out_into_the_light' },
];

// The last chapter there is so far.
export const LAST_CHAPTER = CHAPTERS[CHAPTERS.length - 1].number;

// A save from the end of the last chapter there is, made back when the end of
// a chapter always moved you on: it went on to the next chapter's number
// (and so its skills) with no next chapter to go to. Back to the last one,
// with the points spent on skills from beyond it given back.
//
// And a save from the old end of Chapter 4, which went back to the village
// once the hall had fallen: on to the foot of the long rope, to say goodbye
// and climb out, as the chapter ends now. Returns whether it changed anything.
export function settleChapter() {
  const seen = WORLD_STATE.seenScenes ?? [];
  let moved = false;
  if (seen.includes('the_hall_falls') && !seen.includes('out_into_the_light') && WORLD_STATE.room !== 'belowtown_long_rope') {
    WORLD_STATE.room = 'belowtown_long_rope';
    WORLD_STATE.spawn = { ...ROOMS.belowtown_long_rope.playerStart };
    moved = true;
  }
  // A save from the end of chapter 4, made before chapter 5 was built (it
  // stayed in the Soft Field with chapter 4 "done"): on to the next morning,
  // which is where chapter 5 begins. Chapter select gets its start recorded.
  const five = CHAPTERS.find((c) => c.number === 5);
  if (five && (WORLD_STATE.chapter ?? 1) === 4 && seen.includes('out_into_the_light') && !seen.includes('tide_held_opens')) {
    WORLD_STATE.chapter = 5;
    WORLD_STATE.chapterDone = 4;
    WORLD_STATE.room = five.room;
    WORLD_STATE.spawn = { ...five.spawn };
    if (!chapterProgress().starts[5]) recordChapterStart(5);
    moved = true;
  }
  if ((WORLD_STATE.chapter ?? 1) <= LAST_CHAPTER) return moved;
  WORLD_STATE.chapter = LAST_CHAPTER;
  WORLD_STATE.chapterDone = LAST_CHAPTER;
  for (const branch of ALL_SKILL_BRANCHES) {
    for (const skill of branch.skills) {
      if ((skill.chapter ?? 1) <= LAST_CHAPTER || !HERO_STATE.skills.includes(skill.id)) continue;
      HERO_STATE.skills = HERO_STATE.skills.filter((id) => id !== skill.id);
      if (branch.member) {
        HERO_STATE.memberPoints ??= {};
        HERO_STATE.memberPoints[branch.member] = (HERO_STATE.memberPoints[branch.member] ?? 0) + skill.cost;
      } else HERO_STATE.skillPoints += skill.cost;
    }
  }
  return true;
}

const PROGRESS_KEY = 'ruins-rpg-chapters-v1';
const BACKUP_KEY = 'ruins-rpg-save-v1-backup';

const copy = (value) => JSON.parse(JSON.stringify(value));
// The hero and world as a brand new game has them, taken before any save is loaded.
const FRESH = copy({ hero: HERO_STATE, world: WORLD_STATE });

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY));
    return { started: saved?.started ?? [], beaten: saved?.beaten ?? [], starts: saved?.starts ?? {} };
  } catch {
    return { started: [], beaten: [], starts: {} };
  }
}

function writeProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Storage can be blocked (private windows); chapter select just won't remember.
  }
}

// Which chapters you've started and beaten: what's been recorded, plus what
// the save says (a save in chapter 3 means 1 and 2 are behind you).
export function chapterProgress() {
  const progress = readProgress();
  const started = new Set(progress.started);
  const beaten = new Set(progress.beaten);
  const onChapter = peekSave()?.world?.chapter ?? 0;
  for (let n = 1; n <= onChapter; n++) started.add(n);
  for (let n = 1; n < onChapter; n++) beaten.add(n);
  // A save that has climbed out of the hole has finished chapter 4, whether or
  // not chapter 5 has been entered yet.
  const savedScenes = peekSave()?.world?.seenScenes ?? [];
  for (const chapter of CHAPTERS) {
    if (chapter.fromSave && savedScenes.includes(chapter.fromSave)) {
      started.add(chapter.number);
      beaten.add(chapter.number - 1);
    }
  }
  return { started, beaten, starts: progress.starts };
}

// A chapter has just begun (or a new game has): remember how things stood.
export function recordChapterStart(number) {
  const progress = readProgress();
  if (!progress.started.includes(number)) progress.started.push(number);
  for (let n = 1; n < number; n++) if (!progress.beaten.includes(n)) progress.beaten.push(n);
  progress.starts[number] = copy({ hero: HERO_STATE, world: WORLD_STATE });
  writeProgress(progress);
}

// Rooms in the Ruins, to tell what of a save belongs to chapter 1.
const ruinsRoom = (id) => ROOMS[id]?.area === 'ruins';
const fromRuins = (key) => ruinsRoom(String(key).split(':')[0]);

// Everything you can get outside the Ruins and not in them: from chests and
// other gifts, shops, and what enemies drop. A chapter worked out from a save
// (below) takes these away again, so a replay starts empty-handed.
function laterThings() {
  const found = { ruins: new Set(), later: new Set() };
  for (const room of Object.values(ROOMS)) {
    const into = room.area === 'ruins' ? found.ruins : found.later;
    for (const prop of room.props ?? []) {
      if (prop.gives) into.add(prop.gives);
      for (const rule of prop.quest ?? []) for (const id of [].concat(rule.give ?? [])) into.add(id);
      for (const entry of SHOPS[prop.shop]?.stock ?? []) {
        const id = entry.item ?? entry.weapon ?? entry.armor;
        if (id) into.add(id);
      }
    }
    for (const npc of room.npcs ?? []) for (const drop of ENEMIES[npc.enemy]?.drops ?? []) into.add(drop.item);
  }
  return new Set([...found.later].filter((id) => !found.ruins.has(id)));
}

// How a chapter starts. Its recorded start if there is one; otherwise, for a
// chapter you reached before chapter select existed, it's worked out from
// your save: the hero as they are, less anything they could only have got
// since (laterThings), with the world put back to just what happened in the
// chapters before (here, the Ruins), and nobody in the party yet.
function startOf(chapter) {
  if (chapter.number === 1) return copy(FRESH);
  const recorded = chapterProgress().starts[chapter.number];
  if (recorded) return copy(recorded);
  const save = peekSave();
  if (!save) return null;
  // The save as it stands, taken back to the start of this chapter.
  if (chapter.fromSave && (save.world?.seenScenes ?? []).includes(chapter.fromSave)) {
    const world = copy(save.world);
    world.chapter = chapter.number;
    world.seenScenes = (world.seenScenes ?? []).filter((id) => id !== 'tide_held_opens');
    return { hero: copy(save.hero), world };
  }
  const hero = copy(save.hero);
  hero.party = [];
  // Nobody's hurt yet, either (Ves's fall comes later).
  hero.hurt = [];
  const later = laterThings();
  hero.items = (hero.items ?? []).filter((id) => !later.has(id));
  hero.weapons = (hero.weapons ?? []).filter((id) => !later.has(id));
  hero.armors = (hero.armors ?? []).filter((id) => !later.has(id));
  hero.gear = (hero.gear ?? []).filter((id) => !later.has(id));
  hero.storage = [];
  hero.memberGear = {};
  if (!hero.weapons.includes(hero.weapon)) hero.weapon = hero.weapons[0] ?? FRESH.hero.weapon;
  if (!hero.armors.includes(hero.armor)) hero.armor = hero.armors[0] ?? FRESH.hero.armor;
  const world = copy(save.world);
  world.chapter = chapter.number;
  delete world.carrying;
  world.seenScenes = (world.seenScenes ?? []).filter((id) => ruinsRoom(SCENES[id]?.room));
  for (const list of ['defeated', 'taken', 'read', 'levers']) world[list] = (world[list] ?? []).filter(fromRuins);
  delete world.quests;
  world.talked = (world.talked ?? []).filter((entry) => ruinsRoom(SCENES[String(entry).split(':')[1]]?.room));
  return { hero, world };
}

// Whether you can pick it: you've at least started it.
export function canPlay(chapter) {
  return chapterProgress().started.has(chapter.number) && Boolean(startOf(chapter));
}

// Back up the save, become the start of `chapter`, and save there. Returns
// the room and spawn to begin in, or null if it can't be played.
export function beginChapter(chapter) {
  const start = startOf(chapter);
  if (!start) return null;
  if (chapter.party) start.hero.party = [...chapter.party];
  // `well: true`: Ves starts the chapter off her crutch, umbrella back (Chapter 4).
  if (chapter.well) start.hero.hurt = [];
  if (chapter.well && start.world) delete start.world.carrying;
  try {
    const current = peekSave();
    if (current) localStorage.setItem(BACKUP_KEY, JSON.stringify(current));
  } catch {
    // No backup, but carry on: the chapter's start is still remembered.
  }
  for (const key of Object.keys(HERO_STATE)) delete HERO_STATE[key];
  for (const key of Object.keys(WORLD_STATE)) delete WORLD_STATE[key];
  Object.assign(HERO_STATE, copy(FRESH.hero), start.hero);
  Object.assign(WORLD_STATE, copy(FRESH.world), start.world, { chapter: chapter.number });
  saveGame(chapter.room, chapter.spawn);
  // Remembered from now on, so every replay of it starts the same way.
  if (chapter.number === 1 || !chapterProgress().starts[chapter.number]) recordChapterStart(chapter.number);
  return { room: ROOMS[chapter.room], spawn: chapter.spawn };
}
