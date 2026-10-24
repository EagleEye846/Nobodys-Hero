import { KNOTLING_PALETTE, KNOTLING_SPRITE, KNOTLING_DISGUISE_SPRITES } from '../art/knotling.js';

// The KNOTLING's numbers: a cross old stump with a face in its knot-hole,
// deep in the Hushwood. It was a great tree once, until the woodcutters came,
// and it has never forgiven anyone for it (least of all Bramble, who has an
// axe and the family nose). Slow and heavy, and it hits like a falling oak.
// Everything it says is in text/enemies/knotling.txt.
export const KNOTLING = {
  name: 'KNOTLING',
  // How it gets about in a room (GAITS in src/overworld/npc.js): heavy steps on its roots.
  gait: 'stomp',
  textFile: 'enemies/knotling.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'pinefall',
  sprite: { rows: KNOTLING_SPRITE, palette: KNOTLING_PALETTE },
  // In a room it can sit among the stumps of a felled wood with its eyes
  // shut (the "In disguise" behaviour in the Room Editor), passing for one
  // more stump. Now and then an eye glares out, or the frown comes back.
  disguise: {
    frames: [KNOTLING_DISGUISE_SPRITES.still, KNOTLING_DISGUISE_SPRITES.glare, KNOTLING_DISGUISE_SPRITES.grumble],
    palette: KNOTLING_PALETTE,
  },
  maxHp: 420,
  damage: 17,

  // A Chapter 3 enemy from the deep wood: a touch tougher than the Burrhog.
  difficulty: { density: 1.25, speed: 1.2 },

  // Its attacks live in src/battle/attacks/knotling.js.
  patterns: [
    { name: 'knotRings', weight: 3 },
    { name: 'knotRoots', weight: 3 },
    { name: 'knotAcorns', weight: 2 },
    { name: 'knotChop', weight: 2 },
    { name: 'knotSap', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  // Counting its rings flatters it, but sitting on it is a stump's idea of
  // the worst thing in the world: `hurt` is the HP the splinters cost you.
  talk: [
    { name: 'Inspect' },
    { name: 'Count its rings', calm: 35 },
    { name: 'Say sorry', calm: 45 },
    { name: 'Sit on it', calm: 20, hurt: 5 },
  ],

  rewards: { exp: 145, coins: 75 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'stump_honey', chance: 0.4 }],
};
