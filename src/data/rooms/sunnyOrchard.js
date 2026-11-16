// THE ORCHARD: rows of apple trees, a lane through the middle, a smell of warm
// fruit and wasps. Puzzle-free for everyone except the curious. In the north is a
// neat ring of bushes with a locked gate and, inside it, a round green door set
// into a grassy bank. The gate is tied shut from the inside. On the ring's west
// side the bushes have died back over an old bank, terraced like the cliff
// meadow's (b at x 15-16, B at x 17, rows 3-5): jump up the low step, onto the
// bank, and drop down inside, then pull the lever (anyone can) and the gate opens for the others,
// and the door is secret_sunny_burrow. (2026-11-10: it was a hole only Bramble
// fitted, with his own lever; too like the Gaps and the Echo Hall's secret, so
// now nobody splits up. Old file in notes/room-backup-2026-11-10b/.)
// Tile key (see src/overworld/brightTiles.js):
//   #  hedgerow (solid)   W  hedgerow face (solid)   ,  meadow   :  dirt lane
//   Z  blossoming bush (solid)   N  buttercup meadow   T  apple tree (solid)
//   b B  the old turf bank in the ring's west side (12 and 24 high)

import { R5S_PROPS } from '../sunnyLifeProps.js';
export const SUNNY_ORCHARD = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'sunny_orchard',
  // The room's name, for the Room Editor.
  name: 'THE ORCHARD',
  // The region it's in (src/data/areas.js): the title card and the battle background.
  area: 'sunnyside',
  // Sunnyside's song (src/data/music/sunnysideTheme.js), and the sounds of the place under it.
  music: 'sunnyside',
  ambience: 'meadow',
  vesWell: true,
  birds: 3,

  tiles: [
    '########################################',
    '##W######WWWWWWWWWWWWWWWWW#####WWWWWWW##',
    '#W,WW##WW,,,,,,,,ZZZZZZ,,,WWWWW,,,,,,,W#',
    '#,,,,WW,,,,,,,,,bB,,,,Z,,,,,,,,,,,,,,,,#',
    '#,,,T,,,T,,,T,,bbB,,,,Z,,,,,,T,,,,,,,T,#',
    '#,,,,,,,,,,,,,,bbB,,,,Z,,,,,,,,,,T,,,,,#',
    '#,,T,,,T,,,,,,,,,ZZ,,ZZ,,,,,T,,,,,,,,,,#',
    '#,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,NNN,,,,,#',
    '#,,,,,,,,:::::,,,,,,,,,,,,::::NNNNNN,,,#',
    '::::::::::::::::::::::::::::::::::::::::',
    '::::::::::::::,,,,,:::::::::::::::::::::',
    '#,,NNN:::::,,,,,,,,,::::::,,,,,,,,,,,,,#',
    '#I,NNN,,,,T,,,,,,,,T,,,,,,,,,,,,,,T,,,,#',
    '#,,,T,,,T,,,T,,,T,,,,T,,T,,,T,,,,T,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,T,,,T,,,,T,,T,,,T,,,,T,,T,,,T,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,I#',
    '#,,,,,T,,####,T,,####,,T,,,,,,T,,####,,#',
    '########################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'sunny_windmill', spawn: { x: 38, y: 9 } },
    { x: 39, y: 9, w: 1, h: 2, to: 'sunny_mill_pond', spawn: { x: 1, y: 9 } },
    { x: 19, y: 3, w: 2, h: 1, to: 'secret_sunny_burrow', spawn: { x: 6, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // The bush ring: the bank over its west side, a lever, a gate, and the burrow door.
  // Beehives, apple crates, a bench, signs, a purse in the south-west corner.
  textFile: 'interactions/sunnyside.txt',
  props: [
    { sprite: 'sign', x: 4, y: 8, text: 'orch_sign' },
    { sprite: 'sign', x: 33, y: 8, text: 'orch_sign_east' },
    { sprite: 'lever', x: 18, y: 5, text: 'orch_lever', lever: 'burrow' },
    { sprite: 'meadow_gate', x: 19, y: 6, text: 'orch_gate', opensWith: ['burrow'], openText: 'orch_gate_open' },
    { sprite: 'sy_burrow_door', x: 19, y: 3, text: 'orch_burrow', walkable: true },
    { sprite: 'sy_beehive', x: 33, y: 3, text: 'orch_hive', animation: 'sy_beehive', speed: 0.3 },
    { sprite: 'sy_beehive', x: 35, y: 3, text: 'orch_hive', animation: 'sy_beehive', speed: 0.37 },
    { sprite: 'sy_apple_crate', x: 14, y: 7, text: 'orch_crate' },
    { sprite: 'sy_apple_crate', x: 15, y: 7, text: 'orch_crate' },
    { sprite: 'sy_apple_crate', x: 27, y: 14, text: 'orch_crate' },
    { sprite: 'gold_pouch', x: 2, y: 16, text: 'orch_pouch', gold: 55, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'bench', x: 25, y: 7, text: 'orch_bench' },
    { sprite: 'sy_wheelbarrow', x: 37, y: 14, text: 'orch_barrow' },
    { sprite: 'daisy_patch', x: 14, y: 8, walkable: true, decor: true },
    { sprite: 'daisy_patch', x: 26, y: 11, walkable: true, decor: true },
    { sprite: 'buttercups', x: 8, y: 14, walkable: true, decor: true },
    { sprite: 'buttercups', x: 37, y: 12, walkable: true, decor: true },
    { sprite: 'sy_seed_heads', x: 2, y: 4, animation: 'sy_seed_heads', speed: 1.2000000000000002 },
    { sprite: 'sy_seed_heads', x: 16, y: 12, animation: 'sy_seed_heads', speed: 1.3 },
    { sprite: 'sy_seed_heads', x: 30, y: 5, animation: 'sy_seed_heads', speed: 0.9 },
    { sprite: 'sy_seed_heads', x: 37, y: 6, animation: 'sy_seed_heads', speed: 0.9 },
    { sprite: 'sy_seed_heads', x: 36, y: 16, animation: 'sy_seed_heads', speed: 1.2000000000000002 },
    { sprite: 'sy_seed_drift', x: 8, y: 5, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 15, y: 10, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 25, y: 7, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 31, y: 12, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 37, y: 9, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 12, y: 16, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'butterflies', x: 28, y: 9, animation: 'butterflies', speed: 0.2, walkable: true, decor: true },
    // The life pass, round 2 (src/data/sunnyLifeProps.js).
    ...(R5S_PROPS.sunny_orchard ?? []),
  ],
  tileTexts: { b: 'orch_bank', B: 'orch_bank', '#': 'field_hedge', W: 'field_hedge', T: 'field_apple', Z: 'blossom_bush' },

  // A dandylion in the north-east orchard (x 24 to 33, rows 4 to 6; the hives are
  // at 33 and 35, row 3, so it keeps just short of them) and a bunting in the
  // south-west (x 5 to 12, row 14). Both are far from the ring in the north (x 17
  // to 22), the bank, the gate and the door, and from the lane. No cutscenes.
  npcs: [
    { enemy: 'dandylion', x: 28, y: 5, patrol: [25, 31], behaviour: 'patrol' },
    { enemy: 'capbee', x: 8, y: 14, patrol: [5, 12], behaviour: 'wander' },
    // A seed sheep grazes the south-east rows (x 27 to 36, rows 14 to 16), among the trees.
    { enemy: 'seed_sheep', x: 31, y: 16, patrol: [27, 36], behaviour: 'patrol' },
  ],
};
