import { GLINTLING_PALETTE, GLINTLING_SPRITE } from '../art/glintling.js';

// The GLINTLING's numbers: a little cluster of living ice crystal from the
// ice caves of Mount Vigil, who plays with light and thinks it's hilarious.
// Small and fragile, but busy. Everything it says is in text/enemies/glintling.txt.
export const GLINTLING = {
  name: 'GLINTLING',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it darts, then freezes.
  gait: 'dash',
  textFile: 'enemies/glintling.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'vigil',
  sprite: { rows: GLINTLING_SPRITE, palette: GLINTLING_PALETTE },
  maxHp: 140,
  damage: 11,

  // A Chapter 2 enemy: small, but its tricks come thick and fast.
  difficulty: { density: 1.2, speed: 1.1 },

  // Its attacks live in src/battle/attacks/glintling.js.
  patterns: [
    { name: 'glintRefract', weight: 3 },
    { name: 'glintMirror', weight: 2 },
    { name: 'glintBurst', weight: 3 },
    { name: 'glintSkate', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Make a funny face', calm: 35 },
    { name: 'Cover the light', calm: 25 },
    { name: 'Admire the colours', calm: 45 },
  ],

  rewards: { exp: 75, coins: 45 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'glint_drop', chance: 0.45 }],
};
