import { HERO_STATE } from './heroState.js';
import { MEMBERS, partyIds, memberPoints, spendMemberPoints, hurtState } from './party.js';
import { ALL_SKILL_BRANCHES, MEMBER_SKILL_BRANCHES } from '../data/skills.js';
import { STARTING_SPELLS } from '../data/spells.js';
import { armorStat } from '../data/armor.js';
import { WORLD_STATE } from '../state/saveGame.js';

// Levelling and the skill tree: how EXP turns into levels, and what learned
// skills add up to.

const BASE_MAX_HP = 90;
const HP_PER_LEVEL = 10;
// Each level is worth more skill points the further the story's got: 1 a
// level in chapter 1, 2 in chapter 2, 3 in chapter 3... (the tree roughly
// doubles each chapter, so the points keep up with it).
// Points a level: the chapter's number, never more than the newest chapter
// the tree has skills for (a save that thinks it's past the last chapter
// built mustn't hand out extra).
const NEWEST_SKILL_CHAPTER = Math.max(...ALL_SKILL_BRANCHES.flatMap((branch) => branch.skills.map((skill) => skill.chapter ?? 1)));
// One a level per chapter (5 a level in chapter 5), never past the newest
// chapter that has skills.
const skillPointsPerLevel = (chapter = WORLD_STATE.chapter ?? 1) => Math.min(chapter, NEWEST_SKILL_CHAPTER);

const ALL_SKILLS = ALL_SKILL_BRANCHES.flatMap((branch) => branch.skills);

// EXP needed to go from `level` to the next. It climbs steeply, so levels come
// every few fights rather than every one: 46, 92, 147, 212, 285, 368, 460...
// (a full clear of the Ruins, Taper included, reaches about LV 5).
// In chapter 5 on, past LV 20, each level asks for more again on top, climbing
// faster the higher you go: +360 at LV 23, +1,000 at 25, +4,000 at 30.
const EXP_EASE = 0.92;
const STEEP_FROM = 20;
const STEEP = 40;
// Only from chapter 5 on: chapters 1-4 keep the curve they were balanced for.
const STEEP_CHAPTER = 5;
export function expToNext(level) {
  const past = (WORLD_STATE.chapter ?? 1) >= STEEP_CHAPTER ? Math.max(0, level - STEEP_FROM) : 0;
  return Math.round(EXP_EASE * (50 * level + 5 * (level - 1) * (level - 2)) + STEEP * past * past);
}

// Adds EXP, levelling up as many times as it covers. Returns the levels gained.
export function gainExp(amount) {
  HERO_STATE.exp += amount;
  let levels = 0;
  while (HERO_STATE.exp >= expToNext(HERO_STATE.level)) {
    HERO_STATE.exp -= expToNext(HERO_STATE.level);
    levelUp();
    levels++;
  }
  // A new level comes with a full recovery.
  if (levels) healHeroFully();
  return levels;
}

// One level up, with the skill points it brings: the hero's, and everyone's
// in the party (they grow with you). `chapter` is the chapter the level counts
// as gained in (the one you're on, unless catching up: catchUpTo).
function levelUp(chapter) {
  const points = skillPointsPerLevel(chapter);
  HERO_STATE.level++;
  HERO_STATE.skillPoints += points;
  HERO_STATE.memberPoints ??= {};
  for (const id of partyIds()) HERO_STATE.memberPoints[id] = (HERO_STATE.memberPoints[id] ?? 0) + MEMBERS[id].skillPointsPerLevel * points;
}

// Raises the hero to `level` (never lowers him), as if he'd earned every level
// on the way: the skill points each level gives the hero and the party, where
// `chapterOf(level)` says which chapter that level would have come in. Starts
// the new level with no EXP towards the next, at full HP. Returns the levels gained.
export function catchUpTo(level, chapterOf) {
  let levels = 0;
  while (HERO_STATE.level < level) {
    levelUp(chapterOf(HERO_STATE.level + 1));
    levels++;
  }
  if (levels) {
    HERO_STATE.exp = 0;
    healHeroFully();
  }
  return levels;
}

export function heroMaxHp() {
  return BASE_MAX_HP + (HERO_STATE.level - 1) * HP_PER_LEVEL;
}

// HP carries between battles: what you walk out of a fight with is what you
// walk into the next one with. Eating, Heal Pulse, levelling up and a night
// at an inn bring it back. A missing value (an old save) means full.
export function heroHp() {
  const max = heroMaxHp();
  const hp = HERO_STATE.hp ?? max;
  return Math.max(0, Math.min(max, hp));
}

