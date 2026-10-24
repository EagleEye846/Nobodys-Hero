import { HERO_STATE } from '../characters/heroState.js';

// Things you can carry and use in battle (ITEMS). Descriptions live in
// text/items/items.txt, one section per id. `heal` is HP restored (a big
// number heals you fully); `price` is what shops charge, if they sell it.
//
// Candles (made from materials, see src/data/candles.js) can do other things
// in battle (`use`: 'calm' raises every enemy's MERCY by `amount`, 'sp' fills
// SP by `amount` percent, 'guard' halves the next attack's damage), and give
// `light` in dark places: how far it reaches (`radius`, pixels) and how many
// seconds it burns (`burn`).
export const ITEMS = {
  trail_mix: { name: 'Trail Mix', heal: 40, price: 12 },
  lantern_tea: { name: 'Lantern Tea', heal: 60, price: 25 },
  ember_toffee: { name: 'Ember Toffee', heal: 90, price: 45 },
  // Enemy drops.
  cotton_candy: { name: 'Cotton Candy', heal: 25 },
  wild_carrot: { name: 'Wild Carrot', heal: 30 },
  glow_jam: { name: 'Glow Jam', heal: 35 },
  wax_drop: { name: 'Wax Drop', heal: 20 },
  dark_chocolate: { name: 'Dark Chocolate', heal: 45 },
  pillar_mint: { name: 'Pillar Mint', heal: 30 },
  step_shortbread: { name: 'Step Shortbread', heal: 35 },
  crag_cheese: { name: 'Craghorn Cheese', heal: 40 },
  shiny_button: { name: 'Shiny Button', heal: 25 },
  snow_cone: { name: 'Snow Cone', heal: 35 },
  filings_toffee: { name: 'Iron Filings Toffee', heal: 40 },
  rime_jam: { name: 'Rime Jam', heal: 50 },
  ice_shortbread: { name: 'Ice Shortbread', heal: 40 },
  geode_candy: { name: 'Geode Rock Candy', heal: 55 },
  frost_nectar: { name: 'Frost Nectar', heal: 40 },
  glint_drop: { name: 'Glint Drop', heal: 35 },
  // The Roost Mother's: from her winter store, beaten or spared.
  roost_plum: { name: 'Roost Plum', heal: 120 },
  // The Pinefall's (Chapter 3).
  roast_chestnut: { name: 'Roast Chestnut', heal: 60 },
  scarlet_syrup: { name: 'Scarlet Syrup', heal: 70 },
  stolen_pie: { name: 'Stolen Pie', heal: 65 },
  // The Hushwood's.
  stump_honey: { name: 'Stump Honey', heal: 75 },
  hollin_apple: { name: 'Hollin Apple', heal: 75 },
  gloam_honeydew: { name: 'Gloam Honeydew', heal: 80 },
  hob_scone: { name: 'Hob Scone', heal: 85 },
  millers_bannock: { name: "Miller's Bannock", heal: 90 },
  // The Old Drains'.
  culvert_cress: { name: 'Culvert Cress', heal: 85 },
  // The Old Drains'.
  mug_barley_sugar: { name: 'Barley Sugar', heal: 85 },
  // The Old Drains'.
  fifty_year_humbug: { name: 'Fifty-Year Humbug', heal: 85 },
  // The Lantern Marsh's.
  wisp_cordial: { name: 'Wisp Cordial', heal: 90 },
  bog_pudding: { name: 'Bog Pudding', heal: 95 },
  bulrush_bread: { name: 'Bulrush Bread', heal: 100 },
  toadstool_toast: { name: 'Toadstool Toast', heal: 70 },
  // The Dead City's (the old city in the Hollow Valley, past Lasthome).
  dust_meringue: { name: 'Dust Meringue', heal: 105 },
  cairn_biscuit: { name: 'Cairn Biscuit', heal: 115 },
  welcome_cake: { name: 'Welcome Cake', heal: 125 },
  // The Tatterwight's, in the Torn Clearing: a leaf that never stops turning.
  turning_leaf: { name: 'Turning Leaf', use: 'sp', amount: 70 },
  // The Warden of the Gate's: the offering left in its open hand.
  heros_offering: { name: "Hero's Offering", heal: 240 },
  // Slowly's, in the Old Baths of the Dead City.
  city_hardtack: { name: 'Old City Hardtack', heal: 190, price: 130 },
  spring_water: { name: 'Spring Water', use: 'sp', amount: 100, price: 160 },
  dandelion_salad: { name: 'Dandelion Salad', heal: 150, price: 100 },
  // Lasthome's: Pell's market stall, and Mabb's kettle at the inn.
  valley_apple: { name: 'Valley Apple', heal: 60, price: 30 },
  eel_pie: { name: 'Eel Pie', heal: 170, price: 120 },
  honey_oatcake: { name: 'Honey Oatcake', heal: 120, price: 80 },
  willow_tonic: { name: 'Willow Tonic', use: 'sp', amount: 80, price: 140 },
  lasthome_stew: { name: "Mabb's Stew", heal: 220, price: 150 },
  // Baked in Nan Cinder's kiln, and sold at her stall.
  soot_bun: { name: 'Soot Bun', heal: 55, price: 28 },
  ember_potato: { name: 'Ember Potato', heal: 80, price: 44 },
  charcoal_toffee: { name: 'Charcoal Toffee', heal: 105, price: 66 },
  kiln_stew: { name: 'Kiln Stew', heal: 140, price: 92 },
  // Hollin Stores: what Mags left on her shelves fifty years ago (only the
  // things that keep).
  hardtack: { name: 'Hollin Hardtack', heal: 60, price: 30 },
  pickled_onions: { name: 'Pickled Onions', heal: 90, price: 55 },
  crock_of_honey: { name: 'Crock of Honey', heal: 130, price: 85 },
  mags_jam: { name: "Mags's Blackberry Jam", heal: 175, price: 130 },
  // Old Ladle's, in his nook in the Old Drains: what a cistern hob keeps.
  sweet_water: { name: 'Ladle of Sweet Water', heal: 65, price: 32 },
  penny_bun: { name: 'Penny Bun', heal: 95, price: 58 },
  hob_porridge: { name: 'Hob Porridge', heal: 135, price: 88 },
  // Rummage's: things that fell off the mountain, and were caught.
  lost_lunch: { name: "A Herald's Lost Lunch", heal: 160, price: 110 },
  bottled_updraft: { name: 'Bottled Updraft', use: 'sp', amount: 60, price: 120 },
  music_box: { name: 'Fallen Music Box', use: 'calm', amount: 30, price: 105 },
  herald_helmet: { name: "Herald's Helmet", use: 'guard', price: 70 },
  // Found and given.
  candle_cake: { name: 'Candle Cake', heal: 70 },
  climbers_ration: { name: "Climber's Ration", heal: 50 },
  // Mount Vigil and Heralds' Rest: sold at Rest Stores, or found in chests.
  pine_candy: { name: 'Pine Candy', heal: 30, price: 10 },
  snowmelt_tea: { name: 'Snowmelt Tea', heal: 55, price: 30 },
  frostberry_jam: { name: 'Frostberry Jam', heal: 45, price: 22 },
  hot_cocoa: { name: 'Hot Cocoa', heal: 65, price: 35 },
  herald_honeycake: { name: 'Herald Honeycake', heal: 80, price: 48 },
  fanfare_fudge: { name: 'Fanfare Fudge', heal: 100, price: 70 },
  rest_soup: { name: "Heralds' Soup", heal: 999, price: 120 },
  // Hollis's, on the Last Shelf below the summit.
  seed_cake: { name: 'Seed Cake', heal: 150, price: 130 },
  // Cooked on the forge at Tilda's: the hearth that heats the iron bakes the bread.
  forge_loaf: { name: 'Forge Loaf', heal: 50, price: 24 },
  mulled_cider: { name: 'Mulled Cider', heal: 60, price: 30 },
  smiths_pasty: { name: "Smith's Pasty", heal: 85, price: 52 },
  iron_pot_stew: { name: 'Iron-Pot Stew', heal: 110, price: 78 },
  // Rimble's cave cooking, sold in the ice caves.
  lichen_crisps: { name: 'Lichen Crisps', heal: 60, price: 32 },
  mystery_jerky: { name: 'Mystery Jerky', heal: 75, price: 42 },
  glowcap_skewer: { name: 'Glowcap Skewer', heal: 95, price: 62 },
  goblin_hotpot: { name: 'Goblin Hotpot', heal: 130, price: 96 },
  // Taper's candle "won't go out on you": it lights the dark forever.
  taper_stub: { name: "Taper's Candle", heal: 999, light: { radius: 72, burn: Infinity } },
  // Candles you make.
  plain_candle: { name: 'Plain Candle', heal: 25, light: { radius: 44, burn: 180 } },
  hearth_candle: { name: 'Hearth Candle', heal: 60, light: { radius: 54, burn: 240 } },
  moonbell_candle: { name: 'Moonbell Candle', use: 'calm', amount: 20, light: { radius: 52, burn: 200 } },
  glow_candle: { name: 'Glow Candle', use: 'sp', amount: 35, light: { radius: 84, burn: 360 } },
  ash_candle: { name: 'Ash Candle', use: 'guard', light: { radius: 36, burn: 420 } },
  // The Usurper's: a candle lit from Ves's mother's lantern, once it blazed again.
  lamplight_candle: { name: 'Lamplight Candle', use: 'sp', amount: 50, light: { radius: 88, burn: 900 } },
  // The Hush's: a tuft of its fur, left on your sleeve at the Hero's Gate.
  hush_fur: { name: 'Hush Bristles', use: 'guard' },
};

