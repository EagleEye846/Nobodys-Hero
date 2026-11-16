// The life pass on Mount Vigil (2026-11-15): the extra things to look at and press Z on, and the dressing, per room
// (spread into each vigil_* room's props). Written to be bodiless: every one is walkable, so none can block a ring,
// a jump-up block, a gust, a swing, a carry or a cutscene walk; they keep clear of all of those on purpose, and
// of save points, chests, doors and the monsters' starting tiles. Their words are the `r2v_*` sections at the end of
// each room's text file. (Generated once from the room maps, then kept by hand.)
export const VIGIL_PROPS = {
  vigil_ridge: [
    { sprite: 'r2v_pole_flags', x: 9, y: 9, text: 'r2v_ridge_flags', animation: 'r2v_pole_flags', speed: 0.22 },
    { sprite: 'r2v_offering_bowl', x: 19, y: 30, text: 'r2v_ridge_bowl', walkable: true },
    { sprite: 'r2v_name_stone', x: 17, y: 9, text: 'r2v_ridge_names' },
  ],
  vigil_hollow: [
    { sprite: 'r2v_offering_cairn', x: 34, y: 26, text: 'r2v_hollow_apple' },
    { sprite: 'r2v_chime_post', x: 24, y: 28, text: 'r2v_hollow_chimes', animation: 'r2v_chime_post', speed: 0.45 },
    { sprite: 'r2v_prayer_wheel', x: 20, y: 26, text: 'r2v_hollow_wheel', animation: 'r2v_prayer_wheel', speed: 0.4 },
  ],
  vigil_spiral: [
    { sprite: 'r2v_name_stone', x: 20, y: 12, text: 'r2v_spiral_names' },
    { sprite: 'r2v_hat_stake', x: 37, y: 26, text: 'r2v_spiral_hat' },
    { sprite: 'r2v_offering_bowl', x: 43, y: 16, text: 'r2v_spiral_bowl', walkable: true },
  ],
  vigil_shoulder: [
    { sprite: 'r2v_snowbunny', x: 35, y: 29, text: 'r2v_shoulder_bunny', walkable: true },
    { sprite: 'r2v_hat_stake', x: 33, y: 19, text: 'r2v_shoulder_hat' },
    { sprite: 'r2v_prayer_wheel', x: 4, y: 29, text: 'r2v_shoulder_wheel', animation: 'r2v_prayer_wheel', speed: 0.4 },
  ],
  vigil_ice_face: [
    { sprite: 'r2v_pole_flags', x: 24, y: 30, text: 'r2v_ice_face_flags', animation: 'r2v_pole_flags', speed: 0.22 },
    { sprite: 'r2v_teapot', x: 28, y: 22, text: 'r2v_ice_face_teapot' },
    { sprite: 'r2v_tiny_cairn', x: 29, y: 12, text: 'r2v_ice_face_tiny', walkable: true },
  ],
  vigil_knife_edge: [
    { sprite: 'r2v_hat_stake', x: 34, y: 14, text: 'r2v_knife_edge_hat' },
    { sprite: 'r2v_offering_bowl', x: 30, y: 10, text: 'r2v_knife_edge_bowl', walkable: true },
    { sprite: 'r2v_name_stone', x: 14, y: 24, text: 'r2v_knife_edge_names' },
  ],
  vigil_cloud_walk: [
    { sprite: 'r2v_hat_stake', x: 10, y: 30, text: 'r2v_cloud_walk_hat' },
    { sprite: 'r2v_offering_bowl', x: 20, y: 30, text: 'r2v_cloud_walk_bowl', walkable: true },
    { sprite: 'r2v_chime_post', x: 33, y: 31, text: 'r2v_cloud_walk_chimes', animation: 'r2v_chime_post', speed: 0.45 },
    { sprite: 'r2v_stoat_den', x: 2, y: 30, text: 'r2v_cloud_walk_hoard', gives: 'stoat_shinies', taken: { text: 'r2v_cloud_walk_hoard_gone' }, walkable: true },
  ],
  vigil_second_cairn: [
    { sprite: 'r2v_offering_cairn', x: 20, y: 2, text: 'r2v_second_cairn_apple' },
    { sprite: 'r2v_name_stone', x: 8, y: 3, text: 'r2v_second_cairn_names' },
  ],
  vigil_cloud_bank: [
    { sprite: 'r2v_fishing_hole', x: 28, y: 18, text: 'r2v_cloud_bank_hole', walkable: true },
    { sprite: 'r2v_offering_bowl', x: 12, y: 20, text: 'r2v_cloud_bank_bowl', walkable: true },
    { sprite: 'r2v_chime_post', x: 3, y: 13, text: 'r2v_cloud_bank_chimes', animation: 'r2v_chime_post', speed: 0.45 },
  ],
  vigil_high_shelf: [
    { sprite: 'r2v_pole_flags', x: 25, y: 7, text: 'r2v_high_shelf_flags', animation: 'r2v_pole_flags', speed: 0.22 },
    { sprite: 'r2v_name_stone', x: 8, y: 10, text: 'r2v_high_shelf_names' },
    { sprite: 'r2v_snowshoes', x: 28, y: 9, text: 'r2v_high_shelf_shoes', walkable: true },
  ],
  vigil_broken_span: [
    { sprite: 'r2v_offering_bowl', x: 16, y: 28, text: 'r2v_broken_span_bowl', walkable: true },
    { sprite: 'r2v_chime_post', x: 6, y: 3, text: 'r2v_broken_span_chimes', animation: 'r2v_chime_post', speed: 0.45 },
    { sprite: 'r2v_name_stone', x: 11, y: 24, text: 'r2v_broken_span_names' },
    { sprite: 'old_pack', x: 24, y: 18, text: 'r2v_broken_span_stash', gives: 'fanfare_fudge', taken: { text: 'r2v_broken_span_stash_gone' } },
  ],
  vigil_wind_stair: [
    { sprite: 'r2v_chime_post', x: 13, y: 26, text: 'r2v_wind_stair_chimes', animation: 'r2v_chime_post', speed: 0.45 },
    { sprite: 'r2v_offering_cairn', x: 36, y: 26, text: 'r2v_wind_stair_apple' },
    { sprite: 'r2v_wind_post', x: 3, y: 15, text: 'r2v_wind_stair_post' },
    { sprite: 'r2v_flag_rag', x: 15, y: 25, text: 'r2v_wind_stair_rag', gives: 'r2v_flag_rag', taken: { text: 'r2v_wind_stair_rag_gone' }, walkable: true },
  ],
  vigil_lamplighters_ledge: [
    { sprite: 'r2v_offering_bowl', x: 15, y: 9, text: 'r2v_lamplighters_ledge_bowl', walkable: true },
    { sprite: 'r2v_chime_post', x: 19, y: 16, text: 'r2v_lamplighters_ledge_chimes', animation: 'r2v_chime_post', speed: 0.45 },
    { sprite: 'r2v_name_stone', x: 22, y: 3, text: 'r2v_lamplighters_ledge_names' },
    { sprite: 'r2v_pole_rag', x: 21, y: 7, npc: 'r2v_bare_pole', quest: [{ needs: ['has:r2v_flag_rag'], take: 'r2v_flag_rag', set: ['q_vflag_asked', 'q_vflag_done'], give: 'r2v_pilgrim_ribbon', text: 'flag_done' }, { needs: ['q_vflag_done'], text: 'flag_after' }, { needs: ['!q_vflag_asked'], set: 'q_vflag_asked', text: 'flag_ask', append: true }], animation: 'r2v_pole_rag', speed: 0.24, walkable: true },
  ],
  vigil_gale_face: [
    { sprite: 'r2v_offering_bowl', x: 22, y: 50, text: 'r2v_gale_face_bowl', walkable: true },
    { sprite: 'r2v_chime_post', x: 30, y: 52, text: 'r2v_gale_face_chimes', animation: 'r2v_chime_post', speed: 0.45 },
    { sprite: 'r2v_frozen_shirt', x: 38, y: 37, text: 'r2v_gale_face_shirt' },
  ],
  vigil_weathervanes: [
    { sprite: 'r2v_chime_post', x: 5, y: 17, text: 'r2v_weathervanes_chimes', animation: 'r2v_chime_post', speed: 0.45 },
    { sprite: 'r2v_offering_bowl', x: 24, y: 19, text: 'r2v_weathervanes_bowl', walkable: true },
    { sprite: 'r2v_prayer_wheel', x: 7, y: 9, text: 'r2v_weathervanes_wheel', animation: 'r2v_prayer_wheel', speed: 0.4 },
  ],
  vigil_vane_gardens: [
    { sprite: 'r2v_chime_post', x: 3, y: 21, text: 'r2v_vane_gardens_chimes', animation: 'r2v_chime_post', speed: 0.45 },
    { sprite: 'r2v_offering_cairn', x: 9, y: 16, text: 'r2v_vane_gardens_apple' },
    { sprite: 'r2v_name_stone', x: 27, y: 13, text: 'r2v_vane_gardens_names' },
  ],
  vigil_spire_neck: [
    { sprite: 'r2v_offering_bowl', x: 8, y: 36, text: 'r2v_spire_neck_bowl', walkable: true },
    { sprite: 'r2v_frozen_shirt', x: 34, y: 36, text: 'r2v_spire_neck_shirt' },
    { sprite: 'r2v_name_stone', x: 28, y: 19, text: 'r2v_spire_neck_names' },
  ],
  vigil_owl_shelf: [
    { sprite: 'r2v_name_stone', x: 4, y: 5, text: 'r2v_owl_shelf_names' },
    { sprite: 'r2v_offering_bowl', x: 16, y: 7, text: 'r2v_owl_shelf_bowl', walkable: true },
    { sprite: 'r2v_snowbunny', x: 24, y: 3, text: 'r2v_owl_shelf_bunny', walkable: true },
  ],
  vigil_summit: [
    { sprite: 'r2v_tiny_cairn', x: 27, y: 11, text: 'r2v_summit_tiny', walkable: true },
    { sprite: 'r2v_candle_jar', x: 8, y: 14, text: 'r2v_summit_candle', walkable: true },
  ],
  vigil_ice_chimney: [
    { sprite: 'r2v_candle_jar', x: 19, y: 24, text: 'r2v_ice_chimney_candle', walkable: true },
    { sprite: 'r2v_flask', x: 3, y: 25, text: 'r2v_ice_chimney_flask', walkable: true },
    { sprite: 'r2v_name_stone', x: 3, y: 12, text: 'r2v_ice_chimney_names' },
  ],
  vigil_lamplighters_hut: [
    { sprite: 'r2v_snowshoes', x: 10, y: 3, text: 'r2v_lamplighters_hut_shoes', walkable: true },
  ],
};
