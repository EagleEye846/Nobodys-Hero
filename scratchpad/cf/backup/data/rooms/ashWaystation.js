// THE WAYSTATION: an old stopping-place on the road, roofless, its back wall standing and its
// front gone, the cobbles of its floor swept by the wind. A save point inside, a cold fire, a bench.
// By the doorway, a lantern hook with no lantern on it (a quiet sign that somebody tidy passed this
// way not long ago; never more than that). waystation_talk: Ves and Bramble, the ledger and the
// word "found". PUZZLE-FREE, no monsters (a save room).
// (draft)
// Tile key (see src/overworld/ashTiles.js, ashroad):
//   #  rock top   W  rock face   .  ash   :  the old road   ,  burnt stubble   q  bare seabed sand
//   ~  a pool (solid)   *  a hot crack (solid until ash smothers it)   O  boulder   T  burnt tree
//   J  stump or post   R  burnt rubble   f  charred fence   X  old cobbles   b / B  rock step and shelf

export const ASH_WAYSTATION = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'ash_waystation',
  // The room's name, for the Room Editor.
  name: 'THE WAYSTATION',
  // The region it's in (src/data/areas.js): the title card, the look and the battle background.
  area: 'ashroad',
  // "Footprints Fill In" (src/data/music/ashTheme.js), and the sounds of the place under it.
  music: 'ash',
  ambience: 'ash_waste',
  vesWell: true,

  tiles: [
    '##############################',
    '########WWWWWWWWWWWWW#########',
    '######WWRRRRRXXRRRRRRWWWWWWWW#',
    '#WWWWW..RXXXXXXXXXXXR........#',
    '#...T..,RXXXXXXXXXXXR.....J..#',
    '#...,...fXXXXXXXXXXXf.,.....,#',
    'W,......,.,,......,.....,....W',
    '::::::::::::::::::::::::::::::',
    '::::::::::::::::::::::::::::::',
    '#.....,................,...,.#',
    '#....,......................,#',
    '#..O....,..............,.T...#',
    '#.............,..........,...#',
    '#########.........,....#######',
    '#########........,,,.#########',
    '##############################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 7 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 2, to: 'ash_storm_flats', spawn: { x: 44, y: 9 } },
    { x: 29, y: 7, w: 1, h: 2, to: 'ash_drift_cut', spawn: { x: 1, y: 8 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [
    { x: 14, y: 6, w: 1, h: 4, scene: 'waystation_talk' },
    // Bramble's rags: all five, off the spare cairns along the road (optional), tied into a pennant.
    { x: 6, y: 6, w: 1, h: 4, scene: 'bramble_rags', gear: ['ash_rag_1', 'ash_rag_2', 'ash_rag_3', 'ash_rag_4', 'ash_rag_5'] },
  ],

  // Things you can press Z on. `text` names a section of this room's text file. Heaps of ash
  // (`heap`), the wind post (`ashReset`) and things `buried` under a heap: see src/overworld/ashRoad.js.
  textFile: 'interactions/ashroad.txt',
  props: [
    { sprite: 'savepoint', x: 14, y: 4, save: true },
    { sprite: 'campfire_cold', x: 11, y: 4, text: 'way_fire' },
    { sprite: 'bench', x: 17, y: 4, text: 'way_bench' },
    { sprite: 'ar_hook_post', x: 21, y: 5, text: 'way_hook' },
    { sprite: 'ar_signpost', x: 24, y: 5, text: 'way_sign' },
    { sprite: 'ar_milestone', x: 4, y: 10, text: 'milestone_near' },
    { sprite: 'ar_cairn', x: 27, y: 10, text: 'cairn', marker: true },
    { sprite: 'ar_skull', x: 10, y: 11, text: 'skull' },
    { sprite: 'col_flower_marigold', x: 27, y: 12, walkable: true, flat: true, gives: 'flower_marigold', taken: { gone: true } },
    // The life pass (14 November 2026): signs of old life, things to look at, depth.
    { sprite: 'al_hedgehog', x: 16, y: 5, npc: 'gorse', animation: 'al_hedgehog', speed: 0.7 },
    { sprite: 'al_salvage', x: 18, y: 5, text: 'way_salvage' },
    { sprite: 'al_trough', x: 24, y: 10, text: 'way_trough' },
    { sprite: 'al_barrel', x: 6, y: 12, text: 'barrel_plain' },
    { sprite: 'al_bucket', x: 7, y: 12, text: 'road_bucket', walkable: true },
    { sprite: 'al_snag_tree', x: 26, y: 12, text: 'dead_tree' },
    { sprite: 'al_snag', x: 3, y: 9, text: 'snag' },
    { sprite: 'al_dune_a', x: 2, y: 12, walkable: true, decor: true },
    { sprite: 'al_dune_b', x: 15, y: 12, walkable: true, decor: true },
    { sprite: 'al_dune_c', x: 22, y: 13, walkable: true, decor: true },
    { sprite: 'al_stalks', x: 10, y: 10, walkable: true, decor: true },
    { sprite: 'al_stalks', x: 19, y: 11, walkable: true, decor: true },
  ],
  tileTexts: { "#": 'ash_rock', W: 'ash_rock', O: 'ash_boulder', T: 'burnt_tree', R: 'way_wall', f: 'way_wall', X: 'way_floor' },

  // None: a save room.
  npcs: [
  ],
};
