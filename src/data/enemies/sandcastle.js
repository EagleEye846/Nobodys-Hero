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
  // How it feels to fight (src/battle/foeFeel.js): sand puffs when hit and trickles off it;
  // beaten, it slumps in a cloud of sand.
  feel: { hit: 'sand', idle: 'sand', windup: 'dust', defeat: 'sand' },
  // The chapter 5 coast battle song (Gullrest and the Wrack Shore).
  music: 'coastBattleStorm',
  maxHp: 6300,
  damage: 86,

  difficulty: { density: 1.65, speed: 1.50 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore, see startAttack in battleScene.js). No
  // secondWind: two of its attacks at once were too much to read.
  encore: { at: 0.85, seconds: 4.5, density: 0.8 },
  battlePos: { x: 212, y: 54 },

  // Its attacks live in src/battle/attacks/sandcastle.js.
  patterns: [
    { name: 'castleTowers', weight: 3 },
    { name: 'castleGarrison', weight: 3 },
    { name: 'castleMoat', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Admire the towers', calm: 40 },
    { name: 'Pat the walls', calm: 35 },
    { name: 'Point at the sea', calm: 30 },
  ],

  rewards: { exp: 2050, coins: 10 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'pail_and_spade', chance: 0.4 }],
};
