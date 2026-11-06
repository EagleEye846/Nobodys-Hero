import { BLINDFISH_PALETTE, BLINDFISH_SPRITE, BLINDFISH_ANIM } from '../art/blindfish.js';

// The BLINDFISH's numbers: a pale cave fish that has never needed eyes. It
// lives in the black water of the Stillwater and finds everything by the
// ripples it makes, and it hunts anything that moves. It leaps, snaps and
// spreads rings, and everything it throws is aimed at where you WERE, so
// the trick is not to be there. Everything it says is in
// text/enemies/blindfish.txt.
export const BLINDFISH = {
  name: 'BLINDFISH',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it glides.
  gait: 'float',
  // It swims: open water doesn't stop it in a room (see Npc.blockedAt).
  swims: true,
  textFile: 'enemies/blindfish.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'stillwater',
  sprite: { rows: BLINDFISH_SPRITE, palette: BLINDFISH_PALETTE },
  // It's wide, so it stands a little left of the usual spot to stay on screen.
  battlePos: { x: 226, y: 56 },
  // Its battle clips (idle, windup, hurt, death, spared, and an intro as the
  // fight starts): see src/data/art/blindfish.js.
  anim: BLINDFISH_ANIM,
  // The Chapter 4 battle song, once it's been written.
  music: 'belowBattle',
  maxHp: 1380,
  damage: 42,

  // The Stillwater: quick and splashy, and a step up from the Diggings.
  difficulty: { density: 1.5, speed: 1.4 },

  // Its attacks live in src/battle/attacks/blindfish.js.
  patterns: [
    { name: 'fishLeap', weight: 3 },
    { name: 'fishRipples', weight: 3 },
    { name: 'fishSchool', weight: 2 },
    { name: 'fishJaw', weight: 2 },
    { name: 'fishBubbles', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Stay perfectly still', calm: 40 },
    { name: 'Ripple the water', calm: 35 },
    { name: 'Drop a pebble for it', calm: 30 },
  ],

  rewards: { exp: 950, coins: 25 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'smoked_blindfish', chance: 0.4 }],
};
