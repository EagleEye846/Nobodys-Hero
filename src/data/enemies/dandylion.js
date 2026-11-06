import { DANDY_LION_PALETTE, DANDY_LION_SPRITE, DANDY_LION_ANIM } from '../art/dandy_lion.js';

// The DANDY LION's numbers: a little lion whose mane is a dandelion clock, a
// great round puff of seeds, and who is extremely vain about it. It lives in
// the sunny fields by the Gate, where nothing has gone wrong for a very long
// time, and it prances about being admired by nobody. Blow on the mane and
// it comes apart, and then it puffs itself back together with a sulk. The
// cheerful fake-out of Chapter 4: pretty, slow and easy to read, but it's
// still the chapter's tier. Everything it says is in text/enemies/dandylion.txt.
export const DANDYLION = {
  name: 'DANDY LION',
  // How it gets about in a room (GAITS in src/overworld/npc.js): a vain,
  // bobbing sort of waddle.
  gait: 'waddle',
  textFile: 'enemies/dandylion.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'sunnyside',
  sprite: { rows: DANDY_LION_SPRITE, palette: DANDY_LION_PALETTE },
  // The mane shivers and sparkles, swells before a roar, blows off when it's
  // hit (and all of it when it's beaten, leaving a bald seed-ball), and puffs
  // up happy when it's spared. See src/data/art/dandy_lion.js.
  anim: DANDY_LION_ANIM,
  // Sunnyside's own battle song, once it's there.
  music: 'sunnyBattle',
  maxHp: 960,
  // A cheerful thing, so a gentle hit, for Chapter 4.
  damage: 36,

  // The easy end of the chapter: slow seeds, plenty of room.
  difficulty: { density: 1.2, speed: 1.25 },

  // Its attacks live in src/battle/attacks/dandy_lion.js.
  patterns: [
    { name: 'dandyBreeze', weight: 3 },
    { name: 'dandyRoar', weight: 2 },
    { name: 'dandyPetals', weight: 2 },
    { name: 'dandyPounce', weight: 2 },
    { name: 'dandyWish', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Admire the mane', calm: 40 },
    { name: 'Make a wish', calm: 35 },
    { name: 'Hold still in the breeze', calm: 30 },
  ],

  rewards: { exp: 650, coins: 18 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'dandelion_tea', chance: 0.4 }],
};
