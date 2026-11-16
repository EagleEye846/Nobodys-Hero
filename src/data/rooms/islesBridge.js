// THE ROPE BRIDGE: two of the isles with a gully of sea between them, and a long rope bridge
// slung across it on floats. The tide sets its height. At HIGH tide the water lifts the floats
// and the bridge lies level from isle to isle: walk over. At LOW tide the water drains out of the
// gully, the bridge sags down onto the bed, and its middle hangs in the deep channel that the
// sea never leaves (x 19 to 21): you can't cross, but you can climb down onto the gully bed on
// either side. Down there on the west bed, in the south cliff, is a cave mouth only the low tide
// shows (secret_isles_cave); on the east bed, a purse. The tide runs on a clock (20 s each way,
// 3 s warning; a dial on each isle). Nobody drowns: the water waits for you, then lifts you up
// onto your isle.
// (At high tide two slabs of the cliff's foot, x 17-18 row 16, stand clear of the water: the ledge the cave mouth
// opens onto, and where you step out of it.)
// Tile key (see src/overworld/coastTiles.js, isles):
//   #  rock top (solid)   W  rock face (solid)   ,  wind turf   .  rock slabs   :  path
//   ~  the sea (solid)   g  the bridge, afloat   o  the bridge, lying on the bed (low tide)
//   q  the gully bed's shingle (low tide)   ;  rock pools (walk)   x  barnacle rock (solid)

import { LIFE5_PROPS } from '../lifePass5.js';

