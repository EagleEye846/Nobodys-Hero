// THE POOLS: a low-tide crossing. An inlet cuts the beach in two. At high tide it is all
// deep water, and a crate floats in the middle; at low tide the water draws back off a bed of
// shingle and tidepools, all but one deep trench. A tide wheel on each bank sends the water
// either way. At low tide, push the crate two tiles into the trench: it sinks and makes a
// bridge, and the far bank (and the way on) is reachable. The reset stump sets everything
// back if the crate goes wrong.
// Tile key (see src/overworld/coastTiles.js, wrack):
//   #  cliff top (solid)   W  cliff face (solid)   .  wet shingle   ,  salt grass   q  shingle
//   ;  shallows (walk)   ~  sea (solid)   x  barnacle rock (solid)   O  boulder   F  weed pile

export const WRACK_POOLS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wrack_pools',
  // The room's name, for the Room Editor.
  name: 'THE POOLS',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wrack',
  // The Wrack Shore's song (src/data/music/wrackTheme.js), and the sounds of the place under it.
  music: 'wrack',
  ambience: 'storm_shore',
  vesWell: true,

  tiles: [
    '############################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#........~~~~~~~~~~~~~~~~~~~~..............#',
    '#.;;..x..~~~~~~~~~~~~~~~~~~~~.,,,,,,,,,,,,,#',
    '#.;.....O~~~~~~~~~~~~~~~~~~~~.,,,,,,,,,,,,,#',
    '#........~~~~~~~~~~~~~~~~~~~~.,,,,,,,,,,,,,#',
    '#x.......~~~~~~~~~~~~~~~~~~~~.,,,,,,,,,,,,,#',
    '#........~~~~~~~~~~~~~~~~~~~~..............#',
    '.........~~~~~~~~~~~~~~~~~~~~............F..',
    '.........~~~~~~~~~~~~~~~~~~~~...............',
    '#........~~~~~~~~~~~~~~~~~~~~.O............#',
    '#........~~~~~~~~~~~~~~~~~~~~..............#',
    '#...;;...~~~~~~~~~~~~~~~~~~~~.......;;.....#',
    '#,,,,,,,,~~~~~~~~~~~~~~~~~~~~........;;....#',
    '#,,,,,,F,~~~~~~~~~~~~~~~~~~~~..x........x..#',
    '#,,,,,,,,~~~~~~~~~~~~~~~~~~~~..............#',
    '#WWWWWWWW~~~~~~~~~~~~~~~~~~~~WWWWWWWWWWWWWW#',
    '############################################',
  ],

  // The tide: a bed of shingle shows at LOW, with a trench of deep water down column 20 that
  // stays deep. A wheel on each bank turns the tide (both banks are dry at both tides). At
  // low tide push the crate (18,8) two tiles east into the trench: it sinks and bridges it.
  // The reset stump (3,11) puts the tide and the crate back. Row 15 and 16 of the inlet
  // stay deep so the shallows cannot be waded round.
  tide: {
    start: 'high',
    low: [
    '                                            ',
    '                                            ',
    '         qqqqqqqqqqq~qqqqqqqq               ',
    '         qqqqqqqqqqq~qqqqqqqq               ',
    '         qqqqqqqqqqq~qqqqq;qq               ',
    '         qqq;;qqqqqq~qqqqqqqq               ',
    '         qqqq;qqqqqq~qqxqqqqq               ',
    '         qqqqqqqqqqq~qqqqqqqq               ',
    '         qqqqqqqqqqq~qqqqqqqq               ',
    '         qqxqqqqqqqq~qqqqqqqq               ',
    '         qqqqqqqqqqq~qqq;;qqq               ',
    '         qqqqqqqqqqq~qqqq;qqq               ',
    '         qqqqqq;qqqq~qqqqqqqq               ',
    '         qqqqqqqqxqq~qqqqqqqq               ',
    '         qqqqqqqqqqq~qqqqqqqq               ',
    '                                            ',
    '                                            ',
    '                                            ',
    ],
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'wrack_landing', spawn: { x: 38, y: 10 } },
    { x: 43, y: 8, w: 1, h: 2, to: 'wrack_gaps', spawn: { x: 2, y: 12 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wrack.txt',
  props: [
    // A wheel on each bank (the tide), a reset stump, the crate, and the bank's odds and ends.
    { sprite: 'valve_wheel', x: 5, y: 6, text: 'pools_wheel', tideWheel: { to: 'toggle', text: 'pools_wheel_turn', busy: 'pools_wheel_busy' } },
    { sprite: 'valve_wheel', x: 32, y: 5, text: 'pools_wheel', tideWheel: { to: 'toggle', text: 'pools_wheel_turn', busy: 'pools_wheel_busy' } },
    { sprite: 'rock_stump', x: 3, y: 11, text: 'rock_stump', rockReset: true },
    { sprite: 'c5_crate', x: 18, y: 8, text: 'pools_crate', rock: true, float: true, step: true },
    // The way back. Crates go home every time you come in, so a player coming back from the
    // gaps would find the first crate on the west side of the trench and be stuck on the east
    // bank. This one sits east of the trench (afloat at high): at low, push it two tiles west
    // from (23,11) and it bridges the trench at (20,11). It can't be reached from the west
    // before crossing, so the puzzle going east is the same.
    { sprite: 'c5_crate', x: 22, y: 11, text: 'pools_crate', rock: true, float: true, step: true },
    { sprite: 'sign', x: 7, y: 9, text: 'pools_sign' },
    { sprite: 'c5_buoys_pile', x: 2, y: 14, text: 'pools_buoys' },
    { sprite: 'c5_driftwood', x: 34, y: 14, text: 'landing_driftwood' },
    { sprite: 'c5_rope_coil', x: 31, y: 8, text: 'landing_pots', walkable: true },
    { sprite: 'gold_pouch', x: 40, y: 4, text: 'pools_pouch', gold: 45, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'landing_cliff', W: 'landing_cliff', '~': 'pools_sea', x: 'landing_rock', O: 'landing_rock', F: 'landing_weed', ';': 'pools_pool' },

  // A shellac on the west bank (row 14, x 2 to 6: clear of the stump, the wheel, the door and
  // every tile the tide changes), and a PAIR on the east bank: a limpet knight on sentry (row 12,
  // x 32 to 34) and a pinwheel rolling about beside it (x 32 to 35, home row 11), within four
  // tiles of each other so they fight together. The pair is east of the shingle (x 29 on is dry at
  // both tides), clear of the wheel (32,5), the door and the return crate's lane (row 11, x 21 to
  // 23). No cutscenes in this room.
  npcs: [
    { enemy: 'shellac', x: 3, y: 14, patrol: [2, 6], behaviour: 'patrol' },
    { enemy: 'limpet_knight', x: 33, y: 12, patrol: [32, 34], behaviour: 'patrol' },
    { enemy: 'pinwheel', x: 34, y: 11, patrol: [32, 35], behaviour: 'wander' },
  ],
};
