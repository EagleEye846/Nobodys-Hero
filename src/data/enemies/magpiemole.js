import { MAGPIE_MOLE_PALETTE, MAGPIE_MOLE_SPRITE, MAGPIE_MOLE_ANIM } from '../art/magpiemole.js';

// The MAGPIE MOLE's numbers: a stout mole with a magpie's white waistcoat, a
// glossy blue-green tail and a burlap sack on its back, stuffed with
// everything shiny it has ever found. It does not steal. Everything it has
// is lost property, and it runs the office. It will hand your things back
// the moment you can describe them. Everything it says is in
// text/enemies/magpiemole.txt.
export const MAGPIEMOLE = {
  name: 'MAGPIE MOLE',
  // How it gets about in a room (GAITS in src/overworld/npc.js).
  gait: 'waddle',
  textFile: 'enemies/magpiemole.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'diggings',
  sprite: { rows: MAGPIE_MOLE_SPRITE, palette: MAGPIE_MOLE_PALETTE },
  // The glints in the sack wink; it hefts the sack and grins before it throws;
  // it flinches (and the sack jingles) when it's hit; slumps over its sack when
  // it's beaten; and holds its snout high when it's spared. See
  // src/data/art/magpiemole.js.
  anim: MAGPIE_MOLE_ANIM,
  // The Chapter 4 battle song.
  music: 'belowBattle',
  maxHp: 1260,
  damage: 40,

  difficulty: { density: 1.45, speed: 1.35 },

  // Its attacks live in src/battle/attacks/magpiemole.js.
  patterns: [
    { name: 'moleToss', weight: 3 },
    { name: 'moleHills', weight: 2 },
    { name: 'moleSwing', weight: 2 },
    { name: 'moleClods', weight: 2 },
    { name: 'moleFeathers', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Describe a lost thing', calm: 40 },
    { name: 'Hand over a button', calm: 35 },
    { name: 'Fill in a form', calm: 30 },
  ],

  rewards: { exp: 865, coins: 24 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'molehill_muffin', chance: 0.4 }],
};
