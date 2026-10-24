import { WISP_PALETTE, WISP_SPRITE, WISP_DISGUISE_SPRITES } from '../art/wisp.js';

// The WISP's numbers: a marsh light out in the fog of the Lantern Marsh. It
// copies the lanterns on the poles that mark the safe path, so well you
// can't tell it from them, and leads travellers off the path and out into
// the bog. Not to drown them: it just wants someone to come and see it,
// and nobody ever stays. Lonely more than wicked. Everything it says is in
// text/enemies/wisp.txt.
export const WISP = {
  name: 'WISP',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it drifts,
  // and flickers.
  gait: 'float',
  textFile: 'enemies/wisp.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'marsh',
  sprite: { rows: WISP_SPRITE, palette: WISP_PALETTE },
  // What it looks like in a room while it's pretending to be a lantern on a
  // pole (the "In disguise" behaviour in the Room Editor). The first frame
  // is how it stands; the others flash by now and then and give it away (it
  // blinks; its flame goes green).
  disguise: {
    frames: [WISP_DISGUISE_SPRITES.still, WISP_DISGUISE_SPRITES.eyes, WISP_DISGUISE_SPRITES.flicker],
    palette: WISP_PALETTE,
  },
  maxHp: 540,
  damage: 20,

  // The Lantern Marsh, past the Old Drains: a step up again.
  difficulty: { density: 1.35, speed: 1.25 },

  // Its attacks live in src/battle/attacks/wisp.js. In two of them one of
  // the lights is real, and touching it HEALS you.
  patterns: [
    { name: 'wispLure', weight: 3 },
    { name: 'wispPath', weight: 2 },
    { name: 'wispBlink', weight: 3 },
    { name: 'wispGas', weight: 2 },
    { name: 'wispLonely', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Keep it company', calm: 40 },
    { name: 'Wave back', calm: 35 },
    { name: 'Say it glows nicely', calm: 30 },
  ],

  rewards: { exp: 195, coins: 100 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'wisp_cordial', chance: 0.4 }],
};
