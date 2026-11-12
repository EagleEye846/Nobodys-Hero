import { QUARTZLING_PALETTE, QUARTZLING_SPRITE, QUARTZLING_ANIM, QUARTZLING_DISGUISE_SPRITES } from '../art/quartzling.js';

// The QUARTZLING's numbers: a little crystal creature that stands perfectly
// still among the crystals of the Glimmering and pretends to be one. It's
// very good at it. It has been standing in the same spot for so long that it
// has opinions about the crystals on either side, and it would like it noted
// that it has never once blinked. (It blinks.) Everything it says is in
// text/enemies/quartzling.txt.
//
// PLACING IT: it needs crystals to hide among. Give it the 'disguise'
// behaviour and put it in a room with crystal props or crystal tiles all
// round it (a crystal_* prop beside it, or O / x / I tiles): the cluster it
// wears looks right there and nowhere else.
export const QUARTZLING = {
  name: 'QUARTZLING',
  // How it gets about in a room (GAITS in src/overworld/npc.js): a dash, and
  // a long freeze after each, as if it's hoping you didn't see.
  gait: 'dash',
  textFile: 'enemies/quartzling.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'glimmer',
  sprite: { rows: QUARTZLING_SPRITE, palette: QUARTZLING_PALETTE },
  // What it looks like in a room while it's hiding as one of a cluster of
  // crystal spires (the "In disguise" behaviour in the Room Editor). The
  // first frame is how it stands; the others flash by now and then and give
  // it away (two eyes open; a small wave).
  disguise: {
    frames: [QUARTZLING_DISGUISE_SPRITES.still, QUARTZLING_DISGUISE_SPRITES.eye, QUARTZLING_DISGUISE_SPRITES.wave],
    palette: QUARTZLING_PALETTE,
  },
  // Stands stock still, a glint crosses it, it freezes harder before an
  // attack, cracks run over it when it's hit, it shatters when it's beaten,
  // and it blushes when it's spared. See src/data/art/quartzling.js.
  anim: QUARTZLING_ANIM,
  // The Chapter 4 battle song, once it's been written.
  music: 'belowBattle',
  maxHp: 1450,
  damage: 37,

  // The Glimmering: stillness, aimed shots, and things you can hardly see.
  difficulty: { density: 1.35, speed: 1.3 },

  // Its attacks live in src/battle/attacks/quartzling.js.
  patterns: [
    { name: 'quartzFreeze', weight: 3 },
    { name: 'quartzSplit', weight: 2 },
    { name: 'quartzGlint', weight: 2 },
    { name: 'quartzScurry', weight: 2 },
    { name: 'quartzSpire', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Say what a fine crystal it is', calm: 40 },
    { name: 'Stand still beside it', calm: 35 },
    { name: 'Pretend not to notice', calm: 30 },
  ],

  rewards: { exp: 740, coins: 20 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'rock_candy', chance: 0.4 }],
};
