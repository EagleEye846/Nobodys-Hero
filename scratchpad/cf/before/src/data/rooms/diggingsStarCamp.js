// THE LAST CAMP (secret, draft): where the seventh shift sat down to tea and
// did not get up again, as far down as the track goes. No puzzle and no
// monsters: a save point, a table laid with the end of a lunch, the rules the
// miners pinned up for the one thing they kept down here, and a chest left
// "for whoever comes next". The room to breathe in before the pool. The way on
// is the door at the east end, along row 8.

// Tile key (see src/overworld/deepTiles.js for how the Diggings draws them):
//   #  dark rock overhead (solid)   W  rock face (solid)   O  ore rock (solid)
//   x  glassy crystal (solid)       q  loose gravel        ^  stalagmite (solid)

import { DIGGINGS_DRESSING } from '../diggingsDressing.js';

export const DIGGINGS_STAR_CAMP = {
  id: 'diggings_star_camp',
  name: 'THE LAST CAMP',
  area: 'diggings',
  // "Something Hums Below" (src/data/music/starSeamTheme.js), from its quiet waltz (`musicFrom`:
  // the tea break, the whistle on a music box), so the save room starts soft.
  music: 'starSeam',
  musicFrom: 'camp',
  ambience: 'mine_quiet',
  echo: 'cavern',
  lamplight: { shade: 0.58 },

  tiles: [
    '##############################',
    '##############################',
    '###WWWWWWWWWWWWWWWWWWWWWWWW###',
    '#WW.O......O..x....O.xx.q..WW#',
    '#.O.....q....................#',
    '#xq........q.q..q...qq......x#',
    'W.......q................q...W',
    '......q.q.....................',
    '..............................',
    '..............................',
    '#...q........................#',
    '#................q......q..q.#',
    '##...q......q......q........##',
    '##.....^.....q...x....^...####',
    '##############################',
    '##############################',
  ],

  playerStart: { x: 1, y: 8 },

  doors: [
    { x: 0, y: 7, w: 1, h: 3, to: 'diggings_star_gallery', spawn: { x: 34, y: 8 } },
    { x: 29, y: 7, w: 1, h: 3, to: 'diggings_star_pool', spawn: { x: 1, y: 8 },
      // Shut until the Deep is done (the light has gone up): the pool is the last
      // thing in the chapter, not something to try at the start of the Diggings.
      after: 'the_light_goes_up', notYet: 'camp_pool_not_yet' },
  ],
  cutscenes: [],

  textFile: 'interactions/star_seam.txt',
  props: [
    ...(DIGGINGS_DRESSING.diggings_star_camp ?? []),
    { sprite: 'savepoint', x: 14, y: 6, save: true },
    // The rules, pinned up by the door that leads on, and a table laid for a break.
    { sprite: 'notice_board', x: 18, y: 3, text: 'k_rules' },
    { sprite: 'table', x: 14, y: 10, text: 'k_table' },
    { sprite: 'bench', x: 14, y: 11, text: 'k_bench' },
    { sprite: 'chest', x: 22, y: 5, text: 'k_chest', gives: 'pit_pasty', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 4, y: 11, text: 'k_pouch', gold: 30, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'lunch_crate', x: 23, y: 10, text: 'k_lunch' },
    { sprite: 'mine_cart', x: 25, y: 5, text: 'k_cart' },
    { sprite: 'toolbox', x: 6, y: 5, text: 'k_toolbox' },
    { sprite: 'ore_sacks', x: 3, y: 5, text: 'sc_sacks' },
    { sprite: 'timber_stack', x: 20, y: 11, text: 'k_timber' },
    { sprite: 'mine_lamp_hung', x: 14, y: 2, text: 'sc_lamp', animation: 'mine_lamp_hung', speed: 0.35 },
    { sprite: 'mine_lamp', x: 12, y: 5, text: 'sc_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'mine_lamp', x: 20, y: 12, text: 'sc_lamp', animation: 'mine_lamp', speed: 0.35 },
    { sprite: 'wall_shoring', x: 11, y: 2, text: 'sc_shoring' },
    { sprite: 'wall_shoring', x: 21, y: 2, text: 'sc_shoring' },
    { sprite: 'drip_puddle', x: 9, y: 11, walkable: true, flat: true, animation: 'drip_puddle', speed: 0.3 },
    { sprite: 'floor_pebbles', x: 8, y: 6, walkable: true, flat: true },
    { sprite: 'ore_crumbs', x: 17, y: 6, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 26, y: 8, walkable: true, flat: true },
    { sprite: 'floor_pebbles', x: 10, y: 12, walkable: true, flat: true },
  ],
  tileTexts: { '#': 'sc_rock', W: 'sc_face', O: 'sc_ore', x: 'sc_glass', '^': 'sc_stalag' },

  // (No monsters: a rest room.)
  npcs: [],
};
