import { WRACKEEL_PALETTE, WRACKEEL_SPRITE, WRACKEEL_ANIM } from '../art/wrackeel.js';

// The WRACKEEL's numbers: a long teal eel that lives in the half-drowned
// lanes and crackles when it's cross, which is always a little. It isn't
// cruel, it's just wired wrong: every time it's startled it zaps whatever is
// nearest. Everything it says is in text/enemies/wrackeel.txt.
export const WRACKEEL = {
  name: 'WRACKEEL',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it darts and freezes.
  gait: 'dash',
  textFile: 'enemies/wrackeel.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'lanes',
  // It slips through shallow water as well as over the ground.
  swims: true,
  sprite: { rows: WRACKEEL_SPRITE, palette: WRACKEEL_PALETTE },
  anim: WRACKEEL_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): crackles when hit, static off it, sparks
  // gathering before it strikes; beaten, a last fizzle and it sinks belly-up.
  feel: { hit: 'zap', idle: 'static', windup: 'charge', at: [0.2, 0.45], defeat: 'fizzle', exit: 'sink' },
  // The coast's fights from the Lanes on: the shanty.
  music: 'coastBattleStorm',
  maxHp: 8100,
  damage: 90,

  difficulty: { density: 1.55, speed: 1.40 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore), and under 40% of its HP it layers a light
  // second attack on top (secondWind). See startAttack in battleScene.js.
  // (2026-11-10: comes in sooner and runs longer, was { at: 0.85, seconds: 4.5 }:
  // its attacks are done throwing a second or so before their end, and the box
  // sat empty until the encore came.)
  encore: { at: 0.72, seconds: 5.3, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
  // Long and low, it lies along the bottom of the picture.
  battlePos: { x: 208, y: 58 },

  // Its attacks live in src/battle/attacks/wrackeel.js.
  patterns: [
    { name: 'eelHoles', weight: 3 },
    { name: 'eelCurrent', weight: 3 },
    { name: 'eelLanes', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Offer a rubber boot', calm: 40 },
    { name: 'Hum a low note', calm: 35 },
    { name: 'Look away politely', calm: 30 },
  ],

  rewards: { exp: 2600, coins: 11 },

  // Skin it sometimes sheds (src/data/items.js), with the chance of it.
  drops: [{ item: 'eel_skin', chance: 0.4 }],
};
