// Round 3, helper D (the fun check, 15 November 2026): more to see and poke in the thinnest rooms of
// chapter 5 and the Ash Road. Every piece is walkable (bodiless), so no route, push, gust, swing or cutscene
// walk can be blocked. Words are the r3d_* sections at the end of each room's text file. (draft)
export const R3D_PROPS = {
  ash_seabed: [
  { sprite: 'shore_whelk', x: 16, y: 4, text: 'r3d_ash_seabed_shell', walkable: true },
  { sprite: 'shore_bottle', x: 22, y: 6, text: 'r3d_ash_seabed_bottle', walkable: true },
  ],
  ash_tideline: [
  { sprite: 'c5_deckchair', x: 3, y: 9, text: 'r3d_ash_tideline_deckchair' },
  { sprite: 'st_sandcastle', x: 23, y: 6, text: 'r3d_ash_tideline_castle' },
  ],
  ash_buried_road: [
  { sprite: 'cl_bundle', x: 22, y: 4, text: 'r3d_ash_buried_road_bundle', walkable: true },
  { sprite: 'cl_hand_cart', x: 21, y: 11, text: 'r3d_ash_buried_road_cart' },
  ],
  ash_cinder_field: [
  { sprite: 'washing_line', x: 5, y: 8, text: 'r3d_ash_cinder_field_washing' },
  { sprite: 'cl_wash_tub', x: 2, y: 12, text: 'r3d_ash_cinder_field_tub' },
  ],
  ash_orchard: [
  { sprite: 'cl_cask_rack', x: 24, y: 8, text: 'r3d_ash_orchard_casks' },
  ],
  ash_storm_flats: [
  ],
  ash_waystation: [
  { sprite: 'cl_rota_board', x: 23, y: 7, text: 'r3d_ash_waystation_rota' },
  ],
  ash_drift_cut: [
  ],
  ash_town_gate: [
  ],
  wreck_watch_rock: [
  { sprite: 'il_logbook', x: 7, y: 8, text: 'r3d_wreck_watch_rock_log', walkable: true },
  ],
  wreck_chain_cliff: [
  ],
  reach_needle: [
  { sprite: 'il_cairn', x: 20, y: 12, text: 'r3d_reach_needle_cairn' },
  { sprite: 'c5_handbell', x: 21, y: 24, text: 'r3d_reach_needle_bell' },
  ],
  sunny_sea_view: [
  { sprite: 'st_sleeper_chair', x: 5, y: 6, text: 'r3d_sunny_sea_view_sleeper' },
  { sprite: 'c5_tide_board', x: 2, y: 2, text: 'r3d_sunny_sea_view_ships' },
  { sprite: 'sc_model_boat', x: 27, y: 8, text: 'r3d_sunny_sea_view_model' },
  { sprite: 'st_message_bottle', x: 18, y: 4, text: 'r3d_sunny_sea_view_bottle', walkable: true },
  ],
  sunny_cliff_cave: [
  { sprite: 'sc_leak_bucket', x: 21, y: 11, text: 'r3d_sunny_cliff_cave_bucket' },
  { sprite: 'in_net_mending', x: 19, y: 15, text: 'r3d_sunny_cliff_cave_net' },
  ],
  sunny_cliff_hollow: [
  { sprite: 'st_crab_bucket', x: 6, y: 12, text: 'r3d_sunny_cliff_hollow_crabs', walkable: true },
  { sprite: 'sc_gull', x: 9, y: 4, text: 'r3d_sunny_cliff_hollow_gull', walkable: true },
  ],
  soundings_echo_hall: [
  ],
  lanes_causeway: [
  { sprite: 'lv_bench', x: 1, y: 3, text: 'r3d_lanes_causeway_bench' },
  { sprite: 'lv_boot', x: 36, y: 3, text: 'r3d_lanes_causeway_boot', walkable: true },
  { sprite: 'lv_skep', x: 38, y: 6, text: 'r3d_lanes_causeway_skep' },
  ],
  gullrest_jetty: [
  ],
  lastlight_upper: [
  ],
  ship_figurehead_perch: [
  { sprite: 'gs_tricorn', x: 14, y: 7, text: 'r3d_ship_figurehead_perch_hat' },
  ],
  isles_gannet_stack: [
  { sprite: 'il_stakes_rope', x: 13, y: 4, text: 'r3d_isles_gannet_stack_stake' },
  { sprite: 'telescope', x: 6, y: 6, text: 'r3d_isles_gannet_stack_scope' },
  { sprite: 'r5s_deckchair', x: 32, y: 13, text: 'r3d_isles_gannet_stack_deckchair' },
  ],
  lanes_bubble: [
  { sprite: 'il_tea_table', x: 15, y: 13, text: 'r3d_lanes_bubble_tea' },
  { sprite: 'lv_sundial', x: 13, y: 6, text: 'r3d_lanes_bubble_sundial' },
  ],
  reach_wreck: [
  { sprite: 'gs_ship_bell', x: 39, y: 7, text: 'r3d_reach_wreck_bell' },
  { sprite: 'gs_sack_spill', x: 16, y: 10, text: 'r3d_reach_wreck_grain' },
  { sprite: 'gs_hammock_sag', x: 20, y: 14, text: 'r3d_reach_wreck_hammock' },
  ],
  wreck_under_point: [
  ],
  soundings_tide_stair: [
  { sprite: 'lv_candle_stubs', x: 12, y: 3, text: 'r3d_soundings_tide_stair_candles', walkable: true },
  ],
  lanes_sluices: [
  { sprite: 'in_logbook_stand', x: 3, y: 2, text: 'r3d_lanes_sluices_log' },
  { sprite: 'lv_lunch_pail', x: 5, y: 13, text: 'r3d_lanes_sluices_pail' },
  ],
};
