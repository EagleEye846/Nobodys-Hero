import { BURRHOG_PALETTE, BURRHOG_SPRITE } from '../art/burrhog.js';

// The BURRHOG's numbers: a hedgehog whose back is a pinecone. It curls up at
// anything, rolls at everything, and is a great deal pricklier than it means
// to be. Everything it says is in text/enemies/burrhog.txt.
export const BURRHOG = {
  name: 'BURRHOG',
  // How it gets about in a room (GAITS in src/overworld/npc.js): curled up, it rolls.
  gait: 'roll',
  textFile: 'enemies/burrhog.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'pinefall',
  sprite: { rows: BURRHOG_SPRITE, palette: BURRHOG_PALETTE },
  maxHp: 330,
  damage: 15,

  // A Chapter 3 enemy: a step busier than the mountain's.
  difficulty: { density: 1.2, speed: 1.15 },

  // Its attacks live in src/battle/attacks/burrhog.js.
  patterns: [
    { name: 'burrRoll', weight: 3 },
    { name: 'burrQuills', weight: 3 },
    { name: 'burrCones', weight: 2 },
    { name: 'burrBristle', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  // Petting it calms it, but it's a pinecone: `hurt` is the HP it costs you.
  talk: [
    { name: 'Inspect' },
    { name: 'Pet it', calm: 40, hurt: 4 },
    { name: 'Curl up too', calm: 30 },
    { name: 'Roll it an apple', calm: 35 },
  ],

  rewards: { exp: 115, coins: 60 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'roast_chestnut', chance: 0.4 }],
};
