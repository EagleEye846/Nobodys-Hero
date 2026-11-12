// THE LANDING: the Soundings' long stair comes up out of the rock here, into the wind, onto the
// first of the Beacon Isles. A bare isle of rock and salt turf with the sea all round it, and,
// out on their own rocks across the water, the little lights: one turning, one dark, and more
// beyond. Far off to the east, Haddock's Light. PUZZLE-FREE, no monsters (an area's first room):
// a bottle garden someone tends, an old signpost, a bench, and the scene `isles_four_lights`
// (the first look) as you come down from the cave mouth.
//
// The cave mouth in the north cliff (5,2) is the top of the Soundings' stair: soundings_up's top
// door lands you at (5,4), just under it, and walking back into it goes down to soundings_up (11,2).
// Tile key (see src/overworld/coastTiles.js, isles):
//   #  rock top (solid)   W  rock face (solid)   ,  wind turf   .  rock slabs   :  path
//   ~  the sea (solid)   x  barnacle rock (solid: the little lights' rocks)

export const ISLES_LANDING = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'isles_landing',
  // The room's name, for the Room Editor.
  name: 'THE LANDING',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'isles',
  // "Four Small Lights", and the open sea under it.
  music: 'isles',
  ambience: 'open_sea',
  // After the chapter (the_light_answers) the storm is over, as at the tower's foot: no rain or
  // lightning, the sea lying down, and the grey-blue light of a quiet sea in place of the storm's green.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.5, fog: 0.15 }, ambience: 'calm_sea', lamplight: { shade: 0.32, tint: '30, 40, 64' } },
  vesWell: true,
  // The Last Light, small and black on the skyline out past the lights.
  lastLight: { x: 31, y: 9 },

  // The wrecks' silhouettes on the sea keep this many tiles clear of any shore
  // (src/overworld/atmosphere.js, buildSkyline).
  skylineClear: 2,

  tiles: [
    '####################################',
    '#WWWWWWWWWWWWWW~~~~~~~~~~~~~~~~~~~~#',
    '#WWWW::WWWWWWWW~~~~~~~~~~~~~~~~~~~~#',
    '#,,,,::,,,,,,,,,~~~~~~~~~~~~~~~~~~~#',
    '#,,,,::,,,,.....,~~~~~~~~~~~xx~~~~~#',
    '#,,,,,:,,,,......,~~~~~~~~~~xx~~~~~#',
    '#,,,,,::,,,,......~~~~~~~~~~~~~~~~~#',
    '#,,,,,,::,,,,.....,~~~~~xx~~~~~~~~~#',
    '#,,,,,,,:::,,,,....,~~~~xx~~~~~~~~~#',
    '#,,,,,,,,,::::,,,,..,~~~~~~~~~~~~~~#',
    '#~,,,,,,,,,,,:::::,,,,,~~~~~~~~~~~~#',
    '#~~,,,,,,,,,,,,,::::::,,,,~~~~~~~~~#',
    '#~~~,,,,,,,,,,,,,,,,,::::::::::::::.',
    '#~~~~,,,,,,,,,,,,,,,,,:::::::::::::.',
    '#~~~~~,,,,,,,,,,,,,,,,,,,,,,,,,,~~~#',
    '#~~~~~~~~,,,,,,,,,,,,,,,,,~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '####################################',
  ],

  // Where the player starts, in tile coordinates: just under the cave mouth.
  playerStart: { x: 5, y: 4 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 35, y: 12, w: 1, h: 2, to: 'isles_east_light', spawn: { x: 2, y: 16 } },
    // Back down the Soundings' stair.
    { x: 5, y: 2, w: 2, h: 1, to: 'soundings_up', spawn: { x: 11, y: 2 } },
  ],

  // Coming down the path from the cave: the first look at the lights.
  cutscenes: [
    { x: 4, y: 6, w: 5, h: 2, scene: 'isles_four_lights' },
    // And on the step out of the stair, so it can't be walked round (the turf is open both sides).
    { x: 4, y: 3, w: 4, h: 2, scene: 'isles_four_lights' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/isles.txt',
  props: [
    // The cave mouth: the top of the Soundings' stair (walkable: it's the door).
    { sprite: 'c5_sea_cave', x: 5, y: 2, text: 'landing_cave', walkable: true },
    // The lights out on their rocks: the East Light turning, the old one dark.
    { sprite: 'c5_little_light', x: 28, y: 5, text: 'landing_light_far', animation: 'c5_little_light', speed: 0.4 },
    { sprite: 'c5_light_base_b', x: 24, y: 8, text: 'landing_light_dark' },
    { sprite: 'il_far_light', x: 33, y: 3, text: 'landing_haddocks_light', walkable: true, until: 'haddock_gone' },
    { sprite: 'il_far_light', x: 33, y: 3, text: 'landing_haddocks_light_after', walkable: true, after: 'haddock_gone' },
    { sprite: 'sign', x: 8, y: 4, text: 'landing_signpost' },
    { sprite: 'c5_bottle_garden', x: 2, y: 8, text: 'landing_bottles' },
    { sprite: 'bench', x: 12, y: 6, text: 'landing_bench' },
    { sprite: 'c5_buoys_pile', x: 17, y: 14, text: 'landing_buoys' },
    { sprite: 'c5_rope_coil', x: 10, y: 12, text: 'landing_rope', walkable: true, flat: true },
    { sprite: 'c5_anchor', x: 24, y: 14, text: 'landing_anchor' },
    { sprite: 'c5_lifebuoy_post', x: 31, y: 14, text: 'landing_post' },
    { sprite: 'gold_pouch', x: 2, y: 4, text: 'landing_pouch', gold: 200, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Second pass: the isle's own look: sea-pinks and grass blown flat, lichen on the slabs, a pool
    // in the rock, gulls, a cairn on the headland, an old boat broken in half, a rope on stakes, rocks
    // in the sea. Nothing solid on the path below the cave (the scene walks rows 3-8, x 4-10) or the path.
    { sprite: 'il_cairn', x: 2, y: 6, text: 'isle_cairn' },
    { sprite: 'il_thrift', x: 3, y: 4, walkable: true },
    { sprite: 'il_grass_tuft', x: 1, y: 10, walkable: true },
    { sprite: 'il_thrift', x: 4, y: 9, walkable: true },
    { sprite: 'il_grass_tuft_b', x: 11, y: 4, walkable: true },
    { sprite: 'il_lichen', x: 12, y: 5, flat: true, walkable: true },
    { sprite: 'il_lichen', x: 15, y: 6, flat: true, walkable: true },
    { sprite: 'il_tidepool', x: 14, y: 7, flat: true, walkable: true },
    { sprite: 'il_thrift', x: 17, y: 9, walkable: true },
    { sprite: 'il_gull', x: 19, y: 9, walkable: true },
    { sprite: 'il_grass_tuft', x: 12, y: 8, walkable: true },
    { sprite: 'il_drift_timber', x: 8, y: 11, flat: true, walkable: true },
    { sprite: 'il_thrift', x: 5, y: 12, walkable: true },
    { sprite: 'il_grass_tuft_b', x: 7, y: 13, walkable: true },
    { sprite: 'il_rowboat_half', x: 6, y: 14, text: 'isle_rowboat_half' },
    { sprite: 'il_stakes_rope', x: 13, y: 15, text: 'isle_stakes' },
    { sprite: 'il_grass_tuft', x: 10, y: 14, walkable: true },
    { sprite: 'il_thrift', x: 16, y: 13, walkable: true },
    { sprite: 'il_pot_broken', x: 20, y: 15, text: 'isle_pot_broken' },
    { sprite: 'il_grass_tuft_b', x: 22, y: 14, walkable: true },
    { sprite: 'il_thrift', x: 27, y: 14, walkable: true },
    { sprite: 'il_grass_tuft', x: 23, y: 11, walkable: true },
    { sprite: 'c5_lantern_hook', x: 25, y: 11 },
    { sprite: 'il_rocks', x: 3, y: 11, text: 'isle_rocks' },
    { sprite: 'il_thrift', x: 4, y: 11, walkable: true },
    { sprite: 'il_grass_tuft_b', x: 2, y: 12, walkable: true },
    { sprite: 'il_tidepool_small', x: 9, y: 9, flat: true, walkable: true },
    { sprite: 'il_grass_tuft', x: 10, y: 10, walkable: true },
    { sprite: 'il_lichen', x: 18, y: 7, flat: true, walkable: true },
    { sprite: 'il_gull', x: 8, y: 13, walkable: true },
    { sprite: 'il_gull_rock', x: 20, y: 6, text: 'isle_gull_rock' },
    { sprite: 'il_rocks_big', x: 2, y: 13, text: 'isle_rocks' },
    { sprite: 'il_rocks', x: 11, y: 16, text: 'isle_rocks' },
    { sprite: 'il_rocks', x: 22, y: 3, text: 'isle_rocks' },
  ],
  tileTexts: { '#': 'isles_rock', W: 'isles_rock', '~': 'isles_sea', x: 'isles_light_rock' },

  // None: the first room of an area (and the scene walks along the path below the cave).
  npcs: [],
};
