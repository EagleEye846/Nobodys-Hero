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

export const SALTCOMBE_CHANDLERY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'saltcombe_chandlery',
  // The room's name, for the Room Editor.
  name: "WRASSE'S CHANDLERY",
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'saltcombe',
  // "Salt and Rope", with the rain on the roof and the town through the wall.
  music: 'saltcombe',
  ambience: 'stilt_inside',
  vesWell: true,
  indoors: true,

  tiles: [
    '################',
    'hhhhhhhhhhhhhhhh',
    'hhhhhhhhhhhhhhhh',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
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
  ],
  tileTexts: { h: 'chandler_wall' },

  // None: a shop.
  npcs: [
  ],
};
