// THE SLIP: the far side of the yard, a cove under the cliff where the main yard of the
// mast comes to rest. An old stone boat-slip, planked over, runs down the shingle into the
// water, and Haddock is there with the Bother, as he said he'd be. A save crystal. Puzzle-
// free and no monsters (a save room). The way home: walk down to the end of the slip
// (13..16, row 13) and Haddock rows you back to Saltcombe (wreck_slip_home, any time).
// The way back into the yard is the door you came in by, along the yard to the mast.
// Tile key (see src/overworld/coastTiles.js, wreck):
//   #  cliff top (solid)   W  cliff (solid)   q  shingle   ,  turf   o  the slip's planks
//   ~  green-black water (solid)   x  barnacles   O  crate   F  net heap   J  stump

export const WRECK_SLIP = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wreck_slip',
  // The room's name, for the Room Editor.
  name: 'THE SLIP',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wreck',
  // "Fog Bell" (src/data/music/wreckTheme.js).
  music: 'wreck',
  ambience: 'wreck_yard',
  vesWell: true,
  lastLight: { x: 24, y: 15 },
  skyline: [
    { kind: 'hull', x: 6, y: 15, lean: -1 },
    { kind: 'mast', x: 9, y: 14, lean: 1, tall: 52 },
  ],

  tiles: [
    '################################',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#,,,,,,,,xx,,,,,,,,,,,,,OO,,,,,#',
    '#q,,,,,qqqqq,,,,,,qqq,,,,,,,qqq#',
    'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq#',
    '#qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq#',
    '#qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq#',
    '#qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq#',
    '#qqqqFqqqqqqqooooqqqqqqqqqqqqqq#',
    '#~~qqqqqqqqqqooooqqqqqJqqqqqq~~#',
    '#~~~qqqqqqqqqooooqqqqqqqqqq~~~~#',
    '#~~~~~~~~~~~~oooo~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~oooo~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~oooo~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#',
    '################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 4 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Back along the yard to the fighting top of the mast.
    { x: 0, y: 4, w: 1, h: 1, to: 'wreck_mast', spawn: { x: 37, y: 3 } },
  ],

  // The end of the slip: home with Haddock (any time).
  cutscenes: [
    { x: 13, y: 13, w: 4, h: 1, scene: 'wreck_slip_home' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wreck.txt',
  props: [
    { sprite: 'savepoint', x: 6, y: 5, save: true },
    // Haddock on the slip (footprint 2: 15 and 16; the way past him is x 13-14), and the Bother.
    { sprite: 'cf_haddock', x: 15, y: 10, npc: 'haddock_wreck', animation: 'cf_haddock', speed: 0.5 },
    { sprite: 'cf_bother', x: 17, y: 13, text: 'slip_bother', animation: 'cf_bother', speed: 0.5 },
    { sprite: 'sign', x: 11, y: 7, text: 'slip_sign' },
    { sprite: 'c5_net_frame', x: 7, y: 7, text: 'slip_nets' },
    { sprite: 'c5_lobster_pots', x: 20, y: 7, text: 'hull_pots' },
    { sprite: 'c5_tattered_sail', x: 26, y: 8, text: 'gate_sail', animation: 'c5_tattered_sail', speed: 0.4 },
    { sprite: 'c5_anchor', x: 3, y: 8, text: 'gate_anchor' },
    { sprite: 'c5_snapped_mast', x: 24, y: 14, text: 'gate_mast' },
    { sprite: 'c5_chain_bollard', x: 12, y: 10, text: 'slip_bollard' },
    { sprite: 'gold_pouch', x: 28, y: 5, text: 'slip_pouch', gold: 90, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
  ],
  tileTexts: { '#': 'gate_edge', W: 'slip_cliff', '~': 'gate_water', o: 'slip_planks', x: 'hull_barnacles', O: 'hull_cargo', F: 'hull_net', J: 'fog_stump' },

  // None: a save room.
  npcs: [
  ],
};
