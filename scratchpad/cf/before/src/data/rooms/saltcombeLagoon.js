// THE LAGOON: out past the market, the town's bathing lagoon behind the sea
// wall, under the cliff the lookout stands on. A plank walk down the west
// side, with a little bathing pool in it (the "front room": its water never
// changes), and beyond the rail the lagoon proper, which fills and empties
// with the sluice. Across it, under the cliff, a ledge with a rope up to the
// lookout.
//
// Scene swimming_lesson (once haddock_hums has played): Haddock, up to his
// chest in the bathing pool, teaches Bramble to swim. Bramble is terrified,
// then manages a bit, and gets the paper boat (keepsake). It all happens in
// the bathing pool, which is the same at both tides.
//
// THE PUZZLE (Saltcombe's only tide puzzle, gentle; 2026-11-10, it was a floating crate pushed
// into the gully, too like the Wrack pools, and the old file is in notes/room-backup-2026-11-10b/):
// the tide is HIGH at the start and the lagoon is deep. The sluice wheel (8,6) on the plank walk
// turns it either way. At LOW the bed shows, but the whole lagoon runs out down the outflow gully
// (column 22, rows 7 to 19) to the sluice gate at its foot (22,20): the gully is a fast, shallow
// RACE then (`current_down` props, `lowTide: true`, so they only run with the water out), and at
// HIGH it is deep. Step into it from either side and it carries you down to the gate, where it
// stops and lets you off, sideways (Player.rideCurrent): step off east and you're across. Over the
// east bed to the ledge (27..32, rows 7-8, dry at both tides) and the rope (x 30): walk up into the
// cliff to take hold, and all three climb to the lookout (src/overworld/ropeClimb.js). The south
// edge (row 20) is deep at both tides, so the gully can't be walked round. Coming back down the
// rope, the ledge's own wheel (31,8) lets the water out from that side, and the gully takes you
// across the same way, stepping off west. The wheels and the doors are dry at both tides. No
// clock, nothing to reset.
//
// No monsters (a town).
// Tile key (see src/overworld/coastTiles.js, saltcombe):
//   #  wall top (solid)   h  the backs of the market houses (solid)   K  the cliff's rock face, # its rock (solid)
//   .  planks   f  rail (solid)   ;  shallows (walk)   ~  deep water (solid)   q  the bed (low tide)

