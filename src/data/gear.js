import { HERO_STATE } from '../characters/heroState.js';
import { textFile } from '../engine/textLoader.js';

// Gear: things for getting around the world that you keep for good, like the
// Climbing Rope. They don't take bag space and can't be eaten or dropped.
// Something in a room hands one over with `gives`, like an item; the words
// you see when you get it are the [got_<id>] section of text/interactions/gear.txt.
// The KEEPSAKES page (SPACE in the ITEMS menu) lists everything you have here,
// with keepsakeText() under it.
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
  // A piece of the Fallen Star that broke off as it came down on the Old Street's
  // steps, and woke Quire, the Welcome Register, in the Registry behind them (a secret:
  // src/data/enemies/tally.js). Teasel can reforge the sword with it (fallenStar.js).
  // THE QUEST for the Registry (chapter 3's secret superboss, Quire): three leaves torn out of the Welcome
  // Register the night the star fell, blown to three places in the chapter. All three, and the sword, and the sealed
  // cleft off the Old Street lets go (src/data/rooms/hollinBackroom.js, marshClerksIslet.js, bathsStokehold.js).
  register_leaf_names: { name: 'Leaf of Names' },
  register_leaf_hours: { name: 'Leaf of Hours' },
  register_leaf_seal: { name: 'Leaf of the Seal' },
  star_shard: { name: 'Star Shard' },
  // Chapter 4: the second piece, at the bottom of Seam Nine's crack in the Diggings: the
  // secret superboss Pudding keeps it (src/data/rooms/diggingsStarPool.js). Hobnail can
  // reforge the sword with it (fallenStar.js).
  star_shard_deep: { name: 'Deep Star Shard' },
  // Chapter 4, the secret under Seam Nine: the seventh shift's end-of-shift whistle, taken
  // apart in three so nobody could blow it by habit. Each piece is hidden in a different
  // place in the chapter (Glimmering, Belowtown, Stillwater); all three, put together at
  // the sealed crack in Seam Nine, open the way down (diggingsLostSeam.js, whistle_blown).
  whistle_pea: { name: 'Whistle Pea' },
  whistle_mouth: { name: 'Whistle Mouthpiece' },
  whistle_barrel: { name: 'Whistle Barrel' },
  // The three pieces put together at the crack (whistle_blown). It is the TALK's own
  // "Blow the shift whistle" with Pudding (src/data/enemies/pudding.js).
  shift_whistle: { name: 'Shift Whistle' },
  // Chapter 4: King Peptup's paper crown, left on the stage after the duel (a
  // keepsake; the scene after the duel gives it).
  paper_crown: { name: 'Spare Paper Crown' },
  // Chapter 4: a splinter of the King's Road crystals, a secret for anyone who
  // rings them in order. Carry it and your footsteps in the Glimmering ring
  // out the chapter's tune, one note a step (chimes.js). Nothing else.
  singing_shard: { name: 'Singing Shard' },
  // Chapter 4: the rare catch from Gubb's rod on the Stillwater (fishingScene.js). A keepsake.
  pearl_button: { name: 'Pearl Button' },

  // SIDE QUESTS (src/data/quests.js). Things carried between people (they leave
  // your pockets when handed over) and the keepsakes the errands pay in; the
  // keepsakes do nothing, but you keep them.
  // Heralds' Rest: Bram's trumpet, and Marta's mittens for Dunstan.
  bram_trumpet: { name: "Bram's Trumpet" },
  fanfare_pin: { name: 'Fanfare Pin' },
  marta_mittens: { name: "Marta's Mittens" },
  dunstan_note: { name: "Dunstan's Note" },
  marta_scarf: { name: "Marta's Seventh Scarf" },
  // Lasthome: the bell's clapper, Wren's cat, Thistle's hat.
  bell_clapper: { name: 'Bell Clapper' },
  bell_spoon: { name: 'Bell-Metal Spoon' },
  biscuit: { name: 'Biscuit' },
  bean_medal: { name: 'Bean Medal' },
  thistle_hat: { name: "Thistle's Hat" },
  herald_button: { name: "Herald's Button" },
  // Belowtown: a letter for Mattock, and a very slow toffee.
  mattock_letter: { name: 'Letter for Mattock' },
  mattock_reply: { name: "Mattock's Reply" },
  sunstone_stamp: { name: 'Sunstone Stamp' },
  slow_toffee: { name: 'Slow Toffee' },
  warm_teacup: { name: 'Spare Teacup' },
  // Chapter 5: a jar of sea for Tolliver (Gullrest's lobster pots to the Last
  // Farm), and the harbour clerk's stamp (a gull's stash on the quay's crates).
  jar_of_sea: { name: 'Jar of Sea' },
  turnip_rosette: { name: 'Turnip Rosette' },
  approved_stamp: { name: 'APPROVED Stamp' },
  harbour_pass: { name: 'Harbour Pass' },
  // "A Shelf for the Tankard" (the Drowned Rat's innkeeper; the reef after the storm).
  storm_glass: { name: 'Stormglass Bead' },
  polished_tankard: { name: 'Polished Tankard' },
  // CHAPTER 5, the drowned coast.
  // The star shard from the figurehead of the ghost ship (the superboss, optional: ship_figurehead_perch). Orla Cobb can reforge the
  // sword with it (fallenStar.js).
  star_shard_wreck: { name: 'Wreck Star Shard' },
  // Haddock's brass handbell, on its cord. He hands it to the hero before the
  // boss and it is never given back; ringing it is an ACT in Corrie's fight.
  haddocks_bell: { name: "Haddock's Bell" },
  // The Dowager Crab's drop: a key in the Wrack Shore.
  bathtub_bell: { name: 'Bathtub Bell' },
  // Old Gulper's drop in Merrow: it opens the sea gate on to the Soundings.
  gulper_tooth: { name: 'Gulper Tooth' },
  // The Soundings' boss key.
  brass_sounding_weight: { name: 'Brass Sounding-Weight' },
  // Bramble's, from Haddock after the swimming lesson. A keepsake.
  paper_boat: { name: 'Paper Boat' },
  // Left in the tower. Its last line is the date and one word. A keepsake.
  // The room it's in also reads the last page out: [haddocks_ledger_read] in
  // text/interactions/gear.txt.)
  haddocks_ledger: { name: "Haddock's Ledger" },
  // The ghost ship (the brig Fair Return, area `ghostship`). The lantern: L puts it out and lights it (src/overworld/haunt.js).
  ship_lantern: { name: "Ship's Lantern" },
  // From the bilge: it opens the captain's cabin door on the deck.
  captains_key: { name: "Captain's Key" },
  // Keepsakes for the captain: a mother's letter (the crew's quarters), the log (the crow's nest), the unsent post (the purser's locker).
  crew_letter: { name: "A Mother's Letter" },
  ship_log: { name: "Ship's Log" },
  unsent_letters: { name: 'Unsent Letters' },
  // THE QUEST for the ghost ship's deep part (superboss, optional): the binnacle compass of the Fair Return, in three pieces lost
  // in three secret places along the coast (src/data/rooms/ship_cabin: the binnacle). All three, and the hatch's way opens.
  compass_glass: { name: 'Compass Glass' },
  compass_needle: { name: 'Compass Needle' },
  compass_card: { name: 'Compass Card' },
};

