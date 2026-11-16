// The life pass (2026-11-14) for the Beacon Isles, the Last Light and the Reach: the extra things to
// look at and press Z on, per room (spread into each room's props). Written to be bodiless: every one is
// walkable except the purses in their nooks and the two things that talk, and those stand clear of the
// rings, the swings and the landings. Their words are the `lp_*` sections at the end of each text file.
export const LIFE5_PROPS = {
  isles_landing: [
      { sprite: 'oil_can', x: 14, y: 12, text: 'lp_ln_can', walkable: true },
      { sprite: 'hot_mug', x: 13, y: 6, text: 'lp_ln_mug', walkable: true },
  ],
  isles_causeway: [
      { sprite: 'c5_crate', x: 38, y: 8, text: 'lp_cw_bottles' },
  ],
  isles_gannet_stack: [
      { sprite: 'il_gull_rock', x: 12, y: 6, text: 'lp_gs_guano' },
      { sprite: 'c5_rope_coil', x: 17, y: 6, text: 'lp_gs_rope', walkable: true },
      { sprite: 'il_cairn', x: 9, y: 6, text: 'lp_gs_cairn' },
      { sprite: 'c5_driftwood', x: 28, y: 5, text: 'lp_gs_plank', walkable: true },
  ],
  isles_bridge: [
      { sprite: 'c5_rope_bridge_post', x: 8, y: 7, text: 'lp_br_knot' },
      { sprite: 'c5_boat_upturned', x: 2, y: 12, text: 'lp_br_boat' },
      { sprite: 'c5_lobster_pots', x: 36, y: 11, text: 'lp_br_pots' },
      { sprite: 'c5_oar_stuck', x: 7, y: 5, text: 'lp_br_oar' },
      { sprite: 'gold_pouch', x: 5, y: 2, text: 'lp_br_alcove_pouch', gold: 180, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  isles_east_light: [
      { sprite: 'hot_mug', x: 12, y: 15, text: 'lp_el_mug', walkable: true },
      { sprite: 'c5_deckchair', x: 29, y: 9, text: 'lp_el_deckchair' },
  ],
  isles_west_light: [
      { sprite: 'il_note_tidy', x: 24, y: 11, text: 'lp_wl_page', gives: 'lp5_logbook_page', taken: { text: 'lp_wl_page_gone' }, flat: true, walkable: true },
      { sprite: 'c5_barrels', x: 35, y: 15, text: 'lp_wl_barrels' },
      { sprite: 'c5_oar_stuck', x: 41, y: 8, text: 'lp_wl_oar' },
      { sprite: 'il_rocks_big', x: 3, y: 14, text: 'lp_wl_seat' },
  ],
  isles_old_lightroom: [
      { sprite: 'in_book_pile', x: 3, y: 5, npc: 'isles_logbook', quest: [{ needs: ['has:lp5_logbook_page'], take: 'lp5_logbook_page', set: ['q_page_asked', 'q_page_done'], give: 'keepers_pencil', text: 'page_done' }, { needs: ['q_page_done'], text: 'page_after' }, { needs: ['!q_page_asked'], set: 'q_page_asked', text: 'page_ask', append: true }] },
      { sprite: 'hot_mug', x: 12, y: 5, text: 'lp_ol_cup', walkable: true },
      { sprite: 'c5_oilskin_hook', x: 13, y: 8, text: 'lp_ol_hook' },
  ],
  lastlight_foot: [
      { sprite: 'in_boots', x: 6, y: 9, text: 'lp_lf_boots', walkable: true },
      { sprite: 'c5_galley_stove', x: 14, y: 9, npc: 'll_stove', quest: [{ needs: ['has:lp5_kettle'], take: 'lp5_kettle', set: ['q_kettle_asked', 'q_kettle_done'], give: 'trimmed_wick', text: 'kettle_done' }, { needs: ['q_kettle_done'], text: 'kettle_after' }, { needs: ['!q_kettle_asked'], set: 'q_kettle_asked', text: 'kettle_ask', append: true }] },
      { sprite: 'il_dandelion', x: 2, y: 11, text: 'lp_lf_dandelion', walkable: true },
      { sprite: 'oil_can', x: 9, y: 8, text: 'lp_lf_can', walkable: true },
      { sprite: 'c5_lantern_post_unlit', x: 16, y: 3, text: 'lp_lf_lantern' },
      { sprite: 'sign', x: 20, y: 12, text: 'lp_lf_mouse_card' },
  ],
  lastlight_sluice: [
      { sprite: 'il_kettle', x: 11, y: 13, text: 'lp_ls_kettle', gives: 'lp5_kettle', taken: { text: 'lp_ls_kettle_gone' } },
      { sprite: 'c5_crate', x: 4, y: 12, text: 'lp_ls_wicks' },
      { sprite: 'c5_barrel', x: 19, y: 13, text: 'lp_ls_dry' },
      { sprite: 'gold_pouch', x: 1, y: 14, text: 'lp_ls_corner_pouch', gold: 240, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  lastlight_stair: [
      { sprite: 'in_boots_dry', x: 2, y: 8, text: 'lp_lt_dry_boots', walkable: true },
      { sprite: 'in_book_pile', x: 22, y: 13, text: 'lp_lt_books' },
      { sprite: 'c5_rope_coil', x: 3, y: 3, text: 'lp_lt_rope', walkable: true },
  ],
  lastlight_gallery: [
      { sprite: 'table', x: 12, y: 8, text: 'lp_lg_tea' },
      { sprite: 'in_cat_bed', x: 5, y: 10, text: 'lp_lg_cat_bed', walkable: true },
  ],
  lastlight_upper: [
      { sprite: 'telescope', x: 11, y: 9, text: 'lp_lu_scope' },
      { sprite: 'c5_crate', x: 3, y: 13, text: 'lp_lu_moths' },
      { sprite: 'c5_barrels', x: 25, y: 14, text: 'lp_lu_oil' },
  ],
  reach_foot: [
      { sprite: 'c5_buoy_red', x: 13, y: 24, text: 'lp_rf_bell_buoy' },
  ],
  reach_eye: [
      { sprite: 'c5_crate', x: 18, y: 6, text: 'lp_re_bottles' },
      { sprite: 'c5_deckchair', x: 13, y: 12, text: 'lp_re_chair' },
  ],
  reach_reef: [
      { sprite: 'c5_lobster_pots', x: 12, y: 11, text: 'lp_rr_pots' },
      { sprite: 'c5_toy_boat', x: 22, y: 6, text: 'lp_rr_toy', walkable: true },
  ],
  reach_first_rock: [
      { sprite: 'il_gull', x: 26, y: 10, npc: 'reach_hat_gull', quest: [{ needs: ['has:lp5_souwester'], take: 'lp5_souwester', set: ['q_hat_asked', 'q_hat_done'], give: 'gull_feather', text: 'hat_done' }, { needs: ['q_hat_done'], text: 'hat_after' }, { needs: ['!q_hat_asked'], set: 'q_hat_asked', text: 'hat_ask', append: true }] },
      { sprite: 'telescope', x: 12, y: 10, text: 'lp_rk_scope' },
      { sprite: 'il_cairn', x: 24, y: 11, text: 'lp_rk_cairn' },
  ],
  reach_wreck: [
      { sprite: 'c5_oilskin_hook', x: 38, y: 5, text: 'lp_rw_souwester', gives: 'lp5_souwester', taken: { text: 'lp_rw_souwester_gone' } },
      { sprite: 'gold_pouch', x: 38, y: 9, text: 'lp_rw_hide_pouch', gold: 260, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  reach_needle: [
  ],
};
