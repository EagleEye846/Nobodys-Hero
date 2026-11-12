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
  // How it feels to fight (src/battle/foeFeel.js): china shards when it's hit, a glint on the
  // claw before it snaps; beaten, the china smashes and, once it's flipped itself back over, it
  // scuttles off pot and all.
  feel: { hit: 'china', windup: 'glint', at: [0.1, 0.42], defeat: 'shards', exit: 'scuttle' },
  // The chapter 5 coast battle song (the Wrack Shore and Gullrest).
  music: 'coastBattleStorm',
  maxHp: 10200,
  damage: 84,

  difficulty: { density: 1.75, speed: 1.60 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore), and under 40% of its HP it layers a light
  // second attack on top (secondWind). See startAttack in battleScene.js.
  encore: { at: 0.85, seconds: 4.5, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
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
    { name: 'Mime a cup of tea', calm: 30 },
  ],

  rewards: { exp: 2100, coins: 12 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'teapot_shell', chance: 0.4 }],
};
