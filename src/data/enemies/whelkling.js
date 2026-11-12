import { WHELKLING_PALETTE, WHELKLING_SPRITE, WHELKLING_ANIM } from '../art/whelkling.js';

// The WHELKLING's numbers: a hermit crab in a great spiral whelk shell far too
// big for it, crusted with little anemones that glow in the dark. It lives in
// the pool in the cliff cave (and in the inlet in the Fishers' Hollow below),
// and it has very strong feelings about its shell. One of the cliff cave's two
// monsters (with the barnacle bat), as easy as the gullion and the kelpie foal.
// It swims, so it keeps to the deep water (and the shallows round it).
// Everything it says is in text/enemies/whelkling.txt.
export const WHELKLING = {
  name: 'WHELKLING',
  // How it gets about in a room (GAITS in src/overworld/npc.js): a sideways scuttle that stops to look.
  gait: 'dash',
  textFile: 'enemies/whelkling.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'gullrest',
  // It lives in the water: it goes through the deep pool that stops you.
  swims: true,
  sprite: { rows: WHELKLING_SPRITE, palette: WHELKLING_PALETTE },
  anim: WHELKLING_ANIM,
  // The coast's fights (Gullrest's version of it in the cliff cave, as before).
  music: 'coastBattleStorm',
  maxHp: 9700,
  damage: 83,

  // Not a pushover (it was too easy): up with Gullrest's beach monsters.
  difficulty: { density: 1.65, speed: 1.50 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore, see startAttack in battleScene.js). No
  // secondWind: two of its attacks at once were too much to read.
  // (2026-11-10: comes in sooner and runs longer, was { at: 0.85, seconds: 4.5 }:
  // its attacks are done throwing a second or so before their end, and the box
  // sat empty until the encore came.)
  encore: { at: 0.72, seconds: 5.3, density: 0.8 },
  // Big and squat: the shell sits on the bottom of the picture.
  battlePos: { x: 212, y: 46 },

  // Its attacks live in src/battle/attacks/whelkling.js.
  patterns: [
    { name: 'whelkSting', weight: 3 },
    { name: 'whelkSpiral', weight: 2 },
    { name: 'whelkPinch', weight: 3 },
    { name: 'whelkRoll', weight: 2 },
  ],

  // TALK options (the hero's own actions; the hero never speaks). Each name
  // needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Admire the shell', calm: 40 },
    { name: 'Offer a bigger shell', calm: 35 },
    { name: 'Sit still by the pool', calm: 30 },
  ],

  rewards: { exp: 2100, coins: 12 },

  // A boiled sweet from its hoard (src/data/items.js), with the chance of it.
  drops: [{ item: 'sea_glass_sweet', chance: 0.4 }],
};
