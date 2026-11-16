// THE CAUSEWAY: the last of the isles' rocks, and the old stone road laid from rock to rock
// across the water toward Haddock's Light, which stands at the far end with a warm window low
// down. The sea comes over the low places in sheets and runs off again. No puzzle: a long walk in
// the wind with things to fight on the way, a pool on the first rock, and a lot of weather.
//
// The causeway's far end (x 47, rows 7-9) is the door into Haddock's Light (haddock_light_door).
// The west door goes back over the Gannet Stack (isles_gannet_stack) to the West Light.
// Tile key (see src/overworld/coastTiles.js, isles):
//   #  rock top (solid)   ,  wind turf   .  rock slabs   X  the causeway's cobbles
//   ;  where the sea comes over (shallows, walk)   ~  the sea (solid)   x  barnacle rock (solid)

import { LIFE5_PROPS } from '../lifePass5.js';

export const ISLES_CAUSEWAY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'isles_causeway',
  // The room's name, for the Room Editor.
  name: 'THE CAUSEWAY',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'isles',
  music: 'isles',
  ambience: 'open_sea',
  // After the chapter (the_light_answers) the storm is over, as at the tower's foot: no rain or
  // lightning, the sea lying down, and the grey-blue light of a quiet sea in place of the storm's green.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.5, fog: 0.15 }, ambience: 'calm_sea', lamplight: { shade: 0.32, tint: '30, 40, 64' } },
  vesWell: true,
  // A little more weather out here on the open road.
  atmosphere: { rain: 1.2, spray: 1.3 },

  // The wrecks' silhouettes on the sea keep this many tiles clear of any shore
  // (src/overworld/atmosphere.js, buildSkyline).
  skylineClear: 2,

  tiles: [
    '################################################',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~,,,,,~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~,,,,,~~~~~~~~,,,,,,,,,~~~~~~~~~~~~~~#',
    '#~~,,,~~~~,,,,x,,~~~~~~~,,,,x,,,,~~~~~~~~~,,,~~#',
    '#~~,,,.~~~,,x,,,,~~~~~~~~,,,,,,,,,~~~~~~~,,,,,,#',
    '#,,,,,,...,,,,,,,...~....,,,,,..,..~....,,,x,.,#',
    'XXXX.XXXXXXXXXXXXXXX;;XXXXXXX.XXXXXX;;XXXXXXXXXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.XXXXX',
    '#XXXXXXXXXXXXXX;XXXX;;X;XXXXXX;;XXXX;;XXXXXXXXXX',
    '#,,.,,,...,,,,,,,.....~..,,,,,,,,.~.....,,,,,,,#',
    '#,,x,.,~~~,~~~,,,~~~~~~~~.,,,,,,,~~~~~~~,,,,.x,#',
    '#~.,,,,~~~,~~~,,,~~~~~~~~,,,;,,,,,~~~~~~~,,,,,,#',
    '#~~~~~~~,,,,,,,,,~~~~~~~,,,x,,x,,~~~~~~~~~,,~~~#',
    '#~~~~~~~~~~,,,,,~~~~~~~~~,,,,,,,~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~,,,,,~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '################################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 8 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 7, w: 1, h: 2, to: 'isles_gannet_stack', spawn: { x: 37, y: 12 } },
    // On to Haddock's Light.
    { x: 47, y: 7, w: 1, h: 3, to: 'haddock_light_door', spawn: { x: 2, y: 9 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/isles.txt',
  props: [
    // Haddock's Light, ahead across the water.
    { sprite: 'il_far_light', x: 44, y: 3, text: 'causeway_haddocks_light', walkable: true, until: 'haddock_gone' },
    { sprite: 'il_far_light', x: 44, y: 3, text: 'causeway_haddocks_light_after', walkable: true, after: 'haddock_gone' },
    { sprite: 'sign', x: 3, y: 6, text: 'causeway_sign' },
    { sprite: 'c5_lifebuoy_post', x: 16, y: 6, text: 'causeway_lifebuoy' },
    { sprite: 'c5_buoy_yellow', x: 29, y: 5, text: 'causeway_buoy' },
    { sprite: 'c5_driftwood', x: 41, y: 11, text: 'causeway_driftwood' },
    { sprite: 'c5_seaweed_heap', x: 14, y: 13, text: 'causeway_weed' },
    { sprite: 'gold_pouch', x: 28, y: 14, text: 'causeway_pouch', gold: 220, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Where the sea comes over, it leaves its weed on the stones; planks and a boat turned keel-up
    // on the rocks; gulls, a crab, rain in the hollows. Two lanterns on posts mark the road where
    // it leaves each rock, so it can be found in the dark.
    { sprite: 'c5_wrack_line', x: 19, y: 8, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 35, y: 9, flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 3, y: 11, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 27, y: 11, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 31, y: 4, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 43, y: 12, flat: true, walkable: true },
    { sprite: 'c5_net_torn', x: 8, y: 5, flat: true, walkable: true },
    { sprite: 'c5_boat_upturned', x: 27, y: 3 },
    { sprite: 'c5_lantern_hook', x: 24, y: 6 },
    { sprite: 'c5_lantern_hook', x: 39, y: 10 },
    // Second pass: the three rocks' own look (sea-pinks and grass blown flat, lichen, pools, a cairn,
    // gulls, an old boat, stakes, a pot) and rocks out in the sea. Nothing on the road, nothing near
    // the trio's ground on the first rock (x 11-14, rows 9-11).
    { sprite: 'il_cairn', x: 4, y: 4, text: 'isle_cairn' },
    { sprite: 'il_thrift', x: 11, y: 4, walkable: true, decor: true },
    { sprite: 'il_grass_tuft', x: 15, y: 5, walkable: true, decor: true },
    { sprite: 'il_lichen', x: 8, y: 6, flat: true, walkable: true },
    { sprite: 'il_grass_tuft_b', x: 2, y: 6, walkable: true, decor: true },
    { sprite: 'il_rowboat_half', x: 4, y: 12, text: 'isle_rowboat_half' },
    { sprite: 'il_grass_tuft', x: 2, y: 10, walkable: true, decor: true },
    { sprite: 'il_thrift', x: 6, y: 11, walkable: true, decor: true },
    { sprite: 'il_gull_rock', x: 31, y: 3, text: 'isle_gull_rock' },
    { sprite: 'il_thrift', x: 28, y: 2, walkable: true, decor: true },
    { sprite: 'il_grass_tuft_b', x: 33, y: 5, walkable: true, decor: true },
    { sprite: 'il_grass_tuft', x: 25, y: 4, walkable: true, decor: true },
    { sprite: 'il_gull', x: 26, y: 5, walkable: true, decor: true },
    { sprite: 'il_tidepool', x: 30, y: 12, flat: true, walkable: true },
    { sprite: 'il_stakes_rope', x: 25, y: 13, text: 'isle_stakes' },
    { sprite: 'il_pot_broken', x: 31, y: 14, text: 'isle_pot_broken' },
    { sprite: 'il_thrift', x: 29, y: 15, walkable: true, decor: true },
    { sprite: 'il_grass_tuft', x: 32, y: 10, walkable: true, decor: true },
    { sprite: 'il_grass_tuft', x: 42, y: 5, walkable: true, decor: true },
    { sprite: 'il_thrift', x: 45, y: 5, walkable: true, decor: true },
    { sprite: 'il_cairn', x: 43, y: 11, text: 'isle_cairn' },
    { sprite: 'il_thrift', x: 44, y: 13, walkable: true, decor: true },
    { sprite: 'il_lichen', x: 41, y: 10, flat: true, walkable: true },
    { sprite: 'il_rocks', x: 22, y: 10, text: 'isle_rocks' },
    { sprite: 'il_rocks', x: 34, y: 10, text: 'isle_rocks' },
    { sprite: 'il_rocks', x: 20, y: 6, text: 'isle_rocks' },
    { sprite: 'il_rocks', x: 35, y: 6, text: 'isle_rocks' },
    { sprite: 'il_lichen', x: 10, y: 10, flat: true, walkable: true },
    { sprite: 'il_grass_tuft_b', x: 15, y: 11, walkable: true, decor: true },
    { sprite: 'il_rocks', x: 8, y: 14, text: 'isle_rocks' },
    { sprite: 'il_rocks_big', x: 38, y: 14, text: 'isle_rocks' },
    { sprite: 'il_gull_rock', x: 20, y: 13, text: 'isle_gull_rock' },
    { sprite: 'il_rocks', x: 36, y: 2, text: 'isle_rocks' },
    { sprite: 'il_rocks_big', x: 5, y: 2, text: 'isle_rocks' },
    ...(LIFE5_PROPS['isles_causeway'] ?? []),
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
