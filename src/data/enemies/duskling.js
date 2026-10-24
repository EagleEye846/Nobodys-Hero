import { DUSKLING_PALETTE, DUSKLING_SPRITE } from '../art/duskling.js';

// The DUSKLING's numbers. Everything it says is in text/enemies/duskling.txt.
export const DUSKLING = {
  name: 'DUSKLING',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it drifts and flickers.
  gait: 'float',
  textFile: 'enemies/duskling.txt',
  sprite: { rows: DUSKLING_SPRITE, palette: DUSKLING_PALETTE },
  maxHp: 130,
  damage: 9,

  difficulty: { density: 0.95, speed: 0.9 },

  // Its attacks, in src/battle/attacks/duskling.js: staring eyes, grasping
  // hands, curving crescents, a cage of tendrils and wisps that follow you.
  patterns: [
    { name: 'dusklingWatchingEyes', weight: 2 },
    { name: 'dusklingGraspingHands', weight: 2 },
    { name: 'dusklingCrescentBlades', weight: 2 },
    { name: 'dusklingTendrilCage', weight: 2 },
    { name: 'dusklingLostWisps', weight: 2 },
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
