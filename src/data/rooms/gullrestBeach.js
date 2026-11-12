// THE BEACH: Gullrest in the sun. Striped huts and bunting under a low sandstone
// cliff, a promenade of boards, warm sand down to the shingle and a turquoise
// sea. Haddock the walrus sits on his big pink rock at the water's edge
// ringing a handbell at nothing (scene meet_haddock, trigger a strip at x 12,
// rows 2 to 14). The big red lifeboat house doors are on the promenade (a door at
// x 31 and 32, row 4). The cove is east (door at x 43, rows 8 and 9).
// Tile key (see src/overworld/coastTiles.js, gullrest):
//   #  cliff top (solid)   W  cliff face (solid)   ,  beach turf   :  packed sand
//   .  warm sand   o  promenade boards   q  shingle   ;  shallows   j  stepping stones
//   ~  sea (solid)   O  beach boulder (solid): Haddock's rock sits on a block of them (drawn over by c5_haddock_rock)

export const GULLREST_BEACH = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'gullrest_beach',
  // The room's name, for the Room Editor.
  name: 'THE BEACH',
  // The region it's in (src/data/areas.js): the title card and the battle background.
  area: 'gullrest',
  // Gullrest's song (src/data/music/gullrestTheme.js), and the sounds of the place under it.
  music: 'gullrest',
  ambience: 'beach',
  vesWell: true,

  tiles: [
    '##::::######################################',
    '##::::WWWWWWWWWWWWWW###WWWWWWWWWWWWWWWWWW###',
    '#W::::,,,,,,,,,,,,,,WWW,,,,,,,####,,,,,,,WW#',
    '#,::::,,,,,,,,,,,,,,,,,,,,,,,,####,,,,,,,,W#',
    '#,::::,,,,,,,,,,,,,,,,,,,,,,,,#,,#,,,,,,,,,#',
    '#oooooooooooooooooooooooooooooo::oooooooooo#',
    '#..............................::.......OOO#',
    '#..............................::........OO#',
    '#..................OOOO...................::',
    '#..................OOOO...................::',
    '#........................................OO#',
    '#.......................................OOO#',
    '#q............qqqqq...........qqqq.........#',
    '#qq....qqqqqqqqqqqqqqq....qqqqqqqqqqqq;;;;q#',
    '#qqq;;;;jj;;;;;;;;;;;;;;;;~~~~;;;;;;;;;;;~~#',
    '#~~~;;;;;;~~~~~;;;;~~~~~~~~~~~~~~;;;;~~~~~~#',
    '#~~~~;;;~~~O~~~~;;~~~~~OO~~~~~~~~~;;~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~O~~~~~~~~~~~~#',
    '#~~O~~~~~~~~~~~~~~~O~~~~~~~~~~~O~~~~~~~~~~O#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~OO~#',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 3, y: 3 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 2, y: 0, w: 4, h: 1, to: 'gullrest_cliff_steps', spawn: { x: 9, y: 26 } },
    { x: 31, y: 4, w: 2, h: 1, to: 'gullrest_lifeboat_house', spawn: { x: 8, y: 9 } },
    // The cove waits for the lifeboat house (Haddock's "lifeboat house, then the cove"): until
    // lantern_at_noon has played it turns you back with a line (a save already past the cove
    // goes through).
    { x: 43, y: 8, w: 1, h: 2, to: 'gullrest_cove', spawn: { x: 2, y: 9 }, after: ['lantern_at_noon', 'ways_of_the_sea'], notYet: 'beach_cove_not_yet' },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  // A strip right across the beach at column 12 (turf, promenade, sand and shallows), so
  // there is no way past to the cove without meeting him.
  cutscenes: [{ x: 12, y: 2, w: 1, h: 13, scene: 'meet_haddock' }],

  // Haddock on his rock, huts, bunting, deckchairs, boats and nets, the lifeboat doors,
  // two signs, a purse, an anchor with flowers, a seal pup with a bucket.
  textFile: 'interactions/gullrest.txt',
  props: [
    // Haddock's rock: drawn flat over the four boulder tiles (x 19 to 22, rows 8 and 9) that make it solid.
    // (It keeps the boulders' words, or a Z on the rock finds nothing to say.)
    { sprite: 'c5_haddock_rock', x: 19, y: 9, flat: true, walkable: true, text: 'beach_boulder' },
    // Gone after meet_haddock: he walks off to the lifeboat house at the end of it, and is in there.
    { sprite: 'cf_haddock_bell', x: 20, y: 8, npc: 'haddock', animation: 'cf_haddock_bell', speed: 0.3, until: 'meet_haddock' },
    { sprite: 'sign', x: 6, y: 6, text: 'beach_sign' },
    { sprite: 'sign', x: 38, y: 8, text: 'beach_sign_east' },
    { sprite: 'c5_beach_hut', x: 8, y: 4, text: 'beach_hut' },
    { sprite: 'c5_beach_hut', x: 14, y: 4, text: 'beach_hut' },
    { sprite: 'c5_beach_hut', x: 24, y: 4, text: 'beach_hut' },
    { sprite: 'c5_beach_hut', x: 37, y: 4, text: 'beach_hut' },
    // Under it the tiles are rock (rows 2-3, and the two ends of row 4), so it's solid and you can
    // only walk in through the doorway (31-32, 4) from the front.
    { sprite: 'c5_lifeboat_doors', x: 30, y: 4, text: 'beach_lifeboat_doors', walkable: true },
    { sprite: 'c5_lifebuoy_post', x: 34, y: 6, text: 'beach_lifebuoy' },
    { sprite: 'c5_bunting_string', x: 11, y: 6, text: 'beach_bunting', animation: 'c5_bunting_string', speed: 0.35, walkable: true },
    { sprite: 'c5_bunting_string', x: 26, y: 6, text: 'beach_bunting', animation: 'c5_bunting_string', speed: 0.35, walkable: true },
    { sprite: 'c5_deckchair', x: 4, y: 9, text: 'beach_deckchair' },
    { sprite: 'c5_deckchair', x: 6, y: 10, text: 'beach_deckchair' },
    { sprite: 'c5_rowboat', x: 11, y: 12, text: 'beach_rowboat' },
    // The side quest "A Bit of the Sea": a jam jar in the top pot, for Tolliver at the Last Farm.
    { sprite: 'c5_lobster_pots', x: 3, y: 12, text: 'beach_pots', gives: 'jar_of_sea', react: true, taken: { text: 'beach_pots_after' } },
    { sprite: 'c5_net_frame', x: 35, y: 10, text: 'beach_net' },
    { sprite: 'c5_buoy_red', x: 37, y: 12, text: 'beach_buoy' },
    { sprite: 'c5_anchor', x: 2, y: 8, text: 'beach_anchor' },
    { sprite: 'c5_barrels', x: 17, y: 3, text: 'beach_barrels' },
    // A seal pup on holiday with a bucket: clear of meet_haddock's walk (x 12 to 21), the
    // west sandcastle's wander (x 6 to 10, rows 10 to 12) and the stair down (x 2 to 5).
    { sprite: 'cf_kid_pup', x: 9, y: 8, text: 'beach_pup', animation: 'cf_kid_pup', speed: 0.3 },
    { sprite: 'gold_pouch', x: 1, y: 11, text: 'beach_pouch', gold: 45, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Dressing (second pass): warm stones out in the sea and along the tideline, a pool in the
    // shingle, weed at the water's edge, grass at the foot of the turf. Nothing in Haddock's
    // scene (x 12 to 31, rows 4 to 11).
    { sprite: 'c5_rocks_sunny', x: 6, y: 17, text: 'beach_rocks' },
    { sprite: 'c5_rock_sunny', x: 25, y: 18, text: 'beach_rocks' },
    { sprite: 'c5_rocks_sunny', x: 36, y: 16, text: 'beach_rocks' },
    { sprite: 'c5_rocks_sunny', x: 23, y: 13, text: 'beach_rocks' },
    { sprite: 'c5_rock_sunny', x: 40, y: 12, text: 'beach_rocks' },
    { sprite: 'c5_rock_pool_sunny', x: 15, y: 12, flat: true, walkable: true },
    { sprite: 'c5_rock_pool_sunny', x: 31, y: 13, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 6, y: 13, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 26, y: 12, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 33, y: 9, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 4, y: 7, flat: true, walkable: true },
    { sprite: 'sy_dune_grass', x: 1, y: 6, flat: true, walkable: true },
    { sprite: 'sy_dune_grass', x: 35, y: 7, flat: true, walkable: true },
    { sprite: 'sy_dune_grass', x: 42, y: 11, flat: true, walkable: true },
    { sprite: 'c5_sea_holly', x: 39, y: 7, flat: true, walkable: true },
    { sprite: 'c5_marram', x: 1, y: 10, flat: true, walkable: true },
  ],
  tileTexts: { '#': 'beach_wall', W: 'beach_wall', O: 'beach_boulder', '~': 'beach_sea' },

  // Two sandcastles (one far down the west beach, x 6 to 10, row 11; one east, x 25 to
  // 31, row 11), and a PAIR on the east sand by the cove path: a gullion (x 34 to 37, row 12)
  // with a dunlin dancer at its heels (x 34 to 37, home row 11). The pair stay within four tiles
  // of each other, so touching one brings the other in (a double battle). All clear of the
  // scene's walk (the trigger strip at x 12, a step to 13,7, then row 10 to 11 at x 18 to 21) and
  // the doors (the cove door is six tiles east of the pair); the west beach castle is a long way
  // from the steps.
  npcs: [
    { enemy: 'sandcastle', x: 8, y: 11, patrol: [6, 10], behaviour: 'wander' },
    { enemy: 'sandcastle', x: 28, y: 11, patrol: [25, 31], behaviour: 'wander' },
    { enemy: 'gullion', x: 35, y: 12, patrol: [34, 37], behaviour: 'patrol' },
    { enemy: 'dunlin_dancer', x: 36, y: 11, patrol: [34, 37], behaviour: 'wander' },
  ],
};
