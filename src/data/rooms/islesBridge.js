// THE ROPE BRIDGE: two of the isles with a gully of sea between them, and a long rope bridge
// slung across it on floats. The tide sets its height. At HIGH tide the water lifts the floats
// and the bridge lies level from isle to isle: walk over. At LOW tide the water drains out of the
// gully, the bridge sags down onto the bed, and its middle hangs in the deep channel that the
// sea never leaves (x 19 to 21): you can't cross, but you can climb down onto the gully bed on
// either side. Down there on the west bed, in the south cliff, is a cave mouth only the low tide
// shows (secret_isles_cave); on the east bed, a purse. The tide runs on a clock (20 s each way,
// 3 s warning; a dial on each isle). Nobody drowns: the water waits for you, then lifts you up
// onto your isle.
// Tile key (see src/overworld/coastTiles.js, isles):
//   #  rock top (solid)   W  rock face (solid)   ,  wind turf   .  rock slabs   :  path
//   ~  the sea (solid)   g  the bridge, afloat   o  the bridge, lying on the bed (low tide)
//   q  the gully bed's shingle (low tide)   ;  rock pools (walk)   x  barnacle rock (solid)

export const ISLES_BRIDGE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'isles_bridge',
  // The room's name, for the Room Editor.
  name: 'THE ROPE BRIDGE',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'isles',
  music: 'isles',
  ambience: 'open_sea',
  vesWell: true,

  // The HIGH-tide map.
  tiles: [
    '########################################',
    '#WWWWWWWWWW~~~~~~~~~~~~~~~~~~WWWWWWWWWW#',
    '#WWWWWWWWWW~~~~~~~~~~~~~~~~~~WWWWWWWWWW#',
    '#,,,,,,,,,.~~~~~~~~~~~~~~~~~~.,,,,,,,,x#',
    '#,,xx,,,,,.~~~~~~~~~~~~~~~~~~.,,,x,,,,,#',
    '#,,,,,,,,,.~~~~~~~~~~~~~~~~~~.,,,,,,,,,#',
    '#,,,,,,,,,.~~~~~~~~~~~~~~~~~~.,,,,,,,,,#',
    '#,,,,,,,,,.~~~~~~~~~~~~~~~~~~.,,,,,,,,,#',
    '#,,,,,,,,,.~~~~~~~~~~~~~~~~~~.,,,,,,,,,#',
    ':::::::::::gggggggggggggggggg:::::::::::',
    ':::::::::::gggggggggggggggggg:::::::::::',
    '#,,,,,,,,,.~~~~~~~~~~~~~~~~~~.,,,,,,,,,#',
    '#,,,,,,,,,.~~~~~~~~~~~~~~~~~~.,,,,,,,,,#',
    '#,,,,,,,,,.~~~~~~~~~~~~~~~~~~.,,,,,,,,,#',
    '#,,,,,,x,,.~~~~~~~~~~~~~~~~~~.,,,,,,xx,#',
    '#,,,,,,,x,.~~~~~~~~~~~~~~~~~~.,,,,,,,,,#',
    '#x,,,,,,,,.~~~~~~~~~~~~~~~~~~.,,,,,,,,,#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW#',
    '########################################',
  ],

  // The tide: LOW drains the gully to its bed (a space is "the same as high").
  tide: {
    low: [
      '                                        ',
      '                                        ',
      '                                        ',
      '           qq.qqqqq   qqqqq;q           ',
      '           q.xqqqq;   qqqq;qq           ',
      '           .qqqqq.q   qqqq..q           ',
      '           qq;.qqqq   .qqq..q           ',
      '           ;q.qqq;x   q.q..q;           ',
      '           qq.qqqqq   .qqq;qq           ',
      '           oooooooo~~~ooooooo           ',
      '           oooooooo~~~ooooooo           ',
      '           qqq.qqqq   qqqqqqq           ',
      '           ;qqqqqq;   xqqqqqq           ',
      '           ;qqxqqqq   qx;.qqq           ',
      '           .q.qq;x;   ;;.qqqq           ',
      '           qqqqqqxx   xqqqqq.           ',
      '           ;;qqqq.;   ..qq.q;           ',
      '              qq                        ',
      '                                        ',
      '                                        ',
    ],
    start: 'high',
    clock: { high: 20, low: 20, warn: 3 },
  },

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 9, w: 1, h: 2, to: 'isles_old_lightroom', spawn: { x: 15, y: 8 } },
    { x: 39, y: 9, w: 1, h: 2, to: 'isles_forge', spawn: { x: 2, y: 9 } },
    // The cave mouth on the west bed: dry at low tide only (water at high, so the tide never
    // lifts anyone onto it). Coming back out you climb up onto the west isle's edge (10,16).
    { x: 14, y: 17, w: 2, h: 1, to: 'secret_isles_cave', spawn: { x: 6, y: 8 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/isles.txt',
  props: [
    // The tide's dials, one on each isle (both dry at both tides).
    { sprite: 'tide_dial', x: 5, y: 7, text: 'bridge_dial', tideDial: true },
    { sprite: 'tide_dial', x: 34, y: 7, text: 'bridge_dial', tideDial: true },
    // The bridge's posts at each end.
    { sprite: 'c5_rope_bridge_post', x: 10, y: 8, text: 'bridge_post' },
    { sprite: 'c5_rope_bridge_post', x: 10, y: 11, text: 'bridge_post' },
    { sprite: 'c5_chain_bollard', x: 29, y: 8, text: 'bridge_post_far' },
    { sprite: 'c5_chain_bollard', x: 29, y: 11, text: 'bridge_post_far' },
    { sprite: 'sign', x: 7, y: 8, text: 'bridge_sign' },
    // The cave mouth in the west bed's south cliff (walkable: it's the door).
    // `lowTide`: only there while the tide is out (the high water covers the mouth).
    { sprite: 'c5_sea_cave', x: 14, y: 17, text: 'bridge_cave', walkable: true, lowTide: true },
    // On the beds at low tide: a purse on the east bed (shown only at low tide). Lobster pots and
    // the rest up on the isles.
    { sprite: 'gold_pouch', x: 25, y: 14, text: 'bridge_pouch', lowTide: true, gold: 240, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_lobster_pots', x: 2, y: 13, text: 'bridge_pots' },
    { sprite: 'c5_buoy_red', x: 36, y: 5, text: 'bridge_buoy' },
    { sprite: 'c5_net_frame', x: 32, y: 12, text: 'bridge_net' },
  ],
  tileTexts: { '#': 'isles_rock', W: 'isles_rock', '~': 'bridge_water', x: 'isles_light_rock', g: 'bridge_planks', o: 'bridge_slack', q: 'bridge_bed', ';': 'bridge_pool' },

  // A kelpie foal in the deep channel north of the bridge (row 4, x 19 to 21: water at both
  // tides), and a pinwheel on the east isle's south end (x 32 to 35, row 14). Neither stands on
  // a tile the tide changes, or near a door, a dial, the bridge's ends or the cave mouth.
  // No cutscenes in this room.
  npcs: [
    { enemy: 'kelpie_foal', x: 20, y: 4, patrol: [19, 21], behaviour: 'patrol' },
    { enemy: 'pinwheel', x: 34, y: 14, patrol: [32, 35], behaviour: 'wander' },
  ],
};
