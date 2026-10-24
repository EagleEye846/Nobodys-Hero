import { WARDEN_PALETTE, WARDEN_SPRITE, WARDEN_CRACKED_SPRITE, WARDEN_CRUMBLING_SPRITE, wardenAnim } from '../art/warden.js';

// THE WARDEN OF THE GATE: Chapter 3's first boss of its climax, at the end
// of the Dead City. A colossal stone statue of the prophesied Hero, built by
// the old city to greet him, standing before the Hero's Gate with its stone
// sword raised in welcome. It has waited three hundred years. When you come
// (at_the_gate starts this fight), it wakes to judge you and finds you
// wanting: the wrong height, the wrong face, and no name. It isn't evil.
// It's a monument doing its job. It can't be talked round: it has to break,
// and when it falls, the Gate comes down with it (warden_breaks plays
// after). Everything it says is in text/enemies/warden.txt.
//
// Its fight comes in three `phases` (see the battle's bossPhase in
// src/battle/battleScene.js) as you break it: each starts once its HP is
// down to a share of its max (`until: { below }`), with its own attacks,
// lines and look (it cracks, then crumbles):
//   1. WELCOME: it greets you the way it was built to (the sword, the
//      garland, the open hand, the prophecy).
//   2. JUDGEMENT: it measures you, and you don't fit.
//   3. RUIN: it's coming apart, and the Gate with it. Desperate.
// Ves is with you, hurt (her leg, and her umbrella's gone): her turn is
// COVER and CALL OUT. She says what the hero can't, as each phase starts.
// It can't be spared, at all: no MERCY meter, and every try at it, it turns
// down itself, sadly and formally ([mercy_mock]).

// Its attacks live in src/battle/attacks/warden.js.
const WELCOME_ATTACKS = [
  { name: 'wardenSword', weight: 3 },
  { name: 'wardenGarland', weight: 2 },
  { name: 'wardenProphecy', weight: 3 },
  { name: 'wardenHand', weight: 2 },
];
const JUDGEMENT_ATTACKS = [
  { name: 'wardenMeasure', weight: 3 },
  { name: 'wardenMould', weight: 3 },
  { name: 'wardenCompare', weight: 2 },
  { name: 'wardenVerdict', weight: 2 },
];
const RUIN_ATTACKS = [
  { name: 'wardenMasonry', weight: 3 },
  { name: 'wardenGate', weight: 3 },
  { name: 'wardenCracks', weight: 2 },
  { name: 'wardenLastWelcome', weight: 2 },
];

export const WARDEN_BOSS = {
  name: 'WARDEN',
  textFile: 'enemies/warden.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading). The game itself doesn't use it.
  area: 'valley',
  sprite: { rows: WARDEN_SPRITE, palette: WARDEN_PALETTE },
  // Its eyes' light coming and going, the sword lifting to strike, chips
  // knocked off it, and, beaten, its breaking (wardenAnim in its art file).
  // Each phase has its own, worked out from that phase's sprite.
  anim: wardenAnim(WARDEN_SPRITE, 1),
  // Beaten, it doesn't fade: it stands there, broken and still (it falls
  // in warden_breaks, just after; WARDEN_FALLEN_SPRITE is it fallen, if a
  // scene ever wants it in this palette).
  beatenSprite: { rows: WARDEN_CRUMBLING_SPRITE, palette: WARDEN_PALETTE },
  // It's huge (56x80, drawn at twice that), so it stands right of the box
  // with the top of its sword going up out of sight.
  battlePos: { x: 204, y: -24 },
  // Stone doesn't bob up and down like the others do.
  still: true,
  boss: true,
  // "Found Wanting" (wardenBattleTheme.js).
  music: 'wardenBattle',
  // The Dead City, with the Hero's Gate behind (src/battle/backdrops.js).
  backdrop: 'valley',
  // Clearly the hardest fight so far: above the Usurper (1400 HP, damage
  // 19, density 1.3 to 1.45) and every Chapter 3 regular (540 to 760 HP,
  // damage 20 to 28), and everything lands, start to finish.
  maxHp: 2400,
  damage: 30,
  difficulty: { density: 1.4, speed: 1.2 },

  // At the very end, below a fifth of its HP, it layers a lighter second
  // attack on top of the first.
  secondWind: { below: 0.2, density: 0.3, delay: 2.5 },
  // It drops into its place at the Gate, and the ground shakes (see stageBits.js).
  entrance: 'slam',
  // Its entrance: a title card before the fight (its lines are [boss_intro]).
  introCard: { title: 'THE WARDEN OF THE GATE', subtitle: 'At the Hero\'s Gate' },

  phases: [
    {
      id: 'welcome',
      // On to the next phase once its HP is down to this share of its max
      // (checked after each of its turns). It can't be knocked below `floor`
      // before then, so no phase gets skipped.
      until: { below: 0.66 },
      floor: 0.45,
      patterns: WELCOME_ATTACKS,
    },
    {
      id: 'judgement',
      until: { below: 0.33 },
      floor: 0.12,
      sprite: { rows: WARDEN_CRACKED_SPRITE, palette: WARDEN_PALETTE },
      anim: wardenAnim(WARDEN_CRACKED_SPRITE, 2),
      patterns: JUDGEMENT_ATTACKS,
      difficulty: { density: 1.5, speed: 1.28 },
      // What happens as it starts: narration in the panel, then Ves (in her
      // box, with her portrait), then it (in a speech bubble).
      beat: [{ say: 'phase: judgement' }, { who: 'vesper', say: 'phase: judgement vesper' }, { who: 'foe', say: 'phase: judgement foe' }],
    },
    {
      id: 'ruin',
      sprite: { rows: WARDEN_CRUMBLING_SPRITE, palette: WARDEN_PALETTE },
      anim: wardenAnim(WARDEN_CRUMBLING_SPRITE, 3),
      patterns: RUIN_ATTACKS,
      difficulty: { density: 1.6, speed: 1.35 },
      beat: [{ say: 'phase: ruin' }, { who: 'vesper', say: 'phase: ruin vesper' }, { who: 'foe', say: 'phase: ruin foe' }],
    },
  ],

  // Every attack it has, across its phases (the battle checks there are enough).
  patterns: [...WELCOME_ATTACKS, ...JUDGEMENT_ATTACKS, ...RUIN_ATTACKS],

  // No mercy: no MERCY meter, and every try at it (a kind TALK, a calming
  // spell, Pacify, a sweet candle, Ves's kind word) it turns down itself, in
  // speech bubbles ([mercy_mock], then [mercy_mock_again]).
  noMercy: { who: 'foe', meter: false },

  // TALK options. Each name needs a [talk: Name] section in the text file
  // (and can have a different one for each phase: [talk: Name: ruin]).
  // None of them help; Bow is a kind one, so it's turned down like mercy.
  talk: [
    { name: 'Check' },
    { name: 'Stand up straight' },
    { name: 'Bow', calm: 20 },
    { name: 'Point at Ves' },
  ],

  // Well above the Usurper's 600: most of a level, at the Gate.
  rewards: { exp: 900, coins: 250 },

  // The city's offering to the Hero, left in its open hand.
  drops: [{ item: 'heros_offering', chance: 1 }],
};
