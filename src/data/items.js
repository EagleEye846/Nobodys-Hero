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
