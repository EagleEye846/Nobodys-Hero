import { HERO_STATE } from './heroState.js';
import { MEMBERS, partyIds, memberPoints, spendMemberPoints } from './party.js';
import { ALL_SKILL_BRANCHES } from '../data/skills.js';
import { STARTING_SPELLS } from '../data/spells.js';
import { armorStat } from '../data/armor.js';

// Levelling and the skill tree: how EXP turns into levels, and what learned
// skills add up to.

const BASE_MAX_HP = 90;
const HP_PER_LEVEL = 10;
const SKILL_POINTS_PER_LEVEL = 1;

const ALL_SKILLS = ALL_SKILL_BRANCHES.flatMap((branch) => branch.skills);

// EXP needed to go from `level` to the next. It climbs steeply, so levels come
// every few fights rather than every one: 50, 100, 160, 230, 310, 400, 500...
// (a full clear of the Ruins, Taper included, reaches about LV 5).
export function expToNext(level) {
  return 50 * level + 5 * (level - 1) * (level - 2);
}

// Adds EXP, levelling up as many times as it covers. Returns the levels gained.
export function gainExp(amount) {
  HERO_STATE.exp += amount;
  let levels = 0;
  while (HERO_STATE.exp >= expToNext(HERO_STATE.level)) {
    HERO_STATE.exp -= expToNext(HERO_STATE.level);
    HERO_STATE.level++;
    HERO_STATE.skillPoints += SKILL_POINTS_PER_LEVEL;
    // Everyone in the party grows with you.
    HERO_STATE.memberPoints ??= {};
    for (const id of partyIds()) HERO_STATE.memberPoints[id] = (HERO_STATE.memberPoints[id] ?? 0) + MEMBERS[id].skillPointsPerLevel;
    levels++;
  }
  // A new level comes with a full recovery.
  if (levels) HERO_STATE.hp = heroMaxHp();
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

export function healHeroFully() {
  HERO_STATE.hp = heroMaxHp();
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

// One effect added up across every learned skill (true counts as 1).
export function skillBonus(effect) {
  return ALL_SKILLS
    .filter((skill) => hasSkill(skill.id) && effect in skill.effect)
    .reduce((sum, skill) => sum + Number(skill.effect[effect]), 0);
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
