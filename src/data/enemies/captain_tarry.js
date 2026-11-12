import {
  CAPTAIN_TARRY_PALETTE, CAPTAIN_TARRY_SPRITE, CAPTAIN_TARRY_ANIM,
  CAPTAIN_TARRY_MUTINY_SPRITE, CAPTAIN_TARRY_MUTINY_ANIM,
  CAPTAIN_TARRY_HEAVE_SPRITE, CAPTAIN_TARRY_HEAVE_ANIM, CAPTAIN_TARRY_DEATH_LAST,
} from '../art/captain_tarry.js';

// CAPTAIN TARRY, the midboss of the ghost ship: master of the brig Fair Return,
// which went down on the Wreck Yard's bar about a hundred years ago. He has not
// admitted it. He still gives the orders he gave that night, still trims her for
// the morning tide, still writes "Day 41. Port tomorrow." in the log. His crew
// answer "Aye, Captain" in a flat voice, because they cannot do anything else.
// He is not cruel: he promised their families he would bring them home. The
// hero never speaks, so every TALK is something the hero does, told in the
// panel. Every line is a DRAFT for the designer (text/enemies/captain_tarry.txt).
//
// Three `phases` (see bossPhase in src/battle/battleScene.js):
//   1. ORDERS (to 66% of his HP): upright, the speaking-trumpet to his mouth.
//      He draws the cutlass he doesn't want to use, runs out the guns, shouts
//      "Hard a-port!" in arcs of sound, and throws the last of his rum.
//   2. MUTINY (to 30%): his crew has stopped answering and he can't see why.
//      Coat torn, cutlass drawn and shaking. He adds boarders (his own crew,
//      walking over the rail with letters held out) and grappling lines.
//   3. HEAVE TO (the rest): the hat comes off. The deck lists, everything loose
//      rolls downhill (the box itself leans), and the ship's bell tolls "Make
//      port". The saddest and gentlest of the three, and the one where TALK
//      matters.
// He CAN be talked down (`gentle`: his attacks thin out as MERCY rises): tell
// him the date, read him a letter, show him the last page of the log, hold up
// the compass that points the wrong way, ask who is left to give orders to.
// Then, once MERCY is high, say it plainly. Pacify, and he gives one last
// order: "Make port." Beaten, he slumps ("Not yet... one more tide."). The
// ending scenes (`captain_spared`, `captain_beaten`) are the room's.
//
// Strength: between Old Gulper (39,500) and Corrie (63,500). About 14 rounds of
// good play at the level of the ship (see tools/ttkCheck.html).

// His attacks live in src/battle/attacks/captain_tarry.js.
const ORDERS_ATTACKS = [
  { name: 'tarryCutlass', weight: 3 },
  { name: 'tarryCannon', weight: 3 },
  { name: 'tarryOrders', weight: 3 },
  { name: 'tarryRum', weight: 2 },
];
const MUTINY_ATTACKS = [
  { name: 'tarryBoard', weight: 4 },
  { name: 'tarryRope', weight: 3 },
  { name: 'tarryCutlass', weight: 2 },
  { name: 'tarryCannon', weight: 2 },
  { name: 'tarryRum', weight: 2 },
  { name: 'tarryOrders', weight: 1 },
];
const HEAVE_ATTACKS = [
  { name: 'tarryList', weight: 4 },
  { name: 'tarryPort', weight: 3 },
  { name: 'tarryOrders', weight: 2 },
  { name: 'tarryRum', weight: 2 },
  { name: 'tarryCannon', weight: 2 },
];

