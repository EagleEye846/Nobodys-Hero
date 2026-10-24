// THE FELLED RUN: where the woodcutters once dragged logs down to the
// brook. The brook here is two logs wide, and the far bank's bramble has one
// gap. Two felled logs: the nearer one, pushed the obvious way, sinks in the
// wrong place. The trick is to use one log to stop the other first. (7
// pushes at best, and no way to get stuck: Z twice on a log,
// or the carved stump, puts them back.) Somewhere ahead, a voice is yelling.
// Tile key (see src/overworld/tileset.js):
//   d  leaf litter
//   L  old scarlet tree (walk or hide behind) (solid)
//   O  boulder (solid)
//   y  leaf path
//   Z  bramble hedge (solid)
//   ~  brook (solid, until a log sinks into it)
export const HUSH_FELLED_RUN = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hush_felled_run',
  // The room's name, for the Room Editor.
  name: 'THE FELLED RUN',
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
  gloom: 0.15,
  // Mist drifting through, 0 to 1.
  fog: 0.15,

  tiles: [
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
    'LddddddddddZ~~dddddddddddddddL',
    'LddddddLdddZ~~dddddddddddddddL',
    'LddLdddddddZ~~dddLddddddLddddL',
    'yydddddddLdZ~~dddddddddddddddL',
    'yyyyyydddddZ~~dddddddddddddddL',
    'LddddydddddZ~~dddddddddddddLdL',
    'LddddyLddddZ~~ddddLddddddddddL',
    'LddddydddddZ~~ddddddOddddddddL',
    'LdLddydddddZ~~dOddddddddyyyyyy',
    'LddddydddddZ~~ddddddddddyddddy',
    'LddddydddddZ~~dddddddddLyddddL',
    'Lddddyyyyyyd~~dddddddyyyyddddL',
    'LddddddddddZ~~ddOddOdddddddddL',
    'LdddddddLddZ~~ddddddddddddLddL',
    'LddLdddddddZ~~ddddddddLddddddL',
    'LddddddddddZ~~dddddddddddddddL',
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 28, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 29, y: 9, w: 1, h: 2, to: 'hush_mist_edge', spawn: { x: 1, y: 7 } },
    { x: 0, y: 4, w: 1, h: 2, to: 'hush_hollow_oak', spawn: { x: 28, y: 10 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 6, y: 4, w: 1, h: 2, scene: 'distant_holler' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  // Two logs and the carved stump that puts them back.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'roll_log', x: 15, y: 2, text: 'roll_log', log: true },
    { sprite: 'roll_log', x: 18, y: 8, text: 'roll_log', log: true },
    { sprite: 'rock_stump', x: 26, y: 12, text: 'rock_stump', rockReset: true },
    { sprite: 'sign', x: 27, y: 8, text: 'felled_sign' },
    { sprite: 'boot_print', x: 8, y: 12, text: 'boot_print' },
    { sprite: 'boot_print', x: 5, y: 9, text: 'boot_print' },
    { sprite: 'boot_print', x: 3, y: 5, text: 'boot_print' },
    { sprite: 'chest', x: 1, y: 15, text: 'felled_chest', gives: 'stump_honey', taken: { sprite: 'chest_open', text: 'chest_empty' } },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'bramble', '~': 'mist_brook', O: 'mist_boulder' },

  // A Burrhog trundles along the east bank, clear of the log lanes; a Russet
  // waits on the far side.
  npcs: [
    { enemy: 'burrhog', x: 25, y: 15, patrol: [21, 27] },
    { enemy: 'russet', x: 3, y: 11, patrol: [3, 3], behaviour: 'ambush' },
  ],
};
