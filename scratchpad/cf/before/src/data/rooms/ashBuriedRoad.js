// THE BURIED ROAD: the TEACH room for the ash heaps (src/overworld/ashRoad.js). The road runs
// through a gap in a rock spur, and a heap of ash has blown into the gap (12,7). Ves blows it on into
// the hollow beyond (ves_and_the_ash teaches it as you come up the road). Across the far side of the
// hollow, the ground has split from wall to wall and still smoulders (x 25): a second heap by the road
// (23,7) blown into the crack smothers it, and the way is open. A third heap in the nook at the top
// (18,2) is sitting on a purse. The wind post (15,11) lays every heap back. One milestone monster
// on the far side of the crack.
// (draft)
// Tile key (see src/overworld/ashTiles.js, ashroad):
//   #  rock top   W  rock face   .  ash   :  the old road   ,  burnt stubble   q  bare seabed sand
//   ~  a pool (solid)   *  a hot crack (solid until ash smothers it)   O  boulder   T  burnt tree
//   J  stump or post   R  burnt rubble   f  charred fence   X  old cobbles   b / B  rock step and shelf

export const ASH_BURIED_ROAD = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'ash_buried_road',
  // The room's name, for the Room Editor.
  name: 'THE BURIED ROAD',
  // The region it's in (src/data/areas.js): the title card, the look and the battle background.
  area: 'ashroad',
  // "Footprints Fill In" (src/data/music/ashTheme.js), and the sounds of the place under it.
  music: 'ash',
  ambience: 'ash_waste',
  vesWell: true,

  tiles: [
    '##################################',
    '###WWWWWW######WWWWWW#####W####W##',
    '##W.,..,.#####W,...,.WWWWW.WWWW,W#',
    '#W,..,.,.W####,....,.....*,......#',
    '#..,T.....WWW#,.....,T..,*....T..#',
    '#..,.........#,........,.*.......#',
    'W...,..,....WW.........,.*.,.....W',
    '::::::::::::..:::::....,,*,..:::::',
    '::::::::::::W#:::::::::::*::::::::',
    '#,...........#..,.,::::::*:::....#',
    '#......,,...##.........,.*.......#',
    '#..T.,..O..###..,,....O..*...,.O.#',
    '#...,#########..,.,......###,..###',
    '################.,.#########...###',
    '##################################',
    '##################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 7 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 2, to: 'ash_tideline', spawn: { x: 36, y: 8 } },
    { x: 33, y: 7, w: 1, h: 2, to: 'ash_cinder_field', spawn: { x: 1, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 9, y: 2, w: 1, h: 11, scene: 'ves_and_the_ash' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file. Heaps of ash
  // (`heap`), the wind post (`ashReset`) and things `buried` under a heap: see src/overworld/ashRoad.js.
  textFile: 'interactions/ashroad.txt',
  props: [
    { sprite: 'ar_drift', x: 12, y: 7, heap: 1, text: 'heap' },
    { sprite: 'ar_drift', x: 18, y: 2, heap: 1, text: 'heap' },
    { sprite: 'ar_drift', x: 23, y: 7, heap: 1, text: 'heap' },
    { sprite: 'gold_pouch', x: 18, y: 2, text: 'ash_pouch', gold: 80, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' }, buried: true },
    { sprite: 'ar_windpost', x: 15, y: 11, text: 'windpost', ashReset: true, animation: 'ar_windpost', speed: 0.35 },
    { sprite: 'ar_milestone', x: 6, y: 4, text: 'milestone' },
    { sprite: 'ar_cart', x: 28, y: 4, text: 'cart' },
    { sprite: 'ar_cairn', x: 31, y: 9, text: 'cairn', marker: true },
    { sprite: 'ar_skull', x: 3, y: 10, text: 'skull' },
    { sprite: 'ar_weed', x: 20, y: 10, flat: true, walkable: true },
    { sprite: 'col_flower_cornflower', x: 30, y: 5, walkable: true, flat: true, gives: 'flower_cornflower', taken: { gone: true } },
    // The life pass (14 November 2026): signs of old life, things to look at, depth.
    { sprite: 'al_scarecrow', x: 4, y: 3, text: 'scarecrow' },
    { sprite: 'al_fence_bit', x: 6, y: 6, walkable: true, decor: true },
    { sprite: 'al_kettle', x: 7, y: 10, text: 'road_kettle', walkable: true },
    { sprite: 'al_cairn_rag', x: 6, y: 11, text: 'rag_road', gives: 'ash_rag_2', react: true, taken: { sprite: 'al_cairn_bare', text: 'rag_cairn_bare' } },
    { sprite: 'al_well', x: 19, y: 5, text: 'road_well' },
    { sprite: 'al_bucket', x: 22, y: 6, text: 'road_bucket', walkable: true },
    { sprite: 'al_snag_tree', x: 30, y: 3, text: 'dead_tree' },
    { sprite: 'al_dune_b', x: 3, y: 6, walkable: true, decor: true },
    { sprite: 'al_dune_a', x: 16, y: 9, walkable: true, decor: true },
    { sprite: 'al_dune_c', x: 29, y: 6, walkable: true, decor: true },
    { sprite: 'al_stalks', x: 11, y: 10, walkable: true, decor: true },
  ],
  tileTexts: { "*": 'crack', "#": 'ash_rock', W: 'ash_rock', O: 'ash_boulder', T: 'burnt_tree' },

  // The milestone keeps to the far side of the crack (x 28-31, row 10), clear of the road
  // the gust uses (row 7) and of the ves_and_the_ash trigger (x 9).
  npcs: [
    { enemy: 'milestone', x: 29, y: 10, patrol: [28, 31], behaviour: 'patrol' },
  ],
};
