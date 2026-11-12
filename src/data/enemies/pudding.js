import {
  PUDDING_PALETTE, PUDDING_SPRITE, PUDDING_ANIM,
  PUDDING_WAKE_SPRITE, PUDDING_WAKE_ANIM, PUDDING_CHAOS_SPRITE, PUDDING_CHAOS_ANIM, PUDDING_BEATEN_SPRITE,
} from '../art/pudding.js';

// THE PALE OLM: the secret superboss of Chapter 4, guardian of the Deep Star
// Shard at the bottom of Seam Nine's glassy shaft. (Its code id is still
// `pudding`, from its first draft name.) The miners' cave olm (a blind pale
// thing they kept in a tin dish by the kettle, like a mine canary, and called
// "Pale") touched the fallen star's shard in the pool at the foot of the shaft
// and warped: now huge and translucent like wet glass, with blood-red gills,
// a spine you can see, the star burning in its belly, and the miners' lost
// things (hat, boot, mug, watch) turning inside it. It keeps far too still,
// its mouth opens much too wide, seven eyes open down its side when the star
// wakes, and it talks only in the miners' voices. Underneath it is a sad
// thing, still waiting for everyone to come back after lunch.
// Everything it says is in text/enemies/pudding.txt (all drafts).
//
// Started by a cutscene step in the lair (draft: the parent's `pudding_wakes`):
//   { do: 'battle', enemy: 'pudding', who: 'pudding', still: true,
//     spared: 'pudding_spared', defeated: 'pudding_beaten' }
//
// Three phases (`phases`, see bossPhase in battleScene.js):
//   1. THE OLM: still and huge, swimming through the rock. Its gills sweep
//      light, it dives and throws stone, it blows glass bubbles, its tail
//      snakes through the box, and it throws the odd tin mug.
//   2. THE STAR WAKES (below 62%): the glass cracks, seven eyes open down its
//      side and the star in its belly blazes. Faster and denser; the star's rings of light and its hiccups
//      come in, and the old moves come back quicker.
//   3. CHAOS (below 30%): it has stopped choosing. The glass breaks into
//      other colours, its name scrambles, and its moves shuffle and overlap
//      every few seconds at their own speeds. At low HP it shatters
//      completely, once, in three stages (puddingShatter).
// TALK is the way to spare it, all through: the tea break, the old whistle,
// the seven mugs. Nothing about it is quite fair to hit your way through.
//
// Its attacks live in src/battle/attacks/pudding.js.

const OLM_ATTACKS = [
  { name: 'puddingGills', weight: 3 },
  { name: 'puddingSwim', weight: 3 },
  { name: 'puddingBubbles', weight: 3 },
  { name: 'puddingTail', weight: 3 },
  { name: 'puddingTea', weight: 2 },
];
const WAKE_ATTACKS = [
  { name: 'puddingStar', weight: 4 },
  { name: 'puddingFalling', weight: 3 },
  { name: 'puddingHiccup', weight: 3 },
  { name: 'puddingGills', weight: 2 },
  { name: 'puddingBubbles', weight: 2 },
  { name: 'puddingTail', weight: 2 },
  { name: 'puddingTea', weight: 2 },
  { name: 'puddingSwim', weight: 2 },
];
const CHAOS_ATTACKS = [
  { name: 'puddingChaos', weight: 4 },
  { name: 'puddingFalling', weight: 2 },
  { name: 'puddingStar', weight: 2 },
  { name: 'puddingHiccup', weight: 2 },
  { name: 'puddingTea', weight: 2 },
];
const FINALE = 'puddingShatter';

