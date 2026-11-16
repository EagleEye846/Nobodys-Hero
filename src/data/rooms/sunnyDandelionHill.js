// DANDELION HILL: the first of the chapter's two puzzles, and a gentle one. A long
// hill, cut across by three hedges (the second so thick that there's a grassy
// island in the middle of it). No gap, no gate, no way round. But the dandelions
// here have all gone to seed, and a seed clock is a lever that only Ves can reach
// (she hooks it with her umbrella): puff it, and a cloud of seeds blows up beside
// the hedge and tosses whoever steps in it over to the other side.
//   1. West of the first hedge: the first clock (8,13). The cloud lifts you from
//      the lane to the middle meadow.
//   2. The middle meadow: the second clock (18,14), and a pen of bank steps up to a
//      purse. Its cloud lifts you onto the island in the second hedge.
//   3. The island: the third clock (30,11). Its cloud lifts you out over the east
//      side of the hedge, to the last meadow and the way on.
// Every cloud has one coming back, so nothing here can be got wrong. The clocks
// can be puffed flat again with Z (the seeds settle).
// Tile key (see src/overworld/brightTiles.js):
//   #  hedgerow (solid)   W  hedgerow face (solid)   V  blossom hedge (solid)
//   ,  meadow   :  dirt lane   N  buttercup meadow   b  bank (12)   B  bank (24)
//   I  oak   T  apple tree   J  blossom tree (solid, standing)

