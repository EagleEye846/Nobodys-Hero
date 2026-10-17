// TAPER'S HOME: up the stairs from the Flower Room. Mother Taper's living
// room: a fire, her armchair and books, and her flowers by the wall. The
// kitchen is through the left door, the hallway (and your room) to the right.
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                            h  home wall (solid)
//   o  wooden floor
//   r  rug                                         p  potted plant (solid)
//   F  flower bed (solid)                          D  doorway (walk through it; see `doors`)
//   u  stairs down (walk through it; see `doors`)  C  candle stand (walk or hide behind) (solid)
export const TAPER_HOME = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'taper_home',
  // The room's name, for the Room Editor.
  name: 'TAPER\'S HOME',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'ruins',
  // The song that plays here (a file in src/data/music/).
  music: 'taper',

  tiles: [
    '####################',
    '#hhhhhhhhhhhhhhhhhh#',
    '#hhhhhhhhhhhhhhhhhh#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oooooorrrrrroooooo#',
    '#oooooorrrrrroooooo#',
    'DoooooorrrrrrooooooD',
    'DoooooorrrrrrooooooD',
    '#oooooooooooooooooo#',
    '#ooFFooooooooooCooo#',
    '#oooooooooooooooooo#',
    '#oooooooooooooooooo#',
    '#oopooooooooooooopo#',
    '#########uuu########',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 10, y: 12 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 9, y: 14, w: 3, h: 1, to: 'flower_room', spawn: { x: 10, y: 3 } },
    { x: 0, y: 7, w: 1, h: 2, to: 'taper_kitchen', spawn: { x: 12, y: 6 } },
    { x: 19, y: 7, w: 1, h: 2, to: 'taper_hall', spawn: { x: 2, y: 5 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/taper_home.txt',
  props: [
    { sprite: 'bookshelf', x: 2, y: 3, text: 'home_books' },
    { sprite: 'fireplace', x: 8, y: 3, text: 'home_fireplace', animation: 'fireplace', speed: 0.18 },
    { sprite: 'bookshelf', x: 15, y: 3, text: 'home_books_2' },
    { sprite: 'side_table', x: 6, y: 4, text: 'home_candle' },
    { sprite: 'armchair', x: 12, y: 4, text: 'home_armchair' },
    { sprite: 'taper', x: 2, y: 10, npc: 'mother_taper', animation: 'taper_watering', after: 'meet_taper' },
    { sprite: 'watering_can', x: 5, y: 10, text: 'home_can' },
    { sprite: 'savepoint', x: 16, y: 12, save: true },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { F: 'home_flowers' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between.
  npcs: [],
};
