// THE FORK: the first of the Sunken Lanes, down off Saltcombe's lookout. A muddy lane between
// weed-choked hedges comes to a fork under a leaning signpost. The north-east lane goes on,
// dry for now, toward the causeway; the south-east lane walks straight into the floodwater
// and keeps going underneath it, hedges and all, the way every road here used to. A cottage
// stands up to its windows in the flood. PUZZLE-FREE, and no monsters (an area's first room).
// Tile key (see src/overworld/coastTiles.js, lanes):
//   #  rock top (solid)   W  mossy stone face (solid)   ,  turf   :  mud lane   .  drowned cobbles
//   ;  shallows (walk)   ~  floodwater (solid)   Z  weed-tangled hedge (solid)   x  barnacle rock
//   J  a drowned gatepost (solid)

export const LANES_FORK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lanes_fork',
  // The room's name, for the Room Editor.
  name: 'THE FORK',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lanes',
  // The Sunken Lanes' song (src/data/music/lanesTheme.js), and the sounds of the place under it.
  music: 'lanes',
  ambience: 'storm_shore',
  vesWell: true,

  tiles: [
    '########################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#,,,,,,,,,,,,,,,,,,Z,,,,,x,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,Z,,,,,x,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,::::::::::::::::::::::::',
    '#,,,,,,,,,,,,,,,::::::::::::::::::::::::',
    '#ZZZZZ,ZZZZZZZZ,::,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,::,ZZZZZZZZZZZ,ZZZZZZZZ#',
    '::::::::::::::::::,,,,,,,,,,,,,,,,,,,,,#',
    '::::::::::::::::::,,,,;;;;;;;;;;;;;;;;;#',
    '#,,,,,,,,,,,,...::,,,;~~~~~~~~~~~~~~~~~#',
    '#ZZZZZZZZ,ZZZ...::,,,;~~~~~~~~~x~~~~~~~#',
    '#,,,,,,,,,,,,,,,:::::;~;;;;~~~~~~~~~~~~#',
    '#,,,,,,,,,,,,,,,:::::;~;;;;~~~~~~~x~~~~#',
    '#,,,,,,,,,,,,,,,,,,,,;~~~~~~J~~~~~~~~~~#',
    '#,,,,,,,,,,,,,,,,,,,,;~~~~~~~~~~~~~~~~~#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '########################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // West, back up the cliff path to Saltcombe's lookout (its east door is x 35, rows 9-11).
    { x: 0, y: 8, w: 1, h: 2, to: 'saltcombe_lookout', spawn: { x: 34, y: 10 } },
    { x: 39, y: 4, w: 1, h: 2, to: 'lanes_causeway', spawn: { x: 2, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lanes.txt',
  props: [
    // The signpost at the fork, a lamp on its post, the cottage in the flood, and the lane's odds and ends.
    { sprite: 'ln_signpost', x: 18, y: 8, text: 'fork_signpost' },
    { sprite: 'street_lamp', x: 15, y: 7, text: 'fork_lamp' },
    { sprite: 'c5_halfsunk_cottage', x: 33, y: 11, text: 'fork_cottage' },
    { sprite: 'sign', x: 3, y: 7, text: 'fork_sign' },
    { sprite: 'c5_buoy_red', x: 20, y: 14, text: 'fork_buoy' },
    { sprite: 'c5_barrel', x: 13, y: 10, text: 'fork_barrel' },
    { sprite: 'c5_seaweed_heap', x: 10, y: 14, text: 'fork_weed' },
    { sprite: 'gold_pouch', x: 2, y: 3, text: 'fork_pouch', gold: 60, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'lanes_rock', W: 'lanes_rock', '~': 'fork_flood', ';': 'fork_shallows', Z: 'lanes_hedge', x: 'lanes_stone', J: 'fork_gatepost' },

  // None: the first room of the Lanes.
  npcs: [],
};
