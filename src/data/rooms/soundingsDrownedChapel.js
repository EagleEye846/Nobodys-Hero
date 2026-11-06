// THE DROWNED CHAPEL: the sounders' chapel, cut into the rock under the Echo Hall, where they
// prayed for calm water before going down. The sea got in long ago. From the gallery at the door
// you look over a flooded nave, pews standing in the black water, to the altar and the stair down
// behind it. The chapel's own sluice is seized; its rod goes up through the roof toward the Three
// Wells, and the sluice wheel there drains it (`group: 'soundings_chapel'`, LOW). At LOW the nave
// floor comes up between the pillars and you walk to the dais: the chest with the GLASS-FLOAT
// STAFF in the west side chapel, the altar, and the stair down to the Weight Room. The aisles stay
// deep at both tides. Indoors (the cave's inside look, no rain).
// Tile key (see src/overworld/coastTiles.js, soundings):
//   #  rock top (solid)   W  cave rock face (solid)   X  flagstones   ;  a puddle   ~  water (solid)
//   I  a pillar   x  glowing sea-glass (solid)   s  the stair down

export const SOUNDINGS_DROWNED_CHAPEL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'soundings_drowned_chapel',
  // The room's name, for the Room Editor.
  name: 'THE DROWNED CHAPEL',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'soundings',
  indoors: true,
  // The Soundings' song ("The Soundings"), and the sounds of a sea cave under it.
  music: 'soundings',
  ambience: 'sea_cave',
  vesWell: true,

  // The HIGH-water map.
  tiles: [
    '################XX################',
    '#WWWWWWWWWWWWWWWXXWWWWWWWWWWWWWWW#',
    '#xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx#',
    '#XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX#',
    '#XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX#',
    '#XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~I~~~~~~~~~~~~~~~~~~~~I~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~I~~~~~~~~~~~~~~~~~~~~I~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~I~~~~~~~~~~~~~~~~~~~~I~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX#',
    '#XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX#',
    '#XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX#',
    '#xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx#',
    'WWWWWWWWWWWWWWWWssWWWWWWWWWWWWWWWW',
    '################ss################',
  ],

  // Set from the Three Wells' sluice; nothing here turns it. LOW: the nave (x 7 to 26, rows 6 to
  // 15) is a floor. The aisles, the gallery and the dais don't change.
  tide: {
    group: 'soundings_chapel',
    start: 'high',
    low: [
    '                                  ',
    '                                  ',
    '                                  ',
    '                                  ',
    '                                  ',
    '                                  ',
    '       XXXXXXXXXXXXXXXXXXXX       ',
    '       XXXXXXXXXXXXXXXXXXXX       ',
    '       XXX;;XXXXXXXXXXXXXXX       ',
    '       XXXXXXXXXXXX;XXXXXXX       ',
    '       XXXXXXXXXXXXXXXXXXXX       ',
    '       XXXXXXXXXXXXXXXXXXXX       ',
    '       XXXXXXXXXXXXXXX;XXXX       ',
    '       XXXXXXXXXXXXXXXXXXXX       ',
    '       XXXXXXX;XXXXXXXXXXXX       ',
    '       XXXXXXXXXXXXXXXXXXXX       ',
    '                                  ',
    '                                  ',
    '                                  ',
    '                                  ',
    '                                  ',
    '                                  ',
    ],
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 16, y: 2 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 16, y: 0, w: 2, h: 1, to: 'soundings_echo_hall', spawn: { x: 21, y: 21 } },
    { x: 16, y: 21, w: 2, h: 1, to: 'soundings_weight_room', spawn: { x: 4, y: 2 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/soundings.txt',
  props: [
    { sprite: 'c5_sluice_wheel', x: 4, y: 3, text: 'chapel_wheel' },
    { sprite: 'tide_dial', x: 29, y: 3, text: 'hall_dial', tideDial: true },
    { sprite: 'sign', x: 13, y: 2, text: 'chapel_board' },
    // Pews standing in the deep aisles.
    { sprite: 'c5_chapel_pews', x: 1, y: 8, text: 'chapel_pews', animation: 'c5_chapel_pews', speed: 0.5 },
    { sprite: 'c5_chapel_pews', x: 1, y: 12, text: 'chapel_pews', animation: 'c5_chapel_pews', speed: 0.55 },
    { sprite: 'c5_chapel_pews', x: 29, y: 8, text: 'chapel_pews', animation: 'c5_chapel_pews', speed: 0.5 },
    { sprite: 'c5_chapel_pews', x: 29, y: 12, text: 'chapel_pews', animation: 'c5_chapel_pews', speed: 0.45 },
    // The dais: the altar, the chest, a purse.
    { sprite: 'chapel_altar', x: 15, y: 17, text: 'chapel_altar' },
    { sprite: 'c5_chest', x: 3, y: 17, text: 'chapel_chest', gives: 'glass_float_staff', taken: { sprite: 'c5_chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 30, y: 18, text: 'chapel_pouch', gold: 120, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_stalactite_drip', x: 10, y: 2, text: 'sound_drip', animation: 'c5_stalactite_drip', speed: 0.5 },
    { sprite: 'c5_stalactite_drip', x: 23, y: 2, text: 'sound_drip', animation: 'c5_stalactite_drip', speed: 0.6 },
  ],
  tileTexts: { '#': 'sound_rock', W: 'sound_rock', '~': 'chapel_water', X: 'chapel_floor', ';': 'hall_puddle', I: 'chapel_pillar', x: 'sound_glass', s: 'chapel_stair' },

  // A PAIR at the dais's east end: a net wraith (row 17, x 26 to 28) and a wrackeel in the east
  // aisle just north of it (row 15, x 27 to 29: deep at both tides), close enough to fight together.
  // Clear of the chest (3,17), the altar (15 to 17), the stair (16 and 17), the purse (30,18) and
  // every tile the tide changes (the nave, x 7 to 26). No cutscenes here.
  npcs: [
    { enemy: 'net_wraith', x: 27, y: 17, patrol: [26, 28], behaviour: 'patrol' },
    { enemy: 'wrackeel', x: 28, y: 15, patrol: [27, 29], behaviour: 'patrol' },
  ],
};
