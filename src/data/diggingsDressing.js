// The Diggings' set dressing (the life pass, 14 November 2026): the things the miners left lying about,
// room by room. Every one is `walkable` (drawn and readable, but with no body) except the few pickups,
// which stand in dead-end nooks; so none of them can stand in the way of a cart, a push, a climb, a
// beam or a cutscene walk. The room files add their own list at the start of their props. The words
// are in text/interactions/diggings.txt (the LIFE PASS block).
export const DIGGINGS_DRESSING = {
  diggings_pithead: [
    { sprite: 'dg_rota_board', x: 1, y: 3, text: 'dgp_rota' },
    { sprite: 'dg_tin_mug', x: 21, y: 5, walkable: true, text: 'dgp_mug' },
    { sprite: 'dg_boots', x: 10, y: 3, walkable: true, text: 'dgp_boots' },
  ],
  diggings_cart_yard: [
  ],
  diggings_trestle: [
    { sprite: 'dg_boots', x: 4, y: 9, walkable: true, text: 'dgt_boots' },
  ],
  diggings_switchback: [
    { sprite: 'dg_prop_lean', x: 30, y: 2, text: 'dgs_lean' },
    { sprite: 'gold_pouch', x: 3, y: 15, text: 'dgs_nook_pouch', gives: 'dgs_nap_biscuit', taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  diggings_old_seam: [
  ],
  diggings_flooded_drift: [
    { sprite: 'dg_boot', x: 3, y: 14, text: 'dgf_boot', gives: 'mattock_boot', taken: { sprite: 'floor_pebbles', text: 'dgf_boot_gone' }, react: true },
  ],
  diggings_cave_in: [
    { sprite: 'dg_grit', x: 7, y: 5, walkable: true, flat: true, text: 'dgc_grit' },
    { sprite: 'gold_pouch', x: 4, y: 15, text: 'dgc_nook_pouch', gives: 'dgc_crumb_cake', taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  diggings_lift: [
    { sprite: 'dg_fossil', x: 4, y: 2, walkable: true, text: 'dgl_fossil' },
  ],
  diggings_lost_seam: [
    { sprite: 'dg_broken_cart', x: 20, y: 8, text: 'dgz_wreck' },
  ],
  diggings_air_shaft: [
    { sprite: 'dg_boots', x: 4, y: 29, walkable: true, text: 'dga_boots' },
    { sprite: 'dg_prop_stub', x: 13, y: 28, walkable: true, text: 'dga_stub' },
  ],
  diggings_star_camp: [
    { sprite: 'dg_pale_dish', x: 17, y: 10, walkable: true, flat: true, text: 'dgk_dish' },
    { sprite: 'dg_boots', x: 7, y: 6, walkable: true, text: 'dgk_boots' },
  ],
  diggings_star_siding: [
  ],
  diggings_star_scorch: [
    { sprite: 'dg_boots', x: 2, y: 6, walkable: true, text: 'dgh_boots' },
  ],
  diggings_star_spill: [
  ],
  diggings_star_gallery: [
    { sprite: 'dg_tin_mug', x: 8, y: 9, walkable: true, text: 'dgg_mug' },
  ],
  diggings_star_glass: [
    { sprite: 'dg_boots', x: 2, y: 6, walkable: true, text: 'dgl2_boots' },
    { sprite: 'dg_tin_mug', x: 9, y: 8, walkable: true, text: 'dgl2_mug' },
  ],
  diggings_star_pool: [
  ],
};
