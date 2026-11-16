// THE QUAY: Saltcombe at last, the first warm light since the storm came in.
// The plank path off the Wrack Shore comes up out of the sea onto a broad
// wet quay with the town's houses along the back of it: the harbour office,
// the Drowned Rat (the inn, a fire going) and a fisher's house. The harbour
// is in front, with stilt houses lit up on the water and the Bother tied at
// the slip (Haddock has gone in out of the rain; after the swimming lesson he takes it round to the lookout). Up the hill, a stair to the
// market.
//
// Lantern 3: Mrs. Tansy, the lamplighter, has just done the last of the quay
// lamps and is very pleased with them. The quay is hers. The lamps up the
// hill stair are lit too; she didn't do those ("the ones up the hill must be
// someone else"). Nobody says more, and nobody goes to look.
//
// Puzzle-free, but for a jump up the fish crates to a gull's stash. No monsters (a town). Rain, and every window gold.
// Tile key (see src/overworld/coastTiles.js, saltcombe):
//   #  wall top (solid)   W  the hill's board wall (solid)   .  quay planks
//   5 6 7  house wall, lit window, tar roof (solid)   8  shut door (solid)
//   D  an open door   :  the hill stair   ,  turf banks   f  rail (solid)
//   ~  the harbour (solid)   X  the cobbled apron along the house fronts

import { quayFloodProps } from '../floodStages.js';

