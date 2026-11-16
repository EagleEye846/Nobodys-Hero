// THE GANNET STACK: between the West Light and the causeway the old lamp road runs out onto a
// shelf of rock under a great stack, and stops. The keepers who tended the little lights carried
// their oil over the top of it; their ladder blew down long ago, and what's left is the iron pitons
// they hammered up the face to hang it from. So the way on is up, in the wind: the gusts here blow
// west (`climbWind`), against you all the way up. Over the top, a short drop on the east side has a
// ring at its edge: one throw down to the shelf where the causeway starts, or one throw back up
// (so the West Light and Orla's forge are never cut off).
//
//   THE CLIMB (main path): stand at the foot (14,18). Pitons (14,15), (18,14), then a long catch
//   east to (23,14) that wants a big swing, into the wind; then (27,13), back west to (25,10), and
//   over at (23,7). (That ring doesn't rope down: its column runs into the sea.)
//   The way back down: the ring at (2,7) ropes you to the foot at (2,18).
//   East edge: the ring (33,7), one throw to or from (33,11).
//   THE KEEPERS' CUPBOARD (optional): a niche high in the west end of the face (3..6, rows 9-10)
//   where the keepers kept a cupboard out of the weather: KEEPERS' TEA. Its own line of pitons
//   starts at the foot's west end (2,18): (2,15), then a full-swing catch east into the wind to
//   (7,13), and back west over the lip of the niche at (5,10). Out of it: one throw from its west
//   end (3,9) up to the ring (2,7), or rope down from (5,10) to the foot. No ring on the top is
//   above the niche, so the only way in is the climb.
// No tide (the shelves are dry for good). No puzzle but the climb. Ves and Bramble come up with you.
// One pinwheel rolls about the top, well clear of every ring.
// Tile key (see src/overworld/coastTiles.js, isles):
//   #  rock top (solid)   W  rock face (solid)   ,  wind turf   .  rock slabs   :  path
//   ~  the sea (solid)   x  barnacle rock (solid)   ;  a pool (walk)

import { LIFE5_PROPS } from '../lifePass5.js';

