// THE BALCONY: the gallery that runs round the outside of the lamp room, for the ending. NOT
// reachable by walking: the finale scene `goto`s it ({ do: 'goto', room: 'lastlight_balcony',
// spawn: { x: 12, y: 5 } }) and it plays out at dawn. No doors, no monsters, no puzzle, no music (the
// finale sets it).
//   - The ledge is boards, x 1-24, rows 3-6, with the lamp room's glass door in the wall behind it
//     (12-13, row 2) and a rail along its edge (row 7).
//   - Past the rail the room is open air (`_`, rows 8-21) with the dawn view behind it
//     (`vista: { kind: 'low_tide_dawn' }`, src/overworld/seaVista.js): the sea pulled back farther than
//     anyone has seen, bare sand, the smoke to the north-east, and far below (the finale pans down to it)
//     the boat-slip with the small boat's prow carved into it. The air goes down to row 21 so the camera
//     can look down over the rail.
//   - "Far off, a lantern lights": the finale (the_tide_held) puts `c5_far_lantern` out on the sand.
//   - Weather is mostly off (the storm has gone); the finale scene fades the rest in or out.
// Tile key (see src/overworld/coastTiles.js, lastlight):
//   #  wall top (solid)   h  the lamp room's outer wall (solid)   6  slit window   D  the glass door
//   o  boards   f  the rail (solid)   _  open air
// (draft).

export const LASTLIGHT_BALCONY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lastlight_balcony',
  // The room's name, for the Room Editor.
  name: 'THE BALCONY',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lastlight',
  // None: the finale sets it.
  music: null,
  // Dawn after the storm: the sea lying down, no rain or thunder.
  ambience: 'calm_sea',
  vesWell: true,
  // Dawn over the bare sand (src/overworld/seaVista.js, drawLowTideVista).
  vista: { kind: 'low_tide_dawn' },
  // The storm has gone: no rain, no bolts, no spray or foam (the sea is miles out), a breath of mist.
  atmosphere: { rain: 0, lightning: 0, spray: 0, foam: 0, fog: 0.06 },
  // Not under the storm's green shade (the Last Light's other rooms are): the
  // morning light falls on it as it is, with the dawn's own gold.
  lamplight: false,

  tiles: [
    '##########################',
    '#hhhhhhhhhhhhhhhhhhhhhhhh#',
    '#hh6hhh6hhhhDDhhhh6hhh6hh#',
    '#oooooooooooooooooooooooo#',
    '#oooooooooooooooooooooooo#',
    '#oooooooooooooooooooooooo#',
    '#oooooooooooooooooooooooo#',
    '#ffffffffffffffffffffffff#',
    '#________________________#',
    '#________________________#',
    '#________________________#',
    '#________________________#',
    '#________________________#',
    '#________________________#',
    '#________________________#',
    '#________________________#',
    '#________________________#',
    '#________________________#',
    '#________________________#',
    '#________________________#',
    '#________________________#',
    '#________________________#',
  ],

  // Where the player starts, in tile coordinates: the middle of the ledge.
  playerStart: { x: 12, y: 5 },

  doors: [],

  // The end of the chapter (tideHeldFinale.js): dawn, and the credits.
  cutscenes: [
    { x: 12, y: 5, w: 1, h: 1, scene: 'the_tide_held', after: 'the_bell' },
  ],

  textFile: 'interactions/lastlight.txt',
  props: [
    // A coil of rope and a lifebuoy on the boards: nothing that blocks the view.
    { sprite: 'c5_rope_coil', x: 5, y: 5, text: 'balcony_rope', walkable: true, flat: true },
    { sprite: 'c5_lifebuoy_post', x: 21, y: 5, text: 'balcony_buoy' },
    // (2026-11-08b) The storm's leavings on the ledge at dawn: puddles on the boards, the gulls'
    // marks, a chain on its hook by the door, oil drums against the wall at the east end.
    // Nothing on the rail or in front of the view.
    { sprite: 'll_chain_hook', x: 10, y: 2, text: 'll_chain_hook' },
    { sprite: 'll_chain_hook', x: 15, y: 2, text: 'll_chain_hook' },
    { sprite: 'll_drums', x: 23, y: 3, text: 'll_drums' },
    { sprite: 'c5_puddle', x: 8, y: 4, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 17, y: 6, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 14, y: 3, flat: true, walkable: true },
  ],
  tileTexts: { '#': 'll_wall', h: 'll_wall', 6: 'll_window', D: 'balcony_door', o: 'balcony_boards', f: 'balcony_rail' },

  // None.
  npcs: [],
};
