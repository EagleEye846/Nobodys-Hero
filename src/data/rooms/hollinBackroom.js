// MAGS'S BACK ROOM (a secret, Chapter 3): behind a loose shelf in Hollin Stores,
// the stockroom Mags kept for what she didn't want on the counter. On the
// night the star came down, a leaf of the Welcome Register blew all the way
// out here from the Dead City, and Mags (who couldn't read the old writing but
// liked the look of it) pinned it up in here. The way through the room is a
// gate on a plate: push the stone onto it. The first of the Registry's three
// leaves (the Leaf of Names; see src/data/rooms/registryCleft.js).
// Tile key (see src/overworld/tileset.js):
//   #  wall (solid)
//   h  the shop's back wall
//   o  wooden floor
export const HOLLIN_BACKROOM = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hollin_backroom',
  // The room's name, for the Room Editor.
  name: 'MAGS\'S BACK ROOM',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'hollin',
  // "Hush, Little Hollin" (hollinTheme.js): the empty village's lullaby.
  music: 'hollin',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hush',
  // Indoors.
  indoors: true,
  // No lamp lit in here for fifty years either.
  lamplight: { shade: 0.35, nightShade: 0.3 },

  tiles: [
    '################',
    '#hhhhhhhhhhhhhh#',
    '#hhhhhhhhhhhhhh#',
    '##ooooooo#ooooo#',
    '#oooooooo#ooooo#',
    '#oooooooo#ooooo#',
    'ooooooooooooooo#',
    '#oooooooo#ooooo#',
    '#oooooooo#ooooo#',
    '#oooooooo#ooooo#',
    '#oooooooo#oooo##',
    '################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 6 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 6, w: 1, h: 1, to: 'hollin_stores', spawn: { x: 12, y: 6 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/hushwood.txt',
  props: [
    // The gate across the room opens while the stone sits on the plate (and for good).
    { sprite: 'gate_narrow', x: 9, y: 6, text: 'backroom_gate', opensWith: ['backroom_plate'] },
    { sprite: 'stone_button', x: 6, y: 8, text: 'backroom_button', button: 'backroom_plate' },
    { sprite: 'push_rock', x: 3, y: 4, text: 'backroom_stone', rock: true },
    { sprite: 'rock_stump', x: 1, y: 9, text: 'rock_stump', rockReset: true },
    // The leaf, pinned up on a stand where the draught can't get it.
    { sprite: 'register_leaf', x: 12, y: 5, text: 'backroom_leaf', gives: 'register_leaf_names', light: 14, notice: true, taken: { sprite: 'book_stand', text: 'backroom_leaf_taken' } },
    { sprite: 'bookshelf', x: 3, y: 2, text: 'hstores_shelves' },
    { sprite: 'bookshelf', x: 5, y: 2, text: 'hstores_shelves' },
    { sprite: 'bookshelf', x: 12, y: 2, text: 'hstores_shelves' },
    { sprite: 'crates', x: 13, y: 9, text: 'hstores_crates' },
    { sprite: 'barrel', x: 11, y: 9, text: 'hstores_barrel' },
    { sprite: 'sign', x: 8, y: 4, text: 'backroom_sign' },
  ],
  tileTexts: { h: 'hstores_wall' },

  // Nobody back here either.
  npcs: [],
};