export const ISLES_GANNET_STACK = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'isles_gannet_stack',
  // The room's name, for the Room Editor.
  name: 'THE GANNET STACK',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'isles',
  music: 'isles',
  ambience: 'open_sea',
  // After the chapter (the_light_answers) the storm is over, as on the causeway.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.5, fog: 0.15 }, ambience: 'calm_sea', lamplight: { shade: 0.32, tint: '30, 40, 64' } },
  vesWell: true,
  // A little more weather out here, as on the causeway.
  atmosphere: { rain: 1.2, spray: 1.3 },
  // The stack is drawn as weathered open-air rock (coastTiles.js `crag`).
  crag: [{ x: 0, y: 8, w: 40, h: 10 }],
  skylineClear: 2,
  // Gusts while you hang from a piton (climbing.js): west (`dir` -1), every 4.5 seconds for 1.5,
  // a little gentler than the mountain's Gale Face (1.1).
  climbWind: { dir: -1, every: 4.5, lasts: 1.5, strength: 0.9 },

  tiles: [
    '########################################', // 0
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#', // 1
    '#~~~~~~~~~~,,,,,,~~~~~~~~~~,,,,,~~~~~~~#', // 2
    '#~~~,,,,,,,,,,,,,,,,,~~~~,,,,,,,,,,,~~~#', // 3
    '#~~,,,,,,,,,,,:::::::::::::::,,,,,,,,~~#', // 4
    '#~,,,,,,,::::::,,,,,,,,,,,,,::::,,,,,,~#', // 5
    '#,,,,,::::,,,,,,,,,,,,,,,,,,,,,::::,,,,#', // 6
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#', // 7
    '#WWWWWWWWW,,,WWWWWWWWWWWWWWWWWWWWWWW,,W#', // 8
    '#WW,.,,WWWWWWWWWWWWWWWWWWWWWWW#WWWWWWWW#', // 9
    '#WW.,,.WWWWWWWWWWWWW##WWWWWWWWWWWWWWWWW#', // 10
    '#WWWWWWWWWWWWWWWWWW#WWWWWWWW..,,,,,,...#', // 11
    '#WWWWWWWWW##WWWWWWWWWWWWWWWW.,,,,,,,,...', // 12
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWW..,,,;,,,...', // 13
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWW.,,,,,,,.x.#', // 14
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWW~.,,,,,,..~#', // 15
    '#WWWWWWWWWWWWWWW##WWWWWWWWWW~~...,...~~#', // 16
    '#WWWWWWWW,,WWWWWWWWWWWWWWWWW~~~~..~~~~~#', // 17
    '::,,,..,,,,,,,..~~~~~~~~~~~~~~~~~~~~~~~#', // 18
    '::,,,,,,.,,,,,,;~~~~~~~~~~~~~~~~~~~~~~~#', // 19
    '#,,,..,,,,,,,;;~~~~~~~~~~~~~~~~~~~~~~~~#', // 20
    '#~,,,,,,,~~;;~~~~~~~~~~~~~~~~~~~~~~~~~~#', // 21
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#', // 22
    '########################################', // 23
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 19 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 18, w: 1, h: 2, to: 'isles_west_light', spawn: { x: 41, y: 11 } },
    // On along the old road: the causeway to Haddock's Light.
    { x: 39, y: 12, w: 1, h: 2, to: 'isles_causeway', spawn: { x: 2, y: 9 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/isles.txt',
  props: [
    // THE CLIMB: the keepers' pitons (the first straight above the foot at 14,18).
    { sprite: 'swing_ring', x: 14, y: 15 },
    { sprite: 'swing_ring', x: 18, y: 14 },
    { sprite: 'swing_ring', x: 23, y: 14 },
    { sprite: 'swing_ring', x: 27, y: 13 },
    { sprite: 'swing_ring', x: 25, y: 10 },
    { sprite: 'grapple_ring', x: 23, y: 7, grapple: true },
    // The way back down to the foot (2,18), and the way out of the keepers' niche (one throw from 3,9).
    { sprite: 'grapple_ring', x: 2, y: 7, grapple: true },
    // The east edge: one throw down to the causeway's shelf (33,11), or back up.
    { sprite: 'grapple_ring', x: 33, y: 7, grapple: true },
    // THE KEEPERS' CUPBOARD (optional): its own line (the first straight above the foot at 2,18).
    { sprite: 'swing_ring', x: 2, y: 15 },
    { sprite: 'swing_ring', x: 7, y: 13 },
    { sprite: 'grapple_ring', x: 5, y: 10, grapple: true },
    { sprite: 'c5_chest', x: 6, y: 9, text: 'stack_cupboard', gives: 'keepers_tea', react: true, taken: { sprite: 'c5_chest_open', text: 'stack_cupboard_empty' } },
    // The west foot: the keepers' board, their ladder, smashed on the rocks.
    { sprite: 'sign', x: 10, y: 19, text: 'stack_sign' },
    { sprite: 'il_drift_timber', x: 12, y: 20, text: 'stack_ladder', flat: true, walkable: true },
    { sprite: 'il_rocks', x: 5, y: 20, text: 'isle_rocks' },
    { sprite: 'il_thrift', x: 3, y: 21, walkable: true, decor: true },
    { sprite: 'il_lichen', x: 3, y: 19, flat: true, walkable: true },
    // The top: a cairn, the old oil store fallen in, oil cans, gulls.
    { sprite: 'il_cairn', x: 6, y: 4, text: 'isle_cairn' },
    { sprite: 'il_wall_tumble', x: 25, y: 4, text: 'stack_store' },
    { sprite: 'il_oil_cans', x: 28, y: 6, text: 'stack_oil' },
    { sprite: 'il_gull_rock', x: 35, y: 3, text: 'isle_gull_rock' },
    { sprite: 'il_gull', x: 13, y: 3, walkable: true, decor: true },
    { sprite: 'il_thrift', x: 9, y: 6, walkable: true, decor: true },
    { sprite: 'il_grass_tuft', x: 20, y: 5, walkable: true, decor: true },
    { sprite: 'il_grass_tuft_b', x: 31, y: 7, walkable: true, decor: true },
    { sprite: 'il_lichen', x: 15, y: 6, flat: true, walkable: true },
    { sprite: 'il_lichen', x: 37, y: 6, flat: true, walkable: true },
    // The causeway's shelf: a lantern on a hook marks where the road goes on, a pool, weed.
    { sprite: 'c5_lantern_hook', x: 37, y: 11 },
    { sprite: 'il_tidepool_small', x: 31, y: 15, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 30, y: 16, flat: true, walkable: true },
    { sprite: 'il_thrift', x: 35, y: 14, walkable: true, decor: true },
    { sprite: 'col_glass_black', x: 36, y: 5, walkable: true, flat: true, gives: 'glass_black', taken: { gone: true } },
    ...(LIFE5_PROPS['isles_gannet_stack'] ?? []),
  ],
  tileTexts: { '#': 'isles_rock', W: 'stack_face', '~': 'causeway_sea', x: 'isles_light_rock' },

  // A pinwheel rolling about the top, well clear of every ring (2, 23 and 33, row 7).
  npcs: [
    { enemy: 'pinwheel', x: 27, y: 4, patrol: [25, 30], behaviour: 'wander' },
  ],
};
