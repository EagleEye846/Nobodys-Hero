import { RUSSET_PALETTE, RUSSET_SPRITE } from '../art/russet.js';

// The RUSSET's numbers: a fox the red of the leaves it hides in, who thinks
// the whole forest is a game of hide-and-seek and is winning. It's been
// stealing pies off the woodcutters' sill for years. Quick, sly, and it
// pounces. Everything it says is in text/enemies/russet.txt.
export const RUSSET = {
  name: 'RUSSET',
  // How it gets about in a room (GAITS in src/overworld/npc.js): darts, then freezes.
  gait: 'dash',
  textFile: 'enemies/russet.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'pinefall',
  sprite: { rows: RUSSET_SPRITE, palette: RUSSET_PALETTE },
  maxHp: 280,
  damage: 16,

  // A Chapter 3 enemy, and a quick one.
  difficulty: { density: 1.15, speed: 1.25 },

  // Its attacks live in src/battle/attacks/russet.js.
  patterns: [
    { name: 'russetPiles', weight: 3 },
    { name: 'russetPounce', weight: 3 },
    { name: 'russetTail', weight: 2 },
    { name: 'russetTracks', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Hide in the leaves', calm: 40 },
    { name: 'Throw a stick', calm: 30 },
    { name: 'Play dead', calm: 35 },
  ],

  rewards: { exp: 110, coins: 70 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'stolen_pie', chance: 0.4 }],
};
