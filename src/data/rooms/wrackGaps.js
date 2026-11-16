// THE GAPS: a corridor of shingle between two rock walls, and one narrow place (27,11) where
// the ridge pinches it to a single tile. PUZZLE-FREE: a breather between the pools' tide and
// the dunes' gusts, where the trouble is the limpet knight that patrols right in front of the
// pinch. North of the ridge, a pocket of rock-pool behind a heap of weed, out of reach, for the
// look of it. (2026-11-10: there was a gate across the pinch, opened by a wheel in the pocket
// that only Bramble could reach through a tunnel in the weed: one Bramble-only split too many.
// The old file is in notes/room-backup-2026-11-10b/.)
// Tile key (see src/overworld/coastTiles.js, wrack):
//   #  cliff top (solid)   W  cliff face (solid)   .  wet shingle   ,  salt grass
//   ;  shallows (walk)   ~  sea (solid)   x  barnacle rock (solid)   F  weed pile

export const WRACK_GAPS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wrack_gaps',
  // The room's name, for the Room Editor.
  name: 'THE GAPS',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wrack',
  // The Wrack Shore's song (src/data/music/wrackTheme.js), and the sounds of the place under it.
  music: 'wrack',
  ambience: 'storm_shore',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_shore', lamplight: { shade: 0.16, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,



  tiles: [
    '######################################',
    '#############################~~~~~~~~#',
    '###,,,,####,,,,,,############~~~~~~x~#',
    '##,,,,,,##,,,O,,,,###WWW####~~~^~~~~~#',
    '##,,O,,,##,,,,,,,,J,#...####~~~~~~~~~#',
    '##,,,,J,#,,,,O,,,,,,##;#####~~~~~xx~~#',
    '##,,,,,,#WWWWWWWWWWWWW;#####~~x~~~~~~#',
    '####,,###.....;;;;;;;;;######~~~~~~~##',
    '#########.....;###############~~~~~###',
    '#WWWWWWWWWWFWWW####W##WWWWW#WWWWWWWWW#',
    '#.F............WWWW.WW.....W,,,,,,,,,#',
    '................x...........,,,,,,,,,#',
    '...;;...................x..#,.........',
    '#...;...............;;.....#,...;.....',
    '#.....x...Ox...............#,....F..x#',
    '#x.......OxxO.........xxO..#.....Ox..#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '######################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 12 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 11, w: 1, h: 2, to: 'wrack_pools', spawn: { x: 42, y: 9 } },
    { x: 37, y: 12, w: 1, h: 2, to: 'wrack_dunes', spawn: { x: 2, y: 10 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wrack.txt',
  props: [
    { sprite: 'sign', x: 5, y: 11, text: 'gaps_sign' },
    { sprite: 'c5_driftwood_tall', x: 18, y: 11, text: 'gaps_driftwood' },
    { sprite: 'c5_barrels', x: 33, y: 14, text: 'landing_barrel' },
    { sprite: 'c5_rope_coil', x: 30, y: 12, text: 'landing_pots', walkable: true },
    { sprite: 'gold_pouch', x: 35, y: 10, text: 'gaps_pouch', gold: 40, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Dressing (second pass), kept to the edges of the corridor and clear of the pinch and the doors.
    { sprite: 'c5_rocks_weedy', x: 13, y: 15, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 21, y: 15, text: 'shore_rocks' },
    { sprite: 'c5_drift_fire', x: 3, y: 10, text: 'shore_fire' },
    { sprite: 'c5_lantern_hook', x: 25, y: 10, text: 'shore_lantern' },
    { sprite: 'c5_lantern_hook', x: 36, y: 11, text: 'shore_lantern' },
    { sprite: 'c5_wrack_line', x: 6, y: 14, flat: true, walkable: true },
    { sprite: 'c5_rock_pool', x: 14, y: 12, flat: true, walkable: true },
    { sprite: 'c5_weed_mat', x: 18, y: 14, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 22, y: 12, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 9, y: 10, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 16, y: 10, flat: true, walkable: true },
    // The turf past the pinch.
    { sprite: 'c5_fence_broken', x: 31, y: 10, text: 'shore_fence' },
    { sprite: 'c5_rock_weedy', x: 35, y: 15, text: 'shore_rocks' },
    { sprite: 'c5_marram', x: 29, y: 11, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 33, y: 11, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 34, y: 13, flat: true, walkable: true },
    // The pocket behind the weed and the grass up on the cliff.
    { sprite: 'c5_rock_weedy', x: 9, y: 8, text: 'shore_rocks' },
    { sprite: 'c5_marram', x: 10, y: 7, flat: true, walkable: true },
    { sprite: 'c5_rocks_weedy', x: 2, y: 3, text: 'shore_rocks' },
    { sprite: 'c5_marram', x: 5, y: 3, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 3, y: 6, flat: true, walkable: true },
    // Stones in the sea.
    { sprite: 'c5_rocks_weedy', x: 31, y: 4, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 29, y: 7, text: 'shore_rocks' },
    // LIFE-PASS-BEGIN (builder 3, 2026-11-14): rock-pool life, shells, kelp, the odds the sea left. Everything here is walkable, so nothing is ever in anyone's way.
    { sprite: 'shore_bottle', x: 12, y: 12, text: 'sl_gap_bottle', walkable: true },
    { sprite: 'c5_net_torn', x: 14, y: 3, text: 'sl_net', flat: true, walkable: true },
    { sprite: 'c5_boat_upturned', x: 5, y: 6, text: 'sl_dinghy' },
    { sprite: 'c5_rope_coil', x: 21, y: 12, text: 'sl_rope', walkable: true },
    { sprite: 'shore_shells', x: 3, y: 12, text: 'sl_shells_a', flat: true, walkable: true },
    // LIFE-PASS-END
  ],
  tileTexts: { '#': 'landing_cliff', W: 'landing_cliff', '~': 'landing_sea', x: 'gaps_rock', F: 'landing_weed', ';': 'gaps_shallows' },

  // A pinwheel in the west corridor (row 13, x 5 to 14), a limpet knight walking to and fro right in
  // front of the pinch (row 11, x 23 to 26), and a shellac east of it (row 14, x 29 to 32, kept four
  // tiles off the dunes door's spawn at 36,13). No cutscenes in this room.
  npcs: [
    { enemy: 'pinwheel', x: 8, y: 13, patrol: [5, 14], behaviour: 'wander' },
    { enemy: 'limpet_knight', x: 25, y: 11, patrol: [23, 26], behaviour: 'patrol' },
    { enemy: 'shellac', x: 30, y: 14, patrol: [29, 32], behaviour: 'patrol' },
  ],
};
