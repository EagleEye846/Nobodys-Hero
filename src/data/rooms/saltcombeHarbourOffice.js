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

export const SALTCOMBE_HARBOUR_OFFICE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'saltcombe_harbour_office',
  // The room's name, for the Room Editor.
  name: 'THE HARBOUR OFFICE',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'saltcombe',
  // "Salt and Rope", with the rain on the roof.
  music: 'saltcombe',
  ambience: 'stilt_inside',
  vesWell: true,
  indoors: true,

  tiles: [
    '##############',
    'hhhhhhhhhhhhhh',
    'hhhhhhhhhhhhhh',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
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

  cutscenes: [],

  // The clerk behind his desk (the ledger is on it), tide tables, shelves, the back door.
  textFile: 'interactions/saltcombe.txt',
  props: [
    { sprite: 'cf_clerk_puffin', x: 6, y: 3, npc: 'harbour_clerk', animation: 'cf_clerk_puffin', speed: 0.5 },
    { sprite: 'sc_ledger_desk', x: 5, y: 4, text: 'office_ledger', notice: true },
    { sprite: 'bookshelf', x: 1, y: 3, text: 'office_shelves' },
    { sprite: 'c5_tide_board', x: 9, y: 3, text: 'office_tide_board' },
    { sprite: 'locked_door', x: 12, y: 3, text: 'office_back_door', until: 'haddock_gone' },
    { sprite: 'hs_open_door', x: 12, y: 3, walkable: true, after: 'haddock_gone' },
    { sprite: 'stove', x: 1, y: 6, text: 'office_stove' },
    { sprite: 'chair', x: 10, y: 6, text: 'office_chair' },
    { sprite: 'c5_barrel', x: 12, y: 7, text: 'office_barrel' },
  ],
  tileTexts: { h: 'office_wall' },

  // None.
  npcs: [
  ],
};
