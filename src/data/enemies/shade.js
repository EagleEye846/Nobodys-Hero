import { SHADE_PALETTE, SHADE_SPRITE } from '../art/shade.js';

// The SHADE's numbers. Everything it says is in text/enemies/shade.txt.
export const SHADE = {
  name: 'SHADE',
  textFile: 'enemies/shade.txt',
  sprite: { rows: SHADE_SPRITE, palette: SHADE_PALETTE },
  maxHp: 130,
  damage: 7,

  difficulty: { density: 0.95, speed: 0.9 },

  // Its attacks, in src/battle/attacks/shade.js: staring eyes, grasping
  // hands, curving crescents, a cage of tendrils and wisps that follow you.
  patterns: [
    { name: 'shadeWatchingEyes', weight: 2 },
    { name: 'shadeGraspingHands', weight: 2 },
    { name: 'shadeCrescentBlades', weight: 2 },
    { name: 'shadeTendrilCage', weight: 2 },
    { name: 'shadeLostWisps', weight: 2 },
  ],

  talk: [
    { name: 'Inspect' },
    { name: 'Stand in its shadow', calm: 30 },
    { name: 'Share a secret', calm: 40 },
    { name: 'Say its name', calm: 35 },
  ],

  rewards: { exp: 55, coins: 35 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'dark_chocolate', chance: 0.3 }],
  // Candle-making materials it leaves behind (see src/data/candles.js), beaten or spared.
  materials: [{ id: 'shadow_ash', chance: 0.6, amount: 1 }],
};
