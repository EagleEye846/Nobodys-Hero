// THE SEA VIEW: the clifftop above Gullrest, and the first sight of the sea
// (first_sight_of_the_sea: the camera slides down off the cliff over the whole
// bright water, the beach and its huts far below, and on the horizon, small and
// black, a lighthouse with spikes, and a green smudge of storm behind it). The
// south of the room is open air with the view behind it (`vista: { kind: 'sea' }`,
// src/overworld/seaVista.js). A telescope on the edge, a bench, a sign.
// The way down is the 4-wide path on the east side (x 23 to 26): steps cut down a
// spur of the cliff (the flat prop sy_cliff_path, with its turf edges and hand
// ropes on posts) to a ragged cave mouth (row 22, the door) into the cave inside the cliff
// (sunny_cliff_cave, then sunny_cliff_hollow, then Gullrest's cliff steps). The
// spur runs on down below the mouth to the bottom of the room, standing in the sea
// with the surf round its foot, so it never hangs in the air. Both side edges of
// the room are open air below the clifftop, as is everything south of row 12.
// The meadow ends straight at the drop (row 13 is open air: the cliff's turf lip
// and rock are drawn hanging under row 12), so nobody's feet are hidden by a lip.
// Tile key (see src/overworld/brightTiles.js):
//   #  hedgerow (solid)   W  hedgerow face (solid)   ,  meadow   :  dirt lane / sand
//   _  open air: the view over the edge shows through (the cliff drawn under the meadow)

