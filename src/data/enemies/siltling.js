import { SILTLING_PALETTE, SILTLING_SPRITE } from '../art/siltling.js';

// The SILTLING's numbers: a slump of drain silt that has been settling under
// Hollin's well for fifty years, and collecting everything that came down it:
// thimbles, buttons, pennies, a key, a spoon, a doll's shoe. It's very proud
// of its collection and a bit lonely with it, and it can't decide whether
// you've come to add to it or to take something away. Everything it says is
// in text/enemies/siltling.txt.
export const SILTLING = {
  name: 'SILTLING',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it slumps
  // along the culvert floor.
  gait: 'ooze',
  textFile: 'enemies/siltling.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'drains',
  sprite: { rows: SILTLING_SPRITE, palette: SILTLING_PALETTE },
  maxHp: 480,
  damage: 19,

  // The Old Drains, below Hollin: a step up from the Hushwood's.
  difficulty: { density: 1.3, speed: 1.2 },

  // Its attacks live in src/battle/attacks/siltling.js.
  patterns: [
    { name: 'siltFling', weight: 3 },
    { name: 'siltSort', weight: 3 },
    { name: 'siltSink', weight: 2 },
    { name: 'siltSettle', weight: 2 },
    { name: 'siltGrab', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Admire its collection', calm: 40 },
    { name: 'Give it a button', calm: 35 },
    { name: 'Help it sort', calm: 30 },
  ],

  rewards: { exp: 175, coins: 90 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'fifty_year_humbug', chance: 0.4 }],
};
