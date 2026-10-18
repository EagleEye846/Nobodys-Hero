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
// Chapter 2 effects:
//   spStart          SP you start every battle with (25 = 25%)
//   spellDiscount    spells cost this much less SP (0.2 = 20% off)
//   pacifyDiscount   Pacify alone costs this much less (0.5 = half price)
//   healBoost        Heal Pulse and Mend heal this much more (0.5 = +50%)
//   itemBoost        food heals this much more (0.3 = +30%)
//   mercyBoost       TALK, Lull and Hush raise MERCY this much more (0.25 = +25%)
//   goldBonus        more gold from every fight (0.25 = +25%)
//   swingPower       pump a rope swing up this much faster (0.5 = +50%)
//   bargain          shops charge this much less (0.15 = 15% off)
//   spellPower       attack spells hit this much harder (0.2 = +20%)
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
      { id: 'ember', name: 'Ember Flare', cost: 2, chapter: 2, effect: { spell: 'ember' } },
      { id: 'heavy_hand', name: 'Heavy Hand', cost: 2, chapter: 2, effect: { fightPower: 0.25 } },
      { id: 'comet', name: 'Comet', cost: 3, chapter: 2, effect: { spell: 'comet' } },
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
      { id: 'kindling', name: 'Kindling', cost: 1, chapter: 2, effect: { spStart: 25 } },
      { id: 'thrift', name: 'Thrift', cost: 2, chapter: 2, effect: { spellDiscount: 0.2 } },
      { id: 'mending_light', name: 'Mending Light', cost: 2, chapter: 2, effect: { spell: 'mend', healBoost: 0.5 } },
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
      { id: 'bright_ward', name: 'Bright Ward', cost: 2, chapter: 2, effect: { spell: 'ward' } },
      { id: 'warm_heart', name: 'Warm Heart', cost: 1, chapter: 2, effect: { itemBoost: 0.3 } },
      { id: 'iron_will', name: 'Iron Will', cost: 2, chapter: 2, effect: { damageReduction: 1 } },
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
      { id: 'strong_arms', name: 'Strong Arms', cost: 1, chapter: 2, effect: { swingPower: 0.5 } },
      { id: 'mountain_legs', name: 'Mountain Legs', cost: 1, chapter: 2, effect: { runSpeed: 0.25 } },
      { id: 'lucky_pockets', name: 'Lucky Pockets', cost: 2, chapter: 2, effect: { goldBonus: 0.25 } },
    ],
  },
  {
    // Chapter 2: the gentle way. Talking enemies down, and getting on with people.
    name: 'GRACE',
    icon: 'talk',
    color: '#ffd25e',
    chapter: 2,
    skills: [
      { id: 'kind_word', name: 'Kind Word', cost: 1, chapter: 2, effect: { mercyBoost: 0.25 } },
      { id: 'hush', name: 'Hush', cost: 2, chapter: 2, effect: { spell: 'hush' } },
      { id: 'gentle_hands', name: 'Gentle Hands', cost: 2, chapter: 2, effect: { pacifyDiscount: 0.5 } },
      { id: 'haggler', name: 'Haggler', cost: 2, chapter: 2, effect: { bargain: 0.15 } },
    ],
  },
  {
    // Chapter 2: spells for their own sake. Every attack spell hits harder
    // than your best FIGHT (see `power` in src/data/spells.js).
    name: 'ARCANA',
    icon: 'spells',
    color: '#5fb8ff',
    chapter: 2,
    skills: [
      { id: 'spark', name: 'Spark', cost: 1, chapter: 2, effect: { spell: 'spark' } },
      { id: 'arcane_focus', name: 'Arcane Focus', cost: 2, chapter: 2, effect: { spellPower: 0.2 } },
      { id: 'siphon', name: 'Siphon', cost: 2, chapter: 2, effect: { spell: 'siphon' } },
      { id: 'chain_bolt', name: 'Chain Bolt', cost: 2, chapter: 2, effect: { spell: 'chain' } },
      { id: 'nova', name: 'Nova', cost: 3, chapter: 2, effect: { spell: 'nova' } },
    ],
  },
];

