import {
  FAIRWEATHER_PALETTE, FAIRWEATHER_SPRITE, FAIRWEATHER_ANIM,
  FAIRWEATHER_SHOWER_SPRITE, FAIRWEATHER_SHOWER_ANIM,
  FAIRWEATHER_CAROUSEL_SPRITE, FAIRWEATHER_CAROUSEL_ANIM,
  FAIRWEATHER_CHAOS_SPRITE, FAIRWEATHER_CHAOS_ANIM, FAIRWEATHER_DEATH_LAST,
} from '../art/fairweather.js';

// MADAM FAIRWEATHER, THE FIGUREHEAD: the secret superboss of Chapter 5, at the end of the ghost
// ship's deep part (the figurehead's perch, past the orlop, the sail locker and the flooded bow).
// The carved wooden woman on the brig Fair Return's prow. A piece of the Fallen Star came down
// on the ship a hundred years ago and lodged in her breast, and it woke her. On the ship's last good
// night she made one wish on it: that the night would never end. The star granted it to the letter,
// so it is a party nobody can leave, and she can't stop laughing: a laughing, spinning, beautiful
// creature, glad to see anyone at all, stuck inside a wish (not mad, not possessed). Sparing her lets
// the wish go; beating her breaks it. Possibly the real reason the ship never made port. Every line she has is in text/enemies/fairweather.txt (draft). The hero never speaks.
//
// Started by a cutscene step (the perch's `figurehead_wakes`):
//   { do: 'battle', enemy: 'fairweather', who: 'figurehead', noRun: true, spared: 'figurehead_spared', defeated: 'figurehead_beaten' }
// She can be beaten, and she can be talked down (a strange TALK, as with Jevil: she is playing, and
// the way out is to play, and then to say goodbye); either ends it and the matching scene plays.
//
// Four `phases` (see bossPhase in src/battle/battleScene.js), each at a quarter of her HP, each its
// own look in the box (src/battle/fairweatherStage.js):
//   1. THE LAUGH (to 75%): sea foam, carved splinters, her laughter as a rhythm.
//   2. STAR SHOWER (to 50%): stars fall in columns and break; comets that follow you; the box rocks.
//   3. THE CAROUSEL (to 25%): painted horses on rising and falling poles that turn about, ribbons
//      turning like spokes; the box turns round.
//   4. CHAOS: all of it at once, two attacks a turn, masks bouncing, and a second wind at the end.
// Each has a `floor` so a big hit can't skip the next, and `atLeast` turns so each gets its due.
//
// HER GIMMICK (14 November 2026): two rules for the box, src/battle/fairweatherDeck.js.
//   THE LIST: her deck heels over; your SHADOW slides downhill (a pull you can walk against),
//     and the slope swaps sides on her laugh (a bar's warning: a giggle, a creak).
//   THE DANCE: she has your hand; your SHADOW steps only on the beats of her song, Never Morning
//     (ONE two three: a glide each beat, a longer one on ONE; presses wait for the beat).
//   The Laugh: the list. Star Shower: the dance (she curtsies and asks, first). The Carousel:
//   the dance on a listing deck. Chaos: one then the other, swapping on every laugh.
//   Every attack fires on the song's beats and has a waltz version (fewer, slower, warned longer).
//
// Strength: harder than Corrie (63,500 HP, damage 120-138, about 0.7-0.84 hits a turn from a careful
// dodger). Hers: 85,000 HP, damage 142-154. Brought to target on 12 November (density/speed and her star
// volleys only, not damage): a careful dodger takes about 1.13 / 1.24 / 1.42 / 1.41 hits a turn by phase,
// 1.30 overall (the ladder: Quire 0.99, the Pale Olm 1.14, her 1.30). 14 November, with her deck rules
// (the bot stepping on the beats and sliding on the list): 1.13 / 1.17 / 1.40 / 1.43, 1.28 overall,
// at speed 2.0 / 2.15 / 2.12 / 2.06. Note her `density` hardly matters:
// her attacks time their cues in her own clock, so `speed` is the real dial (see notes/docs/superboss-ch5.md).

