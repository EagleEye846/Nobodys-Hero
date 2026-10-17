// HERALDS' REST: the village on the spire's shoulder that was built to welcome
// the Hero, a hundred years ago, and has kept everything ready since. A
// frozen fountain, an ice statue of the Hero (carved fresh every winter from
// a guess), lamps, benches, a brazier; the inn to the west, the Hall of
// Heralds in the middle, the stores to the east, the bell tower in the
// south-east corner, the chapel to the west, and two little houses. Swept
// lanes run from the gate to every door. Everyone who lives here is out
// in the square, and the Keeper, once you've met him on the Shoulder, is by
// the fountain warming his hands. East past the tower is the Lookout.
// Tile key (see src/overworld/tileset.js):
//   D  doorway (walk through it; see `doors`)    n  snow
//   l  swept cobble lane                         z  ice
//   A  snowy cliff top (solid)                   E  ice-veined cliff face (solid)
//   Y  snow pine (walk or hide behind) (solid)   a  log cabin wall (solid)
//   w  cabin wall with a lit window (solid)      e  snowy cabin roof (solid)
//   f  picket fence (solid)
export const REST_SQUARE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'rest_square',
  // The room's name, for the Room Editor.
  name: 'HERALDS\' REST',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'rest',
  // The song that plays here (a file in src/data/music/).
  music: 'rest',

  tiles: [
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    'AnYnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnYA',
    'AnnneeeeeeeeennnnneeeeeeeennnneeeeeeeeeA',
    'AnnneeeeeeeeennnnneeeeeeeennnneeeeeeeeeA',
    'AnnnawwawwaannnnnneeeeeeeennnneeeeeeeeeA',
    'AnnnaaaaDaaannnnnnawwaawwannnnawaawwaawA',
    'AnnnnnnnllnnnnnnnnaaaaDaaannnnaaaaDaaaaA',
    'AnnnnnnnllnnnnnnnnnnnnllnnnnnnnnnnllnnnA',
    'AnYnnnnnllllllllllllllllllllllllllllnnnA',
    'AnnffffnllllllllllllllllllllllllllllnnnA',
    'AnnnnnnnllnnnnnnnnnnnnllnnnnnnnnnnnnnnYA',
    'AnnnnnnnllnnnnnnnnnnnnllnnnnnnnnneeeeeeA',
    'AeeeeeeellnnnnnnnnnnnnllnnnnnnnnneeeeeeA',
    'AeeeeeeellnnnnnnzzzznnllnnnnnnnnnawwwwaA',
    'AawaaawallnnnnnzzzzzznllnnnnnnnnnaaaDaaA',
    'AaaaDaaallnnnnnzzzzzznllnnnnnnnnnnnnllnA',
    'AnnlllnnllnnnnnnzzzznnllnnnnnnnnnnnlllnA',
    'AnnlllllllllllllllllllllllllllllllllllnA',
    'AnnlllllllllllllllllllllllllllllllllllnA',
    'AnnnnnnnllnnnnnnnnnnnnllnnnnnnnnnnnnnnnA',
    'AnneeeeellnnnnnnnnnnnnllnnnnneeeeeennnnA',
    'AnneeeeellnnnnnnnnnnnnllnnnnneeeeeennnnA',
    'AnnawwwallnnnnnnnnnnnnllnnnnnawwaawnnnnA',
    'AnnaaDaallnnnnnnnnnnnnllnnnnnaaDaaannnnA',
    'Annnnlllllllllllllllllllllllllllllllllll',
    'Annnnlllllllllllllllllllllllllllllllllll',
    'AnYnnnnnnnnnnnnnnnnnnnllnnnffffffnnnnnnA',
    'AnnnnnnnnnnnnnnnnnnnnnllnnnnnnnnnnnnnYnA',
    'AAAAAAAAAAAAAAAAAAAAAAllAAAAAAAAAAAAAAAA',
    'EEEEEEEEEEEEEEEEEEEEEEllEEEEEEEEEEEEEEEE',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 22, y: 28 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 22, y: 29, w: 2, h: 2, to: 'rest_gate', spawn: { x: 14, y: 1 } },
    { x: 8, y: 6, w: 1, h: 1, to: 'rest_inn', spawn: { x: 7, y: 12 } },
    { x: 22, y: 7, w: 1, h: 1, to: 'rest_hall', spawn: { x: 9, y: 13 } },
    { x: 34, y: 7, w: 1, h: 1, to: 'rest_stores', spawn: { x: 6, y: 10 } },
    { x: 36, y: 15, w: 1, h: 1, to: 'rest_belltower', spawn: { x: 5, y: 20 } },
    { x: 5, y: 24, w: 1, h: 1, to: 'rest_house_marta', spawn: { x: 5, y: 8 } },
    { x: 31, y: 24, w: 1, h: 1, to: 'rest_house_pottle', spawn: { x: 5, y: 8 } },
    { x: 39, y: 25, w: 1, h: 2, to: 'rest_lookout', spawn: { x: 1, y: 10 } },
    { x: 4, y: 16, w: 1, h: 1, to: 'rest_chapel', spawn: { x: 7, y: 14 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/heralds_rest.txt',
  props: [
    { sprite: 'fountain_frozen', x: 16, y: 15, text: 'square_fountain' },
    { sprite: 'ice_hero', x: 13, y: 16, text: 'square_ice_hero' },
    { sprite: 'savepoint', x: 24, y: 16, save: true },
    { sprite: 'street_lamp', x: 11, y: 12, text: 'square_lamp', nightText: 'square_lamp_night' },
    { sprite: 'street_lamp', x: 27, y: 12, text: 'square_lamp', nightText: 'square_lamp_night' },
    { sprite: 'street_lamp', x: 11, y: 20, text: 'square_lamp', nightText: 'square_lamp_night' },
    { sprite: 'street_lamp', x: 27, y: 20, text: 'square_lamp', nightText: 'square_lamp_night' },
    { sprite: 'notice_board', x: 14, y: 8, text: 'square_board', notice: true },
    { sprite: 'bench', x: 13, y: 20, text: 'square_bench' },
    { sprite: 'bench', x: 24, y: 20, text: 'square_bench' },
    { sprite: 'snowman', x: 2, y: 22, text: 'square_snowman' },
    { sprite: 'brazier', x: 19, y: 11, text: 'square_brazier' },
    { sprite: 'barrel', x: 31, y: 8, text: 'square_barrels' },
    { sprite: 'crates', x: 32, y: 8, text: 'square_barrels' },
    { sprite: 'skis', x: 35, y: 16, text: 'square_skis' },
    { sprite: 'herald_mayor', x: 20, y: 13, npc: 'herald_horace', notice: true },
    { sprite: 'herald_knit', x: 12, y: 20, npc: 'herald_marta' },
    { sprite: 'herald_kid', x: 4, y: 27, npc: 'herald_pottle' },
    { sprite: 'herald', x: 26, y: 23, npc: 'herald_bram' },
    { sprite: 'goat_nan', x: 3, y: 11, npc: 'old_nan' },
    { sprite: 'snow_hare', x: 30, y: 15, npc: 'snow_hare' },
    { sprite: 'chough', x: 5, y: 10, text: 'square_chough', walkable: true },
    { sprite: 'herald_old', x: 36, y: 23, npc: 'herald_wick' },
    { sprite: 'keeper', x: 21, y: 16, npc: 'old_keeper', after: 'keeper_on_the_shoulder' },
    { sprite: 'sign', x: 3, y: 7, text: 'square_inn_sign' },
    { sprite: 'sign', x: 25, y: 7, text: 'square_hall_sign' },
    { sprite: 'sign', x: 29, y: 7, text: 'square_stores_sign' },
    { sprite: 'sign', x: 38, y: 16, text: 'square_tower_sign' },
    { sprite: 'sign', x: 2, y: 24, text: 'square_marta_sign' },
    { sprite: 'sign', x: 36, y: 24, text: 'square_pottle_sign' },
    { sprite: 'sign', x: 38, y: 24, text: 'square_lookout_sign' },
    { sprite: 'sign', x: 6, y: 17, text: 'square_chapel_sign' },
    { sprite: 'chapel_spire', x: 4, y: 15, text: 'square_chapel_spire' },
    { sprite: 'street_lamp', x: 21, y: 28, text: 'square_lamp', nightText: 'square_lamp_night' },
    { sprite: 'street_lamp', x: 24, y: 28, text: 'square_lamp', nightText: 'square_lamp_night' },
    { sprite: 'street_lamp', x: 38, y: 27, text: 'square_lamp', nightText: 'square_lamp_night' },
    { sprite: 'street_lamp', x: 2, y: 17, text: 'square_lamp', nightText: 'square_lamp_night' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { Y: 'vigil_snow_pine', E: 'vigil_ice_rock', n: 'rest_snow', z: 'square_pond', e: 'square_roof', a: 'square_wall', w: 'square_window', f: 'square_fence', l: 'rest_lane' },

  // Enemies wandering the room, by their file name in src/data/enemies/.
  // patrol is the leftmost and rightmost tile they walk between. `behaviour`
  // is how they move (see BEHAVIOURS in src/overworld/npc.js); hiding ones go
  // just above a tall pillar or statue, and `reach` is how many tiles away they
  // leap from.
  npcs: [],
};
