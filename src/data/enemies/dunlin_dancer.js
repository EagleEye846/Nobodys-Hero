import { DUNLIN_DANCER_PALETTE, DUNLIN_DANCER_SPRITE, DUNLIN_DANCER_ANIM } from '../art/dunlin_dancer.js';

// The DUNLIN DANCER's numbers: five sandpipers that act as one bird. They
// run along the tideline in a ripple, they hop together, and they will not
// be hit one at a time because they are never in one place. They run at you
// in rows, peck down out of the air in diagonals, and drop shells from the
// sky. Everything they say is in text/enemies/dunlin_dancer.txt.
export const DUNLIN_DANCER = {
  name: 'DUNLIN DANCER',
  // How it gets about in a room (GAITS in src/overworld/npc.js): quick little dashes.
  gait: 'dash',
  textFile: 'enemies/dunlin_dancer.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'gullrest',
  sprite: { rows: DUNLIN_DANCER_SPRITE, palette: DUNLIN_DANCER_PALETTE },
  // The flock hops in a wave, spreads its wings before an attack, scatters
  // when hit, takes off when beaten and dances when spared.
  // See src/data/art/dunlin_dancer.js.
  anim: DUNLIN_DANCER_ANIM,
  // The chapter 5 coast battle song (Sunnyside cliffs, Gullrest).
  music: 'coastBattleStorm',
  maxHp: 1900,
  damage: 55,

  difficulty: { density: 1.5, speed: 1.4 },
  battlePos: { x: 214, y: 54 },

  // Its attacks live in src/battle/attacks/dunlin_dancer.js.
  patterns: [
    { name: 'dunWave', weight: 3 },
    { name: 'dunPeck', weight: 3 },
    { name: 'dunShells', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Match their step', calm: 40 },
    { name: 'Stand very still', calm: 35 },
    { name: 'Scatter some crumbs', calm: 30 },
  ],

  rewards: { exp: 2000, coins: 11 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'sandpiper_feather', chance: 0.4 }],
};
