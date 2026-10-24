import { CAIRN_HOUND_PALETTE, CAIRN_HOUND_SPRITE, CAIRN_HOUND_DISGUISE_SPRITES } from '../art/cairn_hound.js';

// The CAIRN HOUND's numbers: a dog made of stacked stones, the kind of
// cairn people heaped up by the road for their dead in the old city. Its
// masters are long gone, but nobody told it, so it still guards their
// cairns, very seriously, and won't let strangers past. Heavy and tough,
// hits hard, but it's a good dog really. It would very much like someone to
// tell it so. Everything it says is in text/enemies/cairn_hound.txt.
export const CAIRN_HOUND = {
  name: 'CAIRN HOUND',
  // How it gets about in a room (GAITS in src/overworld/npc.js): big,
  // heavy, happy bounds.
  gait: 'bound',
  textFile: 'enemies/cairn_hound.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'valley',
  sprite: { rows: CAIRN_HOUND_SPRITE, palette: CAIRN_HOUND_PALETTE },
  // What it looks like in a room while it's sitting as a cairn by the road
  // (the "In disguise" behaviour in the Room Editor). The first frame is how
  // it sits; the others flash by now and then and give it away (two eyes
  // open; the top stone hops, because it's wagging).
  disguise: {
    frames: [CAIRN_HOUND_DISGUISE_SPRITES.still, CAIRN_HOUND_DISGUISE_SPRITES.eyes, CAIRN_HOUND_DISGUISE_SPRITES.wag],
    palette: CAIRN_HOUND_PALETTE,
  },
  maxHp: 760,
  // It's made of rocks. Being hit by it is being hit by rocks.
  damage: 28,

  // Heavy things, not too many of them, coming in fast.
  difficulty: { density: 1.25, speed: 1.35 },

  // Its attacks live in src/battle/attacks/cairn_hound.js.
  patterns: [
    { name: 'houndFetch', weight: 3 },
    { name: 'houndStack', weight: 2 },
    { name: 'houndBark', weight: 3 },
    { name: 'houndDig', weight: 2 },
    { name: 'houndPatrol', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Call it a good dog', calm: 40 },
    { name: 'Add a stone to it', calm: 35 },
    { name: 'Throw a stick', calm: 30 },
  ],

  // The Dead City's heavy, so it pays a little more.
  rewards: { exp: 245, coins: 115 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'cairn_biscuit', chance: 0.4 }],
};
