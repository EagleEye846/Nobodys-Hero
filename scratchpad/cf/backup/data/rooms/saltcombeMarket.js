// THE MARKET: up the hill stair from the quay, a cobbled square half under
// awnings, loud and steamy and lit. The Cockle Stall (a crab in a paper hat,
// food) is in the middle, with two fish stalls and a lot of opinions. Mrs.
// Wrasse's Chandlery is the house on the left (gear). The Town Hall is the
// big house at the top of the square, up two steps. East, a lane goes out to
// the bathing lagoon. In the top corner, a little hill garden with a bench
// and two lamps, lit (nobody here mentions them).
//
// Puzzle-free. No monsters (a town). A purse under the fish stall.
// Tile key (see src/overworld/coastTiles.js, saltcombe):
//   #  wall top (solid)   W  board walls (solid)   X  cobbles   .  planks
//   5 6 7  house wall, lit window, roof (solid)   D  an open door
//   :  the hall steps and the stair down   ,  the hill garden   I  a post (solid)
//   f  rail (solid)

export const SALTCOMBE_MARKET = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'saltcombe_market',
  // The room's name, for the Room Editor.
  name: 'THE MARKET',
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

  tiles: [
    '####################################',
    '#WWWWWWWWWWW777777777777WWWWWWWWWWW#',
    '#W777777WWWW777777777777WWW,,,,,,,,#',
    '#W777777WWWW777777777777WWW,,,,,,,,#',
    '#W565656WWWW565656656565WWW,,,,,,,,#',
    '#W55D555WWWW55555DD55555WWW,,,,,,,,#',
    '#XXXXXXXXXXXXXXX::::XXXXXXXXXXXXXXX#',
    '#XXXXXXXXXXXXXXX::::XXXXXXXXXXXXXXX#',
    '#XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX#',
    '#XXXXXXXXXIXXXXXXXXXXXXXXIXXXXXXXXX#',
    '#XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    '#XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    '#XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    '#XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX#',
    '#XXXXX..XXXXXXXXXXXXXXXXXXXXXXXXXXX#',
    '#XXXX....XXXXX..XXXXXXXX....XXXXX.X#',
    '#..........XXX......XX........XX...#',
    '#...........X......................#',
    '#..................................#',
    '#..................................#',
    '#..................................#',
    '#..................................#',
    '#fffffffffffffff....fffffffffffffff#',
    '#################:::################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 18, y: 21 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    // Down the hill stair to the quay.
    { x: 17, y: 23, w: 3, h: 1, to: 'saltcombe_quay', spawn: { x: 34, y: 1 } },
    // Mrs. Wrasse's, and the Town Hall.
    { x: 4, y: 5, w: 1, h: 1, to: 'saltcombe_chandlery', spawn: { x: 7, y: 10 } },
    { x: 17, y: 5, w: 2, h: 1, to: 'saltcombe_town_hall', spawn: { x: 10, y: 12 } },
    // East, out to the bathing lagoon.
    { x: 35, y: 10, w: 1, h: 3, to: 'saltcombe_lagoon', spawn: { x: 1, y: 9 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // The Cockle Stall: Z on the stall or on the crab behind it opens the shop.
  textFile: 'interactions/saltcombe.txt',
  props: [
    { sprite: 'cf_cockle_stall', x: 16, y: 13, shop: 'cockle_stall', animation: 'cf_cockle_stall', speed: 0.5 },
    { sprite: 'cf_crab_cockle', x: 16, y: 12, shop: 'cockle_stall', animation: 'cf_crab_cockle', speed: 0.5 },
    { sprite: 'c5_market_stall', x: 5, y: 12, text: 'market_fish_stall' },
    { sprite: 'c5_market_stall', x: 26, y: 12, text: 'market_fish_stall_b' },
    { sprite: 'c5_sign_chandler', x: 6, y: 6, text: 'market_chandler_sign' },
    { sprite: 'c5_sign_fish', x: 9, y: 13, text: 'market_fish_sign' },
    { sprite: 'town_noticeboard', x: 21, y: 6, text: 'market_noticeboard' },
    { sprite: 'sign', x: 33, y: 9, text: 'market_lagoon_sign' },
    // The way out to the lagoon is roped off until the Drowned Rat (haddock_hums), where Haddock
    // arranges the lesson and goes on ahead: so the lesson, and the boat to the Wreck Yard after it,
    // can't be walked past by skipping the inn.
    { sprite: 'sy_rope_post', x: 35, y: 10, text: 'market_lagoon_rope', until: 'haddock_hums' },
    { sprite: 'sy_rope_v', x: 35, y: 11, text: 'market_lagoon_rope', until: 'haddock_hums' },
    { sprite: 'sy_rope_post', x: 35, y: 12, text: 'market_lagoon_rope', until: 'haddock_hums' },
    // Lamps about the square, and two in the hill garden.
    { sprite: 'c5_lantern_post_lit', x: 2, y: 8, text: 'market_lamp', animation: 'c5_lantern_post_lit', speed: 0.26 },
    { sprite: 'c5_lantern_post_lit', x: 13, y: 7, text: 'market_lamp', animation: 'c5_lantern_post_lit', speed: 0.25 },
    { sprite: 'c5_lantern_post_lit', x: 23, y: 7, text: 'market_lamp', animation: 'c5_lantern_post_lit', speed: 0.28 },
    { sprite: 'c5_lantern_post_lit', x: 28, y: 3, text: 'market_garden_lamp', animation: 'c5_lantern_post_lit', speed: 0.3 },
    { sprite: 'c5_lantern_post_lit', x: 33, y: 3, text: 'market_garden_lamp', animation: 'c5_lantern_post_lit', speed: 0.27 },
    { sprite: 'bench', x: 30, y: 4, text: 'market_bench' },
    // Clutter.
    { sprite: 'c5_crates_stack', x: 2, y: 15, text: 'market_crates' },
    { sprite: 'c5_barrels', x: 32, y: 15, text: 'market_barrels' },
    { sprite: 'c5_lobster_pots', x: 22, y: 17, text: 'market_pots' },
    { sprite: 'c5_net_frame', x: 9, y: 18, text: 'market_net' },
    { sprite: 'c5_buoys_pile', x: 30, y: 20, text: 'market_buoys' },
    // Folk.
    { sprite: 'cf_fisher_b', x: 12, y: 15, text: 'market_fisher_b', animation: 'cf_fisher_b', speed: 0.5 },
    { sprite: 'cf_fisher_d', x: 29, y: 14, text: 'market_fisher_d', animation: 'cf_fisher_d', speed: 0.6 },
    { sprite: 'cf_fisher_a', x: 4, y: 17, text: 'market_fisher_a', animation: 'cf_fisher_a', speed: 0.45 },
    { sprite: 'cf_kid_otter', x: 20, y: 19, text: 'market_otter', animation: 'cf_kid_otter', speed: 0.3 },
    { sprite: 'gold_pouch', x: 7, y: 14, text: 'market_pouch', gold: 60, taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },

    // Storm-battered (2026-11-09): sandbags in front of the chandlery, what's left of the town's
    // flag on its pole by the lagoon lane, a spill of storm-broken planks on the boards. The
    // cobbles and the planks now meet raggedly (rows 14-17) instead of on one ruled line.
    { sprite: 'c5_sandbags', x: 7, y: 6, text: 'market_sandbags' },
    { sprite: 'c5_tattered_flag', x: 34, y: 7, text: 'market_flag' },
    { sprite: 'c5_planks_scatter', x: 25, y: 19, flat: true, walkable: true },
    // The boards below the square, wet and well used: rain standing in the low planks, a net
    // spread out to mend, gulls' feet, a rope left coiled, weed off somebody's boots.
    { sprite: 'c5_puddle', x: 6, y: 20, flat: true, walkable: true },
    { sprite: 'c5_puddle', x: 27, y: 17, flat: true, walkable: true },
    { sprite: 'c5_net_torn', x: 11, y: 16, flat: true, walkable: true },
    { sprite: 'c5_gull_marks', x: 14, y: 20, flat: true, walkable: true },
    { sprite: 'c5_rope_coil', x: 33, y: 18, flat: true, walkable: true },
    { sprite: 'c5_weed_mat', x: 2, y: 19, flat: true, walkable: true },
    { sprite: 'c5_planks_scatter', x: 8, y: 21, flat: true, walkable: true },
    // The hill garden, less of a lawn: gorse in a corner, a stone come up through it.
    { sprite: 'sc_gorse_small', x: 27, y: 5, text: 'market_garden' },
    { sprite: 'sc_rock_small', x: 34, y: 2, text: 'market_garden' },
    // (life pass 2026-11-14)
    // Folk about the apron: a sweeper, a cat on its rounds, a pair gossiping, a kid hopping about (Skerry has lost a cat).
    { sprite: 'st_sweeper', x: 4, y: 10, npc: 'st_market_sweeper', animation: 'st_sweeper', speed: 0.4, stroll: { path: [[3, 10], [9, 10]], speed: 9, pause: [2, 4], greet: true, keepAnim: true } },
    { sprite: 'st_cat_walk_b', x: 12, y: 9, text: 'life_m_cat', animation: 'st_cat_walk_b', speed: 0.22, stroll: { path: [[11, 10], [16, 10]], speed: 10, pause: [3, 7], scatter: true, keepAnim: true } },
    { sprite: 'st_folk_b', x: 8, y: 8, npc: 'st_market_gossip_a', animation: 'st_folk_b', speed: 0.85 },
    { sprite: 'st_folk_c', x: 9, y: 8, npc: 'st_market_gossip_b', animation: 'st_folk_c', speed: 0.8 },
    { sprite: 'cf_kid_pup', x: 4, y: 20, npc: 'st_skerry', animation: 'cf_kid_pup', speed: 0.3, quest: [
      { needs: ['has:pilchard_cat'], take: 'pilchard_cat', set: ['q_pilchard_asked', 'q_pilchard_done'], give: 'bottle_top_medal', text: 'found' },
      { needs: ['q_pilchard_done'], text: 'after', append: true },
      { needs: ['!q_pilchard_asked'], set: 'q_pilchard_asked', text: 'ask', append: true },
    ], stroll: { wander: [1, 19, 7, 21], speed: 20, pause: [1.5, 3.5], hop: true, scatter: true, greet: true } },
    // Stall dressing: the day's prices, the drying fish (the gull is after them), a broom in a bucket.
    { sprite: 'st_price_board', x: 14, y: 13, text: 'life_m_prices' },
    { sprite: 'st_fish_rack', x: 28, y: 9, text: 'life_m_rack' },
    { sprite: 'st_broom_bucket', x: 13, y: 8, text: 'life_m_broom' },
    { sprite: 'st_cat_sit', x: 7, y: 13, text: 'life_m_cat_crate', animation: 'st_cat_sit', speed: 0.8 },
    // Window boxes and tubs along the house fronts.
    { sprite: 'st_rain_barrel', x: 2, y: 7, text: 'life_m_barrel', animation: 'st_rain_barrel', speed: 0.5 },
    { sprite: 'st_flower_tub', x: 8, y: 7, text: 'life_m_tub' },
    { sprite: 'st_boot_planter', x: 14, y: 7, text: 'life_m_boot' },
    { sprite: 'st_flower_tub', x: 22, y: 6, text: 'life_m_tub' },
    { sprite: 'st_boot_planter', x: 30, y: 7, text: 'life_m_boot' },
    // Easter eggs: a crate from a very long way inland, a jug of lemonade, a sign nobody listens to.
    { sprite: 'c5_crate', x: 10, y: 15, text: 'life_m_turnip_crate' },
    { sprite: 'c5_pot_single', x: 31, y: 17, text: 'life_m_lemonade' },
    { sprite: 'sign', x: 13, y: 19, text: 'life_m_gull_sign' },
    // The garden, for sitting in: a model boat someone sailed here.
    { sprite: 'c5_toy_boat', x: 31, y: 3, text: 'life_m_toy_boat' },
    // Litter and wear.
    { sprite: 'c5_gull_marks', x: 24, y: 8, flat: true, walkable: true, decor: true },
    { sprite: 'c5_gull_marks', x: 19, y: 16, flat: true, walkable: true, decor: true },
    { sprite: 'c5_net_torn', x: 30, y: 12, flat: true, walkable: true, decor: true },
    { sprite: 'c5_wrack_line', x: 14, y: 17, flat: true, walkable: true, decor: true },
    { sprite: 'st_shells', x: 4, y: 21, flat: true, walkable: true, decor: true },
    { sprite: 'c5_puddle', x: 22, y: 20, flat: true, walkable: true, decor: true },
  ],
  tileTexts: {
    W: 'market_wall', '#': 'market_wall', f: 'market_rail', I: 'market_post', ',': 'market_garden',
    5: 'market_house', 6: 'market_window', 7: 'market_roof',
  },

  // None: a town.
  npcs: [
  ],
};
