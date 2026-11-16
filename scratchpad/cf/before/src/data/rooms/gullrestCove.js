// THE COVE: the first tide puzzle, very easy. A bowl of pale sandstone with the
// sea filling the whole middle of it at HIGH tide (the start), so the east shore
// and the way to the jetty are across deep water. Haddock shows his bell (scene
// haddock_shows_bell) and the tide bell post on the west shore (a twin stands on
// the east shore, in case you are on the wrong side): ring it and the sea draws
// back, leaving a wide bed of dry shingle to walk across. Ring it again and it
// comes back in. At low tide a shingle spit also leads north to a hole in the
// cliff: the way into the gulls' hoard (secret_gull_hoard).
// No soft lock: both bells are on dry sand at both tides, so the water can always
// be sent either way, and the doors, shores and bells are dry in both maps. No
// rocks or crates here.
// Tile key (see src/overworld/coastTiles.js, gullrest):
//   #  cliff top (solid)   W  cliff face (solid)   ,  beach turf   .  warm sand
//   :  packed sand   q  shingle   ;  shallows   ~  sea (solid at high tide)

export const GULLREST_COVE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'gullrest_cove',
  // The room's name, for the Room Editor.
  name: 'THE COVE',
  // The region it's in (src/data/areas.js): the title card and the battle background.
  area: 'gullrest',
  // Gullrest's song (src/data/music/gullrestTheme.js), and the sounds of the place under it.
  music: 'gullrest',
  ambience: 'beach',
  vesWell: true,

  // The HIGH-tide map.
  tiles: [
    '##################################',
    '##WW####WWWWWWW::WWWWWWWWWWWWWW###',
    '#W,,WWWW,,..~~~;;~~~~~..,,,,,,,WW#',
    '#,,,,,,,,,.~~~~;;~~~~~~.,,,,,O,,W#',
    '#..O.....~~~~~~~~~~~~~~~.........#',
    '#........~~~~~~~~~~~~~~~.........#',
    '#.........~~~~~~~~~~~~~..........#',
    '#.........~~~~~~~~~~~~~..........#',
    '#.........~~~~~~~~~~~~~~.........#',
    ':.........~~~~~~~~~~~~~~.........:',
    ':.........~~~~~~~~~~~~~~.........:',
    '#.........~~~~~~~~~~~~~~.........#',
    '#..........~~~~~~~~~~~~~~........#',
    '#..........~~~~~~~~~~~~~~..xx....#',
    '#.........~~~~~~~~~~~~~~~........#',
    '#..........~~~~~~~~~~~~........O.#',
    '#...........~~~~~~~~~~...........#',
    '#...;;;~~~~~~~~~~~~~~~~~~~;;;..;;#',
    '#~~~~~~~~~~~~O~~~~~~~~~~~~;;~~~~~#',
    '#~~~O~~~~~~~~~~~~~~~O~~~~~~~~~OO~#',
  ],

  // The tide: it only moves when a bell is rung (no clock). `low` is the LOW-tide
  // map; a space means "same as high".
  tide: {
    start: 'high',
    low: [
    '                                  ',
    '                                  ',
    '          qqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqq          ',
    '         qqqqqqqqqqqqqqq          ',
    '         qqqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqqq         ',
    '          qqqqqqqqqqqqqqq         ',
    '          qqqqqqqqqqqqqqq         ',
    '          qqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqq          ',
    '                                  ',
    '                                  ',
    '                                  ',
  ],
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'gullrest_beach', spawn: { x: 41, y: 9 } },
    { x: 33, y: 9, w: 1, h: 2, to: 'gullrest_jetty', spawn: { x: 2, y: 9 } },
    { x: 15, y: 1, w: 2, h: 1, to: 'secret_gull_hoard', spawn: { x: 6, y: 8 } },
  ],

  // Haddock shows his bell as you come in (the trigger is the whole of the west shore's foot).
  // Haddock's lesson first (ways_of_the_sea: TIDE and BREEZE grow on the skill
  // tree; he walks in at the door after you and down to the tide bell post), then
  // straight on into the bell (it waits for the lesson). Its box runs from the door
  // down to the post (x 1 to 8, rows 8 to 13), so it covers where the lesson leaves
  // the hero (7,13), and you can't get to the post without walking into it.
  cutscenes: [
    { x: 1, y: 8, w: 4, h: 4, scene: 'ways_of_the_sea' },
    { x: 1, y: 8, w: 8, h: 6, scene: 'haddock_shows_bell', after: 'ways_of_the_sea' },
  ],

  // Haddock (only between the two scenes, by the post where the lesson leaves him: he
  // isn't here before you, he walks in after you), the two tide bell posts, a sign, a purse, a hole in the
  // cliff, and a few beach things. Nothing stands on a tile the tide changes.
  textFile: 'interactions/gullrest.txt',
  props: [
    { sprite: 'cf_haddock', x: 9, y: 12, npc: 'haddock_cove', animation: 'cf_haddock', speed: 0.5, after: 'ways_of_the_sea', until: 'haddock_shows_bell' },
    { sprite: 'c5_harbour_bell', x: 8, y: 10, text: 'cove_bell_west', animation: 'c5_harbour_bell', speed: 0.9,
      tideBell: { to: 'toggle', text: 'cove_bell_ring', busy: 'cove_bell_busy' } },
    { sprite: 'c5_harbour_bell', x: 25, y: 10, text: 'cove_bell_east', animation: 'c5_harbour_bell', speed: 0.9,
      tideBell: { to: 'toggle', text: 'cove_bell_ring', busy: 'cove_bell_busy' } },
    { sprite: 'sign', x: 3, y: 6, text: 'cove_sign' },
    { sprite: 'gold_pouch', x: 2, y: 14, text: 'cove_pouch', gold: 55, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_sea_cave', x: 15, y: 1, text: 'cove_hole', walkable: true },
    { sprite: 'c5_buoys_pile', x: 28, y: 8, text: 'steps_buoys' },
    { sprite: 'c5_crates_stack', x: 30, y: 14, text: 'cove_crates' },
    { sprite: 'sy_dune_grass', x: 6, y: 13, text: 'steps_dune', animation: 'sy_dune_grass', speed: 0.4, walkable: true },
    { sprite: 'sy_dune_grass', x: 27, y: 4, text: 'steps_dune', animation: 'sy_dune_grass', speed: 0.45, walkable: true },
    // Dressing (second pass). Nothing solid on the west shore where the two scenes walk (x 1 to
    // 10, rows 2 to 14), or between the east bell and the door.
    { sprite: 'c5_rocks_sunny', x: 30, y: 3, text: 'beach_rocks' },
    { sprite: 'c5_rocks_sunny', x: 1, y: 16, text: 'beach_rocks' },
    { sprite: 'c5_rock_sunny', x: 12, y: 4, text: 'beach_rocks' },
    { sprite: 'c5_rock_sunny', x: 19, y: 14, text: 'beach_rocks' },
    { sprite: 'c5_rocks_sunny', x: 9, y: 18, text: 'beach_rocks' },
    { sprite: 'c5_rock_sunny', x: 23, y: 19, text: 'beach_rocks' },
    { sprite: 'c5_pot_single', x: 31, y: 7, text: 'beach_pot' },
    { sprite: 'c5_fence_broken', x: 26, y: 2, text: 'beach_fence' },
    { sprite: 'c5_drift_log', x: 26, y: 16, text: 'beach_log' },
    { sprite: 'c5_rock_pool_sunny', x: 30, y: 11, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 1, y: 16, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 24, y: 12, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 5, y: 4, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 29, y: 12, flat: true, walkable: true },
    { sprite: 'sy_dune_grass', x: 2, y: 3, flat: true, walkable: true },
    { sprite: 'sy_dune_grass', x: 24, y: 3, flat: true, walkable: true },
    { sprite: 'sy_dune_grass', x: 32, y: 13, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 9, y: 3, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 31, y: 5, flat: true, walkable: true },
    // The bed the tide leaves (under the water at high): two stones and the sea's leavings, all
    // well off the middle, so the walk across and up to the hole stays wide open.
    { sprite: 'c5_rocks_sunny', x: 21, y: 5, text: 'beach_rocks' },
    { sprite: 'c5_rock_sunny', x: 12, y: 12, text: 'beach_rocks' },
    { sprite: 'c5_rock_pool_sunny', x: 18, y: 13, flat: true, walkable: true },
    { sprite: 'c5_weed_mat', x: 13, y: 6, flat: true, walkable: true },
    { sprite: 'c5_weed_mat', x: 21, y: 10, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 13, y: 15, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 16, y: 8, flat: true, walkable: true },
    { sprite: 'col_glass_green', x: 31, y: 3, walkable: true, flat: true, gives: 'glass_green', taken: { gone: true } },
    // (life pass 2026-11-14)
    // Tibby's bucket and spade, lost on the sea floor (the beach's errand): only there while the tide is out.
    { sprite: 'st_bucket_spade', x: 16, y: 12, text: 'life_v_bucket', lowTide: true, gives: 'pips_bucket', react: true, taken: { gone: true } },
    // The cove's pools and what the sea left in them.
    { sprite: 'st_pool_life', x: 6, y: 5, flat: true, walkable: true, animation: 'st_pool_life', speed: 1.0, decor: true },
    { sprite: 'st_pool_life', x: 27, y: 9, flat: true, walkable: true, animation: 'st_pool_life', speed: 0.8, decor: true },
    { sprite: 'st_starfish', x: 7, y: 9, flat: true, walkable: true, decor: true },
    { sprite: 'st_starfish', x: 26, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'st_shells', x: 22, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'st_shells', x: 29, y: 12, flat: true, walkable: true, decor: true },
    { sprite: 'st_glass_float', x: 5, y: 3, text: 'life_v_float', animation: 'st_glass_float', speed: 0.9 },
    { sprite: 'st_old_boot', x: 3, y: 17, text: 'life_v_boot' },
    { sprite: 'st_tin_can', x: 28, y: 4, text: 'life_v_can' },
    { sprite: 'st_message_bottle', x: 25, y: 16, text: 'life_v_bottle' },
    { sprite: 'st_driftwood_face', x: 29, y: 4, text: 'life_v_face' },
    { sprite: 'c5_crab_trail', x: 22, y: 14, flat: true, walkable: true, decor: true },
  ],
  tileTexts: { '#': 'cove_wall', W: 'cove_wall', x: 'cove_pool', O: 'cove_boulder', '~': 'cove_sea' },

  // A gullion on the west shore (x 3 to 8, row 15), and on the east shore, which you can
  // only reach at low tide, a sandcastle (x 25 to 29, home row 14, off the jetty door's spawn at 31,9) and a dunlin dancer
  // (x 25 to 31, row 5). Clear of Haddock's walks (in at the door and along row 12 to the
  // post, then up x 6 to 7 to row 3), the party's spots (x 1 to 7, rows 8 to 13), the bells, the doors, and every tile the tide changes.
  npcs: [
    { enemy: 'gullion', x: 5, y: 15, patrol: [3, 8], behaviour: 'patrol' },
    { enemy: 'sandcastle', x: 27, y: 14, patrol: [25, 29], behaviour: 'wander' },
    { enemy: 'dunlin_dancer', x: 28, y: 5, patrol: [25, 31], behaviour: 'wander' },
  ],
};
