import { HERO_STATE } from '../characters/heroState.js';
import { textFile } from '../engine/textLoader.js';
import { COLLECTION_GEAR } from './collections.js';

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
  // secret superboss the Pale Olm keeps it (src/data/rooms/diggingsStarPool.js). Hobnail can
  // reforge the sword with it (fallenStar.js).
  star_shard_deep: { name: 'Deep Star Shard' },
  // Chapter 4, the life pass: three tiny errands in the caves. Each is a thing you find and carry to
  // whoever lost it (the frog kids on the King's Road and the Far Shore, the Hero's camp), and a
  // keepsake back. Nothing in them is needed for anything else.
  dab_tin: { name: "Dab's Sweet Tin" },
  lucky_pebble: { name: 'Lucky Pebble' },
  paper_boat: { name: 'Paper Boat' },
  skipping_stone: { name: 'Skipping Stone' },
  hero_mitten: { name: 'Patched Mitten' },
  hero_wrapper: { name: 'Folded Wrapper' },
  // Chapter 2, the life pass (round 2): tiny errands in Heralds' Rest, on the Goat Track and in the ice caves.
  r2r_toy_trumpet: { name: 'Dot\'s Toy Trumpet' },
  r2r_dot_drawing: { name: 'Dot\'s Drawing' },
  r2r_edelweiss: { name: 'Tuft of Edelweiss' },
  r2r_marmot_whistle: { name: 'Marmot\'s Whistle' },
  r2r_red_mitten: { name: 'Little Red Mitten' },
  r2r_hare_print: { name: 'Hare\'s Pawprint' },
  // Chapter 4, the secret under Seam Nine: the seventh shift's end-of-shift whistle, taken
  // apart in three so nobody could blow it by habit. Each piece is hidden in a different
  // place in the chapter (Glimmering, Belowtown, Stillwater); all three, put together at
  // the sealed crack in Seam Nine, open the way down (diggingsLostSeam.js, whistle_blown).
  whistle_pea: { name: 'Whistle Pea' },
  whistle_mouth: { name: 'Whistle Mouthpiece' },
  whistle_barrel: { name: 'Whistle Barrel' },
  // The three pieces put together at the crack (whistle_blown). It is the TALK's own
  // "Blow the shift whistle" with the Pale Olm (src/data/enemies/pudding.js).
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
  // The Sunken Lanes and the Soundings (life pass): a tin of bait for the fishing gnome, and a sounder's pail for his hook.
  lane_worm: { name: 'Bait Tin' },
  gnome_catch: { name: "Gnome's Catch" },
  // Chapter 3's Pinefall and Hollin (life pass): a fallen robin's nest, the feather for putting it back; a doll, a rattle, a den's marbles.
  fallen_nest: { name: "Robin's Nest" },
  robins_feather: { name: "Robin's Feather" },
  hollin_doll: { name: 'Rag Doll' },
  hollin_rattle: { name: 'Wooden Rattle' },
  hollin_marbles: { name: 'Handful of Marbles' },
  // Chapter 3's Old Drains and Lantern Marsh (life pass): a lost boot for Ladle's shelf, a tag for it, a moorhen's egg and a feather.
  lost_boot: { name: 'Left Boot' },
  ladles_tag: { name: "Ladle's Tag" },
  moorhen_egg: { name: 'Speckled Egg' },
  moorhen_feather: { name: "Moorhen's Feather" },
  marrow_pail: { name: "Marrow's Pail" },
  // Chapter 4's hidden corners (life pass): small keepsakes.
  bl_curator_iou: { name: "Curator's IOU" },
  bl_den_shoe: { name: 'Den Shoe' },
  glow_pebble: { name: 'Glow Pebble' },
  fish_skull_weight: { name: 'Fish-Skull Weight' },
  marrow_pail: { name: "Marrow's Pail" },
  marrow_whistle: { name: "Marrow's Whistle" },
  biscuit: { name: 'Biscuit' },
  bean_medal: { name: 'Bean Medal' },
  thistle_hat: { name: "Thistle's Hat" },
  herald_button: { name: "Herald's Button" },
  // Belowtown: a letter for Mattock, and a very slow toffee.
  mattock_letter: { name: 'Letter for Mattock' },
  mattock_reply: { name: "Mattock's Reply" },
  // The life pass: Mattock's lost left boot (found in the Flooded Drift's nook), and his thanks.
  mattock_boot: { name: "Mattock's Boot" },
  mattock_pin: { name: "Mattock's Hat Pin" },
  sunstone_stamp: { name: 'Sunstone Stamp' },
  slow_toffee: { name: 'Slow Toffee' },
  warm_teacup: { name: 'Spare Teacup' },
  // Belowtown life pass: the sweeper's dustpan and her thanks, the odd sock for the newt guard and his badge.
  dented_dustpan: { name: 'Dented Dustpan' },
  sweepers_pin: { name: "Sweeper's Pin" },
  odd_sock: { name: 'Odd Sock' },
  newt_badge: { name: "Honorary Guard's Badge" },
  // Chapter 5: a jar of sea for Tolliver (Gullrest's lobster pots to the Last
  // Farm), and the harbour clerk's stamp (a gull's stash on the quay's crates).
  jar_of_sea: { name: 'Jar of Sea' },
  // The Wrack Shore's hermit crab and the Wreck Yard's empty chair (the life pass, 2026-11-14).
  big_whelk: { name: 'Big Whelk Shell' },
  little_old_shell: { name: 'Little Old Shell' },
  duncans_pipe: { name: "Duncan's Pipe" },
  duncans_chalk: { name: "Duncan's Chalk" },
  // Chapter 3's tiny errands (the life pass, round 2): a chewed float for the eel-fisher, a chair for the laid table,
  // a loose page for the pigeonholes, a wooden duck for the baths; and what each earns.
  lp3_red_float: { name: 'Chewed Red Float' },
  fishers_knot: { name: "Fisher's Knot" },
  lp3_street_chair: { name: 'Plain Chair' },
  heros_place_card: { name: "The Hero's Place Card" },
  lp3_page: { name: 'Loose Page (W)' },
  clerks_blotter: { name: "Clerk's Blotter" },
  lp3_duck: { name: 'Wooden Duck' },
  slowlys_boat: { name: "Slowly's Boat" },
  turnip_rosette: { name: 'Turnip Rosette' },
  approved_stamp: { name: 'APPROVED Stamp' },
  harbour_pass: { name: 'Harbour Pass' },
  // The life pass: Skerry's lost cat (found asleep behind the lagoon's crates), his medal, and Tibby's bucket and spade (the cove's sea floor), her flag.
  pilchard_cat: { name: 'Pilchard (asleep)' },
  bottle_top_medal: { name: 'Bottle-Top Medal' },
  pips_bucket: { name: "Tibby's Bucket and Spade" },
  sandcastle_flag: { name: 'Sandcastle Flag' },
  // Sunnyside's life pass: Burdock the mole's spectacles (the hedge alcove by the Mill Pond) and his button.
  mole_specs: { name: "Burdock's Spectacles" },
  burdocks_button: { name: "Burdock's Button" },
  // "A Shelf for the Tankard" (the Drowned Rat's innkeeper; the reef after the storm).
  storm_glass: { name: 'Stormglass Bead' },
  polished_tankard: { name: 'Polished Tankard' },
  // The life pass (2026-11-14): three tiny errands out on the isles, the tower and the Reach. The carried
  // thing, then the keepsake it earns.
  // Chapter 1's life pass (15 November 2026): Fennel's lost button and the thumb scarf she pays in; Taper's packet marked LATER.
  r1_button: { name: 'Brass Button' },
  mouse_scarf: { name: 'Thumb Scarf' },
  r1_later_seeds: { name: 'Packet Marked LATER' },
  lp5_logbook_page: { name: 'Torn Logbook Page' },
  keepers_pencil: { name: "Keeper's Pencil" },
  lp5_kettle: { name: 'Old Iron Kettle' },
  trimmed_wick: { name: 'Spare Wick' },
  lp5_souwester: { name: "Yellow Sou'wester" },
  gull_feather: { name: "Gull's Feather" },
  // The life pass, round 2: Billy's whale from the gun deck goes to his hammock, and a curl of whittling comes back.
  r5g_whale: { name: 'Half-Carved Whale' },
  r5g_shaving: { name: 'Curl of Whittling' },
  // The life pass on Mount Vigil (2026-11-15): a torn prayer flag (carried to the bare pole on the Lamplighter's Ledge)
  // and what the pole gives back; the stoat's thimble from the hoard at the west end of the Cloud Walk.
  r2v_flag_rag: { name: 'Torn Prayer Flag' },
  r2v_pilgrim_ribbon: { name: "Pilgrim's Ribbon" },
  stoat_shinies: { name: "Stoat's Thimble" },
  // The life pass, round 2: the Hushwood (a tea tin for Nan Cinder's shelf, and three keepsakes).
  lp3h_tea_tin: { name: 'Dented Tea Tin' },
  lp3h_charcoal: { name: "Nan's Charcoal Stick" },
  lp3h_acorn: { name: 'Gold Acorn' },
  lp3h_quiet_feather: { name: 'Quiet Feather' },
  // CHAPTER 5, the drowned coast.
  // The star shard from the figurehead of the ghost ship (the superboss, optional: ship_figurehead_perch). Orla Cobb can reforge the
  // sword with it (fallenStar.js).
  star_shard_wreck: { name: 'Wreck Star Shard' },
  // Haddock's brass handbell, on its cord. He hands it to the hero before the
  // boss and it is never given back; ringing it is an ACT in Corrie's fight.
  haddocks_bell: { name: "Haddock's Bell" },
  // The Dowager Crab's drop: a key in the Wrack Shore.
  bathtub_bell: { name: 'Bathtub Bell' },
  // CHAPTER 6, the Ash Road. The Lum's, given by the scene after its fight, beaten
  // or spared: a brick out of its hearth that stays warm. A keepsake (draft).
  hearth_brick: { name: 'Hearth Brick' },
  // Chapter 6, the Ash Road (life pass): the red rags Bramble takes off the spare cairns (five of them, loose
  // pages of the set `bramble_rags`, never listed on their own), and what he makes of them at the waystation.
  ash_rag_1: { name: 'Red Rag', hidden: true },
  ash_rag_2: { name: 'Red Rag', hidden: true },
  ash_rag_3: { name: 'Red Rag', hidden: true },
  ash_rag_4: { name: 'Red Rag', hidden: true },
  ash_rag_5: { name: 'Red Rag', hidden: true },
  bell_pennant: { name: 'Bell Pennant' },
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
  // The captain's own book (2026-11-14), left on his chart table once he's been dealt with: what's at the bow, how the
  // hatch opens, and where each of the compass's pieces went. A keepsake you read (`reads`), and it comes whole
  // (`whole`: every page is in it; the pages are never given or listed on their own).
  captains_book: { name: "Captain's Book", reads: 'captains_book', whole: true },
  captains_book_bow: { name: 'The Bow', hidden: true },
  captains_book_hatch: { name: 'The Hatch', hidden: true },
  captains_book_glass: { name: 'The Glass', hidden: true },
  captains_book_needle: { name: 'The Needle', hidden: true },
  captains_book_card: { name: 'The Card', hidden: true },
  // THE WAY TO THE SHIP (optional, secret): five pages torn out of the Fair Return's log. The first four came ashore in
  // bottles, the night she struck; the fifth washes up on the Saltcombe quay once you hold the other four, and says
  // where her fog bell went. Each page is gear (for the triggers and the "N of five" line) but is never listed on
  // its own (`hidden`): picking one up also gives the book, the TORN LOG PAGES keepsake (`book`), which reads the
  // pages you have (`reads`: Z on it in the KEEPSAKES page, see itemsMenu.js).
  log_page_1: { name: 'Log Page (Day 1)', hidden: true, book: 'torn_log' },
  log_page_2: { name: 'Log Page (Day 19)', hidden: true, book: 'torn_log' },
  log_page_3: { name: 'Log Page (Day 38)', hidden: true, book: 'torn_log' },
  log_page_4: { name: 'Log Page (Day 41)', hidden: true, book: 'torn_log' },
  log_page_5: { name: 'Log Page (Day 41, again)', hidden: true, book: 'torn_log' },
  torn_log: { name: 'Torn Log Pages', reads: 'log_pages' },
  // The fog bell's clapper (its tongue), taken out so nobody could ring the Fair Return in: the Drowned Rat's doorstop.
  // Hung back in the bell on the Watch Rock (scene clapper_fitted), it is gone from your pack.
  bell_clapper: { name: "Fog Bell's Tongue" },
  // Bramble's (draft, 2026-11-14): the Fair Return's ship's boy made it for his first voyage, and gave it to
  // Bramble on her deck (scene bramble_and_the_boy). A keepsake.
  monkeys_fist: { name: "Monkey's Fist" },

  // NOTCH CHARMS (src/characters/notches.js): a charm on a cord with one notch
  // cut in it. Each is one more SPELL NOTCH for everyone in the party: one more
  // spell each can carry into a fight. Sold by each chapter's smith (the Ruins
  // Shop in chapter 1), and a few hidden in chests that take some reaching.
  notch_ruins: { name: 'Chipped Notch Charm' },
  notch_tilda: { name: 'Iron Notch Charm' },
  notch_high_shelf: { name: "Climber's Notch Charm" },
  notch_teasel: { name: 'Bell-Bronze Notch Charm' },
  notch_hobnail: { name: 'Slag-Glass Notch Charm' },
  notch_orla: { name: 'Lamp-Brass Notch Charm' },
  notch_hulk: { name: 'Driftwood Notch Charm' },

  // The collectible sets (src/data/collections.js): each piece (hidden) and each set's keepsake.
  ...COLLECTION_GEAR,
};

