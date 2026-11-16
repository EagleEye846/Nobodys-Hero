// What putting a weapon or a piece of armor on sounds like, by what it is
// (the sounds are the equip... ones in SFX, src/audio/music.js). Every
// weapon in src/data/weapons.js and every armor in src/data/armor.js is in
// one of the lists below. Something new that isn't is guessed from its id
// (a "_coat" sounds like a coat), and failing that it gets the plain `equip`.
// Added 13 November 2026.

const WEAPON_KINDS = {
  equipSword: [
    'worn_sword', 'duelist_blade', 'skyiron_blade', 'hollow_blade', 'sled_runner_sabre', 'tidemark',
    'reedcutter', 'quartz_edge', 'deepglass_blade', 'driftwood_cutlass', 'stormglass_blade',
    'captains_cutlass',
  ],
  equipDagger: ['glass_dagger', 'reed_knife', 'bookmark'],
  equipStar: ['fallen_star'],
  equipHeavy: [
    'stone_hammer', 'golem_knuckle', 'cistern_maul', 'hinge_cleaver', 'sculptors_mallet', 'miners_pick',
    'anchor_maul', 'splitting_maul', 'capstan_maul',
  ],
  equipAxe: [
    'woodcutters_hatchet', 'grandads_hatchet', 'mas_felling_axe', 'twin_hatchets', 'heartwood_axe',
    'boat_axe', 'ships_cleaver', 'marlinspike_hatchet', 'keepers_hatchet',
  ],
  equipPole: [
    'ash_spear', 'ice_pick', 'punt_pole', 'clock_hand_pike', 'hayfork', 'ferry_pole', 'gaff_hook',
    'brine_harpoon',
  ],
  equipBow: ['hunting_bow', 'pinewood_bow'],
  equipSling: ['glintstone_sling'],
  equipStaff: ['oak_staff', 'stokers_staff', 'glass_float_staff'],
  equipLantern: ['spare_lantern', 'coldlight_lantern', 'forge_lantern'],
  equipShield: ['old_shield', 'statue_buckler', 'kettle_shield'],
  equipGauntlets: ['iron_gauntlets', 'bell_bronze_gauntlets'],
  equipBell: ['chapel_bell', 'bell_shard'],
  equipHorn: ['herald_trumpet'],
  equipBook: ['old_tome'],
  // Ves's umbrella parts, all of them.
  equipUmbrella: [
    'lamplighters_handle', 'bellwire_ribs', 'hearthwood_crook', 'weathervane_hilt', 'tempered_ferrule',
    'frostglass_canopy', 'owlfeather_canopy', 'scarlet_silk_canopy', 'bog_oak_handle', 'forum_bronze_ferrule',
    'vellum_canopy', 'fountain_brass_handle', 'iron_shod_ferrule', 'daisy_ferrule', 'prism_canopy',
    'rivet_handle', 'glowcap_canopy', 'sailcloth_umbrella', 'storm_umbrella',
    'whalebone_ribs', 'spindrift_canopy', 'lampwick_handle',
  ],
};

