import { HERO_STATE } from '../characters/heroState.js';

// THE COLLECTIONS: one small set to find in each of chapters 1 to 6, tucked into corners of
// the rooms. Picking a piece up says a line about it, how many of the set you have ("Sea glass:
// 4 of 10"), and Ves or Bramble says something (src/overworld/collecting.js). The last piece of a
// set gives a small reward: a keepsake and a little gold. The JOURNAL page shows each set (Z there
// turns to it: src/ui/journalMenu.js).
//
// A piece is a prop in a room: `{ sprite: 'col_token', x, y, walkable: true, flat: true,
// gives: '<piece id>', taken: { gone: true } }`. Each piece is a hidden piece of gear (nothing
// shows on the KEEPSAKES page for it; the set's reward does). Its words are in
// text/interactions/collections.txt: [<id>] what you find, [<id>_ves] or [<id>_bramble] what the
// friend says (only if they're with you), and [<set>_done] for the end of the set.
//
// `who` is the one who answers: 'ves' or 'bramble'. Chapter 4 is Ves only (Bramble isn't
// in the party). `room` is where it lies (the room's id), for the journal's hint once found.
// Gold stays small (chapter 4's shops sell ~4.9k; see the gold economy note).
export const COLLECTIONS = {
  // Chapter 1 has no companions: the words are plain narration ("you"), nobody answers.
  charms: {
    chapter: 1,
    title: 'WELCOME CHARMS',
    count: 'Welcome charms',
    reward: { gear: 'charm_cord', gold: 60 },
    pieces: [
      { id: 'charm_sun', name: 'Sun Charm', who: null, sprite: 'col_charm_sun', room: 'ruins_entrance', spot: [1, 18] },
      { id: 'charm_moon', name: 'Moon Charm', who: null, sprite: 'col_charm_moon', room: 'way_out', spot: [1, 7] },
      { id: 'charm_star', name: 'Star Charm', who: null, sprite: 'col_charm_star', room: 'flower_room', spot: [1, 13] },
      { id: 'charm_leaf', name: 'Leaf Charm', who: null, sprite: 'col_charm_leaf', room: 'pillar_room', spot: [1, 9] },
      { id: 'charm_key', name: 'Key Charm', who: null, sprite: 'col_charm_key', room: 'lantern_hall', spot: [1, 14] },
      { id: 'charm_bell', name: 'Bell Charm', who: null, sprite: 'col_charm_bell', room: 'taper_hall', spot: [2, 10] },
      { id: 'charm_flame', name: 'Flame Charm', who: null, sprite: 'col_charm_flame', room: 'taper_home', spot: [1, 12] },
      { id: 'charm_feather', name: 'Feather Charm', who: null, sprite: 'col_charm_feather', room: 'taper_kitchen', spot: [1, 8] },
    ],
  },
  // Chapter 2: Ves joins at the chapel, so Ves answers (only in rooms where she is along).
  pins: {
    chapter: 2,
    title: "CLIMBERS' PINS",
    count: "Climbers' pins",
    reward: { gear: 'pin_roll', gold: 80 },
    pieces: [
      { id: 'pin_rope', name: 'Rope Pin', who: 'ves', sprite: 'col_pin_rope', room: 'vigil_hollow', spot: [39, 28] },
      { id: 'pin_axe', name: 'Axe Pin', who: 'ves', sprite: 'col_pin_axe', room: 'vigil_shoulder', spot: [2, 29] },
      { id: 'pin_goat', name: 'Goat Pin', who: 'ves', sprite: 'col_pin_goat', room: 'vigil_owl_shelf', spot: [24, 13] },
      { id: 'pin_lamp', name: 'Lamp Pin', who: 'ves', sprite: 'col_pin_lamp', room: 'vigil_vane_gardens', spot: [1, 22] },
      { id: 'pin_bell', name: 'Bell Pin', who: 'ves', sprite: 'col_pin_bell', room: 'vigil_second_cairn', spot: [22, 13] },
      { id: 'pin_kettle', name: 'Kettle Pin', who: 'ves', sprite: 'col_pin_kettle', room: 'rest_gate', spot: [26, 17] },
      { id: 'pin_boot', name: 'Boot Pin', who: 'ves', sprite: 'col_pin_boot', room: 'rest_lookout', spot: [2, 13] },
      { id: 'pin_owl', name: 'Owl Pin', who: 'ves', sprite: 'col_pin_owl', room: 'vigil_lamplighters_ledge', spot: [22, 14] },
      { id: 'pin_crow', name: 'Crow Pin', who: 'ves', sprite: 'col_pin_crow', room: 'vigil_ridge', spot: [35, 31] },
    ],
  },
  // Chapter 3: Ves is missing, then on a crutch; Bramble is along from the Hollow Oak to Lasthome.
  marbles: {
    chapter: 3,
    title: 'HOLLIN MARBLES',
    count: 'Marbles',
    reward: { gear: 'marble_bag', gold: 30 },
    pieces: [
      { id: 'marble_cats_eye', name: "Cat's Eye", who: 'bramble', sprite: 'col_marble_cats_eye', room: 'pinefall_tatters', spot: [25, 16] },
      { id: 'marble_oxblood', name: 'Oxblood', who: 'bramble', sprite: 'col_marble_oxblood', room: 'pinefall_rolling', spot: [22, 2] },
      { id: 'marble_aggie', name: 'Aggie', who: 'bramble', sprite: 'col_marble_aggie', room: 'hollin_lane', spot: [31, 26] },
      { id: 'marble_swirl', name: 'Swirl', who: 'bramble', sprite: 'col_marble_swirl', room: 'hollin_lookout', spot: [11, 10] },
      { id: 'marble_clearie', name: 'Clearie', who: 'bramble', sprite: 'col_marble_clearie', room: 'hush_quiet', spot: [34, 24] },
      { id: 'marble_galaxy', name: 'Galaxy', who: 'bramble', sprite: 'col_marble_galaxy', room: 'hush_kiln', spot: [28, 18] },
      { id: 'marble_tiger', name: 'Tiger', who: 'bramble', sprite: 'col_marble_tiger', room: 'hush_sawpit', spot: [30, 2] },
      { id: 'marble_peewee', name: 'Peewee', who: 'bramble', sprite: 'col_marble_peewee', room: 'drains_outfall', spot: [1, 12] },
      { id: 'marble_steelie', name: 'Steelie', who: 'bramble', sprite: 'col_marble_steelie', room: 'marsh_heron_flats', spot: [1, 4] },
      { id: 'marble_corkscrew', name: 'Corkscrew', who: 'ves', sprite: 'col_marble_corkscrew', room: 'lasthome_square', spot: [32, 19] },
    ],
  },
  tally: {
    chapter: 4,
    title: 'TALLY TOKENS',
    count: 'Tally tokens',
    reward: { gear: 'tally_string' },
    pieces: [
      { id: 'tally_pick', name: 'Pick Token', who: 'ves', sprite: 'col_token', room: 'diggings_cart_yard', spot: [29, 13] },
      { id: 'tally_lamp', name: 'Lamp Token', who: 'ves', sprite: 'col_token', room: 'diggings_switchback', spot: [2, 13] },
      { id: 'tally_cart', name: 'Cart Token', who: 'ves', sprite: 'col_token', room: 'diggings_air_shaft', spot: [14, 4] },
      { id: 'tally_canary', name: 'Canary Token', who: 'ves', sprite: 'col_token', room: 'diggings_old_seam', spot: [36, 6] },
      { id: 'tally_candle', name: 'Candle Token', who: 'ves', sprite: 'col_token', room: 'glimmer_vug', spot: [2, 6] },
      { id: 'tally_rope', name: 'Rope Token', who: 'ves', sprite: 'col_token', room: 'glimmer_tuck', spot: [1, 6] },
      { id: 'tally_bucket', name: 'Bucket Token', who: 'ves', sprite: 'col_token', room: 'stillwater_shore', spot: [42, 12] },
      { id: 'tally_hammer', name: 'Hammer Token', who: 'ves', sprite: 'col_token', room: 'belowtown_secret_way', spot: [20, 3] },
      { id: 'tally_boot', name: 'Boot Token', who: 'ves', sprite: 'col_token', room: 'deep_crawl', spot: [14, 4] },
      { id: 'tally_whistle', name: 'Whistle Token', who: 'ves', sprite: 'col_token', room: 'deep_heros_camp', spot: [28, 5] },
    ],
  },
  glass: {
    chapter: 5,
    title: 'SEA GLASS',
    count: 'Sea glass',
    reward: { gear: 'glass_jar', gold: 100 },
    pieces: [
      { id: 'glass_green', name: 'Green Sea Glass', who: 'bramble', sprite: 'col_glass_green', room: 'gullrest_cove', spot: [31, 3] },
      { id: 'glass_blue', name: 'Blue Sea Glass', who: 'ves', sprite: 'col_glass_blue', room: 'gullrest_beach', spot: [1, 13] },
      { id: 'glass_white', name: 'White Sea Glass', who: 'bramble', sprite: 'col_glass_white', room: 'wrack_pools', spot: [6, 12] },
      { id: 'glass_amber', name: 'Amber Sea Glass', who: 'ves', sprite: 'col_glass_amber', room: 'wrack_dunes', spot: [9, 12] },
      { id: 'glass_brown', name: 'Brown Sea Glass', who: 'bramble', sprite: 'col_glass_brown', room: 'wreck_slip', spot: [30, 2] },
      { id: 'glass_frosted', name: 'Frosted Sea Glass', who: 'ves', sprite: 'col_glass_frosted', room: 'saltcombe_quay', spot: [37, 12] },
      { id: 'glass_lilac', name: 'Lilac Sea Glass', who: 'bramble', sprite: 'col_glass_lilac', room: 'lanes_hamlet', spot: [41, 8] },
      { id: 'glass_pink', name: 'Pink Sea Glass', who: 'ves', sprite: 'col_glass_pink', room: 'soundings_three_wells', spot: [3, 17] },
      { id: 'glass_black', name: 'Black Sea Glass', who: 'bramble', sprite: 'col_glass_black', room: 'isles_gannet_stack', spot: [36, 5] },
      { id: 'glass_red', name: 'Red Sea Glass', who: 'ves', sprite: 'col_glass_red', room: 'reach_first_rock', spot: [13, 4] },
    ],
  },
  flowers: {
    chapter: 6,
    title: 'PRESSED FLOWERS',
    count: 'Pressed flowers',
    reward: { gear: 'flower_book', gold: 110 },
    // Only the Ash Road is built so far: its five are placed. The other three (`later: true`) are
    // for the rooms still to come; the set can't be finished, and the reward isn't given, until
    // they are placed.
    pieces: [
      { id: 'flower_marigold', name: 'Pressed Marigold', who: 'ves', sprite: 'col_flower_marigold', room: 'ash_waystation', spot: [27, 12] },
      { id: 'flower_cornflower', name: 'Pressed Cornflower', who: 'bramble', sprite: 'col_flower_cornflower', room: 'ash_buried_road', spot: [30, 5] },
      { id: 'flower_poppy', name: 'Pressed Poppy', who: 'ves', sprite: 'col_flower_poppy', room: 'ash_cinder_field', spot: [34, 13] },
      { id: 'flower_violet', name: 'Pressed Violet', who: 'bramble', sprite: 'col_flower_violet', room: 'ash_orchard', spot: [38, 14] },
      { id: 'flower_harebell', name: 'Pressed Harebell', who: 'ves', sprite: 'col_flower_harebell', room: 'ash_tideline', spot: [1, 3] },
      { id: 'flower_foxglove', name: 'Pressed Foxglove', who: 'ves', sprite: 'col_flower_foxglove', later: true },
      { id: 'flower_clover', name: 'Pressed Clover', who: 'bramble', sprite: 'col_flower_clover', later: true },
      { id: 'flower_heather', name: 'Pressed Heather', who: 'ves', sprite: 'col_flower_heather', later: true },
    ],
  },
};

