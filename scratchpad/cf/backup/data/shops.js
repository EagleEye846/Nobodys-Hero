// Shops, opened by talking to a prop with `shop: '<id>'`. The shopkeeper's
// lines live in their text file; `music` plays while the shop is open; `stock`
// is what's for sale and the price in gold: an `item` (src/data/items.js,
// bought as many times as you like), a `weapon` (src/data/weapons.js, once),
// `armor` (src/data/armor.js, once), or a `skillPoint` (a point for the skill
// tree, `limit` times per shop; see HERO_STATE.boughtSkillPoints), or `gear`
// (src/data/gear.js, once): each chapter's smith sells a Notch Charm, one more
// SPELL NOTCH for everyone (src/characters/notches.js).
//
// Every shop also buys (SELL): items for three quarters of their price, and
// weapons and armor nobody's wearing for three quarters of what a shop would charge (see
// sellValue in src/shop/shopScene.js). A weapon or armor with a `wielder`
// (Ves's umbrella parts and coats) is sold the same way, for them.
// It can only be bought once they're in the party: until then the shopkeeper
// says their [wont_fit] line instead.
//
// `keeper` is the shopkeeper's prop sprite, with the pixels of their `eyes`
// (to blink); `look` is the colours of the shop's room (see shopScene.js).
export const SHOPS = {
  ruins_shop: {
    title: 'RUINS SHOP',
    textFile: 'shops/ruins_shop.txt',
    music: 'shop',
    stock: [
      // A Notch Charm: one more spell for everyone in a fight (see notches.js).
      { gear: 'notch_ruins', price: 250 },
      { skillPoint: true, price: 500, limit: 1 },
      { item: 'trail_mix', price: 12 },
      { item: 'lantern_tea', price: 25 },
      { item: 'ember_toffee', price: 45 },
      // Candles: light the dark (and do their own thing in battle; see candles.js).
      { item: 'plain_candle', price: 30 },
      { item: 'hearth_candle', price: 55 },
      { weapon: 'duelist_blade', price: 40 },
      { weapon: 'ash_spear', price: 45 },
      { weapon: 'hunting_bow', price: 50 },
      { weapon: 'oak_staff', price: 50 },
      { weapon: 'stone_hammer', price: 60 },
      { weapon: 'spare_lantern', price: 55 },
      { weapon: 'chapel_bell', price: 80 },
      { weapon: 'old_tome', price: 90 },
      { armor: 'padded_vest', price: 35 },
      { armor: 'moth_silk_shawl', price: 55 },
      { armor: 'waxed_coat', price: 70 },
      { armor: 'candlewick_robe', price: 80 },
      { armor: 'chain_shirt', price: 95 },
    ],
  },
  // Fennick's shop in Heralds' Rest: snacks for the cold, and the mountain's gear.
  rest_stores: {
    title: 'REST STORES',
    textFile: 'shops/rest_stores.txt',
    music: 'rest',
    keeper: { sprite: 'herald_shop', eyes: [{ x: 4, y: 6 }, { x: 11, y: 6 }], eyeColor: '#b8c0d0' },
    look: {
      wall: '#6b4a30', wallLine: '#5a3a1e', shelf: '#8a5a32', shelfTop: '#b8804a',
      counter: '#7a4e2a', counterTop: '#a06a3a', counterGrain: '#5a3a1e', lantern: '#ffcc66',
    },
    stock: [
      { skillPoint: true, price: 500, limit: 2 },
      { item: 'pine_candy', price: 10 },
      { item: 'frostberry_jam', price: 22 },
      { item: 'snowmelt_tea', price: 30 },
      { item: 'hot_cocoa', price: 35 },
      { item: 'herald_honeycake', price: 48 },
      { item: 'fanfare_fudge', price: 70 },
      { item: 'rest_soup', price: 120 },
      // Candles: light the dark (and do their own thing in battle; see candles.js).
      { item: 'plain_candle', price: 35 },
      { item: 'hearth_candle', price: 60 },
      { item: 'moonbell_candle', price: 70 },
      { item: 'glow_candle', price: 85 },
      { weapon: 'herald_trumpet', price: 95 },
      { armor: 'fur_lined_hood', price: 90 },
      { armor: 'ringers_mittens', price: 110 },
      { armor: 'snow_mantle', price: 160 },
      // For Ves: umbrella parts, and things to wrap up in.
      { weapon: 'bellwire_ribs', price: 85 },
      { weapon: 'hearthwood_crook', price: 100 },
      { armor: 'goosedown_mittens', price: 75 },
      { armor: 'ember_knit_scarf', price: 80 },
      { armor: 'oilskin_greatcoat', price: 135 },
    ],
  },
  // Tilda's forge in Heralds' Rest: food off the forge's fire, the daggers
  // and gauntlets a travelling merchant traded her, and armor she riveted herself.
  rest_forge: {
    title: "TILDA'S FORGE",
    textFile: 'shops/rest_forge.txt',
    music: 'rest',
    keeper: { sprite: 'herald_smith', eyes: [{ x: 6, y: 5 }, { x: 9, y: 5 }], eyeColor: '#b08858' },
    look: {
      wall: '#3e3236', wallLine: '#30262a', shelf: '#5a3a1e', shelfTop: '#8a5a32',
      counter: '#3a3440', counterTop: '#6a6478', counterGrain: '#2a2630', lantern: '#ff9a3a',
    },
    stock: [
      { item: 'forge_loaf', price: 24 },
      { item: 'mulled_cider', price: 30 },
      { item: 'smiths_pasty', price: 52 },
      { item: 'iron_pot_stew', price: 78 },
      // Candles: light the dark (and do their own thing in battle; see candles.js).
      { item: 'hearth_candle', price: 60 },
      { item: 'ash_candle', price: 75 },
      // A Notch Charm: one more spell for everyone in a fight (see notches.js).
      { gear: 'notch_tilda', price: 400 },
      { weapon: 'glass_dagger', price: 70 },
      { weapon: 'iron_gauntlets', price: 75 },
      { armor: 'smiths_apron', price: 105 },
      { armor: 'riveted_gambeson', price: 150 },
      // For Ves: a tip for her umbrella, and a cape for the sparks.
      { weapon: 'tempered_ferrule', price: 120 },
      { armor: 'spark_proof_cape', price: 100 },
    ],
  },
  // Rimble's stall in the ice caves past the Weathervane Shelf: cave cooking,
  // and whatever climbers and the caves have left lying about, cleaned up.
  cave_goblin: {
    title: "RIMBLE'S STALL",
    textFile: 'shops/cave_goblin.txt',
    music: 'caves',
    keeper: { sprite: 'goblin_shop', eyes: [{ x: 5, y: 7 }, { x: 10, y: 7 }], eyeColor: '#5fc27a' },
    look: {
      wall: '#2e4a66', wallLine: '#243a52', shelf: '#4a6a88', shelfTop: '#9fd0e8',
      counter: '#3a4a5e', counterTop: '#7aa0bc', counterGrain: '#2a3646', lantern: '#9ff0e0',
    },
    stock: [
      { item: 'lichen_crisps', price: 32 },
      { item: 'mystery_jerky', price: 42 },
      { item: 'glowcap_skewer', price: 62 },
      { item: 'goblin_hotpot', price: 96 },
      // Candles: light the dark (and do their own thing in battle; see candles.js).
      { item: 'hearth_candle', price: 65 },
      { item: 'moonbell_candle', price: 80 },
      { item: 'glow_candle', price: 95 },
      { weapon: 'glintstone_sling', price: 140 },
      { weapon: 'golem_knuckle', price: 165 },
      { armor: 'rimemoth_shawl', price: 175 },
      { armor: 'patchwork_parka', price: 210 },
      // For Ves: a canopy of thin ice-glass panes, a caver's hood, and a cloak.
      { weapon: 'frostglass_canopy', price: 155 },
      { armor: 'cavers_hood', price: 160 },
      { armor: 'rimeweave_cloak', price: 190 },
    ],
  },
  // Hollin Stores, the abandoned village shop: nobody minds it, so you pay
  // in the honesty tin. What Mags left that keeps, two old candles, and the
  // woodcutters' bow and bark armour nobody came back for.
  hollin_stores: {
    title: 'HOLLIN STORES',
    textFile: 'shops/hollin_stores.txt',
    music: 'hollin',
    keeper: { sprite: 'honesty_tin', eyes: [], still: true },
    look: {
      wall: '#3a3430', wallLine: '#2c2824', shelf: '#4a3a2c', shelfTop: '#6e5a44',
      counter: '#4a3a2c', counterTop: '#7a6650', counterGrain: '#2e241a', lantern: '#9a8a6a',
    },
    stock: [
      { item: 'hardtack', price: 30 },
      { item: 'pickled_onions', price: 55 },
      { item: 'crock_of_honey', price: 85 },
      { item: 'mags_jam', price: 130 },
      // Candles: light the dark (and do their own thing in battle; see candles.js).
      { item: 'hearth_candle', price: 60 },
      { item: 'ash_candle', price: 75 },
      { weapon: 'pinewood_bow', price: 280 },
      { armor: 'barkplate', price: 300 },
    ],
  },
  // Nan Cinder's stall at her kiln in the Hushwood: things baked in the
  // ashes, candles for the Underroot, and a jerkin for Bramble.
  cinder_stall: {
    title: "CINDER'S KILN",
    textFile: 'shops/cinder_stall.txt',
    music: 'hushwood',
    keeper: { sprite: 'cinder', eyes: [] },
    look: {
      wall: '#2e2228', wallLine: '#22181e', shelf: '#4a3022', shelfTop: '#7a5038',
      counter: '#3a2a24', counterTop: '#5e4434', counterGrain: '#241812', lantern: '#ff8a3a',
    },
    stock: [
      { item: 'soot_bun', price: 28 },
      { item: 'ember_potato', price: 44 },
      { item: 'charcoal_toffee', price: 66 },
      { item: 'kiln_stew', price: 92 },
      // Candles: the Underroot is dark.
      { item: 'plain_candle', price: 35 },
      { item: 'hearth_candle', price: 60 },
      { item: 'ash_candle', price: 75 },
      { weapon: 'woodcutters_hatchet', price: 260 },
      { armor: 'woodcutters_flannel', price: 240 },
      // For Bramble.
      { armor: 'kiln_jerkin', price: 150 },
    ],
  },
  // Rummage's Hollow, behind a hollow trunk in the Gorge (a secret): a
  // raccoon who catches everything that falls off the mountain and sells it
  // on. The best things in the Hushwood, if you can find him.
  rummage: {
    title: "RUMMAGE'S HOLLOW",
    textFile: 'shops/rummage.txt',
    music: 'rummage',
    keeper: { sprite: 'rummage', eyes: [{ x: 3, y: 6 }, { x: 4, y: 6 }, { x: 11, y: 6 }, { x: 12, y: 6 }], eyeColor: '#2a2630' },
    look: {
      wall: '#3a2a20', wallLine: '#2c2018', shelf: '#6a4a2e', shelfTop: '#a07048',
      counter: '#4a3424', counterTop: '#7a5838', counterGrain: '#2e2016', lantern: '#ffd27a',
    },
    stock: [
      { skillPoint: true, price: 700, limit: 1 },
      { item: 'lost_lunch', price: 110 },
      { item: 'bottled_updraft', price: 120 },
      { item: 'music_box', price: 105 },
      { item: 'herald_helmet', price: 70 },
      { item: 'glow_candle', price: 95 },
      { weapon: 'sled_runner_sabre', price: 420 },
      { weapon: 'clock_hand_pike', price: 360 },
      { weapon: 'kettle_shield', price: 320 },
      { armor: 'herald_greatcoat', price: 380 },
      // For Bramble.
      { weapon: 'splitting_maul', price: 340 },
      { armor: 'oilcloth_poncho', price: 260 },
    ],
  },
  // Slowly's, in the Old Baths of the Dead City: a tortoise well over a hundred
  // years old, selling what the city left behind and what he grows.
  slowly_shop: {
    title: "SLOWLY'S",
    textFile: 'shops/slowly_shop.txt',
    music: 'lasthome',
    keeper: { sprite: 'slowly', eyes: [] },
    look: {
      wall: '#2e2a44', wallLine: '#24203a', shelf: '#4a3e5a', shelfTop: '#6a5e7e',
      counter: '#3e3450', counterTop: '#5e5470', counterGrain: '#2a2238', lantern: '#9fd0e8',
    },
    stock: [
      { item: 'dandelion_salad', price: 100 },
      { item: 'city_hardtack', price: 130 },
      { item: 'spring_water', price: 160 },
      { item: 'eel_pie', price: 125 },
      { weapon: 'cistern_maul', price: 520 },
      { weapon: 'hollow_blade', price: 560 },
    ],
  },
  // Pell's stall in Lasthome's square: a young marmot selling what the town
  // grows and catches and bakes, and Bryony's tonic.
  lasthome_market: {
    title: "PELL'S STALL",
    textFile: 'shops/lasthome_market.txt',
    music: 'lasthome',
    keeper: { sprite: 'lh_pell', eyes: [] },
    look: {
      wall: '#3a2a3e', wallLine: '#2c2030', shelf: '#5a3e2c', shelfTop: '#7e5e44',
      counter: '#4e3428', counterTop: '#7a5038', counterGrain: '#3a261c', lantern: '#ffcc66',
    },
    stock: [
      { item: 'valley_apple', price: 30 },
      { item: 'honey_oatcake', price: 80 },
      { item: 'eel_pie', price: 120 },
      { item: 'willow_tonic', price: 140 },
      { weapon: 'statue_buckler', price: 380 },
      { armor: 'mosaic_mail', price: 460 },
      { armor: 'woodsmoke_shawl', price: 340 },
    ],
  },
  // Teasel's forge in Lasthome's square: the smith whose gran melted the
  // chapel bell down into pots, and who has mended every pot since. She
  // never made a weapon till the far door was going to open: now it's the
  // old city's iron and the bell's last bronze, and candles for the dark out
  // there. Talk to her at the anvil to shop.
  lasthome_smithy: {
    title: "TEASEL'S FORGE",
    textFile: 'shops/lasthome_smithy.txt',
    music: 'lasthome',
    // The reforge's big show, once [forge_now] has been read (src/data/scenes/reforgeShows.js).
    forgeScene: 'reforge_teasel',
    keeper: { sprite: 'lh_teasel', eyes: [{ x: 6, y: 6 }, { x: 9, y: 6 }], eyeColor: '#b08858' },
    look: {
      wall: '#3e3236', wallLine: '#30262a', shelf: '#5a3a1e', shelfTop: '#8a5a32',
      counter: '#3a3440', counterTop: '#6a6478', counterGrain: '#2a2630', lantern: '#ff9a3a',
    },
    stock: [
      // Candles: the dead city's lamps all died a hundred years ago.
      { item: 'hearth_candle', price: 60 },
      { item: 'ash_candle', price: 75 },
      // A Notch Charm: one more spell for everyone in a fight (see notches.js).
      { gear: 'notch_teasel', price: 600 },
      { weapon: 'hinge_cleaver', price: 480 },
      { weapon: 'bell_bronze_gauntlets', price: 420 },
      { weapon: 'forge_lantern', price: 400 },
      { weapon: 'stokers_staff', price: 390 },
      { weapon: 'bell_shard', price: 360 },
      { armor: 'bell_bronze_breastplate', price: 520 },
      { armor: 'smiths_leathers', price: 440 },
      // For Ves: a tip for the umbrella, when she has it back, and a cape for the sparks.
      { weapon: 'iron_shod_ferrule', price: 380 },
      { armor: 'tin_lined_cape', price: 360 },
    ],
  },
  // Old Ladle's nook in the Old Drains: the cistern's hob, who has kept
  // Hollin's water sweet for fifty years for a village that isn't there.
  // What he keeps by him, candles for the dark sumps further on, and a pair
  // of waders that came down the drains (the fen's, really: a little early).
  ladle_stall: {
    title: "LADLE'S NOOK",
    textFile: 'shops/ladle_stall.txt',
    music: 'hollin',
    keeper: { sprite: 'ladle_shop', eyes: [{ x: 4, y: 9 }, { x: 5, y: 9 }, { x: 8, y: 9 }, { x: 9, y: 9 }], eyeColor: '#d0906a' },
    look: {
      wall: '#3a2a26', wallLine: '#2c201c', shelf: '#4a3a2c', shelfTop: '#6e5a44',
      counter: '#3e3438', counterTop: '#5e5460', counterGrain: '#26202a', lantern: '#9fd0e8',
    },
    stock: [
      { item: 'sweet_water', price: 32 },
      { item: 'penny_bun', price: 58 },
      { item: 'hob_porridge', price: 88 },
      { item: 'pickled_onions', price: 55 },
      // Candles: the sumps further down are dark.
      { item: 'hearth_candle', price: 60 },
      { item: 'ash_candle', price: 75 },
      { item: 'glow_candle', price: 95 },
      { armor: 'eelskin_waders', price: 330 },
    ],
  },
  // Hollis's stall on the Last Shelf, just below the summit: an old snowy
  // owl who keeps the last stall on the mountain. Hearty food for what's
  // above, a last skill point, and the best gear for the hero and Ves.
  owl_stall: {
    title: "HOLLIS'S STALL",
    textFile: 'shops/owl_stall.txt',
    music: 'vigil',
    keeper: {
      sprite: 'owl_shop',
      eyes: [{ x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 },
        { x: 10, y: 5 }, { x: 11, y: 5 }, { x: 12, y: 5 }, { x: 10, y: 6 }, { x: 11, y: 6 }, { x: 12, y: 6 }],
      eyeColor: '#f4f1ea',
    },
    look: {
      wall: '#5a6a80', wallLine: '#46566c', shelf: '#7a5a3a', shelfTop: '#b08858',
      counter: '#6a4a2e', counterTop: '#9a7048', counterGrain: '#4a3020', lantern: '#eef3fa',
    },
    stock: [
      { skillPoint: true, price: 600, limit: 1 },
      { item: 'hot_cocoa', price: 40 },
      { item: 'fanfare_fudge', price: 75 },
      { item: 'goblin_hotpot', price: 100 },
      { item: 'seed_cake', price: 130 },
      { item: 'rest_soup', price: 140 },
      { item: 'glow_candle', price: 95 },
      { weapon: 'skyiron_blade', price: 240 },
      { armor: 'owl_down_coat', price: 260 },
      // For Ves: a canopy of owl feathers, and a shawl of them.
      { weapon: 'owlfeather_canopy', price: 230 },
      { armor: 'snowfeather_shawl', price: 250 },
    ],
  },
  // Chapter 4: under the fields.
  // Marigold's lemonade stand at the edge of Sunnyside: a cheerful hare who
  // is quite sure the fields are perfectly safe. Picnic food, a hayfork and a
  // sun hat.
  marigold_stand: {
    title: "MARIGOLD'S STAND",
    textFile: 'shops/marigold_stand.txt',
    music: 'sunnyside',
    keeper: { sprite: 'bf_marigold', eyes: [] },
    look: {
      wall: '#c8a060', wallLine: '#b08848', shelf: '#e0c890', shelfTop: '#f6e6b0',
      counter: '#d8a858', counterTop: '#f4d890', counterGrain: '#b08040', lantern: '#fff2a0',
    },
    stock: [
      { item: 'lemonade', price: 70 },
      { item: 'cucumber_sandwich', price: 105 },
      { item: 'jam_tart', price: 160 },
      { weapon: 'hayfork', price: 560 },
      { armor: 'sun_hat', price: 520 },
    ],
  },
  // Pebble's stall in Belowtown's market: a shrew who sells what grows and
  // gets baked underground, a skill point, and a cloak the shrews weave.
  belowtown_market: {
    title: "PEBBLE'S STALL",
    textFile: 'shops/belowtown_market.txt',
    music: 'belowtown',
    keeper: { sprite: 'bf_shrew_stallkeeper', eyes: [] },
    look: {
      wall: '#2a3a3a', wallLine: '#1f2e2e', shelf: '#3e5048', shelfTop: '#6a8a70',
      counter: '#35403a', counterTop: '#5a7260', counterGrain: '#24302a', lantern: '#b8ff80',
    },
    stock: [
      { skillPoint: true, price: 800, limit: 1 },
      { item: 'mushroom_pasty', price: 95 },
      { item: 'glowworm_honey', price: 140 },
      { item: 'frog_toffee', price: 150 },
      // Candles: the Deep is dark.
      { item: 'hearth_candle', price: 60 },
      { item: 'glow_candle', price: 95 },
      { armor: 'mossweave_cloak', price: 640 },
    ],
  },
  // Hobnail's forge at the heat vent in Belowtown: a grumpy old mole who
  // grunts. His pick, his spare goggles, and he reforges the Fallen Star
  // (src/data/fallenStar.js) once you bring him the shard from the Diggings.
  hobnail_forge: {
    title: "HOBNAIL'S FORGE",
    textFile: 'shops/hobnail_forge.txt',
    music: 'forge',   // "Hn.": the hammer is the rhythm (src/data/music/forgeTheme.js)
    // The reforge's big show, once [forge_now] has been read (src/data/scenes/reforgeShows.js).
    forgeScene: 'reforge_hobnail',
    keeper: { sprite: 'bf_hobnail', eyes: [] },
    look: {
      wall: '#3a2a26', wallLine: '#2c201c', shelf: '#4a3022', shelfTop: '#7a5038',
      counter: '#3a3440', counterTop: '#6a6478', counterGrain: '#2a2630', lantern: '#ff7a2a',
    },
    stock: [
      // A Notch Charm: one more spell for everyone in a fight (see notches.js).
      { gear: 'notch_hobnail', price: 800 },
      { item: 'slag_bread', price: 120 },
      { item: 'ash_candle', price: 75 },
      { weapon: 'miners_pick', price: 720 },
      { armor: 'forge_goggles', price: 600 },
    ],
  },
  // Grig's pack, in the Hero's camp in the Deep: a cave cricket who walks the
  // tunnels with her whole shop on her back and sets it down wherever the
  // heroes stopped. The last stall before the root: a cake, a candle, a tonic,
  // and a hood. (Chapter 4's gold: keep it near 1.3 to 1.6 times the shops' total.)
  deep_grig: {
    title: "GRIG'S PACK",
    textFile: 'shops/deep_grig.txt',
    music: 'shop',
    keeper: { sprite: 'bf_grig', eyes: [] },
    look: {
      wall: '#1c2630', wallLine: '#141c24', shelf: '#2c3c48', shelfTop: '#4a6a78',
      counter: '#34303a', counterTop: '#5c566a', counterGrain: '#26222c', lantern: '#ffd884',
    },
    stock: [
      { item: 'cricket_cake', price: 150 },
      { item: 'cave_dew', price: 175 },
      { item: 'cricket_candle', price: 80 },
      { armor: 'feeler_hood', price: 290 },
    ],
  },

  // Chapter 5: the drowned coast.
  // The Cockle Stall in Saltcombe's market: a crab who sells what the tide
  // leaves, cooked. Bramble's snacks. (Chapter 5's gold: keep it near 1.4 times
  // the shops' total, 13,715 G.)
  cockle_stall: {
    title: 'THE COCKLE STALL',
    textFile: 'shops/cockle_stall.txt',
    music: 'saltcombe',
    keeper: { sprite: 'cf_crab_cockle', eyes: [] },
    look: {
      wall: '#2a4046', wallLine: '#1f323a', shelf: '#4a5a58', shelfTop: '#8aa8a0',
      counter: '#4a3a30', counterTop: '#8a6a4a', counterGrain: '#32261e', lantern: '#ffc864',
    },
    stock: [
      { item: 'sea_biscuit', price: 150 },
      { item: 'kelp_crisps', price: 160 },
      { item: 'winkle_skewer', price: 170 },
      { item: 'cockle_chowder', price: 185 },
      { item: 'brine_tonic', price: 5000 },
    ],
  },
  // The ghost cook's galley in the Wreck Yard (wreck_galley): forty years dead and still cooking.
  ghost_galley: {
    title: 'THE GALLEY',
    textFile: 'shops/ghost_galley.txt',
    music: 'wreckHulls',
    keeper: { sprite: 'wy_ghost_cook', eyes: [] },
    look: {
      wall: '#24363a', wallLine: '#1a2a2e', shelf: '#3e4c48', shelfTop: '#7a9a90',
      counter: '#3e3228', counterTop: '#6e5a42', counterGrain: '#2a2018', lantern: '#aaffdc',
    },
    stock: [
      { item: 'ships_hardtack', price: 155 },
      { item: 'galley_cocoa', price: 180 },
      { item: 'cooks_soup', price: 200 },
    ],
  },
  // Mrs. Wrasse's Chandlery in Saltcombe: rope, oilskin and everything else a
  // boat or a person might need. The chapter's shop gear for the hero, Ves
  // and Bramble, ship's stores, an Ash Candle, and a skill point.
  wrasse_chandlery: {
    title: "WRASSE'S CHANDLERY",
    textFile: 'shops/wrasse_chandlery.txt',
    music: 'saltcombe',
    keeper: { sprite: 'cf_wrasse', eyes: [] },
    look: {
      wall: '#3a3830', wallLine: '#2c2a24', shelf: '#5a4630', shelfTop: '#9a7a4e',
      counter: '#4a3828', counterTop: '#7e6244', counterGrain: '#2e2218', lantern: '#ffc864',
    },
    stock: [
      // Prices back to their first numbers (8,725 in all, with the ship's
      // stores in place of the Hearth and Glow Candles) since the balance
      // pass cut the coast fights' gold: you reach the town with about 4.9k and
      // leave the Soundings with about 9.2k, so this shop and the Cockle Stall
      // can't both be bought out before the Isles. The maths is in
      // chapter-5-builders-guide.md, "Chapter 5 balance pass".
      { skillPoint: true, price: 900, limit: 1 },
      { item: 'lamp_oil', price: 170 },
      { item: 'pine_tar', price: 125 },
      { item: 'ash_candle', price: 75 },
      { weapon: 'driftwood_cutlass', price: 900 },
      { weapon: 'brine_harpoon', price: 960 },
      { armor: 'oilskin_coat', price: 840 },
      { armor: 'sailcloth_vest', price: 880 },
      // For Ves: a sailcloth canopy, a hat and a belt.
      { weapon: 'sailcloth_umbrella', price: 760 },
      { armor: 'gull_feather_hat', price: 640 },
      { armor: 'rope_belt', price: 620 },
      // For Bramble: his first full set.
      { weapon: 'boat_axe', price: 700 },
      { armor: 'small_oilskin', price: 600 },
      { armor: 'sea_boots', price: 560 },
    ],
  },
  // Orla Cobb's Forge in the Beacon Isles: a grey seal smith who works with
  // the lamp oil of the biggest light. A small stock, and she reforges the
  // Fallen Star (src/data/fallenStar.js) once you bring her the shard from the
  // Wreck Yard.
  orla_forge: {
    title: "ORLA'S FORGE",
    textFile: 'shops/orla_forge.txt',
    music: 'forge',
    keeper: { sprite: 'cf_orla', eyes: [] },
    // The reforge ends out in the forge: the hero holds the sword up in the big light's shaft
    // (src/data/scenes/islesStarHeld.js), the first time only.
    forgeScene: 'isles_star_held',
    look: {
      wall: '#2a3038', wallLine: '#20262e', shelf: '#403a38', shelfTop: '#6a5e58',
      counter: '#34383e', counterTop: '#5e6874', counterGrain: '#242a30', lantern: '#ffb84a',
    },
    stock: [
      // A Notch Charm: one more spell for everyone in a fight (see notches.js).
      { gear: 'notch_orla', price: 1200 },
      // The chapter's late gold sink (4,135 in all): most of the chapter's
      // spare gold comes after the Soundings, so her prices are the highest.
      { skillPoint: true, price: 1250, limit: 1 },
      { item: 'tinder_bun', price: 160 },
      { item: 'ash_candle', price: 75 },
      // For Ves, and for Bramble.
      { weapon: 'storm_umbrella', price: 1500 },
      { weapon: 'ships_cleaver', price: 1150 },
    ],
  },
};
