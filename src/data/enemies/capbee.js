import { CAPBEE_PALETTE, CAPBEE_SPRITE, CAPBEE_ANIM } from '../art/capbee.js';

// The FLATCAP BEE's numbers: a plump bumblebee in a tweed flat cap who has
// worked the same clover patch for forty years, and says so. Fussy rather
// than fierce, and fond of his mates, his honey and his hat, in that
// order on a good day. Everything he says is in text/enemies/capbee.txt.
export const CAPBEE = {
  name: 'FLATCAP BEE',
  // How it gets about in a room (GAITS in src/overworld/npc.js).
  gait: 'fly',
  textFile: 'enemies/capbee.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'sunnyside',
  sprite: { rows: CAPBEE_SPRITE, palette: CAPBEE_PALETTE },
  anim: CAPBEE_ANIM,
  // Sunnyside's own battle song, the Dandelion Lion Rag.
  music: 'sunnyBattle',
  maxHp: 1800,
  damage: 53,

  // The easy end of Chapter 5, like the coast's first monsters.
  difficulty: { density: 1.25, speed: 1.25 },

  // Its attacks live in src/battle/attacks/capbee.js.
  patterns: [
    { name: 'beeWaggle', weight: 3 },
    { name: 'beeHoney', weight: 3 },
    { name: 'beeCap', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Ask about the clover', calm: 40 },
    { name: 'Admire the cap', calm: 35 },
    { name: 'Compliment the honey', calm: 30 },
  ],

  rewards: { exp: 1800, coins: 10 },

  // What it sometimes leaves behind (src/data/items.js), with the chance of it.
  drops: [{ item: 'flatcap_honey', chance: 0.4 }],
};
