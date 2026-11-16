// The life pass for the Pinefall and Hollin (15 November 2026): the extra things to look at and press Z on, per
// room (spread into each room's props). Every one is bodiless (`walkable`) except the cradle and the nest stump, whose
// owners talk, and one great trunk in a corner of the Brook. Their words are the `r3p_*` sections at the end of
// text/interactions/pinefall.txt and hushwood.txt.
export const R3P_PROPS = {
  pinefall_landing: [
    { sprite: 'r3p_web_bush', x: 6, y: 2, text: 'r3p_web_bush_0' },
    { sprite: 'r3p_hollow_log', x: 20, y: 4, text: 'r3p_hollow_log_0' },
    { sprite: 'r3p_stump_big', x: 15, y: 7, text: 'r3p_stump_big_0' },
  ],
  pinefall_bramble_gate: [
    { sprite: 'r3p_web_bush', x: 10, y: 5, text: 'r3p_web_bush_0' },
    { sprite: 'r3p_nut_stump', x: 22, y: 1, text: 'r3p_nut_stump_0' },
    { sprite: 'r3p_stump_big', x: 7, y: 10, text: 'r3p_stump_big_0' },
  ],
  pinefall_deadfall: [
    { sprite: 'r3p_nest_ground', x: 21, y: 5, text: 'r3p_nest_found', walkable: true, gives: 'fallen_nest', taken: { gone: true }, react: true },
    { sprite: 'r3p_web_bush', x: 27, y: 10, text: 'r3p_web_bush_0' },
    { sprite: 'r3p_nut_stump', x: 18, y: 8, text: 'r3p_nut_stump_0' },
  ],
  pinefall_tumbled: [
    { sprite: 'r3p_sign_shroom', x: 6, y: 3, text: 'r3p_sign_shroom' },
    { sprite: 'r3p_bracket_stump', x: 19, y: 10, text: 'r3p_bracket_stump_1' },
    { sprite: 'r3p_antler', x: 2, y: 2, text: 'r3p_antler_0', walkable: true },
    { sprite: 'r3p_old_boot', x: 14, y: 3, text: 'r3p_old_boot_0', walkable: true },
  ],
  pinefall_brook: [
    { sprite: 'r3p_nest_empty', x: 24, y: 11, npc: 'r3p_nest_stump', quest: [{ needs: ['has:fallen_nest'], take: 'fallen_nest', set: ['q_r3p_nest_done'], give: 'robins_feather', text: 'nest_done' }, { needs: ['q_r3p_nest_done'], text: 'nest_after' }, { needs: ['q_r3p_nest_asked'], text: 'nest_wait' }, { needs: ['!q_r3p_nest_asked'], set: 'q_r3p_nest_asked', text: 'nest_ask' }] },
    { sprite: 'gold_pouch', x: 27, y: 17, text: 'r3p_brook_pouch', walkable: true, gold: 25, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'r3p_nut_stump', x: 28, y: 17, text: 'r3p_nut_cache', walkable: true, gives: 'pine_nut_brittle', taken: { text: 'r3p_nut_cache_empty' } },
    { sprite: 'r3p_hollow_log', x: 19, y: 14, text: 'r3p_hollow_log_0' },
    { sprite: 'r3p_fairy_ring', x: 5, y: 2, text: 'r3p_fairy_ring_0', flat: true },
    { sprite: 'r3p_axe_stump', x: 9, y: 16, text: 'r3p_axe_stump_0' },
  ],
  pinefall_camp: [
    { sprite: 'r3p_bracket_stump', x: 1, y: 3, text: 'r3p_bracket_stump_0' },
    { sprite: 'r3p_nut_stump', x: 26, y: 1, text: 'r3p_nut_stump_0' },
    { sprite: 'r3p_stump_big', x: 5, y: 16, text: 'r3p_stump_big_0' },
  ],
  pinefall_rolling: [
    { sprite: 'r3p_web_bush', x: 2, y: 6, text: 'r3p_web_bush_0' },
    { sprite: 'r3p_nut_stump', x: 13, y: 2, text: 'r3p_nut_stump_0' },
    { sprite: 'r3p_boulder', x: 20, y: 13, text: 'r3p_boulder_0' },
  ],
  pinefall_maze: [
    { sprite: 'r3p_cairn', x: 33, y: 1, text: 'r3p_maze_gift' },
    { sprite: 'r3p_red_shrub', x: 15, y: 10, text: 'r3p_red_shrub_0' },
  ],
  pinefall_tatters: [
    { sprite: 'r3p_web_bush', x: 20, y: 13, text: 'r3p_web_bush_0' },
    { sprite: 'r3p_nut_stump', x: 2, y: 4, text: 'r3p_nut_stump_0' },
    { sprite: 'r3p_hollow_log', x: 11, y: 14, text: 'r3p_hollow_log_1' },
    { sprite: 'r3p_rope_coil', x: 21, y: 13, text: 'r3p_rope_coil_0', walkable: true },
  ],
  pinefall_quarry: [
    { sprite: 'r3p_face_stump', x: 19, y: 13, text: 'r3p_face_stump' },
    { sprite: 'r3p_web_bush', x: 2, y: 2, text: 'r3p_web_bush_0' },
    { sprite: 'r3p_boulder', x: 19, y: 7, text: 'r3p_boulder_0' },
  ],
  pinefall_ravine: [
    { sprite: 'r3p_nut_stump', x: 2, y: 1, text: 'r3p_nut_stump_0' },
    { sprite: 'r3p_hollow_log', x: 2, y: 11, text: 'r3p_hollow_log_0' },
    { sprite: 'r3p_stump_big', x: 9, y: 30, text: 'r3p_stump_big_0' },
  ],
  hollin_gate: [
    { sprite: 'r3p_doll', x: 22, y: 17, text: 'r3p_doll_found', walkable: true, gives: 'hollin_doll', taken: { gone: true }, react: true },
    { sprite: 'r3p_kennel', x: 1, y: 4, text: 'r3p_kennel' },
    { sprite: 'r3p_cradle', x: 25, y: 5, npc: 'r3p_cradle', quest: [{ needs: ['has:hollin_doll'], take: 'hollin_doll', set: ['q_r3p_doll_done'], give: 'hollin_rattle', text: 'cradle_done' }, { needs: ['q_r3p_doll_done'], text: 'cradle_after' }, { needs: ['q_r3p_doll_asked'], text: 'cradle_wait' }, { needs: ['!q_r3p_doll_asked'], set: 'q_r3p_doll_asked', text: 'cradle_ask' }] },
    { sprite: 'r3p_swing', x: 24, y: 12, text: 'r3p_swing_special', animation: 'r3p_swing', speed: 0.5 },
    { sprite: 'r3p_marble_tin', x: 30, y: 2, text: 'r3p_den_tin', walkable: true, gives: 'hollin_marbles', taken: { text: 'r3p_den_tin_empty' } },
    { sprite: 'r3p_sweet_jar', x: 28, y: 1, text: 'r3p_den_jar', walkable: true, gives: 'hollin_humbugs', taken: { text: 'r3p_den_jar_empty' } },
    { sprite: 'r3p_web_bush', x: 11, y: 3, text: 'r3p_web_bush_0' },
  ],
  hollin_lane: [
    { sprite: 'r3p_watering_can', x: 8, y: 7, text: 'r3p_watering_can', walkable: true },
  ],
  hollin_mill: [
    { sprite: 'r3p_grindstone', x: 1, y: 8, text: 'r3p_grindstone_0' },
    { sprite: 'r3p_eel_trap', x: 29, y: 8, text: 'r3p_eel_trap_0' },
  ],
  hollin_well: [
  ],
  hollin_stores: [
    { sprite: 'r3p_cheese', x: 10, y: 5, text: 'r3p_cheese_0', walkable: true },
  ],
  hollin_backroom: [
  ],
  hollin_lookout: [
    { sprite: 'r3p_horn', x: 11, y: 6, text: 'r3p_horn_0', walkable: true },
    { sprite: 'r3p_stools', x: 5, y: 5, text: 'r3p_stools_0' },
  ],
  hollin_well_bottom: [
  ],
};
