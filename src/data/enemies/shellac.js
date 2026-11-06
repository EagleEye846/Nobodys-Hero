import { SHELLAC_PALETTE, SHELLAC_SPRITE, SHELLAC_ANIM } from '../art/shellac.js';

// The SHELLAC's numbers: a hermit crab that has moved into a teapot and
// will not be moved out. Cream china, blue willow pattern, a lid for a front
// door. It is house-proud, snappish and very sorry about the state of the
// beach. It snaps its big claw in fans, tosses teacups that bounce about,
// spins its whole shell so the china shards fly, and lets off steam.
// Everything it says is in text/enemies/shellac.txt.
export const SHELLAC = {
  name: 'SHELLAC',
  // How it gets about in a room (GAITS in src/overworld/npc.js): a fussy waddle.
  gait: 'waddle',
  textFile: 'enemies/shellac.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'wrack',
  sprite: { rows: SHELLAC_SPRITE, palette: SHELLAC_PALETTE },
  // Claw clacks, steam curls, flinches into the pot, loses its lid when beaten.
  // See src/data/art/shellac.js.
  anim: SHELLAC_ANIM,
  // The chapter 5 coast battle song (the Wrack Shore and Gullrest).
  music: 'coastBattleStorm',
  maxHp: 1950,
  damage: 56,

  difficulty: { density: 1.6, speed: 1.5 },
  battlePos: { x: 218, y: 52 },

  // Its attacks live in src/battle/attacks/shellac.js.
  patterns: [
    { name: 'shellClaws', weight: 3 },
    { name: 'shellCups', weight: 3 },
    { name: 'shellSpin', weight: 2 },
    { name: 'shellSteam', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Wipe your feet', calm: 40 },
    { name: 'Admire the pattern', calm: 35 },
    { name: 'Ask for tea', calm: 30 },
  ],

  rewards: { exp: 2100, coins: 12 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'teapot_shell', chance: 0.4 }],
};
