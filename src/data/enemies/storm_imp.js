import { STORM_IMP_PALETTE, STORM_IMP_SPRITE, STORM_IMP_ANIM } from '../art/storm_imp.js';

// The STORM IMP's numbers: a little thundercloud with a grin, left running
// by a spell that went wrong. It is the storm's idea of being naughty:
// childish, quick, a bit of a show-off, and entirely unaware that its jokes
// hurt. Everything it says is in text/enemies/storm_imp.txt.
export const STORM_IMP = {
  name: 'STORM IMP',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it drifts.
  gait: 'float',
  textFile: 'enemies/storm_imp.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'reach',
  sprite: { rows: STORM_IMP_SPRITE, palette: STORM_IMP_PALETTE },
  anim: STORM_IMP_ANIM,
  // The coast's fights from the Wreck Yard on: the storm one.
  music: 'coastBattleStorm',
  maxHp: 2200,
  damage: 66,

  difficulty: { density: 1.5, speed: 1.4 },
  // It hovers up in the air to the right of the box.
  battlePos: { x: 226, y: 34 },

  // Its attacks live in src/battle/attacks/storm_imp.js.
  patterns: [
    { name: 'impFork', weight: 3 },
    { name: 'impRain', weight: 2 },
    { name: 'impGust', weight: 2 },
    { name: 'impBall', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Play along', calm: 40 },
    { name: 'Hold up an umbrella', calm: 35 },
    { name: 'Tell it a joke', calm: 30 },
  ],

  rewards: { exp: 3250, coins: 25 },

  // A scrap of it that doesn't blow away (src/data/items.js), with the chance of it.
  drops: [{ item: 'static_puff', chance: 0.4 }],
};
