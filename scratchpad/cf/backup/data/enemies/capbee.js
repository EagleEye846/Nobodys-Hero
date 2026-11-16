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
  // How it feels to fight (src/battle/foeFeel.js): pollen when hit; beaten, a puff of pollen.
  feel: { hit: 'fluff', color: '#ffe27a', defeat: 'fluff' },
  // Sunnyside's own battle song, the Dandelion Lion Rag.
  music: 'sunnyBattle',
  maxHp: 5800,
  damage: 79,

  // The easy end of Chapter 5, like the coast's first monsters.
  difficulty: { density: 1.40, speed: 1.35 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore), and under 40% of its HP it layers a light
  // second attack on top (secondWind). See startAttack in battleScene.js.
  // (2026-11-10: comes in sooner and runs longer, was { at: 0.85, seconds: 4.5 }:
  // its attacks are done throwing a second or so before their end, and the box
  // sat empty until the encore came.)
  encore: { at: 0.72, seconds: 5.3, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },

  // Its attacks live in src/battle/attacks/capbee.js.
  patterns: [
    { name: 'beeWaggle', weight: 3 },
    { name: 'beeComb', weight: 3 },
    { name: 'beeRound', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Point at the clover', calm: 40 },
    { name: 'Admire the cap', calm: 35 },
    { name: 'Sniff the honey', calm: 30 },
  ],

  rewards: { exp: 2100, coins: 8 },

  // What it sometimes leaves behind (src/data/items.js), with the chance of it.
  drops: [{ item: 'flatcap_honey', chance: 0.4 }],
};
