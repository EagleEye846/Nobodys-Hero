import { NET_WRAITH_PALETTE, NET_WRAITH_SPRITE, NET_WRAITH_ANIM } from '../art/net_wraith.js';

// The NET WRAITH's numbers: a fishing net that drowned with its boat and
// still hangs in the air as though it were in the water, drifting. It is
// very sad and entirely tangled, and it only wants to be hauled in at last.
// Everything it says is in text/enemies/net_wraith.txt.
export const NET_WRAITH = {
  name: 'NET WRAITH',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it drifts.
  gait: 'float',
  textFile: 'enemies/net_wraith.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'lanes',
  sprite: { rows: NET_WRAITH_SPRITE, palette: NET_WRAITH_PALETTE },
  anim: NET_WRAITH_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): it frays when hit and drips sea water;
  // beaten, the ghost goes up out of it and the net drops empty (its death clip).
  feel: { hit: 'ghost', idle: 'drip', color: '#bfe8dc', defeat: 'ghost' },
  // The coast's fights from the Lanes on: the shanty (the Wreck Yard's ones, in the storm song).
  music: 'coastBattleStorm',
  maxHp: 11000,
  damage: 91,

  difficulty: { density: 1.55, speed: 1.40 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore), and under 40% of its HP it layers a light
  // second attack on top (secondWind). See startAttack in battleScene.js.
  // (2026-11-10: comes in sooner and runs longer, was { at: 0.85, seconds: 4.5 }:
  // its attacks are done throwing a second or so before their end, and the box
  // sat empty until the encore came.)
  encore: { at: 0.72, seconds: 5.3, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
  // A tall hanging thing, standing off the ground a little.
  battlePos: { x: 218, y: 36 },

  // Its attacks live in src/battle/attacks/net_wraith.js.
  patterns: [
    { name: 'netGrid', weight: 3 },
    { name: 'netFloats', weight: 2 },
    { name: 'netHooks', weight: 2 },
    { name: 'netCurtain', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Untangle a knot', calm: 40 },
    { name: 'Mime the boat home', calm: 35 },
    { name: 'Hum a sea shanty', calm: 30 },
  ],

  rewards: { exp: 2600, coins: 14 },

  // A float it sometimes lets go of (src/data/items.js), with the chance of it.
  drops: [{ item: 'net_float', chance: 0.4 }],
};
