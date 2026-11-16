import { HERO_STATE } from './heroState.js';
import { MEMBERS } from './party.js';
import { hasSkill, knownSpells, memberCommands, skillBonus } from './progress.js';
import { ALL_SKILL_BRANCHES } from '../data/skills.js';
import { SPELLS } from '../data/spells.js';
import { starLevel } from '../data/fallenStar.js';
import { WORLD_STATE } from '../state/saveGame.js';

// SPELL NOTCHES: nobody takes every spell they know into a fight, only as
// many as they have notches. Out of battle, the SPELLS screen in the C menu
// (src/ui/notchMenu.js) chooses which of their learned spells go in them;
// in battle the SPELLS list shows only those (and the free ones below).
//
// Everyone starts with NOTCH_BASE. More come from Notch Charms (GEAR, see
// src/data/gear.js), each one a notch more for everyone in the party at
// once: one sold by each chapter's smith (or the Ruins Shop), a few hidden in
// hard-to-reach chests. Every reforge of the Fallen Star cuts one more as well.
//
// A few spells never take a notch (FREE_SPELLS): the hero's Pacify (sparing
// is how a fight ends kindly, so it's always there), and each friend's free
// move (Ves's ZEPHYR, Bramble's HIDE), which cost no SP.
//
// HERO_STATE.loadout is what's been chosen, as { hero: [spell ids],
// vesper: [keys] } (a friend's key is the `learnable` key of a learned spell,
// or the label of one of their own `commands`). A notch nobody's chosen for
// (a new save, a new notch, a spell forgotten) is filled with the best spell
// that isn't in one yet (autoOrder), so nobody walks into a fight with an
// empty notch while they know something to put in it.

// Decided 13 November 2026: the hero and Ves start with 4, Bramble with 3.
export const NOTCH_BASE = { hero: 4, vesper: 4, bramble: 3 };
export const FREE_SPELLS = { hero: ['pacify'], vesper: ['ZEPHYR'], bramble: ['HIDE'] };

// Each Notch Charm, and the chapter it can first be had in (a save from
// before notches existed is given those from the chapters before its own:
// settleNotches).
export const NOTCH_CHARMS = {
  // Chapter 1: the Ruins Shop.
  notch_ruins: 1,
  // Chapter 2: Tilda's Forge, and the chest on the High Shelf's crag.
  notch_tilda: 2,
  notch_high_shelf: 2,
  // Chapter 3: Teasel's Forge.
  notch_teasel: 3,
  // Chapter 4: Hobnail's Forge.
  notch_hobnail: 4,
  // Chapter 5: Orla's Forge, and the sea chest in the Wrack Shore's hulk.
  notch_orla: 5,
  notch_hulk: 5,
};

// The chests that hold one (room:sprite:x,y, as Room keys a prop).
const CHEST_KEYS = {
  notch_high_shelf: 'vigil_high_shelf:chest:12,2',
  notch_hulk: 'secret_wrack_hulk:chest:12,6',
};

// Tools that weigh up every spell at once (tools/ttkCheck.html) switch notches off.
export const NOTCH_RULES = { off: false };

// What the SPELLS screen calls each kind of spell.
export const KINDS = ['ATTACK', 'ALL ENEMIES', 'HEAL', 'CALM', 'GUARD', 'HELP', 'SPARE'];

const ALL_SKILLS = ALL_SKILL_BRANCHES.flatMap((branch) => branch.skills);
// The chapter a spell is learned in (the skill that teaches it), for ranking:
// newer spells are usually the better ones.
const SPELL_CHAPTER = Object.fromEntries(ALL_SKILLS.filter((skill) => skill.effect.spell).map((skill) => [skill.effect.spell, skill.chapter ?? 1]));
const COMMAND_CHAPTER = Object.fromEntries(ALL_SKILLS.filter((skill) => skill.effect.command).map((skill) => [skill.effect.command, skill.chapter ?? 1]));

