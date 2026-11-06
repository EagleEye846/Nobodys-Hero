// THE LAST FARM: the last farm in Sunnyside, with a save point, a bench, a
// yard of hens, a scarecrow among the crops, and Farmer Tolliver, an ancient
// tortoise in a waistcoat who has farmed this land for two hundred years and has
// never once gone to see the sea. It's only a few fields on. It'll keep. (He asks
// you to tell him what it's like, on the way back.) No monsters in a save room.
// Tile key (see src/overworld/brightTiles.js):
//   #  hedgerow (solid)   W  hedgerow face (solid)   ,  meadow   :  dirt lane
//   f  white fence   F  crop bed (solid)   N  buttercup meadow
//   5 6 7 8  the farmhouse: wall, window, thatch, green door (solid)
//   I  oak   T  apple tree   J  blossom tree (solid, standing)

export const SUNNY_LAST_FARM = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'sunny_last_farm',
  // The room's name, for the Room Editor.
  name: 'THE LAST FARM',
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
    '#,,,777777,,,,NNNNNNNN,,,,NNNNNNNN,,,,,#',
    '#,,,565856,,,,NNNNNNNN,,,,NNNNNNNN,,,,,#',
    '#,,,,,,,,,,,,,NNNNNNNN,,,,NNNNNNNN,,T,,#',
    '#,,,,,,,,,,,,,NNNNNNNN,,,,,,,,,,,,,,,,,#',
    '#,fffff,ffff,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '::::::::::::::::::::::::::::::::::::::::',
    '::::::::::::::::::::::::::::::::::::::::',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,FFFFFFFFFFFFFF,,,,,,,,,#',
    '#,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,FFFFFFFFFFFFFF,,,,,T,,,#',
    '#,J,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,T,,,FFFFFFFFFFFFFF,,,J,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '########################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'sunny_mill_pond', spawn: { x: 38, y: 9 } },
    { x: 39, y: 9, w: 1, h: 2, to: 'sunny_cliff_meadow', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Farmer Tolliver, the save point, signs, hens, a scarecrow, a bench, haystacks,
  // a purse and a chest.
  textFile: 'interactions/sunnyside.txt',
  props: [
    { sprite: 'sy_tortoise', x: 29, y: 8, npc: 'tolliver', animation: 'sy_tortoise', speed: 1.2 },
    { sprite: 'savepoint', x: 13, y: 8, save: true },
    { sprite: 'sign', x: 8, y: 8, text: 'farm_sign' },
    { sprite: 'sign', x: 35, y: 8, text: 'farm_sign_east' },
    { sprite: 'scarecrow', x: 22, y: 13, text: 'farm_scarecrow', animation: 'scarecrow', speed: 0.5 },
    { sprite: 'sy_hen', x: 5, y: 6, text: 'farm_hen', animation: 'sy_hen', speed: 0.7 },
    { sprite: 'sy_hen', x: 9, y: 6, text: 'farm_hen', animation: 'sy_hen', speed: 0.9 },
    { sprite: 'sy_hen', x: 7, y: 5, text: 'farm_hen', animation: 'sy_hen', speed: 0.8 },
    { sprite: 'bench', x: 15, y: 8, text: 'farm_bench' },
    { sprite: 'sy_wheelbarrow', x: 6, y: 12, text: 'farm_barrow' },
    { sprite: 'haystack', x: 33, y: 12, text: 'farm_haystack' },
    { sprite: 'haystack', x: 18, y: 5, text: 'farm_haystack' },
    { sprite: 'gold_pouch', x: 2, y: 17, text: 'farm_pouch', gold: 55, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chest', x: 37, y: 17, text: 'farm_chest', gives: 'jam_tart', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'daisy_patch', x: 26, y: 7, walkable: true },
    { sprite: 'daisy_patch', x: 10, y: 13, walkable: true },
    { sprite: 'buttercups', x: 24, y: 10, walkable: true },
    { sprite: 'buttercups', x: 36, y: 11, walkable: true },
    { sprite: 'sy_seed_heads', x: 2, y: 11, animation: 'sy_seed_heads', speed: 0.9 },
    { sprite: 'sy_seed_heads', x: 8, y: 16, animation: 'sy_seed_heads', speed: 1.1 },
    { sprite: 'sy_seed_heads', x: 14, y: 12, animation: 'sy_seed_heads', speed: 0.9 },
    { sprite: 'sy_seed_heads', x: 31, y: 5, animation: 'sy_seed_heads', speed: 1.1 },
    { sprite: 'sy_seed_heads', x: 38, y: 12, animation: 'sy_seed_heads', speed: 1.2000000000000002 },
    { sprite: 'sy_seed_heads', x: 24, y: 17, animation: 'sy_seed_heads', speed: 0.9 },
    { sprite: 'sy_seed_heads', x: 30, y: 15, animation: 'sy_seed_heads', speed: 1.3 },
    { sprite: 'sy_seed_drift', x: 4, y: 10, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 12, y: 5, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 20, y: 7, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 28, y: 11, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 33, y: 8, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 14, y: 17, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'butterflies', x: 24, y: 6, animation: 'butterflies', speed: 0.2, walkable: true },
  ],
  tileTexts: { '#': 'field_hedge', W: 'field_hedge', F: 'field_flowers', T: 'field_apple', J: 'field_blossom', f: 'soft_fence', '5': 'cottage_wall', '6': 'cottage_window', '7': 'cottage_roof', '8': 'farm_door' },

  // None: a save room, with a tortoise.
  npcs: [
  ],
};
