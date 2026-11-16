// THE TIDELINE: where the bare sand gives out and the ash begins, over the old high-water mark.
// The first of the ash is still coming down, slow as snow (first_ash: Bramble is sure it is snow).
// The old road starts here under the ash, with its first milestone. PUZZLE-FREE. A soot gull and an
// ashling keep to the east end together.
// (draft)
// Tile key (see src/overworld/ashTiles.js, ashroad):
//   #  rock top   W  rock face   .  ash   :  the old road   ,  burnt stubble   q  bare seabed sand
//   ~  a pool (solid)   *  a hot crack (solid until ash smothers it)   O  boulder   T  burnt tree
//   J  stump or post   R  burnt rubble   f  charred fence   X  old cobbles   b / B  rock step and shelf

export const ASH_TIDELINE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'ash_tideline',
  // The room's name, for the Room Editor.
  name: 'THE TIDELINE',
  // The region it's in (src/data/areas.js): the title card, the look and the battle background.
  area: 'ashroad',
  // "Footprints Fill In" (src/data/music/ashTheme.js), and the sounds of the place under it.
  music: 'ash',
  ambience: 'ash_waste',
  vesWell: true,

  tiles: [
    '######################################',
    '####WWWWW###########WWWWW#####WWWW####',
    '#WWW.....WWWWW######.....WWWWW....WW##',
    '#qqq...........WWWW...,,.......T....W#',
    '#qqqqq..............,,,,,..........T.#',
    'qqqqqqqq.....::::.......,,.....,,....#',
    'qqqqqqqqq..::::::::::........,,,,....#',
    '#qqqqqqq.....,,,..:::::::::.....,....#',
    '#qqqqqq...O.........,,..::::::::::::::',
    '#qqqqqqq.............T.....,,::::::::.',
    '#qqq~~qqqq.......,,,.............,...#',
    '#qq~~~~qqqq...T.......O........T.....#',
    '#qqq~~qqqqqq.........,,,,...........##',
    '##qqqqqqqqqqqqq.......,,.....O....####',
    '###qqqqqqqq~~~qqq.....WWW#####WWWW####',
    '######################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 5 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 5, w: 1, h: 2, to: 'ash_seabed', spawn: { x: 38, y: 5 } },
    { x: 37, y: 8, w: 1, h: 2, to: 'ash_buried_road', spawn: { x: 1, y: 7 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 11, y: 3, w: 1, h: 11, scene: 'first_ash' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file. Heaps of ash
  // (`heap`), the wind post (`ashReset`) and things `buried` under a heap: see src/overworld/ashRoad.js.
  textFile: 'interactions/ashroad.txt',
  props: [
    { sprite: 'ar_milestone', x: 18, y: 4, text: 'milestone_far' },
    { sprite: 'ar_signpost', x: 27, y: 4, text: 'tide_signpost' },
    { sprite: 'ar_cairn', x: 30, y: 6, text: 'cairn', marker: true },
    { sprite: 'ar_weed', x: 5, y: 8, flat: true, walkable: true },
    { sprite: 'ar_weed', x: 8, y: 12, flat: true, walkable: true },
    { sprite: 'ar_skull', x: 25, y: 12, text: 'skull' },
    { sprite: 'c5_driftwood', x: 7, y: 10, text: 'tide_driftwood' },
    { sprite: 'gold_pouch', x: 34, y: 4, text: 'ash_pouch', gold: 70, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'col_flower_harebell', x: 1, y: 3, walkable: true, flat: true, gives: 'flower_harebell', taken: { gone: true } },
    // The life pass (14 November 2026): signs of old life, things to look at, depth.
    { sprite: 'al_ashman', x: 15, y: 10, text: 'tide_ashman' },
    { sprite: 'al_snag_tree', x: 22, y: 3, text: 'dead_tree' },
    { sprite: 'al_snag', x: 13, y: 12, text: 'snag' },
    { sprite: 'al_fence_bit', x: 9, y: 3, walkable: true, decor: true },
    { sprite: 'al_wheel_sunk', x: 14, y: 7, text: 'wheel_sunk', walkable: true },
    { sprite: 'al_shoe', x: 20, y: 8, text: 'shoe', flat: true, walkable: true },
    { sprite: 'al_cairn_rag', x: 17, y: 12, text: 'rag_tide', gives: 'ash_rag_1', react: true, taken: { sprite: 'al_cairn_bare', text: 'rag_cairn_bare' } },
    { sprite: 'al_dune_a', x: 33, y: 8, walkable: true, decor: true },
    { sprite: 'al_dune_b', x: 12, y: 4, walkable: true, decor: true },
    { sprite: 'al_dune_c', x: 24, y: 13, walkable: true, decor: true },
    { sprite: 'al_stalks', x: 6, y: 13, walkable: true, decor: true },
    { sprite: 'al_stalks', x: 30, y: 3, walkable: true, decor: true },
  ],
  tileTexts: { q: 'seabed_sand', "~": 'seabed_pool', "#": 'ash_rock', W: 'ash_rock', O: 'ash_boulder', T: 'burnt_tree' },

  // A soot gull and an ashling together at the east end (x 26-34, rows 10-13), well clear of
  // the first_ash trigger (x 11), which has no walks in it.
  npcs: [
    { enemy: 'soot_gull', x: 29, y: 10, patrol: [26, 33], behaviour: 'wander' },
    { enemy: 'ashling', x: 31, y: 12, patrol: [28, 34], behaviour: 'patrol' },
  ],
};
