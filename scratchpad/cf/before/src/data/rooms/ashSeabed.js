// THE BARE SEABED: the first room of Chapter 6. The sea pulled back at the end of Chapter 5,
// further than anyone has seen it go, and the three of them come down the old boat-slip (the one
// with the prow carved in its head, seen from the Last Light's balcony) onto the sand it left: long
// ripples, weed lying flat, a boat on its side, the last pools. The surf is a murmur far behind. To
// the north-east the sand turns grey: the first of the ash. The opening scene (ash_road_opens)
// plays as you step off the slip. PUZZLE-FREE, no monsters (the first room of the area).
// (draft)
// Tile key (see src/overworld/ashTiles.js, ashroad):
//   #  rock top   W  rock face   .  ash   :  the old road   ,  burnt stubble   q  bare seabed sand
//   ~  a pool (solid)   *  a hot crack (solid until ash smothers it)   O  boulder   T  burnt tree
//   J  stump or post   R  burnt rubble   f  charred fence   X  old cobbles   b / B  rock step and shelf

export const ASH_SEABED = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'ash_seabed',
  // The room's name, for the Room Editor.
  name: 'THE BARE SEABED',
  // The region it's in (src/data/areas.js): the title card, the look and the battle background.
  area: 'ashroad',
  // "Footprints Fill In" (src/data/music/ashTheme.js), and the sounds of the place under it.
  music: 'ash',
  ambience: 'ash_seabed',
  vesWell: true,
  lamplight: { shade: 0.18, tint: '46, 38, 30' },

  tiles: [
    '########################################',
    '##########WWWW#######WWWWWWW############',
    '###WWWWWWW....WWWWWWW.......WWWWWW######',
    '##W.........................,,....WWW###',
    '#W..q.qq.........q.....,,,.........,..W#',
    '#qqqqqqqqq.qqqqqqqqqqqqq.....,,,....::..',
    '#qqqqqqqqqqqqqqqqqqqqqqqqqqqq.....:::...',
    '#qqqqOqqqqqqqqqqqqqqqqqqqqqqqqqqq....:.#',
    '#qqqqqqqqqqqqqqqq~~~qqqqqqqqqqqqqqqq...#',
    '#qqqqqqqqqqqqq~~~~~~~qqqqqqqqqqqqqqqqq.#',
    '#qqqq~~qqqqqqqqq~~~~qqqqqqqqqOqqqqqqqqq#',
    '#qq~~~~~qqqqqqqqqqqqqqqqqqqqqqqqqq~~qqq#',
    '#qq~~~~qqqqqqqqqqqqqqqqqqqqqqqqq~~~~~qq#',
    '##qqqqqqqqqqqOqqqqqqqqqqqqq~~~~~~~~~~qq#',
    '##~~qqqqqqqqqqqqqqqqqqqqq~~~~~~~~~~~~~q#',
    '###~~~~~qqqqqqqqqq~~~~~~~~~~~~~~~~~~~~~#',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 5, y: 5 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 39, y: 5, w: 1, h: 2, to: 'ash_tideline', spawn: { x: 1, y: 5 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 3, y: 4, w: 5, h: 3, scene: 'ash_road_opens' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file. Heaps of ash
  // (`heap`), the wind post (`ashReset`) and things `buried` under a heap: see src/overworld/ashRoad.js.
  textFile: 'interactions/ashroad.txt',
  props: [
    { sprite: 'ar_slip_prow', x: 3, y: 3, text: 'seabed_slip' },
    { sprite: 'ar_boat', x: 12, y: 7, text: 'seabed_boat' },
    { sprite: 'c5_anchor', x: 24, y: 10, text: 'seabed_anchor' },
    { sprite: 'c5_rocks_weedy', x: 2, y: 9, text: 'seabed_rocks' },
    { sprite: 'c5_rock_weedy', x: 31, y: 10, text: 'seabed_rocks' },
    { sprite: 'ar_weed', x: 8, y: 6, flat: true, walkable: true },
    { sprite: 'ar_weed', x: 19, y: 11, flat: true, walkable: true },
    { sprite: 'ar_weed', x: 27, y: 8, flat: true, walkable: true },
    { sprite: 'ar_weed', x: 34, y: 9, flat: true, walkable: true },
    { sprite: 'ar_weed', x: 15, y: 13, flat: true, walkable: true },
    { sprite: 'ar_skull', x: 29, y: 4, text: 'skull' },
    { sprite: 'ar_cairn', x: 36, y: 4, text: 'cairn', marker: true },
    { sprite: 'gold_pouch', x: 37, y: 12, text: 'ash_pouch', gold: 60, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The life pass (14 November 2026): signs of old life, things to look at, depth.
    { sprite: 'c5_ship_ribs', x: 21, y: 13, text: 'seabed_ribs' },
    { sprite: 'c5_oar_stuck', x: 14, y: 11, text: 'seabed_oar' },
    { sprite: 'c5_toy_boat', x: 10, y: 10, text: 'seabed_toyboat', walkable: true },
    { sprite: 'c5_net_torn', x: 31, y: 7, text: 'seabed_net', walkable: true },
    { sprite: 'c5_rope_coil', x: 7, y: 13, text: 'seabed_rope', walkable: true },
    { sprite: 'c5_buoy_red', x: 29, y: 12, text: 'seabed_buoy' },
    { sprite: 'c5_crab_trail', x: 16, y: 6, flat: true, walkable: true, decor: true },
    { sprite: 'c5_crab_trail', x: 26, y: 9, flat: true, walkable: true, decor: true },
    { sprite: 'c5_wrack_line', x: 20, y: 4, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 12, y: 13, flat: true, walkable: true, decor: true },
    { sprite: 'c5_weed_mat', x: 33, y: 9, flat: true, walkable: true, decor: true },
    { sprite: 'al_dune_a', x: 31, y: 3, walkable: true, decor: true },
    { sprite: 'al_dune_b', x: 36, y: 7, walkable: true, decor: true },
    { sprite: 'al_dune_c', x: 27, y: 3, walkable: true, decor: true },
  ],
  tileTexts: { q: 'seabed_sand', "~": 'seabed_pool', "#": 'ash_rock', W: 'ash_rock', O: 'seabed_boulder' },

  // None: the first room of the area.
  npcs: [
  ],
};
