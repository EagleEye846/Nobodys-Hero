// THE EYE: the middle of the storm. A low, round rock in a flat calm: the wind drops, the rain
// thins to nothing, and overhead the cloud has opened in a ring on a patch of dull silver sky.
// The Last Light stands on the skyline, nearer now. A rest point: a save crystal, no monsters,
// no puzzle. Haddock has pulled the Bother in at the east jetty and sits on a crate beside it.
// Walking past the middle of the rock (column 20) plays his short talk (reach_eye_talk, once;
// a draft for the designer to check). The jetty's end (27,13) rows on to the foot of the Last
// Light; the step off its west side (26,12) rows back to the wreck.
//
// The song starts at its calm section C ("the eye", no drums), see `musicFrom`.
// Tile key (see src/overworld/coastTiles.js, reach):
//   .  wet rock slabs   ,  turf   o  planks   ;  pools (walk)   ~  sea (solid)   x  barnacle rock (solid)

import { LIFE5_PROPS } from '../lifePass5.js';

export const REACH_EYE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'reach_eye',
  // The room's name, for the Room Editor.
  name: 'THE EYE',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'reach',
  // "Hopes Above Water" (src/data/music/reachRainTheme.js), from its calm section (C: the eye).
  music: 'reachRain',
  musicFrom: 'C',
  ambience: 'open_sea',
  // After the chapter (the_light_answers) the storm is over, as at the tower's foot: no rain or
  // lightning, the sea lying down, and the grey-blue light of a quiet sea in place of the storm's green.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.5, fog: 0.15 }, ambience: 'calm_sea', lamplight: { shade: 0.32, tint: '30, 40, 64' } },
  vesWell: true,
  // The calm: next to no rain, no lightning, the sea lying down. (A little rain is kept so the
  // skyline, and the Last Light on it, still draws.)
  atmosphere: { rain: 0.12, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.4 },
  // Lighter than the storm round it: the silver patch overhead.
  lamplight: { shade: 0.34, tint: '30, 60, 52' },
  lastLight: { x: 4, y: 16, scale: 1.65 },
  skyline: [
    { kind: 'mast', x: 29, y: 16, lean: 1, tall: 36 },
  ],

  // The storm's far wrecks stay well out to sea: never in the boat's lane (west of the landing, row 10) or by
  // the jetty, where they used to stand over the Bother and the party. (15 Nov 2026)
  skylineClear: 5,
  skylineKeepOut: [{ x: 0, y: 5, w: 13, h: 9 }],
  tiles: [
    '##################################',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~xx~~~~~~~~~~~~~~~~#',
    '#~~^~~~~~~~~~..,,,.~~~~~~~~~~~x~~#',
    '#~~~x~~~~~~x.,,,,,,,..x~~~~~~~~^~#',
    '#~~~~~~~~~..,,,,,,,,,....~~~~~~~~#',
    '#~~~~~~~......,,,,,.......~~~~~~~#',
    '#~~~~~~~~......,,,........~~~~~~~#',
    '#~~~~~~~~.......,.........~~~~~~~#',
    '#~~~~~~~~oo...............oo~~~~~#',
    '#~~~~~~~~oo...............~o~~~~~#',
    '#~~~~~~~~oo..,,...;;......~o~~~~~#',
    '#~x~~~~~~...,,,,,,;......xoo~~~~~#',
    '#~~~~~~~.~.,,,,,,,,.......~o~~~~~#',
    '#~~~~~~~~~~x,,,,.......x~~~~~~~~~#',
    '#~~~x~~~~~~~..,...~~~~~~~~~~~~^~~#',
    '#~~~~~~~~~~~~~x~~~~~~x~~~~~~~~~~~#',
    '##################################',
  ],

  // Where the player starts, in tile coordinates: the landing.
  playerStart: { x: 9, y: 10 },

  doors: [],

  cutscenes: [
    // The landing: the fourth crossing (the storm opens), once.
    { x: 9, y: 8, w: 2, h: 5, scene: 'reach_crossing_eye' },
    // Across the middle of the rock: Haddock's talk, once.
    { x: 20, y: 4, w: 1, h: 11, scene: 'reach_eye_talk' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/reach.txt',
  props: [
    { sprite: 'savepoint', x: 14, y: 8, save: true },
    // Haddock on a crate by the jetty (footprint 2: x 22 and 23), and the empty Bother (x 28-31).
    { sprite: 'cf_haddock_sit', x: 22, y: 7, playScene: 'reach_boat_eye', notice: 'stays', animation: 'cf_haddock_sit', speed: 0.6, until: 'haddock_gone' },
    { sprite: 'cf_bother', x: 28, y: 11, text: 'eye_bother', playScene: 'reach_boat_eye', notice: 'stays', animation: 'cf_bother', speed: 0.7 },
    { sprite: 'c5_chain_bollard', x: 25, y: 8, text: 'reach_bollard' },
    { sprite: 'c5_driftwood', x: 12, y: 13, text: 'eye_driftwood' },
    { sprite: 'c5_rope_coil', x: 24, y: 12, text: 'eye_coil', walkable: true },
    { sprite: 'c5_seaweed_heap', x: 17, y: 5, text: 'reach_weed' },
    { sprite: 'gold_pouch', x: 16, y: 13, text: 'eye_pouch', gold: 180, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // Second pass: the rock's own look in the calm: a pool, lichen, sea-pinks, a cairn, stakes, gulls
    // on a rock in the sea, more rocks breaking the water. Nothing solid on the landing (x 9-10,
    // rows 8-12), the boat's water west of it, Haddock's talk ground (x 19-23, rows 6-9) or the jetty.
    { sprite: 'il_tidepool', x: 10, y: 6, flat: true, walkable: true },
    { sprite: 'il_cairn', x: 13, y: 4, text: 'reach_cairn' },
    { sprite: 'il_rocks', x: 11, y: 5, text: 'reach_rocks' },
    { sprite: 'il_thrift', x: 15, y: 3, walkable: true, decor: true },
    { sprite: 'il_grass_tuft', x: 17, y: 4, walkable: true, decor: true },
    { sprite: 'il_thrift', x: 12, y: 12, walkable: true, decor: true },
    { sprite: 'il_grass_tuft_b', x: 16, y: 12, walkable: true, decor: true },
    { sprite: 'il_grass_tuft', x: 13, y: 13, walkable: true, decor: true },
    { sprite: 'il_lichen', x: 22, y: 10, flat: true, walkable: true },
    { sprite: 'il_lichen', x: 16, y: 9, flat: true, walkable: true },
    { sprite: 'il_lichen', x: 23, y: 13, flat: true, walkable: true },
    { sprite: 'il_lichen', x: 11, y: 9, flat: true, walkable: true },
    { sprite: 'il_stakes_rope', x: 13, y: 14, text: 'reach_stakes' },
    { sprite: 'il_pot_broken', x: 21, y: 14, text: 'reach_pot' },
    { sprite: 'il_drift_timber', x: 14, y: 15, flat: true, walkable: true },
    { sprite: 'il_gull', x: 24, y: 6, walkable: true, decor: true },
    { sprite: 'il_gull', x: 18, y: 10, walkable: true, decor: true },
    { sprite: 'il_gull_rock', x: 29, y: 4, text: 'reach_gull_rock' },
    { sprite: 'il_rocks_big', x: 5, y: 14, text: 'reach_rocks' },
    { sprite: 'il_rocks', x: 17, y: 16, text: 'reach_rocks' },
    { sprite: 'il_rocks', x: 8, y: 3, text: 'reach_rocks' },
    ...(LIFE5_PROPS['reach_eye'] ?? []),
  ],
  tileTexts: { '~': 'eye_sea', x: 'reach_barnacles', o: 'reach_planks', ';': 'eye_pool', '.': 'eye_rock', ',': 'eye_turf' },

  // None: a rest point, and Haddock's talk plays here.
  npcs: [
  ],
};
