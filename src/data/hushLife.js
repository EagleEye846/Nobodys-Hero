// The life pass, round 2 (15 November 2026): the Hushwood's extra things to look at and press Z on, per
// room (spread into each room's props). Every one is bodiless (`walkable`), so nothing here can block a
// log, a treadle, a push, a swing, a carry or a walk; each stands off the doors, the cutscene strips, the
// save point, the monsters' paths and every old prop, and none sits straight south of a pokeable. Their
// words are the `r3h_*` sections at the end of text/interactions/hushwood.txt. Where the glowing fungus,
// and the sleeping toadstools, stand is listed below too, for the touches (src/overworld/hushLife.js).
export const HUSH_LIFE_PROPS = {
  hush_mist_edge: [
    { sprite: 'r3h_clawed', x: 26, y: 5, text: 'r3h_me_claws' },
    { sprite: 'r3h_fur', x: 8, y: 13, text: 'r3h_me_fur', walkable: true },
  ],
  hush_felled_run: [
    { sprite: 'r3h_teatin', x: 17, y: 4, text: 'r3h_fr_teatin', gives: 'lp3h_tea_tin', taken: { sprite: 'r3h_stump', text: 'r3h_fr_teatin_gone' }, walkable: true },
    { sprite: 'r3h_lunchtin', x: 24, y: 5, text: 'r3h_fr_lunch', walkable: true },
    { sprite: 'r3h_coat', x: 6, y: 8, text: 'r3h_fr_coat' },
  ],
  hush_hollow_oak: [
    { sprite: 'r3h_fur', x: 12, y: 15, text: 'r3h_ho_fur', walkable: true },
    { sprite: 'r3h_hollowlog', x: 24, y: 5, text: 'r3h_ho_log' },
  ],
  hush_kid_gap: [
    { sprite: 'r3h_sword', x: 25, y: 7, text: 'r3h_kg_sword' },
  ],
  hush_leaning_pines: [
    { sprite: 'r3h_logpile', x: 20, y: 2, text: 'r3h_lp_logs' },
    { sprite: 'r3h_sawhorse', x: 16, y: 8, text: 'r3h_lp_horse' },
    { sprite: 'r3h_bucket', x: 24, y: 9, text: 'r3h_lp_bucket' },
    { sprite: 'r3h_acorns', x: 1, y: 16, text: 'r3h_lp_larder', gives: 'lp3h_acorn', taken: { sprite: 'r3h_acorns', text: 'r3h_lp_larder_gone' }, walkable: true, flat: true },
  ],
  hush_treadles: [
    { sprite: 'r3h_fort', x: 25, y: 16, text: 'r3h_tr_fort' },
    { sprite: 'r3h_boots', x: 6, y: 17, text: 'r3h_tr_boots', walkable: true },
    { sprite: 'r3h_coat', x: 2, y: 7, text: 'r3h_tr_coat' },
  ],
  hush_kiln: [
    { sprite: 'r3h_teashelf', x: 11, y: 5, npc: 'lp3h_teashelf', quest: [{ needs: ['has:lp3h_tea_tin'], take: 'lp3h_tea_tin', set: ['q_cinder_tea_asked', 'q_cinder_tea_done'], give: 'lp3h_charcoal', text: 'tea_done' }, { needs: ['q_cinder_tea_done'], text: 'tea_after' }, { needs: ['!q_cinder_tea_asked'], set: 'q_cinder_tea_asked', text: 'tea_ask', append: true }] },
    { sprite: 'r3h_coat', x: 3, y: 10, text: 'r3h_ki_coat' },
    { sprite: 'r3h_bucket', x: 20, y: 15, text: 'r3h_ki_bucket' },
  ],
  hush_underroot: [
    { sprite: 'r3h_fur', x: 19, y: 5, text: 'r3h_ur_fur', walkable: true },
  ],
  hush_gorge: [
  ],
  hush_rummage: [
    { sprite: 'r3h_skis', x: 14, y: 3, text: 'r3h_ru_skis' },
  ],
  hush_sawpit: [
    { sprite: 'r3h_grindstone', x: 28, y: 4, text: 'r3h_sp_stone' },
  ],
  hush_notched: [
  ],
  hush_sprung_trap: [
  ],
  hush_windfall: [
    { sprite: 'r3h_bracket', x: 21, y: 19, text: 'r3h_wf_bracket' },
  ],
  hush_millrace: [
  ],
  hush_quiet: [
    { sprite: 'r3h_hollowlog', x: 33, y: 22, text: 'r3h_qu_nest', gives: 'lp3h_quiet_feather', taken: { sprite: 'r3h_hollowlog', text: 'r3h_qu_nest_gone' } },
  ],
  hush_clawed_bridge: [
  ],
  hush_starfall: [
    { sprite: 'r3h_can', x: 6, y: 14, text: 'r3h_sf_can', walkable: true },
    { sprite: 'r3h_stardust', x: 15, y: 11, text: 'r3h_sf_dust', walkable: true, flat: true },
  ],
};

// Where the glowing fungus is (a faint light of its own that dims when the Hush is near), by room.
export const HUSH_LIFE_GLOW = {
  hush_mist_edge: [[3,3],[4,3]],
  hush_hollow_oak: [[8,2],[3,4],[5,5]],
  hush_leaning_pines: [[8,2]],
  hush_kiln: [[27,3]],
  hush_underroot: [[2,19],[13,14],[28,17],[6,5],[9,14],[19,17],[6,15]],
  hush_gorge: [[4,20],[33,15]],
  hush_sawpit: [[28,12]],
  hush_notched: [[2,18],[26,8]],
  hush_sprung_trap: [[15,18]],
  hush_windfall: [[21,19]],
  hush_millrace: [[3,3]],
  hush_quiet: [[4,12]],
  hush_clawed_bridge: [[28,4]],
  hush_starfall: [[20,3]],
};

// Where a toadstool sleeps (its z's drift up), by room.
export const HUSH_LIFE_SLEEPERS = {
  hush_felled_run: [[20,13]],
  hush_hollow_oak: [[26,16]],
  hush_leaning_pines: [[10,16]],
  hush_notched: [[29,16]],
  hush_windfall: [[5,19]],
  hush_clawed_bridge: [[4,15]],
};
