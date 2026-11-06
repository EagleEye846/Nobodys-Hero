import { HERO_STATE } from '../characters/heroState.js';
import { WORLD_STATE } from '../state/saveGame.js';

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
  // Marigold's lemonade stand, in Sunnyside (Chapter 4).
  lemonade: { name: 'Lemonade', heal: 120, price: 70 },
  cucumber_sandwich: { name: 'Cuke Sarnie', heal: 165, price: 105 },
  jam_tart: { name: 'Jam Tart', heal: 240, price: 160 },
  // Belowtown's market: Pebble's stall (Chapter 4).
  mushroom_pasty: { name: 'Mushroom Pasty', heal: 150, price: 95 },
  glowworm_honey: { name: 'Glow-Worm Honey', heal: 210, price: 140 },
  frog_toffee: { name: 'Cave-Frog Toffee', use: 'sp', amount: 80, price: 150 },
  // Hobnail's forge: something to eat while he doesn't talk (Chapter 4).
  slag_bread: { name: 'Slag Bread', heal: 190, price: 120 },
  // Grig's pack, the last stall before the root (Chapter 4, the Deep).
  cricket_cake: { name: 'Cricket Cake', heal: 230, price: 150 },
  cave_dew: { name: 'Cave Dew', use: 'sp', amount: 100, price: 175 },
  cricket_candle: { name: 'Cricket Candle', use: 'sp', amount: 40, light: { radius: 100, burn: 600 }, price: 80 },
  // Chapter 4's first monsters' (Sunnyside, the Glimmering, the Diggings).
  dandelion_tea: { name: 'Dandelion Tea', heal: 130 },
  hay_biscuit: { name: 'Hay Biscuit', heal: 135 },
  glint_sugar: { name: 'Glint Sugar', use: 'sp', amount: 80 },
  rock_candy: { name: 'Rock Candy', heal: 160 },
  pit_pasty: { name: 'Pit Pasty', heal: 180 },
  // The second wave of Chapter 4's monsters' (Sunnyside, the Glimmering, the Diggings, the Stillwater).
  party_ring: { name: 'Party Ring', heal: 125 },
  spectrum_wafer: { name: 'Spectrum Wafer', heal: 165 },
  molehill_muffin: { name: 'Molehill Muffin', heal: 185 },
  rosin_toffee: { name: 'Rosin Toffee', heal: 205 },
  // Chapter 5's monsters, batch 2 (the Lanes, the Wrack Shore, the Wreck Yard, the Reach, Sunnyside).
  eel_skin: { name: 'Eel Skin', heal: 245 },
  urchin_spine: { name: 'Urchin Spine', use: 'sp', amount: 100 },
  brass_helmet: { name: 'Brass Helmet', use: 'guard' },
  static_puff: { name: 'Static Puff', use: 'sp', amount: 120 },
  net_float: { name: 'Net Float', use: 'calm', amount: 35 },
  stolen_chip: { name: 'Stolen Chip', heal: 250 },
  kelp_mane: { name: 'Kelp Mane', heal: 275 },
  // Chapter 5's Sunnyside monsters (the Seed Sheep, the Flatcap Bee, the Clover Snail).
  clock_wool: { name: 'Clock Wool', use: 'sp', amount: 80 },
  flatcap_honey: { name: 'Flatcap Honey', heal: 260 },
  lucky_clover: { name: 'Lucky Clover', use: 'calm', amount: 30 },
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
  // Chapter 4's deeper monsters' (the Diggings, the Stillwater, the Deep).
  cinder_toffee: { name: 'Cinder Toffee', heal: 170 },
  smoked_blindfish: { name: 'Smoked Blindfish', heal: 185 },
  olm_tea: { name: 'Olm Tea', use: 'sp', amount: 90 },
  lightless_jelly: { name: 'Lightless Jelly', heal: 200 },
  gnawbone_broth: { name: 'Gnawbone Broth', heal: 220 },
  // Chapter 5's first coast monsters (batch 1): each beats chapter 4's best heal by a little.
  teapot_shell: { name: 'Teapot Shell', heal: 245 },
  jelly_bell: { name: 'Jelly Bell', use: 'sp', amount: 90 },
  limpet_plate: { name: 'Limpet Plate', heal: 265 },
  sandpiper_feather: { name: 'Sandpiper Feather', use: 'sp', amount: 80 },
  buoy_bell: { name: 'Buoy Bell', heal: 270 },
  ghost_rope: { name: 'Ghost Rope', heal: 280 },
  pail_and_spade: { name: 'Pail and Spade', heal: 255 },
  // Fished off the Shore's jetty with Gubb's rod (src/ui/fishingScene.js). They
  // sell for next to nothing (`price`), so the lake never pays in gold, and none
  // heals more than the best food of the chapter.
  moonblind_minnow: { name: 'Moonblind Minnow', heal: 120, price: 8 },
  grumbling_olm: { name: 'Grumbling Olm', heal: 150, price: 10 },
  lantern_gudgeon: { name: 'Lantern Gudgeon', heal: 190, price: 12 },
  boiled_boot: { name: 'Boiled Boot', heal: 45, price: 2 },
  ancient_sweet: { name: 'Ancient Sweet', heal: 85, price: 6 },
  slowfin_carp: { name: 'Slowfin Carp', heal: 215, price: 14 },
  // Saltcombe's Cockle Stall and Orla's Forge (Chapter 5). The best food of
  // chapter 4 heals 240; these climb a little past it.
  sea_biscuit: { name: 'Sea Biscuit', heal: 160, price: 90 },
  kelp_crisps: { name: 'Kelp Crisps', heal: 190, price: 115 },
  winkle_skewer: { name: 'Winkle Skewer', heal: 230, price: 140 },
  cockle_chowder: { name: 'Cockle Chowder', heal: 285, price: 185 },
  brine_tonic: { name: 'Brine Tonic', use: 'sp', amount: 110, price: 190 },
  tinder_bun: { name: 'Tinder Bun', heal: 250, price: 160 },
};

// How many items you can carry.
export const MAX_ITEMS = 12;
// The storage chests by every save point (see storageMenu.js) all hold the
// same things: whatever won't fit in your bag goes there, up to this many.
// There's more room each chapter: 60 in chapter 1, 80 in 2, 100 in 3...
export function maxStorage() {
  return 40 + 20 * (WORLD_STATE.chapter ?? 1);
}

// Puts an item in your bag, or if that's full, in storage. Returns true (in
// your bag), 'stored' (sent to storage), or false (no room anywhere).
export function giveItem(id) {
  if (!ITEMS[id]) throw new Error(`Unknown item '${id}'`);
  if (HERO_STATE.items.length < MAX_ITEMS) {
    HERO_STATE.items.push(id);
    return true;
  }
  HERO_STATE.storage ??= [];
  if (HERO_STATE.storage.length >= maxStorage()) return false;
  HERO_STATE.storage.push(id);
  return 'stored';
}

// Whether there's room for one more item, in your bag or in storage.
export function roomForItem() {
  return HERO_STATE.items.length < MAX_ITEMS || (HERO_STATE.storage ?? []).length < maxStorage();
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
