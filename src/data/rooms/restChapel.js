// THE CHAPEL: a little log chapel off the square, where the heralds have
// prayed every evening for a hundred years that tomorrow would be the day.
// Pews either side of a red runner, the altar at the far end with its
// candles, and a great round window over it, its middle pane left clear
// (nobody knew what the Hero's face would look like). The spot at the head
// of the runner, before the altar, is where Ves kneels, praying
// (text/npcs/vesper.txt). Talk to her and she joins you.
// Tile key (see src/overworld/tileset.js):
//   #  wall top (solid)                           h  papered wall with wood panelling (solid)
//   o  wooden floorboards                         r  rug
//   D  doorway (walk through it; see `doors`)
export const REST_CHAPEL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'rest_chapel',
  // The room's name, for the Room Editor.
  name: 'THE CHAPEL',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'rest',
  // The song that plays here (a file in src/data/music/).
  music: 'rest',
  // Indoors.
  indoors: true,

  tiles: [
    '###############',
    '#hhhhhhhhhhhhh#',
    '#hhhhhhhhhhhhh#',
    '#ooooooooooooo#',
    '#ooooooooooooo#',
    '#ooooorrrooooo#',
    '#ooooorrrooooo#',
    '#ooooorrrooooo#',
    '#ooooorrrooooo#',
    '#ooooorrrooooo#',
    '#ooooorrrooooo#',
    '#ooooorrrooooo#',
    '#ooooorrrooooo#',
    '#ooooorrrooooo#',
    '#ooooorrrooooo#',
    '######DDD######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 7, y: 14 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  // A door with `climb: true` carries a rope climb on into the next room.
  doors: [
    { x: 6, y: 15, w: 3, h: 1, to: 'rest_square', spawn: { x: 4, y: 17 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file;
  // `npc` names a file in text/npcs/; `shop` a shop in src/data/shops.js; `save` a save point.
  textFile: 'interactions/heralds_rest.txt',
  props: [
    // The far end: the great round window, the altar under it, candles either side.
    { sprite: 'chapel_rose', x: 6, y: 2, text: 'chapel_window' },
    { sprite: 'chapel_lancet', x: 2, y: 2, text: 'chapel_lancet_left' },
    { sprite: 'chapel_lancet', x: 12, y: 2, text: 'chapel_lancet_right' },
    { sprite: 'chapel_altar', x: 6, y: 3, text: 'chapel_altar' },
    { sprite: 'chapel_candles', x: 4, y: 3, text: 'chapel_candles' },
    { sprite: 'chapel_candles', x: 10, y: 3, text: 'chapel_candles' },
    { sprite: 'book_stand', x: 2, y: 4, text: 'chapel_prayers' },
    { sprite: 'hymn_board', x: 12, y: 4, text: 'chapel_hymns' },
    // Ves, kneeling at the head of the runner before the altar, in the middle
    // of the front row, praying. Talk to her and she joins the party.
    { sprite: 'vesper', x: 7, y: 5, npc: 'vesper', join: 'vesper' },
    // The pews, either side of the aisle; the front row is reserved.
    { sprite: 'pew_reserved', x: 2, y: 6, text: 'chapel_pew_front' },
    { sprite: 'pew_reserved', x: 4, y: 6, text: 'chapel_pew_front' },
    { sprite: 'pew_reserved', x: 9, y: 6, text: 'chapel_pew_front' },
    { sprite: 'pew_reserved', x: 11, y: 6, text: 'chapel_pew_front' },
    { sprite: 'pew', x: 2, y: 8, text: 'chapel_pew' },
    { sprite: 'pew', x: 4, y: 8, text: 'chapel_pew' },
    { sprite: 'pew', x: 9, y: 8, text: 'chapel_pew' },
    { sprite: 'pew', x: 11, y: 8, text: 'chapel_pew' },
    { sprite: 'pew', x: 2, y: 10, text: 'chapel_pew' },
    { sprite: 'pew', x: 4, y: 10, text: 'chapel_pew' },
    { sprite: 'pew', x: 9, y: 10, text: 'chapel_pew' },
    { sprite: 'pew', x: 11, y: 10, text: 'chapel_pew' },
    { sprite: 'pew', x: 2, y: 12, text: 'chapel_pew_back' },
    { sprite: 'pew', x: 4, y: 12, text: 'chapel_pew_back' },
    { sprite: 'pew', x: 9, y: 12, text: 'chapel_pew_back' },
    { sprite: 'pew', x: 11, y: 12, text: 'chapel_pew_back' },
    // By the door: candles for anyone's prayer, and the notices.
    { sprite: 'votive_rack', x: 10, y: 14, text: 'chapel_votives' },
    { sprite: 'sign', x: 4, y: 14, text: 'chapel_sign' },
  ],

  // Words for tiles, shown when you press Z on them: `looks` for one spot,
  // `tileTexts` for every tile of a kind (by its letter). Both name sections
  // of the text file, like signs.
  looks: [],
  tileTexts: { r: 'chapel_runner', h: 'chapel_wall' },

  // No enemies here: the mountain itself is the challenge (see docs/mountain-enemies.md
  // for the ones designed for it).
  npcs: [],
};
