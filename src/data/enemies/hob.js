import { HOB_PALETTE, HOB_SPRITE } from '../art/hob.js';

// The HOB's numbers: Hollin's house-hob. When the woodcutters left, fifty
// years ago, it stayed behind and kept house, because a hob keeps house. It
// still sweeps every floor, lays every table, keeps the kettle on and bakes a
// scone each morning in case anyone comes home. It is very, very particular
// about mud. Everything it says is in text/enemies/hob.txt.
export const HOB = {
  name: 'HOB',
  // How it gets about in a room (GAITS in src/overworld/npc.js): little
  // busy steps, broom over its shoulder.
  gait: 'waddle',
  textFile: 'enemies/hob.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'hollin',
  sprite: { rows: HOB_SPRITE, palette: HOB_PALETTE },
  maxHp: 420,
  damage: 18,

  // A Chapter 3 enemy from the village at the end of the wood: about as busy
  // as the Knotling.
  difficulty: { density: 1.25, speed: 1.2 },

  // Its attacks live in src/battle/attacks/hob.js.
  patterns: [
    { name: 'hobSweep', weight: 3 },
    { name: 'hobTable', weight: 3 },
    { name: 'hobKettle', weight: 2 },
    { name: 'hobKeys', weight: 2 },
    { name: 'hobDust', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Wipe your feet', calm: 40 },
    { name: 'Praise the floor', calm: 35 },
    { name: 'Ask about the family', calm: 30 },
  ],

  rewards: { exp: 155, coins: 90 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'hob_scone', chance: 0.4 }],
};
