// THE HEADLAND: between the landing and the pools the beach runs out against a black headland,
// and the sea breaks right up against its foot, so there's no walking round. Long ago the shore
// folk dragged their boats up here out of the storms, and hammered a line of iron mooring rings up
// the face for the tackle. They're still there. So the way on is up: the first swinging climb of the
// coast, and a gentle one (four rings and the clifftop ring, no wind to speak of, every catch short).
// Across the top, a shorter drop on the east side has one ring at its edge: one throw down to the
// shelf of shingle above the pools, or one throw back up.
//
//   West foot (6,15): the first ring is straight above, at (6,12). Then (9,11), (7,9), (10,8), and
//   the clifftop ring (10,6). Standing on it, facing down, ropes you back down to (10,15).
//   East edge: the ring (33,6) is one throw down to (33,10), or up from there.
//   The sea (x 20 to 30, rows 15-19) and the face (rows 7-14) close the beach off: no way round.
// The tide doesn't reach here (no tide in the room): the beach and both feet are dry for good.
// Ves and Bramble come up and down with you (they wait out of sight while you climb, as on the
// mountain). One monster on the clifftop, well away from both rings.
// Tile key (see src/overworld/coastTiles.js, wrack):
//   #  cliff top (solid)   W  cliff face (solid)   .  wet shingle   ,  salt grass   :  shell path
//   ;  shallows   ~  sea (solid)   x  barnacle rock (solid)   O  boulder (solid)   F  weed pile (solid)
//   q  shingle

