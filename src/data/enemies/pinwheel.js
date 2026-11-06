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
  // The coast's fights from the Wrack Shore on: the shanty.
  music: 'coastBattleStorm',
  maxHp: 2050,
  damage: 59,

  difficulty: { density: 1.35, speed: 1.3 },
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
    { name: 'Tell it it is very round', calm: 35 },
    { name: 'Sit down nearby', calm: 30 },
  ],

  rewards: { exp: 2400, coins: 13 },

  // A spine it sometimes sheds (src/data/items.js), with the chance of it.
  drops: [{ item: 'urchin_spine', chance: 0.4 }],
};
