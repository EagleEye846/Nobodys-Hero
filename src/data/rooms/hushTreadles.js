// THE TREADLES: the woodcutters' old gates, worked by treadles set in the
// ground. A gate stands open only while something's on its treadle, so it
// takes two: one to stand, one to go through. The first gate is easy (Bramble
// stands, you go, and he comes after you through a hole you can't fit). The
// second has no hole beside it: something else has to hold its treadle down,
// and the log that could is a long way from it. And
// in the east, Bramble's own den, which he insists is secret.
// Tile key (see src/overworld/tileset.js):
//   d  leaf litter
//   L  old scarlet tree (walk or hide behind) (solid)
//   O  boulder (solid)
//   y  leaf path
//   Z  bramble hedge (solid)
export const HUSH_TREADLES = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'hush_treadles',
  // The room's name, for the Room Editor.
  name: 'THE TREADLES',
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
  gloom: 0.18,

  tiles: [
    'LLLLyyLLLLLLLLLLLLLLLLLLLLLLLL',
    'LdddyydddZddddddddddZddddddddL',
    'LdddyddddZddddddddddZddddddddL',
    'LddLyddddZddddddLdddZddLdddddL',
    'LdddyddddZddddddddddZddddddddL',
    'LdddyddddZdddddLddddZddddddddL',
    'LdddyddddZdddOddddddZddddddLdL',
    'LdddyddddZddddddddddZddddddddL',
    'LdddydLddZddddddddddZddddddddL',
    'LdddyddddZdLddddddddZyyyyyyyyy',
    'Ldddyyyyydyyyyyyyyyydydddddddy',
    'LddddddddZddddddddddZddddddddL',
    'LddddddddZdddddddLddZddddddddL',
    'LddddddddZddddddddddZdddZZZZZL',
    'LdLddddddZddddddddddZdddZddddL',
    'LddddddddZdddddddddddddddddddL',
    'LddddddLdZddddOdddddZdddZddddL',
    'LddddddddZddLdddddddZdLdZddddL',
    'LddddddddZddddddddddZdddZddddL',
    'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 28, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 29, y: 9, w: 1, h: 2, to: 'hush_leaning_pines', spawn: { x: 1, y: 4 } },
    { x: 4, y: 0, w: 2, h: 1, to: 'hush_kiln', spawn: { x: 15, y: 18 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // Treadle gates: open only while their treadle is held down (by either of you,
  // a rock or a log).
  textFile: 'interactions/hushwood.txt',
  props: [
    { sprite: 'sign', x: 26, y: 8, text: 'treadles_sign' },
    { sprite: 'gate_narrow', x: 20, y: 10, text: 'treadle_gate', opensWith: ['near'] },
    { sprite: 'treadle', x: 23, y: 7, text: 'treadle', treadle: 'near' },
    { sprite: 'kid_gap', x: 20, y: 15, text: 'kid_gap', gap: true },
    { sprite: 'gate_narrow', x: 9, y: 10, text: 'treadle_gate', opensWith: ['far'] },
    { sprite: 'treadle', x: 14, y: 15, text: 'treadle', treadle: 'far' },
    { sprite: 'roll_log', x: 18, y: 6, text: 'roll_log', log: true },
    { sprite: 'rock_stump', x: 18, y: 16, text: 'rock_stump', rockReset: true },
    // Bramble's den (only he fits in): his treasure, and the gold he's been
    // saving.
    { sprite: 'kid_gap', x: 24, y: 15, text: 'den_gap', gap: true },
    { sprite: 'old_pack', x: 27, y: 14, text: 'den_box', gives: 'twin_hatchets', taken: { text: 'den_box_empty' } },
    { sprite: 'gold_pouch', x: 28, y: 18, text: 'den_jar', gold: 150, taken: { sprite: 'gold_pouch_empty', text: 'den_jar_empty' } },
    { sprite: 'leaf_pile', x: 26, y: 17, text: 'den_bed' },
    { sprite: 'notched_post', x: 2, y: 5, text: 'notched_post' },
  ],

  // Words for tiles: `looks` for one spot, `tileTexts` for every tile of a kind.
  looks: [
    { x: 25, y: 13, text: 'den_wall' },
    { x: 27, y: 13, text: 'den_wall' },
  ],
  tileTexts: { L: 'scarlet_tree', Z: 'bramble', O: 'mist_boulder' },

  // A Knotling grumbles in the middle of the three, and a Russet in the last.
  npcs: [
    { enemy: 'knotling', x: 11, y: 3, patrol: [11, 13], behaviour: 'patrol' },
    { enemy: 'russet', x: 6, y: 13, patrol: [6, 6], behaviour: 'ambush' },
  ],
};
