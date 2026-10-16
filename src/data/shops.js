import { WEAPONS } from './weapons.js';

// Shops, opened by talking to a prop with `shop: '<id>'`. The shopkeeper's
// lines live in their text file; `music` plays while the shop is open; `stock`
// is what's for sale and the price in gold.
export const SHOPS = {
  ruins_shop: {
    title: 'RUINS SHOP',
    textFile: 'shops/ruins_shop.txt',
    music: 'shop',
    // Everything, for free, for now.
    stock: Object.keys(WEAPONS).map((weapon) => ({ weapon, price: 0 })),
  },
};
