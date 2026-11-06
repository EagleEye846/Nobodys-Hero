// THE WAY DOWN: the culvert from the dry pocket comes up into a drowned crossroads, the last dry
// stone of the Lanes. A broad stair goes down from the square to the south, step by step into
// the flood, toward Merrow, the town that went under. A save crystal in the square. And a
// cliff lane runs off east along the water. PUZZLE-FREE, and no monsters (a save room).
//
// TEMP until Merrow: Merrow is on hold for the designer's pictures. The stair is roped off at its
// head (the posts and ropes on row 14, marked TEMP below) and the door at its foot is commented
// out in `doors`. When Merrow exists: take the rope props and their sign out and put the door in.
//
// TEMP until Merrow: the bible's temporary link from here to soundings_mouth (so the chapter can
// be played end to end without Merrow) is the east lane's door, along the cliff to the Soundings'
// mouth. When Merrow exists, that link goes (Merrow has its own way into the Soundings), or stays
// as a shortcut: the designer's call.
// Tile key (see src/overworld/coastTiles.js, lanes):
//   #  rock top (solid)   W  mossy stone face (solid)   ,  turf   .  drowned cobbles   :  mud lane
//   s  the stair down   ~  floodwater (solid)   x  barnacle rock   O  boulder   J  gatepost   ^  a pillar

export const LANES_DOWN = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lanes_down',
  // The room's name, for the Room Editor.
  name: 'THE WAY DOWN',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lanes',
  // The Sunken Lanes' song, and the sounds of the place under it.
  music: 'lanes',
  ambience: 'storm_shore',
  vesWell: true,

  tiles: [
    '################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,...........^..........,,,,#',
    '#,,,,......................,x,,#',
    '#,,,,......................,,O,#',
    '#,,,,......................,,,,#',
    '#,,,,......................,,,,#',
    '#####......................:::::',
    '...........................:::::',
    '...........................~~~~#',
    '#####......................~~~~#',
    '#~~~~.J..................J.~~~~#',
    '#~~~~.......#......#.......~~~~#',
    '#~~~~~~~~~~~#ssssss#~~~~~~~~~~~#',
    '#~~~~~~~~~~~#ssssss#~~~~~~~~~~~#',
    '#~~~~~~~~~~~#ssssss#~~~~~~~~~~~#',
    '#~~~~~~~~~~~#~~~~~~#~~~~~~~~~~~#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'lanes_bubble', spawn: { x: 27, y: 9 } },
    // TEMP until Merrow: the stair's foot, into Merrow's first room (the id is the Merrow builder's).
    // { x: 13, y: 16, w: 6, h: 1, to: 'merrow_<first room>', spawn: { x: ?, y: ? } },
    // TEMP until Merrow: the bible's temporary link on to the Soundings, along the cliff lane.
    { x: 31, y: 8, w: 1, h: 2, to: 'soundings_mouth', spawn: { x: 2, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lanes.txt',
  props: [
    { sprite: 'savepoint', x: 8, y: 5, save: true },
    // The stair down, drawn over its 's' tiles and the '#' parapets either side (flat, walkable).
    { sprite: 'ln_stair', x: 12, y: 17, text: 'down_stair', flat: true, walkable: true },
    { sprite: 'street_lamp', x: 11, y: 12, text: 'fork_lamp' },
    { sprite: 'street_lamp', x: 20, y: 12, text: 'fork_lamp' },
    { sprite: 'street_lamp', x: 26, y: 7, text: 'fork_lamp' },
    { sprite: 'ln_signpost', x: 22, y: 5, text: 'down_signpost' },
    { sprite: 'c5_church_wall', x: 4, y: 2, text: 'down_wall' },
    { sprite: 'c5_buoy_yellow', x: 3, y: 6, text: 'fork_buoy' },
    { sprite: 'gold_pouch', x: 29, y: 3, text: 'down_pouch', gold: 60, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // TEMP until Merrow: a rope across the head of the stair, on two posts, and a sign.
    { sprite: 'sy_rope_post', x: 13, y: 14, text: 'down_stair_rope' },
    { sprite: 'sy_rope_h', x: 14, y: 14, text: 'down_stair_rope' },
    { sprite: 'sy_rope_h', x: 15, y: 14, text: 'down_stair_rope' },
    { sprite: 'sy_rope_h', x: 16, y: 14, text: 'down_stair_rope' },
    { sprite: 'sy_rope_h', x: 17, y: 14, text: 'down_stair_rope' },
    { sprite: 'sy_rope_post', x: 18, y: 14, text: 'down_stair_rope' },
    { sprite: 'sign', x: 14, y: 13, text: 'down_stair_sign' },
    // TEMP until Merrow: the sign for the cliff lane on to the Soundings.
    { sprite: 'sign', x: 28, y: 7, text: 'down_east_sign' },
  ],
  tileTexts: { '#': 'lanes_rock', W: 'lanes_rock', '~': 'down_flood', s: 'down_stair', x: 'lanes_stone', O: 'lanes_stone', J: 'fork_gatepost', '^': 'hamlet_pillar' },

  // None: a save room.
  npcs: [],
};
