// Round 3 life pass, helper B (15 November 2026): the set pieces and dressing for the dullest rooms of
// chapter 3 (the fun check). Each list is spread into its room's props with one line. Every one is
// `walkable` (no body), so no route, push, log, treadle, current, carry or cutscene walk can be blocked; a
// script placed each off every door, start, save point, cutscene strip, patrol band and old prop, on
// ground you can reach, with a clear tile to stand on below anything you can press Z on. The Hushwood
// ones are all quiet things: nothing here makes a sound. Their words are the `r3b_*` sections at the
// end of text/interactions/hushwood.txt and deadcity.txt. Sprites: src/data/art/r3bLife.js.
export const R3B_PROPS = {
  hush_mist_edge: [
    { sprite: 'r3b_rag_thorn', x: 13, y: 1, text: 'r3b_me2_thorn', r3b: true },
  ],
  hush_felled_run: [
  ],
  hush_hollow_oak: [
    { sprite: 'r3b_rag_thorn', x: 9, y: 10, text: 'r3b_ho2_thorn', r3b: true },
  ],
  hush_kid_gap: [
  ],
  hush_leaning_pines: [
  ],
  hush_treadles: [
  ],
  hush_gorge: [
    { sprite: 'r3b_rag_thorn', x: 30, y: 1, text: 'r3b_go2_thorn', r3b: true },
    { sprite: 'r3p_cairn', x: 9, y: 1, text: 'r3b_go2_cairn', r3b: true },
  ],
  hush_sawpit: [
    { sprite: 'r3b_felt_shoes', x: 22, y: 7, text: 'r3b_sp2_shoes', walkable: true, r3b: true },
  ],
  hush_notched: [
    { sprite: 'r3b_quiet_shrine', x: 6, y: 17, text: 'r3b_no2_shrine', r3b: true },
    { sprite: 'r3b_stump_house', x: 19, y: 1, text: 'r3b_no2_mouse', r3b: true },
    { sprite: 'r3b_jar_post', x: 5, y: 3, text: 'r3b_no2_jar', r3b: true },
  ],
  hush_sprung_trap: [
    { sprite: 'r3b_bell_wrapped', x: 21, y: 9, text: 'r3b_st2_bell', r3b: true },
    { sprite: 'r3b_felt_shoes', x: 10, y: 20, text: 'r3b_st2_shoes', walkable: true, r3b: true },
    { sprite: 'r3b_rag_thorn', x: 27, y: 6, text: 'r3b_st2_thorn', r3b: true },
  ],
  hush_windfall: [
    { sprite: 'r3b_quiet_shrine', x: 23, y: 4, text: 'r3b_wf2_shrine', r3b: true },
    { sprite: 'r3b_jar_post', x: 2, y: 19, text: 'r3b_wf2_jar', r3b: true },
  ],
  hush_millrace: [
    { sprite: 'r3b_rag_thorn', x: 24, y: 1, text: 'r3b_mr2_thorn', r3b: true },
    { sprite: 'r3b_jar_post', x: 10, y: 10, text: 'r3b_mr2_jar', r3b: true },
    { sprite: 'r3b_bell_wrapped', x: 3, y: 21, text: 'r3b_mr2_bell', r3b: true },
  ],
  hush_quiet: [
    { sprite: 'r3b_quiet_shrine', x: 2, y: 6, text: 'r3b_qu2_shrine', r3b: true },
    { sprite: 'r3b_rag_thorn', x: 23, y: 1, text: 'r3b_qu2_thorn', r3b: true },
    { sprite: 'r3b_jar_post', x: 31, y: 3, text: 'r3b_qu2_jar', r3b: true },
  ],
  hush_clawed_bridge: [
    { sprite: 'r3b_felt_shoes', x: 15, y: 16, text: 'r3b_cb2_shoes', walkable: true, r3b: true },
    { sprite: 'r3b_rag_thorn', x: 28, y: 7, text: 'r3b_cb2_thorn', r3b: true },
  ],
  hush_underroot: [
    { sprite: 'r3b_stump_house', x: 1, y: 17, text: 'r3b_ur2_stump', r3b: true },
  ],
  city_gate_foot: [
    { sprite: 'r3b_left_sticks', x: 4, y: 15, text: 'r3b_gf_sticks', r3b: true },
  ],
  city_statue_court: [
  ],
  city_last_street: [
    { sprite: 'r3b_bell_wrapped', x: 23, y: 7, text: 'r3b_ls2_bell', r3b: true },
    { sprite: 'r3b_felt_shoes', x: 1, y: 9, text: 'r3b_ls2_shoes', walkable: true, r3b: true },
    { sprite: 'r3b_stall', x: 29, y: 9, text: 'r3b_ls2_stall', r3b: true },
  ],
  city_stacks: [
    { sprite: 'r3b_globe', x: 12, y: 5, text: 'r3b_sk2_globe', r3b: true },
    { sprite: 'r3b_dust_sheet', x: 6, y: 6, text: 'r3b_sk2_sheet', r3b: true },
  ],
  city_aqueduct: [
  ],
  city_colonnade: [
    { sprite: 'r3b_stall', x: 4, y: 7, text: 'r3b_co2_stall1', r3b: true },
    { sprite: 'r3b_banner_pole', x: 17, y: 2, text: 'r3b_co2_banner', r3b: true },
  ],
  city_reading_room: [
    { sprite: 'r3b_book_tower', x: 12, y: 5, text: 'r3b_rr2_tower', r3b: true },
  ],
  city_sculptors_yard: [
  ],
  registry_cleft: [
  ],
  registry_cellar: [
  ],
  registry_counting: [
  ],
  registry_stacks: [
    { sprite: 'r3b_book_tower', x: 29, y: 5, text: 'r3b_rs2_tower', r3b: true },
    { sprite: 'r3b_file_cart', x: 1, y: 9, text: 'r3b_rs2_cart', r3b: true },
  ],
  registry_waiting: [
  ],
  hollin_well: [
    { sprite: 'r3b_feast_table', x: 17, y: 12, text: 'r3b_wl2_feast', r3b: true },
    { sprite: 'r3b_wild_flowers', x: 6, y: 6, text: 'r3b_wl2_flowers', walkable: true, r3b: true },
    { sprite: 'r3b_stump_house', x: 23, y: 21, text: 'r3b_wl2_mouse', r3b: true },
  ],
  hollin_well_bottom: [
    { sprite: 'r3b_jar_post', x: 8, y: 4, text: 'r3b_wb2_jar', light: 30, r3b: true },
    { sprite: 'r3m_g_face', x: 16, y: 8, text: 'r3b_wb2_face', r3b: true },
  ],
  hollin_backroom: [
    { sprite: 'r3p_bundle', x: 14, y: 5, text: 'r3b_bk2_flags', walkable: true, r3b: true },
  ],
  hollin_mill: [
    { sprite: 'r3b_stump_house', x: 22, y: 22, text: 'r3b_mi2_stump', r3b: true },
  ],
  hollin_lane: [
    { sprite: 'r3b_stump_house', x: 29, y: 22, text: 'r3b_ln2_mouse', r3b: true },
    { sprite: 'r3b_felt_shoes', x: 1, y: 23, text: 'r3b_ln2_shoes', walkable: true, r3b: true },
  ],
};
