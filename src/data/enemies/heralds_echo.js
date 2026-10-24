import { HERALDS_ECHO_PALETTE, HERALDS_ECHO_SPRITE } from '../art/heralds_echo.js';

// The HERALD'S ECHO's numbers: the ghost of one of the old city's town
// criers (a marmot, like the heralds of Heralds' Rest), still walking the
// empty streets with its bell and its scroll, crying that the Hero is
// coming, the Hero is nearly here, any day now, hear ye. It has been crying
// it for hundreds of years. It fights with what it has: WORDS (the letters
// of its proclamation, flying at you), the ring of its bell, and its scroll.
// Loud, proud, and a little bit hoarse. Everything it says is in
// text/enemies/heralds_echo.txt.
export const HERALDS_ECHO = {
  name: "HERALD'S ECHO",
  // How it gets about in a room (GAITS in src/overworld/npc.js): it drifts.
  gait: 'float',
  textFile: 'enemies/heralds_echo.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'valley',
  sprite: { rows: HERALDS_ECHO_SPRITE, palette: HERALDS_ECHO_PALETTE },
  maxHp: 680,
  damage: 24,

  // Lots of words, at a good clip.
  difficulty: { density: 1.4, speed: 1.3 },

  // Its attacks live in src/battle/attacks/heralds_echo.js. The letters
  // spell out real words (see WORDS there).
  patterns: [
    { name: 'heraldHearYe', weight: 3 },
    { name: 'heraldBell', weight: 3 },
    { name: 'heraldScroll', weight: 2 },
    { name: 'heraldProclaim', weight: 2 },
    { name: 'heraldEcho', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Listen to the news', calm: 40 },
    { name: 'Applaud', calm: 35 },
    { name: 'Ring its bell for it', calm: 30 },
  ],

  // The hardest of the Dead City's regulars, so it pays the best.
  rewards: { exp: 260, coins: 120 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'welcome_cake', chance: 0.4 }],
};
