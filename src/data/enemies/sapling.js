import { SAPLING_PALETTE, SAPLING_SPRITE, SAPLING_DISGUISE_SPRITES } from '../art/sapling.js';

// The SAPLING's numbers: a young tree spirit that only moves when nobody's
// looking. It wants to grow up to be one of the big red ones, and it's
// practising standing very still. Everything it says is in
// text/enemies/sapling.txt.
export const SAPLING = {
  name: 'SAPLING',
  // How it gets about in a room (GAITS in src/overworld/npc.js): a shuffle, then stock still.
  gait: 'dash',
  textFile: 'enemies/sapling.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'pinefall',
  sprite: { rows: SAPLING_SPRITE, palette: SAPLING_PALETTE },
  // In a room it stands among the trees with its eyes shut (the "In
  // disguise" behaviour in the Room Editor), so put it where there are trees
  // for it to pass as one of. Now and then an eye opens, or an arm twitches.
  disguise: {
    frames: [SAPLING_DISGUISE_SPRITES.still, SAPLING_DISGUISE_SPRITES.peek, SAPLING_DISGUISE_SPRITES.twitch],
    palette: SAPLING_PALETTE,
  },
  maxHp: 380,
  damage: 16,

  // A Chapter 3 enemy: slow things, but they close in.
  difficulty: { density: 1.2, speed: 1.1 },

  // Its attacks live in src/battle/attacks/sapling.js.
  patterns: [
    { name: 'sapCreep', weight: 3 },
    { name: 'sapBranches', weight: 3 },
    { name: 'sapRoots', weight: 2 },
    { name: 'sapLeaffall', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Water it', calm: 40 },
    { name: 'Look away', calm: 30 },
    { name: 'Stand like a tree', calm: 35 },
  ],

  rewards: { exp: 135, coins: 65 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'scarlet_syrup', chance: 0.4 }],
};
