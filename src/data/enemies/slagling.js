import { SLAGLING_PALETTE, SLAGLING_SPRITE, SLAGLING_ANIM } from '../art/slagling.js';

// The SLAGLING's numbers: a lump of slag left over from the old furnaces of
// the Diggings, still hot in the middle, that never really left the vents it
// was poured next to. It warms itself on them. It oozes, spits sparks when it
// is nervous (always), and would like someone to sit with it, but everyone
// who gets close enough burns their trousers and leaves. Slow, heavy and
// sticky: its attacks come slowly and stay about. Everything it says is in
// text/enemies/slagling.txt.
export const SLAGLING = {
  name: 'SLAGLING',
  // How it gets about in a room (GAITS in src/overworld/npc.js): it oozes.
  gait: 'ooze',
  textFile: 'enemies/slagling.txt',
  // Where it belongs until it's placed in a room (the Studio lists it under
  // this area's heading; see tools/order.js). The game itself doesn't use it.
  area: 'diggings',
  sprite: { rows: SLAGLING_SPRITE, palette: SLAGLING_PALETTE },
  // It's wide (40x32), so it stands a little left of the usual spot.
  battlePos: { x: 236, y: 60 },
  // It heaves itself up out of its puddle as the fight starts, glows,
  // breathes, spits, flinches, and goes dull and cold when beaten (or settles
  // happily on its vent, spared). See src/data/art/slagling.js.
  anim: SLAGLING_ANIM,
  // The Chapter 4 battle song, once it's been written.
  music: 'belowBattle',
  maxHp: 2850,
  damage: 40,

  // The Diggings, the first of the deep: heavy, hot and slow, but plenty.
  difficulty: { density: 1.45, speed: 1.35 },

  // Its attacks live in src/battle/attacks/slagling.js.
  patterns: [
    { name: 'slagSpitSparks', weight: 3 },
    { name: 'slagCrust', weight: 3 },
    { name: 'slagOoze', weight: 2 },
    { name: 'slagPour', weight: 2 },
    { name: 'slagHug', weight: 3 },
  ],

  // TALK options. Each name needs a [talk: Name] section in the text file.
  talk: [
    { name: 'Inspect' },
    { name: 'Warm your hands', calm: 40 },
    { name: 'Sit by the vent with it', calm: 35 },
    { name: 'Pat its crust', calm: 30 },
  ],

  rewards: { exp: 845, coins: 23 },

  // Snacks it sometimes leaves behind (src/data/items.js), with the chance of each.
  drops: [{ item: 'cinder_toffee', chance: 0.4 }],
};