import { R5S_PROPS } from '../sunnyLifeProps.js';
export const SUNNY_DANDELION_HILL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'sunny_dandelion_hill',
  // The room's name, for the Room Editor.
  name: 'DANDELION HILL',
  // The region it's in (src/data/areas.js): the title card and the battle background.
  area: 'sunnyside',
  // Sunnyside's song (src/data/music/sunnysideTheme.js), and the sounds of the place under it.
  music: 'sunnyside',
  ambience: 'meadow',
  vesWell: true,
  birds: 2,

  // The seed clouds (src/overworld/seedCloud.js): updrafts that only blow while their
  // seed clock is puffed. Each hedge has a pair of them, one on either side, which
  // toss you over to the other.
  gusts: [
    { x: 12, y: 9, to: { x: 16, y: 9 }, seeds: true, when: 'hill_a' },
    { x: 15, y: 9, to: { x: 11, y: 9 }, seeds: true, when: 'hill_a' },
    { x: 12, y: 10, to: { x: 16, y: 10 }, seeds: true, when: 'hill_a' },
    { x: 15, y: 10, to: { x: 11, y: 10 }, seeds: true, when: 'hill_a' },
    { x: 27, y: 9, to: { x: 29, y: 10 }, seeds: true, when: 'hill_b' },
    { x: 27, y: 10, to: { x: 29, y: 10 }, seeds: true, when: 'hill_b' },
    { x: 29, y: 11, to: { x: 26, y: 10 }, seeds: true, when: 'hill_b' },
    { x: 31, y: 10, to: { x: 34, y: 10 }, seeds: true, when: 'hill_c' },
    { x: 33, y: 9, to: { x: 29, y: 10 }, seeds: true, when: 'hill_c' },
    { x: 33, y: 10, to: { x: 29, y: 10 }, seeds: true, when: 'hill_c' },
  ],

  tiles: [
    '################################################',
    '##W#####WWWWWWWW#####WWWWWWWWWWWWWW##WWWWWW#####',
    '#W,WW##W,,,,VVV,WW#WW,,,,,,,VVVVVV,WW,,,,,,WWWW#',
    '#,,,,WW,,T,,VVV,,,W,,,,BBBB,VVVVVV,,,,,,I,,,,,,#',
    '#,,,,,NNNN,,,VVV,,,,,,bBBBB,VVVVV,,,,NNNNNN,,,,#',
    '#,,,NNNNNN,,,VVV,,,T,,bb,,,,VVVVV,,NNNNNNNN,,,,#',
    '#,,NNNNNNN,,,VV,,,,,,,,,,,,,VVVVV,,,NNNNNNN,,,,#',
    '#,,,,NNN,,,,,VV,,,,,,,,,,,,,VVVVV,,,NNNNN,,,,,,#',
    '#,,,,,,:::,,,VV,,,:::::::,,,VVVVV,,,,NN,,,::::,#',
    ':::::::::::::VV:::::::::::::VVVVV:::::::::::::::',
    ':::::::::::::VV::::,,,,,::::VBBBV:::::::::::::::',
    '#,,,::::,,,,,VV,,,,,,,,,,,,,VBBBV,,,:::::,,,,,,#',
    '#,,,,,,,,,,,,VV,,,,,,,,,,,,,VVVVV,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,VV,,,,NNNNN,,,VVVVVV,,NNN,,,,,,,,,#',
    '#,,,,,,,,,,,,VV,,NNNNNNN,,,,VVVVV,,,NN,,,,T,,,,#',
    '#,,,,,T,,,,,,VV,,NNNNNNNN,,,VVVVV,,T,N,,,,,,,,,#',
    '#,,,,,,,,J,,VVVV,,,##,,,,J,VVVVVVV,,,,,,,,,,,,,#',
    '####,,,,,,,,VVVV,,####,,,,,VVVVVVV,,,#####,,,,,#',
    '################################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'sunny_hayfields', spawn: { x: 38, y: 9 } },
    { x: 47, y: 9, w: 1, h: 2, to: 'sunny_windmill', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // The three seed clocks (high levers, Ves hooks them), two signs, a purse on the
  // bank steps, one in the far corner, a bench, a haystack, a basket of seeds;
  // dandelion heads and seeds drifting everywhere.
  textFile: 'interactions/sunnyside.txt',
  props: [
    { sprite: 'sign', x: 3, y: 8, text: 'hill_sign' },
    { sprite: 'sign', x: 11, y: 8, text: 'hill_sign_hedge' },
    { sprite: 'sy_seed_clock', x: 8, y: 13, text: 'hill_clock_a', lever: 'hill_a', high: true },
    { sprite: 'sy_seed_clock', x: 18, y: 14, text: 'hill_clock_b', lever: 'hill_b', high: true },
    { sprite: 'sy_seed_clock', x: 30, y: 11, text: 'hill_clock_c', lever: 'hill_c', high: true },
    { sprite: 'gold_pouch', x: 26, y: 3, text: 'hill_pouch', gold: 70, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gold_pouch', x: 44, y: 16, text: 'hill_pouch_far', gold: 45, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'bench', x: 3, y: 14, text: 'hill_bench' },
    { sprite: 'sy_seed_basket', x: 34, y: 5, text: 'hill_basket' },
    { sprite: 'haystack', x: 22, y: 12, text: 'hill_haystack' },
    { sprite: 'daisy_patch', x: 6, y: 10, walkable: true, decor: true },
    { sprite: 'daisy_patch', x: 38, y: 11, walkable: true, decor: true },
    { sprite: 'buttercups', x: 20, y: 7, walkable: true, decor: true },
    { sprite: 'sy_seed_heads', x: 2, y: 3, animation: 'sy_seed_heads', speed: 1.1 },
    { sprite: 'sy_seed_heads', x: 7, y: 6, animation: 'sy_seed_heads', speed: 0.9 },
    { sprite: 'sy_seed_heads', x: 11, y: 15, animation: 'sy_seed_heads', speed: 1.1 },
    { sprite: 'sy_seed_heads', x: 10, y: 11, animation: 'sy_seed_heads', speed: 1.0 },
    { sprite: 'sy_seed_heads', x: 16, y: 4, animation: 'sy_seed_heads', speed: 1.0 },
    { sprite: 'sy_seed_heads', x: 21, y: 16, animation: 'sy_seed_heads', speed: 1.2000000000000002 },
    { sprite: 'sy_seed_heads', x: 26, y: 12, animation: 'sy_seed_heads', speed: 1.3 },
    { sprite: 'sy_seed_heads', x: 35, y: 8, animation: 'sy_seed_heads', speed: 1.2000000000000002 },
    { sprite: 'sy_seed_heads', x: 37, y: 14, animation: 'sy_seed_heads', speed: 1.2000000000000002 },
    { sprite: 'sy_seed_heads', x: 41, y: 6, animation: 'sy_seed_heads', speed: 1.2000000000000002 },
    { sprite: 'sy_seed_heads', x: 45, y: 4, animation: 'sy_seed_heads', speed: 1.3 },
    { sprite: 'sy_seed_heads', x: 44, y: 12, animation: 'sy_seed_heads', speed: 0.9 },
    { sprite: 'sy_seed_heads', x: 36, y: 17, animation: 'sy_seed_heads', speed: 1.3 },
    { sprite: 'sy_seed_heads', x: 17, y: 17, animation: 'sy_seed_heads', speed: 1.0 },
    { sprite: 'sy_seed_heads', x: 4, y: 17, animation: 'sy_seed_heads', speed: 0.9 },
    { sprite: 'sy_seed_drift', x: 5, y: 5, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 9, y: 8, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 12, y: 14, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 16, y: 12, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 19, y: 3, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 24, y: 8, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 27, y: 14, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 34, y: 12, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 38, y: 6, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 41, y: 15, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 45, y: 8, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    { sprite: 'sy_seed_drift', x: 34, y: 16, animation: 'sy_seed_drift', speed: 0.45, walkable: true, decor: true },
    // The life pass, round 2 (src/data/sunnyLifeProps.js).
    ...(R5S_PROPS.sunny_dandelion_hill ?? []),
  ],
  tileTexts: { '#': 'field_hedge', W: 'field_hedge', I: 'field_oak', T: 'field_apple', J: 'field_blossom', b: 'field_bank', B: 'field_bank', V: 'lane_blossom_hedge' },

  // One monster in the middle meadow, south of its clock (x 20 to 26, row 14; the
  // clock is at 18,14, so well clear) and two in the east meadow. None near a
  // hedge, a gust, the island or a door. No cutscenes here.
  npcs: [
    { enemy: 'dandylion', x: 22, y: 14, patrol: [19, 25], behaviour: 'patrol' },
    { enemy: 'seed_sheep', x: 38, y: 6, patrol: [35, 44], behaviour: 'wander' },
    { enemy: 'haybob', x: 39, y: 14, patrol: [36, 41], behaviour: 'patrol' },
  ],
};
