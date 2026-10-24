import { WAXLING_PALETTE, WAXLING_SPRITE } from '../art/waxling.js';

// The WAXLING's numbers. Everything it says is in text/enemies/waxling.txt.
export const WAXLING = {
  name: 'WAXLING',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it rocks side to side.
  gait: 'waddle',
  textFile: 'enemies/waxling.txt',
  sprite: { rows: WAXLING_SPRITE, palette: WAXLING_PALETTE },
  maxHp: 110,
  damage: 9,

  difficulty: { density: 0.95, speed: 0.9 },

  // Its attacks, in src/battle/attacks/waxling.js: wax drips that splash,
  // candles whose flames shoot up, tossed matchsticks, a creeping wall of
  // flame with a gap, and smoke curls that drift after you.
  patterns: [
    { name: 'waxlingDripSplash', weight: 2 },
    { name: 'waxlingCandleColumns', weight: 2 },
    { name: 'waxlingMatchToss', weight: 2 },
    { name: 'waxlingFlameCurtain', weight: 1 },
    { name: 'waxlingSmokeCurls', weight: 1 },
  ],

  talk: [
    { name: 'Inspect' },
    { name: 'Shield its flame', calm: 35 },
    { name: 'Admire its glow', calm: 30 },
    { name: 'Tell it a story', calm: 40 },
  ],

  rewards: { exp: 45, coins: 30 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'wax_drop', chance: 0.45 }],
  // Candle-making materials it leaves behind (see src/data/candles.js), beaten or spared.
  materials: [{ id: 'wax', chance: 0.8, amount: 2 }],
};
