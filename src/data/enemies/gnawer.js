import { GNAWER_PALETTE, GNAWER_SPRITE, GNAWER_ANIM } from '../art/gnawer.js';

// The GNAWER's numbers: a blind, grey, mouse-ish thing in the Deep with
// far too many teeth, that has been down here a very long time and has
// learned to hear everything: your pulse, your boots, your thinking about
// running. It closes its teeth in rows, aims at wherever it last heard you,
// gnaws through the floor, scatters bones, and screams until the walls
// scream back. Everything it says is in text/enemies/gnawer.txt.
export const GNAWER = {
  name: 'GNAWER',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it shuffles.
  gait: 'waddle',
  textFile: 'enemies/gnawer.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'deep',
  sprite: { rows: GNAWER_SPRITE, palette: GNAWER_PALETTE },
  // It's wide, so it stands a little left of the usual spot to stay on screen.
  battlePos: { x: 226, y: 52 },
  // Its battle clips (idle, windup, hurt, death, spared, and an intro as the
  // fight starts): see src/data/art/gnawer.js.
  anim: GNAWER_ANIM,
  // The Chapter 4 battle song, once it's been written.
  music: 'belowBattle',
  maxHp: 1900,
  damage: 44,

  // The Deep: the hardest regulars of the chapter, and the strangest.
  difficulty: { density: 1.55, speed: 1.45 },

  // Its attacks live in src/battle/attacks/gnawer.js.
  patterns: [
    { name: 'gnawTeeth', weight: 3 },
    { name: 'gnawHear', weight: 3 },
    { name: 'gnawFloor', weight: 2 },
    { name: 'gnawBones', weight: 2 },
    { name: 'gnawScream', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Hum something', calm: 40 },
    { name: 'Offer it a bone', calm: 35 },
    { name: 'Tap a slow rhythm', calm: 30 },
  ],

  rewards: { exp: 1075, coins: 28 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'gnawbone_broth', chance: 0.4 }],
};
