// THE GATE: the first of the Wreck Yard, where Haddock's boat puts in. A rotten little
// jetty on the west, a spit of black shingle, then the plank bridge: a long, railed
// gangway laid across the channel between two leaning hulks, the only way into the
// yard. Snapped masts stand out of the green water all round, sails hanging off them
// in rags, and the Last Light is on the skyline. Puzzle-free, and no monsters (the
// first room of an area): a place to stand in the storm and look at it.
//
// Arriving by the Bother (to_the_wreck_yard, from Saltcombe) lands you on the jetty at
// (9,10), which is the trigger of the ride itself (wreck_crossing, once). Later trips
// arrive on the same spot and nothing plays. The way home is at the far side, the slip.
// OPTIONAL (2026-11-14): the east end of the shingle runs round a corner of rock (door 39, rows 13-14) to
// the Chain Cliff (wreck_chain_cliff), a ring climb.
// Tile key (see src/overworld/coastTiles.js, wreck):
//   #  hull top (solid)   ~  green-black water (solid)   q  shingle   o  jetty planks
//   g  bridge (walk)   f  rail (solid)   ,  turf

export const WRECK_GATE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wreck_gate',
  // The room's name, for the Room Editor.
  name: 'THE GATE',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wreck',
  // "Fog Bell" (src/data/music/wreckTheme.js).
  music: 'wreck',
  ambience: 'wreck_yard',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.5, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_wreck_yard', lamplight: { shade: 0.24, tint: '34, 44, 68' }, skyline: true },
  // Once the Fair Return has sailed (crew_go_free, 2026-11-14), her fog has gone with her: the yard's fog thins to this.
  fogLiftAfter: { scene: 'crew_go_free', fog: 0.25 },
  vesWell: true,
  // Before the Fair Return is found: her crew's song off the water now and then, or her lantern far out (farShip.js).
  farShip: { sing: true, light: { x: 22, y: 2 } },
  // The Last Light's foot, on the skyline (atmosphere.js: `lastLight`).
  lastLight: { x: 27, y: 4 },
  // Big wrecks out in the channel, black against the green.
  skyline: [
    { kind: 'hull', x: 5, y: 4, lean: -1 },
    { kind: 'mast', x: 21, y: 5, lean: 1, tall: 60 },
    { kind: 'mast', x: 14, y: 15, lean: -1, tall: 50 },
    { kind: 'hull', x: 26, y: 15, lean: 1 },
  ],

  tiles: [
    '########################################',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~qqqqq#',
    '#~~~~~~~~~~~~qqqq~~~~~~~~~~~~~~qqqqqqqq#',
    '#~~~~~~~~~~qqqqqqq~~~~~~~~~~~~qqqqqqqqq#',
    '#~~~~~~~~ooqqqqqqqfffffffffffffqqqqqqqq#',
    '~~~~~~~~~ooqqqqqqqgggggggggggggqqqqqqqqq',
    '~~~~~~~~~ooqqqqqqqgggggggggggggqqqqqqqqq',
    '#~~~~~~~~ooqqqqqqqfffffffffffffqqqqqqqq#',
    '#~~~~~~~~~~qqqqqqq~~~~~~~~~~~~~qqqqqqq,#',
    '#~~~~~~~~~~~qqqqq~~~~~~~~~~~~~~~qqqqq,,,',
    '#~~~~~~~~~~~~~qq~~~~~~~~~~~~~~~~~qqq,,,,',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,,#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '########################################',
  ],

  // Where the player starts, in tile coordinates: the jetty.
  playerStart: { x: 9, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 39, y: 9, w: 1, h: 2, to: 'wreck_hull', spawn: { x: 2, y: 14 } },
    // (Optional) round the corner of rock at the east end of the shingle: the Chain Cliff.
    { x: 39, y: 13, w: 1, h: 2, to: 'wreck_chain_cliff', spawn: { x: 2, y: 21 } },
  ],

  // The jetty: arriving by boat the first time plays the ride (wreck_crossing).
  cutscenes: [
    { x: 9, y: 8, w: 2, h: 4, scene: 'wreck_crossing' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wreck.txt',
  props: [
    // The jetty's mooring post and the gangway's two chained bollards (the chains run along the rails).
    { sprite: 'c5_chain_bollard', x: 10, y: 7, text: 'gate_jetty_post' },
    { sprite: 'sign', x: 16, y: 8, text: 'gate_sign' },
    { sprite: 'c5_chain_bollard', x: 17, y: 8, text: 'gate_bollard' },
    { sprite: 'c5_chain_bollard', x: 17, y: 11, text: 'gate_bollard' },
    { sprite: 'c5_chain_bollard', x: 31, y: 8, text: 'gate_bollard' },
    { sprite: 'c5_chain_bollard', x: 31, y: 11, text: 'gate_bollard' },
    // The two hulks the bridge runs between, and the wrecks out in the water.
    { sprite: 'c5_hull_lean_a', x: 19, y: 6, text: 'gate_hulk' },
    { sprite: 'c5_hull_lean_b', x: 25, y: 14, text: 'gate_hulk' },
    { sprite: 'c5_snapped_mast', x: 3, y: 5, text: 'gate_mast' },
    { sprite: 'c5_snapped_mast', x: 34, y: 15, text: 'gate_mast' },
    { sprite: 'c5_ship_ribs', x: 3, y: 14, text: 'gate_ribs' },
    // On the spit: a sail on its post and spar, a flag, a figurehead, nets.
    { sprite: 'c5_tattered_sail', x: 12, y: 7, text: 'gate_sail', animation: 'c5_tattered_sail', speed: 0.4 },
    { sprite: 'c5_tattered_flag', x: 15, y: 12, text: 'gate_flag', animation: 'c5_tattered_flag', speed: 0.35 },
    { sprite: 'c5_figurehead', x: 36, y: 7, text: 'gate_figurehead' },
    { sprite: 'c5_anchor', x: 33, y: 13, text: 'gate_anchor' },
    { sprite: 'c5_crate', x: 13, y: 13, text: 'gate_crate' },
    { sprite: 'gold_pouch', x: 37, y: 14, text: 'gate_pouch', gold: 80, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Where the shingle meets the water: weed off the spit's lip and under the jetty, barnacles
    // up the far bank, the jetty's old mooring posts with a rope's end on a ring, and the yard's
    // wreckage drifting about the channel.
    { sprite: 'wy_mooring_post', x: 8, y: 8 },
    { sprite: 'wy_mooring_post', x: 8, y: 11 },
    { sprite: 'wy_weed_fringe', x: 10, y: 12, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe_b', x: 14, y: 15, flat: true, walkable: true },
    { sprite: 'wy_edge_r', x: 29, y: 7, flat: true, walkable: true },
    { sprite: 'wy_edge_r', x: 30, y: 13, flat: true, walkable: true },
    { sprite: 'wy_plank_slick', x: 6, y: 3, flat: true, walkable: true },
    { sprite: 'wy_timber_sunk', x: 24, y: 3, flat: true, walkable: true },
    { sprite: 'wy_weed_mat', x: 15, y: 3, flat: true, walkable: true },
    { sprite: 'wy_boat_swamped', x: 9, y: 15, flat: true, walkable: true },
    { sprite: 'wy_weed_mat_b', x: 21, y: 16, flat: true, walkable: true },
    { sprite: 'wy_ribs_jag', x: 37, y: 3 },
    { sprite: 'wy_plank_slick_b', x: 29, y: 15, flat: true, walkable: true },
    // LIFE-PASS-BEGIN (builder 3, 2026-11-14): rock-pool life, shells, kelp, the odds the sea left. Everything here is walkable, so nothing is ever in anyone's way.
    { sprite: 'sign', x: 33, y: 10, text: 'sl_no_loiter', walkable: true },
    { sprite: 'c5_rock_pool', x: 15, y: 6, text: 'sl_pool_a', flat: true, walkable: true },
    { sprite: 'shore_tally_post', x: 37, y: 12, text: 'sl_tally', walkable: true },
    { sprite: 'shore_flag_post', x: 32, y: 6, text: 'sl_flag', walkable: true, animation: 'shore_flag_post', speed: 0.5 },
    { sprite: 'c5_buoy_yellow', x: 13, y: 11, text: 'sl_float', walkable: true },
    { sprite: 'shore_crab_shell', x: 15, y: 10, text: 'sl_crabshell', flat: true, walkable: true },
    { sprite: 'c5_pot_single', x: 35, y: 10, text: 'sl_pot', walkable: true },
    { sprite: 'shore_buried_hull', x: 35, y: 12, text: 'sl_hulk', walkable: true },
    { sprite: 'c5_planks_scatter', x: 33, y: 8, text: 'sl_plank', flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 37, y: 10, text: 'sl_puddle', flat: true, walkable: true },
    { sprite: 'wy_plank_slick_b', x: 8, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 5, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat', x: 24, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'wy_plank_slick_b', x: 29, y: 3, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat_b', x: 33, y: 3, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat', x: 28, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'wy_plank_slick_b', x: 15, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 20, y: 15, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 12, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 1, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 25, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 30, y: 15, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 21, y: 1, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat_b', x: 15, y: 5, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat_b', x: 18, y: 3, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat_b', x: 37, y: 16, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat_b', x: 1, y: 11, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 17, y: 13, flat: true, walkable: true, decor: true },
    // LIFE-PASS-END
  ],
  tileTexts: { '#': 'gate_edge', '~': 'gate_water', f: 'gate_rail', g: 'gate_bridge' },

  // None: the first room of an area (and the boat ride plays on the jetty).
  npcs: [
  ],
};
