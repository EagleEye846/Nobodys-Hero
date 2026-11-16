// THE SLIP: the far side of the yard, a cove under the cliff where the main yard of the
// mast comes to rest. An old stone boat-slip, planked over, runs down the shingle into the
// water, and Haddock is there with the Bother, as he said he'd be. A save crystal. Puzzle-
// free and no monsters (a save room). The way home: walk down to the end of the slip
// (13..16, row 13) and Haddock rows you back to Saltcombe (wreck_slip_home, any time).
// The way back into the yard is the door you came in by, along the yard to the mast.
// THE GHOST SHIP (optional, secret; reworked 14 November): the cove's far east point has an old bell post with an EMPTY
// bracket (29,4) and its brass plate, IN FOG, RING FOR THE FAIR RETURN: the bell was taken down long ago. The slip's own sign
// (RING LOUDLY. There's no bell.) is the joke that should make you look. Where the bell went is on the last page of the
// Fair Return's torn log (log_page_5): down the steps under the old boat on the point. Carrying that page, walking up to
// the boat plays point_boat (once): Ves and Bramble roll the boat off the steps, and the steps (27..28, row 7) go down into
// the cave under the point (wreck_under_point), and on out to the Watch Rock (wreck_watch_rock), where the bell hangs.
// The ship's plank and her stern door both come back out on the Watch Rock now, not here.
// Tile key (see src/overworld/coastTiles.js, wreck):
//   #  cliff top (solid)   W  cliff (solid)   q  shingle   ,  turf   o  the slip's planks
//   ~  green-black water (solid)   x  barnacles   O  crate   F  net heap   J  stump