// How many items you can carry.
export const MAX_ITEMS = 12;
// The storage chests by every save point (see storageMenu.js) all hold the
// same things: whatever won't fit in your bag goes there, up to this many.
export const MAX_STORAGE = 60;

// Puts an item in your bag, or if that's full, in storage. Returns true (in
// your bag), 'stored' (sent to storage), or false (no room anywhere).
export function giveItem(id) {
  if (!ITEMS[id]) throw new Error(`Unknown item '${id}'`);
  if (HERO_STATE.items.length < MAX_ITEMS) {
    HERO_STATE.items.push(id);
    return true;
  }
  HERO_STATE.storage ??= [];
  if (HERO_STATE.storage.length >= MAX_STORAGE) return false;
  HERO_STATE.storage.push(id);
  return 'stored';
}

// Whether there's room for one more item, in your bag or in storage.
export function roomForItem() {
  return HERO_STATE.items.length < MAX_ITEMS || (HERO_STATE.storage ?? []).length < MAX_STORAGE;
}

// What it does in battle: "+40 HP", "Full HP", "MERCY +20%", "SP +35%" or "Guard".
export function healLabel(id) {
  const item = ITEMS[id];
  if (item.use === 'calm') return `MERCY +${item.amount}%`;
  if (item.use === 'sp') return `SP +${item.amount}%`;
  if (item.use === 'guard') return 'Guard';
  return item.heal >= 999 ? 'Full HP' : `+${item.heal} HP`;
}

// How a candle lights the dark: "Light: wide, burns 6 min" (null if it doesn't).
export function lightLabel(id) {
  const light = ITEMS[id].light;
  if (!light) return null;
  const reach = light.radius >= 70 ? 'wide' : light.radius >= 50 ? 'fair' : 'small';
  const burn = light.burn === Infinity ? 'never goes out' : `burns ${Math.round(light.burn / 60)} min`;
  return `Light: ${reach}, ${burn}`;
}
