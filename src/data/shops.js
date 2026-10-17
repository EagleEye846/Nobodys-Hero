// Shops, opened by talking to a prop with `shop: '<id>'`. The shopkeeper's
// lines live in their text file; `music` plays while the shop is open; `stock`
// is what's for sale and the price in gold: an `item` (src/data/items.js,
// bought as many times as you like) or a `weapon` (src/data/weapons.js, once).
export const SHOPS = {
  ruins_shop: {
    title: 'RUINS SHOP',
    textFile: 'shops/ruins_shop.txt',
    music: 'shop',
    stock: [
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
    ],
  },
};
