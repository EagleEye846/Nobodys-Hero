// THE CAUSEWAY: the old road across the drowned fields, and the tide that keeps it. The water
// comes and goes on its own clock (a dial on each bank and one on the island). At HIGH the
// fields are all water and two crates bob about on it; at LOW the water draws off a bed of mud
// and the broken causeway shows, cut in two places by deep drains (columns 12 and 27) that
// never empty. Push a crate into each drain at low tide and it sinks and bridges it. A bridge
// floats up again at high water and settles back at the next low, so the way across is only
// open at low tide; if the water comes in while you're out on the mud, it waits a moment and
// then lifts you to the nearest dry ground (the island or a bank), and you try again.
// Tile key (see src/overworld/coastTiles.js, lanes):
//   #  rock top (solid)   W  mossy stone face (solid)   ,  turf   .  drowned cobbles   :  mud
//   ;  puddle (walk)   ~  floodwater (solid)   x  barnacle rock   O  boulder   J  gatepost   F  weed

export const LANES_CAUSEWAY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lanes_causeway',
  // The room's name, for the Room Editor.
  name: 'THE CAUSEWAY',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lanes',
  // The Sunken Lanes' song, and the sounds of the place under it.
  music: 'lanes',
  ambience: 'storm_shore',
  vesWell: true,

  // The HIGH-tide map.
  tiles: [
    '########################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#F,,,~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,x,#',
    '#,,,,~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,,,#',
    '#,,,,~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,,,#',
    '#,,,,~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,,,#',
    '#,,,,~~~~~~~~~~~~x,,,,J~~~~~~~~~~~~,,,,#',
    '#,,,,~~~~~~~~~~~~,,,,,,~~~~~~~~~~~~,,,,#',
    '.....~~~~~~~~~~~~,,,,,,~~~~~~~~~~~~.....',
    '.....~~~~~~~~~~~~,,,,,,~~~~~~~~~~~~.....',
    '#,,,,~~~~~~~~~~~~,,,,,,~~~~~~~~~~~~,,,,#',
    '#,,,,~~~~~~~~~~~~O,,,,,~~~~~~~~~~~~,,,,#',
    '#,,,,~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,,,#',
    '#,,,,~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,,,#',
    '#,,,,~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,,,#',
    '#,,,,~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,,F#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '########################################',
  ],

  // The tide clock: 16 seconds of high water, 24 of low, three of warning. Starts HIGH, so the
  // first thing you see is the crates afloat. At LOW the fields are mud (the causeway's
  // cobbles on rows 8 and 9) except the two drains, deep at both tides from top to bottom (so
  // nothing can be waded round). The banks (x 1 to 4 and 35 to 38) and the island (x 17 to
  // 22, rows 6 to 11) are dry at both tides; the dials and the stump are on them.
  tide: {
    start: 'high',
    clock: { high: 16, low: 24, warn: 3 },
    low: [
    '                                        ',
    '                                        ',
    '     :::::::~::::::::::::::~:::::::     ',
    '     :::::::~:;;:::::::::::~:::::::     ',
    '     :::::::~::::::::::::::~:::;;::     ',
    '     :::::::~::::::::::::::~:::::::     ',
    '     :::::::~::::      ::::~:::::::     ',
    '     :::::::~::::      ::::~:::::::     ',
    '     .......~....      ....~.......     ',
    '     .......~....      ....~.......     ',
    '     :::::::~::::      ::::~:::::::     ',
    '     :::::::~::::      ::::~:::::::     ',
    '     :::::::~::::::::::::::~::;::::     ',
    '     ::;;:::~::::::::::::::~:::::::     ',
    '     :::::::~:::::::::::;::~:::::::     ',
    '     :::::::~::::::::::::::~:::::::     ',
    '                                        ',
    '                                        ',
    ],
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'lanes_fork', spawn: { x: 38, y: 4 } },
    { x: 39, y: 8, w: 1, h: 2, to: 'lanes_sluices', spawn: { x: 2, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lanes.txt',
  props: [
    // Three tide dials (west bank, island, east bank), the reset stump, the two crates.
    // Crate A (8,4): push it east four times at low tide into the first drain (12,4).
    // Crate B (20,10), on the island: push it east seven times into the second drain (27,10).
    { sprite: 'tide_dial', x: 3, y: 5, text: 'causeway_dial', tideDial: true },
    { sprite: 'tide_dial', x: 21, y: 7, text: 'causeway_dial', tideDial: true },
    { sprite: 'tide_dial', x: 36, y: 5, text: 'causeway_dial', tideDial: true },
    { sprite: 'rock_stump', x: 2, y: 13, text: 'rock_stump', rockReset: true },
    { sprite: 'c5_crate', x: 8, y: 4, text: 'causeway_crate', rock: true, float: true, step: true },
    { sprite: 'c5_crate', x: 20, y: 10, text: 'causeway_crate', rock: true, float: true, step: true },
    // Crate C (31,12), east of the second drain: for coming back the other way (crates go home
    // whenever you come into the room). Push it west four times into (27,12), then crate B west
    // off the island into the first drain.
    { sprite: 'c5_crate', x: 31, y: 12, text: 'causeway_crate', rock: true, float: true, step: true },
    // The island: a lane's end that was a farmyard once.
    { sprite: 'ln_signpost', x: 18, y: 7, text: 'causeway_signpost' },
    { sprite: 'gold_pouch', x: 22, y: 9, text: 'causeway_pouch', gold: 80, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'sign', x: 4, y: 10, text: 'causeway_sign' },
    { sprite: 'street_lamp', x: 4, y: 7, text: 'fork_lamp' },
    { sprite: 'street_lamp', x: 35, y: 7, text: 'fork_lamp' },
    { sprite: 'c5_barrel', x: 37, y: 12, text: 'fork_barrel' },
  ],
  tileTexts: { '#': 'lanes_rock', W: 'lanes_rock', '~': 'causeway_water', ';': 'causeway_puddle', x: 'lanes_stone', O: 'lanes_stone', J: 'fork_gatepost', F: 'fork_weed' },

  // A shellac on the east bank (row 13, x 35 to 38) and a net wraith drifting over the island
  // (x 18 to 21, home row 8). Neither stands on a tile the tide changes (the bank and the island
  // are dry at both tides), and neither is near a door, a dial or the stump. No cutscenes here.
  npcs: [
    { enemy: 'shellac', x: 36, y: 13, patrol: [35, 38], behaviour: 'patrol' },
    { enemy: 'net_wraith', x: 19, y: 8, patrol: [18, 21], behaviour: 'wander' },
  ],
};
