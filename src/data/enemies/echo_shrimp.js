import { ECHO_SHRIMP_PALETTE, ECHO_SHRIMP_SPRITE, ECHO_SHRIMP_ANIM } from '../art/echo_shrimp.js';

// The ECHO BAT-SHRIMP's numbers: a pale, eyeless cave shrimp with a bat's
// great ears. It has never seen anything. It sees by clicking, and what
// comes back is its whole idea of the world, so it clicks a lot, and clicks
// again at whatever answers. Out in a room it drifts toward any noise (a
// lever pulled, a bell rung, a wheel turned: src/overworld/monsterHabits.js).
// Everything it says is in text/enemies/echo_shrimp.txt.
export const ECHO_SHRIMP = {
  name: 'ECHO BAT-SHRIMP',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it darts and freezes, listening.
  gait: 'dash',
  textFile: 'enemies/echo_shrimp.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'soundings',
  // The Soundings' pools are its home: it crosses water as well as ground.
  swims: true,
  // On the map it goes to look when the room makes a noise: put `hears: true` on its room entry
  // (src/overworld/monsterHabits.js).
  sprite: { rows: ECHO_SHRIMP_SPRITE, palette: ECHO_SHRIMP_PALETTE },
  anim: ECHO_SHRIMP_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): bits of shell fly off it; a glint at its chin
  // as it clicks; bubbles drift off it; beaten, it comes apart in bubbles and sinks.
  feel: { hit: 'shell', idle: 'bubbles', windup: 'glint', at: [0.18, 0.62], color: '#8ff6ff', defeat: 'bubbles', exit: 'sink' },
  // The coast's fights from the Lanes on: the storm song (swapped per area in battleScene.js).
  music: 'coastBattleStorm',
  maxHp: 7600,
  damage: 88,

  difficulty: { density: 1.5, speed: 1.4 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore), and under 40% of its HP it layers a light
  // second attack on top (secondWind). See startAttack in battleScene.js.
  encore: { at: 0.72, seconds: 5.3, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
  // It curls up on the left of the picture's right half, a little off the floor.
  battlePos: { x: 210, y: 44 },

  // Its attacks live in src/battle/attacks/echo_shrimp.js.
  patterns: [
    { name: 'shrimpRings', weight: 3 },
    { name: 'shrimpEcho', weight: 3 },
    { name: 'shrimpClicks', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Click back, softly', calm: 40 },
    { name: 'Stand perfectly still', calm: 35 },
    { name: 'Whisper into the dark', calm: 30 },
  ],

  rewards: { exp: 2500, coins: 11 },

  // A shell it sometimes sheds (src/data/items.js), with the chance of it.
  drops: [{ item: 'echo_shrimp_shell', chance: 0.4 }],
};
