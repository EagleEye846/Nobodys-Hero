// THE CLIFF STEPS: the stair down the cliff to Gullrest's beach. You come out at the
// top from the fishers' hollow (the cave inside the Sea View's cliff, sunny_cliff_hollow).
// Boardwalk flights and two landings above the sea, bunting posts all the way
// down, a deckchair with a hat on it, a chalk tally of steps climbed, a chest
// on the second landing and a purse in the dunes at the top. PUZZLE-FREE and no
// monsters (first room of the area). The sea is on the left, sandstone on the right.
// Tile key (see src/overworld/coastTiles.js, gullrest):
//   #  sandstone cliff top (solid)   W  cliff face (solid)   ,  beach turf
//   :  packed sand   .  warm sand   o  boardwalk steps   f  white rail (solid)
//   ~  sea (solid)

export const GULLREST_CLIFF_STEPS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'gullrest_cliff_steps',
  // The room's name, for the Room Editor.
  name: 'THE CLIFF STEPS',
  // The region it's in (src/data/areas.js): the title card and the battle background.
  area: 'gullrest',
  // Gullrest's song (src/data/music/gullrestTheme.js), and the sounds of the place under it.
  music: 'gullrest',
  ambience: 'beach',
  vesWell: true,

  tiles: [
    '#########::#########',
    '#WWWWWWWW::WWWWWW###',
    '#W,,..,,::::.,,,,WW#',
    '#,,.,,,,,:::.,,,,,W#',
    '#,,,,,,,,:::.,,..,,#',
    '#,,,,,,,::::,,,..,O#',
    '#,O,,,.:::::,,,,,,,#',
    '#~~~~~~~~foooo######',
    '#~~~~~~~~foooo##,,,#',
    '#~O~~~~~~foooo#,,,##',
    '#~~O~~~~~foooo#,,,,#',
    '#~~~ffffffoooo#,O,,#',
    '#~~foooooooooo#,,,,#',
    '#~~foooooooooo#,,,,#',
    '#~~foooo#######,J,,#',
    '#~~foooo##,,,##,,,,#',
    '#O~foooo#,,,,,#,,,##',
    '#~~foooo#######,,,##',
    '#~~fooooWWWWWW#,,,,#',
    '#~~foooooooooo#,,O,#',
    '#~~foooooooooo#,,,,#',
    '#~~~ffffffoooo#,,,,#',
    '#~O~~~~~~foooo##,,,#',
    '#O~~~~~~~foooo###,,#',
    '#~~~~~~~~foooo######',
    '#~~~~~~~~fooooWWWWW#',
    '#~~;;..........,,,O#',
    '#~;....:::.....,,..#',
    '#;.......::::.....O#',
    '#.O.....::::.......#',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 9, y: 2 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Up into the fishers' hollow, the bottom of the cave inside the Sea View's cliff.
    { x: 9, y: 0, w: 2, h: 1, to: 'sunny_cliff_hollow', spawn: { x: 9, y: 15 } },
    { x: 8, y: 29, w: 4, h: 1, to: 'gullrest_beach', spawn: { x: 3, y: 3 } },
  ],

  // No cutscenes: a walk down a stair.
  cutscenes: [],

  // Bunting posts and strings (the strings are walked under), a sign, a deckchair,
  // buoys to sit on, a lifebuoy, a tally board, a purse, a chest and a sign at the foot.
  textFile: 'interactions/gullrest.txt',
  props: [
    { sprite: 'sign', x: 7, y: 5, text: 'steps_sign' },
    { sprite: 'c5_bunting_string', x: 8, y: 3, text: 'steps_bunting', animation: 'c5_bunting_string', speed: 0.35, walkable: true },
    { sprite: 'gold_pouch', x: 3, y: 3, text: 'steps_pouch', gold: 30, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'sy_dune_grass', x: 15, y: 4, text: 'steps_dune', animation: 'sy_dune_grass', speed: 0.38, walkable: true },
    { sprite: 'sy_dune_grass', x: 5, y: 6, text: 'steps_dune', animation: 'sy_dune_grass', speed: 0.44, walkable: true },
    { sprite: 'sy_dune_grass', x: 16, y: 6, text: 'steps_dune', animation: 'sy_dune_grass', speed: 0.5, walkable: true },
    { sprite: 'c5_deckchair', x: 5, y: 12, text: 'steps_deckchair' },
    { sprite: 'c5_lifebuoy_post', x: 12, y: 12, text: 'steps_lifebuoy' },
    { sprite: 'c5_tide_board', x: 6, y: 15, text: 'steps_counter' },
    { sprite: 'c5_buoys_pile', x: 5, y: 19, text: 'steps_buoys' },
    { sprite: 'chest', x: 12, y: 20, text: 'steps_chest', gives: 'sea_biscuit', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'c5_bunting_string', x: 8, y: 26, text: 'steps_bunting', animation: 'c5_bunting_string', speed: 0.35, walkable: true },
    { sprite: 'sign', x: 6, y: 28, text: 'steps_foot_sign' },
    { sprite: 'sy_dune_grass', x: 3, y: 27, text: 'steps_dune', animation: 'sy_dune_grass', speed: 0.4, walkable: true },
    { sprite: 'sy_dune_grass', x: 15, y: 28, text: 'steps_dune', animation: 'sy_dune_grass', speed: 0.46, walkable: true },
    // Dressing (2026-11-08): life about the stair, and the beach at its foot.
    { sprite: 'c5_gull_marks', x: 13, y: 5, flat: true, walkable: true },
    { sprite: 'c5_lobster_pots', x: 15, y: 2 },
    { sprite: 'c5_buoy_yellow', x: 2, y: 5 },
    { sprite: 'sy_dune_grass', x: 17, y: 10, text: 'steps_dune', animation: 'sy_dune_grass', speed: 0.42, walkable: true },
    { sprite: 'sy_dune_grass', x: 16, y: 21, text: 'steps_dune', animation: 'sy_dune_grass', speed: 0.47, walkable: true },
    { sprite: 'sy_dune_grass', x: 11, y: 16, text: 'steps_dune', animation: 'sy_dune_grass', speed: 0.4, walkable: true },
    { sprite: 'c5_crates_stack', x: 4, y: 17, text: 'cove_crates' },
    { sprite: 'c5_lantern_post_unlit', x: 13, y: 13 },
    { sprite: 'c5_rope_coil', x: 13, y: 19, walkable: true },
    { sprite: 'c5_rowboat', x: 13, y: 28, text: 'beach_rowboat' },
    { sprite: 'c5_anchor', x: 3, y: 29, text: 'beach_anchor' },
    { sprite: 'c5_crab_trail', x: 5, y: 27, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 16, y: 26, flat: true, walkable: true },
    // Dressing (second pass): warm stones in the water beside the steps, stones and grass on the
    // grassy ledge east of them (out of reach), a pool and a pot on the sand at the foot. The
    // way down (the boards and x 7 to 12 at the foot) stays clear.
    { sprite: 'c5_rocks_sunny', x: 5, y: 9, text: 'beach_rocks' },
    { sprite: 'c5_rock_sunny', x: 2, y: 14, text: 'beach_rocks' },
    { sprite: 'c5_rock_sunny', x: 1, y: 20, text: 'beach_rocks' },
    { sprite: 'c5_rocks_sunny', x: 5, y: 23, text: 'beach_rocks' },
    { sprite: 'c5_rocks_sunny', x: 15, y: 9, text: 'beach_rocks' },
    { sprite: 'c5_rock_sunny', x: 17, y: 17, text: 'beach_rocks' },
    { sprite: 'c5_rocks_sunny', x: 16, y: 22, text: 'beach_rocks' },
    { sprite: 'c5_rock_sunny', x: 18, y: 4, text: 'beach_rocks' },
    { sprite: 'c5_rocks_sunny', x: 1, y: 4, text: 'beach_rocks' },
    { sprite: 'c5_pot_single', x: 17, y: 29, text: 'beach_pot' },
    { sprite: 'c5_rock_pool_sunny', x: 16, y: 27, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 16, y: 12, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 18, y: 19, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 17, y: 15, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 1, y: 28, flat: true, walkable: true },
  ],
  tileTexts: { '#': 'steps_rock', W: 'steps_rock', '~': 'steps_sea', f: 'steps_rail' },

  // None: the first room of the area, and a stair.
  npcs: [
  ],
};
