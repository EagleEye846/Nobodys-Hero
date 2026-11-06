import {
  RUMBOLD_PALETTE, RUMBOLD_JAMMED_SPRITE, RUMBOLD_BEATEN_SPRITE, RUMBOLD_JAMMED_ANIM,
} from '../art/rumboldBattle.js';
// (The living king's art, phase 3: read through the module, so the fight
// still runs, as the jammed king, if any of it is missing.)
import * as ART from '../art/rumboldBattle.js';
// (The show: the king as everyone in Belowtown knows him, a man.)
import { KING_SPRITE, KING_PALETTE, KING_SHOW_ANIM } from '../art/peptupKing.js';

// KING PEPTUP THE RESPLENDENT: Chapter 4's last boss, the royal duel on the
// throne-hall stage (scene `rumbolds_duel`, in belowtown_throne). He is a big
// carved wooden marionette man with a jaw on a hinge, and he calls the duel as a SHOW.
// In the battle he's drawn as what's under the paint: a bare jointed
// mannequin hanging on strings from a control bar, on a dark stage, digging
// faces into his blank wooden head with his fingertips when he wants one
// (src/data/art/rumboldBattle.js, peptupPuppet.js).
// He can't move: Tuck, the shy dormouse who has been your guide all chapter,
// sits behind the curtain and works him like a puppet, and does the voice.
// He has for forty-two years. Everything he says is in text/enemies/rumbold.txt
// (his lines are voice-acted: see the `voice:` comments there).
//
// Started by a cutscene step:
//   { do: 'battle', enemy: 'rumbold', who: 'king', noRun: true,
//     spared: 'rumbold_spared', defeated: 'rumbold_defeated' }
// He can't be spared in his last act (he snaps the MERCY bar), so it ends
// with him beaten: the light goes out of him and the scene named plays in belowtown_throne. Tuck
// is unhurt either way; the king is a heap of painted wood.
//
// The fight has three phases (`phases`, see bossPhase in battleScene.js):
//   1. THE SHOW: the king on his throne, the curtain closed behind him. He
//      never moves but in big jerky lurches; his jaw clacks as he talks. A
//      stage show's worth of attacks. There's no MERCY (it's a performance,
//      and nobody's listening to the audience): trying it gets showbiz
//      deflection. Your shadow has a pair of scissors for this fight (below).
//   2. BEHIND THE CURTAIN: the jam. At half his HP, or after enough turns,
//      his jaw jams half open with a clunk, an eye rolls off, and the curtain
//      slips: Tuck, on his stool, both hands on the levers. The king's
//      voice keeps going, perfectly clear, and his mouth doesn't move. Music
//      turns to "Behind the Curtain". The attacks fall apart (smaller and
//      slower, nothing meant to hurt), and TALK is to Tuck now: MERCY
//      fills (each thing said once, in a natural order). Hitting the king
//      only makes the show louder (and costs a little MERCY). When Tuck's
//      MERCY is full (he's ready to come out from behind the puppet), or
//      the king's knocked down to this half's floor, Tuck lets go of the
//      levers. The puppet should fall limp.
//   3. NO STRINGS: it doesn't. In the quiet, something lights up inside the
//      hollow wood (warm, and a little cold), and shows through his eye
//      holes and every joint. His head ticks up on its own. His name rattles
//      back from PUPPET to PEPTUP: he's taking it. The light mends him (his
//      HP climbs back), the strings whip over and haul Tuck up off his stool
//      like a marionette, and the show is his: manic, stuck on words, stage
//      cues leaking into everything he says. Music: "No Strings". His own
//      attacks (rumboldAlive.js), and the stage goes strange with him (the
//      house lights, the box on ropes, your buttons on his strings:
//      src/battle/puppetStage.js). TALK is to Tuck, strung up beside him,
//      but he can't be spared: the first try, he takes the MERCY bar and
//      snaps it in half. He has to be knocked down. The light slips out of
//      him and away up the hall, and the wood is just wood.
//
// The shadow's own power for this fight: CUT THE STRING (SHIFT), scissors
// that snip any cuttable string near it (soulAbility 'snip' in
// src/battle/soulAbilities.js). It replaces whatever the weapon gives, but
// only from the jam on: through the show nobody knows there are strings, so
// your weapon's own power stays, and the hook-and-reel strings come later.
// Puppet strings that hook and reel you in, and the cords prop swords
// hang by, are cuttable.

