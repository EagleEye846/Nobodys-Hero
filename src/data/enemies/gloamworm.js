import { GLOAMWORM_PALETTE, GLOAMWORM_SPRITE } from '../art/gloamworm.js';

// The GLOAMWORM's numbers: a glowworm grub that lives in the Underroot, the
// tunnels under the dead giant tree. It hangs from the roots on glowing silk
// threads beaded with sweet dew, and fishes for whatever comes to look at the
// lights. It has never seen the sky, it's very shy, and it thinks your candle
// is another glowworm, come at last to keep it company. Everything it says is
// in text/enemies/gloamworm.txt.
export const GLOAMWORM = {
  name: 'GLOAMWORM',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it lets
  // itself down on its thread and drifts along the roots.
  gait: 'float',
  textFile: 'enemies/gloamworm.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'hushwood',
  sprite: { rows: GLOAMWORM_SPRITE, palette: GLOAMWORM_PALETTE },
  maxHp: 440,
  damage: 18,

  // A Chapter 3 enemy from under the deep wood: a touch tougher than the
  // Knotling.
  difficulty: { density: 1.25, speed: 1.2 },

  // Its attacks live in src/battle/attacks/gloamworm.js.
  patterns: [
    { name: 'gloamLines', weight: 3 },
    { name: 'gloamLure', weight: 3 },
    { name: 'gloamSwing', weight: 2 },
    { name: 'gloamMotes', weight: 2 },
    { name: 'gloamRattle', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Hold up your candle', calm: 40 },
    { name: 'Tell it about the sky', calm: 35 },
    { name: 'Stay very still', calm: 30 },
  ],

  rewards: { exp: 160, coins: 85 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'gloam_honeydew', chance: 0.4 }],
};
