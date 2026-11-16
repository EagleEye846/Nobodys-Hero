// The life pass, round 2 (15 November 2026) for chapter 3's Lasthome, the Dead City, the Registry and the Old
// Baths: the extra things to look at and press Z on, and the dressing, per room (spread into each room's props).
// Every one is `walkable`, so none has a body; none stands on a door, a cutscene walk, a patrol, a lever, a plank
// or a save point. The words are the `lp3_*` sections at the end of lasthome.txt and deadcity.txt.
export const LIFE3C_PROPS = {
  lasthome_gate: [
      { "sprite": "cl_flower_tub", "x": 1, "y": 5, "text": "lp3_gate_tub" },
      { "sprite": "cl_log_stack", "x": 21, "y": 6, "text": "lp3_gate_logs" },
      { "sprite": "cl_veg_bed", "x": 6, "y": 13, "text": "lp3_gate_cabbages", "walkable": true },
      { "sprite": "cl_doormat", "x": 11, "y": 4, "text": "lp3_gate_mat", "flat": true, "walkable": true, "doorok": true },
  ],
  lasthome_square: [
      { "sprite": "cl_bean_poles", "x": 20, "y": 3, "text": "lp3_sq_beans" },
      { "sprite": "gold_pouch", "x": 24, "y": 2, "text": "lp3_sq_purse", "gold": 30, "taken": { "sprite": "gold_pouch_empty", "text": "gold_pouch_empty" }},
      { "sprite": "cl_kennel", "x": 32, "y": 2, "text": "lp3_sq_kennel", "gives": "lp3_red_float", "taken": { "text": "lp3_sq_kennel_empty" }},
      { "sprite": "cl_apple_crate", "x": 15, "y": 11, "text": "lp3_sq_apples" },
      { "sprite": "cl_folk_sweeper", "x": 13, "y": 19, "walkable": false, "npc": "cl_folk_sweeper" },
      { "sprite": "cl_folk_kid", "x": 3, "y": 18, "walkable": false, "npc": "cl_folk_kid" },
      { "sprite": "cl_folk_baker", "x": 30, "y": 16, "walkable": false, "npc": "cl_folk_baker" },
  ],
  lasthome_healer: [
      { "sprite": "cl_cards_board", "x": 12, "y": 2, "text": "lp3_hl_cards" },
  ],
  lasthome_inn: [
      { "sprite": "cl_cask_rack", "x": 3, "y": 4, "text": "lp3_inn_casks" },
      { "sprite": "cl_chalk_easel", "x": 8, "y": 9, "text": "lp3_inn_board" },
  ],
  lasthome_chapel: [
      { "sprite": "cl_hassock", "x": 5, "y": 8, "text": "lp3_ch_hassock", "walkable": true },
  ],
  city_old_street: [
      { "sprite": "cl_hand_cart", "x": 5, "y": 4, "text": "lp3_os_cart" },
      { "sprite": "cl_street_chair", "x": 14, "y": 10, "text": "lp3_os_chair", "gives": "lp3_street_chair", "taken": { "text": "lp3_os_chair_gone" }},
  ],
  city_forum: [
      { "sprite": "cl_bench_moss", "x": 10, "y": 2, "text": "lp3_fo_bench" },
      { "sprite": "cl_stone_cat", "x": 5, "y": 14, "text": "lp3_fo_cat" },
  ],
  city_colonnade: [
      { "sprite": "cl_street_chair", "x": 10, "y": 11, "text": "lp3_co_chair" },
  ],
  city_library: [
      { "sprite": "cl_ledger_lectern", "x": 10, "y": 13, "text": "lp3_li_lectern" },
  ],
  city_reading_room: [
      { "sprite": "cl_ink_pot", "x": 3, "y": 5, "text": "lp3_rr_ink", "walkable": true },
  ],
  city_baths: [
      { "sprite": "cl_gauge", "x": 7, "y": 2, "text": "lp3_ba_gauge" },
      { "sprite": "cl_mosaic", "x": 11, "y": 10, "text": "lp3_ba_mosaic", "flat": true, "walkable": true },
      { "sprite": "cl_bath_duck", "x": 7, "y": 10, "walkable": true, "npc": "cl_duck", "quest": [{ "needs": ["has:lp3_duck"], "take": "lp3_duck", "set": ["q_duck_asked", "q_duck_done"], "give": "slowlys_boat", "text": "duck_done" }, { "needs": ["q_duck_done"], "text": "duck_after" }, { "needs": ["!q_duck_asked"], "set": "q_duck_asked", "text": "duck_ask", "append": true }]},
  ],
  baths_stokehold: [
      { "sprite": "cl_gauge", "x": 2, "y": 2, "text": "lp3_st_gauge", "walkable": true, "puzzleok": true },
      { "sprite": "cl_rota_board", "x": 19, "y": 3, "text": "lp3_st_rota" },
      { "sprite": "cl_bath_duck", "x": 22, "y": 3, "text": "lp3_st_duck", "walkable": true, "gives": "lp3_duck", "taken": { "text": "lp3_st_duck_gone" }},
      { "sprite": "gold_pouch", "x": 22, "y": 5, "text": "lp3_st_purse", "gold": 25, "taken": { "sprite": "gold_pouch_empty", "text": "gold_pouch_empty" }},
  ],
  city_crier_square: [
      { "sprite": "cl_laid_table", "x": 19, "y": 3, "npc": "cl_laid_table", "quest": [{ "needs": ["has:lp3_street_chair"], "take": "lp3_street_chair", "set": ["q_chair_asked", "q_chair_done"], "give": "heros_place_card", "text": "chair_done" }, { "needs": ["q_chair_done"], "text": "chair_after" }, { "needs": ["!q_chair_asked"], "set": "q_chair_asked", "text": "chair_ask", "append": true }]},
      { "sprite": "cl_trunk", "x": 21, "y": 7, "text": "lp3_cr_trunk" },
  ],
  city_aqueduct: [
      { "sprite": "gold_pouch", "x": 1, "y": 7, "text": "lp3_aq_purse", "walkable": true, "gold": 30, "taken": { "sprite": "gold_pouch_empty", "text": "gold_pouch_empty" }},
      { "sprite": "cl_scrub_bucket", "x": 6, "y": 10, "text": "lp3_aq_bucket" },
      { "sprite": "cl_stone_cat", "x": 26, "y": 2, "text": "lp3_aq_cat" },
  ],
  city_statue_court: [
      { "sprite": "cl_posy", "x": 26, "y": 5, "text": "lp3_sc_posy", "walkable": true },
  ],
  city_sculptors_yard: [
      { "sprite": "cl_stone_cat", "x": 5, "y": 4, "text": "lp3_sy_cat" },
      { "sprite": "cl_bundle", "x": 12, "y": 3, "text": "lp3_sy_lunch", "walkable": true },
  ],
  city_last_street: [
  ],
  city_gate_foot: [
  ],
  registry_cleft: [
      { "sprite": "cl_slate_easel", "x": 23, "y": 4, "text": "lp3_rc_slate" },
      { "sprite": "cl_flower_tub", "x": 2, "y": 4, "text": "lp3_rc_window" },
  ],
  registry_counting: [
      { "sprite": "cl_loose_pages", "x": 26, "y": 6, "flat": true, "walkable": true, "gives": "lp3_page", "text": "lp3_rn_page", "puzzleok": true },
      { "sprite": "cl_ink_pot", "x": 18, "y": 9, "text": "lp3_rn_ink", "walkable": true },
  ],
  registry_stacks: [
      { "sprite": "cl_ladder_rail", "x": 3, "y": 3, "text": "lp3_rs_ladder", "walkable": true, "puzzleok": true },
      { "sprite": "cl_ladder_rail", "x": 25, "y": 3, "walkable": true, "puzzleok": true, "decor": true },
      { "sprite": "cl_ladder_rail", "x": 40, "y": 3, "walkable": true, "puzzleok": true, "decor": true },
  ],
  registry_waiting: [
      { "sprite": "cl_pigeonholes", "x": 11, "y": 2, "npc": "cl_pigeonholes", "quest": [{ "needs": ["has:lp3_page"], "take": "lp3_page", "set": ["q_page_asked", "q_page_done"], "give": "clerks_blotter", "text": "page_done" }, { "needs": ["q_page_done"], "text": "page_after" }, { "needs": ["!q_page_asked"], "set": "q_page_asked", "text": "page_ask", "append": true }]},
      { "sprite": "cl_slate_easel", "x": 3, "y": 5, "text": "lp3_rw_slate" },
      { "sprite": "cl_ink_pot", "x": 19, "y": 7, "text": "lp3_rw_ink", "walkable": true },
      { "sprite": "cl_scroll_basket", "x": 1, "y": 3, "text": "lp3_rw_lunch", "gives": "honey_oatcake", "taken": { "text": "lp3_rw_lunch_empty" }},
  ],
  registry_lair: [
      { "sprite": "cl_slate_easel", "x": 24, "y": 13, "text": "lp3_rl_slate" },
      { "sprite": "cl_ink_pot", "x": 18, "y": 15, "text": "lp3_rl_ink", "walkable": true },
  ],
  registry_cellar: [
      { "sprite": "cl_slate_easel", "x": 19, "y": 7, "text": "lp3_ce_slate" },
      { "sprite": "cl_clerk_desk", "x": 6, "y": 7, "text": "lp3_ce_desk" },
  ],
};
