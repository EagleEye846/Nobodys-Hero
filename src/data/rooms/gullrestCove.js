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
    '#WWWWWWWWWWWWWW::WWWWWWWWWWWWWWWW#',
    '#,,,,,,,,,~~~~~;;~~~~~~~,,,,,,,,,#',
    '#,,,,,,,,,~~~~~;;~~~~~~~,,,,,O,,,#',
    '#..O......~~~~~~~~~~~~~~.........#',
    '#.........~~~~~~~~~~~~~~.........#',
    '#.........~~~~~~~~~~~~~~.........#',
    '#.........~~~~~~~~~~~~~~.........#',
    '#.........~~~~~~~~~~~~~~.........#',
    ':.........~~~~~~~~~~~~~~.........:',
    ':.........~~~~~~~~~~~~~~.........:',
    '#.........~~~~~~~~~~~~~~.........#',
    '#.........~~~~~~~~~~~~~~.........#',
    '#.........~~~~~~~~~~~~~~...xx....#',
    '#.........~~~~~~~~~~~~~~.........#',
    '#.........~~~~~~~~~~~~~~.......O.#',
    '#.........~~~~~~~~~~~~~~.........#',
    '#;;;;;;;;;~~~~~~~~~~~~~~;;;;;;;;;#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
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
    '          qqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqq          ',
    '          qqqqqqqqqqqqqq          ',
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
  // tree), then straight on into the bell (same box, waits for the lesson).
  cutscenes: [
    { x: 1, y: 8, w: 4, h: 4, scene: 'ways_of_the_sea' },
    { x: 1, y: 8, w: 4, h: 4, scene: 'haddock_shows_bell', after: 'ways_of_the_sea' },
  ],

  // Haddock (until the scene), the two tide bell posts, a sign, a purse, a hole in the
  // cliff, and a few beach things. Nothing stands on a tile the tide changes.
  textFile: 'interactions/gullrest.txt',
  props: [
    { sprite: 'cf_haddock', x: 5, y: 8, npc: 'haddock_cove', animation: 'cf_haddock', speed: 0.5, until: 'haddock_shows_bell' },
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
  ],
  tileTexts: { '#': 'cove_wall', W: 'cove_wall', x: 'cove_pool', O: 'cove_boulder', '~': 'cove_sea' },

  // A gullion on the west shore (x 3 to 8, row 15), and on the east shore, which you can
  // only reach at low tide, a sandcastle (x 26 to 31, row 12) and a dunlin dancer
  // (x 25 to 31, row 5). Clear of Haddock's walk (x 5 to 6, rows 3 to 8), the party's
  // spot (x 1 to 4, rows 8 to 11), the bells, the doors, and every tile the tide changes.
  npcs: [
    { enemy: 'gullion', x: 5, y: 15, patrol: [3, 8], behaviour: 'patrol' },
    { enemy: 'sandcastle', x: 28, y: 12, patrol: [26, 31], behaviour: 'wander' },
    { enemy: 'dunlin_dancer', x: 28, y: 5, patrol: [25, 31], behaviour: 'wander' },
  ],
};
