// Shops, opened by talking to a prop with `shop: '<id>'`. The shopkeeper's
// lines live in their text file; `music` plays while the shop is open; `stock`
// is what's for sale and the price in gold: an `item` (src/data/items.js,
// bought as many times as you like), a `weapon` (src/data/weapons.js, once),
// `armor` (src/data/armor.js, once), or a `skillPoint` (a point for the skill
// tree, `limit` times per shop; see HERO_STATE.boughtSkillPoints).
//
// Every shop also buys (SELL): items for three quarters of their price, and
// weapons and armor nobody's wearing for three quarters of what a shop would charge (see
// sellValue in src/shop/shopScene.js). A weapon or armor with a `wielder`
// (Ves's umbrella parts and coats) is sold the same way, for them.
// It can only be bought once they're in the party: until then the shopkeeper
// says their [wont_fit] line instead.
//
// `keeper` is the shopkeeper's prop sprite, with the pixels of their `eyes`
// (to blink); `look` is the colours of the shop's room (see shopScene.js).
export const SHOPS = {
  ruins_shop: {
    title: 'RUINS SHOP',
    textFile: 'shops/ruins_shop.txt',
    music: 'shop',
    stock: [
      { skillPoint: true, price: 500, limit: 1 },
      { item: 'trail_mix', price: 12 },
      { item: 'lantern_tea', price: 25 },
      { item: 'ember_toffee', price: 45 },
      // Candles: light the dark (and do their own thing in battle; see candles.js).
      { item: 'plain_candle', price: 30 },
      { item: 'hearth_candle', price: 55 },
      { weapon: 'duelist_blade', price: 40 },
      { weapon: 'ash_spear', price: 45 },
      { weapon: 'hunting_bow', price: 50 },
      { weapon: 'oak_staff', price: 50 },
      { weapon: 'stone_hammer', price: 60 },
      { weapon: 'spare_lantern', price: 55 },
      { weapon: 'chapel_bell', price: 80 },
      { weapon: 'old_tome', price: 90 },
      { armor: 'padded_vest', price: 35 },
      { armor: 'moth_silk_shawl', price: 55 },
      { armor: 'waxed_coat', price: 70 },
      { armor: 'candlewick_robe', price: 80 },
      { armor: 'chain_shirt', price: 95 },
    ],
  },
  // Fennick's shop in Heralds' Rest: snacks for the cold, and the mountain's gear.
  rest_stores: {
    title: 'REST STORES',
    textFile: 'shops/rest_stores.txt',
    music: 'rest',
    keeper: { sprite: 'herald_shop', eyes: [{ x: 4, y: 6 }, { x: 11, y: 6 }], eyeColor: '#b8c0d0' },
    look: {
      wall: '#6b4a30', wallLine: '#5a3a1e', shelf: '#8a5a32', shelfTop: '#b8804a',
      counter: '#7a4e2a', counterTop: '#a06a3a', counterGrain: '#5a3a1e', lantern: '#ffcc66',
    },
    stock: [
      { skillPoint: true, price: 500, limit: 2 },
      { item: 'pine_candy', price: 10 },
      { item: 'frostberry_jam', price: 22 },
      { item: 'snowmelt_tea', price: 30 },
      { item: 'hot_cocoa', price: 35 },
      { item: 'herald_honeycake', price: 48 },
      { item: 'fanfare_fudge', price: 70 },
      { item: 'rest_soup', price: 120 },
      // Candles: light the dark (and do their own thing in battle; see candles.js).
      { item: 'plain_candle', price: 35 },
      { item: 'hearth_candle', price: 60 },
      { item: 'moonbell_candle', price: 70 },
      { item: 'glow_candle', price: 85 },
      { weapon: 'herald_trumpet', price: 95 },
      { armor: 'fur_lined_hood', price: 90 },
      { armor: 'ringers_mittens', price: 110 },
      { armor: 'snow_mantle', price: 160 },
      // For Ves: umbrella parts, and things to wrap up in.
      { weapon: 'bellwire_ribs', price: 85 },
      { weapon: 'hearthwood_crook', price: 100 },
      { armor: 'goosedown_mittens', price: 75 },
      { armor: 'ember_knit_scarf', price: 80 },
      { armor: 'oilskin_greatcoat', price: 135 },
    ],
  },
  // Tilda's forge in Heralds' Rest: food off the forge's fire, the daggers
  // and gauntlets a travelling merchant traded her, and armor she riveted herself.
  rest_forge: {
    title: "TILDA'S FORGE",
    textFile: 'shops/rest_forge.txt',
    music: 'rest',
    keeper: { sprite: 'herald_smith', eyes: [{ x: 6, y: 5 }, { x: 9, y: 5 }], eyeColor: '#b08858' },
    look: {
      wall: '#3e3236', wallLine: '#30262a', shelf: '#5a3a1e', shelfTop: '#8a5a32',
      counter: '#3a3440', counterTop: '#6a6478', counterGrain: '#2a2630', lantern: '#ff9a3a',
    },
    stock: [
      { item: 'forge_loaf', price: 24 },
      { item: 'mulled_cider', price: 30 },
      { item: 'smiths_pasty', price: 52 },
      { item: 'iron_pot_stew', price: 78 },
      // Candles: light the dark (and do their own thing in battle; see candles.js).
      { item: 'hearth_candle', price: 60 },
      { item: 'ash_candle', price: 75 },
      { weapon: 'glass_dagger', price: 70 },
      { weapon: 'iron_gauntlets', price: 75 },
      { armor: 'smiths_apron', price: 105 },
      { armor: 'riveted_gambeson', price: 150 },
      // For Ves: a tip for her umbrella, and a cape for the sparks.
      { weapon: 'tempered_ferrule', price: 120 },
      { armor: 'spark_proof_cape', price: 100 },
    ],
  },
  // Rimble's stall in the ice caves past the Weathervane Shelf: cave cooking,
  // and whatever climbers and the caves have left lying about, cleaned up.
  cave_goblin: {
    title: "RIMBLE'S STALL",
    textFile: 'shops/cave_goblin.txt',
    music: 'caves',
    keeper: { sprite: 'goblin_shop', eyes: [{ x: 5, y: 7 }, { x: 10, y: 7 }], eyeColor: '#5fc27a' },
    look: {
      wall: '#2e4a66', wallLine: '#243a52', shelf: '#4a6a88', shelfTop: '#9fd0e8',
      counter: '#3a4a5e', counterTop: '#7aa0bc', counterGrain: '#2a3646', lantern: '#9ff0e0',
    },
    stock: [
      { item: 'lichen_crisps', price: 32 },
      { item: 'mystery_jerky', price: 42 },
      { item: 'glowcap_skewer', price: 62 },
      { item: 'goblin_hotpot', price: 96 },
      // Candles: light the dark (and do their own thing in battle; see candles.js).
      { item: 'hearth_candle', price: 65 },
      { item: 'moonbell_candle', price: 80 },
      { item: 'glow_candle', price: 95 },
      { weapon: 'glintstone_sling', price: 140 },
      { weapon: 'golem_knuckle', price: 165 },
      { armor: 'rimemoth_shawl', price: 175 },
      { armor: 'patchwork_parka', price: 210 },
      // For Ves: a canopy of thin ice-glass panes, a caver's hood, and a cloak.
      { weapon: 'frostglass_canopy', price: 155 },
      { armor: 'cavers_hood', price: 160 },
      { armor: 'rimeweave_cloak', price: 190 },
    ],
  },
  // Hollis's stall on the Last Shelf, just below the summit: an old snowy
  // owl who keeps the last stall on the mountain. Hearty food for what's
  // above, a last skill point, and the best gear for the hero and Ves.
  owl_stall: {
    title: "HOLLIS'S STALL",
    textFile: 'shops/owl_stall.txt',
    music: 'vigil',
    keeper: {
      sprite: 'owl_shop',
      eyes: [{ x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 },
        { x: 10, y: 5 }, { x: 11, y: 5 }, { x: 12, y: 5 }, { x: 10, y: 6 }, { x: 11, y: 6 }, { x: 12, y: 6 }],
      eyeColor: '#f4f1ea',
    },
    look: {
      wall: '#5a6a80', wallLine: '#46566c', shelf: '#7a5a3a', shelfTop: '#b08858',
      counter: '#6a4a2e', counterTop: '#9a7048', counterGrain: '#4a3020', lantern: '#eef3fa',
    },
    stock: [
      { skillPoint: true, price: 600, limit: 1 },
      { item: 'hot_cocoa', price: 40 },
      { item: 'fanfare_fudge', price: 75 },
      { item: 'goblin_hotpot', price: 100 },
      { item: 'seed_cake', price: 130 },
      { item: 'rest_soup', price: 140 },
      { item: 'glow_candle', price: 95 },
      { weapon: 'skyiron_blade', price: 240 },
      { armor: 'owl_down_coat', price: 260 },
      // For Ves: a canopy of owl feathers, and a shawl of them.
      { weapon: 'owlfeather_canopy', price: 230 },
      { armor: 'snowfeather_shawl', price: 250 },
    ],
  },
};