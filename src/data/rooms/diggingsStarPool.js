// PUDDING'S POOL (secret, draft): the bottom of the shaft. The star came to rest
// in the pool here, and the rock round it has been glass ever since. West, on
// the dry side, is the miners' tea shelf: a kettle, seven mugs, and one small
// tin dish. Step up to the edge and PUDDING wakes (scenes `pudding_wakes`,
// then `pudding_again` for every try after the first; the fight is `pudding`,
// src/data/enemies/pudding.js). Spared or beaten, `pudding_spared` or
// `pudding_beaten` hands over the Deep Star Shard and the Olm-Glass Mantle.
//
// Clearance: the scenes' walks stay in columns 6 to 9, rows 6 to 10. There are
// no monsters in here.

// Tile key (see src/overworld/deepTiles.js for how the Diggings draws them):
//   #  dark rock overhead (solid)   W  rock face (solid)   O  ore rock (solid)
//   x  glassy crystal (solid)       q  loose gravel        ^  stalagmite (solid)
//   ~  the pool (solid)

export const DIGGINGS_STAR_POOL = {
  id: 'diggings_star_pool',
  name: "PUDDING'S POOL",
  area: 'diggings',
  // "Something Hums Below" (src/data/music/starSeamTheme.js): carries on from the camp right up
  // to the water's edge, where the olm's own song takes over.
  music: 'starSeam',
  ambience: 'mine_quiet',
  echo: 'cavern',
  lamplight: { shade: 0.6 },

  tiles: [
    '##############################',
    '##############################',
    '###WWWWWWWWWWWWWWWWWWWWWWWWW##',
    '#WW.......................x.W#',
    '#.........xq..~~~~~~~~~~...O.#',
    '#............~~~~~~~~~~~~....#',
    'W...........~~~~~~~~~~~~~~.x.#',
    '...........~~~~~~~~~~~~~~~~..#',
    '...........~~~~~~~~~~~~~~~~..#',
    '...........~~~~~~~~~~~~~~~~..#',
    '#...........~~~~~~~~~~~~~~.x.#',
    '#^...........~~~~~~~~~~~~....#',
    '#.........x...~~~~~~~~~~...O.#',
    '###..O..^Ox.x.............x.##',
    '##############################',
    '##############################',
  ],

  playerStart: { x: 1, y: 8 },

  doors: [
    { x: 0, y: 7, w: 1, h: 3, to: 'diggings_star_camp', spawn: { x: 28, y: 8 } },
  ],

  // Stepping up to the water wakes it. The first time is the long scene; after that
  // (until the fight is won or ended kindly) the short one, so a retreat can try again.
  cutscenes: [
    { x: 6, y: 5, w: 2, h: 7, scene: 'pudding_wakes' },
    { x: 6, y: 5, w: 2, h: 7, scene: 'pudding_again', after: 'pudding_wakes', until: ['pudding_spared', 'pudding_beaten'] },
  ],

  textFile: 'interactions/star_seam.txt',
  props: [
    // A save point at the back of the dry side, before the water.
    { sprite: 'savepoint', x: 2, y: 11, save: true },
    // The tea shelf: kettle, seven tin mugs, the dish.
    { sprite: 'tea_shelf', x: 3, y: 3, text: 'p_shelf', light: 20 },
    { sprite: 'sign', x: 2, y: 6, text: 'p_sign' },
    { sprite: 'gold_pouch', x: 28, y: 8, text: 'p_pouch', gold: 30, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'mine_lamp', x: 8, y: 4, text: 'sc_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp', x: 9, y: 12, text: 'sc_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'floor_pebbles', x: 4, y: 8, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 5, y: 10, walkable: true, flat: true },
    { sprite: 'drip_puddle', x: 9, y: 9, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles', x: 28, y: 6, walkable: true, flat: true },
  ],
  tileTexts: { '#': 'sc_rock', W: 'sc_face', O: 'sc_ore', x: 'sc_glass', '^': 'sc_stalag', '~': 'p_pool' },

  // (No monsters: the pool has one tenant.)
  npcs: [],
};
