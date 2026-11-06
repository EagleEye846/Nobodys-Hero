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
    '#W::::WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#,::::,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,::::,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,::::,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#oooooooooooooooooooooooooooooo::oooooooooo#',
    '#..............................::.......OOO#',
    '#..............................::.......OOO#',
    '#..................OOOO...................::',
    '#..................OOOO...................::',
    '#.......................................OOO#',
    '#.......................................OOO#',
    '#..........................................#',
    '#qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq#',
    '#;;;;;;;jj;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 3, y: 3 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 2, y: 0, w: 4, h: 1, to: 'gullrest_cliff_steps', spawn: { x: 9, y: 26 } },
    { x: 31, y: 4, w: 2, h: 1, to: 'gullrest_lifeboat_house', spawn: { x: 8, y: 9 } },
    { x: 43, y: 8, w: 1, h: 2, to: 'gullrest_cove', spawn: { x: 2, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  // A strip right across the beach at column 12 (turf, promenade, sand and shallows), so
  // there is no way past to the cove without meeting him.
  cutscenes: [{ x: 12, y: 2, w: 1, h: 13, scene: 'meet_haddock' }],

  // Haddock on his rock, huts, bunting, deckchairs, boats and nets, the lifeboat doors,
  // two signs, a purse, an anchor with flowers.
  textFile: 'interactions/gullrest.txt',
  props: [
    // Haddock's rock: drawn flat over the four boulder tiles (x 19 to 22, rows 8 and 9) that make it solid.
    { sprite: 'c5_haddock_rock', x: 19, y: 9, flat: true, walkable: true },
    { sprite: 'cf_haddock_bell', x: 20, y: 8, npc: 'haddock', animation: 'cf_haddock_bell', speed: 0.3 },
    { sprite: 'sign', x: 6, y: 6, text: 'beach_sign' },
    { sprite: 'sign', x: 38, y: 8, text: 'beach_sign_east' },
    { sprite: 'c5_beach_hut', x: 8, y: 4, text: 'beach_hut' },
    { sprite: 'c5_beach_hut', x: 14, y: 4, text: 'beach_hut' },
    { sprite: 'c5_beach_hut', x: 24, y: 4, text: 'beach_hut' },
    { sprite: 'c5_beach_hut', x: 37, y: 4, text: 'beach_hut' },
    { sprite: 'c5_lifeboat_doors', x: 30, y: 4, text: 'beach_lifeboat_doors', walkable: true },
    { sprite: 'c5_lifebuoy_post', x: 34, y: 6, text: 'beach_lifebuoy' },
    { sprite: 'c5_bunting_string', x: 11, y: 6, text: 'beach_bunting', animation: 'c5_bunting_string', speed: 0.35, walkable: true },
    { sprite: 'c5_bunting_string', x: 26, y: 6, text: 'beach_bunting', animation: 'c5_bunting_string', speed: 0.35, walkable: true },
    { sprite: 'c5_deckchair', x: 4, y: 9, text: 'beach_deckchair' },
    { sprite: 'c5_deckchair', x: 6, y: 10, text: 'beach_deckchair' },
    { sprite: 'c5_rowboat', x: 11, y: 12, text: 'beach_rowboat' },
    { sprite: 'c5_lobster_pots', x: 3, y: 12, text: 'beach_pots' },
    { sprite: 'c5_net_frame', x: 35, y: 10, text: 'beach_net' },
    { sprite: 'c5_buoy_red', x: 37, y: 12, text: 'beach_buoy' },
    { sprite: 'c5_anchor', x: 2, y: 8, text: 'beach_anchor' },
    { sprite: 'c5_barrels', x: 17, y: 3, text: 'beach_barrels' },
    { sprite: 'gold_pouch', x: 1, y: 11, text: 'beach_pouch', gold: 45, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
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
