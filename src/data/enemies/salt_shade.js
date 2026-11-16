import { SALT_SHADE_PALETTE, SALT_SHADE_SPRITE, SALT_SHADE_ANIM } from '../art/salt_shade.js';

// The SALT SHADE's numbers: the ghost of a drowned sailor in a sou'wester,
// still waiting on the wreck yard's beaches for a ship that was supposed to
// come back for him. He doesn't mean harm. He throws what a sailor throws:
// an anchor on a rope arc, a message in a bottle (that bursts into bubbles
// when it's opened), and ropes with loops in them, to haul you in.
// Everything he says is in text/enemies/salt_shade.txt.
export const SALT_SHADE = {
  name: 'SALT SHADE',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it drifts, and flickers.
  gait: 'float',
  // Whether it moves through water (a ghost, it crosses water as well as land).
  swims: true,
  textFile: 'enemies/salt_shade.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'wreck',
  sprite: { rows: SALT_SHADE_SPRITE, palette: SALT_SHADE_PALETTE },
  // He sways, the hem streams, he hauls the rope arm back before a throw,
  // comes apart into bubbles when beaten, and takes off his hat when spared.
  // See src/data/art/salt_shade.js.
  anim: SALT_SHADE_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): it frays when hit and gives off pale wisps;
  // beaten, its light goes up and it drifts away.
  feel: { hit: 'ghost', idle: 'wisps', defeat: 'ghost', exit: 'float' },
  // The chapter 5 storm battle song (the Wreck Yard and on).
  music: 'coastBattleStorm',
  maxHp: 9600,
  damage: 93,

  difficulty: { density: 1.75, speed: 1.60 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore), and under 40% of its HP it layers a light
  // second attack on top (secondWind). See startAttack in battleScene.js.
  encore: { at: 0.85, seconds: 4.5, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
  battlePos: { x: 218, y: 44 },

  // His attacks live in src/battle/attacks/salt_shade.js.
  patterns: [
    { name: 'shadeLamp', weight: 3 },
    { name: 'shadeBrine', weight: 3 },
    { name: 'shadeLead', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Tap your wrist', calm: 40 },
    { name: 'Take the rope', calm: 35 },
    { name: 'Point at the tide', calm: 30 },
  ],

  rewards: { exp: 2950, coins: 14 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'ghost_rope', chance: 0.4 }],
};
