// THE MILL POND: a big round pond the lane has to cross on stepping stones, and
// a dandylion and a haybob that keep to its shores. No
// puzzle: the stones zig-zag across, one wide, with a stub north to a little
// island (a purse) and a stub south to another (a smaller purse). A chest sits
// on the far bank among the reeds.
// Tile key (see src/overworld/brightTiles.js):
//   #  hedgerow (solid)   W  hedgerow face (solid)   ,  meadow   :  dirt lane
//   ~  the pond (solid)   j  stepping stones (walkable)
//   I  oak   T  apple tree   J  blossom tree (solid, standing)

export const SUNNY_MILL_POND = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'sunny_mill_pond',
  // The room's name, for the Room Editor.
  name: 'THE MILL POND',
  // The region it's in (src/data/areas.js): the title card and the battle background.
  area: 'sunnyside',
  // Sunnyside's song (src/data/music/sunnysideTheme.js), and the sounds of the place under it.
  music: 'sunnyside',
  ambience: 'meadow',
  vesWell: true,
  birds: 3,

  tiles: [
    '########################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,T,,,,~~~~~~~~~~~~~~~~~~~~,,,,T,,,,#',
    '#,,I,,,,,,~~~~~~~,,,,~~~~~~~~~,,,,,,,J,#',
    '#,,,,,,,,,~~~~~~~,,,,~~~~~~~~~,,,,,,,,,#',
    '#,,,,,,,,,~~~~~~~~j~~~~~~~~~~~,,,,,,,,,#',
    '#,,,,,,,,,~~~~~~~~j~~~~~~~~~~~,,,,,,,,,#',
    '::::::::::jjj~~jjjjjj~~jjjjj~~::::::::::',
    '::::::::::~~j~~j~~~~j~~j~~~jjj::::::::::',
    '#,,,,,,,,,~~jjjj~~~~jjjj~~~~~~,,,,,,,,,#',
    '#,,,,,,T,,~~~~~j~~~~~~~~~~~~~~,,,,,,T,,#',
    '#,,,,,,,,,~~~~,,,~~~~~~~~~~~~~,,,,,,,,,#',
    '#,,,,,,,,,~~~~,,,~~~~~~~~~~~~~,,,,,,,,,#',
    '#,,,T,,,,,~~~~~~~~~~~~~~~~~~~~,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '########################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'sunny_orchard', spawn: { x: 38, y: 9 } },
    { x: 39, y: 9, w: 1, h: 2, to: 'sunny_last_farm', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Reeds and lily pads, two signs, two purses on the islands, a chest among the
  // reeds, a bench and a haystack.
  textFile: 'interactions/sunnyside.txt',
  props: [
    { sprite: 'sign', x: 8, y: 8, text: 'pond_sign' },
    { sprite: 'sign', x: 31, y: 8, text: 'pond_sign_east' },
    { sprite: 'gold_pouch', x: 19, y: 6, text: 'pond_pouch_island', gold: 75, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gold_pouch', x: 15, y: 14, text: 'pond_pouch_south', gold: 45, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chest', x: 36, y: 3, text: 'pond_chest', gives: 'lemonade', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'bench', x: 6, y: 14, text: 'pond_bench' },
    { sprite: 'haystack', x: 37, y: 17, text: 'pond_haystack' },
    { sprite: 'daisy_patch', x: 7, y: 6, walkable: true },
    { sprite: 'daisy_patch', x: 33, y: 7, walkable: true },
    { sprite: 'buttercups', x: 35, y: 10, walkable: true },
    { sprite: 'sy_reeds', x: 11, y: 3, animation: 'sy_reeds', speed: 1.1 },
    { sprite: 'sy_reeds', x: 14, y: 3, animation: 'sy_reeds', speed: 1.1 },
    { sprite: 'sy_reeds', x: 22, y: 3, animation: 'sy_reeds', speed: 0.9500000000000001 },
    { sprite: 'sy_reeds', x: 26, y: 3, animation: 'sy_reeds', speed: 1.1 },
    { sprite: 'sy_reeds', x: 29, y: 3, animation: 'sy_reeds', speed: 1.1 },
    { sprite: 'sy_reeds', x: 11, y: 16, animation: 'sy_reeds', speed: 1.1 },
    { sprite: 'sy_reeds', x: 19, y: 16, animation: 'sy_reeds', speed: 0.9500000000000001 },
    { sprite: 'sy_reeds', x: 24, y: 16, animation: 'sy_reeds', speed: 0.8 },
    { sprite: 'sy_reeds', x: 28, y: 16, animation: 'sy_reeds', speed: 0.9500000000000001 },
    { sprite: 'sy_reeds', x: 30, y: 12, animation: 'sy_reeds', speed: 0.9500000000000001 },
    { sprite: 'sy_reeds', x: 9, y: 5, animation: 'sy_reeds', speed: 0.8 },
    { sprite: 'sy_reeds', x: 9, y: 14, animation: 'sy_reeds', speed: 0.8 },
    { sprite: 'sy_lily', x: 13, y: 7, animation: 'sy_lily', speed: 1.3, walkable: true },
    { sprite: 'sy_lily', x: 24, y: 6, animation: 'sy_lily', speed: 1.1, walkable: true },
    { sprite: 'sy_lily', x: 26, y: 13, animation: 'sy_lily', speed: 1.3, walkable: true },
    { sprite: 'sy_lily', x: 21, y: 14, animation: 'sy_lily', speed: 1.5, walkable: true },
    { sprite: 'sy_lily', x: 12, y: 14, animation: 'sy_lily', speed: 1.5, walkable: true },
    { sprite: 'sy_lily', x: 28, y: 7, animation: 'sy_lily', speed: 1.3, walkable: true },
    { sprite: 'sy_lily', x: 16, y: 6, animation: 'sy_lily', speed: 1.1, walkable: true },
    { sprite: 'sy_seed_heads', x: 8, y: 4, animation: 'sy_seed_heads', speed: 0.9 },
    { sprite: 'sy_seed_heads', x: 37, y: 6, animation: 'sy_seed_heads', speed: 0.9 },
    { sprite: 'sy_seed_heads', x: 32, y: 12, animation: 'sy_seed_heads', speed: 1.0 },
    { sprite: 'sy_seed_drift', x: 6, y: 10, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 16, y: 3, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 27, y: 16, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 35, y: 6, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 11, y: 17, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
  ],
  tileTexts: { '#': 'field_hedge', W: 'field_hedge', I: 'field_oak', T: 'field_apple', J: 'field_blossom', '~': 'pond_water', j: 'pond_stones' },

  // Two on the shores: one on the north bank (row 3, x 11 to 27) and
  // one on the south (row 17, x 12 to 28). The stones, the islands and both doors
  // are well inside the pond and clear of them. No cutscenes here.
  npcs: [
    { enemy: 'dandylion', x: 14, y: 3, patrol: [11, 27], behaviour: 'wander' },
    { enemy: 'haybob', x: 22, y: 17, patrol: [12, 28], behaviour: 'wander' },
    // A clover snail on the east bank (x 31 to 38, rows 12 to 14), land only, off the stones.
    { enemy: 'clover_snail', x: 34, y: 13, patrol: [31, 38], behaviour: 'patrol' },
    
  ],
};
