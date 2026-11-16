// THE OPEN FLATS: a wide flat of ash with nothing to break the wind, and the ASH STORMS
// (ashRoad.js, `ashStorm`): every 30 seconds the wind gets up and for a few seconds you can see only
// a little way round you; the road's cairns, each with its red rag, still show through it. A seam
// crosses the whole flat (x 15): blow the road's heap (12,9) into it. Further on, the only way
// between the two smouldering fields is a single pass (30,9), and a heap sits in it: blow it through.
// When a storm clears, the heaps blown away are laid again (a seam once smothered stays so).
// A milestone in the south-east, a soot gull in the north-west.
// (draft)
// Tile key (see src/overworld/ashTiles.js, ashroad):
//   #  rock top   W  rock face   .  ash   :  the old road   ,  burnt stubble   q  bare seabed sand
//   ~  a pool (solid)   *  a hot crack (solid until ash smothers it)   O  boulder   T  burnt tree
//   J  stump or post   R  burnt rubble   f  charred fence   X  old cobbles   b / B  rock step and shelf

export const ASH_STORM_FLATS = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'ash_storm_flats',
  // The room's name, for the Room Editor.
  name: 'THE OPEN FLATS',
  // The region it's in (src/data/areas.js): the title card, the look and the battle background.
  area: 'ashroad',
  // "Footprints Fill In" (src/data/music/ashTheme.js), and the sounds of the place under it.
  music: 'ash',
  ambience: 'ash_waste',
  vesWell: true,
  ashStorm: { every: 30, lasts: 9 },

  tiles: [
    '##############################################',
    '######WWWWWWW################WWWWWWW##########',
    '#WWWWW.....,.WWWWWWWWWWWWWWWW.*.,...WWWWWWWWW#',
    '#............***........,..**.***...,.,......#',
    '#..,..T..,,..***......O...*******.......,..,.#',
    '#,..,....,..,***...........******.......T....#',
    '#..,....T......*..........*****.....,,.......#',
    '#.,....,.......*....,.....*****........,,.O..#',
    'W,.............*...,..........*.............,W',
    ':::::::::::::::*::::::::::::::::::::::::::::::',
    ':::::::::::::::*::::::::::::::*:::::::::::::::',
    '#..............*.,.,.....,....***........,...#',
    '#...........,..***..........*.*****...,......#',
    '#....O.........***..........*******.,T......,#',
    '#..,,,.........***..........*******..,.......#',
    '#,........,T...*........O...*****............#',
    '#........,.....*......,,.....***......,......#',
    '################################.....#########',
    '##############################################',
    '##############################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'ash_orchard', spawn: { x: 38, y: 9 } },
    { x: 45, y: 9, w: 1, h: 2, to: 'ash_waystation', spawn: { x: 1, y: 7 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
  ],

  // Things you can press Z on. `text` names a section of this room's text file. Heaps of ash
  // (`heap`), the wind post (`ashReset`) and things `buried` under a heap: see src/overworld/ashRoad.js.
  textFile: 'interactions/ashroad.txt',
  props: [
    { sprite: 'ar_drift', x: 12, y: 9, heap: 1, text: 'heap' },
    { sprite: 'ar_drift', x: 30, y: 9, heap: 1, text: 'heap' },
    { sprite: 'ar_cairn', x: 5, y: 8, text: 'cairn', marker: true },
    { sprite: 'ar_cairn', x: 10, y: 11, text: 'cairn', marker: true },
    { sprite: 'ar_cairn', x: 20, y: 11, text: 'cairn', marker: true },
    { sprite: 'ar_cairn', x: 26, y: 8, text: 'cairn', marker: true },
    { sprite: 'ar_cairn', x: 35, y: 11, text: 'cairn', marker: true },
    { sprite: 'ar_cairn', x: 41, y: 8, text: 'cairn', marker: true },
    { sprite: 'ar_skull', x: 8, y: 14, text: 'skull' },
    { sprite: 'ar_rubble', x: 38, y: 4, text: 'rubble' },
    { sprite: 'gold_pouch', x: 43, y: 4, text: 'ash_pouch', gold: 100, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // The life pass (14 November 2026): signs of old life, things to look at, depth.
    { sprite: 'al_scarecrow', x: 7, y: 12, text: 'scarecrow' },
    { sprite: 'ar_milestone', x: 23, y: 12, text: 'milestone_joke' },
    { sprite: 'al_cairn_rag', x: 3, y: 15, text: 'rag_flats', gives: 'ash_rag_5', react: true, taken: { sprite: 'al_cairn_bare', text: 'rag_cairn_bare' } },
    { sprite: 'al_wheel_sunk', x: 3, y: 5, text: 'wheel_sunk', walkable: true },
    { sprite: 'al_log', x: 22, y: 5, walkable: true, decor: true },
    { sprite: 'al_snag_tree', x: 4, y: 12, text: 'dead_tree' },
    { sprite: 'al_snag_tree_b', x: 23, y: 3, text: 'dead_tree' },
    { sprite: 'al_snag_tree', x: 40, y: 13, text: 'dead_tree' },
    { sprite: 'al_snag', x: 44, y: 16, text: 'snag' },
    { sprite: 'al_dune_c', x: 8, y: 7, walkable: true, decor: true },
    { sprite: 'al_dune_a', x: 17, y: 15, walkable: true, decor: true },
    { sprite: 'al_dune_b', x: 21, y: 6, walkable: true, decor: true },
    { sprite: 'al_dune_a', x: 38, y: 8, walkable: true, decor: true },
    { sprite: 'al_stalks', x: 12, y: 4, walkable: true, decor: true },
    { sprite: 'al_stalks', x: 37, y: 15, walkable: true, decor: true },
    { sprite: 'ar_signpost', x: 34, y: 16, text: 'storm_hole' },
    { sprite: 'old_pack', x: 35, y: 17, text: 'storm_pack', gives: 'soot_bun', taken: { text: 'storm_pack_empty' } },
    { sprite: 'al_barrel', x: 33, y: 17, text: 'barrel_plain' },
  ],
  tileTexts: { "*": 'crack', "#": 'ash_rock', W: 'ash_rock', O: 'ash_boulder', T: 'burnt_tree' },

  // A milestone in the south-east (x 34-40, row 14) and a soot gull in the north-west
  // (x 6-12, rows 3-5), off the road. No cutscenes in this room.
  npcs: [
    { enemy: 'milestone', x: 39, y: 14, patrol: [38, 43], behaviour: 'patrol' },
    { enemy: 'soot_gull', x: 9, y: 5, patrol: [7, 12], behaviour: 'wander' },
  ],
};
