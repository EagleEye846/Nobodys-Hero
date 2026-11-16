// THE NEEDLE (optional): east along the spit from the foot of the Last Light, a sea stack stands up
// out of the worst of the weather, tall and thin, with the stump of an old watch hut on its top. The
// tower's first keepers kept a lookout up there for ships in trouble, and climbed to it on pitons
// they drove into the rock: three pitches with two ledges between, the hardest climb on the coast.
// The storm comes at it in gusts, blowing west (`climbWind`), hard and often: the first and last
// pitches traverse east, straight into it; the middle one comes back west, with it, but its catches
// are long. Nearly every catch wants a full swing. At the top, the keepers' locker: the KEEPER'S
// OILSKIN, for the hero. A purse on the first ledge.
//
//   Pitch 1: stand at the foot (4,34). Pitons (4,31), (9,30), (14,29), (19,28), (23,27); over at (25,25).
//   Pitch 2: stand on the first ledge (24,23). (24,20), (19,19), (14,19), (10,17), (6,16); over at (4,14).
//   Pitch 3: stand on the second ledge (5,12). (5,9), (10,8), (15,7), (20,7), (24,5); over at (22,3).
//   Each of those three clifftop rings ropes you back down the pitch below it: to (25,34), (4,23) and
//   (22,12).
// No tide here (the foot is dry for good). No puzzle but the climb. Ves and Bramble come up with you.
// A storm imp on each ledge, well away from the rings and from where the ropes come down.
// Tile key (see src/overworld/coastTiles.js, reach):
//   #  rock top (solid)   W  cliff (solid)   .  wet rock slabs   ,  turf   ~  heavy green sea (solid)
//   x  barnacle rock (solid)   ;  pools (walk)

import { LIFE5_PROPS } from '../lifePass5.js';

