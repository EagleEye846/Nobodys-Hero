import { GLEAMSNAIL_PALETTE, GLEAMSNAIL_SPRITE, GLEAMSNAIL_ANIM } from '../art/gleamsnail.js';

// The GLEAMSNAIL's numbers: a slow, proud snail from the Glimmering whose
// shell is a cracked-open geode, crystals and all. It carries its whole house
// on its back, and has never once been late, because wherever it is, it's home.
// It keeps the house very tidy, and it's a little too ready to tell you so.
// Everything it says is in text/enemies/gleamsnail.txt.
export const GLEAMSNAIL = {
  name: 'GLEAMSNAIL',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it oozes.
  gait: 'ooze',
  textFile: 'enemies/gleamsnail.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'glimmer',
  sprite: { rows: GLEAMSNAIL_SPRITE, palette: GLEAMSNAIL_PALETTE },
  // Eyestalks sway and the crystals twinkle, it pulls into its shell (and
  // hangs up a sign) before it rolls, flinches in when hit, shuts the shell
  // for good when it's beaten, and holds its head high when it's spared.
  // See src/data/art/gleamsnail.js.
  anim: GLEAMSNAIL_ANIM,
  // The Chapter 4 battle song, once it's been written.
  music: 'belowBattle',
  maxHp: 1450,
  damage: 37,

  // The Glimmering: a notch up from Sunnyside. Slow things, and lots of lines.
  difficulty: { density: 1.35, speed: 1.3 },

  // Its attacks live in src/battle/attacks/gleamsnail.js.
  patterns: [
    { name: 'snailShards', weight: 3 },
    { name: 'snailSlime', weight: 2 },
    { name: 'snailBeams', weight: 2 },
    { name: 'snailShell', weight: 2 },
    { name: 'snailTidy', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Admire the house', calm: 40 },
    { name: 'Wipe your feet', calm: 35 },
    { name: 'Offer to dust', calm: 30 },
  ],

  rewards: { exp: 740, coins: 20 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'glint_sugar', chance: 0.4 }],
};
