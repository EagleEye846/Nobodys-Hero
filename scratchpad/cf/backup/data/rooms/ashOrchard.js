// THE BLACK ORCHARD: rows of fruit trees, burnt black and still standing in their rows, the
// ash knee-deep between them. A cart left where it stopped. A rock shelf in the north-east corner you
// jump up onto (b, then B) for a purse. One green shoot, the only green for miles (24,13). PUZZLE-FREE.
// orchard_talk (Ves and Bramble about Corrie and "My turn.") plays at x 20. Two ashlings in the
// south-east, a soot gull in the north-west.
// (draft)
// Tile key (see src/overworld/ashTiles.js, ashroad):
//   #  rock top   W  rock face   .  ash   :  the old road   ,  burnt stubble   q  bare seabed sand
//   ~  a pool (solid)   *  a hot crack (solid until ash smothers it)   O  boulder   T  burnt tree
//   J  stump or post   R  burnt rubble   f  charred fence   X  old cobbles   b / B  rock step and shelf

export const ASH_ORCHARD = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'ash_orchard',
  // The room's name, for the Room Editor.
  name: 'THE BLACK ORCHARD',
  // The region it's in (src/data/areas.js): the title card, the look and the battle background.
  area: 'ashroad',
  // "Footprints Fill In" (src/data/music/ashTheme.js), and the sounds of the place under it.
  music: 'ash',
  ambience: 'ash_waste',
  vesWell: true,

  tiles: [
    '########################################',
    '####WWWWWWWWWWW#######WWWWWWWWWWWWW#####',
    '#WWW...,.,.,...WWWWWWW,,...........WWWW#',
    '#.....,,,..,..,.,.,..,,...,.,......BB..#',
    '#.....T.,......J..J,,.T...T...T.,.bbB..#',
    '#.....,,..,...,.....,.,..,,..,..,......#',
    '#...,......,,,......,,,.,,..,.,........#',
    'W.....T,.,T,.,T.,,J..,,T..T.,..,.......#',
    ':::::::,.,..,.,,..............,........W',
    '::::::::::::::::::.,....,,..,,,.::::::::',
    '#......:::::::::::::::::::::::::::::::::',
    '#...,.......,.,,,.::::::::::::::.......#',
    '#......,,,T....T,.T..,,...T..,T........#',
    '#.O......,....,,,........,.,...,.....O.#',
    '#.......,..,..........,,..,.,...,......#',
    '####,.,J.,################.T..J,,#######',
    '########################################',
    '########################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'ash_cinder_field', spawn: { x: 34, y: 8 } },
    { x: 39, y: 9, w: 1, h: 2, to: 'ash_storm_flats', spawn: { x: 1, y: 9 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 20, y: 2, w: 1, h: 13, scene: 'orchard_talk' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file. Heaps of ash
  // (`heap`), the wind post (`ashReset`) and things `buried` under a heap: see src/overworld/ashRoad.js.
  textFile: 'interactions/ashroad.txt',
  props: [
    { sprite: 'ar_cart', x: 31, y: 6, text: 'orchard_cart' },
    { sprite: 'ar_shoot', x: 24, y: 13, text: 'orchard_shoot', flat: true, walkable: true },
    { sprite: 'gold_pouch', x: 36, y: 3, text: 'ash_pouch', gold: 120, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'ar_signpost', x: 36, y: 12, text: 'orchard_sign' },
    { sprite: 'ar_skull', x: 5, y: 13, text: 'skull' },
    { sprite: 'ar_rubble', x: 3, y: 4, text: 'rubble' },
    { sprite: 'ar_weed', x: 12, y: 14, flat: true, walkable: true },
    { sprite: 'col_flower_violet', x: 38, y: 14, walkable: true, flat: true, gives: 'flower_violet', taken: { gone: true } },
    // The life pass (14 November 2026): signs of old life, things to look at, depth.
    { sprite: 'al_signboard', x: 2, y: 6, text: 'orchard_board' },
    { sprite: 'al_dinner_bell', x: 9, y: 3, text: 'orchard_bell' },
    { sprite: 'al_scarecrow', x: 14, y: 3, text: 'scarecrow' },
    { sprite: 'al_stump_axe', x: 17, y: 5, text: 'orchard_axe' },
    { sprite: 'al_name_tree', x: 22, y: 5, text: 'orchard_nametree' },
    { sprite: 'al_birdhouse', x: 28, y: 4, text: 'orchard_birdhouse' },
    { sprite: 'al_barrel', x: 33, y: 6, text: 'barrel_orchard' },
    { sprite: 'al_skep', x: 12, y: 12, text: 'orchard_skep' },
    { sprite: 'al_pump', x: 18, y: 13, text: 'orchard_pump' },
    { sprite: 'al_trough', x: 19, y: 13, text: 'orchard_trough' },
    { sprite: 'al_bucket', x: 17, y: 14, text: 'road_bucket', walkable: true },
    { sprite: 'al_chair', x: 34, y: 13, text: 'orchard_chair' },
    { sprite: 'al_cairn_rag', x: 8, y: 12, text: 'rag_orchard', gives: 'ash_rag_4', react: true, taken: { sprite: 'al_cairn_bare', text: 'rag_cairn_bare' } },
    { sprite: 'al_shoe', x: 21, y: 13, text: 'shoe', flat: true, walkable: true },
    { sprite: 'al_snag_tree', x: 2, y: 14, text: 'dead_tree' },
    { sprite: 'al_snag_tree_b', x: 38, y: 12, text: 'dead_tree' },
    { sprite: 'al_fence_bit', x: 12, y: 7, walkable: true, decor: true },
    { sprite: 'al_dune_a', x: 6, y: 10, walkable: true, decor: true },
    { sprite: 'al_dune_b', x: 35, y: 11, walkable: true, decor: true },
    { sprite: 'al_dune_c', x: 26, y: 2, walkable: true, decor: true },
    { sprite: 'al_stalks', x: 24, y: 6, walkable: true, decor: true },
    { sprite: 'al_stalks', x: 3, y: 12, walkable: true, decor: true },
  ],
  tileTexts: { "#": 'ash_rock', W: 'ash_rock', O: 'ash_boulder', T: 'orchard_tree', J: 'orchard_stump', b: 'ash_shelf', B: 'ash_shelf' },

  // Two ashlings together in the south-east (x 27-33, rows 11-14) and a soot gull in the
  // north-west (x 5-11, rows 4-6). The orchard_talk trigger (x 20) has no walks in it.
  npcs: [
    { enemy: 'ashling', x: 29, y: 13, patrol: [27, 32], behaviour: 'patrol' },
    { enemy: 'ashling', x: 31, y: 14, patrol: [29, 33], behaviour: 'wander' },
    { enemy: 'soot_gull', x: 8, y: 5, patrol: [5, 11], behaviour: 'wander' },
  ],
};
