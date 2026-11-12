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
  maxHp: 1220,
  damage: 35,

  difficulty: { density: 1.2, speed: 1.25 },
  // Chapter 5's Sunnyside (`later`, see enemyForChapter in battleScene.js): the
  // same monster, met again at the coast's strength, a fight of several rounds.
  later: { 5: { maxHp: 8500, damage: 53, difficulty: { density: 1.35, speed: 1.35 }, encore: { at: 0.85, seconds: 4.5, density: 0.8 }, secondWind: { below: 0.4, density: 0.3, delay: 1.6 }, drops: [{ item: 'fete_sponge', chance: 0.4 }] } },

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

  // In chapter 5 Sunnyside, on the steeper curve, they pay the coast's rate.
  rewards: { exp: 670, coins: 18, laterExp: { 5: 2100 } },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  // (From chapter 5 it leaves a Fete Sponge instead: see `later`, a late-summer find worth eating at the coast's numbers.)
  drops: [{ item: 'party_ring', chance: 0.4 }],
};
