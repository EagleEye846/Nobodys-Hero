import { HAYBOB_PALETTE, HAYBOB_SPRITE, HAYBOB_ANIM } from '../art/haybob.js';

// The HAYBOB's numbers: a round hay bale in a straw hat that got loose from
// its field one morning, found out it could roll, and has not stopped since.
// It's very pleased with itself. A harvest mouse lives in it and has, so far,
// not been consulted. The other cheerful fake-out of Sunnyside: bouncy and
// readable, but still Chapter 4's tier. Everything it says is in
// text/enemies/haybob.txt.
export const HAYBOB = {
  name: 'HAYBOB',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it rolls.
  gait: 'roll',
  textFile: 'enemies/haybob.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'sunnyside',
  sprite: { rows: HAYBOB_SPRITE, palette: HAYBOB_PALETTE },
  // The spiral turns and the mouse peeks out, it squashes down before a roll,
  // the hat flies off when it's hit, it comes undone into a heap of straw
  // when it's beaten, and it tips its hat when it's spared. See
  // src/data/art/haybob.js.
  anim: HAYBOB_ANIM,
  // Sunnyside's own battle song, once it's there.
  music: 'sunnyBattle',
  maxHp: 2800,
  damage: 36,

  // The easy end of the chapter: big bouncy things, not too many.
  difficulty: { density: 1.2, speed: 1.25 },
  // Chapter 5's Sunnyside (`later`, see enemyForChapter in battleScene.js): the
  // same monster, met again at the coast's strength, three or four hits.
  later: { 5: { maxHp: 5900, damage: 54, difficulty: { density: 1.35, speed: 1.35 }, encore: { at: 0.85, seconds: 4.5, density: 0.8 }, secondWind: { below: 0.4, density: 0.3, delay: 1.6 }, drops: [{ item: 'harvest_loaf', chance: 0.4 }] } },

  // Its attacks live in src/battle/attacks/haybob.js.
  patterns: [
    { name: 'hayRoll', weight: 3 },
    { name: 'hayGate', weight: 3 },
    { name: 'hayFork', weight: 2 },
    { name: 'hayHats', weight: 3 },
    { name: 'hayMouse', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Compliment the hat', calm: 40 },
    { name: 'Ask about the mouse', calm: 35 },
    { name: 'Roll along with it', calm: 30 },
  ],

  // In chapter 5 Sunnyside, on the steeper curve, they pay the coast's rate.
  rewards: { exp: 650, coins: 18, laterExp: { 5: 2100 } },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  // (From chapter 5 it leaves a Harvest Loaf instead: see `later`, a late-summer find worth eating at the coast's numbers.)
  drops: [{ item: 'hay_biscuit', chance: 0.4 }],
};
