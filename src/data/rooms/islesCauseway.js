// THE CAUSEWAY: the last of the isles' rocks, and the old stone road laid from rock to rock
// across the water toward Haddock's Light, which stands at the far end with a warm window low
// down. The sea comes over the low places in sheets and runs off again. No puzzle: a long walk in
// the wind with things to fight on the way, a pool on the first rock, and a lot of weather.
//
// The causeway's far end (x 47, rows 7-9) is the door into Haddock's Light (haddock_light_door).
// Tile key (see src/overworld/coastTiles.js, isles):
//   #  rock top (solid)   ,  wind turf   .  rock slabs   X  the causeway's cobbles
//   ;  where the sea comes over (shallows, walk)   ~  the sea (solid)   x  barnacle rock (solid)

export const ISLES_CAUSEWAY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'isles_causeway',
  // The room's name, for the Room Editor.
  name: 'THE CAUSEWAY',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'isles',
  music: 'isles',
  ambience: 'open_sea',
  vesWell: true,
  // A little more weather out here on the open road.
  atmosphere: { rain: 1.2, spray: 1.3 },

  // The wrecks' silhouettes on the sea keep this many tiles clear of any shore
  // (src/overworld/atmosphere.js, buildSkyline).
  skylineClear: 2,

  tiles: [
    '################################################',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~,,,,,,~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~,,,,,~~~~~~~~~,,,,,,,,~~~~~~~~~~~~~~#',
    '#~~~~~~~~~,,,,x,,~~~~~~~~,,,x,,,,~~~~~~~~~~~~~~#',
    '#,,,,,,~~~,,x,,,,~~~~~~~~,,,,,,,,~~~~~~~,,,,,,,#',
    '#,,,,,,...,,,,,,,...~....,,,,,,,,..~....,,,x,,,#',
    'XXXXXXXXXXXXXXXXXXXX;;XXXXXXXXXXXXXX;;XXXXXXXXXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    '#XXXXXXXXXXXXXXXXXXX;;XXXXXXXXXXXXXX;;XXXXXXXXXX',
    '#,,,,,,...,,,,,,,.....~..,,,,,,,,.~.....,,,,,,,#',
    '#,,x,,,~~~,~~~,,,~~~~~~~~,,,,,,,,~~~~~~~,,,,,x,#',
    '#,,,,,,~~~,~~~,,,~~~~~~~~,,,,,,,,~~~~~~~,,,,,,,#',
    '#~~~~~~~~~,,,,,,,~~~~~~~~,,x,,x,,~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~,,,,,~~~~~~~~~,,,,,,,,~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~,,,,,,~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '################################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 2, to: 'isles_west_light', spawn: { x: 41, y: 11 } },
    // On to Haddock's Light.
    { x: 47, y: 7, w: 1, h: 3, to: 'haddock_light_door', spawn: { x: 2, y: 9 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/isles.txt',
  props: [
    // Haddock's Light, ahead across the water.
    { sprite: 'il_far_light', x: 44, y: 3, text: 'causeway_haddocks_light', walkable: true },
    { sprite: 'sign', x: 3, y: 6, text: 'causeway_sign' },
    { sprite: 'c5_lifebuoy_post', x: 16, y: 6, text: 'causeway_lifebuoy' },
    { sprite: 'c5_buoy_yellow', x: 29, y: 5, text: 'causeway_buoy' },
    { sprite: 'c5_driftwood', x: 41, y: 11, text: 'causeway_driftwood' },
    { sprite: 'c5_seaweed_heap', x: 14, y: 13, text: 'causeway_weed' },
    { sprite: 'gold_pouch', x: 28, y: 14, text: 'causeway_pouch', gold: 220, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'isles_rock', '~': 'causeway_sea', X: 'causeway_stones', ';': 'causeway_wash', x: 'isles_light_rock' },

  // A TRIO at the first rock: an old diver standing sentry on the causeway (row 9, x 11 to 14), a
  // pinwheel rolling about the rock's turf beside it (x 12 to 14, home row 10) and a kelpie foal in
  // the rock's pool (row 11, x 11 to 13, deep water). Touch the diver and the other two come in with
  // it. The second rock is left empty for the long walk. None comes near the doors.
  // No cutscenes in this room.
  npcs: [
    { enemy: 'old_diver', x: 12, y: 9, patrol: [11, 14], behaviour: 'patrol' },
    { enemy: 'pinwheel', x: 13, y: 10, patrol: [12, 14], behaviour: 'wander' },
    { enemy: 'kelpie_foal', x: 12, y: 11, patrol: [11, 13], behaviour: 'patrol' },
  ],
};
