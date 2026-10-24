// THE CLAWED BRIDGE: the woodcutters' bridge over the deep brook, torn
// apart. Claw marks in the bank posts. One plank is left, on the near side;
// the rest is gone downstream. Rebuild it: a log, and two saplings for
// Bramble to fell. A sapling felled onto the plank can be rolled off it into
// the water. The other sapling stands just where the log needs stopping, so
// leave it standing till the log's in place. Ves's
// chalk on the far bank says "keep up!".
// Tile key (see src/overworld/tileset.js):
//   d  leaf litter
//   g  plank bridge
//   L  old scarlet tree (walk or hide behind) (solid)
//   y  leaf path
//   Z  bramble hedge (solid)
//   ~  brook (solid, until a log sinks into it)
export const HUSH_CLAWED_BRIDGE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hush_clawed_bridge',
  // The room's name, for the Room Editor.
  name: 'THE CLAWED BRIDGE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'hushwood',
  // The Hushwood's own song (hushwoodTheme.js): quiet, holding its breath.
  music: 'hushwood',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'hush',
  // Leaf litter shows under blocks and boulders with nothing else to go by.
  leafy: true,
  // How much the old trees darken it (0 to 1; see OverworldScene.drawGloom).
  gloom: 0.38,
  // Mist drifting through, 0 to 1.
  fog: 0.25,

  tiles: [
    'LLLLLyyLLLLLLLLLLLLLLLLLLLLLLLLL',
    'LddddyyddddZ~~~ddddddddddddddddL',
    'LddddyddLddZ~~~ddddddddddddddddL',
    'LddLdydddddZ~~~dddddddddddLddddL',
    'LddddydddddZ~~~ddddddddddddddddL',
    'LddddydLdddZ~~~ddddddddddddddddL',
    'LddddydddddZ~~~ddLdddddddddddddL',
    'LddddydddddZ~~~ddddddddddddddddL',
    'LddddydddddZ~~~ddddddddddLdddddL',
    'LdLddydddddZ~~~ddddddddddddddddL',
    'LddddydddddZ~~~ddddddddddddddddL',
    'Lddddyyyyyyd~~gddddddddddddddddL',
    'LddddddddddZ~~~dddddddyyyddddddL',
    'LddddddddddZ~~~dddddddddyddddddL',
    'LdddddLddddZ~~~ddddddLddyddddddL',
    'LddddddddddZ~~~ddLddddddyyyyyyyy',
    'LddddddddLdZ~~~dddddddddLddddddy',
    'LdddLddddddZ~~~ddddddddddddddddL',
    'LddddddddddZ~~~ddddddddddddddddL',
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 30, y: 15 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 31, y: 15, w: 1, h: 2, to: 'hush_quiet', spawn: { x: 5, y: 1 } },
    { x: 5, y: 0, w: 2, h: 1, to: 'hollin_gate', spawn: { x: 15, y: 20 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The log, the two saplings, and the carved stump that puts it all back.
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'roll_log', x: 19, y: 3, text: 'roll_log', log: true },
    { sprite: 'thin_pine', x: 15, y: 11, text: 'thin_pine', chop: true },
    { sprite: 'thin_pine', x: 19, y: 12, text: 'thin_pine', chop: true },
    { sprite: 'rock_stump', x: 28, y: 17, text: 'rock_stump', rockReset: true },
    { sprite: 'sign', x: 16, y: 13, text: 'bridge_sign' },
    { sprite: 'chalk_rock_up', x: 7, y: 9, text: 'bridge_chalk' },
    { sprite: 'paw_print', x: 16, y: 9, text: 'paw_print' },
    { sprite: 'paw_print', x: 9, y: 12, text: 'paw_print' },
    { sprite: 'chest', x: 1, y: 18, text: 'bridge_chest', gives: 'kiln_stew', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 30, y: 1, text: 'bridge_pouch', gold: 170, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],

  // Words for tiles: `looks` for one spot, `tileTexts` for every tile of a kind.
  looks: [
    { x: 14, y: 11, text: 'bridge_plank' },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'bramble', '~': 'mist_brook', g: 'bridge_plank' },

  // Haywards have come down from Hollin's fields: one on each bank.
  npcs: [
    { enemy: 'hayward', x: 26, y: 11, patrol: [23, 29] },
    { enemy: 'puffcap', x: 4, y: 6, patrol: [2, 8] },
  ],
};
