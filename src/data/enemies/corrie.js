import {
  CORRIE_BATTLE_PALETTE, CORRIE_BATTLE_SPRITE, CORRIE_STORM_SPRITE, CORRIE_WHIRL_SPRITE, CORRIE_LAMP_SPRITE, CORRIE_BEATEN_SPRITE,
  CORRIE_BOY_ANIM, CORRIE_STORM_ANIM, CORRIE_WHIRL_ANIM, CORRIE_LAMP_ANIM,
} from '../art/corrieBattle.js';

// CORRIE, THE TIDECALLER: Chapter 5's last boss, at the top of the Last
// Light. Haddock's ward, an orphan boy who wanted to be like the Hero (the
// child Hero stayed with them a while, long ago, and sailed away). He went
// out to stop the sea with a spell, and the light that should have guided
// him home went out, and he became the storm. Half child, half whirlpool.
// Everything he says is in text/enemies/corrie.txt; he speaks a little, in
// fragments, like the child he is. The hero never speaks.
//
// Started by a cutscene step (the Last Light's `corrie_appears`):
//   { do: 'battle', enemy: 'corrie', who: 'corrie', noRun: true, defeated: '<the finale scene>' }
// He can't be spared, so the only way it ends is beaten, and the step's
// `defeated` scene plays (his last wave, "My turn.", and the rest). In the
// battle he does NOT die: beaten, he sinks low over the water, the staff
// across his knees, and stays there (`beatenSprite`) as the battle ends.
//
// Four `phases` (see bossPhase in src/battle/battleScene.js), each at a
// quarter of his HP and each with its own section of his song (`musicFrom`)
// and its own look in the box (src/battle/corrieStage.js):
//   1. THE BOY MAGE (to 75%): hovering, the driftwood staff: water darts, a
//      spell circle, paper boats, and the lullaby Haddock hums, its notes as
//      bullets in the tune's own rhythm and pitch.
//   2. THE STORM (to 50%): the sky in the box, and the tide coming in from the
//      bottom of it, higher every turn: it slows your shadow, and lightning
//      lights it up. Rain, lightning, gusts.
//   3. THE WHIRLPOOL (to 25%): the box rocks round, the current pulls you to
//      the eye in the middle, and wreckage goes round: planks, oars, a
//      ship's figurehead.
//   4. THE LAMP: the Last Light's lamp sweeps its beam through the box: hide
//      behind the pillars. He is mostly a child again, tired; slower, sadder,
//      still dangerous (it hits hardest of all).
// Each phase has a `floor` so a big hit can't skip the next, and `atLeast`
// turns so each gets its due.
//
// No mercy at all, like the Usurper: there's no MERCY bar, and any try at it
// (a TALK, Pacify, a candle, a friend's kind word) is answered by the storm,
// not by him ([no_mercy], in the panel's box: `who: 'storm'`).
//
// HADDOCK'S BELL (a TALK, only if the hero has `haddocks_bell`, gear.js):
// costs all your SP (100%) and the hero AND Bramble ring it together, so
// Bramble's turn goes on it too (only Ves acts after). It soothes the next
// attack (`soothe`: thinner and slower, and no second attack layered on);
// in the storm the water drains out of the box as it plays and the tide
// starts again from the bottom; in the whirlpool the current slackens.
//
// Strength: the hardest fight in the game so far, well above King Peptup
// (13,200 HP, 67-77 damage, density 2 / 1.9 and speed 1.3 / 1.4) and the
// Dowager Crab (3,600 HP, 70-76), against a party around LV 37-45 with
// chapter 5 gear (the hero about 460-540 HP; DEF 8-9 takes a little off
// every hit, so a hit is about 75-85: six or so to knock him down).

// His attacks live in src/battle/attacks/corrie.js.
const BOY_ATTACKS = [
  { name: 'corrieDarts', weight: 3 },
  { name: 'corrieCircle', weight: 3 },
  { name: 'corrieBoats', weight: 3 },
  { name: 'corrieLullaby', weight: 3 },
];
const STORM_ATTACKS = [
  { name: 'stormRain', weight: 3 },
  { name: 'stormLightning', weight: 3 },
  { name: 'stormGusts', weight: 3 },
];
const WHIRL_ATTACKS = [
  { name: 'whirlWreck', weight: 3 },
  { name: 'whirlOars', weight: 3 },
  { name: 'whirlFigurehead', weight: 3 },
];
const LAMP_ATTACKS = [
  { name: 'lampSweep', weight: 3 },
  { name: 'lampTears', weight: 3 },
  { name: 'lampLullaby', weight: 3 },
];

// The bell: the hero and Bramble together, all your SP.
const BELL = {
  name: "Ring Haddock's bell",
  gear: 'haddocks_bell',
  needs: ['bramble'],
  sp: 100,
  soothe: { density: 0.55, speed: 0.8 },
};

