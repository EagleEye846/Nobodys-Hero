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
  // How it feels to fight (src/battle/foeFeel.js): a clack off the shell when hit; beaten, bits
  // of shell and clover.
  feel: { hit: 'shell', defeat: 'clatter', color: '#c8e8a0' },
  // Sunnyside's own battle song, the Dandelion Lion Rag.
  music: 'sunnyBattle',
  maxHp: 5900,
  damage: 83,

  // The easy end of Chapter 5, like the coast's first monsters.
  difficulty: { density: 1.35, speed: 1.25 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore), and under 40% of its HP it layers a light
  // second attack on top (secondWind). See startAttack in battleScene.js.
  // (2026-11-10, round 2: the encore comes in sooner and fuller, so the two
  // attacks overlap; it was { at: 0.85, seconds: 4.5, density: 0.8 }, and the
  // careful dodger took almost no hits from it.)
  encore: { at: 0.65, seconds: 5.6, density: 0.85 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },

  // Its attacks live in src/battle/attacks/clover_snail.js.
  patterns: [
    { name: 'snailTrail', weight: 3 },
    { name: 'snailClover', weight: 3 },
    { name: 'snailZzz', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Hum it a lullaby', calm: 40 },
    { name: 'Find the lucky leaf', calm: 35 },
    { name: 'Sit beside it', calm: 30 },
  ],

  rewards: { exp: 2200, coins: 8 },

  // What it sometimes leaves behind (src/data/items.js), with the chance of it.
  drops: [{ item: 'lucky_clover', chance: 0.4 }],
};
