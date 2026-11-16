// THE SPILL (secret, draft): where the star's heat boiled the lake that used to
// lie under Seam Nine, and what it left is two bands of black water running north
// to south across the cavern, each two strides wide except for one place. The
// miners laid drift logs along the banks for crossing, and pinned boulders where
// a log is meant to stop. A log rolls when you lean on it until something stops it,
// and sinks into the first open water it meets, and you cross on its back. So each
// band has ONE place where a single log is enough (the water is one stride wide
// there, and a nub of floor stands on the far side): row 6 for the first band, row
// 10 for the second. Roll a log along any other row and it sinks in two-wide water
// and is wasted (the stumps put the logs back).
//
//   L1 starts at (7,9): push it WEST (lean from 8,9) and it stops at the boulder at
//     (3,9), at (4,9); push it UP (lean from 4,10) and it stops under the boulder at
//     (4,5), at (4,6); push it EAST (lean from 3,6) along row 6 and it sinks at (13,6),
//     the first band's one-wide place. Walk over, and on to the island.
//   L2 starts on the island at (21,5): WEST (lean from 22,5) and it stops at the
//     boulder (17,5), at (18,5); DOWN (lean from 18,4) and it stops at the boulder
//     (18,11), at (18,10); EAST (lean from 17,10) along row 10 and it sinks at (24,10),
//     the second band's one-wide place, with the nub (25,10) on the far side.
//   Wrong pushes: L1 up from (7,10) rolls to the top wall and sticks; L1 east along
//     row 9 sinks in two-wide water; the stumps (2,11) and (22,12) put every log back.
// The hero can always walk back over a laid log, and nothing here can strand anyone
// (Ves can't push logs, so she waits and follows over the bridges).
// Monsters: a slagling on row 13 (x 2 to 10), a gleamsnail on row 13 on the island
// (x 15 to 22) and a drillbug on row 5 on the east bank (x 28 to 33), all off the log lanes.

// Tile key (see src/overworld/deepTiles.js for how the Diggings draws them):
//   #  dark rock overhead (solid)   W  rock face (solid)   O  boulder (solid)
//   q  loose gravel   ^  stalagmite (solid)   ~  the boiled water (solid)   .  packed dirt floor

import { DIGGINGS_DRESSING } from '../diggingsDressing.js';

import { R3C_PROPS } from '../r3cLife.js';

export const DIGGINGS_STAR_SPILL = {
  id: 'diggings_star_spill',
  name: 'THE SPILL',
  area: 'diggings',
  // "Something Hums Below" (src/data/music/starSeamTheme.js), the secret seam's own song.
  music: 'starSeam',
  ambience: 'mine_quiet',
  echo: 'cavern',
  lamplight: { shade: 0.6 },

  tiles: [
    '####################################',
    '####################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#............~~.........~~.........#',
    '#.......q....~~.........~~.^.......#',
    '#...O........~~..O......~~....q....#',
    '#............~..........~~.......^.#',
    '#.q..........~~.........~~.........#',
    '.............~~.q.....q.~~..........',
    '...O.........~~.........~~..q.......',
    '#............~~.........~........q.#',
    '#............~~...O.....~~.........#',
    '#.....^...q..~~.^...q...~~.....q...#',
    '#............~~.........~~.........#',
    '####################################',
    '####################################',
  ],

  playerStart: { x: 1, y: 8 },

  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'diggings_star_scorch', spawn: { x: 38, y: 12 } },
    { x: 35, y: 8, w: 1, h: 2, to: 'diggings_star_siding', spawn: { x: 1, y: 8 } },
  ],
  cutscenes: [],

  textFile: 'interactions/star_seam.txt',
  props: [
    ...(R3C_PROPS.diggings_star_spill ?? []),
    ...(DIGGINGS_DRESSING.diggings_star_spill ?? []),
    { sprite: 'roll_log', x: 7, y: 9, text: 'sp_log', log: true },
    { sprite: 'roll_log', x: 21, y: 5, text: 'sp_log', log: true },
    { sprite: 'rock_stump', x: 2, y: 11, text: 'sp_stump', rockReset: true },
    { sprite: 'rock_stump', x: 22, y: 12, text: 'sp_stump', rockReset: true },
    { sprite: 'sign', x: 2, y: 6, text: 'sp_sign' },
    { sprite: 'sign', x: 26, y: 8, text: 'sp_sign_far' },
    { sprite: 'gold_pouch', x: 17, y: 13, text: 'sp_pouch', gold: 30, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Set dressing.
    { sprite: 'mine_lamp_hung', x: 9, y: 2, text: 'sc_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp_hung', x: 28, y: 2, text: 'sc_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp', x: 11, y: 9, text: 'sc_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp', x: 30, y: 10, text: 'sc_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'wall_shoring', x: 6, y: 2, text: 'sc_shoring' },
    { sprite: 'wall_shoring', x: 19, y: 2, text: 'sc_shoring' },
    { sprite: 'ore_sacks', x: 32, y: 12, text: 'sc_sacks' },
    { sprite: 'floor_pebbles', x: 9, y: 6, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 20, y: 9, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 31, y: 7, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 5, y: 12, walkable: true, flat: true },
  ],
  tileTexts: { '#': 'sc_rock', W: 'sc_face', O: 'sp_boulder', '^': 'sc_stalag', '~': 'sp_water' },

  npcs: [
    { enemy: 'slagling', x: 6, y: 13, patrol: [2, 10] },
    { enemy: 'gleamsnail', x: 19, y: 13, patrol: [15, 22] },
    { enemy: 'drillbug', x: 31, y: 5, patrol: [28, 33] },
  ],
};
