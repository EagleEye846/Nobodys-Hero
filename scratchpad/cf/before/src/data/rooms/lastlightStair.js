// THE STAIR: the tower's winding stair, a long climb in short flights. At the bottom the sea comes
// in under the wall through a grate in the floor and fills the lowest hall, breathing in and out on a
// CLOCK. At LOW the hall is shingle, but a channel the old drain made runs across it from wall to
// wall (x 12) and stays deep: so the sea chest on the west bank has to be pushed out along the
// shingle and into the channel to sink and make a bridge (and on the way down, the chest on the east
// bank pushed west the same way). At HIGH the whole hall is sea (a chest
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
// (draft).

import { LIFE5_PROPS } from '../lifePass5.js';

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
  // After the chapter the storm is over: no more howl round the tower, only the sea far below.
  calmAfter: { scene: 'the_light_answers', ambience: 'calm_tower' },
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

  // The end of the chapter (tideHeldFinale.js): in at the top from the sluice room, the sea behind.
  cutscenes: [
    { x: 2, y: 3, w: 1, h: 1, scene: 'the_light_answers', after: 'the_crank' },
  ],

  textFile: 'interactions/lastlight.txt',
  props: [
    // The hall: a dial on each bank, the stump (dry at both tides), the sea chest, and a sign.
    { sprite: 'tide_dial', x: 4, y: 17, text: 'stair_dial', tideDial: true },
    { sprite: 'tide_dial', x: 21, y: 17, text: 'stair_dial', tideDial: true },
    { sprite: 'rock_stump', x: 3, y: 21, text: 'rock_stump', rockReset: true },
    { sprite: 'c5_crate', x: 5, y: 19, text: 'stair_crate', rock: true, float: true, step: true },
    // A second chest on the east bank, for the way back DOWN: chests go home whenever you come into a
    // tide room, so coming down from above (back to the save, or after the chapter) the first is on the
    // far side. Push this one west along row 21 into the channel. Its own stump on the east bank.
    { sprite: 'c5_crate', x: 19, y: 21, text: 'stair_crate', rock: true, float: true, step: true },
    { sprite: 'rock_stump', x: 24, y: 22, text: 'rock_stump', rockReset: true },
    { sprite: 'sign', x: 2, y: 18, text: 'stair_hall_sign' },
    { sprite: 'c5_sluice_wheel', x: 10, y: 16, text: 'stair_valve' },
    { sprite: 'c5_chain_bollard', x: 22, y: 21, text: 'stair_bollard' },
    { sprite: 'gold_pouch', x: 23, y: 19, text: 'stair_pouch_hall', gold: 100, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The landings.
    { sprite: 'c5_barrel', x: 20, y: 12, text: 'stair_barrel' },
    { sprite: 'c5_crates_stack', x: 3, y: 7, text: 'stair_crates' },
    { sprite: 'sign', x: 6, y: 8, text: 'stair_count' },
    { sprite: 'c5_lantern_post_unlit', x: 20, y: 7, text: 'stair_lamp' },
    { sprite: 'c5_rope_coil', x: 9, y: 13, text: 'stair_rope', walkable: true, flat: true },
    { sprite: 'gold_pouch', x: 14, y: 3, text: 'stair_pouch_top', gold: 200, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // (2026-11-08b) Each landing its own: the hall's wall has the tide's marks over the water and
    // a grating on the east bank where the sea comes up; landing B is the pipe landing (oil drums
    // and a coal spill); C has pipes and a valve over the monsters' floor; D, at the top, chains
    // and drums by the door. Nothing in the gaps (x 1-3 and 22-24) or on a chest's push line.
    { sprite: 'll_tide_marks', x: 13, y: 16, text: 'll_tide_marks' },
    { sprite: 'll_chain_hook', x: 2, y: 16, text: 'll_chain_hook' },
    { sprite: 'll_grating', x: 23, y: 17, flat: true, walkable: true },
    { sprite: 'll_pipes_run', x: 5, y: 11, text: 'll_pipes' },
    { sprite: 'll_pipes_end', x: 7, y: 11, text: 'll_pipes' },
    { sprite: 'll_pipe_riser', x: 21, y: 11, text: 'll_pipes' },
    { sprite: 'll_drums', x: 16, y: 12, text: 'll_drums' },
    { sprite: 'll_coal_spill', x: 13, y: 14, flat: true, walkable: true },
    { sprite: 'll_chain_hook', x: 10, y: 6, text: 'll_chain_hook' },
    { sprite: 'll_pipes_run', x: 13, y: 6, text: 'll_pipes' },
    { sprite: 'll_pipes_valve', x: 15, y: 6, text: 'll_pipes' },
    { sprite: 'll_pipes_end', x: 17, y: 6, text: 'll_pipes' },
    { sprite: 'll_kelp_drag', x: 8, y: 9, flat: true, walkable: true },
    { sprite: 'll_chain_hook', x: 5, y: 1, text: 'll_chain_hook' },
    { sprite: 'll_lamp_bracket', x: 12, y: 1, text: 'll_lamp_bracket' },
    { sprite: 'll_drums', x: 18, y: 2, text: 'll_drums' },
    { sprite: 'll_oil_spill', x: 8, y: 3, flat: true, walkable: true },
    // Weed the sea brought in, lying on the hall's water (and on the shingle when it goes out).
    { sprite: 'll_kelp_drag', x: 8, y: 18, flat: true, walkable: true },
    { sprite: 'll_kelp_drag', x: 16, y: 21, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 9, y: 22, flat: true, walkable: true },
    ...(LIFE5_PROPS['lastlight_stair'] ?? []),
  ],
  tileTexts: { '#': 'll_wall', h: 'll_wall', H: 'll_niche', 6: 'll_window', D: 'stair_top_door', o: 'stair_boards', '.': 'stair_bank', '~': 'stair_water', q: 'stair_shingle' },

  // A salt shade and a storm imp on the middle landing (C, rows 7-9), side by side near x 11-13 so they
  // come together. Clear of both flights' gaps (x 1-3 below, x 22-24 above), the crates (3,7) and the
  // sign (6,8). Nothing in the hall: the tide doesn't move monsters. Gone once the sea has been through
  // the tower (`until`: the end of the chapter).
  npcs: [
    { enemy: 'salt_shade', x: 11, y: 8, patrol: [10, 13], behaviour: 'wander', until: 'corrie_falls' },
    { enemy: 'storm_imp', x: 13, y: 9, patrol: [12, 15], behaviour: 'wander', until: 'corrie_falls' },
  ],
};
