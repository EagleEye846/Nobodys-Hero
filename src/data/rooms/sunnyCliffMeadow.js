// THE CLIFF MEADOW: the wind picks up. The fields run out here: the grass turns
// to dune grass, the lane to sand, and there is a gull on every fencepost. A
// windsock streams toward the sea. No puzzle. A purse in the dunes, a chest in the
// south-east corner, a bench with a view of nothing yet. East is the cliff itself.
// Tile key (see src/overworld/brightTiles.js):
//   #  hedgerow (solid)   W  hedgerow face (solid)   ,  meadow   :  dirt lane / sand
//   b  dune (12)   B  dune (24)   I  oak   T  apple tree   J  blossom tree (solid)

import { R5S_PROPS } from '../sunnyLifeProps.js';
export const SUNNY_CLIFF_MEADOW = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'sunny_cliff_meadow',
  // The room's name, for the Room Editor.
  name: 'THE CLIFF MEADOW',
  // The region it's in (src/data/areas.js): the title card and the battle background.
  area: 'sunnyside',
  // Sunnyside's song (src/data/music/sunnysideTheme.js), and the sounds of the place under it.
  music: 'sunnyside',
  ambience: 'beach',
  vesWell: true,

  tiles: [
    '############################################',
    '##WWWW######WWWWW######WWWWWWWWWWWWWWWWWWWW#',
    '#W,,,,WW##WW,,,,,WWWWWW,,,,,,,,,,::::::::::#',
    '#,,,,,,,WW,,,,,,,,,,,,,,,,,,,,,,:::::::::::#',
    '#,I,,T,,,,,,,,T,,,,,,,,,,,,,,:bBBb::::::bb:#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,::::bbbb,,,:::bb:#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,:::::,,,,,,,:::::#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,::::::#',
    '#,,,,,:::::::,,,,,,,,,,,,,,,,,,,,,,::::::::#',
    '::::::::::::::::::::::::::::::::::::::::::::',
    '::::::::,,,,::::::::::::::::::::::::::::::::',
    '#,,,,,,,,,,,,,,,,::::::::,,,,,,::::::::::::#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,:::::::::::#',
    '#,,J,,,,,,,,,,,,T,,,,,,,,,,,,,,,,:::::bbbb:#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,bbb,,,,,::::bbbb:#',
    '#T,,,,,,,T,,,,,,,,I,,,,,,,,,,,,,,,:::::::::#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,::::::::::#',
    '#,,,#####,,,####,,,,,,######,,,::::::::::::#',
    '############################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'sunny_last_farm', spawn: { x: 38, y: 9 } },
    { x: 43, y: 9, w: 1, h: 2, to: 'sunny_sea_view', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // A sign, a windsock, a bench, a purse among the dunes, a chest in the corner;
  // dune grass, sand and drifting seeds.
  textFile: 'interactions/sunnyside.txt',
  props: [
    { sprite: 'sign', x: 4, y: 8, text: 'cliff_sign' },
    { sprite: 'sy_windsock', x: 15, y: 8, text: 'cliff_windsock', animation: 'sy_windsock', speed: 0.3 },
    { sprite: 'bench', x: 21, y: 12, text: 'cliff_bench' },
    { sprite: 'gold_pouch', x: 35, y: 5, text: 'cliff_pouch', gold: 60, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Up on the old bank (jump onto the b, then the B): only seen from the high bits.
    { sprite: 'gold_pouch', x: 31, y: 4, text: 'cliff_bank_pouch', gold: 80, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'chest', x: 42, y: 16, text: 'cliff_chest', gives: 'lemonade', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'sy_sand_patch', x: 27, y: 7, walkable: true, decor: true },
    { sprite: 'sy_sand_patch', x: 35, y: 12, walkable: true, decor: true },
    { sprite: 'sy_sand_patch', x: 41, y: 8, walkable: true, decor: true },
    { sprite: 'sy_sand_patch', x: 30, y: 16, walkable: true, decor: true },
    { sprite: 'sy_sand_patch', x: 24, y: 11, walkable: true, decor: true },
    { sprite: 'daisy_patch', x: 7, y: 6, walkable: true, decor: true },
    { sprite: 'daisy_patch', x: 12, y: 15, walkable: true, decor: true },
    { sprite: 'buttercups', x: 19, y: 6, walkable: true, decor: true },
    { sprite: 'sy_seed_heads', x: 2, y: 5, animation: 'sy_seed_heads', speed: 1.3 },
    { sprite: 'sy_seed_heads', x: 7, y: 12, animation: 'sy_seed_heads', speed: 1.0 },
    { sprite: 'sy_seed_heads', x: 11, y: 6, animation: 'sy_seed_heads', speed: 1.2000000000000002 },
    { sprite: 'sy_seed_heads', x: 13, y: 16, animation: 'sy_seed_heads', speed: 1.1 },
    { sprite: 'sy_seed_heads', x: 19, y: 3, animation: 'sy_seed_heads', speed: 1.0 },
    { sprite: 'sy_seed_heads', x: 20, y: 17, animation: 'sy_seed_heads', speed: 1.1 },
    { sprite: 'sy_seed_heads', x: 24, y: 4, animation: 'sy_seed_heads', speed: 1.1 },
    { sprite: 'sy_seed_heads', x: 25, y: 16, animation: 'sy_seed_heads', speed: 1.0 },
    { sprite: 'sy_seed_heads', x: 26, y: 12, animation: 'sy_seed_heads', speed: 1.2000000000000002 },
    { sprite: 'sy_dune_grass', x: 24, y: 6, animation: 'sy_dune_grass', speed: 0.35, walkable: true, decor: true },
    { sprite: 'sy_dune_grass', x: 28, y: 5, animation: 'sy_dune_grass', speed: 0.35, walkable: true, decor: true },
    { sprite: 'sy_dune_grass', x: 33, y: 9, animation: 'sy_dune_grass', speed: 0.39999999999999997, walkable: true, decor: true },
    { sprite: 'sy_dune_grass', x: 37, y: 7, animation: 'sy_dune_grass', speed: 0.39999999999999997, walkable: true, decor: true },
    { sprite: 'sy_dune_grass', x: 36, y: 16, animation: 'sy_dune_grass', speed: 0.35, walkable: true, decor: true },
    { sprite: 'sy_dune_grass', x: 29, y: 13, animation: 'sy_dune_grass', speed: 0.39999999999999997, walkable: true, decor: true },
    { sprite: 'sy_dune_grass', x: 39, y: 11, animation: 'sy_dune_grass', speed: 0.5, walkable: true, decor: true },
    { sprite: 'sy_dune_grass', x: 42, y: 6, animation: 'sy_dune_grass', speed: 0.44999999999999996, walkable: true, decor: true },
    { sprite: 'sy_dune_grass', x: 22, y: 14, animation: 'sy_dune_grass', speed: 0.44999999999999996, walkable: true, decor: true },
    { sprite: 'sy_dune_grass', x: 26, y: 3, animation: 'sy_dune_grass', speed: 0.44999999999999996, walkable: true, decor: true },
    { sprite: 'sy_dune_grass', x: 35, y: 5, animation: 'sy_dune_grass', speed: 0.5, walkable: true, decor: true },
    { sprite: 'sy_dune_grass', x: 32, y: 14, animation: 'sy_dune_grass', speed: 0.35, walkable: true, decor: true },
    { sprite: 'sy_dune_grass', x: 40, y: 16, animation: 'sy_dune_grass', speed: 0.35, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 8, y: 8, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 17, y: 11, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 22, y: 7, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 30, y: 11, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 34, y: 6, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    // The life pass, round 2 (src/data/sunnyLifeProps.js).
    ...(R5S_PROPS.sunny_cliff_meadow ?? []),
  ],
  tileTexts: { '#': 'field_hedge', W: 'field_hedge', I: 'field_oak', T: 'field_apple', J: 'field_blossom', b: 'cliff_dune', B: 'cliff_dune' },

  // A haybob in the west dunes (x 17 to 26, rows 5 to 7), a bunting in the
  // middle (x 30 to 38, rows 5 to 7) and a dandylion in the south (x 28 to 38,
  // rows 14 to 16). Clear of the lane (rows 9 and 10), the purse (35,5) and both
  // doors; no cutscenes here.
  npcs: [
    { enemy: 'haybob', x: 20, y: 6, patrol: [17, 23], behaviour: 'patrol' },
    // Wanders the middle of the meadow, west of the purse at 35,5, so it is never on top of the pickup (a hand-run or a walk-through line can stand there in peace).
    { enemy: 'capbee', x: 30, y: 6, patrol: [27, 32], behaviour: 'wander' },
    { enemy: 'dandylion', x: 32, y: 15, patrol: [29, 35], behaviour: 'patrol' },
  ],
};
