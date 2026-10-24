import { GRIST_PALETTE, GRIST_SPRITE } from '../art/grist.js';

// GRIST's numbers: a big mill rat who moved into Hollin's old mill the week
// the woodcutters left, fifty years ago, and has called itself the Miller
// ever since. It wears a flour-sack apron, carries a nibbled oat loaf
// everywhere, and is very, very proud of "its" mill. A show-off, and a bit of
// a coward underneath. Everything it says is in text/enemies/grist.txt.
export const GRIST = {
  name: 'GRIST',
  // How it gets about in a room (GAITS in src/overworld/npc.js): scurries,
  // then stops to look important.
  gait: 'dash',
  textFile: 'enemies/grist.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'hollin',
  sprite: { rows: GRIST_SPRITE, palette: GRIST_PALETTE },
  maxHp: 460,
  damage: 18,

  // A Chapter 3 enemy from the village at the end of the wood: busier than
  // the Hayward.
  difficulty: { density: 1.3, speed: 1.2 },

  // Its attacks live in src/battle/attacks/grist.js.
  patterns: [
    { name: 'gristFlour', weight: 3 },
    { name: 'gristMillstone', weight: 3 },
    { name: 'gristTail', weight: 2 },
    { name: 'gristWheel', weight: 2 },
    { name: 'gristChute', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Admire the mill', calm: 40 },
    { name: 'Call it Miller', calm: 35 },
    { name: 'Say "boo"', calm: 30 },
  ],

  rewards: { exp: 165, coins: 95 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'millers_bannock', chance: 0.4 }],
};
