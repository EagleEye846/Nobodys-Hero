// THE DRIFT CUT: the area's last ash puzzle. The road goes through a cut in the rock, and
// three seams cross the cut from wall to wall (x 14, 18 and 26). A BIG heap lies on the road (11,8):
// big heaps fill a crack for every heap's worth in them. Blown along the road from behind it, it fills
// the first seam and comes down short of the second; blown again, it fills that one. The last seam
// needs the heap up in the alcove (21,3): blown down it drops onto the road against the boulder (21,9),
// and from there along the road into the seam. A spare heap in the west end (6,5) and the wind post
// (3,10) for mistakes. In the east hollow, a step (b) and a shelf (B) with a purse on it. A soot gull
// and a milestone in the east hollow.
// (draft)
// Tile key (see src/overworld/ashTiles.js, ashroad):
//   #  rock top   W  rock face   .  ash   :  the old road   ,  burnt stubble   q  bare seabed sand
//   ~  a pool (solid)   *  a hot crack (solid until ash smothers it)   O  boulder   T  burnt tree
//   J  stump or post   R  burnt rubble   f  charred fence   X  old cobbles   b / B  rock step and shelf

export const ASH_DRIFT_CUT = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'ash_drift_cut',
  // The room's name, for the Room Editor.
  name: 'THE DRIFT CUT',
  // The region it's in (src/data/areas.js): the title card, the look and the battle background.
  area: 'ashroad',
  // "Footprints Fill In" (src/data/music/ashTheme.js), and the sounds of the place under it.
  music: 'ash',
  ambience: 'ash_waste',
  vesWell: true,

  tiles: [
    '######################################',
    '####WW##############WWW############WW#',
    '###W,.WWWWW#########...########WWWW,.#',
    '#WW.......,#########...########...BB.#',
    '#.......,,.WWW######...WW###WW#..bBB.#',
    '#..T..........WWWWWW.,...WWW..W.....,#',
    '#.,.....,...,.*.O.*.......*..O.......#',
    'W.............*...*.,.....*,.........W',
    '::::::::::::::*:::*:::::::*:::::::::::',
    '::::::::::::::*:::*::O::::*:::::::::::',
    '#.............*...*.....,.*...,......#',
    '#..,...T..O.O,*.,.*.....O.*.........O#',
    '#...O..,..#####..##..######...#.,T...#',
    '#.........#####################......#',
    '###......#########################...#',
    '####.#############################,.##',
    '######################################',
    '######################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'ash_waystation', spawn: { x: 28, y: 7 } },
    { x: 37, y: 8, w: 1, h: 2, to: 'ash_town_gate', spawn: { x: 1, y: 10 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
  ],

  // Things you can press Z on. `text` names a section of this room's text file. Heaps of ash
  // (`heap`), the wind post (`ashReset`) and things `buried` under a heap: see src/overworld/ashRoad.js.
  textFile: 'interactions/ashroad.txt',
  props: [
    { sprite: 'ar_drift_mid', x: 11, y: 8, heap: 2, text: 'heap' },
    { sprite: 'ar_drift', x: 21, y: 3, heap: 1, text: 'heap' },
    { sprite: 'ar_drift', x: 6, y: 5, heap: 1, text: 'heap' },
    { sprite: 'ar_windpost', x: 3, y: 10, text: 'windpost', ashReset: true, animation: 'ar_windpost', speed: 0.35 },
    { sprite: 'gold_pouch', x: 35, y: 3, text: 'ash_pouch', gold: 150, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'ar_cairn', x: 31, y: 6, text: 'cairn', marker: true },
    { sprite: 'ar_skull', x: 33, y: 13, text: 'skull' },
    { sprite: 'ar_rubble', x: 8, y: 3, text: 'rubble' },
    { sprite: 'ar_weed', x: 22, y: 11, flat: true, walkable: true },
    // The life pass (14 November 2026): signs of old life, things to look at, depth.
    { sprite: 'ar_signpost', x: 5, y: 6, text: 'cut_toll' },
    { sprite: 'al_chair', x: 3, y: 13, text: 'cut_chair' },
  ],
  tileTexts: { "*": 'crack', "#": 'ash_rock', W: 'ash_rock', O: 'ash_boulder', T: 'burnt_tree', b: 'ash_shelf', B: 'ash_shelf' },

  // A soot gull and a milestone together in the east hollow (x 31-36, rows 10-14), south of
  // the road and clear of the shelf. No cutscenes in this room.
  npcs: [
    { enemy: 'soot_gull', x: 33, y: 11, patrol: [31, 35], behaviour: 'wander' },
    { enemy: 'milestone', x: 34, y: 13, patrol: [32, 36], behaviour: 'patrol' },
  ],
};
