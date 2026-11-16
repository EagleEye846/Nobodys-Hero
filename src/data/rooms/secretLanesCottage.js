// THE FLOODED COTTAGE, GROUND FLOOR (a secret): in at the front door of the cottage that stands
// in the flood in the hamlet's north-west corner (lanes_hamlet 5,9). The family's parlour,
// knee-deep: the armchair, the table and a dresser all stood in the water where they floated to,
// the hearth cold. A small fight (one shellac) and a small puzzle: the dresser has floated up
// against the kitchen door in the east wall (13,4). Push it up or down out of the way; the stump
// in the corner puts it back where it was. The kitchen is through the door.
// Tile key (see src/overworld/coastTiles.js, lanes, indoors):
//   #  wall top (solid)   h  board wall (solid)   ;  knee-deep water (walk)
// (draft)

export const SECRET_LANES_COTTAGE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'secret_lanes_cottage',
  // The room's name, for the Room Editor.
  name: 'THE FLOODED COTTAGE',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lanes',
  indoors: true,
  // The Sunken Lanes' song, quieter under a roof, with the rain on it.
  music: 'lanesIndoor',
  ambience: 'drowned_house',
  // After chapter 5 the storm is over (`calmAfter`): no rain on the roof, and the room's `_calm` words.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_drowned_house' },
  vesWell: true,

  tiles: [
    '##############',
    '#hhhhhhhhhhhh#',
    '#;;;;;;;;;;;;#',
    '#;;;;;;;;;;;;#',
    '#;;;;;;;;;;;;;',
    '#;;;;;;;;;;;;#',
    '#;;;;;;;;;;;;#',
    '#;;;;;;;;;;;;#',
    '##;;;;;;;;;;##',
    '######;;######',
  ],

  // Where the player starts, in tile coordinates: just in from the front door.
  playerStart: { x: 6, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // The front door, out into the shallows in front of the cottage.
    { x: 6, y: 9, w: 2, h: 1, to: 'lanes_hamlet', spawn: { x: 5, y: 10 } },
    // Through to the kitchen.
    { x: 13, y: 4, w: 1, h: 1, to: 'secret_lanes_kitchen', spawn: { x: 1, y: 6 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lanes.txt',
  props: [
    // The north wall: a window with the storm in it, a cold hearth.
    { sprite: 'in_window_storm', x: 3, y: 1, text: 'cot_window' },
    { sprite: 'th_hearth_cold', x: 7, y: 2, text: 'cot_hearth' },
    // What floated: the armchair, the laid table, a pile of books.
    { sprite: 'armchair', x: 3, y: 5, text: 'cot_chair' },
    { sprite: 'mw_laid_table', x: 8, y: 6, text: 'cot_table' },
    { sprite: 'in_book_pile', x: 2, y: 3, text: 'cot_books', walkable: true },
    // The dresser, against the kitchen door, and the stump that puts it back.
    { sprite: 'mw_dresser', x: 12, y: 4, text: 'cot_dresser', rock: true },
    { sprite: 'rock_stump', x: 1, y: 7, text: 'cot_stump', rockReset: true },
  ],
  tileTexts: { '#': 'cot_wall', h: 'cot_wall', ';': 'cot_water' },

  // One shellac in the parlour, patrolling the north end (row 3, x 3 to 7). It stays clear of
  // the front door (6,9) and its spawn, of the kitchen door (13,4) and of the dresser's push
  // tiles. No cutscenes in this room.
  npcs: [
    { enemy: 'shellac', x: 5, y: 3, patrol: [3, 7], behaviour: 'patrol' },
  ],
};
