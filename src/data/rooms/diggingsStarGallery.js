// THE WHISTLE GALLERY (secret, draft): a long hall where the seventh shift kept the
// tune for the end of the shift, set in four singing crystals on a shelf of rock. The
// whistle's tune is B G E, then F-sharp up (three down, one up: the tally board says so).
// The crystals stand in steps by pitch (the taller, the higher): E, F-sharp and G on
// the floor along the north wall (a 5,4 / b 8,4 / c 11,4), and B, the tallest, on top
// of a ledge. Ring them in the tune's order, B G E F-sharp, and the gallery sings it
// back and opens the gate across the way east (the switch `seam_tune`, see CHIME_SETS.seam
// in src/overworld/chimes.js). A wrong note starts it over; so does twelve seconds of nothing.
//
// The ledge: B blocks at x 25 to 28, rows 3 to 5, hemmed in by boulders at x 24 and 29, with
// the crystal d (B) at (27,3). Its south face, row 6, is a cliff two jumps high. A jump gets
// you up a step (12), never two: the way up is the loose stepping stone Rk at (21,9)
// (`step: true`): a rock you roll a tile at a time, and once it sits still, climb onto it, and
// from it onto the ledge.
//   Boulders at (23,9), (25,7), (26,10) and (18,6) are in the way on purpose. A route that works:
//   Rk UP once, from (21,10), to (21,8); EAST along row 8 six times, from (20,8), to (27,8);
//   UP twice, from (27,9), to (27,6), where it stops against the ledge. Stand on (27,7), jump onto
//   the stone, and again onto the ledge at (27,5). Ring d from (27,4). Drop off the ledge (always
//   safe), and ring c, a and b before twelve seconds go by. The stump at (3,10) puts the stone home.
// Nothing can be stranded: the stone can only be shoved on the floor, any dead corner is undone
// by the stump, and the gate door leads on to the Last Camp, whose door leads back.
// Monsters: a slagling on row 11 (x 12 to 20) and a gleamsnail on row 13 (x 5 to 10): off
// the rock's route and clear of the crystals.

// Tile key (see src/overworld/deepTiles.js for how the Diggings draws them):
//   #  dark rock overhead (solid)   W  rock face (solid)   O  boulder (solid)
//   B  a tall ledge of rock (jump on from a stone)   x  glassy crystal (solid)
//   q  loose gravel   ^  stalagmite (solid)   .  packed dirt floor

export const DIGGINGS_STAR_GALLERY = {
  id: 'diggings_star_gallery',
  name: 'THE WHISTLE GALLERY',
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
    '#.....x........^........OBBBBO.#####',
    '#.^.............x.......OBBBBO.#####',
    '#.......................OBBBBO.#####',
    '#.................O............#####',
    '#.......q................O.....#####',
    '....................................',
    '.......................O............',
    '#.............q...........O...q#####',
    '#..............................#####',
    '#..q.........^......q..........#####',
    '#..............................#####',
    '####################################',
    '####################################',
  ],

  playerStart: { x: 1, y: 8 },

  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'diggings_star_glass', spawn: { x: 34, y: 8 } },
    { x: 35, y: 8, w: 1, h: 2, to: 'diggings_star_camp', spawn: { x: 1, y: 8 } },
  ],
  cutscenes: [],

  textFile: 'interactions/star_seam.txt',
  props: [
    { sprite: 'savepoint', x: 2, y: 12, save: true },
    // The singing crystals, lowest to highest note (E, F-sharp, G, B): the tune is d, c, a, b.
    { sprite: 'singing_a', x: 5, y: 4, text: 'ga_crystal', chime: { set: 'seam', note: 0 } },
    { sprite: 'singing_b', x: 8, y: 4, text: 'ga_crystal', chime: { set: 'seam', note: 1 } },
    { sprite: 'singing_c', x: 11, y: 4, text: 'ga_crystal', chime: { set: 'seam', note: 2 } },
    { sprite: 'singing_d', x: 27, y: 3, text: 'ga_crystal_tall', chime: { set: 'seam', note: 3 } },
    // The way on, shut until the gallery has sung.
    { sprite: 'gate_narrow', x: 31, y: 8, text: 'ga_gate', opensWith: ['seam_tune'], openText: 'ga_gate_open' },
    { sprite: 'gate_narrow', x: 31, y: 9, text: 'ga_gate', opensWith: ['seam_tune'], openText: 'ga_gate_open' },
    // The stepping stone and its stump.
    { sprite: 'push_rock', x: 21, y: 9, text: 'ga_stone', rock: true, step: true },
    { sprite: 'rock_stump', x: 3, y: 10, text: 'ga_stump', rockReset: true },
    { sprite: 'sign', x: 3, y: 6, text: 'ga_sign' },
    { sprite: 'sign', x: 30, y: 7, text: 'ga_sign_far' },
    { sprite: 'gold_pouch', x: 29, y: 6, text: 'ga_pouch', gold: 30, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Set dressing.
    { sprite: 'mine_lamp_hung', x: 8, y: 2, text: 'sc_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp_hung', x: 18, y: 2, text: 'sc_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp', x: 14, y: 8, text: 'sc_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp', x: 29, y: 11, text: 'sc_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'wall_shoring', x: 14, y: 2, text: 'sc_shoring' },
    { sprite: 'wall_shoring', x: 22, y: 2, text: 'sc_shoring' },
    { sprite: 'floor_pebbles', x: 10, y: 6, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 17, y: 10, walkable: true, flat: true },
    { sprite: 'drip_puddle', x: 6, y: 9, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles', x: 28, y: 12, walkable: true, flat: true },
  ],
  tileTexts: { '#': 'sc_rock', W: 'sc_face', O: 'sp_boulder', B: 'ga_ledge', x: 'sc_glass', '^': 'sc_stalag' },

  npcs: [
    { enemy: 'slagling', x: 14, y: 11, patrol: [12, 20] },
    { enemy: 'gleamsnail', x: 7, y: 13, patrol: [5, 10] },
  ],
};
