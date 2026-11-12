import { HERO_STATE } from '../characters/heroState.js';
import { WORLD_STATE, saveGame, peekSave } from './saveGame.js';
import { ROOMS, START_ROOM } from '../data/rooms/index.js';
import { SCENES } from '../data/scenes/index.js';
import { SHOPS } from '../data/shops.js';
import { ENEMIES } from '../data/enemies/index.js';
import { ALL_SKILL_BRANCHES } from '../data/skills.js';
import { HERO, ownedGear, equippedGear, equipGear, canEquip } from '../characters/equipment.js';
import { MEMBERS } from '../characters/party.js';
import { textSection } from '../engine/textLoader.js';
import { WEAPONS } from '../data/weapons.js';
import { ARMOR } from '../data/armor.js';
import { catchUpTo } from '../characters/progress.js';
import { STAR_FORGINGS } from '../data/fallenStar.js';

// Chapter select (on the title screen): start any chapter you've reached
// again, from its beginning, to replay it or to try out something new in it.
//
// Each chapter's start is remembered when you get there: a copy of the hero
// and the world as they were when the chapter began (at the end of the one
// before, see OverworldScene's endChapter). That's kept apart from the save,
// so carrying on and saving doesn't lose it. Picking a chapter backs the
// current save up first, then makes that copy the save and starts there.