export const WRACK_HEADLAND = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wrack_headland',
  // The room's name, for the Room Editor.
  name: 'THE HEADLAND',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wrack',
  // The Wrack Shore's song (src/data/music/wrackTheme.js), and the sounds of the place under it.
  music: 'wrack',
  ambience: 'storm_shore',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_shore', lamplight: { shade: 0.16, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,
  // The headland is drawn as weathered open-air rock (coastTiles.js `crag`), not the dark mass.
  crag: [{ x: 0, y: 0, w: 40, h: 3 }, { x: 0, y: 7, w: 40, h: 8 }],
  // The Last Light's foot, on the skyline, far off to the north-east.
  lastLight: { x: 30, y: 2 },

  tiles: [
    '########################################', // 0
    '##WWW####WWWWWWW#####WWWWWWWWW###WWWWW##', // 1
    '#W,,,WWWW,,,,,,,WWWWW,,,,,,,,,WWW,,,,,W#', // 2
    '#,,,,,,,,,,,,,,,,,,,,,,,,,:::::,,,,,,,,#', // 3
    '#,,,O,,,,,,,::::::::::::::,,,,,,,,,,O,,#', // 4
    '#,,,,,,::::::,,,,,,,,,,,,,,,,,,,::::,,,#', // 5
    '#,,,,,,,,,,,,,,,,,,,,,###,,,,,,,,,,,,,,#', // 6
    '#W,,,WWWWWWWWWW,,,,WWWWWWW,,WWWWWWWWWWW#', // 7
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#', // 8
    '#WWWWWWWWWWWWWWWWWWWWWWW##WWWWWWWWWWWWW#', // 9
    '#WWWWWWWWWWWWWW##WWWWWWWWWWWWWW.......,#', // 10
    '#WW#WWWWWWWWWWWW#WWWWWWWWWWWWWx....,,...', // 11
    '#WW#WWWWWWWWWWWWWWWWWWWWWWWWWW.....,,...', // 12
    '#WWWWWWWWWWWWWWWWWW##WWWWWWWWW;....O...#', // 13
    '#WWWWWWWWWWWW...WWWWWWWWWWWWWW;;.......#', // 14
    '#x........,,....x.;;~~~~~~~~~~~;.....F.#', // 15
    '..........,,,....;;~~~~~~~~~~~~;.......#', // 16
    '...q......:::....;~~~~~~~~~~~~~;;......#', // 17
    '#..qq..O..:::...;;~~~~~~~~~~~~~~;;.....#', // 18
    '########################################', // 19
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 16 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 16, w: 1, h: 2, to: 'wrack_landing', spawn: { x: 38, y: 10 } },
    { x: 39, y: 11, w: 1, h: 2, to: 'wrack_pools', spawn: { x: 2, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wrack.txt',
  props: [
    // The old mooring rings, hammered up the face. The first is straight above the foot at (6,15).
    { sprite: 'swing_ring', x: 6, y: 12 },
    { sprite: 'swing_ring', x: 9, y: 11 },
    { sprite: 'swing_ring', x: 7, y: 9 },
    { sprite: 'swing_ring', x: 10, y: 8 },
    // The clifftop ring: hauls you over at the end of the climb, and ropes you back down.
    { sprite: 'grapple_ring', x: 10, y: 6, grapple: true },
    // The east edge: one throw down to the shelf above the pools, or back up.
    { sprite: 'grapple_ring', x: 33, y: 6, grapple: true },
    // At the west foot: a sign, and the end of the old tackle, rotted through.
    { sprite: 'sign', x: 3, y: 15, text: 'headland_sign' },
    { sprite: 'c5_rope_coil', x: 8, y: 16, text: 'headland_tackle', walkable: true },
    { sprite: 'c5_rocks_weedy', x: 14, y: 17, text: 'shore_rocks' },
    { sprite: 'c5_driftwood', x: 12, y: 15, text: 'landing_driftwood' },
    // On top: the bollard they hauled round, a boat that never went back down, a purse.
    { sprite: 'c5_chain_bollard', x: 13, y: 4, text: 'headland_bollard' },
    { sprite: 'c5_boat_upturned', x: 22, y: 3, text: 'headland_boat' },
    { sprite: 'gold_pouch', x: 37, y: 3, text: 'headland_pouch', gold: 40, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_rock_weedy', x: 28, y: 5, text: 'shore_rocks' },
    // The east shelf: weed, wrack, a pool.
    { sprite: 'c5_seaweed_heap', x: 37, y: 14, text: 'landing_weed' },
    { sprite: 'c5_lobster_pots', x: 31, y: 12, text: 'landing_pots' },
    // Dressing.
    { sprite: 'c5_marram', x: 5, y: 3, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 19, y: 6, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 34, y: 4, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 9, y: 2, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 26, y: 6, flat: true, walkable: true },
    { sprite: 'c5_turf_patch', x: 16, y: 5, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 30, y: 4, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 4, y: 18, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 33, y: 16, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 11, y: 17, flat: true, walkable: true },
    { sprite: 'c5_rock_pool', x: 35, y: 11, flat: true, walkable: true },
    { sprite: 'c5_weed_mat', x: 2, y: 15, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 34, y: 17, flat: true, walkable: true },
    { sprite: 'c5_rust_bloom', x: 7, y: 14, flat: true, walkable: true },
    // LIFE-PASS-BEGIN (builder 3, 2026-11-14): rock-pool life, shells, kelp, the odds the sea left. Everything here is walkable, so nothing is ever in anyone's way.
    { sprite: 'gold_pouch', x: 38, y: 6, text: 'sl_pouch_headland', gold: 35, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_barrel', x: 1, y: 4, text: 'sl_barrel', walkable: true },
    { sprite: 'shore_starfish', x: 5, y: 4, text: 'sl_star_a', flat: true, walkable: true },
    { sprite: 'c5_buoy_yellow', x: 3, y: 6, text: 'sl_float', walkable: true },
    { sprite: 'shore_fishbones', x: 19, y: 15, text: 'sl_bones', flat: true, walkable: true },
    { sprite: 'c5_rock_pool', x: 17, y: 15, text: 'sl_pool_a', flat: true, walkable: true },
    { sprite: 'shore_kelp_b', x: 30, y: 14, text: 'sl_kelp_b', walkable: true, animation: 'shore_kelp_b', speed: 0.4 },
    { sprite: 'c5_net_torn', x: 31, y: 10, text: 'sl_net', flat: true, walkable: true },
    { sprite: 'shore_starfish_purple', x: 36, y: 5, text: 'sl_star_b', flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 34, y: 2, text: 'sl_plank', flat: true, walkable: true },
    { sprite: 'shore_starfish_pink', x: 3, y: 3, text: 'sl_star_c', flat: true, walkable: true },
    { sprite: 'shore_anemone_pool', x: 17, y: 17, text: 'sl_anemone_a', flat: true, walkable: true, animation: 'shore_anemone_pool', speed: 0.5 },
    { sprite: 'c5_pot_single', x: 31, y: 3, text: 'sl_pot', walkable: true },
    { sprite: 'c5_sandbags', x: 13, y: 6, text: 'sl_sandbags', walkable: true },
    { sprite: 'c5_boat_upturned', x: 36, y: 17, text: 'sl_dinghy', walkable: true },
    { sprite: 'shore_bottle', x: 3, y: 18, text: 'sl_bottle', walkable: true },
    { sprite: 'shore_shells', x: 14, y: 14, text: 'sl_shells_a', flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 20, y: 6, text: 'sl_puddle', flat: true, walkable: true },
    { sprite: 'shore_jelly', x: 31, y: 17, text: 'sl_jelly', flat: true, walkable: true },
    { sprite: 'c5_oar_stuck', x: 27, y: 7, text: 'sl_oar', walkable: true },
    { sprite: 'shore_shells_b', x: 38, y: 17, text: 'sl_shells_b', flat: true, walkable: true },
    { sprite: 'shore_crab_shell', x: 34, y: 16, text: 'sl_crabshell', flat: true, walkable: true },
    { sprite: 'c5_drift_log', x: 11, y: 3, text: 'sl_log', flat: true, walkable: true },
    { sprite: 'shore_boot', x: 27, y: 2, text: 'sl_boot', walkable: true },
    { sprite: 'c5_wrack_line', x: 36, y: 11, flat: true, walkable: true, decor: true },
    { sprite: 'c5_crab_trail', x: 1, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'c5_gull_marks', x: 25, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 5, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'c5_turf_patch', x: 30, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 18, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'c5_marram', x: 15, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'c5_sea_holly', x: 15, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 36, y: 10, flat: true, walkable: true, decor: true },
    { sprite: 'c5_marram', x: 15, y: 7, flat: true, walkable: true, decor: true },
    { sprite: 'c5_crab_trail', x: 11, y: 18, flat: true, walkable: true, decor: true },
    { sprite: 'c5_turf_patch', x: 12, y: 17, flat: true, walkable: true, decor: true },
    { sprite: 'c5_wrack_line', x: 29, y: 3, flat: true, walkable: true, decor: true },
    { sprite: 'c5_crab_trail', x: 15, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'c5_gull_marks', x: 30, y: 5, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 16, y: 7, flat: true, walkable: true, decor: true },
    { sprite: 'c5_turf_patch', x: 17, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 17, y: 7, flat: true, walkable: true, decor: true },
    { sprite: 'c5_marram', x: 29, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'c5_sea_holly', x: 25, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 14, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'c5_marram', x: 7, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'c5_crab_trail', x: 37, y: 10, flat: true, walkable: true, decor: true },
    { sprite: 'c5_turf_patch', x: 15, y: 5, flat: true, walkable: true, decor: true },
    { sprite: 'c5_wrack_line', x: 12, y: 18, flat: true, walkable: true, decor: true },
    { sprite: 'c5_crab_trail', x: 34, y: 18, flat: true, walkable: true, decor: true },
    { sprite: 'c5_gull_marks', x: 35, y: 10, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 37, y: 11, flat: true, walkable: true, decor: true },
    { sprite: 'c5_turf_patch', x: 13, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 32, y: 15, flat: true, walkable: true, decor: true },
    { sprite: 'c5_marram', x: 15, y: 3, flat: true, walkable: true, decor: true },
    { sprite: 'c5_sea_holly', x: 18, y: 7, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 6, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'c5_marram', x: 16, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'c5_crab_trail', x: 33, y: 18, flat: true, walkable: true, decor: true },
    { sprite: 'c5_planks_scatter', x: 28, y: 18, flat: true, walkable: true, decor: true },
    { sprite: 'c5_planks_scatter', x: 23, y: 16, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 18, y: 17, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 28, y: 15, flat: true, walkable: true, decor: true },
    // LIFE-PASS-END
  ],
  tileTexts: { '#': 'landing_cliff', W: 'headland_face', '~': 'landing_sea', x: 'landing_rock', O: 'landing_rock', F: 'landing_weed' },

  // A pinwheel rolling about the clifftop, well clear of both rings (10,6) and (33,6).
  npcs: [
    { enemy: 'pinwheel', x: 20, y: 4, patrol: [17, 25], behaviour: 'wander' },
  ],
};