// Her attacks live in src/battle/attacks/fairweather.js.
const LAUGH_ATTACKS = [
  { name: 'fwFoam', weight: 2 },
  { name: 'fwSplinters', weight: 4 },
  { name: 'fwLaugh', weight: 2 },
  { name: 'fwComet', weight: 4 },
  { name: 'fwStars', weight: 2 }, // the Falling Star is hers from the first phase
];
const SHOWER_ATTACKS = [
  { name: 'fwStars', weight: 6 },
  { name: 'fwComet', weight: 3 },
  { name: 'fwLaugh', weight: 1 },
  { name: 'fwSplinters', weight: 1 },
];
const CAROUSEL_ATTACKS = [
  { name: 'fwSplinters', weight: 2 },
  { name: 'fwComet', weight: 2 },
  { name: 'fwCarousel', weight: 4 },
  { name: 'fwRibbons', weight: 4 },
];
const CHAOS_ATTACKS = [
  { name: 'fwChaos', weight: 5, layer: false },
  { name: 'fwMasks', weight: 1 },
  { name: 'fwCarousel', weight: 2 },
  { name: 'fwStars', weight: 3 },
  { name: 'fwComet', weight: 2 },
  { name: 'fwRibbons', weight: 2 },
];

export const FAIRWEATHER = {
  name: 'MADAM FAIRWEATHER',
  textFile: 'enemies/fairweather.txt',
  gait: 'float',
  area: 'ghostship',
  sprite: { rows: FAIRWEATHER_SPRITE, palette: FAIRWEATHER_PALETTE },
  anim: FAIRWEATHER_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): splinters off her when she's hit, star-light
  // drifting off her all the while.
  feel: { hit: 'ghost', idle: 'wisps', at: [0.5, 0.45] },
  // Beaten or spared she doesn't vanish: a figurehead again, eyes shut, the star out.
  beatenSprite: { rows: FAIRWEATHER_DEATH_LAST, palette: FAIRWEATHER_PALETTE },
  boss: true,
  gentle: true,
  // "Never Morning" (src/data/music/figureheadBattleTheme.js); each phase cuts to its own section:
  // shower to 'spin' (the star's own section), carousel to 'masquerade' (the lost waltz), chaos to 'chaos'.
  music: 'figureheadBattle',
  // The bowsprit's end: open sea, a sky of stars, the gilt rail (coastBackdrops.js).
  backdrop: 'ghostship_perch',
  battlePos: { x: 192, y: 2 },
  // 13 November 2026: star guardians take about 35-40 rounds of good FIGHTs
  // from the party you meet them with (85,000 was about 52).
  maxHp: 62000,
  damage: 142,
  difficulty: { density: 1.5, speed: 2.0 },
  // Her bullets are thick and gleaming: grazing past her gives a share of the usual SP.
  grazeSp: 0.3,
  // Her turns run long, one long attack each (no encore on top since 14 November: each
  // attack lasts the whole turn, to show off the list and the waltz it's played under).
  encore: null,
  turnSeconds: 11.5,
  // She rises out of the fog, laughing.
  entrance: 'whirl',
  introCard: { title: 'FAIRWEATHER', subtitle: 'The Figurehead' },
  lowHp: 0.3,

  phases: [
    {
      id: 'laugh',
      stage: 'fairweather',
      hitCalm: -2,
      until: { below: 0.75, atLeast: 4 },
      floor: 0.7,
      patterns: LAUGH_ATTACKS,
      gameOver: 'game_over: laugh',
    },
    {
      id: 'shower',
      stage: 'fairweather',
      hitCalm: -2,
      sprite: { rows: FAIRWEATHER_SHOWER_SPRITE, palette: FAIRWEATHER_PALETTE },
      anim: FAIRWEATHER_SHOWER_ANIM,
      introSfx: 'shimmer',
      flash: true,
      burst: '#ff9ae0',
      music: 'figureheadBattle',
      musicFrom: 'spin',
      patterns: SHOWER_ATTACKS,
      damage: 146,
      difficulty: { density: 1.85, speed: 2.15 },
      until: { below: 0.5, atLeast: 4 },
      floor: 0.45,
      gameOver: 'game_over: shower',
      // She curtsies, and asks you to dance: from here she has your hand (the waltz rule).
      beat: [{ say: 'phase: shower' }, { who: 'foe', say: 'phase: shower foe' }, { cue: 'curtsy' }, { who: 'foe', say: 'phase: shower curtsy foe' }, { who: 'vesper', say: 'phase: shower vesper' }],
    },
    {
      id: 'carousel',
      stage: 'fairweather',
      hitCalm: -2,
      sprite: { rows: FAIRWEATHER_CAROUSEL_SPRITE, palette: FAIRWEATHER_PALETTE },
      anim: FAIRWEATHER_CAROUSEL_ANIM,
      introSfx: 'boom',
      flash: true,
      burst: '#e8c060',
      music: 'figureheadBattle',
      musicFrom: 'masquerade',
      patterns: CAROUSEL_ATTACKS,
      damage: 150,
      difficulty: { density: 2.3, speed: 2.12 },
      until: { below: 0.25, atLeast: 4 },
      floor: 0.2,
      gameOver: 'game_over: carousel',
      beat: [{ say: 'phase: carousel' }, { who: 'foe', say: 'phase: carousel foe' }, { who: 'bramble', say: 'phase: carousel bramble' }],
    },
    {
      id: 'chaos',
      stage: 'fairweather',
      hitCalm: -2,
      sprite: { rows: FAIRWEATHER_CHAOS_SPRITE, palette: FAIRWEATHER_PALETTE },
      anim: FAIRWEATHER_CHAOS_ANIM,
      introSfx: 'flare',
      flash: true,
      burst: '#bff4ff',
      music: 'figureheadBattle',
      musicFrom: 'chaos',
      patterns: CHAOS_ATTACKS,
      damage: 154,
      difficulty: { density: 2.2, speed: 2.06 },
      secondWind: { below: 0.12, density: 0.3, delay: 2.4 },
      lowHp: 0.12,
      gameOver: 'game_over: chaos',
      beat: [{ say: 'phase: chaos' }, { who: 'foe', say: 'phase: chaos foe' }, { who: 'vesper', say: 'phase: chaos vesper' }],
    },
  ],

  // Every attack she has, across all four (the battle checks there are enough).
  patterns: [
    { name: 'fwFoam', weight: 3 },
    { name: 'fwSplinters', weight: 3 },
    { name: 'fwLaugh', weight: 3 },
    { name: 'fwStars', weight: 3 },
    { name: 'fwComet', weight: 3 },
    { name: 'fwCarousel', weight: 3 },
    { name: 'fwRibbons', weight: 3 },
    { name: 'fwMasks', weight: 3 },
    { name: 'fwChaos', weight: 3 },
  ],

  // TALK: she is playing, so the way to her is to play. None of it is forced, and she is not
  // easy to calm: it takes most of them (MERCY is the sum), and a hit costs a little (`hitCalm`).
  // "Say goodbye" only comes once she is listening (MERCY 70), and it ends it.
  talk: [
    { name: 'Inspect' },
    { name: 'Laugh along', calm: 10 },
    { name: 'Dance with her', calm: 14, once: true },
    { name: 'Catch a star', calm: 14, once: true },
    { name: 'Hold out a hand', calm: 16, once: true },
    { name: 'Ask her name', calm: 12, once: true },
    { name: 'Name the ship', calm: 22, once: true, after: 'Ask her name' },
    { name: 'Say goodbye', calm: 30, once: true, atCalm: 70 },
  ],
  lullCalm: 8,

  // The chapter's secret: well over Corrie's EXP (30,000) and gold. A fight that costs more than
  // anything in the game so far, once only.
  rewards: { exp: 40000, coins: 500 },
  drops: [{ item: 'starfall_cordial', chance: 1 }],
};
