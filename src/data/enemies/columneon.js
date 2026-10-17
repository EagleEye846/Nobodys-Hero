import { COLUMNEON_PALETTE, COLUMNEON_SPRITE, COLUMNEON_DISGUISE_SPRITES } from '../art/columneon.js';

// The COLUMNEON's numbers: a chameleon convinced it's a pillar. Everything it
// says is in text/enemies/columneon.txt.
export const COLUMNEON = {
  name: 'COLUMNEON',
  textFile: 'enemies/columneon.txt',
  sprite: { rows: COLUMNEON_SPRITE, palette: COLUMNEON_PALETTE },
  // What it looks like in a room while it's pretending (the "In disguise"
  // behaviour in the Room Editor). The first frame is how it stands; the
  // others flash by now and then and give it away.
  disguise: {
    frames: [COLUMNEON_DISGUISE_SPRITES.still, COLUMNEON_DISGUISE_SPRITES.tongue, COLUMNEON_DISGUISE_SPRITES.blink],
    palette: COLUMNEON_PALETTE,
  },
  maxHp: 120,
  damage: 6,

  // An early Ruins enemy, so a little gentler than full strength.
  difficulty: { density: 0.85, speed: 0.85 },

  // Its attacks live in src/battle/attacks/columneon.js.
  patterns: [
    { name: 'columneonTongue', weight: 3 },
    { name: 'columneonCrumble', weight: 2 },
    { name: 'columneonCamouflage', weight: 2 },
    { name: 'columneonTailCurl', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Chat', calm: 30 },
    { name: 'Compliment', calm: 35 },
    { name: 'Disguise', calm: 40 },
  ],

  rewards: { exp: 36, coins: 26 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'pillar_mint', chance: 0.4 }],
};
