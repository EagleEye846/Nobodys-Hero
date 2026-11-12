import { DRILLBUG_PALETTE, DRILLBUG_SPRITE, DRILLBUG_ANIM } from '../art/drillbug.js';

// The DRILLBUG's numbers: a stout beetle with a mining helmet and a drill for
// a nose, who has dug more tunnels in the Diggings than anyone has ever
// walked down, and can tell you about every one. It's a very good miner and
// an awful navigator: half of its tunnels end in somebody's cellar. It's
// proud of them anyway. Everything it says is in text/enemies/drillbug.txt.
export const DRILLBUG = {
  name: 'DRILLBUG',
  // How it gets about in a room (GAITS in src/overworld/npc.js): a steady,
  // busy walk.
  gait: 'walk',
  textFile: 'enemies/drillbug.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'diggings',
  sprite: { rows: DRILLBUG_SPRITE, palette: DRILLBUG_PALETTE },
  // The drill ticks over and its legs shuffle; it revs, shaking, before a
  // bore; its helmet pops off when it's hit; it ends up on its back, legs in
  // the air, when it's beaten; and it takes its helmet off to you when it's
  // spared. See src/data/art/drillbug.js.
  anim: DRILLBUG_ANIM,
  // The Chapter 4 battle song, once it's been written.
  music: 'belowBattle',
  maxHp: 1600,
  damage: 40,

  // The Diggings, the first of the deep: heavy, fast, plenty.
  difficulty: { density: 1.45, speed: 1.35 },

  // Its attacks live in src/battle/attacks/drillbug.js.
  patterns: [
    { name: 'drillWalls', weight: 3 },
    { name: 'drillTunnels', weight: 2 },
    { name: 'drillBits', weight: 2 },
    { name: 'drillRumble', weight: 2 },
    { name: 'drillRail', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Praise a tunnel', calm: 40 },
    { name: 'Ask for directions', calm: 35 },
    { name: 'Admire the drill', calm: 30 },
  ],

  rewards: { exp: 845, coins: 23 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'pit_pasty', chance: 0.4 }],
};
