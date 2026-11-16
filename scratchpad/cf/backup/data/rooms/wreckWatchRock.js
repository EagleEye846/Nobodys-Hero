// THE WATCH ROCK (secret, optional: the Fair Return's fog bell). Out of the mouth of the cave under the point (the
// cave's east side, wreck_under_point), on the open-sea side of the Wreck Yard's point: a shelf of black rock at the
// cliff's foot, and out across the water a knuckle of rock where the old fog-watch used to stand, with the stump of
// their stone beacon. The men who took the Fair Return's bell down off the slip's point hung it here, on an iron arm
// leaded into the stump, where nobody would ever ring it. They took its tongue out first (it is the Drowned Rat's
// doorstop now). Puzzle-free in the usual sense: the puzzle is the whole trail, and here it is the tide and the fog.
//
// THE TIDE (shared with the cave, `group: 'watch_rock'`, on its clock): at LOW a weedy bar of shingle and rock pools
// winds across from the shelf to the rock (x 9 to 16); at HIGH it is under water. The shelf and the rock are dry at
// both tides; anyone caught on the bar is lifted onto one or the other, and the clock always brings the low back.
// THE FOG (`tideFog`, atmosphere.js): the fog comes in with the flood and goes out with the ebb. The bell (the lever
// `fog_bell`) only takes in the fog, at high water (`onlyTide`); rung at low it rings out over clear water and nothing
// answers ([rock_bell_clear]). So: cross at low, wait on the rock for the flood and the fog, ring.
// THE SCENES: bell_found (once, first time up onto the rock: the bell is silent, its tongue gone, the tag on it);
// clapper_fitted (once, back with the tongue: it goes back in); ship_looms (once, the bell's own scene, rung in fog: the
// fog wall to the east parts on a line of stones running out to her; the door at 33, rows 7-8, goes to ship_plank).
// After ship_looms the fog stays in for good (`tideFog.after`): she has come, and her fog with her.
// Tile key (see src/overworld/coastTiles.js, wreck, painted in the `wreckrock` look):
//   #  cliff top (solid)   W  cliff (solid)   q  shingle   ~  green-black water (solid)   j  stepping stones (walk)
//   x  barnacled rock (solid)   ,  sea-pink turf   ;  rock pool (walk, low only)   N  weed (walk)

