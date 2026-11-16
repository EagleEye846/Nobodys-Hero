// THE STAIR: the curving stair up the tower, whitewashed, one flight to a landing and the next
// flight turning back on itself. Warm lamp niches in the wall, a window or two on the sea. Up on
// the top landing, in the whitewash beside the door to the little room, are two sets of height
// marks scratched side by side, with the years beside them: one is the real Hero's, the other
// Corrie's, and Corrie's stops sooner (the trail's fifth mark). PUZZLE-FREE, no monsters. The
// song is the lullaby, quietly.
//
// The flights (each a three-row landing, then a two-row wall that is the flight above it, seen
// from underneath) wind up from the bottom door (2, 22): east along the bottom, up the right
// side, west, up the left, east, up the right, then west to the door at the top (2, 3).
// SECRET: on the middle landing (rows 14-16), a stack of lamp-oil crates against the wall under the
// niche (b at 9,14, B at 10 and 11; a `cargo` box). Jump onto the b from the floor, then up onto a B:
// on top (11,14), where a small boy could climb and a big walrus couldn't, is a tin of Corrie's
// things (the Little Gansey, for Bramble, and a list in crayon). The walk up stays on rows 15-16.
// Tile key (see src/overworld/coastTiles.js, haddock_light, indoors):
//   #  wall top (solid)   h  white brick (solid)   6  lit window   H  lamp niche
//   D  the open door   o  boards

export const HADDOCK_LIGHT_STAIR = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'haddock_light_stair',
  // The room's name, for the Room Editor.
  name: 'THE STAIR',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'haddock_light',
  // "Come In, Little Boat", a music box, under the creak of the tower.
  music: 'corrieLullaby',
  ambience: 'lighthouse',
  // After the chapter (the_light_answers): no storm on the windows, as in the Isles' old lightroom.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_lighthouse' },
  // Under cover: no rain or lightning, and the edges of the screen sink into shadow.
  indoors: true,
  vesWell: true,
  // The lamp-oil crates on the middle landing (b and B, drawn as crates).
  cargo: [{ x: 9, y: 14, w: 3, h: 1 }],

  tiles: [
    '################',
    '#hhhhhhhhhhhhhh#',
    '#hhhhhhhhhhhhhh#',
    '#hDDhhhhh66hhhH#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#hhhhhhhHhhhooo#',
    '#hh6hhhhhhhhooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#ooohhhhhhhhhhh#',
    '#ooohhhhHhhh6hh#',
    '#oooooooobBBooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#hhhhhhhHhhhooo#',
    '#hhhhhhhhhhhooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '##oo############',
  ],

  // Where the player starts, in tile coordinates: just in from the bottom door.
  playerStart: { x: 2, y: 21 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Down to the parlour.
    { x: 2, y: 22, w: 2, h: 1, to: 'haddock_light_parlour', spawn: { x: 12, y: 3 } },
    // Up to the little room.
    { x: 2, y: 3, w: 2, h: 1, to: 'haddock_light_corries_room', spawn: { x: 5, y: 9 } },
  ],

  // The height marks (trail 5: the_height_marks), on the top landing on the way to Corrie's room.
  cutscenes: [
    { x: 11, y: 4, w: 2, h: 3, scene: 'the_height_marks', until: ['the_light_answers', 'haddock_gone'] },
  ],

  // The height marks on the top landing's wall, a crate and a barrel left on the stair.
  textFile: 'interactions/haddock_light.txt',
  props: [
    { sprite: 'c5_height_marks', x: 6, y: 3, text: 'stair_marks' },
    { sprite: 'c5_crate', x: 13, y: 15, text: 'stair_crate' },
    { sprite: 'c5_barrel', x: 13, y: 10, text: 'stair_barrel' },
    { sprite: 'c5_oilskin_hook', x: 1, y: 16, text: 'stair_hook' },
    { sprite: 'c5_rope_coil', x: 8, y: 20, text: 'stair_rope', walkable: true, flat: true },
    // Up on the oil crates: Corrie's hidey-hole (only from up there).
    { sprite: 'c5_chest', x: 11, y: 14, text: 'stair_hidey', gives: 'little_gansey', react: true, taken: { sprite: 'c5_chest_open', text: 'stair_hidey_empty' } },
    // (2026-11-08) A pencil drawing of the light on the bottom landing's wall.
    { sprite: 'in_sketch_light', x: 5, y: 18, text: 'in_stair_sketch' },
    // Lived in all the way up: rugs on the landings, his boots by the door, the barometer and
    // tide table where he passes them, a stool and mug for the halfway sit-down.
    { sprite: 'in_rug_blue', x: 6, y: 20, flat: true, walkable: true },
    { sprite: 'in_rug_red', x: 6, y: 5, flat: true, walkable: true },
    { sprite: 'in_boots', x: 5, y: 19 },
    { sprite: 'in_barometer', x: 9, y: 18 },
    { sprite: 'in_tide_paper', x: 9, y: 8 },
    { sprite: 'in_calendar', x: 5, y: 13 },
    { sprite: 'in_stool_mug', x: 4, y: 14 },
    { sprite: 'in_knot_board', x: 11, y: 3 },
    { sprite: 'c5_barrels', x: 9, y: 4 },
    { sprite: 'in_shelf_tins', x: 5, y: 8 },
    // (2026-11-08b) Every landing its own. The bottom one is the boot room: coats on pegs, rods in
    // the corner. The middle one (rows 14-16) is Corrie's hidey-hole with a pile of his books. The
    // next (rows 9-11) is where Haddock mends nets. The top, by the little room, has the red rug,
    // a geranium by the door and the cat.
    { sprite: 'in_coat_pegs', x: 2, y: 18, text: 'in_coats' },
    { sprite: 'in_rods_corner', x: 1, y: 19, text: 'in_rods' },
    { sprite: 'in_book_pile', x: 14, y: 14, text: 'in_books' },
    { sprite: 'in_net_mending', x: 6, y: 9, text: 'in_net' },
    { sprite: 'in_cat_bed', x: 13, y: 4, text: 'in_cat_bed' },
    { sprite: 'in_plant_pot', x: 1, y: 4, text: 'in_plant' },
  ],
  tileTexts: { '#': 'stair_wall', h: 'stair_wall', 6: 'stair_window', H: 'stair_niche', o: 'stair_floor', b: 'stair_oil_crates', B: 'stair_oil_crates' },

  // Nobody to fight on the stair.
  npcs: [],
};
