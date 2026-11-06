// THE CLIFF STEPS: the stair down the cliff from the Sea View to Gullrest's beach.
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
    '#WWWWWWWW::WWWWWWWW#',
    '#,,,,,,,::::,,,,,,,#',
    '#,,,,,,,::::,,,,,,,#',
    '#,,,,,,,::::,,,,,,,#',
    '#,,,,,,,::::,,,,,,,#',
    '#,,,,,,,::::,,,,,,,#',
    '#~~~~~~~~foooo######',
    '#~~~~~~~~foooo######',
    '#~~~~~~~~foooo######',
    '#~~~~~~~~foooo######',
    '#~~~ffffffoooo######',
    '#~~foooooooooo######',
    '#~~foooooooooo######',
    '#~~foooo############',
    '#~~foooo############',
    '#~~foooo############',
    '#~~foooo############',
    '#~~fooooWWWWWW######',
    '#~~foooooooooo######',
    '#~~foooooooooo######',
    '#~~~ffffffoooo######',
    '#~~~~~~~~foooo######',
    '#~~~~~~~~foooo######',
    '#~~~~~~~~foooo######',
    '#~~~~~~~~fooooWWWWW#',
    '#..................#',
    '#..................#',
    '#.......::::.......#',
    '#.......::::.......#',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 9, y: 2 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 9, y: 0, w: 2, h: 1, to: 'sunny_sea_view', spawn: { x: 24, y: 19 } },
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
  ],
  tileTexts: { '#': 'steps_rock', W: 'steps_rock', '~': 'steps_sea', f: 'steps_rail' },

  // None: the first room of the area, and a stair.
  npcs: [
  ],
};
