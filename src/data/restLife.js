// The life pass, round 2 (15 November 2026): the extra things to look at and press Z on in Heralds' Rest,
// the Long Stair and the Ice Caves, per room (spread into each room's props). Everything here is bodiless
// (`walkable`) except the folk who talk, and they stand clear of every climb, ice slide and doorway. Their
// words are the `r2r_*` sections at the end of each text file; the art is src/data/art/restLife.js.
export const R2R_PROPS = {
  rest_gate: [
    { sprite: 'r2r_woodpile', x: 20, y: 17, text: 'r2r_gt_wood' },
    { sprite: 'r2r_sled', x: 3, y: 16, text: 'r2r_gt_sled', walkable: true },
  ],
  rest_square: [
    { sprite: 'r2r_snowshoes', x: 2, y: 7, text: 'r2r_sq_shoes' },
    { sprite: 'r2r_axe_rack', x: 11, y: 7, text: 'r2r_sq_axes' },
    { sprite: 'r2r_chop_block', x: 16, y: 6, text: 'r2r_sq_chop' },
    { sprite: 'herald_kid', x: 11, y: 22, npc: 'r2r_dot', notice: true, quest: [{ needs: ['has:r2r_toy_trumpet'], take: 'r2r_toy_trumpet', set: 'q_r2r_dot', give: 'r2r_dot_drawing', text: 'trumpet_back' }, { needs: ['q_r2r_dot'], text: 'trumpet_after' }] },
    { sprite: 'st_tin_box', x: 1, y: 27, text: 'r2r_sq_den', gives: 'frostberry_jam', taken: { text: 'r2r_sq_den_empty' } },
  ],
  rest_inn: [
    { sprite: 'r2r_herbs', x: 8, y: 2, text: 'r2r_in_herbs' },
    { sprite: 'r2r_boots_dry', x: 2, y: 5, text: 'r2r_in_boots', walkable: true, speed: 0.6, animation: 'r2r_boots_dry' },
    { sprite: 'r2r_cat_hearth', x: 4, y: 4, text: 'r2r_in_cat', walkable: true, pet: true, speed: 1.6, animation: 'r2r_cat_hearth' },
    { sprite: 'r2r_guest_reader', x: 14, y: 5, npc: 'r2r_in_reader', notice: true },
    { sprite: 'r2r_guest_climber', x: 13, y: 7, npc: 'r2r_in_climber', notice: true },
  ],
  rest_hall: [
    { sprite: 'r2r_boots_dry', x: 14, y: 5, text: 'r2r_hl_boots', walkable: true, speed: 0.6, animation: 'r2r_boots_dry' },
    { sprite: 'r2r_log_basket', x: 6, y: 4, text: 'r2r_hl_logs' },
    { sprite: 'r2r_toy_trumpet', x: 8, y: 12, text: 'r2r_hl_toy', walkable: true, gives: 'r2r_toy_trumpet', taken: { gone: true }, react: true },
  ],
  rest_stores: [
    { sprite: 'r2r_snowshoes', x: 3, y: 2, text: 'r2r_sr_shoes' },
    { sprite: 'r2r_axe_rack', x: 12, y: 5, text: 'r2r_sr_axes' },
    { sprite: 'st_cat_sit', x: 9, y: 7, text: 'r2r_sr_cat', walkable: true, speed: 0.8, pet: true, animation: 'st_cat_sit' },
  ],
  rest_belltower: [
    { sprite: 'r2r_rope_coil', x: 8, y: 17, text: 'r2r_bt_rope', walkable: true },
  ],
  rest_house_marta: [
    { sprite: 'r2r_log_basket', x: 2, y: 4, text: 'r2r_ma_logs' },
  ],
  rest_house_pottle: [
    { sprite: 'r2r_herbs', x: 9, y: 2, text: 'r2r_po_herbs' },
  ],
  rest_chapel: [
    { sprite: 'r2r_herbs', x: 9, y: 2, text: 'r2r_ch_herbs' },
  ],
  rest_lookout: [
    { sprite: 'r2r_woodpile', x: 4, y: 2, text: 'r2r_lk_wood' },
    { sprite: 'r2r_tin_mug', x: 9, y: 13, text: 'r2r_lk_mug', walkable: true },
  ],
  goat_track: [
    { sprite: 'r2r_marmot', x: 20, y: 3, npc: 'r2r_marmot', notice: true, speed: 0.7, quest: [{ needs: ['has:r2r_edelweiss'], take: 'r2r_edelweiss', set: 'q_r2r_marmot', give: 'r2r_marmot_whistle', text: 'flowers_back' }, { needs: ['q_r2r_marmot'], text: 'flowers_after' }], animation: 'r2r_marmot' },
    { sprite: 'r2r_flowers_b', x: 20, y: 12, text: 'r2r_gk_edel', walkable: true, gives: 'r2r_edelweiss', taken: { gone: true }, react: true },
    { sprite: 'r2r_bent_pole', x: 6, y: 15, text: 'r2r_gk_pole' },
    { sprite: 'r2r_goat_kid', x: 21, y: 14, text: 'r2r_gk_kid', walkable: true, speed: 1.4, animation: 'r2r_goat_kid' },
  ],
  climb_start: [
    { sprite: 'r2r_tally_post', x: 15, y: 12, text: 'r2r_cs_tally' },
    { sprite: 'r2r_camp_stove', x: 8, y: 14, text: 'r2r_cs_stove' },
    { sprite: 'st_tin_box', x: 18, y: 15, text: 'r2r_cs_stash', gives: 'climbers_ration', taken: { text: 'r2r_cs_stash_empty' } },
  ],
  sheer_face: [
    { sprite: 'r2r_tally_post', x: 11, y: 24, text: 'r2r_sf_tally' },
    { sprite: 'r2r_blaze_post', x: 4, y: 24, text: 'r2r_sf_blaze' },
  ],
  ice_cave_throat: [
    { sprite: 'r2r_rope_coil', x: 17, y: 13, text: 'r2r_it_rope', walkable: true },
    { sprite: 'r2r_horn', x: 21, y: 17, text: 'r2r_it_horn', walkable: true },
    { sprite: 'r2r_scratches', x: 11, y: 2, text: 'r2r_it_scratch', walkable: true, wall: true },
  ],
  ice_cave_grotto: [
    { sprite: 'snow_hare', x: 7, y: 12, npc: 'r2r_mitten_hare', notice: true, quest: [{ needs: ['has:r2r_red_mitten'], take: 'r2r_red_mitten', set: 'q_r2r_hare', give: 'r2r_hare_print', text: 'mitten_back' }, { needs: ['q_r2r_hare'], text: 'mitten_after' }] },
    { sprite: 'r2r_frost_candle', x: 18, y: 12, text: 'r2r_ig_candle', walkable: true },
    { sprite: 'r2r_sack', x: 27, y: 12, text: 'r2r_ig_sack' },
    { sprite: 'r2r_scratches', x: 15, y: 2, text: 'r2r_ig_scratch', walkable: true, wall: true },
  ],
  ice_cave_hall: [
    { sprite: 'r2r_glove', x: 7, y: 10, text: 'r2r_ih_glove', walkable: true, gives: 'r2r_red_mitten', taken: { gone: true }, react: true },
    { sprite: 'r2r_horn', x: 12, y: 14, text: 'r2r_ih_horn', walkable: true },
    { sprite: 'r2r_helmet', x: 25, y: 9, text: 'r2r_ih_helmet', walkable: true },
    { sprite: 'r2r_scratches', x: 9, y: 2, text: 'r2r_ih_scratch', walkable: true, wall: true },
  ],
  ice_cave_roost: [
    { sprite: 'r2r_horn', x: 21, y: 8, text: 'r2r_ir_horn', walkable: true },
    { sprite: 'r2r_helmet', x: 4, y: 15, text: 'r2r_ir_helmet', walkable: true },
    { sprite: 'st_tin_box', x: 1, y: 17, text: 'r2r_ir_stash', gives: 'snowmelt_tea', taken: { text: 'r2r_ir_stash_empty' } },
  ],
};
