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
  vesWell: true,

  tiles: [
    '############################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#.........~~~~~~~~~~~~~~~~~~~~~~~~.........#',
    '#..;;.....~~~~~~~~~~~~~~~~~~~~~~~~,,,,,,,,,#',
    '#..;...x..~~~~~~~~~~~~~~~~~~~~~~~~,,x,,,,,,#',
    '#.........~~~~~~~~~~~~~~~~~~~~~~~~,,,,,,,,,#',
    '#.........~~~~~~~~~~~~~~~~~~~~~~~~,,,,,,,,,#',
    '#.O.......~~~~~~~~~x....x~~~~~~~~~.........#',
    '..........~~~~~~~~~......;;;;;;;;;..........',
    '..........~~~~~~~~~......;;;;;;;;;..........',
    '#.........~~~~~~~~~x....x~~~~~~~~~......x..#',
    '#.........~~~~~~~~~~~~~~~~~~~~~~~~.F.......#',
    '#.........~~~~~~~~~~~~~~~~~~~~~~~~.......O.#',
    '#,,,,,,,,,~~~~~~~~~~~~~~~~~~~~~~~~...;;....#',
    '#,,,,,,,F,~~~~~~~~~~~~~~~~~~~~~~~~....;....#',
    '#,,,,,,,,,~~~~~~~~~~~~~~~~~~~~~~~~.........#',
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
  ],
  tileTexts: { '#': 'landing_cliff', W: 'landing_cliff', '~': 'clock_sea', x: 'landing_rock', O: 'landing_rock', F: 'landing_weed' },

  // A moonjelly on the west bank (rows 3 to 6, x 2 to 8: it drifts over the little pool), a
  // shellac on the east bank (row 5, x 36 to 41) and a pinwheel south of it (row 12, x 35 to 41).
  // None stands on a tile the tide changes or on the islet, and none is near a door. No cutscenes.
  npcs: [
    { enemy: 'moonjelly', x: 5, y: 5, patrol: [2, 8], behaviour: 'wander' },
    { enemy: 'shellac', x: 38, y: 5, patrol: [36, 41], behaviour: 'patrol' },
    { enemy: 'pinwheel', x: 38, y: 12, patrol: [35, 41], behaviour: 'wander' },
  ],
};
