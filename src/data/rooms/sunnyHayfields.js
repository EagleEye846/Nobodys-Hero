// THE HAYFIELDS: Sunnyside in late summer, a wide gold field with the hay half cut
// and a lane through the middle. Nothing to solve here, which is the point: it's
// a field. The one bit of drama is a picnic somebody laid out near the middle,
// and the gulls that have found it. (The sea is only a few fields off, and the
// gulls have been coming further inland every year, as gulls will.) Bales stand
// in a wall in the south-west, and a purse hides in a pen of them, open at the
// corner. A chest sits in the north-east where the hay ends.
// A puzzle-free room.
// Tile key (see src/overworld/brightTiles.js):
//   #  hedgerow (solid)   W  hedgerow face (solid)   ,  meadow   :  dirt lane
//   N  buttercup meadow (the hay stubble)   O  round hay bale (solid)
//   I  oak   T  apple tree   J  blossom tree (solid, standing)

export const SUNNY_HAYFIELDS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'sunny_hayfields',
  // The room's name, for the Room Editor.
  name: 'THE HAYFIELDS',
  // The region it's in (src/data/areas.js): the title card and the battle background.
  area: 'sunnyside',
  // Sunnyside's song (src/data/music/sunnysideTheme.js), and the sounds of the place under it.
  music: 'sunnyside',
  ambience: 'meadow',
  vesWell: true,
  birds: 3,

  tiles: [
    '########################################',
    '##WWWWW######WWWWWWWWWWW####WWWWWWWWWW##',
    '#W,,,,,WW##WW,,,,,,,,,,,WWWW,,,NNN,,,,W#',
    '#,,NNNNNNWWNN,,,,,,,,,,,,,,,,INNNNNN,,,#',
    '#I,NNNNNNNNNN,T,,,,,,,,,,,,,,,NNNNNN,,,#',
    '#,,NNNNNNNNNN,,,,,,,,,,,,,,,,,NNNNNNJ,,#',
    '#,,NNNNNTNNNN,,,,,,,,,,,,,,,T,NNNNNN,,,#',
    '#,,,NNNNNNN,,,,,,,,,,,,,,,,,,,,NNNN,,,,#',
    '#,,,,,NNN,,,:::::::::::,,,,,,:::,,,,,,,#',
    '::::::::::::::::::::::::::::::::::::::::',
    '::::::::::::::::::,,,,::::::::::::::::::',
    '#,,,,,::::NN,,,,,,,,,,,,,:::::,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,NNNNNNNNNNN,,,,,,,,,,,,#',
    '#,,,,,,OOOO,,,,NNNNNNNNNNNNNN,,,,,,,,,,#',
    '#,,,,,OOOOOO,,NNNNNNNNNNNNNN,,,,,T,,,,,#',
    '#OOO,,,,OO,,,,,NNNNNNNTNNNNN,,,,,,,,,,,#',
    '#,,O,,,,,,,,,J,,,NNNNN,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,###,,,,,,,,,#####,,,,,,T,#',
    '########################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'sunny_soft_field', spawn: { x: 36, y: 9 } },
    { x: 39, y: 9, w: 1, h: 2, to: 'sunny_dandelion_hill', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Signs, the raided picnic and its scarecrow, a wheelbarrow, a bench, haystacks,
  // a purse in a pen of bales, a chest in the north-east; the dandelions gone
  // to seed and seeds drifting (atmosphere).
  textFile: 'interactions/sunnyside.txt',
  props: [
    { sprite: 'sign', x: 4, y: 8, text: 'hay_sign_west' },
    { sprite: 'sign', x: 33, y: 8, text: 'hay_sign_east' },
    { sprite: 'sy_picnic_raided', x: 19, y: 5, text: 'hay_picnic', walkable: true },
    { sprite: 'scarecrow', x: 24, y: 5, text: 'hay_scarecrow', animation: 'scarecrow', speed: 0.5 },
    { sprite: 'sy_wheelbarrow', x: 30, y: 13, text: 'hay_barrow' },
    { sprite: 'haystack', x: 6, y: 17, text: 'hay_haystack' },
    { sprite: 'haystack', x: 35, y: 16, text: 'hay_haystack' },
    { sprite: 'haystack', x: 17, y: 3, text: 'hay_haystack' },
    { sprite: 'gold_pouch', x: 2, y: 16, text: 'hay_pouch', gold: 40, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chest', x: 38, y: 3, text: 'hay_chest', gives: 'oilskin_coat', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'bench', x: 24, y: 12, text: 'hay_bench' },
    { sprite: 'daisy_patch', x: 21, y: 8, walkable: true },
    { sprite: 'daisy_patch', x: 9, y: 16, walkable: true },
    { sprite: 'daisy_patch', x: 31, y: 11, walkable: true },
    { sprite: 'buttercups', x: 16, y: 2, walkable: true },
    { sprite: 'buttercups', x: 26, y: 15, walkable: true },
    { sprite: 'buttercups', x: 5, y: 9, walkable: true },
    { sprite: 'sy_seed_heads', x: 3, y: 3, animation: 'sy_seed_heads', speed: 1.3 },
    { sprite: 'sy_seed_heads', x: 10, y: 5, animation: 'sy_seed_heads', speed: 0.9 },
    { sprite: 'sy_seed_heads', x: 15, y: 6, animation: 'sy_seed_heads', speed: 1.0 },
    { sprite: 'sy_seed_heads', x: 27, y: 4, animation: 'sy_seed_heads', speed: 1.2000000000000002 },
    { sprite: 'sy_seed_heads', x: 33, y: 5, animation: 'sy_seed_heads', speed: 1.0 },
    { sprite: 'sy_seed_heads', x: 30, y: 16, animation: 'sy_seed_heads', speed: 1.0 },
    { sprite: 'sy_seed_heads', x: 36, y: 12, animation: 'sy_seed_heads', speed: 1.3 },
    { sprite: 'sy_seed_heads', x: 20, y: 16, animation: 'sy_seed_heads', speed: 1.0 },
    { sprite: 'sy_seed_heads', x: 5, y: 12, animation: 'sy_seed_heads', speed: 1.1 },
    { sprite: 'sy_seed_heads', x: 22, y: 3, animation: 'sy_seed_heads', speed: 1.1 },
    { sprite: 'sy_seed_heads', x: 38, y: 15, animation: 'sy_seed_heads', speed: 1.0 },
    { sprite: 'sy_seed_heads', x: 8, y: 17, animation: 'sy_seed_heads', speed: 1.2000000000000002 },
    { sprite: 'sy_seed_drift', x: 7, y: 4, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 13, y: 8, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 18, y: 7, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 26, y: 11, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 32, y: 13, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 36, y: 8, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 10, y: 16, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 23, y: 16, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'butterflies', x: 20, y: 11, animation: 'butterflies', speed: 0.2, walkable: true },
    { sprite: 'butterflies', x: 34, y: 4, animation: 'butterflies', speed: 0.2, walkable: true },
  ],
  tileTexts: { '#': 'field_hedge', W: 'field_hedge', I: 'field_oak', T: 'field_apple', J: 'field_blossom', O: 'hay_bales' },

  // A haybob and a seed sheep at the picnic (the north field, x 15 to 29, rows 4 to 7), well
  // away from the lane (rows 9 and 10), both doors and the purse pen. No
  // cutscenes in this room, so nothing crosses their ranges.
  npcs: [
    { enemy: 'haybob', x: 17, y: 6, patrol: [14, 20], behaviour: 'patrol' },
    { enemy: 'seed_sheep', x: 26, y: 5, patrol: [23, 29], behaviour: 'patrol' },
    // A flatcap bee in the clover of the south-east field (x 30 to 37, rows 13 to 15): home
    // row 14, so it never drifts up into the lane (rows 9 and 10) or the east door's arrival (38,9).
    { enemy: 'capbee', x: 31, y: 14, patrol: [30, 37], behaviour: 'wander' },
    
  ],
};
