import { GREAT_BAT_PALETTE, GREAT_BAT_SPRITE } from '../art/greatBat.js';

// THE ROOST MOTHER, the great bat of the ice caves: the Chapter 2 cave boss,
// in her roost of ice beyond the Hall of Glass. Every bat in the caves is one
// of hers, and your light has woken them all. (Ves is terrified of bats; this
// is the fight she has to get through anyway.) No running away, and no
// sparing her: the floor of her roost is the bones of every climber who never
// came back past the second cairn, and Ves won't let you show her mercy
// (`noMercy`). When she falls, bat_defeated plays. Below a third
// of her HP she layers a lighter second attack on top (`secondWind`), and she
// makes an entrance first (`introCard`). Started by the bats_in_the_roost
// scene. Everything she says is in text/enemies/great_bat.txt.
export const GREAT_BAT_BOSS = {
  name: 'ROOST MOTHER',
  textFile: 'enemies/great_bat.txt',
  area: 'vigil',
  sprite: { rows: GREAT_BAT_SPRITE, palette: GREAT_BAT_PALETTE },
  // She's huge (56x35, wings spread), so she stands a little up and left of
  // the usual spot to fit, just right of the box (see battleScene.js).
  battlePos: { x: 206, y: 36 },
  boss: true,
  music: 'batBattle',
  // The crystal cave (src/battle/backdrops.js).
  backdrop: 'cave',
  // Chapter 2's bosses are its hardest fights, and each chapter's are harder
  // than the last: well above Taper (320 HP, 6 damage) and the caves' toughest
  // regulars (300 HP), with spells now hitting harder than any FIGHT.
  maxHp: 900,
  damage: 11,

  // A good step above the caves' regulars.
  difficulty: { density: 1.2, speed: 1.12 },

  // Below a third of her HP she adds a second attack on top of the first,
  // two seconds later, at a third of the density.
  secondWind: { below: 0.34, density: 0.35, delay: 2 },

  // Her entrance: a title card before the fight (her lines are [boss_intro]).
  introCard: { title: 'THE ROOST MOTHER', subtitle: 'Who Sings in the Dark' },

  // Her attacks live in src/battle/attacks/great_bat.js.
  patterns: [
    { name: 'batEcholocation', weight: 3 },
    { name: 'batScreech', weight: 3 },
    { name: 'batEchoes', weight: 2 },
    { name: 'batSwarm', weight: 3 },
    { name: 'batDive', weight: 2 },
    { name: 'batIcicles', weight: 2 },
  ],

  // No mercy. Any calming TALK, spell or candle is stopped, and Ves says why
  // ([no_mercy], then [no_mercy_again], in her text file; see refuseMercy in
  // src/battle/battleScene.js). Check still works.
  noMercy: { who: 'vesper' },

  // TALK options. Every one with `calm` is a kindness, and Ves stops it.
  talk: [
    { name: 'Check' },
    { name: 'Shade your light', calm: 14 },
    { name: 'Be very quiet', calm: 12 },
    { name: 'Stand by Ves', calm: 16 },
  ],

  rewards: { exp: 380, coins: 110 },

  // No drop: her plum comes from her pup, after (bat_defeated).
  drops: [],
};
