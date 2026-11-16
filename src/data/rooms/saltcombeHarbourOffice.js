// THE HARBOUR OFFICE: one small room, very tidy, with the harbour clerk (a
// puffin in a green eyeshade) at his sloped desk. Tide tables on the wall,
// shelves of ledgers going back further than anybody wants to dust, a stove.
// The back door is Haddock's shed (locked; it isn't time for that yet). Once the world flag
// `haddock_gone` is set (the finale sets it), the door stands open into secret_haddocks_shed.
//
// Trail 4: the launch-ledger open on the desk at a page gone soft with
// handling. One small boat, one passenger, no name, bound "north-east,
// toward the smoke". Nobody explains it.
//
// Puzzle-free. No monsters.
// Tile key (see src/overworld/coastTiles.js, saltcombe, indoors):
//   #  wall top (solid)   h  board wall (solid)   o  floor boards
//   .  the boards behind the clerk's desk (crossways)

export const SALTCOMBE_HARBOUR_OFFICE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'saltcombe_harbour_office',
  // The room's name, for the Room Editor.
  name: 'THE HARBOUR OFFICE',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'saltcombe',
  // "Salt and Rope", with the rain on the roof.
  music: 'saltcombeIndoor',
  // After chapter 5 (the_light_answers) the town is quiet: "What the Tide Left".
  musicAfter: { scene: 'the_light_answers', song: 'saltcombeAfterIndoor' },
  ambience: 'stilt_inside',
  // After chapter 5 the storm is over (`calmAfter`): no rain on the roof, and the room's `_calm` words.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_stilt_inside' },
  vesWell: true,
  indoors: true,

  tiles: [
    '##############',
    'hhhhhhhhhhhhhh',
    'hhhhhhhhhhhhhh',
    '#oo......oooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '##oooooooooo##',
    '######oo######',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 6, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 6, y: 9, w: 2, h: 1, to: 'saltcombe_quay', spawn: { x: 5, y: 6 } },
    // Haddock's shed: a door only after the chapter (`after`: the scene id / flag `haddock_gone`).
    { x: 12, y: 3, w: 1, h: 1, to: 'secret_haddocks_shed', spawn: { x: 6, y: 8 }, after: 'haddock_gone' },
  ],

  // The launch-ledger (trail 4: the_launch_ledger), the row inside the door.
  cutscenes: [
    { x: 4, y: 7, w: 6, h: 1, scene: 'the_launch_ledger', until: ['the_light_answers', 'haddock_gone'] },
  ],

  // The clerk behind his desk (the ledger is on it), tide tables, shelves, the back door.
  textFile: 'interactions/saltcombe.txt',
  props: [
    // The side quest "The Clerk's Stamp": a gull has it, up on the quay's fish crates.
    { sprite: 'cf_clerk_puffin', x: 6, y: 3, npc: 'harbour_clerk', animation: 'cf_clerk_puffin', speed: 0.5, quest: [
      { needs: ['has:approved_stamp'], take: 'approved_stamp', set: ['q_stamp_asked', 'q_stamp_done'], give: 'harbour_pass', text: 'stamp_done' },
      { needs: ['q_stamp_done'], text: 'stamp_after', append: true },
      { needs: ['!q_stamp_asked'], set: 'q_stamp_asked', text: 'stamp_ask', append: true },
    ] },
    { sprite: 'sc_ledger_desk', x: 5, y: 4, text: 'office_ledger', notice: true },
    { sprite: 'bookshelf', x: 1, y: 3, text: 'office_shelves' },
    { sprite: 'c5_tide_board', x: 9, y: 3, text: 'office_tide_board' },
    { sprite: 'locked_door', x: 12, y: 3, text: 'office_back_door', until: 'haddock_gone' },
    { sprite: 'hs_open_door', x: 12, y: 3, walkable: true, after: 'haddock_gone', decor: true },
    { sprite: 'stove', x: 1, y: 6, text: 'office_stove' },
    { sprite: 'chair', x: 10, y: 6, text: 'office_chair' },
    { sprite: 'c5_barrel', x: 12, y: 7, text: 'office_barrel' },
    // Lived in (2026-11-08): a barometer, a lamp over the clerk's desk, pigeonholes of charts and
    // papers behind him, a calendar by the back door, and a rag rug where the ending puts you down.
    { sprite: 'in_barometer', x: 3, y: 2, text: 'in_office_barometer' },
    { sprite: 'in_wall_lamp', x: 5, y: 2, text: 'in_office_lamp' },
    { sprite: 'in_pigeonholes', x: 7, y: 2, text: 'in_office_pigeonholes' },
    { sprite: 'in_calendar', x: 11, y: 2, text: 'in_office_calendar' },
    { sprite: 'in_rug_blue', x: 5, y: 6, text: 'in_office_rug', walkable: true, flat: true },

    // (2026-11-09) A waiting bench nobody waits on, the old launch books piled up by the stove.
    // Off the way from the back door (12,4) to the front (6..7,9) and the ending's spot (6,8).
    { sprite: 'bench', x: 9, y: 8, text: 'in_office_bench' },
    { sprite: 'in_book_pile', x: 3, y: 7, text: 'in_office_books' },
    // (2026-11-13) After the chapter, Haddock's chart of the coast on its board by the stove, a pencil line
    // out to the north-east: where chapter 6 is set out for (`setOut`, see setOutFrom in overworldScene.js).
    // Read from (4,5), facing it.
    { sprite: 'sc_coast_map', x: 2, y: 5, text: 'office_smoke_chart', setOut: 'set_out_for_the_smoke', after: 'haddock_gone' },
    // (life pass 2026-11-14)
    { sprite: 'st_cat_loaf_b', x: 2, y: 4, text: 'life_o_cat', animation: 'st_cat_loaf_b', speed: 1.2 },
    { sprite: 'st_boot_planter', x: 11, y: 8, text: 'life_o_boot' },
  ],
  tileTexts: { h: 'office_wall' },

  // None.
  npcs: [
  ],
};
