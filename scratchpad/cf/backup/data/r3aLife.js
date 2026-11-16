// Round 3, the fun check (15 November 2026), chapters 1 and 2: the extra things to look at and press Z on in the
// rooms that scored lowest (the foot of the Stair, the Ice Caves, the Singing Gallery, the Sheer Face, the
// Lamplighter's hut, the ice cave rooms, the summit and the village's houses, shops and tower). Spread into each
// room's props. Everything is bodiless (`walkable`), so no climb, push, ring, door or cutscene can be blocked;
// wordless pieces carry `decor: true`. Words: the `r3a_*` sections at the end of each room's text file. Art:
// src/data/art/r3aLife.js (and a few older sprites from restLife.js, vigilLife.js, ruinsLife.js).
const t = (sprite, x, y, text, more = {}) => ({ sprite, x, y, text, walkable: true, ...more });
const d = (sprite, x, y, more = {}) => ({ sprite, x, y, walkable: true, decor: true, ...more });
const f = (sprite, x, y, more = {}) => ({ sprite, x, y, walkable: true, decor: true, flat: true, ...more });
const w = (sprite, x, y, more = {}) => ({ sprite, x, y, walkable: true, decor: true, wall: true, ...more });

export const R3A_PROPS = {
  // The first look at the world: a meadow with a buried stair at the end of it.
  beyond_ruins: [
    t('r3a_picnic', 4, 8, 'r3a_bf_picnic', { flat: true }),
    t('r3a_signpost', 13, 9, 'r3a_bf_signpost'),
    t('r3a_firering', 6, 4, 'r3a_bf_firering', { flat: true }),
    t('r3a_thermos', 19, 12, 'r3a_bf_flask'),
    t('r2v_name_stone', 7, 10, 'r3a_bf_names'),
    d('r3a_bundle', 3, 12),
    d('r2r_flowers_a', 6, 7), d('r2r_flowers_a', 15, 12), d('r2r_flowers_a', 17, 7), d('r2r_flowers_a', 2, 11),
    d('r2r_flowers_b', 8, 3), d('r2r_flowers_b', 14, 10), d('r2r_flowers_b', 2, 6),
    d('r2v_heather', 5, 11), d('r2v_heather', 19, 9),
    d('r2r_scree', 20, 10, { flat: true }), d('r2r_scree', 6, 12, { flat: true }),
    d('r2v_rock_pile', 2, 8),
  ],

  // The first cave: someone has strung a guide-line, and lived here a while.
  cave_entry: [
    d('r3a_cord_loop', 5, 15, { wall: true }), d('r3a_cord_loop', 9, 11, { wall: true }), d('r3a_cord_loop', 24, 5, { wall: true }),
    t('r2r_rope_coil', 8, 19, 'r3a_ce_cord'),
    t('r3a_thermos', 13, 20, 'r3a_ce_flask'),
    t('r3a_pale_caps', 9, 19, 'r3a_ce_caps'),
    t('r2v_boots', 28, 12, 'r3a_ce_boots'),
    t('r2r_drip_pool', 13, 15, 'r3a_ce_pool', { speed: 1.2, flat: true, animation: 'r2r_drip_pool' }),
    d('r3a_pale_caps', 3, 12), d('r3a_pale_caps', 21, 12),
    w('r3a_chalk_arrow', 4, 2), w('r3a_chalk_arrow', 9, 2), w('r3a_chalk_arrow', 6, 18), w('r3a_chalk_arrow', 14, 18),
    f('r2r_hoar', 11, 6), f('r2r_hoar', 23, 18), f('r2r_hoar', 10, 8),
    d('r2r_ice_spike', 14, 11), d('r2r_ice_spike', 2, 9), d('r2r_ice_spike', 27, 17), d('r2r_ice_spike', 18, 19),
    d('r2r_cave_snow', 28, 6), d('r2r_cave_snow', 12, 19),
  ],

  // The Singing Gallery: someone has been tuning it with chalk.
  cave_gallery: [
    w('r3a_chalk_note_e', 10, 6), w('r3a_chalk_note_g', 25, 6), w('r3a_chalk_note_d', 10, 11), w('r3a_chalk_note_e', 3, 15),
    w('r3a_chalk_note_g', 30, 15), w('r3a_chalk_note_d', 10, 20), w('r3a_chalk_note_e', 27, 20),
    t('r3a_hum_slab', 8, 17, 'r3a_cg_slab', { flat: true }),
    t('r3a_slate', 9, 22, 'r3a_cg_slate'),
    t('r3a_tea_kit', 29, 23, 'r3a_cg_tea'),
    t('r3a_bedroll', 26, 23, 'r3a_cg_bedroll', { flat: true }),
    t('r2r_scratches', 17, 2, 'r3a_cg_scratch', { wall: true }),
    t('r3a_pale_caps', 33, 10, 'r3a_cg_caps'),
    d('r3a_pale_caps', 6, 12), d('r3a_pale_caps', 21, 20),
    d('r2r_ice_bud', 20, 3, { light: 26 }), d('r2r_ice_bud', 4, 10, { light: 26 }), d('r2r_ice_bud', 32, 17, { light: 26 }),
    d('r2r_ice_spike', 6, 8), d('r2r_ice_spike', 25, 11), d('r2r_ice_spike', 13, 17), d('r2r_ice_spike', 31, 19),
    f('r2r_hoar', 20, 13), f('r2r_hoar', 8, 6), f('r2r_hoar', 24, 16),
    d('r2r_cave_snow', 17, 22), d('r2r_cave_snow', 2, 8),
  ],

  // The Sheer Face: the top, the halfway and the bottom ledges (nothing with words near a ring) and the rock itself.
  sheer_face: [
    t('telescope', 3, 2, 'r3a_sf_scope'),
    t('r3a_cairn_small', 17, 1, 'r3a_sf_cairn'),
    t('r3a_thermos', 18, 11, 'r3a_sf_flask'),
    t('r3a_cairn_small', 5, 25, 'r3a_sf_cairn_low'),
    t('r3a_firering', 12, 23, 'r3a_sf_firering', { flat: true }),
    t('r2r_scratches', 16, 20, 'r3a_sf_bert', { wall: true }),
    d('r3a_bundle', 14, 25),
    d('r3a_crack_frost', 3, 5, { wall: true }), d('r3a_crack_frost', 16, 6, { wall: true }), d('r3a_crack_frost', 4, 15, { wall: true }),
    d('r3a_crack_frost', 15, 16, { wall: true }), d('r3a_crack_frost', 5, 19, { wall: true }), d('r3a_crack_frost', 17, 14, { wall: true }),
    d('r2v_icicles', 4, 13), d('r2v_icicles', 15, 13), d('r2v_icicles', 4, 4), d('r2v_icicles', 16, 4),
    d('r2r_snow_patch', 14, 10, { flat: true }), d('r2r_cave_snow', 2, 11),
  ],

  // The Lamplighter's hut: tea kept ready.
  vigil_lamplighters_hut: [
    t('r3a_oil_shelf', 4, 2, 'r3a_hut_shelf'),
    t('r3a_hut_table', 6, 5, 'r3a_hut_table'),
    t('r2r_window', 10, 2, 'r3a_hut_window'),
    t('r3a_slate', 2, 4, 'r3a_hut_roster'),
    t('r3a_bundle', 3, 3, 'r3a_hut_kindling'),
    f('r1_mat', 4, 6),
    d('r2r_hoar', 10, 7, { flat: true }),
  ],

  // The ice cave rooms.
  ice_cave_throat: [
    d('r3a_cord_loop', 14, 5, { wall: true }), d('r3a_cord_loop', 22, 9, { wall: true }), d('r3a_cord_loop', 13, 12, { wall: true }),
    d('r3a_cord_loop', 19, 14, { wall: true }), d('r3a_cord_loop', 10, 17, { wall: true }),
    w('r3a_chalk_arrow', 15, 2), w('r3a_chalk_arrow', 20, 2), w('r3a_chalk_arrow', 3, 16),
    t('r3a_pale_caps', 7, 9, 'r3a_it_caps'),
    t('r3a_bedroll', 2, 18, 'r3a_it_bedroll', { flat: true }),
    t('r3a_tea_kit', 6, 18, 'r3a_it_tea'),
    t('r3a_slate', 25, 14, 'r3a_it_slate'),
    d('r3a_pale_caps', 27, 18), d('r3a_pale_caps', 5, 3),
    f('r2r_hoar', 9, 6), f('r2r_hoar', 27, 8),
    d('r2r_cave_snow', 4, 14), d('r2r_cave_snow', 18, 15),
    d('r2r_ice_spike', 12, 18), d('r2r_ice_spike', 21, 12),
  ],
  ice_cave_grotto: [
    d('r3a_cord_loop', 23, 6, { wall: true }), d('r3a_cord_loop', 30, 10, { wall: true }), d('r3a_cord_loop', 4, 13, { wall: true }),
    w('r3a_chalk_arrow', 9, 2), w('r3a_chalk_arrow', 24, 2),
    t('r3a_slate', 19, 12, 'r3a_ig_slate'),
    t('r3a_boot_heap', 29, 13, 'r3a_ig_boots'),
    t('r3a_tea_kit', 15, 13, 'r3a_ig_tea'),
    t('r3a_pale_caps', 31, 12, 'r3a_ig_caps'),
    t('r2r_drip_pool', 6, 8, 'r3a_ig_pool', { speed: 1.2, flat: true, animation: 'r2r_drip_pool' }),
    d('r3a_pale_caps', 6, 3), d('r3a_pale_caps', 28, 14),
    f('r2r_hoar', 12, 5), f('r2r_hoar', 30, 6),
    d('r2r_ice_spike', 14, 9), d('r2r_ice_spike', 26, 8), d('r2r_cave_snow', 2, 10), d('r2r_cave_snow', 32, 11),
  ],
  ice_cave_hall: [
    d('r3a_cord_loop', 12, 5, { wall: true }), d('r3a_cord_loop', 29, 5, { wall: true }),
    w('r3a_chalk_arrow', 4, 7), w('r3a_chalk_arrow', 24, 7), w('r3a_chalk_arrow', 6, 2), w('r3a_chalk_arrow', 20, 2),
    t('r3a_pale_caps', 25, 12, 'r3a_ih_caps'),
    t('r3a_slate', 14, 13, 'r3a_ih_slate'),
    t('r3a_tea_kit', 30, 15, 'r3a_ih_tea'),
    t('r3a_bedroll', 21, 15, 'r3a_ih_bedroll', { flat: true }),
    t('r2v_ice_fall', 28, 2, 'r3a_ih_fall'),
    d('r3a_pale_caps', 31, 3), d('r3a_pale_caps', 6, 15),
    f('r2r_hoar', 17, 5), f('r2r_hoar', 33, 12),
    d('r2r_ice_spike', 9, 5), d('r2r_ice_spike', 26, 14), d('r2r_cave_snow', 19, 9), d('r2r_cave_snow', 3, 8),
  ],
  ice_cave_roost: [
    t('r3a_guano', 6, 12, 'r3a_ir_guano', { flat: true }),
    d('r3a_guano', 19, 15, { flat: true }), d('r3a_guano', 3, 9, { flat: true }), d('r3a_guano', 10, 5, { flat: true }),
    t('r3a_slate', 13, 15, 'r3a_ir_census'),
    t('r3a_pale_caps', 20, 18, 'r3a_ir_caps'),
    t('r2r_scratches', 6, 2, 'r3a_ir_claws', { wall: true }),
    d('r3a_pale_caps', 3, 13), d('r3a_pale_caps', 25, 6),
    w('r3a_chalk_arrow', 11, 18),
    f('r2r_hoar', 15, 9), f('r2r_hoar', 10, 14),
    d('r2r_ice_spike', 22, 13), d('r2r_ice_spike', 9, 17), d('r2r_cave_snow', 2, 5), d('r2r_cave_snow', 26, 17),
  ],

  // The top of the world: more than a white floor.
  vigil_summit: [
    d('r3a_rime_fin', 3, 9), d('r3a_rime_fin', 11, 6), d('r3a_rime_fin', 28, 9), d('r3a_rime_fin', 24, 11), d('r3a_rime_fin', 12, 10),
    t('r3a_summit_tin', 22, 13, 'r3a_su_tin'),
    t('r3a_snow_stack', 10, 11, 'r3a_su_snowman'),
    t('r2v_hat_stake', 24, 14, 'r3a_su_hat'),
  ],

  // Heralds' Rest: the Hall of Heralds, the stores, the forge, the tower and the houses.
  rest_hall: [
    t('r3a_welcome_banner', 8, 2, 'r3a_hl_banner'),
    t('r3a_sheeted', 16, 4, 'r3a_hl_statue'),
    t('r3a_dust_sheet_chair', 18, 9, 'r3a_hl_chair'),
    t('r3a_wish_bowl', 3, 7, 'r3a_hl_bowl'),
    t('r3a_arrivals_board', 1, 4, 'r3a_hl_board'),
  ],
  rest_stores: [
    t('r3a_cheese', 2, 6, 'r3a_st_cheese'),
    t('r3a_scales', 8, 5, 'r3a_st_scales'),
    t('r3a_rope_hank', 10, 6, 'r3a_st_rope'),
    t('r3a_hams', 6, 2, 'r3a_st_hams'),
    t('r3a_flour', 12, 6, 'r3a_st_flour'),
    t('r3a_slate', 10, 4, 'r3a_st_slate'),
    d('r3a_bundle', 1, 5),
  ],
  rest_forge: [
    t('r3a_bellows', 4, 3, 'r3a_fg_bellows'),
    t('r3a_blade_rack', 5, 2, 'r3a_fg_blades'),
    t('r3a_horseshoes', 8, 2, 'r3a_fg_shoes'),
    t('r3a_tong_rack', 10, 2, 'r3a_fg_tongs'),
    t('r3a_quench_tub', 11, 6, 'r3a_fg_tub'),
    t('r3a_coal', 1, 5, 'r3a_fg_coal'),
    t('r3a_grindstone', 10, 9, 'r3a_fg_stone'),
  ],
  rest_belltower: [
    t('r3a_dove_box', 8, 6, 'r3a_bt_doves'),
    t('r3a_bell_cleat', 3, 6, 'r3a_bt_cleat'),
    t('r3a_tea_kit', 4, 10, 'r3a_bt_tea'),
    t('r3a_slate', 6, 17, 'r3a_bt_slate'),
    t('r3a_thermos', 5, 15, 'r3a_bt_flask'),
    t('r3a_rope_hank', 9, 10, 'r3a_bt_rope'),
    t('r2r_window', 3, 2, 'r3a_bt_slit1'),
    t('r2r_window', 8, 2, 'r3a_bt_slit2'),
    t('r3a_geranium', 5, 13, 'r3a_bt_geranium'),
  ],
  rest_house_marta: [
    t('r3a_loom', 2, 2, 'r3a_ma_loom'),
    t('r3a_wheel', 10, 4, 'r3a_ma_wheel'),
    t('r3a_knit_basket', 2, 6, 'r3a_ma_basket'),
    t('r2r_window', 10, 2, 'r3a_ma_window'),
    t('r3a_wool_balls', 8, 6, 'r3a_ma_balls', { flat: true }),
  ],
  rest_house_pottle: [
    t('r3a_buns', 12, 3, 'r3a_po_buns'),
    t('r3a_flour', 1, 4, 'r3a_po_flour'),
    t('r3a_birdcage', 12, 5, 'r3a_po_bird'),
    t('r3a_geranium', 1, 2, 'r3a_po_geranium'),
    t('r2r_window', 11, 2, 'r3a_po_window'),
    t('r3a_scales', 7, 4, 'r3a_po_scales'),
    t('r3a_slate', 12, 7, 'r3a_po_slate'),
  ],
  rest_chapel: [
    t('r3a_donations', 1, 13, 'r3a_ch_box'),
    t('r3a_wish_bowl', 13, 3, 'r3a_ch_bowl'),
    t('in_book_pile', 13, 14, 'r3a_ch_hymnals'),
    t('r3a_geranium', 1, 3, 'r3a_ch_geranium'),
    f('r3a_kneeler', 3, 14), f('r3a_kneeler', 11, 14),
    t('r3a_kneeler', 5, 13, 'r3a_ch_kneeler', { flat: true }),
  ],
};
