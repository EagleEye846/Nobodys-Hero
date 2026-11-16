import { TIDEWIGHT_PALETTE, TIDEWIGHT_SPRITE, TIDEWIGHT_ANIM } from '../art/tidewight.js';

// The TIDEWIGHT's numbers: a shape of black water out of the deepest of the
// Soundings' sounding wells, with a head and shoulders and two arms that hang a
// little too far. It stands up as tall as the tide has risen, and goes back
// down into its pool when the tide goes out. In the water behind its ribs
// hang the old sounders' work lamps, still lit. It isn't cruel; it is only the
// water remembering that somebody used to come down every day to measure it.
// Out in a room it only rises at high tide (`tide: 'high'` on the room's enemy,
// src/overworld/monsterHabits.js) and sinks out of reach at low tide.
// Everything it says is in text/enemies/tidewight.txt.
export const TIDEWIGHT = {
  name: 'TIDEWIGHT',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it drifts.
  gait: 'float',
  textFile: 'enemies/tidewight.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'soundings',
  // It lives in the wells and pools, and slips through any water.
  swims: true,
  sprite: { rows: TIDEWIGHT_SPRITE, palette: TIDEWIGHT_PALETTE },
  anim: TIDEWIGHT_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): dark water flies off it when it's hit, bubbles
  // rise inside it, a glint as it winds up; beaten, it sinks back into the well.
  feel: { hit: 'splash', idle: 'bubbles', windup: 'glint', at: [0.5, 0.4], defeat: 'splash', exit: 'sink', color: '#2e6a8c' },
  // The coast's fights from the Lanes on: the shanty (the storm song in the Soundings).
  music: 'coastBattleStorm',
  maxHp: 8800,
  damage: 94,

  difficulty: { density: 1.55, speed: 1.4 },
  // (See startAttack in battleScene.js.)
  encore: { at: 0.72, seconds: 5.3, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
  // Tall, standing out of the water: its pool sits at the bottom of the picture.
  battlePos: { x: 204, y: 34 },

  // Its attacks live in src/battle/attacks/tidewight.js.
  patterns: [
    { name: 'tideRise', weight: 3 },
    { name: 'tideDrains', weight: 3 },
    { name: 'tideLamps', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Call out a depth', calm: 40 },
    { name: 'Lower a lamp on a line', calm: 35 },
    { name: 'Sit by the edge', calm: 30 },
  ],

  rewards: { exp: 2800, coins: 12 },

  // A phial of its water (src/data/items.js), with the chance of it.
  drops: [{ item: 'black_brine', chance: 0.4 }],
};
