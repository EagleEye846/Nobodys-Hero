import { ICE_STEP_PALETTE, ICE_STEP_SPRITE, ICE_STEP_DISGUISE_SPRITES } from '../art/iceStep.js';

// The FROZEN STEP's numbers: the top step of the Long Stair, the Loose Step's
// brother, frozen into a block of ice while it waited up here for the one at
// the bottom. It fights like its brother, in ice (src/battle/attacks/iceStep.js).
// Everything it says is in text/enemies/frozen_step.txt.
export const FROZEN_STEP = {
  name: 'FROZEN STEP',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it shuffles and thuds down.
  gait: 'stomp',
  textFile: 'enemies/frozen_step.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'vigil',
  sprite: { rows: ICE_STEP_SPRITE, palette: ICE_STEP_PALETTE },
  // In a room it sits in the snow looking like a snow-topped block (the "In
  // disguise" behaviour in the Room Editor), anywhere up the mountain.
  disguise: {
    frames: [ICE_STEP_DISGUISE_SPRITES.still, ICE_STEP_DISGUISE_SPRITES.glare, ICE_STEP_DISGUISE_SPRITES.glance],
    palette: ICE_STEP_PALETTE,
  },
  maxHp: 190,
  damage: 12,

  // A little busier than its brother at the bottom.
  difficulty: { density: 1.25, speed: 1.15 },

  // The Loose Step's moves in ice and snow (src/battle/attacks/iceStep.js).
  patterns: [
    { name: 'iceStepTumble', weight: 3 },
    { name: 'iceStepFootfall', weight: 3 },
    { name: 'iceStepCrack', weight: 2 },
    { name: 'iceStepAvalanche', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Chip off the ice', calm: 30 },
    { name: 'Mention step 43', calm: 45 },
    { name: 'Sit on it', calm: 35 },
  ],

  rewards: { exp: 90, coins: 50 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'ice_shortbread', chance: 0.4 }],
};
