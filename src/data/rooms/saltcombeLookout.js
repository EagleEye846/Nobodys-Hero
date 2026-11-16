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

import { lookoutFloodProps } from '../floodStages.js';

export const SALTCOMBE_LOOKOUT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'saltcombe_lookout',
  // The room's name, for the Room Editor.
  name: 'THE LOOKOUT',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'saltcombe',
  // "Salt and Rope", and the wind and rain up on top.
  music: 'saltcombe',
  // After chapter 5 (the_light_answers) the town is quiet: "What the Tide Left".
  musicAfter: { scene: 'the_light_answers', song: 'saltcombeAfter' },
  ambience: 'stilt_town',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_stilt_town', lamplight: { shade: 0.22, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,
  // Before the Fair Return is found: her crew's song off the water now and then, or her lantern far out (farShip.js).
  farShip: { sing: true, light: { x: 20, y: 1 } },
  // The black tower on the skyline, over the sea.
  lastLight: { x: 27, y: 4, scale: 1.1 },
  atmosphere: { rain: 1, lightning: 0.6 },

  tiles: [
    '####################################',
    '#~~~~~~~~~~~~~~~~x~~~~~~~~~~~~~~~~~#',
    '#~~~^~~~~~~~~~~~~~~~~~~~~~~~~~~x~~~#',
    '#~~~~x~~xx~~~~~~~~x~~~~~^~~~x~~~~~~#',
    '#~~~~~~x,,x~~~~~~x,,x~~~~xfffx~~~~~#',
    '#fffxfffffffxOff,,,,,,xffx,,,xOffff#',
    '#Ox,,,,,,,,,,,,xffffffx,,,,,,,,,,,xO',
    '#x,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,x#',
    '#,,,,,,,,:::::,,,,,,,,,,,,,,,,::,,,#',
    '#,,::::::,,,,::::::,,,:::::::,::::::',
    '#,,,,,:,,,,,,,,,,,:::::,,,,:,,,,,:::',
    '#,,,,,:,,,,,,,,,,,,,,,,,,,:,,,,,,:::',
    '#,,,,,,:,,,,,,,,,,,,,,,,,,:,,,,,,,,#',
    '#,,,,,,:,,,,,,,,,,,,,,,,,,::,,,,,,,#',
    '#,,,,,:,,,,,,,,,,,,,,,,,,,,:,,,,,,,#',
    '#x,,,,:,,,,,,,,,,,,,,,,,,,,:,,,,,,O#',
    '#fxfff:,,,,,,,OxfffffxKKKK:::KKKKKx#',
    '#00x000xffffffx000x00KKKKK:::KKKKKK#',
    '#0000000x0000000000000KKKK:::KKKKKK#',
    '#0000000000000000000000KxK:::KxKKKx#',
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
    // The Lanes wait for the Wreck Yard (the star shard, Haddock's run out there): until the ride
    // home (wreck_slip_home) the path east turns you back, Haddock waving from the landing. A save
    // already in the Lanes goes through.
    { x: 35, y: 9, w: 1, h: 3, to: 'lanes_fork', spawn: { x: 2, y: 8 }, after: ['wreck_slip_home', 'lanes_lantern'], notYet: 'lookout_lanes_not_yet' },
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
    { sprite: 'cf_haddock', x: 23, y: 20, npc: 'haddock_lookout', animation: 'cf_haddock', speed: 0.5, after: 'swimming_lesson', until: 'haddock_gone' },
    { sprite: 'cf_bother_moored', x: 26, y: 22, text: 'lookout_bother', animation: 'cf_bother_moored', speed: 0.5, after: 'swimming_lesson', until: 'haddock_gone' },
    // After the chapter: the same boat, Ves's to row now.
    { sprite: 'cf_bother_moored', x: 26, y: 22, text: 'lookout_bother_after', animation: 'cf_bother_moored', speed: 0.5, after: 'haddock_gone' },
    { sprite: 'sign', x: 32, y: 20, text: 'lookout_ferry_sign' },
    { sprite: 'c5_lantern_post_lit', x: 33, y: 20, text: 'lookout_landing_lamp', animation: 'c5_lantern_post_lit', speed: 0.25 },
    { sprite: 'c5_buoys_pile', x: 21, y: 21, text: 'lookout_buoys' },
    // The weather's own instrument, and tufts flattened by the wind.
    { sprite: 'sy_windsock', x: 30, y: 13, text: 'lookout_windsock', animation: 'sy_windsock', speed: 0.22 },
    { sprite: 'sy_dune_grass', x: 3, y: 13, text: 'lookout_turf', animation: 'sy_dune_grass', speed: 0.4, walkable: true },
    { sprite: 'sy_dune_grass', x: 13, y: 12, text: 'lookout_turf', animation: 'sy_dune_grass', speed: 0.36, walkable: true },
    { sprite: 'sy_dune_grass', x: 22, y: 14, text: 'lookout_turf', animation: 'sy_dune_grass', speed: 0.44, walkable: true },
    { sprite: 'sy_dune_grass', x: 29, y: 7, text: 'lookout_turf', animation: 'sy_dune_grass', speed: 0.4, walkable: true },
    { sprite: 'bench', x: 16, y: 13, text: 'lookout_bench' },
    // Second pass: the headland itself. Rock coming up through the turf with sea pinks round it,
    // gorse combed flat by the wind, a length of rail the wind took off and threw inland, flat
    // stones worn into the turf round the bench, and gulls sitting the weather out. All off the
    // paths, the rope's edge and the stair.
    { sprite: 'sc_rocks', x: 3, y: 7, text: 'dress_lookout_rock' },
    { sprite: 'sc_thrift_wide', x: 2, y: 8, flat: true, walkable: true },
    { sprite: 'sc_thrift', x: 5, y: 7, flat: true, walkable: true },
    { sprite: 'sc_rock_small', x: 13, y: 6, text: 'dress_lookout_rock' },
    { sprite: 'sc_thrift_b', x: 14, y: 6, flat: true, walkable: true },
    { sprite: 'sc_rocks_b', x: 11, y: 11, text: 'dress_lookout_rock' },
    { sprite: 'sc_thrift', x: 13, y: 11, flat: true, walkable: true },
    { sprite: 'sc_thrift_b', x: 10, y: 12, flat: true, walkable: true },
    { sprite: 'sc_gorse', x: 19, y: 11, text: 'dress_lookout_gorse' },
    { sprite: 'sc_gorse_small', x: 9, y: 13, text: 'dress_lookout_gorse' },
    { sprite: 'sc_gorse', x: 31, y: 6, text: 'dress_lookout_gorse' },
    { sprite: 'sc_gorse_small', x: 24, y: 12, text: 'dress_lookout_gorse' },
    { sprite: 'sc_flagstones', x: 15, y: 14, flat: true, walkable: true },
    { sprite: 'sc_flagstones', x: 19, y: 8, flat: true, walkable: true },
    { sprite: 'sc_fence_broken', x: 10, y: 15, text: 'dress_lookout_fence' },
    { sprite: 'sc_rocks_b', x: 31, y: 15, text: 'dress_lookout_rock' },
    { sprite: 'sc_thrift_wide', x: 29, y: 15, flat: true, walkable: true },
    { sprite: 'sc_thrift_wide', x: 17, y: 15, flat: true, walkable: true },
    { sprite: 'sc_thrift_wide', x: 23, y: 6, flat: true, walkable: true },
    { sprite: 'sc_thrift', x: 33, y: 7, flat: true, walkable: true },
    { sprite: 'sc_gull', x: 22, y: 12, text: 'dress_lookout_gull', walkable: true, animation: 'sc_gull', speed: 0.7 },
    { sprite: 'sc_gull', x: 23, y: 13, text: 'dress_lookout_gull', walkable: true, animation: 'sc_gull', speed: 0.9 },
    { sprite: 'sc_gull', x: 27, y: 6, text: 'dress_lookout_gull', walkable: true, animation: 'sc_gull', speed: 0.8 },
    { sprite: 'c5_gull_marks', x: 22, y: 13, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 4, y: 11, flat: true, walkable: true },
    { sprite: 'gold_pouch', x: 33, y: 13, text: 'lookout_pouch', gold: 50, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // (life pass 2026-11-14)
    // The headland: a watcher at the telescope, a walker out for his constitutional, a cat on the turf, tubs, a price for the view.
    { sprite: 'st_folk_c', x: 12, y: 7, npc: 'st_lookout_watcher', animation: 'st_folk_c', speed: 0.9 },
    { sprite: 'st_folk_a', x: 8, y: 8, npc: 'st_lookout_walker', animation: 'st_folk_a', speed: 0.7, stroll: { path: [[3, 8], [9, 8]], speed: 8, pause: [3, 6], greet: true } },
    { sprite: 'st_cat_walk', x: 22, y: 8, text: 'life_k_cat', animation: 'st_cat_walk', speed: 0.22, stroll: { path: [[22, 8], [28, 8]], speed: 9, pause: [3, 7], scatter: true, keepAnim: true } },
    { sprite: 'st_tin_box', x: 22, y: 7, text: 'life_k_tin' },
    { sprite: 'st_flower_tub', x: 7, y: 7, text: 'life_k_tub' },
    { sprite: 'st_boot_planter', x: 18, y: 7, text: 'life_k_boot' },
    // Things the wind brought and nobody took back.
    { sprite: 'st_tin_can', x: 27, y: 10, text: 'life_k_can' },
    // (2026-11-15) The town floods a little more each time you come back (src/data/floodStages.js).
    ...lookoutFloodProps(),
  ],
  tileTexts: {
    '~': 'lookout_sea', f: 'lookout_rail', '0': 'lookout_drop', K: 'lookout_cliff', '#': 'lookout_cliff', ',': 'lookout_turf',
  },

  // None: a town.
  npcs: [
  ],
};
