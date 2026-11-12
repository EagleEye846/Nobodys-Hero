import { DECKHAND_PALETTE, GHOST_DECKHAND_SPRITE, GHOST_DECKHAND_ANIM } from '../art/ghost_crew.js';

// The DECKHAND: one of the Fair Return's crew, a boy of sixteen in a striped
// jersey and a knitted cap, still on watch a hundred years after the ship went
// down. He does his chores, a little too hard: he swabs the deck (a band of wet
// rag sweeps the box, with a clean gap), empties the bilge bucket (it lands in a
// splash of drops), strikes the ship's bell for the watch (rings with a gap in
// them), and holds out a letter he never posted (a curtain of sealed letters
// drifting down, the wax seals dropping hard). He means no harm. He asks, if you
// talk to him, what day it is. Everything he says is in text/enemies/ghost_deckhand.txt.
// (All its lines are drafts for the designer.)
export const GHOST_DECKHAND = {
  name: 'DECKHAND',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it drifts, and flickers.
  gait: 'float',
  // Whether it moves through water (a ghost, it crosses water as well as land).
  swims: true,
  textFile: 'enemies/ghost_deckhand.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'ghostship',
  sprite: { rows: GHOST_DECKHAND_SPRITE, palette: DECKHAND_PALETTE },
  // He sways, hums, swings the swab before an attack, sets the letter down when
  // beaten and hands it to you when spared. See src/data/art/ghost_crew.js.
  anim: GHOST_DECKHAND_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): it frays when hit and gives off pale wisps;
  // beaten, its light goes up and it drifts away.
  feel: { hit: 'ghost', idle: 'wisps', defeat: 'ghost', exit: 'float' },
  // "Still on Watch" (src/data/music/ghostCrewBattleTheme.js): the fight song for the crew's two
  // boys, small and lonely, on the ship's shanty. (It used to be the storm fight song.)
  music: 'ghostCrewBattle',
  maxHp: 12400,
  damage: 97,

  difficulty: { density: 1.8, speed: 1.62 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore), and under 40% of its HP it layers a light
  // second attack on top (secondWind). See startAttack in battleScene.js.
  encore: { at: 0.85, seconds: 4.5, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
  battlePos: { x: 216, y: 40 },

  // His attacks live in src/battle/attacks/ghost_deckhand.js.
  patterns: [
    { name: 'deckSwab', weight: 3 },
    { name: 'deckBucket', weight: 3 },
    { name: 'deckBell', weight: 3 },
    { name: 'deckLetters', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Ask the day', calm: 35 },
    { name: 'Take the letter', calm: 40 },
    { name: 'Hum along', calm: 30 },
  ],

  rewards: { exp: 3100, coins: 17 },

  // A hundred-year-old ship's biscuit with a name scratched in it, left behind (src/data/items.js).
  drops: [{ item: 'scratched_hardtack', chance: 0.4 }],
};
