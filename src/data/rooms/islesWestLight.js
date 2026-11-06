// THE WEST LIGHT: the last of the little lights, and a double one: two lamps on two towers,
// each on its own rock at the head of a sea inlet, each shining straight down its inlet onto the
// rope bridge across it. The beams only rock a little either side, so there's no getting past:
// the middle of each bridge is always lit. Each lamp has a shutter, and each shutter a crank;
// hold a crank and the shutter stays shut. TRIO CRANKS:
//   1. Bramble's crank (plate 5,6) is in a pen of rock on the west isle; the only way in is a
//      gap only he fits (5,8) (E steers him). Held, it shutters the west lamp (A).
//   2. Ves's crank (plate 21,6) is on the middle isle, past bridge A; its handle is up on the
//      post, and wants an umbrella crook (Q steers her). Held, it shutters the east lamp (B).
//   3. With both dark, the hero walks over both bridges to the big crank on the east isle (38,9),
//      which winds both shutters shut for good (lever `wl_shut`). Then R brings everybody over.
// Caught in a beam, it's a white wash and back to the last safe stop; nothing hurts. The stump
// (2,15) puts everyone back at the door if a split goes wrong.
// Tile key (see src/overworld/coastTiles.js, isles):
//   #  rock top (solid)   W  rock face (solid)   ,  wind turf   .  rock slabs   :  path
//   ~  the sea (solid; the beams go over it)   g  rope bridge   x  the pen's rocks (solid)

