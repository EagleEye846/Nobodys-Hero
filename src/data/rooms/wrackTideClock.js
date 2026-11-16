// THE TIDE CLOCK: the beach keeps its own time, and so does the water. A rock stands out in
// the bay, and on it a lantern that is lit (lantern 2 of the chapter; nobody says who by).
// The rock is reached over a shingle bar that shows only at low tide; the far shore only at
// high tide, over shallows. Walk out at low, wait on the rock for the water to turn, walk on.
// Tile key (see src/overworld/coastTiles.js, wrack):
//   #  cliff top (solid)   W  cliff face (solid)   .  wet shingle   ,  salt grass   q  shingle
//   ;  shallows (walk)   ~  sea (solid)   x  barnacle rock (solid)   O  boulder   F  weed pile

export const WRACK_TIDE_CLOCK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wrack_tide_clock',
  // The room's name, for the Room Editor.
  name: 'THE TIDE CLOCK',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wrack',
  // The Wrack Shore's song (src/data/music/wrackTheme.js), and the sounds of the place under it.
  music: 'wrack',
  ambience: 'storm_shore',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_shore', lamplight: { shade: 0.16, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,



  tiles: [
    '############################################',
    '##W###WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW####W#',
    '#W.WWW.....~~~~~~~~~~~~~~~~~~~~~......W##W.#',
    '#..;;....~~~~~~~~^~~~~~~~~~xx~~~~~,,,,,WW,,#',
    '#..;...x.~~~~~~x~~~~~~~~~~~~~~~x~~x,x,,,,,,#',
    '#.........~~~~~~~~~~~~~~~~~~~~~~~~~,,,,,,,,#',
    '#..........~~~~~~~~~x..x~~~~~~~~~,,,,,,,,,,#',
    '#.O........~~~~~~~~x....x~~~~~~~~~.........#',
    '..........~~~~~~~~~......;;;;;;;;;..........',
    '..........~~~~~~~~~......;;;;;;;;;..........',
    '#.........~~~~^~~~~x....x~~~~~~~~~......x..#',
    '#........~~~~~~~~~~~x..x~~~~~~~x~~.F.......#',
    '#.......~~~~~~xx~~~~~~~~~~~~~~~~~~~~.....O.#',
    '#,,,,,,,,~~~~~~~~~~~~~~~~~~~^~~~~~...;;....#',
    '#Ox,,,,,~,~~~~~~~~~~~~~~~~~~~~~~~~...Ox....#',
    '#xxOx,,,,,.~~~x~~~~~~xx~~~~~~O~~~...OxxO..O#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '############################################',
  ],

  // The beach's tide clock: no wheels, only a timer (24 seconds each way, three of warning).
  // At LOW a shingle bar joins the west bank to the islet (x 19 to 24, rows 7 to 10, dry at both
  // tides); at HIGH the bar is deep water and a belt of shallows (x 25 to 33, rows 8 and 9) joins
  // the islet to the east bank (at LOW those are reef rocks). So: cross at low, wait out the
  // tide on the islet, cross on at high. The water waits for people and never drowns them, and
  // the clock never stops, so nothing can be got wrong. Two dials show the state.
  tide: {
    start: 'low',
    clock: { high: 24, low: 24, warn: 3 },
    low: [
    '                                            ',
    '                                            ',
    '                                            ',
    '                                            ',
    '            ;;                              ',
    '             ;                x             ',
    '                                            ',
    '                                            ',
    '          qqqqqqqqq      xxxxxxxxx          ',
    '          qqqqqqqqq      xxxxxxxxx          ',
    '                                            ',
    '                                            ',
    '               x            ;;              ',
    '                             ;              ',
    '                                            ',
    '                                            ',
    '                                            ',
    '                                            ',
    ],
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'wrack_dunes', spawn: { x: 42, y: 9 } },
    { x: 43, y: 8, w: 1, h: 2, to: 'wrack_bathtub', spawn: { x: 2, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wrack.txt',
  props: [
    // Two tide dials (one on each bank), the lit lantern on the rock, a purse, a sign and odds and ends.
    { sprite: 'tide_dial', x: 8, y: 6, text: 'clock_dial', tideDial: true },
    { sprite: 'tide_dial', x: 35, y: 6, text: 'clock_dial', tideDial: true },
    { sprite: 'c5_lantern_post_lit', x: 21, y: 8, text: 'clock_lantern', animation: 'c5_lantern_post_lit', speed: 0.25 },
    { sprite: 'gold_pouch', x: 22, y: 9, text: 'clock_pouch', gold: 30, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'sign', x: 5, y: 10, text: 'clock_sign' },
    { sprite: 'c5_buoy_yellow', x: 6, y: 13, text: 'landing_buoy' },
    { sprite: 'c5_net_frame', x: 39, y: 4, text: 'clock_net' },
    { sprite: 'c5_barrel', x: 40, y: 13, text: 'landing_barrel' },
    // Dressing (second pass). Stones out in the water, on tiles that are sea at both tides.
    { sprite: 'c5_rocks_weedy', x: 12, y: 5, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 24, y: 4, text: 'shore_rocks' },
    { sprite: 'c5_rocks_weedy', x: 29, y: 3, text: 'shore_rocks' },
    { sprite: 'c5_rocks_weedy', x: 12, y: 13, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 22, y: 13, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 26, y: 14, text: 'shore_rocks' },
    { sprite: 'c5_weed_mat', x: 17, y: 5, flat: true, walkable: true },
    { sprite: 'c5_weed_mat', x: 27, y: 11, flat: true, walkable: true },
    // The west bank: a lantern by the way in, a fire in the grass, the tide's leavings.
    { sprite: 'c5_lantern_hook', x: 1, y: 7, text: 'shore_lantern' },
    { sprite: 'c5_drift_fire', x: 3, y: 14, text: 'shore_fire' },
    { sprite: 'c5_rock_pool', x: 6, y: 2, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 3, y: 11, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 2, y: 12, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 7, y: 14, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 7, y: 11, flat: true, walkable: true },
    // The east bank: a broken fence, a fire, a lantern by the way on.
    { sprite: 'c5_rocks_weedy', x: 41, y: 6, text: 'shore_rocks' },
    { sprite: 'c5_fence_broken', x: 38, y: 11, text: 'shore_fence' },
    { sprite: 'c5_drift_fire', x: 42, y: 12, text: 'shore_fire' },
    { sprite: 'c5_lantern_hook', x: 42, y: 7, text: 'shore_lantern' },
    { sprite: 'c5_weed_mat', x: 34, y: 10, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 36, y: 3, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 41, y: 3, flat: true, walkable: true },
    { sprite: 'c5_rock_pool', x: 35, y: 14, flat: true, walkable: true },
    // Weed lying on the causeway's shallows (on the rocks when the tide's out).
    { sprite: 'c5_weed_mat', x: 26, y: 8, flat: true, walkable: true },
    { sprite: 'c5_weed_mat', x: 30, y: 9, flat: true, walkable: true },
    // LIFE-PASS-BEGIN (builder 3, 2026-11-14): rock-pool life, shells, kelp, the odds the sea left. Everything here is walkable, so nothing is ever in anyone's way.
    { sprite: 'gold_pouch', x: 2, y: 2, text: 'sl_pouch_tide', gold: 40, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_oar_stuck', x: 6, y: 9, text: 'sl_oar' },
    { sprite: 'c5_buoy_yellow', x: 38, y: 9, text: 'sl_float' },
    { sprite: 'shore_bottle', x: 2, y: 11, text: 'sl_bottle', walkable: true },
    { sprite: 'c5_barrel', x: 42, y: 2, text: 'sl_barrel' },
    { sprite: 'c5_lantern_fallen', x: 10, y: 2, text: 'sl_lantern', flat: true, walkable: true },
    // LIFE-PASS-END
  ],
  tileTexts: { '#': 'landing_cliff', W: 'landing_cliff', '~': 'clock_sea', x: 'landing_rock', O: 'landing_rock', F: 'landing_weed' },

  // A moonjelly on the west bank (rows 3 to 6, x 2 to 8: it drifts over the little pool), a
  // shellac on the east bank (row 5, x 36 to 41) and a pinwheel south of it (home row 13, x 35 to 39, so its wander stays clear of the bathtub door's spawn at 42,9).
  // None stands on a tile the tide changes or on the islet, and none is near a door. No cutscenes.
  npcs: [
    { enemy: 'moonjelly', x: 5, y: 5, patrol: [2, 8], behaviour: 'wander' },
    { enemy: 'shellac', x: 38, y: 5, patrol: [36, 41], behaviour: 'patrol' },
    { enemy: 'pinwheel', x: 37, y: 13, patrol: [35, 39], behaviour: 'wander' },
  ],
};
