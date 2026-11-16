// The life pass for chapter 3's Old Drains and Lantern Marsh (15 November 2026): the extra things to look at
// and press Z on, per room (spread into each room's props). Every one is walkable (bodiless), so none of them
// can block a current, a push, a bog hop, a carry or a cutscene walk. Their words are the `r3m_*` sections at
// the end of text/interactions/drains.txt and marsh.txt. GENERATED from a spec: edit the spec, not this.
export const R3M_PROPS = {
  drains_cistern: [
    { sprite: 'r3m_g_sweet', x: 7, y: 1, text: 'r3m_cistern_1', walkable: true },
    { sprite: 'r3m_pipe', x: 20, y: 1, text: 'r3m_cistern_2' },
  ],
  drains_culvert: [
    { sprite: 'r3m_bricks', x: 1, y: 3, text: 'r3m_culvert_2', walkable: true },
    { sprite: 'r3m_sieve', x: 3, y: 9, text: 'r3m_culvert_3', walkable: true },
  ],
  drains_gratings: [
    { sprite: 'r3m_g_tea', x: 6, y: 2, text: 'r3m_gratings_1' },
    { sprite: 'r3m_beetle_tin', x: 3, y: 9, text: 'r3m_gratings_5', walkable: true },
  ],
  drains_ladle: [
    { sprite: 'r3m_shelf', x: 17, y: 5, walkable: true, npc: 'r3m_shelf', quest: [{ needs: ['has:lost_boot'], take: 'lost_boot', set: ['q_shelf_done'], give: 'ladles_tag', text: 'shelf_done' }, { needs: ['q_shelf_done'], text: 'shelf_after' }, { needs: ['q_shelf_asked'], text: 'shelf_wait' }, { needs: ['!q_shelf_asked'], set: 'q_shelf_asked', text: 'shelf_ask' }] },
    { sprite: 'r3m_saucer', x: 18, y: 9, text: 'r3m_ladle_1', walkable: true },
    { sprite: 'r3m_g_sweet', x: 5, y: 1, text: 'r3m_ladle_4', walkable: true },
  ],
  drains_sumps: [
    { sprite: 'r3m_g_count', x: 3, y: 1, text: 'r3m_sumps_1' },
    { sprite: 'r3m_boot', x: 13, y: 11, text: 'r3m_sumps_boot', walkable: true, gives: 'lost_boot', react: true, taken: { gone: true } },
    { sprite: 'r3m_beetle_tin', x: 4, y: 10, text: 'r3m_sumps_6', walkable: true },
  ],
  drains_conduit: [
    { sprite: 'r3m_g_head', x: 14, y: 1, text: 'r3m_conduit_1' },
    { sprite: 'r3m_g_mab', x: 20, y: 1, text: 'r3m_conduit_2' },
  ],
  drains_vault: [
    { sprite: 'r3m_g_walt', x: 5, y: 5, text: 'r3m_vault_1' },
    { sprite: 'r3m_mug', x: 10, y: 4, text: 'r3m_vault_2', walkable: true },
  ],
  drains_weir: [
    { sprite: 'r3m_g_walt', x: 5, y: 1, text: 'r3m_weir_1' },
  ],
  drains_stair: [
    { sprite: 'r3m_g_down', x: 5, y: 7, text: 'r3m_stair_1' },
    { sprite: 'r3m_g_face', x: 11, y: 7, text: 'r3m_stair_3' },
    { sprite: 'r3m_rat_nest', x: 24, y: 11, text: 'r3m_stair_larder', walkable: true, gold: 20, taken: { text: 'r3m_stair_larder_after' } },
  ],
  drains_outfall: [
    { sprite: 'r3m_g_walt', x: 4, y: 1, text: 'r3m_outfall_1' },
    { sprite: 'r3m_bricks', x: 6, y: 11, text: 'r3m_outfall_4', walkable: true },
  ],
  marsh_falls_foot: [
    { sprite: 'r3m_wheel', x: 11, y: 12, text: 'r3m_falls_foot_2', walkable: true },
    { sprite: 'r3m_post', x: 3, y: 8, text: 'r3m_falls_foot_3' },
  ],
  marsh_lantern_path: [
  ],
  marsh_rushes: [
    { sprite: 'r3m_boot_mud', x: 2, y: 6, text: 'r3m_rushes_2', walkable: true },
    { sprite: 'r3m_milestone', x: 6, y: 2, text: 'r3m_rushes_3' },
    { sprite: 'r3m_egg', x: 2, y: 12, walkable: true, text: 'r3m_egg_found', gives: 'moorhen_egg', react: true, taken: { gone: true } },
    { sprite: 'r3m_nest', x: 23, y: 4, walkable: true, npc: 'r3m_nest', quest: [{ needs: ['has:moorhen_egg'], take: 'moorhen_egg', set: ['q_nest_done'], give: 'moorhen_feather', text: 'nest_done' }, { needs: ['q_nest_done'], text: 'nest_after' }, { needs: ['q_nest_asked'], text: 'nest_wait' }, { needs: ['!q_nest_asked'], set: 'q_nest_asked', text: 'nest_ask' }] },
  ],
  marsh_sunken_road: [
  ],
  marsh_hut_island: [
    { sprite: 'r3m_washline', x: 13, y: 9, text: 'r3m_hut_island_1' },
    { sprite: 'r3m_hat_pole', x: 16, y: 7, text: 'r3m_hut_island_2' },
    { sprite: 'r3m_eel_trap', x: 18, y: 9, text: 'r3m_hut_island_4' },
    { sprite: 'r3m_strips_bundle', x: 18, y: 11, text: 'r3m_island_purse', walkable: true, gold: 25, taken: { text: 'r3m_island_purse_after' } },
  ],
  marsh_hut: [
    { sprite: 'r3m_herbs', x: 3, y: 2, text: 'r3m_hut_1' },
    { sprite: 'r3m_rack', x: 11, y: 2, text: 'r3m_hut_3' },
  ],
  marsh_tollhouse: [
    { sprite: 'r3m_bell_post', x: 7, y: 4, text: 'r3m_tollhouse_1' },
    { sprite: 'r3m_slate', x: 2, y: 1, text: 'r3m_tollhouse_2' },
  ],
  marsh_jetty: [
  ],
  marsh_wisp_hollow: [
    { sprite: 'r3m_bones', x: 29, y: 9, text: 'r3m_wisp_hollow_2', walkable: true },
  ],
  marsh_heron_flats: [
    { sprite: 'r3m_bones', x: 23, y: 4, text: 'r3m_heron_flats_5', walkable: true },
  ],
  marsh_watergate: [
    { sprite: 'r3m_column', x: 22, y: 3, text: 'r3m_watergate_1' },
    { sprite: 'r3m_head', x: 25, y: 5, text: 'r3m_watergate_2' },
  ],
  marsh_far_shore: [
    { sprite: 'r3m_milestone', x: 22, y: 11, text: 'r3m_far_shore_1' },
    { sprite: 'r3m_head', x: 23, y: 3, text: 'r3m_far_shore_2' },
    { sprite: 'r3m_column', x: 7, y: 4, text: 'r3m_far_shore_3' },
    { sprite: 'r3m_basket', x: 25, y: 1, text: 'r3m_far_shore_picnic', gives: 'bulrush_bread', react: true, taken: { text: 'r3m_far_shore_after' } },
  ],
  marsh_clerks_islet: [
    { sprite: 'r3m_basket', x: 16, y: 3, text: 'r3m_clerks_islet_2' },
  ],
};
