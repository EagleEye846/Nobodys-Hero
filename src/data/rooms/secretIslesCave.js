// THE TIDY CAVE: a sea cave in the cliff under the rope bridge, its mouth only out of the water
// at low tide. Inside, somebody has swept it. The shingle is raked smooth, the shells are set
// out in rows by size, the rope is coiled just so, and in the middle, on its post, a lantern is
// burning. Beside the lantern a scrap of paper under a pebble says one word: "tidy". (Lantern 6
// of the chapter. Nobody says who lit it; the excuses are plain ones.) A chest, a purse. PUZZLE-FREE,
// no monsters. The way out is the mouth (6,9), and up the rocks onto the west isle (isles_bridge 10,16).
// Tile key (see src/overworld/coastTiles.js, isles):
//   #  rock top (solid)   W  cave rock (solid)   q  raked shingle

export const SECRET_ISLES_CAVE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'secret_isles_cave',
  // The room's name, for the Room Editor.
  name: 'THE TIDY CAVE',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'isles',
  music: 'isles',
  ambience: 'sea_cave',
  // Under the rock: no rain or lightning, and the edges of the screen sink into shadow.
  indoors: true,
  vesWell: true,

  tiles: [
    '##############',
    '#WWWWWWWWWWWW#',
    '#qqqqqqqqqqqq#',
    '#qqqqqqqqqqqq#',
    '#qqqqqqqqqqqq#',
    '#qqqqqqqqqqqq#',
    '#qqqqqqqqqqqq#',
    '#qqqqqqqqqqqq#',
    '#qqqqqqqqqqqq#',
    '######qq######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Out of the mouth and up the rocks onto the west isle's edge (dry at both tides).
    { x: 6, y: 9, w: 2, h: 1, to: 'isles_bridge', spawn: { x: 10, y: 16 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/isles.txt',
  props: [
    // The lantern (6) and the note.
    { sprite: 'c5_lantern_post_lit', x: 7, y: 4, text: 'cave_lantern', animation: 'c5_lantern_post_lit', speed: 0.25 },
    { sprite: 'il_note_tidy', x: 8, y: 4, text: 'cave_note', walkable: true, flat: true },
    // Everything put away.
    { sprite: 'il_shell_row', x: 2, y: 3, text: 'cave_shells', walkable: true, flat: true },
    { sprite: 'il_shell_row', x: 3, y: 3, text: 'cave_shells', walkable: true, flat: true },
    { sprite: 'c5_rope_coil', x: 11, y: 7, text: 'cave_rope', walkable: true, flat: true },
    { sprite: 'il_broom', x: 12, y: 2, text: 'cave_broom' },
    { sprite: 'c5_crates_stack', x: 2, y: 6, text: 'cave_crates' },
    { sprite: 'c5_chest', x: 11, y: 2, text: 'cave_chest', gives: 'cockle_chowder', taken: { sprite: 'c5_chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 3, y: 7, text: 'cave_pouch', gold: 400, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'cave_rock', W: 'cave_rock', q: 'cave_floor' },

  // Nobody here.
  npcs: [],
};
