// THE WINDMILL: the second puzzle, and the first time the chapter asks you to
// split the party with E (Bramble) as well as Q (Ves). It is deliberately light
// and the signs say what to do.
// A long fence runs across the yard under the big windmill, whose sails turn
// the great gear. The lane goes through a pair of gates that only open while two
// scales are held down: one for the hero (12,14, in the open), one for Bramble
// (17,14) inside a ring of bushes with a hole in it just his size (15,14).
//   1. Stand the hero on his scale (12,14).
//   2. Press E, and walk Bramble through the gap onto his scale (17,14). The gates
//      swing open.
//   3. Press Q, and walk Ves through the gates to the brake lever (25,13), on the
//      far side. She hooks it, and a second pair of gates (21,14 and 21,15) opens
//      for good.
//   4. Press R, and everyone's together again; the hero and Bramble walk through
//      the new gates.
// The stump (8,16) puts everyone back at the door if it goes wrong; R always brings
// the party together.
// Tile key (see src/overworld/brightTiles.js):
//   #  hedgerow (solid)   W  hedgerow face (solid)   ,  meadow   :  dirt lane
//   f  white fence (solid)   Z  blossoming bush (solid)   N  buttercup meadow
//   I  oak   T  apple tree   J  blossom tree (solid, standing)

