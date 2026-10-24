import { PUFFCAP_PALETTE, PUFFCAP_SPRITE } from '../art/puffcap.js';

// The PUFFCAP's numbers: a fat, sleepy toadstool that lives at the damp edge
// of the mist, where the Hushwood starts. It's very pleased with itself for
// no reason anyone can find, and it puffs spores when it's startled, which is
// whenever anyone comes by. Everything it says is in text/enemies/puffcap.txt.
export const PUFFCAP = {
  name: 'PUFFCAP',
  // How it gets about in a room (GAITS in src/overworld/npc.js): little
  // bouncing hops, like it's been dropped.
  gait: 'hop',
  textFile: 'enemies/puffcap.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'pinefall',
  sprite: { rows: PUFFCAP_SPRITE, palette: PUFFCAP_PALETTE },
  maxHp: 340,
  damage: 15,

  // A Hushwood enemy: a touch busier than the Pinefall's.
  difficulty: { density: 1.25, speed: 1.15 },

  // Its attacks live in src/battle/attacks/puffcap.js.
  patterns: [
    { name: 'puffStartle', weight: 3 },
    { name: 'puffFairyRing', weight: 3 },
    { name: 'puffGills', weight: 2 },
    { name: 'puffFortyWinks', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Sing a lullaby', calm: 40 },
    { name: 'Tiptoe', calm: 30 },
    { name: 'Admire its cap', calm: 35 },
  ],

  rewards: { exp: 125, coins: 65 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'toadstool_toast', chance: 0.4 }],
};
