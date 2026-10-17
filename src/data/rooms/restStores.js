// REST STORES: the village shop, kept by Fennick, who has been stocktaking for
// a hundred years and has it down to the last button. Talk to him to shop
// (src/data/shops.js: rest_stores).
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                           h  papered wall with wood panelling (solid)
//   o  wooden floorboards                         D  doorway (walk through it; see `doors`)
export const REST_STORES = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'rest_stores',
  // The room's name, for the Room Editor.
  name: 'REST STORES',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'rest',
  // The song that plays here (a file in src/data/music/).
  music: 'rest',
  // Indoors.
  indoors: true,

  tiles: [
    '##############',
    '#hhhhhhhhhhhh#',
    '#hhhhhhhhhhhh#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '######DD######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 6, y: 11, w: 2, h: 1, to: 'rest_square', spawn: { x: 34, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/heralds_rest.txt',
  props: [
    { sprite: 'counter', x: 5, y: 5, text: 'stores_counter' },
    { sprite: 'counter', x: 6, y: 5, text: 'stores_counter' },
    { sprite: 'counter', x: 7, y: 5, text: 'stores_counter' },
    // Fennick, behind the counter: talk to him to shop.
    { sprite: 'herald_shop', x: 6, y: 4, shop: 'rest_stores' },
    { sprite: 'bookshelf', x: 1, y: 2, text: 'stores_shelves' },
    { sprite: 'bookshelf', x: 10, y: 2, text: 'stores_shelves' },
    { sprite: 'crates', x: 1, y: 8, text: 'stores_crates' },
    { sprite: 'crates', x: 2, y: 9, text: 'stores_crates' },
    { sprite: 'barrel', x: 11, y: 8, text: 'stores_barrel' },
    { sprite: 'barrel', x: 12, y: 9, text: 'stores_barrel' },
    { sprite: 'skis', x: 12, y: 2, text: 'stores_skis' },
    { sprite: 'sign', x: 3, y: 4, text: 'stores_sign' },
    { sprite: 'trumpet_stand', x: 9, y: 4, text: 'stores_trumpet' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { h: 'stores_wall' },

  // No enemies here: the mountain itself is the challenge (see docs/mountain-enemies.md
  // for the ones designed for it).
  npcs: [],
};
