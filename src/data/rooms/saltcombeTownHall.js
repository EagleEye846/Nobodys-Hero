// THE TOWN HALL: the big house at the top of the market, one long room with
// benches, a stove and the town's memory on the walls. A painting of
// Saltcombe in summer (blue sky: once). A board of winters, painted year by
// year, with one line ruled under in red: the winter the storm came. "It
// came the winter the boy went out." That is all anybody here will say about
// it, and nobody names him (it's Corrie; the hall never says so).
//
// Puzzle-free. No monsters. An old badger keeps the stove going and offers
// biscuits instead of answers.
// Tile key (see src/overworld/coastTiles.js, saltcombe, indoors):
//   #  wall top (solid)   h  board wall (solid)   o  floor boards

export const SALTCOMBE_TOWN_HALL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'saltcombe_town_hall',
  // The room's name, for the Room Editor.
  name: 'THE TOWN HALL',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'saltcombe',
  // "Salt and Rope", with the rain on the roof.
  music: 'saltcombe',
  ambience: 'stilt_inside',
  vesWell: true,
  indoors: true,

  tiles: [
    '######################',
    'hhhhhhhhhhhhhhhhhhhhhh',
    'hhhhhhhhhhhhhhhhhhhhhh',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '#oooooooooooooooooooo#',
    '##########oo##########',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 10, y: 12 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 10, y: 13, w: 2, h: 1, to: 'saltcombe_market', spawn: { x: 17, y: 7 } },
  ],

  cutscenes: [],

  // The board of winters, the summer painting, notices, benches, the stove and the badger.
  textFile: 'interactions/saltcombe.txt',
  props: [
    { sprite: 'sc_winters_board', x: 10, y: 4, text: 'hall_winters', notice: true },
    { sprite: 'sc_summer_painting', x: 4, y: 4, text: 'hall_painting' },
    { sprite: 'notice_board', x: 15, y: 3, text: 'hall_notices' },
    { sprite: 'bookshelf', x: 1, y: 3, text: 'hall_shelf' },
    { sprite: 'stove', x: 19, y: 3, text: 'hall_stove' },
    { sprite: 'cf_fisher_d', x: 18, y: 5, text: 'hall_badger', animation: 'cf_fisher_d', speed: 0.6 },
    { sprite: 'bench', x: 5, y: 8, text: 'hall_bench' },
    { sprite: 'bench', x: 14, y: 8, text: 'hall_bench' },
    { sprite: 'bench', x: 5, y: 10, text: 'hall_bench' },
    { sprite: 'bench', x: 14, y: 10, text: 'hall_bench' },
    { sprite: 'c5_lantern_post_lit', x: 8, y: 3, text: 'hall_lamp', animation: 'c5_lantern_post_lit', speed: 0.26 },
    { sprite: 'c5_lantern_post_lit', x: 13, y: 3, text: 'hall_lamp', animation: 'c5_lantern_post_lit', speed: 0.28 },
    { sprite: 'c5_harbour_bell', x: 1, y: 11, text: 'hall_bell' },
    { sprite: 'gold_pouch', x: 20, y: 12, text: 'hall_pouch', gold: 50, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { h: 'hall_wall' },

  // None.
  npcs: [
  ],
};