const ARMOR_KINDS = {
  equipCloth: [
    'travel_clothes', 'padded_vest', 'moth_silk_shawl', 'candlewick_robe', 'herald_cloak', 'snow_mantle',
    'rimemoth_shawl', 'ember_knit_scarf', 'aurora_scarf', 'spark_proof_cape', 'gale_ribbon_scarf',
    'cragwool_poncho', 'rimeweave_cloak', 'snowfeather_shawl', 'woodcutters_flannel', 'fallen_leaf_cloak',
    'reedwoven_coat', 'tin_lined_cape', 'woodsmoke_shawl', 'lamp_soot_shawl', 'herald_banner_cloak',
    'hand_me_down_flannel', 'mas_scarf', 'oilcloth_poncho', 'mossweave_cloak', 'olmskin_vest',
    'olmglass_mantle', 'reedweave_coat', 'sailcloth_vest', 'bellbuoy_mantle', 'darned_jersey',
    'sea_silk_shawl', 'petrel_scarf', 'fishers_smock', 'little_gansey', 'haddocks_muffler',
    'bell_rope_cape', 'beacon_wick_shawl', 'cabin_boys_waistcoat',
  ],
  equipCoat: [
    'waxed_coat', 'climbers_jacket', 'smiths_apron', 'riveted_gambeson', 'patchwork_parka', 'evening_coat',
    'oilskin_greatcoat', 'owl_down_coat', 'smiths_leathers', 'heron_down_coat', 'mended_coat',
    'lookouts_oilskin', 'herald_greatcoat', 'kiln_jerkin', 'oilskin_coat', 'lightmans_coat', 'small_oilskin',
    'captains_greatcoat', 'beachcombers_duffel', 'deckhands_greatcoat',
  ],
  equipMail: ['chain_shirt', 'vigil_mail', 'mosaic_mail'],
  equipPlate: ['bell_bronze_breastplate', 'brass_divers_plate'],
  equipCrystal: ['crystal_cuirass'],
  equipWood: ['barkplate'],
  equipMitts: ['ringers_mittens', 'goosedown_mittens', 'icefox_muff', 'criers_mittens', 'net_menders_mitts'],
  equipHat: [
    'fur_lined_hood', 'cavers_hood', 'acorn_cap', 'sun_hat', 'feeler_hood', 'gull_feather_hat',
    'ugly_sou_wester',
  ],
  equipHelm: ['miners_helm'],
  equipGoggles: ['forge_goggles'],
  equipBoots: ['eelskin_waders', 'sea_boots'],
  equipBelt: ['rope_belt'],
  equipCork: ['cork_float'],
};

// Guesses for something not in the lists yet, by a word in its id.
const GUESSES = [
  [/umbrella|canopy|ferrule|_handle|_ribs|_crook|_hilt|brolly/, 'equipUmbrella'],
  [/hatchet|_axe$/, 'equipAxe'],
  [/hammer|maul|mallet|knuckle|_pick$/, 'equipHeavy'],
  [/dagger|knife/, 'equipDagger'],
  [/sword|blade|sabre|cutlass|edge/, 'equipSword'],
  [/spear|pole|pike|fork|hook|harpoon/, 'equipPole'],
  [/bow$/, 'equipBow'],
  [/staff/, 'equipStaff'],
  [/lantern/, 'equipLantern'],
  [/shield|buckler/, 'equipShield'],
  [/gauntlet/, 'equipGauntlets'],
  [/bell/, 'equipBell'],
  [/mail/, 'equipMail'],
  [/plate|cuirass/, 'equipPlate'],
  [/mitten|glove|muff/, 'equipMitts'],
  [/hat$|hood|cap$/, 'equipHat'],
  [/helm/, 'equipHelm'],
  [/boot|waders/, 'equipBoots'],
  [/coat|jacket|parka|oilskin|jerkin|leathers|apron/, 'equipCoat'],
  [/shawl|scarf|cloak|cape|mantle|robe|vest|poncho|flannel|jersey|smock|clothes|gansey|muffler/, 'equipCloth'],
];

const byId = (kinds) => Object.fromEntries(Object.entries(kinds).flatMap(([sound, ids]) => ids.map((id) => [id, sound])));
const WEAPON_SOUNDS = byId(WEAPON_KINDS);
const ARMOR_SOUNDS = byId(ARMOR_KINDS);

// The sound for equipping `id` in `slot` ('weapon' or 'armor').
export function equipSound(slot, id) {
  const known = (slot === 'armor' ? ARMOR_SOUNDS : WEAPON_SOUNDS)[id];
  if (known) return known;
  return GUESSES.find(([pattern]) => pattern.test(id ?? ''))?.[1] ?? 'equip';
}

// For the checks: which ids have a sound of their own (not guessed).
export function hasOwnEquipSound(slot, id) {
  return Boolean((slot === 'armor' ? ARMOR_SOUNDS : WEAPON_SOUNDS)[id]);
}