export const ISLES_BRIDGE = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'isles_bridge',
  // The room's name, for the Room Editor.
  name: 'THE ROPE BRIDGE',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'isles',
  music: 'isles',
  ambience: 'open_sea',
  // After the chapter (the_light_answers) the storm is over, as at the tower's foot: no rain or
  // lightning, the sea lying down, and the grey-blue light of a quiet sea in place of the storm's green.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.5, fog: 0.15 }, ambience: 'calm_sea', lamplight: { shade: 0.32, tint: '30, 40, 64' } },
  vesWell: true,

  // The HIGH-tide map.

  tiles: [
    '########################################',
    '#WWWWWW##W~~~x~~~~~~~~~~~~x~~~WWWWWW##W#',
    '#WWW,,,WWW~~~~~~~~~~~~~~~x~~~~W,,,WWWWW#',
    '#W,,..,WW,.~~~~~~~~~~~~~~~~~~.,,,,,,WWx#',
    '#,,xx,,,,,~~~~~~~~~~~~~~~~~~..,;.x,,,,,#',
    '#,;,,,;;,,..~~~~~~~~~~~~~~~~~~,,...,,,.#',
    '#,,,,,,;,,;.~~~~~~~~~~~~~~~~~;~,,,,,..,#',
    '#,,,,,,,,,.~~~~~~~~~~~~~~~~~~.,,,,,,,,,#',
    '#,,,,,,,,,.~~~~~~~~~~~~~~~~~~.,,,,,,,,,#',
    ':::::::::::gggggggggggggggggg:::::::::::',
    ':::::::::::gggggggggggggggggg:::::::::::',
    '#,,...,,,,.~~~~~~~~~~~~~~~~~~.,,,,,,,,,#',
    '#,....,..,..~~~~~~~~~~~~~~~~..,,,,,;;,,#',
    '#,,,,..,,,;~~~~~~~~~~~~~~~~~.;,,,,,..,,#',
    '#,,;,,,x,,~~~~~~~~~~~~~~~~~~~.~,,,,,xx,#',
    '#,,,,x.,x,.~~~~~~~~~~~~~~~~~~~,.,,,,,,,#',
    '#x,,xx,.,x.~~~~~~..~x~~~~~~~~.x,,,,x;,,#',
    '#W,,WW,WWWWWWWWWWWWWWW~~~WWWWWWW,,WW,WW#',
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
      '           q.xqqqq;   qqqq;q.           ',
      '           .qqqqq.q   qqqq..q           ',
      '           .q;.qqqq   .qqq..q           ',
      '           ;q.qqq;x   q.q..q;           ',
      '           qq.qqqqq   .qqq;qq           ',
      '           oooooooo~~~ooooooo           ',
      '           oooooooo~~~ooooooo           ',
      '           qqq.qqqq   qqqqqqq           ',
      '           .qqqqqq;   xqqqqq.           ',
      '           ;qqxqqqq   qx;.qq.           ',
      '           .q.qq;x;   ;;.qqqq           ',
      '           qqqqqqxx   xqqqqq.           ',
      '           ;;qqqq.;   ..qq.q;           ',
      '                  q                     ',
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
    // The cave mouth at the foot of the bridge's low point, in the west bed's south cliff: dry at low tide
    // only, and a crack too small to use until the ship's captain is dealt with (the needle's rule).
    // Coming back out you stand in the mouth (18,16).
    { x: 18, y: 17, w: 1, h: 1, to: 'secret_isles_cave', spawn: { x: 6, y: 8 }, after: ['captain_spared', 'captain_beaten'], notYet: 'bridge_cave_not_yet' },
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
    // The cave mouth: a low dark gap in the cliff at the foot of the bridge's sag, half behind a slab and weed.
    // `lowTide`: only there while the tide is out. Before the captain's book it reads as a crack too small to use.
    { sprite: 'il_cave_crack', x: 18, y: 17, text: 'bridge_crack', walkable: true, flat: true, lowTide: true, until: ['captain_spared', 'captain_beaten'] },
    { sprite: 'il_cave_crack', x: 18, y: 17, text: 'bridge_cave', walkable: true, flat: true, lowTide: true, after: ['captain_spared', 'captain_beaten'] },
    // The cue you can see at high water too: shells set out in a tidy row on the west isle's edge, at the top of the
    // way down to the bed, then on the bed itself (low tide) in a line along the south cliff to the mouth.
    { sprite: 'il_shell_row', x: 10, y: 15, text: 'bridge_shells', walkable: true, flat: true },
    { sprite: 'il_shell_row', x: 10, y: 16, text: 'bridge_shells', walkable: true, flat: true },
    { sprite: 'il_shell_row', x: 13, y: 16, text: 'bridge_shells', walkable: true, flat: true, lowTide: true },
    { sprite: 'il_shell_row', x: 15, y: 16, text: 'bridge_shells', walkable: true, flat: true, lowTide: true },
    { sprite: 'il_shell_row', x: 17, y: 16, text: 'bridge_shells', walkable: true, flat: true, lowTide: true },
    // On the beds at low tide: a purse on the east bed (shown only at low tide). Lobster pots and
    // the rest up on the isles.
    { sprite: 'gold_pouch', x: 25, y: 14, text: 'bridge_pouch', lowTide: true, gold: 240, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'c5_lobster_pots', x: 2, y: 13, text: 'bridge_pots' },
    { sprite: 'c5_buoy_red', x: 36, y: 5, text: 'bridge_buoy' },
    { sprite: 'c5_net_frame', x: 32, y: 12, text: 'bridge_net' },
    // Up on the isles (dry at both tides): the tide's leavings along the top of the shore, planks,
    // rain in the hollows, gulls and a crab; a net blown off the frame; and a lantern on a post at
    // each bridge head, for crossing in the dark.
    { sprite: 'c5_wrack_line', x: 1, y: 15, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 37, y: 3, flat: true, walkable: true },
    { sprite: 'c5_lantern_hook', x: 8, y: 6 },
    { sprite: 'c5_lantern_hook', x: 31, y: 6 },
    // The gully's sides, worn ragged: pools bitten into the isles' edges, rocks come down off the
    // cliffs into the water, and the sea's rubbish going round in the deep channel (all on tiles
    // that are water at both tides, so nothing lies on the bed at low water).
    { sprite: 'wy_rocks_fallen', x: 12, y: 2, flat: true, walkable: true },
    { sprite: 'wy_rock_sunk', x: 28, y: 2, flat: true, walkable: true },
    { sprite: 'wy_rock_sunk', x: 29, y: 5, flat: true, walkable: true },
    { sprite: 'wy_plank_slick', x: 20, y: 14, flat: true, walkable: true },
    { sprite: 'c5_seaweed_heap', x: 30, y: 12, flat: true, walkable: true },
    ...(LIFE5_PROPS['isles_bridge'] ?? []),
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
