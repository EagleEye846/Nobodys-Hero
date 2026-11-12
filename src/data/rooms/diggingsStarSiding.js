// THE SIDING (secret, draft): the miners' siding for the cart that never went back up.
// Rails, light and a rock, in one room. A single cart waits at the west end of a track
// that forks once; the way it goes decides everything:
//   * the straight way (lever OFF) runs east along row 4 to a buffer stop at (21,4), with a
//     purse beside it: the decoy;
//   * the lever ON (sd_sw1, at 10,5) sends it down column 9 and east along row 10: a
//     barricade at (16,10) (the cart smashes it), then the end of the line at (22,10), where
//     a plate (sd_plate, a cart-only stone button) is set in the floor. A cart resting on
//     it holds the plate down, and the plate wakes the sun-crystal at (28,11), which throws
//     UP column 28 at the prism at (28,6).
//   * The prism starts set '/', which sends the beam out east into the rock. Turn it
//     ('\') and the beam runs WEST along row 6 to the eye at (18,6): but a rock sits in
//     the beam at (24,6), so shove it off the row first (lean from 24,5 for down, or 24,7 for
//     up). The eye latches, and opens the gate across the way east (31,8-9), at the mouth of the short corridor to the door.
// So: lever, cart, prism, rock. Any order works except that the beam only exists while the cart
// is on the plate. The stump at (13,12) puts the cart, the barricade, the rock and the prism
// back (eyes that have lit stay lit, so nothing can be lost, and the hero can walk the whole
// track). A drillbug patrols row 13 (x 22 to 29), clear of the beam's column and the cart's
// last stretch, and a slagling row 13 (x 6 to 11).

// Tile key (see src/overworld/deepTiles.js for how the Diggings draws them):
//   #  dark rock overhead (solid)   W  rock face (solid)   O  boulder (solid)
//   x  glassy crystal (solid)       q  loose gravel        ^  stalagmite (solid)

export const DIGGINGS_STAR_SIDING = {
  id: 'diggings_star_siding',
  name: 'THE SIDING',
  area: 'diggings',
  // "Something Hums Below" (src/data/music/starSeamTheme.js), the secret seam's own song.
  music: 'starSeam',
  ambience: 'mine_quiet',
  echo: 'cavern',
  lamplight: { shade: 0.62 },

  tiles: [
    '####################################',
    '####################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#......................x.x.....#####',
    '#.............................q#####',
    '#..............................#####',
    '#.......q...^..................#####',
    '#...^.........O.....q.........O#####',
    '.............q......................',
    '....................................',
    '#....q.........................#####',
    '#..............................#####',
    '#..q...x....q..O..........q..^.#####',
    '#..............................#####',
    '####################################',
    '####################################',
  ],

  rails: [
    '....................................',
    '....................................',
    '....................................',
    '....................................',
    '...╶─────┬───────────╴..............',
    '.........│..........................',
    '.........│..........................',
    '.........│..........................',
    '.........│..........................',
    '.........│..........................',
    '.........└────────────╴.............',
    '....................................',
    '....................................',
    '....................................',
    '....................................',
    '....................................',
  ],
  switches: [
    { x: 9, y: 4, name: 'sd_sw1', stem: 'L' },
  ],

  playerStart: { x: 1, y: 8 },

  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'diggings_star_spill', spawn: { x: 34, y: 8 } },
    { x: 35, y: 8, w: 1, h: 2, to: 'diggings_star_glass', spawn: { x: 1, y: 8 } },
  ],
  cutscenes: [],

  textFile: 'interactions/star_seam.txt',
  props: [
    // A save point by the way in, for the long middle of the detour.
    { sprite: 'savepoint', x: 2, y: 12, save: true },
    // The cart, and the lever for the fork (a lever beside the junction, never on a rail).
    { sprite: 'mine_cart', x: 6, y: 4, cart: 'a', dir: 'R', text: 'sd_cart' },
    { sprite: 'rail_lever', x: 10, y: 5, switch: 'sd_sw1', text: 'sd_lever' },
    { sprite: 'barricade', x: 16, y: 10, smash: true },
    // The plate at the end of the long way, and what it wakes.
    { sprite: 'stone_button', x: 22, y: 10, button: 'sd_plate', cartOnly: true, text: 'sd_plate' },
    { sprite: 'sun_crystal', x: 28, y: 11, beam: 'up', beamWhen: 'sd_plate', text: 'sd_sun' },
    { sprite: 'prism', x: 28, y: 6, mirror: '/', text: 'sd_prism' },
    { sprite: 'push_rock', x: 24, y: 6, text: 'sd_rock', rock: true },
    { sprite: 'crystal_eye', x: 18, y: 6, eye: 'sd_eye', text: 'sd_eye' },
    { sprite: 'gate_narrow', x: 31, y: 8, text: 'sd_gate', opensWith: ['sd_eye'], openText: 'sd_gate_open' },
    { sprite: 'gate_narrow', x: 31, y: 9, text: 'sd_gate', opensWith: ['sd_eye'], openText: 'sd_gate_open' },
    { sprite: 'rock_stump', x: 13, y: 12, text: 'sd_stump', rockReset: true },
    { sprite: 'sign', x: 3, y: 6, text: 'sd_sign' },
    { sprite: 'warning_sign', x: 20, y: 5, text: 'sd_warning' },
    { sprite: 'gold_pouch', x: 21, y: 5, text: 'sd_pouch', gold: 30, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Set dressing.
    { sprite: 'mine_lamp_hung', x: 8, y: 2, text: 'sc_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp_hung', x: 29, y: 2, text: 'sc_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp', x: 6, y: 9, text: 'sc_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp', x: 20, y: 12, text: 'sc_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'wall_shoring', x: 12, y: 2, text: 'sc_shoring' },
    { sprite: 'wall_shoring', x: 31, y: 2, text: 'sc_shoring' },
    { sprite: 'ore_sacks', x: 3, y: 10, text: 'sc_sacks' },
    { sprite: 'floor_pebbles', x: 13, y: 7, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 26, y: 8, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 28, y: 5, walkable: true, flat: true },
    { sprite: 'drip_puddle', x: 15, y: 8, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
  ],
  tileTexts: { '#': 'sc_rock', W: 'sc_face', O: 'sp_boulder', x: 'sc_glass', '^': 'sc_stalag' },

  npcs: [
    { enemy: 'slagling', x: 8, y: 13, patrol: [6, 11] },
    { enemy: 'drillbug', x: 26, y: 13, patrol: [22, 29] },
  ],
};
