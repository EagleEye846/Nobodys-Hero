import { HERO_STATE } from '../characters/heroState.js';

// Things you can carry and eat in battle (ITEMS). Descriptions live in
// text/items/items.txt, one section per id. `heal` is HP restored (a big
// number heals you fully); `price` is what shops charge, if they sell it.
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
  taper_stub: { name: "Taper's Candle", heal: 999 },
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

// "+40 HP", or "Full HP" for the ones that heal everything.
export const healLabel = (id) => (ITEMS[id].heal >= 999 ? 'Full HP' : `+${ITEMS[id].heal} HP`);
