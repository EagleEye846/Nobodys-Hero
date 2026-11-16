import { ASHLING_PALETTE, ASHLING_SPRITE, ASHLING_ANIM } from '../art/ashling.js';

// The ASHLING's numbers: a little figure of packed ash with two ember eyes,
// like a snowman nobody built, out on the Ash Road. It crumbles a bit every
// time it moves and pats itself back together. It isn't wicked: it is what
// the fire left, trying to be somebody. Its words are in text/enemies/ashling.txt.
export const ASHLING = {
  name: 'ASHLING',
  // How it gets about in a room (GAITS in src/overworld/npc.js): slow, squashing
  // and stretching like a heap of snow (a heap of ash).
  gait: 'ooze',
  textFile: 'enemies/ashling.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'ashroad',
  sprite: { rows: ASHLING_SPRITE, palette: ASHLING_PALETTE },
  anim: ASHLING_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): ash puffs off it when it's hit,
  // embers lift off it while it stands there, its eyes flare before it throws;
  // beaten, it slumps into a heap.
  feel: { hit: 'ash', idle: 'embers', windup: 'charge', at: [0.5, 0.36], color: '#ff8c1a', defeat: 'ashfall' },
  // The Ash Road's fight song (when that song isn't in the game yet, a stand-in plays).
  music: 'ashBattle',
  // Chapter 6 opens at about LV 48-50: a regular here is three or four rounds
  // of good play (tools/ttkCheck.html), a bit tougher than the coast's last ones.
// (HP by the rule of 13 November 2026: an ordinary monster takes about 4-5 good FIGHTs
  // from the hero at the level it's met, about LV 50 with the Fallen Star +3, a good FIGHT about 850.)
  maxHp: 4000,
  damage: 100,

  difficulty: { density: 1.85, speed: 1.66 },
  // Fought alone, its turns run long (encore), and under 40% of its HP it layers
  // a light second attack on top (secondWind). See startAttack in battleScene.js.
  encore: { at: 0.72, seconds: 5.3, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
  battlePos: { x: 222, y: 60 },

  // Its attacks live in src/battle/attacks/ashling.js.
  patterns: [
    { name: 'ashlFlurry', weight: 3 },
    { name: 'ashlBalls', weight: 3 },
    { name: 'ashlCrumble', weight: 2 },
    { name: 'ashlEyes', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Pat it into shape', calm: 40 },
    { name: 'Give it a hat', calm: 35 },
    { name: 'Stand very still', calm: 30 },
  ],

  rewards: { exp: 5600, coins: 14 },

  // A button pressed into its front, the way you'd give a snowman buttons (src/data/items.js).
  drops: [{ item: 'ash_button', chance: 0.4 }],
};
