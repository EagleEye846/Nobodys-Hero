import { GULLION_PALETTE, GULLION_SPRITE, GULLION_ANIM } from '../art/gullion.js';

// The GULLION's numbers: a broad, scruffy herring gull who has decided that
// everything is his, and that you are standing on some of it. He steals,
// he brawls, and he is, underneath it all, very much a bird who has never
// been given a chip. One of the two easiest of Chapter 5's monsters (with
// the kelpie foal), because he is met on Sunnyside's cliffs and at Gullrest
// before the storm. Nothing he takes is ever really gone: it's all in the
// sack, and he gives it back. Everything he says is in
// text/enemies/gullion.txt.
export const GULLION = {
  name: 'GULLION',
  // How it gets about in a room (GAITS in src/overworld/npc.js): a seaside waddle.
  gait: 'waddle',
  textFile: 'enemies/gullion.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'gullrest',
  sprite: { rows: GULLION_SPRITE, palette: GULLION_PALETTE },
  anim: GULLION_ANIM,
  // The coast's fights: the shanty (also on Sunnyside's cliffs, in place of sunnyBattle).
  music: 'coastBattleStorm',
  maxHp: 1850,
  damage: 54,

  // The easy end of the chapter: slow dives, plenty of room.
  difficulty: { density: 1.25, speed: 1.2 },
  // Upright and a little hunched, he stands in close to the box.
  battlePos: { x: 216, y: 44 },

  // His attacks live in src/battle/attacks/gullion.js.
  patterns: [
    { name: 'gullDive', weight: 3 },
    { name: 'gullFeathers', weight: 2 },
    { name: 'gullJunk', weight: 3 },
    { name: 'gullBrawl', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Offer a chip', calm: 40, giveBack: true },
    { name: 'Check your pockets', calm: 35, giveBack: true },
    { name: 'Admire the sack', calm: 30 },
  ],

  // He really steals (src/battle/steals.js): when a dive or a brawl lands, he
  // snatches a bit of food from the bag and keeps it in the sack. Beat him,
  // spare him, or TALK him round (the options with giveBack) and it comes
  // back. Run away and it's gone for good.
  steals: { on: ['gullDive', 'gullBrawl'], max: 1 },

  rewards: { exp: 1900, coins: 12 },

  // A chip he's sometimes too proud to eat (src/data/items.js), with the chance of it.
  drops: [{ item: 'stolen_chip', chance: 0.4 }],
};
