import { FIDDLER_PALETTE, FIDDLER_SPRITE, FIDDLER_ANIM } from '../art/fiddler.js';

// The FIDDLER's numbers: a long, pale, eyeless cave cricket that plays its
// own wings with its back leg, very well, to nobody. It has no eyes and has
// never needed them: it finds everything by sound, and is a little hurt
// that you don't. It plays what it hears of you back at you. Everything it
// says is in text/enemies/fiddler.txt.
export const FIDDLER = {
  name: 'FIDDLER',
  // How it gets about in a room (GAITS in src/overworld/npc.js).
  gait: 'bound',
  textFile: 'enemies/fiddler.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'stillwater',
  sprite: { rows: FIDDLER_SPRITE, palette: FIDDLER_PALETTE },
  // The antennae curl; it draws its back leg across its wing like a bow
  // (and the notes show) before it plays; it winces when it's hit; lies down
  // with its legs folded when it's beaten; and plays happily when it's spared.
  // See src/data/art/fiddler.js.
  anim: FIDDLER_ANIM,
  // The Chapter 4 battle song.
  music: 'belowBattle',
  maxHp: 1440,
  damage: 43,

  difficulty: { density: 1.5, speed: 1.4 },
  // It stands a little back and low, and it's long.
  battlePos: { x: 218, y: 54 },

  // Its attacks live in src/battle/attacks/fiddler.js.
  patterns: [
    { name: 'fidScale', weight: 3 },
    { name: 'fidStrum', weight: 2 },
    { name: 'fidLeap', weight: 2 },
    { name: 'fidFeelers', weight: 2 },
    { name: 'fidEcho', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Applaud', calm: 40 },
    { name: 'Hum along', calm: 35 },
    { name: 'Keep very quiet', calm: 30 },
  ],

  rewards: { exp: 985, coins: 26 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'rosin_toffee', chance: 0.4 }],
};
