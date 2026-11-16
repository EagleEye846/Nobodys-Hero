import { DOWAGER_CRAB_PALETTE, DOWAGER_CRAB_SPRITE, DOWAGER_CRAB_ANIM, DOWAGER_CRAB_RILED_SPRITE, DOWAGER_CRAB_RILED_ANIM, DOWAGER_CRAB_DEATH_LAST } from '../art/dowager_crab.js';

// THE DOWAGER CRAB, Wrack Shore's midboss: a huge, very old, very polite
// hermit crab who lives in a bathtub with a ship's bell bolted on top, and who
// is deeply, correctly angry about trespass. She wants your feet wiped. The
// hero never speaks, so every TALK is something he does, told in the panel.
//
// Two `phases` (see bossPhase in src/battle/battleScene.js):
//   1. RECEIVING: she is cross but civil. The doormat, her pearls, the
//      minuet, the monocle, claws snipping across your way.
//   2. RILED (at half her HP): she has had quite enough. Her brows come down,
//      the bath water slops out of the tub, and she adds the tide (water over
//      half the box, from the taps or the plug), with the rest faster.
// She CAN be won round by manners (`gentle`: her attacks thin out as MERCY
// rises): wipe your feet, admire the tub, the bell, a curtsey, an apology, and
// then Pacify. Words are in text/enemies/dowager_crab.txt. The Bathtub Bell
// (a key in the Wrack Shore, gear.js) is given by her room after the fight,
// beaten or spared; she is not a fight you need to win to be let through.
//
// Strength: about 3x a Wrack regular (7,400-9,000 HP; in a pack each has a
// share of that, see groupHpShare in battleScene.js), under Old Gulper
// (31,000) and well under Corrie (50,000). 24,000 from 8 November 2026 (it was
// 3,600, then 7,600, then 12,500): with the party's chapter 5 skills she went
// down in about 7 rounds of good play, hardly longer than a regular.

// Her attacks live in src/battle/attacks/dowager_crab.js.
const RECEIVING_ATTACKS = [
  { name: 'crabMat', weight: 3 },
  { name: 'crabPearls', weight: 3 },
  { name: 'crabMinuet', weight: 3 },
  { name: 'crabMonocle', weight: 2 },
  { name: 'crabSnips', weight: 2 },
];
const RILED_ATTACKS = [
  { name: 'crabTide', weight: 4, layer: false },
  { name: 'crabSnips', weight: 3 },
  { name: 'crabMinuet', weight: 2 },
  { name: 'crabPearls', weight: 2 },
  { name: 'crabMonocle', weight: 2 },
  { name: 'crabMat', weight: 2 },
];

export const DOWAGER_CRAB = {
  name: 'DOWAGER CRAB',
  textFile: 'enemies/dowager_crab.txt',
  gait: 'stomp',
  // Where she belongs until she's placed in a room (the Studio lists her under
  // this area's heading). The game itself doesn't use it.
  area: 'wrack',
  sprite: { rows: DOWAGER_CRAB_SPRITE, palette: DOWAGER_CRAB_PALETTE },
  anim: DOWAGER_CRAB_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): a clack off her shell when hit (her defeat is
  // the boss finale).
  feel: { hit: 'shell' },
  // Beaten, she doesn't fade: she has sunk into the tub, and stays there.
  beatenSprite: { rows: DOWAGER_CRAB_DEATH_LAST, palette: DOWAGER_CRAB_PALETTE },
  boss: true,
  gentle: true,
  // "The Dowager Will See You Now" (crabBattle). Until that song is in the game,
  // the Wrack Shore shanty plays instead (see music in battleScene.js).
  music: 'crabBattle',
  backdrop: 'wrack',
  battlePos: { x: 202, y: 34 },
  maxHp: 30500,
  damage: 106,
  difficulty: { density: 1.95, speed: 1.70 },

  // Below 30% of her HP she adds a light second attack on top.
  secondWind: { below: 0.3, density: 0.25, delay: 2.4 },
  // Its turns run long: as one attack winds down, another follows (encore,
  // see startAttack in battleScene.js).
  encore: { at: 0.85, seconds: 5, density: 0.65 },
  // She scuttles in from the right and skids to a stop (see stageBits.js).
  entrance: 'charge',
  introCard: { title: 'THE DOWAGER CRAB', subtitle: 'Mistress of the Bathtub' },

  phases: [
    {
      id: 'receiving',
      // On to the next phase at half her HP; she can't be knocked below that
      // (floor) until then, so the second phase is never skipped.
      until: { below: 0.5 },
      floor: 0.44,
      lowHp: 0.55,
      patterns: RECEIVING_ATTACKS,
    },
    {
      id: 'riled',
      sprite: { rows: DOWAGER_CRAB_RILED_SPRITE, palette: DOWAGER_CRAB_PALETTE },
      anim: DOWAGER_CRAB_RILED_ANIM,
      patterns: RILED_ATTACKS,
      damage: 114,
      difficulty: { density: 2.10, speed: 1.82 },
      introSfx: 'thud',
      lowHp: 0.25,
      beat: [{ say: 'phase: riled' }, { who: 'vesper', say: 'phase: riled vesper' }, { who: 'foe', say: 'phase: riled foe' }],
    },
  ],

  // Every attack she has, across both phases (the battle checks there are enough).
  patterns: [
    { name: 'crabMat', weight: 3 },
    { name: 'crabPearls', weight: 3 },
    { name: 'crabMinuet', weight: 3 },
    { name: 'crabMonocle', weight: 2 },
    { name: 'crabSnips', weight: 2 },
    { name: 'crabTide', weight: 2, layer: false },
  ],

  // TALK options: everything the hero does is told in the panel. Manners win her
  // round (MERCY goes up); the right order is not forced, but the apology only
  // lands once she has started to thaw.
  talk: [
    { name: 'Inspect' },
    { name: 'Wipe your feet', calm: 25, once: true },
    { name: 'Admire the tub', calm: 25, once: true },
    { name: 'Point at the bell', calm: 20, once: true },
    { name: 'Curtsey', calm: 20, once: true, after: 'Wipe your feet' },
    { name: 'Apologise for the sand', calm: 25, once: true, atCalm: 35 },
  ],
  lullCalm: 12,

  // About one level at the Wrack (a level there costs about 11,000-13,700 since the 12 November curve), and a modest purse.
  rewards: { exp: 12000, coins: 60 },
};
