// THE SOFT BEDS: the inn of Heralds' Rest, promised on the waymarks. Greta
// runs it: a fire, a pot of soup that's never off, and beds made up fresh
// every morning for a hundred years. Sleep in one and your HP comes back
// (and, when there is one, you dream: see DEFAULT_DREAM in overworldScene.js).
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                           h  papered wall with wood panelling (solid)
//   o  wooden floorboards                         r  rug
//   D  doorway (walk through it; see `doors`)
export const REST_INN = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'rest_inn',
  // The room's name, for the Room Editor.
  name: 'THE SOFT BEDS',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'rest',
  // The song that plays here (a file in src/data/music/).
  music: 'rest',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hearth',
  // Indoors: the screen's edges darken, like the Ruins.
  indoors: true,

  tiles: [
    '################',
    '#hhhhhhhhhhhhhh#',
    '#hhhhhhhhhhhhhh#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooorrrrrroooo#',
    '#oooorrrrrroooo#',
    '#oooorrrrrroooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#######DD#######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 7, y: 12 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 7, y: 13, w: 2, h: 1, to: 'rest_square', spawn: { x: 8, y: 7 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/heralds_rest.txt',
  props: [
    // The fire, the soup, and Greta behind the counter.
    { sprite: 'fireplace', x: 6, y: 2, text: 'inn_fire', animation: 'fireplace', speed: 0.18 },
    { sprite: 'counter', x: 11, y: 4, text: 'inn_counter' },
    { sprite: 'herald_inn', x: 12, y: 3, npc: 'herald_greta' },
    { sprite: 'stove_pot', x: 13, y: 2, text: 'inn_soup', gives: 'rest_soup', taken: { sprite: 'stove', text: 'inn_soup_empty' } },
    { sprite: 'bookshelf', x: 2, y: 2, text: 'inn_books' },
    // Beds: sleep in one to rest (HP restored, and a dream when there is one).
    { sprite: 'bed', x: 1, y: 9, text: 'inn_bed', rest: true },
    { sprite: 'bed', x: 1, y: 11, text: 'inn_bed', rest: true },
    { sprite: 'bed', x: 12, y: 9, text: 'inn_bed_made', rest: true },
    { sprite: 'side_table', x: 3, y: 9, text: 'inn_side_table' },
    { sprite: 'table', x: 6, y: 6, text: 'inn_table' },
    { sprite: 'chair', x: 5, y: 6, text: 'inn_chair' },
    { sprite: 'chair', x: 8, y: 6, text: 'inn_chair' },
    { sprite: 'herald', x: 9, y: 4, npc: 'herald_tamsin' },
    { sprite: 'hot_mug', x: 7, y: 5, text: 'inn_mug', gives: 'hot_cocoa', taken: { sprite: 'hot_mug', text: 'inn_mug_empty' } },
    { sprite: 'skis', x: 14, y: 2, text: 'inn_skis' },
    { sprite: 'sign', x: 10, y: 12, text: 'inn_rules' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { r: 'inn_rug', h: 'inn_wall' },

  // No enemies here: the mountain itself is the challenge (see notes/docs/mountain-enemies.md
  // for the ones designed for it).
  npcs: [],
};
