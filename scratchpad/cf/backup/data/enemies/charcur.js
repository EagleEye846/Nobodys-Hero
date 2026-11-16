import { CHARCUR_PALETTE, CHARCUR_SPRITE, CHARCUR_ANIM } from '../art/charcur.js';

// The CHARCUR's numbers: a lean stray dog of charcoal, ember-eyed, its tail
// smoking, that follows the old road up and down as if it is waiting for
// somebody to come back along it. It guards the road because nobody told it
// to stop. Its words are in text/enemies/charcur.txt.
export const CHARCUR = {
  name: 'CHARCUR',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it darts, then
  // freezes and looks down the road.
  gait: 'dash',
  textFile: 'enemies/charcur.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'ashroad',
  sprite: { rows: CHARCUR_SPRITE, palette: CHARCUR_PALETTE },
  anim: CHARCUR_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): ash and a spark knocked off
  // it, embers lifting off its flanks, its hackles and eyes up before it goes.
  feel: { hit: 'ash', idle: 'embers', windup: 'charge', at: [0.12, 0.3], color: '#ff8c1a', defeat: 'ashfall' },
  music: 'ashBattle',
// (HP by the rule of 13 November 2026: an ordinary monster takes about 4-5 good FIGHTs
  // from the hero at the level it's met, about LV 50 with the Fallen Star +3, a good FIGHT about 850.)
  maxHp: 4400,
  damage: 104,

  difficulty: { density: 1.9, speed: 1.7 },
  encore: { at: 0.72, seconds: 5.3, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
  battlePos: { x: 214, y: 62 },

  // Its attacks live in src/battle/attacks/charcur.js.
  patterns: [
    { name: 'charBones', weight: 3 },
    { name: 'charHowl', weight: 3 },
    { name: 'charDig', weight: 2 },
    { name: 'charFetch', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Hold out a hand', calm: 40 },
    { name: 'Throw a stick', calm: 35 },
    { name: 'Wait with it', calm: 30 },
  ],

  rewards: { exp: 6200, coins: 18 },

  // Its collar, from whoever it's waiting for (src/data/items.js), with the chance of it.
  drops: [{ item: 'charred_collar', chance: 0.4 }],
};
