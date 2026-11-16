// The ghost ship's life pass (round 2, 15 November 2026): the crew's belongings and the sea getting in, per room.
// Spread into each ship room's props. Every one is bodiless (`walkable`) except the one purse in its corner, so none can
// block a route, a lean, a push, a gust or a cutscene walk. Words: the `r5g_*` sections at the end of
// text/interactions/ghostship.txt; sprites: src/data/art/shipLife.js.
export const SHIP_LIFE_PROPS = {
  ship_plank: [
    { sprite: 'r5g_noughts', x: 3, y: 10, text: 'r5g_pl_noughts', walkable: true, flat: true },
  ],
  ship_deck: [
    { sprite: 'r5g_cage', x: 14, y: 6, text: 'r5g_dk_cage', animation: 'r5g_cage', speed: 0.6 },
    { sprite: 'r5g_mug', x: 6, y: 13, text: 'r5g_dk_mug', walkable: true },
  ],
  ship_quarters: [
    { sprite: 'r5g_hammock', x: 13, y: 9, npc: 'r5g_billy_hammock', walkable: true, animation: 'r5g_hammock', speed: 0.5, quest: [{ needs: ['has:r5g_whale'], take: 'r5g_whale', set: ['q_r5g_billy_asked', 'q_r5g_billy_done'], give: 'r5g_shaving', text: 'whale_done' }, { needs: ['q_r5g_billy_done'], text: 'whale_after' }, { needs: ['!q_r5g_billy_asked'], set: 'q_r5g_billy_asked', text: 'whale_ask', append: true }] },
    { sprite: 'r5g_fiddle', x: 5, y: 9, text: 'r5g_qr_fiddle' },
    { sprite: 'r5g_mug', x: 18, y: 10, text: 'r5g_qr_mugs', walkable: true },
    { sprite: 'gold_pouch', x: 1, y: 12, text: 'r5g_qr_hoard', gold: 25, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  ship_gundeck: [
    { sprite: 'r5g_toy', x: 8, y: 10, text: 'r5g_gd_toy', walkable: true, react: true, gives: 'r5g_whale', taken: { text: 'r5g_gd_toy_gone' } },
    { sprite: 'r5g_bucket', x: 21, y: 10, text: 'r5g_gd_bucket', animation: 'r5g_bucket', speed: 0.35 },
    { sprite: 'r5g_noughts', x: 26, y: 9, text: 'r5g_gd_noughts', walkable: true, flat: true },
  ],
  ship_hold: [
    { sprite: 'r5g_mug', x: 6, y: 14, text: 'r5g_hd_mug', walkable: true },
    { sprite: 'r5g_unsent', x: 13, y: 14, text: 'r5g_hd_letter', walkable: true, flat: true },
  ],
  ship_bilge: [
    { sprite: 'r5g_bottle', x: 21, y: 11, text: 'r5g_bg_bottle', walkable: true },
    { sprite: 'r5g_bucket', x: 6, y: 8, text: 'r5g_bg_bucket', animation: 'r5g_bucket', speed: 0.35 },
  ],
  ship_rigging: [
    { sprite: 'r5g_mug', x: 11, y: 1, text: 'r5g_rg_mug', walkable: true },
  ],
  ship_cabin: [
    { sprite: 'r5g_mug', x: 14, y: 9, text: 'r5g_cb_mug', walkable: true },
    { sprite: 'r5g_cage', x: 21, y: 4, text: 'r5g_cb_cage', animation: 'r5g_cage', speed: 0.6 },
  ],
  ship_orlop: [
    { sprite: 'r5g_knots', x: 23, y: 4, text: 'r5g_or_knots' },
    { sprite: 'r5g_mug', x: 6, y: 8, text: 'r5g_or_mug', walkable: true },
    { sprite: 'r5g_weed', x: 26, y: 4, text: 'r5g_or_weed', animation: 'r5g_weed', speed: 0.55 },
  ],
  ship_sail_locker: [
    { sprite: 'r5g_mug', x: 14, y: 7, text: 'r5g_sl_mug', walkable: true },
    { sprite: 'r5g_fiddle', x: 24, y: 10, text: 'r5g_sl_fiddle' },
    { sprite: 'r5g_unsent', x: 27, y: 5, text: 'r5g_sl_letter', walkable: true, flat: true },
  ],
  ship_flooded_bow: [
    { sprite: 'r5g_mug', x: 9, y: 11, text: 'r5g_fb_mug', walkable: true },
  ],
  ship_figurehead_perch: [
    { sprite: 'r5g_mug', x: 6, y: 10, text: 'r5g_fp_mug', walkable: true },
  ],
};
