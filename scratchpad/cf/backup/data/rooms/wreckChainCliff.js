// THE CHAIN CLIFF (optional): off the east end of the Gate's shingle, round a corner of black rock,
// the back cliff of the yard. When the breakers were still working the Wreck Yard they winched the
// hulks in off the sea with chains run up this cliff, through big ring-bolts leaded into the rock.
// The chains are long gone; the bolts' eyes are still there, rusted but sound, all the way up to the
// old winch ledge at the top. Two pitches with a ledge between, in a wind that comes in gusts off
// the sea (`climbWind`, blowing east): the first pitch traverses east, with it; the second traverses
// back west, into it. Every catch is a good swing's worth (about four tiles), not a full one.
// At the top, the breakers' locker: a FIGGY DUFF (a full mend) left in its tin. A purse on the ledge.
//
//   Pitch 1: stand at the foot (4,21). Rings (4,18), (8,17), (12,16), (16,15); over at (18,13).
//   Pitch 2: stand on the ledge (19,11). Rings (19,8), (15,7), (11,6), (8,5); over at (10,3).
//   Each of those two clifftop rings ropes you back down (to (18,21) and (10,11)).
// No tide here (the shingle is dry for good). No puzzle but the climb. Ves and Bramble come up
// with you. A net wraith hangs about the shingle well east of the foot; on the ledge, a limpet
// knight pretends to be a rock in the west corner, away from both rings.
// Tile key (see src/overworld/coastTiles.js, wreck, painted in the `wreckrock` look):
//   #  cliff top (solid)   W  cliff (solid)   q  shingle   ,  sea-pink turf   ~  green-black water (solid)
//   ;  rock pool (walk)   x  barnacled rock (solid)

