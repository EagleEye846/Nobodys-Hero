import { PROP_PALETTE, PROP_SPRITES } from '../art/props.js';

// MOTHER TAPER, when she blocks the way out of the Ruins. The Ruins' boss: no
// running away, and a real fight. She's `gentle` (her attacks thin out as her
// MERCY rises, and when you're low on HP), and below a third of her HP she
// adds a light second attack (`secondWind`). She makes an entrance first
// (`introCard`). Everything she says is in text/enemies/taper.txt.
export const TAPER_BOSS = {
  name: 'TAPER',
  textFile: 'enemies/taper.txt',
  sprite: { rows: PROP_SPRITES.taper, palette: PROP_PALETTE },
  // Beaten, she doesn't fade away: she sinks to one knee, and stays there.
  beatenSprite: { rows: PROP_SPRITES.taper_kneel, palette: PROP_PALETTE },
  boss: true,
  gentle: true,
  music: 'taperBattle',
  // Her own battle background: the door out, and her candles (src/battle/backdrops.js).
  backdrop: 'taper_stand',
  maxHp: 320,
  damage: 6,

  difficulty: { density: 1, speed: 1 },

  // Below a third of her HP she adds a second attack on top of the first,
  // two seconds later, at a third of the density.
  secondWind: { below: 0.34, density: 0.35, delay: 2 },

  // Her entrance: a title card before the fight (her lines are [boss_intro]).
  introCard: { title: 'MOTHER TAPER', subtitle: 'Keeper of the Small Flames' },

  // Her attacks live in src/battle/attacks/taper.js.
  patterns: [
    { name: 'taperWaxRain', weight: 3 },
    { name: 'taperFlameWall', weight: 3 },
    { name: 'taperCandleRing', weight: 2 },
    { name: 'taperPetals', weight: 2 },
    { name: 'taperTears', weight: 2 },
  ],

  // TALK options. Sparing her takes patience: keep talking, and when her
  // MERCY is full, cast Pacify. (About ten turns of talking, on purpose.)
  talk: [
    { name: 'Check' },
    { name: 'Ask about the garden', calm: 8 },
    { name: 'Stand your ground', calm: 10 },
    { name: 'Take her hand', calm: 12 },
  ],
  // The Lull spell only soothes her a little: she won't be hushed that easily.
  lullCalm: 10,

  rewards: { exp: 200, coins: 0 },
};