export const WRECK_WATCH_ROCK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wreck_watch_rock',
  // The room's name, for the Room Editor.
  name: 'THE WATCH ROCK',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wreck',
  // The point's bare rock (coastTiles.js `wreckrock`): natural cliffs, not the yard's hull plate.
  tileLook: 'wreckrock',
  // The point's cliff on the west side is drawn as weathered open-air rock (coastTiles.js `crag`), not the dark mass.
  crag: [{ x: 0, y: 1, w: 8, h: 16 }],
  // "Port Tomorrow" (the ghost ship's own song), from here: she is close.
  music: 'ghostShip',
  ambience: 'wreck_yard',
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, drips: 0.4, gulls: 0.4, shimmer: 0.5 }, ambience: 'calm_wreck_yard', lamplight: { shade: 0.26, tint: '34, 44, 68' }, skyline: true },
  // The sea fog comes in with the flood and goes out with the ebb (atmosphere.js). Thin at low water, thick at high.
  // Once she has sailed (crew_go_free, 2026-11-14) her fog has gone with her, at both tides: it thins away in the scene.
  tideFog: { high: 2, low: 0.12, speed: 0.5, after: 'ship_looms', lifted: 'crew_go_free', liftedTo: 0.05 },
  // And "Port Tomorrow" goes with her: the yard's own song.
  musicAfter: { scene: 'fair_return_gone', song: 'wreck' },
  atmosphere: { fog: 0.12 },
  vesWell: true,
  lastLight: { x: 27, y: 15 },
  // No far-off wrecks where the Fair Return comes alongside (x 32-43).
  skylineKeepOut: [{ x: 32, y: 0, w: 12, h: 18 }],
  skyline: [
    { kind: 'mast', x: 25, y: 14, lean: -1, tall: 46 },
  ],

  // The HIGH-water map.
  tiles: [
    '############################################', // 0
    '#####WWW~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', // 1
    '###WWWWW~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', // 2
    '###WWqW~~~~~~~~~~~~~~~xqq~~~~~~~~~~~~~~~~~~~', // 3
    '##WWWq,~~~~~~~~~~~~~xqqqqq,~~~~~~~~~~~~~~~~~', // 4
    '#WWqq,qq~~~~~~~~~~~q,qqqqqqx~~~~~~~~~~~~~~~~', // 5
    'WWWqqqqqq~~~~~~~~~qqqqqqqqqqqx~~~~~~~~~~~~~~', // 6
    'WWWqqqqqq~~~~~~~~~qqqqqqqqqqqqjjjjjjj~~~~~~~', // 7
    'qqqqqqqqq~~~~~~~~qqqqqqqqqqqqqjjjjjjj~~~~~~~', // 8
    '###q,qqqq~~~~~~~~~qqqqqqqqqqqq~~~~~~~~~~~~~~', // 9
    '###qqqqq~~~~~~~~~~~q,qqqqqqqx~~~~~~~~~~~~~~~', // 10
    '###qqxqq~~~~~~~~~~~~qxqqq,q~~~~~~~~~~~~~~~~~', // 11
    '#####qq~~~~~~~~~~~~~~~qqxq~~~~~~~~~~~~~~~~~~', // 12
    '##W#WWx~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', // 13
    'WWWWW~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', // 14
    'WWW~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', // 15
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', // 16
    '############################################', // 17
  ],

  // The tide (tides.js): at LOW the bar from the shelf to the rock, and a fringe of wet shingle and pools round both.
  tide: {
    start: 'high',
    group: 'watch_rock',
    clock: { high: 22, low: 30, warn: 4 },
    low: [
      '                                            ',
      '                                            ',
      '                                            ',
      '                                            ',
      '       ;                                    ',
      '        ;                                   ',
      '         q                                  ',
      '         qq;q   ;                           ',
      '         qqqqqq;qq                          ',
      '         ;qNqqqqqq                          ',
      '        q  ;qqNqq;q                         ',
      '        ;   qq;;q          q                ',
      '       q             q     ;                ',
      '                                            ',
      '                                            ',
      '                                            ',
      '                                            ',
      '                                            ',
    ],
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Back into the cave under the point (its mouth, on the shelf: dry at both tides).
    { x: 0, y: 8, w: 1, h: 1, to: 'wreck_under_point', spawn: { x: 23, y: 10 } },
    // Out along the stones and through the gap in the Fair Return's rail (she lies off the rock, x 36-43), once she has come.
    // Gone once she has sailed (crew_go_free): the stones run out to open water, and the ship can't be reached again.
    { x: 36, y: 7, w: 1, h: 2, to: 'ship_plank', spawn: { x: 2, y: 7 }, after: 'ship_looms', until: 'crew_go_free' },
  ],

  // The bell, found silent (once); its tongue put back (once, carrying it). Both on the rock in front of the bell,
  // where you come up off the bar. (ship_looms is the bell's own scene, rung in the fog.)
  cutscenes: [
    { x: 19, y: 6, w: 6, h: 4, scene: 'bell_found' },
    { x: 19, y: 6, w: 6, h: 4, scene: 'clapper_fitted', after: 'bell_found', gear: 'bell_clapper' },
    // (2026-11-14) Her crew go free (crew_go_free, once): only if the captain AND the figurehead were both talked down.
    // Where you come back out of her: by her stern door (29,8) or down her plank (34,7).
    { x: 28, y: 7, w: 8, h: 2, scene: 'crew_go_free', afterAll: ['captain_spared', 'figurehead_spared'] },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wreck.txt',
  props: [
    // The way back into the cave: a cleft in the cliff, the shelf running on into the dark (the door at its back).
    { sprite: 'wy_rock_cleft', x: 0, y: 8, text: 'rock_mouth', walkable: true, flat: true },
    // THE BELL on the fog-watch's stump (22..23, row 5). Silent until its tongue is back (clapper_fitted); then the
    // lever `fog_bell`, which only takes at high water, in the fog (`onlyTide`), and calls her (ship_looms).
    // Once she has come (ship_looms) it is only a bell: it rings, and she is there already.
    { sprite: 'gs_watch_bell_mute', x: 22, y: 5, text: 'rock_bell_mute', until: ['clapper_fitted', 'ship_looms'] },
    { sprite: 'gs_watch_bell', x: 22, y: 5, text: 'rock_bell', lever: 'fog_bell', scene: 'ship_looms', onlyTide: 'high', notNow: 'rock_bell_clear',
      after: 'clapper_fitted', until: 'ship_looms', sound: 'bell', animation: 'gs_watch_bell', speed: 0.5 },
    { sprite: 'gs_watch_bell', x: 22, y: 5, text: 'rock_bell_after', after: 'ship_looms', sound: 'bell', animation: 'gs_watch_bell', speed: 0.5 },
    // The fog standing at the end of the stones (31, rows 7-8) like a shut door, until she comes (the bell opens it; once
    // ship_looms has played it is simply gone, which also lets a save that called her at the old slip bell back aboard).
    { sprite: 'gs_fog_wall', x: 31, y: 7, text: 'rock_fog_wall', opensWith: ['fog_bell'], openText: 'rock_bell', until: 'ship_looms' },
    { sprite: 'gs_fog_wall_b', x: 31, y: 8, text: 'rock_fog_wall', opensWith: ['fog_bell'], until: 'ship_looms' },
    { sprite: 'gs_fog_c', x: 29, y: 10, flat: true, walkable: true },
    // HER: the Fair Return lying off the rock once the bell has called her (the scene shows her coming; gs_hull_rock covers
    // x 36-43, rows 0-16, the gap in her rail at rows 7-8 where the stones meet her), a cold lantern at the gap, fog round her.
    // All four gone once she has sailed (crew_go_free plays them leaving; fair_return_gone is its `sees`).
    { sprite: 'gs_hull_rock', x: 36, y: 16, flat: true, walkable: true, cast: 'fair_return', after: ['ship_alongside', 'ship_boarding'], until: 'fair_return_gone' },
    // Her boarding plank, lying down across the stones from the gap in her rail (it swung down in ship_looms).
    { sprite: 'gs_gangway_down', x: 31, y: 9, flat: true, walkable: true, cast: 'fr_gangway', after: ['ship_alongside', 'ship_boarding'], until: 'fair_return_gone' },
    { sprite: 'gs_post_lantern', x: 35, y: 6, cast: 'fr_lantern', after: ['ship_alongside', 'ship_boarding'], until: 'fair_return_gone', text: 'rock_her_side' },
    { sprite: 'gs_fog_a', x: 33, y: 12, flat: true, walkable: true, cast: 'fr_fog_a', after: 'ship_looms', until: 'fair_return_gone' },
    { sprite: 'gs_fog_b', x: 34, y: 3, flat: true, walkable: true, cast: 'fr_fog_b', after: 'ship_looms', until: 'fair_return_gone' },
    // The fog-watch's things: their lantern on its post (cold), a ring for a boat, the stones they sat on.
    { sprite: 'c5_lantern_post_unlit', x: 26, y: 6, text: 'rock_hook' },
    { sprite: 'c5_chain_bollard', x: 19, y: 10, text: 'rock_ring' },
    { sprite: 'c5_rocks_weedy', x: 25, y: 10, text: 'rock_stones' },
    { sprite: 'c5_rock_pool', x: 21, y: 9, flat: true, walkable: true, text: 'rock_pool' },
    // The shelf at the cliff's foot: weed, a stump of an old post, wrack.
    { sprite: 'c5_seaweed_heap', x: 4, y: 6, text: 'rock_weed' },
    { sprite: 'c5_wrack_line', x: 3, y: 10, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 6, y: 7, flat: true, walkable: true },
    { sprite: 'wy_mooring_post', x: 7, y: 5 },
    // The water's edges round the shelf and the rock (on water at both tides), and the yard's leavings far out.
    { sprite: 'wy_weed_fringe', x: 5, y: 12, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe_b', x: 22, y: 12, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe', x: 27, y: 11, flat: true, walkable: true },
    { sprite: 'wy_timber_sunk', x: 13, y: 14, flat: true, walkable: true },
    { sprite: 'wy_ribs_jag', x: 30, y: 13 },
    { sprite: 'wy_plank_slick', x: 12, y: 3, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 24, y: 8, flat: true, walkable: true },
    // The rock's top: weed mats in the hollows where the spray lies, gull marks, a scatter of old stones.
    { sprite: 'wy_weed_mat', x: 27, y: 8, flat: true, walkable: true },
    { sprite: 'wy_weed_mat_b', x: 19, y: 6, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 25, y: 4, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 23, y: 10, flat: true, walkable: true },
  ],
  tileTexts: { '#': 'gate_edge', W: 'rock_cliff', '~': 'rock_water', x: 'hull_barnacles', j: 'rock_stepping', ';': 'point_pool', N: 'point_weed' },

  // None: the scenes here (bell_found, clapper_fitted, ship_looms) walk the whole rock.
  npcs: [],
};
