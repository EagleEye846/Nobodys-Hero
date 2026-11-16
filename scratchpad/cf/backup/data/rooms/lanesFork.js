// THE FORK: the first of the Sunken Lanes, down off Saltcombe's lookout. A muddy lane between
// weed-choked hedges comes to a fork under a leaning signpost. The north-east lane goes on,
// dry for now, toward the causeway; the south-east lane walks straight into the floodwater
// and keeps going underneath it, hedges and all, the way every road here used to. A cottage
// stands up to its windows in the flood. PUZZLE-FREE, and no monsters (an area's first room).
// Tile key (see src/overworld/coastTiles.js, lanes):
//   #  rock top (solid)   W  mossy stone face (solid)   ,  turf   :  mud lane   .  drowned cobbles
//   ;  shallows (walk)   ~  floodwater (solid)   Z  weed-tangled hedge (solid)   x  barnacle rock
//   J  a drowned gatepost (solid)

export const LANES_FORK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'lanes_fork',
  // The room's name, for the Room Editor.
  name: 'THE FORK',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'lanes',
  // The Sunken Lanes' song (src/data/music/lanesTheme.js), and the sounds of the place under it.
  music: 'lanes',
  ambience: 'storm_shore',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_shore', lamplight: { shade: 0.18, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,

  tiles: [
    '########################################',
    '##WWWWW###WWWWWWWWWWWWWWWWWWW###WWWWWW##',
    '#W,,,,,WWW,,,,,,,,,Z,,,,,x,,,WWW,,,,,,W#',
    '#,,,,.,,,,,,,,,,,,ZZ,,,,,x,,,:,,,,,,.,,#',
    '#,,,,..,,,,,,,,,,:::::::::::::::::::::::',
    '#,,ZZ,,,,,,,Z,,,:::::,,::::::::,,:::::::',
    '#ZZZZ,,,ZZZZZ,,,::,,,,ZZ,,,,,,,,,,Z,,,,#',
    '#,Z,,,,,,,Z,,,,,::,ZZZZZZZ,,ZZZ,ZZZZZZZ#',
    '::::::::::::::::::,,,,,,,,Z,,,,,,,,,,,,#',
    ':::::,::::::::::::,,,,,,;;;;,;;;;;;;,;;#',
    '#,,,,,Z,,,,Z,...::,,,;;~~~~~~~;;~~~;~~;#',
    '#,ZZZZZZ,,,ZZ...::,,,;~~~~~~~~~x~~~~~~~#',
    '#,,Z,,,,,,,,,..,:::::;~;;;;~~~~~~~~~~~~#',
    '#,,,,,.,,,,,,,..,::::;~;;;~~~~~~~x~~x~~#',
    '#,x,,..,,,,,,,,,,,,,;~~~~~~~J~~~~~~~~~~#',
    '#xO,,,,,,x,,,,,,,,,;;~~~~~x~~~~~~~~~~~~#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '########################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // West, back up the cliff path to Saltcombe's lookout (its east door is x 35, rows 9-11).
    { x: 0, y: 8, w: 1, h: 2, to: 'saltcombe_lookout', spawn: { x: 34, y: 10 } },
    { x: 39, y: 4, w: 1, h: 2, to: 'lanes_causeway', spawn: { x: 2, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/lanes.txt',
  props: [
    // The signpost at the fork, a lamp on its post, the cottage in the flood, and the lane's odds and ends.
    { sprite: 'ln_signpost', x: 18, y: 8, text: 'fork_signpost' },
    { sprite: 'street_lamp', x: 15, y: 7, text: 'fork_lamp' },
    { sprite: 'c5_halfsunk_cottage', x: 33, y: 11, text: 'fork_cottage' },
    { sprite: 'sign', x: 3, y: 7, text: 'fork_sign' },
    { sprite: 'c5_buoy_red', x: 20, y: 14, text: 'fork_buoy' },
    { sprite: 'c5_barrel', x: 13, y: 10, text: 'fork_barrel' },
    { sprite: 'c5_seaweed_heap', x: 10, y: 14, text: 'fork_weed' },
    { sprite: 'gold_pouch', x: 2, y: 3, text: 'fork_pouch', gold: 60, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Dressing (2026-11-08): how far the flood came up the lane, and what it left. A rowboat it
    // lifted over the hedge and set down keel-up on the lawn, its high-water line of weed,
    // sandbags someone piled where the lane goes under, a lantern hung for the last ones out.
    { sprite: 'c5_boat_upturned', x: 4, y: 13 },
    { sprite: 'c5_wrack_line', x: 16, y: 14, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 26, y: 8, flat: true, walkable: true },
    { sprite: 'c5_sandbags', x: 19, y: 10 },
    { sprite: 'c5_lantern_hook', x: 30, y: 6 },
    { sprite: 'c5_puddle', x: 8, y: 8, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 24, y: 4, flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 11, y: 15, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 36, y: 3, flat: true, walkable: true },
    // Second pass: the lane going on under the flood. Its picket fence wading in, a cart that
    // didn't make it, a bean bed with its leaves on the water, weed mats, and the old garden
    // walls lying dark on the bottom. A washing line on the lawn nobody came back for.
    { sprite: 'ln_under_a', x: 27, y: 14, flat: true, walkable: true },
    { sprite: 'ln_under_b', x: 33, y: 15, flat: true, walkable: true },
    { sprite: 'ln_sunk_fence', x: 23, y: 11, text: 'dress_sunk_fence' },
    { sprite: 'ln_sunk_cart', x: 29, y: 15, text: 'dress_sunk_cart' },
    { sprite: 'ln_sunk_bed', x: 36, y: 14, text: 'dress_sunk_bed' },
    { sprite: 'ln_lily_mat', x: 31, y: 12, flat: true, walkable: true },
    { sprite: 'ln_lily_mat_b', x: 22, y: 15, flat: true, walkable: true },
    { sprite: 'ln_lily_small', x: 37, y: 11, flat: true, walkable: true },
    { sprite: 'ln_lily_small', x: 27, y: 13, flat: true, walkable: true },
    { sprite: 'mw_laundry_line', x: 11, y: 3, text: 'dress_washing' },
    { sprite: 'ln_moss_a', x: 13, y: 11, flat: true, walkable: true },
    { sprite: 'ln_moss_b', x: 5, y: 13, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 8, y: 2, walkable: true, decor: true },
    // Life pass (14 November 2026): belongings, signs, trees and small life.
    { sprite: 'lv_porch', x: 4, y: 2, text: 'lp_porch', walkable: true },
    { sprite: 'lv_sill', x: 14, y: 1, text: 'lp_sill', walkable: true },
    { sprite: 'lv_letterbox', x: 15, y: 4, text: 'lp_letterbox', walkable: true },
    { sprite: 'lv_bench', x: 8, y: 5, text: 'lp_bench', walkable: true },
    { sprite: 'lv_rain_barrel', x: 22, y: 3, text: 'lp_rainbarrel', walkable: true },
    { sprite: 'lv_sign_lane', x: 30, y: 3, text: 'lp_lanesign', walkable: true },
    { sprite: 'lv_scarecrow', x: 9, y: 13, text: 'lp_scarecrow', walkable: true },
    { sprite: 'sign', x: 18, y: 15, text: 'lp_nofishing', walkable: true },
    { sprite: 'lv_milestone', x: 27, y: 5, text: 'lp_milestone', walkable: true },
    { sprite: 'lv_apple_tree', x: 28, y: 12, text: 'lp_appletree' },
    { sprite: 'lv_chimney', x: 36, y: 13, text: 'lp_chimney' },
    { sprite: 'lv_reeds', x: 21, y: 9, walkable: true, animation: 'lv_reeds', speed: 0.35, decor: true },
    { sprite: 'lv_ivy', x: 22, y: 1, walkable: true, decor: true },
    { sprite: 'lv_toadstools', x: 13, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'lv_boards', x: 12, y: 8, flat: true, walkable: true, decor: true },
    { sprite: 'lv_cat_bowl', x: 6, y: 3, text: 'lp_catbowl', walkable: true },
    { sprite: 'lv_churn', x: 2, y: 5, text: 'lp_churn', walkable: true },
    { sprite: 'lv_skep', x: 15, y: 14, text: 'lp_skep', walkable: true },
    { sprite: 'lv_willow', x: 33, y: 3, text: 'lp_willow', walkable: true },
    { sprite: 'gold_pouch', x: 32, y: 2, text: 'lp_nook_pouch', walkable: true, gold: 70, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_toy_boat', x: 34, y: 2, text: 'lp_toyboat', walkable: true },
    { sprite: 'c5_puddle', x: 8, y: 3, flat: true, walkable: true, decor: true },
    { sprite: 'lv_gnome', x: 20, y: 15, npc: 'lp_gnome', quest: [
      { needs: ['has:lane_worm'], take: 'lane_worm', set: ['q_gnome_done'], give: 'gnome_catch', text: 'gnome_done' },
      { needs: ['q_gnome_done'], text: 'gnome_after' },
      { needs: ['q_gnome_asked'], text: 'gnome_wait' },
      { needs: ['!q_gnome_asked'], set: 'q_gnome_asked', text: 'gnome_ask' },
    ] },
  ],
  tileTexts: { '#': 'lanes_rock', W: 'lanes_rock', '~': 'fork_flood', ';': 'fork_shallows', Z: 'lanes_hedge', x: 'lanes_stone', J: 'fork_gatepost' },

  // None: the first room of the Lanes.
  npcs: [],
};