// `arriveLevel`: the level a player who fights what they meet gets there at
// (notes/docs/balance-check-2026-11-03.md). A chapter begun from here, or a
// save in it far behind, is caught up to it (catchUp, below).
export const CHAPTERS = [
  { number: 1, name: 'The Ruins', room: START_ROOM.id, spawn: START_ROOM.playerStart, arriveLevel: 1 },
  { number: 2, name: 'Mount Vigil', room: 'beyond_ruins', spawn: { x: 11, y: 12 }, arriveLevel: 6 },
  // `party`: who's with you when it starts, whatever its recorded start says
  // (Ves went over the summit's edge: chapter 3 begins alone).
  { number: 3, name: 'The Search', room: 'pinefall_landing', spawn: { x: 10, y: 9 }, party: [], arriveLevel: 14 },
  // Ves is with you, off her crutch (`well`: she's healed from the start; the
  // opening scene still shows her throwing the crutch away).
  { number: 4, name: 'The First', room: 'sunny_gate_field', spawn: { x: 14, y: 4 }, party: ['vesper'], well: true, arriveLevel: 28 },
  // The next morning in the Soft Field (tide_held_opens). Ves and Bramble are
  // with you for good; `fromSave`: a chapter 4 save that has climbed out of
  // the hole is already this chapter's start (chapter 5 was built after it).
  { number: 5, name: 'The Tide Held', room: 'sunny_soft_field', spawn: { x: 21, y: 12 }, party: ['vesper', 'bramble'], well: true, fromSave: 'out_into_the_light', arriveLevel: 37 },
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
// The save's own key (as in saveGame.js), written straight when restoring.
const SAVE_KEY_FOR_RESTORE = 'ruins-rpg-save-v1';

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

// The last chapter there is has been played to its end, and you play on in it
// (its ending puts you back in the world): it, and every one before it, count
// as beaten. Its recorded start isn't touched, so chapter select still starts
// it from the beginning.
export function recordChapterBeaten(number) {
  const progress = readProgress();
  if (!progress.started.includes(number)) progress.started.push(number);
  for (let n = 1; n <= number; n++) if (!progress.beaten.includes(n)) progress.beaten.push(n);
  writeProgress(progress);
}

// Which chapter each area of rooms belongs to (a room's `area`). Sunnyside
// is chapter 4's, and its rooms' `chapter5` variants are chapter 5's.
const AREA_CHAPTER = {
  ruins: 1,
  stair: 2, vigil: 2, rest: 2,
  pinefall: 3, hushwood: 3, hollin: 3, drains: 3, marsh: 3, lasthome: 3, valley: 3,
  sunnyside: 4, belowtown: 4, diggings: 4, glimmer: 4, deep: 4, stillwater: 4,
  gullrest: 5, saltcombe: 5, wrack: 5, wreck: 5, ghostship: 5, lanes: 5, soundings: 5, isles: 5,
  merrow: 5, reach: 5, haddock_light: 5, lastlight: 5,
};
export const roomChapter = (id) => AREA_CHAPTER[ROOMS[id]?.area] ?? null;

// The chapter a cutscene belongs to: its room's, or 5 for one that only a
// room's chapter 5 variant plays.
let variantScenes = null;
function sceneChapter(id) {
  variantScenes ??= new Set(Object.values(ROOMS).flatMap((room) => (room.chapter5 ? JSON.stringify(room.chapter5).match(/[a-z0-9_]+/g) ?? [] : [])));
  const chapter = roomChapter(SCENES[id]?.room);
  return chapter && variantScenes.has(id) ? Math.max(chapter, 5) : chapter;
}
// A world key such as "room:..." (a beaten monster, a chest taken): its room's
// chapter, or 5 for one of a chapter 5 variant's monsters ("room:ch5:0").
const keyChapter = (key) => (String(key).includes(':ch5:') ? 5 : roomChapter(String(key).split(':')[0]));

// Everything that can be got, and the first chapter it can be got in: from
// chests and other gifts (`gives`, a quest's `give`), shops, what monsters drop
// and cutscenes' gifts, each counted at its room's chapter.
let firstChapters = null;
// The weapons and armor each chapter's shops sell, by chapter (filled with firstChapters).
const shopGear = {};
function firstChapterOf() {
  if (firstChapters) return firstChapters;
  firstChapters = new Map();
  const add = (id, chapter) => {
    if (typeof id === 'string' && chapter && !(firstChapters.get(id) <= chapter)) firstChapters.set(id, chapter);
  };
  // Any `gives: 'id'` or `give: 'id' | [...]` anywhere in a room's props or people.
  const gifts = (value, chapter) => {
    if (Array.isArray(value)) {
      for (const v of value) gifts(v, chapter);
      return;
    }
    if (!value || typeof value !== 'object') return;
    for (const [key, v] of Object.entries(value)) {
      if ((key === 'gives' || key === 'give') && (typeof v === 'string' || Array.isArray(v))) {
        for (const id of [].concat(v)) add(id, chapter);
      } else gifts(v, chapter);
    }
  };
  const things = (props, npcs, chapter) => {
    gifts(props, chapter);
    gifts(npcs, chapter);
    for (const prop of props ?? []) {
      for (const entry of SHOPS[prop.shop]?.stock ?? []) {
        add(entry.item ?? entry.weapon ?? entry.armor ?? entry.gear, chapter);
        const id = entry.weapon ?? entry.armor ?? entry.item;
        if (WEAPONS[id] || ARMOR[id]) (shopGear[chapter] ??= new Set()).add(id);
      }
    }
    for (const npc of npcs ?? []) {
      const enemy = ENEMIES[npc.enemy];
      for (const drop of enemy?.drops ?? []) add(drop.item, chapter);
      for (const [from, later] of Object.entries(enemy?.later ?? {})) for (const drop of later.drops ?? []) add(drop.item, Math.max(chapter, Number(from)));
    }
  };
  for (const room of Object.values(ROOMS)) {
    const chapter = AREA_CHAPTER[room.area];
    if (!chapter) continue;
    things(room.props, room.npcs, chapter);
    if (room.chapter5) things(room.chapter5.addProps, room.chapter5.npcs, Math.max(chapter, 5));
  }
  for (const scene of Object.values(SCENES)) {
    const chapter = sceneChapter(scene.id);
    JSON.stringify(scene.steps, (key, value) => {
      if (value?.do === 'give') add(value.item, chapter);
      return value;
    });
  }
  return firstChapters;
}
// Whether `id` can only be had from chapter `n` on (so a restart of `n`
// mustn't have it). Anything that can be had earlier too is kept.
export const onlyFrom = (id, n) => (firstChapterOf().get(id) ?? 0) >= n;

// How good a piece of gear is, to pick the best one owned (fitOut).
const gearScore = {
  weapon: (id) => Number(WEAPONS[id]?.fightPower ?? 0),
  armor: (id) => Number(ARMOR[id]?.defense ?? 0) + Number(ARMOR[id]?.spGain ?? 0) * 4,
};
const bestOf = (ids, slot) => [...ids].sort((a, b) => gearScore[slot](b) - gearScore[slot](a))[0];

// THE SWORD RULE (the true ending is strict, notes/docs/true-ending-plan.md):
// a replay may catch up a forging you missed, but only if you had the Fallen
// Star on a save to begin with. Nobody is handed the sword, or any of its
// forgings, by chapter select: a replay keeps what the saves kept apart have
// (`hadStar`). Replaying chapter 3 means finding the sword again, and a
// player who has it can replay a chapter to do that chapter's forging.
const hadStar = (saves) => saves.some((save) => save?.hero?.weapons?.includes('fallen_star'));

// A restart of chapter `n` has nothing you could only get in it or after it,
// but keeps everything from the chapters before. `hero` is a copy of a saved
// hero, changed in place. Also:
// - `from`: other saves, whose weapons, armor and gear from before chapter
//   `n` are added (a start worked out from a save, back when only the Ruins'
//   things were kept, lost everything from chapters 2 and 3);
// - the Fallen Star's forgings from chapter `n` on are undone;
// - skills from a chapter after `n` are given back as points.
// Never adds levels, points or anything not owned in some save.
// The last of the Fallen Star's forgings from before chapter `n`.
const lastForgingBefore = (n) => STAR_FORGINGS.reduce((most, forging, i) => ((forging.chapter ?? 1) < n ? i : most), 0);
const heroOwn = (hero, table, list) => (hero[list] ?? []).filter((id) => table[id] && !table[id].wielder);

// Adds to `hero` the weapons, armor and gear from before chapter `n` that
// any of the saves `from` owns and he doesn't (and the Fallen Star's forgings
// from before `n`). Anyone with a better weapon now picks it up (fitOut puts
// the best on a friend whose hand is empty). Returns whether it added any.
function addEarlierGear(hero, n, from, lendStar = true) {
  let added = false;
  for (const save of from) {
    for (const list of ['weapons', 'armors', 'gear']) {
      hero[list] ??= [];
      for (const id of save?.hero?.[list] ?? []) {
        if (onlyFrom(id, n) || hero[list].includes(id)) continue;
        // The sword comes only from a save that has it, and only into a chapter replay
        // (a save carried on from never borrows it from another run).
        if (id === 'fallen_star' && (!lendStar || !hadStar([save]))) continue;
        hero[list].push(id);
        added = true;
      }
    }
    if (hero.weapons.includes('fallen_star')) hero.starForged = Math.max(hero.starForged ?? 0, Math.min(save?.hero?.starForged ?? 0, lastForgingBefore(n)));
  }
  if (!added) return false;
  const top = bestOf(heroOwn(hero, WEAPONS, 'weapons'), 'weapon');
  if (top && gearScore.weapon(top) > gearScore.weapon(hero.weapon)) hero.weapon = top;
  for (const [id, gear] of Object.entries(hero.memberGear ?? {})) {
    const theirs = bestOf(hero.weapons.filter((w) => WEAPONS[w]?.wielder === id), 'weapon');
    if (gear?.weapon && theirs && gearScore.weapon(theirs) > gearScore.weapon(gear.weapon)) gear.weapon = theirs;
  }
  return true;
}

function stripLater(hero, n, from = []) {
  const keep = (list) => (list ?? []).filter((id) => !onlyFrom(id, n));
  for (const list of ['items', 'weapons', 'armors', 'gear', 'storage']) hero[list] = keep(hero[list]);
  // No save ever had the sword: a start recorded in a run that did can't give it.
  if (!hadStar(from)) {
    hero.weapons = hero.weapons.filter((id) => id !== 'fallen_star');
    delete hero.starForged;
  }
  if (!hero.weapons.includes('fallen_star')) delete hero.starForged;
  else hero.starForged = Math.min(hero.starForged ?? 0, lastForgingBefore(n));
  // What the hero had on, if it's gone: the best he still owns. (A friend's
  // is put right by fitOut, once they're in the party.)
  if (!hero.weapons.includes(hero.weapon)) hero.weapon = bestOf(heroOwn(hero, WEAPONS, 'weapons'), 'weapon') ?? FRESH.hero.weapon;
  if (!hero.armors.includes(hero.armor)) hero.armor = bestOf(heroOwn(hero, ARMOR, 'armors'), 'armor') ?? FRESH.hero.armor;
  if (!hero.weapons.includes(hero.weapon)) hero.weapons.push(hero.weapon);
  addEarlierGear(hero, n, from);
  if (!hero.armors.includes(hero.armor)) hero.armors.push(hero.armor);
  for (const [id, gear] of Object.entries(hero.memberGear ?? {})) {
    if (gear?.weapon && !hero.weapons.includes(gear.weapon)) delete gear.weapon;
    if (gear?.armor && !hero.armors.includes(gear.armor)) delete gear.armor;
    if (!gear?.weapon && !gear?.armor) delete hero.memberGear[id];
  }
  for (const branch of ALL_SKILL_BRANCHES) {
    for (const skill of branch.skills) {
      if ((skill.chapter ?? 1) <= n || !(hero.skills ?? []).includes(skill.id)) continue;
      hero.skills = hero.skills.filter((id) => id !== skill.id);
      if (branch.member) {
        hero.memberPoints ??= {};
        hero.memberPoints[branch.member] = (hero.memberPoints[branch.member] ?? 0) + skill.cost;
      } else hero.skillPoints = (hero.skillPoints ?? 0) + skill.cost;
    }
  }
  return hero;
}

// Every save kept: the one you're on and each chapter's.
const allSaves = () => [peekSave(), ...CHAPTERS.map((c) => readSave(slotKey(c.number)))].filter(Boolean);

// How a chapter starts. Its recorded start if there is one; otherwise, for a
// chapter you reached before chapter select existed, it's worked out from
// your save: the hero as they are, with the world put back to just what
// happened in the chapters before, and nobody in the party yet. Either way
// nothing from this chapter on comes with it, and gear from before it that
// another save has is added (stripLater).
function startOf(chapter) {
  if (chapter.number === 1) return copy(FRESH);
  const n = chapter.number;
  const recorded = chapterProgress().starts[n];
  if (recorded) {
    const start = copy(recorded);
    stripLater(start.hero, n, allSaves());
    return start;
  }
  const save = peekSave();
  if (!save) return null;
  // The save as it stands, taken back to the start of this chapter.
  if (chapter.fromSave && (save.world?.seenScenes ?? []).includes(chapter.fromSave)) {
    const world = copy(save.world);
    world.chapter = n;
    world.seenScenes = (world.seenScenes ?? []).filter((id) => id !== 'tide_held_opens');
    return { hero: stripLater(copy(save.hero), n, allSaves()), world };
  }
  const hero = stripLater(copy(save.hero), n, allSaves());
  hero.party = [];
  // Nobody's hurt yet, either (Ves's fall comes later).
  hero.hurt = [];
  const world = copy(save.world);
  world.chapter = n;
  delete world.carrying;
  const before = (number) => number !== null && number !== undefined && number < n;
  world.seenScenes = (world.seenScenes ?? []).filter((id) => before(sceneChapter(id)));
  for (const list of ['defeated', 'taken', 'read', 'levers']) world[list] = (world[list] ?? []).filter((key) => before(keyChapter(key)));
  delete world.quests;
  world.talked = (world.talked ?? []).filter((entry) => before(sceneChapter(String(entry).split(':')[1])));
  return { hero, world };
}

// Whether you can pick it: you've at least started it.
export function canPlay(chapter) {
  return chapterProgress().started.has(chapter.number) && Boolean(startOf(chapter));
}

// One save kept per chapter. Whenever you switch chapters (from CHAPTERS on
// the title screen), the save you're on is put away in its own chapter's slot,
// so each chapter remembers where you got to. Picking a chapter then offers
// CONTINUE (that slot) or START FROM BEGINNING.
const slotKey = (n) => `${SAVE_KEY_FOR_RESTORE}-ch${n}`;
const readSave = (key) => {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return saved?.hero && saved?.world ? saved : null;
  } catch {
    return null;
  }
};
const chapterOf = (save) => save?.world?.chapter ?? 1;

