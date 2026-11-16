// THE TOWN GATE: the end of the Ash Road (area 1 of Chapter 6). A burnt farmhouse stands by the
// road with its chimney still whole: the Lum, the mini-boss (the_lum_wakes as you come in, x 4). Past
// it, the gate of the buried town stands up out of the ash, and behind it a bank of ash as high as
// the roofs, with the roofs showing in it. After the fight, gate_choked: the gate is full of ash to
// the lintel. The town is the next part of the chapter (not built yet). No monsters but the Lum.
// (draft)
// Tile key (see src/overworld/ashTiles.js, ashroad):
//   #  rock top   W  rock face   .  ash   :  the old road   ,  burnt stubble   q  bare seabed sand
//   ~  a pool (solid)   *  a hot crack (solid until ash smothers it)   O  boulder   T  burnt tree
//   J  stump or post   R  burnt rubble   f  charred fence   X  old cobbles   b / B  rock step and shelf

export const ASH_TOWN_GATE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'ash_town_gate',
  // The room's name, for the Room Editor.
  name: 'THE TOWN GATE',
  // The region it's in (src/data/areas.js): the title card, the look and the battle background.
  area: 'ashroad',
  // "Footprints Fill In" (src/data/music/ashTheme.js), and the sounds of the place under it.
  music: 'ash',
  ambience: 'ash_waste',
  vesWell: true,

  tiles: [
    '####################################',
    '####################################',
    '##########WWWWWW############WWWW####',
    '#########W......WW######WW##bBBBWWW#',
    '########W....,....W####W..WWBBBBBBB#',
    '#WWWWWWW.........,.WWWW....bBBBBBBB#',
    '#....,,.........T.........bbBBBBBBB#',
    '#.......................J...BBBBBBB#',
    '#...T....................,.bBBBBBBB#',
    'W.......,...............,.......BBB#',
    '::::::::....,........::::::::...BBB#',
    ':::::::::::::::::::::::::::::...BBB#',
    '#.,.....:::::::::::::..........bBBB#',
    '#..,........,........,........bbBBB#',
    '#..O,...,.............,......,..BBB#',
    '#.....,.............T..........bBBB#',
    '#..,,..,......,.............,###bb##',
    '#####.,.............,.,##,.#########',
    '################,.....##############',
    '####################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 10, w: 1, h: 2, to: 'ash_drift_cut', spawn: { x: 36, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 4, y: 6, w: 1, h: 11, scene: 'the_lum_wakes' },
    { x: 27, y: 9, w: 5, h: 3, scene: 'gate_choked', after: 'the_lum_wakes' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file. Heaps of ash
  // (`heap`), the wind post (`ashReset`) and things `buried` under a heap: see src/overworld/ashRoad.js.
  textFile: 'interactions/ashroad.txt',
  props: [
    { sprite: 'ar_farmhouse', x: 8, y: 5, text: 'farmhouse', until: 'the_lum_wakes' },
    { sprite: 'ar_farmhouse_whole', x: 8, y: 5, text: 'farmhouse_after', after: 'the_lum_wakes' },
    { sprite: 'ar_town_gate', x: 29, y: 9, text: 'town_gate' },
    { sprite: 'ar_buried_roof', x: 32, y: 5, text: 'roofs' },
    { sprite: 'ar_buried_roof', x: 29, y: 4, text: 'roofs' },
    { sprite: 'ar_buried_roof', x: 32, y: 12, text: 'roofs' },
    { sprite: 'ar_milestone', x: 20, y: 8, text: 'milestone_last' },
    { sprite: 'ar_skull', x: 6, y: 15, text: 'skull' },
    { sprite: 'ar_cairn', x: 25, y: 13, text: 'cairn', marker: true },
    // The life pass (14 November 2026): signs of old life, things to look at, depth.
    { sprite: 'al_mailbox', x: 16, y: 9, text: 'gate_mailbox' },
    { sprite: 'al_barrel', x: 17, y: 5, text: 'barrel_plain' },
    { sprite: 'al_scarecrow', x: 23, y: 6, text: 'scarecrow' },
  ],
  tileTexts: { "#": 'ash_rock', W: 'ash_rock', O: 'ash_boulder', T: 'burnt_tree', J: 'ash_post', B: 'ash_bank' },

  // None: the Lum is the fight here (the_lum_wakes).
  npcs: [
  ],
};
