import { SOOT_GULL_PALETTE, SOOT_GULL_SPRITE, SOOT_GULL_ANIM } from '../art/soot_gull.js';

// The SOOT GULL's numbers: a herring gull gone grey with soot, a long way from
// the sea, and still a thief. Out here what there is to steal is embers, and
// food, if you're carrying any. Its words are in text/enemies/soot_gull.txt.
export const SOOT_GULL = {
  name: 'SOOT GULL',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it hangs in the
  // air over the ash, bobbing, its shadow below.
  gait: 'fly',
  textFile: 'enemies/soot_gull.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'ashroad',
  sprite: { rows: SOOT_GULL_SPRITE, palette: SOOT_GULL_PALETTE },
  anim: SOOT_GULL_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): sooty feathers knocked loose,
  // one now and then drifting off it; its wings go up before it strikes.
  feel: { hit: 'feather', idle: 'feather', windup: 'glint', at: [0.08, 0.32], color: '#8d8781', defeat: 'feathers' },
  music: 'ashBattle',
// (HP by the rule of 13 November 2026: an ordinary monster takes about 4-5 good FIGHTs
  // from the hero at the level it's met, about LV 50 with the Fallen Star +3, a good FIGHT about 850.)
  maxHp: 4200,
  damage: 102,

  difficulty: { density: 1.85, speed: 1.68 },
  encore: { at: 0.72, seconds: 5.3, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
  // It hangs in the air to the right of the box.
  battlePos: { x: 220, y: 42 },

  // Its attacks live in src/battle/attacks/soot_gull.js.
  patterns: [
    { name: 'sootDive', weight: 3 },
    { name: 'sootFans', weight: 3 },
    { name: 'sootEmbers', weight: 3 },
    { name: 'sootShake', weight: 2 },
  ],

  // It really steals (src/battle/steals.js): when a dive or a dropped ember
  // lands on you it snatches some food from the bag. Beat it, spare it, or
  // TALK it round (the options with giveBack) to get it back.
  steals: { on: ['sootDive', 'sootEmbers'], max: 1 },

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Turn out your pockets', calm: 40, giveBack: true },
    { name: 'Point at the sea', calm: 35 },
    { name: 'Brush off its wing', calm: 30, giveBack: true },
  ],

  rewards: { exp: 5900, coins: 17 },

  // A feather of it, gone grey (src/data/items.js), with the chance of it.
  drops: [{ item: 'sooty_quill', chance: 0.4 }],
};