// The old single backup (before chapters had a save each) goes into its
// chapter's slot, unless that slot already has one.
function moveOldBackup() {
  const old = readSave(BACKUP_KEY);
  if (!old) return;
  try {
    if (!readSave(slotKey(chapterOf(old)))) localStorage.setItem(slotKey(chapterOf(old)), JSON.stringify(old));
    localStorage.removeItem(BACKUP_KEY);
  } catch {
    // Left where it is; nothing lost.
  }
}

// Puts the save you're on away in its chapter's slot.
function stashCurrent() {
  const current = peekSave();
  if (!current) return;
  try {
    localStorage.setItem(slotKey(chapterOf(current)), JSON.stringify(current));
  } catch {
    // No room to keep it: carry on regardless.
  }
}

// The save you'd carry on from in chapter `n`, or null: the one you're on if
// it's in that chapter, or the one kept for it.
export function chapterSave(n) {
  moveOldBackup();
  const current = peekSave();
  if (current && chapterOf(current) === n) return current;
  return readSave(slotKey(n));
}

// Makes chapter `n`'s kept save the one you're on (putting the current one
// away first). True if there is one to carry on from.
export function continueChapter(n) {
  const kept = chapterSave(n);
  if (!kept) return false;
  if (kept === peekSave() || chapterOf(peekSave()) === n) return true;
  stashCurrent();
  try {
    localStorage.setItem(SAVE_KEY_FOR_RESTORE, JSON.stringify(kept));
    return true;
  } catch {
    return false;
  }
}

