import { OLM_PALETTE, OLM_SPRITE, OLM_ANIM } from '../art/olm.js';

// The OLM's numbers: a long, pale, blind salamander, older than the stair,
// that lives in the Stillwater and is terribly polite about it. It hates
// being looked at. It would never dream of being rude, so it only coils
// round you, fans its frills, lays a few eggs, puts out the lights, and
// drips. Everything it says is in text/enemies/olm.txt.
export const OLM = {
  name: 'OLM',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it slides, slowly and politely.
  gait: 'ooze',
  // It swims: open water doesn't stop it in a room (see Npc.blockedAt).
  swims: true,
  textFile: 'enemies/olm.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'stillwater',
  sprite: { rows: OLM_SPRITE, palette: OLM_PALETTE },
  // It's wide, so it stands a little left of the usual spot to stay on screen.
  battlePos: { x: 206, y: 62 },
  // Its battle clips (idle, windup, hurt, death, spared, and an intro as the
  // fight starts): see src/data/art/olm.js.
  anim: OLM_ANIM,
  // The Chapter 4 battle song, once it's been written.
  music: 'belowBattle',
  maxHp: 1800,
  damage: 42,

  // The Stillwater's other regular: slow and patient, but with a lot of it.
  difficulty: { density: 1.5, speed: 1.35 },

  // Its attacks live in src/battle/attacks/olm.js.
  patterns: [
    { name: 'olmCoil', weight: 3 },
    { name: 'olmFrills', weight: 2 },
    { name: 'olmEggs', weight: 2 },
    { name: 'olmDim', weight: 2 },
    { name: 'olmDrip', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Look away', calm: 40 },
    { name: 'Apologise for staring', calm: 35 },
    { name: 'Bow', calm: 30 },
  ],

  rewards: { exp: 950, coins: 27 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'olm_tea', chance: 0.4 }],
};
