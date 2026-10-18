import { STEP_PALETTE, STEP_SPRITE, STEP_DISGUISE_SPRITES } from '../art/step.js';

// The LOOSE STEP's numbers: the forty-third step of the Long Stair, knocked
// loose in the rockslide, still waiting for the Hero to walk down it.
// Everything it says is in text/enemies/loose_step.txt.
export const LOOSE_STEP = {
  name: 'LOOSE STEP',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it shuffles and thuds down.
  gait: 'stomp',
  textFile: 'enemies/loose_step.txt',
  sprite: { rows: STEP_SPRITE, palette: STEP_PALETTE },
  // In a room it lies in the grass looking like a fallen block (the "In
  // disguise" behaviour in the Room Editor). It can do that anywhere outdoors.
  disguise: {
    frames: [STEP_DISGUISE_SPRITES.still, STEP_DISGUISE_SPRITES.glare, STEP_DISGUISE_SPRITES.glance],
    palette: STEP_PALETTE,
  },
  maxHp: 160,
  damage: 9,

  // A Chapter 2 enemy: busier and quicker than anything in the Ruins.
  difficulty: { density: 1.15, speed: 1.1 },

  // Its attacks live in src/battle/attacks/step.js.
  patterns: [
    { name: 'stepTumble', weight: 3 },
    { name: 'stepFootfall', weight: 3 },
    { name: 'stepCrack', weight: 2 },
    { name: 'stepRockslide', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Step on it', calm: 40 },
    { name: 'Brush off moss', calm: 30 },
    { name: 'Read the carving', calm: 35 },
  ],

  rewards: { exp: 70, coins: 40 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'step_shortbread', chance: 0.4 }],
};
