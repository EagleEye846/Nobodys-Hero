// THE LAST SHELF: a quiet shelf of snow just below the summit, out of the
// worst of the wind, where Hollis, an old snowy owl, keeps a stall for
// whoever makes it this far (shop 'owl_stall' in src/data/shops.js). A save
// point, a green updraft, and the last of the great stair, going on up to
// the top.
// Tile key (see src/overworld/tileset.js):
//   E  ice-veined cliff face (solid)              A  snowy cliff top (solid)
//   n  snow                                       i  trodden snow path
//   s  the great stair                            Y  snow pine (solid)
//   Q  snowy boulder (solid)                      _  open sky (solid)
export const VIGIL_OWL_SHELF = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'vigil_owl_shelf',
  // The room's name, for the Room Editor.
  name: "THE LAST SHELF",
  // The region it's in (see src/data/areas.js).
  area: 'vigil',
  music: 'vigil',
  ambience: 'summit',
  vista: { altitude: 1.0, heading: 0.1 },
  snowy: true,
  weather: 'flurry',
  wind: 0.8,

  tiles: [
    'EEEEEEEEEEEEsssEEEEEEEEEEEEE',
    'EEEEEEEEEEEEsssEEEEEEEEEEEEE',
    'EEEEEEEEEEEEsssEEEEEEEEEEEEE',
    '_nnnnnnnnnnnsssnnnnnnnnnnnn_',
    '_nYnnnnnnnnnninnnnnnnnnnnYn_',
    '_nnnnnnnnnnnninnnnnnnnnnnnn_',
    '_nnnnnnnnnnnninnnnnnnnnnnnn_',
    '_nnnnnnnnnnnninnnnnnnnnnnnn_',
    '_nnnnnnnnnnnninnnnnnnnnnnnn_',
    '_nnnnQnnnnnnninnnnnnnnnnnnn_',
    '_nnnnnnnnnnnninnnnnnnnnnnnn_',
    '_nnQnnnnnnnnninnnnnnnnnnQnn_',
    '__nnnnnnnnnnninnnnnnnnnnnn__',
    '___nnnnnnnnnninnnnnnnnnnn___',
    '____AAAAAAAAsssAAAAAAAAA____',
    '____EEEEEEEEsssEEEEEEEEE____',
    '____EEEEEEEEsssEEEEEEEEE____',
    '____EEEEEEEEsssEEEEEEEEE____',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 13, y: 12 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Back down to the Spire's Neck.
    { x: 12, y: 17, w: 3, h: 1, to: 'vigil_spire_neck', spawn: { x: 27, y: 7 } },
    // Up to the summit.
    { x: 12, y: 0, w: 3, h: 1, to: 'vigil_summit', spawn: { x: 15, y: 17 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/upper_vigil.txt',
  props: [
    { sprite: 'owl_shop', x: 20, y: 6, shop: 'owl_stall' },
    { sprite: 'crates', x: 22, y: 6, text: 'shelf_crates' },
    { sprite: 'crates', x: 18, y: 6, text: 'shelf_crates' },
    { sprite: 'savepoint', x: 8, y: 8, save: true },
    // A green updraft: find it, and you can travel here from save points (src/data/travel.js).
    { sprite: 'travel_draft', x: 10, y: 8, travel: 'owl_shelf', animation: 'travel_draft', speed: 0.14, notice: true, walkable: true },
    { sprite: 'sign', x: 15, y: 11, text: 'last_shelf_sign' },
    { sprite: 'cairn', x: 6, y: 5, text: 'last_shelf_cairn' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter).
  looks: [],
  tileTexts: { Y: 'upper_pine', E: 'upper_rock', A: 'upper_rock', Q: 'upper_boulder', n: 'upper_snow', i: 'upper_snow', s: 'upper_stair', _: 'upper_cloud' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  npcs: [],
};
