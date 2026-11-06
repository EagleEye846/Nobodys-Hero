// THE SLUICE ROOM: where the tower's great sluice is worked. The gate itself stands in the east wall
// (it lets the sea up into the lamp's cisterns), and beside it, on the wall, is the CRANK: an
// iron wheel the size of a cartwheel with a handle as long as your arm. It is stiff, and it will not
// stay up on its own: whoever works it has to stay on it. (It matters later: this is the room the
// finale comes back to, with the sea behind them.) The floor in front of the crank is left clear
// for that scene (x 19-28, rows 4-10); nothing stands in it.
//   - THE PUZZLE (a TRIO): a counterweight grille across the passage (the divider at x 18, the grille
//     on 18,8 and 18,9). It is hauled up by three weights, and each weight hangs from its own plate.
//     The hero's plate is beside the grille (17,9); Bramble's is in a little bricked room in the
//     north-west that only a small body fits into (the gap at 3,6; E steers him); Ves's is across the
//     room on the south side (13,13; Q steers her). With all three held the grille rises; step off
//     the plate into the grille. R brings the others after. Once through a door, it stays open.
//   - The stump (3,14) puts everyone back at the door.
//   - Doors: the stair (2-3, row 16, bottom left); the gallery (29, rows 11-12, east wall).
//   - Purse 250 in the south-east corner. A pair of monsters in the north-west.
// Tile key (see src/overworld/coastTiles.js, lastlight, indoors):
//   #  wall top (solid)   h  black brick (solid)   H  lamp niche   6  slit window   .  flagstones   o  a door
// (draft) story text, for Patrick to review.

export const LASTLIGHT_SLUICE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lastlight_sluice',
  // The room's name, for the Room Editor.
  name: 'THE SLUICE ROOM',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lastlight',
  music: 'lastlight',
  ambience: 'last_light',
  indoors: true,
  vesWell: true,

  tiles: [
    '##############################',
    '#hhhhhhhhhhhhhhhhhhhhhhhhhhhh#',
    '#hhhhhHhhhhh6hhhhhhhhHhhhhh6h#',
    '#....h............h..........#',
    '#....h............h..........#',
    '#....h............h..........#',
    '#hh.hh............h..........#',
    '#.................h..........#',
    '#............................#',
    '#............................#',
    '#.................h..........#',
    '#.................h..........o',
    '#.................h..........o',
    '#.................h..........#',
    '#.................h..........#',
    '#.................h..........#',
    '##oo##########################',
  ],

  // Where the player starts, in tile coordinates: in from the stair.
  playerStart: { x: 2, y: 15 },

  doors: [
    // Down the stair.
    { x: 2, y: 16, w: 2, h: 1, to: 'lastlight_stair', spawn: { x: 2, y: 3 } },
    // On to the gallery.
    { x: 29, y: 11, w: 1, h: 2, to: 'lastlight_gallery', spawn: { x: 1, y: 11 } },
  ],

  cutscenes: [],

  textFile: 'interactions/lastlight.txt',
  props: [
    // THE CRANK and the sluice gate it works, in the east wall. Floor in front (x 19-28, rows 4-10) stays clear.
    { sprite: 'c5_crank_wheel', x: 24, y: 3, text: 'sluice_crank', animation: 'c5_crank_wheel', speed: 0.5 },
    { sprite: 'c5_sluice_gate', x: 27, y: 3, text: 'sluice_gate' },
    { sprite: 'c5_lantern_post_lit', x: 20, y: 3, text: 'sluice_lamp', animation: 'c5_lantern_post_lit', speed: 0.25 },
    // The weight grille, and its three plates (each with a wheel on its chain).
    { sprite: 'gate_narrow', x: 18, y: 8, text: 'sluice_grille', opensWith: ['sl_h', 'sl_v', 'sl_b'], openText: 'sluice_grille_open' },
    { sprite: 'gate_narrow', x: 18, y: 9, text: 'sluice_grille', opensWith: ['sl_h', 'sl_v', 'sl_b'] },
    { sprite: 'c5_sluice_wheel', x: 17, y: 8, text: 'sluice_wheel_hero' },
    { sprite: 'treadle', x: 17, y: 9, text: 'sluice_plate_hero', treadle: 'sl_h', who: 'hero' },
    { sprite: 'c5_sluice_wheel', x: 2, y: 3, text: 'sluice_wheel_bramble' },
    { sprite: 'treadle', x: 2, y: 4, text: 'sluice_plate_bramble', treadle: 'sl_b', who: 'bramble' },
    { sprite: 'kid_gap', x: 3, y: 6, text: 'sluice_gap', gap: true },
    { sprite: 'c5_sluice_wheel', x: 13, y: 12, text: 'sluice_wheel_ves' },
    { sprite: 'treadle', x: 13, y: 13, text: 'sluice_plate_ves', treadle: 'sl_v', who: 'vesper' },
    { sprite: 'rock_stump', x: 3, y: 14, text: 'rock_stump', rockReset: true },
    { sprite: 'sign', x: 16, y: 10, text: 'sluice_sign' },
    // Stores along the south wall.
    { sprite: 'c5_barrels', x: 21, y: 14, text: 'sluice_barrels' },
    { sprite: 'c5_crate', x: 25, y: 14, text: 'sluice_crate' },
    { sprite: 'c5_rope_coil', x: 8, y: 14, text: 'sluice_rope', walkable: true, flat: true },
    { sprite: 'gold_pouch', x: 28, y: 14, text: 'sluice_pouch', gold: 250, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'll_wall', h: 'll_wall', H: 'll_niche', 6: 'll_window', o: 'll_door', '.': 'll_floor' },

  // A salt shade and a storm imp in the north-west corner of the west half (x 8-13, rows 4-5), clear
  // of the closet (x 1-5), the way from the stair door to the plates (rows 7-15), the hero's plate and
  // the grille, and well away from the clear floor in front of the crank. No cutscenes in this room.
  npcs: [
    { enemy: 'salt_shade', x: 9, y: 4, patrol: [8, 11], behaviour: 'wander' },
    { enemy: 'storm_imp', x: 11, y: 5, patrol: [10, 13], behaviour: 'wander' },
  ],
};