// Nobody starts a chapter empty-handed. A start built from a later save has
// to drop that save's later gear, and Ves and Bramble used to lose everything
// they had on (fighting at half strength with no umbrella or hatchet, and the
// graze SP their gear gives gone). Anyone in the party with nothing in a slot
// puts on the best they own for it; the hero too, if what he had on is gone.
function fitOut() {
  for (const who of [HERO, ...(HERO_STATE.party ?? [])]) {
    for (const slot of ['weapon', 'armor']) {
      const owned = ownedGear(who, slot);
      if (equippedGear(who, slot) && owned.includes(equippedGear(who, slot))) continue;
      const best = [...owned].sort((a, b) => gearScore[slot](b) - gearScore[slot](a))[0];
      if (best) equipGear(who, slot, best);
    }
  }
}

// A start recorded from an old save (before the EXP was raised in November
// 2026) can be ten levels behind where the chapter's fights are made for:
// chapter 4 from LV 18 instead of 28, with far fewer skill points. The hero
// is raised to the chapter's `arriveLevel`, with the skill points those
// levels would have brought him and the party, each counted at the chapter
// it would have come in (see levelChapter). Nothing above it is touched.
// `behind`: only if he's at least that many levels short.
function levelChapter(level) {
  let at = 1;
  for (const chapter of CHAPTERS) if ((chapter.arriveLevel ?? 1) < level) at = chapter.number;
  return at;
}
function catchUp(chapter, behind = 1) {
  const level = chapter?.arriveLevel ?? 1;
  if (HERO_STATE.level > level - behind) return 0;
  return catchUpTo(level, levelChapter);
}

