import { CLINKER_PALETTE, CLINKER_SPRITE } from '../art/clinker.js';

// The CLINKER's numbers: a rust-red crayfish in the Old Drains under Hollin,
// living in an enamel mug that came down the well fifty years ago, the way a
// hermit crab lives in a shell. It bangs on the mug when it's cross, which
// is always, and it's gone a bit deaf from it. Grumpy, very territorial, and
// very, very attached to its mug. Everything it says is in
// text/enemies/clinker.txt.
export const CLINKER = {
  name: 'CLINKER',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it rocks
  // along with the mug on its back.
  gait: 'waddle',
  textFile: 'enemies/clinker.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'drains',
  sprite: { rows: CLINKER_SPRITE, palette: CLINKER_PALETTE },
  maxHp: 520,
  damage: 19,

  // A Chapter 3 enemy from under Hollin's well: a step past the Grist.
  difficulty: { density: 1.3, speed: 1.2 },

  // Its attacks live in src/battle/attacks/clinker.js.
  patterns: [
    { name: 'clinkerShears', weight: 3 },
    { name: 'clinkerClang', weight: 3 },
    { name: 'clinkerRust', weight: 2 },
    { name: 'clinkerBackflip', weight: 2 },
    { name: 'clinkerMugRoll', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Admire the mug', calm: 40 },
    { name: 'Knock politely', calm: 35 },
    { name: 'Say it LOUDER', calm: 30 },
  ],

  rewards: { exp: 185, coins: 95 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'mug_barley_sugar', chance: 0.4 }],
};
