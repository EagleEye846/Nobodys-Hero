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
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_shore', lamplight: { shade: 0.18, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,

  // The HIGH-tide map.
  tiles: [
    '########################################',
    '####WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#W##',
    '#WWW,~~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,WxW#',
    '#,,,,~~~~~~~~~~~~~~~~~~~x~~~~~~~~~~,,,,#',
    '#,,,~~~~~~~~~~~~~~~~~~~~~~~~~~x~~~~~,,,#',
    '#,,,,~~~~~~~~~~~~~~~~~~~~~~~~~~x~~~,,,,#',
    '#,,,,,~~~~~~~~~~~x,,,,J~~~~~~~~~~~,,,,,#',
    '#,,,,,~~~~~~~~~~~,,,,,,~~~~~~~~~~~~,,,,#',
    '.....~~~~~~~~~~~,,,,,,,,~~~~~~~~~~~.....',
    '.....~~~~~~~~~~~,,,,,,,,~~~~~~~~~~~.....',
    '#,,,,,~~~~~~~~~~~,,,,,,~~~~~~~~~~~,,,,,#',
    '#,,,,~~~~~~~~~~~~O,,,,,~~~~~~~~~~~,,,,,#',
    '#,,,~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,,,#',
    '#,,,,~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,,,#',
    '#,,,,~~~~xx~~~~x~~~~~~~~~~~~~~~~~~~~,,,#',
    '#xxO,,,~~~~~~~~~~~~~~~~~~~~~~~~~~~~~x,F#',
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
    '     :::::::~:;;::::::::x::~:::::::     ',
    '     :::::::~::::::::::::::~::x;;::     ',
    '     :::::::~::::::::::::::~:::x:::     ',
    '     :::::::~::::      ::::~:::::::     ',
    '     :::::::~::::      ::::~:::::::     ',
    '     .......~....      ....~.......     ',
    '     .......~....      ....~.......     ',
    '     :::::::~::::      ::::~:::::::     ',
    '     :::::::~::::      ::::~:::::::     ',
    '     :::::::~::::::::::::::~::;::::     ',
    '     ::;;:::~::::::::::::::~:::::::     ',
    '     ::::xx:~::x::::::::;::~:::::::     ',
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
    // Second pass. The drowned fields' old bones lying on the bottom: field walls, a farm
    // track's stones, a bush or two (flat, so they show through the water at high tide and lie
    // in the mud at low, and never stand in a crate's way). The weed the tide leaves along both
    // banks, and moss on the island's old farmyard.
    { sprite: 'ln_under_a', x: 6, y: 5, flat: true, walkable: true },
    { sprite: 'ln_under_b', x: 13, y: 15, flat: true, walkable: true },
    { sprite: 'ln_under_a', x: 24, y: 4, flat: true, walkable: true },
    { sprite: 'ln_under_b', x: 29, y: 15, flat: true, walkable: true },
    { sprite: 'ln_under_b', x: 7, y: 14, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 1, y: 11, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 35, y: 10, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 35, y: 3, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 17, y: 11, flat: true, walkable: true },
    { sprite: 'ln_moss_b', x: 19, y: 6, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 1, y: 4, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 37, y: 9, flat: true, walkable: true },
    // Life pass (14 November 2026): belongings, signs, trees and small life.
    { sprite: 'lv_willow', x: 2, y: 6, text: 'lp_willow_bank', walkable: true },
    { sprite: 'lv_bench', x: 3, y: 12, text: 'lp_bench_bank', walkable: true },
    { sprite: 'lv_sign_inn', x: 36, y: 7, text: 'lp_sign_inn', walkable: true },
    { sprite: 'lv_barrow', x: 36, y: 11, text: 'lp_barrow', walkable: true },
    { sprite: 'lv_apple_tree_dry', x: 18, y: 7, text: 'lp_island_tree', walkable: true },
    { sprite: 'lv_birdbath', x: 17, y: 9, text: 'lp_birdbath', walkable: true },
    { sprite: 'lv_reeds', x: 4, y: 4, walkable: true, animation: 'lv_reeds', speed: 0.35, decor: true },
    { sprite: 'lv_reeds', x: 4, y: 14, walkable: true, animation: 'lv_reeds', speed: 0.35, decor: true },
    { sprite: 'lv_reeds', x: 34, y: 14, walkable: true, animation: 'lv_reeds', speed: 0.35, decor: true },
    { sprite: 'lv_toadstools', x: 37, y: 3, flat: true, walkable: true, decor: true },
    { sprite: 'lv_ivy', x: 10, y: 1, walkable: true, decor: true },
    { sprite: 'lv_sill', x: 28, y: 1, text: 'lp_sill_cw', walkable: true },
    { sprite: 'lv_boards', x: 3, y: 9, flat: true, walkable: true, decor: true },
    { sprite: 'lv_milestone', x: 1, y: 12, text: 'lp_milestone_cw', walkable: true },
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