// A save carried on from (CONTINUE, here or on the title screen) that is far
// behind its chapter's `arriveLevel`, such as one played on from an old,
// too-low start: caught up once, the same way. A few levels short is left
// alone (that's just how someone plays). Returns whether it changed anything.
const FAR_BEHIND = 3;
// Once per save (`gearChecked`), the gear from the chapters before that
// another save owns is added too: a run begun from a start that lost it.
export function catchUpSave() {
  const chapter = CHAPTERS.find((c) => c.number === (WORLD_STATE.chapter ?? 1));
  if (!chapter) return false;
  const levels = catchUp(chapter, FAR_BEHIND);
  let gear = false;
  if (!WORLD_STATE.gearChecked && chapter.number > 1) {
    WORLD_STATE.gearChecked = true;
    gear = addEarlierGear(HERO_STATE, chapter.number, allSaves(), false);
    fitOut();
  }
  return levels > 0 || gear;
}

// A chapter started again from CHAPTERS (never CONTINUE, never a normal
// playthrough) from a save that never had the gear a player would have by
// then: whoever's short gets the best weapon and armor the last chapter's
// shops sold, and puts it on. Nobody gets a piece if they own one at least
// as good, and nothing from this chapter on is ever given. Returns what was
// given, as [{ who, pieces }].
function giveKit(n) {
  firstChapterOf();
  const stock = [...(shopGear[n - 1] ?? [])].filter((id) => !onlyFrom(id, n));
  const given = [];
  for (const who of [HERO, ...(HERO_STATE.party ?? [])]) {
    const pieces = [];
    for (const slot of ['weapon', 'armor']) {
      const top = bestOf(stock.filter((id) => canEquip(who, slot, id)), slot);
      if (!top || ownedGear(who, slot).some((id) => gearScore[slot](id) >= gearScore[slot](top))) continue;
      HERO_STATE[slot === 'weapon' ? 'weapons' : 'armors'].push(top);
      equipGear(who, slot, top);
      pieces.push(top);
    }
    if (pieces.length) given.push({ who, pieces });
  }
  return given;
}

