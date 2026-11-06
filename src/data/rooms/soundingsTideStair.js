// THE TIDE STAIR: a tall shaft open to the sea at its foot, climbing up through the cliff. The sea
// breathes in and out of the bottom of it on a CLOCK (18 seconds each way). At LOW a shingle bar
// runs from the west landing (the door from the Echo Hall) to a rock in the middle; at HIGH the bar
// drowns and the water lifts over a reef of teeth into a ford from the rock to the east landing.
// So: walk out at low, wait on the rock, wade on at high. From the east landing a stair climbs to
// the mid level; a three-tile cliff with an iron ring at its top is the Climbing Rope's (throw from
// 6,10 facing up; on the ring, face down to go back). At the top, the GREAT SLUICE wheel (3,3): its
// chain runs down through the rock to the Echo Hall, and turning it drains the hall (`group:
// 'soundings_hall'`, LOW). Then east along the top to the Three Wells.
// Every landing, the rock, the doors and the wheel are dry at both tides; three dials show the clock.
// Tile key (see src/overworld/coastTiles.js, soundings):
//   #  rock top (solid)   W  cave rock face (solid)   .  wet slate   q  shingle   ;  the ford
//   ~  black water (solid)   x  glowing sea-glass (solid; the ford's teeth at low)   s  a stair

export const SOUNDINGS_TIDE_STAIR = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'soundings_tide_stair',
  // The room's name, for the Room Editor.
  name: 'THE TIDE STAIR',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'soundings',
  // The Soundings' song ("The Soundings"), and the sounds of a sea cave under it.
  music: 'soundings',
  ambience: 'sea_cave',
  vesWell: true,

  // The HIGH-water map.
  tiles: [
    '##############################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#.............................',
    '#.x...........................',
    '#............#################',
    '#............#################',
    '#..........x.#################',
    '##############################',
    '##############################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#............................#',
    '#..............~~~~~~......x.#',
    '#........x.....~~~~~~........#',
    '#..x...........~~~~~~........#',
    '#............................#',
    '########################ss####',
    '########################ss####',
    '########################ss####',
    '#WWWWWWWWWWWWWWWWWWWWWWWssWWW#',
    '#WWWWW~~~~~~~~~~~~~~~~WWssWWW#',
    '#.....~~~~~~~~~~~~~~~~.......#',
    '#.....~~~~~~xqqqq~~~~~.......#',
    '#.....~~~~~~qqqqx~~~~~.......#',
    '#.....~~~~~~qqqqq;;;;;.......#',
    '......~~~~~~qqqqq;;;;;.......#',
    '......~~~~~~qqqqq~~~~~.......#',
    '#.x...~~~~~~qqqqq~~~~~......x#',
    '#.....~~~~~~~~~~~~~~~~.......#',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '##############################',
  ],

  // The shaft's own sea, on a clock. LOW: the bar (x 6 to 11, rows 23 and 24) is shingle, the ford
  // (x 17 to 21) is a reef of teeth. HIGH: the bar drowns, the ford runs knee-deep.
  tide: {
    start: 'low',
    clock: { high: 18, low: 18, warn: 3 },
    low: [
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '      qqqqqq     xxxxx        ',
    '      qqqqqq     xxxxx        ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    ],
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 24 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 24, w: 1, h: 2, to: 'soundings_echo_hall', spawn: { x: 41, y: 5 } },
    { x: 29, y: 2, w: 1, h: 2, to: 'soundings_three_wells', spawn: { x: 2, y: 4 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/soundings.txt',
  props: [
    // The three dials: west landing, the rock, east landing.
    { sprite: 'tide_dial', x: 3, y: 21, text: 'stair_dial', tideDial: true },
    { sprite: 'tide_dial', x: 14, y: 22, text: 'stair_dial', tideDial: true },
    { sprite: 'tide_dial', x: 27, y: 21, text: 'stair_dial', tideDial: true },
    { sprite: 'sign', x: 4, y: 20, text: 'stair_sign' },
    // The rope up the cliff to the top.
    { sprite: 'grapple_ring', x: 6, y: 6, grapple: true },
    { sprite: 'sign', x: 8, y: 10, text: 'stair_cliff_sign' },
    // The great sluice: it drains the Echo Hall, far below.
    { sprite: 'c5_sluice_wheel', x: 3, y: 3, text: 'stair_sluice', tideWheel: { to: 'low', group: 'soundings_hall', text: 'stair_sluice_turn', busy: 'stair_sluice_busy' } },
    { sprite: 'sign', x: 5, y: 2, text: 'stair_sluice_sign' },
    { sprite: 'c5_stalactite_drip', x: 18, y: 2, text: 'sound_drip', animation: 'c5_stalactite_drip', speed: 0.5 },
    { sprite: 'c5_stalactite_drip', x: 10, y: 10, text: 'sound_drip', animation: 'c5_stalactite_drip', speed: 0.55 },
    { sprite: 'c5_rope_coil', x: 23, y: 26, text: 'stair_line', walkable: true },
    { sprite: 'gold_pouch', x: 13, y: 25, text: 'stair_pouch', gold: 100, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'sound_rock', W: 'sound_rock', '~': 'stair_water', ';': 'stair_ford', q: 'hall_shingle', x: 'sound_glass', s: 'stair_steps' },

  // A wrackeel in the mid level's pool (row 12, x 15 to 20, deep, and no tide up there) and a
  // moonjelly over the shaft's sea north of the crossing (row 20, x 7 to 11: deep at both tides,
  // three rows off the bar). Both keep clear of the doors, the stair, the rope's foot, the dials,
  // the wheel and every tile the tide changes (rows 23 and 24). No cutscenes in this room.
  npcs: [
    { enemy: 'wrackeel', x: 17, y: 12, patrol: [15, 20], behaviour: 'patrol' },
    { enemy: 'moonjelly', x: 9, y: 20, patrol: [7, 11], behaviour: 'patrol' },
  ],
};
