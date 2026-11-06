// THE DROWNED HAMLET: a handful of cottages and half a church, where the lanes met. The church's
// west half still stands, pillars and all, with its pointed windows; the east half has gone into
// the flood, and the water laps at the altar step. South of the green, the lanes run on under the
// water between hedges you can still see the tops of. A FIGHT ROOM, with no puzzle: the way on
// is up onto the old churchyard terrace in the north-east, with the Climbing Rope (a ring at the
// top of the terrace wall, 38,9; throw from 38,13). And in the north-west corner, a second ring
// (5,4) hauls you up a bank to a cottage's attic window: the way into secret_lanes_attic.
// Tile key (see src/overworld/coastTiles.js, lanes):
//   #  rock top (solid)   W  mossy stone (solid)   ,  turf   .  drowned cobbles   :  mud lane
//   ;  shallows (walk)   ~  floodwater (solid)   Z  weed-tangled hedge (solid)   x  rubble
//   ^  a church pillar (solid)   J  a drowned gatepost   O  boulder   5 6  a cottage's gable

export const LANES_HAMLET = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lanes_hamlet',
  // The room's name, for the Room Editor.
  name: 'THE DROWNED HAMLET',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lanes',
  // The Sunken Lanes' song, and the sounds of the place under it.
  music: 'lanes',
  ambience: 'storm_shore',
  vesWell: true,
  // No ships' masts on the skyline here: the water in the nave is a church's, not the sea's.
  skyline: false,

  tiles: [
    '############################################',
    '#WW56::65WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#,,,,,,,,,,#,,,WWWWWWWWxxxxxx~~~~~#,,,,,,,,#',
    '#,,,,,,,,,,#,,,W........~~~~~~~~~~#,,,,,,,,#',
    '#,,,,,,,,,,#,,,W........~~~~~~~~~~#:::::::::',
    '############,,,W...^....~~~~~~~~~~#:::::::::',
    '#WWWWWWWWWW#,,,.........~~~~~~~~~~#,,,,,,,,#',
    '#WWWWWWWWWW#,,,W.........x~~~~~~~~#,,,,,,,,#',
    '#,,,,,,,,x,,,,,W...^......~~~;;;;;#,,,,,,,,#',
    '#,,,,,,,,,,,,,,...........;;;;;;;;#,,,,,,,,#',
    '..............,,,,,,,,,,,,,,,~~~~~##########',
    '..............,,,,,,,,,,,,,,,~~~~~#WWWWWWWW#',
    '#,,,,,,,,,,,..,,ZZZZZ,ZZZZ,,,,,,,,#WWWWWWWW#',
    '#ZZZZ,ZZZZZ,..,,,,,,,,,,,,,,,,,J,,,,.....,,#',
    '#,,,,,,,,,,,..............................,#',
    '#,O,,,,,,,,,..............................,#',
    '#,,,,,,,,,,,,,,,,,,,;;;;;;;;;;;;,,,,;;;;;;,#',
    '#~~~~~;;;;;;;;~~~~~~;;;;;;;;;;;;~~~~~~~~~~~#',
    '#~~~~~;;;;;;;;~~~~~~;;;;;;;;;;;;~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~;;;;;;~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '############################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 10, w: 1, h: 2, to: 'lanes_sluices', spawn: { x: 37, y: 8 } },
    { x: 43, y: 4, w: 1, h: 2, to: 'lanes_mill', spawn: { x: 2, y: 4 } },
    { x: 5, y: 1, w: 2, h: 1, to: 'secret_lanes_attic', spawn: { x: 6, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lanes.txt',
  props: [
    // The two rings: up the churchyard terrace (the way on), and up the bank to the attic (the secret).
    { sprite: 'grapple_ring', x: 38, y: 9, grapple: true },
    { sprite: 'grapple_ring', x: 5, y: 4, grapple: true },
    // Half a church: the two standing stretches of its north wall, with their windows.
    { sprite: 'c5_church_wall', x: 16, y: 3, text: 'hamlet_church_wall' },
    { sprite: 'c5_church_wall', x: 20, y: 3, text: 'hamlet_church_window' },
    { sprite: 'sign', x: 37, y: 14, text: 'hamlet_terrace_sign' },
    { sprite: 'sign', x: 3, y: 9, text: 'hamlet_sign' },
    { sprite: 'street_lamp', x: 14, y: 12, text: 'fork_lamp' },
    { sprite: 'street_lamp', x: 33, y: 13, text: 'fork_lamp' },
    { sprite: 'street_lamp', x: 39, y: 6, text: 'fork_lamp' },
    // The cottages in the flood, a drowned signpost, a font, and the green's odds and ends.
    { sprite: 'c5_halfsunk_cottage', x: 2, y: 19, text: 'hamlet_cottage' },
    { sprite: 'c5_halfsunk_cottage', x: 34, y: 18, text: 'hamlet_cottage' },
    { sprite: 'c5_drowned_signpost', x: 25, y: 19, text: 'hamlet_signpost' },
    { sprite: 'c5_barrel', x: 17, y: 9, text: 'hamlet_font' },
    { sprite: 'c5_lobster_pots', x: 40, y: 15, text: 'hamlet_pots' },
    { sprite: 'c5_seaweed_heap', x: 8, y: 3, text: 'fork_weed' },
    { sprite: 'gold_pouch', x: 32, y: 8, text: 'hamlet_pouch', gold: 90, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'lanes_rock', W: 'lanes_rock', '~': 'hamlet_flood', ';': 'fork_shallows', Z: 'lanes_hedge', x: 'hamlet_rubble', '^': 'hamlet_pillar', J: 'fork_gatepost', O: 'lanes_stone', 5: 'hamlet_gable', 6: 'hamlet_gable' },

  // A TRIO on the green (it's the fight room): a shellac (row 15, x 20 to 23), a net wraith drifting
  // about beside it (x 21 to 23, home row 15) and a bellbuoy bobbing in the drowned lane just south
  // (row 17, x 21 to 23, shallows). Touch the shellac and the other two come in with it. None comes
  // near a door, the rope's foot (38,13), the attic ring's foot (5,8) or the purse in the church
  // shallows. No cutscenes in this room.
  npcs: [
    { enemy: 'shellac', x: 21, y: 15, patrol: [20, 23], behaviour: 'patrol' },
    { enemy: 'net_wraith', x: 22, y: 15, patrol: [21, 23], behaviour: 'wander' },
    { enemy: 'bellbuoy', x: 22, y: 17, patrol: [21, 23], behaviour: 'patrol' },
  ],
};