// Every piece's id, and the set it's in.
export const COLLECTION_OF = Object.fromEntries(
  Object.entries(COLLECTIONS).flatMap(([set, data]) => data.pieces.map((piece) => [piece.id, set])),
);

// Each piece is a hidden piece of gear; each set's reward is a keepsake. (Spread into GEAR.)
export const COLLECTION_GEAR = {
  ...Object.fromEntries(Object.values(COLLECTIONS).flatMap((data) => data.pieces.map((piece) => [piece.id, { name: piece.name, hidden: true }]))),
  charm_cord: { name: 'Charm Cord' },
  pin_roll: { name: 'Pin Roll' },
  marble_bag: { name: 'Bag of Marbles' },
  tally_string: { name: 'Token String' },
  glass_jar: { name: 'Jar of Sea Glass' },
  flower_book: { name: 'Book of Flowers' },
};

export const have = (id) => (HERO_STATE.gear ?? []).includes(id);

// How many of a set you have, and how many it has.
export function collectionCount(set) {
  const { pieces } = COLLECTIONS[set];
  return { got: pieces.filter((piece) => have(piece.id)).length, total: pieces.length };
}

// Whether a set is whole (and its reward earned).
export const collectionDone = (set) => {
  const { got, total } = collectionCount(set);
  return got === total;
};
