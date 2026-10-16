import { DUMMY_PALETTE, DUMMY_SPRITE } from '../art/dummy.js';

// The ROGUE DUMMY's numbers. Everything it says is in text/enemies/rogue_dummy.txt.
export const ROGUE_DUMMY = {
  name: 'ROGUE DUMMY',
  textFile: 'enemies/rogue_dummy.txt',
  sprite: { rows: DUMMY_SPRITE, palette: DUMMY_PALETTE },
  maxHp: 120,
  damage: 6,

  // The first enemy you meet, so its attacks are a little gentler: fewer bullets (density)
  // that fly slower (speed). 1 is full strength.
  difficulty: { density: 0.8, speed: 0.85 },

  // Each enemy turn picks one at random (never the same twice in a row).
  // Higher weight = more likely. Its attacks live in src/battle/attacks/dummy.js;
  // every enemy needs at least three. Patterns that change the soul mode (like
  // 'pillars') need `boss: true`.
  patterns: [
    { name: 'pinCushion', weight: 3 },
    { name: 'buttonBounce', weight: 2 },
    { name: 'stitchLine', weight: 2 },
    { name: 'stuffingBurst', weight: 2 },
    { name: 'trainingTargets', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  // `calm` raises the enemy's MERCY meter; at 100% the Pacify spell ends the fight peacefully.
  talk: [
    { name: 'Inspect' },
    { name: 'Chat', calm: 30 },
    { name: 'Praise', calm: 35 },
    { name: 'Hum', calm: 40 },
  ],

  rewards: { exp: 40, coins: 31 },
};
