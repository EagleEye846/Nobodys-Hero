import { OLD_DIVER_PALETTE, OLD_DIVER_SPRITE, OLD_DIVER_ANIM } from '../art/old_diver.js';

// The OLD DIVER's numbers: a brass-and-canvas diving suit, empty, that walks
// the wrecks as though somebody were still inside it and had a job to finish.
// Nobody is. It is very good at its job anyway. A slow, heavy walker with a
// harpoon and a perished air hose. Everything it says is in
// text/enemies/old_diver.txt.
export const OLD_DIVER = {
  name: 'OLD DIVER',
  // How it gets about in a room (GAITS in src/overworld/npc.js): heavy lead boots.
  gait: 'stomp',
  textFile: 'enemies/old_diver.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'wreck',
  sprite: { rows: OLD_DIVER_SPRITE, palette: OLD_DIVER_PALETTE },
  anim: OLD_DIVER_ANIM,
  // The coast's fights from the Wreck Yard on: the storm one.
  music: 'coastBattleStorm',
  maxHp: 2300,
  damage: 64,

  difficulty: { density: 1.45, speed: 1.35 },
  // Tall and heavy, it stands with its boots on the bottom of the picture.
  battlePos: { x: 222, y: 40 },

  // Its attacks live in src/battle/attacks/old_diver.js.
  patterns: [
    { name: 'diverHarpoon', weight: 3 },
    { name: 'diverHose', weight: 2 },
    { name: 'diverBubbles', weight: 2 },
    { name: 'diverAnchor', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Knock on the helmet', calm: 40 },
    { name: 'Salute', calm: 35 },
    { name: 'Bow your head', calm: 30 },
  ],

  rewards: { exp: 3000, coins: 15 },

  // Part of its kit it sometimes leaves behind (src/data/items.js), with the chance of it.
  drops: [{ item: 'brass_helmet', chance: 0.4 }],
};
