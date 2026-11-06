import { WRACKEEL_PALETTE, WRACKEEL_SPRITE, WRACKEEL_ANIM } from '../art/wrackeel.js';

// The WRACKEEL's numbers: a long teal eel that lives in the half-drowned
// lanes and crackles when it's cross, which is always a little. It isn't
// cruel, it's just wired wrong: every time it's startled it zaps whatever is
// nearest. Everything it says is in text/enemies/wrackeel.txt.
export const WRACKEEL = {
  name: 'WRACKEEL',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it darts and freezes.
  gait: 'dash',
  textFile: 'enemies/wrackeel.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'lanes',
  // It slips through shallow water as well as over the ground.
  swims: true,
  sprite: { rows: WRACKEEL_SPRITE, palette: WRACKEEL_PALETTE },
  anim: WRACKEEL_ANIM,
  // The coast's fights from the Lanes on: the shanty.
  music: 'coastBattleStorm',
  maxHp: 2050,
  damage: 60,

  difficulty: { density: 1.4, speed: 1.3 },
  // Long and low, it lies along the bottom of the picture.
  battlePos: { x: 208, y: 58 },

  // Its attacks live in src/battle/attacks/wrackeel.js.
  patterns: [
    { name: 'eelZig', weight: 3 },
    { name: 'eelChain', weight: 2 },
    { name: 'eelCoil', weight: 2 },
    { name: 'eelSurge', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Offer a rubber boot', calm: 40 },
    { name: 'Hum a low note', calm: 35 },
    { name: 'Look away politely', calm: 30 },
  ],

  rewards: { exp: 2600, coins: 14 },

  // Skin it sometimes sheds (src/data/items.js), with the chance of it.
  drops: [{ item: 'eel_skin', chance: 0.4 }],
};
