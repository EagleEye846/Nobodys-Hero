import { BOG_TOAD_PALETTE, BOG_TOAD_SPRITE } from '../art/bog_toad.js';

// The BOG TOAD's numbers: a huge old toad that sleeps on a lily pad in the
// black pools of the Lantern Marsh, and has done for longer than anyone can
// remember. Big, slow, warty, and very, very grumpy about being woken up.
// All it wants is for everyone to go away so it can get back to sleep.
// Everything it says is in text/enemies/bog_toad.txt.
export const BOG_TOAD = {
  name: 'BOG TOAD',
  // How it gets about in a room (GAITS in src/overworld/npc.js): slow,
  // heavy little hops, with a long sit between each.
  gait: 'hop',
  textFile: 'enemies/bog_toad.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'marsh',
  sprite: { rows: BOG_TOAD_SPRITE, palette: BOG_TOAD_PALETTE },
  maxHp: 620,
  damage: 21,

  // Slow, but there's a lot of it: its bullets come thick but not fast.
  difficulty: { density: 1.3, speed: 1.15 },

  // Its attacks live in src/battle/attacks/bog_toad.js. Its GULP picks up
  // the whole battle box and carries it off, you and all, then spits it back.
  patterns: [
    { name: 'toadLash', weight: 3 },
    { name: 'toadFlies', weight: 3 },
    { name: 'toadGulp', weight: 2 },
    { name: 'toadSpawnHatch', weight: 2 },
    { name: 'toadFlop', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Let it sleep', calm: 40 },
    { name: 'Catch it a fly', calm: 35 },
    { name: 'Croak at it', calm: 30 },
  ],

  rewards: { exp: 205, coins: 100 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'bog_pudding', chance: 0.4 }],
};
