// THE JETTY: the last of Gullrest. A boardwalk pier runs out into the bay with
// rails along both sides, a headland (the point) to the north-east and open sea
// beyond. At the end of the pier is Haddock's rowboat, the Bother. Haddock isn't here
// before you (he went round the back way from the cove): stepping onto the end of the
// pier, he comes in at the door after you and along the pier to her. The scene
// the_sky_turns is that and the ride: rowing round the point, the sun
// goes, the rain starts and the sky turns green (the storm look), and the ride ends
// on the shingle of the Wrack Shore (wrack_landing). It plays once: afterwards Haddock
// and the Bother are gone from the pier.
// Tile key (see src/overworld/coastTiles.js, gullrest):
//   #  cliff top (solid)   W  cliff face (solid)   ,  beach turf   .  warm sand
//   q  shingle   ;  shallows   o  pier boards   f  pier rail (solid)
//   ~  sea (solid)

export const GULLREST_JETTY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'gullrest_jetty',
  // The room's name, for the Room Editor.
  name: 'THE JETTY',
  // The region it's in (src/data/areas.js): the title card and the battle background.
  area: 'gullrest',
  // Gullrest's song (src/data/music/gullrestTheme.js), and the sounds of the place under it.
  music: 'gullrest',
  ambience: 'beach',
  vesWell: true,

  tiles: [
    '################################################',
    '##WWW###WWWWW~~~~~~~~~~~~O~#,,,##,,,##~~~~~~~~~~',
    '#W,,,WWW,,,,~~~~~~~~~~~~~~~#,,O,,,,,,#~O~~~~~~~~',
    '#,,,,,,,,,,~~~~~~~~~~~~~~~OW##,,,,O,,#~~~~~~~~~~',
    '#..........qqq~~~~~~~~~~~~~~##,,,,,##W~~~~~OO~~~',
    '#..........qqqqq~~~~~~~~~~~~W########~O~~~~~~~~~',
    '#..........qqqq~~~~~~~~~~~~~~W#####WW~~~~~~~~~~~',
    '#..........fffffffffff~~~~~~~~WWWWW~O~~~~~~~~~~~',
    ':..........oooooooooooo~~~~~~~~~~~~~~~~~~~~~~~~~',
    ':..........oooooooooooo~~~~~~~~~~~~~~~~~~~~~~~~~',
    '#..........fffffffffff~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '#..........qqqq~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '#..........qqqq~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '#..........qqqq~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~O~',
    '#..........qqqq~~~OO~~~~~~~~~~~~~~~~~~~~O~~~~~~~',
    '#...........q~~~~O~~~~~~~~~~~~~~~O~~~~~~~OO~~~~~',
    '#..........;.qq~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '############~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'gullrest_cove', spawn: { x: 31, y: 9 } },
  ],

  // Stepping onto the end of the pier boards the Bother (once).
  cutscenes: [{ x: 21, y: 8, w: 2, h: 2, scene: 'the_sky_turns' }],

  // The Bother, a sign, buoys, pots, a net, an unlit lantern post, a rope
  // coil and a purse.
  textFile: 'interactions/gullrest.txt',
  props: [
    { sprite: 'cf_bother', x: 23, y: 9, npc: 'the_bother', animation: 'cf_bother', speed: 0.5, until: 'the_sky_turns' },
    { sprite: 'sign', x: 8, y: 6, text: 'jetty_sign' },
    { sprite: 'c5_buoys_pile', x: 4, y: 6, text: 'jetty_buoys' },
    { sprite: 'c5_lobster_pots', x: 8, y: 13, text: 'jetty_pots' },
    { sprite: 'c5_net_frame', x: 3, y: 11, text: 'jetty_net' },
    { sprite: 'c5_lantern_post_unlit', x: 9, y: 7, text: 'jetty_lamp' },
    { sprite: 'c5_rope_coil', x: 13, y: 9, text: 'jetty_rope', walkable: true },
    { sprite: 'gold_pouch', x: 3, y: 14, text: 'jetty_pouch', gold: 40, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_bunting_post', x: 12, y: 7, text: 'beach_bunting_post', animation: 'c5_bunting_post', speed: 0.4 },
    { sprite: 'sy_dune_grass', x: 6, y: 3, text: 'steps_dune', animation: 'sy_dune_grass', speed: 0.4, walkable: true },
    // Dressing (second pass): warm stones in the sea (none in rows 8 to 11 east of the jetty,
    // where the Bother rows off in the_sky_turns, and nothing on rows 8 and 9 of the sand,
    // where Haddock walks out), a log and a pot on the sand, weed along the shingle.
    { sprite: 'c5_rocks_sunny', x: 40, y: 3, text: 'beach_rocks' },
    { sprite: 'c5_rock_sunny', x: 18, y: 4, text: 'beach_rocks' },
    { sprite: 'c5_rocks_sunny', x: 27, y: 14, text: 'beach_rocks' },
    { sprite: 'c5_rock_sunny', x: 36, y: 13, text: 'beach_rocks' },
    { sprite: 'c5_rock_sunny', x: 21, y: 16, text: 'beach_rocks' },
    { sprite: 'c5_rocks_sunny', x: 44, y: 15, text: 'beach_rocks' },
    { sprite: 'c5_rock_sunny', x: 46, y: 5, text: 'beach_rocks' },
    { sprite: 'c5_rocks_sunny', x: 1, y: 4, text: 'beach_rocks' },
    { sprite: 'c5_drift_log', x: 7, y: 16, text: 'beach_log' },
    { sprite: 'c5_pot_single', x: 10, y: 12, text: 'beach_pot' },
    { sprite: 'c5_wrack_line', x: 11, y: 5, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 11, y: 13, flat: true, walkable: true },
    { sprite: 'c5_rock_pool_sunny', x: 12, y: 15, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 6, y: 10, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 1, y: 12, flat: true, walkable: true },
    { sprite: 'sy_dune_grass', x: 9, y: 3, flat: true, walkable: true },
    { sprite: 'sy_dune_grass', x: 1, y: 15, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 3, y: 2, flat: true, walkable: true },
    // The headland's grassy top (out of reach): a little marram and dune grass up there.
    { sprite: 'sy_dune_grass', x: 31, y: 2, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 33, y: 4, flat: true, walkable: true },
    { sprite: 'sy_dune_grass', x: 35, y: 1, flat: true, walkable: true },
    // (life pass 2026-11-14)
    // The jetty: an angler on the sand, boats on their moorings, a board of rules, drying fish, a bucket of crabs, a cat on a crate.
    { sprite: 'st_folk_a', x: 9, y: 11, npc: 'st_jetty_angler', animation: 'st_folk_a', speed: 0.8 },
    { sprite: 'st_dinghy_a', x: 26, y: 12, text: 'life_j_dinghy_a', animation: 'st_dinghy_a', speed: 1.3 },
    { sprite: 'st_dinghy_b', x: 35, y: 11, text: 'life_j_dinghy_b', animation: 'st_dinghy_b', speed: 1.1 },
    { sprite: 'st_price_board', x: 5, y: 7, text: 'life_j_rules' },
    { sprite: 'st_fish_rack', x: 4, y: 13, text: 'life_j_rack' },
    { sprite: 'st_crab_bucket', x: 6, y: 12, text: 'life_j_crabs', animation: 'st_crab_bucket', speed: 0.5 },
    { sprite: 'st_cat_sit', x: 9, y: 14, text: 'life_j_cat', animation: 'st_cat_sit', speed: 0.7 },
    { sprite: 'st_flower_tub', x: 10, y: 7, text: 'life_j_tub' },
    { sprite: 'st_message_bottle', x: 7, y: 15, text: 'life_j_bottle' },
    { sprite: 'st_pool_life', x: 5, y: 15, flat: true, walkable: true, animation: 'st_pool_life', speed: 1.0, decor: true },
    { sprite: 'st_starfish', x: 8, y: 11, flat: true, walkable: true, decor: true },
    { sprite: 'st_shells', x: 4, y: 5, flat: true, walkable: true, decor: true },
    { sprite: 'st_shells', x: 3, y: 9, flat: true, walkable: true, decor: true },
    { sprite: 'c5_crab_trail', x: 6, y: 14, flat: true, walkable: true, decor: true },
  ],
  tileTexts: { '#': 'jetty_wall', W: 'jetty_wall', '~': 'jetty_sea' },

  // A PAIR on the south sand: a gullion (x 3 to 7, row 15) and a sandcastle beside it (x 3 to 6,
  // home row 14, down off the cove door's spawn at 2,9), close enough to fight you together. Both on the beach and well clear of the pier
  // (rows 8 and 9), the door and the boat's route (row 9 east of the pier, then round the point).
  // No monsters on the pier, so the boarding and the ride have a clear run.
  npcs: [
    { enemy: 'gullion', x: 4, y: 15, patrol: [3, 7], behaviour: 'patrol' },
    { enemy: 'sandcastle', x: 5, y: 14, patrol: [3, 6], behaviour: 'wander' },
  ],
};
