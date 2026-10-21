// THE POTTLES': home of Pottle, the smallest and loudest herald, and his
// mother, who has baked a welcome cake every single week for a hundred years
// and has, by now, really got the recipe right.
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                           h  papered wall with wood panelling (solid)
//   o  wooden floorboards                         r  rug
//   D  doorway (walk through it; see `doors`)
export const REST_HOUSE_POTTLE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'rest_house_pottle',
  // The room's name, for the Room Editor.
  name: 'THE POTTLES\'',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'rest',
  // The song that plays here (a file in src/data/music/).
  music: 'rest',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hearth',
  // Indoors.
  indoors: true,

  tiles: [
    '##############',
    '#hhhhhhhhhhhh#',
    '#hhhhhhhhhhhh#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooorrrroooo#',
    '#oooorrrroooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '######DD######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 6, y: 9, w: 2, h: 1, to: 'rest_square', spawn: { x: 31, y: 25 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/heralds_rest.txt',
  props: [
    { sprite: 'stove', x: 2, y: 2, text: 'pottle_stove' },
    { sprite: 'counter', x: 3, y: 2, text: 'pottle_counter' },
    { sprite: 'counter_cake', x: 4, y: 2, text: 'pottle_cake', gives: 'herald_honeycake', taken: { sprite: 'counter', text: 'pottle_cake_gone' } },
    { sprite: 'table', x: 5, y: 5, text: 'pottle_table' },
    { sprite: 'chair', x: 4, y: 5, text: 'pottle_chair' },
    { sprite: 'chair', x: 7, y: 5, text: 'pottle_chair' },
    { sprite: 'bed', x: 10, y: 3, text: 'pottle_bed_big' },
    { sprite: 'bed', x: 10, y: 6, text: 'pottle_bed_small' },
    { sprite: 'toy_chest', x: 12, y: 8, text: 'pottle_toys' },
    { sprite: 'mirror', x: 8, y: 2, text: 'pottle_drawings' },
    { sprite: 'herald', x: 2, y: 6, npc: 'herald_mrs_pottle' },
    { sprite: 'book_stand', x: 1, y: 8, text: 'pottle_book' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { r: 'pottle_rug', h: 'pottle_wall' },

  // No enemies here: the mountain itself is the challenge (see notes/docs/mountain-enemies.md
  // for the ones designed for it).
  npcs: [],
};