export const WRECK_SLIP = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wreck_slip',
  // The room's name, for the Room Editor.
  name: 'THE SLIP',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wreck',
  // "Fog Bell" (src/data/music/wreckTheme.js).
  music: 'wreck',
  ambience: 'wreck_yard',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.5, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_wreck_yard', lamplight: { shade: 0.24, tint: '34, 44, 68' }, skyline: true },
  // Once the Fair Return has sailed (crew_go_free, 2026-11-14), her fog has gone with her: the yard's fog thins to this.
  fogLiftAfter: { scene: 'crew_go_free', fog: 0.25 },
  vesWell: true,
  // Before the Fair Return is found, her crew's song off the water now and then, or her lantern far out (farShip.js).
  farShip: { sing: true, light: { x: 22, y: 15 } },
  lastLight: { x: 24, y: 15 },
  skyline: [
    { kind: 'hull', x: 6, y: 15, lean: -1 },
    { kind: 'mast', x: 9, y: 14, lean: 1, tall: 52 },
  ],

  tiles: [
    '################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#,,,,,,,,xx,,,,,,,,,,,,,OO,,,,,#',
    '#q,,,,,qqqqq,,,,,,qqq,,,,,,,qqq#',
    'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq#',
    '#qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq#',
    '#qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq#',
    '#qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq#',
    '#qqqqFqqqqqqqooooqqqqqqqqqqqqqq#',
    '#~~qqqqqqqqqqooooqqqqqJqqqqqq~~#',
    '#~~~qqqqqqqqqooooqqqqqqqqqq~~~~#',
    '#~~~~~~~~~~~~oooo~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~oooo~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~oooo~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 4 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Back along the yard to the fighting top of the mast.
    { x: 0, y: 4, w: 1, h: 1, to: 'wreck_mast', spawn: { x: 37, y: 3 } },
    // The fog-watch's steps under the old boat on the point, once the boat is rolled off them (point_boat): down into
    // the cave under the point (and on to the Watch Rock and the Fair Return's bell).
    { x: 27, y: 7, w: 2, h: 1, to: 'wreck_under_point', spawn: { x: 3, y: 3 }, after: ['point_boat', 'ship_looms'] },
  ],

  // The end of the slip: home with Haddock (any time). The old boat on the point: carrying the log's last page (the one
  // that says where the bell went), coming up to it plays point_boat (once), and the steps under it open.
  cutscenes: [
    { x: 13, y: 13, w: 4, h: 1, scene: 'wreck_slip_home' },
    { x: 25, y: 5, w: 6, h: 2, scene: 'point_boat', gear: 'log_page_5' },
    { x: 25, y: 8, w: 6, h: 2, scene: 'point_boat', gear: 'log_page_5' },
    { x: 25, y: 7, w: 2, h: 1, scene: 'point_boat', gear: 'log_page_5' },
    { x: 30, y: 7, w: 1, h: 1, scene: 'point_boat', gear: 'log_page_5' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wreck.txt',
  props: [
    { sprite: 'savepoint', x: 6, y: 5, save: true },
    // A green updraft: find it, and you can travel here from save points (src/data/travel.js).
    { sprite: 'travel_draft', x: 7, y: 5, travel: 'wreck_slip', animation: 'travel_draft', speed: 0.14, notice: true, walkable: true },
    // Haddock on the slip (footprint 2: 15 and 16; the way past him is x 13-14), and the Bother.
    { sprite: 'cf_haddock', x: 15, y: 10, npc: 'haddock_wreck', animation: 'cf_haddock', speed: 0.5, until: 'haddock_gone' },
    { sprite: 'cf_bother', x: 17, y: 13, text: 'slip_bother', animation: 'cf_bother', speed: 0.5 },
    { sprite: 'sign', x: 11, y: 7, text: 'slip_sign' },
    { sprite: 'c5_net_frame', x: 7, y: 7, text: 'slip_nets' },
    // The old fog bell's post on the point (secret): its plate (27,4) and the frame (29,4) with nothing in its bracket. The bell
    // was taken down a long time ago; where it went is the last page of the Fair Return's log.
    { sprite: 'sign', x: 27, y: 4, text: 'slip_fog_bell_post' },
    { sprite: 'c5_bell_frame_empty', x: 29, y: 4, text: 'slip_fog_bell_gone' },
    { sprite: 'c5_lobster_pots', x: 20, y: 7, text: 'hull_pots' },
    { sprite: 'c5_tattered_sail', x: 23, y: 9, text: 'gate_sail', animation: 'c5_tattered_sail', speed: 0.4 },
    { sprite: 'c5_anchor', x: 3, y: 8, text: 'gate_anchor' },
    { sprite: 'c5_snapped_mast', x: 24, y: 14, text: 'gate_mast' },
    { sprite: 'c5_chain_bollard', x: 12, y: 10, text: 'slip_bollard' },
    { sprite: 'gold_pouch', x: 28, y: 5, text: 'slip_pouch', gold: 90, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The cove's waterline: weed hanging off the shingle's lip, barnacles up the slip's sides, a
    // mooring post with a rope still on it beside the slip, a beam and planks and a swamped
    // boat out on the water; up the shingle, the tide's line of wrack, an old boat keel-up, and
    // what the gulls and crabs have been doing.
    { sprite: 'wy_weed_fringe', x: 6, y: 11, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe_b', x: 10, y: 11, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe', x: 20, y: 11, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe_b', x: 24, y: 11, flat: true, walkable: true },
    { sprite: 'wy_edge_r', x: 12, y: 13, flat: true, walkable: true },
    { sprite: 'wy_edge_l', x: 17, y: 12, flat: true, walkable: true },
    { sprite: 'wy_mooring_post', x: 12, y: 12 },
    { sprite: 'wy_timber_sunk', x: 4, y: 14, flat: true, walkable: true },
    { sprite: 'wy_plank_slick', x: 9, y: 15, flat: true, walkable: true },
    { sprite: 'wy_boat_swamped', x: 28, y: 12, flat: true, walkable: true },
    { sprite: 'wy_weed_mat', x: 20, y: 15, flat: true, walkable: true },
    { sprite: 'wy_ribs_jag', x: 2, y: 12 },
    { sprite: 'c5_wrack_line', x: 5, y: 9, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 21, y: 9, flat: true, walkable: true },
    // The old boat on the point, keel up, weighted with stones, lying over the fog-watch's steps. Rolled off them (point_boat),
    // it lies keel up at the water's edge, and the steps (a door) go down. (A save from before 14 November that had already
    // called the ship at the old bell here, ship_looms, finds the steps open too, so it can get back to her.)
    { sprite: 'c5_boat_upturned', x: 27, y: 7, text: 'slip_point_boat', until: ['point_boat', 'ship_looms'] },
    { sprite: 'c5_boat_upturned', x: 27, y: 9, text: 'slip_point_boat_rolled', after: ['point_boat', 'ship_looms'] },
    { sprite: 'gs_point_steps', x: 27, y: 7, text: 'slip_point_steps', flat: true, walkable: true, after: ['point_boat', 'ship_looms'] },
    { sprite: 'c5_driftwood', x: 9, y: 4, flat: true, walkable: true },
    { sprite: 'c5_seaweed_heap', x: 18, y: 5, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 22, y: 6, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 14, y: 4, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 25, y: 6, flat: true, walkable: true },
    { sprite: 'col_glass_brown', x: 30, y: 2, walkable: true, flat: true, gives: 'glass_brown', taken: { gone: true } },
    // LIFE-PASS-BEGIN (builder 3, 2026-11-14): rock-pool life, shells, kelp, the odds the sea left. Everything here is walkable, so nothing is ever in anyone's way.
    { sprite: 'shore_tally_post', x: 21, y: 2, text: 'sl_tally', walkable: true },
    { sprite: 'c5_puddle', x: 1, y: 8, text: 'sl_puddle', flat: true, walkable: true },
    { sprite: 'shore_kettle', x: 23, y: 2, text: 'sl_kettle', walkable: true },
    { sprite: 'c5_oar_stuck', x: 14, y: 7, text: 'sl_oar', walkable: true },
    { sprite: 'c5_lantern_fallen', x: 3, y: 6, text: 'sl_lantern', flat: true, walkable: true },
    { sprite: 'shore_chalk_arrow', x: 2, y: 2, text: 'sl_chalk_arrow', walkable: true },
    { sprite: 'shore_anemone_pool', x: 11, y: 2, text: 'sl_anemone_a', flat: true, walkable: true, animation: 'shore_anemone_pool', speed: 0.5 },
    { sprite: 'shore_fishbones', x: 14, y: 5, text: 'sl_bones', flat: true, walkable: true },
    { sprite: 'shore_starfish', x: 8, y: 2, text: 'sl_star_a', flat: true, walkable: true },
    { sprite: 'shore_crab_shell', x: 18, y: 8, text: 'sl_crabshell', flat: true, walkable: true },
    { sprite: 'shore_bottle', x: 14, y: 3, text: 'sl_bottle', walkable: true },
    { sprite: 'wy_weed_mat', x: 5, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'wy_plank_slick', x: 6, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'wy_cargo_spill', x: 23, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'wy_chain_pile', x: 19, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate', x: 11, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate_b', x: 22, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 11, y: 5, flat: true, walkable: true, decor: true },
    { sprite: 'c5_crab_trail', x: 4, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'c5_gull_marks', x: 21, y: 5, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 23, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate', x: 16, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'c5_planks_scatter', x: 10, y: 5, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat', x: 22, y: 5, flat: true, walkable: true, decor: true },
    { sprite: 'wy_plank_slick', x: 18, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'wy_cargo_spill', x: 3, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'wy_chain_pile', x: 17, y: 2, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate', x: 23, y: 5, flat: true, walkable: true, decor: true },
    { sprite: 'shore_rust_plate_b', x: 21, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'c5_shingle_spill', x: 1, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'c5_crab_trail', x: 12, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'c5_gull_marks', x: 12, y: 5, flat: true, walkable: true, decor: true },
    { sprite: 'wy_timber_sunk', x: 10, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat', x: 30, y: 12, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat', x: 27, y: 14, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat', x: 18, y: 15, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat_b', x: 30, y: 16, flat: true, walkable: true, decor: true },
    { sprite: 'wy_plank_slick_b', x: 1, y: 15, flat: true, walkable: true, decor: true },
    { sprite: 'wy_plank_slick_b', x: 8, y: 15, flat: true, walkable: true, decor: true },
    { sprite: 'wy_plank_slick_b', x: 15, y: 15, flat: true, walkable: true, decor: true },
    // LIFE-PASS-END
  ],
  tileTexts: { '#': 'gate_edge', W: 'slip_cliff', '~': 'gate_water', o: 'slip_planks', x: 'hull_barnacles', O: 'hull_cargo', F: 'hull_net', J: 'fog_stump' },

  // None: a save room.
  npcs: [
  ],
};
