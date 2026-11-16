// MRS. WRASSE'S CHANDLERY: a narrow shop that smells of tar, rope and lamp oil,
// with everything a boat or a person could want hung, stacked or coiled
// somewhere. Mrs. Wrasse (a heron in gold spectacles, a tape measure round
// her neck) stands behind the counter and measures you with her eyes before
// you are through the door. The chapter's gear for all three (shop
// `wrasse_chandlery`: Z on her or on the counter).
//
// Puzzle-free. No monsters (a shop).
// Tile key (see src/overworld/coastTiles.js, saltcombe, indoors):
//   #  wall top (solid)   h  board wall (solid)   o  floor boards
//   .  the boards behind the counter (crossways)

export const SALTCOMBE_CHANDLERY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'saltcombe_chandlery',
  // The room's name, for the Room Editor.
  name: "WRASSE'S CHANDLERY",
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'saltcombe',
  // "Salt and Rope", with the rain on the roof and the town through the wall.
  music: 'saltcombeIndoor',
  // After chapter 5 (the_light_answers) the town is quiet: "What the Tide Left".
  musicAfter: { scene: 'the_light_answers', song: 'saltcombeAfterIndoor' },
  ambience: 'stilt_inside',
  // After chapter 5 the storm is over (`calmAfter`): no rain on the roof, and the room's `_calm` words.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_stilt_inside' },
  vesWell: true,
  indoors: true,

  tiles: [
    '################',
    'hhhhhhhhhhhhhhhh',
    'hhhhhhhhhhhhhhhh',
    '#ooooo.....oooo#',
    '#ooooo.....oooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '##ooooooooooooo#',
    '#######oo#######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 7, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 7, y: 11, w: 2, h: 1, to: 'saltcombe_market', spawn: { x: 4, y: 6 } },
  ],

  cutscenes: [],

  // Mrs. Wrasse behind her counter, shelves of everything, rope, pots, an anchor.
  textFile: 'interactions/saltcombe.txt',
  props: [
    { sprite: 'cf_wrasse', x: 8, y: 4, shop: 'wrasse_chandlery', animation: 'cf_wrasse', speed: 0.45 },
    { sprite: 'counter', x: 7, y: 5, shop: 'wrasse_chandlery' },
    { sprite: 'counter', x: 8, y: 5, shop: 'wrasse_chandlery' },
    { sprite: 'counter', x: 9, y: 5, shop: 'wrasse_chandlery' },
    { sprite: 'bookshelf', x: 1, y: 3, text: 'chandler_shelf' },
    { sprite: 'bookshelf', x: 12, y: 3, text: 'chandler_shelf_b' },
    { sprite: 'c5_lantern_post_lit', x: 5, y: 3, text: 'chandler_lamps', animation: 'c5_lantern_post_lit', speed: 0.25 },
    { sprite: 'c5_rope_coil', x: 3, y: 8, text: 'chandler_rope', walkable: true },
    { sprite: 'c5_lobster_pots', x: 12, y: 8, text: 'chandler_pots' },
    { sprite: 'c5_anchor', x: 2, y: 10, text: 'chandler_anchor' },
    { sprite: 'c5_buoys_pile', x: 13, y: 10, text: 'chandler_buoys' },
    { sprite: 'c5_barrel', x: 11, y: 5, text: 'chandler_barrel' },
    // Lived in (2026-11-08): a shelf of tins, a chart and a tide table pinned up, an oilskin for
    // sale on its peg; a net half mended, tins on a crate and a pair of new boots.
    { sprite: 'in_shelf_tins', x: 3, y: 2, text: 'in_chandler_shelf' },
    { sprite: 'in_chart', x: 6, y: 2, text: 'in_chandler_chart' },
    { sprite: 'in_tide_paper', x: 9, y: 2, text: 'in_chandler_tides' },
    { sprite: 'in_oilskin_peg', x: 14, y: 2, text: 'in_chandler_oilskin' },
    { sprite: 'in_net_mending', x: 2, y: 6, text: 'in_chandler_net' },
    { sprite: 'in_tins_crate', x: 14, y: 6, text: 'in_chandler_tins' },
    { sprite: 'in_boots_dry', x: 10, y: 9, text: 'in_chandler_boots' },

    // (2026-11-09) A doormat that says more than she does, a lamp on a stool for the dark side,
    // stock stacked by the west wall that nobody has needed since the herring.
    { sprite: 'c5_doormat', x: 7, y: 10, text: 'in_chandler_mat', walkable: true, flat: true },
    { sprite: 'in_lamp_stool', x: 5, y: 9, text: 'in_chandler_lamp' },
    { sprite: 'c5_crates_stack', x: 1, y: 8, text: 'in_chandler_stock' },
    // (life pass 2026-11-14)
    { sprite: 'st_price_board', x: 11, y: 7, text: 'life_c_prices' },
    { sprite: 'st_cat_loaf_b', x: 13, y: 4, text: 'life_c_cat', animation: 'st_cat_loaf_b', speed: 1.2 },
    { sprite: 'st_broom_bucket', x: 12, y: 10, text: 'life_c_broom' },
  ],
  tileTexts: { h: 'chandler_wall' },

  // None: a shop.
  npcs: [
  ],
};
