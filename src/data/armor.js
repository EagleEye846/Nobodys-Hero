// Armor the hero can wear, chosen in the EQUIP menu (C in the overworld) next
// to the weapon. Descriptions live in text/items/armor.txt, one section per id.
//
// Every stat is optional (0 if left out):
//   defense  taken off every hit you take (a hit always does at least 1)
//   magic    how much stronger your spells are (0.25 = +25%): Heal Pulse heals
//            more, Lull calms more, and Rend and Starfall hit harder (by half
//            as much: 0.25 makes them +12.5%)
//   spGain   extra SP from grazing (0.2 = +20%)
// A stat can be negative: heavy armor can weigh on your magic. Armor never
// adds max HP; that only comes from levelling up.
//
// Armor with a `wielder` (a party member id, src/characters/party.js) is
// theirs alone. Its `defense` comes off hits on them and its `magic` makes
// their spells stronger, as yours do for you; it has their own stats besides
// (see MEMBER_GEAR_STATS in src/characters/equipment.js). Theirs sits a
// little under the hero's: DEF 1-2 on the mountain, 3-4 in chapter 3, 5 in 4.
export const ARMOR = {
  travel_clothes: { name: 'Travel Clothes' },
  padded_vest: { name: 'Padded Vest', defense: 1 },
  moth_silk_shawl: { name: 'Moth-Silk Shawl', magic: 0.25, spGain: 0.1 },
  waxed_coat: { name: 'Waxed Coat', defense: 2 },
  candlewick_robe: { name: 'Candlewick Robe', magic: 0.4, defense: -1 },
  chain_shirt: { name: 'Chain Shirt', defense: 3, magic: -0.2 },
  // Chapter 2: found on the Long Stair.
  climbers_jacket: { name: "Climber's Jacket", defense: 2, spGain: 0.15 },
  // Mount Vigil and Heralds' Rest.
  herald_cloak: { name: "Herald's Cloak", defense: 2, magic: 0.15 },
  fur_lined_hood: { name: 'Fur-Lined Hood', defense: 1, spGain: 0.25 },
  ringers_mittens: { name: "Ringer's Mittens", defense: 1, magic: 0.3 },
  // The Hero's own armour, carried up the mountain and left in the caves.
  vigil_mail: { name: 'Vigil Mail', defense: 4, magic: -0.3, spGain: -0.1 },
  snow_mantle: { name: 'Snow Mantle', defense: 3, magic: 0.1 },
  // Sold at Tilda's forge.
  smiths_apron: { name: "Smith's Apron", defense: 2, spGain: 0.1 },
  riveted_gambeson: { name: 'Riveted Gambeson', defense: 3, spGain: 0.1, magic: -0.1 },
  // Sold by Rimble, the goblin in the ice caves.
  rimemoth_shawl: { name: 'Rimemoth Shawl', defense: 1, magic: 0.35, spGain: 0.15 },
  // Hidden behind a false wall in the Hall of Glass.
  crystal_cuirass: { name: 'Crystal Cuirass', defense: 4, magic: 0.15 },
  patchwork_parka: { name: 'Patchwork Parka', defense: 3, spGain: 0.2 },
  // Ves's coats, scarves and mittens.
  evening_coat: { name: 'Evening Coat', wielder: 'vesper', defense: 1, magic: 0.05, shelterDef: 1 },
  ember_knit_scarf: { name: 'Ember-Knit Scarf', wielder: 'vesper', defense: 1, magic: 0.1, regen: 2 },
  // In the darkest corner of the Goblin's Grotto.
  aurora_scarf: { name: 'Aurora Scarf', wielder: 'vesper', defense: 1, magic: 0.15, regen: 2, shelterDef: 1 },
  goosedown_mittens: { name: 'Goose-Down Mittens', wielder: 'vesper', defense: 1, magic: 0.1, grazeSp: 0.15 },
  oilskin_greatcoat: { name: 'Oilskin Greatcoat', wielder: 'vesper', defense: 2, shelterDef: 2, regen: 1 },
  spark_proof_cape: { name: 'Spark-Proof Cape', wielder: 'vesper', defense: 2, magic: 0.05, shelterDef: 1, grazeSp: 0.1 },
  // Up the mountain, in chests: on the Weathervane Shelf, at the top of the
  // Gale Face, and up in the Hall of Glass.
  gale_ribbon_scarf: { name: 'Gale-Ribbon Scarf', wielder: 'vesper', defense: 1, magic: 0.15, grazeSp: 0.2, regen: 1 },
  cragwool_poncho: { name: 'Cragwool Poncho', wielder: 'vesper', defense: 2, magic: 0.05, shelterDef: 2, grazeSp: 0.1 },
  icefox_muff: { name: 'Ice-Fox Muff', wielder: 'vesper', defense: 1, magic: 0.2, regen: 3 },
  // Sold by Rimble, the goblin in the ice caves.
  cavers_hood: { name: "Caver's Hood", wielder: 'vesper', defense: 2, magic: 0.1, shelterDef: 1, grazeSp: 0.2, regen: 1 },
  rimeweave_cloak: { name: 'Rimeweave Cloak', wielder: 'vesper', defense: 2, magic: 0.15, shelterDef: 2, regen: 2 },
  // Hollis's, on the Last Shelf below the summit.
  owl_down_coat: { name: 'Owl-Down Coat', defense: 4, magic: 0.2 },
  snowfeather_shawl: { name: 'Snowfeather Shawl', wielder: 'vesper', defense: 2, magic: 0.2, shelterDef: 2, regen: 2, grazeSp: 0.15 },
  // Chapter 3, below the clouds: each beats the best of Mount Vigil in its
  // role, and they climb region by region.
  // The Pinefall.
  woodcutters_flannel: { name: "Woodcutter's Flannel", defense: 5, spGain: 0.3 },
  fallen_leaf_cloak: { name: 'Fallen-Leaf Cloak', defense: 4, magic: 0.5, spGain: 0.2 },
  barkplate: { name: 'Barkplate', defense: 6, magic: -0.1 },
  // The Lantern Marsh.
  reedwoven_coat: { name: 'Reedwoven Coat', defense: 5, magic: 0.55 },
  eelskin_waders: { name: 'Eelskin Waders', defense: 5, spGain: 0.4, magic: 0.15 },
  // The Hollow Valley.
  mosaic_mail: { name: 'Mosaic Mail', defense: 6, magic: 0.35, spGain: 0.15 },
  // Teasel's forge in Lasthome: the heaviest thing in the game so far, and
  // her own spare leathers.
  bell_bronze_breastplate: { name: 'Bell-Bronze Breastplate', defense: 6, magic: -0.1, spGain: 0.15 },
  smiths_leathers: { name: "Smith's Leathers", defense: 6, spGain: 0.3 },
  // Ves's.
  tin_lined_cape: { name: 'Tin-Lined Cape', wielder: 'vesper', defense: 4, magic: 0.1, shelterDef: 3, grazeSp: 0.3, regen: 1 },
  woodsmoke_shawl: { name: 'Woodsmoke Shawl', wielder: 'vesper', defense: 3, magic: 0.2, regen: 4, shelterDef: 2 },
  heron_down_coat: { name: 'Heron-Down Coat', wielder: 'vesper', defense: 3, magic: 0.2, shelterDef: 3, regen: 3, grazeSp: 0.15 },
  mended_coat: { name: 'Mended Evening Coat', wielder: 'vesper', defense: 4, magic: 0.25, shelterDef: 3, regen: 3, grazeSp: 0.25 },
  // In the Dead City's chests: the Old Street, the Colonnade, the Crier's Square.
  lamp_soot_shawl: { name: 'Lamp-Soot Shawl', wielder: 'vesper', defense: 3, magic: 0.3, regen: 5, shelterDef: 2 },
  herald_banner_cloak: { name: "Herald's Banner Cloak", wielder: 'vesper', defense: 4, magic: 0.25, shelterDef: 4, regen: 3, grazeSp: 0.2 },
  criers_mittens: { name: "Crier's Mittens", wielder: 'vesper', defense: 3, magic: 0.3, grazeSp: 0.35, regen: 2 },
  // The Hushwood. The hero's: up the old lookout tree, and from Rummage.
  lookouts_oilskin: { name: "Lookout's Oilskin", defense: 6, spGain: 0.25, magic: 0.1 },
  herald_greatcoat: { name: 'Fallen Herald Coat', defense: 5, magic: 0.4, spGain: 0.2 },
  // Bramble's.
  hand_me_down_flannel: { name: 'Hand-Me-Down Flannel', wielder: 'bramble', defense: 2, regen: 1 },
  kiln_jerkin: { name: 'Kiln-Leather Jerkin', wielder: 'bramble', defense: 3, magic: 0.05, regen: 2, grazeSp: 0.1 },
  acorn_cap: { name: 'Acorn Cap', wielder: 'bramble', defense: 2, magic: 0.1, grazeSp: 0.2, sneak: 0.25 },
  mas_scarf: { name: "Ma's Scarf", wielder: 'bramble', defense: 3, magic: 0.15, regen: 2, allyCalm: 3 },
  oilcloth_poncho: { name: 'Oilcloth Poncho', wielder: 'bramble', defense: 4, magic: 0.1, regen: 3, shorten: 0.1 },
  // Chapter 4, under the fields: each beats the best of chapter 3 in its
  // role. DEF climbs by one or two over the whole chapter.
  sun_hat: { name: 'Sun Hat', defense: 6, spGain: 0.45 },
  mossweave_cloak: { name: 'Mossweave Cloak', defense: 6, magic: 0.6 },
  miners_helm: { name: "Miner's Helm", defense: 8, magic: -0.1 },
  // Hobnail's spare goggles, sold at his forge.
  forge_goggles: { name: 'Goggles', defense: 7, spGain: 0.35, magic: 0.1 },
  // Grig's, the last stall before the root: a padded hood with two sewn-on feelers.
  feeler_hood: { name: 'Feeler Hood', defense: 8, spGain: 0.2, magic: 0.1 },
  olmskin_vest: { name: 'Olmskin Vest', defense: 7, magic: 0.4, spGain: 0.25 },
  // Chapter 4's secret superboss: the Pale Olm, at the bottom of Seam Nine (the scenes
  // `pudding_spared` and `pudding_beaten` give it). The best of the chapter's mixes: the Miner's Helm's
  // DEF 8, with the Mossweave Cloak's magic a little down and the Olmskin Vest's SP.
  olmglass_mantle: { name: 'Olm-Glass Mantle', defense: 8, magic: 0.5, spGain: 0.3 },
  // Ves's, chapter 4: for the Stillwater damp.
  reedweave_coat: { name: 'Reedweave Coat', wielder: 'vesper', defense: 5, magic: 0.35, shelterDef: 4, regen: 4, grazeSp: 0.3 },
  // Chapter 5, the drowned coast: each beats the best of chapter 4 in its
  // role. DEF climbs by one over the chapter (8 to 9).
  // Mrs. Wrasse's Chandlery, Saltcombe.
  oilskin_coat: { name: 'Oilskin Coat', defense: 8, magic: 0.3, spGain: 0.3 },
  sailcloth_vest: { name: 'Sailcloth Vest', defense: 7, magic: 0.2, spGain: 0.55 },
  // The Wreck Yard's secret pocket, and the Sunken Lanes' attic.
  brass_divers_plate: { name: "Brass Diver's Plate", defense: 9, magic: -0.2 },
  bellbuoy_mantle: { name: 'Bellbuoy Mantle', defense: 7, magic: 0.7, spGain: 0.2 },
  // Haddock's Light: a chest in Corrie's room. The best of the chapter.
  lightmans_coat: { name: "Lightman's Coat", defense: 9, magic: 0.5, spGain: 0.4 },
  // The Isles' tidy cave (lantern 6's): the SP one. Beats the Sailcloth Vest on every count and
  // sits beside the Lightman's Coat (less DEF and MAG, more SP).
  darned_jersey: { name: 'Darned Jersey', defense: 8, magic: 0.4, spGain: 0.55 },
  // Ves's, chapter 5 (DEF 5 to 6).
  gull_feather_hat: { name: 'Gull-Feather Hat', wielder: 'vesper', defense: 5, magic: 0.4, shelterDef: 4, regen: 4, grazeSp: 0.5 },
  // The gulls' hoard at Gullrest (early, before Saltcombe's shop): a touch more MAG
  // than the shop hat, kept under the Ugly Sou'wester from Haddock's shed.
  sea_silk_shawl: { name: 'Sea-Silk Shawl', wielder: 'vesper', defense: 5, magic: 0.45, shelterDef: 4, regen: 5, grazeSp: 0.3 },
  rope_belt: { name: 'Rope Belt', wielder: 'vesper', defense: 6, magic: 0.35, shelterDef: 5, regen: 4, grazeSp: 0.3 },
  // The Storm Reach's secret: the first Bother's locker on the reef's coral head. Over the Rope
  // Belt and the Sea-Silk Shawl, under the Ugly Sou'wester from Haddock's shed.
  petrel_scarf: { name: 'Petrel Scarf', wielder: 'vesper', defense: 6, magic: 0.45, shelterDef: 5, regen: 5, grazeSp: 0.35 },
  // Bramble's first full set (DEF 5; his best was 4).
  small_oilskin: { name: 'Small Oilskin', wielder: 'bramble', defense: 5, magic: 0.1, regen: 4, shorten: 0.1 },
  // The Fishers' Hollow, by the old boat (sunny_cliff_hollow): his first find on the coast,
  // a step under the Small Oilskin (DEF 5 over his chapter 4 best of 4).
  fishers_smock: { name: "Fisher's Smock", wielder: 'bramble', defense: 5, magic: 0.05, regen: 3, grazeSp: 0.2 },
  sea_boots: { name: 'Sea Boots', wielder: 'bramble', defense: 5, sneak: 0.3, grazeSp: 0.35, regen: 2 },
  // Haddock's Light's secret: up on the oil crates on the stair. Over the Small Oilskin (more
  // MAG, grazing, the same DEF); a different mix from the Cork Float after the chapter.
  little_gansey: { name: 'Little Gansey', wielder: 'bramble', defense: 5, magic: 0.15, regen: 4, grazeSp: 0.3, shorten: 0.1 },
  // The Fair Return's captain, beaten or talked down (the ship's cabin scenes `captain_spared` and
  // `captain_beaten` give it): the chapter's tank, and the reward for the optional ship. DEF 10, the most
  // of the chapter (one over the Lightman's Coat and the Diver's Plate, two over chapter 4's best), with
  // less MAG and SP than the Lightman's Coat (0.5, 0.4): you trade spells for standing up to things.
  captains_greatcoat: { name: "Captain's Greatcoat", defense: 10, magic: 0.3, spGain: 0.25 },
  // The Needle (reach_needle), the hardest ring climb on the coast: the old keepers' locker on its top.
  // The Lightman's Coat's DEF 9 with a little more MAG (0.6 over 0.5) and less SP (0.3 under 0.4): a different mix.
  keepers_oilskin: { name: "Keeper's Oilskin", defense: 9, magic: 0.6, spGain: 0.3 },
  // Haddock's shed (secret_haddocks_shed, open after the chapter): one for each of the three.
  // The hero's matches the Lightman's Coat on DEF with a little less MAG.
  haddocks_muffler: { name: "Haddock's Muffler", defense: 9, magic: 0.45, spGain: 0.45 },
  // Ves's: DEF stays at her chapter ceiling of 6; the gain is spells and shelter.
  ugly_sou_wester: { name: "Ugly Sou'wester", wielder: 'vesper', defense: 6, magic: 0.5, shelterDef: 5, regen: 5, grazeSp: 0.4 },
  // Bramble's: swim proper. DEF 5 as his best, the gain is grazing and staying afloat.
  cork_float: { name: 'Cork Float', wielder: 'bramble', defense: 5, grazeSp: 0.45, regen: 3, shorten: 0.15 },
  // Chapter 5, more for the two of them (Ves stays at DEF 6, Bramble goes to 6 only at the end).
  // Ves: a cape for standing in the wind (the Soundings' bell room), mitts for grazing (the
  // chandlery) and a shawl for healing (Orla's).
  bell_rope_cape: { name: 'Bell-Rope Cape', wielder: 'vesper', defense: 6, magic: 0.3, shelterDef: 6, regen: 3, grazeSp: 0.2 },
  net_menders_mitts: { name: "Net-Mender's Mitts", wielder: 'vesper', defense: 5, magic: 0.3, grazeSp: 0.6, regen: 2 },
  beacon_wick_shawl: { name: 'Beacon-Wick Shawl', wielder: 'vesper', defense: 5, magic: 0.6, shelterDef: 3, regen: 6, grazeSp: 0.25 },
  // Bramble: a sneaky duffel from the gulls' hoard, a waistcoat that calms and flinches, and a
  // greatcoat cut down for him (DEF 6, one over his best).
  beachcombers_duffel: { name: "Beachcomber's Duffel", wielder: 'bramble', defense: 5, grazeSp: 0.25, regen: 2, sneak: 0.5 },
  cabin_boys_waistcoat: { name: "Cabin Boy's Waistcoat", wielder: 'bramble', defense: 5, magic: 0.2, regen: 4, allyCalm: 5, shorten: 0.2 },
  deckhands_greatcoat: { name: "Deckhand's Greatcoat", wielder: 'bramble', defense: 6, regen: 5, grazeSp: 0.2, shorten: 0.1 },
};

// One stat of a piece of armor, 0 if it hasn't got it.
export function armorStat(id, stat) {
  return ARMOR[id]?.[stat] ?? 0;
}

// Short labels for the menus: "DEF +2", "MAG +25%", "SP +10%". Stats it
// hasn't got are left out.
export function armorLabels(id) {
  const percent = (value) => `${value > 0 ? '+' : ''}${Math.round(value * 100)}%`;
  const labels = [];
  const defense = armorStat(id, 'defense');
  const magic = armorStat(id, 'magic');
  const spGain = armorStat(id, 'spGain');
  if (defense) labels.push({ stat: 'defense', text: `DEF ${defense > 0 ? '+' : ''}${defense}`, bad: defense < 0 });
  if (magic) labels.push({ stat: 'magic', text: `MAG ${percent(magic)}`, bad: magic < 0 });
  if (spGain) labels.push({ stat: 'spGain', text: `SP ${percent(spGain)}`, bad: spGain < 0 });
  return labels;
}
