import { HERO_STATE } from '../characters/heroState.js';
import { hasGear } from './gear.js';

// THE FALLEN STAR: the sword in the stone in the Starfall Glade (the
// Hushwood's best-hidden secret), and the one weapon that grows with you.
// Each chapter, that chapter's smith can reforge it, once you've done them a
// small favour (usually: bring back a piece of the star that broke off when
// it came down). Every forging hits harder and calls down one more star with
// its soul ability, STARFALL (see src/battle/soulAbilities.js).
//
// HERO_STATE.starForged is how many times it's been reforged (0 when you
// pull it out of the stone). A forging with a `smith` is offered by that shop
// as a TALK topic (see ShopScene: `forge` in src/data/shops.js) once you own
// the sword, and done when you bring `needs` (a piece of GEAR, src/data/gear.js).
// The later ones are waiting for their chapters' smiths.
export const STAR_FORGINGS = [
  // Pulled from the stone (chapter 3): already the hardest hitter in the
  // chapter (the Sculptor's Mallet is 1.75).
  { name: 'Fallen Star', fightPower: 1.8, stars: 1 },
  // Teasel, in Lasthome, with the shard from the Registry: a secret way behind the Old
  // Street, guarded by QUIRE (src/data/enemies/tally.js), who holds it in her binding.
  { name: 'Fallen Star +1', fightPower: 2.05, stars: 2, chapter: 3, smith: 'lasthome_smithy', needs: 'star_shard' },
  // Hobnail, at the heat vent in Belowtown, with the shard from the Diggings.
  // 2.35 beats the best of chapter 4 (the Deepglass Blade is 2.25).
  { name: 'Fallen Star +2', fightPower: 2.35, stars: 3, chapter: 4, smith: 'hobnail_forge', needs: 'star_shard_deep' },
  // Orla Cobb, in the Beacon Isles, with the shard from the figurehead at the end of
  // the optional ghost ship (Madam Fairweather, the superboss). 2.7 beats the best of chapter 5 (the Stormglass Blade is 2.55).
  { name: 'Fallen Star +3', fightPower: 2.7, stars: 4, chapter: 5, smith: 'orla_forge', needs: 'star_shard_wreck' },
  // Chapter 6 onward: their smiths and favours aren't built yet.
  { name: 'Fallen Star +4', fightPower: 3.1, stars: 5, chapter: 6 },
];

export function starLevel() {
  return Math.max(0, Math.min(HERO_STATE.starForged ?? 0, STAR_FORGINGS.length - 1));
}

export function starForging() {
  return STAR_FORGINGS[starLevel()];
}

// Whether that smith's reforge is the next one and you've brought what it needs:
// the sword, the forging before it done, and the piece (`needs`) in your pockets.
// A room's cutscene trigger with `forge: '<shop id>'` only plays while this holds
// (Orla's: the reforge plays as you walk into her forge).
export function forgeReady(smith) {
  const index = STAR_FORGINGS.findIndex((f) => f.smith === smith);
  if (index <= 0) return false;
  return HERO_STATE.weapons.includes('fallen_star') && starLevel() === index - 1 && hasGear(STAR_FORGINGS[index].needs);
}

// Does that smith's reforge (the same as the shop's TALK topic): the piece goes
// into the sword. False, and nothing changes, if it isn't ready.
export function reforgeAt(smith) {
  if (!forgeReady(smith)) return false;
  const index = STAR_FORGINGS.findIndex((f) => f.smith === smith);
  HERO_STATE.gear = HERO_STATE.gear.filter((id) => id !== STAR_FORGINGS[index].needs);
  HERO_STATE.starForged = index;
  return true;
}
