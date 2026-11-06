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
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/isles.txt',
  props: [
    // The cave mouth: the top of the Soundings' stair (walkable: it's the door).
    { sprite: 'c5_sea_cave', x: 5, y: 2, text: 'landing_cave', walkable: true },
    // The lights out on their rocks: the East Light turning, the old one dark.
    { sprite: 'c5_little_light', x: 28, y: 5, text: 'landing_light_far', animation: 'c5_little_light', speed: 0.4 },
    { sprite: 'c5_light_base_b', x: 24, y: 8, text: 'landing_light_dark' },
    { sprite: 'il_far_light', x: 33, y: 3, text: 'landing_haddocks_light', walkable: true },
    { sprite: 'sign', x: 8, y: 4, text: 'landing_signpost' },
    { sprite: 'c5_bottle_garden', x: 2, y: 8, text: 'landing_bottles' },
    { sprite: 'bench', x: 12, y: 6, text: 'landing_bench' },
    { sprite: 'c5_buoys_pile', x: 17, y: 14, text: 'landing_buoys' },
    { sprite: 'c5_rope_coil', x: 10, y: 12, text: 'landing_rope', walkable: true, flat: true },
    { sprite: 'c5_anchor', x: 24, y: 14, text: 'landing_anchor' },
    { sprite: 'c5_lifebuoy_post', x: 31, y: 14, text: 'landing_post' },
    { sprite: 'gold_pouch', x: 2, y: 4, text: 'landing_pouch', gold: 200, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'isles_rock', W: 'isles_rock', '~': 'isles_sea', x: 'isles_light_rock' },

  // None: the first room of an area (and the scene walks along the path below the cave).
  npcs: [],
};
