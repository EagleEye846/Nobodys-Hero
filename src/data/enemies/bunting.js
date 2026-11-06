import { BUNTING_PALETTE, BUNTING_SPRITE, BUNTING_ANIM } from '../art/bunting.js';

// The BUNTING's numbers: a plump little yellow bird who strung up a line of
// party bunting one sunny morning, liked how it looked and has worn it ever
// since. Every day is somebody's birthday, as far as it's concerned, and if
// it isn't, it'll do something about that. Cheerful, silly and fast to
// forgive; the other fake-out of Sunnyside, with a party at the end of every
// attack. Everything it says is in text/enemies/bunting.txt.
export const BUNTING = {
  name: 'BUNTING',
  // How it gets about in a room (GAITS in src/overworld/npc.js).
  gait: 'hop',
  textFile: 'enemies/bunting.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'sunnyside',
  sprite: { rows: BUNTING_SPRITE, palette: BUNTING_PALETTE },
  // It bobs and the flags flutter, puffs up and chirps before it throws (the
  // flags flare), squashes and loses a little fluff when it's hit, flops over
  // with the flags fallen when it's beaten, and hops about in a shower of
  // confetti when it's spared. See src/data/art/bunting.js.
  anim: BUNTING_ANIM,
  // Sunnyside's own battle song.
  music: 'sunnyBattle',
  maxHp: 960,
  damage: 35,

  difficulty: { density: 1.2, speed: 1.25 },

  // Its attacks live in src/battle/attacks/bunting.js.
  patterns: [
    { name: 'buntFlags', weight: 3 },
    { name: 'buntPop', weight: 2 },
    { name: 'buntBalloons', weight: 2 },
    { name: 'buntStreamers', weight: 2 },
    { name: 'buntChirp', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Wish it well', calm: 40 },
    { name: 'Join the party', calm: 35 },
    { name: 'Fix the flags', calm: 30 },
  ],

  rewards: { exp: 670, coins: 18 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'party_ring', chance: 0.4 }],
};