export function setHeroHp(hp) {
  HERO_STATE.hp = Math.max(0, Math.min(heroMaxHp(), Math.round(hp)));
}

// Brings the hero back to full HP, and the friends with them.
export function healHeroFully() {
  HERO_STATE.hp = heroMaxHp();
  HERO_STATE.memberHp = {};
}

// The equipped armor's stats (src/data/armor.js).
export function heroDefense() {
  return armorStat(HERO_STATE.armor, 'defense');
}

// How strong spells are: 1, plus the armor's magic (never below a quarter).
export function spellPotency() {
  return Math.max(0.25, 1 + armorStat(HERO_STATE.armor, 'magic'));
}

export function armorSpGain() {
  return armorStat(HERO_STATE.armor, 'spGain');
}

export function hasSkill(id) {
  return HERO_STATE.skills.includes(id);
}

// One effect added up across every learned skill (true counts as 1). With
// `upToChapter`, only skills from that chapter or earlier count.
export function skillBonus(effect, upToChapter = Infinity) {
  return ALL_SKILLS
    .filter((skill) => hasSkill(skill.id) && effect in skill.effect && (skill.chapter ?? 1) <= upToChapter)
    .reduce((sum, skill) => sum + Number(skill.effect[effect]), 0);
}

// One effect added up across the skills a party member has learned on their
// own branches only (see MEMBER_SKILL_BRANCHES): their ally effects are theirs.
const MEMBER_SKILLS = Object.fromEntries(Object.entries(MEMBER_SKILL_BRANCHES).map(([id, branches]) => [id, branches.flatMap((branch) => branch.skills)]));
export function memberSkillBonus(id, effect) {
  return (MEMBER_SKILLS[id] ?? [])
    .filter((skill) => hasSkill(skill.id) && effect in skill.effect)
    .reduce((sum, skill) => sum + Number(skill.effect[effect]), 0);
}

// An old attack spell sharpened by a later skill (`sharpen: '<spell id>'`,
// "Rend II"): it's worked out as a spell of that skill's chapter, at the
// skill's `sharpPower` (see spellStrike in battleScene.js). The latest learned
// one counts; null if it hasn't been sharpened.
export function spellSharpening(id) {
  return ALL_SKILLS
    .filter((skill) => skill.effect.sharpen === id && hasSkill(skill.id))
    .reduce((best, skill) => ((skill.chapter ?? 1) > (best?.chapter ?? 0) ? { chapter: skill.chapter ?? 1, power: skill.effect.sharpPower } : best), null);
}

// Why a skill can't be learned right now, or null if it can.
// Whose points pay for a branch: the hero's, or a party member's.
export function pointsFor(branch) {
  return branch.member ? memberPoints(branch.member) : HERO_STATE.skillPoints;
}

export function skillBlocker(branch, index) {
  const skill = branch.skills[index];
  const before = branch.skills[index - 1];
  if (hasSkill(skill.id)) return 'Learned.';
  // Scripted skills (Nova) can't be bought: a cutscene gives them.
  if (skill.scripted) return 'Wakes by itself, at the end of the chapter.';
  if (before && !hasSkill(before.id)) return `Learn ${before.name} first.`;
  const who = branch.member ? `${MEMBERS[branch.member].name} needs` : 'Needs';
  if (pointsFor(branch) < skill.cost) return `${who} ${skill.cost} skill point${skill.cost === 1 ? '' : 's'}.`;
  return null;
}

export function learnSkill(branch, index) {
  if (skillBlocker(branch, index)) return false;
  const skill = branch.skills[index];
  if (branch.member) spendMemberPoints(branch.member, skill.cost);
  else HERO_STATE.skillPoints -= skill.cost;
  HERO_STATE.skills.push(skill.id);
  return true;
}

// A member's SPELLS in battle: their own `commands`, then any `learnable`
// ones a skill on their branches has taught them (a `command` effect).
export function memberCommands(id) {
  const member = MEMBERS[id];
  // Hurt, they've only their `hurt` SPELLS (Ves's need her umbrella).
  const hurt = hurtState(id);
  if (hurt) return [...hurt.commands];
  const learned = ALL_SKILLS
    .filter((skill) => hasSkill(skill.id) && skill.effect.command && member.learnable?.[skill.effect.command])
    .map((skill) => member.learnable[skill.effect.command]);
  return [...member.commands, ...learned];
}

// Spell ids the hero can cast: the starting ones, then any learned from skills.
export function knownSpells() {
  const learned = ALL_SKILLS.filter((skill) => hasSkill(skill.id) && skill.effect.spell).map((skill) => skill.effect.spell);
  return [...STARTING_SPELLS, ...learned];
}
