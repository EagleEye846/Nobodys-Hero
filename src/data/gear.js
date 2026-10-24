import { HERO_STATE } from '../characters/heroState.js';

// Gear: things for getting around the world that you keep for good, like the
// Climbing Rope. They don't take bag space and can't be eaten or dropped.
// Something in a room hands one over with `gives`, like an item; the words
// you see when you get it are the [got_<id>] section of text/interactions/gear.txt.
export const GEAR = {
  // Climb cliffs that have an iron ring at the top (`grapple` props).
  climbing_rope: { name: 'Climbing Rope' },
  // Chapter 3: what Ves left on the way down, found as you search for her.
  // Keepsakes: they don't do anything, but you keep them.
  ves_mitten: { name: "Ves's Mitten" },
  ves_ribbon: { name: "Ves's Ribbon" },
  ves_scarf: { name: "Ves's Scarf" },
  // Bramble gives you this when he goes home from Lasthome.
  bramble_whistle: { name: "Bramble's Whistle" },
  // A piece of the Fallen Star that broke off as it came down, on the Old
  // Street's raised steps, just through Lasthome's far door. Teasel can reforge the sword with it (fallenStar.js).
  star_shard: { name: 'Star Shard' },
};

export function hasGear(id) {
  return (HERO_STATE.gear ?? []).includes(id);
}

export function giveGear(id) {
  if (!GEAR[id]) throw new Error(`Unknown gear '${id}'`);
  HERO_STATE.gear ??= [];
  if (!HERO_STATE.gear.includes(id)) HERO_STATE.gear.push(id);
}
