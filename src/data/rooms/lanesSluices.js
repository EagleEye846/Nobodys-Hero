// THE SLUICES: an old sluice house on a stone quay in the middle of a flooded basin, and the
// wheels that let the water out or in. No clock here: the water stays where you set it. West of
// the quay the basin drains to a bed of mud (with a drowned cottage's footings in it); east of
// the quay is a deep pool held back by an old weir. At LOW water the weir's crest stands out of
// the pool in a row of broken teeth you can't get over; at HIGH water it's a knee-deep ford.
// So: DRAIN from the west bank and walk the bed to the quay; FILL from the quay and wade the
// weir to the east bank. Each wheel only turns one way (the sign on it says which), and there
// is one at each place you can be stranded: the west bank drains, the quay does both, the
// east bank fills.
// Tile key (see src/overworld/coastTiles.js, lanes):
//   #  rock top (solid)   W  mossy stone face (solid)   ,  turf   .  drowned cobbles   :  mud
//   ;  shallows / ford (walk)   ~  floodwater (solid)   x  barnacle rock (the weir's teeth)
//   h  the sluice house wall (solid)   I  a post   O  boulder   F  weed

export const LANES_SLUICES = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lanes_sluices',
  // The room's name, for the Room Editor.
  name: 'THE SLUICES',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lanes',
  // The Sunken Lanes' song, and the sounds of the place under it.
  music: 'lanes',
  ambience: 'storm_shore',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_shore', lamplight: { shade: 0.18, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,

  // The HIGH-water map.
  tiles: [
    '########################################',
    '##WWWWWWWWWWWWWWWWWWWWWWWWWW####WWWWWW##',
    '#W,,.,~~~~~~~~~~~~~~~~~~~~~~WWWW~~,,,,W#',
    '#,F,,~~~~~~~~~~~~~~~~~~~~~x~~x~~~~~,x;,#',
    '#,.,;~~~~~~~~~~~~~~~~~~~~~~~~~~x~~~,,,,#',
    '#.,,,;~~~~~~~~~~IhhhhhhI~~~~~~~~~,;,,.,#',
    '#,,,,,,~~~~~~~~~,.......~~~~~~~~~,,,,,,#',
    '#,,.,,,~~~~~~~~~........~~~~~~~~~~,.,,,#',
    '......~~~~~~~~~~........;;;;;;;;;;......',
    '......~~~~~~~~~~........;;;;;;;;;;......',
    '#,.,,,,~~~~~~~~~........~~~~~~~~~~,,.,,#',
    '#,,.;,~~~~~~~~~~........~~~~~~~~~~;,,.,#',
    '#,,,,,~~~~~~~~~~~.....,~~~~~~~~~~,,,,,,#',
    '#,,;,,~~~~~~~~~~~~~~~~~~~~~~~~~~~,,,,,,#',
    '#,,,;~~~~~~~~~~~~~~~~~~~~~~~~~x~~~~,;O,#',
    '#xO,,,~~~~~~~~~~~~~~~~~~;;;~~~~~~~~,,xx#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '########################################',
  ],

  // The water the wheels set. At LOW the west basin (x 6 to 15) and the mud round the quay's
  // north and south ends (x 16 to 23) are a bed you can walk; the weir (x 24 to 33, rows 8 and
  // 9) is rock; the east pool stays deep (so it can't be got round). The banks and the quay are
  // dry at both levels. Saved with the room.
  tide: {
    start: 'high',
    low: [
    '                                        ',
    '                                        ',
    '      ::::::::::::::::::                ',
    '      ::::::::::::;:::::                ',
    '      :;;:::::::::::::::                ',
    '      ::::::::::                        ',
    '      ::::::::::                        ',
    '      ::::::::::                        ',
    '      ::::::::::        xxxxxxxxxx      ',
    '      ::::::::::        xxxxxxxxxx      ',
    '      ::::::::::                        ',
    '      ::::::::::                        ',
    '      ::xxx:::::                        ',
    '      :::::::;::::::::::                ',
    '      ::x:x::::::::;;::: ::             ',
    '      :::::::::::::::::::::             ',
    '                                        ',
    '                                        ',
    ],
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'lanes_causeway', spawn: { x: 37, y: 8 } },
    { x: 39, y: 8, w: 1, h: 2, to: 'lanes_hamlet', spawn: { x: 2, y: 10 } },
    // The doorway in the pool (low water only: its step is mud then, and water at high).
    { x: 25, y: 14, w: 2, h: 1, to: 'secret_lanes_door', spawn: { x: 6, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lanes.txt',
  props: [
    // The wheels: DRAIN on the west bank, DRAIN and FILL on the quay, FILL on the east bank.
    { sprite: 'c5_sluice_wheel', x: 4, y: 6, text: 'sluice_drain', tideWheel: { to: 'low', text: 'sluice_drain_turn', already: 'sluice_drain_already', busy: 'sluice_busy' } },
    { sprite: 'c5_sluice_wheel', x: 18, y: 6, text: 'sluice_drain', tideWheel: { to: 'low', text: 'sluice_drain_turn', already: 'sluice_drain_already', busy: 'sluice_busy' } },
    { sprite: 'c5_sluice_wheel', x: 21, y: 6, text: 'sluice_fill', tideWheel: { to: 'high', text: 'sluice_fill_turn', already: 'sluice_fill_already', busy: 'sluice_busy' } },
    { sprite: 'c5_sluice_wheel', x: 35, y: 6, text: 'sluice_fill', tideWheel: { to: 'high', text: 'sluice_fill_turn', already: 'sluice_fill_already', busy: 'sluice_busy' } },
    { sprite: 'sign', x: 3, y: 10, text: 'sluice_sign' },
    { sprite: 'sluice_gate', x: 20, y: 5, text: 'sluice_house' },
    // The drowned cottage's footings out on the bed, with a purse in what was the kitchen.
    { sprite: 'gold_pouch', x: 9, y: 13, text: 'sluice_pouch', gold: 90, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // A page of the Fair Return's log (optional, secret: the way to her fog bell), in a bottle stuck in the mud in the far
    // north-east corner of the west basin, behind the sluice house: out of reach in the water at HIGH, walked to at LOW.
    { sprite: 'gs_log_bottle', x: 22, y: 2, text: 'sluice_log_bottle', gives: 'log_page_2', notice: true, taken: { gone: true } },
    { sprite: 'c5_buoys_pile', x: 2, y: 14, text: 'sluice_buoys' },
    { sprite: 'c5_rope_coil', x: 22, y: 11, text: 'sluice_rope', walkable: true },
    { sprite: 'street_lamp', x: 17, y: 11, text: 'fork_lamp' },
    { sprite: 'street_lamp', x: 36, y: 10, text: 'fork_lamp' },
    // Dressing (2026-11-08): planks and weed the flood brought down and left in the basin (or on
    // the bed when it's drained), a boat turned over on the west bank to keep it out of the storm,
    // a net drying on the quay, lanterns on hooks lighting the two banks' wheels.
    { sprite: 'c5_planks_scatter', x: 9, y: 3, flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 28, y: 4, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 26, y: 13, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 10, y: 15, flat: true, walkable: true },
    { sprite: 'c5_boat_upturned', x: 1, y: 12 },
    { sprite: 'c5_lantern_hook', x: 2, y: 5 },
    { sprite: 'c5_lantern_hook', x: 38, y: 4 },
    { sprite: 'c5_net_torn', x: 18, y: 9, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 23, y: 11, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 35, y: 3, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 37, y: 11, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 1, y: 2, flat: true, walkable: true },
    // Second pass. The east pool is deep at both levels, so what the flood took stands in it:
    // a garden wall, a doorway with no house, a bean bed. Weed mats on top, the old lane's
    // walls on the bottom (flat ones in the west basin too, under the water or in the mud).
    { sprite: 'ln_sunk_wall_short', x: 24, y: 3, text: 'dress_sunk_wall' },
    // (2026-11-14) The doorway with no house round it is a way in: at LOW water a spit of mud runs out
    // along the pool's south edge (row 15, x 24 to 26) to its step (at HIGH the step is a patch of
    // shallows out in the pool, cut off), and through the open door is the
    // parlour of a house that isn't there (secret_lanes_door). Its jambs stay solid (`solidSides`).
    { sprite: 'ln_sunk_door', x: 25, y: 14, text: 'dress_sunk_door', walkable: true, solidSides: 5 },
    { sprite: 'ln_sunk_bed', x: 31, y: 13, text: 'dress_sunk_bed' },
    { sprite: 'ln_under_a', x: 25, y: 7, flat: true, walkable: true },
    { sprite: 'ln_under_b', x: 29, y: 15, flat: true, walkable: true },
    { sprite: 'ln_under_b', x: 7, y: 7, flat: true, walkable: true },
    { sprite: 'ln_under_a', x: 10, y: 12, flat: true, walkable: true },
    { sprite: 'ln_lily_mat', x: 29, y: 6, flat: true, walkable: true },
    { sprite: 'ln_lily_mat_b', x: 31, y: 11, flat: true, walkable: true },
    { sprite: 'ln_lily_small', x: 27, y: 2, flat: true, walkable: true },
    // Life pass (14 November 2026): belongings, signs, trees and small life.
    { sprite: 'lv_roof_ridge', x: 8, y: 10, text: 'lp_roof_ridge' },
    { sprite: 'lv_chimney', x: 12, y: 4, text: 'lp_chimney_sl' },
    { sprite: 'lv_sign_bakery', x: 1, y: 6, text: 'lp_sign_bakery' },
    { sprite: 'lv_bench', x: 1, y: 13, text: 'lp_bench_sl' },
  ],
  tileTexts: { '#': 'lanes_rock', W: 'lanes_rock', '~': 'sluice_water', ';': 'sluice_ford', x: 'sluice_teeth', h: 'sluice_house', I: 'sluice_post', O: 'lanes_stone', F: 'fork_weed' },

  // A wrackeel in the east pool (row 11, x 24 to 30: deep at both levels, it swims up to the
  // quay's south-east corner and back, never onto the weir on rows 8 and 9), and a bellbuoy
  // bobbing along the east bank's south end (row 13, x 34 to 38: dry at both levels, well clear
  // of the door and the FILL wheel). Nothing on the bed or the quay. No cutscenes here.
  npcs: [
    { enemy: 'wrackeel', x: 27, y: 11, patrol: [24, 30], behaviour: 'patrol' },
    { enemy: 'bellbuoy', x: 36, y: 13, patrol: [34, 38], behaviour: 'patrol' },
  ],
};