export const PUDDING = {
  name: 'PALE OLM',
  textFile: 'enemies/pudding.txt',
  area: 'diggings',
  // It floats and swims, so it doesn't lunge at the start.
  gait: 'float',
  swims: true,
  sprite: { rows: PUDDING_SPRITE, palette: PUDDING_PALETTE },
  anim: PUDDING_ANIM,
  // Beaten, the glass lies in pieces on the pool, and the star goes dull.
  beatenSprite: { rows: PUDDING_BEATEN_SPRITE, palette: PUDDING_PALETTE },
  feel: { hit: 'shell', idle: 'drip', color: '#bfeee8', defeat: 'splash', at: [0.3, 0.5] },
  // At the right of the box (64x50, drawn 2x, at 190,48), above the pool, tail in the stone.
  battlePos: { x: 190, y: 48 },
  backdrop: 'glass_pool',
  still: true,
  boss: true,
  // It rises up out of the rock it was swimming in.
  entrance: 'rise',
  // "Seven Mugs" (puddingBattleTheme.js): a glass-harmonica waltz on the
  // miners' end-of-shift whistle. Each phase cuts to its own part of it
  // (`musicFrom`), and the last gauntlet to the shatter.
  music: 'puddingBattle',

  // 1.5x King Peptup's 16,800: the hardest fight of the chapter by a long way.
  maxHp: 25200,
  damage: 64,
  difficulty: { density: 1.6, speed: 1.3 },
  turnSeconds: 10,
  // In a last stand, a lighter second attack lays over the first.
  secondWind: { below: 0.12, density: 0.3, delay: 2.5 },
  lowHp: 0.62,

  introCard: { title: 'THE PALE OLM', subtitle: 'Back After Lunch' },
  phases: [
    {
      id: 'olm',
      until: { below: 0.62, turns: 16, atLeast: 5, now: true },
      floor: 0.58,
      lowHp: 0.7,
      patterns: OLM_ATTACKS,
      damage: 60,
      difficulty: { density: 1.3, speed: 1.2 },
    },
    {
      id: 'wake',
      sprite: { rows: PUDDING_WAKE_SPRITE, palette: PUDDING_PALETTE },
      anim: PUDDING_WAKE_ANIM,
      patterns: WAKE_ATTACKS,
      until: { below: 0.3, now: true },
      floor: 0.26,
      damage: 64,
      difficulty: { density: 1.6, speed: 1.35 },
      introSfx: 'crumble',
      flash: true,
      burst: '#9fe8ff',
      lowHp: 0.4,
      music: 'puddingBattle',
      musicFrom: 'wake', // the waltz tightens into 6/8
      beat: [{ say: 'phase: wake' }, { who: 'vesper', say: 'phase: wake vesper' }, { who: 'foe', say: 'phase: wake foe' }],
    },
    {
      id: 'chaos',
      sprite: { rows: PUDDING_CHAOS_SPRITE, palette: PUDDING_PALETTE },
      anim: PUDDING_CHAOS_ANIM,
      patterns: CHAOS_ATTACKS,
      damage: 66,
      difficulty: { density: 1.55, speed: 1.38 },
      introSfx: 'crumble',
      flash: true,
      burst: '#ffffff',
      lowHp: 0.2,
      music: 'puddingBattle',
      musicFrom: 'chaos', // the bars and the key stop holding still
      // Its name scrambles, and settles, and scrambles.
      anagram: ['PALE OLM', 'PLAE OML', 'ELAP MOL', 'OLM PALE', 'LAPE LOM', 'MOL ELAP', 'PALE OLM'],
      nameSwap: 0.3,
      nameJitter: true,
      // One last gauntlet, once, when it is nearly done: the whole glass goes.
      // (The music cuts to the song's shatter: a beat of nothing, a wall of glass, three chords.)
      finale: { below: 0.15, hold: 0.1, pattern: FINALE, difficulty: { density: 1.3, speed: 1.25 }, music: 'puddingBattle', musicFrom: 'shatter' },
      beat: [{ say: 'phase: chaos' }, { anagram: true }, { who: 'vesper', say: 'phase: chaos vesper' }, { who: 'foe', say: 'phase: chaos foe' }],
    },
  ],

  // Every attack it has, across all three phases (the battle checks there are enough).
  patterns: [...OLM_ATTACKS, ...WAKE_ATTACKS, ...CHAOS_ATTACKS, { name: FINALE, weight: 0 }],

  // TALK: the way to spare it, and it takes the whole tea break. Each thing
  // once, in an order that makes sense (the dish before the tea, the
  // end of the shift last).
  talk: [
    { name: 'Inspect' },
    { name: 'Offer the half pasty', calm: 20, once: true },
    { name: 'Tap the tin dish', calm: 15, once: true },
    { name: 'Whistle the end of shift', calm: 20, once: true },
    // Only with the whole whistle (the quest from Seam Nine's roster): the real thing, not a hummed copy.
    { name: 'Blow the shift whistle', calm: 25, once: true, gear: 'shift_whistle', after: 'Whistle the end of shift' },
    { name: 'Count the mugs', calm: 15, once: true, after: 'Tap the tin dish' },
    { name: 'Pour it a cup of tea', calm: 25, once: true, after: ['Offer the half pasty', 'Tap the tin dish'] },
    { name: 'Say back after lunch', calm: 30, once: true, atCalm: 50 },
  ],
  lullCalm: 12,

  // Chapter 4's biggest purse of experience by far (King Peptup's whole show is 8,390).
  rewards: { exp: 12000, coins: 60 },
};