export const CAPTAIN_TARRY = {
  name: 'CAPTAIN TARRY',
  textFile: 'enemies/captain_tarry.txt',
  gait: 'float',
  swims: true,
  // Where he belongs until he's placed in a room (the Studio lists him under
  // this area's heading). The game itself doesn't use it.
  area: 'ghostship',
  sprite: { rows: CAPTAIN_TARRY_SPRITE, palette: CAPTAIN_TARRY_PALETTE },
  anim: CAPTAIN_TARRY_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): wisps frayed off him when he's hit and a few
  // drifting off him (his defeat is the boss finale).
  feel: { hit: 'ghost', idle: 'wisps', at: [0.5, 0.55] },
  // Beaten (or spared), he doesn't vanish: he is still there, bare-headed, eyes shut, the hat held
  // to his chest, fading. The room's scene takes it from there.
  beatenSprite: { rows: CAPTAIN_TARRY_DEATH_LAST, palette: CAPTAIN_TARRY_PALETTE },
  boss: true,
  gentle: true,
  // "Still Under Way" (src/data/music/ghostCaptainBattleTheme.js): his march breaking down into the crew's shanty.
  music: 'ghostCaptainBattle',
  // The captain's cabin: the stern windows, the chart table, a deck that creaks (coastBackdrops.js).
  backdrop: 'ghostship_cabin',
  battlePos: { x: 196, y: 16 },
  maxHp: 42000,
  damage: 112,
  difficulty: { density: 1.85, speed: 1.6 },

  // Below 30% of his HP he adds a light second attack on top.
  secondWind: { below: 0.3, density: 0.25, delay: 2.4 },
  // Its turns run long: as one attack winds down, another follows (encore,
  // see startAttack in battleScene.js).
  encore: { at: 0.85, seconds: 5, density: 0.65 },
  // He rises out of the fog on the cabin floor, still giving the order he was in the middle of.
  entrance: 'rise',
  introCard: { title: 'CAPTAIN TARRY', subtitle: 'Still Under Way' },

  phases: [
    {
      id: 'orders',
      // On to the next phase at two thirds of his HP; he can't be knocked below that
      // (floor) until then, so the second phase is never skipped.
      until: { below: 0.66 },
      floor: 0.6,
      lowHp: 0.7,
      patterns: ORDERS_ATTACKS,
    },
    {
      id: 'mutiny',
      sprite: { rows: CAPTAIN_TARRY_MUTINY_SPRITE, palette: CAPTAIN_TARRY_PALETTE },
      anim: CAPTAIN_TARRY_MUTINY_ANIM,
      until: { below: 0.3 },
      floor: 0.26,
      patterns: MUTINY_ATTACKS,
      damage: 118,
      difficulty: { density: 1.95, speed: 1.68 },
      introSfx: 'bell',
      music: 'ghostCaptainBattle',
      musicFrom: 'M',
      lowHp: 0.35,
      beat: [{ say: 'phase: mutiny' }, { who: 'vesper', say: 'phase: mutiny vesper' }, { who: 'foe', say: 'phase: mutiny foe' }],
    },
    {
      id: 'heave',
      sprite: { rows: CAPTAIN_TARRY_HEAVE_SPRITE, palette: CAPTAIN_TARRY_PALETTE },
      anim: CAPTAIN_TARRY_HEAVE_ANIM,
      patterns: HEAVE_ATTACKS,
      damage: 122,
      difficulty: { density: 1.9, speed: 1.62 },
      introSfx: 'boom',
      music: 'ghostCaptainBattle',
      musicFrom: 'H',
      lowHp: 0.2,
      beat: [{ say: 'phase: heave' }, { who: 'vesper', say: 'phase: heave vesper' }, { who: 'foe', say: 'phase: heave foe' }],
    },
  ],

  // Every attack he has, across all three (the battle checks there are enough).
  patterns: [
    { name: 'tarryCutlass', weight: 3 },
    { name: 'tarryCannon', weight: 3 },
    { name: 'tarryOrders', weight: 3 },
    { name: 'tarryRum', weight: 2 },
    { name: 'tarryBoard', weight: 3 },
    { name: 'tarryRope', weight: 3 },
    { name: 'tarryList', weight: 3 },
    { name: 'tarryPort', weight: 2 },
  ],

  // TALK options: everything the hero does is told in the panel. Quiet kindness and the plain
  // truth bring him round (MERCY goes up). None of them is forced, but "Say it plainly" only comes
  // once the log has been shown and he has begun to listen (MERCY 55), and "Ask who is left" is
  // only there once you have asked the day.
  talk: [
    { name: 'Inspect' },
    { name: 'Ask the day', calm: 20, once: true },
    { name: 'Read him a letter', calm: 25, once: true },
    { name: 'Show him the log', calm: 25, once: true },
    { name: 'Hold up the compass', calm: 20, once: true },
    { name: 'Ask who is left', calm: 25, once: true, after: 'Ask the day' },
    { name: 'Say it plainly', calm: 30, once: true, after: 'Show him the log', atCalm: 55 },
  ],
  lullCalm: 12,

  // A little more than Old Gulper (13,000 / 70 coins): he is the longer, sadder fight, and the
  // chapter's second midboss. A level there costs about 28,000-30,000.
  rewards: { exp: 14500, coins: 80 },
};