export const SALTCOMBE_QUAY = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'saltcombe_quay',
  // The room's name, for the Room Editor.
  name: 'THE QUAY',
  // The region it's in (src/data/areas.js): the title card, the storm look and the battle background.
  area: 'saltcombe',
  // "Salt and Rope" (src/data/music/saltcombeTheme.js), and the town's rain on the roofs.
  music: 'saltcombe',
  // After chapter 5 (the_light_answers) the town is quiet: "What the Tide Left".
  musicAfter: { scene: 'the_light_answers', song: 'saltcombeAfter' },
  ambience: 'stilt_town',
  // After chapter 5 the storm is over (`calmAfter`, see atmosphere.js): no rain, a washed grey-blue light, quieter sounds.
  calmAfter: { scene: 'the_light_answers', atmosphere: { rain: 0, lightning: 0, spray: 0.2, foam: 0.6, fog: 0.15, drips: 0.4, gulls: 0.6, shimmer: 0.5 }, ambience: 'calm_stilt_town', lamplight: { shade: 0.22, tint: '34, 44, 68' }, skyline: true },
  vesWell: true,
  // Before the Fair Return is found: her crew's song off the water now and then, or her lantern far out (farShip.js).
  farShip: { sing: true, light: { x: 37, y: 19 }, chance: 0.35 },

  // The fish crates in the north-west corner (b and B, drawn as crates): jump from the
  // planks at (3,7) onto the b, then up onto a B. The gull's stash is on top.
  cargo: [{ x: 1, y: 6, w: 2, h: 2 }],


  tiles: [
    '#################################:::####',
    '#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW,:::,WW#',
    '#W7777777WW7777777777WW777777WWW,:::,WW#',
    '#W7777777WW7777777777WW777777WWW,:::,WW#',
    '#W5656565WW5656556565WW565565WWW,:::,WW#',
    '#W555D555WW5555DD5555WW555855WWW,:::,WW#',
    '#BBXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.......#',
    '#Bb.XXXX.....XXXXXX...XXX..............#',
    '#......................................#',
    '#......................................#',
    '#......................................#',
    '#......................................#',
    '#......................................#',
    'fffff..ffffffffffffffffff...ffffffffffff',
    '~~~~f..f~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~f..f~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~f..f~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~f..f~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~f..f~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~f..f~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~f..f~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~f..f~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 5, y: 19 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Down the pier to the boardwalk (the Wrack Shore).
    { x: 5, y: 21, w: 2, h: 1, to: 'wrack_boardwalk', spawn: { x: 23, y: 3 } },
    // The harbour office and the Drowned Rat.
    { x: 5, y: 5, w: 1, h: 1, to: 'saltcombe_harbour_office', spawn: { x: 6, y: 8 } },
    { x: 15, y: 5, w: 2, h: 1, to: 'saltcombe_inn', spawn: { x: 8, y: 12 } },
    // Up the hill stair to the market.
    { x: 33, y: 0, w: 3, h: 1, to: 'saltcombe_market', spawn: { x: 18, y: 22 } },
  ],

  // Mrs. Tansy says her piece when you talk to her (text/npcs/tansy.txt).
  // The Fair Return's last page (optional, secret): holding the other four torn pages of her log, the first step onto the
  // quay's boards plays last_page_ashore (once), and the bottle with the fifth is at the quay steps (26,13) after it.
  cutscenes: [
    { x: 1, y: 7, w: 38, h: 6, scene: 'last_page_ashore', gear: ['log_page_1', 'log_page_2', 'log_page_3', 'log_page_4'] },
    // (2026-11-14) Once the Fair Return has sailed (crew_go_free): two of her crew say goodbye on the quay (crew_home_quay, once),
    // the first step onto its boards from any way in (the office and inn doors put you down on row 6).
    { x: 1, y: 6, w: 38, h: 7, scene: 'crew_home_quay', after: 'fair_return_gone' },
  ],

  // Things you can press Z on. `text` names a section of this room's text file.
  textFile: 'interactions/saltcombe.txt',
  props: [
    // Tansy's quay lamps, all lit, all hers. The last one, with her ladder against it.
    { sprite: 'c5_lantern_post_lit', x: 3, y: 12, text: 'quay_lamp', animation: 'c5_lantern_post_lit', speed: 0.25 },
    { sprite: 'c5_lantern_post_lit', x: 12, y: 12, text: 'quay_lamp', animation: 'c5_lantern_post_lit', speed: 0.27 },
    { sprite: 'c5_lantern_post_lit', x: 20, y: 12, text: 'quay_lamp', animation: 'c5_lantern_post_lit', speed: 0.24 },
    { sprite: 'c5_lantern_post_lit', x: 31, y: 12, text: 'quay_lamp', animation: 'c5_lantern_post_lit', speed: 0.26 },
    { sprite: 'c5_lantern_post_lit', x: 31, y: 7, text: 'quay_lamp_last', animation: 'c5_lantern_post_lit', speed: 0.25 },
    { sprite: 'c5_lamplighter_ladder', x: 30, y: 7, text: 'quay_ladder' },
    { sprite: 'cf_tansy', x: 29, y: 8, npc: 'tansy', animation: 'cf_tansy', speed: 0.45 },
    // Up the hill: lit too. Not hers.
    { sprite: 'c5_lantern_post_lit', x: 32, y: 2, text: 'quay_hill_lamp', animation: 'c5_lantern_post_lit', speed: 0.3 },
    { sprite: 'c5_lantern_post_lit', x: 36, y: 4, text: 'quay_hill_lamp', animation: 'c5_lantern_post_lit', speed: 0.28 },
    // Signs by the doors.
    { sprite: 'sign', x: 7, y: 6, text: 'quay_office_sign' },
    { sprite: 'c5_sign_inn', x: 18, y: 6, text: 'quay_inn_sign' },
    // The quay's clutter.
    { sprite: 'c5_harbour_bell', x: 22, y: 11, text: 'quay_bell', animation: 'c5_harbour_bell', speed: 0.7, sound: 'bell' },
    { sprite: 'c5_barrels', x: 36, y: 7, text: 'quay_barrels' },
    { sprite: 'c5_lobster_pots', x: 9, y: 12, text: 'quay_pots' },
    { sprite: 'c5_hanging_nets', x: 14, y: 12, text: 'quay_nets' },
    { sprite: 'c5_rope_coil', x: 26, y: 10, text: 'quay_rope', walkable: true },
    { sprite: 'c5_anchor', x: 37, y: 11, text: 'quay_anchor' },
    // On top of the fish crates: a gull's stash, with the clerk's APPROVED stamp in it
    // (the side quest "The Clerk's Stamp", text/npcs/harbour_clerk.txt).
    { sprite: 'c5_gull_hoard', x: 1, y: 6, text: 'quay_gull_stash', gives: 'approved_stamp', react: true, taken: { text: 'quay_gull_stash_bare' } },
    // Folk.
    { sprite: 'cf_fisher_a', x: 9, y: 8, text: 'quay_fisher_a', animation: 'cf_fisher_a', speed: 0.5 },
    { sprite: 'cf_fisher_c', x: 24, y: 7, text: 'quay_fisher_c', animation: 'cf_fisher_c', speed: 0.55 },
    { sprite: 'cf_kid_pup', x: 17, y: 10, text: 'quay_pup', animation: 'cf_kid_pup', speed: 0.3 },
    { sprite: 'cf_kid_otter', x: 19, y: 9, text: 'quay_otter', animation: 'cf_kid_otter', speed: 0.32 },
    // The Bother at the slip: Haddock has gone in to the fire.
    { sprite: 'cf_bother_moored', x: 24, y: 15, text: 'quay_bother', animation: 'cf_bother_moored', speed: 0.5, until: 'swimming_lesson' },
    // Out on the water: stilt houses, lit, and the buoys.
    { sprite: 'c5_stilt_house', x: 11, y: 20, text: 'quay_stilt_house' },
    { sprite: 'c5_stilt_house_small', x: 32, y: 19, text: 'quay_stilt_house' },
    { sprite: 'c5_buoy_red', x: 17, y: 16, text: 'quay_buoy' },
    { sprite: 'c5_buoy_yellow', x: 29, y: 18, text: 'quay_buoy' },
    { sprite: 'gold_pouch', x: 2, y: 11, text: 'quay_pouch', gold: 40, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },

    // Storm-battered (2026-11-09): sandbags along the house fronts, the herring crans stacked dry
    // by the fisher's house, and a boat turned over on the quay for good. Off the doors' rows and
    // Tansy's spot, and clear of the cat's sill.
    { sprite: 'c5_sandbags', x: 12, y: 6, text: 'quay_sandbags' },
    { sprite: 'sc_herring_crans', x: 27, y: 6, text: 'quay_crans' },
    { sprite: 'c5_boat_upturned', x: 33, y: 11, text: 'quay_boat_upturned' },
    // The last page of the Fair Return's log, washed up at the steps (after last_page_ashore).
    { sprite: 'gs_log_bottle', x: 26, y: 13, text: 'quay_log_bottle', gives: 'log_page_5', after: 'last_page_ashore', taken: { gone: true } },
    // (2026-11-14) The Fair Return's lookout at Tansy's last lamp, and her ship's boy on the fisher's step, once she has sailed;
    // gone after they've said goodbye (crew_home_quay plays them). The boy leaves the stoat's line coiled on the step.
    { sprite: 'gs_ghost_lookout', x: 27, y: 8, cast: 'home_lookout', animation: 'gs_ghost_lookout', speed: 1.2, walkable: true, after: 'fair_return_gone', until: 'crew_home_quay' },
    { sprite: 'gs_ghost_boy', x: 26, y: 6, cast: 'home_boy', animation: 'gs_ghost_boy', speed: 0.8, walkable: true, after: 'fair_return_gone', until: 'crew_home_quay' },
    { sprite: 'gs_coil', x: 26, y: 6, text: 'quay_ghost_coil', flat: true, walkable: true, after: 'crew_home_quay' },
    { sprite: 'col_glass_frosted', x: 37, y: 12, walkable: true, flat: true, gives: 'glass_frosted', taken: { gone: true } },
    // (life pass 2026-11-14)
    // Townsfolk at their jobs (nobody can stroll here: the goodbye scene's trigger covers the whole quay).
    { sprite: 'st_mender', x: 31, y: 10, npc: 'st_net_mender', animation: 'st_mender', speed: 0.6 },
    { sprite: 'st_sweeper', x: 8, y: 10, npc: 'st_quay_sweeper', animation: 'st_sweeper', speed: 0.45 },
    { sprite: 'st_folk_a', x: 36, y: 9, npc: 'st_quay_gossip_a', animation: 'st_folk_a', speed: 0.8 },
    { sprite: 'st_folk_d', x: 37, y: 9, npc: 'st_quay_gossip_b', animation: 'st_folk_d', speed: 0.9 },
    { sprite: 'cf_kid_otter', x: 24, y: 10, npc: 'st_hop_kid', animation: 'cf_kid_otter', speed: 0.25 },
    // Along the house fronts: a rain barrel, a mouse's door, the day's prices, a cat on a crate, drying fish, a tub of thrift.
    { sprite: 'st_rain_barrel', x: 9, y: 6, text: 'life_q_barrel', animation: 'st_rain_barrel', speed: 0.5 },
    { sprite: 'st_price_board', x: 11, y: 7, text: 'life_q_prices' },
    { sprite: 'st_fish_rack', x: 19, y: 7, text: 'life_q_rack' },
    { sprite: 'st_flower_tub', x: 22, y: 7, text: 'life_q_tub' },
    // The kids' den in the north-west corner: crates and a barrel make a wall, the way in is from the south. A biscuit tin in it.
    { sprite: 'st_tin_box', x: 1, y: 9, text: 'life_q_den_tin', gives: 'candle_cake', react: true, taken: { text: 'life_q_den_tin_after' } },
    // Moored boats out on the water, bobbing.
    { sprite: 'st_dinghy_b', x: 21, y: 17, text: 'life_q_dinghy_b', animation: 'st_dinghy_b', speed: 1.1 },
    // The quay's litter and wear.
    // (2026-11-15) The town floods a little more each time you come back (src/data/floodStages.js).
    ...quayFloodProps(),
  ],
  tileTexts: {
    '~': 'quay_water', W: 'quay_wall', '#': 'quay_wall', f: 'quay_rail',
    5: 'quay_house', 6: 'quay_window', 7: 'quay_roof', 8: 'quay_fisher_door', ',': 'quay_bank',
    b: 'quay_crates', B: 'quay_crates',
  },
  // The sill under the fisher's window, where the inn's grey cat sits out once the storm's gone
  // (drawn in src/data/touches.js): Z on the wall under it strokes the cat, and it blinks back.
  looks: [
    { x: 3, y: 5, text: 'quay_sill', pet: true },
  ],

  // None: a town.
  npcs: [
  ],
};
