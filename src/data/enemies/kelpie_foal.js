import { KELPIE_FOAL_PALETTE, KELPIE_FOAL_SPRITE, KELPIE_FOAL_ANIM } from '../art/kelpie_foal.js';

// The KELPIE FOAL's numbers: a young water-horse, glossy and green and
// dripping, all knees and mane. It wants to be a proper, frightening kelpie
// when it grows up, and it has been practising. It gallops about ponds,
// shallows and rock pools. One of the two easiest of Chapter 5's monsters
// (with the gullion): it is met in Merrow's high street, the Soundings and
// all over the Beacon Isles.
// Everything it says is in text/enemies/kelpie_foal.txt.
export const KELPIE_FOAL = {
  name: 'KELPIE FOAL',
  // How it gets about in a room (GAITS in src/overworld/npc.js): big leaps and a rest.
  gait: 'bound',
  textFile: 'enemies/kelpie_foal.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'isles',
  // It wades and swims, as a water-horse would.
  swims: true,
  sprite: { rows: KELPIE_FOAL_SPRITE, palette: KELPIE_FOAL_PALETTE },
  anim: KELPIE_FOAL_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): weed and water when hit, drips off its mane,
  // a splash as it stamps; beaten, it goes down into the water.
  feel: { hit: 'kelp', idle: 'drip', windup: 'stamp', at: [0.45, 0.9], defeat: 'splash', exit: 'sink' },
  // The coast's fights: the shanty (swapped per area in battleScene.js).
  music: 'coastBattleStorm',
  maxHp: 8700,
  damage: 83,

  // The easy end of the chapter: plenty of room.
  difficulty: { density: 1.40, speed: 1.30 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore), and under 40% of its HP it layers a light
  // second attack on top (secondWind). See startAttack in battleScene.js.
  // (2026-11-10: comes in sooner and runs longer, was { at: 0.85, seconds: 4.5 }:
  // its attacks are done throwing a second or so before their end, and the box
  // sat empty until the encore came.)
  encore: { at: 0.72, seconds: 5.3, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
  // Long and low; it stands with its hooves on the bottom of the picture.
  battlePos: { x: 212, y: 44 },

  // Its attacks live in src/battle/attacks/kelpie_foal.js.
  patterns: [
    { name: 'kelpLaps', weight: 3 },
    { name: 'kelpLeap', weight: 3 },
    { name: 'kelpLure', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Pretend to be frightened', calm: 40 },
    { name: 'Offer a sugar lump', calm: 35 },
    { name: 'Hold still and let it sniff', calm: 30 },
  ],

  rewards: { exp: 2650, coins: 11 },

  // A braid of its mane it sometimes sheds (src/data/items.js), with the chance of it.
  drops: [{ item: 'kelp_mane', chance: 0.4 }],
};
