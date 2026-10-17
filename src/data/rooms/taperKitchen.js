// TAPER'S KITCHEN: through the left door of her home. A cold stove (she never
// cooks with fire), a cake for her guest, and a table set for two.
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                            h  home wall (solid)
//   o  wooden floor                                p  potted plant (solid)
//   D  doorway (walk through it; see `doors`)
export const TAPER_KITCHEN = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'taper_kitchen',
  // The room's name, for the Room Editor.
  name: 'TAPER\'S KITCHEN',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'ruins',
  // The song that plays here (a file in src/data/music/).
  music: 'taper',

  tiles: [
    '##############',
    '#hhhhhhhhhhhh#',
    '#hhhhhhhhhhhh#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#ooooooooooooD',
    '#ooooooooooooD',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#opoooooooooo#',
    '##############',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 11, y: 6 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 13, y: 5, w: 1, h: 2, to: 'taper_home', spawn: { x: 1, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/taper_home.txt',
  props: [
    { sprite: 'counter', x: 2, y: 3, text: 'kitchen_counter' },
    { sprite: 'stove', x: 3, y: 3, text: 'kitchen_stove' },
    { sprite: 'counter_cake', x: 4, y: 3, text: 'kitchen_cake', gives: 'candle_cake', taken: { sprite: 'counter', text: 'kitchen_cake_gone' } },
    { sprite: 'counter', x: 5, y: 3, text: 'kitchen_counter' },
    { sprite: 'chair', x: 4, y: 7, text: 'kitchen_chair' },
    { sprite: 'table', x: 5, y: 7, text: 'kitchen_table' },
    { sprite: 'chair', x: 7, y: 7, text: 'kitchen_chair' },
  ],

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between.
  npcs: [],
};