export const REACH_NEEDLE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'reach_needle',
  // The room's name, for the Room Editor.
  name: 'THE NEEDLE',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'reach',
  // "Hopes Above Water" (src/data/music/reachRainTheme.js), as at the tower's foot.
  music: 'reachRain',
  ambience: 'open_sea',
  vesWell: true,
  // The worst of the weather, as at the tower's foot.
  atmosphere: { rain: 1.8, lightning: 1.3, spray: 1.8, foam: 1.4, fog: 0.5 },
  // Once the hero's light has held the sea back (the_light_answers), the storm is gone for good.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.5, fog: 0.15 }, ambience: 'beach', lamplight: { shade: 0.42, tint: '30, 38, 66' } },
  // The stack is drawn as weathered open-air rock (coastTiles.js `crag`).
  crag: [{ x: 0, y: 0, w: 30, h: 34 }],
  // The storm's gusts while you hang from a piton (climbing.js): west (`dir` -1), every 3.5 seconds
  // for 2, harder than the mountain's Gale Face (1.1). Once the storm is over (calmAfter) they still
  // blow: it's a sea stack.
  climbWind: { dir: -1, every: 3.5, lasts: 2, strength: 1.3 },
  skyline: [
    { kind: 'mast', x: 4, y: 37, lean: -1, tall: 40 },
  ],

  tiles: [
    '##############################', // 0
    '##########,,,,,,,,,,,#########', // 1
    '########,,,,,,,,,,,,,,,,######', // 2
    '#######,,,,,,,,,,,,,,,,,..####', // 3
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#', // 4
    '#WWWWWWW##WWWWWWWWWWWWWWWWWWW#', // 5
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#', // 6
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#', // 7
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#', // 8
    '#WWWWWWWWWWWWWWWWWWWWWWWWW##W#', // 9
    '#WWWWWWWWWWW##WWWWWWWWWWWWWWW#', // 10
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#', // 11
    '##,,,,,,,,,,WW,,,,,,,,,,,WW,##', // 12
    '##,,..,,,,,,;,,,,,,,..,,,,,,##', // 13
    '##,,,,,x.,;,,,,xx,,,,,,,,,,,##', // 14
    '#WWWWWWWWWW,,WWWWWWWWW,,WWWWW#', // 15
    '#WWWWWWWWWWWWWWWWWWW##WWWWWWW#', // 16
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#', // 17
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#', // 18
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#', // 19
    '#WWWWWWWW##WWWWWWWWWWWWWWWWWW#', // 20
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#', // 21
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#', // 22
    '##WW,,,,,,,,,,WW,,,,,,,,,,,,##', // 23
    '##,,,.,,,,,,,,,,;,,,,,,,..xx##', // 24
    '##,,,,,,,xx,,,,,,,;,xx,,,,,,##', // 25
    '#WWWWW,,,WWWWWWW,,WWWWWWWWWWW#', // 26
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#', // 27
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#', // 28
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#', // 29
    '#WWWWWWWWWWWWWWWWWWWWWWWW##WW#', // 30
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWW#', // 31
    '#WWWWWWWWWWW##WWWWWWWWWWWWWWW#', // 32
    '#WWWWWWWWWWWWWW...WWWWWWWWWWW#', // 33
    '#...........................x#', // 34
    '.....;.......................#', // 35
    '...........,,...x.;......x...#', // 36
    '#~~.......~~~~.......~~~~~~~~#', // 37
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~#', // 38
    '##############################', // 39
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 35 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Back along the spit to the foot of the Last Light.
    { x: 0, y: 35, w: 1, h: 2, to: 'reach_foot', spawn: { x: 31, y: 21 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/reach.txt',
  props: [
    // Pitch 1, east into the wind (the first straight above the foot at 4,34).
    { sprite: 'swing_ring', x: 4, y: 31 },
    { sprite: 'swing_ring', x: 9, y: 30 },
    { sprite: 'swing_ring', x: 14, y: 29 },
    { sprite: 'swing_ring', x: 19, y: 28 },
    { sprite: 'swing_ring', x: 23, y: 27 },
    { sprite: 'grapple_ring', x: 25, y: 25, grapple: true },
    // Pitch 2, back west with the wind (the first straight above the ledge at 24,23).
    { sprite: 'swing_ring', x: 24, y: 20 },
    { sprite: 'swing_ring', x: 19, y: 19 },
    { sprite: 'swing_ring', x: 14, y: 19 },
    { sprite: 'swing_ring', x: 10, y: 17 },
    { sprite: 'swing_ring', x: 6, y: 16 },
    { sprite: 'grapple_ring', x: 4, y: 14, grapple: true },
    // Pitch 3, east into the wind again (the first straight above the ledge at 5,12).
    { sprite: 'swing_ring', x: 5, y: 9 },
    { sprite: 'swing_ring', x: 10, y: 8 },
    { sprite: 'swing_ring', x: 15, y: 7 },
    { sprite: 'swing_ring', x: 20, y: 7 },
    { sprite: 'swing_ring', x: 24, y: 5 },
    { sprite: 'grapple_ring', x: 22, y: 3, grapple: true },
    // The foot: a board, an old mooring post, weed.
    { sprite: 'sign', x: 2, y: 34, text: 'needle_sign' },
    { sprite: 'c5_chain_bollard', x: 8, y: 36, text: 'reach_bollard' },
    { sprite: 'c5_seaweed_heap', x: 15, y: 36, text: 'reach_weed' },
    { sprite: 'il_rocks', x: 22, y: 36, text: 'reach_rocks' },
    { sprite: 'il_lichen', x: 12, y: 35, flat: true, walkable: true },
    { sprite: 'c5_wrack_line', x: 18, y: 37, flat: true, walkable: true },
    // The first ledge: a purse, thrift.
    { sprite: 'gold_pouch', x: 3, y: 25, text: 'needle_pouch', gold: 200, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'il_thrift', x: 12, y: 24, walkable: true, decor: true },
    { sprite: 'il_lichen', x: 20, y: 25, flat: true, walkable: true },
    // The second ledge: a cairn the keepers left, half way.
    { sprite: 'il_cairn', x: 26, y: 13, text: 'needle_cairn' },
    { sprite: 'il_grass_tuft', x: 9, y: 14, walkable: true, decor: true },
    // The top: the watch hut's stump, its cold lamp, the keepers' locker.
    { sprite: 'il_wall_tumble', x: 11, y: 2, text: 'needle_hut' },
    { sprite: 'c5_lantern_post_unlit', x: 18, y: 2, text: 'needle_lamp' },
    { sprite: 'c5_chest', x: 15, y: 1, text: 'needle_locker', gives: 'keepers_oilskin', react: true, taken: { sprite: 'c5_chest_open', text: 'needle_locker_empty' } },
    { sprite: 'c5_chest', x: 12, y: 1, text: 'needle_tin', gives: 'keepers_hatchet', react: true, taken: { sprite: 'c5_chest_open', text: 'needle_tin_empty' } },
    { sprite: 'il_gull', x: 8, y: 3, walkable: true, decor: true },
    { sprite: 'il_thrift', x: 20, y: 3, walkable: true, decor: true },
    ...(LIFE5_PROPS['reach_needle'] ?? []),
  ],
  tileTexts: { '#': 'needle_rock', W: 'needle_face', '~': 'reach_sea', x: 'reach_barnacles' },

  // A storm imp on each ledge, in the middle, away from the rings, the ledges' climbs and the
  // ropes' landings (ledge 1: 24,23 and 25,25 and 4,23; ledge 2: 5,12 and 4,14 and 22,12).
  npcs: [
    { enemy: 'storm_imp', x: 13, y: 24, patrol: [11, 16], behaviour: 'wander' },
    { enemy: 'storm_imp', x: 14, y: 13, patrol: [12, 17], behaviour: 'wander' },
  ],
};
