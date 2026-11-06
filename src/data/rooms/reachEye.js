// THE EYE: the middle of the storm. A low, round rock in a flat calm: the wind drops, the rain
// thins to nothing, and overhead the cloud has opened in a ring on a patch of dull silver sky.
// The Last Light stands on the skyline, nearer now. A rest point: a save crystal, no monsters,
// no puzzle. Haddock has pulled the Bother in at the east jetty and sits on a crate beside it.
// Walking past the middle of the rock (column 20) plays his short talk (reach_eye_talk, once;
// a draft for the designer to check). The jetty's end (27,13) rows on to the foot of the Last
// Light; the step off its west side (26,12) rows back to the wreck.
//
// The song starts at its calm section C ("the eye"), see `musicFrom`.
// Tile key (see src/overworld/coastTiles.js, reach):
//   .  wet rock slabs   ,  turf   o  planks   ;  pools (walk)   ~  sea (solid)   x  barnacle rock (solid)

export const REACH_EYE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'reach_eye',
  // The room's name, for the Room Editor.
  name: 'THE EYE',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'reach',
  // "Out Past the Light" (src/data/music/reachTheme.js), from its calm section (C: the eye).
  music: 'reach',
  musicFrom: 'C',
  ambience: 'open_sea',
  vesWell: true,
  // The calm: next to no rain, no lightning, the sea lying down. (A little rain is kept so the
  // skyline, and the Last Light on it, still draws.)
  atmosphere: { rain: 0.12, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.4 },
  // Lighter than the storm round it: the silver patch overhead.
  lamplight: { shade: 0.34, tint: '30, 60, 52' },
  lastLight: { x: 4, y: 16 },
  skyline: [
    { kind: 'mast', x: 29, y: 16, lean: 1, tall: 36 },
  ],

  tiles: [
    '##################################',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~x...,,,,,,,.....x~~~~~~~#',
    '#~~~~~~~~....,,,,,,,......~~~~~~~#',
    '#~~~~~~~~....,,,,,,,......~~~~~~~#',
    '#~~~~~~~~.................~~~~~~~#',
    '#~~~~~~~~.................~~~~~~~#',
    '#~~~~~~~~oo...............oo~~~~~#',
    '#~~~~~~~~oo...............~o~~~~~#',
    '#~~~~~~~~oo.......;;......~o~~~~~#',
    '#~~~~~~~~..,,,,,,.;......xoo~~~~~#',
    '#~~~~~~~~..,,,,,,.........~o~~~~~#',
    '#~~~~~~~~x.,,,,,,........x~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
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
    // The jetty's end: on to the foot of the Last Light. The side step: back to the wreck.
    { x: 27, y: 13, w: 1, h: 1, scene: 'reach_to_foot' },
    { x: 26, y: 12, w: 1, h: 1, scene: 'reach_back_to_wreck' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/reach.txt',
  props: [
    { sprite: 'savepoint', x: 14, y: 8, save: true },
    // Haddock on a crate by the jetty (footprint 2: x 22 and 23), and the empty Bother (x 28-31).
    { sprite: 'cf_haddock_sit', x: 22, y: 7, npc: 'haddock_reach', animation: 'cf_haddock_sit', speed: 0.6 },
    { sprite: 'cf_bother', x: 28, y: 11, text: 'eye_bother', animation: 'cf_bother', speed: 0.7 },
    { sprite: 'c5_chain_bollard', x: 25, y: 8, text: 'reach_bollard' },
    { sprite: 'c5_driftwood', x: 12, y: 13, text: 'eye_driftwood' },
    { sprite: 'c5_rope_coil', x: 24, y: 12, text: 'eye_coil', walkable: true },
    { sprite: 'c5_seaweed_heap', x: 17, y: 5, text: 'reach_weed' },
    { sprite: 'gold_pouch', x: 16, y: 13, text: 'eye_pouch', gold: 180, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '~': 'eye_sea', x: 'reach_barnacles', o: 'reach_planks', ';': 'eye_pool', '.': 'eye_rock', ',': 'eye_turf' },

  // None: a rest point, and Haddock's talk plays here.
  npcs: [
  ],
};
