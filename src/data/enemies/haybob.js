import { HAYBOB_PALETTE, HAYBOB_SPRITE, HAYBOB_ANIM } from '../art/haybob.js';

// The HAYBOB's numbers: a round hay bale in a straw hat that got loose from
// its field one morning, found out it could roll, and has not stopped since.
// It's very pleased with itself. A harvest mouse lives in it and has, so far,
// not been consulted. The other cheerful fake-out of Sunnyside: bouncy and
// readable, but still Chapter 4's tier. Everything it says is in
// text/enemies/haybob.txt.
export const HAYBOB = {
  name: 'HAYBOB',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it rolls.
  gait: 'roll',
  textFile: 'enemies/haybob.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'sunnyside',
  sprite: { rows: HAYBOB_SPRITE, palette: HAYBOB_PALETTE },
  // The spiral turns and the mouse peeks out, it squashes down before a roll,
  // the hat flies off when it's hit, it comes undone into a heap of straw
  // when it's beaten, and it tips its hat when it's spared. See
  // src/data/art/haybob.js.
  anim: HAYBOB_ANIM,
  // Sunnyside's own battle song, once it's there.
  music: 'sunnyBattle',
  maxHp: 960,
  damage: 36,

  // The easy end of the chapter: big bouncy things, not too many.
  difficulty: { density: 1.2, speed: 1.25 },

  // Its attacks live in src/battle/attacks/haybob.js.
  patterns: [
    { name: 'hayRoll', weight: 3 },
    { name: 'hayStraw', weight: 2 },
    { name: 'hayFork', weight: 2 },
    { name: 'hayStack', weight: 2 },
    { name: 'hayMouse', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Compliment the hat', calm: 40 },
    { name: 'Ask about the mouse', calm: 35 },
    { name: 'Roll along with it', calm: 30 },
  ],

  rewards: { exp: 650, coins: 18 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'hay_biscuit', chance: 0.4 }],
};
