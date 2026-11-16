// THE CINDER FIELD: the ash heaps' first twist. Two seams of smouldering ground cross the
// field from wall to wall (x 14 and x 19). There are two heaps, both on the near side: one on the road
// (10,9), one up in the field (12,5). One gust drops ash into the first crack it crosses, so to get
// ash over BOTH seams the heaps must go along the road together: blow the top one down onto the road
// (the boulder at 12,10 stops it at 12,9), then blow along the road from behind both (from 9,9): the
// wind scoops both, fills the first seam, and drops the rest beyond it; blow that on into the second.
// A purse lies between the seams. The wind post (5,12) lays everything back. A charcur and an
// ashling keep to the far side.
// (draft)
// Tile key (see src/overworld/ashTiles.js, ashroad):
//   #  rock top   W  rock face   .  ash   :  the old road   ,  burnt stubble   q  bare seabed sand
//   ~  a pool (solid)   *  a hot crack (solid until ash smothers it)   O  boulder   T  burnt tree
//   J  stump or post   R  burnt rubble   f  charred fence   X  old cobbles   b / B  rock step and shelf

export const ASH_CINDER_FIELD = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'ash_cinder_field',
  // The room's name, for the Room Editor.
  name: 'THE CINDER FIELD',
  // The region it's in (src/data/areas.js): the title card, the look and the battle background.
  area: 'ashroad',
  // "Footprints Fill In" (src/data/music/ashTheme.js), and the sounds of the place under it.
  music: 'ash',
  ambience: 'ash_waste',
  vesWell: true,

  tiles: [
    '####################################',
    '#######WWWWWW###########WWWWWWWWWW##',
    '#WWWWWW.,,..,WWWWWWWWWWW..........W#',
    '#............**,..**.....,......,..#',
    '#......,.....***.,.*.....T,.....T.,#',
    '#...T.....,...*....**,,.,...,......#',
    '#.........,...*...,*.,....,...,....#',
    'W.......,....,*....*,.....,,.......W',
    ':::::...,,.,..*....*....::::::::::::',
    '::::::::::::::*::::*::::::::::::::::',
    '#,...:::::::O:*::::*::::...........#',
    '#.,.,.,.......*...**........,T.....#',
    '#,.O..,.T...,.**...*............,.,#',
    '#.,..........**....**...O......O.,.#',
    '#.....,...,...*....*..,..,......,..#',
    '##########..,#######################',
    '####################################',
    '####################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 2, to: 'ash_buried_road', spawn: { x: 32, y: 7 } },
    { x: 35, y: 8, w: 1, h: 2, to: 'ash_orchard', spawn: { x: 1, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
  ],

  // Things you can press Z on. `text` names a section of this room's text file. Heaps of ash
  // (`heap`), the wind post (`ashReset`) and things `buried` under a heap: see src/overworld/ashRoad.js.
  textFile: 'interactions/ashroad.txt',
  props: [
    { sprite: 'ar_drift', x: 12, y: 5, heap: 1, text: 'heap' },
    { sprite: 'ar_drift', x: 10, y: 9, heap: 1, text: 'heap' },
    { sprite: 'ar_windpost', x: 5, y: 12, text: 'windpost', ashReset: true, animation: 'ar_windpost', speed: 0.35 },
    { sprite: 'gold_pouch', x: 17, y: 13, text: 'ash_pouch', gold: 90, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'ar_rubble', x: 7, y: 3, text: 'rubble' },
    { sprite: 'ar_old_fire', x: 26, y: 10, text: 'old_fire', flat: true, walkable: true },
    { sprite: 'ar_cairn', x: 33, y: 6, text: 'cairn', marker: true },
    { sprite: 'ar_skull', x: 4, y: 13, text: 'skull' },
    { sprite: 'ar_milestone', x: 27, y: 7, text: 'milestone' },
    { sprite: 'col_flower_poppy', x: 34, y: 13, walkable: true, flat: true, gives: 'flower_poppy', taken: { gone: true } },
    // The life pass (14 November 2026): signs of old life, things to look at, depth.
    { sprite: 'al_cairn_rag', x: 8, y: 13, text: 'rag_field', gives: 'ash_rag_3', react: true, taken: { sprite: 'al_cairn_bare', text: 'rag_cairn_bare' } },
    { sprite: 'gold_pouch', x: 10, y: 15, text: 'ash_pouch', gold: 85, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { "*": 'crack', "#": 'ash_rock', W: 'ash_rock', O: 'ash_boulder', T: 'burnt_tree' },

  // A charcur and an ashling together beyond the second seam (x 25-30, rows 11-14),
  // off the road. No cutscenes in this room.
  npcs: [
    { enemy: 'charcur', x: 27, y: 12, patrol: [25, 30], behaviour: 'patrol' },
    { enemy: 'ashling', x: 28, y: 13, patrol: [26, 30], behaviour: 'wander' },
  ],
};
