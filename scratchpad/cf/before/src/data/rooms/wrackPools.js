// THE POOLS: a low-tide crossing. An inlet cuts the beach in two. At high tide it is all
// deep water, and a crate floats in the middle; at low tide the water draws back off a bed of
// shingle and tidepools, all but one deep trench. A tide wheel on each bank sends the water
// either way. At low tide, push the crate two tiles into the trench: it sinks and makes a
// bridge, and the far bank (and the way on) is reachable. The reset stump sets everything
// back if the crate goes wrong.
// The west door goes back over the Headland (wrack_headland) to the landing.
// Tile key (see src/overworld/coastTiles.js, wrack):
//   #  cliff top (solid)   W  cliff face (solid)   .  wet shingle   ,  salt grass   q  shingle
//   ;  shallows (walk)   ~  sea (solid)   x  barnacle rock (solid)   O  boulder   F  weed pile

export const WRACK_POOLS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wrack_pools',
  // The room's name, for the Room Editor.
  name: 'THE POOLS',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wrack',
  // The Wrack Shore's song (src/data/music/wrackTheme.js), and the sounds of the place under it.
  music: 'wrack',
  ambience: 'storm_shore',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_shore', lamplight: { shade: 0.16, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,

  tiles: [
    '############################################',
    '##WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW####WWWW##',
    '#W......~..~~~~~~~~~~~~~~~~.......W##W....W#',
    '#.;;..x...~~~~~~~~~~~~~~~~~~.;,,,,,WW,,,,,,#',
    '#.;.....O~~~~~~~~~~~~~~~~~~~~;,,,,,,,,,,,,,#',
    '#........~~~~~~~~~~~~~~~~~~~~.,,,,,,,,,,,,,#',
    '#x........~~~~~~~~~~~~x~~~~~~~,,,,,,,,,,,,,#',
    '#........~~~~~~~~~~~~~~~~~~~~~.,,,,,,,,....#',
    '.........~~~~~~~~~~~~~~~~~~~~............F..',
    '.........~~x~~~~~~~~~~~~~~~~................',
    '#.......;~~~~~~~~~~~~~~~~~~~..O........;;..#',
    '#......;;~~~~~~~~~~~~~~~~~~~~~........;;;..#',
    '#...;;...~~~~~~~~~~~~~~~~~~~~.......;;.O...#',
    '#,,,,,,,,~~~~~~~x~~~~~~~~~~~~.x......;;..Ox#',
    '#O,,,,,F,.~~~~~~~~~~~~~~~~~~.x.x........Oxx#',
    '#xxO,,,,,..~~~~~~~~~~~~~~~~...........xOxxO#',
    '#WWWWWWWW~~~~~~~~~~~~~~~~~~~~WWWWWWWWWWWWWW#',
    '############################################',
  ],

  // The tide: a bed of shingle shows at LOW, with a trench of deep water down column 20 that
  // stays deep. A wheel on each bank turns the tide (both banks are dry at both tides). At
  // low tide push the crate (18,8) two tiles east into the trench: it sinks and bridges it.
  // The reset stump (3,11) puts the tide and the crate back. Row 15 and 16 of the inlet
  // stay deep so the shallows cannot be waded round.
  tide: {
    start: 'high',
    low: [
    '                                            ',
    '                                            ',
    '         qqqqqqqqqqq~qqqqqqqq               ',
    '         qqqqqqqqqqq~qqqqqqqq               ',
    '         qqqqqqqqqqq~qqqqq;qq               ',
    '         qqq;;qqqqqq~qqqqqqqq               ',
    '         qqqq;qqqqqq~qqxqqqqq               ',
    '         qqqqqqqqqqq~qqqqqqqq               ',
    '         qqqqqqqqqqq~qqqqqqqq               ',
    '         qqxqqqqqqqq~qqqqqqqq               ',
    '         qqqqqqqqqqq~qqq;;qqq               ',
    '         qqqqqqqqqqq~qqqq;qqq               ',
    '         qqqqqq;qqqq~qqqqqqqq               ',
    '         qqqqqqqqxqq~qqqqqqqq               ',
    '         qqqqqqqqqqq~qqqqqqqq               ',
    '                                            ',
    '                                            ',
    '                                            ',
    ],
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'wrack_headland', spawn: { x: 37, y: 11 } },
    { x: 43, y: 8, w: 1, h: 2, to: 'wrack_gaps', spawn: { x: 2, y: 12 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wrack.txt',
  props: [
    // A tide bell on each bank (like the cove's), a reset stump, the crate, and the bank's odds and ends.
    { sprite: 'c5_harbour_bell', x: 5, y: 6, text: 'pools_bell', animation: 'c5_harbour_bell', speed: 0.9,
      tideBell: { to: 'toggle', text: 'pools_bell_ring', busy: 'pools_bell_busy' } },
    { sprite: 'c5_harbour_bell', x: 32, y: 5, text: 'pools_bell', animation: 'c5_harbour_bell', speed: 0.9,
      tideBell: { to: 'toggle', text: 'pools_bell_ring', busy: 'pools_bell_busy' } },
    { sprite: 'rock_stump', x: 3, y: 11, text: 'rock_stump', rockReset: true },
    { sprite: 'c5_crate', x: 18, y: 8, text: 'pools_crate', rock: true, float: true, step: true },
    // The way back. Crates go home every time you come in, so a player coming back from the
    // gaps would find the first crate on the west side of the trench and be stuck on the east
    // bank. This one sits east of the trench (afloat at high): at low, push it two tiles west
    // from (23,11) and it bridges the trench at (20,11). It can't be reached from the west
    // before crossing, so the puzzle going east is the same.
    { sprite: 'c5_crate', x: 22, y: 11, text: 'pools_crate', rock: true, float: true, step: true },
    { sprite: 'sign', x: 7, y: 9, text: 'pools_sign' },
    { sprite: 'c5_buoys_pile', x: 2, y: 14, text: 'pools_buoys' },
    { sprite: 'c5_driftwood', x: 34, y: 14, text: 'landing_driftwood' },
    { sprite: 'c5_rope_coil', x: 31, y: 8, text: 'landing_pots', walkable: true },
    { sprite: 'gold_pouch', x: 40, y: 4, text: 'pools_pouch', gold: 45, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Dressing (second pass). Stones out in the inlet (in the water at high tide, on the bed at
    // low): all on rows 3, 4, 13 and 14, well clear of the crates' rows (8 and 11) and the trench.
    // The barnacle rocks at (11,9), (16,13) and (22,6) stand at both tides now.
    { sprite: 'c5_rocks_weedy', x: 12, y: 3, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 17, y: 4, text: 'shore_rocks' },
    { sprite: 'c5_rocks_weedy', x: 24, y: 14, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 10, y: 13, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 26, y: 3, text: 'shore_rocks' },
    { sprite: 'c5_rocks_weedy', x: 21, y: 3, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 28, y: 4, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 13, y: 14, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 9, y: 3, text: 'shore_rocks' },
    { sprite: 'c5_weed_mat', x: 14, y: 6, flat: true, walkable: true },
    { sprite: 'c5_weed_mat', x: 23, y: 13, flat: true, walkable: true },
    { sprite: 'c5_weed_mat', x: 16, y: 2, flat: true, walkable: true },
    // The west bank: a lantern by the way in, a fire in the grass, weed and pools on the stones.
    { sprite: 'c5_lantern_hook', x: 1, y: 7, text: 'shore_lantern' },
    { sprite: 'c5_drift_fire', x: 5, y: 15, text: 'shore_fire' },
    { sprite: 'c5_rocks_weedy', x: 6, y: 2, text: 'shore_rocks' },
    { sprite: 'c5_rock_pool', x: 3, y: 5, flat: true, walkable: true },
    { sprite: 'c5_weed_mat', x: 6, y: 4, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 4, y: 10, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 1, y: 13, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 8, y: 13, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 2, y: 2, flat: true, walkable: true },
    // The east bank: an old fence across the turf, a fire and a lantern by the way on.
    { sprite: 'c5_rocks_weedy', x: 37, y: 3, text: 'shore_rocks' },
    { sprite: 'c5_fence_broken', x: 35, y: 6, text: 'shore_fence' },
    { sprite: 'c5_drift_fire', x: 39, y: 6, text: 'shore_fire' },
    { sprite: 'c5_lantern_hook', x: 42, y: 7, text: 'shore_lantern' },
    { sprite: 'c5_rock_weedy', x: 37, y: 14, text: 'shore_rocks' },
    { sprite: 'c5_marram', x: 34, y: 4, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 30, y: 6, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 41, y: 3, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 31, y: 3, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 38, y: 7, flat: true, walkable: true },
    { sprite: 'c5_weed_mat', x: 29, y: 9, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 29, y: 12, flat: true, walkable: true },
    { sprite: 'c5_rock_pool', x: 32, y: 14, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 35, y: 9, flat: true, walkable: true },
    // Stones on the lip of each bank, to break the water's straight edge.
    { sprite: 'c5_rock_weedy', x: 8, y: 5, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 8, y: 12, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 29, y: 5, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 29, y: 13, text: 'shore_rocks' },
    { sprite: 'col_glass_white', x: 6, y: 12, walkable: true, flat: true, gives: 'glass_white', taken: { gone: true } },
    // LIFE-PASS-BEGIN (builder 3, 2026-11-14): rock-pool life, shells, kelp, the odds the sea left. Everything here is walkable, so nothing is ever in anyone's way.
    { sprite: 'shore_whelk', x: 42, y: 12, text: 'sl_whelk_found', gives: 'big_whelk', react: true, taken: { sprite: 'shore_shells', text: 'sl_whelk_empty' } },
    { sprite: 'c5_crab_trail', x: 40, y: 11, flat: true, walkable: true, decor: true },
    { sprite: 'c5_crab_trail', x: 41, y: 12, flat: true, walkable: true, decor: true },
    { sprite: 'c5_gull_marks', x: 8, y: 7, text: 'sl_seal_trail', flat: true, walkable: true },
    { sprite: 'shore_shells', x: 38, y: 8, text: 'sl_shells_a', flat: true, walkable: true },
    { sprite: 'shore_jelly', x: 28, y: 15, text: 'sl_jelly', flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 33, y: 8, text: 'sl_plank', flat: true, walkable: true },
    { sprite: 'shore_nest', x: 29, y: 10, text: 'sl_nest', walkable: true },
    { sprite: 'shore_shells_b', x: 37, y: 12, text: 'sl_shells_b', flat: true, walkable: true },
    { sprite: 'shore_fishbones', x: 30, y: 2, text: 'sl_bones', flat: true, walkable: true },
    { sprite: 'c5_buoy_red', x: 9, y: 15, text: 'sl_buoy', walkable: true },
    { sprite: 'c5_rock_pool', x: 32, y: 13, text: 'sl_pool_a', flat: true, walkable: true },
    { sprite: 'shore_kelp_b', x: 29, y: 8, text: 'sl_kelp_b', walkable: true, animation: 'shore_kelp_b', speed: 0.4 },
    { sprite: 'shore_starfish_pink', x: 39, y: 13, text: 'sl_star_c', flat: true, walkable: true },
    { sprite: 'shore_starfish_purple', x: 2, y: 5, text: 'sl_star_b', flat: true, walkable: true },
    { sprite: 'shore_starfish', x: 30, y: 15, text: 'sl_star_a', flat: true, walkable: true },
    { sprite: 'shore_crab_shell', x: 6, y: 11, text: 'sl_crabshell', flat: true, walkable: true },
    { sprite: 'c5_drift_log', x: 41, y: 9, text: 'sl_log', flat: true, walkable: true },
    { sprite: 'c5_lantern_fallen', x: 4, y: 2, text: 'sl_lantern', flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 35, y: 8, text: 'sl_puddle', flat: true, walkable: true },
    { sprite: 'c5_buoy_yellow', x: 41, y: 2, text: 'sl_float', walkable: true },
    { sprite: 'c5_sandbags', x: 33, y: 2, text: 'sl_sandbags', walkable: true },
    { sprite: 'c5_barrel', x: 39, y: 2, text: 'sl_barrel', walkable: true },
    { sprite: 'shore_anemone_pool', x: 32, y: 15, text: 'sl_anemone_a', flat: true, walkable: true, animation: 'shore_anemone_pool', speed: 0.5 },
    { sprite: 'c5_boat_upturned', x: 28, y: 2, text: 'sl_dinghy', walkable: true },
    { sprite: 'c5_wrack_line', x: 37, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'c5_crab_trail', x: 35, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'c5_gull_marks', x: 37, y: 10, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 42, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 38, y: 10, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 7, y: 15, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 1, y: 3, flat: true, walkable: true, decor: true },
    { sprite: 'c5_sea_holly', x: 2, y: 3, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 42, y: 5, flat: true, walkable: true, decor: true },
    { sprite: 'c5_marram', x: 37, y: 5, flat: true, walkable: true, decor: true },
    // LIFE-PASS-END
  ],
  tileTexts: { '#': 'landing_cliff', W: 'landing_cliff', '~': 'pools_sea', x: 'landing_rock', O: 'landing_rock', F: 'landing_weed', ';': 'pools_pool' },

  // A shellac on the west bank (row 14, x 2 to 6: clear of the stump, the wheel, the door and
  // every tile the tide changes), and a PAIR on the east bank: a limpet knight on sentry (row 12,
  // x 32 to 34) and a pinwheel rolling about beside it (x 32 to 35, home row 11), within four
  // tiles of each other so they fight together. The pair is east of the shingle (x 29 on is dry at
  // both tides), clear of the wheel (32,5), the door and the return crate's lane (row 11, x 21 to
  // 23). No cutscenes in this room.
  // AMBUSH: the limpet knight isn't on sentry by the pinwheel any more. It stands as one more weedy
  // rock in the north-east turf (39,4), by the purse (40,4), and jumps out when you come within two
  // and a half tiles (its visor slit glints now and then: `look: 'weedy_rock'`, src/overworld/
  // hideouts.js). The way across the east bank (rows 8 and 9) passes four tiles below it, so only
  // going up for the purse wakes it.
  npcs: [
    { enemy: 'shellac', x: 5, y: 13, patrol: [4, 8], behaviour: 'patrol' },
    { enemy: 'limpet_knight', x: 39, y: 4, patrol: [39, 39], behaviour: 'disguise', look: 'weedy_rock', reach: 2.5 },
    { enemy: 'pinwheel', x: 34, y: 11, patrol: [32, 35], behaviour: 'wander' },
  ],
};
