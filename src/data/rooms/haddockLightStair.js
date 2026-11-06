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
  // Under cover: no rain or lightning, and the edges of the screen sink into shadow.
  indoors: true,
  vesWell: true,

  tiles: [
    '################',
    '#hhhhhhhhhhhhhh#',
    '#hhhhhhhhhhhhhh#',
    '#hDDhhhhh66hhhH#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#hhhhhhhHhhhooo#',
    '#hhhhhhhhhhhooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#oooooooooooooo#',
    '#ooohhhhhhhhhhh#',
    '#ooohhhhHhhhhhh#',
    '#oooooooooooooo#',
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

  cutscenes: [],

  // The height marks on the top landing's wall, a crate and a barrel left on the stair.
  textFile: 'interactions/haddock_light.txt',
  props: [
    { sprite: 'c5_height_marks', x: 6, y: 3, text: 'stair_marks' },
    { sprite: 'c5_crate', x: 13, y: 15, text: 'stair_crate' },
    { sprite: 'c5_barrel', x: 13, y: 10, text: 'stair_barrel' },
    { sprite: 'c5_rope_coil', x: 8, y: 20, text: 'stair_rope', walkable: true, flat: true },
  ],
  tileTexts: { '#': 'stair_wall', h: 'stair_wall', 6: 'stair_window', H: 'stair_niche', o: 'stair_floor' },

  // Nobody to fight on the stair.
  npcs: [],
};
