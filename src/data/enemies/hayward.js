import { HAYWARD_PALETTE, HAYWARD_SPRITE } from '../art/hayward.js';

// The HAYWARD's numbers: Hollin's old scarecrow. The woodcutters left the
// village before Bramble's grandad was grown, and it stayed, because nobody
// told it to stop. It still guards fields nobody plants, still waves at the
// crows, still says good morning to the empty lane, and it would very much
// like to know when the farmers are coming back. Everything it says is in
// text/enemies/hayward.txt.
export const HAYWARD = {
  name: 'HAYWARD',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it's on a
  // pole, so it hops.
  gait: 'hop',
  textFile: 'enemies/hayward.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'pinefall',
  sprite: { rows: HAYWARD_SPRITE, palette: HAYWARD_PALETTE },
  maxHp: 400,
  damage: 17,

  // A Chapter 3 enemy from the far end of the wood: a touch busier than the
  // Burrhog.
  difficulty: { density: 1.25, speed: 1.15 },

  // Its attacks live in src/battle/attacks/hayward.js.
  patterns: [
    { name: 'haywardCrows', weight: 3 },
    { name: 'haywardHat', weight: 3 },
    { name: 'haywardStraw', weight: 2 },
    { name: 'haywardHug', weight: 2 },
    { name: 'haywardSeeds', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Say good morning', calm: 45 },
    { name: 'Shoo the crow', calm: 30 },
    { name: 'Wave back', calm: 35 },
  ],

  rewards: { exp: 150, coins: 80 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'hollin_apple', chance: 0.4 }],
};
