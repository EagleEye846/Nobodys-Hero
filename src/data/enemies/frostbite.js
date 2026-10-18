import { FROSTBITE_PALETTE, FROSTBITE_SPRITE, FROSTBITE_DISGUISE_SPRITES } from '../art/frostbite.js';

// The FROSTBITE's numbers: a snowdrift that got up and walked. Slow, tough,
// and it only wants a hug. Everything it says is in text/enemies/frostbite.txt.
export const FROSTBITE = {
  name: 'FROSTBITE',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it squashes and stretches along.
  gait: 'ooze',
  textFile: 'enemies/frostbite.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'vigil',
  sprite: { rows: FROSTBITE_SPRITE, palette: FROSTBITE_PALETTE },
  // In a room it lies low as a heap of snow (the "In disguise" behaviour in
  // the Room Editor). It can do that anywhere there's snow.
  disguise: {
    frames: [FROSTBITE_DISGUISE_SPRITES.still, FROSTBITE_DISGUISE_SPRITES.look, FROSTBITE_DISGUISE_SPRITES.grin],
    palette: FROSTBITE_PALETTE,
  },
  maxHp: 220,
  damage: 9,

  // A Chapter 2 enemy: slow things, but a lot of them.
  difficulty: { density: 1.15, speed: 1.05 },

  // Its attacks live in src/battle/attacks/frostbite.js.
  patterns: [
    { name: 'frostDrift', weight: 3 },
    { name: 'frostIcicles', weight: 3 },
    { name: 'frostSnowball', weight: 2 },
    { name: 'frostShiver', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  // A hug calms it the most, but its hugs are very cold: `hurt` is the HP
  // it costs you.
  talk: [
    { name: 'Inspect' },
    { name: 'Hug it', calm: 40, hurt: 4 },
    { name: 'Build a snowman', calm: 35 },
    { name: 'Shiver dramatically', calm: 25 },
  ],

  rewards: { exp: 95, coins: 55 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'snow_cone', chance: 0.4 }],
};
