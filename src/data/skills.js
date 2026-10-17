// The skill tree: branches, each a chain where every skill needs the one above
// it. Skill points (and max HP) only come from levelling up with EXP.
// Descriptions live in text/skills/skills.txt, one section per skill id.
//
// The tree grows with the story: a skill's `chapter` (1 if left out) is the
// chapter it becomes learnable in, and the SKILLS screen only shows the ones
// up to the chapter you're on (WORLD_STATE.chapter). Each new chapter should
// add about as many skills again as there were before (roughly doubling the
// tree): more spells, and new branches as the game opens up.
//
// Effects (added together across learned skills):
//   fightPower       extra FIGHT damage (0.15 = +15%)
//   strikeTolerance  how much wider the FIGHT bar's hit window is (0.3 = +30%)
//   strikeSlashes    extra FIGHT slashes
//   spell            a spell id from src/data/spells.js to learn
//   grazeSp          extra SP from grazing (0.25 = +25%)
//   grazeRadius      extra graze reach, in world pixels
//   damageReduction  less damage from every hit (never below 1)
//   iframes          extra seconds of invincibility after a hit
//   defendHeal       HP healed when you DEFEND
//   lastStand        once per battle, survive a knockout hit with 1 HP
//   runSpeed         faster running in the overworld (0.25 = +25%)
//   jumpHeight       extra jump height, in world pixels (12 is one block step)
//   softLanding      landings crack the floor only every other time
export const SKILL_BRANCHES = [
  {
    name: 'VALOR',
    icon: 'fight',
    color: '#ff8c1a',
    skills: [
      { id: 'sharpened', name: 'Sharpened', cost: 1, effect: { fightPower: 0.15 } },
      { id: 'keen_eye', name: 'Keen Eye', cost: 1, effect: { strikeTolerance: 0.3 } },
      { id: 'rend', name: 'Rend', cost: 2, effect: { spell: 'rend' } },
      { id: 'flurry', name: 'Flurry', cost: 2, effect: { strikeSlashes: 1 } },
    ],
  },
  {
    name: 'SPIRIT',
    icon: 'spells',
    color: '#b07cff',
    skills: [
      { id: 'focus', name: 'Focus', cost: 1, effect: { grazeSp: 0.25 } },
      { id: 'lull', name: 'Lull', cost: 1, effect: { spell: 'lull' } },
      { id: 'wide_graze', name: 'Wide Graze', cost: 2, effect: { grazeRadius: 4 } },
      { id: 'starfall', name: 'Starfall', cost: 2, effect: { spell: 'starfall' } },
    ],
  },
  {
    name: 'RESOLVE',
    icon: 'defend',
    color: '#4fe3d0',
    skills: [
      { id: 'tough', name: 'Thick Skin', cost: 1, effect: { damageReduction: 1 } },
      { id: 'steady_soul', name: 'Steady Shadow', cost: 1, effect: { iframes: 0.4 } },
      { id: 'guard_up', name: 'Guard Up', cost: 1, effect: { defendHeal: 8 } },
      { id: 'last_stand', name: 'Last Stand', cost: 2, effect: { lastStand: true } },
    ],
  },
  {
    // Getting around: running, jumping higher, landing lightly.
    name: 'STRIDE',
    icon: 'run',
    color: '#5fc27a',
    skills: [
      { id: 'sprinter', name: 'Sprinter', cost: 1, effect: { runSpeed: 0.25 } },
      { id: 'acrobat', name: 'Acrobat', cost: 2, effect: { jumpHeight: 12 } },
      { id: 'sure_foot', name: 'Sure Foot', cost: 2, effect: { softLanding: true } },
    ],
  },
];

// The tree as it stands in `chapter`: each branch with only the skills you can
// learn by then, and branches with none left out.
export function skillTree(chapter = 1) {
  return SKILL_BRANCHES
    .map((branch) => ({ ...branch, skills: branch.skills.filter((skill) => (skill.chapter ?? 1) <= chapter) }))
    .filter((branch) => branch.skills.length);
}
