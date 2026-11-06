import { KELPIE_FOAL_PALETTE, KELPIE_FOAL_SPRITE, KELPIE_FOAL_ANIM } from '../art/kelpie_foal.js';

// The KELPIE FOAL's numbers: a young water-horse, glossy and green and
// dripping, all knees and mane. It wants to be a proper, frightening kelpie
// when it grows up, and it has been practising. It gallops about ponds,
// shallows and rock pools. One of the two easiest of Chapter 5's monsters
// (with the gullion): it is met in Sunnyside's mill pond before the storm.
// Everything it says is in text/enemies/kelpie_foal.txt.
export const KELPIE_FOAL = {
  name: 'KELPIE FOAL',
  // How it gets about in a room (GAITS in src/overworld/npc.js): big leaps and a rest.
  gait: 'bound',
  textFile: 'enemies/kelpie_foal.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'sunnyside',
  // It wades and swims, as a water-horse would.
  swims: true,
  sprite: { rows: KELPIE_FOAL_SPRITE, palette: KELPIE_FOAL_PALETTE },
  anim: KELPIE_FOAL_ANIM,
  // The coast's fights: the shanty (also on Sunnyside's mill pond, in place of sunnyBattle).
  music: 'coastBattleStorm',
  maxHp: 1900,
  damage: 55,

  // The easy end of the chapter: plenty of room.
  difficulty: { density: 1.25, speed: 1.2 },
  // Long and low; it stands with its hooves on the bottom of the picture.
  battlePos: { x: 212, y: 44 },

  // Its attacks live in src/battle/attacks/kelpie_foal.js.
  patterns: [
    { name: 'kelpSplash', weight: 3 },
    { name: 'kelpWhip', weight: 2 },
    { name: 'kelpWave', weight: 2 },
    { name: 'kelpCharge', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Pretend to be frightened', calm: 40 },
    { name: 'Offer a sugar lump', calm: 35 },
    { name: 'Hold still and let it sniff', calm: 30 },
  ],

  rewards: { exp: 2650, coins: 14 },

  // A braid of its mane it sometimes sheds (src/data/items.js), with the chance of it.
  drops: [{ item: 'kelp_mane', chance: 0.4 }],
};