const JOIN_CHAPTER = { vesper: 2, bramble: 3 };
const HEALS = ['heal', 'mend', 'renew', 'balm', 'restore'];
const CALMS = ['lull', 'hush', 'serenade', 'soothe', 'truce'];
const GUARDS = ['ward', 'aegis', 'bastion', 'sidestep', 'duck'];

// What a spell costs the hero in battle, after Thrift and Gentle Hands: the
// same sums as the SPELLS list in battleScene.js (keep the two alike).
function heroSpellCost(id) {
  let discount = skillBonus('spellDiscount') + (id === 'pacify' ? skillBonus('pacifyDiscount') : 0);
  if ((WORLD_STATE.chapter ?? 1) >= 5 && SPELLS[id].sp >= 60) discount = Math.min(0.25, discount);
  if (SPELLS[id].sp === 100) discount = 0;
  return Math.max(1, Math.round(SPELLS[id].sp * (1 - Math.min(0.9, discount))));
}

function heroKind(id) {
  const spell = SPELLS[id];
  if (id === 'pacify') return 'SPARE';
  if (spell.power) return spell.all ? 'ALL ENEMIES' : 'ATTACK';
  if (HEALS.includes(id)) return 'HEAL';
  if (CALMS.includes(id)) return 'CALM';
  if (GUARDS.includes(id)) return 'GUARD';
  return 'HELP';
}

function memberKind(command) {
  if (command.strikeAll) return 'ALL ENEMIES';
  if (command.strikeOne || command.team || command.riposte) return 'ATTACK';
  if (command.heal || command.healAll || command.regen) return 'HEAL';
  if (command.guard || command.absorb || command.cover || command.sail || command.wade) return 'GUARD';
  if (command.calmAll) return 'CALM';
  return 'HELP';
}

// Notch Charms carried, and the Fallen Star's forgings.
export function notchCharms() {
  return (HERO_STATE.gear ?? []).filter((id) => id in NOTCH_CHARMS).length;
}

export function forgedNotches() {
  return HERO_STATE.weapons?.includes('fallen_star') ? starLevel() : 0;
}

// How many notches someone has: 'hero', or a member id.
export function notchCount(who) {
  return (NOTCH_BASE[who] ?? 3) + notchCharms() + forgedNotches();
}

// Everything someone knows that could go in a notch, or is free:
// [{ key, name, sp, kind, free, rank, command? }].
export function spellChoices(who) {
  const free = FREE_SPELLS[who] ?? [];
  if (who === 'hero') {
    return knownSpells().map((id) => {
      const spell = SPELLS[id];
      return {
        key: id,
        name: spell.name,
        sp: heroSpellCost(id),
        kind: heroKind(id),
        free: free.includes(id),
        rank: (SPELL_CHAPTER[id] ?? 1) * 100 + (spell.power ?? 0) * 10 + spell.sp / 10,
      };
    });
  }
  const member = MEMBERS[who];
  if (!member) return [];
  // (Their own SPELLS count as from the chapter they join in.)
  const own = member.commands.map((command) => ({ key: command.label, command, chapter: JOIN_CHAPTER[who] ?? 1 }));
  const learned = ALL_SKILLS
    .filter((skill) => hasSkill(skill.id) && skill.effect.command && member.learnable?.[skill.effect.command])
    .map((skill) => ({ key: skill.effect.command, command: member.learnable[skill.effect.command], chapter: COMMAND_CHAPTER[skill.effect.command] ?? 1 }));
  return [...own, ...learned].map(({ key, command, chapter }) => ({
    key,
    name: command.label,
    sp: command.cost ?? 0,
    kind: memberKind(command),
    free: free.includes(key),
    rank: chapter * 100 + (command.strikeOne ?? command.strikeAll ?? 0) * 20 + (command.cost ?? 0) / 10,
    command,
  }));
}

