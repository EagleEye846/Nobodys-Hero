import { BUNNY_PALETTE, BUNNY_SPRITE } from '../art/bunny.js';

// The DUST BUNNY's numbers. Everything it says is in text/enemies/dust_bunny.txt.
export const DUST_BUNNY = {
  name: 'DUST BUNNY',
  textFile: 'enemies/dust_bunny.txt',
  sprite: { rows: BUNNY_SPRITE, palette: BUNNY_PALETTE },
  maxHp: 80,
  damage: 5,

  // Small and skittish: an easy fight.
  difficulty: { density: 0.85, speed: 0.85 },

  // Its own attacks, in src/battle/attacks/bunny.js: dusty sneezes, hopping
  // baby bunnies, a broom sweeping lint, falling carrots and corner cobwebs.
  patterns: [
    { name: 'bunnySneeze', weight: 3 },
    { name: 'bunnyHopscotch', weight: 3 },
    { name: 'bunnyBroomSweep', weight: 2 },
    { name: 'bunnyCarrotDrop', weight: 2 },
    { name: 'bunnyCobweb', weight: 2 },
  ],

  talk: [
    { name: 'Inspect' },
    { name: 'Pet', calm: 40 },
    { name: 'Offer a crumb', calm: 35 },
    { name: 'Stay very still', calm: 30 },
  ],

  rewards: { exp: 25, coins: 15 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'wild_carrot', chance: 0.4 }],
  // Candle-making materials it leaves behind (see src/data/candles.js), beaten or spared.
  materials: [{ id: 'moonbell', chance: 0.6, amount: 1 }],
};
