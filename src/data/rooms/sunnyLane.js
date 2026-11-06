// THE LANE: a long dirt lane across the meadow with Marigold's lemonade stand
// beside it, a save point, and the first gentle puzzle of the chapter. The lane
// runs east between two thick hedges, and a white meadow gate across it is
// shut. Its latch is a lever, round the back in the field to the north, where
// a haybob (a runaway hay bale in a straw hat, very pleased with itself) rolls
// about between you and the scarecrow that's watching the lever. Pull it and
// the gate swings open; past the gate, the east end of the lane has a purse,
// some haystacks and a sign that says more than it means to.
// Tile key (see src/overworld/brightTiles.js):
//   #  hedgerow, leafy top (solid)       W  hedgerow, leafy face (solid)
//   V  blossom hedge (solid)             H  hedge hung with bunting (solid)
//   :  golden dirt lane                  ,  lush meadow grass
//   I  big oak   T  apple tree   J  pink blossom tree (all solid, standing)
//   F  wildflower bed (solid)
//   5 6 7 8  the little cottage: wall, window, thatch, green door (solid)
export const SUNNY_LANE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'sunny_lane',
  // The room's name, for the Room Editor.
  name: 'THE LANE',
  // The region it's in (see src/data/areas.js): names the title card you see
  // on arriving from another region, and picks the battle background.
  area: 'sunnyside',
  // "Sunnyside": the Sunnyside song (src/data/music/sunnysideTheme.js).
  music: 'sunnyside',
  // The sounds of the place, under the song (see AMBIENCES in src/audio/music.js).
  ambience: 'meadow',
  vesWell: true,
  birds: 3,

  tiles: [
    '######################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#,,,,,,,,,,,,,,,,,,,,,######,,,,,,,,,#',
    '#,,,,,,,,,J,,,,,,,,,,,VVVVVV,,,,,,,,,#',
    '#,,,,I,,,,,,,,,,,,,,,,VVVVVV,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,VVVVVV,,,,T,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,VVVVVV,,,,,,,,,#',
    '#,,,,,FF,,,,,,,,,,,,,,VVVVVV,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,HHHHHH,,,,,,,,,#',
    '::::::::::::::::::::::::::::::::::::::',
    '::::::::::::::::::::::::::::::::::::::',
    '#,,,,,,,,,,,,,,,,,,,,,VVVVVV,,,,,,,,,#',
    '#,,,,,,,,,,,,FF,,,,,,,VVVVVV,,,,,,,,,#',
    '#,,777,,,,,,,,,,J,,,,,VVVVVV,,,,,I,,,#',
    '#,,568,,T,,,,,,,,,,,,,VVVVVV,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,WWWWWW,,,,,,,,,#',
    '######################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
  ],

  // Where the player starts, in tile coordinates (the lane's west end).
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'sunny_gate_field', spawn: { x: 28, y: 10 } },
    { x: 37, y: 9, w: 1, h: 2, to: 'sunny_brook', spawn: { x: 1, y: 7 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // Marigold (she stands beside her stand, and sells from it), a save point, a
  // rabbit hole, the latch lever and the gate it works, the scarecrow, signs,
  // haystacks, a bench, flowers; a purse past the gate.
  textFile: 'interactions/sunnyside.txt',
  props: [
    { sprite: 'bf_marigold', x: 9, y: 8, shop: 'marigold_stand', animation: 'bf_marigold', speed: 0.5 },
    { sprite: 'bf_lemonade_stand', x: 10, y: 8, text: 'lemonade_stand', animation: 'bf_lemonade_stand', speed: 0.4 },
    { sprite: 'savepoint', x: 14, y: 7, save: true },
    { sprite: 'rabbit_hole', x: 4, y: 11, text: 'rabbit_hole' },
    { sprite: 'sign', x: 3, y: 8, text: 'lane_sign_west' },
    { sprite: 'sign', x: 21, y: 8, text: 'lane_sign_gate' },
    { sprite: 'lever', x: 19, y: 3, text: 'lane_lever', lever: 'latch' },
    { sprite: 'meadow_gate', x: 24, y: 9, text: 'lane_gate', opensWith: ['latch'], openText: 'lane_gate_open' },
    { sprite: 'meadow_gate', x: 24, y: 10, text: 'lane_gate', opensWith: ['latch'] },
    { sprite: 'scarecrow', x: 16, y: 4, text: 'scarecrow', animation: 'scarecrow', speed: 0.5 },
    { sprite: 'haystack', x: 12, y: 3, text: 'lane_haystack' },
    { sprite: 'haystack', x: 31, y: 13, text: 'lane_haystack' },
    { sprite: 'haystack', x: 34, y: 7, text: 'lane_haystack' },
    { sprite: 'bench', x: 18, y: 12, text: 'lane_bench' },
    { sprite: 'sign', x: 29, y: 8, text: 'lane_sign_east' },
    { sprite: 'gold_pouch', x: 35, y: 3, text: 'lane_pouch', gold: 80, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'daisy_patch', x: 7, y: 4, walkable: true },
    { sprite: 'daisy_patch', x: 15, y: 13, walkable: true },
    { sprite: 'daisy_patch', x: 31, y: 5, walkable: true },
    { sprite: 'daisy_patch', x: 33, y: 11, walkable: true },
    { sprite: 'buttercups', x: 6, y: 6, walkable: true },
    { sprite: 'buttercups', x: 17, y: 6, walkable: true },
    { sprite: 'buttercups', x: 20, y: 14, walkable: true },
    { sprite: 'buttercups', x: 36, y: 14, walkable: true },
    { sprite: 'butterflies', x: 13, y: 5, animation: 'butterflies', speed: 0.2, walkable: true },
    { sprite: 'butterflies', x: 7, y: 12, animation: 'butterflies', speed: 0.2, walkable: true },
    { sprite: 'butterflies', x: 32, y: 8, animation: 'butterflies', speed: 0.2, walkable: true },
    { sprite: 'picnic_blanket', x: 29, y: 3, text: 'lane_picnic', walkable: true },
  ],
  tileTexts: {
    '#': 'lane_hedge', W: 'lane_hedge', V: 'lane_blossom_hedge', H: 'lane_bunting',
    F: 'field_flowers', I: 'field_oak', T: 'field_apple', J: 'field_blossom',
    '5': 'cottage_wall', '6': 'cottage_window', '7': 'cottage_roof', '8': 'cottage_door',
  },

  // One haybob, rolling about the field north of the lane between you and the
  // lever (from x 14 to 21, rows 4 to 6), and a bunting hopping about the
  // field south of the lane, west of the gate (x 9 to 15, rows 13 to 15), well
  // away from Marigold, the save point and the lane itself (rows 9 and 10).
  // Neither goes near a door, and nothing walks across a cutscene here.
  npcs: [
    { enemy: 'haybob', x: 17, y: 5, patrol: [14, 21], behaviour: 'wander' },
    { enemy: 'bunting', x: 11, y: 14, patrol: [9, 15], behaviour: 'wander' },
  ],

  // CHAPTER 5 (src/overworld/chapterRooms.js): the lane again. The dandelions
  // have gone to seed, Marigold's stand is still open, a dandylion has the haybob's
  // field, the bunting is back, and a flatcap bee works the east field. Both keep to the fields (rows 4 to 6
  // and 13 to 15), well clear of the lane, the stand and the save point.
  chapter5: {
    textSwap: { scarecrow: 'scarecrow_5', lane_sign_east: 'lane_sign_east_5' },
    addProps: [
      { sprite: 'sy_seed_heads', x: 34, y: 12, animation: 'sy_seed_heads', speed: 0.9 },
      { sprite: 'sy_seed_heads', x: 21, y: 14, animation: 'sy_seed_heads', speed: 1.0 },
      { sprite: 'sy_seed_heads', x: 32, y: 15, animation: 'sy_seed_heads', speed: 1.3 },
      { sprite: 'sy_seed_heads', x: 33, y: 5, animation: 'sy_seed_heads', speed: 1.0 },
      { sprite: 'sy_seed_heads', x: 19, y: 12, animation: 'sy_seed_heads', speed: 0.9 },
      { sprite: 'sy_seed_heads', x: 28, y: 13, animation: 'sy_seed_heads', speed: 1.3 },
      { sprite: 'sy_seed_heads', x: 5, y: 2, animation: 'sy_seed_heads', speed: 1.1 },
      { sprite: 'sy_seed_heads', x: 9, y: 14, animation: 'sy_seed_heads', speed: 1.1 },
      { sprite: 'sy_seed_heads', x: 11, y: 5, animation: 'sy_seed_heads', speed: 1.1 },
      { sprite: 'sy_seed_heads', x: 4, y: 5, animation: 'sy_seed_heads', speed: 1.2 },
      { sprite: 'sy_seed_heads', x: 29, y: 5, animation: 'sy_seed_heads', speed: 1.2 },
      { sprite: 'sy_seed_heads', x: 17, y: 14, animation: 'sy_seed_heads', speed: 1.2 },
      { sprite: 'sy_seed_drift', x: 8, y: 4, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 10, y: 2, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 11, y: 12, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 3, y: 12, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 6, y: 13, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 15, y: 12, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 13, y: 3, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 21, y: 7, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
      { sprite: 'sy_seed_drift', x: 31, y: 3, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    ],
    npcs: [
      { enemy: 'dandylion', x: 17, y: 5, patrol: [14, 20], behaviour: 'patrol' },
      { enemy: 'bunting', x: 11, y: 14, patrol: [9, 15], behaviour: 'wander' },
      // A flatcap bee works the clover in the east field (x 29 to 36, rows 12 to 14), past
      // the blossom hedge, well clear of the lane (rows 9 and 10).
      { enemy: 'capbee', x: 32, y: 13, patrol: [29, 36], behaviour: 'wander' },
    ],
  },
};