// His attacks live in src/battle/attacks/rumbold.js, rumboldBroken.js and
// rumboldAlive.js.
const SHOW_ATTACKS = [
  { name: 'rumboldSpotlights', weight: 3 },
  { name: 'rumboldTrapdoors', weight: 3 },
  { name: 'rumboldSwords', weight: 3 },
  { name: 'rumboldConfetti', weight: 2 },
  { name: 'rumboldChorus', weight: 2 },
  { name: 'rumboldApplause', weight: 2 },
  { name: 'rumboldCurtain', weight: 2 },
  { name: 'rumboldFinale', weight: 2 },
];
const BROKEN_ATTACKS = [
  // (His strings, out in the open now that you've seen them.)
  { name: 'rumboldStrings', weight: 2 },
  { name: 'rumboldFlicker', weight: 2 },
  { name: 'rumboldTangle', weight: 3 },
  { name: 'rumboldFizzle', weight: 2 },
  { name: 'rumboldStumble', weight: 2 },
  { name: 'rumboldRestart', weight: 2 },
  { name: 'rumboldStuckSign', weight: 2 },
];
const ALIVE_ATTACKS = [
  { name: 'rumboldAliveLimbs', weight: 3 },
  { name: 'rumboldAliveJaw', weight: 3 },
  { name: 'rumboldAliveCues', weight: 2 },
  { name: 'rumboldAliveDance', weight: 3 },
  { name: 'rumboldAliveTuck', weight: 3 },
  { name: 'rumboldAliveLight', weight: 3 },
  { name: 'rumboldAliveWorkYou', weight: 3 },
];
// His finale, played once when he's low (the alive phase's `finale`).
const ALIVE_FINALE = 'rumboldAliveTear';

// The living king's look (all of RUMBOLD_ALIVE_ANIM but its `intro`: his
// coming alive is played step by step by the phase's beat instead, in
// puppetStage.js).
const ALIVE_SPRITE = ART.RUMBOLD_ALIVE_SPRITE ?? RUMBOLD_JAMMED_SPRITE;
const ALIVE_ANIM = ART.RUMBOLD_ALIVE_ANIM ? { ...ART.RUMBOLD_ALIVE_ANIM, intro: undefined } : RUMBOLD_JAMMED_ANIM;

