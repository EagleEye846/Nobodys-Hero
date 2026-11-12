// THE BOARDWALK: a plank path on stilts, zigzagging up the face of the headland toward
// Saltcombe, two boards wide, with rails on the sea side and the green sea churning below. A
// save crystal on the second flight, and a few lamps. Puzzle-free and no monsters. At the
// top (x 23 to 24) the path runs on up off the edge into Saltcombe's quay.
// Tile key (see src/overworld/coastTiles.js, wrack):
//   #  cliff top (solid)   W  cliff face (solid)   o  wet boards   f  rail (solid)
//   ~  sea (solid)   x  barnacle rock (solid)

export const WRACK_BOARDWALK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wrack_boardwalk',
  // The room's name, for the Room Editor.
  name: 'THE BOARDWALK',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wrack',
  // The Wrack Shore's song (src/data/music/wrackTheme.js), and the sounds of the place under it.
  music: 'wrack',
  ambience: 'storm_shore',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_shore', lamplight: { shade: 0.16, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,

  tiles: [
    '######################foof######',
    '#WWWWWWWWWWWWWWWWWWWWWfoofWWWWW#',
    '############~~~~~~~~~~foof~~~~~#',
    '####,,,,,###~~~~~~~~~~foof~~~~~#',
    '###,,,,,,,##fffffffffffoof~~x~~#',
    '##,,,OO,,,,#ooooooooooooof~~~x~#',
    '##,,,,,,,,,#ooooooooooooof~~~~~#',
    '##,,,,,,,,,#ooffffffffffff~~~~~#',
    '##,,J,,,,,,#oof~~~x~~~~~~~~~~~~#',
    '##,,,,.,,,##ooffffffffffffff~~~#',
    '##,,,..,,,##ooooooooooooooof~~^#',
    '###,,,,,,,,#ooooooooooooooof~~~#',
    '###,,,,F,,,#fffffffffffffoof~~~#',
    '##,,,,,,,,,#~~~~~~~~xx~~foof~~~#',
    '##,x,,,,,,##~~~~~~~~~x~~foof~~~#',
    '##,,,O,,,,,#fffffffffffffoof~x~#',
    '###,,,,,J,,#foooooooooooooof~~~#',
    '###,,,,..,##foooooooooooooof~~~#',
    '####,,,,,###foofffffffffffff~~~#',
    '#####,,,####foof~~~~x~~~~~~~~~~#',
    '############foof~~~~~^~~~~~~~~~#',
    '#WWWWWWWWWWWfoof~~~~~~~~~~~~~~~#',
    'ooooooooooooooof~~~~~~~~~~xx~~~#',
    'ooooooooooooooof~~~~~~~~~~~~~~~#',
    '#fffffffffffffff~~~~~~~~~~~~~~~#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 22 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 22, w: 1, h: 2, to: 'wrack_bathtub', spawn: { x: 38, y: 8 } },
    // Up the top flight into Saltcombe (the quay's pier).
    { x: 23, y: 0, w: 2, h: 1, to: 'saltcombe_quay', spawn: { x: 5, y: 20 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wrack.txt',
  props: [
    { sprite: 'savepoint', x: 20, y: 17, save: true },
    { sprite: 'street_lamp', x: 15, y: 22, text: 'walk_lamp' },
    { sprite: 'street_lamp', x: 27, y: 14, text: 'walk_lamp' },
    { sprite: 'street_lamp', x: 14, y: 8, text: 'walk_lamp' },
    { sprite: 'sign', x: 6, y: 22, text: 'walk_sign' },
    { sprite: 'sign', x: 22, y: 5, text: 'walk_sign_top' },
    { sprite: 'c5_buoys_pile', x: 4, y: 24, text: 'landing_buoy' },
    { sprite: 'gold_pouch', x: 20, y: 11, text: 'walk_pouch', gold: 35, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Dressing (second pass). Nothing on the boards (every run of them is the way up): stones,
    // weed and a moored boat in the water between, and the clifftop grass to the west (out of
    // reach: its edge was rounded off on 2026-11-08) given stones, grass and an old fence.
    { sprite: 'c5_rowboat', x: 14, y: 13, text: 'walk_boat' },
    { sprite: 'c5_rocks_weedy', x: 28, y: 7, text: 'shore_rocks' },
    { sprite: 'c5_rocks_weedy', x: 17, y: 20, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 28, y: 19, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 15, y: 2, text: 'shore_rocks' },
    { sprite: 'c5_rocks_weedy', x: 22, y: 23, text: 'shore_rocks' },
    { sprite: 'c5_weed_mat', x: 21, y: 8, flat: true, walkable: true },
    { sprite: 'c5_weed_mat', x: 18, y: 2, flat: true, walkable: true },
    { sprite: 'c5_weed_mat', x: 25, y: 21, flat: true, walkable: true },
    { sprite: 'c5_weed_mat', x: 28, y: 11, flat: true, walkable: true },
    { sprite: 'c5_rocks_weedy', x: 6, y: 9, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 8, y: 14, text: 'shore_rocks' },
    { sprite: 'c5_rock_weedy', x: 4, y: 17, text: 'shore_rocks' },
    { sprite: 'c5_fence_broken', x: 5, y: 4, text: 'shore_fence' },
    { sprite: 'c5_marram', x: 3, y: 6, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 9, y: 11, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 6, y: 13, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 7, y: 17, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 3, y: 15, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 8, y: 7, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 4, y: 12, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 6, y: 18, flat: true, walkable: true },
    { sprite: 'c5_shingle_spill', x: 4, y: 10, flat: true, walkable: true },
    { sprite: 'c5_shingle_spill', x: 5, y: 16, flat: true, walkable: true },
  ],
  tileTexts: { '#': 'landing_cliff', W: 'landing_cliff', '~': 'walk_sea', x: 'landing_rock', f: 'walk_rail' },

  // None: a save room.
  npcs: [
  ],
};
