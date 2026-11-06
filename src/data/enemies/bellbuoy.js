import { BELLBUOY_PALETTE, BELLBUOY_SPRITE, BELLBUOY_ANIM } from '../art/bellbuoy.js';

// The BELLBUOY's numbers: a haunted bell buoy that has slipped its mooring
// and goes on ringing, in the sunken lanes and the wreck yard, for ships that
// aren't there. Nobody has seen who rings the bell, and the bell isn't
// saying. It tolls rings on the beat (so you can feel it coming), lashes
// its anchor chain round, and blows a foghorn cone that sweeps the box.
// Everything it says is in text/enemies/bellbuoy.txt.
export const BELLBUOY = {
  name: 'BELLBUOY',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it rocks on the swell.
  gait: 'swing',
  // Whether it moves through water (it floats, so it may sit in shallows).
  swims: true,
  textFile: 'enemies/bellbuoy.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'lanes',
  sprite: { rows: BELLBUOY_SPRITE, palette: BELLBUOY_PALETTE },
  // It rocks, the bell swings, the eyes flare, it goes under when beaten
  // and rings once, softly, when spared. See src/data/art/bellbuoy.js.
  anim: BELLBUOY_ANIM,
  // The chapter 5 storm battle song (the Lanes, the Wreck Yard, and on).
  music: 'coastBattleStorm',
  maxHp: 2150,
  damage: 60,

  difficulty: { density: 1.6, speed: 1.5 },
  battlePos: { x: 218, y: 44 },

  // Its attacks live in src/battle/attacks/bellbuoy.js.
  patterns: [
    { name: 'buoyToll', weight: 3 },
    { name: 'buoyChain', weight: 3 },
    { name: 'buoyHorn', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Ring back', calm: 40 },
    { name: 'Hold the clapper', calm: 35 },
    { name: 'Light the lamp', calm: 30 },
  ],

  rewards: { exp: 2500, coins: 13 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'buoy_bell', chance: 0.4 }],
};
