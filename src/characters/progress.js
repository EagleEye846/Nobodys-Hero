import { HERO_STATE } from './heroState.js';
import { SKILL_BRANCHES } from '../data/skills.js';
import { STARTING_SPELLS } from '../data/spells.js';

// Levelling and the skill tree: how EXP turns into levels, and what learned
// skills add up to.

const BASE_MAX_HP = 90;
const HP_PER_LEVEL = 8;
const SKILL_POINTS_PER_LEVEL = 1;

const ALL_SKILLS = SKILL_BRANCHES.flatMap((branch) => branch.skills);

// EXP needed to go from `level` to the next. It grows each level: 20, 40, 70, 110, 160...
export function expToNext(level) {
  return 20 + 15 * (level - 1) + 5 * (level - 1) ** 2;
}

// Adds EXP, levelling up as many times as it covers. Returns the levels gained.
export function gainExp(amount) {
  HERO_STATE.exp += amount;
  let levels = 0;
  while (HERO_STATE.exp >= expToNext(HERO_STATE.level)) {
    HERO_STATE.exp -= expToNext(HERO_STATE.level);
    HERO_STATE.level++;
    HERO_STATE.skillPoints += SKILL_POINTS_PER_LEVEL;
    levels++;
  }
  return levels;
}

export function heroMaxHp() {
  return BASE_MAX_HP + (HERO_STATE.level - 1) * HP_PER_LEVEL + skillBonus('maxHp');
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
export function skillBlocker(branch, index) {
  const skill = branch.skills[index];
  const before = branch.skills[index - 1];
  if (hasSkill(skill.id)) return 'Learned.';
  if (before && !hasSkill(before.id)) return `Learn ${before.name} first.`;
  if (HERO_STATE.skillPoints < skill.cost) return `Needs ${skill.cost} skill point${skill.cost === 1 ? '' : 's'}.`;
  return null;
}

export function learnSkill(branch, index) {
  if (skillBlocker(branch, index)) return false;
  const skill = branch.skills[index];
  HERO_STATE.skillPoints -= skill.cost;
  HERO_STATE.skills.push(skill.id);
  return true;
}

// Spell ids the hero can cast: the starting ones, then any learned from skills.
export function knownSpells() {
  const learned = ALL_SKILLS.filter((skill) => hasSkill(skill.id) && skill.effect.spell).map((skill) => skill.effect.spell);
  return [...STARTING_SPELLS, ...learned];
}
