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
//   I  iron pillar (solid; stops the beam)   J  the same pillar broken off short (solid; stops the beam
//      just the same: only its look differs)   D  the door up   o  the door down
// (draft).

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
  // After the chapter (the_light_answers): the storm is over. The wind's howl through the slit
  // windows goes, the signal lamp has stopped (its `until` below) and stands cold.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_tower' },

  tiles: [
    '##############################',
    '#hhhhhhhhhhhhhhhhhhhhhhhhhhhh#',
    '#hhhhHhhhh6hhhhhhhhhh6hhHhDDh#',
    '#q.......:::.:oooo.II.:::...q#',
    '#.q.....::.:::oooo.II..:::..:#',
    '#.......:.....::::.II...::...#',
    '#q.....::..........:.....:...#',
    '#..IIJI:...IIIJ....IJII..IIJ.#',
    '#.....::.........:::.......:.#',
    '#....::.......::::.:........:#',
    '#...::.......::.....::.......#',
    '#IJI:...IIJI::..JIII.:.IIJI..#',
    '#...::.....::........::......#',
    '#....:.....:..........::....q#',
    '#.....::..::...........::...q#',
    '#....IIIJ:...IJII....IJII.:..#',
    '#.::....:........:....::..::q#',
    '#.:..::::........::::::....qq#',
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

  // The song comes in on the east pocket (see `musicAfter`), or, if you've gone round it, at the
  // latest on the step under the door (the shadowed corner, safe from the lamp): it can't be missed.
  cutscenes: [
    { x: 23, y: 8, w: 6, h: 3, scene: 'lastlight_song' },
    { x: 26, y: 3, w: 2, h: 1, scene: 'lastlight_song' },
  ],

  // The signal lamp: all the way round, eight seconds a turn, until the storm ends.
  lamps: [
    { x: 15, y: 3, speed: 45, spread: 24, range: 20, art: false, until: 'the_light_answers' },
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
    { sprite: 'c5_long_lantern', x: 15, y: 3, text: 'upper_lamp', animation: 'c5_long_lantern', speed: 0.3, until: 'the_light_answers' },
    // After the chapter: stopped, and out.
    { sprite: 'c5_long_lantern_cold', x: 15, y: 3, text: 'upper_lamp_after', after: 'the_light_answers' },
    // The storm has been at the hall for a long time: rain blown in at the slit windows lies in
    // puddles under them, the walls are cracking and shedding stones, the floor is split where
    // the sea comes up through it, and a keeper's lantern lies where it was dropped. All flat,
    // so nothing here stops the beam or adds a shadow.
    { sprite: 'c5_puddle', x: 9, y: 3, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 21, y: 4, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 4, y: 3, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 28, y: 4, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 1, y: 12, flat: true, walkable: true },
    { sprite: 'c5_floor_crack', x: 7, y: 9, flat: true, walkable: true },
    { sprite: 'c5_floor_crack', x: 18, y: 13, flat: true, walkable: true },
    { sprite: 'c5_floor_crack', x: 26, y: 9, flat: true, walkable: true },
    { sprite: 'c5_floor_crack', x: 12, y: 16, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 14, y: 10, flat: true, walkable: true },
    { sprite: 'c5_lantern_fallen', x: 20, y: 13, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 15, y: 17, flat: true, walkable: true },
    { sprite: 'c5_net_torn', x: 5, y: 17, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 24, y: 17, flat: true, walkable: true },
    // (2026-11-08b) The ranks of pillars are old: some have lost their crowns (J), and the crowns lie
    // where they fell, flat on the flags (nothing new stands in the beam's way). Pipes, the tide's
    // marks, chains and a lamp bracket on the north wall; oil from the dropped lantern; kelp and a
    // drain grating where the sea comes up.
    { sprite: 'll_pillar_fallen', x: 5, y: 8, flat: true, walkable: true },
    { sprite: 'll_pillar_fallen', x: 15, y: 8, flat: true, walkable: true },
    { sprite: 'll_pillar_fallen', x: 9, y: 12, flat: true, walkable: true },
    { sprite: 'll_pillar_fallen', x: 22, y: 16, flat: true, walkable: true },
    { sprite: 'll_oil_spill', x: 21, y: 13, flat: true, walkable: true },
    { sprite: 'll_kelp_drag', x: 25, y: 14, flat: true, walkable: true },
    { sprite: 'll_grating', x: 18, y: 10, flat: true, walkable: true },
    { sprite: 'll_grating', x: 3, y: 14, flat: true, walkable: true },
    { sprite: 'll_pipes_run', x: 1, y: 2, text: 'll_pipes' },
    { sprite: 'll_pipes_valve', x: 3, y: 2, text: 'll_pipes' },
    { sprite: 'll_tide_marks', x: 7, y: 2, text: 'll_tide_marks' },
    { sprite: 'll_chain_hook', x: 12, y: 2, text: 'll_chain_hook' },
    { sprite: 'll_lamp_bracket', x: 18, y: 2, text: 'll_lamp_bracket' },
    { sprite: 'll_pipe_riser', x: 22, y: 2, text: 'll_pipes' },
    { sprite: 'll_chain_hook', x: 25, y: 2, text: 'll_chain_hook' },
    { sprite: 'gold_pouch', x: 28, y: 13, text: 'upper_pouch', gold: 250, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'll_wall', h: 'll_wall', H: 'll_niche', 6: 'll_window', D: 'upper_door', o: 'll_door', '.': 'll_floor', I: 'upper_pillar', J: 'upper_pillar_broken' },

  // None: the beam is the trouble here.
  npcs: [],
};