export const SALTCOMBE_LAGOON = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'saltcombe_lagoon',
  // The room's name, for the Room Editor.
  name: 'THE LAGOON',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'saltcombe',
  // "Salt and Rope", and the town's rain on the roofs.
  music: 'saltcombe',
  // After chapter 5 (the_light_answers) the town is quiet: "What the Tide Left".
  musicAfter: { scene: 'the_light_answers', song: 'saltcombeAfter' },
  ambience: 'stilt_town',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_stilt_town', lamplight: { shade: 0.22, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,

  // The HIGH-tide map.
  tiles: [
    '####################################',
    '#hhhhhhhhhhhhhhhhhhhh###############',
    '#hhhhhhhhhhhhhhhhhhhh###############',
    '#....................#K####KKKKK##K#',
    '#....................KKK##KKKKKKK#K#',
    '#....................KKKKKKKKKKKKKK#',
    '#........ffffffffffffKKKKKKKKKKKKKK#',
    '#........;;;;;;;;;;;;;~~~~~......~##',
    '#........~~~~~~~~~~~~~~~~~~......~~#',
    '.oooooooo~~~~~~~~~~~~~~~~~~~~~~~~~##',
    '.oooooooo~~~~~~~~~~~~~~~~~~x~~~~~~##',
    '#........~~~~~~~~xx~~~~~~~~~~~~~~~##',
    '#........~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#..;;;;..~~~~~~~~~~~~~~~~~~~~~~x~~~#',
    '#.;~~~;;.~~~~~~~~~~~~~~~~~~~~~~~~~##',
    '#.;~~~~;.~~x~~~~~~~~~~~~~~~~~~~x~~##',
    '#.;~~~~;.~~~~~~~~~~~~~~~~~~~x~~~~~~#',
    '#.;~~~~;.~~x~~~~~~~~~~~~~~~x~~~~~~##',
    '#.;;~~;;.~~~x~~~~~~~x~~~~~~~~~x~~~##',
    '#..;;;;..~~~~~~~~~~~~~~~~x~~~~~~~~##',
    '#........~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '####################################',
  ],

  tide: {
    // The LOW-tide map (a space is "the same as high"): the bed shows, and the gully (x 22) runs shallow and fast.
    low: [
      '                                    ',
      '                                    ',
      '                                    ',
      '                                    ',
      '                                    ',
      '                                    ',
      '                                    ',
      '         qqqqqqqqqqqqq;qqqq      q  ',
      '         qqqqqqqqqqqqq;qqqq      q  ',
      '         qqqqqqqqqqqqq;qqqqqqqqqqq  ',
      '         qqqqqqqqqqqqq;qqqqxqqqqqq  ',
      '         qqqqqqqqxxqqq;qqqqqqqqqqq  ',
      '         qqqqqqqqqqqqq;qqqqqqqqqqq  ',
      '         qqqqqqqqqqqqq;qqqqqqqqxqq  ',
      '         qqqqqqqqqqqqq;qqqqqqqqqqq  ',
      '         qqxqqqqqqqqqq;qqqqqqqqxqq  ',
      '         qqqqqqqqqqqqq;qqqqqxqqqqq  ',
      '         qqxqqqqqqqqqq;qqqqxqqqqqq  ',
      '         qqqxqqqqqqqxq;qqqqqqqxqqq  ',
      '         qqqqqqqqqqqqq;qqxqqqqqqqq  ',
      '                                    ',
      '                                    ',
    ],
    start: 'high',
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'saltcombe_market', spawn: { x: 34, y: 11 } },
  ],

  // The rope up the cliff to the lookout: walk up into the cliff at its foot.
  rope: {
    x: 30,
    top: 1,
    bottom: 7,
    to: 'saltcombe_lookout',
    spawn: { x: 6, y: 14 },
    barks: [
      { at: 5, who: 'bramble', text: '{determined}I\'m not looking down. I\'m looking UP.\n\n{proud}Up is fine. Up is just sky.' },
      { at: 3, who: 'vesper', text: '{bored}If anyone sees my umbrella fall, no they didn\'t.' },
    ],
  },

  // The lesson plays as you come in, once Haddock has said so at the inn.
  // (Its walks are on the plank walk and in the bathing pool, which never change.)
  cutscenes: [{ x: 1, y: 8, w: 2, h: 4, scene: 'swimming_lesson', after: 'haddock_hums' }],

  // The sluice wheel, the outflow race, the rope's anchor, Haddock (only for the lesson), lamps,
  // a bench, a kid, two purses.
  textFile: 'interactions/saltcombe.txt',
  props: [
    { sprite: 'c5_sluice_wheel', x: 8, y: 6, tideWheel: { to: 'toggle', text: 'lagoon_wheel', busy: 'lagoon_wheel_busy' } },
    // The gate the lagoon runs out under, at the gully's foot.
    { sprite: 'c5_sluice_gate', x: 22, y: 20, text: 'lagoon_sluice_gate' },
    // The way back from the lookout: the rope down lands you on the ledge, so a second wheel there
    // lets the water out from that side.
    { sprite: 'c5_sluice_wheel', x: 31, y: 8, tideWheel: { to: 'toggle', text: 'lagoon_wheel', busy: 'lagoon_wheel_busy' } },
    // The outflow race down the gully: only there with the water out.
    { sprite: 'current_down', x: 22, y: 7, text: 'lagoon_outflow', flow: 'down', animation: 'sd_current_down', speed: 0.1, lowTide: true },
    { sprite: 'current_down', x: 22, y: 8, text: 'lagoon_outflow', flow: 'down', animation: 'sd_current_down', speed: 0.1, lowTide: true },
    { sprite: 'current_down', x: 22, y: 9, text: 'lagoon_outflow', flow: 'down', animation: 'sd_current_down', speed: 0.1, lowTide: true },
    { sprite: 'current_down', x: 22, y: 10, text: 'lagoon_outflow', flow: 'down', animation: 'sd_current_down', speed: 0.1, lowTide: true },
    { sprite: 'current_down', x: 22, y: 11, text: 'lagoon_outflow', flow: 'down', animation: 'sd_current_down', speed: 0.1, lowTide: true },
    { sprite: 'current_down', x: 22, y: 12, text: 'lagoon_outflow', flow: 'down', animation: 'sd_current_down', speed: 0.1, lowTide: true },
    { sprite: 'current_down', x: 22, y: 13, text: 'lagoon_outflow', flow: 'down', animation: 'sd_current_down', speed: 0.1, lowTide: true },
    { sprite: 'current_down', x: 22, y: 14, text: 'lagoon_outflow', flow: 'down', animation: 'sd_current_down', speed: 0.1, lowTide: true },
    { sprite: 'current_down', x: 22, y: 15, text: 'lagoon_outflow', flow: 'down', animation: 'sd_current_down', speed: 0.1, lowTide: true },
    { sprite: 'current_down', x: 22, y: 16, text: 'lagoon_outflow', flow: 'down', animation: 'sd_current_down', speed: 0.1, lowTide: true },
    { sprite: 'current_down', x: 22, y: 17, text: 'lagoon_outflow', flow: 'down', animation: 'sd_current_down', speed: 0.1, lowTide: true },
    { sprite: 'current_down', x: 22, y: 18, text: 'lagoon_outflow', flow: 'down', animation: 'sd_current_down', speed: 0.1, lowTide: true },
    { sprite: 'current_down', x: 22, y: 19, text: 'lagoon_outflow', flow: 'down', animation: 'sd_current_down', speed: 0.1, lowTide: true },
    { sprite: 'sc_rope_anchor', x: 30, y: 0, text: 'lagoon_rope_anchor' },
    { sprite: 'sign', x: 3, y: 8, text: 'lagoon_sign' },
    { sprite: 'sign', x: 28, y: 8, text: 'lagoon_rope_sign' },
    { sprite: 'sc_haddock_wade', x: 5, y: 15, npc: 'haddock_lagoon', animation: 'sc_haddock_wade', speed: 0.5, after: 'haddock_hums', until: 'swimming_lesson' },
    { sprite: 'c5_lantern_post_lit', x: 6, y: 3, text: 'lagoon_lamp', animation: 'c5_lantern_post_lit', speed: 0.26 },
    { sprite: 'c5_lantern_post_lit', x: 16, y: 3, text: 'lagoon_lamp', animation: 'c5_lantern_post_lit', speed: 0.28 },
    { sprite: 'bench', x: 10, y: 3, text: 'lagoon_bench' },
    { sprite: 'c5_hanging_nets', x: 18, y: 3, text: 'lagoon_nets' },
    { sprite: 'c5_lifebuoy_post', x: 8, y: 20, text: 'lagoon_lifebuoy' },
    { sprite: 'cf_kid_pup', x: 13, y: 4, text: 'lagoon_pup', animation: 'cf_kid_pup', speed: 0.3 },
    { sprite: 'gold_pouch', x: 14, y: 16, text: 'lagoon_pouch', lowTide: true, gold: 45, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'gold_pouch', x: 32, y: 8, text: 'lagoon_ledge_pouch', gold: 40, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Dressing (2026-11-08), kept off the gully (x 22) and the swimming lesson's walks
    // (west of x 7, rows 9 to 16): wreckage the storm threw over the sea wall into the lagoon
    // (afloat at high, stranded on the bed at low), a crab's trail on the bed's far side, a
    // lantern on a hook at the pool's south end, the wet deck.
    { sprite: 'c5_planks_scatter', x: 12, y: 12, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 25, y: 17, flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 28, y: 13, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 14, y: 19, flat: true, walkable: true },
    { sprite: 'c5_lantern_hook', x: 1, y: 19 },
    { sprite: 'c5_rope_coil', x: 6, y: 19, walkable: true, decor: true },
    { sprite: 'c5_barrel', x: 20, y: 5 },
    { sprite: 'c5_crates_stack', x: 19, y: 4 },
    { sprite: 'c5_puddle', x: 12, y: 5, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 4, y: 5, flat: true, walkable: true },
    // Storm-battered (2026-11-09): the houses' backs have their sea windows boarded, and the
    // herring crans are stacked dry by the nets. The gangway in from the market is laid the other
    // way (rows 9-10, o), and the bathing pool's square corners are boarded over (the lesson's
    // walks are x 1..3 rows 9-12 and down x 3..4 in the pool, none on those corners).
    { sprite: 'sc_window_boarded', x: 3, y: 2, text: 'lagoon_window_boarded' },
    { sprite: 'sc_window_boarded', x: 12, y: 2, text: 'lagoon_window_boarded' },
    { sprite: 'sc_herring_crans', x: 14, y: 3, text: 'lagoon_crans' },
    { sprite: 'c5_pot_single', x: 1, y: 14, text: 'lagoon_pot' },
    { sprite: 'c5_boat_upturned', x: 3, y: 6, text: 'lagoon_boat' },
    // (life pass 2026-11-14)
    // The promenade: a shelter over the bench, a boat on trestles, a man mending a pot, a cat on its walk, a board of rules.
    { sprite: 'st_awning', x: 10, y: 4, walkable: true, solidSides: 3, decor: true },
    { sprite: 'st_boat_trestle', x: 16, y: 5, text: 'life_l_trestle' },
    { sprite: 'st_mender', x: 11, y: 5, npc: 'st_lagoon_mender', animation: 'st_mender', speed: 0.7 },
    { sprite: 'st_cat_walk', x: 4, y: 4, text: 'life_l_cat', animation: 'st_cat_walk', speed: 0.22, stroll: { path: [[3, 4], [8, 4]], speed: 10, pause: [3, 6], scatter: true, keepAnim: true } },
    { sprite: 'st_price_board', x: 4, y: 5, text: 'life_l_rules' },
    { sprite: 'st_flower_tub', x: 2, y: 4, text: 'life_l_tub' },
    { sprite: 'st_rain_barrel', x: 2, y: 5, text: 'life_l_barrel', animation: 'st_rain_barrel', speed: 0.5 },
    { sprite: 'st_boot_planter', x: 15, y: 3, text: 'life_l_boot' },
    // Pilchard, asleep in the corner behind the crates and the barrel: Skerry's lost cat (the market's errand).
    { sprite: 'st_cat_loaf', x: 20, y: 4, text: 'life_l_pilchard', animation: 'st_cat_loaf', speed: 1.1, gives: 'pilchard_cat', react: true, taken: { gone: true } },
    { sprite: 'st_shells', x: 20, y: 3, flat: true, walkable: true, decor: true },
    // The west shore: what the tide leaves.
    { sprite: 'st_old_boot', x: 7, y: 12, text: 'life_l_boot_old' },
    { sprite: 'st_tin_can', x: 1, y: 16, text: 'life_l_can' },
    { sprite: 'st_glass_float', x: 1, y: 17, text: 'life_l_float', animation: 'st_glass_float', speed: 0.9 },
    { sprite: 'st_message_bottle', x: 7, y: 19, text: 'life_l_bottle' },
    { sprite: 'st_starfish', x: 4, y: 12, flat: true, walkable: true, decor: true },
    { sprite: 'st_shells', x: 6, y: 14, flat: true, walkable: true, decor: true },
    { sprite: 'c5_gull_marks', x: 17, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 7, y: 11, flat: true, walkable: true, decor: true },
  ],
  tileTexts: {
    h: 'lagoon_backs', '#': 'lagoon_cliff', K: 'lagoon_cliff', f: 'lagoon_rail',
    '~': 'lagoon_water', ';': 'lagoon_shallows', q: 'lagoon_bed',
  },

  // None: a town.
  npcs: [
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
