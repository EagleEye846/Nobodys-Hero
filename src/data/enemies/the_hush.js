import { HUSH_PALETTE, HUSH_SPRITE, HUSH_LOOSE_SPRITE, HUSH_FREE_SPRITE, HUSH_REAR_SPRITE, HUSH_ROAR_SPRITE, hushAnim } from '../art/hush.js';

// THE HUSH, the beast of the Hushwood: Chapter 3's last boss, and the hardest
// fight in the game so far. A demon boar big as a cart that stands up on its
// quiet as snow; the birds stop singing when it's near. It hurt Ves's leg at Hollin's well, and when she
// let go of her umbrella (her mother's, the only thing of her mother's that
// came back down the mountain) to get away down the well, it took it. It
// followed you all the way to the Hero's Gate, and lies there with the
// umbrella in its jaws.
//
// The truth: it's lonely. That umbrella is the first thing anyone has left
// within its reach in a hundred years. It's never hunted anyone, really. It
// has only ever followed people.
//
// Started by a cutscene step: { do: 'battle', enemy: 'the_hush', who: 'hush',
// spared: 'hush_spared', defeated: 'hush_defeated' }. Spared, it goes off
// into the dark, quieter; beaten, it goes down on the paving and dies there,
// out in the world (the hush_death animation, src/data/art/hushBeast.js).
// Either way the battle fades it out. Everything it does, and everything Ves says
// to it, is in text/enemies/the_hush.txt. It never speaks: it's an animal.
//
// Its fight comes in three `phases` (see bossPhase in battleScene.js):
//   1. HUNT: it circles, silent. Ves is hurt (COVER and CALL OUT only) and
//      furious with it: she won't let you be kind to it yet (`noMercy`).
//      Its HP can't go below half (`floor`) until the umbrella's free.
//   2. LOOSE: knocked down to `below` its HP (or after `turns` of its turns,
//      whichever's first, but not before `atLeast` of them), the umbrella
//      flies out of its jaws and lands by
//      Ves. Her next turn she goes for it (`allyTurn`), and that turn ends
//      the phase (`until: { allyTurn: true }`).
//   3. RAGE: she opens it. A flash, and the music turns to "Nobody's Dawn".
//      She's not hurt any more (`unhurt`: her full HP, her umbrella SPELLS,
//      on her feet, and it stays that way after the fight). And the Hush,
//      seeing the one thing it had taken off it, goes wild: eyes burning,
//      every attack it has at once, harder and faster, hitting harder
//      (`damage`), not holding back (`gentle: false`), no MERCY.
//   4. DAWN: the rage burns out of it (down to `below` its HP, or after
//      `turns` of its turns). It doesn't know what to do now. Its attacks
//      stop hunting and start following,
//      and MERCY can fill: Ves's TALK lines are her working out what it is.
//      As MERCY rises its attacks thin out (`gentle`). Full, and Pacify
//      spares it.

// Its attacks live in src/battle/attacks/the_hush.js.
const HUNT_ATTACKS = [
  { name: 'hushQuiet', weight: 2 },
  { name: 'hushShadow', weight: 2 },
  { name: 'hushClaws', weight: 3 },
  { name: 'hushUmbrella', weight: 3 },
];
// The umbrella's out of its jaws now: the hunt, without it.
const LOOSE_ATTACKS = HUNT_ATTACKS.filter(({ name }) => name !== 'hushUmbrella');
// Enraged, the umbrella taken off it: everything it has, claws first.
const RAGE_ATTACKS = [
  { name: 'hushClaws', weight: 4 },
  { name: 'hushShadow', weight: 3 },
  { name: 'hushQuiet', weight: 2 },
  { name: 'hushEyes', weight: 2 },
];
// Its eyes, burning.
const RAGE_PALETTE = { ...HUSH_PALETTE, e: '#ff5a46', E: '#ffe2b0', s: '#4a0c18' };
// Not hunting: following, coming too close, watching, calling.
const DAWN_ATTACKS = [
  { name: 'hushFollows', weight: 3 },
  { name: 'hushNuzzle', weight: 2 },
  { name: 'hushEyes', weight: 2 },
  { name: 'hushCall', weight: 2 },
];

