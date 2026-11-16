import { PLUMB_LEAD_PALETTE, PLUMB_LEAD_SPRITE, PLUMB_LEAD_ANIM, PLUMB_LEAD_DISGUISE_SPRITES } from '../art/plumb_lead.js';

// The PLUMB LEAD's numbers: a sounder's lead weight on a frayed line, one of
// the Harbour Board's, that has woken up and gone on measuring. It drops
// itself on its line and counts the fathoms out loud, and what it counts is
// always wrong by a little, and it knows it. Out in a room it lies coiled on
// the floor like a heap of old line until you come close (the 'disguise'
// behaviour). Everything it says is in text/enemies/plumb_lead.txt.
export const PLUMB_LEAD = {
  name: 'PLUMB LEAD',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it swings.
  gait: 'swing',
  textFile: 'enemies/plumb_lead.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'soundings',
  sprite: { rows: PLUMB_LEAD_SPRITE, palette: PLUMB_LEAD_PALETTE },
  // What it looks like on the floor while it waits: a coil of line with a lead in it. The first
  // frame stands; the others flash by now and then and give it away.
  disguise: {
    frames: [PLUMB_LEAD_DISGUISE_SPRITES.still, PLUMB_LEAD_DISGUISE_SPRITES.tell, PLUMB_LEAD_DISGUISE_SPRITES.blink],
    palette: PLUMB_LEAD_PALETTE,
  },
  anim: PLUMB_LEAD_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): a clang and brass flecks when hit; dust as it
  // winds up; drips off the line; beaten, it clangs and sinks.
  feel: { hit: 'brass', idle: 'drip', windup: 'dust', at: [0.5, 0.2], color: '#a4c0d8', defeat: 'clang', exit: 'sink' },
  music: 'coastBattleStorm',
  maxHp: 8400,
  damage: 93,

  difficulty: { density: 1.5, speed: 1.35 },
  // Fought alone, its turns run long: as one attack winds down another of
  // its attacks follows (encore), and under 40% of its HP it layers a light
  // second attack on top (secondWind). See startAttack in battleScene.js.
  encore: { at: 0.72, seconds: 5.3, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
  // It hangs from the top of the picture, off the right of the box.
  battlePos: { x: 214, y: 24 },

  // Its attacks live in src/battle/attacks/plumb_lead.js.
  patterns: [
    { name: 'leadSwing', weight: 3 },
    { name: 'leadTags', weight: 3 },
    { name: 'leadDrag', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Call out a depth', calm: 40 },
    { name: 'Hold the line taut', calm: 35 },
    { name: 'Tie off the loose end', calm: 30 },
  ],

  rewards: { exp: 2700, coins: 12 },

  // A knot it sometimes lets go of (src/data/items.js), with the chance of it.
  drops: [{ item: 'fathom_knot', chance: 0.4 }],
};
