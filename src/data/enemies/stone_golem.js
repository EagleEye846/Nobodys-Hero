import { STONE_GOLEM_PALETTE, STONE_GOLEM_SPRITE, STONE_GOLEM_BOULDER_PALETTE, STONE_GOLEM_DISGUISE_SPRITES } from '../art/stone_golem.js';

// The STONE GOLEM's numbers: a heap of cave stone in the ice caves of Mount
// Vigil that got up and walked, with crystals of ice growing out of it. Slow,
// heavy and very tough, the hardest of the cave's regulars.
// Everything it says is in text/enemies/stone_golem.txt.
export const STONE_GOLEM = {
  name: 'STONE GOLEM',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it rolls.
  gait: 'roll',
  textFile: 'enemies/stone_golem.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'vigil',
  sprite: { rows: STONE_GOLEM_SPRITE, palette: STONE_GOLEM_PALETTE },
  // In a room it lies curled up as a boulder (the "In disguise" behaviour in
  // the Room Editor), the same stone as the boulder tile `O`, with a shard of
  // ice on top. Best placed among real boulders.
  disguise: {
    frames: [STONE_GOLEM_DISGUISE_SPRITES.still, STONE_GOLEM_DISGUISE_SPRITES.look, STONE_GOLEM_DISGUISE_SPRITES.glint],
    palette: STONE_GOLEM_BOULDER_PALETTE,
  },
  maxHp: 300,
  damage: 10,

  // A Chapter 2 enemy: slow, heavy things, but plenty of them.
  difficulty: { density: 1.15, speed: 1.05 },

  // Its attacks live in src/battle/attacks/stone_golem.js.
  patterns: [
    { name: 'golemFist', weight: 3 },
    { name: 'golemCrystals', weight: 3 },
    { name: 'golemTremor', weight: 2 },
    { name: 'golemGeode', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Stand very still', calm: 30 },
    { name: 'Admire crystals', calm: 40 },
    { name: 'Knock politely', calm: 35 },
  ],

  rewards: { exp: 150, coins: 75 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'geode_candy', chance: 0.45 }],
};
