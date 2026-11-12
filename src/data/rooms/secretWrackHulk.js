// THE HULK (secret): the inside of a wreck half buried in the dunes, reached through a hole
// in its bow from the pen in the north-west of the dunes (wrack_dunes). Nobody has been in
// here since the water went wrong: a table with a log on it, a chest, some barrels and a
// purse. Nothing hostile. A modest reward, and a little of what happened on this coast.
// Tile key (see src/overworld/coastTiles.js, wrack; this room is indoors):
//   #  hull top (solid)   W  hull wall (solid)   o  wet boards

export const SECRET_WRACK_HULK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'secret_wrack_hulk',
  // The room's name, for the Room Editor.
  name: 'THE HULK',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wrack',
  // The Wrack Shore's song through the planking (wrackIndoorTheme.js), and the sounds of the place under it (rain on the planks above).
  music: 'wrackIndoor',
  ambience: 'hulk_storm',
  // After chapter 5 the storm is over (`calmAfter`): no rain on the roof, and the room's `_calm` words.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_hulk' },
  vesWell: true,
  indoors: true,

  tiles: [
    '################',
    '#WWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWW#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#######oo#######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 7, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 7, y: 9, w: 2, h: 1, to: 'wrack_dunes', spawn: { x: 18, y: 3 } },
  ],

  // None.
  cutscenes: [],

  // A ship's wheel, barrels, the table with its log, a chest and a purse.
  textFile: 'interactions/wrack.txt',
  props: [
    { sprite: 'c5_ships_wheel', x: 3, y: 3, text: 'hulk_wheel' },
    { sprite: 'c5_barrels', x: 12, y: 3, text: 'hulk_barrels' },
    { sprite: 'table', x: 7, y: 5, text: 'hulk_log' },
    { sprite: 'chest', x: 12, y: 6, text: 'hulk_chest', gives: 'brine_tonic', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 2, y: 7, text: 'hulk_pouch', gold: 75, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_rope_coil', x: 9, y: 7, text: 'hulk_rope', walkable: true },
    // (2026-11-08) A chart on the wall and an oilskin on its peg.
    { sprite: 'in_oilskin_peg', x: 6, y: 2, text: 'in_hulk_oilskin' },
    { sprite: 'in_chart', x: 8, y: 2, text: 'in_hulk_chart' },
    // Dressing (second pass): a lamp and a shelf on the hull, a rug, crates in the corner.
    { sprite: 'in_wall_lamp', x: 13, y: 2, text: 'in_hulk_lamp' },
    { sprite: 'in_shelf_tins', x: 10, y: 2, text: 'in_hulk_shelf' },
    { sprite: 'in_rug_red', x: 6, y: 7, flat: true, walkable: true },
    { sprite: 'c5_crates_stack', x: 14, y: 8, text: 'in_hulk_crates' },
    { sprite: 'c5_lantern_fallen', x: 1, y: 4, walkable: true, text: 'in_hulk_lamp' },
    { sprite: 'c5_planks_scatter', x: 10, y: 8, flat: true, walkable: true },
  ],
  tileTexts: { W: 'hulk_wall', '#': 'hulk_wall' },

  npcs: [
  ],
};
