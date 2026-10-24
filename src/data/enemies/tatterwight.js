import { TATTERWIGHT_PALETTE, TATTERWIGHT_SPRITE } from '../art/tatterwight.js';

// THE TATTERWIGHT, Chapter 3's midboss, in the Torn Clearing
// (pinefall_tatters): the wind of the night Ves fell, still going round the
// clearing with everything it picked up, leaves and twigs and three scraps of
// her coat, in the rough shape of the thing that tore the trees. Not the beast
// (that's the Hush, at the Hero's Gate): the clearing, remembering it. You
// fight it alone (no Ves yet, no Bramble yet). It can be spared: take the
// scraps of her coat back out of the whirl, and with nothing left to hold on
// to it lets go (tatterwight_spared); beat it and it scatters
// (tatterwight_scattered). Started by the_tatterwight. Its music is "Tooth and
// Tatter" (pinefallBeastTheme.js). Everything it says is in
// text/enemies/tatterwight.txt.
export const TATTERWIGHT_BOSS = {
  name: 'TATTERWIGHT',
  textFile: 'enemies/tatterwight.txt',
  area: 'pinefall',
  sprite: { rows: TATTERWIGHT_SPRITE, palette: TATTERWIGHT_PALETTE },
  boss: true,
  music: 'pinefallBeast',
  // The red wood (src/battle/backdrops.js).
  backdrop: 'pinefall',
  // Each chapter's bosses climb: past the Roost Mother (900 HP, 15 damage)
  // and well past the Pinefall's regulars (280-380 HP, 15-16 damage), but
  // well short of the Warden at the end of the chapter (2400).
  maxHp: 1100,
  damage: 18,

  difficulty: { density: 1.15, speed: 1.08 },

  // Below a third of its HP, a second, lighter attack blows in on top.
  secondWind: { below: 0.34, density: 0.35, delay: 2 },

  // It spins in out of the air, gathering itself (see stageBits.js).
  entrance: 'whirl',
  introCard: { title: 'THE TATTERWIGHT', subtitle: 'What the Clearing Remembers' },

  // Its attacks live in src/battle/attacks/tatterwight.js.
  patterns: [
    { name: 'tatterLeafStorm', weight: 3 },
    { name: 'tatterClaws', weight: 3 },
    { name: 'tatterThreads', weight: 2 },
    { name: 'tatterTwigs', weight: 2 },
    { name: 'tatterWhirl', weight: 2 },
  ],

  // TALK options. Taking the scraps back is what spares it.
  talk: [
    { name: 'Check' },
    { name: 'Take a scrap', calm: 22 },
    { name: 'Stand in the wind', calm: 14 },
    { name: 'Hold out a hand', calm: 18 },
  ],

  rewards: { exp: 420, coins: 130 },

  // A leaf that's never stopped turning.
  drops: [{ item: 'turning_leaf', chance: 1 }],
};
