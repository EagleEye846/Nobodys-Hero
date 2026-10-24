import { RIMEWING_PALETTE, RIMEWING_SPRITE } from '../art/rimewing.js';

// The RIMEWING's numbers: a lantern moth grown huge in the cold, drawn up the
// mountain by the village's lamps. Rare: one at a time, somewhere with a
// light to circle. Everything it says is in text/enemies/rimewing.txt.
export const RIMEWING = {
  name: 'RIMEWING',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it flies.
  gait: 'fly',
  textFile: 'enemies/rimewing.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'vigil',
  sprite: { rows: RIMEWING_SPRITE, palette: RIMEWING_PALETTE },
  maxHp: 260,
  damage: 12,

  // A Chapter 2 enemy, and the toughest of the regulars.
  difficulty: { density: 1.15, speed: 1.1 },

  // Its attacks live in src/battle/attacks/rimewing.js.
  patterns: [
    { name: 'rimeLampDrawn', weight: 3 },
    { name: 'rimeFrostDust', weight: 2 },
    { name: 'rimeBeat', weight: 2 },
    { name: 'rimeCandle', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Shade the lamp', calm: 35 },
    { name: 'Hum', calm: 30 },
    { name: 'Mention the Keeper', calm: 50 },
  ],

  rewards: { exp: 130, coins: 70 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'rime_jam', chance: 0.5 }],
};
