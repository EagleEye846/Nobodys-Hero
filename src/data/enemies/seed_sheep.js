import { SEED_SHEEP_PALETTE, SEED_SHEEP_SPRITE, SEED_SHEEP_ANIM } from '../art/seed_sheep.js';

// The SEED SHEEP's numbers: a small, placid sheep whose fleece is a
// dandelion clock. It grazes the Sunnyside fields, baas at nothing in
// particular, and sheds a few seeds every time it does. Sleepy-sweet, a
// little round, and as strong as Chapter 5's easiest monsters. Everything it
// says is in text/enemies/seed_sheep.txt.
export const SEED_SHEEP = {
  name: 'SEED SHEEP',
  // How it gets about in a room (GAITS in src/overworld/npc.js).
  gait: 'waddle',
  textFile: 'enemies/seed_sheep.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'sunnyside',
  sprite: { rows: SEED_SHEEP_SPRITE, palette: SEED_SHEEP_PALETTE },
  anim: SEED_SHEEP_ANIM,
  // Sunnyside's own battle song, the Dandelion Lion Rag.
  music: 'sunnyBattle',
  maxHp: 1850,
  damage: 54,

  // The easy end of Chapter 5, like the coast's first monsters.
  difficulty: { density: 1.25, speed: 1.2 },

  // Its attacks live in src/battle/attacks/seed_sheep.js.
  patterns: [
    { name: 'sheepSeeds', weight: 3 },
    { name: 'sheepRam', weight: 2 },
    { name: 'sheepPuff', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Scratch behind the ears', calm: 40 },
    { name: 'Count its seeds', calm: 35 },
    { name: 'Make a wish', calm: 30 },
  ],

  rewards: { exp: 1850, coins: 10 },

  // What it sometimes leaves behind (src/data/items.js), with the chance of it.
  drops: [{ item: 'clock_wool', chance: 0.4 }],
};
