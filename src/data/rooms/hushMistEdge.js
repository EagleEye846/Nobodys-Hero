// THE MIST'S EDGE: the first room of the Hushwood, west along the foot of
// the Long Drop from its bottom shelf. The mist lies close to the south. A
// brook off the ravine cuts the wood in two, and the bramble on its far bank
// has only one gap in it. One felled log, which rolls till something stops it
// and sinks into the brook as a bridge: get it to roll into the water level
// with the gap. (the obvious push sinks it in the wrong
// place, and the carved stump puts it back.) Huge paw prints in the mud, and
// the first of Ves's chalk arrows.
// Tile key (see src/overworld/tileset.js):
//   d  leaf litter
//   L  old scarlet tree (walk or hide behind) (solid)
//   O  boulder (solid)
//   y  leaf path
//   Z  bramble hedge (solid)
//   ~  brook (solid, until a log sinks into it)
export const HUSH_MIST_EDGE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hush_mist_edge',
  // The room's name, for the Room Editor.
  name: 'THE MIST\'S EDGE',
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
  gloom: 0.12,
  // Mist drifting through, 0 to 1.
  fog: 0.25,

  tiles: [
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLL',
    'LddddddddZ~dddddLddddddddddL',
    'LddLdddddZ~ddddddddLdddddddL',
    'LdddddLddZ~ddOdddddddOdddLdL',
    'Lddddyyyyd~ddddddddddddddddL',
    'LddddydddZ~ddddddddddddddddL',
    'LddddydddZ~dddddddddddddOddL',
    'yyyyyydddZ~ddddddOdddddddddL',
    'yyyddddddZ~dOddddddddddddddL',
    'LdddLddddZ~dddddddyyyddddddL',
    'LddddddLdZ~dddddddddyddLdddL',
    'LdLddddddZ~dddddddddyddddddL',
    'LddddddddZ~dddddddddyyyyyyyy',
    'LddddLdddZ~ddddOddddddddddyy',
    'LddddddddZ~dddddddddddLddddL',
    'LddddddLdZ~OddddddddddddddLL',
    'LLdddddddZ~ddLddddddOddddddL',
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 26, y: 12 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 27, y: 12, w: 1, h: 2, to: 'pinefall_ravine', spawn: { x: 1, y: 28 } },
    { x: 0, y: 7, w: 1, h: 2, to: 'hush_felled_run', spawn: { x: 28, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The log and the carved stump that puts it back are the puzzle (see Prop:
  // `log`, `rockReset`).
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'roll_log', x: 17, y: 10, text: 'roll_log', log: true },
    { sprite: 'rock_stump', x: 24, y: 12, text: 'rock_stump', rockReset: true },
    { sprite: 'chalk_rock_left', x: 22, y: 11, text: 'mist_chalk' },
    { sprite: 'paw_print', x: 19, y: 14, text: 'paw_print' },
    { sprite: 'paw_print', x: 16, y: 15, text: 'paw_print' },
    { sprite: 'paw_print', x: 13, y: 13, text: 'paw_print' },
    { sprite: 'sign', x: 25, y: 9, text: 'mist_sign' },
    // Tucked in behind the trees in the far corner, past the brook.
    { sprite: 'gold_pouch', x: 1, y: 15, text: 'mist_pouch', gold: 90, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chest', x: 26, y: 2, text: 'mist_chest', gives: 'toadstool_toast', taken: { sprite: 'chest_open', text: 'chest_empty' } },
  ],

  // Words for tiles: `looks` for one spot, `tileTexts` for every tile of a kind.
  looks: [
    { x: 11, y: 17, text: 'mist_mist' },
    { x: 12, y: 17, text: 'mist_mist' },
    { x: 13, y: 17, text: 'mist_mist' },
    { x: 14, y: 17, text: 'mist_mist' },
    { x: 15, y: 17, text: 'mist_mist' },
    { x: 16, y: 17, text: 'mist_mist' },
    { x: 17, y: 17, text: 'mist_mist' },
    { x: 18, y: 17, text: 'mist_mist' },
    { x: 19, y: 17, text: 'mist_mist' },
    { x: 20, y: 17, text: 'mist_mist' },
    { x: 21, y: 17, text: 'mist_mist' },
    { x: 22, y: 17, text: 'mist_mist' },
    { x: 23, y: 17, text: 'mist_mist' },
    { x: 24, y: 17, text: 'mist_mist' },
    { x: 25, y: 17, text: 'mist_mist' },
    { x: 26, y: 17, text: 'mist_mist' },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'bramble', '~': 'mist_brook', O: 'mist_boulder' },

  // Two Puffcaps in the damp by the mist, out of the log's way.
  npcs: [
    { enemy: 'puffcap', x: 21, y: 15, patrol: [18, 24] },
    { enemy: 'puffcap', x: 5, y: 11, patrol: [3, 7] },
  ],
};
