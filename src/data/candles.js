import { HERO_STATE } from '../characters/heroState.js';
import { ITEMS, giveItem, roomForItem } from './items.js';

// Candle making. Enemies leave MATERIALS behind (their `materials` in
// src/data/enemies/), kept in a pouch that doesn't use up bag space; the
// CANDLES screen in the C menu turns them into candles (RECIPES), which are
// items like any other (src/data/items.js: each candle's `use` in battle and
// `light` in dark places). Descriptions live in text/items/materials.txt.

export const MATERIALS = {
  // `plural` is for "Got 2 ..." after a battle, where adding an s is wrong.
  wax: { name: 'Wax', plural: 'lumps of Wax' },
  thread: { name: 'Thread' },
  moonbell: { name: 'Moonbell Petal' },
  glow_dust: { name: 'Glow Dust', plural: 'pinches of Glow Dust' },
  shadow_ash: { name: 'Shadow Ash', plural: 'handfuls of Shadow Ash' },
};

// What each candle takes to make, in the order the CANDLES screen lists them.
export const RECIPES = [
  { candle: 'plain_candle', needs: { wax: 2, thread: 1 } },
  { candle: 'hearth_candle', needs: { wax: 4, thread: 2 } },
  { candle: 'moonbell_candle', needs: { wax: 2, thread: 1, moonbell: 2 } },
  { candle: 'glow_candle', needs: { wax: 2, thread: 1, glow_dust: 2 } },
  { candle: 'ash_candle', needs: { wax: 2, thread: 1, shadow_ash: 2 } },
];

export function materialCount(id) {
  return HERO_STATE.materials?.[id] ?? 0;
}

export function giveMaterial(id, amount = 1) {
  if (!MATERIALS[id]) throw new Error(`Unknown material '${id}'`);
  HERO_STATE.materials ??= {};
  HERO_STATE.materials[id] = materialCount(id) + amount;
}

export function canMake(recipe) {
  return Object.entries(recipe.needs).every(([id, amount]) => materialCount(id) >= amount);
}

// Makes the candle, if you have what it takes and room for it (in your bag,
// or in storage). Returns 'made', 'stored' (made, and sent to storage, your
// bag being full), 'missing' (not enough materials) or 'full' (no room).
export function makeCandle(recipe) {
  if (!canMake(recipe)) return 'missing';
  if (!roomForItem()) return 'full';
  for (const [id, amount] of Object.entries(recipe.needs)) HERO_STATE.materials[id] -= amount;
  return giveItem(recipe.candle) === 'stored' ? 'stored' : 'made';
}

// --- Light, for dark places (rooms with `dark`, see overworldScene.js). ---

// Your shadow's own faint glow, when you've no candle lit.
export const SOUL_LIGHT = 18;

// The candle you'd light: the brightest one in your bag.
export function bestCandle() {
  return HERO_STATE.items
    .filter((id) => ITEMS[id].light)
    .sort((a, b) => ITEMS[b].light.radius - ITEMS[a].light.radius)[0] ?? null;
}

// Burns your lit candle for `dt` seconds in the dark, lighting one if none is.
// When it burns out it's gone from your bag, and the next one is lit. Returns
// what happened, for a message: null, or { lit } / { out, next }.
export function burnCandle(dt) {
  const lit = HERO_STATE.lit;
  if (!lit || !HERO_STATE.items.includes(lit.id)) {
    const id = bestCandle();
    HERO_STATE.lit = id ? { id, left: ITEMS[id].light.burn } : null;
    return id && (!lit || lit.id !== id) ? { lit: id } : null;
  }
  // One that never goes out (Taper's) never burns down.
  if (ITEMS[lit.id].light.burn === Infinity) return null;
  lit.left -= dt;
  if (lit.left > 0) return null;
  HERO_STATE.items.splice(HERO_STATE.items.indexOf(lit.id), 1);
  const next = bestCandle();
  HERO_STATE.lit = next ? { id: next, left: ITEMS[next].light.burn } : null;
  return { out: lit.id, next };
}

// How far your light reaches right now, in pixels.
export function lightRadius() {
  const lit = HERO_STATE.lit;
  return lit && HERO_STATE.items.includes(lit.id) ? ITEMS[lit.id].light.radius : SOUL_LIGHT;
}
