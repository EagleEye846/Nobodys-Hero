// BELOWTOWN MARKET: a long street under the cavern roof, stalls down both
// sides under mushroom-cap awnings, and creature-built houses with moss roofs
// along the back. Pebble the shrew sells pasties, honey, toffee, candles for
// the dark below and a cloak the shrews weave. Everyone's selling and
// nobody's buying much, because everyone's looking at the Sunstone, which is
// not as bright as it was. Tucked in the south-east corner, behind a wall of
// barrels: a chest.
// Tile key (see src/overworld/brightTiles.js):
//   #  cavern rock      W  carved stone      V  wall with glow-worm lamps
//   H  wall with a banner      .  flagstone   X  cobbles   ,  mossy turf
//   5 6 7  house wall, round window, mossy roof      8  round door (shut)
//   a w e  planked creature building: wall, lit window, mushroom-cap roof
//   O  barrel (solid)
export const BELOWTOWN_MARKET = {
  // Used to remember things about this room (like beaten enemies) and for doors.
  id: 'belowtown_market',
  // The room's name, for the Room Editor.
  name: 'BELOWTOWN MARKET',
  // The region it's in (see src/data/areas.js).
  area: 'belowtown',
  // "Lamps Lit Early" (belowtownTheme.js).
  music: 'belowtown',
  ambience: 'belowtown_market',

  tiles: [
    '################################',
    '#WWWVWWWHWWWVWWWWWWWWWVWWWHWWVW#',
    '#WW77777WWeeeeeWWWeeeeeW77777WW#',
    '#WW56565WWawaWaW.WawaWaW56565WW#',
    '#WW55855WWaaaaaW.WaaaaaW55855WW#',
    '#..............................#',
    '#.....,.....,.....,.....,.....,#',
    '#..............................#',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    '#..............................#',
    '#.....,.....,.....,.....,..OOOO#',
    '#..........................O...#',
    '#.,.,.,.,.,.,.,.,.,.,.,.,.,O,.,#',
    '#..........................O...#',
    '#.....,.....,.....,.....,.....,#',
    '################################',
  ],

  // Where the player starts, in tile coordinates.
  playerStart: { x: 1, y: 9 },

  // Walking onto a door's tiles takes you to another room; `spawn` is where you arrive.
  doors: [
    { x: 0, y: 8, w: 1, h: 3, to: 'belowtown_gate', spawn: { x: 28, y: 8 } },
    { x: 31, y: 8, w: 1, h: 3, to: 'belowtown_square', spawn: { x: 1, y: 12 } },
  ],

  cutscenes: [],

  // Things you can press Z on. `text` names a section of this room's text file.
  // Pebble's stall (shop `belowtown_market`) is the middle one on the north side.
  textFile: 'interactions/belowtown.txt',
  props: [
    { sprite: 'mushroom_stall', x: 3, y: 7, text: 'market_stall_mole' },
    { sprite: 'mushroom_stall', x: 14, y: 7, text: 'market_stall_pebble' },
    { sprite: 'mushroom_stall', x: 25, y: 7, text: 'market_stall_frog' },
    { sprite: 'mushroom_stall', x: 6, y: 14, text: 'market_stall_snail' },
    { sprite: 'mushroom_stall', x: 19, y: 14, text: 'market_stall_beetle' },
    { sprite: 'bf_mole_miner_b', x: 2, y: 7, npc: 'bt_vendor_mole', animation: 'bf_mole_miner_b', speed: 0.5 },
    { sprite: 'bf_shrew_stallkeeper', x: 13, y: 7, animation: 'bf_shrew_stallkeeper', speed: 0.5, shop: 'belowtown_market' },
    { sprite: 'bf_frog_kid_a', x: 24, y: 7, npc: 'bt_vendor_frog', animation: 'bf_frog_kid_a', speed: 0.4 },
    { sprite: 'bf_snail_elder', x: 4, y: 14, npc: 'bt_vendor_snail', animation: 'bf_snail_elder', speed: 0.5, quest: [
      { needs: ['q_toffee_done'], text: 'toffee_after', append: true },
      { needs: ['q_toffee_asked'], text: 'toffee_wait' },
      { needs: ['!q_toffee_asked'], set: 'q_toffee_asked', give: 'slow_toffee', text: 'toffee_ask', append: true },
    ] },
    { sprite: 'bf_beetle_postman', x: 18, y: 14, npc: 'bt_vendor_beetle', animation: 'bf_beetle_postman', speed: 0.5, quest: [
      { needs: ['has:mattock_reply'], take: 'mattock_reply', set: ['q_letter_asked', 'q_letter_done'], give: 'sunstone_stamp', text: 'letter_done' },
      { needs: ['q_letter_done'], text: 'letter_after', append: true },
      { needs: ['q_letter_asked'], text: 'letter_wait' },
      { needs: ['!q_letter_asked'], set: 'q_letter_asked', give: 'mattock_letter', text: 'letter_ask', append: true },
    ] },
    { sprite: 'bf_mole_miner_a', x: 9, y: 9, npc: 'bt_haggler', animation: 'bf_mole_miner_a', speed: 0.5, stroll: { path: [[4, 9], [12, 9]], speed: 13, pause: [2, 5], greet: true } },
    { sprite: 'bf_frog_kid_b', x: 23, y: 12, npc: 'bt_market_kid', animation: 'bf_frog_kid_b', speed: 0.45, stroll: { path: [[23, 12], [23, 15]], speed: 30, pause: [0.6, 2], hop: true, flip: false } },
    // Hopscotch in chalk down the lane at x 23, a kid watching, and a ball that rolls when you walk into it.
    { sprite: 'bf_chalk_a', x: 23, y: 12, flat: true, walkable: true },
    { sprite: 'bf_chalk_b', x: 23, y: 13, flat: true, walkable: true },
    { sprite: 'bf_chalk_a', x: 23, y: 14, flat: true, walkable: true },
    { sprite: 'bf_chalk_x', x: 23, y: 15, flat: true, walkable: true },
    { sprite: 'bf_frog_kid_a', x: 25, y: 13, npc: 'bt_hop_kid', animation: 'bf_frog_kid_a', speed: 0.4, stroll: { wander: [25, 13, 25, 15], speed: 22, pause: [1.5, 4], hop: true, scatter: true, greet: true } },
    { sprite: 'bf_ball', x: 26, y: 15, walkable: true, stroll: { ball: true, keepAnim: true } },
    // Mole miners on their way to the Diggings (one each lane, there and back), and the sweeper.
    { sprite: 'bf_mole_miner_a', x: 3, y: 10, npc: 'bt_shift_a', animation: 'bf_mole_miner_a', speed: 0.5, stroll: { path: [[3, 10], [28, 10]], speed: 20, pause: [2, 5], greet: true } },
    { sprite: 'bf_mole_miner_b', x: 28, y: 8, npc: 'bt_shift_b', animation: 'bf_mole_miner_b', speed: 0.5, stroll: { path: [[28, 8], [3, 8]], speed: 18, pause: [2, 6], greet: true } },
    { sprite: 'bf_mole_sweeper', x: 5, y: 11, npc: 'bt_sweeper', animation: 'bf_mole_sweeper', speed: 0.45, quest: [
      { needs: ['q_pan_done'], text: 'pan_after', append: true },
      { needs: ['has:dented_dustpan'], take: 'dented_dustpan', set: ['q_pan_asked', 'q_pan_done'], give: 'sweepers_pin', text: 'pan_done' },
      { needs: ['q_pan_asked'], text: 'pan_wait' },
      { needs: ['!q_pan_asked'], set: 'q_pan_asked', text: 'pan_ask', append: true },
    ], stroll: { path: [[3, 11], [9, 11]], speed: 7, pause: [2, 4], greet: true, keepAnim: true } },
    { sprite: 'bf_glowworm', x: 28, y: 11, npc: 'bt_market_glowworm', animation: 'bf_glowworm', speed: 0.4, stroll: { path: [[25, 11], [29, 11]], speed: 12, pause: [3, 6], greet: true }, glow: [{ dx: 0, dy: -4, bloom: 14, strength: 0.7, flicker: 0.2, color: '190, 255, 120' }, { dx: 0, dy: 2, pool: 40, strength: 0.4, flicker: 0.2, color: '190, 255, 120' }] },
    // After the king's welcome: scraps of the party still on the cobbles.
    { sprite: 'bf_confetti_a', x: 6, y: 9, flat: true, walkable: true, after: 'the_kings_welcome' },
    { sprite: 'bf_confetti_b', x: 13, y: 10, flat: true, walkable: true, after: 'the_kings_welcome' },
    { sprite: 'bf_streamer', x: 17, y: 9, flat: true, walkable: true, after: 'the_kings_welcome' },
    { sprite: 'bf_confetti_a', x: 26, y: 9, flat: true, walkable: true, after: 'the_kings_welcome' },
    { sprite: 'bf_confetti_b', x: 9, y: 8, flat: true, walkable: true, after: 'the_kings_welcome' },
    { sprite: 'bf_streamer', x: 29, y: 10, flat: true, walkable: true, after: 'the_kings_welcome' },
    { sprite: 'bf_bat_sleeper', x: 16, y: 2, npc: 'bt_market_bat', animation: 'bf_bat_sleeper', speed: 0.6 },
    { sprite: 'burrow_door', x: 11, y: 4, text: 'market_burrow_door', walkable: true },
    { sprite: 'burrow_door', x: 19, y: 4, text: 'market_burrow_door', walkable: true },
    { sprite: 'glowworm_string', x: 9, y: 5, animation: 'glowworm_string', speed: 0.4, walkable: true, decor: true },
    { sprite: 'glowworm_string', x: 20, y: 5, animation: 'glowworm_string', speed: 0.4, walkable: true, decor: true },
    { sprite: 'glowworm_string', x: 28, y: 6, animation: 'glowworm_string', speed: 0.4, walkable: true, decor: true },
    { sprite: 'glowworm_lamp', x: 9, y: 7, text: 'market_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'glowworm_lamp', x: 21, y: 7, text: 'market_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'glowworm_lamp', x: 12, y: 12, text: 'market_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'glowworm_lamp', x: 24, y: 12, text: 'market_lamp', animation: 'glowworm_lamp', speed: 0.5 },
    { sprite: 'town_barrels', x: 11, y: 13, text: 'market_barrels' },
    { sprite: 'town_crates', x: 15, y: 15, text: 'market_crates' },
    { sprite: 'town_crates', x: 2, y: 13, text: 'market_crates' },
    { sprite: 'town_barrels', x: 29, y: 6, text: 'market_barrels' },
    { sprite: 'town_noticeboard', x: 14, y: 12, text: 'market_noticeboard' },
    { sprite: 'town_signpost', x: 1, y: 6, text: 'market_signpost' },
    { sprite: 'chest', x: 30, y: 14, text: 'market_chest', gives: 'glow_candle', taken: { sprite: 'chest_open', text: 'chest_empty' } },
    // The life pass (14 Nov): what the folk have left lying about.
    { sprite: 'bf_mole_miner_b', x: 19, y: 6, npc: 'bt_pot_mole', animation: 'bf_mole_miner_b', speed: 0.5 },
    { sprite: 'bt_menu_board', x: 7, y: 7, text: 'bl_menu_board' },
    { sprite: 'bt_cook_pot', x: 18, y: 7, text: 'bl_stew_pot', animation: 'bt_cook_pot', speed: 0.35 },
    { sprite: 'bt_tall_shroom', x: 30, y: 5, text: 'bl_tall_shroom' },
    { sprite: 'bt_wall_pegs', x: 9, y: 4, text: 'bl_pegs', walkable: true },
    { sprite: 'bt_poster_a', x: 15, y: 4, text: 'bl_poster_bat', walkable: true },
    { sprite: 'bt_poster_b', x: 29, y: 4, text: 'bl_poster_gig', walkable: true },
    { sprite: 'bt_doorstep_shoes', x: 5, y: 5, text: 'bl_shoes', walkable: true },
    { sprite: 'bt_doorstep_shoes', x: 26, y: 5, text: 'bl_shoes_b', walkable: true },
    { sprite: 'bt_pigeons', x: 16, y: 11, text: 'bl_pigeons', animation: 'bt_pigeons', speed: 0.6, walkable: true },
    { sprite: 'sign', x: 17, y: 12, text: 'bl_sign_pigeons' },
    { sprite: 'bt_pigeons', x: 8, y: 6, text: 'bl_pigeons', animation: 'bt_pigeons', speed: 0.7, walkable: true },
    { sprite: 'bt_produce_crate', x: 9, y: 13, text: 'bl_produce' },
    { sprite: 'bt_mushroom_tub', x: 2, y: 16, text: 'bl_tub' },
    { sprite: 'bt_mushroom_tub', x: 21, y: 16, text: 'bl_tub' },
    { sprite: 'bt_hand_cart', x: 13, y: 16, text: 'bl_cart' },
    { sprite: 'bt_pick_rack', x: 1, y: 14, text: 'bl_pick_rack' },
    { sprite: 'bt_sacks', x: 20, y: 12, text: 'bl_sacks' },
    { sprite: 'bt_toys', x: 22, y: 16, text: 'bl_toys', walkable: true },
    { sprite: 'bt_dice_board', x: 29, y: 16, text: 'bl_dice', walkable: true },
    { sprite: 'bt_cat_dish', x: 5, y: 16, text: 'bl_cat_dish', walkable: true },
    { sprite: 'bt_glow_patch_a', x: 24, y: 6, walkable: true, decor: true },
    { sprite: 'bt_glow_patch_b', x: 10, y: 16, walkable: true, decor: true },
    { sprite: 'bt_stalagmite', x: 31, y: 16, text: 'bl_stalagmite' },
    // The bat's niche, in the wall under the roost: a purse on a nail.
    { sprite: 'bt_glow_patch_a', x: 16, y: 4, walkable: true, decor: true },
    { sprite: 'gold_pouch', x: 16, y: 3, text: 'bl_niche_pouch', gives: 'bl_lookers_biscuit', taken: { sprite: 'gold_pouch_empty', text: 'gold_pouch_empty' } },
    // A barrel that is not quite where it was: one place before the king's welcome, another after, a third once the light is up.
    { sprite: 'barrel', x: 7, y: 12, text: 'bl_odd_barrel', until: 'the_kings_welcome' },
    { sprite: 'barrel', x: 17, y: 14, text: 'bl_odd_barrel', after: 'the_kings_welcome', until: 'the_light_goes_up' },
    { sprite: 'barrel', x: 4, y: 12, text: 'bl_odd_barrel', after: 'the_light_goes_up' },

  ],
  tileTexts: { W: 'town_wall', '#': 'town_rock', V: 'town_lamps_wall', H: 'town_banner_wall', 5: 'town_house', 6: 'town_house', 7: 'town_house', 8: 'town_house_door', a: 'town_plank', w: 'town_plank', e: 'town_plank', O: 'town_barrel' },

  // Nobody to fight in town. Folk walk about (src/overworld/folk.js): the
  // haggler on row 9, the miners on rows 8 and 10, the sweeper on row 11, the
  // hopscotch kids down x 23. There are no cutscenes in this room.
  npcs: [],
};
