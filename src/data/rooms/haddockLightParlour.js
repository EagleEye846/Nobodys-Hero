// THE PARLOUR: the round room in the foot of the tower, where Haddock lives. A stove with a
// kettle on it, his armchair, a cot, his ledger on its table, a tide board on the wall, and a lit
// window on the sea. Coming in the first time plays `haddock_tells_it`: he sits the three of
// them down and tells, once and plainly, the night the light went out, and then gives the hero
// his bell. After that he is just in his chair (his words are in text/npcs/haddock_light.txt),
// and the stair up the tower is the door in the north wall. PUZZLE-FREE, no monsters.
// Tile key (see src/overworld/coastTiles.js, haddock_light, indoors):
//   #  wall top (solid)   h  white brick, curving with the tower (solid)   6  lit window
//   D  the open door (to the stair)   o  warm boards

export const HADDOCK_LIGHT_PARLOUR = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'haddock_light_parlour',
  // The room's name, for the Room Editor.
  name: "HADDOCK'S PARLOUR",
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'haddock_light',
  // "Minding the Light" (the scene changes to the lullaby when he starts to tell it).
  music: 'haddock',
  ambience: 'lighthouse',
  // After the chapter (the_light_answers): no storm on the windows, as in the Isles' old lightroom.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_lighthouse' },
  // Under cover: no rain or lightning, and the edges of the screen sink into shadow.
  indoors: true,
  vesWell: true,

  // Round, like the tower: the corners are cut off.
  tiles: [
    '##################',
    '##hhhhhhhhhhhhhh##',
    '#hhhhhhh66hhDDhhh#',
    '#oooooooooooooooo#',
    '#oooooooooooooooo#',
    '#oooooooooooooooo#',
    '#oooooooooooooooo#',
    '#oooooooooooooooo#',
    '#oooooooooooooooo#',
    '#oooooooooooooooo#',
    '##oooooooooooooo##',
    '###oooooooooooo###',
    '#######oo#########',
  ],

  // Where the player starts, in tile coordinates: just in from the door.
  playerStart: { x: 8, y: 11 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Out to the garden.
    { x: 7, y: 12, w: 2, h: 1, to: 'haddock_light_door', spawn: { x: 14, y: 6 } },
    // Up the tower.
    { x: 12, y: 2, w: 2, h: 1, to: 'haddock_light_stair', spawn: { x: 2, y: 21 } },
  ],

  // The first time in: the old man with the lantern is at the stove and goes off out of the
  // door (keeper_at_haddocks), then Haddock tells it (the walks run up to row 5, clear of the
  // chair). The first is listed first so it plays first, and never once the tale is told. It
  // leaves the hero at 7,7, so the tale has a second trigger there (only after it has played).
  cutscenes: [
    { x: 6, y: 9, w: 5, h: 3, scene: 'keeper_at_haddocks', until: 'haddock_tells_it' },
    { x: 6, y: 6, w: 3, h: 3, scene: 'haddock_tells_it', after: 'keeper_at_haddocks' },
    { x: 6, y: 9, w: 5, h: 3, scene: 'haddock_tells_it' },
  ],

  // The cot, the stove and kettle, his armchair, his tide board, the ledger, a crate or two.
  textFile: 'interactions/haddock_light.txt',
  props: [
    { sprite: 'bed', x: 1, y: 4, text: 'parlour_cot' },
    { sprite: 'in_stove_kettle', x: 5, y: 3, text: 'parlour_stove' },
    // Haddock, in his armchair under the window. He hides while the scene plays him.
    { sprite: 'cf_haddock_chair', x: 8, y: 4, npc: 'haddock_light', until: ['haddock_tells_it', 'haddock_gone'] },
    // After the chapter: his chair, empty.
    { sprite: 'armchair', x: 8, y: 4, text: 'parlour_chair_out', after: 'haddock_tells_it', until: 'haddock_gone' },
    { sprite: 'armchair', x: 8, y: 4, text: 'parlour_chair_after', after: 'haddock_gone' },
    { sprite: 'c5_tide_board', x: 10, y: 2, text: 'parlour_tides' },
    { sprite: 'sc_ledger_desk', x: 14, y: 4, text: 'parlour_ledger' },
    // His mug and his lamp at his elbow (clear of haddock_tells_it's walks).
    { sprite: 'il_tea_table', x: 11, y: 4, text: 'parlour_tea' },
    { sprite: 'c5_crate', x: 1, y: 8, text: 'parlour_crate' },
    { sprite: 'c5_barrel', x: 16, y: 8, text: 'parlour_barrel' },
    { sprite: 'c5_lifebuoy_post', x: 15, y: 9, text: 'parlour_lifebuoy' },
    // A long life, kept tidy (2026-11-08): the days crossed off, one mug on a rail of pegs, a
    // sketch of his boat, a shelf of tins all alike, a ship in a bottle; a rug in front of his chair
    // and his boots by the door. All clear of the two scenes' walks (rows 5-11 between x 4 and 11;
    // the rug lies flat, and boots at 5,11 are off every line).
    { sprite: 'in_calendar', x: 1, y: 2, text: 'in_parlour_calendar' },
    { sprite: 'in_mug_rail_one', x: 3, y: 2, text: 'in_parlour_mug' },
    { sprite: 'in_sketch_boat', x: 6, y: 2, text: 'in_parlour_sketch' },
    { sprite: 'in_shelf_neat', x: 14, y: 2, text: 'in_parlour_shelf' },
    { sprite: 'in_bottle_ship', x: 16, y: 2, text: 'in_parlour_ship' },
    { sprite: 'in_rug_red', x: 7, y: 5, text: 'in_parlour_rug', walkable: true, flat: true },
    { sprite: 'in_boots_dry', x: 5, y: 11, text: 'in_parlour_boots' },
    // (2026-11-08b) More of him: the cat asleep in its basket by the warm side, his rods and net
    // leant in the west corner, books piled by the ledger. All off the scenes' walks.
    { sprite: 'in_cat_bed', x: 13, y: 10, text: 'in_cat_bed' },
    { sprite: 'in_rods_corner', x: 2, y: 10, text: 'in_rods' },
    { sprite: 'in_book_pile', x: 16, y: 6, text: 'in_books' },
  ],
  tileTexts: { '#': 'parlour_wall', h: 'parlour_wall', 6: 'parlour_window', o: 'parlour_floor' },

  // Nobody to fight in a home.
  npcs: [],
};