// The words for a kit (text/title.txt): a line, then one for each person.
export function kitLines(kit) {
  if (!kit?.length) return [];
  const name = (id) => WEAPONS[id]?.name ?? ARMOR[id]?.name ?? id;
  const piece = textSection('title.txt', 'chapter_kit_piece')[0];
  return [
    ...textSection('title.txt', 'chapter_kit'),
    ...kit.map(({ who, pieces }) => piece
      .replace('{who}', who === HERO ? 'You' : MEMBERS[who]?.name ?? who)
      .replace('{gear}', pieces.map(name).join(' and '))),
  ];
}

// Back up the save, become the start of `chapter`, and save there. Returns
// the room and spawn to begin in, and any `kit` given (giveKit), or null if
// it can't be played.
export function beginChapter(chapter) {
  const start = startOf(chapter);
  if (!start) return null;
  if (chapter.party) start.hero.party = [...chapter.party];
  // `well: true`: Ves starts the chapter off her crutch, umbrella back (Chapter 4).
  if (chapter.well) start.hero.hurt = [];
  if (chapter.well && start.world) delete start.world.carrying;
  // The save you're on is put away in its own chapter's slot first.
  moveOldBackup();
  stashCurrent();
  for (const key of Object.keys(HERO_STATE)) delete HERO_STATE[key];
  for (const key of Object.keys(WORLD_STATE)) delete WORLD_STATE[key];
  Object.assign(HERO_STATE, copy(FRESH.hero), start.hero);
  Object.assign(WORLD_STATE, copy(FRESH.world), start.world, { chapter: chapter.number });
  fitOut();
  catchUp(chapter);
  const kit = chapter.number > 1 ? giveKit(chapter.number) : [];
  // (Its gear from other saves is already added: stripLater.)
  WORLD_STATE.gearChecked = true;
  saveGame(chapter.room, chapter.spawn);
  // Remembered from now on, so every replay of it starts the same way.
  if (chapter.number === 1 || !chapterProgress().starts[chapter.number]) recordChapterStart(chapter.number);
  return { room: ROOMS[chapter.room], spawn: chapter.spawn, kit };
}