export const RUMBOLD_BOSS = {
  name: 'PEPTUP',
  textFile: 'enemies/rumbold.txt',
  area: 'belowtown',
  // Through the show he's the king as Belowtown knows him: a man, no strings
  // (peptupKing.js). The mannequin on its bar is only seen once his jaw jams.
  sprite: { rows: KING_SPRITE, palette: { ...RUMBOLD_PALETTE, ...KING_PALETTE } },
  anim: KING_SHOW_ANIM,
  // Beaten, he comes apart (the `death` clip) and what's left is his pieces
  // on the boards, and Tuck up in the rafters, unhurt.
  beatenSprite: { rows: RUMBOLD_BEATEN_SPRITE, palette: RUMBOLD_PALETTE },
  // In battle (88x82, from the top of the stage down to the boards) he's at
  // the right of the box, on the dark stage (src/battle/theatreBackdrop.js):
  // the king through the show, then the bare mannequin on its strings.
  battlePos: { x: 144, y: 0 },
  backdrop: 'theatre',
  // He hangs; his own clips sway him.
  still: true,
  boss: true,
  // The curtains part on him (stageBits.js).
  entrance: 'curtain',
  // "The Resplendent Hour" (rumboldTheme.js); "Behind the Curtain" after the jam.
  music: 'rumbold',
  // The chapter's hardest fight, well above the Hush (7200 HP, 40 damage,
  // density 1.6; its rage 50 damage at 2 and 1.4): more HP, more damage, a
  // denser show, and a last act harder than anything yet. Half of his HP is the
  // show; most of the rest is what's left of it, lighter, and can be ended
  // by talking; and then the light in him mends him back up to 60% for the
  // last act (beaten every step of the way, about 12,100 HP in all; the last
  // act has to be won by fighting, so it's kept to about 20 turns).
  maxHp: 13200,
  damage: 67,
  difficulty: { density: 2, speed: 1.3 },
  // In a last stand he layers a lighter second act on the first.
  secondWind: { below: 0.3, density: 0.35, delay: 2.5 },
  // Low on HP (but see each phase's `lowHp`), his taunts are often [low_hp].
  lowHp: 0.62,

  // Your shadow's power for this fight.
  soulAbility: 'snip',

  introCard: { title: 'KING PEPTUP', subtitle: 'The Resplendent' },
  // His name under the throne rearranges itself through the show, two letters
  // hopping past each other at a time, and reads PUPPET as his jaw jams.
  anagram: ['PEPTUP', 'PEPUTP', 'PEUPTP', 'PUEPTP', 'PUPETP', 'PUPEPT', 'PUPPET'],

  phases: [
    {
      id: 'show',
      // No scissors yet: your weapon's own power (see soulAbility above).
      soulAbility: null,
      // It's a performance: nobody can be reached through it. His own bubbles
      // answer any try at kindness ([mercy_mock]), and the MERCY bar isn't shown.
      noMercy: { who: 'foe', meter: false },
      // He can't be finished before the jam.
      floor: 0.38,
      // (Low for the show: he's near the jam.)
      lowHp: 0.62,
      // The jam: at half his HP, or after this many of his turns, but not
      // before he has had a few turns to show off in.
      until: { below: 0.5, turns: 14, atLeast: 4, now: true },
      patterns: SHOW_ATTACKS,
    },
    {
      id: 'behind',
      // The strings are out: CUT THE STRING from here on.
      soulAbility: 'snip',
      // "Behind the Curtain."
      music: 'rumboldJammed',
      sprite: { rows: RUMBOLD_JAMMED_SPRITE, palette: { ...RUMBOLD_PALETTE, ...KING_PALETTE } },
      anim: RUMBOLD_JAMMED_ANIM,
      patterns: BROKEN_ATTACKS,
      // The show carrying on, badly: easier and gentler, and softer still as
      // MERCY rises.
      damage: 53,
      difficulty: { density: 1.4, speed: 1.1 },
      gentle: true,
      // (No last stand here: it's falling apart, not fighting.)
      secondWind: null,
      flash: true,
      // The paint cracking off him (the `intro` clip's start).
      introSfx: 'crumble',
      // Now it's Tuck you talk to: each thing once, and in an order that
      // makes sense (his name first; a hand held out last).
      talk: [
        { name: 'Check' },
        { name: 'Ask Tuck his name', calm: 20, once: true },
        { name: 'Tell Tuck the voice is good', calm: 25, once: true, after: 'Ask Tuck his name' },
        { name: 'Say you can see him', calm: 25, once: true, after: 'Ask Tuck his name' },
        { name: 'Hold out a hand to the rafters', calm: 30, once: true, after: ['Tell Tuck the voice is good', 'Say you can see him'] },
      ],
      // Hitting the king only makes the show louder, and costs you a little
      // of Tuck's trust.
      hitCalm: -12,
      // Not to be finished here: there's a last act.
      floor: 0.2,
      lowHp: 0.3,
      // Tuck lets go of the levers when he's ready to come out (MERCY full),
      // or when the king's been knocked about too much to work: at once, not
      // after another attack.
      until: { calm: 100, below: 0.2, now: true },
      gameOver: 'game_over: behind',
      beat: [{ say: 'phase: jam' }, { who: 'foe', say: 'phase: jam foe' }, { who: 'vesper', say: 'phase: jam vesper' }, { say: 'phase: jam tip' }],
    },
    {
      id: 'alive',
      // "No Strings" (rumboldAliveTheme.js), after a silence.
      music: 'rumboldAlive',
      quiet: true,
      sprite: { rows: ALIVE_SPRITE, palette: RUMBOLD_PALETTE },
      anim: ALIVE_ANIM,
      patterns: ALIVE_ATTACKS,
      // The light mends him (to 60% of his HP, as it kindles: always a
      // climb you can see, even if Tuck was talked round at half), and it's
      // harder than anything yet: his own body thrown at you, and no hand
      // holding him back.
      renew: { to: 0.6, seconds: 2.4 },
      // His own body thrown at you two ways at once, all through this act:
      // a lighter second attack laid on every one.
      secondWind: { below: 1, density: 0.32, delay: 2.5 },
      damage: 77,
      difficulty: { density: 1.9, speed: 1.4 },
      lowHp: 0.25,
      // He can't be spared. The MERCY bar stays as Tuck left it (full, if
      // you talked him round), but the first kindness tried (a TALK, Pacify,
      // a candle, Ves's word), he reaches down, takes the bar, snaps it in
      // two and throws the halves away ([mercy_snap]). After that there's no
      // bar, and he laughs off any more ([mercy_mock: alive]).
      noMercy: { who: 'foe', snap: true },
      // Low on HP, once: the light in him sees you. He tears the box in two
      // and the whole stage is the box (rumboldAliveTear). He can't be
      // brought below `hold` until it's played, so it always does.
      // (The finale, a long gauntlet with the stair in it, keeps its own pace.)
      finale: { below: 0.3, hold: 0.22, pattern: ALIVE_FINALE, difficulty: { density: 1.15, speed: 1.1 } },
      // He takes his name back: PUPPET to PEPTUP, fast, rattling.
      anagram: ['PUPPET', 'PUPEPT', 'PUPETP', 'PUEPTP', 'PEUPTP', 'PEPUTP', 'PEPTUP'],
      nameSwap: 0.24,
      nameJitter: true,
      // The house lights, the box on ropes, your buttons on strings.
      stage: 'puppet',
      // Talk to Tuck, hanging on the strings beside him: it's a kindness, so
      // the king steps in (noMercy above).
      talk: [
        { name: 'Check' },
        { name: 'Tell Tuck it\'s his voice', calm: 20 },
        { name: 'Say the strings are his to cut', calm: 20 },
      ],
      gameOver: 'game_over: alive',
      // Tuck lets go. Silence. The light. The name. The strings. The show.
      beat: [
        { cue: 'letgo' },
        { say: 'phase: alive' },
        { pause: 1.3 },
        { cue: 'kindle' },
        { say: 'phase: alive kindle' },
        { pause: 0.5 },
        { anagram: true },
        { renew: true },
        { pause: 2.1 },
        { cue: 'rise' },
        { pause: 1.3 },
        { cue: 'alive' },
        { music: true },
        { who: 'foe', say: 'phase: alive foe' },
        { who: 'tuck', say: 'phase: alive tuck' },
        { who: 'vesper', say: 'phase: alive vesper' },
        { say: 'phase: alive tip' },
      ],
      // Beaten: still talking as he goes.
      leaveBeat: {
        defeated: [{ who: 'foe', say: 'beaten: alive foe' }],
      },
    },
  ],

  // Every attack he has, across all three (the battle checks there are enough).
  patterns: [...SHOW_ATTACKS, ...BROKEN_ATTACKS, ...ALIVE_ATTACKS, { name: ALIVE_FINALE, weight: 0 }],

  // TALK before the jam: the king, and showbiz. None of it calms him.
  talk: [
    { name: 'Check' },
    { name: 'Applaud' },
    { name: 'Ask for a word' },
    { name: 'Look up into the rafters' },
  ],

  // Well above the Hush's 1200 EXP and 300 gold (three acts' worth).
  rewards: { exp: 8390, coins: 420 },

  materials: [{ id: 'shadow_ash', chance: 1, amount: 3 }],
};