// Party members' own branches (src/characters/party.js), keyed by member id:
// a page of the tree of their own, like the hero's (switch with SPACE).
// Each branch names its `member`, whose points pay for it, and can have a
// `chapter` like the hero's. Their effects work like the hero's, plus:
//   allyCalm     extra MERCY from an ally's calming move (Ves's FLURRY)
//   allySp       extra SP from an ally's move (Ves's ZEPHYR)
//   allyHeal     extra HP from an ally's healing move (Ves's ZEPHYR, AURORA)
//   allyStrike   extra damage from an ally's attack spells (SLEET and the rest)
//   shelterDef   extra taken off each hit while their SHELTER is up
//   gust         seconds their SHELTER also slows the next attack's bullets
//   command      a new SPELL for them: a key of their `learnable` commands
export const MEMBER_SKILL_BRANCHES = {
  vesper: [
    {
      name: 'UMBRELLA',
      icon: 'talk',
      color: '#9a7ad8',
      member: 'vesper',
      skills: [
        { id: 'ves_drift', name: 'Snowdrift', cost: 1, effect: { allyCalm: 5 } },
        { id: 'ves_hail', name: 'Hailstones', cost: 1, effect: { allyStrike: 4 } },
        { id: 'ves_warm', name: 'Warm Front', cost: 2, effect: { allyHeal: 6, allySp: 5 } },
        { id: 'ves_brim', name: 'Wide Brim', cost: 2, effect: { damageReduction: 1 } },
      ],
    },
    {
      // Her umbrella as a weapon: the wind and the weather, turned on enemies.
      name: 'GALE',
      icon: 'fight',
      color: '#7fd8f0',
      member: 'vesper',
      chapter: 2,
      skills: [
        { id: 'ves_squall', name: 'Squall', cost: 1, chapter: 2, effect: { allyStrike: 5 } },
        { id: 'ves_downdraft', name: 'Downdraft', cost: 2, chapter: 2, effect: { command: 'downdraft' } },
        { id: 'ves_tailwind', name: 'Tailwind', cost: 2, chapter: 2, effect: { gust: 2 } },
        { id: 'ves_whiteout', name: 'Whiteout', cost: 3, chapter: 2, effect: { command: 'whiteout' } },
      ],
    },
    {
      // Looking after you: warmth, cover, and the northern lights.
      name: 'HEARTH',
      icon: 'defend',
      color: '#ff9a6a',
      member: 'vesper',
      chapter: 2,
      skills: [
        { id: 'ves_cocoa', name: 'Cocoa Break', cost: 1, chapter: 2, effect: { allyHeal: 6 } },
        { id: 'ves_canopy', name: 'Double Canopy', cost: 2, chapter: 2, effect: { shelterDef: 1 } },
        { id: 'ves_aurora', name: 'Aurora', cost: 2, chapter: 2, effect: { command: 'aurora' } },
        { id: 'ves_steadfast', name: 'Steadfast', cost: 2, chapter: 2, effect: { allySp: 10 } },
      ],
    },
  ],
};

// Every skill there is, the hero's and the members'.
export const ALL_SKILL_BRANCHES = [...SKILL_BRANCHES, ...Object.values(MEMBER_SKILL_BRANCHES).flat()];

// Branches as they stand in `chapter`: each with only the skills you can
// learn by then, and branches with none left out.
function grownBy(branches, chapter) {
  return branches
    .map((branch) => ({ ...branch, skills: branch.skills.filter((skill) => (skill.chapter ?? 1) <= chapter) }))
    .filter((branch) => branch.skills.length);
}

// The tree as it stands in `chapter`, as pages: the hero's, then one for each
// of whoever's in the party (`members`, ids) who has branches. Each page is
// { member (null for the hero), branches }.
export function skillPages(chapter = 1, members = []) {
  const pages = [{ member: null, branches: grownBy(SKILL_BRANCHES, chapter) }];
  for (const id of members) {
    const branches = grownBy(MEMBER_SKILL_BRANCHES[id] ?? [], chapter);
    if (branches.length) pages.push({ member: id, branches });
  }
  return pages;
}
