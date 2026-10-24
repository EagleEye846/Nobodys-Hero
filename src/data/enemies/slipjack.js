import { SLIPJACK_PALETTE, SLIPJACK_SPRITE } from '../art/slipjack.js';

// The SLIPJACK's numbers: an eel that lives in the Old Drains' culverts,
// where the water runs shallow and fast, and rides the currents for the fun
// of it, all day, like a child on a slide. It thinks it's the fastest thing
// there has ever been, and it may be right. Slippery, cheeky, and very vain
// about it. Everything it says is in text/enemies/slipjack.txt.
export const SLIPJACK = {
  name: 'SLIPJACK',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it wriggles
  // along from side to side.
  gait: 'swing',
  textFile: 'enemies/slipjack.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'drains',
  sprite: { rows: SLIPJACK_SPRITE, palette: SLIPJACK_PALETTE },
  maxHp: 470,
  damage: 20,

  // Quick, as it'll tell you: a step past the Hushwood's worst.
  difficulty: { density: 1.3, speed: 1.3 },

  // Its attacks live in src/battle/attacks/slipjack.js.
  patterns: [
    { name: 'slipRun', weight: 3 },
    { name: 'slipShowOff', weight: 3 },
    { name: 'slipSnap', weight: 2 },
    { name: 'slipCoil', weight: 2 },
    { name: 'slipWhirl', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Clap', calm: 40 },
    { name: 'Ask to race', calm: 35 },
    { name: 'Count how fast', calm: 30 },
  ],

  rewards: { exp: 180, coins: 90 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'culvert_cress', chance: 0.4 }],
};
