// THE UPPER HALL: the last room before the lamp. A signal lamp stands on an iron pillar in the middle
// of the north wall (15,3) and turns all the way round, once every eight seconds, throwing its beam
// across the floor. Three ranks of iron pillars stand across the hall, staggered; the beam can't get
// through them, so each leaves a shadow behind it to wait in. ONE LAMP, TIMING: cross the lit spokes
// between the pillars just after it has gone by. Caught, it's a white wash and back to the last safe
// stop; nothing hurts. The way on is the door in the north-east corner (26-27, row 2), behind a block
// of pillars (19-20, rows 3-5) that shadows it.
// SILENCE FIRST: the room has no music on the way in. Partway across (the east pocket, x 23-28,
// rows 8-10) the scene `lastlight_song` plays and the song comes in; after that it plays here.
//   - The lamp is the prop `c5_long_lantern` on its tile (15,3); the lamp's own art is off.
//   - Safe stops (`lampSafe`): the south-west strip (the arrival), the south-east strip, the east pocket,
//     and the shadowed corner by the door.
//   - No monsters (the beam is the room's trouble). Purse 250 in the south-east (28,13).
// Tile key (see src/overworld/coastTiles.js, lastlight, indoors):
//   #  wall top (solid)   h  black brick (solid)   H  lamp niche   6  slit window   .  flagstones
//   I  iron pillar (solid; stops the beam)   D  the door up   o  the door down
// (draft) story text, for Patrick to review.

export const LASTLIGHT_UPPER = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lastlight_upper',
  // The room's name, for the Room Editor.
  name: 'THE UPPER HALL',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lastlight',
  // Silent on the way in; "The Long Climb" comes in partway across (scene lastlight_song).
  music: null,
  musicAfter: { scene: 'lastlight_song', song: 'lastlight' },
  ambience: 'last_light',
  indoors: true,
  vesWell: true,

  tiles: [
    '##############################',
    '#hhhhhhhhhhhhhhhhhhhhhhhhhhhh#',
    '#hhhhHhhhh6hhhhhhhhhh6hhHhDDh#',
    '#..................II........#',
    '#..................II........#',
    '#..................II........#',
    '#............................#',
    '#..IIII....IIII....IIII..III.#',
    '#............................#',
    '#............................#',
    '#............................#',
    '#III....IIII....IIII...IIII..#',
    '#............................#',
    '#............................#',
    '#............................#',
    '#....IIII....IIII....IIII....#',
    '#............................#',
    '#............................#',
    '##oo##########################',
  ],

  // Where the player starts, in tile coordinates: the south-west strip, out of the beam.
  playerStart: { x: 2, y: 16 },

  doors: [
    // Back down to the gallery.
    { x: 2, y: 18, w: 2, h: 1, to: 'lastlight_gallery', spawn: { x: 30, y: 4 } },
    // Up to the lamp room.
    { x: 26, y: 2, w: 2, h: 1, to: 'lastlight_lamp', spawn: { x: 10, y: 12 } },
  ],

  // The song comes in on the east pocket (see `musicAfter`).
  cutscenes: [
    { x: 23, y: 8, w: 6, h: 3, scene: 'lastlight_song' },
  ],

  // The signal lamp: all the way round, eight seconds a turn.
  lamps: [
    { x: 15, y: 3, speed: 45, spread: 24, range: 20, art: false },
  ],
  lampSafe: [
    { x: 1, y: 16, w: 13, h: 2 },
    { x: 17, y: 16, w: 12, h: 2 },
    { x: 23, y: 8, w: 6, h: 3 },
    { x: 21, y: 3, w: 8, h: 4 },
  ],
  lampText: { first: 'lamp_seen', again: 'lamp_seen_again' },

  textFile: 'interactions/lastlight.txt',
  props: [
    // The signal lamp, on its pillar by the north wall.
    { sprite: 'c5_long_lantern', x: 15, y: 3, text: 'upper_lamp', animation: 'c5_long_lantern', speed: 0.3 },
    { sprite: 'gold_pouch', x: 28, y: 13, text: 'upper_pouch', gold: 250, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'll_wall', h: 'll_wall', H: 'll_niche', 6: 'll_window', D: 'upper_door', o: 'll_door', '.': 'll_floor', I: 'upper_pillar' },

  // None: the beam is the trouble here.
  npcs: [],
};
