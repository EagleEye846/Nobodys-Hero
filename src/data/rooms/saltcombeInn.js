// THE DROWNED RAT: Saltcombe's inn, low-beamed and warm, the rain loud on the
// roof and louder in the gutters. A fire, a long counter with the innkeeper
// (a fat brown rat with a towel on his shoulder) polishing the same tankard,
// tables of fishers, a SAVE point. Haddock is sitting by the fire.
//
// Coming in plays haddock_hums: Haddock, on a crate by the fire, hums a
// lullaby with his eyes shut. It's Corrie's tune (corrieLullaby); he never
// says so, and nobody asks twice. Then he mentions the lagoon: the lad's
// going to learn to swim. Bramble is not keen.
//
// Trail 3: in the corner under the stair, a tiny bunk, the rail notched in
// neat fives (the same hand as the tallies in the Deep). One short line, and
// nobody explains it.
//
// Puzzle-free. No monsters (an inn). Haddock is here until haddock_hums;
// then he's gone ahead to the lagoon, and only his mug is left.
// Tile key (see src/overworld/coastTiles.js, saltcombe, indoors):
//   #  wall top (solid)   h  board wall (solid)   o  floor boards

export const SALTCOMBE_INN = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'saltcombe_inn',
  // The room's name, for the Room Editor.
  name: 'THE DROWNED RAT',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'saltcombe',
  // "Salt and Rope", with the rain on the roof, the room's talk and the fire.
  music: 'saltcombe',
  ambience: 'stilt_inside',
  vesWell: true,
  indoors: true,

  tiles: [
    '####################',
    'hhhhhhhhhhhhhhhhhhhh',
    'hhhhhhhhhhhhhhhhhhhh',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '########oo##########',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 8, y: 12 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 8, y: 13, w: 2, h: 1, to: 'saltcombe_quay', spawn: { x: 15, y: 6 } },
  ],

  // Haddock hums by the fire as you come in (he sits at 5..6, row 4; the scene's
  // walk is from the door up to row 7, clear of the tables).
  cutscenes: [{ x: 7, y: 10, w: 4, h: 3, scene: 'haddock_hums' }],

  // The fire, Haddock on his crate, the counter, tables, the bunk, the SAVE point.
  textFile: 'interactions/saltcombe.txt',
  props: [
    { sprite: 'fireplace', x: 2, y: 3, text: 'inn_fire' },
    { sprite: 'cf_haddock_sit', x: 5, y: 4, npc: 'haddock_inn', animation: 'cf_haddock_sit', speed: 0.6, until: 'haddock_hums' },
    { sprite: 'hot_mug', x: 5, y: 4, text: 'inn_haddock_mug', after: 'haddock_hums' },
    { sprite: 'cf_rat_innkeeper', x: 14, y: 3, npc: 'rat_innkeeper', animation: 'cf_rat_innkeeper', speed: 0.5 },
    { sprite: 'counter', x: 13, y: 4, npc: 'rat_innkeeper' },
    { sprite: 'counter', x: 14, y: 4, npc: 'rat_innkeeper' },
    { sprite: 'counter', x: 15, y: 4, npc: 'rat_innkeeper' },
    { sprite: 'c5_barrels', x: 17, y: 3, text: 'inn_casks' },
    { sprite: 'table', x: 9, y: 6, text: 'inn_table' },
    { sprite: 'chair', x: 8, y: 6, text: 'inn_chair' },
    { sprite: 'table', x: 13, y: 8, text: 'inn_table_b' },
    { sprite: 'cf_fisher_b', x: 11, y: 6, text: 'inn_fisher_b', animation: 'cf_fisher_b', speed: 0.5 },
    { sprite: 'cf_fisher_c', x: 15, y: 8, text: 'inn_fisher_c', animation: 'cf_fisher_c', speed: 0.55 },
    { sprite: 'c5_rope_coil', x: 2, y: 8, text: 'inn_rope', walkable: true },
    // Trail 3: the child's bunk in the corner, the rail notched in fives.
    { sprite: 'sc_bunk_tally', x: 16, y: 11, text: 'inn_bunk' },
    { sprite: 'bed', x: 16, y: 6, text: 'inn_bunks' },
    { sprite: 'savepoint', x: 2, y: 11, save: true },
  ],
  tileTexts: { h: 'inn_wall' },

  // None: an inn.
  npcs: [
  ],
};
