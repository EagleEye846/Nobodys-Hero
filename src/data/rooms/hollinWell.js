// HOLLIN WELL: the square at the heart of Hollin, cobbles and empty
// cottages all round, and in the middle the old well with its little roof.
// Ves's last chalk mark is on its rim, an arrow pointing down, and a word.
// There's no way on: every lane out of the square is blocked. When you reach
// the well, the birds stop, and the Hush rises over the rooftops (the_well),
// and there's only one way left to go.
// Tile key (see src/overworld/tileset.js):
//   5  cottage wall (solid)
//   6  boarded cottage window (solid)
//   7  cottage roof (solid)
//   8  shut cottage door (solid)
//   L  old scarlet tree (walk or hide behind) (solid)
//   X  Hollin's cobbles
export const HOLLIN_WELL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hollin_well',
  // The room's name, for the Room Editor.
  name: 'HOLLIN WELL',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'hollin',
  // Nothing: just the hush. Its own song comes in the scene.
  music: null,
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hush',
  // Leaf litter shows under blocks and boulders with nothing else to go by.
  leafy: true,
  // How much the old trees darken it (0 to 1; see OverworldScene.drawGloom).
  gloom: 0.55,
  // Mist drifting through, 0 to 1.
  fog: 0.45,

  tiles: [
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
    'LXXXXXXXXXXX77777777XXXXXXXXXXXL',
    'LX7777777XXX77777777XXX7777777XL',
    'LX7777777XXX56555565XXX7777777XL',
    'LX7777777XXXXXXXXXXXXXX7777777XL',
    'LX5658565XXXXXXXXXXXXXX5658565XL',
    'LXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXL',
    'LXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXL',
    'LXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXL',
    'LXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXL',
    'LLXXXXXXXXXXXXXXXXXXXXXXXXXXXXXL',
    'LXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXL',
    'LXXXXXXXXXXXXXXXXXXXXXXXXXXXXXLL',
    'LXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXL',
    'LXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXL',
    'LX7777777XXXXXXXXXXXXXX7777777XL',
    'LX7777777XXXXXXXXXXXXXX7777777XL',
    'LX7777777XXXXXXXXXXXXXX7777777XL',
    'LX5655865XXXXXXXXXXXXXX5685565XL',
    'LXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXL',
    'LXXXXXXXXXLXXXXXXXXXXXXXXXXXXXXL',
    'LXXXXXXXXXXXXXXXXXXXXLXXXXXXXXXL',
    'LXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXL',
    'LLLLLLLLLLLLLLLXXLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 16, y: 22 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 15, y: 23, w: 2, h: 1, to: 'hollin_mill', spawn: { x: 16, y: 1 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 13, y: 14, w: 6, h: 1, scene: 'the_well' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'well_chalk', x: 15, y: 11, text: 'well_well' },
    { sprite: 'cart_broken', x: 1, y: 12, text: 'well_blocked' },
    { sprite: 'cart_broken', x: 29, y: 8, text: 'well_blocked' },
    { sprite: 'hollin_sign', x: 20, y: 19, text: 'well_sign' },
    { sprite: 'paw_print', x: 9, y: 9, text: 'paw_print' },
    { sprite: 'paw_print', x: 11, y: 7, text: 'paw_print' },
    { sprite: 'paw_print', x: 22, y: 12, text: 'paw_print' },
  ],
  tileTexts: { X: 'lane_cobbles', '6': 'hollin_window', '5': 'hollin_wall', '7': 'hollin_roof', '8': 'hollin_door', L: 'scarlet_tree' },

  // Nothing here but the two of you. For now.
  npcs: [],
};
