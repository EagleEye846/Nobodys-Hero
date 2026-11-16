// THE FOG DECK: the open deck of the biggest wreck in the yard, so long its far end is
// lost in the fog. The sea fog lies thick here (the room turns the fog right up), so
// things come out of it at you: masts, net heaps, a bell on a frame that still rings when
// the wind leans on it (the "fog bell"), and the yard's drowned crews. This is the fight
// room: no puzzle on the way through, just keep your eyes open and walk east.
//
// THE SECRET: in the fog at the north-east corner, a railed-off bit of foredeck with an
// iron gate (39,6) bolted shut from inside. A gap in the rail (36,4), choked with weed, is
// just wide enough for Bramble: E, in he goes, and the bolt wheel (41,4) is his to turn.
// The gate swings open; the open hatch (39,3) goes down into the pocket under the deck
// (secret_wreck_pocket). R or the gate brings everyone together.
// Tile key (see src/overworld/coastTiles.js, wreck):
//   #  hull top (solid)   ~  sea / holes in the deck (solid)   f  rail (solid)
//   .  iron deck   :  deck planks   I  mast (solid)   J  stump (solid)   O  crate   F  net heap

export const WRECK_FOG = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wreck_fog',
  // The room's name, for the Room Editor.
  name: 'THE FOG DECK',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wreck',
  // "Fog Bell" (src/data/music/wreckTheme.js).
  music: 'wreck',
  ambience: 'wreck_yard',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 1.2, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_wreck_yard', lamplight: { shade: 0.24, tint: '34, 44, 68' }, skyline: true },
  // Once the Fair Return has sailed (crew_go_free, 2026-11-14), her fog has gone with her: the yard's fog thins to this.
  fogLiftAfter: { scene: 'crew_go_free', fog: 0.6 },
  vesWell: true,
  // Before the Fair Return is found: her crew's song off the water now and then, or her lantern far out (farShip.js).
  farShip: { sing: true, light: { x: 14, y: 1 } },
  // The fog comes right up over the deck here.
  atmosphere: { fog: 2.2, rain: 0.8 },
  lastLight: { x: 30, y: 1 },

  tiles: [
    '############################################',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#ffffffffffffffffffffffffffffffffffffffffff#',
    '#,...:::::............:::....F.,,...f......#',
    '#....::::~...........:::...~~..............#',
    '#....:::::............:.....~.......f......#',
    '#....:::::.I..............::........fff.fff#',
    '#................~~~~~...:::...............#',
    '................~~~~~~..........I...........',
    '...............~~~~~~.......................',
    '#.....OO...............::::::..............#',
    '#.........::.........::::::::.........OF...#',
    '#..~~.....:...........:::I:::::..~~........#',
    '#..~.:::......F....J.:::::::::.,,.~........#',
    '#,....::::..,,.........:::::..,,,..........#',
    '#ffffffffffffffffffffffffffffffffffffffffff#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '############################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'wreck_pumps', spawn: { x: 32, y: 5 } },
    { x: 43, y: 8, w: 1, h: 2, to: 'wreck_galley', spawn: { x: 2, y: 8 } },
    // Down the open hatch in the railed-off foredeck.
    { x: 39, y: 3, w: 1, h: 1, to: 'secret_wreck_pocket', spawn: { x: 7, y: 8 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wreck.txt',
  props: [
    // The fog bell on its frame, the ship's wheel, the deck's odds and ends.
    { sprite: 'c5_harbour_bell', x: 13, y: 4, text: 'fog_bell', animation: 'c5_harbour_bell', speed: 0.9, sound: 'bell' },
    { sprite: 'c5_ships_wheel', x: 3, y: 5, text: 'fog_wheel' },
    { sprite: 'c5_tattered_sail', x: 20, y: 4, text: 'fog_sail', animation: 'c5_tattered_sail', speed: 0.45 },
    { sprite: 'c5_chain_bollard', x: 15, y: 9, text: 'fog_bollard' },
    { sprite: 'c5_chain_bollard', x: 22, y: 7, text: 'fog_bollard' },
    { sprite: 'c5_tattered_flag', x: 30, y: 13, text: 'fog_flag', animation: 'c5_tattered_flag', speed: 0.35 },
    { sprite: 'c5_barrels', x: 9, y: 13, text: 'hull_barrels' },
    { sprite: 'c5_net_frame', x: 24, y: 5, text: 'fog_net' },
    { sprite: 'sign', x: 5, y: 8, text: 'fog_log' },
    { sprite: 'gold_pouch', x: 4, y: 14, text: 'fog_pouch', gold: 140, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The secret: weed in the rail (Bramble's gap), his bolt wheel, the gate, the hatch.
    { sprite: 'c5_weed_gap_small', x: 36, y: 4, text: 'fog_gap', gap: true },
    { sprite: 'valve_wheel', x: 41, y: 4, text: 'fog_bolt', lever: 'fog_bolt', by: 'bramble', byText: 'fog_bolt_not_you' },
    { sprite: 'c5_gangway_gate', x: 39, y: 6, text: 'fog_gate', opensWith: ['fog_bolt'], openText: 'fog_gate_open' },
    { sprite: 'wy_hatch', x: 39, y: 3, text: 'fog_hatch', walkable: true, flat: true },
    // Dressing (2026-11-08), clear of the drowned's beat (x 17 to 20, rows 8 to 11) and the
    // foredeck nook: rust breaking out where the sea sits on the iron, deck planks patched in
    // anyhow, a lantern blown off its hook still burning on its side, lanterns on hooks that
    // somebody keeps lit out here, a net torn off its frame.
    { sprite: 'c5_rust_bloom', x: 8, y: 9, flat: true, walkable: true },
    { sprite: 'c5_rust_bloom', x: 34, y: 10, flat: true, walkable: true },
    { sprite: 'c5_rust_bloom', x: 2, y: 11, flat: true, walkable: true },
    { sprite: 'c5_lantern_hook', x: 8, y: 3 },
    { sprite: 'c5_lantern_hook', x: 33, y: 13 },
    { sprite: 'c5_lantern_fallen', x: 27, y: 9, flat: true, walkable: true },
    { sprite: 'c5_net_torn', x: 25, y: 3, flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 11, y: 7, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 6, y: 7, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 30, y: 11, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 33, y: 4, flat: true, walkable: true },
    { sprite: 'c5_rope_coil', x: 12, y: 4, walkable: true, decor: true },
    { sprite: 'c5_anchor', x: 3, y: 10 },
    { sprite: 'c5_crate', x: 26, y: 13, text: 'hull_cargo' },
    // (Second pass.) The bulwark's shadow along the deck under the north rail, scuppers bleeding
    // rust where the sea runs off, gratings over the hold, her anchor's chain heaped by it, cargo
    // burst open by the crate, and the sea spreading out of the holes in her deck, barnacles at
    // their lips. (Flat, all of it; nothing new stands on the deck.)
    { sprite: 'wy_rail_shadow', x: 2, y: 3, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow_b', x: 5, y: 3, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow', x: 8, y: 3, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow_b', x: 11, y: 3, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow', x: 14, y: 3, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow_b', x: 17, y: 3, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow', x: 20, y: 3, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow_b', x: 23, y: 3, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow', x: 26, y: 3, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow_b', x: 29, y: 3, flat: true, walkable: true },
    { sprite: 'wy_rail_shadow', x: 32, y: 3, flat: true, walkable: true },
    { sprite: 'wy_scupper', x: 6, y: 3, flat: true, walkable: true },
    { sprite: 'wy_scupper', x: 18, y: 3, flat: true, walkable: true },
    { sprite: 'wy_scupper', x: 31, y: 3, flat: true, walkable: true },
    { sprite: 'wy_grating', x: 10, y: 10, flat: true, walkable: true },
    { sprite: 'wy_grating', x: 36, y: 9, flat: true, walkable: true },
    { sprite: 'wy_chain_pile', x: 4, y: 10, flat: true, walkable: true },
    { sprite: 'wy_cargo_spill', x: 25, y: 12, flat: true, walkable: true },
    { sprite: 'wy_bilge_slick', x: 14, y: 8, flat: true, walkable: true },
    { sprite: 'wy_bilge_slick_b', x: 22, y: 9, flat: true, walkable: true },
    { sprite: 'wy_bilge_slick', x: 5, y: 12, flat: true, walkable: true },
    { sprite: 'wy_bilge_slick_b', x: 32, y: 13, flat: true, walkable: true },
    { sprite: 'wy_edge_r', x: 21, y: 9, flat: true, walkable: true },
    { sprite: 'wy_edge_l', x: 15, y: 9, flat: true, walkable: true },
    // LIFE-PASS-BEGIN (builder 3, 2026-11-14): rock-pool life, shells, kelp, the odds the sea left. Everything here is walkable, so nothing is ever in anyone's way.
    { sprite: 'gold_pouch', x: 1, y: 14, text: 'sl_pouch_fog', gold: 40, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'shore_rivets', x: 42, y: 14, text: 'sl_buttons', walkable: true },
    { sprite: 'shore_flag_post', x: 17, y: 6, text: 'sl_flag', walkable: true, animation: 'shore_flag_post', speed: 0.5 },
    { sprite: 'shore_anemone_pool', x: 8, y: 11, text: 'sl_anemone_a', flat: true, walkable: true, animation: 'shore_anemone_pool', speed: 0.5 },
    { sprite: 'c5_planks_scatter', x: 20, y: 13, text: 'sl_plank', flat: true, walkable: true },
    { sprite: 'shore_starfish_purple', x: 5, y: 11, text: 'sl_star_b', flat: true, walkable: true },
    { sprite: 'shore_tally_post', x: 33, y: 7, text: 'sl_tally', walkable: true },
    { sprite: 'shore_maul', x: 42, y: 11, text: 'sl_maul', walkable: true },
    { sprite: 'shore_crab_shell', x: 33, y: 11, text: 'sl_crabshell', flat: true, walkable: true },
    { sprite: 'c5_pot_single', x: 31, y: 6, text: 'sl_pot', walkable: true },
    { sprite: 'shore_shells_b', x: 16, y: 14, text: 'sl_shells_b', flat: true, walkable: true },
    { sprite: 'c5_rock_pool', x: 28, y: 3, text: 'sl_pool_a', flat: true, walkable: true },
    { sprite: 'shore_chalk_arrow', x: 1, y: 12, text: 'sl_chalk_arrow', walkable: true },
    { sprite: 'c5_buoy_red', x: 35, y: 13, text: 'sl_buoy', walkable: true },
    { sprite: 'c5_lantern_fallen', x: 27, y: 8, text: 'sl_lantern', flat: true, walkable: true },
    { sprite: 'shore_bottle', x: 24, y: 10, text: 'sl_bottle', walkable: true },
    { sprite: 'c5_rope_coil', x: 38, y: 14, text: 'sl_rope', walkable: true },
    { sprite: 'shore_shells', x: 30, y: 8, text: 'sl_shells_a', flat: true, walkable: true },
    { sprite: 'c5_oar_stuck', x: 24, y: 12, text: 'sl_oar', walkable: true },
    { sprite: 'c5_boat_upturned', x: 38, y: 8, text: 'sl_dinghy', walkable: true },
    { sprite: 'shore_starfish', x: 38, y: 12, text: 'sl_star_a', flat: true, walkable: true },
    { sprite: 'shore_boot', x: 40, y: 14, text: 'sl_boot', walkable: true },
    { sprite: 'shore_fishbones', x: 6, y: 6, text: 'sl_bones', flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 3, y: 8, text: 'sl_puddle', flat: true, walkable: true },
    { sprite: 'shore_buried_hull', x: 11, y: 10, text: 'sl_hulk', walkable: true },
    { sprite: 'c5_buoy_yellow', x: 26, y: 10, text: 'sl_float', walkable: true },
    { sprite: 'shore_jelly', x: 9, y: 5, text: 'sl_jelly', flat: true, walkable: true },
    { sprite: 'c5_net_torn', x: 38, y: 10, text: 'sl_net', flat: true, walkable: true },
    { sprite: 'shore_starfish_pink', x: 7, y: 9, text: 'sl_star_c', flat: true, walkable: true },
    { sprite: 'shore_kelp', x: 27, y: 5, text: 'sl_kelp_a', walkable: true, animation: 'shore_kelp', speed: 0.45 },
    { sprite: 'shore_kelp_b', x: 29, y: 5, text: 'sl_kelp_b', walkable: true, animation: 'shore_kelp_b', speed: 0.4 },
    { sprite: 'c5_drift_log', x: 11, y: 8, text: 'sl_log', flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 23, y: 14, text: 'sl_plank', flat: true, walkable: true },
    { sprite: 'shore_crab_shell', x: 15, y: 11, text: 'sl_crabshell_b', flat: true, walkable: true },
    { sprite: 'c5_pot_single', x: 36, y: 10, text: 'sl_pot', walkable: true },
    { sprite: 'wy_weed_mat', x: 15, y: 7, flat: true, walkable: true, decor: true },
    { sprite: 'wy_plank_slick', x: 35, y: 8, flat: true, walkable: true, decor: true },
    { sprite: 'wy_cargo_spill', x: 40, y: 10, flat: true, walkable: true, decor: true },
    { sprite: 'wy_chain_pile', x: 30, y: 10, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate', x: 12, y: 12, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate_b', x: 13, y: 13, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 36, y: 7, flat: true, walkable: true, decor: true },
    { sprite: 'c5_crab_trail', x: 14, y: 7, flat: true, walkable: true, decor: true },
    { sprite: 'c5_gull_marks', x: 16, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 33, y: 9, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate', x: 6, y: 13, flat: true, walkable: true, decor: true },
    { sprite: 'c5_planks_scatter', x: 36, y: 8, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat', x: 22, y: 12, flat: true, walkable: true, decor: true },
    { sprite: 'wy_plank_slick', x: 13, y: 7, flat: true, walkable: true, decor: true },
    { sprite: 'wy_cargo_spill', x: 29, y: 11, flat: true, walkable: true, decor: true },
    { sprite: 'wy_chain_pile', x: 32, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate', x: 33, y: 3, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate_b', x: 6, y: 14, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 16, y: 3, flat: true, walkable: true, decor: true },
    { sprite: 'c5_crab_trail', x: 40, y: 8, flat: true, walkable: true, decor: true },
    { sprite: 'c5_gull_marks', x: 28, y: 10, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 13, y: 14, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate', x: 28, y: 11, flat: true, walkable: true, decor: true },
    { sprite: 'c5_planks_scatter', x: 24, y: 8, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat', x: 17, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'wy_plank_slick', x: 22, y: 10, flat: true, walkable: true, decor: true },
    { sprite: 'wy_cargo_spill', x: 28, y: 14, flat: true, walkable: true, decor: true },
    { sprite: 'wy_chain_pile', x: 13, y: 12, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate', x: 22, y: 11, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate_b', x: 30, y: 3, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 41, y: 7, flat: true, walkable: true, decor: true },
    { sprite: 'c5_crab_trail', x: 31, y: 11, flat: true, walkable: true, decor: true },
    { sprite: 'c5_gull_marks', x: 12, y: 13, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 13, y: 8, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate', x: 13, y: 11, flat: true, walkable: true, decor: true },
    { sprite: 'c5_planks_scatter', x: 6, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat', x: 18, y: 14, flat: true, walkable: true, decor: true },
    { sprite: 'wy_plank_slick', x: 9, y: 8, flat: true, walkable: true, decor: true },
    { sprite: 'wy_cargo_spill', x: 40, y: 12, flat: true, walkable: true, decor: true },
    { sprite: 'wy_chain_pile', x: 34, y: 9, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate', x: 8, y: 7, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate_b', x: 40, y: 9, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 41, y: 9, flat: true, walkable: true, decor: true },
    { sprite: 'c5_crab_trail', x: 11, y: 13, flat: true, walkable: true, decor: true },
    { sprite: 'c5_gull_marks', x: 32, y: 9, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 40, y: 11, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate', x: 28, y: 13, flat: true, walkable: true, decor: true },
    { sprite: 'c5_planks_scatter', x: 7, y: 13, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat', x: 14, y: 14, flat: true, walkable: true, decor: true },
    { sprite: 'wy_plank_slick', x: 41, y: 8, flat: true, walkable: true, decor: true },
    { sprite: 'wy_cargo_spill', x: 28, y: 12, flat: true, walkable: true, decor: true },
    { sprite: 'wy_chain_pile', x: 9, y: 7, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate', x: 7, y: 14, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate_b', x: 35, y: 7, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 31, y: 10, flat: true, walkable: true, decor: true },
    { sprite: 'c5_crab_trail', x: 25, y: 8, flat: true, walkable: true, decor: true },
    { sprite: 'c5_gull_marks', x: 29, y: 10, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 13, y: 10, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate', x: 13, y: 9, flat: true, walkable: true, decor: true },
    { sprite: 'c5_planks_scatter', x: 10, y: 3, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat', x: 12, y: 14, flat: true, walkable: true, decor: true },
    { sprite: 'wy_plank_slick', x: 33, y: 5, flat: true, walkable: true, decor: true },
    { sprite: 'wy_cargo_spill', x: 31, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'wy_chain_pile', x: 11, y: 12, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate', x: 9, y: 9, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate_b', x: 18, y: 13, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 11, y: 14, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat_b', x: 36, y: 1, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat_b', x: 24, y: 1, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 22, y: 16, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat', x: 41, y: 1, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat_b', x: 3, y: 12, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 42, y: 16, flat: true, walkable: true, decor: true },
    { sprite: 'wy_plank_slick_b', x: 31, y: 16, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat_b', x: 3, y: 16, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 7, y: 1, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 36, y: 16, flat: true, walkable: true, decor: true },
    // LIFE-PASS-END
  ],
  tileTexts: { '#': 'hull_plate', '~': 'fog_sea', f: 'gate_rail', I: 'fog_mast', J: 'fog_stump', O: 'hull_cargo', F: 'hull_net' },

  // Three of the drowned in a TRIO round the flooded hole in the middle of the deck: a bellbuoy
  // bobbing in the hole (row 8, x 17 to 20), a salt shade drifting along its south lip (row 10, x
  // 17 to 20) and a net wraith on the deck just behind (x 17 to 20, home row 11). Touch the shade
  // and the other two come in with it. All are clear of the doors, the foredeck nook and its gate.
  // No cutscenes in this room.
  npcs: [
    { enemy: 'bellbuoy', x: 18, y: 8, patrol: [17, 20], behaviour: 'patrol' },
    { enemy: 'salt_shade', x: 19, y: 10, patrol: [17, 20], behaviour: 'patrol' },
    { enemy: 'net_wraith', x: 18, y: 11, patrol: [17, 20], behaviour: 'wander' },
  ],
};
