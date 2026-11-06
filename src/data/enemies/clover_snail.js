import { CLOVER_SNAIL_PALETTE, CLOVER_SNAIL_SPRITE, CLOVER_SNAIL_ANIM } from '../art/clover_snail.js';

// The CLOVER SNAIL's numbers: a slow, sleepy snail with a four-leaf
// clover for a shell, always about to fall asleep. It is not dangerous
// so much as drowsy, and a little contagious. Everything it says is in
// text/enemies/clover_snail.txt.
export const CLOVER_SNAIL = {
  name: 'CLOVER SNAIL',
  // How it gets about in a room (GAITS in src/overworld/npc.js).
  gait: 'ooze',
  textFile: 'enemies/clover_snail.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'sunnyside',
  sprite: { rows: CLOVER_SNAIL_SPRITE, palette: CLOVER_SNAIL_PALETTE },
  anim: CLOVER_SNAIL_ANIM,
  // Sunnyside's own battle song, the Dandelion Lion Rag.
  music: 'sunnyBattle',
  maxHp: 1900,
  damage: 55,

  // The easy end of Chapter 5, like the coast's first monsters.
  difficulty: { density: 1.2, speed: 1.15 },

  // Its attacks live in src/battle/attacks/clover_snail.js.
  patterns: [
    { name: 'snailTrail', weight: 3 },
    { name: 'snailClover', weight: 3 },
    { name: 'snailZzz', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Hum it a lullaby', calm: 40 },
    { name: 'Find the lucky leaf', calm: 35 },
    { name: 'Sit beside it', calm: 30 },
  ],

  rewards: { exp: 1900, coins: 10 },

  // What it sometimes leaves behind (src/data/items.js), with the chance of it.
  drops: [{ item: 'lucky_clover', chance: 0.4 }],
};
