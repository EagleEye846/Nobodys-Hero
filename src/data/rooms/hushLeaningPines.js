// THE LEANING PINES: young trees grow thin and tall where the light gets
// in, and the woodcutters left notches in them for whoever came next. Bramble
// chops (Z on one, with him with you or steering him): a tree falls the way
// the chopper faces. Into water it's a bridge; onto open ground it's a log to
// roll, and the stump left behind can be walked over. The south brook wants a
// log from a tree that's in the wrong place for falling; the deep brook in
// the north-west wants two, in the right order.
// Tile key (see src/overworld/tileset.js):
//   d  leaf litter
//   L  old scarlet tree (walk or hide behind) (solid)
//   y  leaf path
//   Z  bramble hedge (solid)
//   ~  brook (solid, until a log sinks into it)
export const HUSH_LEANING_PINES = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hush_leaning_pines',
  // The room's name, for the Room Editor.
  name: 'THE LEANING PINES',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'hushwood',
  // The Hushwood's own song (hushwoodTheme.js): quiet, holding its breath.
  music: 'hushwood',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hushwood',
  // Leaf litter shows under blocks and boulders with nothing else to go by.
  leafy: true,
  // How much the old trees darken it (0 to 1; see OverworldScene.drawGloom).
  gloom: 0.1,

  tiles: [
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
    'LddZ~~ddddddddLddddddddddddddL',
    'LLdZ~~ddddLddddddddddddddddddL',
    'LddZ~~ddddddddddddddddLddddddL',
    'yyyd~~dddddddydddddddddddddddL',
    'yydZ~~dddddddydddddddddddddddL',
    'LddZ~~ddyyyyyydddddddddddddddL',
    'LddZ~~ddydddddddLddddddddddddL',
    'LdLZ~~ddLdddddddddddddddddLddL',
    'LddZ~~ddydddLddddddLdddddddddL',
    'LLdZ~~ddyddddddddddddddddddddL',
    'LZZZZZZZdZZZZZZZZZZZZZZZZZZZZL',
    'L~~~~~~~~~~~~~~~~~~~~~~~~~~~~L',
    'LddddddddddddddddddddddddddLdL',
    'LddddddLdLddddddddddLddddddddL',
    'LddLddddyyyyyyyddddddddddLdddL',
    'LdddddddddddLdyddddddddddddddL',
    'LLLLLLLLLLLLLLyyLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 14, y: 16 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 14, y: 17, w: 2, h: 1, to: 'hush_kid_gap', spawn: { x: 13, y: 1 } },
    { x: 0, y: 4, w: 1, h: 2, to: 'hush_treadles', spawn: { x: 28, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // Thin pines to chop (`chop`), and the carved stump that stands them back up.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'sign', x: 16, y: 15, text: 'pines_sign' },
    { sprite: 'thin_pine', x: 8, y: 14, text: 'thin_pine', chop: true },
    { sprite: 'thin_pine', x: 18, y: 13, text: 'thin_pine', chop: true },
    { sprite: 'thin_pine', x: 6, y: 4, text: 'thin_pine', chop: true },
    { sprite: 'thin_pine', x: 12, y: 3, text: 'thin_pine', chop: true },
    { sprite: 'thin_pine', x: 6, y: 8, text: 'thin_pine', chop: true },
    { sprite: 'rock_stump', x: 22, y: 15, text: 'rock_stump', rockReset: true },
    { sprite: 'rock_stump', x: 17, y: 5, text: 'rock_stump', rockReset: true },
    { sprite: 'chest', x: 1, y: 9, text: 'pines_chest', gives: 'acorn_cap', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 28, y: 1, text: 'pines_pouch', gold: 75, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'bramble', '~': 'mist_brook' },

  // A Knotling sits among the stumps up north, pretending to be one.
  npcs: [
    { enemy: 'knotling', x: 24, y: 5, patrol: [24, 24], behaviour: 'disguise' },
    { enemy: 'puffcap', x: 25, y: 14, patrol: [23, 27] },
  ],
};
