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
// fragments, like the child he is. The hero never speaks. Ves and Bramble
// speak at every phase change and on each of their turns ([vesper_turn: <phase>],
// [bramble_turn: <phase>]), frightened, and only about what they can see.
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
// Dowager Crab (24,000 HP, 106-114) and Old Gulper (31,000, 110-119), against a party around LV 37-45 with
// chapter 5 gear (the hero about 460-540 HP; DEF 8-9 takes a little off
// every hit, so a hit is about 95-110: five or so to knock him down, about
// twice that under Ves's SHELTER, which halves it).

// Each change of phase is a moment you watch before anyone speaks: his
// `intro` clip plays (corrieBattle.js) while the lamp room breaks round him
// (the timeline in src/battle/corrieStage.js), then the beat's lines.
const CHANGE_SECONDS = 3;

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
  { name: 'lampLens', weight: 3 },
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
  { name: 'Wave to him', calm: 10 },
  { name: 'Hold out a hand', calm: 10 },
];

export const CORRIE_BOSS = {
  name: 'CORRIE',
  textFile: 'enemies/corrie.txt',
  area: 'lastlight',
  sprite: { rows: CORRIE_BATTLE_SPRITE, palette: CORRIE_BATTLE_PALETTE },
  anim: CORRIE_BOY_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): a splash when hit (his defeat is the boss
  // finale).
  feel: { hit: 'splash' },
  // Beaten, he doesn't fade: he stays, sunk low over the water.
  beatenSprite: { rows: CORRIE_BEATEN_SPRITE, palette: CORRIE_BATTLE_PALETTE },
  // 60x74, drawn twice that: right of the box, floating over the lamp room.
  battlePos: { x: 200, y: 0 },
  boss: true,
  // "Salt in the Wound" (corrieBattleTheme.js); each phase starts its own part.
  music: 'corrieBattle',
  backdrop: 'lastlight',
  // 36,000 (21,000 at first, then 28,000, then this on 7 November 2026). At
  // 28,000 grazing past his thick bullets filled the SP bar every turn, so
  // Tempest every round won in about 18 rounds and the bell cost nothing.
  // Now grazing him gives a quarter of the SP (`grazeSp`), so a careful
  // player gets a big spell every two turns or so, and the bell (all your
  // SP) means saving up for it. With the harder hits (about 1.27x what they
  // were) the battle bot, at LV 44-46: careful 26-30 rounds, a few heals;
  // average 28-33 rounds, low on HP, a knockdown or some food; sloppy
  // 36-38 rounds, often lost.
  // 50,000 and about 15% harder hits from 8 November 2026: the coast's regular
  // monsters went up to 6,000-10,000 HP, so a fight takes several rounds, and
  // he has to stay well clear of Old Gulper (31,000).
  maxHp: 63500,
  damage: 120,
  // (The boy's: 15 November 2026, speed 1.45 to 1.9 with his attacks remade,
  // because his patterns played too easy: a careful dodger took 0.11 hits a
  // turn here. Now about 0.8, the storm about 1.1, the whirlpool about 1.3,
  // the lamp about 1.6. The old attacks are in notes/corrie-attacks-backup-2026-11-15.)
  difficulty: { density: 1.9, speed: 1.9 },
  // Grazing past him gives this much of the usual SP (see battleScene's
  // grazeSpBonus). His bullets are so thick that full SP would be every turn.
  grazeSp: 0.25,
  // Its turns run long: as one attack winds down, another follows (encore,
  // see startAttack in battleScene.js).
  encore: { at: 0.85, seconds: 5, density: 0.65 },
  // His turns are already about 11-12.5 s with it, and the storm's are the
  // thickest in the game: no top-up past that (TURN_SECONDS in battleScene.js).
  turnSeconds: 11,
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
      musicFrom: 'W', // the drop: the gong and the broken lullaby
      sprite: { rows: CORRIE_STORM_SPRITE, palette: CORRIE_BATTLE_PALETTE },
      anim: CORRIE_STORM_ANIM,
      introSfx: 'boom',
      patterns: STORM_ATTACKS,
      // The storm's attacks are the busiest: its encore is shorter and lighter,
      // and comes in as the first attack is nearly done. (2026-11-10: was
      // { at: 0.9, seconds: 4, density: 0.5 }; with the tide up, the encore
      // doubled the hits a careful player took.)
      encore: { at: 0.95, seconds: 3.6, density: 0.35 },
      damage: 125,
      difficulty: { density: 2, speed: 1.5 },
      until: { below: 0.5, atLeast: 4 },
      floor: 0.45,
      gameOver: 'game_over: storm',
      beat: [{ pause: CHANGE_SECONDS }, { say: 'phase: storm' }, { who: 'foe', say: 'phase: storm foe' }, { who: 'bramble', say: 'phase: storm bramble' }, { who: 'vesper', say: 'phase: storm vesper' }],
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
      // A lighter encore than his others, coming in later: the current already
      // pulls you about, and the default one doubled the hits (2026-11-10).
      encore: { at: 0.93, seconds: 4.4, density: 0.45 },
      damage: 132,
      difficulty: { density: 2, speed: 1.5 },
      until: { below: 0.25, atLeast: 4 },
      floor: 0.2,
      gameOver: 'game_over: whirlpool',
      beat: [{ pause: CHANGE_SECONDS }, { say: 'phase: whirlpool' }, { who: 'foe', say: 'phase: whirlpool foe' }, { who: 'bramble', say: 'phase: whirlpool bramble' }, { who: 'vesper', say: 'phase: whirlpool vesper' }],
    },
    {
      id: 'lamp',
      stage: 'corrie',
      music: 'corrieBattle',
      musicFrom: 'E',
      sprite: { rows: CORRIE_LAMP_SPRITE, palette: CORRIE_BATTLE_PALETTE },
      anim: CORRIE_LAMP_ANIM,
      introSfx: 'flare',
      patterns: LAMP_ATTACKS,
      // Sadder, and it hurts the most. The fight's peak: the lamp's patterns
      // are the thickest of his four (2026-11-10, round 2: was density 1.6,
      // speed 1.25, when the careful dodger took 0.04 hits a turn here).
      damage: 138,
      // (Speed 1.4 before 15 November 2026.)
      difficulty: { density: 1.9, speed: 1.65 },
      // A fuller encore than his others: everything he has left (15 November
      // 2026: was { at: 0.85, seconds: 5, density: 0.85 }, speed 1.4).
      encore: { at: 0.75, seconds: 5.5, density: 1.1 },
      // At the very end he puts everything he has left into it.
      secondWind: { below: 0.12, density: 0.3, delay: 2.5 },
      lowHp: 0.12,
      gameOver: 'game_over: lamp',
      beat: [{ pause: CHANGE_SECONDS }, { say: 'phase: lamp' }, { who: 'foe', say: 'phase: lamp foe' }, { who: 'bramble', say: 'phase: lamp bramble' }, { who: 'vesper', say: 'phase: lamp vesper' }],
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
  drops: [{ item: 'salt_taffy', chance: 1 }],
};
