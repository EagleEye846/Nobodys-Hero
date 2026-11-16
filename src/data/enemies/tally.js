import { TALLY_PALETTE, TALLY_SPRITE, TALLY_CHAOS_SPRITE, TALLY_ANIM, TALLY_CHAOS_ANIM } from '../art/tally.js';

// QUIRE, the Welcome Register: Chapter 3's secret superboss, the star-touched
// guardian of the Fallen Star's shard. In the old city, the clerks kept one great
// ledger of everyone who had promised to be present on the day the Hero came,
// and counted it every night. When the star went over the Old Street low enough
// to chip its steps, a splinter of it went into the binding, and the book made
// one wish on it: that the count would come out right. The star granted it to
// the letter. Now it counts, by itself, and it will not stop, and it will add
// you to make the figures fit. Everyone on its list is present. Everyone but
// the Hero. It isn't mad or possessed: it is stuck inside a wish that came true
// the wrong way. Sparing it lets the wish go; beating it breaks it.
//
// It is chaotic the way a clerk is when the figures won't add up: tally
// strokes, ink, rubber stamps, loose pages, a quill, an abacus, a bookcase
// sliding shut, a list being ticked off, and in the last phase all of it at
// once. Every attack is warned. It can be spared, by a strange TALK: let it
// count you. (The hero never speaks: it's all what you do. It's all drafts, in
// text/enemies/tally.txt.)
//
// Started by the cutscene `tally_wakes` (battle step: spared: 'tally_spared',
// defeated: 'tally_beaten'); both ways out give you the shard.
//
// Its song is "Present and Correct" (src/data/music/tallyBattleTheme.js): each
// phase starts its own section of it (`musicFrom`), and sparing it plays the
// song's coda, 'present' (from tallySpared.js).

// Its attacks live in src/battle/attacks/tally.js.
const ROLL_CALL_ATTACKS = [
  { name: 'tallyMarks', weight: 3 },
  { name: 'tallyInk', weight: 3 },
  { name: 'tallyPages', weight: 2 },
  { name: 'tallyStamp', weight: 3 },
  { name: 'tallyFalling', weight: 2 },
];
const LATE_FEES_ATTACKS = [
  { name: 'tallyQuill', weight: 3 },
  { name: 'tallyAbacus', weight: 3 },
  { name: 'tallyShelves', weight: 3 },
  { name: 'tallyRollCall', weight: 3 },
  { name: 'tallyFalling', weight: 3 },
  { name: 'tallyStamp', weight: 1 },
];
const MARGINS_ATTACKS = [
  { name: 'tallyMargins', weight: 6 },
  { name: 'tallyMarks', weight: 1 },
  { name: 'tallyInk', weight: 1 },
  { name: 'tallyPages', weight: 1 },
  { name: 'tallyQuill', weight: 1 },
  { name: 'tallyAbacus', weight: 1 },
  { name: 'tallyShelves', weight: 1 },
  { name: 'tallyRollCall', weight: 1 },
  { name: 'tallyFalling', weight: 1 },
];

export const TALLY_BOSS = {
  name: 'QUIRE',
  textFile: 'enemies/tally.txt',
  area: 'valley',
  sprite: { rows: TALLY_SPRITE, palette: TALLY_PALETTE },
  // Its pages flutter, its star pulses, the quill and the stamp lift before an attack,
  // it flinches, comes apart when beaten, and bows when spared (src/data/art/tally.js).
  anim: TALLY_ANIM,
  feel: { hit: 'feather', color: '#eadfbb', windup: 'stamp', at: [0.2, 0.6], defeat: 'feathers' },
  battlePos: { x: 196, y: 12 },
  boss: true,
  entrance: 'rise',
  // "Present and Correct": the count in fives (src/data/music/tallyBattleTheme.js).
  music: 'tallyBattle',
  backdrop: 'valley',
  // Chapter 3's secret superboss: harder than the Hush (10500 HP, damage 46, then
  // 57 enraged), and it never stops hitting. It can be spared, so the HP is for
  // those who would rather fight. 13 November 2026: star guardians take about
  // 35-40 rounds of good FIGHTs from the party you meet them with (it was 50).
  maxHp: 13200,
  damage: 52,
  difficulty: { density: 1.85, speed: 1.28 },
  gentle: true,
  secondWind: { below: 0.25, density: 0.3, delay: 2.3 },
  introCard: { title: 'QUIRE', subtitle: 'Everyone Present' },

  phases: [
    {
      id: 'roll_call',
      until: { below: 0.66 },
      floor: 0.5,
      patterns: ROLL_CALL_ATTACKS,
    },
    {
      id: 'late_fees',
      until: { below: 0.33 },
      floor: 0.2,
      damage: 58,
      difficulty: { density: 1.95, speed: 1.31 },
      patterns: LATE_FEES_ATTACKS,
      flash: true,
      burst: '#eadfbb', // the book snaps open: parchment and star-light fly
      music: 'tallyBattle',
      musicFrom: 'lateFees', // the bars drift as the sums go wrong
      beat: [{ say: 'phase: late_fees' }, { who: 'vesper', say: 'phase: late_fees vesper' }, { who: 'foe', say: 'phase: late_fees foe' }],
    },
    {
      id: 'margins',
      sprite: { rows: TALLY_CHAOS_SPRITE, palette: TALLY_PALETTE },
      anim: TALLY_CHAOS_ANIM,
      flash: true,
      burst: '#e04a5a', // the red ink breaks out of the margins
      damage: 64,
      difficulty: { density: 1.97, speed: 1.34 },
      patterns: MARGINS_ATTACKS,
      music: 'tallyBattle',
      musicFrom: 'margins', // the count at two speeds at once
      beat: [{ say: 'phase: margins' }, { who: 'vesper', say: 'phase: margins vesper' }, { who: 'foe', say: 'phase: margins foe' }],
    },
  ],

  // Every attack it has, across its phases (the battle checks there are enough).
  patterns: [...ROLL_CALL_ATTACKS, ...LATE_FEES_ATTACKS],

  // TALK options. Nothing here says a word (the hero never does): it's all what
  // you do. It wants a head count: stand up and be counted. Signing the book is
  // the big one (and, it turns out, the right one).
  talk: [
    { name: 'Check' },
    { name: 'Stand in line', calm: 14 },
    { name: 'Raise a hand', calm: 18 },
    { name: 'Keep very quiet', calm: 14 },
    { name: 'Sign the book', calm: 28 },
  ],

  // The Hush gave 3470; this is more than a level's worth on top of it.
  rewards: { exp: 5400, coins: 480 },

  // Spared or beaten: a vial of the ink it ran on, still shining.
  drops: [{ item: 'star_ink', chance: 1 }],
};