// The secret quests' pieces, gathered one at a time. Picking one up adds a line saying how many
// of the set you have now ([<set>_1], [<set>_2], [<set>_3] in text/interactions/gear.txt; see
// takeGift in overworldScene.js). Chapter 3: the Register's leaves; chapter 4: the shift whistle.
export const GEAR_SETS = {
  register_leaves: ['register_leaf_names', 'register_leaf_hours', 'register_leaf_seal'],
  whistle_pieces: ['whistle_pea', 'whistle_mouth', 'whistle_barrel'],
  // Chapter 5: the Fair Return's binnacle compass (the ghost ship's deep part). The binnacle in the captain's cabin
  // (`pieces: 'compass_pieces'`) also says which you have and hints at the rest (lookWithPieces in overworldScene.js).
  compass_pieces: ['compass_glass', 'compass_needle', 'compass_card'],
};

const GEAR_TEXT = 'interactions/gear.txt';

// (A list of ids: every one of them, for a trigger that wants a whole set.)
export function hasGear(id) {
  return [id].flat().every((one) => (HERO_STATE.gear ?? []).includes(one));
}

export function giveGear(id) {
  if (!GEAR[id]) throw new Error(`Unknown gear '${id}'`);
  HERO_STATE.gear ??= [];
  if (!HERO_STATE.gear.includes(id)) HERO_STATE.gear.push(id);
}

// What the KEEPSAKES page says about a thing you carry: its [about_<id>] in
// text/interactions/gear.txt if it has one, or else the words you got it with,
// less the first line ("You got the ...").
export function keepsakeText(id) {
  const file = textFile(GEAR_TEXT);
  const about = file[`about_${id}`];
  if (about?.length) return about.join(' ');
  return (file[`got_${id}`] ?? []).slice(1).join(' ');
}
