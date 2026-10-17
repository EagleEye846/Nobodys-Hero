import { CRAGHORN_PALETTE, CRAGHORN_SPRITE } from '../art/craghorn.js';

// The CRAGHORN's numbers: a mountain goat who meant to show the Hero the way
// up, and has run up and down the Long Stair every day since, just in case.
// Everything it says is in text/enemies/craghorn.txt.
export const CRAGHORN = {
  name: 'CRAGHORN',
  textFile: 'enemies/craghorn.txt',
  sprite: { rows: CRAGHORN_SPRITE, palette: CRAGHORN_PALETTE },
  maxHp: 180,
  damage: 9,

  // A Chapter 2 enemy: busier and quicker than anything in the Ruins.
  difficulty: { density: 1.15, speed: 1.15 },

  // Its attacks live in src/battle/attacks/craghorn.js.
  patterns: [
    { name: 'cragCharge', weight: 3 },
    { name: 'cragBleat', weight: 2 },
    { name: 'cragRicochet', weight: 3 },
    { name: 'cragGraze', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Race', calm: 35 },
    { name: 'Bleat', calm: 30 },
    { name: 'Offer grass', calm: 40 },
  ],

  rewards: { exp: 80, coins: 50 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'crag_cheese', chance: 0.4 }],
};