// The best of `choices` first: one of each kind not already among `taken`
// (an attack, a heal, a hit on everyone, a calm, a guard, a help), then the
// rest, newest and strongest first.
export function autoOrder(choices, taken = []) {
  const byRank = [...choices].sort((a, b) => b.rank - a.rank);
  const first = [];
  const covered = new Set(taken.map((choice) => choice.kind));
  for (const kind of KINDS) {
    if (covered.has(kind)) continue;
    const best = byRank.find((choice) => choice.kind === kind);
    if (best) first.push(best);
  }
  return [...first, ...byRank.filter((choice) => !first.includes(choice))];
}

// The keys in someone's notches, in order: what they chose, then the best of
// the rest in any notch still open.
export function notchedKeys(who) {
  const choices = spellChoices(who).filter((choice) => !choice.free);
  const count = notchCount(who);
  const saved = HERO_STATE.loadout?.[who] ?? [];
  const picked = saved.filter((key, i) => saved.indexOf(key) === i && choices.some((choice) => choice.key === key)).slice(0, count);
  if (picked.length < count) {
    const taken = choices.filter((choice) => picked.includes(choice.key));
    const rest = autoOrder(choices.filter((choice) => !picked.includes(choice.key)), taken);
    picked.push(...rest.slice(0, count - picked.length).map((choice) => choice.key));
  }
  return picked;
}

export function isNotched(who, key) {
  return notchedKeys(who).includes(key) || (FREE_SPELLS[who] ?? []).includes(key);
}

// Puts `key` in notch `index`. If it was in another notch, the two swap.
export function setNotch(who, index, key) {
  const keys = notchedKeys(who);
  const was = keys.indexOf(key);
  if (was >= 0) keys[was] = keys[index];
  keys[index] = key;
  HERO_STATE.loadout ??= {};
  HERO_STATE.loadout[who] = keys.filter((one) => one !== undefined);
}

// A spell a scene gives (Nova, at the end of chapter 5: "It is in your SPELLS
// now"): put straight into a notch, the last one if they're all full.
export function notchNew(who, key) {
  if (isNotched(who, key) || !spellChoices(who).some((choice) => choice.key === key)) return;
  const keys = notchedKeys(who);
  setNotch(who, Math.min(keys.length, notchCount(who) - 1), key);
}

// The same for a skill a scene gives: the spell it teaches, if it teaches one.
export function notchSkill(skillId) {
  const skill = ALL_SKILLS.find((one) => one.id === skillId);
  if (skill?.effect.spell) notchNew('hero', skill.effect.spell);
}

// The hero's SPELLS in battle: the notched ones, then the free ones.
export function battleSpells() {
  const known = knownSpells();
  if (NOTCH_RULES.off) return known;
  const free = known.filter((id) => FREE_SPELLS.hero.includes(id));
  return [...notchedKeys('hero'), ...free];
}

// A friend's SPELLS in battle: the notched ones, then the free ones. (While
// they're hurt, their few `hurt` SPELLS, which need no notches.)
export function battleCommands(id) {
  const all = memberCommands(id);
  const member = MEMBERS[id];
  if (NOTCH_RULES.off || !member || all.some((command) => member.hurt?.commands.includes(command))) return all;
  const choices = spellChoices(id);
  const byKey = (key) => choices.find((choice) => choice.key === key)?.command;
  return [...notchedKeys(id).map(byKey), ...choices.filter((choice) => choice.free).map((choice) => choice.command)].filter(Boolean);
}

// A save from before notches (HERO_STATE.notchesSettled false) gets the
// Notch Charms from the chapters before the one it's in, so a party deep in
// the story doesn't load in with three notches. Returns whether it changed anything.
export function settleNotches() {
  if (HERO_STATE.notchesSettled !== false) return false;
  HERO_STATE.notchesSettled = true;
  HERO_STATE.gear ??= [];
  for (const [id, chapter] of Object.entries(NOTCH_CHARMS)) {
    // (A chest that held something else before, already opened, counts too.)
    const opened = (WORLD_STATE.taken ?? []).includes(CHEST_KEYS[id]);
    if ((chapter < (WORLD_STATE.chapter ?? 1) || opened) && !HERO_STATE.gear.includes(id)) HERO_STATE.gear.push(id);
  }
  return true;
}
