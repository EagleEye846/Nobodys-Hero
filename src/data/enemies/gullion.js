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
  // How it feels to fight (src/battle/foeFeel.js): feathers fly when it's hit, a glint on the
  // beak before it goes for you; beaten, a burst of feathers.
  feel: { hit: 'feather', windup: 'glint', at: [0.28, 0.3], defeat: 'feathers' },
  // The coast's fights: the shanty (also on Sunnyside's cliffs, in place of sunnyBattle).
  music: 'coastBattleStorm',
  maxHp: 9700,
  damage: 80,

  // The easy end of the chapter: slow dives, plenty of room.
  difficulty: { density: 1.40, speed: 1.30 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore), and under 40% of its HP it layers a light
  // second attack on top (secondWind). See startAttack in battleScene.js.
  // (2026-11-10: comes in sooner and runs longer, was { at: 0.85, seconds: 4.5 }:
  // its attacks are done throwing a second or so before their end, and the box
  // sat empty until the encore came.)
  encore: { at: 0.72, seconds: 5.3, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
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
