// THE JETTY: the last of Gullrest. A boardwalk pier runs out into the bay with
// rails along both sides, a headland (the point) to the north-east and open sea
// beyond. At the end of the pier is Haddock's rowboat, the Bother, with Haddock
// beside her. The scene the_sky_turns is the ride: rowing round the point, the sun
// goes, the rain starts and the sky turns green (the storm look), and the ride ends
// on the shingle of the Wrack Shore (wrack_landing). It plays once: afterwards Haddock
// and the Bother are gone from the pier.
// Tile key (see src/overworld/coastTiles.js, gullrest):
//   #  cliff top (solid)   W  cliff face (solid)   ,  beach turf   .  warm sand
//   q  shingle   ;  shallows   o  pier boards   f  pier rail (solid)
//   ~  sea (solid)

export const GULLREST_JETTY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'gullrest_jetty',
  // The room's name, for the Room Editor.
  name: 'THE JETTY',
  // The region it's in (src/data/areas.js): the title card and the battle background.
  area: 'gullrest',
  // Gullrest's song (src/data/music/gullrestTheme.js), and the sounds of the place under it.
  music: 'gullrest',
  ambience: 'beach',
  vesWell: true,

  tiles: [
    '################################################',
    '#WWWWWWWWWWWW~~~~~~~~~~~~~~~#########~~~~~~~~~~~',
    '#,,,,,,,,,,,,~~~~~~~~~~~~~~~#########~~~~~~~~~~~',
    '#,,,,,,,,,,,,~~~~~~~~~~~~~~~#########~~~~~~~~~~~',
    '#..........qqqq~~~~~~~~~~~~~#########~~~~~~~~~~~',
    '#..........qqqq~~~~~~~~~~~~~#########~~~~~~~~~~~',
    '#..........q;;q~~~~~~~~~~~~~~#######~~~~~~~~~~~~',
    '#..........fffffffffff~~~~~~~~#####~~~~~~~~~~~~~',
    ':..........oooooooooooo~~~~~~~~~~~~~~~~~~~~~~~~~',
    ':..........oooooooooooo~~~~~~~~~~~~~~~~~~~~~~~~~',
    '#..........fffffffffff~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '#..........q;;q~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '#..........q;;q~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '#..........qqqq~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '#..........qqqq~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '#............~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '#............~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '############~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'gullrest_cove', spawn: { x: 31, y: 9 } },
  ],

  // Stepping onto the end of the pier boards the Bother (once).
  cutscenes: [{ x: 21, y: 8, w: 2, h: 2, scene: 'the_sky_turns' }],

  // Haddock beside the Bother, a sign, buoys, pots, a net, an unlit lantern post, a rope
  // coil and a purse.
  textFile: 'interactions/gullrest.txt',
  props: [
    { sprite: 'cf_haddock', x: 19, y: 8, npc: 'haddock_jetty', animation: 'cf_haddock', speed: 0.5, until: 'the_sky_turns' },
    { sprite: 'cf_bother', x: 23, y: 9, npc: 'the_bother', animation: 'cf_bother', speed: 0.5, until: 'the_sky_turns' },
    { sprite: 'sign', x: 8, y: 6, text: 'jetty_sign' },
    { sprite: 'c5_buoys_pile', x: 4, y: 6, text: 'jetty_buoys' },
    { sprite: 'c5_lobster_pots', x: 8, y: 13, text: 'jetty_pots' },
    { sprite: 'c5_net_frame', x: 3, y: 11, text: 'jetty_net' },
    { sprite: 'c5_lantern_post_unlit', x: 9, y: 7, text: 'jetty_lamp' },
    { sprite: 'c5_rope_coil', x: 13, y: 9, text: 'jetty_rope', walkable: true },
    { sprite: 'gold_pouch', x: 3, y: 14, text: 'jetty_pouch', gold: 40, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_bunting_post', x: 12, y: 7, text: 'beach_bunting_post', animation: 'c5_bunting_post', speed: 0.4 },
    { sprite: 'sy_dune_grass', x: 6, y: 3, text: 'steps_dune', animation: 'sy_dune_grass', speed: 0.4, walkable: true },
  ],
  tileTexts: { '#': 'jetty_wall', W: 'jetty_wall', '~': 'jetty_sea' },

  // A PAIR on the south sand: a gullion (x 3 to 6, row 13) and a sandcastle beside it (x 3 to 6,
  // home row 12), close enough to fight you together. Both on the beach and well clear of the pier
  // (rows 8 and 9), the door and the boat's route (row 9 east of the pier, then round the point).
  // No monsters on the pier, so the boarding and the ride have a clear run.
  npcs: [
    { enemy: 'gullion', x: 4, y: 13, patrol: [3, 6], behaviour: 'patrol' },
    { enemy: 'sandcastle', x: 5, y: 12, patrol: [3, 6], behaviour: 'wander' },
  ],
};
