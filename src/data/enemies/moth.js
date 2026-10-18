import { MOTH_PALETTE, MOTH_SPRITE } from '../art/moth.js';

// The LANTERN MOTH's numbers. Everything it says is in text/enemies/lantern_moth.txt.
export const LANTERN_MOTH = {
  name: 'LANTERN MOTH',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it flies.
  gait: 'fly',
  textFile: 'enemies/lantern_moth.txt',
  sprite: { rows: MOTH_SPRITE, palette: MOTH_PALETTE },
  maxHp: 150,
  damage: 7,

  // The second enemy: a step up from the dummy, but still gentle.
  difficulty: { density: 1, speed: 0.9 },

  // The moth's own attacks, all in src/battle/attacks/moth.js: homing moths,
  // lantern beams, a swinging lantern dropping flames, hatching cocoons, and
  // spiralling wing dust.
  patterns: [
    { name: 'mothSwarm', weight: 2 },
    { name: 'mothLanternBeam', weight: 2 },
    { name: 'mothSwingingLantern', weight: 2 },
    { name: 'mothCocoonHatch', weight: 2 },
    { name: 'mothWingDust', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Dim your light', calm: 35 },
    { name: 'Admire wings', calm: 30 },
    { name: 'Hum softly', calm: 40 },
  ],

  rewards: { exp: 60, coins: 45 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'glow_jam', chance: 0.35 }],
  // Candle-making materials it leaves behind (see src/data/candles.js), beaten or spared.
  materials: [{ id: 'glow_dust', chance: 0.6, amount: 1 }],
};
