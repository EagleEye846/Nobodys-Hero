import { REED_STALKER_PALETTE, REED_STALKER_SPRITE, REED_STALKER_DISGUISE_SPRITES } from '../art/reed_stalker.js';

// The REED STALKER's numbers: a tall grey heron that stands in the shallows
// of the Lantern Marsh among the reeds, on one leg, so still for so long
// that you'd swear it was a reed too. Then it strikes. It's the marsh's
// heavy: slow, and every attack is easy to see coming, but its beak is a
// spear and it hurts a LOT. Very patient, very proud, and very serious.
// Everything it says is in text/enemies/reed_stalker.txt.
export const REED_STALKER = {
  name: 'REED STALKER',
  // How it gets about in a room (GAITS in src/overworld/npc.js): slow,
  // careful, high steps, with a long freeze between each.
  gait: 'stomp',
  textFile: 'enemies/reed_stalker.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'marsh',
  sprite: { rows: REED_STALKER_SPRITE, palette: REED_STALKER_PALETTE },
  // What it looks like in a room while it's hiding as a clump of reeds (the
  // "In disguise" behaviour in the Room Editor). The first frame is how it
  // stands; the others flash by now and then and give it away (an eye
  // opens; the beak slides out).
  disguise: {
    frames: [REED_STALKER_DISGUISE_SPRITES.still, REED_STALKER_DISGUISE_SPRITES.eye, REED_STALKER_DISGUISE_SPRITES.beak],
    palette: REED_STALKER_PALETTE,
  },
  maxHp: 680,
  // Every hit hurts a lot more than the marsh's other monsters'.
  damage: 27,

  // Not many bullets, and each one slow to come, but big.
  difficulty: { density: 1.2, speed: 1.3 },

  // Its attacks live in src/battle/attacks/reed_stalker.js.
  patterns: [
    { name: 'stalkerStrike', weight: 3 },
    { name: 'stalkerReeds', weight: 3 },
    { name: 'stalkerFeathers', weight: 2 },
    { name: 'stalkerFishing', weight: 2 },
    { name: 'stalkerWade', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Stand very still', calm: 40 },
    { name: 'Admire its beak', calm: 35 },
    { name: 'Point out a fish', calm: 30 },
  ],

  // The marsh's toughest regular fight, so it pays the best.
  rewards: { exp: 230, coins: 110 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'bulrush_bread', chance: 0.4 }],
};
