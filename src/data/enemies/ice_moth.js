import { ICE_MOTH_PALETTE, ICE_MOTH_SPRITE } from '../art/ice_moth.js';

// The ICE MOTH's numbers: a moth of frost from the ice caves of Mount Vigil,
// drawn to the glow of the crystals in the rock. Quick, and never alone for
// long. Everything it says is in text/enemies/ice_moth.txt.
export const ICE_MOTH = {
  name: 'ICE MOTH',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it flies.
  gait: 'fly',
  textFile: 'enemies/ice_moth.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'vigil',
  sprite: { rows: ICE_MOTH_SPRITE, palette: ICE_MOTH_PALETTE },
  maxHp: 170,
  damage: 11,

  // A Chapter 2 enemy, and a flighty one: its moths are quick.
  difficulty: { density: 1.15, speed: 1.15 },

  // Its attacks live in src/battle/attacks/ice_moth.js.
  patterns: [
    { name: 'iceMothOrbit', weight: 3 },
    { name: 'iceMothScales', weight: 2 },
    { name: 'iceMothFlurry', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Hold still', calm: 25 },
    { name: 'Point at a crystal', calm: 45 },
    { name: 'Breathe on it', calm: 30 },
  ],

  rewards: { exp: 85, coins: 50 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'frost_nectar', chance: 0.4 }],
};
