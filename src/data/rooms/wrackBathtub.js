// THE BATHTUB: a wide bay of shingle with a mat laid out on it, and a notice. This is the
// Dowager Crab's beach. Step in from the west and the scene the_dowager_crab plays: she hauls
// herself out of her bathtub, insists you wipe your feet (the hero does, on the mat), and is
// then very polite and very angry about trespass. Win her round with manners or beat her: both
// scenes (dowager_spared, dowager_beaten) give the Bathtub Bell and send her back to sea. The
// east end is a pinch with a gate across it and a bell post: with the bell, the scene
// bathtub_gate rings it and the gate swings open onto the boardwalk.
// No monsters here (the boss room).
// Tile key (see src/overworld/coastTiles.js, wrack):
//   #  cliff top (solid)   W  cliff face (solid)   .  wet shingle   ,  salt grass   :  shell path
//   ;  shallows (walk)   ~  sea (solid)   x  barnacle rock (solid)   O  boulder   F  weed pile

export const WRACK_BATHTUB = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wrack_bathtub',
  // The room's name, for the Room Editor.
  name: 'THE BATHTUB',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wrack',
  // The Wrack Shore's song (src/data/music/wrackTheme.js), and the sounds of the place under it.
  music: 'wrack',
  ambience: 'storm_shore',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_shore', lamplight: { shade: 0.16, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,
  // The fight has its own song (crabBattle, src/data/music/crabBattleTheme.js).

  tiles: [
    '########################################',
    '##WWWWWWWWWW####WWWWWWWWWWWW###WWWWWWWW#',
    '#W~~x~~~~~~~W##W~~~~^~~~~~xxWWW~~~~~##~#',
    '#~~~~~~~~;;~~WW~~~~~~~;~~~~~~~~~~x~~##~#',
    '#;;;;;~~~;;;..;;;;;~~;;;;;.;;;~~~;;;##;#',
    '#.;;...;.x....;;;.......;;F...;;;...##.#',
    '#....;;...;;....................;;..##.#',
    '#.....;.....:::.............::...;..WW.#',
    '..::::.:::::::::::::::..:::::::::.:::::.',
    '..:::::::::::::::..:::::::::::.::::::::.',
    '#..,,.......,,..........:::.,,......##.#',
    '#,,,,,,...,,,,,...,,,.....,,,,,,..,,##.#',
    '#,,,,,,,,,,,,,,,,,,,,,,..,,,,,,O,,,,##,#',
    '#,,,x,,N,,,..,,,,,,NN,,,,,..,,,,,,x,##,#',
    '#,,N,,,Ox,,.;;.,,,,,,F,,,,,,Ox,,,N,,##,#',
    '#x,,,,OxxO,,..,,,,,,,,..,,,OxxOx,,,,##,#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '########################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'wrack_tide_clock', spawn: { x: 42, y: 9 } },
    { x: 39, y: 8, w: 1, h: 2, to: 'wrack_boardwalk', spawn: { x: 2, y: 22 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    // Stepping in from the west: the Dowager (the whole of the column x 3, rows 4 to 15, so it
    // can't be walked round along the shallows or the grass).
    { x: 3, y: 4, w: 1, h: 12, scene: 'the_dowager_crab' },
    // At the gate, once you have the bell (either way the fight ended).
    { x: 34, y: 8, w: 2, h: 2, scene: 'bathtub_gate', after: 'dowager_beaten' },
    { x: 34, y: 8, w: 2, h: 2, scene: 'bathtub_gate', after: 'dowager_spared' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wrack.txt',
  props: [
    // The mat, the notices, the gate with its bell post, and a purse. The gate is two props (it
    // closes the two-tile pinch) and goes when the scene bathtub_gate has played.
    { sprite: 'c5_doormat', x: 10, y: 9, text: 'bath_mat', walkable: true },
    { sprite: 'sign', x: 6, y: 10, text: 'bath_sign' },
    { sprite: 'sign', x: 33, y: 10, text: 'bath_sign_east' },
    { sprite: 'gate_narrow', x: 37, y: 8, text: 'bath_gate', until: 'bathtub_gate' },
    { sprite: 'gate_narrow', x: 37, y: 9, text: 'bath_gate', until: 'bathtub_gate' },
    // The bell frame stands empty until bathtub_gate hangs the Dowager's bell on it.
    { sprite: 'c5_bell_frame_empty', x: 35, y: 10, text: 'bath_bell_post', until: 'bathtub_gate' },
    { sprite: 'c5_harbour_bell', x: 35, y: 10, text: 'bath_bell_hung', animation: 'c5_harbour_bell', speed: 0.9, after: 'bathtub_gate', sound: 'bell' },
    { sprite: 'c5_bathtub_wreck', x: 16, y: 13, text: 'bath_spare_tub' },
    { sprite: 'c5_driftwood', x: 24, y: 14, text: 'landing_driftwood' },
    { sprite: 'gold_pouch', x: 3, y: 14, text: 'bath_pouch', gold: 35, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Dressing (second pass): weedy stones by the boulders, a fire someone keeps in the grass,
    // a log and a pot up on the shingle, the tide's leavings along the high-water line. All off
    // the scene walks (rows 8 to 11 west of x 27, column 25 up to the sea, and the gate).
    { sprite: 'c5_rocks_weedy', x: 26, y: 14, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 10, y: 15, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 5, y: 13, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 32, y: 14, text: 'shore_rocks' },
    { sprite: 'c5_fence_broken', x: 18, y: 15, text: 'shore_fence' },
    { sprite: 'c5_drift_fire', x: 9, y: 13, text: 'shore_fire' },
    { sprite: 'c5_lantern_hook', x: 31, y: 11, text: 'shore_lantern' },
    { sprite: 'c5_drift_log', x: 27, y: 6, text: 'shore_log' },
    { sprite: 'c5_pot_single', x: 34, y: 6, text: 'shore_pot' },
    { sprite: 'c5_marram', x: 12, y: 12, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 21, y: 13, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 30, y: 12, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 15, y: 15, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 2, y: 12, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 8, y: 14, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 23, y: 12, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 34, y: 12, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 4, y: 5, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 18, y: 5, flat: true, walkable: true },
    { sprite: 'c5_weed_mat', x: 10, y: 4, flat: true, walkable: true },
    { sprite: 'c5_weed_mat', x: 22, y: 6, flat: true, walkable: true },
    { sprite: 'c5_rock_pool', x: 19, y: 6, flat: true, walkable: true },
    { sprite: 'c5_rock_pool', x: 1, y: 6, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 14, y: 7, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 31, y: 7, flat: true, walkable: true },
    { sprite: 'c5_shingle_spill', x: 12, y: 14, flat: true, walkable: true },
    { sprite: 'c5_shingle_spill', x: 7, y: 11, flat: true, walkable: true },
    { sprite: 'c5_shingle_spill', x: 21, y: 12, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 3, y: 10, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 13, y: 10, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 28, y: 10, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 18, y: 11, flat: true, walkable: true },
    // Stones standing out in the sea, to break the line of the water.
    { sprite: 'c5_rocks_weedy', x: 6, y: 3, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 17, y: 3, text: 'shore_rocks' },
    { sprite: 'c5_rocks_weedy', x: 30, y: 3, text: 'shore_rocks' },
    // LIFE-PASS-BEGIN (builder 3, 2026-11-14): rock-pool life, shells, kelp, the odds the sea left. Everything here is walkable, so nothing is ever in anyone's way.
    { sprite: 'shore_bottle', x: 13, y: 14, text: 'sl_bottle', walkable: true },
    { sprite: 'c5_net_torn', x: 28, y: 13, text: 'sl_net', flat: true, walkable: true },
    { sprite: 'c5_buoy_red', x: 19, y: 7, text: 'sl_buoy' },
    { sprite: 'shore_kelp', x: 27, y: 4, text: 'sl_kelp_a', walkable: true, animation: 'shore_kelp', speed: 0.45 },
    { sprite: 'shore_nest', x: 8, y: 5, text: 'sl_nest', walkable: true },
    { sprite: 'shore_boot', x: 13, y: 4, text: 'sl_boot', walkable: true },
    { sprite: 'shore_starfish', x: 30, y: 14, text: 'sl_star_a', flat: true, walkable: true },
    // LIFE-PASS-END
  ],
  tileTexts: { '#': 'landing_cliff', W: 'landing_cliff', '~': 'landing_sea', x: 'landing_rock', O: 'landing_rock', F: 'landing_weed' },

  // None: the Dowager is cast by the scenes (the_dowager_crab, dowager_beaten, dowager_spared).
  npcs: [
  ],
};
