// THE DROWNED CHAPEL: the sounders' chapel, cut into the rock under the Echo Hall, where they
// prayed for calm water before going down. The sea got in long ago. From the gallery at the door
// you look over a flooded nave, pews standing in the black water, to the altar and the stair down
// behind it. The chapel's own sluice is seized; its rod goes up through the roof toward the Three
// Wells, and the sluice wheel there drains it (`group: 'soundings_chapel'`, LOW). At LOW the nave
// floor comes up between the pillars and you walk to the dais: the chest with the GLASS-FLOAT
// STAFF in the west side chapel, the altar, and the stair down to the Weight Room. The aisles stay
// deep at both tides. Indoors (the cave's inside look, no rain).
// Tile key (see src/overworld/coastTiles.js, soundings):
//   #  rock top (solid)   W  cave rock face (solid)   X  flagstones   ;  a puddle   ~  water (solid)
//   I  a pillar   x  glowing sea-glass (solid)   s  the stair down

export const SOUNDINGS_DROWNED_CHAPEL = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'soundings_drowned_chapel',
  // The room's name, for the Room Editor.
  name: 'THE DROWNED CHAPEL',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'soundings',
  indoors: true,
  // The Soundings' song ("The Soundings"), and the sounds of a sea cave under it.
  music: 'soundings',
  ambience: 'sea_cave',
  // After chapter 5 the storm is over (`calmAfter`): the same cave sounds, but the sky in the
  // cave mouth of its fights clears (coastBackdrops.js) and any `_calm` words are used.
  calmAfter: { scene: 'the_light_answers', ambience: 'sea_cave' },
  vesWell: true,

  // The HIGH-water map.
  tiles: [
    '################XX################',
    '#WWWWWWWWWWWWWWWXXWWWWWWWWWWWWWWW#',
    '#xxXXXXXX..XXXXXXXXXXXXXXX..XXXxx#',
    '#xXXX.XX....XXXXXXXXXXX..XXXXXXXx#',
    '#XXXXXXX..XXXXXXX..XXX....XXX.XXX#',
    '#~~~XXX.XXXXXX.XXXXXXXXXXXXXXX~~~#',
    '#~~~~XX~~~~~~~~~~~~~~~~~~~~~XX~~~#',
    '#~~~~~I~~~~~~~~~~~~~~~~~~~~I~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~I~~~~~~~~~~~~~~~~~~~~I~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~I~~~~~~~~~~~~~~~~~~~~I~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~X~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~XXXXXXXXXXXXXXXXXXXXXXXXXXX~~~#',
    '#xXXXXXX...XXXXXXXXXX..XXXXXXXXXX#',
    '#XXXX.XXXX....XXXXXXXXX..XXXX.XXx#',
    '#xxXXXXXXXXX..XXXXXXXXXXXXXXXXXxx#',
    'WWWWWWWWWWWWWWWWssWWWWWWWWWWWWWWWW',
    '################ss################',
  ],

  // Set from the Three Wells' sluice; nothing here turns it. LOW: the nave (x 7 to 26, rows 6 to
  // 15) is a floor. The aisles, the gallery and the dais don't change.
  tide: {
    group: 'soundings_chapel',
    start: 'high',
    low: [
    '                                  ',
    '                                  ',
    '                                  ',
    '                                  ',
    '                                  ',
    '                                  ',
    '       XXXXXXXXXXXXXXXXXXXX       ',
    '       XXXXXXXXXXXXXXXXXXXX       ',
    '       XXX;;XXXXXXXXXXXXXXX       ',
    '       XXXXXXXXXXXX;XXXXXXX       ',
    '       XXXXXXXXXXXXXXXXXXXX       ',
    '       XXXXXXXXXXXXXXXXXXXX       ',
    '       XXXXXXXXXXXXXXX;XXXX       ',
    '       XXXXXXXXXXXXXXXXXXXX       ',
    '       XXXXXXX;XXXXXXXXXXXX       ',
    '       XXXXXXXXXXXXXXXXXXXX       ',
    '                                  ',
    '                                  ',
    '                                  ',
    '                                  ',
    '                                  ',
    '                                  ',
    ],
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 16, y: 2 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 16, y: 0, w: 2, h: 1, to: 'soundings_echo_hall', spawn: { x: 21, y: 21 } },
    { x: 16, y: 21, w: 2, h: 1, to: 'soundings_weight_room', spawn: { x: 4, y: 2 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/soundings.txt',
  props: [
    { sprite: 'c5_sluice_wheel', x: 4, y: 3, text: 'chapel_wheel' },
    { sprite: 'tide_dial', x: 29, y: 3, text: 'hall_dial', tideDial: true },
    { sprite: 'sign', x: 13, y: 2, text: 'chapel_board' },
    // Pews standing in the deep aisles.
    { sprite: 'c5_chapel_pews', x: 1, y: 8, text: 'chapel_pews', animation: 'c5_chapel_pews', speed: 0.5 },
    { sprite: 'c5_chapel_pews', x: 1, y: 12, text: 'chapel_pews', animation: 'c5_chapel_pews', speed: 0.55 },
    { sprite: 'c5_chapel_pews', x: 29, y: 8, text: 'chapel_pews', animation: 'c5_chapel_pews', speed: 0.5 },
    { sprite: 'c5_chapel_pews', x: 29, y: 12, text: 'chapel_pews', animation: 'c5_chapel_pews', speed: 0.45 },
    // The dais: the altar, the chest, a purse.
    { sprite: 'chapel_altar', x: 15, y: 17, text: 'chapel_altar' },
    { sprite: 'c5_chest', x: 3, y: 17, text: 'chapel_chest', gives: 'glass_float_staff', taken: { sprite: 'c5_chest_open', text: 'chest_empty' } },
    { sprite: 'gold_pouch', x: 30, y: 18, text: 'chapel_pouch', gold: 120, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_stalactite_drip', x: 10, y: 2, text: 'sound_drip', animation: 'c5_stalactite_drip', speed: 0.5 },
    { sprite: 'c5_stalactite_drip', x: 23, y: 2, text: 'sound_drip', animation: 'c5_stalactite_drip', speed: 0.6 },
    // What the flood left: its high-water line along the gallery's lip, stones down from the
    // roof, cracks the sea seeps up through, a pew's planks washed up on the dais, and the
    // lantern somebody dropped running for the stair.
    { sprite: 'c5_wrack_line', x: 8, y: 5, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 20, y: 5, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 7, y: 2, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 27, y: 4, flat: true, walkable: true },
    { sprite: 'c5_floor_crack', x: 19, y: 3, flat: true, walkable: true },
    { sprite: 'c5_floor_crack', x: 11, y: 18, flat: true, walkable: true },
    { sprite: 'c5_floor_crack', x: 25, y: 19, flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 7, y: 17, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 21, y: 18, flat: true, walkable: true },
    { sprite: 'c5_lantern_fallen', x: 19, y: 19, flat: true, walkable: true },
    { sprite: 'c5_rubble', x: 31, y: 17, flat: true, walkable: true },
    // The sounders' lantern by the gallery door, still lit, and their coil of line.
    { sprite: 'c5_lantern_hook', x: 19, y: 2 },
    { sprite: 'c5_rope_coil', x: 24, y: 2, walkable: true, flat: true },
    { sprite: 'c5_puddle', x: 6, y: 4, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 13, y: 5, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 4, y: 18, flat: true, walkable: true },
    // A pew's planks afloat in the nave (they settle on the floor when it's drained).
    { sprite: 'c5_planks_scatter', x: 12, y: 9, flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 21, y: 12, flat: true, walkable: true },
    // The chapel's furniture as the sea left it. The nave's pews stand in their rows under the
    // water, only their backs showing (flat, so the drained floor is still walkable); in the
    // aisles, where it's deep at both tides, a fallen pillar and stone down from the roof. The
    // font by the door, still full. Two broken ends of the rood screen at the dais's lip, with
    // a gap between for the way up from the nave, the altar's candlesticks (one knocked flat),
    // and bits of the coloured windows everywhere.
    { sprite: 'sd_pew_sunk', x: 8, y: 7, flat: true, walkable: true, text: 'chapel_nave_pews' },
    { sprite: 'sd_pew_sunk', x: 17, y: 7, flat: true, walkable: true, text: 'chapel_nave_pews' },
    { sprite: 'sd_pew_sunk', x: 22, y: 8, flat: true, walkable: true, text: 'chapel_nave_pews' },
    { sprite: 'sd_pew_sunk', x: 8, y: 10, flat: true, walkable: true, text: 'chapel_nave_pews' },
    { sprite: 'sd_pew_sunk', x: 15, y: 10, flat: true, walkable: true, text: 'chapel_nave_pews' },
    { sprite: 'sd_pew_sunk', x: 23, y: 11, flat: true, walkable: true, text: 'chapel_nave_pews' },
    { sprite: 'sd_pew_sunk', x: 10, y: 13, flat: true, walkable: true, text: 'chapel_nave_pews' },
    { sprite: 'sd_pew_sunk', x: 18, y: 14, flat: true, walkable: true, text: 'chapel_nave_pews' },
    { sprite: 'sd_column_fallen', x: 3, y: 15, text: 'chapel_column' },
    { sprite: 'sd_sea_rock', x: 3, y: 6 },
    { sprite: 'sd_sea_rock', x: 31, y: 7 },
    { sprite: 'sd_sea_rocks', x: 30, y: 15 },
    { sprite: 'sd_column_fallen', x: 28, y: 6, text: 'chapel_column' },
    { sprite: 'sd_font', x: 11, y: 3, text: 'chapel_font' },
    { sprite: 'sd_glass_shards', x: 22, y: 3, flat: true, walkable: true },
    { sprite: 'sd_glass_shards', x: 9, y: 4, flat: true, walkable: true },
    { sprite: 'sd_scree', x: 26, y: 2, flat: true, walkable: true },
    { sprite: 'sd_scree', x: 2, y: 4, flat: true, walkable: true },
    { sprite: 'sd_rood_screen', x: 7, y: 16, text: 'chapel_screen' },
    { sprite: 'sd_rood_screen', x: 24, y: 16, text: 'chapel_screen' },
    { sprite: 'sd_candlestick', x: 14, y: 17, text: 'chapel_candlestick' },
    { sprite: 'sd_candlestick', x: 18, y: 17, text: 'chapel_candlestick' },
    { sprite: 'sd_candlestick_fallen', x: 20, y: 18, flat: true, walkable: true },
    { sprite: 'sd_glass_shards', x: 9, y: 18, flat: true, walkable: true },
    { sprite: 'sd_glass_shards', x: 27, y: 18, flat: true, walkable: true },
    { sprite: 'sd_scree', x: 5, y: 19, flat: true, walkable: true },
    // Life pass (14 November 2026): belongings, signs, trees and small life.
    { sprite: 'lv_hymn_board', x: 6, y: 3, text: 'lp_hymn_board', walkable: true },
    { sprite: 'lv_votive_boats', x: 9, y: 3, text: 'lp_votive_boats', walkable: true },
    { sprite: 'lv_poor_box', x: 28, y: 18, text: 'lp_poor_box', walkable: true },
    { sprite: 'lv_kneelers', x: 22, y: 18, flat: true, walkable: true, decor: true },
    { sprite: 'lv_kneelers', x: 8, y: 18, flat: true, walkable: true, decor: true },
    { sprite: 'lv_candle_stubs', x: 12, y: 19, text: 'lp_candle_chapel', flat: true, walkable: true },
    { sprite: 'lv_candle_stubs', x: 25, y: 19, flat: true, walkable: true, decor: true },
    { sprite: 'lv_glove', x: 5, y: 19, text: 'lp_glove', walkable: true },
    { sprite: 'lv_cave_fern', x: 2, y: 18, walkable: true, decor: true },
    { sprite: 'lv_cave_fern', x: 32, y: 18, walkable: true, decor: true },
    { sprite: 'lv_glow_shelf', x: 32, y: 3, walkable: true, decor: true },
    { sprite: 'lv_chalk_arrow', x: 17, y: 5, flat: true, walkable: true, decor: true },
  ],
  tileTexts: { '#': 'sound_rock', W: 'sound_rock', '~': 'chapel_water', X: 'chapel_floor', ';': 'hall_puddle', I: 'chapel_pillar', x: 'sound_glass', s: 'chapel_stair' },

  // A PAIR at the dais's east end: a net wraith (row 17, x 26 to 28) and a wrackeel in the east
  // aisle just north of it (row 15, x 27 to 29: deep at both tides), close enough to fight together.
  // Clear of the chest (3,17), the altar (15 to 17), the stair (16 and 17), the purse (30,18) and
  // every tile the tide changes (the nave, x 7 to 26). No cutscenes here.
  npcs: [
    { enemy: 'net_wraith', x: 27, y: 17, patrol: [26, 28], behaviour: 'patrol' },
    { enemy: 'wrackeel', x: 28, y: 15, patrol: [27, 29], behaviour: 'patrol' },
  ],
};