// Every kindness is answered by the storm (see noMercy): these are here so
// there's something to try. (`calm` is what makes them kindnesses.)
const TALK = [
  { name: 'Check' },
  BELL,
  { name: 'Call to him', calm: 10 },
  { name: 'Hold out a hand', calm: 10 },
];

export const CORRIE_BOSS = {
  name: 'CORRIE',
  textFile: 'enemies/corrie.txt',
  area: 'lastlight',
  sprite: { rows: CORRIE_BATTLE_SPRITE, palette: CORRIE_BATTLE_PALETTE },
  anim: CORRIE_BOY_ANIM,
  // Beaten, he doesn't fade: he stays, sunk low over the water.
  beatenSprite: { rows: CORRIE_BEATEN_SPRITE, palette: CORRIE_BATTLE_PALETTE },
  // 44x58, drawn twice that: right of the box, floating over the lamp room.
  battlePos: { x: 214, y: 6 },
  boss: true,
  // "Salt in the Wound" (corrieBattleTheme.js); each phase starts its own part.
  music: 'corrieBattle',
  backdrop: 'lastlight',
  maxHp: 21000,
  damage: 82,
  difficulty: { density: 1.9, speed: 1.45 },
  // He whirls in out of the storm (stageBits.js).
  entrance: 'whirl',
  introCard: { title: 'CORRIE', subtitle: 'The Tidecaller' },
  lowHp: 0.4,

  phases: [
    {
      id: 'boy',
      stage: 'corrie',
      // On at 75%, not before he's had four turns; never below 70% till then.
      until: { below: 0.75, atLeast: 4 },
      floor: 0.7,
      patterns: BOY_ATTACKS,
      gameOver: 'game_over: boy',
    },
    {
      id: 'storm',
      stage: 'corrie',
      music: 'corrieBattle',
      musicFrom: 'C',
      sprite: { rows: CORRIE_STORM_SPRITE, palette: CORRIE_BATTLE_PALETTE },
      anim: CORRIE_STORM_ANIM,
      introSfx: 'boom',
      flash: true,
      patterns: STORM_ATTACKS,
      damage: 86,
      difficulty: { density: 2, speed: 1.5 },
      until: { below: 0.5, atLeast: 4 },
      floor: 0.45,
      gameOver: 'game_over: storm',
      beat: [{ say: 'phase: storm' }, { who: 'foe', say: 'phase: storm foe' }, { who: 'vesper', say: 'phase: storm vesper' }],
    },
    {
      id: 'whirlpool',
      stage: 'corrie',
      music: 'corrieBattle',
      musicFrom: 'D',
      sprite: { rows: CORRIE_WHIRL_SPRITE, palette: CORRIE_BATTLE_PALETTE },
      anim: CORRIE_WHIRL_ANIM,
      introSfx: 'splash',
      patterns: WHIRL_ATTACKS,
      damage: 90,
      difficulty: { density: 2, speed: 1.5 },
      until: { below: 0.25, atLeast: 4 },
      floor: 0.2,
      gameOver: 'game_over: whirlpool',
      beat: [{ say: 'phase: whirlpool' }, { who: 'foe', say: 'phase: whirlpool foe' }, { who: 'bramble', say: 'phase: whirlpool bramble' }],
    },
    {
      id: 'lamp',
      stage: 'corrie',
      music: 'corrieBattle',
      musicFrom: 'E',
      sprite: { rows: CORRIE_LAMP_SPRITE, palette: CORRIE_BATTLE_PALETTE },
      anim: CORRIE_LAMP_ANIM,
      introSfx: 'flare',
      flash: true,
      patterns: LAMP_ATTACKS,
      // Slower and sadder, and it hurts the most.
      damage: 94,
      difficulty: { density: 1.6, speed: 1.25 },
      // At the very end he puts everything he has left into it.
      secondWind: { below: 0.12, density: 0.3, delay: 2.5 },
      lowHp: 0.12,
      gameOver: 'game_over: lamp',
      beat: [{ say: 'phase: lamp' }, { who: 'foe', say: 'phase: lamp foe' }, { who: 'vesper', say: 'phase: lamp vesper' }],
      leaveBeat: { defeated: [{ who: 'foe', say: 'beaten: lamp foe' }] },
    },
  ],

  // Every attack he has, across all four (the battle checks there are enough).
  patterns: [...BOY_ATTACKS, ...STORM_ATTACKS, ...WHIRL_ATTACKS, ...LAMP_ATTACKS],

  // No mercy: no bar, and the storm answers ([no_mercy], [no_mercy_again]).
  noMercy: { who: 'storm', meter: false },

  talk: TALK,

  // The chapter's EXP budget for him (about 30,000, see "Chapter 5 balance
  // pass" in the builders guide: about one and a bit levels at LV 40) and its
  // purse (600 coins, about 2,700 gold). Beaten once, in a story fight: no
  // way to farm him.
  rewards: { exp: 30000, coins: 600 },
  materials: [{ id: 'shadow_ash', chance: 1, amount: 3 }],
};
