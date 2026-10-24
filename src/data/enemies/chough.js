import { CHOUGH_PALETTE, CHOUGH_SPRITE } from '../art/chough.js';

// The CHOUGH's numbers: a mountain crow with a red beak and a wicked sense of
// humour, who has watched six climbers fail and thought it was all very
// funny. Quick and fragile. Everything it says is in text/enemies/chough.txt.
export const CHOUGH = {
  name: 'CHOUGH',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it flies.
  gait: 'fly',
  textFile: 'enemies/chough.txt',
  sprite: { rows: CHOUGH_SPRITE, palette: CHOUGH_PALETTE },
  maxHp: 120,
  damage: 10,

  // A Chapter 2 enemy, and a quick one: its things fly fast.
  difficulty: { density: 1.1, speed: 1.2 },

  // Its attacks live in src/battle/attacks/chough.js.
  patterns: [
    { name: 'choughDive', weight: 3 },
    { name: 'choughPebbles', weight: 2 },
    { name: 'choughShiny', weight: 2 },
    { name: 'choughCaw', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Wave arms', calm: 20 },
    { name: 'Offer shiny thing', calm: 45 },
    { name: 'Caw back', calm: 35 },
  ],

  rewards: { exp: 60, coins: 45 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'shiny_button', chance: 0.4 }],
};
