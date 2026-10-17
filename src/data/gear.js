import { HERO_STATE } from '../characters/heroState.js';

// Gear: things for getting around the world that you keep for good, like the
// Climbing Rope. They don't take bag space and can't be eaten or dropped.
// Something in a room hands one over with `gives`, like an item; the words
// you see when you get it are the [got_<id>] section of text/interactions/gear.txt.
export const GEAR = {
  // Climb cliffs that have an iron ring at the top (`grapple` props).
  climbing_rope: { name: 'Climbing Rope' },
};

export function hasGear(id) {
  return (HERO_STATE.gear ?? []).includes(id);
}

export function giveGear(id) {
  if (!GEAR[id]) throw new Error(`Unknown gear '${id}'`);
  HERO_STATE.gear ??= [];
  if (!HERO_STATE.gear.includes(id)) HERO_STATE.gear.push(id);
}
