import { ITEMS } from '../data/items.js';

// Enemies that steal. An enemy with
//   steals: { on: ['attackName', ...], max: 1, verb: 'snatches' }
// takes one common consumable (food: an item that heals and isn't a candle
// or a guard) out of the bag when you're hit during one of those attacks. It
// keeps hold of it (foe.held) until it is beaten or spared, or a TALK option
// with `giveBack: true` talks it into handing it over. Run away and it keeps
// it for good. Nothing else is needed in a room or a text file except the
// enemy's own [steal] and [giveBack] lines (see text/enemies/gullion.txt).

const isCommon = (id) => Boolean(ITEMS[id]?.heal) && !ITEMS[id].use && !ITEMS[id].light;

// After an enemy turn: did `foe` snatch something? Returns the message, or null.
export function stealCheck(scene, foe, hit) {
  const rule = foe.data.steals;
  if (!rule || !hit || foe.state !== 'active') return null;
  if (!rule.on.includes(foe.lastPattern)) return null;
  foe.held ??= [];
  if (foe.held.length >= (rule.max ?? 1)) return null;
  const choices = scene.items.map((id, i) => [id, i]).filter(([id]) => isCommon(id));
  if (!choices.length) return null;
  const [id, index] = choices[Math.floor(Math.random() * choices.length)];
  scene.items.splice(index, 1);
  foe.held.push(id);
  const line = scene.foeLine(foe, 'steal').replace('{item}', ITEMS[id].name);
  return line;
}

// Hands everything back to the bag. Returns a line to add to the message, or ''.
export function giveBack(scene, foe) {
  if (!foe.held?.length) return '';
  const names = foe.held.map((id) => ITEMS[id].name);
  scene.items.push(...foe.held);
  foe.held = [];
  return `You get your ${names.join(' and ')} back.`;
}
