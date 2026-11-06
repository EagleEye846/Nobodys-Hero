// THE SLUICES: an old sluice house on a stone quay in the middle of a flooded basin, and the
// wheels that let the water out or in. No clock here: the water stays where you set it. West of
// the quay the basin drains to a bed of mud (with a drowned cottage's footings in it); east of
// the quay is a deep pool held back by an old weir. At LOW water the weir's crest stands out of
// the pool in a row of broken teeth you can't get over; at HIGH water it's a knee-deep ford.
// So: DRAIN from the west bank and walk the bed to the quay; FILL from the quay and wade the
// weir to the east bank. Each wheel only turns one way (the sign on it says which), and there
// is one at each place you can be stranded: the west bank drains, the quay does both, the
// east bank fills.
// Tile key (see src/overworld/coastTiles.js, lanes):
//   #  rock top (solid)   W  mossy stone face (solid)   ,  turf   .  drowned cobbles   :  mud
//   ;  shallows / ford (walk)   ~  floodwater (solid)   x  barnacle rock (the weir's teeth)
//   h  the sluice house wall (solid)   I  a post   O  boulder   F  weed

export const LANES_SLUICES = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lanes_sluices',
  // The room's name, for the Room Editor.
  name: 'THE SLUICES',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lanes',
  // The Sunken Lanes' song, and the sounds of the place under it.
  music: 'lanes',
  ambience: 'storm_shore',
  vesWell: true,

  // The HIGH-water map.
  tiles: [
    '########################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#,,,,,~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,,,,#',
    '#,F,,,~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,x,,#',
    '#,,,,,~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,,,,#',
    '#,,,,,~~~~~~~~~~IhhhhhhI~~~~~~~~~~,,,,,#',
    '#,,,,,~~~~~~~~~~........~~~~~~~~~~,,,,,#',
    '#,,,,,~~~~~~~~~~........~~~~~~~~~~,,,,,#',
    '......~~~~~~~~~~........;;;;;;;;;;......',
    '......~~~~~~~~~~........;;;;;;;;;;......',
    '#,,,,,~~~~~~~~~~........~~~~~~~~~~,,,,,#',
    '#,,,,,~~~~~~~~~~........~~~~~~~~~~,,,,,#',
    '#,,,,,~~~~~~~~~~........~~~~~~~~~~,,,,,#',
    '#,,,,,~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,,,,#',
    '#,,,,,~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,,O,#',
    '#,,,,,~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,,,,#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '########################################',
  ],

  // The water the wheels set. At LOW the west basin (x 6 to 15) and the mud round the quay's
  // north and south ends (x 16 to 23) are a bed you can walk; the weir (x 24 to 33, rows 8 and
  // 9) is rock; the east pool stays deep (so it can't be got round). The banks and the quay are
  // dry at both levels. Saved with the room.
  tide: {
    start: 'high',
    low: [
    '                                        ',
    '                                        ',
    '      ::::::::::::::::::                ',
    '      ::::::::::::;:::::                ',
    '      :;;:::::::::::::::                ',
    '      ::::::::::                        ',
    '      ::::::::::                        ',
    '      ::::::::::                        ',
    '      ::::::::::        xxxxxxxxxx      ',
    '      ::::::::::        xxxxxxxxxx      ',
    '      ::::::::::                        ',
    '      ::::::::::                        ',
    '      ::xxx:::::                        ',
    '      :::::::;::::::::::                ',
    '      ::x:x::::::::;;:::                ',
    '      ::::::::::::::::::                ',
    '                                        ',
    '                                        ',
    ],
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'lanes_causeway', spawn: { x: 37, y: 8 } },
    { x: 39, y: 8, w: 1, h: 2, to: 'lanes_hamlet', spawn: { x: 2, y: 10 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lanes.txt',
  props: [
    // The wheels: DRAIN on the west bank, DRAIN and FILL on the quay, FILL on the east bank.
    { sprite: 'c5_sluice_wheel', x: 4, y: 6, text: 'sluice_drain', tideWheel: { to: 'low', text: 'sluice_drain_turn', already: 'sluice_drain_already', busy: 'sluice_busy' } },
    { sprite: 'c5_sluice_wheel', x: 18, y: 6, text: 'sluice_drain', tideWheel: { to: 'low', text: 'sluice_drain_turn', already: 'sluice_drain_already', busy: 'sluice_busy' } },
    { sprite: 'c5_sluice_wheel', x: 21, y: 6, text: 'sluice_fill', tideWheel: { to: 'high', text: 'sluice_fill_turn', already: 'sluice_fill_already', busy: 'sluice_busy' } },
    { sprite: 'c5_sluice_wheel', x: 35, y: 6, text: 'sluice_fill', tideWheel: { to: 'high', text: 'sluice_fill_turn', already: 'sluice_fill_already', busy: 'sluice_busy' } },
    { sprite: 'sign', x: 3, y: 10, text: 'sluice_sign' },
    { sprite: 'sluice_gate', x: 20, y: 5, text: 'sluice_house' },
    // The drowned cottage's footings out on the bed, with a purse in what was the kitchen.
    { sprite: 'gold_pouch', x: 9, y: 13, text: 'sluice_pouch', gold: 90, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_buoys_pile', x: 2, y: 14, text: 'sluice_buoys' },
    { sprite: 'c5_rope_coil', x: 22, y: 11, text: 'sluice_rope', walkable: true },
    { sprite: 'street_lamp', x: 17, y: 11, text: 'fork_lamp' },
    { sprite: 'street_lamp', x: 36, y: 10, text: 'fork_lamp' },
  ],
  tileTexts: { '#': 'lanes_rock', W: 'lanes_rock', '~': 'sluice_water', ';': 'sluice_ford', x: 'sluice_teeth', h: 'sluice_house', I: 'sluice_post', O: 'lanes_stone', F: 'fork_weed' },

  // A wrackeel in the east pool (row 11, x 24 to 30: deep at both levels, it swims up to the
  // quay's south-east corner and back, never onto the weir on rows 8 and 9), and a bellbuoy
  // bobbing along the east bank's south end (row 13, x 34 to 38: dry at both levels, well clear
  // of the door and the FILL wheel). Nothing on the bed or the quay. No cutscenes here.
  npcs: [
    { enemy: 'wrackeel', x: 27, y: 11, patrol: [24, 30], behaviour: 'patrol' },
    { enemy: 'bellbuoy', x: 36, y: 13, patrol: [34, 38], behaviour: 'patrol' },
  ],
};
