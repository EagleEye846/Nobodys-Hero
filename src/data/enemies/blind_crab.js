import { BLIND_CRAB_PALETTE, BLIND_CRAB_SPRITE, BLIND_CRAB_ANIM, BLIND_CRAB_DISGUISE } from '../art/blind_crab.js';

// The BLIND GROTTO CRAB's numbers: a huge, peeled-egg-white crab from a cave
// so deep that eyes never paid for themselves. It has feelers instead, a
// great fan of them, and it reads the dark with them the way you'd read a
// page. In a room it sits still as a big white shell until you walk close.
// Everything it says is in text/enemies/blind_crab.txt.
export const BLIND_CRAB = {
  name: 'BLIND GROTTO CRAB',
  // How it gets about in a room (GAITS in src/overworld/npc.js): slow, heavy shuffles.
  gait: 'stomp',
  textFile: 'enemies/blind_crab.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'soundings',
  sprite: { rows: BLIND_CRAB_SPRITE, palette: BLIND_CRAB_PALETTE },
  anim: BLIND_CRAB_ANIM,
  // What it looks like in a room while it's pretending: a big pale shell on the cave floor
  // (hideouts.js `white_shell`). Frame 0 is how it sits; the others are a feeler twitching.
  disguise: { frames: BLIND_CRAB_DISGUISE, palette: BLIND_CRAB_PALETTE },
  // How it feels to fight (src/battle/foeFeel.js): a hard clack when hit, drips off its shell, grit
  // knocked off the ceiling as it winds up; beaten, it clatters apart and sinks.
  feel: { hit: 'shell', idle: 'drip', windup: 'dust', at: [0.3, 0.2], defeat: 'clatter', exit: 'sink' },
  // The coast's fights from the Lanes on: the shanty (the storm song in the Soundings).
  music: 'coastBattleStorm',
  maxHp: 8400,
  damage: 90,

  difficulty: { density: 1.5, speed: 1.35 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore), and under 40% of its HP it layers a light
  // second attack on top (secondWind). See startAttack in battleScene.js.
  encore: { at: 0.72, seconds: 5.3, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
  // Wide and low, it squats along the bottom of the picture.
  battlePos: { x: 190, y: 50 },

  // Its attacks live in src/battle/attacks/blind_crab.js.
  patterns: [
    { name: 'crabFeelers', weight: 3 },
    { name: 'crabSpit', weight: 3 },
    { name: 'crabKnock', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Stand perfectly still', calm: 40 },
    { name: 'Tap a slow rhythm', calm: 35 },
    { name: 'Offer your hand, palm up', calm: 30 },
  ],

  rewards: { exp: 2700, coins: 11 },

  // A pearl it sometimes spits out, cold and pale (src/data/items.js), with the chance of it.
  drops: [{ item: 'ghost_pearl', chance: 0.4 }],
};
