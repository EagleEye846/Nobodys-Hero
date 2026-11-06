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
  // Chapter 4: the second piece, deep in the Diggings. Hobnail can reforge the
  // sword with it (fallenStar.js).
  star_shard_deep: { name: 'Deep Star Shard' },
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
  // CHAPTER 5, the drowned coast.
  // The star shard on the Wreck Yard's snapped mast. Orla Cobb can reforge the
  // sword with it (fallenStar.js).
  star_shard_wreck: { name: 'Wreck Star Shard' },
  // Haddock's brass handbell, on its cord. He hands it to the hero before the
  // boss and it is never given back; ringing it is an ACT in Corrie's fight.
  haddocks_bell: { name: "Haddock's Bell" },
  // The Dowager Crab's drop: a key in the Wrack Shore.
  bathtub_bell: { name: 'Bathtub Bell' },
  // Old Gulper's drop (Merrow is on hold; the item is waiting).
  gulper_tooth: { name: 'Gulper Tooth' },
  // The Soundings' boss key.
  brass_sounding_weight: { name: 'Brass Sounding-Weight' },
  // Bramble's, from Haddock after the swimming lesson. A keepsake.
  paper_boat: { name: 'Paper Boat' },
  // Left in the tower. Its last line is the date and one word. A keepsake.
  // (There is no menu for keepsakes, so a room reads it out: [haddocks_ledger_read]
  // in text/interactions/gear.txt.)
  haddocks_ledger: { name: "Haddock's Ledger" },
};

export function hasGear(id) {
  return (HERO_STATE.gear ?? []).includes(id);
}

export function giveGear(id) {
  if (!GEAR[id]) throw new Error(`Unknown gear '${id}'`);
  HERO_STATE.gear ??= [];
  if (!HERO_STATE.gear.includes(id)) HERO_STATE.gear.push(id);
}
