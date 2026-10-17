// Shops, opened by talking to a prop with `shop: '<id>'`. The shopkeeper's
// lines live in their text file; `music` plays while the shop is open; `stock`
// is what's for sale and the price in gold: an `item` (src/data/items.js,
// bought as many times as you like), a `weapon` (src/data/weapons.js, once),
// `armor` (src/data/armor.js, once), or a `skillPoint` (a point for the skill
// tree, `limit` times per shop; see HERO_STATE.boughtSkillPoints).
//
// Every shop also buys (SELL): items for half their price, and weapons and
// armor nobody's wearing for half of what a shop would charge (see
// sellValue in src/shop/shopScene.js). A weapon or armor with a `wielder`
// (Ves's umbrella parts and coats) is sold the same way, for them.
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
      { weapon: 'duelist_blade', price: 40 },
      { weapon: 'ash_spear', price: 45 },
      { weapon: 'hunting_bow', price: 50 },
      { weapon: 'oak_staff', price: 50 },
      { weapon: 'stone_hammer', price: 60 },
      { weapon: 'spare_lantern', price: 55 },
      { weapon: 'glass_dagger', price: 70 },
      { weapon: 'iron_gauntlets', price: 75 },
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
};
