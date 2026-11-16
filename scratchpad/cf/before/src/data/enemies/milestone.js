import { MILESTONE_PALETTE, MILESTONE_SPRITE, MILESTONE_ANIM } from '../art/milestone.js';

// The MILESTONE's numbers: an old roadside milestone that has got up and
// walks, counting down the miles to the buried town; the moss on it burnt to
// stubble. It has stood at the side of the road so long it thinks it is the
// road. Its words are in text/enemies/milestone.txt.
export const MILESTONE = {
  name: 'MILESTONE',
  // How it gets about in a room (GAITS in src/overworld/npc.js): heavy shuffles
  // that thud down.
  gait: 'stomp',
  textFile: 'enemies/milestone.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under this area's heading).
  area: 'ashroad',
  sprite: { rows: MILESTONE_SPRITE, palette: MILESTONE_PALETTE },
  anim: MILESTONE_ANIM,
  // How it feels to fight (src/battle/foeFeel.js): a clack off the stone and grit,
  // dust kicked up as it braces; beaten, it clatters over.
  feel: { hit: 'shell', windup: 'dust', defeat: 'clatter', color: '#8a8278' },
  music: 'ashBattle',
// (HP by the rule of 13 November 2026: an ordinary monster takes about 4-5 good FIGHTs
  // from the hero at the level it's met, about LV 50 with the Fallen Star +3, a good FIGHT about 850.)
  maxHp: 4600,
  damage: 106,

  difficulty: { density: 1.9, speed: 1.72 },
  encore: { at: 0.72, seconds: 5.3, density: 0.8 },
  secondWind: { below: 0.4, density: 0.3, delay: 1.6 },
  battlePos: { x: 220, y: 56 },

  // Its attacks live in src/battle/attacks/milestone.js.
  patterns: [
    { name: 'mileCount', weight: 3 },
    { name: 'mileChips', weight: 3 },
    { name: 'mileStones', weight: 3 },
    { name: 'mileSigns', weight: 2 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Trace the number', calm: 40 },
    { name: 'Scrape off the soot', calm: 35 },
    { name: 'Walk the mile with it', calm: 30 },
  ],

  rewards: { exp: 6400, coins: 20 },

  // A chip off its corner, with a bit of a number on it (src/data/items.js), with the chance of it.
  drops: [{ item: 'mile_chip', chance: 0.4 }],
};
