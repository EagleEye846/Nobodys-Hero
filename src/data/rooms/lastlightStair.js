// THE STAIR: the tower's winding stair, a long climb in short flights. At the bottom the sea comes
// in under the wall through a grate in the floor and fills the lowest hall, breathing in and out on a
// CLOCK. At LOW the hall is shingle, but a channel the old drain made runs across it from wall to
// wall (x 12) and stays deep: so the sea chest on the west bank has to be pushed out along the
// shingle and into the channel to sink and make a bridge. At HIGH the whole hall is sea (a chest
// pushed out then just floats). The stump on the west bank puts everything back.
// Above the hall the stair zig-zags up three more landings (the flight above seen from under it, like
// Haddock's), to the door at the top, which opens into the sluice room. A pair of monsters on the
// middle landing. Purses: one in the hall, one on the top landing.
//   - Hall x 1-24, rows 17-22: west bank x 1-5, the sea x 6-18 (channel x 12), east bank x 19-24.
//   - Flights: east gap (22-24, rows 15-16) up to landing B, west gap (1-3, rows 10-11) up to C,
//     east gap (22-24, rows 5-6) up to D. D's door is at the west end (1-2, row 1).
// Tile key (see src/overworld/coastTiles.js, lastlight, indoors):
//   #  wall top (solid)   h  black brick (solid)   H  lamp niche   6  slit window   D  the door up
//   o  landings and flights   .  flagstones   ~  the sea (solid)   q  shingle (low tide)
// (draft) story text, for Patrick to review.

export const LASTLIGHT_STAIR = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lastlight_stair',
  // The room's name, for the Room Editor.
  name: 'THE STAIR',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lastlight',
  music: 'lastlight',
  ambience: 'last_light',
  indoors: true,
  vesWell: true,

  // The HIGH-water map.
  tiles: [
    '##########################',
    '#DDhhhhhHhhhhhhhHhhhh6hhh#',
    '#oooooooooooooooooooooooo#',
    '#oooooooooooooooooooooooo#',
    '#oooooooooooooooooooooooo#',
    '#hhhhhhhhhhhHhhhhhhhhhooo#',
    '#hhhhhh6hhhhhhhhhhhhhhooo#',
    '#oooooooooooooooooooooooo#',
    '#oooooooooooooooooooooooo#',
    '#oooooooooooooooooooooooo#',
    '#ooohhhhhhhhhhhhhhHhhhhhh#',
    '#ooohhhhh6hhhhhhhhhhhhhhh#',
    '#oooooooooooooooooooooooo#',
    '#oooooooooooooooooooooooo#',
    '#oooooooooooooooooooooooo#',
    '#hhhhhhhhhhhhHhhhhhhhhooo#',
    '#hhhhhh6hhhhhhhhh6hhhhooo#',
    '#.....~~~~~~~~~~~~~......#',
    '#.....~~~~~~~~~~~~~......#',
    '#.....~~~~~~~~~~~~~......#',
    '#.....~~~~~~~~~~~~~......#',
    '#.....~~~~~~~~~~~~~......#',
    '#.....~~~~~~~~~~~~~......#',
    '##oo######################',
  ],

  // The hall's own sea, on a clock (16 s high, 18 s low). LOW: the shingle (x 6-11 and 13-18) shows, all
  // but the channel at x 12. HIGH: all sea. Both banks, the flights and the doors are dry at both tides.
  tide: {
    start: 'high',
    clock: { high: 16, low: 18, warn: 3 },
    low: [
      '                          ',
      '                          ',
      '                          ',
      '                          ',
      '                          ',
      '                          ',
      '                          ',
      '                          ',
      '                          ',
      '                          ',
      '                          ',
      '                          ',
      '                          ',
      '                          ',
      '                          ',
      '                          ',
      '                          ',
      '      qqqqqq qqqqqq       ',
      '      qqqqqq qqqqqq       ',
      '      qqqqqq qqqqqq       ',
      '      qqqqqq qqqqqq       ',
      '      qqqqqq qqqqqq       ',
      '      qqqqqq qqqqqq       ',
      '                          ',
    ],
  },

  // Where the player starts, in tile coordinates: just in from the bottom door.
  playerStart: { x: 2, y: 21 },

  doors: [
    // Down to the foot of the tower.
    { x: 2, y: 23, w: 2, h: 1, to: 'lastlight_foot', spawn: { x: 11, y: 3 } },
    // Up to the sluice room.
    { x: 1, y: 1, w: 2, h: 1, to: 'lastlight_sluice', spawn: { x: 2, y: 15 } },
  ],

  cutscenes: [],

  textFile: 'interactions/lastlight.txt',
  props: [
    // The hall: a dial on each bank, the stump (dry at both tides), the sea chest, and a sign.
    { sprite: 'tide_dial', x: 4, y: 17, text: 'stair_dial', tideDial: true },
    { sprite: 'tide_dial', x: 21, y: 17, text: 'stair_dial', tideDial: true },
    { sprite: 'rock_stump', x: 3, y: 21, text: 'rock_stump', rockReset: true },
    { sprite: 'c5_crate', x: 5, y: 19, text: 'stair_crate', rock: true, float: true, step: true },
    { sprite: 'sign', x: 2, y: 18, text: 'stair_hall_sign' },
    { sprite: 'c5_sluice_wheel', x: 10, y: 16, text: 'stair_valve' },
    { sprite: 'c5_chain_bollard', x: 22, y: 21, text: 'stair_bollard' },
    { sprite: 'gold_pouch', x: 23, y: 19, text: 'stair_pouch_hall', gold: 100, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The landings.
    { sprite: 'c5_barrel', x: 20, y: 12, text: 'stair_barrel' },
    { sprite: 'c5_crates_stack', x: 3, y: 7, text: 'stair_crates' },
    { sprite: 'sign', x: 6, y: 8, text: 'stair_count' },
    { sprite: 'c5_lantern_post_lit', x: 20, y: 7, text: 'stair_lamp', animation: 'c5_lantern_post_lit', speed: 0.25 },
    { sprite: 'c5_rope_coil', x: 9, y: 13, text: 'stair_rope', walkable: true, flat: true },
    { sprite: 'gold_pouch', x: 14, y: 3, text: 'stair_pouch_top', gold: 200, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'll_wall', h: 'll_wall', H: 'll_niche', 6: 'll_window', D: 'stair_top_door', o: 'stair_boards', '.': 'stair_bank', '~': 'stair_water', q: 'stair_shingle' },

  // A salt shade and a storm imp on the middle landing (C, rows 7-9), side by side near x 11-13 so they
  // come together. Clear of both flights' gaps (x 1-3 below, x 22-24 above), the crates (3,7) and the
  // sign (6,8). Nothing in the hall: the tide doesn't move monsters. No cutscenes in this room.
  npcs: [
    { enemy: 'salt_shade', x: 11, y: 8, patrol: [10, 13], behaviour: 'wander' },
    { enemy: 'storm_imp', x: 13, y: 9, patrol: [12, 15], behaviour: 'wander' },
  ],
};
