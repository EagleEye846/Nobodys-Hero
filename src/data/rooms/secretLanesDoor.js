// THE PARLOUR (a secret): through the doorway with no house round it, out in the Sluices' east
// pool (lanes_sluices 25,14; at LOW water a spit of mud runs out to its step). Inside, the front
// room of the house that washed away, exactly as it was the day the water came: dry and warm, a
// fire in the grate, the clock going, the tea things out, rain on the window and a summer lane
// behind it. Nobody. Nothing explained. A blanket box with something warm in it, and a purse down
// the side of the armchair. PUZZLE-FREE, no monsters. The front door (6..7, row 9) goes back out
// into the pool, onto the mud in front of the doorway.
// Tile key (see src/overworld/coastTiles.js, lanes, indoors):
//   #  wall top (solid)   h  board wall (solid)   o  floorboards
// (draft)

export const SECRET_LANES_DOOR = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'secret_lanes_door',
  // The room's name, for the Room Editor.
  name: 'THE PARLOUR',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lanes',
  indoors: true,
  // No song: the fire and nothing else.
  music: null,
  ambience: 'hearth',
  vesWell: true,

  // A front room with the corners by the door taken off.
  tiles: [
    '##############',
    '#hhhhhhhhhhhh#',
    '#hhhhhhhhhhhh#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '#oooooooooooo#',
    '##oooooooooo##',
    '######oo######',
  ],

  // Where the player starts, in tile coordinates: just in from the door.
  playerStart: { x: 6, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Back out: onto the mud in front of the doorway (it's only there at low water, and that's
    // the only way in).
    { x: 6, y: 9, w: 2, h: 1, to: 'lanes_sluices', spawn: { x: 25, y: 15 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lanes.txt',
  props: [
    // The north wall: a picture, the window, the fire, a lamp, a shelf, and the clock in the corner.
    { sprite: 'ln_parlour_window', x: 1, y: 2, text: 'pdoor_window',
      glow: [{ dy: -14, bloom: 12, strength: 0.35, flicker: 0, color: '255, 236, 180' }, { dy: 14, pool: 46, strength: 0.4, flicker: 0, color: '255, 232, 176' }] },
    { sprite: 'fireplace', x: 5, y: 3, text: 'pdoor_fire', animation: 'fireplace', speed: 0.2 },
    { sprite: 'in_wall_lamp', x: 8, y: 2, text: 'pdoor_lamp' },
    { sprite: 'in_shelf_neat', x: 9, y: 2, text: 'pdoor_shelf' },
    { sprite: 'in_sketch_boat', x: 11, y: 2, text: 'pdoor_sketch' },
    { sprite: 'ln_parlour_clock', x: 12, y: 3, text: 'pdoor_clock', animation: 'ln_parlour_clock', speed: 0.5 },
    // By the fire: the armchair (a purse down the side of the cushion) and the rug.
    { sprite: 'armchair', x: 4, y: 4, text: 'pdoor_chair', gold: 150, taken: { sprite: 'armchair', text: 'pdoor_chair_empty' } },
    { sprite: 'in_rug_red', x: 5, y: 5, text: 'pdoor_rug', walkable: true, flat: true },
    // The tea things, out on the table, and the note.
    { sprite: 'in_rug_blue', x: 8, y: 6, text: 'pdoor_rug', walkable: true, flat: true },
    { sprite: 'mw_laid_table', x: 8, y: 6, text: 'pdoor_table' },
    // The blanket box, and what's in it.
    { sprite: 'c5_chest', x: 1, y: 6, text: 'pdoor_box', gives: 'still_warm_scone', taken: { sprite: 'c5_chest_open', text: 'pdoor_box_empty' } },
    { sprite: 'in_book_pile', x: 12, y: 6, text: 'pdoor_books' },
    { sprite: 'in_boots_dry', x: 9, y: 8, text: 'pdoor_boots' },
  ],
  tileTexts: { '#': 'pdoor_wall', h: 'pdoor_wall', o: 'pdoor_floor' },

  // None: a secret.
  npcs: [],
};
