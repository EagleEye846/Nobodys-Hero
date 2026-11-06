// THE LOOKOUT: the top of the cliff above the lagoon, where the town comes to
// look at the weather. Wind turf, a rail along the sea edge, a telescope, a
// bench, one lamp, and the big chart of the coast on its board: Gullrest, the
// town, the drowned lanes, the wrecks, the little lights, and far out the
// black tower ringed in red. The rope from the lagoon comes up over the edge
// on the south-west (step onto the edge by its anchor to go back down). The
// way on is here twice: a path east to the Sunken Lanes, and a cliff stair
// down to a landing where Haddock waits with the Bother, for the Wreck Yard.
//
// The Lanes: the path east runs out of the room at (35, rows 9-11) into lanes_fork. The
// Wreck Yard: stepping down onto the boarding step by the Bother's post (31..32, row 22) plays
// to_the_wreck_yard (repeatable; the way home from wreck_slip lands at (30, 20)).
//
// Puzzle-free. No monsters (a town).
// Tile key (see src/overworld/coastTiles.js, saltcombe):
//   #  wall top (solid)   ~  the sea (solid)   f  rail (solid)   ,  turf   :  path
//   0  the drop to the lagoon (solid)   K  the cliff's rock face (solid)   .  the landing's planks

export const SALTCOMBE_LOOKOUT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'saltcombe_lookout',
  // The room's name, for the Room Editor.
  name: 'THE LOOKOUT',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'saltcombe',
  // "Salt and Rope", and the wind and rain up on top.
  music: 'saltcombe',
  ambience: 'stilt_town',
  vesWell: true,
  // The black tower on the skyline, over the sea.
  lastLight: { x: 27, y: 4 },
  atmosphere: { rain: 1, lightning: 0.6 },

  tiles: [
    '####################################',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#ffffffffffffffffffffffffffffffffff#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,:::::::::::::::::::::::::::::::::',
    '#,,,,,:,,,,,,,,,,,,,,,,,,,,:,,,,,:::',
    '#,,,,,:,,,,,,,,,,,,,,,,,,,,:,,,,,:::',
    '#,,,,,:,,,,,,,,,,,,,,,,,,,,:,,,,,,,#',
    '#,,,,,:,,,,,,,,,,,,,,,,,,,,:,,,,,,,#',
    '#,,,,,:,,,,,,,,,,,,,,,,,,,,:,,,,,,,#',
    '#,,,,,:,,,,,,,,,,,,,,,,,,,,:,,,,,,,#',
    '#fffff:ffffffffffffffKKKKK:::KKKKKK#',
    '#00000000000000000000KKKKK:::KKKKKK#',
    '#00000000000000000000KKKKK:::KKKKKK#',
    '#00000000000000000000KKKKK:::KKKKKK#',
    '#00000000000000000000..............#',
    '#00000000000000000000..............#',
    '#00000000000000000000~~~~~~~~~~..~~#',
    '####################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 14 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Over the edge by the anchor and back down the rope, to its foot in the lagoon.
    { x: 6, y: 16, w: 1, h: 1, to: 'saltcombe_lagoon', spawn: { x: 29, y: 8 } },
    // East, down the cliff path to the Sunken Lanes.
    { x: 35, y: 9, w: 1, h: 3, to: 'lanes_fork', spawn: { x: 2, y: 8 } },
  ],

  // Down the step at the end of the landing, beside the Bother's post (31..32, row 22): Haddock
  // rows you to the Wreck Yard (from the swimming lesson on; before that he isn't here). The step
  // is off to one side of the stair, so walking the landing's planks never boards by accident.
  // Clear of (30, 20), where the way home lands.
  cutscenes: [{ x: 31, y: 22, w: 2, h: 1, scene: 'to_the_wreck_yard', after: 'swimming_lesson' }],

  // The chart, the telescope, the bench, the lamp, the rope's anchor, the signs,
  // and Haddock with the Bother on the landing.
  textFile: 'interactions/saltcombe.txt',
  props: [
    { sprite: 'sc_coast_map', x: 15, y: 7, text: 'lookout_map', notice: true },
    { sprite: 'telescope', x: 11, y: 6, text: 'lookout_telescope' },
    { sprite: 'bench', x: 20, y: 7, text: 'lookout_bench' },
    { sprite: 'c5_lantern_post_lit', x: 8, y: 7, text: 'lookout_lamp', animation: 'c5_lantern_post_lit', speed: 0.27 },
    { sprite: 'sc_rope_anchor', x: 5, y: 16, text: 'lookout_rope' },
    { sprite: 'c5_rope_coil', x: 7, y: 15, text: 'lookout_rope_coil', walkable: true },
    { sprite: 'sign', x: 25, y: 15, text: 'lookout_stair_sign' },
    { sprite: 'sign', x: 32, y: 8, text: 'lookout_lanes_sign' },
    // The landing: Haddock and the Bother, from the swimming lesson on.
    { sprite: 'cf_haddock', x: 23, y: 20, npc: 'haddock_lookout', animation: 'cf_haddock', speed: 0.5, after: 'swimming_lesson' },
    { sprite: 'cf_bother_moored', x: 26, y: 22, text: 'lookout_bother', animation: 'cf_bother_moored', speed: 0.5, after: 'swimming_lesson' },
    { sprite: 'sign', x: 32, y: 20, text: 'lookout_ferry_sign' },
    { sprite: 'c5_lantern_post_lit', x: 33, y: 20, text: 'lookout_landing_lamp', animation: 'c5_lantern_post_lit', speed: 0.25 },
    { sprite: 'c5_buoys_pile', x: 21, y: 21, text: 'lookout_buoys' },
    { sprite: 'gold_pouch', x: 33, y: 13, text: 'lookout_pouch', gold: 50, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: {
    '~': 'lookout_sea', f: 'lookout_rail', '0': 'lookout_drop', K: 'lookout_cliff', '#': 'lookout_cliff', ',': 'lookout_turf',
  },

  // None: a town.
  npcs: [
  ],
};
