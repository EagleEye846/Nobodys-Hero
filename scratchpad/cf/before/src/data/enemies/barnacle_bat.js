import { BARNACLE_BAT_PALETTE, BARNACLE_BAT_SPRITE, BARNACLE_BAT_ANIM } from '../art/barnacle_bat.js';

// The BARNACLE BAT's numbers: a little cave bat that has hung over the same
// wet ledge in the cliff cave for so long that the barnacles have moved onto
// it. It drips, it squeaks, it sends its echoes round the dark to see you by.
// One of the cliff cave's two monsters (with the whelkling), met between the
// Sea View and Gullrest, so it's as easy as the gullion and the kelpie foal.
// Everything it says is in text/enemies/barnacle_bat.txt.
export const BARNACLE_BAT = {
  name: 'BARNACLE BAT',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it flies.
  gait: 'fly',
  textFile: 'enemies/barnacle_bat.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'gullrest',
  sprite: { rows: BARNACLE_BAT_SPRITE, palette: BARNACLE_BAT_PALETTE },
  anim: BARNACLE_BAT_ANIM,
  // The coast's fights (Gullrest's version of it in the cliff cave, as before).
  music: 'coastBattleStorm',
  maxHp: 6300,
  damage: 80,

  // The easy end of the chapter: plenty of room.
  difficulty: { density: 1.40, speed: 1.30 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore), and under 40% of its HP it layers a light
  // second attack on top (secondWind). See startAttack in battleScene.js.
  // (2026-11-10: comes in sooner and runs longer, was { at: 0.85, seconds: 4.5 }:
  // its attacks are done throwing a second or so before their end, and the box
  // sat empty until the encore came.)
  encore: { at: 0.72, seconds: 5.3, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
  // It hangs from the roof: the knob of rock it holds is at the top of the stage.
  battlePos: { x: 226, y: 0 },

  // Its attacks live in src/battle/attacks/barnacle_bat.js.
  patterns: [
    { name: 'bbatEcho', weight: 3 },
    { name: 'bbatRoost', weight: 3 },
    { name: 'bbatBarnacles', weight: 3 },
  ],

  // TALK options (the hero's own actions; the hero never speaks). Each name
  // needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Hang your head upside down', calm: 40 },
    { name: 'Keep very quiet', calm: 35 },
    { name: 'Pick off a barnacle', calm: 30 },
  ],

  rewards: { exp: 2000, coins: 9 },

  // A barnacle it wore off a wing (src/data/items.js), with the chance of it.
  drops: [{ item: 'echo_shell', chance: 0.4 }],
};
