import { MOONJELLY_PALETTE, MOONJELLY_SPRITE, MOONJELLY_ANIM } from '../art/moonjelly.js';

// The MOONJELLY's numbers: a big, soft jellyfish the blue-white of moonlight
// that drifts about the tidepools and the sea caves as if it had all night
// (it has). It isn't angry. It just trails its tendrils wherever it goes, and
// it pulses, and it lets go a drift of tiny bells. Everything it says is in
// text/enemies/moonjelly.txt.
export const MOONJELLY = {
  name: 'MOONJELLY',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it drifts.
  gait: 'float',
  // Whether it moves through water (it drifts over water as well as land).
  swims: true,
  textFile: 'enemies/moonjelly.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'wrack',
  sprite: { rows: MOONJELLY_SPRITE, palette: MOONJELLY_PALETTE },
  // The bell breathes, the tendrils sway, it squeezes before it attacks,
  // sinks and goes out when beaten, and glows when it's spared.
  // See src/data/art/moonjelly.js.
  anim: MOONJELLY_ANIM,
  // The chapter 5 coast battle song (the Wrack Shore and Gullrest).
  music: 'coastBattleStorm',
  maxHp: 2000,
  damage: 58,

  difficulty: { density: 1.5, speed: 1.4 },
  battlePos: { x: 214, y: 46 },

  // Its attacks live in src/battle/attacks/moonjelly.js.
  patterns: [
    { name: 'jelLash', weight: 3 },
    { name: 'jelPulse', weight: 3 },
    { name: 'jelBells', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Hold your breath', calm: 40 },
    { name: 'Lower the lantern', calm: 35 },
    { name: 'Drift along', calm: 30 },
  ],

  rewards: { exp: 2350, coins: 13 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'jelly_bell', chance: 0.4 }],
};
