// THE BALCONY: the gallery that runs round the outside of the lamp room, for the ending. NOT
// reachable by walking: the finale scene `goto`s it ({ do: 'goto', room: 'lastlight_balcony',
// spawn: { x: 12, y: 5 } }) and it plays out at dawn. No doors, no monsters, no puzzle, no music (the
// finale sets it).
//   - The ledge is boards, x 1-24, rows 3-6, with the lamp room's glass door in the wall behind it
//     (12-13, row 2) and a rail along its edge (row 7).
//   - Past the rail the room is open air (`_`, rows 8-15) with the sea view behind it. THE VIEW IS A
//     STAND-IN: `vista: { kind: 'sea' }` is Gullrest's summer view from the cliffs. The ending wants the sea
//     pulled back farther than anyone has seen, bare sand far below, a boat-slip carved with the Bother's
//     prow and a smudge of smoke to the north-east (the ash wastes): that needs its own view drawn.
//   - Room for "far off, a lantern lights": a spot on the sea view's horizon, left of centre.
//   - Weather is mostly off (the storm has gone); the finale scene fades the rest in or out.
// Tile key (see src/overworld/coastTiles.js, lastlight):
//   #  wall top (solid)   h  the lamp room's outer wall (solid)   6  slit window   D  the glass door
//   o  boards   f  the rail (solid)   _  open air
// (draft) story text, for Patrick to review.

export const LASTLIGHT_BALCONY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lastlight_balcony',
  // The room's name, for the Room Editor.
  name: 'THE BALCONY',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lastlight',
  // None: the finale sets it.
  music: null,
  ambience: 'open_sea',
  vesWell: true,
  // The sea and the beach far below (src/overworld/seaVista.js), a stand-in for the ending's view.
  vista: { kind: 'sea' },
  // The storm has gone: a little spray and mist, no rain, no bolts.
  atmosphere: { rain: 0, lightning: 0, spray: 0.4, foam: 0.5, fog: 0.15 },

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
  ],

  // Where the player starts, in tile coordinates: the middle of the ledge.
  playerStart: { x: 12, y: 5 },

  doors: [],

  cutscenes: [],

  textFile: 'interactions/lastlight.txt',
  props: [
    // A coil of rope and a lifebuoy on the boards: nothing that blocks the view.
    { sprite: 'c5_rope_coil', x: 5, y: 5, text: 'balcony_rope', walkable: true, flat: true },
    { sprite: 'c5_lifebuoy_post', x: 21, y: 5, text: 'balcony_buoy' },
  ],
  tileTexts: { '#': 'll_wall', h: 'll_wall', 6: 'll_window', D: 'balcony_door', o: 'balcony_boards', f: 'balcony_rail' },

  // None.
  npcs: [],
};