export const WRECK_CHAIN_CLIFF = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'wreck_chain_cliff',
  // The room's name, for the Room Editor.
  name: 'THE CHAIN CLIFF',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'wreck',
  // Bare rock, not the yard's hull plate (coastTiles.js `wreckrock`).
  tileLook: 'wreckrock',
  // All of it weathered open-air rock (coastTiles.js `crag`).
  crag: [{ x: 0, y: 0, w: 30, h: 21 }],
  // "Fog Bell" (src/data/music/wreckTheme.js).
  music: 'wreck',
  ambience: 'wreck_yard',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.4, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_wreck_yard', lamplight: { shade: 0.24, tint: '34, 44, 68' }, skyline: true },
  // Once the Fair Return has sailed (crew_go_free), her fog has gone with her, as at the Gate.
  fogLiftAfter: { scene: 'crew_go_free', fog: 0.25 },
  vesWell: true,
  // Gusts off the sea while you hang from a ring (climbing.js): blowing east (`dir` 1), every
  // 5 seconds for 1.4, a bit gentler than the mountain's Gale Face (1.1).
  climbWind: { dir: 1, every: 5, lasts: 1.4, strength: 0.8 },

  tiles: [
    '##############################', // 0
    '###########,,,,,,,,,##########', // 1
    '#########,,,,,,,,,,,,,########', // 2
    '########x,,,,,,,,,,,,,,#######', // 3
    '##WWWWWWWWWWWWWWWWWWWWW#######', // 4
    '##WWWWWWWWWWWWWWWWWWW#########', // 5
    '##WWWWWWWWWWWWWWWWWWWWW#######', // 6
    '##WWWW##WWWWWWWWWWWWWWW#######', // 7
    '##WWWWWWWWWWWWWWWWWWWWW#######', // 8
    '##WWWWWWWWWWWW#WWWWWWWW#######', // 9
    '##WWWWWWWWWWWWW#WWWWWWW#######', // 10
    '##WWW,,,,,,,WW,,,,,,,,,#######', // 11
    '#,,,,,,;,,,,,,,,,,,,,x,,######', // 12
    '#,xx,,,,,,,,x,,,,,,,,,,..#####', // 13
    '#W,,WWW,,,WWWWWWWWWWW,,WWW####', // 14
    '#WWWWWWWWWWWWWWWWWWWWWWWWW####', // 15
    '#WWWWWWWWWWWWWWWWWWWWWWW#W####', // 16
    '#WW#WWWWWWWWWWWWWWWWWWWWWWW###', // 17
    '#WW#WWWWWWWWWWWWWWWW##WWWWW###', // 18
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWW##', // 19
    '#WWWWWWWWWWWW...WWWWWWWWWWWW##', // 20
    'qqqqqqqqqqqqqxqqqqqqqqqqqqqqx#', // 21
    'qqqqqq;qqqqqqqqqqqqqqqqq;qxqq#', // 22
    '#qq;;~~~qqqqqq;;~~~~~~~qqqq~~#', // 23
    '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~#', // 24
    '##############################', // 25
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 2, y: 21 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Back round the corner to the Gate's shingle.
    { x: 0, y: 21, w: 1, h: 2, to: 'wreck_gate', spawn: { x: 37, y: 13 } },
  ],

  // Stepping onto these tiles plays a cutscene (a file in src/data/scenes/).
  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/wreck.txt',
  props: [
    // Pitch 1: the breakers' ring-bolts, east up the lower cliff (the first straight above the foot, 4,21).
    { sprite: 'swing_ring', x: 4, y: 18 },
    { sprite: 'swing_ring', x: 8, y: 17 },
    { sprite: 'swing_ring', x: 12, y: 16 },
    { sprite: 'swing_ring', x: 16, y: 15 },
    { sprite: 'grapple_ring', x: 18, y: 13, grapple: true },
    // Pitch 2: back west up the upper cliff (the first straight above the ledge at 19,11).
    { sprite: 'swing_ring', x: 19, y: 8 },
    { sprite: 'swing_ring', x: 15, y: 7 },
    { sprite: 'swing_ring', x: 11, y: 6 },
    { sprite: 'swing_ring', x: 8, y: 5 },
    { sprite: 'grapple_ring', x: 10, y: 3, grapple: true },
    // The foot: the yard master's board, the end of a chain, rust.
    { sprite: 'sign', x: 2, y: 22, text: 'chain_sign' },
    { sprite: 'wy_chain_pile', x: 7, y: 22, text: 'chain_pile' },
    { sprite: 'wy_timber_sunk', x: 12, y: 23, flat: true, walkable: true },
    { sprite: 'c5_rust_bloom', x: 9, y: 21, flat: true, walkable: true },
    { sprite: 'wy_weed_fringe', x: 20, y: 23, flat: true, walkable: true },
    { sprite: 'c5_crab_trail', x: 16, y: 22, flat: true, walkable: true },
    // The ledge: a purse, weed, gull marks.
    { sprite: 'gold_pouch', x: 22, y: 13, text: 'chain_pouch', gold: 120, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'wy_weed_mat', x: 9, y: 12, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 14, y: 12, flat: true, walkable: true },
    { sprite: 'c5_rocks_weedy', x: 2, y: 13, text: 'rock_stones' },
    // The winch ledge at the top: the breakers' bollard, their locker, a cold lantern.
    { sprite: 'c5_chain_bollard', x: 13, y: 2, text: 'chain_bollard' },
    { sprite: 'c5_chest', x: 17, y: 2, text: 'chain_locker', gives: 'figgy_duff', react: true, taken: { sprite: 'c5_chest_open', text: 'chain_locker_empty' } },
    { sprite: 'c5_lantern_post_unlit', x: 20, y: 3, text: 'chain_lantern' },
    { sprite: 'wy_weed_mat_b', x: 15, y: 3, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 11, y: 2, flat: true, walkable: true },
    // LIFE-PASS-BEGIN (builder 3, 2026-11-14): rock-pool life, shells, kelp, the odds the sea left. Everything here is walkable, so nothing is ever in anyone's way.
    { sprite: 'gold_pouch', x: 24, y: 13, text: 'sl_pouch_chain', gold: 45, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    { sprite: 'shore_boot', x: 22, y: 11, text: 'sl_boot', walkable: true },
    { sprite: 'c5_planks_scatter', x: 22, y: 3, text: 'sl_plank', flat: true, walkable: true },
    { sprite: 'c5_lantern_fallen', x: 9, y: 14, text: 'sl_lantern', flat: true, walkable: true },
    { sprite: 'c5_rope_coil', x: 10, y: 22, text: 'sl_rope', walkable: true },
    { sprite: 'c5_boat_upturned', x: 6, y: 11, text: 'sl_dinghy', walkable: true },
    { sprite: 'shore_rivets', x: 14, y: 20, text: 'sl_rivets', walkable: true },
    { sprite: 'shore_fishbones', x: 14, y: 23, text: 'sl_bones', flat: true, walkable: true },
    { sprite: 'c5_drift_log', x: 6, y: 13, text: 'sl_log', flat: true, walkable: true },
    { sprite: 'shore_chalk_arrow', x: 13, y: 13, text: 'sl_chalk_arrow', walkable: true },
    { sprite: 'wy_plank_slick_b', x: 16, y: 24, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat_b', x: 28, y: 24, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat_b', x: 25, y: 24, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat', x: 2, y: 24, flat: true, walkable: true, decor: true },
    { sprite: 'wy_plank_slick_b', x: 10, y: 24, flat: true, walkable: true, decor: true },
    { sprite: 'wy_weed_mat', x: 6, y: 24, flat: true, walkable: true, decor: true },
    // LIFE-PASS-END
  ],
  tileTexts: { '#': 'gate_edge', W: 'chain_cliff', '~': 'rock_water', x: 'hull_barnacles', ';': 'point_pool' },

  // A net wraith on the shingle, well east of the foot (4,21) and the rope-down spot (18,21) is at
  // its east end; a limpet knight playing at being a rock in the ledge's west corner.
  npcs: [
    { enemy: 'net_wraith', x: 24, y: 22, patrol: [23, 27], behaviour: 'patrol' },
    { enemy: 'limpet_knight', x: 4, y: 12, patrol: [4, 4], behaviour: 'disguise', look: 'weedy_rock', reach: 2.5 },
  ],
};
