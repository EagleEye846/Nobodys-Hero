// THE REEF: two islets with a drowned reef between them, and the storm imps wheeling over the
// lot. At high water the reef is all sea; at low it shows, a field of wet coral and pools, with
// one deep cut down the middle (column 21) that never drains. A tide wheel on each islet turns
// the water (no clock: the sea out here does as it's told, for once). At low tide push the
// crate on the west islet's edge (15,12) six tiles east along row 12: it drops into the cut and
// bridges it. The reset stumps (11,15 west, 33,11 east) put the water and the crates back.
//
// The way back: crates go home every time you come in, so a second crate waits on the east
// islet (27,9) for anyone crossing west: at low, push it six tiles west along row 9 into the cut.
// It can't be reached from the west before crossing, so going east the puzzle is the same.
//
// Haddock puts you ashore on the west landing and rows round to the east islet's jetty. The
// jetty (column 35, from 34,7) has the Bother alongside: its end (35,11) rows on to the wreck;
// the step off its west side (34,10) rows back to the first rock. Talk to Haddock from (35,9).
// Tile key (see src/overworld/coastTiles.js, reach):
//   .  wet rock slabs   ,  turf   o  planks   ~  heavy green sea (solid)
//   x  barnacle rock and coral (solid)   ;  pools (walk)

export const REACH_REEF = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'reach_reef',
  // The room's name, for the Room Editor.
  name: 'THE REEF',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'reach',
  // "Out Past the Light" (src/data/music/reachTheme.js).
  music: 'reach',
  ambience: 'open_sea',
  vesWell: true,
  // Rougher than the first rock.
  atmosphere: { rain: 1.3, lightning: 0.9, spray: 1.4 },
  lastLight: { x: 37, y: 16 },
  skyline: [
    { kind: 'hull', x: 4, y: 16, lean: 1 },
    { kind: 'mast', x: 37, y: 5, lean: -1, tall: 40 },
  ],

  tiles: [
    '##########################################',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~x.,,,,,~~~~~~~~~~~......x~~~~~~~#',
    '#~~~~~~~~..,,,,,~~~~~~~~~~~.......~~~~~~~#',
    '#~~~~~~~~..,,,,,~~~~~~~~~~~.......~~~~~~~#',
    '#~~~~~~~~.......~~~~~~~~~~~.......~~~~~~~#',
    '#~~~~~~~~.......~~~~~~~~~~~.......oo~~~~~#',
    '#~~~~~~~~.......~~~~~~~~~~~.......~o~~~~~#',
    '#~~~~~~~~oo.....~~~~~~~~~~~.......~o~~~~~#',
    '#~~~~~~~~oo.....~~~~~~~~~~~......xoo~~~~~#',
    '#~~~~~~~~oo.....~~~~~~~~~~~.......~o~~~~~#',
    '#~~~~~~~~.......~~~~~~~~~~~.......~~~~~~~#',
    '#~~~~~~~~.......~~~~~~~~~~~.......~~~~~~~#',
    '#~~~~~~~~.......~~~~~~~~~~~..,,,,,~~~~~~~#',
    '#~~~~~~~~.......~~~~~~~~~~~..,,,,,~~~~~~~#',
    '#~~~~~~~~x.....x~~~~~~~~~~~x.,,,,,~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '##########################################',
  ],

  // The reef: at LOW, x 16-26, rows 4-15 show (coral, pools), all but the cut down column 21.
  // Rows 1-3 and 16-18 stay deep at both tides, so nobody wades round.
  tide: {
    start: 'high',
    low: [
    '                                          ',
    '                                          ',
    '                                          ',
    '                                          ',
    '                .....~.;...               ',
    '                .;;..~..x..               ',
    '                .....~.....               ',
    '                ..x..~.....               ',
    '                .....~.....               ',
    '                .....~.....               ',
    '                .....~.....               ',
    '                .....~...x.               ',
    '                .....~.....               ',
    '                .....~.....               ',
    '                .....~..;;.               ',
    '                ..x;.~.....               ',
    '                                          ',
    '                                          ',
    '                                          ',
    '                                          ',
    ],
  },

  // Where the player starts, in tile coordinates: the landing.
  playerStart: { x: 9, y: 10 },

  doors: [],

  cutscenes: [
    // The landing: the second crossing, once.
    { x: 9, y: 8, w: 2, h: 5, scene: 'reach_crossing_reef' },
    // The jetty's end: on to the wreck. The side step: back to the first rock.
    { x: 35, y: 11, w: 1, h: 1, scene: 'reach_to_wreck' },
    { x: 34, y: 10, w: 1, h: 1, scene: 'reach_back_to_rock' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/reach.txt',
  props: [
    // A wheel on each islet (both dry at both tides), the reset stumps and the two crates.
    { sprite: 'valve_wheel', x: 14, y: 9, text: 'reef_wheel', tideWheel: { to: 'toggle', text: 'reef_wheel_turn', busy: 'reef_wheel_busy' } },
    { sprite: 'valve_wheel', x: 31, y: 11, text: 'reef_wheel', tideWheel: { to: 'toggle', text: 'reef_wheel_turn', busy: 'reef_wheel_busy' } },
    { sprite: 'rock_stump', x: 11, y: 15, text: 'rock_stump', rockReset: true },
    { sprite: 'rock_stump', x: 33, y: 11, text: 'rock_stump', rockReset: true },
    { sprite: 'c5_crate', x: 15, y: 12, text: 'reef_crate', rock: true, float: true, step: true },
    { sprite: 'c5_crate', x: 27, y: 9, text: 'reef_crate', rock: true, float: true, step: true },
    // Haddock in the Bother alongside the east jetty (x 36-39).
    { sprite: 'cf_haddock_row', x: 36, y: 9, npc: 'haddock_reach', animation: 'cf_haddock_row', speed: 0.6 },
    { sprite: 'c5_chain_bollard', x: 33, y: 6, text: 'reach_bollard' },
    { sprite: 'sign', x: 13, y: 7, text: 'reef_sign' },
    { sprite: 'c5_seaweed_heap', x: 10, y: 13, text: 'reach_weed' },
    { sprite: 'c5_buoys_pile', x: 29, y: 4, text: 'reef_buoys' },
    { sprite: 'c5_driftwood', x: 28, y: 13, text: 'reach_driftwood' },
    { sprite: 'gold_pouch', x: 32, y: 15, text: 'reef_pouch', gold: 220, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '~': 'reach_sea', x: 'reef_coral', o: 'reach_planks', ';': 'reach_pool', '.': 'reef_rock' },

  // A pack of three on the east islet's north end (two storm imps and a pinwheel, all within
  // four tiles of each other, so they come at you together): x 28-32, about rows 3-6, clear of
  // the second crate's lane (row 9), the wheel (31,11), the stump (33,11) and the jetty (from
  // 34,7). Nothing on the reef (the tide doesn't move monsters) and nothing on the west islet,
  // so the landing (x 9-10, rows 8-12), where the crossing scene ends, has nobody near it.
  npcs: [
    { enemy: 'storm_imp', x: 29, y: 4, patrol: [28, 30], behaviour: 'wander' },
    { enemy: 'storm_imp', x: 31, y: 5, patrol: [30, 32], behaviour: 'wander' },
    { enemy: 'pinwheel', x: 30, y: 3, patrol: [29, 31], behaviour: 'wander' },
  ],
};
