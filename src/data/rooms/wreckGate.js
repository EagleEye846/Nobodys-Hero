// THE GATE: the first of the Wreck Yard, where Haddock's boat puts in. A rotten little
// jetty on the west, a spit of black shingle, then the plank bridge: a long, railed
// gangway laid across the channel between two leaning hulks, the only way into the
// yard. Snapped masts stand out of the green water all round, sails hanging off them
// in rags, and the Last Light is on the skyline. Puzzle-free, and no monsters (the
// first room of an area): a place to stand in the storm and look at it.
//
// Arriving by the Bother (to_the_wreck_yard, from Saltcombe) lands you on the jetty at
// (9,10), which is the trigger of the ride itself (wreck_crossing, once). Later trips
// arrive on the same spot and nothing plays. The way home is at the far side, the slip.
// Tile key (see src/overworld/coastTiles.js, wreck):
//   #  hull top (solid)   ~  green-black water (solid)   q  shingle   o  jetty planks
//   g  bridge (walk)   f  rail (solid)   ,  turf

export const WRECK_GATE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wreck_gate',
  // The room's name, for the Room Editor.
  name: 'THE GATE',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wreck',
  // "Fog Bell" (src/data/music/wreckTheme.js).
  music: 'wreck',
  ambience: 'wreck_yard',
  vesWell: true,
  // The Last Light's foot, on the skyline (atmosphere.js: `lastLight`).
  lastLight: { x: 27, y: 4 },
  // Big wrecks out in the channel, black against the green.
  skyline: [
    { kind: 'hull', x: 5, y: 4, lean: -1 },
    { kind: 'mast', x: 21, y: 5, lean: 1, tall: 60 },
    { kind: 'mast', x: 14, y: 15, lean: -1, tall: 50 },
    { kind: 'hull', x: 26, y: 15, lean: 1 },
  ],

  tiles: [
    '########################################',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~qqqqq#',
    '#~~~~~~~~~~~~qqqq~~~~~~~~~~~~~~qqqqqqqq#',
    '#~~~~~~~~~~qqqqqqq~~~~~~~~~~~~qqqqqqqqq#',
    '#~~~~~~~~ooqqqqqqqfffffffffffffqqqqqqqq#',
    '~~~~~~~~~ooqqqqqqqgggggggggggggqqqqqqqqq',
    '~~~~~~~~~ooqqqqqqqgggggggggggggqqqqqqqqq',
    '#~~~~~~~~ooqqqqqqqfffffffffffffqqqqqqqq#',
    '#~~~~~~~~~~qqqqqqq~~~~~~~~~~~~~qqqqqqq,#',
    '#~~~~~~~~~~~qqqqq~~~~~~~~~~~~~~~qqqqq,,#',
    '#~~~~~~~~~~~~~qq~~~~~~~~~~~~~~~~~qqq,,,#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~,,,#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '########################################',
  ],

  // Where the player starts, in tile coordinates: the jetty.
  playerStart: { x: 9, y: 10 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 39, y: 9, w: 1, h: 2, to: 'wreck_hull', spawn: { x: 2, y: 14 } },
  ],

  // The jetty: arriving by boat the first time plays the ride (wreck_crossing).
  cutscenes: [
    { x: 9, y: 8, w: 2, h: 4, scene: 'wreck_crossing' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wreck.txt',
  props: [
    // The jetty's mooring post and the gangway's two chained bollards (the chains run along the rails).
    { sprite: 'c5_chain_bollard', x: 10, y: 7, text: 'gate_jetty_post' },
    { sprite: 'sign', x: 16, y: 8, text: 'gate_sign' },
    { sprite: 'c5_chain_bollard', x: 17, y: 8, text: 'gate_bollard' },
    { sprite: 'c5_chain_bollard', x: 17, y: 11, text: 'gate_bollard' },
    { sprite: 'c5_chain_bollard', x: 31, y: 8, text: 'gate_bollard' },
    { sprite: 'c5_chain_bollard', x: 31, y: 11, text: 'gate_bollard' },
    // The two hulks the bridge runs between, and the wrecks out in the water.
    { sprite: 'c5_hull_lean_a', x: 19, y: 6, text: 'gate_hulk' },
    { sprite: 'c5_hull_lean_b', x: 25, y: 14, text: 'gate_hulk' },
    { sprite: 'c5_snapped_mast', x: 3, y: 5, text: 'gate_mast' },
    { sprite: 'c5_snapped_mast', x: 34, y: 15, text: 'gate_mast' },
    { sprite: 'c5_ship_ribs', x: 3, y: 14, text: 'gate_ribs' },
    // On the spit: a sail on its post and spar, a flag, a figurehead, nets.
    { sprite: 'c5_tattered_sail', x: 12, y: 7, text: 'gate_sail', animation: 'c5_tattered_sail', speed: 0.4 },
    { sprite: 'c5_tattered_flag', x: 15, y: 12, text: 'gate_flag', animation: 'c5_tattered_flag', speed: 0.35 },
    { sprite: 'c5_figurehead', x: 36, y: 7, text: 'gate_figurehead' },
    { sprite: 'c5_anchor', x: 33, y: 13, text: 'gate_anchor' },
    { sprite: 'c5_crate', x: 13, y: 13, text: 'gate_crate' },
    { sprite: 'gold_pouch', x: 37, y: 14, text: 'gate_pouch', gold: 80, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'gate_edge', '~': 'gate_water', f: 'gate_rail', g: 'gate_bridge' },

  // None: the first room of an area (and the boat ride plays on the jetty).
  npcs: [
  ],
};
