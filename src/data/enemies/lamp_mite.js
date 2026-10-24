import { LAMP_MITE_PALETTE, LAMP_MITE_SPRITE, LAMP_MITE_DISGUISE_SPRITES } from '../art/lamp_mite.js';

// The LAMP MITES' numbers: tiny dusty moths that nest in the dead street
// lamps of the old city in the Hollow Valley, a whole family to a lamp. The
// lamps went out long ago, but the mites never got the news, and they still
// come pouring out at anything that glows (your SOUL glows). One at a time
// they're nothing. They are never one at a time. Quick, fussy, and very
// excited. Everything they say is in text/enemies/lamp_mite.txt.
export const LAMP_MITE = {
  name: 'LAMP MITES',
  // How they get about in a room (GAITS in src/overworld/npc.js): they flutter.
  gait: 'fly',
  textFile: 'enemies/lamp_mite.txt',
  // Where they belong until they're placed in a room (the Studio lists them
  // under this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'valley',
  sprite: { rows: LAMP_MITE_SPRITE, palette: LAMP_MITE_PALETTE },
  // What they look like in a room while they're hiding inside a dead street
  // lamp (the "In disguise" behaviour in the Room Editor). The first frame
  // is how it stands; the others flash by now and then and give them away
  // (eyes glint in the glass; one crawls out over the top).
  disguise: {
    frames: [LAMP_MITE_DISGUISE_SPRITES.still, LAMP_MITE_DISGUISE_SPRITES.eyes, LAMP_MITE_DISGUISE_SPRITES.peek],
    palette: LAMP_MITE_PALETTE,
  },
  maxHp: 580,
  // Each mite hardly stings, but there are a LOT of them.
  damage: 20,

  // The Dead City, past Lasthome: a notch up from the marsh. Swarms: lots of
  // tiny, quick bullets.
  difficulty: { density: 1.45, speed: 1.4 },

  // Their attacks live in src/battle/attacks/lamp_mite.js.
  patterns: [
    { name: 'miteSwarm', weight: 3 },
    { name: 'miteDust', weight: 2 },
    { name: 'miteGlass', weight: 2 },
    { name: 'miteCircle', weight: 3 },
    { name: 'miteDart', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Polish a lamp', calm: 40 },
    { name: 'Share your pocket fluff', calm: 35 },
    { name: 'Flutter your hands', calm: 30 },
  ],

  rewards: { exp: 225, coins: 110 },

  // Snacks they sometimes leave behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'dust_meringue', chance: 0.4 }],
};