export const SUNNY_SEA_VIEW = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'sunny_sea_view',
  // The room's name, for the Room Editor.
  name: 'THE SEA VIEW',
  // The region it's in (src/data/areas.js): the title card and the battle background.
  area: 'sunnyside',
  // Sunnyside's song (src/data/music/sunnysideTheme.js), and the sounds of the place under it.
  music: 'sunnyside',
  ambience: 'beach',
  vesWell: true,
  // The sea, the beach and the storm behind the open air (src/overworld/seaVista.js).
  vista: { kind: 'sea' },
  // After chapter 5 the storm on the horizon has gone (seaVista.js, `view.calm`): a thin grey tail of cloud by the tower.
  calmAfter: { scene: 'the_light_answers', ambience: 'beach' },
  // The scene when you walk to the edge.

  tiles: [
    '##############################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#:::::::,,,::::::::,,,,,,,,,,#',
    '#::,,,,,,,,,,::::::,bbb,,,,,,#',
    '#,,bbbb,,,,,,:::::::bbb,:::::#',
    '#,,bbbb,,,,,:::::::::::::::::#',
    '#,,,,,,,,,,::::::::::::::::::#',
    '#::,,,,,,,:::::::,,,,,:::::::#',
    '#:::::,,::::::,,,,,,,,,,:::::#',
    ':::::::::::::::::::::::,,::::#',
    ':::::::::::::::::::::::,,::::#',
    '#,,,,,,:::::,,,,,,,,,,,::::::#',
    '#,,,,,,:::::::,,,,,,:::::::,,#',
    '_______________________::::___',
    '_______________________::::___',
    '_______________________::::___',
    '_______________________::::___',
    '_______________________::::___',
    '_______________________::::___',
    '_______________________::::___',
    '_______________________::::___',
    '_______________________::::___',
    '_______________________::::___',
    '______________________________',
    '______________________________',
    '______________________________',
    '______________________________',
    '______________________________',
    '______________________________',
    '______________________________',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'sunny_cliff_meadow', spawn: { x: 42, y: 9 } },
    // Into the cave mouth at the foot of the steps, into the cave inside the cliff.
    { x: 23, y: 22, w: 4, h: 1, to: 'sunny_cliff_cave', spawn: { x: 11, y: 1 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  // A strip right across the clifftop at column 9 (rows 2 to 12), so nobody walks round it.
  cutscenes: [{ x: 9, y: 2, w: 1, h: 11, scene: 'first_sight_of_the_sea' }],

  // A telescope, a bench, a sign, a windsock, a purse, and bunting posts at the head of
  // the cliff path down to Gullrest.
  textFile: 'interactions/sunnyside.txt',
  props: [
    // The cliff path down: steps cut in the rock, turf edges, hand ropes on posts.
    { sprite: 'sy_cliff_path', x: 20, y: 29, text: 'sea_path', flat: true, walkable: true, animation: 'sy_cliff_path', speed: 0.8 },
    { sprite: 'telescope', x: 5, y: 11, text: 'sea_telescope' },
    { sprite: 'bench', x: 15, y: 11, text: 'sea_bench' },
    { sprite: 'sign', x: 21, y: 8, text: 'sea_sign' },
    { sprite: 'savepoint', x: 15, y: 8, save: true },
    { sprite: 'c5_bunting_post', x: 23, y: 13, text: 'sea_bunting_post', animation: 'c5_bunting_post', speed: 0.4 },
    { sprite: 'c5_bunting_post', x: 26, y: 13, text: 'sea_bunting_post', animation: 'c5_bunting_post', speed: 0.45 },
    { sprite: 'gold_pouch', x: 27, y: 4, text: 'sea_pouch', gold: 40, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'sy_windsock', x: 18, y: 6, text: 'cliff_windsock', animation: 'sy_windsock', speed: 0.3 },
    { sprite: 'sy_sand_patch', x: 10, y: 5, walkable: true },
    { sprite: 'sy_sand_patch', x: 18, y: 11, walkable: true },
    { sprite: 'sy_sand_patch', x: 7, y: 12, walkable: true },
    { sprite: 'sy_dune_grass', x: 8, y: 4, animation: 'sy_dune_grass', speed: 0.33, walkable: true },
    { sprite: 'sy_dune_grass', x: 14, y: 3, animation: 'sy_dune_grass', speed: 0.43000000000000005, walkable: true },
    { sprite: 'sy_dune_grass', x: 19, y: 11, animation: 'sy_dune_grass', speed: 0.48000000000000004, walkable: true },
    { sprite: 'sy_dune_grass', x: 22, y: 6, animation: 'sy_dune_grass', speed: 0.43000000000000005, walkable: true },
    { sprite: 'sy_dune_grass', x: 4, y: 10, animation: 'sy_dune_grass', speed: 0.33, walkable: true },
    { sprite: 'sy_dune_grass', x: 26, y: 10, animation: 'sy_dune_grass', speed: 0.43000000000000005, walkable: true },
    { sprite: 'sy_dune_grass', x: 11, y: 7, animation: 'sy_dune_grass', speed: 0.48000000000000004, walkable: true },
    { sprite: 'sy_dune_grass', x: 16, y: 5, animation: 'sy_dune_grass', speed: 0.33, walkable: true },
    { sprite: 'sy_dune_grass', x: 13, y: 12, animation: 'sy_dune_grass', speed: 0.38, walkable: true },
    { sprite: 'sy_dune_grass', x: 9, y: 7, animation: 'sy_dune_grass', speed: 0.38, walkable: true },
    { sprite: 'sy_dune_grass', x: 25, y: 6, animation: 'sy_dune_grass', speed: 0.38, walkable: true },
  ],
  tileTexts: { '#': 'field_hedge', W: 'field_hedge', _: 'sea_edge' },

  // One bunting on the north-east dunes (x 18 to 26, rows 4 to 6), far from the
  // scene's walk (it goes from the lane at x 9 to 11 down to the telescope at
  // x 10 to 12, row 11) and from the cliff path. Nothing else here.
  npcs: [
    { enemy: 'bunting', x: 22, y: 5, patrol: [18, 26], behaviour: 'wander' },
    // A seed sheep on the north-west dunes (x 11 to 17, rows 2 to 4), clear of the scene's walk.
    { enemy: 'seed_sheep', x: 14, y: 3, patrol: [11, 17], behaviour: 'patrol' },
  ],
};