export const SUNNY_WINDMILL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'sunny_windmill',
  // The room's name, for the Room Editor.
  name: 'THE WINDMILL',
  // The region it's in (src/data/areas.js): the title card and the battle background.
  area: 'sunnyside',
  // Sunnyside's song (src/data/music/sunnysideTheme.js), and the sounds of the place under it.
  music: 'sunnyside',
  ambience: 'meadow',
  vesWell: true,
  birds: 3,

  tiles: [
    '########################################',
    '##W####WWWWWWW####WWWWWWWWWWWW####WWWW##',
    '#W,WWWW,,,,,,,WWWW,,,f,,,,,,,,W#WW,,,,W#',
    '#,,,,,,NN,,,,,,,,,,,,f,,,,,,,,,W,,,,I,,#',
    '#,NNNNNNN,,T,,,,,,,,,f,,,,,,T,,,,,,,,,,#',
    '#I,NNNNN,,,,,,,,,,,,,f,,,,,,,,,,,,,,,,,#',
    '#,,NNNN,,,,,,,,,,,,,,f,,,,,,,,,,,J,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,f,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,:::::::,,,,f,,,,,,,,:::,,,,,,#',
    '::::::::::::::::::::::::::::::::::::::::',
    '::::::::::::::::::::::::::::::::::::::::',
    '#,,::::,,,,,,,,,,,,,,f,,:::::,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,ZZZZ,,f,,N,,NNNNNNNN,N,,#',
    '#,,J,,,,,,,,,,,Z,,Z,,f,,NNNNNNNNNNNN,,,#',
    '#,,,,,,,,,,,,,,,,,Z,,,,,NNNNNNNNNNNN,,T#',
    '#,,,,,,,,,,,,,,ZZZZ,,,,,NNNNNNNNNNN,,,,#',
    '#,,,,T,,,,,,,,,,,,,,,f,,,,,,NNN,,,,,T,,#',
    '#,,,,,,,,,####,,,,,,,f,,,,,,,#####,,,,,#',
    '########################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'sunny_dandelion_hill', spawn: { x: 46, y: 9 } },
    { x: 39, y: 9, w: 1, h: 2, to: 'sunny_orchard', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // The windmill and its gear, two signs, the scales, the gap, the gates, the
  // brake lever, a stump that sends everybody back, a wheelbarrow and a bench,
  // a purse, and a chest in the east yard.
  textFile: 'interactions/sunnyside.txt',
  props: [
    // A save stone in the east yard, past the second gates.
    { sprite: 'savepoint', x: 34, y: 8, save: true },
    { sprite: 'sy_windmill', x: 20, y: 6, text: 'mill_windmill', animation: 'sy_windmill', speed: 0.9 },
    { sprite: 'sy_mill_gear', x: 23, y: 8, text: 'mill_gear', animation: 'sy_mill_gear', speed: 0.6 },
    { sprite: 'sign', x: 8, y: 8, text: 'mill_sign' },
    { sprite: 'sign', x: 19, y: 8, text: 'mill_sign_gate' },
    { sprite: 'sy_scale_cart', x: 12, y: 14, text: 'mill_plate_hero', treadle: 'hp', who: 'hero', flat: true },
    { sprite: 'sy_hedge_gap', x: 15, y: 14, text: 'mill_gap', gap: true },
    { sprite: 'sy_scale_sack', x: 17, y: 14, text: 'mill_plate_bramble', treadle: 'bp', who: 'bramble', flat: true },
    { sprite: 'sy_seed_basket', x: 16, y: 13, text: 'mill_sacks' },
    { sprite: 'rock_stump', x: 8, y: 16, text: 'mill_stump', rockReset: true },
    { sprite: 'gate_narrow', x: 21, y: 9, text: 'mill_gate', opensWith: ['hp', 'bp'], openText: 'mill_gate_open' },
    { sprite: 'gate_narrow', x: 21, y: 10, text: 'mill_gate', opensWith: ['hp', 'bp'] },
    { sprite: 'high_lever', x: 25, y: 13, text: 'mill_brake', lever: 'brake', high: true },
    { sprite: 'gate_narrow', x: 21, y: 14, text: 'mill_bypass', opensWith: ['brake'], openText: 'mill_bypass_open' },
    { sprite: 'gate_narrow', x: 21, y: 15, text: 'mill_bypass', opensWith: ['brake'] },
    { sprite: 'sy_wheelbarrow', x: 6, y: 12, text: 'mill_barrow' },
    { sprite: 'haystack', x: 33, y: 12, text: 'mill_haystack' },
    { sprite: 'gold_pouch', x: 3, y: 17, text: 'mill_pouch', gold: 50, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chest', x: 37, y: 17, text: 'mill_chest', gives: 'sea_boots', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'bench', x: 27, y: 7, text: 'mill_bench' },
    { sprite: 'daisy_patch', x: 13, y: 7, walkable: true },
    { sprite: 'daisy_patch', x: 30, y: 14, walkable: true },
    { sprite: 'buttercups', x: 25, y: 4, walkable: true },
    { sprite: 'sy_seed_heads', x: 2, y: 8, animation: 'sy_seed_heads', speed: 1.1 },
    { sprite: 'sy_seed_heads', x: 10, y: 12, animation: 'sy_seed_heads', speed: 1.1 },
    { sprite: 'sy_seed_heads', x: 19, y: 16, animation: 'sy_seed_heads', speed: 1.3 },
    { sprite: 'sy_seed_heads', x: 26, y: 16, animation: 'sy_seed_heads', speed: 1.2000000000000002 },
    { sprite: 'sy_seed_heads', x: 31, y: 4, animation: 'sy_seed_heads', speed: 1.0 },
    { sprite: 'sy_seed_heads', x: 9, y: 3, animation: 'sy_seed_heads', speed: 1.0 },
    { sprite: 'sy_seed_heads', x: 37, y: 12, animation: 'sy_seed_heads', speed: 1.0 },
    { sprite: 'sy_seed_drift', x: 6, y: 5, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 14, y: 6, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 19, y: 12, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 26, y: 10, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 31, y: 15, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
    { sprite: 'sy_seed_drift', x: 35, y: 5, animation: 'sy_seed_drift', speed: 0.45, walkable: true },
  ],
  tileTexts: { '#': 'field_hedge', W: 'field_hedge', I: 'field_oak', T: 'field_apple', J: 'field_blossom', Z: 'blossom_bush', f: 'soft_fence' },

  // One haybob in the north-west corner of the west yard (x 4 to 12, rows 3 to 5),
  // and a dandylion and a clover snail in the east yard (x 26 to 36, rows 4 and 14; the
  // save stone is at 34,8, below the snail's patrol).
  // None can reach either scale, the gap ring or a gate, and the lane (rows 9
  // and 10) is clear. No cutscenes here.
  npcs: [
    { enemy: 'haybob', x: 7, y: 4, patrol: [4, 10], behaviour: 'patrol' },
    { enemy: 'dandylion', x: 30, y: 14, patrol: [27, 33], behaviour: 'patrol' },
    { enemy: 'clover_snail', x: 33, y: 4, patrol: [29, 36], behaviour: 'patrol' },
  ],
};
