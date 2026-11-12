import { PINWHEEL_PALETTE, PINWHEEL_SPRITE, PINWHEEL_ANIM } from '../art/pinwheel.js';

// The PINWHEEL's numbers: a violet sea urchin, round and cross, whose spines
// turn like the arms of a pinwheel when it's upset (it's upset a lot). It
// rolls about the shingle and the shallows, bristling at anything that looks
// like it might step on it, which is everything. Everything it says is in
// text/enemies/pinwheel.txt.
export const PINWHEEL = {
  name: 'PINWHEEL',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it rolls.
  gait: 'roll',
  textFile: 'enemies/pinwheel.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'wrack',
  sprite: { rows: PINWHEEL_SPRITE, palette: PINWHEEL_PALETTE },
  anim: PINWHEEL_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): spines shaken loose when hit, a glint before
  // it fires; beaten, its spines fly and it rolls away.
  feel: { hit: 'spines', windup: 'glint', at: [0.5, 0.12], defeat: 'spines', exit: 'roll' },
  // The coast's fights from the Wrack Shore on: the shanty.
  music: 'coastBattleStorm',
  maxHp: 10500,
  damage: 89,

  difficulty: { density: 1.50, speed: 1.40 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore, see startAttack in battleScene.js). No
  // secondWind: two of its attacks at once were too much to read.
  // (2026-11-10: comes in sooner and runs longer, was { at: 0.85, seconds: 4.5 }:
  // its attacks are done throwing a second or so before their end, and the box
  // sat empty until the encore came.)
  encore: { at: 0.72, seconds: 5.3, density: 0.8 },
  // Round and sat on the ground; it stands a little in.
  battlePos: { x: 214, y: 46 },

  // Its attacks live in src/battle/attacks/pinwheel.js.
  patterns: [
    { name: 'pinFan', weight: 3 },
    { name: 'pinRoll', weight: 2 },
    { name: 'pinRain', weight: 2 },
    { name: 'pinBurst', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Offer it a smooth stone', calm: 40 },
    { name: 'Admire its roundness', calm: 35 },
    { name: 'Sit down nearby', calm: 30 },
  ],

  rewards: { exp: 2400, coins: 13 },

  // A spine it sometimes sheds (src/data/items.js), with the chance of it.
  drops: [{ item: 'urchin_spine', chance: 0.4 }],
};
