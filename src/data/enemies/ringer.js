import { RINGER_PALETTE, RINGER_SPRITE, RINGER_DISGUISE_SPRITES } from '../art/ringer.js';

// The RINGER's numbers: a living iron climbing ring with a lot of opinions
// about who hammered it in. Hits hard, fights briefly. Everything it says is
// in text/enemies/ringer.txt.
export const RINGER = {
  name: 'RINGER',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it rocks like a hanging ring.
  gait: 'swing',
  textFile: 'enemies/ringer.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'vigil',
  sprite: { rows: RINGER_SPRITE, palette: RINGER_PALETTE },
  // In a room it hangs on the rock like any other grapple ring (the "In
  // disguise" behaviour in the Room Editor), so put it where rings belong:
  // at a cliff top or by a climbing face.
  disguise: {
    frames: [RINGER_DISGUISE_SPRITES.still, RINGER_DISGUISE_SPRITES.peek, RINGER_DISGUISE_SPRITES.twitch],
    palette: RINGER_PALETTE,
  },
  maxHp: 150,
  damage: 10,

  // A Chapter 2 enemy, and a heavy hitter.
  difficulty: { density: 1.15, speed: 1.15 },

  // Its attacks live in src/battle/attacks/ringer.js.
  patterns: [
    { name: 'ringPendulum', weight: 2 },
    { name: 'ringHammer', weight: 3 },
    { name: 'ringClang', weight: 3 },
    { name: 'ringRope', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Tighten it', calm: 30 },
    { name: 'Compliment the forging', calm: 40 },
    { name: 'Swing on it', calm: 35 },
  ],

  rewards: { exp: 85, coins: 50 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'filings_toffee', chance: 0.4 }],
};
