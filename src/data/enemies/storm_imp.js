import { STORM_IMP_PALETTE, STORM_IMP_SPRITE, STORM_IMP_ANIM } from '../art/storm_imp.js';

// The STORM IMP's numbers: a little thundercloud with a grin, left running
// by a spell that went wrong. It is the storm's idea of being naughty:
// childish, quick, a bit of a show-off, and entirely unaware that its jokes
// hurt. Everything it says is in text/enemies/storm_imp.txt.
export const STORM_IMP = {
  name: 'STORM IMP',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it drifts.
  gait: 'float',
  textFile: 'enemies/storm_imp.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'reach',
  sprite: { rows: STORM_IMP_SPRITE, palette: STORM_IMP_PALETTE },
  anim: STORM_IMP_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): crackles when hit, static all round it,
  // sparks gathering before it strikes; beaten, it rains itself out.
  feel: { hit: 'zap', idle: 'static', windup: 'charge', at: [0.5, 0.45], defeat: 'rainout' },
  // The coast's fights from the Wreck Yard on: the storm one.
  music: 'coastBattleStorm',
  maxHp: 9600,
  damage: 99,

  difficulty: { density: 1.65, speed: 1.50 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore), and under 40% of its HP it layers a light
  // second attack on top (secondWind). See startAttack in battleScene.js.
  // (2026-11-10: comes in sooner and runs longer, was { at: 0.85, seconds: 4.5 }:
  // its attacks are done throwing a second or so before their end, and the box
  // sat empty until the encore came.)
  encore: { at: 0.72, seconds: 5.3, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
  // It hovers up in the air to the right of the box.
  battlePos: { x: 226, y: 34 },

  // Its attacks live in src/battle/attacks/storm_imp.js.
  patterns: [
    { name: 'impRods', weight: 3 },
    { name: 'impThunder', weight: 3 },
    { name: 'impGust', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Play along', calm: 40 },
    { name: 'Hold up an umbrella', calm: 35 },
    { name: 'Do a lighthouse', calm: 30 },
  ],

  rewards: { exp: 3250, coins: 20 },

  // A scrap of it that doesn't blow away (src/data/items.js), with the chance of it.
  drops: [{ item: 'static_puff', chance: 0.4 }],
};