export const THE_HUSH_BOSS = {
  name: 'HUSH',
  textFile: 'enemies/the_hush.txt',
  area: 'valley',
  sprite: { rows: HUSH_SPRITE, palette: HUSH_PALETTE },
  // Breathing, crouching to come at you, flinching, and going: sinking to its
  // knees beaten, or lowering its head, spared (hushAnim in its art file).
  // It meets you head down, hackles up (`intro`).
  anim: hushAnim(HUSH_SPRITE, { rear: HUSH_REAR_SPRITE }),
  // It's huge (76x64, on all fours), so it stands right of the box with its
  // rump running off the edge of the stage.
  battlePos: { x: 200, y: 8 },
  boss: true,
  // It comes in at a charge from the right and skids to a stop (stageBits.js).
  entrance: 'charge',
  // "Tooth and Tatter" (pinefallBeastTheme.js), written for the beast that
  // hurt Ves, until she has her umbrella back; then "Nobody's Dawn".
  music: 'pinefallBeast',
  // Chapter 3's last boss: well above the Usurper (1400 HP, 19 damage,
  // density 1.35) and far above the Warden just before it (2400 HP, 30 damage).
  // Half of it is out of reach until the umbrella's free (`floor`), and you
  // needn't take the rest: MERCY fills in the last phase whatever its HP.
  maxHp: 7200,
  damage: 40,
  difficulty: { density: 1.6, speed: 1.2 },
  // It doesn't really want to hurt you: as MERCY rises its attacks thin out.
  gentle: true,

  // Beaten low, below 30% of its HP, it layers a lighter second attack on top.
  secondWind: { below: 0.3, density: 0.3, delay: 2.5 },

  // Its entrance: a title card before the fight ([boss_intro] is what it does).
  introCard: { title: 'THE HUSH', subtitle: 'Who Follows' },

  phases: [
    {
      id: 'hunt',
      // Ves won't have you being kind to it, not yet ([no_mercy]).
      noMercy: { who: 'vesper' },
      // It can't be brought below half its HP in this phase.
      floor: 0.5,
      // On to LOOSE once it's down to this share of its HP, or after this
      // many of its turns, whichever comes first; but never before it's had
      // `atLeast` turns, so its own song ("Tooth and Tatter") gets its due
      // before "Nobody's Dawn" takes over.
      until: { below: 0.7, turns: 12, atLeast: 7 },
      patterns: HUNT_ATTACKS,
    },
    {
      id: 'loose',
      noMercy: { who: 'vesper' },
      floor: 0.5,
      sprite: { rows: HUSH_LOOSE_SPRITE, palette: HUSH_PALETTE },
      anim: hushAnim(HUSH_LOOSE_SPRITE),
      // Her umbrella, in the snow by her.
      dropped: 'umbrella_furled',
      // Ves's turn is going for the umbrella ([catch]), and it ends the phase.
      // (If she's down and can't take a turn, she gets to it anyway after
      // two of its turns.)
      allyTurn: { vesper: 'catch' },
      until: { allyTurn: true, turns: 2 },
      patterns: LOOSE_ATTACKS,
      beat: [{ say: 'phase: loose' }, { who: 'vesper', say: 'phase: loose vesper' }],
    },
    {
      id: 'rage',
      // The umbrella opening: a flash, and her song.
      music: 'nobodysDawn',
      flash: true,
      // Ves is well again, for good.
      unhurt: ['vesper'],
      // And it's taken off it: it won't be calmed yet ([no_mercy: rage]).
      noMercy: { who: 'vesper' },
      sprite: { rows: HUSH_FREE_SPRITE, palette: RAGE_PALETTE },
      // Every attack starts with it flinging its head up and roaring.
      anim: hushAnim(HUSH_FREE_SPRITE, { rear: HUSH_ROAR_SPRITE, roaring: true }),
      patterns: RAGE_ATTACKS,
      damage: 50,
      gentle: false,
      // Falling now, with her song playing: its own GAME OVER line.
      gameOver: 'game_over: dawn',
      difficulty: { density: 2, speed: 1.4 },
      // The rage burns out at this share of its HP, or after this many of
      // its turns, but not before `atLeast`.
      until: { below: 0.3, turns: 9, atLeast: 4 },
      beat: [{ say: 'phase: dawn' }, { who: 'vesper', say: 'phase: dawn vesper' }, { say: 'phase: rage' }, { who: 'vesper', say: 'phase: rage vesper' }],
    },
    {
      id: 'dawn',
      sprite: { rows: HUSH_FREE_SPRITE, palette: HUSH_PALETTE },
      anim: hushAnim(HUSH_FREE_SPRITE),
      patterns: DAWN_ATTACKS,
      difficulty: { density: 1.75, speed: 1.28 },
      gameOver: 'game_over: dawn',
      beat: [{ say: 'phase: dawn after' }, { who: 'vesper', say: 'phase: dawn look' }],
    },
  ],

  // Every attack it has, across its phases (the battle checks there are enough).
  patterns: [...HUNT_ATTACKS, ...DAWN_ATTACKS],

  // TALK options. Nothing here says a word (the hero never does): it's all
  // what you do. Kneeling and holding out a hand build MERCY, but only once
  // Ves will let you (DAWN). Holding out your hand costs you a little.
  talk: [
    { name: 'Check' },
    { name: 'Keep still', calm: 12 },
    { name: 'Kneel down', calm: 14 },
    { name: 'Hold out a hand', calm: 22, hurt: 12 },
  ],

  // Well above the Usurper's 600: most of a level at the Gate.
  rewards: { exp: 1200, coins: 300 },

  // Spared or beaten, a hank of its bristles is left on your sleeve.
  drops: [{ item: 'hush_fur', chance: 1 }],
  materials: [{ id: 'shadow_ash', chance: 1, amount: 2 }],
};
