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
  // Found and given.
  candle_cake: { name: 'Candle Cake', heal: 70 },
  // Taper's candle "won't go out on you": it lights the dark forever.
  taper_stub: { name: "Taper's Candle", heal: 999, light: { radius: 72, burn: Infinity } },
  // Candles you make.
  plain_candle: { name: 'Plain Candle', heal: 25, light: { radius: 44, burn: 180 } },
  hearth_candle: { name: 'Hearth Candle', heal: 60, light: { radius: 54, burn: 240 } },
  moonbell_candle: { name: 'Moonbell Candle', use: 'calm', amount: 20, light: { radius: 52, burn: 200 } },
  glow_candle: { name: 'Glow Candle', use: 'sp', amount: 35, light: { radius: 84, burn: 360 } },
  ash_candle: { name: 'Ash Candle', use: 'guard', light: { radius: 36, burn: 420 } },
};

// How many items you can carry.
export const MAX_ITEMS = 8;

// Puts an item in your bag. Returns false if the bag is full.
export function giveItem(id) {
  if (!ITEMS[id]) throw new Error(`Unknown item '${id}'`);
  if (HERO_STATE.items.length >= MAX_ITEMS) return false;
  HERO_STATE.items.push(id);
  return true;
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
