// THE FIRST ROCK: the first of the Storm Reach's stops, out on the open sea past Haddock's Light.
// A black rock in two halves with a gully of sea between them, and the swell going in and out of
// the gully on its own clock (the tide here is the sea breathing: about fourteen seconds each
// way). Haddock puts you ashore on the west half's landing and rows round the back to the far
// side, where the Bother waits by a little jetty on the high shelf. No monsters (the area's
// first room).
//
// The puzzle: wait for the swell to drop and walk the shingle bar over the gully, then throw the
// Climbing Rope up to the ring at the top of the cliff (ring 25,4; throw from 25,8) onto the
// shelf. The dials (13,7 and 22,12) show the swell. The jetty off the shelf's east end runs south
// down column 31 with the Bother alongside: its end (31,8) rows on to the reef (reach_to_reef);
// the little step off its west side (30,7) rows back. Talk to Haddock from (31,6).
//
// Arriving: from Haddock's Light by `to_the_reach` (any room) onto the landing (9,10), which is
// the trigger of the first rough crossing (reach_crossing_rock, once). The back step here goes home
// to the Bother's jetty in haddock_light_door (`reach_back_to_haddock`).
// Tile key (see src/overworld/coastTiles.js, reach):
//   #  rock top (solid)   W  cliff (solid)   .  wet rock slabs   ,  turf   o  planks
//   ~  heavy green sea (solid)   x  barnacle rock (solid)   q  shingle (low swell only)   ;  pools

export const REACH_FIRST_ROCK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'reach_first_rock',
  // The room's name, for the Room Editor.
  name: 'THE FIRST ROCK',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'reach',
  // "Out Past the Light" (src/data/music/reachTheme.js).
  music: 'reach',
  ambience: 'open_sea',
  vesWell: true,
  // The first rock is the calmest of the Reach's stops; it gets rougher from here.
  atmosphere: { rain: 1.0, lightning: 0.6 },
  // The Last Light's foot, out on the sea to the south-east (atmosphere.js: `lastLight`).
  lastLight: { x: 34, y: 14 },
  skyline: [
    { kind: 'mast', x: 4, y: 15, lean: -1, tall: 46 },
  ],

  tiles: [
    '######################################',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~,,,,.......~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~...........~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~x..........o~~~~~#',
    '#~~~~~~~~x..,,,,~~~~##########~o~~~~~#',
    '#~~~~~~~~...,,,,~~~~WWWWWWWWWW~o~~~~~#',
    '#~~~~~~~~.......~~~~WWWWWWWWWWoo~~~~~#',
    '#~~~~~~~~.......~~~~.........x~o~~~~~#',
    '#~~~~~~~~oo.....~~~~..........~~~~~~~#',
    '#~~~~~~~~oo.....~~~~..........~~~~~~~#',
    '#~~~~~~~~oo.....~~~~..........~~~~~~~#',
    '#~~~~~~~~.....x.~~~~......,,,,~~~~~~~#',
    '#~~~~~~~~......x~~~~x.....,,,,~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '######################################',
  ],

  // The swell: at LOW a shingle bar (x 16-19, rows 9-10) crosses the gully. It turns by itself
  // (a clock); the landing, both halves, the dials and the shelf are dry at both.
  tide: {
    start: 'high',
    clock: { high: 14, low: 14, warn: 3 },
    low: [
    '                                      ',
    '                                      ',
    '                                      ',
    '                                      ',
    '                                      ',
    '                                      ',
    '                                      ',
    '                                      ',
    '                  ;                   ',
    '                qqqq                  ',
    '                qqqq                  ',
    '                 ;                    ',
    '                                      ',
    '                                      ',
    '                                      ',
    '                                      ',
    '                                      ',
    '                                      ',
    ],
  },

  // Where the player starts, in tile coordinates: the landing.
  playerStart: { x: 9, y: 10 },

  // No doors: the Bother is the only way on or back.
  doors: [],

  cutscenes: [
    // The landing: the first rough crossing, once (arriving by to_the_reach).
    { x: 9, y: 8, w: 2, h: 5, scene: 'reach_crossing_rock' },
    // The jetty's end: on to the reef. The side step: back home to Haddock's Light.
    { x: 31, y: 8, w: 1, h: 1, scene: 'reach_to_reef' },
    { x: 30, y: 7, w: 1, h: 1, scene: 'reach_back_to_haddock' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/reach.txt',
  props: [
    { sprite: 'tide_dial', x: 13, y: 7, text: 'rock_dial', tideDial: true },
    { sprite: 'tide_dial', x: 22, y: 12, text: 'rock_dial', tideDial: true },
    // The ring at the top of the cliff (the Climbing Rope: throw from 25,8).
    { sprite: 'grapple_ring', x: 25, y: 4, grapple: true },
    // Haddock in the Bother alongside the jetty (the boat is 4 tiles wide: x 32-35).
    { sprite: 'cf_haddock_row', x: 32, y: 6, npc: 'haddock_reach', animation: 'cf_haddock_row', speed: 0.6 },
    { sprite: 'c5_chain_bollard', x: 30, y: 3, text: 'reach_bollard' },
    { sprite: 'sign', x: 14, y: 8, text: 'rock_sign' },
    { sprite: 'c5_seaweed_heap', x: 21, y: 13, text: 'reach_weed' },
    { sprite: 'c5_driftwood', x: 27, y: 9, text: 'reach_driftwood' },
    { sprite: 'c5_buoy_red', x: 22, y: 3, text: 'rock_buoy' },
    { sprite: 'c5_rope_coil', x: 28, y: 3, text: 'rock_coil', walkable: true },
    { sprite: 'gold_pouch', x: 11, y: 12, text: 'rock_pouch', gold: 150, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'reach_rock', W: 'reach_cliff', '~': 'reach_sea', x: 'reach_barnacles', o: 'reach_planks', q: 'rock_bar', ';': 'reach_pool' },

  // None: the first room of the area (and the boat rides land on the landing and the jetty).
  npcs: [
  ],
};
