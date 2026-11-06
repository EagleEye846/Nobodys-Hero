import { SANDCASTLE_PALETTE, SANDCASTLE_SPRITE, SANDCASTLE_ANIM } from '../art/sandcastle.js';

// The SANDCASTLE's numbers: a living sandcastle, turned out of a bucket and
// well pleased with itself, with a lolly-stick flag, shells for windows and
// a moat. It only lives on sand, and it is quite sure the tide is not
// coming. It fires pellets of sand from its turrets, sweeps its flag, and
// sends a moat wave along the floor. Everything it says is in
// text/enemies/sandcastle.txt.
export const SANDCASTLE = {
  name: 'SANDCASTLE',
  // How it gets about in a room (GAITS in src/overworld/npc.js): a slow, squashing slump.
  gait: 'ooze',
  textFile: 'enemies/sandcastle.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'gullrest',
  sprite: { rows: SANDCASTLE_SPRITE, palette: SANDCASTLE_PALETTE },
  // Flag waves, grains trickle, the turrets open before an attack, it slumps
  // into a mound when beaten, and the flag stands up when it's spared.
  // See src/data/art/sandcastle.js.
  anim: SANDCASTLE_ANIM,
  // The chapter 5 coast battle song (Gullrest and the Wrack Shore).
  music: 'coastBattleStorm',
  maxHp: 2000,
  damage: 58,

  difficulty: { density: 1.5, speed: 1.4 },
  battlePos: { x: 212, y: 54 },

  // Its attacks live in src/battle/attacks/sandcastle.js.
  patterns: [
    { name: 'castleVolley', weight: 3 },
    { name: 'castleFlag', weight: 3 },
    { name: 'castleMoat', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Admire the towers', calm: 40 },
    { name: 'Pat the walls', calm: 35 },
    { name: 'Mention the tide', calm: 30 },
  ],

  rewards: { exp: 2050, coins: 12 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'pail_and_spade', chance: 0.4 }],
};
