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
  ambience: 'stilt_town',
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
    '#XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX#',
    '#XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX#',
    '#..................................#',
    '#..................................#',
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
  ],
  tileTexts: {
    W: 'market_wall', '#': 'market_wall', f: 'market_rail', I: 'market_post', ',': 'market_garden',
    5: 'market_house', 6: 'market_window', 7: 'market_roof',
  },

  // None: a town.
  npcs: [
  ],
};