// The secret quests' pieces, gathered one at a time. Picking one up adds a line saying how many
// of the set you have now ([<set>_1], [<set>_2], [<set>_3] in text/interactions/gear.txt; see
// takeGift in overworldScene.js). Chapter 3: the Register's leaves; chapter 4: the shift whistle.
export const GEAR_SETS = {
  register_leaves: ['register_leaf_names', 'register_leaf_hours', 'register_leaf_seal'],
  whistle_pieces: ['whistle_pea', 'whistle_mouth', 'whistle_barrel'],
  // Chapter 6: the red rags off the Ash Road's spare cairns (Bramble's errand; all five make the bell pennant).
  bramble_rags: ['ash_rag_1', 'ash_rag_2', 'ash_rag_3', 'ash_rag_4', 'ash_rag_5'],
  // Chapter 5: the Fair Return's binnacle compass (the ghost ship's deep part). The binnacle in the captain's cabin
  // (`pieces: 'compass_pieces'`) also says which you have and hints at the rest (lookWithPieces in overworldScene.js).
  compass_pieces: ['compass_glass', 'compass_needle', 'compass_card'],
  // Chapter 5: the Fair Return's torn log (the way to the ship). Read in order on the TORN LOG PAGES keepsake.
  log_pages: ['log_page_1', 'log_page_2', 'log_page_3', 'log_page_4', 'log_page_5'],
  // Chapter 5: the captain's book (all of it at once: `whole`).
  captains_book: ['captains_book_bow', 'captains_book_hatch', 'captains_book_glass', 'captains_book_needle', 'captains_book_card'],
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
