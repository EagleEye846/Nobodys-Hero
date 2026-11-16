import { THE_LUM_PALETTE, THE_LUM_SPRITE, THE_LUM_ANIM, THE_LUM_CAUGHT_SPRITE, THE_LUM_CAUGHT_ANIM, THE_LUM_DEATH_LAST } from '../art/the_lum.js';

// THE LUM, the Ash Road's mini-boss ("lum" is an old word for a chimney): the
// last standing chimney stack of a burnt farmhouse at the gate of the buried
// town. The house burnt; the chimney didn't, and the fire in its hearth has
// never gone out. It walks on two fallen hearthstones and keeps the road,
// gruffly, the way an old farmer keeps a gate: nobody goes up to the town on
// its watch. It is not wicked. The hero never speaks, so every TALK is
// something he does, told in the panel.
//
// Two `phases` (see bossPhase in src/battle/battleScene.js):
//   1. SMOULDERING: bricks off the stack, smoke rings, sparks up the flue,
//      shovelled coals.
//   2. CAUGHT (at half its HP): its hearth catches. Fire out of its mouth and
//      its pot, the mortar glowing; it adds the blaze (fire across half the
//      box's floor) and its own chimney pot banging round the box, and
//      everything is hotter and faster.
// It CAN be won round (`gentle`: its attacks thin out as MERCY rises): warm
// your hands at it, sweep its hearth, set a fallen brick back, put the mug on
// the mantel straight, and bank its fire for the night, and then Pacify.
// Words are in text/enemies/the_lum.txt. The Hearth Brick (a keepsake,
// src/data/gear.js) is given by the scene after the fight, beaten or spared:
// the scene starts it with
//   { do: 'battle', enemy: 'the_lum', who: 'lum', spared: 'lum_spared', defeated: 'lum_beaten' }
// and the `lum_spared` / `lum_beaten` scenes each give it with { do: 'give', item: 'hearth_brick' }.
//
// Strength: harder than any chapter 5 regular (about three of the Ash Road's
// regulars), and well under a chapter's boss (about 20 good FIGHTs).

// Its attacks live in src/battle/attacks/the_lum.js.
const SMOULDERING_ATTACKS = [
  { name: 'lumBricks', weight: 3 },
  { name: 'lumRings', weight: 3 },
  { name: 'lumSparks', weight: 3 },
  { name: 'lumCoals', weight: 3 },
];
const CAUGHT_ATTACKS = [
  { name: 'lumBlaze', weight: 4, layer: false },
  { name: 'lumPot', weight: 3 },
  { name: 'lumBricks', weight: 2 },
  { name: 'lumRings', weight: 2 },
  { name: 'lumSparks', weight: 2 },
  { name: 'lumCoals', weight: 2 },
];

export const THE_LUM = {
  name: 'THE LUM',
  textFile: 'enemies/the_lum.txt',
  // In a room, it walks on its hearthstones (heavy shuffles that thud down).
  gait: 'stomp',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading). The game itself doesn't use it.
  area: 'ashroad',
  sprite: { rows: THE_LUM_SPRITE, palette: THE_LUM_PALETTE },
  anim: THE_LUM_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): ash and a spark when hit,
  // embers going up off it while it stands (its defeat is the boss finale).
  feel: { hit: 'ash', idle: 'embers', color: '#ff8c1a' },
  // Beaten, it doesn't fade: it stands there, its fire down to a red glow.
  beatenSprite: { rows: THE_LUM_DEATH_LAST, palette: THE_LUM_PALETTE },
  boss: true,
  gentle: true,
  // The Ash Road's mini-boss song. Until that song is in the game, a stand-in plays.
  music: 'ashMiniboss',
  // Its own backdrop: the ash road at the town gate, the burnt farmhouse behind it
  // (src/battle/ashBackdrops.js).
  backdrop: 'ashroad_gate',
  battlePos: { x: 206, y: 16 },
  // (13 November 2026: about 15 good FIGHTs at LV 50, a good FIGHT about 850; bosses are about 20.)
  maxHp: 13000,
  damage: 113,
  difficulty: { density: 2.0, speed: 1.72 },

  // Below 30% of its HP it adds a light second attack on top.
  secondWind: { below: 0.3, density: 0.25, delay: 2.4 },
  // Its turns run long: as one attack winds down, another follows (encore).
  encore: { at: 0.85, seconds: 5, density: 0.65 },
  // It comes up out of the ash in front of the gate (see stageBits.js).
  entrance: 'rise',
  introCard: { title: 'THE LUM', subtitle: 'The Fire That Never Went Out' },

  phases: [
    {
      id: 'smouldering',
      // On to the next phase at half its HP; it can't be knocked below that
      // (floor) until then, so the second phase is never skipped.
      until: { below: 0.5 },
      floor: 0.44,
      lowHp: 0.55,
      patterns: SMOULDERING_ATTACKS,
    },
    {
      id: 'caught',
      sprite: { rows: THE_LUM_CAUGHT_SPRITE, palette: THE_LUM_PALETTE },
      anim: THE_LUM_CAUGHT_ANIM,
      patterns: CAUGHT_ATTACKS,
      damage: 118,
      difficulty: { density: 2.15, speed: 1.85 },
      introSfx: 'thud',
      lowHp: 0.25,
      beat: [{ say: 'phase: caught' }, { who: 'vesper', say: 'phase: caught vesper' }, { who: 'foe', say: 'phase: caught foe' }],
    },
  ],

  // Every attack it has, across both phases (the battle checks there are enough).
  patterns: [
    { name: 'lumBricks', weight: 3 },
    { name: 'lumRings', weight: 3 },
    { name: 'lumSparks', weight: 3 },
    { name: 'lumCoals', weight: 3 },
    { name: 'lumBlaze', weight: 2, layer: false },
    { name: 'lumPot', weight: 2 },
  ],

  // TALK options: everything the hero does is told in the panel. Kindness to the
  // house wins it round (MERCY goes up); the order isn't forced, but the mug
  // only comes after the hearth is swept, and it will only let you bank its fire
  // once it has started to trust you.
  talk: [
    { name: 'Inspect' },
    { name: 'Warm your hands', calm: 25, once: true },
    { name: 'Sweep the hearth', calm: 25, once: true },
    { name: 'Set a brick back', calm: 20, once: true },
    { name: 'Straighten the mug', calm: 20, once: true, after: 'Sweep the hearth' },
    { name: 'Bank the fire', calm: 25, once: true, atCalm: 35 },
  ],
  lullCalm: 12,

  // About five Ash Road regulars of EXP, and a modest purse.
  rewards: { exp: 16000, coins: 60 },
};
