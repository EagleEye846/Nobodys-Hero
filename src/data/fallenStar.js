import { HERO_STATE } from '../characters/heroState.js';

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
  // Teasel, in Lasthome, with the shard on the Old Street's raised steps,
  // just through the far door.
  { name: 'Fallen Star +1', fightPower: 2.05, stars: 2, chapter: 3, smith: 'lasthome_smithy', needs: 'star_shard' },
  // Chapter 4 onward: their smiths and favours aren't built yet.
  { name: 'Fallen Star +2', fightPower: 2.35, stars: 3, chapter: 4 },
  { name: 'Fallen Star +3', fightPower: 2.7, stars: 4, chapter: 5 },
  { name: 'Fallen Star +4', fightPower: 3.1, stars: 5, chapter: 6 },
];

export function starLevel() {
  return Math.max(0, Math.min(HERO_STATE.starForged ?? 0, STAR_FORGINGS.length - 1));
}

export function starForging() {
  return STAR_FORGINGS[starLevel()];
}
