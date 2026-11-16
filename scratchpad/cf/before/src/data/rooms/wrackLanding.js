// THE LANDING: the first of the Wrack Shore, and the first green sky. Haddock's boat
// is drawn up in the shallows at the west end, Haddock beside it on the shingle. A
// wide grey beach runs east under a low cliff; out in the bay the sea heaves, and a
// long way off to the north-east, on the skyline, stands the Last Light: a tall
// black lighthouse with a crown of spikes. Puzzle-free, and no monsters (the first
// room of an area): a place to look at the storm. The way on is the east door.
// (It leads to the Headland, wrack_headland: the first ring climb of the coast, then the pools.)
// Tile key (see src/overworld/coastTiles.js, wrack):
//   #  cliff top (solid)   W  cliff face (solid)   .  wet shingle   ,  salt grass
//   :  shell path   ;  shallows   j  stepping stones   ~  sea (solid)   x  barnacle rock (solid)
//   O  boulder (solid)   F  weed pile (solid)

export const WRACK_LANDING = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wrack_landing',
  // The room's name, for the Room Editor.
  name: 'THE LANDING',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wrack',
  // The Wrack Shore's song (src/data/music/wrackTheme.js), and the sounds of the place under it.
  music: 'wrack',
  ambience: 'storm_shore',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_shore', lamplight: { shade: 0.16, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,
  // The Last Light's foot, on the skyline (src/overworld/atmosphere.js: `lastLight`).
  lastLight: { x: 31, y: 7 },

  tiles: [
    '########################################',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~^~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~^~~~~~~~~~~~xx~~~~~~~~~~~~~~~~~^~#',
    '#~~~~~~~~~x~~~~~~~~~~~~~~~~~~~~~~~~~x~~#',
    '#~x~~~~~~~~~~~~~~~~~~~~xx~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~;;;~j~~~~~~~~~~~;;~~~~~~~~~~~~#',
    '#~~~~~~;;;;;jj;;;;~..;I~;;;J~~~~~~~;..;#',
    '#.........,.............,,....;~~~;,...#',
    '#..O::........:::.....::........::...::.',
    '#.....:::.:::::::..:::::::::.:::::.::::.',
    '#x,,,,:,,,.x.:...,,.x.x.::.Fxx,,,,,O,.x#',
    '#x,,,,,,.FxOx.O.,,,,.xxO.,.xxOx,,,,,,.O#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '########################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 8, y: 11 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 39, y: 10, w: 1, h: 2, to: 'wrack_headland', spawn: { x: 2, y: 16 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wrack.txt',
  props: [
    // Haddock and the Bother, tied to a post at the west end, until the Dowager's room
    // (then he has rowed round to Saltcombe, where the Bother is at the quay).
    { sprite: 'cf_haddock', x: 8, y: 9, npc: 'haddock_wrack', animation: 'cf_haddock', speed: 0.5, until: 'the_dowager_crab' },
    { sprite: 'cf_bother_moored', x: 2, y: 8, text: 'landing_bother', animation: 'cf_bother_moored', speed: 0.5, until: 'the_dowager_crab' },
    { sprite: 'sign', x: 12, y: 10, text: 'landing_sign' },
    { sprite: 'c5_driftwood', x: 16, y: 12, text: 'landing_driftwood' },
    { sprite: 'c5_lobster_pots', x: 19, y: 10, text: 'landing_pots' },
    { sprite: 'c5_tattered_flag', x: 26, y: 10, text: 'landing_flag', animation: 'c5_tattered_flag', speed: 0.35 },
    { sprite: 'c5_seaweed_heap_big', x: 24, y: 13, text: 'landing_weed' },
    { sprite: 'c5_buoy_red', x: 30, y: 10, text: 'landing_buoy' },
    { sprite: 'c5_snapped_mast', x: 36, y: 10, text: 'landing_mast' },
    { sprite: 'c5_barrel', x: 32, y: 13, text: 'landing_barrel' },
    { sprite: 'gold_pouch', x: 3, y: 13, text: 'landing_pouch', gold: 30, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Dressing (second pass): stones out in the sea and along the back of the beach, weed at the
    // water's edge, a fire and a lantern for some warmth. Rows 9 to 11 (the way along) stay open.
    { sprite: 'c5_rocks_weedy', x: 5, y: 5, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 13, y: 3, text: 'shore_rocks' },
    { sprite: 'c5_rocks_weedy', x: 29, y: 6, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 33, y: 2, text: 'shore_rocks' },
    { sprite: 'c5_rocks_weedy', x: 33, y: 12, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 5, y: 12, text: 'shore_rocks' },
    { sprite: 'c5_fence_broken', x: 12, y: 12, text: 'shore_fence' },
    { sprite: 'c5_drift_fire', x: 7, y: 13, text: 'shore_fire' },
    { sprite: 'c5_lantern_hook', x: 37, y: 12, text: 'shore_lantern' },
    { sprite: 'c5_weed_mat', x: 14, y: 9, flat: true, walkable: true },
    { sprite: 'c5_weed_mat', x: 27, y: 9, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 3, y: 10, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 20, y: 9, flat: true, walkable: true },
    { sprite: 'c5_rock_pool', x: 36, y: 9, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 23, y: 10, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 10, y: 9, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 2, y: 12, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 18, y: 13, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 31, y: 13, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 8, y: 12, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 25, y: 12, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 36, y: 13, flat: true, walkable: true },
    // LIFE-PASS-BEGIN (builder 3, 2026-11-14): rock-pool life, shells, kelp, the odds the sea left. Everything here is walkable, so nothing is ever in anyone's way.
    { sprite: 'shore_hermit', x: 24, y: 10, npc: 'hermit_crab', animation: 'shore_hermit', speed: 1.3, quest: [
      { needs: ['has:big_whelk'], take: 'big_whelk', set: 'q_hermit_done', give: 'little_old_shell', text: 'shell_done' },
      { needs: ['q_hermit_done'], text: 'shell_after' },
    ] },
    { sprite: 'sign', x: 22, y: 9, text: 'sl_tidy_sign', walkable: true },
    { sprite: 'shore_jelly', x: 20, y: 8, text: 'sl_jelly', flat: true, walkable: true },
    { sprite: 'c5_net_torn', x: 2, y: 11, text: 'sl_net', flat: true, walkable: true },
    { sprite: 'shore_shells', x: 18, y: 12, text: 'sl_shells_a', flat: true, walkable: true },
    { sprite: 'shore_nest', x: 28, y: 11, text: 'sl_nest', walkable: true },
    { sprite: 'shore_anemone_pool', x: 33, y: 10, text: 'sl_anemone_a', flat: true, walkable: true, animation: 'shore_anemone_pool', speed: 0.5 },
    { sprite: 'shore_fishbones', x: 15, y: 10, text: 'sl_bones', flat: true, walkable: true },
    { sprite: 'c5_drift_log', x: 5, y: 9, text: 'sl_log', flat: true, walkable: true },
    { sprite: 'shore_kelp', x: 14, y: 8, text: 'sl_kelp_a', walkable: true, animation: 'shore_kelp', speed: 0.45 },
    { sprite: 'shore_shells_b', x: 24, y: 8, text: 'sl_shells_b', flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 17, y: 9, text: 'sl_puddle', flat: true, walkable: true },
    { sprite: 'shore_starfish', x: 14, y: 12, text: 'sl_star_a', flat: true, walkable: true },
    { sprite: 'c5_buoy_yellow', x: 20, y: 13, text: 'sl_float', walkable: true },
    { sprite: 'c5_boat_upturned', x: 9, y: 12, text: 'sl_dinghy', walkable: true },
    { sprite: 'shore_bottle', x: 21, y: 11, text: 'sl_bottle', walkable: true },
    { sprite: 'c5_wrack_line', x: 28, y: 9, flat: true, walkable: true, decor: true },
    { sprite: 'c5_crab_trail', x: 11, y: 7, flat: true, walkable: true, decor: true },
    { sprite: 'c5_gull_marks', x: 35, y: 13, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 26, y: 7, flat: true, walkable: true, decor: true },
    { sprite: 'c5_turf_patch', x: 26, y: 8, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 11, y: 8, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 12, y: 8, flat: true, walkable: true, decor: true },
    { sprite: 'c5_sea_holly', x: 30, y: 12, flat: true, walkable: true, decor: true },
    { sprite: 'c5_planks_scatter', x: 33, y: 9, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 25, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 36, y: 7, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 31, y: 5, flat: true, walkable: true, decor: true },
    { sprite: 'c5_planks_scatter', x: 30, y: 1, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 16, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 26, y: 1, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 4, y: 8, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 21, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'c5_planks_scatter', x: 11, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 37, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 4, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 1, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 1, y: 1, flat: true, walkable: true, decor: true },
    // LIFE-PASS-END
  ],
  tileTexts: { '#': 'landing_cliff', W: 'landing_cliff', '~': 'landing_sea', x: 'landing_rock', O: 'landing_rock', F: 'landing_weed' },

  // None: the first room of an area.
  npcs: [
  ],
};