export const ISLES_WEST_LIGHT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'isles_west_light',
  // The room's name, for the Room Editor.
  name: 'THE WEST LIGHT',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'isles',
  music: 'isles',
  ambience: 'open_sea',
  vesWell: true,
  // No wrecks in the narrow inlets (they'd stand in front of the towers).
  skyline: false,

  tiles: [
    '############################################',
    '#WWWWWWWWWW~~~~~~~WWWWWWWW~~~~~~~WWWWWWWWWW#',
    '#WWWWWWWWWW~~~~~~~WWWWWWWW~~~~~~~WWWWWWWWWW#',
    '#,,,,,,,,,.~~~~~~~.,,,,,,.~~~~~~~.,,,,,,,,,#',
    '#,,xxxxx,,.~~~~~~~.,,,,,,.~~~~~~~.,,,,,,,,,#',
    '#,,x,,,x,,.~~~~~~~.,,,,,,.~~~~~~~.,,,,,,,,,#',
    '#,,x,,,x,,.~~~~~~~.,,,,,,.~~~~~~~.,,,,,,,,,#',
    '#,,x,,,x,,.~~~~~~~.,,,,,,.~~~~~~~.,,,,,,,,,#',
    '#,,xx,xx,,.~~~~~~~.,,,,,,.~~~~~~~.,,,,,,,,,#',
    '#,,,,,,,,,.~~~~~~~.,,,,,,.~~~~~~~.,,,,,,,,,#',
    '#,,,,,,,,,.~~~~~~~.,,,,,,.~~~~~~~.,,,,,,,,,#',
    ':::::::::::ggggggg.::::::.ggggggg.::::::::::',
    ':::::::::::ggggggg.::::::.ggggggg.::::::::::',
    '#,,,,,,,,,.~~~~~~~.,,,,,,.~~~~~~~.,,,,,,,,,#',
    '#,,,,,,,,,.~~~~~~~.,,,,,,.~~~~~~~.,,,,,,,,,#',
    '#,,,,,,,,,.~~~~~~~.,,,,,,.~~~~~~~.,,,,,,,,,#',
    '#,,,,,,,,,.~~~~~~~.,,,,,,.~~~~~~~.,,,,,,,,,#',
    '#,,,,,,,,,.~~~~~~~.,,,,,,.~~~~~~~.,,,,,,,,,#',
    '#,,,,,,,,,.~~~~~~~.,,,,,,.~~~~~~~.,,,,,,,,,#',
    '#,,,,,,,,,.~~~~~~~.,,,,,,.~~~~~~~.,,,,,,,,,#',
    '#WWWWWWWWWW~~~~~~~WWWWWWWW~~~~~~~WWWWWWWWWW#',
    '############################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 11 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 11, w: 1, h: 2, to: 'isles_forge', spawn: { x: 17, y: 9 } },
    { x: 43, y: 11, w: 1, h: 2, to: 'isles_causeway', spawn: { x: 2, y: 9 } },
  ],

  cutscenes: [],

  // The two lamps, on their towers at the inlets' heads, rocking either side of straight down.
  // Each goes dark while its crank is held, and both for good once the big crank is wound.
  lamps: [
    { x: 14, y: 2, arc: [80, 100], speed: 14, pause: 0.3, spread: 34, range: 12, off: ['wl_a', 'wl_shut'], art: 'lens' },
    { x: 29, y: 2, arc: [100, 80], speed: 14, pause: 0.3, spread: 34, range: 12, off: ['wl_b', 'wl_shut'], art: 'lens' },
  ],
  // Safe stops, out of both beams: each isle away from its bridge mouths.
  lampSafe: [
    { x: 1, y: 3, w: 8, h: 7 },
    { x: 1, y: 14, w: 8, h: 6 },
    { x: 1, y: 11, w: 7, h: 2 },
    { x: 20, y: 3, w: 4, h: 7 },
    { x: 35, y: 3, w: 8, h: 17 },
  ],
  lampText: { first: 'west_seen', again: 'west_seen_again' },

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/isles.txt',
  props: [
    // The two towers, standing in the sea on their own rocks (the lamps draw their lit glass).
    { sprite: 'il_light_tower', x: 14, y: 5, text: 'west_tower', walkable: true },
    { sprite: 'il_light_tower', x: 29, y: 5, text: 'west_tower', walkable: true },
    // 1. Bramble's crank, in the pen; the gap only he fits.
    { sprite: 'il_shutter_crank', x: 5, y: 5, text: 'west_crank_a' },
    { sprite: 'treadle', x: 5, y: 6, text: 'west_plate_a', treadle: 'wl_a', who: 'bramble' },
    { sprite: 'kid_gap', x: 5, y: 8, text: 'west_gap', gap: true },
    // 2. Ves's crank, on the middle isle.
    { sprite: 'il_shutter_crank', x: 21, y: 5, text: 'west_crank_b' },
    { sprite: 'treadle', x: 21, y: 6, text: 'west_plate_b', treadle: 'wl_b', who: 'vesper' },
    // 3. The big crank on the east isle: winds both shutters shut for good.
    { sprite: 'il_shutter_crank', x: 38, y: 9, text: 'west_crank_big', lever: 'wl_shut' },
    { sprite: 'sign', x: 3, y: 10, text: 'west_sign' },
    { sprite: 'sign', x: 36, y: 9, text: 'west_sign_far' },
    { sprite: 'rock_stump', x: 2, y: 15, text: 'west_stump', rockReset: true },
    // Rope bridge posts at the bridges' ends.
    { sprite: 'c5_chain_bollard', x: 10, y: 10, text: 'bridge_post_far' },
    { sprite: 'c5_chain_bollard', x: 18, y: 13, text: 'bridge_post_far' },
    { sprite: 'c5_chain_bollard', x: 25, y: 10, text: 'bridge_post_far' },
    { sprite: 'c5_chain_bollard', x: 33, y: 13, text: 'bridge_post_far' },
    { sprite: 'c5_barrels', x: 22, y: 16, text: 'west_oil' },
    { sprite: 'gold_pouch', x: 23, y: 18, text: 'west_pouch', gold: 260, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'isles_rock', W: 'isles_rock', '~': 'isles_sea', x: 'west_pen_rock', g: 'bridge_planks' },

  // A kelpie foal swimming in the west inlet, south of the bridge and out of the beam (row 17,
  // x 12 to 16), and an old diver on the east isle's south end (row 16, x 37 to 40). Neither
  // comes near the cranks, the plates, the gap, the bridges' mouths, the stump or a door.
  // No cutscenes in this room.
  npcs: [
    { enemy: 'kelpie_foal', x: 14, y: 17, patrol: [12, 16], behaviour: 'patrol' },
    { enemy: 'old_diver', x: 38, y: 16, patrol: [37, 40], behaviour: 'patrol' },
  ],
};
