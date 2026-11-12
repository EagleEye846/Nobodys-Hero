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
  // "Hopes Above Water" (src/data/music/reachRainTheme.js).
  music: 'reachRain',
  ambience: 'open_sea',
  // After the chapter (the_light_answers) the storm is over, as at the tower's foot: no rain or
  // lightning, the sea lying down, and the grey-blue light of a quiet sea in place of the storm's green.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.5, fog: 0.15 }, ambience: 'calm_sea', lamplight: { shade: 0.32, tint: '30, 40, 64' } },
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
    '#~~~~~~~~~~~~~~~~~~~~~~x...~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~,,,..,,...~~~~~~#',
    '#~~~^~~~~~~~~~~~~~~~..;;.....,.~~~~x~#',
    '#~~~~x~~~~~~..~~~~~~x..........o~~~~~#',
    '#~~~~~~~~~x.,,.~~~~~#.######..~o~~~~~#',
    '#~~~~~~~~~.,,,,~~~~~WWWWWWWWWW~o~~~~~#',
    '#~~~~~~~....,,.~~~~~.WWWWWWWWxoo~~~~~#',
    '#~~~~~~~x..,,...~~~~.;.......x~o~~~~~#',
    '#~~~~~~~~oo.....~~~~.,,.......~~~~~~~#',
    '#~~~~~~~~oo.....~~~~..,,...;..~~~x~~~#',
    '#~~~~~~~~oo,,..x~~~~.;...,,...~~~~~~~#',
    '#~~~~x~~~.,,..x.~~~~..;...,,.~~~~~~~~#',
    '#~~~~~~~~~..,..x~~~~x..,..,,~~~~~~^~~#',
    '#~~~~~~~~~~..x~~~~~~~~~~..x~~~~~~~~~~#',
    '#~x~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~^~~~~~~~~#',
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
    { sprite: 'cf_haddock_row', x: 32, y: 6, npc: 'haddock_reach', animation: 'cf_haddock_row', speed: 0.6, until: 'haddock_gone' },
    // After the chapter: the Bother, empty (Ves rows her now).
    { sprite: 'cf_bother', x: 32, y: 6, text: 'bother_after', animation: 'cf_bother', speed: 0.6, after: 'haddock_gone' },
    { sprite: 'c5_chain_bollard', x: 30, y: 3, text: 'reach_bollard' },
    { sprite: 'sign', x: 14, y: 8, text: 'rock_sign' },
    { sprite: 'c5_seaweed_heap', x: 21, y: 13, text: 'reach_weed' },
    { sprite: 'c5_driftwood', x: 27, y: 9, text: 'reach_driftwood' },
    { sprite: 'c5_buoy_red', x: 22, y: 3, text: 'rock_buoy' },
    { sprite: 'c5_rope_coil', x: 28, y: 3, text: 'rock_coil', walkable: true },
    { sprite: 'gold_pouch', x: 11, y: 12, text: 'rock_pouch', gold: 150, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // What the sea leaves on a bare rock: a tide line of weed and cork, gulls' marks, a crab's road,
    // rain lying in the hollows, a net torn off some boat that didn't make it.
    { sprite: 'c5_wrack_line', x: 10, y: 13, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 12, y: 5, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 11, y: 10, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 23, y: 10, flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 22, y: 11, flat: true, walkable: true },
    { sprite: 'c5_net_torn', x: 25, y: 2, flat: true, walkable: true },
    // A lantern on its post at the head of the jetty, for Haddock to find the rock by.
    { sprite: 'c5_lantern_hook', x: 30, y: 2 },
    // Second pass: the two halves' own look: pools, lichen, sea-pinks, a cairn, an old boat's bow,
    // stakes, gulls, rocks breaking the sea. Nothing in the gully or on the bar (x 16-19, rows 8-11),
    // the landing and its water, the rope's throw (24-26, rows 7-9) or the jetty.
    { sprite: 'il_tidepool', x: 13, y: 10, flat: true, walkable: true },
    { sprite: 'il_cairn', x: 13, y: 5, text: 'reach_cairn' },
    { sprite: 'il_grass_tuft', x: 14, y: 6, walkable: true },
    { sprite: 'il_thrift', x: 12, y: 11, walkable: true },
    { sprite: 'il_grass_tuft_b', x: 11, y: 7, walkable: true },
    { sprite: 'il_rowboat_half', x: 12, y: 13, text: 'reach_rowboat_half' },
    { sprite: 'il_lichen', x: 24, y: 10, flat: true, walkable: true },
    { sprite: 'il_lichen', x: 28, y: 11, flat: true, walkable: true },
    { sprite: 'il_lichen', x: 21, y: 8, flat: true, walkable: true },
    { sprite: 'il_thrift', x: 26, y: 11, walkable: true },
    { sprite: 'il_grass_tuft', x: 27, y: 12, walkable: true },
    { sprite: 'il_grass_tuft_b', x: 23, y: 13, walkable: true },
    { sprite: 'il_stakes_rope', x: 24, y: 14, text: 'reach_stakes' },
    { sprite: 'il_gull', x: 25, y: 1, walkable: true },
    { sprite: 'il_thrift', x: 21, y: 2, walkable: true },
    { sprite: 'il_gull', x: 27, y: 3, walkable: true },
    { sprite: 'il_lichen', x: 26, y: 2, flat: true, walkable: true },
    { sprite: 'il_gull_rock', x: 5, y: 6, text: 'reach_gull_rock' },
    { sprite: 'il_rocks_big', x: 25, y: 16, text: 'reach_rocks' },
    { sprite: 'il_rocks', x: 36, y: 9, text: 'reach_rocks' },
    { sprite: 'il_rocks', x: 17, y: 2, text: 'reach_rocks' },
    { sprite: 'il_rocks', x: 7, y: 15, text: 'reach_rocks' },
  ],
  tileTexts: { '#': 'reach_rock', W: 'reach_cliff', '~': 'reach_sea', x: 'reach_barnacles', o: 'reach_planks', q: 'rock_bar', ';': 'reach_pool' },

  // None: the first room of the area (and the boat rides land on the landing and the jetty).
  npcs: [
  ],
};
